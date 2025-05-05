import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, InputGroup,} from "react-bootstrap";
import Address from "./address";
import Contact from "./contact";
import { $CommonServiceFn, $postServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import { accountant } from "./control/Constant";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { $AHelper } from "../components/control/AHelper";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
// import AddressListComponent from "./addressListComponent";
import { globalContext } from "../pages/_app";
import ContactListComponent from "./ContactListComponent";
import AlertToaster from "./control/AlertToaster";
// import PlaceOfBirth from './PlaceOfBirth';
import DynamicAddressForm from "./DynamicAddressForm";
import Other from "./asssets/Other";
import Select from "react-select";
import { isNotValidNullUndefile, isUrlValid, removeSpaceAtStart } from "./Reusable/ReusableCom";
import ProfessionalContact from "./ProfessionalContact";

export class Accountant extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      docUserId: this.props.docUsr ? this.props.docUsr?.professionalUserId || this.props.docUsr.userId : "",
      fName: this.props.docUsr ? this.props.docUsr.fName : "",
      mName: this.props.docUsr ? this.props.docUsr.mName : "",
      lName: this.props.docUsr ? this.props.docUsr.lName : "",
      nickName: this.props.docUsr ? this.props.docUsr.nickName : "",
      businessName : this.props.docUsr?.businessName ? this.props.docUsr?.businessName : "",
      businessTypeId : this.props.docUsr?.businessTypeId ? this.props.docUsr?.businessTypeId : "",
      businessTypes: [],
      websiteLink : this.props.docUsr?.websiteLink ? this.props.docUsr?.websiteLink : "",
      formlabelData: {},
      updateCaregiverSuitabilty: false,
      addressData: [],
      emailData: [],
      mobileData: [],
      getAddres:[],
      newAddress : [],
      suite: "",
      disable:false,
      // proCategoriesAtUpdate : this.props.docUsr ? [this.props.docUsr] : [],
      mappingAndUserProffJsons : [],
      primaryUserId : "",
      spouseUserId : "",
      maritalStatusId:"",
      sameWithPrimary: this.props.addNewProff == "updateForUser" ? (this.props.checkSameProff !== undefined ? this.props.checkSameProff : false) : undefined,
      happy:{
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      accountant: {
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
      longUsed: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: null,
        responseId: 0,
      },
    };

    this.professionalAddressRef = React.createRef();
    this.businessOther = React.createRef();
    this.professionalContactRef = React.createRef();
  }

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

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let maritalStatusId = sessionStorage.getItem("maritalStatusId");
    let spouseUserId = sessionStorage.getItem('spouseUserId') || "";
    let loggedInUser = sessionStorage.getItem("loggedUserId");
    let updateProData = this.props.addNewProff == "addForUser" ? this.props.docUsr.proCategories : [this.props.docUsr]
    konsole.log("propsDocUser",this.props)
    this.setState({
      maritalStatusId:maritalStatusId,
      userId: this.props.activeUser == "2" ? spouseUserId : newuserid,
      loggedInUser: loggedInUser,
      primaryUserId : newuserid,
      spouseUserId : spouseUserId,
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
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let spouseUserId = sessionStorage.getItem('spouseUserId') || "";
    let updateProData = this.props.addNewProff == "addForUser" ? this.props.docUsr.proCategories : [this.props.docUsr]
    if (prevProps.docUsr !== this.props.docUsr) {
      this.setState({
        docUserId: this.props.docUsr ? this.props.docUsr?.professionalUserId || this.props.docUsr?.userId : "",
        fName: this.props.docUsr ? this.props.docUsr.fName : "",
        mName: this.props.docUsr ? this.props.docUsr.mName : "",
        lName: this.props.docUsr ? this.props.docUsr.lName : "",
        nickName: this.props.docUsr ? (this.props.docUsr.nickName || "") : "",
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

  updateProCategories = (proCategories) =>{
    konsole.log("proUserIdddd",proCategories)
    
    const toUpdateServiceProvider = (proCategories || [])?.map((proCategory) => ({
      proUserId : proCategory?.proUserId || 0,
      proCatId: proCategory?.proCatId || 0,
      proSerDescId: proCategory?.proSerDescId || 3,
      proTypeId: proCategory?.proTypeId || 3,
      proSubTypeId: null,
      userProId : proCategory?.userProId || null
    }));

    this.setState({mappingAndUserProffJsons : toUpdateServiceProvider})
    konsole.log("toUpdateServiceProviderAcco",toUpdateServiceProvider)
  
  }

  handleClose = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  handleShow = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  getsubjectForFormLabelId = (newuserid) => {
    if(!newuserid) return;
    let formlabelData = {};
    this.props.dispatchloader(true);
    // accountant.formLabelId.map((id, index) => {
    //   let data = [id.id];
      $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.getsubjectForFormLabelId, accountant.formLabelId, (response) => {
        this.props.dispatchloader(false);
          if (response) {
            const resSubData = response.data.data;

            for (let resObj of resSubData) {
              let label = "label" + resObj.formLabelId;
              formlabelData[label] = resObj.question;
              konsole.log("accountantresObj.question",resObj.question);
              // konsole.log("datashownatcaregiver formlabelData", formlabelData);
              this.props.dispatchloader(true);
              $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getSubjectResponse +  newuserid +  `/0/0/${formlabelData[label].questionId}`, "",(response) => {
                  if (response) {
                    this.props.dispatchloader(false);
                    if (response.data.data.userSubjects.length !== 0) {
                      this.setState({ updateCaregiverSuitabilty: true,});
                      let responseData = response.data.data.userSubjects[0];
                      this.props.dispatchloader(true);
                      for (let i = 0;i < formlabelData[label].response.length;i++) {
                        // konsole.log("datashownatcaregiver at",i ,response);
                        if (formlabelData[label].response[i].responseId ===responseData.responseId) {
                          if (responseData.responseNature == "Radio") {
                            formlabelData[label].response[i]["checked"] = true;
                            formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                          } else if (responseData.responseNature == "Text") {
                            formlabelData[label].response[i]["response"] = responseData.response;
                            formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                          }
                        }
                        if (i === formlabelData[label].response.length - 1) {
                          this.props.dispatchloader(false);
                        }
                      }
                    }
                    this.props.dispatchloader(false);
                  }
                }
              );
              this.setState({ formlabelData: formlabelData });
            }         
          this.setState({disable:false})
          } else {
            this.toasterAlert(Msg.ErrorMsg, "Warning");
            this.setState({disable:false})
          }
        }
      );
    // });
  };

  // fetchSavedAddress = (userid) => {
  //   // if(userid == undefined) return;
  //   this.props.dispatchloader(true);
  //   userid = userid || this.state.userId;
  //   if(!userid) return;
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
  //   konsole.log("userid1221",userid)
  //   // if(userid == undefined) return;
  //   this.props.dispatchloader(true);
  //   userid = userid || this.state.userId;
  //   if(!userid) return;
  //   $CommonServiceFn.InvokeCommonApi(  "GET",  $Service_Url.getAllContactOtherPath + userid,  "",  (response) => {
  //       this.props.dispatchloader(false);
  //       if (response) {
  //         this.setState({
  //           ...this.state,
  //           allContactDetails: response.data.data.contact,
  //         });
  //         konsole.log("responseatsav", response);
  //       } else {
  //         this.toasterAlert(Msg.ErrorMsg, "Warning");
  //       }
  //     }
  //   );
  // };

  handleChange = (event) => {
    const eventId = event.target.id;
    const eventValue = event.target.value
    const eventName = event.target.name;

    if (eventName == "happy") {
      this.setState({
        ...this.state,
        happy: {
          userSubjectDataId: this.state.formlabelData.label672 ? this.state.formlabelData.label672.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label672 && this.state.formlabelData.label672.questionId,
        },
      });
    } else if (eventName == "accountant") {
      this.setState({
        ...this.state,
        accountant: {
          userSubjectDataId: this.state.formlabelData.label673 ? this.state.formlabelData.label673.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label673 && this.state.formlabelData.label673.questionId,
        },
      });
    } else if (eventName == "company") {
      this.setState({
        ...this.state,
        businessName : eventValue
      });
    } else if (eventName == "longUsed") {
      if ($AHelper.isNumberRegexformedical(eventValue)) {
      this.setState({
        ...this.state,
        longUsed: {
          userSubjectDataId: this.state.formlabelData.label912 ? this.state.formlabelData.label912.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label912 && this.state.formlabelData.label912.questionId,
        },
      });
    }else{
        event.target.value=""
    }
    } else if(eventId == "suite" || eventId == "websiteLink") {
      this.setState({
        ...this.state,
        [eventId]: eventValue,
      });
    }
  };

  handleSecondChange = (event) => {
    const eventId = event.target.id;
    const eventValue = event.target.value;
    const eventName = event.target.name;

    if ( eventId == "fName" || eventId == "lName" || eventId == "nickName" || eventId == "mName" || eventId == "birthPlace" || eventId == "businessName") {
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
    } else {
      this.setState({
        ...this.state,
        [eventId]: eventValue,
      });
    }
  };

  handleMetataDataSubmit = () => {
    let inputData = JSON.parse(JSON.stringify(this.state));

    let happy = {
      userSubjectDataId: this.state.happy.userSubjectDataId,
      subjectId: this.state.happy.subjectId,
      subResponseData: this.state.happy.subResponseData,
      responseId: this.state.happy.responseId,
      userId: this.props.docUsr.professionalUserId || this.props.docUsr.userId,
    };

    let accountant = {
      userSubjectDataId: this.state.accountant.userSubjectDataId,
      subjectId: this.state.accountant.subjectId,
      subResponseData: this.state.accountant.subResponseData,
      responseId: this.state.accountant.responseId,
      userId: this.props.docUsr.professionalUserId || this.props.docUsr.userId,
    };

    let company = {
      userSubjectDataId: this.state.company.userSubjectDataId,
      subjectId: this.state.company.subjectId,
      subResponseData: this.state.company.subResponseData,
      responseId: this.state.company.responseId,
      userId: this.props.docUsr.professionalUserId || this.props.docUsr.userId,
    };

    let longUsed = {
      userSubjectDataId: this.state.longUsed.userSubjectDataId,
      subjectId: this.state.longUsed.subjectId,
      subResponseData: this.state.longUsed.subResponseData,
      responseId: this.state.longUsed.responseId,
      userId: this.props.docUsr.professionalUserId || this.props.docUsr.userId,
    };

    let totinptary = [];

    if ( happy.subjectId !== 0 && happy.subResponseData !== "" && happy.responseId !== 0) {
      totinptary.push(happy);
    }
    if (accountant.subjectId !== 0 &&accountant.subResponseData !== "" &&accountant.responseId !== 0) {
      totinptary.push(accountant);
    }
    if (  company.subjectId !== 0  &&  company.responseId !== 0) {
      totinptary.push(company);
    }
    if ( longUsed.subjectId !== 0 && longUsed.responseId !== 0) {
      totinptary.push(longUsed);
    }
    // alert(this.props.docUsr.userId)
    setTimeout(() => {
      console.log("totinptary",totinptary,this.props.docUsr);
    this.setState({disable:true})
    this.props.dispatchloader(true);
    this.setState({disable:true})
    $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.postaddusersubjectdata, totinptary,(response) => {
        this.props.dispatchloader(false);
        if (response) {
          AlertToaster.success(`Accountant ${this.props.toUpdate == true ? "updated" : "saved"} successfully`);
          // getsubjectForFormLabelId(this.state.userId);
        } else {
          this.toasterAlert(Msg.ErrorMsg, "Warning");
          this.setState({disable:false})
        }
      }
    );
    },100);
    
  };

  handleUpdateMetaDataSubmit = () => {
    let inputData = JSON.parse(JSON.stringify(this.state));

    let happy = {
      userSubjectDataId: this.state.happy.userSubjectDataId,
      subjectId: this.state.happy.subjectId,
      subResponseData: this.state.happy.subResponseData,
      responseId: this.state.happy.responseId,
      userId: this.props.docUsr.professionalUserId,
    };

    let accountant = {
      userSubjectDataId: this.state.accountant.userSubjectDataId,
      subjectId: this.state.accountant.subjectId,
      subResponseData: this.state.accountant.subResponseData,
      responseId: this.state.accountant.responseId,
      userId: this.props.docUsr.professionalUserId,
    };

    let company = {
      userSubjectDataId: this.state.company.userSubjectDataId,
      subjectId: this.state.company.subjectId,
      subResponseData: this.state.company.subResponseData,
      responseId: this.state.company.responseId,
      userId: this.props.docUsr.professionalUserId,
    };

    let longUsed = {
      userSubjectDataId: this.state.longUsed.userSubjectDataId,
      subjectId: this.state.longUsed.subjectId,
      subResponseData: this.state.longUsed.subResponseData,
      responseId: this.state.longUsed.responseId,
      userId: this.props.docUsr.professionalUserId,
    };

    let totinptary = [];

    if ( happy.subjectId !== 0 && happy.subResponseData !== "" && happy.responseId !== 0) {
      totinptary.push(happy);
    }
    if ( accountant.subjectId !== 0 && accountant.subResponseData !== "" && accountant.responseId !== 0) {
      totinptary.push(accountant);
    }
    if ( company.subjectId !== 0  && company.responseId !== 0) {
      totinptary.push(company);
    }
    if ( longUsed.subjectId !== 0  && longUsed.responseId !== 0) {
      totinptary.push(longUsed);
    }

    let updatePostData = {
      userId: this.props.docUsr.professionalUserId,
      userSubjects: totinptary,
    };

    // konsole.log(JSON.stringify(inputdata));
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("PUT",$Service_Url.putSubjectResponse, updatePostData,(response) => {
        this.props.dispatchloader(false);
        // konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          this.setState({disable:false})
          AlertToaster.success("Accountant update successfully");
          // this.getsubjectForFormLabelId(this.state.userId);
          this.setshowaccoutant();
        } else {
          this.setState({disable:false})
        }
      }
    );
  };

  // handleDeleteAddress = (userid, addressid) => {
  //   userid = userid || this.state.docUserId;
  //   let ques = this.context.confirm( true, "Are you sure? You want to delete your address.", "Confirmation");
  //   // userid = userid || this.state.userId;
  //   if (ques) {
  //     this.props.dispatchloader(true);
  //     $CommonServiceFn.InvokeCommonApi("DELETE",$Service_Url.deleteAddress +  userid +  "/" +  addressid +  "/" +  this.state.loggedInUser,"",(response) => {
  //         this.props.dispatchloader(false);
  //         if (response) {
  //           this.fetchSavedAddress(userid);
  //         } else {
  //           this.toasterAlert(Msg.ErrorMsg, "Warning");
  //         }
  //       }
  //     );
  //   }
  // };

  handleDeleteContact = (userid, contactId) => {
    userid = userid || this.state.docUserId;
    let ques = confirm("Are you sure? You want to delete your Contact.");
    if (ques) {
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi( "DELETE", $Service_Url.deleteContactPath + userid + "/" + contactId, "", (response) => {
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
// updateAddress = (userID,json,addressId,createdBy) => {
//   json.addressLine2 = this.state.suite; // adding suite data
//   //  alert("update")
//   konsole.log("addressId",userID,json,addressId,createdBy)
//     const addressPhysical = this.state.getAddres.filter(item => { return item.addressTypeId == 1 });
//     const isActive = false
//     this.props.dispatchloader(true);
//     if (addressPhysical.length > 0){
//       this.props.dispatchloader(true);
//       $postServiceFn.putMemberAddressData(userID,json,addressId,createdBy, (response) => {
//           this.props.dispatchloader(false);
//           if (response) {
//               this.fetchSavedAddress(response?.data?.data?.userId)
//               konsole.log("postMemberAddress", response)
//           } else {
//               this.props.dispatchloader(false);
//           }
//       });
//   }


//   }

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

  handleAccountantSubmit = () => {
    // let inputdata = {
    //   userId: this.state.docUserId,
    //   createdBy: this.state.loggedInUser,
    //   professionalUser: {
    //     proSerDescId: 3,
    //     isGenAuth: true,
    //     isStatus: true,
    //   },
    // };
    this.setState({disable:false})
    let inputdata = {
      proUserId: this.state.mappingAndUserProffJsons[0]?.proUserId || 0,
      userId: this.state.docUserId,
      isGenAuth: true,
      isStatus: true,
      isActive: true,
      upsertedBy: this.state.loggedInUser,
      proCategories: this.state.mappingAndUserProffJsons,
      businessName : $AHelper.capitalizeAllLetters(this.state.businessName),
      businessTypeId : this.state.businessTypeId,
      websiteLink : this.state.websiteLink,
    }
    konsole.log("this.state.mappingAndUserProffJsons",this.state.mappingAndUserProffJsons,JSON.stringify(inputdata))
    
    // ================= Don't remove these comments ========================
    // if (this.state.fName == "" && this.state.lName == "") {
    //   this.toasterAlert("Please enter first and last name", "Warning");
    //   return;
    // } else 
    // =====================================================================
    if (isNotValidNullUndefile(this.state.fName ) == false) {
      this.toasterAlert("Please enter first name", "Warning");
      return;
    }
    if(this.validateWebLink(this.state.websiteLink) != true) return false;
    // else if(this.professionalContactRef?.current?.checkvalidation(true)) {
    //   this.setState({disable:false})
    //   return;
    // }
    // ================= Don't remove these comments ========================
    //  else if (this.state.lName == "") {
    //   this.toasterAlert("Please enter last name", "Warning");
    //   return;

    // } else if (this.professionalAddressRef?.current?.isEmpty()) {
    //   this.toasterAlert("Address cannot be blank","Warning")

    //   return;
    // }
    // =====================================================================
    // if(this.state.emailData.length == 0 && this.state.mobileData.length==0){
    // this.toasterAlert("Contact cannot be blank","Warning")
    // return;
    // }
    // else {
    // }

    this.props.dispatchloader(true);

    konsole.log("mwffj",this.state.getAddres)
    this.professionalAddressRef?.current?.upsertAddress(this.state.docUserId, 1)
    this.professionalContactRef?.current?.saveContactinfo(this.state.docUserId)
    this.setState({disable:true})
    this.handlePutName();
    if(this.props.toUpdate !== true || (this.props.checkSameProff != true && this.state.sameWithPrimary == true) || (this.props.docUsr?.businessName != this.state.businessName) || (this.props.docUsr?.businessTypeId != this.state.businessTypeId) || (this.props.docUsr?.businessTypeId == "999999") || (this.props.docUsr?.websiteLink != this.state.websiteLink)){
    // } else {
      // $CommonServiceFn.InvokeCommonApi( "POST", $Service_Url.postaddprofessionluserMappingPath, inputdata, (response,error) => {
        $CommonServiceFn.InvokeCommonApi( "POST", $Service_Url.postProfessionalUserMapping, inputdata, (response,error) => {
          konsole.log("Success res" + JSON.stringify(response));
          this.props.dispatchloader(false);
          if (response) {
            let professUserId = response.data.data;
            if(this.state.businessTypeId == "999999") this.businessOther?.current?.saveHandleOther(professUserId[0]?.proUserId);
            konsole.log("professUserId12121",professUserId)
            this.postProfessionalUser(professUserId)
            // this.handleAddProfessionalApi(professUserId);
          } else {
            konsole.log("errorAccount",error)
            this.toasterAlert(Msg.ErrorMsg, "Warning");
            this.setState({disable:false})
          }
        }
      );
    }else{
      this.props.handleClose()
    }
    if(this.props.addNewProff == "updateForUser" && !this.state.sameWithPrimary){
      this.props.checkProffsameOrNot(true)
    }
    if (this.state.updateCaregiverSuitabilty == true) {
      this.handleUpdateMetaDataSubmit();
    } else {
      this.handleMetataDataSubmit();
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
  //   $postServiceFn.handleAddprofessinal(  professUserId.proUserId,  this.state.userId,  professUserId.proSerDescId || professUserId.protypeId,  this.state.loggedInUser,  (res) => {
  //       konsole.log("resProfesss", res);
  //       this.props.CallSearchApi(this.state.userId,this.state.primaryUserId);
  //       this.handlePutName();
  //     }
  //   );
  // };

  addProfessional = () => {
    this.setState({disable:true})
    this.handleAccountantSubmit();
    
  };

  handlePutName = () => {
    let physicianInfo = {
      userId: this.state.docUserId,
      fName: $AHelper.capitalizeAllLetters(this.state.fName),
      mName: $AHelper.capitalizeAllLetters(this.state.mName),
      lName: $AHelper.capitalizeAllLetters(this.state.lName),
      nickName: this.state.nickName,
      updatedBy: this.state.loggedInUser,
      subtenantId : sessionStorage.getItem('SubtenantId')
    };

    this.props.dispatchloader(true);
    $postServiceFn.putUserInfo(physicianInfo, (res) => {
      this.props.dispatchloader(false);
      konsole.log("done", res);
      this.props.CallSearchApi(this.state.userId,this.state.primaryUserId);
      this.props.setshowaccoutant();
    });
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
    this.setState({
      mName: attrvalue,
    });
  };

  toasterAlert(test, type) {
    this.setState({disable:false})
    this.context.setdata($AHelper.toasterValueFucntion(true, test, type));
  }
  // addressDetails = (attrvalue) => {
  //   konsole.log("attrvalueattrvalue", attrvalue);
  //   this.setState({
  //     newAddress: attrvalue || [],
  //   });
  //   this.setState({
  //     addressData: attrvalue || [],
  //   });
  // };
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
    konsole.log("jshdjshdsjhdjs",this.state.mappingAndUserProffJsons,this.props)
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
          onHide={this.props.setshowaccoutant}
          animation="false"
          backdrop="static"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Accountant</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-5 pt-4"> */}
            <div className="person-content">
              <Form.Group as={Row} className="financial-Adviser-Class">
                <Col xs="12" sm="6" lg="4" className="mb-2">
                  <Form.Control
                     className="upperCasing"
                    type="text"
                    value={this.state.fName}
                    placeholder={$AHelper.mandatory("First Name")}
                    id="fName"
                    onChange={(event) => {
                      this.handleSecondChange(event);
                    }}
                  />
                </Col>
                {/* <Col xs="12" sm="12" lg="6" className="mb-2">
                  <Form.Control
                    type="text"
                    value={this.state.mName}
                    placeholder="Middle Name"
                    id="mName"
                    onBlur={this.handleFocusOut}
                    onChange={(event) => {
                      this.handleSecondChange(event);
                    }}
                  />
                </Col> */}
                <Col xs="12" sm="6" lg="4" className="mb-2">
                  <Form.Control
                   className="upperCasing"
                    type="text"
                    value={this.state.lName}
                    // placeholder={$AHelper.mandatory("Last Name")}
                    placeholder={"Last Name"}
                    id="lName"
                    onChange={(event) => {
                      this.handleSecondChange(event);
                    }}
                  />
                </Col>
                {/* <Col xs="12" sm="6" lg="4" className="mb-2">
                  <Form.Control
                    type="text"
                    value={$AHelper.capitalizeAllLetters(this.state.nickName)}
                    placeholder="Nickname"
                    id="nickName"
                    onChange={(event) => {
                      this.handleSecondChange(event);
                    }}
                  />
                </Col> */}
              </Form.Group>
              <Row className="my-3">
                <Col sm="6" lg="4" >
                  <input size="" id="businessName" name="businessName" value={this.state.businessName} className="border rounded upperCasing mb-2" placeholder="Business name" onChange={this.handleSecondChange}/>
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
                    userId={this.state.docUserId}
                    dropValue="999999"
                    ref={this.businessOther}
                    natureId={this.state.mappingAndUserProffJsons[0]?.proUserId}
                  />
                </Col>}
                <Col sm="6" lg="4" >
                  <input size="" id="websiteLink" name="websiteLink" value={this.state.websiteLink} className="border rounded mb-2" placeholder="Website link" onChange={this.handleChange}  onBlur={e => this.validateWebLink(e.target.value)}/>
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
              {/* <ContactListComponent userId={this.state.docUserId} contactDetails={this.contactDetails} key={this.state.docUserId}/> */}
              <div className="m-3">
                <ProfessionalContact  userId={this.state.docUserId}  ref={this.professionalContactRef} key = {this.state.docUserId} />
              </div>
            {/* <Row className="m-0 mb-4">

              <Col xs md="4" className="d-flex align-items-center ps-0">
                <button className="white-btn" onClick={() =>this.InvokeEditContactID("","")}>{$AHelper.mandatory("Contact")}</button>
                {this.state.showContact?
                <Contact
                  fetchprntSavedContactDetails={this.fetchSavedContactDetails}
                  userId={this.state.docUserId}
                  handleshowContact={this.handleshowContact}
                  showContact={this.state.showContact}
                  allContactDetails={this.state.allContactDetails} EditContactId={this.state.EditContactId} EditContactType={this.state.EditContactType}
                />:
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
                                  <InputGroup.Text className='bg-secondary' onClick={() => this.handleDeleteContact(this.state.docUserId, val.contactId)}><img className= "" src="icons/BinIcon.svg" alt="Add Address" /> </InputGroup.Text>
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
                                  <InputGroup.Text className='bg-secondary' onClick={() => this.handleDeleteContact(this.state.docUserId, val.contactId)}><img className= "" src="icons/BinIcon.svg" alt="Add Address" /> </InputGroup.Text>
                                }
                            </InputGroup>
                          </Col>
                      );
                    })}
                </Row> */}
              {/* start */}
              {this.state.spouseUserId !== "null" && (
              <Row className="m-0 mb-3 border pb-2 pt-1 ms-10px">
                  <Col xs sm="10" lg="9" id="healthInsurance1">
                    <label className="mb-1">
                      {`Does your ${this.state.maritalStatusId == 2 ? "partner" : "spouse"} use the same Accountant?`}{" "}
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

              <Form.Group as={Row} className="mb-3">
                <Col xs="12" sm="12"  lg="12">
                <p>
                      {this.state.formlabelData.label912 &&
                        this.state.formlabelData.label912.question}{" "}
                    </p>
                  {this.state.formlabelData.label912 &&
                    this.state.formlabelData.label912.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Control
                              required
                              type="text"
                              name="longUsed"
                              onChange={(e) => {
                                this.handleChange(e);
                              }}
                              // maxLength={2}
                              className="w-100"
                              id={response.responseId}
                              value={this.state.longUsed?.subResponseData ?? response.response}
                            />
                          </>
                        );
                      }
                    )}
                </Col>
              </Form.Group>
              <div className="ms-10px w-100 border p-2">
                <Form.Group as={Row} className="mb-3">
                  <Col xs="12" sm="12"  lg="12">
                    <p>
                      {this.state.formlabelData.label672 &&
                        this.state.formlabelData.label672.question}{" "}
                    </p>
                    <div className="d-flex align-items-center justify-content-start">
                      {this.state.formlabelData.label672 &&
                        this.state.formlabelData.label672.response.map(
                          (response) => {
                            konsole.log("responseresponse", response);
                            konsole.log(
                              "responseresponse",
                              this.state.formlabelData.label672
                            );
                            return (
                              <>
                                <Form.Check
                                  className="chekspace"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  name="happy"
                                  label={response.response}
                                  onChange={(event) => {
                                    this.handleChange(event);
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
                  <Col xs sm="12" md="12" lg="12">
                    <p>
                      {this.state.formlabelData.label673 &&
                        this.state.formlabelData.label673.question}
                    </p>
                    <div className="d-flex flex-wrap align-items-center justify-content-start">
                      {this.state.formlabelData.label673 &&
                        this.state.formlabelData.label673.response.map(
                          (response) => {
                            return (
                              <>
                                <Form.Check
                                  className="chekspace"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  name="accountant"
                                  label={response.response}
                                  onChange={(event) => {
                                    this.handleChange(event);
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
          {/* </Modal.Body>
          <Modal.Footer className="border-0"> */}
          <div className="ms-10px mt-4">
            <Button 
              style={{backgroundColor:"#76272b", border:"none"}}
            className="theme-btn" onClick={this.addProfessional}
              disabled={this.state.disable == true ? true : false}
                   >
              {this.props.toUpdate == true ? "Update" : "Save"}
            </Button>
          </div>
          {/* </Modal.Footer>
        </Modal> */}
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Accountant);
