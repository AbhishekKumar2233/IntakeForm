import React, { useEffect, useRef, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { $CommonServiceFn } from '../../components/network/Service';
import { $Service_Url } from '../../components/network/UrlPath';
// import Invalid from '../../components/Account/Invalid';
// import Captcha from '../../components/Account/reCaptcha/Captcha';
import { SET_LOADER } from '../Store/Actions/action';
import konsole from '../../components/control/Konsole';
import { connect } from "react-redux";
import { isNotValidNullUndefile } from '../Reusable/ReusableCom';

const VerifyPasssword=(props)=>{
  let locationState =props?.selectclientdata
  let otpresdata=props?.otpresdata
  
  const [passwordType, setPasswordType] = useState('password');

konsole.log("propsprops",props)


    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    
    const handleChange = (event) => {
      // setSignUp({[event.target.id]: event.target.value});
  }

    const onSubmit = data => {

        // let captchaValue = captchaRef.current.checkCaptcha();
        // if (captchaValue == null) {
        //     return;
        // }
      
            let input = {
                "userActivationId": otpresdata?.activationid,
                "userRegstrtnId": otpresdata?.userRegstrtnId,
                "otpId":(props?.resendotp==true)?props?.resendotpid:otpresdata?.id,
                "userId": otpresdata?.createdBy,
                "activationKey": otpresdata?.activationKey ,
                "signUpPlatform": locationState?.signUpPlatform,
                "password": data.password,
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
                    props.setresendotp(false)
                    props.callapidata();
                    props.setshowvarifyPassword(false)
                    props.setshowcongratulation(true)

                 
                }
                else if (errorData) {
                    //setLoader(false);
                    konsole.log("err", errorData);
                    // captchaRef.current.refreshCaptcha();
                }
            })
        
    }


    const passwordToggle=()=>{
        konsole.log("passwordtype",passwordType)
        setPasswordType('ababab')
        if(passwordType == 'password'){
            setPasswordType('ababab')
        }else{
            setPasswordType('password')
        }
    }

   

console.log("poasswordpass",watch('password'))
    return (
        <>
          
                            
    <div className="container-fluid  m-0 bg-light" style={{height: 'auto', minHeight: '50vh'}}>
                                {/* <Header /> */}
                                <form onSubmit={handleSubmit(onSubmit)} className='' autoComplete="false">
                                    <p className='my-4  fw-bold fs-3 text-center theme-heading' style={{"color":"#720520"}}>
                                      Set Password
                                      </p>
                                    <div className='mt-5'>
                                        <div className=''>
                                            <label className="form-label fs-5">User Name</label>
                                            <input type="Email"
                                                // placeholder={username}
                                                className="form-control form-control-sm fs-5 bg-light"
                                                id="email"
                                                disabled
                                                value={locationState?.primaryEmailAddress}
                                            />
                                        </div>
                                        <div className="row text-start">
                                            <div className="col fs-4">
                                                <div className="mt-2 ">
                                                    <label for="password" className="form-label fs-5">
                                                        New Password
                                                    </label>
                                                    <div className='form-control d-flex p-0'>
                                                        <input
                                                            className="form-control border-0 fs-5"
                                                            type={passwordType}
                                                            // type="password"
                                                            id="password"
                                                            onChange={handleChange}
                                                            placeholder="Enter Password"
                                                            {...register('password', {
                                                                required: 'Password is required',
                                                                pattern: {
                                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@@#$%^&*])[A-Za-z\d!@@#$%^&*]{8,}$/,
                                                                    message: 'Please enter a valid password',
                                                                },
                                                                validate: {
                                                                    wrongConfirm: (val = String) => {
                                                                        if (val !== watch('confirmPassword')) {
                                                                            return "Your password does not match";
                                                                            // return true;
                                                                        }
                                                                    },
                                                                    // ValueNull : (value) => value !== ""
                                                                }
                                                            })}
                                                        />

                                                    <img src={`${(passwordType === "password") ? '/icons/clarity_eye-hide-line.svg' : '/icons/clarity_eye-show-line.svg'}`} className='img-fluid cursor-pointer mx-2' onClick={passwordToggle} />
                                                   
                                                    </div>
                                                    {(watch('password') !=='' && watch('password')?.length < 8) ? <p  className='emailAttention'>Please enter a valid password</p>:  < p className='emailAttention' > {
                                                        errors.password?.message !== "Your password does not match" && (
                                                            errors.password?.message
                                                        )}</p> }
                                                  
                                                    {/* <p className='emailAttention'>{(errors.confirmPassword?.message == 'Your passwords do no match' && errors.password?.message == 'Your passwords do no match' ) && (
                    errors.confirmPassword?.message
                  )}</p> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row text-start   fs-4">
                                            <div className="col fs-4">
                                                <div className="mt-2">
                                                    <label for="cnf-password" className="form-label fs-5">
                                                        Confirm Password
                                                    </label>
                                                    
                                                <div className={`${watch('password') !=='' &&(watch('password') ==watch('confirmPassword')) ? " form-control d-flex p-0":"conform-password-style"}`}>       
                                                {/* <div className={`${(passworderr === false) ? 'form-control d-flex p-0' : 'conform-password-style'}`}></div>                                           */}
                                                 <input
                                                        className= {`${watch('password') !=='' &&(watch('password') ==watch('confirmPassword')) ? " form-control fs-5 border-0":"form-control fs-5"}`}
                                                        id="cnf-password"
                                                        placeholder="Re-Enter Password"
                                                        // type="password"
                                                        type={passwordType}
                                                        {...register("confirmPassword", {
                                                            required: 'Confirm password is required',
                                                            validate: {
                                                                wrongConfirm: (val = String) => {
                                                                    if (watch('password') != val) {
                                                                        return "Your password does not match";
                                                                        // return true;
                                                                    }
                                                                },
                                                                // ValueNull : (value) => value !== ""
                                                            }
                                                        })}

                                                        
                                                    />
                                                      <img 
                                                      src={`${(isNotValidNullUndefile(watch('password')))  &&((watch('password') ==watch('confirmPassword'))) ? '/icons/Rightic.svg' : ''}`} className='img-fluid cursor-pointer mx-2 ' style={{width:"6%"}}
                                                       />
                                                        
                                                    </div>
                                                    
            
                                                        { watch('password') !=='' && watch('confirmPassword') !=='' && (watch('password') !==watch('confirmPassword')) ?
                                                        <p className='emailAttention'>Your password does not match</p>
                                                        :
                                                        <p className='emailAttention'>{(errors.confirmPassword?.message !== 'Your password does not match') && (
                                                            errors.confirmPassword?.message
                                                            )}
                                                            </p>
                                                    }
                                                    {/* <p className='emailAttention'>{(errors.confirmPassword?.message == 'Your password does not match' && errors.password?.message == 'Your password does not match') && (
                                                        errors.confirmPassword?.message
                                                    )}</p> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mt-4 bg-light p-2 rounded'>
                                            <h5 className='ms-2 fw-bold mt-2'>Password must match below criteria:</h5>
                                            <ul className='ms-2 fw-light'>
                                                <li>Must have minimum 8 characters</li>
                                                <li>Must contain at least one uppercase letter</li>
                                                <li>Must contain alphanumeric characters</li>
                                                <li>Must have atleast one special character</li>
                                                <li>Please enter only allowed special character in password,
                                                    allowed special characters are<h5 className='d-inline'> !@#$%^&*</h5></li>
                                            </ul>
                                        </div>
                                        <div>
                                            {/* <Captcha ref={captchaRef} /> */}
                                        </div>

                                        <div className="mt-3 d-flex justify-content-center">
                                            {/* <button className="theme-btn rounded fw-bold fs-5 "  type='submit'>{
                                                ((locationState == null && locationState?.signUpPlatform == undefined  && locationState?.nature == undefined)) ? 'Save Password' : "Save Password"
                                            }</button> */}
                                              <button className="theme-btn rounded fw-bold fs-5 "  type='submit'>
                                            Save Password</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                       
                       
                    
             
        </>
    );
                                          };

// export default VerifyPasssword;

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader })
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPasssword)