import React, { Component } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb } from 'react-bootstrap';
import Select from 'react-select';
import Address from "../components/address"
import Contact from "../components/contact"
import { $CommonServiceFn } from "./network/Service";
import { $AHelper } from '../components/control/AHelper';
import { $Service_Url } from "./network/UrlPath";
import { caregiver } from "./control/Constant";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import konsole from './control/Konsole';
import {globalContext} from "../pages/_app"

export class caregiversuitability extends Component {
  static contextType = globalContext
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      fatherLive: true,
      motherLive: true,
      formlabelData: {},
      // userId: "",
      // userSubjectDataId: 0,
      // subjectId: 0,
      // subResponseData: "string",
      // responseId: 0,
      caregiver:{
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,

      },
     livein:{
      userId: "",
      userSubjectDataId: 0,
      subjectId: 0,
      subResponseData: "string",
      responseId: 0,
     },

     distance:{
      userId: "",
      userSubjectDataId: 0,
      subjectId: 0,
      subResponseData: "string",
      responseId: 0,
     },


    };
  }
  handleClose = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  handleShow = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  fradioValue = (event) => {
    const radioName = event.target.name;
    const radioValue = event.target.value;
    konsole.log(event.target.value);
    if (radioName == "fatherLive" && radioValue == "Yes") {
      this.setState({ ...this.state, [radioName]: true });
    } else {
      this.setState({ ...this.state, [radioName]: false });
    }
  };
  mradioValue = (event) => {
    const radioName = event.target.name;
    const radioValue = event.target.value;
    konsole.log(event.target.name);
    if (radioName == "motherLive" && radioValue == "Yes") {
      this.setState({ ...this.state, [radioName]: true });
    } else {
      this.setState({ ...this.state, [radioName]: false });
    }
  };

  componentDidMount() {
      let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
      this.setState({
        userId: newuserid,
      });
    this.getsubjectForFormLabelId();
  }

  handleChange = (e) => {
    const eventId = e.target.id;
    const eventValue = e.target.value;
   const eventName = e.target.name;
 

   if(eventName=="livein"){
    this.setState({
      ...this.state,
      livein:{ 
      userSubjectDataId: 0,
        responseId: eventId,
        subResponseData: eventValue,
         subjectId :  this.state.formlabelData.label342 &&
                      this.state.formlabelData.label342.questionId}
    
    })}
   else if(eventName=="livein"){
      this.setState({
        ...this.state,
        livein:{ 
        userSubjectDataId: 0,
          responseId: eventId,
          subResponseData: eventValue,
           subjectId :  this.state.formlabelData.label342 &&
                        this.state.formlabelData.label342.questionId}
      
      })
  }else if(eventName=="caregiver"){

      this.setState({
        ...this.state,
        caregiver:{
         
        userSubjectDataId: 0,
         responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label343 &&
            this.state.formlabelData.label343.questionId,
        }})
       
  }

  else if(eventName=="distance"){

    this.setState({
      ...this.state,
      distance:{
       
      userSubjectDataId: 0,
       responseId: eventId,
        subResponseData: eventValue,
        subjectId:
          this.state.formlabelData.label344 &&
          this.state.formlabelData.label344.questionId,
      }})
     
}
  // else{
  //    this.setState({
  //      ...this.state,
  //      responseId: eventId,
  //      subResponseData: eventValue,
  //    });
  // }


    
  };

  handlesubmit = () => {
    let inputdata = JSON.parse(JSON.stringify(this.state));

    let caregiver = {
      userSubjectDataId: this.state.caregiver.userSubjectDataId,
      subjectId: this.state.caregiver.subjectId,
      subResponseData: this.state.caregiver.subResponseData,
      responseId: this.state.caregiver.responseId,
      userId: this.state.userId,
    };

    let livein = {
      userSubjectDataId: this.state.livein.userSubjectDataId,
      subjectId: this.state.livein.subjectId,
      subResponseData: this.state.livein.subResponseData,
      responseId: this.state.livein.responseId,
      userId: this.state.userId,
    };

    let distance = {
      userSubjectDataId: this.state.distance.userSubjectDataId,
      subjectId: this.state.distance.subjectId,
      subResponseData: this.state.distance.subResponseData,
      responseId: this.state.distance.responseId,
      userId: this.state.userId,
    };
    let totinptary =[];
    totinptary.push(caregiver);
    totinptary.push(livein);
    totinptary.push(distance);
   
    konsole.log(JSON.stringify(inputdata));
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "POST",
      $Service_Url.postaddusersubjectdata, // + "?userId=" + this.state.userId
      totinptary,
      (response) => {
        this.props.dispatchloader(false);
        konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          // alert("Saved Successfully");
          this.toasterAlert("Saved Successfully","Success")
          // this.props.handlenonretireproppopShow();
        } else {
          // alert("Unable to process your request. Please contact support team");
          this.toasterAlert("Unable to process your request. Please contact support team","Warning")
        }
      }
    );
  };

  getsubjectForFormLabelId = () => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    caregiver.formLabelId.map((id, index) => {
      let data = [id.id];
      konsole.log("id", data);
      $CommonServiceFn.InvokeCommonApi(
        "POST",
        $Service_Url.getsubjectForFormLabelId,
        data,
        (response) => {
          if (response) {
            konsole.log("Success res", response);
            if (id.id == response.data.data[0].formLabelId) {
              let label = "label" + response.data.data[0].formLabelId;
              // let response = response.data.data[0].
              formlabelData[label] = response.data.data[0].question;
              konsole.log("formdataatconsole", formlabelData);
              this.setState({ formlabelData: formlabelData });
              this.props.dispatchloader(false);
            }
          } else {
            // alert(
            //   "Unable to process your request. Please contact support team"
            // );
            this.toasterAlert( "Unable to process your request. Please contact support team","Warning")
          }
        }
      );
    });
  };
  toasterAlert(test,type) {
    this.context.setdata($AHelper.toasterValueFucntion(true,test,type))
  }

  render() {
    const State = [{ value: "", label: "" }];

    konsole.log(
      "Heeellllllllllll" + this.state.responseId,
      this.state.subResponseData
    );

    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            max-width: 56.25rem;
            margin: 1.75rem auto;
          }
        `}</style>
        <a onClick={this.handleShow}>
          <img src="/icons/add-icon.svg" alt="Health Insurance" />
        </a>

        <Modal
          size="lg"
          show={this.state.show}
          centered
          onHide={this.handleClose}
          animation="false"
          id="careGiver"
          backdrop="static"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Caregiver Suitability</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-3 pt-4">
            <Row className="m-0 mb-3">
              <Col xs sm="12" lg="10" className="ps-0" id="careGiver1">
                <label className="">
                  {this.state.formlabelData.label342 &&
                    this.state.formlabelData.label342.question}
                </label>
                <div className="d-flex justify-content-center align-items-center">
                  {this.state.formlabelData.label342 &&
                    this.state.formlabelData.label342.response.map(
                      (response) => {
                        return (
                          <>
                            <div className="d-flex justify-content-center align-items-center">
                              <div
                                key="checkbox8"
                                className="me-4 pe-3 mb-0 d-flex align-items-center"
                              >
                                <Form.Check
                                  className="chekspace"
                                  type="radio"
                                  id={response.responseId}
                                 
                                  value={response.response}
                                  name="livein"
                                  label={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                />
                              </div>
                            </div>
                          </>
                        );
                      }
                    )}
                </div>
              </Col>
            </Row>
            <Row className="m-0 mb-3">
              <Col xs sm="12" lg="10" className="ps-0" id="careGiver2">
                <label className="">
                  {this.state.formlabelData.label343 &&
                    this.state.formlabelData.label343.question}
                </label>
                <div className="d-flex justify-content-center align-items-center">
                  {this.state.formlabelData.label343 &&
                    this.state.formlabelData.label343.response.map(
                      (response) => {
                        return (
                          <>
                            <div className="d-flex justify-content-center align-items-center">
                              <div
                                key="checkbox8"
                                className="me-4 pe-3 mb-0 d-flex align-items-center"
                              >
                                <Form.Check
                                  className="chekspace"
                                  type="radio"
                                  id={response.responseId}
                                
                                  name="caregiver"
                                  value={response.response}
                                  label={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                />
                              </div>
                            </div>
                          </>
                        );
                      }
                    )}
                </div>
              </Col>
            </Row>
            <Row className="m-0 mb-3">
              <Col xs sm="12" lg="10" className="ps-0" id="careGiver3">
                <label className="">
                  {this.state.formlabelData.label344 &&
                    this.state.formlabelData.label344.question}
                </label>
                <div className="d-flex justify-content-center align-items-center">
                {this.state.formlabelData.label344 &&
                    this.state.formlabelData.label344.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Control type="text" name="distance"  onChange={(e) => {
                                    this.handleChange(e);
                                  }} className="w-100" id={response.responseId} value={response.response} />
                          </>
                        );
                      }
                    )}
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button className="theme-btn" onClick={this.handlesubmit}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });


const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(caregiversuitability);