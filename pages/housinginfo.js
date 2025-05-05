import Router from "next/router";
import React, { Component } from "react";
import Layout from "../components/layout";
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
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Retirementhousingoptions from "../components/retirementhousingoptions";
import Housingcharacteristics from "../components/housingcharacteristics";
import Caregiversuitability from "../components/caregiversuitability";
import { $AHelper } from "../components/control/AHelper";
import { $AHelper as $AHelperNew } from "../component/Helper/$AHelper";
import { $CommonServiceFn } from "../components/network/Service";
import { $Service_Url } from "../components/network/UrlPath";
import { Housing, handymanMoreInfo, mortgageBrokerMoreInfo, realtorMoreInfo } from "../components/control/Constant";
import { connect } from "react-redux";
import { SET_LOADER } from "../components/Store/Actions/action";
import { Msg } from "../components/control/Msg";
import konsole from "../components/control/Konsole";
import TosterComponent from "../components/TosterComponent";
import { globalContext } from "./_app";
import AlertToaster from "../components/control/AlertToaster";
import NewProServiceProvider from "../components/NewProServiceProvider";
import SummaryDoc from "../components/Summary/SummaryDoc";
import { getApiCall } from "../components/Reusable/ReusableCom";

export class housinginfo extends Component {
  static contextType = globalContext;
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      startDate: new Date(),
      iseditprofile: true,
      yourhouse1: false,
      nohouseHere1: false,
      disable: false,
      formlabelData: {},
      updateCaregiverSuitabilty: false,
      checkedHousingResponseId: "",
      familyMemberList: [],

      yourhouse: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },

      nohouseHere: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
    };
  }
  handleDate = (date) => {
    this.setState({
      startDate: new Date(),
    });
  };
  editprofile = () => {
    this.setState({
      iseditprofile: !this.state.iseditprofile,
    });
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
  };
  handleChange = (event) => {
    const eventId = event.target.id;
    const eventName = event.target.name;
    const eventValue = event.target.value;

    konsole.log(event.target.value);
    konsole.log(event.target.name);

    if (eventName == "yourhouse") {
      if (eventName == "yourhouse" && eventValue == "Yes") {
        this.setState({
          ...this.state,
          yourhouse1: eventValue,
          yourhouse: {
            userSubjectDataId: this.state.formlabelData.label318
              ? this.state.formlabelData.label318.userSubjectDataId
              : 0,
            responseId: eventId,
            subResponseData: eventValue,
            subjectId:
              this.state.formlabelData.label318 &&
              this.state.formlabelData.label318.questionId,
          },
        });
      } else {
        this.state.checkedHousingResponseId=""
        this.setState({
          ...this.state,
          nohouseHere1: false,
          yourhouse1: eventValue,
          yourhouse: {
            userSubjectDataId: this.state.formlabelData.label318
              ? this.state.formlabelData.label318.userSubjectDataId
              : 0,
            responseId: eventId,
            subResponseData: eventValue,
            subjectId:
              this.state.formlabelData.label318 &&
              this.state.formlabelData.label318.questionId,
          },
        });
      }
    } else if (eventName == "nohouseHere") {
      if (
        eventName == "nohouseHere" &&
        (
          eventValue == "1" ||
          eventValue == "2" ||
          eventValue == "3" ||
          eventValue == "4" ||
          eventValue == "5"
          )
      ) {
        this.setState({
          ...this.state,
          nohouseHere1: true,
          checkedHousingResponseId: eventId,
          nohouseHere: {
            userSubjectDataId: this.state.formlabelData.label327
              ? this.state.formlabelData.label327.userSubjectDataId
              : 0,
            responseId: eventId,
            subResponseData: eventValue,
            subjectId:
              this.state.formlabelData.label327 &&
              this.state.formlabelData.label327.questionId,
          },
        });
      } else {
        this.setState({
          ...this.state,
          nohouseHere1: false,
          nohouseHere: {
            userSubjectDataId: this.state.formlabelData.label327
              ? this.state.formlabelData.label327.userSubjectDataId
              : 0,
            responseId: eventId,
            subResponseData: eventValue,
            subjectId:
              this.state.formlabelData.label327 &&
              this.state.formlabelData.label327.questionId,
          },
        });
      }
    }
  };

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    this.setState({
      userId: newuserid,
    });
    this.getsubjectForFormLabelId(newuserid);
    this.fetchFamilyMembersList(newuserid);
  }

  handlesubmit = () => {
    this.setState({
      disable: true
    })
    let inputdata = JSON.parse(JSON.stringify(this.state));

    let yourhouse = this.state.yourhouse;

    let nohouseHere = this.state.nohouseHere;

    if (!this.state.updateCaregiverSuitabilty) {
      yourhouse["userId"] = this.state.userId;
      nohouseHere["userId"] = this.state.userId;
    }

    let totinptary = [];
    // totinptary.push(yourhouse);
    // totinptary.push(nohouseHere);

    if (
      yourhouse.subjectId !== 0 &&
      yourhouse.subResponseData !== "" &&
      yourhouse.responseId !== 0
    ) {
      totinptary.push(yourhouse);
    }
    if (
      nohouseHere.subjectId !== 0 &&
      nohouseHere.subResponseData !== "" &&
      nohouseHere.responseId !== 0
    ) {
      totinptary.push(nohouseHere);
    }
    let postData = {};
    if (this.state.updateCaregiverSuitabilty) {
      postData = {
        userId: this.state.userId,
        userSubjects: totinptary,
      };
    } else {
      postData = totinptary;
    }

    let method = this.state.updateCaregiverSuitabilty ? "PUT" : "POST";
    let url = this.state.updateCaregiverSuitabilty
      ? $Service_Url.putSubjectResponse
      : $Service_Url.postaddusersubjectdata;

    konsole.log("hosuning", JSON.stringify(postData), method, url);
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      method,
      url, // + "?userId=" + this.state.userId
      postData,
      (response) => {
        this.props.dispatchloader(false);
        konsole.log("Successsssss res" + JSON.stringify(response));
        if (response) {
          AlertToaster.success("Data saved successfully");

          // this.getsubjectForFormLabelId(this.state.userId);
          // this.props.handlenonretireproppopShow();

          Router.push({
            pathname: "./Finance",
          });
        } else {

        }
      }
    );
  };

  getsubjectForFormLabelId = (newuserid) => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, Housing, (response) => {
      if (response) {
          const subjectResponse = response.data.data;
          $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/0`, '', (response) => {
            if (response) {
              konsole.log("datashownatcaregiver formlabelData",subjectResponse, response);
              if (response.data.data.userSubjects.length !== 0) {
                this.setState({
                  updateCaregiverSuitabilty: true,
                });
                let responseData = response.data.data.userSubjects;
                this.props.dispatchloader(true);
                responseData?.map((answers)=>{
                for (let resObj of subjectResponse) {
                  let label = "label" + resObj.formLabelId;
                  formlabelData[label] = resObj.question;
                for (let i = 0; i < formlabelData[label].response.length; i++) {
                  if (formlabelData[label].response[i].responseId === answers.responseId) {
                    this.props.dispatchloader(false);
                    if (answers.responseNature == "Radio") {
                      formlabelData[label].response[i]["checked"] = true;
                      formlabelData[label]["userSubjectDataId"] = answers.userSubjectDataId;
                      if (answers.questionId == 27) {
                        this.setState({
                          checkedHousingResponseId: answers.responseId,
                        });
                      }
                      if (resObj.formLabelId == 318) {
                        this.setState({
                          yourhouse1: answers.response,
                        });
                      } else if ( resObj.formLabelId == 327 && (answers.response == "2" || answers.response == "3" || answers.response == "4" || answers.response == "5")) {
                        this.setState({
                          nohouseHere1: true,
                        });
                      }
                    } else if (answers.responseNature == "Text") {
                      formlabelData[label].response[i]["response"] =
                      answers.response;
                    }
                    formlabelData[label]["userSubjectDataId"] =
                    answers.userSubjectDataId;
                  }
                }
              }
            })
              }else{

                konsole.log("formlabelDataformlabelaaaData",formlabelData,subjectResponse)
                  for (let resObj of subjectResponse) {
                    let label = "label" + resObj.formLabelId;
                    formlabelData[label] = resObj.question;
                  }
                  this.setState({ formlabelData: formlabelData });
                konsole.log("formlabelDataformlabelaaaData",formlabelData,subjectResponse)
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
  };

  fetchFamilyMembersList = async (newuserid) => {
    this.props.dispatchloader(true);
    const _resultOfInsuranceDetail = await getApiCall('GET', $Service_Url.getFamilyMembers + newuserid);
    this.props.dispatchloader(false);
    const insDetails = _resultOfInsuranceDetail != 'err' ? _resultOfInsuranceDetail?.filter(item =>  $AHelperNew.$isCheckNoDeceased(item?.memberStatusId)) : []
    konsole.log("_resultOfInsuranceDetail13", _resultOfInsuranceDetail, insDetails)

     // Add the condition for setIsUpdate
    this.setState({"familyMemberList": insDetails});
  }

  toasterAlert(test, type) {
    this.context.setdata($AHelper.toasterValueFucntion(true, test, type));
  }

  render() {
    konsole.log("rquestionoption", this.state,this.state.formlabelData);

    return (
      <Layout name={"Housing Information"}>
        {/* <TosterComponent
      show={this.state.showalert}
                         onHide = {this.onHide}
                         text={Msg.ErrorMsg}
                         type="Warning"
       /> */}
        <Row className="pt-md-0 pt-2">
          <Col xs md="9">
            <Breadcrumb>
              <Breadcrumb.Item
                href="#"
                onClick={() => {
                  Router.push("./dashboard");
                }}
                className="ms-1"
              >
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item href="#">Housing</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid className="bg-white info-details" id="Finance">
          <Row className=" justify-content-between pt-2">
            <Col xs="12" sm="12" md="4" lg="3" className="cursor-pointer mb-2">
              <NewProServiceProvider
                uniqueKey="realtor"
                hideFilters={true}
                proSerDescTd="2"
                protypeTd="16"
                PageName="Realtor"
                sourceImg="/realtorRL.svg"
                showForm={3}
                formLabels={realtorMoreInfo}
                />
            </Col>
            <Col xs="12" sm="12" md="4" lg="3" className="cursor-pointer mb-2">
              <NewProServiceProvider
                uniqueKey="mortage"
                hideFilters={true}
                proSerDescTd="2"
                protypeTd="17"
                PageName="Mortgage Broker"
                sourceImg="/morgageBrokerRL.svg"
                showForm={3}
                formLabels={mortgageBrokerMoreInfo}
                />
            </Col>
            <Col xs="12" sm="12" md="4" lg="3" className="cursor-pointer mb-2">
              <NewProServiceProvider
                uniqueKey="handyman"
                hideFilters={true}
                proSerDescTd="2"
                protypeTd="4"
                PageName="Handyman Service"
                sourceImg="/handymanRL.svg"
                showForm={3}
                formLabels={handymanMoreInfo}
              />
            </Col>
          </Row>
        </Container>
        <div className="bg-white info-details mt-3" >
          <div className="person-content  min-vh-100" id="housingId" >
            <Row className="m-0 mb-4 paddTop">
              <Col xs md="12" className="d-flex align-items-start ps-0">
                <h5>
                  Please tell us about your housing situation. You may need to
                  take a few measurements, move around to review, or refer to a
                  map. However most of all, spends a few moments viewing your
                  home objectively and honestly - through the lens of an older
                  you.
                </h5>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs md="7" className="housinginfoBorder" id="hosuingId#1">
                <div>
                  <label className="mb-4">
                    {this.state.formlabelData.label318 &&
                      this.state.formlabelData.label318.question}
                  </label>
                  <div className="d-flex justify-content-start align-items-center">
                    {this.state.formlabelData.label318 &&
                      this.state.formlabelData.label318.response.map(
                        (response) => {
                          return (
                            <>
                              <div className="d-flex justify-content-center align-items-center">
                                <div
                                  key="checkbox812"
                                  className="me-4  mb-0 d-flex align-items-center"
                                >
                                  <Form.Check
                                    className="chekspace"
                                    type="radio"
                                    id={response.responseId}
                                    name="yourhouse"
                                    label={response.response}
                                    value={response.response}
                                    onChange={(event) => { this.handleChange(event)}}
                                    defaultChecked={response.checked}
                                  />
                                </div>
                              </div>
                            </>
                          );
                        }
                      )}
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-around border RetirementHousing-Div my-5">
                  <span className="white-btn retirementFont border-start-0 border-top-0 border-bottom-0 border-right">
                    Retirement Housing Options{" "}
                  </span>
                  <Retirementhousingoptions
                     yourhouse1={this.state.yourhouse1}
                     familyMemberList={this.state?.familyMemberList}
                  />
                </div>
                {this.state.yourhouse1 == "Yes" ? (
                  <div className="mt-4" id="hosuingId#2">
                    <label className="mb-3">
                      {this.state.formlabelData.label327 &&
                        this.state.formlabelData.label327.question}
                    </label>
                    <div className="d-flex flex-wrap justify-content-start align-items-center">
                      {this.state.formlabelData.label327 &&
                        this.state.formlabelData.label327.response.map(
                          (response) => {
                            return (
                              <>
                                <div
                                  key="checkbox821"
                                  className="me-2 pe-3 mb-0 d-flex align-items-center"
                                >
                                  <Form.Check
                                    className="chekspace d-flex align-items-center"
                                    type="radio"
                                    id={response.responseId}
                                    name="nohouseHere"
                                    label={response.response}
                                    value={response.response}
                                    onChange={(event) =>
                                      this.handleChange(event)
                                    }
                                    checked={
                                      response.responseId ==
                                      this.state.checkedHousingResponseId
                                    }
                                  />
                                </div>
                              </>
                            );
                          }
                        )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {this.state.yourhouse1 == "No" ? (
                  ""
                ) : this.state.nohouseHere1 && (this.state.checkedHousingResponseId == "51" || this.state.checkedHousingResponseId == "52" || this.state.checkedHousingResponseId == "53" | this.state.checkedHousingResponseId == "54")  ? (
                  <>
                    <div className="d-flex align-items-center justify-content-around border RetirementHousing-Div my-5">
                      <span className="white-btn border-start-0 border-top-0 border-bottom-0 border-right">
                        Housing Characteristics{" "}
                      </span>
                      <Housingcharacteristics />
                    </div>
                    <div className="d-flex align-items-center justify-content-around border RetirementHousing-Div my-5">
                      <span className="white-btn border-start-0 border-top-0 border-bottom-0 border-right">
                        Caregiver Suitability{" "}
                      </span>
                      <Caregiversuitability />
                    </div>
                  </>
                ) : (
                  ""
                )}
              </Col>         
            </Row>
            <Row className=" mb-3">
              <Col xs md="12" className=" financialBTN d-flex justify-content-between ps-0">
                 {/* ************************** ________SUMMARY_COMPONENT________************** */}
               <SummaryDoc btnLabel="View Housing Summary" modalHeader="Housing Detail" component="Housing" yourhouse1={this.state.yourhouse1}/>
                  {/* ************************** ________SUMMARY_COMPONENT________************** */}
                <button className="theme-btn" onClick={this.handlesubmit}  disabled={this.state.disable == true ? true : false}  > Save & Proceed to Finance</button>
              </Col>
            </Row>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(housinginfo);
