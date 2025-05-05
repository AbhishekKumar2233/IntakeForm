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
import Select from "react-select";

import { $CommonServiceFn } from "./network/Service";

import { $Service_Url } from "./network/UrlPath";
import { housingChar } from "./control/Constant";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import { globalContext } from "../pages/_app";
import { $AHelper } from "./control/AHelper";
import AlertToaster from "./control/AlertToaster";

export class housingcharacteristics extends Component {
  static contextType = globalContext;
  constructor(props) {
    super(props);
    this.state = {
      pagerender: true,
      show: false,
      nohouse1: false,
      disable:false,
      formlabelData: {},
      updateCaregiverSuitabilty: false,
      primaryUserDetails: {},
      eventValueChecked: 1,
      nohouse: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },

      split: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },

      year: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      checked: "",
      square: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      yard: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      front: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      backyard: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      navigate: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      widths: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      hallway: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      laundry: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      bedroom: {
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
      show: false,
    });
  };

  handleShow = () => {
    this.setState( { show: true, }, () => {
        if(Object.keys(this.state.formlabelData).length === 0 ) this.getsubjectForFormLabelId(this.state.userId);
      }
    );
  };

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let primaryUserDetails =
      JSON.parse(sessionStorage.getItem("userDetailOfPrimary")) || {};
    this.setState({
      userId: newuserid,
      primaryUserDetails: primaryUserDetails,
    });
  }

  updateLaundrySubResponseData = () => {
    const bedrooma = { ...this.state.bedroom };
    const laundrya = { ...this.state.laundry };
    bedrooma.subResponseData = '';
    laundrya.subResponseData = '';
    this.setState({ bedroom:bedrooma });
    this.setState({ laundry:laundrya });
    const laundryValue = document.querySelector(`input[name="laundry"]`);
    const bedroomValue = document.querySelector(`input[name="bedroom"]`);
    if(bedroomValue !==null && bedroomValue !==undefined){
      bedroomValue.value = "";
    }
    if(laundryValue !==null && laundryValue !==undefined ){
      laundryValue.value = "";
    }
    konsole.log('formlabelDataa122')
  };

  handleChange = (e) => {
    const eventId = e.target.id;
    const eventValue = e.target.value;
    const eventName = e.target.name;
    if (eventName == "nohouse" && (eventValue == "2" || eventValue == "3" || eventValue == "More")) {
      this.setState({
        ...this.state,
        nohouse1: true,
        nohouse: {
          userSubjectDataId: this.state.formlabelData?.label332?.userSubjectDataId ?? 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
          this.state.formlabelData.label332 &&
          this.state.formlabelData.label332.questionId,
        },
      });
      this.updateLaundrySubResponseData()
    } else if (eventName == "nohouse") {
      this.setState({
        ...this.state,
        nohouse1: false,
        nohouse: {
          userSubjectDataId: this.state.formlabelData?.label332?.userSubjectDataId ?? 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
          this.state.formlabelData.label332 &&
          this.state.formlabelData.label332.questionId,
        },
      });
      this.updateLaundrySubResponseData()
    }

    if (eventName == "year") {
      if ($AHelper.isNumberRegex(eventValue)) {
        this.setState({
          ...this.state,
          year: {
            userSubjectDataId: this.state.formlabelData.label330
              ? this.state.formlabelData.label330.userSubjectDataId
              : 0,
            responseId: eventId,
            subResponseData: eventValue,
            subjectId:
              this.state.formlabelData.label330 &&
              this.state.formlabelData.label330.questionId,
          },
        });
      }
      else{
        e.target.value=""
      }
    }

    if (eventName == "split") {
      this.setState({
        ...this.state,
        split: {
          userSubjectDataId: this.state.formlabelData.label335
            ? this.state.formlabelData.label335.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label335 &&
            this.state.formlabelData.label335.questionId,
        },
      });
    } else if (eventName == "square") {
      this.setState({
        ...this.state,
        square: {
          userSubjectDataId: this.state.formlabelData.label331
            ? this.state.formlabelData.label331.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label331 &&
            this.state.formlabelData.label331.questionId,
        },
      });
    } else if (eventName == "yard") {
      this.setState({
        ...this.state,
        yard: {
          userSubjectDataId: this.state.formlabelData.label336
            ? this.state.formlabelData.label336.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label336 &&
            this.state.formlabelData.label336.questionId,
        },
      });
    } else if (eventName == "front") {
      this.setState({
        ...this.state,
        front: {
          userSubjectDataId: this.state.formlabelData.label337
            ? this.state.formlabelData.label337.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label337 &&
            this.state.formlabelData.label337.questionId,
        },
      });
    } else if (eventName == "backyard") {
      this.setState({
        ...this.state,
        backyard: {
          userSubjectDataId: this.state.formlabelData.label338
            ? this.state.formlabelData.label338.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label338 &&
            this.state.formlabelData.label338.questionId,
        },
      });
    } else if (eventName == "navigate") {
      this.setState({
        ...this.state,
        navigate: {
          userSubjectDataId: this.state.formlabelData.label339
            ? this.state.formlabelData.label339.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label339 &&
            this.state.formlabelData.label339.questionId,
        },
      });
    } else if (eventName == "widths") {
      this.setState({
        ...this.state,
        widths: {
          userSubjectDataId: this.state.formlabelData.label340
            ? this.state.formlabelData.label340.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label340 &&
            this.state.formlabelData.label340.questionId,
        },
      });
    } else if (eventName == "hallway") {
      this.setState({
        ...this.state,
        hallway: {
          userSubjectDataId: this.state.formlabelData.label341
            ? this.state.formlabelData.label341.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label341 &&
            this.state.formlabelData.label341.questionId,
        },
      });
    } else if (eventName == "laundry") {
      this.setState({
        ...this.state,
        laundry: {
          userSubjectDataId: this.state.formlabelData.label333
            ? this.state.formlabelData.label333.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label333 &&
            this.state.formlabelData.label333.questionId,
        },
      });
    } else if (eventName == "bedroom") {
      this.setState({
        ...this.state,
        bedroom: {
          userSubjectDataId: this.state.formlabelData.label334
            ? this.state.formlabelData.label334.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label334 &&
            this.state.formlabelData.label334.questionId,
        },
      });
    }
  };

  handleUpdateSubmit = () => {
    this.setState({disable: true})
    let inputdata = JSON.parse(JSON.stringify(this.state));

    let nohouse = {
      userSubjectDataId: this.state.nohouse.userSubjectDataId,
      subjectId: this.state.nohouse.subjectId,
      subResponseData: this.state.nohouse.subResponseData,
      responseId: this.state.nohouse.responseId,
      userId: this.state.userId,
    };

    let split = {
      userSubjectDataId: this.state.split.userSubjectDataId,
      subjectId: this.state.split.subjectId,
      subResponseData: this.state.split.subResponseData,
      responseId: this.state.split.responseId,
      userId: this.state.userId,
    };

    let year = {
      userSubjectDataId: this.state.year.userSubjectDataId,
      subjectId: this.state.year.subjectId,
      subResponseData: this.state.year.subResponseData,
      responseId: this.state.year.responseId,
      userId: this.state.userId,
    };
    let square = {
      userSubjectDataId: this.state.square.userSubjectDataId,
      subjectId: this.state.square.subjectId,
      subResponseData: this.state.square.subResponseData,
      responseId: this.state.square.responseId,
      userId: this.state.userId,
    };
    let yard = {
      userSubjectDataId: this.state.yard.userSubjectDataId,
      subjectId: this.state.yard.subjectId,
      subResponseData: this.state.yard.subResponseData,
      responseId: this.state.yard.responseId,
      userId: this.state.userId,
    };

    let front = {
      userSubjectDataId: this.state.front.userSubjectDataId,
      subjectId: this.state.front.subjectId,
      subResponseData: this.state.front.subResponseData,
      responseId: this.state.front.responseId,
      userId: this.state.userId,
    };

    let backyard = {
      userSubjectDataId: this.state.backyard.userSubjectDataId,
      subjectId: this.state.backyard.subjectId,
      subResponseData: this.state.backyard.subResponseData,
      responseId: this.state.backyard.responseId,
      userId: this.state.userId,
    };

    let navigate = {
      userSubjectDataId: this.state.navigate.userSubjectDataId,
      subjectId: this.state.navigate.subjectId,
      subResponseData: this.state.navigate.subResponseData,
      responseId: this.state.navigate.responseId,
      userId: this.state.userId,
    };

    let widths = {
      userSubjectDataId: this.state.widths.userSubjectDataId,
      subjectId: this.state.widths.subjectId,
      subResponseData: this.state.widths.subResponseData,
      responseId: this.state.widths.responseId,
      userId: this.state.userId,
    };
    let hallway = {
      userSubjectDataId: this.state.hallway.userSubjectDataId,
      subjectId: this.state.hallway.subjectId,
      subResponseData: this.state.hallway.subResponseData,
      responseId: this.state.hallway.responseId,
      userId: this.state.userId,
    };
    let laundry = {
      userSubjectDataId: this.state.laundry.userSubjectDataId,
      subjectId: this.state.laundry.subjectId,
      subResponseData: this.state.laundry.subResponseData,
      responseId: this.state.laundry.responseId,
      userId: this.state.userId,
    };
    let bedroom = {
      userSubjectDataId: this.state.bedroom.userSubjectDataId,
      subjectId: this.state.bedroom.subjectId,
      subResponseData: this.state.bedroom.subResponseData,
      responseId: this.state.bedroom.responseId,
      userId: this.state.userId,
    };

    konsole.log('laundrylaundryaaaaaa',laundry,bedroom)
    let totinptary = [];

    // totinptary.push(year);
    // totinptary.push(square);
    // totinptary.push(nohouse);
    // totinptary.push(yard);
    // totinptary.push(split);
    // totinptary.push(front);
    // totinptary.push(backyard);
    // totinptary.push(navigate);
    // totinptary.push(widths);
    // totinptary.push(hallway);
    // totinptary.push(laundry);
    // totinptary.push(bedroom);

    if (year.subjectId !== 0 && year.responseId !== 0) {
      totinptary.push(year);
    }
    if (square.subjectId !== 0 && square.responseId !== 0) {
      totinptary.push(square);
    }
    if (nohouse.subjectId !== 0 && nohouse.subResponseData !== "" && nohouse.responseId !== 0) {
      totinptary.push(nohouse);
    }
    if (yard.subjectId !== 0 &&  yard.responseId !== 0) {
      totinptary.push(yard);
    }
    if (split.subjectId !== 0 && split.subResponseData !== "" && split.responseId !== 0) {
      totinptary.push(split);
    }
    if (front.subjectId !== 0 && front.responseId !== 0) {
      totinptary.push(front);
    }
    if (backyard.subjectId !== 0 && backyard.responseId !== 0) {
      totinptary.push(backyard);
    }
    if (navigate.subjectId !== 0 && navigate.responseId !== 0) {
      totinptary.push(navigate);
    }
    if (widths.subjectId !== 0 &&  widths.responseId !== 0) {
      totinptary.push(widths);
    }
    if (hallway.subjectId !== 0 &&  hallway.responseId !== 0) {
      totinptary.push(hallway);
    }
    if (this.state.nohouse1 == true) {
      if (laundry.subjectId !== 0 &&  laundry.responseId !== 0) {
        totinptary.push(laundry);
      }
      if (bedroom.subjectId !== 0 &&  bedroom.responseId !== 0) {
        totinptary.push(bedroom);
      }
    }

    let updatePostData = {
      userId: this.state.userId,
      userSubjects: totinptary,
    };

    konsole.log('updatePostDataupdatePostData',updatePostData)
    konsole.log(JSON.stringify(updatePostData));
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
          this.handleClose();
          this.getsubjectForFormLabelId(this.state.userId);
          // this.props.handlenonretireproppopShow();
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
    $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.getsubjectForFormLabelId,housingChar, (response) => {
        if (response) {
          this.setState({disable: false})
          const subjectResponse = response.data.data;
          for (let resObj of subjectResponse) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = resObj.question;
            $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getSubjectResponse +newuserid +`/0/0/${formlabelData[label].questionId}`,"",(response) => {
                if (response) {
                  konsole.log("dsfjhsdjgfjdfghdhfdgshjghgsdf", formlabelData[label].questionId, " ", response.data.data);
                  this.setState({ eventValueChecked: response.data.data.userSubjects[0]?.response, });

                  if (response.data.data.userSubjects.length !== 0) {
                    let responseData = response.data.data.userSubjects[0];
                    this.props.dispatchloader(true);

                    for ( let i = 0; i < formlabelData[label].response.length; i++ ) {
                      if (formlabelData[label].response[i].responseId ===responseData.responseId ) {
                        if (responseData.responseNature == "Radio") {
                          formlabelData[label].response[i]["checked"] = true;
                          formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                          if(formlabelData[label].questionId == 32 && ( responseData.responseId == 59 || responseData.responseId == 60 || responseData.responseId == 61 )){ 
                            this.setState({nohouse1: true})
                          } 
                        } else if (responseData.responseNature == "Text") {
                          formlabelData[label].response[i]["response"] = responseData.response;
                          formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        }
                      }
                      if (i === formlabelData[label].response.length - 1) {
                        this.props.dispatchloader(false);
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
          this.toasterAlert(Msg.ErrorMsg, "Warning");
        }
      }
    );
  };

  toasterAlert(text, type) {
    this.context.setdata({ open: true, text: text, type: type });
  }

  render() {
    konsole.log('laundrylaundry',this.state.laundry)
    // const State = [{ value: "", label: "" }];
    konsole.log("formlabhhhheldatasadasdasdsa", this.state);
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
          <img src="/icons/add-icon.svg" className="pb-1 px-1" alt="Health Insurance"
          />
        </a>

        <Modal
          size="lg"
          show={this.state.show}
          centered
          onHide={this.handleClose}
          animation="false"
          id="housingCharacteristics"
          backdrop="static"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>
              Housing Characteristics 
              {/* -{" "}
              {Object.entries(this.state.primaryUserDetails).length > 0
                ? this.state.primaryUserDetails?.memberName
                : ""} */}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <Col xs lg="7"> */}
              <Row className="mb-3">
                <Col xs sm="12" lg="12"  id="housingChar1">
                  <label className="mb-1">
                    {this.state.formlabelData.label330 &&
                      this.state.formlabelData.label330.question}
                  </label>
                  <div className="d-flex justify-content-center align-items-center">
                    {this.state.formlabelData.label330 &&
                      this.state.formlabelData.label330.response.map(
                        (response) => {
                          konsole.log("responseresponse", response);
                          return (
                            <>
                              <Form.Control
                                type="text"
                                name="year"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                className="w-100"
                                id={response.responseId}
                                maxLength={4}
                                defaultValue={response.response}
                                pattern="\d+"
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs sm="12" lg="12"  id="housingChar2">
                  <label className="mb-1">
                    {this.state.formlabelData.label331 &&
                      this.state.formlabelData.label331.question}
                  </label>
                  <div className="d-flex justify-content-center align-items-center">
                    {this.state.formlabelData.label331 &&
                      this.state.formlabelData.label331.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Control
                                type="text"
                                name="square"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                className="w-100"
                                id={response.responseId}
                                defaultValue={response.response}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs sm="12" lg="12" id="housingChar3">
                  <label className="mb-1">
                    {this.state.formlabelData.label332 &&
                      this.state.formlabelData.label332.question}
                  </label>
                  <div className="d-flex flex-wrap justify-content-start align-items-center">
                    {this.state.formlabelData.label332 &&
                      this.state.formlabelData.label332.response.map(
                        (response) => {
                          {
                            //(response)
                          }

                          return (
                            <>
                              <div className="d-flex justify-content-start align-items-start">
                                <div
                                  key="checkbox8"
                                  className="me-0 pe-3 mb-0 d-flex align-items-start"
                                >
                                  <Form.Check
                                    className="chekspace "
                                    type="radio"
                                    id={response.responseId}
                                    value={response.response}
                                    name="nohouse"
                                    label={response.response}
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                    defaultChecked={response.checked}
                                  // checked={response.checked}
                                  />
                                </div>
                              </div>
                            </>
                          );
                        }
                      )}

                    {/* <div
                      key="checkbox8"
                      className="me-4 pe-3 mb-0 d-flex align-items-center"
                    >
                      <Form.Check
                        className="chekspace"
                        type="radio"
                        id="checkbox8"
                        defaultValue="1"
                        name="nohouse"
                        label="1"
                        onChange={(event) => this.noradioValue(event)}
                      />
                    </div>
                    <div
                      key="checkbox8"
                      className="me-4 pe-3 mb-0 d-flex align-items-center"
                    >
                      <Form.Check
                        className="chekspace"
                        type="radio"
                        id="checkbox8"
                        defaultValue="2"
                        name="nohouse"
                        label="2"
                        onChange={(event) => this.noradioValue(event)}
                      />
                    </div>
                    <div
                      key="checkbox8"
                      className="me-4 pe-3 mb-0 d-flex align-items-center"
                    >
                      <Form.Check
                        className="chekspace"
                        type="radio"
                        id="checkbox8"
                        defaultValue="3"
                        name="nohouse"
                        label="3"
                        onChange={(event) => this.noradioValue(event)}
                      />
                    </div>
                    <div
                      key="checkbox8"
                      className="me-4 pe-3 mb-0 d-flex align-items-center"
                    >
                      <Form.Check
                        className="chekspace"
                        type="radio"
                        id="checkbox8"
                        defaultValue="More"
                        name="nohouse"
                        label="More"
                        onChange={(event) => this.noradioValue(event)}
                      />
                    </div> */}
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs sm="12" lg="12" id="housingChar4">
                  <label className="mb-1">
                    {this.state.formlabelData.label335 &&
                      this.state.formlabelData.label335.question}
                  </label>
                  <div className="d-flex justify-content-start align-items-center">
                    {this.state.formlabelData.label335 &&
                      this.state.formlabelData.label335.response.map(
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
                                    name="split"
                                    label={response.response}
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                    defaultChecked={response.checked}
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
              <Row className="mb-3">
                <Col xs sm="12" lg="12" id="housingChar5">
                  <label className="mb-1">
                    {this.state.formlabelData.label336 &&
                      this.state.formlabelData.label336.question}
                  </label>
                  <div className="d-flex justify-content-center align-items-center">
                    {this.state.formlabelData.label336 &&
                      this.state.formlabelData.label336.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Control
                                type="text"
                                name="yard"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                className="w-100"
                                id={response.responseId}
                                defaultValue={response.response}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs sm="12" lg="12" id="housingChar6">
                  <label className="mb-1">
                    {this.state.formlabelData.label337 &&
                      this.state.formlabelData.label337.question}
                  </label>
                  <div className="d-flex justify-content-center align-items-center">
                    {this.state.formlabelData.label337 &&
                      this.state.formlabelData.label337.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Control
                                type="text"
                                name="front"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                className="w-100"
                                id={response.responseId}
                                defaultValue={response.response}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs sm="12" lg="12" id="housingChar7">
                  <label className="mb-1">
                    {this.state.formlabelData.label338 &&
                      this.state.formlabelData.label338.question}
                  </label>
                  <div className="d-flex justify-content-center align-items-center">
                    {this.state.formlabelData.label338 &&
                      this.state.formlabelData.label338.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Control
                                type="text"
                                name="backyard"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                className="w-100"
                                id={response.responseId}
                                defaultValue={response.response}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs sm="12" lg="12" id="housingChar8">
                  <label className="mb-1">
                    {this.state.formlabelData.label339 &&
                      this.state.formlabelData.label339.question}
                  </label>
                  <div className="d-flex justify-content-center align-items-center">
                    {this.state.formlabelData.label339 &&
                      this.state.formlabelData.label339.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Control
                                type="text"
                                name="navigate"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                className="w-100"
                                id={response.responseId}
                                defaultValue={response.response}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs sm="12" lg="12" id="housingChar9">
                  <label className="mb-1">
                    {this.state.formlabelData.label340 &&
                      this.state.formlabelData.label340.question}
                  </label>
                  <div className="d-flex justify-content-center align-items-center">
                    {this.state.formlabelData.label340 &&
                      this.state.formlabelData.label340.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Control
                                type="text"
                                name="widths"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                className="w-100"
                                id={response.responseId}
                                defaultValue={response.response}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs sm="12" lg="12" id="housingChar10">
                  <label className="mb-1">
                    {this.state.formlabelData.label341 &&
                      this.state.formlabelData.label341.question}{" "}
                  </label>
                  <div className="d-flex justify-content-center align-items-center">
                    {this.state.formlabelData.label341 &&
                      this.state.formlabelData.label341.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Control
                                type="text"
                                name="hallway"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                className="w-100"
                                id={response.responseId}
                                defaultValue={response.response}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Row>
            {/* </Col> */}
            {this.state.nohouse1 ? (
              <div>
                <Row className="mb-3 ">
                  <Col xs sm="12" lg="12"  id="housingChar11">
                    <label className="mb-1">
                      {this.state.formlabelData.label333 &&
                        this.state.formlabelData.label333.question}
                    </label>
                    <div className="d-flex justify-content-center align-items-center">
                      {this.state.formlabelData.label333 &&
                        this.state.formlabelData.label333.response.map(
                          (response) => {
                            return (
                              <>
                                <Form.Control
                                  type="text"
                                  name="laundry"
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  className="w-100"
                                  id={response.responseId}
                                  defaultValue={response.response}
                                />
                              </>
                            );
                          }
                        )}
                    </div>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs lg="12" id="housingChar12">
                    <label className="mb-1">
                      {this.state.formlabelData.label334 &&
                        this.state.formlabelData.label334.question}
                    </label>
                    <div className="d-flex justify-content-center align-items-center">
                      {this.state.formlabelData.label334 &&
                        this.state.formlabelData.label334.response.map(
                          (response) => {
                            return (
                              <>
                                <Form.Control
                                  type="text"
                                  name="bedroom"
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  className="w-100"
                                  id={response.responseId}
                                  defaultValue={response.response}
                                />
                              </>
                            );
                          }
                        )}
                    </div>
                  </Col>
                </Row>
              </div>
            ) : (
              ""
            )}
            <div className="d-flex justify-content-end">
              <Button className="theme-btn" onClick={this.handleUpdateSubmit} disabled={this.state.disable == true ? true : false} >
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
)(housingcharacteristics);
