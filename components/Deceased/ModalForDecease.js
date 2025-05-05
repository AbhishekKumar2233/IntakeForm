import React, { useEffect, useState } from 'react'
import { Modal, } from "react-bootstrap";
import { postApiCall, deceaseMemberStatusId, isNotValidNullUndefile, livingMemberStatusId } from '../Reusable/ReusableCom';
import { $Service_Url } from '../network/UrlPath';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from 'react-redux';
import konsole from '../control/Konsole';
import AlertToaster from '../control/AlertToaster';
import { $AHelper } from '../control/AHelper';
import { demo } from '../control/Constant';

//  *************************************_______COMMON_CONTENT_______******************************************************************

const _msgConfirmation = "These changes should be incorporated into your legal documents. Would you like to notify your legal counsel of this update?";
const _msgConfirmationSpouse = "We are sorry to learn about {{CHILD_NAME}}'s passing. It appears that {{CHILD_NAME}} has been named in a fiduciary/beneficiary capacity in different legal documents.  Please contact your legal counsel to update your documents and then update the agent assignment portion of this Portal.  You can contact your legal counsel here.";
const _textAreaDefaultVal = 'Client ({{CLINT_NAME}}) has made a change to {{GENDER_STATUS}} information form by indicating that {{CHILD_NAME}} {{RELATIONSHIPWITH_PRIMARY}} {{CHILD_DECEASE_SPECIAL_NEED}}.Please contact {{CLINT_NAME}} to review this issue.  Phone number is {{PRIMARY_MOBILE}}, email is {{PRIMARY_EMAIL}}.'
const _understandMsg = "Please understand that making the change in this organizer will have no impact on the legal documents that may affect your estate plan. We encourage you to update your legal documents to reflect this new reality. Please click below to acknowledge that you understand the importance of this matter."
const _deceasedEmail = "{{CLINT_NAME}}  has updated {{GENDER_STATUS}} information form, stating that {{CHILD_NAME}} {{RELATIONSHIPWITH_PRIMARY}} has passed away. Please reach out to {{CLINT_NAME}} for further review of this matter. The client's phone number is {{PRIMARY_MOBILE}}, and email address is {{PRIMARY_EMAIL}}."
const _specialNeedEmal = "{{CLINT_NAME}} has updated {{GENDER_STATUS}} information form, indicating that {{CHILD_NAME}} {{RELATIONSHIPWITH_PRIMARY}} has special needs. Please contact {{CLINT_NAME}} to review this matter. The client's phone number is  {{PRIMARY_MOBILE}}, and {{GENDER_STATUS}} email is {{PRIMARY_EMAIL}}."

const _bodyShowAction = ['Warning', 'Email Preview', 'Understand']
const ModalForDecease = ({ dispatchloader, isModalOpen, handleCloseModalWithoutId, handleModalOpenCloseWithId, childName, selectMemberStatusId, refrencePage, genderId, memberStatusIdforTestRef }) => {

    const loggedInUserId = sessionStorage.getItem('loggedUserId')
    const subtenantId = sessionStorage.getItem('SubtenantId')
    const primaryMemberDetails = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'))
    const [isHandleWarningUnderstantNEmail, setIsHandleWarningUnderstantNEmail] = useState(_bodyShowAction[0])
    const [textAreaValue, setTextAreaValue] = useState('')
    const [_msgConfirmationForSpouse, setMsgConfirmationForSpouse] = useState('')
    konsole.log('primaryMemberDetailsprimaryMemberDetails', primaryMemberDetails)


    //  *************************************_______useEffect_______******************************************************************
    useEffect(() => {
        funForUpdateEmailTemplate()
    }, [])

    //  *************************************_______Update Email Content_______********************************************************************************
    const numberFormate = (number) => {
        if (!isNotValidNullUndefile(number)) {
            return '-'
        }
        const lastTenDigitArray = array => array?.slice(-10);
        return $AHelper?.convertToUSFormat(lastTenDigitArray(number), "1")
    }
    const funForUpdateEmailTemplate = () => {
        const relationName = (refrencePage == 'spouseComponent' ? 'spouse' : 'child')
        // const genderStatus = (relationName == 'spouse') ? 'his': (genderId == 1) ? 'his' : (genderId == 2) ? 'her' : (genderId == 3) ? 'their' : 'his/her';
        const genderStatus = (genderId == 1) ? 'his' : (genderId == 2) ? 'her' : (genderId == 3) ? 'own' : 'his/her';
        console.log("genderStatusgenderStatus", genderStatus)
        // died / is special needs
        // const _member_Status = selectMemberStatusId == deceaseMemberStatusId ? 'died' : 'is special needs'
        const primaryMember = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'))
        const emailTemp = selectMemberStatusId == deceaseMemberStatusId ? _deceasedEmail : _specialNeedEmal
        const newStr = emailTemp.replaceAll('{{CLINT_NAME}}', primaryMember?.memberName)
            .replaceAll("{{CHILD_NAME}}", childName)
            .replaceAll("{{PRIMARY_MOBILE}}", numberFormate(primaryMember?.userMob))
            .replaceAll("{{PRIMARY_EMAIL}}", primaryMember?.primaryEmailId)
            // .replaceAll("{{CHILD_DECEASE_SPECIAL_NEED}}", _member_Status)
            .replaceAll("{{RELATIONSHIPWITH_PRIMARY}}", `(${relationName})`)
            .replaceAll('{{GENDER_STATUS}}', genderStatus)

        const newStr2 = _msgConfirmationSpouse.replaceAll('{{CHILD_NAME}}', childName)
            .replaceAll('{{GENDER_STATUS}}', genderStatus)

        // {{GENDER_STATUS}}
        setMsgConfirmationForSpouse(newStr2)

        setTextAreaValue(newStr)
    }

    //  *************************************_______schreen type of modal body_______******************************************************************
    const handleWarningYesNoAction = (val) => {
        setIsHandleWarningUnderstantNEmail(val)
    }

    //  *************************************_______EMAIL______******************************************************************

    const handleTextAreaChange = (e) => {
        const enteredText = e.target.value;
        setTextAreaValue(enteredText)
    }

    const closeModal = () => {
        handleModalOpenCloseWithId()
    }


    //  *************************************_______EMAIL_ Content_____******************************************************************

    const returnEmailContent = () => {
        const emailContent = `<p>Dear Law Firm</p><p style={{ padding: '20px', backgroundColor: 'red' }}>${textAreaValue}</p>`

        return emailContent;
    }

    //  *************************************_______EMAIL_ SENT_____******************************************************************
    const sendEmail = async () => {

        const emailTo = (demo == false && subtenantId != 742) ? 'TechSupport@agingoptions.com' : (demo == false && subtenantId == 742) ? "priorityclient@lifepointlaw.com" : 'shreyasinha@agingoptions.com'
        const emailCC = primaryMemberDetails?.primaryEmailId

        const jsonObj = {
            emailType: "Family Member Status has been modified",
            emailTo: emailTo,
            emailcc: emailCC,
            emailSubject: `${primaryMemberDetails?.memberName}-Family Member Status has been modified`,
            emailContent: returnEmailContent(),
            emailStatusId: 1,
            emailMappingTable: "tblMember",
            emailMappingTablePKId: loggedInUserId,
            createdBy: loggedInUserId
        }

        konsole.log('jsonObj', jsonObj)
        dispatchloader(true)
        const result = await postApiCall('POST', $Service_Url.sendPostEmailCC, jsonObj);
        dispatchloader(false)
        konsole.log('result', result)
        if (result !== 'err') {
            AlertToaster.success('Email sent successfully.')
            closeModal()
        }
    }

    //  *************************************_______EMAIL______******************************************************************
    return (
        <>
            <Modal
                centered={true}
                size={`${(isHandleWarningUnderstantNEmail == _bodyShowAction[0] || isHandleWarningUnderstantNEmail == _bodyShowAction[2]) ? 'md' : 'lg'}`}
                show={isModalOpen}
                onHide={() => handleCloseModalWithoutId(false)}
                aria-labelledby="contained-modal-title-vcenter"
                id="Modal_for_Decease"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px" }}
                backdrop="static" >
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>{isHandleWarningUnderstantNEmail}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="Modal_for_Decease_main_div" className='decease_modal_main_div'>

                        {(isHandleWarningUnderstantNEmail == _bodyShowAction[0]) ? <>
                            <div>
                                <h4 className='modal_body_msg  text-center mb-2'>{(refrencePage == 'spouseComponent' && selectMemberStatusId == deceaseMemberStatusId) ? <> {_msgConfirmationForSpouse} </> : _msgConfirmation} </h4>
                                {(refrencePage == 'spouseComponent' && selectMemberStatusId == deceaseMemberStatusId) && <>
                                    <p className='mb-2 ms-3'>
                                        <b>Note:</b><span> By changing the Spouse {(memberStatusIdforTestRef == livingMemberStatusId) ? "Living Status" : "special needs"}  to Deceased, will change the Marital status to Widowed and respective documents will not visible on the portal.</span>
                                    </p></>}
                                <div className='yes_no_action_btn'>
                                    <button className='yes_no_btn' style={{ backgroundColor: "#d79b48" }} onClick={() => handleWarningYesNoAction(_bodyShowAction[2])} >No</button>
                                    <button className='yes_no_btn' onClick={() => handleWarningYesNoAction(_bodyShowAction[1])} >Yes</button>
                                </div>
                            </div> </>
                            : (isHandleWarningUnderstantNEmail == _bodyShowAction[1]) ? <>
                                <div className='decease_modal_email_temp'>
                                    <div class="form-outline border border-2 rounded fs-4">
                                        <label className="mb-0 ps-3 fs-4 text-secondary">Dear Law Firm</label>
                                        <textarea
                                            className="form-control pt-0 ps-3 fs-4  text-dark  shadow-none border-0" rows="4"
                                            value={textAreaValue} onChange={(e) => handleTextAreaChange(e)}
                                        >
                                        </textarea>
                                    </div>
                                    <div className='yes_no_action_btn '>
                                        <button className="yes_no_btn" onClick={() => handleWarningYesNoAction(_bodyShowAction[0])} >Back</button>
                                        <button className='yes_no_later_btn' onClick={() => closeModal()} >Send Later & Proceed</button>
                                        <button className='yes_no_btn' onClick={() => sendEmail()}>Send</button>
                                    </div>
                                </div></> : <>
                                <div>
                                    <h4 className='modal_body_msg  text-center mb-4'> {_understandMsg} </h4>
                                    <div className='yes_no_action_btn'>
                                        <button className='yes_no_btn' style={{ backgroundColor: "#d79b48" }} onClick={() => handleWarningYesNoAction(_bodyShowAction[0])} >Back</button>
                                        <button className='yes_no_later_btn' style={{ backgroundColor: "#720C20" }} onClick={() => closeModal()} >I Understand</button>
                                    </div>
                                </div>
                            </>}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps, mapDispatchToProps)(ModalForDecease);