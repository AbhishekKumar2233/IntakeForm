import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, InputGroup, ThemeProvider, } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Address from "./address";
import Contact from "./contact";
import Occupation from "./occupation";
import { $AHelper } from "./control/AHelper";
import { $getServiceFn, $postServiceFn, $CommonServiceFn, } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import PlaceOfBirth from "./PlaceOfBirth";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import moment from "moment";
import AddressListComponent from "./addressListComponent";
import ContactListComponent from "./ContactListComponent";
import Other from "./asssets/Other";
import { globalContext } from "../pages/_app";
import DatepickerComponent from "./DatepickerComponent";
import JointAccount from "./jointAccount";
import AlertToaster from "./control/AlertToaster";
import DeceaseNoneSpecialNeedRadio from "./Deceased/DeceaseNoneSpecialNeedRadio";
import { livingMemberStatusId ,deceaseMemberStatusId,specialNeedMemberStatusId,isNotValidNullUndefile,isValidateNullUndefine,deceaseSpouseRelationId, removeSpaceAtStart} from "./Reusable/ReusableCom";
import AlsoKnownAs from "./AlsoKnownAs";
import VeternCom from "./VeternCom";

export class spouseComponent extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      startDate: "",
      genderList: [],
      suffixList: [],
      maritalStatus: [],
      allAddress: [],
      showContact: false,
      memberId: "",
      disable: false,
      showAddress: false,
      birthPlace: "",
      relationshipList: [],
      allContactDetails: [],
      citizenshipType: [],
      parentUserId: "",
      userId: this.props?.UserID != undefined ? this.props.UserID?.split("|")[0] : "",
      loggedInUser: sessionStorage.getItem("loggedUserId") || "",
      primaryMamberName:'',
      spousedetails: true,
      fName: "",
      mName: "",
      lName: "",
      nickName: "",
      genderId: "0",
      maritalStatusId: null,
      suffixId: null,
      brithplace: "",
      citizenshipId: "0",
      noOfChildren: "0",
      dob: null,
      isFiduciary: false,
      isBeneficiary: false,
      isVeteran: false,
      isPrimaryMember: false,
      userDetailOfPrimaryspouseName: "",
      show: false,
      userRltnshipId: 0,
      relationshipTypeId: 0,
      rltnTypeWithSpouseId: 0,
      userMemberId: "",
      relationshipType: 0,
      relativeUserId: "",
      maxDate: "",
      minDate: "",
      addressData: [],
      spouseEmailId: [],
      spouseMobileNo: [],
      emailData: [],
      mobileData: [],
      checkjointconditionforoccurance: "",
      emergencyContact1:false,
      spouseUserId: "",

      memberStatusId:livingMemberStatusId,
      memberStatusIdforTestRef:livingMemberStatusId,
      dateOfDeath:null,
      isBeneficiaryforTestRef:false,
      isFiduciaryforTestRef:false,
      fNameforTestRef:'',
    };
    this.occupatioSpousenRef = React.createRef();
    this.addressesRef = React.createRef();
    this.relationshipRef = React.createRef();
    this.spouserelationshipRef = React.createRef();
  }

  componentDidMount() {
    const spouseUserId = sessionStorage.getItem("spouseUserId")
    if (this.props.UserID != undefined) {
      this.setState({ userId: this.props?.UserID?.split("|")[0] });
    }
    this.fetchRelationShipList();
    let parentUserId = sessionStorage.getItem("SessPrimaryUserId");
    let primaryMamberName=JSON.parse(sessionStorage.getItem('userDetailOfPrimary'))?.memberName
  
    this.setState({
      parentUserId: parentUserId,
      spouseUserId: spouseUserId,
      primaryMamberName:primaryMamberName,
      lName:this.props.primaryuserlastname != null ? this.props.primaryuserlastname : "" 
    });
    this.fetchGenderList();
    this.fetchSuffixList();
    if (this.props?.UserID?.split("|")[1] != "Fiduciary/Beneficiary") {
      this.fetchmemberbyID(spouseUserId);
    }

    if (this.props?.UserID?.split("|")[1] !== "Extended Family / Friends" && this.props?.UserID?.split("|")[1] !== "Fiduciary/Beneficiary") {
      this.fetchMaritalStatusList();
    }
    if (this.props?.UserID?.split("|")[1] !== "Spouse") {
      this.fetchRelationShipList();
    }
    if (this.props?.UserID?.split("|")[1] == "Spouse") {
      this.fetchRelationShipList();
    }
    this.fetchCitizenshipType();

    this.fetchSavedAddress(this.props?.UserID?.split("|")[0]);
    this.fetchSavedContactDetails(this.props?.UserID?.split("|")[0]);
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
  newDropdown = (userData, data) => {
    let dropValues = data?.data?.data
    const userPrimaryInDetail = sessionStorage.getItem("SessPrimaryUserId")
    let relationId = userData?.data?.data?.member?.memberRelationship?.relationshipTypeId;
    konsole.log("spouseResponse1212", relationId, dropValues)
    let relativeUserId = userData?.data?.data?.member?.memberRelationship?.relativeUserId;
    let boolean = relationId == 1 && relativeUserId == userPrimaryInDetail;
    this.props.dispatchloader(false);
    if (relationId == "2" || relationId == "41" || relationId == "28 " || relationId == "5" || relationId == "6" || relationId == "29") {
      let filterRelationship = dropValues.filter((e) => {
        return (e.value == "2" || e.value == "41" || e.value == "6" || e.value == "28" || e.value == "5" || e.value == "29");
      });
      this.setState({ ...this.state, relationshipList: filterRelationship });
    }
    else if (relationId == "1" && relativeUserId == userPrimaryInDetail) {
      let filterRelationship = dropValues.filter((e) => { return (e.value == "1"); });
      this.setState({
        ...this.state,
        relationshipList: filterRelationship,
      });
    }

    else if ((relationId == "1" && boolean == false) || relationId == "49" || relationId == "44" || relationId == "48" || relationId == "49" || relationId == "47" || relationId == "50") {

      let filterRelationship = dropValues.filter((e) => {
        return ( e.value == "44" || e.value == "47" || e.value == "48" || e.value == "49" || e.value == "50");
      });
      this.setState({
        ...this.state,
        relationshipList: filterRelationship,
      });
    } else if (relationId == "3") {
      let filterRelationship = dropValues.filter((e) => {
        return (  e.value == "3");});
      this.setState({
        ...this.state,
        relationshipList: filterRelationship,
      });
    }
    else if (relationId != "2" && relationId != "41" && relationId != "6" && relationId != "28" && relationId != "5" && relationId != "29" && relationId != "44" && relationId != "47" && relationId != "48" && relationId != "3" && relationId != "1" && relationId != "49" && relationId != "50" && relationId != "4" && relationId != "12") {

      let filterRelationship = dropValues.filter((e) => {
        return ( e.value != "2" && e.value != "41" && e.value != "6" && e.value != "28" && e.value != "5" && e.value != "29" && e.value != "44" && e.value != "47" && e.value != "48" && e.value != "3" && e.value != "1" && e.value != "49" && e.value != "50" && e.value != "4" && e.value != "12"
        );
      });
      konsole.log("hfyyuuhgyt777", filterRelationship)
      this.setState({
        ...this.state,
        relationshipList: filterRelationship,
      });
    }
    else {
      let filterRelationship = dropValues.filter((e) => {
        return (
          e.value != "2" && e.value != "41" && e.value != "6" && e.value != "28" && e.value != "5" && e.value != "29" && e.value != "44" && e.value != "47" && e.value != "48" && e.value != "3" && e.value != "1" && e.value != "49" && e.value != "50" && e.value != "4" && e.value != "12"
        );
      });
      this.setState({
        ...this.state,
        relationshipList: filterRelationship,
      });

    }
  }
  fetchMaritalStatusList = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getMaritalStatusPath, this.state, (response) => {
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
  fetchRelationShipList = () => {
    if (this.props.UserID?.split("|")[1] == "Extended Family / Friends" || this.props.UserID?.split("|")[1] == "Fiduciary/Beneficiary") {
      $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getRelationshiplist, this.state, (response) => {
          konsole.log("response realt", response);
          if (response) {
            konsole.log("relationAPI111", response.data.data);
              let filteredData = response.data.data.filter(
                (data) => data.value !== "2" && data.value !== "1" && data.value !== "5" && data.value !== "6" && data.value !== "3" && data.value !== "4" && data.value !== "12" && data.value !== "13" && data.value !== "41" && data.value !== "45" && data.value !== "29" && data.value !== "28" && data.value !== "44" && data.value !== "47" && data.value !== "48" && data.value !== "49" && data.value !== "50"
              );
              this.setState({
                ...this.state,
                relationshipList: filteredData,
              });
            }
          }
      );
    } else if (this.props.UserID?.split("|")[1] == "Child") {
      $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getRelationshiplist + `?RelationshipCatId=1`, this.state, (response) => {
          konsole.log("response realt", response);
          if (response) {
            konsole.log("relationAPI", response.data.data);
            let filteredData = response.data.data.filter((data) =>  data.value == "5" ||  data.value == "6" ||  data.value == "2" ||  data.value == "28" ||  data.value == "29" ||  data.value == "41");
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
    } else if (this.props.UserID?.split("|")[1] == "Grand-Child") {
      $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getRelationshiplist + `?RelationshipCatId=1`, this.state, (response) => {
          this.setState({ disable: false})
          konsole.log("response realt", response);
          if (response) {
            let filteredData = response.data.data.filter( (data) => data.value == "3");
            konsole.log("relationAPI", response.data.data);
            this.setState({
              ...this.state,
              relationshipList: filteredData,
            });
          }
        }
      );
    } else if (this.props.UserID?.split("|")[1] == "In-Law") {
      $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getRelationshiplist,this.state,(response) => {
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
    // }

  };

  fetchSavedAddress = (userId) => {
    if(!userId) return;

    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getAllAddress + userId,"",(response) => {
        this.props.dispatchloader(false);
        // konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          this.setState({
            ...this.state,
            allAddress: response.data.data.addresses,
          });
        }
      }
    );
  };

  fetchSavedContactDetails = (userId) => {
    if(!userId) return;

    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getAllContactOtherPath + userId, "", (response) => {
        this.props.dispatchloader(false);
        // konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          this.setState({
            ...this.state,
            allContactDetails: response.data.data.contact,
          });
        }
      }
    );
  };

  componentDidUpdate(prevProps, prevState) {
   
    if (prevProps.show !== this.props.show) {
      if (this.props.show) {
        this.fetchGenderList();
        this.fetchSuffixList();
        // this.fetchmemberbyID(this.props.UserID.split("|")[0]);
        this.fetchMaritalStatusList();
        this.fetchCitizenshipType();
        this.fetchSavedAddress(this.props.UserID?.split("|")[0]);
        this.fetchSavedContactDetails(this.props.UserID?.split("|")[0]);
      }
    }
    if(prevProps.primaryuserlastname != this.props.primaryuserlastname){
      this.setState({
        lName: this.state.lName == prevProps.primaryuserlastname  ? this.props.primaryuserlastname :this.state.lName
      })
    }
  }

  handleFocusOut = () => {
    let attrvalue = this.state.mName || "";
    if (attrvalue.length === 1) {
      attrvalue = attrvalue + ".";
    }
    this.setState({
      mName: attrvalue,
    });
  };

  checkVeternProfile = (checked) => {
    this.setState({ isVeteran: checked });
    // konsole.log("isChecked" +checked);
  };

  fetchCitizenshipType = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getCitizenshipType,this.state,(response) => {
        this.props.dispatchloader(false);
        if (response) {
          this.setState({
            ...this.state,
            citizenshipType: response.data.data,
          });
        }
      }
    );
  };

  fetchmemberbyID = (userid, data) => {
    if(!userid) return;
    var loader = setInterval(() => {this.props.dispatchloader(true)},2000);
    $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getFamilyMemberbyID + userid, "", (response) => {
        konsole.log("response personal2", response)
        clearInterval(loader)
        this.props.dispatchloader(false);
        if (response) {
          konsole.log("response personal24", response)
          let dob
          let firstname =  response.data.data.member.fName.includes('-') ? "" :response.data.data.member.fName
          let lastname = response.data.data.member.lName == "Name" ? this.props.primaryuserlastname : response.data.data.member.lName
          if (response.data.data.member.dob) {
            dob = new Date(response.data.data.member.dob);
          } else {
            dob = "";
          }

          this.props.spouseNameFun('fName',firstname)
          this.props.spouseNameFun('mName',response.data.data.member.mName)
          this.props.spouseNameFun('lName',lastname)
        this.setState({
          fName:firstname,
          mName: response.data.data.member.mName,
          lName: lastname,
          fNameforTestRef:firstname,
          memberStatusId: response.data.data.member.memberStatusId ?? livingMemberStatusId,
          memberStatusIdforTestRef: response.data.data.member.memberStatusId ?? livingMemberStatusId,
          dateOfDeath: response?.data?.data?.member?.dateOfDeath,
          nickName: response.data.data.member.nickName,
          userMemberId: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.userMemberId : 0,
          relationshipTypeId: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.relationshipTypeId : 0,
          relativeUserId: response.data.data.member.memberRelationship? response.data.data.member.memberRelationship.relativeUserId: "",
          relationshipType: response.data.data.member.memberRelationship? response.data.data.member.memberRelationship.relationshipType: "",
          dob:dob,
          userRltnshipId: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.userRltnshipId : 0,
          genderId:response.data.data.member.genderId,
          maritalStatusId:response.data.data.member.maritalStatusId,
          isVeteran:response.data.data.member.isVeteran,
          suffixId:response.data.data.member.suffixId,
          isFiduciary:response.data.data.member.memberRelationship.isFiduciary,
          isBeneficiary:response.data.data.member.memberRelationship.isBeneficiary,
          isFiduciaryforTestRef: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.isFiduciary : false,
          isBeneficiaryforTestRef: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.isBeneficiary : false,
          citizenshipId:response.data.data.member.citizenshipId,
          rltnTypeWithSpouseId: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.rltnTypeWithSpouseId : 0,
        })
          this.setState({
            memberData: response.data.data.member,
            userId: response.data.data.member.userId,
            memberId: response.data.data.member.memberId,
            birthPlace: response.data.data.member.birthPlace,
            noOfChildren: response.data.data.member.noOfChildren,
            parentUserId: response.data.data.member.memberRelationship? response.data.data.member.memberRelationship.primaryUserId: this.state.parentUserId,
            emergencyContact1:response.data.data.member.memberRelationship.isEmergencyContact
          });
        }
      }
    );
  };

  handleDate = (date) => {
    this.setState({
      dob: date,
    });
  };
  handleOnBlurFocus = (date) => {
    let datedob =date !== null && date !== "" && date !== undefined  ? $AHelper.calculate_age($AHelper.getFormattedDate(date))  : 0;
    konsole.log("datedate", date, datedob, this.state.isFiduciary);
    if (this.state.isFiduciary == true && datedob < 18) {
      this.setState({
        dob: null,
      });
      this.toasterAlert("Fiduciary cannot be Minor. Please enter correct date of birth",  "Warning");
      return;
    } else {
      this.setState({
        dob: date,
      });
      this.props.setSpouseDOB?.(date)
    }
    this.validateMaritalDate(1)
  };

  handleChange = (event) => {
    konsole.log("fNamefName", event.target.id);
    const eventId = event.target.id;
    const eventValue = event.target.value;
    // konsole.log("eventId", eventId);
    // konsole.log('eventValue', eventValue);

    if (eventId == "fName" || eventId == "lName" || eventId == "nickName" || eventId == "mName") {
      let nameValue = $AHelper.capitalizeFirstLetter(eventValue);
      nameValue = removeSpaceAtStart(nameValue);
      if ($AHelper.isRegexForAll(nameValue)) {
        this.setState({
          ...this.state,
          [eventId]: nameValue,
        });
        this.props.spouseNameFun(eventId,nameValue)
      } else {
        this.setState({
          ...this.state,
          [eventId]: "",
        });
      }
    } else if (eventId == "isFiduciary" || eventId == "isBeneficiary") {
      let datedob = (this.state.dob !== null && this.state.dob !== "" && this.state.dob !== undefined) ? $AHelper.calculate_age($AHelper.getFormattedDate(this.state.dob)) : 0;
      if (eventId == "isFiduciary" && event.target.checked == true && datedob < 18) {

        this.toasterAlert("Fiduciary cannot be Minor. Please enter correct date of birth", "Warning");
        this.setState({ ...this.state, [eventId]: false, });
        return;

      } else {
        this.setState({ ...this.state, [eventId]: event.target.checked, });
        if (this.state.relationshipTypeId == 46) {
          this.setState({ relationshipTypeId: "" });
        }
        if (this.state.rltnTypeWithSpouseId == 46) {
          this.setState({ rltnTypeWithSpouseId: "" });
        }
      }
    } else if (eventId == "noOfChildren") {
      if ($AHelper.isNumberRegex(eventValue) && eventValue.length <= 2) {
        this.setState({
          ...this.state,
          [eventId]: eventValue,
        });
      } else {
        this.toasterAlert("please enter valid number", "Warning");
      }
    } else if (eventId === "genderId" && this.props.UserID?.split("|")[1] === "Child") {
      let relationWithPrimary = "";
      let rltnTypeWithSpouseId = "";
      if (eventValue === "1") {
        relationWithPrimary = "5";
        rltnTypeWithSpouseId = "5";
      }
      else if (eventValue == "2") {
        relationWithPrimary = "6";
        rltnTypeWithSpouseId = "6";
      }
      this.setState({
        ...this.state,
        relationshipTypeId: relationWithPrimary,
        rltnTypeWithSpouseId: rltnTypeWithSpouseId,
        genderId: eventValue
      });
    }
    else {
      this.setState({
        ...this.state,
        [eventId]: eventValue,
      });
    }
  };

  validate = () => {
    let nameError = "";
    if ( this.state.isFiduciary == false && this.state.isBeneficiary == false && (this.props?.UserID?.split("|")[1] == "Extended Family / Friends" || this.props.UserID?.split("|")[1] == "Fiduciary/Beneficiary")) {
      nameError = "Please choose at-least one option from Fiduciary / Beneficiary";
      this.setState({disable: false})
    }
    if (this.state.fName == "") {
      nameError = "First Name cannot be blank";
      this.setState({disable: false})
    }
    if (this.state.lName == "") {
      nameError = "Last Name cannot be blank";
      this.setState({disable: false})
    }
    konsole.log("this.state?.maritalStatusId ", this.state?.maritalStatusId);

    if (this.props?.UserID?.split("|")[1] !== "Extended Family / Friends" && this.props.UserID?.split("|")[1] !== "Fiduciary/Beneficiary") {
      if (this.state?.maritalStatusId == "Relationship Status") {
        nameError = "Relationship status cannot be blank";
      }
    }

    

    if (this.props?.UserID?.split("|")[1] == "Spouse" && this.state.addressData.length >= 0) {
        const filterAddress = this.state.addressData.filter((item) => parseInt(item.addressTypeId) === 1);
        if (filterAddress <= 0) {
          nameError = "Please add physical address"
        }; 
    }

    // if (this.state.birthPlace == "") {
    //     nameError = "Birth Place cannot be blank";
    // }
    if (this.state.citizenshipId == 0) {
      nameError = "Citizenship cannot be blank";
    }



    if (nameError) {
      this.setState({  disable: false})
      this.toasterAlert(nameError, "Warning");
      return;
    }
    return true;
  };

  handleshowContact = () => {
    this.setState({
      showContact: !this.state.showContact,
    });
  };

  handlePlaceBirth = (event) => {
    // konsole.log("birthplace", event);
    let birthPlaceObj = "";
    if (event) {
      birthPlaceObj = event;
    }
    this.setState({
      birthPlace: birthPlaceObj,
    });
  };




  handleMemberAddress = (userId, addressId, primaryUserId, loggedInUser) => {
    this.props.dispatchloader(true);
    $postServiceFn.memberAddress(userId, addressId, primaryUserId, true, loggedInUser, (response) => {
      this.props.dispatchloader(false);
      if (response) {
        this.handleClose();
      }
    });
  };

  handleDeleteContact = async (userid, contactId) => {
    let ques = await this.context.confirm( true, "Are you sure? You want to delete your Contact.", "Confirmation");
    if (ques) {
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi( "DELETE", $Service_Url.deleteContactPath + userid + "/" + contactId, "", (response) => {
          this.props.dispatchloader(false);
          if (response) {
            this.fetchSavedContactDetails(userid);
          } else {
            this.toasterAlert(Msg.ErrorMsg, "Warning");
          }
        }
      );
    }
  };

  handleClose = () => {
    this.props.handleEditPopupClose();
    this.setState({
      userId: "",
      fName: "",
      mName: "",
      lName: "",
      nickName: "",
      genderId: "0",
      maritalStatusId: null,
      suffixId: null,
      birthPlace: "",
      citizenshipId: "187",
      noOfChildren: "0",
      dob: "",
    });
  };

  InvokeEditContactID = (contactTypeId, EditContactType) => {
    this.setState({
      EditContactType: EditContactType,
      EditContactId: contactTypeId,
    });

    this.handleshowContact();
  };

  toasterAlert(text, type) {
    this.setState({ disable: false})
    this.context.setdata({
      open: true,
      text: text,
      type: type,
    });
  }

  handleAddress = (allAddress) => {
    this.setState({
      allAddress: allAddress,
    });
  };
  handleMemberStatusRadio = (id) => {
    konsole.log('idididibhuiytv', id)
    this.setState({ memberStatusId: id })
  }
  handleDateBlur = (type) => {
    var dob = new Date(this.state.dob);
    var dod = new Date(this.state?.dateOfDeath);
    var isValid = dob <= dod;
    let datedob = isNotValidNullUndefile(this.state?.dob) ? $AHelper.calculate_age($AHelper.getFormattedDate(this.state?.dob)) : 0;
    if (this.state?.isFiduciary == true && datedob < 18) {
      this.toasterAlert("Fiduciary cannot be Minor. Please enter correct date of birth", "Warning");
      this.setState({ isFiduciary:false}) 
  }
    this.validateMaritalDate(1)
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
    const relationShipMinor=  [1,4,5,2]
    konsole.log('thisstatemaritalStatusId', this.state.maritalStatusId)
    if (!isValidateNullUndefine(this.state?.dateOfDeath) && !isValidateNullUndefine(this.state?.dob)) {
      let dateBirth = $AHelper.checkIFMinor(this.state?.dob)
      let dateDeath = $AHelper.checkIFMinor(this.state?.dateOfDeath)
      const result = this.isValidDateRange(this.state.dateOfDeath, this.state.dob)
      let calDate = dateBirth - dateDeath;
      if (relationShipMinor.includes(Number(maritalStatusId)) && calDate < 18) {
        this.toasterAlert("Kindly enter a valid date", "Warning")
        this.setState({
          dob: '',
          dateOfDeath: ''
        })
      } else if (result == true) {
        this.toasterAlert('Kindly enter a valid date', "Warning")
        this.setState({
          dob: '',
          dateOfDeath: ''
        })
      }
    }
  }

  handleDodDate = (date) => {
    konsole.log("Post save Data", date);
    this.setState({
      dateOfDeath: date,
    });
  };

  render() {
    konsole.log("spousetype",this.state.userId,this.props?.UserID?.split("|")[1])
    konsole.log("this.state?.relationshipTypeId",this.state?.relationshipTypeId)
    const editType = this?.props?.UserID?.split("|")[1];
    let primarySpouseUserId = sessionStorage.getItem("spouseUserId");
    const maxDate = this.props?.UserID && this.props?.UserID?.split("|")[1] == "Spouse"   ? 18   : 0;
    let relationshipList = [];
    // let relationshiplistSort =   this.state.relationshipList.length > 0 &&   $AHelper.relationshipListsortingByString(this.state.relationshipList);
    let relationshiplistSort =this.state.relationshipList?.length > 0 && editType == "Child"  ? this.state?.relationshipList  : $AHelper.relationshipListsortingByString(this.state.relationshipList);
    relationshipList = relationshiplistSort?.length > 0 && this.state.isFiduciary == true   ? relationshiplistSort?.filter((items) => items?.value !== "46")   : relationshiplistSort;


    const putUserdata = {
      userId: this.props.spouseUserId,
      fName: $AHelper.capitalizeAllLetters(this.state.fName),
      mName: $AHelper.capitalizeAllLetters(this.state.mName),
      lName: $AHelper.capitalizeAllLetters(this.state.lName),
      dob:this.state.dob,
      nickName: $AHelper.capitalizeAllLetters(this.state.nickName),
      genderId: this.state.genderId,
      maritalStatusId: this.state.maritalStatusId,
      suffixId: this.state.suffixId == "null" ? null : this.state.suffixId,
      birthPlace: this.state.birthPlace,
      citizenshipId: this.state.citizenshipId,
      noOfChildren: this.state.noOfChildren,
      isVeteran: this.state.isVeteran,
      isPrimaryMember: this.state.isPrimaryMember,
      updatedBy: this.state.loggedInUser,
      memberStatusId: this.state.memberStatusId,
      dateOfDeath: (this.state.memberStatusId == deceaseMemberStatusId) ? this.state.dateOfDeath : null,
      memberRelationship: {
        primaryUserId: this.state.parentUserId,
        relationshipTypeId:(this.state.memberStatusId==deceaseMemberStatusId )?deceaseSpouseRelationId:this.state.relationshipTypeId,
        rltnTypeWithSpouseId: this.state.rltnTypeWithSpouseId,

        isFiduciary: (this.state.memberStatusId == deceaseMemberStatusId || this.state.memberStatusId == specialNeedMemberStatusId) ? false : this.state.isFiduciary,
        isBeneficiary: (this.state.memberStatusId == deceaseMemberStatusId) ? false : this.state.isBeneficiary,
        userRltnshipId: this.state.userRltnshipId,
        userMemberId: this.state.userMemberId,
        relationshipType: this.state.relationshipType,
        relativeUserId: this.state.relativeUserId,
        isEmergencyContact:this.state.emergencyContact1 
      },
      };
    this.props.isSpousedata(putUserdata,this.occupatioSpousenRef,this.state.addressData)
    let stateAccess=this.state
        return (
      <>
         {/* -----------------------------------------------------SpouseComponent------------------------------------------------- */}
        
         {(this.state.checkjointconditionforoccurance == 2) &&
               <div className="col linkedaccountOnPersonalInfo" style={{display: "flex",justifyContent:"flex-end"}}>
                      <button className="theme-btn py-0" disabled>LINKED ACCOUNT</button>
                </div>}
                 
         <div className="PrimaryBorder SpouseBorder pt-3 ">
              {/* <h3 className="Spouseh3">{this.state.fName != "" ? (this.state.fName+" "+this.state.lName):"Spouse" }</h3> */}
            <Form.Group as={Row} className="mb-md-3">
                <Col xs="12" sm="6" lg="6" className="mb-2 mb-md-0">
                  <Form.Control
                    className="upperCasing"
                    value={this.state.fName}
                    placeholder={$AHelper.mandatory("First Name")}
                    id="fName"
                    onChange={(event) => {
                      this.handleChange(event);
                    }}
                  />
                </Col>
                <Col xs="12" sm="6" lg="6" className="mb-2 mb-md-0">
                  <Form.Control
                    className="upperCasing"
                    value={this.state.mName}
                    type="text"
                    id="mName"
                    onChange={(event) => {
                      this.handleChange(event);
                    }}
                    placeholder="Middle Name"
                    onBlur={this.handleFocusOut}
                  />
                </Col>
                </Form.Group>
                
              
              <Form.Group as={Row} className="mb-md-2">
              <Col xs="12" sm="6" lg="6" className="mb-2 mb-md-0">
                  <Form.Control
                    className="upperCasing"
                    value={this.state.lName}
                    id="lName"
                    onChange={(event) => {
                      this.handleChange(event);
                    }}
                    type="text"
                    placeholder={$AHelper.mandatory("Last Name")}
                  />
                </Col>
                <Col xs="12" sm="6" lg="6" className="mb-md-3 mb-2">
                  <Form.Select
                    value={this.state.suffixId}
                    id="suffixId"
                    onChange={this.handleChange}
                  >
                    <option value="null" disabled selected hidden>
                      Prefix / Suffix
                    </option>
                    {this.state.suffixList.map((suffix, index) => {
                      return (
                        <option key={index} value={suffix.value}>
                          {suffix.label}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Col>
                
                <Col xs="12" sm="6" lg="6" className="mb-2 mb-md-0">
                  <Form.Select
                    value={this.state.genderId}
                    id="genderId"
                    onChange={this.handleChange}
                  >
                    <option value="0" disabled selected hidden>
                      Gender
                    </option>
                    {this.state.genderList.map((gender, index) => {
                      return (
                        <option key={index} value={gender.value}>
                          {gender.label}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Col>
                <Col xs="12" sm="6" lg="6" className="mb-2 mb-md-0">
                  <Form.Control
                    className="upperCasing"
                    value={this.state.nickName}
                    id="nickName"
                    onChange={(event) => {
                      this.handleChange(event);
                    }}
                    type="text"
                    placeholder="Nickname"
                  />
                </Col>
                <Col xs="12" sm="6" lg="6" className="mb-2 mb-md-0 mt-2">
                <AlsoKnownAs key={'SpouseComponent'} updateAlsoKnownAsData={this.props.updateAlsoKnownAsData} setLoader = {this.props.dispatchloader} userId = {this.props.spouseUserId} />
                </Col>
              </Form.Group>

                 {/* ----***--------***---- None /Decease/Special Need  ----***--------***---- */}

                 <DeceaseNoneSpecialNeedRadio
                 key={this.state.memberStatusId}
                 handleMemberStatusRadio={this.handleMemberStatusRadio}
                 memberStatusId={this.state.memberStatusId}
                 memberStatusIdforTestRef={this.state.memberStatusIdforTestRef}
                 refrencePage='spouseComponent'
                 fName={this.state.fNameforTestRef}
                 childName={this.state.fNameforTestRef + ' ' + this.state.lName}
                 isFiduciary={this.state.isFiduciaryforTestRef}
                isBeneficiary={this.state.isBeneficiaryforTestRef}
                genderId={this.props.primaryGenderId}
                 
                  />
                 {/* ----***--------***---- None /Decease/Special Need  ----***--------***---- */}
           
              
              <Form.Group as={Row} className="mb-2">
                <Col xs="12" sm="6" lg="6" className="mb-2 mb-md-0"> 
                <label>Date of Birth</label>
                  <DatepickerComponent
                    name="dob"
                    value={this.state.dob}
                    setValue={this.handleDate}
                    placeholderText="D.O.B."
                    maxDate={16}
                    minDate="100"
                    validDate={maxDate}
                    handleOnBlurFocus={this.handleOnBlurFocus}
                    dateOfWedding={this.props.dateOfWedding}
                                      />
                </Col>
                {(stateAccess.memberStatusId == deceaseMemberStatusId) ? <>
                  <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
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

                </>:<>
                {this.props?.UserID?.split("|")[1] !== "Extended Family / Friends" && this.props?.UserID?.split("|")[1] !== "Fiduciary/Beneficiary" && (
                  <Col xs="12" sm="6" lg="6">
                    <PlaceOfBirth
                      birthPlace={this.state.birthPlace}
                      handlePlaceBirth={this.handlePlaceBirth}
                    />
                  </Col>
                  
                )}
                </>}           
                 </Form.Group>
                 <Form.Group as={Row} className="mb-3">
                <Col xs="12" sm="6" lg="6">
                  <label>Citizenship</label>
                  <Form.Select
                    onChange={this.handleChange}
                    id="citizenshipId"
                    value={this.state.citizenshipId}
                  >
                    <option selected disabled hidden>Citizenship</option>
                    {this.state.citizenshipType.map((city, index) => {
                      return (
                        <option key={index} value={city.value}>
                          {city.label}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Col>
                </Form.Group>
             

                  <Row className="m-0 p-0">
                <Col xs="12" sm="12" lg="12" className="mb-2 p-0 m-0" id="personalVeterenId">
                  <VeternCom 
                    label="Are you a U.S. Veteran ?" refrencePage={'SpouseComponent'} key={'spouseComponent'}  checkVeternProfile={this.checkVeternProfile}  userId={this.state.userId}  isVeteranChecked={this.state.isVeteran} />
                </Col>
              </Row>


              <Form.Group as={Row} className="m-0 p-0 ">
                  <Col lg="12" className="m-0 p-0 mb-2 d-flex flex-wrap gap-3 align-items-center w-100"> 
                  
                    {(stateAccess.memberStatusId == livingMemberStatusId) && <>
                    <div>
                    <Form.Check
                    className="form-check-smoke"
                    type="checkbox"
                    id="isFiduciary"
                    // label="Fiduciary"
                    // label={`${`Fiduciary for ${this.props.primaryuserfname} ${this.props.primaryuserlastname}`}`}
                    onChange={this.handleChange}
                    checked={this.state.isFiduciary}
                  // disabled={ $AHelper.checkIFMinor(this.state.dob ) < 18}
                  /> 
                  </div>
                  <label>{`${`Fiduciary for ${$AHelper.capitalizeAllLetters(this.props.primaryuserfname + " " + this.props.primaryuserlastname)}`}`}</label>
                     </>}                 
                  {(stateAccess.memberStatusId != deceaseMemberStatusId) && <>
                    <div>
                    <Form.Check
                    className="form-check-smoke "
                    type="checkbox"
                    id="isBeneficiary"
                    // label="Beneficiary"
                    // label={`${`Beneficiary of ${this.props.primaryuserfname} ${this.props.primaryuserlastname}`}`}
                    onChange={this.handleChange}
                    checked={this.state.isBeneficiary}
                  />
                   </div>
                   <label>{`${`Beneficiary of ${$AHelper.capitalizeAllLetters(this.props.primaryuserfname + " " + this.props.primaryuserlastname)}`}`}</label>
                   </>}
                  </Col>                 
                </Form.Group>
                {(stateAccess.memberStatusId == livingMemberStatusId) && <>
                  <Row className="mt-3">
                    <Col xs="12" sm="12" md="6" lg="6">
                    <h2 className="emrgncy_h2">Make this as an emergency contact ?</h2>
                    </Col>
                    <Col xs="12" sm="12" md="6" lg="6">
                <Form.Check type="radio" className="left-radio" name="emergency1" inline label="Yes" checked={this.state.emergencyContact1}  onChange={()=>{this.setState({emergencyContact1:true})}}/>
                <Form.Check type="radio" className="left-radio" name="emergency1" inline label="No" checked={!this.state.emergencyContact1} onChange={()=>{this.setState({emergencyContact1:false})}}/>
                  </Col>
                  </Row>
                  </>}
                   
                   
            {(stateAccess.memberStatusId != deceaseMemberStatusId) && <>
                <Row className="">
                <Col xs={9} className="w-100 m-0 p-0">
                   </Col>
                  <Occupation  refrencePage="SpouseComponent" usertype="spouse" editType="Spouse"  userId={this.state.userId} ref={this.occupatioSpousenRef}dob={this.state?.dob}/> 
              </Row>
              </>}
              {(stateAccess.memberStatusId != deceaseMemberStatusId) && <>   
              {
                this.state.userId && this.state.relativeUserId &&
                <AddressListComponent
                  addressDetails={this.addressDetails}
                  userId={this.props.spouseUserId}
                  key={this.state.reRenderSpouseCom}
                  editType="Spouse"
                  relativeUserId={this.state.relativeUserId}
                  setAllAddress={this.handleAddress}
                  maritalStatusId={this.props.maritalStatusId}
                  spouseComAddress={this.props.spouseComAddress}
                />
              }
                 {/* <ContactListComponent 
                 userId={this.state.userId} 
                 type="personalkinfo" 
                 title='Contact Information' /> */}
                
              <ContactListComponent
                contactDetails={this.contactDetails}
                userId={this.props.spouseUserId}
                editType="Spouse"
                setSpouseEmail={(e) =>
                  this.setState({ ...this.state, spouseEmailId: e})   
                }
                setSpouseMobile={(e) =>
                  this.setState({ ...this.state, spouseMobileNo: e })
                }
                checkjointconditionforoccurance={this.state.checkjointconditionforoccurance}
              />
              <JointAccount
                    spouseEmailId={this.state.spouseEmailId}
                    spouseMobileNo={this.state.spouseMobileNo}
                    maritalStatusId={this.props?.maritalStatusId}
                    setcheckjointconditionforoccurance={(e) =>
                      this.setState({
                        ...this.state,
                        checkjointconditionforoccurance: e,
                      })
                    }
                    gender={this.state.genderId}
                />
                </>}
              
            </div>
      </>
    );
  }
}``
const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps, mapDispatchToProps)(spouseComponent);
