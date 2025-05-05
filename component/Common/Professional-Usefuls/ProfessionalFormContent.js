import React, { useEffect, useCallback, useState, useImperativeHandle, ref, forwardRef, useMemo } from 'react';
import { Form, Col, Row, Alert, Button } from 'react-bootstrap';
import { CustomInput, CustomLinkInput, CustomMultipleSearchSelect, CustomRadio, CustomSearchSelect, CustomSelect, CustomCheckBoxForCopyToSpouseData, CustomTextarea } from '../../Custom/CustomComponent';
import ProfessionalQuestionaries from './ProfessionalQuestionaries';
import { $AHelper } from '../../Helper/$AHelper';
import { profConstants, radioYesNoLabelWithBool } from '../../Helper/Constant';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { selectProfessional } from '../../Redux/Store/selectors';
import { fetchBusinessTypes, fetchProfSubTypes, fetchProfTypes, setformData, setisUserStartedEdit } from '../../Redux/Reducers/professionalSlice';
import konsole from '../../../components/control/Konsole';
import { useProfFormState } from '../../Hooks/useProfessional';
import Other from '../../../components/asssets/Other';
import ProfessionalMetaData from './ProfessionalMetaData';
import { focusInputBox, isNotValidNullUndefile } from '../../../components/Reusable/ReusableCom';
import { formatValue } from 'react-currency-input-field';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
const toUpperCaseFor = ['fName', 'lName' ];
const initialState = ({fName: '', lName: '', specialty: '', businessName: '', businessTypeId: '', websiteLink: '', sameAsSpouse: undefined, curProCatList: [], metaData: {}});

const ProfessionalFormContent = forwardRef(( props, ref ) => {
    const defaultSameAsSpouse = props.hideSameAs == true ? false : true;
    const [formData, setFormData] = useProfFormState(defaultSameAsSpouse);
    konsole.log("dabvhb", formData);
    const [errorMsg, setErrorMsg] = useState(initialState);
    const [profCategories, setprofCategories] = useState([]);  // THE OBJECT INSIDE THIS MUST BE LIKE - { proCatId, proSerDescId, proTypeId, proSubTypeId, isActive/isChecked }
    const isMyprofessional = props.proTypeId == "";
    const {_spousePartner, displaySpouseContent}=usePrimaryUserId();
    
    const startingTabIndex = props?.startTabIndex ?? 0;  

    const dispatch = useAppDispatch();
    const { profSubTypes, businessTypeList, profTypes, isUserStartedEdit } = useAppSelector(selectProfessional);

    // DERIVED VARIABLE
    const isSingleProfForm = props.proTypeId ? true : false;
    const isPrimaryProf = [10, 11].includes(parseInt(props.proTypeId)) ? true : false;

    useEffect(() => {
        if(isPrimaryProf || isMyprofessional) getSpecialties();
        if(isMyprofessional) {
            prePareForMyProfessional(props.editProfDetails);
        }
        // if(!isPrimaryProf) {
        //     getBusinessTypeList();
        // }
    }, [props?.editProfDetails?.professionalUserId])

    useEffect(() => {
        if(props.proSerDescId == "") {
            formData?.selectedProSerDescIds?.forEach(ele => (!profTypes[ele?.value]?.length) && dispatch(fetchProfTypes(ele?.value)));
        }
    }, [formData?.selectedProSerDescIds])

    useEffect(() => {
        try {
            const {fName, lName, allProCatList, businessName, businessTypeId, websiteLink, sameAsSpouse, primaryProfDetails, instructionsToAgent, userProId} = props?.editProfDetails ?? {};
            konsole.log("sdnkj",  props.editProfDetails)
            let curState = {fName, lName, businessName, businessTypeId, websiteLink, instructionsToAgent, userProId};
            if(isSingleProfForm) {
                curState = {
                    ...curState,
                    specialty: isPrimaryProf ? allProCatList?.[0]?.proSubTypeId : undefined,
                    sameAsSpouse: sameAsSpouse,
                    // metaData: primaryProfDetails
                }
            } else {
                curState = {
                    ...curState,
                    curProCatList: [...allProCatList],
                    sameAsSpouse: sameAsSpouse
                }
            }
            konsole.log("vhjvkjvjhv" , curState, props?.editProfDetails);
            if(curState?.userProId != formData?.userProId) setFormData({...curState, sameAsSpouse: sameAsSpouse ?? defaultSameAsSpouse});
            if(curState?.sameAsSpouse != formData?.sameAsSpouse) setFormData({ ...formData, sameAsSpouse: sameAsSpouse ?? defaultSameAsSpouse});
        } catch (err) {
            konsole.log("err", err)
        }
    }, [props.editProfDetails])

    // Used to unselect pro-types in my professional drop-down
    useEffect(() => {
        if(isUserStartedEdit) {
            const curProTypeSelected = Object.keys(formData?.proTypeSelected ?? {});
            const selectedProSerDescIdsObject = formData?.selectedProSerDescIds?.reduce((tempRslt, ele) => {tempRslt[ele?.value] = ele?.isChecked; return tempRslt}, {});
            konsole.log("fdsbvhb_entry", curProTypeSelected, selectedProSerDescIdsObject)
            for(let i = 0; i < curProTypeSelected?.length; i++) {
                const key = curProTypeSelected[i];
                if(selectedProSerDescIdsObject[key] != true) {
                    setFormDataFunc('proTypeSelected', {...(formData?.proTypeSelected || {}), [key]: {}})
                    break; // breaking becoz on each unselect it is going make calls & at each unselect there is going to be one match only
                } 
            }
        }
    }, [formData?.selectedProSerDescIds, isUserStartedEdit])
    
    // Used to unselect pro-sub-types in my professional drop-down
    useEffect(() => {
        if(isUserStartedEdit) {
            const selectedProTypes = Object.values(formData?.proTypeSelected ?? {})?.reduce((tempRslt, ele) => ({...tempRslt, ...ele}), {});
            Object.keys(formData?.proSubTypeSelected ?? {})?.forEach(ele => {
                if(selectedProTypes[ele] != true) {
                    setFormDataFunc('proSubTypeSelected', {...(formData?.proSubTypeSelected || {}), [ele]: {}})
                }
            })
            konsole.log("fdsbsdg_entry", selectedProTypes);
        }
    }, [formData?.proTypeSelected, isUserStartedEdit])

    useImperativeHandle(ref, () => ({
        getterFormData: () => formData,
        // setterFormData: setFormData,
        setterErrorData: setErrorMsg,
        validateFormData,
    }));

    const prePareForMyProfessional = ( profDetails ) => {
        setFormDataFunc('proTypeSelected', {});    
        setFormDataFunc('proSubTypeSelected', {});
        
        konsole.log("eadbvj", profDetails);

        // auto proSerDesc selection will be done by other file 'ProfessionalCategorySelect'
        // Now below code is to auto select prof types 
        let proTypeList = {};
        let proSubTypeList = {};

        profDetails?.allProCatList?.forEach(ele => {
            proTypeList[ele.proSerDescId] = {
                ...proTypeList[ele.proSerDescId],
                [ele.proTypeId]: true,
            }

            if(ele.proSubTypeId && ele.proSubTypeId != '0')
                proSubTypeList[ele.proTypeId] = {
                    ...proSubTypeList[ele.proTypeId],
                    [ele.proSubTypeId]: true,
                }
        })

        konsole.log("eadbvj-state", proTypeList, proSubTypeList);
        setFormDataFunc('proTypeSelected', proTypeList);       
        setFormDataFunc('proSubTypeSelected', proSubTypeList);       
    }

    const getSpecialties = () => {
        if(!profSubTypes?.length) {
            dispatch(fetchProfSubTypes())
        }
    }

    // const getBusinessTypeList = () => {
    //     if(!businessTypeList?.length) {
    //         dispatch(fetchBusinessTypes())
    //     }
    // }

    const handleInputChange = ( value, key, inputType ) => {
        setErrorMsgFunc(key, '');
        if(inputType == 'select' || inputType == 'businessTypeId') {
            setFormDataFunc(key, value?.value);
            return;
        }
        // if(toUpperCaseFor.includes(key)) value = $AHelper.$isUpperCase(value); 
        setFormDataFunc(key, value);
    }

    const handleProfTypeSelect = ( value, key ) => {
        if(isUserStartedEdit != true) dispatch(setisUserStartedEdit(true));
        setErrorMsgFunc(key, '');
        konsole.log("djhbsdhbvjsdhjb", value, value?.[1]?.[11])
        if(key == "proTypeSelected" && value?.[1]?.[11] != true) setErrorMsgFunc("proSubTypeSelected", '');
        setFormDataFunc(key, value);
    }

    const setFormDataFunc = (key , value) => {
        konsole.log("ssjdhfjha", formData, key, value);
        setFormData({...formData, [key]: value});
    }

    const setErrorMsgFunc = (key, value, prevError, resetAll) => {
        if(resetAll == true) return setErrorMsg(initialState); 
        setErrorMsg(oldState => ({...oldState, [key]: value}));
        if(prevError == false) focusInputBox(key);
        // konsole.log("asfdsaf", key, prevError)
    }

    const otherCategoryProCatId = useMemo(() => {
        // konsole.log("sadnfkals", props.editProfDetails?.allProCatList);
        return props.editProfDetails?.allProCatList?.find(ele => ele?.proSubTypeId == "999999")?.proCatId;
    }, [props.editProfDetails?.allProCatList])

    const otherCategoryProCatIdNew = useMemo(() => {
        return props.editProfDetails?.allProCatList?.find(ele => ele?.proTypeId == "999999")?.proCatId;
    }, [props.editProfDetails?.allProCatList]);       

    const orderedSubCatagories = useMemo(() => [...profSubTypes]?.map(ele => ({
        ...ele,
        label: ele.proSubType,
        value: ele.proSubTypeId,
    }))?.sort((a, b) => {
        if (a.proSubType === "Other") return -1; // Move "Other" value to the first
        if (b.proSubType === "Other") return 1; // Move "Other" value to the first
        return a.proSubType?.toLowerCase()?.localeCompare(b.proSubType?.toLowerCase()); // Sort by label name
    }), [profSubTypes]);

    
    const modifiedProfSubTypes = orderedSubCatagories?.filter(ele => ele.proTypeId == props.proTypeId); 

    const proSubSelectOptions = useMemo(() => {
        const typeList = []
        formData?.proTypeSelected && Object.values(formData?.proTypeSelected)?.forEach(ele => ele && Object.entries(ele)?.forEach(subEle => subEle[1] && typeList.push(subEle[0])));

        let finalValue = [];
        typeList?.forEach(ele => {
            const subCat = orderedSubCatagories?.filter(subEle => subEle.proTypeId == ele);
            if(subCat?.length) finalValue.push({
                label: subCat[0]?.proType,
                value: subCat[0]?.proTypeId,
                subCat: subCat,
            })
        })

        konsole.log("asnvjkdbv", finalValue);
        return finalValue;
    }, [formData.proTypeSelected, profSubTypes]) 

    const isOtherSelected = useMemo(() => {
        return formData.proSubTypeSelected && Object.values(formData?.proSubTypeSelected)?.some(ele => (ele) && Object.entries(ele)?.some(subEle => subEle[0] == "999999" && subEle[1])) == true;
    }, [formData.proSubTypeSelected])

    const isOtherSelectedInProType = useMemo(() => {
        const selected = formData?.proTypeSelected;
        return selected && Object.values(selected).some((ele) => ele && Object.entries(ele).some(([key, value]) => key === "999999" && value) );
      }, [formData.proTypeSelected]);
      
    const requireSubCategory = useMemo(() => {
        const tempproTypeSelected = formData?.proTypeSelected;
        return isNotValidNullUndefile(tempproTypeSelected) && Object.values(tempproTypeSelected)?.some(ele => ele && Object.entries(ele)?.some(subEle => subEle?.[0] == '11' && subEle?.[1] == true))
    }, [formData?.proTypeSelected])

    konsole.log("wednsvkjsb", formData, requireSubCategory);

    const validateFormData = () => {
        const { fName, lName, specialty, websiteLink, proTypeSelected, proSubTypeSelected} = formData;
        let isAnyError = false;

        if(isMyprofessional) {
            if(proTypeSelected && Object.values(proTypeSelected)?.some(ele => ele && Object.values(ele)?.some(subEle => subEle == true)) != true) {
                setErrorMsgFunc('proTypeSelected', profConstants.errorMsgs.proTypeSelectedErr, isAnyError);
                isAnyError = true;
            }

            if(requireSubCategory && (proSubSelectOptions?.length > 0 && proSubTypeSelected && Object.values(proSubTypeSelected[11] ?? {})?.some(ele => ele == true) != true)) {
                setErrorMsgFunc('proSubTypeSelected', profConstants.errorMsgs.proSubTypeErr, isAnyError);
                isAnyError = true;
            }
        }

        if(!fName) {
            setErrorMsgFunc('fName', profConstants.errorMsgs.fNameEmpty, isAnyError);
            isAnyError = true;
        }
        // if(!lName) {
        //     setErrorMsgFunc('lName', profConstants.errorMsgs.lNameEmpty);
        //     isAnyError = true;
        // }
        if(websiteLink && ($AHelper.$isUrlValid(websiteLink) == false)) {
            setErrorMsgFunc('websiteLink', profConstants.errorMsgs.linkInValid, isAnyError);
            isAnyError = true;
        }
        if(!specialty && props.proTypeId == '11') {
            setErrorMsgFunc('specialty', profConstants.errorMsgs.specialtyEmpty, isAnyError);
            isAnyError = true;
        }

        return isAnyError == false;
    }

    const isCostumModalOpen = typeof window !== 'undefined' && document.querySelector('.costumModal-body');
    const isFinanceInfoContainerVisible = typeof window !== 'undefined' && document.querySelector('.finance-information-container');
    const isEditFinancialAdvisorVisible = typeof window !== 'undefined' &&  ((document.querySelector('.heading-text')?.textContent.trim() === 'Edit Financial Advisor' || document.querySelector('.heading-text')?.textContent.trim() === 'Edit Accountant') || document.querySelector('.heading-text')?.textContent.trim() === 'Edit Bookkeeper');
    const isFamilyInfoVisible = typeof window !== 'undefined' && (
    document.querySelector('.setup-family-information') ||
    document.querySelector('.withDescription') ||
    document.querySelector('.finance-body')
    );

    const finalProfTypes = formData?.selectedProSerDescIds?.map(ele => ({
        label: ele.label,
        value: ele?.value,
        subCat: [...(profTypes[ele?.value] ?? [])]?.sort((a,  b) => a.proType == "Other" ? -1 : b.proType == "Other"? 1 : a.proType.toLowerCase().localeCompare(b.proType.toLowerCase())),
    }));
    // const finalProfTypes = formData?.selectedProSerDescIds?.map(ele => alert(ele.value))
    konsole.log("dbvsjbs", finalProfTypes, modifiedProfSubTypes)
    konsole.log("dbvkjbskj", finalProfTypes, proSubSelectOptions);

    return (
        <>
            <Row id='professional' className=''>
                {(props.hideSameAs == false) ? <Row style={{marginTop: '-12px'}}>
                    {/* <div className=''> */}
                    <CustomCheckBoxForCopyToSpouseData
                        tabIndex={startingTabIndex + 1}  
                        className="d-inline-block"  
                        type="checkbox"   
                        onChange={(e) => handleInputChange(e.target.checked, "sameAsSpouse")}
                        value={formData?.sameAsSpouse} 
                        name='sameAs'  
                        placeholder={`Copy same data to ${_spousePartner}`} 
                        />
                    {/* </div> */}
                </Row> : ""}
                {isMyprofessional && 
                <Row className='pe-0 d-flex gapProfessionalNoneReal mt-3'>
                    <Col xs={12} md={6} lg={isMyprofessional ? 4 : 5} className={'customProfessional-lg-5 pe-0'} >
                        {/* <div className='mt-24'> */}
                            <CustomMultipleSearchSelect 
                                tabIndex={startingTabIndex + 2} 
                                isError={errorMsg.proTypeSelected}
                                label="Select service provider*"
                                id="proTypeSelected"
                                placeholder='Select'
                                options={finalProfTypes}
                                isCategorized={true}
                                selectedValues={formData?.proTypeSelected}
                                onChange={(curSelection) => handleProfTypeSelect(curSelection, 'proTypeSelected')}
                            />
                        {/* </div> */}
                        {isOtherSelectedInProType && <div className='mt-2'>
                            <Other
                                tabIndex={startingTabIndex + 4} 
                                othersCategoryId={28}
                                userId={props.editProfDetails?.professionalUserId}
                                dropValue="999999"
                                ref={props.mainOtherSpecialistRef}
                                natureId={otherCategoryProCatIdNew}
                            />
                        </div>}
                    </Col>
                    {proSubSelectOptions?.length > 0 &&  
                    <Col xs={12} md={6} lg={isMyprofessional ? 4 : 5} className={`${isMyprofessional ? 'customProfessional-lg-5 pe-1' : ''} ${isPrimaryProf ? 'mt-2' : 'pe-1'}`} >
                        {/* <div className='mt-24'> */}
                            <CustomMultipleSearchSelect 
                                tabIndex={startingTabIndex + 3} 
                                isError={errorMsg.proSubTypeSelected}
                                label={`Select Sub service provider${requireSubCategory ? '*' : ''}`}
                                id="proSubTypeSelected"
                                placeholder='Select'
                                options={proSubSelectOptions}
                                isCategorized={true}
                                selectedValues={formData?.proSubTypeSelected}
                                onChange={(e) => handleProfTypeSelect(e, 'proSubTypeSelected')}
                            />
                        {/* </div>} */}
                        {isOtherSelected && <div className='mt-2'>
                            <Other
                                tabIndex={startingTabIndex + 4} 
                                othersCategoryId={28}
                                userId={props.editProfDetails?.professionalUserId}
                                dropValue="999999"
                                ref={props.otherSpecialistRef}
                                natureId={otherCategoryProCatId}
                            />
                        </div>}
                    </Col>}
                </Row>}
                <Col className={`mt-2 ${isMyprofessional ? 'customProfessional-lg-5 pe-1' : ''} ${isPrimaryProf ? ' ' : 'pe-1'}`} xs={12} md={isCostumModalOpen ? undefined : 6} lg={isCostumModalOpen ? undefined : (isFinanceInfoContainerVisible && isEditFinancialAdvisorVisible ? 5 : (isFinanceInfoContainerVisible ? 4 : (isFamilyInfoVisible ? 5 : 4)))}  >
                        <div className='spacingBottom'>
                            <CustomInput
                             
                                tabIndex={startingTabIndex + 5} 
                                isError={errorMsg.fName}
                                label="First name*"
                                placeholder="Enter first name"
                                id='fName'
                                value={formData?.fName}
                                onChange={(val) => handleInputChange(val, 'fName')} 
                            />
                        </div>
                        <div className='spacingBottom'>
                            <CustomInput
                                tabIndex={startingTabIndex + 6} 
                                isError={errorMsg.lName}
                                label="Last name"
                                placeholder="Enter last name"
                                id='lName'
                                value={formData?.lName}
                                onChange={(val) => handleInputChange(val, 'lName')} 
                            />
                        </div>
                            {isPrimaryProf && <>
                            <div className=''>
                            <CustomSearchSelect
                                tabIndex={startingTabIndex + 7}
                                isError={errorMsg.specialty}
                                label={props.proTypeId == '11' ? "Specialty*" : "Specialty"}
                                id="specialty"
                                placeholder='Select specialty'
                                options={modifiedProfSubTypes}
                                value={formData?.specialty}
                                onChange={(e) => handleInputChange(e, 'specialty', 'select')}
                            />
                            </div>
                            {formData?.specialty == "999999" && <div className=' mt-2'>
                                <Other 
                                    tabIndex={startingTabIndex + 8}
                                    othersCategoryId={28}
                                    userId={props.editProfDetails?.professionalUserId}
                                    dropValue="999999"
                                    ref={props.otherSpecialistRef}
                                    natureId={otherCategoryProCatId}
                                />
                                </div>}
                            </>}
                </Col>
                {isPrimaryProf == false && <Row className='pe-0'>
                    <Col className={`${isMyprofessional ? 'customProfessional-lg-5 pe-1' : ''} ${isPrimaryProf ? 'mt-2' : 'pe-1'}`}  xs={12} md={isCostumModalOpen ? undefined : 6} lg={isCostumModalOpen ? undefined : (isFinanceInfoContainerVisible && isEditFinancialAdvisorVisible ? 5 : (isFinanceInfoContainerVisible ? 4 : (isFamilyInfoVisible ? 5 : 4)))}>
                        <div className='spacingBottom'>
                        <CustomInput
                            tabIndex={startingTabIndex + 9}
                            isError={errorMsg.businessName}
                            label="Business Name"
                            placeholder="Enter business name"
                            id='business'
                            value={formData?.businessName}
                            onChange={(val) => handleInputChange(val, 'businessName')} 
                            // notCapital={true}
                        />
                        </div>
                    </Col>
                    {/* <Col xs={12} md={6} className={isPrimaryProf ? 'ps-4' : 'pe-1'}>
                        <div className=''>
                        <CustomSearchSelect
                           tabIndex={5}
                            isError={errorMsg.businessTypeId}
                            label="Business Type"
                            placeholder='Select'
                            options={businessTypeList}
                            value={formData?.businessTypeId}
                            onChange={(e) => handleInputChange(e, 'businessTypeId', 'select')}
                        />
                        </div>
                        {formData?.businessTypeId == "999999" && <div className='mt-2'>
                        <Other
                            othersCategoryId={30}
                            userId={props.editProfDetails?.professionalUserId}
                            dropValue="999999"
                            ref={props.otherBusinessTypeRef}
                            natureId={props.editProfDetails?.proUserId}
                        />
                        </div>}
                    </Col> */}
                </Row>}
                <Row className={`pe-0 d-flex align-items-center ${isCostumModalOpen ? '' : 'gapNone'}`}>
                    {isPrimaryProf &&  <Col  xs={12} md={isCostumModalOpen ? undefined : 6} lg={isCostumModalOpen ? undefined : (isFinanceInfoContainerVisible && isEditFinancialAdvisorVisible ? 5 : (isFinanceInfoContainerVisible ? 4 : (isFamilyInfoVisible ? 5 : 4)))}  className='pe-1'>
                    <div className=''>
                        <CustomInput
                            tabIndex={startingTabIndex + 10}
                            isError={errorMsg.businessName}
                            label="Affiliated hospital (s)"
                            placeholder="Enter clinic name(s)"
                            id='business'
                            value={formData?.businessName}
                            onChange={(val) => handleInputChange(val, 'businessName')} 
                            // isSmall={true}
                            // notCapital={true}
                            />
                    </div>
                    </Col> }
                    <Col className={`${isMyprofessional ? 'customProfessional-lg-5 pe-1' : ''} ${isPrimaryProf ? 'mt-2' : 'pe-1'}`} xs={12} md={isCostumModalOpen ? undefined : 6} lg={isCostumModalOpen ? undefined : (isFinanceInfoContainerVisible && isEditFinancialAdvisorVisible ? 5 : (isFinanceInfoContainerVisible ? 4 : (isFamilyInfoVisible ? 5 : 4)))}>
                    <div className='spacingBottom' >
                        <CustomLinkInput
                            tabIndex={startingTabIndex + 11}
                            isError={errorMsg.websiteLink}
                            notCapital={true}
                            label="Website Link"
                            placeholder="Enter Link"
                            id='websiteLink'
                            value={formData?.websiteLink}
                            onChange={(val) => handleInputChange(val, 'websiteLink')} 
                        />
                    </div>
                    </Col>
                </Row>
            </Row>
            <Col xs={12} md={6} className='meta-data'>
                <ProfessionalMetaData 
                    startTabIndex={startingTabIndex + 12}
                    ref={props.formMetaDataControlRef}
                    formLabels={props.metaLabels}
                    userId={props.editProfDetails?.professionalUserId}
                />
            </Col>
            <Col className='mb-3' >
            <ProfessionalQuestionaries
                startTabIndex={startingTabIndex + 12 + 7}
                proTypeId={props.proTypeId}
            />
            </Col>
            <Row className={`pe-0 d-flex align-items-center ${isCostumModalOpen ? '' : 'gapNone'}`}>
                <Col className={`${isMyprofessional ? 'customProfessional-lg-5 pe-1' : ''} ${isPrimaryProf ? 'mt-2' : 'pe-1'}`} xs={12} >
                    <div className='spacingBottom' >
                        <CustomTextarea
                            tabIndex={startingTabIndex + 12 + 4 + 7}
                            row={3}
                            label="Notes for Agents"
                            onHoverTitle="Specific instructions to your agents regarding this professional"
                            placeholder="Enter Instructions"
                            id='instructionsToAgent'
                            value={formData?.instructionsToAgent}
                            onChange={(val) => handleInputChange(val, 'instructionsToAgent')} 
                        />
                    </div>
                </Col>
            </Row>
        </>
    )
})

export default ProfessionalFormContent;
