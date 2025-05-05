import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb} from "react-bootstrap";
import Select from "react-select";
import { $Service_Url } from "../components/network/UrlPath";
import DatePicker from 'react-datepicker';
import { $CommonServiceFn } from '../components/network/Service';
import FiduciaryAssignment from "../components/FiduciaryAssignment"
import { $AHelper} from './control/AHelper'
import {legal } from './control/Constant'
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import LivingWill from './LivingWill';
import konsole from "./control/Konsole";
import {globalContext} from "../pages/_app";

class Legal extends Component {
  static contextType = globalContext
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      formlabelData: {},


      updateCaregiverSuitabilty: false,
      userId: this.props.primaryUserId,
      legalDocTypeId: 0,
      dateExecuted: new Date(),
      docName:'',
      docPath: '',

      legalDocType: [],
      legalDocument: [],

      legally :{
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      power:{
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      executor:{
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      lawsuit:{
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      seperate:{
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      inherit:{
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      special:{
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },


    };
  }

  componentDidMount() {
    // this.setState({
    //     userId: this.props.primaryUserId
    // })

    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
      this.setState({
        userId: newuserid,
      });
    this.fetchLegalDocument(newuserid);
    this.getsubjectForFormLabelId(newuserid);
  }

  // componentDidUpdate(prevProps,prevState){
  //   if(prevProps != this.props){
  //     this.fetchLegalDocument(this.props.primaryUserId);
  //   }
  // }


  handleChange = (e) => {
    const eventId = e.target.id;
    const eventValue = e.target.value;
   const eventName = e.target.name;
 

   if(eventName=="legally"){
    this.setState({
      ...this.state,
      legally:{ 
      userSubjectDataId: 0,
        responseId: eventId,
        subResponseData: eventValue,
         subjectId :  this.state.formlabelData.label445 &&
                      this.state.formlabelData.label445.questionId}
    
    })}
   else if(eventName=="power"){
      this.setState({
        ...this.state,
        power:{ 
        userSubjectDataId: 0,
          responseId: eventId,
          subResponseData: eventValue,
           subjectId :  this.state.formlabelData.label446 &&
                        this.state.formlabelData.label446.questionId}
      
      })
  }else if(eventName=="executor"){

      this.setState({
        ...this.state,
        executor:{
         
        userSubjectDataId: 0,
         responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label447 &&
            this.state.formlabelData.label447.questionId,
        }})
       
  }

  else if(eventName=="lawsuit"){

    this.setState({
      ...this.state,
      lawsuit:{
       
      userSubjectDataId: 0,
       responseId: eventId,
        subResponseData: eventValue,
        subjectId:
          this.state.formlabelData.label448 &&
          this.state.formlabelData.label448.questionId,
      }})
     
}
else if(eventName=="seperate"){

  this.setState({
    ...this.state,
    seperate:{
     
    userSubjectDataId: 0,
     responseId: eventId,
      subResponseData: eventValue,
      subjectId:
        this.state.formlabelData.label449 &&
        this.state.formlabelData.label449.questionId,
    }})
   
}
else if(eventName=="inherit"){

  this.setState({
    ...this.state,
    inherit:{
     
    userSubjectDataId: 0,
     responseId: eventId,
      subResponseData: eventValue,
      subjectId:
        this.state.formlabelData.label450 &&
        this.state.formlabelData.label450.questionId,
    }})
   
}
else if(eventName=="special"){

  this.setState({
    ...this.state,
    special:{
     
    userSubjectDataId: 0,
     responseId: eventId,
      subResponseData: eventValue,
      subjectId:
        this.state.formlabelData.label451 &&
        this.state.formlabelData.label451.questionId,
    }})
   
}
 
    
  };





  handlesubmit = () => {
    let inputdata = JSON.parse(JSON.stringify(this.state));

    let legally = {
      userSubjectDataId: this.state.legally.userSubjectDataId,
      subjectId: this.state.legally.subjectId,
      subResponseData: this.state.legally.subResponseData,
      responseId: this.state.legally.responseId,
      userId: this.state.userId,
    };

    let power = {
      userSubjectDataId: this.state.power.userSubjectDataId,
      subjectId: this.state.power.subjectId,
      subResponseData: this.state.power.subResponseData,
      responseId: this.state.power.responseId,
      userId: this.state.userId,
    };

    let executor = {
      userSubjectDataId: this.state.executor.userSubjectDataId,
      subjectId: this.state.executor.subjectId,
      subResponseData: this.state.executor.subResponseData,
      responseId: this.state.executor.responseId,
      userId: this.state.userId,
    };
    let lawsuit = {
      userSubjectDataId: this.state.lawsuit.userSubjectDataId,
      subjectId: this.state.lawsuit.subjectId,
      subResponseData: this.state.lawsuit.subResponseData,
      responseId: this.state.lawsuit.responseId,
      userId: this.state.userId,
    };
    let seperate = {
      userSubjectDataId: this.state.seperate.userSubjectDataId,
      subjectId: this.state.seperate.subjectId,
      subResponseData: this.state.seperate.subResponseData,
      responseId: this.state.seperate.responseId,
      userId: this.state.userId,
    };
    let inherit = {
      userSubjectDataId: this.state.inherit.userSubjectDataId,
      subjectId: this.state.inherit.subjectId,
      subResponseData: this.state.inherit.subResponseData,
      responseId: this.state.inherit.responseId,
      userId: this.state.userId,
    };

    let special = {
      userSubjectDataId: this.state.special.userSubjectDataId,
      subjectId: this.state.special.subjectId,
      subResponseData: this.state.special.subResponseData,
      responseId: this.state.special.responseId,
      userId: this.state.userId,
    };
    let totinptary =[];
    totinptary.push(legally);
    totinptary.push(power);
    totinptary.push(executor);
    totinptary.push(lawsuit);
    totinptary.push(seperate);
    totinptary.push(inherit);
    totinptary.push(special);
   
    // konsole.log(JSON.stringify(inputdata));
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "POST",
      $Service_Url.postaddusersubjectdata, // + "?userId=" + this.state.userId
      totinptary,
      (response) => {
        this.props.dispatchloader(false);
        // konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          // alert("Saved Successfully");
          this.getsubjectForFormLabelId(this.state.userId);
          // this.props.handlenonretireproppopShow();
          // Router.push({
          //   pathname: "./dashboard",
          //   search: "?query=" + response.data.data.member.userId,
          //   state: {
          //     userid: response.data.data.member.userId,
          //     iseditprofile: true,
          //   },
          // });
        } else {
          // alert("Unable to process your request. Please contact support team");
          this.toasterAlert("Unable to process your request. Please contact support team","Warning")
        }
      }
    );
  };


  handleUpdateSubmit = () => {
    let inputdata = JSON.parse(JSON.stringify(this.state));

    let legally = {
      userSubjectDataId: this.state.legally.userSubjectDataId,
      subjectId: this.state.legally.subjectId,
      subResponseData: this.state.legally.subResponseData,
      responseId: this.state.legally.responseId,
      userId: this.state.userId,
    };

    let power = {
      userSubjectDataId: this.state.power.userSubjectDataId,
      subjectId: this.state.power.subjectId,
      subResponseData: this.state.power.subResponseData,
      responseId: this.state.power.responseId,
      userId: this.state.userId,
    };

    let executor = {
      userSubjectDataId: this.state.executor.userSubjectDataId,
      subjectId: this.state.executor.subjectId,
      subResponseData: this.state.executor.subResponseData,
      responseId: this.state.executor.responseId,
      userId: this.state.userId,
    };
    let lawsuit = {
      userSubjectDataId: this.state.lawsuit.userSubjectDataId,
      subjectId: this.state.lawsuit.subjectId,
      subResponseData: this.state.lawsuit.subResponseData,
      responseId: this.state.lawsuit.responseId,
      userId: this.state.userId,
    };
    let seperate = {
      userSubjectDataId: this.state.seperate.userSubjectDataId,
      subjectId: this.state.seperate.subjectId,
      subResponseData: this.state.seperate.subResponseData,
      responseId: this.state.seperate.responseId,
      userId: this.state.userId,
    };
    let inherit = {
      userSubjectDataId: this.state.inherit.userSubjectDataId,
      subjectId: this.state.inherit.subjectId,
      subResponseData: this.state.inherit.subResponseData,
      responseId: this.state.inherit.responseId,
      userId: this.state.userId,
    };

    let special = {
      userSubjectDataId: this.state.special.userSubjectDataId,
      subjectId: this.state.special.subjectId,
      subResponseData: this.state.special.subResponseData,
      responseId: this.state.special.responseId,
      userId: this.state.userId,
    };
    let totinptary =[];
    totinptary.push(legally);
    totinptary.push(power);
    totinptary.push(executor);
    totinptary.push(lawsuit);
    totinptary.push(seperate);
    totinptary.push(inherit);
    totinptary.push(special);
   
    let updatePostData = {
      userId: this.state.userId,
      userSubjects: totinptary
    }

    // konsole.log(JSON.stringify(inputdata));
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "PUT",
      $Service_Url.putSubjectResponse, // + "?userId=" + this.state.userId
      updatePostData,
      (response) => {
        this.props.dispatchloader(false);
        // konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          // alert("Saved Successfully");
          this.getsubjectForFormLabelId(this.state.userId);
          // this.props.handlenonretireproppopShow();
        } else {
          // alert("Unable to process your request. Please contact support team");
          this.toasterAlert("Unable to process your request. Please contact support team","Warning")
        }
      }
    );
  };




  getsubjectForFormLabelId = (newuserid) => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    // legal.formLabelId.map((id, index) => {
    //   let data = [id.id];
      $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, legal.formLabelId, (response) => {
          if (response) {
            const resSubData = response.data.data;

            for (let resObj of resSubData) {
              let label = "label" + resObj.formLabelId;
              formlabelData[label] = resObj.question;
              $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse +newuserid +`/0/0/${formlabelData[label].questionId}` , "", (response) => {
                  if(response){
                    if (response.data.data.userSubjects.length !== 0){
                      this.setState({
                        updateCaregiverSuitabilty: true,
                      })
                      let responseData = response.data.data.userSubjects[0];
                      this.props.dispatchloader(true);
                      for(let i=0;i<formlabelData[label].response.length;i++){
                        if(formlabelData[label].response[i].responseId === responseData.responseId){
                          this.props.dispatchloader(false);
                          if (responseData.responseNature == "Radio"){
                            formlabelData[label].response[i]["checked"] = true;
                          }
                          else if (responseData.responseNature == "Text") {
                            formlabelData[label].response[i]["response"] = responseData.response;
                          }
                        }
                      }
                    }
                    this.props.dispatchloader(false);
                  }
              })
              this.setState({ formlabelData: formlabelData });
            }
          }
        }
      );
    // });
  };



  handleClose = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  handleShow = () => {
    this.setState({
      show: !this.state.show,
    });
    this.fetchLegalTypes();
  };


  fetchLegalTypes = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getLegalType,
      "", (response) => {
        this.props.dispatchloader(false);
        if (response) {
          this.setState({
            ...this.state,
            legalDocType: response.data.data,
          });
        }
      })
  }

  fetchLegalDocument = (newuserid) => {
    let userId = newuserid || this.state.userId
    // konsole.log("userID",userId);
    // this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getLegalDocument + userId + "/0" ,
      "", (response) => {
        if (response) {
          // this.props.dispatchloader(false);
          this.setState({
            ...this.state,
            legalDocument: response.data.data.legalDocuments,
          });
        }
      })
      
  }

  postLegalDoc = () => {
    // konsole.log("handle Click");
    let postlegalData = {
      userId: this.state.userId,
      legalDocument: {
        legalDocTypeId: this.state.legalDocTypeId,
        dateExecuted: $AHelper.getFormattedDate(this.state.dateExecuted),
        docName: this.state.docName,
        docPath: this.state.docPath
      }
    }
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postLegalDocument,
    postlegalData, (response) => {
      this.props.dispatchloader(false);
        // konsole.log("Success res" + JSON.stringify(response));
        if (response) {
            // alert("Information updated successfully");
            this.fetchLegalDocument(this.state.userId);
        }
        else {
            // alert("Unable to process your request. Please contact support team");
            this.toasterAlert("Unable to process your request. Please contact support team","Warning")
        }
    })




      
  }


  toasterAlert(text,type) {
    this.context.setdata({open:true,
      text:text,
      type:type})
  }


  render() {

    // konsole.log("lrgldocument", this.state.legalDocument)

    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0;
          }
        `}</style>

        <a onClick={this.handleShow}>
          <img className="px-2" src="/icons/add-icon.svg" alt="Monthly Expenses" />
        </a>

        <Modal
          show={this.state.show}
          size="lg"
          centered
          onHide={this.handleClose}
          animation="false"
          scrollable={true}
          backdrop="static"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Legal Information</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-5 pt-4">
            <div className="person-content">
              <Form.Group as={Row} className="my-4">
                <Col xs sm="6" lg="4">
                  <Select
                    className="w-100 p-0 custom-select"
                    options={this.state.legalDocType}
                    isSearchable
                    onChange={(event) => this.setState({legalDocTypeId: event.value}
                      )} 
                      placeholder="Documents"
                  />
                </Col>
                <Col xs sm="6" lg="4">
                  <div className="calender-sel">
                    <DatePicker className="form-control" selected={this.state.dateExecuted} dateFormat="MM-dd-yyyy" maxDate={new Date()} onChange={(date) => this.setState({dateExecuted: date})} onChangeRaw={(ev) => {$AHelper.handleRawDate(ev)}}/>
                    <span><img className="user-select-auto" src="/icons/calender-icon.svg" alt="calender"/></span>
                  </div>
                </Col>
                <Col>
                  <img
                    className="mt-1"
                    src="/icons/add-icon.svg"
                    alt="health Insurance"
                    onClick={this.postLegalDoc}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-4">
                <Col lg="8">
                  <Table  bordered>
                    <thead>
                      <tr>
                        <td>Documents</td>
                        <td>Date Executed</td>
                      </tr>
                    </thead>
                    
                    <tbody className="my-4">
                    { this.state.legalDocument && 
                      this.state.legalDocument.map((l,index)=>{
                        return(
                          <tr key={index}>
                            <td>{l.legalDocType}</td>
                            <td>{$AHelper.getDateFromString(l.dateExecuted)}</td>
                        </tr>
                        )
                      })
                    }
                    </tbody>
                  </Table>
                </Col>
              </Form.Group>
              <Col className="border" lg="10">
                <Form.Group as={Row} className="p-4">
                  <Row className="d-flex ">
                    <Col lg="7">
                      <p>
                        {this.state.formlabelData.label445 &&
                          this.state.formlabelData.label445.question}
                      </p>
                    </Col>
                    <Col lg="3" className="">
                    {this.state.formlabelData.label445 &&
                    this.state.formlabelData.label445.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Control type="text" name="legally"  onChange={(e) => {
                                    this.handleChange(e);
                                  }} className="w-100" id={response.responseId} defaultValue={response.response} />
                          </>
                        );
                      }
                    )}
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg="7">
                      <p>
                        {this.state.formlabelData.label446 &&
                          this.state.formlabelData.label446.question}
                      </p>
                    </Col>
                    <Col
                      lg="3"
                      className="d-flex align-items-center justify-content-end "
                    >
                      <div>
                        {this.state.formlabelData.label446 &&
                          this.state.formlabelData.label446.response.map(
                            (response) => {
                              return (
                                <>
                                 <Form.Check
                                  className="left-radio me-3"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  name="power"
                                  label={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                                </>
                              );
                            }
                          )}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg="7">
                      <p>
                        {this.state.formlabelData.label447 &&
                          this.state.formlabelData.label447.question}
                      </p>
                    </Col>
                    <Col lg="3">
                      <div className="d-flex align-items-center justify-content-end">
                        {this.state.formlabelData.label447 &&
                          this.state.formlabelData.label447.response.map(
                            (response) => {
                              return (
                                <>
                                 <Form.Check
                                  className = "left-radio me-3"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  name="executor"
                                  label={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                                </>
                              );
                            }
                          )}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg="7">
                      <p>
                        {this.state.formlabelData.label448 &&
                          this.state.formlabelData.label448.question}
                      </p>
                    </Col>
                    <Col lg="3">
                      <div className="d-flex align-items-center justify-content-end">
                        {this.state.formlabelData.label448 &&
                          this.state.formlabelData.label448.response.map(
                            (response) => {
                              return (
                                <>
                                     <Form.Check
                                  className="left-radio me-3"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  name="lawsuit"
                                  label={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                                </>
                              );
                            }
                          )}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg="7">
                      <p>
                        {this.state.formlabelData.label449 &&
                          this.state.formlabelData.label449.question}
                      </p>
                    </Col>
                    <Col lg="3">
                      <div className="d-flex align-items-center justify-content-end">
                        {this.state.formlabelData.label449 &&
                          this.state.formlabelData.label449.response.map(
                            (response) => {
                              return (
                                <>
                                   <Form.Check
                                  className="left-radio me-3"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  name="seperate"
                                  label={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                                </>
                              );
                            }
                          )}
                      </div>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>

              <Row className="my-4">
                <Col className="border-0" lg="6">
                  <p>
                    {this.state.formlabelData.label450 &&
                      this.state.formlabelData.label450.question}
                  </p>
                </Col>
                <Col className="" lg="4">
                {this.state.formlabelData.label450 &&
                    this.state.formlabelData.label450.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Control type="text" name="inherit"  onChange={(e) => {
                                    this.handleChange(e);
                                  }} className="w-100" id={response.responseId} defaultValue={response.response} />
                          </>
                        );
                      }
                    )}
                </Col>
              </Row>
              <Row className="mb-4">
                <Col lg="7">
                  <p>
                    {this.state.formlabelData.label451 &&
                      this.state.formlabelData.label451.question}
                  </p>
                </Col>
                <Col lg="3">
                  <div className="d-flex align-items-center ">
                    {this.state.formlabelData.label451 &&
                      this.state.formlabelData.label451.response.map(
                        (response) => {
                          return (
                            <>
                                <Form.Check
                                  className="left-radio me-3"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  name="special"
                                  label={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col xs md="12">
                  <Row className="mb-4">
                    <Col xs md="4">
                      <div className="d-flex align-items-center border py-2">
                        <div className="flex-grow-1 ms-2">
                          Fiduciary Assignment
                        </div>
                        <div className="border-start"><FiduciaryAssignment /></div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col xs md="12">
                  <Row className="mb-4">
                    <Col xs md="4">
                      <div className="d-flex align-items-center border py-2">
                        <div className="flex-grow-1 ms-2">
                        LIVING WILL DETAILS
                        </div>
                        <div className="border-start"><LivingWill /></div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button className="theme-btn"onClick={(this.state.updateCaregiverSuitabilty)?this.handleUpdateSubmit:this.handlesubmit }>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state.main });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Legal);