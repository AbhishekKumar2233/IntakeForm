import React, { Component } from "react";
import {
  Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb,
} from "react-bootstrap";

import { $CommonServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import { financialAdvisorMoreInfo } from "./control/Constant";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import { globalContext } from "../pages/_app";
import { isNotValidNullUndefile } from "./Reusable/ReusableCom";


export class FinancialAdvisorMoreInfo extends Component {
  static contextType = globalContext
  constructor(props, context) {
    super(props, context);
    this.state = this.stateObj
  }
  
  newuserid = sessionStorage?.getItem("SessPrimaryUserId") || "";
  spouseUserId = sessionStorage?.getItem("spouseUserId") || "";

  stateObj = {
    show: false,
    showMoreInfo: false,
    formlabelData: {},
    restrictAddProfessional: "false",
    updateCaregiverSuitabilty: false,
    SpouseDetails: [],
    fName: "",
    userId: "",
    spouseUserId:'',
    currentState: "Yes",
    help: {
      userId: "",
      userSubjectDataId: 0,
      subjectId: 0,
      subResponseData: "string",
      responseId: 0,
    },

    dontFinancialAdvisor: {
      userId: "",
      userSubjectDataId: 0,
      subjectId: 0,
      subResponseData: "string",
      responseId: 0,
    },

    comfortable: {
      userId: "",
      userSubjectDataId: 0,
      subjectId: 0,
      subResponseData: "string",
      responseId: 0,
    },

    decision: {
      userId: "",
      userSubjectDataId: 0,
      subjectId: 0,
      subResponseData: "string",
      responseId: 0,
    },

    planner: {
      userId: "",
      userSubjectDataId: 0,
      subjectId: 0,
      subResponseData: "string",
      responseId: 0,
    },

    current: {
      userId: "",
      userSubjectDataId: 0,
      subjectId: 0,
      subResponseData: "string",
      responseId: 0,
    },
    adequacy: {
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
    comfortableFinancialAdvisor: {
      userId: "",
      userSubjectDataId: 0,
      subjectId: 0,
      subResponseData: "string",
      responseId: 0,
    },
    showquestionforprimary:false,
    showquestionforspouse:false
  };

  handleClose = () => {
    this.setState(this.stateObj);
  };

  handleShow = (checkboxChecked) => {
    if (this.state.financMoreInfocheckboxdisable == true) {
      return;
    } else if (checkboxChecked) {
      this.setState({
        show: !this.state.show,
      })
    }
    this.setState({
      userId: this.newuserid,
      spouseUserId:this.spouseUserId
    });
    this.FetchFamilyMembersUsingParentId(this.newuserid)
    this.getsubjectForFormLabelId(this.newuserid);
    this.fetchmemberbyID(this.newuserid);
  };



  componentDidMount() {
    // debugger;
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let spouseUserId = sessionStorage.getItem("spouseUserId") || "";
    this.setState({
      userId: newuserid,
      spouseUserId:spouseUserId
    });
    // konsole.log(JSON.stringify("Props " + JSON.stringify(this.props)));
    // this.FetchFamilyMembers(newuserid);
    this.FetchFamilyMembersUsingParentId(newuserid)
    this.getsubjectForFormLabelId(newuserid);
    this.fetchmemberbyID(newuserid);
  }

  componentDidUpdate(prevProp, prevState) {
    if((this.props.profMemberCount > 0 || this.props.forceUncheck == true) && this.state.restrictAddProfessional === "true" && this.state.formlabelData?.label994?.userSubjectDataId != undefined) {
      this.setState({restrictAddProfessional: "false", userId: this.newuserid});
      this.handleUpdateSubmitSeconde(this.state.formlabelData?.label994?.userSubjectDataId || 0, false, 388, 198);
    }
  }

  handleChange = (e) => {
    const eventId = e.target.id;
    const eventValue = e.target.value;
    const eventName = e.target.name;
    const eventChecked = e.target.checked;

    konsole.log("eventIdeventId", eventId, eventValue, eventName)


    if (eventName == "help") {
      this.setState({
        ...this.state,
        help: {
          userSubjectDataId: this.state.formlabelData.label581 ? this.state.formlabelData.label581.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label581 &&
            this.state.formlabelData.label581.questionId
        }

      })
    }
    else if (eventName == "comfortable") {
      this.setState({
        ...this.state,
        comfortable: {
          userSubjectDataId: this.state.formlabelData.label582 ? this.state.formlabelData.label582.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label582 &&
            this.state.formlabelData.label582.questionId
        }

      })
    }
    // userId: "",
    // userSubjectDataId: 0,
    // subjectId: 0,
    // subResponseData: "string",
    // responseId: 0
    else if (eventName == "decision") {
      this.setState({
        ...this.state,
        decision: {
          userSubjectDataId: this.state.formlabelData.label576 ? this.state.formlabelData.label576.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label576 &&
            this.state.formlabelData.label576.questionId
        }

      })
      konsole.log(eventId,"eventIdeventIdeventIdeventId")
      if(eventId == 140){
        this.setState({showquestionforspouse: false,showquestionforprimary:true})
      }
      if(eventId == 139){
        this.setState({showquestionforprimary: false,showquestionforspouse:true})
      }
      if(eventId != 139 && eventId != 140){
        this.setState({showquestionforspouse: false,showquestionforprimary:false})
      }
    }

    if (eventName == "planner") {
      this.setState({
        ...this.state,
        planner: {
          userSubjectDataId: this.state.formlabelData.label577 ? this.state.formlabelData.label577.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label577 &&
            this.state.formlabelData.label577.questionId
        }

      })
    }

    else if (eventName == "current") {
      this.setState({
        ...this.state,
        currentState: eventValue,
        current: {
          userSubjectDataId: this.state.formlabelData.label578 ? this.state.formlabelData.label578.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label578 &&
            this.state.formlabelData.label578.questionId
        }

      })
    }
    else if (eventName == "adequacy") {
      this.setState({
        ...this.state,
        adequacy: {
          userSubjectDataId: this.state.formlabelData.label579 ? this.state.formlabelData.label579.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label579 &&
            this.state.formlabelData.label579.questionId
        }

      })
    }
    else if (eventName == "investment") {
      this.setState({
        ...this.state,
        investment: {
          userSubjectDataId: this.state.formlabelData.label580 ? this.state.formlabelData.label580.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label580 &&
            this.state.formlabelData.label580.questionId
        }

      })
    }
    else if (eventName == "comfortableFinancialAdvisor") {
      this.setState({
        ...this.state,
        comfortableFinancialAdvisor: {
          userSubjectDataId: this.state.formlabelData.label1001 ? this.state.formlabelData.label1001.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label1001 &&
            this.state.formlabelData.label1001.questionId
        }

      })
    }
    else if (eventName == "dontFinancialAdvisor") {
      if(this.props.financMoreInfocheckboxdisable==true){
        this.toasterAlert('Financial Advisor already available.','Warning')
        return;
      }
      this.setState({
        ...this.state,
        dontFinancialAdvisor: {
          userSubjectDataId: this.state.formlabelData?.label994?.userSubjectDataId ?? 0,
          responseId: eventId,
          subResponseData: eventChecked,
          subjectId: this.state.formlabelData.label994 && this.state.formlabelData.label994.questionId
        }
      })
      this.handleShow(eventChecked);
    }






  };




  handlesubmit = () => {
    let inputdata = JSON.parse(JSON.stringify(this.state));


    let dontFinancialAdvisor = {
      userSubjectDataId: this.state.dontFinancialAdvisor?.userSubjectDataId,
      subjectId: this.state.dontFinancialAdvisor?.subjectId,
      subResponseData: this.state.dontFinancialAdvisor?.subResponseData,
      responseId: this.state.dontFinancialAdvisor?.responseId,
      userId: this.state.userId,
    };

    if (dontFinancialAdvisor.subjectId !== 0 && dontFinancialAdvisor.subResponseData !== "" && dontFinancialAdvisor.responseId !== 0) {
      totinptary.push(dontFinancialAdvisor);
    }

    let help = {
      userSubjectDataId: this.state.help?.userSubjectDataId,
      subjectId: this.state.help?.subjectId,
      subResponseData: this.state.help?.subResponseData,
      responseId: this.state.help?.responseId,
      userId: this.state.userId,
    };

    let comfortable = {
      userSubjectDataId: this.state.comfortable?.userSubjectDataId,
      subjectId: this.state.comfortable.subjectId,
      subResponseData: this.state.comfortable?.subResponseData,
      responseId: this.state.comfortable?.responseId,
      userId: this.state?.userId,
    };

    let decision = {
      userSubjectDataId: this.state.decision?.userSubjectDataId,
      subjectId: this.state.decision?.subjectId,
      subResponseData: this.state.decision?.subResponseData,
      responseId: this.state.decision?.responseId,
      userId: this.state.userId,
    };
    let planner = {
      userSubjectDataId: this.state.planner?.userSubjectDataId,
      subjectId: this.state.planner?.subjectId,
      subResponseData: this.state.planner.subResponseData,
      responseId: this.state.planner?.responseId,
      userId: this.state.userId,
    };
    let current = {
      userSubjectDataId: this.state.current?.userSubjectDataId,
      subjectId: this.state.current?.subjectId,
      subResponseData: this.state.current?.subResponseData,
      responseId: this.state.current?.responseId,
      userId: this.state.userId,
    };
    let adequacy = {
      userSubjectDataId: this.state.adequacy?.userSubjectDataId,
      subjectId: this.state.adequacy?.subjectId,
      subResponseData: this.state.adequacy?.subResponseData,
      responseId: this.state.adequacy?.responseId,
      userId: this.state.userId,
    };
    let investment = {
      userSubjectDataId: this.state.investment?.userSubjectDataId,
      subjectId: this.state.investment?.subjectId,
      subResponseData: this.state.investment?.subResponseData,
      responseId: this.state.investment?.responseId,
      userId: this.state.userId,
    };

    let comfortableFinancialAdvisor = {
      userSubjectDataId: this.state.comfortableFinancialAdvisor?.userSubjectDataId,
      subjectId: this.state.comfortableFinancialAdvisor?.subjectId,
      subResponseData: this.state.comfortableFinancialAdvisor?.subResponseData,
      responseId: this.state.comfortableFinancialAdvisor?.responseId,
      userId: this.state.userId,
    };



    let totinptary = [];
    // totinptary.push(help);
    // totinptary.push(comfortable);
    // totinptary.push(decision);
    // totinptary.push(planner);
    // totinptary.push(current);
    // totinptary.push(adequacy);
    // totinptary.push(investment);
    if (dontFinancialAdvisor.subjectId !== 0 && dontFinancialAdvisor.subResponseData !== "" && dontFinancialAdvisor.responseId !== 0) {
      totinptary.push(dontFinancialAdvisor);
    }
    if (planner.subjectId !== 0 && planner.subResponseData !== "" && planner.responseId !== 0) {
      totinptary.push(planner);
    }
    if (current.subjectId !== 0 && current.subResponseData !== "" && current.responseId !== 0) {
      totinptary.push(current);
    }
    if (adequacy.subjectId !== 0 && adequacy.subResponseData !== "" && adequacy.responseId !== 0) {
      totinptary.push(adequacy);
    }
    if (investment.subjectId !== 0 && investment.subResponseData !== "" && investment.responseId !== 0) {
      totinptary.push(investment);
    }
    if (decision.subjectId !== 0 && decision.subResponseData !== "" && decision.responseId !== 0) {
      totinptary.push(decision);
    }
    if (help.subjectId !== 0 && help.subResponseData !== "" && help.responseId !== 0) {
      totinptary.push(help);
    }
    if (comfortable.subjectId !== 0 && comfortable.subResponseData !== "" && comfortable.responseId !== 0) {
      totinptary.push(comfortable);
    }
    if (comfortableFinancialAdvisor.subjectId !== 0 && comfortableFinancialAdvisor.subResponseData !== "" && comfortableFinancialAdvisor.responseId !== 0) {
      totinptary.push(comfortableFinancialAdvisor);
    }
    // totinptary.push(medicine);
    konsole.log("totinptarytotinptary", totinptary)
    // konsole.log(JSON.stringify(inputdata));
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "POST",
      $Service_Url.postaddusersubjectdata, // + "?userId=" + this.state.userId
      totinptary,
      (response) => {
        this.props.dispatchloader(false);
        // konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          this.handleClose();
          this.getsubjectForFormLabelId(this.state.userId);
          // alert("Saved Successfully");
          // this.props.handlenonretireproppopShow();
        } else {
          // alert(Msg.ErrorMsg);
          this.handleClose();
        }
      }
    );
  };

  handleUpdateSubmit = () => {
    let inputdata = JSON.parse(JSON.stringify(this.state));

    let dontFinancialAdvisor = {
      userSubjectDataId: this.state.dontFinancialAdvisor?.userSubjectDataId,
      subjectId: this.state.dontFinancialAdvisor?.subjectId,
      subResponseData: this.state.dontFinancialAdvisor?.subResponseData,
      responseId: this.state.dontFinancialAdvisor?.responseId,
      userId: this.state.userId,
    };

    let help = {
      userSubjectDataId: this.state?.help?.userSubjectDataId,
      subjectId: this.state?.help?.subjectId,
      subResponseData: this.state?.help?.subResponseData,
      responseId: this.state.help?.responseId,
      userId: this.state.userId,
    };

    let comfortable = {
      userSubjectDataId: this.state?.comfortable?.userSubjectDataId,
      subjectId: this.state?.comfortable?.subjectId,
      subResponseData: this.state.comfortable?.subResponseData,
      responseId: this.state.comfortable?.responseId,
      userId: this.state.userId,
    };

    let decision = {
      userSubjectDataId: this.state.decision?.userSubjectDataId,
      subjectId: this.state.decision?.subjectId,
      subResponseData: this.state.decision?.subResponseData,
      responseId: this.state.decision?.responseId,
      userId: this.state.userId,
    };
    let planner = {
      userSubjectDataId: this.state.planner?.userSubjectDataId,
      subjectId: this.state.planner?.subjectId,
      subResponseData: this.state.planner?.subResponseData,
      responseId: this.state.planner?.responseId,
      userId: this.state.userId,
    };
    let current = {
      userSubjectDataId: this.state.current?.userSubjectDataId,
      subjectId: this.state.current?.subjectId,
      subResponseData: this.state.current?.subResponseData,
      responseId: this.state.current?.responseId,
      userId: this.state.userId,
    };
    let adequacy = {
      userSubjectDataId: this.state.adequacy?.userSubjectDataId,
      subjectId: this.state.adequacy?.subjectId,
      subResponseData: this.state.adequacy?.subResponseData,
      responseId: this.state.adequacy?.responseId,
      userId: this.state.userId,
    };
    let investment = {
      userSubjectDataId: this.state.investment?.userSubjectDataId,
      subjectId: this.state.investment?.subjectId,
      subResponseData: this.state.investment?.subResponseData,
      responseId: this.state.investment?.responseId,
      userId: this.state.userId,
    };

    let comfortableFinancialAdvisor = {
      userSubjectDataId: this.state.comfortableFinancialAdvisor?.userSubjectDataId,
      subjectId: this.state.comfortableFinancialAdvisor?.subjectId,
      subResponseData: this.state.comfortableFinancialAdvisor?.subResponseData,
      responseId: this.state.comfortableFinancialAdvisor?.responseId,
      userId: this.state.userId,
    };



    let totinptary = [];
    if (dontFinancialAdvisor.subjectId !== 0 && dontFinancialAdvisor.subResponseData !== "" && dontFinancialAdvisor.responseId !== 0) {
      totinptary.push(dontFinancialAdvisor);
    }
    if (planner.subjectId !== 0 && planner.subResponseData !== "" && planner.responseId !== 0) {
      totinptary.push(planner);
    }
    if (current.subjectId !== 0 && current.subResponseData !== "" && current.responseId !== 0) {
      totinptary.push(current);
    }
    if (adequacy.subjectId !== 0 && adequacy.subResponseData !== "" && adequacy.responseId !== 0) {
      totinptary.push(adequacy);
    }
    if (investment.subjectId !== 0 && investment.subResponseData !== "" && investment.responseId !== 0) {
      totinptary.push(investment);
    }
    if (decision.subjectId !== 0 && decision.subResponseData !== "" && decision.responseId !== 0) {
      totinptary.push(decision);
    }
    if (help.subjectId !== 0 && help.subResponseData !== "" && help.responseId !== 0) {
      totinptary.push(help);
    }
    if (comfortable.subjectId !== 0 && comfortable.subResponseData !== "" && comfortable.responseId !== 0) {
      totinptary.push(comfortable);
    }
    if (comfortableFinancialAdvisor.subjectId !== 0 && comfortableFinancialAdvisor.subResponseData !== "" && comfortableFinancialAdvisor.responseId !== 0) {
      totinptary.push(comfortableFinancialAdvisor);
    }


    let updatePostData = {
      userId: this.state.userId,
      userSubjects: totinptary
    }

    konsole.log("updatePostDataupdatePostDataa", updatePostData)
    // totinptary.push(medicine);

    // konsole.log(JSON.stringify(inputdata));
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi( "PUT", $Service_Url.putSubjectResponse, updatePostData, (response) => {
      this.props.dispatchloader(false);
      if (response) {
        konsole.log(this.state.userId,"this.state.userId")
        this.getsubjectForFormLabelId(this.state.userId);
        this.handleClose();
      } else {
        this.handleClose();
      }
    }
    );
  }


  getsubjectForFormLabelId = (newuserid) => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, financialAdvisorMoreInfo, (response) => {
      if (response) {
        konsole.log("datashownatcaregiver formlabelData finance", newuserid,formlabelData);
        for (let obj of response.data.data) {
          let label = "label" + obj.formLabelId;
          formlabelData[label] = obj.question;
          $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, "", (response) => {
            if (response) {
              if (response.data.data.userSubjects.length !== 0) {
                this.setState({
                  updateCaregiverSuitabilty: true,
                })
                let responseData = response.data.data.userSubjects[0];
                this.props.dispatchloader(true);
                for (let i = 0; i < formlabelData[label].response.length; i++) {
                  if (formlabelData[label].response[i].responseId === responseData.responseId) {
                    formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                    this.props.dispatchloader(false);
                    if (responseData.responseNature == "Radio") {
                      formlabelData[label].response[i]["checked"] = true;
                      if(responseData.responseId === 145){
                        this.setState({ currentState: "No"})
                      }
                      if(responseData.responseId == 140){
                        konsole.log(responseData,"responseData")
                        this.setState({showquestionforspouse: false,showquestionforprimary:true})
                      }
                      if(responseData.responseId == 139){
                        konsole.log(responseData,"responseData")
                        this.setState({showquestionforprimary: false, showquestionforspouse:true})
                      }
                    }
                    else if (responseData.responseNature == "Text") {
                      formlabelData[label].response[i]["response"] = responseData.response;
                    }
                    else if (responseData.responseNature == "CheckBox") { 
                      this.setState({restrictAddProfessional: responseData.response});
                    }
                  }
                }
                this.setState({ formlabelData: formlabelData });
              }
              this.props.dispatchloader(false);
            }
          })
          this.setState({ formlabelData: formlabelData });
        }
      } else {
        // alert( Msg.ErrorMsg );
        this.toasterAlert(Msg.ErrorMsg, "Warning")
      }
    }
    );
  };

  // FetchFamilyMembers = (userid) => {
  //   userid = userid || this.state.userId;
  //   this.props.dispatchloader(true);
  //   $CommonServiceFn.InvokeCommonApi(
  //     "GET",
  //     $Service_Url.getFamilyMembers + userid,
  //     "",
  //     (response) => {
  //       konsole.log("Success res" + JSON.stringify(response));
  //       konsole.log("FetchFamilyMemberDetaild",response.data.data,JSON.stringify(response.data.data.filter((v, j) => v.relationshipTypeId == 1   )));
  //       this.props.dispatchloader(false);
  //       if (response) {
  //         this.setState({ ...this.state, AllFamilyMembers: response.data.data,});
  //         this.setState({ SpouseDetails: response.data.data.filter((v, j) => v.relationshipTypeId == 1   ), });
  //         this.setState({   ChildDetails: response.data.data.filter( (v, j) => v.relationshipTypeId == 2   ),});
  //       } else {
  //         this.toasterAlert(Msg.ErrorMsg, "Warning")
  //       }
  //     }
  //   );
  // };

  FetchFamilyMembersUsingParentId = (userid) => {
    userid = userid || this.state.userId;
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getFamilybyParentID + userid, "", (response,err) => {
      konsole.log("getFamilybyParentID",response)
        if (response) {
        if( response.data.data[0].maritalStatusId == 1 ||  response.data.data[0].maritalStatusId == 2 && response.data.data[0].children.length !== 0){
            let spousedetails = response?.data?.data[0].children;
          this.setState({SpouseDetails:spousedetails})
          konsole.log('getFamilybyParentID',spousedetails)
          }
          // let spouseDetails=response.data?.data[0].children;
      }else{
        konsole.log('getFamilybyParentID',err)
          this.toasterAlert(Msg.ErrorMsg, "Warning")
        }
      }
    );
  };


  fetchmemberbyID = (userid) => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getFamilyMemberbyID + userid,
      "",
      (response) => {
        if (response) {
          this.setState({
            userId: response.data.data.member.userId,
            fName: response.data.data.member.fName,
          });
        }
      }
    );
  };

  toasterAlert(text, type) {
    this.context.setdata({
      open: true,
      text: text,
      type: type
    })
  }


  handleChangeCheckbox = (event) => {
    if(this.props.financMoreInfocheckboxdisable==true){
      this.toasterAlert('Financial Advisor already available.','Warning')
      return;
    }
    const eventId = event.target.id;
    const questionId = event.target.getAttribute("data-questionId");
    const userSubjectDataId = event.target.getAttribute("data-userSubjectDataId");
    const eventChecked = event.target.checked;
    konsole.log("usersubjectCheckbox", userSubjectDataId, eventChecked, eventId, questionId)
    this.handleUpdateSubmitSeconde(userSubjectDataId, eventChecked, eventId, questionId);
  };

  handleUpdateSubmitSeconde = async (userSubjectDataId, subResponseData, responseId, questionId) => {
    let inputData = {
      userId: this.newuserid,
      userSubjects: [{
        userSubjectDataId: userSubjectDataId,
        subjectId: questionId,
        subResponseData: subResponseData,
        responseId: responseId,
      }],
    };

    konsole.log("bookkeeeper response json", inputData);
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi( "PUT", $Service_Url.putSubjectResponse, inputData, (response, error) => {
      this.props.dispatchloader(false);
      konsole.log(this.state.userId,"this.state.userId2")
      this.getsubjectForFormLabelId(this.newuserid)
    }
    );
  };



  render() {
    // konsole.log("SpouseDetailsSpouseDetails",this.state.SpouseDetails)
    konsole.log("responsed advisor", this.state, this.props );
    // konsole.log("financMoreInfocheckboxdisablea", this.props.financMoreInfocheckboxdisable)
    // konsole.log("updatePostDataupdatePostData", this.state.formlabelData)
    // konsole.log("SpouseDetailsSpouseDetails", this.state.SpouseDetails.length)
    // konsole.log("hisstateformlabelDatalabel576", this.state.formlabelData.label576)
    let formlabelDatalabel576 = this.state.formlabelData?.label576?.response
    if (this.state.SpouseDetails?.length == 0) {
      formlabelDatalabel576 = this.state.formlabelData?.label576?.response?.filter((item) => item?.responseId !== 140 && item?.responseId !== 141)
    }
    // konsole.log("formlabelDatalabel576formlabelDatalabel576",formlabelDatalabel576)

    // konsole.log("filterdatafilterdatafilterdata")
    console.log("spouseUserId",this.state.spouseUserId)
    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.5 !important;
          }
        `}</style>

        <Form.Check className="ms-2" type="checkbox" name="dontFinancialAdvisor"
        //  disabled={this.props.financMoreInfocheckboxdisable}
          onChange = {(e)=>(this.state.restrictAddProfessional === "false") ? this.handleChange(e): this.handleChangeCheckbox(e)} data-userSubjectDataId = {this.state.formlabelData?.label994?.userSubjectDataId ?? 0} data-questionId = "198" id="388" checked={this.state.restrictAddProfessional === "true"}/>

        <Modal
          show={this.state.show}
          size="lg"
          centered
          onHide={this.handleClose}
          animation="false"
          id="financialMoreInfo"
          backdrop="static"
        // width={900}
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>More Info </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-5 pt-4" >
            <Form.Group as={Row} className="mb-3">
              <Row className="flex-column">
                {(isNotValidNullUndefile(this.state.spouseUserId) && this.state.spouseUserId !='null'  ) && 
                <Col xs sm="12" lg="12" id="financialMoreInfo1">
                  <p>
                    {this.state.formlabelData.label576 &&
                      this.state.formlabelData.label576.question}{" "}
                  </p>
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    {/* <Form.Check
                    className="chekspace"
                    type="radio"
                    name="decision"
                    id="client"
                    label={this.state.fName}
                    onChange={(e)=>this.handleChange(e)}
                  /> */}
                    {/* {this.state.SpouseDetails &&
                    this.state.SpouseDetails.map((item, index) => {
                      return (
                        <>
                          <Form.Check
                            className="chekspace"
                            type="radio"
                            name="decision"
                            id="spouse"
                            label={item.fName}
                            onChange={(e)=>this.handleChange(e)}
                          />
                        </>
                      );
                    })} */}
                    <div className="d-flex align-items-center justify-content-start mt-1">
                      {this.state.formlabelData.label576 &&
                        formlabelDatalabel576?.map(
                          (response) => {
                            konsole.log("responsetresponse", response)
                            return (
                              <>

                                <Form.Check
                                  inline
                                  className="left-radio"
                                  type="radio"

                                  name="decision"
                                  label={(response.responseId == 139) ? this.state.fName : (response.responseId == 140) ? this.state?.SpouseDetails[0]?.fName : response?.responseId == 456 ? 'Separately' : "Joint"}
                                  value={response.response}
                                  id={response.responseId}
                                  onChange={(e) => this.handleChange(e)}
                                  defaultChecked={response.checked}
                                />
                              </>
                            );
                          }
                        )}
                    </div>

                    {/* <Form.Check
                    className="chekspace"
                    type="radio"
                    name="decision"
                    label="joint"
                    id="joint"
                    onChange={(e)=>this.handleChange(e)}
                  /> */}
                  </div>
                </Col>}
               { (this.state.showquestionforprimary) && <Col xs sm="12" lg="12" id="financialMoreInfo2 " className="mt-2">
                  <p>
                    {" "}
                    Is {this.state.fName} comfortable making these decisions
                    without help?
                  </p>
                  <div className="d-flex align-items-center justify-content-start mt-1">
                    {this.state.formlabelData.label581 &&
                      this.state.formlabelData.label581.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"

                                name="help"
                                label={response.response}
                                value={response.response}
                                id={response.responseId}
                                onChange={(e) => this.handleChange(e)}
                                defaultChecked={response.checked}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>}
                {konsole.log(this.state?.formlabelData?.label582 && this.state.formlabelData.label582,this.state.showquestionforprimary,this.state.showquestionforprimary,this.state.decision.responseId ,"formlabelDatalabel576formlabelDatalabel576")}
                {(this.state.SpouseDetails.length > 0) && (this.state.showquestionforspouse) &&
                <Col xs sm="12" lg="12" id="financialMoreInfo4" className="mt-2">
                  <p>
                    {/* Is {this.state.SpouseDetails.map(item => item.fName)} comfortable making these decisions without help? */}
                    Is {this.state.SpouseDetails[0].fName} comfortable making these decisions without help?
                  </p>
                  <div className="d-flex align-items-center justify-content-start mt-1">
                    {this.state.formlabelData.label582 &&
                      this.state.formlabelData.label582.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                value={response.response}
                                id={response.responseId}
                                onChange={(e) => this.handleChange(e)}
                                name="comfortable"
                                label={response.response}
                                defaultChecked={response.checked}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              }
              </Row>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col xs sm="12" lg="12" id="financialMoreInfo3">
                <p>
                  {this.state.formlabelData.label577 &&
                    this.state.formlabelData.label577.question}
                </p>
                <div className="d-flex align-items-center justify-content-start mt-1">
                  {this.state.formlabelData.label577 &&
                    this.state.formlabelData.label577.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Check
                              inline
                              className="left-radio"
                              type="radio"
                              value={response.response}
                              id={response.responseId}
                              onChange={(e) => this.handleChange(e)}
                              name="planner"
                              label={response.response}
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
              <Col xs sm="12" lg="12" id="financialMoreInfo5" className="">
                <p>
                  {this.state.formlabelData.label578 &&
                    this.state.formlabelData.label578.question}{" "}
                </p>
                <div className="d-flex align-items-center justify-content-start mt-1">
                  {this.state.formlabelData.label578 &&
                    this.state.formlabelData.label578.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Check
                              inline
                              className="left-radio"
                              type="radio"
                              value={response.response}
                              id={response.responseId}
                              onChange={(e) => this.handleChange(e)}
                              name="current"
                              label={response.response}
                              defaultChecked={response.checked}
                            />
                          </>
                        );
                      }
                    )}
                </div>
              </Col>
              {this.state.currentState == "No" &&
                <Col xs sm="12" lg="12" className="mt-4">
                  {this.state.formlabelData.label1001 &&
                      this.state.formlabelData.label1001.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Control
                                required
                                type="text"
                                name="comfortableFinancialAdvisor"
                                placeholder="Please Explain"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                className="w-100"
                                id={response.responseId}
                                defaultValue={response.response}
                              />
                            </>
                          );
                        }
                      )}
                </Col>
              }
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Col xs sm="12" lg="12" id="financialMoreInfo6" className="mt-2">
                <p>
                  {this.state.formlabelData.label579 &&
                    this.state.formlabelData.label579.question}{" "}
                </p>
                <div className="d-flex align-items-center justify-content-start mt-1">
                  {this.state.formlabelData.label579 &&
                    this.state.formlabelData.label579.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Check
                              inline
                              className="left-radio"
                              type="radio"
                              value={response.response}
                              id={response.responseId}
                              onChange={(e) => this.handleChange(e)}
                              name="adequacy"
                              label={response.response}
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
              <Col xs sm="12" lg="12" id="financialMoreInfo7">
                <p>
                  {this.state.formlabelData.label580 &&
                    this.state.formlabelData.label580.question}{" "}
                </p>
                <div className="d-flex align-items-center justify-content-start mt-1">
                  {this.state.formlabelData.label580 &&
                    this.state.formlabelData.label580.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Check
                              inline
                              className="left-radio"
                              type="radio"
                              value={response.response}
                              id={response.responseId}
                              onChange={(e) => this.handleChange(e)}
                              name="investment"
                              label={response.response}
                              defaultChecked={response.checked}
                            />
                          </>
                        );
                      }
                    )}
                </div>
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button className="theme-btn" onClick={this.handleUpdateSubmit}>
              Save
            </Button>
          </Modal.Footer>
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
)(FinancialAdvisorMoreInfo);
