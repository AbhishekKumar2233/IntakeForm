import React, { useEffect, useState, useCallback, useRef, useMemo, useContext } from 'react'
import { Row, Col } from 'react-bootstrap';
// import { isContent } from '../../Personal-Information/PersonalInformation';
import { CustomCurrencyInput, CustomInput, CustomNumInput, CustomRadio, CustomSearchSelect, CustomSelect, CustomCheckBoxForCopyToSpouseData } from '../../Custom/CustomComponent';
import { radioYesNoLabelWithBool } from '../../Helper/Constant';
import CustomCalendar from '../../Custom/CustomCalendar';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import konsole from '../../../components/control/Konsole';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { selectorHealth } from '../../Redux/Store/selectors';
import { fetchPreFrequency, fetchTypeOfInsCompany, fetchTypeOfPlan, fetchTypeOfSuppPlan } from '../../Redux/Reducers/healthISlice';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { CustomButton, CustomButton2, CustomButton3 } from '../../Custom/CustomButton';
import { $AHelper } from '../../Helper/$AHelper';
import { postApiCall } from '../../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../../components/network/UrlPath';
import { $postServiceFn } from '../../../components/network/Service';
import { useLoader } from '../../utils/utils';
import Other from '../../../components/asssets/Other';
import { globalContext } from '../../../pages/_app';
import ExpensesQuestion from '../../Common/ExpensesQuestion';
import UploadAssetsFile from '../../Common/File/UploadAssetsFile';



const HealthInsuranceAddUpdate = (props) => {
    const { handleActiveTableAddType, activeTab, handleActiveTabButton, type, fetchPrimaryInsurance, fetchSpouseInsurance, handlePreviousBtn, editInfo, isHealthInsContent } = props;
    const { setConfirmation, confirm, setWarning } = useContext(globalContext)
    const { labelValueSpousePrimary, primaryUserId, loggedInUserId, spouseUserId, isPrimaryMemberMaritalStatus, spouseFullName, _spousePartner, spouseFirstName } = usePrimaryUserId();

    const dispatch = useAppDispatch();
    const healthData = useAppSelector(selectorHealth);
    const { typeOfPlanList, typeOfSubPlanList, typeOfInsCompanyList, prePreFrequencyList } = healthData;

    // @@ define Ref
    const typePlanRef = useRef(null);
    const suppInsRef = useRef(null);
    const insCompanyRef = useRef(null);
    const uploadAssetsFileRef = useRef(null);

    // @@define state
    const [insDetails, setInsDetails] = useState({ ...$JsonHelper.createHealthInsuranceJson(), 'createdBy': loggedInUserId });
    const [policyHolder, setPolicyHolder] = useState('');
    const [isSameAsSpouse, setIsSameAsSppuse] = useState('');
    const [isApiCall, setIsApiCall] = useState(false)


    useEffect(() => {
        fetchApi();
    }, [dispatch])

    // @@ value set of policy holder
    useEffect(() => {
        if (!$AHelper.$isNotNullUndefine(policyHolder)) {
            let userId = activeTab == 2 ? spouseUserId : primaryUserId;
            setPolicyHolder(userId)
        }
    }, [type, activeTab])


    // @@ data update for edit 
    useEffect(() => {
        if (type == 'EDIT' && $AHelper.$isNotNullUndefine(editInfo)) {
            updateInsDetails(editInfo)
        } else {
            setInsDetails({ ...$JsonHelper.createHealthInsuranceJson(), 'createdBy': loggedInUserId })
        }
    }, [type, activeTab, editInfo, loggedInUserId])



    // @@ state update with edit details
    const updateInsDetails = (details) => {
        konsole.log("editInfoeditInfoeditInfo", details);

        setInsDetails(prev => ({
            ...prev, ...details, 'updatedBy': loggedInUserId
        }))
        if (activeTab == 1) {
            setIsSameAsSppuse(details?.userInsuranceMaps?.length == 2)
        }

    }

    // @@ master api call;
    const fetchApi = async () => {
        apiCallIfNeed(typeOfPlanList, fetchTypeOfPlan())
        apiCallIfNeed(typeOfSubPlanList, fetchTypeOfSuppPlan())
        apiCallIfNeed(prePreFrequencyList, fetchPreFrequency());
        apiCallIfNeed(typeOfInsCompanyList, fetchTypeOfInsCompany())
    }
    const apiCallIfNeed = useCallback((data, action) => {
        if (data.length > 0) return;
        dispatch(action);
    }, [dispatch]);




    const validateFun = () => {
        const { $isNullUndefine } = $AHelper
        const { typePlanId, suppPlanId, insNameId, premiumFrePerYear, premiumAmt, insCardPath1, insCardPath2, insName, insComId, quesReponse, groupNo, deductibleAmount, coPayment, outOfPocketMaximum, insStartDate, insEndDate } = insDetails;
        if ($isNullUndefine(typePlanId) && $isNullUndefine(suppPlanId) && $isNullUndefine(insNameId) && $isNullUndefine(premiumFrePerYear) &&
            $isNullUndefine(premiumAmt) && $isNullUndefine(insCardPath1) && $isNullUndefine(insCardPath2) && $isNullUndefine(insName) &&
            $isNullUndefine(insComId) && $isNullUndefine(quesReponse) && $isNullUndefine(groupNo) && $isNullUndefine(deductibleAmount) &&
            $isNullUndefine(coPayment) && $isNullUndefine(outOfPocketMaximum) && $isNullUndefine(insStartDate) && $isNullUndefine(insEndDate)
        ) {
            return true;
        } else {
            return false;
        }
    }

    // @@ Save and Update Information
    const handleSaveBtn = async (btnType) => {

        if (validateFun()) {
            let msg = ' Fields cannot be blank, please fill in the details.'
            toasterAlert("warning", "Warning", msg);
            return;
        }
        let userId = policyHolder;
        konsole.log("aaspouseUserIdspouseUserId", spouseUserId)

        if (!$AHelper.$isNotNullUndefine(userId)) {
            toasterAlert("warning", "Warning", 'Please select primary policy holder');
            return;
        }


        if ((type == 'EDIT' && isApiCall) || type == 'ADD') { // update api call ,If something change 


            let jsonObj = {
                userId: userId,
                insurance: insDetails
            }

            // @@ Upload File
            {
                useLoader(true)
                let userId = activeTab == 2 ? spouseUserId : primaryUserId
                const _fileUpload = await uploadAssetsFileRef.current.saveUploadUserDocument(userId);
                console.log("jsjdjsdjs", _fileUpload)
                useLoader(false)
                if (_fileUpload != 'no-file') {
                    let fileId = _fileUpload?.fileId;
                    let documentName = _fileUpload?.userFileName;
                    let documentPath = _fileUpload?.fileURL;
                    if (_fileUpload == 'file-delete') {
                        fileId = null;
                        documentName = insDetails?.userInsuranceDocs[0]?.documentName;
                        documentPath = insDetails?.userInsuranceDocs[0]?.documentPath;
                    }
                    let assetDocumentsJson = [{ documentName, documentPath, fileId: fileId }]
                    if (insDetails?.userInsuranceDocs?.length > 0) {
                        assetDocumentsJson[0]["userInsDocId"] = insDetails?.userInsuranceDocs[0]?.userInsDocId;
                        assetDocumentsJson[0]["userInsId"] = insDetails?.userInsuranceDocs[0]?.userInsId;
                    }
                    jsonObj.insurance['userInsuranceDocs'] = assetDocumentsJson;
                    konsole.log("userInsuranceDocs", assetDocumentsJson)
                }

                // @@ Upload File
            }

            let method = 'POST'
            let url = $Service_Url.postaddUserInsurance
            if (type == 'EDIT') {
                method = 'PUT'
                url = $Service_Url.putupdateuserinsurance
            }

            // @@ DELETE MAP FOR SPOUSE IS SAME AS AND UPDATE DATA SPOUSE
            if (activeTab == 2 && insDetails?.userInsuranceMaps?.length == 2) {
                method = 'POST'
                url = $Service_Url.postaddUserInsurance
                const findSpouseValue = insDetails?.userInsuranceMaps?.find((item) => item.userId == spouseUserId)
                const insuranceMapId = findSpouseValue?.userInsMapId;

                const userPostData = {
                    userInsMapId: insuranceMapId,
                    isDeleted: true,
                    updatedBy: loggedInUserId,
                    updatedBy: loggedInUserId
                };
                konsole.log("userPostData", userPostData);
                await mapInsuranceWithUser('PUT', userPostData);
                fetchPrimaryInsurance();
            }

            // @@ DELETE MAP FOR SPOUSE IS SAME AS AND UPDATE DATA SPOUSE
            konsole.log("jsonObj", jsonObj);
            useLoader(true);
            // @@ Add update insurance
            const _resultOfSavedInsurance = await postApiCall(method, url, jsonObj);
            const responseData = _resultOfSavedInsurance?.data?.data;

            konsole.log("_resultOfSavedInsurance", _resultOfSavedInsurance);
            if (_resultOfSavedInsurance == 'err') {
                useLoader(false);
                toasterAlert("warning", "Warning", 'smething went wrong');
                return;
            }

            // Added insurance Map with the slected user
            if (type == 'ADD' || (type == 'EDIT' && activeTab == 2 && insDetails?.userInsuranceMaps?.length == 2)) {
                const userPostData = {
                    userId: responseData?.userId,
                    userInsId: responseData?.insurance[0]?.userInsuranceId,
                    sameInsUserId: null,
                    createdBy: loggedInUserId,
                    updatedBy: loggedInUserId
                };
                const result = await mapInsuranceWithUser('POST', userPostData)
            }

            // Addred insurance map with same as Spouse and update same as spouse for client
            if ((type == 'ADD' && isSameAsSpouse == true && activeTab == 1) || (type == 'EDIT' && insDetails?.userInsuranceMaps?.length == 1 && isSameAsSpouse == true && activeTab == 1)) {
                const userPostData = {
                    userId: spouseUserId,
                    userInsId: responseData?.insurance[0]?.userInsuranceId,
                    sameInsUserId: primaryUserId,
                    createdBy: loggedInUserId,
                    updatedBy: loggedInUserId
                };

                await mapInsuranceWithUser('POST', userPostData);
                fetchSpouseInsurance();

            }

            if (type == 'EDIT') {
                // @@ Delete Maping for the same as spouse 
                if (insDetails?.userInsuranceMaps?.length == 2 && isSameAsSpouse == false && activeTab == 1) {
                    const findSpouseValue = insDetails?.userInsuranceMaps?.find((item) => item.userId == spouseUserId)
                    const insuranceMapId = findSpouseValue?.userInsMapId;

                    const userPostData = {
                        userInsMapId: insuranceMapId,
                        isDeleted: true,
                        updatedBy: loggedInUserId,
                        updatedBy: loggedInUserId
                    };
                    konsole.log("userPostData", userPostData)
                    await mapInsuranceWithUser('PUT', userPostData);
                    fetchSpouseInsurance();
                }
            }


            // @@ for add/update other Value
            {
                let isSameAsSpouseUserId = isSameAsSpouse == true ? spouseUserId : ''
                const userInsuranceId = responseData?.insurance[0]?.userInsuranceId
                if (insDetails?.typePlanId == 999999) {
                    let result = await typePlanRef.current.saveHandleOther(userInsuranceId, isSameAsSpouseUserId);
                    konsole.log("resultA", result)
                }
                if (insDetails?.suppPlanId == 999999) {
                    let result = await suppInsRef.current?.saveHandleOther(userInsuranceId, isSameAsSpouseUserId);
                    konsole.log("resultB", result)
                }
                if (insDetails?.insComId == 999999) {
                    let result = await insCompanyRef.current?.saveHandleOther(userInsuranceId, isSameAsSpouseUserId);
                    konsole.log("resultC", result)
                }
            }

            useLoader(false);
            if (activeTab == 1) {
                console.log("insDetailsinsDetails",insDetails)
                fetchPrimaryInsurance();           
                if (type == 'EDIT' && (insDetails?.userInsuranceMaps?.length == 2 && (isSameAsSpouse == true || isSameAsSpouse == false))) {
                    fetchSpouseInsurance();
                }
            }
            if (activeTab == 2) {
                fetchSpouseInsurance();
            }
        }
        useLoader(false);
        let message = (type == 'ADD') ? 'Your data have been saved successfully' : "Your data have been updated successfully"
        toasterAlert("successfully", `${type == 'ADD' ? "Successfully saved data" : "Successfully updated data"}`, message);


        // @@ add another insurance btn
        if (btnType == 'another') {
            const _fileUpload = await uploadAssetsFileRef.current.saveNAddAnother();

            setInsDetails({ ...$JsonHelper.createHealthInsuranceJson(), 'createdBy': loggedInUserId, 'insCardPath1': '', 'insName': '', 'groupNo': '' })
            setIsSameAsSppuse('')
        } else {
            if (type == 'ADD' && btnType != 'continueLater') {
                if (activeTab == 1 && isPrimaryMemberMaritalStatus) {
                    hanldeChangeActiveTableType()
                    handleActiveTabButton(2)
                } else {
                    // same as primayr member and cancel ang go to the primayr care phycian
                    handleActiveTabButton(2, 2)
                }
            } else {
                // this is for clreat edit details and  previous btn
                hanldeChangeActiveTableType()
            }
        }
        $AHelper.$scroll2Top()
    }


    // @@ Map Insurance with Member and Spouse 
    const mapInsuranceWithUser = (method, json) => {
        return new Promise(async (resolve, reject) => {
            let url = method == 'PUT' ? $Service_Url.mapUpdateInsurance : $Service_Url.mapUserInsurance;
            await $postServiceFn.mapDataWithPrimaryUser(method, url, json);
            resolve('resolve')
        })
    }

    
    console.log("insDetailsinsDetails",insDetails)
    // @@ previous btn with  close table
    const hanldeChangeActiveTableType = () => {
        handleActiveTableAddType('')
        handlePreviousBtn()
    }


    // @@ select change for set value
    const handleSelectChange = (key, val) => {
        console.log("keykeyeykey", key, val)
        let value = (key != 'premiumFrePerYear') ? val.value : val.label;
        setStateInsDetail(key, value)

        if (key == 'typePlanId' && value != 2 && value != 3) {
            setStateInsDetail('suppPlanId', '');
        }
    }
    // @@ input change for input
    const handleInputChange = (key, value) => {
        setStateInsDetail(key, value)
    }

    // function for update state
    const setStateInsDetail = (key, value) => {
        setInsDetails(prev => ({
            ...prev, [key]: value
        }))
        setIsApiCallfun();
    }

    const setIsApiCallfun = () => {
        if (type == 'EDIT') {
            setIsApiCall(true)
        }
    }

    // @@ file information details

    const fileInformationDetails = useMemo(() => {
        return {
            'Type': insDetails?.typePlan,
            'heading': `Health Insurance Document`
        }
    }, [insDetails])

    // @@Value with usMemo
    const renderedOptions = useMemo(() => ({
        typeOfPlanList,
        typeOfSubPlanList,
        typeOfInsCompanyList,
        prePreFrequencyList
    }), [typeOfPlanList, typeOfSubPlanList, typeOfInsCompanyList, prePreFrequencyList]);


    //@@ konsole
    konsole.log("typeOfPlanList", typeOfPlanList);
    konsole.log("prePreFrequencyList", prePreFrequencyList);
    konsole.log("isSameAsSpouse", isSameAsSpouse);
    konsole.log("typetypetype", type);
    konsole.log("insDetails", insDetails);
    konsole.log("editInfoeditInfo", editInfo)


    // @@ toaster for success 
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }

    const isHealthInsuranceVisible = typeof window !== 'undefined' && document.querySelector('.setup-health-insurance');
    const isCostumModalOpen = typeof window !== 'undefined' && document.querySelector('.costumModal-body');
    konsole.log(isSameAsSpouse,"isSameAsSpouseisSameAsSpouse")

    return (
        <>

            {/* @@ Previous Button */}
            <Row className="progress-container mb-1 previous-btn mt-2">
                <div>
                    <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer me-1" onClick={() => hanldeChangeActiveTableType('')} />
                    <span className='ms-1' onClick={() => hanldeChangeActiveTableType('')}> Previous</span>
                </div>
            </Row>
            {/* @@ Previous Button */}
            <Row className='mt-2'>
                <Col xs={12} xl={3} className=''>
                    <div className="heading-of-sub-side-links-2">{isHealthInsContent}</div>
                </Col>
                <Col xs={12} xl={9} className='' >
                    <Row>
                        {(policyHolder == primaryUserId && (isPrimaryMemberMaritalStatus)) &&
                            <Col xs={12} md={6} style={{ marginTop: "5px" }}>
                                {/* @@Radio same as spouse */}
                                <CustomCheckBoxForCopyToSpouseData
                                    tabIndex={1}
                                    className="d-inline-block"
                                    type="checkbox"
                                    value={isSameAsSpouse} onChange={(item) => {setIsApiCallfun(),setIsSameAsSppuse(item.target.checked)}}
                                    name='sameAs'
                                    placeholder={`Copy same data to ${_spousePartner}`}
                                />
                                {/* <CustomRadio options={radioYesNoLabelWithBool}
                                    // "radio-container" : classType == 'vertical' ? "d-block radio-container" : "radio-container"}
                                    classType='vertical' placeholder={`Does your ${_spousePartner} have the same insurance ?`} value={isSameAsSpouse} onChange={(item) => setIsSameAsSppuse(item.value)} /> */}
                            </Col>
                        }
                    </Row>
                    <Row className={`d-flex align-items-center spacingBottom ${isCostumModalOpen ? '' : 'gapNone'}`}>
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                            {/* @@POlicy Holder details */}
                            <CustomSelect
                                tabIndex={2}
                                isError=''
                                label='Primary policy holder'
                                placeholder='Select'
                                options={labelValueSpousePrimary}
                                value={policyHolder}
                                onChange={(e) => setPolicyHolder(e.value)} isDisable={true} />
                        </Col>
                    </Row>
                    <Row className={`d-flex align-items-center spacingBottom ${isCostumModalOpen ? '' : 'gapNone'}`}>
                        {/* @@ SELECT OF TYPE */}
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                            <CustomSelect tabIndex={3} isError='' label='Type' id='typePlanId' options={renderedOptions?.typeOfPlanList} placeholder='Select' value={insDetails?.typePlanId} onChange={(val) => handleSelectChange('typePlanId', val)} />
                        </Col>

                        {/* @@ SELECT OF Supplement insurance */}

                        {(insDetails?.typePlanId == 2 || insDetails?.typePlanId == 3) &&
                            <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                                <CustomSearchSelect tabIndex={4} label="Supplement insurance" options={renderedOptions?.typeOfSubPlanList} isError='' id='suppPlanId' placeholder='Select' value={insDetails?.suppPlanId} onChange={(val) => handleSelectChange('suppPlanId', val)} />
                            </Col>
                        }

                        {/* Other for Type */}
                        {(insDetails?.typePlanId == 999999) &&
                            <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                                <Other tabIndex={5}  setNeedUpdate={setIsApiCall} othersCategoryId={31} userId={policyHolder} dropValue={insDetails?.typePlanId} ref={typePlanRef} natureId={insDetails?.userInsuranceId} />
                            </Col>
                        }
                    </Row>

                    {/* @@ Other for Supplement insurance */}

                    {(insDetails?.suppPlanId == 999999) &&
                        <Row className={`d-flex align-items-center spacingBottom ${isCostumModalOpen ? '' : 'gapNone'}`}>
                            <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4} >
                            </Col>
                            <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                                <Other tabIndex={6}  setNeedUpdate={setIsApiCall} othersCategoryId={30} userId={policyHolder} dropValue={insDetails?.suppPlanId} natureId={insDetails?.userInsuranceId} ref={suppInsRef} />
                            </Col>
                        </Row>
                    }
                    <Row className={`d-flex align-items-center spacingBottom ${isCostumModalOpen ? '' : 'gapNone'}`}>
                        {/* @@ Insurance company */}
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                            <CustomSearchSelect tabIndex={7} isError='' label='Insurance company' placeholder='Select' options={renderedOptions?.typeOfInsCompanyList} value={insDetails?.insComId} id='insComId' onChange={(val) => handleSelectChange('insComId', val)} />
                        </Col>

                        {/* @@ OTHER OF Insurance company */}
                        {(insDetails?.insComId == 999999) &&
                            <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                                <Other tabIndex={8}  setNeedUpdate={setIsApiCall} othersCategoryId={35} userId={policyHolder} dropValue={insDetails?.insComId} ref={insCompanyRef} natureId={insDetails?.userInsuranceId} />
                            </Col>
                        }
                    </Row>
                    <Row className='spacingBottom'>
                        {/* @@ Indurance Name */}
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                            <CustomInput tabIndex={9} isError='' label='Policy/Plan name' placeholder='Enter name' isDisable={false} id='insName' name='Insurance name' value={insDetails?.insName} onChange={(val) => handleInputChange('insName', val)} />
                        </Col>
                    </Row>
                    <Row className='spacingBottom'>
                        {/* @@ policy number */}
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                            <CustomInput tabIndex={10} notCapital={true} isError='' label='Policy number' placeholder='Enter number' id='insCardPath1' name='Policy number' onChange={(val) => handleInputChange('insCardPath1', val)} value={insDetails?.insCardPath1} />
                        </Col>
                    </Row>
                    <Row className='spacingBottom'>
                        {/* @@ group number */}
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                            <CustomInput tabIndex={11}  notCapital={true}  isError='' label='Group number' name='Group Number' placeholder='Enter number' id='groupNo' onChange={(val) => handleInputChange('groupNo', val)} value={insDetails?.groupNo} />
                        </Col>
                    </Row>
                    <Row className={`d-flex align-items-center spacingBottom ${isCostumModalOpen ? '' : 'gapNone'}`}>
                        {/* @@ Premium frequency  */}
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                            <CustomSelect tabIndex={12} isError='' label='Premium frequency' placeholder='Select' options={renderedOptions?.prePreFrequencyList} id='premiumFrePerYear' value={renderedOptions?.prePreFrequencyList?.find((item) => item?.label == insDetails?.premiumFrePerYear)?.value} onChange={(val) => handleSelectChange('premiumFrePerYear', val)} />
                        </Col>
                        {/* @@ Preminum amount */}
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                            <CustomCurrencyInput tabIndex={13} name='premiumAmt' isError='' label='Premium amount' id='premiumAmt' value={insDetails?.premiumAmt} onChange={(val) => handleInputChange('premiumAmt', val)} />
                        </Col>
                    </Row>
                    <Row className={`d-flex align-items-center spacingBottom ${isCostumModalOpen ? '' : 'gapNone'}`}>
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4} >
                        </Col>
                        {/* @@ Deductible amount */}
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                            <CustomCurrencyInput tabIndex={14} name='deductibleAmount' isError='' label='Deductible amount' id='deductibleAmount' value={insDetails?.deductibleAmount} onChange={(val) => handleInputChange('deductibleAmount', val)} />
                        </Col>
                    </Row>
                    <Row className={`d-flex align-items-center spacingBottom ${isCostumModalOpen ? '' : 'gapNone'}`}>
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4} >
                        </Col>
                        {/*@@ Co-Payment' */}
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                            <CustomCurrencyInput tabIndex={15} name='coPayment' label='Co-payment' id='coPayment' isError='' value={insDetails?.coPayment} onChange={(val) => handleInputChange('coPayment', val)} />
                        </Col>
                    </Row>
                    <Row className={`d-flex align-items-center spacingBottom ${isCostumModalOpen ? '' : 'gapNone'}`}>
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4} >
                        </Col>
                        {/*@@ Out of pocket maximum' */}
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                            <CustomCurrencyInput tabIndex={16} label='Out of pocket maximum' id='outOfPocketMaximum' isError='' name='outOfPocketMaximum' onChange={(val) => handleInputChange('outOfPocketMaximum', val)} value={insDetails?.outOfPocketMaximum} />
                        </Col>
                    </Row>
                    <Row className='spacingBottom'>

                        {/*@@ Coverage start date' */}
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                            <CustomCalendar tabIndex={17} label={'Coverage start date'} allowFutureDate={true} placeholder="mm/dd/yyyy" isError='' name='insStartDate' id='insStartDate' value={insDetails?.insStartDate} onChange={(val) => handleInputChange('insStartDate', val)} />
                        </Col>
                    </Row>
                    <Row className='spacingBottom'>
                        {/* @@ Coverage end date*/}
                        <Col xs={12} md={6} lg={isHealthInsuranceVisible ? 5 : 4}>
                            <CustomCalendar tabIndex={18} label={'Coverage end date'} placeholder="mm/dd/yyyy" allowFutureDate={true} value={insDetails?.insEndDate} name='insEndDate' id='insEndDate' type="insEndDate" onChange={(val) => handleInputChange('insEndDate', val)} />
                        </Col>
                    </Row>
                    {/* @@ Expenses Question */}
                    <div className='mb-3'>
                        <ExpensesQuestion
                            startTabIndex={19}
                            value={insDetails?.quesReponse}
                            setStateInsDetail={setStateInsDetail}
                            isHealthpage={true}

                        />
                    </div>

                    {/* @@ Expenses Question */}

                    {/* @@ Upload File */}
                    <UploadAssetsFile
                        startTabIndex={19 + 4}
                        savedDocuments={insDetails?.userInsuranceDocs?.filter((item) => item.fileId !== null)}
                        ref={uploadAssetsFileRef}
                        refrencePage={'Health Insurance'}
                        details={fileInformationDetails}
                        setIsApiCall={setIsApiCall}

                    />
                    {/* @@ Upload File */}
                </Col>

            </Row>
            <Row style={{ marginTop: '24px' }}>

                <div className='d-flex'>
                    {(type == "ADD") && <CustomButton2
                        tabIndex={19 + 4 + 1} label="Save & Continue later"
                        onClick={() => handleSaveBtn("continueLater")}
                    />}
                    <div className='ms-auto'>

                        {(type == 'ADD') &&
                            <CustomButton3 tabIndex={19 + 4 + 1 + 1} label={'Save & Add Another'} onClick={() => handleSaveBtn('another')} />
                        }
                        <CustomButton tabIndex={19 + 4 + 1 + 1 + 1} onClick={() => handleSaveBtn()} label={`${(type == 'EDIT') ? 'Update' : (activeTab == 1 && isPrimaryMemberMaritalStatus) ? `Save & Proceed to ${spouseFirstName} ` + "Information" : 'Save & Proceed to Medication & Supplements'}`} />
                    </div>

                </div>
            </Row>
        </>
    )
}

export default HealthInsuranceAddUpdate
