import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, Row, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { globalContext } from '../pages/_app';
import { $AHelper } from './control/AHelper';
import AlertToaster from './control/AlertToaster';
import { logoutUrl } from './control/Constant';
import konsole from './control/Konsole';
import { $CommonServiceFn } from './network/Service';
import { $Service_Url } from './network/UrlPath';
import { SET_LOADER } from './Store/Actions/action';
import { isNullUndefine } from './Reusable/ReusableCom';

function JointAccount(props) {
    const context = useContext(globalContext)
    const [ spouseEmailId, setSpouseEmailId ] = useState("");
    const [ spouseMobileNo, setSpouseMobileNo ] = useState("");
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [commmediumdata, setcommmediumdata] = useState();
    const [emailtemp, setemailtemp] = useState();
    const [emailtempdata, setemailtempdata] = useState();
    const [texttemp, settexttemp] = useState();
    const [texttempdata, settexttempdata] = useState();
    const [templateshow,settemptaleshow]=useState(true)
    const [checkjointconditionforoccurance,setcheckjointconditionforoccurance]=useState(1)
    const [occuranceId,setoccuranceId]=useState(22)//27
    const [comChannelId,setcomChanelId]=useState(0)

    konsole.log("comChannelId",comChannelId)
    konsole.log("checkjointconditionforoccurance",checkjointconditionforoccurance)
    konsole.log("spouseMobileNospouseMobileNo",spouseMobileNo)
    // const occuranceId = 22;


    const subtenantId = sessionStorage.getItem("SubtenantId");
    const loggedUserId = sessionStorage.getItem("loggedUserId");
    const spouseUsrId = sessionStorage.getItem("spouseUserId");
    const primaryUserId = sessionStorage.getItem("SessPrimaryUserId");
    const subtenantName = sessionStorage.getItem("subtenantName");
    const primaryUserDetail = $AHelper.getObjFromStorage("userDetailOfPrimary")

    useEffect(() => {
        getCommMediumPathfuc();
    }, [occuranceId]);


    useEffect(() => {
        const spouseUsrId = sessionStorage.getItem("spouseUserId");
        setSpouseEmailId(props.spouseEmailId)
        setSpouseMobileNo(props.spouseMobileNo)
        fetchUserDetails(spouseUsrId)
    }, [props.spouseEmailId,props.spouseMobileNo]);


    const fetchUserDetails=(spouseUsrId)=>{
        if(!spouseUsrId) return;
        props.dispatchloader(true);
        konsole.log("spouseUsrId",spouseUsrId)
        $CommonServiceFn.InvokeCommonApi("GET",$Service_Url?.getUserDetailsByUserEmailId +"?UserId="+spouseUsrId,'',(response,error)=>{
            props.dispatchloader(false);
            if(response){
                konsole.log('getUserDetailsByUserEmailId',response);

                
                let responseData=response?.data[0]
                const primaryUserId = sessionStorage.getItem("SessPrimaryUserId");
                const isActive=responseData?.isActive;
                const jointAccountUserId=responseData?.jointAccountUserId;
                if(isActive==true && jointAccountUserId == primaryUserId){
                    konsole.log("responseDataww")
                    setcheckjointconditionforoccurance(2)
                    props.setcheckjointconditionforoccurance(2)
                }else if(isActive==true && jointAccountUserId !== primaryUserId){
                    konsole.log("responseDataoccurancechange")
                    setcheckjointconditionforoccurance(3)
                    props.setcheckjointconditionforoccurance(3)
                    setoccuranceId(27)
                    //message change
                }else{
                    setcheckjointconditionforoccurance(1)
                    props.setcheckjointconditionforoccurance(1)
                }
                if(responseData.length == 0){
                    setcheckjointconditionforoccurance(null)
                    props.setcheckjointconditionforoccurance(null)
                }
                konsole.log("responseData",responseData,isActive,jointAccountUserId)
            }else{
                konsole.log('getUserDetailsByUserEmailId',error)
            }
        })
        konsole.log("userIduserIduserIduserId",spouseUsrId)
    }


    const emailValidate = (typeofSave) => {

        let regexName = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!regexName.test(spouseEmailId)) {
            toasterAlert(`Please provide the primary email of ${props.maritalStatusId == 2 ? "partner" : "spouse"}.`);
            document.getElementById('spouseEmailId').focus();
            return setSpouseEmailId("");
        }
        else{
            setShowPreviewModal(true);  
        }
    }

    const getCommMediumPathfuc = () => {
        konsole.log("getCommMediumPathfuc")
        let dataobj = {
            occurrenceId: occuranceId,
            isActive: true,
            subtenantId: subtenantId,
        };


        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getCommMediumPath, dataobj, async (res, error) => {
            props.dispatchloader(false);
            if (res) {
                let data = res.data?.data[0];
                konsole.log("getCommMediumPath", res.data.data);
                settemptaleshow(true)
                setcommmediumdata(data);
                setcomChanelId(data.commChannelId )
                if (data.commChannelId == 2) {
                    getTextTemplateapifuc(
                        data.applicableTextTempId,
                        data.isActive,
                        data.subtenantId
                    );
                } else if (data.commChannelId == 1) {
                    GetEmailTemplateapifuc(
                        data.applicableEmailTempId,
                        data.isActive,
                        data.subtenantId
                    );
                } else if (data.commChannelId == 3) {
                    GetEmailTemplateapifuc(
                        data.applicableEmailTempId,
                        data.isActive,
                        data.subtenantId
                    );
                    getTextTemplateapifuc(
                        data.applicableTextTempId,
                        data.isActive,
                        data.subtenantId
                    );
                }
            }
            else {
                settemptaleshow(false)
                if(error?.data ==='Not Found'){
                    settemptaleshow(false)
                }
                
                props.dispatchloader(false);
            }
        });
    };

    const GetEmailTemplateapifuc = (tempid, isactive, subid) => {
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.GetEmailTemplate + "?" + "TemplateId" + "=" + tempid + "&" + "IsActive" + "=" + isactive + "&SubtenantId" + "=" + subid, '', async (res, err) => {
            props.dispatchloader(false);
            if (res) {
                konsole.log("GetEmailTemplateapi", res.data.data);
                setemailtempdata(res.data.data[0]);
                setemailtemp(res.data.data[0].templateContent);
            }
            else {
                konsole.log("GetEmailTemplateapi",err)
                props.dispatchloader(false);
            }
        });
    };

    const getTextTemplateapifuc = (tempid, isactive, subid) => {

        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getTextTemplate + "?" + "TextTemplateId" + "=" + tempid + "&" + "IsActive" + "=" + isactive + "&SubtenantId" + "=" + subid, '', async (res, err) => {
            props.dispatchloader(false);
            if (res) {
                konsole.log("GettextTemplateapiresponse", res);
                settexttempdata(res.data.data[0]);
                settexttemp(res.data.data[0].textTemplateContent);
            }
            else {
                props.dispatchloader(false);
            }
        });
    };


    const toasterAlert =(test, type) =>{
    context.setdata($AHelper.toasterValueFucntion(true, test, "Warning"))
  }


    const sendInvite = (userdata) => {
        konsole.log(userdata, "postaddmemberres");

        let dataObj = {
            primaryUserId: primaryUserId,
            secondaryUserId: spouseUsrId,
            roleId: sessionStorage.getItem("roleUserId"),
            isJointAccount: true,
            subtenantId: subtenantId,
            signUpPlatform: 11,
            isActive: false,
            createdBy: loggedUserId
        }
        getJointAccountLinkService(dataObj);
    };

    const getJointAccountLinkService = (dataObj) => {
        props.dispatchloader(true);
        konsole.log("joint acount link", dataObj);
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getJointAccountLink, JSON.stringify(dataObj), async (res, err) => {
            if (res) {
                props.dispatchloader(false);
                konsole.log(res, "postaddmemberres");
                let responsedata = res.data.data;

                if(isNullUndefine(responsedata?.activationLink)){
                    toasterAlert(`The sent invite link is under maintenance. please try after sometime, if still issue persist, please use the feedback button to share the error details.`);
                    return;
                }
              
                konsole.log("occuranceIdoccuranceId",spouseMobileNo,occuranceId)
                // if(spouseMobileNo !==null && spouseMobileNo !==undefined && spouseMobileNo !=='' && occuranceId==27){

                //     postSendTextPathapifunc(responsedata);
                // }
                if(comChannelId==2 && spouseMobileNo !==null && spouseMobileNo !==undefined && spouseMobileNo !==''){
                    postSendTextPathapifunc(responsedata);
                }else if(comChannelId==1){
                    SendEmailCommPathFunc(responsedata);
                }else if(comChannelId==3){
                    SendEmailCommPathFunc(responsedata);
                    if(spouseMobileNo !==null && spouseMobileNo !==undefined && spouseMobileNo !==''){
                        postSendTextPathapifunc(responsedata);
                    }
                }
            }
            else if (err) {
                props.dispatchloader(false);
                konsole.log("imagepngimagepngimagepng",err)
                if (err.data?.errorFlag === "USER_ALREADY_ACTIVATED") {
                    toasterAlert("Spouse/Partner has already activated the account.", "Warning");
                }
                else if (err.data?.errorFlag === "EMAIL_NOT_AVAILABLE") {
                    toasterAlert("Spouse/partner email is not available.", "Warning");
                }
                else if (err.data?.errorFlag === "USER_ALREADY_ASSOCIATED_WITH_US") {
                    toasterAlert(err.data?.messages[0], "Warning");
                }
            }
        });
    };

    const SendEmailCommPathFunc = ( responsedata ) => {

        let TemplateContent = emailtemp;
        // TemplateContent = TemplateContent.replace("@@AGENTNAME", userdata.fullName);
        TemplateContent = TemplateContent?.replace(
            "@@USERNAME",
            primaryUserDetail.memberName
        );
        TemplateContent = TemplateContent?.replace(
            "@@SPOUSENAME",
            primaryUserDetail.spouseName
        );
        TemplateContent = TemplateContent?.replace(
            "@@ACCPETLINK",
            responsedata.activationLink
        );
        TemplateContent = TemplateContent?.replace(
            "@@UNIQUELINK",`${logoutUrl}account/Signin?subtenantId=${subtenantId}`
               );
        TemplateContent = TemplateContent?.replace(
            "@@SUBTENANTNAME",subtenantName
        );


        let dataObj = {
            emailType: emailtempdata.templateType,
            emailTo: spouseEmailId,
            emailSubject: emailtempdata.emailSubject,
            emailContent: TemplateContent,
            // "emailFrom": commmediumdata.commMediumRoles[0].fromRoleId,
            emailFromDisplayName: commmediumdata.commMediumRoles[0].fromRoleName,
            emailTemplateId: emailtempdata.templateId,
            emailStatusId: 1,
            emailMappingTable: "string",
            emailMappingTablePKId: "string",
            createdBy: loggedUserId,
        };
        props.dispatchloader(true);
        return $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.PostEmailCom, dataObj, async (response, error) => {
            props.dispatchloader(false);
            if (response) {
                konsole.log("SendEmailComm", response);
                AlertToaster.success("Invitation sent successfully");
                setShowPreviewModal(false);
            }
            else if(error) {
                props.dispatchloader(false);
            }
        });
    };

    const postSendTextPathapifunc = (responsedata) => {
        konsole.log("texttemptexttemp",texttemp)
        let TemplateContenttext = texttemp;
        konsole.log("TemplateContenttext", TemplateContenttext)

    
        TemplateContenttext = TemplateContenttext?.replace(
            "@@SPOUSENAME",
            primaryUserDetail?.spouseName
        );
        TemplateContenttext = TemplateContenttext?.replace(
            "@@USERNAME",
            primaryUserDetail?.memberName
        );
        TemplateContenttext = TemplateContenttext?.replace(
            "@@UNIQUELINK",`${logoutUrl}account/Signin?subtenantId=${subtenantId}`
        );
        TemplateContenttext = TemplateContenttext?.replace(
            "@@ACCPETLINK",
            responsedata.activationLink
        );
        TemplateContenttext = TemplateContenttext?.replace(
            "@@UNIQUELINK",`${logoutUrl}account/Signin?subtenantId=${subtenantId}`
               );
               TemplateContenttext = TemplateContenttext?.replace(
            "@@SUBTENANTNAME",subtenantName
        );


        
        konsole.log(TemplateContenttext, "TemplateContenttext",responsedata,primaryUserDetail);

        let dataObj = {
            smsType: texttempdata.textTemplateType,
            textTo: spouseMobileNo,
            textContent: TemplateContenttext,
            smsTemplateId: texttempdata.textTemplateId,
            smsStatusId: 1,
            smsMappingTable: "string",
            smsMappingTablePKId: "string",
            createdBy: loggedUserId,
        };
        // konsole.log(dataObj,"dataObj")


        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postSendTextPath, dataObj, async (response, error) => {
            props.dispatchloader(false);
            if (response) {
                konsole.log("postSendTextPath", response);
            }
            else {
                props.dispatchloader(false);
            }
        });
    };


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default keypress behavior for Tab and Enter keys
        }
    }

    const replacetemplateforShow=(emailtemp)=>{
        let TemplateContent = emailtemp;
        // TemplateContent = TemplateContent.replace("@@AGENTNAME", userdata.fullName);
        TemplateContent = TemplateContent?.replace("@@USERNAME",primaryUserDetail?.memberName );
        TemplateContent = TemplateContent?.replace("@@SPOUSENAME", primaryUserDetail?.spouseName);
        TemplateContent = TemplateContent?.replace( "@@UNIQUELINK",`${logoutUrl}account/Signin?subtenantId=${subtenantId}`);
        TemplateContent = TemplateContent?.replace("@@SUBTENANTNAME",subtenantName );
        TemplateContent = TemplateContent?.replace("@@ACCPETLINK",'CLICK HERE');
        

        return TemplateContent;
    }
    konsole.log("texttempdatatexttempdatatexttempdata",JSON.stringify(texttempdata))

  return (
        <>
         {(checkjointconditionforoccurance == 2) ? null :
        <>
          <div className='d-flex align-items-center gap-2 mb-1'>
              <label className='p-0 m-0'>{`Enter email to invite ${props.maritalStatusId == 2 ? "partner" : "spouse"} to set up access to the Portal.`}</label> 
              <OverlayTrigger placement="left" overlay={<Tooltip id="">You only need to provide your spouse's or partner's email if you wish to allow the spouse or partner to use {props?.gender == 1 ? 'his' : 'her'} own email and password, distinct from yours.</Tooltip>} >
                  <span className="d-inline-block headerSpan bg-white mt-1">
                    <img src='/icons/info.svg' style={{width: '25px'}} className="p-0 m-0"/>
                  </span>
              </OverlayTrigger>
          </div>
          <Row className='d-flex align-items-center'>
              <Col xs="6" sm="6" lg="8">
                <Form.Control
                    value={spouseEmailId}
                    onChange={(e) => (setSpouseEmailId(e.target.value))}
                    name="spouseEmailId"
                    placeholder= {`${props.maritalStatusId == 2 ? "Partner" : "Spouse"} email is not available`}
                    id='spouseEmailId'
                    type="email"
                    disabled
                />
            </Col>
            <Col xs="6" sm="6" lg="4">
                <button className="theme-btn py-0" onClick={() =>{(templateshow==true)?emailValidate("email"):toasterAlert("The email template is not available Please contact the administrator to send an invite.")} }> Send Invite </button>
                
            </Col>
          </Row>
          </>}
          {
              createPortal(<h1>
                  <Modal
                      show={showPreviewModal}
                      size="lg"
                      onHide={() => setShowPreviewModal(false)}
                      backdrop="static"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px" }}
                  >
                      <Modal.Header className="text-white" closeVariant="white" closeButton>
                          Preview Invite Template
                      </Modal.Header>
                      <Modal.Body className="rounded">
                          <div style={{ minHeight: "50vh", maxHeight: "60vh", height: "100vh", overflowX: "none", overflowY: "scroll" }} className="border">
                              <div className="position-relative" style={{ pointerEvents: "none" }} onKeyDown={handleKeyDown}> 
                                  {/* <div className="position-absolute w-100 h-100" style={{ zIndex: 299 }} > */}
                                  {/* </div> */}
                                  {/* {
                                      (emailtemp !== null && emailtemp !== "") ?
                                          <>
                                              <h6 className="ps-4 ms-5 mt-3">Email Template</h6>
                                              <div dangerouslySetInnerHTML={{ __html: emailtemp }} id="emailtemplate" contentEditable="true" className="p-0 m-0" />
                                          </>
                                          : <></>
                                  } */}
                                 
                                  {
                                      (emailtemp !== null && emailtemp !== "") ?
                                          <>
                                              <h6 className="ps-4 ms-5 mt-3">Email Template</h6>
                                              <div dangerouslySetInnerHTML={{ __html:replacetemplateforShow(emailtemp,"EMAIL")}} id="emailtemplate" contentEditable="false" className="p-0 m-0" />
                                          </>
                                          : <></>
                                  }
                                  <div className="px-5 mb-2">
                              {
                                  (texttemp !== null && texttemp !== "") ?
                                      <>
                                          <h6 className="mt-3">Text Template</h6>
                                          <div contentEditable="false" id="templateData1" className="border p-2" style={{ padding: "10px 0 30px 0" }}>
                                              {replacetemplateforShow(texttemp,"TEXT")}
                                          </div>
                                      </>
                                      : <></>
                              }
                          </div>
                              </div>
                          </div>
                          <div className="d-grid place-items-center p-4 gap-2">
                              <button style={{ background: "#720c20", color: "white", outline: "none", borderRadius: "5px", border: "2px solid #720C20" }} className="p-1" onClick={() => sendInvite()}> Send Invite </button>
                              <button style={{ color: "#720c20", background: "white", border: "2px solid #720C20", borderRadius: "5px" }} className="p-1" onClick={() => setShowPreviewModal(false)}> Cancel</button>
                          </div>
                      </Modal.Body>
                  </Modal>
              </h1>, document.querySelector("#previewEmail"))
          }
        </>
  )
}

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({
            type: SET_LOADER,
            payload: loader,
        }),
});

export default connect("", mapDispatchToProps)(JointAccount);