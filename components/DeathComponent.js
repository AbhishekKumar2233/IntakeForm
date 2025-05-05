import React, { Component } from "react";
import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { $Service_Url } from "./network/UrlPath";
import Select from "react-select";
import { $AHelper } from "./control/AHelper";
import { $CommonServiceFn } from "./network/Service";
import { commonLivingWill, legal } from "./control/Constant";
import { burial } from "./control/Constant";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import AlertToaster from "./control/AlertToaster";
import BurialCremationDocUploadView from "./BurialCremation/BurialCremationDocUploadView";
import BurialCremationQuestion from "./BurialCremation/BurialCremationQuestion";
import CemetryQuestion from "./BurialCremation/CemetryQuestion";
import { isNotValidNullUndefile } from "./Reusable/ReusableCom";

class DeathComponenet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      userId: "",
      SpouseDetailsUserId: "",
      formlabelData: [],
      formlabelDataSpouse: [],
      updatePrimaryMetaData: false,
      updateSpouseMetaData: false,
      primarymemberDetails: {},
      showAshesPrimary: false,
      showAshesSpouse: false,
      disable: false,
      checkedValueBurial: false,
      checkedValueCremetry: false,
      isUpdateRender: false,
      showBurrialCheck: true,
      showCremityCheck: true,

      plotprimary: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      ashes1: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      ashes2: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },

      plotSpouse: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      cemeteryPrimary: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      cemeterySpouse: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      cremated1: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      cremated2: {
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
      getPrimryDetails: {
        nameOfContact: {},
        formlabelData: {},
        nameOfFuneralHome: {},
        conactNo: {},
        cellNo: {},
        address: {},
        website: {},
        faxNo: {},
        ques464: {},
        ques1018: {},
        ques1019: {},
        ques1020: {},
        ques1021: {},
        ques1022: {},
        ques1020Value: {},
        question1022Value: {},
        ques1027: {},
        lifeInsurance: {},
        description: {},
      },
      getCremetryPrimaryData: {
        formlabelData: {},
        ques463: {},
        ques1023: {},
        question1023Values: {},
        ques1024: {},
        ques1025: {},
      }
    };
    this.burialCremationPrimary = React.createRef();
    this.burialCremationSpouse = React.createRef();
    this.cemetryPrimary = React.createRef();
    this.cemetrySpouse = React.createRef();
  }

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId");
    let spouseDetailsUserId = sessionStorage.getItem("spouseUserId");
    let primarymemberDetails = JSON.parse(sessionStorage?.getItem("userDetailOfPrimary"));
    this.setState({
      userId: newuserid,
      SpouseDetailsUserId: spouseDetailsUserId,
      primarymemberDetails: primarymemberDetails,
    });
    this.getsubjectForFormLabelIdForPrimary(newuserid);
    if (spouseDetailsUserId !== "null") {
      this.getsubjectForFormLabelIdSpouse(spouseDetailsUserId);
    }
  }

  handleChange = (e) => {
    const eventId = e.target.id;
    const eventValue = e.target.value;
    const eventName = e.target.name;

    konsole.log("eventValue", eventName, eventValue);

    if (eventName == "plot1") {
      this.setState({
        ...this.state,
        plotprimary: {
          userSubjectDataId: this.state.formlabelData.label464 ? this.state.formlabelData.label464.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label464 && this.state.formlabelData.label464.questionId,
        },
      });
    } else if (eventName == "plot2") {
      this.setState({
        ...this.state,
        plotSpouse: {
          userSubjectDataId: this.state.formlabelDataSpouse.label464 ? this.state.formlabelDataSpouse.label464.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label464 && this.state.formlabelData.label464.questionId,
        },
      });
    }

    if (eventName == "establisment1") {
      this.setState({
        ...this.state,
        cemeteryPrimary: {
          userSubjectDataId: this.state.formlabelData.label463 ? this.state.formlabelData.label463.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label463 && this.state.formlabelData.label463.questionId,
        },
      });
    } else if (eventName == "establisment2") {
      this.setState({
        ...this.state,
        cemeterySpouse: {
          userSubjectDataId: this.state.formlabelDataSpouse.label463 ? this.state.formlabelDataSpouse.label463.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label463 && this.state.formlabelData.label463.questionId,
        },
      });
    }

    if (eventName == "cremated1") {
      if (eventValue == "Yes") {
        this.setState({ showAshesPrimary: true, });
      } else if (eventValue == "No") {
        this.setState({ showAshesPrimary: false, });
      }
      this.setState({
        cremated1: {
          userSubjectDataId: this.state.formlabelData.label461 ? this.state.formlabelData.label461.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label461 && this.state.formlabelData.label461.questionId,
        },
      });
    } else if (eventName == "cremated2") {
      if (eventValue == "Yes") {
        this.setState({ showAshesSpouse: true, });
      } else if (eventValue == "No") {
        this.setState({ showAshesSpouse: false, });
      }
      this.setState({
        cremated2: {
          userSubjectDataId: this.state.formlabelDataSpouse.label461 ? this.state.formlabelDataSpouse.label461.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label461 && this.state.formlabelData.label461.questionId,
        },
      });
    }

    if (eventName == "funeral1") {
      this.setState({
        ...this.state,
        funeral1: {
          userSubjectDataId: this.state.formlabelData.label462 ? this.state.formlabelData.label462.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label462 && this.state.formlabelData.label462.questionId,
        },
      });
    } else if (eventName == "funeral2") {
      this.setState({
        ...this.state,
        funeral2: {
          userSubjectDataId: this.state.formlabelDataSpouse.label462 ? this.state.formlabelDataSpouse.label462.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label462 && this.state.formlabelData.label462.questionId,
        },
      });
    }

    if (eventName == "ashes1") {
      this.setState({
        ...this.state,
        ashes1: {
          userSubjectDataId: this.state.formlabelData.label952 ? this.state.formlabelData.label952.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label952 && this.state.formlabelData.label952.questionId,
        },
      });
    }
    if (eventName == "ashes2") {
      this.setState({
        ...this.state,
        ashes2: {
          userSubjectDataId:
            this.state.formlabelDataSpouse.label952?.userSubjectDataId !== undefined ? this.state?.formlabelDataSpouse?.label952.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelDataSpouse.label952 && this.state.formlabelDataSpouse.label952.questionId,
        },
      });
    }
  };

  getsubjectForFormLabelIdForPrimary = (newuserid) => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    // commonLivingWill.formLabelId.map((id, index) => {
    //   let data = [id.id];
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, commonLivingWill.formLabelId, (response) => {
      this.props.dispatchloader(false);
      if (response) {
        const resSubData = response.data.data;

        for (let resObj of resSubData) {
          let label = "label" + resObj.formLabelId;
          formlabelData[label] = resObj.question;
          this.props.dispatchloader(true);
          $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, "", (response) => {
            this.props.dispatchloader(false);
            if (response) {
              if (response.data.data.userSubjects.length !== 0) {
                this.setState({ updatePrimaryMetaData: true, });
                let responseData = response.data.data.userSubjects[0];
                for (let i = 0; i < formlabelData[label].response.length; i++) {
                  this.props.dispatchloader(true);
                  if (formlabelData[label].response[i].responseId === responseData.responseId) {
                    if (responseData.responseNature == "Radio") {
                      formlabelData[label].response[i]["checked"] = true;
                      formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                      if (responseData.responseId == 108) {
                        this.setState({ showAshesPrimary: true, });
                      }
                    } else if (responseData.responseNature == "Text") {
                      formlabelData[label].response[i]["response"] = responseData.response;
                      formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
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
    let formlabelDataSpouse = {};
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, commonLivingWill.formLabelId, (response) => {
      this.props.dispatchloader(false);
      if (response) {
        const resSubData = response.data.data;
        for (let resObj of resSubData) {
          let label = "label" + resObj.formLabelId;
          formlabelDataSpouse[label] = resObj.question;
          $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + spouseUserId + `/0/0/${formlabelDataSpouse[label].questionId}`, "", (response) => {
            if (response) {
              if (response.data.data.userSubjects.length !== 0) {
                this.setState({ updateSpouseMetaData: true, });
                let responseData = response.data.data.userSubjects[0];
                for (let i = 0; i < formlabelDataSpouse[label].response.length; i++) {
                  if (formlabelDataSpouse[label].response[i].responseId === responseData.responseId) {
                    if (responseData.responseNature == "Radio") {
                      formlabelDataSpouse[label].response[i]["checked"] = true;
                      formlabelDataSpouse[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                      if (responseData.responseId == 108) {
                        this.setState({ showAshesSpouse: true, });
                      }
                    } else if (responseData.responseNature == "Text") {
                      formlabelDataSpouse[label].response[i]["response"] = responseData.response;
                      formlabelDataSpouse[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                    }
                  }
                  if (formlabelDataSpouse[label].response.length - 1 == i) {
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

  handlesubmit = () => {
    // this.setState({
    //   disable:true
    // })

    let plotprimary = this.state.plotprimary;
    let plotSpouse = this.state.plotSpouse;
    let cemeteryPrimary = this.state.cemeteryPrimary;
    let cemeterySpouse = this.state.cemeterySpouse;
    let cremated1 = this.state.cremated1;

    let cremated2 = this.state.cremated2;
    let funeral1 = this.state.funeral1;
    let funeral2 = this.state.funeral2;

    let ashes1 = this.state.ashes1;
    let ashes2 = this.state.ashes2;

    if (this.state.SpouseDetailsUserId !== "null") {
      cemeteryPrimary["userId"] = this.state.userId;
      cemeterySpouse["userId"] = this.state.SpouseDetailsUserId;
    } else {
      cemeteryPrimary["userId"] = this.state.userId;
    }

    if (this.state.SpouseDetailsUserId !== "null") {
      plotprimary["userId"] = this.state.userId;
      plotSpouse["userId"] = this.state.SpouseDetailsUserId;
    } else {
      plotprimary["userId"] = this.state.userId;
    }
    if (this.state.SpouseDetailsUserId !== "null") {
      cremated1["userId"] = this.state.userId;
      cremated2["userId"] = this.state.SpouseDetailsUserId;
      funeral1["userId"] = this.state.userId;
      funeral2["userId"] = this.state.SpouseDetailsUserId;
      ashes1["userId"] = this.state.userId;
      ashes2["userId"] = this.state.SpouseDetailsUserId;
    } else {
      cremated1["userId"] = this.state.userId;
      funeral1["userId"] = this.state.userId;
      ashes1["userId"] = this.state.userId;
    }
    let totoalinptary = [];
    let totinptary = [];
    if (this.state.SpouseDetailsUserId !== "null") {
      if (plotprimary.subjectId !== 0 && plotprimary.subResponseData !== "" && plotprimary.responseId !== 0) {
        totinptary.push(plotprimary);
      }
      if (plotSpouse.subjectId !== 0 && plotSpouse.subResponseData !== "" && plotSpouse.responseId !== 0) {
        totoalinptary.push(plotSpouse);
      }
      if (cemeteryPrimary.subjectId !== 0 && cemeteryPrimary.subResponseData !== "" && cemeteryPrimary.responseId !== 0) {
        totinptary.push(cemeteryPrimary);
      }
      if (cemeterySpouse.subjectId !== 0 && cemeterySpouse.subResponseData !== "" && cemeterySpouse.responseId !== 0) {
        totoalinptary.push(cemeterySpouse);
      }
      if (cremated1.subjectId !== 0 && cremated1.subResponseData !== "" && cremated1.responseId !== 0) {
        totinptary.push(cremated1);
      }
      if (cremated2.subjectId !== 0 && cremated2.subResponseData !== "" && cremated2.responseId !== 0) {
        totoalinptary.push(cremated2);
      }
      if (funeral1.subjectId !== 0 && funeral1.subResponseData !== "" && funeral1.responseId !== 0) {
        totinptary.push(funeral1);
      }
      if (funeral2.subjectId !== 0 && funeral2.subResponseData !== "" && funeral2.responseId !== 0) {
        totoalinptary.push(funeral2);
      }
      if (ashes1.subjectId !== 0 && ashes1.subResponseData !== "" && ashes1.responseId !== 0) {
        totinptary.push(ashes1);
      }
      if (ashes2.subjectId !== 0 && ashes2.subResponseData !== "" && ashes2.responseId !== 0) {
        totoalinptary.push(ashes2);
      }
    } else {
      if (plotprimary.subjectId !== 0 && plotprimary.subResponseData !== "" && plotprimary.responseId !== 0) {
        totinptary.push(plotprimary);
      }
      if (cemeteryPrimary.subjectId !== 0 && cemeteryPrimary.subResponseData !== "" && cemeteryPrimary.responseId !== 0) {
        totinptary.push(cemeteryPrimary);
      }
      if (cremated1.subjectId !== 0 && cremated1.subResponseData !== "" && cremated1.responseId !== 0) {
        totinptary.push(cremated1);
      }
      if (funeral1.subjectId !== 0 && funeral1.subResponseData !== "" && funeral1.responseId !== 0) {
        totinptary.push(funeral1);
      }
      if (ashes1.subjectId !== 0 && ashes1.subResponseData !== "" && ashes1.responseId !== 0) {
        totinptary.push(ashes1);
      }
    }

    konsole.log("ashes2", ashes2);
    if (this.state.SpouseDetailsUserId !== "null") {

      if (this.state.updatePrimaryMetaData == true && this.state.updateSpouseMetaData == true) {
        this.handleUpdateSubmit(totinptary, this.state.userId);
        if (this.state.userId != this.state.SpouseDetailsUserId) this.handleUpdateSubmit(totoalinptary, this.state.SpouseDetailsUserId, "TostertwiceUpdate");

      }
      else if (this.state.updateSpouseMetaData == true) {

        this.handleUpdateSubmit(totoalinptary, this.state.SpouseDetailsUserId);
        if (this.state.updatePrimaryMetaData == false) {
          this.handleasdSubmit(totinptary, this.state.userId, "TostertwiceSubmited");
        }
      }
      else if (this.state.updatePrimaryMetaData == true) {
        this.handleUpdateSubmit(totinptary, this.state.userId);

        if (this.state.updateSpouseMetaData == false) {
          this.handleUpdateSubmit(totoalinptary, this.state.SpouseDetailsUserId, "TostertwiceUpdate");
        }
      }

      else if (this.state.updatePrimaryMetaData == true && this.state.updateSpouseMetaData == false) {

        this.handleUpdateSubmit(totinptary, this.state.userId);
        if (this.state.userId != this.state.SpouseDetailsUserId) this.handleasdSubmit(totoalinptary, this.state.SpouseDetailsUserId, "TostertwiceSubmited");


      } else if (this.state.updateSpouseMetaData == true && this.state.updatePrimaryMetaData == false) {

        this.handleUpdateSubmit(totinptary, this.state.SpouseDetailsUserId, "TostertwiceUpdate");


      } else if (this.state.updateSpouseMetaData == false && this.state.updatePrimaryMetaData == false) {

        this.handleasdSubmit(totinptary, this.state.userId);
        if (this.state.userId != this.state.SpouseDetailsUserId) this.handleasdSubmit(totoalinptary, this.state.SpouseDetailsUserId, "TostertwiceSubmited");

      }
    } else {
      if (this.state.updatePrimaryMetaData == true) {
        this.handleUpdateSubmit(totinptary, this.state.userId, "TostertwiceUpdate");

      } else if (this.state.updatePrimaryMetaData == false) {
        this.handleasdSubmit(totinptary, this.state.userId, "TostertwiceSubmited");

      }
    }
  };

  handleasdSubmit = (totinptary, consumerId, funPostId) => {
    konsole.log("submit");
    this.props.dispatchloader(true);
    konsole.log("update", totinptary);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postaddusersubjectdata, totinptary, async (response) => {
      this.props.dispatchloader(false);
      konsole.log("Success res submit" + JSON.stringify(response));
      let resultPrimary = await this.burialCremationPrimary.current?.saveData();
      let resultSpouse = await this.burialCremationSpouse.current?.saveData();
      let cemetryPrimary = await this.cemetryPrimary.current?.saveData();
      let cemetrySpouse = await this.cemetrySpouse.current?.saveData();
      konsole.log("resultresult", resultPrimary, resultSpouse, cemetrySpouse, cemetryPrimary)

      if (response) {
        if (funPostId == "TostertwiceSubmited") {
          AlertToaster.success("Data saved successfully");

        }

        // alert("Saved Successfully");
        if (consumerId == this.state.userId) {
          this.getsubjectForFormLabelIdForPrimary(this.state.userId);
        }
        if (consumerId == this.state.SpouseDetailsUserId) {
          this.getsubjectForFormLabelIdSpouse(this.state.SpouseDetailsUserId);
        }
        this.props.handleClose();
      } else {
        // alert(Msg.ErrorMsg);
        this.props.handleClose();
        this.setState({ disable: false })
      }
    }
    );
  };

  handleUpdateSubmit = (totinptary, consumerId, funPutId) => {
    konsole.log("update");
    let postData = {
      userId: consumerId,
      userSubjects: totinptary,
    };
    konsole.log("update", postData);
    this.state.disable = true
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putSubjectResponse, postData, async (response) => {
      this.props.dispatchloader(false);
      konsole.log("Success res update" + JSON.stringify(response));
      let resultPrimary = await this.burialCremationPrimary.current?.saveData();
      let resultSpouse = await this.burialCremationSpouse.current?.saveData();
      let cemetryPrimary = await this.cemetryPrimary.current?.saveData();
      let cemetrySpouse = await this.cemetrySpouse.current?.saveData();
      if (response) {
        this.state.disable = false
        if (funPutId == "TostertwiceUpdate") {
          AlertToaster.success("Data updated successfully");
        }

        // alert("Saved Successfully");
        if (consumerId == this.state.userId) {
          this.getsubjectForFormLabelIdForPrimary(this.state.userId);
        }
        if (consumerId == this.state.SpouseDetailsUserId) {
          this.getsubjectForFormLabelIdSpouse(this.state.SpouseDetailsUserId);
        }
        this.props.handleClose();
      } else {
        this.props.handleClose();
      }
    }
    );
  };
  updateSameas = (formlabelData, nameOfContact, nameOfFuneralHome, conactNo, cellNo, address, website, faxNo, ques464, ques1018, ques1019, ques1020, ques1021, ques1022, question1022Value, ques1020Value, lifeInsurance, ques1027, description) => {

    if (this.state?.checkedValueBurial === true) {
      this.setState(prevState => ({
        getPrimryDetails: {
          ...prevState.getPrimryDetails,
          formlabelData: formlabelData,
          nameOfContact: nameOfContact,
          nameOfFuneralHome: nameOfFuneralHome,
          conactNo: conactNo,
          cellNo: cellNo,
          address: address,
          website: website,
          faxNo: faxNo,
          ques464: ques464,
          ques1018: ques1018,
          ques1019: ques1019,
          ques1020: ques1020,
          ques1021: ques1021,
          ques1022: ques1022,
          question1022Value: question1022Value,
          ques1020Value: ques1020Value,
          lifeInsurance: lifeInsurance,
          ques1027: ques1027,
          description: description
        }
      }));
    }
  };
  updateSameAsCremetry = (formlabelData, ques463, ques1023, question1023Values, ques1024, ques1025) => {
    if (this.state?.checkedValueCremetry === true) {
      this.setState(prevState => ({
        getCremetryPrimaryData: {
          ...prevState.getCremetryPrimaryData,
          formlabelData: formlabelData,
          ques463: ques463,
          ques1023: ques1023,
          question1023Values: question1023Values,
          ques1024: ques1024,
          ques1025: ques1025,
        }
      }));
    }

  }
  handleCheckBox = (e, name) => {
    if (name == "Burial/Cremation_Plan") {
      this.setState({ checkedValueBurial: e.target.checked, isUpdateRender: e.target.checked })
    } else {
      this.setState({ checkedValueCremetry: e.target.checked, isUpdateRender: e.target.checked })
    }
  }
  isUpdate = (data, text) => {
    if (isNotValidNullUndefile(data)) {
      if (text == "burial") {
        this.setState({ showBurrialCheck: false })
      } else {
        this.setState({ showCremityCheck: false })
      }

    }

  }


  render() {


    const rowSpanClass = this.state.SpouseDetailsUserId !== "null" ? { span: 3, offset: 5 } : { span: 3, offset: 6 };
    const isSpouseExists = this.state.SpouseDetailsUserId !== "null"

    return (
      <>
        <style jsx global>{` 
         .modal-open .modal-backdrop.show {  opacity: 0.7;  }
         .modal-dialog {
            max-width: 80rem;
            margin: 1.75rem auto;
          }
         `}</style>
        <Modal
          size={this.state.SpouseDetailsUserId !== "null" ? "lg" : "md"}
          show={this.props.show}
          centered
          onHide={this.props.handleClose}
          animation="false"
          backdrop="static"
          enforceFocus={false}
          className="generatePdfModal"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Burial/Cremation  Plan</Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            <div>
              <Row className="boxBorderStyle border pb-3 mb-3">
                <Col>
                  <Row className="my-2 person-head">
                    <Col className="">
                      <div className="handlingRemain">
                        <h4 className="">Handling of Remains</h4>
                      </div>
                    </Col>
                  </Row>
                  <>
                    {window.innerWidth > "575" ? (
                      <Row>
                        <Col >
                          <Row className="d-flex flex-column" >
                            <Col>
                              <Row className="d-flex">
                                <Col md="6" lg="6"></Col>
                                <Col lg={this.state.SpouseDetailsUserId !== "null" ? 3 : 5} md={this.state.SpouseDetailsUserId !== "null" ? 3 : 5} sm={this.state.SpouseDetailsUserId !== "null" ? 3 : 5} className="d-flex justify-content-center m-0  p-0 pe-3">
                                  {/* Primary Member */}
                                  <b>{$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.memberName)}</b>
                                </Col>
                                {this.state.SpouseDetailsUserId !== "null" && (
                                  <Col lg="3" md="3" className="d-flex justify-content-center m-0 p-0 pe-3">
                                    <b>
                                      {/* Spouse */}
                                      {$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.spouseName)}
                                    </b>
                                  </Col>
                                )}
                              </Row>
                            </Col>
                            <Col className="mt-3">
                              <Row className="d-flex">
                                <Col md="6" lg="6">
                                  <div> {this.state.formlabelData?.label461 && this.state.formlabelData?.label461?.question} </div>
                                </Col>
                                <Col
                                  lg={this.state.SpouseDetailsUserId !== "null" ? 3 : 5}
                                  md={this.state.SpouseDetailsUserId !== "null" ? 3 : 5}
                                  sm={this.state.SpouseDetailsUserId !== "null" ? 3 : 5}
                                  className="d-flex justify-content-between"
                                >
                                  {/* <div clasName=" mt-4 d-flex justify-content-between" > */}
                                  {this.state.formlabelData.label461 &&
                                    this.state.formlabelData.label461.response.map(
                                      (response) => {
                                        konsole.log("responseBtnDetails", response);
                                        return (
                                          <>
                                            {/* <Col lg="6" > */}
                                            <Form.Check
                                              inline
                                              className="left-radio fs-6 "
                                              type="radio"
                                              id={response.responseId}
                                              name="cremated1"
                                              label={response.response}
                                              value={response.response}
                                              onChange={(e) => {
                                                this.handleChange(e);
                                              }}
                                              defaultChecked={response.checked}
                                            />
                                            {/* </Col> */}
                                          </>
                                        );
                                      }
                                    )}
                                  {/* </div> */}
                                </Col>

                                <Col lg="3" md="3" className="d-flex justify-content-between">
                                  {/* <div cllassName=" mt-4" style={{ display: "flex" }}> */}
                                  {this.state.SpouseDetailsUserId !== "null" &&
                                    this.state.formlabelDataSpouse.label461 &&
                                    this.state.formlabelDataSpouse.label461.response.map(
                                      (response) => {
                                        return (
                                          <>
                                            <Form.Check
                                              inline
                                              className="left-radio fs-6"
                                              type="radio"
                                              id={response.responseId}
                                              name="cremated2"
                                              label={response.response}
                                              value={response.response}
                                              onChange={(e) => {
                                                this.handleChange(e);
                                              }}
                                              defaultChecked={response.checked}
                                            />
                                          </>
                                        );
                                      }
                                    )}
                                </Col>
                              </Row>
                            </Col>
                            <Col className="mt-3">
                              <Row className="d-flex">
                                <Col md="6" lg="6" >
                                  {this.state.showAshesPrimary == true || this.state.showAshesSpouse == true ? (
                                    <div>{this.state.formlabelData.label952 && this.state.formlabelData.label952.question}</div>
                                  ) : (<></>)}
                                </Col>
                                <Col lg={this.state.SpouseDetailsUserId !== "null" ? 3 : 5} md={this.state.SpouseDetailsUserId !== "null" ? 3 : 5}  >
                                  {this.state.showAshesPrimary == true ? (
                                    <div clasName="mt-4" style={{ display: "flex" }}  >
                                      {this.state.formlabelData.label952 &&
                                        this.state.formlabelData.label952.response.map(
                                          (response) => {
                                            konsole.log("responseBtnDetails", response);
                                            return (
                                              <>
                                                <Form.Control
                                                  inline
                                                  className="fs-6"
                                                  type="text"
                                                  id={response.responseId}
                                                  name="ashes1"
                                                  label={response.response}
                                                  placeholder="Description"
                                                  defaultValue={response.response}
                                                  onChange={(e) => {
                                                    this.handleChange(e);
                                                  }}
                                                />
                                              </>
                                            );
                                          }
                                        )}
                                    </div>
                                  ) : (<></>)}
                                </Col>
                                <Col lg="3">
                                  {this.state.showAshesSpouse == true ? (
                                    <div cllassName=" mt-4" style={{ display: "flex" }}>
                                      {this.state.SpouseDetailsUserId !== "null" &&
                                        this.state.formlabelDataSpouse.label952 &&
                                        this.state.formlabelDataSpouse.label952.response.map(
                                          (response) => {
                                            return (
                                              <>
                                                <Form.Control
                                                  inline
                                                  className="fs-6"
                                                  type="text"
                                                  id={response.responseId}
                                                  name="ashes2"
                                                  placeholder="Description"
                                                  label={response.response}
                                                  defaultValue={response.response}
                                                  onChange={(e) => {
                                                    this.handleChange(e);
                                                  }}
                                                />
                                              </>
                                            );
                                          }
                                        )}
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </Col>
                              </Row>
                            </Col>

                            <Col className="mt-3">
                              <Row>
                                <Col md="6" lg="6">
                                  <div className="mt-2">
                                    {this.state.formlabelData.label462 && this.state.formlabelData.label462.question}
                                  </div>
                                </Col>
                                <Col lg={this.state.SpouseDetailsUserId !== "null" ? 3 : 5} md={this.state.SpouseDetailsUserId !== "null" ? 3 : 5} className="">
                                  {/* <div style={{ display: "flex" }} className=" mt-3"> */}
                                  {this.state.formlabelData.label462 &&
                                    this.state.formlabelData.label462.response.map(
                                      (response) => {
                                        return (
                                          <>
                                            <Form.Check
                                              inline
                                              className="left-radio ms-1 "
                                              type="radio"
                                              id={response.responseId}
                                              name="funeral1"
                                              style={{ fontsize: "8px" }}
                                              label={response.response}
                                              value={response.response}
                                              onChange={(e) => {
                                                this.handleChange(e);
                                              }}
                                              defaultChecked={response.checked}
                                            />
                                          </>
                                        );
                                      }
                                    )}
                                  {/* </div> */}
                                </Col>
                                <Col lg="3" md="3">
                                  {/* <div className='mt-3'> */}
                                  {this.state.SpouseDetailsUserId !== "null" &&
                                    this.state.formlabelDataSpouse.label462 &&
                                    this.state.formlabelDataSpouse.label462.response.map(
                                      (response) => {
                                        return (
                                          <>
                                            <Form.Check
                                              inline
                                              className="left-radio fs-6 ms-1"
                                              type="radio"
                                              id={response.responseId}
                                              name="funeral2"
                                              label={response.response}
                                              value={response.response}
                                              onChange={(e) => {
                                                this.handleChange(e);
                                              }}
                                              defaultChecked={response.checked}
                                            />

                                            {/* <Col /> */}
                                          </>
                                        );
                                      }
                                    )}
                                  {/* </div> */}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                    ) : (

                      // -------------------------------Mobile Screen Show-------------------------
                      <div>
                        <div
                          lg={this.state.SpouseDetailsUserId !== "null" ? 3 : 5}
                          md={this.state.SpouseDetailsUserId !== "null" ? 3 : 5}
                          sm={this.state.SpouseDetailsUserId !== "null" ? 3 : 5}
                          className="d-flex justify-content-center p-0 pe-3 ps-3 "
                        >
                          <b>{$AHelper.capitalizeAllLetters(this.state.primarymemberDetails.memberName)}</b>
                          {/* Primary */}
                        </div>

                        <Row>
                          <Col md="6" lg="6" className="">
                            <div>
                              {this.state.formlabelData.label461 && this.state.formlabelData.label461.question}
                            </div>
                          </Col>
                          <Col lg={this.state.SpouseDetailsUserId !== "null" ? 3 : 5} md={this.state.SpouseDetailsUserId !== "null" ? 3 : 5} sm={this.state.SpouseDetailsUserId !== "null" ? 3 : 5} className="d-flex mt-1">

                            {this.state.formlabelData.label461 &&
                              this.state.formlabelData.label461.response.map(
                                (response) => {
                                  konsole.log("responseBtnDetails", response);
                                  return (
                                    <>

                                      <Form.Check
                                        inline
                                        className="left-radio fs-6 "
                                        type="radio"
                                        id={response.responseId}
                                        name="cremated1"
                                        label={response.response}
                                        value={response.response}
                                        onChange={(e) => {
                                          this.handleChange(e);
                                        }}
                                        defaultChecked={response.checked}
                                      />

                                    </>
                                  );
                                }
                              )}

                          </Col>
                          <Row>
                            <Col md="6" lg="6" className=" mt-3" >
                              {this.state.showAshesPrimary == true || this.state.showAshesSpouse == true ? (
                                <div>
                                  {this.state.formlabelData.label952 && this.state.formlabelData.label952.question}
                                </div>
                              ) : (<></>)}
                            </Col>
                            <Col
                              lg={this.state.SpouseDetailsUserId !== "null" ? 3 : 5}
                              md={this.state.SpouseDetailsUserId !== "null" ? 3 : 5}
                              className=""
                            >
                              {this.state.showAshesPrimary == true ? (
                                <div clasName="  mt-4" style={{ display: "flex" }}>
                                  {this.state.formlabelData.label952 &&
                                    this.state.formlabelData.label952.response.map(
                                      (response) => {
                                        konsole.log("responseBtnDetails", response);
                                        return (
                                          <>
                                            <Form.Control
                                              inline
                                              className="fs-6"
                                              type="text"
                                              id={response.responseId}
                                              name="ashes1"
                                              label={response.response}
                                              defaultValue={response.response}
                                              onChange={(e) => {
                                                this.handleChange(e);
                                              }}
                                            />
                                          </>
                                        );
                                      }
                                    )}
                                </div>
                              ) : (<></>)}
                            </Col>
                          </Row>
                        </Row>
                        <Row>
                          <Col md="6" lg="6">
                            <div className="mt-2 ">
                              {this.state.formlabelData.label462 && this.state.formlabelData.label462.question}
                            </div>
                          </Col>
                          <Col lg={this.state.SpouseDetailsUserId !== "null" ? 3 : 5} md={this.state.SpouseDetailsUserId !== "null" ? 3 : 5} className="">

                            {this.state.formlabelData.label462 &&
                              this.state.formlabelData.label462.response.map(
                                (response) => {
                                  return (
                                    <>
                                      <Form.Check
                                        inline
                                        className="left-radio ms-1 "
                                        type="radio"
                                        id={response.responseId}
                                        name="funeral1"
                                        style={{ fontsize: "8px" }}
                                        label={response.response}
                                        value={response.response}
                                        onChange={(e) => {
                                          this.handleChange(e);
                                        }}
                                        defaultChecked={response.checked}
                                      />
                                    </>
                                  );
                                }
                              )}
                            {/* </div> */}
                          </Col>
                        </Row>
                        <hr className=""></hr>
                        <div className=" mt-2 d-flex justify-content-center">
                          <b>{$AHelper.capitalizeAllLetters(this.state.primarymemberDetails.spouseName)}</b>
                        </div>
                        <Row>
                          <Col md="6" lg="6" className=" mt-2">
                            <div>{this.state.formlabelData.label461 && this.state.formlabelData.label461.question}
                            </div>
                          </Col>
                          <Col lg="3" md="3" className="d-flex  "  >

                            {this.state.SpouseDetailsUserId !== "null" &&
                              this.state.formlabelDataSpouse.label461 &&
                              this.state.formlabelDataSpouse.label461.response.map(
                                (response) => {
                                  return (
                                    <>

                                      <Form.Check
                                        inline
                                        className="left-radio fs-6"
                                        type="radio"
                                        id={response.responseId}
                                        name="cremated2"
                                        label={response.response}
                                        value={response.response}
                                        onChange={(e) => {
                                          this.handleChange(e);
                                        }}
                                        defaultChecked={response.checked}
                                      />

                                    </>
                                  );
                                }
                              )}

                          </Col>
                          <Row className="mt-3">
                            <Col md="6" lg="6" className="" >
                              {this.state.showAshesPrimary == true ||
                                this.state.showAshesSpouse == true ? (
                                <div>  {this.state.formlabelData.label952 && this.state.formlabelData.label952.question}
                                </div>
                              ) : (<></>)}
                            </Col>
                            <Col lg="3" className="">
                              {this.state.showAshesSpouse == true ? (
                                <div cllassName=" mt-4" style={{ display: "flex" }}>
                                  {this.state.SpouseDetailsUserId !== "null" &&
                                    this.state.formlabelDataSpouse.label952 &&
                                    this.state.formlabelDataSpouse.label952.response.map(
                                      (response) => {
                                        return (
                                          <>
                                            <Form.Control
                                              inline
                                              className="fs-6"
                                              type="text"
                                              id={response.responseId}
                                              name="ashes2"
                                              label={response.response}
                                              defaultValue={response.response}
                                              onChange={(e) => {
                                                this.handleChange(e);
                                              }}
                                            />
                                          </>
                                        );
                                      }
                                    )}
                                </div>
                              ) : (
                                <></>
                              )}
                            </Col>
                          </Row>
                        </Row>

                        <Row>
                          <Col md="6" lg="6" className=" mt-2">
                            <div>
                              {this.state.formlabelData.label462 && this.state.formlabelData.label462.question}
                            </div>
                          </Col>
                          <Col lg="3" md="3" className="">

                            {this.state.SpouseDetailsUserId !== "null" &&
                              this.state.formlabelDataSpouse.label462 &&
                              this.state.formlabelDataSpouse.label462.response.map(
                                (response) => {
                                  return (
                                    <>
                                      <Form.Check
                                        inline
                                        className="left-radio fs-6 ms-1"
                                        type="radio"
                                        id={response.responseId}
                                        name="funeral2"
                                        label={response.response}
                                        value={response.response}
                                        onChange={(e) => {
                                          this.handleChange(e);
                                        }}
                                        defaultChecked={response.checked}
                                      />


                                    </>
                                  );
                                }
                              )}

                          </Col>
                        </Row>
                      </div>
                    )}

                    <BurialCremationDocUploadView
                      key={60}
                      fileTypeId={60} // Handling of Remains File type
                      fileStatusId={1}
                      fileCategoryId={13} // handling of Remains File Category Id 
                    />
                  </>
                </Col>
              </Row>
              {/* *****************************______________Burial/Cremation Plan___________****************************************** */}
              <Row className=" boxBorderStyle border mb-3">
                <Col>
                  {/* <Row className="my-2 person-head">
                  <Col className="">
                    <div className="handlingRemain">
                      <h4 className="">Burial/Cremation  Plan</h4>
                    </div>
                  </Col>
                </Row> */}
                  <div className="row mt-2 person-head">
                    <div className="col-3">
                      <h4 className="handlingRemain">Burial/Cremation Plan</h4>
                    </div>
                    {isSpouseExists && this.state.showBurrialCheck &&
                      <div className="col-3">
                        <div className="row d-flex align-items-center">
                          <div className="col-3">
                            <input type="checkbox" onChange={(e) => this.handleCheckBox(e, "Burial/Cremation_Plan")} />
                          </div>
                          <div className="col-7">
                            Same for {$AHelper.capitalizeAllLetters(this.state.primarymemberDetails.spouseName)}
                          </div>
                        </div>
                      </div>
                    }
                  </div>

                  <>


                    <Row>
                      <Col md={`${(isSpouseExists) ? '6' : ''}`} lg={`${(isSpouseExists) ? '6' : ''}`}>
                        <div className="p-4">
                          <BurialCremationQuestion
                            memberUserId={this.state.userId}
                            setLoader={this.props.dispatchloader}
                            typeOfRefrence='Primary'
                            key='Primary'
                            updateSameas={this.updateSameas}
                            isUpdate={this.isUpdate}
                            isUpdateRender={this.state?.isUpdateRender}
                            checkedValueBurial={this.state?.checkedValueBurial}
                            memberName={this.state?.primarymemberDetails?.memberName}
                            ref={this.burialCremationPrimary}
                          // answerType={stateVal?.primaryMemberBurialCremationNicheYes}
                          />
                        </div>
                      </Col>



                      {(isSpouseExists) &&
                        <Col md="6" lg="6" style={{ borderLeft: "1px solid black" }}>
                          <div className="p-4">
                            <BurialCremationQuestion
                              memberUserId={this.state.SpouseDetailsUserId}
                              setLoader={this.props.dispatchloader}
                              typeOfRefrence='Spouse'
                              key='Spouse'
                              getPrimryDetails={this.state?.getPrimryDetails}
                              isUpdateRender={this.state?.isUpdateRender}
                              checkedValueBurial={this.state?.checkedValueBurial}
                              memberName={this.state?.primarymemberDetails?.spouseName}
                              ref={this.burialCremationSpouse}
                            />
                          </div>
                        </Col>
                      }
                    </Row>
                  </>
                </Col>
              </Row>
              {/* *****************************______________Burial/Cremation Plan___________****************************************** */}
              {/* *****************************______________Cemetery___________****************************************** */}

              <Row className="boxBorderStyle border">
                <Col>
                  {/* <div className="boxBorderStyle border mb-3"> */}
                  {/* <Row className="my-2 person-head">
                  <Col className="">
                    <div className="handlingRemain">
                      <h4 className="">Cemetery</h4>
                    </div>
                  </Col>
                </Row> */}
                  <div className="row mt-2 person-head">
                    <div className="col-2">
                      <h4 className="handlingRemain">Cemetery</h4>
                    </div>
                    {isSpouseExists && this.state.showCremityCheck &&
                      <div className="col-4">
                        <div className="row d-flex align-items-center">
                          <div className="col-3">
                            <input type="checkbox" onChange={(e) => this.handleCheckBox(e, "Cemetery")} />
                          </div>
                          <div className="col-9">
                            Same for {$AHelper.capitalizeAllLetters(this.state.primarymemberDetails.spouseName)}
                          </div>
                        </div>
                      </div>
                    }
                  </div>

                  <>
                    {/* <CemetryQuestion /> */}
                    <Row>
                      <Col md={`${(isSpouseExists) ? '6' : ''}`} lg={`${(isSpouseExists) ? '6' : ''}`}>

                        <div className="p-4">
                          <CemetryQuestion
                            memberUserId={this.state.userId}
                            setLoader={this.props.dispatchloader}
                            typeOfRefrence='Primary'
                            key='Primary'
                            isUpdate={this.isUpdate}
                            updateSameAsCremetry={this.updateSameAsCremetry}
                            isUpdateRender={this.state.isUpdateRender}
                            checkedValueCremetry={this.state?.checkedValueCremetry}
                            memberName={this.state?.primarymemberDetails?.memberName}
                            ref={this.cemetryPrimary}
                          />
                        </div>
                      </Col>

                      {(isSpouseExists) &&
                        <Col md="6" lg="6" style={{ borderLeft: "1px solid black" }}>
                          <div className="p-4">
                            <CemetryQuestion
                              memberUserId={this.state.SpouseDetailsUserId}
                              setLoader={this.props.dispatchloader}
                              typeOfRefrence='Spouse'
                              getCremetryPrimaryData={this.state?.getCremetryPrimaryData}
                              isUpdateRender={this.state.isUpdateRender}
                              checkedValueCremetry={this.state?.checkedValueCremetry}
                              key='Spouse'
                              memberName={this.state?.primarymemberDetails?.spouseName}
                              ref={this.cemetrySpouse}
                            />
                          </div>
                        </Col>
                      }
                    </Row>
                    <Row className="mb-3">
                      <BurialCremationDocUploadView
                        key={62}
                        fileTypeId={62} // Cemetery File type
                        fileStatusId={1}
                        fileCategoryId={13} // Cemetery File Category Id 
                      /></Row>
                  </>
                </Col>
              </Row>
              {/* *****************************______________Cemetery___________****************************************** */}
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button style={{ backgroundColor: "#76272b", border: "none" }} className="theme-btn" onClick={this.handlesubmit} disabled={this.state.disable == true ? true : false} >
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

export default connect(mapStateToProps, mapDispatchToProps)(DeathComponenet);
