import { $Service_Url } from "../network/UrlPath";
import { postApiCall, getApiCall, isNotValidNullUndefile } from "../Reusable/ReusableCom";
import useUserIdHook from "../Reusable/useUserIdHook";


export const OccurrenceApiGettemplatefun = (occurrenceId) => {
    // const { _loggedInUserId, _subtenantId } = useUserIdHook();
    const _subtenantId = sessionStorage?.getItem('SubtenantId');
    const _loggedInUserId = sessionStorage?.getItem('loggedUserId'); 
    let jsonObj = { occurrenceId: occurrenceId, isActive: true, subtenantId: _subtenantId };
    return new Promise(async (resolve, reject) => {
        const _resultComMediumPath = await postApiCall('POST', $Service_Url.getCommMediumPath, jsonObj);
        if (_resultComMediumPath == 'err' || _resultComMediumPath?.data?.data?.length < 0) {
            resolve('err');
        }
        let emailObj = null;
        let textObj = null
        const { commChannelId, applicableTextTempId, applicableEmailTempId, isActive, subtenantId } = _resultComMediumPath?.data?.data[0];
        const text_Url = `${$Service_Url.getTextTemplate}?TextTemplateId=${applicableTextTempId}&IsActive=${isActive}&SubtenantId=${subtenantId}`;
        const email_Url = `${$Service_Url.GetEmailTemplate}?TemplateId=${applicableEmailTempId}&IsActive=${isActive}&SubtenantId=${subtenantId}`;
        if (commChannelId == 1) {
            const _resultEmailTemplate = await getApiCall('GET', email_Url);
            console.log('_resultEmailTemplate', _resultEmailTemplate);
            if (_resultEmailTemplate?.length > 0) {
                emailObj = { emailTempData: _resultEmailTemplate, emailTemp: _resultEmailTemplate[0].templateContent };
            }
        } else if (commChannelId == 2) {
            const _resultTextTemplate = await getApiCall('GET', text_Url);
            console.log('_resultTextTemplate', _resultTextTemplate);
            if (_resultTextTemplate?.length > 0) {
                textObj = { textTempData: _resultTextTemplate, textTemp: _resultTextTemplate[0].textTemplateContent };
            }
        } else {
            const _resultEmailTemplate = await getApiCall('GET', email_Url);
            if (_resultEmailTemplate?.length > 0) {
                emailObj = { emailTempData: _resultEmailTemplate, emailTemp: _resultEmailTemplate[0].templateContent };
            }
            console.log('_resultEmailTemplate', _resultEmailTemplate);

            const _resultTextTemplate = await getApiCall('GET', text_Url);
            console.log('_resultTextTemplate', _resultTextTemplate);
            if (_resultTextTemplate?.length > 0) {
                textObj = { textTempData: _resultTextTemplate, textTemp: _resultTextTemplate[0].textTemplateContent };
            }
        }
        let data = {
            emailObj: emailObj,
            textObj: textObj,
            commChannelId: commChannelId
        }
        resolve(data);
    })
}


export const OccurrenceApiSentMailMsg = async (commChannelId,emailJson, mobileJson) => {
    return new Promise(async (resolve, reject) => {
        {
            if (commChannelId === 2 && isNotValidNullUndefile(mobileJson?.textTo)) {
                const _resultTextSent = await postApiCall('POST', $Service_Url.postSendTextPath, mobileJson);
                console.log("_resultTextSent", _resultTextSent);
                resolve('resolve');
            } else if (commChannelId === 1) {
                const _resultEmailSent = await postApiCall('POST', $Service_Url.sentEmailWithAsyncCcBc, emailJson);
                console.log('_resultEmailSent', _resultEmailSent);
                resolve('resolve');
            } else {
                const _resultEmailSent = await postApiCall('POST', $Service_Url.sentEmailWithAsyncCcBc, emailJson);
                console.log('_resultEmailSent', _resultEmailSent);
                if (isNotValidNullUndefile(mobileJson?.textTo)) {
                    const _resultTextSent = await postApiCall('POST', $Service_Url.postSendTextPath, mobileJson);
                    console.log("_resultTextSent", _resultTextSent);
                    resolve('resolve');
                } else {
                    resolve('resolve');
                }
            }
            resolve('resolve');
        }
    });
};