import Router from "next/router";
import React, { Component } from "react";
import Layout from "../components/layout";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, InputGroup, FormControl, OverlayTrigger, Tooltip,} from "react-bootstrap";
import Healthinsurance from "../components/healthinsurance";
import Familymedicalhistory from "../components/familymedicalhistory";
import Personalmedicalhistory from "../components/personalmedicalhistory";
import ProfessSearch from "../components/professSearch";
import Lifestyle from "../components/lifestyle";
import { connect } from "react-redux";
import { SET_LOADER } from "../components/Store/Actions/action";
import { $Service_Url } from "../components/network/UrlPath";
import { $CommonServiceFn } from "../components/network/Service";
import { Msg } from "../components/control/Msg";
import { $AHelper } from "../components/control/AHelper";
import konsole from "../components/control/Konsole";
import TosterComponent from "../components/TosterComponent";
import { globalContext } from "../pages/_app";
import AlertToaster from "../components/control/AlertToaster";
import HeathStartingModal from "./HealthStartingModal";
import NewProServiceProvider from "../components/NewProServiceProvider";
import SummaryDoc from "../components/Summary/SummaryDoc";
import UserMedication from "../components/UserMedication";
import { paralegalAttoryId } from "../components/control/Constant";
import { isNotValidNullUndefile } from "../components/Reusable/ReusableCom";

export class healthpage extends Component {
  static contextType = globalContext;
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      iseditprofile: true,
      spouseUserId: null,
      AllFamilyMembers: [],
      PrimaryUserDetails: [],
      maritalStatusId:"",
      SpouseDetails: [],
      ChildDetails: [],
      comnPhysicianArr: [],
      disable:false,
      primaryuserName: "",
      showHeathStartingModal:true,
      newUserId:"",
      changeUser: false,
      loggedInRoleId:''
    };
  }

  componentDidMount() {
    let maritalStatusId = sessionStorage.getItem("maritalStatusId")
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let spouseUserId = sessionStorage.getItem("spouseUserId") || "";
    let primaryuserName = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))?.memberName || "";
    const loggedInRoleId=JSON.parse(sessionStorage.getItem("stateObj"))?.roleId || "";
    this.setState({
      maritalStatusId: maritalStatusId,
      userId: newuserid,
      spouseUserId: spouseUserId,
      primaryuserName: primaryuserName,
      loggedInRoleId:loggedInRoleId
    });
    let url = window.location.href;
    if (url.indexOf("query") != -1) {
      newuserid = url.split("query=")[1];
      this.setState({ userId: newuserid });
    }
    this.setState({newUserId:newuserid})
    if(paralegalAttoryId.includes(loggedInRoleId)){
      this.FetchFamilyMembers(newuserid);
    }
    // konsole.log("doneClickeddoneClicked",this.state.doneClicked)
  }

  functionForDicModal=(value)=>{
    konsole.log("functionForDicModalValueFromModalPage",value)
    this.setState({showHeathStartingModal:value})
    if(value==false) {
      this.setState({AllFamilyMembers: (this.state.maritalStatusId == 1 || this.state.maritalStatusId == 2) ? [{}, {}] : [{}]})
      this.FetchFamilyMembers(this.state.newUserId);
    }
  }

  FetchFamilyMembers = async (userid) => {
    this.setState({changeUser: false});
    userid = userid || this.state.userId;
    konsole.log("useridFamily",userid,this.state.userId)
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getFamilybyParentID + userid,"",async (response, error) => {
      konsole.log("SuccessFetchFamilyMembersres" + JSON.stringify(response),response);
      this.props.dispatchloader(false);
      if (response) {
        let tempdata = response.data.data;
        let tempallfamilymembers = [];
        let tempprimary = tempdata;
        let tempspouse = tempdata[0]?.children;
        //let tempChild = tempdata.filter((v, j) => (!(v.isPrimaryMember == true && v.relationshipName == "Spouse")));
        // konsole.log("temprimary",tempprimary);
        konsole.log("temprimary", tempspouse);

        tempallfamilymembers.push.apply(tempallfamilymembers, tempprimary);
        if (tempprimary.length > 0 &&(parseInt(tempprimary[0].maritalStatusId) == 1 ||  parseInt(tempprimary[0].maritalStatusId) == 2)){
          tempallfamilymembers.push.apply(tempallfamilymembers, tempspouse);
        }
        for (let i = 0; i < tempallfamilymembers.length; i++) {
          const responseFamily = await this.Fetchprimaryphysician( tempallfamilymembers[i]?.userId);
          if (responseFamily.length > 0) {
            konsole.log("responseforPrimary", responseFamily);
            tempallfamilymembers[i]["physicians"] = responseFamily;
          }
        }
        this.setState({
          ...this.state,
          AllFamilyMembers: tempallfamilymembers,
        });
      } else {
        this.toasterAlert(Msg.ErrorMsg, "Warning");
      }
    }
    );
  };

  Fetchprimaryphysician = (tempallfamilymembers) => {
    return new Promise((resolve, reject) => {
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getPrimaryPhysician + tempallfamilymembers, "", (response) => {
        this.props.dispatchloader(false);
        if (response) {
          resolve(response.data.data.physicians);
        } else {
          resolve([]);
        }
      }
      );
    });
  };

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
  toasterAlert(test, type) {
    this.context.setdata($AHelper.toasterValueFucntion(true, test, type));
  }

  callNewFunction = () => {
    this.setState({
      disable:true
    })
    AlertToaster.success("Data saved successfully");
    Router.push("/housinginfo");
  };

  render() {
    let tempprimaryPhysician = [];
    let tempSpousePhysician = [];
    let specialistSelf = [];
    let specialistSpouse = [];

    konsole.log();

    if (this.state.comnPhysicianArr.length > 0) {
      tempprimaryPhysician = this.state.comnPhysicianArr[0]?.filter((v, j) => v.is_Primary_Care == true );
      tempSpousePhysician = this.state.comnPhysicianArr[1]?.filter( (v, j) => v.is_Primary_Care == true);
      specialistSelf = this.state.comnPhysicianArr[0]?.filter( (v, j) => v.is_Primary_Care == false);
      specialistSpouse = this.state.comnPhysicianArr[1]?.filter( (v, j) => v.is_Primary_Care == false  );
    }
    konsole.log("showHeathStartingModalshowHeathStartingModal",this.state.showHeathStartingModal)

    const isFamilyDataLoaded = isNotValidNullUndefile(this.state.AllFamilyMembers?.[0]?.fName);

    const letPropefHeader= paralegalAttoryId.includes(this.state.loggedInRoleId) ? false : this.state.showHeathStartingModal;
    return (
      <Layout name={"Health Information"} shoowheader={letPropefHeader}>
        <Row className="pt-md-0 pt-2">
          {(this.state.showHeathStartingModal == true &&  !paralegalAttoryId.includes(this.state.loggedInRoleId) ) ?
            <HeathStartingModal functionForDicModal={this.functionForDicModal} ></HeathStartingModal>
            : <></>}

          <Col xs md="9">
            <Breadcrumb>
              <Breadcrumb.Item href="#" onClick={() => { Router.push("./dashboard") }} className="ms-1"> Home</Breadcrumb.Item>
              <Breadcrumb.Item href="#">Health</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <div className="bg-white min-vh-100 healthPageDiv">
          {this.state.AllFamilyMembers.length > 0 && (
            <>
              {this.state.AllFamilyMembers.map((member, index) => {
                return (
                  <>
                    <Container fluid key={index} className="info-details border-bottom">
                      <Row className="f-details person-head m-2">
                        <Col xs md="10" className="p-0 m-0">
                          <div className="d-flex align-items-md-center py-2 healthpagecolumn" style={{ width: "120%" }}>
                            <div className="flex-shrink-0 hide-div-class">
                              <img  className="rounded-circle"  src="/icons/ProfilebrandColor.svg"  alt="user"/>
                            </div>
                            <div className="flex-grow-1 ms-md-3 mb-2 mb-md-0">
                              <div className="d-flex justify-content-between align-items-start col-12 mb-2 editpr-file">
                                <h3 className="me-4">
                                  {isFamilyDataLoaded ? $AHelper.capitalizeAllLetters(member.fName + " " + (member.mName !== null   ? member.mName   : "") + " " + member.lName) : ""}
                                </h3>
                              </div>
                              {member.relationshipName != null && member.relationshipName != undefined && (
                                <div className="d-flex justify-content-start align-items-start">
                                  <p className="me-4">{`${(this.state.maritalStatusId == 2 && member.relationship_Type_Id == 1) ? "Partner" : member.relationshipName}`} {" "}</p>
                                </div>
                              )}
                              {member.dob != null && member.dob != undefined && (
                                <div className="d-flex justify-content-start align-items-start">
                                  <p className="me-1">Born -</p>
                                  <p>{$AHelper.getFormattedDate(member.dob.split("T")[0])} </p>
                                </div>
                              )}
                            </div>
                            <div  className="flex-grow-1 mb-md-4 mb-2 rounded-top rounded-bottom widthformobileHealth"  style={{ width:"280px",   borderStyle: "dashed",    borderColor: "grey",  }} >
                              <div className="d-flex ">
                                <img   src="\icons\healthicons_doctor.svg"   style={{ width: "10%", height: "22px" }}   className="d-flex align-items-center justify-content-center"  />
                                <p className=" ms-2 mt-1 fs-5 ">   Primary Care Physician </p>
                              </div>
                              <div>
                                <ul style={{   fontSize: "15px",   color: "#720c20", }}>
                                  {member.physicians !== undefined &&  member.physicians.length > 0 &&  member.physicians.filter((item) => item.is_Primary_Care === true).map((item, index) => {
                                    const userPrimaryMap = item.userPrimaryCareMaps;
                                    return (
                                      <div key="index" className="d-flex">
                                        <li className="ms-3">
                                          {$AHelper.capitalizeAllLetters(item.docMemberName)}
                                        </li>
                                        {this.state.spouseUserId !== null && member.userId == this.state.spouseUserId ? (
                                          // <Form.Check  label={`  Same as ${this.state.primaryuserName}`}  checked={ userPrimaryMap.length == 2 }  className="custom-checkbox_primary" disabled />
                                          ( userPrimaryMap.length == 2 ? <p className="mt-1" style={{ fontSize: "12px", color: "#000000",fontWeight:"500",marginLeft:"1px"}}>(<img className="mt-0 mx-1" width="12px" src="\images\checkIcon.svg" /> <span style={{color:"#720c20"}}>{`Same as ${$AHelper.capitalizeAllLetters(this.state.primaryuserName)}`}</span>)</p>:"")
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-md-3 rounded-top rounded-bottom w-20 widthformobileHealth2"  style={{width:"280px", borderStyle: "dashed", borderColor: "grey", paddingLeft: "10px",  }}>
                              <div className="d-flex ">
                                <img src="\icons\Doctors Team.svg" />
                                <p className="mt-3 ms-1 fs-5">Specialist</p>
                              </div>
                              <div style={{ overflowY: "auto", height: "70px" }}  >
                                <ul  style={{ fontSize: "15px", color: "#720c20" }}>
                                  {member.physicians !== undefined && member.physicians.length > 0 && member.physicians.filter((item) => item.is_Primary_Care === false).map((item, index) => {
                                    let checkSameAs=item?.userPrimaryCareMaps.length ==2 ?true:false
                                    return (
                                      <div className="d-flex">
                                        <li key={index}> {$AHelper.capitalizeAllLetters(item.docMemberName)}</li>
                                        {this.state.spouseUserId !== null && member.userId == this.state.spouseUserId ?
                                          (
                                            //  <Form.Check label={`  Same as ${this.state.primaryuserName}`} checked={checkSameAs} className="custom-checkbox_primary" disabled/>
                                            (checkSameAs ? <p style={{ fontSize: "12px", color: "#000000",fontWeight:"500" }} className="ms-1 mt-1">(<img className="mt-0 mx-1" width="12px" src="\images\checkIcon.svg" /><span style={{color:"#720c20"}}>{`Same as ${ $AHelper.capitalizeAllLetters(this.state.primaryuserName)}`}</span>)</p> : "")
                                          ) : (
                                            <></>
                                          )}
                                      </div>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <div className="">
                        <Row className="m-0 mb-3 align-items-center mt-3 health-service mb-3">
                          <Col xs="12" sm="12" md="4" lg="4">
                            <InputGroup className="mb-4 input-group">
                              <InputGroup.Text>
                                <img src="/icons/h-insurance.svg" alt="" />
                              </InputGroup.Text>
                              <div className="form-control text-truncate" style={{  display: "flex",  justifyContent: "start",  alignItems: "center", }}>  Health Insurance</div>
                              <InputGroup.Text className="cursor-pointer">
                                <Healthinsurance UserDetail={member} />
                              </InputGroup.Text>
                            </InputGroup>
                          </Col>
                          <Col xs="12" sm="12" md="4" lg="4">
                            <InputGroup className="mb-4 input-group">
                              <InputGroup.Text>
                                <img src="/icons/phycisioncare.svg" alt="" />
                              </InputGroup.Text>
                              <div className="form-control text-truncate" style={{   display: "flex",   justifyContent: "start",   alignItems: "center", }}> Primary Care Physician  </div>
                              <InputGroup.Text>
                                {/* <ProfessSearch
                                  protypeTd="10"
                                  UserDetail={member}
                                  FetchFamilyMembers={this.FetchFamilyMembers}
                                // disableSpouseEdit = {
                                //   (this.state.spouseUserId !== null && member.userId == this.state.spouseUserId && (member.physicians !== undefined && member.physicians.length > 0) &&
                                //     member.physicians.filter(item => (item.is_Primary_Care === true && item.userPrimaryCareMaps.length == 2)).length > 0) ?
                                //     true
                                //       :
                                //     false
                                // }
                                // disableSpouseEdit={false}
                                /> */}
                                <NewProServiceProvider 
                                  uniqueKey={"physician" + index}
                                  proSerDescTd="1"
                                  protypeTd="10"
                                  UserDetail={member}
                                  FetchFamilyMembers={this.FetchFamilyMembers}
                                />
                              </InputGroup.Text>
                            </InputGroup>
                          </Col>

                          <Col xs="12" sm="12" md="4" lg="4">
                            <InputGroup className="mb-3 w-100  input-group">
                              <InputGroup.Text>
                                <img src="/icons/specialists.svg" alt="" className="" />
                              </InputGroup.Text>
                              <div className="form-control text-truncate" style={{   display: "flex",   justifyContent: "start",   alignItems: "center", }}> Specialists</div>
                              <InputGroup.Text>
                                {/* <ProfessSearch protypeTd="11" UserDetail={member} FetchFamilyMembers={this.FetchFamilyMembers}/> */}
                                <NewProServiceProvider 
                                  uniqueKey={"specialist" + index}
                                  proSerDescTd="1"
                                  protypeTd="11"
                                  UserDetail={this.state.changeUser == true ? this.state.AllFamilyMembers[(index+1) % 2] : this.state.AllFamilyMembers[index]}
                                  changeUser={() => {this.setState(oldState => {return {changeUser: !oldState.changeUser}})}}
                                  FetchFamilyMembers={this.FetchFamilyMembers}
                                />
                              </InputGroup.Text>
                            </InputGroup>
                          </Col>

                          <Col xs="12" sm="12" md="4" lg="4">
                            <InputGroup className="mb-4 input-group">
                              <InputGroup.Text>
                                <img src="/icons/familymedical.svg" alt="" />
                              </InputGroup.Text>
                              <div className="form-control text-truncate" style={{   display: "flex",   justifyContent: "start",   alignItems: "center", }} > Family Medical History </div>
                              <InputGroup.Text>
                                <Familymedicalhistory UserDetail={member} />
                              </InputGroup.Text>
                            </InputGroup>
                          </Col>
                          <Col xs="12" sm="12" md="4" lg="4">
                            <InputGroup className="mb-4 input-group">
                              <InputGroup.Text>
                                <img src="/icons/h-historymedication.svg" alt="" style={{padding:"0px 7px"}}/>
                              </InputGroup.Text>
                              {/* <div className="form-control d-flex align-items-center">Health History</div> */}
                              <div className="form-control d-flex align-items-center">Personal Medical History</div>
                              <InputGroup.Text>
                                <Personalmedicalhistory UserDetail={member} />
                              </InputGroup.Text>
                            </InputGroup>
                          </Col>
                          <Col xs="12" sm="12" md="4" lg="4">
                            <InputGroup className="mb-4 w-100 input-group">
                              <InputGroup.Text>
                                <img src="/icons/lifestyle.svg" alt="" style={{padding:"0px 2px"}} />
                              </InputGroup.Text>
                              <div className="form-control text-truncate" style={{   display: "flex",   justifyContent: "start",   alignItems: "center", }}> Lifestyle</div>
                              <InputGroup.Text>
                                <Lifestyle UserDetail={member} />
                              </InputGroup.Text>
                            </InputGroup>
                          </Col>
                          <Col xs="12" sm="12" md="4" lg="4">
                            <InputGroup className="mb-4 w-100 input-group">
                              <InputGroup.Text>
                                <img src="/icons/imgpsh_fullsize_anim.png" width='28px' alt="" style={{padding:"0px 0px",marginTop:"0px"}} />
                              </InputGroup.Text>
                              <div className="form-control text-truncate" style={{   display: "flex",   justifyContent: "start",   alignItems: "center", }}>Medication and Supplements</div>
                              <InputGroup.Text>
                                <UserMedication UserDetail={member} />
                              </InputGroup.Text>
                            </InputGroup>
                          </Col>
                        </Row>
                      </div>
                    </Container>
                  </>
                );
              })}

              <Container>
                <Row  style={{marginTop:"1rem",marginBottom:"11rem"}}>
                  <Col xs md="12" className="d-flex  justify-content-between  mb-3">
                  {/* ************************** ________SUMMARY_COMPONENT________************** */}
                  {isFamilyDataLoaded ? <SummaryDoc memberId={this.state.userId}  btnLabel="View Health Summary" modalHeader="Health Detail" component="Health" /> : ""}
                  {/* ************************** ________SUMMARY_COMPONENT________************** */}
                    <button className="theme-btn" onClick={() => {   this.callNewFunction(); }} disabled={this.state.disable == true ? true : false}> Save & Proceed to Housing</button>
                  </Col>
                </Row>
              </Container>
            </>
          )}
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({ ...state.main });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(healthpage);
