import React, { useEffect, useState } from 'react';
import withOccurrenceApi from '../../OccurrenceHoc/withOccurrenceApi';
import { _amaDocOccurrenceId, isNotValidNullUndefile, getSMSNotificationPermissions } from '../../Reusable/ReusableCom';
import OccurrenceModal from '../../OccurrenceHoc/OccurrenceModal';
import useUserIdHook from '../../Reusable/useUserIdHook';
import { createSentEmailJsonForOccurrene, createSentTextJsonForOccurrene, logoutUrl } from '../../control/Constant';
import AlertToaster from '../../control/AlertToaster';
import konsole from '../../control/Konsole';
const AmaOccurrence = (props) => {
    const { dispatchloader, emailTmpObj, textTmpObj, sentMail, commChannelId, allFolderList, clientData, handleAMAShowOccurrence, showAmaOccurrencePreview } = props;
    const { _userLoggedInDetail, _subtenantId, _loggedInUserId, _subtenantName } = useUserIdHook();
    // const [showOccurrencePreview, setShowOccurrencePreview] = useState(false);

    konsole.log("propsprops", props)
    const [isClientPermissions, setIsClientPermissions] = useState(false);

    useEffect(() => {
        fetchData(clientData?.memberId)
    }, [clientData?.memberId])

    const fetchData = async (primaryuserId) => {
        console.log("primaryuserIdwithOccurrenceAPI", primaryuserId);
        if (!isNotValidNullUndefile(primaryuserId)) return;
        await getSMSNotificationPermissions(primaryuserId, setIsClientPermissions);
    }

    const replaceTemplate = (temp) => {
        let cabinetName = 'Legal';
        let documentName = '(documentNAme)';
        let memberUserName = clientData?.memberName;
        let universallink = `${logoutUrl}account/Signin?subtenantId=${_subtenantId}`
        let TemplateContent = temp;


        TemplateContent = TemplateContent.replace("@@USERNAME", memberUserName)
        TemplateContent = TemplateContent.replace("@@LEGALPERSONNAME", _userLoggedInDetail?.memberName)
        TemplateContent = TemplateContent.replace("@@LEGALPERSONNAME", _userLoggedInDetail?.memberName)
        TemplateContent = TemplateContent.replace("@@CABINETNAME", cabinetName)
        TemplateContent = TemplateContent.replace("@@SUBTENANTNAME", _subtenantName)
        TemplateContent = TemplateContent.replace("@@PARALEGALEMAIL", _userLoggedInDetail?.primaryEmailId)
        TemplateContent = TemplateContent.replace("@@UNIVERSALLINK", universallink)
        TemplateContent = TemplateContent.replace("some documents", 'Annual Maintenance Agreement document')

        return TemplateContent;
    }


    const sentTextNMail = async () => {
        const emailTo = clientData?.primaryEmailAddress;
        const primaryMemberUserId = clientData?.memberId;
        let textTo = clientData?.primaryPhoneNumber;
        if (isClientPermissions != true) {
            textTo = ''
        }
        let emailJson=''
        if ((commChannelId == '1' || commChannelId == 3) && emailTmpObj?.emailTempData) {
            const { templateType, emailSubject, templateId } = emailTmpObj?.emailTempData[0];

         emailJson = createSentEmailJsonForOccurrene({
            emailType: templateType,
            emailTo: emailTo,
            emailSubject,
            emailContent: replaceTemplate(emailTmpObj.emailTemp),
            emailTemplateId: templateId,
            emailMappingTablePKId: primaryMemberUserId,
            emailStatusId: 1,
            emailMappingTablePKId: primaryMemberUserId,
            createdBy: _loggedInUserId,
        })
    }
        let textJson = '';
        if ((commChannelId == '2' || commChannelId == 3) && textTmpObj?.textTempData) {
            const { textTemplateType, textTemplateId } = textTmpObj.textTempData[0]
            textJson = createSentTextJsonForOccurrene({
                smsType: textTemplateType,
                textTo: textTo,
                textContent: replaceTemplate(textTmpObj.textTemp),
                smsTemplateId: textTemplateId,
                smsMappingTablePKId: primaryMemberUserId,
                smsStatusId: 1,
                smsMappingTablePKId: primaryMemberUserId,
                createdBy: _loggedInUserId,

            });
        }
        konsole.log("textJson", textJson, emailJson)
        dispatchloader(true)
        const _resultSentEmailtext = await sentMail(emailJson, textJson);
        dispatchloader(false)
        if (_resultSentEmailtext == 'resolve') {
            // const message = `Email ${commChannelId == 3 ? "and Text " : ''}Sent Successfully.`;
            const message = `Sent Successfully.`;
            AlertToaster.success(message);
        }
        handleAMAShowOccurrence(false);
    }

    return (
        <>
            {/* <button onClick={() => handleAMAShowOccurrence(true)}>show</button> */}
            {/* {showOccurrencePreview && */}
            <OccurrenceModal
                textObj={replaceTemplate(textTmpObj?.textTemp)}
                emailObj={replaceTemplate(emailTmpObj?.emailTemp)}
                commChannelId={commChannelId}
                show={showAmaOccurrencePreview}
                onHide={handleAMAShowOccurrence}
                sentMail={sentTextNMail}
                isClientPermissions={isClientPermissions}
            />
            {/* } */}
        </>
    )
}

// export default AmaOccurrence;

export default withOccurrenceApi(AmaOccurrence, _amaDocOccurrenceId, 'amaOccurrence');
