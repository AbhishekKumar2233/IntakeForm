
import React, { useState, useEffect, useContext, useImperativeHandle, forwardRef, useRef } from 'react'
import { Modal, Row, Col, Form, Button } from 'react-bootstrap'
import { $Service_Url } from './network/UrlPath'
import { InputCom, SelectCom, getApiCall, postApiCall, isValidateNullUndefine } from './Reusable/ReusableCom'
import konsole from './control/Konsole'
import { $CommonServiceFn } from './network/Service'
import { Dropdown } from 'react-bootstrap';
import { referdByQuestion, refereByOther } from './control/Constant'
import ActivationFormReferedByOther from './Activationform/ActivationFormReferedByOther'
const ReferedBy = (props, ref) => {
    const { dispatchloader, memberStatusId, memberUserid, setSpecialNeedDetails, setSpecialNeedmember, setLoader } = props
    const refOtherReferedBy = useRef(null)
    const [formlabelData, setFormlabelData] = useState({})
    const [selectedSubjects, setSelectedSubjects] = useState({
        userId: memberUserid,
        userSubjects: [],
    });
    const [selectedSubjectsAdd, setSelectedSubjectsAdd] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);

    const handleInputChange = (e, formLabelDatawithlabel, withlabel) => {
        const { id: eventId, name: eventName, checked, value } = e.target;
      
        if (checked) {
            setSelectedValues(prevValues => [...prevValues, eventName]);
        } else {
            setSelectedValues(prevValues => prevValues.filter(val => val !== eventName));
        }
    
        // Additional logic from the second function
        e.stopPropagation();
        const questionId = e.target.getAttribute("data-questionId");
        const userSubjectDataId = e.target.getAttribute("data-userSubjectDataId");
        const eventChecked = checked;
        handleUpdateSubmitSeconde(userSubjectDataId, eventChecked, eventId, questionId, eventName, withlabel);
    };
    
    const placeholderText = selectedValues.length > 0 ? selectedValues?.join(', ') : "Select";



    useEffect(() => {
        fectchsubjectForFormLabelId()
    }, [])


    useImperativeHandle(ref, () => ({
        toggleVisibility,

    }))

    const toggleVisibility = async () => {
        if (refOtherReferedBy?.current) {
            refOtherReferedBy?.current?.saveOtherData();
        }
        if (selectedSubjectsAdd.length > 0) {
            addResponse(selectedSubjectsAdd)
        }
        if (selectedSubjects.userSubjects.length > 0) {
            let json2 = selectedSubjects.userSubjects.filter(ele => ele.userSubjectDataId != 0)
            let data = {
                userId: memberUserid,
                userSubjects: json2
            }
            updateResponse(data)

        }

    }

    const updateResponse = (json) => {
        setLoader(true)
        $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putSubjectResponse, json, (response, error) => {
            if (response) {
                setLoader(false)
                fectchsubjectForFormLabelId()
                setSelectedSubjects({
                    ...selectedSubjects,
                    userSubjects: [],
                });
            } else {
                setLoader(false)
            }
        })

    }
    const addResponse = (json) => {
        setLoader(true)
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postaddusersubjectdata, json, (response) => {
            if (response) {
                setLoader(false)
                fectchsubjectForFormLabelId()
                setSelectedSubjectsAdd([])
            } else {
                setLoader(false)
            }
        })

    }



    const fectchsubjectForFormLabelId = async () => {
        let formlabelData = {}
        setLoader(true)
        let resultsubjectlabel = await postApiCall('POST', $Service_Url.getsubjectForFormLabelId, referdByQuestion);

        if (resultsubjectlabel == 'err') return;
        for (let obj of resultsubjectlabel.data.data) {
            let label = "label" + obj.formLabelId;

            formlabelData[label] = obj.question;
            let result = await getApiCall('GET', $Service_Url.getSubjectResponse + memberUserid + `/0/0/${formlabelData[label].questionId}`, null);
            if (result !== 'err' && result?.userSubjects?.length != 0) {
                let responseData = result?.userSubjects;
                if (result !== 'err' && result?.userSubjects?.length != 0) {
                    for (let i = 0; i < formlabelData[label].response.length; i++) {
                        for (let j = 0; j < responseData.length; j++) {
                            if (formlabelData[label].response[i].responseId === responseData[j].responseId) {
                                if (responseData[j].responseNature == "CheckBox") {
                                    if (responseData[j].questionId == "213") {
                                        formlabelData[label].response[i]["userSubjectDataId"] = responseData[j].userSubjectDataId;
                                        formlabelData[label].response[i]["isActive"] = responseData[j].response ==  null ? false : true ;
                                    }
                                }
                            }

                        }

                    }
                }
            }
        }
        setLoader(false)
        let filterData = formlabelData?.label1009?.response?.filter((ele)=> ele?.isActive == true)
        const newJson = filterData.map((ele) => ele.response);
        setSelectedValues(newJson);
        setFormlabelData(formlabelData)
    }

    const metaDatafunJson = (userSubjectDataId, eventValue, eventId, subjectId) => {
        return { userSubjectDataId: userSubjectDataId, subjectId: subjectId, subResponseData: eventValue, responseId: eventId }
    }

    const handleRadioChange = (event, formLabelDatawithlabel, formlabelwithlabel) => {
        event.stopPropagation()
        const eventId = event.target.id;
        const eventValue = event.target.value;
        const eventName = event.target.name;
        const userSubjectDataId = (formLabelDatawithlabel?.userSubjectDataId) ? formLabelDatawithlabel?.userSubjectDataId : 0
        const subjectId = formLabelDatawithlabel?.questionId;

        konsole.log('formLabelDatawithlabel', formLabelDatawithlabel, formlabelwithlabel)
        setFormlabelData(prevState => ({
            ...prevState,
            [formlabelwithlabel]: {
                ...prevState[formlabelwithlabel],
                response: prevState[formlabelwithlabel].response.map(item => ({
                    ...item,
                    checked: item.responseId == eventId ? true : false
                }))
            }
        }));
        let returnMetaData = metaDatafunJson(userSubjectDataId, eventValue, eventId, subjectId)
        konsole.log('returnMetaDatareturnMetaData', returnMetaData)
        setSpecialNeedmember(returnMetaData)

    }
 
    const handleUpdateSubmitSeconde = async (userSubjectDataId, eventChecked, responseId, questionId, subResponseData, formlabelwithlabel) => {
        setFormlabelData(prevState => ({
            ...prevState,
            [formlabelwithlabel]: {
                ...prevState[formlabelwithlabel],
                response: prevState[formlabelwithlabel].response.map(item => ({
                    ...item,
                    isActive: item?.responseId == responseId ? eventChecked : item?.isActive
                }))
            }
        }));

        if (eventChecked) {

            if (selectedSubjects?.userSubjects.length > 0 && selectedSubjects?.userSubjects.find(ele => ele?.responseId === responseId)) {

                setSelectedSubjects((prevSelected) => ({
                    ...prevSelected,
                    userSubjects: prevSelected.userSubjects.filter(
                        (subject) => subject.responseId !== responseId
                    ),
                }));
            } else {
                if (userSubjectDataId == 0) {
                    if (!Array.isArray(selectedSubjectsAdd)) {
                        setSelectedSubjectsAdd([
                            {
                                userSubjectDataId,
                                subjectId: questionId,
                                subResponseData,
                                responseId,
                                userId: memberUserid
                            },
                        ]);
                    } else {
                        setSelectedSubjectsAdd([
                            ...selectedSubjectsAdd,
                            {
                                userSubjectDataId,
                                subjectId: questionId,
                                subResponseData,
                                responseId,
                                userId: memberUserid
                            },
                        ]);
                    }
                } else {
                    setSelectedSubjects({
                        ...selectedSubjects,
                        userSubjects: [
                            ...selectedSubjects.userSubjects,
                            {
                                userSubjectDataId,
                                subjectId: questionId,
                                subResponseData,
                                responseId,
                            },
                        ],
                    });
                }


            }
        } else {
            if (selectedSubjectsAdd.length > 0 && selectedSubjectsAdd.find(ele => ele?.responseId === responseId)) {

                setSelectedSubjectsAdd((prevSelected) => prevSelected.filter(
                    (subject) => subject.responseId !== responseId
                ));
            } else {
                setSelectedSubjects({
                    ...selectedSubjects,
                    userSubjects: [
                        ...selectedSubjects.userSubjects,
                        {
                            userSubjectDataId,
                            subjectId: questionId,
                            subResponseData: null,
                            responseId,
                        },
                    ],
                });

            }
            if (selectedSubjects?.userSubjects.length > 0 && selectedSubjects?.userSubjects.find(ele => ele?.responseId === responseId)) {

                setSelectedSubjects((prevSelected) => ({
                    ...prevSelected,
                    userSubjects: prevSelected.userSubjects.filter(
                        (subject) => subject.responseId !== responseId
                    ),
                }));
            } else {
                if (userSubjectDataId != 0) {
                    setSelectedSubjects({
                        ...selectedSubjects,
                        userSubjects: [
                            ...selectedSubjects.userSubjects,
                            {
                                userSubjectDataId,
                                subjectId: questionId,
                                subResponseData: null,
                                responseId,
                            },
                        ],
                    });
                }

            }







        }


    };
    const QuestionAndAnswerRadio = (formLabelDatawithlabel, name, withlabel) => {
        return (
            <>
                <div class="d-flex justify-content-between">
                    <p>{formLabelDatawithlabel && formLabelDatawithlabel.question}{" "} </p>
                    <p>{formLabelDatawithlabel && formLabelDatawithlabel?.response.map((response) => {
                        konsole.log("response", response?.checked);
                        const checked = isValidateNullUndefine(response.checked) ? false : true
                        return (
                            <Form.Check
                                key={response.responseId}
                                inline
                                className="left-radio"
                                type="radio"
                                onChange={(e) => handleRadioChange(e, formLabelDatawithlabel, withlabel)}
                                checked={checked}
                                value={response.response}
                                label={response.response}
                                id={response.responseId}
                                name={name}
                            />
                        );
                    })}</p>
                </div>
            </>
        )
    }


    const QuestionAndAnswerInput = (formLabelDatawithlabel, name, withlabel) => {
        return (
            <>
                <div className="dropdown">
                    <Dropdown drop="down">
                        <Dropdown.Toggle variant="primary" id="dropdownMenuButton" style={{ backgroundColor: 'white', color: 'black', border: "0.1px solid #ced4da" }}>

                            {placeholderText}
                        </Dropdown.Toggle>
                        <Dropdown.Menu onClick={(e) => e.stopPropagation()}>
                            {formLabelDatawithlabel && formLabelDatawithlabel?.response.map((response) => (

                                <React.Fragment key={response.responseId}>

                                    <Dropdown.Item href="#">
                                        <div className="form-check" style={{ width: "13rem" }}>
                                            <input
                                                className="form-check-input me-2"
                                                type="checkbox"
                                                defaultChecked={response?.isActive}
                                                value={response.resFormLabelId}
                                                data-userSubjectDataId={response?.userSubjectDataId ?? 0}
                                                id={response.responseId}
                                                data-questionId={formLabelDatawithlabel.questionId}
                                                name={response.response}
                                                onClick={(e) => handleInputChange(e, formLabelDatawithlabel, withlabel)}
                                            />
                                            <label className="form-check-label" htmlFor={response.responseId}>{response.response}</label>
                                        </div>
                                    </Dropdown.Item>
                                    {(response.responseId == '418' && response.isActive == true) && (
                                        <React.Fragment>
                                            <p>
                                                <ActivationFormReferedByOther ref={refOtherReferedBy} setLoader={setLoader} questionFormLabelId={refereByOther} />
                                            </p>
                                        </React.Fragment>
                                    )}
                                </React.Fragment>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </>
        )
    }
    const returnvalue = (formLabelData) => {
        konsole.log("formLabelDataformLabelData", formLabelData)
        if (formLabelData !== undefined) {
            for (let item of formLabelData?.response) {
                // if (item.response === 'Yes' && item?.checked === true) {
                return true
                // }
            }
        }
    }

    return (
        <>
            <div style={{marginTop:"auto"}}>
            <label className='mb-1'>{formlabelData?.label1009?.question}</label>  
                {QuestionAndAnswerRadio(formlabelData?.label1007, '', 'label1009')}
                {(returnvalue(formlabelData?.label1009) === true) &&
                    QuestionAndAnswerInput(formlabelData?.label1009, 'stylehomeSub', 'label1009')}
            </div>
        </>
    )
};
export default forwardRef(ReferedBy)