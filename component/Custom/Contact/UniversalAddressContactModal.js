import React, { useEffect, useState, useRef, useCallback, useImperativeHandle, dispatch, forwardRef, useMemo, useContext, } from 'react';
import { Form, Col, Row, Button, Table } from 'react-bootstrap';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { CustomSelect, CustomInput } from '../CustomComponent';
import { useAppSelector } from '../../Hooks/useRedux';
import { selectApi } from '../../Redux/Store/selectors';
import { $AHelper } from '../../Helper/$AHelper';
import { CustomButton } from '../CustomButton';
import { initMapScript } from '../../../components/control/AHelper';
import { fetchUniversalAddress, fetchContactType, fetchAddressType, fetchCountyRef, fetchComType, fetchComMediumType, fetchUserContactData } from '../../Redux/Reducers/apiSlice';
import { useDispatch } from 'react-redux';
import { useLoader } from '../../utils/utils';
import ContactRezex from './ContactRezex';
import { getApiCall, getApiCall2, postApiCallNew, postApiCall } from '../../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../../components/network/UrlPath';
import { $Msg_AddressDetails } from '../../Helper/$MsgHelper';
import { paralegalAttoryId, preferredContactMethod } from '../../../components/control/Constant';
import { fetchPrimaryMemberContactDetials } from '../../Redux/Reducers/personalSlice';
import { globalContext } from '../../../pages/_app';
import Other from '../../../components/asssets/Other';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { connect } from 'react-redux';
import { SET_LOADER } from '../../../components/Store/Actions/action';
import withOccurrenceApi from '../../../components/OccurrenceHoc/withOccurrenceApi';
import useUserIdHook from '../../../components/Reusable/useUserIdHook';
import CustomModal from '../CustomModal';
import { getSMSNotificationPermissions } from '../../../components/Reusable/ReusableCom';
import { createSentEmailJsonForOccurrene,createSentTextJsonForOccurrene } from '../../../components/control/Constant';


const UniversalAddressContactModal = ({ show, modalType, header, refrencePage, userId, editJsonData, loggedInUserRoleId, defaultAddressFields, startTabIndex, newObjErr, userAddress, handleClose, userContact, defaultContactFields, setAddressData, setContactData,setEditJsonData,emailTmpObj, textTmpObj, sentMail, commChannelId }) => {


  const [addressDetails, setAddressDetails] = useState(defaultAddressFields);
  const [contactDetails, setContactDetails] = useState(defaultContactFields);
  const [activateUserData, setActivateUserData] = useState()
  const apiData = useAppSelector(selectApi);
  const { _subtenantName } = useUserIdHook();
  const { contactType, addressType, countyRef, comType, commMedium, universaladdressFormate } = apiData;
  const { primaryUserId, spouseUserId, loggedInUserId, primaryMemberFullName } = usePrimaryUserId();
  const startingTabIndex = startTabIndex ?? 0;
  const [errMsg, setErrMsg] = useState(newObjErr());
  const [isModal, setisModal] = useState(false)
  const [contactTypeLabel, setContactTypeLabel] = useState("")
  const [addressTypeLable, setAddressTypeLable] = useState("")
  const [commMediumPutPostJson, setcommMediumPutPostJson] = useState()
  const [commMediumChennel, setCommMediumChennel] = useState(3)
  const [formlabelData, setFormlabelData] = useState({})
  const dispatch = useDispatch();
  const searchInput = useRef(null)
  const { setWarning, newConfirm } = useContext(globalContext)
  const { contactTypeId, comeTypes, countryCode, otherContact, mobileNumber, email } = contactDetails || {}
  const isNotNullUndefined = (data) => $AHelper?.$isNotNullUndefine(data);
  const  typeEdit = isNotNullUndefined(editJsonData)
  const addressRef = useRef(null)
  const [natureId, setNatureId] = useState(0)
  const [manditioryFileds, setManditioryFileds] = useState()
  const [buttonType, setButtonType] = useState("")
  const [isClientPermissions, setIsClientPermissions] = useState(false);
  const [occurenceUrl, setOccurenceUrl] = useState()

 useEffect(() => {
  if (isNotNullUndefined(editJsonData)) {
    if (modalType == "address") {
      setFormData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(editJsonData).filter(
            ([_, value]) => value !== null && value !== undefined && value !== "string"
          )
        ),
      }));    

      if (searchInput.current) {
        searchInput.current.value = editJsonData?.addressLine1 || "";
      }
      setAddressDetails(prevState => ({
        ...prevState,
        addressTypeId: editJsonData?.addressTypeId  // Dynamically update based on the key
      }));
      setNatureId(editJsonData?.addressId)
    
      

  } else {
      let emailData = editJsonData?.email
      let mobileData = editJsonData?.mobile
      if (mobileData?.contactTypeId == "999999" || emailData?.contactTypeId == "999999") {
        setContactDetails((prev) => ({
          ...prev,
          otherContact: mobileData?.mobileOther?.othersName || emailData?.emailOther?.othersName,
        }));
      }
      const contactTypeData = mobileData?.contactTypeId || emailData?.contactTypeId;
      const contactTypeLabelData = mobileData?.contactType || emailData?.contactType;
      setContactTypeLabel(contactTypeLabelData)
      setContactDetails((prev) => ({
        ...prev,
        contactTypeId: contactTypeData,
        comeTypes : mobileData?.commTypeId || "1"
      }));
      let mobileNo = '  ';
      let countryCodes = "+1";
      if ($AHelper?.$isNotNullUndefine(editJsonData?.mobile)) {
        const { number, countryCode } = separateCountryCodeAndNumber(editJsonData?.mobile?.mobileNo) ?? {};   
        mobileNo = number
        countryCodes = countryCode
      }
      setContactDetails((prev) => ({
        ...prev,
        mobileNumber: mobileNo,
        countryCode : countryCodes,
        email : emailData?.emailId
      }));
      if (userId == primaryUserId && contactTypeData == 1 && !paralegalAttoryId.includes(loggedInUserRoleId)) {
        fectchsubjectForFormLabelId()
      }
    }
  }
}, [editJsonData])





 

  useEffect(() => {
    if ($AHelper?.$isNotNullUndefine(universaladdressFormate) && universaladdressFormate?.length > 0) {
      const mandatoryFields = $AHelper.$extractMandatoryFields(universaladdressFormate[0]); // Extract fields with [*]
      setManditioryFileds(mandatoryFields)
    }
  }, [universaladdressFormate])






























  useEffect(() => {
    useLoader(true)
    const countryName = typeEdit ? editJsonData?.country :  addressDetails?.country
    dispatch(fetchUniversalAddress(countryName))
    useLoader(false)
    fetchApi()
  }, [])
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
  useEffect(() => {
    const fetchUserData = async () => {
      if (isNotNullUndefined(userId)) {
          const _resultOf = await getApiCall2('GET', `${$Service_Url.getUserDetailsByUserEmailId}?UserId=${userId}`, "");
          const response = _resultOf?.data;
          setActivateUserData(response);
      }
    };
  
    fetchUserData();
  }, [userId]);


  const setMandatory = (name,label) => {
    const isValid = manditioryFileds?.some(item => item.key == name)  || name === "Address Type"
      return isValid ? `${label}*` : label;
    
  };


  /////////////////////// univresal address code///////////////////////
  const extractFields = (universaladdressFormates) => {
    if (Array.isArray(universaladdressFormates) && universaladdressFormates.length > 0) {
      return Object.entries(universaladdressFormates[0])
        .filter(([_, value]) => value && value.includes("{") && value.match(/\{\d+\}/)) // Only include fields with non-empty placeholders
        .map(([key, value]) => {
          const match = value.match(/(.*?)\s*\{(\d+)\}/); // Extract label & order
          return match
            ? { key, label: match[1], order: +match[2] }
            : { key, label: value, order: 99 };
        })
        .sort((a, b) => a.order - b.order); // Sort by order number
    }
    return []; // Return an empty array if the input is invalid
  };
  const [formData, setFormData] = useState(Object.fromEntries(extractFields(universaladdressFormate).map(({ key }) => [key, ""])));

  const countyIndex = extractFields(universaladdressFormate).findIndex(({ key }) => key === "county");
  if (countyIndex !== -1) {
    extractFields(universaladdressFormate)?.splice(countyIndex + 1, 0, { key: "countyReference", label: "County Reference", order: extractFields(universaladdressFormate)[countyIndex].order + 0.1 });
  }
  // Handle changes
  const handleChange = (e, key) => {
    hideErrMsg(`${key}Err`,'')
    setFormData({ ...formData, [key]: e });

  };
  ////////////////////////////////////////////////////////////////////



  ///////////// AUTOCOMPLETE ADDRESS
  const autoCompleteAddress = (value, key) => {
    setErrMsg(newObjErr())
    initMapScript().then(() => $AHelper.$initAutoComplete(searchInput,setFormData,universaladdressFormate,dispatch));
  }
  const handleInputChange = (value, key) => {
    setContactDetails((prev) => ({
      ...prev,
      [key]: value
    }));
    hideErrMsg(`${"mobile"}Err`, errMsg)
    hideErrMsg(`${key}Err`, errMsg)
  }

  ////////////////////////////////////////////




  const filteredContactTypes = (data, value) => {
    let userDetails = userContact?.contact
    let userMobile =  userDetails?.mobiles
    let userEmail =   userDetails?.emails
    if (isNotNullUndefined(editJsonData)) {     
      let addedList = userMobile?.length > userEmail?.length ? userMobile : userEmail;
      const contactTypeData = editJsonData?.mobile?.contactTypeId || editJsonData?.email?.contactTypeId;
      let filtered = data?.filter((ele1) => !addedList?.some((ele) => ele?.contactTypeId == ele1.value && ele1.value != "999999" && ele1.value != contactTypeData))

      if (["Liabilities", "transportation"].includes(refrencePage)) {
        let newJson = filtered?.filter((ele) => ele?.value !== "999999")
        return newJson
      } else {
        return filtered
      }
    } else {
      let addedList = userMobile?.length > userEmail?.length ? userMobile : userEmail
      let filtered = data?.filter((ele) => !addedList?.some((e) => ele.value != "999999" && e?.contactTypeId == ele?.value))
      if (["Liabilities", "transportation"].includes(refrencePage)) {
        let newJson = filtered?.filter((ele) => ele?.value !== "999999")
        return newJson
      } else {
        return filtered
      }
    }

  }
  const hideErrMsg = (key) => {
    if ($AHelper.$isNotNullUndefine(errMsg[key])) {
      setErrMsg(prev => ({ ...prev, [key]: '' }));
    }
  }

  //////FILTERED ADDRESS DROPDOWN VALUES
  const filteredAddressType = (data, value) => {
    if (isNotNullUndefined(editJsonData)) {
      let addedList = userAddress?.length > 0 ? userAddress : []
      let filtereds = data?.filter((ele1) => !addedList.some((ele) => ele?.addressTypeId == ele1.value && ele1.value != "999999" && ele1.value != editJsonData?.addressTypeId))
      if (["Liabilities", "transportation"].includes(refrencePage)) {
        let newJson = filtereds?.filter((ele) => ele?.value !== "999999")
        return newJson
      } else {
        return filtereds
      }
    } else {
      let addedList = userAddress?.length > 0 ? userAddress : []
      let filtered = data?.filter((ele) => !addedList?.some((e) => ele.value != '999999' && e?.addressTypeId == ele.value))
      if (["Liabilities", "transportation"].includes(refrencePage)) {
        let newJson = filtered?.filter((ele) => ele?.value !== "999999")
        return newJson
      } else {
        return filtered
      }
    }

  }
  const setAddressLine1Data = () => {
    // setAddressLine1(searchInput?.current?.value)
  }

  const handleSelectChange = (value, key) => {
    hideErrMsg(`${key}Err`, errMsg);
    if (key === "contactTypeId") {
      setContactDetails((prev) => ({
        ...prev,
        [key]: value.value
      }));
      setContactTypeLabel(value?.label);
    } else if (key === "addressTypeId") {
      setAddressDetails(prevState => ({
      ...prevState,
      [key]: value?.value  // Dynamically update based on the key
    }));
    if(typeEdit){
      setFormData(prevState => ({
        ...prevState,
        addressTypeId: value?.value  ,// Dynamically update based on the key
        addressType : value?.label
      }));
    }
   
      setAddressTypeLable(value?.label);
    }
  };


  const handleClick = async (buttonType) => { 
    if (modalType == "address") {
      if (validateAddress()) {
        let apiType = isNotNullUndefined(editJsonData) ? "PUT" : "POST"
        let url = isNotNullUndefined(editJsonData) ? $Service_Url.putupdateAddress : $Service_Url.postAddAddress
        useLoader(true)
        let addressJosn = $JsonHelper.createAddressJsons(userId,loggedInUserId,addressDetails?.addressTypeId,formData,apiType)
     

        if (apiType === "PUT") {
          addressJosn.address = {
            ...(addressJosn.address || {}),
            addressId: editJsonData?.addressId
          };
        }
        if (["Liabilities", "transportation"].includes(refrencePage)) {

          const addressJosn1 = $JsonHelper.createAddressJsonWithoutUserUd(lattitude, longitude, addressLine1, apt, zipcode, county, city, state, country, countyRefrence, loggedInUserId, addressTypeId, addressTypeLable)
          getDataForLiabilities(addressJosn1, modalType)

        } else {
          const _resultGetActivationLink = await postApiCall(apiType, url, addressJosn);
          setWarning("successfully", `Successfully ${isNotNullUndefined(editJsonData) ? 'updated' : 'saved'} data`, `Your data have been ${isNotNullUndefined(editJsonData) ? 'updated' : 'saved'} successfully`
          );

          if (_resultGetActivationLink == "err") {
            return;
          }
          if (addressDetails?.addressTypeId == "999999") {
            let addressResponse = _resultGetActivationLink.data?.data?.addresses[0]
            addressRef.current.saveHandleOther(addressResponse.addressId);

          }
        }


        useLoader(false)
        if (apiType == "POST" && buttonType == "save" || isNotNullUndefined(editJsonData)) {
          closeModal("run")
        }
        if (searchInput.current) {
          searchInput.current.value = ''; // Set value here
          if (buttonType == "addAnother" && (refrencePage != "Liabilities" && refrencePage != "transportation")) {
            getExestingData(userId, "", "address")
          }
          if (buttonType == "addAnother") {
            const newData = await dispatch(fetchUniversalAddress("United States"))
            const initialFormData = Object.fromEntries(extractFields(newData?.payload).map(({ key }) => [key, ""]));
            setFormData(initialFormData);
          }

        }
        useLoader(false);


      } else {
        return;
      }
    } else {
      let mobileOther = null
      let emailOther = null

      const isEmailVerified = isNotNullUndefined(activateUserData) && activateUserData.length > 0 ? activateUserData[0]?.isEmailVerified : null
      let primaryData = JSON.parse(sessionStorage.getItem("userDetailOfPrimary")).primaryEmailId
      if (validateContact()) {

        if (!isNotNullUndefined(mobileNumber) && !isNotNullUndefined(email)) {
          validateFields(email, 'emailErr');
          validateFields(mobileNumber, 'mobileErr')
          return;
        }
        if (isNotNullUndefined(mobileNumber) && (mobileNumber.length < 10)) {
          setErrMsg(prev => ({ ...prev, ["mobileErr"]: 'Enter a valid mobile number' }));
          return;
        }
        if (!isValidEmail(email) && isNotNullUndefined(email)) {
          setErrMsg(prev => ({ ...prev, ["emailErr"]: 'Enter a valid email' }));
          return;
        }
        if (isValidEmail(email) && isNotNullUndefined(email) && (userId == spouseUserId) && (email === primaryData) && !isEditShow(editJsonData)) {
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
          "userId": userId,
          "activityTypeId": "4",
          "contact": {}
        }

        //////////// flow for addor update if one is not exesting  email/mobile
        if (isNotNullUndefined(editJsonData) && (!isNotNullUndefined(editJsonData?.email) || !isNotNullUndefined(editJsonData?.mobile))) {
          let mobileOthers = null
          let emailOthers = null
      
          if (contactTypeId == "999999") {
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

          updateJsonData.contact.mobiles = (isNotNullUndefined(editJsonData?.mobile)) || !isNotNullUndefined(mobileNumber) ? []
            : [$JsonHelper.$createMobileData(mobileNumber, contactTypeId, countryCode, loggedInUserId, mobileOther, comeTypes, contactTypeLabel)];
          updateJsonData.contact.emails = (isNotNullUndefined(editJsonData?.email)) || !isNotNullUndefined(email) ? []
            : [$JsonHelper.$createEmailData(email, contactTypeId, loggedInUserId, emailOther, contactTypeLabel)];




          if (updateJsonData.contact?.mobiles?.length || updateJsonData.contact?.emails?.length) {
            if (["Liabilities", "transportation"].includes(refrencePage)) {
              getDataForLiabilities(updateJsonData, modalType, typeEdit)
            } else {
              useLoader(true)
              const _resultGetActivationLink = await postApiCallNew("POST", $Service_Url?.postAddContactWithOther, updateJsonData);

              if (_resultGetActivationLink?.isError == "true") {
                let res = _resultGetActivationLink?.resPonse?.data?.Messages?.[0]
                if (res == "Duplicate mobile no, Entered mobile no is already available." || res == "Duplicate email id, Entered email id is already available.") {
                  setWarning("warning", _resultGetActivationLink?.resPonse?.data?.Messages?.[0])
                  if (res == "Duplicate email id, Entered email id is already available.") {
                    getExestingData(userId, updateJson, "contact")
                    setContactDetails((prev) => ({
                      ...prev,
                      contactTypeId: '',
                      email: '',
                    }));

                  }
                }
                useLoader(false)
                return;
              }
              fetchPrimaryContactDetails();
              useLoader(false)
            }

          }

        }
        let mobileContactId = isNotNullUndefined(editJsonData) ? editJsonData?.mobile?.contactId : ""
        let emailContactId = isNotNullUndefined(editJsonData) ? editJsonData?.email?.contactId : ""
        //////////////  add or update  flow
       updateJsonData.contact.mobiles = (!$AHelper?.$isNotNullUndefine(mobileNumber)) || ($AHelper?.$isNotNullUndefine(editJsonData) && !$AHelper?.$isNotNullUndefine(editJsonData?.mobile) || editJsonData?.mobile.length == 0) ? []
          : [$JsonHelper.$createMobileData(mobileNumber, contactTypeId, countryCode, loggedInUserId, mobileOther, comeTypes, contactTypeLabel,mobileContactId,typeEdit)];

        updateJsonData.contact.emails = (!$AHelper?.$isNotNullUndefine(email)) || ($AHelper?.$isNotNullUndefine(editJsonData) && !$AHelper?.$isNotNullUndefine(editJsonData?.email) || editJsonData?.email.length == 0) || (isEmailVerified == true && contactTypeId == 1 && userId == primaryUserId) ||
          (isEmailVerified && contactTypeId === 1 && userId === primaryUserId) ? []
          : [$JsonHelper.$createEmailData(email, contactTypeId, loggedInUserId, emailOther, contactTypeLabel, emailContactId,typeEdit)];





        if (typeEdit == true) {
          const { email, mobile } = editJsonData;
          if (isNotNullUndefined(email?.emailId) && updateJsonData?.contact?.emails.length < 1 && !isEmailVerified == true && contactTypeId == 1) {
            setWarning("warning", "Please fill your email.")
            return;
          }
       
          if (isNotNullUndefined(mobile?.mobileNo) && updateJsonData?.contact?.mobiles.length < 1) {
            setWarning("warning", "Please fill your mobile number.")
            return;
          }
        }

        if (["Liabilities", "transportation"].includes(refrencePage)) {
          if (typeEdit == false || (isNotNullUndefined(email) && isNotNullUndefined(mobileNumber))) {
           
            getDataForLiabilities(updateJsonData, modalType, typeEdit)
          }

        } else {
          if ((isEmailVerified !== null && isEmailVerified == true || isEmailVerified == false) && (isNotNullUndefined(editJsonData?.email?.emailId) && (contactTypeId == 1) && (editJsonData?.email?.emailId !== email))) {
            if (isEmailVerified == true) {
              const confirmRes = await newConfirm(true, "Are you sure you want to change the email? If confirm, a reactivation link will be automatically sent to the client's account after the email is updated.", 'Permission', 'Confirmation', 3);
              if (!confirmRes) return;
            }

            let jsonObj = {
              "currentUserName": editJsonData?.email?.emailId,
              "newUserName": email,
              "updatedBy": loggedInUserId,
              "remarks": "Client Primary Email Updated by Legal",
              "clientIPAddress": "::1",
              "isParaResquest": true
            }
            useLoader(true)
            const result = await postApiCallNew('PUT', $Service_Url.putUserNameEmail, jsonObj);
            
            if(editJsonData?.mobile?.mobileNo !== mobileNumber && result != 'err'){
               updateJsonData.contact.emails = []
               updateData(updateJsonData)
             }
            if (result?.isError == "true") {
              let res = result?.resPonse?.data?.messages?.[0]
              useLoader(false)
              setWarning("warning", res)
              return;
            }
            fetchPrimaryContactDetails();
            if (isEmailVerified == true) {
              SendActivationMailFunc()
            }

            setButtonType(buttonType)
          } else {
            updateData(updateJsonData)
                    }

          ///////////////////////////

          let isUpdate = formlabelData?.label1037?.response.some(ele => ele?.userSubjectDataId && ele?.userSubjectDataId !== 0)
          if (isNotNullUndefined(commMediumPutPostJson)) {
            if (isUpdate == true) {
              updateResponse(commMediumPutPostJson)
            } else {
              if (userId == primaryUserId && contactTypeId == 1 && !paralegalAttoryId.includes(loggedInUserRoleId) &&
                $AHelper.$isNotNullUndefine(formlabelData) && formlabelData?.label1037) {
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
                "userId": userId
              }
            ]
            if (userId == primaryUserId && contactTypeId == 1 && !paralegalAttoryId.includes(loggedInUserRoleId) &&
              $AHelper.$isNotNullUndefine(formlabelData) && formlabelData?.label1037) {
              addResponse(json)
            }

          }


        }

        if (((isEmailVerified == null || isEmailVerified == false) && contactTypeId == 1) || (editJsonData?.email?.emailId == email || contactTypeId !== 1)) {
          if (buttonType == "save") {
            closeModal("run");

          } else if (buttonType == "addAnother") {
            if (!["Liabilities", "transportation"].includes(refrencePage)) {
              getExestingData(userId, updateJsonData, "contact")
            }
            resetContactData()

          }
        }

      } else {
        return;
      }



    }

  }
  const updateData = async(updateJsonData)=>{


    let type = isNotNullUndefined(editJsonData) ? "PUT" : "POST"
    useLoader(true)
    let url = isNotNullUndefined(editJsonData) ? $Service_Url?.updateContactWithOtherDetailsPath : $Service_Url?.postAddContactWithOther;

    const _resultGetActivationLink = await postApiCallNew(type, url, updateJsonData);
    fetchPrimaryContactDetails();
    useLoader(false)
    if (_resultGetActivationLink?.isError == "true") {
      let res = _resultGetActivationLink?.resPonse?.data?.Messages?.[0]
      if (res == "Duplicate mobile no, Entered mobile no is already available." || res == "Duplicate email id, Entered email id is already available.") {
        setWarning("warning", _resultGetActivationLink?.resPonse?.data?.Messages?.[0])
        if (res == "Duplicate email id, Entered email id is already available.") {
   
          getExestingData(userId, updateJsonData, "contact")
          setContactDetails((prev) => ({
            ...prev,
            contactTypeId: ''
          }));

        }
      }
      useLoader(false)
      return;
    }
    setWarning("successfully", `Successfully ${isNotNullUndefined(editJsonData) ? "updated" : " saved"} data `, `Your data have been ${isNotNullUndefined(editJsonData) ? "updated" : "saved"} successfully`)
    useLoader(false)

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
  const fetchPrimaryContactDetails = () => {
    dispatch(fetchPrimaryMemberContactDetials({ userId: primaryUserId }))
  }
  const getExestingData = async (id, oldData, type) => {
    if (type == "address") {
      if (isNotNullUndefined(id)) {
        const _resultOf = await getApiCall('GET', $Service_Url.getAllAddress + id, "")
        setAddressData(_resultOf?.addresses)
      }


    } else {
      const responses = await dispatch(fetchUserContactData(id));
      setContactData(responses?.payload)
      // setReRender(true)
    }



  }


  /////////////FUNCTION FOR VALIDATION ADDRESS OR CONTACT OR EMAIL
   





   const validateField = (field, errorMessageKey,label) => {
   
     const isEmptyOrWhitespace = /^\s*$/.test(formData[field]);
     const isFieldInvalid = !isNotNullUndefined(formData[field]) || isEmptyOrWhitespace;
     const isNotAddressError = errorMessageKey !== "addressTypeIdErr";

     if ((isFieldInvalid && isNotAddressError) || (!isNotNullUndefined(addressDetails?.addressTypeId))) {
          const fieldNames = {
            addressTypeIdErr: "Address Type"
          };
          
          const fieldName = fieldNames[errorMessageKey] || field.charAt(0).toUpperCase() + field.slice(1);
          
         // Handle special case for 'addressTypeIdErr'
         if (errorMessageKey === 'addressTypeIdErr' && !isNotNullUndefined(addressDetails?.addressTypeId)) {
             setErrMsg(prev => ({ ...prev, [errorMessageKey]: `${fieldName} is required` }));
         } 
        //  if (errorMessageKey === 'addressErr' && !isNotNullUndefined(searchInput?.current?.value)) {
        //   setErrMsg(prev => ({ ...prev, [errorMessageKey]: `${fieldName} is required` }));
        //  } 
         if(errorMessageKey !== 'addressTypeIdErr' && (isFieldInvalid)) {
             setErrMsg(prev => ({ ...prev, [errorMessageKey]: `${label} is required` }));
         }        
         return false;
     } else {
         setErrMsg(prev => ({ ...prev, [errorMessageKey]: '' }));
     }
     return true;
   };
   

     const validateFields = (field, errorMessageKey) => {
      if (!$AHelper.$isNotNullUndefine(field)) {  
        setErrMsg(prev => ({ ...prev, [errorMessageKey]: $Msg_AddressDetails[errorMessageKey] }));
        return false;
      } else {
        setErrMsg(prev => ({ ...prev, [errorMessageKey]: '' }));
      }
      return true;
    };
 








  const validateAddress = () => {
    let isValidAddress = true; // Ensure previous validations are considered
    // Validate all mandatory fields
    for (let i = 0; i < manditioryFileds.length; i++) {
        const isFieldValid = validateField(manditioryFileds[i].key, `${manditioryFileds[i].key}Err`,manditioryFileds[i].value);
        isValidAddress = isValidAddress && isFieldValid; // Accumulate validation results
    }  
    const isValidAddressTypeId = validateField(addressDetails?.addressTypeId, 'addressTypeIdErr');
    // const isValidAddres = validateField(searchInput?.current?.value, 'addressErr');

    return (
        (!["BusinessIntrests", "lenderData", "transportation", "professional", "RealEstate"].includes(refrencePage) 
            ? isValidAddressTypeId 
            : true) 
        && isValidAddress
    );
  };
  const validateContact = () => {
    const isValidContactType = validateFields(contactTypeId, 'contactTypeIdErr');
    const isValidComType = isNotNullUndefined(mobileNumber) && validateFields(comeTypes, 'comeTypeErr');
    return isValidContactType && (!isNotNullUndefined(mobileNumber) ? true : isValidComType);
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  /////////////////////lable data //////////////////////
  const fectchsubjectForFormLabelId = async () => {
    let formlabelData = {}
    useLoader(true)
    let resultsubjectlabel = await postApiCall('POST', $Service_Url.getsubjectForFormLabelId, preferredContactMethod);
    if (resultsubjectlabel == 'err') return;
    for (let obj of resultsubjectlabel.data.data) {
      let label = "label" + obj.formLabelId;
      formlabelData[label] = obj.question;
      let result = await getApiCall('GET', $Service_Url.getSubjectResponse + userId + `/0/0/${formlabelData[label].questionId}`, null);
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
        "userId": userId,
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
          "userId":userId
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

  const isEditShow = (data) => {
    if (isNotNullUndefined(activateUserData) && activateUserData.length > 0 && (data?.email?.contactType === "Primary" || data?.mobile?.contactType === "Primary")) {        
        const { isActive, jointAccountUserId, isEmailVerified } = activateUserData[0];        
        return (!paralegalAttoryId.includes(loggedInUserRoleId)) && isEmailVerified;
    } else {
        return false;
    }
  }
  /////////////////////////////////////////////////////
  const closeModal = (type) => {
    setEditJsonData()
    handleClose(type)
  }
  const setMobileNumber = (data) => {
    setContactDetails((prev) => ({
      ...prev,
      ["mobileNumber"]: data
    }));


  }
  const setcountryCode = (data) => {
    setContactDetails((prev) => ({
      ...prev,
      ["countryCode"]: data
    }));


  }

    //////// reactivationmail flow and functions
    const sentEmailText = () => {
      sentTextNMail(occurenceUrl)
    }
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
          closeModal("run")
  
        } else if (buttonType == "addAnother") {
          resetContactData()
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
      TemplateContent = TemplateContent.replace("@@OLDEMAILADDRESS", editJsonData?.email?.emailId);
      TemplateContent = TemplateContent.replace("@@NEWEMAILADDRESS", contactDetails?.email);
  
      return TemplateContent;
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default keypress behavior for Tab and Enter keys
      }
    }
      //////////////////////////////////////
      const fildsOnblur =async(data,key)=>{
         if(!isNotNullUndefined(data) || key !== "country"){return}
         useLoader(true)
        const newData = await dispatch(fetchUniversalAddress(data))
        useLoader(false)
      }

    const handleCloaseEmail =()=>{
      setisModal(false)
      handleClose()
    }
  return (
    <>
      {show &&
        <div id="newModal" className='modals'>
          <div className="modal" style={{ display: 'block' }}>
            <div className="modal-dialog costumModal" style={{ maxWidth: '500px', margin: 'auto' }}>
              <div className="costumModal-content">
                <div className="modal-header mt-3 ms-1">
                  <h5 className="modal-title">{header}</h5>
                  <img className='mt-0 me-1' onClick={() => closeModal("close")} src='/icons/closeIcon.svg'></img>
                </div>
                <div className="costumModal-body">
                  {modalType == "address" ? <>
                    <div style={{ maxHeight: "35rem", overflowY: "auto", overflowX: "hidden", padding: '1rem' }}>
                      {refrencePage !== "professional" && <Row className="spacingBottom">
                        <Col xs={12} md={12}>
                          <CustomSelect tabIndex={startingTabIndex + 1} isPersonalMedical={true} isError='' label="Address Type*" placeholder='Select' options={filteredAddressType(addressType, addressDetails?.addressTypeId)} onChange={(e) => handleSelectChange(e, 'addressTypeId')}
                            value={addressDetails?.addressTypeId} />
                        {(errMsg.addressTypeIdErr) && <><span className="err-msg-show">{errMsg.addressTypeIdErr}</span></>}                        </Col>
                      </Row>}
                      {addressDetails?.addressTypeId == "999999" &&
                            <Row className=" spacingBottom">
                              <Col xs={12} md={12}>
                                <Other tabIndex={startingTabIndex +  2} isPersonalMedical={true} othersCategoryId={2} userId={userId} dropValue={addressDetails?.addressTypeId} ref={addressRef} natureId={natureId} notCapital={true}/>
                              </Col>
                            </Row>}
                      <Row className=" spacingBottom">
                        <Col xs={12} md={12}>
                          <div id='custom-input-field full-width' className="custom-input-field full-width">
                            {$AHelper.$isNotNullUndefine("Address") && <p>{"Search address"}</p>}
                            <input tabIndex={startingTabIndex + 3} label="Search address" onBlur={setAddressLine1Data} type='text' placeholder="Enter address for search" id='addressLine'
                              ref={searchInput} defaultValue={addressDetails?.addressLine1} onChange={(e) => autoCompleteAddress(e, "address")} />
                            {(errMsg.addressErr) && <><span className="err-msg-show">{errMsg.addressErr}</span></>}
                          </div>
                        </Col>
                      </Row>
                      <Row id='Personal-Details'>
                        {extractFields(universaladdressFormate).map(({ key, label }) => (                       
                         
                            <div key={key} className="form-group">
                              {key === "county" ? (
                                <>
                                <Row className=" spacingBottom">
                                  <Col xs={12} md={12}>
                                    <CustomSelect tabIndex={startingTabIndex + 1} isPersonalMedical={true} isError='' label="County Reference" placeholder='County Reference' options={countyRef} onChange={(e) => handleChange(e, 'addressTypeId')}
                                      value={formData[key]} />
                                  </Col>
                                  </Row>
                                <Row className=" spacingBottom">
                                  <Col xs={12} md={12}>
                                  <CustomInput tabIndex={startingTabIndex + 12} isPersonalMedical={true} label={label} placeholder={label}
                                notCapital={true} id={key} value={formData[key]} onChange={(val) => handleInputChange(val, 'other')} />
                                  </Col>
                                  </Row>
                                  </>

                              ) : (

                                <Row className=" spacingBottom">
                                  <Col xs={12} md={12}>
                                  <CustomInput tabIndex={startingTabIndex + 12} isPersonalMedical={true} label={setMandatory(key,label)} placeholder={label}
                                      notCapital={true} id={key} value={formData[key]} onBlur={(e)=>fildsOnblur(e.target.value,key)} onChange={(e) => handleChange(e, key)} />
                                  </Col>
                                  {errMsg[`${key}Err`] && <span className="err-msg-show">{errMsg[`${key}Err`]}</span>}
                                </Row>
                              )}
                            </div>
                        
                        ))}
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
                              options={filteredContactTypes(contactType, contactTypeId)}
                              onChange={(e) => handleSelectChange(e, 'contactTypeId')}
                              value={contactTypeId}
                              isDisable = {isNotNullUndefined(editJsonData) && (["Primary"].includes(editJsonData?.email?.contactType) || ["Primary"].includes(editJsonData?.mobile?.contactType) || ["Liabilities", "transportation"].includes(refrencePage))}
                  
                            />
                            {(errMsg.contactTypeIdErr) && <><span className="err-msg-show">{errMsg.contactTypeIdErr}</span></>}
                          </Col>
                        </Row>
                        {contactTypeId == "999999" &&
                          <Row className="spacingBottom">
                            <Col xs={12} md={12}>
                              <CustomInput
                                tabIndex={startingTabIndex + 12}
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
                        <Row className="spacingBottom">
                          <Col xs={12} md={12}>
                            <ContactRezex startTabIndex={startingTabIndex + 13} isPersonalMedical={true} setValue={setMobileNumber} mobileNumber={mobileNumber} hideErrMsg={hideErrMsg} errMsg={errMsg} countryCode={countryCode} setcountryCode={setcountryCode} comType={comType} handleSelectChange={handleSelectChange} comeTypes={comeTypes} />
                            {(errMsg.mobileErr) && <><span className="err-msg-show">{errMsg.mobileErr}</span></>}
                            {(errMsg?.comeTypeErr) && <><span className="err-msg-show">{errMsg?.comeTypeErr}</span></>}
                          </Col>
                        </Row>
                        <Row className="spacingBottom">
                          <Col xs={12} md={12} >
                            <CustomInput
                              tabIndex={startingTabIndex + 13 + 2}
                              isPersonalMedical={true}
                              label="Email"
                              placeholder='i.e johnoe@gmail.com'
                              id='email'
                              isSmall={true}
                              value={email}
                              onChange={(val) => handleInputChange(val, 'email')}
                              isDisable={isNotNullUndefined(editJsonData) && isEditShow(editJsonData)}
                            />
                            {(errMsg.emailErr) && <><span className="err-msg-show">{errMsg.emailErr}</span></>}
                          </Col>
                        </Row>
                        {userId == primaryUserId && contactTypeId == 1 && !paralegalAttoryId.includes(loggedInUserRoleId) &&
                          $AHelper.$isNotNullUndefine(formlabelData) && formlabelData?.label1037 &&
                          QuestionAndAnswerInput(formlabelData?.label1037, 'stylehomeSub', 'label1037')
                        }
                      </Col>
                    </Row>
                  </>}
                </div>
                <div className="modal-footer">
                  {!isNotNullUndefined(editJsonData) &&
                    <button tabIndex={startingTabIndex + 13 + 2 + 1} className='btn-btn' onClick={() => handleClick("addAnother")}>Save & Add Another {modalType}</button>}
                  <CustomButton
                    tabIndex={startingTabIndex + 13 + 2 + 1 + 1}
                    onClick={() => handleClick("save")}
                    label={isNotNullUndefined(editJsonData) ? "Update" : "Save"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
       {isModal &&  <>
              <CustomModal
                    open={isModal}
                    handleOpenModal={()=>handleCloaseEmail()}
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
  );
}

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
      dispatch({
          type: SET_LOADER,
          payload: loader,
      }),
});
export default connect("", mapDispatchToProps)(withOccurrenceApi(UniversalAddressContactModal,34, 'ContactOccurrence'));

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



