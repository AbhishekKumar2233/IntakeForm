import React, { useState, useEffect,useContext } from "react";
import {Row,Col,Form,Radio} from 'react-bootstrap';
import { $CommonServiceFn, $getServiceFn } from "../network/Service";
import konsole from "../control/Konsole";
import { endOfLife } from "../control/Constant";
import { $Service_Url } from "../network/UrlPath";
import AgentguidanceCom from "./AgentguidanceCom";
import UploadFile from "./UploadFile";
import { globalContext } from "../../pages/_app";
import { SET_LOADER } from "../Store/Actions/action";
import { connect } from "react-redux";
import AlertToaster from "../control/AlertToaster";
import  CustomStepper from './CustomStepper.js'
import NotifyStep from "./NotifyStep";


const Endoflife = (props) => {
  const spouseUserId = sessionStorage.getItem('spouseUserId')
  const [dataUserId, setDatamemberUserId] = useState(props.memberId);
  const [dataResponseId, setDataResponseId] = useState("");

  
  const { setdata } = useContext(globalContext)
  let memberUserId = props.memberId
  konsole.log('memberUserIdmemberUserIdmemberUserId',memberUserId)

  const[stepperNo,setStepperNo]=useState(0)

  const [formlabelData, setFormLabelData] = useState({});
  const [selectedStep, selectSelectedStepper] = useState(1);
  const [changeBorder, setChangeBorder] = useState(1);
  const [crp, setCrp] = useState(null);
  const [hydration, setHydration] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [sideConditions, setSideConditions] = useState(null);
  const [heroicMeasure, setHeroicMeasure] = useState(null);
  const [artificialAdministration, setArtificialAdministration] = useState(null);
  const [firstQuestionId, setFirstQuestionId] = useState("");
  const [specialInsAns, setSpecialInsAns] = useState();
  const [plzSpecify, setPlzSpecify] = useState('');
  const[specialInstructions,setSpecialInstructions] = useState('')
  const [CRPQuestionDetails, setCRPQuestionDetails] = useState({CRPQuestionId: "",CRPAnswerId: ""});
  const [artificially, setArtificially] = useState({artificiallyQuestionId: "",artificiallyAnswerId: ""});
  const [Cardiopulmnatory, setCardiopulmnatory] = useState({CardiopulmnatoryQuestionId: "",CardiopulmnatoryAnswerId: ""});
  const [Antibiotic, setAntibiotic] = useState({AntibioticQuestionId: "",AntibioticAnswerId: ""});
  const [heroic, setHeroic] = useState({heroicQuestionId: "",heroicAnswerId: ""});
  const [heroicAgent, setHeroicAgent] = useState({heroicAgentQuestionId: "",heroicAgentAnswerId: ""});
  const [sameForspouse,setSameforspouse] = useState(false);
  const [showSpouseCheck,setShowspouseCheck] = useState(true);
  const [showSpouseCheck2,setShowspouseCheck2] = useState(true)



  useEffect(() => {
    selectSelectedStepper(1)
    // let memberUserId = JSON.parse(
    //   sessionStorage.getItem("userPrimaryInDetail")
    // ).memberUserId;
    let memberUserId = props.memberId
    getsubjectForFormLabelId(memberUserId);
    setDatamemberUserId(memberUserId);
    setPlzSpecify(); 
    setHeroicAgent({
      heroicAgentQuestionId: "",
      heroicAgentAnswerId: "",
    });
    setHeroic({
      heroicQuestionId: "",
      heroicAnswerId:"",
    });
    setAntibiotic({
      AntibioticQuestionId: "",
      AntibioticAnswerId: "",
    });
    setCardiopulmnatory({
      CardiopulmnatoryQuestionId:
        "",
      CardiopulmnatoryAnswerId: "",
    });
    setArtificially({
      artificiallyQuestionId:
        "",
      artificiallyAnswerId: "",
    });
    setCRPQuestionDetails({
      CRPQuestionId: "",
      CRPAnswerId: "",
    });
    setArtificialAdministration();
    setSpecialInsAns('')
    setStepperNo(0)
  }, [props.memberId]);

//  console.log("kjh8778iu",heroicAgent)
  const selectedStepper = (step) => {
    selectSelectedStepper(step);
  };

  const getsubjectForFormLabelId = (userId) => {
    // setLoader(true)
    let formlabelData = {};
    props.dispatchloader(true)
    // endOfLife.formLabelId.map((id, index) => {
    //   let data = [id.id];
      props.dispatchloader(true)
      $CommonServiceFn.InvokeCommonApi('POST',$Service_Url.getsubjectForFormLabelId, endOfLife.formLabelId, (response) => {
        props.dispatchloader(false)
        if (response) {
          const resSubData = response.data.data;

          for (let resObj of resSubData) {
            let label = "label" + resObj.formLabelId;
            konsole.log("label", label);
            formlabelData[label] = resObj.question;
            props.dispatchloader(true)
            $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getSubjectResponse +userId + `/0/0/${formlabelData[label].questionId}`, "", (response, err) => {
              props.dispatchloader(false)
              if (response) {
                setHydration(response?.data?.data?.userSubjects[0]?.responseId);
            
                konsole.log("EndofLifeRes", response.data.data);
                let getResponseId = response.data.data.userSubjects[0];
                if (response.data.data.userSubjects.length !== 0) {
                  let responseData = response.data.data.userSubjects[0];
                  for (
                    let i = 0;
                    i < formlabelData[label].response.length;
                    i++
                  ) {
                    konsole.log("datashownatcaregiver at", i, responseData);
                    if (
                      formlabelData[label].response[i].responseId ===
                      responseData.responseId
                    ) {
                      if (formlabelData[label].questionId == 102) {
                        setArtificialAdministration(responseData.responseId);
                        setFirstQuestionId(formlabelData[label].questionId);
                        setShowspouseCheck(false)
                      }
                      if (formlabelData[label].questionId == 103) {
                        setCRPQuestionDetails({
                          CRPQuestionId: formlabelData[label].questionId,
                          CRPAnswerId: responseData.responseId,
                        });
                      }
                      if (formlabelData[label].questionId == 104) {
                        setArtificially({
                          artificiallyQuestionId:
                            formlabelData[label].questionId,
                          artificiallyAnswerId: responseData.responseId,
                        });
                      }
                      if (formlabelData[label].questionId == 105) {
                        setCardiopulmnatory({
                          CardiopulmnatoryQuestionId:
                            formlabelData[label].questionId,
                          CardiopulmnatoryAnswerId: responseData.responseId,
                        });
                      }
                      if (formlabelData[label].questionId == 106) {
                        setAntibiotic({
                          AntibioticQuestionId: formlabelData[label].questionId,
                          AntibioticAnswerId: responseData.responseId,
                        });
                      }
                      if (formlabelData[label].questionId == 107) {
                        setHeroic({
                          heroicQuestionId: formlabelData[label].questionId,
                          heroicAnswerId: responseData.responseId,
                        });
                      }
                      if (formlabelData[label].questionId == 200) {
                     
                        setHeroicAgent({
                          heroicAgentQuestionId: formlabelData[label].questionId,
                          heroicAgentAnswerId: responseData.responseId,
                        });
                        setShowspouseCheck2(false)
                      }
                      if (responseData.responseNature == "Radio") {
                        formlabelData[label].response[i]["checked"] = true;
                        formlabelData[label]["userSubjectDataId"] =
                          responseData.userSubjectDataId;
                      } else if (responseData.responseNature == "Text") {
                        if (responseData.responseId == 260) {
                          setPlzSpecify( responseData.response);
                        }
                        if(responseData.responseId == 257){
                          setSpecialInstructions(responseData.response)
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
            });
            setFormLabelData(formlabelData);
          }
        }
      });
    // });
  };

  const onChange = (event) => {
    const eventName = event.target.name;
    const eventValue = event.target.value;
    konsole.log("eventValue", eventValue, formlabelData.label899.questionId);
    setArtificialAdministration(eventValue);
    setFirstQuestionId(formlabelData.label899.questionId);
  };

  // const ApiRadioData = (e)=>{
  //     konsole.log("ApiRadioData",e.target)
  // }

  const secondQuestion = (e) => {
    let questionName = e.target.name;
    if (questionName == "SecondQuestion") {
      konsole.log("ClickValue", e.target.value);
      setCRPQuestionDetails({
        CRPQuestionId: formlabelData.label900.questionId,
        CRPAnswerId: e.target.value,
      });
    } else if (questionName == "ThirdQuestion") {
      konsole.log("ClickValue", e.target.value);
      setArtificially({
        artificiallyQuestionId: formlabelData.label901.questionId,
        artificiallyAnswerId: e.target.value,
      });
    } else if (questionName == "FourthQuestion") {
      konsole.log("ClickValue", e.target.value);
      setCardiopulmnatory({
        CardiopulmnatoryQuestionId: formlabelData.label902.questionId,
        CardiopulmnatoryAnswerId: e.target.value,
      });
    } else if (questionName == "FifthQuestion") {
      konsole.log("ClickValue", e.target.value);
      setAntibiotic({
        AntibioticQuestionId: formlabelData.label903.questionId,
        AntibioticAnswerId: e.target.value,
      });
    } else if (questionName == "SixQuestion") {
      konsole.log("ClickValue", e.target.value);
      setHeroic({
        heroicQuestionId: formlabelData.label904.questionId,
        heroicAnswerId: e.target.value,
      });
    }else if (questionName == "SevenQuestion") {
      konsole.log("ClickValue", e.target.value);
      setHeroicAgent({
        heroicAgentQuestionId: formlabelData.label996.questionId,
        heroicAgentAnswerId: e.target.value,
      });
    }
  };

  const PostQuestionData = () => {
    konsole.log(
      "artificialAdministration",
      artificialAdministration,
      CRPQuestionDetails.CRPAnswerId,
      artificially.artificiallyAnswerId,
      Cardiopulmnatory.CardiopulmnatoryAnswerId,
      Antibiotic.AntibioticAnswerId,
      heroic.heroicAnswerId
    );

    konsole.log(
      "questionId",
      firstQuestionId,
      CRPQuestionDetails.CRPQuestionId,
      artificially.artificiallyQuestionId,
      Cardiopulmnatory.CardiopulmnatoryQuestionId,
      Antibiotic.AntibioticQuestionId,
      heroic.heroicQuestionId
    );

    let addArray =
      artificialAdministration !== 211
        ? artificialAdministration ? [
            {
              subjectId: firstQuestionId,
              userSubjectDataId: formlabelData.label899?.userSubjectDataId,
              responseId: artificialAdministration,
            },
            
          ] : []
        : [
            {
              subjectId: firstQuestionId,
              userSubjectDataId: formlabelData.label899?.userSubjectDataId,
              responseId: artificialAdministration,
            },
            {
              subjectId: CRPQuestionDetails.CRPQuestionId,
              userSubjectDataId: formlabelData.label900?.userSubjectDataId ?  formlabelData.label900?.userSubjectDataId : 0,
              responseId: CRPQuestionDetails.CRPAnswerId,
            },
            {
              subjectId: artificially.artificiallyQuestionId,
              userSubjectDataId: formlabelData.label901?.userSubjectDataId ? formlabelData.label901?.userSubjectDataId : 0,
              responseId: artificially.artificiallyAnswerId,
            },
            {
              subjectId: Cardiopulmnatory.CardiopulmnatoryQuestionId,
              userSubjectDataId: formlabelData.label902?.userSubjectDataId ? formlabelData.label902?.userSubjectDataId : 0,
              responseId: Cardiopulmnatory.CardiopulmnatoryAnswerId,
            },
            {
              subjectId: Antibiotic.AntibioticQuestionId,
              userSubjectDataId: formlabelData.label903?.userSubjectDataId ? formlabelData.label903?.userSubjectDataId : 0,
              responseId: Antibiotic.AntibioticAnswerId,
            },
            {
              subjectId: heroic.heroicQuestionId,
              userSubjectDataId: formlabelData.label904?.userSubjectDataId ?  formlabelData.label904?.userSubjectDataId : 0,
              responseId: heroic.heroicAnswerId,
            },
            {
              userSubjectDataId: formlabelData.label928?.userSubjectDataId ? formlabelData.label928?.userSubjectDataId : 0,
              subjectId: formlabelData.label928?.questionId,
              subResponseData: plzSpecify,
              responseId: formlabelData.label928?.response[0].responseId,
            },
          ];

    let putApi = {
      userId: memberUserId,
      userSubjects: addArray,
    };
    if (addArray.length < 1) {
      toasterAlert("Please select all the questions correctly",'Warning')
      return;
    } else {
      let putApi = {
        userId: memberUserId,
        userSubjects: addArray,
      }
    }
    if(sameForspouse){
      let addSpouseArray = addArray?.map((e)=>{return {...e,userId:spouseUserId}})
      let putApispouse = {
        userId: spouseUserId,
        userSubjects: addSpouseArray
      }
      postSubjectdataApi(putApispouse,1, true)
    }
    postSubjectdataApi(putApi,1)
  };

  const postSubjectdataApi = (putApi,step, forSpouse) =>{
    props.dispatchloader(true)
  $CommonServiceFn.InvokeCommonApi("PUT",$Service_Url.putusersubjectdata,putApi,((response,error)=>{
    props.dispatchloader(false)
    if(response){
      konsole.log(response,"response")
      if(forSpouse != true) AlertToaster.success("Data saved successfully","Success")
      setStepperNo(stepperNo+step)
    }else{
      konsole.log(error,"error")
    }
  }))
  getsubjectForFormLabelId(memberUserId);
  }

  const postSubjectDatastep3 = () => {
   
    let inputArray = {
      userId: dataUserId,
      userSubjects: [
        {
          userSubjectDataId: formlabelData.label926?.userSubjectDataId
            ? formlabelData.label926?.userSubjectDataId
            : 0,
          subjectId: formlabelData.label926?.questionId,
          subResponseData: specialInsAns,
          responseId: formlabelData.label926?.response[0].responseId,
        },
        {
         
      userSubjectDataId: formlabelData.label996?.userSubjectDataId
        ? formlabelData.label996?.userSubjectDataId
        : 0,
      subjectId: formlabelData.label996?.questionId,
      userId: memberUserId,
      responseId: heroicAgent?.heroicAgentAnswerId,
    
          
        },
      ],
    };
    konsole.log(heroicAgent,"heroicAgent")

    if(heroicAgent?.heroicAgentAnswerId == ""){
      toasterAlert("Please provide  an instruction to the agent.","Warning")
    }
    if(sameForspouse){
      let userSubjectdata = inputArray?.userSubjects?.map((e)=>{return{...e,userId:spouseUserId}})
      let inputArraySpouse ={
        userId:spouseUserId,
        userSubjects:userSubjectdata
      }
      postSubjectdataApi(inputArraySpouse,1, true)
    }
    postSubjectdataApi(inputArray,1)
  }
  konsole.log("dataResponseId", formlabelData);

const radiobutton=(name,value,label,onChange,checked)=>{
    return(<Form.Check inline className="left-radio endLifeRadio" type="radio"
    name={name}
    value={value}
    label={label}
    onChange={(e) => onChange(e)}
    checked={value == checked }
    />
    )
}

function toasterAlert(text,type) {
  setdata({ open: true, text: text, type: type });
}

konsole.log('selectedStep',selectedStep)
konsole.log('')
  return (
    <>
    <CustomStepper setStepperNo={setStepperNo} stepperNo={stepperNo} />
    <div className="mb-4" style={{paddingBottom:"2rem"}}>
      <div className="Question-Card-Div">
        {(stepperNo === 0) ? 
          <div>
            {formlabelData.label899 && (
              <div>
                <h5 className="pb-2" >{formlabelData.label899.question}</h5>
                {formlabelData.label899.response.map((answer, index) => {
                      return radiobutton("artificialAdministration",answer.responseId,answer.response,onChange,artificialAdministration)
                    })}
              </div>
            )}

            {artificialAdministration == 211 ? (
              <>
                <div className="mt-3">
                  <h5>Do you want the following treatments:</h5>
                </div>
                {formlabelData.label900 && (
                  <div>
                    <h5 className="mt-2">{formlabelData.label900.question}</h5>
                        {formlabelData.label900.response.map(
                          (answer, index) => {
                            return radiobutton("SecondQuestion",answer.responseId,answer.response,secondQuestion,CRPQuestionDetails.CRPAnswerId)
                          }
                        )}
                  </div>
                )}
                {formlabelData.label901 && (
                  <div>
                    <h5 className="mt-2">{formlabelData.label901.question}</h5>
                    {formlabelData.label901.response.map(
                          (answer, index) => {
                            return radiobutton("ThirdQuestion",answer.responseId,answer.response,secondQuestion,artificially.artificiallyAnswerId)
                          }
                        )}
                  </div>
                )}
                {formlabelData.label902 && (
                  <div>
                    <h5 className="mt-2">{formlabelData.label902.question}</h5>
                    {formlabelData.label902.response.map(
                          (answer, index) => {
                            return radiobutton("FourthQuestion",answer.responseId,answer.response,secondQuestion,Cardiopulmnatory.CardiopulmnatoryAnswerId) 
                          }
                        )}
                  </div>
                )}
                {formlabelData.label903 && (
                  <div>
                    <h5 className="mt-2">{formlabelData.label903.question}</h5>
                        {formlabelData.label903.response.map(
                          (answer, index) => {
                            return radiobutton("FifthQuestion",answer.responseId,answer.response,secondQuestion,Antibiotic.AntibioticAnswerId)
                          }
                        )}
                  </div>
                )}
                {formlabelData.label904 && (
                  <div>
                    <h5 className="mt-2">{formlabelData.label904.question}</h5>
                    {formlabelData.label904.response.map(
                          (answer, index) => {return radiobutton("SixQuestion",answer.responseId,answer.response,secondQuestion,heroic.heroicAnswerId)}
                        )}
                  </div>
                )}
                <div className="mt-3 plsSpecify">
                  <h5 className="pb-1">Please Specify</h5>
                  <Row>
                    <Col>
                      {formlabelData.label928 && (
                        <input
                        className="border rounded"
                          rows={4}
                          defaultValue={
                            formlabelData.label928?.response[0].response
                          }
                          value={plzSpecify}
                          onChange={(e) => {
                            setPlzSpecify(e.target.value);
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                </div>
              </>
            ) : (
              <></>
            )} 
                            {
                    memberUserId != spouseUserId && spouseUserId != 'null' && showSpouseCheck && <div className='w-50 d-flex gap-2 mt-2'>
                    <input type='checkbox' style={{width:'20px'}} value={sameForspouse} onChange={(e)=>{setSameforspouse(e.target.checked)}}  />
                    <h5>Add same details for Spouse</h5>
                    </div>
                  }
            <div className="Sava-Button-Div">
              <button className="Save-Button" onClick={()=>PostQuestionData()}>
          Save & Proceed
                
              </button>
            </div>
          </div>
         : (stepperNo == 1) ? 
         <NotifyStep id={2} memberUserId={props.memberId}   setStepperNo={setStepperNo} stepperNo={stepperNo} sameForspouse={sameForspouse} />
         : (stepperNo == 2) ? 
          <>
                <Row className="d-flex justify-content-center pt-2">
                <Col  className=" w-100" >
                <UploadFile memberUserId={props?.memberId} />
                    <div className="mb-2" style={{ border: "1px solid white" }}>
                     
                        {formlabelData.label996 && (
                  <div>
                    <h5 className="mt-2">{formlabelData.label996.question}</h5>
                    {formlabelData.label996.response.map((answer, index) => {
                            return radiobutton("SevenQuestion",answer.responseId,answer.response,secondQuestion,heroicAgent.heroicAgentAnswerId)
                          }
                        )}
                    </div>
                     )}
                    </div>
                    {heroicAgent?.heroicAgentAnswerId == "391" ? (
                     <div className="mb-2 textEditor-Col ps-0" style={{ border: "1px solid white" }}>
                     {formlabelData.label926 && (
                       <div className="mt-3">
                         <h5 className="mb-2">{formlabelData.label926.question}</h5>
                         <Form.Control
                         as="textarea"
                         className="shadow"
                           rows={4}
                           placeholder="Please type something here"
                           defaultValue={
                             formlabelData.label926?.response[0].response
                           }
                          //  value={specialInsAns}
                           onChange={(e) => {
                             setSpecialInsAns(e.target.value);
                           }}
                         />
                       </div>
                     )}
                   </div> )
                   :("")}
                   {memberUserId != spouseUserId && spouseUserId != 'null' &&  showSpouseCheck2 && <div className='w-50 d-flex gap-2 mt-2'>
                    <input type='checkbox' style={{width:'20px'}} value={sameForspouse} onChange={(e)=>{setSameforspouse(e.target.checked)}}  />
                    <h5>Add same details for Spouse</h5>
                    </div>
                  }
                  </Col>
                 </Row>
            <div className="Sava-Button-Div d-flex flex-wrap justify-content-between">
            <button className="Save-Button mb-2" onClick={()=>setStepperNo(stepperNo-1)}>Back</button>
              <button className="Save-Button" onClick={()=>postSubjectDatastep3()}>Save & Proceed</button>
          
            </div>
          </>
         :( stepperNo == 3) ? 
          <><AgentguidanceCom memberUserId={memberUserId} setStepperNo={setStepperNo} stepperNo={stepperNo} /></>
         : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(Endoflife);

