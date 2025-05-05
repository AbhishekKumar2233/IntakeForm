import { useState } from "react"
import { isNotValidNullUndefile,postApiCall,getApiCall2} from "../Reusable/ReusableCom"
import AlertToaster from '../control/AlertToaster';
import { $Service_Url } from "../network/UrlPath";

const SetNewPassword=({setVarificationCode,setResetPassword,userEmail,setNewPasswordModal,setShowModal,setLoader})=>{
    const[errorMessageForPassword,setErrorMessageForPassword]=useState("")
    const[errorMessageForConfirmPassword,setErrorMessageForConfirmPassword]=useState("")
    const[showErrorMessageForPassword,setShowErrorMessageForPassword]=useState(false)
    const[showErrorMessageForConfirmPassword,setShowErrorMessageForConfirmPassword]=useState(false)
    const[Password,setPassword]=useState("")
    const[ConfirmPassword,setConfirmPassword]=useState("")


    const matchEnteredPasswords=async()=>{
        if(Password.length>7 && ConfirmPassword.length>7 && showErrorMessageForPassword==false && showErrorMessageForConfirmPassword==false ){
            let url = $Service_Url.resetPassword;
            let json = {
                "userName": userEmail,
                "emailID": userEmail,
                "requestedIP": "::1",
                "commMedium": "Email",
                "commSendOn": userEmail
              }
            setLoader(true)  
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
                password: Password,
                accessIP: "::1",
                forgotPasswordId: forgotPasswordId
            }

             let updatePasswordApi = await postApiCall("POST",$Service_Url?.updatePassword,input)
                setLoader(false)
              if(updatePasswordApi?.data?.messages.length > 0 && updatePasswordApi?.data?.messages[0] === "Password changed successfully"){
                setNewPasswordModal(false)
                setShowModal(false)
                AlertToaster.success(`Password chaged successfully`);
              }
         
        }
      
    }
    
    const functionToChangePassword=(value)=>{
        setPassword(value)
        if( validatePassword(value)==true && value.length>=8){
            setShowErrorMessageForPassword(false)
        }else{
            setShowErrorMessageForPassword(true)
            setErrorMessageForPassword("Please enter a valid password")
        }
        if(value.length==0){
            setShowErrorMessageForPassword(true)
            setErrorMessageForPassword("Password is required")
        }
    }

    const functionToConfirmPassword=(value)=>{
        setConfirmPassword(value)
        if( validatePassword(value)==true && value.length>=8 && Password === value){
            setShowErrorMessageForConfirmPassword(false)
        }else{
            setShowErrorMessageForConfirmPassword(true)
            setErrorMessageForConfirmPassword("Please enter a valid password")
        }
        if(value.length==0)
        {
            setShowErrorMessageForConfirmPassword(true)
            setErrorMessageForConfirmPassword("Your password does not match")
        }
       
        
    }
    
    const showVarificationCodePage=()=>{
        setVarificationCode(true)
    }

    const validatePassword = (password) => {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*=_+\-<>{}[\]():";?',.\\\/|~`])[A-Za-z\d!@#$%^&*=_+\-<>{}[\]():";?',.\\\/|~`]{8,}$/;
        return pattern.test(password);
    };


    return(
        <>
         <img src="greyBackArrow.svg" className="backArrow cursor-pointer" onClick={showVarificationCodePage}></img> 
         <div className="mainDivForResetPassword">
            <p className="resetPasswordHeading text-center">Set your new password</p>
            <p className="text-center resetPasswordHeadingInfo">Your new password should be different from passwords previously used.</p>
            <form >
                <label className="PasswordLabel" for="Password">Password</label>
                <input type="text" className="PasswordLabelInput" id="Password" placeholder="Password"
                  onChange={(e)=>{functionToChangePassword(e.target.value)}}
                />
                 {showErrorMessageForPassword && <small className="text-danger ">{errorMessageForPassword}</small>}
                

                <label className="PasswordLabel mt-3 w-100" for="confirmPassword">Confirm your new password</label>
                <input type="text" className="PasswordLabelInput" id="confirmPassword" placeholder="Confirm Password"
                 onChange={(e)=>{functionToConfirmPassword(e.target.value)}}
                />
                 {showErrorMessageForConfirmPassword && <small className="text-danger ">{errorMessageForConfirmPassword}</small>}
            </form>
            <div className="mt-4 bg-light p-2 rounded interFontFamilyForPasswordMatchList">
              <h5 className="ms-2 fw-bold mt-2">
                Password must match below criteria:
              </h5>
              <ul className="ms-2 fw-light">
                <li>Must have minimum 8 characters</li>
                <li>Must contain at least one uppercase letter</li>
                <li>Must contain alphanumeric characters</li>
                <li>Must have atleast one special character</li>
               </ul>
            </div>
            <button className="continueButton mt-4" onClick={matchEnteredPasswords}>Continue</button>
            
         </div>
        </>
       
    )
}
export default SetNewPassword