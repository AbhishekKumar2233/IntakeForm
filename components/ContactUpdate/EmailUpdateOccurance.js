import React, { useEffect, useState } from 'react'
import { $Service_Url } from '../network/UrlPath';
import { getApiCall, _$MSG, postApiCall, getSMSNotificationPermissions, isNotValidNullUndefile, getApiCall2 } from '../Reusable/ReusableCom';
import konsole from '../control/Konsole';
import useUserIdHook from '../Reusable/useUserIdHook';
import { Modal } from 'react-bootstrap';
import AlertToaster from '../control/AlertToaster';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from 'react-redux';

const emailTempObj = () => {
    return { emailTempData: "", emailTemp: "" }
}
const textTempObj = () => {
    return { textTempData: "", textTemp: "" }
}


const EmailUpdateOccurance = ({ dispatchloader, userUpdatedEmail, oldEmailAddress, newEmailAddress, showOccurrance, handleEmailOccurrance}) => {
    const { _subtenantId, _loggedInUserId, _primaryMemberUserId, _userLoggedInDetail, _userDetailOfPrimary, _subtenantName } = useUserIdHook();
    const occurrenceId = 34



    // @State
    const [emailObj, setEmailObj] = useState({ ...emailTempObj() });
    const [textObj, setTextObj] = useState({ ...textTempObj() });
    const [comChannelId, setConChannelId] = useState('');
    const [clientData, setClientData] = useState([]);
    const [activateLink, setActivateLink] = useState('');
    const [isClientPermissions, setIsClientPermissions] = useState(false);



    konsole.log('clientDataclientData', clientData);
    konsole.log("isClientPermissions", isClientPermissions)
    // @UseEffect Hook
    useEffect(() => {
        fetchOccurrenceData();
        fetchData();
    }, [])
    // Fun fetchData
    const fetchData = async () => {
        dispatchloader(true)
        const _resultClientData = await getApiCall2('GET', $Service_Url.getUserDetailsByUserEmailId + `?emailId=${userUpdatedEmail}`);
        konsole.log('_resultClientData', _resultClientData)
        if (_resultClientData == 'err' && _resultClientData.data.length < 0) return;
        const { signUpPlatform, id, userId } = _resultClientData?.data[0];
        setClientData(_resultClientData?.data[0])
        await getSMSNotificationPermissions(userId, setIsClientPermissions);
        const jsonUserActivation = { "userRegstrtnId": id, "userId": userId, "signUpPlatform": signUpPlatform, "createdBy": _loggedInUserId, "clientIPAddress": "::1" }
        konsole.log('jsonUserActivationjsonUserActivation', jsonUserActivation);
        const _resultGetActivationLink = await postApiCall('POST', $Service_Url.getUserActivationLink, jsonUserActivation);
        konsole.log('_resultGetActivationLink', _resultGetActivationLink);
        setActivateLink(_resultGetActivationLink?.data?.data?.activationURL);
        dispatchloader(false)

    }

    // @Fun fetchOccurrenceData
    const fetchOccurrenceData = async () => {
        if (!isNotValidNullUndefile(_subtenantId)) return;
        dispatchloader(true)
        konsole.log('email update', _subtenantId)
        let jsonObj = { occurrenceId: occurrenceId, isActive: true, subtenantId: _subtenantId, }
        //    @COMM Medium Api Call
        const _result = await postApiCall('POST', $Service_Url.getCommMediumPath, jsonObj);
        konsole.log('resilt of get commmediumpath', _result)
        if (_result == 'err' || _result?.data?.data?.length < 0) return;
        funForGetTemplate(_result)
        konsole.log('_resultGetCommMediumPath', _result)
        dispatchloader(false)

    }

    // getUserActivationLink
    // api/UserActivation/GetUserActivationLink

    const funForGetTemplate = async (_result) => {
        const { commChannelId, applicableTextTempId, applicableEmailTempId, isActive, subtenantId } = _result?.data?.data[0];
        const text_Url = $Service_Url.getTextTemplate + "?" + "TextTemplateId" + "=" + applicableTextTempId + "&" + "IsActive" + "=" + isActive + "&SubtenantId" + "=" + subtenantId;
        const email_Url = $Service_Url.GetEmailTemplate + "?" + "TemplateId" + "=" + applicableEmailTempId + "&" + "IsActive" + "=" + isActive + "&SubtenantId" + "=" + subtenantId;
        setConChannelId(commChannelId)
        dispatchloader(true)
        if (commChannelId == 2) {
            const _resultTextTemplate = await getApiCall("GET", text_Url);
            konsole.log('_resultTextTemplate', _resultTextTemplate)

        } else if (commChannelId == 1) {
            const _resultEmailTemplate = await getApiCall("GET", email_Url);
            konsole.log('_resultEmailTemplate', _resultEmailTemplate)
        } else if (commChannelId == 3) {
            const _resultEmailTemplate = await getApiCall("GET", email_Url);
            if (_resultEmailTemplate?.length > 0) {
                setEmailObj({ "emailTempData": _resultEmailTemplate, "emailTemp": _resultEmailTemplate[0].templateContent })
            }
            konsole.log('_resultEmailTemplate', _resultEmailTemplate)
            const _resultTextTemplate = await getApiCall("GET", text_Url);
            konsole.log('_resultTextTemplate', _resultTextTemplate)
            if (_resultTextTemplate?.length > 0) {
                setTextObj({ "textTempData": _resultTextTemplate, "textTemp": _resultTextTemplate[0].textTemplateContent })
            }
        }
        dispatchloader(false)
    }

    const replaceTemplate = (temp, type) => {
        let TemplateContent = temp;
        // const uniqueLink = type == 'mobile' ? 'click here' : activateLink;
        const uniqueLink = activateLink;

        TemplateContent = TemplateContent.replace("@@SUBTENANTNAME", _subtenantName);
        TemplateContent = TemplateContent.replace("@@ACTIVATE_LINK", uniqueLink);
        TemplateContent = TemplateContent.replace("@@ACTIVATE_LINK", uniqueLink);
        TemplateContent = TemplateContent.replace("@@USER", clientData?.userFullName);
        TemplateContent = TemplateContent.replace("@@OLDEMAILADDRESS", oldEmailAddress);
        TemplateContent = TemplateContent.replace("@@NEWEMAILADDRESS", newEmailAddress);

        return TemplateContent;
    }

    const createEmailJson = ({ emailContent, emailTo }) => {
        const { templateType, emailSubject, templateId } = emailObj?.emailTempData[0];
        return { emailType: templateType, emailTo, emailSubject, emailContent, emailTemplateId: templateId, emailStatusId: 1, emailMappingTable: "tblUsers", emailMappingTablePKId: _primaryMemberUserId, createdBy: _loggedInUserId };
    };
    const createTextJson = ({ textContent, textTo }) => {
        const { textTemplateType, textTemplateId } = textObj.textTempData[0]
        return {
            smsType: textTemplateType,
            textTo: textTo,
            textContent: textContent,
            smsTemplateId: textTemplateId,
            smsStatusId: 1,
            smsMappingTable: "tblUsers",
            smsMappingTablePKId: _primaryMemberUserId,
            createdBy: _loggedInUserId,
        }
    }

    const sentInvite = async () => {
        const { mobileNo, emailId } = clientData;


        const createEmailJsonData = createEmailJson({ emailContent: replaceTemplate(emailObj?.emailTemp), emailTo: emailId });
        const cretaeTextJsonData = createTextJson({ textContent: replaceTemplate(textObj?.textTemp), textTo: mobileNo })
        konsole.log('createEmailJsonData', createEmailJsonData);


        dispatchloader(true)
        if (comChannelId == 2 && isNotValidNullUndefile(mobileNo) && isClientPermissions == true) {
            const _resultTextSent = await postApiCall('POST', $Service_Url.postSendTextPath, cretaeTextJsonData);
            konsole.log("_resultTextSent", _resultTextSent)
        } else if (comChannelId == 1) {
            const _resultEmailSent = await postApiCall('POST', $Service_Url.PostEmailCom, createEmailJsonData)
            konsole.log('_resultEmailSent', _resultEmailSent)
        } else {
            const _resultEmailSent = await postApiCall('POST', $Service_Url.PostEmailCom, createEmailJsonData)
            konsole.log('_resultEmailSent', _resultEmailSent)
            if (isNotValidNullUndefile(mobileNo) && isClientPermissions == true) {
                const _resultTextSent = await postApiCall('POST', $Service_Url.postSendTextPath, cretaeTextJsonData);
                konsole.log("_resultTextSent", _resultTextSent)
            }
        }
        dispatchloader(false)
        const message = `Email ${comChannelId == 3 ? "and Text " : ''}Sent Successfully.`;
        AlertToaster.success(message);
        handleEmailOccurrance('close');
    };



    konsole.log('textTemplateContent', emailObj, textObj)




    return (
        <>
            <Modal
                show={showOccurrance}
                // show={true}
                size="lg"
                onHide={() => handleEmailOccurrance('close')}
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
                                (isNotValidNullUndefile(emailObj?.emailTemp)) ?
                                    <>
                                        <h6 className="ps-4 ms-5 mt-3">Email Template</h6>
                                        <div dangerouslySetInnerHTML={{ __html: replaceTemplate(emailObj?.emailTemp) }} id="emailtemplate" contentEditable="false" className="p-0 m-0" />
                                    </>
                                    : <></>
                            }
                            <div className="px-5 mb-2">
                                {
                                    (isNotValidNullUndefile(textObj?.textTemp)) ?
                                        <>
                                            <h6 className="mt-3">Text Template</h6>
                                            {(isClientPermissions == true) ?
                                                <div contentEditable="false" id="templateData1" className="border p-2" style={{ padding: "10px 0 30px 0" }}>
                                                    {replaceTemplate(textObj?.textTemp, 'mobile')}
                                                </div> :<> <span className='ms-5 mt-2'>{_$MSG._clientTextPermission}</span></>}
                                        </>
                                        : <></>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="d-grid place-items-center p-4 gap-2">
                        <button style={{ background: "#720c20", color: "white", outline: "none", borderRadius: "5px", border: "2px solid #720C20" }} className="p-1"
                            onClick={() => sentInvite()}
                        >
                            Send  {(comChannelId == 1) ? 'Email' : (comChannelId == 2) ? 'Text' : 'Email & Text'}
                        </button>
                        <button style={{ color: "#720c20", background: "white", border: "2px solid #720C20", borderRadius: "5px" }} className="p-1"
                            onClick={() => handleEmailOccurrance('close')}
                        > Cancel</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

// export default EmailUpdateOccurance;


const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps, mapDispatchToProps)(EmailUpdateOccurance);