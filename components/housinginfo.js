import Router from "next/router";
import React, { Component } from 'react'
import Layout from '../components/layout'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, InputGroup, FormControl } from 'react-bootstrap';
import Retirementhousingoptions from '../components/retirementhousingoptions';
 import Housingcharacteristics from '../components/housingcharacteristics';
import Caregiversuitability from '../components/caregiversuitability';
import { $CommonServiceFn } from "../components/network/Service";
import { $Service_Url } from "../components/network/UrlPath";
import { Housing } from "../components/control/Constant";
import { connect } from "react-redux";
import { SET_LOADER } from "../components/Store/Actions/action";
import konsole from "./control/Konsole";
import {globalContext} from "../pages/_app"


export class housinginfo extends Component {
  static contextType = globalContext
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      iseditprofile: true,
      yourhouse: false,
      nohouse: false,
      
     
      fName: "",
      mName: "",
      lName: "",
      formlabelData: {},

      yourhouse1:{
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },

      nohouse1:{
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
  radioValue = (event) => {
    const eventId = event.target.id
    const eventName = event.target.name;
    const eventValue = event.target.value;
    konsole.log(event.target.value);
    if (eventName == "yourhouse" && eventValue == "Yes") {
      this.setState({ ...this.state, [eventName]: true,   yourhouse1:{ 
        userSubjectDataId: 0,
          responseId: eventId,
          subResponseData: eventValue,
           subjectId :  this.state.formlabelData.label318 &&
                        this.state.formlabelData.label318.questionId} });
    } else {
      this.setState({ ...this.state, [eventName]: false});
    }
  };
  noradioValue = (event) => {
    const eventId = event.target.id;
    const eventName = event.target.name;
    const eventValue = event.target.value;
    konsole.log(event.target.value);
    if (
      (eventName == "nohouse" && eventValue == "2") ||
      eventValue == "3" ||
      eventValue == "4" ||
      eventValue == "5"
    ) {
      this.setState({ ...this.state, [eventName]: true, nohouse1:{ 
        userSubjectDataId: 0,
          responseId: eventId,
          subResponseData: eventValue,
           subjectId :  this.state.formlabelData.label327 &&
                        this.state.formlabelData.label327.questionId} });
    } else {
      this.setState({ ...this.state, [eventName]: false });
    }
  };

  componentDidMount() {
    this.getsubjectForFormLabelId();
     let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
     this.setState({
       userId: newuserid,
     });
     this.fetchmemberbyID(newuserid);
  }

  getsubjectForFormLabelId = () => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    // Housing.formLabelId.map((id, index) => {
    //   let data = [id.id];
      konsole.log("id", data);
      $CommonServiceFn.InvokeCommonApi( "POST", $Service_Url.getsubjectForFormLabelId, Housing, (response) => {
          if (response) {
            const resSubData = response.data.data;

            konsole.log("Success res ", response);
            for (let resObj of resSubData) {
              let label = "label" + resObj.formLabelId;
              // let response = resObj.
              formlabelData[label] = resObj.question;
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
    // });
  };


  handlesubmit = () => {
    let inputdata = JSON.parse(JSON.stringify(this.state));

    let yourhouse1 = {
      userSubjectDataId: this.state.yourhouse1.userSubjectDataId,
      subjectId: this.state.yourhouse1.subjectId,
      subResponseData: this.state.yourhouse1.subResponseData,
      responseId: this.state.yourhouse1.responseId,
      userId: this.state.userId,
    };

    let nohouse1 = {
      userSubjectDataId: this.state.nohouse1.userSubjectDataId,
      subjectId: this.state.nohouse1.subjectId,
      subResponseData: this.state.nohouse1.subResponseData,
      responseId: this.state.nohouse1.responseId,
      userId: this.state.userId,
    };

    let totinptary =[];
    totinptary.push(yourhouse1);
    totinptary.push(nohouse1);
    
   
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

  fetchmemberbyID = (userid) => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getFamilyMemberbyID + userid,
      "",
      (response) => {
        if (response) {
          this.setState({
            userId: response.data.data.member.userId,
            fName: response.data.data.member.fName,
            mName: response.data.data.member.mName,
            lName: response.data.data.member.lName,
          });
          konsole.log("here is response", response);
        }
      }
    );
  };
  toasterAlert(test,type) {
    this.context.setdata($AHelper.toasterValueFucntion(true,test,type))
  }
  render() {

    console.log("thisstateformlabelDatalabel318",this.state.formlabelData)
    return (
      <Layout name={"Housing Information"}>
        <Row>
          <Col xs md="9">
            <Breadcrumb>
              <Breadcrumb.Item
                href="#"
                onClick={() => {
                  Router.push("./dashboard");
                }}
              >
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item href="#">Housing</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <div className="bg-white info-details ">
          <Container className="person-content mb-3 min-vh-100" id="housingId">
            <Row className="m-0 mb-4">
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
            <Row className="m-0 mb-3">
              <Col xs md="7" className=" ps-0 border-end" id="hosuingId#1">
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
                                  key="checkbox8"
                                  className="me-4 pe-3 mb-0 d-flex align-items-center"
                                >
                                  <Form.Check
                                    className="chekspace"
                                    type="radio"
                                    defaultValue={response.response}
                                    id={response.responseId}
                                    name="yourhouse"
                                    label={response.response}
                                    onChange={(event) => this.radioValue(event)}
                                  />
                                </div>
                              </div>
                            </>
                          );
                        }
                      )}
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-around border w-50 my-5">
                  <button className="white-btn border-start-0 border-top-0 border-bottom-0 border-right">
                    Retirement Housing Options{" "}
                  </button>
                  <Retirementhousingoptions />
                </div>
                {this.state.yourhouse ? (
                  <div className="mt-4" id="hosuingId#2">
                    <label className="mb-3">
                      {this.state.formlabelData.label327 &&
                        this.state.formlabelData.label327.question}
                    </label>
                    <div className="d-flex justify-content-start align-items-center">
                      {this.state.formlabelData.label327 &&
                        this.state.formlabelData.label327.response.map(
                          (response) => {
                            return (
                              <>
                                <div
                                  key="checkbox8"
                                  className="me-4 pe-3 mb-0 d-flex align-items-center"
                                >
                                  <Form.Check
                                    className="chekspace d-flex align-items-center"
                                    type="radio"
                                    id={response.responseId}
                                    defaultValue={response.response}
                                    name="nohouse"
                                    label={response.response}
                                    onChange={(event) =>
                                      this.noradioValue(event)
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
                {this.state.nohouse ? (
                  <>
                    <div className="d-flex align-items-center justify-content-around border w-50 my-5">
                      <button className="white-btn border-start-0 border-top-0 border-bottom-0 border-right">
                        Housing Characteristics{" "}
                      </button>
                      <Housingcharacteristics
                        fName={this.state.fName}
                        mName={this.state.mName}
                        lName={this.state.lName}
                        userId={this.state.userId}
                      />
                    </div>
                    <div className="d-flex align-items-center justify-content-around border w-50 my-5">
                      <button className="white-btn border-start-0 border-top-0 border-bottom-0 border-right">
                        Caregiver Suitability{" "}
                      </button>
                      <Caregiversuitability />
                    </div>
                  </>
                ) : (
                  ""
                )}
              </Col>
              <Col
                xs
                md="5"
                className="ps-0 d-flex align-content-between  flex-wrap"
              >
                <div className="ps-0 d-flex justify-content-center align-content-center w-100">
                  <a>
                    <img src="icons/zillow-icon.svg" alt="" />
                    API
                  </a>
                </div>
                <div className="ps-0 d-flex justify-content-end align-content-end w-100 position-absolute bottom-0 end-0 me-5">
                  <button
                    className="theme-btn me-4"
                    onClick={
                     this.handlesubmit
                    }
                  >
                    Save & Proceed to Financial{" "}
                  </button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(housinginfo);;

