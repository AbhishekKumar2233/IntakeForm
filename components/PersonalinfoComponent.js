import React, { Component } from "react";
import Router from "next/router";
import Layout from "./layout";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, InputGroup, } from "react-bootstrap";
import DatepickerComponent from "./DatepickerComponent";
import Contact from "./contact";
import Address from "./address";
import Occupation from "./occupation";
import { $getServiceFn, $postServiceFn, $CommonServiceFn, } from "./network/Service";
import konsole from "./control/Konsole";
import { $AHelper } from "./control/AHelper";
import { GET_Auth_TOKEN, GET_USER_DETAILS, SET_LOADER, } from "./Store/Actions/action";
import { connect } from "react-redux";
import { paralegalAttoryId, personal } from "./control/Constant";
import { Msg } from "./control/Msg";
import { $Service_Url } from "./network/UrlPath";
import PlaceOfBirth from "./PlaceOfBirth";
import AlertToaster from "./control/AlertToaster";
import moment from "moment";
import AddressListComponent from "./addressListComponent";
import ContactListComponent from "./ContactListComponent";
import TosterComponent from "./TosterComponent";
import { globalContext } from "../pages/_app";
import JointAccount from "./jointAccount";
import SpouseComponent from "./SpouseComponent";
import MatNumber from "./MatNumber";
import ReferedBy from "./ReferedBy";
import { deceaseMemberStatusId, isNotValidNullUndefile, postApiCall, removeSpaceAtStart } from "./Reusable/ReusableCom";
import AlsoKnownAs from "./AlsoKnownAs";
import VeternCom from "./VeternCom";

export class PersonalinfoComponent extends Component {
  static contextType = globalContext;
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      genderList: [],
      suffixList: [],
      maritalStatus: [],
      allAddress: [],
      addressDataSpouse:[],
      allContactDetails: [],
      citizenshipType: [],
      showAddress: false,
      showContact: false,
      loggedInUser: "",
      personalInfo: {},
      userId: "",
      loggedRoleId:"",
      fName: "",
      mName: "",
      lName: "",
      nickName: "",
      dateOfWedding: "",
      genderId: "0",
      maritalStatusId:"0",
      suffixId: "",
      birthPlace: "",
      spouseUserId: null,
      citizenshipId: null,
      noOfChildren: "0",
      dob: "",
      spouseDOB: "",
      isVeteran: false,
      isPrimaryMember: true,
      nameError: "",
      spouseEmailId: "",
      isFiduciary: false,
      isBeneficiary: false,
      isBeneFiduuserRltnshipId: null,
      isSpousedata: {},
      occupatioSpousenRef: '',
      checkjointconditionforoccurance: "",
      spouseName: {
        fName: '',
        mName: '',
        lName: ''
      },
      previousNoOfChildren: '',
      emergencyContact:'',
      matNo : '',
      spuseasKnownAsData:'',
      reRenderSpouseCom:false,
      spousePhyAddress:[]
    };
    this.occupationRef = React.createRef();
    this.fiduciaryRef = React.createRef();
    this.benefiRef = React.createRef();
    this.spouseRef = React.createRef();
    this.childRef = React.createRef();
    this.asKnownAsRef = React.createRef();
  }

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
    //spouse validation
    if (this.state.isSpousedata.fName == "") {
      nameError = "Spouse First Name cannot be blank";
    }
    if (this.state.isSpousedata.lName == "") {
      nameError = "Spouse Last Name cannot be blank";
    }
    if (this.state.isSpousedata.birthPlace == " ") {
      nameError = "Spouse Birth Place cannot be blank";
    }
    if (this.state.isSpousedata.citizenshipId == 0) {
      nameError = "Spouse Citizenship cannot be blank";
    }
    // if (this.state.isSpousedata.dob == "") {
    //   nameError = "Spouse Date of Birth cannot be blank";
    // }
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


  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let loggedInUser = sessionStorage.getItem("loggedUserId") || "";
    let spouseUserId = sessionStorage.getItem("spouseUserId") || "";
    let loggedRoleId=JSON.parse(sessionStorage.getItem('stateObj'))?.roleId 
    konsole.log(this.props.maritalStatus,"thispropsmaritalStatussssss")
    this.setState({
      userId: newuserid,
      loggedInUser: loggedInUser,
      spouseUserId: spouseUserId,
      loggedRoleId:loggedRoleId
    });
    this.fetchmemberbyID(newuserid);
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
      let nameValue = $AHelper.capitalizeFirstLetter(eventValue);
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
        this.toasterAlert("Please check date of birth and fiduciary cannot be minor", "Warning");
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
  
  revertChildNo = ()=>{
    if(this.state.noOfChildren == "0") 
    this.setState({noOfChildren: ""});
  }

  handleBlur = () => {
    let previousNoOfChildren = this.state.previousNoOfChildren
    if(this.state.noOfChildren == "") this.setState({noOfChildren:"0"})
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
    if(!userid) return;
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFamilyMemberbyID + userid, "", (response) => {
      this.props.dispatchloader(false);
      konsole.log("family at personal", response);
      if (response) {
        let dob = "";
        let dateOfWedding = ""
        let { fName, mName, lName, nickName, birthPlace, userId, genderId, maritalStatusId, suffixId, citizenshipId, isVeteran, noOfChildren,memberRelationship, spouseUserId,matNo} = response.data.data.member
        if (response.data.data.member.dob) {
          dob = new Date(response.data.data.member.dob);
        } else {
          dob = "";
        }
        if(response?.data?.data?.member?.dateOfWedding){
          dateOfWedding = new Date(response?.data?.data?.member?.dateOfWedding)
        }else{
          dateOfWedding = ""
        }
        // sessionStorage.setItem("maritalStatusId",response?.data?.data?.member?.maritalStatusId)
        this.setState({
          personalInfo: response?.data?.data?.member,
          userId: userId,
          fName: fName,
          mName: mName == null ? "" : mName,
          lName: lName,
          dob: dob,
          matNo:matNo,
          dateOfWedding : dateOfWedding,
          nickName: nickName == null ? "" : nickName,
          genderId: genderId,
          maritalStatusId: maritalStatusId == null ? this.props.maritalStatus : maritalStatusId,
          suffixId: suffixId,
          birthPlace: birthPlace == null ? "" : birthPlace,
          citizenshipId: citizenshipId || 187,
          isVeteran: isVeteran,
          noOfChildren: noOfChildren,
          previousNoOfChildren: noOfChildren,
          emergencyContact:memberRelationship?.isEmergencyContact
        });
        if (maritalStatusId == 1 || maritalStatusId == 2) {
          this.fetchMemberRelationship(response.data.data.member.spouseUserId)
        }
      }
    }
    );
  };

  fetchMemberRelationship = async (spouseUserId) => {
    if(!spouseUserId) return;
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
    if(!userid) return;
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
  let spouseMemberStatusId=this.state.isSpousedata?.memberStatusId
       const inputData = {
      userId: this.state.userId,
      fName: $AHelper.capitalizeAllLetters(this.state.fName),
      mName: $AHelper.capitalizeAllLetters(this.state.mName),
      lName: $AHelper.capitalizeAllLetters(this.state.lName),
      matNo: this.state.matNo,
      dob: $AHelper.getFormattedDate(this.state.dob),
      dateOfWedding: dow == "" ? null : $AHelper.getFormattedDate(dow),
      nickName: $AHelper.capitalizeAllLetters(this.state.nickName),
      genderId: this.state.genderId,
      maritalStatusId:(spouseMemberStatusId==deceaseMemberStatusId && this.state.maritalStatusId==1)? 4:spouseMemberStatusId==deceaseMemberStatusId && this.state.maritalStatusId==2?3: this.state.maritalStatusId,
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
          this.props.dispatchloader(false);
          this.childRef.current.toggleVisibility()
          const userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
          const responseData = response.data.data.member;
          konsole.log("responseDataresponseData", responseData)
          const mName = responseData.mName !== null && responseData.mName !== "" ? " " + responseData.mName + " " : " ";
          userDetailOfPrimary.memberName = responseData.fName + ' ' + responseData.lName;
          userDetailOfPrimary.usermob = responseData.fName + ' ' + responseData.lName;
          userDetailOfPrimary.memberId=responseData.memberId
          sessionStorage.setItem("userDetailOfPrimary", JSON.stringify(userDetailOfPrimary));
          if (responseData?.spouseUserId !== '00000000-0000-0000-0000-000000000000') {
            sessionStorage.setItem("spouseUserId", responseData?.spouseUserId);
          }
          
          if (this.asKnownAsRef?.current) {
            this.asKnownAsRef?.current?.saveOtherData(inputData?.userId);
          }

          if (responseData?.maritalStatusId == "1" || responseData?.maritalStatusId == '2') {
            konsole.log("isBeneFiduuserRltnshipIda", this.state.isBeneFiduuserRltnshipId)
            let method = (this.state.isBeneFiduuserRltnshipId !== undefined && this.state.isBeneFiduuserRltnshipId !== null) ? 'PUT' : "POST"
            let url = $Service_Url.postMemberRelationship + `?RelativeMemberID=${responseData?.memberId}`
            let jsonObj = {
              "primaryUserId": responseData?.spouseUserId,
              "relationshipTypeId": 1,
              "isFiduciary": this.state.isFiduciary,
              "isBeneficiary": this.state.isBeneficiary,
              "relativeUserId": responseData?.spouseUserId,
              'isEmergencyContact':this.state.emergencyContact
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
          this.handleEditFamilyMembers(inputData)

        }
      }
      );
    }
  };


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
    const filterAddress = allAddress.filter((item) => parseInt(item.addressTypeId) === 1);
     
    // if(filterAddress.length >0 && this.state.spousePhyAddress?.length <=0){
    this.setState({reRenderSpouseCom:!this.state.reRenderSpouseCom})
    // }       
  };
  spouseComAddress=(address)=>{
    this.setState({spousePhyAddress:address})
  }
  Spousedatafunc = (e, occupatioSpousenRef,addressData) => {
    konsole.log(e, addressData,"eeeeeeeeeeeeeeeee1")

    this.setState({
      isSpousedata: e,
      occupatioSpousenRef: occupatioSpousenRef,
      addressDataSpouse:addressData
    })
  }
  handleEditFamilyMembers = (inputData) => {
    // this.setState({disable: true})


    if (this.state.dob !== null && this.state.dob !== undefined && this.state.dob !== "" && this.state.relationshipTypeId == 1 && $AHelper.checkIFMinor(this.state.dob) < 16) {
      this.toasterAlert(`${this.props.UserID.split("|")[1]} cannot be Minor.`, "Warning");
      return 0;
    }
    let datedob = this.state.dob !== null && this.state.dob !== "" && this.state.dob !== undefined ? $AHelper.calculate_age($AHelper.getFormattedDate(this.state.dob)) : 0;
    if (this.state.isFiduciary == true && datedob < 18) {
      this.toasterAlert("Fiduciary cannot be Minor. Please enter correct date of birth", "Warning");
      this.setState({ disable: false })
      return;
    }
    let AddressPrimary = this.state.addressDataSpouse.filter((e)=>parseInt(e.addressTypeId) == 1)
    if(AddressPrimary.length <= 0 && this.state.isSpousedata?.memberStatusId !=deceaseMemberStatusId){
      this.toasterAlert('Please add physical address of spouse','Warning')
      return;
    }


        if(this.state.isSpousedata?.memberStatusId !=deceaseMemberStatusId){
           let value =this?.state?.occupatioSpousenRef?.current?.handleOccupationSubmit();
       
       if (value !== undefined) {
      if (value == "occuption") {
        this.toasterAlert("Occupation cannot be empty", "Warning");
        return;
      }
      // if (value == "ageOfRetirement") {
      //   this.toasterAlert("Age of Retirement cannot be empty", "Warning");
      //   return;
      // }
      if (value == "professBackground") {
        this.toasterAlert( "Professional Background cannot be empty", "Warning");
        return;
      }
      if (value == "isDisabled") {
        this.toasterAlert("please select Disabled choice.", "Warning");
        return;
      }
      if (value == "occuption") {
        this.toasterAlert("Occupation cannot be empty", "Warning");
        return;
      }
    }
           }
    
    if (this.state.dob !== null && this.state.dob !== "" && this.state.dob !== undefined) {
      this.state.isSpousedata["dob"] = $AHelper.getFormattedDate(this.state.dob);
    }
    konsole.log("inputDataat", this.state.isSpousedata);
    let primarySpouseUserId = sessionStorage.getItem("spouseUserId");
    if (this.validate()) {
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUpdateMember, this.state.isSpousedata,async (response, error) => {

        // AlertToaster.success("Data saved successfully");
        this.props.dispatchloader(false);
        konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          konsole.log("checked response ", response);
          konsole.log('responsedata', response)
          this.setState({ disable: false })
          await this.saveAsKnownAsSpouseData(this.state.isSpousedata.userId);
          if (response.data.data.member.memberRelationship.relationshipTypeId == '999999') {
            this.relationshipRef.current?.saveHandleOther(response.data.data.member.memberId);

          }
          if (response.data.data.member.memberRelationship.rltnTypeWithSpouseId == '999999') {
            this.spouserelationshipRef.current?.saveHandleOther(response.data.data.member.memberId);
          }
          const userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
          const responseData = response.data.data.member;
          
          let spouseName= `${responseData.fName} ${responseData.lName}`
          if(responseData?.memberStatusId ==deceaseMemberStatusId){
            spouseName=null;  
            sessionStorage.setItem("spouseUserId", 'null');
            sessionStorage.setItem("maritalStatusId", inputData?.maritalStatusId);
                      }
          userDetailOfPrimary.spouseName =spouseName;
          sessionStorage?.setItem("userDetailOfPrimary", JSON.stringify(userDetailOfPrimary));
          

          if ((this.state?.addressDataSpouse?.length === 0) || (this.state?.maritalStatusId !== "1" && this.state?.maritalStatusId !== "2")) return; 
          // this?.handleClose();
          const spouseUserId = responseData.spouseUserId;
          const postAddAddress = {
            userId: spouseUserId,
            address: this.state.addressDataSpouse?.find((item) => parseInt(item.addressTypeId) === 1),
          }
          if (Object.keys(postAddAddress.address).length === 0) {
            return this.handleClose();
          }
          this.handleMemberAddress(spouseUserId, postAddAddress.address.addressId, responseData.userId, this.state.loggedInUser);
        } else {
          this.toasterAlert(Msg.ErrorMsg, "Warning");
          this.setState({ disable: false })

          konsole.log(error, "errorerrorerrorerror")
        }
      }
      );
      return this.handleRouting(this.state.userId)
    }
  };

  
  saveAsKnownAsSpouseData = async (userId) => {
    let data=this.state.spuseasKnownAsData
    let userSubjects = []
    if ($AHelper.objectvalidation(data)) {
        userSubjects.push(data)
    }
    let jsonobj = { "userId": userId, "userSubjects": userSubjects }
    konsole.log('JsonObjOtherMetaQuestion', jsonobj)

    return new Promise(async(resolve,reject)=>{
    this.props.dispatchloader(true);
    if(userSubjects.length>0){
      const resultSaveSubject = await postApiCall('PUT', $Service_Url.putusersubjectdata, jsonobj)
      konsole.log('resultSaveSubject', resultSaveSubject)
      this.props.dispatchloader(false);
    }
      resolve('resolve');
    })
  
}

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

  setSpouseDOB = ( date ) => {
    this.setState({spouseDOB: date});
  }

  spouseNameFun = (key, value) => {
    this.setState(prevState => ({
      ...prevState,
      spouseName: {
        ...prevState.spouseName,
        [key]: value
      }
    }));
  };
  toasterAlert(test, type) {
    konsole.log(this.context.setdata($AHelper.toasterValueFucntion(true, test, type)), this.context, test, "thiscontext");
  }
  handleChildData = (data) => {
    this.setState({ matNo: data });
  };
  toggleChildVisibility = () => {
    if (this.childRef.current) {
      this.childRef.current.toggleVisibility();
    }
  };
  updateAlsoKnownAsData=(val)=>{
    this.setState({
      spuseasKnownAsData:val
    })
  }

  render() {
        const authToken = this.props.authToken;

        const isSpouseSmall = (this.state.spouseDOB && (new Date(this.state.dob) < new Date(this.state.spouseDOB))) ? true : false;

            const spouseNameDet=this.state.spouseName

            const spousemNameOnRibbon=isNotValidNullUndefile(spouseNameDet?.mName)?spouseNameDet?.mName:''

            const spouseNameOnRibbon=(isNotValidNullUndefile(spouseNameDet?.fName) ? (spouseNameDet?.fName+" "+spousemNameOnRibbon+" "+spouseNameDet?.lName):(this.state?.maritalStatusId == 2)?' Partner':'Spouse')

            return (
      <Layout name={"Personal Information"} className="">
        <Row >
          <Col className="pt-md-0 pt-2">
            <Breadcrumb>
              <Breadcrumb.Item href="#" onClick={() => { Router.push("./dashboard") }} className="Breadcrumb-clas ms-1">   {" "}   {" "}Home{" "} </Breadcrumb.Item>
              <Breadcrumb.Item href="#">Personal Information</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Container fluid className="bg-white info-details min-vh-100" id="personalFormId">
          <Row className="person-head">
            <Col sm="6" md="6" lg="6" className="ps-0">
              <div class="col d-inline-flex">
                <img src="/icons/ProfilebrandColor2.svg" class="maleAvatarUser " alt="user" />
                <h2 className="ms-3 mt-1">{$AHelper.capitalizeAllLetters(this.state.fName + " " + this.state.mName + " " + this.state.lName)}</h2>
              </div>
            </Col>
            <Col sm="6" md="6" lg="6" className="d-md-block d-none">
              <div class="row justify-content-between">
                  <div className=" d-flex d-inline-flex">
                       <img src="/icons/ProfilebrandColor2.svg" class="maleAvatarUser" alt="user" />
                       <h2 className="ms-3 mt-1"> 
                       {/* {(isNotValidNullUndefile(spouseNameDet.fName) ? (spouseNameDet?.fName+" "+spouseNameDet?.mName+" "+spouseNameDet.lName):(this.state.maritalStatusId == 2)?' Partner':'Spouse')} */}
                       {$AHelper.capitalizeAllLetters(spouseNameOnRibbon)}
                        </h2>
                  </div>
                  <div className="col-6" style={{display: "flex",justifyContent:"flex-end",marginTop: "5px"}}>
                  </div>
              </div>

            </Col>
           
          </Row>

          
          {/* <Row className="m-0 person-head">
            <Col className="p-0">
              <div className="d-flex align-items-center justify-content-start">
                
                <div class="container">
                  
                  <div class="row">
                    <div class="col">
                      <div class="col d-inline-flex">
                        <img src="/icons/ProfilebrandColor2.svg" class="maleAvatarUser" alt="user" />
                        <h2 className="ms-3 mt-1">{this.state.fName + " " + this.state.mName + " " + this.state.lName}</h2>
                      </div>
                    </div>
                    <div class="col">
                      <div class="col d-inline-flex">
                        <img src="/icons/ProfilebrandColor2.svg" class="maleAvatarUser" alt="user" />
                        <h2 className="ms-3 mt-1">{this.state.spouseName.fName != "" ? (this.state.spouseName.fName + " " + this.state.spouseName.lName) : "Spouse"}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row> */}
          <Row className="person-content perosnal-Comp m-0 p-0">
            <Col  className="borderrightOfProfessional">
              <div>
                <div className="PrimaryBorder pt-3">

                  {/* <h3 className="Primaryh3">{this.state.fName + " " + this.state.mName + " " + this.state.lName}</h3> */}
                  <Form.Group as={Row} className="mb-md-3 ">
                    <Col xs="12" sm="6" lg="6" className="mb-2 mb-md-0">
                      <Form.Control className="upperCasing" required type="text"  value={this.state.fName} placeholder={$AHelper.mandatory("First Name")} id="fName" onChange={(event) => { this.handlesecondChange(event); }} />
                    </Col>
                    <Col xs="12" sm="6" lg="6" className="mb-2 mb-md-0">
                      <Form.Control className="upperCasing" type="text" value={this.state.mName} placeholder="Middle Name" id="mName" onChange={(event) => this.handlesecondChange(event)} onBlur={this.handleFocusOut} />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} >
                    <Col xs="12" sm="6" lg="6" className="mb-2 mb-md-0">
                      <Form.Control className="upperCasing" type="text" value={this.state.lName} placeholder={$AHelper.mandatory("Last Name")} id="lName" onChange={(event) => this.handlesecondChange(event)} />
                    </Col>
                    <Col xs="12" sm="6" lg="6" className="mb-md-3 mb-2">
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
                    <Col xs="12" sm="6" lg="6" className="mb-md-2 mb-2">
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
                    <Col xs="12" sm="6" lg="6" className="mb-md-2 mb-2" >
                      <Form.Control className="upperCasing" type="text" value={this.state.nickName} placeholder="Nickname" id="nickName" onChange={(event) => this.handlesecondChange(event)} />
                    </Col>
                    <Col xs="12" sm="6" lg="6" className="mb-md-2 mb-2">
                <AlsoKnownAs key={'PersonalInfoComponent'} ref={this.asKnownAsRef} setLoader = {this.props.dispatchloader} userId = {this.state.userId}/>
              </Col>
                  </Form.Group>
                        
                
                  <Form.Group as={Row}>
                    <Col xs="12" sm="6" lg="6" className="mb-md-2 mb-2">
                      <label>Date of Birth*</label>
                      <DatepickerComponent name="dob" value={this.state.dob} setValue={this.handleDate} placeholderText="D.O.B." maxDate="16" minDate="100" validDate={16} dateOfWedding={this.state.dateOfWedding}/>
                    </Col>
                    <Col xs="12" sm="6" lg="6" className="mb-md-2 mb-2">
                      <PlaceOfBirth birthPlace={this.state.birthPlace} handlePlaceBirth={this.handlePlaceBirth} />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} >
                    <Col xs="12" sm="6" lg="6" className="mb-2">
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
                    <Col xs="12" sm="6" lg="6" className="mb-2">
                      <label>Relationship Status*</label>
                      {konsole.log(this.state.maritalStatusId,"thispropsmaritalStatussssss2")}
                      <Form.Select id="maritalStatusId" value={this.state.maritalStatusId} onChange={(event) => this.handleSelectR(event)} disabled={this.state.maritalStatusId != null ? true : false} className={this.state.maritalStatusId > 0 ? "maritalStatusClass" : ""}                >
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
                    {this.state.maritalStatusId == 2 || this.state.maritalStatusId == 3 ? "" : <>
                    <Col xs sm="6" lg="6" className="mb-3">
                    <label>Date of Marriage</label>
                    <DatepickerComponent 
                    name="dow"
                    value={this.state.dateOfWedding} 
                    setValue={this.handleDates} 
                    placeholderText="Date of Marriage"  
                    validDate={isSpouseSmall ? this.state.spouseDOB : this.state.dob}
                    maxDate='0'
                    tag={"weddingDate"} />
                    </Col>
                    </>}
                    
                  </Form.Group>
                  <Row >
                    <Col  sm="12" lg="12" className="mb-2" id="personalVeterenId">
                      <VeternCom refrencePage={'PersonalInfoComponent'} key={'personalInfoComponent'} label="Are you a U.S. Veteran ?" checkVeternProfile={this.checkVeternProfile} userId={this.state.userId} isVeteranChecked={this.state.isVeteran} />
                    </Col>
                  </Row>
                  {(this.state.maritalStatusId == 1 || this.state.maritalStatusId == 2) && <>
                    <Form.Group as={Row} className="m-0 p-0 ">
                      { this.state.maritalStatusId == 2 ? (
                      <Col lg="12" className="m-0 p-0 mb-3 d-flex flex-wrap gap-3 align-items-center w-100">
                        <div>
                          <Form.Check className="form-check-smoke" type="checkbox" id="isFiduciary" checked={this.state.isFiduciary} onChange={this.handlesecondChange} />
                        </div>
                        <label>{`${this.state.maritalStatusId == 2 ? "Fiduciary for Partner" : "Fiduciary for spouse"}`}</label>
                        <div>
                          <Form.Check className="form-check-smoke" type="checkbox" id="isBeneficiary" checked={this.state.isBeneficiary} onChange={this.handlesecondChange} />
                        </div>
                        <label>{`${this.state.maritalStatusId == 2 ? "Beneficiary of Partner" :"Beneficiary of spouse"}`}</label>
                      </Col>
                      ) :(
                        <Col lg="12" className="m-0 p-0 mb-3 d-flex flex-wrap gap-3 align-items-center w-100">
                        <div>
                          <Form.Check className="form-check-smoke" type="checkbox" id="isFiduciary" checked={this.state.isFiduciary} onChange={this.handlesecondChange} />
                        </div>
                        <label>Fiduciary for Spouse</label>
                        <div>
                          <Form.Check className="form-check-smoke" type="checkbox" id="isBeneficiary" checked={this.state.isBeneficiary} onChange={this.handlesecondChange} />
                        </div>
                        <label>Beneficiary of Spouse</label>
                      </Col>
                          )}
                    </Form.Group>
                  </>}
                  <Row className="mt-1" >
                    <Col xs="12" sm="12" md="6" lg="6">
                  <h2 className="emrgncy_h2" >Make this as an emergency contact ?</h2>
                  </Col>
                 <Col xs="12" sm="12" md="6" lg="6">
                <Form.Check type="radio" className="left-radio" name="emergency" inline label="Yes" checked={this.state.emergencyContact}  onChange={()=>{this.setState({emergencyContact:true})}}/>
                <Form.Check type="radio" className="left-radio" name="emergency" inline label="No" checked={!this.state.emergencyContact} onChange={()=>{this.setState({emergencyContact:false})}}/>
                </Col>
                </Row>
                  <Row className="">
                    <Col xs={9} className="w-100 m-0 p-0">
                      {this.state.userId && <Occupation refrencePage="PersonalInfoComponent" userId={this.state.userId} ref={this.occupationRef}dob={this.state?.dob}/>}
                    </Col>
                  </Row>
                  <Row className="m-0 p-0">
                    <Col lg="6" className="m-0 p-0 d-flex align-items-center" >
                      <label className="mb-1">No. of Children:</label>
                    </Col>
                    <Col lg="6" className="noofchild-class">

                      <Form.Control type="text" value={this.state.noOfChildren} placeholder={this.state.noOfChildren} id="noOfChildren" onChange={(event) => { this.handlesecondChange(event); }} onBlur={this.handleBlur} onFocus={this.revertChildNo} />
                    </Col>

                  </Row>
                  <div className="mt-3 w-100">
                    <AddressListComponent userId={this.state.userId} editType="personal" setAllAddress={this.handleAddress} />
                    <ContactListComponent userId={this.state.userId} type="personalkinfo" title='Contact Information' />
                  
                  </div>
                  <Row>
              {(paralegalAttoryId.includes(this.state.loggedRoleId)) && 
                    <Col xs="12" sm="6" md="4" lg="4">
                <MatNumber setMatNo={this.handleChildData}matNumber={this.state.matNo} />
                </Col>
               
              }
                <Col xs="12" sm="6" md="6" lg="6" className="proceedtoFmlyBTn">
                {/* <label></label> */}
              <ReferedBy memberUserid={this.state.userId} ref={this.childRef} setLoader={this.props.dispatchloader}/>
              </Col>
                </Row>
                </div>
                
              </div>
             
            </Col>
            <Col>
            
              <div >
                <div>
                {/* <Col sm="6" md="6" lg="6" className=""> */}
                  <div class="row justify-content-between d-md-none person-head " style={{backgroundColor:"#DCDCDC"}}>
                      <div className="col-12 d-flex d-inline-flex p-0">
                          <img src="/icons/ProfilebrandColor2.svg" class="maleAvatarUser" alt="user" />
                          <h2 className="ms-3 mt-1">{this.state.spouseName.fName != "" ? (this.state.spouseName.fName + " " + this.state.spouseName.lName) : "Spouse"}</h2>
                      </div>
                      {/* <div className="col-6" style={{display: "flex",justifyContent:"flex-end",marginTop: "5px"}}>
                      </div> */}
                  </div>
                {/* </Col> */}

                  <SpouseComponent 
                  isSpousedata={this.Spousedatafunc} 
                  spouseUserId={this.state.spouseUserId} 
                  primaryuserlastname={this.state.lName} 
                  primaryuserfname={this.state.fName} 
                  spouseNameFun={this.spouseNameFun} 
                  maritalStatusId={this.state.maritalStatusId}
                  key={this.state.reRenderSpouseCom}
                  reRenderSpouseCom={this.state.reRenderSpouseCom}
                  spouseComAddress={this.spouseComAddress}
                  updateAlsoKnownAsData={this.updateAlsoKnownAsData}
                  setSpouseDOB={this.setSpouseDOB}
                  dateOfWedding={this.state.maritalStatusId == 2 || this.state.maritalStatusId == 3 ? undefined : this.state.dateOfWedding}
                  primaryGenderId={this.state.genderId}
                  />
                  <div className="mb-4">
                  </div>
                 
                </div>
            </div>
            </Col>
          </Row>
          <div>
            <Row className="m-0 mb-4 mt-3">
              <Col className="proceedtoFmlyBTn d-flex justify-content-end" >
                <button onClick={this.handlepersonalinfosubmit} className="theme-btn">Save & Proceed to Family</button>
              </Col>
            </Row>
          </div>
          
        </Container >

      </Layout >
    );
  }
}

const mapStateToProps = (state) => ({ ...state.main });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
  dispatchUserDetail: (userDetails) =>
    dispatch({ type: GET_USER_DETAILS, payload: userDetails }),
  dispatchAuthId: (authId) =>
    dispatch({ type: GET_Auth_TOKEN, payload: authId }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonalinfoComponent);
