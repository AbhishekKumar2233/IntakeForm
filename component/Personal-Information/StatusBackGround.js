import React, { useEffect, useCallback, useState, useMemo, useImperativeHandle, forwardRef, useContext, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { CustomCheckBox, CustomSearchSelect, CustomRadio, CustomSelect, CustomTextarea } from '../Custom/CustomComponent';
import { fetchMaritalStatusType, fetchRelationType } from '../Redux/Reducers/apiSlice';
// import { setIsShowSpouseMaritalTile, fetchAllChildrenDetails } from '../Redux/Reducers/personalSlice';
import { useAppSelector, useAppDispatch } from '../Hooks/useRedux';
import { selectApi, selectPersonal } from '../Redux/Store/selectors';
import konsole from '../../components/control/Konsole';
import { $AHelper } from '../Helper/$AHelper';
// import { $JsonHelper } from '../Helper/$JsonHelper';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
// import { saveVeteranData, deleteVeteranData } from '../Redux/Reducers/apiSlice';
import { CustomInput } from '../Custom/CustomComponent';
import { useLoader } from '../utils/utils';
// import { saveOccuptionData } from '../Redux/Reducers/apiSlice';
import { $Msg_Calender, $Msg_StateBackground } from '../Helper/$MsgHelper';
import { headerNav } from './PersonalInformation';
import AssignNotification from '../Common/AssignNotification';
import VeternComponent from '../Common/VeternComponent';
import OccupationComponent from '../Common/OccupationComponent';
import DeceaseSpecialNeed from '../Common/DeceasedSpecialNeed/DeceaseSpecialNeed';
import CustomCalendar from '../Custom/CustomCalendar';
import { radioYesNoLabelWithBool } from '../Helper/Constant';
import { deceaseMemberStatusId, focusInputBox } from '../../components/Reusable/ReusableCom';
import { globalContext } from '../../pages/_app';
import Other from '../../components/asssets/Other';
import { ColumnRender } from './PersonalDetails';

const StatusBackGround = forwardRef((props, ref) => {
    const { isSideContent, userId, dataInfo, type, refrencePage, isChild,spouseDetailsObj,occcupationDetails} = props;
    const { primaryUserId, spouseUserId, primaryMemberFullName, isPrimaryMemberMaritalStatus, spouseFullName, loggedInUserId, _spousePartner ,primaryDetails, spouseDetails} = usePrimaryUserId();
    const lableName = props?.type == "ADD-EXTENDED-FAMILY" ? "spouse/partner" : _spousePartner;

    const dispatch = useAppDispatch();
    const apiData = useAppSelector(selectApi);
    const personalReducer = useAppSelector(selectPersonal)

    const { setWarningPhyscian, setWarning, returnTrue } = useContext(globalContext);

    // define ref 
    const primaryRelationRef = useRef(null)
    const spouseRelationRef = useRef(null)
    const veternRef = useRef(null);
    const occupationRef = useRef(null);
    const assignNotificationRef = useRef(null);
    const { allChildrenDetails, allChildrenlabelValue } = personalReducer;
    const { maritalStatusList, relationTypeList, childrenRelationList, extendedFriendRelationList, inLawRelationList,occcupationSavedData} = apiData;
    const [errMsg, setErrMsg] = useState('');
    const [noOfChildOnDecrease, setnoOfChildOnDecrease] = useState(null)
    const startingTabIndex = props?.startTabIndex ?? 0;
    const [isActiveForm, setisActiveForm] = useState(false)

//    konsole.log("lkkhkjgjhghjg",occcupationSavedData,occcupationDetails)
    // Fetch data on mount and when userId changes
    useEffect(() => {
        if (type !=headerNav[1].value) {
            fetchApi();
        }
        let isActivateforms = sessionStorage.getItem("isActivateform") 
        setisActiveForm(isActivateforms)
    }, []);
    useEffect(() => {
        if (props?.clearAll == true) {
            assignNotificationRef.current?.handleclear();
        }
    }, [props?.clearAll])


    // @@ this is for occupation update
    useEffect(() => {
        if (props.isChild == true && $AHelper.$isCheckNoDeceased(dataInfo.memberStatusId) && !isGrandChild && (props?.isChildSpouse != true)) {
            updateOccnProfBackground()
        }
    }, [dataInfo.dob, props?.isChild])
    const updateOccnProfBackground = () => {
        // konsole.log("dataInfo.dob", dataInfo.dob)
        const dateYear = $AHelper.$isNotNullUndefine(dataInfo.dob) ? $AHelper.checkIFMinor(dataInfo.dob) : '';
        // konsole.log("dateYear", dateYear);
        let value = (dateYear && dateYear < 18) ? 'Student' : '';
        if (occupationRef?.current) {
            occupationRef?.current?.updateOccupationProfessionalBackgroung(value);
        }
    }

    useEffect(()=>{
        konsole.log("noOfChildOnDecrease",noOfChildOnDecrease)
        if($AHelper?.$isNotNullUndefine(noOfChildOnDecrease)){
            props?.setPersonalDetails(prev => ({
                ...prev, ["noOfChildren"]: noOfChildOnDecrease
            }))
            setnoOfChildOnDecrease(null)
        }
    },[noOfChildOnDecrease,dataInfo.noOfChildren])
    // @@ this is for occupation update

    useImperativeHandle(ref, () => ({
        saveData, validateStateBackGround
    }));

    const filterMaritalStatusList = useMemo(() =>{
        konsole.log("filterMaritalStatusList");
        const currentMaritalStatus = maritalStatusList?.find((item) => item?.value == primaryDetails?.maritalStatusId)?.value

        if(refrencePage == 'PersonalInformation'){
            if(currentMaritalStatus == 1){
                return maritalStatusList?.filter(item => item?.value == 1 || item?.value == 4 || item?.value == 5) // Filter, because Married can only be updated to widow or divorced  
            }
            else if(currentMaritalStatus == 2){
                return maritalStatusList?.filter(item => item?.value == 2 || item?.value == 1 || item?.value == 3) // Filter, because Living Together can only be updated to Married or Single
            }
            else if(currentMaritalStatus == 3){
                return maritalStatusList?.filter(item => item?.value == 3 || item?.value == 1 || item?.value == 2) // Filter, because Single can only be updated to Married or Living Together
            }
            else if(currentMaritalStatus == 4){
                return maritalStatusList?.filter(item => item?.value == 4 || item?.value == 1 || item?.value == 2) // Filter, because Widow can only be updated to Married or Living Together
            }
            else if(currentMaritalStatus == 5){
                return maritalStatusList?.filter(item => item?.value == 5 || item?.value == 1 || item?.value == 2) // Filter, because Divorced can only be updated to Married or Living Together
            }
        }
        else{
            return maritalStatusList
        }
    }, [maritalStatusList, primaryDetails?.maritalStatusId]);

    //  error msg set null
    const hideErrMsg = (key, errMsg) => {
        if (!$AHelper.$isNotNullUndefine(errMsg?.key)) {
            setErrMsg(prev => ({ ...prev, [key]: '' }));
        }
    }

    // fetch api function
    const fetchApi = useCallback(() => {
        useLoader(true)
        apiCallIfNeed(maritalStatusList, fetchMaritalStatusType);
        apiCallIfNeed(relationTypeList, fetchRelationType)
        // apiCallIfNeed(allChildrenDetails, fetchAllChildrenDetails)
        useLoader(false)
    }, [maritalStatusList, relationTypeList, dispatch]);

    const apiCallIfNeed = useCallback((data, action) => {
        if (data.length === 0) {
            dispatch(action());
        }
    }, [dispatch]);

    const scrollOnNeed = (needScroll, isValid, inputId) => {
        if(needScroll && isValid == false) focusInputBox(inputId);
        return needScroll && isValid;
    }

    const validateStateBackGround = () => {

        let isMaritalValidate = true;
        let isValidateVetern = true;
        let isValidateOccupation = true;
        let relationshipTypeId = true;
        let rltnTypeWithSpouseId = true;
        let relativeUserId = true;
        let isBeneficiary = true;
        let isFiduciary = true;


        return new Promise(async (resolve, reject) => {

            let needScrolling = true;
            const { relationWithSpouse, relationWithPrimaryMember, maritalStatusIdErr, relationWIthChildOfGrandChild, isFiduciaryErr, isBeneficiaryErr } = $Msg_StateBackground
            if ((type !== headerNav[1].value && refrencePage == 'PersonalInformation') && (props.isChildSpouse != true)) {
                // let maritalStatusIdErr
                // Please select relation with spouse
                isMaritalValidate = $AHelper.$isValidateField(dataInfo?.maritalStatusId, 'maritalStatusId', maritalStatusIdErr, setErrMsg)
                needScrolling = scrollOnNeed(needScrolling, isMaritalValidate, 'maritalStatusId')
            }

            if (refrencePage !== 'PersonalInformation') {
                if ((dataInfo?.userId != primaryUserId) && (dataInfo?.userId != spouseUserId)) {
                    relationshipTypeId = $AHelper.$isValidateField(dataInfo?.memberRelationship?.relationshipTypeId, 'relationshipTypeId', relationWithPrimaryMember, setErrMsg)
                    needScrolling = scrollOnNeed(needScrolling, relationshipTypeId, 'relationshipTypeId')

                }
                if (isPrimaryMemberMaritalStatus && (dataInfo?.userId != primaryUserId) && (dataInfo?.userId != spouseUserId)) {
                    let msg = `Please select relation with ${_spousePartner}`
                    rltnTypeWithSpouseId = $AHelper.$isValidateField(dataInfo?.memberRelationship?.rltnTypeWithSpouseId, 'rltnTypeWithSpouseId', msg, setErrMsg)
                    needScrolling = scrollOnNeed(needScrolling, rltnTypeWithSpouseId, 'rltnTypeWithSpouseId')

                }
            }

            // if ((refrencePage == "AddFiduciaryBeneficiary" || refrencePage == "EditFiduciaryBeneficiary") && (dataInfo?.memberRelationship?.isFiduciary == false && dataInfo?.memberRelationship?.isBeneficiary == false)) {
            //     const isBeneficiaryValue = dataInfo?.memberRelationship?.isBeneficiary == false ? null : dataInfo?.memberRelationship?.isBeneficiary;
            //     const isFiduciaryValue = dataInfo?.memberRelationship?.isFiduciary == false ? null : dataInfo?.memberRelationship?.isFiduciary;
            //     isBeneficiary = $AHelper.$isValidateField(isBeneficiaryValue, 'isBeneficiaryErr', isBeneficiaryErr, setErrMsg)
            //     isFiduciary = $AHelper.$isValidateField(isFiduciaryValue, 'isFiduciaryErr', isFiduciaryErr, setErrMsg)
            // }
            konsole.log("@@dataInfomemberRelationship", dataInfo?.memberRelationship)
            if ((dataInfo?.memberRelationship?.relationshipTypeId == 3 || dataInfo?.memberRelationship?.rltnTypeWithSpouseId == 3) && (props.isChildSpouse != true)) {
                relativeUserId = $AHelper.$isValidateField(dataInfo?.memberRelationship?.relativeUserId, 'relativeUserId', relationWIthChildOfGrandChild, setErrMsg)
                needScrolling = scrollOnNeed(needScrolling, relativeUserId, 'relativeUserId')
            }

            konsole.log("isMaritalValidate", isMaritalValidate)
            // if (!(refrencePage === "AddFiduciaryBeneficiary" || refrencePage === "EditFiduciaryBeneficiary")) {
                if (refrencePage == 'PersonalInformation' && ($AHelper.$isCheckNoDeceased(dataInfo.memberStatusId)) && !isGrandChild && (props.isChildSpouse != true)) {
                    isValidateVetern = await veternRef?.current?.isValidate();
                    needScrolling = scrollOnNeed(needScrolling, isValidateVetern, 'VeternDivId')
                }
                 
                if ($AHelper.$isCheckNoDeceased(dataInfo.memberStatusId)  && !(["AddFiduciaryBeneficiary", "EditFiduciaryBeneficiary"].includes(refrencePage) && [primaryUserId, spouseUserId].includes(userId))) {
                   
                    isValidateOccupation = await occupationRef.current.isValidate();
                    needScrolling = scrollOnNeed(needScrolling, isValidateOccupation, 'OccupationDivId')
                }
                konsole.log("isValidateVetern", isValidateVetern)
            // }
         
            let result = isValidateOccupation && isValidateVetern && isMaritalValidate && rltnTypeWithSpouseId && relationshipTypeId && relativeUserId && (isFiduciary || isBeneficiary);
            resolve(result);
            // resolve(false)

        })

    }


    konsole.log("dataInfo?.memberRelationship?.relationshipTypeId", dataInfo?.memberRelationship)
    // @@ save Veteren Data
    const saveData = async (userId, member) => {

        return new Promise(async (resolve, reject) => {

            let promises = []
            // const callApi = [await getApiCall('GET', `${$Service_Url.getLegalDocument}${primaryUserId}/0`)]
            if (member?.memberRelationship?.relationshipTypeId == 999999) {
                await primaryRelationRef.current.saveHandleOther(member?.memberId);
                // promises.push(primaryRelationRef.current.saveHandleOther(member?.memberId))
            }
            if (member?.memberRelationship?.rltnTypeWithSpouseId == 999999) {
                await spouseRelationRef.current.saveHandleOther(member?.memberId);
                // promises.push(spouseRelationRef.current.saveHandleOther(member?.memberId))
            }
            if (refrencePage == 'PersonalInformation' && ($AHelper.$isCheckNoDeceased(dataInfo.memberStatusId)) && !isGrandChild && props.isChildSpouse != true) {
                // const _resultOfSaveVetern = await veternRef.current?.saveVeternData(userId);
                promises.push(veternRef.current?.saveVeternData(userId))
            }

            let memberStatusId = member?.memberStatusId || dataInfo.memberStatusId
            if (refrencePage !== 'PersonalInformation' && $AHelper.$isCheckNoDeceased(memberStatusId)) {
                // const resultOfAssignNotifi = await assignNotificationRef.current?.saveNotifiDetails(userId);
                // const handleclear = await assignNotificationRef.current?.handleclear();
                // konsole.log("notifyResponse", resultOfAssignNotifi);
                promises.push(assignNotificationRef.current?.saveNotifiDetails(userId));
            }

            if ($AHelper.$isCheckNoDeceased(dataInfo?.memberStatusId)) {
                // const _resultOfSaveOccupation = await occupationRef.current?.saveOccupationDetails(userId);
                // console.log("occupationRefInfo", occupationRef)
                konsole.log("occupationRefInfo",occupationRef)
                promises.push(occupationRef.current?.saveOccupationDetails(userId))
            }

            if (promises.length > 0) {
                let results = await Promise.all(promises);
                if (refrencePage !== 'PersonalInformation' && $AHelper.$isCheckNoDeceased(dataInfo.memberStatusId) && !isGrandChild && props.isChildSpouse != true) {
                    const handleclear = await assignNotificationRef.current?.handleclear();
                }
                resolve('resolve');
            } else {
                resolve('resolve')
            }
        })

        konsole.log("veternInfo", veternInfo);


    };

    console.log("occupationRefInfo2", occupationRef)
    konsole.log("occupationRefInfo2",occupationRef)

    // @@ save Veteren Data


    // const updatePrimaryAndSpouseState = (key, value) =>{
    //     konsole.log("setValeuue",key,value)
    //     props?.setPersonalDetails(prev => ({ ...prev, [key]: value }));
    //     props?.setSpouseDetailsObj(prev => ({ ...prev, [key]: value }));
    // }

    // @@Personal Setails
    const handleSelectPersonal = (value, key) => {
        if(isPersonalScreen && key == "maritalStatusId") return props?.checkMaritalStatus?.(value.value);
        konsole.log("valueKey",value,key)
        const isWeddingAgeValid = (dob) => {
            const age = $AHelper.$getAge(dob);
            // return age < 16;
            return age < 14;
        };
        if (key == "maritalStatusId") {
            if (value.value != 3 && (isWeddingAgeValid(dataInfo?.dob) || dataInfo?.dob == null)) {
                toasterAlert('warning', 'Warning', $Msg_Calender.weddingAgeErr)
                return;
            }
            // updatePrimaryAndSpouseState(key, value?.value)
            props?.setPersonalDetails(prev => ({
                ...prev,
                [key]: value.value
            }));
        } else {
            props?.setPersonalDetails(prev => ({
                ...prev,
                [key]: value
            }));
            
            if(key == "dateOfWedding"){
                props?.setSpouseDetailsObj(prev => ({
                    ...prev,
                    [key]: value
                }));
            }
        }
        handleSetErr(key)
    }

    konsole.log(dataInfo, "dataInfodataInfodataInfodataInfo")

    const handleInputChange = useCallback((value, key) => {
        konsole.log("keyValueuue",value,key)
        if($AHelper?.$isNumberRegex(value) && value <= 10){
            props?.setPersonalDetails(prev => ({
                ...prev, [key]: value
              }))
        }
        else{
            toasterAlert("warning", "Warning", $Msg_StateBackground.childLimitMsg)
        }
      }, []);

      const handleChildNoDecrease = (val, key) => {
          const filterChild = allChildrenDetails?.filter(item => item?.userId == dataInfo?.userId)
          const previousAddedChildNumber = (refrencePage == 'AddChildWithProgressBar' || refrencePage == 'EditChildWithAccordian') ? filterChild[0]?.noOfChildren : primaryDetails?.noOfChildren
          const eventValue = val?.target?.value
          if($AHelper?.$isNotNullUndefine(previousAddedChildNumber) && (previousAddedChildNumber > eventValue) && $AHelper?.$isNullUndefine(noOfChildOnDecrease)){
              toasterAlert("warning", "Warning", $Msg_StateBackground?.decreaseChildErrMsg)
              konsole.log("keyValueuue22",primaryDetails,eventValue,key,previousAddedChildNumber,(previousAddedChildNumber > eventValue),(previousAddedChildNumber > eventValue ? previousAddedChildNumber : eventValue))
            setnoOfChildOnDecrease(previousAddedChildNumber)
        }
      };



    // @this if for updating MemberRelationship
    const handlePersonalRelationState = (value, key) => {
        if(value==null){
                handleStateUpdate(key,null)
                return
            }
       
        konsole.log("CheckboxFidu", value.value, key)

        if (key == 'relationshipTypeId' || key == 'rltnTypeWithSpouseId') {
            if (value.value == 3) {
                handleStateUpdate('relationshipTypeId', value?.value)
                handleStateUpdate('rltnTypeWithSpouseId', value?.value)

                handleRelatieUserid('')
            } else {
                if (relationWithPrimary == 3 || relationWithSpouse == 3) {
                    let isSpouse = key == 'rltnTypeWithSpouseId'
                    let isPrimary = key == 'relationshipTypeId'
                    handleStateUpdate(key, value?.value)
                    handleRelatieUserid('')
                    if (isSpouse) {
                        handleStateUpdate('relationshipTypeId', '')
                        handleRelatieUserid('')
                    }
                    if (isPrimary) {
                        handleStateUpdate('rltnTypeWithSpouseId', '')
                        handleRelatieUserid('')
                    }
                } else {
                    handleStateUpdate(key, value?.value)
                    handleRelatieUserid(primaryUserId)
                }
            }
        } else {
            if (key == "isBeneficiary" || key == "isFiduciary") {
                let datedob = $AHelper?.$isNotNullUndefine(dataInfo?.dob) ? $AHelper.$calculate_age($AHelper.$getFormattedDate(dataInfo?.dob)) : 0;
                if (datedob < 18 && key == "isFiduciary") {
                    toasterAlert("warning", "Warning", $Msg_StateBackground.minorFiduciary);
                    handleStateUpdate(key, false)
                    return;
                }
                else {
                    handleStateUpdate(key, value?.target?.checked)
                }
            }
            else {
                handleStateUpdate(key, value?.value)
            }

        }
        handleSetErr(key)
    }


    const handleRelatieUserid = (val) => {
        if (props.isChildSpouse != true) {
            handleStateUpdate('relativeUserId', val)
        }
    }

    const handleStateUpdate = (key, value) => {
        props?.setPersonalDetails((prev) => ({
            ...prev,
            memberRelationship: {
                ...prev.memberRelationship,
                [key]: value
            }
        }))
    }
    const handleSetErr = (key, value) => {
        if ((key == "isBeneficiary" || key == "isFiduciary") && !$AHelper.$isNotNullUndefine(errMsg?.key)) {
            setErrMsg(prev => ({ ...prev, ["isBeneficiaryErr"]: '' }));
            setErrMsg(prev => ({ ...prev, ["isFiduciaryErr"]: '' }));
        }
        else {
            setErrMsg(prev => ({ ...prev, [key]: '' }));
        }
    }


    konsole.log("apiDatastatus", apiData);
    // konsole.log("occcccceeee", occcupationInfo, errMsg)


    console.log("refrencePageadfg",refrencePage)

    let maritalStatusSelectCol = (dataInfo?.maritalStatusId == 1) ? 6 : 8;
    let maritalStatusSelectLabel = 'Relationship status*';
    if (refrencePage == 'AddChildWithProgressBar' || refrencePage == 'EditChildWithAccordian' || (refrencePage=='EditFiduciaryBeneficiary' && isChild==true)) {
        maritalStatusSelectCol = '6';
        maritalStatusSelectLabel = 'Child’s marital status'
    }
    const plasseholderProperty = useMemo(() => (
        `Does this ${isChild ? 'child' : 'extended family/friend'}  require help or protection in managing money or property?`
    ), [isChild])

    konsole.log("dataInfodataInfo", dataInfo);
    konsole.log("relationTypeList", relationTypeList);


    const allNotMinorChildDetails = useMemo(() => {
        konsole.log("allNotMinorChildDetails", allChildrenlabelValue)
        // return allChildrenlabelValue?.filter((item) => {
        //     if ($AHelper.$isNotNullUndefine(item?.dob)) {
        //         return $AHelper.$getAge(item.dob) > 16;
        //     }
        //     return true;
        // });
        return allChildrenlabelValue;

    }, [allChildrenlabelValue])

     const isGrandChild = useMemo(() => {
        return dataInfo?.memberRelationship?.relationshipTypeId == 3
    }, [dataInfo?.memberRelationship])

    const relationWithSpouseNPrimary = useMemo(() => {
        let extendedFriendRelationDetails = extendedFriendRelationList;
        if (allNotMinorChildDetails?.length == 0 || dataInfo?.memberRelationship?.relationshipTypeId != 3) {
            extendedFriendRelationDetails = extendedFriendRelationList.filter((item) => item?.value != 3)
        }

        let valueLabel = (isChild == true && props.isChildSpouse !== true && props?.editInfo?.relationship_Type_Id != 3) ? childrenRelationList : (props.isChildSpouse == true) ? inLawRelationList : extendedFriendRelationDetails;
        konsole.log("valueLabel", extendedFriendRelationDetails,valueLabel,isChild,props.isChildSpouse);
        return valueLabel.length > 0 ? [...valueLabel].sort((a, b) => {
            if (a?.label < b?.label) return -1;
            if (a?.label > b?.label) return 1;
            return 0;
        }) : valueLabel;

    }, [childrenRelationList, extendedFriendRelationList, isChild, props?.isChildSpouse, allChildrenlabelValue,dataInfo?.memberRelationship])

    const relationWithPrimary = useMemo(() => {
        return dataInfo?.memberRelationship?.relationshipTypeId
    }, [dataInfo?.memberRelationship])

    konsole.log("sajdjlklk", relationWithPrimary)

    const relationWithSpouse = useMemo(() => {
        return dataInfo?.memberRelationship?.rltnTypeWithSpouseId;
    }, [dataInfo?.memberRelationship])

    const relativeUserIdForGrandChild = useMemo(() => {
        return dataInfo?.memberRelationship?.relativeUserId;
    }, [dataInfo?.memberRelationship])

    const isRelationDisableForPrimary = useMemo(() => {
        if ((refrencePage == 'EditChildWithAccordian' || refrencePage == 'EditFiduciaryBeneficiary') && dataInfo?.memberRelationship?.relationshipTypeId == 3 && $AHelper.$isNullUndefine(dataInfo?.memberRelationship?.rltnTypeWithSpouseId)) {
            handleStateUpdate('rltnTypeWithSpouseId', 3)
        }
        return ((refrencePage == 'EditChildWithAccordian' || refrencePage == 'EditFiduciaryBeneficiary') && dataInfo?.memberRelationship?.relationshipTypeId == 3);
    }, [dataInfo?.memberRelationship])


    const isRelationDisableForChildList = useMemo(() => {
        if (((refrencePage == 'EditChildWithAccordian' || refrencePage == 'EditFiduciaryBeneficiary') && dataInfo?.memberRelationship?.relationshipTypeId == 3 && $AHelper.$isNotNullUndefine(relativeUserIdForGrandChild)) || (props?.isChildSpouse == true) ) {
            return true;
        }
    }, [dataInfo?.memberRelationship, props?.isChildSpouse])

    const isRelationDisableForSpouse = useMemo(() => {
        return ((refrencePage == 'EditChildWithAccordian' || refrencePage == 'EditFiduciaryBeneficiary') && dataInfo?.memberRelationship?.rltnTypeWithSpouseId == 3);
    }, [dataInfo?.memberRelationship])

    const isPersonalScreen = refrencePage == 'PersonalInformation';

    const labelOfisEmergency = useMemo(() => {
        let realtion = (props?.refrencePage == 'PersonalInformation' && props?.type !== 'Personal') ? lableName : ((props?.refrencePage !== 'PersonalInformation') && props?.isChild == true) ? ((props?.isChildSpouse == true) ? 'as' : "child") : 'as'
        return `Make this ${isGrandChild == true ? 'as' : realtion} an emergency contact?`
    }, [props?.refrencePage, props?.type,isGrandChild])


    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }

    const isCostumModalOpen = typeof window !== 'undefined' && document.querySelector('.costumModal-body');
    const isFamilyInfoVisible = typeof window !== 'undefined' && (
        document.querySelector('.setup-family-information') ||
        document.querySelector('.withDescription') ||
        document.querySelector('.finance-body')
      );
    
    const isWidowSpouse = isPersonalScreen && (dataInfo?.userId == spouseUserId) && (dataInfo?.maritalStatusId == 4);



    const shouldShowComponent = (refrencePage, props, isGrandChild, isChild, dataInfo) => {
        const isChildSpouseNullOrFalse = props?.isChildSpouse === false || $AHelper?.$isNullUndefine(props?.isChildSpouse);
        const isMinorAbove14 = $AHelper?.checkIFMinor(dataInfo?.dob) >= 14;
        const isChildPage = ['AddChildWithProgressBar','EditChildWithAccordian'].includes(refrencePage);      
        if (refrencePage === 'PersonalInformation') {
            if((type == headerNav[1].value  && dataInfo?.maritalStatusId == 4) ||  dataInfo?.maritalStatusId == 3 ){
                return false;
            }else{
                return true; 
            }          
        }      
        if (isChildSpouseNullOrFalse && isGrandChild === false && isMinorAbove14 && isChild && isChildPage) {
          return true;
        }      
        return false;
    };
    const shouldShowInput = ["AddChildWithProgressBar", "EditChildWithAccordian", "AddFiduciaryBeneficiary", "EditFiduciaryBeneficiary"].includes(refrencePage)   
    const shouldShowInputFiduciaryBeneficiary = ["AddFiduciaryBeneficiary","EditFiduciaryBeneficiary"].includes(refrencePage) 
                     





    return (
        <Row id='StatusBackground' className='Personal-Details mb-3'>
            {(isSideContent && !isPersonalScreen) &&
                <Col xs={12} xl={3}>
                    <div className="heading-of-sub-side-links-3">{isSideContent}</div>
                </Col>
            }



            <Col xs={12} md={(isSideContent && !isPersonalScreen) ? 9 : 12}>
             




                {/* ////////////////////////////New sequence ----------//////////////////////////////// */}


                 {/* relationship with section */}

                {shouldShowInput  &&
                    <>
                        {/* @@ Relation with Primary Member */}
                        <Row className={`d-flex align-items-center spacingBottom ${isCostumModalOpen ? '' : 'gapNone'}`}>
                            {(((dataInfo?.userId != spouseUserId) && (dataInfo?.userId != primaryUserId)) || (refrencePage == 'AddChildWithProgressBar') || (!isPrimaryMemberMaritalStatus)) &&
                                <Col xs={12} md={isCostumModalOpen ? undefined : 6} lg={isCostumModalOpen ? undefined : (props?.refrencePage === 'AddFiduciaryBeneficiary' || props?.refrencePage === 'EditFiduciaryBeneficiary' ? 5 : (isFamilyInfoVisible ? 5 : 4))}>
                                    <CustomSearchSelect tabIndex={startingTabIndex + 1} isError={errMsg?.relationshipTypeId} id='relationshipTypeId' label={`Relationship with  ${primaryDetails?.fName} (Primary member)*`} placeholder='Select'
                                        isDisable={isRelationDisableForPrimary} value={relationWithPrimary}
                                        options={relationWithSpouseNPrimary} onChange={(e) => handlePersonalRelationState(e, 'relationshipTypeId')}
                                    />
                                </Col>}


                            {/* @@ Relation Grand Child with Child */}

                            {((relationWithPrimary == 3 || relationWithSpouse == 3) || (props.isChildSpouse == true || isGrandChild == true)) &&
                                <Col xs={12} md={isCostumModalOpen ? undefined : 6} lg={isCostumModalOpen ? undefined : (props?.refrencePage === 'AddFiduciaryBeneficiary' || props?.refrencePage === 'EditFiduciaryBeneficiary' ? 5 : (isFamilyInfoVisible ? 5 : 4))}>
                                    <CustomSearchSelect tabIndex={startingTabIndex + 2} isError={errMsg?.relativeUserId} id='relationshipTypeId' label={`${props?.isChildSpouse ? `${(allNotMinorChildDetails?.find(item => item?.userId == relativeUserIdForGrandChild)?.maritalStatusId == 2) ? 'Partner' : 'Spouse'} of` : 'Parent of grandchild'}*`} isDisable={isRelationDisableForChildList} placeholder='Select'
                                        options={allNotMinorChildDetails} onChange={(e) => handlePersonalRelationState(e, 'relativeUserId')} value={relativeUserIdForGrandChild}
                                    />
                                </Col>
                            }

                            {/* Primary Member Relation Other */}
                            {(relationWithPrimary == 999999) &&
                                <Col xs={12} md={isCostumModalOpen ? undefined : 6} lg={isCostumModalOpen ? undefined : (props?.refrencePage === 'AddFiduciaryBeneficiary' || props?.refrencePage === 'EditFiduciaryBeneficiary' ? 5 : (isFamilyInfoVisible ? 5 : 4))}>
                                    <Other tabIndex={startingTabIndex + 3} othersCategoryId={27} userId={primaryUserId} dropValue={relationWithPrimary} ref={primaryRelationRef} natureId={dataInfo?.memberid || dataInfo?.memberRelationship?.userMemberId} />
                                </Col>
                            }
                            {/* Primary Member Relation Other */}
                        </Row>

                        {/* @@ Relation with spouse  */}
                        {(((dataInfo?.userId != spouseUserId) && (dataInfo?.userId != primaryUserId)) && isPrimaryMemberMaritalStatus) &&
                            <>
                                <Row className={`d-flex align-items-center spacingBottom ${isCostumModalOpen ? '' : 'gapNone'}`}>
                                    <Col xs={12} md={isCostumModalOpen ? undefined : 6} lg={isCostumModalOpen ? undefined : (props?.refrencePage === 'AddFiduciaryBeneficiary' || props?.refrencePage === 'EditFiduciaryBeneficiary' ? 5 : (isFamilyInfoVisible ? 5 : 4))}>
                                        <CustomSearchSelect tabIndex={startingTabIndex + 4} isError={errMsg?.rltnTypeWithSpouseId} id='rltnTypeWithSpouseId' label={`Relationship with ${spouseDetails?.fName} (${_spousePartner})*`} placeholder='Select' isDisable={isRelationDisableForSpouse}
                                            options={relationWithSpouseNPrimary} onChange={(e) => handlePersonalRelationState(e, 'rltnTypeWithSpouseId')} value={relationWithSpouse}
                                        />
                                    </Col>
                                    {/* Spouse Member Relation Other */}
                                    {(relationWithSpouse == 999999) &&
                                        <Col xs={12} md={isCostumModalOpen ? undefined : 6} lg={isCostumModalOpen ? undefined : (props?.refrencePage === 'AddFiduciaryBeneficiary' || props?.refrencePage === 'EditFiduciaryBeneficiary' ? 5 : (isFamilyInfoVisible ? 5 : 4))}>
                                            <Other tabIndex={startingTabIndex + 5} othersCategoryId={27} userId={spouseUserId} dropValue={relationWithSpouse} ref={spouseRelationRef} natureId={dataInfo?.memberid || dataInfo?.memberRelationship?.userMemberId} />
                                        </Col>
                                    }
                                    {/* Primary Member Relation Other */}
                                </Row>
                            </>}

                     
                    </>}

                 {/* metrial status    */}
                 {(refrencePage != 'PersonalInformation' && props?.isChild != true) || (isGrandChild == true || props?.isChildSpouse == true) ? "" :
                    <>
                        <Row className='d-flex align-items-center spacingBottom gapNone'>
                            {(!isWidowSpouse) && <ColumnRender isPersonalScreen={isPersonalScreen} >
                                <CustomSelect tabIndex={startingTabIndex + 6} isError={errMsg?.maritalStatusId} id='maritalStatusId' label={maritalStatusSelectLabel} placeholder='Select' isDisable={(dataInfo?.userId == spouseUserId) || (isPersonalScreen && (loggedInUserId == spouseUserId))}
                                options={filterMaritalStatusList} onChange={(e) => handleSelectPersonal(e, 'maritalStatusId')} value={dataInfo?.maritalStatusId}
                                />
                            </ColumnRender>}

                            {/* @@ HIDE CONTENT FOR PERSONAL INFO */}
                            {!(isPersonalScreen) &&
                                ([1,4,5].includes(dataInfo?.maritalStatusId) && refrencePage == 'PersonalInformation') &&
                                <ColumnRender isPersonalScreen={isPersonalScreen} >
                                    <CustomCalendar tabIndex={ startingTabIndex + 7} label="Date of Marriage" placeholder="mm/dd/yyyy" type="dateodMarrige" value={dataInfo?.dateOfWedding} spouseDetailsObj={spouseDetailsObj}
                                        onChange={(e) => handleSelectPersonal(e, 'dateOfWedding')} compareDate={dataInfo?.dob} />
                                </ColumnRender>
                            }
                        </Row>
                        {/* @@ Display Date of Marrige */}
                        {(isPersonalScreen && !isWidowSpouse) &&  ([1,4,5,null].includes(dataInfo?.maritalStatusId) && refrencePage == 'PersonalInformation') &&
                              <Row>
                                <ColumnRender isPersonalScreen={isPersonalScreen} >
                                    <CustomCalendar tabIndex={ startingTabIndex + 8} label="Date of Marriage" placeholder="mm/dd/yyyy" type="dateodMarrige" value={dataInfo?.dateOfWedding} spouseDetailsObj={spouseDetailsObj}
                                        onChange={(e) => handleSelectPersonal(e, 'dateOfWedding')} compareDate={dataInfo?.dob} 
                                        // handleChangeOnFocusOut = {(e)=>handleChangeOnFocusOut(e, 'dateOfWedding')}
                                        isDisabled={dataInfo?.userId == spouseUserId}
                                        />
                                </ColumnRender>
                            </Row>
                        }
                    </>
                }

                {/* Numbe of childrens */}
                {shouldShowComponent(refrencePage, props, isGrandChild, isChild, dataInfo) &&
                    <Row className='my-2 gapNone'>
                        <CustomInput tabIndex={startingTabIndex + 9} isError={''} label="Number of Children" placeholder="Enter number of children" id='noOfChildren' value={$AHelper?.$isNotNullUndefine(dataInfo?.noOfChildren) ? dataInfo?.noOfChildren : ""} onChange={(val) => handleInputChange(val, 'noOfChildren')} onBlur={(val) => handleChildNoDecrease(val, "noOfChildren")}
                            isDisable={type == headerNav[1].value && refrencePage == 'PersonalInformation'}
                        />
                    </Row>}

                {/* Beneficiary/Fiduciary checkbox     */}
                {shouldShowInput  &&  <>
                    {shouldShowInputFiduciaryBeneficiary &&
                            <>

                                <Row className='mt-3'>
                                    {(occcupationDetails?.isDisabled == true || occcupationSavedData?.isDisabled == true) ? <> </> : <Col lg="12" md="12" sm="12">
                                        <CustomCheckBox tabIndex={startingTabIndex + 10} label={`Fiduciary ${($AHelper.$isNotNullUndefine(dataInfo?.userId) && dataInfo?.userId == spouseUserId) ? `of ${primaryMemberFullName} (Primary Member)` : ($AHelper.$isNotNullUndefine(dataInfo?.userId)
                                         && dataInfo?.userId == primaryUserId) ? `of ${spouseFullName} (${$AHelper?.capitalizeFirstLetterFirstWord(_spousePartner)})` : ""}`} isError={errMsg?.isFiduciaryErr} value={dataInfo?.memberRelationship?.isFiduciary} onChange={(e) => handlePersonalRelationState(e, 'isFiduciary')} />
                                    </Col>}
                                    <Col className='mt-2' lg="12" md="12" sm="12">
                                        <CustomCheckBox tabIndex={startingTabIndex + 11} label={`Beneficiary ${($AHelper.$isNotNullUndefine(dataInfo?.userId) && dataInfo?.userId == spouseUserId) ? `of ${primaryMemberFullName} (Primary Member)` : ($AHelper.$isNotNullUndefine(dataInfo?.userId)
                                         && dataInfo?.userId == primaryUserId) ? `of ${spouseFullName} (${$AHelper?.capitalizeFirstLetterFirstWord(_spousePartner)})` : ""}`} isError={errMsg?.isBeneficiaryErr} value={dataInfo?.memberRelationship?.isBeneficiary} onChange={(e) => handlePersonalRelationState(e, 'isBeneficiary')} />
                                    </Col>
                                </Row>
                            </>}
                </> }

                 {/* Deceased and special needs */}
                 {Boolean(isActiveForm) != true  && <div className='anotherChildComponent' style={{
                    display: !((refrencePage === 'PersonalInformation' && type === headerNav[0].value) ||
                        (["AddFiduciaryBeneficiary", "EditFiduciaryBeneficiary"].includes(refrencePage) && [primaryUserId, spouseUserId].includes(userId))) ? 'visible' : 'none'
                }}>
                    {console.log("dlkgfdklgjklfdjglkdsf",dataInfo?.memberStatusId)}
                    <DeceaseSpecialNeed
                        startTabIndex={startingTabIndex + 12}
                        setPersonalDetails={props?.setPersonalDetails}
                        dataInfo={props?.dataInfo}
                        key={props?.dataInfo + props?.detailsForMemberStatus}
                        refrencePage={refrencePage}
                        detailsForMemberStatus={props?.detailsForMemberStatus}
                    />
                </div>}

                 <div className='mx-0 childComponent' id='OccupationDivId'>
                  
                    {($AHelper.$isCheckNoDeceased(dataInfo.memberStatusId)) && !(["AddFiduciaryBeneficiary", "EditFiduciaryBeneficiary"].includes(refrencePage) && [primaryUserId, spouseUserId].includes(userId)) &&
                        <OccupationComponent
                        startTabIndex={startingTabIndex + 13 + 3} 
                        userId={userId}
                        ref={occupationRef}
                        refrencePage={refrencePage}
                        type={type}
                        isChild={isChild}
                        isGrandChild = {isGrandChild}
                        isChildSpouse = {props?.isChildSpouse}
                        detailsForMemberStatus={props?.detailsForMemberStatus}
                        setPersonalDetails={props?.setPersonalDetails}
                        dataInfo={props?.dataInfo}
                        />
                     }
                </div>
                  {/* radioYesNoLabelWithBool */}
                {shouldShowInput && <>
                      {isChild && isGrandChild != true && props?.isChildSpouse != true &&
                        <Row className='mt-1 mb-2' style={{ marginLeft: "1.5px" }}>
                            <CustomRadio
                                tabIndex={startingTabIndex + 14 + 3 + 8}
                                name="isChildCapableMgmtfinanc"
                                options={radioYesNoLabelWithBool}
                                onChange={(e) => handlePersonalRelationState(e, 'isChildCapableMgmtfinanc')}
                                value={dataInfo?.memberRelationship?.isChildCapableMgmtfinanc}
                                placeholder={plasseholderProperty}
                            />
                        </Row>}
                </>}

                  {/* This for Vetern */}
                        <>
                            {(refrencePage == 'PersonalInformation' && ($AHelper.$isCheckNoDeceased(dataInfo.memberStatusId))) &&
                               
                                <div className='mx-0 ps-0 childComponent' id='VeternDivId'>
                                    <VeternComponent startTabIndex={startingTabIndex + 15 + 3 + 8 + 1}  refrencePage={refrencePage} ref={veternRef} userId={userId} type={type} setPersonalDetails={props?.setPersonalDetails} dataInfo={props?.dataInfo} />
                                </div>
                            }
                        </>

                  {/* Assign Notification for */}
                {(refrencePage !== 'PersonalInformation' && $AHelper.$isCheckNoDeceased(dataInfo.memberStatusId)) &&
                    <div className=''>
                        <AssignNotification startTabIndex={startingTabIndex + 16 + 3 + 8 + 1 + 9} ref={assignNotificationRef} key={`${type}-${userId}=${refrencePage}-${isChild}-${dataInfo}`} memberid={userId} />
                    </div>
                }

                 

                 {!["BusinessIntrests","transportation",'professional','AddFiduciaryBeneficiary','EditFiduciaryBeneficiary','Liabilities','lenderData'].includes(props.refrencePage)  &&                  
                  <>
                        {(props?.refrencePage == 'PersonalInformation' && ![1,2].includes(props?.maritalStatusId)) || !$AHelper.$isCheckNoDeceased(dataInfo.memberStatusId) ? "" :
                            <Row className='mt-2 mb-2'>
                                <CustomRadio
                                    tabIndex={startingTabIndex + 17 + 3 + 8 + 1 + 9 + 1}
                                    placeholder={labelOfisEmergency}
                                    name='isEmergencyContact'
                                    options={radioYesNoLabelWithBool}
                                    onChange={(e) => handlePersonalRelationState(e, 'isEmergencyContact')}
                                    value={$AHelper.$isNotNullUndefine(props?.dataInfo?.memberRelationship?.isEmergencyContact) ? (props?.dataInfo?.memberRelationship?.isEmergencyContact) : null}
                                />
                            </Row>
                        }
                    </>
                 }   

                  {/* Emergency Contacts Radio */}
                {shouldShowInputFiduciaryBeneficiary &&
                    <Row className='mt-2 mx-0 '>
                        <CustomRadio
                            tabIndex={startingTabIndex + 18 + 3 + 8 + 1 + 9 + 1 + 1 }
                            placeholder="Make this an emergency contact?"
                            name='isEmergencyContact'
                            options={radioYesNoLabelWithBool}
                            onChange={(e) => handlePersonalRelationState(e, 'isEmergencyContact')}
                            value={$AHelper.$isNotNullUndefine(dataInfo?.memberRelationship?.isEmergencyContact) ? dataInfo?.memberRelationship?.isEmergencyContact : 'no-selected'}
                        />
                    </Row>}

            </Col>
        </Row>
    );
});








export default React.memo(StatusBackGround);
