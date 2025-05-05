import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, } from "react-bootstrap";
import Select from "react-select";
import { connect } from "react-redux";
import CurrencyInput from "react-currency-input-field";
import { SET_LOADER } from "../components/Store/Actions/action";
import { $Service_Url } from "../components/network/UrlPath";
import { $CommonServiceFn, $postServiceFn, } from "../components/network/Service";
import { $AHelper } from "../components/control/AHelper";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import Other from "./asssets/Other";
import PdfViewer2 from "./PdfViwer/PdfViewer2";
import { globalContext } from "../pages/_app";
import OtherInfo from "./asssets/OtherInfo";
import AlertToaster from "./control/AlertToaster";
import { fileLargeMsg } from './control/Constant'
import { fileNameShowInClickHere, getOtherFieldsName } from "./Reusable/ReusableCom";
import ExpensesPaidQuestion from "./ExpensesPaidQues";
import { clearHealthInsuranceDetails } from "../component/utils/utils";

export class healthinsurance extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      InsurancePlanType: [],
      fileObj: null,
      logginUserId: sessionStorage.getItem("loggedUserId"),
      fileCategoryId: 3,
      fileTypeId: 9,
      InsurnaceSuppPlan: [],
      UserIssuanceDetails: [],
      insCompany: [],
      loggedUserId: "",
      natureId: "",
      userId: "",
      premiumFreList: "",
      typePlanId: 0,
      suppPlanId: 0,
      insNameId: 0,
      insName: "",
      insComId: 0,
      premiumFrePerYear: "",
      SessPrimaryUserId: "",
      premiumAmt: "",
      insCardPath1: null,
      insCardPath2: null,
      spouseSameInsuranceData: [],
      insCompanyOther: "",
      maritalStatusId: "",
      typeofPlanOther: "",
      suppInsOther: "",
      disable: false,
      userInsuranceId: 0,
      update: false,
      // ------------------------------
      viewshowfile: false,
      viewFileId: "",
      selectfileName: "Click to Browse your file",
      fileuserInsDocId: "",
      fileuserInsId: "",
      spouseSameInsuranceDataForSpouse: [],
      documentTypeValue: "",
      afterunmappedfileexists: [],
      quesReponse: null
    };

    this.suppRef = React.createRef();
    this.typePlanRef = React.createRef();
    this.insCompanyRef = React.createRef();
  }

  componentDidMount() {
    let spouseUserId = sessionStorage.getItem("spouseUserId");
    let maritalStatusId = sessionStorage.getItem("maritalStatusId");
    let loggedUserId = sessionStorage.getItem("loggedUserId");
    let SessPrimaryUserId = sessionStorage.getItem("SessPrimaryUserId")
    this.setState({
      spouseUserId: spouseUserId,
      loggedUserId: loggedUserId,
      SessPrimaryUserId: SessPrimaryUserId,
      maritalStatusId: maritalStatusId,
    });
    // konsole.log("Health " + JSON.stringify(this.props.UserDetail));
    // this.FetchInsurancePlanType();
    // this.FetchInsuranceSupPlan();
    // this.GetUserIssuance();
    // this.fetchPremiumFreList();
    // this.fetchinsCompany();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.UserDetail.userId !== this.props.UserDetail.userId) {
      this.GetUserIssuance();
    }
    // debugger
    if (prevState.typePlanId !== this.state.typePlanId) {
      if (this.state.typePlanId != 2 && this.state.typePlanId != 3) {
        this.setState({
          suppPlanId: 0
        })
      }
    }

    if (prevState.show != true && this.state.show == true) {
      if (!this.state.InsurancePlanType?.length) this.FetchInsurancePlanType();
      if (!this.state.InsurnaceSuppPlan?.length) this.FetchInsuranceSupPlan();
      // this.GetUserIssuance();
      if (!this.state.premiumFreList?.length) this.fetchPremiumFreList();
      if (!this.state.insCompany?.length) this.fetchinsCompany();
    }
  }

  getQuestionResponse = (value) => {
    // konsole.log("vadsdsddlue",value)
    if (value) {
      const jsonString = JSON.stringify(value);
      this.setState({ quesReponse: jsonString })
    }
  }

  GetUserIssuance = () => {
    konsole.log("healthInsuranceat state", this.props.UserDetail.userId);
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserInsurance + this.props.UserDetail.userId, "", (response) => {
      this.props.dispatchloader(false);
      if (response) {
        konsole.log("getUserIns", response);
        this.setState({ ...this.state, UserIssuanceDetails: response.data.data, });
      } else {
        this.setState({ ...this.state, UserIssuanceDetails: [], });
        // alert(Msg.ErrorMsg);
        // konsole.log(Msg.ErrorMsg)
      }
    }
    );
  };

  GetUserSpuseIssuance = () => {
    konsole.log("healthInsuranceat stateSpouse", this.props.UserDetail.userId);
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserInsurance + this.props.UserDetail.userId, "", (response) => {
      this.props.dispatchloader(false);
      if (response) {
        konsole.log("getUserIns", response);
        this.setState({
          ...this.state,
          UserIssuanceDetails: response.data.data,
        });
      } else {
        // alert(Msg.ErrorMsg);
        // konsole.log(Msg.ErrorMsg)
      }
    }
    );
  };

  fetchPremiumFreList = () => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getPreFrequency, "", (response) => {
      if (response) {
        this.setState({
          ...this.state,
          premiumFreList: response.data.data,
        });
      }
    }
    );
  };

  FetchInsurancePlanType = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getHealthInsPlanType, "", (response) => {
      this.props.dispatchloader(false);
      if (response) {
        this.setState({
          ...this.state,
          InsurancePlanType: response.data.data,
        });
      } else {
        // alert(Msg.ErrorMsg);
        // konsole.log(Msg.ErrorMsg);
      }
    }
    );
  };

  FetchInsuranceSupPlan = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getHealthInsSupPlan, "", (response) => {
      this.props.dispatchloader(false);
      if (response) {
        this.setState({
          ...this.state,
          InsurnaceSuppPlan: response.data.data,
        });
      } else {
        // alert(Msg.ErrorMsg);
        // konsole.log(Msg.ErrorMsg);
      }
    }
    );
  };

  // getFileUploadDocuments=()=>{

  //   this.props.dispatchloader(true);
  //   $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getfileUploadDocuments,
  //     "", (response) => {
  //       this.props.dispatchloader(false);
  //       if (response) {
  //         this.setState({
  //           ...this.state,
  //           InsurnaceSuppPlan: response.data.data
  //         });
  //       }
  //       else {
  //         alert(Msg.ErrorMsg);
  //         konsole.log(Msg.ErrorMsg);
  //       }
  //     })
  // }

  handleClose = () => {
    this.context.setPageTypeId(null)
    this.handleClear(false);
  };

  handleShow = () => {
    this.context.setPageTypeId(1)
    this.setState({
      show: true,
    });
    this.GetUserIssuance();
  };

  fetchinsCompany = () => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getInsCompany, this.state, (response) => {
      if (response) {
        this.setState({
          ...this.state,
          insCompany: response.data.data,
        });
      }
    }
    );
  };

  handleInputChange = (event) => {
    const eventId = event.target.id;
    const eventValue = event.target.value;

    if (eventId == "insName") {
      let nameValue = $AHelper.capitalizeFirstLetter(eventValue);
      if ($AHelper.isAlphabetRegexWithSpaceAndDot(nameValue)) {
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
    } else if (eventId == "premiumAmt") {
      if ($AHelper.isNumberRegex(eventValue)) {
        this.setState({
          ...this.state,
          [eventId]: eventValue,
        });
      }
      // else {
      //   alert("please enter valid number");
      // }
    } else {
      this.setState({
        ...this.state,
        [eventId]: eventValue,
      });
    }
  };

  handleClear = (close) => {
    this.setState({
      ...this.state,
      typePlanId: "",
      suppPlanId: "",
      premiumFrePerYear: "",
      premiumAmt: "",
      insName: "",
      insComId: "",
      fileObj: null,
      update: false,
      viewshowfile: false,
      show: close,
      sameinsurance: undefined,
      natureId: "",
      documentTypeValue: "",
      UserIssuanceDetails: [],
      selectfileName: "Click to Browse your file",
      quesReponse: null
    });
  };

  validate = (state) => {
    let newError = "";

    if (state.typePlanId == 0) {
      newError = "Type of Plan cannot be empty";
      this.setState({ disable: false })
    }
    if (state.suppPlanId == 0) {
      newError = "supplement Insurance cannot be empty";
      this.setState({ disable: false })
    }
    if (state.insComId == 0) {
      newError = "Insurance Company cannot be empty";
      this.setState({ disable: false })
    }
    // if (state.insName == "") {
    //   newError = "Insurance Company cannot be empty";
    // }
    // if(state.premiumFrePerYear == ""){
    //   newError = "Premium Frequency cannot be empty";
    // }
    if (state.premiumAmt == "") {
      newError = "Premium Amount cannot be empty";
      this.setState({ disable: false })
    }
    // if(state.typePlanId == 0 && state.suppPlanId == 0 &&  state.insComId == 0 && state.premiumFrePerYear && state.premiumAmt == ""){
    //   newError = "Please Enter the Health Details";
    // }

    if (newError) {
      // alert(newError);
      this.toasterAlert(newError, "Warning");
      konsole.log(newError);
      return false;
    }

    return true;
  };

  fsameinsurance = (event) => {
    const radioName = event.target.name;
    const radioValue = event.target.value;
    // konsole.log(event.target.value);
    if (radioName == "sameinsurance" && radioValue == "Yes") {
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
  };

  updateInsurance = async (healthinsurance) => {
    konsole.log("healthinsurancehealthinsurance", healthinsurance)
    let fileId = healthinsurance?.userInsuranceDocs[0]?.fileId
    // let selectfileName =  (healthinsurance?.userInsuranceDocs[0]?.documentName) ? healthinsurance?.userInsuranceDocs[0]?.documentName : 'Click to Browse your file';
    let selectfileName = fileId ? healthinsurance?.typePlan : 'Click to Browse your file';
    let selectfileuserInsDocId = healthinsurance?.userInsuranceDocs[0]?.userInsDocId
    let selectfileuserInsId = healthinsurance?.userInsuranceDocs[0]?.userInsId

    let spouseSameInsuranceData = (healthinsurance.userInsuranceMaps.length > 0 && this.state.spouseUserId !== null) ? healthinsurance.userInsuranceMaps.filter((item) => item.userId === this.state.spouseUserId) : [];

    let isSameInsurance = (spouseSameInsuranceData.length > 0) ? true : false;

    konsole.log("updateHealth", healthinsurance, fileId, isSameInsurance, selectfileuserInsDocId);

    this.setState({
      typePlanId: healthinsurance?.typePlanId,
      suppPlanId: healthinsurance?.suppPlanId,
      insComId: healthinsurance?.insComId,
      insNameId: healthinsurance?.insNameId,
      premiumFrePerYear: healthinsurance?.premiumFrePerYear,
      premiumAmt: healthinsurance?.premiumAmt == null ? "" : healthinsurance?.premiumAmt,
      insName: healthinsurance?.insName,
      natureId: healthinsurance?.userInsuranceId,
      update: true,
      viewshowfile: fileId !== undefined ? true : false,
      viewFileId: fileId,
      selectfileName: selectfileName,
      fileuserInsDocId: (selectfileuserInsDocId !== undefined) ? selectfileuserInsDocId : 0,
      fileuserInsId: selectfileuserInsId,
      sameinsurance: isSameInsurance,
      spouseSameInsuranceData: spouseSameInsuranceData,
      documentTypeValue: healthinsurance?.insCardPath1 !== null ? healthinsurance?.insCardPath1 : "",
      spouseSameInsuranceDataForSpouse: healthinsurance.userInsuranceMaps,
      afterunmappedfileexists: healthinsurance?.userInsuranceDocs,
      quesReponse: healthinsurance.quesReponse
    });

    if (fileId && healthinsurance?.typePlanId == '999999') {
      const obj = { userId: this.props?.UserDetail?.userId, othersCategoryId: 31, othersMapNatureId: healthinsurance?.userInsuranceId, isActive: true, othersMapNature: '' }
      let selectedFileName = await getOtherFieldsName(obj);
      konsole.log('selectedFileName', selectedFileName);
      this.setState({ selectfileName: selectedFileName })
    }
  };

  selectFileUpload = () => {
    konsole.log("jahjs");
    document.getElementById("fileUploadLifeId").click();
  };

  handleFileSelection = (e) => {
    if (e.target.files.length == 0) {
      this.setState({ fileObj: null });
      return;
    }
    let typeOfFile = e.target.files[0].type;
    let fileofsize = e.target.files[0].size;
    konsole.log("etargetfile", e.target.files[0])
    konsole.log("typeOfFile", typeOfFile);
    if (typeOfFile !== "application/pdf") {
      // alert("only pdf format allowed");
      this.toasterAlert("only pdf format allowed", "Warning");
      return;
    }
    if ($AHelper.fileuploadsizetest(fileofsize)) {
      this.toasterAlert(fileLargeMsg, "Warning");
      this.setState({
        fileObj: null,
        selectfileName: "Click to Browse your file",
      });
      return;
    }

    this.setState({
      fileObj: e.target.files[0],
    });
  };



  validateFun = () => {
    const state = this.state
    if (state.typePlanId == 0 && state.suppPlanId == 0 && state.insComId == 0 && state.insName == "" && state.premiumFrePerYear == "" && state.premiumAmt == "") {
      this.toasterAlert("Fields cannot be blank, please fill in the details.", "Warning");
      return true;
    }
    return false;

  }

  handleFileUpload = () => {
    if (this.validateFun()) return;

    this.setState({ disable: true })
    if (this.state.fileObj !== null && this.state.fileObj !== undefined) {
      this.props.dispatchloader(true);
      $postServiceFn.postFileUpload(this.state.fileObj, this.props.UserDetail.userId, this.state.logginUserId, this.state.fileTypeId, this.state.fileCategoryId, 2, (response, errorData) => {
        this.props.dispatchloader(false);
        if (response) {
          konsole.log("resposneHealthData", response);

          let fileId = response.data.data.fileId;
          let documentPath = response.data.data.fileURL;
          let documentName = response.data.data.fileName;
          let responseData = response.data.data;
          // this.setState({selectfileName:'Click to Browse your file'})

          this.handleHealthInsSubmit(responseData?.fileId, responseData?.fileURL, responseData?.fileName);
          // this.postAddFileUpload(responseData)
        } else if (errorData) {
          // alert(errorData);
          konsole.log("errorData", errorData);
        }
      }
      );
    } else {
      this.handleHealthInsSubmit(null);
    }
  };


  resetNewHealthInsuranceDetails = () => {
    clearHealthInsuranceDetails()
  }
  handleHealthInsSubmit = async (fileId, documentPath, documentName, typePlanId, suppPlanId, insNameId) => {
    konsole.log("fileId", fileId);
    konsole.log("documentPath", documentPath);
    konsole.log("documentName", documentName);
    konsole.log("typePlanId", typePlanId);
    this.resetNewHealthInsuranceDetails()

    let inputdata = JSON.parse(JSON.stringify(this.state));
    konsole.log("inputdatainputdata", inputdata)

    let assetDocuments = [];
    if (fileId !== null) {
      assetDocuments = [{ documentName: documentName, documentPath: documentPath, fileId: fileId }];
      if (this.state.update == true) {
        // assetDocuments.push(updatejson)
        konsole.log("inputdata?.fileuserInsDocId", inputdata?.fileuserInsDocId)
        konsole.log("inputdata?.fileuserInsDocId", inputdata?.fileuserInsDocId);
        assetDocuments[0]["userInsDocId"] = inputdata?.fileuserInsDocId;
        assetDocuments[0]["userInsId"] = inputdata?.fileuserInsId;
      }
    } else {
      assetDocuments = [];
    }

    let insuranceinput = {
      typePlanId: inputdata.typePlanId == 0 ? null : inputdata.typePlanId,
      suppPlanId: inputdata.suppPlanId == 0 ? null : inputdata.suppPlanId,
      insComId: inputdata.insComId == 0 ? null : inputdata.insComId,
      premiumFrePerYear: inputdata.premiumFrePerYear == "" ? null : inputdata.premiumFrePerYear,
      premiumAmt: inputdata.premiumAmt == "" ? null : inputdata.premiumAmt,
      insCardPath1: inputdata.documentTypeValue, //for Policy No
      insCardPath2: inputdata.insCardPath2,
      insName: $AHelper.capitalizeAllLetters(inputdata.insName) == "" ? null : $AHelper.capitalizeAllLetters(inputdata.insName),
      insNameId: inputdata.insNameId == 0 ? null : inputdata.insNameId,
      userInsuranceDocs: assetDocuments,
      quesReponse: this.state?.quesReponse
    };

    if (this.props.UserDetail.userId == this.state.spouseUserId && this.state.spouseSameInsuranceDataForSpouse.length == 2 && this.state.update == true) {
      insuranceinput["createdBy"] = inputdata.loggedUserId;
      if (this.state.afterunmappedfileexists.length !== 0 && fileId == null) {
        let { documentPath, documentName, fileId } = this.state.afterunmappedfileexists[0]
        insuranceinput["userInsuranceDocs"] = [{
          documentName: documentName, documentPath: documentPath, fileId: fileId
        }];
      }


    } else {
      if (this.state.update == true) {
        insuranceinput["updatedBy"] = inputdata.loggedUserId;
        insuranceinput["userInsuranceId"] = inputdata.natureId;
      } else {
        insuranceinput["createdBy"] = inputdata.loggedUserId;
      }
    }
    let apiinputuserId = { userId: this.props.UserDetail.userId, insurance: insuranceinput, };

    konsole.log("postIns", JSON.stringify(apiinputuserId));
    this.props.dispatchloader(true);

    if (this.props.UserDetail.userId == this.state.spouseUserId && this.state.spouseSameInsuranceDataForSpouse.length == 2) {
      const method = "PUT";
      const apiUrl = $Service_Url.mapUpdateInsurance;
      const spouseSameInsuranceData = this.state.spouseSameInsuranceDataForSpouse?.find((i) => i.userId == this.state.spouseUserId);
      const insuranceMapId = spouseSameInsuranceData?.userInsMapId;
      const loggedInUser = this.state.loggedUserId;

      const userPostData = {
        userInsMapId: insuranceMapId,
        isDeleted: true,
        updatedBy: loggedInUser,
      };
      konsole.log("userPostData", userPostData, method, apiUrl);
      await $postServiceFn.unMappedInsDataofSpouse(method, apiUrl, userPostData);
    }
    this.ApiForHealthIns(apiinputuserId);
  };

  ApiForHealthIns = async (apiuserdata) => {
    konsole.log("apiuserdatadata", JSON.stringify(apiuserdata));
    let apiurl = $Service_Url.postaddUserInsurance;
    let method = "POST";
    if (this.state.update == true) {
      apiurl = $Service_Url.putupdateuserinsurance;
      method = "PUT";
      AlertToaster.success("Data updated successfully");
    }
    if (this.props.UserDetail.userId == this.state.spouseUserId && this.state.spouseSameInsuranceDataForSpouse.length == 2 && this.state.update == true) {
      apiurl = $Service_Url.postaddUserInsurance;
      method = "POST";
    }

    konsole.log("jsonjson", JSON.stringify(apiuserdata), method, apiurl);
    // this.state.disable=true
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(method, apiurl, apiuserdata, async (response, errorData) => {
      this.props.dispatchloader(false);
      konsole.log("responseresponse", response);
      konsole.log("falsefalse", JSON.stringify(response?.data?.data));
      this.setState({ selectfileName: "Click to Browse your file" });
      //  this.setState({update:false})
      // konsole.log("Success res" + JSON.stringify(response));
      if (response) {
        // this.setState({disable: false})
        let responseIns = response.data.data;
        const spouseSameInsuranceData = this.state.spouseSameInsuranceData;
        const sameWithPrimary = this.state.sameinsurance;
        konsole.log("ResIns spouse", responseIns);
        let spouseUserId;
        if (spouseSameInsuranceData.length == 0 && sameWithPrimary == true) {
          spouseUserId = this.state.spouseUserId;

        }
        if (this.props.UserDetail.userId == this.state.spouseUserId && this.state.spouseSameInsuranceDataForSpouse.length == 2 && this.state.update == true) {
          // this.setState({disable: false})
          if (this.state?.suppPlanId == "999999") {
            let result = await this.suppRef.current.saveHandlerOtherOnlypost(responseIns?.insurance[0]?.userInsuranceId);
            konsole.log("resultresult", result)
          }
          if (this.state?.typePlanId == "999999") {
            let result = await this.typePlanRef.current?.saveHandlerOtherOnlypost(responseIns?.insurance[0]?.userInsuranceId);
            konsole.log("resultresult", result)
          }
          if (this.state?.insComId == "999999") {
            let result = await this.insCompanyRef.current?.saveHandlerOtherOnlypost(responseIns?.insurance[0]?.userInsuranceId);
            konsole.log("resultresult", result)
          }
          // this.setState({disable: false})
        } else {
          if (this.state?.suppPlanId == "999999") {
            this.suppRef.current.saveHandleOther(responseIns?.insurance[0]?.userInsuranceId, spouseUserId);
          }
          if (this.state?.typePlanId == "999999") {
            this.typePlanRef.current?.saveHandleOther(responseIns?.insurance[0]?.userInsuranceId, spouseUserId);
          }
          if (this.state?.insComId == "999999") {
            this.insCompanyRef.current?.saveHandleOther(responseIns?.insurance[0]?.userInsuranceId, spouseUserId);
          }
        }
        if (method == "POST") {
          const method = "POST";
          const apiUrl = $Service_Url.mapUserInsurance;
          const userPostData = {
            userId: responseIns?.userId,
            userInsId: responseIns?.insurance[0]?.userInsuranceId,
            sameInsUserId: null,
            createdBy: this.state.loggedUserId,
          };
          this.props.dispatchloader(true);
          await $postServiceFn.mapDataWithPrimaryUser(method, apiUrl, userPostData);


          this.props.dispatchloader(false);
        }
        if (this.state.sameinsurance !== undefined) {
          // AlertToaster.success("Data saved successfully");

          // alert("jjj")
          let method = "POST";
          let apiUrl = $Service_Url.mapUserInsurance;
          let userPostData = {};
          const loggedInUser = this.state.loggedUserId;
          konsole.log("afsdgasdfhdgfhdf", spouseSameInsuranceData);
          if (spouseSameInsuranceData.length > 0 && sameWithPrimary == false) {
            method = "PUT";
            apiUrl = $Service_Url.mapUpdateInsurance;
            const insuranceMapId = spouseSameInsuranceData[0].userInsMapId;
            userPostData = {
              userInsMapId: insuranceMapId,
              isDeleted: true,
              updatedBy: loggedInUser,
            };
          } else if (spouseSameInsuranceData.length == 0 && sameWithPrimary == true) {
            userPostData = {
              userId: this.state.spouseUserId,
              userInsId: responseIns?.insurance[0]?.userInsuranceId,
              sameInsUserId: this.state.SessPrimaryUserId,
              createdBy: loggedInUser,
            };
          }
          this.props.dispatchloader(true);
          // const resposneHealthData = await $postServiceFn.mapInsuranceWithSpouseUser(method, apiUrl, this.state.spouseSameInsuranceData, this.state.sameinsurance, userPostData);
          if (Object.keys(userPostData)?.length) await $postServiceFn.mapInsuranceWithSpouseUser(method, apiUrl, this.state.spouseSameInsuranceData, this.state.sameinsurance, userPostData);
          this.props.dispatchloader(false);
        } else {
          // this.setState({disable:false})
        }
        if (method == "POST") {
          AlertToaster.success("Data saved successfully");
        }

        this.handleClose();
        this.setState({ disable: false })
        // this.setState({disable:false})
      } else {
        // alert(Msg.ErrorMsg);
        this.setState({ disable: false })
        // konsole.log(ErrorMsg)
      }
    }
    );
  };

  toasterAlert(text, type) {
    this.context.setdata({ open: true, text: text, type: type });
  }

  deleteUserData = async (data, userid, loggedUserId) => {
    const req = await this.context.confirm(true, "Are you sure? you want to delete", "Confirmation");
    if (!req) return;
    konsole.log("datataDelete", data, `?UserId=${userid}&UserInsuranceId=${data.userInsuranceId}&DeletedBy=${loggedUserId}`)
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("DELETE",
      $Service_Url.deleteUserInsurance + `?UserId=${userid}&UserInsuranceId=${data?.userInsuranceId}&DeletedBy=${loggedUserId}`, "", (response, err) => {
        this.props.dispatchloader(false);
        if (response) {
          konsole.log("responseDeleteBuss", response)
          AlertToaster.success("Data Deleted Successfully");
          this.resetNewHealthInsuranceDetails();
          this.handleClear(true);
          this.GetUserIssuance()
        } else {
          konsole.log("deleteErrorr", err)
        }
      });

  }

  render() {
    konsole.log('afterunmappedfileexists', this.state.afterunmappedfileexists)
    konsole.log("fileuserInsDocIdfileuserInsDocId", this.state.fileuserInsDocId)
    konsole.log("spouseSameInsuranceDataForSpouse", this.state.spouseSameInsuranceDataForSpouse, this.state.spouseUserId);
    // konsole.log("thquesReponse",this.state?.quesReponse)
    let finddata = this.state.spouseSameInsuranceDataForSpouse?.find((i) => i.userId == this.state.spouseUserId);

    konsole.log("spouseSameInsuranceDataForSpouse", finddata);
    konsole.log("documentTypeValue", this.state.documentTypeValue);
    konsole.log("thisprops", this.props, this.state.typePlanId);
    konsole.log("UserIssuanceDetails", this.state.UserIssuanceDetails);
    konsole.log("health Insurancehealth Insurance", this.state, this.props.UserDetail.userId, this.state.spouseUserId, this.props.UserDetail.userId == this.state.spouseUserId && this.state.spouseSameInsuranceDataForSpouse.length == 2, this.state.spouseSameInsuranceDataForSpouse);
    const primaryUserId = sessionStorage.getItem("SessPrimaryUserId");
    let userId = this.props.UserDetail ? this.props.UserDetail.userId : "";
    let typePlanObj = {};
    let suppPlanObj = {};
    let insNameObj = {};

    konsole.log("premiumFreList", this.state.premiumFreList);
    // let premiumFrePerYearObj = this.state.premiumFreList[this.state.premiumFrePerYear - 2] || 0;
    let premiumFrePerYearObj = this.state.premiumFrePerYear !== "" ? this.state.premiumFreList?.filter((res) => { return res.label == this.state.premiumFrePerYear; }) : 0;

    if ($AHelper.typeCasteToString(this.state.typePlanId) !== "999999") {
      typePlanObj = this.state.InsurancePlanType[this.state.typePlanId - 2] || 0;
    } else {
      typePlanObj = this.state.InsurancePlanType[this.state.InsurancePlanType.length - 1] || 0;
    }
    if ($AHelper.typeCasteToString(this.state.suppPlanId) !== "999999") {
      suppPlanObj = this.state.InsurnaceSuppPlan[this.state.suppPlanId - 2] || 0;
    } else {
      suppPlanObj = this.state.InsurnaceSuppPlan[this.state.InsurnaceSuppPlan.length - 1] || 0;
    }

    if ($AHelper.typeCasteToString(this.state?.insComId) !== "999999") {
      insNameObj = this.state?.insCompany[this.state.insComId - 1] || 0;
    } else {
      insNameObj = this.state?.insCompany[this.state?.insCompany.length - 1] || 0;
    }

    konsole.log("ref", this.suppRef);
    konsole.log("ref", this.typePlanRef);
    konsole.log("userDetails", this.props.UserDetail.userId, this.state.spouseUserId, this.state.spouseSameInsuranceDataForSpouse.length);
    konsole.log("UserDetailUserDetailUserDetail", this.props.UserDetail?.relationshipName !== "Self");
    konsole.log("USERUSER", this.state.spouseUserId !== "null" && userId == primaryUserId);
    konsole.log("spouseSameInsuranceData", this.state.spouseSameInsuranceData, this.state.spouseUserId);

    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
        `}</style>
        <a onClick={this.handleShow}>
          <img src="/icons/add-icon.svg" alt="Health Insurance" />
        </a>

        <Modal
          size="lg"
          show={this.state.show}
          centered
          enforceFocus={false}
          onHide={this.handleClose}
          animation="false"
          id="healthInsurance"
          backdrop="static"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title className="d-flex w-100 justify-content-start">
              Health Insurance-{" "}{this.props.UserDetail.fName + " " + (this.props.UserDetail.mName !== null ? this.props.UserDetail.mName : "") + " " + this.props.UserDetail.lName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mt-2">
              <Col xs="12" sm="12" md="4" lg="4" className="d-flex align-items-center mb-2">
                <Select
                  onChange={(event) => this.setState({ typePlanId: event.value, suppPlanId: (event.value === "5") ? "" : this.state.suppPlanId })}
                  className="w-100 custom-select"
                  options={this.state.InsurancePlanType}
                  placeholder="Type of Plan"
                  value={typePlanObj}
                />
              </Col>
              {konsole.log(typePlanObj, "typePlanObj")}
              <Col xs="12" sm="12" md="4" lg="4" className={`${this.state.typePlanId == "999999" ? "d-flex align-items-center mb-2" : ""}  d-md-none `}>
                {this.state.typePlanId == "999999" && (
                  <Other othersCategoryId={31} userId={userId} dropValue={this.state.typePlanId} ref={this.typePlanRef} natureId={this.state.natureId} />
                )}
              </Col>
              <Col xs="12" sm="12" md="4" lg="4" className="mb-2">
                {this.state.typePlanId == 5 ? (
                  <></>
                ) : ((typePlanObj.value == 2 || typePlanObj.value == 3) &&
                  <Select
                    onChange={(event) => this.setState({ suppPlanId: event.value })}
                    className="w-100 custom-select"
                    options={this.state.InsurnaceSuppPlan}
                    placeholder="Supplement Insurance"
                    value={suppPlanObj}
                  />
                )}
              </Col>
              <Col xs="12" sm="12" md="4" lg="4" className={`${this.state.suppPlanId == "999999" && this.state.typePlanId != 5 ? "d-flex align-items-center  mb-2" : ""} d-md-none`} >
                {this.state.suppPlanId == "999999" && this.state.typePlanId != 5 && (
                  <Other othersCategoryId={30} userId={userId} dropValue={this.state.suppPlanId} ref={this.suppRef} natureId={this.state.natureId} />
                )}
              </Col>
              <Col xs="12" sm="12" md="4" lg="4" className="d-flex align-items-center mb-2">
                <Select
                  className="w-100 custom-select"
                  options={this.state.insCompany}
                  onChange={(event) => this.setState({ insComId: event.value })}
                  placeholder="Insurance Company"
                  value={insNameObj}
                  maxMenuHeight={160}
                />
              </Col>
              <Col xs="12" sm="12" md="4" lg="4" className={`${this.state.insComId == "999999" ? "d-flex align-items-center mb-2" : ""} d-md-none`}>
                {this.state.insComId == "999999" && (
                  <Other othersCategoryId={35} userId={userId} dropValue={this.state.insComId} natureId={this.state.natureId} ref={this.insCompanyRef} />
                )}
              </Col>
            </Row>

            <Row className="d-none d-md-flex">
              <Col xs="12" sm="12" md="4" lg="4" className={this.state.typePlanId == "999999" ? "d-flex align-items-center mb-3" : ""} >
                {this.state.typePlanId == "999999" && (
                  <Other othersCategoryId={31} userId={userId} dropValue={this.state.typePlanId} ref={this.typePlanRef} natureId={this.state.natureId} />
                )}
              </Col>
              <Col xs="12" sm="12" md="4" lg="4" className={this.state.suppPlanId == "999999" && this.state.typePlanId != 5 ? "d-flex align-items-center  mb-3" : ""} >
                {this.state.suppPlanId == "999999" && this.state.typePlanId != 5 && (
                  <Other othersCategoryId={30} userId={userId} dropValue={this.state.suppPlanId} ref={this.suppRef} natureId={this.state.natureId} />
                )}
              </Col>
              <Col xs="12" sm="12" md="4" lg="4" className={this.state.insComId == "999999" ? "d-flex align-items-center mb-3" : ""}>
                {this.state.insComId == "999999" && (
                  <Other othersCategoryId={35} userId={userId} dropValue={this.state.insComId} natureId={this.state.natureId} ref={this.insCompanyRef} />
                )}
              </Col>
            </Row>

            <Row className="">
              <Col xs="12" sm="12" md="4" lg="4" className="d-flex align-items-center mb-2">
                <Form.Control
                  className="upperCasing"
                  type="text"
                  id="insName"
                  name="insName"
                  onChange={(event) => { this.handleInputChange(event); }}
                  value={this.state.insName}
                  placeholder="Insurance Name"
                />
              </Col>

              <Col xs="12" sm="12" md="4" lg="4" className="d-flex align-items-center mb-2">
                <Select
                  className="w-100 custom-select"
                  options={this.state.premiumFreList}
                  onChange={(event) => this.setState({ premiumFrePerYear: event.label })}
                  placeholder="Premium Frequency"
                  value={premiumFrePerYearObj}
                  maxMenuHeight={120}
                />
              </Col>

              <Col xs="12" sm="12" md="4" lg="4" className="d-flex align-items-center mb-2">
                <CurrencyInput
                  prefix="$"
                  className="border"
                  placeholder="Premium Amount"
                  id="premiumAmt"
                  name="premiumAmt"
                  onValueChange={(value) => { this.setState({ premiumAmt: value }); }}
                  value={this.state.premiumAmt}
                  decimalScale="2"
                  allowNegativeValue={false}
                />
              </Col>
            </Row>
            <Form.Group as={Row} className="">
              <Col xs="12" sm="12" md="4" lg="6" className="mb-2"> <Form.Control
                type="text"
                value={$AHelper.capitalizeFirstLetter(this.state.documentTypeValue)}
                id="DocumentType"
                placeholder="Policy No "
                className="policyHealth"
                onChange={(e) => this.setState({ documentTypeValue: e.target.value })}
              />
              </Col>

              <Col xs="12" sm="12" md="4" lg="6" className="mb-2">
                <div className="d-flex justify-content-between align-items-center p-0 " >
                  <div className="ps-2 d-flex align-items-center fileInoutHealth" >
                    {fileNameShowInClickHere(this.state.fileObj, this.state.selectfileName)}
                  </div>
                  <span className="bg-secondary text-white cursor-pointer uploadButtonHeath" onClick={this.selectFileUpload}>
                    Upload
                  </span>
                  <div style={{ height: "100%", borderRadius: "0px 3px 3px 0px" }}>
                    <input className="d-none" type="file" accept="application/pdf" id="fileUploadLifeId" onChange={this.handleFileSelection} />
                    {this.state.viewshowfile && (
                      <PdfViewer2 viewFileId={this.state.viewFileId} />
                    )}
                  </div>
                </div>

              </Col>

            </Form.Group>

            {/* <Row className="m-0 mb-4">
              <Col xs md="10" className="d-flex align-items-center px-0">
                <div className="input-group me-3">
                  <input
                    type="file"
                    className="form-control"
                    id="inputGroupFile02"
                    placeholder="Upload Insurance card and paper work"
                  />
                  <label className="input-group-text" for="inputGroupFile02">
                    Upload
                  </label>
                </div>
                <p>(Optional)</p>
              </Col>
            </Row> */}
            {this.state.spouseUserId !== "null" && userId == primaryUserId && (
              <Row className="mb-1">
                <Col xs="12" sm="12" lg="12" id="healthInsurance1">
                  <label className="">
                    {`Does your ${this.state.maritalStatusId == 2 ? "Partner" : "spouse"} have the same insurance ?`}{" "}
                  </label>
                  <div className="d-flex justify-content-start align-items-end">
                    <div key="checkbox8" className="me-4 pe-3 mb-0 d-flex align-items-center" >
                      <Form.Check
                        className="chekspace"
                        type="radio"
                        id="checkbox8212"
                        label="Yes"
                        value="Yes"
                        name="sameinsurance"
                        onChange={(event) => this.fsameinsurance(event)}
                        checked={this.state?.sameinsurance == true}
                      />
                    </div>
                    <div key="checkbox812" className="me-4 pe-3 mb-0 d-flex align-items-center" >
                      <Form.Check
                        className="chekspace"
                        type="radio"
                        id="checkbox8"
                        label="No"
                        value="No"
                        name="sameinsurance"
                        onChange={(event) => this.fsameinsurance(event)}
                        checked={this.state?.sameinsurance == false}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            )}
            <ExpensesPaidQuestion getQuestionResponse={this.getQuestionResponse} quesReponse={this.state?.quesReponse} />
            <Row className="mb-3">
              <Col xs="12" sm="12" md="12" className="text-right">
                <Button style={{ backgroundColor: "#76272b", border: "none" }} className="theme-btn"
                  onClick={() => this.handleFileUpload()}
                  disabled={this.state.disable == true ? true : false}
                >
                  {this.state.update == true ? "Update" : "Save"}
                </Button>
              </Col>
            </Row>
            {this.state.UserIssuanceDetails.length > 0 && (
              <div className="border-1 mb-3 d-block w-100 " style={{ maxHeight: "20vh", overflowY: "auto" }}>
                <Table bordered className="w-100 table-responsive financialInformationTable">
                  <thead className='text-center align-middle'>
                    <tr>
                      <th>Type of Plan</th>
                      <th>Supplement Insurance </th>
                      <th>Insurance Company</th>
                      <th>Insurance Name</th>
                      <th>Premium Frequency</th>
                      <th>Premium Amount</th>
                      <th>Policy No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.UserIssuanceDetails.map((userissuance, index) => {
                      konsole.log("othersMapNatureId", userissuance)
                      return (<>

                        <tr style={{ wordBreak: "break-word", textAlign: 'center' }} className="mb-5">
                          <td xs style={{ wordBreak: "break-word" }}>
                            <OtherInfo othersCategoryId={31} othersMapNatureId={userissuance?.userInsuranceId} FieldName={userissuance?.typePlan || "-"} userId={userId} />
                          </td>
                          <td style={{ wordBreak: "break-word" }} >
                            <OtherInfo othersCategoryId={30} othersMapNatureId={userissuance?.userInsuranceId} FieldName={userissuance?.suppPlan || "-"} userId={userId} />
                          </td>
                          <td style={{ wordBreak: "break-word" }} >
                            <OtherInfo othersCategoryId={35} othersMapNatureId={userissuance?.userInsuranceId} FieldName={userissuance?.insComName || "-"} userId={userId} />
                          </td>

                          <td style={{ wordBreak: "break-word" }} > {$AHelper.capitalizeAllLetters(userissuance?.insName || "-")} </td>
                          <td style={{ wordBreak: "break-word" }} >{userissuance?.premiumFrePerYear || "-"}</td>
                          <td style={{ wordBreak: "break-word" }} >{userissuance?.premiumAmt !== null ? $AHelper.IncludeDollars(userissuance.premiumAmt) : "-"}</td>
                          <td style={{ wordBreak: "break-word" }} > {userissuance?.insCardPath1 || "-"} </td>

                          <td style={{ verticalAlign: "middle" }}>
                            {/* <div  className='d-flex flex-row align-items-center justify-content-center gap-1' style={{ width: '5rem' }}>
                                      <span style={{ textDecoration: "underline", cursor: "pointer" }}  onClick={() => this.updateInsurance(userissuance)}  >Edit</span>
                                        <div className="m-0 p-0">
                                        <span className="cursor-pointer" onClick={() => this.deleteUserData(userissuance,this.props.UserDetail.userId, this.state.loggedUserId)} >
                                     <img src="/icons/deleteIcon.svg" className="m-0 p-0 img-fluid" alt="g4" style={{ height: "20px" }} /></span></div>
                                      </div> */}
                            <div className="d-flex justify-content-center gap-3">
                              <div className=' d-flex flex-column align-items-center' onClick={() => this.updateInsurance(userissuance)} >
                                <img className="cursor-pointer mt-0" src="/icons/EditIcon.png" alt=" Mortgages" style={{ width: "20px" }} />
                                {/* <span className='fw-bold mt-1' style={{ color: "#720C20", cursor: "pointer"}}>Edit</span> */}
                              </div>
                              <div>
                                <span style={{ borderLeft: "2px solid #e6e6e6", paddingLeft: "5px", height: "40px", marginTop: "5px" }} className="cursor-pointer" onClick={() => this.deleteUserData(userissuance, this.props.UserDetail.userId, this.state.loggedUserId)}>
                                  <img src="/icons/deleteIcon.svg" className="mt-0" alt="g4" style={{ width: "20px" }} />
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
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

export default connect(mapStateToProps, mapDispatchToProps)(healthinsurance);