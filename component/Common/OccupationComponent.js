import React, { useState, useEffect, useMemo, useCallback, useImperativeHandle, forwardRef, useContext } from 'react'
import { Row, Col } from 'react-bootstrap';
import { CustomRadio, CustomSelect, CustomInput, CustomTextarea } from '../Custom/CustomComponent';
import { $JsonHelper } from '../Helper/$JsonHelper';
import { useAppDispatch, useAppSelector } from '../Hooks/useRedux';
import { selectApi } from '../Redux/Store/selectors';
import { $AHelper } from '../Helper/$AHelper';
import { fetchOccupationData,deleteOccDetails,updateOccupationList} from '../Redux/Reducers/apiSlice';
import { useLoader } from '../utils/utils';
import konsole from '../../components/control/Konsole';
import { $Msg_StateBackground } from '../Helper/$MsgHelper';
import { saveOccuptionData } from '../Redux/Reducers/apiSlice';
import { headerNav } from '../Personal-Information/PersonalInformation';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import { globalContext } from '../../pages/_app';
import AddressOneLine from '../Custom/Contact/AddressOneLine';
import DeceasedModal from './DeceasedModal';
import { livingMemberStatusId, deceaseMemberStatusId, specialNeedMemberStatusId, isNotValidNullUndefile } from '../../components/Reusable/ReusableCom';

const radioValuesOcc = [{ label: "Yes", value: true }, { label: "No", value: false }];
const OccupationComponent = forwardRef((props, ref) => {
    const { userId, refrencePage, type, isChild, isGrandChild, isChildSpouse } = props;
    const { loggedInUserId, _spousePartner, displaySpouseContent,primaryUserId } = usePrimaryUserId()
    const { setWarning } = useContext(globalContext)
    const [selectMemberStatusId, setSelectMemberStatusId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useAppDispatch();
    const apiData = useAppSelector(selectApi);
    // const { occcupationSavedData } = apiData;
    let occcupationSavedDataFromStore = apiData.occcupationSavedData;
    const startingTabIndex = props?.startTabIndex ?? 0;

    const occcupationSavedData = useMemo(() => {
        return occcupationSavedDataFromStore[userId]
    }, [occcupationSavedDataFromStore, userId])


    // define state
    const [occcupationInfo, setOccupationInfo] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [isApiCall, setApiCall] = useState(false);
    // define useEffect
    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(userId)) {
            fetchSavedData();
        } else if (occcupationInfo == null) {
            setOccupationInfo($JsonHelper.createJsonAddOcccupation())
        }
    }, [userId]);

    // Define useEffect
    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(occcupationSavedData) && $AHelper.$isNotNullUndefine(userId)) {
            updateOccupationDetails();
        } else if (occcupationInfo == null) {
            setOccupationInfo($JsonHelper.createJsonAddOcccupation())
        }
    }, [occcupationSavedData]);

    useImperativeHandle(ref, () => ({
        isValidate, saveOccupationDetails, updateOccupationProfessionalBackgroung
    }));

    const updateOccupationProfessionalBackgroung = (val) => {
        let value = $AHelper.$isNotNullUndefine(val) ? val : occcupationInfo?.professionalBackground == 'Student' ? 'Student' : occcupationInfo?.professionalBackground

        if (occcupationInfo != null) {
            handleStateOcc('professionalBackground', value)
        }
    }

    const isValidate = () => {
        let isValidateOccupation = true;
        let isValidateprofesbackground = true;
        const { professionalBackgroundErr, occupationTypeErr } = $Msg_StateBackground
        if (occcupationInfo?.isWorking === true) {
            isValidateOccupation = $AHelper.$isValidateField(occcupationInfo?.occupationType, 'occupationType', occupationTypeErr, setErrMsg);
        }
        // if (occcupationInfo?.isWorking === false) {
        //     isValidateprofesbackground = $AHelper.$isValidateField(occcupationInfo?.professionalBackground, 'professionalBackground', professionalBackgroundErr, setErrMsg);
        // }
        // return isValidateOccupation && isValidateprofesbackground;
        return isValidateOccupation;
    }

    // get saved data
    const fetchSavedData = async () => {
        useLoader(true)
        const _resultOfOcupation = await dispatch(fetchOccupationData({ userId }));
        konsole.log("_resultOfOcupation", _resultOfOcupation)
        if (_resultOfOcupation?.payload == "err") {
            setOccupationInfo($JsonHelper.createJsonAddOcccupation())
        }
        useLoader(false)
    };




    const convertToISODate = (dateStr) => {
        const [month, day, year] = dateStr.split("/");
        return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
      };
      
      const isUserAtLeast18YearsOld = (dobInput) => {
        const dob = typeof dobInput === "string" && dobInput.includes("/") ? convertToISODate(dobInput) : new Date(dobInput); // already in Date or ISO format      
        const today = new Date();
        const minDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());      
        return dob <= minDOB;
    };
    const showOccupationQuestio = () => {
        const { relationshipTypeId } = props?.dataInfo?.memberRelationship || {};
        const dob = props?.dataInfo?.dob;
        if ([2, 3, 5, 6, 28, 29, 41].includes(Number(relationshipTypeId))) {
          return isUserAtLeast18YearsOld(dob);
        }
        return true;
      };
      
    

    const updateOccupationDetails = useCallback(() => {
        const { ageOfRetirement, isWorking, occupationType, professionalBackground, reasonOfDisable, userOccId, isDisabled, isRetirementOverseas, overseasRetirementPlace } = occcupationSavedData
      
        setOccupationInfo(prev => ({
            ...prev, ageOfRetirement, isWorking, occupationType, professionalBackground, reasonOfDisable, userOccId, isDisabled, overseasRetirementPlace, isRetirementOverseas
        }))
        konsole.log("occcupationSavedData", occcupationSavedData)
    }, [occcupationSavedData])

    // @@ set State
    const handleRadioOcc = useCallback((e, key) => {
        setSelectMemberStatusId(e?.value)
        if(key == "isDisabled" && e?.value == true && props?.detailsForMemberStatus?.name && props?.userId !== primaryUserId){
            const { memberStatusIdForTestRef, isFiduciaryForTest, isBeneficiaryForTest, genderId } = props?.detailsForMemberStatus
             if (memberStatusIdForTestRef == livingMemberStatusId  && (isBeneficiaryForTest == true || isFiduciaryForTest == true) && (props?.refrencePage !== 'AddFiduciaryBeneficiary')) {
                handleOpenModal(true)
            }
        }
        if(key == "isDisabled"){
            let data = {...occcupationSavedData}
            data['isDisabled'] = e?.value
            dispatch(updateOccupationList(data));
            props?.setPersonalDetails(prevProp =>({
                ...prevProp, ['isDisabled'] : e?.value ?? null
            }))
        }
        if(e==null){
                handleStateOcc(key,null);  
                return
        }
        handleStateOcc(key, e?.value);
    }, [props]);

    const handleInputChange = useCallback((val, key) => {
        let value = val;
        if (key == 'ageOfRetirement') {
            value = (val > 99) ? '' : Number(val)
        }
        konsole.log("valuevaluevalue", value)
        handleStateOcc(key, value);
    }, []);

    const handleStateOcc = useCallback((key, value) => {
        setErrMsg(prev => ({ ...prev, [key]: '' }));
        setOccupationInfo(prev => ({
            ...prev,
            [key]: value
        }));
        setApiCall(true)
    }, []);

    // console.log("occcupationInfo",occcupationInfo)
    const saveOccupationDetails = async (userId) => {
        return new Promise(async (resolve, reject) => {
            let jsonObj = occcupationInfo;
            jsonObj['userId'] = userId;
            jsonObj['UpdatedBy'] = loggedInUserId;
            jsonObj['createdBy'] = loggedInUserId;            
            jsonObj['overseasRetirementPlace'] = jsonObj?.isRetirementOverseas === true ? jsonObj?.overseasRetirementPlace : null;
            // konsole.log("jsonObjjsonObj", jsonObj,$AHelper.$isNotNullUndefine(jsonObj?.isWorking));
            if(jsonObj?.isWorking == null && jsonObj?.isDisabled !== false && jsonObj?.isDisabled !== true)
            {
                const deletOccJson={
                    userId,
                    userOccId: jsonObj.userOccId,
                    deletedBy: loggedInUserId
                }
                const _resultOfSaveData = await dispatch(deleteOccDetails(deletOccJson));
                konsole.log("_resultOfSaveData", _resultOfSaveData);
                resolve('resolve');
                return
            }
            jsonObj['isWorking'] = (jsonObj?.isWorking !== true && jsonObj?.isWorking !== false) ? null : jsonObj?.isWorking;

            if ((jsonObj?.isWorking == true || jsonObj?.isWorking == false || jsonObj?.isWorking == null) && isApiCall === true) {
                jsonObj.professionalBackground = jsonObj.isWorking !== false ? "" : jsonObj.professionalBackground
                // jsonObj.isDisabled = jsonObj.isWorking == true ? null : jsonObj.isDisabled
                jsonObj.reasonOfDisable = jsonObj.isDisabled !== true ? "" : jsonObj.reasonOfDisable
                jsonObj.occupationType = jsonObj.isWorking !== true ? "" : jsonObj.occupationType
                jsonObj.overseasRetirementPlace = jsonObj.isWorking !== true ? "" : jsonObj.overseasRetirementPlace
                jsonObj.isRetirementOverseas = jsonObj.isWorking !== true ? null : jsonObj.isRetirementOverseas
                jsonObj.ageOfRetirement = jsonObj.isWorking !== true  ? "" : jsonObj.ageOfRetirement
                konsole.log("jsonObj1212",jsonObj)
                const _resultOfSaveData = await dispatch(saveOccuptionData(jsonObj));
                konsole.log("_resultOfSaveData", _resultOfSaveData);
                resolve('resolve');
            } else {
                resolve('resolve');
            }
        })
    }

    const disabledValue = useMemo(() => {
        let msg = "Are you disabled / with special needs?";

        if (refrencePage === 'PersonalInformation' && props?.type === headerNav[1].value) {
            msg = `Is this ${_spousePartner} disabled / with special needs?`;
        } else if ((refrencePage === 'EditChildWithAccordian' || refrencePage === 'AddChildWithProgressBar') && isChild) {
            msg = `Is this ${isGrandChild == true ? "grand-child" : isChildSpouse == true ? 'in-law' : "child"} disabled/with special needs?`;
        } else if ((refrencePage === 'EditChildWithAccordian' || refrencePage === 'AddChildWithProgressBar') && !isChild) {
            msg = 'Is this extended family/friend disabled/with special needs?';
        }
        return msg;
    }, [refrencePage, props?.type, headerNav, isChild, isGrandChild, isChildSpouse]);

    const handleBlur = (e) => {
        konsole.log("handleBlur", e)
        let value = e.target.value;
        konsole.log("valuevalueaa", value)
        if (value && value < 18) {
            handleStateOcc('ageOfRetirement', '');
            toasterAlert('warning', 'Warning', 'Retirement age can not be below 18')
        }
    }
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);

    }
    const returnIsEmpMsg = () => {
        let msg = 'Are you employed?';
        if (refrencePage === 'PersonalInformation' && type !== 'Personal') {
            msg = `Is this ${_spousePartner} still employed?`;
        } else if (refrencePage !== 'PersonalInformation' && isChild) {
            msg = `Is this ${isGrandChild == true ? "grand-child" : isChildSpouse == true ? 'in-law' : "child"} still employed?`;
        } else if (refrencePage !== 'PersonalInformation' && !isChild) {
            msg = 'Is this extended family/friend still employed?';
        }
        return msg;
    };
    const returnRetireOverseasAddress = () => {
        let msg = "In which place are you planning to retire?";
        if (refrencePage === 'PersonalInformation' && type !== 'Personal') {
            msg = `Where is your ${_spousePartner} planning to retire?`;
        }
        return msg;
    };
    const returnRetireOverseas = () => {
        let msg = 'Are you planning to retire overseas?';
        if (refrencePage === 'PersonalInformation' && type !== 'Personal') {
            msg = ` Is your ${_spousePartner} planning to retire overseas?`;
        }
        return msg;
    };

    const isPersonalScreen = refrencePage == 'PersonalInformation';

    // console.log("qqqqqqqqqqocccupationInfo", occcupationInfo);
    konsole.log("disabledValuedisabledValuedisabledValue", refrencePage);
    konsole.log("occcupationInfoisWorking", occcupationInfo, radioValuesOcc);
    const handleOpenModal = (val) => {
        setIsModalOpen(val)
    }
    const handleModalOpenChange = () => {
        handleOpenModal(false)
    }
   

    return (

        <>
            
            <Row className='mt-2'>
                <Col xs={12} md={8} className='ps-0'>
                    <CustomRadio
                        tabIndex={startingTabIndex + 1}
                        name='isDisabled'
                        options={radioValuesOcc}
                        placeholder={disabledValue}
                        onChange={(e) => handleRadioOcc(e, 'isDisabled')}
                        value={$AHelper.$isNotNullUndefine(occcupationInfo?.isDisabled) ? occcupationInfo?.isDisabled : null}
                    />
                </Col>
            </Row>
            {(occcupationInfo?.isDisabled == true) &&
                <Row>
                    <Col xs={12} md={6} lg={isPersonalScreen && !displaySpouseContent ? 5 : (refrencePage === 'PersonalInformation' ? 9 : 5)} className="mt-2 ps-0">
                        <CustomTextarea
                            tabIndex={startingTabIndex + 2}
                            isError=''
                            name="reasonOfDisable"
                            placeholder="Describe..."
                            id='reasonOfDisable'
                            type='textarea'
                            rows={4}
                            onChange={(val) => handleInputChange(val, 'reasonOfDisable')}
                            value={occcupationInfo?.reasonOfDisable}
                        />
                    </Col>
                </Row>
            } 

            {/* This for Ocuoation */}
            {showOccupationQuestio() == true && <Row className='mb-2 '>
                <CustomRadio
                    tabIndex={startingTabIndex + 3}
                    name='isWorking'
                    options={radioValuesOcc}
                    placeholder={returnIsEmpMsg()}
                    onChange={(e) => handleRadioOcc(e, 'isWorking')}
                    value={$AHelper.$isNotNullUndefine(occcupationInfo?.isWorking) ? occcupationInfo?.isWorking : null}

                />
            </Row>
}
            {occcupationInfo?.isWorking === true && showOccupationQuestio() == true ? <>
                <div className='vetern-Info mt-3'>
                    <Row>
                        <Col xs={12} md={(isPersonalScreen && displaySpouseContent) ? '' : 8} lg={(!displaySpouseContent && isPersonalScreen) ? 5 : (refrencePage === 'AddChildWithProgressBar' || refrencePage === 'EditChildWithAccordian' ? 5 : (refrencePage === 'PersonalInformation' ? 9 : 6))}>
                            <CustomInput
                                tabIndex={startingTabIndex + 4}
                                isError={errMsg?.occupationType}
                                name="Occupation"
                                label="Occupation*"
                                notCapital={true}
                                placeholder="Enter occupation"
                                id='occupationType'
                                key={'occupationType'}
                                onChange={(val) => handleInputChange(val, 'occupationType')}
                                value={occcupationInfo?.occupationType}
                            />

                        </Col>
                    </Row>
                    {(refrencePage == 'PersonalInformation') &&
                        <Row className='mt-2'>
                            <Col xs={12} md={(isPersonalScreen && displaySpouseContent) ? '' : 8} lg={(!displaySpouseContent && isPersonalScreen) ? 5 : (refrencePage === 'AddChildWithProgressBar' || refrencePage === 'EditChildWithAccordian' ? 5 : (refrencePage === 'PersonalInformation' ? 9 : 6))}>
                                <CustomInput
                                    tabIndex={startingTabIndex + 5}
                                    isError=''
                                    name="ageOfRetirement"
                                    label="At what age do you anticipate to retire?"
                                    placeholder="Enter age"
                                    onBlur={(e) => handleBlur(e)}
                                    id='ageOfRetirement'
                                    onChange={(val) => handleInputChange($AHelper.$isNumberRegex(val) ? val : '', 'ageOfRetirement')}
                                    value={occcupationInfo?.ageOfRetirement}
                                />
                            </Col>
                        </Row>
                    }
                    <Row className=''>
                        <Col>
                            {refrencePage === 'PersonalInformation' && <>
                                {occcupationInfo?.isWorking === true && <>
                                    <Row className='mb-2 ms-1 '>
                                        <CustomRadio
                                            tabIndex={startingTabIndex + 6}
                                            name='isRetirementOverseas'
                                            options={radioValuesOcc}
                                            placeholder={returnRetireOverseas()}
                                            onChange={(e) => handleRadioOcc(e, 'isRetirementOverseas')}
                                            value={$AHelper.$isNotNullUndefine(occcupationInfo?.isRetirementOverseas) ? occcupationInfo?.isRetirementOverseas : null}
                                        />
                                    </Row>
                                </>}
                                {occcupationInfo?.isRetirementOverseas === true && <>
                                    <Row>
                                        <Col>
                                            <AddressOneLine
                                                startTabIndex={startingTabIndex + 7}
                                                isError=''
                                                label={returnRetireOverseasAddress()}
                                                placeholder="Enter the retirement place"
                                                onChange={(e) => handleInputChange(e, 'overseasRetirementPlace')}
                                                value={$AHelper.$isNotNullUndefine(occcupationInfo?.overseasRetirementPlace) ? occcupationInfo?.overseasRetirementPlace : ""}
                                            />
                                        </Col>
                                    </Row>
                                </>}
                            </>
                            }
                        </Col>
                    </Row>
                </div>
            </> : (occcupationInfo?.isWorking === false) ? <>
                <div className='vetern-Info mt-3'>
                    <Row>
                        <Col xs={12} md={(isPersonalScreen && displaySpouseContent) ? '' : 8} lg={(!displaySpouseContent && isPersonalScreen) ? 5 : (refrencePage === 'AddChildWithProgressBar' || refrencePage === 'EditChildWithAccordian' ? 5 : (refrencePage === 'PersonalInformation' ? 9 : 6))} className="">
                            <CustomInput
                                tabIndex={startingTabIndex + 8}
                                isError={errMsg?.professionalBackground}
                                name="professionalBackground"
                                label="Professional background"
                                placeholder="Enter background"
                                notCapital={true}
                                id='professionalBackground'
                                key={'professionalBackground'}
                                onChange={(val) => handleInputChange(val, 'professionalBackground')}
                                value={occcupationInfo?.professionalBackground}
                            />

                        </Col>
                    </Row>
                </div>
            </> : ''}
                
            
            
                {isModalOpen &&
                <>
                    <DeceasedModal                      
                        isModalOpen={isModalOpen}
                        deceaseMemberStatusId={deceaseMemberStatusId}
                        handleOpenModal={handleOpenModal}
                        handleModalOpenChange={handleModalOpenChange}
                        childName={props?.detailsForMemberStatus?.name}
                        selectMemberStatusId={1}
                        refrencePage={props?.refrencePage}
                        memberStatusIdforTestRef={props?.detailsForMemberStatus?.memberStatusIdForTestRef}
                        loggedInUserId={loggedInUserId}
                        dataInfo={props?.dataInfo}
                        livingMemberStatusId={livingMemberStatusId}

                    />

                </>
            }
                

            {/* This for Ocuoation */}




        </>
    )
})

export default OccupationComponent
