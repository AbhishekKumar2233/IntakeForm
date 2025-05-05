import moment from "moment";
import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, } from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { $AHelper } from "./control/AHelper";
import konsole from "./control/Konsole";
import { $CommonServiceFn, $postServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import Other from "./asssets/Other";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { Msg } from "./control/Msg";
import PdfViewer2 from "./PdfViwer/PdfViewer2";
import { globalContext } from "../pages/_app";
import DatepickerComponent from "./DatepickerComponent";
import OtherInfo from "./asssets/OtherInfo";
// import { connect } from 'react-redux';
import AlertToaster from "./control/AlertToaster";
import { fileLargeMsg } from "./control/Constant";
import TableEditAndViewForDecease from "./Deceased/TableEditAndViewForDecease";
import ExpensesPaidQuestion from "./ExpensesPaidQues";
import { fileNameShowInClickHere, getOtherFieldsName, isNotValidNullUndefile } from "./Reusable/ReusableCom";

class LifeInsuranceForm extends Component {
  static contextType = globalContext;
  constructor(props) {
    super(props);
    this.state = {
      fileCategoryId: 5, //finance,
      fileTypeId: 12, //life Insurance
      fileObj: null,
      show: false,
      showOtherOption: false,
      userLifeInsuranceId: null,
      InsProvider: [],
      startDate: new Date(),
      typeofPolicy: [],
      beneficiaryList: [],
      premiumFreList: [],
      lifeInsurances: [],
      logginUserId: sessionStorage.getItem("loggedUserId"),
      logginPrimaryUserId: sessionStorage.getItem("SessPrimaryUserId"),
      spouseUserId: sessionStorage.getItem("spouseUserId"),
      primaryUserDetail: JSON.parse(
        sessionStorage.getItem("userDetailOfPrimary")
      ),
      userId: this.props.userId || "",
      insuranceCompanyId: 0,
      policyTypeId: 0,
      policyStartDate: "",
      policyExpiryDate: "",
      premium: 0,
      cashValue: "",
      premiumAmount: '',
      deathBenefits: "",
      disable: false,
      updateInsurance: false,
      beneficiaryObj: {},
      beneficiaryUserId: "",
      insuranceDocObj: {},
      documentTypeValue: "",
      insuranceDocs: [{ userLifeInsuranceId: 0, documentName: "", documentPath: "", },],
      viewshowfile: false,
      fileuserInsDocId: "",
      fileuserInsId: "",
      viewFileId: "",
      selectfileName: "Click to Browse your file",
      selectFilePath: "",
      selectFileisActive: "",
      quesReponse:null
    };

    this.insCompanyRef = React.createRef();
    this.policyRef = React.createRef();
  }

  componentDidMount() {
    const spouseUserId = sessionStorage.getItem("spouseUserId");
    if (spouseUserId == "null") {
      this.fetchInsProvider();
      this.feetchPolicy();
      this.fetchBeneficiaryList();
      this.fetchPremiumFreList();
      this.fetchLifeInsurance(this.props.userId);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userId !== this.props.userId) {
      this.setState({
        userId: this.props.userId,
      });
    }
  }

  handleClose = () => {
    this.setState({
      show: !this.state.show && this.props?.showLifeIns(),
    });
    this.handleClear();
  };

  handleShow = () => {
    this.fetchInsProvider();
    this.feetchPolicy();
    this.fetchBeneficiaryList();
    this.fetchPremiumFreList();
    this.fetchLifeInsurance(this.props.userId);
    this.setState({
      show: !this.state.show,
    });
  };

  fetchLifeInsurance = (userId) => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getLifeInsByUserId + userId, "", (response) => {
      this.props.dispatchloader(false);
      if (response) {
        konsole.log("Life InsuranceLife Insurance  ", response);
        this.setState({
          ...this.state,
          lifeInsurances: response.data.data.lifeInsurances,
        });
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

  handleSelectChange = (event) => {
    const selectedValue = event.value;
    if (selectedValue == "Other") {
      this.setState({ ...this.state, showOtherOption: true });
    } else {
      this.setState({ ...this.state, showOtherOption: false });
    }
  };

  handleInputChange = (event) => {
    const attrName = event.target.name;
    const attrValue = event.target.value;
    this.setState({
      [attrName]: attrValue,
    });
  };

  fetchBeneficiaryList = () => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getBeneficiaryByUserId + this.state.logginPrimaryUserId, "", async (response) => {
      if (response) {
        let filterSpouse = response.data.data.filter((item) => item.value !== this.state.userId);
        // konsole.log("beneficiaryList", filterSpouse);
        if (this.state.userId == this.state.spouseUserId) {
          let url = `${$Service_Url.postMemberRelationship}/${this.state.spouseUserId}?primaryUserId=${this.state.spouseUserId}`;
          let method = "GET";
          let results = await $postServiceFn.memberRelationshipAddPut(method, url);
          if (results?.data?.data?.isBeneficiary == true) {
            konsole.log('resultsresults', results)
            filterSpouse.unshift({
              value: this.state.logginPrimaryUserId,
              label: this.state.primaryUserDetail.memberName,
            });
          }

        }
        this.setState({
          ...this.state,
          beneficiaryList: filterSpouse,
        });
      }
    }
    );
  };

  feetchPolicy = () => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getInsPolicyType, this.state, (response) => {
      if (response) {
        this.setState({
          ...this.state,
          typeofPolicy: response.data.data,
        });
      }
    }
    );
  };

  fetchInsProvider = () => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getInsProvider, this.state, (response) => {
      if (response) {
        this.setState({
          ...this.state,
          InsProvider: response.data.data,
        });
      }
    }
    );
  };

  handleClear = (type) => {
    this.setState({
      insuranceCompanyId: 0,
      policyTypeId: "",
      policyStartDate: "",
      policyExpiryDate: "",
      premium: "",
      cashValue: "",
      deathBenefits: "",
      updateInsurance: false,
      beneficiaryUserId: "",
      fileObj: null,
      viewshowfile: false,
      fileuserInsDocId: "",
      fileuserInsId: "",
      viewFileId: "",
      selectfileName: "Click to Browse your file",
      selectFilePath: "",
      selectFileisActive: "",
      documentTypeValue: "",
      premiumAmount: '',
      quesReponse:null
    });
    this.fetchLifeInsurance(this.props.userId);
  };

  validate = () => {
    let nameError = "";
    // if (this.state.premium == "") {
    //   nameError = " Premium cannot be blank"
    // }
    // if (this.state.deathBenefits == "") {
    //   nameError = "Death benefit cannot be blank"
    // }
    // if (this.state.policyStartDate == "") {
    //   nameError = "Please enter the policy expiry date"
    // }
    // if (this.state.policyStartDate == "") {
    //   nameError = "Please enter the policy start date"
    // }
    // if (this.state.policyTypeId == 0) {
    //   nameError = "Type of Policy cannot be Blank"
    // }
    if (this.state.insuranceCompanyId == "") {
      nameError = "Insurance Company cannot be Blank";
    }
    // if (this.state.premium == 0) {
    //   nameError = "Premium cannot be Blank"
    // }

    if (nameError) {
      // alert(nameError);

      this.setState({ disable: false })
      this.toasterAlert(nameError, "Warning");

      return false;
    }
    return true;
  };
  handleFileUpload = (type) => {
    this.setState({ disable: true })
    if (this.state.fileObj !== null && this.state.fileObj !== undefined) {
      this.props.dispatchloader(true);
      $postServiceFn.postFileUpload(this.state.fileObj, this.state.userId, this.state.logginUserId, this.state.fileTypeId, this.state.fileCategoryId, 2,
        (response, errorData) => {
          this.props.dispatchloader(false);
          if (response) {
            konsole.log("resposneFile", response);
            const { fileId, userFileName, fileURL } = response?.data?.data;
            this.handleInsSubmit(fileId, userFileName, fileURL, type);
          } else if (errorData) {
            // alert(errorData);
            this.toasterAlert(errorData, "Warning");
          }
        },
        this.state.fileObj?.name
      );
    } else {
      this.handleInsSubmit(null,null,null,type);
    }
  };

  toasterAlert = (test, type) => {
    this.context.setdata($AHelper.toasterValueFucntion(true, test, type));
  }

  handleInsSubmit = (fileId, fileName, filePath,type) => {

    // konsole.log("fileId", fileId);
    let policyStartDate = "";
    let policyExpiryDate = "";
    let policyStartDateObj1 = "";
    let policyExpiryDateObj2 = "";

    if (this.state.policyStartDate !== "" && this.state.policyStartDate !== null && this.state.policyStartDate !== undefined) {
      policyStartDate = $AHelper.getFormattedDate(this.state.policyStartDate);
    }
    if (this.state.policyExpiryDate !== "" && this.state.policyExpiryDate !== null && this.state.policyExpiryDate !== undefined) {
      policyExpiryDate = $AHelper.getFormattedDate(this.state.policyExpiryDate);
    }

    if (policyStartDate != "" && policyExpiryDate != "") {
      policyStartDateObj1 = new Date(policyStartDate);
      policyExpiryDateObj2 = new Date(policyExpiryDate);
      if (policyStartDateObj1 >= policyExpiryDateObj2) {
        this.toasterAlert("Enter a valid expirey date", "Warning");
        this.setState({ policyExpiryDate: "" })
        this.setState({ disable: false })
        return;
      }
    }

    let beneficiaries = {};
    let lifeInsurance = {
      insuranceCompanyId: this.state.insuranceCompanyId,
      policyTypeId: this.state.policyTypeId,
      policyStartDate: policyStartDate,
      policyExpiryDate: policyExpiryDate,
      premiumId: this.state.premium,
      cashValue: this.state.cashValue,
      deathBenefits: this.state.deathBenefits,
      additionalDetails: this.state.documentTypeValue,
      premium: this.state.premiumAmount,
      quesReponse:this.state?.quesReponse
    };

    konsole.log("lifeInsurance", lifeInsurance);
    let Url = $Service_Url.postaddLifeInsurance;
    let method = "POST";
    if (this.state.updateInsurance) {
      Url = $Service_Url.putLifeInsByUserId;
      method = "PUT";
      if (this.state.beneficiaryObj !== undefined) {
        beneficiaries["userLifeInsuranceBeneficiaryId"] = this.state.beneficiaryObj?.userLifeInsuranceBeneficiaryId || null;
      }
      beneficiaries["beneficiaryName"] = "do not know";
      beneficiaries["beneficiaryUserId"] = this.state.beneficiaryUserId;
      lifeInsurance["updatedBy"] = this.state.logginUserId;
      lifeInsurance["userLifeInsuranceId"] = this.state.userLifeInsuranceId;
      lifeInsurance["isActive"] = true;
    } else {
      lifeInsurance["createdBy"] = this.state.logginUserId;
      beneficiaries["beneficiaryUserId"] = this.state.beneficiaryUserId;
      lifeInsurance["isActive"] = true;
    }
    if (this.state.beneficiaryUserId !== "") {
      lifeInsurance["beneficiary"] = [beneficiaries];
    }
    if (fileId !== null) {
      lifeInsurance["insuranceDocs"] = [{
        docFileId: fileId,
        // docFileName : fileName,
        documentName: fileName,
        documentPath: filePath,
      },
      ];
      if (this.state.updateInsurance == true) {
        lifeInsurance["insuranceDocs"][0]["userLifeInsuranceDocId"] = this.state.fileuserInsDocId;
        lifeInsurance["insuranceDocs"][0]["isActive"] = this.state.selectFileisActive;
      }
    }

    let InsPostData = {
      userId: this.state.userId,
      lifeInsurance: lifeInsurance,
    };
    konsole.log(" ", lifeInsurance);
    konsole.log("inspostDatainspostData", JSON.stringify(InsPostData));

    if (this.validate()) {
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi(method, Url, InsPostData, (response) => {
        this.props.dispatchloader(false);
        if (response) {
          this.setState({ disable: false })
          konsole.log("Success res" + JSON.stringify(response));
          this.setState({ selectfileName: "Click to Browse your file" });

          konsole.log("Success res", response);
          AlertToaster.success(`Data ${this.state.updateInsurance == true ? "updated" :"saved" } successfully`);
          // alert("form submit successfully");
          let responseLifeIns = response.data.data.lifeInsurances[0];
          if (this.state.insuranceCompanyId == "999999") {
            this.insCompanyRef.current.saveHandleOther(responseLifeIns.userLifeInsuranceId);
          }
          if (this.state.policyTypeId == "999999") {
            this.policyRef.current.saveHandleOther(responseLifeIns.userLifeInsuranceId);
          }
          this.handleClear();
          console.log("typetype",type)
          if (type != 'addmore') {
            this.handleClose();
          }
        } else {
          this.toasterAlert(Msg.ErrorMsg, response, "Warning");
          this.setState({ disable: false })
        }
      });
    }
  };

  handleFileSelection = (e) => {
    if (e.target.files.length == 0) {
      this.setState({
        fileObj: null,
      });
      return;
    }
    let typeOfFile = e.target.files[0].type;
    let fileofsize = e.target.files[0].size;
    if (typeOfFile !== "application/pdf") {
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

  updateLifeInsurance = async (lifeInsurance) => {
    konsole.log("lifeInsurancelifeInsurance", lifeInsurance);
    konsole.log("updateLifeInsurance", lifeInsurance, lifeInsurance?.insuranceDocs[0]);
    let fileId = lifeInsurance?.insuranceDocs[0]?.docFileId;
    // let selectfileName = lifeInsurance?.insuranceDocs[0]?.documentName;
    let selectfileName = fileId ? lifeInsurance?.insuranceCompany : '';

    let selectfilePath = lifeInsurance?.insuranceDocs[0]?.documentPath;
    let selectfileIsActive = lifeInsurance?.insuranceDocs[0]?.isActive;
    let selectfileuserInsDocId = lifeInsurance?.insuranceDocs[0]?.userLifeInsuranceDocId;
    konsole.log("lifeInsurancelifeInsurance", fileId, selectfileName);
    const policyStartDate = new Date(lifeInsurance.policyStartDate);
    const policyExpiryDate = new Date(lifeInsurance.policyExpiryDate);
    const beneficiaryUserId = (lifeInsurance.beneficiary.length > 0 && lifeInsurance.beneficiary[0].beneficiaryUserId) || "";
    konsole.log("lifeInsurancelifeInsurance", lifeInsurance?.additionalDetails);

    this.setState({
      insuranceCompanyId: lifeInsurance.insuranceCompanyId,
      policyTypeId: lifeInsurance.policyTypeId,
      policyStartDate: lifeInsurance?.policyStartDate !== null ? policyStartDate : null,
      policyExpiryDate: lifeInsurance?.policyExpiryDate !== null ? policyExpiryDate : null,
      premium: lifeInsurance.premiumId,
      cashValue: lifeInsurance.cashValue,
      deathBenefits: lifeInsurance.deathBenefits,
      natureId: lifeInsurance.userLifeInsuranceId,
      userLifeInsuranceId: lifeInsurance.userLifeInsuranceId,
      updateInsurance: true,
      beneficiaryUserId: beneficiaryUserId,
      beneficiaryObj: lifeInsurance.beneficiary[0],
      insuranceDocObj: lifeInsurance.insuranceDocs[0],
      viewshowfile: fileId !== undefined ? true : false,
      viewFileId: fileId,
      selectfileName: isNotValidNullUndefile(selectfileName) ? selectfileName : "Click to Browse your file",
      fileuserInsDocId: selectfileuserInsDocId,
      selectFilePath: selectfilePath,
      selectFileisActive: selectfileIsActive,
      documentTypeValue: lifeInsurance?.additionalDetails !== null ? lifeInsurance?.additionalDetails : "",
      premiumAmount: (lifeInsurance?.premium == 0) ? '' : lifeInsurance?.premium,
      quesReponse:lifeInsurance?.quesReponse
    });

    if (fileId && lifeInsurance.insuranceCompanyId == '999999') {
      const obj = { userId: this.state.userId, othersCategoryId: 12, othersMapNatureId: lifeInsurance?.userLifeInsuranceId, isActive: true, othersMapNature: '' }
      selectfileName = await getOtherFieldsName(obj);
      console.log("selectfileName", selectfileName)
    }
    this.setState({
      selectfileName: isNotValidNullUndefile(selectfileName) ? selectfileName : "Click to Browse your file",
    })
  };

  selectFileUpload = () => {
    document.getElementById("fileUploadLifeId").click();
  };

  selectdocumentType = (e) => {
    konsole.log("selectdocumentType", e.target.value);
  };

  toasterAlert(text, type) {
    this.context.setdata({
      open: true,
      text: text,
      type: type,
    });
  }

  deleteUserData = async (assets) => {
    const req = await this.context.confirm(true, "Are you sure? you want to delete", "Confirmation");
    if (!req) return;
    this.props.dispatchloader(true);
    konsole.log("assetsassets", assets);
    let jsonobj = {
      userId: this.state.logginPrimaryUserId,
      lifeInsurance: {
        insuranceCompanyId: assets.insuranceCompanyId,
        policyTypeId: assets.policyTypeId,
        policyStartDate: assets.policyStartDate !== null ? assets.policyStartDate : "",
        policyExpiryDate: assets.policyExpiryDate !== null ? assets.policyExpiryDate : "",
        premiumId: assets.premiumId,
        cashValue: assets.cashValue !== null ? assets.cashValue : 0,
        deathBenefits: assets.deathBenefits,
        additionalDetails: assets.additionalDetails,
        userLifeInsuranceId: assets.userLifeInsuranceId,
        isActive: false,
        updatedBy: this.state.logginUserId,
        beneficiary: [],
        insuranceDocs: []
      }
    }
    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putLifeInsByUserId, jsonobj, (res, err) => {
      this.props.dispatchloader(false);
      if (res) {
        konsole.log("resresDeleteLiffe", res);
        this.fetchLifeInsurance(this.state.userId);
        // this.handleClose();
        this.handleClear();
        AlertToaster.success("Data Deleted Successfully");
        // this.props.handlenonretireproppopShow();
      } else {
        konsole.log("errerre", err);
        this.setState({ disable: false })
      }
    }
    );
  }
  
  getQuestionResponse=(value)=>{
    // konsole.log("vadsdsddlue",value)
    if(value){
      const jsonString = JSON.stringify(value);
      this.setState({quesReponse:jsonString})
    }
  }

  render() {
    konsole.log('thisstatefileObj', this.state.fileObj)
    konsole.log("insuranceDocObjinsuranceDocObj", this.state.insuranceDocObj);
    konsole.log("documentTypeId", this.state.documentTypeId);
    konsole.log("logginPrimaryUserId", this.state.logginPrimaryUserId);
    konsole.log("documentTypeValue", this.state.documentTypeValue);
    // let insuranceCompany = {};
    // let policyList = {};
    // let beneficiary = {};
    // let premium = {};
    let insuranceCompany = this.state.InsProvider.find((data) => data.value == this.state.insuranceCompanyId);
    let policyList = this.state.typeofPolicy.find((data) => data.value == this.state.policyTypeId);
    let beneficiary = this.state.beneficiaryUserId !== "" ? this.state.beneficiaryList.filter((v) => v.value == this.state.beneficiaryUserId) : "";
    let premium = this.state.premiumFreList.find((data) => data.value == this.state.premium);

    // konsole.log('beneficiarybeneficiary',beneficiary)

    // konsole.log(typeof (this.state.insuranceCompanyId));
    // beneficiary = (this.state.beneficiaryUserId !== "") ? this.state.beneficiaryList.filter(v => v.value == this.state.beneficiaryUserId) : { value: "", label: "Please choose Beneficiary" };

    // if (this.state.insuranceCompanyId !== "999999") {
    //   insuranceCompany = (this.state.insuranceCompanyId !== "") ? this.state.InsProvider[this.state.insuranceCompanyId - 1] : "";
    // }
    // else {
    //   insuranceCompany = (this.state.insuranceCompanyId !== "") ? this.state.InsProvider[this.state.InsProvider.length - 1] : "";
    // }
    // if (this.state.policyTypeId !== "999999") {
    //   policyList = (this.state.policyTypeId !== "") ? this.state.typeofPolicy[this.state.policyTypeId - 1] : "";
    // }
    // else {
    //   policyList = (this.state.policyTypeId !== "") ? this.state.typeofPolicy[this.state.typeofPolicy.length - 1] : "";
    // }
    // if (this.state.premium !== "999999") {
    //   premium = (this.state.premium !== "") ? this.state.premiumFreList[this.state.premium - 2] : "";
    // } else {
    //   premium = (this.state.premium !== "") ? this.state.premiumFreList[this.state.premiumFreList - 1] : "";
    // }
    konsole.log("state at lifeainsurance", this.state);

    console.log("insuranceCompanyId",this.state.insuranceCompanyId,insuranceCompany)
    return (
      <>
        {/* <style jsx global>{`  .modal-open .modal-backdrop.show {    opacity: 0.5 !important;  }`}</style> */}
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            max-width: 52.25rem;
            margin: 1.75rem auto;
          }
        `}</style>
        <a onClick={this.handleShow}><img className="ms-2 mb-2" src="/icons/add-icon.svg" alt="Life Insurance Form" />
        </a>

        <Modal
          show={this.props?.show || this.state.show}
          centered
          size="lg"
          onHide={this.handleClose}
          animation="false"
          backdrop="static"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Life Insurance </Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            <div className="person-content">
              <Form.Group as={Row} className="">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Select className="w-100 p-0 custom-select" value={isNotValidNullUndefile(insuranceCompany) && insuranceCompany} options={this.state.InsProvider.sort((a, b) => a.label != 'Other' && a.label.localeCompare(b.label))} isSearchable onChange={(event) => this.setState({ insuranceCompanyId: event.value })} maxMenuHeight={200} placeholder="Insurance Company*" />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className={`${this.state.insuranceCompanyId == "999999" ? "d-flex align-items-center mb-2" : ""}  d-md-none `} >
                  {this.state.insuranceCompanyId == "999999" && (
                    <Other othersCategoryId={12} userId={this.state.userId} dropValue={this.state.insuranceCompanyId} ref={this.insCompanyRef} natureId={this.state.natureId} />
                  )}
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Select className="w-100 p-0 custom-select" value={isNotValidNullUndefile(policyList) &&  policyList} options={this.state.typeofPolicy} isSearchable onChange={(event) => this.setState({ policyTypeId: event.value })} placeholder="Type of Policy" />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className={`${this.state.policyTypeId == "999999" ? "d-flex align-items-center mb-2" : ""}  d-md-none `} >
                  {this.state.policyTypeId == "999999" && (
                    <Other othersCategoryId={23} userId={this.state.userId} dropValue={this.state.policyTypeId} ref={this.policyRef} natureId={this.state.natureId} />
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="d-none d-md-flex">
                {this.state.insuranceCompanyId == "999999" && (
                  <Col xs="12" sm="12" md="6" lg="6" className="mb-3">
                    <Other othersCategoryId={12} userId={this.state.userId} dropValue={this.state.insuranceCompanyId} ref={this.insCompanyRef} natureId={this.state.natureId} />
                  </Col>
                )}
                {
                  this.state.policyTypeId == "999999" && (
                    <Col xs="12" sm="12" md="6" lg="6" className="mb-3">
                      <Other othersCategoryId={23} userId={this.state.userId} dropValue={this.state.policyTypeId} ref={this.policyRef} natureId={this.state.natureId} />
                    </Col>
                  )
                }



              </Form.Group>
              <Form.Group as={Row} className="">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <DatepickerComponent name="policyStartDate" value={this.state.policyStartDate} setValue={(value) => this.setState({ policyStartDate: value })} placeholderText="When did Policy Start?" maxDate={0} minDate="100" />
                </Col>
                <Col xs="12" sm="12" md='6' lg="6" className="mb-2">
                  <DatepickerComponent name="policyExpiryDate" value={this.state.policyExpiryDate} setValue={(value) => this.setState({ policyExpiryDate: value })} placeholderText="If term Insuranace when will it expire?" future="show" minDate="100" maxDate={0} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Select className="w-100 custom-select" value={isNotValidNullUndefile(premium) && premium} options={this.state.premiumFreList.filter((e) => { return e.value != 2 })} onChange={(event) => this.setState({ premium: event.value })} placeholder="Premium Frequency" />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <CurrencyInput prefix="$" className="border" allowNegativeValue={false} placeholder="Premium Amount" name="premiumAmount" onValueChange={(value) => { this.setState({ premiumAmount: value }); }} value={this.state.premiumAmount} decimalScale="2" />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <CurrencyInput prefix="$" className="border" allowNegativeValue={false} placeholder="Cash Value" name="cashValue" onValueChange={(value) => { this.setState({ cashValue: value }); }} value={this.state.cashValue} decimalScale="2" />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <CurrencyInput prefix="$" className="border" placeholder="Death Benefit" allowNegativeValue={false} name="deathBenefits" onValueChange={(value) => { this.setState({ deathBenefits: value }); }} value={this.state.deathBenefits} decimalScale="2" />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Select className="w-100 p-0 custom-select" value={(beneficiary?.length > 0 ? beneficiary?.map(ele => ({ ...ele, label: ele.label ? $AHelper.capitalizeAllLetters(ele.label) : '' })) : [])}
                    options={this.state.beneficiaryList?.map(ele => ({ ...ele, label: ele.label ? $AHelper.capitalizeAllLetters(ele.label) : '' }))}
                    placeholder="Please choose Beneficiary" onChange={(event) => this.setState({ beneficiaryUserId: event.value })} maxMenuHeight={130} isSearchable />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Form.Control type="text" value={$AHelper.capitalizeFirstLetter(this.state.documentTypeValue)} id="DocumentType" placeholder="Policy No " onChange={(e) => this.setState({ documentTypeValue: e.target.value })} />
                  {/* <Form.Select onChange={(e)=>this.setState({documentTypeId:e.target.value})}>
                        <option selected value=''> Document Type </option>
                        <option value=" Choose Document 1" >Choose Document 1</option>
                        <option value="Choose Document 2">Choose Document 2</option>
                        <option value="Choose Document 3">Choose Document 3</option>
                      </Form.Select> */}
                </Col>
                <Col xs="12" sm="12" className="" md="6" lg="6">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="ps-2 d-flex justify-content-between align-items-center fileInoutHealth">
                      {fileNameShowInClickHere(this.state.fileObj, this.state.selectfileName)}
                    </div>
                    <span className="bg-secondary text-white cursor-pointer uploadButtonHeath" onClick={this.selectFileUpload}>Upload</span>
                    <div style={{ height: "100%", borderRadius: "0px 3px 3px 0px" }}>
                      <input className="d-none" type="file" accept="application/pdf" id="fileUploadLifeId" onChange={this.handleFileSelection} />
                      {this.state.updateInsurance && isNotValidNullUndefile(this.state.viewFileId) && (
                        <PdfViewer2 viewFileId={this.state.viewFileId} />
                      )}
                    </div>
                  </div>
                </Col>
                

                <Col xs="12">
                    <ExpensesPaidQuestion getQuestionResponse={this?.getQuestionResponse}  quesReponse={this.state?.quesReponse}/>
                </Col>
              </Form.Group>
            </div>
            <div className="mt-4 w-100 d-flex justify-content-end">
              {this.state.updateInsurance ?"":
              <Button className="theme-btn float-end anotherBTn" onClick={() => this.handleFileUpload('addmore')} style={{ backgroundColor: "#76272b", border: "none" }} disabled={this.state.disable == true ? true : false}>  Add Another </Button>}
              <Button className="theme-btn" onClick={() => this.handleFileUpload('save')}
                style={{ backgroundColor: "#76272b", border: "none" }}
                disabled={this.state.disable == true ? true : false}
              >
                {this.state.updateInsurance ? "Update" : "Save"}
              </Button>

            </div>
          </Modal.Body>
          <Modal.Footer className="border-0" >

            <Row className="excelscroll financialInformationTable">
              {this.state.lifeInsurances.length > 0 && (
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Insurance Company</th>
                      <th>Policy No</th>
                      <th>Type of Policy</th>
                      <th style={{ minWidth: '80px' }}>Policy Start</th>
                      <th style={{ minWidth: '80px' }}>Policy Expire</th>
                      <th>Premium Frequency</th>
                      <th>Premium Amount</th>
                      {/* <th>Cash Value</th> */}
                      <th>Death Benefits</th>
                      <th>Beneficiary</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.lifeInsurances.length > 0 &&
                      this.state.lifeInsurances.map((lifeInsurances, i) => {
                        return (
                          <tr key={i}>
                            <td style={{ wordBreak: "break-word" }}>
                              <OtherInfo othersCategoryId={12} othersMapNatureId={lifeInsurances?.userLifeInsuranceId} FieldName={lifeInsurances.insuranceCompany} userId={this.state.userId} />
                            </td>
                            <td>{lifeInsurances.additionalDetails}</td>
                            <td style={{ wordBreak: "break-word" }}>
                              <OtherInfo othersCategoryId={23} othersMapNatureId={lifeInsurances?.userLifeInsuranceId} FieldName={lifeInsurances.policyType} userId={this.state.userId} />
                            </td>
                            <td className="text-center">
                              {lifeInsurances.policyStartDate == null ? "-" : $AHelper.getFormattedDate(lifeInsurances.policyStartDate)}
                            </td>
                            <td className="text-center">
                              {lifeInsurances.policyExpiryDate == null ? "-" : $AHelper.getFormattedDate(lifeInsurances.policyExpiryDate)}
                            </td>
                            <td className="text-center">{lifeInsurances.premiumType || "-"}</td>
                            <td className="text-center">{lifeInsurances.premium != undefined && lifeInsurances.premium != null && lifeInsurances.premium != "" ? $AHelper.IncludeDollars(lifeInsurances.premium) : '-'}</td>
                            {/* <td>
                              {lifeInsurances.cashValue !== undefined &&lifeInsurances.cashValue !== null  ? $AHelper.IncludeDollars(      lifeInsurances.cashValue    )  : "-"}
                            </td> */}
                            <td className="text-center">
                              {isNotValidNullUndefile(lifeInsurances.deathBenefits) ? $AHelper.IncludeDollars(lifeInsurances.deathBenefits) : "-"}
                            </td>
                            <td className="text-center">
                              {($AHelper.capitalizeAllLetters(lifeInsurances.beneficiary.length > 0 && lifeInsurances.beneficiary[0].beneficiaryName) || "-")}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>

                              <TableEditAndViewForDecease
                                key={i}
                                forUpdateValue={lifeInsurances}
                                type='primary'
                                actionType='Beneficiary'
                                refrencePage="LifeInsuraneForm"
                                handleUpdateFun={this.updateLifeInsurance}
                                handleDeleteFun={this.deleteUserData}
                                userId={this.state.userId}
                                memberUserId={lifeInsurances?.beneficiary?.length > 0 ? lifeInsurances?.beneficiary[0].beneficiaryUserId : ''}

                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              )}
            </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(LifeInsuranceForm);