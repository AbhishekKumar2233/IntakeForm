import axios from "axios";
import React, { useState,useContext, useRef} from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { globalContext } from "../../../pages/_app";
import konsole from "../../control/Konsole";
import { $CommonServiceFn } from "../../network/Service";
import { $Service_Url } from "../../network/UrlPath";
import PhoneNumberMask from "../../../components/PhoneNumberMask"
import { $AHelper } from "../../control/AHelper";

import {  SET_LOADER,GET_Auth_TOKEN,GET_USER_DETAILS,} from "../../Store/Actions/action";
import { connect } from "react-redux";
import AlertToaster from "../../control/AlertToaster";
import { Button } from "react-bootstrap";
import OccurrenceParalegal from "../Datatable/OccurrenceParalegal";
import { isNotValidNullUndefile } from "../../Reusable/ReusableCom";
import { getApiCall } from "../../Reusable/ReusableCom";

const SignUp = (props) => {
  const { register,handleSubmit,clearErrors,setError,setValue,watch,formState: { errors },} = useForm();
  const {setdata,confirm}=useContext(globalContext)
  const [passwordType, setPasswordType] = useState("password");
  const [CountryCode, setCountryCode] = useState([]);
  const [subtenantId, setSubtenantId] = useState();
  const [loggedUserId, setLoggedUserId] = useState();
  const [sendLinkStatus, setSendLinkStatus] = useState();
  const [logoUrl, setLogoUrl] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [firstName, setFirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [openEmailTextPreview,setOpenEmailTextPreview]=useState(false)
  const [userInfo,setUserInfo]=useState('')
  const [uniqueLink,setUniqueLink]=useState('')
  const dropdownRef = useRef(null);
  const [plansData, setPlansData] = useState()
  const [selectedValue, setSelectedValue] = useState()



  useEffect(() => {
    let subtenantValue = sessionStorage.getItem("SubtenantId");
    let loggedUserValue = sessionStorage.getItem("loggedUserId");
    setSubtenantId(subtenantValue);
    setLoggedUserId(loggedUserValue);
    getPlansData()

    konsole.log("subtenantValuesubtenantValue", subtenantValue, loggedUserValue)
    
    callCountryCodeAPi();
    userLogo();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const getPlansData =async()=>{
     const _resultOf = await getApiCall('GET', $Service_Url.fetchUserServicePlan, "");
     
     setPlansData(_resultOf)
  }


  const userLogo = () => {
    const subtenantId = sessionStorage.getItem("SubtenantId");
    const subtenantLogoUrl = $AHelper.getCookie("subtenantLogoUrl");
    // const userId = "7aeea162-1200-4bb8-b53b-e7e3013a0f28"
    // const loggedUserId = "7aeea162-1200-4bb8-b53b-e7e3013a0f28";

    if(isNotValidNullUndefile(subtenantLogoUrl) && subtenantLogoUrl != 'undefined'){
      setLogoUrl(subtenantLogoUrl);
      return;
    }
    let subtenantObj = {subtenantId: subtenantId}
    konsole.log("useId", subtenantId);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getSubtenantDetails, subtenantObj,
      (response) => {
        if (response) {
          konsole.log("fiduciaryList", response.data);
          setLogoUrl(response.data.data[0].subtenantLogoUrl)
          $AHelper.setCookie("subtenantLogoUrl", response.data.data[0].subtenantLogoUrl)
          sessionStorage.setItem("subtenantName",response.data.data[0].subtenantName)
        }
      }
    );
  };




  const passwordToggle = () => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };

  const SendLinkFunc = (e) => {
    konsole.log("SendLinkFunc", e.target.checked);
    setSendLinkStatus(e.target.checked);
  };

  const callCountryCodeAPi = () => {
    $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getCountryCode, "", (response) => {
        if (response) {
          konsole.log("responseresponse", response);
          setCountryCode(response.data.data);
          setValue("countryCode",response.data.data[0]?.value)
        }
      }
    );
  };

  const onSubmit =(data) => {
    if(disabled) return;
    setDisabled(true)
      // konsole.log("SignUpSignUp", JSON.stringify(data));
    const phoneNo = watch("phoneNo")
    const countryCode = watch("countryCode");
    if(countryCode == (-1)){
      setError("countryCode", {message: "*required" })
      // konsole.log("countryCode",countryCode)
      setDisabled(false)
      return;
    }
    konsole.log("watch list", watch("phoneNo"), typeof (phoneNo));
    if (phoneNo == undefined || phoneNo == "") {
      // errors['phoneNo']?.message = "Enter the valid Cell Nummber"
      setError("phoneNo", { type: "error", message: "Please enter the Cell Number" })
      setDisabled(false)
      return;
    }
    else if (phoneNo !== undefined && phoneNo !== "" && phoneNo?.length < 10) {
      setError("phoneNo", { type: "error", message: "Enter the valid Cell Nummber" })
      konsole.log("watch list", watch("phoneNo"));
      setDisabled(false)
      return;
    }
  
    else if(countryCodeValue == undefined || countryCodeValue == null || countryCodeValue == ''){
      setError("countryCode", { type: "error", message: "Enter the country code" })
      // konsole.log("watch list", watch("phoneNo"));
      setDisabled(false)
      return;
    }


    const input = {
      subtenantId: subtenantId,
      signUpPlateform: 6,
      createUserCredentials: true,
      createdBy: loggedUserId,
      user: {
        roleId: 10,
        firstName: $AHelper.capitalizeFirstLetter(data.firstName),
        lastName: $AHelper.capitalizeFirstLetter(data.lastName),
        emailAddress: data.email,
        userName: data.email,
        countryCode: countryCodeValue,
        mobileNumber: data.phoneNo,
        activateUser: false,
        autoConfirmEmail: false,
        autoConfirmMobile: false,
        servicePlanId:data?.plans

      },
    };
    konsole.log("SignUpSignUp", JSON.stringify(input));
       
    props.dispatchloader(true);
 
 $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.postAddUser,input,async(response, errorData) => {
  props.dispatchloader(false);
        if (response) {
          konsole.log("CreateUserRes", JSON.stringify(response.data.data));
          let mobileNo=data?.countryCode+data?.phoneNo
          let useInfo={
            emailTo:data?.email,
            textTo:mobileNo,
            memberName:data.firstName +' '+data?.lastName,
            memberLoggesInId:response?.data?.data?.id,
            userId:response?.data?.data?.userId
          }
          setUserInfo(useInfo)
          if (sendLinkStatus == true) {
            userActivationLink(response.data.data);
          } else {
            props.callapidata();
            props.setOpenModal(false);
            props.dispatchloader(false);
            toasterShowMsg("Registered Successfully", "Success");
            // AlertToaster.success("Registered Successfully")
          }
        } else {
          konsole.log("errorDataerrorDataADDUser",errorData)
          konsole.log("errorDataerrorDataADDUser", errorData?.status,errorData.data?.errorFlag);
          if (errorData.status == 400 && errorData.data?.errorFlag == "ROLE_ALREADY_ASSIGNED") {
            // alert("Requested role 'Direct Intake Member' is already assigned");
            toasterShowMsg("Requested role 'Direct Intake Member' is already assigned","Warning")
            props.dispatchloader(false);
            props.setOpenModal(false);
            setDisabled(false)
            return;
          }
          else if (errorData.status == 400 && errorData.data?.errorFlag == "EQUIVALENT_ROLE") {
            // alert("Can not assign requested role , equivalent role is already assigned");
            toasterShowMsg("Can not assign requested role , equivalent role is already assigned","Warning")
            props.dispatchloader(false);
            props.setOpenModal(false);
            setDisabled(false)
            return;
          }
          else  if (errorData.status == 400 && errorData.data?.errorFlag == "INVALID_SUBTENANT") {
            // alert(errorData.data?.messages[0]);
             toasterShowMsg(errorData.data?.messages[0],"Warning")
            props.dispatchloader(false);
            props.setOpenModal(false);
            setDisabled(false)
            return;
          }
          else if (errorData.status == 400 && errorData?.data?.data?.userActivationMode == "ALREADY_REGISTERED") {
            props.dispatchloader(false);
            let isExecuted =await confirm(true,"A user with this email already exists in the Prospective Clients list. Would you like to upgrade them to an Intake Client ?","Confirmation");
            let alreadyregusteruserId=errorData?.data?.data?.userId
            if (isExecuted == true) {

              const datadata = {
                loginUserId: errorData.data.data.id,
                // loginUserId: errorData.data.data.userRgstId,
                subtenantId: subtenantId,
                roleId: 10,
                isActive: true,
                createdBy: loggedUserId
              }
              konsole.log("JSON.stringify(datadata)", JSON.stringify(datadata))
              MultiroleSignup(errorData.data.data, datadata,alreadyregusteruserId);
            }
            props.dispatchloader(false);
            props.setOpenModal(false);
            setDisabled(false)
            return;
          }

          // alert(errorData.data?.errorFlag);
          toasterShowMsg(errorData.data?.errorFlag,"Warning")
          props.dispatchloader(false);
          props.setOpenModal(false);  
          
        }
      }
    );

  }

  const MultiroleSignup = (registerData, datadata,alreadyregusteruserId) => {
    konsole.log("datadatadatauserId", registerData.userId);
    konsole.log("datadatadatauserId", JSON.stringify(datadata));

    $CommonServiceFn.InvokeCommonApi(
      "POST",
      $Service_Url.postUserRole + "/" + registerData.userId,
      datadata,
      (response, errorData) => {
        if (response) {
          konsole.log("CreateUserRes", JSON.stringify(response.data));
          konsole.log("CreateUserjRes", response?.data);          
          konsole.log("roleidroleid",datadata?.roleId)
          if(datadata?.roleId == 1 ||  datadata?.roleId ==9 || datadata?.roleId==10){
          getprimarymemberapi(registerData,alreadyregusteruserId)
          }else{
            if (sendLinkStatus == true) {
              userActivationLink(registerData);
            } else {
              props.callapidata();
              // AlertToaster.success("Role Update Successfully")
              toasterShowMsg("Role Update Successfully","Success")
              props.setOpenModal(false);
              props.dispatchloader(false);
            }
          }

        } else {
          konsole.log("errorDataerrorDataMultiRole", errorData.data.errorFlag);
          if (errorData.status == 400) {
            // alert(errorData.data?.errorFlag);
            props.dispatchloader(false);
            props.setOpenModal(false);
          }
        }
      }
    );
  }


  const getprimarymemberapi = (registerData,alreadyregusteruserId)=>{
    props.dispatchloader(true);

    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFamilyMemberbyID + alreadyregusteruserId,
            "", (response) => {
              props.dispatchloader(false);
                if (response) {
                    
                  konsole.log("responseres",response)
                    let responsedata= response?.data?.data?.member?.isPrimaryMember
                    let responsegetmember=response;
                    konsole.log("responsedataresponsedata",responsedata,responsegetmember)
                    if(responsedata==false){
                      updatememberapi(responsegetmember, registerData,alreadyregusteruserId)

                    }else{

                      if (sendLinkStatus == true) {
                        userActivationLink(registerData);
                      } else {
                        props.callapidata();
                        // AlertToaster.success("Role Update Successfully")
                        toasterShowMsg("Registered Successfully", "Success");

                        props.setOpenModal(false);
                        props.dispatchloader(false);
                      }
                    }
                
                }
            })
  }


  
  const updatememberapi=(responsegetmember,registerData,alreadyregusteruserId)=>{
    props.dispatchloader(true);
    let responsegetmemberdata=responsegetmember?.data?.data?.member
    let updatedby=$AHelper.getObjFromStorage('stateObj')?.userId


    let inputData={
      "subtenantId": responsegetmemberdata?.subtenantId,
      "fName": responsegetmemberdata?.fName,
      "mName": responsegetmemberdata?.mName,
      "lName": responsegetmemberdata?.lName,
      "nickName": responsegetmemberdata?.nickName,
      "dob": responsegetmemberdata?.dob,
      "isVeteran": responsegetmemberdata?.isVeteran,
      "isPrimaryMember": true,
      "suffixId": responsegetmemberdata?.suffixId,
      "citizenshipId": responsegetmemberdata?.citizenshipId,
      "noOfChildren":responsegetmemberdata?.noOfChildren,
      "genderId":responsegetmemberdata?.genderId,
      "maritalStatusId": responsegetmemberdata?.maritalStatusId,
      "birthPlace": responsegetmemberdata?.birthPlace,
      "userId": alreadyregusteruserId,
      "updatedBy": updatedby,
      "memberRelationship":responsegetmemberdata?.memberRelationship
    }
    // let inputData=responsegetmember?.data?.data?.member



    konsole.log("responsegetmemberresponsegetmember",JSON.stringify(inputData))
    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUpdateMember,
    inputData, (response,errorData) => {
      props.dispatchloader(false);
      if(response){
        konsole.log("resresrererrr",response)

        if (sendLinkStatus == true) {
          userActivationLink(registerData);
        } else {
          props.callapidata();
          // AlertToaster.success("Role Update Successfully")
          toasterShowMsg("Registered Successfully", "Success");
          props.setOpenModal(false);
          props.dispatchloader(false);
        }
      }else{
        props.dispatchloader(false)
        konsole.log("resresrererrr",errorData)
      }
        })
  }




  const userActivationLink = (registerData) => {
    let createdBy = sessionStorage.getItem("loggedUserId")
    // let jsonObj = {
    //   subtenantId: subtenantId,
    //   loginUserId: registerData.id,
    //   userId: registerData.userId,
    // };
    let jsonObj =  {
      "userRegstrtnId": registerData.id,
      "userId": registerData.userId,
      "signUpPlatform":  registerData.signUpPlatform,
      "createdBy": createdBy,
      "clientIPAddress":  "::1"
    }
    
    konsole.log("jsonjsonsendactivation", JSON.stringify(jsonObj));
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi( "POST", $Service_Url.getUserActivationLink, jsonObj, (res, errorData) => {
      props.dispatchloader(false)
      if (res) {
          konsole.log("responseresponseSecond", res);
          setUniqueLink(res.data.data?.activationURL)
          setOpenEmailTextPreview(true)
          props.dispatchloader(false);
          // AlertToaster.success("Link Sent Successfully")
        } else {
          konsole.log("errorerrorDataLink", errorData);
          // AlertToaster.error("Link Sent Failed")
          toasterShowMsg("Link Sent Failed","Warning")
          props.dispatchloader(false);

        }
      }
    );
  };

  const closeModals=()=>{
    props.callapidata();
    props.setOpenModal(false);
    setOpenEmailTextPreview(false)
    showWhenRegisterButNotInvite()
  }

  const showWhenRegisterButNotInvite = () =>{
    toasterShowMsg("User registered successfully but as you choose not to send the email hence activation link is not sent to the client. You can activate the client by 'Activate Client' button.", "Success");
  }


  const handleChange = (target) => {
    konsole.log("targettarget", target.value)
    // setSignUp({[event.target.id]: event.target.value});
  };
  const inputfieldcapital = (val) => {
    // const valueenter = val.target.value
    const valueenter = val.target.value?.replace(/^\s+/g, '');
    const valueid = val.target.id;
    let value = $AHelper.capitalizeFirstLetter(valueenter);
    konsole.log(val.target.value, val.target.id)

    if (valueid == 'firstName') {
      setFirstName(value)
    } else {
      setlastName(value)
    }
  }


  const toasterShowMsg = (message, type) => {
    setdata({ open: true, text: message, type: type,})
  }

  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('(+1) USA');
  const [filteredOptions, setFilteredOptions] = useState();
  const [countryCodeValue, setcountryCodevalue] = useState('+1');


   useEffect(() => {
    setFilteredOptions($AHelper.sortCountryfromArray(CountryCode));

    // Click outside logic
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        if (!searchInput) {
          setSearchInput('(+1) USA');
          setcountryCodevalue('+1');
        }
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [CountryCode, searchInput]);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearchInput('')
    setFilteredOptions($AHelper.sortCountryfromArray(CountryCode))
    setcountryCodevalue('')
  };

  const filterOptions = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchInput(input);
    setIsOpen(true);
    if(errors.countryCode && errors.countryCode?.type == "error"){
      clearErrors('countryCode');
   }
   
    
    const filtered = $AHelper.sortCountryfromArray(CountryCode).filter((option) =>
      option.label.toLowerCase().includes(input)
    );
    setFilteredOptions(filtered);
  };

  const selectOption = (value) => {
    setSearchInput(value.label);
    if(errors.countryCode && errors.countryCode?.type == "error"){
       clearErrors('countryCode');
    }
    
    setcountryCodevalue(value.value)
    setIsOpen(false);
   
  };

  const handleChanges = (event) => {
    setSelectedValue(event.target.value);
  };


  return (
    <>
      <div className="logoMainCSS">
        <img
          src={logoUrl !== null ? logoUrl : ""}
          alt="Subtenant Logo"
          className=""
          style={{ maxWidth: "150px", width: "100%" }}
        />

      </div>
      <div className="MainSignUp">
        <div className=" InnerSignUp w-100">
          <p className="text-center mt-4">
            <strong className="fs-3 " style={{ color: "#720c20" }}>
              {/* Direct Intake Form Link */}
              Intake Form Registration
            </strong>
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className="row fs-4">
              <div className="col-6">
                <label for="firstName" className="form-label fs-5">
                  First Name
                </label>
                <div className="input-group mb-3">
                  <input
                    style={{ width: "200px" }}
                    type="text"
                    className="form-control form-control-sm fs-5 upperCasingFirstLetter"
                    id="firstName"
                    aria-describedby="basic-addon3"
                    placeholder="Enter First Name"
                    onChange={handleChange}
                    value={firstName}
                    {...register("firstName", {
                      pattern: {
                        value: /[A-Z a-z]/,
                        message: "Please enter valid First Name Allowed",
                      },
                      onChange: (e) => { inputfieldcapital(e) },
                      validate: { ValueNull: (value) => value !== "" },
                    })}
                  />
                  {errors.firstName &&
                    errors.firstName.type === "ValueNull" && (
                      <p className="attention">First name is required</p>
                    )}
                  {errors.firstName && (
                    <p className="attention">{errors.firstName.message}</p>
                  )}
                </div>
              </div>
              <div className="col-6">
                <label for="lastName" className="form-label fs-5">
                  Last Name
                </label>
                <div className="input-group">
                  <input
                    style={{ width: "200px" }}
                    type="text"
                    className="form-control form-control-sm fs-5 upperCasingFirstLetter"
                    id="lastName"
                    aria-describedby="basic-addon3"
                    placeholder="Enter Last Name"
                    onChange={handleChange}
                    value={lastName}
                    {...register("lastName", {
                      pattern: {
                        value: /[A-Z a-z]/,
                        message: "Please enter valid Last Name Allowed",
                      },
                      onChange: (e) => { inputfieldcapital(e) },
                      validate: { ValueNull: (value) => value !== "" },
                    })}
                  />
                  {errors.lastName && errors.lastName.type === "ValueNull" && (
                    <p className="attention">Last name is required</p>
                  )}
                  {errors.lastName && (
                    <p className="attention">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="row text-start  fs-4">
            <div className="col-6">
            <label for="email" className="form-label fs-5">Email</label>
              <div className="input-group">
                <input
                  className="form-control form-control-sm fs-5"
                  aria-describedby="basic-addon3"
                  style={{ width: "100%" }}
                  placeholder=" Enter Email"
                  id="email"
                  type="text"
                  //   onInput={handleEmail}
                  onChange={handleChange}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
                {
                  <p className="emailAttention">
                    {errors.email?.message && errors.email?.message}
                  </p>
                }
                {/* {emailRegistered && <p className='emailAttention'>Email already registered</p>} */}
              </div>
            </div>
              <div className="col-6">
                <label for="options" class="form-label fs-5">Choose a plan</label>
                <select class="form-select form-control-sm fs-5" id="plans" name="plans"defaultValue='' onChange={handleChanges}
                 {...register("plans", {required: "Plans is required"})}
                >
                 <option value="" disabled  hidden>Select</option>
                  {isNotValidNullUndefile(plansData) &&
                    plansData.map((ele, index) => (
                      <option key={index} value={ele?.value}>{ele?.label}</option>
                    ))
                  }
                  
                 
                </select>
                <p className="emailAttention">
                    {errors.plans?.message && errors.plans?.message}
                  </p>

              </div>           
              </div>
            <div className="row text-start  mt-2 fs-4">
              <label for="basic-url" className="form-label fs-5">
                Cell  Number
              </label>
              <div className="row text-start">
                <div className="col-5">            
                  <div>
                    <div ref={dropdownRef} style={{ position: 'relative', width: '180px'}}>
                      <input
                        type="text"
                        className="p-2 fs-5"
                        value={searchInput}
                        placeholder="Select country code..."
                        onChange={filterOptions}
                        onClick={toggleDropdown}
                        // id='countryCode'
                        style={{
                          width: '100%',
                          padding: '10px !important',
                          border: '1px solid #ced4da',
                          borderRadius: '4px',
                        }}
                      />
                      {isOpen && (
                        <ul
                          style={{
                            position: 'absolute',
                            width: '100%',
                            maxHeight: '150px',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            marginTop: '5px',
                            padding: '0',
                            listStyle: 'none',
                          }}
                        >
                          {filteredOptions?.map((option, index) => (
                            <li
                              className="fs-5"
                              key={index}
                              onClick={() => selectOption(option)}
                              style={{ padding: '7px', cursor: 'pointer' }}
                            >
                              {option.label}
                            </li>
                          ))}
                        </ul>
                      )}
                  {errors.countryCode && errors.countryCode?.type == "error" && (<p className='attention'>{errors.countryCode.message}</p>)}
                  </div>
                   </div>
                  
                </div>
               
                <div className="col-7 text-start">
                  <div className="input-group">
                    <PhoneNumberMask setValue={setValue} setError={setError} setClearError={clearErrors} />
                  </div>
                  {errors.phoneNo && errors.phoneNo?.type == "error" && (<p className='attention'>{errors.phoneNo.message}</p>)}
                </div>
              </div>
            </div>

            {/* ......................................................................................................................... */}
            {/* <div className="row text-start">
              <div className="col fs-4">
                <div className="mt-2 ">
                  <label for="password" className="form-label fs-5">
                    Password
                  </label>
                  <div className="form-control d-flex p-0">
                    <input
                      className="form-control border-0 fs-5"
                      type={passwordType}
                      id="password"
                      onChange={handleChange}
                      placeholder="Enter Password"
                      {...register("password", {
                        required: "Password is required",
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@@#$%^&*])[A-Za-z\d!@@#$%^&*]{8,}$/,
                          message: "Please enter a valid password",
                        },
                        validate: {
                          wrongConfirm: (val = String) => {
                            if (val !== watch("confirmPassword")) {
                              return "Your password do no match";
                            }
                          },
                        },
                      })}
                    />
                    <img
                      src={`${
                        passwordType === "password"
                          ? "/icons/clarity_eye-hide-line.svg"
                          : "/icons/clarity_eye-show-line.svg"
                      }`}
                      className="img-fluid cursor-pointer mx-2"
                      onClick={passwordToggle}
                    />
                  </div>

                  <p className="emailAttention">
                    {" "}
                    {errors.password?.message !== "Your password do no match" &&
                      errors.password?.message}
                  </p>
                 
                </div>
              </div>
            </div>
            <div className="row text-start   fs-4">
              <div className="col fs-4">
                <div className="mt-2">
                  <label for="cnf-password" className="form-label fs-5">
                    Confirm Password
                  </label>
                  <input
                    className="form-control form-control fs-5"
                    id="cnf-password"
                    placeholder="Re-Enter Password"
                    type="password"
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: {
                        wrongConfirm: (val = String) => {
                          if (watch("password") != val) {
                            return "Your password do no match";
                          }
                        },
                      },
                    })}
                  />
                  <p className="emailAttention">
                    {errors.confirmPassword?.message !==
                      "Your password do no match" &&
                      errors.confirmPassword?.message}
                  </p>
                  <p className="emailAttention">
                    {errors.confirmPassword?.message ==
                      "Your password do no match" &&
                      errors.password?.message == "Your password do no match" &&
                      errors.confirmPassword?.message}
                  </p>
                </div>
              </div>
            </div> */}
            {/* ......................................................................................................................... */}

            {/* <div className="row text-start fs-4 mb-2" style={{border:"1px solid red"}}>
              <div className="col mt-2">
                <label for="input-promo" className="form-label">
                  Promo Code <span className='text-secondary'>(Optional)</span>
                </label>
                <div className="input-group ">
                  <input
                    type="text"
                    className="form-control fs-5"
                    id="packageCode"
                    onChange={handleChange}
                    placeholder="Enter Promo Code"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary fs-5 text-white" style={{ backgroundColor: '#D79B48'}}  type="button">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
            {/* <div className="">
              <Captcha ref={captchaRef} />
            </div> */}
            <div className="mt-3 me-2 float-start">
              <input type="checkbox" style={{ width: "20px" }} onClick={SendLinkFunc}/>
            </div>
            <div className="fs-4 mt-2 ms-4">Send intake form link</div>
            {/* <div className="mt-4 bg-light p-2 rounded">
              <h5 className="ms-2 fw-bold mt-2">
                Password must match below criteria:
              </h5>
              <ul className="ms-2 fw-light">
                <li>Must have minimum 8 characters</li>
                <li>Must contain at least one uppercase letter</li>
                <li>Must contain alphanumeric characters</li>
                <li>Must have atleast one special character</li>
                <li>
                  Please enter only allowed special character in password,
                  allowed special characters are
                  <h5 className="d-inline"> !@#$%^&*</h5>
                </li>
              </ul>
            </div> */}
            <div className="row text-start mt-2 fs-4">
              <div className="col-3"></div>
              <div className="d-grid mt-2 gap-2 pt-2">
                <button className="theme-btn fs-4 mt-2 rounded" type="submit">
                  {sendLinkStatus == true? "Register and Send Intake Form Link": "Register"}
                </button>
              </div>
            </div>
            {/* <div className="d-flex justify-content-center fs-6 mt-2">
              <p className="fs-4">
                Already have an account?{" "}
                <strong
                  className="cursor-pointer theme-heading text-decoration-underline"
                  onClick={() => navigate("/Account/SignIn")}
                >
                  Sign in
                </strong>
              </p>
            </div> */}
          </form>
        </div>
      </div>

      <OccurrenceParalegal
      emailTo={userInfo?.emailTo}
      textTo={userInfo?.textTo}
      occurrenceId={4} 
      showpreviewmodal={openEmailTextPreview}
      handleClosePreviewModal={closeModals}
      memberName={userInfo?.memberName}
      memberLoggesInId={userInfo?.memberLoggesInId}
      userId={userInfo?.userId}
      uniqueLink={uniqueLink}
      />
    </>
  );
};

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
  dispatchUserDetail: (userDetails) =>
    dispatch({ type: GET_USER_DETAILS, payload: userDetails }),
  dispatchAuthId: (authId) =>
    dispatch({ type: GET_Auth_TOKEN, payload: authId }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
