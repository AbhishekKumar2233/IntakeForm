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
import { futureExpectation } from "./control/Constant";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import CurrencyInput from "react-currency-input-field";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";
import { $AHelper } from "./control/AHelper";

export class FutureExpectation extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props);
    this.state = {
      userId: "",
      show: false,
      showPrimary: false,
      showSpouse: false,
      formlabelData: {},
      updateCaregiverSuitabilty: false,
      spouseDetail: [],
      beneficiaryAmount: "",
      disable: false,
      inhertiancefMoneySpouse: "",
      inhertiancefMoneyJoint: "",
      inhertiancefMoneyPrimary: "",
      nameError: "",
      initialOpen: true,
      primarymemberDetails: {},
      spouseDetailUserId: "",
      maritalStatusId: null,

      primary: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "",
        responseId: 0,
      },

      spouse: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "",
        responseId: 0,
      },

      beneficiary: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "",
        responseId: 0,
      },
      inhertianceforPrimary: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "",
        responseId: 0,
      },
      inhertianceforSpouse: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "",
        responseId: 0,
      },
      inhertianceforJoint: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "",
        responseId: 0,
      },

      // caregiver:{
      //   userId: "",
      //   userSubjectDataId: 0,
      //   subjectId: 0,
      //   subResponseData: "",
      //   responseId: 0,

      // },

      // caregiver:{
      //   userId: "",
      //   userSubjectDataId: 0,
      //   subjectId: 0,
      //   subResponseData: "",
      //   responseId: 0,

      // },
    };
  }

  validate = () => {
    let nameError = "";
    if (this.state.showPrimary == false && this.state.showSpouse == false)
      nameError = "Please Add Something"
    this.setState({ disable: false })


    if (nameError) {
      this.toasterAlert(nameError, "Warning");
      return false;
    }
    return true;
  }

  componentDidMount() {
    let maritalStatus = sessionStorage.getItem("spouseUserId");
    let newuserId = sessionStorage.getItem("SessPrimaryUserId");
    let primarymemberDetails = JSON.parse(
      sessionStorage?.getItem("userDetailOfPrimary")
    );

    let spouseDetailUserId = sessionStorage.getItem("spouseUserId") || "";
    this.setState({
      maritalStatusId: maritalStatus,
      userId: newuserId,
      primarymemberDetails: primarymemberDetails,
      spouseDetailUserId: spouseDetailUserId,
    });
    // this.getsubjectForFormLabelId(newuserId);
    // this.FetchFamilyMembers(newUserId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.initialOpen == true && this.state.show == true) {
      if (this.state.initialOpen != true) this.getsubjectForFormLabelId(this.state.userId);
      else this.setState({ initialOpen: false });
    }
  }

  handleClose = () => {
    this.context.setPageTypeId(null)
    this.setState({
      show: !this.state.show,
    });
  };

  handleShow = () => {
    this.context.setPageTypeId(21)
    this.setState({
      show: !this.state.show,
    });
  };

  handleChange = (e) => {
    const eventId = e.target.id;
    const eventValue = e.target.value;
    const name = e.target.name;
    const checked = e.target.checked;

    konsole.log("log", typeof eventValue, eventValue, checked);
    if (name == "primary") {
      this.setState({
        ...this.state,
        showPrimary: checked,
        primary: {
          userSubjectDataId: this.state.formlabelData.label887
            ? this.state.formlabelData.label887.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: checked == true ? "true" : "false",
          subjectId:
            this.state.formlabelData.label887 &&
            this.state.formlabelData.label887.questionId,
        },
      });
    } else if (name == "spouse") {
      this.setState({
        ...this.state,
        showSpouse: checked,
        spouse: {
          userSubjectDataId: this.state.formlabelData.label924
            ? this.state.formlabelData.label924.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: checked == true ? "true" : "false",
          subjectId:
            this.state.formlabelData.label924 &&
            this.state.formlabelData.label924.questionId,
        },
      });
    } else if (name == "beneficiary") {
      this.setState({
        ...this.state,
        beneficiaryAmount: eventValue == "Yes" ? true : false,
        beneficiary: {
          userSubjectDataId: this.state.formlabelData.label888
            ? this.state.formlabelData.label888?.userSubjectDataId
            : 0,
          responseId: eventId,
          subjectId:
            this.state.formlabelData.label888 &&
            this.state.formlabelData.label888.questionId,
        },
      });
    }
  };

  handleValueChange = (e) => {
    this.setState({
      ...this.state,
      inhertiancefMoneyPrimary: e,
      inhertianceforPrimary: {
        userSubjectDataId: this.state.formlabelData.label920
          ? this.state.formlabelData.label920.userSubjectDataId
          : 0,
        responseId: this.state.formlabelData.label920
          ? this.state.formlabelData.label920.response[0].responseId
          : 0,
        subjectId:
          this.state.formlabelData.label920 &&
          this.state.formlabelData.label920.questionId,
      },
    });
  };

  handleValueChange2 = (e) => {
    this.setState({
      ...this.state,
      inhertiancefMoneySpouse: e,
      inhertianceforSpouse: {
        userSubjectDataId: this.state.formlabelData.label921
          ? this.state.formlabelData.label921.userSubjectDataId
          : 0,
        responseId: this.state.formlabelData.label921
          ? this.state.formlabelData.label921.response[0].responseId
          : 0,
        subjectId:
          this.state.formlabelData.label921 &&
          this.state.formlabelData.label921.questionId,
      },
    });
  };

  handleValueChange3 = (e) => {
    this.setState({
      ...this.state,
      inhertiancefMoneyJoint: e,
      inhertianceforJoint: {
        userSubjectDataId: this.state.formlabelData.label922
          ? this.state.formlabelData.label922.userSubjectDataId
          : 0,
        responseId: this.state.formlabelData.label922
          ? this.state.formlabelData.label922.response[0].responseId
          : 0,
        subjectId:
          this.state.formlabelData.label922 &&
          this.state.formlabelData.label922.questionId,
      },
    });
  };

  handleUpdateSubmit = () => {
    this.setState({ disable: true })
    let primary = {
      userSubjectDataId: this.state.primary?.userSubjectDataId,
      subjectId: this.state.primary.subjectId,
      subResponseData: this.state.primary.subResponseData,
      responseId: this.state.primary.responseId,
      userId: this.state.userId,
    };

    let spouse = {
      userSubjectDataId: this.state.spouse?.userSubjectDataId,
      subjectId: this.state.spouse.subjectId,
      subResponseData: this.state.spouse.subResponseData,
      responseId: this.state.spouse.responseId,
      userId: this.state.userId,
    };

    let beneficiary = {
      userSubjectDataId: this.state.beneficiary?.userSubjectDataId,
      subjectId: this.state.beneficiary.subjectId,
      subResponseData: this.state.beneficiary.subResponseData,
      responseId: this.state.beneficiary.responseId,
      userId: this.state.userId,
    };
    let inhertianceforPrimary = {
      userSubjectDataId: this.state.inhertianceforPrimary?.userSubjectDataId,
      subjectId: this.state.inhertianceforPrimary.subjectId,
      subResponseData: this.state.inhertiancefMoneyPrimary,
      responseId: this.state.inhertianceforPrimary.responseId,
      userId: this.state.userId,
    };
    let inhertianceforSpouse = {
      userSubjectDataId: this.state.inhertianceforSpouse?.userSubjectDataId,
      subjectId: this.state.inhertianceforSpouse.subjectId,
      subResponseData: this.state.inhertiancefMoneySpouse,
      responseId: this.state.inhertianceforSpouse.responseId,
      userId: this.state.userId,
    };
    let inhertianceforJoint = {
      userSubjectDataId: this.state.inhertianceforJoint?.userSubjectDataId,
      subjectId: this.state.inhertianceforJoint.subjectId,
      subResponseData: this.state.inhertiancefMoneyJoint,
      responseId: this.state.inhertianceforJoint.responseId,
      userId: this.state.userId,
    };
    let totinptary = [];
    // totinptary.push(primary);
    // totinptary.push(spouse);
    // totinptary.push(beneficiary);

    if (
      primary.subjectId !== 0 &&
      primary.subResponseData !== "" &&
      primary.responseId !== 0
    ) {
      totinptary.push(primary);
    }
    if (
      spouse.subjectId !== 0 &&
      spouse.subResponseData !== "" &&
      spouse.responseId !== 0
    ) {
      totinptary.push(spouse);
    }
    if (beneficiary.subjectId !== 0 && beneficiary.responseId !== 0) {
      totinptary.push(beneficiary);
    }
    if (
      inhertianceforPrimary.subjectId !== 0 &&
      this.state.inhertiancefMoneyPrimary !== "" &&
      inhertianceforPrimary.responseId !== 0
    ) {
      totinptary.push(inhertianceforPrimary);
    }
    if (
      inhertianceforSpouse.subjectId !== 0 &&
      this.state.inhertiancefMoneySpouse !== "" &&
      inhertianceforSpouse.responseId !== 0
    ) {
      totinptary.push(inhertianceforSpouse);
    }
    if (
      inhertianceforJoint.subjectId !== 0 &&
      this.state.inhertiancefMoneyJoint !== "" &&
      inhertianceforJoint.responseId !== 0
    ) {
      totinptary.push(inhertianceforJoint);
    }

    let inputData = {
      userId: this.state.userId,
      userSubjects: totinptary,
    };

    konsole.log("inputType", JSON.stringify(inputData));
    this.setState({ disable: true })
    if (this.validate()) {
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi(
        "PUT",
        $Service_Url.putSubjectResponse, // + "?userId=" + this.state.userId
        inputData,
        (response) => {
          this.props.dispatchloader(false);
          konsole.log(
            "Success res future expectation" + JSON.stringify(response)
          );
          if (response) {
            this.setState({ disable: false })
            AlertToaster.success("Data saved successfully");
            this.handleClose();
            this.getsubjectForFormLabelId(this.state.userId);
            // alert("Saved Successfully");
            // this.props.handlenonretireproppopShow();
          } else {
            // alert(Msg.ErrorMsg);
            this.handleClose();
            this.setState({ disable: false })
          }
        }
      );
    };
  }

  getsubjectForFormLabelId = (newuserid) => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    // futureExpectation.formLabelId.map((id, index) => {
    //   let data = [id.id];
    // konsole.log("id", data);
    $CommonServiceFn.InvokeCommonApi(
      "POST",
      $Service_Url.getsubjectForFormLabelId,
      futureExpectation.formLabelId,
      (response) => {
        if (response) {
          this.props.dispatchloader(false);
          const resSubData = response.data.data;

          for (let resObj of resSubData) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = resObj.question;
            konsole.log("future expectation formlabelData", formlabelData);
            this.props.dispatchloader(true);
            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, "", (response) => {
              if (response) {
                konsole.log("vishnudbres89", response.data.data)
                this.props.dispatchloader(false);
                if (response.data.data.userSubjects.length !== 0) {
                  let responseData = response.data.data.userSubjects[0];
                  this.props.dispatchloader(true);
                  for (let i = 0; i < formlabelData[label].response.length; i++) {
                    this.props.dispatchloader(false);
                    if (formlabelData[label].response[i].responseId === responseData.responseId) {
                      if (responseData.responseNature == "Radio") {
                        formlabelData[label].response[i]["checked"] = true;
                        formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        if ( responseData.questionId == 88 && responseData.responseId == 167) {
                          this.setState({ beneficiaryAmount: true,});
                        }
                      } else if (responseData.responseNature == "Text") {
                        formlabelData[label].response[i]["response"] = responseData.response;
                        formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        if ( responseData.response == "true" && formlabelData[label].questionId == 87) {
                          this.setState({  showPrimary: true,  });
                          formlabelData[label].response[i][ "checked"] = true; formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        }
                        if ( responseData.response == "true" && formlabelData[label].questionId == 127) {
                          this.setState({  showSpouse: true,  });
                          formlabelData[label].response[i][ "checked"] = true;
                          formlabelData[label]["userSubjectDataId"] =responseData.userSubjectDataId;
                        }
                        if (responseData.questionId == 123) {
                          this.setState({ ...this.state, inhertiancefMoneyPrimary: responseData.response,});
                        }
                        if (responseData.questionId == 124) {
                          this.setState({
                            ...this.state,
                            inhertiancefMoneySpouse: responseData.response,
                          });
                        }
                        if (responseData.questionId == 125) {
                          this.setState({
                            ...this.state,
                            inhertiancefMoneyJoint: responseData.response,
                          });
                        }
                      }
                    }
                  }
                }
                this.props.dispatchloader(false);
              }
            }
            );
          }
        } else {
          // alert(
          //   Msg.ErrorMsg
          // );
          this.toasterAlert(Msg.ErrorMsg, "Warning");
          this.setState({ disable: false })
        }
      }
    );
    // });
    this.setState({ formlabelData: formlabelData });
  };

  toasterAlert(text, type) {
    this.context.setdata({ open: true, text: text, type: type });
  }

  render() {
    konsole.log("formlabelData future", this.state.formlabelData, this.state);

    console.log('thisthisthis', 'primary', this.state.showPrimary)
    console.log('thisthisthis', 'spouse', this.state.showSpouse)
    // formlabelData.label887.response
    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.5 !important;
          }
        `}</style>
        <Col xs md="4" onClick={this.handleShow} className="cursor-pointer">
          <div className="d-flex align-items-center border py-1">
            <div className="flex-grow-1 ms-2 border-end">Future Expectation</div>
            <div className="">
              <a>
                <img
                  className="px-2"
                  src="/icons/add-icon.svg"
                  alt="health Insurance"
                />
              </a>
            </div>
          </div>
        </Col>

        <Modal
          show={this.state.show}
          size="md"
          centered
          onHide={this.handleClose}
          animation="false"
          id="futureExpectationId"
          backdrop="static"
          enforceFocus={false}
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Future Expectation</Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            <Form.Group as={Row} className="mb-3">
              <div>
                <p className="mb-2">
                  {this.state.formlabelData.label887 &&
                    this.state.formlabelData.label887.question}
                </p>
              </div>


              <Col lg="6">
                {this.state.formlabelData.label887 &&
                  this.state.formlabelData.label887.response.map((response) => {

                    // primary subResponseData

                    return (
                      <div className="d-flex gap-2">
                        <div>
                          <Form.Check
                            className="left-radio"
                            // label={"Primary"}
                            // label= {$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.memberName)}
                            type="checkbox"
                            id={response.responseId}
                            name={"primary"}
                            onChange={(e) => this.handleChange(e)}
                            // defaultChecked={response.response == "true"}
                            checked={this.state.showPrimary}

                          />
                        </div>
                        <div>
                          <label className="pt-1">{$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.memberName)}</label>
                        </div>
                      </div>
                    );
                  }
                  )}
              </Col>
              {this.state.spouseDetailUserId !== "null" && (

                <Col lg="6">
                  <>
                    {this.state.formlabelData.label924 &&
                      this.state.formlabelData.label924.response.map(
                        (response) => {
                          return (
                            <div className="d-flex gap-2">
                              <div>
                                <Form.Check
                                  className="left-radio"
                                  // label={"Spouse"}
                                  // label={$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.spouseName)}
                                  type="checkbox"
                                  id={response.responseId}
                                  name="spouse"
                                  onChange={(e) => this.handleChange(e)}
                                  // defaultChecked={response.response == "true"}
                                  checked={this.state.showSpouse}
                                />
                              </div>
                              <div>
                                <label className="pt-1">{$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.spouseName)}</label>
                              </div>
                            </div>
                          );
                        }
                      )}
                  </>
                </Col>
              )}
              {/* <hr/> */}
              {/* <Col xs sm="6" lg="6" id="futureExpectationId1" style={{border:"1px solid red"}}>
                <p className="mb-2">
                  {this.state.formlabelData.label887 &&
                    this.state.formlabelData.label887.question}
                </p>
                <div className="d-flex align-items-center justify-content-between">
                  {this.state.formlabelData.label887 &&
                    this.state.formlabelData.label887.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Check
                              className="left-radio"
                              // label={"Primary"}
                              label={
                                this.state.primarymemberDetails?.memberName
                              }
                              type="checkbox"
                              id={response.responseId}
                              name={"primary"}
                              onChange={(e) => this.handleChange(e)}
                              defaultChecked={response.response == "true"}
                            />
                          </>
                        );
                      }
                    )}
                  {this.state.spouseDetailUserId !== "null" && (
                    <>
                      {this.state.formlabelData.label924 &&
                        this.state.formlabelData.label924.response.map(
                          (response) => {
                            return (
                              <>
                                <Form.Check
                                  className="left-radio"
                                  // label={"Spouse"}
                                  label={
                                    this.state.primarymemberDetails?.spouseName
                                  }
                                  type="checkbox"
                                  id={response.responseId}
                                  name="spouse"
                                  onChange={(e) => this.handleChange(e)}
                                  defaultChecked={response.response == "true"}
                                />
                              </>
                            );
                          }
                        )}
                    </>
                  )}
                </div>
              </Col> */}
            </Form.Group>
            <Row>
              <Col lg={6}>
                {this.state.showPrimary ? (
                  <div className="mb-3">
                    {this.state.formlabelData.label920 &&
                      this.state.formlabelData.label920.response.map(
                        (response) => {
                          return (
                            <>
                              <CurrencyInput
                                prefix="$"
                                className="border "
                                name="inhertianceforPrimary"
                                placeholder="Value of inheritance amount?"
                                id={response.responseId}
                                allowNegativeValue={false}
                                value={this.state.inhertiancefMoneyPrimary}
                                onValueChange={(e) => {
                                  this.handleValueChange(e);
                                }}
                                decimalScale="2"
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                ) : (
                  ""
                )}
              </Col>
              {/* for spouse */}
              {this.state.spouseDetailUserId !== "null" && (

                <Col lg={6}>
                  {this.state.showSpouse ? (
                    <div className="mb-2">
                      {this.state.formlabelData.label921 &&
                        this.state.formlabelData.label921.response.map(
                          (response) => {
                            return (
                              <>
                                <CurrencyInput
                                  className="border "
                                  prefix="$"
                                  allowNegativeValue={false}
                                  name="inhertianceforSpouse"
                                  placeholder="Value of inheritance amount?"
                                  id={response.responseId}
                                  value={this.state.inhertiancefMoneySpouse}
                                  onValueChange={(e) => {
                                    this.handleValueChange2(e);
                                  }}
                                  decimalScale="2"
                                />
                              </>
                            );
                          }
                        )}
                    </div>
                  ) : (
                    ""
                  )}
                </Col>
              )}
            </Row>
            <Form.Group as={Row} className="mb-3">
              {this.state.maritalStatusId == 1 || this.state.maritalStatusId == 2 ? (
                <Col xs sm="12" lg="10" id="futureExpectationId2">
                  <p>
                    {this.state.formlabelData.label888 &&
                      this.state.formlabelData.label888.question}{" "}
                  </p>
                  <div className="d-flex align-items-center justify-content-start">
                    {this.state.formlabelData.label888 &&
                      this.state.formlabelData.label888.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Check
                                inline
                                className="chekspace"
                                type="radio"
                                id={response.responseId}
                                name="beneficiary"
                                value={response.response}
                                label={response.response}
                                onChange={(e) => this.handleChange(e)}
                                defaultChecked={response.checked}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              ) : null}
            </Form.Group>
            <Row>
              <Col lg={6}>
                {this.state.beneficiaryAmount == true && (
                  <div className="mb-2">
                    {this.state.formlabelData.label922 &&
                      this.state.formlabelData.label922.response.map(
                        (response) => {
                          return (
                            <>
                              <CurrencyInput
                                prefix="$"
                                className="border"
                                allowNegativeValue={false}
                                name="inhertianceforJoint"
                                placeholder="Value of inheritance amount?"
                                id={response.responseId}
                                value={this.state.inhertiancefMoneyJoint}
                                onValueChange={(e) => {
                                  this.handleValueChange3(e);
                                }}
                                decimalScale="2"
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                )}
              </Col>
            </Row>
            <div className="mt-2 d-flex justify-content-end">
              <Button
                style={{ backgroundColor: "#76272b", border: "none" }}
                className="theme-btn" onClick={this.handleUpdateSubmit}
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

export default connect(mapStateToProps, mapDispatchToProps)(FutureExpectation);
