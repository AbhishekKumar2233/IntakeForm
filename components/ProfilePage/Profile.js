import { useState,useEffect,useRef,useContext} from "react";
import {Row, Col,Card} from 'react-bootstrap'
import { demo ,createSentEmailJsonForOccurrene, createSentTextJsonForOccurrene} from "../control/Constant";
import Modal from "react-bootstrap/Modal";
const axios = require("axios").default;
import { SET_LOADER } from "../Store/Actions/action";
import { globalContext } from '../../pages/_app';
import ResetPassword from "./ResetPassword";
import useUserIdHook from "../Reusable/useUserIdHook";
import { $AHelper } from "../control/AHelper";
import { auth0Cred,auth0CredDev} from "../auth0Files/auth0Cred";
import VarificationCodeForProfilePage from "./VarificationCodeForProfilePage";
import SetNewPassword from "./SetNewPassword";
import AlertToaster from "../control/AlertToaster";
import { getApiCall,getApiCall2, isNotValidNullUndefile,postApiCall,getSMSNotificationPermissions, removeSpaceAtStart} from "../Reusable/ReusableCom";
import { $postServiceFn} from "../network/Service";
import { $Service_Url } from "../network/UrlPath";
import PhoneInput from "react-phone-input-2";
import { connect } from "react-redux";
import withOccurrenceApi from "../OccurrenceHoc/withOccurrenceApi";
import { Services,$CommonServiceFn,$getServiceFn } from "../network/Service";
import PlansSetting from "../AnnualMaintenanceAgreement/PlansSetting";

import Button from 'react-bootstrap/Button';
import konsole from "../control/Konsole";
const Profile=(props)=>{
    const { _subtenantId, _loggedInUserId, _primaryMemberUserId,_subtenantName } = useUserIdHook();
    const {dispatchloader,emailTmpObj, textTmpObj, sentMail, commChannelId} = props;
   
    const [oldtype, setOldType] = useState('password');
    const [isDisable, setIsDisable] = useState(false)
    const [newtype, setNewType] = useState('password');
    const [cnfrmtype, setcnfrmType] = useState('password');
    const [showModal, setShowModal] = useState(false);
    const[resetPassword,setResetPassword]=useState(true)
    const fileInputRef = useRef(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [memberDetails, setmemberDetails] = useState()
    const[varificationCode,setVarificationCode]=useState(false)  
    const [contactDetails, setContactDetails] = useState() 
    const [userLastName, setUserLastName] = useState("")
    const [userFirstName, setUserFirstName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userMobile, setUserMobile] = useState("")
    const loggedUserId = sessionStorage.getItem("loggedUserId") 
    const SubtenantId = sessionStorage.getItem("SubtenantId")
    const roleId = (JSON.parse(sessionStorage.getItem("stateObj")).roleId);
    const context = useContext(globalContext)
    const [logoutModal, setLogoutModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [numberLengthstate, setNumberLengthstate] = useState(0)
    const [currentPassword, setCurrentPassword] = useState();
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setconfirmNewPassword] = useState()
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');
    const [errorMessage3, setErrorMessage3] = useState('');
    const [otpJsonData, setOtpJsonData] = useState()
    const [verifiyOtp, setverifiyOtp] = useState('')
    const [newPasswordModal, setNewPasswordModal] = useState(false)
    const [activeSetting, setActiveSetting] = useState(props?.typeOf)
    const [openPlanSetting, setOpenPlanSetting] = useState(false)
    const emailData = (contactDetails?.find(item => item.emailData) || {}).emailData;
    const mobileData = (contactDetails?.find(item => item.mobileData) || {}).mobileData;
    const [timer, setTimer] = useState(false);
    const [errors, setErrors] = useState({});
    const [isClientPermissions, setIsClientPermissions] = useState(false);
     const [ newcountryCode, setnewcountryCode] = useState("+1");
    let timerOn = true;
    useEffect(() => {
        getMemberDetails()
      }, [])
 
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
   
    useEffect(() => {
      if(timer === 0 ){
        $getServiceFn.handleLogout()
        setLogoutModal(false)
      }
    }, [timer])
    
      
  
  const getMemberDetails =async()=>{
    let userid = _loggedInUserId
     let url = $Service_Url?.getFamilyMemberbyID + userid
     props.dispatchloader(true);
     let userData = await getApiCall("GET",url,setmemberDetails) 
     if(userData == "err"){
        props.dispatchloader(false)
    }  
     const _resultMemberDetails = await getApiCall2("GET", $Service_Url.getcontactdeailswithOther + userid);
     props.dispatchloader(false);
     let data = _resultMemberDetails?.data?.data?.contact
     let mobile = filterContacts(data?.mobiles)
     let email = filterContacts(data?.emails)
     let both = [{"emailData":email[0]},{"mobileData": mobile[0]}]
     setContactDetails(both)
     const {fName,lName} = userData?.member || {};
     setUserEmail(email.length > 0  ? email[0]?.emailId :"")
     setUserMobile(mobile.length > 0 ? mobile[0]?.mobileNo : "")
    
     setUserLastName(lName)
     setUserFirstName(fName)
     if(isNotValidNullUndefile(userData?.member?.fileId)){
        getProfilePic(userData?.member?.userId,userData?.member?.fileId)
       }
       

    
  }
  const filterContacts = (data) => {
    return data?.filter((ele) => {
        return ele?.contactTypeId === 1;
    });
  }


   
   const getProfilePic = async(userId,fileId)=>{
     const imageFileData = { "primaryUserId": userId, "fileId": fileId, "fileTypeId": 15, "fileCategoryId": 1, "requestedBy": loggedUserId};
     props.dispatchloader(true);
     const imageResult = await getFileDetails(imageFileData);
     props.dispatchloader(false);
     setImageUrl(imageResult === 'err' ? null : imageResult?.fileUrlPath);

   }
   const handleToggle = (name) => {
    let type;
    if (name === "oldpassword") {
        type = oldtype === "password" ? "text" : "password";
        setOldType(type);
    } else if (name === "newpassword") {
        type = newtype === "password" ? "text" : "password";
        setNewType(type);
    } else {
        type = cnfrmtype === "password" ? "text" : "password";
        setcnfrmType(type);
    }
};

   const closeRegistrationModal=()=>{
        setShowModal(false)
        setNewPasswordModal(false)
        setVarificationCode(false)
        setResetPassword(true)

   }
   const getFileDetails = (openFileInfo) => {
        return new Promise((resolve, reject) => {
          Services.getFileForView({ ...openFileInfo }).then((res) => {
            resolve(res?.data?.data)
          }).catch((err) => {
            resolve('err')
          })
    
        })
    
   }
    const handleFileChange = async (event)=>{
         const file = event.target.files[0];
        if (file) {

            const fileSizeInBytes = file.size;
            const fileSizeInKB = fileSizeInBytes / 1024;
            const fileSizeInMB = fileSizeInKB / 1024;
    
            if (fileSizeInMB > 2) {
               AlertToaster.warn("File size exceeds 2MB limit");
            }else{
                const url = URL.createObjectURL(file);
                setImageUrl(url)    
                props.dispatchloader(true);
                const fileIds = isNotValidNullUndefile(file) ? await fileSignupload(file,loggedUserId,memberDetails?.member?.userId,15,1,2) : null; 
                props.dispatchloader(false);
                AlertToaster.success("Image uploaded successfully")
                updateUserData(fileIds)

            }



       
        }
        
    } 
    const fileSignupload = (file,createdBy,userId,fileTypeId,fileCategoryId,fileStatusId) => {
        return new Promise((resolve, reject) => {            
          Services.postfileuploadspeaker(file,createdBy,userId,fileTypeId,fileCategoryId,fileStatusId).then((res) => {
            let response = res?.data?.data?.fileId
            resolve(response)
            setFile(null)
    
          }).catch((err) => {
            resolve('err')
          })
        })
    
    
    
      };

    const handleButtonClick = () => {
        fileInputRef.current.click(); // Trigger click on hidden file input
      };
    const deleteImg=()=>{
        if(isNotValidNullUndefile(imageUrl) && imageUrl !== '/icons/ProfilebrandColor2.svg'){
            updateUserData(null)
        }
        setImageUrl("/icons/ProfilebrandColor2.svg") 
       

    }  
 
  
    const updateUserData =(fileId)=>{
        const newErrors = {};
        const {fName,lName,matNo,userId,nickName,mName,dob,isVeteran,isPrimaryMember,suffixId,citizenshipId,noOfChildren,genderId,maritalStatusId,signatureId,memberStatusId,dateOfWedding,dateOfDeath,updatedBy,memberRelationship,birthPlace} = memberDetails?.member || {};
        
        const upDateJson = {
          "subtenantId": SubtenantId,
          "fName":  isEdit && fName !== userFirstName ? userFirstName.toUpperCase() : fName.toUpperCase(),
          "mName": mName,
          "lName": isEdit && lName !== userLastName ? userLastName.toUpperCase() : lName.toUpperCase(),
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
          "updatedBy": _loggedInUserId
        }   
        if (isEdit) {
            const userFullname = fName + " " + lName.toUpperCase()
            const userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))
            if(!isNotValidNullUndefile(userFirstName)){
                newErrors.fName = 'First Name field is mandatory';
            }
            if(!isNotValidNullUndefile(userLastName)){
                newErrors.lName = 'Last Name field is mandatory';
            }
            if(!isNotValidNullUndefile(userEmail)){
                newErrors.email = 'Email field is mandatory';
            }
            if(!isNotValidNullUndefile(userMobile) || userMobile?.length < numberLengthstate){
                newErrors.mobile = 'Phone number field is mandatory';
                // return;
            }
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            if( isNotValidNullUndefile(userFirstName) && isNotValidNullUndefile(userLastName) && isNotValidNullUndefile(userEmail) && isNotValidNullUndefile(userMobile) && userMobile !== "+1"){
                if (userFirstName !== fName || userLastName !== lName) {
                    props.dispatchloader(true);
                    $postServiceFn.putUserInfo2(upDateJson, (res) => {
                        props.dispatchloader(false);
                        if(_primaryMemberUserId == userId){
                            userDetailOfPrimary.memberName = userFirstName +" "+ userLastName                        
                        }else{
                            userDetailOfPrimary.spouseName = userName
                        }
                        sessionStorage.setItem('userDetailOfPrimary', JSON.stringify(userDetailOfPrimary));
                        setIsEdit(false);
                        getMemberDetails()
                        
                    });
                }
                contactUpdate(userId,userFullname);
            }else{
              if(!isNotValidNullUndefile(userEmail) &&  !isNotValidNullUndefile(userName) && !isNotValidNullUndefile(userMobile))
                AlertToaster.warn("Please anter your data")
                 
            }
          
          
        } else {
            props.dispatchloader(true);
            $postServiceFn.putUserInfo2(upDateJson, (res) => {
                props.dispatchloader(false);
                if(!isNotValidNullUndefile(fileId)){
                    AlertToaster.success("Image deleted successfully")
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
                "mobiles": mobileData?.mobileNo === userMobile ? [] :
                 [
                   
                    {
                        "contactTypeId": mobileData?.contactTypeId,
                        "mobileNo": userMobile,
                        "updatedBy": _loggedInUserId,
                        "mobileOther": null,
                        "commTypeId": 1,
                        "contactId": mobileData?.contactId
                    }

                ],
               
            }
    }
    if((mobileData?.mobileNo !== userMobile)){
        props.dispatchloader(true);
        const userLoggedInDetail = JSON.parse(sessionStorage.getItem("userLoggedInDetail"))
        $CommonServiceFn.InvokeCommonApi('PUT',$Service_Url.updateContactDetailsPath+userId,updateJson,(res,err)=>{
            if(res){  
             props.dispatchloader(false);   
             setIsEdit(false)
             if(emailData?.emailId !== userEmail){
                userLoggedInDetail.primaryEmailId = userEmail                     
             }
             sessionStorage.setItem('userLoggedInDetail', JSON.stringify(userLoggedInDetail));
             getMemberDetails()

             if(userFirstName +" "+ userLastName !== userFullname && isNotValidNullUndefile(userFirstName) && isNotValidNullUndefile(userLastName)){
                AlertToaster.success("User details updated successfully")
                setIsEdit(false)
             }else{
                AlertToaster.success("Contact updated successfully")
                setIsEdit(false)
             }
             
             
            }else{
                props.dispatchloader(false);
             
            }
          })
         
    }
    if(emailData?.emailId !== userEmail){
        let jsonObj = {
            "currentUserName": emailData?.emailId,
            "newUserName": userEmail,
            "updatedBy": _loggedInUserId,
            "remarks": "Client Primary Email Updated by Legal",
            "clientIPAddress": "::1",
            "isParaResquest": true
        }
        const ques = await context.confirm(true, "Are you sure you want to update your email? Click on Yes to send the activation link for email updation.", 'Confirmation');
        if (ques){
        props.dispatchloader(true)
        let result = await postApiCall('PUT', $Service_Url.putUserNameEmail, jsonObj);
        if(result=='err')return;
        if(result =='err')props.dispatchloader(false);
        
        const _resultClientData = await getApiCall2('GET', $Service_Url.getUserDetailsByUserEmailId + `?emailId=${userEmail}`);
    
        if(_resultClientData =='err')props.dispatchloader(false);
        if (_resultClientData == 'err' && _resultClientData.data.length < 0) return;
        const { signUpPlatform, id, userId } = _resultClientData?.data[0];
        let notifiy =  await getSMSNotificationPermissions(userId, setIsClientPermissions);
        const jsonUserActivation = { "userRegstrtnId": id, "userId": userId, "signUpPlatform": signUpPlatform, "createdBy": _loggedInUserId, "clientIPAddress": "::1" }
        if(notifiy =='err')props.dispatchloader(false);
        const _resultGetActivationLink = await postApiCall('POST', $Service_Url.getUserActivationLink, jsonUserActivation);
        props.dispatchloader(false)    
      
        sentTextNMail(_resultGetActivationLink?.data?.data?.activationURL)
        }    
        
        
        
        
        
        
        else{
            getMemberDetails()
            setIsEdit(false)
        } ;
        

     } 
    else{
        if(userFirstName +" "+ userLastName !== userFullname){
            AlertToaster.success("Name updated successfully")
            setIsEdit(false)
        }
    }
    
    
    }
    const handleChange =(e)=>{
        let { name, value } = e.target;
        value = removeSpaceAtStart(value)
        if(name === "fName"){
            setUserFirstName(value);
        }else if(name === "email"){
            setUserEmail(value)
        }else if(name === "lName"){
            setUserLastName(value);
        }
        else{
            setUserMobile(value)
        }
        setErrors({
            ...errors,
            [name]: ''
        });

    }
    const editNameEmail = ()=>{
       
        if(isEdit){
            updateUserData() 
        }else{
            setIsEdit(true)
            
        }
    }
    const emailValidate = (typeofSave) => {
   
        let mobileNo = userMobile;
        let emailId = userEmail;
      
        let regexName = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        switch (typeofSave) { 
          case "email":
            if (emailId !== "") {
              if (!regexName.test(emailId)) {
                setUserEmail("")
                AlertToaster.warn("Enter the valid Email Id")
                break;
              }
            }
            break;
        //   case "mobile": {
          
        //     if (isNotValidNullUndefile(mobileNo) && mobileNo.length < numberLengthstate) {
        //       setUserMobile(newcountryCode)
        //       AlertToaster.warn("Enter the valid Number")
        //       return;
        //     }
        //     break;
        //   }
        }
    };

    const handleMobileNo = (value, country) => {
        const mobileNumberLength = country?.format.split('.');    
        let numberLength = mobileNumberLength.length;
        if (value) {
            setUserMobile(`+${value}`);
            setNumberLengthstate(country?.dialCode === "254" ? 12 : Math.min(numberLength, 15));
        }
        setErrors({...errors,mobile: ''});
        setnewcountryCode(country?.dialCode);
    };

    const CancalEdit =()=>{
        getMemberDetails()
        setIsEdit(false)
        setErrors({})
    }
    

    const replaceTemplate = (temp, url) => {
        let TemplateContent = temp;
        const uniqueLink = url;

        TemplateContent = TemplateContent.replace("@@SUBTENANTNAME", _subtenantName);
        TemplateContent = TemplateContent.replace("@@ACTIVATE_LINK", uniqueLink);
        TemplateContent = TemplateContent.replace("@@ACTIVATE_LINK", uniqueLink);
        TemplateContent = TemplateContent.replace("@@USER",userFirstName +" "+ userLastName);
        TemplateContent = TemplateContent.replace("@@OLDEMAILADDRESS", emailData?.emailId);
        TemplateContent = TemplateContent.replace("@@NEWEMAILADDRESS", userEmail);
        return TemplateContent;
    }

   
   
    
     
    const validatePassword = async (e) => {
        const inputValue = currentPassword;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*=_+\-<>{}[\]():";?',.\\\/|~`])[A-Za-z\d!@#$%^&*=_+\-<>{}[\]():";?',.\\\/|~`]{8,}$/;
        if (newPassword !== confirmNewPassword || newPassword === currentPassword || !passwordRegex.test(newPassword)) {
            if(newPassword == currentPassword){
                setErrorMessage3("New password cannot be same as current password")
            }else if(!passwordRegex.test(newPassword)){
                setErrorMessage3("Please enter a valid password")
            }
            return;
        }
  
        setErrorMessage3("")
        setErrorMessage2("")
        setErrorMessage("")
        setIsDisable(true)
        isNotValidNullUndefile(inputValue) && authenticateUser(userEmail, inputValue).then(response => {
            setIsDisable(true)
                setErrorMessage("");
                handleChangePassword()
            }).catch(error => {
                if (error.message === "Error: Request failed with status code 403") {
                    setErrorMessage("Please enter your correct password");
                } else {
                }
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
            throw new Error(error);
        }
    }
    const checkWithNewPassword =(e)=>{
        setconfirmNewPassword(e.target.value)
        if(e.target.value !== newPassword && isNotValidNullUndefile(newPassword)){
            setErrorMessage2("Your password does not match")
        }else{
           if(isNotValidNullUndefile(currentPassword)){
           }
           setErrorMessage2("")
        }

    }
    const handleCheck =(e)=>{
        setNewPassword(e.target.value); 
        setErrorMessage3(""); 
        setErrorMessage("")
        if((e.target.value == confirmNewPassword) && isNotValidNullUndefile(confirmNewPassword) ){
            setErrorMessage2("")
        }else{
            if(isNotValidNullUndefile(confirmNewPassword)){
                setErrorMessage2("Passwords must be same")
            }
        }
    

    }
    const handleChangePassword =async() => {

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*=_+\-<>{}[\]():";?',.\\\/|~`])[A-Za-z\d!@#$%^&*=_+\-<>{}[\]():";?',.\\\/|~`]{8,}$/;

        if (passwordRegex.test(newPassword)) {
            let url = $Service_Url.resetPassword;
            let json = {
                "userName": userEmail,
                "emailID": userEmail,
                "requestedIP": "::1",
                "commMedium": "Email",
                "commSendOn": userEmail
              }
              props.dispatchloader(true);  
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
              props.dispatchloader(false); 
              if(updatePasswordApi?.data?.messages.length > 0 && updatePasswordApi?.data?.messages[0] === "Password changed successfully"){
                AlertToaster.success(updatePasswordApi?.data?.messages[0])
                setIsDisable(false)
                setNewPassword('')
                setCurrentPassword('')
                setconfirmNewPassword('')
              }

            
            
        } else {
            setErrorMessage3("Please enter a valid password")
        }
    };
    
    const renderModalContent = () => {
        if (resetPassword) {
            
            return (
                <ResetPassword resetPassword={resetPassword}
                    setResetPassword={setResetPassword}
                    varificationCode={varificationCode}
                    setVarificationCode={setVarificationCode}
                    userEmail={userEmail}
                    verifiyOtp={verifiyOtp}
                    setOtpJsonData={setOtpJsonData}
                    setLoader={props.dispatchloader}
                />
            );
        } else if (varificationCode) {
            return (
                <VarificationCodeForProfilePage
                    resetPassword={resetPassword}
                    otpJsonData={otpJsonData}
                    userEmail={userEmail}
                    setResetPassword={setResetPassword}
                    varificationCode={varificationCode}
                    setVarificationCode={setVarificationCode}
                    setverifiyOtp={setverifiyOtp}
                    setNewPasswordModal={setNewPasswordModal}
                    setLoader={props.dispatchloader}
                />
            );
        } else if (newPasswordModal) {
            return (
                <SetNewPassword
                    resetPassword={resetPassword}
                    setResetPassword={setResetPassword}
                    userEmail={userEmail}
                    varificationCode={varificationCode}
                    setVarificationCode={setVarificationCode}
                    setNewPasswordModal={setNewPasswordModal}
                    setShowModal={setShowModal}
                    setLoader={props.dispatchloader}
                />
            );
        } else {
            return null;
        }
    };
    const clearAll =()=>{
        setCurrentPassword('')
        setNewPassword('')
        setconfirmNewPassword('')
        setErrorMessage2('')
        setErrorMessage('')
        setErrorMessage3('')
       
    }
    
    const openSetting = (openFor) =>{
        if(openFor == "general"){
         setActiveSetting("GeneralSetting")
         setOpenPlanSetting(false)
        }
        else if(openFor == "plans"){
         setActiveSetting("Products/Plans")
         setOpenPlanSetting(true)
        }
     }
    

     const sentTextNMail = async (url) => {

        const { textTemplateType, textTemplateId } = textTmpObj.textTempData[0]
        const { templateType, emailSubject, templateId } = emailTmpObj?.emailTempData[0];
        const emailTo = userEmail;
        let textTo = userMobile;
        if (isClientPermissions != true) {
            textTo = ''
        }
        const emailJson = createSentEmailJsonForOccurrene({
            emailType: templateType,
            emailTo: emailTo,
            emailSubject,
            emailContent: replaceTemplate(emailTmpObj.emailTemp,url),
            emailTemplateId: templateId,
            emailMappingTablePKId: _loggedInUserId,
            emailStatusId: 1,
            emailMappingTablePKId: _loggedInUserId,
            createdBy: _loggedInUserId,
        })
        const textJson = createSentTextJsonForOccurrene({
            smsType: textTemplateType,
            textTo: textTo,
            textContent: replaceTemplate(textTmpObj.textTemp,url),
            smsTemplateId: textTemplateId,
            smsMappingTablePKId: _loggedInUserId,
            smsStatusId: 1,
            smsMappingTablePKId: _loggedInUserId,
            createdBy: _loggedInUserId,

        });
      
        dispatchloader(true)
        const _resultSentEmailtext = await sentMail(emailJson, textJson);
        dispatchloader(false)
        if (_resultSentEmailtext == 'resolve') {
            const message = `Email ${commChannelId == 3 ? "and Text " : ''}Sent Successfully.`;
            // const message = `Sent Successfully.`;
            AlertToaster.success(message);
            setLogoutModal(true)  
            timerFunction(20)
        }
      
    } 
       
 return(
     <>

             {/* ------------------------------------- Account Settings ------------------------------------------------- */}
             <Row>
                 <Col lg="12" md="12" sm="12" xs="12" className="mt-4">
                 <div><h2 className='fw-bold'>Account Settings</h2></div>
                 <div style={{fontSize:"14px",color:"#606060"}}><p>Edit your personal details, passwords, payment details etc here.</p></div> 
                 </Col>
             </Row>
 
              {/* ------------------------------------- Setting Buttons --------------------------------------------------- */}
 
              <Row>
              <Col xl="2" lg="2" md="3" sm="6" xs="6">
                 <div className="settingsRow" onClick={()=>openSetting("general")}>
                         <button className="settingsButtonStyling text-center" style={activeSetting == "GeneralSetting" ? {borderBottom: "3.5px solid rgba(114, 12, 32, 1)",color: "rgba(114, 12, 32, 1)"}: {color: "#939393"}}>General Settings</button>
                 </div>
                 </Col>
                 {demo == true && <Col xl="2" lg="2" md="3" sm="6" xs="6">
                 <div className="settingsRow" onClick={()=>openSetting("plans")}>
                     <button className="settingsButtonStyling text-center" style={activeSetting == "Products/Plans" ? {borderBottom: "3.5px solid rgba(114, 12, 32, 1)",color: "rgba(114, 12, 32, 1)"}: {color: "#939393"}}>Products/Plans</button>
                 </div>
                 </Col>}
              </Row>
                 <hr className="horizontalrulerColor"></hr>
                 
             {/* Basic Details */}
             <Row style={{maxHeight: '36rem',overflowY:"scroll"}} className="mt-3">
                <Col lg="12" md="12" sm="12" xs="12">
             {openPlanSetting == true ?
                 <PlansSetting/> : 
                 <>
                  <Card className="mt-2">
                     <Card.Body>
                     <Row>
                     <Col lg="12" md="12" sm="12" xs="12" className="p-2">
                     <Row>
                     <Col lg="12" md="12" sm="12" xs="12">
                         <div className="d-flex justify-content-between ms-2">
                             <div style={{fontSize:"26px",color:"#333333"}}>Basic Details</div>
                             <div className="d-flex justify-content-end me-2">
                                 <button  onClick={editNameEmail} className={isEdit ? "profileDetailsSaveButton border-0 me-1" : "profileDetailsEditButton border-0 me-1"}>{isEdit ? "" :<img src="greyPencil.svg" className="profileDetailsEditButtonImg "/>}{isEdit ? "Save" : "Edit"}</button>
                                 {isEdit && <button  onClick={CancalEdit} className="profileDetailsEditButton border-0">Cancel</button>}
                             </div>
                         </div>
                     </Col>
                 </Row>
                 <Row>
                     <Col lg="12" md="12" sm="12" xs="12">
                         <Row className="d-flex align-items-center">
                             <Col lg="2" md="2" sm="12" xs="12">
                           <div><img src={imageUrl ? imageUrl : "/icons/ProfilebrandColor2.svg"} className="userIconsProfile" alt="Uploaded" /></div>
                             </Col>
                             <Col lg="8" md="8" sm="12" xs="12">
                             <Row>
                             <Col lg="4" md="5" sm="12" xs="12" className="mt-3">
                             <div>
                           <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
                             <button onClick={handleButtonClick} className="border-0 uploadPhotoButton">Upload New Photo</button>
                           </div>
                             </Col>
                             <Col lg="4" md="4" sm="12" xs="12" className="mt-3 ms-3">
                           <div ><button className="profileDetailsEditButton border-0"onClick={()=>deleteImg()}>Delete</button></div>
                             </Col>
                             <Col lg="12" md="12" sm="12" xs="12">
                                 <div><p className="allowedFileSizePara">Allowed *.jpeg, *.jpg, *.png (Max size 2MB)</p></div>
                             </Col>
                             </Row>
                             </Col>
                         </Row>
                      </Col>
                 </Row>
                 <Row>
                     <Col lg="12" md="12" sm="12" xs="12">
                     <div className="d-flex justify-content-center mb-0 AMABorder">
                         <div className="borderStylesInAMA">{/* Horizontal Line */}</div>
                     </div>
                     </Col>
                 </Row>
                 <Row className="ms-2">
                     <Col lg="3" md="4" sm="12" xs="12" className="p-4">
                     <div><p className="userDetailsNamelabel">First Name</p></div>
                     <div>
                    {isEdit ? 
                    <>
                        <div class="passwordInputBorder">
                       <input type="text" name="fName"onChange={(e)=>handleChange(e)} value={userFirstName} className="border-0 setInputFontSizen text-uppercase"/>
                       </div>
                       {errors.fName && <p className='text-danger mt-2'> <div className="error">{errors.fName}</div></p>}
                        </>
                       : <h5 className="userDetailsNameData text-uppercase">{userFirstName}</h5>}</div>
                     </Col>
                     <Col lg="4" md="4" sm="12" xs="12" className="p-4">
                     <div><p className="userDetailsNamelabel">Last Name</p></div>
                     <div>
                    {isEdit ? 
                    <>
                        <div class="passwordInputBorder">
                       <input type="text" name="lName"onChange={(e)=>handleChange(e)} value={userLastName} className="border-0 setInputFontSizen text-uppercase"/>
                       </div>
                       {errors.lName && <p className='text-danger mt-2'> <div className="error">{errors.lName}</div></p>}
                        </>
                       : <h5 className="userDetailsNameData">{userLastName}</h5>}</div>
                     </Col>

                     <Col lg="4" md="4" sm="12" xs="12" className="p-4">
                     <div><p className="userDetailsNamelabel">Email</p></div>
                     <div>
                        {isEdit ? 
                        <>
                                <div className="passwordInputBorder">
                                <input type="text" name="email"onBlur={() => emailValidate("email")} onChange={(e)=>handleChange(e)} value={userEmail}className="border-0 setInputFontSizen"/>
                                </div>
                                {errors.email && <p className='text-danger mt-2'> <div className="error">{errors.email}</div></p>}
                                </>
                                : <h5 className="userDetailsNameData">{userEmail}</h5>} 
                        </div>
                     
                     </Col>
                     <Col lg="4" md="4" sm="12" xs="12" className="p-4">
                     <div><p className="userDetailsNamelabel">Phone</p></div>
                     <div>
                     {isEdit ? 
                     <>
                                <div className="passwordInputBorder">
                                <PhoneInput
                                    className="react-tel-input1 border-0 setInputFontSizen"
                                    regions={["america","europe","asia","oceania","africa"]}
                                    country="us"
                                    preferredCountries={["us"]}
                                    displayInitialValueAsLocalNumber={true}
                                    value={userMobile || "+1"}
                                    onChange={(value, country) => handleMobileNo(value, country)}
                                    specialOptionLabel={"Other"}
                                    placeholder=""
                                    name="mobile"
                                    onBlur={() => emailValidate("mobile")}
                                    countryCodeEditable={false}
                                />
                                {/* {konsole.log(userMobile,userMobile.slice(0,-10),'userMobile', $AHelper.formatPhoneNumber(userMobile?.slice(-10)),"userMobile")} */}
                                </div>
                                {errors.mobile && <p className='text-danger mt-2'> <div className="error">{errors.mobile}</div></p>}
                                </>
                                : 
                                    <h5 className="userDetailsNameData">{ userMobile && userMobile?.length >= 10  &&
                                    <>
                                    {$AHelper.newPhoneNumberFormat(userMobile)}
                                       {/* {$AHelper.pincodeFormatInContact(userMobile) +" "+ $AHelper.formatPhoneNumber((userMobile?.slice(0, 4) == "+254") ? userMobile : userMobile?.slice(-10))} */}
                                    </>
                                    }</h5>
                                }
                         </div>
                     </Col>
                 </Row>
                     </Col>
                 </Row>
                             </Card.Body>
                         </Card>
     
 
                        <Card className="mt-4">
                             <Card.Body>
                             <Row>
                     <Col lg="12" md="12" sm="12" xs="12" className="ms-3">
                     <Row>
                         <Col lg="12" md="12" sm="12" xs="12">
                            <div className="d-flex justify-content-between">
                         <div className="changePasswordHeading">Change Password</div> 
                         <div>
                         {isNotValidNullUndefile(currentPassword) && isNotValidNullUndefile(newPassword) && isNotValidNullUndefile(confirmNewPassword) &&
                                <div className="d-flex">
                                    <button className="profileDetailsSaveButton border-0 me-1"disabled={isDisable} onClick={() => validatePassword()}>Save</button>
                                    <button onClick={clearAll} className="profileDetailsEditButton border-0">Cancel</button>
                                </div>

                            }
                            </div>
                            </div>
                         </Col>
                     </Row>
                     <Row>
                         <Col lg="11" md="11" sm="12" xs="12" className="mt-3">
                        <div>
                         <div className="yourPasswordHeading">Old Password</div>
                         <div class=" d-flex passwordInputBorder">
                          <input type={oldtype} name="oldpassword"placeholder="Current Password"value={currentPassword}
                          onChange={(e) => {
                                       setCurrentPassword(e.target.value);
                                        setErrorMessage3("");
                                        setIsDisable(false)
                                        setErrorMessage("")
                                    }}
                        autoComplete="current-password"className="border-0 setInputFontSize"/>
 
                             <span class="d-flex justify-around items-center cursor-pointer" onClick={()=>handleToggle("oldpassword")} >
                                 <img src={oldtype == "password" ? "/icons/clarity_eye-hide-line.svg" : "/icons/clarity_eye-show-line.svg"} class="eyesSizeLisgnment" />
                             </span>
                         </div>
                        </div>
                         </Col>
                         <Col lg="1" md="1" sm="1" xs="1" className="d-flex align-items-center mt-4">
                    
                     </Col>
                     </Row>
                     <Row>
                     <Col lg="12" md="12" sm="12" xs="12">
                     {errorMessage && <p className='text-danger'><div className="error">{errorMessage}
                     </div></p>}
                     <div>
                         <p className="forgotpasswordText">Can’t remember your password? <a className="text-primary" onClick={()=>{setShowModal(true)}} style={{textDecoration:"underline"}}>Reset your password</a></p>
                     </div>
                     </Col>
                     </Row>
                     <Row>
                         <Col lg="11" md="11" sm="12" xs="12" className="mb-4">
                         <div>
                         <div className="yourPasswordHeading">New Password</div>
                         <div class=" d-flex passwordInputBorder">
                             <input  type={newtype} name="newpassword"placeholder="Enter your new Password"
                                 value={newPassword}
                                 onChange={(e)=>handleCheck(e)}
                                 autoComplete="current-password"className="border-0 setInputFontSize"/>
                             <span class="d-flex justify-around items-center cursor-pointer" onClick={()=>handleToggle("newpassword")} >
                                 <img src={newtype == "password" ? "/icons/clarity_eye-hide-line.svg" : "/icons/clarity_eye-show-line.svg"} class="eyesSizeLisgnment" />
                             </span>
                         </div>
                         </div>
                         </Col>
                     </Row>
                     <Row>
                         <Col lg="12" md="12" sm="12" xs="12">
                         {errorMessage3 && <p className='text-danger mt-1'> <div className="error">{errorMessage3}
                     </div></p>}
                     
                         </Col>
                     </Row>
                     <Row>
                         <Col lg="11" md="11" sm="12" xs="12">
                         <div>
                         <div className="yourPasswordHeading">Re-enter your new password</div>
                         <div class=" d-flex passwordInputBorder">
                             <input
                                 type={cnfrmtype}
                                 name="cnfmpassword"
                                 placeholder="Confirm Password"
                                 value={confirmNewPassword}
                                 onChange={(e) =>checkWithNewPassword(e)}
                                 onBlur={(e) =>checkWithNewPassword(e)}
                                 autoComplete="current-password"
                                 className="border-0 setInputFontSize"
                             />
                             <span class="d-flex justify-around items-center cursor-pointer" onClick={()=>handleToggle("cnfmpassword")}>
                                 <img src={cnfrmtype == "password" ? "/icons/clarity_eye-hide-line.svg" : "/icons/clarity_eye-show-line.svg"} class="eyesSizeLisgnment" />
                             </span>
                         </div>
                             </div>
                         </Col>
                     </Row>
                     <Row>
                         <Col lg="12" md="12" sm="12" xs="12">
                         {errorMessage2 && <p className='text-danger mt-1'> <div className="error">{errorMessage2}
                     </div></p>}
                         </Col>
                     </Row>
                     <Row>
                         <Col lg="11" md="11" sm="12" xs="12" className="mt-3">
                         <div className='mt-2 bg-light p-2 rounded mb-4'>
                         <h5 className='ms-2 fw-bold mt-2'>Password must match below criteria:</h5>
                         <ul className='ms-2 fw-light'>
                             <li>Must have minimum 8 characters</li>
                             <li>Must contain at least one uppercase letter</li>
                             <li>Must contain alphanumeric characters</li>
                             <li>Must have atleast one special character</li>
                             {/* <li>Please enter only allowed special character in password,
                                 allowed special characters are<h5 className='d-inline'> !@#$%^&*</h5></li> */}
                         </ul>
                     </div>
                 
                  
                         </Col>
                     </Row>
                     </Col>
                 </Row>
                </Card.Body>
                         </Card>
                </>}
                </Col>
             </Row>
              
 
 
         <Modal show={showModal} size="md" centered animation="true" id="profilePage" backdrop="static">
           <Modal.Header className="pb-0 pt-4 justify-content-end">
             <Modal.Title><img src="greyCrossButton.svg" className="crossButton cursor-pointer" onClick={closeRegistrationModal}></img></Modal.Title>
           </Modal.Header>
           <Modal.Body className="pt-0">
           {renderModalContent()}
            </Modal.Body>
         </Modal>
      
         <Modal show={logoutModal} backdrop="static" keyboard={false} centered>
             <Modal.Header className="d-flex justify-content-center">
                 <Modal.Title >ALERT</Modal.Title>
             </Modal.Header>
             <Modal.Body>
                 {timer ? (
                    <>
                     < div className="text-center fs-3 my-3" id="timer">
                        <h4>Activation link has been sent to the new updated email ID for login</h4><br/>
                        <h4 style={{color:"#720c20"}}>Remaining Time: <span class="text-dark">{timer}</span></h4>
                      
          </div>
                    </>
         
        ) : null}
             </Modal.Body>
             <Modal.Footer className="d-flex justify-content-center  mb-2"style={{ padding: "3px 5px", borderRadius: "5px", border: "1px solid #fff" }}>
                 <Button variant="secondary" onClick={() => $getServiceFn.handleLogout()}> <img className='mb-1 mt-0  intakelogoutBtn' src='icons/simple_intake_logoutBtn.svg'/><h5 className='d-inline logout_h3 ms-1'>Logout</h5></Button>
             
             </Modal.Footer>
         </Modal>  

    
         </>
     )
    };
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({
            type: SET_LOADER,
            payload: loader,
        }),
});


export default connect("", mapDispatchToProps)(withOccurrenceApi(Profile,34, 'profileOccurrence'));
