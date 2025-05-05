import konsole from "../../components/control/Konsole";
import { $Service_Url } from "../../components/network/UrlPath";
import { postApiCall, getApiCall, getApiCall2 } from "../../components/Reusable/ReusableCom";
import { $AHelper } from "./$AHelper";

export const $ApiHelper = {
    $getOccurrance: async (obj) => {
        konsole.log("objobjobjobj", obj)
        var occurrenceId = obj?.occurrenceId;
        var subtenantId = obj?.occurrenceId;
        return new Promise(async (resolve, rejecct) => {

            let jsonObj = {
                occurrenceId: occurrenceId,
                isActive: true,
                subtenantId: subtenantId
            };
            konsole.log("jsonObjjsonObjjsonObjjsonObj", jsonObj)
            // let jsonObj = { occurrenceId: obj?.occurrenceId, isActive: true, subtenantId: obj?.subtenantId };
            const _resultComMediumPath = await postApiCall('POST', $Service_Url.getCommMediumPath, jsonObj);
            konsole.log("_resultComMediumPath", _resultComMediumPath);

            if (_resultComMediumPath === 'err' || _resultComMediumPath?.data?.data?.length < 0) {
                resolve("err404");
                return;
            };
            const { commChannelId, applicableTextTempId, applicableEmailTempId, isActive, subtenantId } = _resultComMediumPath?.data?.data[0];
            const text_Url = `${$Service_Url.getTextTemplate}?TextTemplateId=${applicableTextTempId}&IsActive=${isActive}&SubtenantId=${subtenantId}`;
            const email_Url = `${$Service_Url.GetEmailTemplate}?TemplateId=${applicableEmailTempId}&IsActive=${isActive}&SubtenantId=${subtenantId}`;
            console.log("email_Urlemail_Url", email_Url)
            let emailTempObj = ''
            let mobileTempObj = ''
            let commPath = _resultComMediumPath?.data?.data;
            if (commChannelId == 1 || commChannelId != 2) {
                const _resultEmailTemplate = await getApiCall('GET', email_Url);
                konsole.log("_resultEmailTemplate", _resultEmailTemplate)
                if (_resultEmailTemplate.length > 0) {
                    emailTempObj = _resultEmailTemplate;
                }
            }
            if (commChannelId == 2 || commChannelId != 1) {
                const _resultTextTemplate = await getApiCall('GET', text_Url);
                konsole.log("_resulTextTemplate", _resultTextTemplate)
                if (_resultTextTemplate?.length > 0) {
                    mobileTempObj = _resultTextTemplate;
                }
            }
            konsole.log("mobileTempObj", mobileTempObj)
            let obj = { emailTemp: emailTempObj, textTemp: mobileTempObj, commChannelId: commChannelId, commPath: commPath }
            konsole.log("obj", obj)
            resolve(obj)
        })


    },

    $sentMail: async (obj) => {

        return new Promise(async (resolve, reject) => {
            let isEmail = obj.isEmail;
            let isMobile = obj.isMobile;
            let promises = []
            if (isEmail == true) {
                promises.push(postApiCall('POST', $Service_Url.sentEmailWithAsyncCcBc, obj?.emailJson));
            }

            if (isMobile == true) {
                promises.push(postApiCall('POST', $Service_Url.postSendTextPath, obj?.mobileJson));
            }

            return Promise.all(promises).then((res) => {
                console.log("response of email", res);
                resolve(res);
            }).catch((err) => {
                console.log("err of email", err)
                resolve('err');
            })
        })


    },

    $getUserIPv4: async () => {
        return new Promise(async (resolve, reject) => {
            let url = $Service_Url.getIPv4;
            const _result = await getApiCall2("GET", url);
            return resolve(_result?.data?.ip ?? "");
        })
    },

    $getUploadedDocumentByFileId: async (obj) => {
        return new Promise(async (resolve, reject) => {
            let url = $Service_Url.getfileUploadDocuments + `${obj?.fileId}/1`
            const _resultOf = await getApiCall('GET', url, '')
            resolve(_resultOf)
        })
    },
    $getSujectQuestions: async (formLabelId) => {
        return new Promise(async (resolve, reject) => {
            const _resultOf = await postApiCall('POST', $Service_Url.getsubjectForFormLabelId, formLabelId)
            konsole.log("resultOfgetSubjectFormlabelId", _resultOf);
            if (_resultOf !== 'err') {
                resolve(_resultOf?.data?.data)
            }
            resolve(_resultOf)
        })
    },
    $getSubjectResponseWithQuestions: async ({ questions, memberId }) => {
        konsole.log("questionsApiHelper", questions);
        return new Promise(async (resolve, reject) => {
            if (questions.length == 0) {
                resolve('');
                return;
            }
            let formlabelData = {};
            let questionResponse = [];
            console.log("questions", questions)
            let apiCalls = questions.map((obj, index) => {
                let url = $Service_Url.getSubjectResponse + memberId + `/0/0/${obj?.question?.questionId}`;
                console.log("urlurlurlurlurl", url)
                return getApiCall('GET', url, null).then(result => {
                    konsole.log("result", result);
                    if (result != 'err' && result?.userSubjects.length > 0) {
                        return result.userSubjects[0];
                    } else {
                        return null;
                    }
                }).catch(error => {
                    konsole.log("API call error:", error);
                    return null;
                });
            });

            Promise.all(apiCalls).then((results) => {
                console.log("resultsresults", results)
                let questionResponse = results.filter(response => response !== null);
                resolve({ questionResponse: questionResponse, formlabelData: formlabelData });
                konsole.log("questionsInHelper", questionResponse, questions);
            }).catch((error) => {
                (error);
            });
        });
    },
    $getSubjectResponseWithQuestionsWithTopicId: async ({ questions, memberId, topicId, categoryId,subjectId }) => {
        konsole.log("questionsApiHelper", questions, memberId, topicId, categoryId);
        return new Promise(async (resolve, reject) => {
            if(categoryId || subjectId|| questions?.length > 0 || $AHelper.$isNotNullUndefine(questions)){
                let url = $Service_Url.getSubjectResponse + memberId + `/${categoryId ?? 0}/${topicId ?? 0}/${subjectId ?? 0}`;
                const resultOfSubject = await getApiCall('GET', url, '')
                console.log("subjectresponsewithtopic", resultOfSubject)
    
                resolve(resultOfSubject)
            }
            resolve('')    
        });
    },
    $getSubjectResponseWithQuestionsWithTopicIdV2: async ({ questions, memberId,questionId }) => {
        return new Promise(async (resolve, reject) => {
            if(questionId || questions?.length > 0 || $AHelper.$isNotNullUndefine(questions)){
                let url = $Service_Url.getSubjectV2Response + memberId + `?subjectIds=${questionId}`;
                const resultOfSubject = await getApiCall('GET', url, '')
                 resolve(resultOfSubject)
            }
            resolve('')    
        });
    },
    $getAddressByUserId: async ( userId ) => {
        konsole.log("sbkjdvbkj", userId);
        if(!userId) return "";
        const result = await getApiCall('GET', $Service_Url.getAllAddress + userId, '');
        return result?.addresses?.[0]?.addressLine1 ? result?.addresses?.[0]?.addressLine1 : "";
    },
    $getContactByUserId: async ( userId ) => {
        konsole.log("sbkjdvbkj", userId);
        if(!userId) return "";
        const result = await getApiCall('GET', $Service_Url.getAllContactOtherPath + userId, '');
        const mobileNo = result?.contact?.mobiles?.[0]?.mobileNo ? $AHelper.$formatNumber(result?.contact?.mobiles?.[0]?.mobileNo) : "";
        const emailId = result?.contact?.emails?.[0]?.emailId ?? "";
        return {mobileNo, emailId};
    }
}

