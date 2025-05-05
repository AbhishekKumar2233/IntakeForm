import React, { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { CustomButton, CustomButton2 } from "../../Custom/CustomButton";
import { CustomMultipleSearchSelect, CustomMultipleSelect, CustomSearchSelect, CustomSelect, CustomTextarea } from "../../Custom/CustomComponent";
import { useAppDispatch, useAppSelector } from "../../Hooks/useRedux";
import { selectorAgent, selectorLegal } from "../../Redux/Store/selectors";
import { getApiCall, isNotValidNullUndefile, postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import { fetchProfessionalType, updateprofessionalList } from "../../Redux/Reducers/agentSlice";
import { useLoader } from "../../utils/utils";
import { updateFamilyMemberList } from "../../Redux/Reducers/legalSlice";
import { globalContext } from "../../../pages/_app";
import { $AHelper } from "../../../components/control/AHelper";
import konsole from "../../../components/control/Konsole";


const HealthAlerts = forwardRef((props,ref) => {
    const {userId,setStep,setSection,section,step} = props;
    const addnewProfessionalJson = {
        "id":1,
        "notifyText": "",
        "professionalList":[],
        "proTypeId":1,
        "notifyMessages":[{proTypeId:0}]
      }
    const [alertList,setAlertlist] = useState([{}])
    const [professionalalertList,setprofessionalAlertlist] = useState([addnewProfessionalJson])
    const legalSliceStateData = useAppSelector(selectorLegal);
    const {familyMemberList} = legalSliceStateData;    
    const agentData = useAppSelector(selectorAgent);
    const {professionalList,professionalType} = agentData;
    const dispatch = useAppDispatch()
    const [selectedFamily,setSelectedFamily] = useState([])
    const [selectedProfessional,setSelectedProfessional] = useState([])
    const [notifyFamily,setNotifyFamily] = useState('')
    const [notifyProfessional,setNotifyProfessional] = useState('')
    const [familyContactList,setFamiltContactList] = useState([])
    const [notifyFamilyJson,setNotifyFamilyJson] = useState('')
    const notifyTypearray = [{label:'Mail',value:1},{label:'Text',value:2},{label:'Both',value:3}]
    const [notifyTypeId,setNotifyTypeId] = useState(1)
    const {setWarning} = useContext(globalContext)



    const familyList = useMemo(()=>{return familyMemberList?.length > 0 ? familyMemberList?.map((e)=>({'label':e.fName+' '+e?.lName,'value':e.userId})) : []},[section,familyMemberList])
    const professionallists = useMemo(()=>{return professionalList != 'err' ? professionalList.map((e)=>({'label':e.fName+' '+e.lName,'value':e.professionalUserId,'proTypeId':e.proTypeId})) : []},[professionalList,section])

    konsole.log(professionallists,"professionalListprofessionalList",familyList)
    
    useEffect(()=>{
        if(professionalList?.length == 0){
        fetchProfessionallist()
        }
        if(familyMemberList?.length == 0){
        fetchFamilyMembersList()
        }
        fetchNotifyMessage()
        fetchNotifyContactMap()
        dispatch(fetchProfessionalType())
        setAlertlist([{}])
        setNotifyFamily('')
        setprofessionalAlertlist([{...addnewProfessionalJson}])
        setSelectedFamily([])
    },[section,step])


    const fetchProfessionallist = async () => {
        useLoader(true)
        const apiResponse = await getApiCall('GET',$Service_Url.getSearchProfessional+`?MemberUserId=${userId}&ProTypeId=&primaryUserId=${userId}`);
        useLoader(false)
        if(apiResponse != 'err'){
            // setProfessionalist(apiResponse)
            dispatch(updateprofessionalList(apiResponse))
        }
        console.log(apiResponse,"apiResponse")
    }

    const fetchFamilyMembersList = async () => {
        useLoader(true);
        const _resultOfInsuranceDetail = await getApiCall('GET', $Service_Url.getFamilyMembers + userId);
        useLoader(false);
        const insDetails = _resultOfInsuranceDetail != 'err' ? _resultOfInsuranceDetail?.filter((e)=>{return e?.memberStatusId != 2 && e?.memberStatusId != 3}) : []
        // console.log(insDetails,_resultOfInsuranceDetail,"_resultOfInsuranceDetail")
        dispatch(updateFamilyMemberList(insDetails));
      }


    const fetchNotifyMessage = async () => {
        useLoader(true)
        const response = await getApiCall('GET',$Service_Url.getNotifyMessage+userId+'/'+0+'/'+1+'/'+section)
        const responseProfessionals = await getApiCall('GET',$Service_Url.getNotifyMessage+userId+'/'+0+'/'+2+'/'+section)
        useLoader(false)
        if(response != 'err'){
        console.log(response,"fetchNotifyMessage",responseProfessionals)
        setNotifyFamily(response[0]?.notifyText)
        setNotifyFamilyJson(response[0])
        setNotifyTypeId(response[0].notifyTypeId)
        }else{
            setNotifyFamily('')
            setNotifyFamilyJson([])
        }
        if(responseProfessionals != 'err'){
        setNotifyProfessional(responseProfessionals[0]?.notifyText)
        setprofessionalAlertlist(responseProfessionals)
        }
    }

    const fetchNotifyContactMap = async () => {
        useLoader(true)
        const response = await getApiCall('GET',$Service_Url.getNotifyContact+userId+'/'+0+'/'+section)
        useLoader(false)
        if(response == 'err') return;
        // console.log(response,"fetchNotifyContactMap")
        const selectedMembers = familyList?.length > 0 ? familyList?.filter((e)=>{return response.some((item)=>{return item.contactUserId == e.value})}) : []
        const selectedProfessional = response?.filter((e)=>{return e.contactNatureId == 2})
        // console.log(selectedProfessional,"selectedProfessionalresponse",professionalList,"response",response)
        setSelectedFamily(selectedMembers)
        setFamiltContactList(response)
        setSelectedProfessional(selectedProfessional)
    }

    console.log(selectedFamily,"selectedFamily",selectedProfessional,"selectedProfessional")
    
    const handleChange = (e, item, type) => {
        console.log(e, "professionalalertListedit", type, "item", item);
    
        let notifyMessages = item.notifyMessages;
    
        if (type === 'proTypeId') {
            notifyMessages = notifyMessages.map(message => ({
                ...message,
                proTypeId: e.value,
                contactUserId:''
            }));
        }
    
        if (type === 'notifyMessages') {
            notifyMessages = e.map(prof => ({
                contactUserId: prof.value,
                contactMapId: 0,
                proTypeId: item?.proTypeId?.value || notifyMessages[0]?.proTypeId?.value || 0 
            }));
        }
    
        item = {
            ...item,
            [type]: type === 'notifyMessages' ? notifyMessages : e,  
            notifyMessages: notifyMessages
        };
    
        console.log(item, "updated item", e, "notifyMessages", notifyMessages);
    
        setprofessionalAlertlist(
            professionalalertList.map((data) => 
                data.notifyMemId === item.notifyMemId ? item : data
            )
        );
    };
        
    // console.log(professionalalertList,"professionalalertList",notifyTypeId)
    // console.log(selectedFamily.flat(),"selectedFamilyflatfamilyList",familyList)

    const alertMessagefunc = (title,state,setState,notifyText,setNotifyText) => {
        console.log(state,"statestatestatestate",title)
        let subHeading = title == 'Friends & Family messages' ? 'This is the message that will go to your family and friends. You can personalize it to gently let them know how they can best support you. Whether it’s offering emotional support or just being there for you, your loved ones will know how to help when you need them most.' : 'Here, you can notify professionals like your care manager or healthcare providers. Use this space to give them any important updates about your mental health care, so they can respond quickly and ensure your well-being is taken care of.'
        return <div className="alert-div">
        <h4>{title}</h4>
        <p>{subHeading}</p>
        {state?.length > 0 && state?.map((item,index)=>(<div className={index == state?.length - 1 ? `d-flex justify-content-between w-100 h-100` : `w-100 h-100`}>
        <div className="alert-section">
            <div className="w-100 d-flex justify-content-between">{title == 'Friends & Family messages' ? <p>To</p> : <span></span>}{index != 0 && <button onClick={()=>setState(state.filter((e)=>{return e.id != item.id}))}><img src="/icons/closeIcon.svg" /></button>}</div>
            <div className="w-100">
                {title == 'Friends & Family messages' ? <div className="col-12 d-flex"><div className="col-9 h-100"> <CustomMultipleSelect placeholder="Select Family Member & Friend" label="Select applicable family & friend" isSubOpened={true} options={familyList} selectedValues={selectedFamily.flat()} onChange={(e)=>setSelectedFamily((prev)=>[e])} isCategorized={false} /></div>
                <div className="col-3"><CustomSelect label="Notify type" placeholder="Notify type" options={notifyTypearray} value={notifyTypeId} onChange={(e)=>setNotifyTypeId(e.value)} /></div></div>:
                <div className="d-flex select-professionals"> 
                    <div className="col-3">
                    <CustomSearchSelect label="Select Profession" placeholder="Geriatric Care Manager" options={professionalType} value={item?.notifyMessages?.length > 0 ? item?.notifyMessages[0]?.proTypeId : ''} onChange={(e)=>handleChange(e,item,'proTypeId')} />
                    </div>
                    <div className="col-7 h-100">
                    <CustomMultipleSelect label="Select applicable professionals" placeholder="Select Professional" options={professionallists?.filter((e)=>{return isNotValidNullUndefile(item?.proTypeId?.value) ? e.proTypeId == item?.proTypeId?.value : e})} selectedValues={item?.notifyMessages?.length > 0 ? professionallists?.filter((prof)=> item?.notifyMessages.some((n)=> prof.value == n.contactUserId)) : []} onChange={(e)=>handleChange(e,item,'notifyMessages')} />
                    </div>
                    <div className="col-2">
                    <CustomSelect label="Notify type" placeholder="Notify type" options={notifyTypearray} value={item.notifyTypeId} onChange={(e)=>handleChange(e.value,item,'notifyTypeId')} />
                    </div>
                </div>}
                {title == 'Friends & Family messages' ? <div className="mt-15">
                <CustomTextarea placeholder="Enter message..." value={notifyText} onChange={(e)=>setNotifyText(e)} />
                </div> : <div className="mt-15">
                <CustomTextarea placeholder="Enter message..." value={item?.notifyText} onChange={(e)=>handleChange(e,item,'notifyText')} />
                </div>}
            </div>
        </div>
        {title != 'Friends & Family messages' && index == state.length - 1 && <div className="d-flex align-items-end">
        <button className="add-button" onClick={()=>setState((prev)=>[...prev,{...addnewProfessionalJson,id:index}])}><img src="/icons/closeIcon.svg" />
        </button>
        </div>}
        </div>))}
    </div>
    }


    const createContactMapJson = (arrList,type) => {
        return arrList.map((e)=>{
            return {
                "contactMapId": type == 'add' ? 0 : e.contactMapId,
                "primaryMemberId": userId,
                "contactNatureId":type == 'add' ? 1 : e.contactNatureId,
                "contactUserId": type == 'add' ? e.value : e.contactUserId,
                "notifyConditionId": 1,
                "contactStatus": type == 'delete' ? false : true,
                "notifyMemId": type == 'add' ? 0 : e.notifyMemId,
                "proTypeId": e.proTypeId ? e.proTypeId : 0,
                "upsertedBy": userId
              }
        })
        
    }

    const createContactMapProfessionalJson = (arrList,type) => {
        return arrList.map((e)=>{
            return {
                "contactMapId": type == 'add' ? 0 : e.contactMapId,
                "primaryMemberId": userId,
                "contactNatureId":type == 'add' ? 2 : e.contactNatureId,
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
        submitData
    }))

   const submitData = async () => {
    console.log(familyList,"selectedFamily",selectedFamily,selectedFamily.flat().length,"familyContactList",familyContactList.length)
    console.log(professionalList,"professionalList",professionalalertList,"professionalalertList")
    let selectedFamilyList = selectedFamily.flat()
    let addMemberList = []
    let updateMemberList = []
    let deleteMemberList = []
    let selectProfessionalList = professionalalertList?.map((e)=>{return e.notifyMessages})?.flat()?.map((e)=>({'label':e?.contactUserId,'value':e?.contactUserId,'proTypeId':e?.proTypeId}));
    let addProfessionalList = [];
    let updateProfessionalList = [];
    let deleteProfessionalList = [];
    console.log(selectProfessionalList,selectedProfessional,"selectProfessionalList2",selectedFamilyList,familyContactList)
    // if(selectedFamilyList.length >= familyContactList.length){ 
        addMemberList = selectedFamilyList.filter((e)=>{return !familyContactList.some((item)=>{return item.contactUserId == e.value})});
        updateMemberList = familyContactList.filter((e)=>{return selectedFamilyList.some((item)=>{return item.contactUserId == e.value})});
        deleteMemberList = familyContactList.filter((e)=>{return !selectedFamilyList.some((item)=>{return item.value == e.contactUserId})});

        addProfessionalList = selectProfessionalList.filter((e)=>{return !selectedProfessional.some((item)=>{return item.contactUserId == e.value})});
        updateProfessionalList = selectedProfessional.filter((e)=>{return selectProfessionalList.some((item)=>{return item.value == e.contactUserId})});
        deleteProfessionalList = selectedProfessional.filter((e)=>{return !selectProfessionalList.some((item)=>{return item.value == e.contactUserId})});
    // }

    addMemberList = createContactMapJson(addMemberList,'add')
    updateMemberList = createContactMapJson(updateMemberList,'update')
    deleteMemberList = createContactMapJson(deleteMemberList,'delete')

    console.log(addProfessionalList,"addProfessionalList2",updateProfessionalList,"deleteProfessionalList",deleteProfessionalList)

    addProfessionalList = createContactMapProfessionalJson(addProfessionalList,'add')
    updateProfessionalList = createContactMapProfessionalJson(updateProfessionalList,'update')
    deleteProfessionalList = createContactMapProfessionalJson(deleteProfessionalList,'delete')

    console.log(addProfessionalList,"addProfessionalList",updateProfessionalList,deleteProfessionalList)

    const notifyContactMapArray = [...addMemberList,...updateMemberList,...deleteMemberList].flat();
    const notifyContactProfessionalArray = [...addProfessionalList,...updateProfessionalList,...deleteProfessionalList].flat();
    
    let notifyMessageJson = [{
        "notifyMemId": notifyFamilyJson.notifyMemId ? notifyFamilyJson.notifyMemId : 0,
        "primaryMemId": userId,
        "notifyTypeId": notifyTypeId,
        "contactNatureId": notifyFamilyJson.contactNatureId ? notifyFamilyJson.contactNatureId : 1,
        "notifyConditionId": section,
        "notifyText": notifyFamily,
        "isActive": true,
        "upsertedBy": userId
      }
    ]

    let notifyMessageProfessionalJson = professionalalertList.map((e)=>{
        return {
            "notifyMemId": e.notifyMemId,
            "primaryMemId": userId,
            "notifyTypeId": e.notifyTypeId,
            "contactNatureId": 2,
            "notifyConditionId": section,
            "notifyText": e.notifyText,
            "isActive": true,
            "upsertedBy": userId,
            "proTypeId":e.proTypeId
        }
    })

    console.log(professionalalertList,"professionalalertList")
    useLoader(true)
    const putNotifyMessageApi = await postApiCall('POST',$Service_Url.postNofityMessage,notifyMessageJson)
    useLoader(false)
    if(putNotifyMessageApi != 'err'){
        notifyContactMapArray = notifyContactMapArray.map((e)=>{
            return{...e,notifyMemId:putNotifyMessageApi.data.data[0].notifyMemId}
        })
        console.log(putNotifyMessageApi,'putNotifyMessageApi',notifyContactMapArray)
    }
    useLoader(true)
    const putNotifyMessageApiprofessional = await postApiCall('POST',$Service_Url.postNofityMessage,notifyMessageProfessionalJson)
    useLoader(false)
    if(putNotifyMessageApiprofessional != 'err'){
        notifyContactProfessionalArray = notifyContactProfessionalArray.map((e)=>{ return {...e,notifyMemId:putNotifyMessageApiprofessional.data.data[0].notifyMemId == e.notifyMemId ? putNotifyMessageApiprofessional.data.data[0].notifyMemId : putNotifyMessageApiprofessional?.length > 0 ? putNotifyMessageApiprofessional.data.data[1].notifyMemId :   putNotifyMessageApiprofessional.data.data[0].notifyMemId}}).flat()
        console.log(putNotifyMessageApiprofessional,'putNotifyMessageApiprofessional',notifyContactProfessionalArray)
    }

    const putNotifyContactApi = await postApiCall('POST',$Service_Url.postcontactmap,notifyContactMapArray);
    if(putNotifyContactApi != 'err'){
        console.log(putNotifyContactApi,"putNotifyContactApi")
    }

    const putNotifyContactApiProfessional = await postApiCall('POST',$Service_Url.postcontactmap,notifyContactProfessionalArray);
    if(putNotifyContactApiProfessional != 'err'){
        console.log(putNotifyContactApiProfessional,"putNotifyContactApiProfessional")
    }
    // setWarning('successfully','Successfully saved data','Your data have been saved successfully.')
    // setStep(4)
    
   }

    return (
        <div className="HealthAlert ms-2">
            {/* <div className="heading-para mt-2">
                <h4 className="fw-bold">Care Alerts</h4>
                <p className="mt-3">Keep the people who matter most in the loop. Choose who should be informed when there are changes to your care, so your loved ones and agents are always up to date and ready to support you.</p>
                <hr/>
            </div> */}
            <hr/>
            {alertMessagefunc('Friends & Family messages',alertList,setAlertlist,notifyFamily,setNotifyFamily)}
            <hr className="mt-4" />
            {alertMessagefunc('Professional messages',professionalalertList,setprofessionalAlertlist,notifyProfessional,setNotifyProfessional)}
        </div>
    )
})
export default HealthAlerts;