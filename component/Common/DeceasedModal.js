import React, { useEffect, useCallback, useState, useMemo, useContext } from 'react';
import { globalContext } from '../../pages/_app';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import CustomModal from '../Custom/CustomModal';
import { isNotValidNullUndefile } from '../../components/Reusable/ReusableCom';
import { $AHelper } from '../../components/control/AHelper';
import { demo } from '../../components/control/Constant';
import konsole from '../../components/control/Konsole';
import { $JsonHelper } from '../Helper/$JsonHelper';
import { useLoader } from '../utils/utils';
import { $ApiHelper } from '../Helper/$ApiHelper';

const DeceasedModal = (props) => {
    const { isModalOpen, primaryMemberFullName, handleOpenModal, handleOpenModalchildName, selectMemberStatusId, dataInfo, refrencePage, memberStatusIdforTestRef, genderId, childName, handleModalOpenChange, loggedInUserId,deceaseMemberStatusId,livingMemberStatusId} = props;
    const _msgConfirmation = "These changes should be incorporated into your legal documents. Would you like to notify your legal counsel of this update?";
    const _specialNeedEmal = "{{CLINT_NAME}} has updated {{GENDER_STATUS}} information form, indicating that {{CHILD_NAME}} {{RELATIONSHIPWITH_PRIMARY}} has special needs. Please contact {{CLINT_NAME}} to review this matter. The client's phone number is  {{PRIMARY_MOBILE}}, and {{GENDER_STATUS}} email is {{PRIMARY_EMAIL}}."
    const _msgConfirmationSpouse = "We are sorry to learn about {{CHILD_NAME}}'s passing. It appears that {{CHILD_NAME}} has been named in a fiduciary/beneficiary capacity in different legal documents.  Please contact your legal counsel to update your documents and then update the agent assignment portion of this Portal.  You can contact your legal counsel here.";
    const _understandMsg = "Please understand that making the change in this organizer will have no impact on the legal documents that may affect your estate plan. We encourage you to update your legal documents to reflect this new reality. Please click below to acknowledge that you understand the importance of this matter."
    const _deceasedEmail = "{{CLINT_NAME}} has updated {{GENDER_STATUS}} information form, stating that {{CHILD_NAME}} {{RELATIONSHIPWITH_PRIMARY}} has passed away. Please reach out to {{CLINT_NAME}} for further review of this matter. The client's phone number is {{PRIMARY_MOBILE}}, and email address is {{PRIMARY_EMAIL}}."

    const { setWarning, returnTrue } = useContext(globalContext)
    const _bodyShowAction = ['Warning !', 'Email Preview', 'Understand']
    const { primaryDetails, _spousePartner ,primaryMemberContactDetails} = usePrimaryUserId()
    const [isHandleWarningUnderstantNEmail, setIsHandleWarningUnderstantNEmail] = useState(_bodyShowAction[0])
    const [textAreaValue, setTextAreaValue] = useState('')
    const [_msgConfirmationForSpouse, setMsgConfirmationForSpouse] = useState('')


    useEffect(() => {
        funForUpdateEmailTemplate()
    }, [])

    // @@ number format
    const numberFormate = (number) => {
        if (!isNotValidNullUndefile(number)) {
            return '-'
        }
        const lastTenDigitArray = array => array?.slice(-10);
        return $AHelper?.convertToUSFormat(lastTenDigitArray(number), "1")
    }
  

    // @@ uddate email template
    const funForUpdateEmailTemplate = () => {
        // relationName
        const emailTemp = selectMemberStatusId == deceaseMemberStatusId ? _deceasedEmail : _specialNeedEmal;
        const primaryMember = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'));
        const primarymemberMobile =primaryMemberContactDetails?.mobiles?.length>0  ? primaryMemberContactDetails?.mobiles?.find(i=>i.contactTypeId==1)?.mobileNo : primaryMember?.userMob
        const primarymemberEmail =primaryMemberContactDetails?.emails?.length>0  ? primaryMemberContactDetails?.emails?.find(i=>i.contactTypeId==1)?.emailId : primaryMember?.primaryEmailId

        let primaryGenderId=primaryDetails?.genderId;
        const genderStatus = (primaryGenderId == 1) ? 'his' : (primaryGenderId == 2) ? 'her' : (primaryGenderId == 3) ? 'own' : 'his/her';
        // const relationName = (refrencePage == 'AddChildWithProgressBar' || refrencePage == 'EditChildWithAccordian') ? 'child' : $AHelper.capitalizeFirstLetter(_spousePartner) ;
        const relationName = dataInfo?.memberRelationship?.relationshipTypeId == 1 ? $AHelper.capitalizeFirstLetter(_spousePartner) : isNotValidNullUndefile(dataInfo?.memberRelationship?.relationshipType) ? dataInfo?.memberRelationship?.relationshipType : 'child';

        const newStr = emailTemp.replaceAll('{{CLINT_NAME}}', primaryMember?.memberName)
            .replaceAll("{{CHILD_NAME}}", childName)
            .replaceAll("{{PRIMARY_MOBILE}}", numberFormate(primarymemberMobile))
            .replaceAll("{{PRIMARY_EMAIL}}", primarymemberEmail)
            .replaceAll("{{RELATIONSHIPWITH_PRIMARY}}", `(${relationName})`)
            .replaceAll('{{GENDER_STATUS}}', genderStatus)
        const newStr2 = _msgConfirmationSpouse.replaceAll('{{CHILD_NAME}}', childName).replaceAll('{{GENDER_STATUS}}', genderStatus)

        setMsgConfirmationForSpouse(newStr2)
        setTextAreaValue(newStr)
    }



    // @@ handle yes no back btn
    const handleWarningYesNoAction = (val) => {
        setIsHandleWarningUnderstantNEmail(val)
    }

    // @@ content for mail
    const returnEmailContent = () => {
        const emailContent = `<p>Dear Law Firm</p><p style={{ padding: '20px', backgroundColor: 'red' }}>${textAreaValue}</p>`
        return emailContent;
    }

    // @@ sent Email
    const getEmailTo = (demo, subtenantId) => {
        if (demo === false) {
          const emailMap = {742: 'priorityclient@lifepointlaw.com',2:'shreyasinha@agingoptions.com'};
          return emailMap[subtenantId] || 'TechSupport@agingoptions.com';
        }
        return 'shreyasinha@agingoptions.com';
      };

    const sentEmailText = async () => {
        const subtenantId = sessionStorage.getItem('SubtenantId')
        // const emailTo = (demo == false && subtenantId != 742) ? 'TechSupport@agingoptions.com' : (demo == false && subtenantId == 742) ? "priorityclient@lifepointlaw.com" : (demo == false && subtenantId == 2) ?  "shreyasinha@agingoptions.com" : 'shreyasinha@agingoptions.com'
        const emailTo = getEmailTo(demo,subtenantId)
        const primaryMember = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'));
        const primarymemberEmail = primaryMemberContactDetails?.emails?.length > 0  ? primaryMemberContactDetails?.emails?.find(i=>i.contactTypeId==1)?.emailId : primaryMember?.primaryEmailId
        konsole.log("primaryMemberprimaryMember", primaryMember)

        // let emailTo = 'nitinkumarja2003@mailinator.com'
        // let emailcc = primaryMember?.primaryEmailId;
        let emailcc =primarymemberEmail;
        let emailType = 'Family Member Status has been modified';
        let emailSubject = `${primaryMember?.memberName}-Family Member Status has been modified`;
        let emailContent = returnEmailContent();

        const createEmailJson = $JsonHelper.sendEmailWithCCnBcc({
            "emailMappingTable": "tblMember",
            emailTo, emailcc, emailType, emailSubject,
            emailContent, emailStatusId: "1", emailMappingTablePKId: loggedInUserId,
            createdBy: loggedInUserId
        });

        let jsoObj = {
            isEmail: true,
            isMobile: false,
            emailJson: createEmailJson,
        }
        useLoader(true);

        const resltOfSentEmail = await $ApiHelper.$sentMail(jsoObj);
        useLoader(false);
        konsole.log("createEmailJson", resltOfSentEmail, createEmailJson);
        if (resltOfSentEmail != 'err') {
            handleModalOpenChange();
            toasterAlert("successfully", "Successfully", "Email sent successfully.")
        }
    }

    // @@ Return back previous btn vlaue
    const returnBackValue = useMemo(() => {
        return (isHandleWarningUnderstantNEmail == _bodyShowAction[0]) ? _bodyShowAction[2] : _bodyShowAction[0]

    }, [isHandleWarningUnderstantNEmail])


    const handleTextAreaChange = (e) => {
        const enteredText = e.target.value;
        setTextAreaValue(enteredText)
    }

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }


    return <>


        <CustomModal
            key={isModalOpen}
            header={isHandleWarningUnderstantNEmail}
            open={isModalOpen}
            handleOpenModal={handleOpenModal}
            backClick={() => handleWarningYesNoAction(returnBackValue)}
            size={'lg'}
            refrencePage='DeceaseSpecialNeed'
        >

            <div id="common-decease_modal_main_div" className='common-decease_modal_main_div p-4'>

                {(isHandleWarningUnderstantNEmail == _bodyShowAction[0]) ? <>
                    <div>
                        <h4 className='h4-paragraph'>{(refrencePage == 'PersonalInformation' && selectMemberStatusId == deceaseMemberStatusId) ? <> {_msgConfirmationForSpouse} </> : _msgConfirmation} </h4>

                        {(refrencePage == 'PersonalInformation' && selectMemberStatusId == deceaseMemberStatusId) && <>
                            <p className='mb-2 ms-3 mt-2'>
                                <b className='h4-paragraph'>Note:</b><span className='h4-paragraph-2'> By changing the {$AHelper.capitalizeFirstLetter(_spousePartner)} {(memberStatusIdforTestRef == livingMemberStatusId) ? "Living Status" : "special needs"}  to Deceased, will change the Marital status to <span> { _spousePartner?.toLowerCase() === 'spouse' ? ' Widowed' : ' Single' }</span>,  and respective documents will not visible on the portal.</span>
                            </p></>}

                        <div className='btn-yes-no mt-4'>
                            <button className='btn-yes me-4' onClick={() => handleWarningYesNoAction(_bodyShowAction[1])}>Yes</button>
                            <button className='btn-no ms-4' onClick={() => handleWarningYesNoAction(returnBackValue)}>No</button>
                        </div>
                    </div> </> : (isHandleWarningUnderstantNEmail == _bodyShowAction[1]) ? <>
                        <div className='new-decease_modal_email_temp'>
                            <div className="new-decease_modal_email_temp-textarea">
                                <label className="label mb-0 fs-4 p-3 pb-1">“Dear Law  Firm”</label>
                                <textarea
                                    className="form-control text-area p-3 pt-1 shadow-none border-0 "
                                    rows="4"
                                    value={textAreaValue}
                                    onChange={(e) => handleTextAreaChange(e)}
                                >
                                </textarea>
                            </div>
                            <div className='d-flex justify-content-end mt-4' >
                                <button className='sent-btn' onClick={() => sentEmailText()} >Send</button>
                            </div>
                        </div></> : <>
                    <div>
                        <h4 className='modal_body_msg  text-center mb-4'> {_understandMsg} </h4>
                        <div className='btn-yes-no'>
                            <button className='btn-yes' style={{ backgroundColor: "#720C20" }} onClick={() => handleModalOpenChange()} >I Understand</button>
                        </div>
                    </div>
                </>}

            </div>

        </CustomModal>
    </>
}

export default DeceasedModal