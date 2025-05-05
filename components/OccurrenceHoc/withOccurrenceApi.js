import React, { useEffect, useState } from 'react';
import { getApiCall, postApiCall, isNotValidNullUndefile } from '../Reusable/ReusableCom';
import { $Service_Url } from '../network/UrlPath';
import konsole from '../control/Konsole';
import AlertToaster from '../control/AlertToaster';
import { paralegalAttoryId } from '../control/Constant';

const withOccurrenceApi = (WrappedComponent, occurrenceId, refrencePage) => {
    return (props) => {
        console.log("fileoccurrenceId", occurrenceId);
 
        //@State
        const [emailObj, setEmailObj] = useState({ emailTempData: '', emailTemp: '' });
        const [textObj, setTextObj] = useState({ textTempData: '', textTemp: '' });
        const [commChannelId, setCommChannelId] = useState('');
        const [_loggedInRoleId, setLoggedInRoleId] = useState('')
        const [_loggedInUserId, setLoggedInUserId] = useState('')
        const [_subtenantId, setSubtenantId] = useState('')
 
        useEffect(() => {
            const _subtenantId = sessionStorage?.getItem('SubtenantId');          
            const _loggedInRoleId = JSON.parse(sessionStorage?.getItem('stateObj'))?.roleId;  
            const _loggedInUserId = sessionStorage?.getItem('loggedUserId');        
            setLoggedInRoleId(_loggedInRoleId)
            setLoggedInUserId(_loggedInUserId)
            setSubtenantId(_subtenantId)
            fetchApi();
        }, [occurrenceId,_subtenantId,_loggedInRoleId,_loggedInUserId]);
       
        if (refrencePage == 'FileRemarks' && isNotValidNullUndefile(_loggedInRoleId) && paralegalAttoryId.includes(_loggedInRoleId)) {
            return <WrappedComponent {...props}  />
        }
 
        async function fetchApi() {
            if (!isNotValidNullUndefile(_subtenantId)) return;
            props.dispatchloader(true);
            let jsonObj = { occurrenceId: occurrenceId, isActive: true, subtenantId: _subtenantId };
            const _resultComMediumPath = await postApiCall('POST', $Service_Url.getCommMediumPath, jsonObj);
            props.dispatchloader(false);

            if (_resultComMediumPath === 'err' || _resultComMediumPath?.data?.data?.length < 0) return;

            props.dispatchloader(true);
            const { commChannelId, applicableTextTempId, applicableEmailTempId, isActive, subtenantId } = _resultComMediumPath?.data?.data[0];
            const text_Url = `${$Service_Url.getTextTemplate}?TextTemplateId=${applicableTextTempId}&IsActive=${isActive}&SubtenantId=${subtenantId}`;
            const email_Url = `${$Service_Url.GetEmailTemplate}?TemplateId=${applicableEmailTempId}&IsActive=${isActive}&SubtenantId=${subtenantId}`;

            setCommChannelId(commChannelId);

            if (commChannelId === 1) {
                const _resultEmailTemplate = await getApiCall('GET', email_Url);
                konsole.log('_resultEmailTemplate', _resultEmailTemplate);
                if (_resultEmailTemplate?.length > 0) {
                    setEmailObj({ emailTempData: _resultEmailTemplate, emailTemp: _resultEmailTemplate[0].templateContent });
                }
            } else if (commChannelId === 2) {
                const _resultTextTemplate = await getApiCall('GET', text_Url);
                if (_resultTextTemplate?.length > 0) {
                    setTextObj({ textTempData: _resultTextTemplate, textTemp: _resultTextTemplate[0].textTemplateContent });
                }
                konsole.log('_resultTextTemplate', _resultTextTemplate);
            } else {
                const _resultEmailTemplate = await getApiCall('GET', email_Url);
                if (_resultEmailTemplate?.length > 0) {
                    setEmailObj({ emailTempData: _resultEmailTemplate, emailTemp: _resultEmailTemplate[0].templateContent });
                }
                konsole.log('_resultEmailTemplate', _resultEmailTemplate);

                const _resultTextTemplate = await getApiCall('GET', text_Url);
                konsole.log('_resultTextTemplate', _resultTextTemplate);
                if (_resultTextTemplate?.length > 0) {
                    setTextObj({ textTempData: _resultTextTemplate, textTemp: _resultTextTemplate[0].textTemplateContent });
                }
            }
            props.dispatchloader(false);
        };

        const sentMail = async (emailJson, mobileJson) => {
            return new Promise(async (resolve, reject) => {
                {

                    props.dispatchloader(true);
                    if (commChannelId === 2 && isNotValidNullUndefile(mobileJson?.textTo)) {
                        const _resultTextSent = await postApiCall('POST', $Service_Url.postSendTextPath, mobileJson);
                        konsole.log("_resultTextSent", _resultTextSent);

                        props.dispatchloader(false);
                        resolve('resolve');
                    } else if (commChannelId === 1) {
                        const _resultEmailSent = await postApiCall('POST', $Service_Url.sentEmailWithAsyncCcBc, emailJson);
                        konsole.log('_resultEmailSent', _resultEmailSent);

                        props.dispatchloader(false);
                        resolve('resolve');
                    } else {
                        const _resultEmailSent = await postApiCall('POST', $Service_Url.sentEmailWithAsyncCcBc, emailJson);
                        konsole.log('_resultEmailSent', _resultEmailSent);
                        if (isNotValidNullUndefile(mobileJson?.textTo)) {
                            const _resultTextSent = await postApiCall('POST', $Service_Url.postSendTextPath, mobileJson);
                            konsole.log("_resultTextSent", _resultTextSent);
                            resolve('resolve');
                        } else {
                            resolve('resolve');
                        }
                    }

                    props.dispatchloader(false);
                    resolve('resolve');
                }
            });
        };

        return <WrappedComponent emailTmpObj={emailObj} textTmpObj={textObj} sentMail={sentMail} {...props} commChannelId={commChannelId} />;
    };
};

export default withOccurrenceApi;
