import React, { useCallback, useEffect, useState } from "react";
import { CustomCheckBox, CustomInput, CustomTextarea } from "../../Custom/CustomComponent";
import konsole from "../../../components/control/Konsole";
import { $JsonHelper } from "../../Helper/$JsonHelper";
import { Modal } from "react-bootstrap";
import CustomModal from "../../Custom/CustomModal";
import { CustomButton, CustomButton2, CustomButton3 } from "../../Custom/CustomButton";
import { CustomRadioForMetadata } from "../../Custom/CustomComponent";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";

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
 
const FamilyMedicalHistory = ({ fatherData, motherData, siblingData, setFatherData, setMotherData, setSiblingData,isFamilyMedHistContent, updateStates, formLabelData,formResponse,handleSubjectInputChange,userId, startTabIndex }) => {
  const [alzPopover,setalzPopover] = useState(false);
  const [parkinson,setparkinson] = useState(false)
  const [inputRelationType, setinputRelationType] = useState('')
  const {spouseUserId,primaryUserId,isPrimaryMemberMaritalStatus} =usePrimaryUserId()
  const startingTabIndex = startTabIndex ?? 0;
 
   useEffect(()=>{
   updateStates(userId)
  },[alzPopover,parkinson])
 
  const [medicalHistoryObj,setMedicalHistoryObj] = useState($JsonHelper.medicalHistoryObj())
  
  const updateState = async(stateUpdater,data,relationshipIds) => {
    
    await updateStates(userId,relationshipIds)
    stateUpdater(prevState => {
      const existingEntryIndex = prevState?.findIndex(
        entry => entry.diseaseId === data.diseaseId && entry.relationshipId === data.relationshipId
      );
      if (existingEntryIndex !== -1) {
        const newState = [...prevState];
        newState[existingEntryIndex].isSuffering = !newState[existingEntryIndex].isSuffering;
        return newState;
      } else {
        data.isSuffering = true;
        return [...prevState, data];
      }
    });
  };
 
  const handleInputChange = useCallback((value, key, relationshipId) => {
    setinputRelationType(relationshipId)
    if(key.id == 1 && value.target.checked){
      setalzPopover(true)
      setparkinson(false)
      }else if(key.id == 2 && value.target.checked){
      setparkinson(true)

      setalzPopover(false)
    }

    const data = {
      ...medicalHistoryObj,
      disease: key.condition,
      diseaseId: key.id,
      relationshipId
    };

    if (relationshipId === 9) {
      updateState(setFatherData,data,relationshipId);
    } else if (relationshipId === 10) {
      updateState(setMotherData,data,relationshipId);
    } else if (relationshipId === 11) {
      updateState(setSiblingData,data,relationshipId);
    }
    setMedicalHistoryObj($JsonHelper.medicalHistoryObj())
  }, [updateState]);

  

  const InputChange = (key,value) =>{
    setMedicalHistoryObj((medicalHistoryObj)=>({...medicalHistoryObj,[key]:value}))
  }
 
  const updateCamment = useCallback(() => {
    if (inputRelationType == 9) {
      updateState(setFatherData, fatherData, 9)
    } else if (inputRelationType == 10) {
      updateState(setMotherData, motherData, 10);
    }
    else {
      updateState(setSiblingData, siblingData, 11)
    }
    closeModal()
  },[updateState])

  const closeModal = () =>{
    setalzPopover(false)
    setparkinson(false)
  }

  const renderCheckBox = useCallback((ele, relationshipId, data, setData) => (
    <CustomCheckBox
      tabIndex={startingTabIndex + 2}
      name={`${ele.condition}${relationshipId}`}
      id={`${ele.id}${relationshipId}`}
      value={data?.length > 0 && data?.some(e => e?.diseaseId === ele?.id && e?.isSuffering)}
      onChange={(e) => handleInputChange(e, ele, relationshipId)}
    />
  ), [handleInputChange]);


  return (
    <>
    <div className="family-medical-history mb-3 mt-2 d-ms-block d-md-block d-lg-block d-xl-flex"> 
    
      <div className="w-100">
      <div className="">
        {formLabelData.length > 0 && formLabelData.map(e => (
                <div className="col-12 spacingBottom" key={e.formLabelId}>
                    <CustomRadioForMetadata
                        tabIndex={startingTabIndex + 1}
                        placeholder={e.question.question}
                        options={e.question.response}
                        value={formResponse[`label${e.formLabelId}`]?.responseId}
                        onChange={ele => handleSubjectInputChange(ele,e.formLabelId,userId)}
                    />
                </div>
        ))}
      </div>
          {((formResponse?.label1041?.response == "No")) ?
            <div className={`col-12 px-xl-1 description-divWithoutWidth py-xl-0 py-4 ${isPrimaryMemberMaritalStatus ? "col-xl-12" : "col-xl-9"}`}>
              <div className="row">
                <p className="fw-bold" style={{fontSize:'14px'}}>Please list any conditions your parents or siblings might have.</p>
                <div className="heading">
                <div className={`col-6 ${isPrimaryMemberMaritalStatus && userId !== spouseUserId ? "me-5" : ""}`}>
               <p>Medical Condition</p>
                  </div>
                  <div className="d-flex justify-content-between col-5 checkbox-grp">
                    <p style={{ marginLeft: "-31px" }}>Father</p>
                    <p style={{ marginLeft: "0px" }}>Mother</p>
                    <p style={{ marginRight: "14px" }}>Sibling</p>
                  </div>
                </div>
              </div>

              <div className="medical-conditions col-12">
                {medicalConditions.map((ele) => (
                  <div key={ele.id} className="d-flex justify-content-between">
                   <div className="col-6">
                   <p className="w-100 d-flex gap-2">{ele.condition}</p>
                    </div>
                    <div className="d-flex justify-content-between col-5 checkbox-grp">
                      {renderCheckBox(ele, 9, fatherData, setFatherData)}
                      {renderCheckBox(ele, 10, motherData, setMotherData)}
                      {renderCheckBox(ele, 11, siblingData, setSiblingData)}
                    </div>
                  </div>
                ))}
              </div>




              {alzPopover == true || parkinson == true ? <div id="hideModalScrollFromPersonalMedicalHistory" className='modals'>
                <div className="modal hideModalScroll" style={{ display: 'block', height: '95vh', overflowY: true }}>
                  <div className="modal-dialog costumModal" style={{ maxWidth: '350px' }}>
                    <div className="costumModal-content">
                      <div className="modal-header mt-3 ms-1">
                        <h5 className="modal-title">{alzPopover == true ? 'Dementia/Alzheimer' : 'Parkinson'}</h5>
                        <img className='mt-0 me-1' onClick={() => closeModal()} src='/icons/closeIcon.svg'></img>
                      </div>
                      <div className="costumModal-body">
                        {alzPopover == true ? <div>
                          
                          <CustomTextarea tabIndex={startingTabIndex + 3} isPersonalMedical={true} label="How long did this person live with dementia?" placeholder="(Optional)" value={medicalHistoryObj.illnessDurationTime} onChange={(e) => InputChange('illnessDurationTime', e)} />
                          <CustomTextarea tabIndex={startingTabIndex + 4} isPersonalMedical={true} label="Was the dementia formally diagnosed?" placeholder="(Optional)" value={medicalHistoryObj.formallyDiagnosed} onChange={(e) => InputChange('formallyDiagnosed', e)} />
                          <CustomTextarea tabIndex={startingTabIndex + 5} isPersonalMedical={true} label="What signs did person show?" placeholder="(Optional)" value={medicalHistoryObj.symptomsSigns} onChange={(e) => InputChange('symptomsSigns', e)} />
                        </div> : <div className="mb-4">
                          <CustomTextarea tabIndex={startingTabIndex + 6} isPersonalMedical={true} label="How long did they live with illness?" placeholder="(Optional)" value={medicalHistoryObj.illnessDurationTime} onChange={(e) => InputChange('illnessDurationTime', e)} />
                          <CustomTextarea tabIndex={startingTabIndex + 7} isPersonalMedical={true} label="Did person have Parkinsons related dementia in their lives?" value={medicalHistoryObj?.remarks} placeholder="(Optional)" onChange={(e) => InputChange('remarks', e)} />
                        </div>}
                      </div>
                      <div className="modal-footer d-flex justify-content-between">
                        <CustomButton3 tabIndex={startingTabIndex + 8} label="Cancel" onClick={() => closeModal()} />
                        <CustomButton tabIndex={startingTabIndex + 9} label="Save" onClick={() => updateCamment()} />
                      </div>
                    </div>
                  </div>
                </div>
              </div> : null}
            </div> : <></>}
      </div>
    </div>
    </>
  );
};

export default FamilyMedicalHistory;