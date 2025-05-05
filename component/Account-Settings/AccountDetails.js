import React, { useEffect, useState, useRef, useContext, useMemo } from 'react'
import { CustomInput,CustomNumInputPassword} from '../Custom/CustomComponent'
import ContactRezex from '../Custom/Contact/ContactRezex'
import { $AHelper } from '../Helper/$AHelper'
const axios = require("axios").default;
import { getApiCall2 ,getApiCall,postApiCall,getSMSNotificationPermissions,postApiCallNew} from '../../components/Reusable/ReusableCom'
import { $Service_Url } from '../../components/network/UrlPath'
import { separateCountryCodeAndNumber } from '../Custom/Contact/ReusableAddressContact'
import { isNotValidNullUndefile } from '../../components/Reusable/ReusableCom'
import { $postServiceFn } from '../../components/network/Service'
import usePrimaryUserId from '../Hooks/usePrimaryUserId'
import { useLoader } from '../utils/utils'
import { globalContext } from '../../pages/_app'
import { demo } from '../../components/control/Constant'
import Button from 'react-bootstrap/Button';
import { auth0CredDev,auth0Cred } from '../../components/auth0Files/auth0Cred'
import { createSentTextJsonForOccurrene,createSentEmailJsonForOccurrene } from '../../components/control/Constant'
import { $getServiceFn } from '../../components/network/Service'
import { Col,Row,Modal} from 'react-bootstrap';
import { fetchPrimaryDetails } from '../Redux/Reducers/personalSlice';
import { useAppDispatch } from '../Hooks/useRedux';



const AccountDetails = ({profileData,setprofileData,emailTmpObj, textTmpObj, sentMail, commChannelId}) => {
const {firstName,lastName,mobile,email,confirmPassword,oldPassword,newPassword,countryCode} = profileData 
const [oldtype, setOldType] = useState('password');
const [newtype, setNewType] = useState('password');
const [cnfrmtype, setcnfrmType] = useState('password');
const [errMsg, setErrMsg] = useState();
const [isEdit, setIsEdit] = useState(false)
const [memberDetails, setmemberDetails] = useState()
const [contactDetails, setContactDetails] = useState()
const emailData = (contactDetails?.find(item => item?.emailData) || {}).emailData;
const mobileData = (contactDetails?.find(item => item?.mobileData) || {}).mobileData;
const { setWarning, newConfirm } = useContext(globalContext)
const [isClientPermissions, setIsClientPermissions] = useState(false);
const [timer, setTimer] = useState(false);
const [isDisable, setIsDisable] = useState(false)
const [logoutModal, setLogoutModal] = useState(false)
const [showPasswordModal, setshowPasswordModal] = useState(false)
const [passCritErr, setpassCritErr] = useState({})
const dispatch = useAppDispatch();

let timerOn = true;
const [errorMessages, setErrorMessages] = useState({
    errorMessage: '',
    errorMessage2: '',
    errorMessage3: '',
  });
const {loggedInUserId,primaryUserId} = usePrimaryUserId();


useEffect(() => {
    if(timer === 0 ){
      $getServiceFn.handleLogout()
      setLogoutModal(false)
    }
  }, [timer])


useEffect(() => {
     if(isNotValidNullUndefile(loggedInUserId)){
        getMemberDetails(loggedInUserId)
     }    
  }, [loggedInUserId])

   const handleInputChange =(data,key)=>{
    setprofileData((prevState) => ({
        ...prevState,
        [key]: data, // Update the specific key with the new value
      }));

      if (key == "newPassword") {
        let msg = "";
        let msg2 = "";
        let msg3 = "";
      
        if (isNotValidNullUndefile(confirmPassword)) {
          msg2 = data === confirmPassword ? "" : "Passwords must be the same";
        }      
        setErrorMessages((prev) => ({
          ...prev,
          errorMessage: msg,
          errorMessage2: msg2,
          errorMessage3: msg3,
        }));
        $AHelper.$checkPasswordCriteria(data, setpassCritErr)
      } else if (key == "cnfmpassword"){
        checkWithNewPassword(data)
      } else if(key == "oldPassword"){
        setIsDisable(false)
        setErrorMessages((prev) => ({
            ...prev,
            errorMessage: '',
            errorMessage3: '',
          }));
      }
      
      hideErrMsg(key)
   }


   function timerFunction(remaining) {
    setTimer(remaining) ;
    remaining -= 1;
    
    if( remaining >= 0 && timerOn ) {
      setTimeout(function() {
        timerFunction(remaining);
      }, 1000);
      return;
    }

}   

const handleToggle = (name) => {
    const typeSetters = {
      oldpassword: setOldType,
      newpassword: setNewType,
      confirmpassword: setcnfrmType,
    };
  
    typeSetters[name]((prevType) => (prevType === "password" ? "text" : "password"));
  };
  
   const setMobileNumber =(data)=>{   
    setprofileData((prevState) => ({
        ...prevState,
        ["mobile"]: data, // Update the specific key with the new value
      })); 
    
      
   }
   const setcountryCode =(data)=>{   
    setprofileData((prevState) => ({
        ...prevState,
        ["countryCode"]: data, // Update the specific key with the new value
      }));
    
   }
   const hideErrMsg = (key) => {
    if ($AHelper.$isNotNullUndefine(errMsg?.[key])) {
      setErrMsg(prev => ({ ...prev, [key]: '' }));
    }
  }


  const SaveData = ()=>{       
    if(isEdit){
        updateUserData() 
    }else{
        setIsEdit(true)
        
    }
  }
  const updateUserData =(fileId)=>{
    const SubtenantId = sessionStorage.getItem("SubtenantId")
    const {fName,lName,matNo,userId,nickName,mName,dob,isVeteran,isPrimaryMember,suffixId,citizenshipId,noOfChildren,genderId,maritalStatusId,signatureId,memberStatusId,dateOfWedding,dateOfDeath,updatedBy,memberRelationship,birthPlace} = memberDetails?.member || {};    
    const upDateJson = {
      "subtenantId": SubtenantId,
      "fName":  isEdit && fName !== firstName ? firstName : fName,
      "mName": mName,
      "lName": isEdit && lName !== lastName ? lastName : lName,
      "nickName": nickName,
      "dob": dob,
      "isVeteran": isVeteran,
      "isPrimaryMember": isPrimaryMember,
      "suffixId": suffixId,
      "citizenshipId": citizenshipId,
      "noOfChildren": noOfChildren,
      "genderId": genderId,
      "maritalStatusId": maritalStatusId,
      "birthPlace": birthPlace,
      "fileId": fileId,
      "signatureId": signatureId,
      "memberStatusId": memberStatusId,
      "dateOfWedding": dateOfWedding,
      "dateOfDeath": dateOfDeath,
      "matNo": matNo,
      "userId": userId,
      "updatedBy": loggedInUserId
    }   
 
    if (isEdit) {      
        const userFullname = fName + " " + lName.toUpperCase()
        const userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))
        const newErrors = {
            firstName: !isNotValidNullUndefile(firstName) && "First Name field is mandatory",
            lastName: !isNotValidNullUndefile(lastName) && "Last Name field is mandatory",
            email: !isNotValidNullUndefile(email) && "Email field is mandatory",
            mobile: !isNotValidNullUndefile(mobile)  ? "Phone number field is mandatory" : mobile.length < 10 && "Phone number is invalid",
        };

        const filteredErrors = Object?.fromEntries(
            Object?.entries(newErrors).filter(([_, value]) => value)
        );    
     
      
        if (Object?.keys(filteredErrors).length > 0) {
            setErrMsg(filteredErrors);
            return;
        }  
      
           if (errMsg && typeof errMsg == 'object' && Object.values(errMsg).some(value => value !== "")) {
            return;
        }
     
        if(isNotValidNullUndefile(firstName) && isNotValidNullUndefile(lastName) && isNotValidNullUndefile(email) && isNotValidNullUndefile(mobile) && isNotValidNullUndefile(fName) && isNotValidNullUndefile(lName)){
            if (firstName !== fName || lastName !== lName) {
                useLoader(true);
                    $postServiceFn.putUserInfo2(upDateJson, (res) => {
                    useLoader(false);
                    const keyToUpdate = primaryUserId == userId ? "memberName" : "spouseName";
                    userDetailOfPrimary[keyToUpdate] = firstName + " " + lastName;
                    [dispatch(fetchPrimaryDetails({ userId: primaryUserId }))]                   
                    sessionStorage.setItem('userDetailOfPrimary', JSON.stringify(userDetailOfPrimary));
                    setIsEdit(false);
                    getMemberDetails(userId)                    
                });
            }
            contactUpdate(userId,userFullname);
        }else{
          if(!isNotValidNullUndefile(email) &&  !isNotValidNullUndefile("userName") && !isNotValidNullUndefile(mobile))
            
          toasterAlert("warning", "Please anter your data")
             
        }
      
      
    } else {
        useLoader(true);
        $postServiceFn.putUserInfo2(upDateJson, (res) => {
            useLoader(false);
            if(!isNotValidNullUndefile(fileId)){
                // AlertToaster.success("Image deleted successfully")
                window.location.reload()
            }
          
        });
    }
    
    


}

const contactUpdate = async(userId,userFullname)=>{
   
    const updateJson =
    {
        "userId": userId,
        "activityTypeId": "4",
        "contact": {
            "mobiles": mobileData?.mobileNo === countryCode + mobile ? [] :
                [

                    {
                        "contactTypeId": mobileData?.contactTypeId,
                        "mobileNo": countryCode + mobile,
                        "updatedBy": loggedInUserId,
                        "mobileOther": null,
                        "commTypeId": 1,
                        "contactId": mobileData?.contactId
                    }

                ],

        }
    }   
    if ((mobileData?.mobileNo !== countryCode + mobile)) {
        useLoader(true);
        const userLoggedInDetail = JSON.parse(sessionStorage.getItem("userLoggedInDetail"))
        const _resultUpdateData = await postApiCall("PUT",$Service_Url.updateContactDetailsPath + userId, updateJson);
        useLoader(false);
        if (_resultUpdateData !== 'err') {
            setIsEdit(false);
            if (emailData?.emailId !== email) {
                userLoggedInDetail.primaryEmailId = email;
                sessionStorage.setItem('userLoggedInDetail', JSON.stringify(userLoggedInDetail));
            }
            getMemberDetails(userId);
            let oldFullName = firstName + " " + lastName 
            if (oldFullName?.toLowerCase() !== userFullname?.toLowerCase() && isNotValidNullUndefile(firstName) && isNotValidNullUndefile(lastName)
            ) {
                toasterAlert("successfully","Successfully updated data" ,"User details updated successfully")
            } else {
              
                toasterAlert("successfully","Successfully updated data" ,"Contact updated successfully")
            }
        }


    }
    if (emailData?.emailId !== email) {
        let jsonObj = {
            "currentUserName": emailData?.emailId,
            "newUserName": email,
            "updatedBy": loggedInUserId,
            "remarks": "Client Primary Email Updated by Legal",
            "clientIPAddress": "::1",
            "isParaResquest": true
        }
        const confirmRes = await newConfirm(true, "Are you sure you want to change the email? If confirm, a reactivation link will be automatically sent to the client's account after the email is updated.", 'Permission', 'Confirmation', 3)
        if (confirmRes) {
            useLoader(true)
            let result = await postApiCallNew('PUT', $Service_Url.putUserNameEmail, jsonObj);           
                if (result?.isError == "True" && result?.resPonse?.data?.messages?.length > 0) {
                let msg = result?.resPonse?.data?.messages[0]
                toasterAlert("warning",msg)
                useLoader(false);
                return;
              }
            const _resultClientData = await getApiCall2('GET', $Service_Url.getUserDetailsByUserEmailId + `?emailId=${email}`);
            if (_resultClientData == 'err') useLoader(false);
            if (_resultClientData == 'err' && _resultClientData.data.length < 0) return;
            const { signUpPlatform, id, userId } = _resultClientData?.data[0];
            let notifiy = await getSMSNotificationPermissions(userId, setIsClientPermissions);
            const jsonUserActivation = { "userRegstrtnId": id, "userId": userId, "signUpPlatform": signUpPlatform, "createdBy": loggedInUserId, "clientIPAddress": "::1" }
            if (notifiy == 'err') useLoader(false);
            const _resultGetActivationLink = await postApiCall('POST', $Service_Url.getUserActivationLink, jsonUserActivation);
            useLoader(false)
            sentTextNMail(_resultGetActivationLink?.data?.data?.activationURL)
        }
        else {
            getMemberDetails()
            setIsEdit(false)
        };


    }
    else {
          let oldFullName = firstName + " " + lastName 
        if (oldFullName.toLowerCase() !== userFullname.toLowerCase()) {
            toasterAlert("successfully", "Successfully updated data" , "Name updated successfully")
            
        }
        setIsEdit(false)
    }

    
}
const sentTextNMail = async (url) => {
    const { textTemplateType, textTemplateId } = textTmpObj?.textTempData[0];
    const { templateType, emailSubject, templateId } = emailTmpObj?.emailTempData[0];
    const emailTo = email;
    const textTo = isClientPermissions ? countryCode + mobile : '';
  
    const emailJson = createSentEmailJsonForOccurrene({
      emailType: templateType,
      emailTo,
      emailSubject,
      emailContent: replaceTemplate(emailTmpObj.emailTemp, url),
      emailTemplateId: templateId,
      emailMappingTablePKId: loggedInUserId,
      emailStatusId: 1,
      createdBy: loggedInUserId,
    });
    const textJson = createSentTextJsonForOccurrene({
      smsType: textTemplateType,
      textTo,
      textContent: replaceTemplate(textTmpObj.textTemp, url),
      smsTemplateId: textTemplateId,
      smsMappingTablePKId: loggedInUserId,
      smsStatusId: 1,
      createdBy: loggedInUserId,
    });
  
    useLoader(true);
    if (await sentMail(emailJson, textJson) === 'resolve') {
      setLogoutModal(true)
      timerFunction(20);
    }
    useLoader(false);
  };
  
  const replaceTemplate = (temp, url) => {
    let TemplateContent = temp;
    const _subtenantName = sessionStorage.getItem('subtenantName');
    const uniqueLink = url;

    TemplateContent = TemplateContent.replace("@@SUBTENANTNAME", _subtenantName);
    TemplateContent = TemplateContent.replace("@@ACTIVATE_LINK", uniqueLink);
    TemplateContent = TemplateContent.replace("@@ACTIVATE_LINK", uniqueLink);
    TemplateContent = TemplateContent.replace("@@USER",`${firstName} ${lastName}`);
    TemplateContent = TemplateContent.replace("@@OLDEMAILADDRESS", emailData?.emailId);
    TemplateContent = TemplateContent.replace("@@NEWEMAILADDRESS", email);
    return TemplateContent;
}


const getMemberDetails = async (loggedInUserIds) => {
    useLoader(true);  
    const [userData, contactResponse] = await Promise.all([
      getApiCall("GET", `${$Service_Url.getFamilyMemberbyID}${loggedInUserIds}`, setmemberDetails),
      getApiCall2("GET", `${$Service_Url.getcontactdeailswithOther}${loggedInUserIds}`)
    ]);  
    if (userData !== "err") {
      const contact = contactResponse?.data?.data?.contact || {};
      const mobile = filterContacts(contact?.mobiles) || [];
      const email = filterContacts(contact?.emails) || [];
      const { number = "", countryCode = "" } = mobile?.length ? separateCountryCodeAndNumber(mobile[0]?.mobileNo) : {};
  
      setContactDetails([
        { emailData: email[0] || "" },
        { mobileData: mobile[0] || "" }
      ]);
  
      setprofileData({
        email: email[0]?.emailId || "",
        mobile: number,
        countryCode,
        firstName: userData?.member?.fName || "",
        lastName: userData?.member?.lName || ""
      });
  
    //   if (isNotValidNullUndefile(userData?.member?.fileId)) {
    //     getProfilePic(userData?.member?.userId, userData?.member?.fileId);
    //   }
    }  
    useLoader(false);
  };
  
const filterContacts = (data) => {
    return data?.filter((ele) => {
        return ele?.contactTypeId === 1;
    });
  }
  const emailValidate = (typeofSave) => {    
    let regexName = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    switch (typeofSave) { 
      case "email":
        if ((!regexName.test(email)) && email !== "") {
            setprofileData((prevState) => ({
                ...prevState,
                [typeofSave]: "" , // Update the specific key with the new value
              }));
              setErrMsg((prevState) => ({
                ...prevState,
                [typeofSave]: "Enter a valid email" , // Update the specific key with the new value
              }));
              
            toasterAlert("warning", "Enter the valid Email Id")
            break;
          }
        break;
   
    }
};



/////////////////////////////password flow 
const validatePassword = async (e) => {
    const inputValue = oldPassword;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*=_+\-<>{}[\]():";?',.\\\/|~`])[A-Za-z\d!@#$%^&*=_+\-<>{}[\]():";?',.\\\/|~`]{8,}$/;
        if ((newPassword !== confirmPassword) || (newPassword === oldPassword) || (!passwordRegex.test(newPassword)) || (!isNotValidNullUndefile(oldPassword))) {
    
         let errMsgs = ''
         let errMsgs2 = ''
         let errMsgs3 = ''
        if(!isNotValidNullUndefile(oldPassword)){
            errMsgs ='Please enter your old password'  
        } 
        if(!isNotValidNullUndefile(newPassword)){
            errMsgs3 ='Please enter your new password'  
        } 
        if(!isNotValidNullUndefile(confirmPassword)){
            errMsgs2 ='Please enter your confrim password'  
        } 
        if(newPassword == oldPassword && isNotValidNullUndefile(confirmPassword)){                     
            errMsgs3 ='New password cannot be same as current password'      
       } 
        if(isNotValidNullUndefile(newPassword) &&  !passwordRegex.test(newPassword)){                     
            errMsgs3 = "Please enter a valid password"        
        }
        setErrorMessages((prev) => ({
            ...prev,             
            errorMessage3: errMsgs3,
            errorMessage: errMsgs,
            errorMessage2: errMsgs2,
        }));



        return;
    }
    setErrorMessages((prev) => ({
        ...prev,
        errorMessage: '',
        errorMessage2: '',
        errorMessage3: '',
      }));
     
    setIsDisable(true)
    isNotValidNullUndefile(inputValue) && authenticateUser(email, inputValue).then(response => {      
        setIsDisable(true)
            setErrorMessages((prev) => ({
                ...prev,             
                errorMessage: '',
              }));
            handleChangePassword()
        }).catch(error => {
                setErrorMessages((prev) => ({
                    ...prev,             
                    errorMessage: "Please enter your correct password",
                  }));
           
        });

}
async function authenticateUser(username, password) {
    try {
        const auth0CredLocal = (demo) ? auth0CredDev : auth0Cred;
        const response = await axios.post(`https://${auth0CredLocal.domain}/oauth/token`, new URLSearchParams({
            grant_type: 'password',
            password: password,
            username: username,
            audience: auth0CredLocal.apiAudience,
            scope: auth0CredLocal.scope,
            client_id: auth0CredLocal.clientId,
            client_secret: auth0CredLocal.clientSecret,
            responseType: auth0CredLocal.responseType,
            responseMode: auth0CredLocal.responseMode
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        const statusCode = error?.status || "No status code";  // ✅ Get status safely
        throw statusCode;
    }
}
const handleChangePassword =async() => {
    useLoader(true); 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*=_+\-<>{}[\]():";?',.\\\/|~`])[A-Za-z\d!@#$%^&*=_+\-<>{}[\]():";?',.\\\/|~`]{8,}$/;

    if (passwordRegex.test(newPassword)) {
        let url = $Service_Url.resetPassword;
        let json = {
            "userName": email,
            "emailID": email,
            "requestedIP": "::1",
            "commMedium": "Email",
            "commSendOn": email
          }
        useLoader(true);  
        let result = await postApiCall("POST",url,json)
        const urlParams = new URLSearchParams(result?.data?.data?.generatedLink);
        const resetLinkKey = urlParams.get('resetLinkKey');            
        let url2 = $Service_Url.getUserDetailsByUSerID + resetLinkKey + "/" + "::1"            
        let getUserData = await getApiCall2("GET",url2) 
        const {userName,userId,auth0Id,forgotPasswordId} = getUserData?.data?.data
        const input = {
            userName: userName,
            userId: userId,
            auth0Id: auth0Id,
            password: newPassword,
            accessIP: "::1",
            forgotPasswordId: forgotPasswordId
        }
          let updatePasswordApi = await postApiCall("POST",$Service_Url?.updatePassword,input)
          useLoader(false); 
          if(updatePasswordApi?.data?.messages.length > 0 && updatePasswordApi?.data?.messages[0] === "Password changed successfully"){
            toasterAlert("successfully","Successfully updated data" ,updatePasswordApi?.data?.messages[0])
            setIsDisable(false)
            clearAll()
          }

        
        
    } else {
        useLoader(false); 
        setErrorMessages((prev) => ({
            ...prev,             
            errorMessage3: 'Please enter a valid password',
          }));
    }
};
const clearAll =()=>{  
    setshowPasswordModal(false)
    setpassCritErr({})
    setprofileData((prev) => ({
        ...prev,
        oldPassword: '',
        confirmPassword: '',
        newPassword: '',
      }));
    setErrorMessages((prev) => ({
        ...prev,
        errorMessage: '',
        errorMessage2: '',
        errorMessage3: '',
      }));
    
   
}

const checkWithNewPassword = (data) => {
    const errorMessage2 = data !== newPassword && isNotValidNullUndefile(newPassword) 
      ? "Your password does not match" 
      : "";  
    setErrorMessages((prev) => ({
      ...prev,
      errorMessage2,
    }));
};
const CancalEdit =()=>{
    getMemberDetails(loggedInUserId)
    setIsEdit(false)
    setErrMsg({})
}
const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
}

const isDisableBtn = !(isNotValidNullUndefile(oldPassword) && isNotValidNullUndefile(newPassword) && isNotValidNullUndefile(confirmPassword))
  
////////////////////////////////////

  
  return (
    <>
    <div >
        {/* profile data */}
              <Row style={{ borderBottom: "1px solid #EBEBEB" }}>
                  <Col lg="6" md="6" sm="6" xs="6">
                      <div><h2 className='fw-bold' style={{ fontWeight: "600", fontSize: "16px", marginBottom: "3px" }}>Personal Details</h2></div>
                      <div style={{ fontSize: "13px", color: "#5E5E5E", marginBottom: "1rem" }}><p>Update your personal info.</p></div>
                  </Col>
               
                 {!isEdit && <Col lg="6" md="6" sm="6" xs="6" className='d-flex justify-content-end mb-3'>
                      <div className="d-flex justify-content-end me-2">
                          <button style={{width:"18rem"}} onClick={SaveData} className={"profileDetailsEditButton border-0 me-1"}><img src="/New/newIcons/greyPencil.svg" className="profileDetailsEditButtonImg " />Edit Personal Details</button>
                      </div>
                  </Col>}
             
              </Row>
              <Row className='mt-3'>
                  <Row className="mb-2 gapNoneAddAnother">
                      <Col className='me-1' xs={3} md={10} lg={5}>
                          <CustomInput label="First Name" tabIndex={6} placeholder="Enter First Name" onChange={(e) => handleInputChange(e, 'firstName')} id='firstName' value={firstName} isDisable={!isEdit} />
                          {(errMsg?.firstName) && <><span className="err-msg-show">{errMsg?.firstName}</span></>}
                      </Col>
                      <Col className='me-1' xs={3} md={10} lg={5}>
                          <CustomInput label="Last Name" tabIndex={6} placeholder="Enter Last Name" onChange={(e) => handleInputChange(e, 'lastName')} id='lastName' value={lastName} isDisable={!isEdit} />
                          {(errMsg?.lastName) && <><span className="err-msg-show">{errMsg?.lastName}</span></>}
                      </Col>
                      




                  </Row>
                  <Row className="mb-2 gapNoneAddAnother">
                      <Col className="me-1" xs={3} md={10} lg={5}>
                          <CustomInput
                              label="Email"
                              placeholder='i.e johnoe@gmail.com'
                              id='email'
                              value={email}
                              onChange={(val) => handleInputChange(val, 'email')}
                              isDisable={!isEdit}
                              notCapital = {true}
                              onBlur={() => emailValidate("email")}
                          />
                          {(errMsg?.email) && <><span className="err-msg-show">{errMsg?.email}</span></>}
                      </Col>
                      <Col id='AccountDetailsContact' className='me-1' xs={3} md={10} lg={5}>
                          <ContactRezex isPersonalMedical={true}  hideCommType={true} setValue={setMobileNumber} mobileNumber={mobile} hideErrMsg={hideErrMsg} isMandatory={true} errMsg={errMsg} countryCode={countryCode} setcountryCode={setcountryCode} comType={"comType"} handleSelectChange={handleInputChange} isDisable={!isEdit} />
                          {(errMsg?.mobile) && <><span className="err-msg-show">{errMsg?.mobile}</span></>}
                      </Col>

                  </Row>
                   {isEdit && <Row >





                  <Col lg="12" md="12" sm="12" xs="12" className='d-flex justify-content-end mb-3'>
                      <div className="d-flex justify-content-end me-2">
                          <button style={{width:"5rem"}} onClick={SaveData} className="profileDetailsSaveButton border-0 me-1">Save</button>
                          {isEdit && <button onClick={CancalEdit} className="profileDetailsEditButton border-0">Cancel</button>}
                      </div>
                  </Col>
              </Row>}




              </Row>


    {/* Password data */}


              <Row style={{ borderBottom: "1px solid #EBEBEB",marginTop:"5px"}}>
                 
                 {!showPasswordModal && <Col lg="6" md="6" sm="6" xs="6" className='d-flex justify-content-start mb-3 mt-3'>



                  <button  style={{width:"18rem"}} onClick={()=>setshowPasswordModal(!showPasswordModal)} className={"profileDetailsEditButton border-0 me-2"}><img src="/New/newIcons/greyPencil.svg" className="profileDetailsEditButtonImg "/>Change Password</button>
                  </Col>}

              </Row>
              {showPasswordModal && <Row className='mt-3 mb-5' style={{ borderBottom: "1px solid #EBEBEB"}}>                 
              <Col lg="6" md="6" sm="6" xs="6">
                      <div><h2 className='fw-bold' style={{ fontWeight: "600", fontSize: "16px", marginBottom: "3px" }}>Change Password</h2></div>
                      <div style={{ fontSize: "13px", color: "#5E5E5E",marginBottom:"1rem"}}><p>Change your password.</p></div>
              </Col>                 
              </Row>}

              {showPasswordModal && <><Row className='mt-3' >
                  <Row className="gapNoneAddAnother">
                      <Col className="me-4" xs={5} md={5} lg={5}>
                          <CustomNumInputPassword tabIndex={1} label="Old Password" placeholder="Enter Old Password" id='oldPassword' onChange={(e) => handleInputChange(e, 'oldPassword')} value={oldPassword} notCapital={true} inputUserType={oldtype} handleToggle={() => handleToggle("oldpassword")} />

                          {(errorMessages.errorMessage) && <> <span className="err-msg-show">{errorMessages.errorMessage}</span></>}
                      </Col>
                  </Row>
                  <Row className='spacingBottom'>
                      <Col className="" xs={5} md={5} lg={5}>
                          <CustomNumInputPassword tabIndex={1} label="New Password" placeholder="Enter New Password" id='newPassword' onChange={(e) => handleInputChange(e, 'newPassword')} value={newPassword} notCapital={true} inputUserType={newtype} handleToggle={() => handleToggle("newpassword")} />
                          {(errorMessages.errorMessage3) && <> <span className="err-msg-show">{errorMessages.errorMessage3}</span></>}
                      </Col>
                      </Row>
              </Row>
              <Row className='mt-2' >
                  <Row className="gapNoneAddAnother">
                      <Col className="me-4" xs={5} md={5} lg={5}>
                          <CustomNumInputPassword tabIndex={1} label="Confirm Password" placeholder="Re-Enter New Password" id='confirmPassword' onChange={(e) => handleInputChange(e, 'confirmPassword')} value={confirmPassword} notCapital={true} inputUserType={cnfrmtype} handleToggle={() => handleToggle("confirmpassword")} onBlur={(e) => checkWithNewPassword(e, 'confirmPassword')} />
                          {(errorMessages.errorMessage2) && <> <span className="err-msg-show">{errorMessages.errorMessage2}</span></>}
                      </Col>


                  </Row>
              </Row>
                  <Row className='mt-2 mb-3' >
                      <Col lg="6" md="6" sm="6" xs="6" className='d-flex'>
                      <div>









                  <div className='singUp-check'>
                      {passCritErr?.islen8 ? <img className='mt-auto' src='/New/newIcons/greenCheck.svg' /> : <img className='mt-auto' src='/New/newIcons/greyCheck.svg ' />}
                      <p className='mb-0'>Must be at least 8 characters</p>
                  </div>
                  <div className='singUp-check'>
                      {passCritErr?.isUpperChar ? <img className='mt-auto' src='/New/newIcons/greenCheck.svg' /> : <img className='mt-auto' src='/New/newIcons/greyCheck.svg ' />}
                      <p className='mb-0'>Must contain at least one uppercase letter</p>
                  </div>
                  <div className='singUp-check'>
                      {passCritErr?.isalphaNum ? <img className='mt-auto' src='/New/newIcons/greenCheck.svg' /> : <img className='mt-auto' src='/New/newIcons/greyCheck.svg ' />}
                      <p className='mb-0'>Must contain alphanumeric characters</p>
                  </div>
                  <div className='singUp-check'>
                      {passCritErr?.isSpecialChar ? <img className='mt-auto' src='/New/newIcons/greenCheck.svg' /> : <img className='mt-auto' src='/New/newIcons/greyCheck.svg ' />}
                      <p className='mb-0'>Must contain one special character</p>
                  </div>
                  </div>
                      </Col>
                      <Col lg="6" md="6" sm="6" xs="6" className='d-flex justify-content-end align-items-end'>

                          <div className="d-flex">
                              <button style={{ cursor: "pointer" }} className="profileDetailsSaveButton border-0 me-1" onClick={() => validatePassword()}>Save</button>
                              <button onClick={clearAll} className="profileDetailsEditButton border-0">Cancel</button>
                          </div>
                      </Col>
                  </Row> 


               </>
               
              
              }
              <Modal show={logoutModal} backdrop="static" keyboard={false} centered>
                  <Modal.Header className="d-flex justify-content-center">
                      <Modal.Title >ALERT</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      {timer ? (
                          <>
                              < div className="text-center fs-3 my-3" id="timer">
                                  <h4>Activation link has been sent to the new updated email ID for login</h4><br />
                                  <h4 style={{ color: "#720c20" }}>Remaining Time: <span class="text-dark">{timer}</span></h4>

                              </div>
                          </>

                      ) : null}
                  </Modal.Body>
                  <Modal.Footer className="d-flex justify-content-center  mb-2" style={{ padding: "3px 5px", borderRadius: "5px", border: "1px solid #fff" }}>
                      <Button variant="secondary" onClick={() => $getServiceFn.handleLogout()}> <img className='mb-1 mt-0  intakelogoutBtn' src='/New/image/logOutIcon.svg' /><h5 className='d-inline logout_h3 ms-1'>Logout</h5></Button>

                  </Modal.Footer>
              </Modal>    
                    
    </div>
  
    </>
  )
}

export default AccountDetails




