import React, { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { CustomButton, CustomButton2 } from "../../Custom/CustomButton";
import { useAppDispatch, useAppSelector } from "../../Hooks/useRedux";
import { selectorAgent } from "../../Redux/Store/selectors";
import { $ApiHelper } from "../../Helper/$ApiHelper";
import { updatedeathImmediateActionAnswer, updatedeathImmediateActionQuestions } from "../../Redux/Reducers/agentSlice";
import konsole from "../../../components/control/Konsole";
import { CustomInput, CustomRadioGuidance } from "../../Custom/CustomComponent";
import { $JsonHelper } from "../../Helper/$JsonHelper";
import { postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import { useLoader } from "../../utils/utils";
import { globalContext } from "../../../pages/_app";
import AddressOneLine from "../../Custom/Contact/AddressOneLine";
import ContactRezex from "../../Custom/Contact/ContactRezex";
import { $AHelper } from "../../Helper/$AHelper";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";


const death = [905, 906, 907, 908, 927, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 939, 940, 941, 942, 943, 944, 945, 946, 947, 997]
const DeathImmediateActions = forwardRef((props,ref) => {
    const {userId,setSection,setStep} = props;
    const { isVeteran } = usePrimaryUserId()
    const agentData = useAppSelector(selectorAgent);
    const {deathImmediateActionQuestions,deathImmediateActionAnswers} = agentData;
    const dispatch = useAppDispatch()
    const formLabelData = useMemo(()=>{return deathImmediateActionAnswers},[deathImmediateActionAnswers])
    const [label905,setLabel905] = useState({});
    const [label906,setLabel906] = useState({});
    const [label907,setLabel907] = useState({});
    const [label908,setLabel908] = useState({});
    const [label929,setLabel929] = useState({});
    const [label931,setLabel931] = useState({});
    const [label932,setLabel932] = useState({});
    const [label933,setLabel933] = useState({});
    const [label934,setLabel934] = useState({});
    const [label935,setLabel935] = useState({});
    const [label936,setLabel936] = useState({});
    const [label937,setLabel937] = useState({});
    const [label938,setLabel938] = useState({});
    const [label939,setLabel939] = useState({});
    const [label941,setLabel941] = useState({});
    const [label942,setLabel942] = useState({});
    const [label943,setLabel943] = useState({});
    const [label944,setLabel944] = useState({});
    const [label945,setLabel945] = useState({});
    const [label946,setLabel946] = useState({});
    const [label947,setLabel947] = useState({});
    const [label930,setLabel930] = useState({});
    const [label940,setLabel940] = useState({});
    
    const {setWarning} = useContext(globalContext);




    
    useEffect(()=>{
        if(deathImmediateActionQuestions.length == 0){
          fetchQuestionsWithFormLabelId()
        }
        else{
        fetchResponseWithQuestionId(deathImmediateActionQuestions)
        }
    },[userId])



    useImperativeHandle(ref, () => ({
        submitData,
    }));

    const fetchQuestionsWithFormLabelId = async () => {
        useLoader(true);
        const resultOf = await $ApiHelper.$getSujectQuestions(death);
        useLoader(false);
        konsole.log("resultOfSubjectResponse", resultOf);
        dispatch(updatedeathImmediateActionQuestions(resultOf))
        if (resultOf !== 'err' && resultOf.length > 0) {
            fetchResponseWithQuestionId(resultOf)
        //     if ($AHelper.$isNotNullUndefine(spouseUserId) && isPrimaryMemberMaritalStatus) {
        //         fetchResponseWithQuestionId(resultOf, 2)
        //     }
        }
    }

    const fetchResponseWithQuestionId = async (questions) => {

        return new Promise(async (resolve, reject) => {
            konsole.log('questionslust', questions)
            let memberId = userId;
            let topicId = 28

            konsole.log("memberIdmemberIdmemberId", memberId)
            useLoader(true)
            const resultOfRes = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicId({ questions: questions, memberId: memberId, topicId: topicId });
            const resultOfRes2 = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicId({ questions: questions, memberId: memberId, topicId: 21 });
            useLoader(false)
            const userSubjectsList = [...resultOfRes.userSubjects,...resultOfRes2.userSubjects];
            const questionsList = questions
            konsole.log("userSubjectsList", userSubjectsList)
            if (questionsList.length > 0) {
                let formlabelData = {};
                for (let resObj of questions) {
                    let label = "label" + resObj.formLabelId;
                    formlabelData[label] = { ...resObj.question }; // Shallow copy of the question object

                    const filterQuestion = userSubjectsList?.filter((item) => item.questionId == resObj?.question?.questionId);
                    konsole.log("filterQuestion", userSubjectsList, resObj, filterQuestion);
                    if (filterQuestion?.length > 0) {
                        const resultOfResponse = filterQuestion[0];

                        // Iterate over the response array if it exists
                        if (formlabelData[label]?.response) {
                            formlabelData[label]["userSubjectDataId"] = resultOfResponse.userSubjectDataId;
                            formlabelData[label].response = formlabelData[label].response.map((response, i) => {
                                konsole.log("resultOfResponse?.responseNature2", resultOfResponse)
                                if (response.responseId == resultOfResponse?.responseId) {
                                    konsole.log("resultOfResponse?.responseNature", resultOfResponse)
                                    if (resultOfResponse?.responseNature == 'Radio') {
                                        return { ...response, 'checked': true };
                                    } else if (resultOfResponse?.responseNature == 'Text') {
                                        konsole.log("formlabelDatalabelresultOfResponse", resultOfResponse, response);
                                        return {
                                            ...response, response: resultOfResponse.response
                                        };
                                    }
                                }
                                return response;
                            });
                        }
                        formlabelData[label].userSubjectDataId = resultOfResponse.userSubjectDataId;
                    }
                }
                konsole.log(formlabelData,"formlabelData")
                dispatch(updatedeathImmediateActionAnswer(formlabelData))
                resolve('resolve')
            } else {
                resolve('resolve')
            }
        })
    }

    konsole.log(formLabelData,"formLabelData")
    
    const isValidContactCell = (value) => {
        return (value?.length > 0 && ($AHelper.$formatPhoneNumber2(value)?.length <= 10 || $AHelper.$formatPhoneNumber2(value)?.length == null)) ? true : ''
      }

      const validateWebUrl = (url) => {
        let testUrl = url
        if (testUrl) {
            testUrl = url.toLowerCase();
        }
        if (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(testUrl)) {
            return false;
        }
        return true;

    }

    const radioQuestionAnswer = (question,label,setState,type) => {
        return <div className="question-div">
        {type == 'input' || type == 'number' ? <div className="mt-0 deathInput">
            {(label != 'label937' && label != 'label945')  && <CustomInput placeholder="Enter here" label={question?.question} value={ type == 'number' ? $AHelper.$formatPhoneNumber2(question?.response[0]?.response) : question?.response[0]?.response} max={type == 'number' ? 14 : null} notCapital="true" onChange={(e) => handleChange({ id: question.response[0]?.responseId, value: e }, question, label, setState, 'Input')} />}
           {(label == 'label937' || label == 'label945') && <AddressOneLine placeholder="Enter here" label={question?.question} value={question?.response[0]?.response} notCapital="true" onChange={(e) => handleChange({ id: question.response[0]?.responseId, value: e }, question, label, setState, 'Input')} />}
            {/* {<ContactRezex placeholder="Enter here" label={question?.question} value={question?.response[0]?.response} notCapital="true" showInput='true' onChange={(e) => handleChange({ id: question.response[0]?.responseId, value: e }, question, label, setState, 'Input')}/>} */}
            {((label == 'label938' || label == 'label946') && question?.response[0]?.response != '' && validateWebUrl(question?.response[0]?.response)) && <span style={{color:'#d2222d'}}>Url is not valid.</span>}
        </div>:<div>
            <p>{question?.question}</p>
            <div className="radio-container d-flex flex-wrap mt-2">
                {question?.response?.map((item,index)=>{
                    let isChecked = item?.checked == true ? true : '';
                    console.log(isChecked,"isChecked",item)
                    return <div className="w-100">
                     <CustomRadioGuidance key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                        onChange={(e) => handleChange({ id: item?.responseId, value: e.target.checked }, question, label, setState, 'Radio')}/> 
                    </div>
                })}
            </div>
            </div>}
    </div>
    }

    const handleChange = (e, labelData, label, setState, type) => {
        konsole.log('handleCurrencyInput', e)
        let value = e?.value;
        const responseId = e.id
        const userSubjectDataId = (labelData?.userSubjectDataId) ? labelData?.userSubjectDataId : 0;
        const questionId = labelData?.questionId;

        handleSetState(label, responseId, value, type);
        let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: value, userId: userId })
        konsole.log("jsonjson", json)
        setState(json)
    }

    const handleSetState = (label, responseId, value, type) => {
        const formLabelInformation = { ...formLabelData };
        const selectedLabelValue = { ...formLabelData[label] };
        konsole.log("selectedLabelValue", selectedLabelValue, selectedLabelValue)
        selectedLabelValue.response = selectedLabelValue.response?.map(response => {
            if (response.responseId == responseId) {
                konsole.log('responseresponse', response);
                if (type !== 'Radio') {
                    return { ...response, response: value };
                } else {
                    return { ...response, checked: value };
                }
            } else if (type == 'Radio') {
                return { ...response, checked: false };
            }

            return response;
        });;
        formLabelInformation[label] = selectedLabelValue;
        konsole.log("formLabelInformation", formLabelInformation);
        dispatch(updatedeathImmediateActionAnswer(formLabelInformation))
    }

    const submitData = async () => {
        let postJson = []
        postJson = [label905,label906,label907,label908,label929,label930,label931,label932,label933,label934,label935,label936,label937,label938,label939,
            label940,label941,label942,label943,label944,label945,label946,label947];

        const filteredArray = postJson.filter(obj => Object?.keys(obj).length !== 0);

        // if(filteredArray.length == 0){
        //     setWarning('warning','Warning','Please fill all the details.');
        //     return;
        // }

        let jsonObj = {
            userId:userId,
            userSubjects:filteredArray
        }
        useLoader(true)
        const postSubjectData = await postApiCall('PUT',$Service_Url.putusersubjectdata,jsonObj);
        useLoader(false)
        if(postSubjectData != 'err'){
            setWarning('successfully','Successfully saved','Your data have been saved successfully.')
        }

        fetchResponseWithQuestionId(deathImmediateActionQuestions)
        setStep(3)
        console.log(postSubjectData,"postSubjectData")
        console.log(filteredArray,"postJson",postJson)
    }

    console.log(formLabelData,"formLabelData")

    return(
        <div className="DeathImmediateActions">
            <div>
                <div className="heading-para mt-2">
                    {/* <h4 className="fw-bold">Immediate Actions</h4> */}
                    <p className="mt-3">To Make sure your care is handled just the way you want. Choose where you’d like to receive care, who should manage it, and how everything should be organized to make things easier for you and your agent</p>
                    <hr />
                </div>
                <div className="mt-2">
                    {radioQuestionAnswer(formLabelData?.label905,'label905',setLabel905)}
                    {formLabelData?.label905?.response[0].checked == true && radioQuestionAnswer(formLabelData?.label906,'label906',setLabel906)}
                    {formLabelData?.label905?.response[0].checked == true && formLabelData?.label906?.response[0]?.checked == true && <div className="ms-0 mt-3">
                    <h5 className="fw-bold">Mention the details:</h5>
                    <div className="d-flex justify-space-between gap-4">
                        {radioQuestionAnswer(formLabelData?.label933,'label933',setLabel933,'input')} {radioQuestionAnswer(formLabelData?.label934,'label934',setLabel934,'input')}
                        </div>
                        <div className="d-flex justify-space-between gap-4">
                        {radioQuestionAnswer(formLabelData?.label935,'label935',setLabel935,'number')} {radioQuestionAnswer(formLabelData?.label936,'label936',setLabel936,'number')}
                        </div>
                        <div className="d-flex justify-space-between gap-4">
                        {radioQuestionAnswer(formLabelData?.label937,'label937',setLabel937,'input')} {radioQuestionAnswer(formLabelData?.label938,'label938',setLabel938,'input')}
                        </div>
                        <div className="d-flex justify-space-between gap-4">
                        {radioQuestionAnswer(formLabelData?.label939,'label939',setLabel939,'number')}
                        </div>
                    </div>}
                    {formLabelData?.label905?.response[0].checked == true && <div>
                        {radioQuestionAnswer(formLabelData?.label907,'label907',setLabel907)}
                        {formLabelData?.label907?.response[0].checked == true && radioQuestionAnswer(formLabelData?.label929,'label929',setLabel929)}
                        {formLabelData?.label907?.response[3].checked == true && radioQuestionAnswer(formLabelData?.label931,'label931',setLabel931,'input')}
                        {formLabelData?.label907?.response[0].checked == true && formLabelData?.label929?.response[2].checked == true && radioQuestionAnswer(formLabelData?.label932,'label932',setLabel932,'input')}
                        {isVeteran && radioQuestionAnswer(formLabelData?.label908,'label908',setLabel908)}
                        {formLabelData?.label908?.response[0].checked == true && <div className="findexpert mt-15 mb-3"><p>Follow Link</p><a href="https://www.cem.va.gov" target="_blank">https://www.cem.va.gov</a></div>}
                        </div>}
                    {formLabelData?.label905?.response[1].checked == true && radioQuestionAnswer(formLabelData?.label940,'label940',setLabel940)}

                    {formLabelData?.label905?.response[1].checked == true && formLabelData?.label940?.response[0]?.checked == true && <div className="ms-0 mt-3">
                    <h5 className="fw-bold">Mention the details:</h5>
                    <div className="d-flex justify-space-between gap-4 w-100">
                        {radioQuestionAnswer(formLabelData?.label941,'label941',setLabel941,'input')} {radioQuestionAnswer(formLabelData?.label942,'label942',setLabel942,'input')}
                        </div>
                        <div className="d-flex justify-space-between gap-4">
                        {radioQuestionAnswer(formLabelData?.label943,'label943',setLabel943,'number')} {radioQuestionAnswer(formLabelData?.label944,'label944',setLabel944,'number')}
                        </div>
                        <div className="d-flex justify-space-between gap-4">
                        {radioQuestionAnswer(formLabelData?.label945,'label945',setLabel945,'input')} {radioQuestionAnswer(formLabelData?.label946,'label946',setLabel946,'input')}
                        </div>
                        <div className="d-flex justify-space-between gap-4">
                        {radioQuestionAnswer(formLabelData?.label947,'label947',setLabel947,'number')}
                        </div>
                    </div>}
                    {formLabelData?.label905?.response[2].checked == true && radioQuestionAnswer(formLabelData?.label930,'label930',setLabel930,'input')}
                    </div>
            </div>
        </div>
    )
})
export default DeathImmediateActions;