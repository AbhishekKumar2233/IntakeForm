import React, { useEffect, useState, useRef, useCallback, useImperativeHandle, dispatch, forwardRef, useMemo, useContext, } from 'react';
import { useAppSelector, useAppDispatch } from '../../Hooks/useRedux';
import { selectApi } from '../../Redux/Store/selectors';
import { useDispatch } from 'react-redux';
import { Form, Col, Row, Button, Table } from 'react-bootstrap';
import { fetchUniversalAddress } from '../../Redux/Reducers/apiSlice';
import { $AHelper } from '../../Helper/$AHelper';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import InviteSpouse from '../../Personal-Information/InviteSpouse';
import UniversalAddressContactModal from './UniversalAddressContactModal';
import { useLoader } from '../../utils/utils';
import { $Service_Url } from '../../../components/network/UrlPath';
import { getApiCall,postApiCall,focusInputBox,getApiCall2 } from '../../../components/Reusable/ReusableCom';
import OtherInfo from '../../../components/asssets/OtherInfo';
import CustomToolTip from '../CustomTooltip';
import { globalContext } from '../../../pages/_app';
import CustomIconTooltip from '../CustomIconTooltip';
import { separateCountryCodeAndNumber } from './ReusableAddressContact';
import { CustomButton4 } from '../CustomButton';
import { CustomSelect,CustomInput,CustomRadio  } from '../CustomComponent';
import ContactRezex from './ContactRezex';
import { updateIsPrimaryAddress,updateIsSpouseAddress } from '../../Redux/Reducers/personalSlice';
import { $Msg_AddressDetails } from '../../Helper/$MsgHelper';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { initMapScript } from '../../../components/control/AHelper';
import Other from '../../../components/asssets/Other';
import { setIsJointAccount } from '../../Redux/Reducers/personalSlice';
import { fetchContactType,fetchAddressType,fetchCountyRef,fetchComType,fetchPrimaryUserAddressData,fetchUserContactData } from '../../Redux/Reducers/apiSlice';
// import konsole from '../../../components/control/Konsole';
const UniversalAddress = forwardRef((props,ref) => {
  // konsole.log("renderTest-UniversalAddress")

  const {isSideContent,refrencePage,primaryUserIds,spouseUserIds,dataInfo,type,startTabIndex,showInvite,userId,isChildSpouse,businessInterestAddressId,isMandotry,isChild,showType,showOnlyForm,isContactForm,isShowingDescription,isChildOther} = props


    const defaultAddressFields = {
        addressLine1: '', countyRefrence: '', apt: '',country: 'United States', city: '',
        latitude: null, state: '', zipcode: '', longitude: null, addressTypeId: null, county: '', countyRefId:''
    };
    const defaultContactFields = {
        contactTypeId: null, comeTypes: "1",countryCode: "+1",otherContact: '',mobileNumber:"",email:"",contactTypeLabel:""
    };
    const newObjErr = () => ({addressTypeIdErr: "",otherErr: "", emailErr: "", mobileErr: "", contactTypeIdErr: "", comeTypeErr: "" });

    const apiData = useAppSelector(selectApi);
    const [errMsg, setErrMsg] = useState(newObjErr());
    const [addressDetails, setAddressDetails] = useState(defaultAddressFields);
    const [contactDetails, setContactDetails] = useState(defaultContactFields);
    // const [primaryIdBySession, setPrimaryIdBySession] = useState()
    // const [spouseIdBySession, setspouseIdBySession] = useState()
    const [isChecked, setisChecked] = useState(false)
    const [primaryMemberAddress, setPrimaryMemberAddress] = useState()
    const [primaryMemberContact, setPrimaryMemberContact] = useState()
    const [spouseMemberAddress, setSpouseMemberAddress] = useState()
    const [spouseMemberContact, setSpouseMemberContact] = useState()
    const [spousePartenrEmailVerified, setSpousePartenrEmailVerified] = useState()
    const [spouseEmailActiveData, setspouseEmailActiveData] = useState()
    const [nonPrimarySpouseContact, setNonPrimarySpouseContact] = useState()
    const [nonPrimarySpouseAddress, setNonPrimarySpouseAddress] = useState()
    const [showAddressContactModal, setShowAddressContactModal] = useState(false)
    const [nonPrimarySpouseId, setNonPrimarySpouseId] = useState()
    const [loggedInUserRoleId, setloggedInUserRoleId] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setmodalType] = useState('')
    const [editIndex, seteditIndex] = useState(-1)
    const addressRef = useRef(null)
    const [addressTypeLable, setAddressTypeLable] = useState("")
    const [editJsonData, setEditJsonData] = useState()
    const tableHeader = ['Address Type', 'Address', `Edit/Delete${refrencePage == "PersonalInformation" ? "/Add" : ""}`]
    const tableHeader1 = ['Contact Type', 'Email', 'Phone', `Edit/Delete${refrencePage == "PersonalInformation" ? "/Add" : ""}`]
    const { loggedInUserId, primaryUserId, spouseUserId, primaryDetails, isPrimaryMemberMaritalStatus, _spousePartner, primaryMemberFullName, spouseFullName, spouseFirstName, primaryMemberFirstName } = usePrimaryUserId();
    const {universaladdressFormate,relationTypeList,countyRef,comType,contactType,addressType} = apiData
    const startingTabIndex = startTabIndex ?? 0;
    const dispatch = useDispatch();
    const searchInput = useRef(null)
    const {newConfirm, setWarning } = useContext(globalContext)
    const [natureId, setNatureId] = useState(null)
    const {contactTypeId,comeTypes,countryCode,otherContact,mobileNumber,email,contactTypeLabel} = contactDetails
    const {addressLine1,countyRefrence,apt,country,city,latitude,state,zipcode,longitude, addressTypeId,county,countyRefId} = addressDetails
    const isNotNullUndefined = (data) => $AHelper?.$isNotNullUndefine(data);
    const lableName = props?.type == "ADD-EXTENDED-FAMILY" ? "spouse/partner" : _spousePartner;
    const [checkRoleWithVerifiedMail, setCheckRoleWithVerifiedMail] = useState("")
    const [userRelations, setUserRelations] = useState('')
    const primaryIdBySession = primaryUserId;
    const spouseIdBySession = spouseUserId;

   
    useEffect(() => {
      let primaryUserIdNew = sessionStorage.getItem("SessPrimaryUserId") || "";
      let spouseId = sessionStorage.getItem("spouseUserId")
      const isNotNullUndefine = (value) => $AHelper?.$isNotNullUndefine(value);
    
      // Helper function to fetch data based on userId and update state
      const fetchUserData = (id, setAddress, setContact) => {      
        if (isNotNullUndefine(id) && id !== 0) {
          fetchApiNext(id, setAddress, setContact);
        }
      };
    
      if (refrencePage === "PersonalInformation") { 
      
        if(isNotNullUndefine(primaryUserIdNew) && primaryUserIdNew !== 0){
          fetchUserData(primaryUserIdNew, setPrimaryMemberAddress, setPrimaryMemberContact);
        } 
        if (isPrimaryMemberMaritalStatus && isNotNullUndefine(spouseId) && spouseId !== 0) { 
          fetchUserData(spouseId, setSpouseMemberAddress, setSpouseMemberContact);
        }
        // fetchApi();
      } 
  
  
      else if (isNotNullUndefine(userId) || ["BusinessIntrests","RealEstate", "Liabilities", "professional", "transportation", "lenderData", "activationForm","Non-Retirement"].includes(refrencePage)) {
        setisChecked(false)
        if (!isNotNullUndefine(userId)) {
          setNonPrimarySpouseContact([]);
          setNonPrimarySpouseAddress([]);
        }     
        setNonPrimarySpouseId(userId);
        if ((!["RealEstate","BusinessIntrests"].includes(refrencePage)) && isNotNullUndefined(userId) && userId !== 0) {
        fetchApiNext(userId);
      }      
       
        // fetchApi(userId);
    
        if (["RealEstate", "BusinessIntrests"].includes(refrencePage) && isNotNullUndefine(businessInterestAddressId)) {     
            getAddressData(businessInterestAddressId);       
           } 
        if (refrencePage === "lenderData" && isNotNullUndefine(userId)) {
          setUserData(userId);
        }  
        if (["professional", "transportation", "activationForm" ,"Non-Retirement"].includes(refrencePage)) {
          setAddressDetails((prev) => ({...prev,addressTypeId: '1'}));
        }
        if (["Non-Retirement"].includes(refrencePage)) {
          setContactDetails((prev) => ({...prev,contactTypeId: '1'}));
        }
      }
    },[userId,refrencePage,isPrimaryMemberMaritalStatus]);



     useEffect(() => {
       if($AHelper.$isNotNullUndefine(spouseIdBySession) && refrencePage == "PersonalInformation"){
         isSpouseVerified(spouseIdBySession)
       }
     },[spouseIdBySession])
     
   
  const isSpouseVerified = useCallback(async (userIdNew) => {
    const response = await getApiCall2('GET', `${$Service_Url.getUserDetailsByUserEmailId}?UserId=${userIdNew}`);
    const emailData = response?.data;
  
    if (emailData?.length > 0 && emailData[0]?.isEmailVerified && userIdNew == spouseIdBySession) {
      setspouseEmailActiveData(emailData)
      setCheckRoleWithVerifiedMail(emailData[0]?.roleDetails?.some(role => [1, 9, 10].includes(role.roleId)))
      setSpousePartenrEmailVerified(emailData[0]?.isEmailVerified);
      dispatch(setIsJointAccount(emailData[0]?.isEmailVerified))
    }
  }, [spouseIdBySession])
     









    const fetchApiNext = useCallback(async (userId, setAddress, setcontact) => {
      let loggedInDetails = JSON.parse(sessionStorage.getItem('stateObj'))
       setloggedInUserRoleId(loggedInDetails?.roleId)
        setUserData(userId, setAddress, setcontact)
    }, [primaryIdBySession,spouseIdBySession,userId,spouseUserId]);

    const fetchApi = useCallback(() => {
      contactType.length == 0 && apiCallIfNeed(contactType, fetchContactType());
      addressType?.length == 0 && apiCallIfNeed(addressType, fetchAddressType());
      countyRef?.length == 0 && apiCallIfNeed(countyRef, fetchCountyRef());
      comType?.length == 0 && apiCallIfNeed(comType, fetchComType());
     },[]);
     const apiCallIfNeed = (data, action) => {
      if (data.length > 0) return;
      dispatch(action)
    }

  const setUserData = useCallback(async (userId, setAddress, setContact) => {

    if (["BusinessIntrests", "lenderData", "RealEstate"].includes(refrencePage)) {
      useLoader(true)
      const responseData = await dispatch(fetchPrimaryUserAddressData(userId))
      useLoader(false)
      if (responseData?.payload == 'err' && (["BusinessIntrests", 'RealEstate'].includes(refrencePage))) {
        searchInput.current.value = '';
        //  resetAddressFields()
      }
      if ((["BusinessIntrests", "lenderData", "RealEstate"].includes(refrencePage)) && responseData?.payload != 'err' && responseData?.payload?.addresses?.length != 0) {
        const filteredData = responseData.payload.addresses.filter((ele) => ele?.addressTypeId == 1)
        if (filteredData.length > 0) {
          // setAddressFields(filteredData[0])    
        }
      }
    }
    useLoader(true)
    const _resultOf = await getApiCall('GET', $Service_Url.getAllAddress + userId, "");
    // debugger
    let isPhysicalAddress = _resultOf?.addresses?.length > 0 ? _resultOf?.addresses?.filter((ele) => ele?.addressTypeId == 1) : []
    useLoader(false)
    ///////////set address daetails
    if (_resultOf !== 'err') {
      if (refrencePage == "PersonalInformation" && userId == primaryIdBySession) {
        setAddress(_resultOf?.addresses)
        if (isPhysicalAddress.length > 0) {
          dispatch(updateIsPrimaryAddress(true))
        } else {
          dispatch(updateIsPrimaryAddress(false))
        }

      } else {
        if (refrencePage == 'lenderData' && _resultOf.addresses.length != 0) {
          // setAddressFields(_resultOf.addresses[0])
        } else if (refrencePage == "Non-Retirement" && _resultOf?.addresses.length > 0) {
          // setUserAddress(_resultOf?.addresses[0])
        }
        else {
          if (refrencePage == "PersonalInformation" && userId == spouseIdBySession) {
            setAddress(_resultOf?.addresses)
            if (isPhysicalAddress.length > 0) {
              dispatch(updateIsSpouseAddress(true))
            } else {
              dispatch(updateIsSpouseAddress(false))
            }
          } else {
            // setAddressList(_resultOf?.addresses)
            setNonPrimarySpouseAddress(_resultOf?.addresses)
          }
        }
      }
    }
    ///////////setconctact details////////////////////
    useLoader(true)
    const responses = await dispatch(fetchUserContactData(userId));
    if (refrencePage == "PersonalInformation") {
      setContact(responses?.payload)
    } else {
      setNonPrimarySpouseContact(responses?.payload)
      // setContactData(responses?.payload)  
      if (refrencePage == "Non-Retirement") {
        // setContactValues(responses?.payload)
      }
    }
    useLoader(false)
  }, [primaryIdBySession, spouseIdBySession, userId, spouseUserId]);

  const setMobileNumber = (data) => {
    setContactDetails((prev) => ({...prev,["mobileNumber"]:data}));
  }
  const hideErrMsg = (key, errMsg) => {
    if (isNotNullUndefined(errMsg[key])) {
      setErrMsg(prev => ({ ...prev, [key]: '' }));
    }
  }
  const setcountryCode = (data) => {
    setContactDetails((prev) => ({...prev,["countryCode"]:data}));
  }
  const handleSelectChange = (value, key) => {
    hideErrMsg(`${key}Err`, errMsg);
    if (key === "contactTypeId") {
      setContactDetails((prev) => ({
        ...prev,
        contactTypeId: value.value,
        contactTypeLabel: value.label
      }));
    } else if (key === "addressTypeId") {
      setAddressDetails(prevState => ({
        ...prevState,
        [key]: value?.value  // Dynamically update based on the key
      }));

      setAddressTypeLable(value?.label);
    }
  };
  //////////  get address details for spouse or primary
  const getAddressData = async (addressIds) => {
    if (isNotNullUndefined(addressIds)) {
      const _resultOf = await getApiCall('GET', $Service_Url.getAddressByaddressID + addressIds, '')
      if (!isNotNullUndefined(_resultOf)) {
        return;
      }
      // setUserAddress(_resultOf)

    }



  }

  useEffect(() => {
    fetchApi()
    dispatch(fetchUniversalAddress(addressDetails?.country))
    let primaryUserIdNew = sessionStorage.getItem("SessPrimaryUserId") || "";
    // setPrimaryIdBySession(primaryUserIdNew)
    let spouseId = sessionStorage.getItem("spouseUserId")
    // setspouseIdBySession(spouseId)
    let loggedInDetails = JSON.parse(sessionStorage.getItem('stateObj'))
    setloggedInUserRoleId(loggedInDetails?.roleId)

  }, [])
  useEffect(() => {
    if (["PersonalInformation", "EditChildWithAccordian"].includes(refrencePage)) {
      sameAsAddressFunc()
    }

  }, [dataInfo?.memberRelationship?.relativeUserId, spouseMemberAddress, primaryMemberAddress])

  useEffect(() => {
    if (refrencePage == "EditFiduciaryBeneficiary") {
      sameAsAddressFunc()
    }
  }, [nonPrimarySpouseId])
  
  
  
    ///////// set Same as address  
  const sameAsAddressFunc = async () => {
    if (refrencePage !== "transportation") {
      let userData = dataInfo?.memberRelationship;
      const isPersonalInfo = refrencePage === "PersonalInformation";
      const isEditFiduciary = refrencePage === "EditFiduciaryBeneficiary" && userId == spouseIdBySession;
      let userID = (type == "ADD-EXTENDED-FAMILY") 
              || ([1, 44, 47, 48, 49, 50].includes(userData?.relationshipTypeId) && userData?.relativeUserId !== userData?.primaryUserId) 
              || (userData?.relationshipType == "Grand-Child") ? userData?.relativeUserId : isEditFiduciary ? spouseIdBySession : primaryIdBySession
      /////////////get spouseAddress
     
      const useridForSpouse = isPersonalInfo ? spouseIdBySession : isEditFiduciary ? userId : dataInfo?.userId;
      let primaryAddressData;
      let spouseAddresData;
      if (isNotNullUndefined(userID) && isNotNullUndefined(useridForSpouse)) { 
        
        if (refrencePage === "PersonalInformation") {
          primaryAddressData = primaryMemberAddress;
          spouseAddresData = spouseMemberAddress
         
        } else if (["EditChildWithAccordian","EditFiduciaryBeneficiary"].includes(refrencePage)) {                   
          useLoader(true)
          const responseData = await dispatch(fetchPrimaryUserAddressData(userID))
          const responseData1 = await dispatch(fetchPrimaryUserAddressData(useridForSpouse))
          useLoader(false)
          primaryAddressData = responseData?.payload?.addresses;
          spouseAddresData = responseData1?.payload?.addresses;
        

        }
        else {
          useLoader(true)
          const _resultOf = await getApiCall('GET', $Service_Url.getAllAddress + useridForSpouse, "")
          const responseData = await dispatch(fetchPrimaryUserAddressData(userID))
          useLoader(false)
          primaryAddressData = responseData?.payload?.addresses;
          spouseAddresData = _resultOf?.addresses;
        }
        //////get primary details
        const primaryAddressDetails = primaryAddressData?.filter((ele) => { return ele?.addressTypeId == 1 })
        const spouseAddressDetails = spouseAddresData?.filter((ele) => { return ele?.addressTypeId == 1 })

     
        if (primaryAddressDetails?.length > 0 && spouseAddressDetails?.length > 0) {

          if (isNotNullUndefined(spouseAddressDetails[0]?.sameAsUserId)) {
            setisChecked(true)
          } else {
            setisChecked(false)
          }

        } else {
          setisChecked(false)
        }
      }

    }

  }


  function getEmailAndMobileWithSameContactTypeId(data) {
        const result = [];
        const matchedMobiles = new Set();
        const emailMap = new Map();
        data?.emails?.forEach(email => {
            emailMap?.set(email?.contactTypeId, email);
        });
        data?.mobiles?.forEach(mobile => {
            const email = emailMap.get(mobile?.contactTypeId);
            if (email) {
                result.push({ email, mobile });
                emailMap.delete(mobile?.contactTypeId);
            } else {
                result.push({ mobile });
            }
            matchedMobiles.add(mobile?.contactTypeId);
        });
        emailMap.forEach(email => {
            result.push({ email });
        });

        return result;
  }
  const isUserAtLeast16YearsOld = (dobString) => {
      const ds = new Date(dobString)
      const dob = new Date(ds);
      const currentDate = new Date();
      const minAgeDate = new Date(currentDate.getFullYear() - 14, currentDate.getMonth(), currentDate.getDate());
      return dob <= minAgeDate;
  };
  const showSameAs = (refrencePage) => {
    let userData = props?.dataInfo?.memberRelationship;
    let relationId = userData?.relationshipTypeId;

 

    const allowedPages = new Set(["EditFiduciaryBeneficiary","EditChildWithAccordian","AddChildWithProgressBar","PersonalInformation"]);
    const validRelationIds = new Set([1, 44, 47, 48, 49, 50]);
    const additionalValidRelationIds = new Set([5, 2, 6, 28, 29, 41]);

    const isAllowedPage = allowedPages.has(refrencePage);
    const isSpouse = (spouseIdBySession && [props?.spouseUserIds, userId].includes(spouseIdBySession)) || Number(relationId) === 3;
    const isValidRelation = userData?.primaryUserId !== userData?.relativeUserId && validRelationIds.has(Number(relationId));
    const isAdditionalRelationValid = (additionalValidRelationIds.has(Number(relationId)) || isChild == true)  && isNotNullUndefined(props?.dataInfo?.dob) && isUserAtLeast16YearsOld(dataInfo?.dob);
    const isExtendedFamily = type === "ADD-EXTENDED-FAMILY" && isValidRelation;
    if ((isAllowedPage && (isSpouse || isValidRelation)) || isAdditionalRelationValid || isExtendedFamily) {
      return true;
    } else {
      return false;
    }
  }

  const findSpouseEmail = () => {
    return getEmailAndMobileWithSameContactTypeId(spouseMemberContact?.contact)
      .map((ele) => ele.email).filter((ele1) => ele1?.contactTypeId === 1)[0]?.emailId;
  };
   
    const labelOfisSameAs = useMemo(() => {
        let userData = dataInfo?.memberRelationship;
        let relationId = userData?.relationshipTypeId;
        const showMemberName = relationTypeList.find((ele) => ele?.value == relationId)?.label.toLowerCase();    
        const metrialStatus = ["EditFiduciaryBeneficiary"].includes(refrencePage) && dataInfo?.userId == spouseIdBySession ? primaryDetails?.maritalStatusId : dataInfo?.maritalStatusId
        const isRelations = isPrimaryMemberMaritalStatus == true && ["EditFiduciaryBeneficiary","PersonalInformation"].includes(refrencePage)
        let relationForPersonal = isRelations && metrialStatus == 1 ? "spouse" : isRelations && metrialStatus == 2 ? "partner" : showMemberName   
        let checkForGrandChild = (refrencePage !== 'PersonalInformation' && userData?.relationshipTypeId == 3)
         
        let realtion1;
        let relationName;        
        const validRelationIds = new Set([44,47,48,49,50]);
        if((validRelationIds.has(Number(relationId))) || isChildSpouse == true){
          realtion1 = `Does this ${lableName} live with your Child?`
          relationName = lableName
        }else if(["PersonalInformation","EditFiduciaryBeneficiary"].includes(refrencePage)){
          realtion1 = `Does your ${relationForPersonal} live with ${checkForGrandChild ? "your child" : "you"}?`
          relationName = relationForPersonal
        }else{
          realtion1 = (`Does ${checkForGrandChild == true ? "this" : "your"} ${checkForGrandChild == true ? 'grand-child' : isChild == true  ? (showMemberName ?? "child") : 'as'} live with ${checkForGrandChild == true ? "your child" : "you"}?`)
          relationName = checkForGrandChild == true ? 'grand-child' : isChild == true  ? showMemberName : 'as'
        }
        setUserRelations(relationName?.charAt(0).toUpperCase() + relationName?.slice(1)
      )
       
        return realtion1    
    }, [refrencePage,type,dataInfo,relationTypeList,isPrimaryMemberMaritalStatus])
    

    function sortData(data) {
        return data.sort((a, b) => (a.email?.contactTypeId || a.mobile?.contactTypeId) - (b.email?.contactTypeId || b.mobile?.contactTypeId));
    }
    const contactDataArray = getEmailAndMobileWithSameContactTypeId(nonPrimarySpouseContact?.contact);
    const sortedData = sortData(contactDataArray);
    const filterContactData = (data) => {
        const contactDataArray = getEmailAndMobileWithSameContactTypeId(data?.contact)
        return sortData(contactDataArray)
    }

    const AddressAndContactModal = async (type, modal, userIds) => {
        if ((type == "address" && modal == "checkvalidation") || (type == "contact" && modal == "checkvalidation")) {
          if (type == "address" && validateContact('addAnother')) {
            let isNext = await handleSubmit("openModal", type, "newAddress")
            if(isNext) toasterAlert("successfully", "Successfully saved data",  "Your data have been saved successfully")
            setmodalType(type)
            setShowAddressContactModal(!showAddressContactModal)
          }
          else if (type == "contact" && validateContacts()) {
            let isNext = await submitContact("openModal", type)
            if (isNext) toasterAlert("successfully", "Successfully saved data", "Your data have been saved successfully")
          }
    
        } else {
          if (refrencePage == "PersonalInformation") {
            setNonPrimarySpouseId(userIds)
          }
    
          setmodalType(type)
          setShowAddressContactModal(!showAddressContactModal)
          return true
        }
    
    
    }
    const getDataForLiabilities = (data, type, typeEdit) => {
        if (type == "address") {
            setNonPrimarySpouseAddress(prevAddressList => {
                if (editIndex !== -1) {
                    // Update existing item
                    const updatedAddressList = [...prevAddressList];
                    if (isNotNullUndefined(updatedAddressList[editIndex]?.addressId)) {
                        data['addressId'] = updatedAddressList[editIndex]?.addressId
                        updatedAddressList[editIndex] = data;
                        seteditIndex(-1)
                    } else {
                        updatedAddressList[editIndex] = data;
                        seteditIndex(-1)
                    }
                    return updatedAddressList;
                } else {
                    // Add new item
                    return [...prevAddressList, data];
                }
            });

        } else {

            setNonPrimarySpouseContact(prevContactData => {
                const updateData = {
                    emails: data?.contact?.emails?.length > 0 ? [data?.contact?.emails[0]] : [],
                    mobiles: data?.contact?.mobiles?.length > 0 ? [data?.contact?.mobiles[0]] : []
                };

                // Function to update arrays based on contactTypeId

                return {
                    ...prevContactData,
                    contact: {
                        ...prevContactData.contact,
                        emails: updateArray(prevContactData?.contact?.emails ?? [], updateData?.emails, typeEdit, "email"),
                        mobiles: updateArray(prevContactData?.contact?.mobiles ?? [], updateData?.mobiles, typeEdit, "mobile"),

                    }
                };

            });
        }

    }
    const updateArray = (prevArray, newArray, typeEdit, type) => {

        // Clone and sort the array to avoid modifying the original array directly
        const shortedPrevData = [...prevArray]?.sort((a, b) => a.contactTypeId - b.contactTypeId);
        if (typeEdit && editIndex !== -1 && shortedPrevData[editIndex]?.contactTypeId === newArray[0]?.contactTypeId) {

            // Update the element at editIndex if typeEdit is true and editIndex is valid
            const updatedArray = [...shortedPrevData]; // Clone sorted array for modification
            updatedArray[editIndex] = newArray[0] ?? shortedPrevData[editIndex]; // Replace item at editIndex

            seteditIndex(-1); // Reset editIndex
            return updatedArray?.filter(element => isNotNullUndefined(element)); // Filter out any null/undefined elements

        } else {

            // Append newArray if typeEdit is false or editIndex is not found
            return [...prevArray, ...newArray];
        }
    };
    const handleClose = (type) => {
        setShowAddressContactModal(!showAddressContactModal)
        seteditIndex(-1)
        if (!["Liabilities", "transportation"].includes(refrencePage) && type == "run") {
          getApisData(nonPrimarySpouseId, "closeModal")
        }
    
    }

    const getApisData = (userID, type) => {
      if (refrencePage !== "PersonalInformation") {
        setUserData(userID)
      } else {
        if (type == "closeModal" && refrencePage == "PersonalInformation") {
          setUserData(primaryIdBySession, setPrimaryMemberAddress, setPrimaryMemberContact)
          isPrimaryMemberMaritalStatus == true && setUserData(spouseIdBySession, setSpouseMemberAddress, setSpouseMemberContact)
        } else if (userID == primaryIdBySession) {
          setUserData(userID, setPrimaryMemberAddress, setPrimaryMemberContact)
        } else {
          isPrimaryMemberMaritalStatus == true && setUserData(userID, setSpouseMemberAddress, setSpouseMemberContact)
        }
      }
    }
    const AddressCSS = {
      color: "#720C20", borderRadius: "91.17px", padding: "9.12px 0px 9.12px 0px", fontWeight: "600", fontSize: "14px"
    }
  
    const AddressCSS1 = {
      color: "#720C20", borderRadius: "91.17px", padding: "9.12px 0px 9.12px 0px", fontWeight: "600", marginTop: "0.3rem", width: "170.34px", fontSize: "14px"
    }
    function sortData(data) {
      return data.sort((a, b) => (a.email?.contactTypeId || a.mobile?.contactTypeId) - (b.email?.contactTypeId || b.mobile?.contactTypeId));
    }

    // Sample sorting function
    function sortAddressList(data) {
      return [...data].sort((a, b) => (a.addressTypeId) - (b.addressTypeId));
  
    }
    const filterAddressData = (data) => {
      return data.length > 0 ? sortAddressList(data) : []
    }
    const deleteAddressData = (type,userid) => {
      if (type === "Physical") {
        if(userid === primaryIdBySession || isChecked){
           return false
        }else{
          return true
        }
      } else {
        return true;
      }
    };
    const editandAddressData = (type, userType) => {
      if (type !== "Physical") return true;  
      const isSpousePage = ["PersonalInformation","EditFiduciaryBeneficiary"].includes(refrencePage);
      const userID = isSpousePage && userType === "spouse" ? spouseIdBySession : userId;  
      if (userID === primaryIdBySession && isChecked) return true;
      if (isChecked) return false;
    
      return true;
    };


    const editAddressContact = (data, index, type, userType) => {
      let userNewId = userType == "primary" ? primaryIdBySession : userType == "Spouse" ? spouseIdBySession : userId
      setNonPrimarySpouseId(userNewId)
      setNatureId(data?.addressId)
      seteditIndex(index)
      setShowAddressContactModal(true)
      setmodalType(type)
      setEditJsonData(data)
  
  
    }
    const deleteAddress = async (data, index, type, userType,retirementUserId) => {
      if(["Non-Retirement"].includes(refrencePage)){
        if(type == "address"){
          const deleteApi = await postApiCall('DELETE', `${$Service_Url.deleteAddress + retirementUserId}/${data}/${loggedInUserId}`, '')
          if (deleteApi == "err") {
            return;
          }
          useLoader(false)
  
        }else {
       
            if (isNotNullUndefined(data)) {
              const json = {
                userId: retirementUserId,
                contactId : data,
                deletedBy: loggedInUserId,
              };
              useLoader(true);
              await postApiCall('DELETE', $Service_Url.deleteContactPath, json);
              useLoader(false);
            }
          
          
         
          
         
      
  
        }
        
      }else{
      const confirmRes = await newConfirm(true, `Are you sure you want to delete this ${type == "address" ? "address" : "contact"}? This action cannot be undone.`, "Confirmation", `${type === "address" ? "Delete Address" : "Delete Contact"}`, 2);
      if (!confirmRes) return;
      let userNewId = userType == "primary" ? primaryIdBySession : userType == "Spouse" ? spouseIdBySession : userId
      if (type == "address") {
        useLoader(true)
        if ((["Liabilities","transportation"].includes(refrencePage)) && !isNotNullUndefined(data?.addressId)) {
          // const filteredAdd = [...addressList]
          const filteredAdd = [...nonPrimarySpouseAddress]
          const newJosn = filteredAdd?.filter((ele) => ele?.addressTypeId !== data?.addressTypeId)
          setNonPrimarySpouseAddress(newJosn)
          useLoader(false)
        } else {
  
          const deleteApi = await postApiCall('DELETE', `${$Service_Url.deleteAddress + userNewId}/${data?.addressId}/${loggedInUserId}`, '')
          if (deleteApi == "err") {
            return;
          }
        
          getApisData(userNewId)
          toasterAlert("deletedSuccessfully", "Address has been deleted successfully")
          resetForm()
          useLoader(false)
        }
      } else {
        useLoader(true)
        if ((["Liabilities","transportation"].includes(refrencePage)) && (!isNotNullUndefined(data?.email?.contactId) && !isNotNullUndefined(data?.mobile?.contactId))) {
          const filteredAdd = { ...nonPrimarySpouseContact }
          const newData = filteredAdd?.contact?.emails.filter((ele) => ele?.contactTypeId !== data?.email?.contactTypeId)
          const newData2 = filteredAdd?.contact?.mobiles.filter((ele) => ele?.contactTypeId !== data?.mobile?.contactTypeId)
          setNonPrimarySpouseContact(prevContactData => {
            return {
              ...prevContactData,
              contact: {
                ...prevContactData.contact,
                emails: newData,
                mobiles: newData2
              }
            };
          });
          useLoader(false)
  
        } else {
          const json = {
            "userId": userNewId,
            "contactId": data?.email?.contactId,
            "deletedBy": userNewId
          }
          const json2 = {
            "userId": userNewId,
            "contactId": data?.mobile?.contactId,
            "deletedBy": userNewId
          }
          if (isNotNullUndefined(data?.email?.contactId)) {
            const deleteApi = await postApiCall('DELETE', $Service_Url.deleteContactPath, json)
            useLoader(false)
          }
          if (isNotNullUndefined(data?.mobile?.contactId)) {
            const deleteApi2 = await postApiCall('DELETE', $Service_Url.deleteContactPath, json2)
            useLoader(false)
          }
          toasterAlert("deletedSuccessfully", "Contact has been deleted successfully")
          resetContactData()
          getApisData(userNewId)
        }
      }
    }
  
    }
    const toasterAlert = (type, title, description) => {
      setWarning(type, title, description);
  
    }
      /////  function fro contact save
  const submitContact = async (isModal, type,institutionUserId) => {
    let mobileOther = null
    let emailOther = null
    let loggedInUserId = loggedInUserId ?? sessionStorage.getItem('loggedUserId')
    let primaryData = JSON.parse(sessionStorage.getItem("userDetailOfPrimary")).primaryEmailId
    const isValid = [ (!["Non-Retirement"].includes(refrencePage)) ? '' : "",email, mobileNumber].some(val => isNotNullUndefined(val));
   
    if(["Non-Retirement"].includes(refrencePage) && isNotNullUndefined(nonPrimarySpouseContact) && nonPrimarySpouseContact?.contact){
      const { emails: contactDataEmail, mobiles: contactDataMobile } = nonPrimarySpouseContact?.contact || {};      
        if(contactDataEmail?.length > 0 && !isNotNullUndefined(email)){
        deleteAddress(contactDataEmail[0].contactId, "index", "contact", "",institutionUserId)
        }
        if(contactDataMobile?.length > 0 && !isNotNullUndefined(mobileNumber)){
        deleteAddress(contactDataMobile[0].contactId, "index", "contact", "",institutionUserId)
        }
      
     

    }

    if ((["PersonalInformation","activationForm"].includes(refrencePage)) || (isMandotry == false && isValid == true)) {
      if (validateContacts()) {
        if (!isNotNullUndefined(mobileNumber) && !isNotNullUndefined(email)) {
          validateFieldContact(email, 'emailErr');
          validateFieldContact(mobileNumber, 'mobileErr')
          return;
        }
        if (isNotNullUndefined(mobileNumber) && mobileNumber.length < 10) {
          setErrMsg(prev => ({ ...prev, ["mobileErr"]: 'Enter a valid mobile number' }));
          return;
        }
        if (!isValidEmail(email) && isNotNullUndefined(email)) {
          setErrMsg(prev => ({ ...prev, ["emailErr"]: 'Enter a valid email' }));
          return;
        }
        if (isValidEmail(email) && isNotNullUndefined(email) && userId == spouseIdBySession && email === primaryData) {
          setErrMsg(prev => ({ ...prev, ["emailErr"]: 'Email address already exist' }));
          return;
        }
        if (contactTypeId == "999999") {
          mobileOther = {
            othersName: otherContact,
            othersCategoryId: 6,
            isActive: true,
            othersId: isNotNullUndefined(editJsonData) ? editJsonData?.mobile?.mobileOther?.othersId : "",
            [isNotNullUndefined(editJsonData) ? "updatedBy" : "createdBy"]: loggedInUserId

          }
          emailOther = {
            othersName: otherContact,
            othersCategoryId: 6,
            isActive: true,
            othersId: isNotNullUndefined(editJsonData) ? editJsonData?.email?.emailOther?.othersId : "",
            [isNotNullUndefined(editJsonData) ? "updatedBy" : "createdBy"]: loggedInUserId

          }

        };


        let updateJsonData = {
          "userId":  ["Non-Retirement"].includes(refrencePage) ? institutionUserId : userId,
          "activityTypeId": "4",
          "contact": {}
        }
        if (['lenderData','activationForm'].includes(refrencePage)) {
           //////// update json
           updateJsonData.contact.mobiles = (!isNotNullUndefined(mobileNumber)) ? []
           : [$JsonHelper.$createMobileData(mobileNumber, contactTypeId, countryCode, loggedInUserId, mobileOther, comeTypes, contactTypeLabel)];
           updateJsonData.contact.emails = (!isNotNullUndefined(email)) ? []
           : [$JsonHelper.$createEmailData(email, contactTypeId, loggedInUserId, emailOther, contactTypeLabel)];
           ////////////////////
          return updateJsonData
        }
        let apiType = "POST"
        if (["Liabilities","transportation"].includes(refrencePage)) {
           updateJsonData.contact.mobiles = (!isNotNullUndefined(mobileNumber)) ? []
           : [$JsonHelper.$createMobileData(mobileNumber, contactTypeId, countryCode, loggedInUserId, mobileOther, comeTypes, contactTypeLabel)];
           updateJsonData.contact.emails = (!isNotNullUndefined(email)) ? []
           : [$JsonHelper.$createEmailData(email, contactTypeId, loggedInUserId, emailOther, contactTypeLabel)];

          if (!isNotNullUndefined(nonPrimarySpouseContact) || nonPrimarySpouseContact.length == 0) {
            
            // setContactData(updateJsonData)
          } else {
            // setContactData(prev => ({
            //   ...prev,
            //   contact: {
            //     ...prev?.contact,
            //     ...updateJsonData?.contact
            //   }
            // }));
          }

          if (isModal == "openModal") {
            setmodalType(type)
            setShowModal(!showModal)
          } else {
            const contactDatas = { ...nonPrimarySpouseContact }
            const myObject = {
              "isActive": true,
              "json": contactDatas?.contact?.emails.length > 0 || contactDatas?.contact?.mobiles.length > 0 ? contactDatas : updateJsonData
            };
            return myObject

          }


        }
      
        else if(["Non-Retirement"].includes(refrencePage) && isNotNullUndefined(nonPrimarySpouseContact) && (nonPrimarySpouseContact.length !== 0)){
         
             const contactDataEmail = nonPrimarySpouseContact?.contact?.emails
             const contactDataMobile = nonPrimarySpouseContact?.contact?.mobiles   
             const { number } = separateCountryCodeAndNumber(contactDataMobile?.[0]?.mobileNo) ?? {}; 

            if(contactDataEmail?.length == 0 || contactDataMobile?.length == 0){            
              updateJsonData.contact.mobiles = ((!isNotNullUndefined(mobileNumber)) || (contactDataMobile.length > 0)) ? []
                : [$JsonHelper.$createMobileData(mobileNumber, contactTypeId, countryCode, loggedInUserId, mobileOther, comeTypes, contactTypeLabel)];
                  updateJsonData.contact.emails = ((!isNotNullUndefined(email)) || (contactDataEmail.length > 0)) ? []
                : [$JsonHelper.$createEmailData(email, contactTypeId, loggedInUserId, emailOther, contactTypeLabel)];
                if((updateJsonData.contact?.mobiles.length > 0) || (updateJsonData.contact?.emails?.length > 0)){
                  useLoader(true)
                  let url = $Service_Url?.postAddContactWithOther
                  const result_ = await addUpdateEmailMobile(apiType, url, updateJsonData)
                  useLoader(false)
                }
           

            }

            if((contactDataEmail?.length > 0 && contactDataEmail[0].emailId !== email) || (contactDataMobile?.length > 0 && number !== mobileNumber)){               

                  updateJsonData.contact.mobiles = ((contactDataMobile.length == 0) || (number == mobileNumber) || (!isNotNullUndefined(mobileNumber))) ? []          
                   : [{ ...$JsonHelper.$createMobileData(mobileNumber, contactTypeId, countryCode, loggedInUserId, mobileOther, comeTypes, contactTypeLabel),
                  contactId : contactDataMobile[0]?.contactId,UpdatedBy : institutionUserId}
                  ];
                            
               
                  updateJsonData.contact.emails = ((contactDataEmail.length == 0 ) || (contactDataEmail[0].emailId == email )|| (!isNotNullUndefined(email))) ? []
                  : [{...$JsonHelper.$createEmailData(email, contactTypeId, loggedInUserId, emailOther, contactTypeLabel),
                    contactId: contactDataEmail[0]?.contactId,UpdatedBy: institutionUserId}
                    ];  
                 
                 let url = $Service_Url?.updateContactWithOtherDetailsPath
                 if((updateJsonData?.contact?.mobiles?.length > 0 )|| (updateJsonData?.contact?.emails?.length > 0)){
                  useLoader(true)
                  const result_ = await addUpdateEmailMobile("PUT", url, updateJsonData)
                  useLoader(false)
                 }
               
            
            }         
        }

        
        else {
          useLoader(true)
          //////// update json
          updateJsonData.contact.mobiles = (!isNotNullUndefined(mobileNumber)) ? []
          : [$JsonHelper.$createMobileData(mobileNumber, contactTypeId, countryCode, loggedInUserId, mobileOther, comeTypes, contactTypeLabel)];
          updateJsonData.contact.emails = (!isNotNullUndefined(email)) ? []
          : [$JsonHelper.$createEmailData(email, contactTypeId, loggedInUserId, emailOther, contactTypeLabel)];
            ////////////////////

          let url = $Service_Url?.postAddContactWithOther
          if(updateJsonData.contact?.mobiles.length > 0 || updateJsonData.contact?.emails?.length > 0){
            const result_ = await addUpdateEmailMobile(apiType, url, updateJsonData)         
            if (result_ == "err") {
              const myObject = {
                "isActive": false,
                "json": ""
              };
              return myObject
  
            }
          }
         
          
          useLoader(false)
          getApisData(userId)
          if (isModal == "openModal") {
            setmodalType(type)
            setShowAddressContactModal(!showAddressContactModal)
          }
          const myObject = {
            "isActive": true,
            "json": ""
          };
          return myObject
        }

      }
      else {
        const myObject = {
          "isActive": refrencePage == "PersonalInformation" ? true : false,
          "json": ""
        };
        return myObject
      }
    } else {
      const contactDatas = { ...nonPrimarySpouseContact }
      const myObject = {
        "isActive": true,
        "json": ["Liabilities","transportation",'lenderData'].includes(refrencePage) ? contactDatas : ""
      };
      return myObject
    }

  }
  const radioValuesOcc = [{ label: "Yes", value: true }, { label: "No", value: false }];

  const handleRadioOcc = async (e, key) => {
   
    setErrMsg(newObjErr())
    if(!$AHelper.$isNotNullUndefine(e)) return
    const isCheckedValue = refrencePage == "PersonalInformation" ? e.target.checked : e.value
     
    useLoader(true)
    let userData = dataInfo?.memberRelationship;
    const validRelationIds = new Set([1,44,47,48,49,50]);  
    let userIds = (type == "ADD-EXTENDED-FAMILY" || (validRelationIds.has(Number(userData?.relationshipTypeId))  &&  userData?.relativeUserId !== userData?.primaryUserId) || (userData?.relationshipType == "Grand-Child")  )  ? userData?.relativeUserId : primaryIdBySession
     

    const primaryAddressDetailsData = await userAddressDataById(userIds)
    const primaryAddressDetails = primaryAddressDetailsData?.addresses?.filter((ele) => { return ele?.addressTypeId == 1 })
    let spouseUserID = refrencePage == "PersonalInformation" ? spouseIdBySession : userId
    useLoader(false)
    const _resultOf = await userAddressDataById(spouseUserID)
    if (refrencePage == "PersonalInformation") {
      setSpouseMemberAddress(_resultOf?.addresses)
    } else {
      setNonPrimarySpouseAddress(_resultOf?.addresses)
    }

    const spouseAddressDetails = _resultOf?.addresses?.filter((ele) => { return ele?.addressTypeId == 1 })

    if (spouseAddressDetails?.length > 0 && isCheckedValue == true) {
      toasterAlert(
        "warning",`${userRelations} has a physical address. Please delete the current physical address first, then make the selection.`
      );
      
      useLoader(false)
      return;
    }
    if (spouseAddressDetails?.length == 0 && isCheckedValue == false) {
      
      useLoader(false)
      return;
    }
    if ((primaryAddressDetails?.length == 0 || !isNotNullUndefined(primaryAddressDetails)) && isCheckedValue == true) {
      const validRelationIds = new Set([1,44,47,48,49,50]); 
      toasterAlert("warning", `${type == "ADD-EXTENDED-FAMILY" ? "Relative member" : (validRelationIds.has(Number(userData?.relationshipTypeId))  &&  userData?.relativeUserId !== userData?.primaryUserId) || (userData?.relationshipType == "Grand-Child") ? "Child" :"Primary member"} does not have a physical address`)
      useLoader(false)
      return;
    }
    const { addressId } = primaryAddressDetailsData?.addresses?.filter(res => res?.addressTypeId == 1)[0] || {}
    let postAddress = {
      userId: spouseUserID,
      sameAsUserId: primaryAddressDetailsData?.userId,
    }
    let apiTYPE = isCheckedValue == true ? "POST" : "PUT"
    if (isCheckedValue == true) {
      postAddress["addressId"] = addressId;
      postAddress["isActive"] = true
      postAddress["createdBy"] = loggedInUserId;
    } else if(isCheckedValue == false && isChecked == true) {
      postAddress["isActive"] = false
      postAddress["isDeleted"] = true
      postAddress["userAddressId"] = spouseAddressDetails[0]?.userAddressId
      postAddress["updatedBy"] = loggedInUserId
      postAddress["addressId"] = spouseAddressDetails[0]?.addressId;
    }else{
      return;
    }
    useLoader(true)
    const _resultGetActivationLink = await postApiCall(apiTYPE, $Service_Url.postMemberAddress, postAddress);
    setisChecked(isCheckedValue)
    if (refrencePage == "PersonalInformation") {
      dispatch(updateIsSpouseAddress(isCheckedValue))
    }
    resetForm()
    useLoader(false)
    let id = refrencePage == "PersonalInformation" ? spouseIdBySession : userId
    getApisData(id)

    if (_resultGetActivationLink == "err") {
      return;
    }

  };

  const validateContacts = () => {
    const isValidContactType = validateFieldContact(contactTypeId, 'contactTypeIdErr', true);
    const isValidComType = validateFieldContact(comeTypes, 'comeTypeErr', isValidContactType);
    return isValidContactType && isValidComType;
  };


  const validateField = (field, errorMessageKey, needErrorFocus,label) => {

  
    const isEmptyOrWhitespace = /^\s*$/.test(formData[field]);
    const isFieldInvalid = !isNotNullUndefined(formData[field]) || isEmptyOrWhitespace;
    const isNotAddressError = errorMessageKey !== "addressTypeIdErr";

    if ((isFieldInvalid && isNotAddressError) || (!isNotNullUndefined(addressDetails?.addressTypeId))) {
       
        // Determine the field name for the error message
        const fieldName = errorMessageKey === 'addressTypeIdErr' ? "Address Type" : errorMessageKey === 'addressErr' ? "Address" : field.charAt(0).toUpperCase() + field.slice(1);

        // Handle special case for 'addressTypeIdErr'
        if (errorMessageKey === 'addressTypeIdErr' && !isNotNullUndefined(addressTypeId)) {
            setErrMsg(prev => ({ ...prev, [errorMessageKey]: `${fieldName} is required` }));
        } 
        // if (errorMessageKey === 'addressErr' && !isNotNullUndefined(searchInput?.current?.value)) {
        //     setErrMsg(prev => ({ ...prev, [errorMessageKey]: `${fieldName} is required` }));
        // } 
        if(errorMessageKey !== 'addressTypeIdErr' && (isFieldInvalid)) {
            setErrMsg(prev => ({ ...prev, [errorMessageKey]: `${label} is required` }));
        }

        // Focus on the input field if needed
        if (needErrorFocus) focusInputBox(errorMessageKey?.slice(0, -3));

        return false;
    } else {
        // Clear the error message if the field is valid
        setErrMsg(prev => ({ ...prev, [errorMessageKey]: '' }));
    }
    return true;
  };
    ///////////// ALL INPUT FUNCTION VALUDATION
  const validateFieldContact = (field, errorMessageKey, needErrorFocus) => {
    if (!$AHelper.$isNotNullUndefine(field)) {
      setErrMsg(prev => ({ ...prev, [errorMessageKey]: $Msg_AddressDetails[errorMessageKey] }));
      if (needErrorFocus) focusInputBox(errorMessageKey?.slice(0, -3))
      return false;
    } else {
      setErrMsg(prev => ({ ...prev, [errorMessageKey]: '' }));
    }
    return true;
  };

        const fildsOnblur =async(data,key)=>{
           if(!isNotNullUndefined(data) || key !== "country"){return}
           useLoader(true)
          const newData = await dispatch(fetchUniversalAddress(data))
          useLoader(false)
        }

  



const userAddressDataById = (userID) => {
    return new Promise(async (resolve, reject) => {
      if (isNotNullUndefined(userID)) {
        const _resultOf = await getApiCall('GET', $Service_Url.getAllAddress + userID, '')
        resolve(_resultOf)
      } else {
        resolve('err')
      }

    })

}

  // --------------Primary for address-------------------

  const handleKeyDownPrimary = (event, actionType, element, index, userId) => {
    if (event?.key == 'Enter') {
        switch (actionType) {
            case 'add':
                AddressAndContactModal("address", "", userId);
                break;
            case 'edit':
                editAddressContact(element, index, "address", "primary");
                break;
            case 'delete':
                deleteAddress(element, index, "address", "primary");
                break;
            default:
                break;
        }
    }
}; 

  // ---------------------Spouse for address ----------------------

  const handleKeyDownSpouse = (event, actionType, element, index, userId) => {
    if (event?.key == 'Enter') {
      switch (actionType) {
        case 'add':
          AddressAndContactModal("address", "", userId);
          break;
        case 'edit':
          editAddressContact(element, index, "address", "Spouse");
          break;
        case 'delete':
          deleteAddress(element, index, "address", "Spouse");
          break;
        default:
          break;
      }
    }
  };


  // ----------------Contacts primary--------------------

  const handleKeyDownContactPrimary = (event, actionType, element, index, userId, isModalOpen, toggleModal) => {
    if (event?.key == 'Enter') {
        switch (actionType) {
            case 'add':
                if (isModalOpen) {
                    toggleModal(false); 
                } else {
                    AddressAndContactModal("contact", "", userId); 
                    toggleModal(true);
                }
                break;
            case 'edit':
                editAddressContact(element, index, "contact", "primary"); 
                break;
            case 'delete':
                deleteAddress(element, index, "contact", "primary");
                break;
            case 'toggleModal':
                setIsModalOpen((prev) => !prev); 
                if (!isModalOpen) {
                    AddressAndContactModal("contact", "", userId);
                } else {
                    AddressAndContactModal("", "", "");
                }
                break;
            default:
                break;
        }
    }
};


// -------------------Contact Spouse ---------------------

const handleKeyDownContactSpouse = (event, actionType, element, index, userId, isModalOpen, toggleModal) => {
  if (event?.key == 'Enter') {
      switch (actionType) {
          case 'edit':
              editAddressContact(element, index, "contact", "Spouse"); 
              break;
          case 'delete':
              deleteAddress(element, index, "contact", "Spouse");
              break;
          case 'add':
              AddressAndContactModal("contact", "", userId);
              break;
          case 'toggleModal':
              setIsModalOpen((prev) => !prev);
              if (!isModalOpen) {
                  AddressAndContactModal("contact", "", userId);
              } else {
                  AddressAndContactModal("", "", ""); 
              }
              break;
          default:
              break;
      }
}};
const isShowingDescriptions = (!nonPrimarySpouseContact?.length) && (isShowingDescription || isSideContent?.length);

const needToShowAddressType = (!["BusinessIntrests","professional",'lenderData',"transportation",'RealEstate',"Non-Retirement"].includes(refrencePage) ) ? true : false;



const isactivationScreen = refrencePage == 'activationForm'
const colLgSize =  refrencePage === 'professional' && props?.refrencePageDsc === 'Professional Contact & Address Information' ? 3 :
  refrencePage === 'lenderData' ? 12 :
  refrencePage === 'transportation' ? 6 :
  (["EditChildWithAccordian", "BusinessIntrests", "AddChildWithProgressBar", "Liabilities", "AddFiduciaryBeneficiary", "EditFiduciaryBeneficiary"].includes(refrencePage) || refrencePage === 'professional') && isShowingDescriptions ? 5 : 4;

   //////FILTERED CONTACTTYPE DROPDOWN VALUES
   const filteredContactTypes = (data, value) => {
    if (isNotNullUndefined(props?.editJsonData)) {
      let addedList = props?.userContact?.contact?.mobiles.length > props?.userContact?.contact?.emails.length ? props?.userContact?.contact.mobiles : props?.userContact?.contact?.emails
      let filtered = data?.filter((ele) => ele.value != value ? (!addedList?.some((e) => e.contactTypeId == ele.value)) : addedList?.some((e) => e.contactTypeId == ele.value))
      if (refrencePage == "Liabilities") {
        let newJson = filtered?.filter((ele) => ele?.value !== "999999")
        return newJson
      } else {
        return filtered
      }
    } else {
      let addedList = props?.userContact?.contact?.mobiles.length > props?.userContact?.contact?.emails?.length ? props?.userContact?.contact?.mobiles : props?.userContact?.contact?.emails
      let filtered = data?.filter((ele) => !addedList?.some((e) => e.contactTypeId == ele.value))
      if (refrencePage == "Liabilities") {
        let newJson = filtered?.filter((ele) => ele?.value !== "999999")
        return newJson
      } else {
        return filtered
      }


    }


  }
 
  const [manditioryFileds, setManditioryFileds] = useState()
   useEffect(() => {
     if($AHelper?.$isNotNullUndefine(universaladdressFormate) && universaladdressFormate?.length > 0){
      const mandatoryFields = $AHelper.$extractMandatoryFields(universaladdressFormate[0]); // Extract fields with [*]
      setManditioryFileds(mandatoryFields)
     }
   }, [universaladdressFormate])
  
  


  const setMandatory = (name,label) => {      
  const isValid = manditioryFileds?.some(item => item.key == name)
   || name === "Address Type" 
  //  || name == 'Address';
   const   isValidNun = ((!["transportation", "activationForm", "Non-Retirement",'professional'].includes(props?.refrencePage)) ? isNotNullUndefined(addressDetails?.addressTypeId) : false);    
  const hasEmptyValues = Object.entries(formData).filter(([key]) => key !== 'longitude' && key !== 'lattitude').some(([, val]) => isNotNullUndefined(val)) || isNotNullUndefined(searchInput?.current?.value) 
  || isValidNun;

  if ((props?.isMandotry === true) || (props?.isMandotry === false && (hasEmptyValues))) {
    return isValid ? `${label}*` : label;
  }
  return label;
  };



  const filterAddressType = (addressType) => {
    if (refrencePage == "Liabilities") {
      let newJson = addressType?.filter((ele) => ele?.value !== "999999")
      return newJson
    } else {
      return addressType
    }

  }
  const setAddressLine1Data = () => {
    // setAddressLine1(searchInput?.current?.value)
  }
 
  const handleInputChange = (value, key) => {
    setContactDetails((prev) => ({...prev,[key]:value}));
    hideErrMsg(`${"mobile"}Err`, errMsg)
    hideErrMsg(`${key}Err`, errMsg)
  }
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const addUpdateEmailMobile = (apiType, url, updateJson)=>{
    return new Promise(async(resolve, reject) => {
      const _resultGetActivationLink = await postApiCall(apiType, url, updateJson);
      resetContactData()
      resolve(_resultGetActivationLink)
  })
  }
  const resetContactData = () => {
    setContactDetails((prev) => ({
      ...prev,
      contactTypeId: '',
      email: '',
      mobileNumber: "",
      countryCode: "+1",
      comeTypes: "1",
      otherContact: ""
    }));
  }


  useImperativeHandle(ref, () => ({
    handleSubmit, submitContact, setUserData, setContactValues, getContactValues, checkValidContact , isValidateAddress: validateContact,allResetAddressContact, getSpouseAddressData
  }));


  const getSpouseAddressData = () => {
    return {
      addresses: spouseMemberAddress,
      revokableSpouseRoleId: spouseEmailActiveData?.[0]?.roleDetails?.find(role => [1, 9, 10].includes(role.roleId)),
    };
  }

    ///////////// AUTOCOMPLETE ADDRESS
    const autoCompleteAddress = (value, key) => {
      setErrMsg(newObjErr())
      initMapScript().then(() => $AHelper.$initAutoComplete(searchInput,setFormData,universaladdressFormate,dispatch));
    }
 
    const [formData, setFormData] = useState(Object.fromEntries($AHelper.$extractFields(universaladdressFormate).map(({ key }) => [key, ""])));

    const resetForm = () => {
      setFormData(Object.fromEntries($AHelper.$extractFields(universaladdressFormate).map(({ key }) => [key, ""])));
      setAddressDetails(prevState => ({...prevState,addressTypeId: ''}));      
    };
   
    const countyIndex = $AHelper.$extractFields(universaladdressFormate).findIndex(({ key }) => key === "county");
    if (countyIndex !== -1) {
      $AHelper.$extractFields(universaladdressFormate)?.splice(countyIndex + 1, 0, { key: "countyReference", label: "County Reference", order: $AHelper.$extractFields(universaladdressFormate)[countyIndex].order + 0.1 });
    }
    // Handle changes
    const handleChange = (e, key) => {
      setFormData({ ...formData, [key]: e});
      hideErrMsg(`${key}Err`,'')
    };



    const validateContact = (callFrom) => {
      let needErrorFocus = true;
      let isValidAddress = true; // Ensure previous validations are considered
 
  
      // Validate all mandatory fields
      for (let i = 0; i < manditioryFileds.length; i++) {
          const isFieldValid = validateField(manditioryFileds[i].key, `${manditioryFileds[i].key}Err`, needErrorFocus,manditioryFileds[i].value);
          needErrorFocus = needErrorFocus && isFieldValid; // Focus only on the first invalid field
          isValidAddress = isValidAddress && isFieldValid; // Accumulate validation results
      } 
    
      const isValidAddressTypeId = validateField(addressTypeId, 'addressTypeIdErr', needErrorFocus);
      // const isValidAddres = validateField(searchInput?.current?.value, 'addressErr', needErrorFocus);

      return (
          (!["BusinessIntrests", "lenderData", "transportation", "professional", "RealEstate"].includes(refrencePage) 
              ? isValidAddressTypeId 
              : true) 
          && isValidAddress
      );
  };

    const handleSubmit = async (isModal, type, newAddress,institutionUserId) => {
     
      let addrressData = (["activationForm", "PersonalInformation"].includes(props?.refrencePage)) && userId == primaryIdBySession ? primaryMemberAddress : (["activationForm", "PersonalInformation"].includes(props?.refrencePage)) && userId == spouseIdBySession ? spouseMemberAddress : nonPrimarySpouseAddress
      let loggedInUserId = loggedInUserId ?? sessionStorage.getItem('loggedUserId')
      let isPhysicalAddress = addrressData?.length > 0 ? addrressData?.filter((ele) => ele?.addressTypeId == 1) : []
      const isValid = manditioryFileds.some(field => isNotNullUndefined(formData[field.key]) || isNotNullUndefined(searchInput?.current?.value)
      ||  (!["transportation", "activationForm", "Non-Retirement",'professional'].includes(props?.refrencePage) ? isNotNullUndefined(addressTypeId) : false));
     
      const isEditBeniFiducry = (refrencePage === 'EditFiduciaryBeneficiary') && ((userId === primaryIdBySession) || (userId === spouseIdBySession));
       if(["Non-Retirement"].includes(props?.refrencePage) && isNotNullUndefined(natureId) && !isValid){
        deleteAddress(natureId, "index", "address", "",institutionUserId)
      }
      
      if ((props?.isMandotry == false && isValid == true) || (isEditBeniFiducry && isPhysicalAddress.length < 1)) {
        if (validateContact() || props.refrencePage == 'lenderData') {
          let apiTYPE;
          let url;
          let addressJosn;
          if (!["BusinessIntrests", "Liabilities", "transportation", "RealEstate"].includes(props?.refrencePage)) {
            let id = props?.userId || userId || institutionUserId
            addressJosn = $JsonHelper.createAddressJsons(id,loggedInUserId,addressDetails?.addressTypeId,formData,apiTYPE)
                       
            if(props?.refrencePage == "Non-Retirement" && isNotNullUndefined(natureId)){
              apiTYPE = "PUT";
              url = $Service_Url.putupdateAddress;
            }else{
              apiTYPE = "POST";
              url = $Service_Url.postAddAddress;
            }
          
  
          } else {
           
            addressJosn = $JsonHelper.createAddressJsonWithoutUserUd(lattitude, longitude, addressLine1, apt, zipcode, county, city, state, country, countyRefId, loggedInUserId, addressTypes, addressTypeLable)
            if (isNotNullUndefined(props?.businessInterestAddressId)) {
              apiTYPE = "PUT";
              url = $Service_Url.updateaddressadd;
            } else {
              apiTYPE = "POST";
              url = $Service_Url.postaddressAdd;
  
            }
          }
          if (apiTYPE === "PUT") {
            if (!["BusinessIntrests", "RealEstate"].includes(props?.refrencePage)) {
              addressJosn.address = {
                ...(addressJosn.address || {}),
                addressId: props?.refrencePage == "Non-Retirement"  ? natureId : props?.editJsonData?.addressId
              };
            } else {
              addressJosn["addressId"] = props?.businessInterestAddressId;
            }
  
          }
  
  
  
          if (["Liabilities", "transportation", "lenderData"].includes(props?.refrencePage)) {
            setNonPrimarySpouseAddress([{ ...nonPrimarySpouseAddress, ...addressJosn }]);
  
            const addressData = [...nonPrimarySpouseAddress]
            if (isModal == "openModal") {
              setmodalType(type)
              setShowModal(!showModal)
  
            } else {
              if (props?.refrencePage == 'lenderData' && natureId != '') {
                addressJosn.address = {
                  ...(addressJosn.address || {}),
                  addressId: natureId
                };
              }
              const myObject = {
                "isActive": true,
                "json": addressData.length > 0 && (!["transportation", "lenderData"].includes(props?.refrencePage)) ? addressData : [addressJosn]
              };
              return myObject
            }
  
  
          }
  
  
  
  
          else {
            useLoader(true)
            const _resultGetActivationLink = await postApiCall(apiTYPE, url, addressJosn);
            useLoader(false)
            if (_resultGetActivationLink == "err") {
              return false;
            }
  
            var addressId = _resultGetActivationLink?.data?.data?.addressId
            if (addressTypeId == "999999") {
              let addressResponse = _resultGetActivationLink.data?.data?.addresses[0]
              addressRef.current.saveHandleOther(addressResponse.addressId);
            }
        
            if (!["BusinessIntrests", "RealEstate"].includes(props?.refrencePage)) {          
              getApisData(userId)
              searchInput.current.value = ''
              resetForm()
            }
  
            useLoader(false)
            if ((isPhysicalAddress.length == 1 || addressTypeId == 1) || ([true,false].includes(props?.isChild)) || ["BusinessIntrests", "lenderData", "AddFiduciaryBeneficiary","RealEstate"].includes(refrencePage) || (refrencePage === 'EditFiduciaryBeneficiary' && ![primaryIdBySession, spouseIdBySession].includes(userId))) {
         
              const myObject = {
                "isActive": true,
                "addressId": addressId
              };
              return myObject
            } else {
              if (isPhysicalAddress.length == 0 && newAddress !== "newAddress" && (props?.type == "Spouse" || props?.type == "Personal")) {
                toasterAlert("warning", "Physical address is mandatory")
                resetForm()
              }
              const myObject = {
                "isActive": false,
                "addressId": addressId
              };
              return myObject
            }
          }
  
  
        } else {
          if (isValid == true) return {                                 
            "isActive": false,
            "addressId": null
          };
          if (isEditBeniFiducry && isPhysicalAddress.length < 1){                                 
            toasterAlert("warning", "Physical address is mandatory")
            const myObject = {
              "isActive": false,
            };
            return myObject
          };
          if (isPhysicalAddress.length == 1 || addressTypeId == 1 || ['Liabilities',"AddFiduciaryBeneficiary","EditFiduciaryBeneficiary"].includes(refrencePage)) {
            const myObject = {                                
              "isActive": true,
              "addressId": null
            };
            return myObject
          } else {
            if (isPhysicalAddress.length == 0 && (["PersonalInformation","activationForm"].includes(refrencePage))) {
              toasterAlert("warning", "Physical address is mandatory")
            }
            const myObject = {
              "isActive": false,
              "addressId": null
            };
            return myObject
          }
  
        }
      } else {
        const addressData = [...nonPrimarySpouseAddress]
        const myObject = {
          "isActive": true,
          "addressId": null,
          "json": (["Liabilities",'transportation'].includes(refrencePage)) ? addressData : ""
        };
        return myObject
      }
  
    }

    
   const showOnlyForms = !isNotNullUndefined(nonPrimarySpouseAddress) || nonPrimarySpouseAddress?.length == 0 || showOnlyForm == true || refrencePage == 'lenderData'
   
 
  const setContactValues = (data) => {
    let mobileNumber, countryCode, email;
    if (props?.refrencePage === "Non-Retirement") {
        const contactInfo = separateCountryCodeAndNumber(data?.contact?.mobiles[0]?.mobileNo) ?? {};
        mobileNumber = contactInfo.number;
        countryCode = contactInfo.countryCode || "+1";
        email = data?.contact?.emails[0]?.emailId;
    } else {
        mobileNumber = data?.mobileNumber;
        countryCode = data?.countryCode;
        email = data?.email;
    }

    setContactDetails((prev) => ({...prev,mobileNumber,countryCode,email}));
};


  const getContactValues = ( data ) => {
    return {
      mobileNumber: mobileNumber,
      countryCode: countryCode,
      email: email
    }
  }
  const checkValidContact = () => {
    let isValid = validateFieldContact(email, 'emailErr');
    if(mobileNumber?.length < 10) {
      setErrMsg(prev => ({ ...prev, ["mobileErr"]: 'Enter a valid mobile number' }));
      isValid = false;
    } else {
      isValid = isValid && validateFieldContact(mobileNumber, 'mobileErr');
    }
    return isValid;
  }

  const allResetAddressContact =()=>{
    resetForm()
    resetContactData()
}

  return (
    <>
     <Row id='contactDetails'>
        {isSideContent && (
          refrencePage == "PersonalInformation" ? "" : (
            <Col xs={12} md={12} xl={3}>
              {refrencePage == "PersonalInformation" ? <h3 className='main_Heading'>Contact & Address Information</h3> : ""}
              <div className="heading-of-sub-side-links-3">{isSideContent}</div>
            </Col>))
        }



        {refrencePage == "PersonalInformation" ?
          <>
            <Col xs={12} sm={12} md={12} xl={12} className='mt-0'>
              <div style={{ width: "33%", marginTop: "1rem" }} >
                {((showSameAs(refrencePage) || isChecked == true) &&  isPrimaryMemberMaritalStatus == true) &&
                  <Row className='mb-2'>
                    <div className='d-flex' style={{ whiteSpace: "nowrap", }}>
                      <label className='ps-2'>{labelOfisSameAs}</label>
                      <input tabIndex={startingTabIndex + 1} className=' ms-2' type="checkBox" checked={isChecked} onChange={(e) => handleRadioOcc(e, 'isWorking')} />
                    </div>
                  </Row>
                }
              </div>
              {/* ////////address details */}
              <div id="information-table" className="mt-3 information-tables table-responsive" style={{ padding: "8px 0px 0px 0px" }}>
                <div className="table-search-section sticky-header-1 p-4 d-flex justify-content-between align-items-center" style={{ height: "40px" }}>
                  <div className="children-header w-50"><span style={{ paddingLeft: "1px" }}>{"Address"}</span></div>
                </div>
                <div className='table-responsive fmlyTableScroll'>

                  <div style={{ width: "max-content", minWidth: "100%" }}>
                    <Table className="custom-table mb-0">
                      <thead className="sticky-header p-4">
                        <tr style={{position:"sticky"}}>
                          {tableHeader.map((item, index) => (
                            <th key={index} className={`${item === "Edit/Delete/Add" ? "text-end" : ""} contactDescri`}>{item}</th>
                          ))}
                        </tr>
                      </thead>

                      <>
                        {/* ///////// primary address   */}
                        {primaryMemberAddress?.length > 0 ? (
                          <tbody className=''>
                            {filterAddressData(primaryMemberAddress)?.map((element, index) => {
                              return (                                
                                <tr key={index}>
                                  <td className='' style={{ width: "33%" }}>
                                    <div className='mt-2' style={AddressCSS}>
                                      <div className='d-flex'>
                                        <div>
                                          <img className='icon cursor-pointer mt-0 me-2' src='/icons/Address.svg' alt="Address icon" />
                                        </div>
                                        <div>
                                          {isChecked == true && element?.addressTypeId == 1 ? ""  : `${primaryMemberFirstName}'s `}                                    
                                           <OtherInfo
                                            key={index}
                                            othersCategoryId={2}
                                            othersMapNatureId={element?.addressId}
                                            FieldName={element?.addressType}
                                            userId={primaryUserIds}
                                          />
                                            {' Address'}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  <td style={{ width: "53%" }}>
                                    <div className='mt-3'>
                                      <CustomToolTip maxLength={50} content={element?.addressLine1} />
                                    </div>
                                  </td>
                                  <td style={{ width: "20%" }}>
                                    <div className="d-flex gap-1">
                                      
                                        <CustomIconTooltip msg={'Edit'}>
                                          <img tabIndex={startingTabIndex + 2 + index + 1} className='icon cursor-pointer focusAddressImg'
                                           onClick={() => editAddressContact(element, index, "address", "primary")} src='/icons/EditButton.svg'
                                           onKeyDown={(event) => handleKeyDownPrimary(event, "edit", element, index, null)} />
                                        </CustomIconTooltip>
                                      
                                      {deleteAddressData(element?.addressType,primaryUserIds) &&
                                        <CustomIconTooltip msg={'Delete'}>
                                          <img className='icon cursor-pointer focusAddressImg' tabIndex={startingTabIndex + 2 + index + 2}
                                          onClick={() => deleteAddress(element, index, "address", "primary")} src='/icons/DeleteButton.svg' 
                                          onKeyDown={(event) => handleKeyDownPrimary(event, "delete", element, index, null)} />
                                        </CustomIconTooltip>
                                      }
                                      {((primaryMemberAddress?.length > 0 && index === filterAddressData(primaryMemberAddress).length - 1))
                                        ?
                                        <CustomIconTooltip msg={`Click to add more Address for ${primaryMemberFirstName} `}>
                                          <img tabIndex={startingTabIndex + 2 + index + 2} className='icon cursor-pointer focusAddressImg'
                                           onClick={() => AddressAndContactModal("address", "", primaryUserIds)} src='/icons/Contact&address.svg'
                                           onKeyDown={(event) => handleKeyDownPrimary(event, "add", null, null, primaryUserIds)}/>
                                        </CustomIconTooltip>
                                        : <div></div>
                                      }

                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        ) : (
                          <tbody>
                            <tr>
                              <td id="monthlyIncome" colSpan={tableHeader.length} className='p-1'>  
                              <div className=' no-data-found  AddNewButton'>
                                <Row>
                                  <Col md={5} xl={5} className="d-flex justify-content-end">
                                  <img tabIndex={startingTabIndex + 2} className='icon cursor-pointer focusAddressImg me-2'  
                                  onClick={() => AddressAndContactModal("address", "", primaryUserIds)} src='/icons/Contact&address.svg' 
                                  onKeyDown={(event) => handleKeyDownPrimary(event, "add", null, null, primaryUserIds)} />
                                  </Col>
                                  <Col md={7} xl={7} className="d-flex justify-content-start mt-auto mb-auto">
                                  Add {primaryMemberFirstName}'s address                                  
                                  </Col>                                 
                                  </Row> 
                                  </div>  
                              </td>
                            </tr>
                          </tbody>
                        )}


                        {/* ////////////  spouse address   */}
                        {isPrimaryMemberMaritalStatus == true && <>
                          {(spouseMemberAddress?.length > 1) || (spouseMemberAddress?.length == 1 && isChecked == false) ? (
                            <tbody className=''>
                              {filterAddressData(spouseMemberAddress)?.map((element, index) => {
                                 if (element?.addressTypeId == 1 && isChecked == true) return null;                              return (
                                  <tr key={index}>
                                   
                                    <td className='' style={{ width: "33%" }}>
                                    <div className='mt-2' style={AddressCSS}>
                                      <div className='d-flex'>
                                        <div>
                                          <img className='icon cursor-pointer mt-0 me-2' src='/icons/Address.svg' alt="Address icon" />
                                        </div>
                                        <div>
                                          {`${spouseFirstName}'s `}                                    
                                           <OtherInfo
                                            key={index} 
                                            othersCategoryId={2}
                                            othersMapNatureId={element?.addressId}
                                            FieldName={element?.addressType}
                                            userId={spouseUserIds}
                                          />
                                            {' Address'}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                    <td style={{ width: "42%" }}><div className='mt-3'>
                                      <CustomToolTip maxLength={50} content={element?.addressLine1} />
                                    </div></td>
                                    <td style={{ width: "25%%" }}>
                                      <div className="d-flex  gap-1">
                                        {editandAddressData(element?.addressType, "spouse") &&
                                          <CustomIconTooltip msg={'Edit'}>
                                            <img className='icon cursor-pointer focusAddressImg' tabIndex={startingTabIndex + 3 + ((primaryMemberAddress?.length || 0) * 2)  + 1 + index} 
                                            onClick={() => editAddressContact(element, index, "address", "Spouse")} src='/icons/EditButton.svg'
                                            onKeyDown={(event) => handleKeyDownSpouse(event, "edit", element, index, null)}/>
                                          </CustomIconTooltip>
                                        }
                                        {deleteAddressData(element?.addressType,spouseUserIds) &&
                                          <CustomIconTooltip msg={'Delete'}>
                                            <img className='icon cursor-pointer focusAddressImg' tabIndex={startingTabIndex + 3 + ((primaryMemberAddress?.length || 0) * 2) + 2 + index} 
                                            onClick={() => deleteAddress(element, index, "address", "Spouse")} src='/icons/DeleteButton.svg'
                                            onKeyDown={(event) => handleKeyDownSpouse(event, "delete", element, index, null)}/>
                                          </CustomIconTooltip>
                                        }
                                        {((spouseMemberAddress?.length > 0 && index === filterAddressData(spouseMemberAddress).length - 1)
                                        )
                                          ?
                                          <CustomIconTooltip msg={`Click to add more Address for ${spouseFirstName}`}>
                                            <img className='icon cursor-pointer focusAddressImg ' tabIndex={startingTabIndex + 3 + ((primaryMemberAddress?.length || 0) * 2) + 2 + index} 
                                            onClick={() => AddressAndContactModal("address", "", spouseUserIds)} src='/icons/Contact&address.svg'
                                            onKeyDown={(event) => handleKeyDownSpouse(event, "add", null, null, spouseUserIds)}/>
                                          </CustomIconTooltip>
                                          : <div></div>}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          ) : (spouseMemberAddress?.length == 0) || (spouseMemberAddress?.length == 1 && isChecked == true) ? (
                            <tbody>
                              <tr>
                                <td id="monthlyIncome" colSpan={tableHeader.length} className='p-1'>
                               
                                      <div className=' no-data-found  AddNewButton'>
                                <Row>
                                  <Col md={5} xl={5} className="d-flex justify-content-end">
                                  <img tabIndex={startingTabIndex + 3 + ((primaryMemberAddress?.length || 0) * 2) } className='icon cursor-pointer focusAddressImg me-2' 
                                   onClick={() => AddressAndContactModal("address", "", spouseUserIds)} src='/icons/Contact&address.svg'
                                   onKeyDown={(event) => handleKeyDownSpouse(event, "add", null, null, spouseUserIds)} />

                                  </Col>
                                  <Col md={7} xl={7} className="d-flex justify-content-start mt-auto mb-auto">
                                  Add {spouseFirstName}'s address
                                  </Col>
                                 
                                  </Row> 
                                  </div> 
                                </td>
                              </tr>
                            </tbody>
                          ):""}

                        </>}


                      </>
                    </Table>
                  </div>
                </div>
              </div>

              {/* ///////contact details */}
              <div id="information-table" className="mt-4 information-tables table-responsive" style={{ padding: "8px 0px 0px 0px" }}>
                <div className="table-search-section sticky-header-1 p-4 d-flex justify-content-between align-items-center" style={{ height: "40px" }}>
                  <div className="children-header w-50"><span style={{ paddingLeft: "1px" }}>{"Phone & Email"}</span></div>
                </div>
                <div className='table-responsive fmlyTableScroll'>
                  {/* ////////primary data */}
                  <div style={{ width: "max-content", minWidth: "100%" }}>
                    <Table className="custom-table mb-0">
                      <thead className="sticky-header p-4">
                        <tr>
                          {tableHeader1.map((item, index) => (
                            <th key={index} className={`${item === "Edit/Delete/Add" ? "text-start" : ""} contactDescri`}>{item}</th>
                          ))}
                        </tr>
                      </thead>
                      <>
                        {/* ///////// primary contact   */}
                        {getEmailAndMobileWithSameContactTypeId(primaryMemberContact?.contact)?.length > 0 ? (
                          <tbody className=''>
                            {filterContactData(primaryMemberContact)?.map((element, index) => {
                              return (
                                <tr key={index}>
                                  <td><div style={AddressCSS1}>
                                    <div className='d-flex'>
                                      <div>
                                        <img className='icon cursor-pointer mt-0 me-2' src='/icons/contacts.svg' />
                                      </div>
                                      {`${primaryMemberFirstName}'s ${element?.email?.contactType || element?.mobile?.contactType}`} contact
                                    </div>
                                  </div>
                                  </td>
                                  {<td>{element?.email?.emailId ? <div style={{ width: "17.6rem", wordBreak: "break-word", overflowWrap: "break-word", marginTop: "1rem" }} className='mt-3'>{element?.email?.emailId}</div> : ""}</td>}
                                  {<td style={{ width: "10rem", whiteSpace: "nowrap" }}>{element?.mobile?.mobileNo ? <div className='mt-3'>{$AHelper?.$formatNumber(element?.mobile?.mobileNo)}</div> : ""}</td>}

                                  {/* <td></td> */}
                                  <td>
                                    <div className="d-flex gap-1">
                                      <CustomIconTooltip msg={"Edit"}>
                                        <img className='icon cursor-pointer focusAddressImg me-1' tabIndex={startingTabIndex + 4 + (((primaryMemberAddress?.length || 0) + (spouseMemberAddress?.length || 0)) * 2) + index + 1}
                                         onClick={() => editAddressContact(element, index, "contact", "primary")} src='/icons/EditButton.svg'
                                         onKeyDown={(event) => handleKeyDownContactPrimary(event, "edit", element, index, null, null, null)}/>
                                      </CustomIconTooltip>
                                      {element?.emails?.contactTypeId == 1 || element?.mobile?.contactTypeId == 1  ? <></> :
                                        <CustomIconTooltip msg={"Delete"}>
                                          <img className='icon cursor-pointer focusAddressImg' tabIndex={startingTabIndex + 4 + (((primaryMemberAddress?.length || 0) + (spouseMemberAddress?.length || 0)) * 2) + index + 2}
                                           onClick={() => deleteAddress(element, index, "contact", "primary")} src='/icons/DeleteButton.svg'
                                           onKeyDown={(event) => handleKeyDownContactPrimary(event, "delete", element, index, null, null, null)}/>
                                        </CustomIconTooltip>
                                      }

                                      {((getEmailAndMobileWithSameContactTypeId(primaryMemberContact?.contact)?.length > 0 && index === filterContactData(primaryMemberContact).length - 1)) ?
                                        <CustomIconTooltip msg={`Click to add more contact for ${primaryMemberFirstName}`}>
                                          <img className='icon cursor-pointer focusAddressImg' tabIndex={startingTabIndex + 4 + (((primaryMemberAddress?.length || 0) + (spouseMemberAddress?.length || 0)) * 2) + index + 2}
                                           onClick={() => AddressAndContactModal("contact", "", primaryUserIds)} src='/icons/Contact&address.svg' 
                                           onKeyDown={(event) => handleKeyDownContactPrimary(event, "add", null, null, primaryUserIds, isModalOpen, setIsModalOpen)} />
                                        </CustomIconTooltip> : <div></div>}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        ) : (
                          <tbody>
                            <tr>
                              <td id="monthlyIncome" colSpan={tableHeader1.length} className='p-1'>                             
                                <div className=' no-data-found  AddNewButton'>
                                <Row>
                                  <Col md={5} xl={5} className="d-flex justify-content-end">
                                  <img className='icon cursor-pointer focusAddressImg me-2' tabIndex={startingTabIndex + 4 + (((primaryMemberAddress?.length || 0) + (spouseMemberAddress?.length || 0)) * 2)} 
                                   onClick={() => AddressAndContactModal("contact", "", primaryUserIds)} src='/icons/Contact&address.svg'
                                   onKeyDown={(event) => handleKeyDownContactPrimary(event, "toggleModal", null, null, primaryUserIds, isModalOpen, setIsModalOpen)}/>
                                  </Col>
                                  <Col md={7} xl={7} className="d-flex justify-content-start mt-auto mb-auto">
                                  Add {primaryMemberFirstName}'s contact                                 
                                  </Col>                                 
                                  </Row> 
                                  </div>  
                              </td>
                            </tr>
                          </tbody>
                        )}

                        {/* ////////////  spouse contact   */}
                        {isPrimaryMemberMaritalStatus == true && <>
                          {getEmailAndMobileWithSameContactTypeId(spouseMemberContact?.contact)?.length > 0 ? (
                            <tbody className=''>
                              {filterContactData(spouseMemberContact)?.map((element, index) => {
                                return (
                                  <tr key={index}>
                                    <td className=''><div style={AddressCSS1}>
                                      <div className='d-flex'>
                                        <div>
                                          <img className='icon cursor-pointer mt-0 me-2' src='/icons/contacts.svg' />
                                        </div>
                                        {`${spouseFirstName}'s ${element?.email?.contactType || element?.mobile?.contactType}`} contact</div></div></td>
                                    {<td>{element?.email?.emailId ? <div style={{ width: "17.6rem", wordBreak: "break-word", overflowWrap: "break-word", marginTop: "1rem" }} className='mt-3'>{element?.email?.emailId}</div> : ""}</td>}
                                    {<td style={{ width: "15rem", whiteSpace: "nowrap" }}>{element?.mobile?.mobileNo ? <div className='mt-3'>{$AHelper?.$formatNumber(element?.mobile?.mobileNo)}</div> : ""}</td>}
                                    {/* <td></td> */}
                                    <td>
                                      <div className="d-flex gap-1">
                                        <CustomIconTooltip msg={"Edit"}>
                                          <img className='icon cursor-pointer focusAddressImg me-1' tabIndex={startingTabIndex + 5 + (((primaryMemberAddress?.length || 0) + (spouseMemberAddress?.length || 0) + (filterContactData(primaryMemberContact)?.length || 0)) * 2) + index + 1}
                                           onClick={() => editAddressContact(element, index, "contact", "Spouse")} src='/icons/EditButton.svg'
                                           onKeyDown={(event) => handleKeyDownContactSpouse(event, "edit", element, index, null, null, null)} />
                                        </CustomIconTooltip>
                                        {element?.emails?.contactTypeId == 1 || element?.mobile?.contactTypeId == 1  ? <></> :
                                          <CustomIconTooltip msg={"Delete"}>
                                            <img className='icon cursor-pointer focusAddressImg ' tabIndex={startingTabIndex + 5 + (((primaryMemberAddress?.length || 0) + (spouseMemberAddress?.length || 0) + (filterContactData(primaryMemberContact)?.length || 0)) * 2) + index + 2}
                                             onClick={() => deleteAddress(element, index, "contact", "Spouse")} src='/icons/DeleteButton.svg'
                                             onKeyDown={(event) => handleKeyDownContactSpouse(event, "delete", element, index, null, null, null)} />
                                          </CustomIconTooltip>
                                        }

                                        {((getEmailAndMobileWithSameContactTypeId(spouseMemberContact?.contact)?.length > 0 && index === filterContactData(spouseMemberContact).length - 1)) ?
                                          <CustomIconTooltip msg={`Click to add more contact for ${spouseFirstName}`}>
                                            <img className='icon cursor-pointer focusAddressImg' tabIndex={startingTabIndex + 5 + (((primaryMemberAddress?.length || 0) + (spouseMemberAddress?.length || 0) + (filterContactData(primaryMemberContact)?.length || 0)) * 2) + index + 2}
                                             onClick={() => AddressAndContactModal("contact", "", spouseUserIds)} src='/icons/Contact&address.svg'
                                             onKeyDown={(event) => handleKeyDownContactSpouse(event, "add", null, null, spouseUserIds, isModalOpen, setIsModalOpen)} />
                                          </CustomIconTooltip> : <div></div>}

                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          ) : (
                            <tbody>
                              <tr>
                                <td id="monthlyIncome" colSpan={tableHeader1.length} className='p-1'>
                                  <div className=' no-data-found  AddNewButton'>
                                <Row>
                                  <Col md={5} xl={5} className="d-flex justify-content-end">
                                  <img className='icon cursor-pointer focusAddressImg me-2' tabIndex={startingTabIndex + 5 + (((primaryMemberAddress?.length || 0) + (spouseMemberAddress?.length || 0) + (filterContactData(primaryMemberContact)?.length || 0)) * 2)}
                                   onClick={() => AddressAndContactModal("contact", "", spouseUserIds)} src='/icons/Contact&address.svg'
                                   onKeyDown={(event) => handleKeyDownContactSpouse(event, "toggleModal", null, null, spouseUserIds, isModalOpen, setIsModalOpen)} />
                                  </Col>
                                  <Col md={7} xl={7} className="d-flex justify-content-start mt-auto mb-auto">
                                  Add {spouseFirstName}'s contact                                 
                                  </Col>                                 
                                  </Row> 
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          )}
                        </>}
                      </>
                    </Table>
                  </div>
                </div>
              </div>
              {/* @@ Invite Spouse */}
              {/* <hr /> */}
              {(refrencePage == 'PersonalInformation' && showInvite != true && $AHelper.$isMarried(primaryDetails?.maritalStatusId) && ((spousePartenrEmailVerified == true && checkRoleWithVerifiedMail == false) || !spousePartenrEmailVerified) &&
                <Row className='mt-3'>
                  <InviteSpouse emailAddress={findSpouseEmail() || ""} spouseEmailActiveData={spouseEmailActiveData} />
                </Row>
              )}
              {/* @@ Invite Spouse */}
            </Col>
          </>




          :
          <>
            <Col xs={12} xl={isSideContent ? 9 : 12} md={12} style={{ marginTop: "0px" }}>
            {(showSameAs(refrencePage) || (isChecked == true && userId !== primaryIdBySession)) &&
                        <Row className='mb-2 mx-1'>
                          <CustomRadio name='islivewith'
                            tabIndex={startingTabIndex + 19}
                            options={radioValuesOcc}
                            placeholder={labelOfisSameAs}
                            onChange={(e) => handleRadioOcc(e, 'isWorking')}
                            value={isChecked}
                          />
                        </Row>}

              {["address","both"].includes(showType) ?
                <>
                  {(showOnlyForms) ?
                    <>

                      <Row className=''>
                        {(!isactivationScreen && needToShowAddressType) &&
                          <Col className='mb-2' xs={12} md={12} lg={12}>
                            <CustomSelect isPersonalMedical={refrencePage == 'lenderData' ? true : false} tabIndex={startingTabIndex + 1} isError='' label={setMandatory("Address Type","Address Type")} placeholder='Select'
                              options={filterAddressType(addressType)} onChange={(e) => handleSelectChange(e, 'addressTypeId')} value={addressDetails?.addressTypeId} />
                            {(errMsg.addressTypeIdErr) && <><span className="err-msg-show">{errMsg.addressTypeIdErr}</span></>}
                          </Col>
                        }

                      </Row>
                      {addressDetails?.addressTypeId == "999999" &&
                        <Row className={`d-flex align-items-center ${refrencePage === 'lenderData' ? '' : (['RealEstate', 'Non-Retirement'].includes(refrencePage)) ? 'gapProfessionalNone' : 'gapNone'} spacingBottom headingActivation`}>
                          <Col xs={12} md={6} lg={colLgSize}>
                            <Other tabIndex={startingTabIndex + 3} refrencePage={refrencePage} isChildOther={isChildOther} isPersonalMedical={refrencePage == 'lenderData' ? true : false} othersCategoryId={2} userId={userId} dropValue={addressDetails?.addressTypeId} ref={addressRef} natureId={natureId} notCapital={true} />
                            {(errMsg.otherErr) && <><span className="err-msg-show">{errMsg.otherErr}</span></>}
                          </Col>
                        </Row>}
                      <Row className={`d-flex align-items-center ${['lenderData', 'transportation'].includes(refrencePage) ? '' : (['RealEstate', 'Non-Retirement'].includes(refrencePage)) ? 'gapProfessionalNone' : 'gapNone'} spacingBottom headingActivation`}>

                        <Col className={`${refrencePage === 'professional' && isShowingDescriptions === undefined ? 'customProfessional-lg-5' : ''} ${refrencePage === 'lenderData' ? 'spacingBottom' : ''}`} xs={12} md={6} lg={colLgSize}>
                          <div id='custom-input-field' className={`${"custom-input-field "}${(refrencePage == 'lenderData') ? "full-width" : ""}`}>
                              <p>{setMandatory("Address","Search address")}</p>
                            <input tabIndex={startingTabIndex + 4} label="Address" type='text' className='' placeholder="Enter address for search"
                              id='addressLine1' ref={searchInput} defaultValue={addressLine1} onBlur={setAddressLine1Data} notCapital={true} onChange={(e) => autoCompleteAddress(e, "address")} />
                             {(errMsg.addressErr) && <><span className="err-msg-show mb-2">{errMsg.addressErr}</span></>}
                            </div>
                        </Col>

                      </Row>
                      
              
                      {$AHelper.$extractFields(universaladdressFormate).map(({ key, label }, index, array) => (
                        <div key={key} className="">
                          {key === "county" ? (
                            <>
                              <Row>
                                <Col xs={12} md={12} lg={12}>
                                  <CustomSelect
                                    isPersonalMedical={refrencePage === "lenderData"}
                                    tabIndex={startingTabIndex + 1}
                                    label="County Reference"
                                    placeholder="County Reference"
                                    options={countyRef}
                                    onChange={(e) => handleChange(e, "addressTypeId")}
                                    value={formData[key]}
                                  />
                                </Col>
                              </Row>
                              <Row className={`d-flex align-items-center spacingBottom headingActivation`}>
                                <Col xs={12} md={6} lg={colLgSize}>
                                  <CustomInput
                                    isPersonalMedical={refrencePage === "lenderData"}
                                    tabIndex={startingTabIndex + 6}
                                    label={label}
                                    placeholder={label}
                                    id={key}
                                    value={formData[key]}
                                    notCapital={true}
                                    onChange={(e) => handleChange(e, key)}
                                  />
                                </Col>
                              </Row>
                            </>
                          ) : (
                            <Row className={`d-flex align-items-center spacingBottom headingActivation`}>
                              <Col xs={12} md={6} lg={6}>
                                <CustomInput
                                  isPersonalMedical={refrencePage === "lenderData"}
                                  tabIndex={startingTabIndex + 6}
                                  label={setMandatory(key,label)}
                                  placeholder={label}
                                  id={key}
                                  value={formData[key]}
                                  notCapital={true}
                                  onBlur={(e)=>fildsOnblur(e.target.value,key)}
                                  onChange={(e) => handleChange(e, key)}
                                />
                                {errMsg[`${key}Err`] && <span className="err-msg-show">{errMsg[`${key}Err`]}</span>}
                                </Col>

                              {/* Show "Add another Address" button only on the last index */}
                              {index === array.length - 1 && (
                                <Col className={`${refrencePage === 'professional' && isShowingDescriptions === undefined ? 'customProfessional-lg-5' : ''} ${refrencePage === 'lenderData' ? 
                                'spacingBottom' : 'd-flex justify-content-start justify-content-md-start justify-content-xl-start justify-content-xxl-center'}`} xs={12} md={6} lg={colLgSize} style={{ marginTop: "2rem" }}>
                                  {(!['BusinessIntrests', 'Non-Retirement', 'professional', 'lenderData', 'transportation', 'RealEstate'].includes(refrencePage) && !isactivationScreen) &&

                                    <div className='d-flex addAnotherTextSize imgSizeWithText align-self-center'><img className='mt-0 me-1' src='/icons/plus-circle.svg'></img>
                                      <h5 style={{ color: '#CD9C49', textDecorationLine: "underline", marginTop: "auto", cursor: "pointer" }} onClick={() => AddressAndContactModal("address", "checkvalidation")}>Add another Address</h5>
                                    </div>

                                  }
                                </Col>
                              )}
                            </Row>
                          )}
                        </div>
                      ))}
                      <Row>
                      </Row>
                    </>
                    :
                    <>
                      <div id="information-table" className={`${refrencePage == "professional" ? "" : "mt-4"} information-tables table-responsive`}>
                        <div className="table-search-section sticky-header-1 d-flex  align-items-center" style={{ padding: "0px 10px" }}>
                          <div className="children-header w-50"><span style={{ paddingLeft: "9px" }}>{"Address"}</span></div>

                          <div className='w-25 d-flex flex-row-reverse'>
                            {refrencePage !== "professional" && refrencePage !== "transportation" &&
                              <CustomButton4 label="Add New" onClick={() => AddressAndContactModal("address", "", userId)} />}
                          </div></div>
                        <div className='table-responsive fmlyTableScroll'>
                          <Table className="custom-table mb-0">
                            <thead className="sticky-header">
                              <tr style={{ position: "relative", zIndex: "1" }}>
                                {tableHeader.map((item, index) => (
                                  <th key={index} className={`${item == 'Edit/Delete' ? 'text-end' : ''}`}  >{item}</th>
                                ))}
                              </tr>
                            </thead>
                            {nonPrimarySpouseAddress?.length > 0 ? (
                              <tbody className=''>
                                {filterAddressData(nonPrimarySpouseAddress)?.map((element, index) => {
                                  return (
                                    <tr key={index}>
                                      <td style={{ width: "35%" }}><div className='mt-2' style={AddressCSS}><div><img className='icon cursor-pointer mt-0 me-2' src='/icons/Address.svg' />{element?.addressType} Address</div></div></td>
                                      <td style={{ width: "40%" }}><div className='mt-3'>
                                        <CustomToolTip maxLength={50} content={element?.addressLine1} /></div></td>
                                      <td style={{ width: "25%" }}>
                                        <div className="d-flex justify-content-end gap-3">
                                          {editandAddressData(element?.addressType) && <img className='icon cursor-pointer' onClick={() => editAddressContact(element, index, "address")} src='/icons/EditButton.svg' />}
                                          {deleteAddressData(element?.addressType, userId) ? <img className='icon cursor-pointer' onClick={() => deleteAddress(element, index, "address")} src='/icons/DeleteButton.svg' /> : <div style={{ width: '40px' }}></div>}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            ) : (
                              <tbody>
                                <tr>
                                  <td colSpan={tableHeader.length}>
                                    <div className="text-center no-data-found">No Data Found</div>
                                  </td>
                                </tr>
                              </tbody>
                            )}
                          </Table>
                        </div>
                      </div>
                    </>
                  }
                </>
                : ""}
              {showType == "both" && <div className='mb-4 mt-4' style={{ border: "1px solid #CDCDCD", borderBottom: "none" }}></div>}

              {["contact","both"].includes(showType) ?
                <>
                  {getEmailAndMobileWithSameContactTypeId(nonPrimarySpouseContact?.contact).length == 0 || showOnlyForm == true ?
                    <>
                      <div className={`${!isContactForm ? "mb-3 mt-3" : ""}`}>
                        <Row>
                            <Col xs={12} md={12} className={isactivationScreen ? 'd-flex' : ''}>
                              {!isContactForm && !["Non-Retirement"].includes(refrencePage) && (
                            <Row className={`d-flex align-items-center ${refrencePage === 'lenderData' ? '' : (['RealEstate','Non-Retirement'].includes(refrencePage)) ? 'gapProfessionalNone' : 'gapNone'} ${!isContactForm ? 'spacingBottom': ''}`}>
                              
                              <Col className={refrencePage === 'professional' && isShowingDescriptions === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                                <CustomSelect
                                  isPersonalMedical={refrencePage == 'lenderData' ? true : false}
                                  tabIndex={startingTabIndex + 11}
                                  isError=''
                                  label="Contact Type"
                                  placeholder='Select'
                                  options={filteredContactTypes(contactType, contactTypeId)}
                                  onChange={(e) => handleSelectChange(e, 'contactTypeId')}
                                  value={contactTypeId}/>
                                {(errMsg.contactTypeIdErr) && <><span className="err-msg-show">{errMsg.contactTypeIdErr}</span></>}
                              </Col>
                            </Row>
                              )}
                            {contactTypeId == "999999" &&
                              <Row className={`d-flex align-items-center ${refrencePage === 'lenderData' ? '' : (['RealEstate','Non-Retirement'].includes(refrencePage)) ? 'gapProfessionalNone' : 'gapNone'} spacingBottom`}>
                                <Col className={refrencePage === 'professional' && isShowingDescriptions === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                                  <CustomInput
                                    isPersonalMedical={refrencePage == 'lenderData' ? true : false}
                                    tabIndex={startingTabIndex + 12}
                                    label="Other"
                                    placeholder='Other Description'
                                    id='other'
                                    value={otherContact}
                                    notCapital={true}
                                    onChange={(val) => handleInputChange(val, 'other')}
                                  />
                                </Col>
                              </Row>}
                            {!isactivationScreen && (
                            <Row className="spacingBottom headingActivationfullWidth">
                              <Col className={refrencePage === 'professional' && isShowingDescriptions === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                                <ContactRezex isPersonalMedical={refrencePage == 'lenderData' ? true : false}  startTabIndex={startingTabIndex + 13} setValue={setMobileNumber} mobileNumber={mobileNumber} hideErrMsg={hideErrMsg} errMsg={errMsg} countryCode={countryCode} setcountryCode={setcountryCode} comType={comType} handleSelectChange={handleSelectChange} comeTypes={comeTypes} />
                                {(errMsg.mobileErr) && <><span className="err-msg-show">{errMsg.mobileErr}</span></>}
                                {(errMsg.comeTypeErr) && <><span className="err-msg-show">{errMsg.comeTypeErr}</span></>}
                              </Col>
                            </Row>
                              )}
                            {isactivationScreen && (
                            <Col className="spacingBottom col-6">
                              <Row id='activatonContact' className={refrencePage === 'professional' && isShowingDescriptions === undefined ? 'customProfessional-lg-5' : 'headingActivationfullWidth'} xs={12} md={6} lg={colLgSize}>
                                <ContactRezex isPersonalMedical={refrencePage == 'lenderData' ? true : false} hideCommType={true} startTabIndex={startingTabIndex + 14}  setValue={setMobileNumber} mobileNumber={mobileNumber} hideErrMsg={hideErrMsg} isMandatory={true} errMsg={errMsg} countryCode={countryCode} setcountryCode={setcountryCode} comType={comType} handleSelectChange={handleSelectChange} comeTypes={comeTypes} />
                                {(errMsg.mobileErr) && <div className='w-100'><span className="err-msg-show">{errMsg.mobileErr}</span></div>}
                                {(errMsg.comeTypeErr) && <div className='w-100'><span className="err-msg-show">{errMsg.comeTypeErr}</span></div>}

                              </Row>
                            </Col>
                            )}
                          {!isactivationScreen && (
                            <Row className={`${refrencePage === 'transportation' ? 'spacingBottom ' : 'spacingBottom gapNoneAddAnother headingActivationfullWidth'}`}>
                              <Col className={refrencePage === 'professional' && isShowingDescriptions === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                                <CustomInput
                                  isPersonalMedical={refrencePage == 'lenderData' ? true : false}
                                  tabIndex={startingTabIndex + 15}
                                  label="Email"
                                  placeholder='i.e johnoe@gmail.com'
                                  id='email'
                                  value={email}
                                  isSmall={true}
                                  onChange={(val) => handleInputChange(val, 'email')}
                                />
                              
                                {(errMsg.emailErr) && <><span className="err-msg-show">{errMsg.emailErr}</span></>}
                              </Col>


                              {((!["lenderData","Non-Retirement"].includes(refrencePage)) && !isContactForm) && <Col xs={12} md={6} lg={6} className={`mt-3 d-flex ${(refrencePage === 'professional' && isSideContent) || (['Liabilities','AddFiduciaryBeneficiary','AddChildWithProgressBar'].includes(refrencePage)) ? 'justify-content-start justify-content-md-start justify-content-xl-start justify-content-xxl-center' : 'justify-content-end justify-content-md-center justify-content-xl-center justify-content-xxl-center'}`} >
                                <div className='d-flex addAnotherTextSize imgSizeWithText align-self-center'><img className='mt-0 me-1' src='/icons/plus-circle.svg'></img>
                                  <h5 style={{ color: '#CD9C49', textDecorationLine: "underline", marginTop: "auto", cursor: "pointer" }} onClick={() => AddressAndContactModal("contact", "checkvalidation", userId)}>Add another contact</h5>
                                </div>
                              </Col>}
                            </Row>
                          )}

                            {isactivationScreen && (
                            <Col className="spacingBottom col-6">
                              <Row className={refrencePage === 'professional' && isShowingDescriptions === undefined ? 'customProfessional-lg-5' : 'headingActivationfullWidth'} xs={12} md={6} lg={colLgSize}>
                                <CustomInput
                                  isPersonalMedical={refrencePage == 'lenderData' ? true : false}
                                  tabIndex={startingTabIndex + 16}
                                  label="Email*"
                                  placeholder='i.e johnoe@gmail.com'
                                  id='email'
                                  value={email}
                                  isSmall={true}
                                  onChange={(val) => handleInputChange(val, 'email')}
                                  isDisable={true}/>
                                {(errMsg.emailErr) && <><span className="err-msg-show">{errMsg.emailErr}</span></>}
                              </Row>
                              {(refrencePage != "lenderData" && !isContactForm) && <Row xs={12} md={6} lg={6} className="mt-3 d-flex justify-content-end justify-content-md-center justify-content-xl-center justify-content-xxl-center" >
                                <div className='d-flex addAnotherTextSize imgSizeWithText align-self-center'><img className='mt-0 me-1' src='/icons/plus-circle.svg'></img>
                                  <h5 tabIndex={startingTabIndex + 17}  style={{ color: '#CD9C49', textDecorationLine: "underline", marginTop: "auto", cursor: "pointer" }} onClick={() => AddressAndContactModal("contact", "checkvalidation", userId)}>Add another contact</h5>
                                </div>
                              </Row>}
                            </Col>
                          )}
                          </Col>

                        </Row>
                      </div>
                    </>
                    :
                    <>
                      <div id="information-table" className=" information-tables table-responsive">
                        <div className="table-search-section sticky-header-1 d-flex justify-content-between align-items-center" style={{ padding: "0px 10px" }}>
                          <div className="children-header w-50"><span style={{ paddingLeft: "9px" }}>{"Contacts"}</span></div>

                          <div className='w-25 d-flex flex-row-reverse'>
                            <CustomButton4 tabIndex={startingTabIndex + 18} label="Add New" onClick={() => AddressAndContactModal("contact","", userId)} />
                          </div></div>
                        <div className='table-responsive fmlyTableScroll'>
                          <Table className="custom-table mb-0">
                            <thead className="sticky-header">
                              <tr>
                                {tableHeader1.map((item, index) => (
                                  <th style={{ width: "20%" }} key={index} className={`${item == 'Edit/Delete' ? 'text-end' : ''}`}>{item}</th>
                                ))}
                              </tr>
                            </thead>
                            {getEmailAndMobileWithSameContactTypeId(nonPrimarySpouseContact?.contact)?.length > 0 ? (
                              <tbody className=''>
                                {sortedData?.map((element, index) => {
                                  return (
                                    <tr key={index}>
                                      <td style={{ width: "20%", whiteSpace: "nowrap" }}><div style={AddressCSS1}><div><img className='icon cursor-pointer mt-0 me-2' src='/icons/Address.svg' />{element?.email?.contactType || element?.mobile?.contactType} contact</div></div></td>
                                      {<td style={{ width: "20%", whiteSpace: "nowrap" }}>{element?.email?.emailId ? <div style={{ wordBreak: "break-word", overflowWrap: "break-word", marginTop: "1rem" }} className='mt-3'>{element?.email?.emailId}</div> : ""}</td>}
                                      {<td style={{ width: "20%", whiteSpace: "nowrap" }}>{element?.mobile?.mobileNo ? <div className='mt-3'>{$AHelper?.$formatNumber(element?.mobile?.mobileNo)}</div> : ""}</td>}
                                      <td style={{ width: "20%" }}>
                                        <div className="d-flex justify-content-end gap-3">
                                          <img className='icon cursor-pointer' onClick={() => editAddressContact(element, index, "contact")} src='/icons/EditButton.svg' />
                                          {element?.emails?.contactTypeId == 1 || element?.mobile?.contactTypeId == 1 ? <div style={{width: '40px'}}></div> : <img className='icon cursor-pointer' onClick={() => deleteAddress(element, index, "contact")} src='/icons/DeleteButton.svg' />}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            ) : (
                              <tbody>
                                <tr>
                                  <td colSpan={tableHeader.length}>
                                    <div className="text-center no-data-found">No Data Found</div>
                                  </td>
                                </tr>
                              </tbody>
                            )}
                          </Table>
                        </div>
                      </div>

                    </>
                  }
                </> : ""
              }
            </Col>
          </>}
     </Row>
     {showAddressContactModal && <UniversalAddressContactModal
      defaultAddressFields ={defaultAddressFields}
      show={showAddressContactModal}
      startTabIndex={startingTabIndex + 20}
      handleClose={handleClose}
      header={modalType == "address" ? "Add address information." : "Add contact information"}
      modalType={modalType}
      editJsonData={editJsonData}
      setEditJsonData={setEditJsonData}
      userId={nonPrimarySpouseId}
      userContact={(nonPrimarySpouseId == primaryIdBySession && refrencePage == "PersonalInformation") ? primaryMemberContact : (nonPrimarySpouseId == spouseIdBySession && refrencePage == "PersonalInformation") ? spouseMemberContact : nonPrimarySpouseContact}
      userAddress={(nonPrimarySpouseId == primaryIdBySession && refrencePage == "PersonalInformation") ? primaryMemberAddress : (nonPrimarySpouseId == spouseIdBySession && refrencePage == "PersonalInformation") ? spouseMemberAddress : nonPrimarySpouseAddress}
      userType={type}
      loggedInUserRoleId={loggedInUserRoleId}
      refrencePage={refrencePage}
      setContactData={(nonPrimarySpouseId == primaryIdBySession && refrencePage == "PersonalInformation") ? setPrimaryMemberContact : (nonPrimarySpouseId == spouseIdBySession  && refrencePage == "PersonalInformation") ? setSpouseMemberContact : setNonPrimarySpouseContact}
      setAddressData={(nonPrimarySpouseId == primaryIdBySession && refrencePage == "PersonalInformation") ? setPrimaryMemberAddress : (nonPrimarySpouseId == spouseIdBySession  && refrencePage == "PersonalInformation") ? setSpouseMemberAddress : setNonPrimarySpouseAddress}
      getDataForLiabilities={getDataForLiabilities} 
      newObjErr={newObjErr}
      defaultContactFields ={defaultContactFields}
      />}
    </>
  )
})

export default UniversalAddress

export const UniversalAddressDynamic = ({ dynamicRef, ...props }) => {
  return <UniversalAddress {...props} ref={dynamicRef} />;
}