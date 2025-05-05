import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, InputGroup, ThemeProvider, } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Veteran from "../components/Veteran";
import Address from "../components/address";
import Contact from "../components/contact";
import Occupation from "./occupation";
import { isDateComplete,isUserUnder16,isUserUnder18 } from "./control/Constant.js";
import { $AHelper } from "../components/control/AHelper";
import { $getServiceFn, $postServiceFn, $CommonServiceFn, } from "../components/network/Service";
import { $Service_Url } from "../components/network/UrlPath";
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
import { isValidateNullUndefine, isNotValidNullUndefile, deceaseMemberStatusId, specialNeedMemberStatusId, livingMemberStatusId, isNullUndefine, removeSpaceAtStart } from "./Reusable/ReusableCom.js";
import AlsoKnownAs from "./AlsoKnownAs.js";
export class spousedetails extends Component {
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
      userId: this.props.UserID != undefined ? this.props.UserID.split("|")[0] : "",
      loggedInUser: sessionStorage.getItem("loggedUserId") || "",
      primaryMamberName: '',
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
      previousNoOfChildren: 0,
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
      spouseUserId: "",
      primartUserLName: '',
      emergencyContact: false,
      isIllness: false,
      isendoflife: false,
      ismentalhealth: false,
      isdeath: false,
      memberStatusId: livingMemberStatusId,
      dateOfDeath: null,
      fNameforTestRef: "",
      isFiduciaryforTestRef: false,
      isBeneficiaryforTestRef: false,
      memberStatusIdforTestRef: livingMemberStatusId,
      inLawLastName:""

    };
    this.occupationRef = React.createRef();
    this.addressesRef = React.createRef();
    this.relationshipRef = React.createRef();
    this.spouserelationshipRef = React.createRef();
    this.asKnownAsRef = React.createRef();
  }

  componentDidMount() {
    const spouseUserId = sessionStorage.getItem("spouseUserId")

    if (this.props.UserID != undefined) {
      this.setState({ userId: this.props.UserID.split("|")[0] });
    }
    this.fetchRelationShipList();
    let parentUserId = sessionStorage.getItem("SessPrimaryUserId");
    let userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));


    this.setState({
      parentUserId: parentUserId,
      spouseUserId: spouseUserId,
      primaryMamberName: userDetailOfPrimary?.memberName,
      spouseUsername: (userDetailOfPrimary.spouseName) ? userDetailOfPrimary.spouseName : userDetailOfPrimary.memberName + "- Spouse"
    });
    this.fetchGenderList();
    this.fetchSuffixList();
    if (this.props.UserID.split("|")[1] == "Child") {
      const lastNameArray = userDetailOfPrimary?.memberName?.split(' ')
      const lastName = lastNameArray[lastNameArray?.length - 1]
      konsole.log('lastName', lastName)
      this.setState({ lName: lastName, primartUserLName: lastName })
      this.fetchNotify(this.props.UserID.split('|')[0])
    }
    if (this.props.UserID.split("|")[1] != "Fiduciary/Beneficiary") {
      this.fetchmemberbyID(this.props.UserID.split("|")[0]);
      this.fetchNotify(this.props.UserID.split('|')[0])
    }

    if (this.props.UserID.split("|")[1] !== "Extended Family / Friends" && this.props?.UserID?.split("|")[1] !== "Fiduciary/Beneficiary") {
      this.fetchMaritalStatusList();
    }
    if (this.props.UserID.split("|")[1] !== "Spouse") {
      this.fetchRelationShipList();
    }
    if (this.props.UserID.split("|")[1] == "Spouse") {
      this.fetchRelationShipList();
    }
    this.fetchCitizenshipType();

    this.fetchSavedAddress(this.props.UserID.split("|")[0]);
    this.fetchSavedContactDetails(this.props.UserID.split("|")[0]);
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
    const filterDeceasedIncapacatited = [51, 52, 53, 54, 55, 56]
    let dropValues = data?.data?.data?.filter((data) => !filterDeceasedIncapacatited.includes(Number(data.value)));
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
        return (e.value == "44" || e.value == "47" || e.value == "48" || e.value == "49" || e.value == "50");
      });
      this.setState({
        ...this.state,
        relationshipList: filterRelationship,
      });
    } else if (relationId == "3") {
      let filterRelationship = dropValues.filter((e) => {
        return (e.value == "3");
      });
      this.setState({
        ...this.state,
        relationshipList: filterRelationship,
      });
    }
    else if (relationId != "2" && relationId != "41" && relationId != "6" && relationId != "28" && relationId != "5" && relationId != "29" && relationId != "44" && relationId != "47" && relationId != "48" && relationId != "3" && relationId != "1" && relationId != "49" && relationId != "50" && relationId != "4" && relationId != "12") {

      let filterRelationship = dropValues.filter((e) => {
        return (e.value != "2" && e.value != "41" && e.value != "6" && e.value != "28" && e.value != "5" && e.value != "29" && e.value != "44" && e.value != "47" && e.value != "48" && e.value != "3" && e.value != "1" && e.value != "49" && e.value != "50" && e.value != "4" && e.value != "12"
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
  fetchRelationShipList = () => {
    if (this.props.UserID.split("|")[1] == "Extended Family / Friends" || this.props.UserID.split("|")[1] == "Fiduciary/Beneficiary") {
      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getRelationshiplist, this.state, (response) => {
        konsole.log("response realt", response);
        if (response) {
          konsole.log("relationAPI111", response.data.data);
          if (this.props.UserID.split("|")[1] == "Fiduciary/Beneficiary") {
            this.fetchmemberbyID(this.props.UserID.split("|")[0], response);
            this.fetchNotify(this.props.UserID.split('|')[0])
          } else {
            const excludedValues = [1, 2, 3, 4, 5, 6, 12, 13, 28, 29, 41, 44, 45, 47, 48, 49, 50, 51, 52, 53, 55, 56, 54];
            let filteredData = response.data.data.filter((data) => !excludedValues.includes(Number(data.value)));
            this.setState({
              ...this.state,
              relationshipList: filteredData,
            });
          }
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
        this.setState({ disable: false })
        konsole.log("response realt", response);
        if (response) {
          let filteredData = response.data.data.filter((data) => data.value == "3");
          konsole.log("relationAPI", response.data.data);
          this.setState({
            ...this.state,
            relationshipList: filteredData,
            rltnTypeWithSpouseId: filteredData.length > 0 ? filteredData[0].value : ''
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
    // }

  };

  fetchSavedAddress = (userId) => {
    if (!isNotValidNullUndefile(userId)) return;
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAllAddress + userId, "", (response) => {
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
    if (!isNotValidNullUndefile(userId)) return;
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAllContactOtherPath + userId, "", (response) => {
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
        this.fetchmemberbyID(this.props.UserID.split("|")[0]);
        this.fetchNotify(this.props.UserID.split('|')[0])
        this.fetchMaritalStatusList();
        this.fetchCitizenshipType();
        this.fetchSavedAddress(this.props.UserID.split("|")[0]);
        this.fetchSavedContactDetails(this.props.UserID.split("|")[0]);
      }
    }
    if(isNotValidNullUndefile(this.state.dob) && prevState.dob !== this.state.dob && isDateComplete(this.state?.dob)){
      if(isUserUnder16(this.state?.dob)){
        this.setState({maritalStatusId:3})
      }

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
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getCitizenshipType, this.state, (response) => {
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
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFamilyMemberbyID + userid, "", (response) => {
  
      this.props.dispatchloader(false);
      if (response) {
        let userResposne = response?.data?.data?.member
        // konsole.log(userResposne, "ppppppppppppp")
        let userData = response
        let dob = "";
        if (this.props.UserID.split("|")[1] == "Fiduciary/Beneficiary") {
          this.newDropdown(userData, data)
        }

        if (response.data.data.member.dob) {
          dob = new Date(response.data.data.member.dob);
        } else {
          dob = "";
        }
        const userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary")).memberName;
        const pieces = userDetailOfPrimary?.split(/[\s,]+/);
        const lName = (!this?.props?.inLawLastName)?pieces[pieces.length - 1]:this?.props?.inLawLastName;
        let includecheckfname = response?.data?.data?.member?.fName;
        let lastLName = response?.data?.data?.member?.lName;
        let firstName = includecheckfname.includes("- Child -") || includecheckfname.includes("- Spouse") ? "" : includecheckfname;
        let lastName = ( lastLName == "Name" && 
          (this.props.UserID.split("|")[1] == "Spouse" || this.props.UserID.split("|")[1] == "Child" || ( this.props.UserID.split("|")[1] == "In-Law" && isNotValidNullUndefile(this.props?.childGenderId) && this.props?.childGenderId == 1 && this.props?.childMaritalStatusId == 1) ))? lName : lastLName !== "Name" ? lastLName : "";
        
        // konsole.log("lNamepieces",pieces[pieces.length - 1],this?.props?.inLawLastName,response.data.data.member.lName,"lastName",lastName,"--------",isNotValidNullUndefile(this.props?.childGenderId),this.props?.childGenderId ,this.props?.childMaritalStatusId)
        this.setState({
          memberData: response.data.data.member,
          userId: response.data.data.member.userId,
          memberStatusId: response.data.data.member.memberStatusId ?? livingMemberStatusId,
          memberStatusIdforTestRef: response.data.data.member.memberStatusId ?? livingMemberStatusId,
          dateOfDeath: response.data.data.member.dateOfDeath,
          // userDetailOfPrimaryspouseName: JSON.parse(sessionStorage.getItem('userDetailOfPrimary')).spouseName,
          fName: firstName,
          fNameforTestRef: firstName,
          mName: response.data.data.member.mName,
          lName: lastName,
          memberId: response.data.data.member.memberId,
          nickName: response.data.data.member.nickName,
          dob: dob,
          genderId: response.data.data.member.genderId,
          maritalStatusId: response.data.data.member.maritalStatusId,
          isVeteran: response.data.data.member.isVeteran,
          suffixId: response.data.data.member.suffixId,
          birthPlace: response.data.data.member.birthPlace,
          citizenshipId: response.data.data.member.citizenshipId || 187,
          noOfChildren: response.data.data.member.noOfChildren,
          previousNoOfChildren: response.data.data.member.noOfChildren,
          userRltnshipId: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.userRltnshipId : 0,
          isFiduciary: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.isFiduciary : false,
          isFiduciaryforTestRef: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.isFiduciary : false,
          isBeneficiary: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.isBeneficiary : false,
          isBeneficiaryforTestRef: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.isBeneficiary : false,
          relationshipTypeId: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.relationshipTypeId : 0,
          rltnTypeWithSpouseId: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.rltnTypeWithSpouseId : 0,
          userMemberId: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.userMemberId : 0,
          relationshipType: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.relationshipType : "",
          relativeUserId: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.relativeUserId : "",
          parentUserId: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.primaryUserId : this.state.parentUserId,
          emergencyContact: response.data.data.member.memberRelationship ? response.data.data.member.memberRelationship.isEmergencyContact : false
        });

        // this.props.dispatchloader(false);
      }
    }
    );
  };

  fetchNotify = (userId) => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getNotifyContactMapApi + '/' + this.props.ParentUserID + '/0/0' + "?ContactUserId=" + userId, "", (response, error) => {
      if (response) {
        let notifdata = response?.data?.data?.filter((e) => e.contactUserId == userId)
        konsole.log(notifdata, "notifdatanotifdata24")
        notifdata.map((e) => {
          if (e.notifyConditionId == 1) {
            this.setState({
              isIllness: e
            })
          }
          if (e.notifyConditionId == 4) {
            this.setState({
              ismentalhealth: e
            })
          }
          if (e.notifyConditionId == 2) {
            this.setState({
              isendoflife: e
            })
          }
          if (e.notifyConditionId == 3) {
            this.setState({
              isdeath: e
            })
          }
        })
      } else {
        konsole.log(error, "yyyyyyyyyyyyyyyy")
      }
    })

  }

  handleDate = (date) => {
    this.setState({
      dob: date,
    });
  };
  handleOnBlurFocus = (date) => {
    let datedob = date !== null && date !== "" && date !== undefined ? $AHelper.calculate_age($AHelper.getFormattedDate(date)) : 0;
    konsole.log("datedate", date, datedob, this.state.isFiduciary);
    if (this.state.isFiduciary == true && datedob < 18) {
      this.setState({
        dob: null,
      });
      this.toasterAlert("Fiduciary cannot be Minor. Please enter correct date of birth", "Warning");
      return;
    } else {
      this.setState({
        dob: date,
      });
    }
  };

  handleChange = (event) => {
    konsole.log("fNamefName", event.target.id, event.target.value);
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
    } else if (eventId === "genderId" && this.props.UserID.split("|")[1] === "Child") {
      let relationWithPrimary = 2;
      let rltnTypeWithSpouseId = 2;
      let lastName = '';
      const trackLastName = this.state.lName
      if (eventValue == "1") {
        relationWithPrimary = "5";
        rltnTypeWithSpouseId = "5";
        lastName = isNullUndefine(trackLastName)? this.state.primartUserLName : trackLastName
      }
      else if (eventValue == "2") {
        relationWithPrimary = "6";
        rltnTypeWithSpouseId = "6";
        lastName = isNullUndefine(trackLastName)  ? this.state.primartUserLName : trackLastName
      } else {
        lastName = trackLastName;
        relationWithPrimary = 2;
        rltnTypeWithSpouseId = 2; 
      }
      this.setState({
        ...this.state,
        relationshipTypeId: relationWithPrimary,
        rltnTypeWithSpouseId: rltnTypeWithSpouseId,
        genderId: eventValue,
        lName: lastName
      });
    } else if (eventId === "genderId" && this.props.UserID.split("|")[1] === "In-Law") {
      let relationWithPrimary = "";
      let rltnTypeWithSpouseId = "";
      if (eventValue === "1") {
        relationWithPrimary = "48";
        rltnTypeWithSpouseId = "48";
      }
      else if (eventValue == "2") {
        relationWithPrimary = "47";
        rltnTypeWithSpouseId = "47";
      }
      this.setState({
        ...this.state,
        relationshipTypeId: relationWithPrimary,
        rltnTypeWithSpouseId: rltnTypeWithSpouseId,
        genderId: eventValue
      });

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
        this.validateMaritalDate(eventValue)
      }
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
    if (this.state.fName == "") {
      nameError = "First Name cannot be blank";
      this.setState({ disable: false })
    }
    else if (this.state.lName == "") {
      nameError = "Last Name cannot be blank";
      this.setState({ disable: false })
    }
    // else if ( this.state.isFiduciary == false && this.state.isBeneficiary == false && (this.props?.UserID?.split("|")[1] !== "Extended Family / Friends" || this.props.UserID.split("|")[1] == "Fiduciary/Beneficiary")) {
    else if (this.state.isFiduciary == false && this.state.isBeneficiary == false && this.props.UserID.split("|")[1] == "Fiduciary/Beneficiary") {
      nameError = "Please choose at-least one option from Fiduciary / Beneficiary";
      this.setState({ disable: false })
    }
    // konsole.log("this.state?.maritalStatusId ", this.state?.maritalStatusId);

    else if (this.props?.UserID != undefined && (this.props?.UserID?.split("|")[1] !== "Extended Family / Friends" && this.props.UserID.split("|")[1] !== 'Fiduciary/Beneficiary' && this.props?.UserID.split('|')[1] !== 'Grand-Child' && this.props.UserID.split("|")[1] !== 'Fiduciary/Beneficiary' && this.props?.UserID.split('|')[1] !== 'Child' && this.props.UserID.split("|")[1] !== "In-Law" ) && (this.state.maritalStatusId == 0 || this.state.maritalStatusId == "" || this.state.maritalStatusId == null)) {
      nameError = "Relationship status cannot be blank";
    }else if(isNotValidNullUndefile(this.props?.UserID) && this.props?.UserID?.split("|")[1]=='Child' && isValidateNullUndefine(this.state.rltnTypeWithSpouseId) && isNotValidNullUndefile(this.state.spouseUserId) && this.state.spouseUserId !='null'){
      nameError=`Please Choose Relation with ${this.state?.spouseUsername}`
    }else if(isNotValidNullUndefile(this.props?.UserID) && this.props?.UserID?.split("|")[1]=='Child' && isValidateNullUndefine(this.state.relationshipTypeId)){
      nameError=`Please Choose Relation with ${this.state.primaryMamberName}`
    }
    // if (this.props?.UserID?.split("|")[1] == "Extended Family / Friends" || this.props.UserID.split("|")[1] == "Fiduciary/Beneficiary" ) {
    //   if (this.state?.relationshipTypeId == "Relationship with Primary Member") {
    //     nameError = "Please Choose Relation with User";
    //   } else if (this.state.addressData.length >= 0) {
    //     konsole.log("hsufuiodufdi", this.props.UserID.split("|")[1] == "Fiduciary/Beneficiary" && this.state?.relationshipTypeId != 3)
    //     const filterAddress = this.state.addressData.filter((item) => parseInt(item.addressTypeId) === 1);
    //     konsole.log("sam00000", filterAddress)
    //     if (filterAddress <= 0) {
    //       if (this.props.UserID.split("|")[1] == "Fiduciary/Beneficiary" && this.state?.relationshipTypeId == 3) {

    //       } else if (this.props.UserID.split("|")[1] == "Fiduciary/Beneficiary" && this.state?.relationshipTypeId != 3) {
    //         nameError = "Please add physical address"
    //       } else if (this.props.UserID.split("|")[1] != "Fiduciary/Beneficiary") {
    //         nameError = "Please add physical address"
    //       }
    //     };
    //   } else if ( this.state.emailData.length == 0 && this.state.mobileData.length == 0) {
    //     nameError = "Contact cannot be blank";
    //   }
    // }


    else if (this.props?.UserID?.split("|")[1] == "Spouse" && this.state.addressData.length >= 0) {
      const filterAddress = this.state.addressData.filter((item) => parseInt(item.addressTypeId) === 1);
      if (filterAddress <= 0) {
        nameError = "Please add physical address"
      };
    }

    // if (this.state.birthPlace == "") {
    //     nameError = "Birth Place cannot be blank";
    // }
    else if (this.state.citizenshipId == 0) {
      nameError = "Citizenship cannot be blank";
    }
    //   if (this.state.dob == "") {
    //       nameError = "Date of Birth cannot be blank";
    //   }
    //   if (this.state.genderId == 0) {
    //       nameError = "Gender cannot be blank";
    //   }
    //   if(this.state.dob == "" || this.state.dob == null){
    //       nameError = "Select atleast one Fiduciary/Beneficiary";
    //   }  


    if (nameError) {
      this.setState({ disable: false })
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
    konsole.log("birthplace", event);
    let birthPlaceObj = "";
    if (event) {
      birthPlaceObj = event;
    }
    this.setState({
      birthPlace: birthPlaceObj,
    });
  };



  handleEditFamilyMembers = () => {
    this.setState({ disable: true })

    if (isNotValidNullUndefile(this.state.dob ) && this.state.relationshipTypeId == 1 && $AHelper.checkIFMinor(this.state.dob) < 16) {
      this.toasterAlert(`${this.props.UserID.split("|")[1]} cannot be Minor.`, "Warning");
      this.setState({ disable: false })
      return 0;
    }
    let datedob =  isNotValidNullUndefile(this.state.dob ) ? $AHelper.calculate_age($AHelper.getFormattedDate(this.state.dob)) : 0;
    if (this.state.isFiduciary == true && datedob < 18) {
      this.toasterAlert("Fiduciary cannot be Minor. Please enter correct date of birth", "Warning");
      this.setState({ disable: false })
      return;
    }

    const inputData = {
      userId: this.state.userId,
      fName: $AHelper.capitalizeAllLetters(this.state.fName),
      mName: $AHelper.capitalizeAllLetters(this.state.mName),
      lName: $AHelper.capitalizeAllLetters(this.state.lName),
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
        relationshipTypeId: this.state.relationshipTypeId,
        rltnTypeWithSpouseId: this.state.rltnTypeWithSpouseId,
        isFiduciary: (this.state.memberStatusId == deceaseMemberStatusId || this.state.memberStatusId == specialNeedMemberStatusId ||  this.state.relationshipTypeId ==46 ) ? false : this.state.isFiduciary,
        isBeneficiary: (this.state.memberStatusId == deceaseMemberStatusId) ? false : this.state.isBeneficiary,
        userRltnshipId: this.state.userRltnshipId,
        userMemberId: this.state.userMemberId,
        relationshipType: this.state.relationshipType,
        relativeUserId: this.state.relativeUserId,
        isEmergencyContact: this.state.memberStatusId == deceaseMemberStatusId ? false : this.state.emergencyContact
      },
    };




    if (this.state.dob !== null && this.state.dob !== "" && this.state.dob !== undefined) {
      inputData["dob"] = $AHelper.getFormattedDate(this.state.dob);
    }
    konsole.log("inputDataat", inputData);

    let primarySpouseUserId = sessionStorage.getItem("spouseUserId");
    if (this.validate()) {
      if (this.props?.UserID.split("|")[1] == 'In-Law' && $AHelper.checkIFMinor(this.state.dob) < 16) {
        this.toasterAlert(`In-Law can not be minor.`, "Warning");
        this.setState({ disable: false })
        return;
      }
      if ((this.props?.UserID.split("|")[1] == 'Child' || this.props?.UserID.split("|")[1] == 'Grand-Child') && this.state.maritalStatusId == 1 && (this.state.dob == null || this.state.dob == "" || this.state.dob == undefined)) {
        this.toasterAlert(`Please enter DOB as minor can not have married as a marital status.`, "Warning");
        this.setState({ disable: false })
        return;

      }
      if (this.state.memberStatusId != deceaseMemberStatusId && (this.props.UserID.split('|')[1] == 'Child' || this.props.UserID.split("|")[1] == "Spouse")) {
       this.props.dispatchloader(true);
       let value = this.occupationRef.current.handleOccupationSubmit();
       this.props.dispatchloader(false);
        if (value !== undefined) {
          if (value == "occuption") {
            this.setState({ disable: false })
            this.toasterAlert("Occupation cannot be empty", "Warning");
            return;
          }
          // if (value == "ageOfRetirement") {
          //   this.toasterAlert("Age of Retirement cannot be empty", "Warning");
          //   return;
          // }
          if (value == "professBackground") {
            this.setState({ disable: false })
            this.toasterAlert("Professional Background cannot be empty", "Warning");
            return;
          }
          if (value == "isDisabled") {
            this.setState({ disable: false })
            this.toasterAlert("please select Disabled choice.", "Warning");
            return;
          }
          if (value == "occuption") {
            this.setState({ disable: false })
            this.toasterAlert("Occupation cannot be empty", "Warning");
            return;
          }
        }
      }
      if (this.state.isFiduciary == true && this.state.dob !== null && this.state.dob !== "" && this.state.dob !== undefined && $AHelper.checkIFMinor(this.state.dob) < 16) {
        this.toasterAlert("Fiduciary cannot be Minor. Please enter correct date of birth ", "Warning");
        return;
      }

      if (this.state.noOfChildren !== null && parseInt(this.state.noOfChildren) !== 0 && $AHelper.checkIFMinor(this.state.dob) < 16) {
        this.toasterAlert("Please provide DOB as minor can not have child", "Warning");
        return;

      }
      if (this.state.dob !== null && this.state.dob !== "" && this.state.dob !== undefined && this.props?.UserID?.split("|")[1] !== "Extended Family / Friends" && this.props.UserID.split("|")[1] !== "Fiduciary/Beneficiary" && this.state.maritalStatusId !== undefined && this.state.maritalStatusId !== null && this.state.maritalStatusId !== '' && this.state.maritalStatusId != 3 && $AHelper.checkIFMinor(this.state.dob) < 16) {
        this.toasterAlert("Minor can only have Single as relation status", "Warning");
        return;

      }

      if (this.state.relationshipTypeId == 1 && this.props.UserID.split("|")[1] == "In-Law") {
        this.toasterAlert(`Please Choose Relation with ${this.state.primaryMamberName}`, "Warning");
        this.setState({ disable: false })
        return;
      }

      konsole.log("inputDatainputData", inputData)
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUpdateMember, inputData, async (response) => {
 
        AlertToaster.success("Data saved successfully");
        this.props.dispatchloader(false);
        konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          konsole.log("checked response ", response);
          konsole.log('responsedata', response)
          const responseData = response?.data?.data?.member

          await this.postNotifydata();
          if (this.asKnownAsRef?.current) {
            this.asKnownAsRef?.current?.saveOtherData(responseData?.member?.userId);
          }
          if (responseData?.memberRelationship?.relationshipTypeId == '999999') {
            this.relationshipRef.current?.saveHandleOther(responseData?.memberId);

          }
          if (responseData?.memberRelationship?.rltnTypeWithSpouseId == '999999') {
            this.spouserelationshipRef.current?.saveHandleOther(responseData.memberId);
          }
          if (this.props.UserID.split("|")[1] == "Spouse" && this.state.userId == primarySpouseUserId) {
            const userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
            userDetailOfPrimary.spouseName = responseData?.fName + ' ' + responseData.lName;
            sessionStorage?.setItem("userDetailOfPrimary", JSON.stringify(userDetailOfPrimary));
            window.location.reload();
          }


          if (this.state.memberStatusId != deceaseMemberStatusId && this.props.UserID.split("|")[1] !== "Child" || (this.props.UserID.split("|")[1] == "Child" && this.state.addressData.length === 0) || (this.state.maritalStatusId !== "1" && this.state.maritalStatusId !== "2")) return this.handleClose();
          const spouseUserId = responseData.spouseUserId;
          const postAddAddress = {
            userId: spouseUserId,
            address: this.state.addressData.find((item) => parseInt(item.addressTypeId) === 1),
          }
          if (isNotValidNullUndefile(postAddAddress?.address) && Object?.keys(postAddAddress?.address)?.length === 0) {
            return this.handleClose();
          }
          this.handleMemberAddress(spouseUserId, postAddAddress?.address?.addressId, responseData.userId, this.state.loggedInUser);
        } else {
          this.toasterAlert(Msg.ErrorMsg, "Warning");
          this.setState({ disable: false })
        }
      }
      );

      this.props.dispatchloader(false);
    }
  };

  postNotifydata = () => {

    return new Promise((resolve, reject) => {

      let jsonfornotifycontact = [];
      let isIllness = {
        "contactMapId": this.state.isIllness.contactMapId ? this.state.isIllness.contactMapId : 0,
        "primaryMemberId": this.props.ParentUserID,
        "contactNatureId": 1,
        "contactUserId": this.state.userId,
        "notifyConditionId": 1,
        "contactStatus": this.state.isIllness.contactStatus,
        "upsertedBy": this.state.loggedInUser,
      }
      let isendoflife = {
        "contactMapId": this.state.isendoflife.contactMapId ? this.state.isendoflife.contactMapId : 0,
        "primaryMemberId": this.props.ParentUserID,
        "contactNatureId": 1,
        "contactUserId": this.state.userId,
        "notifyConditionId": 2,
        "contactStatus": this.state.isendoflife.contactStatus,
        "upsertedBy": this.state.loggedInUser,
      }
      let ismentalhealth = {
        "contactMapId": this.state.ismentalhealth.contactMapId ? this.state.ismentalhealth.contactMapId : 0,
        "primaryMemberId": this.props.ParentUserID,
        "contactNatureId": 1,
        "contactUserId": this.state.userId,
        "notifyConditionId": 4,
        "contactStatus": this.state.ismentalhealth.contactStatus,
        "upsertedBy": this.state.loggedInUser,
      }

      let isdeath = {
        "contactMapId": this.state.isdeath.contactMapId ? this.state.isdeath.contactMapId : 0,
        "primaryMemberId": this.props.ParentUserID,
        "contactNatureId": 1,
        "contactUserId": this.state.userId,
        "notifyConditionId": 3,
        "contactStatus": this.state.isdeath.contactStatus,
        "upsertedBy": this.state.loggedInUser,
      }
      if (this.state.isIllness.contactMapId || this.state.isIllness.contactStatus) {
        jsonfornotifycontact.push(isIllness)
      }
      if (this.state.isendoflife.contactMapId || this.state.isendoflife.contactStatus) {
        jsonfornotifycontact.push(isendoflife)
      }
      if (this.state.ismentalhealth.contactMapId || this.state.ismentalhealth.contactStatus) {
        jsonfornotifycontact.push(ismentalhealth)
      }
      if (this.state.isdeath.contactMapId || this.state.isdeath.contactStatus) {
        jsonfornotifycontact.push(isdeath)
      }
      if (jsonfornotifycontact?.length == 0) {
        resolve('resolve');
      }else{
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.upsertNotifyContactMapApi, jsonfornotifycontact, (res, err) => {
          resolve('resolve')
          if (res) {
            konsole.log(res, "respnse111111111")
          } else if (err) {
            konsole.log(err, "respnse111111111")
          }
        })
      }
    })


  }

  handleMemberAddress = (userId, addressId, primaryUserId, loggedInUser) => {
    this.props.dispatchloader(true);
    $postServiceFn.memberAddress(userId, addressId, primaryUserId, true, loggedInUser, (response) => {
      this.props.dispatchloader(false);
      if (response) {
        this.setState({ disable: false });
      }
      this.handleClose();
    });
  };

  handleDeleteContact = async (userid, contactId) => {
    let ques = await this.context.confirm(true, "Are you sure? You want to delete your Contact.", "Confirmation");
    if (ques) {
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteContactPath + userid + "/" + contactId, "", (response) => {
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
      previousNoOfChildren: 0,
      dob: "",
    });
    this.setState({ disable: false });

  };

  InvokeEditContactID = (contactTypeId, EditContactType) => {
    this.setState({
      EditContactType: EditContactType,
      EditContactId: contactTypeId,
    });

    this.handleshowContact();
  };

  toasterAlert(text, type) {
    this.setState({ disable: false })
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

  revertChildNo = () => {
    if (this.state.noOfChildren == "0")
      this.setState({ noOfChildren: "" });
  }

  handleBlur = () => {
    let previousNoOfChildren = this.state.previousNoOfChildren
    if (this.state.noOfChildren == "") this.setState({ noOfChildren: "0" })
    if (previousNoOfChildren !== undefined && previousNoOfChildren !== null && previousNoOfChildren !== '' && previousNoOfChildren > this.state.noOfChildren) {
      this.toasterAlert("You cannot decrease no. of child.", "Warning");
      this.setState({
        noOfChildren: previousNoOfChildren,
      });
      return;
    }
  }

  //  function for decease child ----------------------
  handleMemberStatusRadio = (id) => {
    konsole.log('idididibhuiytv', id)
    this.setState({ memberStatusId: id })
  }

  handleDodDate = (date) => {
    konsole.log("Post save Data", date);
    this.setState({
      dateOfDeath: date,
    });
  };

  // /*   ----***--------***---- this function for check date validity with onBlur ----***--------***---- */
  handleDateBlur = (type) => {
    var dob = new Date(this.state.dob);
    var dod = new Date(this.state?.dateOfDeath);
    var isValid = dob <= dod;
    let datedob = isNotValidNullUndefile(this.state?.dob) ? $AHelper.calculate_age($AHelper.getFormattedDate(this.state?.dob)) : 0;
    if (this.state?.isFiduciary == true && datedob < 18) {
      this.toasterAlert("Fiduciary cannot be Minor. Please enter correct date of birth", "Warning");
      this.setState({ isFiduciary: false })
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


  render() {

    // konsole.log("propsss",this.props,this.props.UserID,this.props.inLawLastName)
    console.log("rltnTypeWithSpouseIdrltnTypeWithSpouseId",this.state.rltnTypeWithSpouseId,this.state.relationshipTypeId)
    const stateAccess = this.state;
    const editType = this.props.UserID.split("|")[1];

    let relationshipTypeList = stateAccess.relationshipList;
    if (editType == 'In-Law' && stateAccess.genderId == 1) {
      relationshipTypeList = stateAccess.relationshipList.filter((item) => item.value == 48 || item.value == 50)
    } else if (editType == 'In-Law' && stateAccess.genderId == 2) {
      relationshipTypeList = stateAccess.relationshipList.filter((item) => item.value == 47 || item.value == 49)
    }
    const showLivingDeceasedNSpecialNeedRadio = [2, 5, 6, 28, 29, 41].includes(Number(this.state?.relationshipTypeId))

    let primarySpouseUserId = sessionStorage.getItem("spouseUserId");
    const maxDate = this.props?.UserID && this.props?.UserID.split("|")[1] == "Spouse" ? 16 : 0;
    const forGrandChildCheck = this.props.UserID.split("|")[1]
    let relationshipList = [];
    // let relationshiplistSort =   this.state.relationshipList.length > 0 &&   $AHelper.relationshipListsortingByString(this.state.relationshipList);
    let relationshiplistSort = this.state.relationshipList?.length > 0 && editType == "Child" ? this.state?.relationshipList : $AHelper.relationshipListsortingByString(this.state.relationshipList);
    relationshipList = relationshiplistSort?.length > 0 && this.state.isFiduciary == true ? relationshiplistSort?.filter((items) => items?.value !== "46") : relationshiplistSort;

    konsole.log("editTypeeditType", editType, this.state.dob);

    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0;
          }
        `}</style>
        <Modal show={this.props.show} size="lg" centered onHide={this.handleClose} animation="false" backdrop="static">
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>
              {this.props.UserID ? this.props.UserID.split("|")[1] : ""} Details{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="person-content">
              {/* <Row className="m-0 f-details person-head mb-3">
                <Col xs md="12" className="p-0">
                  <div className="d-flex align-items-center ">
                    <div className="flex-shrink-0 col"> */}
              {/* {this.props.UserID != undefined &&
                      this.props.UserID.split("|")[1] == "Spouse" ? (
                        <img src="/icons/womanAvatar.svg" alt="user" />
                      ) : (
                        <img src="/icons/ProfilebrandColor2.svg" alt="user" />
                      )} */}
              {/* <img src="/icons/ProfilebrandColor2.svg" alt="user" />
                    </div>
                  </div>
                </Col>     
              </Row> */}
              <Row className="m-0 f-details person-head mb-3">
                <Col xs md="6" className="p-0">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 col">
                      <img src="/icons/ProfilebrandColor2.svg" alt="user" />
                    </div>
                  </div>
                </Col>
                {(this.state.checkjointconditionforoccurance == 2) &&
                  <Col xs md="6" className="p-0">
                    <div className="d-flex align-items-center justify-content-end">
                      <button className="theme-btn py-0" disabled>LINKED ACCOUNT</button>

                    </div>
                  </Col>}
              </Row>

              <Form.Group as={Row} className="mb-2">
                <Col xs="12" sm="12" md="4" lg="4" className="mb-2">
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
                <Col xs="12" sm="12" md="4" lg="4" className="mb-2">
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
                <Col xs="12" sm="12" md="4" lg="4">
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
              </Form.Group>
              <Form.Group as={Row} className="mb-2">
                <Col xs="12" sm="12" md="4" lg="4" className="mb-2">
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
                <Col xs="12" sm="12" md="4" lg="4" className="mb-2">
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
                <Col xs="12" sm="12" md="4" lg="4">
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
                <Col xs="12" sm="12" md="4" lg="3">
                  <AlsoKnownAs key={'spouseDetails'} ref={this.asKnownAsRef} setLoader={this.props.dispatchloader} userId={this.props.UserID.split("|")[0]} />
                </Col>
              </Form.Group>
              {/* ----***--------***---- None /Decease/Special Need  ----***--------***---- */}
              {(editType == 'Child' || showLivingDeceasedNSpecialNeedRadio == true) &&
                <DeceaseNoneSpecialNeedRadio
                  key={this.state.memberStatusId}
                  handleMemberStatusRadio={this.handleMemberStatusRadio}
                  memberStatusId={this.state.memberStatusId}
                  memberStatusIdforTestRef={this.state.memberStatusIdforTestRef}
                  refrencePage='spouseDetails'
                  fName={this.state.fNameforTestRef}
                  childName={this.state.fNameforTestRef + ' ' + this.state.lName}
                  isFiduciary={this.state.isFiduciaryforTestRef}
                  isBeneficiary={this.state.isBeneficiaryforTestRef}
                  genderId={this.state.genderId}
                // isBeneficiary={this.state.isBeneficiary}
                // isFiduciary={this.state.isFiduciary}

                />}
              {/* ----***--------***---- None /Decease/Special Need  ----***--------***---- */}
              <Form.Group as={Row} className="mb-2">

                <Col xs="12" sm="12" md="4" lg="4" className="mb-1">
                  <label className="m-0 p-0">Date of Birth</label>
                  <DatepickerComponent
                    name="dob"
                    value={this.state.dob}
                    setValue={this.handleDate}
                    placeholderText="D.O.B."
                    maxDate={maxDate}
                    minDate="100"
                    validDate={maxDate}
                    // handleOnBlurFocus={this.handleOnBlurFocus}
                    handleOnBlurFocus={() => this.handleDateBlur('dateOfDeath')}

                  />
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
                  {this.props?.UserID?.split("|")[1] !== "Extended Family / Friends" && this.props?.UserID?.split("|")[1] !== "Fiduciary/Beneficiary" && (
                    <Col xs="12" sm="12" md="4" lg="4" className="mb-1">
                      <PlaceOfBirth
                        birthPlace={this.state.birthPlace}
                        handlePlaceBirth={this.handlePlaceBirth}
                      />
                    </Col>
                  )}
                </>}
                <Col xs="12" sm="12" md="4" lg="4" className="mt-0 pt-0 mb-0 pb-0">
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

              {
                (this.props.UserID.split("|")[1] === "Spouse" && this.props?.UserID?.split("|")[1] !== "Child" && this.props?.UserID?.split("|")[1] !== "Extended Family / Friends" && this?.props?.UserID?.split("|")[1] !== "Fiduciary/Beneficiary" && this?.props?.UserID?.split("|")[1] !== "In-Law" && this?.props?.UserID?.split("|")[1] !== "Grand-Child")
                  || (this.props.UserID.split("|")[1] !== "Spouse" && this.props?.UserID?.split("|")[1] !== "Child" && this.props?.UserID?.split("|")[1] !== "Extended Family / Friends" && this?.props?.UserID?.split("|")[1] !== "Fiduciary/Beneficiary" && this?.props?.UserID?.split("|")[1] !== "In-Law" && this?.props?.UserID?.split("|")[1] !== "Grand-Child")
                  ? "" : (
                    <Form.Group as={Row} className="mb-2">
                      <Col xs="12" sm="12" md="4" lg="6" className="mb-2">
                        <Form.Select
                          value={(this.state.relationshipTypeId == 1 && editType == "In-Law") ? -1 :this.state.relationshipTypeId>0?this.state.relationshipTypeId:-1}
                          id="relationshipTypeId"
                          onChange={this.handleChange}
                          disabled={forGrandChildCheck == 'Grand-Child'}
                        >
                          <option value="-1" disabled selected hidden>Relationship with {this.state.primaryMamberName}</option>
                          {relationshipTypeList?.length > 0 &&
                            relationshipTypeList?.map((suffix, index) => {
                              return (
                                <option
                                  key={index}
                                  value={suffix.value}
                                  style={{ height: "20px" }}
                                >
                                  {suffix?.label}
                                </option>
                              );
                            })}
                        </Form.Select>
                      </Col>
                      {this.state.relationshipTypeId == "999999" && (
                        <Col xs="12" sm="12" md="4" lg="6">
                          <Other
                            othersCategoryId={27}
                            userId={this.state.parentUserId}
                            dropValue={this.state.relationshipTypeId}
                            ref={this.relationshipRef}
                            natureId={this.state.memberId}
                          />
                        </Col>
                      )}
                    </Form.Group>
                  )}

              {/* {(this.props.UserID.split("|")[1] !== "Extended Family / Friends") || (this.props?.UserID?.split("|")[1] == "Child" && this.props.UserID.split("|")[1] === "Spouse")  ? (
                ""
              ) : (
                <Form.Group as={Row} className="mb-3">
                  <Col xs sm="6" lg="6">
                    <Form.Select
                      value={(this.state.relationshipTypeId == 1 && editType == "In-Law") ? -1 : this.state.relationshipTypeId}
                      id="relationshipTypeId"
                      onChange={this.handleChange}
                    >
                      <option value="-1" disabled selected hidden>Relationship with {this.state.primaryMamberName}</option>
                      {this.state.relationshipList?.length > 0 &&
                        relationshipList?.map((suffix, index) => {
                          return (
                            <option
                              key={index}
                              value={suffix.value}
                              style={{ height: "20px" }}
                            >
                              {suffix?.label}
                            </option>
                          );
                        })}
                    </Form.Select>
                  </Col>
                  {this.state.relationshipTypeId == "999999" && (
                    <Col xs sm="6" lg="6">
                      <Other
                        othersCategoryId={27}
                        userId={this.state.parentUserId}
                        dropValue={this.state.relationshipTypeId}
                        ref={this.relationshipRef}
                        natureId={this.state.memberId}
                      />
                    </Col>
                  )}
                </Form.Group>
               )
              } */}

              {
                primarySpouseUserId == undefined ||
                  primarySpouseUserId == "" ||
                  primarySpouseUserId == null ||
                  primarySpouseUserId == "null" ||
                  (this.props.UserID != undefined &&
                    this.props.UserID.split("|")[1] == "Spouse") ?
                  ("") :
                  (
                    <Form.Group as={Row} className="mb-2">
                      {this.props.UserID.split("|")[1] === "Spouse" ? ("") : (
                        <>
                          {(this.state.spouseUserId !== "null") &&
                            (this?.props?.UserID?.split("|")[1] == "Fiduciary/Beneficiary" && this?.props?.UserID?.split("|")[0] == this?.state?.spouseUserId) ? ""
                            : <Col xs="12" sm="12" md="4" lg="6" className="mb-2">
                              <Form.Select
                                value={(isNotValidNullUndefile(this.state.rltnTypeWithSpouseId)&& this.state.rltnTypeWithSpouseId > 0) ? this.state.rltnTypeWithSpouseId : 0}
                                id="rltnTypeWithSpouseId"
                                onChange={this.handleChange}
                                disabled={forGrandChildCheck == 'Grand-Child'}
                              >
                                <option disabled selected hidden value={0}>Relationship with {this.state.spouseUsername}</option>
                                {relationshipTypeList.length > 0 &&
                                  relationshipTypeList?.map((suffix, index) => {
                                    return (
                                      <option
                                        key={index}
                                        value={suffix.value}
                                        style={{ height: "20px" }}
                                      >
                                        {suffix.label}
                                      </option>
                                    );
                                  })}
                              </Form.Select>
                            </Col>
                          }
                          {this.state.rltnTypeWithSpouseId == "999999" && (
                            <Col xs="12" sm="12" md="4" lg="6">
                              <Other
                                othersCategoryId={27}
                                userId={this.state.spouseUserId}
                                dropValue={this.state.rltnTypeWithSpouseId}
                                ref={this.spouserelationshipRef}
                                natureId={this.state.memberId}
                              />
                            </Col>
                          )}
                        </>
                      )}
                    </Form.Group>
                  )
              }

              <div>
                {this.props.UserID != undefined &&
                  this.props.UserID.split("|")[1] !== "Extended Family / Friends" && this.props.UserID.split("|")[1] !== "Fiduciary/Beneficiary" ? (
                  (this.props.UserID != undefined &&
                    this.props.UserID.split("|")[1] == "Spouse") ||
                    (this.props.UserID != undefined &&
                      this.props.UserID.split("|")[1] == "In-Law") ?
                    (
                      ""
                    ) : (
                      <>
                        <Form.Group as={Row} className="mb-3">
                          <Col xs="12" sm="12" md="4" lg="6">
                            <Form.Select
                              value={this.state.maritalStatusId}
                              id="maritalStatusId"
                              onChange={this.handleChange}
                            >
                              <option value="null" disabled selected hidden>
                                Relationship Status
                              </option>
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

                        {this.props.UserID &&
                          this.props.UserID.split("|")[1] == "Child" && (
                            <Row className="m-0 mb-3">
                              <Col xs="12" sm="12" md="4" lg="12" className="ps-0 d-flex gap-3 align-items-center" >
                                <label className="me-2">No. of Children</label>
                                <div key="checkbox13232">
                                  {/* <Form.Control
                                    value={this.state.noOfChildren}
                                    placeholder={this.state.noOfChildren}
                                    id="noOfChildren"
                                    onChange={(event) => {
                                      this.handleChange(event);
                                    }}
                                    onBlur={this.handleBlur}
                                    onFocus={this.revertChildNo}
                                    type="number"
                                  /> */}
                                     <Form.Control
                                      value={this.state.noOfChildren}
                                       placeholder={this.state.noOfChildren}
                                        id="noOfChildren"
                                         onChange={(event) => { this.handleChange(event); }} 
                                         onBlur={this.handleBlur}
                                          onFocus={this.revertChildNo} 
                                          type="text" />
                           
                                </div>
                              </Col>
                            </Row>
                          )}
                      </>
                    )
                ) : (
                  ""

                  // "<Form.Group as={Row} className="mb-3 border border-success">
                  //   <Col xs sm="6" lg="6">
                  //     <Form.Select
                  //       value={this.state.relationshipTypeId}
                  //       id="relationshipTypeId"
                  //       onChange={this.handleChange}
                  //     >
                  //       {/* <option>Relationship with Primary Member</option> */}
                  //       {this.state.relationshipList?.length > 0 &&
                  //         relationshipList?.map((suffix, index) => {
                  //           return (
                  //             <option
                  //               key={index}
                  //               value={suffix.value}
                  //               style={{ height: "20px" }}
                  //             >
                  //               {suffix.label}
                  //             </option>
                  //           );
                  //         })}
                  //     </Form.Select>
                  //   </Col>
                  //   {this.state.relationshipTypeId == "999999" && (
                  //     <Col xs sm="6" lg="4">
                  //       <Other
                  //         othersCategoryId={27}
                  //         userId={this.state.parentUserId}
                  //         dropValue={this.state.relationshipTypeId}
                  //         ref={this.relationshipRef}
                  //         natureId={this.state.memberId}
                  //       />
                  //     </Col>
                  //   )}
                  // </Form.Group>"
                )}
              </div>


              {this.props.UserID.split("|")[1] == "Spouse" &&
                this.state.userId == primarySpouseUserId && (
                  <Row className="m-0 mb-1">
                    <Col xs="12" sm="12" md="4" lg="12" className="ps-0">
                      <Veteran
                        label="Check this box if you are a U.S. Veteran ?"
                        checkVeternProfile={this.checkVeternProfile}
                        userId={this.state.userId}
                        isVeteranChecked={this.state.isVeteran}
                      />
                    </Col>
                  </Row>
                )}
              <div className="m-0 mb-2">
                {(stateAccess.memberStatusId == livingMemberStatusId &&  this.state.relationshipTypeId !=46) && <>
                  <div key="isFiduciary" className="custICheckBoxNdLabel mb-3">
                    <Form.Check
                      className="form-check-smoke"
                      type="checkbox"
                      id="isFiduciary"
                      // label="Fiduciary"
                      // label={`${(this.props.UserID?.split("|")[1] == "Spouse" && this.state.userId == primarySpouseUserId) ? `Fiduciary for ${this.state.primaryMamberName}` : 'Fiduciary'}`}
                      onChange={this.handleChange}
                      checked={this.state.isFiduciary}
                    // disabled={ $AHelper.checkIFMinor(this.state.dob ) < 18}
                    />
                    <label>{`${(this.props.UserID?.split("|")[1] == "Spouse" && this.state.userId == primarySpouseUserId) ? `Fiduciary for ${this.state.primaryMamberName}` : 'Fiduciary'}`}</label>
                  </div>
                </>}
                {(stateAccess.memberStatusId != deceaseMemberStatusId) && <>
                  <div key="isBeneficiary" className="custICheckBoxNdLabel">
                    <Form.Check
                      className="form-check-smoke "
                      type="checkbox"
                      id="isBeneficiary"
                      // label="Beneficiary"
                      // label={`${(this.props.UserID?.split("|")[1] == "Spouse" && this.state.userId == primarySpouseUserId) ? `Beneficiary of ${this.state.primaryMamberName}` : 'Beneficiary'}`}
                      onChange={this.handleChange}
                      checked={this.state.isBeneficiary}
                    />
                    <label>{`${(this.props.UserID?.split("|")[1] == "Spouse" && this.state.userId == primarySpouseUserId) ? `Beneficiary of ${this.state.primaryMamberName}` : 'Beneficiary'}`}</label>
                  </div>
                </>}



                <div className="mt-3">
                  {(stateAccess.memberStatusId == livingMemberStatusId) && <>
                    <label className="emrgncy_h2 d-flex">Make this as an emergency contact ?</label>
                    <Form.Check type="radio" className="left-radio" name="emergency" inline label="Yes" checked={this.state.emergencyContact} onChange={() => { this.setState({ emergencyContact: true }) }} />
                    <Form.Check type="radio" className="left-radio" name="emergency" inline label="No" checked={!this.state.emergencyContact} onChange={() => { this.setState({ emergencyContact: false }) }} />
                    <br />
                  </>}
                  {(stateAccess.memberStatusId != deceaseMemberStatusId) && <>
                    {(this.props.UserID.split("|")[1] == 'Fiduciary/Beneficiary' || this.props.UserID.split("|")[1] == 'Child' || this.props.UserID.split("|")[1] == "Extended Family / Friends") ? <div> <p className="mt-2">Assign Notification for :</p>
                      <div className="d-flex gap-2 mt-2">
                        <div className="custICheckBoxNdLabel">
                          <Form.Check className="form-check-smoke" type="checkbox" id="isillness" checked={this.state.isIllness.contactStatus} onChange={() => this.setState({ isIllness: { ...this.state.isIllness, contactStatus: !this.state.isIllness.contactStatus } })} />
                          <label>Illness</label>
                        </div>
                        <div className="custICheckBoxNdLabel">
                          <Form.Check className="form-check-smoke" type="checkbox" id="ismentalhealth" checked={this.state.ismentalhealth.contactStatus} onChange={() => this.setState({ ismentalhealth: { ...this.state.ismentalhealth, contactStatus: !this.state.ismentalhealth.contactStatus } })} />
                          <label>Mental health</label>
                        </div>
                        <div className="custICheckBoxNdLabel">
                          <Form.Check className="form-check-smoke" type="checkbox" id="isendoflife" checked={this.state.isendoflife.contactStatus} onChange={() => this.setState({ isendoflife: { ...this.state.isendoflife, contactStatus: !this.state.isendoflife.contactStatus } })} />
                          <label>End of Life</label>
                        </div>
                        <div className="custICheckBoxNdLabel">
                          <Form.Check className="form-check-smoke" type="checkbox" id="isdeath" checked={this.state.isdeath.contactStatus} onChange={() => this.setState({ isdeath: { ...this.state.isdeath, contactStatus: !this.state.isdeath.contactStatus } })} />
                          <label>Death</label>
                        </div>
                      </div></div> : ""}
                  </>}
                </div>
              </div>
              {(stateAccess.memberStatusId != deceaseMemberStatusId) && <>

                {
                  this.state.userId && this.state.relativeUserId &&
                  <AddressListComponent
                    addressDetails={this.addressDetails}
                    userId={this.state.userId}
                    editType={editType}
                    relativeUserId={this.state.relativeUserId}
                    ageValidation={$AHelper.checkIFMinor(this.state.dob)}
                    validationUnder14={$AHelper.isUnder14Years(this.state.dob)}
                    setAllAddress={this.handleAddress}
                    dob={this.state.dob}
                    innerSpouseUserId={this.props.innerSpouseUserId}
                    childMaritalStatusId={this.props.childMaritalStatusId}
                  />
                }

                <ContactListComponent
                  contactDetails={this.contactDetails}
                  userId={this.state.userId}
                  editType={editType}
                  setSpouseEmail={(e) =>
                    this.setState({ ...this.state, spouseEmailId: e })
                  }
                  setSpouseMobile={(e) =>
                    this.setState({ ...this.state, spouseMobileNo: e })
                  }
                />
              </>}
            </div>

            {(stateAccess.memberStatusId != deceaseMemberStatusId) && <>
              {this.props.UserID.split("|")[1] == "Spouse" &&
                this.state.userId == primarySpouseUserId && (
                  <>
                    <Row>
                      <Col xs="12" sm="12" lg="6" className="m-0 p-0">
                        <Occupation refrencePage='spouseDetails' editType={editType} userId={this.state.userId} ref={this.occupationRef} dob={this.state?.dob} />
                      </Col>
                    </Row>
                    <JointAccount
                      spouseEmailId={this.state.spouseEmailId}
                      spouseMobileNo={this.state.spouseMobileNo}
                      setcheckjointconditionforoccurance={(e) =>
                        this.setState({
                          ...this.state,
                          checkjointconditionforoccurance: e,
                        })
                      }
                    />
                  </>
                )}

              {this.props.UserID.split('|')[1] == 'Child' && <Row className="w-80">
                <Col xs="12" sm="12" lg="12" className="m-0 p-0">
                  <Occupation  refrencePage='spouseDetails' editType={editType} userId={this.state.userId} ref={this.occupationRef} dob={this.state?.dob} />
                </Col>
              </Row>}
            </>}
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button
              style={{ backgroundColor: "#76272b", border: "none" }}
              className="theme-btn"
              onClick={this.handleEditFamilyMembers}
              disabled={this.state.disable == true ? true : false}
            >
              Update
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
export default connect(mapStateToProps, mapDispatchToProps)(spousedetails);
