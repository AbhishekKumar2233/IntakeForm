import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Modal, Row, Col, Form, Button, Table } from 'react-bootstrap'
import { $Service_Url } from '../network/UrlPath';
import { postApiCall, getApiCall, isNotValidNullUndefile } from '../Reusable/ReusableCom';
import konsole from '../control/Konsole';
import { $AHelper } from '../control/AHelper';
import { isValidateNullUndefine } from '../Reusable/ReusableCom';
import PlaceOfBirth from '../PlaceOfBirth';
import DatepickerComponent from '../DatepickerComponent';
import OtherInfo from '../asssets/OtherInfo';
import { $CommonServiceFn } from '../network/Service';
import BurialCremationDocUploadView from './BurialCremationDocUploadView';

const newObj = () => {
    return { nameOfInsuranceCmp: "", policyNo: "", issueDate: "", address: "", contactNo: "", website: "" }
}

const newObj2 = () => {
    return { nameOfContact: "", nameOfCmp: "", contactNo: "", cellNo: "", address: "", website: "", faxNo: "" }
}

const _burialCremationQuestionId = [464, 933, 934, 935, 936, 937, 938, 939, 1018, 1019, 1020, 1021, 1022, 1027, 1029]
const BurialCremationQuestion = (props, ref) => {

    const { memberUserId, memberName, setLoader, typeOfRefrence, getPrimryDetails, isUpdateRender, isUpdate } = props
    const [formlabelData, setFormlabelData] = useState({})
    const [nameOfContact, setNameOfContact] = useState({})
    const [nameOfFuneralHome, setNameOfFuneralHome] = useState({})
    const [conactNo, setConactNo] = useState({})
    const [cellNo, setCellNo] = useState({})
    const [address, setAddress] = useState({})
    const [website, setWebsite] = useState({})
    const [faxNo, setFaxNo] = useState({})
    const [description, setDescription] = useState({})

    const [ques464, setQues464] = useState({})
    const [ques1018, setQues1018] = useState({})
    const [ques1019, setQues1019] = useState({})
    const [ques1020, setQues1020] = useState({})
    const [ques1020Value, setQues1020Value] = useState({ ...newObj() })
    const [question1022Value, setQuestion1022Value] = useState({ ...newObj2() })
    const [ques1021, setQues1021] = useState({})
    const [ques1022, setQues1022] = useState({})
    const [ques1027, setQues1027] = useState({})
    const [lifeInsurance, setlifeInsurance] = useState([])


    useEffect(() => {
        if (props?.checkedValueBurial == true) {
            if (props?.typeOfRefrence === "Primary") {
                props?.updateSameas(formlabelData, nameOfContact, nameOfFuneralHome, conactNo, cellNo, address, website, faxNo, ques464, ques1018, ques1019, ques1020, ques1021, ques1022, question1022Value, ques1020Value, ques1027, lifeInsurance, description);
            } else {
                setFormlabelData(getPrimryDetails?.formlabelData);
                if (isNotValidNullUndefile(getPrimryDetails)) {
                    setAddress(getPrimryDetails?.address)
                    setCellNo(getPrimryDetails?.cellNo)
                    setConactNo(getPrimryDetails?.conactNo)
                    setFaxNo(getPrimryDetails?.faxNo)
                    setNameOfContact(getPrimryDetails?.nameOfContact)
                    setNameOfFuneralHome(getPrimryDetails?.nameOfFuneralHome)
                    setQues464(getPrimryDetails?.ques464)
                    setQues1018(getPrimryDetails?.ques1018)
                    setQues1019(getPrimryDetails?.ques1019)
                    setQues1020(getPrimryDetails?.ques1020)
                    setQues1021(getPrimryDetails?.ques1021)
                    setQues1022(getPrimryDetails?.ques1022)
                    setWebsite(getPrimryDetails?.website)
                    setQues1020Value(getPrimryDetails?.ques1020Value)
                    setQuestion1022Value(getPrimryDetails?.question1022Value)
                    setQues1027(getPrimryDetails?.ques1027)
                    setlifeInsurance(getPrimryDetails?.lifeInsurance)
                    setDescription(getPrimryDetails?.description)

                }
            }
        }



    }, [isUpdateRender, getPrimryDetails, nameOfContact, nameOfFuneralHome, conactNo, cellNo, address, website, faxNo, ques464, ques1018, ques1019, ques1020, ques1021, ques1022, props?.checkedValueBurial, ques1027, lifeInsurance, description]);



    // *******************____DEFINE__USEEFFECT____*************************
    useEffect(() => {
        fectchsubjectForFormLabelId()
        fetchLifeInsurance(memberUserId)
    }, [memberUserId])
    // *******************____DEFINE__USEEFFECT____*************************


    // *******************____DEFINE__useImperativeHandle____*************************
    useImperativeHandle(ref, () => ({
        saveData,
    }))
    // *******************____DEFINE__useImperativeHandle____*************************



    function decodeKeyValuePairs(encodedString) {
        const objVal = {};
        encodedString.split('&&').forEach(pair => {
            const [key, value] = pair.split('=');
            objVal[key] = decodeURIComponent(value);
        });
        return objVal;
    }
    function removeUSFormatting(phoneNumber) {
        return phoneNumber.replace(/\D/g, '');
    }
    const fectchsubjectForFormLabelId = async () => {
        if (_burialCremationQuestionId?.length == 0 || !memberUserId) return;
        let formlabelData = {}
        setLoader(true)
        let resultsubjectlabel = await postApiCall('POST', $Service_Url.getsubjectForFormLabelId, _burialCremationQuestionId);
        if (resultsubjectlabel == 'err') return;

        setLoader(true)
        for (let obj of resultsubjectlabel.data.data) {
            let label = "label" + obj.formLabelId;
            formlabelData[label] = obj.question;
            let result = await getApiCall('GET', $Service_Url.getSubjectResponse + memberUserId + `/0/0/${formlabelData[label].questionId}`, null);
            konsole.log('resultresult', result)
            if (result !== 'err' && result?.userSubjects?.length != 0) {
                let responseData = result?.userSubjects[0];

                for (let i = 0; i < formlabelData[label].response.length; i++) {
                    if (formlabelData[label].response[i].responseId === responseData.responseId) {

                        if (props?.typeOfRefrence === "Primary" && label == 'label464') { isUpdate(responseData.userSubjectDataId, "burial") }
                        if (responseData.responseNature == "Radio") {
                            formlabelData[label].response[i]["checked"] = true;

                            formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        } else if (responseData.responseNature == "Text") {
                            formlabelData[label].response[i]["response"] = responseData.response;
                            formlabelData[label].response[i]["response"] = responseData.response;

                            formlabelData[label].response[i]["subResponseData"] = responseData.response;
                            formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                            if (responseData?.questionId == 224 && responseData.response != undefined && responseData.response != null && responseData.response != '') {
                                let keyValuePairs = responseData?.response
                                const contactInfo = decodeKeyValuePairs(keyValuePairs);

                                konsole.log('contactInfo', contactInfo)
                                if (contactInfo?.contactNo?.length > 0) {
                                    contactInfo.contactNo = removeUSFormatting(contactInfo?.contactNo)?.slice(0, 10)
                                }
                                konsole.log("bdkjabck", responseData?.response, keyValuePairs, { ...contactInfo, userSubjectDataId: responseData.userSubjectDataId })
                                setQues1020Value({ ...contactInfo, userSubjectDataId: responseData.userSubjectDataId })
                            }
                            if (responseData?.questionId == 226 && isNotValidNullUndefile(responseData?.response)) {
                                const keyValuePairs = responseData?.response
                                const contactInfo = decodeKeyValuePairs(keyValuePairs);

                                if (contactInfo?.contactNo?.length > 0) {
                                    contactInfo.contactNo = removeUSFormatting(contactInfo?.contactNo)?.slice(0, 10)
                                }
                                if (contactInfo?.cellNo?.length > 0) {
                                    contactInfo.cellNo = removeUSFormatting(contactInfo?.cellNo)?.slice(0, 10)
                                }
                                setQuestion1022Value(contactInfo)
                            }
                        }
                    }
                }
            }
        }

        setLoader(false)
        konsole.log('formlabelData111', formlabelData)

        setFormlabelData(formlabelData)
    }

    const fetchLifeInsurance = (userId) => {
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getLifeInsByUserId + userId, "", (response) => {
            if (response) {
                konsole.log("Life InsuranceLife Insurance  ", response);
                setlifeInsurance(response.data.data.lifeInsurances);
            }
        }
        );
    };

    // ********************************_____@save Data_____************************************

    const saveData = async () => {
        let userSubjects = []
        if ($AHelper.objectvalidation(nameOfContact)) {
            let _allCapitalContact = { ...nameOfContact, subResponseData: nameOfContact.subResponseData };
            userSubjects.push(_allCapitalContact)
        }
        if ($AHelper.objectvalidation(nameOfFuneralHome)) {
            let _allCapitalFuneral = { ...nameOfFuneralHome, subResponseData: nameOfFuneralHome.subResponseData };
            userSubjects.push(_allCapitalFuneral)
        }
        if ($AHelper.objectvalidation(conactNo)) {
            userSubjects.push(conactNo)
        }
        if ($AHelper.objectvalidation(cellNo)) {
            userSubjects.push(cellNo)
        }
        if ($AHelper.objectvalidation(address)) {
            userSubjects.push(address)
        }
        if ($AHelper.objectvalidation(website)) {
            userSubjects.push(website)
        }
        if ($AHelper.objectvalidation(faxNo)) {
            userSubjects.push(faxNo)
        }
        if ($AHelper.objectvalidation(description)) {
            userSubjects.push(description)
        }
        if ($AHelper.objectvalidation(ques464)) {
            userSubjects.push(ques464)
        }
        if ($AHelper.objectvalidation(ques1018)) {
            userSubjects.push(ques1018)
        }
        if ($AHelper.objectvalidation(ques1019)) {
            userSubjects.push(ques1019)
        }
        if ($AHelper.objectvalidation(ques1020)) {
            userSubjects.push({ ...ques1020, userSubjectDataId: ques1020Value?.userSubjectDataId })
        }
        if ($AHelper.objectvalidation(ques1021)) {
            userSubjects.push(ques1021)
        }
        if ($AHelper.objectvalidation(ques1022)) {
            userSubjects.push(ques1022)
        }
        if ($AHelper.objectvalidation(ques1027)) {
            userSubjects.push(ques1027)
        }


        konsole.log(userSubjects, "dvbjwbkj")
        // return;


        return new Promise(async (resolve, reject) => {
            try {
                setLoader(true)
                if (userSubjects?.length > 0) {
                    let jsonobj = { "userId": memberUserId, "userSubjects": userSubjects }
                    const resultSaveSubject = await postApiCall('PUT', $Service_Url.putusersubjectdata, jsonobj)
                    konsole.log('resultSaveSubjectPUT', resultSaveSubject)
                }
                setLoader(false)
                resolve('res api call')
            } catch {
                resolve('err')
            }
        })

    }

    // ********************************_____@save Data_____************************************

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
    const handleInputChange = (event, formLabelDatawithlabel, formlabelwithlabel, setState, id, result) => {
        let eventId = event?.target?.id;
        let eventValue = event?.target?.value;
        let eventName = event?.target?.name;
        // konsole.log("dsdsdsdsdsd",formlabelwithlabel)

        if (formlabelwithlabel == 'label937') {
            eventId = id;
            eventValue = event?.addressLine1
        } else {
            event.stopPropagation()
        }
        if (formlabelwithlabel == 'label935' || formlabelwithlabel == 'label936' || formlabelwithlabel == 'label939') {
            eventValue = eventValue.replace(/[^0-9]/gi, "");
        }
        if (formlabelwithlabel == 'label933' || formlabelwithlabel == 'label934') {
            eventValue = eventValue.replace(/[^a-zA-Z ]/gi, "");
        } else if (formlabelwithlabel == 'label939') {

            eventValue = eventValue?.slice(0, 14)
        }
        const userSubjectDataId = (formLabelDatawithlabel?.userSubjectDataId) ? formLabelDatawithlabel?.userSubjectDataId : 0
        const subjectId = formLabelDatawithlabel?.questionId;
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
        setState(returnMetaData)
    }

    // *******************************____________@INPUT CHANGE_________________________________

    // **********************************************************************************




    const returnContactMsgTrueFalse = (number) => {
        if (number?.length > 0 && ($AHelper.formatPhoneNumber2(number)?.length <= 10 || $AHelper.formatPhoneNumber2(number)?.length == null)) {
            return true;
        }
        return false;
    }
    const validateWebUrl = (url) => {
        let testUrl = url
        if (url) {
            testUrl = url.toLowerCase();
        }
        if (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(testUrl)) {
            return false;
        }
        return true;

    }

    const _questionAndAnswerInput = (formLabelDatawithlabel, name, placeholder, withlabel, setState) => {
        return (<>
            <div className="mt-2">
                <Row className='mt-3'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p className=''>{name} </p>
                        {formLabelDatawithlabel && formLabelDatawithlabel?.response?.map((response) => {
                            let inputVal = response?.subResponseData;
                            if (withlabel == 'label935' || withlabel == 'label936' || withlabel == 'label939') {
                                let myinp = response?.subResponseData?.length > 10 ? response?.subResponseData?.slice(0, 10) : response?.subResponseData;
                                inputVal = $AHelper?.formatPhoneNumber2(myinp)
                            }

                            return (
                                <>
                                    {(name == 'Address') ? <>
                                        <PlaceOfBirth
                                            placeholder={"Address"}
                                            addressDetails={(e) => handleInputChange(e, formLabelDatawithlabel, withlabel, setState, response.responseId)}
                                            addressData={response?.subResponseData} />

                                    </> : <>
                                        <Form.Control type="text"
                                            key={formLabelDatawithlabel}
                                            id={response.responseId}
                                            placeholder={placeholder}
                                            value={inputVal}
                                            name={name}
                                            onChange={(e) => { handleInputChange(e, formLabelDatawithlabel, withlabel, setState) }}
                                            className={`${(withlabel == "label933" || withlabel == "label934") ? "upperCasing " : "custom-input"}`}
                                        />
                                        {(withlabel == 'label935' && returnContactMsgTrueFalse(response?.subResponseData)) && <p style={{ color: "#d2222d" }}>Contact Number is not valid</p>}
                                        {(withlabel == 'label936' && returnContactMsgTrueFalse(response?.subResponseData)) && <p style={{ color: "#d2222d" }}>Cell Number is not valid</p>}
                                        {(withlabel == 'label939' && returnContactMsgTrueFalse(response?.subResponseData)) && <p style={{ color: "#d2222d" }}>Fax Number is not valid</p>}
                                        {(withlabel == 'label938' && response?.subResponseData && validateWebUrl(response?.subResponseData)) && <p style={{ color: "#d2222d" }}>Url is not valid</p>}

                                    </>
                                    }

                                </>
                            )
                        })}
                    </Col>


                </Row>
            </div>
        </>)
    }

    const _questionAndAnswerRadio = (formLabelDatawithlabel, name, withlabel, setState) => {
        konsole.log(formLabelDatawithlabel, name, withlabel, setState, "formLabelDatawithlabel, name, withlabel, setState")
        return (<>
            <div className="mt-2 d-flex w-100">
                <p className='' style={{ width: "68%", textAlign: "justify" }}>{formLabelDatawithlabel && formLabelDatawithlabel.question}{" "} </p>
                <p className='' style={{ width: "2%", textAlign: "justify" }}>{" "} </p>
                <p className='' style={{ width: "30%" }} >{formLabelDatawithlabel && isNotValidNullUndefile(formLabelDatawithlabel) && formLabelDatawithlabel?.response.map((response) => {
                    konsole.log("response", response?.checked);
                    const checked = isValidateNullUndefine(response.checked) ? false : true;

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



    // ******QUESTION1020  OPTIONS ________________________

    const handleInputChange1020 = (setState, objectVal, id, value) => {
        const eventId = formlabelData?.label1020?.response[0].responseId
        const userSubjectDataId = (formlabelData?.label1023?.userSubjectDataId) ? formlabelData?.label1023?.userSubjectDataId : 0
        const subjectId = formlabelData?.label1020?.questionId;
        let objVal = objectVal;
        objVal[id] = value;
        const singleVariable = Object?.entries(objVal).map(([key, value]) => `${key}=${value ? encodeURIComponent(value) : ''}`).join("&&");

        setFormlabelData(prevState => ({
            ...prevState,
            ['label1020']: {
                ...prevState['label1020'],
                response: prevState['label1020'].response.map(item => ({
                    ...item,
                    subResponseData: singleVariable
                }))
            }
        }));

        let returnMetaData = metaDatafunJson(userSubjectDataId, singleVariable, eventId, subjectId)
        setState(returnMetaData)
    }


    // ******QUESTION1022  OPTIONS ________________________
    const handleInputChange1022 = (setState, objectVal, id, value) => {
        const eventId = formlabelData?.label1022?.response[0].responseId
        const userSubjectDataId = (formlabelData?.label1022?.userSubjectDataId) ? formlabelData?.label1022?.userSubjectDataId : 0
        const subjectId = formlabelData?.label1022?.questionId;
        let objVal = objectVal;
        objVal[id] = value;
        konsole.log('singleVariableobjVal', objVal)
        const singleVariable = Object?.entries(objVal)?.map(([key, value]) => `${key}=${value ? encodeURIComponent(value) : ''}`).join("&&");
        konsole.log('singleVariable', singleVariable)
        setFormlabelData(prevState => ({
            ...prevState,
            ['label1022']: {
                ...prevState['label1022'],
                response: prevState['label1022'].response.map(item => ({
                    ...item,
                    subResponseData: singleVariable
                }))
            }
        }));

        let returnMetaData = metaDatafunJson(userSubjectDataId, singleVariable, eventId, subjectId)
        setState(returnMetaData)
    }



    const handleStateUpdate1020 = (id, value) => {
        const eValue = isNotValidNullUndefile(value) ? value : ""
        setQues1020Value(prev => ({
            ...prev,
            [id]: value
        }));
        handleInputChange1020(setQues1020, ques1020Value, id, eValue)
    }
    const handleStateUpdate1022 = (id, value) => {

        const eValue = isNotValidNullUndefile(value) ? value : ""
        setQuestion1022Value(prev => ({
            ...prev, [id]: eValue
        }))

        handleInputChange1022(setQues1022, question1022Value, id, eValue)
    }


    // **********************************************************************************

    if (Object?.keys(isNotValidNullUndefile(formlabelData) && formlabelData)?.length == 0) {
        return (
            <>
                <p className='fw-bold mb-2'>{$AHelper.capitalizeAllLetters(memberName)}</p>
                <p className="mt-2">Loading...</p>
            </>
        )
    }


    konsole.log('question1022Value', question1022Value)
    return (
        <>
            <p className='fw-bold mb-2'>{$AHelper.capitalizeAllLetters(memberName)}</p>
            {_questionAndAnswerRadio(formlabelData?.label464, 'label464', 'label464', setQues464)}



            {(formlabelData?.label464?.response?.find((item) => item.response == 'Yes')?.checked == true) && <>
                {_questionAndAnswerInput(formlabelData?.label933, 'Name of Contact', 'Name of Contact', 'label933', setNameOfContact)}

                {_questionAndAnswerInput(formlabelData?.label934, 'Name of Funeral Home', 'Name of Funeral Home', 'label934', setNameOfFuneralHome)}
                {_questionAndAnswerInput(formlabelData?.label935, 'Contact Number', 'Contact Number', 'label935', setConactNo)}
                {_questionAndAnswerInput(formlabelData?.label936, 'Cell Number', 'Cell Number', 'label936', setCellNo)}
                {_questionAndAnswerInput(formlabelData?.label937, 'Address', 'Address', 'label937', setAddress)}
                {_questionAndAnswerInput(formlabelData?.label938, 'Website', 'https://example.com', 'label938', setWebsite)}
                {_questionAndAnswerInput(formlabelData?.label939, 'Fax Number', 'Fax Number', 'label939', setFaxNo)}
                {_questionAndAnswerInput(formlabelData?.label1029, 'Description', 'Description', 'label1029', setDescription)}
            </>}

            {(formlabelData?.label464?.response?.find((item) => item.response == 'No')?.checked == true) && <>
                <div className='ms-4'>
                    <p style={{ textAlign: 'justify' }}>
                        We strongly suggest you take the initiative and get this detail addressed. It will go a long way to ensure that your needs are less of a burden to loved ones, and you will likely also save your estate assets in the meanwhile.
                    </p>
                    <p>
                        <strong>SUGGESTION:</strong>
                    </p>
                    <ul>
                        <li style={{ textAlign: 'justify' }}>
                            If you are looking to acquire a cemetery plot, we suggest that you go to <a href="https://www.craigslist.com">www.craigslist.com</a> and look for one there. Often private parties who have elected not to use a plot will want to sell it at a deep discount. It might take you a year or two to find the plot in the cemetery of your choice, but it is doable.
                        </li>
                        <li style={{ textAlign: 'justify' }}>
                            If you have not paid for a casket, know that you can usually leave instructions for your loved ones to buy a casket at <a href="https://www.costco.com">Caskets | Costco</a> or at <a href="https://www.walmart.com">Caskets - Walmart.com</a>. You may want to let the funeral home of this decision and see if they may want to match the price.
                        </li>
                    </ul>
                </div>
            </>}





            {_questionAndAnswerRadio(formlabelData?.label1018, 'cremationPrepared', 'label1018', setQues1018)}

            {(formlabelData?.label1018?.response?.find((item) => item.response == 'Yes')?.checked == true) &&
                <>
                    {_questionAndAnswerRadio(formlabelData?.label1019, 'ques1019', 'label1019', setQues1019)}


                    {(formlabelData?.label1019?.response?.find((item) => item.response == 'Yes')?.checked == true) && <>

                        {_questionAndAnswerRadio(formlabelData?.label1027, 'ques1027', 'label1027', setQues1027)}
                        {(formlabelData?.label1027?.response?.find((item) => item.response == 'Yes')?.checked == true) && lifeInsurance.length > 0 && (
                            <div className="excelscroll financialInformationTable">
                                <Table bordered >
                                    <thead>
                                        <tr>
                                            <th>Insurance Company</th>
                                            <th>Policy No</th>
                                            <th>Type of Policy</th>
                                            <th style={{ minWidth: '80px' }}>Policy Start</th>
                                            <th style={{ minWidth: '80px' }}>Policy Expire</th>
                                            <th>Premium Frequency</th>
                                            <th>Premium Amount</th>
                                            <th>Death Benefits</th>
                                            <th>Beneficiary</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lifeInsurance.length > 0 && lifeInsurance.map((lifeInsurances, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td style={{ wordBreak: "break-word" }}>
                                                        <OtherInfo othersCategoryId={12} othersMapNatureId={lifeInsurances?.userLifeInsuranceId} FieldName={lifeInsurances.insuranceCompany} userId={memberUserId} />
                                                    </td>
                                                    <td>{lifeInsurances.additionalDetails}</td>
                                                    <td style={{ wordBreak: "break-word" }}>
                                                        <OtherInfo othersCategoryId={23} othersMapNatureId={lifeInsurances?.userLifeInsuranceId} FieldName={lifeInsurances.policyType} userId={memberUserId} />
                                                    </td>
                                                    <td>
                                                        {lifeInsurances.policyStartDate == null ? "" : $AHelper.getFormattedDate(lifeInsurances.policyStartDate)}
                                                    </td>
                                                    <td>
                                                        {lifeInsurances.policyExpiryDate == null ? "" : $AHelper.getFormattedDate(lifeInsurances.policyExpiryDate)}
                                                    </td>
                                                    <td>{lifeInsurances.premiumType}</td>
                                                    <td>{lifeInsurances.premium != undefined && lifeInsurances.premium != null ? $AHelper.IncludeDollars(lifeInsurances.premium) : '-'}</td>
                                                    <td>
                                                        {lifeInsurances.deathBenefits !== undefined ? $AHelper.IncludeDollars(lifeInsurances.deathBenefits) : "-"}
                                                    </td>
                                                    <td>
                                                        {(lifeInsurances.beneficiary.length > 0 && lifeInsurances.beneficiary[0].beneficiaryName) || "-"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                        <Question1020Values handleStateUpdate={handleStateUpdate1020} ques1020Value={ques1020Value} />
                    </>}








                    {(formlabelData?.label1019?.response?.find((item) => item.response == 'No')?.checked == true) && <>
                        {_questionAndAnswerRadio(formlabelData?.label1021, 'ques1021', 'label1021', setQues1021)}

                        {(formlabelData?.label1021?.response?.find((item) => item.response == 'Yes')?.checked == true) && <>
                            <Question1022Values handleStateUpdate={handleStateUpdate1022} question1022Values={question1022Value} />
                            {/* {_questionAndAnswerInput(formlabelData?.label1022, 'ques1022', 'label1022', 'label1022', setQues1022)} */}
                        </>}

                        {(formlabelData?.label1021?.response?.find((item) => item.response == 'No')?.checked == true) && <>
                            <p className='ms-4' style={{ textAlign: 'justify' }}>You may want to ask them to give you a copy of the trust or fund in which the purchase price has been placed. Federal Law requires them to provide you this information.</p>
                        </>}

                    </>}






                    {typeOfRefrence == 'Primary' && <Row className="mb-3 mt-3">
                        <BurialCremationDocUploadView
                            key={61}
                            fileTypeId={61} // >Burial/Cremation File type
                            fileStatusId={1}
                            fileCategoryId={13} // >Burial/Cremation File Category Id 
                        />
                    </Row>}

                </>
            }
        </>
    )
}




const Question1020Values = ({ handleStateUpdate, ques1020Value, typeOfRefrence }) => {



    const [errorMessage, setErrorMessage] = useState();


    function isUrlValid(userInput) {
        let testurl = userInput
        if (userInput) {
            testurl = userInput.toLowerCase();
        }
        if (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(testurl)) {
            setErrorMessage(false);
            handleStateUpdate('website', userInput)
        } else {
            handleStateUpdate('website', userInput)
            setErrorMessage(true);
        }
    }
    return (
        <>
            <div className="mt-2">
                <Row className='mt-2'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p>Insurance Company</p>
                        <input
                            className="border rounded upperCasing"
                            type="text"
                            placeholder="Insurance Company"
                            pattern="[a-zA-Z'-'\s]*"
                            value={ques1020Value?.nameOfInsuranceCmp}
                            onChange={(e) => {
                                const result = e.target.value
                                handleStateUpdate('nameOfInsuranceCmp', result)
                            }}
                        />
                    </Col>
                </Row>
            </div>
            <div className="mt-2">
                <Row className='mt-2'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p>Contract Number</p>
                        <input
                            className="border rounded"
                            maxLength={25}
                            type="text"
                            placeholder="Contract No."
                            pattern="[a-zA-Z'-'\s]*"
                            value={ques1020Value?.policyNo}
                            onChange={(e) => { handleStateUpdate('policyNo', e?.target?.value) }}
                        />
                    </Col>
                </Row>
            </div>
            <div className="mt-2">
                <Row className='mt-2'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p>Issue  Date</p>
                        <DatepickerComponent name="policyStartDate"
                            value={ques1020Value?.issueDate}
                            setValue={(value) => handleStateUpdate('issueDate', value)}
                            placeholderText="Issue Date?"
                            maxDate={0} minDate="100" />

                    </Col>
                </Row>
            </div>
            <div className="mt-2">
                <Row className='mt-2'>
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
                            value={$AHelper?.formatPhoneNumber2(ques1020Value?.contactNo)}
                            maxLength={14}
                        />
                        {(ques1020Value?.contactNo?.length > 0 && ($AHelper.formatPhoneNumber2(ques1020Value?.contactNo)?.length <= 10 || $AHelper.formatPhoneNumber2(ques1020Value?.contactNo)?.length == null)) &&
                            <p style={{ color: "#d2222d" }}>Contact Number is not valid</p>}

                    </Col>
                </Row>
            </div>
            <div className="mt-2">
                <Row className='mt-2'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p>Address</p>

                        <PlaceOfBirth placeholder={"Address"}
                            addressDetails={(e) => handleStateUpdate('address', e?.addressLine1)}
                            addressData={ques1020Value?.address}
                        />
                    </Col>
                </Row>
            </div>
            <div className="mt-2">
                <Row className='mt-2'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p>Website</p>
                        <input
                            className="border rounded"
                            type="url"
                            placeholder="https://example.com"
                            pattern="https://.*"
                            size="30"
                            required
                            value={ques1020Value.website}
                            onChange={(e) => isUrlValid(e.target.value)}
                        />
                        {errorMessage == true && ques1020Value?.length != 0 ? (
                            <p style={{ color: "#d2222d" }}>Url is not valid</p>
                        ) : null}
                    </Col>
                </Row>
            </div>


        </>
    )

}


const Question1022Values = ({ handleStateUpdate, question1022Values }) => {


    const [errorMessage, setErrorMessage] = useState();


    function isUrlValid(userInput) {
        if (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(userInput)) {
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
                            className="border rounded upperCasing"
                            type="text"
                            placeholder="Name of Contact"
                            pattern="[a-zA-Z'-'\s]*"
                            value={question1022Values?.nameOfContact}
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
                        <p>Name of Company</p>
                        <input
                            className="border rounded upperCasing"
                            type="text"
                            placeholder="Name of Company"
                            value={question1022Values?.nameOfCmp}
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
                            onChange={(e) => { handleStateUpdate('contactNo', e.target.value?.replace(/[^0-9]/gi, "")) }}
                            value={$AHelper?.formatPhoneNumber2(question1022Values?.contactNo)}
                            maxLength={14}
                        />
                        {(question1022Values?.contactNo?.length > 0 && ($AHelper.formatPhoneNumber2(question1022Values?.contactNo)?.length <= 10 || $AHelper.formatPhoneNumber2(question1022Values?.contactNo)?.length == null)) && <p style={{ color: "#d2222d" }}>Contact Number is not valid</p>}

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
                            onChange={(e) => handleStateUpdate('cellNo', e.target.value?.replace(/[^0-9]/gi, ""))}
                            placeholder="Cell Number"
                            value={$AHelper.formatPhoneNumber2(question1022Values?.cellNo)}
                            maxLength={14}
                        />

                        {(question1022Values?.cellNo?.length > 0 && ($AHelper.formatPhoneNumber2(question1022Values?.cellNo)?.length <= 10 || $AHelper.formatPhoneNumber2(question1022Values?.cellNo)?.length == null)) && <p style={{ color: "#d2222d" }}>Cell Number is not valid</p>}
                    </Col>
                </Row>

            </div>
            <div className="mt-2">
                <Row className='mt-3'>
                    <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                        <p>Address</p>

                        <PlaceOfBirth placeholder={"Address"} addressDetails={(e) => handleStateUpdate('address', e?.addressLine1)} addressData={question1022Values?.address} />
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
                            value={question1022Values.website}
                            onChange={(e) => isUrlValid(e.target.value)}
                        />
                        {errorMessage == true && question1022Values?.length != 0 ? (
                            <p style={{ color: "#d2222d" }}>Url is not valid</p>
                        ) : null}
                    </Col>
                </Row>
            </div>

        </>
    )
}

export default forwardRef(BurialCremationQuestion);