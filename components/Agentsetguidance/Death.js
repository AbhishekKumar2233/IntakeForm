import React, { useState, useEffect, useContext } from "react";
import {Row,Col,Form,Radio} from 'react-bootstrap';
import konsole from "../control/Konsole";
import { $AHelper } from "../control/AHelper";
import { death } from "../control/Constant";
import { $CommonServiceFn } from "../network/Service";
import { $Service_Url } from "../network/UrlPath";
import AgentguidanceCom from "./AgentguidanceCom";
import UploadFile from "./UploadFile";
import { globalContext } from "../../pages/_app";
import { connect} from "react-redux";
import { SET_LOADER } from "../Store/Actions/action";
import AlertToaster from "../control/AlertToaster";
import CustomStepper from "./CustomStepper";
import NotifyStep from "./NotifyStep";
import PlaceOfBirth from "../PlaceOfBirth";
import { isNotValidNullUndefile } from "../Reusable/ReusableCom";



const Death = (props) => {
  const spouseUserId = sessionStorage.getItem('spouseUserId')
  const {setdata} = useContext(globalContext)
  const [selectedStepper, selectSelectedStepper] = useState(0);
  const [changeBorder, setChangeBorder] = useState(1);

const [stepperNo,setStepperNo]=useState(0)

  const [radioValue, setRadioValue] = useState("Buried");
  const [radioFuneralValueTwo, setRadioFuneralValueTwo] = useState("funeralno");
  const [radioFuneralValueTwoburied, setRadioFuneralValueTwoburied] =useState("funeralno");
  const [radioValueDisposed, setRadioValueDisposed] = useState();
  const [radioNationalCemetery, setRadioNationalCemetery] = useState();
  const [formlabelData, setFormLabelData] = useState({});
  const [memberuserId, setMeberUserId] = useState();
  const [specialInsAns, setSpecialInsAns] = useState();
  const [disposedOther, setDisposedOther] = useState();
  const [ashesOther, setAshesOther] = useState();
  const [holdashesOther, setHoldAshesOther] = useState();
  const [nameofcontact, setnameofcontact] = useState();
  const [nameoffuneral, setnameoffuneral] = useState();
  const [contactnum, setcontactnum] = useState();
  const [Phonenum, setPhonenum] = useState();
  const [faxnum, setfaxnum] = useState();
  const [wesite, setwesite] = useState("");
  const [address, setaddress] = useState('');
  const [nameofcontactburied, setnameofcontactburied] = useState();
  const [nameoffuneralburied, setnameoffuneralburied] = useState();
  const [contactnumburied, setcontactnumburied] = useState();
  const [Phonenumburied, setPhonenumburied] = useState();
  const [faxnumburied, setfaxnumburied] = useState();
  const [wesiteburied, setwesiteburied] = useState("");
  const [addressburied, setaddressburied] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [Helduntilseconddeath, setHelduntilseconddeath] = useState();
  const [SpecialInstructions,setSpecialInstructions] = useState('')
  const[otherspecialinstrshow,setotherspecialinstrshow] = useState(null)
  const [Veteanstatus,setVeteranstatus]=useState(false)
  const [sameForspouse,setSameforspouse] = useState(false)
  const [showSpouseCheck,setShowspouseCheck] = useState(true);
  const [showSpouseCheck2,setShowspouseCheck2] = useState(true)

  const hidebtn = true;

  let memberUserId = props.memberId
  konsole.log(memberUserId,"memberUserId")

  useEffect(()=>{
    let memberUserId = props?.memberId
    selectSelectedStepper(1)
    getsubjectForFormLabelId(memberUserId);
    setMeberUserId(memberUserId);
    getVeteranByUserIdfunc(memberUserId)
    setRadioNationalCemetery()
    setSpecialInsAns()
    setDisposedOther()
    setAshesOther()
    setHoldAshesOther()
    setnameofcontact()
    setnameoffuneral()
    setcontactnum()
    setPhonenum()
    setfaxnum()
    setwesite()
    setaddress()
    setnameofcontactburied()
    setnameoffuneralburied()
    setcontactnumburied()
    setPhonenumburied()
    setfaxnumburied()
    setwesiteburied()
    setaddressburied()
    setErrorMessage()
    setHelduntilseconddeath()
    setSpecialInstructions()
    setotherspecialinstrshow()
    setSpecialInsAns('')
    setRadioValue('')
    setRadioFuneralValueTwo('')
    setRadioFuneralValueTwoburied('')
    setRadioNationalCemetery('')
    setRadioValueDisposed('')
    setFormLabelData('')
    setStepperNo(0)
  },[props.memberId])

  const getVeteranByUserIdfunc = (userId) => {
    if(!isNotValidNullUndefile(userId))return;
  $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getVeteranData+userId,"",(res,err)=>{
  if(res){
  konsole.log(res,"ruiyrruiruie")
  setVeteranstatus(true)}
  else{
  konsole.log(err,"ruiyrruiruie")
  setVeteranstatus(false)
  }
  })
  }

  function isUrlValid(userInput) {
    if (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(userInput)
    ) {
      setErrorMessage(false);
      setwesite(userInput);
    } else {
      setwesite(userInput);
      setErrorMessage(true);
    }
  }
  function isUrlValidburied(userInput) {
    if (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(userInput)
    ) {
      setErrorMessage(false);
      setwesiteburied(userInput);
    } else {
      setwesiteburied(userInput);
      setErrorMessage(true);
    }
  }

  const getsubjectForFormLabelId = (userId) => {
    // setLoader(true);
    let formlabelData = {};
    // death.formLabelId.map((id, index) => {
    //   let data = [id.id];
      props.dispatchloader(true)
      $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.getsubjectForFormLabelId, death.formLabelId, (response) => {
        props.dispatchloader(false)
        konsole.log("response", response);
        if (response) {
        //   setLoader(false);
        const resSubData = response.data.data;

          for (let resObj of resSubData) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = resObj.question;
            props.dispatchloader(true)
            $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getSubjectResponse +userId + `/0/0/${formlabelData[label].questionId}`, "", (response, err) => {
              props.dispatchloader(false)
              if (response) {
                // setLoader(false)
                konsole.log(response,"responsetryeuiop")
                if (response.data.data.userSubjects.length !== 0) {
                  let responseData = response.data.data.userSubjects[0];
                  for (
                    let i = 0;
                    i < formlabelData[label].response.length;
                    i++
                  ) {
                    // konsole.log("datashownatcaregiver at", i, responseData);
                    if (formlabelData[label]?.questionId == 130) {
                      setSpecialInstructions(responseData?.response)
                    } else {
                    }
                    if (
                      formlabelData[label].response[i].responseId ===
                      responseData.responseId
                    ) {
                      if (responseData.responseNature == "Radio") {
                        formlabelData[label].response[i]["checked"] = true;
                        if (formlabelData[label].questionId == 108) {
                          setRadioValue(responseData.responseId);
                          setShowspouseCheck(false)
                        } else {
                        }
                        if (formlabelData[label].questionId == 109) {
                          setRadioFuneralValueTwo(responseData.responseId);
                        } else {
                        }
                        if (formlabelData[label].questionId == 144) {
                          setRadioFuneralValueTwoburied(
                            responseData.responseId
                          );
                        } else {
                        }
                        if (formlabelData[label].questionId == 110) {
                          setRadioValueDisposed(responseData.responseId);
                        } else {
                        }
                        if (formlabelData[label].questionId == 111) {
                          setRadioNationalCemetery(responseData.responseId);
                        } else {
                        }
                        if (formlabelData[label].questionId == 133) {
                          setHelduntilseconddeath(responseData.responseId);
                        } else {
                        }
                        if (formlabelData[label].questionId == 201) {
                          setotherspecialinstrshow(responseData.responseId);
                          setShowspouseCheck2(false)
                        } else {
                        }

                        formlabelData[label]["userSubjectDataId"] =
                          responseData.userSubjectDataId;
                      } else if (responseData.responseNature == "Text") {
                        if (responseData.responseId == 264) {
                          setDisposedOther(responseData.response);
                        }
                        if (responseData.responseId == 265) {
                          setAshesOther(responseData.response);
                        }
                        if (responseData.responseId == 266) {
                          setHoldAshesOther(responseData.response);
                        }
                        if (responseData.responseId == 267) {
                          setnameofcontact(responseData.response);
                        }
                        if (responseData.responseId == 268) {
                          setnameoffuneral(responseData.response);
                        }
                        if (responseData.responseId == 269) {
                          setcontactnum(responseData.response);
                        }
                        if (responseData.responseId == 270) {
                          setPhonenum(responseData.response);
                        }
                        if (responseData.responseId == 271) {
                          setaddress(responseData.response);
                        }
                        if (responseData.responseId == 272) {
                          setwesite(responseData.response);
                        }
                        if (responseData.responseId == 273) {
                          setfaxnum(responseData.response);
                        }


                        if (responseData.responseId == 276) {
                          setnameofcontactburied(responseData.response);
                        }
                        if (responseData.responseId == 277) {
                          setnameoffuneralburied(responseData.response);
                        }
                        if (responseData.responseId == 278) {
                          setcontactnumburied(responseData.response);
                        }
                        if (responseData.responseId == 279) {
                          setPhonenumburied(responseData.response);
                        }
                        if (responseData.responseId == 280) {
                          setaddressburied(responseData.response);
                        }
                        if (responseData.responseId == 281) {
                          setwesiteburied(responseData.response);
                        }
                        if (responseData.responseId == 282) {
                          setfaxnumburied(responseData.response);
                        }

                        formlabelData[label].response[i]["response"] =
                          responseData.response;
                        formlabelData[label]["userSubjectDataId"] =
                          responseData.userSubjectDataId;
                      }
                    }
                  }
                }
              }
            //   setLoader(false)
            });
            setFormLabelData(formlabelData);
          }
        }
      });
    // });
  };

  const onChange = (e) => {
    setRadioValue(e.target.value);
  };

  const onchangePhone = (e) => {
    setPhonenum(e.target.value);
  };
  const onchangeContact = (e) => {
    setcontactnum(e.target.value);
  };

  const onchangeFax = (e) => {
    setfaxnum(e.target.value);
  };

  const onchangeaddress = (e) =>{
    setaddress(e?.addressLine1 || "")
  }
  
  //buried data
  const onchangePhoneburied = (e) => {
    setPhonenumburied(e.target.value);
  };
  const onchangeContactburied = (e) => {
    setcontactnumburied(e.target.value);
  };

  const onchangeFaxburied = (e) => {
    setfaxnumburied(e.target.value);
  };

  const onChangeFuneral = (e) => {
    setRadioFuneralValueTwo(e.target.value);
  };

  const onChangeFuneralburied = (e) => {
    setRadioFuneralValueTwoburied(e.target.value);
  };

  const onChangespecialinstrshow = (e) => {
    setotherspecialinstrshow(e.target.value);
  };

  const onChangeDisposed = (e) => {
    setRadioValueDisposed(e.target.value);
  };

  const onChangeNationalCemetery = (e) => {
    setRadioNationalCemetery(e.target.value);
  };

  const onChangeHelduntil = (e) => {
    setHelduntilseconddeath(e.target.value);
  };

  const onchangeaddressburied = (e) =>{
  setaddressburied(e?.addressLine1 || "")
  }

  const shwoComponents = (e) => {
    selectSelectedStepper(e);
  };
  const shwoEndLifeComponent = (e) => {
    setChangeBorder(e);
  };
 

  const Submitbutton = () => {

    let arrdata =
      radioValue == 222
        ? [
            {
              userSubjectDataId: formlabelData.label905?.userSubjectDataId,
              subjectId: formlabelData.label905?.questionId,
              responseId: radioValue,
              userId: memberUserId,
            },
            {
              userSubjectDataId: formlabelData.label906?.userSubjectDataId,
              subjectId: formlabelData.label906?.questionId,
              responseId: radioFuneralValueTwo,
              userId: memberUserId,
            },

            {
              userSubjectDataId: formlabelData.label907?.userSubjectDataId,
              subjectId: formlabelData.label907?.questionId,
              responseId: radioValueDisposed,
              userId: memberUserId,
            },
          ]
        : radioValue == 223
        ? [
            {
              userSubjectDataId: formlabelData.label905?.userSubjectDataId,
              subjectId: formlabelData.label905?.questionId,
              responseId: radioValue,
              userId: memberUserId,
            },
            // {
            //   userSubjectDataId: formlabelData.label906?.userSubjectDataId,
            //   subjectId: formlabelData.label906?.questionId,
            //   responseId: radioFuneralValueTwo,
            //   userId: memberUserId,
            // },
            {
              userSubjectDataId: formlabelData.label940?.userSubjectDataId,
              subjectId: formlabelData.label940?.questionId,
              responseId: radioFuneralValueTwoburied,
              userId: memberUserId,
            },
          ]
        : radioValue == 224
        ? [
            {
              userSubjectDataId: formlabelData.label905?.userSubjectDataId,
              subjectId: formlabelData.label905?.questionId,
              responseId: radioValue,
              userId: memberUserId,
            },
            {
              userSubjectDataId: formlabelData.label930?.userSubjectDataId
                ? formlabelData.label930?.userSubjectDataId
                : 0,
              subjectId: formlabelData.label930?.questionId,
              subResponseData: disposedOther,
              responseId: formlabelData.label930?.response[0].responseId,
            },
          ]
        : [];

    
        if( Veteanstatus && radioValue == 222){
          let NationalCemeterydata =  {
            userSubjectDataId: formlabelData.label908?.userSubjectDataId,
            subjectId: formlabelData.label908?.questionId,
            userId: memberUserId,
            responseId: radioNationalCemetery,
          }
          arrdata.push(NationalCemeterydata)
        }
            if (radioValueDisposed == 230) {
      let newdata = {
        userSubjectDataId: formlabelData.label931?.userSubjectDataId
          ? formlabelData.label931?.userSubjectDataId
          : 0,
        subjectId: formlabelData.label931?.questionId,
        subResponseData: ashesOther,
        responseId: formlabelData.label931?.response[0].responseId,
      };
      arrdata.push(newdata);
    }
    if (Helduntilseconddeath == 263) {
      let newdata = {
        userSubjectDataId: formlabelData.label932?.userSubjectDataId
          ? formlabelData.label932?.userSubjectDataId
          : 0,
        subjectId: formlabelData.label932?.questionId,
        subResponseData: holdashesOther,
        responseId: formlabelData.label932?.response[0].responseId,
      };
      let newdata2 = {
        userSubjectDataId: formlabelData.label929?.userSubjectDataId
          ? formlabelData.label929?.userSubjectDataId
          : 0,
        subjectId: formlabelData.label929.questionId,
        responseId: Helduntilseconddeath,
        userId: memberUserId,
      };

      arrdata.push(newdata);
      arrdata.push(newdata2);
    } else if (Helduntilseconddeath == 261 || Helduntilseconddeath == 262) {
      let newdata = {
        userSubjectDataId: formlabelData.label929?.userSubjectDataId
          ? formlabelData.label929?.userSubjectDataId
          : 0,
        subjectId: formlabelData.label929?.questionId,
        responseId: Helduntilseconddeath,
        userId: memberUserId,
      };

      arrdata.push(newdata);
    } else {
    }

    if(radioFuneralValueTwo == 225 && radioValue !== 223){
      if (radioFuneralValueTwo == 225) {
        konsole.log(contactnum?.length,"contactnum.length")
        let uplaodinfo = [
          {
            userSubjectDataId: formlabelData.label933?.userSubjectDataId
              ? formlabelData.label933?.userSubjectDataId
              : 0,
            subjectId: formlabelData.label933?.questionId,
            subResponseData: nameofcontact,
            responseId: formlabelData.label933?.response[0].responseId,
          },
          {
            userSubjectDataId: formlabelData.label934?.userSubjectDataId
              ? formlabelData.label934?.userSubjectDataId
              : 0,
            subjectId: formlabelData.label934?.questionId,
            subResponseData: nameoffuneral,
            responseId: formlabelData.label934?.response[0].responseId,
          },

          {
            userSubjectDataId: formlabelData.label935?.userSubjectDataId
              ? formlabelData.label935?.userSubjectDataId
              : 0,
            subjectId: formlabelData.label935?.questionId,
            subResponseData:(contactnum?.length == 10) ? contactnum : null,
            responseId: formlabelData.label935?.response[0].responseId,
          },
          {
            userSubjectDataId: formlabelData.label936?.userSubjectDataId
              ? formlabelData.label936?.userSubjectDataId
              : 0,
            subjectId: formlabelData.label936?.questionId,
            subResponseData: (Phonenum?.length == 10) ? Phonenum : null,
            responseId: formlabelData.label936?.response[0].responseId,
          },
          {
            userSubjectDataId: formlabelData.label937?.userSubjectDataId
              ? formlabelData.label937?.userSubjectDataId
              : 0,
            subjectId: formlabelData.label937?.questionId,
            subResponseData: address,
            responseId: formlabelData.label937?.response[0].responseId,
          },
          {
            userSubjectDataId: formlabelData.label938?.userSubjectDataId
              ? formlabelData.label938?.userSubjectDataId
              : 0,
            subjectId: formlabelData.label938?.questionId,
            subResponseData: errorMessage == true ? null : wesite,
            responseId: formlabelData.label938?.response[0].responseId,
          },
          {
            userSubjectDataId: formlabelData.label939?.userSubjectDataId
              ? formlabelData.label939?.userSubjectDataId
              : 0,
            subjectId: formlabelData.label939?.questionId,
            subResponseData:  (faxnum?.length == 10) ? faxnum : null,
            responseId: formlabelData.label939?.response[0].responseId,
          },
        ];

        arrdata.push(uplaodinfo);
      }
    }

  
  if(radioFuneralValueTwoburied == 274 && radioValue == 223 ){
      konsole.log(radioFuneralValueTwo,"radioFuneralValueTwo77878787")
      if (radioFuneralValueTwoburied == 274) {
        let uplaodinfo = [
          {
            userSubjectDataId: formlabelData.label941?.userSubjectDataId
              ? formlabelData.label941?.userSubjectDataId
              : 0,
            subjectId: formlabelData.label941?.questionId,
            subResponseData: nameofcontactburied,
            responseId: formlabelData.label941?.response[0].responseId,
          },
          {
            userSubjectDataId: formlabelData.label942?.userSubjectDataId
              ? formlabelData.label942?.userSubjectDataId
              : 0,
            subjectId: formlabelData.label942?.questionId,
            subResponseData: nameoffuneralburied,
            responseId: formlabelData.label942?.response[0].responseId,
          },

          {
            userSubjectDataId: formlabelData.label943?.userSubjectDataId
              ? formlabelData.label943?.userSubjectDataId
              : 0,
            subjectId: formlabelData.label943?.questionId,
            subResponseData:  (contactnumburied?.length == 10) ? contactnumburied : null,
            responseId: formlabelData.label943?.response[0].responseId,
          },
          {
            userSubjectDataId: formlabelData.label944?.userSubjectDataId
              ? formlabelData.label944?.userSubjectDataId
              : 0,
            subjectId: formlabelData.label944?.questionId,
            subResponseData:  (Phonenumburied?.length == 10) ? Phonenumburied : null,
            responseId: formlabelData.label944?.response[0].responseId,
          },
          {
            userSubjectDataId: formlabelData.label945?.userSubjectDataId
              ? formlabelData.label945?.userSubjectDataId
              : 0,
            subjectId: formlabelData.label945?.questionId,
            subResponseData: addressburied,
            responseId: formlabelData.label945?.response[0].responseId,
          },
          {
            userSubjectDataId: formlabelData.label946?.userSubjectDataId
              ? formlabelData.label946?.userSubjectDataId
              : 0,
            subjectId: formlabelData.label946?.questionId,
            subResponseData: errorMessage == true ? null : wesiteburied,
            responseId: formlabelData.label946?.response[0].responseId,
          },
          {
            userSubjectDataId: formlabelData.label947?.userSubjectDataId
              ? formlabelData.label947?.userSubjectDataId
              : 0,
            subjectId: formlabelData.label947?.questionId,
            subResponseData:  (faxnumburied?.length == 10) ? faxnumburied : null,
            responseId: formlabelData.label947?.response[0].responseId,
          },
        ];

        arrdata.push(uplaodinfo);
      }
    }
  // }

    let dataArr = arrdata.flat(1);
    const dataObj = {
      userId: memberUserId,
      userSubjects: dataArr,
    };
    if ((radioValue == 222 && radioFuneralValueTwo && radioValueDisposed)||(radioValue == 223 && radioFuneralValueTwoburied) || (radioValue == 224 && (disposedOther != null || disposedOther != ''))) {  
      let dataObj= {
        userId: memberUserId,
        userSubjects: dataArr,
      }
    if(errorMessage == true){ 
      toasterAlert("Url is not valid","Warning")
    }else{
      putaddusersubject(dataObj,1);
      if(sameForspouse){
        let dataArray = dataArr?.map((e)=>{return{...e,userId:spouseUserId}})
        let dataObj2 = {
          userId:spouseUserId,
          userSubjects:dataArray
        }
        putaddusersubject(dataObj2,1, true)
      }
    }
    } else {
      toasterAlert("Please enter all the questions correctly",'Warning')
  };
}
  const putaddusersubject = (dataObj,step, forSpouse) => {
    konsole.log(dataObj,"dataObj")
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi("PUT",$Service_Url.putusersubjectdata,dataObj,(res,error) => {
      props.dispatchloader(false)
    if(res){

      setStepperNo(stepperNo+step)
      if(forSpouse != true) AlertToaster.success("Data Saved Successfully","Success");
    }else if(error){
      if(error.status == 400){
      toasterAlert("Please select all the questions correctly",'Warning')
      return;
      }
      toasterAlert("Unable to process your request.","Warning")
    }
    getsubjectForFormLabelId(memberUserId)
    })

  };

  const postSubjectDatastep3 = () => {
    let inputArray = {
      userId: memberuserId,
      userSubjects: [
        {
          userSubjectDataId: formlabelData.label927?.userSubjectDataId
            ? formlabelData.label927?.userSubjectDataId
            : 0,
          subjectId: formlabelData.label927?.questionId,
          subResponseData: specialInsAns,
          responseId: formlabelData.label927?.response[0].responseId,
        },
        {
          userSubjectDataId: formlabelData.label997?.userSubjectDataId
          ? formlabelData.label997?.userSubjectDataId
          : 0,
        subjectId: formlabelData.label997.questionId,
        responseId: otherspecialinstrshow,
        userId: memberuserId,
        }
      ],
    };
    if(otherspecialinstrshow == null){
      toasterAlert("Please provide  an instruction to the agent.","Warning")
    }
    if(sameForspouse){
      let Arraydata = inputArray?.userSubjects?.map((e)=>{return{...e,userId:spouseUserId}})
      let inputArr2 = {
        userId: spouseUserId,
        userSubjects:Arraydata
      }
      putaddusersubject(inputArr2,1, true)
    }
    putaddusersubject(inputArray,1)
    konsole.log(otherspecialinstrshow,"otherspecialinstrshow")
  };

  const toasterAlert =(text,type)=>{
    setdata({open:true,text:text,type:type})
  }

  return (
    <>
    <CustomStepper setStepperNo={setStepperNo} stepperNo={stepperNo} /> 
    <div className='' style={{ paddingBottom: '2rem' }}>
      <div className="Question-Card-Div">
      {(stepperNo==0)?<>
        <div>
            <div>
              <div >
                {formlabelData.label905 && (
                  <>
                    <h5 className="mt-2">{formlabelData.label905.question}</h5>
                      {formlabelData.label905.response.map((answer, id) => {
                        return (
                                <Form.Check inline className="left-radio" type="radio"
                                name="decision"
                                value={answer?.responseId}
                                label={answer?.response}
                                onChange={(e) => onChange(e)}
                                checked={answer?.responseId == radioValue }
                                />
                        );
                      })}
                  </>
                )}
              </div>

              <div className={`${radioValue == 224 && "Hide-Div"}`}>
                <div className="mt-3">
                  {formlabelData.label905 && formlabelData.label906 && radioValue != 223 && (
                      <>
                        <h5 className="mt-2">{formlabelData.label906.question}</h5>
                          {formlabelData.label906.response.map(
                            (answer, index) => {
                              return (
                                <Form.Check inline className="left-radio" type="radio"
                                name="decision2"
                                value={answer?.responseId}
                                label={answer?.response}
                                onChange={(e) => onChangeFuneral(e)}
                                checked={answer?.responseId == radioFuneralValueTwo }
                                />
                              );
                            }
                          )}
                      </>
                    )}
                  {formlabelData.label905 && formlabelData.label940 && radioValue == 223 && (
                      <><h5 className="mt-2">{formlabelData.label940.question}</h5>
                          {formlabelData.label940.response.map(
                            (answer, index) => {
                              return (
                                <Form.Check inline className="left-radio" type="radio"
                                name="decision3"
                                value={answer?.responseId}
                                label={answer?.response}
                                onChange={(e) => onChangeFuneralburied(e)}
                                checked={answer?.responseId == radioFuneralValueTwoburied }
                                />
                              );
                            }
                          )}
                      </>
                    )}
                </div>
                <div className={`${
                    radioFuneralValueTwo == 225 && radioValue != 223
                      ? "Show-Div"
                      : "Hide-Div"
                  }`}
                >
                  <div className="mt-3">
                    <div>
                      <h5 className="mt-2">Mention the details</h5>
                      <Row className="mt-3">
                        <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                          <h5 className="mb-1">Name of Contact</h5>
                          <input
                          className="border rounded upperCasing"
                            type="text"
                            defaultValue={
                              formlabelData.label933?.response[0].response
                            }
                            placeholder="Name of Contact"
                            pattern="[a-zA-Z'-'\s]*"
                            value={nameofcontact}
                            onChange={(e) => {
                              const result = e.target.value.replace(
                                /[^a-zA-Z ]/gi,
                                ""
                              );
                              setnameofcontact(result);
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                          <h5 className="mb-1">Name of Funeral Home</h5>
                          <input
                            className="border rounded upperCasing"
                            placeholder="Name of Funeral Home"
                            defaultValue={
                              formlabelData.label934?.response[0].response
                            }
                            value={nameoffuneral}
                            onChange={(e) => {
                              const result = e.target.value.replace(
                                /[^a-zA-Z ]/gi,
                                ""
                              );
                              setnameoffuneral(result);
                            }}
                          />
                        </Col>
                      </Row>

                      <Row className="mt-2">
                        <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                          <h5 className="mb-1">Contact Number</h5>
                            <input
                            className="border rounded"
                              defaultValue={$AHelper.formatPhoneNumber(contactnum)}
                              onChange={onchangeContact}
                              value={$AHelper.formatPhoneNumber(contactnum)}
                              placeholder={"Contact Number"}
                              maxLength={14}
                            />
                        </Col>

                      </Row>
                      {(contactnum?.length > 0 && ($AHelper.formatPhoneNumber(contactnum)?.length  <= 10 || $AHelper.formatPhoneNumber(contactnum)?.length == null)) && <p style={{ color: "#d2222d" }}>Contact Number is not valid</p> }
                      <Row className="mt-2">
                        <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                          <h5 className="mb-1">Cell Number</h5>
                            <input
                            className="border rounded"
                              defaultValue={$AHelper.formatPhoneNumber(Phonenum)}
                              onChange={onchangePhone}
                              placeholder="Cell Number"
                              value={$AHelper.formatPhoneNumber(Phonenum)}
                              maxLength={14}
                            />

                        </Col>
                      </Row>
                      {(Phonenum?.length > 0 && ($AHelper.formatPhoneNumber(Phonenum)?.length <=10 || $AHelper.formatPhoneNumber(Phonenum)?.length == null)) && <p style={{ color: "#d2222d" }}>Cell Number is not valid</p> }
                      <Row className="mt-2">
                        <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                          <h5 className="mb-1">Address</h5>
                          <PlaceOfBirth placeholder={"Address"} addressDetails={onchangeaddress} addressData={address} />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                          <h5 className="mb-1">Website</h5>
                          <input
                            className="border rounded"
                            defaultValue={
                              formlabelData.label938?.response[0].response
                            }
                            type="url"
                            placeholder="https://example.com"
                            pattern="https://.*"
                            size="30"
                            required
                            value={wesite}
                            onChange={(e) => isUrlValid(e.target.value)}
                          />
                      {errorMessage == true && wesite?.length != 0 ? (
                        <p style={{ color: "#d2222d" }}>Url is not valid</p>
                      ) : null} 
                        </Col>
                      </Row>

                      <Row className="mt-2">
                        <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                          <h5 className="mb-1">Fax Number</h5>

                            <input
                            className="border rounded"
                              defaultValue={$AHelper.formatPhoneNumber(faxnum)}
                              onChange={onchangeFax}
                              placeholder={"Fax Number"}
                              value={$AHelper.formatPhoneNumber(faxnum)}
                              maxLength={14}
                            />

                        </Col>
                      </Row>
                      {(faxnum?.length > 0 && ($AHelper.formatPhoneNumber(faxnum)?.length <= 10 || $AHelper.formatPhoneNumber(faxnum)?.length == null)) && <p style={{ color: "#d2222d" }}>Fax Number is not valid</p> }
                    </div>
                  </div>
                </div>
                <div
                  className={`${
                    radioFuneralValueTwoburied == 274 && radioValue == 223
                      ? "Show-Div"
                      : "Hide-Div"
                  }`}
                >
                  <div className="mt-3">
                    <div>
                      <h5>Mention the details</h5>

                      <Row className="mt-3">
                        <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                          <h5 className="mb-1">Name of Contact</h5>

                          <input
                          className="border rounded"
                            type="text"
                            defaultValue={
                              formlabelData.label941?.response[0].response
                            }
                            placeholder="Name of Contact"
                            pattern="[a-zA-Z'-'\s]*"
                            value={$AHelper.capitalizeAllLetters(nameofcontactburied)}
                            onChange={(e) => {
                              const result = e.target.value.replace(
                                /[^a-zA-Z ]/gi,
                                ""
                              );
                              setnameofcontactburied(result);
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                          <h5 className="mb-1">Name of Funeral Home</h5>
                          <input
                          className="border rounded"
                            placeholder="Name of Funeral Home"
                            defaultValue={
                              formlabelData.label942?.response[0].response
                            }
                            value={nameoffuneralburied}
                            onChange={(e) => {
                              const result = e.target.value.replace(
                                /[^a-zA-Z ]/gi,
                                ""
                              );
                              setnameoffuneralburied(result);
                            }}
                          />
                        </Col>
                      </Row>

                      <Row className="mt-2">
                        <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                          <h5 className="mb-1">Contact Number</h5>
                           <input
                           className="border rounded"
                              value={$AHelper.formatPhoneNumber(contactnumburied)}
                              onChange={onchangeContactburied}
                              placeholder="Contact Number"
                              maxLength={14}
                            />
                        </Col>
                      </Row>
                      {(contactnumburied?.length > 0 && ($AHelper.formatPhoneNumber(contactnumburied)?.length <= 10 || $AHelper.formatPhoneNumber(contactnumburied)?.length == null)) && <p style={{ color: "#d2222d" }}>Contact Number is not valid</p> }
                      <Row className="mt-2">
                        <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                          <h5 className="mb-1">Cell Number</h5>

                            <input
                            className="border rounded"
                              value={$AHelper.formatPhoneNumber(Phonenumburied)}
                              onChange={onchangePhoneburied}
                              placeholder="Cell Number"
                              maxLength={14}
                              />
                        </Col>
                      </Row>
                      {(Phonenumburied?.length > 0 && ($AHelper.formatPhoneNumber(Phonenumburied)?.length <= 10 || $AHelper.formatPhoneNumber(Phonenumburied)?.length == null)) && <p style={{ color: "#d2222d" }}>Cell Number is not valid 1</p> }
                      <Row className="mt-2">
                        <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                          <h5 className="mb-1">Address</h5>
                          <PlaceOfBirth placeholder={"Address"} addressDetails={onchangeaddressburied} addressData={addressburied} />
                        </Col>
                      </Row>

                      <Row className="mt-2">
                        <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                          <h5 className="mb-1">Website</h5>
                          <input
                           className="border rounded"
                            defaultValue={
                              formlabelData.label946?.response[0].response
                            }
                            type="url"
                            placeholder="https://example.com"
                            pattern="https://.*"
                            size="30"
                            required
                            value={wesiteburied}
                            onChange={(e) => isUrlValidburied(e.target.value)}
                          />
                        </Col>
                       
                      </Row>
                      {errorMessage == true && wesiteburied?.length != 0 ? (
                        <p style={{ color: "#d2222d" }}>Url is not valid</p>
                      ) : null} 
                      <Row className="mt-2">
                        <Col xs={18} sm={18} md={18} lg={16} xl={9}>
                          <h5 className="mb-1">Fax Number</h5>
                          <input
                              className="border rounded"
                              value={$AHelper.formatPhoneNumber(faxnumburied)}
                              onChange={onchangeFaxburied}
                              placeholder="Fax Number"
                              maxLength={14}
                            />
                        </Col>
                      </Row>
                      {(faxnumburied?.length > 0 && ($AHelper.formatPhoneNumber(faxnumburied)?.length <= 10 || $AHelper.formatPhoneNumber(faxnumburied)?.length == null)) && <p style={{ color: "#d2222d" }}>Fax Number is not valid</p> }
                    </div>
                  </div>
                </div>
                <div
                  className={`${
                    radioValue == 222 || (radioValue == 224 && radioValue == 223)
                      ? "Show-Div"
                      : "Hide-Div"
                  } mt-3`}
                >
                  <div className="mt-3">
                    {formlabelData.label907 && (
                      <><h5>{formlabelData.label907.question}</h5>
                          {formlabelData.label907.response.map(
                            (answer, index) => {
                              return (
                                <Form.Check inline className="left-radio" type="radio"
                                name="decision4"
                                value={answer?.responseId}
                                label={answer?.response}
                                onChange={(e) => onChangeDisposed(e)}
                                checked={answer?.responseId == radioValueDisposed }
                                />
                              );
                            }
                          )}
                      </>
                    )}
                  </div>
                  <div
                    className={`${
                      radioValueDisposed == 224 ? "Show-Div" : "Hide-Div"
                    }`}
                  >
                    <div className="mt-3">
                      <input type="text" className="w-50 border rounded" />
                    </div>
                  </div>

                  <div
                    className={`${
                      radioValueDisposed == 230 ? "Show-Div" : "Hide-Div"
                    }`}
                  >
                    <div className="mt-3">
                      {formlabelData.label931 && (
                        <input
                        className="border rounded otherWidth"
                          type="text"
                          defaultValue={
                            formlabelData.label931?.response[0].response
                          }
                          value={ashesOther}
                          onChange={(e) => {
                            setAshesOther(e.target.value);
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div
                    className={`${
                      radioValueDisposed == 227 ? "Show-Div" : "Hide-Div"
                    }`}
                  >
                    <div className="mt-3">
                          {formlabelData.label929 && formlabelData.label929.response.map(
                            (answer, index) => {
                              return (
                                <Form.Check inline className="left-radio" type="radio"
                                name="decision5"
                                value={answer?.responseId}
                                label={answer?.response}
                                onChange={(e) => onChangeHelduntil(e)}
                                checked={answer?.responseId == Helduntilseconddeath }
                                />
                              );
                            }
                          )}
                    </div>
                  </div>
                  <div
                    className={`${
                      Helduntilseconddeath == 263 && radioValueDisposed == 227
                        ? "Show-Div"
                        : "Hide-Div"
                    }`}
                  >
                    <div className="mt-3">
                      {formlabelData.label932 && (
                        <input
                          type="text"
                          className="border rounded otherWidth"
                          defaultValue={
                            formlabelData.label932?.response[0].response
                          }
                          value={holdashesOther}
                          onChange={(e) => {
                            setHoldAshesOther(e.target.value);
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    {Veteanstatus && formlabelData.label908 && (
                      <>
                        <h5>{formlabelData.label908.question}</h5> 
                          {formlabelData.label908.response.map(
                            (answer, index) => {
                              return (
                                <Form.Check inline className="left-radio" type="radio"
                                name="decision6"
                                value={answer?.responseId}
                                label={answer?.response}
                                onChange={(e) => onChangeNationalCemetery(e)}
                                checked={answer?.responseId == radioNationalCemetery }
                                />
                              );
                            }
                          )}
                      </>
                    )}
                  </div>

                  <div
                    className={`${
                      radioNationalCemetery == 231 ? "Show-Div" : "Hide-Div"
                    } mt-2`}
                  >
                    <h5>Follwed Link</h5>
                    <div>
                      <a href="https://www.cem.va.gov/">
                        https://www.cem.va.gov
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  radioValue == 224 || (radioValue == 222 && radioValue == 223)
                    ? "Show-Div"
                    : "Hide-Div"
                } mt-3`}
              >
                {formlabelData.label930 && (
                  <input
                    type="text"
                    className="deathInput border rounded"
                    defaultValue={formlabelData.label930?.response[0].response}
                    value={disposedOther}
                    onChange={(e) => {
                      setDisposedOther(e.target.value);
                    }}
                  />
                )}
              </div>
            </div>
                    {
                    memberUserId != spouseUserId && spouseUserId != 'null' && showSpouseCheck && <div className='w-50 d-flex gap-2 mt-2'>
                    <input type='checkbox' style={{width:'20px'}} value={sameForspouse} onChange={(e)=>{setSameforspouse(e.target.checked)}}  />
                    <h5>Add same details for Spouse</h5>
                    </div>
                  }
            <div className="Sava-Button-Div">
              <button
                className="Save-Button"
                onClick={Submitbutton}
              >
                          Save & Proceed

              </button>
            </div>
          </div>
      </>:(stepperNo==1)?<>
        <NotifyStep  id={3} memberUserId={props?.memberId}  setStepperNo={setStepperNo} stepperNo={stepperNo} sameForspouse={sameForspouse} />
      </>:(stepperNo==2)?<>
        <UploadFile memberUserId={props?.memberId} />

          <Row>
                <Col>
                  {formlabelData.label997 && (
                    <div className="mt-2">
                      <h5>{formlabelData.label997.question}</h5>
                      
                          {formlabelData.label997.response.map(
                            (answer, index) => {
                              return (
                                <Form.Check inline className="left-radio" type="radio"
                                name="organizationCare"
                                value={answer?.responseId}
                                label={answer?.response}
                                onChange={(e) => onChangespecialinstrshow(e)}
                                checked={answer?.responseId == otherspecialinstrshow }
                                />
                              );
                            }
                          )}
                    </div>
                  )}
                </Col>
              </Row>
            {otherspecialinstrshow == 393 && <Row className="d-flex justify-content-center pt-2">
              <Col lg={23} className="textEditor-Col w-100">
                <div className="mb-2" style={{ border: "1px solid white" }}>
                  {formlabelData.label927 && (
                    <div className="mt-3">
                      <h5 className="mt-2" >{formlabelData.label927.question}</h5>
                      <Form.Control as="textarea"
                        rows={4}
                        placeholder="Please type something here"
                        className="border rounded mt-2 shadow"
                        defaultValue={formlabelData.label927?.response[0].response}
                        // value={specialInsAns}
                        onChange={(e) => {
                          setSpecialInsAns(e.target.value);
                        }}
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Row>}
            {
                    memberUserId != spouseUserId && spouseUserId != 'null' &&  showSpouseCheck2 && <div className='w-50 d-flex gap-2 mt-2'>
                    <input type='checkbox' style={{width:'20px'}} value={sameForspouse} onChange={(e)=>{setSameforspouse(e.target.checked)}}  />
                    <h5>Add same details for Spouse</h5>
                    </div>
                  }
            <div className="Sava-Button-Div d-flex flex-wrap justify-content-between mt-2">
              <button className="Save-Button mb-2"
                onClick={()=>setStepperNo(stepperNo-1)}
              >
                Back

              </button>
              <button className="Save-Button" onClick={postSubjectDatastep3}>
          Save & Proceed
                
              </button>
            </div>
      </>:(stepperNo==3)?<>
      <AgentguidanceCom memberUserId={props?.memberId} selectSelectedStepper={selectSelectedStepper} />
      </>:null}
      </div>
      </div>
      </>
  );
};


const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Death);