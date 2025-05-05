import React,{useState,useEffect,useContext} from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { $CommonServiceFn } from '../../network/Service';
import { $Service_Url } from '../../network/UrlPath';
import konsole from '../../control/Konsole';
import { SET_LOADER } from '../../Store/Actions/action';
import AlertToaster from '../../control/AlertToaster';
import { globalContext } from '../../../pages/_app';
import { isNotValidNullUndefile,getSMSNotificationPermissions,_$MSG } from '../../Reusable/ReusableCom';

const OccurrenceParalegal = (props) => {
  const {setdata,confirm}=useContext(globalContext)

  //define state----------------------------------------------------------- 
  const [subtenantId,setSubtenantId]=useState('')
  const [commMediumData,setCommMediumData]=useState('')
  const [comChannelId,setComChannelId]=useState('')
  const [emailTempData,setEmailTempData]=useState('')
  const [emailTemp, setEmailTemp] = useState('');
  const [textTempData, setTextTempData] = useState('');
  const [textTemp, setTextTemp] = useState('');
  const [isDisable, setisDisable] = useState(false)
  const [isClientPermissions, setIsClientPermissions] = useState(false);
  //define useeffect-----------------------------------------------------------
  useEffect(()=>{
    const subtenantId = sessionStorage.getItem("SubtenantId")
    setSubtenantId(subtenantId)
    getCommMediumPathfuc(subtenantId);
  },[])

  useEffect(() => {
    fetchData(props?.userId);
    konsole.log('propsprops', props?.client?.memberId)
  }, [props.userId])

  const fetchData=async(primaryId)=>{
    if(!isNotValidNullUndefile(primaryId))return;
    await getSMSNotificationPermissions(primaryId, setIsClientPermissions);
  }




  //define useeffect function------------------------------------------------------
  const getCommMediumPathfuc = (subtenantId) => {
    let dataObj = {  occurrenceId: props.occurrenceId,  isActive: true,  subtenantId: subtenantId,}
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getCommMediumPath, dataObj, async (res, error) => {
      props.dispatchloader(false);
      if (res) {
        konsole.log("getCommMediumPath", res);
        let data = res.data?.data[0];
        let commChannelId = data.commChannelId
        konsole.log('commChannelId',commChannelId)
        setCommMediumData(data)
        setComChannelId(commChannelId)
        if (commChannelId == 2) {
        getTextTemplateapifuc(data.applicableTextTempId, data.isActive, data.subtenantId);
        } else if (commChannelId == 1) {
          getEmailTemplatefun(data.applicableEmailTempId, data.isActive, data.subtenantId);
        } else if (commChannelId == 3) {
          getTextTemplateapifuc(data?.applicableTextTempId, data?.isActive, data?.subtenantId)
          getEmailTemplatefun(data.applicableTextTempId, data.isActive, data.subtenantId)
      }
    } else {
    konsole.log('getCommMediumPath',error)
      }
    });
  }

  const getEmailTemplatefun=(iempid,isActive,subtenantId)=>{
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.GetEmailTemplate + "?" + "TemplateId" + "=" + iempid + "&" + "IsActive" + "=" + isActive + "&SubtenantId" + "=" + subtenantId, '', async (res, err) => {
      if (res) {
        konsole.log("GetEmailTemplateapi", res);
        setEmailTempData(res.data.data[0]);
        setEmailTemp(res.data.data[0].templateContent);
      }
      else {
        konsole.log("GetEmailTemplateapi", err)
      }
    });
  }
  const getTextTemplateapifuc = (tempid, isactive, subid) => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getTextTemplate + "?" + "TextTemplateId" + "=" + tempid + "&" + "IsActive" + "=" + isactive + "&SubtenantId" + "=" + subid, '', async (res, err) => {
      props.dispatchloader(false);
      if (res) {
        konsole.log("getTextTemplate", res);
        setTextTempData(res.data.data[0]);
        setTextTemp(res.data.data[0].textTemplateContent);
      }
      else {
        konsole.log("getTextTemplate",err)
      }
    });
  };

  // send main and text---------------------------------------------------------
  const sendTextEmail=()=>{
    comChannelId == 3 || comChannelId == 1 ? SendEmailCommPathFunc(): comChannelId == 2 ? postSendTextPathapifunc(): null;
  }

  const SendEmailCommPathFunc = () => {
    setisDisable(true)
    let loggedUserId = sessionStorage.getItem('loggedUserId')
    let emailContentInfo=replaceFun(emailTemp)
    let dataObj = {
      emailType:emailTempData.templateType,
      emailTo: props?.emailTo,
      emailSubject: emailTempData.emailSubject,
      emailContent: emailContentInfo,
      emailFromDisplayName: commMediumData.commMediumRoles[0].fromRoleName,
      emailTemplateId: emailTempData.templateId,
      emailStatusId: 1,
      emailMappingTable: "tblUsers",
      emailMappingTablePKId:props.memberLoggesInId,
      createdBy: loggedUserId,
  };
konsole.log('dataObjdataObj',dataObj)
props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.PostEmailCom,dataObj,(res,err)=>{
      props.dispatchloader(false)
      if(res){
        konsole.log('PostEmailCom',res,comChannelId)
       if(comChannelId==1){
        // AlertToaster.success("Sent Successfully");
        cancelModalClose()
        toasterShowMsg("Registration link sent successfully","Success")
       }else if(comChannelId==3){
        postSendTextPathapifunc()
       }
      }
      else{
        konsole.log('sendPostEmailCC',err)
        setisDisable(false)
        cancelModalClose()
      }
    })
  }

  const postSendTextPathapifunc = () => {
    setisDisable(true)
    if(isClientPermissions != true){
      cancelModalClose()
      toasterShowMsg("Registration link sent successfully","Success");
      setisDisable(false)
      return;
    }

    let loggedUserId = sessionStorage.getItem('loggedUserId')
      let textContentInfo=replaceFun(textTemp)
      let dataObj = {
      smsType: textTempData.textTemplateType,
      textTo: props.textTo,
      textContent:textContentInfo,
      smsTemplateId: textTempData.textTemplateId,
      smsStatusId: 1,
      smsMappingTable: "tblUsers",
      smsMappingTablePKId: "props.memberLoggesInId",
      createdBy: loggedUserId,
  };
    

    konsole.log('postSendTextPathJson', JSON.stringify(dataObj))
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postSendTextPath, dataObj, async (response, error) => {
      props.dispatchloader(false);
      if (response) {
        konsole.log("PostEmailCom", response);
        // AlertToaster.success("Sent Successfully");
        cancelModalClose()
        toasterShowMsg("Registration link sent successfully","Success")
      } else {
        props.dispatchloader(false);
        konsole.log("errorText",error)
        setisDisable(false)
        cancelModalClose()
      }
    });
  }

  // replacefun-----------------------------------------------------------

  const replaceFun=(temp)=>{
    let subtenantName=sessionStorage.getItem('subtenantName')
    let TemplateContent = temp;
    TemplateContent=TemplateContent.replaceAll('@@SUBTENANTNAME',subtenantName)
    TemplateContent=TemplateContent.replaceAll('@@CUSTOMERNAME',props?.memberName?.toUpperCase())
    TemplateContent=TemplateContent.replaceAll('@@UNIQUELINK',props.uniqueLink)
    return TemplateContent;
  }
  // modal close----------------------------------------------------------------
  
  const cancelModalClose=()=>{
    props.handleClosePreviewModal(false)
  }

  const toasterShowMsg = (message, type) => {
    setdata({
        open: true,
        text: message,
        type: type,
    })
  }
  //konsole-----------------------------------------------------------------------

  //konsole-----------------------------------------------------------------------
  return (
   <>
    <Modal
              show={props.showpreviewmodal}
              size="lg"
              onHide={() => cancelModalClose()}
              backdrop="static"
              enforceFocus={false}
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px" }}
            >
              <Modal.Header className="text-white" closeVariant="white" closeButton>
                Preview Send {(comChannelId==1)?'Email':(comChannelId==2)?'Text':'Email & Text'}
              </Modal.Header>
              <Modal.Body className="rounded">

                <div style={{ minHeight: "60vh", maxHeight: "60vh", height: "100vh", overflowX: "none", overflowY: "scroll" }} className="border">
                  <div className="position-relative" style={{ pointerEvents: "none" }} >
                    {
                      (isNotValidNullUndefile(emailTemp)) ?
                        <>
                          <h6 className="ps-4 ms-5 mt-3">Email Template</h6>
                          <div  dangerouslySetInnerHTML={{ __html:  replaceFun(emailTemp)}}  id="emailtemplate" contentEditable="false" className="p-0 m-0" />
                        </>
                        : <></>
                    }
                    <div className="px-5 mb-2">
                      {

                        (isNotValidNullUndefile(textTemp)) ?
                          <>
                            <h6 className="mt-3">Text Template</h6>
                            {(isClientPermissions==true)?
                            <div contentEditable="false" id="templateData1" className="border p-2" style={{ padding: "10px 0 30px 0" }}>{replaceFun(textTemp)}</div>
:<> <span className='ms-5 mt-2'>{_$MSG._clientTextPermission}</span></>}
                          </>
                          : <></>
                      }
                    </div>
                  </div>
                </div>
                <div className="d-grid place-items-center p-4 gap-2">
                  <button style={{ background: "#720c20", color: "white", outline: "none", borderRadius: "5px", border: "2px solid #720C20" }} disabled={isDisable} className="p-1" onClick={() => sendTextEmail()}> 
                  Send  {(comChannelId==1)?'Email':(comChannelId==2)?'Text':'Email & Text'}
                   </button>
                  <button style={{ color: "#720c20", background: "white", border: "2px solid #720C20", borderRadius: "5px" }} className="p-1" onClick={() =>  cancelModalClose()}> Cancel</button>
                </div>
              </Modal.Body>
            </Modal>
   </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({  type: SET_LOADER,  payload: loader,}),
});
export default connect("", mapDispatchToProps)(OccurrenceParalegal);