import React, { useState, useRef, useContext, useLayoutEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import HeaderActivation from './HeaderActivation';
import { useEffect } from 'react';
import Router from "next/router";
import { $CommonServiceFn } from '../network/Service';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "react-phone-input-2/lib/bootstrap.css";
import { $Service_Url } from '../network/UrlPath';
import { $AHelper, initMapScript } from '../control/AHelper';
import konsole from '../control/Konsole';
import { Msg } from '../control/Msg';
import DatepickerComponent from '../DatepickerComponent';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from 'react-redux';
import { logoutUrl, paralegalAttoryId } from '../control/Constant';
import { globalContext } from '../../pages/_app';
import MatNumber from '../MatNumber';
import ReferedBy from '../ReferedBy';
import Select from "react-select";
import { deceaseMemberStatusId, postApiCall, deceaseSpouseRelationId, isNullUndefine,isValidateNullUndefine, isNotValidNullUndefile, removeSpaceAtStart } from '../Reusable/ReusableCom';

const personalInfoObj = () => {
  return { fName: '', mName: "", lName: "", dob: '', noOfchildren: '', primaryPhone: '', primaryEmail: '', maritalStatusId: '0', genderId: '0', citizenshipId: '187', matNo: "" }
}
const spouseInfoObj = () => {
  return { spousefName: '', spousemName: "", spouselName: "", spousedob: '', dateOfDeath: "", spouseGender: '0', spouseCitizenShip: '187', createdBy: '', addressTypeId: '1' }
}
const addressInfoObj = () => {
  return { addressLine1: "", addressLine2: "", zipcode: "", city: "", state: "", country: "", county: "", country: "", streetAddress: '' }
}
const newObj = () => {
  return { contactTypeId: 1, emailId: "", mobileNo: "", commTypeId: 1, createdBy: "", updatedBy: "", contactId: "", dialCode: "", contactId: "" }
}

const ActivationformCom = (props) => {
  const inputSearchaddressRef = useRef(null)
  const { setdata } = useContext(globalContext)
  const context = useContext(globalContext)
  const subtenantId = sessionStorage.getItem("SubtenantId")

  const [personalInfo, setpersonalinfo] = useState({ ...personalInfoObj() })
  const [spouseInfo, setspouseInfo] = useState({ ...spouseInfoObj() })
  const [addressInfo, setaddressInfo] = useState({ ...addressInfoObj() })
  const loginUserId = sessionStorage.getItem("loggedUserId");
  const logUser = { createdBy: loginUserId, updatedBy: loginUserId };
  const [mobileObj, manageMobileObj] = useState({ ...newObj(), ...logUser });
  const [sameAsprimaryAddress, setSamePrimaryAddress] = useState(false)
  const [countryCode, setcountryCode] = useState("+1");
  const [disableCountryGuessState, setdisableCountryGuessState] = useState(true);

  const [gendersDetail, setGendersDetail] = useState([])
  const [maritalDetail, setMaritalDetail] = useState([])
  const [citizenShipTypeDetail, setCitizenShipTypeDetail] = useState([])
  const [userId, setUserId] = useState('')
  const [loggedInId, setloggedInId] = useState('')
  const childRef = useRef(null);
  const [spouseUserId, setspouseUserId] = useState('')
  const [activityTypeId, setactivityTypeId] = useState('4');
  const dobBorderChange = { borderRadius: "0.375rem", }
  const [countyRef, setContyRef] = useState([])
  const [countyRefId, setCountyRefId] = useState(null)
  const [loggedRoleId, setLoggedRoleId] = useState('')


  //predefine functions--------------------------------------------------------------------------------------------------------------------------------------------------

  let userLoggedInDetail = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'))
  useEffect(() => {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let loggedInUser = sessionStorage.getItem("loggedUserId") || "";
    let spouseUserId = sessionStorage.getItem("spouseUserId") || "";
    let loggedRoleId = JSON.parse(sessionStorage.getItem('stateObj'))?.roleId;

    setUserId(newuserid)
    setLoggedRoleId(loggedRoleId)
    setloggedInId(loggedInUser)
    setspouseUserId(spouseUserId)
    fetchMemberDetailsById(newuserid)
    getcontactdeailswithOther(newuserid)
    fetchApiData($Service_Url.getGenderListPath, setGendersDetail);
    fetchApiData($Service_Url.getMaritalStatusPath, setMaritalDetail);
    fetchApiData($Service_Url.getCitizenshipType, setCitizenShipTypeDetail);
    getCountyRef()
  }, [])

  //predefine functions--------------------------------------------------------------------------------------------------------------------------------------------------

  const fetchApiData = (path, stateSetter) => {
    $CommonServiceFn.InvokeCommonApi('GET', path, '', (res, err) => {
      if (res) stateSetter(res?.data?.data);
    });
  };

  const getCountyRef = () => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getCountyRef, "", (res, err) => {
      if (res) {
        // konsole.log("resrgetCountyrefes", res.data.data);
        setContyRef(res?.data?.data)
      }
      else {
        setContyRef([]);
      }
    }
    );
  }

  //GET SAVE VALUEES --------------------------------------------------------------------------------------------------------------------------------------------------

  const fetchMemberDetailsById = (userId) => {
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getFamilyMemberbyID + userId, "", (response, error) => {
      props.dispatchloader(false)
      if (response) {
        konsole.log('getFamilyMemberbyID', response)
        let responseData = response?.data?.data?.member
        setspouseInfo(prev => ({ ...prev, ['spouselName']: responseData.lName }));
        setpersonalinfo({ ...personalInfo, ...responseData, updatedBy: loggedInId, citizenshipId: 187 })
          (responseData.maritalStatusId == 1 || responseData.maritalStatusId == 2) && fetchSpouseDetailsByIdSpouse(responseData?.spouseUserId);
        konsole.log('responseData', responseData)
      } else {
        konsole.log('getFamilyMemberbyID', error)
      }
    })
  }
  const fetchSpouseDetailsByIdSpouse = (userId) => {
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getFamilyMemberbyID + userId, "", (response, error) => {
      props.dispatchloader(false)
      if (response) {
        konsole.log('getFamilyMemberbyID', response)
        let responseData = response?.data?.data?.member
        let { fName, mName, lName, dob, citizenshipId, genderId, dateOfDeath } = responseData
        setspouseInfo(prevSpouseInfo => ({
          ...prevSpouseInfo, spousefName: fName || '', spousemName: mName || '', spouselName: lName || '', spousedob: dob || '', spouseGender: genderId || '0', spouseCitizenShip: citizenshipId || '187', dateOfDeath: dateOfDeath || ''
        }));
        konsole.log('responseData', responseData)
      } else {
        konsole.log('getFamilyMemberbyID', error)
      }
    })
  }


  const getcontactdeailswithOther = (userId) => {
    konsole.log("USERIDUSERID", userId)
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getcontactdeailswithOther + userId, "", (response, error) => {
      if (response) {
        konsole.log("getcontactdeailswithOtherres", response)
        let responseData = response?.data?.data
        let contactdetails = responseData?.contact
        let mobileObjj = contactdetails?.mobiles?.filter(item => item?.contactTypeId == 1)
        konsole.log('mobileObjjmobileObjj', mobileObjj)
        if (mobileObjj?.length) setdisableCountryGuessState(false);
        manageMobileObj({ ...mobileObj, ...mobileObjj[0], updatedBy: mobileObj.updatedBy })
      } else {
        konsole.log("getcontactdeailswithOthererr", response)
      }
    })
  }

  //address functions-----------------------------------------------------------------------------------------------------------------------------------------------------

  const onKeyEnter = (e) => {
    if (e && e.key === "Enter") {
      initMapScript().then(() => initAutoComplete());
      setaddressInfo(prev => ({
        ...prev,
        addressLine1: inputSearchaddressRef.current.value
      }));
    }
  };

  const onhandleChangeAddress = (e) => {

    initMapScript().then(() => initAutoComplete());
    setaddressInfo(prev => ({
      ...prev,
      addressLine1: inputSearchaddressRef.current.value
    }));
    if (inputSearchaddressRef.current.value !== "") {
      if (inputSearchaddressRef.current.value > 0) {
        // Handle the case when the input value is greater than 0
      }
    }

  };

  const initAutoComplete = () => {
    if (!inputSearchaddressRef.current) return;
    const autocomplete = new window.google.maps.places.Autocomplete(inputSearchaddressRef.current);
    console.log("autocomplete", autocomplete)
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.addListener("place_changed", () =>
      onChangeAddress(autocomplete)
    );
  };

  const onChangeAddress = (autocomplete) => {
    const place = autocomplete.getPlace();
    const lat = place?.geometry?.location?.lat();
    const long = place?.geometry?.location?.lng();
    setAddressfun(extractAddress(place));
  };

  const extractAddress = (place) => {
    const address = {
      city: "",
      state: "",
      zip: "",
      country: "",
      county: "",
      unWanted: [],

      plain() {
        const city = this.city ? this.city + ", " : "";
        const zip = this.zip ? this.zip + ", " : "";
        const state = this.state ? this.state + ", " : "";
        const county = this.county ? this.county + ", " : "";
        return city + zip + state + this.country + county;
      },
    };

    if (!Array.isArray(place?.address_components)) {
      return address;
    }
    let postalCodeSuffix = "";
    let unWanted = ['USA', 'UK'];
    place.address_components.forEach((component) => {
      const value = component.long_name;
      const types = component.types;

      if (types.includes("locality")) {
        address.city = value;
        unWanted.push(component.long_name, component.short_name);
      }

      if (types.includes("administrative_area_level_1")) {
        address.state = value;
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
      if (types.includes("administrative_area_level_2")) {
        address.county = value;
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

  const formateAddressLine1 = (address) => {
    if(!address || !inputSearchaddressRef?.current?.value || !address.unWanted?.length) return address;

    const curAddressLine1 = inputSearchaddressRef?.current?.value;
    const firstCommaIndex = curAddressLine1.indexOf(',');
    if(firstCommaIndex == -1) {
      address.unWanted = undefined;
      return address;
    }

    konsole.log("address.unWanted", address.unWanted)

    let secondPartString = " " + curAddressLine1?.slice(firstCommaIndex) + " ";

    for(let i = 0; i < address.unWanted.length; i++) {
      const searchWord = new RegExp(`( |,)(${address.unWanted[i]})( |,)`, "g");
      secondPartString = secondPartString?.replace(searchWord, " ");
      // konsole.log('curAddressLine1\n' , "1st part:", curAddressLine1.slice(0, firstCommaIndex), "\nsecond part:", secondPartString, "\nregex:", searchWord);
    }

    let finalSecondPart = "";
    let lastChar = "";
    for(let i = 0; i < secondPartString.length; i++) {
      const curChar = secondPartString[i];
      if(curChar == " " || curChar == ",") {
        if(finalSecondPart.length == 0) continue;
        if(lastChar != " " && (lastChar != "," || curChar == " ")) finalSecondPart += curChar;
      } else {
        finalSecondPart += curChar;
      }
      // konsole.log("adbvh", finalSecondPart , "lastChar:(", lastChar, ")curChar:(", curChar, ")");
      lastChar = curChar;
    }

    if(finalSecondPart.length) {
      const lastIndexOfCom = finalSecondPart.lastIndexOf(",");
      if(finalSecondPart.length - lastIndexOfCom <= 2) finalSecondPart = finalSecondPart.slice(0, lastIndexOfCom);
      inputSearchaddressRef.current.value = curAddressLine1.slice(0, firstCommaIndex) + ", " + finalSecondPart;
    }
    else inputSearchaddressRef.current.value = curAddressLine1.slice(0, firstCommaIndex);
 
    address.unWanted = undefined;
    return address;
  }

  // const formateAddressLine1 = (address) => {
  //   if (!address || !address.addressLine1 || !address.unWanted?.length) return address;

  //   const splitedAddressLine1 = address.addressLine1.split(', ');
  //   // konsole.log('splitedAddressLine1' , splitedAddressLine1, address.unWanted);

  //   let finalAddressLine1 = '';
  //   splitedAddressLine1.forEach((word) => {
  //     // konsole.log('splitedAddressLine1CMP', word, address.unWanted.includes(word))
  //     if (!address.unWanted.includes(word)) finalAddressLine1 += word + ', ';
  //   })
  //   // konsole.log("splitedAddressLine1fin", finalAddressLine1.slice(0, -2));

  //   if (finalAddressLine1) address.addressLine1 = finalAddressLine1.slice(0, -2);
  //   address.unWanted = undefined;
  //   return address
  // }

  // const setAddressfun = (address) => {
  //   console.log(inputSearchaddressRef?.current?.value,"addressaddressaddressaddress")

  //   address["addressLine1"] = inputSearchaddressRef?.current?.value;
  //   formateAddressLine1(address)
  //   const addressInfoDet = {
  //     city: address?.city,
  //     county: address?.county,
  //     state: address?.state,
  //     zipcode: address?.zip,
  //     country: address?.country,
  //     addressLine2: "",
  //     // addressLine1: address?.addressLine1,
  //     addressLine1: inputSearchaddressRef?.current?.value.substring(0, inputSearchaddressRef?.current?.value.indexOf(",")),
  //     createdBy: loggedInId,
  //     streetAddress: inputSearchaddressRef?.current?.value.substring(0, inputSearchaddressRef?.current?.value.indexOf(",")),
  //     addressTypeId: 1
  //   };
  //   console.log("jghghghfhgdtrtdtrd",inputSearchaddressRef?.current?.value.substring(0, inputSearchaddressRef?.current?.value.indexOf(",")))
  //   inputSearchaddressRef.current.value = address?.addressLine1

  //   setaddressInfo({ ...addressInfoDet });
  // };

  const setAddressfun = (address) => {
    // Call formateAddressLine1 if needed
    formateAddressLine1(address);

    const addressLine = inputSearchaddressRef?.current?.value || ""; // Ensure input value is not null
    // const commaIndex = addressLine.indexOf(","); // Find the index of the comma
    // const addressLine1 = commaIndex !== -1 ? addressLine.substring(0, commaIndex) : addressLine; // Extract address line before comma


    const addressInfoDet = {
      city: address?.city || "",
      county: address?.county || "",
      state: address?.state || "",
      zipcode: address?.zip || "",
      country: address?.country || "",
      addressLine2: "",
      addressLine1: addressLine, // No need to trim here
      createdBy: loggedInId,
      streetAddress: addressLine, // Same as addressLine1 if they represent the same information
      addressTypeId: 1
    };

    // Update input value if needed
    if (inputSearchaddressRef && inputSearchaddressRef.current) {
      inputSearchaddressRef.current.value = addressLine;
    }

    setaddressInfo({ ...addressInfoDet });
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    handlepersonalInfo(name, value)
  }

  const handleSelect = (e, key) => {
    let { value } = e.target
    handlepersonalInfo(key, value)
  }
  const addresshandleChange = (e) => {
    const { name, value } = e.target;
    setaddressInfo(prev => ({ ...prev, [name]: value }));
  }

  const handlepersonalInfo = async (key, value) => {
    const eventIdsToCheck = ['fName', 'mName', 'lName', 'spousefName', 'spousemName', 'spouselName'];

    if (eventIdsToCheck.includes(key)) {
      let nameValue = $AHelper.capitalizeAllLetters(value);
      nameValue = removeSpaceAtStart(nameValue)
      if ($AHelper.isRegexForAll(nameValue)) {
        setpersonalinfo(prev => ({ ...prev, [key]: nameValue }));
        setspouseInfo(prev => ({ ...prev, [key]: nameValue }));
      } else {
        setpersonalinfo(prev => ({ ...prev, [key]: '' }));
        setspouseInfo(prev => ({ ...prev, [key]: '' }));
      }
      if (key == 'lName') {
        setspouseInfo(prev => ({ ...prev, ['spouselName']: nameValue }))
      }
    } else if (key === 'noOfChildren' && value.length !== 0) {
      if ($AHelper.isNumberRegex(value) && value.length <= 2) {
        if (value > 0) {
          setpersonalinfo(prev => ({ ...prev, [key]: value }));
          setspouseInfo(prev => ({ ...prev, [key]: value }));
        } else if (value > 10) {
          const ques = await context.confirm(true, 'Are you sure you would like to add more child', 'Confirmation');
          setpersonalinfo(prev => ({ ...prev, [key]: ques ? value : '' }));
        } else {
          toasterAlert('Please enter a valid number');
          setpersonalinfo(prev => ({ ...prev, [key]: '' }));
        }
      } else {
        toasterAlert('Please enter a valid number');
        setpersonalinfo(prev => ({ ...prev, [key]: '' }));
      }
    }
    else {
      const nameValue = $AHelper.capitalizeFirstLetter(value);
      setpersonalinfo(prev => ({ ...prev, [key]: nameValue }));
      setspouseInfo(prev => ({ ...prev, [key]: nameValue }));
    }
  };


  //validate function--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  const validate = () => {
    let errormsg = ''
    const mobiValidate = mobileObj?.mobileNo;

    if (isNullUndefine(personalInfo.fName)) {
      errormsg = "First name can't be blank";
    } else if (isNullUndefine(personalInfo.lName)) {
      errormsg = "Last name can't be blank";
    } else if (!personalInfo?.maritalStatusId) {
      errormsg = "Relationship status cannot be blank";
    } else if (!mobiValidate || mobiValidate == "" || mobiValidate.replace("+", "") == countryCode.replace("+", "")) {
      errormsg = "Mobile number cannot be blank";
    } else if ((personalInfo?.maritalStatusId == 1 || personalInfo?.maritalStatusId == 2 || personalInfo?.maritalStatusId == 4) && spouseInfo?.spousefName == '') {
      errormsg = "Spouse first name can't be blank";
    } else if (isNotValidNullUndefile(addressInfo?.addressLine1)) {
      if (isNullUndefine(addressInfo?.zipcode) || isNullUndefine(addressInfo?.country) || isNullUndefine(addressInfo?.city) || isNullUndefine(addressInfo?.state)) {
        errormsg = Msg?.msg03;
      }
    } else if (isNullUndefine(addressInfo?.addressLine1) && (isNotValidNullUndefile(addressInfo?.zipcode) || isNotValidNullUndefile(addressInfo?.country) || isNotValidNullUndefile(addressInfo?.city) || isNotValidNullUndefile(addressInfo?.state))) {
      errormsg = Msg?.msg03;
    }
    if (errormsg) {
      toasterAlert(errormsg);
      return false;
    }
    return true;
  };




  const formSubmit = () => {
    if (!validate()) return;
    let inputdata = { ...personalInfo };
    // konsole.log('inputdatainputdata', inputdata)
    // return;
    props.dispatchloader(true);
    // return;
    $CommonServiceFn.InvokeCommonApi('PUT', $Service_Url.putUpdateMember, inputdata, async (res, err) => {
      props.dispatchloader(false);
      if (res) {
        konsole.log('putUpdateMember', res);
        let responseData = res?.data?.data?.member;
        childRef.current.toggleVisibility();
        props.dispatchloader(true);
        mobileObj.mobileNo != '' && await saveContactDetails();
        addressInfo?.addressLine1 != '' && await saveAddressApi(responseData);
        // (responseData.maritalStatusId == 1 || responseData.maritalStatusId == 2) ? saveSpouseInfo(responseData) : (sessionStore(responseData, null), dashBoardRoute());
        if (responseData.maritalStatusId == 1 || responseData.maritalStatusId == 2) {
          saveSpouseInfo(responseData)
        } else if (responseData.maritalStatusId == 4) {
          // deceased spouse
          saveDeceaseSpouseInfo(responseData)
        } else {
          sessionStore(responseData, null),
            dashBoardRoute()
        }
        props.dispatchloader(false);
      } else {
        konsole.log('err');
        props.dispatchloader(false);
      }
    });
  };

  const saveSpouseInfo = (response) => {
    let { spousefName, spousemName, spouselName, spousedob, spouseGender, spouseCitizenShip } = spouseInfo;
    let jsonObj = {
      userId: response?.spouseUserId,
      fName: spousefName,
      mName: spousemName,
      lName: spouselName,
      genderId: spouseGender == 0 ? null : spouseGender,
      isPrimaryMember: false,
      maritalStatusId: null,
      citizenshipId: spouseCitizenShip,
      memberRelationship: response.memberRelationship,
      updatedBy: loggedInId,
    };
    if (spousedob !== null && spousedob !== "" && spousedob !== undefined) {
      jsonObj["dob"] = $AHelper.getFormattedDate(spousedob);
    }
    konsole.log('jsonObj', jsonObj);
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi('PUT', $Service_Url.putUpdateMember, jsonObj, (res, err) => {
      props.dispatchloader(false);
      if (res) {
        konsole.log('putUpdateMemberSPOUSE', res);
        let responseData = res?.data?.data?.member
        let mName = responseData.mName !== null && responseData.mName !== "" ? " " + responseData?.mName + " " : " ";
        let spouseName = responseData.fName + mName + responseData.lName;
        sessionStore(response, spouseName)
        // dashBoardRoute()

      } else {
        konsole.log('putUpdateMemberSPPOUSE', err);
      }
    });
  };

  const saveDeceaseSpouseInfo = async (response) => {

    const primaryMemberUserId = userId
    let { spousefName, spousemName, spouselName, dateOfDeath, spousedob, spouseGender, spouseCitizenShip } = spouseInfo;


    let deceaseSpouseInfo = {
      subtenantId: subtenantId,
      fName: spousefName,
      mName: spousemName,
      lName: spouselName,
      nickName: '',
      memberStatusId: deceaseMemberStatusId,// 2 for decease only
      maritalStatusId: '',
      noOfChildren: "0",
      dateOfDeath: dateOfDeath,
      memberRelationship: '',
      genderId: spouseGender == 0 ? null : spouseGender,
      suffixId: '',
      dob: spousedob,
      citizenshipId: spouseCitizenShip,
      birthPlace: '',
      isPrimaryMember: false,
      createdBy: loginUserId

    };

    const memberRelationshipJson = {
      primaryUserId: primaryMemberUserId,
      relationshipTypeId: deceaseSpouseRelationId,
      rltnTypeWithSpouseId: '',
      isFiduciary: false,
      isBeneficiary: false,
      relativeUserId: primaryMemberUserId,
      isEmergencyContact: false
    }

    let jsonObj = deceaseSpouseInfo
    jsonObj.memberRelationship = memberRelationshipJson

    konsole.log('jsonObjjsonObj', jsonObj)
    props.dispatchloader(true);
    let result = await postApiCall('POST', $Service_Url.postAddMember, jsonObj)
    konsole.log('result', result)
    props.dispatchloader(false);
    sessionStore(response, null)
  }

  function emailsOrmobilesjson() {
    const { contactTypeId, mobileNo, commTypeId, updatedBy, createdBy, contactId } = mobileObj;
    const newJson = { contactTypeId, mobileNo, commTypeId, createdBy, updatedBy, contactId };
    return [newJson];
  }


  async function saveContactDetails() {
    const method = mobileObj.contactId === "" ? 'POST' : 'PUT';
    const url = method === 'POST' ? $Service_Url.postAddContactWithOther : $Service_Url.updateContactWithOtherDetailsPath;
    const jsonobj = {
      "userId": userId,
      "activityTypeId": activityTypeId,
      "contact": {
        'mobiles': emailsOrmobilesjson()
      }
    };

    return new Promise((resolve, reject) => {
      props.dispatchloader(true)
      $CommonServiceFn.InvokeCommonApi(method, url, jsonobj, (res, err) => {
        props.dispatchloader(false)
        if (res) {
          konsole.log("apifuncallres", res);
          resolve('response', res);
        } else {
          konsole.log("apifuncallerr", err);
          resolve('reject', err);
        }
      });
    });
  }

  const sessionStore = (responseData, spouseName) => {
    const userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
    const mName = responseData.mName !== null && responseData.mName !== "" ? " " + responseData.mName + " " : " ";
    userDetailOfPrimary.memberName = responseData.fName + mName + responseData.lName;
    userDetailOfPrimary.usermob = responseData.fName + ' ' + responseData.lName;
    userDetailOfPrimary.spouseName = spouseName
    konsole.log('userDetailOfPrimary', userDetailOfPrimary)

    sessionStorage.setItem("userDetailOfPrimary", JSON.stringify(userDetailOfPrimary));
    if (responseData?.spouseUserId !== '00000000-0000-0000-0000-000000000000') {
      sessionStorage.setItem("spouseUserId", responseData?.spouseUserId);
    }
    if(responseData?.maritalStatusId) {
      sessionStorage.setItem("maritalStatusId", responseData?.maritalStatusId);
    }
    dashBoardRoute()
  }

  //AddressSAVEAPI--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  const saveAddressApi = (responseData) => {
    let { userId, spouseUserId } = responseData
    addressInfo['addressLine1'] = addressInfo?.streetAddress
    let jsonobj = {
      "userId": userId,
      "address": { ...addressInfo, addressTypeId: 1, createdBy: loggedInId, countyRefId: countyRefId, }
    }
    konsole.log("jsonobjjsonobjjsonobj", jsonobj)
    return new Promise((resolve, reject) => {
      props.dispatchloader(true)
      $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postAddAddress, jsonobj, (res, err) => {
        props.dispatchloader(false)
        if (res) {
          konsole.log('responseaddress', res)
          let addressId = res.data.data?.addresses[0]?.addressId
          if (sameAsprimaryAddress == true && (responseData.maritalStatusId == 1 || responseData.maritalStatusId == 2)) {
            let jsoObj2 = {
              userId: spouseUserId,
              addressId: addressId,
              sameAsUserId: userId,
              isActive: true,
              createdBy: loggedInId
            }
            props.dispatchloader(true)
            $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postMemberAddress, jsoObj2, (res, err) => {
              props.dispatchloader(false)
              if (res) {
                konsole.log('postMemberAddress', res)
                resolve('res')
              } else {
                konsole.log('postMemberAddress', err)
                resolve('err')
              }
            })
          } else {
            resolve('resolve')
          }
        } else {
          resolve('error')
        }
      })
    })
  }

  // ----------DASHBOARD REDIRECT----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  const dashBoardRoute = () => {
    sessionStorage.setItem('activateform', true)
    Router.push({
      pathname: './dashboard',
      search: '?query=' + userId,
      state: {
        userid: userId,
      }
    })
  }

  //MOBILE CONTACT------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const handleOnChange = (value, data, event, formattedValue) => {
    setdisableCountryGuessState(true);
    konsole.log("handleOnChange", value, value.slice(data.dialCode.length), data, formattedValue);
    setcountryCode(data?.dialCode);
    manageMobileObj((prev) => {
      return { ...prev, validateMobileNo: value.slice(data.dialCode.length), mobileNo: `+${value}`, dialCode: data.dialCode };
    });
  }
  const handleMobileChange = (key, value) => {
    manageMobileObj((prev) => { return { ...prev, [key]: value } });
  }
  const handleChildData = (data) => {
    handlepersonalInfo("matNo", data)
    // setMatNumber(data)
  };


  const handleDateBlur = (type) => {
    konsole.log('handleDateBlur', type, "handleDateBlur")
    var dob = new Date(spouseInfo?.spousedob);
    var dod = new Date(spouseInfo?.dateOfDeath);
    var isValid = dob <= dod;
    validateMaritalDate(personalInfo.maritalStatusId)
  }
  const isValidDateRange = (dateOfBirth, dateOfDeath) => {
    const dob = new Date(dateOfBirth);
    const dod = new Date(dateOfDeath);
    if (isNaN(dob) || isNaN(dod)) {
      return false;
    }
    return dob <= dod;
  };

  const validateMaritalDate = (maritalStatusId) => {
    const relationShipMinor = [1, 4, 5, 2]
    konsole.log('thisstatemaritalStatusId', personalInfo.maritalStatusId)
    const dateOfB = spouseInfo?.spousedob
    const dateOfD = spouseInfo?.dateOfDeath
    if (!isValidateNullUndefine(dateOfD) && !isValidateNullUndefine(dateOfB)) {
      let dateBirth = $AHelper.checkIFMinor(dateOfB)
      let dateDeath = $AHelper.checkIFMinor(dateOfD)
      const result = isValidDateRange(dateOfD, dateOfB)
      let calDate = dateBirth - dateDeath;
      konsole.log('abababa', calDate)
      if (relationShipMinor.includes(Number(maritalStatusId)) && calDate < 18) {
        toasterAlert("Kindly enter a valid date", "Warning")
        setspouseInfo((prev) => ({ ...prev, ['spousedob']: '' }))
        setspouseInfo((prev) => ({ ...prev, ['dateOfDeath']: '' }))
      } else if (result == true) {
        toasterAlert('Kindly enter a valid date', "Warning")
        setspouseInfo((prev) => ({ ...prev, ['spousedob']: '' }))
        setspouseInfo((prev) => ({ ...prev, ['dateOfDeath']: '' }))
      }
    }
  }

const signOfAstrict=()=>{
 return (isNotValidNullUndefile(addressInfo?.addressLine1))?'*':''
}
  konsole.log('addressInfo', addressInfo)
  konsole.log('personalInfo', personalInfo)
  konsole.log('spouseInfo', spouseInfo)
  // konsole.log("countyRefIdcountyRefId",countyRefId,countyRef)//
  //Konsole---------------------------------------------------------------------------------------------------------------------------------------------------------------------
  return (
    <>
      <HeaderActivation />
      <div className="active-form-class">
        <div className="container p-2  mt-4 shadow activation_form_main ">
          <div className='border p-0'>
            <div className=" ps-4 pe-4 pt-3">
              <div className="w-100 mb-1">
                <p className='mainheadings'>PERSONAL INFORMATION</p>
              </div>
              <div className='row'>
                <div className="col-lg-3 col-md-6 col-sm-6 p-2">
                  <SelectCom label="Marital Status" placeholder="Relationship Status*" value={personalInfo.maritalStatusId} selectData={maritalDetail} handleSelect={(e) => handleSelect(e, 'maritalStatusId')} />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 p-2">
                  <InputCom label="No. of Children" type="text" placeholder=" No of Children" name="noOfChildren" value={personalInfo?.noOfChildren} handleChange={handleChange} />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 p-2">
                  {/* <InputCom label="Primary Phone" type="text" placeholder="Primary Phone" name="primaryPhone" value={personalInfo.primaryPhone} handleChange={handleChange} /> */}
                  <Form.Group className=" d-flex"> <span className='astrisk'>*</span>
                    <PhoneInput className="react-tel-input  custom-input ml-0" regions={["america", "europe", "asia", "oceania", "africa"]} country="us" preferredCountries={["us"]} value={mobileObj?.mobileNo || "+1"} onChange={handleOnChange} specialOptionLabel={"Other"} placeholder="" name="mobileNo" onBlur={() => validateContact("mobile")} countryCodeEditable={false} disableCountryGuess={disableCountryGuessState} />
                  </Form.Group>

                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 p-2">
                  <InputCom label="Primary Email" type="text" placeholder="Primary Email" disable={true} name="primaryEmail" value={userLoggedInDetail?.primaryEmailId} handleChange={handleChange} />
                </div>
              </div>

            </div>
          </div>

          <div className="container-fluid p-0 mt-2">
            <div className="row">
              <div className="col">
                <div className="border px-3 py-2">
                  <p className='mainheadings mt-1 mb-1'>YOUR INFORMATION</p>
                  <InputCom label="First Name" type="text" placeholder="First Name*" name="fName" value={$AHelper.capitalizeAllLetters(personalInfo.fName)} handleChange={handleChange} />
                  <InputCom label="Middle Name" type="text" placeholder="Middle Name" name="mName" value={$AHelper.capitalizeAllLetters(personalInfo.mName)} handleChange={handleChange} />
                  <InputCom label="Last Name" type="text" placeholder=" Last Name*" name="lName" value={$AHelper.capitalizeAllLetters(personalInfo.lName)} handleChange={handleChange} />
                  {/* <p style={{ fontSize: '12px' }}><b>*Note:</b> First+Middle+Last = the full legal name that will appear on your documents</p> */}
                  <Form.Group className="mb-3" id='activeFormDOB'>
                    <DatepickerComponent placeholderText="D.O.B." value={personalInfo?.dob} maxDate={'16'} minDate="100" validDate={16} setValue={(e) => handlepersonalInfo('dob', e)} formname="activation_form" dobBorderChange={dobBorderChange} />
                  </Form.Group>
                  <SelectCom label="Gender" placeholder="Gender" value={personalInfo.genderId} selectData={gendersDetail} handleSelect={(e) => handleSelect(e, 'genderId')} />

                  <SelectCom label="Citizenship" placeholder="Citizenship" value={personalInfo.citizenshipId} selectData={citizenShipTypeDetail} handleSelect={(e) => handleSelect(e, 'citizenshipId')} />
                  <Row>

                    {(paralegalAttoryId.includes(loggedRoleId)) &&
                      <Col xs="12" sm="12" md="12" lg="5">
                        <MatNumber setMatNo={handleChildData} matNumber={personalInfo?.matNo} />
                      </Col>
                    }
                    <Col xs="12" sm="12" md="12" lg="7">
                      {userId && <ReferedBy memberUserid={userId} ref={childRef} setLoader={props.dispatchloader} />}
                    </Col>
                  </Row>

                </div>
              </div>

              <div className="col">
                <div className="border px-3 py-2">
                  <p className='mainheadings mt-1 mb-1'>ADDRESS INFORMATION</p>
                  <Form.Group className="mb-3">
                    <Form.Control type='text' className='custom-input' placeholder='Please Enter your full address...' defaultValue={addressInfo.addressLine1} onKeyDown={(e) => onKeyEnter(e)} onChange={() => onhandleChangeAddress()} ref={inputSearchaddressRef} />
                  </Form.Group>
                  {/* <InputCom label="Address Line 2" type="text" placeholder="Suite" name="addressLine2" value={addressInfo.addressLine2} handleChange={addresshandleChange} /> */}
                  <InputCom label="City" type="text" placeholder="Street Address" name="streetAddress" value={addressInfo.streetAddress} handleChange={addresshandleChange} />
                  <InputCom label="City" type="text" placeholder={`City${signOfAstrict()}`}name="city" value={addressInfo.city} handleChange={addresshandleChange} />
                  <InputCom label="State" type="text" placeholder={`State${signOfAstrict()}`} name="state" value={addressInfo.state} handleChange={addresshandleChange} />
                  <InputCom label="ZIP Code" type="text" placeholder={`Postal/Zip Code${signOfAstrict()}`} name="zipcode" value={addressInfo.zipcode} handleChange={addresshandleChange} />
                  <InputCom label="County" type="text" placeholder="County" name="county" value={addressInfo.county} handleChange={addresshandleChange} />
                  <div className='mb-3'>
                    <Form.Group className="mb-3">
                      <Form.Select
                        name="countyRefId"
                        id="countyRefId"
                        className='custom-input'
                        onChange={e => setCountyRefId(e?.target?.value)}
                      // value={countyRef?.some(ele => ele.value ==countyRefId)?.label}
                      >
                        <option value="0" disabled selected hidden >County reference</option>
                        {countyRef?.map((item, index) => (
                          <option key={index} value={item.value}>{item.label}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <InputCom label="Country" type="text" placeholder={`Country${signOfAstrict()}`} name="country" value={addressInfo.country} handleChange={addresshandleChange} />
                </div>
              </div>
              {(personalInfo.maritalStatusId == 1 || personalInfo.maritalStatusId == 2 || personalInfo.maritalStatusId == 4) &&
                <div className="col">
                  <div className="border p-3 mb-3 pb-0">

                    <p className='mainheadings'>{`${personalInfo.maritalStatusId == 2 ? "PARTNER INFORMATION" : "SPOUSE INFORMATION"}`}</p>
                    <InputCom label="First Name" type="text" placeholder="First Name*" name="spousefName" value={$AHelper.capitalizeAllLetters(spouseInfo.spousefName)} handleChange={handleChange} />
                    <InputCom label="Middle Name" type="text" placeholder=" Middle Name" name="spousemName" value={$AHelper.capitalizeAllLetters(spouseInfo.spousemName)} handleChange={handleChange} />
                    <InputCom label="Last Name" type="text" placeholder=" Last Name" name="spouselName" value={$AHelper.capitalizeAllLetters(spouseInfo.spouselName)} handleChange={handleChange} />
                    {/* <p style={{ fontSize: '12px' }}><b>*Note:</b> First+Middle+Last = the full legal name that will appear on your documents</p> */}
                    <Form.Group className="mb-3" id='activeFormDOB'>
                      <DatepickerComponent
                        placeholderText="D.O.B."
                        value={spouseInfo?.spousedob}
                        maxDate="16"
                        minDate="100"
                        validDate={16}
                        setValue={(e) => setspouseInfo((prev) => ({ ...prev, ['spousedob']: e }))}
                        handleOnBlurFocus={() => handleDateBlur('dob')}
                        formname="activation_form" />
                    </Form.Group>
                    {(personalInfo.maritalStatusId == 4) &&
                      <Form.Group className="mb-3 mt-3">
                        <DatepickerComponent
                          placeholderText="D.O.D."
                          handleOnBlurFocus={() => handleDateBlur('dateOfDeath')}
                          value={spouseInfo?.dateOfDeath}
                          minDate='100'
                          maxDate="31-12-9999"
                          setValue={(e) => setspouseInfo((prev) => ({ ...prev, ['dateOfDeath']: e }))}
                          formname="activation_form" />
                      </Form.Group>}

                    <SelectCom label="Gender" placeholder="Gender" selectData={gendersDetail} value={spouseInfo.spouseGender} handleSelect={(e) => handleSelect(e, 'spouseGender')} />
                    {personalInfo.maritalStatusId == 1 || personalInfo.maritalStatusId == 2 ? (
                      <SelectCom label="Citizenship" placeholder="Citizenship" selectData={citizenShipTypeDetail} value={spouseInfo.spouseCitizenShip} handleSelect={(e) => handleSelect(e, 'spouseCitizenShip')} />) : null}
                    {(personalInfo.maritalStatusId != 4) &&
                      <Form.Group className="ms-2 checkbox-group" style={{ marginTop: "30px" }}>
                        <Form.Check type="checkbox" label={<span className="custom-checkbox-label">Does your {`${personalInfo.maritalStatusId == 2 ? "partner" : "spouse"}`} live with you ?</span>} onChange={(e) => setSamePrimaryAddress(e.target.checked)} className="custom-checkbox" />
                      </Form.Group>
                    }
                  </div>
                </div>
              }
            </div>
            <div className='d-flex justify-content-end mt-2 '>
              <Button className='theme-btn ' onClick={() => formSubmit()}>Submit</Button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
  function validateContact(typeofSave) {
    let regexName = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    switch (typeofSave) {
      case "email":
        if (!regexName.test(emailObj?.emailId)) {
          // handleEmailChange("emailId", "");
          toasterAlert("Enter the valid EmailId");
          break;
        }
        break;
      case "mobile": {
        if (mobileObj?.validateMobileNo !== "" && ((mobileObj?.validateMobileNo?.length < 10 && mobileObj?.dialCode!=254) || (mobileObj?.validateMobileNo?.length < 9 && mobileObj?.dialCode==254))) {
          handleMobileChange("mobileNo", countryCode);
          handleMobileChange("validateMobileNo", "");
          toasterAlert("Enter the valid contact no.");
      }
    }

    
    }
  }

  function toasterAlert(text) {
    setdata({ open: true, text: text, type: "Warning" });
  }

};


const InputCom = ({ label, placeholder, name, type, value, handleChange, disable }) => {
  return (
    <Form.Group className="mb-3">
      {/* <Form.Label className="mb-1">{label}</Form.Label> */}
      <Form.Control type={type} placeholder={placeholder} name={name} value={value} onChange={handleChange} className='custom-input' disabled={disable} />
    </Form.Group>
  )
}

const SelectCom = ({ label, placeholder, selectData, value, handleSelect }) => {
  <option value="0" disabled selected hidden> {$AHelper.mandatory("Relationship Status")}</option>
  return (
    <Form.Group className="mb-3">
      {(placeholder == 'Citizenship') &&
        <Form.Label className="mb-1">{label}</Form.Label>}
      <Form.Select aria-label="Default select example" id="maritalStatusId" value={value} onChange={handleSelect} className='custom-input'>
        <option value="0" disabled selected hidden>{placeholder}</option>
        {selectData?.map((item, index) => (<option key={index} value={item.value}>  {item.label} </option>))}
      </Form.Select>
    </Form.Group>
  );
};



const mapStateToProps = (state) => ({ ...state.main });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivationformCom);