import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { $Service_Url } from '../network/UrlPath';
import { postApiCall, getApiCall, isValidateNullUndefine } from '../Reusable/ReusableCom';
import konsole from '../control/Konsole';
import AlertToaster from '../control/AlertToaster';

const questionFormLabelId = [1026]
const NotificationPermission = ({ setLoader }) => {
    const primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
    const [formlabelData, setFormlabelData] = useState({})
    const [ques1026, setQues1026] = useState({})


    useEffect(() => {
        fetchFormLabelData();
    }, [])

    const fetchFormLabelData = async () => {
        if (questionFormLabelId.length == 0) return;
        let formlabelData = {}
        konsole.log('questionFormLabelId', questionFormLabelId)
        setLoader(true)
        let resultsubjectlabel = await postApiCall('POST', $Service_Url.getsubjectForFormLabelId, questionFormLabelId);
        setLoader(false)
        konsole.log('resultsubjectlabel', resultsubjectlabel)
        if (resultsubjectlabel == 'err') return;
        for (let obj of resultsubjectlabel.data.data) {
            let label = "label" + obj.formLabelId;
            formlabelData[label] = obj.question;
            setLoader(true)
            let result = await getApiCall('GET', $Service_Url.getSubjectResponse + primaryMemberUserId + `/0/0/${formlabelData[label].questionId}`, null);
            setLoader(false)
            konsole.log('resultresult', result)
            if (result !== 'err' && result?.userSubjects?.length != 0) {
                let responseData = result?.userSubjects[0];
                for (let i = 0; i < formlabelData[label].response.length; i++) {
                    if (formlabelData[label].response[i].responseId === responseData.responseId) {
                        konsole.log('responseData', responseData) 
                        if (responseData?.responseNature == "CheckBox") {
                            formlabelData[label].response[i]["checked"] = responseData.response == 'false' ? false : true
                            formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        }

                    }
                }
            }
        }
        konsole.log('formlabelData', formlabelData)
        setFormlabelData(formlabelData)
    }


    const metaDatafunJson = (userSubjectDataId, eventValue, eventId, subjectId) => {
        return { userSubjectDataId: userSubjectDataId, subjectId: subjectId, subResponseData: eventValue, responseId: eventId }
    }

    const handleCheckboxChange = async (event, formLabelDatawithlabel, formlabelwithlabel, setState, checked) => {
        konsole.log('eeeeee', checked, event.target.checked)
        const eventId = event.target.id;
        const eventChecked = event.target.checked;
        const userSubjectDataId = (formLabelDatawithlabel?.userSubjectDataId) ? formLabelDatawithlabel?.userSubjectDataId : 0
        const subjectId = formLabelDatawithlabel?.questionId;
        let returnMetaData = metaDatafunJson(userSubjectDataId, eventChecked, eventId, subjectId)
        konsole.log('returnMetaData', returnMetaData)

        let jsonobj = {
            "userId": primaryMemberUserId,
            "userSubjects": [returnMetaData]
        }

        konsole.log('jsonobj', jsonobj)

        setLoader(true);
        const _resultCheckBoxApi = await postApiCall('PUT', $Service_Url.putusersubjectdata, jsonobj);
        konsole.log('_resultCheckBoxApi', _resultCheckBoxApi)
        if (_resultCheckBoxApi != 'err') {
            AlertToaster.success(`Notification ${eventChecked==true?'allowed':'disabled'} successfully.`)
            fetchFormLabelData();
        } else {
            setLoader(false);
        }
    }

    // ***********************************************

    const _questionAndAnswerCheckbox = (formLabelDatawithlabel, name, withlabel, setState) => {
        return (<>

            {formLabelDatawithlabel && formLabelDatawithlabel?.response.map((response) => {
                konsole.log("response", response?.checked);
                const checked = (response.checked) ? true : false
                return (
                    <div className='d-flex gap-3'>
                    <div>
                    <Form.Check
                        key={response?.responseId}
                        className="form-check-smoke"
                        type="checkbox"
                        onChange={(e) => handleCheckboxChange(e, formLabelDatawithlabel, withlabel, setState, checked)}
                        defaultChecked={checked}
                        value={response?.response}
                        id={response?.responseId}
                    />
                    </div>
                    <div style={{paddingTop:"1.6px"}}>
                    <label>{formLabelDatawithlabel?.question}</label>
                    </div>
                    </div>
                    
                );
            })}

        </>)
    }

    konsole.log('xyformlabelDataformlabelData', formlabelData)
    return (
        <>
            {_questionAndAnswerCheckbox(formlabelData?.label1026, 'Permission', 'label1026', setQues1026)}
        </>
    )
}

export default NotificationPermission