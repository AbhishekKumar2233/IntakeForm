'use client'
import React, { useContext, useEffect, useState } from "react";
import { CustomButton } from "../Custom/CustomButton";
import usePrimaryUserId from "../Hooks/usePrimaryUserId";
import { selectApi } from "../Redux/Store/selectors";
import { useAppDispatch, useAppSelector } from "../Hooks/useRedux";
import { fetchFeedbackPriority } from "../Redux/Reducers/apiSlice";
import { CustomSelect, CustomTextarea } from "../Custom/CustomComponent";
import konsole from "../../components/control/Konsole";
import { useDispatch } from "react-redux";
import { useScreenshot } from "use-react-screenshot";
import { getApiCall, getApiCall2, postApiCall } from "../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../components/network/UrlPath";
import HelpCenter from "../../components/HelpCenter/HelpCenter";
// import { createPortal } from "react-dom";
import { globalContext } from "../../pages/_app";
import { useLoader } from "../utils/utils";
import { $postServiceFn } from "../../components/network/Service";
import { Msg } from "../../components/control/Msg";
import { demo } from "../../components/control/Constant";

export default function Feedback (props) {
    const [showModal, setShowModal] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState(0);
    const [descriptionValue, setDescriptionValue] = useState("");
    const [isHandOffCheck, setIsHandOffCheck] = useState('null')
    const [imageSrc, takeScreenshot] = useScreenshot();
    const { loggedInMemberName, loggedInMemberRoleId, loggedInUserId, roleUserId, subtenantId, userDetailOfPrimary, userLoggedInDetail } = usePrimaryUserId();
    const roleIdCheckIntakeLpoDirect = (loggedInMemberRoleId != 1 && loggedInMemberRoleId != 9 && loggedInMemberRoleId != 10) ? true : false

    const { setWarning } = useContext(globalContext);
    const { feedbackPriority } = useAppSelector(selectApi);
    const dispatch = useDispatch();

    const currentTime = new Date().toLocaleString();

    useEffect(() => {
        // if (roleUserId == 9 || roleUserId == 10 || roleUserId == 1) {
        //     setSelectedPriority(2);
        // } else {
        //     setSelectedPriority(null)
        // }
        if (!roleIdCheckIntakeLpoDirect) {
            setSelectedPriority(null)
        } else {
            setSelectedPriority(2);
        }
    }, [roleUserId, showModal]);

    useEffect(() => {
        if (loggedInMemberRoleId == 9 && isHandOffCheck == 'null') {
        //   fetchApi()
        }
    }, [loggedInMemberRoleId])

    const fetchApi = async () => {
        if(!loggedInUserId) return;
        const _resultMemberDetails = await getApiCall2("GET", $Service_Url.getUserDetailsByUserEmailId + `?UserId=${loggedInUserId}`);
        konsole.log("_resultMemberDetails", _resultMemberDetails)
        if (_resultMemberDetails == 'err') return;
        if (_resultMemberDetails?.data.length > 0) {
          const checkIsHandOff = _resultMemberDetails?.data[0].isHandOff;
          konsole.log("checkIsHandOff", checkIsHandOff);
          setIsHandOffCheck(checkIsHandOff)
        }
    }

    const handleFeedbackShow = async () => {
        if(showModal == false) {
            await takeScreenshot(document.body);
            if(!feedbackPriority?.length) dispatch(fetchFeedbackPriority());
        } else {
            resetState();
        }
        setShowModal(!showModal);
    }

    const resetState = () => {
        setSelectedPriority(0);
        setDescriptionValue("")
    }

    const isAnyErr = ( someResponse ) => {
        if(someResponse == "err") {
            setWarning('warning', 'Warning', Msg.ErrorMsg, '9999999999');
            useLoader(false);
            return true;
        }
        return false;
    }

    const handleFeedbackSubmit = async () => {
        if (descriptionValue == "") {
            setWarning('warning', 'Warning', "Feedback query cannot be blank.", '9999999999')
            return;
        }

        useLoader(true);
        const imageUploadResObj = await handleImageSubmit();
        if(isAnyErr(imageUploadResObj)) return;

        const feedbackPostRes = await postFeedback(imageUploadResObj);
        if(isAnyErr(feedbackPostRes)) return;

        // if (subtenantId == 2 || subtenantId == 742) {
            const postEmailRes = await sendFeedBackEmail(imageUploadResObj?.blob, subtenantId, feedbackPostRes);
            if(isAnyErr(postEmailRes)) return;

            const acknowledgeMailRes = await functionForAcknowledgementMail(feedbackPostRes);
            if(isAnyErr(acknowledgeMailRes)) return;
        // }

        useLoader(false);
        setWarning("successfully", "Feedback submitted successfully", "Your feedback have been submitted successfully");
        handleFeedbackShow();
    }

    const handleImageSubmit = () => {
        return new Promise(async (resolve, reject) => {
            const fileTypeId = 3; //for feedback
            const fileCategoryId = 7; //for feedback
            const fileStatusId = 2; //for feedback;
            const blob = await fetch(imageSrc).then((res) => res.blob());
            const file = new File([blob], 'FEEDBACK.jpg', { type: "image/png" });
    
            useLoader(true);
            $postServiceFn.postFileUpload(file, loggedInUserId, loggedInUserId, fileTypeId, fileCategoryId, fileStatusId, (response, errorData) => {
              konsole.log("Feedbackresposne", file, response);
              useLoader(false);
              if (response) {
                const imageUrl = response.data.data.fileURL;
                const fileId = response.data.data.fileId;
                return resolve({ imageUrl, fileId, blob });
              } else if (errorData) {
                return resolve("err");
              }
            }
            );
        })
    };

    const postFeedback = ( imageUploadResObj ) => {
        const { imageUrl, fileId, blob } = imageUploadResObj;

        let totalinuptdata = {
          userId: loggedInUserId,
          feedbackQuery: descriptionValue,
          feedbackType: "string",
          applicationURL: window.location.href,
          imageURL: imageUrl,
          fileId: fileId,
          createdBy: loggedInUserId,
          moduleTypeId: roleUserId == 9 ? '4' : '1',
          moduleTypeName: roleUserId == 9 ? 'Lpo Lite' : 'Intake Form',
          feedbackPriorityId: selectedPriority
        };
    
        konsole.log("PostData at realProperty", totalinuptdata);
        useLoader(true);
        return postApiCall("POST", $Service_Url.postFeedback, totalinuptdata)
    };

    const sendFeedBackEmail = (blob, subtenantId, res) => {
        const file = new File([blob], 'FEEDBACK.jpg', { type: "image/png" });
    
    
        let userType = loggedInMemberRoleId == 1 ? "Intake Member" : loggedInMemberRoleId == 3 ? "Paralegal" : loggedInMemberRoleId == 9 ? "LPO" : loggedInMemberRoleId == 10 ? "Direct Intake Member" : loggedInMemberRoleId == 13 ? "Attorney" : loggedInMemberRoleId == 14 ? "Legal Assistant" : loggedInMemberRoleId == 15 ? "Law Office Staff" : 'Client Name'
        let emailto = (demo == false && subtenantId == 742) ? 'TechSupport@agingoptions.com' : 'shreyasinha@agingoptions.com';
    
        let emailContent = `
        <p style="font-size: 16px; color: #333; background-color: #f5f5f5; padding: 10px; margin: 0; box-sizing: border-box;">
          <span style="display: block; padding-bottom: 10px;"><b>Ticket Number:</b> @@ticketno<br></span>
          <span style="display: block; padding-bottom: 10px;"><b>Name:</b> @@CLIENT_NAME<br></span>
          <span style="display: block; padding-bottom: 10px;"><b>Email:</b> @@CLIENT_EMAIL<br></span>
          <span style="display: block; padding-bottom: 10px;"><b>Sender Email:</b> @@SENDER_EMAIL<br></span>
          <span style="display: block; padding-bottom: 10px;"><b>Application URL:</b> @@APPLICATION_URL<br></span>
          <span style="display: block; padding-bottom: 10px;"><b>Query:</b> @@FEEDBACK_QUERY<br></span>
          ${roleIdCheckIntakeLpoDirect ? `<span style="display: block; padding-bottom: 10px;"><b>Priority:</b> @@priority<br></span>` : ''}
          <span style="display: block; padding-bottom: 10px;"><b>Time:</b> @@time</span><br>
        </p>
        <p>(<b>Note:</b> Sent from @@USERTYPE)</p>
      `;
    
    
        emailContent = emailContent.replace('@@CLIENT_NAME', userDetailOfPrimary?.memberName == undefined ? userLoggedInDetail?.memberName : userDetailOfPrimary?.memberName);
        emailContent = emailContent.replace('@@CLIENT_EMAIL', userDetailOfPrimary?.primaryEmailId == undefined ? userLoggedInDetail?.primaryEmailId : userDetailOfPrimary?.primaryEmailId);
        emailContent = emailContent.replace('@@SENDER_EMAIL', userLoggedInDetail?.primaryEmailId);
        emailContent = emailContent.replace('@@FEEDBACK_QUERY', descriptionValue);
        emailContent = emailContent.replace('@@APPLICATION_URL', window.location.href);
        if (roleIdCheckIntakeLpoDirect == true) {
            emailContent = emailContent.replace('@@priority', feedbackPriority?.find(e => e.value == selectedPriority)?.label)
        }
        emailContent = emailContent.replace('@@time', currentTime)
        emailContent = emailContent.replace('@@USERTYPE', userType)
        emailContent = emailContent.replace('@@ticketno', res?.data?.data?.feedbackId)
    
        let formdata = new FormData();
        formdata.append('File', file)
        formdata.append('EmailType', 'Client_Feedback_Details')
        formdata.append('EmailTo', emailto)
        formdata.append('EmailSubject', 'Feedback Details')
        formdata.append('EmailContent', emailContent)
        formdata.append('EmailMappingTable', 'tblMember')
        formdata.append('EmailStatusId', '1')
        // formdata.append('Emailcc',clientName?.userName)
        formdata.append('EmailMappingTablePKId', loggedInUserId)
        formdata.append('CreatedBy', loggedInUserId)
        useLoader(true);
        return postApiCall("POST", $Service_Url.sendMailFeedBack, formdata)
    }

    const functionForAcknowledgementMail = (response) => {
        let emailContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Feedback Acknowledgement | New Ticket @@ticketno</title>
          </head>
          <body>
            <p>Hi @@CLIENT_NAME,</p>
            <p>We would like to acknowledge that we have received your request and a ticket @@ticketno has been created.</p>
            <p><b>Ticket Details</b></p>
            <p>Ticket No.: @@ticketno</p>
            <p>Ticket Title: @@FEEDBACK_QUERY</p>
            <p>Rest assured, our tech support team has initiated an investigation based on your feedback.</p>
            <p>Warm regards,</p>
            <p>Tech Support Team<br>Aging Options</p>
          </body>
        </html>
    `;
    
        emailContent = emailContent.replace('@@CLIENT_NAME', userLoggedInDetail?.memberName);
        emailContent = emailContent.replace('@@FEEDBACK_QUERY', descriptionValue);
        emailContent = emailContent.replace(/@@ticketno/g, response?.data?.data?.feedbackId);
    
        const jsonObj = {
          emailType: "Client_Feedback_Details",
          emailTo: userLoggedInDetail?.userName,
          emailSubject: `Feedback Acknowledgement | New Ticket ${response?.data?.data?.feedbackId}`,
          emailContent: emailContent,
          // emailFrom: "string",
          // emailFromDisplayName: "string",
          // emailTemplateId: 0,
          emailStatusId: 1,
          emailMappingTable: "tblMember",
          emailMappingTablePKId: loggedInUserId,
          createdBy: loggedInUserId,
          // emailcc: ""
        }
        return postApiCall("POST", $Service_Url.sendPostEmailCC, jsonObj)
    }

    return (
        <div id='feedbackId' className="useNewDesignSCSS">
            <div className="openFeedbackBtn">
                <CustomButton
                    label="Feedback"
                    disabled={showModal}
                    onClick={handleFeedbackShow}
                />
            </div>

            {/* *******************HELP CENTER COMPONENT ************************ */}
            {/* {(loggedInMemberRoleId == 9 && isHandOffCheck==true) &&
            createPortal(<HelpCenter />, document.querySelector("#Feedback"))
            } */}
            {/* *******************HELP CENTER COMPONENT ************************ */}

            {showModal && <div className="feedbackModal">
                <div id="newModal" className='modals'>
                    <div className="modal" style={{ display: 'block'}}>
                        <div className="modal-dialog costumModal" style={{ maxWidth: '60%', margin: 'auto', padding: '10px' }}>
                            <div className="costumModal-content">
                                <div className="modal-header">
                                    <p className="modal-title" style={{fontSize: '20px'}}>Feedback</p>
                                    <img className='mt-0 cursor-pointer' onClick={handleFeedbackShow} src='/icons/closeIcon.svg'></img>
                                </div>
                                <div className="costumModal-body">
                                    <div className="feedbackBody">
                                        <div className="d-flex justify-content-between flex-wrap align-items-center" style={{gap: '20px'}}>
                                            <p>Name: {loggedInMemberName}</p>
                                            <p>Time: {currentTime}</p>
                                            {(roleIdCheckIntakeLpoDirect == true) && <div className="d-flex align-items-center" style={{gap: '5px'}}>
                                                <p>Priority:</p>
                                                <CustomSelect
                                                    id="Priority"
                                                    placeholder="Select priority"
                                                    tabIndex={100}
                                                    onChange={(item) => setSelectedPriority(item?.value)}
                                                    value={selectedPriority}
                                                    options={feedbackPriority}
                                                />
                                            </div>}
                                        </div>
                                        <div style={{marginTop: '20px'}}>
                                            <CustomTextarea 
                                                label="Describe"
                                                id="Describe"
                                                tabIndex={200}
                                                onChange={setDescriptionValue}
                                                value={descriptionValue}
                                            />
                                        </div>
                                        <div className="feedbackImg">
                                            <img width="100%" src={imageSrc} alt={"Screenshot"} style={{ borderRadius: "2px", margin: '10px 0' }} crossOrigin="anonymous" />
                                        </div>
                                    </div>
                                    <div className='submit-btns'>
                                        <CustomButton
                                            tabIndex={400}
                                            onClick={handleFeedbackShow}
                                            label={'Cancel'}
                                        />
                                        <CustomButton
                                            tabIndex={300}
                                            onClick={handleFeedbackSubmit}
                                            label={'Submit'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}