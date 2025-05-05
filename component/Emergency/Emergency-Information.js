import React, { useState, useEffect, useMemo, useRef, useContext, useCallback } from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { CustomInputSearch, CustomRadioSignal, CustomSelect, CustomInput, CustomTextarea, CustomCheckBox, CustomMultipleSelect } from '../Custom/CustomComponent';
import { useAppDispatch, useAppSelector } from '../Hooks/useRedux';
import { $AHelper } from '../Helper/$AHelper';
import { selectorEmergency, selectorHealth } from '../Redux/Store/selectors';
import { livingMemberStatusId, deceaseMemberStatusId, specialNeedMemberStatusId } from '../../components/Reusable/ReusableCom';
import {
    updateFamilyMemberList, updatePhysicionList, updateBloodTypeList, updateUserFamilyMember, updateEmergencyCardUserList, updateUserMedicationList,
    updateUserPhysicionUserList, updatePhysicianAddress, updateMembersAddress, updateMemberContact, updateFamilyMemberDetail, updateMemberDetail,
    updateEmergencyMobileEmailDetail, updatePhysicianContact, updateEmergencyQuestions, updateEmergencyUserResponse, updateEmergencyPriority,
    updateAllergyType, updateUserAllergiesList
} from '../Redux/Reducers/emergencySlice';

import { getApiCall, isNullUndefine, postApiCall } from '../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../components/network/UrlPath';
import konsole from '../../components/control/Konsole';
// import { $ } from '../../components/control/Konsole';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import { useLoader } from '../utils/utils';
import { $JsonHelper } from '../Helper/$JsonHelper';
import { $ApiHelper } from '../Helper/$ApiHelper';
import AddMedications from './AddMedications';
import EmergencyCard from './EmergencyCard';
import { globalContext } from '../../pages/_app';
import { CustomButton, CustomButton2, CustomButton3 } from '../Custom/CustomButton';
import OtherInfo from '../../components/asssets/OtherInfo';
import { fetchmedication, fetchUsermedication } from '../Redux/Reducers/healthISlice';
import AddEmergencyContact from './AddEmergencyContact';

const emergencyContactObj = () => {
    return { "emergencyContactId": 0, "emergencyContactUserId": null, "isActive": false, "emerContactPriorityId": 0, 'isEmergencyChecked': false }
}
const physicianObj = () => {
    return { "emergencyPhysicianId": 0, "emergencyPhysicianUserId": null, "isActive": false, 'isPhysicianChecked': false }
}
const allergiesObj = () => {
    return { "allergiesId": 0, "allergiesTypeId": 0, "isActive": false }
}

const EmergencyInformation = () => {

    const { primaryUserId, spouseUserId, loggedInUserId, primaryDetails, _spousePartner } = usePrimaryUserId();
    const { setConfirmation, confirm, setWarning } = useContext(globalContext)

    const dispatch = useAppDispatch();
    const emergencySelector = useAppSelector(selectorEmergency);
    const {
        physicionList, userEmergencyMember, familyMembersList, bloodTypeList, emergencyCardUserList, userMedicationList,
        userPhysicionList, physicianAddress, membersAddress, memberContactsList, emergencyMobileEmailDetail, emergencyQuestionsList,
        emergencyUserResponseList, emergencyPriorityList, allergyTypeList, userAllergiesList } = emergencySelector;


    const [ques459, setQues459] = useState({});
    const [ques948, setQues948] = useState({});
    const [render, setrender] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState([]);
    const [emergencyInfo, setEmergencyInfo] = useState({ ...$JsonHelper.$emergencyCardjson({ upsertedBy: loggedInUserId }) })
    const [emergencyMemberId, setEmergencyMemberId] = useState([]);
    const [addMedication, setaddMedication] = useState(false);
    const [emergencyCard, setemergencyCard] = useState(false);
    const [activeBtn, setActiveBtn] = useState(1);
    const [addEdit, setaddEdit] = useState(false);
    const tableHeader = ["Medication", "Dosage", "Frequency", "Timing", "Note", "Edit/Delete"]
    const tableHeaderEmergency = ["Name", "Email", "Address", "Relationship", "Phone"]
    const tableHeaderPhysician = ["Name", "Email", "Speciality", "Phone"]
    const [emergencycontactchecked, setemergencycontactchecked] = useState(false)
    const { newConfirm } = useContext(globalContext)
    const [editUser, setEdituser] = useState({ ...$JsonHelper.newFormDataObj() })
    // const [searchValue, setSearchValue] = useState(null);
    const [addEmergencyContact,setAddemergencycontact] = useState(false);
    const [allFamilyMembers,setAllFamilyMembers] = useState([])
    const [openEmergencyCard,setOpenEmergencyCard] = useState(false)
    const [userID, setuserID] = useState('')
    const [bloodtypejson,setBloodtypeJson] = useState({})


    konsole.log("asjkhfjk", primaryDetails)
    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(primaryUserId) && $AHelper.$isNotNullUndefine(primaryDetails)) {
            getFamilyMembers();
            // fetchProfessionalList(primaryUserId)
            getBloodType();
            fetchData(primaryUserId,'GetProfrssionals');
            getEmergencyPriority();
            getAllergyType();

        }
    }, [primaryDetails, primaryUserId]);

    // useEffect(() => {
    //     if ($AHelper.$isNotNullUndefine(primaryUserId)) {
    //         getFamilyMembers();
    //     }
    // }, [primaryUserId,addEmergencyContact==false]);

    const userId = useMemo(() => {
        return activeBtn === 1 ? primaryUserId : spouseUserId;
    }, [activeBtn, primaryUserId, spouseUserId]);


    //Method for listing the users(radiobuttons) of whose the emergency card is generated and we push the details of primary user also.
    const getFamilyMembers = async () => {
        const response = await getApiCall('GET', `${$Service_Url.getFamilyMembers}${primaryUserId}`, '');
        konsole.log("AddedFamilyDetails", response);
        let familyList = response;
        let primaryObj = {...primaryDetails,...primaryDetails?.memberRelationship,'relationshipTypeId':'1','relationshipName':'Primary','isEmergencyContact':primaryDetails?.memberRelationship?.isEmergencyContact == undefined ? false : primaryDetails?.memberRelationship?.isEmergencyContact,"memberStatusId":1}
        familyList.unshift(primaryObj)
        setAllFamilyMembers(familyList)
        const flattenMember = (member) => {
            if (member.memberRelationship) {
                return { ...member, ...member.memberRelationship, memberRelationship: undefined };
            }
            return member;
        };

        const flattenedResponse = response.map(flattenMember);
        let familymemberCard = flattenedResponse.filter((member) => {
            let age = $AHelper.$isNotNullUndefine(member.dob) ? $AHelper.$getAge($AHelper.$getFormattedDate(member.dob)) : null;
            konsole.log("AgeOfFamilyMember", age);
            return member?.memberStatusId != 2 && (member.relationshipTypeId == 1 && member.relativeUserId == primaryUserId) || (((member.relationshipTypeId == 2 ||
                member.relationshipTypeId == 5 || member.relationshipTypeId == 6 || member.relationshipTypeId == 28 ||
                member.relationshipTypeId == 29 || member.relationshipTypeId == 41) && age < 18 && $AHelper.$isNotNullUndefine(age)))
        })
        familymemberCard = [primaryDetails, ...familymemberCard];
        konsole.log("primaryDetails", primaryDetails);
        konsole.log("getFamilyMembersFromStore1", familyMembersList);
        if (response !== 'err') {
            dispatch(updateFamilyMemberList(familymemberCard));
        }
        konsole.log("getFamilyMembersFromStore", familyMembersList);
    };

    useEffect(()=>{
        if(familyMembersList?.length > 0 && !selectedUser?.userId){
            handleRadioChange(familyMembersList[0]?.userId,familyMembersList[0])
        }
        if(selectedUser?.userId){
            handleRadioChange(selectedUser?.userId,selectedUser,'no-fetchApi')
        }
    },[familyMembersList,primaryUserId])

    useEffect(() => {
    if(familyMembersList?.[0]?.fName) handleRadioChange(familyMembersList[0]?.userId,familyMembersList?.[0]);
    }, [familyMembersList?.[0]?.fName])

    //Binding Blood Type Dropdown 
    const getBloodType = async () => {
        dispatch(fetchmedication())
        if (bloodTypeList.length == 0) {
            const response = await getApiCall('GET', `${$Service_Url.getBloodType}`, '');
            konsole.log("responsegetbloodtype", response);
            if (response !== 'err') {
                dispatch(updateBloodTypeList(response));
            }
        }
    }


    const getEmergencyPriority = async () => {
        if (emergencyPriorityList.length == 0) {
            useLoader(true);
            const response = await getApiCall('GET', $Service_Url.GetEmerContactPriority, '');
            useLoader(false);

            if (response != "err") {
                konsole.log(response, "responseGetEmerContactPriority");
                dispatch(updateEmergencyPriority(response));
            }
        }
    }

    const getAllergyType = async () => {
        if (allergyTypeList.length == 0) {
            useLoader(true);
            const response = await getApiCall('GET', $Service_Url.getAllergiesType, '');
            useLoader(false);

            if (response != "err") {
                konsole.log(response, "responseGetgetAllergiesType");
                dispatch(updateAllergyType(response));
            }
        }
    }

    //On change of user - the emergency contacts, physicians and relevant info will be fetched
    const handleRadioChange = async (e, item,type) => {
        konsole.log(type,"handleRadioChange", e, item);
        setSelectedUser(item);
        let userId = item.userId;
        setuserID(userId)
        if(type != "no-fetchApi"){
        fetchData(userId,'professionalApi');
        }
        setemergencycontactchecked(true);
        setSearchQuery('')
    }

    // @@ get Emergency Card Details
    const fetchData = async (userId, fn) => {
        konsole.log("Called From Save", userId, fn);
        let emergencyCardData = emergencyCardUserList;
        konsole.log("emergencyCardDataRadio", emergencyCardData[userId])

        konsole.log("selectedUseruserId1", selectedUser.userId);
        useLoader(true);
        // @@ getting emergency card saved data;
        if ((!$AHelper.$isNotNullUndefine(emergencyCardData[userId])) || (fn === 'CallApi' )) {
            const _result = await getApiCall('GET', $Service_Url.getEmergencyApi + "?UserId=" + userId, '');
            konsole.log("_resultOfEmergencyCard", _result);
            if (_result != 'err' && _result.length > 0) {
                if (!emergencyCardData || !Object.isExtensible(emergencyCardData)) {
                    emergencyCardData = { ...emergencyCardUserList };
                }
                emergencyCardData[userId] = _result[0]
                dispatch(updateEmergencyCardUserList(emergencyCardData))
            }
        }
        if(fn != 'noUpdatestate'){
        setEmergencyInfo({ ...$JsonHelper.$emergencyCardjson({ ...emergencyCardData[userId], 'upsertedBy': loggedInUserId }) })
        }
        let bloodTypeId = emergencyCardData[userId]?.bloodTypeId;
        konsole.log("bloodTypeIdFetch", bloodTypeId)
        // if ($AHelper.$isNullUndefine(bloodTypeId)) {
            konsole.log("fthBldTpSavePrsnlMedData", bloodTypeId)
            fthBldTpSavePrsnlMedData(userId)
        // }

        
        // @@ Emergency Contacts Member
        {
            let isEmergencyMember = userEmergencyMember;
            if (isEmergencyMember.length == 0 || fn === 'CallApi' || fn == 'noUpdatestate') {
                // useLoader(true);
                const responseOfFamily = await getApiCall('GET', $Service_Url.getFamilyMembers + primaryUserId, '');
                let primaryObj = {'userId':primaryUserId,'fName':primaryDetails.fName,'lName':primaryDetails.lName,'relationshipTypeId':'1','relationshipName':'Primary','isEmergencyContact':primaryDetails?.memberRelationship?.isEmergencyContact == undefined ? false : primaryDetails?.memberRelationship?.isEmergencyContact,"memberStatusId":1}
                responseOfFamily.unshift(primaryObj)
                // console.log(responseOfFamily,"responseOfFamily")
                let memberEmergency = responseOfFamily === 'err' ? [] : responseOfFamily?.filter((item) => item?.isEmergencyContact == true);
                konsole.log( responseOfFamily,"memberEmergency1", memberEmergency,primaryDetails);
                if (userId != primaryUserId && primaryDetails?.memberRelationship?.isEmergencyContact == true) {
                    const updatedPrimaryDetails = { ...primaryDetails, relationshipName: 'Primary' };
                    memberEmergency = [updatedPrimaryDetails, ...memberEmergency]
                    konsole.log("memberEmergency2", memberEmergency);
                }
                isEmergencyMember = memberEmergency

                dispatch(updateUserFamilyMember(memberEmergency))
            }
            konsole.log("emergencyCardData", emergencyCardData)
            let userEmergencyContact = [...(emergencyCardData[userId]?.emergencyContacts || [])];
            konsole.log("userEmergencyContact", userEmergencyContact)
            if (isEmergencyMember.length > 0 && userEmergencyContact.length > 0) {
                let mappedJson = isEmergencyMember.map((item) => {
                    const findValue = userEmergencyContact.find((i) => i.emergencyContactUserId == item.userId);
                    // Create the transformed object with `findValue` or default values
                    let json = findValue
                        ? { ...item, ...findValue, isEmergencyChecked: true }
                        : { ...item, ...emergencyContactObj(), 'emergencyContactUserId': item.userId };

                    return json;
                });

                konsole.log("MappedJson", mappedJson);

                // Now filter out records based on the spouse ID condition
                let emrgJson = mappedJson.filter((item) => {
                    konsole.log("selectedUseruserIdXXX", userId);
                    konsole.log("emergencyContactUserIdXXX", userId, item, item.emergencyContactUserId);
                    // Exclude the record if it's the spouse and findValue also matches the spouse
                    return (userId != item.emergencyContactUserId);
                });

                konsole.log("emrgJson", emrgJson);

                dispatchUpdateUserEmergencyContactList(emrgJson);
                const result = emrgJson.map(x => x.emergencyContactUserId);
                setEmergencyMemberId(result);
                fetchMemberDetails(emrgJson);
                konsole.log("After fetchMemberDetails:", userContactDetails);
            } else if (isEmergencyMember.length > 0) {
                let emergencyJson = isEmergencyMember.map((item) => {

                    return { ...item, ...emergencyContactObj(), 'emergencyContactUserId': item.userId }
                })
                konsole.log("emergencyJsonYYY1", emergencyJson)
                emergencyJson = emergencyJson.filter(x => x.emergencyContactUserId != userId)
                konsole.log("emergencyJsonYYY2", emergencyJson)
                dispatchUpdateUserEmergencyContactList(emergencyJson);
                const result = emergencyJson.map(x => x.emergencyContactUserId);
                setEmergencyMemberId(result);
                konsole.log("MemberDetails", result);
                fetchMemberDetails(emergencyJson);
            }
        }

        getsubjectForFormLabelId(userId);

        // User Medication Data
        {
            let updatedMedicationData = userMedicationList;
            if (!$AHelper.$isNotNullUndefine(updatedMedicationData[userId]) || fn === 'CallApi') {
                useLoader(true);
                const response = await getApiCall('GET', $Service_Url.GetUserMedication + userId, '');
                useLoader(false);

                if (response != "err") {
                    konsole.log("SomeErrorOccured", response);
                    if (!updatedMedicationData || !Object.isExtensible(updatedMedicationData)) {
                        updatedMedicationData = { ...userMedicationList }
                    }
                    updatedMedicationData[userId] = response.userMedications;
                    await dispatch(updateUserMedicationList(updatedMedicationData));
                }
                konsole.log("ResponsegetMedicationData", response);
            }
            konsole.log("updatedMedicationData", updatedMedicationData);
        }

                // @@ physician Data
                let _result = '';
                let physicianDetails = physicionList;
                if ((!$AHelper.$isNotNullUndefine(physicianDetails[userId])) || fn === 'CallApi' || fn == 'professionalApi' || fn == 'noUpdatestate' || fn == 'GetProfrssionals' ) {
                    let memberUserId = userId != primaryUserId && userId !== spouseUserId ? primaryUserId : userId;
                    useLoader(true);
                    _result = await getApiCall('GET', $Service_Url.getSearchProfessional + `?MemberUserId=${memberUserId}&ProTypeId=${10}&primaryUserId=${primaryUserId}`);
                    useLoader(false);
                    konsole.log("_resultOfPhysician", _result);
                    if (_result != 'err' && _result.length > 0) {
                        if (!physicianDetails || !Object.isExtensible(physicianDetails)) {
                            physicianDetails = { ...physicionList }; // Create a new extensible object
                        }
                        physicianDetails[userId] = _result;
                        dispatch(updatePhysicionList(physicianDetails))
                        dispatchUpdateUserPhysicianList(_result);
                        
                    }else{
                        dispatch(updatePhysicionList({}))
                        dispatchUpdateUserPhysicianList([]);
                    }
        
                };
                // @@ handle User Physician ;
                
                    physicianDetails = physicionList?.length > 0 ? physicionList : physicianDetails ;
                    let userPhysicianList = [...(emergencyCardData[userId]?.emergencyPhysicians || [])];
                    let physicianList = [...(physicianDetails[userId] || [])];
                    konsole.log("userPhysicianListphysicianDetails", userPhysicianList, physicianList)
                    if (physicianList?.length > 0 && userPhysicianList?.length > 0) {
                        konsole.log("userPhysicianListphysicianDetailsa", userPhysicianList, physicianDetails);
                        let physicianJson = physicianList.map((item) => {
                            fetchPhysicianSavedAddress(userId, item.professionalUserId)
                            const findValue = userPhysicianList.find((i) => i.emergencyPhysicianUserId == item.professionalUserId);
                            let json = findValue ? { ...item, ...findValue, isPhysicianChecked: true } : { ...item, ...physicianObj(), 'emergencyPhysicianUserId': item.professionalUserId }
                            return { ...json };
                        })
                        dispatchUpdateUserPhysicianList(physicianJson)
                    } else if (physicianList.length > 0) {
                        let physicianJson = physicianList.map((item) => {
                            fetchPhysicianSavedAddress(userId, item.professionalUserId)
                            return { ...item, ...physicianObj(), 'emergencyPhysicianUserId': item.professionalUserId }
                        })
                        dispatchUpdateUserPhysicianList(physicianJson);
                    } else {
                        dispatchUpdateUserPhysicianList([]);
                    }
                
        useLoader(false);
    }

    // const fetchProfessionalList = async (userId) => {
    //     let physicianDetails = physicionList[userId];
    //     let _result = '';
    //     let memberUserId = (userId != primaryUserId && userId !== spouseUserId) ? primaryUserId : userId;
    //     useLoader(true)
    //         _result = await getApiCall('GET', $Service_Url.getSearchProfessional + `?MemberUserId=${memberUserId}&ProTypeId=${10}&primaryUserId=${primaryUserId}`);
    //         useLoader(false)
    //         konsole.log(userId,memberUserId,"_resultOfPhysician", _result);
    //         if (_result != 'err' && _result.length > 0) {
    //             if (!physicianDetails || !Object.isExtensible(physicianDetails)) {
    //                 physicianDetails = { ...physicionList }; // Create a new extensible object
    //             }
    //             physicianDetails[userId] = _result;
    //             dispatch(updatePhysicionList(physicianDetails))
    //             // dispatchUpdateUserPhysicianList(_result);
    //         }else{
    //             dispatch(updatePhysicionList({}))
    //             dispatchUpdateUserPhysicianList([]);
    //         }
    // }
    // @@ function call for Reflect blood type from personal medical history
    const fthBldTpSavePrsnlMedData = async (userId) => {
        let bloodTypesubjectId = 218;
        let memberId = userId;
        const _resBloodType = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicId({ memberId: memberId, subjectId: bloodTypesubjectId });
        konsole.log("_resBloodType", _resBloodType);
        if (_resBloodType && _resBloodType != 'err' && _resBloodType?.userSubjects?.length > 0) {
            const _ansRes = _resBloodType?.userSubjects;
            konsole.log("_ansRes", _ansRes);
            const bloodTypeId = _ansRes[0].response;
            setBloodtypeJson(_ansRes[0])
            handeSetStateEmergency('bloodTypeId', bloodTypeId);
        }
    }

    let memberContactObj = {};
    let memberAddressObj = {};

    //This method is responsible for fetching the address , emmails and mobile no of users marked as emergency users.
    const fetchMemberDetails = async (emergencyContactinfo) => {
        try {
            const promises = emergencyContactinfo.map(async (member) => {
                konsole.log("memberId", member.userId);
                const contactDetails = await getMemberContactDetails(member.userId);
                memberContactObj[member.userId] = contactDetails;
                const savedAddress = await getMemberSavedAddress(member.userId);
                memberAddressObj[member.userId] = savedAddress;
                return { memberId: member.userId, contactDetails, savedAddress };
            });


            const results = await Promise.all(promises);

            konsole.log("memberContactObj", memberContactObj);
            konsole.log("memberAddressObjj", memberAddressObj);

            let updatedMemberAddressDetail = memberAddressObj;
            dispatch(updateMembersAddress(updatedMemberAddressDetail));

            let updatedMemberContactDetails = memberContactObj;
            dispatch(updateEmergencyMobileEmailDetail(updatedMemberContactDetails));

            // results.forEach((result) => {
            //     konsole.log(`ResultsforFetchedMemberDetails ${result.memberId}:`, result);
            // });

            konsole.log('Success');
        } catch (error) {
            konsole.error('SomeErrorOccured', error);
        }
    };

    //Emergency Users Contact Details
    const getMemberContactDetails = async (userId) => {

        const combinedKey = `${selectedUser.userId}_${userId}`;
        let updatedMobileEmailDetail = emergencyMobileEmailDetail;

        if (!$AHelper.$isNotNullUndefine(updatedMobileEmailDetail[combinedKey])) {
            useLoader(true);
            const response = await getApiCall("GET", $Service_Url.getcontactdeailswithOther + userId, "");
            useLoader(false);
            konsole.log("responseofgetMemberContactDetails", response);

            if (response === "err") {
                konsole.log("SomeErrorOccured", response);
                return;
            }

            if (!updatedMobileEmailDetail || !Object.isExtensible(updatedMobileEmailDetail)) {
                updatedMobileEmailDetail = { ...emergencyMobileEmailDetail };
            }
            return response;
        }
    }

    //Emergency Users Address Details
    const getMemberSavedAddress = async (userId) => {
        const combinedKey = `${selectedUser.userId}_${userId}`;
        let updatedMemberAddressDetail = membersAddress;
        if (!$AHelper.$isNotNullUndefine(updatedMemberAddressDetail[combinedKey])) {
            useLoader(true);
            const response = await getApiCall('GET', $Service_Url.getAllAddress + userId, '');
            useLoader(false);

            konsole.log("responseofMemberAddresAPI", response);

            if (response === "err") {
                konsole.log("SomeErrorOccured", response);
                return;
            }
            if (!updatedMemberAddressDetail || !Object.isExtensible(updatedMemberAddressDetail)) {
                updatedMemberAddressDetail = { ...membersAddress };
            }
            // memberAddressObj[userId] = response;
            konsole.log("memberAddressObj", memberAddressObj);
            return response;
        }
    }

    const memberResult = useMemo(() => {
        return emergencyMemberId.map(familyMemberId => ({
            contact: emergencyMobileEmailDetail[familyMemberId],
            address: membersAddress[familyMemberId]
        }));
    }, [emergencyMobileEmailDetail, membersAddress, emergencyMemberId]);


    const fetchPhysicianSavedAddress = async (userId, professionalUserId) => {
        let updatedPhysicianAddress = physicianAddress;

        if (!$AHelper.$isNotNullUndefine(updatedPhysicianAddress[userId])) {
            useLoader(true);
            const response = await getApiCall('GET', $Service_Url.getAllAddress + professionalUserId, '');
            useLoader(false);
            konsole.log("responseofPhysicianAddresAPI", response);
            if (response === "err") {
                konsole.log("SomeErrorOccured", response);
                return;
            }
            if (!updatedPhysicianAddress || !Object.isExtensible(updatedPhysicianAddress)) {
                updatedPhysicianAddress = { ...physicianAddress };
            }

            updatedPhysicianAddress[userId] = response;
            await dispatch(updatePhysicianAddress(updatedPhysicianAddress));
        }
        konsole.log("LatestphysicianAddress", updatedPhysicianAddress);
    }


    const dispatchUpdateUserPhysicianList = (phy) => {
        dispatch(updateUserPhysicionUserList(phy))
    }


    const dispatchUpdateUserEmergencyContactList = (det) => {
        dispatch(updateMemberContact(det))
    }

    const handleAllergiesSelect = (id, selectedValues) => {

        konsole.log("userAllergiesList", id, userAllergiesList, selectedValues);

        let updatedAllergiesList = [...userAllergiesList];

        konsole.log("updatedAllergiesList", updatedAllergiesList)

        // Extract the selected value ids
        const selectedValueIds = selectedValues.map(val => val.value);


        // Update or add new allergies
        selectedValueIds.forEach(valueId => {
            konsole.log("valueId", valueId);
            const existingAllergyIndex = updatedAllergiesList.findIndex(allergy => Number(allergy.allergiesTypeId) == valueId);
            konsole.log("existingAllergyIndex", existingAllergyIndex);

            if (existingAllergyIndex === -1) {
                // If the allergy is not in the list, add it
                updatedAllergiesList.push({
                    allergiesId: 0,
                    allergiesTypeId: valueId,
                    isActive: true
                });
            } else {
                // If the allergy is in the list, update it
                updatedAllergiesList[existingAllergyIndex] = {
                    ...updatedAllergiesList[existingAllergyIndex],
                    isActive: true
                };
            }
        });

        // Remove allergies that are no longer selected
        updatedAllergiesList = updatedAllergiesList.filter(allergy => selectedValueIds.includes(allergy.allergiesTypeId));

        konsole.log("updatedAllergiesList", updatedAllergiesList);

        // Dispatch the updated list to the store
        dispatch(updateUserAllergiesList(updatedAllergiesList));
    };

    // @@ handle Physician CheckBox
    const handlePhysicianCheckBox = (e, item, index) => {
        konsole.log("userPhysicionList", userPhysicionList, e.target)
        let userPhysicianList = [...userPhysicionList];
        let updatedPhysician = { ...userPhysicionList[index], isPhysicianChecked: e.target.checked };
        userPhysicianList[index] = updatedPhysician;
        dispatchUpdateUserPhysicianList(userPhysicianList)
    }

    // @@ handle Emergency CheckBox
    const handleEmergencyCheckBox = (e, item, index) => {
        const { emerContactPriorityId } = item;
        let isEmerChecked = e.target.checked;

        const activeContacts = memberContactsList.filter((e) => e.isEmergencyChecked == true);
        // konsole.log("activeContacts", item);

        if (isEmerChecked && activeContacts.length >= 3) {
            let msg = 'Only allows a maximum of three names to be added. You have exceeded this limit';
            toasterWarning(msg);
            return;
        }
        let updatedMemberContactsList = [...memberContactsList];
        const userIndex = updatedMemberContactsList.findIndex((ele)=>ele?.memberId == item?.memberId)
        const calculatePriority = () => {
            if (activeContacts?.every((e) => e.emerContactPriorityId != 1)) {
                return 1;
            } else if (activeContacts?.every((e) => e.emerContactPriorityId != 2)) {
                return 2;
            } else if (activeContacts?.every((e) => e.emerContactPriorityId != 3)) {
                return 3;
            } else {
                return activeContacts.length + 1;
            }

        };


        const updatedEmerContactPriorityId = calculatePriority();

        let updatedContact = { ...updatedMemberContactsList[userIndex], isEmergencyChecked: e.target.checked, emerContactPriorityId: updatedEmerContactPriorityId };

        updatedMemberContactsList[userIndex] = updatedContact;

        // konsole.log("updatedMemberContactsList", userIndex);


        // konsole.log("updatedEmerContactPriorityId", updatedEmerContactPriorityId);
        dispatchUpdateUserEmergencyContactList(updatedMemberContactsList);
    }

    const handeSetStateEmergency = (key, value, event) => {  
        setEmergencyInfo((prev) => {
        //   konsole.log("Previous State:", prev[key], "New Value:", value);
          return {
            ...prev,
            // [key]: prev[key] === value ? null : value, // Toggle logic
            [key]: value, // Toggle logic
          };
        });
      };

    const getsubjectForFormLabelId = async (userId) => {
        konsole.log("emergencyQuestionsList", emergencyQuestionsList);
        let updatedQuestions = emergencyQuestionsList;
        if (emergencyQuestionsList.length == 0) {
            useLoader(true);
            const response = await $ApiHelper.$getSujectQuestions([459,948]);
            useLoader(false);
            konsole.log("responsegetquestions", response);
            if (response !== 'err') {
                updatedQuestions = response;
                dispatch(updateEmergencyQuestions(response));
            }
        }

        if (updatedQuestions.length > 0) {
            fetchResponseWithQuestionId(updatedQuestions, userId);
        }
    };


    const fetchResponseWithQuestionId = (questions, userId, fn) => {

        return new Promise(async (resolve, reject) => {
            let updatedUserResponse = emergencyUserResponseList;
            konsole.log("updatedUserResponse", updatedUserResponse);
            if (!$AHelper.$isNotNullUndefine(updatedUserResponse[userId]) || fn == 'CallApi') {
                useLoader(true);
                const resultOfRes = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicId({ questions: questions, memberId: userId, topicId: 0 });
                useLoader(false);
                konsole.log("Questions", questions);
                konsole.log("resultOfRes", resultOfRes);
                const userSubjectsList = resultOfRes.userSubjects;
                const emergencyQuestionsList = questions
                if (emergencyQuestionsList.length > 0) {
                    let formlabelData = {};
                    for (let quesObj of questions) {
                        let label = "label" + quesObj.formLabelId;
                        formlabelData[label] = { ...quesObj.question }; // Shallow copy of the question object
                        konsole.log("formlabelData[label]", formlabelData[label]);
                        const filterQuestion = userSubjectsList?.filter((item) => item.questionId == quesObj?.question?.questionId);
                        if (filterQuestion?.length > 0) {
                            const resultOfResponse = filterQuestion[0];
                            konsole.log("resultOfResponseresultOfResponse", resultOfResponse);
                            if (formlabelData[label]?.response) {
                                formlabelData[label]["userSubjectDataId"] = resultOfResponse.userSubjectDataId;
                                formlabelData[label].response = formlabelData[label].response.map((response, i) => {
                                    if (response.responseId == resultOfResponse?.responseId) {
                                        konsole.log("resultOfResponse?.responseNature", resultOfResponse?.responseNature)
                                        if (resultOfResponse?.responseNature == 'Radio') {
                                            return { ...response, 'checked': true };
                                        } else if (resultOfResponse?.responseNature == 'Text') {
                                            konsole.log("formlabelDatalabelresultOfResponse", resultOfResponse, response);
                                            return {
                                                ...response, response: resultOfResponse.response
                                            };
                                        }
                                    }
                                    return response;
                                });
                            }
                            formlabelData[label].userSubjectDataId = resultOfResponse.userSubjectDataId;
                        }
                    }

                    if (!updatedUserResponse || !Object.isExtensible(updatedUserResponse)) {
                        updatedUserResponse = { ...emergencyUserResponseList };
                    }

                    konsole.log("formlabelDataformlabelData", formlabelData);

                    // @@ this code block for by default organ donor select No
                    if (formlabelData && formlabelData?.label459 && formlabelData?.label459?.response?.length > 0) {
                        const findData = formlabelData?.label459?.response?.find(item => item?.checked == true);
                        if (!findData) {
                            let responseId = 105;
                            let label = 'label459'
                            const selectedLabelValue = { ...formlabelData[label] };
                            selectedLabelValue.response = selectedLabelValue.response?.map(response => {
                                konsole.log("handleSetState", response);
                                if (response.responseId == responseId) {
                                    return { ...response, checked: true };
                                } else if (response.responseId != responseId) {
                                    return { ...response, checked: false };
                                }
                                return response;
                            });

                            formlabelData[label] = selectedLabelValue;
                            updatedUserResponse[userId] = formlabelData
                            handleUpdateorganQuestion(updatedUserResponse)
                        } else {
                            updatedUserResponse[userId] = formlabelData
                            handleUpdateorganQuestion(updatedUserResponse)
                        }
                    } else {
                        updatedUserResponse[userId] = formlabelData
                        handleUpdateorganQuestion(updatedUserResponse)
                    }

                    resolve('resolve')
                    konsole.log("updatedUserResponse", updatedUserResponse)
                }
                else {
                    resolve('resolve')
                }

            }
        })
    }

    const handleUpdateorganQuestion = (formlabelData) => {
        dispatch(updateEmergencyUserResponse(formlabelData));
    }
    const userResponse = useMemo(() => {
        return emergencyUserResponseList[selectedUser?.userId];
    }, [emergencyUserResponseList, selectedUser]);

    const userAllergy = useMemo(() => {
        return userAllergiesList || [];
    }, [userAllergiesList])

    const formattedUserAllergy = useMemo(() => {
        return (userAllergy || []).map(allergy => {
            // Find the allergy type object with the matching ID

            konsole.log("userAllergyuserAllergy", userAllergy);
            const allergyType = allergyTypeList.find(x => x.value == allergy.allergiesTypeId);

            konsole.log("WXYZ", allergy, allergyTypeList, allergyType)

            // If a matching allergy type is found, use its label; otherwise, use a default label
            return {
                value: allergy.allergiesTypeId,
                label: allergyType ? allergyType.AllergiesType : 'Unknown Allergy'
            };
        });
    }, [userAllergy, allergyTypeList]);

    konsole.log("ABCD", userResponse, emergencyUserResponseList)
    konsole.log("formattedUserAllergy", formattedUserAllergy);
    konsole.log("ABCUserAllergy", userAllergy);
    // konsole.log("emergencyInfoemergencyInfo",emergencyInfo)

    const saveData = () => {
        // konsole.log(ques459,"ques459")
        return new Promise(async (resolve, reject) => {

            let userSubject = []
            let bloodTypeJson = {"userSubjectDataId":bloodtypejson?.userSubjectDataId == undefined ? 0 : bloodtypejson?.userSubjectDataId,"subjectId":218,"subResponseData":emergencyInfo?.bloodTypeId,"responseId":420}
            userSubject.push(bloodTypeJson)
            if ($AHelper.$objectvalidation(ques459)) {
                userSubject.push(ques459)
            }
            if($AHelper.$objectvalidation(ques948)){
                userSubject.push(ques948)
            }
            if (userSubject.length == 0) {
                resolve('no-data');
            } else {
                // konsole.log("dssssssssuserSubjectsubResponseData",userSubject,userSubject[0].subResponseData,userSubject[0].userSubjectDataId,$AHelper.$isNullUndefine(userSubject[0].userSubjectDataId),"-------",userSubject?.[0].subResponseData==false && !$AHelper.$isNullUndefine(userSubject[0].userSubjectDataId))
                if(userSubject?.[0].subResponseData==false && !$AHelper.$isNullUndefine(userSubject[0].userSubjectDataId))
                {
                    let arrayToDelete=userSubject.map((data)=>({userSubjectDataId:data.userSubjectDataId}))
                    // konsole.log("arrayToDeletearrayToDelete12",arrayToDelete)
                    await postApiCall("DELETE", $Service_Url.deleteSubjectUser+"?UserId="+userId, arrayToDelete);
                    await fetchResponseWithQuestionId(emergencyUserResponseList, selectedUser.userId, 'CallApi');
                    resolve(resultOfsubjectsData)
                    return;
                }
                const jsonObj = { userId: selectedUser.userId, userSubjects: userSubject }
                konsole.log('jsonObjOrgan', jsonObj)
                const resultOfsubjectsData = await postApiCall('PUT', $Service_Url.putSubjectResponse, jsonObj)
                // konsole.log(bloodTypeJson,"resultOfsubjectsData", resultOfsubjectsData)
                if (resultOfsubjectsData != 'err') {
                    fetchResponseWithQuestionId(emergencyUserResponseList, selectedUser.userId, 'CallApi');
                }
                resolve(resultOfsubjectsData)
            }
            
        })
    }

    // @@ handle Is organ donor change radio
    const handleOrganChange = (e, labelData, label, setState, type,item) => {

        // konsole.log("dsssssssssssss",e?.target?.checked)
        // konsole.log("completeToglleData",e, labelData, label, setState, type)
        // konsole.log("labelDatalabelData",labelData)
        const isChecked = type == 'Radio' ? e.target.checked : e;
        const responseId = type == 'Radio' ? e.target.id : 283;    
        const userSubjectDataId = (labelData?.userSubjectDataId) ? labelData?.userSubjectDataId : 0;
        // konsole.log("userSubjectDataIduserSubjectDataId",userSubjectDataId)
        const questionId = labelData?.questionId;
        handleSetState(label, responseId, isChecked, type);
        let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: isChecked, userId: selectedUser.userId });
        if(type == 'Radio'){
            json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: isChecked, userId: selectedUser.userId })
        }else{
            json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: e, userId: userId })
            handeSetStateEmergency('allergiesToMedications', e)
        }
        konsole.log("jsonjson", json)
        setState(json)
        konsole.log("ques459ques459", ques459)
    }

    const handleSetState = (label, responseId, value, type) => {

        konsole.log("formLabelformLabel", label);
        const formLabelInformation = { ...emergencyUserResponseList[userId] };
        konsole.log(emergencyUserResponseList,"formLabelInformation1", formLabelInformation);
        const selectedLabelValue = { ...userResponse[label] };
        konsole.log("selectedLabelValue1", selectedLabelValue);

        selectedLabelValue.response = selectedLabelValue.response?.map(response => {
            konsole.log("handleSetState", response);
            if(type == 'text'){
                return { ...response, response: value };
            }else{
            if (response.responseId == responseId) {
                return { ...response, checked: value };
            } else if (response.responseId != responseId) {
                return { ...response, checked: null };
            }
        }
            return response;
        });

        konsole.log("selectedLabelValue2", selectedLabelValue);

        let form1 = formLabelInformation;
        form1[label] = selectedLabelValue;

        formLabelInformation[selectedUser.userId] = { ...emergencyUserResponseList, ...form1 };
        konsole.log("formLabelInformation2", formLabelInformation);
        dispatch(updateEmergencyUserResponse(formLabelInformation));

    }


    const isValidateEmergency = () => {

        if (selectedUser.length == 0) {
            toasterWarning('Select contact to generate Emergency Card')
            return false;
        }

        // if ($AHelper.$isNullUndefine(emergencyInfo.allergiesToMedications)) {
        //     toasterWarning("Allergies is not provided");
        //     return false;
        // }

        if ($AHelper?.$isNullUndefine(userResponse?.label948?.response?.[0]?.response)) {
            toasterWarning("Allergies is not provided");
            return false;
        }

        if (memberContactsList?.filter((e) => e?.isEmergencyChecked == true)?.length <= 0) {
            toasterWarning("Emergency contacts is not selected");
            return false;
        }
        if (userPhysicionList?.filter((e) => e?.isPhysicianChecked == true)?.length <= 0) {
            toasterWarning("Physician contact information is not selected");
            return false;
        }
        return true;
    }

    const onSave = async () => {

        konsole.log("EmergencyInfo", emergencyInfo);
        konsole.log("EmergencyContacts", memberContactsList);
        konsole.log("EmergencyPhysicians", userPhysicionList);

        if (Object.keys(emergencyInfo)?.length == 0)
            konsole.log("Empty Objects");

        if ($AHelper.$isNullUndefine(emergencyInfo.userId))
            emergencyInfo.userId = selectedUser.userId;

        let jsonObj = {...emergencyInfo,"allergiesToMedications":userResponse?.label948?.response[0]?.response};
        konsole.log("jsonObjemergencyInfo", jsonObj);
        if (!$AHelper.$isNotNullUndefine(jsonObj.pinCode)) {
            let randomNumber = Math.floor(Math.random() * 10000000000) + 1;
            jsonObj['pinCode'] = randomNumber;
        }

        jsonObj['emergencyContacts'] = memberContactsList?.filter((item) => ((item.isEmergencyChecked == true) ||
            (item.emergencyContactId != 0 && $AHelper.$isNotNullUndefine(item.emergencyContactId))))?.map((item) => {
                return { "emergencyContactId": item.emergencyContactId, "emergencyContactUserId": item.emergencyContactUserId, "isActive": item.isEmergencyChecked, "emerContactPriorityId": item?.emerContactPriorityId }
            })

        jsonObj['emergencyPhysicians'] = userPhysicionList?.filter((item) => x => x.userId == selectedUser.userId &&
            (item.emergencyPhysicianId != 0 && $AHelper.$isNotNullUndefine(item.emergencyPhysicianId)))?.map((item) => {
                return { "emergencyPhysicianId": item.emergencyPhysicianId, "emergencyPhysicianUserId": item.emergencyPhysicianUserId, "isActive": item.isPhysicianChecked }
            })

        jsonObj['isOrganDonor'] = userResponse?.label459?.response?.filter((e)=>{return e.checked == true})[0].responseId == 104 ? true : false;

        konsole.log("jsonObj", jsonObj);
        konsole.log("selectedUserselectedUser", selectedUser);

        //@@TODO

        // if (selectedUser.length == 0) {
        //     toasterWarning('Select contact to generate Emergency Card')
        //     return;
        // }

        // if ($AHelper.$isNullUndefine(emergencyInfo.allergiesToMedications)) {
        //     toasterWarning("Allergies is not provided");
        //     return;
        // }

        // if (memberContactsList?.filter((e) => e?.isEmergencyChecked == true)?.length <= 0) {
        //     toasterWarning("Emergency contacts is not selected");
        //     return;
        // }
        // if (userPhysicionList?.filter((e) => e?.isPhysicianChecked == true)?.length <= 0) {
        //     toasterWarning("Physicians contact information is not selected");
        //     return;
        // }
        //@@TODO

        if (jsonObj && isValidateEmergency()) {
            useLoader(true);
            saveData();
            const response = await postApiCall('POST', $Service_Url.upsertEmergencyCardApi, [jsonObj]);
            useLoader(false);
            if (response != 'err') {
                fetchData(selectedUser.userId, 'CallApi');
                //@@ Toaster - TODO
                toasterAlert("successfully", "Successfully saved data", `Your data have been saved successfully`);

            }
            else {
                //@@ Toaster - TODO
                toasterWarning("Something went wrong");
            }
        }
    }

    const getEmergencyContactPriority = (priorityId) => {
        const foundPriority = emergencyPriorityList?.find((e) => e.value == priorityId);
        return (foundPriority) ? `(${foundPriority.label})` : '';
    }

    const userPhysicialLisDetails = useMemo(() => {
        return userPhysicionList;
    }, [userPhysicionList,physicionList])

    const userContactDetails = useMemo(() => {
        return memberContactsList;
    }, [memberContactsList])

    const physicianAddressValue = useMemo(() => {
        return physicianAddress[selectedUser?.userId];
    }, [physicianAddress, selectedUser]);

    const filteredUserContactDetails = useMemo(() => {
        // console.log(memberContactsList,"memberContactsList")
        if (!searchQuery) return memberContactsList;

        return memberContactsList.filter(data =>
            (data.fName + " " + data.lName).toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, memberContactsList]);

    // Handler for search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e);
    };

    const addMedicationBtn = () => {
        setaddMedication(true);
    }

    const handleViewEmergencyBtn = () => {
        if (emergencycontactchecked == false || isValidateEmergency() == false) {
            toasterAlert("warning", "Warning", "Kindly save the details before you view the card.");
            return;
        }
        if (isValidateEmergency()) {
            setemergencyCard(true);
        }
    }


    // @@ toaster for success 
    const toasterWarning = (msg) => {
        toasterAlert("warning", "Warning", msg);
    }
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }

    const deleteMember = async (data) => {

        const confirmRes = await newConfirm(true, "Are you sure you want to delete this medication ? This action cannot be undone.", "Confirmation", "Delete Medication", 2);

        if (!confirmRes) return;
        useLoader(true);
        // handleSubmitData(data);
        let deleteJson = { ...data, isActive: false }
        let jsonObj = {
            'userId': selectedUser?.userId,
            'userMedications': [deleteJson],
            'UpsertedBy': userId
        }
        const responseMedication = await postApiCall('POST', $Service_Url.UpsertUserMedication, jsonObj)

        if (responseMedication != 'err') {
            toasterAlert("successfully", "Successfully", `Medication has been deleted successfully.`);
            fetchMedicationDataApi(selectedUser?.userId)
        }
        useLoader(false);
    }

    const handleSubmitData = async (data) => {
        let deleteJson = { ...data, isActive: false }
        let jsonObj = {
            'userId': userId,
            'userMedications': [deleteJson],
            'UpsertedBy': userId
        }
        const responseMedication = await postApiCall('POST', $Service_Url.UpsertUserMedication, jsonObj)

        if (responseMedication != 'error') {
            fetchMedicationDataApi(userId)
        }
        useLoader(false);
    }

    const fetchMedicationDataApi = async (userId) => {
        {
            let updatedMedicationData = userMedicationList;
            useLoader(true);
            const response = await getApiCall('GET', $Service_Url.GetUserMedication + userId, '');
            useLoader(false);
            if (!updatedMedicationData || !Object.isExtensible(updatedMedicationData)) {
                updatedMedicationData = { ...userMedicationList }
            }
            updatedMedicationData[userId] = response !== 'err' ? response.userMedications : []
            await dispatch(updateUserMedicationList(updatedMedicationData));
            konsole.log("ResponsegetMedicationData", response);

            konsole.log("updatedMedicationData", updatedMedicationData);
        }

    }

    const isvalidate = () => {
        let isErr = false;
        if (!editUser.medicationId || editUser.medicationId == 0) {
            setError(" Medication type  cannot be empty");
            isErr = true;
        }
        return isErr == false;
    }

    const updateMember = (data) => {
        setaddEdit(true);
        setEdituser(data);
        setaddMedication(true)

    }


    const selectedUserMedicationList = useMemo(() => {
        return userMedicationList[selectedUser?.userId] ?? []
    }, [selectedUser, userMedicationList])

    const handleAddAnother = () => {
        setEdituser({ ...$JsonHelper.newFormDataObj() })
    }


    const bloodType = useMemo(() => {
        let noneObj = { value: 10, label: "None" };
        let data = bloodTypeList;
        if (data && Object.isExtensible(data)) {
            data.push(noneObj);
        } else {
            data = (data || []).concat(noneObj);
        }
        return data
    }, [bloodTypeList])

    konsole.log("bloodTypebloodTypebloodType", bloodType)
    konsole.log("selectedUserMedicationList", selectedUserMedicationList)
    konsole.log("userPhysicionListuserPhysicionList", userPhysicionList, selectedUser);
    konsole.log("physicianAddressValuephysicianAddressValue", physicianAddressValue);
    konsole.log("userContactDetailsuserContactDetails", userContactDetails); 
    konsole.log("userMemuserResponse", userResponse);
    konsole.log("userMemouserAllergy", userAllergy);
    konsole.log("userResponseuserResponse", userResponse)
    konsole.log('familyMembersList',familyMembersList)
    konsole.log("memberContactsLis1111t",filteredUserContactDetails)

    const removeDuplicates = (data, key) => {
        const seen = new Set();
        return data.filter(item => {
          if (seen.has(item[key])) {
            return false;
          }
          seen.add(item[key]);
          return true;
        });
    };
    
    const handleContact = () => {
        // konsole.log(allFamilyMembers.filter(e=> e.isEmergencyContact == false && e.memberStatusId != 2 && selectedUser.userId != e.userId),"filteredUserContactDetailshjhj")
        if (allFamilyMembers?.filter(e=> e.isEmergencyContact == false && e?.memberStatusId != 2 && selectedUser?.userId != e?.userId)?.length == 0) {
            toasterAlert("warning", "Warning", "No contacts declared as emergency contacts in your form.");
            return;
        } 
        else {
            setAddemergencycontact(true);
        }
    };
    
    // console.log(userResponse?.label948,"userResponselabel948")
    
    return (
        (!addMedication && !emergencyCard) ?
            <>
                <Row>
                    <Col xs={12} md={12} className="mb-4 ms-3 p-4 mx-2" style={{background:'white',borderRadius:'8px'}}>
                        <h1 className="li-heading-class">Emergency</h1>
                        <p className='mt-10 li-sub-heading-class fs-14'>Welcome to the Emergency!</p>
                    </Col>
                </Row>
                <div className="d-flex Emergency col-12">
                <Row md={12} className='col-2'>
                    <div>
                        <div>
                            <ul className='d-sm ps-3' style={{ listStyleType: "none" }}>
                                <p className='li-sub-heading-class' style={{fontSize:'13px'}}>Generate Emergency Cards For :</p>
                            </ul>
                        </div>
                        <div className={"mt-3 ms-3 CustomSubSideBarLinks-sidebar"}>
                            {familyMembersList.map((item, index) => {
                                if (item.memberStatusId !== deceaseMemberStatusId) {
                                    return <>
                                        <div className={`py-0 pt-0 mt-0 ${selectedUser?.userId == item.userId ? "d-flex align-items-center active-" : "" } nav-item-div justify-content-start my-0 cursor-pointer`} key={index} onClick={(e) => selectedUser?.userId == item.userId ? '' : handleRadioChange(item.userId, item)}>
                                        <img className='mt-0' src={`/New/newIcons/${selectedUser?.userId == item.userId ? "newDashboardlineActive" : "newDashboardline2"}.svg`} style={{height:"30px"}}/>
                                            <span className={`ms-0 fs-13 d-flex gap-2 align-items-center ${selectedUser?.userId == item?.userId ? "activeName" : ""}`}><img className='mt-0' width="14px" src={`/New/newIcons/${selectedUser?.userId == item.userId ? "emeregencyUser-active" : "emergencyUser"}.svg`} style={{height:"30px"}}/>
                                            {$AHelper.capitalizeFirstLetterFirstWord(item?.fName) + `${" "}` + $AHelper.capitalizeFirstLetterFirstWord(item?.lName)}{item?.relationshipName ? (item?.relationshipName == 'spouse' || item?.relationshipName == 'Spouse') ? ` (${$AHelper.capitalizeFirstLetterFirstWord(_spousePartner)})` : ` (${item.relationshipName})` : " (Me)"}</span>
                                            {/* <CustomRadioSignal key={index} id={index} value={item.userId == selectedUser?.userId} label={item?.fName + `${" "}` + item?.lName} onChange={(e) => handleRadioChange(e, item)} /> */}
                                        </div>
                                    </>
                                }

                            })}
                        </div>
                    </div>
                </Row>
                {/* @@ after member selection display all content */}
                {($AHelper.$isNotNullUndefine(selectedUser?.userId)) &&
                    <div className="col-10 background-white ms-2">
                        <Row className="mt-10 pb-2 px-2 mt-10">
                            <h4 style={{fontSize:'16px'}}><span className="fw-bold">&nbsp;{$AHelper.capitalizeFirstLetterFirstWord(selectedUser?.fName)+" "+
                            $AHelper.capitalizeFirstLetterFirstWord(selectedUser?.lName)}</span> {selectedUser?.relationshipName ? (selectedUser?.relationshipName == 'spouse' || 
                            selectedUser?.relationshipName == 'Spouse') ? ` (${$AHelper.capitalizeFirstLetterFirstWord(_spousePartner)})` : ` (${selectedUser.relationshipName})` : " (Me)"}</h4>
                        </Row>
                        <Row className='' md={12} >
                            <Col xs="12" sm="12" md="8" lg="8" className='ps-4 '>
                                <p className='li-heading-class'>Blood Type</p>
                                <CustomSelect
                                    className="w-100 mt-10"
                                    label=''
                                    value={emergencyInfo.bloodTypeId}
                                    id='bloodTypeId'
                                    options={bloodType}
                                    placeholder='Select Blood Type'
                                    onChange={(e) => handeSetStateEmergency('bloodTypeId', e.value)}
                                />

                            </Col>
                            <Col>
                            {emergencyInfo?.pinCode != null && <div className='d-flex justify-content-end gap-2 cursor-pointer me-3' >
                                            <div>
                                                <img width="14px" src="/icons/emergency-card-img.svg" className='' />
                                            </div>
                                            <div className='d-flex  align-items-center cursor-pointer'>
                                                <h6 className='mt-2 sample-card-tag-h6 text-decoration-underline fw-bold' style={{ fontSize:'14px', color: "#390711" }} onClick={handleViewEmergencyBtn} >View Emergency Card </h6>
                                            </div>
                                        </div>}</Col>
                        </Row>
                        <Row style={{ marginTop: "10px"}}>
                            <Col className=''>
                                {(userResponse?.label459) &&
                                    <Row>
                                        {/* <Col xs="12" sm="12" md="4" lg="4" className=''> */}
                                            <h5 className='w-50 li-heading-class ms-3'>Organ Donor:</h5>
                                        {/* </Col> */}
                                        <Col xs="12" sm="12" md="6" lg="6">
                                            <div className='radio-container d-flex mt-5 radio-class flex-column ms-3' >
                                                {/* <p className=''>Select Preference.</p> */}
                                                <div className='d-flex flex-wrap gap-1 mt-2'>
                                                    {userResponse?.label459?.response?.map((item, index) => {
                                                        { konsole.log("UserResponseOrganItem", item) }
                                                        let isChecked = item?.checked === true ? true : '';
                                                        return (
                                                            <CustomRadioSignal
                                                                key={index}
                                                                name={index}
                                                                value={isChecked}
                                                                id={item?.responseId}
                                                                label={item.response}
                                                                onChange={(e) => handleOrganChange(e, userResponse?.label459, 'label459', setQues459, 'Radio',item)}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                }
                                <Row className='d-flex'>
                                    {/* <Col xs="12" sm="12" md="4" lg="4" className=' mt-3'> */}
                                        <h5 className='w-50 li-heading-class ms-3'>Dependents At Home:</h5>
                                    {/* </Col> */}
                                    <Col xs="12" sm="12" md="6" lg="6">
                                        <div className='radio-container d-flex radio-class flex-column ms-3' >
                                            {/* <p>Select Preference.</p> */}
                                            <div className='d-flex flex-wrap gap-1 mt-5'>
                                                <CustomRadioSignal
                                                    key={'yesDepen'}
                                                    id={'yDependentsAtHome'}
                                                    value={emergencyInfo.isDependentsHome == true}
                                                    label={'Yes'}
                                                    onChange={(e) => handeSetStateEmergency('isDependentsHome', true,e)}
                                                />
                                                <CustomRadioSignal
                                                    key={'noDepen'}
                                                    id={'nDependentsAtHome'}
                                                    value={emergencyInfo.isDependentsHome == false}
                                                    label={'No'}
                                                    onChange={(e) => handeSetStateEmergency('isDependentsHome', false,e)}
                                                />
                                            </div>
                                        </div>
                                    </Col>

                                </Row>
                                <Row>
                                    {/* <Col xs="12" sm="12" md="4" lg="4" className=''> */}
                                        <h5 className='w-50 li-heading-class ms-3'>Pets At Home:</h5>
                                    {/* </Col> */}
                                    <Col xs="12" sm="12" md="12" lg="12">

                                        <div className='radio-container d-flex flex-column radio-class ms-3'>
                                            {/* <p >Select Preference.</p> */}
                                            <div className='d-flex flex-wrap gap-1 mt-5'>
                                                <CustomRadioSignal
                                                    key={'yPet'}
                                                    id={'yPetsAtHome'}
                                                    value={emergencyInfo.isPetsAtHome == true}
                                                    label={'Yes'}
                                                    onChange={(e) => handeSetStateEmergency('isPetsAtHome', true,e)}
                                                />
                                                <CustomRadioSignal
                                                    key={'nPets'}
                                                    id={'nPetsAtHome'}
                                                    value={emergencyInfo.isPetsAtHome == false}
                                                    label={'No'}
                                                    onChange={(e) => handeSetStateEmergency('isPetsAtHome', false,e)}
                                                />
                                            </div>
                                        </div>
                                        <div className="ms-3">
                                            {emergencyInfo.isPetsAtHome == true &&
                                                <CustomTextarea
                                                    className="w-100"
                                                    label=""
                                                    placeholder="Description"
                                                    id='petsDescription'
                                                    value={emergencyInfo.petsAtHome}
                                                    notCapital={true}
                                                    onChange={(e) => handeSetStateEmergency('petsAtHome', e)} />}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className='mt-10'>
                            <Col className='ps-4' xs="12" sm="12" md="12" lg="12" >
                                <p className='li-heading-class'>Allergies to Medications*</p>
                                    <CustomTextarea
                                        className="w-100 mt-5"
                                        label=""
                                        placeholder="Enter the medicines you are allergic to"
                                        id='allergiesToMedications'
                                        value={userResponse?.label948?.response[0]?.response}
                                        onChange={(e) => handleOrganChange(e, userResponse?.label948, 'label948', setQues948, 'text')}
                                    />
                            </Col>
                        </Row>
                        <Row className='mt-10'>
                            <Col xs="12" sm="12" md="12" lg="12" className="ps-4" >
                                    <p className="li-heading-class">List any other allergies or reactions</p>
                                    <CustomTextarea
                                        className="w-100 mt-5"
                                        label=""
                                        placeholder="What medications you take ?"
                                        id='allergiesDescription'
                                        value={emergencyInfo.allergiesDescription}
                                        onChange={(e) => handeSetStateEmergency('allergiesDescription', e)}
                                    />
                            </Col>
                        </Row>
                        <Row className='mt-10'>
                            <Col className=' rounded col-12 ms-auto ps-4' style={{ padding: "0px 15px" }}>
                                <div id="information-table" className="mt-2 information-table mb-0">
                                    <div className='d-flex justify-content-between align-items-center p-2 m-2 my-1 py-1  '>
                                        <div className='d-flex p-2 ps-1 medicationTake'>
                                            <h4>Medications You Take</h4>
                                            <span className='ms-3 addedNum'>{userMedicationList[selectedUser.userId]?.length}  Added</span>
                                        </div>
                                        <CustomButton onClick={addMedicationBtn} label={"Add Medications"} />
                                    </div>
                                    <div className='table-responsive fmlyTableScroll'>
                                        <Table className="custom-table mb-0">
                                            <thead className="sticky-header">
                                                <tr>
                                                    {tableHeader.map((item, index) => (
                                                        <th key={index} className={`${item == 'Edit/Delete' ? 'text-end' : ''}`}  >{item}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className=''>
                                                {userMedicationList[selectedUser.userId]?.map((item, index) => {
                                                    const { medicationName, doseAmount, frequency, time, doctorPrescription } = item;
                                                    return (
                                                        <tr key={index}>
                                                            <td><OtherInfo key={index} othersCategoryId={38} userId={userId} othersMapNatureId={item.userMedicationId} FieldName={item.medicationName || "-"} /></td>
                                                            <td>{doseAmount || "-"}</td>
                                                            <td>{frequency || "-"}</td>
                                                            <td>{time || "-"}</td>
                                                            <td>{doctorPrescription || "-"}</td>
                                                            <td>
                                                                <div className="d-flex justify-content-end gap-3">
                                                                    <img src="/New/icons/edit-Icon.svg" alt="Edit Icon" className="icon cursor-pointer" onClick={() => updateMember(item)} />
                                                                    <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer" onClick={() => deleteMember(item)} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>

                                        </Table>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mx-1 mt-10">
                            <Col md="12" lg="12" className='ms-auto'>
                                <div className=''>
                                    <div id="information-table" className="mt-2 information-table mb-0">
                                    <div className='d-flex justify-content-between p-2 px-0 mx-0'>
                                        <div className='d-flex p-2 medicationTake align-items-center'>
                                            <h4>Emergency Contacts*</h4>
                                            <span className='ms-3 addedNum'>{removeDuplicates(filteredUserContactDetails,"userId").length}  Added</span>
                                        </div>
                                        <div className='col-7 d-flex justify-content-end gap-3'>
                                            <div className='col-md-6 align-items-center h-100 justify-content-end'>
                                            <CustomInputSearch
                                                // className="w-100"
                                                isEroor=''
                                                label=''
                                                id='search'
                                                placeholder='Search Contact'
                                                value={searchQuery}
                                                onChange={(e) => handleSearchChange(e)}
                                            />
                                            </div>
                                            <div className="me-3">
                                            <CustomButton onClick={handleContact} label={"Add as Emergency Contact"} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='table-responsive fmlyTableScroll'>
                                        <Table className="custom-table mb-0">
                                            <thead className="sticky-header">
                                                <tr>
                                                    {tableHeaderEmergency.map((item, index) => (
                                                        <th key={index}>{item == 'Name' ? (<div className="ps-3 ms-3">{item}</div>) :item}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className=''>
                                                {removeDuplicates(filteredUserContactDetails,"userId")?.map((item, index) => {
                                                    let fullName = item?.fName + " "+ (item?.lName ?? item?.fName)
                                                    let member = memberResult.find(data => data?.contact?.userId === item.userId)
                                                    let emailId = member?.contact?.contact?.emails?.length > 0 ? member.contact.contact.emails[0].emailId : 'Not available';
                                                    let address = member?.address?.addresses?.length > 0 ? member.address.addresses[0].addressLine1 : 'Not available';
                                                    let relationship = (item?.relationshipName == 'spouse' || item?.relationshipName == 'Spouse' || item?.relationshipName == 'Primary') ? _spousePartner : userID  == spouseUserId ? item?.rltnTypeWithSpouse : item?.relationshipName;
                                                    let phoneNumber = member?.contact?.contact?.mobiles?.length > 0 ? $AHelper.$formatNumber(member.contact.contact.mobiles[0].mobileNo) : 'Not available';
                                                    return item.memberStatusId !== deceaseMemberStatusId && (
                                                        <tr key={index}>
                                                            <td style={{minWidth:'170px',height:'100%'}}><div className='d-flex align-items-center gap-1'>
                                                                <CustomCheckBox key={index} id={index} value={item?.isEmergencyChecked == true} label={''} onChange={(e) => handleEmergencyCheckBox(e, item, index)} hideLabel={true} />
                                                                    <p className="mt-1">{fullName}  {item?.isEmergencyChecked == false ? '' : getEmergencyContactPriority(item?.emerContactPriorityId)}</p></div></td>
                                                            <td>{emailId || "-"}</td>
                                                            <td>{address || "-"}</td>
                                                            <td>{$AHelper?.$capitalizeFirstLetter(relationship) || "-"}</td>
                                                            <td>{phoneNumber || "-"}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>

                                        </Table>
                                    </div>
                                </div>

                                    
                                    
                                </div>

                            </Col>
                        </Row>
                        <Row className='mt-10'>
                            <Col xs="12" sm="12" md="12" lg="12" className='pt-2'>
                                <div className='information-table mx-3 mb-0'>
                                    <div className='d-flex justify-content-between p-2  '>
                                        <div className='d-flex p-2 medicationTake'>
                                            <h4>Physician*</h4>
                                            <span className='ms-3 addedNum'>{removeDuplicates(userPhysicialLisDetails,"proUserId").length}  Added</span>
                                        </div>
                                        {/* <CustomButton onClick={addMedicationBtn} label={"Add Medications"} /> */}
                                    </div>
                                    <div className='table-responsive fmlyTableScroll'>
                                        <Table className="custom-table mb-0">
                                            <thead className="sticky-header">
                                                <tr>
                                                    {tableHeaderPhysician.map((item, index) => (
                                                        <th key={index}>{item == 'Name' ? (<div className="ps-4 ms-3">{item}</div>) :item}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className=''>
                                                {removeDuplicates(userPhysicialLisDetails,"proUserId")?.map((item, index) => {
                                                    let fullName = item?.fName +" "+ (item?.lName ?? item?.fName)
                                                    let emailId = item?.emaidIds ? item?.emaidIds : 'Not available';
                                                    let specialist = item?.proType
                                                    let phoneNumber = item?.mobileNumbers?.split(',')?.length > 0 ? item?.mobileNumbers?.split(',')?.map((e,index)=>{return <p>{$AHelper?.$formatNumber(e)}{index < item?.mobileNumbers?.split(',').length - 1 ? ',' : ''}</p>}) : 'Not available';
                                                    if(item?.userId == spouseUserId ? selectedUser?.userId != spouseUserId : false) return "";

                                                    return item.memberStatusId !== deceaseMemberStatusId && (
                                                        <tr key={index}>
                                                            <td ><div className="d-flex gap-1 align-items-center"><CustomCheckBox key={index} id={index} value={item?.isPhysicianChecked == true} label={''} onChange={(e) => handlePhysicianCheckBox(e, item, index)} hideLabel={true} /> {fullName}</div></td>
                                                            <td>{emailId || "-"}</td>
                                                            {/* <td>{address || "-"}</td> */}
                                                            <td>{specialist || "-"}</td>
                                                            <td style={{width:'150px'}}>{phoneNumber || "-"}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>

                                        </Table>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "10px" }}>
                                <div>
                                    <ul className='d-sm ps-4 mb-0' style={{ listStyleType: "none" }}>
                                        <li className='li-heading-class'>Medical Conditions</li>
                                    </ul>
                                </div>
                            <Col xs="12" sm="12" md="12" lg="12" >
                                <div className='ms-3'>
                                    <CustomTextarea
                                        className="w-100 mt-5"
                                        label=""
                                        placeholder="Enter medical conditions ..."
                                        id='medications'
                                        value={emergencyInfo.medicalConditions}
                                        onChange={(e) => handeSetStateEmergency('medicalConditions', e)}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "10px", }}>
                                <div>
                                    <ul className='ps-3 mb-0' style={{ listStyleType: "none" }}>
                                        <h1 className='li-heading-class'>Additional Information</h1>
                                    </ul>
                                </div>
                            <Col md="12" lg="12" >
                                <div className='ms-3 mt-5'>
                                    <CustomTextarea
                                        label=""
                                        placeholder="Enter ..."
                                        id='additionalInfo'
                                        value={emergencyInfo.addinationalInfo}
                                        onChange={(e) => handeSetStateEmergency('addinationalInfo', e)}>
                                    </CustomTextarea>

                                </div>
                            </Col>

                        </Row>
                        <Row className='' >
                            <div className='d-flex justify-content-between px-4 align-items-center mb-3'>
                                        <div className='d-flex justify-content-start align-items-center gap-2 cursor-pointer' >
                                            <div>
                                                <img width="14px" src="/icons/emergency-card-img.svg" className='' />
                                            </div>
                                            <div className='d-flex  align-items-center cursor-pointer'>
                                                <h6 className='mt-2 sample-card-tag-h6 text-decoration-underline fw-bold' style={{ fontSize:'14px', color: "#390711" }} onClick={handleViewEmergencyBtn} >View Emergency Card </h6>
                                            </div>
                                        </div>
                                <div className='d-flex'>
                                    <div>
                                        <Col>
                                            <CustomButton onClick={() => onSave()} label={"Save"} />
                                        </Col>
                                    </div>
                                </div>
                            </div>
                        </Row>
                    </div> 
                    //   :
                    //    <Row className="col-10 background-white pb-0 ms-2">
                    //      <img style={{width:"150px"}} className='mx-auto mt-4' width="10px" height="auto" src="/NEW/newIcons/emergencyError.svg" />
                    //     <p className="text-center no-data-found-emergency mt-0 pt-3">Please select a user from left hand bar to<br/>generate emergency card for:</p>
                    //  </Row> 
                     } 
                    </div>
                    {addEmergencyContact == true ? (<AddEmergencyContact setAddemergencycontact={setAddemergencycontact} allFamilyMembers={allFamilyMembers} fetchData={fetchData} selectedUser={selectedUser} toasterAlert={toasterAlert} setSelectedUser={setSelectedUser} _spousePartner={_spousePartner} getFamilyMembers={getFamilyMembers} />):''}
            </>
             : addMedication ? (<AddMedications setaddMedication={setaddMedication} userId={userId} addEdit={addEdit} setaddEdit={setaddEdit} editUser={editUser} setEdituser={setEdituser} selectedUser={selectedUser} userMedicationList={selectedUserMedicationList} fetchApi={fetchMedicationDataApi} setrender={setrender} />)
                : (<EmergencyCard emergencyCard={emergencyCard} setemergencyCard={setemergencyCard} selectedUser={selectedUser} filteredUserContactDetails={removeDuplicates(filteredUserContactDetails,"userId")} primaryDetails={primaryDetails} bloodTypeId={emergencyInfo.bloodTypeId} _spousePartner={_spousePartner} userPhysicionList={userPhysicionList} />)
    )
}


export default EmergencyInformation;
