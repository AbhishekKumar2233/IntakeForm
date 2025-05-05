import React, { useState, useEffect, useContext, useImperativeHandle, forwardRef } from 'react'
import { Modal, Row, Col, Form, Button } from 'react-bootstrap'
import { $Service_Url } from './network/UrlPath';
import { $AHelper } from './control/AHelper';
import { InputCom, SelectCom, getApiCall, postApiCall, isValidateNullUndefine, isNotValidNullUndefile  } from './Reusable/ReusableCom';
import konsole from './control/Konsole';
import AlertToaster from './control/AlertToaster';

const questionFormLabelId = [1033]
const AlsoKnownAs = (props, ref) => {
    const { setLoader } = props
    const [formlabelData, setFormlabelData] = useState({})
    const primaryMemberUserId = props?.userId
    console.log("primaryMemberUserIdprimaryMemberUserId",primaryMemberUserId)
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
            if(isNotValidNullUndefile(primaryMemberUserId)){
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
        }
        konsole.log('formlabelData', formlabelData);
        setFormlabelData(formlabelData)
    }

    // ********************________________________SAVE____DATA_________________________*********************************************
    const saveOtherData = async (userId) => {
        let userSubjects = []
        if ($AHelper.objectvalidation(referedByOther)) {
            userSubjects.push(referedByOther)
        }
        let jsonobj = { "userId": userId, "userSubjects": userSubjects }
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
                    subResponseData: $AHelper.capitalizeFirstLetter(eventValue)
                }))
            }
        }));
        let returnMetaData = metaDatafunJson(userSubjectDataId, eventValue, eventId, subjectId)
        konsole.log('returnMetaData', returnMetaData)
        setReferedByOther(returnMetaData)
        if( props?.updateAlsoKnownAsData){
            props?.updateAlsoKnownAsData(returnMetaData)
        }
    }

    // **********************************____________________QUESTION_AND ANSWER INPUT__________________******************************************************
    const QuestionAndAnswerInput = (formLabelDatawithlabel, name, withlabel) => {
        return (
            <>
                    <p>{formLabelDatawithlabel && formLabelDatawithlabel?.response.map((response) => {
                        konsole.log("response", response?.checked);
                        return (
                            <Form.Control type='text'
                                id={response.responseId}
                                placeholder='Also Known As'
                                value={response.subResponseData}
                                name={name}
                                onChange={(e) => handleInputChange(e, formLabelDatawithlabel, withlabel)}
                                className='custom-input'
                            />
                        )
                    })}</p>
            </>
        )
    }

    if(props.valueforPDF == true) {
        return <input type="text" class="previous p-0" id="prev-name" value={formlabelData?.label1033?.response?.[0]?.subResponseData || ""}></input>;
    }

    return (
        <>
            {QuestionAndAnswerInput(formlabelData?.label1033, 'OtherReferedBy', 'label1033')}
            {/* <button onClick={() => saveOtherData()}>SaveData</button> */}
        </>
    )
}

export default forwardRef(AlsoKnownAs)