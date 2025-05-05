import React, { useContext, useEffect, useMemo, useState } from "react";
import konsole from "../../../components/control/Konsole";
import { $ApiHelper } from "../../Helper/$ApiHelper";
import { updateillnessImmediateActionAnswer, updateillnessImmediateActionQuestions, updateprofessionalList } from "../../Redux/Reducers/agentSlice";
import { useAppDispatch, useAppSelector } from "../../Hooks/useRedux";
import { selectorAgent } from "../../Redux/Store/selectors";
import { CustomInput, CustomRadioForMetadata, CustomRadioGuidance, CustomRadioSignal, CustomSelect } from "../../Custom/CustomComponent";
import {$JsonHelper} from "../../Helper/$JsonHelper";
import { CustomButton } from "../../Custom/CustomButton";
import { getApiCall, postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import { useLoader } from "../../utils/utils";
import { globalContext } from "../../../pages/_app";

export const illness = [894, 895, 896, 897, 898, 925, 927, 995];

const IllnessImmedicateActions = ({userId,setStep}) => {
    const agentData = useAppSelector(selectorAgent);
    const {illnessImmediateActionQuestions,illnessImmediateActionAnswers,professionalList} = agentData;
    const dispatch = useAppDispatch();
    const formLabelData = useMemo(()=>{return illnessImmediateActionAnswers;},[illnessImmediateActionAnswers]);
    const [ques894,setQues894] = useState({});
    const [ques895,setQues895] = useState({});
    const [ques896,setQues896] = useState({});
    const [ques897,setQues897] = useState({});
    const [ques898,setQues898] = useState({});
    const [ques925,setQues925] = useState({});
    const {setWarning} = useContext(globalContext);
    const [selectGcm,setSelectGcm] = useState();
    const [selectEla,setSelectEla] = useState();
    const professionallists = useMemo(()=>{return professionalList.map((e)=>({...e,'label':e.fName+' '+e.lName,'value':e.professionalUserId}))},[professionalList])
    const careManager = useMemo(()=>{return professionallists.filter((e)=>{return e.proTypeId == 7})},[professionallists]);
    const ELAManager = useMemo(()=>{return professionallists.filter((e)=>{return e.proTypeId == 13})},[professionallists])

    console.log(professionalList,"professionalList")
    useEffect(()=>{
        if(illnessImmediateActionQuestions.length == 0){
        fetchQuestionsWithFormLabelId()
        }
        else{
        fetchResponseWithQuestionId(illnessImmediateActionQuestions)
        }
        fetchProfessionallist()
    },[userId])

    useEffect(() => {
        const selectedCareManager = careManager.find(e => e.lpoStatus);
        const selectedElaManager = ELAManager.find(e => e.lpoStatus);
        setSelectGcm(selectedCareManager || null);
        setSelectEla(selectedElaManager || null);
    }, [careManager, ELAManager]);

    const fetchProfessionallist = async () => {
        useLoader(true)
        const apiResponse = await getApiCall('GET',$Service_Url.getSearchProfessional+`?MemberUserId=${userId}&ProTypeId=&primaryUserId=${userId}`);
        useLoader(false)
        if(apiResponse != 'err'){
            dispatch(updateprofessionalList(apiResponse))
        }
        console.log(apiResponse,"apiResponse")
    }

    
    const fetchQuestionsWithFormLabelId = async () => {
        useLoader(true);
        const resultOf = await $ApiHelper.$getSujectQuestions(illness);
        useLoader(false);
        konsole.log("resultOfSubjectResponse", resultOf);
        dispatch(updateillnessImmediateActionQuestions(resultOf))
        if (resultOf !== 'err' && resultOf.length > 0) {
            fetchResponseWithQuestionId(resultOf)
        //     if ($AHelper.$isNotNullUndefine(spouseUserId) && isPrimaryMemberMaritalStatus) {
        //         fetchResponseWithQuestionId(resultOf, 2)
        //     }
        }
    }
    console.log(illnessImmediateActionQuestions,"illnessImmediateActionQuestions")

    const fetchResponseWithQuestionId = async (questions) => {

        return new Promise(async (resolve, reject) => {
            konsole.log('questionslust', questions)
            let memberId = userId;
            let topicId = 25;
            let categoryId = 4;

            konsole.log("memberIdmemberIdmemberId", memberId)
            useLoader(true)
            const resultOfRes = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicId({ questions: questions, memberId: memberId, topicId: topicId,categoryId:categoryId });
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
                konsole.log(formlabelData,"formlabelData")
                dispatch(updateillnessImmediateActionAnswer(formlabelData))
                resolve('resolve')
            } else {
                resolve('resolve')
            }
        })
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
        dispatch(updateillnessImmediateActionAnswer(formLabelInformation))
    }

    const submitData = async () => {
        console.log(ques894,"ques894ques894ques894ques894")
        let postJson = []
        postJson = [ques894,ques895,ques896,ques897,ques898,ques925];

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

        // if(postSubjectData != 'err'){
        //     setWarning('successfully','Successfully saved','Your data is saved successfully.')
        // }

        fetchResponseWithQuestionId(illnessImmediateActionQuestions)

        let updateProfessionals = [{
            "userProId": selectGcm?.userProId,
            "proUserId": selectGcm?.proUserId,
            "proCatId": selectGcm?.proCatId,
            "userId": userId,
            "lpoStatus": true,
            "isActive":true,
            "upsertedBy": userId
        },{
            "userProId": selectEla?.userProId,
            "proUserId": selectEla?.proUserId,
            "proCatId": selectEla?.proCatId,
            "userId": userId,
            "lpoStatus": true,
            "isActive":true,
            "upsertedBy": userId
        }]
        useLoader(true)
        const reponseProfesionals = await postApiCall('POST',$Service_Url.postProfessionalUser,updateProfessionals)
        useLoader(false)
        if(reponseProfesionals != 'err'){
        console.log(reponseProfesionals,"reponseProfesionals",updateProfessionals,selectGcm)
        }
        setStep(3)

        // console.log(postSubjectData,"postSubjectData")
        // console.log(filteredArray,"postJson",postJson)
    }

    console.log(formLabelData,"formLabelData")
    return(
        <div className="Illness-immediate">
            <div className="heading-para">
            <h4 className="fw-bold">Care Preferences</h4>
            <p className="mt-3 w-90">Let’s start by setting up how you’d like your care to be organized,To  Make sure your care is handled just the way you want. Choose where you’d like to receive care, who should manage it, and how everything should be organized to make things easier for you and your agent.</p>
            <hr />
            </div>
            <div className="question-div">
                {formLabelData?.label894 && <div>
                    <p>{formLabelData?.label894?.question}</p>
                    <div className="radio-container d-flex flex-wrap mt-0">
                        {formLabelData?.label894?.response?.map((item,index)=>{
                            let isChecked = item?.checked == true ? true : '';
                            return <div className="w-100">
                             <CustomRadioGuidance key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                                onChange={(e) => handleChange({ id: item?.responseId, value: e.target.checked }, formLabelData?.label894, 'label894', setQues894, 'Radio')}/> 
                            </div>
                        })}
                    </div>
                    </div>}
            </div>

            <div className="question-div">
                {formLabelData?.label895 && formLabelData?.label894?.response[0].checked == true && <div>
                    <p>{formLabelData?.label895?.question}</p>
                    <p className="italic-para">(A care manager can help streamline your care experience, especially when you need support from multiple people or services.)</p>
                    <div className="radio-container d-flex flex-wrap mt-2">
                        {formLabelData?.label895?.response?.map((item,index)=>{
                            let isChecked = item?.checked == true ? true : '';
                            return <div className="w-100">
                             <CustomRadioGuidance key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                                onChange={(e) => handleChange({ id: item?.responseId, value: e.target.checked }, formLabelData?.label895, 'label895', setQues895, 'Radio')}/> 
                            </div>
                        })}
                    </div>
                    </div>}
            </div>
            <div className="question-div">
                {formLabelData?.label896 && formLabelData?.label894?.response[0].checked == true && formLabelData?.label895?.response[0].checked == true && <div>
                    <p>{formLabelData?.label896?.question}</p>
                    <div className="radio-container d-flex flex-wrap mt-2">
                        {formLabelData?.label896?.response?.map((item,index)=>{
                            let isChecked = item?.checked == true ? true : '';
                            return <div className="w-100">
                             <CustomRadioGuidance key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                                onChange={(e) => handleChange({ id: item?.responseId, value: e.target.checked }, formLabelData?.label896, 'label896', setQues896, 'Radio')}/> 
                            </div>
                        })}
                    </div>
                    </div>}
            </div>
            <div className="question-div">
                {formLabelData?.label897 && formLabelData?.label894?.response[0].checked == true && formLabelData?.label895?.response[1].checked == true && <div>
                    <p>{formLabelData?.label897?.question}</p>
                    <div className="radio-container d-flex flex-wrap mt-2">
                        {formLabelData?.label897?.response?.map((item,index)=>{
                            let isChecked = item?.checked == true ? true : '';
                            return <div className="w-100">
                             <CustomRadioGuidance key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                                onChange={(e) => handleChange({ id: item?.responseId, value: e.target.checked }, formLabelData?.label897, 'label897', setQues897, 'Radio')}/> 
                            </div>
                        })}
                    </div>
                    </div>}
            </div>
            {formLabelData?.label896?.response[0].checked == true && formLabelData?.label894?.response[0].checked == true && formLabelData?.label895?.response[0].checked == true &&
            <div className="professional-div">
                {careManager.length > 0 ?
                <CustomSelect label="Care Manager" placeholder="Care Manager" options={careManager} value={selectGcm?.value} onChange={(e)=>setSelectGcm(e)} />: ''}
                <br/><br/>
                {ELAManager.length > 0 ?
                <CustomSelect label="Elder Law Attorney" placeholder="Elder Law Attorney" options={ELAManager} value={selectEla?.value} onChange={(e)=>setSelectEla(e)} />:''}
                </div>}
            <div className="question-div">
                {formLabelData?.label898 && formLabelData?.label895?.response[0].checked == true && formLabelData?.label894?.response[0].checked == true && formLabelData?.label896?.response[1].checked == true &&<div>
                    <p>{formLabelData?.label898?.question}</p>
                    <div className="radio-container d-flex flex-wrap mt-2">
                        {formLabelData?.label898?.response?.map((item,index)=>{
                            let isChecked = item?.checked == true ? true : '';
                            return <div className="w-100">
                             <CustomRadioGuidance key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                                onChange={(e) => handleChange({ id: item?.responseId, value: e.target.checked }, formLabelData?.label898, 'label898', setQues898, 'Radio')}/> 
                            </div>
                        })}
                    </div>
                    </div>}
            </div>
            {formLabelData?.label898?.response[0].checked == true && formLabelData?.label895?.response[0].checked == true && formLabelData?.label894?.response[0].checked == true && formLabelData?.label896?.response[1].checked == true && <div className="findexpert mt-15">
                <p>Find an Expert</p>
                <a href="https://aoorguat.agingoptions.com/" target="_blank" >https://aoorguat.agingoptions.com/</a>
                </div>}
            <div className="question-div">
                {formLabelData?.label925 && formLabelData?.label895?.response[1].checked == true && formLabelData?.label894?.response[0].checked == true && formLabelData?.label897?.response[0].checked == true && <div>
                    <p>{formLabelData?.label925?.question} </p>
                    <div className="w-50">
                        <CustomInput value={formLabelData?.label925?.response[0]?.response} onChange={(e)=> handleChange({ id: formLabelData?.label925?.response[0]?.responseId, value: e }, formLabelData?.label925, 'label925', setQues925)} />
                        {/* {formLabelData?.label927?.response?.map((item,index)=>{
                            let isChecked = item?.checked == true ? true : '';
                            return <div className="w-100">
                             <CustomRadioGuidance key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                                onChange={(e) => handleChange({ id: item?.responseId, value: e.target.checked }, formLabelData?.label927, 'label927', setQues927, 'Radio')}/> 
                            </div>
                        })} */}
                    </div>
                    </div>}
            </div>
        </div>
    )
}
export default IllnessImmedicateActions;