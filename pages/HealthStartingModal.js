import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { $CommonServiceFn } from "../components/network/Service";
import { $Service_Url } from "../components/network/UrlPath";
import { Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, InputGroup,} from "react-bootstrap";
import { GET_Auth_TOKEN, GET_USER_DETAILS, SET_LOADER } from '../components/Store/Actions/action';
import { connect } from 'react-redux';

function HeathStartingModal(props){
     
      const [modalshow, setModalshow] = useState(false);
      const[newUserId,setNewUserId]=useState()
      const [isCheckedFirst, setIsCheckedFirst] = useState(false);
      const[updateCaregiverSuitabilty,setupdateCaregiverSuitabilty]=useState(false)
      const[ formlabelData,setFormlabelData]=useState({});
      const[secondCheck,setsecondCheck]=useState(false)
      const [termsAndConditions, setTermsAndConditions] = useState({
        userSubjectDataId:0,
        responseId: 0,
        subResponseData: false,
        subjectId: 0,
      });
      const [dontShowAgain, setdontShowAgain] = useState({
        userSubjectDataId:0,
        responseId: 0,
        subResponseData: false,
        subjectId: 0,
      });

      useEffect(()=>{
        const labelIds = [1005, 1004];
        let newuserid = sessionStorage.getItem("SessPrimaryUserId");
        setNewUserId(newuserid)
        getsubjectForFormLabelId(labelIds,newuserid)
      },[])

        const handleChange = (event) => {

            const eventId = event.target.id;
            const eventValue = event.target.value
            const eventName = event.target.name;
            const checkboxCheck=event.target.checked
            console.log("adfszxc",eventName,checkboxCheck)
            
            if (eventName == "termsAndConditions") {
              setIsCheckedFirst(checkboxCheck)
              setTermsAndConditions((prevState) => ({
                userSubjectDataId: (formlabelData?.label1004?.userSubjectDataId) ? formlabelData.label1004.userSubjectDataId: 0,
                responseId: eventId,
                subResponseData: checkboxCheck,
                subjectId:
                formlabelData.label1004 && formlabelData.label1004.questionId,
              }));
            }
            
            else if(eventName == "dontShowAgain") {
              setdontShowAgain((prevState) => ({
                userSubjectDataId: (formlabelData?.label1005.userSubjectDataId) ? formlabelData?.label1005?.userSubjectDataId : 0,
                responseId: eventId,
                subResponseData: checkboxCheck,
                subjectId:formlabelData.label1005 && formlabelData.label1005.questionId,
              }));
              
            }
        
        }
 
    const getsubjectForFormLabelId = (labelIds,newuserid) => {
      let formlabelData = {};
      props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi( "POST", $Service_Url.getsubjectForFormLabelId, labelIds, (response) => {
        props.dispatchloader(false);
        if (response) {
          // console.log("sujectNames", JSON.stringify(response.data.data));
          const responseData = response.data.data;
          for (let resObj of responseData) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = resObj.question;
            props.dispatchloader(true);

            if(label == 'label1005') {
              setdontShowAgain({
                userSubjectDataId: 0,
                responseId: resObj?.question?.response?.[0]?.responseId ?? 0,
                subResponseData: false,
                subjectId: resObj?.question && (resObj?.question?.questionId ?? 0),   
              })
            }

            $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, "", (response) => {
              props.dispatchloader(false); 
              if (response) { 
                if (response.data.data.userSubjects.length > 0) {
                      let responseData = response.data.data.userSubjects[0];
                      for (let i = 0;i < formlabelData[label].response.length;i++) {
                        // console.log("datashownatcaregivesa",responseData,formlabelData[label].response[i].responseId ,responseData.responseId);
                        if (formlabelData[label].response[i].responseId == responseData.responseId) {
                            formlabelData[label][ "userSubjectDataId" ] = responseData.userSubjectDataId;
                            formlabelData[label].response[i]["checked"] = responseData.response;
                          //   formlabelData[label].response[i]["checked"] = true;
                          }
                      }

                      if(label == 'label1005') {
                        setdontShowAgain({
                          userSubjectDataId: formlabelData.label1005.userSubjectDataId ? formlabelData.label1005.userSubjectDataId: 0,
                          responseId:formlabelData.label1005.response[0].responseId,
                          subResponseData:formlabelData.label1005.response[0]["checked"] ?  formlabelData.label1005.response[0]["checked"] : false,
                          subjectId: formlabelData.label1005 && formlabelData.label1005.questionId,
                        })

                        if(formlabelData.label1005.response[0]["checked"]=="true"){
                          setModalshow(false)
                          props.functionForDicModal(false)
                          setsecondCheck(true)
                        }
                        if(formlabelData.label1005.response[0]["checked"]==undefined) {
                          setModalshow(true)
                        }
                        if(formlabelData.label1005.response[0]["checked"]=="false")
                        {
                          setModalshow(true)
                          setIsCheckedFirst(true)
                        }
                      }

                      if(label == 'label1004') {
                        setTermsAndConditions({
                          userSubjectDataId: formlabelData.label1004.userSubjectDataId ? formlabelData.label1004.userSubjectDataId : 0,
                          responseId: formlabelData.label1004.response[0].responseId,
                          subResponseData: formlabelData.label1004.response[0]["checked"],
                          subjectId:formlabelData.label1004 && formlabelData.label1004.questionId,
                        }) 

                        if(formlabelData.label1004.response[0]["checked"]=="true"){
                          setIsCheckedFirst(true)
                        }
                      }

                      setFormlabelData(formlabelData)
                      setupdateCaregiverSuitabilty((prev) => !prev)
                      // console.log("1formlabelData",formlabelData.label1005.response[0]["checked"])
                 }
                else
                {
                  setModalshow(true)
                  props.functionForDicModal(true)
                }
              }
            })   
          }
        }
        setFormlabelData(formlabelData)
        setupdateCaregiverSuitabilty((prev) => !prev)
      })
    }

    function sendJson()
    {
        props.functionForDicModal(false)
         let inputArray = {
                userId: newUserId,
                userSubjects: [termsAndConditions,dontShowAgain]   
              };   
              // console.log("inputArrayinputArray",inputArray) 
            $CommonServiceFn.InvokeCommonApi("PUT",$Service_Url.putusersubjectdata,inputArray,((response,error)=>{
                if(response){
                  // console.log(response,"response put")
                }
            }))      
    }
    
    // console.log("Dsda",isCheckedFirst,"---",isCheckedSecond)
    // console.log("formdataformdataformdata",formlabelData)

    return(
        <>

      <Modal
        show={modalshow}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="desclamerModal"
      >
      <Modal.Header className="bg-white border-0 d-flex justify-content-center  mt-3">
        <Modal.Title id="contained-modal-title-vcenter" className="bg-white">
          <h1 className="desclaimerheading">Disclaimer</h1>
        </Modal.Title> 
      </Modal.Header>
      <Modal.Body id="desclamer_Body">
        
      
          <div style={{ height:" 250px",overflowY:" scroll"}}>
          <section className="mt-4">
                  <p className="mt-2 desclaimerparas">
                      The information available and provided on this platform including without limitation, the content, blogs, videos, and testimonials are not a substitute for legal advice and expressly do not replace the advice or representation from a licensed attorney.
                  </p>
                  <p className="desclaimerparas mt-2">
                      While we go to great lengths to ensure the information on the platform is accurate and up to date; we make no claim as to the accuracy of this information and are not responsible for any actions, consequences, claims or otherwise that may result from the use of this platform. We recommend that you consult with a licensed attorney for your specific needs and questions. The use of this platform does not create an attorney-client relationship between AgingOptions or LifePoint Law and any user.
                  </p>
              </section>

              <section className="mt-4">
                  <h2 className="desclaimerheadingForHippa">HIPAA Disclaimer</h2>
                  <p className="mt-3 desclaimerparas">
                      Portions of this platform allow you to upload and store certain medical information (“Protected Health Information” or “PHI”) for your personal control and access. AgingOptions is currently not a business associate as defined in HIPAA. We have encrypted security protocols for your benefit and allow you to control who you disclose information to. We also do not attempt to access this information for any purpose other than to deliver the platform services to you. We cannot ensure that your PHI is protected within the terms of HIPAA. If, AgingOptions, as the platform provider comes into contact with Protected Health Information, it will keep such information confidential and not further access, use, or disclose it.
                  </p>
                  <p className="desclaimerparas mt-2">
                      You are solely responsible for the PHI that you add to the platform and who you choose to disclose it to. You are prohibited from including PHI of any other person (even family members) as this would be a violation of HIPAA. You agree to hold AgingOptions from any HIPAA-associated claims or violations resulting from your use of the AgingOptions platform. Our services are evolving, and we anticipate offering terms that are HIPAA compliant in the future but until that time your use, access, and all information PHI or otherwise added to the platform is at your own risk and decision. For clarity, you are not required to add any information or PHI to use the platform; these are options made available to you in your file cabinet.
                  </p>
              </section>
              </div>


            <div style={{marginLeft:"26px"}}>

                    <div className="row pt-4 pb-2 ">
                      <div className="col-12 p-0 d-flex justify-content-start ">
                        {formlabelData?.label1004 && formlabelData?.label1004?.response.length>0 &&
                          formlabelData?.label1004?.response?.map((response, index) => {
                            console.log("responseresponse1", response, response?.checked);
                            return (
                              <div key={index} className="mb-0 d-flex align-items-center">
                                <Form.Check
                                  className="chekspace1 d-flex justify-content-center align-items-center"
                                  type="checkbox"
                                  id={response?.responseId}
                                  label={response?.response}
                                  name="termsAndConditions"
                                  onClick={(e) => {
                                    handleChange(e);
                                  }}
                                  defaultChecked={response?.checked}
                                />
                              </div>
                            );
                          })}
                      </div>
                  </div>

            {
              (isCheckedFirst==true)? 
              <div className="row pt-4 pb-2">
              <div className="col-12 p-0 d-flex justify-content-start"> 
              {formlabelData?.label1005 &&
              formlabelData?.label1005?.response?.map(
                (response, index) => {
                  console.log("responser333esponse2", response); 
                  return (
                    <>
                      <div
                        key={index}
                        className=" mb-0 d-flex align-items-center"
                      >
                        <Form.Check
                          className="chekspace2 d-flex justify-content-center align-items-center"
                          type="checkbox"
                          id={response.responseId}
                          label={response.response}
                          name="dontShowAgain"
                          onClick={(e) => {
                            handleChange(e,index);
                          }}
                          defaultChecked={secondCheck}
                        />
                      </div>
                    </>
                  );
                }
              )}
              </div>

          </div> :
          <div className="row pt-4 pb-2">
            <div className="col-12 p-0 d-flex justify-content-start"> 
            {formlabelData.label1005 &&
            formlabelData?.label1005?.response?.map(
              (response, index) => {
                //  console.log("responseresponse2", response, response.checked);
                return (
                  <>
                    <div
                      key={index}
                      className=" mb-0 d-flex align-items-center"
                    >
                      <Form.Check
                        className="chekspace2 d-flex justify-content-center align-items-center"
                        type="checkbox"
                        id={response.responseId}
                        label={response.response}
                        name="dontShowAgain"
                        disabled
                        defaultChecked={response.checked==false}
                      />
                    </div>
                  </>
                  );
              }
            )} 
              </div>
          </div>


          }
                

        </div>


       <div className="row justify-content-center mt-3 "> 
            <div className="col-12 col-sm-12 col-md-2 col-lg-2 ">
                    {(isCheckedFirst==true)?  
                    <button className="disclamerButton " type="button" onClick={sendJson} style={{cursor:"pointer"}}>Done</button>:
                    <button className="disclamerButton " type="button" style={{cursor:"not-allowed",background: "grey",border: "1px solid grey"}}>Done</button>  }
            </div>
        </div> 

      </Modal.Body>
     
    </Modal>
        </>
    )
}


const mapStateToProps = (state) => ({ ...state.main });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeathStartingModal);


