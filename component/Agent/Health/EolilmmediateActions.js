import React, { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { CustomButton, CustomButton2 } from "../../Custom/CustomButton";
import { useAppDispatch, useAppSelector } from "../../Hooks/useRedux";
import { selectorAgent } from "../../Redux/Store/selectors";
import { $ApiHelper } from "../../Helper/$ApiHelper";
import konsole from "../../../components/control/Konsole";
import { updateendoflifeImmediateActionAnswer, updateendoflifeImmediateActionQuestions } from "../../Redux/Reducers/agentSlice";
import { CustomInput, CustomRadioGuidance } from "../../Custom/CustomComponent";
import { $JsonHelper } from "../../Helper/$JsonHelper";
import { postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import { useLoader } from "../../utils/utils";
import { globalContext } from "../../../pages/_app";


const EolimmediateActions = forwardRef((props,ref) =>{
    const {userId,setSection,setStep} = props;
    const agentData = useAppSelector(selectorAgent);
    const dispatch = useAppDispatch();
    const {endoflifeImmediateActionQuestions,endoflifeImmediateActionAnswers} = agentData;
    const endOfLife = [452, 453, 454, 455, 456, 457, 458];
    const formLabelData = useMemo(()=>{return endoflifeImmediateActionAnswers},[endoflifeImmediateActionAnswers])
    const [queslabel452,setQueslabel452] = useState({})
    const [queslabel453,setQueslabel453] = useState({})
    const [queslabel454,setQueslabel454] = useState({})
    const [queslabel455,setQueslabel455] = useState({})
    const [queslabel456,setQueslabel456] = useState({})
    const [queslabel457,setQueslabel457] = useState({})
    const [queslabel458,setQueslabel458] = useState({})
    const {setWarning} = useContext(globalContext);
      const disableQues453 = useMemo(() => {
        if (formLabelData?.label452 && (formLabelData?.label452?.response?.find((item) => item?.response == 'Yes')?.checked == true || formLabelData?.label452?.response?.find((item) => item?.response == 'No')?.checked == true)) {
          return true
        }
        return false;
      }, [formLabelData]);

    useEffect(()=>{
        if(endoflifeImmediateActionQuestions?.length == 0){
        fetchQuestionsWithFormLabelId()
        }
        else{
        fetchResponseWithQuestionId(endoflifeImmediateActionQuestions)
        }
    },[userId])

    useImperativeHandle(ref, () => ({
        submitData,
    }));

    // console.log(formLabelData,"formLabelData")

    const fetchQuestionsWithFormLabelId = async () => {
        useLoader(true);
        const resultOf = await $ApiHelper.$getSujectQuestions(endOfLife);
        useLoader(false);
        konsole.log("resultOfSubjectResponse", resultOf);
        dispatch(updateendoflifeImmediateActionQuestions(resultOf))
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
            let topicId = 19
            let Category_Id = 4;

            konsole.log("memberIdmemberIdmemberId", memberId)
            useLoader(true)
            const resultOfRes = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicId({ questions: questions, memberId: memberId,categoryId:Category_Id,topicId:topicId });
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
                dispatch(updateendoflifeImmediateActionAnswer(formlabelData))
                resolve('resolve')
            } else {
                resolve('resolve')
            }
        })
    }

    const radioQuestionAnswer = (question,label,setState) => {
        console.log(question,label,setState,"questionlabelsetState")
        return <div className="question-div">
        {question && label == 'label928' ? <div className="mt-0">
            <CustomInput label="Please Specify" placeholder="Enter here" value={question?.response[0]?.response} notCapital="true" onChange={(e) => handleChange({ id: question.response[0]?.responseId, value: e }, question, label, setState, 'Input')} />
        </div>:<div>
            <p className={label == 'label452' || label == 'label453' ? 'fw-bold' : ''}>{question?.question}</p>
            <div className="radio-container d-flex flex-wrap gap-1 mt-0">
                {question?.response?.map((item,index)=>{
                    let isChecked = item?.checked == true ? true : '';
                    // console.log(isChecked,"isChecked",item)
                    return <div className="">
                     <CustomRadioGuidance key={index} name={index} value={isChecked} id={item?.responseId} label={item.response} disabled={label == 'label453' ? disableQues453 : false}
                        onChange={(e) => handleChange({ id: item?.responseId, value: e.target.checked }, question, label, setState, 'Radio')}/> 
                    </div>
                })}
            </div>
            </div>}
    </div>
    }

  const handleChange = (e, labelData, label, setState, type) => {
    const isChecked = e.value;
    const responseId = e.id
    const userSubjectDataId = (labelData?.userSubjectDataId) ? labelData?.userSubjectDataId : 0;
    const questionId = labelData?.questionId;
    konsole.log("responseIdresponseIdresponseId", responseId,isChecked,userSubjectDataId,questionId)
    handleSetState(label, responseId, isChecked);
    let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: isChecked, userId: userId })
    konsole.log("jsonjson", json)
    setState(json)
    if (responseId == 90) {
      handleChangeRadio(isChecked)
    }
    if (responseId == 91) {
      handleChangeRadio2(isChecked)
    }
  }

    // const handleSetState = (label, responseId, value, type) => {
    //     const formLabelInformation = { ...formLabelData };
    //     const selectedLabelValue = { ...formLabelData[label] };
    //     konsole.log("selectedLabelValue", selectedLabelValue, selectedLabelValue)
    //     selectedLabelValue.response = selectedLabelValue.response?.map(response => {
    //         if (response.responseId == responseId) {
    //             konsole.log('responseresponse', response);
    //             if (type !== 'Radio') {
    //                 return { ...response, response: value };
    //             } else {
    //                 return { ...response, checked: value };
    //             }
    //         } else if (type == 'Radio') {
    //             return { ...response, checked: false };
    //         }

    //         return response;
    //     });;
    //     formLabelInformation[label] = selectedLabelValue;
    //     konsole.log("formLabelInformation", formLabelInformation);
    //     dispatch(updateendoflifeImmediateActionAnswer(formLabelInformation))
    // }

    const commoanLabalaFunc =(newLable,isChecked)=>{
        const { label454, label455, label456, label457, label458 } = formLabelData
        const labels = [label454, label455, label456, label457, label458];
        const setQuesFunctions = [setQueslabel454,setQueslabel455,setQueslabel456,setQueslabel457,setQueslabel458];
        handleLabelData(labels, labels, isChecked,newLable, setQuesFunctions)
    }

    const handleChangeRadio = (isChecked) => {
        let labelData = formLabelData?.label453
        let responseId = labelData?.response?.find((item) => item?.response == 'No')?.responseId
        const userSubjectDataId = (labelData?.userSubjectDataId) ? labelData?.userSubjectDataId : 0;
        const questionId = labelData?.questionId;
        let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: isChecked, userId: userId })
        setQueslabel453(json)
        commoanLabalaFunc("Do Want",isChecked)
    }

    const handleChangeRadio2 = (isChecked) => {
        let labelData = formLabelData?.label453
        let responseId = labelData?.response?.find((item) => item?.response == 'Yes')?.responseId
        const userSubjectDataId = (labelData?.userSubjectDataId) ? labelData?.userSubjectDataId : 0;
        const questionId = labelData?.questionId;
        let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: isChecked, userId: userId })
        setQueslabel453(json)
        commoanLabalaFunc("Don't Want",isChecked)
    }
    
    const handleLabelData = (labels, userId, isChecked, responseType, setQuestions) => {
          return labels.map((labelData, index) => {
            const responseId = labelData?.response?.find(item => item?.response === responseType)?.responseId;
            const json = $JsonHelper.metaDataJson({
              userSubjectDataId: labelData?.userSubjectDataId || 0,
              subjectId: labelData?.questionId,
              responseId,
              subResponseData: isChecked,
              userId,
            });
            setQuestions[index](json);
            return json;
          });
    }

    const handleSetState = (label, responseId, value, type) => {

        const formLabelInformation = { ...formLabelData };
        const selectedLabelValue = { ...formLabelData[label] };
        selectedLabelValue.response = selectedLabelValue.response?.map(response => {
            if (response.responseId == responseId) {
            return { ...response, checked: value };
            } else if (response.responseId != responseId) {
            return { ...response, checked: false };
            }
            return response;
        });;
    
        // @@ 
        if (responseId == 90) {
            const selectedLabelValue = { ...formLabelData?.label453 };
            let responseId = 93
            selectedLabelValue.response = selectedLabelValue.response?.map(response => {
            return {
                ...response,
                checked: response.responseId === responseId ? value : false
            };
            });
    
        
            [92, 94, 96, 98, 100, 102].forEach((responseId, index) => {
            formLabelInformation[`label${453 + index}`] = index === 0 ? selectedLabelValue : updateResponse({ ...formLabelData?.[`label${453 + index}`] }, responseId, value);
            });
        }
        // @@ 
        if (responseId == 91) {
            [92, 95, 97, 99, 101, 103].forEach((responseId, index) => {
            formLabelInformation[`label${453 + index}`] = updateResponse({ ...formLabelData?.[`label${453 + index}`] }, responseId, value);
            });
            
        }
        formLabelInformation[label] = selectedLabelValue;
        handleUpdateDispatch(formLabelInformation)
    }

    const updateResponse = (label, responseId, value) => ({
    ...label,
    response: label.response?.map(r => ({
        ...r,
        checked: r.responseId === responseId ? value : false
    }))
    });

    const handleUpdateDispatch = (information) => {
        dispatch(updateendoflifeImmediateActionAnswer(information))
    }

    const submitData = async () => {
        // console.log(queslabel899,"submitData");
        let postJson = []
        postJson = [queslabel452,queslabel453,queslabel454,queslabel455,queslabel456,queslabel457,queslabel458];

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
            setWarning('successfully','Successfully saved data','Your data have been saved successfully')
        }
        fetchResponseWithQuestionId(endoflifeImmediateActionQuestions)
        // setStep(3)
        konsole.log(postSubjectData,"postSubjectData")
        konsole.log(filteredArray,"postJson",postJson)
    }

    konsole.log(formLabelData,"formLabelData")
    return (
        <div className="endoflife-div">
            <div>
                <div className="heading-para mt-2">
                    {/* <h4 className="fw-bold">Immediate Actions</h4> */}
                    <p className="mt-3">To Make sure your care is handled just the way you want. Choose where you’d like to receive care, who should manage it, and how everything should be organized to make things easier for you and your agent</p>
                    <hr />
                </div>
                <div className="mt-2">
                    {/* {radioQuestionAnswer(formLabelData?.label899,'label899',setQueslabel899)} */}
                    <div className="mt-3">
                        <h5 className="fw-bold" style={{color:'#333333'}}>Please identify your choices for your living will:</h5>
                        {/* <ul className="mt-0 ms-0"> */}
                        <p>{radioQuestionAnswer(formLabelData?.label452,'label452',setQueslabel452)}</p>
                        <p>{radioQuestionAnswer(formLabelData?.label453,'label453',setQueslabel453)}</p>
                        <hr/>
                        <p>{radioQuestionAnswer(formLabelData?.label454,'label454',setQueslabel454)}</p>
                        <p>{radioQuestionAnswer(formLabelData?.label455,'label455',setQueslabel455)}</p>
                        <p>{radioQuestionAnswer(formLabelData?.label456,'label456',setQueslabel456)}</p>
                        <p>{radioQuestionAnswer(formLabelData?.label457,'label457',setQueslabel457)}</p>
                        <p>{radioQuestionAnswer(formLabelData?.label458,'label458',setQueslabel458)}</p>
                        {/* </ul> */}
                        <div className="ms-4 ps-2">
                        {/* {radioQuestionAnswer(formLabelData?.label928,'label928',setQueslabel928)} */}
                        </div>
                        </div>
                </div>
            </div>
        </div>
    )
})
export default EolimmediateActions;