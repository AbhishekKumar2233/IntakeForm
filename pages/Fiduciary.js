import React, { Component } from "react";
import Router from "next/router";
import Layout from "../components/layout";
import { Form, Button, Table, Breadcrumb, Row, Col, Container } from "react-bootstrap";
import konsole from "../components/control/Konsole";
import { $CommonServiceFn } from "../components/network/Service";
import { $Service_Url } from "../components/network/UrlPath";
import Childdetails from "../components/childdetails";
import WrapperAddNewFid from "../components/WrapperAddNewFid";
import Spousedetails from "../components/spousedetails";
import { connect } from "react-redux";
import { SET_LOADER } from "../components/Store/Actions/action";
import { $postServiceFn } from "../components/network/Service";
import AlertToaster from "../components/control/AlertToaster";

class Fiduciary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      primaryuserID: "",
      spouseUserID: "",
      primaryusername: "",
      spouseUsername: "",
      Fiduciarylist: [],
      Beneficiarylist: [],
      showType: "Fiduciary",
      listofuserid: "primary",
      spouseUserID: null,
      editfiduciarybeneficiary: false,
      edituserid: "",
      showEditpopup: false,
      totalArray: [],
    };
  }

  componentDidMount() {
    let primaryuserId = sessionStorage.getItem("SessPrimaryUserId");
    let spouseuserId = sessionStorage.getItem("spouseUserId");
    let userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
    konsole.log(userDetailOfPrimary, "userDetailOfPrimary");
    this.setState({
      primaryuserID: primaryuserId,
      spouseUserID: spouseuserId,
      primaryusername: userDetailOfPrimary.memberName,
      spouseUsername: userDetailOfPrimary.spouseName,
    });

    this.FiduciaryList(primaryuserId);
    this.BeneficiaryByUserIdList(primaryuserId);
    this.SortList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.listofuserid != this.state.listofuserid || this.state.showEditpopup != this.state.editfiduciarybeneficiary) {
      let primaryuserID = sessionStorage.getItem("SessPrimaryUserId");
      this.FiduciaryList(primaryuserID);
      this.BeneficiaryByUserIdList(primaryuserID);

      this.setState({
        editfiduciarybeneficiary: false,
        showEditpopup: false,
      });
      this.SortList();
    }
  }

  callbackApiFunc = () => {
    let primaryuserID = sessionStorage.getItem("SessPrimaryUserId");
    let spouseUserID = sessionStorage.getItem("spouseUserId");
    konsole.log(this.state.listofuserid, "listofuserid");

    this.FiduciaryList(primaryuserID);
    this.BeneficiaryByUserIdList(primaryuserID);
    this.SortList();
  };

  FiduciaryList = (primaryuserID) => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFiduciaryDetailsByUserId + primaryuserID, "", (response) => {
      if (response) {
        konsole.log(response, "response");
        this.setState({
          Fiduciarylist: response.data.data.fiduciaries,
        });
        this.props.dispatchloader(false);
        this.SortList();
      }
    }
    );
  };

  BeneficiaryByUserIdList = (primaryuserID) => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getBeneficiaryDetailsByUserId + primaryuserID, "", (response) => {
      if (response) {
        konsole.log(response, "response");
        this.setState({
          Beneficiarylist: response.data.data.beneficiaries,
        });
        this.props.dispatchloader(false);
        this.SortList();
      }
    }
    );
  };

  SortList = async() => {
    const newArrayfid = this.state.Fiduciarylist.reduce((acc, curr) => {
      const { fiduciaryFullName, fiduciaryUserId, ...rest } = curr;
      acc.push({ memberName: fiduciaryFullName, userId: fiduciaryUserId, ...rest,});
      return acc;
    }, []);

    const newArrayben = this.state.Beneficiarylist.reduce((acc, curr) => {
      const { beneficiaryFullName, userRoleName, beneficiaryUserId, ...rest } = curr;
      acc.push({ memberName: beneficiaryFullName, userRolesName: userRoleName, userId: beneficiaryUserId, ...rest,});
      return acc;
    }, []);

    let finallist = [...newArrayfid, ...newArrayben];
    let shortfinallist = finallist.sort((a, b) => {return a.memberName.localeCompare(b.memberName);});

    function removeDuplicates(arr, prop) {
      return arr.filter((obj, pos, arr) => {
        return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
      });
    }
    let finaldata = removeDuplicates(shortfinallist, "userId");
    const foundIndex = finaldata.findIndex((item) => item.userId === this.state.primaryuserID);
    konsole.log("finaldata:", foundIndex, finaldata);
    if (this.state.spouseUserID && this.state.spouseUserID !== '') {
      let url = `${$Service_Url.postMemberRelationship}/${this.state.spouseUserID}?primaryUserId=${this.state.spouseUserID}`;
      let method = "GET";
      let results = await $postServiceFn.memberRelationshipAddPut(method, url);
      if (results) {
        let isBeneficiary= results?.data?.data?.isBeneficiary
        let isFiduciary= results?.data?.data?.isFiduciary
        konsole.log('isFiduciary:', isFiduciary, 'isBeneficiary:', isBeneficiary);
        if (isFiduciary === false && isBeneficiary === false) {
          finaldata = finaldata.filter((item) => item.userId !== this.state.primaryuserID);
        } else {
          finaldata[foundIndex].userRolesName = (isBeneficiary === false && isFiduciary === true)? 'Fiduciary': (isBeneficiary === true && isFiduciary === false)? 'Beneficiary': 'Beneficiary and Fiduciary';
        }
      }
    }
    
    
    this.setState({
      totalArray: finaldata,
    });
  };

  showlist = (type) => {
    this.setState({
      showType: type,
    });
  };

  checkedValue = (e) => {
    konsole.log(e, "retwyuio");
  };

  handleEditPopupClose = () => {
    this.setState({
      showEditpopup: !this.state.showEditpopup,
    });
  };


  filterFiduciaryList = (totalArray) => {
    let arr = [];
    let listofuserid = this.state.listofuserid;
    if (listofuserid == "primary") {
      arr = totalArray.filter(({ userId }) => userId !== this.state.primaryuserID)
    } else if (listofuserid == "spouse") {
      arr = totalArray.filter(({ userId }) => userId !== this.state.spouseUserID).map(d => (d.userId === this.state.primaryuserID) ? { ...d, rltnTypeWithSpouse: "Spouse" } : d);
    }
    return arr
  }

  saveFidData()
  {
    AlertToaster.success("Data saved successfully");
    Router.push("./dashboard");
  }


  render() {
    return (
      <div>
        <Layout name={"Fiduciary / Beneficiary"} >
          <Row>
            <Col>
              <Breadcrumb>
                <Breadcrumb.Item href="#" onClick={() => { Router.push("./dashboard"); }} className="ms-1">  {" "}  Home{" "}</Breadcrumb.Item>
                <Breadcrumb.Item href="#"> Fiduciary / Beneficiary</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <Container fluid className="info-details border p-0">
          <div className="pt-2 px-3 f-details w-100" style={{ backgroundColor: "#ffffff" }}>

          {/* <Container fluid className="info-details border-bottom p-0"> */}
          {/* <div className="pt-2 px-3 f-details w-100" style={{ backgroundColor: "#ffffff",height:"100vh" }}> */}
            {this.state.editfiduciarybeneficiary && (
              <Spousedetails
                handleEditPopupClose={this.handleEditPopupClose}
                show={this.state.showEditpopup}
                UserID={this.state.edituserid + "|" + "Fiduciary/Beneficiary"}
                name={"Edit Profile"}
                ParentUserID={this.state.listofuserid =='primary' ? this.state.primaryuserID : this.state.spouseUserID}
              />
            )}
            
            <div
              className=" d-flex p-1 align-items-center justify-content-between"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className="d-flex">
                <div class="form-check d-flex align-items-center justify-content-between">
                  <Form.Check class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onChange={() => this.setState({ listofuserid: "primary", })} defaultChecked></Form.Check>
                  <label class="form-check-label ps-1 pt-1 " for="flexRadioDefault1" >   {this.state.primaryusername}{" "} </label>
                </div>
                {(this.state.spouseUserID !== undefined && this.state.spouseUserID !== "null") &&
                  <div class="form-check d-flex ms-2  align-items-center justify-content-between">
                    <Form.Check class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={() => this.setState({ listofuserid: "spouse", })} ></Form.Check>
                    <label class="form-check-label ps-1 pt-1" for="flexRadioDefault2" >   {(this.state.spouseUsername) ? this.state.spouseUsername :  this.state.primaryusername +"- Spouse" } </label>
                  </div>
                }
                {(this.state.spouseUserID !== undefined && this.state.spouseUserID !== null && this.state.spouseUserID !== '')}
              </div>
              <WrapperAddNewFid memberUserId={this.state.primaryuserID} callbackApi={this.callbackApiFunc} text={"Fiduciary/Beneficiary"} refrencepage={"Fiduciary"} addedText={"fiduciary/beneficiary"}/>
            </div>
            <div className="mt-3 mb-3 FiduciaryBeneficiaryscroll h-100">
              <Table bordered className="h-60 vertical-scroll" style={{ backgroundColor: "#ffffff"}} >
                <thead style={{ position: "sticky" }}>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Relationship</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.filterFiduciaryList(this.state.totalArray).map((item) => (
                    <tr>
                      <td>{item.memberName}</td>
                      <td>{item?.userRolesName}</td>
                      <td>{this.state.listofuserid == "spouse" ? item.rltnTypeWithSpouse == null ? item.memberRelationshipName : item.rltnTypeWithSpouse : item.memberRelationshipName}</td>
                      <td>
                        {" "}
                        <button style={{ backgroundColor: "transparent", border: "none", }} onClick={() => { this.setState({ editfiduciarybeneficiary: true, showEditpopup: true, edituserid: item.userId, }); }} disabled={item.userId === this.state.primaryuserID} >   Edit </button>
                      </td>
                    </tr>
                  ))}
                 
                </tbody>
              </Table>           
            </div>
            {/* <Row>
              <Col xs md="12" className="d-flex align-items-center justify-content-end ps-0 mt-4" >
            <Row>
              <Col xs md="12" className="d-flex align-items-center justify-content-end ps-0 mt-4 mb-4" >
                <button className="theme-btn mb-3" onClick={() => { Router.push("/healthpage"); }}> Save & Proceed to Health</button>
              </Col>
            </Row> */}
            <div className="d-flex justify-content-end pb-5">
                <button className="theme-btn " onClick={this?.saveFidData}>Save</button>
            </div>
          </div>
          </Container>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Fiduciary);
