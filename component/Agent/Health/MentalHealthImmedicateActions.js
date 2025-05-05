import React, { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { CustomButton, CustomButton2 } from "../../Custom/CustomButton";
import { $ApiHelper } from "../../Helper/$ApiHelper";
import {updatementalhealthImmediateActionAnswer, updatementalhealthImmediateActionQuestions} from "../../Redux/Reducers/agentSlice";
import konsole from "../../../components/control/Konsole";
import { useAppDispatch, useAppSelector } from "../../Hooks/useRedux";
import { selectorAgent } from "../../Redux/Store/selectors";
import { CustomRadioGuidance, CustomSelect } from "../../Custom/CustomComponent";
import { $JsonHelper } from "../../Helper/$JsonHelper";
import { postApiCall } from "../../../components/Reusable/ReusableCom";
import { useLoader } from "../../utils/utils";
import { $Service_Url } from "../../../components/network/UrlPath";
import { globalContext } from "../../../pages/_app";



const MentalHealthImmediacteActions = forwardRef((props,ref) =>{
    const {userId,setSection,setStep} = props
    const agentData = useAppSelector(selectorAgent);
    
    const {mentalHealthImmediateActionQuestions,mentalHealthImmediateActionAnswers,professionalList} = agentData;
    const dispatch = useAppDispatch();
    const formLabelData = useMemo(()=>{return mentalHealthImmediateActionAnswers},[mentalHealthImmediateActionAnswers])

    const mentalhealth = [998, 999, 1000, 1002, 1003];
    const [queslabel998,setQueslabel998] = useState({})
    const [queslabel999,setQueslabel999] = useState({})
    const [queslabel1000,setQueslabel1000] = useState({})
    const [selectGcm,setSelectGcm] = useState();
    const {setWarning} = useContext(globalContext);
    const professionallists = useMemo(()=>{return professionalList != 'err' && professionalList?.map((e)=>({...e,'label':e.fName+' '+e.lName,'value':e.professionalUserId}))},[professionalList])
    const careManager = useMemo(()=>{return professionallists != 'err' && professionallists?.length > 0 && professionallists?.filter((e)=>{return e.proTypeId == 7})},[professionallists]);


console.log(queslabel998,"queslabel998",queslabel999,"queslabel999",queslabel1000,"queslabel1000")


    useEffect(()=>{
        if(mentalHealthImmediateActionQuestions?.length == 0){
        fetchQuestionsWithFormLabelId()
        }
        else{
        fetchResponseWithQuestionId(mentalHealthImmediateActionQuestions)
        }
    },[userId])



    useEffect(()=>{
        let selectedCareManager = careManager?.length > 0 && careManager?.find(e => e.lpoStatus);

        setSelectGcm(selectedCareManager || null)
    },[careManager])

    useImperativeHandle(ref, () => ({
        submitData,
    }));

    console.log(mentalHealthImmediateActionQuestions,"mentalHealthImmediateActionQuestions")

    const fetchQuestionsWithFormLabelId = async () => {
        useLoader(true);
        const resultOf = await $ApiHelper.$getSujectQuestions(mentalhealth);
        useLoader(false);
        konsole.log("resultOfSubjectResponse", resultOf);
        dispatch(updatementalhealthImmediateActionQuestions(resultOf))
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
            let topicId = 26

            konsole.log("memberIdmemberIdmemberId", memberId)
            useLoader(true)
            const resultOfRes = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicId({ questions: questions, memberId: memberId, topicId: topicId });
            useLoader(false)
            konsole.log("resultOfImmediateIllness", resultOfRes);
            const userSubjectsList = resultOfRes.userSubjects;
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
                dispatch(updatementalhealthImmediateActionAnswer(formlabelData))
                resolve('resolve')
            } else {
                resolve('resolve')
            }
        })
    }

    const handleChange = (e, labelData, label, setState, type) => {
        konsole.log('handleCurrencyInput', e, labelData, label, setState, type)
        let value = e?.value;
        const responseId = e.id
        const userSubjectDataId = (labelData?.userSubjectDataId) ? labelData?.userSubjectDataId : 0;
        const questionId = labelData?.questionId;

        handleSetState(label, responseId, value, type);
        let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: value, userId: userId })
        konsole.log(setState,"jsonjson", json)
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
        dispatch(updatementalhealthImmediateActionAnswer(formLabelInformation))
    }

    const radioQuestionAnswer = (question,label) => {
        let setState = `setQues${label}` == 'setQueslabel998' ? setQueslabel998 : `setQues${label}` == 'setQueslabel999' ? setQueslabel999 : `setQues${label}` == 'setQueslabel1000' ? setQueslabel1000 : ''  
        // console.log(setState,"setState","setQueslabel998")
        return <div className="question-div">
        {question && <div>
            <p>{question?.question}</p>
            <div className="radio-container d-flex flex-wrap gap-1 mt-0">
                {question?.response?.map((item,index)=>{
                    let isChecked = item?.checked == true ? true : '';
                    return <div className="">
                     <CustomRadioGuidance key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                        onChange={(e) => handleChange({ id: item?.responseId, value: e.target.checked }, question, label, setState, 'Radio')}/> 
                    </div>
                })}
            </div>
            </div>}
    </div>
    }

    const submitData = async () => {
        console.log('Data saved')
        let postJson = []
        postJson = [queslabel998,queslabel999,queslabel1000];

        const filteredArray = postJson.filter(obj => Object.keys(obj).length !== 0);

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
            setWarning('successfully','Successfully saved','Your data have been saved successfully')
        }
        fetchResponseWithQuestionId(mentalHealthImmediateActionQuestions)
        let updateProfessionals = [{
            "userProId": selectGcm?.userProId,
            "proUserId": selectGcm?.proUserId,
            "proCatId": selectGcm?.proCatId,
            "userId": userId,
            "lpoStatus": true,
            "isActive":true,
            "upsertedBy": userId
        }]
        useLoader(true)
        const reponseProfesionals = await postApiCall('POST',$Service_Url.postProfessionalUser,updateProfessionals)
        useLoader(false)
        if(reponseProfesionals != 'err'){
        console.log(reponseProfesionals,"reponseProfesionals",updateProfessionals)
        }
        setStep(3)
        console.log(postSubjectData,"postSubjectData")
        console.log(filteredArray,"postJson",postJson)
    }


    console.log(formLabelData,"formLabelData")
    return(
        <div className="mentalHealth">
            {/* <div className="heading-para">
                <h4 className="fw-bold">Immediate Actions: Managing Mental Health Care in Critical Moments</h4>
                <p className="mt-3">In moments when your agent feels you may be struggling to make clear decisions, they can step in to ensure you’re getting the right support. Here, you can provide instructions for how your mental health care should be handled, whether by contacting a geriatric care manager or someone you trust, so your care stays aligned with your needs.</p>
            </div>
                <hr/> */}
                <p className="fw-bold text-black">If an agent feels that you are not making rational decisions:</p>
            <div className="questions">
            
            {radioQuestionAnswer(formLabelData?.label998,'label998')}
            {formLabelData?.label998?.response[0]?.checked == true && radioQuestionAnswer(formLabelData?.label999,'label999')}
            {formLabelData?.label998?.response[0]?.checked == true && formLabelData?.label999?.response[0]?.checked == true && <div className="professional-div mt-2">
            <CustomSelect placeholder="Care Manager" label="Care Manager" options={careManager} value={selectGcm?.value} onChange={(e)=>setSelectGcm(e)} /></div>}
            {formLabelData?.label998?.response[0]?.checked == true && formLabelData?.label999?.response[1]?.checked == true && radioQuestionAnswer(formLabelData?.label1000,'label1000')}
            {formLabelData?.label999?.response[1]?.checked == true && formLabelData?.label1000?.response[0]?.checked != null   ? <div className="findexpert mt-2">
                {formLabelData?.label1000?.response[0].checked == true ? <><p className="mb-2">Find an Expert</p>
                <a href="https://aoorguat.agingoptions.com/">https://aoorguat.agingoptions.com/</a></>:
                formLabelData?.label1000?.response[1].checked == true ? <p>You can always go to Aging Options Resource Guide to locate a geriatric care manager</p> : null}</div> : null}
            {formLabelData?.label998?.response[0]?.checked == true && <p className="mt-3"><a className="text-decoration-underline" style={{color:"blue"}} href="https://beta.lifeplanorganizer.com/pdf/WhatToExpectFromA_GCM.pdf" target="_blank">Click here</a> to see what a geriatric care manager will do for your children</p>}
            </div>
        </div>
    )
})
export default MentalHealthImmediacteActions;