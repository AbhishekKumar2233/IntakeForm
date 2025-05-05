import { Col, Row } from "react-bootstrap";
import { CustomInput, CustomRadio } from "../../Custom/CustomComponent";
import { radioYesNoLabelWithBool } from "../../Helper/Constant";
import { useAppDispatch, useAppSelector } from "../../Hooks/useRedux";
import { useEffect, useState } from "react";
import konsole from "../../../components/control/Konsole";
import { setformMetaData } from "../../Redux/Reducers/professionalSlice";
import { $AHelper } from "../../Helper/$AHelper";

const ProfessionalQuestionaries = ( props ) => {
    const fetchedMetaData = useAppSelector(state => state.professional.formMetaData);
    const [metaData, setmetaData] = useState(fetchedMetaData);
    const isPrimaryProf = [10, 11].includes(parseInt(props.proTypeId)) ? true : false;
    const dispatch = useAppDispatch();
    const startingTabIndex = props?.startTabIndex ?? 0;

    konsole.log("jhgvhjgj", metaData, fetchedMetaData)

    useEffect(() => {
        setmetaData(fetchedMetaData)
    }, [fetchedMetaData])

    const handleChange = (value, key) => {
        konsole.log("dbvhds", key, value);
        if(key == 'visit_Duration' && (!$AHelper.$isNumberRegexWithDecimalUnder100(value))) return;

        setmetaData(oldState => {
            const newState = {
                ...oldState,
                [key]: value,
            }
            dispatch(setformMetaData(newState));
            return newState;
        })
        if(key == "is_GCM" && value == false) handleChange(undefined, 'is_GCM_Certified');
    }

    const isCostumModalOpen = typeof window !== 'undefined' && document.querySelector('.costumModal-body');
    const isCostumModalOpenNew = typeof window !== 'undefined' && document.querySelector('.costumModal-body');
    const isFamilyInfoVisible = typeof window !== 'undefined' && (
    document.querySelector('.setup-family-information') ||
    document.querySelector('.withDescription') ||
    document.querySelector('.finance-body')
    );

    // console.log("metaData",metaData)
    return isPrimaryProf ? (
        <Row className={`d-flex align-items-center ${isCostumModalOpen ? '' : 'gapNone'}`} >
            <Col  xs={12} md={isCostumModalOpenNew ? undefined : 6} lg={isCostumModalOpenNew ? undefined : (isFamilyInfoVisible ? 5 : 4)} >
            <div className="spacingBottom">
                <CustomInput
                    tabIndex={startingTabIndex + 1}
                    // isError={errorMsg.yearsUsed}
                    label="Years as your doctor"
                    placeholder="Enter number"
                    id='visit_Duration'
                    value={metaData?.visit_Duration}
                    onChange={(val) => handleChange(val, 'visit_Duration')} 
                />
            </div>
            <div className="spacingBottom" >
                <CustomRadio
                    tabIndex={startingTabIndex + 2}
                    placeholder='Are you happy with his/her care?'
                    name='happy_With_Service'
                    options={radioYesNoLabelWithBool}
                    value={metaData?.happy_With_Service}
                    classType='vertical'
                    onChange={(item) => handleChange(item?.value, 'happy_With_Service')}
                />
            </div>
                {props?.proTypeId == "10" && 
                <div className="spacingBottom">
                <CustomRadio
                    tabIndex={startingTabIndex + 3}
                    placeholder='Is this Physician a geriatrician?'
                    name='is_GCM'
                    options={radioYesNoLabelWithBool}
                    value={metaData?.is_GCM}
                    classType='vertical'
                    onChange={(item) => handleChange(item?.value, 'is_GCM')}
                />
                </div>}
                {props?.proTypeId == "10" && metaData?.is_GCM == true && 
                <div className="spacingBottom">
                <CustomRadio
                    tabIndex={startingTabIndex + 4}
                    placeholder='Are they board certified?'
                    name='is_GCM_Certified'
                    options={radioYesNoLabelWithBool}
                    value={metaData?.is_GCM_Certified}
                    classType='vertical'
                    onChange={(item) => handleChange(item?.value, 'is_GCM_Certified')}
                />
                </div>}
            </Col>
        </Row>
    ) : (
        <>
        </>
    )
}

export default ProfessionalQuestionaries;