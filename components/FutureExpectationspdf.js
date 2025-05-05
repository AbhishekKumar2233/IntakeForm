import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container,Nav, Dropdown, Collapse, Breadcrumb,} from "react-bootstrap";


import { $CommonServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import { futureExpectation } from "./control/Constant";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import CurrencyInput from "react-currency-input-field";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import { globalContext } from "../pages/_app";
import { $AHelper } from "./control/AHelper";

export  class FutureExpectations extends Component {
  static contextType = globalContext
  constructor(props, context) {
    super(props, context);
    this.state = {
      userId: "",
      show: false,
      showPrimary: false,
      showSpouse: false,
      formlabelData: {},
      updateCaregiverSuitabilty: false,
      spouseDetail: [],
      beneficiaryAmount: "",
      disable:false,
      inhertiancefMoneySpouse: "",
      inhertiancefMoneyJoint: "",
      inhertiancefMoneyPrimary: "",
      nameError:"",

      primarymemberDetails: {},
      spouseDetailUserId: "",
      maritalStatusId : null,
    };
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
    this.getsubjectForFormLabelId(newuserId);
  }



  getsubjectForFormLabelId = (newuserid) => {
    let formlabelData = {};
    this.props.dispatchloader(true);
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
            $CommonServiceFn.InvokeCommonApi(
              "GET",
              $Service_Url.getSubjectResponse +
                newuserid +
                `/0/0/${formlabelData[label].questionId}`,
              "",
              (response) => {
                if (response) {
                    konsole.log("vishnudbres89", response.data.data)
                    this.props.dispatchloader(false);
                  if (response.data.data.userSubjects.length !== 0) {
                    let responseData = response.data.data.userSubjects[0];
                      this.props.dispatchloader(true);
                    for (let i = 0; i < formlabelData[label].response.length; i++) {
                        konsole.log(
                          "datashownatcaregiver at",
                          // data,
                          i,
                          response
                        );
                        this.props.dispatchloader(false);
                      if (
                        formlabelData[label].response[i].responseId ===
                        responseData.responseId
                      ) {
                        if (responseData.responseNature == "Radio") {
                          formlabelData[label].response[i]["checked"] = true;
                          formlabelData[label]["userSubjectDataId"] =
                            responseData.userSubjectDataId;
                          if (
                            responseData.questionId == 88 &&
                            responseData.responseId == 167
                          ) {
                              this.setState({
                                beneficiaryAmount: true,
                              });
                          }
                        } else if (responseData.responseNature == "Text") {
                          formlabelData[label].response[i]["response"] =
                            responseData.response;
                          formlabelData[label]["userSubjectDataId"] =
                            responseData.userSubjectDataId;
                          if (
                            responseData.response == "true" &&
                            formlabelData[label].questionId == 87
                          ) {
                              this.setState({
                            showPrimary: true,
                              });
                            formlabelData[label].response[i][
                                "checked"
                              ] = true;
                            formlabelData[label]["userSubjectDataId"] =
                              responseData.userSubjectDataId;
                          }
                          if (
                            responseData.response == "true" &&
                            formlabelData[label].questionId == 127
                          ) {
                              this.setState({
                                showSpouse: true,
                              });
                              formlabelData[label].response[i][
                                "checked"
                              ] = true;
                            formlabelData[label]["userSubjectDataId"] =
                              responseData.userSubjectDataId;
                          }
                          if (responseData.questionId == 123) {
                              this.setState({
                                ...this.state,
                                inhertiancefMoneyPrimary: responseData.response,
                              });
                          }                          if (responseData.questionId == 124) {
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
            this.toasterAlert(Msg.ErrorMsg, "Warning");
            this.setState({disable:false})
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
    return (
      <>
        
      <p className="p3 generate-pdf-main-color mt-2 mb-2">Future Expectation :</p>
      <Form.Group as={Row} className="mb-3">
        <div>
          <p className="mb-2">
            {this.state.formlabelData.label887 &&
                    this.state.formlabelData.label887.question}
          </p>
        </div>
        <Col lg="6">
          {this.state.formlabelData.label887 &&
                  this.state.formlabelData.label887.response.map(
              (response) => {
                 return (
               <>
              <Form.Check
                className="left-radio"
                label={$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.memberName)}
                type="checkbox"
                id={response.responseId}
                name={"primary"}
                checked={response.response == "true"}/>
              </>
            )})}
        </Col>
        <Col lg="6">
          {this.state.spouseDetailUserId !== "null" && (
            <>
              {this.state.formlabelData.label924 &&
                      this.state.formlabelData.label924.response.map(
            (response) => {
              return (
                <>
                  <Form.Check
                    className="left-radio"
                    label={$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.spouseName)}
                    type="checkbox"
                    id={response.responseId}
                    name="spouse"
                    checked={response.response == "true"}
                  />
                 </> 
                )})}          
            </>
          )}
        </Col>
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
                    decimalScale="2"
                  />
                            </>
                          );
                        } )}
            </div>
          ) : (
            ""
          )}
        </Col>
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
                    decimalScale="2"
                  />
                   </>
                )} )}
            </div>
          )}
        </Col>
      </Row>
    </>
  );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FutureExpectations);
