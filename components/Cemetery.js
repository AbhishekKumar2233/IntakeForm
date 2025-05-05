import React, { Component } from "react";
import { Modal, Button, Form, Row, Col,Card, Container } from "react-bootstrap";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { $Service_Url } from "./network/UrlPath";
import Select from "react-select";
import { $AHelper } from "./control/AHelper";
import { $CommonServiceFn } from "./network/Service";
import { legal } from "./control/Constant";
import { CemeteryQ } from "./control/Constant";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";

class Cementery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      userId: "",
      SpouseDetailsUserId: "",
      formlabelData: [],
      formlabelDataSpouse: [],
      updatePrimaryMetaData: false,
      updateSpouseMetaData: false,
      primarymemberDetails:{},

      cemeteryPrimary: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      cemeterySpouse: {
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
    
    let primarymemberDetails=JSON.parse(sessionStorage?.getItem("userDetailOfPrimary"))
    this.setState({
      userId: newuserid,
      SpouseDetailsUserId: spouseDetailsUserId,
      primarymemberDetails:primarymemberDetails
    });
    this.getsubjectForFormLabelIdPrimary(newuserid);
    if (spouseDetailsUserId !== "null") {
      this.getsubjectForFormLabelIdSpouse(spouseDetailsUserId);
    }
  }

  handleClose = () => {
    this.setState({
      show: false,
    });
  };

  handleShow = () => {
    this.setState({
      show: true,
    });
  };

  handleChange = (e) => {
    const eventId = e.target.id;
    const eventValue = e.target.value;
    const eventName = e.target.name;

    if (eventName == "establisment1") {
      this.setState({
        ...this.state,
        cemeteryPrimary: {
          userSubjectDataId: this.state.formlabelData.label463
            ? this.state.formlabelData.label463.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label463 &&
            this.state.formlabelData.label463.questionId,
        },
      });
    } else if (eventName == "establisment2") {
      this.setState({
        ...this.state,
        cemeterySpouse: {
          userSubjectDataId: this.state.formlabelDataSpouse.label463
            ? this.state.formlabelDataSpouse.label463.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label463 &&
            this.state.formlabelData.label463.questionId,
        },
      });
    }
  };

  getsubjectForFormLabelIdPrimary = (newuserid) => {
    let formlabelData = {};
    let formlabelDataSpouse = {};
    this.props.dispatchloader(true);
    // CemeteryQ.formLabelId.map((id, index) => {
      // let data = [id.id];
      konsole.log("id", id);
      $CommonServiceFn.InvokeCommonApi(
        "POST",
        $Service_Url.getsubjectForFormLabelId,
        CemeteryQ.formLabelId,
        (response) => {
          this.props.dispatchloader(false);
          if (response) {
            const resSubData = response.data.data;

            for (let resObj of resSubData) {
              let label = "label" + resObj.formLabelId;
              formlabelData[label] = resObj.question;
              formlabelDataSpouse[label] = resObj.question;
              this.props.dispatchloader(true);
              $CommonServiceFn.InvokeCommonApi(
                "GET",
                $Service_Url.getSubjectResponse +
                newuserid +
                `/0/0/${formlabelData[label].questionId}`,
                "",
                (response) => {
                  this.props.dispatchloader(false);
                  if (response) {
                    if (response.data.data.userSubjects.length !== 0) {
                      this.setState({
                        updatePrimaryMetaData: true,
                      });
                      let responseData = response.data.data.userSubjects[0];
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
    // });
  };

  getsubjectForFormLabelIdSpouse = (spouseUserId) => {
    let formlabelDataSpouse = {};
    this.props.dispatchloader(true);
    // CemeteryQ.formLabelId.map((id, index) => {
    //   let data = [id.id];
      $CommonServiceFn.InvokeCommonApi(
        "POST",
        $Service_Url.getsubjectForFormLabelId,
        CemeteryQ.formLabelId,
        (response) => {
          this.props.dispatchloader(false);
          if (response) {
            const resSubData = response.data.data;

            for (let resObj of resSubData) {
              let label = "label" + resObj.formLabelId;
              formlabelDataSpouse[label] = resObj.question;
              $CommonServiceFn.InvokeCommonApi(
                "GET",
                $Service_Url.getSubjectResponse +
                spouseUserId +
                `/0/0/${formlabelDataSpouse[label].questionId}`,
                "",
                (response) => {
                  if (response) {
                    if (response.data.data.userSubjects.length !== 0) {
                      this.setState({
                        updateSpouseMetaData: true,
                      });
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
                          } else if (responseData.responseNature == "Text") {
                            formlabelDataSpouse[label].response[i]["response"] =
                              responseData.response;
                            formlabelDataSpouse[label]["userSubjectDataId"] =
                              responseData.userSubjectDataId;
                          }
                        }
                        if (
                          formlabelDataSpouse[label].response.length - 1 ==
                          i
                        ) {
                          this.props.dispatchloader(false);
                        }
                      }
                    }
                    this.props.dispatchloader(false);
                  }
                }
              );
              this.setState({
                formlabelDataSpouse: formlabelDataSpouse,
              });
            }
          } else {
            //   alert(Msg.ErrorMsg);
          }
        }
      );
    // });
  };

  handlesubmit = () => {
    // let inputdata = JSON.parse(JSON.stringify(this.state));

    let cemeteryPrimary = this.state.cemeteryPrimary;
    let cemeterySpouse = this.state.cemeterySpouse;

    if (this.state.SpouseDetailsUserId !== "null") {
      cemeteryPrimary["userId"] = this.state.userId;
      cemeterySpouse["userId"] = this.state.SpouseDetailsUserId;
    } else {
      cemeteryPrimary["userId"] = this.state.userId;
    }

    let totoalinptary = [];
    let totinptary = [];

    if (this.state.SpouseDetailsUserId !== "null") {
      if (
        cemeteryPrimary.subjectId !== 0 &&
        cemeteryPrimary.subResponseData !== "" &&
        cemeteryPrimary.responseId !== 0
      ) {
        totinptary.push(cemeteryPrimary);
      }
      if (
        cemeterySpouse.subjectId !== 0 &&
        cemeterySpouse.subResponseData !== "" &&
        cemeterySpouse.responseId !== 0
      ) {
        totoalinptary.push(cemeterySpouse);
      }
    } else {
      if (
        cemeteryPrimary.subjectId !== 0 &&
        cemeteryPrimary.subResponseData !== "" &&
        cemeteryPrimary.responseId !== 0
      ) {
        totinptary.push(cemeteryPrimary);
      }
    }

    if (this.state.SpouseDetailsUserId !== "null") {
      if (
        this.state.updatePrimaryMetaData == true &&
        this.state.updateSpouseMetaData == true
      ) {
        this.handleUpdateSubmit(totinptary, this.state.userId);
        this.handleUpdateSubmit(totoalinptary, this.state.SpouseDetailsUserId);
      } else if (
        this.state.updatePrimaryMetaData == true &&
        this.state.updateSpouseMetaData == false
      ) {
        this.handleUpdateSubmit(totinptary, this.state.userId);
        this.handleasdSubmit(totoalinptary, this.state.SpouseDetailsUserId);
      } else if (
        this.state.updateSpouseMetaData == true &&
        this.state.updatePrimaryMetaData == false
      ) {
        this.handleUpdateSubmit(totinptary, this.state.SpouseDetailsUserId);
      } else if (
        this.state.updateSpouseMetaData == false &&
        this.state.updatePrimaryMetaData == false
      ) {
        this.handleasdSubmit(totinptary, this.state.userId);
        this.handleasdSubmit(totoalinptary, this.state.SpouseDetailsUserId);
      }
    } else {
      if (this.state.updatePrimaryMetaData == true) {
        this.handleUpdateSubmit(totinptary, this.state.userId);
      } else if (this.state.updatePrimaryMetaData == false) {
        this.handleasdSubmit(totinptary, this.state.userId);
      }
    }
  };

  handleasdSubmit = (totoalinptary, consumerId) => {
    konsole.log("InP", totoalinptary, consumerId)
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "POST",
      $Service_Url.postaddusersubjectdata,
      totoalinptary,
      (response) => {
        this.props.dispatchloader(false);
        konsole.log("Success res submit" + JSON.stringify(response));
        if (response) {
          // alert("Saved Successfully");
          if (consumerId == this.state.userId) {
            this.getsubjectForFormLabelIdPrimary(this.state.userId);
          }
          if (consumerId == this.state.SpouseDetailsUserId) {
            this.getsubjectForFormLabelIdSpouse(this.state.SpouseDetailsUserId);
          }
          this.handleClose();
        } else {
          // alert(Msg.ErrorMsg);
          this.handleClose();
        }
      }
    );
  };

  handleUpdateSubmit = (totinptary, consumerId) => {
    let postData = {
      userId: consumerId,
      userSubjects: totinptary,
    };
    konsole.log("DaTa", postData)
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "PUT",
      $Service_Url.putSubjectResponse, // + "?userId=" + this.state.userId
      postData,
      (response) => {
        this.props.dispatchloader(false);
        konsole.log("Success res update" + JSON.stringify(response));
        if (response) {
          // alert("Saved Successfully");
          if (consumerId == this.state.userId) {
            this.getsubjectForFormLabelIdPrimary(this.state.userId);
          }
          if (consumerId == this.state.SpouseDetailsUserId) {
            this.getsubjectForFormLabelIdSpouse(this.state.SpouseDetailsUserId);
          }
          this.handleClose();
        } else {
          this.handleClose();
        }
      }
    );
  };

  render() {
    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
        `}</style>



        <Card.Img variant="Top" className="border" src="icons/cemetery.svg" onClick={this.handleShow} />
        <Card.Body className="p-0 mt-2">
          <a onClick={this.handleShow}>
            <div className="border d-flex justify-content-between align-items-center p-2 ">
              <p className="ms-2">Cemetery</p>
              <div className="border-start">
                <img className="px-2" src="/icons/add-icon.svg" alt="Burial Policy" />
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
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Cemetery</Modal.Title>
          </Modal.Header>
          <Modal.Body className="m-4">
            <div className="boxBorderStyle">
              <Row className="mt-4 ms-4">
                <Row>
                  <Col className="d-flex" style={{marginRight:"6%",marginLeft: "56%"}}>
                 <b> {this.state.primarymemberDetails?.memberName}</b>
                    {/* Primary{" "} */}
                  </Col>
                  {this.state.SpouseDetailsUserId !== "null" && (
                    <Col className="d-flex">
                      <b>{this.state.primarymemberDetails?.spouseName}</b>
                      {/* Spouse */}
                      </Col>
                  )}
                </Row>
                <Row className="my-4">
                  <Col lg="6">
                    {this.state.formlabelData.label463 &&
                      this.state.formlabelData.label463.question}
                  </Col>
                  {this.state.formlabelData.label463 &&
                    this.state.formlabelData.label463.response.map(
                      (response) => {
                        return (
                          <>
                            <Col>
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="establisment1"
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
                    this.state.formlabelDataSpouse.label463 &&
                    this.state.formlabelDataSpouse.label463.response.map(
                      (response) => {
                        return (
                          <>
                            <Col>
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="establisment2"
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
              </Row>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Cementery);
