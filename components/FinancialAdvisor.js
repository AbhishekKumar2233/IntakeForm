import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, InputGroup, } from "react-bootstrap";
import Address from "./address";
import Contact from "./contact";
import { $CommonServiceFn, $postServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import { financialAdvisor } from "./control/Constant";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { $AHelper } from "../components/control/AHelper";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
// import AddressListComponent from "./addressListComponent";
import ContactListComponent from "./ContactListComponent";
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";
// import PlaceOfBirth from "./PlaceOfBirth";
import DynamicAddressForm from "./DynamicAddressForm";
import Other from "./asssets/Other";
import Select from "react-select";
import { isNotValidNullUndefile, isUrlValid, removeSpaceAtStart } from "./Reusable/ReusableCom";
import ProfessionalContact from "./ProfessionalContact";

export class FinancialAdvisor extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      rerenderpage: "",
      show: false,
      userId: "",
      FinUserId: this.props.docUsr ? this.props.docUsr?.professionalUserId || this.props.docUsr?.userId : "",
      fName: this.props.docUsr ? this.props.docUsr.fName : "",
      mName: this.props.docUsr ? this.props.docUsr.mName : "",
      lName: this.props.docUsr ? this.props.docUsr.lName : "",
      nickName: this.props.docUsr ? this.props.docUsr.nickName : "",
      businessName : this.props.docUsr?.businessName ? this.props.docUsr?.businessName : "",
      businessTypeId : this.props.docUsr?.businessTypeId ? this.props.docUsr?.businessTypeId : "",
      businessTypes: [],
      websiteLink : this.props.docUsr?.websiteLink ? this.props.docUsr?.websiteLink : "",
      allAddress: [],
      // proCategoriesAtUpdate : this.props.docUsr ? [this.props.docUsr] : [],
      loggedInUser: "",
      disable: false,
      formlabelData: {},
      updateCaregiverSuitabilty: false,
      addressData: [],
      emailData: [],
      mobileData: [],
      getAddres : [],
      newAddress :[],
      suite: "",
      mappingAndUserProffJsons : [],
      primaryUserId : "",
      spouseUserId: "",
      maritalStatusId:"",
      sameWithPrimary: this.props.addNewProff == "updateForUser" ? (this.props.checkSameProff !== undefined ? this.props.checkSameProff : false) : undefined,
      used:{
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: null,
        responseId: 0,
      },
      current: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      assets: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      company: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      advisor: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      retires: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      opinion: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      investment: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
    };

    this.professionalAddressRef = React.createRef();
    this.businessOther = React.createRef();
    this.professionalContactRef = React.createRef();
  }

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let maritalStatusId = sessionStorage.getItem("maritalStatusId");
    let spouseUserId = sessionStorage.getItem('spouseUserId') || "";
    let loggedInUser = sessionStorage.getItem("loggedUserId");
    let updateProData = this.props.addNewProff == "addForUser" ? this.props.docUsr.proCategories : [this.props.docUsr]
    this.setState({
      maritalStatusId: maritalStatusId,
      userId: this.props.activeUser == "2" ? spouseUserId : newuserid,
      loggedInUser: loggedInUser,
      primaryUserId : newuserid,
      spouseUserId: spouseUserId,
      businessName : this.props.docUsr?.businessName ? this.props.docUsr?.businessName : "",
      businessTypeId : this.props.docUsr?.businessTypeId ? this.props.docUsr?.businessTypeId : "",
      websiteLink : this.props.docUsr?.websiteLink ? this.props.docUsr?.websiteLink : "",

    });
    this.fetchBussinessType();
    this.getsubjectForFormLabelId(this.props.docUsr?.professionalUserId || this.props.docUsr?.userId);
    this.professionalAddressRef?.current?.getByUserId(this.props.docUsr?.professionalUserId || this.props.docUsr?.userId);
    // this.fetchSavedContactDetails(this.props.docUsr?.professionalUserId || this.props.docUsr?.userId);
    this.updateProCategories(updateProData)
  }

  componentDidUpdate(prevProps, prevState) {
    konsole.log("propfin", this.props);
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let spouseUserId = sessionStorage.getItem('spouseUserId') || "";
    let updateProData = this.props.addNewProff == "addForUser" ? this.props.docUsr.proCategories : [this.props.docUsr]
    if (prevProps.docUsr !== this.props.docUsr) {
      this.setState({
        FinUserId: this.props.docUsr ? this.props.docUsr?.professionalUserId || this.props.docUsr?.userId : "",
        fName: this.props.docUsr ? this.props.docUsr.fName : "",
        mName: this.props.docUsr ? this.props.docUsr.mName : "",
        lName: this.props.docUsr ? this.props.docUsr.lName : "",
        nickName: this.props.docUsr ? (this.props.docUsr.nickName || "") : "",
        userId: this.props.activeUser == "2" ? spouseUserId : newuserid,
        businessName : this.props.docUsr?.businessName ? this.props.docUsr?.businessName : "",
        businessTypeId : this.props.docUsr?.businessTypeId ? this.props.docUsr?.businessTypeId : "",
        websiteLink : this.props.docUsr?.websiteLink ? this.props.docUsr?.websiteLink : "",
        sameWithPrimary: this.props.addNewProff == "updateForUser" ? (this.props.checkSameProff !== undefined ? this.props.checkSameProff : false) : undefined,
      });

      if(prevState.userId !== (this.props.activeUser === "2" ? spouseUserId : newuserid)){
        this.setState({userId: (this.props.activeUser === "2") ? spouseUserId : newuserid})
        }

      this.getsubjectForFormLabelId(this.props.docUsr?.professionalUserId || this.props.docUsr?.userId);
      this.professionalAddressRef?.current?.getByUserId(this.props.docUsr?.professionalUserId || this.props.docUsr?.userId);
      // this.fetchSavedContactDetails(this.props.docUsr?.professionalUserId || this.props.docUsr?.userId);
      this.updateProCategories(updateProData)
    }
  }

  handleClose = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  updateProCategories = (proCategories) =>{
    konsole.log("proUserIdddd",proCategories)
    
    const toUpdateServiceProvider = (proCategories || [])?.map((proCategory) => ({
      proUserId : proCategory?.proUserId || 0,
      proCatId: proCategory?.proCatId || 0,
      proSerDescId: proCategory?.proSerDescId || 3,
      proTypeId: proCategory?.proTypeId || 1,
      proSubTypeId: null,
      userProId : proCategory?.userProId || null
    }));

    this.setState({mappingAndUserProffJsons : toUpdateServiceProvider})
    konsole.log("toUpdateServiceProviderFinan",toUpdateServiceProvider)
  
  }

// postAddressUser = (userId, adress, createdBy) => {
//   adress.addressLine2 = this.state.suite; // adding suite data

//   this.props.dispatchloader(true);
//   konsole.log("dklsjfld", userId, adress, createdBy)
//   $postServiceFn.postAddressByUserId(userId, adress, createdBy, (response) => {
//     this.props.dispatchloader(false);
//     if (response) {
//       konsole.log("postMemberAddress", response)
//     }
//   });

  // }
  // updateAddress = (userID, json, addressId, createdBy) => {
  //   json.addressLine2 = this.state.suite; // adding suite data

  //   konsole.log("addressId", userID, json, addressId, createdBy)
  //   const addressPhysical = this.state.getAddres.filter(item => { return item.addressTypeId == 1 });
  //   const isActive = false
  //   this.props.dispatchloader(true);
  //   if (addressPhysical.length > 0) {
  //     this.props.dispatchloader(true);
  //     $postServiceFn.putMemberAddressData(userID, json, addressId, createdBy, (response) => {
  //       this.props.dispatchloader(false);
  //       if (response) {
  //         this.fetchSavedAddress(response?.data?.data?.userId)
  //         konsole.log("postMemberAddress", response)
  //       } else {
  //         this.props.dispatchloader(false);
  //       }
  //     });
  //   }

  // }

  validateWebLink ( websiteLink, isOnSave ) {
    if(!websiteLink) return true;
    if(isUrlValid(websiteLink) == false) {
      if(isOnSave != true) {
        this.toasterAlert(`Please enter valid website link`, "Warning");
        this.setState({websiteLink: ""})
      } else {
        this.toasterAlert(`Please enter valid website link`, "Warning");
        // setwebsiteLink("");
      }
      return false;
    }
    return true;
  }

  handleFinancilarAdvSubmit = () => {
    // ================= Don't remove thess comments ========================
    // if (this.state.fName == "" && this.state.lName == "") {
    //   this.toasterAlert("Please enter first and last name", "Warning");
    //   return;
    // } else 
    // =====================================================================

    if (isNotValidNullUndefile(this.state.fName) == false) {
      this.toasterAlert("Please enter first name", "Warning");
      return;
    }
    if(this.validateWebLink(this.state.websiteLink) != true) return false;
    // else if(this.professionalContactRef?.current?.checkvalidation(true)) return;
    // ================= Don't remove thess comments ========================
    //  else if (this.state.lName == "") {
    //   this.toasterAlert("Please enter last name", "Warning");
    //   return;

    // } else if (this.professionalAddressRef?.current?.isEmpty()) {
    //   this.toasterAlert("Address cannot be blank", "Warning")
    //   return;
    // }
    // =====================================================================

    // else if(this.state.emailData.length == 0 && this.state.mobileData.length==0){
    //   this.toasterAlert("Contact cannot be blank","Warning")
    //   return;
    // }
    // else { }

    this.professionalAddressRef?.current?.upsertAddress(this.state.FinUserId, 1)
    this.professionalContactRef?.current?.saveContactinfo(this.state.FinUserId)

    // let inputdata = {
    //   userId: this.state.FinUserId,
    //   createdBy: this.state.loggedInUser,
    //   professionalUser: {
    //     proSerDescId: 1,
    //     isGenAuth: true,
    //     isStatus: true,
    //   },
    // };

    konsole.log("this.state.mappingAndUserProffJsons",this.state.mappingAndUserProffJsons)

    let inputdata = {
      proUserId: this.state.mappingAndUserProffJsons[0]?.proUserId || 0,
      userId: this.state.FinUserId,
      isGenAuth: true,
      isStatus: true,
      isActive: true,
      upsertedBy: this.state.loggedInUser,
      proCategories: this.state.mappingAndUserProffJsons,
      businessName : $AHelper.capitalizeAllLetters(this.state.businessName),
      businessTypeId : this.state.businessTypeId,
      websiteLink : this.state.websiteLink,
    }
    
    this.props.dispatchloader(true);
    this.setState({disable:true})
    this.handlePutName();
    if( (this.props.toUpdate !== true) || (this.props.checkSameProff != true && this.state.sameWithPrimary == true) || (this.props.docUsr?.businessName != this.state.businessName) || (this.props.docUsr?.businessTypeId != this.state.businessTypeId) || (this.props.docUsr?.businessTypeId == "999999") || (this.props.docUsr?.websiteLink != this.state.websiteLink)){
    //   this.postProfessionalUser(this.state.mappingAndUserProffJsons)
    // }
    // else {
      this.setState({disable:true})
      konsole.log("inputdataFinanceAdvisor",JSON.stringify(inputdata))
      // $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.postaddprofessionluserMappingPath,inputdata,(response) => {
        $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.postProfessionalUserMapping,inputdata,(response) => {
        
        this.setState({disable:false})
          konsole.log("Success res", response);
          this.props.dispatchloader(false);
          if (response) {
            let professUserId = response.data.data;
            if(this.state.businessTypeId == "999999") this.businessOther?.current?.saveHandleOther(professUserId[0]?.proUserId);
            // this.handleAddProfessionalApi(professUserId);
            this.postProfessionalUser(professUserId)
          } else {
            // this.props.setshowadvisor();
          }
          // this.getsubjectForFormLabelId(this.props.docUsr.userId);
        })
    }
    else{
      this.props.handleClose()
    }
    if(this.props.addNewProff == "updateForUser" && !this.state.sameWithPrimary){
      this.props.checkProffsameOrNot(true)
    }
    if (this.state.updateCaregiverSuitabilty == true) {
      this.handleUpdateSubmit();                     
    } else {
      this.handlesubmit();
    }
  };

  postProfessionalUser = (userProffJson) =>{
    konsole.log("userProffJsonFinanAdvisor",userProffJson)
    let jsonArray = [
      {
        userProId: userProffJson[0]?.userProId || 0,
        proUserId: userProffJson[0]?.proUserId,
        proCatId: userProffJson[0]?.proCatId || userProffJson[0]?.proCategories[0]?.proCatId,
        userId: this.state.userId,
        lpoStatus: false,
        isActive: true,
        upsertedBy: this.state.loggedInUser
      }
    ]

    konsole.log("professionalUserId121212",JSON.stringify(jsonArray))
   
    this.postProfessionalUserAPICall(jsonArray);
    if(this.state.sameWithPrimary == true && this.state.spouseUserId !== "") {
      jsonArray[0].userId = this.state.userId == this.state.spouseUserId ? this.state.primaryUserId : this.state.spouseUserId;
      this.postProfessionalUserAPICall(jsonArray);
    }
     }

  postProfessionalUserAPICall = (inputdata) => {
    this.setState({disable:true})
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postProfessionalUser,
    inputdata, (response,error) => {
      this.props.dispatchloader(false);
        if(response){
          this.setState({disable:false})
            konsole.log("responseProfessional213", response);
            this.props.CallSearchApi(this.state.userId,this.state.primaryUserId) 
           //  this.props.setproserprovider() 
           this.props.handleClose()
        }else{
            konsole.log("error1212",error)
        }
        })
  }

  // handleAddProfessionalApi = (professUserId) => {
  //   konsole.log("vprofessUserId", professUserId);
  //   $postServiceFn.handleAddprofessinal( professUserId.proUserId, this.state.userId, professUserId.proSerDescId || professUserId.protypeId, this.state.loggedInUser, (res) => {
  //       konsole.log("resProfesss", res);
  //       this.props.CallSearchApi(this.state.userId,this.state.primaryUserId);
  //     }
  //   );
  // };

  // addProfessional = () => {
  //   if ( this.props.docUsr.hasOwnProperty("proFullName") == true && this.props.docUsr) {
  //     this.handleAddProfessionalApi(this.props.docUsr);
  //     this.props.setshowadvisor();
  //     this.props.handleClose();
  //   } else {
  //     this.handleFinancilarAdvSubmit();
  //   }
  // };

  handlePutName = () => {
    let physicianInfo = {
      userId: this.state.FinUserId,
      fName: $AHelper.capitalizeAllLetters(this.state.fName),
      mName: $AHelper.capitalizeAllLetters(this.state.mName),
      lName: $AHelper.capitalizeAllLetters(this.state.lName),
      nickName: this.state.nickName,
      updatedBy: this.state.loggedInUser,
      subtenantId : sessionStorage.getItem('SubtenantId')
    };
    konsole.log("physicianInfo",JSON.stringify(physicianInfo))
    this.props.dispatchloader(true);
    $postServiceFn.putUserInfo(physicianInfo, (res) => {
      this.props.dispatchloader(false);
      this.props.CallSearchApi(this.state.userId,this.state.primaryUserId) 
      konsole.log("done", res);
    });
  };

  InvokeEditAddress = (addressid) => {
    this.setState({
      EditAddress: addressid,
    });
    this.handleshowAddress();
  };

  handleshowAddress = () => {
    this.setState({
      showAddress: !this.state.showAddress,
    });
  };

  handleshowContact = () => {
    this.setState({
      showContact: !this.state.showContact,
    });
  };

  // fetchSavedAddress = (userid) => {
  //   this.props.dispatchloader(true);
  //   userid = userid || this.state.userId;
  //   if(!userid) return
  //   $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getAllAddress + userid,"",(response) => {
  //       this.props.dispatchloader(false);
  //       if (response) {
  //         this.setState({
  //           ...this.state,
  //           addressData: response.data.data.addresses[0]
  //         });
  //         this.setState({
  //           ...this.state,
  //           getAddres: response.data.data.addresses
  //         })
  //         this.setState({
  //           ...this.state,
  //           newAddress: response.data.data.addresses[0]
  //         })
  //         this.setState({
  //           ...this.state,
  //           suite: response.data.data.addresses[0]?.addressLine2 || ""
  //         })
  //       } else {
  //         this.toasterAlert(Msg.ErrorMsg, "Warning");
  //       }
  //     }
  //   );
  // };

  // fetchSavedContactDetails = (userid) => {
  //   this.props.dispatchloader(true);
  //   userid = userid || this.state.userId;
  //   $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getAllContactOtherPath + userid,"",(response) => {
  //       this.props.dispatchloader(false);
  //       if (response) {
  //         this.setState({
  //           ...this.state,
  //           allContactDetails: response.data.data.contact,
  //         });
  //         konsole.log("responseatsave", response);
  //       } else {
  //         // alert(Msg.ErrorMsg);
  //         // this.toasterAlert(Msg.ErrorMsg, "Warning");
  //       }
  //     }
  //   );
  // };

  handleChange = (event) => {
    const eventId = event.target.id;
    // const eventValue = eventName == "company" ? event.target.value?.charAt(0).toUpperCase() + event.target.value.slice(1) : event.target.value;
    const eventValue =  event.target.value;
    const eventName = event.target.name;

    if (eventName == "used") {
      if ($AHelper.isNumberRegexformedical(eventValue)) {
        this.setState({
          ...this.state,
          used: {
            userSubjectDataId: this.state.formlabelData.label565 ? this.state.formlabelData.label565.userSubjectDataId : 0,
            responseId: eventId,
            subResponseData: eventValue,
            subjectId: this.state.formlabelData.label565 && this.state.formlabelData.label565.questionId,
          },
        });
      }
      else {
        event.target.value = ""
      }
    } else if (eventName == "current") {
      this.setState({
        ...this.state,
        current: {
          userSubjectDataId: this.state.formlabelData.label566 ? this.state.formlabelData.label566.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label566 && this.state.formlabelData.label566.questionId,
        },
      });
    } else if (eventName == "assets") {
      this.setState({
        ...this.state,
        assets: {
          userSubjectDataId: this.state.formlabelData.label567 ? this.state.formlabelData.label567.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label567 && this.state.formlabelData.label567.questionId,
        },
      });
    } else if (eventName == "advisor") {
      this.setState({
        ...this.state,
        advisor: {
          userSubjectDataId: this.state.formlabelData.label568 ? this.state.formlabelData.label568.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label568 && this.state.formlabelData.label568.questionId,
        },
      });
    } else if (eventName == "company") {
      this.setState({
        ...this.state,
        businessName: eventValue
      });
    } else if (eventName == "retires") {
      this.setState({
        ...this.state,
        retires: {
          userSubjectDataId: this.state.formlabelData.label569 ? this.state.formlabelData.label569.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label569 && this.state.formlabelData.label569.questionId,
        },
      });
    } else if (eventName == "opinion") {
      this.setState({
        ...this.state,
        opinion: {
          userSubjectDataId: this.state.formlabelData.label570 ? this.state.formlabelData.label570.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label570 && this.state.formlabelData.label570.questionId,
        },
      });
    } else if (eventName == "investment") {
      this.setState({
        ...this.state,
        investment: {
          userSubjectDataId: this.state.formlabelData.label571 ? this.state.formlabelData.label571.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label571 && this.state.formlabelData.label571.questionId,
        },
      });
    } else if(eventId == "suite" || eventId == "websiteLink") {
      this.setState({
        ...this.state,
        [eventId]: eventValue,
      });
    }
  };

  handlesecondChange = (event) => {
    const eventId = event.target.id;
    const eventValue = event.target.value;
    const eventName = event.target.name;
    if (eventId == "fName" || eventId == "lName" || eventId == "nickName" || eventId == "mName" || eventId == "birthPlace" || eventId == "businessName") {
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
    } else {
      this.setState({
        ...this.state,
        [eventId]: eventValue,
      });
    }
  };

  fetchBussinessType = () => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getBusinessType,
      "",
      (response) => {
        if (response) {
          this.setState({businessTypes: response.data.data})
        }
      }
    );
  };

  handleBusinessTypeChange = (value) => {
    if(value != "999999" && this.state.businessTypeId == "999999") {
      this.businessOther?.current?.setState({othersName: ""});
      setTimeout(() => {
        this.businessOther?.current?.saveHandleOther(this.state.mappingAndUserProffJsons[0]?.proUserId || 0);
        this.setState({businessTypeId: value})
      }, [100])
    } else {
      this.setState({businessTypeId: value})
    }
  }

  handlesubmit = () => {
    let inputdata = JSON.parse(JSON.stringify(this.state));
    let used = {
      userSubjectDataId: this.state.used.userSubjectDataId,
      subjectId: this.state.used.subjectId,
      subResponseData: this.state.used.subResponseData,
      responseId: this.state.used.responseId,
      userId: this.props.docUsr.professionalUserId || this.props.docUsr.userId,
    };

    let current = {
      userSubjectDataId: this.state.current.userSubjectDataId,
      subjectId: this.state.current.subjectId,
      subResponseData: this.state.current.subResponseData,
      responseId: this.state.current.responseId,
      userId: this.props.docUsr.professionalUserId || this.props.docUsr.userId,
    };

    let assets = {
      userSubjectDataId: this.state.assets.userSubjectDataId,
      subjectId: this.state.assets.subjectId,
      subResponseData: this.state.assets.subResponseData,
      responseId: this.state.assets.responseId,
      userId: this.props.docUsr.professionalUserId || this.props.docUsr.userId,
    };
    let advisor = {
      userSubjectDataId: this.state.advisor.userSubjectDataId,
      subjectId: this.state.advisor.subjectId,
      subResponseData: this.state.advisor.subResponseData,
      responseId: this.state.advisor.responseId,
      userId: this.props.docUsr.professionalUserId || this.props.docUsr.userId,
    };
    let retires = {
      userSubjectDataId: this.state.retires.userSubjectDataId,
      subjectId: this.state.retires.subjectId,
      subResponseData: this.state.retires.subResponseData,
      responseId: this.state.retires.responseId,
      userId: this.props.docUsr.professionalUserId || this.props.docUsr.userId,
    };

    let opinion = {
      userSubjectDataId: this.state.opinion.userSubjectDataId,
      subjectId: this.state.opinion.subjectId,
      subResponseData: this.state.opinion.subResponseData,
      responseId: this.state.opinion.responseId,
      userId: this.props.docUsr.professionalUserId || this.props.docUsr.userId,
    };

    let investment = {
      userSubjectDataId: this.state.investment.userSubjectDataId,
      subjectId: this.state.investment.subjectId,
      subResponseData: this.state.investment.subResponseData,
      responseId: this.state.investment.responseId,
      userId: this.props.docUsr.professionalUserId || this.props.docUsr.userId,
    };

    let company = {
      userSubjectDataId: this.state.company.userSubjectDataId,
      subjectId: this.state.company.subjectId,
      subResponseData: this.state.company.subResponseData,
      responseId: this.state.company.responseId,
      userId: this.props.docUsr.professionalUserId || this.props.docUsr.userId,
    };

    konsole.log("investmentinvestment", company);
    let totinptary = [];

    konsole.log('usedusedusedusedused', used)
    if (used.subjectId !== 0 && used.responseId !== 0) {
      totinptary.push(used);
    }
    if (current.subjectId !== 0 && current.subResponseData !== "" && current.responseId !== 0) {
      totinptary.push(current);
    }
    if (assets.subjectId !== 0 && assets.subResponseData !== "" && assets.responseId !== 0) {
      totinptary.push(assets);
    }
    if (advisor.subjectId !== 0 && advisor.subResponseData !== "" && advisor.responseId !== 0) {
      totinptary.push(advisor);
    }
    if (retires.subjectId !== 0 && retires.subResponseData !== "" && retires.responseId !== 0) {
      totinptary.push(retires);
    }
    if (opinion.subjectId !== 0 && opinion.subResponseData !== "" && opinion.responseId !== 0) {
      totinptary.push(opinion);
    }
    if (investment.subjectId !== 0 && investment.subResponseData !== "" && investment.responseId !== 0) {
      totinptary.push(investment);
    }
    if (company.subjectId !== 0 && company.responseId !== 0) {
      totinptary.push(company);
    }

    // konsole.log(JSON.stringify(inputdata));
    konsole.log("totinptarytotinptary", totinptary);
    this.props.dispatchloader(true);
    konsole.log("totinptarytotinptary", totinptary);
    this.setState({ disable: true })

    if(!totinptary?.length) {
      AlertToaster.success(`Financial advisor ${this.props.toUpdate == true ? "updated" : "saved"} successfully`);
      this.props.CallSearchApi(this.state.userId,this.state.primaryUserId);
      return;
    }

    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postaddusersubjectdata, totinptary, (response) => {
      this.setState({ disable: true })
      this.props.dispatchloader(false);
      konsole.log("Successhkhkres", response);

      if (response) {
        // alert("Saved Successfully");
        // this.props.setshowadvisor();
        AlertToaster.success(`Financial advisor ${this.props.toUpdate == true ? "updated" : "saved"} successfully`);
        this.props.CallSearchApi(this.state.userId,this.state.primaryUserId);
        // this.getsubjectForFormLabelId(this.props.docUsr.userId);
      } else {
        // this.props.setshowadvisor();
        // this.setState({ disable: false })
      }
    }
    );
  };

  handleUpdateSubmit = () => {
    let inputdata = JSON.parse(JSON.stringify(this.state));
    let used = {
      userSubjectDataId: this.state.used.userSubjectDataId,
      subjectId: this.state.used.subjectId,
      subResponseData: this.state.used.subResponseData,
      responseId: this.state.used.responseId,
      userId: this.props.docUsr.professionalUserId,
    };

    let current = {
      userSubjectDataId: this.state.current.userSubjectDataId,
      subjectId: this.state.current.subjectId,
      subResponseData: this.state.current.subResponseData,
      responseId: this.state.current.responseId,
      userId: this.props.docUsr.professionalUserId,
    };

    let assets = {
      userSubjectDataId: this.state.assets.userSubjectDataId,
      subjectId: this.state.assets.subjectId,
      subResponseData: this.state.assets.subResponseData,
      responseId: this.state.assets.responseId,
      userId: this.props.docUsr.professionalUserId,
    };
    let advisor = {
      userSubjectDataId: this.state.advisor.userSubjectDataId,
      subjectId: this.state.advisor.subjectId,
      subResponseData: this.state.advisor.subResponseData,
      responseId: this.state.advisor.responseId,
      userId: this.props.docUsr.professionalUserId,
    };
    let retires = {
      userSubjectDataId: this.state.retires.userSubjectDataId,
      subjectId: this.state.retires.subjectId,
      subResponseData: this.state.retires.subResponseData,
      responseId: this.state.retires.responseId,
      userId: this.props.docUsr.professionalUserId,
    };

    let opinion = {
      userSubjectDataId: this.state.opinion.userSubjectDataId,
      subjectId: this.state.opinion.subjectId,
      subResponseData: this.state.opinion.subResponseData,
      responseId: this.state.opinion.responseId,
      userId: this.props.docUsr.professionalUserId,
    };

    let investment = {
      userSubjectDataId: this.state.investment.userSubjectDataId,
      subjectId: this.state.investment.subjectId,
      subResponseData: this.state.investment.subResponseData,
      responseId: this.state.investment.responseId,
      userId: this.props.docUsr.professionalUserId,
    };
    let company = {
      userSubjectDataId: this.state.company.userSubjectDataId,
      subjectId: this.state.company.subjectId,
      subResponseData: this.state.company.subResponseData,
      responseId: this.state.company.responseId,
      userId: this.props.docUsr.professionalUserId,
    };

    konsole.log("investmentinvestment", company);

    let totinptary = [];

    // totinptary.push(used);
    // totinptary.push(current);
    // totinptary.push(assets);
    // totinptary.push(advisor);
    // totinptary.push(retires);
    // totinptary.push(opinion);
    // totinptary.push(investment);
    konsole.log('useduseduseduseduseda', used)

    if (used.subjectId !== 0 && used.responseId !== 0) {
      totinptary.push(used);
    }
    if (current.subjectId !== 0 && current.subResponseData !== "" && current.responseId !== 0) {
      totinptary.push(current);
    }
    if (assets.subjectId !== 0 && assets.subResponseData !== "" && assets.responseId !== 0) {
      totinptary.push(assets);
    }
    if (advisor.subjectId !== 0 && advisor.subResponseData !== "" && advisor.responseId !== 0) {
      totinptary.push(advisor);
    }
    if (retires.subjectId !== 0 && retires.subResponseData !== "" && retires.responseId !== 0) {
      totinptary.push(retires);
    }
    if (opinion.subjectId !== 0 && opinion.subResponseData !== "" && opinion.responseId !== 0) {
      totinptary.push(opinion);
    }
    if (investment.subjectId !== 0 && investment.subResponseData !== "" && investment.responseId !== 0) {
      totinptary.push(investment);
    }
    if (company.subjectId !== 0 && company.responseId !== 0) {
      totinptary.push(company);
    }

    let updatePostData = {
      userId: this.props.docUsr.professionalUserId,
      userSubjects: totinptary,
    };

    this.setState({ disable: true })
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putSubjectResponse, updatePostData, (response) => {
      // this.setState({ disable: true })
      this.setState({ disable: false })
      this.props.dispatchloader(false);
      konsole.log("Success res" + JSON.stringify(response));
      if (response) {
        AlertToaster.success(`Financial advisor ${this.props.toUpdate == true ? "updated" : "saved"} successfully`);
        // this.props.setshowadvisor();

        this.props.CallSearchApi(this.state.userId,this.state.primaryUserId);
        // this.getsubjectForFormLabelId(this.props.docUsr.userId);
      } else {
        // this.props.setshowadvisor();
        // this.setState({ disable: false })
      }
    }
    );
  };

  getsubjectForFormLabelId = (newuserid) => {
    if(!newuserid) return;
    konsole.log("newuserid121212",newuserid)
    let formlabelData = {};
    this.props.dispatchloader(true);
    // financialAdvisor.formLabelId.map((id, index) => {
    //   let data = [id.id]; 
      $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, financialAdvisor.formLabelId, (response) => {
        if (response) {
          konsole.log("response", response);
          const resSubData = response.data.data;

          for (let resObj of resSubData) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = resObj.question;
            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, "", (response) => {
              if (response) {
                this.setState({ rerenderpage: "rerender" });
                if (response.data.data.userSubjects.length !== 0) {
                  this.setState({ updateCaregiverSuitabilty: true, });
                  let responseData = response.data.data.userSubjects[0];
                  this.props.dispatchloader(true);
                  if (formlabelData[label].questionId == 116) {
                    konsole.log("datashownatcaregiver formlabelData", formlabelData);
                  }
                  this.props.dispatchloader(true);
                  for (let i = 0; i < formlabelData[label].response.length; i++) {
                    if (formlabelData[label].response[i].responseId === responseData.responseId) {
                      // this.props.dispatchloader(false);
                      if (responseData.responseNature == "Radio") {
                        formlabelData[label].response[i]["checked"] = true;
                        formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                      } else if (responseData.responseNature == "Text") {
                        formlabelData[label].response[i]["response"] = responseData.response;
                        formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                      }
                    }
                    if (i == formlabelData[label].response.length - 1) {
                      this.props.dispatchloader(false);
                    }
                  }
                }
              }
            }
            );
            this.props.dispatchloader(true);
            this.setState({ formlabelData: formlabelData }, () => {
              this.props.dispatchloader(false);
            });
          }
        } else {
          this.toasterAlert(Msg.ErrorMsg, "Warning");
          this.setState({ disable: false })
        }
      }
      );
    // });
  };

  // handleDeleteAddress = (userid, addressid) => {
  //   userid = userid || this.state.FinUserId;
  //   konsole.log("useridFin", userid);
  //   // let ques = confirm("Are you sure? You want to delete your address.")
  //   if (ques) {
  //     this.props.dispatchloader(true);
  //     this.setState({ disable: true })
  //     $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteAddress + userid + "/" + addressid + "/" + this.state.loggedInUser, "", (response) => {
  //       this.setState({ disable: false })
  //       this.props.dispatchloader(false);
  //       if (response) {
  //         this.fetchSavedAddress(userid);
  //       } else {
  //         this.toasterAlert(Msg.ErrorMsg, "Warning");
  //       }
  //     }
  //     );
  //   }
  // };

  handleDeleteContact = async (userid, contactId) => {
    userid = userid || this.state.FinUserId;
    let ques = await this.context.confirm(true, "Are you sure? You want to delete your Contact.", "Confirmation");
    if (ques) {
      this.props.dispatchloader(true);
      this.setState({ disable: true })
      $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteContactPath + userid + "/" + contactId, "", (response) => {
        this.setState({ disable: false })
        this.props.dispatchloader(false);
        if (response) {
          // this.fetchSavedContactDetails(userid);
        } else {
          this.toasterAlert(Msg.ErrorMsg, "Warning");
        }
      }
      );
    }
  };

  InvokeEditContactID = (contactTypeId, EditContactType) => {
    this.setState({
      EditContactType: EditContactType,
      EditContactId: contactTypeId,
    });

    this.handleshowContact();
  };

  handleFocusOut = () => {
    let attrvalue = this.state.mName;
    if (attrvalue.length !== 0) {
      if (attrvalue.length === 1) {
        attrvalue = attrvalue + ".";
      }
    }
    this.setState({ mName: attrvalue });
  };

  toasterAlert(text, type) {
    this.setState({ disable: false })
    this.context.setdata({ open: true, text: text, type: type });
  }

  addressDetails = (attrvalue) => {
    this.setState({ newAddress: attrvalue || [], });
    this.setState({ addressData: attrvalue || [], });
  };

  contactDetails = (mobile, email) => {
    konsole.log("attrvalueattrvalue", mobile, email);
    this.setState({
      mobileData: mobile,
      emailData: email,
    });
  };

  fsameWithPrimary = (event) => {
    const radioName = event.target.name;
    const radioValue = event.target.value;
    if (radioName == "sameWithPrimary" && radioValue == "Yes") {
      this.setState({
        ...this.state,
        [radioName]: true,
      });
    } else {
      this.setState({
        ...this.state,
        [radioName]: false,
      });
    }
    // konsole.log("vishnudb clicked", radioValue, this.state);
  };

  render() {
    konsole.log('usedused',this.props,this.state.sameWithPrimary)
    konsole.log('thisthis',this.props.docUsr)
    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.5 !important;
          }
        `}</style>
        {/* <a onClick={this.handleShow}>
          <img
            className="px-2"
            src="/icons/add-icon.svg"
            alt="health Insurance"
          />
        </a> */}

        {/* <Modal
          show={this.props.show}
          size="lg"
          centered
          onHide={this.props.setshowadvisor}
          animation="false"
          backdrop="static"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Financial Advisor</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-5 pt-4"> */}
            <div className="person-content">
              <Form.Group as={Row} className="financial-Adviser-Class">
                <Col xs="12" sm="6"  lg="4" className="mb-2">
                  <Form.Control
                  className="upperCasing"
                    type="text"
                    value={this.state.fName}
                    placeholder={$AHelper.mandatory("First Name")}
                    id="fName"
                    onChange={(e) => {
                      this.handlesecondChange(e);
                    }}
                  />
                </Col>
                {/* <Col xs="12" sm="12"  lg="6" className="mb-2">
                  <Form.Control
                    type="text"
                    value={this.state.mName}
                    placeholder="Middle Name"
                    id="mName"
                    onChange={(e) => {
                      this.handlesecondChange(e);
                    }}
                    onBlur={this.handleFocusOut}
                  />
                </Col> */}
                <Col xs="12" sm="6"  lg="4" className="mb-2">
                  <Form.Control
                   className="upperCasing"
                    type="text"
                    value={this.state.lName}
                    // placeholder={$AHelper.mandatory("Last Name")}
                    placeholder={"Last Name"}
                    id="lName"
                    onChange={(e) => {
                      this.handlesecondChange(e);
                    }}
                  />
                </Col>
                {/* <Col xs="12" sm="6"  lg="4" className="mb-2">
                  <Form.Control
                    type="text"
                    value={$AHelper.capitalizeAllLetters(this.state.nickName)}
                    placeholder="Nickname"
                    id="nickName"
                    onChange={(event) => {
                      this.handlesecondChange(event);
                    }}
                  />
                </Col> */}
              </Form.Group>
              <Row className="my-3">
                <Col sm="6" lg="4" >
                  <input size="" id="businessName" name="businessName" value={this.state.businessName} className="border rounded mb-2 upperCasing" placeholder="Business name" onChange={this.handlesecondChange}/>
                </Col> 
                <Col sm="6" lg="4" >
                  <Select
                    className="w-100 p-0 custom-select border rounded mb-2"
                    options={this.state.businessTypes}
                    name="businessTypeId"
                    onChange={e => this.handleBusinessTypeChange(e.value)}
                    value={this.state.businessTypes?.filter(ele => ele.value == this.state.businessTypeId)}
                    placeholder="Business Type"
                  />
                </Col>
                {this.state.businessTypeId == "999999" && <Col sm="6" lg="4" >
                  <Other
                    othersCategoryId={30}
                    userId={this.state.FinUserId}
                    dropValue="999999"
                    ref={this.businessOther}
                    natureId={this.state.mappingAndUserProffJsons[0]?.proUserId}
                  />
                </Col>}
                <Col sm="6" lg="4" >
                  <input size="" id="websiteLink" name="websiteLink" value={this.state.websiteLink} className="border rounded mb-2" placeholder="Website link" onChange={this.handleChange} onBlur={e => this.validateWebLink(e.target.value)}/>
                </Col>
              </Row>
              <Row className="my-3 px-3">
                <Col xs sm="12" lg="12" className='border p-2 rounded'>
                  <Row className="">
                    <Col xs="12" sm="6" md="4" className="mt-0 mb-2" style={{fontSize: "1.15rem", fontWeight: "400", lineHeight: "1.5"}}>
                      Address
                    </Col>
                  </Row>
                  <DynamicAddressForm ref={this.professionalAddressRef} setLoader={this.props.dispatchloader}/>
                </Col>
              </Row>
              {/* <AddressListComponent userId={this.props.docUsr.userId} addressDetails={this.addressDetails} /> */}
              {/* <ContactListComponent userId={this.state.FinUserId} contactDetails={this.contactDetails} key={this.state.FinUserId}/> */}
              <div className='m-3'>  
              <ProfessionalContact  userId={this.state.FinUserId}  ref={this.professionalContactRef} key = {this.state.FinUserId} />
              </div>
            {/* <Row className="m-0 mb-4">

              <Col xs md="4" className="d-flex align-items-center ps-0">
                <button className="white-btn" onClick={() =>this.InvokeEditContactID("","")}>{$AHelper.mandatory("Contact")}</button>
                {this.state.showContact?
                <Contact
                  fetchprntSavedContactDetails={this.fetchSavedContactDetails}
                  userId={this.state.FinUserId}
                  handleshowContact={this.handleshowContact}
                  showContact={this.state.showContact}
                  allContactDetails={this.state.allContactDetails} EditContactId={this.state.EditContactId} EditContactType={this.state.EditContactType}
                />
                :
              ""
                }
              </Col>
              
            </Row>
            <Row className="m-0 mb-3">
                  {this.state.allContactDetails && this.state.allContactDetails.mobiles && this.state.allContactDetails.mobiles.map((val, id) => {
                    return (
                          <Col xs md="4" className="d-flex align-items-center" >
                            <InputGroup className="mb-3 rounded">
                              <InputGroup.Text className='bg-secondary' onClick={() => this.InvokeEditContactID(val, "mobile")}><img src="icons/mob-icon.svg" alt="" /></InputGroup.Text>
                              <div className="form-control">
                                <p className='' key={val.id}>{val.mobileNo.slice(0,-10)} {$AHelper.formatPhoneNumber(val.mobileNo.slice(-10))} </p></div>
                                {
                                  val.contactTypeId !== 1 &&
                                  <InputGroup.Text className='bg-secondary' onClick={() => this.handleDeleteContact(this.state.FinUserId, val.contactId)}><img className= "" src="icons/BinIcon.svg" alt="Add Address" /> </InputGroup.Text>
                                }
                            </InputGroup>
                          </Col>
                      );
                    })}
                  {this.state.allContactDetails && this.state.allContactDetails.emails && this.state.allContactDetails.emails.map((val, id) => {
                      return (
                          <Col xs md="4" className="d-flex align-items-center  ps-0 flex-wrap" key={id} >
                            <InputGroup className="mb-3 rounded">
                              <InputGroup.Text className='bg-secondary' onClick={() => this.InvokeEditContactID(val, "email")}><img src="icons/mob-icon.svg" alt="" /></InputGroup.Text>
                              <div className="form-control">
                                <p className='' key={val.id}>{val.emailId} </p></div>
                                {
                                  val.contactTypeId !== 1 &&
                                  <InputGroup.Text className='bg-secondary' onClick={() => this.handleDeleteContact(this.state.FinUserId, val.contactId)}><img className= "" src="icons/BinIcon.svg" alt="Add Address" /> </InputGroup.Text>
                                }
                            </InputGroup>
                          </Col>
                      );
                    })}
                </Row> */}

                {/* ------------------------For same as spouse----------------------------- */}

              {/* <Row className="m-0 mb-3 border pb-2 pt-1 ps-3">
                  <Col xs sm="10" lg="9" id="healthInsurance1">
                    <label className="mb-1">
                      Does your spouse have the same Financial Advisor?{" "}
                    </label>
                    <div className="d-flex flex-wrap justify-content-start align-items-center">
                      <div
                        key="checkbox8"
                        className="me-4 pe-3 mb-0 d-flex align-items-center"
                      >
                        <Form.Check
                          className="chekspace"
                          type="radio"
                          id="checkbox8212"
                          label="Yes"
                          value="Yes"
                          name="sameWithPrimary"
                          onChange={(event) => this.fsameWithPrimary(event)}
                          checked={this.state?.sameWithPrimary == true}
                        />
                      </div>
                      <div
                        key="checkbox812"
                        className="me-4 pe-3 mb-0 d-flex align-items-center"
                      >
                        <Form.Check
                          className="chekspace"
                          type="radio"
                          id="checkbox8"
                          label="No"
                          value="No"
                          name="sameWithPrimary"
                          onChange={(event) => this.fsameWithPrimary(event)}
                          checked={this.state?.sameWithPrimary == false}
                        />
                      </div>
                    </div>
                  </Col>
                </Row> */}

              {/* start */}
              {this.state.spouseUserId !== "null" && (
              <Row className="m-0 mb-3 border pb-2 pt-1 ms-10px">
                  <Col xs sm="10" lg="9" id="healthInsurance1">
                    <label className="mb-1">
                      {`Does your ${this.state.maritalStatusId == 2 ? "partner" :"spouse"} use the same Financial Advisor?`}{" "}
                    </label>
                    <div className="d-flex flex-wrap justify-content-start align-items-center">
                      <div
                        key="checkbox8"
                        className="me-4 pe-3 mb-0 d-flex align-items-center"
                      >
                        <Form.Check
                          className="chekspace"
                          type="radio"
                          id="checkbox8212"
                          label="Yes"
                          value="Yes"
                          name="sameWithPrimary"
                          onChange={(event) => this.fsameWithPrimary(event)}
                          checked={this.state?.sameWithPrimary == true}
                        />
                      </div>
                      <div
                        key="checkbox812"
                        className="me-4 pe-3 mb-0 d-flex align-items-center"
                      >
                        <Form.Check
                          className="chekspace"
                          type="radio"
                          id="checkbox8"
                          label="No"
                          value="No"
                          name="sameWithPrimary"
                          onChange={(event) => this.fsameWithPrimary(event)}
                          checked={this.state?.sameWithPrimary == false}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
              {/* end */}

              <div className="ms-10px w-100 border p-2">
              <Form.Group as={Row} className="mb-3">
                <p className="mb-2 ">
                  {this.state.formlabelData.label565 &&
                    this.state.formlabelData.label565.question}
                </p>
                <Col xs="12" sm="12" lg="12">
                  {this.state.formlabelData.label565 &&
                    this.state.formlabelData.label565.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Control
                              type="text"
                              name="used"
                              // maxLength={2}
                              onChange={(e) => {
                                this.handleChange(e);
                              }}
                              className="w-100"
                              id={response.responseId}
                              value={this.state.used?.subResponseData ?? response.response}
                            />
                          </>
                        );
                      }
                    )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Col xs="12" sm="12" lg="12">
                  <p>
                    {this.state.formlabelData.label566 &&
                      this.state.formlabelData.label566.question}
                  </p>
                  <div className="d-flex align-items-center justify-content-start">
                    {this.state.formlabelData.label566 &&
                      this.state.formlabelData.label566.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Check
                                className="chekspace"
                                type="radio"
                                id={response.responseId}
                                value={response.response}
                                name="current"
                                label={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Col xs="12" sm="12" lg="12">
                  {this.state.formlabelData.label567 &&
                    this.state.formlabelData.label567.question}
                  <div className="d-flex align-items-center justify-content-start">
                    {this.state.formlabelData.label567 &&
                      this.state.formlabelData.label567.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Check
                                className="chekspace"
                                type="radio"
                                id={response.responseId}
                                value={response.response}
                                name="assets"
                                label={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Col xs="12" sm="12" lg="12">
                  <p>
                    {this.state.formlabelData.label568 &&
                      this.state.formlabelData.label568.question}
                  </p>
                  <div className="d-flex align-items-center justify-content-start">
                    {this.state.formlabelData.label568 &&
                      this.state.formlabelData.label568.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Check
                                className="chekspace"
                                type="radio"
                                id={response.responseId}
                                value={response.response}
                                name="advisor"
                                label={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Col xs="12" sm="12" lg="12">
                  <p>
                    {this.state.formlabelData.label569 &&
                      this.state.formlabelData.label569.question} 
                  </p>
                  <div className="d-flex align-items-center justify-content-start">
                    {this.state.formlabelData.label569 &&
                      this.state.formlabelData.label569.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Check
                                className="chekspace"
                                type="radio"
                                id={response.responseId}
                                value={response.response}
                                name="retires"
                                label={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Col xs="12" sm="12" lg="12">
                  {this.state.formlabelData.label570 &&
                    this.state.formlabelData.label570.question}
                  <div className="d-flex align-items-center justify-content-start">
                    {this.state.formlabelData.label570 &&
                      this.state.formlabelData.label570.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Check
                                className="chekspace"
                                type="radio"
                                id={response.responseId}
                                value={response.response}
                                name="opinion"
                                label={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Col xs="12" sm="12" lg="12">
                  <p>
                    {this.state.formlabelData.label571 &&
                      this.state.formlabelData.label571.question}{" "}
                  </p>
                  <div className="d-flex align-items-center justify-content-start">
                    {this.state.formlabelData.label571 &&
                      this.state.formlabelData.label571.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Check
                                className="chekspace"
                                type="radio"
                                id={response.responseId}
                                value={response.response}
                                name="investment"
                                label={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Form.Group>
              </div>
            </div>
          {/* </Modal.Body> */}
          {/* <Modal.Footer className="border-0"> */}
            <Button
              style={{ backgroundColor: "#76272b", border: "none" }}
              className="theme-btn mt-4 ms-10px"
              // onClick={(this.props.docUsr.hasOwnProperty("proFullName") == true && this.props.docUsr) ? this.handleAddProfessionalApi(this.props.docUsr) : this.handleFinancilarAdvSubmit}
              // onClick={(this.state.updateCaregiverSuitabilty)?this.handleUpdateSubmit:this.handlesubmit }
              onClick={this.handleFinancilarAdvSubmit}
              disabled={this.state.disable == true ? true : false}

            >
              {this.props.toUpdate == true ? "Update" : "Save"}
            </Button>
          {/* </Modal.Footer> */}
        {/*  </Modal> */}
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FinancialAdvisor);
