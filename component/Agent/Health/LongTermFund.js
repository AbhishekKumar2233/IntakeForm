import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CustomButton, CustomButton2 } from "../../Custom/CustomButton";
import { $ApiHelper } from "../../Helper/$ApiHelper";
import { useAppDispatch, useAppSelector } from "../../Hooks/useRedux";
import { fetchProfessionallist, updatelongtermcarefundAnswer, updatelongtermcarefundQuestions, updateprofessionalList } from "../../Redux/Reducers/agentSlice";
import { selectorAgent } from "../../Redux/Store/selectors";
import konsole from "../../../components/control/Konsole";
import { CustomRadioGuidance, CustomSelect } from "../../Custom/CustomComponent";
import { $JsonHelper } from "../../Helper/$JsonHelper";
import AddCareManager from "./AddCareManager";
import { $Service_Url } from "../../../components/network/UrlPath";
import { globalContext } from "../../../pages/_app";
import { useLoader } from "../../utils/utils";
import { getApiCall, postApiCall } from "../../../components/Reusable/ReusableCom";
import { longtermcarefund } from "../../../components/control/Constant";

const LongTermCareFund = ({setActiveModule,userId,setStep}) => {
    const [nextStep,setNextstep] = useState(1);
    const dispatch = useAppDispatch()
    const agentData = useAppSelector(selectorAgent);
    const {longtermcarefundQuestions,longtermcarefundAnswers,professionalList} = agentData;
    const [questionlabel1209,setQuestionlabel1209] = useState({})
    const [questionlabel1210,setQuestionlabel1210] = useState({})
    const [questionlabel1216,setQuestionlabel1216] = useState({})
    const [questionlabel1217,setQuestionlabel1217] = useState({})
    const [questionlabel1219,setQuestionlabel1219] = useState({})
    const [questionlabel1223,setQuestionlabel1223] = useState({})
    const [questionlabel1218,setQuestionlabel1218] = useState({})
    const [questionlabel1220,setQuestionlabel1220] = useState({})
    const [questionlabel1221,setQuestionlabel1221] = useState({})
    const [questionlabel1214,setQuestionlabel1214] = useState({})
    const [questionlabel1222,setQuestionlabel1222] = useState({})
    const [questionlabel1233,setQuestionlabel1233] = useState({})
    const addCaremanagerRef = useRef(null);
    const {setWarning} = useContext(globalContext);
    const professionallists = useMemo(()=>{return professionalList != 'err' ? professionalList?.map((e)=>({...e,'label':e.fName+' '+e.lName,'value':e.professionalUserId})) : []},[professionalList])
    const ElaManager = useMemo(()=>professionallists?.length > 0 ? professionallists?.filter((e)=>{return e.proTypeId == 13}) : [],[professionallists]);
    const [selectEla,setSelectEla] = useState([]);    
    const [showForm,setShowform] = useState(false)
    const formLabelData = useMemo(()=>{return longtermcarefundAnswers},[longtermcarefundAnswers])

    konsole.log(longtermcarefundAnswers,"longtermcarefundAnswers",formLabelData)
    // const [questionlabel1218,setQuestionlabel1218] = useState()

    useEffect(() => {
        if(ElaManager?.length > 0){
        const selectedCareManager = ElaManager?.find(e => e?.lpoStatus);
        setSelectEla(selectedCareManager || null);
        }
    }, [ElaManager]);
    

    useEffect(()=>{
        dispatch(fetchProfessionallist({userId:userId}))
        fetchQuestionsWithFormLabelId()
    },[userId])

    const fetchQuestionsWithFormLabelId = async () => {
        useLoader(true);
        const resultOf = await $ApiHelper.$getSujectQuestions(longtermcarefund);
        useLoader(false);
        konsole.log("resultOfSubjectResponse", resultOf);
        dispatch(updatelongtermcarefundQuestions(resultOf))
        if (resultOf !== 'err' && resultOf.length > 0) {
            fetchResponseWithQuestionId(resultOf)
        //     if ($AHelper.$isNotNullUndefine(spouseUserId) && isPrimaryMemberMaritalStatus) {
        //         fetchResponseWithQuestionId(resultOf, 2)
        //     }
        }
    }

    const fetchResponseWithQuestionId = async (questions) => {

        return new Promise(async (resolve, reject) => {
            konsole.log('questionslist', questions)
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
                    formlabelData[label] = { ...resObj.question };

                    const filterQuestion = userSubjectsList?.filter((item) => item.questionId == resObj?.question?.questionId);
                    konsole.log("filterQuestion", userSubjectsList, resObj, filterQuestion);
                    if (filterQuestion?.length > 0) {
                        const resultOfResponse = filterQuestion[0];
                        if (formlabelData[label]?.response) {
                            formlabelData[label]["userSubjectDataId"] = resultOfResponse.userSubjectDataId;
                            formlabelData[label].response = formlabelData[label].response.map((response, i) => {
                                konsole.log("resultOfResponse?.responseNature2", resultOfResponse)
                                if (response.responseId == resultOfResponse?.responseId) {
                                    konsole.log("resultOfResponse?.responseNature", resultOfResponse)
                                    if (resultOfResponse?.responseNature == 'Radio' || resultOfResponse?.responseNature == 'CheckBox') {
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
                dispatch(updatelongtermcarefundAnswer(formlabelData))
                resolve('resolve')
            } else {
                resolve('resolve')
            }
        })
    }
    
    const radioQuestionAnswer = (question,label,setState) => {
        konsole.log(question,"setStatesetQueslabel998")
        return <div className="question-div">
        {question && <div>
            <p>{question?.question}</p>
            <div className="radio-container d-flex flex-wrap mt-0">
                {question?.response?.map((item,index)=>{
                    let isChecked = item?.checked == true ? true : '';
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
        konsole.log('handleCurrencyInput', e, labelData, label, setState, type)
        let value = e?.value;
        const responseId = e.id
        const userSubjectDataId = (labelData?.userSubjectDataId) ? labelData?.userSubjectDataId : 0;
        const questionId = labelData?.questionId;

        handleSetState(label, responseId, value, type);
        let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: value, userId: userId })
        konsole.log(setState,"jsonjson", json)
        setState(json)
        if(label == 'label1219' && e.id == 812){
            let json1210 = $JsonHelper.metaDataJson({...questionlabel1210,responseId:794,subjectId:419,subResponseData:true})
            setQuestionlabel1210(json1210)
        }
        if(label == 'label1214' && e.id == 803){
            let json1209 = $JsonHelper.metaDataJson({...questionlabel1209,responseId:791,subjectId:418,subResponseData:true})
            setQuestionlabel1209(json1209)
        }
        if(label == 'label1222' && e.id == 818){
            let json1221 = $JsonHelper.metaDataJson({...questionlabel1221,responseId:816,subjectId:774,subResponseData:true})
            setQuestionlabel1221(json1221)
        }
        // if(label == 'label1233' && e.id == 841){
        //     let json1218 = $JsonHelper.metaDataJson({...questionlabel1218,responseId:810,subjectId:768,subResponseData:true})
        //     setQuestionlabel1218(json1218)
        // }
        if(showForm == true){
            setShowform(false)
        }
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
        if(label == 'label1219' && responseId == 812){
            const selectedLabelValue1210 = { ...formLabelData['label1210'] };
            selectedLabelValue1210.response = selectedLabelValue1210.response?.map(response => {
            if (response.responseId == 794) {
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
        formLabelInformation['label1210'] = selectedLabelValue1210;
        }
        if(label == 'label1214' && responseId == 803){
            const selectedLabelValue1209 = { ...formLabelData['label1209'] };
            selectedLabelValue1209.response = selectedLabelValue1209.response?.map(response => {
            if (response.responseId == 791) {
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
        formLabelInformation['label1209'] = selectedLabelValue1209;
    }
        if(label == 'label1222' && responseId == 818){
            const selectedLabelValue1221 = { ...formLabelData['label1221'] };
            selectedLabelValue1221.response = selectedLabelValue1221.response?.map(response => {
            if (response.responseId == 816) {
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
        formLabelInformation['label1221'] = selectedLabelValue1221;
        }
        // if(label == 'label1233' && responseId == 841){
        //     const selectedLabelValue1218 = { ...formLabelData['label1218'] };
        //     selectedLabelValue1218.response = selectedLabelValue1218.response?.map(response => {
        //     if (response.responseId == 810) {
        //         konsole.log('responseresponse', response);
        //         if (type !== 'Radio') {
        //             return { ...response, response: value };
        //         } else {
        //             return { ...response, checked: value };
        //         }
        //     } else if (type == 'Radio') {
        //         return { ...response, checked: false };
        //     }

        //     return response;
        // });;
        // formLabelInformation['label128'] = selectedLabelValue1218;
        // }
        
        konsole.log("formLabelInformation", formLabelInformation);
        dispatch(updatelongtermcarefundAnswer(formLabelInformation))
    }

    const submitData = async () => {
        // if(nextStep <= 2){
        //     setNextstep((prev)=> prev + 1)
        //     return;
        // }
        konsole.log('Submit data')
        // if(showForm == true){
        let responseofProfessional = await addCaremanagerRef?.current?.addProfessional()
        if(responseofProfessional == true){
            return;
        }
        dispatch(fetchProfessionallist({userId:userId}))
        // }
        
        if(selectEla?.userId){
        addtomyteam(selectEla)
        }

        let postJson = []
        postJson = [questionlabel1209,questionlabel1210,questionlabel1216,questionlabel1217,questionlabel1218,questionlabel1219,questionlabel1220,questionlabel1221,questionlabel1223,questionlabel1214,questionlabel1222,questionlabel1233];

        const filteredArray = postJson?.filter(obj => Object?.keys(obj).length !== 0);

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
            konsole.log(postSubjectData,"postSubjectData")
            setWarning('successfully','Successfully saved data','Your data have been saved successfully.')
            setStep(3);       
        }
        setShowform(false);
    }

    const addtomyteam = async (professional) => {
        konsole.log(professional,"professional")

        let jsonProfessional = [{
            ...$JsonHelper.$jsonProfessional(),
            "userProId":professional?.userProId,
            "proUserId":professional?.proUserId,
            "proCatId":professional?.proCatId,
            "userId":userId,
            "upsertedBy":userId,
          }]
    
          const postProfessionalUserapi = await postApiCall('POST',$Service_Url.postProfessionalUser,jsonProfessional)
          if(postProfessionalUserapi != 'err'){
            konsole.log(postProfessionalUserapi,"postProfessionalUserapi")
                setWarning('successfully','Successfully saved','Your data is saved successfully.')
                dispatch(fetchProfessionallist({userId:userId}))
          }
    }

    konsole.log(formLabelData,"formLabelData2")
    
    return(
        <div className="longtermcare">
            <div className="heading-para">
            <h4 className="mt-10 fw-bold">Payment Planning</h4>
            </div>
            {nextStep == 1 && <><div className="heading-para">
            <p className="mt-10 w-90 text-dark">Understanding that medicare does not cover long-term care services in any meaningful way, how have you planned to pay for the long-term care costs that you may encounter in the future?</p>
            <hr/>
            </div>
            {/* <div className="mt-10 fw-14 suggestion-div">
                <p>Before you answer, let's have an important conversation about costs. This is often the most stressful part of care planning, so let's break it down clearly. The Reality About medicare, many families assume Medicare will cover their long-term care needs. It won't. Here's what you need to know:</p>
                <p className="mt-10">Current Costs (2024): </p>
                <ul className="mt-10">
                    <li>Home Care: $25-40 per hour</li>
                    <li>Assisted Living: $4,500-8,000 per month</li>
                    <li>Nursing Home: $8,000-15,000 per month</li>
                </ul>
                <p className="mt-10">These costs can quickly deplete savings, which is why we need to plan carefully now.</p>
            <hr/>
            </div> */}
            <div>
                {radioQuestionAnswer(formLabelData?.label1209,'label1209',setQuestionlabel1209)}
                <hr/>
            </div></>}
            {(formLabelData?.label1209?.response[0]?.checked == true || nextStep == 2) && <div>
                {radioQuestionAnswer(formLabelData?.label1210,'label1210',setQuestionlabel1210)}
                <hr/>
                {formLabelData?.label1210?.response[0]?.checked == true ? <><AddCareManager type="3" userId={userId} ref={addCaremanagerRef} /> </> : formLabelData?.label1210?.response[1]?.checked == true ? <div className="mt-10 fw-14 suggestion-div">
                {/* <p className="warning-para">Disclaimer:</p>
                <p className="mt-10">A Care Manager Can Help:</p>
                <ul className="mt-10">
                    <li>Maximise your policy benefits</li>
                    <li>Handle all documentation properly</li>
                    <li>Manage the elimination period effectively</li>
                    <li>Coordinate with the insurance company</li>
                    <li>Ensure you don't miss out on benefits</li>
                </ul>
                <p className="mt-10">Real Story:</p>
                <p className="mt-10">"One family lost two months of benefits because they didn't document care properly during the elimination period. A care manager would have prevented this costly mistake."</p> */}
                <hr/>{radioQuestionAnswer(formLabelData?.label1219,'label1219',setQuestionlabel1219)}
            <hr/>
            </div>:<div className="mt-10 fw-14 suggestion-div">
                {/* <p>Let's talk about why this matters. Insurance policies can be tricky to navigate. Here's what we've learned:</p>
                <p className="mt-10">Common Challenges: </p>
                <ul className="mt-10">
                    <li>Claims might be denied due to improper documentation</li>
                    <li>The elimination period must be handled correctly</li>
                    <li>Benefits might not start when you expect</li>
                    <li>Coordination between care providers and insurance can be complex</li>
                </ul>
                <p className="mt-10">A Care Manager Can Help:</p>
                <ul className="mt-10">
                    <li>Maximise your policy benefits</li>
                    <li>Handle all documentation properly</li>
                    <li>Manage the elimination period effectively</li>
                    <li>Coordinate with the insurance company</li>
                    <li>Ensure you don't miss out on benefits</li>
                </ul>
                <p className="mt-10">Real Story:</p>
                <p className="mt-10">"One family lost two months of benefits because they didn't document care properly during the elimination period. A care manager would have prevented this costly mistake."</p>
            <hr/> */}
            {formLabelData?.label1209?.response[3]?.checked == true && radioQuestionAnswer(formLabelData?.label1216,'label1211',setQuestionlabel1210)}
            </div>}
            </div>}
            {formLabelData?.label1209?.response[1]?.checked == true && <div>
                {radioQuestionAnswer(formLabelData?.label1220,'label1220',setQuestionlabel1220)}
                {radioQuestionAnswer(formLabelData?.label1221,'label1221',setQuestionlabel1221)}
                {formLabelData?.label1221?.response[1]?.checked == true && <div>
                {/* <div className="mt-10 fw-14 suggestion-div">
                <p className="warning-para">Important Care Giver Information:</p>
                <p className="mt-10">Let's talk about the reality of caregiving costs and options, current agency rates:</p>
                <ul className="mt-10">
                    <li>$45-75 per hour depending on qualifications</li>
                    <li>Can become very expensive quickly</li>
                    <li>Most agencies will accept fixed amount for full-time care</li>
                </ul>
                <p className="mt-10">More affordable options we've found these non-profit agencies often provide excellent care:</p>
                <ul className="mt-10">
                    <li>Full Life Care</li>
                    <li>Catholic Community Services</li>
                    <li>Korean Women's Association</li>
                </ul>
                <p className="mt-10">If you're considering direct hire you can use:</p>
                <ul className="mt-10">
                    <li>www.care.com</li>
                    <li>Local employment agencies</li>
                    <li>McDonald Employment Services</li>
                </ul>
                <p className="mt-10">But Remember direct hiring means you'll handle:</p>
                <ul className="mt-10">
                    <li>Background checks</li>
                    <li>Tax requirements</li>
                    <li>Backup care plans</li>
                    <li>Insurance needs</li>
                    <li>Worker's compensation</li>
                </ul>
            <hr/>
            </div> */}
            {radioQuestionAnswer(formLabelData?.label1222,'label1222',setQuestionlabel1222)}
            </div>}
                {(formLabelData?.label1221?.response[0]?.checked == true || formLabelData?.label1222?.response[1]?.checked == true) && radioQuestionAnswer(formLabelData?.label1214,'label1214',setQuestionlabel1214)}
                {formLabelData?.label1214?.response[0]?.checked == true && <div><hr/><p className="mt-10">Please contact your Elder Law Attorney for further guidance on the line of credit setup.</p></div>}
            </div> }
            {formLabelData?.label1209?.response[2]?.checked == true && <div>
                {radioQuestionAnswer(formLabelData?.label1216,'label1216',setQuestionlabel1216)}
                <hr/>
                {formLabelData?.label1216?.response[0]?.checked == true ? radioQuestionAnswer(formLabelData?.label1217,'label1217',setQuestionlabel1217) : formLabelData?.label1216?.response[1]?.checked == true && radioQuestionAnswer(formLabelData?.label1218,'label1218',setQuestionlabel1218)}
                <hr />
                {(formLabelData?.label1217?.response[0]?.checked == true && formLabelData?.label1216?.response[0]?.checked == true || formLabelData?.label1218?.response[0]?.checked == true && formLabelData?.label1216?.response[1]?.checked == true) ? <div className="mt-10 additional-information d-flex gap-2 align-items-center">
                <CustomSelect label="Select/ Add attorney" placeholder="Rajiv Nagaich" options={ElaManager} onChange={(e)=>setSelectEla(e)} value={selectEla?.value} />
                <button className="add-button" style={{marginTop:'24px'}} onClick={()=>setShowform(true)}><img src="/icons/closeIcon.svg" /></button>
                <hr />
                </div>: formLabelData?.label1217?.response[1]?.checked == true && formLabelData?.label1216?.response[0]?.checked == true && <div>
                <div className="mt-10 fw-14 suggestion-div">
                {/* <p className="warning-para">Important benefit information:</p>
                <p className="mt-10">Even with current benefits, an elder law attorney can be crucial. Here's why they help you:</p>
                <ul className="mt-10">
                    <li>Ensure ongoing eligibility</li>
                    <li>Maximize available benefits</li>
                    <li>Guide through program changes</li>
                    <li>Protect assets while maintaining benefits</li>
                    <li>Navigate complex requirements</li>
                </ul>
                <p className="mt-10">Real Experience, "Many families lose benefits because they don't understand how changes in their situation affect eligibility. An attorney can help prevent this."</p> */}
                {/* <hr/> */}
                {radioQuestionAnswer(formLabelData?.label1223,'label1223',setQuestionlabel1223)}
                {formLabelData?.label1223?.response[0]?.checked == true ? <p><hr/> <span style={{color:'#D70101'}}>NOTE: </span>Please reach out to Life Point Law to set up VA/ Medicate for you</p> : <p><hr/> <span style={{color:'#D70101'}}>NOTE: </span>You may miss out on valuable benefits. We recommend that you reach out to Life Point Law to set this up</p>}
            </div>
            </div>}
            {formLabelData?.label1216?.response[1]?.checked == true && formLabelData?.label1218?.response[1]?.checked == true && <div><div className="mt-10 fw-14 suggestion-div">
                {/* <p className="warning-para">Critical benefit information:</p>
                <p className="mt-10">Let's discuss why this matters, many families don't realise:</p>
                <ul className="mt-10">
                    <li>You might qualify for benefits you don't know about</li>
                    <li>There are legal ways to protect assets while qualifying</li>
                    <li>Benefits can significantly reduce your care costs</li>
                    <li>Rules are complex and change frequently</li>
                    <li>Mistakes can be costly and hard to fix</li>
                </ul>
                <p className="mt-10">Real Example:<br/>"One family spent $60,000 on care before learning they could have qualified for benefits months earlier. An attorney could have helped them access these benefits sooner."</p>
                <hr/> */}
                {radioQuestionAnswer(formLabelData?.label1233,'label1233',setQuestionlabel1233)}
                {(formLabelData?.label1223?.response[1]?.checked == true || formLabelData?.label1233?.response[1]?.checked == true) && <div><hr/><p className="mt-10"><span style={{color:'#D70101'}}>NOTE:</span> You may miss out on valuable benefits.</p></div>}
            </div></div>}
            </div>}
            {showForm == true && <div className="mt-10"><p className="fw-bold">Enter Care Manager Details</p><AddCareManager type="3" userId={userId} ref={addCaremanagerRef} /></div>}

        </div>
    )
}

export default LongTermCareFund;