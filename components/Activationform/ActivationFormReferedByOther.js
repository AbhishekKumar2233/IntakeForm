import React, { useState, useEffect, useContext, useImperativeHandle, forwardRef } from 'react'
import { Modal, Row, Col, Form, Button } from 'react-bootstrap'
import { $Service_Url } from '../network/UrlPath';
import { $AHelper } from '../control/AHelper';
import { InputCom, SelectCom, getApiCall, postApiCall, isValidateNullUndefine } from '../Reusable/ReusableCom';
import konsole from '../control/Konsole';
import { SET_LOADER } from '../Store/Actions/action';
import AlertToaster from '../control/AlertToaster';

const ActivationFormReferedByOther = (props, ref) => {
    const { questionFormLabelId, setLoader } = props
    const [formlabelData, setFormlabelData] = useState({})
    const primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
    const [referedByOther, setReferedByOther] = useState({})
    console.log("referedByOtherreferedByOtherreferedByOther", referedByOther)

    console.log('formlabelData', formlabelData)
    useEffect(() => {
        fectchsubjectForFormLabelId()
    }, [questionFormLabelId])
    useImperativeHandle(ref, () => ({
        saveOtherData,
    }))

    // *************************************________GET_____FORMLABELDATA_________**********************************

    const fectchsubjectForFormLabelId = async () => {
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
                konsole.log('responseData', responseData)
                for (let i = 0; i < formlabelData[label].response.length; i++) {
                    if (formlabelData[label].response[i].responseId === responseData.responseId) {
                        if (responseData.responseNature == "Radio") {
                            formlabelData[label].response[i]["checked"] = true;
                            formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        } else if (responseData.responseNature == "Text") {
                            formlabelData[label].response[i]["response"] = responseData.response;
                            formlabelData[label].response[i]["response"] = responseData.response;
                            formlabelData[label].response[i]["subResponseData"] = responseData.response;
                            formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        }
                    }
                }
            }
        }
        konsole.log('formlabelData', formlabelData)
        setFormlabelData(formlabelData)
    }

    // ********************________________________SAVE____DATA_________________________*********************************************
    const saveOtherData = async () => {
        let userSubjects = []
        if ($AHelper.objectvalidation(referedByOther)) {
            userSubjects.push(referedByOther)
        }
        let jsonobj = { "userId": primaryMemberUserId, "userSubjects": userSubjects }
        konsole.log('JsonObjOtherMetaQuestion', jsonobj)
        if (userSubjects?.length > 0) {
            setLoader(true)
            const resultSaveSubject = await postApiCall('PUT', $Service_Url.putusersubjectdata, jsonobj)
            konsole.log('resultSaveSubject', resultSaveSubject)
            setLoader(false)
        }

    }
    //  ********************************____________________CREATE INPUT JSON____________________*************************************************
    const metaDatafunJson = (userSubjectDataId, eventValue, eventId, subjectId) => {
        return { userSubjectDataId: userSubjectDataId, subjectId: subjectId, subResponseData: eventValue, responseId: eventId }
    }
    //  ********************************____________________INPUT_HANDLE_CHANGE____________________*************************************************
    const handleInputChange = (event, formLabelDatawithlabel, formlabelwithlabel) => {
        event.stopPropagation()
        const eventId = event.target.id;
        const eventValue = event.target.value;
        const eventName = event.target.name;
        const userSubjectDataId = (formLabelDatawithlabel?.userSubjectDataId) ? formLabelDatawithlabel?.userSubjectDataId : 0
        const subjectId = formLabelDatawithlabel?.questionId;
        konsole.log('handleInputChahge', eventId, eventValue, eventName, userSubjectDataId, subjectId, formLabelDatawithlabel, formlabelwithlabel)

        setFormlabelData(prevState => ({
            ...prevState,
            [formlabelwithlabel]: {
                ...prevState[formlabelwithlabel],
                response: prevState[formlabelwithlabel].response.map(item => ({
                    ...item,
                    subResponseData: eventValue
                }))
            }
        }));
        let returnMetaData = metaDatafunJson(userSubjectDataId, eventValue, eventId, subjectId)
        konsole.log('returnMetaData', returnMetaData)
        setReferedByOther(returnMetaData)
    }

    // **********************************____________________QUESTION_AND ANSWER INPUT__________________******************************************************
    const QuestionAndAnswerInput = (formLabelDatawithlabel, name, withlabel) => {
        return (
            <>
                <div class="d-flex justify-content-between mt-2">
                    {/* <p>{formLabelDatawithlabel && formLabelDatawithlabel.question}{" "} </p> */}
                    <p>{formLabelDatawithlabel && formLabelDatawithlabel?.response.map((response) => {
                        konsole.log("response", response?.checked);
                        return (
                            <Form.Control type='text'
                                id={response.responseId}
                                placeholder='Description'
                                value={response.subResponseData}
                                name={name}
                                onChange={(e) => handleInputChange(e, formLabelDatawithlabel, withlabel)}
                                className='custom-input ms-2'
                            />
                        )
                    })}</p>
                </div>
            </>
        )
    }

    return (
        <>
            {QuestionAndAnswerInput(formlabelData?.label1013, 'OtherReferedBy', 'label1013')}
            {/* <button onClick={() => saveOtherData()}>SaveData</button> */}
        </>
    )
}

export default forwardRef(ActivationFormReferedByOther)