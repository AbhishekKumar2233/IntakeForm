import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import konsole from '../../../components/control/Konsole';
import { $Service_Url } from '../../../components/network/UrlPath';
import { getApiCall, isNotValidNullUndefile, isNullUndefine, postApiCall } from '../../../components/Reusable/ReusableCom';
import { globalContext } from '../../../pages/_app';
import ContactAndAddress from '../../Custom/Contact/ContactAndAddress';
import { CustomAccordion, CustomAccordionBody } from '../../Custom/CustomAccordion';
import { CustomButton, CustomButton2, CustomButton3 } from '../../Custom/CustomButton';
import { CustomAddChildProgressBar } from '../../Custom/CustomHeaderTile';
import Stepper from '../../Custom/CustomStepper';
import { $AHelper } from '../../Helper/$AHelper';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { setBothFormData, setBothMetaData, setformData } from '../../Redux/Reducers/professionalSlice';
import { selectProfessional } from '../../Redux/Store/selectors';
import { useLoader } from '../../utils/utils';
import ProfessionalCategorySelect from './ProfessionalCategorySelect';
import { deletePrimaryCareProf, deleteProfessional, getPrimaryCareMapId, mapPrimaryProf, primaryProfUpsert } from './ProfessionalCommonFunction';
import ProfessionalFormContent from './ProfessionalFormContent';
import IDontHaveOne from './IDontHaveOne';
import UniversalAddress from '../../Custom/Contact/UniversalAddress';

const getProfessionalFormSteps = ( formType, professionalType, isMyProfessional ) => {
    if(isMyProfessional) {
        if(formType == "ADD") return [`Step 1: Select Specialty (s)`, `Step 2: ${professionalType} Details.`, `Step 3: ${professionalType} Contact & Address Information.`];
        else if(formType == "EDIT") return ["Select Specialty (s)", "Personal Details", `Contact & Address Information`];
        else return [`Select Specialty (s)`, "Personal Details", "Contact & Address Information"];
    }
    if(formType == "ADD") {
        return [``, `Step 1: ${professionalType} Details.`, `Step 2: ${professionalType} Contact & Address Information.`]
    } else if(formType == "EDIT") {
        return [``, `Personal Details`, `Contact & Address Information`]
    } else {
        return [``, "Personal Details", "Contact & Address Information"]
    }
}

const allkeys = ["0", "1", "2"]


export const sideContent = 'Select your professional specialty field.';
export const personalDetailConcent = 'Your professional personal information helps us tailor our services to your unique needs. Please ensure all details are accurate as they form the basis for personalized advice and recommendations.';
export const contactDetailContent = 'Accurate contact and address information is essential for effective communication and service delivery. Keep these details current to ensure your professional receive important updates and support.';

const ProfessionalForm = ( props ) => {
    const { primaryUserId, spouseUserId, loggedInUserId , subtenantId, roleUserId, spouseFullName,spouseFirstName,primaryMemberFirstName, isPrimaryMemberMaritalStatus, primaryMemberFullName, _spousePartner} = usePrimaryUserId();
    const isMyProfessional = (props.proSerDescId == '' && props.proTypeId == '') ? true : false;
    const [professionalUserId, setprofessionalUserId] = useState(0);
    const [tempProfessionalUserId, setTempProfessionalUserId] = useState(0);
    const [physicianSpecialCase, setPhysicianSpecialCase] = useState(false);
    const [disablePhysician, setDisablePhysician] = useState(false);
    const [currentStep, setcurrentStep] = useState(isMyProfessional ? 0 : 1);
    const [activeKeys, setActiveKeys] = useState(["1"]);
    const [saveActionType, setsaveActionType] = useState("");

    const profCategoryRef = useRef();
    const formControlRef = useRef();
    const formMetaDataControlRef = useRef();
    const contactControlRef = useRef();
    const otherSpecialistRef = useRef();
    const mainOtherSpecialistRef =useRef();
    const otherBusinessTypeRef = useRef();
    const allCombiOfSelectedProCatRef = useRef([]);
    const iDontHaveRef = useRef(null);
    const editProfDetails = props.editProfDetails;
    const toUpdate = props.formType == "EDIT" ? true : false;
    const isPrimaryProf = [10, 11].includes(parseInt(props.proTypeId)) ? true : false;
    const firstUserId = props?.currentUserId;
    const secondUserId = (firstUserId == primaryUserId) ? spouseUserId : primaryUserId;
    const { formData, formMetaData, spousePrimaryPhysAdded } = useAppSelector(selectProfessional);
    // const hideSameAs = ((isPrimaryProf && (firstUserId != primaryUserId)) || (props.proTypeId == "10" && toUpdate == true) || (!isPrimaryMemberMaritalStatus) || (props?.proTypeId == "10" && spousePrimaryPhysAdded == true)); // if you also want to hide for primaryProf spouse form and for physician update form
    const { setWarning ,setPageCategoryId, setPageTypeId} = useContext(globalContext);
    const dispatch = useAppDispatch();
    const { profSubTypes, businessTypeList, profTypes, addedPrimaryProfList } = useAppSelector(selectProfessional);
    const inputKeyBase = tempProfessionalUserId || professionalUserId;
    const professionalSideContent = `Your ${props?.selectedUser == 2 ? "spouse's" : "" } professional personal information helps us tailor our services to your ${props?.selectedUser == 2 ? "spouse's" : "" } unique needs. Please ensure all details are accurate as they form the basis for personalized advice and recommendations.`;
    const professionalAddressContactSideContent = `Accurate contact and address information is essential for effective communication and service delivery. Keep these details current to ensure your ${props?.selectedUser == 2 ? "spouse's" : "" } professional receive important updates and support.`
    useEffect (() => {
        setprofessionalUserId(editProfDetails?.professionalUserId || 0);
        setcurrentStep(isMyProfessional ? 0 : 1);
        allCombiOfSelectedProCatRef.current = [];

        ifNeededCreateTempProfUserId();
        return () => {
            props.setpageAction("VIEW")
            resetFormState()
        }
    }, [props.currentUserId, editProfDetails?.professionalUserId])

    useEffect(() => {
        if(physicianSpecialCase) {
            onFormSubmit(saveActionType);
            setPhysicianSpecialCase(false);
        }
    }, [professionalUserId])
    ////////////////// attorny notes 
    useEffect(() => {
        const typeIdMapping = {10: 2, 11: 3, 16: 8, 17: 9, 4: 10, 1: 12, 3: 13, 12: 14, 13: 29, 45: 30, 46: 31};          
        props.proTypeId === ""  ? setPageCategoryId(7)  : setPageTypeId(typeIdMapping[props.proTypeId]);

      return ()=>{
          if (["11", "10", "16", "17", "4", "1", "3", "12", "13", "45", "46", ""].includes(props.proTypeId)) {
              props.proTypeId === "" ? setPageCategoryId(null) : setPageTypeId(null);
            }              
     }
  }, [props])
  ///////////////////////////////////////

    const hideSameAs = useMemo(() => {
        const firstUserPrimryProf = addedPrimaryProfList[props?.selectedUser == 1 ? 1 : 2]?.find(ele => ele?.is_Primary);
        const secondUserePrimryProf = addedPrimaryProfList[props?.selectedUser == 1 ? 2 : 1]?.find(ele => ele?.is_Primary);
        const spouseHaveDiffProf = isNullUndefine(secondUserePrimryProf?.primary_Care_Id) ? false : firstUserPrimryProf?.primary_Care_Id != secondUserePrimryProf?.primary_Care_Id;
        return (!isPrimaryMemberMaritalStatus) || (props?.proTypeId == "10" && spouseHaveDiffProf == true)
    }, [isPrimaryMemberMaritalStatus, addedPrimaryProfList]);

    const ifNeededCreateTempProfUserId = () => {
        // if(props.proTypeId == '10' && editProfDetails?.sameAsSpouse == true && firstUserId == spouseUserId) createTempProfessional();
        // else if(props?.formType == "ADD") createTempProfessional();
        if(props?.formType == "ADD") createTempProfessional();
        else setTempProfessionalUserId(0);
    }

    const isValidInputs = () => {
        let isValidForm = true;
        {
            const isValid = formControlRef?.current?.validateFormData();
            if(isValid == false) openAccordian('1');
            isValidForm = isValidForm && isValid;
        }
        if (isMyProfessional) {
            const isValid = profCategoryRef?.current?.validateSelection();
            if(isValid == false) openAccordian('0');
            isValidForm = isValidForm && isValid;
        }
        return isValidForm;
    }

    const openAccordian = ( id ) => {
        if(activeKeys?.some(ele => ele == id) == false) {
            setActiveKeys(oldState => [...oldState, id]);
        }
    }

    konsole.log("erwvffsdv", activeKeys);

    const onFormSubmit = async (move2Next) => { // move2Next CAN BE ONE OF - [ CONTINUE-LATER, UPDATE, ADD-ANOTHER, NEXT-CONTACT, NEXT-SECTION ]
        if (isValidInputs() != true) return;

        konsole.log("ssadsa", formControlRef?.current?.getterFormData());

        // if(props.proTypeId == '10' && physicianSpecialCase == false && editProfDetails?.sameAsSpouse == true && firstUserId == spouseUserId) return handlePhysicianSpecialCase(move2Next); // make physician of spouse as different professional

        // if (currentStep == 1 || move2Next == "UPDATE") {
            if (toUpdate == true || (toUpdate == false && !professionalUserId)) await postProfessionalForm();
        // }
        // if (currentStep == 2 || move2Next == "UPDATE") {
            useLoader(true);
            // if(props.formType == "ADD") await postProfessionalStep2()
            // else if(props.formType == "EDIT") await putProfessionalStep2();
            const isValidaateStateBackaddress = await contactControlRef?.current?.handleSubmit();
            const isValidaateStateBackContact = await contactControlRef?.current?.submitContact();
            konsole.log("professional_address_contact", isValidaateStateBackaddress, isValidaateStateBackContact);
            if (!isValidaateStateBackaddress?.isActive || !isValidaateStateBackContact?.isActive) {
                useLoader(false);
                return;
            }
            // konsole.log("sbjkda-contact", isValidaateStateBackContact);
            // if (!isValidaateStateBackContact?.isActive) {
            //     useLoader(false);
            //     return;
            // }
            useLoader(false);
        // }

        konsole.log("dnvjks", move2Next)

        // Success Toaster
        if (toUpdate) {
            setWarning("successfully", "Successfully updated data", "Your data have been updated successfully.");
        } else {
            setWarning("successfully", "Successfully saved data", "Your data have been saved successfully.");
        }

        
        $AHelper.$scroll2Top()

        // NEXT STEP SETTER
        navigateUser(move2Next);
    }

    const navigateUser = ( move2Next ) => {
        switch (move2Next) {
            case 'CONTINUE-LATER': {
                props?.setpageAction("VIEW");
                return;
            }
            case 'ADD-ANOTHER': {                
                // props?.setpageAction("VIEW");
                resetFormState()
                setcurrentStep(isMyProfessional ? 0 : 1);
                props.setEditProfDetails({})
                setprofessionalUserId(0);
                ifNeededCreateTempProfUserId();
                setActiveKeys(["1"]);
                return;
            }
            case 'NEXT-PERSONAL': {
                setcurrentStep(1);
                return;
            }
            case 'NEXT-CONTACT': {
                setcurrentStep(2);
                return;
            }
            case 'NEXT-SECTION': {
                if(firstUserId == primaryUserId && isPrimaryMemberMaritalStatus && !formData.sameAsSpouse) {
                    props?.setpageAction("VIEW", 2);
                }
                else props.handleActiveTabMain(props.nextPageId)
                return;
            }
            case 'UPDATE': {
                props?.setpageAction("VIEW");
                return;
            }
            default: konsole.log("no-action-btn");
        }
    }

    const createTempProfessional = async () => {
        const tempMemberResponse = await upsertMember(true);
        const tempUserId = tempMemberResponse?.data?.data?.member?.userId;

        if(props?.proTypeId == "10" && props?.formType == "EDIT") {
            const curProfessionalUserId = editProfDetails?.professionalUserId;

            const currentAddress = await getApiCall('GET', $Service_Url.getAllAddress + curProfessionalUserId, '');
            const currentContacts = await getApiCall('GET', $Service_Url.getAllContactOtherPath + curProfessionalUserId, '');
            konsole.log("vhjvhj", tempUserId, currentAddress?.addresses?.[0], currentContacts?.contact);

            if(currentContacts?.contact) {
                const updateJson = {
                    "userId": tempUserId,
                    "activityTypeId": "4",
                    "contact": currentContacts?.contact
                }
                await postApiCall("POST", $Service_Url?.postAddContactWithOther, updateJson);
            }

            if(currentAddress?.addresses?.[0]) {
                const addressJosn = {
                    userId: tempUserId,
                    address: currentAddress?.addresses?.[0]
                }
                await postApiCall("POST", $Service_Url.postAddAddress, addressJosn);
            }
        }

        setTempProfessionalUserId(tempUserId);
    }

    const handlePhysicianSpecialCase = async ( move2Next ) => {
        // Delete mapping of professional with spouse;
        // setprofessionalUserId(0);
        setsaveActionType(move2Next)
        setPhysicianSpecialCase(true);
        setprofessionalUserId(0);
        // debugger;
        const spouseUserPrimaryCareMapId = editProfDetails?.primaryProfDetails?.userPrimaryCareMaps?.find(ele => ele.userId == firstUserId)?.userPrimaryCareMapId;
        await mapPrimaryProf("PUT", {
            userPrimaryCareMapId: spouseUserPrimaryCareMapId,
            isDeleted: true,
            remarks: "",
            updatedBy: loggedInUserId
        })

        konsole.log("casbjc", professionalUserId);
    }

    const resetFormState = () => {
        dispatch(setBothFormData({}));
        dispatch(setBothMetaData({}));
    }

    const postProfessionalForm = async () => {
        const { sameAsSpouse, businessTypeId } = formData;
        // konsole.log("adbkjda", sameAsSpouse);

        useLoader(true);
        // ADD AND UPDATE MEMBER DETAILS AND GET USERID AS REPONSE
        const addMemberResponse = await upsertMember();
        konsole.log("com_prof fkjbsf", addMemberResponse);
        if(addMemberResponse == "err") return setWarning('warning', 'Warning', "Something went wrong!"); // error required here
        const _professionalUserId = addMemberResponse?.data?.data?.member?.userId;

        // ADD AND UPDATE PROFESSIONAL DETAILS AND GET PROUSERID
        // AND ADD NEW PROCATEGORIES TO MAP WITH THE PROFESSIONAL UNIVERSALLY AND GET PROCATID FOR EACH PROCATEGORIES
        const upsertProfResponse = await upsertProfessional(_professionalUserId);
        konsole.log("com_prof eakjbk", upsertProfResponse);
        if(upsertProfResponse == "err") return setWarning('warning', 'Warning', "Something went wrong!");

        const { proUserId, proCategories } = upsertProfResponse?.data?.data?.[0] ?? { proUserId: editProfDetails.proUserId };
        if(businessTypeId == "999999") otherBusinessTypeRef?.current?.saveHandleOther(proUserId, _professionalUserId);
        formMetaDataControlRef?.current?.upsertMetaData(_professionalUserId);

        let proCatIdOfOtherSpecialist = proCategories?.find(ele => ele.proSubTypeId == 999999)?.proCatId ?? editProfDetails?.allProCatList?.find(ele => ele?.proSubTypeId == "999999")?.proCatId;
        let proCatIdOfMainOtherSpecialist = proCategories?.find(ele => ele.proTypeId == 999999)?.proCatId ?? editProfDetails?.allProCatList?.find(ele => ele?.proTypeId == "999999")?.proCatId;

        if (proCatIdOfOtherSpecialist) { otherSpecialistRef?.current?.saveHandleOther(proCatIdOfOtherSpecialist, _professionalUserId);}
        if (proCatIdOfMainOtherSpecialist) { mainOtherSpecialistRef?.current?.saveHandleOther(proCatIdOfMainOtherSpecialist, _professionalUserId);}

        await checkSpecialistCondition(_professionalUserId, proUserId);

        let primaryCareId;
        // if (isPrimaryProf) primaryCareId = await upsertPrimaryProf(proUserId, _professionalUserId, sameAsSpouse);
        useLoader(false);

        // Update instruction if needed
        if(toUpdate == true && (isMyProfessional || (editProfDetails?.allProCatList?.[0]?.instructionsToAgent != formData.instructionsToAgent))) {
            await updateInstructionToAgent(editProfDetails?.allProCatList, editProfDetails?.spouseAllProCatList);
        }

        // MAP THE PROFESSIONAL(THEIR CATEGORY) WITH CLIENT AND GET USERPROID (FOR EACH PRO CATEGORY)
        // GIVE LIST OF PRO CATEGORIES THAT YOU WANT TO ADD AND DELETE (IF ALREADY ADDED)
        // THROUGH USING PROCATID AND MODIFING ISACTIVE VALUE
        if(((toUpdate == false || isMyProfessional || isPrimaryProf) && proCategories?.length) || physicianSpecialCase == true) {
            // if(isPrimaryProf) await mapPrimaryProfToClient(firstUserId, primaryCareId, null);
            let needToMapProcCats = proCategories?.map(ele => ({ ...ele, userProId: (isMyProfessional || (isPrimaryProf && firstUserId == spouseUserId && editProfDetails?.sameAsSpouse != sameAsSpouse )) ? 0 : editProfDetails?.userProId}));
            if(firstUserId == spouseUserId && sameAsSpouse == true) needToMapProcCats = needToMapProcCats?.filter(ele => ele?.proTypeId != '11' && !isPrimaryProf);
            await mapProfToUser(proUserId, _professionalUserId, needToMapProcCats, firstUserId);
        }
        
        const isPrimaryPhysician = getPrimaryCareMapItByProUserId(proUserId, editProfDetails?.sameAsSpouse == true ? primaryUserId : firstUserId);
        if(firstUserId == spouseUserId && editProfDetails?.sameAsSpouse != true && sameAsSpouse === true) {
            const allSpecialistTypesPrevAdded =  editProfDetails?.allProCatList?.filter(ele => ((ele?.proTypeId == "11" && ele.directlyMapped) || (ele?.proTypeId == "10" && isPrimaryPhysician?.is_Primary)))?.map(ele => ({
                userProId: ele?.userProId,
                deletedBy: loggedInUserId,
                userId: spouseUserId,
            })); 
            if(allSpecialistTypesPrevAdded?.length) deleteProfessional(allSpecialistTypesPrevAdded);
        }

        if(isMyProfessional && firstUserId == spouseUserId && editProfDetails?.sameAsSpouse == true && sameAsSpouse === false) {

            const primaryUsersAlreadyAddedSpecialistCatIds =  editProfDetails?.allProCatList?.filter(ele => ele?.proTypeId == "11" || ( ele?.proTypeId == "10" && (isPrimaryPhysician?.is_Primary == true) ) )?.map(ele => ({...ele, userProId: 0}));
            if(primaryUsersAlreadyAddedSpecialistCatIds?.length) await mapProfToUser(proUserId, _professionalUserId, primaryUsersAlreadyAddedSpecialistCatIds, firstUserId);
        }
        
        // START OF => LOGIC FOR (UN)MAPPING PROFESSIONAL TO SPOUSE
        konsole.log("bbkb", editProfDetails?.spouseAllProCatList, editProfDetails?.sameAsSpouse , sameAsSpouse );

        if(editProfDetails?.sameAsSpouse != true && sameAsSpouse === true || (sameAsSpouse === true && isMyProfessional)) {
            // SPOUSE PROFESSIONAL MAPPING LOGIC
            const noNeedToAddPev = editProfDetails?.sameAsSpouse == true && sameAsSpouse == true && isMyProfessional;
            // const isPrimaryPhysician = getPrimaryCareMapItByProUserId(proUserId, editProfDetails?.sameAsSpouse == true ? primaryUserId : firstUserId);
            // const oldProCates  = editProfDetails?.allProCatList?.map(ele => ({...ele, userProId: 0})) ?? [];
            
            const oldProCates  = editProfDetails?.allProCatList?.filter(ele => allCombiOfSelectedProCatRef?.current?.some(ele2 => ele.proSerDescId == ele2.proSerDescId && ele.proTypeId == ele2.proTypeId && (ele.proSubTypeId == ele2.proSubTypeId || (ele2.proSubTypeId == null && ele.proSubTypeId == 0))) == true)?.map(ele => ({...ele, userProId: 0})) ?? [];
            let proCategoryToAdd  = 
                noNeedToAddPev ? 
                    proCategories?.length ? 
                        proCategories 
                        : 
                        [] 
                    : 
                    proCategories?.length ? 
                        [...oldProCates, ...proCategories] 
                        : 
                        [...oldProCates];
            // if(isPrimaryProf) await mapPrimaryProfToClient(secondUserId, primaryCareId, firstUserId);
            if(firstUserId == primaryUserId) proCategoryToAdd = proCategoryToAdd?.filter(ele => ele?.proTypeId != "11" && !(ele?.proTypeId == "10" && isNotValidNullUndefile(isPrimaryPhysician?.is_Primary)) && !isPrimaryProf);
            // if(proCategoryToAdd?.length && (!isPrimaryProf)) {
            if(proCategoryToAdd?.length && (!false)) {
                await mapProfToUser(proUserId, _professionalUserId, proCategoryToAdd, secondUserId);
            }
        } else if(editProfDetails?.sameAsSpouse == true && sameAsSpouse == false) {
            // SPOUSE PROFESSIONAL UNMAPPING LOGIC 
            useLoader(true)
            // if (isPrimaryProf) {
            {
                const dataToDeleteFromSpouse = editProfDetails?.spouseAllProCatList?.filter(ele => ele?.directlyMapped)?.map(ele => ({
                    deletedBy: loggedInUserId,
                    userProId: ele?.userProId,
                    userId: secondUserId,
                }))
                await deleteProfessional(dataToDeleteFromSpouse)
            }
            useLoader(false);
        }
        setprofessionalUserId(_professionalUserId);

        if(isMyProfessional && toUpdate == true) await checkForDeleteProcategory();  
    }

    /**
     * USED TO CREATE/UPDATE THE MEMBER/USER
     * @returns API RESPONSE/ERROR IF ADD ELSE VOID FOR UPDATE
     */
    const upsertMember = async ( createNewUser ) => {
        const { fName, lName } = formData;
        const curProfessionalUserId = tempProfessionalUserId ? tempProfessionalUserId : professionalUserId;
        // konsole.log("adbkjda", fName, lName);

        const method = (curProfessionalUserId !== 0 && createNewUser != true) ? "PUT" : "POST";
        let inputData = {
            fName,
            lName: lName ?? '',
            mName: "",
            isPrimary: false,
            subtenantId,
            updatedBy: loggedInUserId,
            userId: (curProfessionalUserId ? curProfessionalUserId : undefined),
            memberRelationship: null,
        }
        if (method == "POST") {
            inputData = { ...inputData, createdBy: loggedInUserId, updatedBy: undefined };
        }
        inputData = { ...inputData, memberRelationship: undefined };
        const addMemberResponse = await postApiCall(method, method == "POST" ? $Service_Url.postAddMember : $Service_Url.putUpdateMember, inputData);
        konsole.log("vkjsbds", addMemberResponse);
        return addMemberResponse;
    }

    /**
     * USED TO ADD/UPDATE PROFESSIONAL DETAILS AND ADD PROCATEGORIES
     * @returns API RESPONSE/ERROR IF ADD ELSE VOID FOR UPDATE
     */
    const upsertProfessional = async ( _professionaUserId ) => {
        const {specialty, businessName, businessTypeId, websiteLink } = formData;
        const proCategoryList = isMyProfessional ? getMyProfessTypes('ADD') : getFinalProCategoryList(specialty);
        
        // if(!proCategoryList?.length > 0) return;
        const inputData = $JsonHelper.createUprtProfJson({
            proUserId: physicianSpecialCase == false ? (editProfDetails?.proUserId || 0) : 0,
            userId: _professionaUserId,
            upsertedBy: loggedInUserId,
            proCategories: (proCategoryList?.length > 0) ? proCategoryList : [{...editProfDetails.allProCatList[0], proSubTypeId: editProfDetails.allProCatList[0]?.proSubTypeId || null}],
            businessName,
            businessTypeId,
            websiteLink,
            isGenAuth: true,
        })
        const response = await postApiCall("POST", $Service_Url.postProfessionalUserMapping, inputData)
        return (proCategoryList?.length > 0) ? response : undefined;
    }

    /**
     * USER TO MAP PROFFESONAL TO CLIENT
     * @param {Number} _proUserId 
     * @param {String} _professionalUserId 
     * @param {Array} _profCats2Add LIST OF PROFESSIONAL CATEGORIES THAT ARE NEED TO BE MAPPED
     */
    const mapProfToUser = async (_proUserId, _professionalUserId, _profCats2Add, mapForUserId) => {
        useLoader(true);
        const { instructionsToAgent } = formData;
        const inputData = _profCats2Add?.map(proCatObj => {
            return {
                userProId: physicianSpecialCase == false ? (proCatObj?.userProId ?? 0) : 0,
                proUserId: _proUserId,
                proCatId: proCatObj?.proCatId,
                userId: mapForUserId,
                lpoStatus: false,
                upsertedBy: loggedInUserId,
                instructionsToAgent: instructionsToAgent,
                isActive: true
            }
        })

        const response = await postApiCall("POST", $Service_Url.postProfessionalUser, inputData);
        useLoader(false);
        return response;
    }

    const checkSpecialistCondition = async ( newProfessionaluserId, proUserId ) => {
        const { proTypeSelected, sameAsSpouse } = formData;
        
        konsole.log("sbdvb", isMyProfessional, newProfessionaluserId, proTypeSelected?.[1]?.[11] , editProfDetails?.sameAsSpouse != true, sameAsSpouse != true );
        // if(isMyProfessional && newProfessionaluserId && proTypeSelected?.[1]?.[11] && (toUpdate != true || (editProfDetails?.sameAsSpouse != true) != (sameAsSpouse != true))) {
        let primaryCareDetails;
        if((isMyProfessional || isPrimaryProf) && newProfessionaluserId) {
            // let primaryCareId;
            // if(toUpdate) primaryCareId = await getPrimaryCareMapId(proUserId, editProfDetails?.sameAsSpouse == true ? primaryUserId : firstUserId);
            if(toUpdate) primaryCareDetails = await getPrimaryCareMapItByProUserId(proUserId, editProfDetails?.sameAsSpouse == true ? primaryUserId : firstUserId);
            if(primaryCareDetails?.primary_Care_Id) deletePrimaryCareProf(primaryCareDetails?.primary_Care_Id, editProfDetails?.sameAsSpouse == true ? primaryUserId : firstUserId, loggedInUserId);
        }
        if((isMyProfessional || isPrimaryProf) && newProfessionaluserId && (proTypeSelected?.[1]?.[11] || (proTypeSelected?.[1]?.[10] && primaryCareDetails?.is_Primary) || isPrimaryProf)) {
            let primaryCareId; 
            primaryCareId = await upsertPrimaryProf(proUserId, newProfessionaluserId, sameAsSpouse, true, sameAsSpouse ? primaryUserId : firstUserId, primaryCareDetails);
            await mapPrimaryProfToClient(sameAsSpouse ? primaryUserId : firstUserId, primaryCareId);
            if(sameAsSpouse == true) await mapPrimaryProfToClient(sameAsSpouse ? spouseUserId : secondUserId, primaryCareId, sameAsSpouse ? primaryUserId : firstUserId);
        }
    }

    const getPrimaryCareMapItByProUserId = ( proUserId, userId ) => {
        return addedPrimaryProfList?.[userId == primaryUserId ? '1' : '2']?.find(ele => ele?.pro_User_Id == proUserId) ?? {};
    }

    const upsertPrimaryProf = async (proUserId, professionalUserId, sameAsSpouse, toPost, mapToUserId, oldDetails) => {
        // debugger;
        const JSONObject = $JsonHelper.createPrimaryProf({
            userId: mapToUserId ? mapToUserId : (sameAsSpouse == true) ? primaryUserId : firstUserId,
            professionalUserId: professionalUserId,
            isPhysician: props.proTypeId == '10' || oldDetails?.is_Primary || false,
            isGCM: formMetaData?.is_GCM ?? oldDetails?.is_GCM, // ans must from question
            isGCMCertified: formMetaData?.is_GCM_Certified ?? oldDetails?.is_GCM_Certified, // ans must from question
            proUserId: proUserId,
            isHappy: formMetaData?.happy_With_Service ?? oldDetails?.happy_With_Service, // ans must from question
            visitDuration: formMetaData?.visit_Duration ?? oldDetails?.visit_Duration, // ans must from question
            sameAsSpouse: sameAsSpouse,
            createdBy: toUpdate && toPost != true && physicianSpecialCase == false ? undefined : loggedInUserId,
            updatedBy: toUpdate && toPost != true && physicianSpecialCase == false ? loggedInUserId : undefined,
            doc_User_Id: toUpdate && toPost != true && physicianSpecialCase == false ? editProfDetails?.primaryProfDetails?.doc_User_Id : oldDetails?.doc_User_Id,
            primary_Care_Id: toUpdate && toPost != true && physicianSpecialCase == false ? editProfDetails?.primaryProfDetails?.primary_Care_Id : oldDetails?.primary_Care_Id,
        })
        return await primaryProfUpsert(toUpdate && toPost != true && physicianSpecialCase == false ? "PUT" : "POST", JSONObject).then(res => {
            if (res == "err") return null;
            return res?.data?.data?.physicians?.[0]?.primary_Care_Id;
        })
    }

    const mapPrimaryProfToClient = async (userId, primaryCareId, sameAsUserId,) => {
        useLoader(true)
        const JSONObject = {
            userId: userId,
            primaryCareId: primaryCareId,
            sameInsUserId: sameAsUserId,
            createdBy: loggedInUserId,
        }
        await mapPrimaryProf("POST", JSONObject);
        useLoader(false);
    }

    const getFinalProCategoryList = (specialty) => {
        const { proTypeId, proSerDescId } = props;
        if (proTypeId == "") {
            return ['no data added for proservice provider'];
        } else {
            return [{
                proCatId: physicianSpecialCase == false ? (editProfDetails?.proCatId ?? 0) : 0,
                proSerDescId: editProfDetails?.proSerDescId ?? parseInt(proSerDescId),
                proTypeId: editProfDetails?.proTypeId ?? parseInt(proTypeId),
                proSubTypeId: specialty || undefined,
            }]
        }
    }

    const getMyProfessTypes = ( getFor ) => {
        const allProCats = editProfDetails?.allProCatList;
        const { selectedProSerDescIds, proTypeSelected, proSubTypeSelected } = formData;
        let allCombinations = [];
        
        if(!selectedProSerDescIds?.length) return [];
        for(let i = 0; i < selectedProSerDescIds?.length; i++) {
            if(selectedProSerDescIds[i].isChecked != true) continue;

            const curProSerDescId = selectedProSerDescIds[i].value;

            const neededProTypes = proTypeSelected?.[curProSerDescId] ? Object.entries(proTypeSelected?.[curProSerDescId])?.filter(ele => ele[1])?.map(ele => ele[0]) : [];
            if(!neededProTypes?.length) continue;

            for(let j = 0; j < neededProTypes?.length; j++) {
                const curProTypeId = neededProTypes[j];
                const neededProSubTypes = proSubTypeSelected?.[curProTypeId] ? Object.entries(proSubTypeSelected?.[curProTypeId])?.filter(ele => ele[1])?.map(ele => ele[0]) : [];

                if(!neededProSubTypes?.length) {
                    // if(profSubTypes?.some(ele => ele.proTypeId == curProTypeId)) continue;
                    // else {
                        allCombinations.push({
                            proSerDescId: Number(curProSerDescId),
                            proTypeId: Number(curProTypeId),
                            proSubTypeId: null,
                            proCatId: 0,
                            // isActive: true,
                        })    
                    // } 
                    continue;
                }

                for(let k = 0; k < neededProSubTypes?.length; k++) {
                    allCombinations.push({
                        proSerDescId: Number(curProSerDescId),
                        proTypeId: Number(curProTypeId),
                        proSubTypeId: Number(neededProSubTypes[k]),
                        proCatId: 0,
                        // isActive: true,
                    })
                }

            }
        }

        konsole.log("dklfnlbkd-allProCats", allProCats)
        konsole.log("dklfnlbkd-allCombinations", allCombinations)
        allCombiOfSelectedProCatRef.current = allCombinations;

        if(toUpdate == true) {
            const filteredArr = allCombinations?.filter(ele => allProCats?.some(ele2 => ele.proSerDescId == ele2.proSerDescId && ele.proTypeId == ele2.proTypeId && (ele.proSubTypeId == ele2.proSubTypeId || (ele.proSubTypeId == null && ele2.proSubTypeId == 0))) == false);
            konsole.log("dklfnlbkd-filteredArr", filteredArr)
            return filteredArr;
        }
        
        return allCombinations;
    }

    const checkForDeleteProcategory = async () => {
        const { sameAsSpouse } = formData;
        const primaryAllProCats = editProfDetails?.allProCatList?.filter(ele => ele?.directlyMapped) ?? [];
        const spouseAllProCats = editProfDetails?.spouseAllProCatList?.filter(ele => ele?.directlyMapped) ?? [];
        const allCombiOfSelectedProCat = allCombiOfSelectedProCatRef.current;

        konsole.log("dbkj", allCombiOfSelectedProCat);
        const primaryUnMapCates = 
            primaryAllProCats?.filter(ele => 
                allCombiOfSelectedProCat?.some(ele2 => ele.proSerDescId == ele2.proSerDescId && ele.proTypeId == ele2.proTypeId && (ele.proSubTypeId == ele2.proSubTypeId || (ele2.proSubTypeId == null && ele.proSubTypeId == 0))) == false
            )?.map(ele => ({
                deletedBy: loggedInUserId,
                userProId: ele?.userProId,
                userId: firstUserId,
            }));
        const spouseUnMapCates = 
            spouseAllProCats?.length ? 
                spouseAllProCats?.filter(ele => 
                    sameAsSpouse == false || allCombiOfSelectedProCat?.some(ele2 => ele.proSerDescId == ele2.proSerDescId && ele.proTypeId == ele2.proTypeId && (ele.proSubTypeId == ele2.proSubTypeId || (ele2.proSubTypeId == null && ele.proSubTypeId == 0))) == false
                )?.map(ele => ({
                    deletedBy: loggedInUserId,
                    userProId: ele?.userProId,
                    userId: secondUserId,
                }))
                :
                [];

        konsole.log("myproftodelete", primaryUnMapCates, spouseUnMapCates, allCombiOfSelectedProCat);
        await deleteProfessional([...primaryUnMapCates, ...spouseUnMapCates]);
    }

    const updateInstructionToAgent = async ( firstUserProcatList, secondUserProcatList ) => {
        const finalInstruction = formData.instructionsToAgent;
        const finalList = [...(firstUserProcatList ?? []), ...(secondUserProcatList ?? [])].filter(ele => ele.directlyMapped).map(ele => ({
            ...ele, 
            instructionsToAgent: finalInstruction,
            isActive: true,
            upsertedBy: loggedInUserId
        }));

        const response = await postApiCall("POST", $Service_Url.postProfessionalUser, finalList);
        konsole.log("sdbkjsabjk", response, finalList, finalInstruction);
    }

    const goToPreviousPage = () => {
        if(currentStep == 2) setcurrentStep(1);
        else if(currentStep == 1 && isMyProfessional) setcurrentStep(0);
        else {
            props.setpageAction('VIEW')
            resetFormState()
        }
    }

    const handleAccordionClick = () => {
        setActiveKeys(activeKeys?.length == 0 ? allkeys : []);
    };
    
    const handleAccordionBodyClick = (key) => {
        setActiveKeys(activeKeys?.includes(key) ? [] : [String(key)]);
    };


    // DERIVED STATES
    const formTypeSteps = getProfessionalFormSteps("EDIT", props.profTitle, isMyProfessional);
    const formSteps = getProfessionalFormSteps(undefined , undefined, isMyProfessional);
    // const disapearProfForm = 

    return (
        <div id={`professional-main-id-${isMyProfessional ? 'isMyProfessional' : ''}`} className='professional-form'>
            {
                <>
                    {(props?.proTypeId != "10") && <Row className="progress-container mb-1 previous-btn">
                        <div>
                            <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer" onClick={() => {
                            resetFormState();
                            props.setpageAction("VIEW");
                        }} />
                            <span className='ms-1'onClick={() => {
                            resetFormState();
                            props.setpageAction("VIEW");
                        }} > Previous</span>
                        </div>
                    </Row>}
                    <div className='form-body border-0 '>
                 

                            <Row>

                            <div className=''>
                                <CustomAccordion 
                                    currentActiveKey={currentStep}
                                    isExpendAllbtn={true}
                                    handleActiveKeys={handleAccordionClick} 
                                    activeKeys={activeKeys}
                                    allkeys={allkeys}
                                    activekey={activeKeys}
                                    header={props?.proTypeId != "10" ? <p className='heading-text'>{props?.formType == "ADD" ? 'Add' : 'Edit'} {props.profTitle}</p> : <div className='w-100'>
                                        <span className='heading-of-sub-side-links'>Health Information</span>
                                        <p className='heading-of-sub-side-links-2 mt-2'>{(props?.formType == "ADD" ? "Add " : "View and Edit ") + props.profSubTitle}</p>
                                        <div style={{width: '100%', borderBottom: '1px solid #F0F0F0', marginTop: '10px'}}></div>
                                    </div>}
                                >
                                        {props?.proTypeId == "10" && isPrimaryMemberMaritalStatus && <div className="d-flex align-items-end justify-content-end" style={{ margin: `${[10].includes(Number(props?.proTypeId)) ? '-72px' : '-62px'} 73px 24px` }}>
                                            {/* <p className="me-2">View:</p> */}
                                            <div className="btn-div addBorderToToggleButton ms-auto" >
                                                <button className={`view-btn ${props?.selectedUser == "1" ? "active selectedToglleBorder" : ""}`} onClick={()=>props?.setselectedUser('1')}>{primaryMemberFirstName ?  primaryMemberFirstName : "My"} </button>
                                                <button className={`view-btn ${props?.selectedUser == "2" ? "active selectedToglleBorder" : ""}`} onClick={()=>props?.setselectedUser('2')}>{spouseFirstName ? spouseFirstName : _spousePartner} </button>
                                            </div>
                                        </div>}
                                        {((props.proTypeId == '10') && props.iDontHaveOneFormLabels?.length > 0) && <div className='pt-3' ><IDontHaveOne key={props.profTitle} profTitle={"Primary care physician"} userId={firstUserId} formLabelIds={props.iDontHaveOneFormLabels} ref={iDontHaveRef} disable={props?.editProfDetails?.fName?.length > 0} setDisablePhysician={setDisablePhysician} /></div>}
                                    <div className='d-flex'>
                                    {isMyProfessional && <Col xs={2} className='me-2' style={{minWidth: '175px', borderRight: '1px solid #F0F0F0', borderBottom: '1px solid #F0F0F0'}} >
                                        <div className='mt-2 align-item-center'>
                                        <p className='section-title'>
                                            {formTypeSteps[0]} <OverlayTrigger className="ms-3 numnumnum" placement="bottom" overlay={<Tooltip id='CustomAccordianEye'>{professionalSideContent}</Tooltip>} >
                                                <img src="/New/icons/iIconInfo.svg" width="15px" height="auto" className="p-0 m-0 mb-1" alt="Information" />
                                            </OverlayTrigger>
                                        </p>
                                        <ProfessionalCategorySelect 
                                            ref={profCategoryRef} 
                                            editProfDetails={props.editProfDetails}
                                            key={inputKeyBase + "proCategory"}
                                            normalView={false}
                                            formType = {props?.formType}
                                        />
                                        </div>
                                    </Col>}
                                    <Col className={disablePhysician ? 'disableView' : ''}> 
                                    {/* {isMyProfessional && <CustomAccordionBody 
                                        eventkey={'0'} 
                                        name={formTypeSteps[0]}
                                        setActiveKeys={setActiveKeys}
                                        // onClick={() => setcurrentStep(currentStep == 1 ? 0 : 1)}
                                 >
                                    <Row className='withDescription'>
                                        <Col className='heading-of-sub-side-links-2 pb-24' md={12} xl={3}>{professionalSideContent}</Col>
                                        <Col>
                                            <ProfessionalCategorySelect 
                                                ref={profCategoryRef} 
                                                editProfDetails={props.editProfDetails}
                                                key={inputKeyBase + "proCategory"}
                                                normalView={false}
                                            />
                                        </Col>
                                    </Row>
                                    </CustomAccordionBody>} */}

                                    <CustomAccordionBody  eventkey={'1'}  name={formTypeSteps[1]} setActiveKeys={() => handleAccordionBodyClick('1')}>

                                        <Row className='withDescription'>
                                            <Col className='pb-24' md={12} xl={3}>
                                            <p className='heading-of-sub-side-links-3' >{personalDetailConcent}</p></Col>
                                            <Col >
                                                <ProfessionalFormContent
                                                    startTabIndex={1}
                                                    ref={formControlRef}
                                                    formMetaDataControlRef={formMetaDataControlRef}
                                                    otherSpecialistRef={otherSpecialistRef}
                                                    mainOtherSpecialistRef={mainOtherSpecialistRef}
                                                    otherBusinessTypeRef={otherBusinessTypeRef}
                                                    editProfDetails={props.editProfDetails}
                                                    proTypeId={props.proTypeId}
                                                    proSerDescId={props.proSerDescId}
                                                    hideSameAs={hideSameAs}
                                                    proTypeName={props.profTitle}
                                                    metaLabels={props.metaDataFormLabels}
                                                    key={inputKeyBase + "profForm"}
                                                />
                                            </Col>
                                        </Row>
                                    </CustomAccordionBody>

                                    <CustomAccordionBody eventkey={'2'}  name={formTypeSteps[2]} setActiveKeys={() => handleAccordionBodyClick('2')} >
                                        <Row className='withDescription pt-3'>
                                            <Col className='heading-of-sub-side-links-3 pb-24' md={12} xl={3}>
                                            <p className='heading-of-sub-side-links-3'  >{contactDetailContent}</p></Col>
                                            <Col style={{minWidth: '70%'}}>
                                                <ContactAndAddress
                                                    startTabIndex={2 + 23}
                                                    refrencePage='professional'
                                                    userId={tempProfessionalUserId ? tempProfessionalUserId : professionalUserId}
                                                    ref={contactControlRef}
                                                    showType = "both"
                                                    isMandotry={false}
                                                    isShowingDescription={props?.proTypeId == '' ? false : true}
                                                    key={inputKeyBase + "proContact"}
                                                    formType={props?.formType}
                                                />
                                                {/* <UniversalAddress 
                                                 startTabIndex={2 + 23}
                                                 refrencePage='professional'
                                                 userId={tempProfessionalUserId ? tempProfessionalUserId : professionalUserId}
                                                 ref={contactControlRef}
                                                 showType = "both"
                                                 isMandotry={false}
                                                 isShowingDescription={props?.proTypeId == '' ? false : true}
                                                 key={inputKeyBase + "proContact"}
                                                 formType={props?.formType}
                                                /> */}
                                                </Col>
                                            </Row>


                                        </CustomAccordionBody>
                                    </Col>
                                    </div>
                                    </CustomAccordion>
                                </div>
                            </Row>
                            <Row style={{ marginTop: '24px' }}>
                                {toUpdate != true ? <div className='d-flex justify-content-between'>

                                    <div className={`${isMyProfessional ? 'profBtnMrgn offset-md-2 ps-2' : ''}`} >
                                    {(disablePhysician != true) && <CustomButton2
                                        tabIndex={2 + 23 + 18} label="Save & Continue later"
                                        onClick={() => onFormSubmit("CONTINUE-LATER")}
                                    />}
                                    </div>

                                    <div className={currentStep == 0 ? 'ms-auto' : ''} >
                                        {(props.proTypeId != '10') && <CustomButton3
                                            tabIndex={2 + 23 + 18}  label={'Save & Add Another'}
                                            onClick={() => onFormSubmit("ADD-ANOTHER")}
                                        />}
                                        <CustomButton
                                            tabIndex={2 + 23 + 18}  label={`${disablePhysician != true ? 'Save & ' : ''}Proceed to ${formData.sameAsSpouse ? props.nxtBtnName : (firstUserId == primaryUserId && isPrimaryMemberMaritalStatus ? spouseFirstName : props.nxtBtnName)}`}
                                            onClick={() => (disablePhysician != true) ? onFormSubmit("NEXT-SECTION") : navigateUser("NEXT-SECTION")}
                                        />
                                    </div>
                                </div>
                                :
                                <div className='d-flex flex-row-reverse justify-content-between'>
                                    {props?.proTypeId != "10" && <CustomButton
                                        tabIndex={2 + 23 + 18} onClick={() => onFormSubmit("UPDATE")}
                                        label={'Update'}
                                    />}
                                    {props?.proTypeId == "10" && <>
                                        <CustomButton
                                            tabIndex={2 + 23 + 18 +1} onClick={() => onFormSubmit("NEXT-SECTION")}
                                            label={`Save & Proceed to ${firstUserId == primaryUserId && isPrimaryMemberMaritalStatus ? spouseFirstName : props.nxtBtnName}`}
                                        />
                                        <CustomButton2
                                            tabIndex={2 + 23 + 18} onClick={() => onFormSubmit("UPDATE")}
                                            label={'Update & Continue Later'}
                                        />
                                    </>}
                                </div>}
                            </Row>
                        </div>

                    </>
            }
        </div>
    )
}

export default ProfessionalForm;