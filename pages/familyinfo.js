import Router from "next/router";
import React, { Component } from "react";
import Layout from "../components/layout";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, } from "react-bootstrap";
import Spousedetails from "../components/spousedetails";
import Childdetails from "../components/childdetails";
import Contact from "../components/contact";
import Address from "../components/address";
import Occupation from "../components/occupation";
import { connect } from "react-redux";
import { SET_LOADER } from "../components/Store/Actions/action";
import { $Service_Url } from "../components/network/UrlPath";
import { $getServiceFn, $postServiceFn, $CommonServiceFn, } from "../components/network/Service";
import { $AHelper } from "../components/control/AHelper";
import { Msg } from "../components/control/Msg";
import konsole from "../components/control/Konsole";
import AlertToaster from "../components/control/AlertToaster";
import { globalContext } from "./_app";
import { deceasedOrIncapcitatedId} from "../components/control/Constant";
import { demo } from "../components/control/Constant";
import { deceaseMemberStatusId,specialNeedMemberStatusId } from "../components/Reusable/ReusableCom";

export class familyinfo extends Component {
  static contextType = globalContext
  constructor(props) {
    super(props);
    this.state = {
      fidMemberByUserId: [],
      userId: "",
      disable: false,
      showEditpopup: false,
      EditProfieUserid: "",
      startDate: new Date(),
      iseditprofile: true,
      AllFamilyMembers: [],
      SpouseDetails: [],
      ChildDetails: [],
      showEditChildpopup: false,
      maritalStatusId: 0,
      childGenderId :0,
      childMaritalStatusId: 0,
      familyButtonborder: 1,
      familyButtonImg: 0,
      primaryMemberDetails: [],
      selectedChild: [],
      innerSpouseUserId:""
    };
  }

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    this.setState({
      userId: newuserid,
    });
    let url = window.location.href;
    if (url.indexOf("query") != -1) {
      newuserid = url.split("query=")[1];
      this.setState({ userId: newuserid });
    }
    this.FetchFamilyMembers(newuserid);
  }

  FetchFamilyMembers = (userid) => {
    userid = userid || this.state.userId;
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFamilybyParentID + userid, "", (response) => {
      this.props.dispatchloader(false);
      if (response) {
        if (response.data.data[0].maritalStatusId == 1 || response.data.data[0].maritalStatusId == 2) {
          if (response.data.data[0].children.length !== 0) {
            let spousedetails = response.data.data[0]?.children;
            this.setState({
              ...this.state,
              AllFamilyMembers: response.data.data,
            });
            this.setState({ primaryMemberDetails: response.data.data[0] })
            this.setState({ SpouseDetails: spousedetails, });
            this.setState({ ChildDetails: response.data.data[0].children[0].children, });
            this.setState({ maritalStatusId: response.data.data[0].maritalStatusId, });
          
            sessionStorage.setItem("spouseUserId", spousedetails[0].userId);
            this.fetchFidMemberbyUserId(userid);
          } else {     
            this.setState({ iseditprofile: false,familyButtonborder:2 });
            this.fetchFidMemberbyUserId(userid);
          }
        } else {
          if (response.data.data[0].children.length !== 0) {
            this.setState({
              ...this.state,
              AllFamilyMembers: response.data.data,
            });
            this.setState({ primaryMemberDetails: response.data.data[0] })
            this.setState({ ChildDetails: response.data.data[0].children, });
            this.setState({ maritalStatusId: response.data.data[0].maritalStatusId, });
            this.fetchFidMemberbyUserId(userid);
          } else {
            this.setState({ iseditprofile: false,familyButtonborder:2 });
            this.fetchFidMemberbyUserId(userid);
          }
        }
      }
    }
    );
  };
  handleDate = (date) => {
    this.setState({ startDate: new Date(), });
  };

  handleEditPopupClose = () => {
    this.setState({ showEditpopup: !this.state.showEditpopup, });
    this.FetchFamilyMembers(this.state.userId);
  };

  handleEditChildPopupClose = () => {
    this.FetchFamilyMembers(this.state.userId);
    this.setState({ showEditChildpopup: !this.state.showEditChildpopup, });
    
  };

  editprofile = () => {
    this.setState({ iseditprofile: false, });
  };

  InvokeEditprofileDetails = (userid, edittype,childrensData, childMaritalStatusId,genderId,lastName) => {
    if(childrensData && (childrensData.maritalStatusId == 1 || childrensData.maritalStatusId == 2) && childrensData.children?.length>0)
    {
        const spouseUserId=childrensData?.children[0]?.userId
        // console.log("spousdsdsdeid", childrensData.children[0].userId,childrensData)
        this.setState({ innerSpouseUserId: spouseUserId });
    }
    // konsole.log("childrensData",childrensData)
 
    this.setState({
      showEditpopup: !this.state.showEditpopup,
      EditProfieUserid: userid + "|" + edittype,
      childMaritalStatusId: childMaritalStatusId ? childMaritalStatusId : 0,
      inLawLastName:lastName
    });
    if(edittype == "In-Law"){
      this.setState({childGenderId:genderId})
    }
  };

  InvokeChildDetails = (userid, edittype, childdetails) => {
    this.setState({
      showEditChildpopup: !this.state.showEditChildpopup,
      EditProfieUserid: userid + "|" + edittype,
      selectedChild: childdetails
    });
  };
  fetchFidMemberbyUserId = (userid) => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getNonFamilyMember + userid, "", (response) => {
      this.props.dispatchloader(false);
      if (response) {
        let responseData=response?.data?.data?.filter(({relationshipTypeId})=>relationshipTypeId !=1 && relationshipTypeId !=3 && relationshipTypeId !=47 && relationshipTypeId !=48 && relationshipTypeId !=49 && relationshipTypeId !=50);
      
        console.log("responseData",responseData);
        this.setState({ fidMemberByUserId: responseData, });
      } else {
        this.props.dispatchloader(false);
        // alert(Msg.ErrorMsg);
      }
    }
    );
  };

  calculate_age = (dob) => {
    let Age = $AHelper.calculate_age(dob);
    // if(Age >= 18){
    //     this.setState({showChildSpouse: true});
    // }
    return Age;
  };

  returnNamewithoutdas = (value) => {
    if (value?.includes("-")) {
      let valuedata = value.split("-");
      valuedata.shift();
      return valuedata.join();
    } else {
      return value;
    }
  };

  getColorChange = (e) => {
    this.setState({
      familyButtonborder: e,
      familyButtonImg: e,
    });
  };

  dotIterate(length) {
    let dot = "";
    let i = 1;
    while (i <= length) {
      dot += ".";
      i++;
    }
    return <p className="fs-1">{dot}</p>;
  }

  newFunction = () => {
    this.setState({ disable: true })
    AlertToaster.success("Data saved successfully");

    setTimeout(() => {
      Router.push("/healthpage");
    }, 0);
  };

  memberChildDelete = async (item, type, relativeUserId, IsChildUserId) => {
    const childType = type == 'grandchild' ? 'Grand-Child' : 'Child'
    let loginuserId = sessionStorage.getItem("loggedUserId")
    let { memberId, userId, isFiduciary, isBeneficiary, children, userRelationshipId } = item;
    let childrenobj = children.length > 0 && children[0]
    konsole.log("childrenobjchildrenobj", childrenobj)
    let grandchildobj = childrenobj?.children?.some(item => item?.isFiduciary == true || item?.isBeneficiary == true)
    konsole.log("grandchildobj", grandchildobj)
    konsole.log("childrenchildren", childrenobj.children)
    konsole.log('childrenchildrenchildrenchildren', children)


    let userIdd = userId
    let memberIdd = memberId
    let deletedBy = loginuserId
    let memberRelationshipId = userRelationshipId
    let IsDeleteDescendant = false
    if (children.length !== 0) {
      IsDeleteDescendant = !await this.context.confirm(true, `Are you sure, you want to delete your ${type}.`, "Confirmation", "CHILD_DELETE")
    } else {
      let responseYesNO = await this.context.confirm(true, `Are you sure, you want to delete your ${type}.`, "Confirmation")
      konsole.log("responseYesNO", responseYesNO)
      if (responseYesNO == false) { return; }
    }
    konsole.log('IsDeleteDescendant', IsDeleteDescendant)
    if (IsDeleteDescendant == false && (isFiduciary == true || isBeneficiary == true)) {
      this.toasterAlert(`${childType} can't be delete when child is fiduciary or beneficiary, please remove child from fiduciary or beneficiary.`, "Warning")
      return;
    } else if (IsDeleteDescendant == true && (isFiduciary == true || isBeneficiary == true || childrenobj?.isFiduciary == true || childrenobj?.isBeneficiary == true || grandchildobj == true)) {
      this.toasterAlert(`${childType} and his family can't be deleted when his family is fiduciary or beneficiary, please remove them from has context menu fiduciary or beneficiary.`, "Warning")
      return;
    }
    konsole.log("CALLAPIFUN")
    this.props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deletememberchild + userIdd + "/" + memberIdd + "/" + deletedBy + "/" + memberRelationshipId + "/" + IsDeleteDescendant, '', async (res, err) => {
      this.props.dispatchloader(false)
      if (res) {
        konsole.log("deletememberchildres", res)
        await $getServiceFn.updateChildDetails(relativeUserId, IsChildUserId)
        AlertToaster.success("Information deleted successfully");
        // window.location.reload();
        this.FetchFamilyMembers(this.state.userId);
      } else {
        konsole.log("deletememberchilderr", err)
      }
    })
  }
  toasterAlert(text, type) {
    this.context.setdata({ open: true, text: text, type: type });
  }
  memberChildDeleteUser = async (item, type, relativeUserId, IsChildUserId) => {
    let loginuserId = sessionStorage.getItem("loggedUserId")
    let grandchildobj = item?.isFiduciary == true || item?.isBeneficiary == true
    let userIdd = item?.userId
    let memberIdd = item?.memberId
    let deletedBy = loginuserId
    let memberRelationshipId = item?.userRelationshipId

    let IsDeleteDescendant = false

     if(grandchildobj == true){
            this.toasterAlert(`It can't be delete when ${item?.relationshipName} is fiduciary or beneficiary, please remove ${item?.relationshipName} from fiduciary or beneficiary.`, "Warning")
         return;
       }else{
           IsDeleteDescendant = await this.context.confirm(true, `Are you sure, you want to delete your ${item?.relationshipName}.`, "warning")
       }
       if(IsDeleteDescendant == true){
       this.props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deletememberchild + userIdd + "/" + memberIdd + "/" + deletedBy + "/" + memberRelationshipId + "/" + IsDeleteDescendant, '', async (res, err) => {
      this.props.dispatchloader(false)
      if (res) {
        await $getServiceFn.updateChildDetails(relativeUserId, IsChildUserId)
        this.fetchFidMemberbyUserId(item?.primaryUserId);
        AlertToaster.success("Information deleted successfully");
        // window.location.reload();
      } else {
        konsole.log("deletememberchilderr", err)
      }
    })
     }
  }
 



  render() {
    konsole.log('primaryMemberDetails', this.state.primaryMemberDetails);
    konsole.log("fidMemberByUserId",this.state.fidMemberByUserId)
    // konsole.log("editProfile",this.state.iseditprofile,this.state.familyButtonborder)
    // konsole.log('ChildDetails', this.state.ChildDetails)
        // konsole.log('AllFamilyMembers',this.state.AllFamilyMembers)
    return (
      <>
        <Layout name={"Family Information"}>
        <div style={{ position: 'relative', top:0, width: '100%', background: 'linear-gradient(180deg, #FFFFFF 0%, #C4C4C4 100%)', zIndex:'1' }}>
        <Row >
            <Col xs md="9">
              <Breadcrumb>
                <Breadcrumb.Item href="#" onClick={() => { Router.push("./dashboard"); }} > Home</Breadcrumb.Item>
                {this.state.familyButtonborder === 1 && <Breadcrumb.Item className="d-flex">
                  <div href="#" style={{ listStyle: "none" }} onClick={() => { this.setState({ iseditprofile: true, }); }}>
                    {`${this.state.familyButtonborder === 1 ? "Family" : ""}`}</div>
                </Breadcrumb.Item>
                }
                {(this.state.iseditprofile == false && this.state.familyButtonborder === 2 )  && (
                  <Breadcrumb.Item href="#" onClick={() => { this.setState({ iseditprofile: false, }); }}>
                    &nbsp;{`${this.state.familyButtonborder === 2 ? "Extended Family / Friends" : ""}`}
                  </Breadcrumb.Item>
                )}
              </Breadcrumb>
            </Col>
          </Row>
          <div style={{ display: "flex", paddingBottom: "5px" }}>
            <div onClick={() => { this.setState({ iseditprofile: true, }); }}>
              <button className={`${this.state.familyButtonborder === 1 ? 'pb-3 pt-3 borderOnClick border rounded-top border-bottom bg-white' : "pt-2 pb-2 bg-none  rounded-top border "} d-flex justify-content-center align-items-center fw-bold border-0`} onClick={(e) => this.getColorChange(1)}>
                <div className="d-flex justify-content-center align-items-center gap-2" >
                  <div className="d-flex justify-content-center align-items-center">
                    {this.state.familyButtonborder === 1 ? (
                    <><img className="user-select-auto m-0 p-0" src="/icons/familyred.png" alt="Add Family Members " />{" "}</>
                   ) : ( <> <img className="user-select-auto m-0 p-0" src="/icons/familyNew.png" alt="Add Family Members "></img></>)}
                  </div>
                  <div className="d-flex justify-content-center align-items-center"> Family</div>
                </div>
              </button>
            </div>
            <div onClick={() => this.editprofile()} className="ms-2" >
              <button className={`${this.state.familyButtonborder === 2 ? 'pb-3 pt-3 borderOnClick border bg-white rounded-top border-bottom' : "pt-2 pb-2 border border-danger  rounded-top  "} d-flex justify-content-center align-items-center gap-2 fw-bold border-0 `} onClick={(e) => this.getColorChange(2)}>
                <div>
                  {this.state.familyButtonborder === 2 ? (
                    <> <img className="user-select-auto m-0 p-0" src="/icons/Group.png" alt="Add Family Members " />{" "}</>
                  ) : (
                    <> <img className=" user-select-auto m-0 p-0" src="/icons/business-teamTwo.png" alt="Add Family Members " /></>
                  )}
                </div>
                <div >Extended Family / Friends</div>
              </button>
            </div>
          </div>
          </div>
          {/* {this.state.showEditpopup && (
            <Spousedetails
              handleEditPopupClose={this.handleEditPopupClose}
              show={this.state.showEditpopup}
              UserID={this.state.EditProfieUserid}
              name={"Edit Profile"}
              ParentUserID={this.state.userId}
            />
          )} */}
          
          {this.state.showEditpopup && (
            <Spousedetails
              handleEditPopupClose={this.handleEditPopupClose}
              show={this.state.showEditpopup}
              UserID={this.state.EditProfieUserid}
              name={"Edit Profile"}
              maritalStatusId={this.state.maritalStatusId}
              childGenderId = {this.state.childGenderId}
              childMaritalStatusId={this.state.childMaritalStatusId}
              ParentUserID={this.state.userId}
              innerSpouseUserId={this.state.innerSpouseUserId}
              inLawLastName={this.state?.inLawLastName}
            />
          )}
          {this.state.showEditChildpopup && (
            <Childdetails
              handleEditPopupClose={this.handleEditChildPopupClose}
              show={this.state.showEditChildpopup}
              UserID={this.state.EditProfieUserid}
              // selectedChild={this.state.selectedChild}
              name={"Edit Profile"}
            />
          )}
          {this.state.iseditprofile == true ? (
            <div className="bg-white min-vh-100" id="familyInfoId">
              { }   {$AHelper.deceasedNIncapacititedFilterFun(this.state.ChildDetails).length > 0 && (
                <Container className="info-details">  
                  <div className="person-content dotvertical p-0 ">
               
                    {$AHelper.deceasedNIncapacititedFilterFun(this.state.ChildDetails)?.sort((a, b) => new Date(a.dob) - new Date(b.dob)).map((child, index) => {
                      let checkchildforboldtext = child?.fName?.includes('- Child -')
                      let chckchildspouse = child.children.length !== 0 && child?.children[0]?.fName.includes('- Spouse')
                      let { years, months, days } = (child?.dob !== null && child?.dob !== undefined && child?.dob !== '') && $AHelper.isUnder14Years(child.dob)
                      let chirnderages = (child.children.length !== 0 && child.children[0]?.dob !== undefined && child.children[0].dob !== null && child.children[0].dob !== '') && $AHelper.isUnder14Years(child.children[0]?.dob)
                      const childMemberStatusId=child?.memberStatusId
                      konsole.log('childMemberStatusId',childMemberStatusId)
                      konsole.log('childDetailchild',child)
                      return (
                        <div key={index} className={"m-0 p-2 cardSize d-flex align-items-center border-bottom overflow-auto"} >
                          {this.dotIterate(3)}
                          <div className="d-flex align-items-between flex-column justify-content-between  member-card p-2 m-0">
                            <div className="row mb-2 w-100">
                              <div className="flex-shrink-0 col-4 p-0 ps-3">
                                <img src="/icons/ProfilebrandColor2.svg" className="w-75" style={{ marginTop: "3px" }} alt="user" />
                              </div>

                              <div className=" editpr-file col-8 p-0 position-relative">
                                <div className="position-absolute top-0 end-0">
                                  <span className="text-primary" style={{ textDecoration: "underline", cursor: 'pointer' }} >
                                    <img src="/icons/deleteIcon.svg" alt="deleteicon" onClick={() => this.memberChildDelete(child, 'child', this.state.userId, false)} />
                                  </span>
                                </div>
                                {child.relationshipName && (
                                  <div className="d-flex justify-content-start align-items-start ">
                                    {/* <p className="me-2">Relation-</p> */}
                                    <p className="relationBold showDott "> {child.relationshipName} </p>
                                  </div>
                                )}

                                <div className="d-flex justify-content-between ">
                                  <p className={`${(!checkchildforboldtext) ? "relationBold" : " "} me-2 text-truncate`} > {$AHelper.capitalizeAllLetters(this.returnNamewithoutdas(child?.fName) + " " + child?.lName)}</p>
                                </div>
                                {(childMemberStatusId !=deceaseMemberStatusId) && <>
                                {child.dob && (
                                  <div className="d-flex justify-content-start align-items-start">
                                    <p> {" "} {(years != undefined && months !== undefined && days !== undefined) ? ` ${years + " years " + months + " months"} ` : ""}
                                    </p>
                                  </div>
                                )}
                                </>}
                              </div>
                            </div>
                            <div className="d-flex align-items-end justify-content-between w-100 gap-2 p-2 pt-0">
                              <div className="">
                              {(childMemberStatusId !==deceaseMemberStatusId && childMemberStatusId !==specialNeedMemberStatusId) && 
                                <div key="checkbox12311" className="">
                                  <Form.Check
                                    className="form-check-smoke" type="checkbox" id="checkbox1" label="Fiduciary" checked={child ? child.isFiduciary : ""} disabled />
                                </div>}
                                {(childMemberStatusId !==deceaseMemberStatusId) && 
                                <div key="checkbox15757" className="mt-1">
                                  <Form.Check className="form-check-smoke" type="checkbox" id="checkbox1" label="Beneficiary" checked={child ? child.isBeneficiary : ""} disabled />
                                </div>}
                              </div>
                              <a className="text-primary" style={{ textDecoration: "underline" }} onClick={() => this.InvokeEditprofileDetails(child.userId, "Child",child)}> Edit </a>
                            </div>
                          </div>

                          {$AHelper.calculate_age(child.dob) >= 16 &&
                            (child.maritalStatusId == 1 || child.maritalStatusId == 2) && child.children.length > 0 ? (
                            (child.children[0].relationship_Type_Id == 1 || child.children[0].relationship_Type_Id == 44 || child.children[0].relationship_Type_Id == 47 || child.children[0].relationship_Type_Id == 48 || child.children[0].relationship_Type_Id == 49 || child.children[0].relationship_Type_Id == 50) && (
                              <>
                                {this.dotIterate(3)}
                                <div className="d-flex align-items-start justify-content-between flex-column member-card p-2">
                                  <div className="row mb-2 w-100">
                                    <div className="flex-shrink-0 col-4 p-0 ps-3">
                                      <img src="/icons/ProfilebrandColor2.svg" className="w-75" style={{ marginTop: "3px" }} alt="user" />
                                    </div>
                                    <div className=" editpr-file col-8 p-0">
                                      <div className="d-flex justify-content-between ">
                                        {child.relationshipName && (
                                          <div className="d-flex justify-content-start align-items-start">
                                            {/* <p className="me-2">Relation-</p> */}
                                            <p className="relationBold showDott"> {child.children[0].relationshipName}</p>
                                          </div>
                                        )}
                                      </div>
                                      <p className={`${(!chckchildspouse) ? "relationBold" : " "} text-truncate`} style={{ width: "90px" }}>
                                      {/* { (child.maritalStatusId == 2 && child.children[0].relationship_Type_Id == 1) ? 'Partner'} : {$AHelper.capitalizeAllLetters(this.returnNamewithoutdas(child.children[0]?.fName))+ " " + child?.children[0]?.lName)} */}
                                      { (child.maritalStatusId == 2 && child.children[0]?.relationship_Type_Id === 1)  ? 'Partner' : ((child.children[0]?.fName && child.children[0]?.lName) ? `${$AHelper.capitalizeAllLetters(child.children[0]?.fName)} ${child.children[0]?.lName}` : ' ')}
                                      </p>
                                      {child.dob && (
                                        <div className="d-flex justify-content-start align-items-start">
                                          <p> {" "} {(chirnderages != false) ? ` ${chirnderages?.years + " years " + chirnderages?.months + " months "} ` : ""}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="d-flex align-items-end justify-content-between w-100 gap-2 p-2">
                                    <div className="">
                                      <div key="checkbox121313">
                                        <Form.Check className="form-check-smoke" type="checkbox" id="checkbox1" label="Fiduciary" checked={child ? child.children[0].isFiduciary : ""} disabled />
                                      </div>
                                      <div key="checkbox16546" className="mt-1">
                                        <Form.Check className="form-check-smoke" type="checkbox" id="checkbox1" label="Beneficiary" checked={child ? child.children[0].isBeneficiary : ""} disabled />
                                      </div>
                                    </div>
                                    <a className="text-primary" style={{ textDecoration: "underline" }} onClick={() => this.InvokeEditprofileDetails(child.children[0].userId, "In-Law",undefined,child.maritalStatusId,child?.genderId,child?.lName)}> Edit</a>
                                  </div>
                                </div>
                              </>
                            )
                          ) : $AHelper.calculate_age(child.dob) >= 16 &&
                            child.maritalStatusId == 1 ? (
                            <>
                              {this.dotIterate(3)}
                              <div className="d-flex align-items-center flex-column member-card add-member-card justify-content-between ">
                                <div className="d-flex align-items-center h-100">
                                  <div className="flex-shrink-0">
                                    <h3>Add Spouse</h3>
                                  </div>
                                </div>
                                <div className="w-100 pt-3 text-center border-top pb-3" onClick={() => this.InvokeChildDetails(child.userId, "Spouse")} >
                                  <img className="ms-3" src="/icons/add-icon.svg" alt="Add Address4" />
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}

                          {$AHelper.calculate_age(child.dob) >= 16 &&
                            (child.maritalStatusId == 1 || child.maritalStatusId == 2) && child.children.length > 0 &&
                            (child.children[0].relationship_Type_Id == 1 || child.children[0].relationship_Type_Id == 44 || child.children[0].relationship_Type_Id == 47 || child.children[0].relationship_Type_Id == 48) &&
                            $AHelper.deceasedNIncapacititedFilterFun (child.children[0].children).length > 0 ? $AHelper.deceasedNIncapacititedFilterFun (child.children[0].children)?.map((grandChild, index) => {

                              let checkgrandchild = grandChild.fName.includes('- Child -')
                              let { years, months, days } = (grandChild?.dob !== null) && $AHelper.isUnder14Years(grandChild?.dob)


                              return (
                                <>
                                  {this.dotIterate(3)}
                                  <div className="d-flex align-items-between justify-content-between flex-column grandmember-card p-2">
                                    <div className="row mb-2 w-100">
                                      <div className="col-4 ">
                                        <img src="/icons/ProfilebrandColor2.svg" className="w-100" style={{ marginTop: "3px" }} alt="user" />
                                      </div>
                                      <div className=" editpr-file col-8 m-0 p-0">
                                        {grandChild.relationshipName && (
                                          <div className="d-flex justify-content-between ">
                                            <p className="text-truncate relationBold ">{grandChild.relationshipName}</p>
                                            <div className="d-flex justify-content-end ps-1 m-0">
                                              <img src="/icons/deleteIconWhite.svg" alt="deleteicon" className="m-0 m-0" onClick={() => this.memberChildDelete(grandChild, 'grandchild', child?.userId, true)} />
                                            </div>
                                          </div>
                                        )}

                                        <div className="d-flex justify-content-between ">
                                          <p className={`${!checkgrandchild ? "relationBold" : ""} me-2 text-truncate`} style={{ width: "85px" }} >
                                            {$AHelper.capitalizeAllLetters(this.returnNamewithoutdas(grandChild?.fName)+ " " + grandChild?.lName)}
                                          </p>
                                        </div>
                                        {child.dob && (
                                          <div className="d-flex justify-content-start align-items-start">
                                            <p>{" "} {(years != undefined && months !== undefined && days !== undefined) ? ` ${years + " years " + months + " months"} ` : ""}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="d-flex align-items-end justify-content-between w-100 gap-2 p-2 pt-0">
                                      <div className="">
                                        <div key="checkbox15435">
                                          <Form.Check className="form-check-smoke" type="checkbox" id="checkbox1" label="Fiduciary" checked={grandChild ? grandChild.isFiduciary : ""} disabled />
                                        </div>
                                        <div key="checkbox16577" className="mt-1">
                                          <Form.Check className="form-check-smoke" type="checkbox" id="checkbox1" label="Beneficiary" checked={grandChild ? grandChild.isBeneficiary : ""} disabled />
                                        </div>
                                      </div>
                                      <a className="text-primary" style={{ textDecoration: "underline", }} onClick={() => this.InvokeEditprofileDetails(grandChild.userId, "Grand-Child")}> Edit</a>
                                    </div>
                                  </div>
                                </>
                              );
                            }
                            ) :$AHelper.deceasedNIncapacititedFilterFun(child.children).length > 0 && child.children[0].relationship_Type_Id == 3
                            ?    $AHelper.deceasedNIncapacititedFilterFun (child.children)?.map((grandChild, index) => {
                              let checkgrandchild = grandChild.fName.includes('- Child -')
                              return (
                                <>
                                  {this.dotIterate(3)}
                                  <div className="d-flex align-items-start justify-content-between flex-column grandmember-card p-2">
                                    <div className="row mb-2 w-100">
                                      <div className="flex-shrink-0 col-4 p-0 ps-3">
                                        <img src="/icons/ProfilebrandColor2.svg" alt="user" className="w-75" />
                                      </div>
                                      <div className=" editpr-file col-8 p-0">
                                        <div className="d-flex justify-content-between position-relative">
                                          {grandChild.relationshipName && (
                                            <div className="d-flex justify-content-start align-items-start ">
                                              <div> <p className="text-truncate relationBold"> {grandChild.relationshipName}</p> </div>
                                              <div className="position-absolute top-0 end-0">
                                                <span className="text-primary" style={{ textDecoration: "underline", cursor: 'pointer' }} >
                                                  <img src="/icons/deleteIconWhite.svg" alt="deleteicon" className="m-0 text-light" onClick={() => this.memberChildDelete(grandChild, 'grandchild', child?.userId, true)} />
                                                </span>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <p className={`${!checkgrandchild ? "relationBold" : ""} me-2 text-truncate`} style={{ width: "85px" }} >
                                          {this.returnNamewithoutdas(grandChild?.fName)} {" " + grandChild?.lName}
                                        </p>
                                        {child.dob && (
                                          <div className="d-flex justify-content-start align-items-start">
                                            <p> {" "}{this.calculate_age(grandChild.dob) > 0 ? ` ${this.calculate_age(grandChild.dob)} years ` : ""}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="d-flex align-items-end justify-content-between w-100 gap-2 p-2 pt-0">
                                      <div className="">
                                        <div key="checkbox15435">
                                          <Form.Check className="form-check-smoke" type="checkbox" id="checkbox1" label="Fiduciary" checked={grandChild ? grandChild.isFiduciary : ""} disabled />
                                        </div>
                                        <div key="checkbox16577" className="mt-1">
                                          <Form.Check className="form-check-smoke" type="checkbox" id="checkbox1" label="Beneficiary" checked={grandChild ? grandChild.isBeneficiary : ""} disabled />
                                        </div>
                                      </div>
                                      <a className="text-primary" style={{ textDecoration: "underline", }} onClick={() => this.InvokeEditprofileDetails(grandChild.userId, "Grand-Child")}>Edit</a>
                                    </div>
                                  </div>
                                </>
                              );
                            })
                            : ""}
                          {$AHelper.calculate_age(child.dob) >= 16 && child.maritalStatusId !== 0 && (
                            <>
                              {this.dotIterate(3)}
                              <div className=" d-flex align-items-center flex-column grandmember-cards add-member-card justify-content-between ">
                                <div className="d-flex align-items-center h-100">
                                  <div className="d-flex flex-wrap pt-3">
                                    <h6 className="text-center new-child-tex-class" >Add Information About <br /> {$AHelper.capitalizeAllLetters(child?.fName)}'s Child</h6>
                                  </div>
                                </div>
                                <div className="w-100 pt-1 text-center border-top pb-3" onClick={() => this.InvokeChildDetails(child.userId, "Grand-Child", child)} >
                                  <img className="cursor-pointer" src="/icons/add-icon.svg" alt="Add Address8" />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Container>
              )}

              <Container className="info-details border-bottom">
                <div className="person-content pt-3 ps-0 border-bottom">
                  <Row className="m-0 mb-3 align-items-center">
                    <div className="d-flex align-items-center flex-column member-card1 add-member-card justify-content-between p-0">
                      <div className="d-flex align-items-center h-100">
                        <div className="flex-shrink-0"><h3>Add Child</h3></div>
                      </div>
                      <div className="w-100 p-0 pt-3 text-center border-top border-white pb-3" onClick={() => this.InvokeChildDetails(this.state.userId, "Child", this.state.primaryMemberDetails)}>
                        <img className="ms-1 cursor-pointer" src="/icons/add-icon.svg" alt="Add Address9" />
                      </div>
                    </div>
                  </Row>
                </div>
                <Row className="proceedtoHealthBtn" >
                  <Col xs md="12" className="d-flex align-items-center justify-content-end mt-3" style={{marginBottom:"5rem"}}>
                    <button className="theme-btn" onClick={() => { this.newFunction() }} disabled={this.state.disable == true ? true : false}>
                      Save & Proceed to Health
                    </button>
                  </Col>
                </Row>
              </Container>
            </div>
          ) : (
            <>
              <div className="bg-white info-details">
                <div className="border border-top-0 person-content mb-0 min-vh-75 p-2 ">
                  <Row className="m-0">
                    <Col xs md="3" className="d-flex align-items-start ps-0">
                      <div className="d-flex align-items-center justify-content-between border">
                        <button className="white-btn border-start-0 border-top-0 border-bottom-0 border-right "> Extended Family / Friends  {" "}</button>
                        <div className="text-center me-2" onClick={() => this.InvokeChildDetails(this.state.userId, "Extended Family / Friends")}>
                          <img className="ms-1 px-1 cursor-pointer" src="/icons/add-icon.svg" alt="Add Address10" />
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className=" mt-2 d-flex m-0 p-0 gap-2 w-100">
                    {this.state.fidMemberByUserId && 
                      $AHelper.deceasedNIncapacititedFilterFun(this.state.fidMemberByUserId)?.map((fidMem, i) => {
                      let { years, months, days } = (fidMem?.dob !== undefined && fidMem?.dob !== null && fidMem?.dob !== '') && $AHelper.isUnder14Years(fidMem.dob)

                      return (
                        <div className="d-flex  align-items-start justify-content-between flex-column member-card p-2 ">

                          <div className="d-flex justify-content-between w-100">
                         
                            <div className="d-flex">
                              <div><img className="w-75" src="/icons/ProfilebrandColor2.svg" alt="user" /></div>
                              <div className="m-auto editpr-file">
                              <div className="d-flex justify-content-between ">
                                <p className="me-2"> {$AHelper.capitalizeAllLetters(this.returnNamewithoutdas(fidMem?.fName)+" " + fidMem?.lName)}</p>
                              </div>
                              {fidMem.dob && (
                                <div className="d-flex justify-content-start align-items-start">
                                  <p> {" "} {(years != undefined && months !== undefined && days !== undefined) ? ` ${years + " years " + months + " months"} ` : ""} </p>
                              
                                </div>
                              )}
                              </div>
                            </div>
                              
                            
                           
                            <div className="mb-auto">
                                  <span className="text-primary" style={{ textDecoration: "underline", cursor: 'pointer' }} >
                                    <img src="/icons/deleteIcon.svg" alt="deleteicon" onClick={() => this.memberChildDeleteUser(fidMem, 'child', this.state.userId, false)} />
                                  </span>
                                </div>
                          </div>

                          <div className="d-flex w-100 justify-content-between align-items-end">
                       
                            <div className="d-flex  align-items-center justify-content-between">
                              <div className="w-100">
                                
                                <div key="checkbox875">
                                  <Form.Check className="form-check-smoke" type="checkbox" id="checkbox1" label="Fiduciary" checked={fidMem ? fidMem.isFiduciary : ""} disabled />
                                </div>
                                <div key="checkbox67865">
                                  <Form.Check className="form-check-smoke mt-2" type="checkbox" id="checkbox1" label="Beneficiary" checked={fidMem ? fidMem.isBeneficiary : ""} disabled />
                                </div>
                              </div>
                            </div>
                            <a className="text-primary " style={{ textDecoration: "underline" }}
                              onClick={() => this.InvokeEditprofileDetails(fidMem.userId, "Extended Family / Friends")}> Edit</a>
                          </div>
                        </div>
                      );
                    })}
                  </Row>
                </div>
                <Container className="proceedtoHealthBtn border">
                  <Row className="pt-3 pb-3">
                    <Col xs md="12" className="d-flex align-items-center justify-content-end">
                      <button className="theme-btn" onClick={() => { this.newFunction(); }}> Save & Proceed to Health</button>
                    </Col>
                  </Row>
                </Container>
              </div>
            </>
          )}
           </Layout>
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(familyinfo);
