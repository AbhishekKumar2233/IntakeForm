import React, { useContext, useRef, useState } from "react";
import { CustomInput, CustomSearchSelect, CustomSelect, CustomTextarea } from "../../Custom/CustomComponent";
import { CustomButton, CustomButton2, CustomButton3 } from "../../Custom/CustomButton";
import { focusInputBox, postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import Other from "../../../components/asssets/Other";
import { globalContext } from "../../../pages/_app";
import { $JsonHelper } from "../../Helper/$JsonHelper";
import { cleanMedicationNsuplement,healthMedicationPageType, useLoader } from "../../utils/utils";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";
import { $AHelper } from "../../Helper/$AHelper";
import konsole from "../../../components/control/Konsole";

const AddEditMedication = ({setIsAddedit,setHideAllAccrodian,setHideCustomeSubSideBarState,medicationList,editUser,setEdituser,userId, activeBtn, setActiveBtn, handleActiveTabMain, setShowTable}) =>{
    const [isError,setError] = useState()
    const { setWarning } = useContext(globalContext)
    const { spouseFullName, isPrimaryMemberMaritalStatus, spouseFirstName, primaryUserId, spouseUserId } = usePrimaryUserId();
    const medicationRef = useRef(null);
    const medicationAndSupplementsContent = `Please provide details of any medications and supplements ${activeBtn == 2 ? "your spouse" : "you"} are currently taking or have taken in the past. Include the medication name, dosage, frequency, and purpose. This information is essential for understanding your ${activeBtn == 2 ? "spouse's" : ""} overall health.`

    const prevFunction =()=>{
        setShowTable('')
        setIsAddedit(false)
        setHideAllAccrodian(false)
        setHideCustomeSubSideBarState(false)
    }

    const handleChange = (value,key) => {
        konsole.log(value,key,"value,key",editUser)
        setEdituser((prev)=>({...prev,[key]: key == 'medicationId' ? value.value : value}))
        setError(false);
    }

    const handleSubmit = async (type) => {
        let jsonObj = {
            'userId':userId,
            'userMedications':[editUser],
            'UpsertedBy':userId
        }
        if(editUser.medicationId == null){
            setError(true);
            focusInputBox('medicationId');
            return;
        }
        useLoader(true)
        const responseMedication = await postApiCall('POST',$Service_Url.UpsertUserMedication,jsonObj)
        useLoader(false)
        if(responseMedication != 'err'){
            cleanMedicationNsuplement(healthMedicationPageType);
            if(editUser.medicationId == '999999'){
           
                medicationRef.current.saveHandleOther(responseMedication?.data?.data?.userMedications[0]?.userMedicationId);
            }
            toasterAlert('successfully',`Successfully ${editUser.userMedicationId == 0 ? 'saved' : 'updated'} data`,`Your data have been ${editUser.userMedicationId == 0 ? 'saved' : 'updated' } successfully`)
            if(type == 'another'){
                setEdituser({...$JsonHelper.newFormDataObj()})
            }else if(type == 'Continue'){
                prevFunction()
            }else{
                if(isPrimaryMemberMaritalStatus){
                handleActiveTabMain(6)
                } else 
                handleActiveTabMain(6)
                prevFunction()
            }
            $AHelper.$scroll2Top()
        }
    }

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
      }
      
      return(
        <div>
            <div className="previous-btn">
                <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer me-2" onClick={()=>{prevFunction()}} />
                <span className="ms-1 cursor-pointer" onClick={()=>{prevFunction()}}>Previous</span>
                </div>
                <h4 className="my-4 fw-bold">{editUser.userMedicationId == 0 ? 'Add' : 'Edit'} Medication & Supplements</h4>
                <div className="row p-0 m-0">
                    <div className="col-xl-3 col-12 mt-2 p-0 heading-of-sub-side-links-2">
                        {medicationAndSupplementsContent}
                    </div>
                    <div className="col-xl-9 col-12 medication-form mt-2">
                        <div id="medicationId" className="col-xs-12 col-md-6 col-lg-4 spacingBottom">
                            <CustomSearchSelect tabIndex={1} label="Medication type*" placeholder="Select" options={[...medicationList].sort((a, b) => {
                                if(a.value == '999999') return -1;
                                if(b.value == '999999') return 1;
                                return a.label.localeCompare(b.label)
                            })} value={editUser.medicationId} onChange={(e)=>handleChange(e,'medicationId')} isError={isError ? 'Medication type is required.' : null} />
                        </div>
                        {editUser.medicationId == '999999' &&
                        <div className="col-xs-12 col-md-6 col-lg-4 spacingBottom">
                        <Other othersCategoryId={38} tabIndex={2} userId={userId} dropValue={editUser.medicationId} natureId={editUser.userMedicationId} ref={medicationRef} />
                        </div>}
                        <div className="col-xs-12 col-md-6 col-lg-4 spacingBottom">
                            <CustomInput tabIndex={3}  notCapital={true}  label="Dosage" placeholder="e.g 500mg / 500ml" value={editUser.doseAmount} onChange={(e)=>handleChange(e,'doseAmount')} />
                        </div>
                        <div className="col-xs-12 col-md-6 col-lg-4 spacingBottom">
                            <CustomInput tabIndex={4} label="How often do you take this?" placeholder="e.g twice daily" value={editUser.frequency} notCapital={true} onChange={(e)=>handleChange(e,'frequency')}  />
                        </div>  
                        <div className="col-xs-12 col-md-6 col-lg-4 spacingBottom">
                            <CustomInput tabIndex={5} label="Timing" placeholder="e.g morning / evening / daily" value={editUser.time}  notCapital={true} onChange={(e)=>handleChange(e,'time')} />
                        </div>
                        <div className="col-xs-12 col-md-6 col-lg-4 spacingBottom mb-4">
                            <CustomTextarea tabIndex={6} label="Note" notCapital={true} placeholder="Additional notes or instructions from the prescribing doctor" value={editUser?.doctorPrescription} onChange={(e)=>handleChange(e,'doctorPrescription')} />
                        </div>
                    </div>
                    <div className="d-flex col-12 justify-content-between align-items-center mt-5">
                        <CustomButton2 tabIndex={7} label={`${editUser.userMedicationId == 0 ? 'Save' : 'Update' } & Continue later`} onClick={()=>{handleSubmit('Continue')}}/>                  
                        <div className="d-flex justify-content-end">
                            <CustomButton3 tabIndex={8} label={`${editUser.userMedicationId == 0 ? 'Save' : 'Update' } & Add Another`} onClick={()=>{handleSubmit('another')}} />
                            <CustomButton tabIndex={9} label={`${editUser.userMedicationId == 0 ? 'Save' : 'Update'} & Proceed to Housing`} onClick={()=>{handleSubmit('next')}} />
                        </div>
                    </div>
                </div>
        </div>
    )

}
export default AddEditMedication;