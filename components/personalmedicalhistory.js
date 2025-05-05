import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, OverlayTrigger,Popover} from "react-bootstrap";
import { $CommonServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import { personalMedicalHistry } from "./control/Constant";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import AlertToaster from "./control/AlertToaster";
import { globalContext } from "../pages/_app";
import BloodType from "./BloodType";

export class personalmedicalhistory extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = this.getInitialState
  }
  getInitialState = {
      show: false,
      initialShow: true,
      userId: "",
      logginInUser: sessionStorage.getItem("loggedUserId") || "",
      fatherLive: true,
      formlabelData: {},
      updateCaregiverSuitabilty: false,
      motherLive: true,
      formlabelData: {},
      medicalHistTypeId: "1",
      responseDetails: "",
      disable:false,
      updateOrSave: false,
      worryAboutHealth:false,

      showCommentpopover: false,
      eventsoncheckbox: false,
      remarks: "",
      diseaseIdd: "",

      smoking: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },

      physical: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },

      balance: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },

      worry: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      worryHealth: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      cammentSmokings: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },      
      physicalcamment: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },      
      balancecamment: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      cammentSmokingsShow:false,
      physicalcammentShow:false,
      balancecammentShow:false,
      FetchedDiseases: [],
      // medicine:{
      //   userId: "",
      //   userSubjectDataId: 0,
      //   subjectId: 0,
      //   subResponseData: "string",
      //   responseId: 0,

      // },
  }
  handleClose = () => {
    this.context.setPageTypeId(null)
    this.setState({
      show: !this.state.show,
      updateOrSave:false,
    });
    this.setState(this.getInitialState)
  };

  handleShow = () => {
    this.context.setPageTypeId(5)
    this.Fetchpersonalhisotry();
    this.setState({
      show: !this.state.show,
    });
  };

  // fradioValue = (event) => {
  //   const radioName = event.target.name;
  //   const radioValue = event.target.value;
  //   konsole.log(event.target.value);
  //   if (radioName == "fatherLive" && radioValue == "Yes") {
  //     this.setState({ ...this.state, [radioName]: true });
  //   } else {
  //     this.setState({ ...this.state, [radioName]: false });
  //   }
  // };
  // mradioValue = (event) => {
  //   const radioName = event.target.name;
  //   const radioValue = event.target.value;
  //   konsole.log(event.target.name);
  //   if (radioName == "motherLive" && radioValue == "Yes") {
  //     this.setState({ ...this.state, [radioName]: true });
  //   } else {
  //     this.setState({ ...this.state, [radioName]: false });
  //   }
  // };

  componentDidMount() {
    let newuserid = this.props.UserDetail.userId;
    let logginInUser = sessionStorage.getItem("loggedUserId") || "";
    this.setState({
      userId: newuserid,
      logginInUser: logginInUser,
    });
    // this.getsubjectForFormLabelId(this.props.UserDetail.userId);
    // this.Fetchpersonalhisotry();
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevState.show != this.state.show) {
    //   if (this.state.show) {
    //     this.Fetchpersonalhisotry();
    //   }
    // }
    if(prevState.show != true && this.state.show == true && this.state.initialShow == true) {
      this.setState({initialShow: false});
      this.getsubjectForFormLabelId(this.props.UserDetail.userId);
      // this.Fetchpersonalhisotry();
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.UserDetail.userId !== this.props.UserDetail.userId) {
  //     this.setState({
  //       userId: this.props.UserDetail.userId,
  //     });
  //   }
  // }

  handleChange = (e) => {
    const eventId = e.target.id;
    const eventValue = e.target.value;
    const eventKey = e.target.key;
    const eventName = e.target.name;
    // konsole.log(eventName,eventId,eventValue);
    konsole.log("inputCLons", eventKey, e);

    if (eventName == "smoking") {
      this.setState({
        ...this.state,
        smoking: {
          userSubjectDataId: this.state.formlabelData.label214? this.state.formlabelData.label214.userSubjectDataId: 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label214 && this.state.formlabelData.label214.questionId,
        },
        cammentSmokingsShow:eventValue == 'Yes' ? true :false
      });
    } else if (eventName == "physical") {
      this.setState({
        ...this.state,
        physical: {
          userSubjectDataId: this.state.formlabelData.label215 ? this.state.formlabelData.label215.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label215 && this.state.formlabelData.label215.questionId,
        },
        physicalcammentShow: eventValue == 'Yes' ? true : false
      });
    } else if (eventName == "balance") {
      this.setState({
        ...this.state,
        balance: {
          userSubjectDataId: this.state.formlabelData.label216 ? this.state.formlabelData.label216.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label216 && this.state.formlabelData.label216.questionId,
        },
        balancecammentShow: eventValue == 'Yes' ? true : false
      });
    } else if (eventName == "worry" && eventValue == "Yes") {
      this.setState({
        ...this.state,
        worryAboutHealth: true,
        worry: {
          userSubjectDataId: this.state.formlabelData.label217 ? this.state.formlabelData.label217.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label217 && this.state.formlabelData.label217.questionId,
        },
      });
    } else if (eventName == "worry" && eventValue == "No") {
      this.setState({
        ...this.state,
        worryAboutHealth: false,
        worry: {
          userSubjectDataId: this.state.formlabelData.label217 ? this.state.formlabelData.label217.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label217 && this.state.formlabelData.label217.questionId,
        },
      });
    } else if (eventName == "worryHealth") {
      this.setState({
        ...this.state,
        worryHealth: {
          userSubjectDataId: this.state.formlabelData.label948 ? this.state.formlabelData.label948.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label948 && this.state.formlabelData.label948.questionId,
        },
      });
    }
    else if (eventName == 'cammentSmokings'){
      this.setState({
        ...this.state,
        cammentSmokings:{
          userSubjectDataId:this.state.formlabelData.label1030 ? this.state.formlabelData.label1030.userSubjectDataId : 0,
          responseId:eventId,
          subResponseData:eventValue,
          subjectId: this.state.formlabelData.label1030 && this.state.formlabelData.label1030.questionId,
          userId: this.props.UserDetail.userId
        }
      })
    }
    else if (eventName == 'physicalcamment'){
      this.setState({
        ...this.state,
        physicalcamment:{
          userSubjectDataId:this.state.formlabelData.label1031 ? this.state.formlabelData.label1031.userSubjectDataId : 0,
          responseId:eventId,
          subResponseData:eventValue,
          subjectId: this.state.formlabelData.label1031 && this.state.formlabelData.label1031.questionId,
          userId: this.props.UserDetail.userId
        }
      })
    }
    else if (eventName == 'balancecamment'){
      this.setState({
        ...this.state,
        balancecamment:{
          userSubjectDataId:this.state.formlabelData.label1032 ? this.state.formlabelData.label1032.userSubjectDataId : 0,
          responseId:eventId,
          subResponseData:eventValue,
          subjectId: this.state.formlabelData.label1032 && this.state.formlabelData.label1032.questionId,
          userId: this.props.UserDetail.userId
        }
      })
    }
  };

  handlesubmit = () => {
    let inputdata = JSON.parse(JSON?.stringify(this.state));

    let smoking = {
      userSubjectDataId: this.state.smoking.userSubjectDataId,
      subjectId: this.state.smoking.subjectId,
      subResponseData: this.state.smoking.subResponseData,
      responseId: this.state.smoking.responseId,
      userId: this.props.UserDetail.userId,
    };

    let physical = {
      userSubjectDataId: this.state.physical.userSubjectDataId,
      subjectId: this.state.physical.subjectId,
      subResponseData: this.state.physical.subResponseData,
      responseId: this.state.physical.responseId,
      userId: this.props.UserDetail.userId,
    };

    let balance = {
      userSubjectDataId: this.state.balance.userSubjectDataId,
      subjectId: this.state.balance.subjectId,
      subResponseData: this.state.balance.subResponseData,
      responseId: this.state.balance.responseId,
      userId: this.props.UserDetail.userId,
    };

    konsole.log("sdnjkvs", this.state.userId , " - " ,  this.props.UserDetail.userId)

    let worry = {
      userSubjectDataId: this.state.worry.userSubjectDataId,
      subjectId: this.state.worry.subjectId,
      subResponseData: this.state.worry.subResponseData,
      responseId: this.state.worry.responseId,
      userId: this.state.userId ?? this.props.UserDetail.userId,
    };
    let worryHealth = {
      userSubjectDataId: this.state.worryHealth.userSubjectDataId,
      subjectId: this.state.worryHealth.subjectId,
      subResponseData: this.state.worryHealth.subResponseData,
      responseId: this.state.worryHealth.responseId,
      userId: this.state.userId ?? this.props.UserDetail.userId,
    };

    let totinptary = [];
    // totinptary.push(this.state.cammentSmokings);
    // totinptary.push(this.state.balancecamment);
    // totinptary.push(this.state.physicalcamment);
    // totinptary.push(medicine);

    if ( smoking.subjectId !== 0 && smoking.subResponseData !== "" && smoking.responseId !== 0) {
      totinptary.push(smoking);
      if(this.state.cammentSmokings.responseId != 0){
      totinptary.push(this.state.cammentSmokings);
      }
    }
    if ( physical.subjectId !== 0 && physical.subResponseData !== "" && physical.responseId !== 0) {
      totinptary.push(physical);
      if(this.state.physicalcamment.responseId != 0){
        totinptary.push(this.state.physicalcamment);
        }
    }
    if ( balance.subjectId !== 0 && balance.subResponseData !== "" && balance.responseId !== 0) {
      totinptary.push(balance);
      if(this.state.balancecamment.responseId != 0){
        totinptary.push(this.state.balancecamment);
        }
    }

    if ( worry.subjectId !== 0 && worry.subResponseData !== "" && worry.responseId !== 0) {
      totinptary.push(worry);
    }

    if (  worryHealth.subjectId !== 0 &&  worryHealth.subResponseData !== "" &&  worryHealth.responseId !== 0  ) {
      totinptary.push(worryHealth);
    }

    konsole.log("personal subject", JSON.stringify(totinptary));
    
    this.setState({disable:true})
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.postaddusersubjectdata,totinptary,(response) => {
      this.setState({disable:false})
        this.props.dispatchloader(false);
        if (response) {
          this.getsubjectForFormLabelId(this.props.UserDetail.userId);
          // this.Fetchpersonalhisotry();
          this.handleClose();
          AlertToaster.success("Data saved Successfully");
        } else {
          this.handleClose();
          this.setState({disable:false})
        }
      }
    );
  };

  handleUpdateSubmit = () => {
  
    let inputdata = JSON.parse(JSON.stringify(this.state));
    let smoking = {
      userSubjectDataId: this.state.smoking.userSubjectDataId,
      subjectId: this.state.smoking.subjectId,
      subResponseData: this.state.smoking.subResponseData,
      responseId: this.state.smoking.responseId,
      userId: this.props.UserDetail.userId,
    };

    let physical = {
      userSubjectDataId: this.state.physical.userSubjectDataId,
      subjectId: this.state.physical.subjectId,
      subResponseData: this.state.physical.subResponseData,
      responseId: this.state.physical.responseId,
      userId: this.props.UserDetail.userId,
    };

    let balance = {
      userSubjectDataId: this.state.balance.userSubjectDataId,
      subjectId: this.state.balance.subjectId,
      subResponseData: this.state.balance.subResponseData,
      responseId: this.state.balance.responseId,
      userId: this.props.UserDetail.userId,
    };

    let worry = {
      userSubjectDataId: this.state.worry.userSubjectDataId,
      subjectId: this.state.worry.subjectId,
      subResponseData: this.state.worry.subResponseData,
      responseId: this.state.worry.responseId,
    };
    let worryHealth = {
      userSubjectDataId: this.state.worryHealth.userSubjectDataId,
      subjectId: this.state.worryHealth.subjectId,
      subResponseData: this.state.worryHealth.subResponseData,
      responseId: this.state.worryHealth.responseId,
    };
    let totinptary = [];
    if(this.state.cammentSmokings.responseId != 0){
      totinptary.push(this.state.cammentSmokings);
      }
    if(this.state.physicalcamment.responseId != 0){
        totinptary.push(this.state.physicalcamment);
      }
    if(this.state.balancecamment.responseId != 0){
        totinptary.push(this.state.balancecamment);
      }

    if (smoking.subjectId !== 0 &&smoking.subResponseData !== "" && smoking.responseId !== 0) {
      totinptary.push(smoking);
      if(this.state.cammentSmokings.responseId != 0){
      totinptary.push(this.state.cammentSmokings);
      }
    }
    if ( physical.subjectId !== 0 && physical.subResponseData !== "" && physical.responseId !== 0) {
      totinptary.push(physical);
      if(this.state.physicalcamment.responseId != 0){
      totinptary.push(this.state.physicalcamment);
      }
    }
    if ( balance.subjectId !== 0 && balance.subResponseData !== "" && balance.responseId !== 0) {
      totinptary.push(balance);
      if(this.state.balancecamment.responseId != 0){
      totinptary.push(this.state.balancecamment);
      }
    }

    if (  worry.subjectId !== 0 &&  worry.subResponseData !== "" &&  worry.responseId !== 0  ) {
      totinptary.push(worry);
    }

    if ( worryHealth.subjectId !== 0 && worryHealth.subResponseData !== "" && worryHealth.responseId !== 0) {
      totinptary.push(worryHealth);
    }

    let updatePostData = {
      userId: this.props.UserDetail.userId,
      userSubjects: totinptary,
    };

    konsole.log(JSON.stringify(inputdata));
    //  this.setState({disable:true})
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("PUT",$Service_Url.putSubjectResponse,updatePostData, (response) => {
      this.setState({disable:false})
        
        konsole.log("Success res" + JSON.stringify(response));
        konsole.log("totinptary2",response)
        if (response) {
          this.props.dispatchloader(false);
          this.setState({disable : false})
          AlertToaster.success("Data updated Successfully");
          this.handleClose();
          this.getsubjectForFormLabelId(this.props.UserDetail.userId);
          // this.Fetchpersonalhisotry();
        } else {
          this.props.dispatchloader(false);
          this.handleClose();
          this.setState({disable:false})
        }
      }
    );

    // this.Fetchpersonalhisotry();
  };

  // getsubjectForFormLabelId = () => {
  //   let formlabelData = {};
  //   this.props.dispatchloader(true);
  //   caregiver.formLabelId.map((id, index) => {
  //     let data = [id.id];
  //     // konsole.log("id", data);
  //     $CommonServiceFn.InvokeCommonApi(
  //       "POST",
  //       $Service_Url.getsubjectForFormLabelId,
  //       data,
  //       (response) => {
  //         if (response) {
  //           // konsole.log("Success res", response);
  //           if (id.id == response.data.data[0].formLabelId) {
  //             let label = "label" + response.data.data[0].formLabelId;
  //             // let response = response.data.data[0].
  //             formlabelData[label] = response.data.data[0].question;
  //             // konsole.log("formdataatconsole", formlabelData);
  //             this.setState({ formlabelData: formlabelData });
  //             this.props.dispatchloader(false);
  //           }
  //         } else {
  //           alert( Msg.ErrorMsg );
  //         }
  //       }
  //     );
  //   });
  // };

  getsubjectForFormLabelId = (newuserid) => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.getsubjectForFormLabelId,personalMedicalHistry.formLabelId,(response) => {
        if (response) {
          konsole.log("sujectName", JSON.stringify(response.data.data));

          const responseData = response.data.data;
          for (let resObj of responseData) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = resObj.question;
            konsole.log("datashownatcaregiver formlabelData", formlabelData);
            $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getSubjectResponse +   newuserid +   `/0/0/${formlabelData[label].questionId}`, "", (response) => {
                if (response) {
                  if (response.data.data.userSubjects.length !== 0) {
                    this.setState({updateOrSave:true})
                    this.setState({  updateCaregiverSuitabilty: true,  });
                    let responseData = response.data.data.userSubjects[0];
                    this.props.dispatchloader(true);
                    for (let i = 0;i < formlabelData[label].response.length;i++) {
                      konsole.log("datashownatcaregiver at", i, responseData);
                      if (  formlabelData[label].response[i].responseId ===  responseData.responseId  ) {
                        this.props.dispatchloader(false);
                        if (responseData.responseNature == "Radio") {
                          formlabelData[label].response[i]["checked"] = true;
                          formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        }
                        if ( resObj.formLabelId == 217 && responseData.response == "Yes") {
                          this.setState({ worryAboutHealth: true,});
                        } if ( resObj.formLabelId == 214 && responseData.response == "Yes") {
                          this.setState({ cammentSmokingsShow: true,});
                        } if ( resObj.formLabelId == 215 && responseData.response == "Yes") {
                          this.setState({ physicalcammentShow: true,});
                        } if ( resObj.formLabelId == 216 && responseData.response == "Yes") {
                          this.setState({ balancecammentShow: true,});
                        }else if (responseData.responseNature == "Text") {
                          formlabelData[label].response[i]["response"] = responseData.response;
                          formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        }
                      }
                    }
                    this.setState({ formlabelData: formlabelData });
                  }
                  this.props.dispatchloader(false);
                }
              }
            );
            this.setState({ formlabelData: formlabelData });
          }
        } else {
          this.toasterAlert(Msg.ErrorMsg, "Warning");
          this.setState({disable:false})
        }
      }
    );
  };

  Fetchpersonalhisotry = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getuserfamilyHistory + this.props.UserDetail?.userId + "/1","",(response) => {
        // debugger
        if (response) {
          this.props.dispatchloader(false);
          konsole.log("personalmedHsitory", response.data?.data?.userMedHistory);
          this.setState({
            responseDetails: response.data?.data,
          });
          
          if (response.data.data.userMedHistory.length > 0) {
            this.setState({
              updateOrSave: true
            })
          }
          
          // let dataHaving = response.data.data
          // let FilterData = dataHaving.userMedHistory.filter((items)=>{ return items.diseaseId == 6})
          // konsole.log("FilterData",FilterData)

          this.setState({
            ...this.state,
            FetchedDiseases: response.data?.data?.userMedHistory,
          });
        }else{
          this.props.dispatchloader(false);
        }
      }
    );
  };

  handleSelectedIllness = ( _diseaseId ) => {
    this.setState({ showCommentpopover: false });
    let diseaseid = _diseaseId ? _diseaseId : this.state.diseaseIdd;
    let eventChecked = this.state.eventsoncheckbox;

    let medHisId = this.state.responseDetails.userMedHistory?.filter((data) => {
      return data.diseaseId == diseaseid;
    })[0]?.medicalHistId;

    konsole.log("medHisId", medHisId);

    let aryinputdata = [];
    let inputdata = {};
    inputdata["isSuffering"] = document.getElementById( "disease" + diseaseid).checked;
    inputdata["relationshipId"] = 0; //0 is default value
    inputdata["isCurrentlyLiving"] = true;
    (inputdata["illnessDuration"] = 0),(inputdata["formallyDiagnosed"] = null),(inputdata["symptomsSigns"] = null),(inputdata["causeOfDeath"] = null);
    inputdata["diseaseId"] = diseaseid || "";
    inputdata["medicalHistTypeId"] = this.state.medicalHistTypeId;
    inputdata["remarks"] = this.state.remarks;
    // if (eventChecked == false) {
      inputdata["medicalHistId"] = medHisId;
    // }
    aryinputdata.push(inputdata);
    konsole.log("personal medical history", aryinputdata);
    this.InvokeSaveHistoryApi(aryinputdata);
  };

  InvokeSaveHistoryApi = (aryinputdata) => {
    let inputdata = {};
    let reqcnt = 0;
    let rescnt = 0;
    let boolres = true;
    for (let lpcnt = 0; lpcnt < aryinputdata.length; lpcnt++) {
      reqcnt++;

      let method = "POST";
      let url = $Service_Url.postAddFamilyHistory;
      inputdata = aryinputdata[lpcnt];

      let finaldata = {
        medicalHistTypeId: this.state.medicalHistTypeId,
        relationshipId: inputdata.relationshipId || null,
        isCurrentlyLiving: inputdata.isCurrentlyLiving || 0,
        age: inputdata.age || null,
        isSuffering: inputdata.isSuffering || false,
        illnessDuration: inputdata.illnessDuration || null,
        coMorbidityFormallyDiagnosed: inputdata.coMorbidityFormallyDiagnosed || null,
        coMorbidityId: inputdata.coMorbidityId || 0,
        formallyDiagnosed: inputdata.formallyDiagnosed || null,
        symptomsSigns: inputdata.symptomsSigns || null,
        medicalHistoryInfo: inputdata.remarks || null,
        causeDeathId: inputdata.causeDeathId || 0,
        diseaseId: inputdata.diseaseId || 0,
        // disease: inputdata.disease || "",
      };

      konsole.log("finaldatafinaldata", finaldata);
      let totalinput = {
        userId: this.props.UserDetail.userId,
        // createdBy: this.state.logginInUser,
        // isActive: true,
        medHistory: finaldata,
      };

      if (  inputdata?.medicalHistId !== undefined &&  inputdata?.medicalHistId !== "" &&  inputdata?.medicalHistId !== null  ) {
        konsole.log("put working");
        method = "PUT";
        url = $Service_Url.putUpdateFamilyHistory;
        totalinput["updatedBy"] = this.state.logginInUser;
        totalinput["medicalHistId"] = inputdata.medicalHistId;
        totalinput["isActive"] = false;
      } else {
        konsole.log("put working not post working");
        totalinput["createdBy"] = this.state.logginInUser;
        totalinput["isActive"] = true;
      }
      konsole.log( "totalinputtotalinput", JSON.stringify(totalinput), method, url);
      this.setState({disable:true})
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi( method, url,  totalinput, (response) => {
        this.setState({disable:false})
          rescnt++;
          konsole.log("totalinputtotalinput", response.data);
          konsole.log("totalinputtotalinput" + JSON.stringify(response));
          if (response) {
            this.props.dispatchloader(false);
          } else {
            boolres = false;
          }
          if (aryinputdata.length == rescnt) {
            // this.Fetchpersonalhisotry();
            if (boolres) {
              // AlertToaster.success("Data saved Successfully");
            } else {
              this.toasterAlert(Msg.ErrorMsg, "Warning");
            }
          }
        }
      );
    }
  };

  handleInputChange = (event) => {
    event.preventDefault();
    let attrname = event.target.name;
    let attrvalue = event.target.value;

    this.setState({
      ...this.state,
      [attrname]: attrvalue,
    });
  };

  toasterAlert(text, type) {
    this.setState({disable:false})
    this.context.setdata({ open: true, text: text, type: type });
  }

  handleSelectedIllnesspopover = (e, diseaseId) => {
    konsole.log("diseaseId", diseaseId, this.state.FetchedDiseases);
    let filterdata = this.state.FetchedDiseases.length > 0 && this.state.FetchedDiseases?.filter(   (items) => items.diseaseId == diseaseId );
    konsole.log("filterdatafilterdata", filterdata.length, filterdata);
    if (!e.target.checked) this.handleSelectedIllness(diseaseId)

    this.setState({
      eventsoncheckbox: e.target.checked,
      showCommentpopover: e.target.checked,
      diseaseIdd: diseaseId,
      remarks: filterdata.length !== 0 ? filterdata[0]?.medicalHistoryInfo : "",
    });
  };

  handleChangeRemarks = (e) => {
    this.setState({ remarks: e.target.value });
    konsole.log("ababababa", e.target.value);
  };
  render() {
    konsole.log("thisstateFetchedDiseases", this.state);
    const responseValues = this.state.responseDetails;

    const alzPopover = (diseaseId) => (
      <Popover id="popover" className="w-100 ">
        <Popover.Body>
          <div className="d-flex justify-content-between align-items-center">
            <Form className="w-100 mb-3">
              <Form.Group className="mb-5 w-100">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.remarks}
                  onChange={this.handleChangeRemarks}
                  name="remarks"
                  id="remarks"
                  placeholder="(Optional)"
                />
              </Form.Group>
            </Form>
          </div>
          <div className="d-flex justify-content-end align-items-center">
            <div className="d-flex justify-content-between">
              <button className="cancel-Button me-3 familyMedicalHistCancelButton" onClick={() => this.handleSelectedIllness()}>
                {" "}
                Cancel{" "}
              </button>
              <Button className="theme-btn" onClick={() => this.handleSelectedIllness()}>
                Save
              </Button>
            </div>
          </div>
        </Popover.Body>
      </Popover>
    );
    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            max-width: 56.25rem;
            margin: 1.75rem auto;
          }
          .popover.show {
            position: absolute;
            inset: 0px auto auto 0px;
            transform: translate(707px, 380px);
          }
        `}</style>
        <a onClick={this.handleShow}>
          <img src="/icons/add-icon.svg" alt="Health Insurance" />
        </a>

        <Modal
          size="lg"
          show={this.state.show}
          enforceFocus={false}
          centered
          onHide={this.handleClose}
          animation="false"
          id="personalHistory"
          backdrop="static"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Personal Medical History</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.showCommentpopover && (
              <div className="overlay_OverlayTrigger"></div>
            )}
            <Row className="m-0 mb-3">
              <Col xs lg="12" className="d-flex align-items-center ps-0">
               <BloodType memberUserid={this.props?.UserDetail?.userId}setLoader={this.props.dispatchloader} />
              </Col>
            </Row>
            <Row className="m-0 mb-3">
              <Col xs lg="12" className="d-flex align-items-center ps-0">
                <p className="fw-bold">
                  Check if you have or had the following conditions?
                </p>
              </Col>
            </Row>
            <Row className="m-0 mb-3">
              <Col xs lg="8" className="ps-0 border p-2">
              <div
                  className="selecting-box d-flex align-items-center justify-content-between ps-4"
                  id="personalHistory6"
                >
                  <div className="list-box">Blood Pressure Issues</div>
                  <OverlayTrigger
                    trigger="click"
                    placement="top-start"
                    shouldUpdatePosition={true}
                    show={this.state.showCommentpopover}
                    overlay={() => alzPopover(6)}
                  >
                    <div className="check-list">
                      <div key="inline-checkbox" className="rn-checkbox">
                        <Form.Check
                          inline
                          label=""
                          name="group1"
                          type="checkbox"
                          id={"disease" + 6}
                          // onChange={(e) => this.handleSelectedIllness(e, 6)}
                          onChange={(e) =>
                            this.handleSelectedIllnesspopover(e, 6)
                          }
                          defaultChecked={
                            this.state.FetchedDiseases.length > 0 &&
                            this.state.FetchedDiseases.some(
                              (v) => v.diseaseId == 6 && v.isSuffering == true
                            )
                          }
                          key={"6"+ this.state.FetchedDiseases?.length}
                        />
                      </div>
                    </div>
                  </OverlayTrigger>
                </div>

                <div
                  className="selecting-box d-flex align-items-center justify-content-between ps-4"
                  id="personalHistory5"
                >
                  <div className="list-box">Diabetes</div>
                  <OverlayTrigger
                    trigger="click"
                    placement="top-start"
                    shouldUpdatePosition={true}
                    show={this.state.showCommentpopover}
                    overlay={() => alzPopover(5)}
                  >
                    <div className="check-list">
                      <div key="inline-checkbox" className="rn-checkbox">
                        <Form.Check
                          inline
                          label=""
                          name="group1"
                          type="checkbox"
                          id={"disease" + 5}
                          // onChange={(e) => this.handleSelectedIllness(e, 5)}
                          onChange={(e) =>
                            this.handleSelectedIllnesspopover(e, 5)
                          }
                          defaultChecked={
                            this.state.FetchedDiseases.length > 0 &&
                            this.state.FetchedDiseases.some(
                              (v) => v.diseaseId == 5 && v.isSuffering == true
                            )
                          }
                          key={"5"+ this.state.FetchedDiseases?.length}
                        />
                      </div>
                    </div>
                  </OverlayTrigger>
                </div>

                <div
                  className="selecting-box d-flex align-items-center justify-content-between ps-4"
                  id="personalHistory1"
                >
                  <div className="list-box">Dementia/Alzheimer’s</div>
                  <div className="check-list">
                    <OverlayTrigger
                      trigger="click"
                      placement="top-start"
                      shouldUpdatePosition={true}
                      show={this.state.showCommentpopover}
                      overlay={() => alzPopover(1)}
                    >
                      <div key="inline-checkbox" className="rn-checkbox">
                        <Form.Check
                          inline
                          label=""
                          name="group1"
                          type="checkbox"
                          id={"disease" + 1}
                          onChange={(e) =>
                            this.handleSelectedIllnesspopover(e, 1)
                          }
                          // onChange={(e) => this.handleSelectedIllness(e, 1)}
                          defaultChecked={
                            this.state.FetchedDiseases.length > 0 &&
                            this.state.FetchedDiseases.some(
                              (v) => v.diseaseId == 1 && v.isSuffering == true
                            )
                          }
                          key={"1"+ this.state.FetchedDiseases?.length}
                        />
                      </div>
                    </OverlayTrigger>
                  </div>
                </div>

                <div
                  className="selecting-box d-flex align-items-center justify-content-between ps-4"
                  id="personalHistory7"
                >
                  <div className="list-box">Elevated Cholesterol</div>
                  <OverlayTrigger
                    trigger="click"
                    placement="top-start"
                    shouldUpdatePosition={true}
                    show={this.state.showCommentpopover}
                    overlay={() => alzPopover(7)}
                  >
                    <div className="check-list">
                      <div key="inline-checkbox" className="rn-checkbox">
                        <Form.Check
                          inline
                          label=""
                          name="group1"
                          type="checkbox"
                          id={"disease" + 7}
                          // onChange={(e) => this.handleSelectedIllness(e, 7)}
                          onChange={(e) =>
                            this.handleSelectedIllnesspopover(e, 7)
                          }
                          defaultChecked={
                            this.state.FetchedDiseases.length > 0 &&
                            this.state.FetchedDiseases.some(
                              (v) => v.diseaseId == 7 && v.isSuffering == true
                            )
                          }
                          key={"7"+ this.state.FetchedDiseases?.length}
                        />
                      </div>
                    </div>
                  </OverlayTrigger>
                </div>
                <div
                  className="selecting-box d-flex align-items-center justify-content-between ps-4"
                  id="personalHistory8"
                >
                  <div className="list-box">Glaucoma</div>
                  <OverlayTrigger
                    trigger="click"
                    placement="top-start"
                    shouldUpdatePosition={true}
                    show={this.state.showCommentpopover}
                    overlay={() => alzPopover(8)}
                  >
                    <div className="check-list">
                      <div key="inline-checkbox" className="rn-checkbox">
                        <Form.Check
                          inline
                          label=""
                          name="group1"
                          type="checkbox"
                          id={"disease" + 8}
                          // onChange={(e) => this.handleSelectedIllness(e, 8)}
                          onChange={(e) =>
                            this.handleSelectedIllnesspopover(e, 8)
                          }
                          defaultChecked={
                            this.state.FetchedDiseases.length > 0 &&
                            this.state.FetchedDiseases.some(
                              (v) => v.diseaseId == 8 && v.isSuffering == true
                            )
                          }
                          key={"8"+ this.state.FetchedDiseases?.length}
                        />
                      </div>
                    </div>
                  </OverlayTrigger>
                </div>
                <div
                  className="selecting-box d-flex align-items-center justify-content-between ps-4"
                  id="personalHistory3"
                >
                  <div className="list-box">Heart Disease</div>
                  <OverlayTrigger
                    trigger="click"
                    placement="top-start"
                    shouldUpdatePosition={true}
                    show={this.state.showCommentpopover}
                    overlay={() => alzPopover(3)}
                  >
                    <div className="check-list">
                      <div key="inline-checkbox" className="rn-checkbox">
                        <Form.Check
                          inline
                          label=""
                          name="group1"
                          type="checkbox"
                          id={"disease" + 3}
                          // onChange={(e) => this.handleSelectedIllness(e, 3)}
                          onChange={(e) =>
                            this.handleSelectedIllnesspopover(e, 3)
                          }
                          defaultChecked={
                            this.state.FetchedDiseases.length > 0 &&
                            this.state.FetchedDiseases.some(
                              (v) => v.diseaseId == 3 && v.isSuffering == true
                            )
                          }
                          key={"3"+ this.state.FetchedDiseases?.length}
                        />
                      </div>
                    </div>
                  </OverlayTrigger>
                </div>
                <div
                  className="selecting-box d-flex align-items-center justify-content-between ps-4"
                  id="personalHistory2"
                >
                  <div className="list-box">Parkinson’s</div>
                  <div className="check-list">
                    <OverlayTrigger
                      trigger="click"
                      placement="top-start"
                      shouldUpdatePosition={true}
                      show={this.state.showCommentpopover}
                      overlay={() => alzPopover(2)}
                    >
                      <div key="inline-checkbox" className="rn-checkbox">
                        <Form.Check
                          inline
                          label=""
                          name="group1"
                          type="checkbox"
                          id={"disease" + 2}
                          // onChange={(e) => this.handleSelectedIllness(e, 2)}
                          onChange={(e) =>
                            this.handleSelectedIllnesspopover(e, 2)
                          }
                          defaultChecked={
                            this.state.FetchedDiseases.length > 0 &&
                            this.state.FetchedDiseases.some(
                              (v) => v.diseaseId == 2 && v.isSuffering == true
                            )
                          }
                          key={"2"+ this.state.FetchedDiseases?.length}
                        />
                      </div>
                    </OverlayTrigger>
                  </div>
                </div>
                <div
                  className="selecting-box d-flex align-items-center justify-content-between ps-4"
                  id="personalHistory4"
                >
                  <div className="list-box">Stroke</div>
                  <div className="check-list">
                    <OverlayTrigger
                      trigger="click"
                      placement="top-start"
                      shouldUpdatePosition={true}
                      show={this.state.showCommentpopover}
                      overlay={() => alzPopover(4)}
                    >
                      <div key="inline-checkbox" className="rn-checkbox">
                        <Form.Check
                          inline
                          label=""
                          name="group1"
                          type="checkbox"
                          id={"disease" + 4}
                          // onChange={(e) => this.handleSelectedIllness(e, 4)}
                          onChange={(e) =>
                            this.handleSelectedIllnesspopover(e, 4)
                          }
                          defaultChecked={
                            this.state.FetchedDiseases.length > 0 &&
                            this.state.FetchedDiseases.some(
                              (v) => v.diseaseId == 4 && v.isSuffering == true
                            )
                          }
                          key={"4"+ this.state.FetchedDiseases?.length}
                        />
                      </div>
                    </OverlayTrigger>
                  </div>
                </div>                
              </Col>
            </Row>
            <Row className="m-0 mb-3">
              <Col
                xs
                sm="12"
                lg="12"
                className="ps-0 pb-3"
                id="personalHistory9"
              >
                <label className="">
                  {this.state.formlabelData.label214 &&
                    this.state.formlabelData.label214.question}
                </label>
                <div className="d-flex justify-content-start align-items-center">
                  {this.state.formlabelData.label214 &&
                    this.state.formlabelData.label214.response.map(
                      (response) => {
                        return (
                          <>
                            <div
                              key="checkbox8"
                              className="me-4 pe-3 mb-0 d-flex justify-content-center align-items-center"
                            >
                              <Form.Check
                                className="chekspace"
                                type="radio"
                                id={response.responseId}
                                label={response.response}
                                value={response.response}
                                name="smoking"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                                // key={"smoking"+ response.checked}
                              />
                            </div>
                          </>
                        );
                      }
                    )}
                </div>
                {(this.state.cammentSmokingsShow == true) ? this.state.formlabelData.label1030 &&
                      this.state.formlabelData?.label1030?.response.map(
                        (response) => {
                          konsole.log("respisss", response);
                          return (
                            <>
                              <Form.Control
                                type="text"
                                name="cammentSmokings"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                className="w-100 mt-2"
                                id={response.responseId}
                                defaultValue={response.response}
                                // key={"cammentSmokings"+ response.response}
                                Placeholder='Comment'
                              />
                            </>
                          );
                        }
                      ):''}
              </Col>
              <Col
                xs
                sm="12"
                lg="12"
                className="ps-0 pb-3"
                id="personalHistory10"
              >
                <label className="">
                  {this.state.formlabelData.label215 &&
                    this.state.formlabelData.label215.question}
                </label>
                <div className="d-flex justify-content-start align-items-center">
                  {this.state.formlabelData.label215 &&
                    this.state.formlabelData.label215.response.map(
                      (response) => {
                        return (
                          <>
                            <div
                              key="checkbox8"
                              className="me-4 pe-3 mb-0 d-flex justify-content-center align-items-center"
                            >
                              <Form.Check
                                className="chekspace"
                                type="radio"
                                id={response.responseId}
                                label={response.response}
                                value={response.response}
                                name="physical"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                                // key={"physical"+response.checked}
                              />
                            </div>
                            {/* {response.response == "Yes" ? (
                              <OverlayTrigger
                                trigger="click"
                                placement="right"
                                overlay={popover}
                              >
                                <div
                                  key="checkbox8"
                                  className="me-4 pe-3 mb-0 d-flex justify-content-center align-items-center"
                                >
                                  <Form.Check
                                    className="chekspace"
                                    type="radio"
                                    id={response.responseId}
                                    label={response.response}
                                    value={response.response}
                                    name="physical"
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                  />
                                </div>
                              </OverlayTrigger>
                            ) : (
                              <div
                                key="checkbox8"
                                className="me-4 pe-3 mb-0 d-flex justify-content-center align-items-center"
                              >
                                <Form.Check
                                  className="chekspace"
                                  type="radio"
                                  id={response.responseId}
                                  label={response.response}
                                  value={response.response}
                                  name="physical"
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                />
                              </div>
                            )} */}
                          </>
                        );
                      }
                    )}
                </div>
                {(this.state.physicalcammentShow == true) ? this.state.formlabelData?.label1031 &&
                      this.state.formlabelData.label1031?.response.map(
                        (response) => {
                          konsole.log("respisss", response);
                          return (
                            <>
                              <Form.Control
                                type="text"
                                name="physicalcamment"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                className="w-100 mt-2"
                                id={response.responseId}
                                defaultValue={response.response}
                                Placeholder='Comment'
                                // key={"physicalcamment"+ response.response}
                              />
                            </>
                          );
                        }
                      ) : ''}
              </Col>
              <Col
                xs
                sm="12"
                lg="12"
                className="ps-0 pb-0"
                id="personalHistory11"
              >
                <label className="">
                  {this.state.formlabelData.label216 &&
                    this.state.formlabelData.label216.question}
                </label>
                <div className="d-flex justify-content-start align-items-center">
                  {this.state.formlabelData.label216 &&
                    this.state.formlabelData.label216?.response.map(
                      (response) => {
                        return (
                          <>
                            <div
                              key="checkbox8"
                              className="me-4 pe-3 mb-0 d-flex justify-content-center align-items-center"
                            >
                              <Form.Check
                                className="chekspace"
                                type="radio"
                                id={response.responseId}
                                label={response.response}
                                value={response.response}
                                name="balance"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                                // key={"balance" + response.checked}
                              />
                            </div>
                            {/* {response.response == "Yes" ? (
                              <OverlayTrigger
                                trigger="click"
                                placement="right"
                                overlay={popover}
                              >
                                <div
                                  key="checkbox8"
                                  className="me-4 pe-3 mb-0 d-flex justify-content-center align-items-center"
                                >
                                  <Form.Check
                                    className="chekspace"
                                    type="radio"
                                    id={response.responseId}
                                    label={response.response}
                                    value={response.response}
                                    name="balance"
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                  />
                                </div>
                              </OverlayTrigger>
                            ) : (
                              <div
                                key="checkbox8"
                                className="me-4 pe-3 mb-0 d-flex justify-content-center align-items-center"
                              >
                                <Form.Check
                                  className="chekspace"
                                  type="radio"
                                  id={response.responseId}
                                  label={response.response}
                                  value={response.response}
                                  name="balance"
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                />
                              </div>
                            )} */}
                          </>
                        );
                      }
                    )}
                </div>
                {(this.state.balancecammentShow == true) ?  this.state.formlabelData?.label1032 &&
                      this.state.formlabelData.label1032?.response.map(
                        (response) => {
                          const defVal = response.response;
                          konsole.log("dbvkjsdb", response, defVal);
                          return (
                            <>
                              <Form.Control
                                type="text"
                                name="balancecamment"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                className="w-100 mt-2"
                                id={response.responseId}
                                defaultValue={defVal}
                                Placeholder='Comment'
                                // key={"balancecamment"+ defVal}
                              />
                            </>
                          );
                        }
                      ):''}
              </Col>

              {/* <Col
                xs
                sm="12"
                lg="12"
                className="ps-0 pb-3"
                id="personalHistory12"
              >
                <label className="">
                  {" "}
                  {this.state.formlabelData.label217 &&
                    this.state.formlabelData.label217.question}
                </label>
                <div className="d-flex justify-content-start align-items-center">
                  {this.state.formlabelData.label217 &&
                    this.state.formlabelData.label217.response.map(
                      (response) => {
                        return (
                          <>
                            {response.response == "Yes" ? (
                              <OverlayTrigger
                                trigger="click"
                                placement="right"
                                overlay={popover}
                              >
                                <div
                                  key="checkbox8"
                                  className="me-4 pe-3 mb-0 d-flex justify-content-center align-items-center"
                                >
                                  <Form.Check
                                    className="chekspace"
                                    type="radio"
                                    id={response.responseId}
                                    label={response.response}
                                    value={response.response}
                                    name="medicine"
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                  />
                                </div>
                              </OverlayTrigger>
                            ) : (
                              <div
                                key="checkbox8"
                                className="me-4 pe-3 mb-0 d-flex justify-content-center align-items-center"
                              >
                                <Form.Check
                                  className="chekspace"
                                  type="radio"
                                  id={response.responseId}
                                  label={response.response}
                                  value={response.response}
                                  name="medicine"
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                />
                              </div>
                            )}
                          </>
                        );
                      }
                    )}
                </div>

              </Col> */}
              <div
                className="d-flex justify-content-start flex-column align-items-start mt-3 p-0"
                id="lifestyle7"
              >
                <label className="">
                  {" "}
                  {this.state.formlabelData.label217 &&
                    this.state.formlabelData.label217.question}{" "}
                </label>
                <div className="d-flex justify-content-start align-items-center ">
                  {this.state.formlabelData.label217 &&
                    this.state.formlabelData.label217.response.map(
                      (response) => {
                        return (
                          <>
                            <div className="d-flex justify-content-center align-items-center">
                              {response.response == "Yes" ? (
                                <div
                                  key="checkbox8"
                                  className="me-4 pe-3 mb-0 d-flex justify-content-center align-items-center"
                                >
                                  <Form.Check
                                    className="chekspace"
                                    type="radio"
                                    id={response.responseId}
                                    label={response.response}
                                    defaultValue={response.response}
                                    name="worry"
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                    defaultChecked={response.checked}
                                    // key={"worry"+ response.checked}
                                  />
                                </div>
                              ) : (
                                <div
                                  key="checkbox8"
                                  className="me-4 pe-3 mb-0 d-flex justify-content-center align-items-center"
                                >
                                  <Form.Check
                                    className="chekspace"
                                    type="radio"
                                    id={response.responseId}
                                    label={response.response}
                                    defaultValue={response.response}
                                    name="worry"
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                    defaultChecked={response.checked}
                                    // key={"worry23"+ response.checked}
                                  />
                                </div>
                              )}
                            </div>
                          </>
                        );
                      }
                    )}
                </div>
              </div>
              {this.state.worryAboutHealth == true && (
                <div className="p-0">
                  <div
                    className="d-flex justify-content-start flex-column align-items-start mt-3 "
                    id="lifestyle8"
                  >
                    <label className="mb-2">
                      {this.state.formlabelData.label948 &&
                        this.state.formlabelData.label948.question}
                    </label>
                    {this.state.formlabelData.label948 &&
                      this.state.formlabelData.label948.response.map(
                        (response) => {
                          konsole.log("respisss", response);
                          return (
                            <>
                              <Form.Control
                                type="text"
                                name="worryHealth"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                className="w-100"
                                id={response.responseId}
                                defaultValue={response.response}
                                // key={"worryHealth"+ response.response}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </div>
              )}
            </Row>
            <div className="d-flex justify-content-end">
              <Button
                style={{ backgroundColor: "#76272b", border: "none" }}
                className="theme-btn"
                onClick={
                  this.state.updateCaregiverSuitabilty
                    ? this.handleUpdateSubmit
                    : this.handlesubmit
                }
                disabled={this.state.disable == true ? true : false}
              >
                {this.state.updateOrSave == false ? "Save" : "Update"}
              </Button>
            </div>
          </Modal.Body>
         
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(personalmedicalhistory);
