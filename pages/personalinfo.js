import React, { Component } from "react";
import Router from "next/router";
import Layout from "../components/layout";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, InputGroup, } from "react-bootstrap";
import DatepickerComponent from "../components/DatepickerComponent";
import Contact from "../components/contact";
import Address from "../components/address";
import Occupation from "../components/occupation";
import { $getServiceFn, $postServiceFn, $CommonServiceFn, } from "../components/network/Service";
import konsole from "../components/control/Konsole";
import { $AHelper } from "../components/control/AHelper";
import { GET_Auth_TOKEN, GET_USER_DETAILS, SET_LOADER, } from "../components/Store/Actions/action";
import { connect } from "react-redux";
import { paralegalAttoryId, personal } from "../components/control/Constant";
import { Msg } from "../components/control/Msg";
import { $Service_Url } from "../components/network/UrlPath";
import PlaceOfBirth from "../components/PlaceOfBirth";
import AlertToaster from "../components/control/AlertToaster";
import moment from "moment";
import AddressListComponent from "../components/addressListComponent";
import ContactListComponent from "../components/ContactListComponent";
import TosterComponent from "../components/TosterComponent";
import { globalContext } from "../pages/_app";
import JointAccount from "../components/jointAccount";
import PersonalinfoComponent from "../components/PersonalinfoComponent";
import DeceaseSpouse from "../components/Deceased/DeceaseSpouse";
import MatNumber from "../components/MatNumber";
import ReferedBy from "../components/ReferedBy";
import { isNotValidNullUndefile, removeSpaceAtStart } from "../components/Reusable/ReusableCom";
import AlsoKnownAs from "../components/AlsoKnownAs";
import VeternCom from "../components/VeternCom";

export class personalinfo extends Component {
  static contextType = globalContext;
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      genderList: [],
      suffixList: [],
      maritalStatus: [],
      allAddress: [],
      allContactDetails: [],
      citizenshipType: [],
      showAddress: false,
      showContact: false,
      loggedInUser: "",
      personalInfo: {},
      dateOfWedding: "",
      dateOfDivoced: "",
      userId: "",
      loggedRoleId: '',
      fName: "",
      mName: "",
      lName: "",
      nickName: "",
      genderId: "0",
      maritalStatusId: "0",
      suffixId: "",
      birthPlace: "",
      spouseUserId: null,
      citizenshipId: null,
      noOfChildren: "0",
      dob: "",
      isVeteran: '',
      isPrimaryMember: true,
      nameError: "",
      spouseEmailId: "",
      isFiduciary: false,
      isBeneficiary: false,
      isBeneFiduuserRltnshipId: null,
      previousNoOfChildren: '',
      matNo: ''
    };
    this.occupationRef = React.createRef();
    this.fiduciaryRef = React.createRef();
    this.benefiRef = React.createRef();
    this.childRef = React.createRef();
    this.asKnownAsRef = React.createRef();
  }
  toggleChildVisibility = () => {
    if (this.childRef.current) {
      this.childRef.current.toggleVisibility();
    }
  };

  validate = () => {
    let nameError = "";
    if (this.state.fName == "") {
      nameError = "First Name cannot be blank";
    }
    if (this.state.lName == "") {
      nameError = "Last Name cannot be blank";
    }
    if (this.state.maritalStatusId == "0" || this.state.maritalStatusId == 0 || this.state.maritalStatusId == null) {
      nameError = "Relationship status cannot be blank";
    }
    if (this.state.birthPlace == " ") {
      nameError = "Birth Place cannot be blank";
    }
    if (this.state.citizenshipId == 0) {
      nameError = "Citizenship cannot be blank";
    }
    if (this.state.dob == "") {
      nameError = "Date of Birth cannot be blank";
    }
    if (this.state.allAddress.length >= 0) {
      const filterAddress = this.state.allAddress.filter((item) => parseInt(item.addressTypeId) === 1);
      if (filterAddress <= 0) nameError = "Please add physical address";
    }
    // if (this.state.genderId == 0) {
    //   nameError = "Gender cannot be blank";
    // }
    // if (this.state.genderId == 0) {
    //   nameError = "Gender cannot be blank";
    // }

    if (nameError) {
      this.toasterAlert(nameError, "Warning");
      return false;
    }
    return true;
  };

  async componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let loggedInUser = sessionStorage.getItem("loggedUserId") || "";
    let spouseUserId = sessionStorage.getItem("spouseUserId") || "";
    let loggedRoleId = JSON.parse(sessionStorage.getItem('stateObj')).roleId

    this.setState({
      userId: newuserid,
      loggedInUser: loggedInUser,
      spouseUserId: spouseUserId,
      loggedRoleId: loggedRoleId
    });
    const _maritalStatusId = await this.fetchmemberbyID(newuserid);
    if (_maritalStatusId == 1 || _maritalStatusId == 2) return;
    this.fetchGenderList();
    this.fetchSuffixList(this.props.authToken);
    this.fetchMaritalStatusList(this.props.authToken);
    this.fetchSavedContactDetails(newuserid);
    this.fetchCitizenshipType();
  }

  handleDate = (date) => {
    this.setState({
      startDate: date,
      dob: date,
    });
  };
  handleDates = (date) => {
    this.setState({
      dateOfWedding: date,
    });
  };
  handleDatesDivorced = (date) => {
    this.setState({
      dateOfDivoced: date,
    });
  };

  handlePlaceBirth = (event) => {
    let birthPlaceObj = "";
    if (event) {
      birthPlaceObj = event;
    }
    this.setState({
      birthPlace: birthPlaceObj,
    });
  };

  handlesecondChange = async (event) => {
    const eventId = event.target.id;
    const eventValue = event.target.value;
    const eventName = event.target.name;
    konsole.log("eventUd", eventId, eventValue);
    if (eventId == "fName" || eventId == "lName" || eventId == "nickName" || eventId == "mName" || eventId == "birthPlace" || eventId == "nickName") {
      let nameValue = $AHelper.capitalizeAllLetters(eventValue);
      nameValue = removeSpaceAtStart(nameValue)
      if ($AHelper.isRegexForAll(nameValue)) {
        this.setState({
          ...this.state,
          [eventId]: nameValue,
        });
      } else {
        this.setState({
          ...this.state,
          [eventId]: "",
        });
      }
    } else if (eventId == "noOfChildren") {
      if ($AHelper.isNumberRegex(eventValue) && eventValue.length <= 2) {
        if (eventValue > 10) {
          let ques = await this.context.confirm(true, "Are you sure would you like to add more child", "Confirmation");
          if (ques) {
            this.setState({
              ...this.state,
              [eventId]: eventValue,
            });
          } else {
            this.setState({
              noOfChildren: 0,
            });
          }
        } else {
          this.setState({
            ...this.state,
            [eventId]: eventValue,
          });
        }
      } else {
        this.toasterAlert("Please enter valid number", "Warning");
        this.setState({ noOfChildren: 0, });
      }
    }
    else if (eventId == 'isFiduciary' || eventId == 'isBeneficiary') {
      let datedob = this.state?.dob !== null && this.state?.dob !== "" && this.state?.dob !== undefined ? $AHelper.calculate_age($AHelper.getFormattedDate(this.state?.dob)) : 0;
      konsole.log("datedobdatedobdatedob", datedob)
      if (eventId == "isFiduciary" && datedob < 18) {
        this.toasterAlert("Please enter date of birth and fiduciary cannot be minor", "Warning");
        // this.fiduciaryRef.current.checked = false;
        this.setState({
          ...this.state,
          ['isFiduciary']: false,
        });
        return;
      }
      this.setState({
        ...this.state,
        [eventId]: event.target.checked,
      });
    }
    else {
      this.setState({
        [eventId]: eventValue,
      });
    }
  };
  handleBlur = () => {
    let previousNoOfChildren = this.state.previousNoOfChildren
    if (previousNoOfChildren !== undefined && previousNoOfChildren !== null && previousNoOfChildren !== '' && previousNoOfChildren > this.state.noOfChildren) {
      this.toasterAlert("You cannot decrease no. of child.", "Warning");
      this.setState({
        noOfChildren: previousNoOfChildren,
      });
      return;
    }
  }

  handleshowContact = () => {
    this.setState({
      showContact: !this.state.showContact,
    });
  };

  handleFocusOut = () => {
    let attrvalue = this.state.mName;
    if (attrvalue?.length === 1) {
      attrvalue = attrvalue + ".";
    }
    this.setState({
      mName: attrvalue,
    });
  };

  fetchmemberbyID = (userid) => {
    if (!userid) return;
    return new Promise((resolve, reject) => {
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFamilyMemberbyID + userid, "", (response) => {
        this.props.dispatchloader(false);
        konsole.log("family at personal", response);
        if (response) {
          let dob = "";
          let dateOfWedding = ""
          let dateOfDivoced = ""
          let { fName, mName, lName, nickName, birthPlace, userId, genderId, maritalStatusId, suffixId, citizenshipId, isVeteran, noOfChildren, spouseUserId, matNo } = response.data.data.member
          if (response.data.data.member.dob) {
            dob = new Date(response.data.data.member.dob);
          } else {
            dob = "";
          }
          if (response.data.data.member.dateOfWedding) {
            dateOfWedding = new Date(response.data.data.member.dateOfWedding)
          } else {
            dateOfWedding = ""
          }
          if (response.data.data.member.dateofDivorce) {
            dateOfDivoced = new Date(response.data.data.member?.dateofDivorce)
          } else {
            dateOfDivoced = ""
          }

       
          // sessionStorage.setItem("maritalStatusId",response.data.data?.member?.maritalStatusId)
          this.setState({
            personalInfo: response.data.data.member,
            userId: userId,
            fName: fName,
            matNo: matNo,
            mName: mName == null ? "" : mName,
            lName: lName,
            dob: dob,
            dateOfWedding: dateOfWedding,
            dateOfDivoced: dateOfDivoced,
            nickName: nickName == null ? "" : nickName,
            genderId: genderId,
            maritalStatusId: maritalStatusId,
            suffixId: suffixId,
            birthPlace: birthPlace == null ? "" : birthPlace,
            citizenshipId: citizenshipId || 187,
            isVeteran: isVeteran,
            noOfChildren: noOfChildren,
            previousNoOfChildren: noOfChildren,
          });
          // if(maritalStatusId == 1){
          //   this.fetchMemberRelationship(spouseUserId)
          // }
          if (maritalStatusId == 1 || maritalStatusId == 2) return resolve(maritalStatusId);
        }
        return resolve();
      }
      );
    })
  };

  fetchMemberRelationship = async (spouseUserId) => {
    if (!spouseUserId) return;
    konsole.log("spouseUserIdspouseUserId", spouseUserId)
    let url = $Service_Url.postMemberRelationship + spouseUserId
    let method = "GET"
    let results = await $postServiceFn.memberRelationshipAddPut(method, url)
    konsole.log("results", results)
    if (results) {
      let reponseData = results?.data?.data
      konsole.log("reponseData", reponseData)
      this.setState({
        ...this.state,
        isBeneFiduuserRltnshipId: reponseData?.userRltnshipId,
        isFiduciary: reponseData?.isFiduciary || false,
        isBeneficiary: reponseData?.isBeneficiary || false
      });

    }
  }
  fetchGenderList = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getGenderListPath, this.state, (response) => {
      this.props.dispatchloader(false);
      if (response) {
        this.setState({
          ...this.state,
          genderList: response.data.data,
        });
      }
    }
    );
  };

  fetchSuffixList = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getNameSuffixPath, this.state, (response) => {
      this.props.dispatchloader(false);
      if (response) {
        this.setState({
          ...this.state,
          suffixList: response.data.data,
        });
      }
    }
    );
  };

  fetchMaritalStatusList = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getMaritalStatusPath, this.state, (response) => {
      this.props.dispatchloader(false);
      if (response) {
        this.setState({
          ...this.state,
          maritalStatus: response.data.data,
        });
      }
    }
    );
  };

  handleDeleteContact = async (userid, contactId) => {
    konsole.log("ageon", contactId.contactId);
    let ques = await this.context.confirm(true, "Are you sure? You want to delete your Contact.", "Confirmation");
    if (ques) {
      this.props.dispatchloader(true);
      let jsonobj = {
        userId: userid,
        contactId: contactId?.contactId,
        deletedBy: this.state.loggedInUser,
      };
      konsole.log("responseeeeeerror", jsonobj);
      $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteContactPath, jsonobj, (response, error) => {
        this.props.dispatchloader(false);
        if (response) {
          konsole.log("responseeeeerror", response);
          this.fetchSavedContactDetails(userid);
        } else {
          this.toasterAlert(Msg.ErrorMsg, "Warning");
          konsole.log("responseeeeeerror", error);
        }
      }
      );
    }
  };

  handleRawDate = (ev) => {
    if (ev.type === "change") {
      let [month, date] = ev.target.value.split(/\-/);
      // konsole.log(month, date)
      if ((ev.nativeEvent.data && !/^[\d\-]+$/.test(ev.nativeEvent.data)) || ev.target.value.length > 10 || (ev.target.value.length === 3 && ev.target.value.indexOf("-") === -1) || (ev.target.value.length === 6 && ev.target.value.match(/\-/g).length !== 2)) {
        ev.preventDefault();
      }
      if (parseInt(month) > 12 || (date && parseInt(date) > 31)) {
        ev.target.value = ev.target.value.substr(0, ev.target.value.length - 1) + "-";
      }
      if ((/^\d+$/.test(ev.target.value) && ev.target.value.length === 2) || (ev.target.value.length === 5 && ev.target.value.match(/[0-9]/g).length === 4 && ev.target.value.match(/\-/g).length === 1)) {
        ev.target.value = ev.target.value + "-";
      }
    }
  };

  fetchSavedContactDetails = (userid) => {
    this.props.dispatchloader(true);
    userid = userid || this.state.userId;
    if (!isNotValidNullUndefile(userid)) return;
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAllContactOtherPath + userid, "", (response) => {
      this.props.dispatchloader(false);
      if (response) {
        this.setState({
          ...this.state,
          allContactDetails: response.data.data.contact,
        });
        konsole.log("responseatsav", response);
      } else {
        // alert(Msg.ErrorMsg);
        this.toasterAlert(Msg.ErrorMsg, "Warning");
      }
    }
    );
  };

  fetchCitizenshipType = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getCitizenshipType, this.state, (response) => {
      if (response) {
        this.props.dispatchloader(false);
        this.setState({
          ...this.state,
          citizenshipType: response.data.data,
        });
      }
    }
    );
  };

  checkVeternProfile = (checked) => {
    this.setState({ isVeteran: checked });
    konsole.log("isChecked" + checked);
  };

  handlepersonalinfosubmit = () => {
    let dow = this.state.dateOfWedding
    const inputData = {
      userId: this.state.userId,
      fName: this.state.fName,
      mName: this.state.mName,
      lName: this.state.lName,
      matNo: this.state.matNo,
      dob: $AHelper.getFormattedDate(this.state.dob),
      dateOfWedding: dow == "" ? null : $AHelper.getFormattedDate(dow),
      dateOfDivorce: this.state?.dateOfDivoced == "" ? null : $AHelper.getFormattedDate(this.state?.dateOfDivoced),
      nickName: this.state.nickName,
      genderId: this.state.genderId,
      maritalStatusId: this.state.maritalStatusId,
      suffixId: this.state.suffixId == "null" ? null : this.state.suffixId,
      birthPlace: this.state.birthPlace,
      citizenshipId: this.state.citizenshipId == "null" ? null : this.state.citizenshipId,
      noOfChildren: this.state.noOfChildren,
      isVeteran: this.state.isVeteran,
      isPrimaryMember: this.state.isPrimaryMember,
      updatedBy: this.state.loggedInUser,
      memberRelationshipVM: null,
    };
    konsole.log("konsole input Data at personal" + JSON.stringify(inputData));

    if (this.validate()) {
      let value = this.occupationRef.current.handleOccupationSubmit();
      if (value !== undefined) {
        if (value == "occuption") {
          this.toasterAlert("Occupation cannot be empty", "Warning");
          return;
        }
        // if (value == 'ageOfRetirement') {
        //   alert("Age of Retirement cannot be empty");
        //   return;
        // }
        if (value == "professBackground") {
          this.toasterAlert("Professional Background cannot be empty", "Warning");
          return;
        }
        if (value == "isDisabled") {
          this.toasterAlert("please select Disabled choice", "Warning");
          return;
        }
        if (value == "occuption") {
          this.toasterAlert("Occupation cannot be empty", "Warning");
          return;
        }
      }
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUpdateMember, inputData, async (response) => {
        if (response) {
          konsole.log("response personal", response);
          this.childRef.current.toggleVisibility();
          this.props.dispatchloader(false);
          const userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
          const responseData = response.data.data.member;
          konsole.log("responseDataresponseData", responseData)
          const mName = responseData.mName !== null && responseData.mName !== "" ? " " + responseData.mName + " " : " ";
          userDetailOfPrimary.memberName = responseData.fName + mName + responseData.lName;
          userDetailOfPrimary.usermob = responseData.fName + mName + responseData.lName;
          userDetailOfPrimary.memberId = responseData.memberId
          sessionStorage.setItem("userDetailOfPrimary", JSON.stringify(userDetailOfPrimary));
          if (responseData?.spouseUserId !== '00000000-0000-0000-0000-000000000000') {
            sessionStorage.setItem("spouseUserId", responseData?.spouseUserId);
          }
          if (this.asKnownAsRef?.current) {
            this.asKnownAsRef?.current?.saveOtherData(inputData?.userId);
          }

          if (responseData?.maritalStatusId == "1") {
            konsole.log("isBeneFiduuserRltnshipIda", this.state.isBeneFiduuserRltnshipId)
            let method = (this.state.isBeneFiduuserRltnshipId !== undefined && this.state.isBeneFiduuserRltnshipId !== null) ? 'PUT' : "POST"
            let url = $Service_Url.postMemberRelationship + `?RelativeMemberID=${responseData?.memberId}`
            let jsonObj = {
              "primaryUserId": responseData?.spouseUserId,
              "relationshipTypeId": 1,
              "isFiduciary": this.state.isFiduciary,
              "isBeneficiary": this.state.isBeneficiary,
              "relativeUserId": responseData?.spouseUserId,
            }
            if (method == 'PUT') {
              url = $Service_Url.postMemberRelationship
              jsonObj['userRltnshipId'] = this.state.isBeneFiduuserRltnshipId
              jsonObj['userMemberId'] = responseData?.memberId
            }
            konsole.log("jsonObjjsonObjaaa", JSON.stringify(jsonObj), this.state.isBeneFiduuserRltnshipId, method)
            let results = await $postServiceFn.memberRelationshipAddPut(method, url, jsonObj)
          }

          if (this.state.personalInfo.maritalStatusId === null && (this.state.maritalStatusId === "1" || this.state.maritalStatusId === "2")) {
            const spouseUserId = responseData.spouseUserId;
            const postAddAddress = {
              userId: spouseUserId,
              address: this.state.allAddress?.find((item) => parseInt(item.addressTypeId) === 1),
            }

            return this.handleMemberAddress(spouseUserId, postAddAddress.address.addressId, responseData.userId, this.state.loggedInUser);
          }

          return this.handleRouting(responseData.userId)
        }
      }
      );
    }
  };


  handleRouting = (userId, responseData) => {
    AlertToaster.success("Data saved successfully");
    Router.push({
      pathname: "./familyinfo",
      search: "?query=" + userId,
      state: {
        userid: userId,
        iseditprofile: true,
      },
    });
  }

  handleMemberAddress = (userId, addressId, primaryUserId, loggedInUser) => {
    this.props.dispatchloader(true);
    $postServiceFn.memberAddress(userId, addressId, primaryUserId, true, loggedInUser, (response) => {
      this.props.dispatchloader(false);
      if (response) {
        this.handleRouting(primaryUserId);
      }
    });
  };

  handleSelectR = async (event) => {
    const attrvalue = event.target.value;
    const attrId = event.target.id;

    switch (attrId) {
      case "maritalStatusId":
        let ques = await this.context.confirm(true, "Are you sure? if you select 'yes', you won't be able to change again", "Confirmation");
        if (ques) {
          this.setState({ maritalStatusId: attrvalue });
          event.target.disabled = true;
        } else {
          this.setState({ maritalStatusId: 0 });
        }
        break;
    }
  };

  InvokeEditContactID = (contactTypeId, EditContactType) => {
    if (contactTypeId.contactTypeId !== 1) {
      this.setState({
        EditContactType: EditContactType,
        EditContactId: contactTypeId,
      });
      this.handleshowContact();
    } else {
      this.toasterAlert("You cannot edit primary contact", "Warning");
    }
  };

  handleAddress = (allAddress) => {
    this.setState({
      allAddress: allAddress,
    });
  };
  toasterAlert(test, type) {
    konsole.log(this.context.setdata($AHelper.toasterValueFucntion(true, test, type)), this.context, test, "thiscontext");
  }
  handleChildData = (data) => {
    this.setState({ matNo: data });
  };

  render() {
    const authToken = this.props.authToken;
    return (this.state.maritalStatusId == 1 || this.state.maritalStatusId == 2) ? <PersonalinfoComponent maritalStatus={this.state.maritalStatusId} /> : (this.state.maritalStatusId && <Layout name={"Personal Information"}>
      <Row>
        <Col className="">
          <Breadcrumb>
            <Breadcrumb.Item href="#" onClick={() => { Router.push("./dashboard"); }} className="ms-1">{" "}Home{" "} </Breadcrumb.Item>
            <Breadcrumb.Item href="#">Personal Information</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      {(this.state.maritalStatusId == 0) ? null : <Container fluid className="bg-white info-details min-vh-100 w-100" id="personalFormId">
        <Row className="person-head">
          <Col className="p-0 w-100">
            <div className="d-flex align-items-center justify-content-between">
              <div className="content-box">
                <div className="d-flex align-items-center justify-content-start">
                  {" "} <img src="/icons/ProfilebrandColor2.svg" className="maleAvatarUser" alt="user" />
                  <h2 className="ms-2">{this.state.fName + " " + this.state.mName + " " + this.state.lName}</h2>
                </div>
              </div>

              {/*   ----***--------***----Decease Spouse Component  ----***--------***---- */}
              <div className="me-5">
                <DeceaseSpouse suffixList={this.state.suffixList} genderList={this.state.genderList} dateOfWedding={this.state.dateOfWedding} />
              </div>
              {/*   ----***--------***----Decease Spouse Component  ----***--------***---- */}
            </div>
          </Col>
        </Row>
        <div className="person-content">
          <Form.Group as={Row} className="">
            <Col xs="12" sm="12" md="4" lg="3" className="mb-3">
              <Form.Control required type="text" value={$AHelper.capitalizeAllLetters(this.state.fName)} placeholder={$AHelper.mandatory("First Name")} id="fName" onChange={(event) => { this.handlesecondChange(event); }} />
            </Col>
            <Col xs="12" sm="12" md="4" lg="3" className="mb-3">
              <Form.Control type="text" value={$AHelper.capitalizeAllLetters(this.state.mName)} placeholder="Middle Name" id="mName" onChange={(event) => this.handlesecondChange(event)} onBlur={this.handleFocusOut} />
            </Col>
            <Col xs="12" sm="12" md="4" lg="3" className="mb-3">
              <Form.Control type="text" value={$AHelper.capitalizeAllLetters(this.state.lName)} placeholder={$AHelper.mandatory("Last Name")} id="lName" onChange={(event) => this.handlesecondChange(event)} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="">
            <Col xs="12" sm="12" md="4" lg="3" className="mb-3">
              <Form.Select id="suffixId" value={this.state.suffixId} onChange={(event) => this.setState({ suffixId: event.target.value })} >
                <option value="" disabled selected hidden> Prefix / Suffix</option>
                {this.state.suffixList.map((suffix, index) => {
                  return (
                    <option key={index} value={suffix.value}>
                      {suffix.label}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
            <Col xs="12" sm="12" md="4" lg="3" className="mb-3">
              <Form.Select id="genderId" value={this.state.genderId} onChange={(event) => this.setState({ genderId: event.target.value })} >
                <option value="" disabled selected hidden>Gender</option>
                {this.state.genderList.map((gender, index) => {
                  return (
                    <option key={index} value={gender.value}>
                      {gender.label}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
            <Col xs="12" sm="12" md="4" lg="3" className="mb-3">
              <Form.Control type="text" value={this.state.nickName} placeholder="Nickname" id="nickName" onChange={(event) => this.handlesecondChange(event)} />
            </Col>

          </Form.Group>
          <Form.Group as={Row} className="">
            <Col xs="12" sm="12" md="4" lg="3" className="mb-3 mt-4">
              <AlsoKnownAs key={'personalInfo'} ref={this.asKnownAsRef} setLoader={this.props.dispatchloader} userId={this.state.userId} />
            </Col>
            <Col xs="12" sm="12" md="4" lg="3" className="mb-3">
              <label>Date of Birth*</label>
              <DatepickerComponent
                name="dob"
                value={this.state.dob}
                setValue={this.handleDate}
                placeholderText="D.O.B."
                maxDate="16"
                minDate="100"
                validDate={16} 
                dateOfWedding={this.state.dateOfWedding}
                />
            </Col>
            <Col xs="12" sm="12" md="4" lg="3" className="mb-3">
              <PlaceOfBirth birthPlace={this.state.birthPlace} handlePlaceBirth={this.handlePlaceBirth} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="">
            <Col xs="12" sm="12" md="4" lg="3" className="mb-3">
              <label>Citizenship</label>
              <Form.Select id="citizenshipId" value={this.state.citizenshipId} onChange={(event) => this.handlesecondChange(event)}>
                <option value="null" selected disabled hidden>Citizenship</option>
                {this.state.citizenshipType.map((city, index) => {
                  return (
                    <option key={index} value={city.value}>
                      {city.label}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
            <Col xs="12" sm="12" md="4" lg="3" className="mt-4" >
              <Form.Select id="maritalStatusId" value={this.state.maritalStatusId} onChange={(event) => this.handleSelectR(event)} disabled={this.state.maritalStatusId} className={this.state.maritalStatusId > 0 ? "maritalStatusClass" : ""}                >
                <option value="0" disabled selected hidden> {$AHelper.mandatory("Relationship Status")}</option>
                {this.state.maritalStatus.map((suffix, index) => {
                  return (
                    <option key={index} value={suffix.value}>
                      {suffix.label}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            {this.state.maritalStatusId == 2 || this.state.maritalStatusId == 3 ? "" : <>
              <Col xs sm="4" lg="3">
                <label>Date of Marriage</label>
                <DatepickerComponent
                  name="dow"
                  value={this.state.dateOfWedding}
                  setValue={this.handleDates}
                  placeholderText="Date of Marriage"
                  validDate={this.state.dob}
                  dateOfDivoced={this.state.dateOfDivoced}
                  maxDate='0'
                  tag={"weddingDate"} />
              </Col>
            </>}
            {this.state.maritalStatusId == 5 && <>
              <Col xs sm="4" lg="3">
                <label>Date of Divorced</label>
                <DatepickerComponent
                  name="dow"
                  value={this.state.dateOfDivoced}
                  setValue={this.handleDatesDivorced}
                  placeholderText="Date of Divorced"
                  validDate={this.state.dob}
                  dateOfWedding ={this.state?.dateOfWedding}
                  maxDate='0'
                  tag={"DivorcedDate"} />
              </Col>
            </>}




            
          </Form.Group>
          <Row className="m-0 mb-3">
            <Col xs="12" sm="12" md="6" lg="5" className="ps-0" id="personalVeterenId">
              <VeternCom refrencePage={'personalInfo'} label="Are you a U.S. Veteran ?" checkVeternProfile={this.checkVeternProfile} userId={this.state.userId} isVeteranChecked={this.state.isVeteran} />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xs="12" sm="12" md="5" lg="5" className="m-0 p-0">
            {this.state.userId && <Occupation refrencePage="personalInfo" userId={this.state.userId} ref={this.occupationRef}dob={this.state?.dob} />}
            </Col>
          </Row>
          <Row className="m-0 p-0 mb-3" style={{ display: 'flex', gap: "40px" }}>
            <Col md="2" lg="2" className="m-0 p-0 ">
              <label className="mb-1">No. of Children:</label>
            </Col>
            <Col md="3" lg="3" style={{ width: '240px' }}>
              <Form.Control type="text" value={this.state.noOfChildren} placeholder={this.state.noOfChildren} id="noOfChildren" onChange={(event) => { this.handlesecondChange(event); }} onBlur={() => this.handleBlur()} />
            </Col>
          </Row>

          <div className="w-50">
            <AddressListComponent userId={this.state.userId} editType="personal" setAllAddress={this.handleAddress} />
            <ContactListComponent userId={this.state.userId} type="personalkinfo" title='Contact Information' />
          </div>
          {(this.state.maritalStatusId == 1 || this.state.maritalStatusId == 2) && <>
            <Row className="m-0 p-0 mt-3">
              <Col xs="12" sm="12" md="12" lg="12" className="ps-0">
                <label className="mb-1">Check as appropriate</label>
                <Form.Check className="form-check-smoke mb-2" type="checkbox" id="isFiduciary" label={`${this.state.maritalStatusId == 2 ? "Fiduciary for Partner" : "Fiduciary for spouse"}`} checked={this.state.isFiduciary} onChange={this.handlesecondChange} />
                <Form.Check className="form-check-smoke" type="checkbox" id="isBeneficiary" label={`${this.state.maritalStatusId == 2 ? "Beneficiary of Partner" : "Beneficiary of spouse"}`} checked={this.state.isBeneficiary} onChange={this.handlesecondChange} />
              </Col>
            </Row>
          </>
          }
          <div className="d-flex">
            {(paralegalAttoryId.includes(this.state.loggedRoleId)) &&
              <MatNumber setMatNo={this.handleChildData} matNumber={this.state.matNo} xs="12" sm="6" lg="10" />
            }
            <ReferedBy memberUserid={this.state.userId} ref={this.childRef} setLoader={this.props.dispatchloader} />
          </div>
          <Row className="m-0 mb-4 mt-3">
            <Col xs md="12" className="d-flex align-items-center justify-content-end ps-0" >
              <button onClick={this.handlepersonalinfosubmit} className="theme-btn">  Save & Proceed to Family</button>
            </Col>
          </Row>
        </div>
      </Container>}
    </Layout>)
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
  dispatchUserDetail: (userDetails) =>
    dispatch({ type: GET_USER_DETAILS, payload: userDetails }),
  dispatchAuthId: (authId) =>
    dispatch({ type: GET_Auth_TOKEN, payload: authId }),
});

export default connect(mapStateToProps, mapDispatchToProps)(personalinfo);
