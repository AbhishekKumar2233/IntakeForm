import React, { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { CustomButton, CustomButton2 } from "../../Custom/CustomButton";
import { useAppDispatch, useAppSelector } from "../../Hooks/useRedux";
import { selectorAgent } from "../../Redux/Store/selectors";
import { CustomInput, CustomMultipleSearchSelect, CustomMultipleSelect, CustomRadioGuidance, CustomSelect, CustomTextarea } from "../../Custom/CustomComponent";
import { $JsonHelper } from "../../Helper/$JsonHelper";
import { updatedeathImmediateActionAnswer, updateendoflifeImmediateActionAnswer, updateillnessImmediateActionAnswer, updatementalhealthImmediateActionAnswer, updatelongtermcareprefrencessAnswer } from "../../Redux/Reducers/agentSlice";
import konsole from "../../../components/control/Konsole";
import { getApiCall, isNotValidNullUndefile, postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import { useLoader } from "../../utils/utils";
import { globalContext } from "../../../pages/_app";


const AdditionalInformations = forwardRef((props,ref) => {
    const {userId,setSection,setStep,section,setActiveModule} = props;
    const agentData = useAppSelector(selectorAgent);
    const {setWarning} = useContext(globalContext)
    const {illnessImmediateActionAnswers,agentList,mentalHealthImmediateActionAnswers,endoflifeImmediateActionAnswers,deathImmediateActionAnswers,longtermcareprefrencessAnswers} = agentData;
    const formLabelData = useMemo(()=>{return section == 1 ? longtermcareprefrencessAnswers : section == 2 ? mentalHealthImmediateActionAnswers : section == 3 ? endoflifeImmediateActionAnswers : deathImmediateActionAnswers},[section,longtermcareprefrencessAnswers,mentalHealthImmediateActionAnswers,endoflifeImmediateActionAnswers,deathImmediateActionAnswers])
    const agentDataList = useMemo(()=>{return agentList != 'err' && agentList?.length > 0 ? agentList?.filter((a,index)=>{return agentList[index]?.agentUserId != agentList[index-1]?.agentUserId}).map((e)=> ({'label':e?.fullName,'value':e?.agentUserId})) : []},[agentList])
    
    const addnewAgentJson = {
        "id":1,
        "notifyText": "",
        "notifyMessages":[],
        "notifyMemId":0
      }
    
    const [selectedValues,setSelectedvalues] = useState([])
    const dispatch = useAppDispatch()
    const [label995,setLabel995] = useState({})
    const [label925,setLabel925] = useState({})
    const [label1002,setLabel1002] = useState({})
    const [label1003,setLabel1003] = useState({})
    const [label996,setLabel996] = useState({})
    const [label926,setLabel926] = useState({})
    const [label997,setLabel997] = useState({})
    const [label927,setLabel927] = useState({})
    const [notifyText,setNotifyText] = useState('')
    const [notifyArray,setNotifyarray] = useState([{...addnewAgentJson}])

    // console.log(section,"sectionformLabelData",formLabelData)
    // console.log(agentDataList,"agentDataList",agentList)

    useEffect(()=>{
        fetchNotifyMessage()
        fetchNotifyContactMap()
        setNotifyarray([{...addnewAgentJson}])
    },[section])

    const fetchNotifyMessage = async () => {
        useLoader(true)
        const response = await getApiCall('GET',$Service_Url.getNotifyMessage+userId+'/'+1+'/'+3+'/'+section)
        useLoader(false)
        if(response != 'err'){
        setNotifyText(response[0]?.notifyText)
        setNotifyarray(response)
        // console.log(response,"fetchNotifyMessage")
        }
    }

    const fetchNotifyContactMap = async () => {
        useLoader(true)
        const response = await getApiCall('GET',$Service_Url.getNotifyContact+userId+'/'+3+'/'+section)
        useLoader(false)
        if(response != 'err'){
        let agentList = agentDataList.filter((e)=>{return response.some((item)=>{return item.contactUserId == e.value})})
        setSelectedvalues(response)
        }
    }

    const radioQuestionAnswer = (question,label,setState,type) => {
        return <div >
        {type == 'input' ? <div className="mt-0">
            <CustomTextarea placeholder="Enter here" label={question?.question} value={question?.response[0]?.response} notCapital="true" onChange={(e) => handleChange({ id: question.response[0]?.responseId, value: e }, question, label, setState, 'Input')} />
        </div>:<div className="question-div">
            <p>{question?.question}</p>
            <div className="radio-container d-flex flex-wrap mt-0">
                {question?.response?.map((item,index)=>{
                    let isChecked = item?.checked == true ? true : '';
                    // console.log(isChecked,"isChecked",item)
                    return <div className="w-100">
                     <CustomRadioGuidance key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                        onChange={(e) => handleChange({ id: item?.responseId, value: e.target.checked }, question, label, setState, 'Radio')}/> 
                    </div>
                })}
            </div>
            </div>}
    </div>
    }

    const handleChangeNotify = (e,item,type) => {
        // console.log(e,"professionalalertListedit",type,"item",item)
        let notifyMessages = item.notifyMessages[0]
        notifyMessages = type == 'notifyMessages'  && e.map((prof)=>{return{...notifyMessages,contactUserId:prof.value,contactMapId:0}})
        item = {...item,[type]:type == 'notifyMessages' ? [notifyMessages].flat() : e}
        // console.log(item,"itemitem")
        setNotifyarray(notifyArray.map((data) => 
            data.notifyMemId == item.notifyMemId ? item : data
        ))
    }

    // console.log(notifyArray,"notifyArray")
    const mainSectionfunc = (question1,question2,setLabel1,setLabel2,label1,label2) => {
        return <><div className="questions w-100">
        {radioQuestionAnswer(question1,label1,setLabel1)}
        </div>
        {question1?.response[0]?.checked == true && notifyArray.map((e,index) => (<div className="d-flex gap-3">
        <div className={`agentinvite-div w-100 h-100  ${index > 0 ? 'mt-4' : ''}`}>
         <div className="w-100 h-100">
          <div className="d-flex justify-content-between w-100"><span></span>{index != 0 && <button onClick={()=>setNotifyarray(notifyArray.filter((item)=>{return item.notifyMemId != e.notifyMemId}))}><img src="/icons/closeIcon.svg" /></button>}</div>
          <CustomMultipleSelect label="Select agent to be instructed" placeholder="Select agent" options={agentDataList} selectedValues={e.notifyMessages?.length > 0 ? agentDataList.filter((prof)=> e?.notifyMessages.some((n)=> prof.value == n.contactUserId))  : []} onChange={(ele)=>{handleChangeNotify(ele,e,'notifyMessages')}} />
            <div className="mt-15">
            <CustomTextarea label="Enter Special Instructions for these selected agents wish to be done for you" placeholder="Please type something here..." value={e.notifyText} onChange={(ele)=>handleChangeNotify(ele,e,'notifyText')}  />
            </div>
          </div>
        </div>
        {notifyArray.length && <div className="d-flex align-items-end"><button className="add-button" onClick={()=>setNotifyarray((prev)=>[...prev,{...addnewAgentJson,notifyMemId:index}])}><img src="/icons/closeIcon.svg" /></button></div>}
        </div>))}</>
    }

    const handleChange = (e, labelData, label, setState, type) => {
        konsole.log('handleCurrencyInput', e, labelData, label, setState, type)
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
        konsole.log(section,"formLabelInformation", formLabelInformation);
        let updateAnswers = section == 1 ? updatelongtermcareprefrencessAnswer : section == 2 ? updatementalhealthImmediateActionAnswer : section == 3 ? updateendoflifeImmediateActionAnswer : updatedeathImmediateActionAnswer
        dispatch(updateAnswers(formLabelInformation))
        // console.log(updateAnswers,"updateAnswers")
    }

    const createContactMapJson = (arrList,type) => {
        return arrList.map((e)=>{
            return {
                "contactMapId": type == 'add' ? 0 : e.contactMapId,
                "primaryMemberId": userId,
                "contactNatureId":type == 'add' ? 3 : e.contactNatureId,
                "contactUserId": type == 'add' ? e.value : e.contactUserId,
                "notifyConditionId": 1,
                "contactStatus": type == 'delete' ? false : true,
                "notifyMemId": type == 'add' ? 0 : e.notifyMemId,
                "proTypeId": e.proTypeId ? e.proTypeId : 0,
                "upsertedBy": userId
              }
        })
        
    }

    useImperativeHandle(ref,()=>({
        SubmitData
    }))

const SubmitData = async () => {
    let postJson = []
        postJson = [label995,label925,label1002,label1003,label996,label926,label997,label927];

        const filteredArray = postJson.filter(obj => Object?.keys(obj).length !== 0);

        let jsonObj = {
            userId:userId,
            userSubjects:filteredArray
        }
        useLoader(true)
        const postSubjectData = await postApiCall('PUT',$Service_Url.putusersubjectdata,jsonObj);
        useLoader(false)

        let selectAgentList = notifyArray.map((e)=>{return e.notifyMessages}).flat().map((e)=>({'label':e.contactUserId,'value':e.contactUserId,'proTypeId':e.proTypeId}));
        let addAgentList = [];
        let updateAgentList = [];
        let deleteAgentList = [];

        addAgentList = selectAgentList.filter((e)=>{return !selectedValues.some((item)=>{return item.contactUserId == e.value})});
        updateAgentList = selectedValues.filter((e)=>{return selectAgentList.some((item)=>{return item.value == e.contactUserId})});
        deleteAgentList = selectedValues.filter((e)=>{return !selectAgentList.some((item)=>{return item.value == e.contactUserId})});
        // console.log(selectedValues,"selectProfessionalList")

        addAgentList = createContactMapJson(addAgentList,'add')
        updateAgentList = createContactMapJson(updateAgentList,'update')
        deleteAgentList = createContactMapJson(deleteAgentList,'delete')

        const notifyContactAgentArray = [...addAgentList,...updateAgentList,...deleteAgentList].flat();

        let notifyMessageJson =  notifyArray.map((e)=>{return{
            "notifyMemId": e.notifyMemId ? e.notifyMemId : 0,
            "primaryMemId": userId,
            "notifyTypeId": 1,
            "contactNatureId": 3,
            "notifyConditionId": section,
            "notifyText": e.notifyText,
            "isActive": true,
            "upsertedBy": userId
          }})
        
        
        const putNotifyMessageApi = await postApiCall('POST',$Service_Url.postNofityMessage,notifyMessageJson)
        if(putNotifyMessageApi != 'err'){
            notifyContactAgentArray = notifyContactAgentArray.map((e)=>{ return {...e,notifyMemId:putNotifyMessageApi.data.data[0].notifyMemId == e?.notifyMemId ? putNotifyMessageApi.data.data[0]?.notifyMemId : putNotifyMessageApi.data.data?.length > 0 ?  putNotifyMessageApi.data.data[1]?.notifyMemId : putNotifyMessageApi.data.data[0]?.notifyMemId}}).flat()
            // console.log(putNotifyMessageApi,'putNotifyMessageApi')
        }


        const putNotifyContactApi = await postApiCall('POST',$Service_Url.postcontactmap,notifyContactAgentArray);
        if(putNotifyContactApi != 'err'){
            // console.log(putNotifyContactApi,"putNotifyContactApi")
        }
        fetchNotifyMessage()
        fetchNotifyContactMap()
        // setWarning('successfully','Successfully saved data','Your data have been saved successfully.')
        // setSection(section+1);
        // setStep(1)
        // if(section == 4){
        //     setActiveModule(3)
        // }

        // fetchResponseWithQuestionId(illnessImmediateActionQuestions)
        // console.log(postSubjectData,"postSubjectData")
        // console.log(filteredArray,"postJson",postJson)
}

    
    // console.log(formLabelData,"formLabelDataagentList",label995,"section",section)
    return (
        <div className="additional-information">
            <div>
                <div className="heading-para mt-10">
                    {/* <h4 className="fw-bold">Additional Information</h4> */}
                    <p className="mt-3">Please provide any other preferences or instructions for how you’d like to be cared for if you become ill. This could include treatments you prefer, places you’d like to receive care, or any particular steps you want your agent to follow during your illness.</p>
                    <hr />
                </div>
                {section == 1 && mainSectionfunc(formLabelData?.label995,formLabelData?.label925,setLabel995,setLabel925,'label995','label925')}
                {section == 2 && mainSectionfunc(formLabelData?.label1003,formLabelData?.label1002,setLabel1003,setLabel1002,'label1003','label1002')}
                {section == 3 && mainSectionfunc(formLabelData?.label996,formLabelData?.label926,setLabel996,setLabel926,'label996','label926')}
                {section == 4 && mainSectionfunc(formLabelData?.label997,formLabelData?.label927,setLabel997,setLabel927,'label997','label927')}
            </div>

            {/* <div className="d-flex justify-content-end mt-4">
                <CustomButton label={`Save & Proceed to ${section == 1 ? 'Mental Health' : section == 2 ? 'End of Life' : section == 3 ? 'Death' : 'Finance'}`} onClick={()=>SubmitData()} />
            </div> */}
        </div>
    )
})

export default AdditionalInformations;