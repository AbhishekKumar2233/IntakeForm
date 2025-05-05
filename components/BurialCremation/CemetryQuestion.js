import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Modal, Row, Col, Form, Button } from 'react-bootstrap'
import { $Service_Url } from '../network/UrlPath';
import { postApiCall, getApiCall, isNotValidNullUndefile } from '../Reusable/ReusableCom';
import konsole from '../control/Konsole';
import { $AHelper } from '../control/AHelper';
import { isValidateNullUndefine } from '../Reusable/ReusableCom';
import PlaceOfBirth from '../PlaceOfBirth';

const _burialCremationQuestionId = [463, 1023, 1024, 1025]

const newObj = () => {
    return { nameOfContact: "", nameOfCmp: "", contactNo: "", cellNo: "", address: "", website: "", faxNo: "" }
}

const CemetryQuestion = (props, ref) => {
    const { memberUserId, memberName, setLoader, typeOfRefrence, isUpdateRender, checkedValueCremetry, updateSameAsCremetry, getCremetryPrimaryData, isUpdate } = props


    const [formlabelData, setFormlabelData] = useState({})
    const [ques463, setQues463] = useState({})
    const [ques1023, setQues1023] = useState({})
    const [question1023Values, setQuestion1023Values] = useState({ ...newObj() })
    const [ques1024, setQues1024] = useState({})
    const [ques1025, setQues1025] = useState({})
    // *******************____DEFINE__USEEFFECT____*************************
    useEffect(() => {
        fectchsubjectForFormLabelId()
    }, [memberUserId])
    // *******************____DEFINE__USEImperative handle____*************************

    useImperativeHandle(ref, () => ({
        saveData,
    }))


    useEffect(() => {

        if (checkedValueCremetry == true) {
            if (typeOfRefrence == "Primary") {
                updateSameAsCremetry(formlabelData, ques463, ques1023, question1023Values, ques1024, ques1025)
            } else {
                setFormlabelData(getCremetryPrimaryData?.formlabelData)
                if (isNotValidNullUndefile(getCremetryPrimaryData)) {
                    setQues1024(getCremetryPrimaryData?.ques1024)
                    setQues1025(getCremetryPrimaryData?.ques1025)
                    setQues463(getCremetryPrimaryData?.ques463)
                    setQues1023(getCremetryPrimaryData?.ques1023)
                    setQuestion1023Values(getCremetryPrimaryData?.question1023Values)
                }
            }
        }
    }, [ques463, ques1023, question1023Values, ques1024, ques1025, isUpdateRender, checkedValueCremetry, getCremetryPrimaryData])


    // *******************____DEFINE__USEEFFECT____*************************


    const fectchsubjectForFormLabelId = async () => {
        if (_burialCremationQuestionId?.length == 0 || !memberUserId) return;
        let formlabelData = {}
        konsole.log('_burialCremationQuestionIdee', _burialCremationQuestionId)
        setLoader(true)
        let resultsubjectlabel = await postApiCall('POST', $Service_Url.getsubjectForFormLabelId, _burialCremationQuestionId);
        konsole.log('resultsubjectlabel', resultsubjectlabel)
        if (resultsubjectlabel == 'err') return;
        for (let obj of resultsubjectlabel.data.data) {
            let label = "label" + obj.formLabelId;
            formlabelData[label] = obj.question;
            let result = await getApiCall('GET', $Service_Url.getSubjectResponse + memberUserId + `/0/0/${formlabelData[label].questionId}`, null);
            konsole.log('resultresult', result)
            if (result !== 'err' && result?.userSubjects?.length != 0) {
                let responseData = result?.userSubjects[0];

                for (let i = 0; i < formlabelData[label].response.length; i++) {
                    if (formlabelData[label].response[i].responseId === responseData.responseId) {
                        if (props?.typeOfRefrence === "Primary" && label == 'label463') { isUpdate(responseData.userSubjectDataId, "cemetery") }
                        if (responseData.responseNature == "Radio") {
                            formlabelData[label].response[i]["checked"] = true;
                            formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        } else if (responseData.responseNature == "Text") {

                            formlabelData[label].response[i]["response"] = responseData.response;
                            formlabelData[label].response[i]["response"] = responseData.response;
                            formlabelData[label].response[i]["subResponseData"] = responseData.response;
                            formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                            if (responseData?.questionId == 227 && responseData.response != undefined && responseData.response != null && responseData.response != '') {
                                let keyValuePairs = responseData?.response?.split("&&");
                                let contactInfo = Object.fromEntries(keyValuePairs.map(function (keyValue) {
                                    var pair = keyValue?.split("=");
                                    var key = pair[0];
                                    var value = decodeURIComponent(pair[1]);
                                    return [key, value];
                                }));
                                if (contactInfo?.contactNo?.length > 0) {
                                    contactInfo.contactNo = contactInfo?.contactNo?.slice(0, 10)
                                }
                                if (contactInfo?.cellNo?.length > 0) {
                                    contactInfo.cellNo = contactInfo?.cellNo?.slice(0, 10)
                                }
                                if (contactInfo?.faxNo?.length > 0) {
                                    contactInfo.faxNo = contactInfo?.faxNo?.slice(0, 10)
                                }


                                konsole.log('contactInfocontactInfocontactInfo', contactInfo,)
                                setQuestion1023Values(contactInfo)
                            }
                        }
                    }
                }
            }
        }
        setLoader(false)
        setFormlabelData(formlabelData)
    }


    // *******************____@Save data____*************************

    const saveData = async () => {
        let userSubjects = []
        if ($AHelper.objectvalidation(ques463)) {
            userSubjects.push(ques463)
        }
        if ($AHelper.objectvalidation(ques1023)) {
            let _allCapitalContact = { ...ques1023, subResponseData: ques1023.subResponseData };
            userSubjects.push(_allCapitalContact)
        }
        if ($AHelper.objectvalidation(ques1024)) {
            userSubjects.push(ques1024)
        }
        if ($AHelper.objectvalidation(ques1025)) {
            userSubjects.push(ques1025)
        }
        let jsonobj = { "userId": memberUserId, "userSubjects": userSubjects }
        // console.log('jsonobjjsonobj', jsonobj)
        return new Promise(async (resolve, reject) => {
            if (userSubjects?.length > 0) {
                setLoader(true)
                const resultSaveSubject = await postApiCall('PUT', $Service_Url.putusersubjectdata, jsonobj)
                setLoader(false)
                konsole.log('resultSaveSubject', resultSaveSubject)
                resolve('res api call')
            } else {
                resolve('err')
            }
        })

    }


    //  ********************************____________________CREATE INPUT JSON____________________*************************************************
    const metaDatafunJson = (userSubjectDataId, eventValue, eventId, subjectId) => {
        return { userSubjectDataId: userSubjectDataId, subjectId: subjectId, subResponseData: eventValue, responseId: eventId }
    }
    // *****************************____________Create @Input  Json_______****************


    //  *****************************************@Radio Change*****************************
    const handleRadioChange = (event, formLabelDatawithlabel, formlabelwithlabel, setState) => {
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
        setState(returnMetaData)

    }


    // *******************************____________@INPUT CHANGE_________________________________

    const handleInputChange = (setState, objectVal, id, value) => {
        const eventId = formlabelData?.label1023?.response[0].responseId
        const userSubjectDataId = (formlabelData?.label1023?.userSubjectDataId) ? formlabelData?.label1023?.userSubjectDataId : 0
        const subjectId = formlabelData?.label1023?.questionId;
        let objVal = objectVal;
        objVal[id] = value;
        const singleVariable = Object?.entries(objVal).map(([key, value]) => `${key}=${value ? encodeURIComponent(value) : ""}`).join("&&");

        setFormlabelData(prevState => ({
            ...prevState,
            ['label1023']: {
                ...prevState['label1023'],
                response: prevState['label1023'].response.map(item => ({
                    ...item,
                    subResponseData: singleVariable
                }))
            }
        }));

        let returnMetaData = metaDatafunJson(userSubjectDataId, singleVariable, eventId, subjectId)
        // console.log('returnMetaDataJson', returnMetaData)
        setState(returnMetaData)
    }


    const _questionAndAnswerRadio = (formLabelDatawithlabel, name, withlabel, setState) => {
        return (<>
            <div className="mt-1 d-flex w-100">
                <p style={{ width: "70%" }}>{formLabelDatawithlabel && formLabelDatawithlabel.question}{" "} </p>
                <p style={{ width: "30%" }} >{formLabelDatawithlabel && formLabelDatawithlabel?.response.map((response) => {
                    konsole.log("response", response?.checked);
                    const checked = isValidateNullUndefine(response.checked) ? false : true
                    return (
                        <Form.Check
                            key={response.responseId}
                            inline
                            className="left-radio"
                            type="radio"
                            onChange={(e) => handleRadioChange(e, formLabelDatawithlabel, withlabel, setState)}
                            checked={checked}
                            value={response.response}
                            label={response.response}
                            id={response.responseId}
                            name={`${name}${typeOfRefrence}`}
                        />
                    );
                })}</p>
            </div>
        </>)
    }




    const handleStateUpdate = (id, value) => {
        const eValue = isNotValidNullUndefile(value) ? value : ""
        setQuestion1023Values(prev => ({
            ...prev, [id]: eValue
        }))

        handleInputChange(setQues1023, question1023Values, id, eValue)
    }
    // **********************************************************************************
    konsole.log('question1023Values', question1023Values)

    konsole.log('formlabelDataformlabelData', formlabelData)


    konsole.log('cemetryFormLabelData', formlabelData)

    konsole.log('formlabelData?.label1018', formlabelData?.label1018)




    if (Object.keys(formlabelData).length == 0) {
        return (
            <>
                <p className='fw-bold mb-2'>{$AHelper.capitalizeAllLetters(memberName)}</p>
                Loading ...
            </>
        )
    }

    return (
        <>
            <p className='fw-bold mb-2'>{$AHelper.capitalizeAllLetters(memberName)}</p>
            {_questionAndAnswerRadio(formlabelData?.label463, 'label463', 'label463', setQues463)}
            {(formlabelData?.label463?.response?.find((item) => item?.response == 'Yes')?.checked == true) &&
                <>
                    <ContactWebSiteDetails handleStateUpdate={handleStateUpdate} question1023Values={question1023Values} />
                </>
            }
            {(formlabelData?.label463?.response?.find((item) => item?.response == 'No')?.checked == true) &&
                <>
                    {_questionAndAnswerRadio(formlabelData?.label1024, 'label1024', 'label1024', setQues1024)}
                    {(formlabelData?.label1024?.response?.find((item) => item?.response == 'Yes')?.checked == true) && <>
                        {_questionAndAnswerRadio(formlabelData?.label1025, 'label1025', 'label1025', setQues1025)}
                        {(formlabelData?.label1025?.response?.find((item) => item?.response == 'Yes')?.checked == true) &&
                            <>
                                <p>We will get someone to call you </p>
                            </>
                        }
                        {(formlabelData?.label1025?.response?.find((item) => item?.response == 'No')?.checked == true) &&
                            <>
                                <p > We strongly suggest you take the initiative and get this detail addressed.  It will go a long way to ensure that your needs are less of a burden to loved ones, and you will likely also save your estate assets in the meanwhile.  </p>
                            </>
                        }
                    </>}
                    {(formlabelData?.label1024?.response?.find((item) => item?.response == 'No')?.checked == true) && <>
                        <p>We strongly suggest you take the initiative and get this detail addressed.  It will go a long way to ensure that your needs are less of a burden to loved ones, and you will likely also save your estate assets in the meanwhile</p>
                    </>}
                </>
            }
        </>
    )
}


const ContactWebSiteDetails = ({ handleStateUpdate, question1023Values }) => {
    const [errorMessage, setErrorMessage] = useState();

    function isUrlValid(userInput) {
        let testUrl = userInput;
        if (userInput) {
            testUrl = userInput.toLowerCase();
        }
        if (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(testUrl)) {
            setErrorMessage(false);
            handleStateUpdate('website', userInput)
        } else {
            handleStateUpdate('website', userInput)
            setErrorMessage(true);
        }
    }

    return (
        <>

            {/*Contact Name */}
            <div className="mt-2">
                <Row className='mt-3'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p>Name of Contact</p>
                        <input
                            className="border rounded upperCasing "
                            type="text"
                            placeholder="Name of Contact"
                            pattern="[a-zA-Z'-'\s]*"
                            value={question1023Values?.nameOfContact}
                            onChange={(e) => {
                                const result = e.target.value.replace(/[^a-zA-Z ]/gi, "");
                                handleStateUpdate('nameOfContact', result)
                            }}
                        />

                    </Col>
                </Row>
            </div>
            {/* Company Name */}
            <div className="mt-2">
                <Row className='mt-3'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p>Name of Cemetery</p>
                        <input
                            className="border rounded upperCasing"
                            type="text"
                            placeholder="Name of Cemetery"
                            value={question1023Values?.nameOfCmp}
                            onChange={(e) => { handleStateUpdate('nameOfCmp', e.target.value) }}
                        />
                    </Col>
                </Row>
            </div>
            {/* Contact No. */}
            <div className="mt-2">
                <Row className='mt-3'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p>Contact Number</p>
                        <input
                            className="border rounded"
                            type="text"
                            placeholder={"Contact Number"}
                            onChange={(e) => {
                                const result = e?.target?.value.replace(/[^0-9]/gi, "");
                                handleStateUpdate('contactNo', result)
                            }}
                            value={$AHelper?.formatPhoneNumber2(question1023Values?.contactNo)}
                            maxLength={14}
                        />
                        {(question1023Values?.contactNo?.length > 0 && ($AHelper.formatPhoneNumber2(question1023Values?.contactNo)?.length <= 10 || $AHelper.formatPhoneNumber2(question1023Values?.contactNo)?.length == null)) && <p style={{ color: "#d2222d" }}>Contact Number is not valid</p>}

                    </Col>
                </Row>
            </div>
            {/* Cell NO. */}
            <div className="mt-2">
                <Row className='mt-3'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p>Cell Number</p>
                        <input
                            className="border rounded"
                            onChange={(e) => {
                                const result = e?.target?.value.replace(/[^0-9]/gi, "");
                                handleStateUpdate('cellNo', result)
                            }}
                            placeholder="Cell Number"
                            value={$AHelper.formatPhoneNumber2(question1023Values?.cellNo)}
                            maxLength={14}
                        />

                        {(question1023Values?.cellNo?.length > 0 && ($AHelper.formatPhoneNumber2(question1023Values?.cellNo)?.length <= 10 || $AHelper.formatPhoneNumber2(question1023Values?.cellNo)?.length == null)) && <p style={{ color: "#d2222d" }}>Cell Number is not valid</p>}
                    </Col>
                </Row>

            </div>
            <div className="mt-2">
                <Row className='mt-3'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p>Plot No.</p>
                        <input
                            className="border rounded"
                            type="text"
                            placeholder="Enter Plot No."
                            size="30"
                            value={question1023Values?.plotNo}
                            onChange={(e) => handleStateUpdate('plotNo', e?.target?.value)}
                        />
                    </Col>
                </Row>
            </div>
            <div className="mt-2">
                <Row className='mt-3'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p>Address</p>

                        <PlaceOfBirth placeholder={"Address"} addressDetails={(e) => handleStateUpdate('address', e?.addressLine1)} addressData={question1023Values?.address} />
                    </Col>
                </Row>
            </div>
            <div className="mt-2">
                <Row className='mt-3'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p>Website</p>
                        <input
                            className="border rounded"
                            type="url"
                            placeholder="https://example.com"
                            pattern="https://.*"
                            size="30"
                            required
                            value={question1023Values.website}
                            onChange={(e) => isUrlValid(e.target.value)}
                        />
                        {errorMessage == true && question1023Values?.length != 0 ? (
                            <p style={{ color: "#d2222d" }}>Url is not valid</p>
                        ) : null}
                    </Col>
                </Row>
            </div>
            <div className="mt-2">
                <Row className='mt-3'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p>Fax Number</p>
                        <input
                            className="border rounded"
                            defaultValue={$AHelper.formatPhoneNumber2(question1023Values?.faxNo)}
                            onChange={(e) => {
                                const _result = e?.target?.value.replace(/[^0-9]/gi, "");
                                handleStateUpdate('faxNo', _result)
                            }}
                            placeholder={"Fax Number"}
                            value={$AHelper.formatPhoneNumber2(question1023Values?.faxNo)}
                            maxLength={14}
                        />
                        {(question1023Values?.faxNo?.length > 0 && ($AHelper.formatPhoneNumber2(question1023Values?.faxNo)?.length <= 10 || $AHelper.formatPhoneNumber2(question1023Values?.faxNo)?.length == null)) && <p style={{ color: "#d2222d" }}>Fax Number is not valid</p>}

                    </Col>
                </Row>
            </div>

        </>
    )
}
export default forwardRef(CemetryQuestion)