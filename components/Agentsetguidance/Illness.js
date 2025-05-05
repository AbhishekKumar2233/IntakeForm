import React from 'react'
import { useEffect, useState, useContext } from 'react';
import { illness } from '../control/Constant';
import { acountant } from '../control/Constant'
import { $CommonServiceFn } from '../network/Service';
import { $Service_Url } from '../network/UrlPath';
import konsole from '../control/Konsole';
import { $AHelper } from '../control/AHelper';
import { Row, Col, Form, Radio, TextArea } from 'react-bootstrap';
import NotifyStep from './NotifyStep';
import AgentguidanceCom from './AgentguidanceCom';
import UploadFile from "./UploadFile.js";
import Select from 'react-select'
import { connect } from 'react-redux';
import { SET_LOADER } from '../Store/Actions/action';
import { globalContext } from '../../pages/_app'
import AlertToaster from '../control/AlertToaster';
import CustomStepper from './CustomStepper';
import AddnewProfessmembermodal from './Addnewprofessionalmodal';
import ProfessSearch from '../professSearch';
import { demo } from '../control/Constant';
import NewProServiceProvider from '../NewProServiceProvider.js';


const Illness = (props) => {
  konsole.log('propsprops', props)
  let memberUserId = props.memberId
  const spouseUserId = sessionStorage.getItem('spouseUserId')

  const { setdata } = useContext(globalContext)
  const context = useContext(globalContext)


  const [stepperNo,setStepperNo]=useState(0)
  //define state--------------------------------------------------------------
  const [formlabelData, setFormLabelData] = useState({});
  const [selectedStep, setStepper] = useState(0);
  const [forthComponent, setforthComponent] = useState(false);
  const [professionalUser, setProfessionalUser] = useState([]);
  const [professionalUserELA, setProfessionalUserELA] = useState([]);
  const [organizationCare, setOranizationCare] = useState('');
  const [otherspecialins, setotherspecialins] = useState([])
  const [agentCareManager, setAgentCareManager] = useState([]);
  const [careManagerInMind, setCareManagerInMind] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState([]);
  const [compnayWorkWith, setCompanyWorkWith] = useState([]);
  const [specialInsAns, setSpecialInsAns] = useState();
  const [specialInsstep2, setSpecialInsstep2] = useState('');
  const [getselectedGCM, setGetselectedGCM] = useState([]);
  const [selectElderLawAttorney, setSelectElderLawAttorney] = useState([]);
  const [showaddprofessmodal, setshowaddprofessmodal] = useState(sessionStorage.getItem("openModalHash") ? true : false);
  const [professionaltype, setprofessionaltype] = useState(sessionStorage.getItem("openModal4SetGuidanceProType") || '');
  const [Addnewprofessmodaldata, setAddnewprofessmodaldata] = useState(null)
  const [proType, setproType] = useState("")
  const [SpecialInstructionillness, setSpecialInstructionillness] = useState("");
  const [sameForspouse,setSameforspouse] = useState(false);
  const [showSpouseCheck,setShowspouseCheck] = useState(true);
  const [showSpouseCheck2,setShowspouseCheck2] = useState(true)
  
konsole.log(sameForspouse,"sameForspouse")
  //predefine function---------------------------------
  useEffect(() => {
    konsole.log('getSubjectForFormLabelIda',props.memberId == '', props.memberId)
    sessionStorage.setItem("openModal4SetGuidanceProType", "");

    if(props?.memberId != ''){
    getSubjectForFormLabelId(props.memberId);
    getProfessionalByUser(props.memberId)
    setStepperNo(0)
    setProfessionalUser([])
    setGetselectedGCM([])
    setProfessionalUserELA([])
    setSelectElderLawAttorney([])
    setFormLabelData({})
    setCompanyWorkWith([])
    setCareManagerInMind([])
    setAgentCareManager([])
    setOranizationCare([])
    }
}, [props.memberId])
  useEffect(()=>{
    if(Addnewprofessmodaldata != null){
    putProfessionaluserpramas()
    }
  },[Addnewprofessmodaldata])

  //useEffect Functions----------------------------------------------------------------------------

  const getSubjectForFormLabelId = async (userId) => {
    const formlabelData = {};
    // illness.formLabelId.map((item, index) => {
    //   let data = [item?.id]
      props.dispatchloader(true)
      $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.getsubjectForFormLabelId, illness.formLabelId, (response) => {
        props.dispatchloader(false)
        if (response) {
          konsole.log('respojne', response)
          const resSubData = response.data.data;

          for (let resObj of resSubData) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = resObj.question;
            konsole.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', formlabelData[label].questionId)
            konsole.log("resObj.question", resObj.question);
            props.dispatchloader(true)
            $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getSubjectResponse +userId + `/0/0/${formlabelData[label].questionId}`, "", (response, err) => {
              props.dispatchloader(false)
              if (response) {
                konsole.log("getSubjectResponse", response);
                if (response.data.data.userSubjects.length !== 0) {
                  let responseData = response.data.data.userSubjects[0];
                  for (let i = 0; i < formlabelData[label].response.length; i++) {
                    if (formlabelData[label].response[i].responseId === responseData.responseId) {
                      const userSubjectDataId = responseData.userSubjectDataId;
                      const subjectId = formlabelData[label].questionId;
                      const responseId = responseData.responseId;

                      const obj = $AHelper.getSubjectData(subjectId, responseId, memberUserId, userSubjectDataId)
                      konsole.log("obj", obj);
                      formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                      konsole.log(responseData.responseNature, "responseData.responseNature")
                      if (responseData.responseNature == "Radio") {
                          // formlabelData[label].response[i]["checked"] = true;
                          if (responseData.responseId === 199 || responseData.responseId === 200) {
                            setOranizationCare(obj);
                            setShowspouseCheck(false)
                          } else if (responseData.responseId === 201 || responseData.responseId === 202) {
                            setAgentCareManager(obj);
                          } else if (responseData.responseId === 203 || responseData.responseId === 204) {
                            setCareManagerInMind(obj);
                          } else if (responseData.responseId === 205 || responseData.responseId === 206) {
                            setSpecialInstructions(obj);
                          } else if (responseData.responseId === 207 || responseData.responseId === 208) {
                            setCompanyWorkWith(obj);
                          } else if (responseData.responseId === 389 || responseData.responseId === 390) {
                            setotherspecialins(obj);
                            setShowspouseCheck2(false)
                          }
                        // break;
                        formlabelData[label]["userSubjectDataId"] =
                        responseData.userSubjectDataId;
                      }
                     else if(responseData.responseNature == 'Text'){
                          if (responseData.responseId == 258) {
                            setSpecialInsstep2(responseData.response);
                          } else if (responseData.responseId == 256) {
                            setSpecialInstructionillness(responseData.response);
                          }
                          konsole.log("responseData.responseresponseData.response", responseData)
                          formlabelData[label].response[i]["response"] = responseData.response;
                          formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                      }
                    }
                  }
                }
              } else {
                konsole.log('err');
              }
              konsole.log('formlabelDataformlabelDataformlabelData', formlabelData)
              setFormLabelData(formlabelData)
            })

          }
        } else {
        }
      })
    // })
  };



  const getProfessionalByUser = (userid) => {
    if(!userid) userid = props.memberId;
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSearchProfessional +'?MemberUserId='+ userid, "", (response, err) => {
      props.dispatchloader(false)
      if (response) {
        konsole.log('getProfessionalByUserIdres', response)
        let responseData = response?.data?.data;
        let selectedGCM = responseData?.filter((items) => {
          return items.proTypeId == 7 && items.lpoStatus == true;
        });
        konsole.log('selectedGCMa', selectedGCM)
        let valueInsert = selectedGCM.length > 0 ? [selectedGCM[0]] : []
        setGetselectedGCM(valueInsert);

        let filterdataELA = responseData?.filter((items) => {
          return items.proTypeId == 13;
        });
        setProfessionalUserELA(filterdataELA);

        let selectELA = filterdataELA?.filter((items) => {
          return items.lpoStatus == true;
        });
        let valueInsert2 = selectELA.length > 0 ? [selectELA[0]] : []

        setSelectElderLawAttorney(valueInsert2);

        let filterdata = responseData?.filter((items) => {
          return items.proTypeId == 7;
        });
        setProfessionalUser(filterdata);
      } else {
        konsole.log('getProfessionalByUserIdreserr', err)

      }
    }
    );
  };

  konsole.log('formlabelData.label894', formlabelData.label894)
  //formlabel meta data onchange----------------------------------------------------------
  const CheckValue = (e) => {
    konsole.log("metadata CheckValue", e.target.value);
    let responseObj = {
      userId: memberUserId,
      userSubjectDataId: 0,
      subjectId: 0,
      responseId: 0,
    };
    if (e.target.value == 199) {
      const formObj = formlabelData.label894;
      konsole.log("metadata res", formObj, responseObj);
      const answer = formObj.response.filter((a) => {
        return a.responseId == e.target.value;
      })[0];
      konsole.log('formObjformObjformObj', formObj)
      konsole.log("metadata", answer);
      responseObj.subjectId = formObj.questionId;
      responseObj.responseId = answer.responseId;
      responseObj.userSubjectDataId = formObj?.userSubjectDataId || 0;
      konsole.log("metadata responseObj", responseObj);
      setOranizationCare(responseObj);
    } else if (e.target.value == 200) {
      const formObj = formlabelData.label894;
      const answer = formObj.response.filter((a) => {
        return a.responseId == e.target.value;
      })[0];
      responseObj.subjectId = formObj.questionId;
      responseObj.responseId = answer.responseId;
      responseObj.userSubjectDataId = formObj.userSubjectDataId || 0;
      konsole.log("eventvalue", responseObj);
      konsole.log("metadata responseObj", responseObj);
      setOranizationCare(responseObj);
    }
  };

  const agentCareManagerValue = (e) => {
    konsole.log('agentCareManagerValue', e.target.value)
    let responseObj = {
      userId: memberUserId,
      userSubjectDataId: 0,
      subjectId: 0,
      responseId: 0,
    };
    if (e.target.value == 201) {
      const formObj = formlabelData.label895;
      konsole.log("formObj", formObj);
      const answer = formObj.response.filter((a) => {
        return a.responseId == e.target.value;
      })[0];
      responseObj.subjectId = formObj.questionId;
      responseObj.responseId = answer.responseId;
      responseObj.userSubjectDataId = formObj.userSubjectDataId || 0;
      konsole.log("eventvalue2", responseObj);
      konsole.log("metadata responseObj", responseObj);
      konsole.log("metadata formObj", formObj);
      setAgentCareManager(responseObj);
    } else if (e.target.value == 202) {
      const formObj = formlabelData.label895;
      const answer = formObj.response.filter((a) => {
        return a.responseId == e.target.value;
      })[0];
      responseObj.subjectId = formObj.questionId;
      responseObj.responseId = answer.responseId;
      responseObj.userSubjectDataId = formObj.userSubjectDataId || 0;
      konsole.log("eventvalue2", responseObj);
      konsole.log("metadata responseObj", responseObj);
      setAgentCareManager(responseObj);
    }
  };

  const careManagerInMindValue = (e) => {
    let responseObj = {
      userId: memberUserId,
      userSubjectDataId: 0,
      subjectId: 0,
      responseId: 0,
    };
    if (e.target.value == 203) {
      const formObj = formlabelData.label896;
      const answer = formObj.response.filter((a) => {
        return a.responseId == e.target.value;
      })[0];
      responseObj.subjectId = formObj.questionId;
      responseObj.responseId = answer.responseId;
      responseObj.userSubjectDataId = formObj.userSubjectDataId || 0;
      konsole.log("eventvalue", e.target);
      setCareManagerInMind(responseObj);
      getProfessionalByUser(props.memberId);
    } else if (e.target.value == 204) {
      const formObj = formlabelData.label896;
      const answer = formObj.response.filter((a) => {
        return a.responseId == e.target.value;
      })[0];
      responseObj.subjectId = formObj.questionId;
      responseObj.responseId = answer.responseId;
      responseObj.userSubjectDataId = formObj.userSubjectDataId || 0;
      konsole.log("eventvalue", e.target);
      setCareManagerInMind(responseObj);
    }
  };
  const specialInstructionsValue = (e) => {
    let responseObj = {
      userId: memberUserId,
      userSubjectDataId: 0,
      subjectId: 0,
      responseId: 0,
    };
    if (e.target.value == 205) {
      const formObj = formlabelData.label897;
      const answer = formObj.response.filter((a) => {
        return a.responseId == e.target.value;
      })[0];
      responseObj.subjectId = formObj.questionId;
      responseObj.responseId = answer.responseId;
      responseObj.userSubjectDataId = formObj.userSubjectDataId || 0;
      konsole.log("eventvalue", e.target);
      setSpecialInstructions(responseObj);
    } else if (e.target.value == 206) {
      const formObj = formlabelData.label897;
      const answer = formObj.response.filter((a) => {
        return a.responseId == e.target.value;
      })[0];
      responseObj.subjectId = formObj.questionId;
      responseObj.responseId = answer.responseId;
      responseObj.userSubjectDataId = formObj.userSubjectDataId || 0;
      konsole.log("eventvalue", e.target);
      setSpecialInstructions(responseObj);
    }
  };
  const compnayWorkWithValue = (e) => {
    let responseObj = {
      userId: memberUserId,
      userSubjectDataId: 0,
      subjectId: 0,
      responseId: 0,
    };
    if (e.target.value == 207) {
      const formObj = formlabelData.label898;
      const answer = formObj.response.filter((a) => {
        return a.responseId == e.target.value;
      })[0];
      responseObj.subjectId = formObj.questionId;
      responseObj.responseId = answer.responseId;
      responseObj.userSubjectDataId = formObj.userSubjectDataId || 0;
      konsole.log("eventvalue", e.target);
      setCompanyWorkWith(responseObj);
    } else if (e.target.value == 208) {
      const formObj = formlabelData.label898;
      const answer = formObj.response.filter((a) => {
        return a.responseId == e.target.value;
      })[0];
      responseObj.subjectId = formObj.questionId;
      responseObj.responseId = answer.responseId;
      responseObj.userSubjectDataId = formObj.userSubjectDataId || 0;
      konsole.log("eventvalue", e.target);
      setCompanyWorkWith(responseObj);
    }
  };
  const onChangeSelect = (item) => {
    konsole.log('item', item)
    setGetselectedGCM([item.value])
  };
  const onChangeSelectElderLowAttorney = (item) => {
    konsole.log('itemsetSelectElderLawAttorney', item)
    setSelectElderLawAttorney([item.value])
  };

  const CheckValuespecialinst = (e) => {
    konsole.log("metadata CheckValue", e.target.value);
    let responseObj = {
      userId: memberUserId,
      userSubjectDataId: 0,
      subjectId: 0,
      responseId: 0,
    };
    if (e.target.value == 389) {
      const formObj = formlabelData.label995;
      konsole.log("metadata res", formObj, responseObj);
      const answer = formObj.response.filter((a) => {
        return a.responseId == e.target.value;
      })[0];
      konsole.log("metadata", answer);
      responseObj.subjectId = formObj.questionId;
      responseObj.responseId = answer.responseId;
      responseObj.userSubjectDataId = formObj.userSubjectDataId || 0;
      konsole.log("metadata responseObj", responseObj);
      setotherspecialins(responseObj);
    } else if (e.target.value == 390) {
      const formObj = formlabelData.label995;
      const answer = formObj.response.filter((a) => {
        return a.responseId == e.target.value;
      })[0];
      responseObj.subjectId = formObj.questionId;
      responseObj.responseId = answer.responseId;
      responseObj.userSubjectDataId = formObj.userSubjectDataId || 0;
      konsole.log("eventvalue", responseObj);
      konsole.log("metadata responseObj", responseObj);
      setotherspecialins(responseObj);
    }
  };

  //post function call---------------------------------------------------


  const postSubjectData = () => {
    let inputArray = [];
    let specialInsst2 = {
      userSubjectDataId: formlabelData.label927?.userSubjectDataId ? formlabelData.label927?.userSubjectDataId : 0,
      subjectId: formlabelData.label927?.questionId,
      subResponseData: specialInsstep2,
      responseId: formlabelData.label927?.response[0].responseId,
    }

    konsole.log('specialInsst2', specialInsst2)

    if (organizationCare.responseId == 200) {
      konsole.log('organizationCareorganizationCare', organizationCare)
      inputArray.push(organizationCare);
    }
    if (organizationCare.responseId == 199 && agentCareManager.responseId == 201 && careManagerInMind.responseId == 203) {
      inputArray.push(organizationCare, agentCareManager, careManagerInMind);
      onClickSave();
    }
    if (organizationCare.responseId == 199 && agentCareManager.responseId == 202 && specialInstructions.responseId == 205 && formlabelData.label927.response[0].responseId == 258) {
      inputArray.push(organizationCare, agentCareManager, specialInstructions, specialInsst2);
      konsole.log("KONSOLE", inputArray);
    }
    if (organizationCare.responseId == 199 && agentCareManager.responseId == 202 && specialInstructions.responseId == 206) {
      inputArray.push(organizationCare, agentCareManager, specialInstructions);
    }
    if (organizationCare?.responseId == 199 && agentCareManager?.responseId == 201 && careManagerInMind?.responseId == 204 && (compnayWorkWith?.responseId == 207 || compnayWorkWith?.responseId == 208)) {
      inputArray.push(organizationCare, agentCareManager, careManagerInMind, compnayWorkWith);
    }
    if (!inputArray.length > 0) {
      toasterAlert("Please select all the questions correctly")
    } else {
      let inputArrayPrimary = {
        userId: memberUserId,
        userSubjects: inputArray,
      };

      postSubjectDataApi(inputArrayPrimary,1)
      if(sameForspouse && organizationCare.responseId){
       let newArray = inputArray.map((e)=>{return {...e,'userId' : spouseUserId}})

        let inputArrayspouse = {
          userId: spouseUserId,
          userSubjects: newArray,
        };
        postSubjectDataApi(inputArrayspouse,1, true)
      }
    }
  }
  const postSubjectDataApi = (inputArray,step, forSpouse) => {

    props.dispatchloader(true)
      $CommonServiceFn.InvokeCommonApi('PUT', $Service_Url.putSubjectResponse, inputArray, (res, err) => {
        props.dispatchloader(false)
        if (res) {
          konsole.log('putSubjectResponse', res)
          if(forSpouse != true) AlertToaster.success("Data saved successfully");
          setAgentCareManager([]);
          setCareManagerInMind([]);
          setCompanyWorkWith([]);
          getSubjectForFormLabelId(memberUserId);
          konsole.log("successful", res);
          setStepperNo(step)
          // selectSelectedStepper(2);
        } else {
          // props.dispatchloader(false)
          konsole.log('putSubjectResponse', err)

        }
      })
  }
  const onClickSave = () => {
    if (organizationCare?.responseId == 199 && agentCareManager?.responseId == 201 && careManagerInMind?.responseId == 203) {
      putProfessionaluserpramas(getselectedGCM,selectElderLawAttorney);
    }
  };
  
  const putProfessionaluserpramas = (getselectedgcm,selectElderLawattorney) => {
    // konsole.log("id", professionalUser[selectKey]);
    let stateUserId = JSON.parse(sessionStorage.getItem("stateObj")).userId;
    let loggeduserid = sessionStorage.getItem('loggedUserId')
    konsole.log('getselectedGCMgetselectedGCMgetselectedGCMgetselectedGCMgetselectedGCM22222222', getselectedgcm)

    let getselectedGCM = getselectedgcm ? getselectedgcm[0] : []
    // const dataObj = {
    //   userId: props.memberId,
    //   updatedBy: loggeduserid,
    //   professionalUser: {
    //     proTypeId: getselectedGCM?.proTypeId,
    //     proUserId: getselectedGCM?.proUserId,
    //     userProId: getselectedGCM?.userProId,
    //     lpoStatus: true,
    //   },
    // };
    const dataObj = [
       {
        "userProId": getselectedGCM?.userProId,
        "proUserId": getselectedGCM?.proUserId,
        "proCatId": getselectedGCM?.proCatId,
        "userId": props?.memberId,
        "lpoStatus": true,
        "upsertedBy": loggeduserid,
        "isActive": true,
      }
    ]
    let ElderLawAttorney = selectElderLawattorney ? selectElderLawattorney[0] : []
    let dataobjELA = [
      {
       "userProId": ElderLawAttorney?.userProId,
       "proUserId": ElderLawAttorney?.proUserId,
       "proCatId": ElderLawAttorney?.proCatId,
       "userId": props?.memberId,
       "lpoStatus": true,
       "isActive": true,
       "upsertedBy": loggeduserid
     }
   ]
    if (Addnewprofessmodaldata != null && selectElderLawattorney == undefined && getselectedgcm == undefined) {
      konsole.log("bsjhbsdb", Addnewprofessmodaldata);
      var dataaddprofessdata = Addnewprofessmodaldata?.proCategories?.map((e)=>{
        return    {
          "userProId": Addnewprofessmodaldata?.userProId,
          "proUserId": Addnewprofessmodaldata?.proUserId,
          "proCatId": e?.proCatId,
          "userId": Addnewprofessmodaldata?.createdBy,
          "lpoStatus": true,
          "isActive":true,
          "upsertedBy": loggeduserid
        }
      })

  }

    let dataObj1 = (Addnewprofessmodaldata != null && selectElderLawattorney == undefined && getselectedgcm == undefined) ? dataaddprofessdata : dataObj
    konsole.log(Addnewprofessmodaldata,dataObj1,props.memberId,sameForspouse,"Addnewprofessmodaldata")
    
    let dataObj2 = dataobjELA
    if(dataObj2[0]?.proUserId){
      postProfessionalApi(dataObj2,memberUserId)
    }
    if(dataObj1[0]?.proUserId){
      postProfessionalApi(dataObj1,memberUserId)
    }

    // if(sameForspouse){
    //   let dataObjSpouse = dataObj1.map((e)=>{return{...e,userId:spouseUserId}})
    //   let dataObjSpouse2 = dataObj2.map((e)=>{return{...e,userId:spouseUserId}})
    //   if(dataObjSpouse2[0]?.proUserId){
    //     postProfessionalApi(dataObjSpouse2,spouseUserId)
    //   }
    //   postProfessionalApi(dataObjSpouse,spouseUserId)
    // }

  }
const postProfessionalApi = (dataObj,userId) =>{

  props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postProfessionalUser, dataObj, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('updateprofessionluser', res)
        // getProfessionalByUser(props.memberId)
      } else {
        // props.dispatchloader(false)
        konsole.log('updateprofessionluser', err)
      }
      getProfessionalByUser(userId)
    })
}
  const postSubjectDatastep3 = () => {
    konsole.log(otherspecialins, "otherspecialins746464646")
    if (otherspecialins.length == 0) {
      toasterAlert("Please provide  an instruction to the agent.")
    }
    let inputArray = {
      userId: memberUserId,
      userSubjects: [{
        userSubjectDataId: formlabelData.label925?.userSubjectDataId ? formlabelData.label925?.userSubjectDataId : 0,
        subjectId: formlabelData.label925?.questionId,
        subResponseData: specialInsAns,
        responseId: formlabelData.label925?.response[0].responseId,
      },
      {
        userSubjectDataId: formlabelData.label995?.userSubjectDataId ? formlabelData.label995?.userSubjectDataId : 0,
        subjectId: formlabelData.label995?.questionId,
        userId: memberUserId,
        responseId: otherspecialins.responseId,
      }
      ],
    };
    if(sameForspouse){
    let inputArraySpouse = {
      userId: spouseUserId,
      userSubjects: [{
        userSubjectDataId: formlabelData.label925?.userSubjectDataId ? formlabelData.label925?.userSubjectDataId : 0,
        subjectId: formlabelData.label925?.questionId,
        subResponseData: specialInsAns,
        responseId: formlabelData.label925?.response[0].responseId,
      },
      {
        userSubjectDataId: formlabelData.label995?.userSubjectDataId ? formlabelData.label995?.userSubjectDataId : 0,
        subjectId: formlabelData.label995?.questionId,
        userId: spouseUserId,
        responseId: otherspecialins.responseId,
      }
      ],
    };
      postSubjectDataApi(inputArraySpouse,stepperNo+1, true)
    }
    
    postSubjectDataApi(inputArray,stepperNo+1)
};

  const addprofessfuncclick = (type) => {
    konsole.log(type, "typetypetypetypetype");

    if (type == "GCM") {
      setprofessionaltype(7);
    } else if (type == "ElderLawAttorney") {
      setprofessionaltype(13);
      setproType(type)
    }
    setshowaddprofessmodal(true);
  };
  //confirm  warning ---------------------------------------------------------------------
  function toasterAlert(text) {
    setdata({ open: true, text: text, type: "Warning" });
  }

  //konsole---------------------------------------------------------------------------
  konsole.log('formlabelData', formlabelData)
  konsole.log('getselectedGCM', getselectedGCM)
  konsole.log('professionalUser', professionalUser)
  konsole.log('organizationCarezzz', organizationCare)
  konsole.log('getselectedGCMgetselectedGCM', getselectedGCM)
  konsole.log('formlabelDatalabel894', formlabelData)
  konsole.log('specialInsstep2', specialInsstep2)

  return (
    <>
   {/* <AddnewProfessmembermodal showaddprofessmodal={showaddprofessmodal} setshowaddprofessmodal={setshowaddprofessmodal} professionaltype={professionaltype} memberUserId={props.memberId} setAddnewprofessmodaldata={setAddnewprofessmodaldata} /> */}
      {/* {showaddprofessmodal == true && 
      <ProfessSearch 
      pshow= {showaddprofessmodal} 
      setshowaddprofessmodal={setshowaddprofessmodal} 
      protypeTd={professionaltype} 
      memberUserId={props.memberId} 
      setAddnewprofessmodaldata={setAddnewprofessmodaldata} 
      showForm={2} 
      activeUser={props.activeUser}
      proType = {proType}/>} */}
      {showaddprofessmodal == true &&  
      <NewProServiceProvider 
        uniqueKey="illness"
        pshow= {showaddprofessmodal} 
        setshowaddprofessmodal={setshowaddprofessmodal} 
        hideFilters={true}
        proSerDescTd={professionaltype == 7 ? '1' : '4'} 
        protypeTd={professionaltype} 
        // memberUserId={props.memberId} 
        setAddnewprofessmodaldata={setAddnewprofessmodaldata} 
        showForm={2} 
        activeUser={props.activeUser}
        getProfessionalByUser={getProfessionalByUser}
        // proType = {proType}
        currentPath="setGuidance>health>illness"
      />}
      <CustomStepper setStepperNo={setStepperNo} stepperNo={stepperNo} /> 
      
      <div className='mb-4' style={{ paddingBottom: '2rem' }}>
        <div className='Question-Card-Div'>
          {(stepperNo == 0) ?
            <>
              <Form.Group as={Row} className="mb-3" >
                <Row className="flex-column">
                  <Col xs sm="12" lg="12" id="financialMoreInfo1">
                    <h5> {formlabelData.label894 && formlabelData.label894.question}{" "} </h5>
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center justify-content-start mt-1">
                        {formlabelData.label894 && formlabelData.label894?.response.map((item, index) => {
                          konsole.log('itemlabel894', item, organizationCare, organizationCare?.responseId, item.responseId == organizationCare?.responseId)
                          konsole.log('organizationCareaa',formlabelData.label894 , organizationCare?.responseId == item?.responseId, organizationCare?.responseId, item?.responseId)
                          return (
                            <>
                              <Form.Check inline className="left-radio" type="radio"
                                name="decision"
                                value={item?.responseId}
                                label={item?.response}
                                onChange={(e) => CheckValue(e)}
                                checked={organizationCare?.responseId == item?.responseId}
                              // checked={true}
                              />
                            </>
                          )
                        })}
                      </div>
                    </div>
                  </Col>
                </Row>
                {organizationCare?.responseId == 199 && formlabelData.label895 && (
                  <Row className="flex-column">
                    <Col xs sm="12" lg="12" id="label895">
                      <h5> {formlabelData.label894 && formlabelData.label895.question}{" "} </h5>
                      <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <div className="d-flex align-items-center justify-content-start mt-1">
                          {formlabelData.label895 && formlabelData.label895?.response.map((item, index) => {
                            konsole.log('agentCareManageragentCareManager', item, agentCareManager)
                            return (
                              <>
                                <Form.Check inline
                                  className="left-radio"
                                  type="radio"
                                  value={item.responseId}
                                  name="label895" label={item.response}
                                  onChange={(e) => agentCareManagerValue(e)}
                                  checked={item.responseId == agentCareManager?.responseId}
                                />
                              </>
                            )
                          })}
                        </div>
                      </div>
                    </Col>
                  </Row>)}

                {(organizationCare?.responseId == 199 && agentCareManager?.responseId == 201) ?
                  <>
                    {formlabelData.label896 && (
                      <Row className="flex-column">
                        <Col xs sm="12" lg="12" id="label896">
                          <h5> {formlabelData.label896 && formlabelData.label896.question}{" "} </h5>
                          <div className="d-flex align-items-center justify-content-between flex-wrap">
                            <div className="d-flex align-items-center justify-content-start mt-1">
                              {formlabelData.label896 && formlabelData.label896?.response.map((item, index) => {
                                return (
                                  <>
                                    <Form.Check inline className="left-radio" type="radio" value={item.responseId} name="label896" label={item.response}
                                      onChange={(e) => careManagerInMindValue(e)}
                                      checked={item.responseId == careManagerInMind.responseId}
                                    />
                                  </>
                                )
                              })}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    )}
                  </>

                  : (organizationCare?.responseId == 199 && agentCareManager?.responseId == 202) ? <>
                    {
                      formlabelData.label897 && (
                        <Row className="flex-column">
                          <Col xs sm="12" lg="12" id="label895">
                            <h5> {formlabelData.label897 && formlabelData.label897.question}{" "} </h5>
                            <div className="d-flex align-items-center justify-content-between flex-wrap">
                              <div className="d-flex align-items-center justify-content-start mt-1">
                                {formlabelData.label897 && formlabelData.label897?.response.map((item, index) => {
                                  return (
                                    <>
                                      <Form.Check inline className="left-radio" type="radio" value={item.responseId} name="label897" label={item.response}
                                        onChange={(e) => specialInstructionsValue(e)}
                                        checked={item.responseId == specialInstructions.responseId}
                                      // defaultChecked={response.checked}
                                      />
                                    </>
                                  )
                                })}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      )
                    }
                  </>
                    : null}

                {(organizationCare?.responseId === 199 && agentCareManager?.responseId === 201 && careManagerInMind?.responseId === 203) ? (
                  <>
                    <div className='mt-2'>
                      <h5>Care Manager</h5>
                      <div className='d-flex'>
                        <div className='mt-2'>
                          <Select
                            options={professionalUser?.map((data, index) => ({
                              value: data,
                              label: 
                              // `${ data.fName} ${data.mName ? data.mName + ' ' : ''}${data.lName}`
                              `${$AHelper.capitalizeAllLetters(data.fName)} ${$AHelper.capitalizeAllLetters(data.mName) ? data.mName + ' ' : ''}${$AHelper.capitalizeAllLetters(data.lName)}`,
                              index: index
                            }))}
                            value={(getselectedGCM.length > 0) ? {
                              value: getselectedGCM[0],
                              label: `${$AHelper.capitalizeAllLetters(getselectedGCM[0].fName)} ${$AHelper.capitalizeAllLetters(getselectedGCM[0].mName) ? getselectedGCM[0].mName + ' ' : ''}${$AHelper.capitalizeAllLetters(getselectedGCM[0].lName)}`
                            } : { value: '-1', label: 'Select a person' }}
                            onChange={(e) => onChangeSelect(e)}
                            className='guidance-Select'
                          />
                        </div>
                        <button className="addnewproffbtn" onClick={()=>addprofessfuncclick('GCM')}> + </button>
                      </div>

                    </div>
                    <div className='mt-2'>
                      <h5>Elder Law Attorney</h5>
                      <div className='d-flex'>
                        <div className='mt-2'>
                          <Select
                            options={professionalUserELA?.map((data, index) => ({
                              value: data,
                              label: 
                              // `${data.fName} ${data.mName ? data.mName + ' ' : ''}${data.lName}`
                              `${$AHelper.capitalizeAllLetters(data.fName)} ${$AHelper.capitalizeAllLetters(data.mName) ? data.mName + ' ' : ''}${$AHelper.capitalizeAllLetters(data.lName)}`,
                              index: index
                            }))}
                            onChange={(e) => onChangeSelectElderLowAttorney(e)}
                            className='guidance-Select '
                            value={(selectElderLawAttorney?.length > 0) ? {
                              value: selectElderLawAttorney[0],
                              label: `${$AHelper.capitalizeAllLetters(selectElderLawAttorney[0]?.fName)} ${$AHelper.capitalizeAllLetters(selectElderLawAttorney[0]?.mName) ? selectElderLawAttorney[0]?.mName + ' ' : ''}${$AHelper.capitalizeAllLetters(selectElderLawAttorney[0]?.lName)}`
                            } : { value: '-1', label: 'Select a person' }}
                          />
                        </div>
                        <button className="addnewproffbtn" onClick={()=>addprofessfuncclick('ElderLawAttorney')} > + </button>
                      </div>

                    </div>
                  </>
                ) : (organizationCare?.responseId == 199 && agentCareManager?.responseId == 201 && careManagerInMind?.responseId == 204) ? <>
                  {formlabelData?.label898 && (
                    <Row className="flex-column">
                      <Col xs sm="12" lg="12" id="label898">
                        <h5> {formlabelData.label896 && formlabelData.label898.question}{" "} </h5>
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                          <div className="d-flex align-items-center justify-content-start mt-1">
                            {formlabelData.label896 && formlabelData.label898?.response.map((item, index) => {
                              return (
                                <>
                                  <Form.Check inline className="left-radio" type="radio" value={item.responseId} name="label898" label={item.response}
                                    onChange={(e) => compnayWorkWithValue(e)}
                                    checked={item.responseId == compnayWorkWith.responseId}
                                  />
                                </>
                              )
                            })}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  )}
                </> : null}


                {organizationCare?.responseId == 199 &&
                  agentCareManager.responseId == 202 &&
                  specialInstructions?.responseId == 205 ? (
                  <Row className="flex-column mt-4">
                    <Col xs sm="12" lg="12" id="label895">
                      <h5>Special instructions</h5>
                      <Form.Control as="textarea" className='mt-2'
                        defaultValue={formlabelData.label927?.response[0].response}
                        value={specialInsstep2}
                        onChange={(e) => setSpecialInsstep2(e.target.value)}
                        rows={3} />
                    </Col>
                  </Row>
                ) : forthComponent ? (
                  <div></div>
                ) : (
                  ""
                )}

                {organizationCare?.responseId == 199 && agentCareManager?.responseId == 201 && careManagerInMind?.responseId == 204 && compnayWorkWith?.responseId == 207 ? (
                  <div className="mt-3">
                    <h5>Find an Expert</h5>
                    {demo == true  ? (
                  <a href="https://aoorguat.agingoptions.com/" target="_blank" style={{ color: 'blue' }}>
                   https://aoorguat.agingoptions.com/
                 </a>
                 ) : (
                 <a href="https://resourceguide.agingoptions.com/" target="_blank" style={{ color: 'blue' }}>
                 https://resourceguide.agingoptions.com/
                     </a>
                     )}
                  </div>
                ) : (
                  ""
                )}
              </Form.Group>{konsole.log(spouseUserId,"spouseUserId")}
              {
                    memberUserId != spouseUserId && spouseUserId != 'null' && showSpouseCheck && <div className='w-50 d-flex gap-2'>
                    <input type='checkbox' style={{width:'20px'}} value={sameForspouse} onChange={(e)=>{setSameforspouse(e.target.checked)}}  />
                    <h5>Add same details for Spouse</h5>
                    </div>
                  }
              <div className="Sava-Button-Div">
                <button className="Save-Button"
                  onClick={()=>postSubjectData()}
                >  Save & Proceed</button>
              </div>
            </> : (stepperNo == 1) ? <>
              <NotifyStep id={1} memberUserId={props.memberId}  setStepperNo={setStepperNo} stepperNo={stepperNo} sameForspouse={sameForspouse} />
            </> : (stepperNo == 2) ? <>
              <Row className="flex-column">
                <Col xs sm="12" lg="12" id="financialMoreInfo1">
                  <UploadFile memberUserId={props?.memberId} />
                </Col>


                <Row className="flex-column mt-4">
                  <Col xs sm="12" lg="12" id="financialMoreInfo1">
                    <div>
                      <h5> {formlabelData.label995 && formlabelData.label995.question}{" "} </h5>
                      <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <div className="d-flex align-items-center justify-content-start mt-1">
                          {formlabelData.label995 && formlabelData.label995?.response.map((item, index) => {
                            return (
                              <>
                                <Form.Check inline className="left-radio" type="radio"
                                  value={item.responseId}
                                  name="label995"
                                  checked={item.responseId == otherspecialins.responseId}
                                  label={item.response}
                                  onChange={(e) => CheckValuespecialinst(e)}
                                />
                              </>
                            )
                          })}
                        </div>
                      </div>

                    </div>

                  </Col>
                  {otherspecialins?.responseId == 389 &&
                    <Col className='textEditor-Col mt-2' style={{ width: '100%' }}>
                      <div className='mt-2'>
                        <h5>{formlabelData.label925?.question}</h5>
                        <Form.Control as="textarea" className='mt-2 shadow'
                          placeholder="Please type something here"
                          defaultValue={formlabelData.label925?.response[0].response}
                          // value={specialInsAns}
                          onChange={(e) => setSpecialInsAns(e.target.value)}
                          rows={4} />
                      </div>
                    </Col>}
                    {
                    memberUserId != spouseUserId && spouseUserId != 'null' && showSpouseCheck2 && <div className='w-50 d-flex gap-2 mt-2'>
                    <input type='checkbox' style={{width:'20px'}} value={sameForspouse} onChange={(e)=>{setSameforspouse(e.target.checked)}}  />
                    <h5>Add same details for Spouse</h5>
                    </div>
                  }
                </Row>
              </Row>
              <div className="Sava-Button-Div  d-flex flex-wrap justify-content-between">
                <button className="Save-Button mb-2"
               onClick={()=>setStepperNo(stepperNo-1)}
                > Back </button>
                <button className="Save-Button"
                  onClick={()=>postSubjectDatastep3()}
                >
                  Save & Proceed
                </button>
              </div>
            </> : (stepperNo=3) ?
                <AgentguidanceCom memberUserId={props?.memberId}  setStepperNo={setStepperNo} stepperNo={stepperNo}/>
                : null}


        </div>
      </div>
    </>
  )
}


const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Illness);