import React, { Component } from "react";
import {
  Button,
  Modal,
  Table,
  Form,
  Tab,
  Row,
  Col,
  Container,
  Nav,
  Dropdown,
  Collapse,
  Breadcrumb,
} from "react-bootstrap";
import { $CommonServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import { caregiver } from "./control/Constant";
import { $AHelper } from "../components/control/AHelper";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import { globalContext } from "../pages/_app";

import AlertToaster from "./control/AlertToaster";

export class caregiversuitability extends Component {
  static contextType = globalContext;
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      fatherLive: true,
      motherLive: true,
      formlabelData: {},
      disable:false,
      updateCaregiverSuitabilty: false,
      // userId: "",
      // userSubjectDataId: 0,
      // subjectId: 0,
      // subResponseData: "string",
      // responseId: 0,
      caregiver: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      livein: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },

      distance: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
    };
  }

  handleValidate = () => {};

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

    // konsole.log(event.target.value);
    if (radioName == "fatherLive" && radioValue == "Yes") {
      this.setState({ ...this.state, [radioName]: true });
    } else {
      this.setState({ ...this.state, [radioName]: false });
    }
  };
  mradioValue = (event) => {
    const radioName = event.target.name;
    const radioValue = event.target.value;
    // konsole.log(event.target.name);
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
    this.getsubjectForFormLabelId(newuserid);
  }

  handleChange = (e) => {
    const eventId = e.target.id;
    const eventValue = e.target.value;
    const eventName = e.target.name;

    konsole.log("userDataId", e);

    // konsole.log("datashownatcaregiver",this.state.formlabelData)
    if (eventName == "livein") {
      this.setState({
        ...this.state,
        livein: {
          userSubjectDataId: this.state.formlabelData.label342
            ? this.state.formlabelData.label342.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label342 &&
            this.state.formlabelData.label342.questionId,
        },
      });
    }
    //  else if(eventName=="livein"){
    //     this.setState({
    //       ...this.state,
    //       livein:{
    //       userSubjectDataId: 0,
    //         responseId: eventId,
    //         subResponseData: eventValue,
    //          subjectId :  this.state.formlabelData.label342 &&
    //                       this.state.formlabelData.label342.questionId}

    //     })
    // }
    else if (eventName == "caregiver") {
      this.setState({
        ...this.state,
        caregiver: {
          userSubjectDataId: this.state.formlabelData.label343
            ? this.state.formlabelData.label343.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label343 &&
            this.state.formlabelData.label343.questionId,
        },
      });
    } else if (eventName == "distance") {
      this.setState({
        ...this.state,
        distance: {
          userSubjectDataId: this.state.formlabelData.label344
            ? this.state.formlabelData.label344.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label344 &&
            this.state.formlabelData.label344.questionId,
        },
      });
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
    this.setState({disable:true})
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
    let totinptary = [];
    // totinptary.push(caregiver);
    // totinptary.push(livein);
    // totinptary.push(distance);

    if (
      caregiver.subjectId !== 0 &&
      caregiver.subResponseData !== "" &&
      caregiver.responseId !== 0
    ) {
      totinptary.push(caregiver);
    }
    if (
      livein.subjectId !== 0 &&
      livein.subResponseData !== "" &&
      livein.responseId !== 0
    ) {
      totinptary.push(livein);
    }
    if (
      distance.subjectId !== 0 &&
      distance.subResponseData !== "" &&
      distance.responseId !== 0
    ) {
      totinptary.push(distance);
    }

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
          AlertToaster.success("Data saved successfully");
          // alert("Saved Successfully");
          // this.props.handlenonretireproppopShow();
          this.handleClose();
          this.getsubjectForFormLabelId(this.state.userId);
        } else {
          // alert(Msg.ErrorMsg);
          this.handleClose();
        }
      }
    );
  };

  handleUpdateSubmit = () => {
    this.setState({disable:true})
    let inputdata = JSON.parse(JSON.stringify(this.state));

    let caregiver = {
      userSubjectDataId: this.state.caregiver.userSubjectDataId,
      subjectId: this.state.caregiver.subjectId,
      subResponseData: this.state.caregiver.subResponseData,
      responseId: this.state.caregiver.responseId,
      userId: this.state.userId,
    };

    konsole.log("categiver", caregiver);
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
    let totinptary = [];
    // totinptary.push(caregiver);
    // totinptary.push(livein);
    // totinptary.push(distance);

    if (
      caregiver.subjectId !== 0 &&
      caregiver.subResponseData !== "" &&
      caregiver.responseId !== 0
    ) {
      totinptary.push(caregiver);
    }
    if (
      livein.subjectId !== 0 &&
      livein.subResponseData !== "" &&
      livein.responseId !== 0
    ) {
      totinptary.push(livein);
    }
    if (
      distance.subjectId !== 0 &&
      distance.subResponseData !== "" &&
      distance.responseId !== 0
    ) {
      totinptary.push(distance);
    }

    let updatePostData = {
      userId: this.state.userId,
      userSubjects: totinptary,
    };

    konsole.log(JSON.stringify(inputdata));
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "PUT",
      $Service_Url.putSubjectResponse, // + "?userId=" + this.state.userId
      updatePostData,
      (response) => {
        this.setState({disable:false})
        this.props.dispatchloader(false);
        konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          AlertToaster.success("Data updated successfully");
          // alert("Saved Successfully");
          // this.props.handlenonretireproppopShow();
          this.handleClose();
          this.getsubjectForFormLabelId(this.state.userId);
        } else {
          // alert(Msg.ErrorMsg);
          this.handleClose();
        }
      }
    );
  };

  getsubjectForFormLabelId = (newuserid) => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "POST",
      $Service_Url.getsubjectForFormLabelId,
      caregiver,
      (response) => {
        if (response) {
          this.setState({disable:false})
          for(let resObj of response.data.data) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = resObj.question;
            konsole.log("datashownatcaregiver formlabelData", formlabelData);
            $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, "",
              (response) => {
                if (response) {
                  if (response.data.data.userSubjects.length !== 0) {
                    this.setState({
                      updateCaregiverSuitabilty: true,
                    });
                    let responseData = response.data.data.userSubjects[0];
                    this.props.dispatchloader(true);
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
                        this.props.dispatchloader(false);
                        if (responseData.responseNature == "Radio") {
                          formlabelData[label].response[i]["checked"] = true;
                          formlabelData[label]["userSubjectDataId"] =
                            responseData.userSubjectDataId;
                        } else if (responseData.responseNature == "Text") {
                          formlabelData[label].response[i]["response"] =
                            responseData.response;
                          formlabelData[label]["userSubjectDataId"] =
                            responseData.userSubjectDataId;
                        }
                      }
                    }
                  }
                  this.props.dispatchloader(false);
                }
              }
            );
            this.setState({ formlabelData: formlabelData });
          }
        } else {
          // alert(Msg.ErrorMsg);
          this.toasterAlert(Msg.ErrorMsg, "Warning");
        }
      }
    );
  };
  toasterAlert(test, type) {
    this.context.setdata($AHelper.toasterValueFucntion(true, test, type));
  }

  render() {
    const State = [{ value: "", label: "" }];
    konsole.log("state ar care", this.state);
    // konsole.log(
    //   "Heeellllllllllll" + this.state.responseId,
    //   this.state.subResponseData
    // );

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
          <img
            src="/icons/add-icon.svg"
            className="pb-1 px-1"
            alt="Health Insurance"
          />
        </a>

        <Modal
          size="md"
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
          <Modal.Body>
            <Row className="mb-3">
              <Col xs sm="12" lg="12"  id="careGiver1">
                <label className="">
                  {this.state.formlabelData.label342 &&
                    this.state.formlabelData.label342.question}
                </label>
                <div className="d-flex justify-content-start align-items-center">
                  {this.state.formlabelData.label342 &&
                    this.state.formlabelData.label342.response.map(
                      (response) => {
                        return (
                          <>
                             <div key="checkbox8">                                
                             <Form.Check
                                  className="chekspace"
                                  type="radio"
                                  id={response.responseId}
                                  userSubjectDataId={response.userSubjectDataId}
                                  value={response.response}
                                  name="livein"
                                  label={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </div>  
                            {/* </div> */}
                          </>
                        );
                      }
                    )}
                  {/* <button>clear</button> */}
                </div>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs sm="12" lg="10"  id="careGiver2">
                <label className="">
                  {this.state.formlabelData.label343 &&
                    this.state.formlabelData.label343.question}
                </label>
                <div className="d-flex justify-content-start align-items-center">
                  {this.state.formlabelData.label343 &&
                    this.state.formlabelData.label343.response.map(
                      (response) => {
                        return (
                          <>
                              <div
                                key="checkbox8"
                              >
                                <Form.Check
                                  className="chekspace"
                                  type="radio"
                                  id={response.responseId}
                                  userSubjectDataId={response.userSubjectDataId}
                                  name="caregiver"
                                  value={response.response}
                                  label={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </div>
                          </>
                        );
                      }
                    )}
                </div>
              </Col>
            </Row>
            {/* <Row className="m-0 mb-3">
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
                                  }} className="w-100" id={response.responseId} userSubjectDataId={response.userSubjectDataId} defaultValue={response.response} />
                          </>
                        );
                      }
                    )}
                </div>
              </Col>
            </Row> */}
            <div className="d-flex justify-content-end">
              <Button
                className="theme-btn"
                onClick={
                  this.state.updateCaregiverSuitabilty ? this.handleUpdateSubmit : this.handlesubmit }
                  disabled={this.state.disable == true ? true : false}
              >
                Save
              </Button>
            </div>
          </Modal.Body>
          
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
