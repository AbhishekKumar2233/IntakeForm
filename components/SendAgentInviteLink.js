import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import konsole from "./control/Konsole";
import {$AHelper} from "./control/AHelper";
import { $CommonServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import { SET_LOADER } from "./Store/Actions/action";
import AlertToaster from "./control/AlertToaster";

const SendAgentInviteLink = ({ showInviteModal, handleInviteModal, uniqueUserAgentArray,...props }) => {

    const subtenantId = sessionStorage.getItem("SubtenantId");
    const loggedUserId = sessionStorage.getItem("loggedUserId");
    const primaryUserDetail = $AHelper.getObjFromStorage("userDetailOfPrimary")
    const primaryUserId = sessionStorage.getItem('SessPrimaryUserId')
    const [uniqueUserAgentArrayLocal, setUniqueUserAgentArrayLocal] = useState([]);
    const [reRenderPage, setReRenderPage] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [commmediumdata, setcommmediumdata] = useState();
    const [emailtemp, setemailtemp] = useState();
    const [emailtempdata, setemailtempdata] = useState();
    const [texttemp, settexttemp] = useState();
    const [texttempdata, settexttempdata] = useState();
konsole.log(uniqueUserAgentArray,"uniqueUserAgentArray")
    useEffect(()=>{
        setUniqueUserAgentArrayLocal(uniqueUserAgentArray);
    },[])


    useEffect(() => {
        getCommMediumPathfuc();
    }, []);

    const getCommMediumPathfuc = () => {
        let dataobj = {
            occurrenceId: 20,
            isActive: true,
            subtenantId: subtenantId,
        };


        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getCommMediumPath, dataobj, async (res, error) => {
            props.dispatchloader(false);
            if (res) {
                let data = res.data.data[0];
                konsole.log("getCommMediumPath", res.data.data);
                setcommmediumdata(data);
                if (data.commChannelId == 1) {
                    getTextTemplateapifuc(
                        data.applicableTextTempId,
                        data.isActive,
                        data.subtenantId
                    );
                } else if (data.commChannelId == 2) {
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



    const showEmailPreview = () => {
        setShowPreviewModal(true);
    }


    const sendInvite = (userdata) => {
        konsole.log(userdata, "postaddmemberres");
        
        let dataObj = {
            "subtenantId": subtenantId,
            "linkTypeId": 2,
            "linkStatusId": 1,
            "userId": userdata.agentUserId,
            "occurrenceId": 20,
            "createdBy": loggedUserId
        }

        getAddMemberUserByUserId(userdata, dataObj);
    };

    const getAddMemberUserByUserId = (userdata, dataObj) => {
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.userGenerateLinks, dataObj, async (res, err) => {
            props.dispatchloader(false);
            if (res) {
                konsole.log(res, "postaddmemberres");
                let responsedata = res.data.data;
                // let acceptLink = `${responsedata.uniqueLinkURL}&&ACCEPT`
                // let declineLink = `${responsedata.uniqueLinkURL}&&DECLINE`
                let UniqueLink=`${responsedata.uniqueLinkURL}&&SHOW_LIST_ALL`
                SendEmailCommPathFunc(userdata, responsedata,UniqueLink);
                postSendTextPathapifunc(userdata, UniqueLink);
            }
            else {
                props.dispatchloader(false);
            }
        });
    };

    const SendEmailCommPathFunc = (userdata, responsedata,UniqueLink) => {

        let TemplateContent = emailtemp;
        TemplateContent = TemplateContent.replace("@@AGENTNAME", userdata.fullName);
        TemplateContent = TemplateContent.replace(
            "@@USERNAME",
            primaryUserDetail.memberName
        );
        TemplateContent = TemplateContent.replace(
            "@@UNIQUELINK",
            UniqueLink
        );
        TemplateContent = TemplateContent.replace(
            "@@UNIQUELINK",
            UniqueLink
        );
        // TemplateContent = TemplateContent.replace(
        //     "@@ACCPETLINK",
        //     acceptLink
        // );
        // TemplateContent = TemplateContent.replace(
        //     "@@DECLINELINK",
        //     declineLink
        // );

        konsole.log(
            TemplateContent,
            responsedata.activationLink,
            "TemplateContentemail"
        );
        konsole.log("userdataagentEmailId", userdata.agentEmailId)
        let dataObj = {
            emailType: emailtempdata.templateType,
            emailTo: userdata.agentEmailId,
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
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.PostEmailCom, dataObj, async (response, error) => {
            props.dispatchloader(false);
            if (response) {
                konsole.log("SendEmailComm", response);
                AlertToaster.success("Invitation for agent sent successfully");
            }
            else {
                props.dispatchloader(false);
            }
        });
    };

    const postSendTextPathapifunc = (userdata, UniqueLink) => {
        let TemplateContenttext = texttemp;
        TemplateContenttext = TemplateContenttext.replace(
            "@@AGENTNAME",
            userdata.fullName
        );
        TemplateContenttext = TemplateContenttext.replace(
            "@@USERNAME",
            primaryUserDetail.memberName
        );
        TemplateContenttext = TemplateContenttext.replace(
            "@@UNIQUELINK",
            UniqueLink
        );

        konsole.log(TemplateContenttext, "TemplateContenttext");

        let dataObj = {
            smsType: texttempdata.textTemplateType,
            textTo: userdata.agentMobileNo,
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

    konsole.log("uniqueUserAgentArray sss", !uniqueUserAgentArray.some((data) => data.checked === true && data.statusId === 1));


    const templatePreviewReplace=(emailtemp)=>{
        let TemplateContent=emailtemp
        for(let [index, obj] of uniqueUserAgentArrayLocal?.entries()){
            if(obj.checked === true && obj.statusId === 1){
                    konsole.log("objobj",obj)
                TemplateContent = TemplateContent?.replace("@@AGENTNAME", obj?.fullName);
                if(obj?.memberUserId == primaryUserId){
                TemplateContent = TemplateContent?.replace("@@USERNAME", primaryUserDetail?.memberName);
                }else{
                    TemplateContent = TemplateContent?.replace("@@USERNAME", primaryUserDetail?.spouseName);
                }

            }
        }
        // TemplateContent = TemplateContent?.replace("@@USERNAME", primaryUserDetail?.memberName);
        TemplateContent = TemplateContent?.replace("@@UNIQUELINK", 'CLICK HERE');

        return TemplateContent;
    }

      const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default keypress behavior for Tab and Enter keys
        }
    }
    return (
        <>
            <Modal
                show={showInviteModal}
                size="md"
                onHide={handleInviteModal}
                backdrop="static"
            >
                <Modal.Header className="text-white" closeVariant="white" closeButton>
                    Send Agent Invite
                </Modal.Header>
                <Modal.Body className=" rounded">

                    <div>
                        <h4>Please select the user you would like to send the invite.</h4>
                        <div className="my-2">
                            {
                            uniqueUserAgentArrayLocal.length > 0 && uniqueUserAgentArrayLocal.map((agent, index) => {
                                return (
                                    <>
                                        {
                                            agent.statusId === 1 ?
                                                <div className="d-flex gap-4 align-items-center">
                                                    <div>
                                                        <input className="form-check-input " type="checkbox" id="selectedUserAgent" checked={agent.checked} onChange={(e) => handleChange(e, index)} />
                                                    </div>
                                                    <div>{agent.fullName} {checkContactExist(agent)}</div>
                                                </div>
                                                :
                                                <></>
                                        }
                                    </>
                                )
                            })
                        }
                        </div>
                    </div>
                    <div className="mt-3 d-grid place-items-center">
                        <button type="submit" onClick={() => showEmailPreview()} className="theme-btn p-0" disabled={ !uniqueUserAgentArray.some((data) => data.checked === true && data.statusId === 1 )}>Preview</button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                show={showPreviewModal}
                size="lg"
                onHide={() => setShowPreviewModal(false)}
                backdrop="static"
            >
                <Modal.Header className="text-white" closeVariant="white" closeButton>
                    Preview Invite Template
                </Modal.Header>
                <Modal.Body className=" rounded">
                    <div style={{ minHeight: "50vh", maxHeight: "60vh", height: "100vh", overflowX: "none", overflowY: "scroll" }} className="border">
                        <div className="position-relative"  style={{ pointerEvents: "none" }} onKeyDown={handleKeyDown}>
                            {
                                (emailtemp !== null && emailtemp !== "") ?
                                    <>
                                        <h6 className="ps-4 ms-5 mt-3">Email Template</h6>
                                        <div dangerouslySetInnerHTML={{ __html: templatePreviewReplace(emailtemp,"EMAIL") }} id="emailtemplate" contentEditable="false" className="p-0 m-0" />
                                    </>
                                    : <></>
                            }
                            <div className="px-5 mb-2">
                                {
                                    (texttemp !== null && texttemp !== "") ?
                                        <>
                                            <h6 className="mt-3">Text Template</h6>
                                            <div contentEditable="true" id="templateData1" className="border p-2" style={{ padding: "10px 0 30px 0" }}>
                                                {templatePreviewReplace(texttemp,"TEXT")}
                                            </div>
                                        </>
                                        : <></>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="d-grid place-items-center p-4 gap-2">
                        <button style={{ background: "#720c20", color: "white", outline: "none", borderRadius: "5px", border: "2px solid #720C20" }} className="p-1" onClick={() => handleSendInviteLink()}> Send Invite</button>
                        <button style={{ color: "#720c20", background: "white", border: "2px solid #720C20", borderRadius: "5px" }} className="p-1" onClick={() => setShowPreviewModal(false)}> Cancel</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );

    function handleChange(event, index) {
        const eventChecked = event.target.checked;
        if(index >= 0){
            const localObj = uniqueUserAgentArrayLocal;
            localObj[index].checked = eventChecked;
            konsole.log("evetnvalie ", eventChecked, index, localObj);
            setUniqueUserAgentArrayLocal(localObj)
            setReRenderPage(!reRenderPage);
        }
    }

    function checkContactExist (agentUserData){
        if (agentUserData.agentEmailId == null && agentUserData.agentMobileNo == null){
            return "(Email and cell no. unavailable.)"
        }
        if (agentUserData.agentEmailId !== null && agentUserData.agentMobileNo == null) {
            return "(Cell no. unavailable)."
        }

        if (agentUserData.agentEmailId == null && agentUserData.agentMobileNo !== null) {
            return "(Email unavailable.)"
        }
    }


    function handleSendInviteLink() {
        for(let [index, obj] of uniqueUserAgentArrayLocal.entries()){
            if(obj.checked === true && obj.statusId === 1){
                sendInvite(obj);
            }
            setShowPreviewModal(false);
        }
    }

};

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({
            type: SET_LOADER,
            payload: loader,
        }),
});

export default connect("", mapDispatchToProps)(SendAgentInviteLink);
