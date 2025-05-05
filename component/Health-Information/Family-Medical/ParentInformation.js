import React, { useState, useEffect, useImperativeHandle, forwardRef, useCallback, useContext } from "react";
import { CustomInput, CustomNumInput, CustomRadio } from "../../Custom/CustomComponent";
import konsole from "../../../components/control/Konsole";
import { radioYesNoLabelWithBool } from "../../Helper/Constant";
import { $JsonHelper } from "../../Helper/$JsonHelper";
import { globalContext } from "../../../pages/_app";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";

const ParentInformation = forwardRef(({ fatherData, motherData, setFatherData, setMotherData,isFamilyMedHistParentContent, startTabIndex }, ref) => {
    const {setWarning} = useContext(globalContext)
    const [fatherLiving, setFatherLiving] = useState(null);
    const [motherLiving, setMotherLiving] = useState(null);
    const [fatherDetail, setFatherDetail] = useState({...$JsonHelper.medicalHistoryObj()});
    const [motherDetail, setMotherDetail] = useState({...$JsonHelper.medicalHistoryObj()});
    const {isPrimaryMemberMaritalStatus} =  usePrimaryUserId()

    const startingTabIndex = startTabIndex ?? 0;
    let currentTabIndex = startingTabIndex;

    const generateTabIndex = () => {
      return currentTabIndex++;
    };

    const fatherDetails = useCallback((fatherData) => {
        let data = fatherData?.filter(e => !e?.disease && !e?.diseaseId && e?.isSuffering == false)[0];
        // console.log("datadata",data)
        data != undefined ? setFatherDetail(data) : setFatherDetail({...$JsonHelper.medicalHistoryObj()});
        setFatherLiving(data?.isCurrentlyLiving);
    }, [fatherData]);

    const motherDetails = useCallback((motherData) => {
        let data = motherData?.filter(e => !e?.disease && !e?.diseaseId && e?.isSuffering == false)[0];
        data != undefined ? setMotherDetail(data) : setMotherDetail({...$JsonHelper.medicalHistoryObj()})
        setMotherLiving(data?.isCurrentlyLiving);
    }, [motherData]);


    useEffect(() => {
        fatherDetails(fatherData);
        motherDetails(motherData);
    }, [fatherData, motherData]);

    const handleLivingStatusChange = (event, parent) => {
        // console.log("dsssssssssss",event, parent)
        const eventValue=event?.value
        if (parent === "Father") {
            setFatherLiving(eventValue);
            setFatherDetail((prevDetail) => ({
                ...prevDetail,
                isCurrentlyLiving: eventValue,
                age: eventValue ? prevDetail.age : undefined,
                causeOfDeath: eventValue ? undefined : prevDetail.causeOfDeath,
                relationshipId:prevDetail.relationshipId = 9

            }));
        } else if (parent === "Mother") {
            setMotherLiving(eventValue);
            setMotherDetail((prevDetail) => ({
                ...prevDetail,
                isCurrentlyLiving: eventValue,
                age: eventValue ? prevDetail.age : undefined,
                causeOfDeath: eventValue ? undefined : prevDetail.causeOfDeath,
                relationshipId:prevDetail.relationshipId = 10

            }));
        }
    };

    const handleChange = (value, key) => {
        if(key == 'FatherCurrentage' || key == 'FatherAgeatdeath' || key == 'MotherCurrentage' || key == 'MotherAgeatdeath'){
            
            if(value > 130){
                setWarning('warning','Warning','You can not enter age greater than 130 years.')
                return;
            }
        }
        if (key.startsWith("Father")) {
            setFatherDetail((prevDetail) => {
                let updatedDetail = { ...prevDetail };
                if (key === "FatherCurrentage") {
                    updatedDetail.age = value;
                    updatedDetail.isCurrentlyLiving = true;
                } else if (key === "FatherAgeatdeath") {
                    updatedDetail.age = value;
                    updatedDetail.isCurrentlyLiving = false;
                } else if (key === "FatherCauseOfDeath") {
                    updatedDetail.causeOfDeath = value;
                }
                updatedDetail.relationshipId = 9;
                return updatedDetail;
            });
        } else if (key.startsWith("Mother")) {
            setMotherDetail((prevDetail) => {
                let updatedDetail = { ...prevDetail };
                if (key === "MotherCurrentage") {
                    updatedDetail.age = value;
                    updatedDetail.isCurrentlyLiving = true;
                } else if (key === "MotherAgeatdeath") {
                    updatedDetail.age = value;
                    updatedDetail.isCurrentlyLiving = false;
                } else if (key === "MotherCauseOfDeath") {
                    updatedDetail.causeOfDeath = value;
                }
                updatedDetail.relationshipId = 10;
                return updatedDetail;
            });
        }
    };
    
    const handleBlur = (value, key) => {
            
            const warningMessages = {
                'FatherCurrentage': "Father's current age can't be less than 18",
                'MotherCurrentage': "Mother's current age can't be less than 18",
                'FatherAgeatdeath': "Father's age of death can't be less than 18",
                'MotherAgeatdeath': "Mother's age of death can't be less than 18"
            };
            
            if (value && value < 18 && warningMessages[key]) {
                setWarning('warning', 'Warning', warningMessages[key]);
                handleChange("", key);
            }
    };

    useImperativeHandle(ref, () => ({
        submitData: () => {
            // setFatherData((prevData) => {
                const updatedData = fatherData?.filter(e => e?.disease || e?.diseaseId || e?.isSuffering);
                const newFatherData = updatedData?.length >= 1 ? [...updatedData, fatherDetail] : [fatherDetail];
                // return newFatherData;
            // });
            // setMotherData((prevData) => {
                const updatedMotherData = motherData?.filter(e => e?.disease || e?.diseaseId || e?.isSuffering);
                const newMotherData = updatedMotherData?.length >= 1 ? [...updatedMotherData, motherDetail] : [motherDetail];
                return {fatherData:newFatherData,motherData:newMotherData};
            // });
        }
    }));

    konsole.log(fatherData, "kfjkldfjhgkfld");

    const renderAgeInput = (isLiving, parent, value, causeOfDeath) => (
        isLiving ? (
            <CustomNumInput
                tabIndex={generateTabIndex()}
                id={`${parent.toLowerCase()}CurrentAge`}
                label={`${parent}’s current age`}
                name={`${parent.toLowerCase()}CurrentAge`}
                placeholder="Enter age"
                value={value}
                onChange={(value) => handleChange(value, `${parent}Currentage`)}
                onBlur={(value) => handleBlur(value, `${parent}Currentage`)}
                
            />
        ) : (
            <>
                <CustomNumInput
                    tabIndex={generateTabIndex()}
                    id={`${parent.toLowerCase()}AgeAtDeath`}
                    label={`${parent}’s age at death`}
                    name={`${parent.toLowerCase()}AgeAtDeath`}
                    placeholder="Enter age"
                    value={value}
                    onChange={(value) => handleChange(value, `${parent}Ageatdeath`)}
                    onBlur={(value) => handleBlur(value, `${parent}Ageatdeath`)}
                />
                <CustomInput
                    tabIndex={generateTabIndex()}
                    notCapital={true}
                    label={`${parent}’s cause of death`}
                    placeholder="Describe..."
                    value={causeOfDeath}
                    onChange={(value) => handleChange(value, `${parent}CauseOfDeath`)}
                    isSmall={false}
                />
            </>
        )
    );

    konsole.log("fatherLiving",fatherLiving,"motherLiving",motherLiving)
    return (
        <div className={`parent-information-container d-lg-block d-xl-flex row  ${!isPrimaryMemberMaritalStatus ? "d-flex" : "ms-1"}`}>
            {/* <div className="col-lg-12 col-xl-3 mb-3 mt-2 me-4">
                <p className="heading-of-sub-side-links-3">{isFamilyMedHistParentContent}</p>
            </div> */}
            <div className={`familyMedicalHistoryRadioLinment col-lg-12 col-xl-8 p-0 m-xl-0 m-3  ${!isPrimaryMemberMaritalStatus ? "d-flex" : "d-block"}`} style={{gap:'5rem'}}>
                <div className="radio-div pb-3" >
                    <CustomRadio
                        tabIndex={generateTabIndex()}
                        classType="vertical"
                        placeholder="Is your father currently living?"
                        value={fatherLiving}
                        options={radioYesNoLabelWithBool}
                        onChange={(e) => handleLivingStatusChange(e, "Father")}
                    />
                    <CustomRadio
                        tabIndex={generateTabIndex()}
                        classType="vertical"
                        placeholder="Is your mother currently living?"
                        value={motherLiving}
                        options={radioYesNoLabelWithBool}
                        onChange={(e) => handleLivingStatusChange(e, "Mother")}
                    />
                </div>
                <div className="select-div alignAgeInputDiv alignAgeInputDiv col-xs-12 col-md-6 col-lg-5 m-0 m-0" style={{marginLeft:"0px", marginRIght:"11px"}}>
                    {/* {console.log(fatherDetail,"fatherDetail?.age")} */}
                    {fatherLiving!=null && renderAgeInput(fatherLiving, "Father", fatherDetail?.age, fatherDetail?.causeOfDeath)}
                    {motherLiving!=null && renderAgeInput(motherLiving, "Mother", motherDetail?.age, motherDetail?.causeOfDeath)}
                </div>
            </div>
           
        </div>
    );
});

export default React.memo(ParentInformation);