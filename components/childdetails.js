import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, FormGroup, } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Occupation from "../components/occupation";
import { $AHelper } from "../components/control/AHelper";
import { $CommonServiceFn, $postServiceFn, $getServiceFn } from "../components/network/Service";
import { $Service_Url } from "../components/network/UrlPath";
import PlaceOfBirth from "./PlaceOfBirth";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import moment from "moment";
import AddressListComponent from "./addressListComponent";
import ContactListComponent from "./ContactListComponent";
import Other from "./asssets/Other";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { globalContext } from "../pages/_app";
import DatepickerComponent from "./DatepickerComponent";
import AlertToaster from "./control/AlertToaster";
import DeceaseNoneSpecialNeedRadio from "./Deceased/DeceaseNoneSpecialNeedRadio.js";
import AlsoKnownAs from "./AlsoKnownAs.js";
import { isValidateNullUndefine, isNotValidNullUndefile, postApiCall, deceaseMemberStatusId, specialNeedMemberStatusId, livingMemberStatusId, removeSpaceAtStart } from "./Reusable/ReusableCom.js";
import { isUserUnder18, isDateComplete, isUserUnder16 } from "./control/Constant.js";

export class childdetail extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      startDate: "",
      genderList: [],
      suffixList: [],
      maritalStatus: [],
      allAddress: [],
      allContactDetails: [],
      citizenshipType: [],
      primaryUserId: "",
      loggedInUser: sessionStorage.getItem("loggedUserId") || "",
      parentUserId: this.props.UserID != undefined ? this.props.UserID.split("|")[0] : "",
      fName: "",
      mName: "",
      lName: "",
      nickName: "",
      disable: false,
      genderId: null,
      maritalStatusId: null,
      suffixId: null,
      birthPlace: "",
      citizenshipId: "187",
      noOfChildren: "0",
      relationshipTypeId: "",
      rltnTypeWithSpouseId: "",
      relationshipList: [],
      dob: null,
      isVeteran: false,
      isPrimaryMember: false,
      isFiduciary: false,
      isBeneficiary: false,
      show: false,
      typecomponent: "child",
      typecomponentcall: false,
      adduserId: "",
      addressData: [],
      contactId: "",
      contactData: [],
      emailData: [],
      mobileData: [],
      sameAddressForChild: false,
      spouseUserId: "",
      addMemberDetails: '',
      postResponse: null,
      primaryusername: '',
      primartUserLName: '',
      spouseUsername: '',
      subtenantId: 0,
      memberStatusId: livingMemberStatusId,
      dateOfDeath: null,

      emergencyContact: false,
      isIllness: false,
      isendoflife: false,
      ismentalhealth: false,
      isdeath: false
    };
    this.fidu = React.createRef();
    this.beneref = React.createRef();
    this.relationshipRef = React.createRef();
    this.spouserelationshipRef = React.createRef();
    this.addressadd = React.createRef();
    this.contactRef = React.createRef();
    this.occupationRef = React.createRef();
    this.asKnownAsRef = React.createRef();
  }
  componentDidMount() {
    let newUserId = sessionStorage.getItem("SessPrimaryUserId");
    let spouseUserId = sessionStorage.getItem("spouseUserId");
    let userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
    let subtenantid = sessionStorage.getItem("SubtenantId");
    konsole.log("maritalStatusId", subtenantid, spouseUserId, this.props, userDetailOfPrimary)
    this.setState({
      parentUserId: this.props.UserID.split("|")[0],
      primaryUserId: newUserId,
      spouseUserId: spouseUserId,
      primaryusername: userDetailOfPrimary.memberName,
      spouseUsername: (userDetailOfPrimary.spouseName) ? userDetailOfPrimary.spouseName : userDetailOfPrimary.memberName + "- Spouse",
      subtenantId: subtenantid,
    });
    this.fetchGenderList();
    this.fetchSuffixList();
    if (this.props.UserID.split("|")[1] == "Child") {
      const lastNameArray = userDetailOfPrimary?.memberName?.split(' ')
      const lastName = lastNameArray[lastNameArray?.length - 1]
      konsole.log('lastName', lastName)
      this.setState({ lName: lastName, primartUserLName: lastName })
    }
    if (this.props.UserID.split("|")[1] !== "Extended Family / Friends" && this.props.UserID.split("|")[1] !== 'Fiduciary/Beneficiary') {
      this.fetchMaritalStatusList();
    }
    if (this.props.UserID.split("|")[1] !== "Spouse") {
      this.fetchRelationShipList();
    }
    this.fetchCitizenshipType();
  }

  showAddAddress = (InvokeEditAddress) => {
    this.InvokeEditAddress = InvokeEditAddress;
  };

  sameAddressForChildFunc = (checked) => {
    konsole.log("child checked", checked);
    this.setState({ sameAddressForChild: checked, }, () => {
      this.handleEditFamilyMembers("sameAddress");
    }
    );
  };

  fetchRelationShipList = () => {
    if (this.props.UserID.split("|")[1] == "Extended Family / Friends" || this.props.UserID.split("|")[1] == "Fiduciary/Beneficiary") {
      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getRelationshiplist, this.state, (response) => {

        if (response) {
          konsole.log("relationAPI111", response.data.data);
          const excludedValues = [1, 2, 3, 4, 5, 6, 12, 13, 28, 29, 41, 44, 45, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56];
          let filteredData = response.data.data.
          filter((data) => !excludedValues.includes(Number(data.value)));
          this.setState({
            ...this.state,
            relationshipList: filteredData,
          });

        }
      }
      );
    } else if (this.props.UserID.split("|")[1] == "Child") {
      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getRelationshiplist + `?RelationshipCatId=1`, this.state, (response) => {
        konsole.log("response realt", response);
        if (response) {
          konsole.log("relationAPI", response.data.data);
          let filteredData = response.data.data.filter((data) => data.value == "5" || data.value == "6" || data.value == "2" || data.value == "28" || data.value == "29" || data.value == "41");
          let filteredData2 = JSON.parse(JSON.stringify(filteredData));

          filteredData2 = filteredData2?.sort((a, b) => {
            const labels = ["2", "41", "6", "28", "5", "29"];
            const aIndex = labels.indexOf(a.value);
            const bIndex = labels.indexOf(b.value);
            return aIndex - bIndex;
          });
          this.setState({
            ...this.state,
            relationshipList: filteredData2,
          });
        }
      }
      );
    } else if (this.props.UserID.split("|")[1] == "Grand-Child") {
      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getRelationshiplist, this.state, (response) => {
        konsole.log("response realt", response);
        if (response) {
          let filteredData = response.data.data.filter((data) => data.value == "3");
          konsole.log("relationAPI",filteredData, response.data.data);
          this.setState({
            ...this.state,
            relationshipList: filteredData,
            relationshipTypeId: filteredData.length > 0 ? filteredData[0].value : '',
            rltnTypeWithSpouseId: filteredData.length > 0 ? filteredData[0].value : '',
          });
        }
      }
      );
    } else if (this.props.UserID.split("|")[1] == "In-Law") {
      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getRelationshiplist, this.state, (response) => {
        konsole.log("response realt", response);
        if (response) {
          let filteredData = response.data.data.filter((data) => data.value == "47" || data.value == "48" || data.value == "49" || data.value == "50");
          konsole.log("relationAPI", response.data.data);
          this.setState({
            ...this.state,
            relationshipList: filteredData,
          });
        }
      }
      );
    }
  };

  fetchGenderList = () => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getGenderListPath, this.state, (response) => {
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
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getNameSuffixPath, this.state, (response) => {
      if (response) {
        this.setState({
          ...this.state,
          suffixList: response.data.data,
        });
      }
    }
    );
  };

  handlePlaceBirth = (event) => {
    konsole.log("birthplace", event);
    let birthPlaceObj = "";
    if (event) {
      birthPlaceObj = event;
    }
    this.setState({
      birthPlace: birthPlaceObj,
    });
  };

  fetchMaritalStatusList = () => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getMaritalStatusPath, this.state, (response) => {
      if (response) {
        konsole.log("maritalStatusmaritalStatus", response)
        this.setState({
          ...this.state,
          maritalStatus: response.data.data,
        });
      }
    }
    );
  };

  validate = () => {
    let nameError = "";
    if (this.state.fName == "") {
      nameError = "First Name cannot be blank";
    }
    else if (this.state.lName == "") {
      nameError = "Last Name cannot be blank";
    }
    else if (this.props?.UserID != undefined && (this.props?.UserID?.split("|")[1] !== "Extended Family / Friends" && this.props.UserID.split("|")[1] !== 'Fiduciary/Beneficiary' && this.props?.UserID.split('|')[1] !== 'Grand-Child' && this.props.UserID.split("|")[1] !== 'Fiduciary/Beneficiary' && this.props?.UserID.split('|')[1] !== 'Child') && (this.state.maritalStatusId == 0 || this.state.maritalStatusId == "" || this.state.maritalStatusId == null)) {
      nameError = "Relationship status cannot be blank";
    }

    else if (this.state.noOfChildren !== null && parseInt(this.state.noOfChildren) !== 0 && $AHelper.checkIFMinor(this.state.dob) < 16) {
      nameError = "Please provide DOB as minor can not have child"
    }
    // if (this.state.maritalStatusId == 0 || this.state.maritalStatusId == '' || this.state.maritalStatusId == null) {
    //     nameError = "Marital status cannot be blank";
    // }
    // konsole.log("spouseUserIdspouseUserId", this.state.spouseUserId, this.props.UserID, this.state.spouseUserId == null)


    else if (this.state.relationshipTypeId == 0 || this.state.relationshipTypeId == '' || this.state.relationshipTypeId == null) {
      // nameError = "Please Choose Relation with Primary Member";
      nameError = `Please Choose Relation with ${this.state.primaryusername}`
    }
    else if (this.state.spouseUserId !== "null" && (this.state.rltnTypeWithSpouseId == "" || this.state.rltnTypeWithSpouseId == undefined || this.state.rltnTypeWithSpouseId == null)) {
      // nameError = "Please Choose Relation with Spouse";
      nameError = `Please Choose Relation with ${this.state.spouseUsername}`
    }
    else if (this.state.dob !== null && this.state.dob !== "" && this.state.dob !== undefined && this.props?.UserID?.split("|")[1] !== "Extended Family / Friends" && this.props.UserID.split("|")[1] !== "Fiduciary/Beneficiary" && this.state.maritalStatusId !== undefined && this.state.maritalStatusId !== null && this.state.maritalStatusId !== '' && this.state.maritalStatusId != 3 && $AHelper.checkIFMinor(this.state.dob) < 16) {
      nameError = "Minor can only have Single as relation status"
    }

    //   if (this.state.birthPlace == "") {
    //       nameError = "Birth Place cannot be blank";
    //   }
    else if (this.state.citizenshipId == 0) {
      nameError = "Citizenship cannot be blank";
    }
    //   if (this.state.dob == "") {
    //       nameError = "Date of Birth cannot be blank";
    //   }
    //   if (this.state.genderId == 0) {
    //       nameError = "Gender cannot be blank";
    //   }
    else if (this.props.UserID.split("|")[1] == "Extended Family / Friends" || this.props.UserID.split("|")[1] == 'Fiduciary/Beneficiary') {
      if (this.state.relationshipTypeId == "" || this.state.relationshipTypeId == undefined || this.state.relationshipTypeId == null) {
        nameError = "Please Choose Relation with User";
      }
      else if (this.state.spouseUserId !== "null" && (this.state.rltnTypeWithSpouseId == "" || this.state.rltnTypeWithSpouseId == undefined || this.state.rltnTypeWithSpouseId == null)) {
        nameError = "Please Choose Relation with Spouse";
      }
    }
    //   }

    if (nameError) {
      this.setState({ disable: false })
      this.toasterAlert(nameError, "Warning");
      return false;
    }

    return true;
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.UserID !== this.props.UserID) {
      this.setState({ parentUserId: this.props.UserID.split("|")[0] });
    }

    if (isNotValidNullUndefile(this.state.dob) && prevState.dob !== this.state.dob && isDateComplete(this.state.dob)) {
      if (isUserUnder16(this.state?.dob)) {
        this.setState({ maritalStatusId: 3, noOfChildren: '0' })
      }

    }


    if (prevProps.show !== this.props.show) {
      if (this.props.show) {
        this.fetchGenderList();
        this.fetchSuffixList();
        this.fetchCitizenshipType();
        this.fetchMaritalStatusList();
      }
    }
  }

  handleDate = (date) => {
    konsole.log("Post save Data", date);
    this.setState({
      dob: date,
    });

  };
  handleDodDate = (date) => {
    konsole.log("Post save Data", date);
    this.setState({
      dateOfDeath: date,
    });
  };

  revertChildNo = () => {
    if (this.state.noOfChildren == "0")
      this.setState({ noOfChildren: "" });
  }

  handleNoOfChild = () => {
    if (this.state.noOfChildren == "")
      this.setState({ noOfChildren: "0" })
  }


  handleChange = (event) => {
    const eventId = event.target.id;
    const eventValue = event.target.value;
    if (eventId == "fName" || eventId == "lName" || eventId == "nickName" || eventId == "mName") {
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
    } else if (eventId == "isFiduciary" || eventId == "isBeneficiary") {
      let datedob = this.state?.dob !== null && this.state?.dob !== "" && this.state?.dob !== undefined ? $AHelper.calculate_age($AHelper.getFormattedDate(this.state?.dob)) : 0;
      if (eventId == "isFiduciary" && datedob < 18) {
        // this.toasterAlert("Please enter date of birth and fiduciary cannot be minor", "Warning");
        this.toasterAlert("Fiduciary cannot be Minor. Please enter correct date of birth", "Warning");
        this.fidu.current.checked = false;
        return;
      } else {
        this.setState({
          ...this.state,
          [eventId]: event.target.checked,
        });
        if (this.state.relationshipTypeId == 46) {
          this.setState({ relationshipTypeId: "" });
        }
        if (this.state.rltnTypeWithSpouseId == 46) {
          this.setState({ rltnTypeWithSpouseId: "" });
        }
      }
    }

    else if (eventId === "genderId" && this.props.UserID.split("|")[1] === "Child") {
      let lastName = '';
      let relationWithPrimary = 2;
      let rltnTypeWithSpouseId = 2;

      if (eventValue == "1") {
        relationWithPrimary = "5";
        rltnTypeWithSpouseId = "5";
      }
      else if (eventValue == "2") {
        relationWithPrimary = "6";
        rltnTypeWithSpouseId = "6";
      }
      // const trackLastName = this.state.lName
      // if (eventValue === "1") {
      //   relationWithPrimary = "5";
      //   rltnTypeWithSpouseId = "5";
      //   lastName = (trackLastName == undefined || trackLastName == '' || trackLastName == null) ? this.state.primartUserLName : trackLastName
      // }
      // else if (eventValue == "2") {
      //   relationWithPrimary = "6";
      //   rltnTypeWithSpouseId = "6";
      //   lastName = (trackLastName == undefined || trackLastName == '' || trackLastName == null) ? this.state.primartUserLName : trackLastName
      // } else {
      //   lastName = trackLastName
      // }
      this.setState({
        ...this.state,
        relationshipTypeId: relationWithPrimary,
        rltnTypeWithSpouseId: rltnTypeWithSpouseId,
        genderId: eventValue,
        // lName: lastName
      });
    } else if (eventId == "noOfChildren") {
      if ($AHelper.isNumberRegex(eventValue) && eventValue.length <= 2) {
        this.setState({
          ...this.state,
          [eventId]: eventValue,
        });
      } else {
        this.toasterAlert("please enter valid number", "Warning");
      }
    } else if (eventId == 'maritalStatusId') {

      let lastName = '';
      const trackLastName = this.state.lName;
      if (eventValue == 1 && this.state.genderId == 2) {
        lastName = ''
        this.setState({
          ...this.state,
          lName: lastName,
          [eventId]: eventValue,
        })
      } else {
        lastName = (trackLastName == undefined || trackLastName == '' || trackLastName == null) ? this.state.primartUserLName : trackLastName

        this.setState({
          ...this.state,
          lName: lastName,
          [eventId]: eventValue,
        })
      }
      this.validateMaritalDate(eventValue)

    }
    else {
      this.setState({
        ...this.state,
        [eventId]: eventValue,
      });
    }
  };
  checkVeternProfile = (checked) => {
    this.setState({ isVeteran: checked });
    // konsole.log("isChecked" +checked);
  };
  fetchCitizenshipType = () => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getCitizenshipType, this.state, (response) => {
      if (response) {
        this.setState({
          ...this.state,
          citizenshipType: response.data.data,
        });
      }
    }
    );
  };

  handleEditFamilyMembers = (Addresscheck) => {

    if (this.state.memberStatusId == deceaseMemberStatusId) {
      this.saveDeceaseMember()
      return;
    }

    this.setState({ disable: true })
    let dataState = this.state?.postResponse
    konsole.log("AddresscheckAddresscheck", Addresscheck);
    // let initialState = {}
    // if( this.state.isFiduciary)
    let datedob = this.state?.dob !== null && this.state?.dob !== "" && this.state?.dob !== undefined ? $AHelper.calculate_age($AHelper.getFormattedDate(this.state?.dob)) : 0;
    if (this.state?.isFiduciary == true && datedob < 18) {
      this.toasterAlert("Fiduciary cannot be Minor. Please enter correct date of birth", "Warning");
      return;
    }


    let relationshipTypeId = this.props.UserID.split("|")[1] == "Spouse" ? 1 : this.props.UserID.split("|")[1] == "Child" ? this.state.relationshipTypeId : this.props.UserID.split("|")[1] == "Grand-Child" ? 3 : (this.props.UserID.split("|")[1] == "Extended Family / Friends" || this.props.UserID.split("|")[1] == 'Fiduciary/Beneficiary') ? this.state.relationshipTypeId : ""


    let rltnTypeWithSpouseId = this.props.UserID.split("|")[1] == "Spouse" ? 1 : this.props.UserID.split("|")[1] == "Child" ? this.state.rltnTypeWithSpouseId : this.props.UserID.split("|")[1] == "Grand-Child" ? 3 : (this.props.UserID.split("|")[1] == "Extended Family / Friends" || this.props.UserID.split("|")[1] == 'Fiduciary/Beneficiary') ? this.state.rltnTypeWithSpouseId : ""

    let postResponseData = dataState?.member
    const relativeUserIdForInputData = dataState != null && dataState != undefined && dataState !== "" ? postResponseData?.memberRelationship?.relativeUserId : this.state.parentUserId;

    const inputData = {
      subtenantId: this.state.subtenantId,
      fName: $AHelper.capitalizeAllLetters(this.state.fName),
      mName: $AHelper.capitalizeAllLetters(this.state.mName),
      lName: $AHelper.capitalizeAllLetters(this.state.lName),
      nickName: $AHelper.capitalizeAllLetters(this.state.nickName),
      genderId: this.state.genderId,
      maritalStatusId: this.state.maritalStatusId,
      suffixId: this.state.suffixId,
      birthPlace: this.state.birthPlace,
      citizenshipId: this.state.citizenshipId,
      noOfChildren: this.state.noOfChildren,
      isVeteran: this.state.isVeteran,
      isPrimaryMember: this.state.isPrimaryMember,
      memberStatusId: this.state.memberStatusId,

      memberRelationship: {
        primaryUserId: dataState != null && dataState != undefined && dataState !== "" ? postResponseData?.memberRelationship?.primaryUserId : this.state.primaryUserId,
        relationshipTypeId: dataState != null && dataState != undefined && dataState !== "" ? this.state.relationshipTypeId : relationshipTypeId,
        rltnTypeWithSpouseId: dataState != null && dataState != undefined && dataState !== "" ? this.state.rltnTypeWithSpouseId : rltnTypeWithSpouseId,
        isFiduciary: (this.state.memberStatusId == deceaseMemberStatusId || this.state.memberStatusId == specialNeedMemberStatusId || this.state.relationshipTypeId == 46) ? false : this.state.isFiduciary || this.fidu.current?.checked,
        isBeneficiary: (this.state.memberStatusId == deceaseMemberStatusId) ? false : this.state.isBeneficiary || this.beneref.current.checked,
        // relativeUserId: dataState != null && dataState != undefined && dataState !== "" ? postResponseData?.memberRelationship?.relativeUserId : this.state.parentUserId,
        // relativeUserId: this.state.primaryUserId,
        relativeUserId: relativeUserIdForInputData == 'Joint' ? this.state.primaryUserId : relativeUserIdForInputData,
        isEmergencyContact: this.state.memberStatusId == deceaseMemberStatusId ? false : this.state.emergencyContact
      },
    };

    const relativeUserIdIndataStateBlock = postResponseData?.memberRelationship?.relativeUserId;
    if (dataState != null && dataState != undefined && dataState !== "") {
      inputData["userId"] = postResponseData?.userId;
      inputData["memberRelationship"]["userMemberId"] = postResponseData?.memberId;
      inputData["memberRelationship"]["relationshipType"] = postResponseData?.memberRelationship?.relationshipType;
      // inputData["memberRelationship"]["relativeUserId"] =this.state.primaryUserId;
      inputData["memberRelationship"]["relativeUserId"] = relativeUserIdIndataStateBlock;
      inputData["memberRelationship"]["userRltnshipId"] = postResponseData?.memberRelationship?.userRltnshipId;
      inputData["updatedBy"] = this.state.loggedInUser;
    } else {
      inputData["createdBy"] = this.state.loggedInUser;

    }



    if (this.state.dob !== null) {
      inputData["dob"] = $AHelper.getFormattedDate(this.state.dob);
    }
    konsole.log("inputDatainputData", JSON.stringify(inputData));
    if (this.validate()) {
      if ((this.props?.UserID.split("|")[1] == 'Child' || this.props?.UserID.split("|")[1] == 'Grand-Child') && this.state.maritalStatusId == 1 && (this.state.dob == null || this.state.dob == "" || this.state.dob == undefined)) {
        this.toasterAlert(`Please enter DOB as minor can not have married as a marital status.`, "Warning");
        this.setState({ disable: false })
        return;

      }

      if (this.props.UserID.split("|")[1] == "Extended Family / Friends" || this.props.UserID.split("|")[1] == 'Fiduciary/Beneficiary') {
        if (this.props.UserID.split("|")[1] !== "Extended Family / Friends") {
          // this.state.isFiduciary == false && this.state.isBeneficiary == false
          // this.toasterAlert(  `Please select Member as a ${this.props.UserID.split("|")[1]}`,"Warning");
          if ((this.props.refrencePage == 'Fiduciary/Assignment' || this.props.refrencePage == 'Fiduciary/AssignRoleContainer') && this.state.isFiduciary == false) {
            this.toasterAlert(`Please select Member as a Fiduciary`, "Warning");
            this.setState({ disable: false })
            return;
          } else if (this.state.isFiduciary == false && this.state.isBeneficiary == false) {
            this.toasterAlert(`Please select Member as a Fiduciary/Beneficiary`, "Warning");
            this.setState({ disable: false })
            return;
          }
        }
        ``;
      }
      if (this.state.isFiduciary == true && this.state.dob !== null && this.state.dob !== "" && this.state.dob !== undefined) {
        if ($AHelper.checkIFMinor(this.state.dob) < 18) {
          this.toasterAlert("Fiduciary cannot be Minor. Please enter correct date of birth", "Warning");
          return;
        }
      }
      // if((this.props.UserID.split("|")[1] == "Extended Family / Friends" || this.props.UserID.split("|")[1] == 'Fiduciary/Beneficiary') &&this.state.addressData?.length == 0 && Addresscheck == "Addresscheck") {
      //   this.toasterAlert("Address cannot be blank", "Warning");
      //   this.setState({disable:false})
      //   return;
      // }
      if (this.props.UserID.split("|")[1] == "Spouse" || this.props.UserID.split("|")[1] == 'Child') {
        let value = this.occupationRef?.current
        if (value !== undefined) {
          if (value.state.isWorking == true && value.state.occupationType == null) {
            this.toasterAlert("Occupation cannot be empty", "Warning");
            return;
          }
          if (value.state.isWorking == false && value.state.professionalBackground == null) {
            this.toasterAlert("Professional Background cannot be empty", "Warning");
            return;
          }
        }
        // if (value == "isDisabled") {
        //   this.toasterAlert("please select Disabled choice.", "Warning");
        //   return;
        // }
        // if (value == "occuption") {
        //   this.toasterAlert("Occupation cannot be empty", "Warning");
        //   return;
        // }
      }
      konsole.log("Post save Data", JSON.stringify(inputData.dob));

      let url = dataState != null && dataState != undefined && dataState !== "" ? $Service_Url.putUpdateMember : $Service_Url.postAddMember;
      let state = dataState != null && dataState != undefined && dataState !== "" ? "PUT" : "POST";


      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi(state, url, inputData, async (response, error) => {
        konsole.log("Success res at fid" + JSON.stringify(response));
        konsole.log("responseresponsepostAddMember", response);
        konsole.log("responseresponsepostAddMembera", response?.data?.data?.member);

        // this.occupationRef.current.props.userId = response?.data?.data?.member.memberId
        if (this.props.UserID.split("|")[1] == 'Child') {
          this.occupationRef?.current?.handleOccupationSubmit(response?.data?.data?.member?.userId);
        }
        if (this.asKnownAsRef?.current) {
          this.asKnownAsRef?.current?.saveOtherData(response?.data?.data?.member?.userId);
        }
        this.setState({ addMemberDetails: response?.data?.data?.member })
        // this.setState({ disable: false })
        this.props.dispatchloader(false);
        if (response) {
          if (Addresscheck == "Addresscheck") AlertToaster.success("Data saved successfully");
          if (this.props.UserID.split("|")[1] == "Child" || this.props.UserID.split("|")[1] == "Grand-Child") {
            let IsChildUserId = this.props.UserID.split("|")[1] == "Child" ? false : true
            await $getServiceFn.updateChildDetails(response?.data?.data?.member?.memberRelationship?.relativeUserId, IsChildUserId)
          }

          // this.setState({ disable: false })
          this.setState({ postResponse: response?.data?.data })
          if (this.state.relationshipTypeId == '999999') {
            this.relationshipRef.current.saveHandleOther(response.data.data.member.memberId);
          }
          if (this.state.rltnTypeWithSpouseId == '999999') {
            this.spouserelationshipRef.current.saveHandleOther(response.data.data.member.memberId);
            this.setState({ disable: false })
          }
          if (dataState != null && dataState != undefined && dataState !== "") {
            this.handleClose();
            return;
          }

          // this.addressadd.current.handleMemberAddress(response.data.data.member.userId)
          this.setState({ adduserId: response.data.data.member.userId });
          this.setState({ contactId: response.data.data.member.userId });
          // this.addressadd.current.setUserIdOnly(response.data.data.member.userId);
          // this.handleClose();
          // if ( (this.props.UserID.split("|")[1] == "Extended Family / Friends" || this.props.UserID.split("|")[1] == 'Fiduciary/Beneficiary') && Addresscheck != "Addresscheck" ) {
          if (Addresscheck != "Addresscheck") {
            if (Addresscheck == "contact") {
              this.contactRef?.current?.setUserId(response.data.data.member.userId);
            } else if (Addresscheck == 'address') {
              this.addressadd.current.setUserId(response.data.data.member.userId);
            }
            else if (this.props.UserID.split("|")[1] == "Child" && this.state.addressData?.length == 0 && Addresscheck == "sameAddress") {
              this.addressadd.current.setUserIdForsameAddress(response.data.data.member.userId, this.state.sameAddressForChild);
              this.setState({ disable: false })
              return;
            }
            this.setState({ disable: false })
          }
          else {
            this.handleClose();
          }

          this.postNotifydata(response.data.data.member.userId);
          this.props.dispatchloader(false)
          this.setState({ disable: false })
        } else {
          this.toasterAlert(Msg.ErrorMsg, "Warning");
          this.setState({ disable: false })
        }
      }
      );
    }
  };

  validateFun = () => {
    const { fName, lName, memberStatusId, genderId } = this.state
    let errorMsg;
    if (isValidateNullUndefine(this.state.relationshipTypeId)) errorMsg = (`Please Choose Relation with ${this.state?.primaryusername}`)
    // if (isValidateNullUndefine(genderId)) errorMsg = ('Please select Gender.')
    if (isValidateNullUndefine(lName)) errorMsg = ('Last name cannot be blank.')
    if (isValidateNullUndefine(fName)) errorMsg = ('First name cannot be blank.')
    if (isValidateNullUndefine(memberStatusId)) errorMsg = ('Please select current status.')
    if (!isValidateNullUndefine(errorMsg)) {
      this.toasterAlert(errorMsg, "Warning")
      return true
    }
    return false
  }


  saveDeceaseMember = async () => {
    if (this.validateFun()) return;
    const postRsponse = this.state?.postResponse
    const { subtenantId, dob, fName, mName, lName, nickName, genderId, maritalStatusId, suffixId, birthPlace, citizenshipId, noOfChildren, isVeteran, isPrimaryMember, memberStatusId, dateOfDeath, primaryUserId, loggedInUser, relationshipTypeId, rltnTypeWithSpouseId } = this.state;

    let jsonObj = {
      subtenantId,
      fName,
      mName,
      lName,
      dob,
      nickName,
      genderId,
      maritalStatusId,
      suffixId,
      birthPlace,
      citizenshipId,
      noOfChildren,
      isVeteran,
      isPrimaryMember,
      memberStatusId,
      dateOfDeath,
      memberRelationship: '',

      memberRelationship: {
        relativeUserId: primaryUserId,
        primaryUserId: primaryUserId,
        relationshipTypeId: relationshipTypeId,
        rltnTypeWithSpouseId: rltnTypeWithSpouseId,
        isFiduciary: false,
        isBeneficiary: false,
        isEmergencyContact: false,
      }
    }

    if (isNotValidNullUndefile(postRsponse)) {
      jsonObj['updatedBy'] = loggedInUser
      jsonObj['userId'] = postRsponse?.member?.userId,
        jsonObj['userMemberId'] = postRsponse?.member?.memberId,
        jsonObj['memberRelationship']['userMemberId'] = postRsponse?.memberId
      jsonObj['memberRelationship']['userRltnshipId'] = postRsponse?.member?.memberRelationship?.userRltnshipId
    } else {
      jsonObj['createdBy'] = loggedInUser
    }
    konsole.log('this.state?.postResponse', jsonObj, postRsponse)
    // return;
    let method = isNotValidNullUndefile(postRsponse) ? 'PUT' : "POST"
    let url = method == 'POST' ? $Service_Url.postAddMember : $Service_Url.putUpdateMember
    konsole.log('methodmethod', method, postRsponse)
    konsole.log('jsonObjjsonObj', jsonObj)

    // return;
    this.props.dispatchloader(true)
    let result = await postApiCall(method, url, jsonObj)
    if (this.state.relationshipTypeId == '999999') {
      this.relationshipRef.current.saveHandleOther(result.member.memberId);
    }
    if (this.state.rltnTypeWithSpouseId == '999999') {
      this.spouserelationshipRef.current.saveHandleOther(result.member.memberId);
    }
    this.props.dispatchloader(false)
    konsole.log('resultresultresult', result)
    AlertToaster.success("Data saved successfully");
    this.handleClose();




  }
  postNotifydata = (memberId) => {
    let jsonfornotifycontact = [];
    let isIllness = {
      "contactMapId": 0,
      "primaryMemberId": this.state.primaryUserId,
      "contactNatureId": 1,
      "contactUserId": memberId,
      "notifyConditionId": 1,
      "contactStatus": this.state.isIllness,
      "upsertedBy": this.state.loggedInUser,
    }
    let isendoflife = {
      "contactMapId": 0,
      "primaryMemberId": this.state.primaryUserId,
      "contactNatureId": 1,
      "contactUserId": memberId,
      "notifyConditionId": 2,
      "contactStatus": this.state.isendoflife,
      "upsertedBy": this.state.loggedInUser,
    }
    let ismentalhealth = {
      "contactMapId": 0,
      "primaryMemberId": this.state.primaryUserId,
      "contactNatureId": 1,
      "contactUserId": memberId,
      "notifyConditionId": 4,
      "contactStatus": this.state.ismentalhealth,
      "upsertedBy": this.state.loggedInUser,
    }
    let isdeath = {
      "contactMapId": 0,
      "primaryMemberId": this.state.primaryUserId,
      "contactNatureId": 1,
      "contactUserId": memberId,
      "notifyConditionId": 3,
      "contactStatus": this.state.isdeath,
      "upsertedBy": this.state.loggedInUser,
    }

    if (this.state.isIllness) {
      jsonfornotifycontact.push(isIllness)
    }
    if (this.state.isendoflife) {
      jsonfornotifycontact.push(isendoflife)
    }
    if (this.state.ismentalhealth) {
      jsonfornotifycontact.push(ismentalhealth)
    }
    if (this.state.isdeath) {
      jsonfornotifycontact.push(isdeath)
    }
    if (jsonfornotifycontact?.length == 0) return;

    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.upsertNotifyContactMapApi, jsonfornotifycontact, (res, err) => {
      if (res) {
        konsole.log(res, "respnse111111111")
      } else {
        konsole.log(err, "respnse111111111")
      }

    })
  }

  handleClose = (Addresscheck) => {
    this.setState({ disable: true })
    // if (Addresscheck == "Addresscheck" && this.state.mobileData.length == 0 && this.state.emailData.length == 0 && ( this.props.UserID.split("|")[1] == "Extended Family / Friends" || this.props.UserID.split("|")[1] == 'Fiduciary/Beneficiary')) {
    // this.toasterAlert("Contact cannot be blank", "Warning");
    // this.setState({disable:false})
    //   return;
    // } else
    if (Addresscheck == "Addresscheck" && (this.props.UserID.split("|")[1] == "Extended Family / Friends" || this.props.UserID.split("|")[1] == 'Fiduciary/Beneficiary')) {
      // alert("Information updated successfully");
      AlertToaster.success("Data saved successfully");
      //   this.toasterAlert("Information updated successfully", "Success");
    } else if ((Addresscheck == "Addresscheck" && this.state.mobileData.length == 0 && this.state.emailData.length == 0) || (Addresscheck == "Addresscheck" && this.state.mobileData.length > 0 && this.state.emailData.length > 0)) {
      konsole.log("handleClosehandleClose", Addresscheck, this.state.mobileData.length);
      AlertToaster.success("Data saved successfully");
    }
    konsole.log("handleClosehandleClose", Addresscheck, this.state.mobileData.length, this.state.emailData.length);
    this.props.handleEditPopupClose();

    this.setState({
      fName: "",
      mName: "",
      lName: "",
      nickName: "",
      genderId: null,
      maritalStatusId: null,
      suffixId: null,
      brithplace: "",
      birthPlace: "",
      citizenshipId: "187",
      noOfChildren: "0",
      dob: "",
      addMemberDetails: "",
      disbale: false
    });
  };

  handleClose2 = () => {


    this.props.dispatchloader(true)
    if (isNotValidNullUndefile(this.state.addMemberDetails)) {
      let { userId, memberId, maritalStatusId, memberRelationship } = this.state.addMemberDetails
      // konsole.log('memberDetailsmemberDetails',memberDetails)
      // konsole.log("detailsfordeletemember",detailsfordeletemember)
      let loginuserId = sessionStorage.getItem("loggedUserId")
      let userIdd = userId
      let memberIdd = memberId
      let deletedBy = loginuserId
      let memberRelationshipId = memberRelationship.userRltnshipId
      let IsDeleteDescendant = (maritalStatusId == 1) ? true : false

      konsole.log("loginuserIdloginuserId", loginuserId, userIdd, memberIdd, deletedBy, memberRelationshipId, IsDeleteDescendant)
      $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deletememberchild + userIdd + "/" + memberIdd + "/" + deletedBy + "/" + memberRelationshipId + "/" + IsDeleteDescendant, '', (res, err) => {
        this.props.dispatchloader(false)
        if (res) {
          konsole.log("deletememberchildres", res)
          // AlertToaster.success("Information deleted successfully");
          // window.location.reload();
          this.handleClose()
        } else {
          konsole.log("deletememberchilderr", err)
        }
      })
    } else {
      this.handleClose()
    }
  }
  handleFocusOut = () => {
    let attrvalue = this.state.mName;
    if (attrvalue.length !== 0) {
      if (attrvalue.length === 1) {
        attrvalue = attrvalue + ".";
      }
    }
    this.setState({
      mName: attrvalue,
    });
  };

  addressDetails = (attrvalue) => {
    konsole.log("attrvalueattrvalue", attrvalue);
    this.setState({
      addressData: attrvalue,
    });
  };

  contactDetails = (mobile, email) => {
    konsole.log("attrvalueattrvalue", mobile, email);
    this.setState({
      mobileData: mobile,
      emailData: email,
    });
  };

  // this function for handle member statusId---------------------------------------------------------------
  handleMemberStatusRadio = (id) => {
    this.setState({ memberStatusId: id })
    if (id != 2) {
      this.setState({ dateOfDeath: null })
    }
  }
  // /*   ----***--------***---- this function for check date validity with onBlur ----***--------***---- */
  handleDateBlur = (type) => {
    var dob = new Date(this.state.dob);
    var dod = new Date(this.state?.dateOfDeath);
    var isValid = dob <= dod;
    let datedob = isNotValidNullUndefile(this.state?.dob) ? $AHelper.calculate_age($AHelper.getFormattedDate(this.state?.dob)) : 0;
    if (this.state?.isFiduciary == true && datedob < 18) {
      this.toasterAlert("Fiduciary cannot be Minor. Please enter correct date of birth", "Warning");
      this.setState({ isFiduciary: false })
      this.fidu.current.checked = false;
    }
    this.validateMaritalDate(this.state.maritalStatusId)
  }
  isValidDateRange = (dateOfBirth, dateOfDeath) => {
    const dob = new Date(dateOfBirth);
    const dod = new Date(dateOfDeath);
    if (isNaN(dob) || isNaN(dod)) {
      return false;
    }
    return dob <= dod;
  };


  validateMaritalDate = (maritalStatusId) => {
    const relationShipMinor = [1, 4, 5, 2]
    konsole.log('thisstatemaritalStatusId', this.state.maritalStatusId)
    if (!isValidateNullUndefine(this.state?.dateOfDeath) && !isValidateNullUndefine(this.state?.dob)) {
      let dateBirth = $AHelper.checkIFMinor(this.state?.dob)
      let dateDeath = $AHelper.checkIFMinor(this.state?.dateOfDeath)
      const result = this.isValidDateRange(this.state.dateOfDeath, this.state.dob)
      let calDate = dateBirth - dateDeath;
      if (relationShipMinor.includes(Number(maritalStatusId)) && calDate < 16) {
        this.toasterAlert("Check member's DOB and DOD. Members can't be minor", "Warning")
        this.setState({
          dob: '',
          dateOfDeath: ''
        })
      } else if (result == true) {
        this.toasterAlert('Please enter valid DOB and DOD', "Warning")
        this.setState({
          dob: '',
          dateOfDeath: ''
        })
      }
    }
  }


  // decease and special need part------------------------------------------------------------------------------
  toasterAlert(test, type) {
    this.setState({
      disable: false,
    })
    this.context.setdata($AHelper.toasterValueFucntion(true, test, type));
  }
  render() {

    const showLivingDeceasedNSpecialNeedRadio = [2, 5, 6, 28, 29, 41].includes(Number(this.state?.relationshipTypeId))

    konsole.log('addressaddaddressadd', this.addressadd?.current)
    konsole.log("thispropsUserID", this.props?.UserID?.split('|')[1])
    const stateAccess = this.state;
    const pageType = this.props?.UserID?.split('|')[1]
    const editType = this.props.UserID.split("|")[1];
    const maxDate = this.props.UserID && this.props.UserID.split("|")[1] == "Spouse" ? 18 : 0;
    const forGrandChildCheck = this.props.UserID.split("|")[1]
    let relationshipList = []
    let relationshipList2 = []
    let relationshiplistSort = this.state.relationshipList?.length > 0 && (editType == 'Child') ? this.state.relationshipList : $AHelper.relationshipListsortingByString(this.state.relationshipList);
    // $AHelper.relationshipListsortingByString(this.state.relationshipList);
    relationshipList = relationshiplistSort?.length > 0 && this.state.isFiduciary == true ? relationshiplistSort?.filter((items) => items.value !== "46") : relationshiplistSort;
    relationshipList2 = relationshiplistSort?.length > 0 && this.state.isFiduciary == true ? relationshiplistSort?.filter((items) => items.value !== "46") : relationshiplistSort;

    if (this.props?.refrencePage == 'Fiduciary/Assignment' || this.props?.refrencePage == 'Fiduciary/AssignRoleContainer') {
      relationshipList = relationshipList2.filter(item => item.value != 46)
    }
    konsole.log("thisstaterelationshipList", this.props?.refrencePage, editType, relationshipList, relationshipList2)
    konsole.log("addMemberDetails", this.state.addMemberDetails)
    konsole.log('relationshipListrelationshipList', this.state.dob)
    konsole.log("editTypeeditTypeeditType", editType);
    konsole.log("kkk", this.state.maritalStatus, this.addressadd, this.relationshipRef);
    konsole.log(this.state.maritalStatus)
    konsole.log("ppsadasdas dasdp1", this.state);
    konsole.log("adduserIdadduserId", this.state.mobileData, this.state.emailData);
    konsole.log("relationshipListrelationshipList", this.state.relationshipList, relationshiplistSort, relationshipList, relationshipList2);
    konsole.log('memberStatusId', this.state.memberStatusId);

    return (
      <>
        <Modal
          show={this.props.show}
          size="lg"
          centered
          // onHide={()=>this.handleClose()}
          onHide={() => this.handleClose2()}
          animation="false"
          backdrop="static"
          enforceFocus={false}
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>
              {/* {konsole.log("this.props.UserID",this.props.UserID.split("|")[1])} */}
              {this.props.UserID ? this.props.UserID.split("|")[1] : ""} Details {" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ overflowY: "inherit" }}>
            <div className="person-content">
              <Row className="m-0 f-details person-head mb-3">
                <Col xs md="12" className="p-0">
                  <div className="d-flex align-items-center ">
                    <div className="flex-shrink-0 col "> {this.props.UserID != undefined && this.props.UserID.split("|")[1] == "Spouse" ? (
                      <img src="/icons/womanAvatar.svg" alt="user" />) : (
                      <img src="/icons/ProfilebrandColor2.svg" alt="user" />)}
                    </div>
                  </div>
                </Col>
              </Row>
              <Form.Group as={Row} className="mb-2">
                <Col xs="12" sm="12" md="4" lg="4" className="mb-2">
                  <Form.Control className="upperCasing" value={this.state.fName} placeholder={$AHelper.mandatory("First Name")} id="fName" onChange={(event) => { this.handleChange(event); }} />
                </Col>
                <Col xs="12" sm="12" md="4" lg="4" className="mb-2">
                  <Form.Control className="upperCasing" value={this.state.mName} onBlur={this.handleFocusOut} type="text" id="mName" onChange={(event) => { this.handleChange(event); }} placeholder="Middle Name" />
                </Col>
                <Col xs="12" sm="12" md="4" lg="4">
                  <Form.Control className="upperCasing" value={this.state.lName} id="lName" onChange={(event) => { this.handleChange(event); }} type="text" defaultValue="Last Name" placeholder={$AHelper.mandatory("Last Name")} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-2">
                <Col xs="12" sm="12" md="4" lg="4" className="mb-2">
                  <Form.Select onChange={(event) => this.setState({ suffixId: event.target.value })}>
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
                <Col xs="12" sm="12" md="4" lg="4" className="mb-2">
                  <Form.Select id="genderId"
                    value={this.state.genderId}
                    onChange={this.handleChange}
                  //  onChange={(event) => this.setState({ genderId: event.target.value })}
                  >
                    <option value="" disabled selected hidden> Gender</option>
                    {this.state.genderList.map((gender, index) => {
                      return (
                        <option key={index} value={gender.value}>
                          {gender.label}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Col>
                <Col xs="12" sm="12" md="4" lg="4" >
                  <Form.Control className="upperCasing" value={this.state.nickName} id="nickName" onChange={(event) => { this.handleChange(event); }} type="text" defaultValue="Nickname" placeholder="Nickname" />
                </Col>
                <Col xs="12" sm="12" md="4" lg="3">
                  <AlsoKnownAs key={'childdetails'} ref={this.asKnownAsRef} setLoader={this.props.dispatchloader} userId={this.state.userId} />
                </Col>
              </Form.Group>
              {/* ----***--------***---- None /Decease/Special Need  ----***--------***---- */}
              {(pageType == 'Child' || showLivingDeceasedNSpecialNeedRadio == true) &&
                <DeceaseNoneSpecialNeedRadio
                  handleMemberStatusRadio={this.handleMemberStatusRadio}
                  memberStatusId={this.state.memberStatusId}
                  refrencePage='childdetails'
                  fName='childDetails'
                  genderId={this.state.genderId}
                />
              }
              {/* ----***--------***---- None /Decease/Special Need  ----***--------***---- */}
              <Form.Group as={Row} className="mb-2">
                <Col xs="12" sm="12" md="4" lg="4" className="mb-2">
                  <label>Date of Birth</label>
                  <DatepickerComponent name="dob" value={this.state.dob} setValue={this.handleDate} placeholderText="D.O.B." maxDate={maxDate} minDate="100" validDate={maxDate}
                    handleOnBlurFocus={() => this.handleDateBlur('dateOfDeath')} />
                </Col>

                {(stateAccess.memberStatusId == deceaseMemberStatusId) ? <>
                  <Col xs="12" sm="12" md="4" lg="4" className="mb-2">
                    <label>Date of Death</label>
                    <DatepickerComponent name="dateOfDeath"
                      value={stateAccess.dateOfDeath}
                      setValue={this.handleDodDate}
                      placeholderText="D.O.D."
                      maxDate={maxDate}
                      minDate="100"
                      validDate={maxDate}
                      handleOnBlurFocus={() => this.handleDateBlur('dob')} />
                  </Col>
                </> : <>
                  {(this.props?.UserID?.split("|")[1] !== "Extended Family / Friends" && this.props.UserID.split("|")[1] !== 'Fiduciary/Beneficiary') && (
                    <Col xs="12" sm="12 " md="4" lg="4" className="mb-2">
                      <PlaceOfBirth birthPlace={this.state.birthPlace} handlePlaceBirth={this.handlePlaceBirth} />
                    </Col>
                  )}
                </>
                }

                <Col xs="12" sm="12" md="4" lg="4" className="">
                  <label>Citizenship</label>
                  <Form.Select onChange={(event) => this.setState({ citizenshipId: event.target.value })} value={this.state.citizenshipId} >
                    <option selected disabled hidden>Citizenship</option>
                    {this.state.citizenshipType.map((gender, index) => {
                      return (
                        <option key={index} value={gender.value}>
                          {gender.label}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Col>
              </Form.Group>
              <div >
                {/* <Form.Group as={Row} className="mb-3 ">
                  {(this.state.spouseUserId !== "null") == true ?
                    <Col xs sm="4" lg="6">
                      <Form.Select value={this.state.rltnTypeWithSpouseId} id="rltnTypeWithSpouseId" onChange={(e) => { this.setState({ rltnTypeWithSpouseId: e.target.value }); }}>
                        <option value="" disabled selected hidden>Relationship with{" "}{this.state.spouseUsername}</option>
                        {this.state.relationshipList.length > 0 &&
                          relationshipList?.map((suffix, index) => {
                            return (
                              <option key={index} value={suffix.value}>
                                {suffix.label}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Col>
                    : ""}
                  {this.state.rltnTypeWithSpouseId == "999999" && (
                    <Col xs sm="6" lg="6">
                      <Other othersCategoryId={27} userId={this.state.spouseUserId} dropValue={this.state.rltnTypeWithSpouseId} ref={this.spouserelationshipRef} natureId={this.state.natureId} />
                    </Col>
                  )}
                </Form.Group> */}
                {this.props.UserID != undefined &&
                  (this.props.UserID.split("|")[1] !== "Extended Family / Friends" && this.props.UserID.split("|")[1] !== 'Fiduciary/Beneficiary') ? (this.props.UserID != undefined && this.props.UserID.split("|")[1] == "Spouse" ? ("") : (
                    <>
                      <Form.Group as={Row} className="mb-2" >
                        <Col xs="12" sm="12" md="4" lg="6" className="mb-2" >
                          <Form.Select value={this.state.relationshipTypeId} id="relationshipTypeId" disabled={forGrandChildCheck == 'Grand-Child'} onChange={(e) => this.setState({ relationshipTypeId: e.target.value, })}>
                            {this.state.relationshipList.length > 1 && <option value="" disabled selected hidden> Relationship with{" "}{this.state.primaryusername}</option>}
                            <option value="" disabled selected hidden> Relationship with{" "}{this.state.primaryusername}</option>
                            {this.state.relationshipList.length > 0 &&
                              relationshipList?.map((suffix, index) => {
                                return (
                                  <option key={index} value={suffix.value}>
                                    {suffix.label}
                                  </option>
                                );
                              })}
                          </Form.Select>
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-2">
                        {(this.state.spouseUserId !== "null") == true ?
                          <Col xs="12" sm="12" md="4" lg="6" className="mb-2">
                            <Form.Select value={this.state.rltnTypeWithSpouseId} id="rltnTypeWithSpouseId" disabled={forGrandChildCheck == 'Grand-Child'} onChange={(e) => { this.setState({ rltnTypeWithSpouseId: e.target.value }) }}>
                              {/* {this.state.relationshipList.length > 1 && <option value="" disabled selected hidden>Relationship with{" "}{this.state.spouseUsername}</option>} */}
                              <option value="" disabled selected hidden>Relationship with{" "}{this.state.spouseUsername}</option>
                              {this.state.relationshipList.length > 0 &&
                                relationshipList?.map((suffix, index) => {
                                  return (
                                    <option key={index} value={suffix.value}>
                                      {suffix.label}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Col>
                          : ""
                        }
                        {this.state.rltnTypeWithSpouseId == "999999" && (
                          <Col xs="12" sm="12" md="4" lg="6">
                            <Other othersCategoryId={27} userId={this.state.spouseUserId} dropValue={this.state.rltnTypeWithSpouseId} ref={this.spouserelationshipRef} natureId={this.state.natureId} />
                          </Col>
                        )}
                      </Form.Group>

                      <FormGroup as={Row} className="mb-2">
                        {(this.props?.UserID?.split("|")[1] !== "Extended Family / Friends" && this.props.UserID.split("|")[1] !== 'Fiduciary/Beneficiary') && (
                          <Col xs="12" sm="12" md="4" lg="6" className="mb-2">
                            <Form.Select value={this.state.maritalStatusId} id="maritalStatusId" onChange={this.handleChange}>
                              <option value="" disabled selected hidden> Relationship Status</option>
                              {this.state.maritalStatus.map((suffix, index) => {
                                return (
                                  <option key={index} value={suffix.value}>
                                    {suffix.label}
                                  </option>
                                );
                              })}
                            </Form.Select>
                          </Col>
                        )}
                        <Col xs="12" sm="12" md="4" lg="6"></Col>
                      </FormGroup>
                      {this.props.UserID && this.props.UserID.split("|")[1] == "Child" && (this.state.dob == "" || this.state.dob == null || $AHelper.checkIFMinor(this.state.dob) >= 16) && (
                        <Row className="mb-2" >
                          <Col xs="12" sm="12" md="4" lg="6" className="d-flex align-items-center">
                            <label className="me-2">No. of Children</label>
                            <div key="checkbox13232">
                              <Form.Control value={this.state.noOfChildren} placeholder={this.state.noOfChildren} id="noOfChildren" onChange={(event) => { this.handleChange(event); }} onBlur={this.handleNoOfChild} onFocus={this.revertChildNo} type="text" />
                            </div>
                          </Col>
                        </Row>
                      )}

                    </>
                  )
                ) : (
                  <>
                    {(stateAccess.memberStatusId != deceaseMemberStatusId) && <>
                      <Form.Group as={Row} className="">
                        <Col xs="12" sm="12" md="4" lg="6" className="mb-2">
                          <Form.Select value={this.state.relationshipTypeId} id="relationshipTypeId" onChange={(e) => this.setState({ relationshipTypeId: e.target.value })} >
                            {this.state.relationshipList.length > 1 && <option value="" disabled selected hidden> Relationship with {" "}{this.state.primaryusername}</option>}
                            {this.state.relationshipList.length > 0 &&
                              relationshipList?.map((suffix, index) => {
                                return (
                                  <option key={index} value={suffix.value}>
                                    {suffix.label}
                                  </option>
                                );
                              })}
                          </Form.Select>
                        </Col>
                        {this.state.relationshipTypeId == "999999" && (
                          <Col xs="12" sm="12" md="4" lg="6" className="mb-2">
                            <Other othersCategoryId={27} userId={this.state.primaryUserId} dropValue={this.state.relationshipTypeId} ref={this.relationshipRef} natureId={this.state.natureId} />
                          </Col>
                        )}
                      </Form.Group>

                      <Form.Group as={Row} className="mb-3">
                        {(this.state.spouseUserId !== "null") == true ?
                          <Col xs="12" sm="12" md="4" lg="6" className="mb-2">
                            <Form.Select value={this.state.rltnTypeWithSpouseId} id="rltnTypeWithSpouseId" onChange={(e) => { this.setState({ rltnTypeWithSpouseId: e.target.value }) }}>
                              {this.state.relationshipList.length > 1 && <option value="" disabled selected hidden>Relationship with{" "}{this.state.spouseUsername}</option>}
                              {this.state.relationshipList.length > 0 &&
                                relationshipList?.map((suffix, index) => {
                                  return (
                                    <option key={index} value={suffix.value}>
                                      {suffix.label}
                                    </option>
                                  );
                                })}
                            </Form.Select>
                          </Col>
                          : ""}
                        {this.state.rltnTypeWithSpouseId == "999999" && (
                          <Col xs="12" sm="12" md="4" lg="6">
                            <Other othersCategoryId={27} userId={this.state.spouseUserId} dropValue={this.state.rltnTypeWithSpouseId} ref={this.spouserelationshipRef} natureId={this.state.natureId} />
                          </Col>
                        )}
                      </Form.Group>
                    </>}
                  </>
                )}

                {/* <Form.Group as={Row} className="mb-3 ">
                                    <Col xs sm="6" lg="4">
                                        <Form.Select value={this.state.rltnTypeWithSpouseId} id="rltnTypeWithSpouseId"
                                            onChange={(e) => {
                                                this.setState({ rltnTypeWithSpouseId: e.target.value });
                                            }}>
                                            <option value="" disabled selected hidden>Relationship with Spouse</option>
                                            {this.state.relationshipList.length > 0 && relationshipList.map((suffix, index) => {
                                                return (
                                                    <option key={index} value={suffix.value}>{suffix.label}</option>
                                                )
                                            })}
                                        </Form.Select>
                                    </Col>
                                    {
                                        this.state.rltnTypeWithSpouseId == "999999" &&
                                        <Col xs sm="6" lg="4">
                                            <Other othersCategoryId={27} userId={this.state.primaryUserId} dropValue={this.state.rltnTypeWithSpouseId} ref={this.relationshipRef} natureId={this.state.natureId} />

                                        </Col>
                                    }
                                </Form.Group> */}


                <div className="m-0 mb-3">
                  {(stateAccess.memberStatusId == livingMemberStatusId && this.state.relationshipTypeId != 46) && <>
                    <div key="isFiduciary" className="custICheckBoxNdLabel mb-3">
                      <Form.Check className="form-check-smoke" type="checkbox" ref={this.fidu} id="isFiduciary" onChange={this.handleChange} />
                      <label>Fiduciary</label>
                    </div>
                  </>}
                  {(stateAccess.memberStatusId != deceaseMemberStatusId) && <>
                    <div key="isBeneficiary" className="custICheckBoxNdLabel">
                      <Form.Check className="form-check-smoke" type="checkbox" ref={this.beneref} id="isBeneficiary" onChange={this.handleChange} />
                      <label>Beneficiary</label>
                    </div>
                  </>}

                  <div className="mt-3">
                    {(stateAccess.memberStatusId == livingMemberStatusId) && <>
                      <label className="emrgncy_h2 me-3">Make this as an emergency contact ?</label>
                      <Form.Check type="radio" className="left-radio" name="emergency" inline label="Yes" defaultValue={this.state.emergencyContact} onChange={() => { this.setState({ emergencyContact: true }) }} />
                      <Form.Check type="radio" className="left-radio" name="emergency" inline label="No" defaultValue={this.state.emergencyContact} onChange={() => { this.setState({ emergencyContact: false }) }} />
                      <br />
                    </>}
                    {(stateAccess.memberStatusId != deceaseMemberStatusId) && <>
                      {(this.props.UserID.split("|")[1] == 'Fiduciary/Beneficiary' || this.props.UserID.split("|")[1] == 'Child' || this.props.UserID.split("|")[1] == 'Extended Family / Friends') ? <div>
                        <p className="mt-2">Assign Notification for :</p>
                        <div className="d-flex flex-wrap gap-2">
                          <div className="custICheckBoxNdLabel">
                            <Form.Check className="form-check-smoke" type="checkbox" id="isillness" onChange={() => this.setState({ isIllness: !this.state.isIllness })} />
                            <label>Illness</label>
                          </div>
                          <div className="custICheckBoxNdLabel">
                            <Form.Check className="form-check-smoke" type="checkbox" id="ismentalhealth" onChange={() => this.setState({ ismentalhealth: !this.state.ismentalhealth })} />
                            <label>Mental health</label>
                          </div>
                          <div className="custICheckBoxNdLabel">
                            <Form.Check className="form-check-smoke" type="checkbox" id="isendoflife" onChange={() => this.setState({ isendoflife: !this.state.isendoflife })} />
                            <label>End of Life</label>
                          </div>
                          <div className="custICheckBoxNdLabel">
                            <Form.Check className="form-check-smoke" type="checkbox" id="isdeath" onChange={() => this.setState({ isdeath: !this.state.isdeath })} />
                            <label>Death</label>
                          </div>
                        </div></div> : ""}
                    </>}
                  </div>
                </div>

                {(stateAccess.memberStatusId != deceaseMemberStatusId) && <>
                  {/* <span onClick={}> ababababab </span> */}
                  <AddressListComponent
                    ref={this.addressadd}
                    userId={this.state.adduserId}
                    invokepostmember={this.handleEditFamilyMembers}
                    addressDetails={this.addressDetails}
                    ageValidation={$AHelper.checkIFMinor(this.state.dob)}
                    validationUnder14={$AHelper.isUnder14Years(this.state.dob)}
                    // typecomponent={this.state.typecomponent} typecomponentcall={this.state.typecomponentcall}  showAddAddress={this.showAddAddress}
                    sameAddressForChildFunc={this.sameAddressForChildFunc}
                    editType={editType}
                    dob={this.state.dob}
                  />

                  {(isNotValidNullUndefile(this.state.adduserId)) ?

                    <ContactListComponent
                      userId={this.state.contactId}
                      contactDetails={this.contactDetails}
                      invokepostmember={this.handleEditFamilyMembers}
                      editType={editType}
                      ref={this.contactRef}
                    /> : <button className="white-btn" onClick={() => this.handleEditFamilyMembers("contact")} >Contact Information{" "}</button>
                  }
                  {editType == "Spouse" || this.props.UserID.split("|")[1] == 'Child' && <Row className="w-80" >  <Occupation refrencePage='childdetails' editType={editType} userId={this.state.addMemberDetails?.userId} ref={this.occupationRef} dob={this.state?.dob} /> </Row>}
                </>}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button
              style={{ backgroundColor: "#76272b", border: "none" }}
              className="theme-btn"
              onClick={() => { this.handleEditFamilyMembers("Addresscheck"); }}
              disabled={this.state.disable == true ? true : false}>
              {this.state.addressData.length > 0 ? "Save" : "Save "}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state.main });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps, mapDispatchToProps)(childdetail);