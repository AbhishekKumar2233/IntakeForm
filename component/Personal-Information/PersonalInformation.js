'use client'

import React, { useCallback, useEffect, useState, useRef, useContext, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import PersonalDetails from './PersonalDetails';
// import PersonalDetails, { StatusMessageForRelation } from './PersonalDetails';
// import ContactAndAddress from '../Custom/Contact/ContactAndAddress';
// import { CustomAccordion, CustomAccordionBody } from '../Custom/CustomAccordion';
// import { CustomButton } from '../Custom/CustomButton';
import { useAppSelector, useAppDispatch } from '../Hooks/useRedux';
import { selectPersonal, selectUI } from '../Redux/Store/selectors';
import { $JsonHelper } from '../Helper/$JsonHelper';
import { $AHelper } from '../Helper/$AHelper';
import { deceaseMemberStatusId, deceaseSpouseRelationId, focusInputBox, getApiCall, postApiCall, specialNeedMemberStatusId } from '../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../components/network/UrlPath';
import konsole from '../../components/control/Konsole';
import { setPrimaryMemberDetails, fetchSpouseDetails, setSpouseMemberDetails, fetchPrimaryDetails,fetchAllChildrenDetails, updateHandleChecked,} from '../Redux/Reducers/personalSlice';
import { $dashboardLinks } from '../Helper/Constant';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import { useLoader } from '../utils/utils';
// import { CustomHeaderTile } from '../Custom/CustomHeaderTile';
import StatusBackGround from './StatusBackGround';
// import { setIsShowSpouseMaritalTile } from '../Redux/Reducers/personalSlice';
// import CustomStepper from '../Custom/CustomStepper';
import { globalContext } from '../../pages/_app';
import { contentObject } from '../Helper/$MsgHelper';
import { clearSessionActiveTabData } from '../Hooks/usePersistActiveTab';
import useResetStates from '../Hooks/useResetStates';
import { selectApi } from '../Redux/Store/selectors';
import UniversalAddress from '../Custom/Contact/UniversalAddress';
// import { CustomTextareaObjective } from '../Custom/CustomComponent';
import { $ApiHelper } from '../Helper/$ApiHelper';
import { Services } from '../../components/network/Service';
import dynamic from 'next/dynamic';

// const PersonalDetails = dynamic(() => import('./PersonalDetails').then((mod) => mod.PersonalDetailsDynamic), { ssr: false });
// const StatusBackGround = dynamic(() => import('./StatusBackGround').then((mod) => mod.StatusBackGroundDynamic), { ssr: false });
const CustomButton = dynamic(() => import('../Custom/CustomButton').then((mod) => mod.CustomButton), { ssr: false });
const CustomTextareaObjective = dynamic(() => import('../Custom/CustomComponent').then((mod) => mod.CustomTextareaObjective), { ssr: false });
// const UniversalAddress = dynamic(() => import('../Custom/Contact/UniversalAddress').then((mod) => mod.UniversalAddressDynamic), { ssr: false });

export const spouseRelationStatus = {
    '1': 'married',
    '2': 'living together',
    '3': 'living together',
    '4': 'widowed'
}

export const headerNav = [{ label: 'Information', value: 'Personal' }, { label: 'Information', value: 'Spouse' }];
const allkeys = ["0", "1", "2"]

const PersonalInformation = () => {
    // konsole.log("renderTest-PersonalInformation");
    const { primaryUserId, spouseUserId, loggedInUserId, spouseFullName, primaryMemberFullName, isPrimaryMemberMaritalStatus, subtenantId, _spousePartner, loggedInMemberName } = usePrimaryUserId();
    const personalReducer = useAppSelector(selectPersonal)
    const apiData = useAppSelector(selectApi);
    const uiState = useAppSelector(selectUI)
    const headerNav2 = [{ label: `${primaryMemberFullName}`, value: 'Personal' }, { label: `${spouseFullName}`, value: 'Spouse' }]
    const dispatch = useAppDispatch()
    const { primaryDetails, spouseDetails, isJointAccount, isSpouseAddress, isShowSpouseMaritalTile, isPrimaryAddress,showInvite, handleOffData } = personalReducer;
    const {maritalStatusList} = apiData;
    const { setWarningPhyscian, setWarning, returnTrue,newConfirm } = useContext(globalContext);
    const primaryPersonalDetailsRef = useRef(null);
    const spousePersonalDetailsRef = useRef(null);
    const primaryStatusBackgroundRef = useRef(null);
    const spouseStatusBackgroundRef = useRef(null);
    const contactDetailsRef = useRef(null);
    const { resetBenFiduStates  } = useResetStates();
    //@Define State
    const [activeTab, setActiveTab] = useState('Personal');
    const [detailsForMemberStatus, setDetailsForMemberStatus] = useState('')
    const [personalDetails, setPersonalDetails] = useState({ ...$JsonHelper.createPersonalDetails() })
    const [spouseDetailsObj, setSpouseDetailsObj] = useState({ ...$JsonHelper.createPersonalDetails() })
    // const [activeKeys, setActiveKeys] = useState(allkeys);
    const [formlabelQuestion, setFormlabelQuestion] = useState({});
    const [formlabelData, setFormlabelData] = useState({});
    const [planningInput, setplanningInput] = useState('')
    const [activeSection, setActiveSection] = useState('Personal');
    const personalRef = useRef(null);
    const statusRef = useRef(null);
    const contactRef = useRef(null);
    konsole.log("returnValuereturnValue", returnTrue)
    konsole.log("personalDetails", personalDetails);
    konsole.log("spouseDetailsObj", spouseDetailsObj, spouseDetails);
    konsole.log("handleOffDatafETC", handleOffData);
    // @define useEffect    
    useEffect(() => {
        // konsole.log("renderTest-PersonalInformation-useEffect-1");
        if ($AHelper.$isNotNullUndefine(primaryDetails) && $AHelper.$isNotNullUndefine(primaryDetails?.userId)) {
            konsole.log("primaryDetailsuseEffect", primaryDetails)
            updateDetails(primaryDetails, setPersonalDetails);
            fectchsubjectForFormLabelId()
            setActiveSection('Personal')
        }
    }, [primaryDetails?.userId])


    useEffect(() => {
        // konsole.log("renderTest-PersonalInformation-useEffect-2");

        if ($AHelper.$isNotNullUndefine(spouseDetails) && $AHelper.$isNotNullUndefine(spouseDetails.userId)) {
            updateDetails(spouseDetails, setSpouseDetailsObj, primaryDetails?.maritalStatusId,primaryDetails?.dateOfWedding);
            setDetailsForMemberStatus({
                memberStatusIdForTestRef: spouseDetails?.memberStatusId,
                name: spouseDetails?.fName,
                isFiduciaryForTest: spouseDetails?.memberRelationship?.isFiduciary,
                isBeneficiaryForTest: spouseDetails?.memberRelationship?.isBeneficiary
            })
        }
    }, [spouseDetails?.userId])

    useEffect(() => {
        // konsole.log("renderTest-PersonalInformation-useEffect-3");

        if($AHelper.$isNotNullUndefine(primaryUserId)) {
            const fetchAndCompare = async () => {
                // const resultOfPrimary = await dispatch(fetchPrimaryDetails({ userId: primaryUserId })); 
                    if(showInvite != primaryDetails?.isHandOff) dispatch(updateHandleChecked(primaryDetails.isHandOff))
                    konsole.log(primaryDetails.isHandOff, showInvite, "resultOfPrimaryresultOfPrimary")       
            };
            fetchAndCompare();
            clearSessionActiveTabData();
        }
        
        // // After making Primary member Married to widow we are getting spouseUserId undefined that'swhy I write below if code for now only
        // if($AHelper?.$isNotNullUndefine(primaryDetails?.maritalStatusId) && primaryDetails?.maritalStatusId == 4){
        //     konsole.log("spouseUserId1212",spouseUserId)
        //     let spouseId = sessionStorage.getItem("spouseUserId")
        //     dispatch(fetchSpouseDetails({ userId: spouseId }))
        // }
    }, [primaryDetails?.isHandOff, spouseUserId]); // need to test

    // useEffect(() => {
    //     changeMaritalStatus();
    // }, [personalDetails?.maritalStatusId]);

    konsole.log("dnafjhal\n\nold\n", JSON.stringify(primaryDetails), "\n\nnew\n", JSON.stringify(personalDetails));

    const changeMaritalStatus = async ( newMaritalStatusId ) => {
        const currentMaritalStatus = maritalStatusList?.find((item) => item?.value == primaryDetails?.maritalStatusId)
        const newMaritalStatus = maritalStatusList?.find((item) => item?.value == newMaritalStatusId)
        konsole.log("checkExistingMaritalId",newMaritalStatus,currentMaritalStatus)
        if(([3, 5, 4]?.includes(Number(currentMaritalStatus?.value)) && [1, 2]?.includes(Number(newMaritalStatus?.value))) || ([1]?.includes(Number(currentMaritalStatus?.value)) && [4, 5]?.includes(Number(newMaritalStatus?.value))) || ([2]?.includes(Number(currentMaritalStatus?.value)) && [1, 3]?.includes(Number(newMaritalStatus?.value)))){
            useLoader(true);
            const isNotValidStatus = await isValidateStatusBackground( true , true );
            const isNotValidPersonal = await isValidatePersonalDetails( true );
            useLoader(false);
            if(isNotValidPersonal || isNotValidStatus) {
                // setPersonalDetails(prev => ({ ...prev, ["maritalStatusId"]: primaryDetails?.maritalStatusId || null }));
                // setSpouseDetailsObj(prev => ({ ...prev, ["maritalStatusId"]: primaryDetails?.maritalStatusId || null }));
                return;
            }

            let confirmToasterContent = `You are about to change your marital status from ${currentMaritalStatus?.label} to ${newMaritalStatus?.label}. This change will impact several legal documents associated with your account, such as power of attorney, wills, and trusts.`;
            if((currentMaritalStatus?.value == '1' && newMaritalStatus?.value == '5') || (currentMaritalStatus?.value == '2' && newMaritalStatus?.value == '3')) {
                // If moving from 'married to divorced' or living together to single' 
                confirmToasterContent += ` Please note that by confirming, your ${_spousePartner} will be considered as your ex-spouse and moved to the extended family.`
            }
            confirmToasterContent += ` Please confirm if you wish to proceed with this change.`;
            const confirmRes = await newConfirm(true, confirmToasterContent, 'Permission', 'Confirmation', 3);
            konsole.log("confirmRes12121", confirmRes);

            if (confirmRes) {
                if(isPrimaryMemberMaritalStatus && ([1, 2]?.includes(Number(newMaritalStatus?.value)) == false)) { 
                    // Handle Same as spouse address
                    const spouseAddresses = contactDetailsRef?.current?.getSpouseAddressData();
                    const spouseAddressJson = spouseAddresses?.addresses?.find(ele => ele?.addressTypeId == '1');
                    if(spouseAddressJson) {
                        // const splitAddressRes = await Services.splitCommonAddress({
                        Services.splitCommonAddress({
                            ...spouseAddressJson,
                            userId: spouseUserId
                        })

                        // konsole.log("nvskjbvkj", splitAddressRes);
                    }
                    
                    // Handle invited spouse revoke permission
                    if(spouseAddresses?.revokableSpouseRoleId?.roleId) {
                        revokeSpousePermission({
                            spouseRoleId: spouseAddresses?.revokableSpouseRoleId?.roleId
                        })         
                    }
                }
                personalDetails.maritalStatusId = newMaritalStatusId;
                konsole.log("bdajkfbakb", personalDetails.maritalStatusId);
                handleSave( true );
            } else {
                // setPersonalDetails(prev => ({ ...prev, ["maritalStatusId"]: primaryDetails?.maritalStatusId || null }));
                // setSpouseDetailsObj(prev => ({ ...prev, ["maritalStatusId"]: primaryDetails?.maritalStatusId || null }));
            }
        }
    };

    const revokeSpousePermission = ({ spouseRoleId }) => {
        const revokeJson = {
            "primaryUserId": primaryUserId,
            "secondaryUserId": spouseUserId,
            "roleId": spouseRoleId,
            "isJointAccount": true,
            "subtenantId": subtenantId,
            "remarks": `LINKED_ACCOUNT_REVOKED_DUE_TO_MARITAL_STATUS_CHANGE_OF_${primaryMemberFullName?.replaceAll(' ', '_')?.toUpperCase()}_BY_${loggedInMemberName?.replaceAll(' ', '_')?.toUpperCase()}`, 
            "requestBy": loggedInUserId
        }
        const revokeUrl = $Service_Url.postRevokeLinkedAccount;
        postApiCall("POST", revokeUrl, revokeJson);
    }
    

    // const handleSectionChange = (section) => {
    //     setActiveSection(section);
    // };

    useEffect(() => {
        const sections = [
          { id: 'Personal', ref: personalRef },
          { id: 'Status', ref: statusRef },
          { id: 'Contact', ref: contactRef },
        ];
    
        const Scrollspy = new IntersectionObserver(
          (entries) => {
            entries?.forEach((ele) => {
              if (ele?.isIntersecting) {
                setActiveSection(ele?.target?.dataset?.section);
              }
            });
          },
          { threshold: 0.5 }
        );
    
        sections?.forEach(({ ref }) => {
          if (ref?.current) {
            Scrollspy?.observe(ref?.current);
          }
        });
    
        return () => {
          sections?.forEach(({ ref }) => {
            if (ref?.current) {
              Scrollspy?.unobserve(ref?.current);
            }
          });
        };
    }, []);

    // konsole.log("ashdajl", personalDetails, primaryDetails, {...primaryDetails, ...personalDetails});

    const handleSectionClick = (section) => {
        setActiveSection(section);
        document?.getElementById(section?.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    };

    // @Update useEffect data 
    const updateDetails = (details, setState, maritalStatusForSpouse,dateOfWeddingForSpouse) => {
        konsole.log("detailsdetails", memberStatusId, details)
        const { fName, mName, lName, nickName, suffixId, citizenshipId, genderId, birthPlace, maritalStatusId, dob, userId, isVeteran, dateOfWedding, memberStatusDesc, memberStatusId, matNo, dateofDivorce,noOfChildren} = details;
        const isNewSpouse = (fName.includes("- Spouse") || fName.includes("- Partner"));
        const actualFirstName = (isNewSpouse) ? "" : fName;
        const actualLastName = (isNewSpouse) ? personalDetails?.lName : lName;
        setState(prev => ({
            ...prev, fName: actualFirstName, mName, lName: actualLastName, nickName, suffixId, 
            citizenshipId: citizenshipId || '187', 
            genderId, birthPlace, maritalStatusId : maritalStatusId ?? maritalStatusForSpouse, dob, dateOfDeath: details?.dateOfDeath, userId: userId, isVeteran: isVeteran, dateOfWedding : dateOfWedding ?? dateOfWeddingForSpouse, memberStatusDesc: memberStatusDesc, memberStatusId: $AHelper.$isNotNullUndefine(memberStatusId) ? memberStatusId : 1, matNo,noOfChildren,
            memberRelationship: {
                ...prev.memberRelationship,
                ...($AHelper.$isNotNullUndefine(details.memberRelationship) ? details.memberRelationship : prev.memberRelationship)
            }, dateofDivorce: dateofDivorce
        }))
    }
    const handleActiveTab = useCallback((val) => {
        setActiveTab(val);
    }, []);


    // @@ validate personal details
    async function isValidatePersonalDetails( dontCheckSpouse ) {
        let isValidPrimary = true;
        let isValidSpouse = true;
        isValidPrimary = await primaryPersonalDetailsRef?.current?.validatePersonalDetail();
        if (displaySpouseContent && isPrimaryMemberMaritalStatus && (dontCheckSpouse != true)) {
            isValidSpouse = await spousePersonalDetailsRef?.current?.validatePersonalDetail();
        }
        return !isValidPrimary || !isValidSpouse;
    }

    // @@ validate Status and Background details
    async function isValidateStatusBackground( onlyValidate, dontCheckSpouse ) {
        let isValidPrimary = true;
        let isValidSpouse = true;
        isValidPrimary = await primaryStatusBackgroundRef?.current?.validateStateBackGround();
        
        konsole.log("isValidPrimaryyyyy", isValidPrimary)     
        if (displaySpouseContent && (dontCheckSpouse != true)) {
            isValidSpouse = await spouseStatusBackgroundRef?.current?.validateStateBackGround();
        }

        // Status and backgorund
        if( onlyValidate != true ) {
            let apiCall = [];
            apiCall.push(primaryStatusBackgroundRef?.current?.saveData(primaryUserId))
            if (displaySpouseContent  && (dontCheckSpouse != true)) {
                apiCall.push(spouseStatusBackgroundRef?.current?.saveData(spouseUserId))
            }
            await Promise.all(apiCall);
        }

        return !isValidPrimary || !isValidSpouse;
    }

    // @@ handleDataSave
    const handleSave = async ( fromMaritalChange ) => {
        // alert("Code is working")
        const isAddressPrimaryError = isPrimaryAddress;
        const isAddresSpousesError = isPrimaryMemberMaritalStatus ? isSpouseAddress : true;
        const isMarried = isPrimaryMemberMaritalStatus

        // konsole.log(activeSection == 'Personal',"activeSectionPersonal", await isValidatePersonalDetails() == true && activeSection == 'Personal')
        const isNotValidPersonal = await isValidatePersonalDetails( fromMaritalChange );
        if(isNotValidPersonal) return handleSectionClick('Personal');
        const isNotValidStatus = await isValidateStatusBackground( false, fromMaritalChange );
        if(isNotValidStatus) return handleSectionClick('Status');


        if (fromMaritalChange != true && (!isAddressPrimaryError || !isAddresSpousesError)) {
            handleSectionClick('Contact')
            let errMsg;     
            if(isAddressPrimaryError == false && isAddresSpousesError == false) {
                errMsg = `Physical address is mandatory for primary member & ${_spousePartner}`
            } else if(isAddresSpousesError == false){
                errMsg = `Physical address is mandatory for ${_spousePartner}`
            } else if(isAddressPrimaryError == false){
                errMsg = `Physical address is mandatory for primary member`
            }
            toasterAlert("warning", errMsg)     
            return;
        }

        // Updating Session storage
        updateSessionUserDetailOfPrimary();
        const currentMaritalStatus = maritalStatusList?.find((item) => item?.value == primaryDetails?.maritalStatusId)
        const newMaritalStatus = maritalStatusList?.find((item) => item?.value == personalDetails?.maritalStatusId)
        useLoader(true);
        let apiCall = []
        // @@ PRIMARY MEMBER
        {
            let jsonObjDetails = primaryDetails;
            let jsonObjDetailsForm = personalDetails;
            let jsonObj = $JsonHelper.createJsonUpdateMemberById({ ...jsonObjDetails, ...jsonObjDetails.memberRelationship, ...jsonObjDetailsForm, ...jsonObjDetailsForm?.memberRelationship, updatedBy: loggedInUserId, subtenantId: subtenantId, });
            konsole.log("jsonObj121212", jsonObj,primaryDetails,personalDetails);

            // @@ handle member relationship
            if ($AHelper.$isMarried(jsonObj.maritalStatusId) || primaryDetails?.maritalStatusId == 4) {
                let memberRelationshipJson = jsonObj?.memberRelationship
                memberRelationshipJson.primaryUserId = $AHelper.$isNotNullUndefine(memberRelationshipJson.primaryUserId) ? memberRelationshipJson.primaryUserId : spouseUserId;
                memberRelationshipJson.relationshipTypeId = $AHelper.$isNotNullUndefine(memberRelationshipJson.relationshipTypeId) ? memberRelationshipJson.relationshipTypeId : 1;
                memberRelationshipJson.relativeUserId = $AHelper.$isNotNullUndefine(memberRelationshipJson.relativeUserId) ? memberRelationshipJson.relativeUserId : spouseUserId;
                memberRelationshipJson.isFiduciary = jsonObjDetailsForm?.isDisabled == true ? false : memberRelationshipJson.isFiduciary;

                let url = $Service_Url.postMemberRelationship + `?RelativeMemberID=${primaryDetails?.memberId}`
                konsole.log("primaryDetailsprimaryDetailsaaa", primaryDetails)
                let method = $AHelper.$isNullUndefine(primaryDetails?.memberRelationship) ? 'POST' : 'PUT';
                const _resultOfSavememberRelation = await postApiCall(method, url, memberRelationshipJson)
                konsole.log("_resultOfSavememberRelation", _resultOfSavememberRelation);
                delete jsonObj.memberRelationship;
            }
            if (!$AHelper.$isMarried(jsonObj.maritalStatusId)) {
                delete jsonObj.memberRelationship;
            }
            if(spouseDetailsObj?.memberStatusId == 2 && primaryDetails?.maritalStatusId != 4){
                let maritalStatusId = personalDetails.maritalStatusId == 1 ? 4 : personalDetails.maritalStatusId == 2 ? 3 : personalDetails.maritalStatusId
                jsonObj["maritalStatusId"] = maritalStatusId
            }
            konsole.log("jsonObj1212129999", jsonObj);
            apiCall.push(postApiCall('PUT', $Service_Url.putUpdateMember, jsonObj));
            upsertMetaData()
        }
        // @@ PRIMARY MEMBER

        //@@ SPOUSE
        if (displaySpouseContent && (primaryDetails?.maritalStatusId == personalDetails?.maritalStatusId)) {
            let jsonObjDetails = spouseDetails;
            let jsonObjDetailsForm = spouseDetailsObj;
            if (!$AHelper.$isCheckNoDeceased(spouseDetailsObj.memberStatusId)) {
                jsonObjDetailsForm.memberRelationship.isBeneficiary = false;
                jsonObjDetailsForm.memberRelationship.isFiduciary = false;
                jsonObjDetailsForm.memberRelationship.isEmergencyContact = false;
                jsonObjDetailsForm.memberRelationship.relationshipTypeId = deceaseSpouseRelationId;

                // Handle invited spouse revoke permission
                const spouseAddresses = contactDetailsRef?.current?.getSpouseAddressData();
                if(spouseAddresses?.revokableSpouseRoleId?.roleId) {
                    revokeSpousePermission({
                        spouseRoleId: spouseAddresses?.revokableSpouseRoleId?.roleId
                    })         
                }
            }
            if (jsonObjDetailsForm?.isDisabled == true) {
                jsonObjDetailsForm.memberRelationship.isFiduciary = false;
            }

            if([1]?.includes(Number(currentMaritalStatus?.value)) && [4]?.includes(Number(newMaritalStatus?.value))){
                jsonObjDetailsForm["memberStatusId"] = deceaseMemberStatusId
            }
            jsonObjDetailsForm["maritalStatusId"] = null         // For now till we are not sending the spouse/partner marital status in API after that just remove this line

            let jsonObjForSpouse = $JsonHelper.createJsonUpdateMemberById({ subtenantId: 2, ...jsonObjDetails, ...jsonObjDetails.memberRelationship, ...jsonObjDetailsForm, ...jsonObjDetailsForm?.memberRelationship, updatedBy: loggedInUserId, subtenantId: subtenantId, });
            konsole.log("jsonObjForSpouse111",jsonObjForSpouse)
            apiCall.push(postApiCall('PUT', $Service_Url.putUpdateMember, jsonObjForSpouse))


            // after meking spouse deceased primary member status chenged to widhow
            if (jsonObjForSpouse.memberStatusId == deceaseMemberStatusId && $AHelper.$isMarried(personalDetails.maritalStatusId)) {
                let jsonObjDetails = primaryDetails;
                let jsonObjDetailsForm = personalDetails;
                let maritalStatusId = personalDetails.maritalStatusId == 1 ? 4 : personalDetails.maritalStatusId == 2 ? 3 : personalDetails.maritalStatusId
                let jsonObj2 = $JsonHelper.createJsonUpdateMemberById({ ...jsonObjDetails, ...jsonObjDetails.memberRelationship, ...jsonObjDetailsForm, ...jsonObjDetailsForm?.memberRelationship, updatedBy: loggedInUserId, maritalStatusId: maritalStatusId, subtenantId: subtenantId, });
                konsole.log("jsonObj212111",jsonObj2)
                delete jsonObj2.memberRelationship;
                // apiCall.push(postApiCall('PUT', $Service_Url.putUpdateMember, jsonObj2))
            }
        }

        // {
        //     // Status and backgorund
        //     apiCall.push(primaryStatusBackgroundRef?.current?.saveData(primaryUserId))
        //     if (displaySpouseContent) {
        //         apiCall.push(spouseStatusBackgroundRef?.current?.saveData(spouseUserId))
        //     }

        // }

        // @@ api call
        useLoader(true);
        const _resofOfSavedData = await Promise.all(apiCall);
        const newSpouseUserId = _resofOfSavedData?.[0]?.data?.data?.member?.spouseUserId;
        konsole.log("_resofOfSavedData", _resofOfSavedData,primaryDetails,personalDetails, newSpouseUserId);

        if(newSpouseUserId) sessionStorage.setItem('spouseUserId', (newSpouseUserId !== '00000000-0000-0000-0000-000000000000') ? newSpouseUserId : "null");

        let fetApiCall = [dispatch(fetchPrimaryDetails({ userId: primaryUserId }))]
        // if(personalDetails?.noOfChildren > primaryDetails?.noOfChildren){
            let responseChild = await [dispatch(fetchAllChildrenDetails({ userId: primaryUserId }))];
        // }
        if (displaySpouseContent) {
            fetApiCall.push(dispatch(fetchSpouseDetails({ userId: spouseUserId })))
        }

        // @@ fetch api
        const _resfetchAll = await Promise.all(fetApiCall);
        useLoader(false);
            sessionStorage.removeItem("isActivateform");

        // Reseting beneficiary and fiduciary redux data
        resetBenFiduStates();

        toasterAlert("successfully", "Successfully saved data", "Your data have been saved successfully")
        konsole.log("_resfetchAll", _resfetchAll)
        if(([3, 5, 4]?.includes(Number(currentMaritalStatus?.value)) && [1, 2]?.includes(Number(newMaritalStatus?.value))) || ([1]?.includes(Number(currentMaritalStatus?.value)) && [4, 5]?.includes(Number(newMaritalStatus?.value))) || ([2]?.includes(Number(currentMaritalStatus?.value)) && [1, 3]?.includes(Number(newMaritalStatus?.value))) || $AHelper?.$isNullUndefine(personalDetails?.maritalStatusId)){
            window.location.reload()
        }else{
            handleRoute($dashboardLinks[1])
        }
    }

    const updateSessionUserDetailOfPrimary = () => {
        const userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
        const responseData = personalDetails;
        konsole.log("responseDataresponseData", responseData)
        const mName = $AHelper.$isNotNullUndefine(responseData?.mName) ? " " + responseData.mName + " " : " ";
        userDetailOfPrimary.memberName = responseData.fName + mName + responseData.lName;
        sessionStorage.setItem("userDetailOfPrimary", JSON.stringify(userDetailOfPrimary));
    }

    konsole.log("subtenantId", subtenantId)

    const handleClick = async () => {
        const isValidate = primaryPersonalDetailsRef.current.validatePersonalDetail();
        konsole.log("sdjkfhdkjfh",isValidate)
        if (!isValidate) {
            // handleActiveKeys(allkeys)
            return;
        }
        const isValidaateStateBack = await primaryStatusBackgroundRef.current.validateStateBackGround();
        if (!isValidaateStateBack) {
            // handleActiveKeys(allkeys)
            return;
        }
        if ((activeTab !== 'Personal') && !$AHelper.$isCheckNoDeceased(spouseDetailsObj.memberStatusId)) {
            // ''              
        } else {
            const isValidaateStateBackaddress = await contactDetailsRef.current.handleSubmit();
            if (!isValidaateStateBackaddress?.isActive) {
                // handleActiveKeys(allkeys)
                handleSectionClick('Contact')
                return;
            }
            const isValidaateStateBackContact = await contactDetailsRef.current.submitContact();
            if (!isValidaateStateBackContact?.isActive) {
                // handleActiveKeys(allkeys)
                handleSectionClick('Contact')
                return;
            }
        }
        useLoader(true);
        let jsonObjDetails = primaryDetails;
        let jsonObjDetailsForm = personalDetails;


        if (activeTab != headerNav[0].value) {
            jsonObjDetails = spouseDetails;
            jsonObjDetailsForm = spouseDetailsObj;
            if (!$AHelper.$isCheckNoDeceased(spouseDetailsObj.memberStatusId)) {
                jsonObjDetailsForm.memberRelationship.isBeneficiary = false;
                jsonObjDetailsForm.memberRelationship.isFiduciary = false;
                jsonObjDetailsForm.memberRelationship.isEmergencyContact = false;
                jsonObjDetailsForm.memberRelationship.relationshipTypeId = deceaseSpouseRelationId;
            }
            if (jsonObjDetailsForm.memberStatusId == specialNeedMemberStatusId) {
                jsonObjDetailsForm.memberRelationship.isFiduciary = false;
            }
        }
        konsole.log("jsonObjDetailsspouse", jsonObjDetailsForm, spouseDetailsObj, jsonObjDetails, spouseDetails)
        // return;
        let jsonObj = $JsonHelper.createJsonUpdateMemberById({ subtenantId: 2, ...jsonObjDetails, ...jsonObjDetails.memberRelationship, ...jsonObjDetailsForm, ...jsonObjDetailsForm?.memberRelationship, updatedBy: loggedInUserId });
        konsole.log("jsonObjxyz", jsonObj);
        //    for member Relation Data Saved
        if ($AHelper.$isMarried(jsonObj.maritalStatusId) && activeTab == 'Personal') {
            let memberRelationshipJson = jsonObj?.memberRelationship
            memberRelationshipJson.primaryUserId = $AHelper.$isNotNullUndefine(memberRelationshipJson.primaryUserId) ? memberRelationshipJson.primaryUserId : spouseUserId;
            memberRelationshipJson.relationshipTypeId = $AHelper.$isNotNullUndefine(memberRelationshipJson.relationshipTypeId) ? memberRelationshipJson.relationshipTypeId : 1;
            memberRelationshipJson.relativeUserId = $AHelper.$isNotNullUndefine(memberRelationshipJson.relativeUserId) ? memberRelationshipJson.relativeUserId : spouseUserId;

            let url = $Service_Url.postMemberRelationship + `?RelativeMemberID=${primaryDetails?.memberId}`
            konsole.log("primaryDetailsprimaryDetailsaaa", primaryDetails)
            let method = $AHelper.$isNullUndefine(primaryDetails?.memberRelationship) ? 'POST' : 'PUT';
            const _resultOfSavememberRelation = await postApiCall(method, url, memberRelationshipJson)
            konsole.log("_resultOfSavememberRelation", _resultOfSavememberRelation);
            delete jsonObj.memberRelationship;
        }
        if (activeTab == 'Personal' && !$AHelper.$isMarried(jsonObj.maritalStatusId)) {
            delete jsonObj.memberRelationship;
        }
        // const _result = await postApiCall('PUT', $Service_Url.putUpdateMember, jsonObj);

        // after meking spouse deceased primary member status chenged to widhow
        if (jsonObj.memberStatusId == deceaseMemberStatusId && activeTab != 'Personal' && $AHelper.$isMarried(personalDetails.maritalStatusId)) {
            let jsonObjDetails = primaryDetails;
            let jsonObjDetailsForm = personalDetails;
            let maritalStatusId = personalDetails.maritalStatusId == 1 ? 4 : personalDetails.maritalStatusId == 2 ? 3 : personalDetails.maritalStatusId
            let jsonObj2 = $JsonHelper.createJsonUpdateMemberById({ subtenantId: 2, ...jsonObjDetails, ...jsonObjDetails.memberRelationship, ...jsonObjDetailsForm, ...jsonObjDetailsForm?.memberRelationship, updatedBy: loggedInUserId, maritalStatusId: maritalStatusId });
            delete jsonObj2.memberRelationship;
            // const result = await postApiCall('PUT', $Service_Url.putUpdateMember, jsonObj2);
            const responseData = result?.data?.data?.member;
            dispatch(setPrimaryMemberDetails(responseData));
        }
        // after meking spouse deceased primary member status chenged to widhow    
        konsole.log("_result_result_result", _result)
        if (_result != 'err') {
            const responseData = _result?.data?.data?.member;
            const saveStateBackData = await primaryStatusBackgroundRef.current.saveData(responseData.userId);

            // @@ this is for Spouse data fetch;
            if (activeTab == headerNav[0].value && primaryDetails?.maritalStatusId == null && $AHelper.$isMarried(jsonObj.maritalStatusId)) {
                const resultOfSpouse = await dispatch(fetchSpouseDetails({ userId: responseData?.spouseUserId }))
                konsole.log("resultOfSpouse", resultOfSpouse)
            }
            if (activeTab == headerNav[0].value) {
                dispatch(setPrimaryMemberDetails(responseData));
            }
            if (activeTab != headerNav[0].value) {
                dispatch(setSpouseMemberDetails(responseData));
            }
            if (($AHelper.$isMarried(responseData.maritalStatusId) || responseData.maritalStatusId == 4) && activeTab == headerNav[0].value) {
                handleActiveTab(headerNav[1].value)
                // handleActiveKeys(allkeys)
            } else {
                handleRoute($dashboardLinks[1])
                // handleActiveKeys(allkeys)
            }
        }
        // toasterAlert("successfully", "Successfully saved data", "Your data have been saved successfully")
        useLoader(false);
    }

    const handleRoute = useCallback((item) => {
        if(uiState?.accessFromIframe != true) $AHelper.$dashboardNextRoute(item.route);
    }, [uiState?.accessFromIframe]);

    // @konsole part 
    konsole.log("primaryDetailsPersonalInfo", primaryDetails);
    konsole.log("personalDetailsaa", personalDetails, spouseDetailsObj)

    const btnLabel = useMemo(() => {
        let label = ''
        if (activeTab == headerNav[0].value && ($AHelper.$isMarried(primaryDetails?.maritalStatusId) || primaryDetails?.maritalStatusId == 4)) {
            label = `Save & Proceed to ${spouseFullName} Information`;
        } else {
            label = "Save & Proceed to Family Information"
        }
        return label;

    }, [activeTab, primaryDetails, primaryDetails?.maritalStatusId, spouseFullName])
    // change accordian  value based on selection
    let _accordia1Name = `${primaryMemberFullName} Details`
    let _accordia2Name = 'Status & Background Information';
    let _accordia3Name = 'Contact & Address Information';

    if (activeTab !== headerNav[0].value) {
        _accordia1Name = `${spouseFullName} Details`;
        _accordia2Name = `${spouseFullName} Status & Background Information`;
        _accordia3Name = `${spouseFullName} Contact & Address Information`;
    }
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }

    // const handleActiveKeys = (val) => {
    //     setActiveKeys(val)
    // }

    const personalInfoObj = {
        isJointAccount: isJointAccount,
        header: (((isPrimaryMemberMaritalStatus == true) || ($AHelper.$isNotNullUndefine(spouseUserId)) && primaryDetails?.maritalStatusId == 4)) ? headerNav2 : [],
        handleActiveTab: handleActiveTab, activeTab: activeTab
    }

    const displaySpouseContent = useMemo(() => {
        let value = ((isPrimaryMemberMaritalStatus == true) || ($AHelper.$isNotNullUndefine(spouseUserId)) && primaryDetails?.maritalStatusId == 4) ? true : false;
        return value;
    }, [isPrimaryMemberMaritalStatus, spouseUserId, primaryDetails])

     
    // const mdxlUi = useMemo(() => {
    //     return {
    //         md: spouseUserId ? 5 : 10,
    //         xl: spouseUserId  ? 5 : 10,
    //     };
    // }, [spouseUserId]);

    const mdxlUi = useMemo(() => {
        return {
            md: spouseUserId ? 5 : 10,
            xl: spouseUserId ? (personalDetails?.maritalStatusId == 3 ? 12 : 5) : 10,
            // md: (personalDetails?.maritalStatusId != 3 || personalDetails?.maritalStatusId != 5) ? 5 : 10,
            // xl: (personalDetails?.maritalStatusId != 3 || personalDetails?.maritalStatusId != 5) ? (personalDetails?.maritalStatusId == 3 ? 12 : 5) : 10,
        };
    }, [spouseUserId, personalDetails?.maritalStatusId]);

    // konsole
    konsole.log("spouseDetails", spouseDetails)
    konsole.log("detailsForMemberStatus", detailsForMemberStatus,JSON.stringify(maritalStatusList));
    konsole.log("personalDetailspersonalDetails", personalDetails, isPrimaryMemberMaritalStatus, primaryDetails);
    konsole.log("spouseUserIdspouseUserId", spouseUserId);
    konsole.log("isJointAccountSpouse", isJointAccount)

    const upsertMetaData = () => {
        let dataToUpsert = {
            userId: userId,
            userSubjects: [{
            responseId: formlabelQuestion?.label1040?.question?.response?.[0]?.responseId,
            subResponseData: planningInput?.response,
            subjectId: formlabelQuestion?.label1040?.question?.questionId,
            userSubjectDataId: planningInput?.userSubjectDataId
            }]
        }

        if(planningInput?.userSubjectDataId != 0) postApiCall("PUT", $Service_Url.putSubjectResponse, dataToUpsert );
    
        if (dataToUpsert?.length) {
            useLoader(true)
            postApiCall("POST", $Service_Url.postaddusersubjectdata, dataToUpsert);
            useLoader(false)
        }
    
        konsole.log("upsertData:", dataToUpsert);
    }; 

    const userId = primaryUserId;

    const fectchsubjectForFormLabelId = async () => {
        const questionFormLabelId = [1040];

        useLoader(true);
        const formQuestion = await $ApiHelper.$getSujectQuestions(questionFormLabelId);
        const questionObj = formQuestion?.reduce((TempResult, curElement) => {
            if(curElement) TempResult["label" + curElement.formLabelId] = curElement;
            konsole.log("TempResultcurElement", TempResult, curElement);
            return TempResult;
        }, {});
        konsole.log("questionObjquestionObj", questionObj);
        setFormlabelQuestion(questionObj);
        useLoader(false);
        
        konsole.log("formQuestionformQuestion", formQuestion)
        if(formQuestion != 'err') {
            useLoader(true);
            let apiCalls = formQuestion?.map(obj => {
                let url = $Service_Url.getSubjectResponse + userId + `/0/0/${obj?.question?.questionId}`;
                return getApiCall('GET', url)?.then(result => {
                    konsole.log("Apiresult", result);
                    if (result != 'err' && result?.userSubjects.length > 0) {
                        return result.userSubjects;
                    } else {
                        return null;
                    }
                }).catch(error => {
                    konsole.log("apiError", error);
                    return null;
                });
            });

            Promise?.all(apiCalls)?.then((results) => {
                konsole.log("resultsresults", results)
                let questionResponse = results?.filter(response => response !== null)?.flat(1);
                konsole.log("questionsInHelper", questionResponse?.find(ele => ele.responseId == '462'));
                setFormlabelData(questionResponse);
                setplanningInput(questionResponse?.find(ele => ele.responseId == '462'));
            }).catch((error) => {
                konsole.log(error);
            }).finally(() => useLoader(false));
        };
    };
          konsole.log(formlabelQuestion, "formlabelQuestionformlabelQuestion")
          konsole.log(planningInput, "planningplanningInputInput")

      
          const handleObjective = (value) => {
            setplanningInput((prev) => ({
                ...prev,
                ['response']: value  
            }));
        };
        
        konsole.log(planningInput?.response,"planningInput?.response")

    return (
        <div className="setup-personalInformation" style={{ backgroundColor: "white" }}>

            {/* @@CUSTOM HEADR TILE  */}

            <Row>
                <div>
                            <Row className='personalInformation' id='personalinformation'>
                                 <div>
                                    <h1 className='heading-of-sub-side-links'>Personal Information</h1>
                                    <p className='heading-of-sub-side-links-2'>View and edit your personal information here.</p>
                                 </div>

                                <Row className='useNewDesignSCSS'>
                                <Col xs={3} sm={3} md={3} className='main_Heading'>{formlabelQuestion?.label1040?.question?.question}</Col>
                                <Col xs={8} md={8} lg={8} id='objectivePlaning' className='mx-2'>
                                 <CustomTextareaObjective
                                  tabIndex={1}
                                  value={planningInput?.response || ""}
                                  placeholder='Enter planning objective'
                                  onChange={handleObjective} 
                                   />
                                </Col>
                                </Row>   

                                <Col xs={12} md={12} xl={3} className='sticky-column'>
                                    <div className={`${activeSection == 'Personal' ? 'active-section' : 'Dactive-section'}`}
                                     onClick={() => handleSectionClick('Personal')} >
                                     <h3 className='main_Heading'>Personal Details</h3>
                                     {activeSection == 'Personal' && (
                                    <div className="heading-of-sub-side-links-4">{contentObject.personalContent}</div>)}
                                    </div>
                                    
                                    <div className={`${activeSection == 'Status' ? 'active-section' : 'Dactive-section'}`} 
                                    onClick={() => handleSectionClick('Status')}
                                    >
                                    <h3 className='main_Heading'>Status & Background Information</h3>
                                    {activeSection == 'Status' && (
                                    <div className="heading-of-sub-side-links-4">{contentObject.statusContent}</div>)}
                                    </div>
                                    
                                    <div className={`${activeSection == 'Contact' ? 'active-section' : 'Dactive-section'}`}
                                     onClick={() => handleSectionClick('Contact')}>
                                    <h3 className='main_Heading'>Contact & Address Information</h3>
                                    {activeSection == 'Contact' && (
                                    <div className="heading-of-sub-side-links-4">{contentObject.contactAddressContent}</div>)}
                                    </div>
                                </Col>
                                
                                <Col xs={12} md={12} xl={9}>
                                   <div className='pt-2' id="personal" ref={personalRef} data-section="Personal" >
                                        {displaySpouseContent && <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi} />}
                                    <Row className='d-flex gap-2 mt-3 '>
                                        <Col xs={12} {...mdxlUi}>
                                            <PersonalDetails
                                                ref={primaryPersonalDetailsRef}
                                                refrencePage="PersonalInformation"
                                                type={headerNav[0].value}
                                                action='EDIT'
                                                isSideContent={contentObject.personalContent}
                                                dataInfo={personalDetails}
                                                setPersonalDetails={setPersonalDetails}
                                                startTabIndex={2}
                                            />
                                        </Col>
                                        {displaySpouseContent && (
                                            <Col xs={12} {...mdxlUi}>
                                                <PersonalDetails
                                                    ref={spousePersonalDetailsRef}
                                                    refrencePage='PersonalInformation'
                                                    type={headerNav[1].value}
                                                    action='EDIT'
                                                    isSideContent={contentObject.spousePersonalContent}
                                                    dataInfo={spouseDetailsObj}
                                                    isWidow = {personalDetails?.maritalStatusId == 4}
                                                    personalDetails={personalDetails}
                                                    setPersonalDetails={setSpouseDetailsObj}
                                                    startTabIndex={18}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                 </div>

                                    <div className='pt-2' id="status" ref={statusRef} data-section="Status">
                                        {displaySpouseContent && <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi}/>}
                                    <Row className='d-flex gap-2 mt-3'>
                                        <Col xs={12} {...mdxlUi}>
                                            <StatusBackGround
                                                startTabIndex={2 + 16 + 16} 
                                                ref={primaryStatusBackgroundRef}
                                                refrencePage='PersonalInformation'
                                                type={headerNav[0].value}
                                                isSideContent={contentObject.statusContent}
                                                userId={primaryUserId}
                                                maritalStatusId = {personalDetails?.maritalStatusId}
                                                setPersonalDetails={setPersonalDetails}
                                                setSpouseDetailsObj = {setSpouseDetailsObj}
                                                spouseDetailsObj={spouseDetailsObj}
                                                dataInfo={personalDetails}
                                                detailsForMemberStatus={{ ...detailsForMemberStatus, name: detailsForMemberStatus?.name, genderId: personalDetails?.genderId }}
                                                checkMaritalStatus={changeMaritalStatus}
                                            />
                                        </Col>
                                        {displaySpouseContent && (
                                            <Col xs={12} {...mdxlUi}>
                                                <StatusBackGround
                                                    startTabIndex={2 + 16 + 16 + 38} 
                                                    ref={spouseStatusBackgroundRef}
                                                    refrencePage='PersonalInformation'
                                                    type={headerNav[1].value}
                                                    isSideContent={contentObject.spouseStatusContent}
                                                    userId={spouseUserId}
                                                    maritalStatusId = {personalDetails?.maritalStatusId}
                                                    setPersonalDetails={setSpouseDetailsObj}
                                                    dataInfo={{ ...spouseDetailsObj, 'noOfChildren': personalDetails?.noOfChildren}}
                                                    detailsForMemberStatus={{ ...detailsForMemberStatus, name: detailsForMemberStatus?.name, genderId: personalDetails?.genderId }}
                                                />
                                            </Col>
                                         )}
                                    </Row>
                                 </div>                          
                     
                           <div className='pt-1' id="contact"  ref={contactRef} data-section="Contact" >
                            {/* <ContactAndAddress
                                startTabIndex={2 + 16 + 16 + 35 + 35}
                                refrencePage='PersonalInformation'
                                ref={contactDetailsRef}
                                primaryUserId={primaryUserId}
                                spouseUserId={spouseUserId}
                                type={activeTab} 
                                isSideContent={activeTab == 'Personal' ? contentObject.contactAddressContent : contentObject.spouseContactAddressContent}
                                setPersonalDetails={activeTab == 'Personal' ? setPersonalDetails : setSpouseDetailsObj}
                                dataInfo={activeTab == 'Personal' ? personalDetails : spouseDetailsObj}
                                showType="both"
                                isMandotry={true}
                                isJointAccount={isJointAccount}
                                showInvite={showInvite}
                            /> */}


                        <UniversalAddress 
                        isSideContent={activeTab == 'Personal' ? contentObject.contactAddressContent : contentObject.spouseContactAddressContent}
                        refrencePage='PersonalInformation'
                        primaryUserIds={primaryUserId}
                        ref={contactDetailsRef}
                        spouseUserIds={spouseUserId}
                        showType="both"
                        isMandotry={true}
                        dataInfo={activeTab == 'Personal' ? personalDetails : spouseDetailsObj}
                        type={activeTab} 
                        isJointAccount={isJointAccount}
                        startTabIndex={2 + 16 + 16 + 38 + 38}
                        showInvite={showInvite}
                        />

                            </div>
                      {/* </div>)}   */}
                       
                       </Col>

                 </Row>
                </div>
            </Row>
            <Row style={{ marginTop: '24px' }}>
                <div className='d-flex flex-row-reverse'>
                    <CustomButton tabIndex={2 + 16 + 16 + 38 + 38 + 18}  onClick={() => handleSave()} label={uiState?.accessFromIframe === true ? 'Update' : 'Save & Proceed to Family Information'} />
                </div>
            </Row>

        </div>
    );
};



export const HeaderOfPrimarySouseName = ({ displaySpouseContent, mdxlUi,isGap }) => {

    const { primaryMemberFullName, spouseFullName, isPrimaryMemberMaritalStatus, _spousePartner,primaryMemberFirstName,spouseFirstName, } = usePrimaryUserId();
    konsole.log("_spousePartner", _spousePartner)

    return (
        <Row className={`d-flex mt-3 ${isGap == true ? "" : "gap-2"}`}>
            <Col xs={12} {...mdxlUi} className='burialhorcemetryCol'>
                <span className='selectedUserName'>
                    <img className="m-0 me-2" width='18px' src='/New/newIcons/PersonalInfo-active.svg' />
                    {primaryMemberFirstName ? primaryMemberFirstName : ''} (Primary)
                </span>
            </Col>
            {displaySpouseContent && (
                <Col xs={12} {...mdxlUi} className='burialhorcemetryCol'>
                    <span className='selectedUserName'>
                    <img className="m-0 me-2" width='18px' src='/New/newIcons/PersonalInfo-active.svg' />
                        {spouseFirstName ? spouseFirstName : ''} ({$AHelper?.capitalizeFirstLetterFirstWord(_spousePartner)})
                    </span>
                </Col>
            )}
        </Row>
    );
}

export default PersonalInformation;