import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb,} from "react-bootstrap";
import Select from "react-select";
import { connect } from "react-redux";
import { SET_LOADER } from "../components/Store/Actions/action";
import DatePicker from "react-datepicker";
import { $Service_Url } from "../components/network/UrlPath";
import { $CommonServiceFn, $postServiceFn,} from "../components/network/Service";
import { $AHelper } from "./control/AHelper";
import CurrencyInput from "react-currency-input-field";
import konsole from "./control/Konsole";
import moment from "moment";
import Other from "./asssets/Other";
import ExpensesPaidQuestion from "./ExpensesPaidQues";
import PdfViewer2 from "./PdfViwer/PdfViewer2";
import { globalContext } from "../pages/_app";
import DatepickerComponent from "./DatepickerComponent";
import OtherInfo from "./asssets/OtherInfo";
import AlertToaster from "./control/AlertToaster";
import {fileLargeMsg} from "./control/Constant";
import { fileNameShowInClickHere, isNotValidNullUndefile, removeSpaceAtStart } from "./Reusable/ReusableCom";

export  class BusinessInterestAsset extends Component {
  static contextType = globalContext;
  constructor(props,context) {
    super(props);
    this.state = {
      fileCategoryId: 5,
      fileTypeId: 14,
      fileObj: null,
      logginUserId: sessionStorage.getItem("loggedUserId"),
      initialShow: true,
      show: false,
      updateBusiness: false,
      businessTypeList: [],
      businessInterestGetList: [],
      documentTypeId: "",
      // OwnerTypes: [],
      natureId: "",
      userId: "",
      businessTypeId: "",
      ownershipType: "",
      taxIDNo:"",
      holdingPercentage: 0,
      nameofBusiness: "",
      descOfBusiness: "",
      dateFunded: "",
      disable:false,
      estimatedMarketValue: "",
      businessBeneficiaries: [],
      businessInterestDocs: [{ documentName: "", documentPath: "" }],
      fileisActivestatus: "",
      filebsinessInterestDocId: "",
      viewFileId: "",
      selectfileName: "Click to Browse your file",
      documentTypeValue: "",
      quesReponse:null
    };

    this.bussRef = React.createRef();
  }

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let logginUserId = sessionStorage.getItem("loggedUserId") || "";
    this.setState({
      userId: newuserid,
      logginUserId: logginUserId,
    });
    // this.fetchBussinessType();
    // this.getUserBusinessInterest(newuserid);
    // this.fetchownertypes();
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevState.userId !== this.state.userId) {
    //   this.getUserBusinessInterest(this.state.userId);
    // }
    if(prevState.show != true && this.state.show == true && this.state.initialShow == true) {
      this.setState({initialShow: false});
      this.fetchBussinessType();
      this.getUserBusinessInterest(this.state.userId);
    }
  }

  fetchBussinessType = () => {
    $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getBusinessType, "", (response) => {
        if (response) {
          this.setState({
            ...this.state,
            businessTypeList: response.data.data,
          });
        }
      }
    );
  };

  //   fetchownertypes = () => {
  //     // this.props.dispatchloader(true);
  //     $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getOwnerType,
  //         "", (response) => {
  //             // this.props.dispatchloader(false);
  //             if (response) {
  //                 this.setState({
  //                     ...this.state,
  //                     OwnerTypes: response.data.data,
  //                 });
  //             }
  //         })
  // }

  // handleInputChange = (event) => {
  //     const attrName = event.target.name;
  //     const attrValue = event.target.value;
  //     this.setState({
  //         [attrName]: attrValue
  //     })
  // }

  handleInputChange = (event) => {
    event.preventDefault();

    const eventId = event.target.id;
    const eventValue = event.target.value;
    konsole.log("eventUd", eventId, eventValue);
    // eventId == "descOfBusiness" ||
    if ( eventId == "nameofBusiness" || eventId == "ownershipType") {
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
    } else if (eventId == "noOfChildren") {
      if ($AHelper.isNumberRegex(eventValue)) {
        this.setState({
          ...this.state,
          [eventId]: eventValue,
        });
      } else {
        this.toasterAlert("please enter valid number", "Warning");
        this.setState({
          noOfChildren: 0,
        });
      }
    } else {
      this.setState({
        [eventId]: eventValue,
      });
    }
  };

  getUserBusinessInterest = (newuserid) => {
    let userId = newuserid || this.state.userId;
    // konsole.log("businessUserId",userId);
    $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getUserBusinessInterest + `/${userId}`, "", (response) => {
        if (response) {
          this.setState({
            ...this.state,
            businessInterestGetList: response.data.data.businessInterest,
          });
        }
      }
    );
  };

  handleClose = () => {
    this.context.setPageTypeId(null)
    this.setState({
      show: !this.state.show,
    });
    this.clearState();
  };

  handleShow = () => {
      this.context.setPageTypeId(19)
    this.setState({
      show: !this.state.show,
    });
  };

  selectFileUpload = () => {
    konsole.log("jahjs");
    document.getElementById("fileUploadLifeId").click();
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
    if($AHelper.fileuploadsizetest(fileofsize)){
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

  handleFileUpload = (type) => {
    this.setState({disable:true})
    if (isNotValidNullUndefile( this.state.fileObj)) {
        this.props.dispatchloader(true);
      $postServiceFn.postFileUpload(
        this.state.fileObj,
        this.state.userId,
        this.state.logginUserId,
        this.state.fileTypeId,
        this.state.fileCategoryId,
        2,
        (response, errorData) => {
          this.props.dispatchloader(false);
          if (response) {
            konsole.log("resposnejjj", response);
            let responseFileId = response.data.data.fileId;
            let responsedocName = response.data.data.fileName;
            let responsedocPath = response.data.data.fileURL;
            this.handleBusinessSubmit(type, responseFileId, responsedocName, responsedocPath
            );
          } else if (errorData) {
            this.toasterAlert(errorData, "Warning");
          }
        }
      );
    } else {
      this.handleBusinessSubmit(type,null);
    }
  };
  handleBusinessSubmit = (type,fileId, documentName, documentPath) => {
    konsole.log("fileId,documentName,documentPath", fileId, documentName, documentPath);

    let datefunded = null;
    let businessInterestDocs = [];
    if (this.state.dateFunded !== "") {
      datefunded = $AHelper.getFormattedDate(this.state.dateFunded);
    }
    if (   isNotValidNullUndefile(fileId) &&  isNotValidNullUndefile(documentPath) &&  isNotValidNullUndefile(documentName)) {
   
      businessInterestDocs = [
        {
          documentName: documentName,
          documentPath: documentPath,
          docFileId: fileId,
        },
      ];
      if (this.state.updateBusiness) {
        businessInterestDocs[0]["isActive"] = this.state.fileisActivestatus;
        businessInterestDocs[0]["userBusinessInterestDocId"] =
          this.state.filebsinessInterestDocId;
      }
    } else {
      businessInterestDocs = [];
    }

    let businessObj = {
      businessTypeId: this.state.businessTypeId,
      ownershipType: $AHelper.capitalizeAllLetters(this.state.ownershipType),
      taxIDNo: this.state.taxIDNo,
      holdingPercentage: this.state.holdingPercentage,
      nameofBusiness: $AHelper.capitalizeAllLetters(this.state.nameofBusiness),
      descOfBusiness: this.state.descOfBusiness,
      dateFunded: datefunded !== "Invalid date" && datefunded !== "" && datefunded !== null && datefunded !== undefined ? datefunded : null,
      estimatedMarketValue: this.state.estimatedMarketValue,
      businessBeneficiaries: null,
      businessInterestDocs: businessInterestDocs,
      additionalDetails: this.state.documentTypeValue,
      quesReponse:this.state?.quesReponse
    };
    let method = "POST";
    let url = $Service_Url.postUserBusinessInterest;
    if (this.state.updateBusiness == true) {
      method = "PUT";
      url = $Service_Url.updateUserBusinessInterest;
      businessObj["updatedBy"] = this.state.logginUserId;
      businessObj["userBusinessInterestId"] = this.state.natureId;
      businessObj["isActive"] = true;
    } else if (this.state.updateBusiness == false) {
      businessObj["createdBy"] = this.state.logginUserId;
    }

    let BusPostData = {
      userId: this.state.userId,
      businessInterest: businessObj,
    };

    konsole.log("busPostData", JSON.stringify(BusPostData));
    konsole.log("busPostData", BusPostData, url);

    if (this.validate()) {
      // this.state.disable=true
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi(
        method,
        url,
        BusPostData,
        (response, error) => {
          if (response) {
            this.setState({disable: false})
            konsole.log("Success res1", response);
            if(method == 'POST'){
              AlertToaster.success("Data saved successfully");
          }else{
              AlertToaster.success("Data updated successfully");
          }
            let responseData = response.data.data.businessInterest[0];
            this.getUserBusinessInterest(this.state.userId);
            if (this.state.businessTypeId == "999999") {
              this.bussRef.current.saveHandleOther(
                responseData.userBusinessInterestId
              );
            }
            if (type == "Add") {
              this.handleClose();
            } else {
              this.clearState();
            }
          } else {
            konsole.log("error", error);
            this.setState({disable:false})
          }
          this.props.dispatchloader(false)
        }
      );
    }
  };

  clearState = () => {
    konsole.log("clear state");
    this.setState({
      nameofBusiness: "",
      ownershipType: "",
      taxIDNo: "",
      holdingPercentage: "",
      estimatedMarketValue: "",
      dateFunded: "",
      descOfBusiness: "",
      businessTypeId: "",
      fileObj: "",
      updateBusiness: false,
      documentTypeValue: "",
      fileObj: null,
      natureId: "",
      selectfileName: "Click to Browse your file",
      quesReponse:null
    });
  };

  updateBusinessInterest = (selectedBusiness) => {
    konsole.log("businessbusiness", selectedBusiness);
    let fileId = selectedBusiness?.businessInterestDocs[0]?.docFileId;
    // let selectfileName =selectedBusiness?.businessInterestDocs[0]?.documentName;
    let selectfileName =fileId ? selectedBusiness?.nameofBusiness:'';
    konsole.log("selectfileName", selectfileName);
    let isActivestatus = selectedBusiness?.businessInterestDocs[0]?.isActive;
    let bsinessInterestDocId =
      selectedBusiness?.businessInterestDocs[0]?.userBusinessInterestDocId;
    konsole.log("fileIdfileId", selectedBusiness?.additionalDetails);
    let funded =
      selectedBusiness.dateFunded !== null &&
      selectedBusiness.dateFunded !== undefined &&
      selectedBusiness.dateFunded !== ""
        ? new Date(selectedBusiness.dateFunded)
        : "";
    // let funded = $AHelper.getFormattedDate(selectedBusiness.dateFunded);
    this.setState({
      businessTypeId: selectedBusiness.businessTypeId,
      ownershipType: selectedBusiness.ownershipType,
      taxIDNo: selectedBusiness.taxIDNo,
      holdingPercentage: selectedBusiness.holdingPercentage,
      nameofBusiness: selectedBusiness.nameofBusiness,
      descOfBusiness: selectedBusiness.descOfBusiness,
      dateFunded: funded,
      updateBusiness: true,
      estimatedMarketValue: selectedBusiness.estimatedMarketValue,
      quesReponse:selectedBusiness?.quesReponse,
      viewFileId: fileId,
      fileisActivestatus: isActivestatus,
      filebsinessInterestDocId: bsinessInterestDocId,
      selectfileName:
        selectfileName !== null &&
        selectfileName !== "" &&
        selectfileName !== undefined
          ? selectfileName
          : "Click to Browse your file",
      // beneficiary: [],
      // businessInterestDocs: selectedBusiness.businessInterestDocs,
      natureId: selectedBusiness.userBusinessInterestId,
      documentTypeValue:
        selectedBusiness?.additionalDetails !== null
          ? selectedBusiness?.additionalDetails
          : "",
    });
  };

  validate = () => {
    let nameError = "";
    // if (this.state.estimatedMarketValue == "") {
    //     nameError = "Estimation Market Value cannot be blank"
    // }
    // if (this.state.dateFunded == "") {
    //     nameError = "Please enter the date funded"
    // }
    // if (this.state.ownershipType == "") {
    //     nameError = "Owner Type cannot be Blank"
    // }
    // if (this.state.descOfBusiness == "") {
    //     nameError = "Nature of Business cannot be Blank"
    // }
    if (this.state.nameofBusiness == "") {
      nameError = "Name of Business cannot be Blank";
      this.setState({disable: false})
    }
    if (this.state.businessTypeId == "") {
      nameError = "Type of business cannot be Blank";
      this.setState({disable: false})
    }

    if (nameError) {
      this.toasterAlert(nameError, "Warning");
      return false;
    }
    return true;
  };

  toasterAlert(test, type) {
    this.context.setdata($AHelper.toasterValueFucntion(true, test, type));
  }

  deleteUserData = async (data,userId,logginUserId) =>{
    const req = await this.context.confirm(true, "Are you sure? you want to delete", "Confirmation");
    if (!req) return;
    this.props.dispatchloader(true);
    konsole.log("datata",data)
    konsole.log("jsonDelete", userId + "/" + data.userBusinessInterestId + "/" + logginUserId)
    const json = {
        userId: userId,
        userBusinessInterestId: data?.userBusinessInterestId,
        deletedBy: logginUserId
      }
    $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteBussinessInterest, json ,(response) => {
      this.props.dispatchloader(false);
      if (response) {
        konsole.log("responseDeleteBuss",response)
        AlertToaster.success("Data Deleted Successfully");
          this.getUserBusinessInterest(userId)
      }
    });

  }

  getQuestionResponse=(value)=>{
    // konsole.log("vadsdsddlue",value)
    if(value){
      const jsonString = JSON.stringify(value);
      this.setState({quesReponse:jsonString})
    }
  }


  render() {
    konsole.log("state at businsess", this.state);
    const documentType = [
      { value: "Choose Document Type", label: "Choose Document Type" },
    ];
    let businesstypeObj = {};

    if (this.state.businessTypeId?.toString() !== "999999") {
      businesstypeObj =
        this.state.businessTypeList[this.state.businessTypeId - 1] || 0;
    } else {
      businesstypeObj =
        this.state.businessTypeList[this.state.businessTypeList.length - 1] ||
        0;
    }

    konsole.log("clear state", this.state);
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
            max-width: 53.25rem;
            margin: 1.75rem auto;
          }
        `}</style>

        <Col xs md="4" onClick={this.handleShow} className="cursor-pointer mb-3">
          <div className="d-flex align-items-center border py-1">
            <div className="flex-grow-1 ms-2 text-truncate border-end">
              Business Interests
            </div>
            <div className="cursor-pointer">
              <a>
                <img
                  className="px-2"
                  src="/icons/add-icon.svg"
                  alt="health Insurance"
                />
              </a>
            </div>
          </div>
        </Col>

        <Modal
          show={this.state.show}
          size="lg"
          centered
          onHide={this.handleClose}
          animation="false"
          backdrop="static"
          enforceFocus={false}
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Business Interest</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="person-content">
              <Form.Group as={Row} className="">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Form.Control
                  className="upperCasing"
                    type="text"
                    value={this.state.nameofBusiness}
                    placeholder={$AHelper.mandatory("Name of Business")}
                    name="nameofBusiness"
                    id="nameofBusiness"
                    onChange={(event) => this.handleInputChange(event)}
                  />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Form.Control
                    type="text"
                    value={$AHelper.capitalizeFirstLetter(this.state.descOfBusiness)}
                    placeholder="Description of Business"
                    name="descOfBusiness"
                    id="descOfBusiness"
                    onChange={(event) => this.handleInputChange(event)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  {/* <Form.Control type="text" value="Date Funded" placeholder='Date Funded' /> */}
                  <DatepickerComponent
                    name="dateFunded"
                    value={this.state.dateFunded}
                    setValue={(value) => this.setState({ dateFunded: value })}
                    placeholderText="Date Started"
                    maxDate={0}
                    minDate="100"
                  />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Select
                    className="w-100 custom-select"
                    options={this.state.businessTypeList}
                    isSearchable
                    onChange={(event) =>
                      this.setState({ businessTypeId: event.value })
                    }
                    placeholder={$AHelper.mandatory("Type of Business")}
                    value={businesstypeObj}
                  />
                </Col>
              </Form.Group>
              {this.state.businessTypeId == "999999" && (
                <Form.Group as={Row} className="">
                  <Col xs="12" sm="12" md="6" lg="6"></Col>
                  <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                    <Other
                      othersCategoryId={30}
                      userId={this.state.userId}
                      dropValue={this.state.businessTypeId}
                      ref={this.bussRef}
                      natureId={this.state.natureId}
                    />
                  </Col>
                </Form.Group>
              )}
              <Form.Group as={Row}>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <CurrencyInput
                    prefix="$"
                    className="border"
                    allowNegativeValue={false}
                    value={this.state.estimatedMarketValue}
                    placeholder="Estimated Market Value"
                    name="estimatedMarketValue"
                    onValueChange={(value) => {
                      this.setState({ estimatedMarketValue: value });
                    }}
                    decimalScale="2"
                  />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Form.Control
                  className="upperCasing"
                    type="text"
                    value={this.state.ownershipType}
                    placeholder="Owner(S) & Co-Owner(S)"
                    name="ownershipType"
                    id="ownershipType"
                    onChange={(event) => this.handleInputChange(event)}
                  />

                  {/* <Select className="w-100 p-0 custom-select" 
                                     onChange={(event) => this.setState({ ownerTypeId: event.value })} 
                                     options={this.state.OwnerTypes} isSearchable /> */}
                </Col>
              </Form.Group>

              
              <Form.Group as={Row} className="">
                <Col  xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Form.Control
                    type="text"
                    value={$AHelper.capitalizeFirstLetter(this.state.documentTypeValue)}
                    id="DocumentType"
                    placeholder="UBI Number"
                    onChange={(e) =>
                      this.setState({ documentTypeValue: e.target.value })
                    }
                  />
                  {/* <Form.Select onChange={(e)=>this.setState({documentTypeId:e.target.value})}>
                        <option selected value=''> Document Type </option>
                        <option value=" Choose Document 1" >Choose Document 1</option>
                        <option value="Choose Document 2">Choose Document 2</option>
                        <option value="Choose Document 3">Choose Document 3</option>
                      </Form.Select> */}
                </Col>

                <Col xs="12" sm="12" lg="6" className="mb-2">
                  <Form.Control
                    type="text"
                    value={this.state.taxIDNo}
                    id="Federal Tax ID number"
                    placeholder="Federal Tax ID Number"
                    onChange={(e) =>
                      this.setState({ taxIDNo: e.target.value })
                    }
                  />
                </Col>
            
              </Form.Group>
                <Col xs sm="6" lg="6" >
                  <div className="d-flex justify-content-between align-items-center p-0 ">
                    <div className="ps-2 d-flex align-items-center fileInoutHealth">
                       {fileNameShowInClickHere(this.state.fileObj,this.state.selectfileName)}
                    </div>
                    <span
                      className="bg-secondary text-white cursor-pointer uploadButtonHeath "
                      onClick={this.selectFileUpload}
                    >
                      Upload
                    </span>
                    <div style={{height: "100%",borderRadius:"0px 3px 3px 0px"}}>
                      <input
                        className="d-none"
                        type="file"
                        accept="application/pdf"
                        id="fileUploadLifeId"
                        onChange={this.handleFileSelection}
                      />
                      {this.state.updateBusiness &&
                        this.state.viewFileId !== null &&
                        this.state.viewFileId !== "" &&
                        this.state.viewFileId !== undefined && (
                          <PdfViewer2 viewFileId={this.state.viewFileId} />
                        )}
                    </div>
                  </div>
                </Col>
                <Col xs="12">
                    <ExpensesPaidQuestion getQuestionResponse={this?.getQuestionResponse}  quesReponse={this.state?.quesReponse}/>
                </Col>
              <Form.Group as={Row} className="mb-3">
            
              </Form.Group>
            </div>
            <div className='mt-3'>
              <div>
              <Button
                  style={{ backgroundColor: "#76272b", border: "none" }}
                  className="theme-btn float-end mb-2"
                  //  onClick={this.handleBusinessSubmit}
                  // onClick={this.handleFileUpload}
                  onClick={() => this.handleFileUpload("Add")}
                  disabled={this.state.disable == true ? true : false}
              >
                  {this.state.updateBusiness ? "Update" : "Save"}
                </Button>
                </div>
                <div className="">
                {this.state.natureId !== undefined && this.state.natureId !== null && this.state.natureId !== "" ? ("") : (
                  <Button className="theme-btn float-end anotherBTn" onClick={() => this.handleFileUpload("AddMore")} style={{ marginRight: "10px", backgroundColor: "#76272b", border: "none" }} disabled={this.state.disable == true ? true : false}>  Add Another </Button>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Row className="container-fluid p-0 m-0 excelscroll financialInformationTable">
            {this.state.businessInterestGetList.length !== 0 && (
              <Table bordered>
                <thead>
                  <tr>
                    <th>Name of Business </th>
                    <th>Description of Business </th>
                    <th>Date Started</th>
                    <th style={{verticalAlign:"middle"}}>Type of Business</th>
                    <th>Estimated Market Value</th>
                    <th>Owner(s) and Co-Owner(s)</th>
                    <th>UBI Number</th>
                    <th>Federal Tax ID Number</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.businessInterestGetList &&
                    this.state.businessInterestGetList.map((b, index) => {
                      return (
                        <tr>
                          <td className="text-center">{$AHelper.capitalizeAllLetters(b.nameofBusiness || "-")}</td>
                          <td className="text-center">{b.descOfBusiness || "-"}</td>
                          <td className="text-center">
                            {b.dateFunded !== null &&
                            b.dateFunded !== undefined &&
                            b.dateFunded !== ""
                              ? $AHelper.getFormattedDate(b.dateFunded)
                              : "-"}
                          </td>
                          <td style={{wordBreak:"break-word"}}>
                            {/* {b.businessType} */}
                            <OtherInfo
                              othersCategoryId={30}
                              othersMapNatureId={b?.userBusinessInterestId}
                              FieldName={b?.businessType}
                              userId={this.state.userId}
                            />
                          </td>
                          <td style={{wordBreak:"break-word",textAlign:"center"}}>
                            {b.estimatedMarketValue !== undefined &&
                            b.estimatedMarketValue !== null && b.estimatedMarketValue != ''
                              ? $AHelper.IncludeDollars(b.estimatedMarketValue)
                              : "-"}
                              {konsole.log(b.estimatedMarketValue =='',"estimatedMarketValue")}
                          </td>
                          <td className="text-center">{$AHelper.capitalizeAllLetters(b.ownershipType || "-")}</td>
                          <td className="text-center">{b.additionalDetails || "-"}</td>
                          <td className="text-center">{b.taxIDNo || "-"}</td>
                          
                          <td style={{verticalAlign:"middle"}}>
                            {/* <div className="d-flex justify-content-between" style={{ width: "60px" }}>
                                  <div className=""> 
                                    <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => this.updateBusinessInterest(b)}>Edit</span>
                                  </div>
                                  <div className="">
                                    <span className="cursor-pointer" onClick={() => this.deleteUserData(b, this.state.userId, this.state.logginUserId)}><img src="/icons/deleteIcon.svg" className="w-75 p-0 m-0" alt="g4" /></span>
                                  </div>
                           </div> */}
                              <div className="d-flex justify-content-center gap-2">
                                            <div className=' d-flex flex-column align-items-center' onClick={() => this.updateBusinessInterest(b)}>
                                                <img className="cursor-pointer mt-0" src="/icons/EditIcon.png" alt=" Mortgages" style={{ width: "20px"}}  />
                                                {/* <span className='fw-bold mt-1' style={{ color: "#720C20", cursor: "pointer" }}>Edit</span> */}
                                            </div>
                                            <div>
                                                <span  style={{borderLeft:"2px solid #e6e6e6", paddingLeft:"5px", height:"40px", marginTop:"5px"}} className="cursor-pointer"  onClick={() => this.deleteUserData(b, this.state.userId, this.state.logginUserId)}>
                                                    <img src="/icons/deleteIcon.svg" className="mt-0" alt="g4" style={{ width: "20px" }} />
                                                </span>
                                  </div>
                           </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(BusinessInterestAsset);