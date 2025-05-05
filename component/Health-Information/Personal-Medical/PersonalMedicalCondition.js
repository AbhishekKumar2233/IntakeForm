import React, { useEffect, useState, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";
import { CustomCheckBox, CustomInput } from "../../Custom/CustomComponent";
import { getApiCall, isNotValidNullUndefile, postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";
import konsole from "../../../components/control/Konsole";
import { $JsonHelper } from "../../Helper/$JsonHelper";
import { useLoader } from "../../utils/utils";
import { CustomButton, CustomButton3 } from "../../Custom/CustomButton";

const medicalConditions = [
    { id: 1, condition: 'Dementia/Alzheimer’s' },
    { id: 2, condition: 'Parkinson’s' },
    { id: 3, condition: 'Heart disease' },
    { id: 4, condition: 'Stroke' },
    { id: 5, condition: 'Diabetes' },
    { id: 6, condition: 'Blood pressure issues' },
    { id: 7, condition: 'Elevated cholesterol' },
    { id: 8, condition: 'Glaucoma' }
];

const PersonalMedicalCondition = forwardRef(({userId,medicalConditionsPlaceholder, startTabIndex},ref) => {
    const { loggedInUserId ,isPrimaryMemberMaritalStatus} = usePrimaryUserId();
    const [personalData, setPersonalData] = useState([]);
    const [medicalHistoryObj,setMedicalHistoryObj] = useState($JsonHelper.medicalHistoryObj())
    const [showPopup,setShowpopup] = useState(false)
    const startingTabIndex = startTabIndex ?? 0;


    useEffect(() => {
        console.log(userId,"userIduserIduserIduserId")
        if(isNotValidNullUndefile(userId)){
            fetchApi(userId);
          }
    }, [userId]);

    const fetchApi = useCallback(async (userId) => {
            const result = await getApiCall('GET', `${$Service_Url.getuserfamilyHistory}${userId}/1`);
            if (result !== "err" && result.userMedHistory.length > 0) {
                setPersonalData(result.userMedHistory);
            }
    }, []);

    const handleInputChange = useCallback((checked, condition) => {
        setShowpopup(checked);
        const data = {
            ...medicalHistoryObj,
            disease: condition.condition,
            diseaseId: condition.id,
            medicalHistTypeId:1
        };
        setPersonalData(prevState => {
            const existingEntryIndex = prevState.findIndex(
                entry => entry.diseaseId === data.diseaseId
            );

            if (existingEntryIndex !== -1) {
                const newState = [...prevState];
                newState[existingEntryIndex].isSuffering = checked;
                newState[existingEntryIndex].medicalHistoryInfo = ''
                return newState;
            } else {
                data.isSuffering = checked;
                data.medicalHistoryInfo = ''
                return [...prevState, data];
            }
        });
        setMedicalHistoryObj($JsonHelper.medicalHistoryObj())
    }, [medicalHistoryObj]);



    const InputChange = (key, value, id) => {    
        let updatedDataItem = personalData.find(e => e.diseaseId === id);
    
        if (updatedDataItem) {
            updatedDataItem = { ...updatedDataItem, [key]: value };
        } else {
            updatedDataItem = { ...medicalHistoryObj, [key]: value, diseaseId: id };
        }
    
        const updatedPersonalData = personalData.map((dataItem) =>
            dataItem.diseaseId === id
                ? updatedDataItem
                : dataItem
        );
    
        setPersonalData(updatedPersonalData);
    };
    
    
    


    const submitData = async () => {
        const medHistoryList = personalData;
        const method = 'POST';
        const url = $Service_Url.upsertUserMedHistory;
    
        const jsonObj = {
          userId: userId,
          userMedHistories: medHistoryList,
          upsertedBy: loggedInUserId
        };
        
        if(jsonObj?.userMedHistories.length > 0){
            useLoader(true)
            const updateMedicalInfo = await postApiCall(method, url, jsonObj);
            useLoader(false)
            if (updateMedicalInfo !== "err") {
              konsole.log(updateMedicalInfo, "updateMedicalInfo");
            }
        }    
      };

    useImperativeHandle(ref,()=>({
        submitData
    }))  

    const medicalConditionList = useMemo(() => medicalConditions.map(ele => (
        <div className="col-6 d-flex justify-content-between my-3 fixedWidthOfMedical" key={ele.id}>
            <p>{ele.condition}</p>
            <CustomCheckBox
                tabIndex={startingTabIndex + 1}
                name={ele.condition}
                id={ele.id.toString()}
                value={personalData.some(e => e.diseaseId == ele.id && e.isSuffering)}
                onChange={(e) => handleInputChange(e.target.checked, ele)}
                hideLabel={true}
            />
        </div>
    )), [personalData, handleInputChange]);

    konsole.log(personalData, "personalData");

    return (<div>
        <div className="col-12 d-xl-flex justify-content-between ">
         <div className={`col-xl-12 col-12 mt-4 mt-xl-0 ${!isPrimaryMemberMaritalStatus ? "ps-4" :""}`}>
                <p className="fw-bold">Check if you have or had the following conditions:</p>
                {medicalConditionList}
            </div>
        </div>
        {/* {showPopup ?<div id="hideModalScrollFromPersonalMedicalHistory" className='modals hideModalScrollFromPersonalMedicalHistory'>
        <div className="modal" style={{ display: 'block', height:'95vh',overflowY:true}}>
        <div className="modal-dialog costumModal" style={{ maxWidth: '350px'}}>
          <div className="costumModal-content">
            <div className="modal-header mt-3 ms-1">
              <h5 className="modal-title">Comment</h5>
              <img className='mt-0 me-1'onClick={()=>setShowpopup(false)} src='/icons/closeIcon.svg'></img>
            </div>
            <div className="costumModal-body">
                <CustomTextarea tabIndex={startingTabIndex + 2} isPersonalMedical={true} label="" placeholder="(Optional)" value={medicalHistoryObj.medicalHistoryInfo} onChange={(e)=>InputChange('medicalHistoryInfo',e)} />    
           </div>
            <div className="modal-footer d-flex justify-content-between">   
                <CustomButton3 tabIndex={startingTabIndex + 3} label="Cancel" onClick={()=>setShowpopup(false)}/>
                <CustomButton  tabIndex={startingTabIndex + 4} label="Save" onClick={()=>setShowpopup(false)} />
            </div>
          </div>
        </div>
      </div>
       </div> : null} */}
   {medicalConditions?.map((healthIssue) => {
    const conditionData = personalData?.find(e => e?.diseaseId == healthIssue?.id);
    return conditionData?.isSuffering == true && (
        <div className="w-100 mb-2 pe-4" key={healthIssue?.id}>
        <p className="fs-14 mt-2 text-wrap fw-bold">Comment({healthIssue?.condition})</p>
        <CustomInput
            tabIndex={startingTabIndex + 2}
            notCapital={true}
            isPersonalMedical={true}
            label=""
            placeholder="(Optional)"
            value={conditionData?.medicalHistoryInfo || ''}
            onChange={(ele) => InputChange('medicalHistoryInfo',ele, healthIssue?.id)}
        />
        </div>
       )})}
        </div>
        
    );
});

export default PersonalMedicalCondition;
