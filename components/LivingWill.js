import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Card, Nav, Dropdown, Collapse, Breadcrumb } from "react-bootstrap";
import { $CommonServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import { livingWill } from "./control/Constant";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";
import { $AHelper } from "./control/AHelper";





export class LivingWill extends Component {
  static contextType = globalContext;
  constructor(props,context) {
    super(props);
    this.state = {
      show: false,
      initialShow: true,
      formlabelData: [],
      formlabelDataSpouse: [],
      SpouseDetailsUserId: "",
      disable:false,
      // updateCaregiverSuitabilty: false,
      // formlabelData: {},
      updatePrimaryMetaData: false,
      updateSpouseMetaData: false,
      primarymemberDetails: {},
      maxpResponseId: 0,
      maxsResponseId: 0,
      lifepValue: {
        responseId: 0,
        disable: false,
      },
      lifesValue: {
        responseId: 0,
        disable: false,
      },
      maxp: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      maxs: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      lifep: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      lifes: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      funeral1: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      funeral2: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },

      cpr1: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      cpr2: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      hydration1: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      hydration2: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      nutrition1: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      nutrition2: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      Antibiotic1: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      Antibiotic2: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      heroic1: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      heroic2: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
    };
  }

  handleClose = () => {
    this.context.setPageTypeId(null)
    this.setState({
      show: false,
    });
  };

  handleShow = () => {
    this.context.setPageTypeId(35)
    this.setState({
      show: true,
    });
  };

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId");
    let spouseDetailsUserId = sessionStorage.getItem("spouseUserId");
    let primarymemberDetails = JSON.parse(sessionStorage?.getItem("userDetailOfPrimary"))
    konsole.log("newuseridSESSION", newuserid)
    konsole.log("spouseDetailsUserIdSESSION", spouseDetailsUserId)
    this.setState({
      userId: newuserid,
      SpouseDetailsUserId: spouseDetailsUserId,
      primarymemberDetails: primarymemberDetails
    })
    // this.getsubjectForFormLabelId(newuserid,spouseDetailsUserId);
    // this.getsubjectForFormLabelIdPrimary(newuserid);
    // if (spouseDetailsUserId !== "null") {
    //   this.getsubjectForFormLabelIdSpouse(spouseDetailsUserId);
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.show != true && this.state.show == true && this.state.initialShow == true) {
      this.setState({initialShow: false})
      this.getsubjectForFormLabelIdPrimary(this.state.userId);
      if (this.state.SpouseDetailsUserId !== "null") {
        this.getsubjectForFormLabelIdSpouse(this.state.SpouseDetailsUserId);
      }
    }
  }

  handleChange = (e) => {
    const eventId = e.target.id;
    const eventValue = e.target.value;
    const eventName = e.target.name;

    if (eventName == "maxp") {
      const donor1Value = (eventId == "90") ? { responseId: 93, disable: true, } : { responseId: 92, disable: true, }
      const lifep = (eventId == "90") ? {

        userSubjectDataId: this.state.formlabelData.label453 ? this.state.formlabelData.label453?.userSubjectDataId : 0,
        responseId: 93,
        subResponseData: "No",
        subjectId:
          this.state.formlabelData.label453 &&
          this.state.formlabelData.label453.questionId,
      } : {
        userSubjectDataId: this.state.formlabelData.label453?.userSubjectDataId !== undefined ? this.state.formlabelData.label453.userSubjectDataId : 0,
        responseId: 92,
        subResponseData: "Yes",
        subjectId:
          this.state.formlabelData.label453 &&
          this.state.formlabelData.label453.questionId,
      };

      this.setState({
        ...this.state,
        lifepValue: donor1Value,
        maxpResponseId: eventId,
        lifep: lifep,
        maxp: {
          userSubjectDataId: this.state.formlabelData.label452 ? this.state.formlabelData.label452.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label452 &&
            this.state.formlabelData.label452.questionId
        }

      })
    }
    else if (eventName == "maxs") {

      const donor1Value = (eventId == "90") ? { responseId: 93, disable: true, } : { responseId: 92, disable: true, }
      const lifes = (eventId == "90") ? {

        userSubjectDataId: this.state.formlabelDataSpouse.label453 ? this.state.formlabelDataSpouse.label453.userSubjectDataId : 0,
        responseId: 93,
        subResponseData: "No",
        subjectId:
          this.state.formlabelDataSpouse.label453 &&
          this.state.formlabelDataSpouse.label453.questionId,
      } : {
        userSubjectDataId: this.state.formlabelDataSpouse.label453 ? this.state.formlabelDataSpouse.label453.userSubjectDataId : 0,
        responseId: 92,
        subResponseData: "Yes",
        subjectId:
          this.state.formlabelDataSpouse.label453 &&
          this.state.formlabelDataSpouse.label453.questionId,
      };
      this.setState({
        ...this.state,
        maxsResponseId: eventId,
        lifesValue: donor1Value,
        lifes: lifes,
        maxs: {
          userSubjectDataId: this.state.formlabelDataSpouse.label452 ? this.state.formlabelDataSpouse.label452.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label452 &&
            this.state.formlabelData.label452.questionId
        }

      })
    } else if (eventName == "lifep") {
      const donor1Value = { responseId: eventId, disable: false }

      this.setState({
        ...this.state,
        lifepValue: donor1Value,
        lifep: {
          userSubjectDataId: this.state.formlabelData.label453 ? this.state.formlabelData.label453.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label453 &&
            this.state.formlabelData.label453.questionId,
        }
      })

    }

    else if (eventName == "lifes") {
      const donor1Value = { responseId: eventId, disable: false }

      this.setState({
        ...this.state,
        lifesValue: donor1Value,
        lifes: {
          userSubjectDataId: this.state.formlabelDataSpouse.label453 ? this.state.formlabelDataSpouse.label453.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label453 &&
            this.state.formlabelData.label453.questionId,
        }
      })

    }
    else if (eventName == "funeral1") {

      this.setState({
        ...this.state,
        funeral1: {

          userSubjectDataId: this.state.formlabelData.label462 ? this.state.formlabelData.label462.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label462 &&
            this.state.formlabelData.label462.questionId,
        }
      })

    }
    else if (eventName == "funeral2") {

      this.setState({
        ...this.state,
        funeral2: {

          userSubjectDataId: this.state.formlabelDataSpouse.label462 ? this.state.formlabelDataSpouse.label462.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label462 &&
            this.state.formlabelData.label462.questionId,
        }
      })

    }
    else if (eventName == "cpr1") {

      this.setState({
        ...this.state,
        cpr1: {

          userSubjectDataId: this.state.formlabelData.label454 ? this.state.formlabelData.label454.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label454 &&
            this.state.formlabelData.label454.questionId,
        }
      })

    }

    else if (eventName == "cpr2") {

      this.setState({
        ...this.state,
        cpr2: {

          userSubjectDataId: this.state.formlabelDataSpouse.label454 ? this.state.formlabelDataSpouse.label454.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label454 &&
            this.state.formlabelData.label454.questionId,
        }
      })

    }

    else if (eventName == "hydration1") {

      this.setState({
        ...this.state,
        hydration1: {

          userSubjectDataId: this.state.formlabelData.label455 ? this.state.formlabelData.label455.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label455 &&
            this.state.formlabelData.label455.questionId,
        }
      })

    }

    else if (eventName == "hydration2") {

      this.setState({
        ...this.state,
        hydration2: {

          userSubjectDataId: this.state.formlabelDataSpouse.label455 ? this.state.formlabelDataSpouse.label455.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label455 &&
            this.state.formlabelData.label455.questionId,
        }
      })

    }

    else if (eventName == "nutrition1") {

      this.setState({
        ...this.state,
        nutrition1: {

          userSubjectDataId: this.state.formlabelData.label456 ? this.state.formlabelData.label456.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label456 &&
            this.state.formlabelData.label456.questionId,
        }
      })

    }

    else if (eventName == "nutrition2") {

      this.setState({
        ...this.state,
        nutrition2: {

          userSubjectDataId: this.state.formlabelDataSpouse.label456 ? this.state.formlabelDataSpouse.label456.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label456 &&
            this.state.formlabelData.label456.questionId,
        }
      })

    }

    else if (eventName == "Antibiotic1") {

      this.setState({
        ...this.state,
        Antibiotic1: {

          userSubjectDataId: this.state.formlabelData.label457 ? this.state.formlabelData.label457.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label457 &&
            this.state.formlabelData.label457.questionId,
        }
      })

    }

    else if (eventName == "Antibiotic2") {

      this.setState({
        ...this.state,
        Antibiotic2: {

          userSubjectDataId: this.state.formlabelDataSpouse.label457 ? this.state.formlabelDataSpouse.label457.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label457 &&
            this.state.formlabelData.label457.questionId,
        }
      })

    }

    else if (eventName == "heroic1") {

      this.setState({
        ...this.state,
        heroic1: {

          userSubjectDataId: this.state.formlabelData.label458 ? this.state.formlabelData.label458.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label458 &&
            this.state.formlabelData.label458.questionId,
        }
      })

    }

    else if (eventName == "heroic2") {

      this.setState({
        ...this.state,
        heroic2: {

          userSubjectDataId: this.state.formlabelDataSpouse.label458 ? this.state.formlabelDataSpouse.label458.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label458 &&
            this.state.formlabelData.label458.questionId,
        }
      })

    }

  };


  handlesubmit = () => {

   
    // let inputdata = JSON.parse(JSON.stringify(this.state));

    let maxp = this.state.maxp;
    let maxs = this.state.maxs;
    let lifep = this.state.lifep
    let lifes = this.state.lifes
    let funeral1 = this.state.funeral1
    let funeral2 = this.state.funeral2
    let cpr1 = this.state.cpr1;
    let cpr2 = this.state.cpr2;
    let hydration1 = this.state.hydration1;
    let hydration2 = this.state.hydration2;
    let nutrition1 = this.state.nutrition1;
    let nutrition2 = this.state.nutrition2;
    let Antibiotic1 = this.state.Antibiotic1;
    let Antibiotic2 = this.state.Antibiotic2;
    let heroic1 = this.state.heroic1;
    let heroic2 = this.state.heroic2;

    if (!this.state.SpouseDetailsUserId !== "null") {
      maxp["userId"] = this.state.userId;
      maxs["userId"] = this.state.SpouseDetailsUserId;
      lifep["userId"] = this.state.userId;
      lifes["userId"] = this.state.SpouseDetailsUserId;
      funeral1["userId"] = this.state.userId;
      funeral2["userId"] = this.state.SpouseDetailsUserId
      cpr1["userId"] = this.state.userId;
      cpr2["userId"] = this.state.SpouseDetailsUserId;
      hydration2["userId"] = this.state.SpouseDetailsUserId;
      nutrition2["userId"] = this.state.SpouseDetailsUserId;
      nutrition1["userId"] = this.state.userId;
      Antibiotic1["userId"] = this.state.userId;
      hydration1["userId"] = this.state.userId;
      heroic1["userId"] = this.state.userId;
      Antibiotic2["userId"] = this.state.SpouseDetailsUserId;
      heroic2["userId"] = this.state.SpouseDetailsUserId;
    }


    let totoalinptary = [];
    let totinptary = [];

    if (this.state.SpouseDetailsUserId !== "null") {
      // totinptary.push(maxp);
      // totoalinptary.push(maxs);
      // totinptary.push(lifep);
      // totoalinptary.push(lifes);
      // totinptary.push(funeral1);
      // totoalinptary.push(funeral2);
      // totinptary.push(cpr1);
      // totoalinptary.push(cpr2);
      // totinptary.push(hydration1);
      // totoalinptary.push(hydration2);
      // totinptary.push(nutrition1);
      // totoalinptary.push(nutrition2);
      // totinptary.push(Antibiotic1);
      // totoalinptary.push(Antibiotic2);
      // totinptary.push(heroic1);
      // totoalinptary.push(heroic2);
      if (maxp.subjectId !== 0 && maxp.subResponseData !== "" && maxp.responseId !== 0) {
        totinptary.push(maxp);
      }
      if (maxs.subjectId !== 0 && maxs.subResponseData !== "" && maxs.responseId !== 0) {
        totoalinptary.push(maxs);
      }
      if (lifep.subjectId !== 0 && lifep.subResponseData !== "" && lifep.responseId !== 0) {
        totinptary.push(lifep);
      }
      if (lifes.subjectId !== 0 && lifes.subResponseData !== "" && lifes.responseId !== 0) {
        totoalinptary.push(lifes);
      }
      if (funeral1.subjectId !== 0 && funeral1.subResponseData !== "" && funeral1.responseId !== 0) {
        totinptary.push(funeral1);
      }
      if (funeral2.subjectId !== 0 && funeral2.subResponseData !== "" && funeral2.responseId !== 0) {
        totoalinptary.push(funeral2);
      }
      if (cpr1.subjectId !== 0 && cpr1.subResponseData !== "" && cpr1.responseId !== 0) {
        totinptary.push(cpr1);
      }
      if (cpr2.subjectId !== 0 && cpr2.subResponseData !== "" && cpr2.responseId !== 0) {
        totoalinptary.push(cpr2);
      }
      if (hydration1.subjectId !== 0 && hydration1.subResponseData !== "" && hydration1.responseId !== 0) {
        totinptary.push(hydration1);
      }
      if (hydration2.subjectId !== 0 && hydration2.subResponseData !== "" && hydration2.responseId !== 0) {
        totoalinptary.push(hydration2);
      }
      if (nutrition1.subjectId !== 0 && nutrition1.subResponseData !== "" && nutrition1.responseId !== 0) {
        totinptary.push(nutrition1);
      }
      if (nutrition2.subjectId !== 0 && nutrition2.subResponseData !== "" && nutrition2.responseId !== 0) {
        totoalinptary.push(nutrition2);
      }
      if (Antibiotic1.subjectId !== 0 && Antibiotic1.subResponseData !== "" && Antibiotic1.responseId !== 0) {
        totinptary.push(Antibiotic1);
      }
      if (Antibiotic2.subjectId !== 0 && Antibiotic2.subResponseData !== "" && Antibiotic2.responseId !== 0) {
        totoalinptary.push(Antibiotic2);
      }
      if (heroic1.subjectId !== 0 && heroic1.subResponseData !== "" && heroic1.responseId !== 0) {
        totinptary.push(heroic1);
      }
      if (heroic2.subjectId !== 0 && heroic2.subResponseData !== "" && heroic2.responseId !== 0) {
        totoalinptary.push(heroic2);
      }
    }
    else {
      if (maxp.subjectId !== 0 && maxp.subResponseData !== "" && maxp.responseId !== 0) {
        totinptary.push(maxp);
      }

      if (lifep.subjectId !== 0 && lifep.subResponseData !== "" && lifep.responseId !== 0) {
        totinptary.push(lifep);
      }

      if (funeral1.subjectId !== 0 && funeral1.subResponseData !== "" && funeral1.responseId !== 0) {
        totinptary.push(funeral1);
      }

      if (cpr1.subjectId !== 0 && cpr1.subResponseData !== "" && cpr1.responseId !== 0) {
        totinptary.push(cpr1);
      }

      if (hydration1.subjectId !== 0 && hydration1.subResponseData !== "" && hydration1.responseId !== 0) {
        totinptary.push(hydration1);
      }

      if (nutrition1.subjectId !== 0 && nutrition1.subResponseData !== "" && nutrition1.responseId !== 0) {
        totinptary.push(nutrition1);
      }

      if (Antibiotic1.subjectId !== 0 && Antibiotic1.subResponseData !== "" && Antibiotic1.responseId !== 0) {
        totinptary.push(Antibiotic1);
      }

      if (heroic1.subjectId !== 0 && heroic1.subResponseData !== "" && heroic1.responseId !== 0) {
        totinptary.push(heroic1);
      }
    }
    if (this.state.SpouseDetailsUserId !== "null") {
      if (
        this.state.updatePrimaryMetaData == true &&
        this.state.updateSpouseMetaData == true
      ) {

        this.handleUpdateSubmit(totinptary, this.state.userId);
        this.handleUpdateSubmit(totoalinptary, this.state.SpouseDetailsUserId, "TostertwiceUpdate");
      } else if (
        this.state.updatePrimaryMetaData == true &&
        this.state.updateSpouseMetaData == false
      ) {
        this.handleUpdateSubmit(totinptary, this.state.userId, "TostertwiceUpdate");
        this.handleasdSubmit(totoalinptary, this.state.SpouseDetailsUserId, "");


      } else if (
        this.state.updateSpouseMetaData == true &&
        this.state.updatePrimaryMetaData == false
      ) {
        this.handleUpdateSubmit(totinptary, this.state.SpouseDetailsUserId, "TostertwiceUpdate");


      } else if (
        this.state.updateSpouseMetaData == false &&
        this.state.updatePrimaryMetaData == false
      ) {
        this.handleasdSubmit(totinptary, this.state.userId);
        this.handleasdSubmit(totoalinptary, this.state.SpouseDetailsUserId, "TostertwiceSubmited");


      }
    } else {
      if (this.state.updatePrimaryMetaData == true) {
        this.handleUpdateSubmit(totinptary, this.state.userId, "TostertwiceUpdate");


      } else if (this.state.updatePrimaryMetaData == false) {
        this.handleasdSubmit(totinptary, this.state.userId, "TostertwiceSubmited");
      }
    }
  };

  handleasdSubmit = (totoalinptary, consumerId, iddatata) => {
    konsole.log("totoalinptaryASsUbMIT", totoalinptary)
    konsole.log("consumerIdASsUbMIT", consumerId)
    this.setState({disable:true})
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.postaddusersubjectdata,totoalinptary,(response) => {
        this.props.dispatchloader(false);
        this.setState({disable:false})
        konsole.log("Success res submit" + JSON.stringify(response));
        if (response) {
          if (iddatata == "TostertwiceSubmited") {
            AlertToaster.success("Data saved successfully");
            this.handleClose();
          }
          if (consumerId == this.state.userId) {
            this.getsubjectForFormLabelIdPrimary(this.state.userId);
          }
          if (consumerId == this.state.SpouseDetailsUserId) {
            this.getsubjectForFormLabelIdSpouse(this.state.SpouseDetailsUserId);
          }
        } else {
          // alert(Msg.ErrorMsg);
          this.handleClose();
          this.setState({disable:false})
        }
      }
    );
  };

  handleUpdateSubmit = (totinptary, consumerId, iddddd) => {
    konsole.log("iddddddddddddd", iddddd)
    let postData = {
      userId: consumerId,
      userSubjects: totinptary
    }
    // this.state.disable=true
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "PUT",
      $Service_Url.putSubjectResponse, // + "?userId=" + this.state.userId
      postData,
      (response) => {
        this.setState({disable: false})
        konsole.log("postData", postData)
        this.props.dispatchloader(false);
        konsole.log("Success res update" + JSON.stringify(response));
        if (response) {
          if (iddddd == "TostertwiceUpdate") {
            AlertToaster.success("Data updated successfully");

          }
          if (consumerId == this.state.userId) {
            this.getsubjectForFormLabelIdPrimary(this.state.userId);
          }
          if (consumerId == this.state.SpouseDetailsUserId) {
            this.getsubjectForFormLabelIdSpouse(this.state.SpouseDetailsUserId);
          }
          this.handleClose();
          this.setState({disable:false})
        } else {
          this.handleClose();
          this.setState({disable:false})
        }
      }
    );
  };





  getsubjectForFormLabelIdPrimary = (newuserid) => {
    konsole.log("newuseridPrimaryForm", newuserid)
    let formlabelData = {};
    let formlabelDataSpouse = {};
    this.props.dispatchloader(true);
    // livingWill.formLabelId.map((id, index) => {
    //   let data = [id.id];

      $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, livingWill.formLabelId, (response) => {
        if (response) {
          this.props.dispatchloader(false);
          const resSubData = response.data.data;

          konsole.log("getsubjectForFormLabelIdPrimaryRESPONSE ewrwe", response.data.data)
          for (let resObj of resSubData) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = resObj.question;
            formlabelDataSpouse[label] = resObj.question;
            this.props.dispatchloader(true);
            $CommonServiceFn.InvokeCommonApi(
              "GET",
              $Service_Url.getSubjectResponse +
              newuserid +
              `/0/0/${formlabelData[label].questionId}`,
              "",
              (response) => {
                this.props.dispatchloader(false);
                if (response) {
                  if (response.data.data.userSubjects.length !== 0) {
                    this.setState({
                      updatePrimaryMetaData: true,
                    });
                    let responseData = response.data.data.userSubjects[0];
                    konsole.log("responseData show", responseData);
                    this.props.dispatchloader(true);
                    for (
                      let i = 0;
                      i < formlabelData[label].response.length;
                      i++
                    ) {
                      if (
                        formlabelData[label].response[i].responseId ===
                        responseData.responseId
                      ) {
                        if (responseData.responseNature == "Radio") {
                          formlabelData[label].response[i]["checked"] = true;
                          formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                          // if (responseData.questionId == 52) {
                          //   this.setState({
                          //     maxpResponseId: responseData.responseId
                          //   })
                          // }
                          if (responseData.questionId == 53) {
                            this.setState({
                              lifepValue: {
                                responseId: responseData.responseId,
                                disable: true
                              }
                            })
                          }
                        } else if (responseData.responseNature == "Text") {
                          formlabelData[label].response[i]["response"] =
                            responseData.response;
                          formlabelData[label]["userSubjectDataId"] =
                            responseData.userSubjectDataId;
                        }
                      }
                      if (formlabelData[label].response.length - 1 == i) {
                        this.props.dispatchloader(false);
                      }
                    }
                  }
                  this.props.dispatchloader(false);
                }
              }
            );
            this.setState({
              formlabelData: formlabelData,
            });
          }
        }
      }
      );
    // });
  };

  getsubjectForFormLabelIdSpouse = (spouseUserId) => {
    konsole.log("spouseUserIdSpouseForm", spouseUserId)

    let formlabelDataSpouse = {};
    this.props.dispatchloader(true);
    // livingWill.formLabelId.map((id, index) => {
    //   let data = [id.id];
      $CommonServiceFn.InvokeCommonApi(
        "POST",
        $Service_Url.getsubjectForFormLabelId,
        livingWill.formLabelId,
        (response) => {
          // konsole.log("getsubjectForFormLabelIdSpouseRESPONSE", response)
          if (response) {
            this.props.dispatchloader(false);
            const resSubData = response.data.data;

            for (let resObj of resSubData) {
              let label = "label" + resObj.formLabelId;
              formlabelDataSpouse[label] = resObj.question;
              this.props.dispatchloader(true);
              $CommonServiceFn.InvokeCommonApi(
                "GET",
                $Service_Url.getSubjectResponse +
                spouseUserId +
                `/0/0/${formlabelDataSpouse[label].questionId}`,
                "",
                (response) => {
                  this.props.dispatchloader(false);
                  if (response) {
                    if (response.data.data.userSubjects.length !== 0) {
                      this.setState({
                        updateSpouseMetaData: true,
                      });
                      let responseData = response.data.data.userSubjects[0];
                      konsole.log("getsubjectForFormLabelIdSpouseRESPONSE", responseData)
                      this.props.dispatchloader(true);
                      for (
                        let i = 0;
                        i < formlabelDataSpouse[label].response.length;
                        i++
                      ) {
                        if (
                          formlabelDataSpouse[label].response[i].responseId ===
                          responseData.responseId
                        ) {
                          if (responseData.responseNature == "Radio") {
                            formlabelDataSpouse[label].response[i][
                              "checked"
                            ] = true;
                            formlabelDataSpouse[label]["userSubjectDataId"] =
                              responseData.userSubjectDataId;
                            // if (responseData.questionId == 52) {
                            //   this.setState({
                            //     maxsResponseId: responseData.responseId
                            //   })
                            // }
                            if (responseData.questionId == 53) {
                              this.setState({
                                lifesValue: {
                                  responseId: responseData.responseId,
                                  disable: true
                                }
                              })
                            }
                          } else if (responseData.responseNature == "Text") {
                            formlabelDataSpouse[label].response[i]["response"] =
                              responseData.response;
                            formlabelDataSpouse[label]["userSubjectDataId"] =
                              responseData.userSubjectDataId;
                          }
                        }
                        if (
                          formlabelDataSpouse[label].response.length - 1 ==
                          i
                        ) {
                          this.props.dispatchloader(false);
                        }
                      }
                    }
                    this.props.dispatchloader(false);
                  }
                }
              );
              this.setState({
                formlabelDataSpouse: formlabelDataSpouse,
              });
            }
          } else {
            //   alert(Msg.ErrorMsg);
          }
        }
      );
    // });
  };

  render() {

    konsole.log("sdfghjskagjahgsyfgrwqetruy", this.state);
    return (
      <>
        {/* <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0;
          }
        `}</style> */}

        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            max-width: 54.25rem;
            margin: 1.75rem auto;
          }
        `}</style>


        <Card.Img variant="Top" className="" src="/icons/living will.svg" onClick={this.handleShow} style={{ width: "204px", height: "166px " }}/>
        <Card.Body className="p-0 mt-2 " style={{ width: "204px " }}>
          <a onClick={this.handleShow}>
            <div className="border d-flex justify-content-between align-items-center p-2 ">
              <p className="ms-2">Living Will Details</p>
              <div className="border-start">
                <img
                  className="px-2"
                  src="/icons/add-icon.svg"
                  alt="health Insurance"
                />
              </div>
            </div>
          </a>
        </Card.Body>

        <Modal show={this.state.show}enforceFocus={false}  size="lg" centered onHide={this.handleClose} animation="false" scrollable={true} backdrop="static">
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Living Will Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            <div className="border p-2">
              <Row className="mb-2">
                <Col sm="12">
                  <p className="text-center">
                    If you were diagnosed with terminal illness(no reasonal hope
                    for living more than 6 months)
                  </p>
                </Col>
                <Col sm='12'>
                  <p className="text-center">
                    <b>OR</b>
                  </p>
                </Col>
                <Col sm="12">
                  <p className="text-center">in a persistent vegetative state(comatose)</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="text-center">
                    <b>AND</b>
                  </p>
                </Col>
                <Col sm="12">
                  <p className="text-center">
                    Your loved ones concurred that there is no reasonable hope
                    of you getting better
                  </p>
                </Col>
              </Row>
              <Row>
                <Col sm='12'>
                  <p className="text-center">
                    Then:
                  </p>
                </Col>
                <Col sm='12'>
                  <p className="text-center">
                    What instructions do you want to give your loved ones with
                    regards to the use of artificial means of life support?
                  </p>
                </Col>
              </Row>
            </div>
            <Row className="mt-3" >
              <p  style={{fontSize:"14px", fontWeight:600}}>Please identify your choices for your living will.</p>
            </Row>
            {window.innerWidth > "575" ? (
            <Container className="border mt-2">
              <Row className="">

                <Col lg="12">
                  <Row>
                    {/* {this.state.SpouseDetailsUserId !== "null" ? <Col md="5" lg="5"></Col> : <Col md="7" lg="7"></Col>} */}
                    <Col xs="12" sm="12" md="5" lg="5"></Col>
                    <Col className="d-flex justify-content-center m-0 p-0 pt-2" >
                      {/* <b>Primary Member</b> */}
                      <b className={this.state.SpouseDetailsUserId === "null" ? "ms-4" : ""} >
                        {$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.memberName)}
                        {/* Sumit Kumar Agarwal */}
                      </b>
                    </Col>
                    <Col className="d-flex justify-content-center m-0 p-0 pt-2">
                      {this.state.SpouseDetailsUserId !== "null" &&
                        // <b>Spouse</b>
                        <b>{$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.spouseName)}</b>
                      }
                    </Col>
                  </Row>

                  <Row className="mt-4" >
                    <Col xs="12" sm="12" md="5" lg="5">
                      <b>
                        {this.state.formlabelData.label452 &&
                          this.state.formlabelData.label452.question}
                      </b>
                    </Col>

                    {this.state.formlabelData.label452 &&
                      this.state.formlabelData.label452.response.map((response) => {
                        return (
                          <>
                            <Col className="m-0 p-0 d-flex justify-content-center">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="maxp"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </Col>
                          </>
                        );
                      })}
                    {this.state.SpouseDetailsUserId === "null" ?
                      <Col md="5" lg="3">

                      </Col>
                      : ""}
                    {this.state.SpouseDetailsUserId !== "null" &&
                      this.state.formlabelDataSpouse.label452 &&
                      this.state.formlabelDataSpouse.label452.response.map((response) => {
                        return (
                          <>
                            <Col xs md="" className="m-0 p-0 d-flex justify-content-center">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="maxs"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </Col>
                          </>
                        );
                      })
                    }

                  </Row>

                  <Row className="mt-4">
                    <Col md="5" lg="5">
                      <b>
                        {this.state.formlabelData.label453 &&
                          this.state.formlabelData.label453.question}
                      </b>
                    </Col>
                    {this.state.formlabelData.label453 &&
                      this.state.formlabelData.label453.response.map((response) => {
                        return (
                          <>
                            <Col className="m-0 p-0 d-flex justify-content-center">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="lifep"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                checked={response.responseId == this.state.lifepValue?.responseId}
                                disabled={this.state.lifepValue?.disable}
                              />
                            </Col>
                          </>
                        );
                      })}
                    {this.state.SpouseDetailsUserId === "null" ?
                      <Col md="5" lg="3">

                      </Col>
                      : ""
                    }
                    {this.state.SpouseDetailsUserId !== "null" &&
                      this.state.formlabelDataSpouse.label453 &&
                      this.state.formlabelDataSpouse.label453.response.map((response) => {
                        return (
                          <>
                            <Col className="m-0 p-0 d-flex justify-content-center">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="lifes"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                checked={response.responseId == this.state.lifesValue?.responseId}
                                disabled={this.state.lifesValue?.disable}
                              />
                            </Col>
                          </>
                        );
                      })}

                  </Row>
                </Col>
                {/* <hr className="mt-3" /> */}
              </Row>
              <Row>
                <Col lg="12">
                  <hr className="mt-2" />
                </Col>
              </Row>

              {/* lkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj */}
              <Row className=" pb-2">
                <Col lg="12" >
                  <Row className=""  >
                    <Col md="5" lg="5" ></Col>

                    <Col className=" d-flex justify-content-center doWantSingleUser ">
                      Do Want
                    </Col>

                    <Col className=" d-flex justify-content-center doWantSingleUser ">
                      Don't Want
                    </Col>

                    {this.state.SpouseDetailsUserId === "null" ? <Col md="5" lg="3" ></Col> : ""}

                    {
                      this.state.SpouseDetailsUserId !== "null" &&
                      <>
                        <Col className=" d-flex justify-content-center doWantSingleUser ">Do Want </Col>
                        <Col className=" d-flex justify-content-center doWantSingleUser " >
                          Don't Want{" "}
                        </Col>
                      </>
                    }
                  </Row>
                  <Row className="mt-4">
                    <Col md="5" lg="5" >
                      {" "}
                      {this.state.formlabelData.label454 &&
                        this.state.formlabelData.label454.question}
                    </Col>
                    {
                      this.state.formlabelData.label454 &&
                      this.state.formlabelData.label454.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className="d-flex justify-content-center doWantSingleUserRadio">
                                <Form.Check
                                  inline
                                  label=""
                                  name="cpr1"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}

                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                    {
                      this.state.SpouseDetailsUserId !== "null" &&
                      this.state.formlabelDataSpouse.label454 &&
                      this.state.formlabelDataSpouse.label454.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio" >
                                <Form.Check
                                  inline
                                  label=""
                                  name="cpr2"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                    {this.state.SpouseDetailsUserId === "null" ? <Col md="5" lg="3" ></Col> : ""}

                  </Row>
                  <Row className="mt-4">
                    <Col md="5" lg="5">
                      {this.state.formlabelData.label455 &&
                        this.state.formlabelData.label455.question}
                    </Col>
                    {this.state.formlabelData.label455 &&
                      this.state.formlabelData.label455.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio" >
                                <Form.Check
                                  inline
                                  label=""
                                  name="hydration1"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                    {
                      this.state.SpouseDetailsUserId !== "null" &&
                      this.state.formlabelDataSpouse.label455 &&
                      this.state.formlabelDataSpouse.label455.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio" >
                                <Form.Check
                                  inline
                                  label=""
                                  name="hydration2"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                    {this.state.SpouseDetailsUserId === "null" ? <Col md="5" lg="3" ></Col> : ""}

                  </Row>
                  <Row className="mt-4">
                    <Col md="5" lg="5">
                      {this.state.formlabelData.label456 &&
                        this.state.formlabelData.label456.question}
                    </Col>
                    {this.state.formlabelData.label456 &&
                      this.state.formlabelData.label456.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio" >
                                <Form.Check
                                  inline
                                  label=""
                                  name="nutrition1"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                    {
                      this.state.SpouseDetailsUserId !== "null" &&
                      this.state.formlabelDataSpouse.label456 &&
                      this.state.formlabelDataSpouse.label456.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio" >
                                <Form.Check
                                  inline
                                  label=""
                                  name="nutrition2"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                    {this.state.SpouseDetailsUserId === "null" ? <Col md="5" lg="3" ></Col> : ""}

                  </Row>
                  <Row className="mt-4">
                    <Col md="5" lg="5">
                      {this.state.formlabelData.label457 &&
                        this.state.formlabelData.label457.question}
                    </Col>
                    {this.state.formlabelData.label457 &&
                      this.state.formlabelData.label457.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio" >
                                <Form.Check
                                  inline
                                  label=""
                                  name="Antibiotic1"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                    {
                      this.state.SpouseDetailsUserId !== "null" &&
                      this.state.formlabelDataSpouse.label457 &&
                      this.state.formlabelDataSpouse.label457.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio" >
                                <Form.Check
                                  inline
                                  label=""
                                  name="Antibiotic2"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                    {this.state.SpouseDetailsUserId === "null" ? <Col md="5" lg="3" ></Col> : ""}

                  </Row>
                  <Row className="mt-4">
                    <Col md="5" lg="5">
                      {this.state.formlabelData.label458 &&
                        this.state.formlabelData.label458.question}
                    </Col>
                    {this.state.formlabelData.label458 &&
                      this.state.formlabelData.label458.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio">
                                <Form.Check
                                  inline
                                  label=""
                                  name="heroic1"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                    {
                      this.state.SpouseDetailsUserId !== "null" &&
                      this.state.formlabelDataSpouse.label458 &&
                      this.state.formlabelDataSpouse.label458.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio">
                                <Form.Check
                                  inline
                                  label=""
                                  name="heroic2"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                    {this.state.SpouseDetailsUserId === "null" ? <Col md="5" lg="3" ></Col> : ""}

                  </Row>
                </Col>
              </Row>
            </Container>
              ):(
                
                  //  --------------------Mobile Show Only--------------------------       
            <div>
               <div className="d-flex justify-content-center mt-2">
               <b className={this.state.SpouseDetailsUserId === "null" ? "ms-4" : ""} >
                        {this.state.primarymemberDetails?.memberName}
                       
                      </b>
               </div>
               <Row>
               <Col xs="12" sm="12" md="5" lg="5" className="mt-3">
                      <b>
                        {this.state.formlabelData.label452 &&
                          this.state.formlabelData.label452.question}
                      </b>
                    </Col>
                    {this.state.formlabelData.label452 &&
                      this.state.formlabelData.label452.response.map((response) => {
                        return (
                          <>
                            <Col className="m-0 p-0 d-flex justify-content-center">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="maxp"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </Col>
                          </>
                        );
                      })}
                    {this.state.SpouseDetailsUserId === "null" ?
                      <Col md="5" lg="3">

                      </Col>
                      : ""}
               </Row>
               <Row>
               <Col md="5" lg="5" className="mt-3">
                      <b>
                        {this.state.formlabelData.label453 &&
                          this.state.formlabelData.label453.question}
                      </b>
                    </Col>
                    {this.state.formlabelData.label453 &&
                      this.state.formlabelData.label453.response.map((response) => {
                        return (
                          <>
                            <Col className="m-0 p-0 d-flex justify-content-center">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="lifep"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                checked={response.responseId == this.state.lifepValue?.responseId}
                                disabled={this.state.lifepValue?.disable}
                              />
                            </Col>
                          </>
                        );
                      })}
                    {this.state.SpouseDetailsUserId === "null" ?
                      <Col md="5" lg="3">

                      </Col>
                      : ""
                    }
               </Row>
               <hr className="d-md-none"></hr>
               <div className="d-flex justify-content-around mt-3">
               <div> Do Want</div>
                <div> Don't Want</div>
                </div>
                <Row>
                <Col md="5" lg="5" className="mt-3" >
                      {" "}
                      {this.state.formlabelData.label454 &&
                        this.state.formlabelData.label454.question}
                    </Col>
                    {
                      this.state.formlabelData.label454 &&
                      this.state.formlabelData.label454.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className="d-flex justify-content-center doWantSingleUserRadio">
                                <Form.Check
                                  inline
                                  label=""
                                  name="cpr1"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}

                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                </Row>
                <Row>
                <Col md="5" lg="5" className="mt-3">
                      {this.state.formlabelData.label455 &&
                        this.state.formlabelData.label455.question}
                    </Col>
                    {this.state.formlabelData.label455 &&
                      this.state.formlabelData.label455.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio" >
                                <Form.Check
                                  inline
                                  label=""
                                  name="hydration1"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                </Row>
                <Row>
                <Col md="5" lg="5" className="mt-3">
                      {this.state.formlabelData.label456 &&
                        this.state.formlabelData.label456.question}
                    </Col>
                    {this.state.formlabelData.label456 &&
                      this.state.formlabelData.label456.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio">
                                <Form.Check
                                  inline
                                  label=""
                                  name="nutrition1"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                </Row>
                <Row>
                      <Col md="5" lg="5" className="mt-3">
                      {this.state.formlabelData.label457 &&
                        this.state.formlabelData.label457.question}
                    </Col>
                    {this.state.formlabelData.label457 &&
                      this.state.formlabelData.label457.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio">
                                <Form.Check
                                  inline
                                  label=""
                                  name="Antibiotic1"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                      </Row>
                      <Row>
                      <Col md="5" lg="5" className="mt-3">
                      {this.state.formlabelData.label458 &&
                        this.state.formlabelData.label458.question}
                    </Col>
                    {this.state.formlabelData.label458 &&
                      this.state.formlabelData.label458.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio"  >
                                <Form.Check
                                  inline
                                  label=""
                                  name="heroic1"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                      </Row>
             
               <hr className="d-md-none"></hr>

               {/* -----------------Spouse----------------- */}

              <div className="d-flex justify-content-center d-md-none">
              {this.state.SpouseDetailsUserId !== "null" &&
                        // <b>Spouse</b>
                        <b>{this.state.primarymemberDetails?.spouseName}</b>
                      }
              </div>
              <Row>
              <Col xs="12" sm="12" md="5" lg="5" className="d-md-none mt-3">
                      <b>
                        {this.state.formlabelData.label452 &&
                          this.state.formlabelData.label452.question}
                      </b>
                    </Col>
                    {this.state.SpouseDetailsUserId !== "null" &&
                      this.state.formlabelDataSpouse.label452 &&
                      this.state.formlabelDataSpouse.label452.response.map((response) => {
                        return (
                          <>
                            <Col xs md="" className="m-0 p-0 d-flex justify-content-center d-md-none">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="maxs"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </Col>
                          </>
                        );
                      })
                    }   
              </Row>
              <Row>
              <Col md="5" lg="5" className="d-md-none mt-3">
                      <b>
                        {this.state.formlabelData.label453 &&
                          this.state.formlabelData.label453.question}
                      </b>
                    </Col>
                     {this.state.SpouseDetailsUserId !== "null" &&
                      this.state.formlabelDataSpouse.label453 &&
                      this.state.formlabelDataSpouse.label453.response.map((response) => {
                        return (
                          <>
                            <Col className="m-0 p-0 d-flex justify-content-center d-md-none">
                              <Form.Check
                                inline
                                className="left-radio"
                                type="radio"
                                id={response.responseId}
                                name="lifes"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                checked={response.responseId == this.state.lifesValue?.responseId}
                                disabled={this.state.lifesValue?.disable}
                              />
                            </Col>
                          </>
                        );
                      })} 
              </Row>
              <hr className="d-md-none"></hr>
              {
                this.state.SpouseDetailsUserId !== "null" &&
              <div className="d-flex justify-content-around">
                <div>Do Want </div>
                <div>Don't Want{" "}</div>
              </div>
                 }
                 <Row>
                 <Col md="5" lg="5" className="mt-3" >
                      {" "}
                      {this.state.formlabelData.label454 &&
                        this.state.formlabelData.label454.question}
                    </Col>
                    {
                      this.state.SpouseDetailsUserId !== "null" &&
                      this.state.formlabelDataSpouse.label454 &&
                      this.state.formlabelDataSpouse.label454.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio">
                                <Form.Check
                                  inline
                                  label=""
                                  name="cpr2"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                 </Row>
                 <Row>
                 <Col md="5" lg="5" className="mt-3">
                      {this.state.formlabelData.label455 &&
                        this.state.formlabelData.label455.question}
                    </Col>
                    {
                      this.state.SpouseDetailsUserId !== "null" &&
                      this.state.formlabelDataSpouse.label455 &&
                      this.state.formlabelDataSpouse.label455.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio">
                                <Form.Check
                                  inline
                                  label=""
                                  name="hydration2"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                 </Row>
                 <Row>
                 <Col md="5" lg="5" className="mt-3">
                      {this.state.formlabelData.label456 &&
                        this.state.formlabelData.label456.question}
                    </Col>
                    {
                      this.state.SpouseDetailsUserId !== "null" &&
                      this.state.formlabelDataSpouse.label456 &&
                      this.state.formlabelDataSpouse.label456.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio">
                                <Form.Check
                                  inline
                                  label=""
                                  name="nutrition2"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                 </Row>
                 <Row>
                 <Col md="5" lg="5" className="mt-3">
                      {this.state.formlabelData.label457 &&
                        this.state.formlabelData.label457.question}
                    </Col>
                   { 
                      this.state.SpouseDetailsUserId !== "null" &&
                      this.state.formlabelDataSpouse.label457 &&
                      this.state.formlabelDataSpouse.label457.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio">
                                <Form.Check
                                  inline
                                  label=""
                                  name="Antibiotic2"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                 </Row>
                 <Row>
                 <Col md="5" lg="5" className="mt-3">
                      {this.state.formlabelData.label458 &&
                        this.state.formlabelData.label458.question}
                    </Col>
                    {
                      this.state.SpouseDetailsUserId !== "null" &&
                      this.state.formlabelDataSpouse.label458 &&
                      this.state.formlabelDataSpouse.label458.response.map(
                        (response) => {
                          return (
                            <>
                              <Col className=" d-flex justify-content-center doWantSingleUserRadio mb-3">
                                <Form.Check
                                  inline
                                  label=""
                                  name="heroic2"
                                  type="radio"
                                  id={response.responseId}
                                  value={response.response}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </Col>
                            </>
                          );
                        }
                      )}
                 </Row>
                 </div>
              )}     
              <hr className="d-md-none"></hr>     
            <div className="mt-3 d-flex justify-content-end">
              <Button
                style={{ backgroundColor: "#76272b", border: "none", }}
                className="theme-btn mb-md-0 mb-4"
                onClick={this.handlesubmit}
                disabled={this.state.disable == true ? true : false}
              >
                Save
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
)(LivingWill);


