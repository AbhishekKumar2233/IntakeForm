import React, { useEffect, useState, useContext } from 'react'
import { mentalhealth } from '../control/Constant';
import { $CommonServiceFn } from '../network/Service';
import { $Service_Url } from '../network/UrlPath';
import { $AHelper } from '../control/AHelper';
import konsole from '../control/Konsole';
import { Row, Col, Form, Radio, TextArea, Modal, Button } from 'react-bootstrap';
import { Document, Page, pdfjs } from "react-pdf"
import Select from 'react-select'
import { SET_LOADER } from '../Store/Actions/action';
import { globalContext } from '../../pages/_app';
import { connect } from 'react-redux';
import NotifyStep from './NotifyStep'
import UploadFile from './UploadFile';
import AlertToaster from '../control/AlertToaster';
import AgentguidanceCom from './AgentguidanceCom';
import CustomStepper from './CustomStepper';
import AddnewProfessmembermodal from './Addnewprofessionalmodal';
import ProfessSearch from '../professSearch';
import NewProServiceProvider from '../NewProServiceProvider';

const Mentalhealth = (props) => {
  konsole.log('konsoleprops', props)
  const spouseUserId = sessionStorage.getItem('spouseUserId')

  const { setdata } = useContext(globalContext)
  const context = useContext(globalContext)

  const [stepperNo,setStepperNo]=useState(0)
  //define state----------------------------------------------------------------------------

  const [stepper, setStepper] = useState(0)
  const [formlabelData, setFormLabelData] = useState({});
  const [callgcm, setCallgcm] = useState('')
  const [specialInsAns, setSpecialInsAns] = useState("");
  const [otherspecialins, setotherspecialins] = useState([])
  const [contactagent, setContactagent] = useState('')
  const [locategcm, setLocategcm] = useState('')
  const [getselectedGCM, setGetselectedGCM] = useState('');
  const [professionalUser, setProfessionalUser] = useState([]);
  const [openfile, setopenfile] = useState(false)
  const [numPages, setNumPages] = useState(null);
  const [showaddprofessmodal, setshowaddprofessmodal] = useState(sessionStorage.getItem("openModalHash") ? true : false);
  const [professionaltype, setprofessionaltype] = useState(sessionStorage.getItem("openModal4SetGuidanceProType") || '');
  const [Addnewprofessmodaldata, setAddnewprofessmodaldata] = useState(null)
  const [sameForspouse,setSameforspouse] = useState(false)
  const [showSpouseCheck,setShowspouseCheck] = useState(true)
  const [showSpouseCheck2,setShowspouseCheck2] = useState(true)
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


  // const [openFileModal, setOpenFileModal] = useState(false)

  //useEffect----------------------------------------------------------------------------
  useEffect(() => {
    sessionStorage.setItem("openModal4SetGuidanceProType", "");
    getSubjectForFormLabelId(props?.memberId)
    getProfessionalByUser(props?.memberId)
    setStepperNo(0)

    setGetselectedGCM([])
    setProfessionalUser([])
    setFormLabelData({})
    setCallgcm('')
    setSpecialInsAns('')
    setotherspecialins([])
    setContactagent('')
    setLocategcm('')
    setprofessionaltype('')
    setAddnewprofessmodaldata(null)
  }, [props?.memberId])

useEffect(()=>{
  putProfessionaluserpramas()
},[Addnewprofessmodaldata])
  //useEffect functions------------------------------------------------------------------------

  const getSubjectForFormLabelId = async (userId) => {
    konsole.log('getSubjectForFormLabelIdgetSubjectForFormLabelId', userId)
    const formlabelData = {};
    // props.dispatchloader(true)
    // mentalhealth.formLabelId.map((item, index) => {
    //   let data = [item?.id]
      props.dispatchloader(true)
      $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.getsubjectForFormLabelId, mentalhealth.formLabelId, (response) => {
        props.dispatchloader(false)
        if (response) {
          const resSubData = response.data.data;

          konsole.log('respojne', response)
          for (let resObj of resSubData) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = resObj.question;
            props.dispatchloader(true)
            $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getSubjectResponse + userId + `/0/0/${formlabelData[label].questionId}`, "", (response, err) => {
              props.dispatchloader(false)
              if (response) {
                konsole.log("getSubjectResponse", response);
                if (response.data.data.userSubjects.length !== 0) {
                  let responseData = response.data.data.userSubjects[0];
                  for (let i = 0; i < formlabelData[label].response.length; i++) {
                    if (formlabelData[label].response[i].responseId === responseData.responseId) {
                      if (responseData.responseNature == "Radio") {
                        formlabelData[label].response[i]["checked"] = true;
                        konsole.log('responseDataresponseData', responseData)
                        if (formlabelData[label].questionId == 202) {
                          setCallgcm(responseData.responseId);
                          setShowspouseCheck(false)
                        }
                        if (formlabelData[label].questionId == 203) {
                          setContactagent(responseData.responseId);
                        }
                        if (formlabelData[label].questionId == 204) {
                          setLocategcm(responseData.responseId);
                        }
                        if (formlabelData[label].questionId == 207) {
                          setotherspecialins(responseData)
                          setShowspouseCheck2(false)
                        }
                      } else if (responseData.responseNature == "Text") {
                        if (responseData.responseId == 402) {
                          setSpecialInsAns(responseData.response)
                        }
                      }
                      formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
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
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSearchProfessional +'?MemberUserId='+ userid,  "", (response, err) => {
      if (response) {
        props.dispatchloader(false)
        konsole.log('getProfessionalByUserIdres', response)
        let responseData = response?.data?.data;
        let filterdata = responseData?.filter((items) => {
          return items.proTypeId == 7;
        });
        konsole.log('filterdatafilterdata',responseData, filterdata)
        let selectedGCM = responseData?.filter((items) => {
          return items.proTypeId == 7 && items.lpoStatus == true;
        });
        let valueInsert = selectedGCM.length > 0 ? [selectedGCM[0]] : []
        konsole.log('valueInsertvalueInsert', valueInsert)
        setGetselectedGCM(valueInsert);
        // setGetselectedGCM(selectedGCM[0]);
        setProfessionalUser(filterdata);


      } else {
        props.dispatchloader(false)
        konsole.log('getProfessionalByUserIdreserr', err)
      }
    }
    );
  };


  // radio functions--------------------------------------------------------------------

  const checkValuespecialist = (e) => {
    konsole.log("metadata CheckValue", e.target.value);
    let responseObj = {
      userId: props.memberId,
      userSubjectDataId: 0,
      subjectId: 0,
      responseId: 0,
    };
    if (e.target.value == 403) {
      const formObj = formlabelData.label1003;
      konsole.log("metadata res", formObj, responseObj);
      const answer = formObj.response.filter((a) => {
        return a.responseId == e.target.value;
      })[0];
      konsole.log("metadata", answer);
      responseObj.subjectId = formObj.questionId;
      responseObj.responseId = answer.responseId;
      responseObj.userSubjectDataId = formObj.userSubjectDataId;
      konsole.log("metadata responseObj", responseObj);
      setotherspecialins(responseObj);
    } else if (e.target.value == 404) {
      const formObj = formlabelData.label1003;
      const answer = formObj.response.filter((a) => {
        return a.responseId == e.target.value;
      })[0];
      responseObj.subjectId = formObj.questionId;
      responseObj.responseId = answer.responseId;
      responseObj.userSubjectDataId = formObj.userSubjectDataId;
      konsole.log("eventvalue", responseObj);
      konsole.log("metadata responseObj", responseObj);
      setotherspecialins(responseObj);
    }
  };

  const checkValue998 = (e) => {
    konsole.log('aaaa', e.target.value)
    setCallgcm(e.target.value)
  }
  const checkValue999 = (e) => {
    setContactagent(e.target.value)
  }
  const onChangeSelect = (item) => {
    konsole.log('item', item)
    setGetselectedGCM([item.value])
  };
  const checkValue1000 = (e) => {
    setLocategcm(e.target.value)
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }

  konsole.log('callgcmcallgcmcallgcm', callgcm)
  konsole.log('formlabelDatalabel998', formlabelData.label998)
  //save information--------------------------------------------------------------------------
  const postSubjectData = () => {
    let inputArray = [];

    let callgcmdata = {
      userSubjectDataId: formlabelData.label998?.userSubjectDataId ? formlabelData.label998?.userSubjectDataId : 0,
      subjectId: formlabelData.label998?.questionId,
      responseId: callgcm,
      userId: props.memberId,
    }
    konsole.log('callgcmdatacallgcmdata', callgcmdata)

    let contactagentdata = {
      userSubjectDataId: formlabelData.label999?.userSubjectDataId != undefined ? formlabelData.label999?.userSubjectDataId : 0,
      subjectId: formlabelData.label999?.questionId,
      responseId: contactagent,
      userId: props.memberId,
    }

    let locategcmdata = {
      userSubjectDataId: formlabelData.label1000?.userSubjectDataId != undefined ? formlabelData.label1000?.userSubjectDataId : 0,
      subjectId: formlabelData.label1000?.questionId,
      responseId: locategcm,
      userId: props.memberId,
    }

    inputArray.push(callgcmdata)
    if (callgcm == 395) {
      inputArray.push(contactagentdata)
      // putProfessionaluserpramas()
    }
    if (contactagent == 398) {
      inputArray.push(locategcmdata)
      // putProfessionaluserpramas()
    }

    if(callgcm == 395 && contactagent == 397) {
      putProfessionaluserpramas(true)
    }

    let inputArrayprimary = {
      userId: props?.memberId,
      userSubjects: inputArray,
    };

    if(sameForspouse){

      let ArraySpouse = inputArray.map((e)=>{return{...e,userId:spouseUserId}})
      let inputArrayspouse = {
        userId: spouseUserId,
        userSubjects: ArraySpouse,
      };
      postSubjectDataApi(inputArrayspouse,1, true)
    }
    postSubjectDataApi(inputArrayprimary,1)
  };
  const postSubjectDataApi = (inputArray,step, forSpouse) =>{
    $CommonServiceFn.InvokeCommonApi('PUT', $Service_Url.putSubjectResponse, inputArray, (res, err) => {
      if (res) {
        konsole.log('postaddusersubjectdata', res)
        if(forSpouse != true) AlertToaster.success("Data saved successfully");
        getSubjectForFormLabelId(props?.memberId)
        setStepperNo(stepperNo+step)
        // function for next step
      } else {
        konsole.log('postaddusersubjectdata', err)
        toasterAlert("Please select all the questions correctly");
      }
    })
  }


  const putProfessionaluserpramas = (fromSelectedGCM) => {
    let stateUserId = JSON.parse(sessionStorage.getItem("stateObj")).userId;

    konsole.log('getselectedGCMgetselectedGCMgetselectedGCM', getselectedGCM.length)

    let getselected = getselectedGCM?.length !== 0 ? getselectedGCM[0] : []
    const dataObj = [
      {
       "userProId": getselected.userProId,
       "proUserId": getselected.proUserId,
       "proCatId": getselected.proCatId,
       "userId": props.memberId,
       "lpoStatus": true,
       "upsertedBy": stateUserId,
       "isActive": true,
     }
   ]
    konsole.log('dataObjdataObj', dataObj, getselected)
    if (Addnewprofessmodaldata != null && fromSelectedGCM != true) {
      var dataaddprofessdata = Addnewprofessmodaldata?.proCategories?.map((e)=>{
        return    {
          "userProId": Addnewprofessmodaldata.userProId,
          "proUserId": Addnewprofessmodaldata.proUserId,
          "proCatId": e.proCatId,
          "userId": Addnewprofessmodaldata.createdBy,
          "lpoStatus": true,
          "isActive":true,
          "upsertedBy": stateUserId
        }
      })

  }
    let dataObj1 = (Addnewprofessmodaldata !== null && fromSelectedGCM != true) ? dataaddprofessdata : dataObj
    konsole.log('dataObj1dataObj1', dataObj1)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postProfessionalUser, dataObj1, (res, err) => {
      if (res) {
        konsole.log('updateprofessionluser', res)
      } else {
        konsole.log('updateprofessionluser', err)
      }
      getProfessionalByUser(props.memberId)
    })
  };

  // special instruction--------------------------------------------------------------------------
  const postSubjectDatastep3 = () => {
    konsole.log(otherspecialins, "otherspecialins746464646")
    if (otherspecialins.length == 0) {
      toasterAlert("Please provide  an instruction to the agent.")
    }
    let inputArray = {
      userId: props.memberId,
      userSubjects: [
        {
          userSubjectDataId: formlabelData.label1002?.userSubjectDataId ? formlabelData.label1002?.userSubjectDataId : 0,
          subjectId: formlabelData.label1002?.questionId,
          subResponseData: specialInsAns,
          responseId: formlabelData.label1002?.response[0].responseId,
        },
        {
          userSubjectDataId: formlabelData.label1003?.userSubjectDataId ? formlabelData.label1003?.userSubjectDataId : 0,
          subjectId: formlabelData.label1003?.questionId,
          userId: props.memberId,
          responseId: otherspecialins.responseId,
        }
      ],
    };

    if(sameForspouse){
      let userSubjectdata = inputArray.userSubjects.map((e)=>{return{...e,userId:spouseUserId}})
      let inputArraySpouse = {
        userId: spouseUserId,
        userSubjects:userSubjectdata
      }
      postSubjectDataApi(inputArraySpouse,1, true)
    }
    postSubjectDataApi(inputArray,1)

  }
  // message for warning and confrmation-----------------------------------------------------
  function toasterAlert(text) {
    setdata({ open: true, text: text, type: "Warning" });
  }

  const addprofessfuncclick = (type) => {
    konsole.log(type, "typetypetypetypetype");
    if (type == "GCM") {
      setprofessionaltype(7);
    } else if (type == "ElderLawAttorney") {
      setprofessionaltype(13);
    }
    setshowaddprofessmodal(true);
  };

  // ----------konsole-------------------------------------------------------------------------
  konsole.log('formlabelDataformlabelDataaaaa', formlabelData)
  konsole.log('callgcmcallgcm', callgcm)

  return (
    <>
      
      {/* {showaddprofessmodal == true && <ProfessSearch pshow= {showaddprofessmodal} activeUser={props.activeUser} setshowaddprofessmodal={setshowaddprofessmodal} protypeTd={professionaltype} memberUserId={props.memberId} setAddnewprofessmodaldata={setAddnewprofessmodaldata} showForm={2} />} */}
      {showaddprofessmodal == true && 
      <NewProServiceProvider 
        uniqueKey="mentalhealth" 
        pshow= {showaddprofessmodal} 
        activeUser={props.activeUser} 
        setshowaddprofessmodal={setshowaddprofessmodal} 
        hideFilters={true}
        proSerDescTd={professionaltype == 7 ? '1' : '4'} 
        protypeTd={professionaltype} 
        // memberUserId={props.memberId} 
        setAddnewprofessmodaldata={setAddnewprofessmodaldata} 
        showForm={2} 
        getProfessionalByUser={getProfessionalByUser}
        currentPath="setGuidance>health>mental"
      />}
      <CustomStepper setStepperNo={setStepperNo} stepperNo={stepperNo} /> 
      
      <div className='mb-4' style={{ paddingBottom: '2rem' }}>
        <div className='Question-Card-Div'>
          {(stepperNo == 0) ? <>
            <h5>
              If an agent feels that you are not making rational decisions:
            </h5>
            <Form.Group as={Row} className="mb-3 mt-2">
              {formlabelData?.label998 && (
                <Row className="flex-column">
                  <Col xs sm="12" lg="12" id="label998">
                    <h5> {formlabelData.label998.question} </h5>
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center justify-content-start mt-1">
                        {formlabelData.label998.response.map((item, index) => (

                          <>
                            <Form.Check
                              inline
                              className="left-radio"
                              type="radio"
                              value={item.responseId}
                              name="label998"
                              label={item.response}
                              checked={item?.responseId == callgcm}
                              key={index}
                              onChange={(e) => checkValue998(e)}
                            />
                          </>
                        ))}

                      </div>
                    </div>
                  </Col>
                </Row>
              )}
              {(callgcm == 395 && formlabelData?.label999) &&
                <Row className="flex-column">
                  <Col xs sm="12" lg="12" id="labe999">
                    <h5> {formlabelData.label999.question} </h5>
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center justify-content-start mt-1">
                        {formlabelData.label999.response.map((item, index) => (
                          <Form.Check
                            inline
                            className="left-radio"
                            type="radio"
                            value={item.responseId}
                            name="label999"
                            label={item.response}
                            checked={item.responseId == contactagent}
                            key={index}
                            onChange={(e) => checkValue999(e)}
                          />
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>}

              {(callgcm == 395 && contactagent == 397) &&
                <div className='mt-2'>
                  <h5>Care Manager</h5>
                  <div className='d-flex'>
                    <div className='mt-2'>
                      <Select
                        options={(professionalUser?.length > 0) ? professionalUser?.map((data, index) => ({
                          value: data,
                          label:
                          //  `${$AHelper.capitalizeAllLetters(data.fName) (data.mName) ? (data.mName) + ' ' : ''}${data.lName}`
                          `${$AHelper.capitalizeAllLetters(data.fName)} ${$AHelper.capitalizeAllLetters(data.mName) ? data.mName + ' ' : ''}${$AHelper.capitalizeAllLetters(data.lName)}`,
                          index: index
                        })) : []}

                        value={(getselectedGCM.length > 0) ? {
                          value: getselectedGCM[0],
                          label: `${$AHelper.capitalizeAllLetters(getselectedGCM[0].fName)} ${$AHelper.capitalizeAllLetters(getselectedGCM[0].mName) ? getselectedGCM[0].mName + ' ' : ''}${$AHelper.capitalizeAllLetters(getselectedGCM[0].lName)}`
                        } : { value: '-1', label: 'Select a person' }}
                        onChange={(e) => onChangeSelect(e)}
                        className='guidance-Select '
                      />
                    </div>
                    <button className="addnewproffbtn" onClick={()=>{addprofessfuncclick("GCM")}}> + </button>
                  </div>

                </div>
              }


              {(callgcm == 395 && contactagent == 398 && formlabelData?.label1000) &&
                <Row className="flex-column mb-4">
                  <Col xs sm="12" lg="12" id="labe999">
                    <h5> {formlabelData.label1000.question} </h5>
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center justify-content-start mt-1">
                        {formlabelData.label1000.response.map((item, index) => (
                          <Form.Check
                            inline
                            className="left-radio"
                            type="radio"
                            value={item.responseId}
                            name="label1000"
                            label={item.response}
                            checked={item.responseId == locategcm}
                            key={index}
                            onChange={(e) => checkValue1000(e)}
                          />
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              }
              {(contactagent == 398 && locategcm == 399) && <a style={{ color: "blue" }} href="https://ResourceGuide.agingoptions.com/" target="blank">Aging Options Resource Guide</a>}
              {(callgcm == 395 && contactagent == 398 && locategcm == 400) && <h5 className="mt-2">You can always go to Aging Options Resource Guide to locate a geriatric care manger.</h5>}
              {callgcm == 395 && <div className="mt-2">
                <h5>
                  <button style={{ backgroundColor: "transparent", border: "none", color: "blue",textDecoration:"underline" }}
                  //  onClick={() => setOpenFileModal(true)}
                  ><a href='https://beta.lifeplanorganizer.com/pdf/WhatToExpectFromA_GCM.pdf' target='_blank'>Click here</a></button>to see what a geriatric care manager will do for your children
                </h5>
              </div>}
              {
                    props?.memberId != spouseUserId && spouseUserId != 'null' && showSpouseCheck && <div className='w-50 d-flex gap-2 mt-2'>
                    <input type='checkbox' style={{width:'20px'}} value={sameForspouse} onChange={(e)=>{setSameforspouse(e.target.checked)}}  />
                    <h5>Add same details for Spouse</h5>
                    </div>
                  }

            </Form.Group>
            <div className="Sava-Button-Div">
          <button className="Save-Button" onClick={() => postSubjectData()} >
            Save & Proceed
          </button>
        </div>

          </> : (stepperNo == 1) ? <NotifyStep  id={4} memberUserId={props.memberId} setStepperNo={setStepperNo}  stepperNo={stepperNo} sameForspouse={sameForspouse} /> : (stepperNo == 2) ? <>

            {/* ----------------------------------------------------------------------------------- */}
            <Form.Group as={Row} className="mb-3 mt-2">
              <Row className="flex-column">
                <UploadFile memberUserId={props?.memberId} />
              </Row>

              {formlabelData?.label1003 && (
                <Row className="flex-column">
                  <Col xs sm="12" lg="12" id="label998">
                    <h5 className='mt-3'> {formlabelData.label1003.question} </h5>
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center justify-content-start mt-1">
                        {formlabelData.label1003.response.map((item, index) => (

                          <>
                            <Form.Check
                              inline
                              className="left-radio"
                              type="radio"
                              value={item.responseId}
                              name="label1003"
                              label={item.response}
                              checked={item?.responseId == otherspecialins.responseId}
                              key={index}
                              onChange={(e) => checkValuespecialist(e)}
                            />
                          </>
                        ))}

                      </div>
                    </div>
                  </Col>
                </Row>
              )}

              {(otherspecialins?.responseId == 403) ? <>
                <Col className='textEditor mt-2' style={{ width: '90%' }}>
                  <div className='mt-2'>
                    <h5>{formlabelData.label1002?.question}</h5>

                    <Form.Control as="textarea" className='mt-2 shadow'
                      placeholder="Please type something here"
                      defaultValue={formlabelData.label1002?.response[0].response}
                      value={specialInsAns}
                      onChange={(e) => setSpecialInsAns(e.target.value)}
                      rows={4} />
                  </div>
                </Col>
              </> : null}

            </Form.Group>
            {
                    props?.memberId != spouseUserId && spouseUserId != 'null' && showSpouseCheck2 && <div className='w-50 d-flex gap-2 mt-2'>
                    <input type='checkbox' style={{width:'20px'}} value={sameForspouse} onChange={(e)=>{setSameforspouse(e.target.checked)}}  />
                    <h5>Add same details for Spouse</h5>
                    </div>
                  }
            <div className="Sava-Button-Div"></div>
              <div className="Sava-Button-Div d-flex flex-wrap justify-content-between">
                <button className="Save-Button mb-2"
                // onClick={backButton}
                onClick={()=>setStepperNo(stepperNo-1)}
                >
                  Back

                </button>
                <button className="Save-Button"
                 onClick={postSubjectDatastep3}
                >
                  Save & Proceed
                </button>
              </div>



            {/* ----------------------------------------------------------------------------------- */}

          </> : (stepperNo==3) ?<AgentguidanceCom  setStepperNo={setStepperNo}  stepperNo={stepperNo}   memberUserId={props?.memberId}/>:null}
        </div>
       

      </div>

      {/* <OpemModalFile openFileModal={openFileModal} setOpenFileModal={setOpenFileModal} onDocumentLoadSuccess={onDocumentLoadSuccess} numPages={numPages} /> */}
    </>
  )
}



// const OpemModalFile = ({ openFileModal, setOpenFileModal, onDocumentLoadSuccess, numPages }) => {
//   return (
//     <Modal show={openFileModal} size="lg" onHide={() => setOpenFileModal(false)} backdrop="static" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px" }} >
//       <Modal.Header className="text-white" closeVariant="white" closeButton>View File</Modal.Header>
//       <Modal.Body className="rounded mt-2" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
//         <Document
//           file={$AHelper.baseurl64()}
//           onLoadSuccess={onDocumentLoadSuccess}
//           onContextMenu={(e) => e.preventDefault()}
//         >
//           {Array.from(new Array(numPages ?? 0), (el, index) => (
//             <Page key={`page_${index + 1}`} pageNumber={index + 1} />
//           ))}
//         </Document>
//       </Modal.Body>

//       <Modal.Footer className="border-0">
//         <Button className="cancel-Button py-0" onClick={() => setOpenFileModal(false)}>
//           Cancel
//         </Button>

//       </Modal.Footer>
//     </Modal>
//   )
// }



// export default Mentalhealth

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader })
});

export default connect(mapStateToProps, mapDispatchToProps)(Mentalhealth)
