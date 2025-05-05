import React, { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { CustomButton, CustomButton2, CustomButton3, CustomButton4 } from "../../Custom/CustomButton";
import { $ApiHelper } from "../../Helper/$ApiHelper";
import konsole from "../../../components/control/Konsole";
import { useAppDispatch, useAppSelector } from "../../Hooks/useRedux";
import { selectorAgent, selectPersonal } from "../../Redux/Store/selectors";
import {fetchFiduciaryList, fetchProfessionallist, updatelongtermcareprefrencessAnswer, updatelongtermcareprefrencessQuestions, updateprofessionalList} from '../../Redux/Reducers/agentSlice';
import { useLoader } from "../../utils/utils";
import { CustomRadio, CustomRadioGuidance, CustomSelect } from "../../Custom/CustomComponent";
import { $JsonHelper } from "../../Helper/$JsonHelper";
import { getApiCall, isNotValidNullUndefile, postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import { getUserAgent } from "../../Redux/Reducers/personalSlice";
import AddCareManager from "./AddCareManager";
import { $AHelper } from "../../Helper/$AHelper";
import { globalContext } from "../../../pages/_app";
import { longtermcareprefrences } from "../../../components/control/Constant";
import { Col } from "react-bootstrap";
import { fetchPrimaryUserAddressData } from "../../Redux/Reducers/apiSlice";
import { CustomAccordion, CustomAccordionBody } from "../../Custom/CustomAccordion";


const Longtermcareprefrences = forwardRef((props,ref) => {
    const {userId,setActiveModule,setStep} = props;
    const dispatch = useAppDispatch()
    const agentData = useAppSelector(selectorAgent);
    const {longtermcareprefrencessQuestions,longtermcareprefrencessAnswers,agentList,fiduciaryList,professionalList} = agentData;
    const [nextStep,setNextstep] = useState(1);
    const formLabelData = useMemo(()=>{return longtermcareprefrencessAnswers},[longtermcareprefrencessAnswers])
    const [selectedAgents,setSelectedagents] = useState([])
    const [questionlabel1201,setQuestionlabel1201] = useState({})
    const [questionlabel1202,setQuestionlabel1202] = useState({})
    const [questionlabel1203,setQuestionlabel1203] = useState({})
    const [questionlabel1204,setQuestionlabel1204] = useState({})
    const [questionlabel1205,setQuestionlabel1205] = useState({})
    const [questionlabel1206,setQuestionlabel1206] = useState({})
    const selectedAgentlist = useMemo(()=>{return selectedAgentlist?.length > 0 && selectedAgentlist?.filter((e)=>{return e.legalDocId == 7}).sort((a,b)=>a.agentRankId - b.agentRankId),[]},[selectedAgents])
    const [upsertAgent,setUpsertagent] = useState(selectedAgentlist)
    const addCaremanagerRef = useRef(null)
    const [getProfessionalUsers,setGetProfessionalUsers] = useState([])
    const {setWarning} = useContext(globalContext);
    const professionallists = useMemo(()=>{return professionalList != 'err' && professionalList?.length > 0 && professionalList?.map((e)=>({...e,'label':e.fName+' '+e.lName,'value':e.professionalUserId}))},[professionalList])
    const careManager = useMemo(()=>{return professionallists?.length > 0 ? professionallists.filter((e)=>e.proTypeId == 7) : []},[professionallists]);
    const [selectGcm,setSelectGcm] = useState([]);
    const [makeGCM,setMakeGCM] = useState([])
    const [show3more,setShow3more] = useState(0)
    const [getProfessionalUsersmore,setGetProfessionalUsersmore] = useState([])
    // const fiduciaryListarr = useMemo(()=>{return fiduciaryList != 'err' ? fiduciaryList?.filter((e)=>{return !upsertAgent.some((ele)=>{return e.value == ele.agentUserId})}) : []},[upsertAgent,fiduciary])
    const [viewDetails,setViewdetails] = useState({})
    const [searchAddress,setSearchaddress] = useState('')
    const allkeys = ["0", "1", "2"]
    const [activeKeys, setActiveKeys] = useState("0");
    


    useEffect(() => {
        const selectedCareManager = careManager?.find(e => e.lpoStatus);
        setSelectGcm(selectedCareManager || null);
    }, [careManager]);

    useEffect(()=>{
        getProfessionalfunc(searchAddress)
    },[show3more])

    const backFunc = () => {
        if(nextStep == 1) {
        setActiveModule(1)
        }else{
            setNextstep(nextStep - 1)
        }
    }

    useEffect(()=>{
        getAddress(userId)
        fetchQuestionsWithFormLabelId()
        dispatch(fetchFiduciaryList({userId:userId}))
        fetchUseragents()
         dispatch(fetchProfessionallist({userId:userId}))
         setViewdetails({})
    },[userId])

    useImperativeHandle(ref, () => ({
        postUseragentfunc,
    }));

    const getAddress = async (userId) => {
        const getAddressapi = await getApiCall('GET',$Service_Url.getAllAddress + userId)
        if(getAddressapi != 'err'){
        // console.log(getAddressapi?.addresses[0]?.city,"getAddressgetAddress")
        setSearchaddress(getAddressapi?.addresses[0]?.state)
        getProfessionalfunc(getAddressapi?.addresses[0]?.state)
        }
    }

    useEffect(()=>{
        if(selectedAgentlist.length > 0){
            setUpsertagent(selectedAgentlist)
        }
    },[selectedAgentlist])


    const fetchUseragents = () => {
        const getUseragent = getApiCall('GET',$Service_Url.getUserAgent+'?IsActive=true&userId='+userId,setSelectedagents)
        konsole.log(getUseragent,"getUseragent")
    }

    const fetchQuestionsWithFormLabelId = async () => {
        useLoader(true);
        const resultOf = await $ApiHelper.$getSujectQuestions(longtermcareprefrences);
        useLoader(false);
        konsole.log("resultOfSubjectResponse", resultOf);
        dispatch(updatelongtermcareprefrencessQuestions(resultOf))
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
                dispatch(updatelongtermcareprefrencessAnswer(formlabelData))
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
        if(label == 'label1206'){
            let json1203 = $JsonHelper.metaDataJson({...questionlabel1203,responseId:781,subjectId:412,subResponseData:true})
            konsole.log(json1203,"jsonjson1203")
            setQuestionlabel1203(json1203)
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
        if(label == 'label1206' && responseId == 787){
            const selectedLabelValue1203 = { ...formLabelData['label1203'] };
            selectedLabelValue1203.response = selectedLabelValue1203.response?.map(response => {
            if (response.responseId == 781) {
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
        formLabelInformation['label1203'] = selectedLabelValue1203;
        }
        dispatch(updatelongtermcareprefrencessAnswer(formLabelInformation))
    }
    konsole.log(longtermcareprefrencessQuestions,"longtermcareprefrencessQuestionsagentList",agentList)

    const handleSelectagent = (e,type) => {
        konsole.log(e,type,"handleSelectagent",selectedAgentlist,upsertAgent)
        // if(selectedAgentlist.length == 0){
        //     setSelectedagents([e])
        // }
        if(upsertAgent?.some((ele)=>{return e.value == ele.agentUserId}))
        {
            setWarning('warning','Warning','This person is already selected as agent, please select another one.')
            return;
        }
        let alreadyAgent = upsertAgent?.filter((agent)=>{return agent.agentRankId != type})
        // console.log(alreadyAgent,"alreadyAgent")
        let obj = { 
            ...$JsonHelper.updatetoAgentjson(),
            "agentUserId":e?.value,
            "agentUserName":e?.label,
            "memberUserId":userId,
            "agentRankId":type,
            "upsertedBy":userId,
            "agentUserRelation":e.relationWithUser
        }

        setUpsertagent((prev)=>{return [...alreadyAgent,obj]})
    }
    
    const postUseragentfunc = async () => {
        if(formLabelData?.label1205.response[0].checked == true || formLabelData?.label1205.response[1].checked == true){
        let responseofProfessional = await addCaremanagerRef?.current?.addProfessional()
        if(responseofProfessional == true){
            return;
        }
        dispatch(fetchProfessionallist({userId:userId}))
        }
        
        // if(nextStep == 3){
        let json = upsertAgent
        konsole.log(json,"upsertAgentjson")
        useLoader(true)
        const upsertAgentapi = await postApiCall('POST',$Service_Url.postAgentUpsert,json)
        useLoader(false)
        if(upsertAgentapi != 'err'){
            konsole.log(upsertAgentapi,"upsertAgent")
            // setWarning('successfully','Successfully saved data','Your data have been saved successfully.')
            fetchUseragents()
        }
    // }

        // if(nextStep == 4){
        let postJson = []
        postJson = [questionlabel1201,questionlabel1202,questionlabel1203,questionlabel1204,questionlabel1205,questionlabel1206];

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
            konsole.log(postSubjectData,"postSubjectData")
            setWarning('successfully','Successfully saved data','Your data have been saved successfully.')
            // setStep(2)
        }

        let updateProfessionals = [{
            ...$JsonHelper.$jsonProfessional(),
            "userProId": selectGcm?.userProId,
            "proUserId": selectGcm?.proUserId,
            "proCatId": selectGcm?.proCatId,
            "userId": userId,
            "upsertedBy": userId
        }]

        useLoader(true)
        const reponseProfesionals = await postApiCall('POST',$Service_Url.postProfessionalUser,updateProfessionals)
        useLoader(false)
        if(reponseProfesionals != 'err'){
        konsole.log(reponseProfesionals,"reponseProfesionals",selectGcm)
        }
    // }
    }


    const getProfessionalfunc = async(searchAddress) => {
        konsole.log("getProfessionalfunc",searchAddress);
        let dataObj = {"SearchText":searchAddress,"SearchName":"","ProSerDescIds":"1","ProTypeIds":"7","ProSubTypeIds":"","PageNumber":show3more != 0 ? show3more + 1 : 1,"RowsOfPage":show3more > 0  ? 20 : 5,"board":false}
        useLoader(true)
        const getProfessionalApi = await postApiCall('POST',$Service_Url.postGetProfessionalUsersV3,dataObj);
        useLoader(false)
        if(getProfessionalApi != 'err'){
            konsole.log(getProfessionalApi,"getProfessionalApi")
            if(show3more > 0){
                setGetProfessionalUsersmore(getProfessionalApi?.data.data)
                return;
            }
            setGetProfessionalUsers(getProfessionalApi?.data.data)
        }
    }

    const addtomyteam = async (professional) => {
        konsole.log(professional,"professional")

        let jsonProfessional = [{
            ...$JsonHelper.$jsonProfessional(),
            "proUserId":professional?.proUserId,
            "proCatId":professional?.proCatId,
            "userId":userId,
            "upsertedBy":userId,
            "instructionsToAgent":'',
          }]
          useLoader(true)
          const postProfessionalUserapi = await postApiCall('POST',$Service_Url.postProfessionalUser,jsonProfessional)
          useLoader(false)
          if(postProfessionalUserapi != 'err'){
            konsole.log(postProfessionalUserapi,"postProfessionalUserapi")
            setWarning('successfully','Successfully saved data','Your data have been saved successfully.')
            dispatch(fetchProfessionallist({userId:userId}))
          }
    }


    const addressFormat = (address) => {
        if(address?.length > 0){
            let { addressLine1, city, state, county, country, zipcode } = address[0];
            const addressData = [addressLine1, city, state, county, country, zipcode]?.filter(value => value)?.join(", ");
            return addressData;
            }
    }


    return (
        <div className="longtermcare">
            {/* <CustomAccordion
                                        isExpendAllbtn={true}
                                        activekey={activeKeys}
                                        handleActiveKeys={handleAccordionClick}
                                        activeKeys={1}
                                        allkeys={activeKeys}
                                        header={'Care Preferences'}
                                    >
                <CustomAccordionBody eventkey='0' name={"Care Preferences"} setActiveKeys={() => handleAccordionBodyClick('0')}> */}
                    <>
           {/* <div className="heading-para mt-10">
            <h4 className="fw-bold mt-10">Welcome</h4>
            <p className="mt-10 w-90">Before we begin we are going to help you make important decisions about your future care this guide will help you  make your wishes clear, help your chosen agents understand their roles, create a clear plan for your care, address important financial considerations. Take your time with each question. You can save your progress and return anytime.</p>
            <p className="mt-10">Ready to begin? Let’s start with where you’d want to receive care if needed.</p>
            </div>  */}
            <div className="heading-para mt-10">
            <h4 className="fw-bold">Initial Care Location</h4>
            <hr />
            <div>
            {radioQuestionAnswer(formLabelData?.label1201,'label1201',setQuestionlabel1201)}
            </div>
            {/* {formLabelData?.label1201?.response[0]?.checked == true && 
            <div className="mt-10 fw-14 suggestion-div">
                <hr/>
                <p className="mt-10">Lets talk about what choosing home care really means. First you should know that this choice often creates some challenges with hospitals. When someone is in the hospital, the medical team often prefers to discharge patient:</p>
                <p className="mt-10">What does this mean for you and your agent? </p>
                <ul className="mt-10">
                    <li>Your agent will need to be a strong advocate for your wishes</li>
                    <li>They’ll likely face resistance from medical professionals</li>
                    <li>They’ll need to coordinate multiple services to make your home care work</li>
                </ul>
                <p className="mt-10">Here’s what we learned from experience:</p>
                <p className="mt-10">Many families tell us they wish they’d known how much work it would be to arrange think about:</p>
                <ul className="mt-10">
                    <li>Who will coordinate the different care providers?</li>
                    <li>How will medical equipment be managed at home?</li>
                    <li>What happens if your condition changes suddenly?</li>
                    <li>Who will handle middle of the night emergencies?</li>
                </ul>
                <p className="mt-10">This is why we strongly suggest considering a care manager - they’re professionals with experience.</p>
            </div>
            } */}
             {/* {formLabelData?.label1201?.response[1]?.checked == true && 
            <div className="mt-10 fw-14 suggestion-div">
                <hr/>
                <p className="mt-10">Let's talk about what choosing a care community means for you and your agent. This choice can make some things easier, but there's still important work to be done. Here's what you and your agent need to think about:</p>
                <p className="mt-10">Location Matters: "Many families tell us they wish they'd thought more about location early on. It's not just about finding a good facility - it's about finding one that's convenient for family visits and oversight." Think about:</p>
                <ul className="mt-10">
                    <li>Do you have a preferred area?</li>
                    <li>How close should it be to family members?</li>
                    <li>What about access to your preferred doctors?</li>
                </ul>
                <p className="mt-10">Financial Considerations: "We've seen many families surprised by facility requirements. Let's plan ahead."</p>
                <ul className="mt-10">
                    <li>What insurance do you have?</li>
                    <li>Which facilities accept it?</li>
                    <li>What are the waiting list policies?</li>
                    <li>Are there entrance fees?</li>
                </ul>
                <p className="mt-10">Quality of Life, consider what matters most to you:</p>
                <ul className="mt-10">
                    <li>Do you want a facility with lots of activities?</li>
                    <li>How important is having a private room?</li>
                    <li>Do you need special dietary accommodations?</li>
                    <li>What about religious or cultural preferences?</li>
                </ul>
                <p className="mt-10">Your agent will need to research these aspects, so documenting your preferences now is crucial.</p>
            </div>
            } */}
            {/* <p className="mt-3 w-90">Before we begin we are going to help you make important decisions about your future care this guide will help you  make your wishes clear, help your chosen agents understand their roles, create a clear plan for your care, address important financial considerations. Take your time with each question. You can save your progress and return anytime.
            <br/><br/>
            Ready to begin? Let’s start with where you’d want to receive care if needed.</p> */}
            </div>
            <div>
            <div className="heading-para">
            <h4 className="fw-bold mt-10">Health Care Agents</h4>
            <hr />
            <div className="">
                <p className="pt-10 text-dark">Lets review your healthcare power of attorney agents.</p>
                <p className="pt-10 text-dark">You have named the following people as your healthcare agents:</p>
                <div className="selectagentdiv mt-10">
                    <CustomSelect label="Primary agent" placeholder="Please select a agent" options={fiduciaryList} value={upsertAgent?.filter((e)=>{return e.agentRankId == 1})[0]?.agentUserId} onChange={(e)=>handleSelectagent(e,1)} />
                    <CustomSelect label="First successor" placeholder="Please select a agent" options={fiduciaryList} value={upsertAgent?.filter((e)=>{return e.agentRankId == 7})[0]?.agentUserId} onChange={(e)=>handleSelectagent(e,7)} />
                    <CustomSelect label="Second successor" placeholder="Please select a agent" options={fiduciaryList} value={upsertAgent?.filter((e)=>{return e.agentRankId == 8})[0]?.agentUserId} onChange={(e)=>handleSelectagent(e,8)} />
                </div>
                {/* <div className="mt-10 fw-14 suggestion-div">
                <p>This is one of the most important decisions you'll make, and here's why. Think of your healthcare agent as your voice when you can't speak for yourself. They're not just filling out paperwork - they're making crucial decisions about your care and fighting for your wishes. From Real Experience "We've seen many situations where healthcare agents weren't prepared for the emotional and time demands of the role. Let's make sure your chosen agents are truly ready."</p>
                <ul className="mt-10">
                    <li>Do they understand your values and wishes?</li>
                    <li>Are they emotionally prepared to advocate for you?</li>
                    <li>Do they have the time to handle these responsibilities?</li>
                    <li>Can they handle disagreements with medical professionals?</li>
                    <li>Are they good at coordinating with others?</li>
                </ul>
                <p className="mt-10">Important Reality Check being a healthcare agent isn't just about making medical decisions. They might need to:</p>
                <p className="mt-10">Many families tell us they wish they’d known how much work it would be to arrange think about:</p>
                <ul className="mt-10">
                    <li>Attend multiple medical meetings</li>
                    <li>Coordinate with insurance companies</li>
                    <li>Manage family dynamics</li>
                    <li>Make quick decisions under pressure</li>
                    <li>Stand firm against opposing opinions</li>
                </ul>
                <p className="mt-10">Is each person on your list ready for this level of responsibility?"</p>
                <hr />
            </div> */}
            <div>{radioQuestionAnswer(formLabelData?.label1202,'label1202',setQuestionlabel1202)}</div>
            </div>
            {(formLabelData?.label1202?.response[1].checked == true)  && <p className="mt-10"><span style={{color:'#D70101'}}>Disclaimer:</span> Please contact your attorney to select new agents</p>}
            </div>
            </div> 
            <div>
            <div className="heading-para mt-10">
            <h4 className="fw-bold">Care Manager Decision</h4>
            <hr/>
            </div>
            {/* <div className="mt-10 fw-14 suggestion-div">
                <p>Let's talk about why this decision is so important. Many families tell us they wish they'd known about care managers sooner. Here's what we've learned the Reality of Managing Care without professional help, your agent will need to:</p>
                <ul className="mt-10">
                    <li>Navigate complex medical systems</li>
                    <li>Coordinate multiple care providers</li>
                    <li>Handle insurance paperwork</li>
                    <li>Manage medications and appointments</li>
                    <li>Respond to emergencies 24/7</li>
                </ul>
                <p className="mt-10">Think of a Care Manager as your agent's professional partner. They've done this hundreds of times and know how to: </p>
                <ul className="mt-10">
                    <li>How to negotiate with hospitals</li>
                    <li>Which providers are reliable</li>
                    <li>How to maximise insurance benefits</li>
                    <li>When to push back on medical decisions</li>
                    <li>How to coordinate complex care needs</li>
                </ul>
                <p className="mt-10">Cost vs. Value:</p>
                <p className="mt-10">Yes, care managers have a cost. But consider this:</p>
                <ul className="mt-10">
                    <li>They often save money by preventing mistakes</li>
                    <li>They know how to maximise insurance benefits</li>
                    <li>They can help avoid expensive crisis situations</li>
                    <li>They reduce time your agent needs to take off work</li>
                </ul>
                <hr />
            </div> */}
            <div>{radioQuestionAnswer(formLabelData?.label1203,'label1203',setQuestionlabel1203)}</div>
            {/* <hr /> */}
            <div>{(formLabelData?.label1203?.response[0].checked == true) && radioQuestionAnswer(formLabelData?.label1204,'label1204',setQuestionlabel1204)}</div>
            {formLabelData?.label1203?.response[0].checked == true ? <>{formLabelData?.label1204.response[0].checked == true ? <div> 
            {radioQuestionAnswer(formLabelData?.label1205,'label1205',setQuestionlabel1205)}
            </div> : formLabelData?.label1204.response[1].checked == true && careManager?.length > 0 ? <div className="d-flex gap-3 p-2"><CustomSelect options={professionallists} value={careManager[0]?.value} onChange={(ele)=>console.log(ele,"careManager")} /> <CustomButton label="+" onClick={()=>setShow3more(1)} /></div> : <div className="agentlist"> 
                <p>We'll help you find the right care manager.</p>
                <p className="mt-10">Here are three recommended care management companies in your area:</p>
                {getProfessionalUsers.map((e)=>(<div className="professionalaorg">
                    <div className="d-flex gap-4">
                    <div className="profileIcon"><img style={isNotValidNullUndefile(e.imageURL) ? {opacity:'1'} :{opacity:'0.4'}} src={e.imageURL || '/New/icons/ProfessionalIcon.svg'} /></div>
                    <div className="profiledetails">
                        <h4>{e.proFullName}<span><img src="/New/icons/verify.svg" />Board Certified</span></h4>
                        <p><img src="/New/icons/schoolbag.svg" />{e.proCategories[0].proType || 'N/A'}</p>
                        <p style={{width:'90%'}}><img src="/New/icons/location.svg" />{e.addresses[0]?.addressLine1 || 'N/A'}</p>
                        <p><img src="/New/icons/email.svg" />{e.proPrimaryEmail || 'N/A'}</p>
                        {/* <p><img src="/New/icons/email.svg" />{$AHelper.$formatNumber(e.proPrimaryContact) || '-'}</p> */}
                    </div>
                    </div>
                    <div className="buttons">
                        <CustomButton label="Send RFP" onClick={()=>addtomyteam(e)} disabled={true} />
                        <br/>
                        <CustomButton4 label="View" onClick={()=>setViewdetails(e)} />
                    </div>
                </div>))} 
            <div className="d-flex justify-content-end mt-3">
             <CustomButton label="Show more" onClick={()=>{setShow3more(1)}} /> 
            </div>
            </div>
            }
            </> 
            : formLabelData?.label1203?.response[1].checked == true && <div>
            {/* <div className="mt-10 fw-14 suggestion-div">
                <p className="mt-10">We understand wanting to save money, but let's talk about what your agent will face alone </p>
                <p className="mt-10">Hospital Scenario:</p>
                <p className="mt-10">Imagine your agent getting this call: "Your mother needs to be discharged tomorrow. We recommend a nursing home." Your agent says you want to go home. The hospital disagrees. Now what?</p>
                <p className="mt-10">A care manager would:</p>
                <ul className="mt-10">
                    <li>Know exactly how to handle this</li>
                    <li>Have relationships with key decision makers</li>
                    <li>Understand your rights and options</li>
                    <li>Know how to arrange proper home care</li>
                    <li>Be able to push back professionally</li>
                </ul>
                <p className="mt-10">Without a care manager:</p>
                <ul className="mt-10">
                    <li>Your agent must fight this battle alone</li>
                    <li>May face intense pressure to comply</li>
                    <li>Might not know all available options</li>
                    <li>Could miss crucial arrangements</li>
                    <li>May face liability concerns</li>
                </ul>
            </div>
            <hr/> */}
            <div>{radioQuestionAnswer(formLabelData?.label1206,'label1206',setQuestionlabel1206)}</div>
            </div>}
            {/* <div>{(formLabelData?.label1206?.response[0].checked == true) && radioQuestionAnswer(formLabelData?.label1204,'label1204',setQuestionlabel1204)}l2</div> */}
            {/* <hr/> */}
            {/* {formLabelData?.label1204.response[1].checked == true && formLabelData?.label1203?.response[0].checked == true && <CustomRadio placeholder={'Would you like to see 3 more options?'} options={[{value:1,label:'Yes, show me 3 more companies'},{value:2,label:'No, these are sufficient'}]} value={show3more} onChange={(e)=>setShow3more(e?.value)} />} */}
            { formLabelData?.label1203?.response[0].checked == true && formLabelData?.label1204?.response[0].checked == true && formLabelData?.label1205?.response[0]?.checked == true ? <div><AddCareManager type="1" userId={userId} ref={addCaremanagerRef} /></div> : formLabelData?.label1204?.response[0].checked == true && formLabelData?.label1205?.response[1].checked == true  ? <div><AddCareManager type="2" userId={userId} ref={addCaremanagerRef} /></div> : null}
            </div>           
            {/* {isNotValidNullUndefile(selectGcm?.userId) && (formLabelData?.label1204?.response[1].checked == true) && <CustomSelect label="Care Manager" placeholder="Care Manager" options={careManager} value={selectGcm?.value} onChange={(e)=>setSelectGcm(e)} />} */}
            {viewDetails?.userId && <div id="hideModalScrollFromPersonalMedicalHistory" className='modals' style={{zIndex:'99999'}}>
            <div className="modal" style={{ display: 'block', height:'95vh',overflowY:true}}>
            <div className="modal-dialog costumModal" style={{ maxWidth: '500px'}}>
            <div className="costumModal-content">
                <div className="modal-header mt-2 ms-1">
                <h5 className="modal-title">Care Manager Information</h5>
                <img className='mt-0 me-1'onClick={()=>setViewdetails({})} src='/icons/closeIcon.svg'></img>
                </div>
                <div className="costumModal-body">
                <Col className="col-12 mt-1">
                <div className="w-100 d-flex gap-4">
                <img className="d-flex border border-1 border rounded" width="120px" height="130px" src={viewDetails?.imageURL || '/New/icons/ProfessionalIcon.svg'} alt={viewDetails?.proFullName} />
                <div className="mt-2">
                <p className="spacingBottom"><span className="fw-bold">Name:</span> {viewDetails?.proFullName}</p>
                <p className="spacingBottom"><span className="fw-bold">Professional Categories:</span> {viewDetails?.proCategories[0].proType || 'N/A'}</p>
                <p className="spacingBottom"><span className="fw-bold">Gender:</span> {viewDetails?.gender}</p>
                <p className="spacingBottom"><span className="fw-bold">Age:</span> {viewDetails?.dob && $AHelper.$getAge(viewDetails?.dob)}</p>
                </div>
                </div>
                <div className="mt-3">
                <p className="spacingBottom"><span className="fw-bold">Biography:</span> {viewDetails?.biography}</p>
                <p className="spacingBottom"><span className="fw-bold">Address:</span> {addressFormat(viewDetails?.addresses) || 'N/A'}</p>
                <p className="spacingBottom"><span className="fw-bold">Email:</span> {viewDetails?.proPrimaryEmail || 'N/A'}</p>
                <p className="spacingBottom"><span className="fw-bold">Contact:</span> {$AHelper?.$formatNumber(viewDetails?.proPrimaryContact) || 'N/A'}</p>
                <div className="w-100 mt-3 d-flex justify-content-between mb-2">
                <CustomButton3 label="Close" onClick={()=>setViewdetails({})} />
                <CustomButton className="w-100" label="Add to my team" onClick={()=>addtomyteam(e)} />
                </div>
                </div>
                </Col>
                </div>
            </div>
            </div>
        </div>
        </div>}
        {show3more > 0 && <div id="hideModalScrollFromPersonalMedicalHistory" className='modals' style={{zIndex:'9999'}}>
            <div className="modal" style={{ display: 'block', height:'95vh',overflowY:true}}>
            <div className="modal-dialog costumModal" style={{ maxWidth: '750px'}}>
            <div className="costumModal-content">
                <div className="modal-header mt-2 ms-1">
                <h5 className="modal-title">Care Manager List</h5>
                <img className='mt-0 me-1'onClick={()=>setShow3more(0)} src='/icons/closeIcon.svg'></img>
                </div>
                <div className="costumModal-body">
                <Col className="col-12 mt-1">
                {getProfessionalUsersmore?.length == 0 ? 'No data' : getProfessionalUsersmore?.map((e)=>(<div className="professionalaorg">
                    <div className="d-flex gap-4">
                    <div className="profileIcon"><img style={isNotValidNullUndefile(e.imageURL) ? {opacity:'1'} :{opacity:'0.4'}} src={e.imageURL || '/New/icons/ProfessionalIcon.svg'} /></div>
                    <div className="profiledetails">
                        <div className="namediv">{e.proFullName}<span><img src="/New/icons/verify.svg" />Board Certified</span></div>
                        <div><img src="/New/icons/schoolbag.svg" />{e.proCategories[0].proType || 'N/A'}</div>
                        <div style={{width:'90%'}}><img src="/New/icons/location.svg" />{e.addresses[0]?.addressLine1 || 'N/A'}</div>
                        <div><img src="/New/icons/email.svg" />{e.proPrimaryEmail || 'N/A'}</div>
                    </div>
                    </div>
                    <div className="buttons">
                        <CustomButton label="Send RFP" onClick={()=>addtomyteam(e)} disabled={true} />
                        <br/>
                        <CustomButton4 label="View" onClick={()=>setViewdetails(e)} />
                    </div>
                </div>))} 
                <div className="d-flex justify-content-end mt-3">
            {getProfessionalUsersmore?.length != 0 && <CustomButton label="Show more" onClick={()=>{setShow3more((prev)=>prev+1)}} />}
            </div>
                </Col>
                </div>
            </div>
            </div>
        </div>
        </div>}
            {/* <div className="d-flex justify-content-end mt-10">
                <CustomButton label={"Next: Care Funding"} 
                onClick={()=>postUseragentfunc()} 
                />
            </div> */}
            </>
            {/* </CustomAccordionBody>
            </CustomAccordion> */}
        </div>
    )
})
export default Longtermcareprefrences;