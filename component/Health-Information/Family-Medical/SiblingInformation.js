import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { CustomNumInput, CustomRadio } from "../../Custom/CustomComponent";
import { radioYesNoLabelWithBool } from "../../Helper/Constant";
import { $JsonHelper } from "../../Helper/$JsonHelper";
import { $AHelper } from "../../Helper/$AHelper";

const SiblingInformation = forwardRef(({ siblingDataList, setSiblingDataList,isFamilyMedHistSiblingContent, startTabIndex }, ref) => {
    const [siblingData, setSiblingData] = useState({
        hasSiblings: true,
        noOfLivingSibling: '',
        noOfDeceasedSibling: ''
    });
    const [deceasedSibling, setDeceasedSibling] = useState('');
    const startingTabIndex = startTabIndex ?? 0;

    useEffect(() => {
        const filterDetails = siblingDataList?.find(e => (!$AHelper?.$isNotNullUndefine(e.disease)) && (!$AHelper?.$isNotNullUndefine(e.diseaseId)) && (e.isSuffering === false) && ($AHelper?.$isNotNullUndefine(e.noOfLivingSibling))) || {...$JsonHelper?.medicalHistoryObj()};
        const filterDetailsDecease = siblingDataList?.find(e => !e.disease && !e.diseaseId && e.isSuffering === false && e.noOfDeceasedSibling != null) || {...$JsonHelper?.medicalHistoryObj()};
        setSiblingData(filterDetails);
        setDeceasedSibling(filterDetailsDecease);
        // console.log(filterDetails,"filterDetails",filterDetailsDecease)
    }, [siblingDataList]);

    const handleChange = (value, name) => {
        if(name == 'noOfDeceasedSibling'){
            setDeceasedSibling(prevState => ({ ...prevState, [name]: value, ['relationshipId']: 11}));
        }else{ 
           setSiblingData(prevState => ({ ...prevState, [name]: value, ['relationshipId']: 11}));
        }
        
    };

    useImperativeHandle(ref, () => ({
        submitData: () => {
            const prevData = siblingDataList?.filter(e=> e.disease || e.diseaseId || e.isSuffering)
                return prevData?.length >= 1 ? [...prevData,siblingData,deceasedSibling] : [siblingData,deceasedSibling]}
    }));
    
    return (
        <div className={`sibling-container d-lg-block d-xl-flex p-0 m-xl-0 m-3`}>
           
            {siblingData?.hasSiblings !== null && (
                <div className="col-lg-12 col-xl-8 col-lg-5 alignAgeInputDiv20 m-0">
                <div className="spacingBottom" >
                    <CustomNumInput 
                       tabIndex={startingTabIndex + 1}
                        placeholder="Enter number" 
                        label="Number of living siblings" 
                        value={siblingData?.noOfLivingSibling ?? ""} 
                        onChange={(e) => handleChange(e, "noOfLivingSibling")} 
                        maxLength="2"
                    />
                    </div>
                    <div  className="spacingBottom">
                    <CustomNumInput 
                       tabIndex={startingTabIndex + 2}
                        placeholder="Enter number" 
                        label="Number of deceased siblings" 
                        value={deceasedSibling?.noOfDeceasedSibling ?? ""}
                        onChange={(e) => handleChange(e, "noOfDeceasedSibling")} 
                        maxLength="2"
                    />
                </div>
                </div>
            )}
        </div>
    );
});

export default React.memo(SiblingInformation);
