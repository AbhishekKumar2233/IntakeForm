import React, { useEffect ,useState,useContext } from 'react';
import { $CommonServiceFn } from '../../components/network/Service';
import { $Service_Url } from '../../components/network/UrlPath';
import konsole from '../../components/control/Konsole';
import { $AHelper } from '../control/AHelper';
import { configdata} from "../control/Constant";
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from "react-redux";
import { isNotValidNullUndefile } from '../Reusable/ReusableCom';

const  VerifyOtp=(props)=> {
    let selectmemberdetails=props?.selectclientdata
    let otpresdata=props?.otpresdata
    

    // konsole.log("propsprops",props)

  const [timer, setTimer] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [valid, setValid] = useState(false)
  const [error, setError] = useState('')
  let timerOn = true;

    useEffect(() => {
      if(selectmemberdetails !== null && otpresdata !==null){
        handleQuerySubmit();
      }
    }, [otpresdata,selectmemberdetails])
    
    useEffect(() => {
      timerFunction(120);
      OtpInput("addEvent");
      return () => OtpInput("removeEvent");
    }, [])

    const handleQuerySubmit = () => {
      if(otpresdata?.createdBy!== undefined && otpresdata?.id !== undefined && otpresdata?.otpSendOn !== undefined){
       let userLogin = {
          querySessCreateId : otpresdata.createdBy,
          querySessId: otpresdata.id,
          userRegisteredId: otpresdata.userRegstrtnId,
          querySessOtpSendOn: otpresdata.otpSendOn,
          querySessOtpSendMedium: otpresdata.otpSendMedium,
          signUpPlateform: selectmemberdetails.signUpPlatform
        }

        konsole.log("userLoginuserLogin",userLogin)
        // localStorage.setItem("UserSignupDetail", JSON.stringify(userLogin));
        setUserDetails(userLogin);
      }
    }
  
  const onOtpSubmit = ( gettedvalue) => {
    konsole.log("jksadghjkdshg",gettedvalue, userDetails);
    const submitData = {
      id: parseInt(userDetails.querySessId),
      createdBy:userDetails.querySessCreateId,
      otp: parseInt(gettedvalue),
      signUpPlateform: userDetails.signUpPlateform
    }
    konsole.log("submitData",JSON.stringify(submitData))
    props.dispatchloader(true)
      $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postOtpData, submitData, (response, errordata) => {
        props.dispatchloader(false)
        if (response) {
          props.dispatchloader(false)
          isAuthValid()
          konsole.log("response",response)     
        }
        else if(errordata){
          props.dispatchloader(false);
          if(errordata?.data?.messages?.length>0){
            konsole.log("errererer",errordata.data.messages[0]);
            setError(errordata.data.messages[0]);
          }else{
            setError('Unable to process your request; please try again after some time.');
          }

        }
      })
  }


  const  isAuthValid=()=>{
    // props.setshowverifyotp(false)
    // props.setshowvarifyPassword(true)
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getIsAuthUser+`${selectmemberdetails?.primaryEmailAddress}`,
      "",
      (response,errorData) => {
        if (response) {
          props.dispatchloader(false)
          konsole.log("responseresponseresponseresponse",response)
          if(response.data.data == true){

            postActiveUserafterotp()
           
          }else if(response.data.data==false){
         props.setshowverifyotp(false)
          props.setshowvarifyPassword(true)
          }
         
        }else{
          konsole.log("errorData",errorData)
          
    props.setshowverifyotp(false)
    props.dispatchloader(false)
         
        }
      }
    );


  }

const postActiveUserafterotp=()=>{

  let input = {
    "userActivationId": otpresdata?.activationid,
    "userRegstrtnId": otpresdata?.userRegstrtnId,
    // "otpId": otpresdata?.id,
    "otpId":parseInt(userDetails.querySessId),
    "userId": otpresdata.createdBy,
    "activationKey": otpresdata?.activationKey ,
    "signUpPlatform": selectmemberdetails.signUpPlatform,
    "clientIPAddress": "::1"
}

konsole.log("otpresdataotpresdatainput",input)
konsole.log("jsonjsonsendpassword", JSON.stringify(input))
//setLoader(true);
props.dispatchloader(true)
$CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postActiveUser, input, (response, errorData) => {
  props.dispatchloader(false)
    if (response) {
        //setLoader(false);
        konsole.log('success active user', response);
        // alert("user activated")
        props.callapidata();
        props.setshowverifyotp(false)
        props.setshowcongratulation(true)
        props.setlagecycongratulationsuser(true)

     
    }
    else if (errorData) {
        //setLoader(false);
        konsole.log("err", errorData);
        // captchaRef.current.refreshCaptcha();
    }
})
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
    setDisabled(false);
  }

  const handleTimer = async (e) => {
    e.preventDefault();
    timerFunction(120);
    setDisabled(true);

    const inputData = {
      createdBy:userDetails.querySessCreateId,
      otpSendMedium:userDetails.querySessOtpSendMedium,
      id: parseInt(userDetails.querySessId),
      otpType: configdata.USERACTIVATION
    }

    konsole.log('jsonobjotpcerifi',JSON.stringify(inputData))

    if(inputData.createdBy !== undefined && inputData.otpSendMedium !== undefined && inputData.id !== undefined){
    
      $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postResendOtp , inputData , (response) => {
       
        if(response){
          konsole.log('resendRess', response);
          // setUserDetails({ ...userDetails, querySessId: response.data.data.id })
          userDetails.querySessId=response.data.data.id
          props.setresendotpid(response.data.data.id)
          props.setresendotp(true)
        }
      })
    }
  };
    // konsole.log("optveride", userDetails);

    function OtpInput( eventActionType ) {
      if (typeof window == "undefined") return;

      function inputEvent (event, inputs, i) {
        konsole.log('bdsvbhbs-inputEvent', event);
        const inputElement = inputs[i];
        const enteredChar = event.data;

        if (!/^\d*$/.test(enteredChar)) {
          inputElement.value = "";
          return;
        }

        inputElement.value = enteredChar;

        if (i !== inputs.length - 1 && enteredChar !== null) {
          inputs[i + 1].focus();
        }
      }

      function keyDownEvent (event, inputs, i) {
        konsole.log('bdsvbhbs-keyDownEvent', event);
        if ((event.code === "Backspace" || event.key === "Backspace") && i !== 0 && inputs[i].value == "") {
          event.preventDefault();
          setTimeout(() => {
            inputs[i - 1].focus();
            const inputEvent = new Event("input", { bubbles: true });
            inputs[i - 1].dispatchEvent(inputEvent);
          }, 10);
        }
        setError('');
        setValid(false);
      }

      const inputs = document.querySelectorAll("#otp > *[id]");
      konsole.log("fnskjv", inputs)
      for (let i = 0; i < inputs.length; i++) {
        if(eventActionType == "addEvent") {
          inputs[i].addEventListener("input", (event) => inputEvent(event, inputs, i));
          inputs[i].addEventListener("keydown", (event) => keyDownEvent(event, inputs, i));
        } else {
          inputs[i].removeEventListener("input", (event) => inputEvent(event, inputs, i));
          inputs[i].removeEventListener("keydown", (event) => keyDownEvent(event, inputs, i));
        }
      }
    }

    const handlePaste = (event) => {
      event.preventDefault(); // Prevent default paste behavior to ensure custom handling
      const paste = event.clipboardData.getData('Text'); // Get pasted data
      const inputs = document.querySelectorAll("#otp input");
      if (!/^\d*$/.test(paste)) {
        return;
      }
      // Ensure the paste data is not longer than the number of input fields
      const pasteData = paste.slice(0, inputs.length); // Limit the data to the length of the inputs
      // Set the values of the inputs based on the paste data
      inputs.forEach((input, index) => {
        input.value = pasteData[index] || ''; // Set the value of each input
      });
      // Focus on the last input field (sixth field)
      const lastInput = inputs[inputs.length - 1];
      if (lastInput) {
        lastInput.focus();
      }
    };
    

function onHandle(event){
  event.preventDefault();
    const inputs = document.querySelectorAll('#otp > *[id]');
    let compiledOtp = '';
    for (let i = 0; i < inputs.length; i++) {
      compiledOtp += inputs[i].value;
    }
    
  let gettedvalue =  document.getElementById('otp').value = compiledOtp;
  if (gettedvalue == " " || gettedvalue.length < 6) {
    setValid("true")
  }else {
    konsole.log(gettedvalue );
    onOtpSubmit(gettedvalue);
  return true; 
}
 
}

const key = () =>{
}

let primaryMobile=selectmemberdetails?.primaryPhoneNumber
let sPhoneNumber = primaryMobile?.split("")
let removeCountryCode =  sPhoneNumber?.splice(sPhoneNumber?.length - 10 , 10)?.join("")
const mobilenocountrycode=sPhoneNumber?.join("")
const mobilenowithoutcountrycode=$AHelper?.mobilenoconverttousformat(removeCountryCode)

console.log('mobilenocountrycode',mobilenocountrycode,mobilenowithoutcountrycode)
const countryCode=isNotValidNullUndefile(mobilenocountrycode)?mobilenocountrycode:''
const mobileNo=isNotValidNullUndefile(mobilenowithoutcountrycode)?mobilenowithoutcountrycode:'Contact number is not available'
const mobileNoForDisplay=countryCode +" "+ mobileNo
console.log('mobileNomobileNomobileNo',mobileNoForDisplay)


  return (
    <div className="container-fluid m-0 bg-light" style={{height: 'auto', minHeight: '50vh'}}
    >
      {/* <div className="col-sm-12 col-md-8 col-lg-4 bg-white rounded m-auto dased-border p-3 m-0 mt-5"> */}
        {/* <Header /> */}
        <form className='' id='Otpbox' onSubmit={onOtpSubmit}>
          <p className='my-4  fw-bold fs-3 text-center theme-heading' style={{"color":"#720520"}}>Verify OTP</p>
          <h5 className='text-center mb-2' >You will now receive one time password(OTP) on your cellphone. Please enter the OTP(one time password) on the screen.</h5>
          <h5 className='text-center mb-2' >Please Enter OTP sent to your registered Email and Mobile Number </h5>
          <input className="otpInputs mb-2 text-start py-2 fs-5 form-control form-control-solid rounded focus:border-blue-400 focus:shadow-outline inp" value={selectmemberdetails?.memberName} disabled type="text" />
          <input className="otpInputs mb-2 text-start py-2 fs-5 form-control form-control-solid rounded focus:border-blue-400 focus:shadow-outline inp" value={ isNotValidNullUndefile(selectmemberdetails?.primaryEmailAddress) ? selectmemberdetails?.primaryEmailAddress : "Email is not available"} disabled type="text"  />  
          <input className="otpInputs mb-2 text-start py-2 fs-5 form-control form-control-solid rounded focus:border-blue-400 focus:shadow-outline inp"
          value ={mobileNoForDisplay}
           disabled   type="text" />
          <div id="otp" className="d-flex col-sm-12  mb-2 " onPaste={handlePaste}>
            <input className="otpInputs m-2 text-center py-2 fs-5 form-control form-control-solid rounded focus:border-blue-400 focus:shadow-outline inp" onKeyPress={key} tabIndex={1} type="text" id="first" maxLength="1" autoFocus />
            <input className="otpInputs m-2 text-center py-2 fs-5 form-control form-control-solid rounded focus:border-blue-400 focus:shadow-outline inp"  onKeyPress={key} tabIndex={2} type="text" id="second" maxLength="1" />
            <input className="otpInputs m-2 text-center py-2 fs-5 form-control form-control-solid rounded focus:border-blue-400 focus:shadow-outline inp"  onKeyPress={key} tabIndex={3}  type="text" id="third" maxLength="1" />
            <input className="otpInputs m-2 text-center py-2 fs-5 form-control form-control-solid rounded focus:border-blue-400 focus:shadow-outline inp" onKeyPress={key} tabIndex={4} type="text" id="fourth" maxLength="1" />
            <input className="otpInputs m-2 text-center form-control py-2 fs-5 form-control-solid rounded focus:border-blue-400 focus:shadow-outline inp" onKeyPress={key} tabIndex={5}  type="text" id="fifth" maxLength="1" />
            <input className="otpInputs m-2 text-center form-control py-2 fs-5 form-control-solid rounded focus:border-blue-400 focus:shadow-outline inp" onKeyPress={key} tabIndex={6} type="text" id="sixth" maxLength="1" />
          </div>
          <p className='text-danger text-center fs-4' id='error1'>{valid && "Not valid"}</p>
          <p className='text-danger text-center fs-4' id='error1'>{error !== '' && error}</p>
 
          <div className="mt-4 d-flex justify-content-center">
            <button className=" theme-btn h-2" type="Submit" onClick={onHandle} >
              Verify OTP
            </button>
          </div>
          {timer ? <p className="text-center fs-3 my-3" id="timer">{timer}</p> : null}
          <div className="timer d-flex flex-column mt-3 align-items-center position-relative">
            <div className='d-flex'>
              <p className="ResendOtp fs-5" id = " resendOtp">
              Haven't received OTP? {" "}
                <button style={{color:"#720c20"}} className="resendOtp cursor-pointer border-0 bg-light resendColor theme-heading text-decoration-underline" id = "resend" disabled={disabled}  onClick= {handleTimer}>
                Resend OTP
              </button>
          </p>
            </div>
          </div>
        </form>
      {/* </div> */}
      <div className='col-sm-12 col-md-8 col-lg-4 m-auto m-0 p-0'>
        {/* <Footer /> */}
        {/* <h1>Footer Logo</h1> */}
      </div>
    </div>

  );
};


const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader })
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyOtp)