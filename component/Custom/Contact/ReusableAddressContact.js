import React, { useEffect, useState, useRef, useCallback, useImperativeHandle, useContext } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { CustomInput, CustomSelect } from '../CustomComponent';
import { useAppSelector, useAppDispatch } from '../../Hooks/useRedux';
import { selectApi } from '../../Redux/Store/selectors';
import useUserIdHook from '../../../components/Reusable/useUserIdHook';
import { createSentEmailJsonForOccurrene, createSentTextJsonForOccurrene } from '../../../components/control/Constant';
import { fetchContactType, fetchAddressType, fetchCountyRef, fetchUserContactData, fetchComType, fetchComMediumType} from '../../Redux/Reducers/apiSlice';
import { $Msg_AddressDetails } from '../../Helper/$MsgHelper';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { $AHelper } from '../../Helper/$AHelper';
import { initMapScript } from '../../../components/control/AHelper';
import { CustomButton } from '../CustomButton';
import { $Service_Url } from '../../../components/network/UrlPath';
import { useLoader } from '../../utils/utils';
import { postApiCall, getApiCall, postApiCallNew, getApiCall2 } from '../../../components/Reusable/ReusableCom';
import Other from '../../../components/asssets/Other';
import ContactRezex from './ContactRezex';
import withOccurrenceApi from '../../../components/OccurrenceHoc/withOccurrenceApi';
import { globalContext } from '../../../pages/_app';
import CustomModal from '../CustomModal';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { connect } from 'react-redux';
import { SET_LOADER } from '../../../components/Store/Actions/action';
import { getSMSNotificationPermissions } from '../../../components/Reusable/ReusableCom';
import { paralegalAttoryId, preferredContactMethod } from '../../../components/control/Constant';
import { fetchPrimaryMemberContactDetials } from '../../Redux/Reducers/personalSlice';


const ReusableAddressContact = (props) => {
  const { emailTmpObj, textTmpObj, sentMail, commChannelId } = props;
  const newObjErr = () => ({ countryErr: "", aptErr: "", cityErr: "", stateErr: "", zipcodeErr: "", addressTypeErr: "", countyErr: "", countyRefrenceErr: "", addressLine1Err: '', otherErr: "", emailErr: "", mobileErr: "", contactTypeErr: "", comeTypeErr: "" });
  const dispatch = useAppDispatch();
  const { _subtenantName } = useUserIdHook();
  const [errMsg, setErrMsg] = useState(newObjErr());
  const apiData = useAppSelector(selectApi);
  const { primaryUserId, spouseUserId, loggedInUserId, primaryMemberFullName } = usePrimaryUserId();
  const [addressLine1, setAddressLine1] = useState('')
  const [formlabelData, setFormlabelData] = useState({})
  const [apt, setApt] = useState('')
  const [country, setCountry] = useState('United States')
  const [city, setCity] = useState('')
  const [isModal, setisModal] = useState(false)
  const [contactTypes, setContactTypes] = useState()
  const [addressTypes, setAddressTypes] = useState()
  const [lattitude, setLattitude] = useState()
  const [state, setState] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [longitude, setLongitude] = useState()
  const [mobileNumber, setMobileNumber] = useState('')
  const [email, setEmail] = useState("")
  const { contactType, addressType, countyRef, comType, commMedium } = apiData;
  const [county, setcounty] = useState('')
  const [natureId, setNatureId] = useState(0)
  const [countyRefrence, setCountyRefrence] = useState('')
  const searchInput = useRef(null)
  const addressRef = useRef(null)
  const [comeTypes, setComeTypes] = useState("1")
  const [userId, setUserId] = useState()
  const [countryCode, setcountryCode] = useState("+1")
  const [otherContact, setOtherContact] = useState('')
  const [commMediumChennel, setCommMediumChennel] = useState(3)
  const [commMediumPutPostJson, setcommMediumPutPostJson] = useState()
  const [reRender, setReRender] = useState(false)
  const { setWarning, newConfirm } = useContext(globalContext)
  const [contactTypeLabel, setContactTypeLabel] = useState("")
  const [addressTypeLable, setAddressTypeLable] = useState("")
  const [isClientPermissions, setIsClientPermissions] = useState(false);
  const [buttonType, setButtonType] = useState("")
  const [occurenceUrl, setOccurenceUrl] = useState()
  const [activateUserData, setActivateUserData] = useState()
  const startingTabIndex = props?.startTabIndex ?? 0;

  useEffect(() => {
    if ($AHelper?.$isNotNullUndefine(props?.editJsonData)) {
      if (props?.modalType == "address") {
        const { addressLine1, city, country, state, zipcode, lattitude, longitude, addressTypeId, countyRefId, addressLine2, county, addressId,addressType} = props?.editJsonData;
        setAddressLine1(addressLine1)
        setCity(city)
        setCountry(country)
        setState(state)
        setZipcode(zipcode)
        setAddressTypes(addressTypeId)
        setAddressTypeLable(addressType)
        setLattitude(lattitude)
        setLongitude(longitude)
        setcounty(county)
        setCountyRefrence(countyRefId)
        setApt(addressLine2)
        setNatureId(addressId)
        setReRender(true)
      } else {

        if (props?.editJsonData?.mobile?.contactTypeId == "999999" || props?.editJsonData?.email?.contactTypeId == "999999") {
          setOtherContact(props?.editJsonData?.mobile?.mobileOther?.othersName || props?.editJsonData?.email?.emailOther?.othersName)
        }
        const contactTypeData = props?.editJsonData?.mobile?.contactTypeId || props?.editJsonData?.email?.contactTypeId;
        const contactTypeLabelData = props?.editJsonData?.mobile?.contactType || props?.editJsonData?.email?.contactType;
        setContactTypeLabel(contactTypeLabelData)
        setContactTypes(contactTypeData)
        setComeTypes(props?.editJsonData?.mobile?.commTypeId || "1")
        if ($AHelper?.$isNotNullUndefine(props?.editJsonData?.mobile)) {
          // console.log(props?.editJsonData?.mobile?.mobileNo,"props?.editJsonData?.mobile?.mobileNo")

          const { number, countryCode } = separateCountryCodeAndNumber(props?.editJsonData?.mobile?.mobileNo) ?? {};
          setMobileNumber(number);
          setcountryCode(countryCode);
        }
        setEmail(props?.editJsonData?.email?.emailId)
        if (props?.userId == primaryUserId && contactTypeData == 1 && !paralegalAttoryId.includes(props?.loggedInUserRoleId)) {
          fectchsubjectForFormLabelId()
        }



      }


    }
    if(props?.refrencePage == "beneficiaryTable"){
      setContactTypes(1)
      setAddressTypes(1)
    }
  }, [props?.editJsonData, reRender])
  
useEffect(() => {
    const fetchUserData = async () => {
      if ($AHelper?.$isNotNullUndefine(props?.userId)) {
          const _resultOf = await getApiCall2('GET', `${$Service_Url.getUserDetailsByUserEmailId}?UserId=${props?.userId}`, "");
          const response = _resultOf?.data;
          setActivateUserData(response);
      }
      setUserId(props?.userId)
    };
  
    fetchUserData();
  }, []);

  //////////  CALL ALL NEEDED GET APIS
  const fetchApi = async () => {
    contactType.length == 0 && apiCallIfNeed(contactType, fetchContactType());
    addressType.length == 0 && apiCallIfNeed(addressType, fetchAddressType());
    countyRef.length == 0 && apiCallIfNeed(countyRef, fetchCountyRef());
    comType.length == 0 && apiCallIfNeed(comType, fetchComType());
    commMedium.length == 0 && apiCallIfNeed(commMedium, fetchComMediumType());
  };
  const apiCallIfNeed = (data, action) => {
    if (data.length > 0) return;
    dispatch(action)
  }
  ///////////////////////



  //////FILTERED CONTACTTYPE DROPDOWN VALUES
  const filteredContactTypes = (data, value) => {
    if ($AHelper?.$isNotNullUndefine(props?.editJsonData)) {
      let addedList = props?.userContact?.contact?.mobiles.length > props?.userContact?.contact?.emails.length ? props?.userContact?.contact.mobiles : props?.userContact?.contact?.emails;
      const contactTypeData = props?.editJsonData?.mobile?.contactTypeId || props?.editJsonData?.email?.contactTypeId;
      let filtered = data?.filter((ele1)=> !addedList?.some((ele)=>ele?.contactTypeId == ele1.value && ele1.value != "999999" && ele1.value != contactTypeData))
         
      if (props?.refrencePage == "Liabilities" || props?.refrencePage == "transportation") {
        let newJson = filtered?.filter((ele) => ele?.value !== "999999")
        return newJson
      } else {
        return filtered
      }
    } else {
      let addedList = props?.userContact?.contact?.mobiles.length > props?.userContact?.contact?.emails?.length ? props?.userContact?.contact?.mobiles : props?.userContact?.contact?.emails
      let filtered = data?.filter((ele) => !addedList?.some((e) => ele.value != "999999" && e?.contactTypeId == ele?.value))
      if (props?.refrencePage == "Liabilities" || props?.refrencePage == "transportation") {
        let newJson = filtered?.filter((ele) => ele?.value !== "999999")
        return newJson
      } else {
        return filtered
      }
    }

  }

  //////FILTERED ADDRESS DROPDOWN VALUES
  const filteredAddressType = (data, value) => {
    if ($AHelper?.$isNotNullUndefine(props?.editJsonData)) {
      let addedList = props?.userAddress?.length > 0 ? props?.userAddress : []
      let filtereds = data?.filter((ele1)=> !addedList.some((ele)=>ele?.addressTypeId == ele1.value && ele1.value != "999999" && ele1.value != props?.editJsonData?.addressTypeId))
      if (props?.refrencePage == "Liabilities" || props?.refrencePage == "transportation") {
        let newJson = filtereds?.filter((ele) => ele?.value !== "999999")
        return newJson
      } else {
        return filtereds
      }
    } else {
      let addedList = props?.userAddress?.length > 0 ? props?.userAddress : []
      let filtered = data?.filter((ele) => !addedList?.some((e) => ele.value != '999999' && e?.addressTypeId == ele.value))
      if (props?.refrencePage == "Liabilities" || props?.refrencePage == "transportation") {
        let newJson = filtered?.filter((ele) => ele?.value !== "999999")
        return newJson
      } else {
        return filtered
      }
    }

  }

  ///////////// AUTOCOMPLETE ADDRESS
  const autoCompleteAddress = (value, key) => {
    hideErrMsg(`${key}Err`, errMsg)
    setErrMsg(newObjErr())
    initMapScript().then(() => initAutoComplete());
  }
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
    setAddress(extractAddress(place));
  };
  const setAddress = (address) => {
    address = formateAddressLine1(address);
    setCity(address.city)
    setState(address.state)
    setZipcode(address.zip)
    setCountry(address.country)
    setcounty(address.county)
    setAddressLine1(searchInput?.current?.value)
    if(address.state == 'New York' || address.state == 'Alaska'){
      
      setCountyRefrence(1)
    }else if(address.state == 'Louisiana'){
      setCountyRefrence(3)
    }else{
      setCountyRefrence(2)
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
  ////////////////////////////////////////////



  ///////// FUNCTION FOR  ALL DROPDOWN 
  const handleSelectChange = (value, key) => {
    hideErrMsg(`${key}Err`, errMsg)
    if (key == "contactType") {
      setContactTypes(value.value)
      setContactTypeLabel(value?.label)
    } else if (key == "countyRefrence") {
      setCountyRefrence(value.value)
    } else if (key == "comeType") {
      setComeTypes(value.value)
    }
    else if (key == "addressType") {
      setAddressTypes(value.value)
      setAddressTypeLable(value?.label)
    }




  };

  ////////// FUNCTION FOR ALL INPUTS
  const handleInputChange = (value, key) => {

    // let valuUpperCase = $AHelper.$isUpperCase(value)
    let valuUpperCase = value;

    switch (key) {
      case "addressLine1":
        setErrMsg(newObjErr())
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
        setcounty(value)
        break;
      case "email":
        setEmail(value);
        break;
      case "other":
        setOtherContact(value)
        break
      default:
        // Default case if none of the keys match
        break;
    }

    hideErrMsg(`${"mobile"}Err`, errMsg)
    setStateFun(key, valuUpperCase)
    hideErrMsg(`${key}Err`, errMsg)
  }
  ////////  HIDE ERROR MSG FUNCTION
  const hideErrMsg = (key) => {
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
  const closeModal = () => {
    props?.setEditJsonData()
    props?.handleClose()
  }
  
  
  
   
    
     


  /////////////FUNCTION FOR VALIDATION ADDRESS OR CONTACT OR EMAIL
  const validateField = (field, errorMessageKey) => {

    if (!$AHelper.$isNotNullUndefine(field) || /^\s*$/.test(field)) {

      setErrMsg(prev => ({ ...prev, [errorMessageKey]: $Msg_AddressDetails[errorMessageKey] }));
      return false;
    } else {
      setErrMsg(prev => ({ ...prev, [errorMessageKey]: '' }));
    }
    return true;
  };
  const validateAddress = () => {
    const isValidCity = validateField(city, 'cityErr');
    const isValidCountry = validateField(country, 'countryErr');
    // const isValidApt = validateField(apt, 'aptErr');
    const isValidState = validateField(state, 'stateErr');
    const isValidZipcode = validateField(zipcode, 'zipcodeErr');
    const isValidAddressType = validateField(addressTypes, 'addressTypeErr');
    const isValidAddressLine1 = validateField(addressLine1, 'addressLine1Err');

    return isValidCity && isValidCountry && isValidState && isValidZipcode && isValidAddressType && isValidAddressLine1
  };
  const validateContact = () => {
    const isValidContactType = validateField(contactTypes, 'contactTypeErr');
    const isValidComType = $AHelper?.$isNotNullUndefine(mobileNumber) && validateField(comeTypes, 'comeTypeErr');
    return isValidContactType && (!$AHelper?.$isNotNullUndefine(mobileNumber) ? true : isValidComType);
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  ////////////////////////
  const finalJson = (updateJson, modalType, typeEdit) => {
    props?.getDataForLiabilities(updateJson, modalType, typeEdit)
    // setliabilitiesJson(prev => ({ ...prev, updateJson }));
    // setliabilitiesJson(updateJson);
    // let data = {...liabilitiesJson}

    // console.log("hdhgfdjdddgfdjgf",updateJson)

  }
    //////  FUNCTION FOR SUBBMIT ALL DATA 

  const getExestingData = async(id,oldData,type)=>{
      if(type == "address"){
        if($AHelper?.$isNotNullUndefine(id)){
          const _resultOf = await getApiCall('GET', $Service_Url.getAllAddress + id, "")
          props?.setAddressData(_resultOf?.addresses)
        }
  

      }else{
        const responses = await dispatch(fetchUserContactData(id));
        props?.setContactData(responses?.payload)
        setReRender(true)
      }  
   
    

  }

  const handleClick = async (buttonType) => {
    if (props?.modalType == "address") {
      if (validateAddress()) {
        let apiType = $AHelper?.$isNotNullUndefine(props?.editJsonData) ? "PUT" : "POST"
        let url = $AHelper?.$isNotNullUndefine(props?.editJsonData) ? $Service_Url.putupdateAddress : $Service_Url.postAddAddress
        useLoader(true)
        let addressJosn = $JsonHelper.createAddressJson(userId, lattitude, longitude, addressLine1, apt, zipcode, county, country, city, state, addressTypes, countyRefrence, loggedInUserId)


        if (apiType === "PUT") {
          addressJosn.address = {
            ...(addressJosn.address || {}),
            updatedBy: loggedInUserId,
            addressId: props?.editJsonData?.addressId
          };
        }
        if (props?.refrencePage == "Liabilities" || props?.refrencePage == "transportation") {

          const addressJosn1 = $JsonHelper.createAddressJsonWithoutUserUd(lattitude, longitude, addressLine1, apt, zipcode, county, city, state, country, countyRefrence, loggedInUserId, addressTypes, addressTypeLable)
          props?.getDataForLiabilities(addressJosn1, props?.modalType)

        } else {
          const _resultGetActivationLink = await postApiCall(apiType, url, addressJosn);
          setWarning("successfully", `Successfully ${$AHelper?.$isNotNullUndefine(props?.editJsonData) ? 'updated' : 'saved'} data`, `Your data have been ${$AHelper?.$isNotNullUndefine(props?.editJsonData) ? 'updated' : 'saved'} successfully`
          );
          
          if (_resultGetActivationLink == "err") {
            return;
          }
          if (addressTypes == "999999") {
            let addressResponse = _resultGetActivationLink.data?.data?.addresses[0]
            addressRef.current.saveHandleOther(addressResponse.addressId);

          }
        }


        useLoader(false)
        if (apiType == "POST" && buttonType == "save" || $AHelper?.$isNotNullUndefine(props?.editJsonData)) {
          closeModal()
        }
        if (searchInput.current) {
          searchInput.current.value = ''; // Set value here
          if(buttonType == "addAnother" && (props?.refrencePage != "Liabilities" && props?.refrencePage != "transportation")){
            getExestingData(userId,"","address")
          }
     
        }
        setCity('')
        setCountry('')
        setState('')
        setZipcode('')
        setAddressTypes('')
        setLattitude('')
        setLongitude('')
        setcounty('')
        setCountyRefrence()
        setApt('')
        useLoader(false);


      } else {
        return;
      }
    } else {
      let mobileOther = null
      let emailOther = null
      const isEmailVerified = $AHelper.$isNotNullUndefine(activateUserData) && activateUserData.length > 0 ? activateUserData[0]?.isEmailVerified :  null
      let primaryData = JSON.parse(sessionStorage.getItem("userDetailOfPrimary")).primaryEmailId
      let typeEdit = $AHelper?.$isNotNullUndefine(props?.editJsonData) ? true : false
      if (validateContact()) {

        if (!$AHelper?.$isNotNullUndefine(mobileNumber) && !$AHelper?.$isNotNullUndefine(email)) {
          validateField(email, 'emailErr');
          validateField(mobileNumber, 'mobileErr')
          return;
        }
        if ($AHelper?.$isNotNullUndefine(mobileNumber) && mobileNumber.length < 10) {
          setErrMsg(prev => ({ ...prev, ["mobileErr"]: 'Enter a valid mobile number' }));
          return;
        }
        if (!isValidEmail(email) && $AHelper?.$isNotNullUndefine(email)) {
          setErrMsg(prev => ({ ...prev, ["emailErr"]: 'Enter a valid email' }));
          return;
        }
        if (isValidEmail(email) && $AHelper?.$isNotNullUndefine(email) && props?.userId == spouseUserId && email === primaryData && !isEditShow(props?.editJsonData)) {
          setErrMsg(prev => ({ ...prev, ["emailErr"]: 'Email address already exist' }));
          return;
        }
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

        //////////// flow for addor update if one is not exesting  email/mobile
        if ($AHelper?.$isNotNullUndefine(props?.editJsonData) && (!$AHelper?.$isNotNullUndefine(props?.editJsonData?.email) || !$AHelper?.$isNotNullUndefine(props?.editJsonData?.mobile))) {

          let mobileOthers = null
          let emailOthers = null
          if (contactTypes == "999999") {
            mobileOthers = {
              othersName: otherContact,
              othersCategoryId: 6,
              isActive: true,
              createdBy: loggedInUserId

            }
            emailOthers = {
              othersName: otherContact,
              othersCategoryId: 6,
              isActive: true,
              createdBy: loggedInUserId

            }

          };




          const updateJsonData = {
            "userId": userId,
            "activityTypeId": "4",
            "contact": {
              "mobiles": ($AHelper?.$isNotNullUndefine(props?.editJsonData?.mobile)) || !$AHelper?.$isNotNullUndefine(mobileNumber) ? [] : [
                {
                  "contactTypeId": contactTypes,
                  "mobileNo": countryCode + mobileNumber,
                  "createdBy": loggedInUserId,
                  "mobileOther": mobileOthers,
                  "commTypeId": comeTypes
                }

              ],
              "emails": ($AHelper?.$isNotNullUndefine(props?.editJsonData?.email)) || !$AHelper?.$isNotNullUndefine(email) ? [] : [
                {
                  "contactTypeId": contactTypes,
                  "createdBy": loggedInUserId,
                  "emailId": email,
                  "emailOther": emailOthers,
                }
              ]
            }
          }
          if (updateJsonData.contact?.mobiles.length > 0 || updateJsonData.contact?.emails.length > 0) {
            if (props?.refrencePage == "Liabilities" || props?.refrencePage == "transportation") {
              let typeEdit = $AHelper?.$isNotNullUndefine(props?.editJsonData) ? true : false
              props?.getDataForLiabilities(updateJsonData, props?.modalType, typeEdit)
            } else {
              useLoader(true)
              const _resultGetActivationLink = await postApiCallNew("POST", $Service_Url?.postAddContactWithOther, updateJsonData);
          
              if (_resultGetActivationLink?.isError == "true") {
                let res = _resultGetActivationLink?.resPonse?.data?.Messages?.[0]
                if (res == "Duplicate mobile no, Entered mobile no is already available." || res == "Duplicate email id, Entered email id is already available.") {
                  setWarning("warning", _resultGetActivationLink?.resPonse?.data?.Messages?.[0])
                  if(res == "Duplicate email id, Entered email id is already available."){
                    getExestingData(userId,updateJson,"contact")
                    setContactTypes('')
                    setEmail('')
                  }}
                useLoader(false)
                return;
              }
              fetchPrimaryContactDetails();
              useLoader(false)
            }

          }

        }

        //////////////  add or update  flow
        const updateJson = {
          "userId": userId,
          "activityTypeId": "4",
          "contact": {
            "mobiles": (!$AHelper?.$isNotNullUndefine(mobileNumber)) || ($AHelper?.$isNotNullUndefine(props?.editJsonData) && !$AHelper?.$isNotNullUndefine(props?.editJsonData?.mobile) || props?.editJsonData?.mobile?.length == 0) ? [] : [
              {
                "contactTypeId": contactTypes,
                "mobileNo": countryCode + mobileNumber,
                [$AHelper?.$isNotNullUndefine(props?.editJsonData) ? "updatedBy" : "createdBy"]: loggedInUserId,
                "contactId": $AHelper?.$isNotNullUndefine(props?.editJsonData) ? props?.editJsonData?.mobile?.contactId : "",
                "mobileOther": mobileOther,
                "commTypeId": comeTypes,
                "contactType": contactTypeLabel
              }

            ],
            "emails": (!$AHelper?.$isNotNullUndefine(email)) || ($AHelper?.$isNotNullUndefine(props?.editJsonData) && !$AHelper?.$isNotNullUndefine(props?.editJsonData?.email) || props?.editJsonData?.email?.length == 0) || (isEmailVerified == true && contactTypes == 1 && userId == primaryUserId) ? [] : [
              {
                "contactTypeId": contactTypes,
                [$AHelper?.$isNotNullUndefine(props?.editJsonData) ? "updatedBy" : "createdBy"]: loggedInUserId,
                "contactId": $AHelper?.$isNotNullUndefine(props?.editJsonData) ? props?.editJsonData?.email?.contactId : "",
                "emailId": email,
                "emailOther": emailOther,
                "contactType": contactTypeLabel
              }
            ]
          }
        }
        if (typeEdit == true) {
          const { email, mobile } = props?.editJsonData;
          if ($AHelper?.$isNotNullUndefine(email?.emailId) && updateJson?.contact?.emails.length < 1 && !isEmailVerified == true && contactTypes == 1) {
            setWarning("warning", "Please fill your email.")
            return;
          }
          if ($AHelper?.$isNotNullUndefine(mobile?.mobileNo) && updateJson?.contact?.mobiles.length < 1) {
            setWarning("warning", "Please fill your mobile number.")
            return;
          }
        }

        if (props?.refrencePage == "Liabilities" || props?.refrencePage == "transportation") {
          if(typeEdit == false || ($AHelper?.$isNotNullUndefine(email) && $AHelper?.$isNotNullUndefine(mobileNumber))){
                  props?.getDataForLiabilities(updateJson, props?.modalType, typeEdit)
          }
  
        } else {
          if ((isEmailVerified !== null && isEmailVerified == true || isEmailVerified == false) && ($AHelper?.$isNotNullUndefine(props?.editJsonData?.email?.emailId) && (contactTypes == 1) && (props?.editJsonData?.email?.emailId !== email))) {
            if(isEmailVerified == true){
              const confirmRes = await newConfirm(true, "Are you sure you want to change the email? If confirm, a reactivation link will be automatically sent to the client's account after the email is updated.", 'Permission', 'Confirmation', 3);
              if (!confirmRes) return;
            }
           
            let jsonObj = {
              "currentUserName": props?.editJsonData?.email?.emailId,
              "newUserName": email,
              "updatedBy": loggedInUserId,
              "remarks": "Client Primary Email Updated by Legal",
              "clientIPAddress": "::1",
              "isParaResquest": true
            }
            useLoader(true)
            const result = await postApiCallNew('PUT', $Service_Url.putUserNameEmail, jsonObj);          
            if (result?.isError == "true") {
              let res = result?.resPonse?.data?.messages?.[0]
              useLoader(false)
              setWarning("warning", res)
              return;
            }
            fetchPrimaryContactDetails();
            if(isEmailVerified == true){
              SendActivationMailFunc()
            }
         
            setButtonType(buttonType)
          }else{
            let type = $AHelper?.$isNotNullUndefine(props?.editJsonData) ? "PUT" : "POST"
            useLoader(true)
            let url = $AHelper?.$isNotNullUndefine(props?.editJsonData) ? $Service_Url?.updateContactWithOtherDetailsPath : $Service_Url?.postAddContactWithOther;
            const _resultGetActivationLink = await postApiCallNew(type, url, updateJson);
            fetchPrimaryContactDetails();
            useLoader(false)
            if (_resultGetActivationLink?.isError == "true") {
              let res = _resultGetActivationLink?.resPonse?.data?.Messages?.[0]
              if (res == "Duplicate mobile no, Entered mobile no is already available." || res == "Duplicate email id, Entered email id is already available.") {
                setWarning("warning", _resultGetActivationLink?.resPonse?.data?.Messages?.[0])
                if(res == "Duplicate email id, Entered email id is already available."){
                  getExestingData(userId,updateJson,"contact")
                  setContactTypes('')
                }}
              useLoader(false)
              return;
            }
            setWarning("successfully", `Successfully ${$AHelper?.$isNotNullUndefine(props?.editJsonData) ? "updated" :" saved"} data `, `Your data have been ${$AHelper?.$isNotNullUndefine(props?.editJsonData) ? "updated" : "saved"} successfully`)
            useLoader(false)

          }
          ///////////////////////////
         
          let isUpdate = formlabelData?.label1037?.response.some(ele => ele?.userSubjectDataId && ele?.userSubjectDataId !== 0)
          if ($AHelper?.$isNotNullUndefine(commMediumPutPostJson)) {
            if (isUpdate == true) {
              updateResponse(commMediumPutPostJson)
            } else {
              if(props?.userId == primaryUserId && contactTypes == 1 && !paralegalAttoryId.includes(props?.loggedInUserRoleId) &&                                                  
              $AHelper.$isNotNullUndefine(formlabelData) && formlabelData?.label1037){
                addResponse(commMediumPutPostJson)
              }
              
            }

          } else {
            const questionId = formlabelData?.label1037?.questionId;
            const userSubjectDataId = formlabelData?.label1037?.response.length > 0 && formlabelData?.label1037?.response[0]?.userSubjectDataId ? formlabelData?.label1037?.response[0]?.userSubjectDataId : 0;

            let json = [
              {
                "userSubjectDataId": userSubjectDataId,
                "subjectId": questionId,
                "subResponseData": commMediumChennel,
                "responseId": formlabelData?.label1037?.response.length > 0 && formlabelData?.label1037?.response[0]?.responseId,
                "userId": props?.userId
              }
            ]
            if(props?.userId == primaryUserId && contactTypes == 1 && !paralegalAttoryId.includes(props?.loggedInUserRoleId) &&                                                  
            $AHelper.$isNotNullUndefine(formlabelData) && formlabelData?.label1037){
              addResponse(json)
            }
          
          }
          // dispatch(fetchUserContactData(userId));
          
        }

        if (((isEmailVerified == null || isEmailVerified == false) && contactTypes == 1) || (props?.editJsonData?.email?.emailId == email || contactTypes !== 1)) {
          if (buttonType == "save") {
            // dispatch(fetchUserContactData(userId))
            closeModal();

          } else if (buttonType == "addAnother") {
            if(props?.refrencePage !== "Liabilities" && props?.refrencePage !== "transportation"){
              getExestingData(userId,updateJson,"contact")
            }
          
            setMobileNumber('')
            setEmail('')
            setContactTypes('')
            setOtherContact('')
            setcountryCode('+1')
            setComeTypes("1")
            
          }
        }

      } else {
        return;
      }



    }
      
  }




  const fetchPrimaryContactDetails=()=>{
    dispatch(fetchPrimaryMemberContactDetials({userId:primaryUserId}))
  }


  const isEditShow = (data) => {
    if ($AHelper?.$isNotNullUndefine(activateUserData) && activateUserData.length > 0 && (data?.email?.contactType === "Primary" || data?.mobile?.contactType === "Primary")) {        
        const { isActive, jointAccountUserId, isEmailVerified } = activateUserData[0];        
        return (!paralegalAttoryId.includes(props?.loggedInUserRoleId)) && isEmailVerified;
    } else {
        return false;
    }
  }

  const fectchsubjectForFormLabelId = async () => {
    let formlabelData = {}
    useLoader(true)
    let resultsubjectlabel = await postApiCall('POST', $Service_Url.getsubjectForFormLabelId, preferredContactMethod);
    if (resultsubjectlabel == 'err') return;
    for (let obj of resultsubjectlabel.data.data) {
      let label = "label" + obj.formLabelId;
      formlabelData[label] = obj.question;
      let result = await getApiCall('GET', $Service_Url.getSubjectResponse + props?.userId + `/0/0/${formlabelData[label].questionId}`, null);
      if (result !== 'err' && result?.userSubjects?.length != 0) {
        let responseData = result?.userSubjects;
        if (result !== 'err' && result?.userSubjects?.length != 0) {
          for (let i = 0; i < formlabelData[label].response.length; i++) {
            for (let j = 0; j < responseData.length; j++) {
              if (formlabelData[label].response[i].responseId === responseData[j].responseId) {
                if (responseData[j].responseNature == "Text") {
                  if (responseData[j].questionId == "241") {
                    formlabelData[label].response[i]["userSubjectDataId"] = responseData[j].userSubjectDataId;
                    formlabelData[label].response[i]["response"] = responseData[j].response;
                  }
                }
              }

            }

          }
        }
      }

    }
    useLoader(false)
    setCommMediumChennel(formlabelData?.label1037?.response?.[0]?.response)
    setFormlabelData(formlabelData)
  }
  const QuestionAndAnswerInput = (formLabelDatawithlabel, name, withlabel) => {
    return (
      <>
        <Row className="mb-3">
          <Col xs={12} md={12}>
            <CustomSelect
              isError=''
              label="Preferred contact method"
              placeholder={(formLabelDatawithlabel && formLabelDatawithlabel.question)}
              options={commMedium}
              onChange={(e) => handleLabelSelection(e, formLabelDatawithlabel)}
              value={commMediumChennel}

            />
          </Col>
        </Row>
      </>
    )
  }

    /// functions for Preferred contact method //////////////////////
  const handleLabelSelection = (event, formLabelDatawithlabel) => {
    const eventId = event.value;
    setCommMediumChennel(eventId)
    const questionId = formLabelDatawithlabel?.questionId;
    const userSubjectDataId = formLabelDatawithlabel?.response.length > 0 && formLabelDatawithlabel?.response[0]?.userSubjectDataId ? formLabelDatawithlabel?.response[0]?.userSubjectDataId : 0;

    handleUpdateSubmitSeconde(userSubjectDataId, eventId, questionId, formLabelDatawithlabel);



  };
  const handleUpdateSubmitSeconde = async (userSubjectDataId, eventId, questionId, formLabelDatawithlabel) => {
    let isUpdate = formLabelDatawithlabel?.response.some(ele => ele?.userSubjectDataId && ele?.userSubjectDataId !== 0)
    if (isUpdate == true) {
      let updateJson = {
        "userId": props?.userId,
        "userSubjects": [
          {
            "userSubjectDataId": userSubjectDataId,
            "subjectId": questionId,
            "subResponseData": eventId,
            "responseId": formLabelDatawithlabel?.response.length > 0 && formLabelDatawithlabel?.response[0]?.responseId
          }
        ]
      }
      setcommMediumPutPostJson(updateJson)
    } else {
      let json = [
        {
          "userSubjectDataId": userSubjectDataId,
          "subjectId": questionId,
          "subResponseData": eventId,
          "responseId": formLabelDatawithlabel?.response.length > 0 && formLabelDatawithlabel?.response[0]?.responseId,
          "userId": props?.userId
        }
      ]
      setcommMediumPutPostJson(json)

    }



  };
  const addResponse = async (json) => {
    useLoader(true)
    const _resultPostSubjectData = await postApiCall("POST", $Service_Url.postaddusersubjectdata, json)
    if (_resultPostSubjectData !== "err") {
      fectchsubjectForFormLabelId()

    } else {

    }
    useLoader(false)

  }
  const updateResponse = async (json) => {
    useLoader(true)
    const _resultPutSubjectData = await postApiCall("PUT", $Service_Url.putSubjectResponse, json);
    if (_resultPutSubjectData !== "err") {
      fectchsubjectForFormLabelId()
    } else {

    }
    useLoader(false)
  }
  const handleOpenModal = () => {
    setisModal(false)
    closeModal()
  }
  const sentEmailText = () => {
    sentTextNMail(occurenceUrl)
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default keypress behavior for Tab and Enter keys
    }
  }
    //////// reactivationmail flow and functions
  const SendActivationMailFunc = async () => {
    useLoader(true)
    const _resultClientData = await getApiCall2('GET', $Service_Url.getUserDetailsByUserEmailId + `?emailId=${email}`);
    if (_resultClientData == 'err') useLoader(false);
    if (_resultClientData == 'err' && _resultClientData.data.length < 0) return;
    const { signUpPlatform, id, userId } = _resultClientData?.data[0];
    let notifiy = await getSMSNotificationPermissions("a9024bf2-f31b-4b8b-85dd-000fff9365f6", setIsClientPermissions);
    const jsonUserActivation = { "userRegstrtnId": id, "userId": userId, "signUpPlatform": signUpPlatform, "createdBy": loggedInUserId, "clientIPAddress": "::1" }
    if (notifiy == 'err') useLoader(false);
    const _resultGetActivationLink = await postApiCall('POST', $Service_Url.getUserActivationLink, jsonUserActivation);
    useLoader(false)
    setOccurenceUrl(_resultGetActivationLink?.data?.data?.activationURL)
    setisModal(true)


  }
  const sentTextNMail = async (url) => {

    const { textTemplateType, textTemplateId } = textTmpObj.textTempData[0]
    const { templateType, emailSubject, templateId } = emailTmpObj?.emailTempData[0];
    const emailTo = email;
    let textTo = mobileNumber;
    if (isClientPermissions != true) {
      textTo = ''
    }
    const emailJson = createSentEmailJsonForOccurrene({
      emailType: templateType,
      emailTo: emailTo,
      emailSubject,
      emailContent: replaceTemplate(emailTmpObj.emailTemp, url),
      emailTemplateId: templateId,
      emailMappingTablePKId: loggedInUserId,
      emailStatusId: 1,
      emailMappingTablePKId: loggedInUserId,
      createdBy: loggedInUserId,
    })
    const textJson = createSentTextJsonForOccurrene({
      smsType: textTemplateType,
      textTo: textTo,
      textContent: replaceTemplate(textTmpObj.textTemp, url),
      smsTemplateId: textTemplateId,
      smsMappingTablePKId: loggedInUserId,
      smsStatusId: 1,
      smsMappingTablePKId: loggedInUserId,
      createdBy: loggedInUserId,

    });

    useLoader(true)
    const _resultSentEmailtext = await sentMail(emailJson, textJson);
    useLoader(false)
    if (_resultSentEmailtext == 'resolve') {
      const message = `Email ${commChannelId == 3 ? "and Text " : ''}Sent Successfully.`;
      setWarning("successfully", message)
      if (buttonType == "save") {
        // dispatch(fetchUserContactData(userId))
        closeModal()

      } else if (buttonType == "addAnother") {
        setMobileNumber('')
        setEmail('')
        setContactTypes('')
      }
    }

  }
  const replaceTemplate = (temp, url) => {
    let TemplateContent = temp;
    const uniqueLink = occurenceUrl;
    TemplateContent = TemplateContent.replace("@@SUBTENANTNAME", _subtenantName);
    TemplateContent = TemplateContent.replace("@@ACTIVATE_LINK", uniqueLink);
    TemplateContent = TemplateContent.replace("@@ACTIVATE_LINK", uniqueLink);
    TemplateContent = TemplateContent.replace("@@USER", primaryMemberFullName);
    TemplateContent = TemplateContent.replace("@@OLDEMAILADDRESS", props?.editJsonData?.email?.emailId);
    TemplateContent = TemplateContent.replace("@@NEWEMAILADDRESS", email);

    return TemplateContent;
  }
    //////////////////////////////////////
    const Professionalabel = ['professional','Non-Retirement',"BusinessIntrests","Liabilities"].includes(props?.refrencePage) ? "Suite" : "Apt/Suite/Unit/Building/Floor etc."

  return (
      <>
        {props?.show && (
           <>
           <div id="newModal" className='modals'>
            <div className="modal" style={{ display: 'block'}}>
            <div className="modal-dialog costumModal" style={{ maxWidth: '500px', margin: 'auto' }}>
              <div className="costumModal-content">
                <div className="modal-header mt-3 ms-1">
                  <h5 className="modal-title">{props?.header}</h5>
                  <img className='mt-0 me-1'onClick={()=>closeModal()} src='/icons/closeIcon.svg'></img>
                </div>
                <div className="costumModal-body">
                   {props?.modalType == "address" ? <>
                    <div style={{ maxHeight: "35rem", overflowY: "auto", overflowX: "hidden",padding:'1rem'}}>
                      <Row id='Personal-Details'>

                        <Col xs={12} md={12}>
                          {props.refrencePage !== "professional" && <Row className="spacingBottom">
                            <Col xs={12} md={12}>
                              <CustomSelect tabIndex={startingTabIndex + 1} isPersonalMedical={true} isError='' label="Address Type*" placeholder='Select' options={filteredAddressType(addressType, addressTypes)} onChange={(e) => handleSelectChange(e, 'addressType')}
                                value={addressTypes} isDisable={props?.refrencePage == "beneficiaryTable" ? true : false} />
                              {(errMsg.addressTypeErr) && <><span className="err-msg-show">{errMsg.addressTypeErr}</span></>}
                            </Col>
                          </Row>}
                          {addressTypes == "999999" &&
                            <Row className=" spacingBottom">
                              <Col xs={12} md={12}>
                                <Other tabIndex={startingTabIndex +  2} isPersonalMedical={true} othersCategoryId={2} userId={props?.userId} dropValue={addressTypes} ref={addressRef} natureId={natureId} notCapital={true}/>
                              </Col>
                            </Row>}
                          <Row className=" spacingBottom">
                            <Col xs={12} md={12}>
                              <div id='custom-input-field full-width' className="custom-input-field full-width">
                                {$AHelper.$isNotNullUndefine("Address") && <p>{"Address*"}</p>}
                                <input tabIndex={startingTabIndex + 3} label="Address" onBlur={setAddressLine1Data} type='text' placeholder="Street address or P.O Box" id='addressLine1'
                                  ref={searchInput} defaultValue={addressLine1} onChange={(e) => autoCompleteAddress(e, "addressLine1")} />
                                {(errMsg.addressLine1Err) && <><span className="err-msg-show">{errMsg.addressLine1Err}</span></>}
                              </div>
                            </Col>
                          </Row>

                          <Row className="spacingBottom">
                            <Col xs={12} md={12}>
                              <CustomInput tabIndex={startingTabIndex +  4} isPersonalMedical={true} label="Country / Region*" placeholder="Enter country." id='country' notCapital={true}
                                value={country} onChange={(val) => handleInputChange(val, 'country')} />
                              {(errMsg.countryErr) && <><span className="err-msg-show">{errMsg.countryErr}</span></>}
                            </Col>
                          </Row>
                          {/* <Row className="spacingBottom">
                            <Col xs={12} md={12}>
                              <CustomSelect tabIndex={startingTabIndex +  5} isPersonalMedical={true} isError='' label="County Refrence" placeholder='Select'
                                options={countyRef} onChange={(e) => handleSelectChange(e, 'countyRefrence')} value={countyRefrence} />
                              {(errMsg.countyRefrenceErr) && <><span className="err-msg-show">{errMsg.countyRefrenceErr}</span></>}
                            </Col>
                          </Row> */}
                          {/* <Row className="spacingBottom">
                            <Col xs={12} md={12}>
                              <CustomInput tabIndex={ startingTabIndex + 6} isPersonalMedical={true} label="County" placeholder="Enter county" id='county' notCapital={true} value={county} onChange={(val) => handleInputChange(val, 'county')} />
                              {(errMsg.countyErr) && <><span className="err-msg-show">{errMsg.countyErr}</span></>}
                            </Col>
                          </Row> */}

                          <Row className="spacingBottom">
                            <Col xs={12} md={12}>
                            <CustomInput tabIndex={ startingTabIndex + 7} isPersonalMedical={true} label={Professionalabel} placeholder={Professionalabel} id='apt' notCapital={true} value={apt}
                                onChange={(val) => handleInputChange(val, 'apt')} />
                              {(errMsg.aptErr) && <><span className="err-msg-show">{errMsg.aptErr}</span></>}
                            </Col>

                          </Row>
                          <Row className="spacingBottom">
                            <Col xs={12} md={12}>
                              <CustomInput
                                tabIndex={startingTabIndex +  8}
                                isPersonalMedical={true}
                                label="City*"
                                placeholder="Enter city"
                                id='city'
                                value={city}
                                notCapital={true}
                                onChange={(val) => handleInputChange(val, 'city')}
                              />
                              {(errMsg.cityErr) && <><span className="err-msg-show">{errMsg.cityErr}</span></>}
                            </Col>

                          </Row>
                          <Row className="spacingBottom">
                            <Col xs={12} md={12}>
                              <CustomInput
                                tabIndex={startingTabIndex +  9}
                                isPersonalMedical={true}
                                label="State*"
                                placeholder="Enter state"
                                id='state'
                                value={state}
                                notCapital={true}
                                onChange={(val) => handleInputChange(val, 'state')}
                              />
                              {(errMsg.stateErr) && <><span className="err-msg-show">{errMsg.stateErr}</span></>}
                            </Col>
                          </Row>

                          <Row className="spacingBottom">
                            <Col xs={12} md={12}>
                              <CustomInput
                                tabIndex={startingTabIndex +  10}
                                isPersonalMedical={true}
                                label="Postal Code*"
                                placeholder="Zip / postal code"
                                id='zipCode'
                                value={zipcode}
                                onChange={(val) => handleInputChange(val, 'zipcode')}
                              />
                              {(errMsg.zipcodeErr) && <><span className="err-msg-show">{errMsg.zipcodeErr}</span></>}
                            </Col>


                          </Row>
                        </Col>
                      </Row>
                    </div>
                  
                        </> : <>
                                            <Row>
                                                <Col xs={12} md={12}>
                                                    <Row className="spacingBottom">
                                                        <Col xs={12} md={12}>
                                                            <CustomSelect
                                                                tabIndex={startingTabIndex + 11}
                                                                isPersonalMedical={true}
                                                                isError=''
                                                                label="Contact Type"
                                                                placeholder='Select'
                                                                options={filteredContactTypes(contactType,contactTypes)}
                                                                onChange={(e) => handleSelectChange(e, 'contactType')}
                                                                value={contactTypes}
                                                                isDisable = {props?.refrencePage == "beneficiaryTable" || ($AHelper?.$isNotNullUndefine(props?.editJsonData) && (props?.editJsonData?.email?.contactType == "Primary" || props?.editJsonData?.mobile?.contactType == "Primary" || props?.refrencePage == "Liabilities" || props?.refrencePage == "transportation"))}
  
                                                            />
                                                            {(errMsg.contactTypeErr) && <><span className="err-msg-show">{errMsg.contactTypeErr}</span></>}
                                                        </Col>
  
                                                    </Row>
                                                    {contactTypes == "999999" &&
                                                    <Row className="spacingBottom">
                                                        <Col xs={12} md={12}>
                                                         <CustomInput
                                                          tabIndex={startingTabIndex +  12}
                                                          isPersonalMedical={true}
                                                          label="Other"
                                                          placeholder='Other Description'
                                                          notCapital={true}
                                                          id='other'
                                                          value={otherContact}
                                                          onChange={(val) => handleInputChange(val, 'other')}
                                                         />
  
                                                        </Col>
  
                                                    </Row>}
                                                    {/* <Row className="mt-1">
                                                        <Col xs={12} md={12}>
                                                            <CustomSelect
                                                                isError=''
                                                                label="Communication Type"
                                                                placeholder='Select'
                                                                options={comType}
                                                                onChange={(e) => handleSelectChange(e, 'comeType')}
                                                                value={comeTypes}
  
                                                            />
                                                            {(errMsg?.comeTypeErr) && <><span className="err-msg-show">{errMsg?.comeTypeErr}</span></>}
                                                        </Col>
  
                                                    </Row> */}
                                                    <Row className="spacingBottom">
                                                        <Col xs={12} md={12}>
                                                            <ContactRezex startTabIndex={startingTabIndex +  13} isPersonalMedical={true} setValue={setMobileNumber} mobileNumber={mobileNumber} hideErrMsg={hideErrMsg} errMsg={errMsg} countryCode={countryCode} setcountryCode={setcountryCode} comType={comType} handleSelectChange={handleSelectChange} comeTypes={comeTypes}/>
                                                          {(errMsg.mobileErr) &&  <><span className="err-msg-show">{errMsg.mobileErr}</span></>}
                                                          {(errMsg?.comeTypeErr) && <><span className="err-msg-show">{errMsg?.comeTypeErr}</span></>}
                                                        </Col>
  
                                                    </Row>
                                                    
                                                    <Row className="spacingBottom">
                                                        <Col xs={12} md={12} >
                                                            <CustomInput
                                                                tabIndex={ startingTabIndex + 13 + 2}
                                                                isPersonalMedical={true}
                                                                label="Email"
                                                                placeholder='i.e johnoe@gmail.com'
                                                                id='email'
                                                                isSmall={true}
                                                                value={email}
                                                                onChange={(val) => handleInputChange(val, 'email')}
                                                                isDisable={$AHelper?.$isNotNullUndefine(props?.editJsonData) && isEditShow(props?.editJsonData)}
                                                            />
                                                            {(errMsg.emailErr) && <><span className="err-msg-show">{errMsg.emailErr}</span></>}
                                                        </Col>
                                                    </Row>
                                                    {props?.userId == primaryUserId && contactTypes == 1 && !paralegalAttoryId.includes(props?.loggedInUserRoleId) &&                                                  
                                                    $AHelper.$isNotNullUndefine(formlabelData) && formlabelData?.label1037 &&
                                                      QuestionAndAnswerInput(formlabelData?.label1037, 'stylehomeSub', 'label1037')
                                                     }
                                                </Col>
  
                                            </Row>
  
                        </>}
               </div>
                <div className="modal-footer">         
                  {!$AHelper?.$isNotNullUndefine(props?.editJsonData) && props?.refrencePage != "beneficiaryTable" && 
                  <button tabIndex={startingTabIndex + 13 + 2 + 1} className='btn-btn' onClick={()=>handleClick("addAnother")}>Save & Add Another {props?.modalType}</button>}
                  <CustomButton 
                  tabIndex={startingTabIndex + 13 + 2 + 1 + 1}
                  onClick={()=>handleClick("save")} 
                  label={$AHelper?.$isNotNullUndefine(props?.editJsonData) ?"Update" : "Save"}
                  />
                </div>
              </div>
            </div>
          </div>
           </div>  
            {isModal &&  <>
              <CustomModal
                    open={isModal}
                    handleOpenModal={handleOpenModal}
                    header={'Preview Invite Template'}
                    size='lg'
                    backClick={() => console.log('backClick')}
                    refrencePage='InviteSpouse'
                    sentBtnClick={sentEmailText}
    
                >
                    <div style={{ minHeight: "50vh", maxHeight: "60vh", height: "100vh", overflowX: "none", overflowY: "scroll" }} className="">
                        <div className="position-relative" style={{ pointerEvents: "none" }} onKeyDown={handleKeyDown}>
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: replaceTemplate(emailTmpObj?.emailTemp) }} id="emailtemplate" contentEditable="false" className="p-0 m-0" />
                            </div>
                            <div className='mt-0 m-5'>
                                <div dangerouslySetInnerHTML={{ __html: replaceTemplate(textTmpObj?.textTemp) }} id="emailtemplate" contentEditable="false" className="p-0 m-0" />
                            </div>
                        </div>
                    </div>
    
    
    
                </CustomModal>
            </>} 
          </>
        )}
       
      
  
      </>
    );
  };


const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
      dispatch({
          type: SET_LOADER,
          payload: loader,
      }),
});
export default connect("", mapDispatchToProps)(withOccurrenceApi(ReusableAddressContact,34, 'ContactOccurrence'));

//////// FUNCTION FOR SEPRATE COUNTRYCODE AND MOBILE NUMBER


export function separateCountryCodeAndNumber(phoneNumber) {
  // Sanitize the phone number by removing unwanted characters except for digits, plus sign, and hyphens
  const sanitizedNumber = phoneNumber?.replace(/[\s()]+/g, '')?.replace(/[^\d+-]/g, '');

  // Regex pattern to match the country code, area code (optional), and local number
 
  const regexWithAreaCode = /^(\+\d{1,3})-(\d{1,3})(\d{6,15})$/;  // With area code
  const regexWithoutAreaCode = /^(\+\d{1,4})(\d{10})$/;;           // Without area code

  // Match the sanitized phone number against both patterns

  let match = sanitizedNumber?.match(regexWithAreaCode);
  if (match) {
    const countryCode = match[1]; // Country code (e.g., +1)
    const areaCode = match[2];    // Area code (e.g., 684)
    const number = match[3];      // Remaining number (e.g., 8776786786)
    return { countryCode: `${countryCode}-${areaCode}`, number};
  }

  // Check without area code if the area code is not present
  match = sanitizedNumber?.match(regexWithoutAreaCode);
  if (match) {
    const countryCode = match[1]; // Country code (e.g., +91)
    const number = match[2];      // Remaining number (e.g., 7656567576)
    return { countryCode, number};
  }
  // If the phone number doesn't match the expected format, return null
  return null;
}

export function separateCountryCodeAndNumberCharity(phoneNumber) {
  // Sanitize the phone number by removing unwanted characters except for digits, plus sign, and hyphens
  const sanitizedNumber = phoneNumber?.replace(/[\s()]+/g, '')?.replace(/[^\d+-]/g, '');

  // Regex pattern to match the country code, area code (optional), and local number
 
  const regexWithAreaCode = /^(\+\d{1,3})-(\d{1,3})(\d{6,15})$/;  // With area code
  const regexWithoutAreaCode = /^(\+\d{1,4})(\d{10})$/;;           // Without area code

  // Match the sanitized phone number against both patterns

  let match = sanitizedNumber?.match(regexWithAreaCode);
  if (match) {
    const countrycode = match[1]; // Country code (e.g., +1)
    const areaCode = match[2];    // Area code (e.g., 684)
    const number = match[3];      // Remaining number (e.g., 8776786786)
    return { countrycode: `${countrycode}-${areaCode}`, number};
  }

  // Check without area code if the area code is not present
  match = sanitizedNumber?.match(regexWithoutAreaCode);
  if (match) {
    const countrycode = match[1]; // Country code (e.g., +91)
    const number = match[2];      // Remaining number (e.g., 7656567576)
    return { countrycode, number};
  }
  // If the phone number doesn't match the expected format, return null
  return null;
}
