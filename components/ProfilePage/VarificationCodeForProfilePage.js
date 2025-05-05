import { useState,useEffect } from "react"
import { $Service_Url } from "../network/UrlPath"
import { $CommonServiceFn } from "../network/Service"
import AlertToaster from "../control/AlertToaster"
import { isNotValidNullUndefile } from "../Reusable/ReusableCom"
import useUserIdHook from "../Reusable/useUserIdHook";
import { postApiCall } from "../Reusable/ReusableCom"

const VarificationCodeForProfilePage=({setVarificationCode,setResetPassword,userEmail,setverifiyOtp,otpJsonData,setNewPasswordModal,setLoader})=>{


  
  
    const [timer, setTimer] = useState(false);
    const [AddBorderToInputs,setAddBorderToInputs]=useState("")
    const { _subtenantId, _loggedInUserId} = useUserIdHook();

    const key = () => { };
    let timerOn = true;
       const showResetPasswordPage=()=>{
        setVarificationCode(false)
        setResetPassword(true) 
    }
    useEffect(() => {
      timerFunction(120);
    }, [])
    const addBorderToAllInputs=()=>
    {
        setAddBorderToInputs("addMarronBorder")
    }
    function OtpInput() {
        if (typeof window !== "undefined") {
          const inputs = document.querySelectorAll("#otp > *[id]");
      
          for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener("keydown", function (event) {
              if (event.code === "Backspace") {
                inputs[i].value = "";
                if (i !== 0) {
                  inputs[i - 1].focus();
                }
              } else if (
                (event.code.startsWith("Digit") || event.code.startsWith("Numpad")) &&
                !event.shiftKey
              ) {
                inputs[i].value = event.key;
                if (i !== inputs.length - 1) inputs[i + 1].focus();
                event.preventDefault();
              } else {
                inputs[i].focus();
                event.preventDefault();
              }
             
           
            });
          }
        }
      }
    
      OtpInput();

      const onOtpSubmit = async(e) => {
        
        e.preventDefault();
        const firstValue = document.getElementById('first').value;
        const secondValue = document.getElementById('second').value;
        const thirdValue = document.getElementById('third').value;
        const fourthValue = document.getElementById('fourth').value;
        const fifthValue = document.getElementById('fifth').value;
        const sixthValue = document.getElementById('sixth').value;
      
      
        const concatenatedValue = firstValue + secondValue + thirdValue + fourthValue + fifthValue + sixthValue;
        if(concatenatedValue.length < 6){
       AlertToaster.warn("Please Enter The Complete OTP")
        }else{
        setverifiyOtp(concatenatedValue)
    
        let json = {
          "id": otpJsonData?.data?.data?.id,
          "createdBy": otpJsonData?.data?.data?.createdBy,
          "otp":concatenatedValue,
          "signUpPlateform": 6,
        }
        setLoader(true)
        if(!timer){
         AlertToaster.warn("Invalid OTP")
         setLoader(false)
        }else{
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postOtpData, json, (resp, error) => {
          setLoader(false)
          if (resp) {
            AlertToaster.success("OTP verified successfully")
            setVarificationCode(false)
            setResetPassword(false)
            setNewPasswordModal(true)          }
          else if (error) {
            setLoader(false)
            if(error?.data?.messages.length > 0){
              AlertToaster.error(error?.data?.messages[0])
            }
            
          }
        })
      }
        }
      };
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
      const handleTimer = async (e) => {
        e.preventDefault();
        timerFunction(120);
    
       
    
        const postData = {
          "createdBy": _loggedInUserId,
          "otpSendMedium": 4,
          "subtenantId": _subtenantId,
          "resendCount": 1,
          "otpType": 1
         }  
          let sendOtp = await postApiCall("POST",$Service_Url.postSendOtp,postData)
          if(sendOtp !== "err"){
           AlertToaster.success("OTP Resent successfully to your number or email address.")
          }
          
      };
      
     
           
    
    return(
        <>
            <img src="greyBackArrow.svg" className="backArrow cursor-pointer" onClick={showResetPasswordPage}></img>
            <div className="mainDivForResetPassword">
            <p className="resetPasswordHeading text-center">Enter verification code</p>
            <p className="text-center resetPasswordHeadingInfo">We have sent you the 6-digit verification code to <span className="exampleMaroonEmail">{userEmail}</span> Enter the code to confirm email address.</p>
            <form className='' id='Otpbox'
             onSubmit={onOtpSubmit}
             >
          <div id="otp" className="d-flex col-sm-12  mb-2 mt-5 " onClick={addBorderToAllInputs}>
            <input className={`${AddBorderToInputs} otpInputsForVarifyingOtp text-center py-2  form-control form-control-solid focus:border-blue-400 focus:shadow-outline inp`} 
            onKeyPress={key}
              type="text" id="first" maxLength="1" />
            <input className={`${AddBorderToInputs} otpInputsForVarifyingOtp text-center py-2  form-control form-control-solid focus:border-blue-400 focus:shadow-outline inp`} 
             onKeyPress={key} 
             type="text" id="second" maxLength="1" />
            <input className={`${AddBorderToInputs} otpInputsForVarifyingOtp text-center py-2  form-control form-control-solid focus:border-blue-400 focus:shadow-outline inp`} 
             onKeyPress={key} 
              type="text" id="third" maxLength="1" />
            <input className={`${AddBorderToInputs} otpInputsForVarifyingOtp text-center py-2  form-control form-control-solid focus:border-blue-400 focus:shadow-outline inp`}
             onKeyPress={key} 
             type="text" id="fourth" maxLength="1" />
            <input className={`${AddBorderToInputs} otpInputsForVarifyingOtp text-center py-2   form-control form-control-solid focus:border-blue-400 focus:shadow-outline inp`}
             onKeyPress={key} 
              type="text" id="fifth" maxLength="1" />
            <input className={`${AddBorderToInputs} otpInputsForVarifyingOtp text-center py-2   form-control form-control-solid focus:border-blue-400 focus:shadow-outline inp`}
             onKeyPress={key} 
             type="text" id="sixth" maxLength="1" />
          </div>
          <p className='text-danger text-center fs-4' id='error1'>
            {/* {valid && "Not valid"} */}
            </p>
          {/* <p className='text-danger text-center fs-4' id='error1'>{error !== '' && error}</p> */}
 
          <div className="mt-4 d-flex justify-content-center">
             <button className="continueButton"
            type="submit">
             Continue
            </button>
          </div>
          {timer ? (
          <p className="text-center fs-3 my-3" id="timer">
            {timer}
          </p>
        ) : null}
         {!timer  && 
          <div className="timer d-flex flex-column mt-3 align-items-center position-relative">
            <div className='d-flex'>
              <p className="ResendOtpForProfilePage" id = " resendOtp">
                Did’nt recieved the code yet?{" "}
                <button onClick={handleTimer} style={{color:"#720c20"}} className="resendOtp cursor-pointer border-0 bg-transparent resendColor theme-heading text-decoration-underline" id = "resend" >
                Resend again
              </button>
          </p>
            </div>
          </div>}
        </form>
          
            </div>
        </>
       
    )
}
export default VarificationCodeForProfilePage