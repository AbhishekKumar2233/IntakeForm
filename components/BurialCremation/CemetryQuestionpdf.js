import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Modal, Row, Col, Form, Button } from 'react-bootstrap'
import { $Service_Url } from '../network/UrlPath';
import { postApiCall, getApiCall } from '../Reusable/ReusableCom';
import konsole from '../control/Konsole';
import { $AHelper } from '../control/AHelper';
import { isValidateNullUndefine } from '../Reusable/ReusableCom';
import PlaceOfBirth from '../PlaceOfBirth';

const _burialCremationQuestionId = [463, 1023, 1024, 1025]

const newObj = () => {
    return { nameOfContact: "", nameOfCmp: "", contactNo: "", cellNo: "", address: "", website: "", faxNo: "" }
}

const CemetryQuestionpdf = (props, ref) => {
    const { memberUserId, memberName, setLoader, typeOfRefrence } = props
    console.log('_burialCremationQuestionId_burialCremationQuestionId', _burialCremationQuestionId)


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

    // *******************____DEFINE__USEEFFECT____*************************


    const fectchsubjectForFormLabelId = async () => {
        if (_burialCremationQuestionId?.length == 0) return;
        let formlabelData = {}
        konsole.log('_burialCremationQuestionIdee', _burialCremationQuestionId)
        // setLoader(true)
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
                konsole.log('responseData', responseData)
                for (let i = 0; i < formlabelData[label].response.length; i++) {
                    if (formlabelData[label].response[i].responseId === responseData.responseId) {
                        if (responseData.responseNature == "Radio") {
                            formlabelData[label].response[i]["checked"] = true;
                            formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        } else if (responseData.responseNature == "Text") {

                            console.log('responseDataresponseData', responseData, responseData.response)

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


                                console.log('contactInfocontactInfocontactInfo', contactInfo, responseData.response)
                                setQuestion1023Values(contactInfo)
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


    // *******************____@Save data____*************************

    const saveData = async () => {
        let userSubjects = []
        if ($AHelper.objectvalidation(ques463)) {
            userSubjects.push(ques463)
        }
        if ($AHelper.objectvalidation(ques1023)) {
            userSubjects.push(ques1023)
        }
        if ($AHelper.objectvalidation(ques1024)) {
            userSubjects.push(ques1024)
        }
        if ($AHelper.objectvalidation(ques1025)) {
            userSubjects.push(ques1025)
        }
        let jsonobj = { "userId": memberUserId, "userSubjects": userSubjects }
        console.log('jsonobjjsonobj', jsonobj)
        return new Promise(async (resolve, reject) => {
            if (userSubjects?.length > 0) {
                // setLoader(true)
                const resultSaveSubject = await postApiCall('PUT', $Service_Url.putusersubjectdata, jsonobj)
                // setLoader(false)
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
        objVal[id] += value;
        const singleVariable = Object?.entries(objVal).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&&");

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
        console.log('returnMetaDataJson', returnMetaData)
        setState(returnMetaData)
    }


    const _questionAndAnswerRadio = (formLabelDatawithlabel, name, withlabel, setState) => {
        const finalValue = formLabelDatawithlabel?.response?.filter(e => e.checked == true);
        konsole.log(formLabelDatawithlabel,"formLabelDatawithlabel")
        return (<>
            <div class="mt-1 w-100">
                <label style={{  fontSize: "12.3px", color:"#909090"}}>{formLabelDatawithlabel && formLabelDatawithlabel.question}{" "} </label>
                <h5 className="burial_h5" >{finalValue?.length>0 && finalValue?.[0].response}</h5> 
            </div>
        </>)
    }




    const handleStateUpdate = (id, value) => {
        setQuestion1023Values(prev => ({
            ...prev, [id]: value
        }))

        handleInputChange(setQues1023, question1023Values, id, value)
    }
    // **********************************************************************************

    konsole.log('formlabelDataformlabelData', formlabelData)


    konsole.log('cemetryFormLabelData', formlabelData)

    konsole.log('formlabelData?.label1018', formlabelData?.label1018)




    if (Object.keys(formlabelData).length == 0) {
        return (
            <>
                <p className='fw-bold mb-2'>{memberName}</p>
                Loading ...
            </>
        )
    }

    return (
        <>
            <p className='fw-bold mb-2'>{memberName}</p>
            {/* {_questionAndAnswerRadio(formlabelData?.label463, 'label463', 'label463', setQues463)} */}
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
                                <label style={{color:"#909090" , fontSize: "12.3px"}}>We will get someone to call you </label>
                            </>
                        }
                        {(formlabelData?.label1025?.response?.find((item) => item?.response == 'No')?.checked == true) &&
                            <>
                            <label style={{ fontSize: "12.3px", color:"#909090"} }>
                             We strongly suggest you take the initiative and get this detail addressed.  It will go a long way to ensure that your needs are less of a burden to loved ones, and you will likely also save your estate assets in the meanwhile.  </label>
                            </>
                        }
                    </>}
                    {(formlabelData?.label1024?.response?.find((item) => item?.response == 'No')?.checked == true) && <>
                        <label style={{ fontSize: "12.3px", color:"#909090"}}
                        >We strongly suggest you take the initiative and get this detail addressed.  It will go a long way to ensure that your needs are less of a burden to loved ones, and you will likely also save your estate assets in the meanwhile</label>
                    </>}
                </>
            }
        </>
    )
}


const ContactWebSiteDetails = ({ handleStateUpdate, question1023Values }) => {
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

    console.log('question1023Values', question1023Values)

    return (
        <>

            {/*Contact Name */}
            <div className="sumPhysician pt-3">
                 <p>Name of Contact</p>
                 <h5>{$AHelper.capitalizeAllLetters(question1023Values?.nameOfContact)}</h5>
                </div>

            {/* Company Name */}
            <div className="sumPhysician pt-3">
                 <p>Name of Cemetery</p>
                 <h5>{$AHelper.capitalizeAllLetters(question1023Values?.nameOfCmp)}</h5>
                </div>
        
            {/* Contact No. */}
            <div className="sumPhysician pt-3">
                 <p>Contact Number</p>
                 <h5>{$AHelper?.formatPhoneNumber(question1023Values?.contactNo)}</h5>
                </div>
           
            {/* Cell NO. */}
            <div className="sumPhysician pt-3">
                 <p>Cell Number</p>
                 <h5>{$AHelper.formatPhoneNumber(question1023Values?.cellNo)}</h5>
                </div>

                <div className="sumPhysician pt-3">
                 <p>Plot Number</p>
                 <h5>{question1023Values.plotNo}</h5>
                </div>
                
                <div className="sumPhysician pt-3">
                 <p>Address</p>
                 <h5>{question1023Values?.address}</h5>
                </div>
        
                <div className="sumPhysician pt-3" style={{wordWrap:'break-word',width:'100%'}}>
                 <p>Website</p>
                 <h5 className='pe-2'>{question1023Values.website}</h5>
                </div>
                 
                <div className="sumPhysician pt-3">
                 <p>Fax Number</p>
                 <h5>{$AHelper.formatPhoneNumber(question1023Values?.faxNo)}</h5>
                </div>
           
        </>
    )
}
export default forwardRef(CemetryQuestionpdf)