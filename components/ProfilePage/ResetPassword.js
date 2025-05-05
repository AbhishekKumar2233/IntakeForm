import { useState,useEffect } from "react"
import useUserIdHook from "../Reusable/useUserIdHook";
import { $Service_Url } from "../network/UrlPath";
import { getApiCall2,postApiCall } from "../Reusable/ReusableCom";
import AlertToaster from "../control/AlertToaster";

const ResetPassword=({setVarificationCode,setResetPassword,userEmail,setOtpJsonData,setLoader})=>{

    const { _subtenantId,_loggedInUserId } = useUserIdHook();
    useEffect(() => {
      
    }, [])
    
    
    const showVarificationPage=async()=>{
      setLoader(true)    
      const postData = {
       "createdBy": _loggedInUserId,
       "otpSendMedium": 4,
       "subtenantId": _subtenantId,
       "resendCount": 1,
       "otpType": 1
      }  
       let sendOtp = await postApiCall("POST",$Service_Url.postSendOtp,postData)
       if(sendOtp !== "err"){
        AlertToaster.success("OTP sent successfully to your number or email address.")
       }
       
        setLoader(false)
         setVarificationCode(true)
         setResetPassword(false)
         setOtpJsonData(sendOtp)
      
     }
   
 
    return(
        <div className="mainDivForResetPassword">
            <p className="resetPasswordHeading text-center">Reset Password</p>
            {/* <p className="text-center resetPasswordHeadingInfo">Please enter your email id so we can send you a verification code.</p> */}
            <form>
                <label className="EmailLabel" for="email">Email</label>
                <input type="email" className="EmailLabelInput" id="email" disabled placeholder={userEmail}/>
            </form>
            <button className="continueButton mt-3" onClick={showVarificationPage}>Continue</button>
        </div>
    )
}
export default ResetPassword