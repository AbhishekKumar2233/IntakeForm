import React, { useEffect, useContext, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import konsole from '../control/Konsole';
import { SET_LOADER } from '../Store/Actions/action';
import AlertToaster from '../control/AlertToaster';
import { $CommonServiceFn } from '../network/Service';
import { $Service_Url } from '../network/UrlPath';
import { logoutUrl } from '../control/Constant';
import { isNotValidNullUndefile ,getSMSNotificationPermissions,_$MSG} from '../Reusable/ReusableCom';
const OccurrenceFileCabinet = ({reloadPage, showpreviewmodal, occurrenceId, cabinetName, documentsName, dispatchloader, setShowpreviewmodal }) => {
    //  define state------------------------------------------------------------------------


    let loggedUserId = sessionStorage.getItem('loggedUserId')
    let primaryUserId = sessionStorage.getItem('SessPrimaryUserId')
    let userLoggedInDetail = JSON.parse(sessionStorage.getItem('userLoggedInDetail'))
    let userDetailOfPrimary = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'))

    // let showpreviewmodal = false
    const [subtenantId, setSubtenantId] = useState('')
    const [commMediumData, setCommMediumData] = useState('')
    const [comChannelId, setComChannelId] = useState('')
    const [emailTempData, setEmailTempData] = useState('')
    const [emailTemp, setEmailTemp] = useState('');
    const [textTempData, setTextTempData] = useState('');
    const [textTemp, setTextTemp] = useState('');
    const [isClientPermissions, setIsClientPermissions] = useState(false);


    //  define useEffect------------------------------------------------------------------------
    useEffect(() => {
        const subtenantId = sessionStorage.getItem("SubtenantId")
        setSubtenantId(subtenantId)
        getCommMediumPathfuc(subtenantId);
    }, [])
    
 useEffect(() => {
    fetchData(primaryUserId);
  }, [])

  const fetchData=async(primaryId)=>{
    if(!isNotValidNullUndefile(primaryId))return;
    await getSMSNotificationPermissions(primaryId, setIsClientPermissions);
  }

    const getCommMediumPathfuc = (subtenantId) => {
        let dataObj = { occurrenceId: occurrenceId, isActive: true, subtenantId: subtenantId, }
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getCommMediumPath, dataObj, async (res, error) => {
            dispatchloader(false);
            if (res) {
                konsole.log("getCommMediumPath", res);
                let data = res.data?.data[0];
                let commChannelId = data.commChannelId
                konsole.log('commChannelId', commChannelId)
                setCommMediumData(data)
                setComChannelId(commChannelId)
                if (commChannelId == 2) {
                    getTextTemplateapifuc(data.applicableTextTempId, data.isActive, data.subtenantId);
                } else if (commChannelId == 1) {
                    getEmailTemplatefun(data.applicableEmailTempId, data.isActive, data.subtenantId);
                } else if (commChannelId == 3) {
                    getTextTemplateapifuc(data?.applicableTextTempId, data?.isActive, data?.subtenantId)
                    getEmailTemplatefun(data.applicableEmailTempId, data.isActive, data.subtenantId)
                }
            } else {
                konsole.log('getCommMediumPath', error)
            }
        });
    }

    const getEmailTemplatefun = (iempid, isActive, subtenantId) => {
        $CommonServiceFn.InvokeCommonApi("GET",
         $Service_Url.GetEmailTemplate + "?" + "TemplateId" + "=" + iempid + "&" + "IsActive" + "=" + isActive + "&SubtenantId" + "=" + subtenantId, '', async (res, err) => {
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
        $CommonServiceFn.InvokeCommonApi("GET", 
        $Service_Url.getTextTemplate + "?" + "TextTemplateId" + "=" + tempid + "&" + "IsActive" + "=" + isactive + "&SubtenantId" + "=" + subid, '', 
        async (res, err) => {
            dispatchloader(false);
            if (res) {
                konsole.log("getTextTemplate", res);
                setTextTempData(res.data.data[0]);
                setTextTemp(res.data.data[0].textTemplateContent);
            }
            else {
                konsole.log("getTextTemplate", err)
            }
        });
    };













    const sentEmailORText = () => {

        comChannelId == 3 || comChannelId == 1 ? SendEmailCommPathFunc(userDetailOfPrimary) : comChannelId == 2 ? postSendTextPathapifunc(userDetailOfPrimary) : null;

    }



    const SendEmailCommPathFunc = (userDetailOfPrimary) => {
        let templateinfo = replaceTemplate(emailTemp)


        let emailTo = userDetailOfPrimary?.primaryEmailId
        konsole.log('emailToemailTo', emailTo)
        let dataObj = {
            "emailType": emailTempData.templateType,
            "emailTo": emailTo,
            "emailSubject": emailTempData.emailSubject,
            "emailContent": templateinfo,
            "emailTemplateId": emailTempData.templateId,
            "emailStatusId": 1,
            "emailMappingTable": "tblUsers",
            "emailMappingTablePKId": primaryUserId,
            "createdBy": loggedUserId,
            "emailcc": userLoggedInDetail?.primaryEmailId
        }
        konsole.log('dataObjdataObj', dataObj)
        dispatchloader(true)
        $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.sendPostEmailCC, dataObj, (res, err) => {
            dispatchloader(false)
            if (res) {
                konsole.log('sendPostEmailCC', res, comChannelId)
                comChannelId == 1 ? cancelCloseModal() : comChannelId == 3 ? postSendTextPathapifunc(userDetailOfPrimary) : AlertToaster.success("Sent Successfully");
            }
            else {
                konsole.log('sendPostEmailCC', err)
                cancelCloseModal()
            }
        })
    }
    const postSendTextPathapifunc = () => {
        if(isClientPermissions != true){
            AlertToaster.success("Sent Successfully");
            cancelCloseModal();
            return;
          }
        let tempolateInfo = replaceTemplate(textTemp);
        let textTo = userDetailOfPrimary?.userMob
        konsole.log("testToUSDJSDJ", userDetailOfPrimary?.userMob)
        let dataObj = {
            smsType: textTempData.textTemplateType,
            textTo: textTo,
            textContent: tempolateInfo,
            smsTemplateId: textTempData.textTemplateId,
            smsStatusId: 1,
            smsMappingTable: "tblUsers",
            smsMappingTablePKId: primaryUserId,
            createdBy: loggedUserId,
        };

        konsole.log('postSendTextPathJson', dataObj, JSON.stringify(dataObj))
        dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postSendTextPath, dataObj, async (response, error) => {
            dispatchloader(false);
            if (response) {
                konsole.log("postSendTextPath", response);
                AlertToaster.success("Sent Successfully");
                cancelCloseModal()

            }
            else {
                cancelCloseModal()
                dispatchloader(false);
                konsole.log("errorText", error)
            }
        });
    }





    //    replace template function-------------------------------------------------------------------------------------------------------------------------
    const replaceTemplate = (temp) => {
        // @@LEGALPERSONNAME 
        // @@PARALEGALEMAIL 
        // @@CABINETNAME

        let TemplateContent = temp
        let subtenantName = sessionStorage.getItem('subtenantName')
        let universallink = `${logoutUrl}account/Signin?subtenantId=${subtenantId}`

        TemplateContent = TemplateContent.replace("@@USERNAME", userDetailOfPrimary.memberName)
        TemplateContent = TemplateContent.replaceAll("@@LEGALPERSONNAME", userLoggedInDetail?.memberName)
        TemplateContent = TemplateContent.replaceAll("@@UNIVERSALLINK", universallink)
        TemplateContent = TemplateContent.replace("@@SUBTENANTNAME", subtenantName)
        TemplateContent = TemplateContent.replace("@@CABINETNAME", cabinetName)
        TemplateContent = TemplateContent.replace("@@SUBTENANTNAME", subtenantName)
        TemplateContent = TemplateContent.replace("@@PARALEGALEMAIL", userLoggedInDetail?.primaryEmailId)

        return TemplateContent;
    }





    const cancelCloseModal = () => {
        setShowpreviewmodal(false)
        reloadPage()
        // window.location.reload()
    }


    konsole.log('emailTempemailTemp', emailTemp)
    return (
        <>
            <Modal
                show={showpreviewmodal}
                size="lg"
                onHide={() => cancelCloseModal()}
                backdrop="static"
                enforceFocus={false}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px" }}
            >
                <Modal.Header className="text-white" closeVariant="white" closeButton>
                    Preview Send {(comChannelId == 1) ? 'Email' : (comChannelId == 2) ? 'Text' : 'Email & Text'}
                </Modal.Header>
                <Modal.Body className="rounded">

                    <div style={{ minHeight: "60vh", maxHeight: "60vh", height: "100vh", overflowX: "none", overflowY: "scroll" }} className="border">
                        <div className="position-relative" style={{ pointerEvents: "none" }} >
                            {
                                (isNotValidNullUndefile(emailTemp)) ?
                                    <>
                                        <h6 className="ps-4 ms-5 mt-3">Email Template</h6>
                                        <div dangerouslySetInnerHTML={{ __html: replaceTemplate(emailTemp) }} id="emailtemplate" contentEditable="false" className="p-0 m-0" />
                                    </>
                                    : <></>
                            }
                            <div className="px-5 mb-2">
                                {
                                    (isNotValidNullUndefile(textTemp)) ?
                                        <>
                                            <h6 className="mt-3">Text Template</h6>
                                            {isClientPermissions==true? 
                                            <div contentEditable="false" id="templateData1" className="border p-2" style={{ padding: "10px 0 30px 0" }}>{replaceTemplate(textTemp)}</div>
                                        :<> <span className='ms-5 mt-2'>{_$MSG._clientTextPermission}</span></>}
                                        </>
                                        : <></>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="d-grid place-items-center p-4 gap-2">
                        <button style={{ background: "#720c20", color: "white", outline: "none", borderRadius: "5px", border: "2px solid #720C20" }} className="p-1"
                            onClick={() => sentEmailORText()}
                        >
                            Send  {(comChannelId == 1) ? 'Email' : (comChannelId == 2) ? 'Text' : 'Email & Text'}
                        </button>
                        <button style={{ color: "#720c20", background: "white", border: "2px solid #720C20", borderRadius: "5px" }} className="p-1"
                            onClick={() => cancelCloseModal()}
                        > Cancel</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader, }),
});
export default connect("", mapDispatchToProps)(OccurrenceFileCabinet);