import React, { useEffect, useState,useImperativeHandle,forwardRef,useRef,useContext} from 'react'
import {Row, Col, Modal,Button,Form} from 'react-bootstrap';
import { postApiCall } from '../../components/Reusable/ReusableCom';
import { Api_Url } from '../../components/network/UrlPath';
import { $AHelper } from '../Helper/$AHelper';
import { isNullUndefine } from '../../components/Reusable/ReusableCom';
import { globalContext } from '../../pages/_app';
import { CustomInput } from '../Custom/CustomComponent';
import { CustomButton } from '../Custom/CustomButton';
import { $Msg_AddressDetails } from '../Helper/$MsgHelper';
import { initMapScript } from '../../components/control/AHelper';
import { useLoader } from '../utils/utils';

const userProfileJson = () => {return { id: 0, merchantCustomerId: "", customerProfileId: "", userId: "", profileType: "",isDeleted: false,createdBy: "",isActive: true}}
const userCardJson = () => {return {id: 0, userProfileId: 0, cardNickName: "", paymentProfileId: "", customerProfileId: "", 
                           cardNumber: "", expireDate: "", cardType: "", cardIsDeleted: false, isDefault: false, streetAddress: "",
                            apartmentNo: "", city : "", state: "", zipCode: "", cardIsActive: true, remarks: "", createdBy: "",
                            updatedBy :"" ,userLoginId:"",userId:"",firstName:"" ,lastName:"",emailId:"" ,phoneNumber:""}}

const NewPaymentModal = (props,ref) => {  
  const formOnlyUse = props?.formOnlyUse;
  const { setdata, confirm } = useContext(globalContext);
  const newObjErr = () => ({cityErr: "", stateErr: "", zipCodeErr: "",streetAddressErr:'',expireDateErr:"",cardNumberErr:"",cardNickNameErr:"",});
    const userDetail = JSON.parse(sessionStorage.getItem("stateObj"))
    const primaryUserId = sessionStorage.getItem("SessPrimaryUserId") 
    const loginUserId = sessionStorage.getItem("loggedUserId")
    const { setWarning } = useContext(globalContext)
    const searchInput = useRef(null)
    const [errMsg, setErrMsg] = useState(newObjErr());
    const [isUpadteCard, setIsUpadteCard] = useState(true)
    const [userCardJsonSet, setUserCardJsonSet] = formOnlyUse ? [props?.cardFormData, props?.setCardFormData] : useState({...userCardJson(),createdBy : loginUserId})

  

    useEffect(()=>{
      if(formOnlyUse) {
        // setUserCardJsonSet(props.updateCard);
      } else {
        setStateToUpdate()
      }
    },[props.updateCard])

    useImperativeHandle(ref,()=>({
      deleteCardDetails
    }))


    const is24HoursOld = (updateon) => {
      const currentGMT = new Date().toISOString(); // Current time in GMT as ISO string
      const currentGMTTime = new Date(currentGMT).getTime(); // Convert current GMT to milliseconds
      const updateTime = new Date(updateon).getTime(); // Convert updateon to milliseconds  
      return (currentGMTTime - updateTime) >= 24 * 60 * 60 * 1000; // Compare time difference
  };

    const setStateToUpdate = () =>{
      let parts = props.updateCard?.cardNickName?.split(" ");
      let firstName = parts[0] || "";
      let lastName = parts.slice(1).join(" "); // Combine everything after the first word for the last name

      let userLoggedInDetail=JSON.parse(sessionStorage.getItem('userLoggedInDetail')); 
      const {primaryEmailId, userMob } = userLoggedInDetail
      if(props.updateCard != undefined || props.updateCard != null){
         const mergeUpdateCardDetailObj = {...userCardJson(), ...props.updateCard,customerProfileId:props?.profileDetails?.[0]?.customerProfileId,updatedBy:loginUserId,userLoginId:userDetail?.loggenInId,emailId:primaryEmailId,phoneNumber:userMob,userId:primaryUserId,firstName:firstName,lastName:$AHelper.$isNotNullUndefine(lastName) ? lastName : firstName,isDefault:false}
         const {createdBy, createdOn, updatedOn, ...rest} = mergeUpdateCardDetailObj
         setUserCardJsonSet(rest)
        let compaerDate = props.updateCard?.updatedOn == "0001-01-01T00:00:00" ? props.updateCard?.createdOn : props.updateCard?.updatedOn
        setIsUpadteCard(is24HoursOld(compaerDate))  
      }
    }

    const formatCreditCardNumber = (value) => {
        const digitsOnly = value?.replace(/\D/g, '');
        const formattedValue = digitsOnly?.replace(/(\d{4}(?=\d))/g, '$1 ');
        return formattedValue;
    };
 
    const expiryDateValidationInput = (data) => {
      let value = data?.replace(/\D/g, ''); // Remove non-digit characters
    
      // Ensure month is between 01 and 12
      value = value?.replace(/^(\d{2})/, (match, month) => {
        if (parseInt(month) < 1 || parseInt(month) > 12) {
          return '0';
        }
        return month;
      });
    
      // Add slash after the second digit of the month
      value = value?.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
    
      // Remove slash if the last character being deleted is a slash
      value = value?.replace(/\/$/, '');
    
      // Truncate year to 2 digits
      value = value?.replace(/(\d{4})\d*/, '$1');
    
      return value; // Return the updated input value
    };


    const validateContact = () => {
      const isValidAddressLine1 = validateField(userCardJsonSet?.streetAddress, 'streetAddressErr');
      const isValidCardNickName = validateField(userCardJsonSet?.cardNickName, 'cardNickNameErr');
      const isValidCardNumber = validateField(userCardJsonSet?.cardNumber, 'cardNumberErr');
      const isValidExpireDate = validateField(userCardJsonSet?.expireDate, 'expireDateErr');
      const isValidCardCvv = $AHelper.$isNullUndefine(userCardJsonSet?.paymentProfileId) ? validateField(userCardJsonSet?.cardCvv, 'cardCvvErr') : true;
      const isValidCity = validateField(userCardJsonSet?.city, 'cityErr');
      const isValidState = validateField(userCardJsonSet?.state, 'stateErr');
      const isValidZipcode = validateField(userCardJsonSet?.zipCode, 'zipCodeErr');  
      return   isValidCardNickName && isValidCardNumber && isValidExpireDate && isValidCity && isValidState && isValidZipcode && isValidAddressLine1 && isValidCardCvv;
    };
    const validateField = (field, errorMessageKey, needErrorFocus) => {
      if (!$AHelper.$isNotNullUndefine(field)) {
        setErrMsg(prev => ({ ...prev, [errorMessageKey]: $Msg_AddressDetails[errorMessageKey] }));
        return false;
      } else {
        setErrMsg(prev => ({ ...prev, [errorMessageKey]: '' }));
      }
      return true;
    };
      
    
     
    const handleCardDetails = (e,key) => {
      let updatedValue = '';
      switch (key) {
        case "cardNumber":
          updatedValue = $AHelper.$isNumberAndSpaceRegex(e) ? e?.replace(/\s/g, "") : '';
          break;
        case "expireDate":
          updatedValue = $AHelper.$isNumberAndSlash(e) ? e : '';
          break;
        case "cardNickName":
          updatedValue = $AHelper.$isNotallowspecialRegex(e) ? $AHelper.$capitalizeFirstLetter(e) : '';
          break;
        case "cardCvv":
          updatedValue = $AHelper.$isNotNullUndefine(e) && (isNaN(Number(e)) != true) ? Number(e) : '';
          break;
        default:
          updatedValue = e;
      }
    
      if(key == "cardNickName" && $AHelper.$isNotNullUndefine(updatedValue)){
        let parts = updatedValue?.split(" ") || [];
        let firstName = parts[0] || ""; // Default to an empty string if parts[0] is undefined
        let lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName; // Use firstName if no last name exists
        
        setUserCardJsonSet(prev => ({
          ...prev,
          firstName,
          lastName,
          cardNickName: updatedValue
        }));

      } else{
        setUserCardJsonSet(prev => ({
          ...prev,
          [key]: updatedValue
        }));     
      }
      hideErrMsg(`${key}Err`, errMsg)
     
    };


    const hideErrMsg = (key, errMsg) => {
      if ($AHelper.$isNotNullUndefine(errMsg[key])) {
        setErrMsg(prev => ({ ...prev, [key]: '' }));
      }
    }
    const makeCardDefault = async() =>{ 
      let confirms = await confirm(true,'Are you sure you want to make this card default ?','Confirmation')
      if(confirms == false) return;
      setUserCardJsonSet(prev => ({
        ...prev,
        ["isDefault"]: false
      }));
    }
    


    const validateExpirationDate = (date) => {
      // Check if the date matches the mm/yy format
      const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!regex.test(date)) {
        return false;
      }
  
      // Check if the date is in the future
      const [month, year] = date?.split('/');
      const expirationDate = new Date(`20${year}`, month);
      const currentDate = new Date();
  
      return expirationDate > currentDate;
    };
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
      }
    
    const validate = () =>{     
      const cardNumbers =  userCardJsonSet?.cardNumber?.toString()
      if(isNullUndefine(userCardJsonSet?.cardNickName) == true){
        toasterAlert("warning", "Please enter card holder name")
        return;
      }
      if(isNullUndefine(cardNumbers) == true){
        toasterAlert("warning", "Please enter card number")
        return;
      }
      if(!(cardNumbers?.length >= 14 && cardNumbers?.length <= 16)){
        toasterAlert("warning", "Please enter correct card number")
        return;
      }
      if (!validateExpirationDate(userCardJsonSet?.expireDate)) {
        toasterAlert("warning", "Please enter correct expiration date.")
        return;
      }
      if(isNullUndefine(userCardJsonSet?.expireDate) == true){
        toasterAlert("warning", "Please enter expiration date")
        return;
      }
      if($AHelper.$isNullUndefine(userCardJsonSet?.paymentProfileId) && isNullUndefine(userCardJsonSet?.cardCvv)){
        toasterAlert("warning", "Please enter expiration date")
        return;
      }
      return true;
    }

    const saveAndEditCardDetails = () =>{
      if(isUpadteCard == false){
        toasterAlert("warning", "You can update your card once every 24 hours. The 24-hour period starts after your subscription or card update.")
        return;
      }
      if(validateContact() && validate()){ 
      if(formOnlyUse) return props?.onSubmit(userCardJsonSet);
      if(props.updateCard != undefined || props.updateCard != null){
               userCard(userCardJsonSet,"updateCardDetail")
      }
      else{
        if(props?.profileDetails?.status == 404){
          userProfile()
        }
        else{
          const cardJson = {...userCardJsonSet,userProfileId:props?.profileDetails?.[0]?.id}
          userCard(cardJson)
        }
      } 
    }
    }

    const deleteCardDetails = (data) =>{
      const {createdBy, createdOn, updatedOn, updatedBy, ...rest} = data
      const json = {...rest, updatedBy : loginUserId,customerProfileId : "", cardIsDeleted : true, cardIsActive : false}  
      userCard(json,"deleteCardDetail")
    }

    const userProfile = async() => {  
        useLoader(true)    
        const profileJson = {...userProfileJson(),merchantCustomerId : `AOUL-${userDetail?.loggenInId}`,userId:primaryUserId,createdBy: loginUserId}
        const responseData = await postApiCall("POST",Api_Url.postUserProfile,profileJson)
        useLoader(false)
        const userProfileId = responseData?.data?.data?.id
        const cardJson = {...userCardJsonSet,userProfileId:userProfileId}
        userCard(cardJson)
    }

    const userCard = async(cardJson,cardEvent) =>{     
       const checkAlreadyAddedCard = props?.alreadyAddedCards?.some(item =>
        item.cardNumber === cardJson.cardNumber &&
        [null, false].includes(item.cardIsDeleted) &&
        item.expireDate == cardJson.expireDate &&
        item.streetAddress == cardJson.streetAddress &&
        item.zipCode === cardJson.zipCode &&
        item.state === cardJson.state &&
        item.city === cardJson.city
      );
      if (!checkAlreadyAddedCard) {
        useLoader(true)
        const responseData = await postApiCall("POST", Api_Url.postUserCard, cardJson)
        // const { userSubscriptionId, subscriptionId, authorizeSubscriptionId } = props?.subsDetails
        // const { customerProfileId } = props?.profileDetails?.[0] || {}
        // const { cards, userId } = responseData?.data?.data || {}
        // const upDateJson = {
        //   "userSubscriptionId": userSubscriptionId,
        //   "subscriptionId": subscriptionId,
        //   "authorizeSubscriptionId": authorizeSubscriptionId,
        //   "authorizeCustomerProfileId": customerProfileId,
        //   "authorizePaymentProfileId": cards[0]?.paymentProfileId || null,
        //   "userLoginId": userDetail?.loggenInId,
        //   "userId": userId,
        //   "isOneTimePay": false
        // }
        
        // const _resultupdateUserAuthSubscription = await postApiCall('POST', Api_Url.updateUserAuthSubscription, upDateJson);
        // if (_resultupdateUserAuthSubscription !== 'err') {
        //   toasterAlert("successfully", `Card details ${cardEvent == "deleteCardDetail" ? "deleted" : cardEvent == "updateCardDetail" ? "updated" : "added"} successfully`)

        // }
        if(responseData != 'err'){
        toasterAlert("successfully", `Card details ${cardEvent == "deleteCardDetail" ? "deleted" : cardEvent == "updateCardDetail" ? "updated" : "added"} successfully`)
        }



        useLoader(false)
        props?.handleClose()
      }
      else {
        toasterAlert("warning", "Card already exists.")
      } 
    }
      //////////////////autoComplete address   
  const autoCompleteAddress = (value, key) => {
    setUserCardJsonSet(prev => ({
      ...prev,
      [key]: value.target.value
    }));
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
    setUserCardJsonSet((prev) => ({
      ...prev,
      streetAddress: searchInput?.current?.value,
    }));
    setAddress(extractAddress(place));
  };
  const setAddress = (address) => {
    address = formateAddressLine1(address);
    setUserCardJsonSet((prev) => ({
      ...prev,
      city: address.city,
      state: address.state,
      zipCode: address.zip,
    }));

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
      setUserCardJsonSet((prev) => ({
        ...prev,
        streetAddress: searchInput?.current?.value,
      }));
    }

    const MainForm = (
        <>
          <div className="costumModal-body" key={"costumModal-body"}>
  
            <div style={{ maxHeight: (formOnlyUse ? "none" : "35rem"), overflowY: "auto", overflowX: "hidden", padding: (formOnlyUse ? '0' : '1rem') }}>
  
              <Row id='Personal-Details'>
                <Col id='newPaymentPersonalDetails' xs={12} md={12}>

                  <Row className="spacingBottom">
                    <Col xs={6} md={6}>
                      <CustomInput tabIndex={1} isPersonalMedical={true} label="Cardholder Name*" name='cardNickName' placeholder="Enter cardholder name" id='cardNickName' notCapital={true} value={userCardJsonSet?.cardNickName}
                        onChange={(e) => handleCardDetails(e, "cardNickName")}
                      />
                      {(errMsg.cardNickNameErr) && <><span className="err-msg-show">{errMsg.cardNickNameErr}</span></>}
  
                    </Col>
                    <Col xs={6} md={6}>
                      <div id="custom-input-field" className="financial-Adviser-Class " style={{ fontSize: "14px" }}>
                        <p style={{ fontWeight: "600" }}>Card Number*</p>
                        <input
                          type="text"
                          tabIndex={2}
                          placeholder="Enter card number"
                          maxLength="19"
                          name="cardNumber"
                          value={formatCreditCardNumber(userCardJsonSet?.cardNumber) ?? ""}
                          onChange={(e) => handleCardDetails(e.target.value, 'cardNumber')}
                          className="form-control"
                          style={{ fontSize: "14px", height: "44px", border: "1px solid #AEAEAE", borderRadius: "6px", marginTop: "5px" }}
                        />
                      </div>
                      {(errMsg.cardNumberErr) && <><span className="err-msg-show">{errMsg.cardNumberErr}</span></>}
                    </Col>
                  </Row>

                  <Row className="spacingBottom">
                    <Col xs={6} md={6}>
                      <div id="custom-input-field" className="financial-Adviser-Class " style={{ fontSize: "14px" }}>
                        <p style={{ fontWeight: "600" }}>Expiration Date*</p>
                        <input
                          type="text"
                          placeholder="Enter expire date"
                          maxLength="5"
                          name="expireDate"
                          tabIndex={3}
                          value={expiryDateValidationInput(userCardJsonSet?.expireDate) ?? ""}
                          onChange={(e) => handleCardDetails(e.target.value, 'expireDate')}
                          className="form-control"
                          style={{ fontSize: "14px", height: "44px", border: "1px solid #AEAEAE", borderRadius: "6px", marginTop: "5px" }}
                        />
                      </div>
  
                      {(errMsg.expireDateErr) && <><span className="err-msg-show">{errMsg.expireDateErr}</span></>}
                    </Col>
                    {$AHelper.$isNullUndefine(userCardJsonSet?.paymentProfileId) && <Col xs={6} md={6}>
                      <div id="custom-input-field" className="financial-Adviser-Class " style={{ fontSize: "14px" }}>
                        <p style={{ fontWeight: "600" }}>CVV*</p>
                        <input
                          type="text"
                          placeholder="Enter CVV"
                          maxLength="4"
                          name="cardCvv"
                          tabIndex={4}
                          value={userCardJsonSet?.cardCvv ?? ""}
                          onChange={(e) => handleCardDetails(e.target.value, 'cardCvv')}
                          className="form-control"
                          style={{ fontSize: "14px", height: "44px", border: "1px solid #AEAEAE", borderRadius: "6px", marginTop: "5px" }}
                        />
                      </div>
  
                      {(errMsg.cardCvvErr) && <><span className="err-msg-show">{errMsg.cardCvvErr}</span></>}
                    </Col>}
                  </Row>
  
                  <Row className="spacingBottom">
                    <Col xs={12} md={12}>
  
                      <div id='custom-input-field' className="custom-input-field full-width">
                        <p>Billing Address*</p>
                        <input tabIndex={4} label="Billing Address*" type='text' className='' placeholder="Enter billing address" name='billingAddress'
                          id='streetAddress' ref={searchInput} defaultValue={userCardJsonSet?.streetAddress} onBlur={setAddressLine1Data} notCapital={true} onChange={(e) => autoCompleteAddress(e, "streetAddress")} />
                        {(errMsg.streetAddressErr) && <><span className="err-msg-show mb-2">{errMsg.streetAddressErr}</span></>}</div>
                    </Col>
                  </Row>

                  <Row className="spacingBottom">
                    <Col xs={12} md={12}>
                      <CustomInput tabIndex={5} isPersonalMedical={true} name='apartmentNo' label="House No" placeholder="Enter house no" id='apartmentNo' notCapital={true} value={userCardJsonSet?.apartmentNo}
                        onChange={(e) => handleCardDetails(e, "apartmentNo")}
                      />
                    </Col>
                  </Row>

                  <Row className="spacingBottom">
                    <Col xs={4} md={4}>
                      <CustomInput tabIndex={6} isPersonalMedical={true} name='city' label="City*" placeholder="Enter city" id='city' notCapital={true} value={userCardJsonSet?.city}
                        onChange={(e) => handleCardDetails(e, "city")}
                      />
                      {(errMsg.cityErr) && <><span className="err-msg-show">{errMsg.cityErr}</span></>}
                    </Col>
                    <Col xs={4} md={4}>
                      <CustomInput tabIndex={7} isPersonalMedical={true} name='state' label="State*" placeholder="Enter state" id='state' notCapital={true} value={userCardJsonSet?.state}
                        onChange={(e) => handleCardDetails(e, "state")}
                      />
                      {(errMsg.stateErr) && <><span className="err-msg-show">{errMsg.stateErr}</span></>}
                    </Col>
                    <Col xs={4} md={4}>
                      <CustomInput tabIndex={8} isPersonalMedical={true} name='zipCode' label="Zip Code*" placeholder="Enter zip code" id='zipCode' notCapital={true} value={userCardJsonSet?.zipCode}
                        onChange={(e) => handleCardDetails(e, "zipCode")}
                      />
                      {(errMsg.zipCodeErr) && <><span className="err-msg-show">{errMsg.zipCodeErr}</span></>}
                    </Col>
                  </Row>
  
                </Col>
              </Row>
            </div>
  
          </div>
  
  
          {formOnlyUse != true ? <div className="modal-footer ">
            <p className='fw-bold fs-6' style={{ color: "#720D21" }}>Note: <span className='fs-6 fw-light'>You can update your card once every 24 hours. The 24-hour period starts after your subscription or card update.</span></p>
            {([false.null].includes(userCardJsonSet?.isDefault)) &&
              <button className='btn-btn' tabIndex={9} onClick={() => makeCardDefault()}> Set as default {props?.modalType}</button>}
            <CustomButton tabIndex={10} onClick={() => saveAndEditCardDetails()} label={`${props?.updateCard ? "Update" : "Save"}`} />
  
          </div> : 
          <div className="modal-footer px-0">
            <CustomButton tabIndex={11} onClick={() => saveAndEditCardDetails()} label={"Save"} />
          </div>
          }
  
        </>)

  if(formOnlyUse) return (
    <>
    {MainForm}
    </>
  )
  return (
      <>
          <div id="newModal" className='modals'>
              <div className="modal" style={{ display: 'block' }}>
                  <div className="modal-dialog costumModal" style={{ maxWidth: '500px', margin: 'auto' }}>
                      <div className="costumModal-content">
                          <div className="modal-header mt-3 ms-1">
                              <h5 className="modal-title">{`${props?.updateCard ? "Update" : "Add"} Payment Method`}</h5>
                              <img className='mt-0 me-1 cursor-pointer' onClick={props.handleClose} src='/icons/closeIcon.svg'></img>
                          </div>
                          {MainForm}
                      </div>
                  </div>
              </div>
          </div>

      </>

  )
}

export default forwardRef(NewPaymentModal);