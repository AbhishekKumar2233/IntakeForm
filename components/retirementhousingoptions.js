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
import { retirementHousigOp } from "./control/Constant";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";
import { $AHelper } from "../component/Helper/$AHelper";
import { isNullUndefine } from "./Reusable/ReusableCom";

export class retirementhousingoptions extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      fatherLive: true,
      motherLive: true,
      formlabelData: {},
      updateCaregiverSuitabilty: false,
      disable: false,

      retire: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      relative: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      miles: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      living: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      condominium: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      lifestyle: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      retirement: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
    };
  }
  handleClose = () => {
    this.context.setPageTypeId(null)
    this.setState({
      show: !this.state.show,
    });
  };

  handleShow = () => {
    this.context.setPageTypeId(11)
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

    if (eventName == "retire") {
      this.setState({
        ...this.state,
        retire: {
          userSubjectDataId: this.state.formlabelData.label320
            ? this.state.formlabelData.label320.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label320 &&
            this.state.formlabelData.label320.questionId,
        },
      });
    } else if (eventName == "relative") {
      this.setState({
        ...this.state,
        relative: {
          userSubjectDataId: this.state.formlabelData.label321
            ? this.state.formlabelData.label321.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label321 &&
            this.state.formlabelData.label321.questionId,
        },
      });
    } else if (eventName == "miles") {
      this.setState({
        ...this.state,
        miles: {
          userSubjectDataId: this.state.formlabelData.label322
            ? this.state.formlabelData.label322.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label322 &&
            this.state.formlabelData.label322.questionId,
        },
      });
    } else if (eventName == "living") {
      this.setState({
        ...this.state,
        living: {
          userSubjectDataId: this.state.formlabelData.label323
            ? this.state.formlabelData.label323.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label323 &&
            this.state.formlabelData.label323.questionId,
        },
      });
    } else if (eventName == "condominium") {
      this.setState({
        ...this.state,
        condominium: {
          userSubjectDataId: this.state.formlabelData.label324
            ? this.state.formlabelData.label324.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label324 &&
            this.state.formlabelData.label324.questionId,
        },
      });
    } else if (eventName == "lifestyle") {
      this.setState({
        ...this.state,
        lifestyle: {
          userSubjectDataId: this.state.formlabelData.label325
            ? this.state.formlabelData.label325.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label325 &&
            this.state.formlabelData.label325.questionId,
        },
      });
    } else if (eventName == "retirement") {
      this.setState({
        ...this.state,
        retirement: {
          userSubjectDataId: this.state.formlabelData.label326
            ? this.state.formlabelData.label326.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label326 &&
            this.state.formlabelData.label326.questionId,
        },
      });
    }
  };

  handlesubmit = () => {
    this.setState({disable:true})
    let inputdata = JSON.parse(JSON.stringify(this.state));

    let retire = {
      userSubjectDataId: this.state.retire.userSubjectDataId,
      subjectId: this.state.retire.subjectId,
      subResponseData: this.state.retire.subResponseData,
      responseId: this.state.retire.responseId,
      userId: this.state.userId,
    };
    let relative = {
      userSubjectDataId: this.state.relative.userSubjectDataId,
      subjectId: this.state.relative.subjectId,
      subResponseData: this.state.relative.subResponseData,
      responseId: this.state.relative.responseId,
      userId: this.state.userId,
    };
    let miles = {
      userSubjectDataId: this.state.miles.userSubjectDataId,
      subjectId: this.state.miles.subjectId,
      subResponseData: this.state.miles.subResponseData,
      responseId: this.state.miles.responseId,
      userId: this.state.userId,
    };

    let living = {
      userSubjectDataId: this.state.living.userSubjectDataId,
      subjectId: this.state.living.subjectId,
      subResponseData: this.state.living.subResponseData,
      responseId: this.state.living.responseId,
      userId: this.state.userId,
    };

    let condominium = {
      userSubjectDataId: this.state.condominium.userSubjectDataId,
      subjectId: this.state.condominium.subjectId,
      subResponseData: this.state.condominium.subResponseData,
      responseId: this.state.condominium.responseId,
      userId: this.state.userId,
    };

    let lifestyle = {
      userSubjectDataId: this.state.lifestyle.userSubjectDataId,
      subjectId: this.state.lifestyle.subjectId,
      subResponseData: this.state.lifestyle.subResponseData,
      responseId: this.state.lifestyle.responseId,
      userId: this.state.userId,
    };

    let retirement = {
      userSubjectDataId: this.state.retirement.userSubjectDataId,
      subjectId: this.state.retirement.subjectId,
      subResponseData: this.state.retirement.subResponseData,
      responseId: this.state.retirement.responseId,
      userId: this.state.userId,
    };

    let totinptary = [];
    if (
      retire.subjectId !== 0 &&
      retire.subResponseData !== "" &&
      retire.responseId !== 0
    ) {
      totinptary.push(retire);
    }
    if (
      relative.subjectId !== 0 &&
      relative.subResponseData !== "" &&
      relative.responseId !== 0
    ) {
      totinptary.push(relative);
    }
    if (
      miles.subjectId !== 0 &&
      miles.subResponseData !== "" &&
      miles.responseId !== 0
    ) {
      totinptary.push(miles);
    }
    if (
      living.subjectId !== 0 &&
      living.subResponseData !== "" &&
      living.responseId !== 0
    ) {
      totinptary.push(living);
    }
    if (
      condominium.subjectId !== 0 &&
      condominium.subResponseData !== "" &&
      condominium.responseId !== 0
    ) {
      totinptary.push(condominium);
    }
    if (
      lifestyle.subjectId !== 0 &&
      lifestyle.subResponseData !== "" &&
      lifestyle.responseId !== 0
    ) {
      totinptary.push(lifestyle);
    }
    if (
      retirement.subjectId !== 0 &&
      retirement.subResponseData !== "" &&
      retirement.responseId !== 0
    ) {
      totinptary.push(retirement);
    }

    konsole.log(JSON.stringify(inputdata));
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "POST",
      $Service_Url.postaddusersubjectdata, // + "?userId=" + this.state.userId
      totinptary,
      (response) => {
        this.setState({disable: false})
        this.props.dispatchloader(false);
        konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          AlertToaster.success("Data saved successfully");
          // alert("Saved Successfully");
          this.handleClose();
          this.getsubjectForFormLabelId(this.state.userId);
          this.props.dispatchloader(false);
          //  this.state.handleClose();
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

    let retire = {
      userSubjectDataId: this.state.retire.userSubjectDataId,
      subjectId: this.state.retire.subjectId,
      subResponseData: this.state.retire.subResponseData,
      responseId: this.state.retire.responseId,
      userId: this.state.userId,
    };
    let relative = {
      userSubjectDataId: this.state.relative.userSubjectDataId,
      subjectId: this.state.relative.subjectId,
      subResponseData: this.state.relative.subResponseData,
      responseId: this.state.relative.responseId,
      userId: this.state.userId,
    };
    let miles = {
      userSubjectDataId: this.state.miles.userSubjectDataId,
      subjectId: this.state.miles.subjectId,
      subResponseData: this.state.miles.subResponseData,
      responseId: this.state.miles.responseId,
      userId: this.state.userId,
    };

    let living = {
      userSubjectDataId: this.state.living.userSubjectDataId,
      subjectId: this.state.living.subjectId,
      subResponseData: this.state.living.subResponseData,
      responseId: this.state.living.responseId,
      userId: this.state.userId,
    };

    let condominium = {
      userSubjectDataId: this.state.condominium.userSubjectDataId,
      subjectId: this.state.condominium.subjectId,
      subResponseData: this.state.condominium.subResponseData,
      responseId: this.state.condominium.responseId,
      userId: this.state.userId,
    };

    let lifestyle = {
      userSubjectDataId: this.state.lifestyle.userSubjectDataId,
      subjectId: this.state.lifestyle.subjectId,
      subResponseData: this.state.lifestyle.subResponseData,
      responseId: this.state.lifestyle.responseId,
      userId: this.state.userId,
    };

    let retirement = {
      userSubjectDataId: this.state.retirement.userSubjectDataId,
      subjectId: this.state.retirement.subjectId,
      subResponseData: this.state.retirement.subResponseData,
      responseId: this.state.retirement.responseId,
      userId: this.state.userId,
    };

    let totinptary = [];
    // totinptary.push(retire);
    // totinptary.push(relative);
    // totinptary.push(miles);
    // totinptary.push(living);
    // totinptary.push(condominium);
    // totinptary.push(lifestyle);
    // totinptary.push(retirement);

    if ( retire.subjectId !== 0  && retire.responseId !== 0) {
      totinptary.push(retire);
    }
    if ( relative.subjectId !== 0 && relative.responseId !== 0) {
      totinptary.push(relative);
    }
    if ( miles.subjectId !== 0  && miles.responseId !== 0) {
      totinptary.push(miles);
    }
    if (living.subjectId !== 0 && living.subResponseData !== "" &&living.responseId !== 0) {
      totinptary.push(living);
    }
    if ( condominium.subjectId !== 0 && condominium.subResponseData !== "" && condominium.responseId !== 0) {
      totinptary.push(condominium);
    }
    if ( lifestyle.subjectId !== 0 && lifestyle.subResponseData !== "" && lifestyle.responseId !== 0    ) {
      totinptary.push(lifestyle);
    }
    if ( retirement.subjectId !== 0 && retirement.subResponseData !== "" && retirement.responseId !== 0) {
      totinptary.push(retirement);
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
      $CommonServiceFn.InvokeCommonApi(
        "POST",
        $Service_Url.getsubjectForFormLabelId,
        retirementHousigOp.formLabelId,
        (response) => {
          if (response) {
            const resSubData = response.data.data;
              $CommonServiceFn.InvokeCommonApi(
                "GET",$Service_Url.getSubjectResponse +newuserid +`/0/0/0`,"",(response) => {
                  if (response) {
                    if (response.data.data.userSubjects.length !== 0) {
                      this.setState({
                        updateCaregiverSuitabilty: true,
                      });
                      let responseData = response.data.data.userSubjects.length > 0 ? response.data.data.userSubjects : [];
                      this.props.dispatchloader(true);
                      responseData?.map((answers)=>{
                      for (let resObj of resSubData) {
                        let label = "label" + resObj.formLabelId;
                        formlabelData[label] = resObj.question;
                      for (let i = 0;i < formlabelData[label].response.length;i++) {
                        if (formlabelData[label].response[i].responseId === answers.responseId) {
                          this.props.dispatchloader(false);
                          if (answers.responseNature == "Radio") {
                            formlabelData[label].response[i]["checked"] = true;
                            formlabelData[label]["userSubjectDataId"] = answers.userSubjectDataId;
                          } else if (answers.responseNature == "Text") {
                            formlabelData[label].response[i]["response"] = answers.response;
                            formlabelData[label]["userSubjectDataId"] = answers.userSubjectDataId;
                          }
                        }
                      }
                    }
                  })
                  }
                  this.props.dispatchloader(false);
                  }
                }
              );
              this.setState({ formlabelData: formlabelData });
          } else {
            this.toasterAlert(Msg.ErrorMsg, "Warning");
          }
        }
      );
    // });
  };
  toasterAlert(text, type) {
    this.context.setdata({ open: true, text: text, type: type });
  }

  render() {
   konsole.log("cahra", this.props);
   console.log('this.state.formlabelData',this.state.formlabelData)

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
          backdrop="static"
          enforceFocus={false} 
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Retirement Housing Options</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              {this.props.yourhouse1 == "No" ?(
                <Col sm="12" lg="12" className="mb-3" id="retirementHousing1">
                  <label className="mb-1">
                    {this.state.formlabelData.label320 &&
                      this.state.formlabelData.label320.question}
                  </label>
                  <div className="d-flex justify-content-center align-items-center">
                    {this.state.formlabelData.label320 &&
                      this.state.formlabelData.label320.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Control
                                type="text"
                                name="retire"
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
              ) :  ( "")  }
            </Row>
            <Row className="mb-3">
              <Col xs sm="12" lg="12"  id="retirementHousing2" >
                <label className="mb-1">
                  {this.state.formlabelData.label321 &&
                    this.state.formlabelData.label321.question}
                </label>
                <div className="d-flex justify-content-center align-items-center">
                  {this.state.formlabelData.label321 &&
                    this.state.formlabelData.label321.response.map(
                      (response) => ($AHelper.$isAnyIdOrNot(response?.response) || isNullUndefine(response?.response)) ?
                          <>
                            <Form.Select
                              onChange={(e) => this.handleChange(e)}
                              defaultValue={response?.response}
                              name="relative"
                              id={response?.responseId}
                              className="w-100 custom-select"
                            >
                              <option value="-1" disabled selected hidden>Select Name</option>
                              {this.props?.familyMemberList?.map((item, index) => {
                                const optionData = { 'label': `${item?.fName} ${item?.lName}`, value: item?.userId }
                                return (
                                  <option key={index} value={optionData?.value}>
                                    {optionData?.label}
                                  </option>
                                );
                              })}
                            </Form.Select>
                          </> : <>
                            <Form.Control
                              type="text"
                              name="relative"
                              onChange={(e) => {
                                this.handleChange(e);
                              }}
                              className="w-100"
                              id={response.responseId}
                              defaultValue={response.response}
                            />
                          </>
                    )}
                </div>
              </Col>
            </Row>{" "}
            <Row className="mb-3">
              <Col xs sm="12" lg="12"  id="retirementHousing3" >
                <label className="mb-1">
                  {this.state.formlabelData.label322 &&
                    this.state.formlabelData.label322.question}
                </label>
                <div className="d-flex justify-content-center align-items-center">
                  {this.state.formlabelData.label322 &&
                    this.state.formlabelData.label322.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Control
                              type="text"
                              name="miles"
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
              <Col xs sm="12" lg="10" id="retirementHousing4" >
                <label className="">
                  {this.state.formlabelData.label323 &&
                    this.state.formlabelData.label323.question}
                </label>
                <div className="d-flex flex-wrap justify-content-start align-items-center">
                  {this.state.formlabelData.label323 &&
                    this.state.formlabelData.label323.response.map(
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
                                  name="living"
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
              <Col  xs  sm="12"  lg="10"   id="retirementHousing5" >
                <label className="">
                  {this.state.formlabelData.label324 &&
                    this.state.formlabelData.label324.question}
                </label>
                <div className="d-flex flex-wrap justify-content-start align-items-center">
                  {this.state.formlabelData.label324 &&
                    this.state.formlabelData.label324.response.map(
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
                                  name="condominium"
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
              <Col xs sm="12" lg="10"  id="retirementHousing6">
                <label className="">
                  {this.state.formlabelData.label325 &&
                    this.state.formlabelData.label325.question}
                </label>
                <div className="d-flex flex-wrap justify-content-start align-items-center">
                  {this.state.formlabelData.label325 &&
                    this.state.formlabelData.label325.response.map(
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
                                  name="lifestyle"
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
              <Col xs sm="12" lg="10"  id="retirementHousing7">
                <label className="">
                  {this.state.formlabelData.label326 &&
                    this.state.formlabelData.label326.question}
                </label>
                <div className="d-flex flex-wrap justify-content-start align-items-center">
                  {this.state.formlabelData.label326 &&
                    this.state.formlabelData.label326.response.map(
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
                                  name="retirement"
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
            <div className="d-flex justify-content-end">
              <Button
                className="theme-btn"
                onClick={this.state.updateCaregiverSuitabilty ? this.handleUpdateSubmit : this.handlesubmit}
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
)(retirementhousingoptions);
