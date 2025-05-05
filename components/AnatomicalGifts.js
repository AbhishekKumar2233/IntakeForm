import React, { Component } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Card,
  Container,
} from "react-bootstrap";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { $Service_Url } from "./network/UrlPath";
import { $AHelper } from "./control/AHelper";
import { $CommonServiceFn } from "./network/Service";
import { aGifts } from "./control/Constant";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import AlertToaster from "./control/AlertToaster";
import { globalContext } from "../pages/_app";

class AnatomicalGifts extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props);
    this.state = {
      show: false,
      initialShow: true,
      disable: false,
      updatePrimaryMetaData: false,
      updateSpouseMetaData: false,
      userId: "",
      SpouseDetailsUserId: "",
      formlabelData: [],
      formlabelDataSpouse: [],
      primarymemberDetails: {},
      donor2ResponseId: 0,
      donor1ResponseId: 0,
      scientific1Value: {
        responseId: 0,
        disable: false,
      },
      scientific2Value: {
        responseId: 0,
        disable: false,
      },
      donor1: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      donor2: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      scientific1: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      scientific2: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
    };
  }

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId");
    let spouseDetailsUserId = sessionStorage.getItem("spouseUserId");
    let primarymemberDetails = JSON.parse(
      sessionStorage?.getItem("userDetailOfPrimary")
    );
    this.setState({
      userId: newuserid,
      SpouseDetailsUserId: spouseDetailsUserId,
      primarymemberDetails: primarymemberDetails,
    });
    // this.getsubjectForFormLabelIdForPrimary(newuserid);
    // konsole.log("spouseUseriD", spouseDetailsUserId);
    // if (spouseDetailsUserId !== "") {
    //   this.getsubjectForFormLabelIdSpouse(spouseDetailsUserId);
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.show != true && this.state.show == true && this.state.initialShow == true) {
      this.setState({ initialShow: false })
      this.getsubjectForFormLabelIdForPrimary(this.state.userId);
      if (this.state.SpouseDetailsUserId !== "null") {
        this.getsubjectForFormLabelIdSpouse(this.state.SpouseDetailsUserId);
      }
    }
  }

  handleClose = () => {
    this.context.setPageTypeId(null)
    this.setState({
      show: false,
    });
  };

  handleShow = () => {
    this.context.setPageTypeId(36)
    this.setState({
      show: true,
    });
  };

  handleChange = (e) => {
    const eventId = e.target.id;
    const eventValue = e.target.value;
    const eventName = e.target.name;

    if (eventName == "donor1") {
      const donor1Value =
        eventId == "104"
          ? { responseId: 107, disable: true }
          : { responseId: 0, disable: false };
      const scientific1 =
        eventId == "104"
          ? {
            userSubjectDataId: this.state.formlabelData.label460
              ? this.state.formlabelData.label460.userSubjectDataId
              : 0,
            responseId: 107,
            subResponseData: "No",
            subjectId:
              this.state.formlabelData.label460 &&
              this.state.formlabelData.label460.questionId,
          }
          : {
            userSubjectDataId: this.state.formlabelData.label460
              ? this.state.formlabelData.label460.userSubjectDataId
              : 0,
            responseId: 0,
            subResponseData: 0,
            subjectId:
              this.state.formlabelData.label460 &&
              this.state.formlabelData.label460.questionId,
          };

      this.setState({
        ...this.state,
        scientific1Value: donor1Value,
        donor1ResponseId: eventId,
        scientific1: scientific1,
        donor1: {
          userSubjectDataId: this.state.formlabelData.label459
            ? this.state.formlabelData.label459.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label459 &&
            this.state.formlabelData.label459.questionId,
        },
      });
    } else if (eventName == "donor2") {
      const donor1Value =
        eventId == "104"
          ? { responseId: 107, disable: true }
          : { responseId: 0, disable: false };
      const scientific1 =
        eventId == "104"
          ? {
            userSubjectDataId: this.state.formlabelDataSpouse.label460
              ? this.state.formlabelDataSpouse.label460.userSubjectDataId
              : 0,
            responseId: 107,
            subResponseData: "No",
            subjectId:
              this.state.formlabelDataSpouse.label460 &&
              this.state.formlabelDataSpouse.label460.questionId,
          }
          : {
            userSubjectDataId: this.state.formlabelDataSpouse.label460
              ? this.state.formlabelDataSpouse.label460.userSubjectDataId
              : 0,
            responseId: 0,
            subResponseData: 0,
            subjectId:
              this.state.formlabelData.label460 &&
              this.state.formlabelData.label460.questionId,
          };
      this.setState({
        ...this.state,
        scientific2Value: donor1Value,
        donor2ResponseId: eventId,
        scientific2: scientific1,
        donor2: {
          userSubjectDataId: this.state.formlabelDataSpouse.label459
            ? this.state.formlabelDataSpouse.label459.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelDataSpouse.label459 &&
            this.state.formlabelDataSpouse.label459.questionId,
        },
      });
    } else if (eventName == "scientific1") {
      const donor1Value = { responseId: eventId, disable: false };

      this.setState({
        ...this.state,
        scientific1Value: donor1Value,
        scientific1: {
          userSubjectDataId: this.state.formlabelData.label460
            ? this.state.formlabelData.label460.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label460 &&
            this.state.formlabelData.label460.questionId,
        },
      });
    } else if (eventName == "scientific2") {
      const donor1Value = { responseId: eventId, disable: false };

      this.setState({
        ...this.state,
        scientific2Value: donor1Value,
        scientific2: {
          userSubjectDataId: this.state.formlabelDataSpouse.label460
            ? this.state.formlabelDataSpouse.label460.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label460 &&
            this.state.formlabelData.label460.questionId,
        },
      });
    }
  };

  getsubjectForFormLabelIdForPrimary = (newuserid) => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    // aGifts.formLabelId.map((id, index) => {
    // let data = [id.id];
    $CommonServiceFn.InvokeCommonApi(
      "POST",
      $Service_Url.getsubjectForFormLabelId,
      aGifts.formLabelId,
      (response) => {
        if (response) {
          const resSubData = response.data.data;
          for (let resObj of resSubData) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = resObj.question;
            $CommonServiceFn.InvokeCommonApi(
              "GET",
              $Service_Url.getSubjectResponse +
              newuserid +
              `/0/0/${formlabelData[label].questionId}`,
              "",
              (response) => {
                if (response) {
                  if (response.data.data.userSubjects.length !== 0) {
                    this.setState({
                      updatePrimaryMetaData: true,
                    });
                    let responseData = response.data.data.userSubjects[0];
                    konsole.log("responseData", responseData);
                    for (
                      let i = 0;
                      i < formlabelData[label].response.length;
                      i++
                    ) {
                      this.props.dispatchloader(true);
                      if (
                        formlabelData[label].response[i].responseId ===
                        responseData.responseId
                      ) {
                        if (responseData.responseNature == "Radio") {
                          formlabelData[label].response[i]["checked"] = true;
                          formlabelData[label]["userSubjectDataId"] =
                            responseData.userSubjectDataId;
                          if (responseData.questionId == 59) {
                            this.setState({
                              donor1ResponseId: responseData.responseId,
                            });
                          }
                          if (responseData.questionId == 60) {
                            if (responseData.responseId == 107) {
                              this.setState({
                                scientific1Value: {
                                  responseId: responseData.responseId,
                                  disable: true,
                                },
                              });
                            }
                            if (responseData.responseId == 106) {
                              this.setState({
                                scientific1Value: {
                                  responseId: responseData.responseId,
                                  disable: false,
                                },
                              });
                            }
                          }
                        } else if (responseData.responseNature == "Text") {
                          formlabelData[label].response[i]["response"] =
                            responseData.response;
                          formlabelData[label]["userSubjectDataId"] =
                            responseData.userSubjectDataId;
                        }
                      }
                      if (formlabelData[label].response.length - 1 == i) {
                        this.props.dispatchloader(false);
                      }
                    }
                  }
                  this.props.dispatchloader(false);
                }
              }
            );
            this.setState({
              formlabelData: formlabelData,
            });
          }
        }
      }
    );

    this.setState({
      formlabelData: formlabelData,
    });
    // });
  };

  getsubjectForFormLabelIdSpouse = (spouseUserId) => {
    konsole.log("test 1");
    let formlabelDataSpouse = {};
    this.props.dispatchloader(true);
    // aGifts.formLabelId.map((id, index) => {
    //   let data = [id.id];
    konsole.log("test 2");
    $CommonServiceFn.InvokeCommonApi(
      "POST",
      $Service_Url.getsubjectForFormLabelId,
      aGifts.formLabelId,
      (response) => {
        if (response) {
          const resSubData = response.data.data;

          for (let resObj of resSubData) {
            let label = "label" + resObj.formLabelId;
            formlabelDataSpouse[label] = resObj.question;
            konsole.log("test 3");
            $CommonServiceFn.InvokeCommonApi(
              "GET",
              $Service_Url.getSubjectResponse +
              spouseUserId +
              `/0/0/${formlabelDataSpouse[label].questionId}`,
              "",
              (response) => {
                if (response) {
                  konsole.log("test 4");
                  if (response.data.data.userSubjects.length !== 0) {
                    this.setState({
                      updateSpouseMetaData: true,
                    });
                    konsole.log("test 5");
                    let responseData = response.data.data.userSubjects[0];
                    this.props.dispatchloader(true);
                    for (
                      let i = 0;
                      i < formlabelDataSpouse[label].response.length;
                      i++
                    ) {
                      if (
                        formlabelDataSpouse[label].response[i].responseId ===
                        responseData.responseId
                      ) {
                        this.props.dispatchloader(false);
                        if (responseData.responseNature == "Radio") {
                          formlabelDataSpouse[label].response[i][
                            "checked"
                          ] = true;
                          formlabelDataSpouse[label]["userSubjectDataId"] =
                            responseData.userSubjectDataId;
                          if (responseData.questionId == 59) {
                            this.setState({
                              donor2ResponseId: responseData.responseId,
                            });
                          }

                          if (responseData.questionId == 60) {
                            if (responseData.responseId == 107) {
                              this.setState({
                                scientific2Value: {
                                  responseId: responseData.responseId,
                                  disable: true,
                                },
                              });
                            }
                            if (responseData.responseId == 106) {
                              this.setState({
                                scientific2Value: {
                                  responseId: responseData.responseId,
                                  disable: false,
                                },
                              });
                            }
                          }
                        } else if (responseData.responseNature == "Text") {
                          formlabelDataSpouse[label].response[i]["response"] =
                            responseData.response;
                          formlabelDataSpouse[label]["userSubjectDataId"] =
                            responseData.userSubjectDataId;
                        }
                      }
                      this.props.dispatchloader(false);
                    }
                  }
                  this.props.dispatchloader(false);
                }
              }
            );
          }
          this.setState({
            formlabelDataSpouse: formlabelDataSpouse,
          });
        } else {
          //   alert(Msg.ErrorMsg);
        }
      }
    );
    // });
  };

  handlesubmit = () => {
    this.setState({ disable: true })
    let inputdata = JSON.parse(JSON.stringify(this.state));

    let donor1 = this.state.donor1;
    let donor2 = this.state.donor2;
    let scientific1 = this.state.scientific1;
    let scientific2 = this.state.scientific2;

    donor1["userId"] = this.state.userId;
    donor2["userId"] = this.state.SpouseDetailsUserId;
    scientific1["userId"] = this.state.userId;
    scientific2["userId"] = this.state.SpouseDetailsUserId;

    let totoalinptary = [];
    let totinptary = [];

    if (this.state.SpouseDetailsUserId !== "null") {
      // totinptary.push(donor1);
      // totinptary.push(donor2);
      // totinptary.push(scientific1);
      // totoalinptary.push(scientific2);

      if (
        donor1.subjectId !== 0 &&
        donor1.subResponseData !== "" &&
        donor1.responseId !== 0
      ) {
        totinptary.push(donor1);
      }
      if (
        donor2.subjectId !== 0 &&
        donor2.subResponseData !== "" &&
        donor2.responseId !== 0
      ) {
        totoalinptary.push(donor2);
      }
      if (
        scientific1.subjectId !== 0 &&
        scientific1.subResponseData !== "" &&
        scientific1.responseId !== 0
      ) {
        totinptary.push(scientific1);
      }
      if (
        scientific2.subjectId !== 0 &&
        scientific2.subResponseData !== "" &&
        scientific2.responseId !== 0
      ) {
        totoalinptary.push(scientific2);
      }
    } else {
      // totinptary.push(donor1);
      // totinptary.push(scientific1);
      if (
        donor1.subjectId !== 0 &&
        donor1.subResponseData !== "" &&
        donor1.responseId !== 0
      ) {
        totinptary.push(donor1);
      }
      if (
        scientific1.subjectId !== 0 &&
        scientific1.subResponseData !== "" &&
        scientific1.responseId !== 0
      ) {
        totinptary.push(scientific1);
      }
    }

    if (this.state.SpouseDetailsUserId !== "null") {
      if (
        this.state.updatePrimaryMetaData == true &&
        this.state.updateSpouseMetaData == true
      ) {
        this.handleUpdateSubmit(totinptary, this.state.userId);
        this.handleUpdateSubmit(totoalinptary, this.state.SpouseDetailsUserId, "TostertwiceUpdate");
      } else if (
        this.state.updatePrimaryMetaData == true &&
        this.state.updateSpouseMetaData == false
      ) {

        this.handleUpdateSubmit(totinptary, this.state.userId);
        this.handleasdSubmit(totoalinptary, this.state.SpouseDetailsUserId, "TostertwiceSubmited");

      } else if (

        this.state.updateSpouseMetaData == true &&
        this.state.updatePrimaryMetaData == false
      ) {
        this.handleUpdateSubmit(totinptary, this.state.SpouseDetailsUserId, "TostertwiceUpdate");
      } else if (
        this.state.updateSpouseMetaData == false &&
        this.state.updatePrimaryMetaData == false
      ) {
        this.handleasdSubmit(totinptary, this.state.userId);
        this.handleasdSubmit(totoalinptary, this.state.SpouseDetailsUserId, "TostertwiceSubmited");
      }
    } else {
      if (this.state.updatePrimaryMetaData == true) {
        this.handleUpdateSubmit(totinptary, this.state.userId, "TostertwiceUpdate");
      } else if (this.state.updatePrimaryMetaData == false) {
        this.handleasdSubmit(totinptary, this.state.userId, "TostertwiceSubmited");
      }
    }
  };

  handleasdSubmit = (totinptary, consumerId, funId) => {
    konsole.log("submit", totinptary, consumerId);
    this.props.dispatchloader(true);
    konsole.log("update", totinptary);
    $CommonServiceFn.InvokeCommonApi(
      "POST",
      $Service_Url.postaddusersubjectdata,
      totinptary,
      (response) => {
        this.props.dispatchloader(false);
        konsole.log("Success res submit" + JSON.stringify(response));
        if (response) {
          this.setState({ disable: false })
          if (funId == "TostertwiceSubmited") {
            AlertToaster.success("Data saved successfully");
          }


          // alert("Saved Successfully");
          if (consumerId == this.state.userId) {
            console.log("call api");
            this.getsubjectForFormLabelIdForPrimary(this.state.userId);
          }
          if (consumerId == this.state.SpouseDetailsUserId) {
            this.getsubjectForFormLabelIdSpouse(this.state.SpouseDetailsUserId);
          }
          this.handleClose();
        } else {
          // alert(Msg.ErrorMsg);
          this.handleClose();
          this.setState({ disable: false })
        }
      }
    );
  };

  handleUpdateSubmit = (totinptary, consumerId, funId2) => {
    konsole.log("update", totinptary);
    let postData = {
      userId: consumerId,
      userSubjects: totinptary,
    };
    konsole.log("update", postData);
    // this.state.disable=true
  this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "PUT",
      $Service_Url.putSubjectResponse, // + "?userId=" + this.state.userId
      postData,
      (response) => {
        this.props.dispatchloader(false);
        konsole.log("Success res update" + JSON.stringify(response));
        if (response) {
          this.setState({ disable: false })
          if (funId2 == "TostertwiceUpdate") {
            AlertToaster.success("Data updated successfully");
          }



          // alert("Saved Successfully");
          if (consumerId == this.state.userId) {
            this.getsubjectForFormLabelIdForPrimary(this.state.userId);
          }
          if (consumerId == this.state.SpouseDetailsUserId) {
            this.getsubjectForFormLabelIdSpouse(this.state.SpouseDetailsUserId);
          }
          this.handleClose();
          // this.setState({disable:false})
        } else {
          this.handleClose();
          this.setState({ disable: false })
        }
      }
    );
  };

  render() {
    konsole.log("rrqtywreyqwre", this.state);
    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
        `}</style>
        <Card.Img
          style={{ width: "204px", height: "166px" }}
          variant="Top"
          className="border"
          src="/icons/anatomicalGift.svg"
          onClick={this.handleShow}
        />
        <Card.Body className="p-0 mt-2" style={{ width: "204px " }}>
          <a onClick={this.handleShow}>
            <div className="border d-flex justify-content-between align-items-center p-2 ">
              <p className="ms-2">Organ Donation Details</p>
              <div className="border-start">
                <img
                  className="px-2"
                  src="/icons/add-icon.svg"
                  alt="Burial Policy"
                />
              </div>
            </div>
          </a>
        </Card.Body>

        <Modal
          size={this.state.SpouseDetailsUserId !== "null" ? "lg" : "md"}
          show={this.state.show}
          centered
          onHide={this.handleClose}
          animation="false"
          backdrop="static"
          enforceFocus={false}
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Organ Donation Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {window.innerWidth > "575" ? (
              <div className="boxBorderStyle">
                <Row>
                  <Col sm="6" md="6" lg="6"></Col>
                  <Col sm="6" md="6" lg="6">
                    <Row>
                      <div className="d-flex justify-content-between">
                        <Col className="d-flex justify-content-start" sm="6" md="6" lg="6">
                          {/* Primary */}
                          <b>{$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.memberName)}</b>
                        </Col>
                        {this.state.SpouseDetailsUserId !== "null" && (
                          <Col sm="6" md="6" lg="6" className="d-flex justify-content-start ps-3">
                            {/* Spouse */}
                            <b>{$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.spouseName)}</b>
                          </Col>
                        )}
                      </div>
                    </Row>
                  </Col>


                </Row>
                <Row className="mt-3">
                  <Col sm="6" md="6" lg="6">
                    {this.state.formlabelData.label459 &&
                      this.state.formlabelData.label459.question}
                  </Col>
                  {this.state.formlabelData.label459 &&
                    this.state.formlabelData.label459.response.map(
                      (response) => {
                        return (
                          <>
                            <Col className="pe-0">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="donor1"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </Col>
                          </>
                        );
                      }
                    )}
                  {this.state.SpouseDetailsUserId !== "null" &&
                    this.state.formlabelDataSpouse.label459 &&
                    this.state.formlabelDataSpouse.label459.response.map(
                      (response) => {
                        return (
                          <>
                            <Col className="pe-0">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="donor2"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </Col>
                          </>
                        );
                      }
                    )}
                </Row>
                <Row className="mt-3">
                  <Col sm="6" md="6" lg="6">
                    {this.state.formlabelData.label460 &&
                      this.state.formlabelData.label460.question}
                  </Col>
                  {this.state.formlabelData.label460 &&
                    this.state.formlabelData.label460.response.map(
                      (response) => {
                        konsole.log(
                          "linked user",
                          response.responseId ==
                          this.state.scientific1Value?.responseId
                        );
                        return (
                          <>
                            <Col className="pe-0">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="scientific1"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                checked={
                                  response.responseId ==
                                  this.state.scientific1Value?.responseId
                                }
                                disabled={
                                  this.state.donor1ResponseId == 104 &&
                                  this.state.scientific1Value?.disable
                                }
                              />
                            </Col>
                          </>
                        );
                      }
                    )}
                  {this.state.SpouseDetailsUserId !== "null" &&
                    this.state.formlabelDataSpouse.label460 &&
                    this.state.formlabelDataSpouse.label460.response.map(
                      (response) => {
                        return (
                          <>
                            <Col className="pe-0">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="scientific2"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                checked={
                                  response.responseId ==
                                  this.state.scientific2Value?.responseId
                                }
                                disabled={
                                  this.state.donor2ResponseId == 104 &&
                                  this.state.scientific2Value?.disable
                                }
                              />
                            </Col>
                          </>
                        );
                      }
                    )}
                </Row>

              </div>
            ) : (
              // --------------------------Mobile Show Only---------------------
              <div>
                <div>
                  <div className="d-flex justify-content-center mt-3" sm="6" md="6" lg="6">
                    {/* Primary */}
                    <b>{this.state.primarymemberDetails?.memberName}</b>
                  </div>
                </div>
                <Row>
                  <Col sm="6" md="6" lg="6" className="mt-3">
                    {this.state.formlabelData.label459 &&
                      this.state.formlabelData.label459.question}
                  </Col>
                  {this.state.formlabelData.label459 &&
                    this.state.formlabelData.label459.response.map(
                      (response) => {
                        return (
                          <>
                            <Col className="pe-0">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="donor1"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </Col>
                          </>
                        );
                      }
                    )}
                </Row>
                <Row>
                  <Col sm="6" md="6" lg="6" className="mt-3">
                    {this.state.formlabelData.label460 &&
                      this.state.formlabelData.label460.question}
                  </Col>
                  {this.state.formlabelData.label460 &&
                    this.state.formlabelData.label460.response.map(
                      (response) => {
                        konsole.log(
                          "linked user",
                          response.responseId ==
                          this.state.scientific1Value?.responseId
                        );
                        return (
                          <>
                            <Col className="pe-0">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="scientific1"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                checked={
                                  response.responseId ==
                                  this.state.scientific1Value?.responseId
                                }
                                disabled={
                                  this.state.donor1ResponseId == 104 &&
                                  this.state.scientific1Value?.disable
                                }
                              />
                            </Col>
                          </>
                        );
                      }
                    )}
                </Row>
                <hr className="d-md-none"></hr>
                <div>
                  {this.state.SpouseDetailsUserId !== "null" && (
                    <div sm="6" md="6" lg="6" className="d-flex justify-content-center ps-2 pe-md-0 pe-4">
                      {/* Spouse */}
                      <b>{this.state.primarymemberDetails?.spouseName}</b>
                    </div>
                  )}
                </div>
                <Row>
                  <Col sm="6" md="6" lg="6" className="mt-3">
                    {this.state.formlabelData.label459 &&
                      this.state.formlabelData.label459.question}
                  </Col>
                  {this.state.SpouseDetailsUserId !== "null" &&
                    this.state.formlabelDataSpouse.label459 &&
                    this.state.formlabelDataSpouse.label459.response.map(
                      (response) => {
                        return (
                          <>
                            <Col className="pe-0">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="donor2"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </Col>
                          </>
                        );
                      }
                    )}
                </Row>
                <Row>
                  <Col sm="6" md="6" lg="6" className="mt-3">
                    {this.state.formlabelData.label460 &&
                      this.state.formlabelData.label460.question}
                  </Col>
                  {this.state.SpouseDetailsUserId !== "null" &&
                    this.state.formlabelDataSpouse.label460 &&
                    this.state.formlabelDataSpouse.label460.response.map(
                      (response) => {
                        return (
                          <>
                            <Col className="pe-0">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="scientific2"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                checked={
                                  response.responseId ==
                                  this.state.scientific2Value?.responseId
                                }
                                disabled={
                                  this.state.donor2ResponseId == 104 &&
                                  this.state.scientific2Value?.disable
                                }
                              />
                            </Col>
                          </>
                        );
                      }
                    )}
                </Row>
              </div>
            )}

          </Modal.Body>

          <Modal.Footer className="border-0">
            <Button
              style={{ backgroundColor: "#76272b", border: "none" }}
              className="theme-btn" onClick={this.handlesubmit}
              disabled={this.state.disable == true ? true : false}
            >
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
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnatomicalGifts);



