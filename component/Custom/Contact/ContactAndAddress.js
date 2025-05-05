import React, { useEffect, useState, useRef, useCallback, useImperativeHandle, dispatch, forwardRef, useMemo, useContext } from 'react';
import { Form, Col, Row, Button, Table } from 'react-bootstrap';
import { CustomButton, CustomButton4 } from '../CustomButton';
import { CustomInput, CustomRadio, CustomSelect } from '../CustomComponent';
import { useAppSelector, useAppDispatch } from '../../Hooks/useRedux';
import { selectApi } from '../../Redux/Store/selectors';
import { fetchUserContactData, fetchAddressType, fetchCountyRef, fetchPrimaryUserAddressData, fetchContactType, fetchComType } from '../../Redux/Reducers/apiSlice';
import { $Msg_AddressDetails } from '../../Helper/$MsgHelper';
import { updateIsPrimaryAddress, updateIsSpouseAddress } from '../../Redux/Reducers/personalSlice';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { $AHelper } from '../../Helper/$AHelper';
import { $Service_Url } from '../../../components/network/UrlPath';
import { initMapScript } from '../../../components/control/AHelper';
import { useLoader } from '../../utils/utils';
import { focusInputBox, getApiCall, getApiCall2, isNotValidNullUndefile, postApiCall } from '../../../components/Reusable/ReusableCom';
import Other from '../../../components/asssets/Other';
import OtherInfo from '../../../components/asssets/OtherInfo';
import ReusableAddressContact, { separateCountryCodeAndNumberCharity } from './ReusableAddressContact';
import { globalContext } from '../../../pages/_app';
import InviteSpouse from '../../Personal-Information/InviteSpouse';
import { setIsJointAccount } from '../../Redux/Reducers/personalSlice';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import ContactRezex from './ContactRezex';
import { headerNav } from '../../Personal-Information/PersonalInformation';
import konsole from '../../../components/control/Konsole';
import CustomToolTip from '../CustomTooltip';
import CustomIconTooltip from '../CustomIconTooltip';
import { separateCountryCodeAndNumber } from './ReusableAddressContact';


const ContactAndAddress = forwardRef((props, ref) => {
  const newObjErr = () => ({ countryErr: "", aptErr: "", cityErr: "", stateErr: "", zipcodeErr: "", addressTypeErr: "", countyErr: "", countyRefrenceErr: "", addressLine1Err: '', otherErr: "", emailErr: "", mobileErr: "", contactTypeErr: "", comeTypeErr: "" });
  const dispatch = useAppDispatch();
  const [errMsg, setErrMsg] = useState(newObjErr());
  const [mobileNumber, setMobileNumber] = useState('')
  const apiData = useAppSelector(selectApi);
  const { loggedInUserId, primaryUserId, spouseUserId, primaryDetails, isPrimaryMemberMaritalStatus, _spousePartner, primaryMemberFullName, spouseFullName, spouseFirstName, primaryMemberFirstName } = usePrimaryUserId();
  const [addressLine1, setAddressLine1] = useState('')
  const [countyRefrence, setCountyRefrence] = useState('')
  const [apt, setApt] = useState('')
  const [contactTypes, setContactTypes] = useState()
  const [comeTypes, setComeTypes] = useState("1")
  const [country, setCountry] = useState('United States')
  const [city, setCity] = useState('')
  const [countryCode, setcountryCode] = useState("+1")
  const [otherContact, setOtherContact] = useState('')
  const [lattitude, setLattitude] = useState()
  const [state, setState] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [longitude, setLongitude] = useState()
  const [addressTypes, setAddressTypes] = useState()
  const [editJsonData, setEditJsonData] = useState()
  const { userAddress, contactType, userContact, addressType, countyRef, spouseUserAddress, primaryUserAddress, comType, userDetailById,relationTypeList} = apiData;
  const [showModal, setShowModal] = useState(false)
  const [modalType, setmodalType] = useState('')
  const [county, setcounty] = useState('')
  const [countyRefId, setCountyRefId] = useState('')
  const searchInput = useRef(null)
  const [natureId, setNatureId] = useState(null)
  const addressRef = useRef(null)
  const [email, setEmail] = useState("")
  const [userId, setUserId] = useState()
  const [isChecked, setisChecked] = useState(false)
  const [addressTypeLable, setAddressTypeLable] = useState("")
  const [contactTypeLabel, setContactTypeLabel] = useState("")
  const [isDeleteContact, setisDeleteContact] = useState(false)
  const [userDataByEmailId, setuserDataByEmailId] = useState()
  const [loggedInUserRoleId, setloggedInUserRoleId] = useState()
  const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
  const [addressList, setAddressList] = useState([])
  const [contactData, setContactData] = useState(userContact)
  const [spousePartenrEmailVerified, setSpousePartenrEmailVerified] = useState()
  const [editIndex, seteditIndex] = useState(-1)
  const tableHeader = ['Address Type', 'Address', `Edit/Delete${props?.refrencePage == "PersonalInformation" ? "/Add" : ""}`]
  const tableHeader1 = ['Contact Type', 'Email', 'Phone', `Edit/Delete${props?.refrencePage == "PersonalInformation" ? "/Add" : ""}`]
  const lableName = props?.type == "ADD-EXTENDED-FAMILY" ? "spouse/partner" : _spousePartner;
  const startingTabIndex = props?.startTabIndex ?? 0;

  /////////////////states of new ui
  const [spouseAddressData, setSpouseAddressData] = useState()
  const [primaryContactData, setPrimaryContactData] = useState()
  const [spouseContactData, setSpouseContactData] = useState()
  const [primartAddressData, setPrimartAddressData] = useState()
  const [spouseEmailActiveData, setspouseEmailActiveData] = useState()
  const [primaryUserIdNew, setprimaryUserIdNew] = useState()
  const [spouseId, setSpouseId] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkRoleWithVerifiedMail, setCheckRoleWithVerifiedMail] = useState("")


  useEffect(() => {
    const { refrencePage, userId, businessInterestAddressId} = props; 
    let primaryUserIdNew = sessionStorage.getItem("SessPrimaryUserId") || "";
    setprimaryUserIdNew(primaryUserIdNew)
    let spouseId = sessionStorage.getItem("spouseUserId")
    setSpouseId(spouseId) 
    const isNotNullUndefine = (value) => $AHelper?.$isNotNullUndefine(value);
  
    // Helper function to fetch data based on userId and update state
    const fetchUserData = (id, setAddress, setContact) => {
    
      if (isNotNullUndefine(id)) {
        fetchApiNext(id, setAddress, setContact);
      }
    };
  
    if (refrencePage === "PersonalInformation") { 
    
      if(isNotNullUndefine(primaryUserIdNew)){
        fetchUserData(primaryUserIdNew, setPrimartAddressData, setPrimaryContactData);
      } 
      if (isPrimaryMemberMaritalStatus && isNotNullUndefine(spouseId)) { 
        fetchUserData(spouseId, setSpouseAddressData, setSpouseContactData);
      }
      fetchApi();
    } 


    else if (isNotNullUndefine(userId) || ["BusinessIntrests","RealEstate", "Liabilities", "professional", "transportation", "lenderData", "activationForm","Non-Retirement"].includes(refrencePage)) {
      if (!isNotNullUndefine(userId)) {
        setContactData([]);
        setAddressList([]);
      }
   
      setUserId(userId);
      if ((!["RealEstate","BusinessIntrests"].includes(props?.refrencePage)) && $AHelper?.$isNotNullUndefine(props?.userId || userId)) {
      fetchApiNext(userId);
    }
      
     
      fetchApi(userId);
  
      if (["RealEstate", "BusinessIntrests"].includes(props?.refrencePage) && isNotNullUndefine(businessInterestAddressId)) {     
          getAddressData(businessInterestAddressId);       
         } 
      if ((refrencePage === "lenderData" || refrencePage === "charityData" )&& isNotNullUndefine(userId)) {
        setUserData(userId);
      }  
      if (["professional", "transportation", "activationForm" ,"Non-Retirement","charityData"].includes(refrencePage)) {
        setAddressTypes("1");
      }
      if (["Non-Retirement","charityData"].includes(refrencePage)) {
        setContactTypes("1");
      }
    }
  },[props.userId,props?.refrencePage,spouseId,spouseUserId]);
  
  
  useEffect(() => {
    if (contactData?.length == 0) {
      setContactData(userContact)
    }
  }, [userContact])


  const allResetAddressContact =()=>{
        setContactData([]);
        setAddressList([])
        resetAddressFields()
        setEmail('')
        setMobileNumber('')
        setContactTypes('')
        setcountryCode("+1")
  }



  

  //////////  get address details for spouse or primary
  const getAddressData = async (addressIds) => {
    if ($AHelper?.$isNotNullUndefine(addressIds)) {
      const _resultOf = await getApiCall('GET', $Service_Url.getAddressByaddressID + addressIds, '')
      if(!$AHelper?.$isNotNullUndefine(_resultOf)){
        return;
      }
      setUserAddress(_resultOf)

    }



  }

  const setUserAddress  = (_resultOf) =>{
    const { addressLine1, city, country, state, zipcode, lattitude, longitude, addressTypeId, countyRefId, addressLine2, county, addressId } = _resultOf
    setAddressLine1(addressLine1)
    setCity(city)
    setCountry(country)
    setState(state)
    setZipcode(zipcode)
    setAddressTypes(addressTypeId)
    setLattitude(lattitude)
    setLongitude(longitude)
    setcounty(county)
    setCountyRefId(countyRefId)
    setApt(addressLine2)
    setNatureId(addressId)
  }


  /////////////// call common  get api
  const fetchApi = useCallback(() => {
    contactType.length == 0 && apiCallIfNeed(contactType, fetchContactType());
    addressType.length == 0 && apiCallIfNeed(addressType, fetchAddressType());
    countyRef.length == 0 && apiCallIfNeed(countyRef, fetchCountyRef());
    comType.length == 0 && apiCallIfNeed(comType, fetchComType());
   },[props]);


  const fetchApiNext = useCallback(async (userId, setAddress, setcontact) => {
    let loggedInDetails = JSON.parse(sessionStorage.getItem('stateObj'))
     setloggedInUserRoleId(loggedInDetails?.roleId)
      setUserData(userId, setAddress, setcontact)
  

  }, [primaryUserIdNew, spouseId,props.userId,spouseUserId]);

  const setContactValues = ( data ) => {
    if(props?.refrencePage == "Non-Retirement" || props?.refrencePage == 'charityData'){
      setEmail(data?.contact?.emails[0]?.emailId);
      const { number, countryCode } = separateCountryCodeAndNumber(data?.contact?.mobiles[0]?.mobileNo) ?? {};
      setMobileNumber(number);
      setcountryCode(countryCode || "+1");
    }else{
    setMobileNumber(data?.mobileNumber);
    setcountryCode(data?.countryCode);
    setEmail(data?.email);
  }
  }

  const getContactValues = ( data ) => {
    return {
      mobileNumber: mobileNumber,
      countryCode: countryCode,
      email: email
    }
  }
  const checkValidContact = () => {
    let isValid = validateField(email, 'emailErr');
    if(mobileNumber?.length < 10) {
      setErrMsg(prev => ({ ...prev, ["mobileErr"]: 'Enter a valid mobile number' }));
      isValid = false;
    } else {
      isValid = isValid && validateField(mobileNumber, 'mobileErr');
    }
    return isValid;
  }
  const updateArray = (prevArray, newArray, typeEdit,type) => {  

    // Clone and sort the array to avoid modifying the original array directly
    const shortedPrevData = [...prevArray]?.sort((a, b) => a.contactTypeId - b.contactTypeId);
    if (typeEdit && editIndex !== -1 && shortedPrevData[editIndex]?.contactTypeId === newArray[0]?.contactTypeId) {
   
      // Update the element at editIndex if typeEdit is true and editIndex is valid
      const updatedArray = [...shortedPrevData]; // Clone sorted array for modification
      updatedArray[editIndex] = newArray[0] ?? shortedPrevData[editIndex]; // Replace item at editIndex
    
      seteditIndex(-1); // Reset editIndex
      return updatedArray?.filter(element => $AHelper?.$isNotNullUndefine(element)); // Filter out any null/undefined elements
  
    } else {

      // Append newArray if typeEdit is false or editIndex is not found
      return [...prevArray, ...newArray];
    }
  };


  const getDataForLiabilities = (data, type, typeEdit) => {
    if (type == "address") {
      setAddressList(prevAddressList => {
        if (editIndex !== -1) {
          // Update existing item
          const updatedAddressList = [...prevAddressList];
          if ($AHelper?.$isNotNullUndefine(updatedAddressList[editIndex]?.addressId)) {
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
  
      setContactData(prevContactData => {
        const updateData = {
          emails: data?.contact?.emails?.length > 0 ? [data?.contact?.emails[0]] : [],
          mobiles: data?.contact?.mobiles?.length > 0 ? [data?.contact?.mobiles[0]] : []
        };

        // Function to update arrays based on contactTypeId
      
        return {
          ...prevContactData,
          contact: {
            ...prevContactData.contact,
            emails: updateArray(prevContactData?.contact?.emails ?? [], updateData?.emails, typeEdit,"email"),
            mobiles: updateArray(prevContactData?.contact?.mobiles ?? [], updateData?.mobiles, typeEdit,"mobile"),
            
          }
        };

      });
    }

  }
   const setUserData = useCallback(async(userId, setAddress, setContact) => {  
   
      if(["BusinessIntrests", "lenderData", "RealEstate","charityData"].includes(props?.refrencePage)){
        useLoader(true)  
        if(!$AHelper.$isNotNullUndefine(userId)){
         useLoader(false)
         if(searchInput && searchInput.current) {
          searchInput.current.value = "";
          }
         resetAddressFields()
          return;
        }
        const responseData =  await dispatch(fetchPrimaryUserAddressData(userId))
        useLoader(false)  
        if (responseData?.payload == 'err' && (["BusinessIntrests",'RealEstate'].includes(props.refrencePage))) {
           resetAddressFields()
        }
        if ((["BusinessIntrests", "lenderData", "RealEstate","charityData"].includes(props?.refrencePage)) && responseData?.payload != 'err' && responseData?.payload?.addresses?.length != 0) {
          const filteredData = responseData.payload.addresses.filter((ele) => ele?.addressTypeId == 1)
          if (filteredData?.length > 0) {
            setAddressFields(filteredData[0])    
          }
        }
      }
      useLoader(true) 
      const _resultOf = await getApiCall('GET', $Service_Url.getAllAddress + userId, "");
      let isPhysicalAddress = _resultOf?.addresses?.length > 0 ? _resultOf?.addresses?.filter((ele) => ele?.addressTypeId == 1) : []
      useLoader(false)
        ///////////set address daetails
       if(_resultOf !== 'err'){
    if (props?.refrencePage == "PersonalInformation" && userId == primaryUserIdNew) {
      setAddress(_resultOf?.addresses)
      if (isPhysicalAddress.length > 0) {
        dispatch(updateIsPrimaryAddress(true))
      } else {
        dispatch(updateIsPrimaryAddress(false))
      }

    } else {
      if (props.refrencePage == 'lenderData' && _resultOf.addresses.length != 0) {
        setAddressFields(_resultOf.addresses[0])
      } else if(props?.refrencePage == "Non-Retirement" && _resultOf?.addresses.length > 0){
        setUserAddress(_resultOf?.addresses[0])
      }
      else {
        if (props?.refrencePage == "PersonalInformation" && userId == spouseId) {
          setAddress(_resultOf?.addresses)
          if (isPhysicalAddress.length > 0) {
            dispatch(updateIsSpouseAddress(true))
          } else {
            dispatch(updateIsSpouseAddress(false))
          }
        } else {
          setAddressList(_resultOf?.addresses)
        }
      }
    }
       }    
        ///////////setconctact details////////////////////
      useLoader(true)
      const responses = await dispatch(fetchUserContactData(userId));
      if (props?.refrencePage == "PersonalInformation") {
        setContact(responses?.payload)        
      } else {
        setContactData(responses?.payload)  
        if(props?.refrencePage == "Non-Retirement" || props?.refrencePage == 'charityData') {
          setContactValues(responses?.payload)
        }     
      }
      useLoader(false)   
  }, [primaryUserIdNew,spouseId,props?.userId,spouseUserId]);

  useEffect(() => {
    if($AHelper.$isNotNullUndefine(spouseId) && props.refrencePage == "PersonalInformation"){
      isSpouseVerified(spouseId)
    }
  },[spouseId,spouseUserId])
  

  const isSpouseVerified = useCallback(async(userIdNew) => {
    const response = await getApiCall2('GET', `${$Service_Url.getUserDetailsByUserEmailId}?UserId=${userIdNew}`);
    const emailData = response?.data;
    setspouseEmailActiveData(emailData)
    setCheckRoleWithVerifiedMail(emailData?.[0]?.roleDetails?.some(role => [1, 9, 10].includes(role.roleId)) ?? "")
    if (emailData?.length > 0 && emailData[0]?.isEmailVerified && userIdNew === spouseId) {     
      setSpousePartenrEmailVerified(emailData[0]?.isEmailVerified);  
      dispatch(setIsJointAccount(emailData[0]?.isEmailVerified))    
    }
    },[spouseId,spouseUserId])
  






  // Helper function to reset address fields
const resetAddressFields = () => {

  if(searchInput && searchInput.current) {
    searchInput.current.value = "";
    }
  setAddressLine1('');
  setCity('');
  if(!["BusinessIntrests"]?.includes(props.refrencePage)){
    setCountry('United States');
  } 
  setState('');
  setZipcode('');
  setAddressTypes('');
  setLattitude('');
  setLongitude('');
  setcounty('');
  setCountyRefId('');
  setApt('');
};
// Helper function to set address fields
const setAddressFields = (addressData) => {
  const { addressLine1, city, country, state, zipcode, lattitude, longitude, addressTypeId, countyRefId, addressLine2, county, addressId } = addressData;  
  setAddressLine1(addressLine1);
  if(searchInput && searchInput.current) {
    searchInput.current.value = addressLine1;
    }
  setCity(city);
  setCountry(country);
  setState(state);
  setZipcode(zipcode);
  setAddressTypes(addressTypeId);
  setLattitude(lattitude);
  setLongitude(longitude);
  setcounty(county);
  setCountyRefId(countyRefId);
  setApt(addressLine2);
  setNatureId(addressId);
};
useEffect(() => {
  
    if(["PersonalInformation","EditChildWithAccordian"].includes(props?.refrencePage)){     
      sameAsAddressFunc()
    }
   
},[props?.dataInfo?.memberRelationship?.relativeUserId, spouseAddressData,primartAddressData])

useEffect(() => {
 if((props?.refrencePage == "EditFiduciaryBeneficiary" && (props?.userId == primaryUserIdNew || props?.userId == spouseId))){
  sameAsAddressFunc()
 }
}, [userId])



  ///////// set Same as address  
  const sameAsAddressFunc = async () => {
    if (props?.refrencePage !== "transportation") {
      let userData = props?.dataInfo?.memberRelationship;
      let userID = (props?.type == "ADD-EXTENDED-FAMILY") || ([1,44,47,48,49,50].includes(userData?.relationshipTypeId)  &&  userData?.relativeUserId !== userData?.primaryUserId) || (userData?.relationshipType == "Grand-Child") ? userData?.relativeUserId : primaryUserIdNew
      /////////////get spouseAddress
      
      const useridForSpouse = (["PersonalInformation","EditFiduciaryBeneficiary"].includes(props?.refrencePage)) ? spouseId : props?.dataInfo?.userId
      if ($AHelper?.$isNotNullUndefine(userID) && $AHelper?.$isNotNullUndefine(useridForSpouse)) {         
       let primaryAddressData;
       let spouseAddresData;
      
      if(props?.refrencePage === "PersonalInformation"){
        primaryAddressData = primartAddressData;
        spouseAddresData = spouseAddressData        
      }else if(props?.refrencePage === "EditChildWithAccordian" || (["PersonalInformation","EditFiduciaryBeneficiary"].includes(props?.refrencePage))){
        const responseData = await dispatch(fetchPrimaryUserAddressData(userID))
        const responseData1 = await dispatch(fetchPrimaryUserAddressData(useridForSpouse))
        primaryAddressData = responseData?.payload?.addresses;
        spouseAddresData = responseData1?.payload?.addresses
     
      }
      else{  
     
        const _resultOf = await getApiCall('GET', $Service_Url.getAllAddress + useridForSpouse, "")
        const responseData = await dispatch(fetchPrimaryUserAddressData(userID))
        primaryAddressData = responseData?.payload?.addresses;
        spouseAddresData =  _resultOf?.addresses;        
      }
        
        //////get primary details
        const primaryAddressDetails = primaryAddressData?.filter((ele) => { return ele?.addressTypeId == 1 })
        const spouseAddressDetails = spouseAddresData?.filter((ele) => { return ele?.addressTypeId == 1 })
        if (primaryAddressDetails?.length > 0 && spouseAddressDetails?.length > 0) {

          if ($AHelper?.$isNotNullUndefine(spouseAddressDetails[0]?.sameAsUserId)) {
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
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
    //////////////////////////

  const apiCallIfNeed = (data, action) => {
    if (data.length > 0) return;
    dispatch(action)
  }

  //////////////////autoComplete address   
  const autoCompleteAddress = (value, key) => {
    setAddressLine1(value.target.value)
    hideErrMsg(`${key}Err`, errMsg)
    setErrMsg(newObjErr())
    initMapScript().then(() => initAutoComplete());
  }
  ////// AUTOCOMPLETE ADDRESS
  const initAutoComplete = () => {
    if (!searchInput.current.value) return;
    const autocomplete = new window.google.maps.places.Autocomplete(
      searchInput.current
    );
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.addListener("place_changed", () =>
      onChangeAddress(autocomplete)

    );
  };
  const extractAddress = (place) => {
    const address = {
      city: "",
      state: "",
      zip: "",
      county: "",
      country: "",
      plain() {
        const city = city ? city + ", " : "";
        const zip = zip ? zip + ", " : "";
        const county = county ? county + "," : "";
        const state = state ? state + ", " : "";
        return city + zip + state + country;
      },
    };

    if (!Array.isArray(place?.address_components)) {
      return address;
    }
    let postalCodeSuffix = "";
    let unWanted = ['USA', 'UK'];
    place.address_components.forEach((component) => {
      const types = component.types;
      const value = component.long_name;
      if (types.includes("locality")) {
        address.city = value;
        unWanted.push(component.long_name, component.short_name);
      }
      if (types.includes("administrative_area_level_1")) {
        address.state = value;
        unWanted.push(component.long_name, component.short_name);
      }
      if (types.includes("administrative_area_level_2")) {
        if (value.includes("County") || value.includes("county")) {
          let removedCountyFromValue = value.replace(/County|county/g, "")
          address.county = removedCountyFromValue;
        }
        else { address.county = value; }
        unWanted.push(component.long_name, component.short_name);
      }
      if (types.includes("postal_code")) {
        address.zip = value;
        unWanted.push(component.long_name, component.short_name);
      }
      if (types.includes("country")) {
        address.country = value;
        unWanted.push(component.long_name, component.short_name);
      }
      if (types.includes("county")) {
        address.country = value;
        unWanted.push(component.long_name, component.short_name);
      }
      if (types?.includes("postal_code_suffix")) {
        postalCodeSuffix = value;
        unWanted.push(component.long_name, component.short_name);
      }
    });

    if (postalCodeSuffix) address.zip += '-' + postalCodeSuffix;
    unWanted.push(address.zip);

    address.unWanted = unWanted;
    return address;
  };

  const onChangeAddress = (autocomplete) => {
    const place = autocomplete.getPlace();
    const lat = place?.geometry?.location?.lat();
    const long = place?.geometry?.location?.lng();

    setLongitude(long)
    setLattitude(lat)
    setAddressLine1(searchInput?.current?.value)
    setAddress(extractAddress(place));
  };
  const setAddress = (address) => {
    address = formateAddressLine1(address);
    setCity(address.city)
    setcounty(address?.county)
    setState(address.state)
    setZipcode(address.zip)
    setCountry(address.country)

    if (address?.state == 'New York' || address?.state == 'Alaska') {
      setCountyRefId(1)
    } else if (address?.state == 'Louisiana') {
      setCountyRefId(3)
    } else {
      setCountyRefId(2)
    }

  };
  const formateAddressLine1 = (address) => {
    if (!address || !searchInput?.current?.value || !address.unWanted?.length) return address;

    const curAddressLine1 = searchInput?.current?.value;
    const firstCommaIndex = curAddressLine1.indexOf(',');
    if (firstCommaIndex == -1) {
      address.unWanted = undefined;
      return address;
    }


    let secondPartString = " " + curAddressLine1?.slice(firstCommaIndex) + " ";

    for (let i = 0; i < address.unWanted.length; i++) {
      const searchWord = new RegExp(`( |,)(${address.unWanted[i]})( |,)`, "g");
      secondPartString = secondPartString?.replace(searchWord, " ");
      // konsole.log('curAddressLine1\n' , "1st part:", curAddressLine1.slice(0, firstCommaIndex), "\nsecond part:", secondPartString, "\nregex:", searchWord);
    }

    let finalSecondPart = "";
    let lastChar = "";
    for (let i = 0; i < secondPartString.length; i++) {
      const curChar = secondPartString[i];
      if (curChar == " " || curChar == ",") {
        if (finalSecondPart.length == 0) continue;
        if (lastChar != " " && (lastChar != "," || curChar == " ")) finalSecondPart += curChar;
      } else {
        finalSecondPart += curChar;
      }
      // konsole.log("adbvh", finalSecondPart , "lastChar:(", lastChar, ")curChar:(", curChar, ")");
      lastChar = curChar;
    }

    if (finalSecondPart.length) {
      const lastIndexOfCom = finalSecondPart.lastIndexOf(",");
      if (finalSecondPart.length - lastIndexOfCom <= 2) finalSecondPart = finalSecondPart.slice(0, lastIndexOfCom);
      searchInput.current.value = curAddressLine1.slice(0, firstCommaIndex) + ", " + finalSecondPart;
    }
    else searchInput.current.value = curAddressLine1.slice(0, firstCommaIndex);

    address.unWanted = undefined;
    return address;
  }
  const setAddressLine1Data = () => {
    setAddressLine1(searchInput?.current?.value)
  }
  ///////////////////////////////////////////////



  //////////////////  setInput Data
  const handleInputChange = (value, key) => {
    // let valuUpperCase = $AHelper.$isUpperCase(value)
    let valuUpperCase = value;
    switch (key) {
      case "addressLine1":
        setAddressLine1(value)
        break;
      case "country":
        setCountry(value);
        break;
      case "apt":
        setApt(value);
        break;
      case "city":
        setCity(value);
        break;
      case "state":
        setState(value);
        break;
      case "zipcode":
        setZipcode(value);
        break;
      case "county":
        setcounty(value);
        break;
      case "email":
        setEmail(value);
        break
      case "other":
        setOtherContact(value)
        break
      default:
        // Default case if none of the keys match
        break;
    }


    setStateFun(key, valuUpperCase)
    hideErrMsg(`${key}Err`, errMsg)
  }
  ///////  HIDE ERROR MSG FUNCTION
  const hideErrMsg = (key, errMsg) => {
    if ($AHelper.$isNotNullUndefine(errMsg[key])) {
      setErrMsg(prev => ({ ...prev, [key]: '' }));
    }
  }

  const setStateFun = (key, value) => {
    if (key == "country") {
      setCountry(value)
    }
    hideErrMsg(`${key}Err`, errMsg)

  }
  //////////////////////////////

  ///////// FUNCTION FOR ALL SELECT
  const handleSelectChange = (value, key) => {

    hideErrMsg(`${key}Err`, errMsg)
    if (key == "countyRefrence") {
      setCountyRefId(value.value)
    } else if (key == "contactType") {
      setContactTypes(value.value)
      setContactTypeLabel(value?.label)
    } else if (key == "comeType") {
      setComeTypes(value.value)
    } else if (key == "addressType") {
      setAddressTypes(value.value)
      setAddressTypeLable(value?.label)
    }




  };
  /////////////////////////////

  useImperativeHandle(ref, () => ({
    handleSubmit, submitContact, setUserData, setContactValues, getContactValues, checkValidContact , isValidateAddress: validateContact,allResetAddressContact,validateContacts:validateContacts
  }));


  ///////////// ALL INPUT FUNCTION VALUDATION
  const validateField = (field, errorMessageKey, needErrorFocus) => {
    if (!$AHelper.$isNotNullUndefine(field) || /^\s*$/.test(field)) {
      setErrMsg(prev => ({ ...prev, [errorMessageKey]: $Msg_AddressDetails[errorMessageKey] }));
      if(needErrorFocus) focusInputBox(errorMessageKey?.slice(0, -3))
      return false;
    } else {
      setErrMsg(prev => ({ ...prev, [errorMessageKey]: '' }));
    }
    return true;
  };



  const validateContact = ( callFrom ) => {
    if(callFrom != 'addAnother') {
      const isAnyInputFilled = [city, apt, state, zipcode, addressLine1, ...(!["transportation","professional","activationForm"].includes(props?.refrencePage) ? [addressTypes] : [])].some(val => $AHelper.$isNotNullUndefine(val));
      const dontShowError = props?.isMandotry == false && isAnyInputFilled == false;
      if(dontShowError == true) return false;
    }

 


    if(props?.isMandotry == false && (isValid() == true || callFrom == 'addAnother')){
      let needErrorFocus = true;
      const isValidAddressType = validateField(addressTypes, 'addressTypeErr', needErrorFocus);
      needErrorFocus = needErrorFocus && isValidAddressType;
      const isValidAddressLine1 = validateField(addressLine1, 'addressLine1Err', needErrorFocus);
      needErrorFocus = needErrorFocus && isValidAddressLine1;
      const isValidCountry = validateField(country, 'countryErr', needErrorFocus);
      needErrorFocus = needErrorFocus && isValidCountry;
      const isValidCity = validateField(city, 'cityErr', needErrorFocus);
      needErrorFocus = needErrorFocus && isValidCity;
      const isValidState = validateField(state, 'stateErr', needErrorFocus);
      needErrorFocus = needErrorFocus && isValidState;
      const isValidZipcode = validateField(zipcode, 'zipcodeErr', needErrorFocus);
    return ((!["BusinessIntrests","lenderData","transportation","professional","RealEstate"].includes(props?.refrencePage) ? isValidAddressType : true) && isValidCity && isValidCountry && isValidState && isValidZipcode && isValidAddressLine1);
    }else{
      return true
    }
  };
  const validateContacts = (type) => {
      if (props?.isMandotry == false && (isValidContacts(type) || type == "openModal")) {
      const isValidContactType = validateField(contactTypes, 'contactTypeErr', true);
      const isValidComType = validateField(comeTypes, 'comeTypeErr', isValidContactType);   
      let primaryData = JSON.parse(sessionStorage.getItem("userDetailOfPrimary")).primaryEmailId

      if (!$AHelper?.$isNotNullUndefine(mobileNumber) && !$AHelper?.$isNotNullUndefine(email)) {
        validateField(email, 'emailErr');
        validateField(mobileNumber, 'mobileErr');
        return false;  // Directly return false instead of assigning
      }

      if ($AHelper?.$isNotNullUndefine(mobileNumber) && mobileNumber.length < 10) {
        setErrMsg(prev => ({ ...prev, mobileErr: 'Enter a valid mobile number' }));
        return false;
      }

      if ($AHelper?.$isNotNullUndefine(email)) {
        if (!isValidEmail(email)) {
          setErrMsg(prev => ({ ...prev, emailErr: 'Enter a valid email' }));
          return false;
        }

        if (props?.userId === spouseId && email === primaryData) {
          setErrMsg(prev => ({ ...prev, emailErr: 'Email address already exists' }));
          return false;
        }
      }

      return isValidContactType && isValidComType;
    }else {
      return true
    }

  
  };

  //////////////////////////////////

  const handleClose = () => {
    setShowModal(!showModal)
    seteditIndex(-1)
    if (!["Liabilities", "transportation"].includes(props?.refrencePage)) {
      getApisData(userId, "closeModal")
    }

  }
  const AddressAndContactModal = async (type, modal, userIds) => {

    if ((type == "address" && modal == "checkvalidation") || (type == "contact" && modal == "checkvalidation")) {
      if (type == "address" && validateContact('addAnother')) {
        let isNext = await handleSubmit("openModal", type, "newAddress")
        if(isNext) toasterAlert("successfully", "Successfully saved data",  "Your data have been saved successfully")
        setmodalType(type)
        setShowModal(!showModal)
      }
      else if (type == "contact" && validateContacts("openModal")) {
        let isNext = await submitContact("openModal", type)
        if (isNext) toasterAlert("successfully", "Successfully saved data", "Your data have been saved successfully")
      }

    } else {
      if (props?.refrencePage == "PersonalInformation") {
        setUserId(userIds)
      }

      setmodalType(type)
      setShowModal(!showModal)
      return true
    }


  }


  function getEmailAndMobileWithSameContactTypeId(data) {
    const result = [];
    const matchedMobiles = new Set();  // Track matched mobiles by their contactTypeId

    // Create a map of contactTypeId to email for quick lookup
    const emailMap = new Map();
    data?.emails?.forEach(email => {
      emailMap?.set(email?.contactTypeId, email);
    });

    // Iterate through each mobile
    data?.mobiles?.forEach(mobile => {
      const email = emailMap.get(mobile?.contactTypeId);
      if (email) {
        // If a matching email is found, add both email and mobile to the result array
        result.push({ email, mobile });
        // Remove the email from the map so we don't reuse it
        emailMap.delete(mobile?.contactTypeId);
      } else {
        // If no matching email is found, add the mobile alone to the result array
        result.push({ mobile });
      }
      // Mark this mobile as matched
      matchedMobiles.add(mobile?.contactTypeId);
    });

    // Add any remaining emails that were not matched to any mobile
    emailMap.forEach(email => {
      result.push({ email });
    });

    return result;
  }


   
  const editAddressContact = (data, index, type, userType) => {
    let userNewId = userType == "primary" ? primaryUserIdNew : userType == "Spouse" ? spouseId : userId
    setUserId(userNewId)
    setNatureId(data?.addressId)
    seteditIndex(index)
    setShowModal(true)
    setmodalType(type)
    setEditJsonData(data)


  }

 const isValid =()=>{
  return [city, apt, state, zipcode, addressLine1, ...((!["transportation", "activationForm","Non-Retirement","charityData"].includes(props?.refrencePage)) ? [addressTypes] : [])].some(val => $AHelper.$isNotNullUndefine(val));
 }

  const handleSubmit = async (isModal, type, newAddress,institutionUserId) => {
    
    let addrressData = (["activationForm", "PersonalInformation"].includes(props?.refrencePage)) && activeTab == 1 ? primartAddressData : (["activationForm", "PersonalInformation"].includes(props?.refrencePage)) && activeTab == 2 ? spouseAddressData : addressList
    let loggedInUserId = loggedInUserId ?? sessionStorage.getItem('loggedUserId')
    let isPhysicalAddress = addrressData?.length > 0 ? addrressData?.filter((ele) => ele?.addressTypeId == 1) : []
    if(["Non-Retirement","charityData"].includes(props?.refrencePage) && $AHelper.$isNotNullUndefine(natureId) && !isValid()){
    // if(["Non-Retirement"].includes(props?.refrencePage) && $AHelper.$isNotNullUndefine(natureId) && !isValid()){
  
      deleteAddress(natureId, "index", "address", "",institutionUserId)
      const myObject = {
        "isActive": true,
        "addressId": ''
      };
      return myObject
    }
   
    if (props?.isMandotry == false && isValid() == true) {
      if (validateContact() || props.refrencePage == 'lenderData') {
       
        let apiTYPE;
        let url;
        let addressJosn;
        if (!["BusinessIntrests", "Liabilities", "transportation", "RealEstate"].includes(props?.refrencePage)) {
          let id = props?.userId || userId || institutionUserId
          addressJosn = $JsonHelper.createAddressJson(id,lattitude, longitude, addressLine1, apt, zipcode, county, country, city, state, addressTypes, countyRefId, loggedInUserId)
          if((props?.refrencePage == "Non-Retirement" || props?.refrencePage == "charityData" ) && $AHelper?.$isNotNullUndefine(natureId)){
            apiTYPE = "PUT";
            url = $Service_Url.putupdateAddress;
          }else{
            apiTYPE = "POST";
            url = $Service_Url.postAddAddress;
          }
        

        } else {
          addressJosn = $JsonHelper.createAddressJsonWithoutUserUd(lattitude, longitude, addressLine1, apt, zipcode, county, city, state, country, countyRefId, loggedInUserId, addressTypes, addressTypeLable)
          if ($AHelper?.$isNotNullUndefine(props?.businessInterestAddressId)) {
            apiTYPE = "PUT";
            url = $Service_Url.updateaddressadd;
          } else {
            apiTYPE = "POST";
            url = $Service_Url.postaddressAdd;

          }
        }
        if (apiTYPE === "PUT") {
          if (!["BusinessIntrests", "RealEstate"].includes(props?.refrencePage)) {
            
            const removeCharityAddress = addressJosn?.address
            if(addressJosn?.address?.addressLine1 == ''){
              removeCharityAddress = {...removeCharityAddress,county:''}
            }
            // console.log(removeCharityAddress,"upadateAddressupadateAddress")
            addressJosn.address = {
              ...(removeCharityAddress || {}),
              updatedBy: loggedInUserId,
              addressId: (props?.refrencePage == "Non-Retirement" || props?.refrencePage == "charityData")  ? natureId : props?.editJsonData?.addressId
            };
          } else {
            addressJosn["updatedBy"] = loggedInUserId;
            addressJosn["addressId"] = props?.businessInterestAddressId;
          }

        }



        if (["Liabilities", "transportation", "lenderData"].includes(props?.refrencePage)) {
          setAddressList([{ ...addressList, ...addressJosn }]);

          const addressData = [...addressList]
          if (isModal == "openModal") {
            setmodalType(type)
            setShowModal(!showModal)

          } else {
            if ((props?.refrencePage == 'lenderData') && natureId != '') {
              addressJosn.address = {
                ...(addressJosn.address || {}),
                addressId: natureId
              };
            }
            const myObject = {
              "isActive": true,
              "json": addressData.length > 0 && (!["transportation", "lenderData"].includes(props?.refrencePage)) ? addressData : [addressJosn]
            };
            allResetAddressContact()
            return myObject
          }


        }




        else {
          useLoader(true)
          const _resultGetActivationLink = await postApiCall(apiTYPE, url, addressJosn);
          if(apiTYPE !== "PUT" && !["RealEstate"]?.includes(props?.refrencePage)){            
            allResetAddressContact()
            
          }
          useLoader(false)
          if (_resultGetActivationLink == "err") {
            return false;
          }
          // if (props?.refrencePage !== "BusinessIntrests" && props?.refrencePage !== "professional" && props?.refrencePage !== "activationForm" && props?.refrencePage != 'RealEstate') {
          //   toasterAlert("successfully", "Successfully saved data",  "Your data have been saved successfully")
          // }

          var addressId = _resultGetActivationLink?.data?.data?.addressId
          if (addressTypes == "999999") {
            let addressResponse = _resultGetActivationLink.data?.data?.addresses[0]
            addressRef.current.saveHandleOther(addressResponse.addressId);
          }
      
          if (!["BusinessIntrests", "RealEstate","charityData"].includes(props?.refrencePage)) {  
            getApisData(userId)
            resetAddressFields()
          }

          useLoader(false)
          if ((isPhysicalAddress.length == 1 || addressTypes == 1) || ([true,false].includes(props?.isChild)) || ["BusinessIntrests", "lenderData", "AddFiduciaryBeneficiary", "EditFiduciaryBeneficiary", "RealEstate"].includes(props?.refrencePage)) {
            const myObject = {
              "isActive": true,
              "addressId": addressId
            };
            return myObject
          } else {
            if (isPhysicalAddress.length == 0 && newAddress !== "newAddress" && (props?.type == "Spouse" || props?.type == "Personal")) {
              toasterAlert("warning", "Physical address is mandatory")
            }
            const myObject = {
              "isActive": false,
              "addressId": addressId
            };
            return myObject
          }
        }


      } else {
        const isAnyInputFilled = [city, apt, state, zipcode, addressLine1, ...(!['transportation',"professional","activationForm"].includes(props?.refrencePage) ? [addressTypes] : [])].some(val => $AHelper.$isNotNullUndefine(val));
        if (isAnyInputFilled == true) {
         const myObject = {                             
          "isActive": false,
          "addressId": null
        };
        return myObject
      }
        if (isPhysicalAddress.length == 1 || addressTypes == 1 || ['Liabilities',"AddFiduciaryBeneficiary","EditFiduciaryBeneficiary"].includes(props?.refrencePage)) {
          const myObject = {                                
            "isActive": true,
            "addressId": null
          };
          return myObject
        } else {
          if (isPhysicalAddress.length == 0 && (["PersonalInformation","activationForm"].includes(props?.refrencePage))) {
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
      const addressData = [...addressList]
      const myObject = {
        "isActive": true,
        "addressId": null,
        "json": (["Liabilities",'transportation'].includes(props?.refrencePage)) ? addressData : ""
      };
      return myObject
    }

  }


  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);

  }
  const deleteAddress = async (data, index, type, userType,retirementUserId) => {
    if(["Non-Retirement"].includes(props?.refrencePage)){
      if(type == "address"){
        const deleteApi = await postApiCall('DELETE', `${$Service_Url.deleteAddress + retirementUserId}/${data}/${loggedInUserId}`, '')
        if (deleteApi == "err") {
          return;
        }
        // toasterAlert("deletedSuccessfully", "Address has been deleted successfully")
        useLoader(false)

      }else {
     
          if ($AHelper?.$isNotNullUndefine(data)) {
            const json = {
              userId: retirementUserId,
              contactId : data,
              deletedBy: loggedInUserId,
            };
            useLoader(true);
           const result = await postApiCall('DELETE', $Service_Url.deleteContactPath, json);
            useLoader(false);
            let isActive;
            isActive = result == 'err' ? false : true           
            return isActive
          }
       }
      
    }else{
      if (props?.refrencePage !== "charityData") {
    const confirmRes = await newConfirm(true, `Are you sure you want to delete this ${type == "address" ? "address" : "contact"}? This action cannot be undone.`, "Confirmation", `${type === "address" ? "Delete Address" : "Delete Contact"}`, 2);
    if (!confirmRes) return;
      }
    let userNewId = userType == "primary" ? primaryUserIdNew : userType == "Spouse" ? spouseId : userId
    if (type == "address") {
      useLoader(true)
      if ((["Liabilities","transportation"].includes(props?.refrencePage)) && !$AHelper?.$isNotNullUndefine(data?.addressId)) {
        const filteredAdd = [...addressList]
        const newJosn = filteredAdd?.filter((ele) => ele?.addressTypeId !== data?.addressTypeId)
        setAddressList(newJosn)        
        resetAddressFields()
        useLoader(false)
      } else {

        const deleteApi = await postApiCall('DELETE', `${$Service_Url.deleteAddress + userNewId}/${data?.addressId ?? data}/${loggedInUserId}`, '')
        if (deleteApi == "err") {
          return;
        }
        // setUserData(userId)
        getApisData(userNewId)
        if (props?.refrencePage !== "charityData") {
        toasterAlert("deletedSuccessfully", "Address has been deleted successfully")
        }   
        useLoader(false)
      }
    } else {
      useLoader(true)
      if ((["Liabilities","transportation"].includes(props?.refrencePage)) && (!$AHelper?.$isNotNullUndefine(data?.email?.contactId) && !$AHelper?.$isNotNullUndefine(data?.mobile?.contactId))) {
        const filteredAdd = { ...contactData }
        const newData = filteredAdd?.contact?.emails.filter((ele) => ele?.contactTypeId !== data?.email?.contactTypeId)
        const newData2 = filteredAdd?.contact?.mobiles.filter((ele) => ele?.contactTypeId !== data?.mobile?.contactTypeId)
        setContactData(prevContactData => {
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
        if ($AHelper?.$isNotNullUndefine(data?.email?.contactId)) {
          const deleteApi = await postApiCall('DELETE', $Service_Url.deleteContactPath, json)
          useLoader(false)
        }
        if ($AHelper?.$isNotNullUndefine(data?.mobile?.contactId)) {
          const deleteApi2 = await postApiCall('DELETE', $Service_Url.deleteContactPath, json2)
          useLoader(false)
        }
        toasterAlert("deletedSuccessfully", "Contact has been deleted successfully")
        // setUserData(userId)
        getApisData(userNewId)
        return true
       
      }
    }
  }

  }



  const deleteContactSeprate =async(data)=>{
    const json = {
      "userId": userId,
      "contactId": data[0]?.contactId,
      "deletedBy": userId
    }
    let result = true
    if (data.length > 0 &&  $AHelper?.$isNotNullUndefine(data[0].contactId)) {

      const deleteApi2 = await postApiCall('DELETE', $Service_Url.deleteContactPath,json)
      useLoader(false)
      result = deleteApi2 != 'err'
    }else{
       return true
    }
    if (props?.refrencePage !== "charityData") {
    toasterAlert("deletedSuccessfully", "Contact has been deleted successfully");
   }
    getApisData(userId)
     return result
  
   }

  /////////////// functions for call get api condtionaly////////////////////////
  const getApisData = (userID, type) => {
    if (props?.refrencePage !== "PersonalInformation") {
      setUserData(userID)
    } else {
      if (type == "closeModal" && props?.refrencePage == "PersonalInformation") {
        setUserData(primaryUserIdNew, setPrimartAddressData, setPrimaryContactData)
        isPrimaryMemberMaritalStatus == true && setUserData(spouseId, setSpouseAddressData, setSpouseContactData)
      } else if (userID == primaryUserIdNew) {
        setUserData(userID, setPrimartAddressData, setPrimaryContactData)
      } else {
        isPrimaryMemberMaritalStatus == true && setUserData(userID, setSpouseAddressData, setSpouseContactData)
      }
    }
  }
  const radioValuesOcc = [{ label: "Yes", value: true }, { label: "No", value: false }];

  const handleRadioOcc = async (e, key) => {
    const isCheckedValue = props?.refrencePage == "PersonalInformation" ? e.target.checked : e.value
     
    useLoader(true)
    let userData = props?.dataInfo?.memberRelationship;
    let userIds = (props?.type == "ADD-EXTENDED-FAMILY" || ([1,44,47,48,49,50].includes(userData?.relationshipTypeId)  &&  userData?.relativeUserId !== userData?.primaryUserId) || (userData?.relationshipType == "Grand-Child")  )  ? userData?.relativeUserId : primaryUserIdNew
    const primaryAddressDetailsData = await userAddressDataById(userIds)
    const primaryAddressDetails = primaryAddressDetailsData?.addresses?.filter((ele) => { return ele?.addressTypeId == 1 })
    let spouseUserID = props?.refrencePage == "PersonalInformation" ? spouseId : userId
    useLoader(false)
    const _resultOf = await userAddressDataById(spouseUserID)
    if (props?.refrencePage == "PersonalInformation") {
      setSpouseAddressData(_resultOf?.addresses)
    } else {
      setAddressList(_resultOf?.addresses)
    }

    const spouseAddressDetails = _resultOf?.addresses?.filter((ele) => { return ele?.addressTypeId == 1 })

    if (spouseAddressDetails?.length > 0 && isCheckedValue == true) {
      toasterAlert(
        "warning", 
        `${["Child","Grand-Child","Son"].includes(userData?.relationshipType) ? userData?.relationshipType : 
        ([1, 44, 47, 48, 49, 50].includes(userData?.relationshipTypeId) && userData?.relativeUserId !== userData?.primaryUserId) ? "In-law" : lableName
        } has a physical address. Please delete the current physical address first, then make the selection.`
      );
      
      // toasterAlert("warning", `${[userData?.relationshipType].includes("Child","Grand-Child") == true ? userData?.relationshipType : ([1,44,47,48,49,50].includes(userData?.relationshipTypeId)  &&  userData?.relativeUserId !== userData?.primaryUserId) ? "In-law" : lableName} have a physical address please delete the current physical address first then make the selection.`)
      useLoader(false)
      return;
    }
    if (spouseAddressDetails?.length == 0 && isCheckedValue == false) {
      
      // toasterAlert("warning", `${props?.isChild == true ? "Child" : lableName} have not physical address`)
      useLoader(false)
      return;
    }
    if ((primaryAddressDetails?.length == 0 || !$AHelper?.$isNotNullUndefine(primaryAddressDetails)) && isCheckedValue == true) {
    
      toasterAlert("warning", `${props?.type == "ADD-EXTENDED-FAMILY" ? "Relative member" : ([1,44,47,48,49,50].includes(userData?.relationshipTypeId)  &&  userData?.relativeUserId !== userData?.primaryUserId) || (userData?.relationshipType == "Grand-Child") ? "Child" :"Primary member"} does not have a physical address`)
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
    if (props?.refrencePage == "PersonalInformation") {
      dispatch(updateIsSpouseAddress(isCheckedValue))
    }
    resetAddressFields()
    useLoader(false)
    let id = props?.refrencePage == "PersonalInformation" ? spouseId : props?.userId
    getApisData(id)

    if (_resultGetActivationLink == "err") {
      return;
    }

  };


  const userAddressDataById = (userID) => {
    return new Promise(async (resolve, reject) => {
      if ($AHelper?.$isNotNullUndefine(userID)) {
        const _resultOf = await getApiCall('GET', $Service_Url.getAllAddress + userID, '')
        resolve(_resultOf)
      } else {
        resolve('err')
      }

    })

  }

  //////FILTERED CONTACTTYPE DROPDOWN VALUES
  const filteredContactTypes = (data, value) => {
    if ($AHelper?.$isNotNullUndefine(props?.editJsonData)) {
      let addedList = props?.userContact?.contact?.mobiles.length > props?.userContact?.contact?.emails.length ? props?.userContact?.contact.mobiles : props?.userContact?.contact?.emails
      let filtered = data?.filter((ele) => ele.value != value ? (!addedList?.some((e) => e.contactTypeId == ele.value)) : addedList?.some((e) => e.contactTypeId == ele.value))
      if (props?.refrencePage == "Liabilities") {
        let newJson = filtered?.filter((ele) => ele?.value !== "999999")
        return newJson
      } else {
        return filtered
      }
    } else {
      let addedList = props?.userContact?.contact?.mobiles.length > props?.userContact?.contact?.emails?.length ? props?.userContact?.contact?.mobiles : props?.userContact?.contact?.emails
      let filtered = data?.filter((ele) => !addedList?.some((e) => e.contactTypeId == ele.value))
      if (props?.refrencePage == "Liabilities") {
        let newJson = filtered?.filter((ele) => ele?.value !== "999999")
        return newJson
      } else {
        return filtered
      }


    }


  }
  const isValidContacts =(type)=>{
    return [ (!["Non-Retirement","charityData"].includes(props.refrencePage)) && type == "acept" ? contactTypes : "", email, mobileNumber].some(val => $AHelper.$isNotNullUndefine(val));

  }
  /////  function fro contact save
  const submitContact = async (isModal, type,institutionUserId) => {
    let mobileOther = null
    let emailOther = null
    let loggedInUserId = loggedInUserId ?? sessionStorage.getItem('loggedUserId')
    if(["Non-Retirement"].includes(props?.refrencePage) && $AHelper?.$isNotNullUndefine(contactData) && contactData?.contact){
      const { emails: contactDataEmail, mobiles: contactDataMobile } = contactData?.contact || {};         
        if(contactDataEmail?.length > 0 && !$AHelper.$isNotNullUndefine(email)){
        deleteAddress(contactDataEmail[0].contactId, "index", "contact", "",institutionUserId)
    
        }
        if(contactDataMobile?.length > 0 && !$AHelper.$isNotNullUndefine(mobileNumber)){
         deleteAddress(contactDataMobile[0].contactId, "index", "contact", "",institutionUserId)
         
        }
      
     

    }


    if(["charityData"]?.includes(props?.refrencePage) && $AHelper?.$isNotNullUndefine(contactData) && (contactData?.contact?.mobiles.length > 0 || contactData?.contact?.emails.length > 0)){
     
      if(!isNotValidNullUndefile(email)){
       await deleteContactSeprate(contactData?.contact?.emails)
      }
      if(!isNotValidNullUndefile(mobileNumber)){
       await deleteContactSeprate(contactData?.contact?.mobiles)
      } 
      
    }

  
    if ((["PersonalInformation","activationForm"].includes(props?.refrencePage)) || (props?.isMandotry == false && isValidContacts("") == true)) {
 
      if (validateContacts("acept")) {
        if (contactTypes == "999999") {
          mobileOther = {
            othersName: otherContact,
            othersCategoryId: 6,
            isActive: true,
            othersId: $AHelper?.$isNotNullUndefine(props?.editJsonData) ? props?.editJsonData?.mobile?.mobileOther?.othersId : "",
            [$AHelper?.$isNotNullUndefine(props?.editJsonData) ? "updatedBy" : "createdBy"]: loggedInUserId

          }
          emailOther = {
            othersName: otherContact,
            othersCategoryId: 6,
            isActive: true,
            othersId: $AHelper?.$isNotNullUndefine(props?.editJsonData) ? props?.editJsonData?.email?.emailOther?.othersId : "",
            [$AHelper?.$isNotNullUndefine(props?.editJsonData) ? "updatedBy" : "createdBy"]: loggedInUserId

          }

        };
        let updateJsonData = {
          "userId":  ["Non-Retirement"].includes(props?.refrencePage) ? institutionUserId : userId,
          "activityTypeId": "4",
          "contact": {}
        }
        if (['lenderData','activationForm'].includes(props?.refrencePage)) {
           //////// update json
           updateJsonData.contact.mobiles = (!$AHelper?.$isNotNullUndefine(mobileNumber)) ? []
           : [createMobileData(mobileNumber, contactTypes, countryCode, loggedInUserId, mobileOther, comeTypes, contactTypeLabel)];
           updateJsonData.contact.emails = (!$AHelper?.$isNotNullUndefine(email)) ? []
           : [createEmailData(email, contactTypes, loggedInUserId, emailOther, contactTypeLabel)];
           ////////////////////
          return updateJsonData
        }
        let apiType = "POST"
        if (["Liabilities","transportation"].includes(props?.refrencePage)) {
           updateJsonData.contact.mobiles = (!$AHelper?.$isNotNullUndefine(mobileNumber)) ? []
           : [createMobileData(mobileNumber, contactTypes, countryCode, loggedInUserId, mobileOther, comeTypes, contactTypeLabel)];
           updateJsonData.contact.emails = (!$AHelper?.$isNotNullUndefine(email)) ? []
           : [createEmailData(email, contactTypes, loggedInUserId, emailOther, contactTypeLabel)];

          if (!$AHelper?.$isNotNullUndefine(contactData) || contactData.length == 0) {
            
            setContactData(updateJsonData)
          } else {
            setContactData(prev => ({
              ...prev,
              contact: {
                ...prev?.contact,
                ...updateJsonData?.contact
              }
            }));
          }

          if (isModal == "openModal") {
            setmodalType(type)
            setShowModal(!showModal)
          } else {
            const contactDatas = { ...contactData }
            const myObject = {
              "isActive": true,
              "json": contactDatas?.contact?.emails.length > 0 || contactDatas?.contact?.mobiles.length > 0 ? contactDatas : updateJsonData
            };
            return myObject

          }


        }
      
        else if(["Non-Retirement","charityData"].includes(props?.refrencePage) && $AHelper?.$isNotNullUndefine(contactData) && (contactData.length !== 0)){
             const contactDataEmail = contactData?.contact?.emails
             const contactDataMobile = contactData?.contact?.mobiles   
             const { number, countrycode } = separateCountryCodeAndNumberCharity(contactDataMobile?.[0]?.mobileNo) ?? {}; 

            if(contactDataEmail?.length == 0 || contactDataMobile?.length == 0){   
              updateJsonData.contact.mobiles = ((!$AHelper?.$isNotNullUndefine(mobileNumber)) || (contactDataMobile.length > 0)) ? []
                : [createMobileData(mobileNumber, props?.refrencePage == 'charityData' ? 1 : contactTypes, countryCode, loggedInUserId, mobileOther, comeTypes, contactTypeLabel)];
              updateJsonData.contact.emails = ((!$AHelper?.$isNotNullUndefine(email)) || (contactDataEmail.length > 0)) ? []
                : [createEmailData(email, props?.refrencePage == 'charityData' ? 1 : contactTypes, loggedInUserId, emailOther, contactTypeLabel)];
                if((updateJsonData.contact?.mobiles.length > 0) || (updateJsonData.contact?.emails?.length > 0)){
           
                  useLoader(true)
                  let url = $Service_Url?.postAddContactWithOther
                  const result_ = await addUpdateEmailMobile(apiType, url, updateJsonData)
                  let isActive;
                  isActive = result_ == 'err' ? false : true
                   const myObject = {
                    isActive,
                  };
                  useLoader(false)
                  return myObject
                 
                }
           

            }

            if((contactDataEmail?.length > 0 && contactDataEmail[0].emailId !== email) || (contactDataMobile?.length > 0 && (number != mobileNumber || countryCode != countrycode))){  
                  updateJsonData.contact.mobiles = ((contactDataMobile.length == 0) || (number == mobileNumber && countryCode == countrycode) || (!$AHelper?.$isNotNullUndefine(mobileNumber))) ? []          
                   : [{ ...createMobileData(mobileNumber, props?.refrencePage == 'charityData' ? 1 : contactTypes, countryCode, loggedInUserId, mobileOther, comeTypes, contactTypeLabel),
                  contactId : contactDataMobile[0]?.contactId,UpdatedBy : props?.refrencePage == 'charityData' ? props?.userId : institutionUserId}
                  ];
                            
               
                  updateJsonData.contact.emails = ((contactDataEmail.length == 0 ) || (contactDataEmail[0].emailId == email )|| (!$AHelper?.$isNotNullUndefine(email))) ? []
                  : [{...createEmailData(email, props?.refrencePage == 'charityData' ? 1 : contactTypes, loggedInUserId, emailOther, contactTypeLabel),
                    contactId: contactDataEmail[0]?.contactId,UpdatedBy:  props?.refrencePage == 'charityData' ? props?.userId : institutionUserId}
                    ];  
                 let url = $Service_Url?.updateContactWithOtherDetailsPath
                 if((updateJsonData?.contact?.mobiles?.length > 0 )|| (updateJsonData?.contact?.emails?.length > 0)){
                  useLoader(true)
                  const result_ = await addUpdateEmailMobile("PUT", url, updateJsonData)
                  let isActive;
                  isActive = result_ == 'err' ? false : true
                   const myObject = {
                    isActive,
                  };
                  useLoader(false)
                  return myObject
                 }
               
            
            }  
            const myObject = {
              "isActive": true,
              "json":  ""
            };
            return myObject
        }

        
        else {
          useLoader(true)
          //////// update json
          updateJsonData.contact.mobiles = (!$AHelper?.$isNotNullUndefine(mobileNumber)) ? []
          : [createMobileData(mobileNumber, contactTypes, countryCode, loggedInUserId, mobileOther, comeTypes, contactTypeLabel)];
          updateJsonData.contact.emails = (!$AHelper?.$isNotNullUndefine(email)) ? []
          : [createEmailData(email, contactTypes, loggedInUserId, emailOther, contactTypeLabel)];
            ////////////////////

          let url = $Service_Url?.postAddContactWithOther
          if(updateJsonData.contact?.mobiles.length > 0 || updateJsonData.contact?.emails?.length > 0){
            const result_ = await addUpdateEmailMobile(apiType, url, updateJsonData)   
            let isActive;      
            isActive = result_ == "err" ? false : true
            const myObject = {
              isActive,
              "json": ""
            };
            if(props?.refrencePage == "professional") {
              const resp = await dispatch(fetchUserContactData(userId));
              setContactData(resp.payload);
            }
            useLoader(false)
            return myObject
          }
         
          useLoader(false)
          getApisData(userId)
          if (isModal == "openModal") {
            setmodalType(type)
            setShowModal(!showModal)
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
          "isActive": props?.refrencePage == "PersonalInformation" ? true : false,
          "json": ""
        };
        return myObject
      }
    } else {
      const contactDatas = { ...contactData }
      const myObject = {
        "isActive": true,
        "json": ["Liabilities","transportation",'lenderData'].includes(props?.refrencePage) ? contactDatas : ""
      };
      return myObject
    }

  }




  // Function to create a mobile JSON object
function createMobileData(mobileNumber, contactTypes, countryCode, loggedInUserId, mobileOther, comeTypes, contactTypeLabel) {
  return {
    contactTypeId: contactTypes,
    mobileNo: countryCode + mobileNumber,
    createdBy: loggedInUserId,
    mobileOther: mobileOther,
    commTypeId: comeTypes,
    contactType: contactTypeLabel
  };
}
// Function to create an email JSON object
function createEmailData(email, contactTypes, loggedInUserId, emailOther, contactTypeLabel) {
  return {
    contactTypeId: contactTypes,
    createdBy: loggedInUserId,
    emailId: email,
    emailOther: emailOther,
    contactType: contactTypeLabel
  };
}





  const addUpdateEmailMobile = (apiType, url, updateJson)=>{
    return new Promise(async(resolve, reject) => {
      const _resultGetActivationLink = await postApiCall(apiType, url, updateJson);
      setComeTypes('1')
      setContactTypes('')
      setEmail('')
      setMobileNumber('')
      resolve(_resultGetActivationLink)
  })
  

  }

  const labelOfisSameAs = useMemo(() => {
    let userData = props?.dataInfo?.memberRelationship;
    let relationId = userData?.relationshipTypeId;
    const showMemberName = relationTypeList.find((ele) => ele?.value == relationId)?.label.toLowerCase();

    const metrialStatus = props?.dataInfo?.maritalStatusId
    const isRelations = isPrimaryMemberMaritalStatus == true && props?.refrencePage == 'PersonalInformation'
    let relationForPersonal = isRelations && metrialStatus == 1 ? "spouse" : isRelations && metrialStatus == 2 ? "partner" : showMemberName

    
    let checkForGrandChild = (props?.refrencePage !== 'PersonalInformation' && userData?.relationshipTypeId == 3)
    let realtion1 = ([44,47,48,49,50]?.includes(relationId)) || props?.isChildSpouse == true ? (`Does this ${lableName} live with your Child?`) :
     (["PersonalInformation","EditFiduciaryBeneficiary"].includes(props?.refrencePage)) ? (`Does your ${relationForPersonal} live with ${checkForGrandChild ? "your child" : "you"}?`) : (`Does ${checkForGrandChild == true ? "this" : "your"} ${checkForGrandChild == true ? 'grand-child' : props?.isChild == true  ? showMemberName : 'as'} live with ${checkForGrandChild == true ? "your child" : "you"}?`);
    
    return realtion1    
  }, [props?.refrencePage, props?.type, props?.dataInfo,relationTypeList])

  const deleteAddressData = (type,userid) => {
    if (type === "Physical") {
      if(userid === primaryUserIdNew || isChecked){
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
    const isSpousePage = ["PersonalInformation","EditFiduciaryBeneficiary"].includes(props?.refrencePage);
    const userID = isSpousePage && userType === "spouse" ? spouseId : props?.userId;  
    if (userID === primaryUserIdNew && isChecked) return true;
    if (isChecked) return false;
  
    return true;
  };

  const isUserAtLeast16YearsOld = (dobString) => {
    const ds = new Date(dobString)
    // Parse the date of birth string into a Date object
    const dob = new Date(ds);

    // Calculate the current date
    const currentDate = new Date();

    // Calculate the date 16 years ago from the current date
    const minAgeDate = new Date(currentDate.getFullYear() - 14, currentDate.getMonth(), currentDate.getDate());

    // Compare the date of birth against the date 16 years ago
    return dob <= minAgeDate;
  };
  const findSpouseEmail = () => {
    return getEmailAndMobileWithSameContactTypeId(spouseContactData?.contact)
      .map((ele) => ele.email)
      .filter((ele1) => ele1?.contactTypeId === 1)[0]?.emailId;
  };
  const filterAddressType = (addressType) => {
    if (props?.refrencePage == "Liabilities") {
      let newJson = addressType?.filter((ele) => ele?.value !== "999999")
      return newJson
    } else {
      return addressType
    }

  }
  const setMandatory = (name) => {
    const isValid = [city, apt, state, zipcode, addressLine1, ...(!['transportation',"professional","activationForm","Non-Retirement", "charityData"]?.includes(props?.refrencePage) ? [addressTypes] : [])].some(val => $AHelper.$isNotNullUndefine(val));
    if (props?.isMandotry == true || isValid == true) {
      return `${name}*`
    } else {
      return name
    }

  }
  const showSameAs = (refrencePage) => {
    let userData = props?.dataInfo?.memberRelationship;
    let relationId = userData?.relationshipTypeId
    if ((["EditFiduciaryBeneficiary", "EditChildWithAccordian", "AddChildWithProgressBar", "PersonalInformation"].includes(refrencePage))
      && (props?.spouseUserId == spouseId || props?.userId === spouseId || relationId == 3 || (userData?.primaryUserId !== userData?.relativeUserId && [1,44,47,48,49,50].includes(relationId))) || ((relationId == 5 || relationId == 2 || relationId == 6 || relationId == 28 || relationId == 29 || relationId == 41) && ($AHelper.$isNotNullUndefine(props?.dataInfo?.dob)) && (isUserAtLeast16YearsOld(props?.dataInfo?.dob)))
      || (props?.type === "ADD-EXTENDED-FAMILY" && userData?.primaryUserId !== userData?.relativeUserId && [1,44,47,48,49,50].includes(relationId))
   ) {
     return true;
   } else {
      return false
    }
  }
  function sortData(data) {
    return data.sort((a, b) => (a.email?.contactTypeId || a.mobile?.contactTypeId) - (b.email?.contactTypeId || b.mobile?.contactTypeId));
  }
  const contactDataArray = getEmailAndMobileWithSameContactTypeId(contactData?.contact);
  const sortedData = sortData(contactDataArray);

  const filterContactData = (data) => {
    const contactDataArray = getEmailAndMobileWithSameContactTypeId(data?.contact)
    return sortData(contactDataArray)
  }

  // Sample sorting function
  function sortAddressList(data) {
    return [...data].sort((a, b) => (a.addressTypeId) - (b.addressTypeId));

  }
  const filterAddressData = (data) => {
    return data.length > 0 ? sortAddressList(data) : []
  }
  // const sortedAddressList = primartAddressData.length > 0 ? sortAddressList(primartAddressData) : [];
  ////////////////////////////////
  const [activeTab, setActiveTab] = useState(1);

  const isShowingDescription = (!addressList?.length) && (props?.isShowingDescription || props?.isSideContent?.length);

  const needToShowAddressType = (!["BusinessIntrests","professional",'lenderData',"transportation",'RealEstate',"Non-Retirement","charityData"].includes(props?.refrencePage) ) ? true : false;


  // const colLgSize = props?.refrencePage === 'professional' && props?.refrencePageDsc === 'Professional Contact & Address Information' ? 3 :
  //   props?.refrencePage === 'lenderData' ? 12 : props?.refrencePage === 'transportation' ? 6 : (props?.refrencePage === 'EditChildWithAccordian' ||
  //     props?.refrencePage === 'BusinessIntrests' || (props?.refrencePage === 'AddChildWithProgressBar' || props?.refrencePage === 'EditChildWithAccordian' ||
  //       props?.refrencePage === 'professional' || props?.refrencePage === 'Liabilities' || props?.refrencePage === 'AddFiduciaryBeneficiary' || props?.refrencePage === 'EditFiduciaryBeneficiary') && isShowingDescription) ? 5 : 4

  const colLgSize =  props?.refrencePage === 'professional' && props?.refrencePageDsc === 'Professional Contact & Address Information' ? 3 :
  (props?.refrencePage === 'lenderData' || props?.refrencePage == 'charityData' )? 12 :
  props?.refrencePage === 'transportation' ? 6 :
  (["EditChildWithAccordian", "BusinessIntrests", "AddChildWithProgressBar", "Liabilities", "AddFiduciaryBeneficiary", "EditFiduciaryBeneficiary"].includes(props?.refrencePage) || props?.refrencePage === 'professional') && isShowingDescription ? 5 : 4;


  const AddressCSS = {
    color: "#720C20", borderRadius: "91.17px", padding: "9.12px 0px 9.12px 0px", fontWeight: "600", fontSize: "14px"
  }

  const AddressCSS1 = {
    color: "#720C20", borderRadius: "91.17px", padding: "9.12px 0px 9.12px 0px", fontWeight: "600", marginTop: "0.3rem", width: "170.34px", fontSize: "14px"
  }

  const isactivationScreen = props?.refrencePage == 'activationForm'


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

const Professionalabel = ['professional','Non-Retirement',"BusinessIntrests","Liabilities"].includes(props?.refrencePage) ? "Suite" : "Apt/Suite/Unit/Building/Floor etc."

  return (
    <>
      <Row id='contactDetails'>
        {props?.isSideContent && (
             props?.refrencePage == "PersonalInformation" ? "" : (
          <Col xs={12} md={12} xl={3}>
     { props?.refrencePage == "PersonalInformation" ? <h3 className='main_Heading'>Contact & Address Information</h3> :""}
      <div className="heading-of-sub-side-links-3">{props?.isSideContent}</div>
          </Col>))
        }
        {props?.refrencePage == "PersonalInformation" ?
          <>

            <Col xs={12} sm={12} md={12} xl={12} style={{ marginTop: "0px" }}
            //  className='showScroll'
             >
              <div style={{ width: "33%", marginTop: "1rem" }} >
                {((showSameAs(props?.refrencePage) || isChecked == true) && activeTab == 1 && isPrimaryMemberMaritalStatus == true) &&
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
                        {primartAddressData?.length > 0 ? (
                          <tbody className=''>
                            {filterAddressData(primartAddressData)?.map((element, index) => {
                              return (                                
                                <tr key={index}>
                                  <td className='' style={{ width: "33%" }}>
                                    <div className='mt-2' style={AddressCSS}>
                                      <div className='d-flex'>
                                        <div>
                                          <img className='icon cursor-pointer mt-0 me-2' src='/icons/Address.svg' alt="Address icon" />
                                        </div>
                                        <div>
                                          {`${primaryMemberFirstName}'s `}                                    
                                           <OtherInfo
                                            key={index}
                                            othersCategoryId={2}
                                            othersMapNatureId={element?.addressId}
                                            FieldName={element?.addressType}
                                            userId={props?.primaryUserId}
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
                                      
                                      {deleteAddressData(element?.addressType,props?.primaryUserId) &&
                                        <CustomIconTooltip msg={'Delete'}>
                                          <img className='icon cursor-pointer focusAddressImg' tabIndex={startingTabIndex + 2 + index + 2}
                                          onClick={() => deleteAddress(element, index, "address", "primary")} src='/icons/DeleteButton.svg' 
                                          onKeyDown={(event) => handleKeyDownPrimary(event, "delete", element, index, null)} />
                                        </CustomIconTooltip>
                                      }
                                      {((primartAddressData?.length > 0 && index === filterAddressData(primartAddressData).length - 1))
                                        ?
                                        <CustomIconTooltip msg={`Click to add more Address for ${primaryMemberFirstName} `}>
                                          <img tabIndex={startingTabIndex + 2 + index + 2} className='icon cursor-pointer focusAddressImg'
                                           onClick={() => AddressAndContactModal("address", "", props?.primaryUserId)} src='/icons/Contact&address.svg'
                                           onKeyDown={(event) => handleKeyDownPrimary(event, "add", null, null, props?.primaryUserId)}/>
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
                                  onClick={() => AddressAndContactModal("address", "", props?.primaryUserId)} src='/icons/Contact&address.svg' 
                                  onKeyDown={(event) => handleKeyDownPrimary(event, "add", null, null, props?.primaryUserId)} />
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
                          {spouseAddressData?.length > 0 ? (
                            <tbody className=''>
                              {filterAddressData(spouseAddressData)?.map((element, index) => {
                                return (
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
                                            userId={props?.spouseUserId}
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
                                            <img className='icon cursor-pointer focusAddressImg' tabIndex={startingTabIndex + 3 + ((primartAddressData?.length || 0) * 2)  + 1 + index} 
                                            onClick={() => editAddressContact(element, index, "address", "Spouse")} src='/icons/EditButton.svg'
                                            onKeyDown={(event) => handleKeyDownSpouse(event, "edit", element, index, null)}/>
                                          </CustomIconTooltip>
                                        }
                                        {deleteAddressData(element?.addressType,props?.spouseUserId) &&
                                          <CustomIconTooltip msg={'Delete'}>
                                            <img className='icon cursor-pointer focusAddressImg' tabIndex={startingTabIndex + 3 + ((primartAddressData?.length || 0) * 2) + 2 + index} 
                                            onClick={() => deleteAddress(element, index, "address", "Spouse")} src='/icons/DeleteButton.svg'
                                            onKeyDown={(event) => handleKeyDownSpouse(event, "delete", element, index, null)}/>
                                          </CustomIconTooltip>
                                        }
                                        {((spouseAddressData?.length > 0 && index === filterAddressData(spouseAddressData).length - 1)
                                        )
                                          ?
                                          <CustomIconTooltip msg={`Click to add more Address for ${spouseFirstName}`}>
                                            <img className='icon cursor-pointer focusAddressImg ' tabIndex={startingTabIndex + 3 + ((primartAddressData?.length || 0) * 2) + 2 + index} 
                                            onClick={() => AddressAndContactModal("address", "", props?.spouseUserId)} src='/icons/Contact&address.svg'
                                            onKeyDown={(event) => handleKeyDownSpouse(event, "add", null, null, props?.spouseUserId)}/>
                                          </CustomIconTooltip>
                                          : <div></div>}
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
                                  <img tabIndex={startingTabIndex + 3 + ((primartAddressData?.length || 0) * 2) } className='icon cursor-pointer focusAddressImg me-2' 
                                   onClick={() => AddressAndContactModal("address", "", props?.spouseUserId)} src='/icons/Contact&address.svg'
                                   onKeyDown={(event) => handleKeyDownSpouse(event, "add", null, null, props?.spouseUserId)} />

                                  </Col>
                                  <Col md={7} xl={7} className="d-flex justify-content-start mt-auto mb-auto">
                                  Add {spouseFirstName}'s address
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
                        {getEmailAndMobileWithSameContactTypeId(primaryContactData?.contact)?.length > 0 ? (
                          <tbody className=''>
                            {filterContactData(primaryContactData)?.map((element, index) => {
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
                                        <img className='icon cursor-pointer focusAddressImg me-1' tabIndex={startingTabIndex + 4 + (((primartAddressData?.length || 0) + (spouseAddressData?.length || 0)) * 2) + index + 1}
                                         onClick={() => editAddressContact(element, index, "contact", "primary")} src='/icons/EditButton.svg'
                                         onKeyDown={(event) => handleKeyDownContactPrimary(event, "edit", element, index, null, null, null)}/>
                                      </CustomIconTooltip>
                                      {element?.emails?.contactTypeId == 1 || element?.mobile?.contactTypeId == 1 && !isDeleteContact ? <></> :
                                        <CustomIconTooltip msg={"Delete"}>
                                          <img className='icon cursor-pointer focusAddressImg' tabIndex={startingTabIndex + 4 + (((primartAddressData?.length || 0) + (spouseAddressData?.length || 0)) * 2) + index + 2}
                                           onClick={() => deleteAddress(element, index, "contact", "primary")} src='/icons/DeleteButton.svg'
                                           onKeyDown={(event) => handleKeyDownContactPrimary(event, "delete", element, index, null, null, null)}/>
                                        </CustomIconTooltip>
                                      }

                                      {((getEmailAndMobileWithSameContactTypeId(primaryContactData?.contact)?.length > 0 && index === filterContactData(primaryContactData).length - 1)) ?
                                        <CustomIconTooltip msg={`Click to add more contact for ${primaryMemberFirstName}`}>
                                          <img className='icon cursor-pointer focusAddressImg' tabIndex={startingTabIndex + 4 + (((primartAddressData?.length || 0) + (spouseAddressData?.length || 0)) * 2) + index + 2}
                                           onClick={() => AddressAndContactModal("contact", "", props?.primaryUserId)} src='/icons/Contact&address.svg' 
                                           onKeyDown={(event) => handleKeyDownContactPrimary(event, "add", null, null, props?.primaryUserId, isModalOpen, setIsModalOpen)} />
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
                                  <img className='icon cursor-pointer focusAddressImg me-2' tabIndex={startingTabIndex + 4 + (((primartAddressData?.length || 0) + (spouseAddressData?.length || 0)) * 2)} 
                                   onClick={() => AddressAndContactModal("contact", "", props?.primaryUserId)} src='/icons/Contact&address.svg'
                                   onKeyDown={(event) => handleKeyDownContactPrimary(event, "toggleModal", null, null, props?.primaryUserId, isModalOpen, setIsModalOpen)}/>
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
                          {getEmailAndMobileWithSameContactTypeId(spouseContactData?.contact)?.length > 0 ? (
                            <tbody className=''>
                              {filterContactData(spouseContactData)?.map((element, index) => {
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
                                          <img className='icon cursor-pointer focusAddressImg me-1' tabIndex={startingTabIndex + 5 + (((primartAddressData?.length || 0) + (spouseAddressData?.length || 0) + (filterContactData(primaryContactData)?.length || 0)) * 2) + index + 1}
                                           onClick={() => editAddressContact(element, index, "contact", "Spouse")} src='/icons/EditButton.svg'
                                           onKeyDown={(event) => handleKeyDownContactSpouse(event, "edit", element, index, null, null, null)} />
                                        </CustomIconTooltip>
                                        {element?.emails?.contactTypeId == 1 || element?.mobile?.contactTypeId == 1 && !isDeleteContact ? <></> :
                                          <CustomIconTooltip msg={"Delete"}>
                                            <img className='icon cursor-pointer focusAddressImg ' tabIndex={startingTabIndex + 5 + (((primartAddressData?.length || 0) + (spouseAddressData?.length || 0) + (filterContactData(primaryContactData)?.length || 0)) * 2) + index + 2}
                                             onClick={() => deleteAddress(element, index, "contact", "Spouse")} src='/icons/DeleteButton.svg'
                                             onKeyDown={(event) => handleKeyDownContactSpouse(event, "delete", element, index, null, null, null)} />
                                          </CustomIconTooltip>
                                        }

                                        {((getEmailAndMobileWithSameContactTypeId(spouseContactData?.contact)?.length > 0 && index === filterContactData(spouseContactData).length - 1)) ?
                                          <CustomIconTooltip msg={`Click to add more contact for ${spouseFirstName}`}>
                                            <img className='icon cursor-pointer focusAddressImg' tabIndex={startingTabIndex + 5 + (((primartAddressData?.length || 0) + (spouseAddressData?.length || 0) + (filterContactData(primaryContactData)?.length || 0)) * 2) + index + 2}
                                             onClick={() => AddressAndContactModal("contact", "", props?.spouseUserId)} src='/icons/Contact&address.svg'
                                             onKeyDown={(event) => handleKeyDownContactSpouse(event, "add", null, null, props?.spouseUserId, isModalOpen, setIsModalOpen)} />
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
                                  <img className='icon cursor-pointer focusAddressImg me-2' tabIndex={startingTabIndex + 5 + (((primartAddressData?.length || 0) + (spouseAddressData?.length || 0) + (filterContactData(primaryContactData)?.length || 0)) * 2)}
                                   onClick={() => AddressAndContactModal("contact", "", props?.spouseUserId)} src='/icons/Contact&address.svg'
                                   onKeyDown={(event) => handleKeyDownContactSpouse(event, "toggleModal", null, null, props?.spouseUserId, isModalOpen, setIsModalOpen)} />
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
              {(props?.refrencePage == 'PersonalInformation' && props?.showInvite != true && $AHelper.$isMarried(primaryDetails?.maritalStatusId) && ((spousePartenrEmailVerified == true && checkRoleWithVerifiedMail == false) || !spousePartenrEmailVerified) &&
                <Row className='mt-3'>
                  <InviteSpouse emailAddress={findSpouseEmail() || ""} spouseEmailActiveData={spouseEmailActiveData} />
                </Row>
              )}
              {/* @@ Invite Spouse */}
            </Col>
          </>




          :
          <>
            <Col xs={12} xl={props?.isSideContent ? 9 : 12} md={12} style={{ marginTop: "0px" }}>

              {props?.showType == "address" || props?.showType == "both" ?

                <>
                  {(addressList?.length == 0 || props?.showOnlyForm == true || props?.refrencePage == 'lenderData' || props?.refrencePage == 'charityData') ?
                    <>
                    <>{konsole.log(props?.showType, props?.refrencePage,"sfjdsjfjdjfdjf", props?.showOnlyForm, props?.pageAction)}</>
                      <Row className={`d-flex align-items-center ${props?.refrencePage === 'lenderData' || props?.refrencePage == 'charityData' ? '' : (props?.refrencePage === 'RealEstate' || props?.refrencePage === 'Non-Retirement') ? 'gapProfessionalNone' : 'gapNone'} spacingBottom headingActivation`}>
                        {(!isactivationScreen && needToShowAddressType) &&
                          <Col className={props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                            <CustomSelect isPersonalMedical={props.refrencePage == 'lenderData' || props?.refrencePage == 'charityData' ? true : false} tabIndex={ startingTabIndex + 1} isError='' label={setMandatory("Address Type")} placeholder='Select'
                              options={filterAddressType(addressType)} onChange={(e) => handleSelectChange(e, 'addressType')} value={addressTypes} />
                            {(errMsg.addressTypeErr) && <><span className="err-msg-show">{errMsg.addressTypeErr}</span></>}
                          </Col>
                        }
                        <Col className={props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                          <CustomInput
                            isPersonalMedical={props.refrencePage == 'lenderData' ? true : false} tabIndex={startingTabIndex + 2} label={setMandatory("Country / Region")} placeholder="Enter country" id='country' value={country} notCapital={true} onChange={(val) => handleInputChange(val, 'country')} />
                          {(errMsg.countryErr) && <><span className="err-msg-show">{errMsg.countryErr}</span></>}
                        </Col>



                      </Row>
                      {addressTypes == "999999" &&
                        <Row className={`d-flex align-items-center ${props?.refrencePage === 'lenderData' ? '' : (['RealEstate','Non-Retirement'].includes(props?.refrencePage)) ? 'gapProfessionalNone' : 'gapNone'} spacingBottom headingActivation`}>
                          <Col xs={12} md={6} lg={colLgSize}>
                            <Other  tabIndex={startingTabIndex + 3} refrencePage={props.refrencePage} isChildOther={props.isChildOther} isPersonalMedical={props.refrencePage == 'lenderData' ? true : false} othersCategoryId={2} userId={userId} dropValue={addressTypes} ref={addressRef} natureId={natureId} notCapital={true} />
                            {(errMsg.otherErr) && <><span className="err-msg-show">{errMsg.otherErr}</span></>}
                          </Col>
                        </Row>} 
                      <Row className={`d-flex align-items-center ${['lenderData','transportation','charityData'].includes(props?.refrencePage) ? '' : (['RealEstate','Non-Retirement'].includes(props?.refrencePage)) ? 'gapProfessionalNone' : 'gapNone'} spacingBottom headingActivation`}>
                        {/* <Col xs={12} md={props.refrencePage == 'lenderData' ? 12 : 6}> */}
                        <Col className={`${props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : ''} ${props?.refrencePage === 'lenderData' ? 'spacingBottom' : ''}`} xs={12} md={6} lg={colLgSize}>
                          <div id='custom-input-field' className={`${"custom-input-field "}${(props.refrencePage == 'lenderData' || props?.refrencePage == 'charityData') ? "full-width" : ""}`}>
                            {$AHelper.$isNotNullUndefine("Address") && <p>{setMandatory("Address")}</p>}
                            <input tabIndex={startingTabIndex + 4} label="Address" type='text' className='' placeholder="Street address or P.O Box"
                              id='addressLine1' ref={searchInput} defaultValue={addressLine1} onBlur={setAddressLine1Data} notCapital={true} onChange={(e) => autoCompleteAddress(e, "addressLine1")} />
                            {(errMsg.addressLine1Err) && <><span className="err-msg-show mb-2">{errMsg.addressLine1Err}</span></>}</div>
                        </Col>
                        {/* {!isactivationScreen && (
                        props?.refrencePage != 'charityData' && <Col className={props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                          <CustomSelect isPersonalMedical={props.refrencePage == 'lenderData' ? true : false} tabIndex={startingTabIndex + 5} isError='' label="County Refrence" placeholder='Select'
                            options={countyRef} onChange={(e) => handleSelectChange(e, 'countyRefrence')} value={countyRefId} />
                          {(errMsg.countyRefrenceErr) && <><span className="err-msg-show">{errMsg.countyRefrenceErr}</span></>}
                        </Col>
                        )} */}
                      </Row>
                      {props?.refrencePage != 'charityData' && <Row className={`d-flex align-items-center ${['lenderData','transportation'].includes(props?.refrencePage) ? '' : (['RealEstate','Non-Retirement'].includes(props?.refrencePage)) ? 'gapProfessionalNone' : 'gapNone'} spacingBottom headingActivation`}>
                        <Col className={`${props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : ''} ${props?.refrencePage === 'lenderData' ? 'spacingBottom' : ''}`} xs={12} md={6} lg={colLgSize}>
                          <CustomInput isPersonalMedical={props.refrencePage == 'lenderData' ? true : false} tabIndex={startingTabIndex + 6} label={Professionalabel}  placeholder={Professionalabel}
                            id='apt' value={apt} notCapital={true} onChange={(val) => handleInputChange(val, 'apt')} />
                          {(errMsg.aptErr) && <><span className="err-msg-show">{errMsg.aptErr}</span></>}
                        </Col>
                        {/* </Row>
                      <Row className={`d-flex align-items-center ${props?.refrencePage === 'lenderData' ? '' :'gapNone'} spacingBottom`}> */}
                      {/* {!isactivationScreen && (
                        <Col className={props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                          <CustomInput isPersonalMedical={props.refrencePage == 'lenderData' ? true : false} tabIndex={startingTabIndex + 7} label="County" placeholder="Enter county" id='county' value={county} notCapital={true} onChange={(val) => handleInputChange(val, 'county')} />
                          {(errMsg.countyErr) && <><span className="err-msg-show"> {errMsg.countyErr}</span></>}
                        </Col>
                      )} */}
                      </Row>}
                      <Row className={`d-flex align-items-center ${props?.refrencePage === 'lenderData' ? '' : (['RealEstate','Non-Retirement'].includes(props?.refrencePage)) ? 'gapProfessionalNone' : 'gapNone'} spacingBottom headingActivation`}>
                        <Col className={props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                          <CustomInput isPersonalMedical={props.refrencePage == 'lenderData' ? true : false} tabIndex={startingTabIndex + 8} label={setMandatory("City")} placeholder="Enter city" id='city' value={city} notCapital={true} onChange={(val) => handleInputChange(val, 'city')} />
                          {(errMsg.cityErr) && <><span className="err-msg-show">{errMsg.cityErr}</span></>}
                        </Col>

                      </Row>
                      <Row className={`d-flex align-items-center ${props?.refrencePage === 'lenderData' ? '' : (['RealEstate','Non-Retirement'].includes(props?.refrencePage)) ? 'gapProfessionalNone' : 'gapNone'} spacingBottom headingActivation`}>
                        <Col className={props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                          <CustomInput isPersonalMedical={props.refrencePage == 'lenderData' ? true : false} tabIndex={startingTabIndex + 9} label={setMandatory("State")} placeholder="Enter state" id='state' value={state} notCapital={true} onChange={(val) => handleInputChange(val, 'state')} />
                          {(errMsg.stateErr) && <> <span className="err-msg-show">{errMsg.stateErr}</span></>}
                        </Col>
                      </Row>

                      <Row className={`${props.refrencePage === 'transportation' ? 'mb-3 ' : props.refrencePage === 'RealEstate' ? 'mb-3 gapProfessionalNoneReal' : 'mb-3 gapNoneAddAnother headingActivation'}`}>
                        <Col className={props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                          <CustomInput isPersonalMedical={props.refrencePage == 'lenderData' ? true : false} tabIndex={startingTabIndex + 10} label={setMandatory("Postal code")} placeholder="Zip / postal code" id='zipCode' value={zipcode} onChange={(val) => handleInputChange(val, 'zipcode')} />
                          {(errMsg.zipcodeErr) && <><span className="err-msg-show">{errMsg.zipcodeErr}</span></>}
                        </Col>
                        {(!['BusinessIntrests','Non-Retirement','professional','lenderData','transportation','RealEstate',"charityData"].includes(props?.refrencePage) && !isactivationScreen) &&
                          <Col className={`d-flex align-items-center mt-3 ${props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : ''} ${props?.refrencePage === 'Liabilities' || props?.refrencePage === 'professional' || props?.refrencePage === 'AddFiduciaryBeneficiary' || props?.refrencePage === 'AddChildWithProgressBar' || props?.refrencePage === 'EditChildWithAccordian ' ? 'justify-content-start justify-content-md-start justify-content-xl-start justify-content-xxl-center' : 'justify-content-end justify-content-md-center justify-content-xl-center justify-content-xxl-center'}`} xs={12} md={6} lg={6}>
                            <div className='d-flex addAnotherTextSize imgSizeWithText align-self-center'><img className='mt-0 me-1' src='/icons/plus-circle.svg'></img>
                              <h5 style={{ color: '#CD9C49', textDecorationLine: "underline", marginTop: "auto", cursor: "pointer" }} onClick={() => AddressAndContactModal("address", "checkvalidation")}>Add another Address</h5>
                            </div>
                          </Col>}
                      </Row>
                      <Row>

                      </Row>

                    </>
                    :
                    <>

                      <div id="information-table" className={`${props?.refrencePage == "professional" ? "" : "mt-4"} information-tables table-responsive`}>
                        <div className="table-search-section sticky-header-1 d-flex  align-items-center" style={{ padding: "0px 10px" }}>
                          <div className="children-header w-50"><span style={{ paddingLeft: "9px" }}>{"Address"}</span></div>

                          <div className='w-25 d-flex flex-row-reverse'>
                            {props.refrencePage !== "professional" && props?.refrencePage !== "transportation" &&
                              <CustomButton4 label="Add New" onClick={() => AddressAndContactModal("address", "", props?.userId)} />}
                          </div></div>
                        <div className='table-responsive fmlyTableScroll'>
                          <Table className="custom-table mb-0">
                            <thead className="sticky-header">
                              <tr style={{position:"relative", zIndex:"1"}}>
                                {tableHeader.map((item, index) => (
                                  <th key={index} className={`${item == 'Edit/Delete' ? 'text-end' : ''}`}  >{item}</th>
                                ))}
                              </tr>
                            </thead>
                            {addressList?.length > 0 ? (
                              <tbody className=''>
                                {filterAddressData(addressList)?.map((element, index) => {
                                  return (
                                    <tr key={index}>
                                      <td style={{ width: "35%" }}><div className='mt-2' style={AddressCSS}><div><img className='icon cursor-pointer mt-0 me-2' src='/icons/Address.svg' />{element?.addressType} Address</div></div></td>
                                      <td style={{ width: "40%" }}><div className='mt-3'>
                                        <CustomToolTip maxLength={50} content={element?.addressLine1} /></div></td>
                                      <td style={{ width: "25%" }}>
                                        <div className="d-flex justify-content-end gap-3">
                                          {editandAddressData(element?.addressType) && <img className='icon cursor-pointer' onClick={() => editAddressContact(element, index, "address")} src='/icons/EditButton.svg' />}
                                          {deleteAddressData(element?.addressType,props?.userId) ? <img className='icon cursor-pointer' onClick={() => deleteAddress(element, index, "address")} src='/icons/DeleteButton.svg' /> : <div style={{width: '40px'}}></div>}
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

              {props?.showType == "both" && <div className='mb-4 mt-4' style={{ border: "1px solid #CDCDCD", borderBottom: "none" }}></div>}

              {props?.showType == "contact" || props?.showType == "both" ?
                <>
                  {getEmailAndMobileWithSameContactTypeId(contactData?.contact).length == 0 || props?.showOnlyForm == true ?
                    <>
                      <div className={`${!props.isContactForm ? "mb-3 mt-3" : ""}`}>
                        <Row>
                            <Col xs={12} md={12} className={isactivationScreen ? 'd-flex' : ''}>
                              {!props?.isContactForm && !["Non-Retirement","charityData"].includes(props?.refrencePage) && (
                            <Row className={`d-flex align-items-center ${props?.refrencePage === 'lenderData' ? '' : (['RealEstate','Non-Retirement'].includes(props?.refrencePage)) ? 'gapProfessionalNone' : 'gapNone'} ${!props.isContactForm ? 'spacingBottom': ''}`}>
                              
                              <Col className={props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                                <CustomSelect
                                  isPersonalMedical={props.refrencePage == 'lenderData' ? true : false}
                                  tabIndex={startingTabIndex + 11}
                                  isError=''
                                  label="Contact Type"
                                  placeholder='Select'
                                  options={filteredContactTypes(contactType, contactTypes)}
                                  onChange={(e) => handleSelectChange(e, 'contactType')}
                                  value={contactTypes}

                                />
                                {(errMsg.contactTypeErr) && <><span className="err-msg-show">{errMsg.contactTypeErr}</span></>}
                              </Col>

                            </Row>
                              )}
                            {contactTypes == "999999" &&
                              <Row className={`d-flex align-items-center ${props?.refrencePage === 'lenderData' ? '' : (['RealEstate','Non-Retirement'].includes(props?.refrencePage)) ? 'gapProfessionalNone' : 'gapNone'} spacingBottom`}>
                                <Col className={props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                                  <CustomInput
                                    isPersonalMedical={props.refrencePage == 'lenderData' ? true : false}
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
                              <Col className={props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                                <ContactRezex isPersonalMedical={props.refrencePage == 'lenderData' ? true : false}  startTabIndex={startingTabIndex + 13} setValue={setMobileNumber} mobileNumber={mobileNumber} hideErrMsg={hideErrMsg} errMsg={errMsg} countryCode={countryCode} setcountryCode={setcountryCode} comType={comType} handleSelectChange={handleSelectChange} comeTypes={comeTypes} />
                                {(errMsg.mobileErr) && <><span className="err-msg-show">{errMsg.mobileErr}</span></>}
                                {(errMsg.comeTypeErr) && <><span className="err-msg-show">{errMsg.comeTypeErr}</span></>}

                              </Col>

                            </Row>
                              )}

                            {isactivationScreen && (
                            <Col className="spacingBottom col-6">
                              <Row id='activatonContact' className={props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : 'headingActivationfullWidth'} xs={12} md={6} lg={colLgSize}>
                                <ContactRezex isPersonalMedical={props.refrencePage == 'lenderData' ? true : false} hideCommType={true} startTabIndex={startingTabIndex + 14}  setValue={setMobileNumber} mobileNumber={mobileNumber} hideErrMsg={hideErrMsg} isMandatory={true} errMsg={errMsg} countryCode={countryCode} setcountryCode={setcountryCode} comType={comType} handleSelectChange={handleSelectChange} comeTypes={comeTypes} />
                                {(errMsg.mobileErr) && <div className='w-100'><span className="err-msg-show">{errMsg.mobileErr}</span></div>}
                                {(errMsg.comeTypeErr) && <div className='w-100'><span className="err-msg-show">{errMsg.comeTypeErr}</span></div>}

                              </Row>

                            </Col>
                            )}

                          {!isactivationScreen && (
                            <Row className={`${props.refrencePage === 'transportation' ? 'spacingBottom ' : 'spacingBottom gapNoneAddAnother headingActivationfullWidth'}`}>
                              <Col className={props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : ''} xs={12} md={6} lg={colLgSize}>
                                <CustomInput
                                  isPersonalMedical={props.refrencePage == 'lenderData' ? true : false}
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


                              {((!["lenderData","Non-Retirement","charityData"].includes(props?.refrencePage)) && !props?.isContactForm) && <Col xs={12} md={6} lg={6} className={`mt-3 d-flex ${(props?.refrencePage === 'professional' && props?.isSideContent) || (['Liabilities','AddFiduciaryBeneficiary','AddChildWithProgressBar'].includes(props?.refrencePage)) ? 'justify-content-start justify-content-md-start justify-content-xl-start justify-content-xxl-center' : 'justify-content-end justify-content-md-center justify-content-xl-center justify-content-xxl-center'}`} >
                                <div className='d-flex addAnotherTextSize imgSizeWithText align-self-center'><img className='mt-0 me-1' src='/icons/plus-circle.svg'></img>
                                  <h5 style={{ color: '#CD9C49', textDecorationLine: "underline", marginTop: "auto", cursor: "pointer" }} onClick={() => AddressAndContactModal("contact", "checkvalidation", props?.userId)}>Add another contact</h5>
                                </div>
                              </Col>}
                            </Row>
                          )}

                            {isactivationScreen && (
                            <Col className="spacingBottom col-6">
                              {/* <Col xs={12} md={props.refrencePage == 'lenderData' ? 12 : 6}> */}
                              <Row className={props?.refrencePage === 'professional' && isShowingDescription === undefined ? 'customProfessional-lg-5' : 'headingActivationfullWidth'} xs={12} md={6} lg={colLgSize}>
                                <CustomInput
                                  isPersonalMedical={props.refrencePage == 'lenderData' ? true : false}
                                  tabIndex={startingTabIndex + 16}
                                  label="Email*"
                                  placeholder='i.e johnoe@gmail.com'
                                  id='email'
                                  value={email}
                                  isSmall={true}
                                  onChange={(val) => handleInputChange(val, 'email')}
                                  isDisable={true}
                                />
                                <>{konsole.log(props.refrencePage, "kedkkfdkfdkdfdkfdkd")}</>
                                {(errMsg.emailErr) && <><span className="err-msg-show">{errMsg.emailErr}</span></>}
                              </Row>


                              {(props?.refrencePage != "lenderData" && !props?.isContactForm) && <Row xs={12} md={6} lg={6} className="mt-3 d-flex justify-content-end justify-content-md-center justify-content-xl-center justify-content-xxl-center" >
                                <div className='d-flex addAnotherTextSize imgSizeWithText align-self-center'><img className='mt-0 me-1' src='/icons/plus-circle.svg'></img>
                                  <h5 tabIndex={startingTabIndex + 17}  style={{ color: '#CD9C49', textDecorationLine: "underline", marginTop: "auto", cursor: "pointer" }} onClick={() => AddressAndContactModal("contact", "checkvalidation", props?.userId)}>Add another contact</h5>
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
                            <CustomButton4 tabIndex={startingTabIndex + 18} label="Add New" onClick={() => AddressAndContactModal("contact","", props?.userId)} />
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
                            {getEmailAndMobileWithSameContactTypeId(contactData?.contact)?.length > 0 ? (
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
                                          {element?.emails?.contactTypeId == 1 || element?.mobile?.contactTypeId == 1 && !isDeleteContact ? <div style={{width: '40px'}}></div> : <img className='icon cursor-pointer' onClick={() => deleteAddress(element, index, "contact")} src='/icons/DeleteButton.svg' />}
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
                {(showSameAs(props?.refrencePage) || (isChecked == true && props?.userId !== primaryUserIdNew)) &&
                <Row className='mb-2 mx-1'>
                  <CustomRadio name='islivewith'
                    tabIndex={startingTabIndex + 19}
                    options={radioValuesOcc}
                    placeholder={labelOfisSameAs}
                    onChange={(e) => handleRadioOcc(e, 'isWorking')}
                    value={isChecked}
                  />
                </Row>

              }

            </Col>
          </>}

      </Row>
      {showModal &&
        <ReusableAddressContact
          startTabIndex={startingTabIndex + 20}
          show={showModal} handleClose={handleClose}
          header={modalType == "address" ? "Add address information." : "Add contact information"}
          modalType={modalType} editJsonData={editJsonData} setEditJsonData={setEditJsonData}
          userId={userId}
          userContact={(userId == primaryUserIdNew && props?.refrencePage == "PersonalInformation") ? primaryContactData : (userId == spouseId && props?.refrencePage == "PersonalInformation") ? spouseContactData : contactData}
          userAddress={(userId == primaryUserIdNew && props?.refrencePage == "PersonalInformation") ? primartAddressData : (userId == spouseId && props?.refrencePage == "PersonalInformation") ? spouseAddressData : addressList}
          userType={props?.type}
          userDataByEmailId={userDataByEmailId}
          loggedInUserRoleId={loggedInUserRoleId}
          refrencePage={props.refrencePage}
          setContactData={(userId == primaryUserIdNew && props?.refrencePage == "PersonalInformation") ? setPrimaryContactData : (userId == spouseId  && props?.refrencePage == "PersonalInformation") ? setSpouseContactData : setContactData}
          setAddressData={(userId == primaryUserIdNew && props?.refrencePage == "PersonalInformation") ? setPrimartAddressData : (userId == spouseId  && props?.refrencePage == "PersonalInformation") ? setSpouseAddressData : setAddressList}
          getDataForLiabilities={getDataForLiabilities} />
      }
    </>

  );
});

export default ContactAndAddress;
