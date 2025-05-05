import Router from "next/router";
import React, { Component } from "react";
import {
  Button,
  Table,
  Form,
  Row,
  Col,
  Container,
  Dropdown,
  Breadcrumb,
  Card,
} from "react-bootstrap";
import Layout from "../components/layout";
import NonRetirementAssests from "../components/NonRetirementAssets";
import RetirementAssets from "../components/RetirementAssets";
import LifeInsurance from "../components/LifeInsurance";
import BusinessInterestAsset from "../components/BusinessInterestAsset";
import LongTermCareInsurancePolicy from "../components/LongTermCareInsurancePolicy";
import Mortgages from "../components/Mortgages";
import MonthlyIncome from "../components/MonthlyIncome";
import TaxInformation from "../components/TaxInformation";
import MonthlyExpenses from "../components/MonthlyExpenses";
import FinancialAdvisorMoreInfo from "../components/FinancialAdvisorMoreInfo";
import AccountantMoreInfo from "../components/AccountantMoreInfo";
import FutureExpectation from "../components/FutureExpectation";
import RealProperty from "../components/RealProperty";
import NonMonthlyExpenses from "../components/NonMonthlyExpenses";
import ProfessSearch from "../components/professSearch";
import konsole from "../components/control/Konsole";
import LiabilitiesType from "../components/LiabilitiesType";
import RealEstate from "../components/RealEstate";
import { $CommonServiceFn } from "../components/network/Service";
import { $Service_Url } from "../components/network/UrlPath";
import { connect } from "react-redux";
import { SET_LOADER } from "../components/Store/Actions/action";
import AlertToaster from "../components/control/AlertToaster";
import TransportationModal from "../components/Finance/TransportationModal";
import { demo } from "../components/control/Constant";
import NewProServiceProvider from "../components/NewProServiceProvider";
import SummaryDoc from "../components/Summary/SummaryDoc";
import { globalContext } from "./_app";


class Finance extends Component {
  static contextType = globalContext;
  constructor(props,context) {
    super(props);
    this.state = {
      questionId: 196,

      liabiltypopshow: false,
      taxpopupshow: false,
      realpropshow: false,
      retirepopshow: false,
      disable: false,
      nonretirepopshow: false,
      montheexpposshow: false,
      monthlyIncomeShow: false,
      isNotBookkeeperJSON: [],
      userId: "",
      userSubDataIdOfBookToUncheck: "",
    };
  }

  componentDidMount() {
    this.setState(
      {
        userId: sessionStorage.getItem("SessPrimaryUserId"),
      },
      () => this.getSubjectResponse()
    );
  }

  getSubjectResponse = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getSubjectResponse +
      this.state.userId +
      `/0/0/${this.state.questionId}`,
      "",
      (response, error) => {
        this.props.dispatchloader(false);
        konsole.log("response bookkeeper", response, error);
        if (response) {
          if (response.data.data.userSubjects.length > 0) {
            this.setState({ userSubDataIdOfBookToUncheck: response.data.data?.userSubjects[0].userSubjectDataId })
            this.setNotBookkeepeer(response.data.data.userSubjects);
          } else {
            this.setNotBookkeepeer([]);
          }
        } else if (error) {
          this.setNotBookkeepeer([]);
        }
      }
    );
  };

  setNotBookkeepeer = (json) => {
    konsole.log("isNotBookkeeperJSON1212", json)
    this.setState({
      isNotBookkeeperJSON: json,
    });
  };

  handleLiablitypopShow = () => {
    if(this.context?.pageTypeId === null){
      this.context.setPageTypeId(23)
    }else{
      this.context.setPageTypeId(null)
    }
    this.setState({
      liabiltypopshow: !this.state.liabiltypopshow,
    });
  };

  handlemonthIncomePopShow = () => {
    if(this.context?.pageTypeId === null){
      this.context.setPageTypeId(24)
    }else{
      this.context.setPageTypeId(null)
    }
    this.setState({
      monthlyIncomeShow: !this.state.monthlyIncomeShow,
    });
  };

  handletaxpopShow = () => {
    if(this.context?.pageTypeId === null){
      this.context.setPageTypeId(25)
    }else{
      this.context.setPageTypeId(null)
    }
    this.setState({
      taxpopupshow: !this.state.taxpopupshow,
    });
  };
  handlerealproppopShow = () => {
    if(this.context?.pageTypeId === null){
      this.context.setPageTypeId(17)
    }else{
      this.context.setPageTypeId(null)
    }
    this.setState({
      realpropshow: !this.state.realpropshow,
    });
  };
  handleretireproppopShow = () => {
    if(this.context?.pageTypeId === null){
      this.context.setPageTypeId(16)
    }else{
      this.context.setPageTypeId(null)
    }
    this.setState({
      retirepopshow: !this.state.retirepopshow,
    });
  };
  handlenonretireproppopShow = () => {
   
    if(this.context?.pageTypeId === null){
      this.context.setPageTypeId(15)
    }else{
      this.context.setPageTypeId(null)
    }
    this.setState({
      nonretirepopshow: !this.state.nonretirepopshow,
    });
  };
  handlemonthexppopShow = () => {
    if(this.context?.pageTypeId === null){
      this.context.setPageTypeId(26)
    }else{
      this.context.setPageTypeId(null)
    }
    this.setState({
      montheexpposshow: !this.state.montheexpposshow,
    });
  };

  handleChange = (event) => {
    const eventId = event.target.id;
    const eventvalue = event.target.value;
    const eventChecked = event.target.checked;
    const NotBookkeeper = this.state.isNotBookkeeperJSON;
    const userSubjectDataId = NotBookkeeper.length > 0 ? NotBookkeeper[0].userSubjectDataId : 0;

    this.handleUpdateSubmit(userSubjectDataId, eventChecked, eventId);
  };

  handleUpdateSubmit = async (userSubjectDataId, subResponseData, responseId, subjectId) => {
    let inputData = {
      userId: this.state.userId,
      userSubjects: [
        {
          userSubjectDataId: userSubjectDataId,
          subjectId: this.state.questionId || subjectId,
          subResponseData: subResponseData,
          responseId: responseId,
        },
      ],
    };

    konsole.log("bookkeeeper response json1212", inputData);
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "PUT",
      $Service_Url.putSubjectResponse,
      inputData,
      (response, error) => {
        this.setState({
          disable: false
        })
        this.props.dispatchloader(false);
        this.getSubjectResponse();
      }
    );
  };

  callFunctionLegalInfo = () => {
    this.setState({
      disable: true
    })
    Router.push("/LegalInfo");
    AlertToaster.success("Data saved successfully");
  };

  render() {
    const NotBookkeeper = this.state.isNotBookkeeperJSON;
    const isNotBookeeper = NotBookkeeper.length > 0 ? NotBookkeeper[0].response == "true" ? true : false : false;
    konsole.log("coding", this.state, isNotBookeeper);
    return (
      <Layout name={"Financial Information"}>
        {/* <Container> */}
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
                {" "}
                Home{" "}
              </Breadcrumb.Item>
              <Breadcrumb.Item href="#">
                {" "}
                Financial Information{" "}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        {/* </Container> */}
        <Container fluid className="bg-white info-details" id="Finance">
          <Row className=" justify-content-between pt-2">
            <Col xs="12" sm="12" md="4" lg="3" className="cursor-pointer mb-2">
              {/* <ProfessSearch
                protypeTd="1"
                PageName="Financial Advisor"
                sourceImg="/icons/Group 504.svg"
                typeofcom="FinancialAdvisorMoreInfo"
              /> */}
              <NewProServiceProvider
                uniqueKey="financeAdvisor"
                hideFilters={true}
                proSerDescTd="3"
                protypeTd="1"
                PageName="Financial Advisor"
                sourceImg="/financialAdvisorRL.svg"
                typeofcom="FinancialAdvisorMoreInfo"
              />
              {/* <div className="border d-flex justify-content-start py-1  ">
                <div key="checkbox1 ">
                  <FinancialAdvisorMoreInfo />
                </div>
                <p className="ms-2 pt-1">I don't have one</p>
              </div> */}
            </Col>
            <Col xs="12" sm="12" md="4" lg="3" className="cursor-pointer mb-2">
              {/* <ProfessSearch
                protypeTd="3"
                PageName="Accountant"
                sourceImg="/icons/Group 503.svg"
                typeofcom="AccountantMoreInfo"
                handleChange={this.handleChange}
              /> */}
              <NewProServiceProvider
                uniqueKey="accountant"
                hideFilters={true}
                proSerDescTd="3"
                protypeTd="3"
                PageName="Accountant"
                sourceImg="/accountantRL.svg"
                typeofcom="AccountantMoreInfo"
                handleChange={this.handleChange}
              />
              {/* <div className="border d-flex justify-content-start pb-2  ">
                <div key="checkbox1 ">
                  <AccountantMoreInfo />
                </div>
                <p className="ms-2 pt-1">I don't have one</p>
              </div> */}
            </Col>
            <Col xs="12" sm="12" md="4" lg="3" className="cursor-pointer mb-2">
              {/* <ProfessSearch
                protypeTd="12"
                PageName="Bookkeeper"
                sourceImg="/icons/Group 502.svg"
                isNotBookkeeper={isNotBookeeper}
                handleChange={this.handleChange}
                userSubDataIdOfBookToUncheck={this.state.userSubDataIdOfBookToUncheck}
                handleUpdateSubmit={this.handleUpdateSubmit}
              /> */}
              <NewProServiceProvider
                uniqueKey="bookkeeper"
                hideFilters={true}
                proSerDescTd="3"
                protypeTd="12"
                PageName="Bookkeeper"
                sourceImg="/bookkeeperRL.svg"
                isNotBookkeeper={isNotBookeeper}
                handleChange={this.handleChange}
                userSubDataIdOfBookToUncheck={this.state.userSubDataIdOfBookToUncheck}
                handleUpdateSubmit={this.handleUpdateSubmit}
              />
              {/* <div className="border d-flex justify-content-start pb-2  ">
                    <div key="checkbox1 ">
                      <Form.Check
                        className="ms-2"
                        type="checkbox"
                        id="checkbox1"
                      />
                    </div>
                    <p className="ms-2 pt-1">I don't have one</p>
                  </div> */}
            </Col>
          </Row>
        </Container>

        <Container fluid className="bg-white info-details pt-3 ">
          <div className="boxBorderStyle">
            <Row className=" person-head m-0">
              <Col className="p-0">
                <div className="d-flex align-items-center justify-content-between ">
                  <div className="content-box">
                    <div className="d-flex d-flex align-items-center justify-content-start">
                      {" "}
                      <img src="/icons/AssetsIcon.png" alt="Assets" />
                      <h4 className="ms-2">Assets</h4>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="d-flex justify-content-center aligin-items-center m-4">
              <Col xs md="12">
                <Row className="">
                  <Col
                    xs="12"
                    sm="12"
                    md="4"
                    onClick={this.handlenonretireproppopShow}
                    className="cursor-pointer mb-3"
                  >
                    <div className="d-flex align-items-center border py-1">
                      <div className="flex-grow-1 ms-2 border-end">
                        Non-Retirement Financial Assets
                      </div>
                      <a>
                        <img
                          className="px-2"
                          src="/icons/add-icon.svg"
                          alt="health Insurance"
                        />
                      </a>
                      <div className="border-start"></div>
                    </div>
                  </Col>
                  {this.state.nonretirepopshow && (
                    <NonRetirementAssests
                      handlenonretireproppopShow={
                        this.handlenonretireproppopShow
                      }
                      show={this.state.nonretirepopshow}
                    />
                  )}
                  <Col
                    xs="12"
                    sm="12"
                    md="4"
                    lg="4"
                    onClick={this.handleretireproppopShow}
                    className="cursor-pointer mb-3"
                  >
                    <div className="d-flex align-items-center border py-1">
                      <div className="flex-grow-1 ms-2 border-end">
                        Retirement Financial Assets
                      </div>
                      <a>
                        <img
                          className="px-2"
                          src="/icons/add-icon.svg"
                          alt="health Insurance"
                        />
                      </a>
                      <div className="border-start"></div>
                    </div>
                  </Col>
                  {this.state.retirepopshow && (
                    <RetirementAssets
                      handleretireproppopShow={this.handleretireproppopShow}
                      show={this.state.retirepopshow}
                    />
                  )}
                  <Col
                    xs="12"
                    sm="12"
                    md="4"
                    lg="4"
                    onClick={this.handlerealproppopShow}
                    className="cursor-pointer mb-3"
                  >
                    <div className="d-flex align-items-center border py-1">
                      <div className="flex-grow-1 ms-2 border-end">
                        Real Estate
                      </div>
                      <a>
                        <img
                          className="px-2"
                          src="/icons/add-icon.svg"
                          alt="Real property"
                        />
                      </a>
                      <div className="border-start"></div>
                    </div>
                  </Col>
                  {this.state.realpropshow && (
                    // <RealProperty handlerealproppopShow={this.handlerealproppopShow} show={this.state.realpropshomb-3w}></RealProperty>
                    <RealEstate
                      handlerealproppopShow={this.handlerealproppopShow}
                      show={this.state.realpropshow}
                    />
                  )}
                </Row>
                <Row className="">
                  <LifeInsurance />
                  <BusinessInterestAsset />
                  <LongTermCareInsurancePolicy />
                </Row>
                <Row>
                  <FutureExpectation />
                  <TransportationModal />

                </Row>
              </Col>
            </Row>
          </div>
        </Container>
        <Container fluid className="bg-white info-details pt-3">
          <div className="boxBorderStyle">
            <Row className="m-0 person-head">
              <Col className="p-0">
                <div className="d-flex align-items-center justify-content-between ">
                  <div className="content-box">
                    <div className="d-flex d-flex align-items-center justify-content-start">
                      {" "}
                      <img src="/icons/LiabilitiesIcon.png" alt="liabilities" />
                      <h4 className="ms-2">Liabilities</h4>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="d-flex justify-content-center aligin-items-center m-4">
              <Col xs md="12" className="cursor-pointer">
                <Row className="mb-1">
                  <Col xs md="4" onClick={this.handleLiablitypopShow}>
                    <div className="d-flex align-items-center border py-1">
                      <div className="flex-grow-1 ms-2 border-end">
                        Liabilities
                      </div>
                      <a>
                        <img
                          className="px-2"
                          src="/icons/add-icon.svg"
                          alt=" Mortgages"
                        />
                      </a>
                      <div className="border-start"></div>
                    </div>
                  </Col>
                  {this.state.liabiltypopshow && (
                    // <Mortgages handleLiablitypopShow={this.handleLiablitypopShow} show={this.state.liabiltypopshow} />
                    <LiabilitiesType
                      handleLiablitypopShow={this.handleLiablitypopShow}
                      show={this.state.liabiltypopshow}
                    />
                  )}
                  {/* <Col xs md="4">
                          <div className="d-flex align-items-center border py-2">
                              <div className="flex-grow-1 ms-2">
                                Car Loans
                              </div>
                              <div className="border-start">
                                <Loans  title="Car Loans"/>
                              </div>
                          </div>
                      </Col>
                      <Col xs md="4">
                          <div className="d-flex align-items-center border py-2">
                              <div className="flex-grow-1 ms-2">
                                Student Loans
                              </div>
                              <div className="border-start">
                                <Loans  title="Student Loans"/>
                              </div>
                          </div>
                      </Col> */}
                </Row>
                {/* <Row className="mb-4">
                      <Col xs md="4">
                          <div className="d-flex align-items-center border py-2">
                              <div className="flex-grow-1 ms-2">
                              Credit Cards
                              </div>
                              <div className="border-start">
                                <Loans  title="Credit Cards"/>
                              </div>
                          </div>
                      </Col>
                      <Col xs md="4">
                          <div className="d-flex align-items-center border py-2">
                              <div className="flex-grow-1 ms-2 text-truncate">
                              Personal Loans
                              </div>
                              <div className="px-2 border-start">
                              <Loans  title="Personal Loans"/>
                              </div>
                          </div>
                      </Col>
                  </Row> */}
              </Col>
            </Row>
          </div>
        </Container>
        <Container fluid className="bg-white info-details pt-3">
          <div className="boxBorderStyle">
            <Row className="m-0 person-head">
              <Col className="p-0">
                <div className="d-flex align-items-center justify-content-between ">
                  <div className="content-box">
                    <div className="d-flex d-flex align-items-center justify-content-start">
                      {" "}
                      <img
                        src="/icons/MonthlyIncomeIcon.png"
                        alt="liabilities"
                      />
                      <h4 className="ms-2">Monthly Income</h4>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="d-flex justify-content-center aligin-items-center m-4">
              <Col xs md="12">
                <Row className="mb-1">
                  <Col
                    xs="12"
                    sm="12"
                    md="4"
                    lg="4"
                    onClick={this.handlemonthIncomePopShow}
                    className="cursor-pointer mb-3"
                  >
                    <div className="d-flex align-items-center border py-1">
                      <div className="flex-grow-1 ms-2 border-end">Monthly Income</div>
                      <div className="">
                        <a>
                          <img
                            className="px-2"
                            src="/icons/add-icon.svg"
                            alt="health Insurance"
                          />
                        </a>
                        <div></div>
                      </div>
                    </div>
                  </Col>
                  {this.state.monthlyIncomeShow && (
                    <MonthlyIncome
                      show={this.state.monthlyIncomeShow}
                      handlemonthIncomePopShow={this.handlemonthIncomePopShow}
                    />
                  )}
                  <Col
                    xs="12"
                    sm="12"
                    md="4"
                    lg="4"
                    onClick={this.handletaxpopShow}
                    className="cursor-pointer"
                  >
                    <div className="d-flex align-items-center border py-1">
                      <div className="flex-grow-1 ms-2 border-end">
                        Tax Information
                      </div>
                      <div className="">
                        <a>
                          <img
                            className="px-2 cursor-pointer"
                            src="/icons/add-icon.svg"
                            alt="Add Address"
                          />
                        </a>
                      </div>
                      {/* <div className="px-2 border-start"></div> */}
                    </div>
                  </Col>
                  <TaxInformation
                    handletaxpopShow={this.handletaxpopShow}
                    show={this.state.taxpopupshow}
                    // key={this.state.taxpopupshow}
                  />
                </Row>
              </Col>
            </Row>
          </div>
        </Container>
        <Container fluid className="bg-white info-details pt-3 mb-0">
          <div className="boxBorderStyle">
            <Row className="m-0 person-head">
              <Col className="p-0">
                <div className="d-flex align-items-center justify-content-between ">
                  <div className="content-box">
                    <div className="d-flex d-flex align-items-center justify-content-start">
                      {" "}
                      <img
                        src="/icons/CurrentExpensesIcon.png"
                        alt="liabilities"
                      />
                      <h4 className="ms-2">Currrent Expenses</h4>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="d-flex justify-content-center aligin-items-center m-4">
              <Col xs md="12">
                <Row className="mb-1">
                  <Col
                    xs
                    md="4"
                    onClick={this.handlemonthexppopShow}
                    className="cursor-pointer mb-3"
                  >
                    <div className="d-flex align-items-center border py-1">
                      <div className="flex-grow-1 ms-2 border-end">
                        Monthly Expenses
                      </div>
                      <a>
                        <img
                          className="px-2"
                          src="/icons/add-icon.svg"
                          alt=" Mortgages"
                        />
                      </a>
                      <div className="border-start"></div>
                    </div>
                  </Col>
                  {this.state.montheexpposshow && (
                    <MonthlyExpenses
                      handlemonthexppopShow={this.handlemonthexppopShow}
                      show={this.state.montheexpposshow}
                    />
                  )}
                  <NonMonthlyExpenses />
                </Row>
              </Col>
            </Row>
          </div>
          <Container fluid className="bg-white info-details" style={{ marginBottom: "10rem", marginTop: "4rem" }}>
            <Row>
            
              <Col xs md="12"  className="d-flex justify-content-between pb-4">
                 {/* ************************** ________SUMMARY_COMPONENT________************** */}
                <SummaryDoc  memberId={this.state.userId} btnLabel="View Finance Summary" modalHeader="Finance Detail" component="Finance"  />
                 {/* ************************** ________SUMMARY_COMPONENT________************** */}
                <button className="theme-btn" onClick={() => { this.callFunctionLegalInfo();}} disabled={this.state.disable == true ? true : false} >  Save & Proceed to Legal </button>
              </Col>
            </Row>
          </Container>

        </Container>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({ ...state.main });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Finance);
