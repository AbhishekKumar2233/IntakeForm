import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Modal, Row, Col, Form, Button ,Table} from 'react-bootstrap'
import { $Service_Url } from '../network/UrlPath';
import { postApiCall, getApiCall } from '../Reusable/ReusableCom';
import konsole from '../control/Konsole';
import { $AHelper } from '../control/AHelper';
import { isValidateNullUndefine } from '../Reusable/ReusableCom';
import PlaceOfBirth from '../PlaceOfBirth';
import DatepickerComponent from '../DatepickerComponent';
import moment from 'moment';
import OtherInfo from '../asssets/OtherInfo';
import { $CommonServiceFn } from '../network/Service';

const newObj = () => {
    return { nameOfInsuranceCmp: "", policyNo: "", issueDate: "", address: "", contactNo: "", website: "" }
}

const newObj2 = () => {
    return { nameOfContact: "", nameOfCmp: "", contactNo: "", cellNo: "", address: "", website: "", faxNo: "" }
}

const _burialCremationQuestionId = [464, 933, 934, 935, 936, 937, 938, 939, 1018, 1019, 1020, 1021, 1022,1027, 1029]
const BurialCremationGenQuestionpdf = (props, ref) => {

    const { memberUserId, memberName, setLoader, typeOfRefrence } = props
    // const primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
    console.log('_burialCremationQuestionId_burialCremationQuestionId', _burialCremationQuestionId)


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
    const [lifeInsurance,setlifeInsurance] = useState([])



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

    const fectchsubjectForFormLabelId = async () => {
        if (_burialCremationQuestionId?.length == 0) return;
        let formlabelData = {}
        konsole.log('_burialCremationQuestionIdee', _burialCremationQuestionId)
        // setLoader(true)
        let resultsubjectlabel = await postApiCall('POST', $Service_Url.getsubjectForFormLabelId, _burialCremationQuestionId);

        konsole.log('resultsubjectlabel', resultsubjectlabel)
        if (resultsubjectlabel == 'err') return;

        // setLoader(true)
        for (let obj of resultsubjectlabel.data.data) {
            let label = "label" + obj.formLabelId;
            formlabelData[label] = obj.question;
            let result = await getApiCall('GET', $Service_Url.getSubjectResponse + memberUserId + `/0/0/${formlabelData[label].questionId}`, null);
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
                            console.log("responseDataresponse", responseData)
                            formlabelData[label].response[i]["response"] = responseData.response;
                            formlabelData[label].response[i]["response"] = responseData.response;
                            formlabelData[label].response[i]["subResponseData"] = responseData.response;
                            formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                            if (responseData?.questionId == 224 && responseData.response != undefined && responseData.response != null && responseData.response != '') {
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
                                console.log('contactInfocontactInfocontactInfo', contactInfo, responseData.response)
                                setQues1020Value(contactInfo)
                            }
                            if (responseData?.questionId == 226 && responseData.response) {
                                let keyValuePairs = responseData?.response?.split("&&");
                                let contactInfo = Object.fromEntries(keyValuePairs?.map(function (keyValue) {
                                    var pair = keyValue?.split("=");
                                    var key = pair[0];
                                    var value = decodeURIComponent(pair[1]);
                                    return [key, value];
                                }));
                                if (contactInfo?.contactNo.length > 0) {
                                    contactInfo.contactNo = contactInfo?.contactNo?.slice(0, 10)
                                }
                                if (contactInfo?.cellNo.length > 0) {
                                    contactInfo.cellNo = contactInfo?.cellNo?.slice(0, 10)
                                }
                                console.log('contactInfocontactInfocontactInfo', contactInfo, responseData.response)
                                setQuestion1022Value(contactInfo)
                            }
                        }
                    }
                }
            }
        }

        // setLoader(false)
        konsole.log('formlabelData', formlabelData)
        setFormlabelData(formlabelData)
    }

    const fetchLifeInsurance = (userId) => {
        $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getLifeInsByUserId + userId,"",(response) => {
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
            userSubjects.push(nameOfContact)
        }
        if ($AHelper.objectvalidation(nameOfFuneralHome)) {
            userSubjects.push(nameOfFuneralHome)
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
            userSubjects.push(ques1020)
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


        let jsonobj = { "userId": memberUserId, "userSubjects": userSubjects }
        console.log('jsonobjjsonobj', jsonobj)
        // return;

        return new Promise(async (resolve, reject) => {
            if (userSubjects?.length > 0) {
                // setLoader(true)
                const resultSaveSubject = await postApiCall('PUT', $Service_Url.putusersubjectdata, jsonobj)
                konsole.log('resultSaveSubject', resultSaveSubject)
                // setLoader(false)
                resolve('res api call')
            } else {
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
    const handleInputChange = (event, formLabelDatawithlabel, formlabelwithlabel, setState, id) => {

        let eventId = event?.target?.id;
        let eventValue = event?.target?.value;
        let eventName = event?.target?.name;

        if (formlabelwithlabel == 'label937') {
            eventId = id;
            eventValue = event?.addressLine1
            console.log('addresslineone', event?.addressLine1)
        } else {
            event.stopPropagation()
        }
        console.log('formlabelwithlabel', formlabelwithlabel, eventValue, formlabelwithlabel == 'label939')
        if (formlabelwithlabel == 'label933' || formlabelwithlabel == 'label934') {
            eventValue = event.target.value.replace(/[^a-zA-Z ]/gi, "");
        } else if ((formlabelwithlabel == 'label935' || formlabelwithlabel == 'label936' || formlabelwithlabel == 'label939')) {
           console.log('eventtargetvalue',event?.target?.value)
            eventValue = event?.target?.value?.slice(0, 14)
            console.log('formlabelwithlabel1', formlabelwithlabel, eventValue)
        }

        console.log('eventValue', eventValue)
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
        console.log('returnMetaDataJson', returnMetaData)
        setState(returnMetaData)
    }

    // *******************************____________@INPUT CHANGE_________________________________

    // **********************************************************************************




    const returnContactMsgTrueFalse = (number) => {
        if (number?.length > 0 && ($AHelper.formatPhoneNumber(number)?.length <= 10 || $AHelper.formatPhoneNumber(number)?.length == null)) {
            return true;
        }
        return false;
    }
    const validateWebUrl = (url) => {
        console.log('urlurl', url)
        if (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(url)) {
            return false;
        }
        return true;

    }

    const _questionAndAnswerInput = (formLabelDatawithlabel, name, placeholder, withlabel, setState) => {
        return (<>
            <div class="mt-2">
                <Row className='mt-2'>
                    <Col className='d-flex' >
                        {/* <p>{formLabelDatawithlabel && formLabelDatawithlabel.question}{" "} </p> */}
                        <div className='col-3'>
                        <label className='pt-2'>{name} </label>
                        </div>
                        {formLabelDatawithlabel && formLabelDatawithlabel?.response?.map((response) => {
                            konsole.log("response", response?.checked);

                            let inputVal = response?.subResponseData;
                            console.log('inputVal', inputVal, withlabel)
                            if (withlabel == 'label935' || withlabel == 'label936' || withlabel == 'label939') {
                                let myinp = response?.subResponseData?.length > 10 ? response?.subResponseData?.slice(0, 10) : response?.subResponseData;
                                inputVal = $AHelper?.formatPhoneNumber(myinp)
                            }

                            return (
                                <>
                                    {(name == 'Address') ? <> <div className='col-9'>
                                    <p className='mt-3 otherFontSize' style={{borderBottom:"1px solid #000"}} >{response?.subResponseData}</p>
                                    </div>
                                    </> : <>
                                    <div className='col-6'>
                                        <input className={`${(withlabel == "label933" || withlabel == "label934") ? "upperCasing" : ""}`} type='text' value={inputVal}></input>
                                        </div>
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
        const finalValue = formLabelDatawithlabel?.response?.filter(e => e.checked == true);
        konsole.log(formLabelDatawithlabel,"formLabelDatawithlabel")
        return (<>
            <div class=" d-flex mt-4">
                <div className=''>
                <label className='pt-2' >{formLabelDatawithlabel && formLabelDatawithlabel.question}{" "} </label>
                </div>
                {/* <p style={{ width: "2%",textAlign:"justify" }}>{" "} </p> */}
                <div className='col-2'>
                <input type='text' value={finalValue?.length>0 && finalValue?.[0]?.response}></input> 
                </div>
            </div>
        </>)
    }



    // ******QUESTION1020  OPTIONS ________________________

    const handleInputChange1020 = (setState, objectVal, id, value) => {
        const eventId = formlabelData?.label1020?.response[0].responseId
        const userSubjectDataId = (formlabelData?.label1023?.userSubjectDataId) ? formlabelData?.label1023?.userSubjectDataId : 0
        const subjectId = formlabelData?.label1020?.questionId;
        let objVal = objectVal;
        objVal[id] += value;
        const singleVariable = Object?.entries(objVal).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&&");

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
        console.log('returnMetaDataJson', returnMetaData)
        setState(returnMetaData)
    }


    // ******QUESTION1022  OPTIONS ________________________
    const handleInputChange1022 = (setState, objectVal, id, value) => {
        const eventId = formlabelData?.label1022?.response[0].responseId
        const userSubjectDataId = (formlabelData?.label1022?.userSubjectDataId) ? formlabelData?.label1022?.userSubjectDataId : 0
        const subjectId = formlabelData?.label1022?.questionId;
        let objVal = objectVal;
        objVal[id] += value;
        const singleVariable = Object?.entries(objVal).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&&");

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
        console.log('returnMetaDataJson', returnMetaData)
        setState(returnMetaData)
    }



    const handleStateUpdate1020 = (id, value) => {
        setQues1020Value(prev => ({
            ...prev, [id]: value
        }))

        handleInputChange1020(setQues1020, ques1020Value, id, value)
    }
    const handleStateUpdate1022 = (id, value) => {
        setQuestion1022Value(prev => ({
            ...prev, [id]: value
        }))

        handleInputChange1022(setQues1022, question1022Value, id, value)
    }


    // **********************************************************************************

    konsole.log('formlabelDataformlabelData', formlabelData)





    konsole.log('formLabelForLabel', formlabelData, Object.keys(formlabelData))
    konsole.log('formlabelData?.label1018', formlabelData?.label1018)



    if (Object.keys(formlabelData).length == 0) {
        return (
            <>
                <p className='fw-bold mb-2'>{memberName}</p>
                    <p className="mt-2">Loading...</p>
            </>
        )
    }
    return (
        <>
            <p className='fw-bold mb-2'>{memberName}</p>
            {/* {_questionAndAnswerRadio(formlabelData?.label464, 'label464', 'label464', setQues464)} */}



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

                <div>
                    <p className=''  style={{ textAlign: 'justify'}}>
                        We strongly suggest you take the initiative and get this detail addressed. It will go a long way to ensure that your needs are less of a burden to loved ones, and you will likely also save your estate assets in the meanwhile.
                    </p>
                    </div>
                    <ul className="pt-4 ps-2"><li className="Heading mt-3 mb-3 generate-pdf-main-color" style={{fontSize:"12px"}}>SUGGESTION:</li></ul>   
                    <ul className='ps-2'>
                        <li>
                            If you are looking to acquire a cemetery plot, we suggest that you go to <a href="https://www.craigslist.com">www.craigslist.com</a> and look for one there. Often private parties who have elected not to use a plot will want to sell it at a deep discount. It might take you a year or two to find the plot in the cemetery of your choice, but it is doable.
                        </li>
                        <li style={{ textAlign: 'justify'}}>
                            If you have not paid for a casket, know that you can usually leave instructions for your loved ones to buy a casket at <a href="https://www.costco.com">Caskets | Costco</a> or at <a href="https://www.walmart.com">Caskets - Walmart.com</a>. You may want to let the funeral home of this decision and see if they may want to match the price.
                        </li>
                    </ul>
               
            </>}

            {_questionAndAnswerRadio(formlabelData?.label1018, 'cremationPrepared', 'label1018', setQues1018)}
            {(formlabelData?.label1018?.response?.find((item) => item.response == 'Yes')?.checked == true) &&
                <>
                    {_questionAndAnswerRadio(formlabelData?.label1019, 'ques1019', 'label1019', setQues1019)}
                    {(formlabelData?.label1019?.response?.find((item) => item.response == 'Yes')?.checked == true) && <>
                        {/* {_questionAndAnswerInput(formlabelData?.label1020, 'ques1020', 'label1020', 'label1020', setQues1020)} */}
                        {_questionAndAnswerRadio(formlabelData?.label1027, 'ques1027', 'label1027', setQues1027)}
                        {(formlabelData?.label1027?.response?.find((item) => item.response == 'Yes')?.checked == true) && lifeInsurance.length > 0 && (
                        <div className="pt-4">
                        <Table bordered >
                        <thead>
                        <tr>
                        <th>Insurance Company</th>
                        <th>Policy No</th>
                        <th>Type of Policy</th>
                        <th style={{minWidth:'80px'}}>Policy Start</th>
                        <th style={{minWidth:'80px'}}>Policy Expire</th>
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
                        <td style={{wordBreak:"break-word"}}>
                        <OtherInfo othersCategoryId={12} othersMapNatureId={   lifeInsurances?.userLifeInsuranceId } FieldName={lifeInsurances.insuranceCompany} userId={memberUserId}/>
                        </td>
                        <td>{lifeInsurances.additionalDetails}</td>
                        <td  style={{wordBreak:"break-word"}}>
                        <OtherInfo othersCategoryId={23} othersMapNatureId={   lifeInsurances?.userLifeInsuranceId } FieldName={lifeInsurances.policyType} userId={memberUserId}/>
                        </td>
                        <td>
                        {lifeInsurances.policyStartDate == null ? "" : $AHelper.getFormattedDate(lifeInsurances.policyStartDate)}
                        </td>
                        <td>
                        {lifeInsurances.policyExpiryDate == null ? "" : $AHelper.getFormattedDate(lifeInsurances.policyExpiryDate)}
                        </td>
                        <td>{lifeInsurances.premiumType}</td>
                        <td>{lifeInsurances.premium != undefined && lifeInsurances.premium != null ? $AHelper.IncludeDollars(lifeInsurances.premium):'-'}</td>
                        <td>
                        {lifeInsurances.deathBenefits !== undefined ? $AHelper.IncludeDollars(     lifeInsurances.deathBenefits   ) : "-"}
                        </td>
                        <td>
                        {(lifeInsurances.beneficiary.length > 0 && lifeInsurances.beneficiary[0]   .beneficiaryName) || "-"}
                        </td>
                        </tr>
                        );
                        })}
                        </tbody>
                        </Table>
                        </div>)}

                        <Question1020Values handleStateUpdate={handleStateUpdate1020} ques1020Value={ques1020Value} />

                    </>}
                    {(formlabelData?.label1019?.response?.find((item) => item.response == 'No')?.checked == true) && <>
                        {_questionAndAnswerRadio(formlabelData?.label1021, 'ques1021', 'label1021', setQues1021)}

                        {(formlabelData?.label1021?.response?.find((item) => item.response == 'Yes')?.checked == true) && <>
                            <Question1022Values handleStateUpdate={handleStateUpdate1022} question1022Values={question1022Value} />
                            {/* {_questionAndAnswerInput(formlabelData?.label1022, 'ques1022', 'label1022', 'label1022', setQues1022)} */}
                        </>}

                        {(formlabelData?.label1021?.response?.find((item) => item.response == 'No')?.checked == true) && <>
                            <p className='pt-2' style={{fontSize: "12.3px"}}>You may want to ask them to give you a copy of the trust or fund in which the purchase price has been placed. Federal Law requires them to provide you this information.</p>
                        </>}

                    </>}

                </>
            }
        </>
    )
}




const Question1020Values = ({ handleStateUpdate, ques1020Value }) => {



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

                <div className="d-flex pt-3">
                <div>
                 <label className='pt-3'>Insurance Company</label>
                 </div>
                 <div className='col-3 ps-3'>
                 <input type='text' value={$AHelper.capitalizeAllLetters(ques1020Value?.nameOfInsuranceCmp)}></input>
                 </div>
                <div className=" ps-4">
                 <label className='pt-3'>Contract Number</label>
                 </div>
                 <div className='col-3 ps-3'>
                 <input type='text' value={ques1020Value?.policyNo}></input>
                </div>
                </div> 
                <div className="d-flex pt-3">
                <div>
                 <label className='pt-3'>Issue  Date</label>
                 </div>
                 <div className='col-3 ps-3'>
                 <input type='text' value={ques1020Value?.issueDate ? moment(ques1020Value?.issueDate ).format("MM-DD-YYYY") : ''}></input>
                 </div>
                
                <div className='ps-4'>
                 <label className='pt-3'>Contact Number</label>
                 </div>
                 <div className='col-4 ps-3'>
                 <input type='text' value={$AHelper?.formatPhoneNumber(ques1020Value?.contactNo)}></input>
                </div>
                </div>
                <div className="d-flex pt-3">
                <div>
                 <label className='pt-3'>Address</label>
                 </div>
                 <div className='col-7 ps-3'>
                 <input type='text' value={ques1020Value?.address}></input>
                 </div>
                
                <div className='ps-4'>
                 <label className='pt-3'>Website</label>
                 </div>
                 <div className='col-3 ps-3'>
                 <input type='text' value={ques1020Value.website}></input>
                </div>
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

            <div className=" d-flex pt-3">
                <div className=''>
                 <label className='pt-3'>Name of Contact</label>
                 </div>
                 <div className=' col-4 ps-3'>
                 <input type='text' value={$AHelper.capitalizeAllLetters(question1022Values?.nameOfContact)}></input>
                 </div>
               <div className="pt-3 ps-3">
                 <label>Name of Company</label>
                 </div>
                 <div className='ps-3'>
                 <input type='text' value={$AHelper.capitalizeAllLetters(question1022Values?.nameOfCmp)}></input>
                </div>
                </div>

                <div className=" d-flex pt-3">
                <div className=''>
                 <label className='pt-3'>Contact Number</label>
                 </div>
                 <div className=' col-4 ps-3'>
                 <input type='text' value={$AHelper?.formatPhoneNumber(question1022Values?.contactNo)}></input>
                 </div>
               <div className="pt-3 ps-3">
                 <label>Cell Number</label>
                 </div>
                 <div className=' col-4 ps-3'>
                 <input type='text' value={$AHelper.formatPhoneNumber(question1022Values?.cellNo)}></input>
                </div>
                </div>

                <div className=" d-flex pt-3">
                <div className=''>
                 <label className='pt-3'>Address</label>
                 </div>
                 <div className=' col-7 ps-3'>
                 <input type='text' value={question1022Values?.address}></input>
                 </div>
               <div className="pt-3 ps-3">
                 <label>Website</label>
                 </div>
                 <div className=' col-3 ps-3'>
                 <input type='text' value={question1022Values.website}></input>
                </div>
                </div>

        </>
    )
}

export default forwardRef(BurialCremationGenQuestionpdf);