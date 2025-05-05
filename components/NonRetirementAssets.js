import React, { Component, useContext } from "react";
import ExpensesPaidQuestion from "./ExpensesPaidQues"
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, } from "react-bootstrap";
import Select from "react-select";
import { connect } from "react-redux";
import { SET_LOADER } from "../components/Store/Actions/action";
import { $Service_Url } from "../components/network/UrlPath";
import { $CommonServiceFn, $postServiceFn, } from "../components/network/Service";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import { fileLargeMsg } from "./control/Constant";
import CurrencyInput from "react-currency-input-field";
import Other from "./asssets/Other";
import OtherInfo from "./asssets/OtherInfo";
import { $AHelper } from "../components/control/AHelper";
import PdfViewer2 from "./PdfViwer/PdfViewer2";
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";
import TableEditAndViewForDecease from "./Deceased/TableEditAndViewForDecease";
import { fileNameShowInClickHere, removeDuplicate } from "./Reusable/ReusableCom";
export class NonRetirementAssests extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      fileCategoryId: 5,
      fileTypeId: 10,
      fileObj: null,
      logginUserId: sessionStorage.getItem("loggedUserId"),
      userId: "",
      show: false,
      PreConditionTypes: [],
      loggedUserId: "",
      UserAgingAssests: [],
      OwnerTypes: [],
      beneficiaryList: [],
      beneficiary: "",
      agingAssetCatId: "1",
      agingAssetTypeId: "",
      ownerTypeId: "",
      nameOfInstitution: "",
      balance: "",
      natureId: "",
      disable: false,
      agingAssetBeneficiaryId: null,
      viewshowfile: false,
      viewFileId: "",
      selectfileName: "Click to Browse your file",
      fileuserInsDocId: "",
      fileuserInsId: "",
      viewshowfile: false,
      viewFileId: "",
      selectfileName: "Click to Browse your file",
      fileuserInsDocId: "",
      fileuserInsId: "",
      updateOwnerData: [],
      spouseUserId: "",
      primarymemberDetails: {},
      relationRelationcheckBeneficiary: false,
      quesReponse: null
    };
    this.NonRetirementAssestsRef = React.createRef();
    this.ownerRef = React.createRef();
  }
  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let loggedUserId = sessionStorage.getItem("loggedUserId") || "";
    let spouseUserId = sessionStorage.getItem("spouseUserId") || "";

    let primarymemberDetails = JSON.parse(
      sessionStorage?.getItem("userDetailOfPrimary")
    );
    this.setState({
      userId: newuserid,
      spouseUserId: spouseUserId,
      primarymemberDetails: primarymemberDetails,
    });
    this.fetpreconditontypes();
    this.fetuseragingassets(newuserid);
    this.fetchownertypes(newuserid);
    this.fetchBeneficiaryList(newuserid);
    if (spouseUserId !== '' && spouseUserId !== null && spouseUserId !== undefined) {
      this.fetchmemberRelationshipDetails(spouseUserId)
    }
  }

  fetchmemberRelationshipDetails = async (spouseUserID) => {
    let url = `${$Service_Url.postMemberRelationship}/${spouseUserID}?primaryUserId=${spouseUserID}`;
    let method = "GET";
    let results = await $postServiceFn.memberRelationshipAddPut(method, url);
    this.setState({ relationRelationcheckBeneficiary: results.data?.data?.isBeneficiary })
    konsole.log('resultsresults', results)
  }

  fetchownertypes = (userId) => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFileBelongsToPath + `?ClientUserId=${userId}`, "", (response, err) => {
      this.props.dispatchloader(false);
      if (response) {
        const responseMap = response.data.data.map((item) => {
          return {
            value: item.fileBelongsTo,
            label: item.fileBelongsTo == "JOINT" ? "JOINT" : $AHelper.capitalizeAllLetters(item.belongsToMemberName),
          };
        });
        this.setState({
          ...this.state,
          OwnerTypes: responseMap,
        });
      } else err;
    }
    );
  };
  fetpreconditontypes = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getPreconditionType + "1", "", (response) => {
      this.props.dispatchloader(false);
      if (response) {
        this.setState({
          ...this.state,
          PreConditionTypes: response.data.data,
        });
      }
    }
    );
  };

  fetchBeneficiaryList = (newuserid) => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getBeneficiaryByUserId + newuserid, "", (response) => {
      this.props.dispatchloader(false);
      if (response) {
        // konsole.log("beneficiaryList",response);
        this.setState({
          ...this.state,
          beneficiaryList: response.data.data,
        });
      }
    }
    );
  };

  fetuseragingassets = (userid) => {
    userid = userid || this.state.userId;
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserAgingAsset + userid, "", (response) => {
      this.props.dispatchloader(false);
      if (response) {
        this.setState({
          ...this.state,
          UserAgingAssests: response.data.data.filter(
            (v, j) => v.agingAssetCatId == "1"
          ),
        });
      }
    }
    );
  };

  validate = () => {
    let nameError = "";
    if (this.state.agingAssetTypeId == 0) {
      nameError = "Non Retirement Assets cannot be Blank";
      // } else if (this.state.nameOfInstitution == "") {
      //     nameError = "Name of Institution cannot be Blank"
      // } else if (this.state.balance == "") {
      //     nameError = "Balance cannot be Blank"
    } else if (this.state.ownerTypeId == "") {
    }
    if (nameError) {
      this.setState({ disable: false })
      this.toasterAlert(nameError, "Warning");
      return false;
    }
    return true;
  };

  handleInputChange = (event) => {
    event.preventDefault();
    const eventId = event.target.id;
    const eventValue = event.target.value;
    konsole.log("eventUd", eventId, eventValue);
    if (eventId == "nameOfInstitution") {
      let nameValue = $AHelper.capitalizeFirstLetter(eventValue);
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

  handleShow = () => {
    this.setState({ show: true, });
    this.fetchBeneficiaryList(this.state.userId);
  };

  updateNonRetirement = (asset) => {
    // konsole.log("assetasset", asset,asset?.quesReponse);
    let fileId = asset?.assetDocuments[0]?.fileId;
    let selectfileName = asset?.assetDocuments[0]?.documentName;
    let selectfileuserInsDocId = asset?.assetDocuments[0]?.userAgingAssetDocId;
    konsole.log("asset?.assetDocuments[0]?.userInsDocId", asset?.assetDocuments[0]?.userInsDocId, asset?.assetDocuments[0]?.userInsId);
    const assetOwners = removeDuplicate(asset.assetOwners, 'ownerUserId')
    konsole.log("asa", asset);
    this.setState({
      updateOwnerData: asset.assetOwners,
      agingAssetTypeId: asset.agingAssetTypeId,
      ownerTypeId: assetOwners.length == 2 ? "Joint" : assetOwners.length == 1 ? asset.assetOwners[0].ownerUserId : "-",
      nameOfInstitution: asset.nameOfInstitution,
      balance: asset.balance,
      natureId: asset.userAgingAssetId,
      beneficiary: asset.assetBeneficiarys[0]?.beneficiaryUserId,
      assetOwners: asset.assetOwners,
      agingAssetBeneficiaryId: asset.assetBeneficiarys[0]?.agingAssetBeneficiaryId,
      viewshowfile: fileId !== undefined ? true : false,
      viewFileId: fileId,
      selectfileName: selectfileName !== null && selectfileName !== "" && selectfileName !== undefined ? asset.agingAssetTypeId == '999999' ? 'Non-Retirement Financial Assets' : asset.assetTypeName + '.pdf' : "Click to Browse your file",
      fileuserInsDocId: selectfileuserInsDocId,
      quesReponse: asset.quesReponse
    });
  };

  selectFileUpload = () => {
    document.getElementById("fileUploadLifeId").click();
  };
  handleFileSelection = (e) => {
    if (e.target.files.length == 0) {
      this.setState({ fileObj: null, });
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

  handleFileUpload = (type) => {
    konsole.log("typetype: ", type);
    if (this.state.ownerTypeId == "") {
      this.toasterAlert("Owner cannot be Blank", "Warning");
      return;
    }
    if (this.state.agingAssetTypeId == 0) {
      this.toasterAlert("Non Retirement Assets cannot be Blank", "Warning");
      return;
    }
    this.setState({ disable: true })
    if (this.state.fileObj !== null && this.state.fileObj !== undefined) {
      this.props.dispatchloader(true);
      $postServiceFn.postFileUpload(this.state.fileObj, this.state.userId, this.state.logginUserId, this.state.fileTypeId, this.state.fileCategoryId, 2, (response, errorData) => {
        this.props.dispatchloader(false);
        if (response) {
          konsole.log("resposne", response);
          let responseFileId = response.data.data?.fileId;
          let responsedocName = response.data.data?.fileName;
          let responsedocPath = response.data.data?.fileURL;
          this.handleAgingassetsubmit(type, responseFileId, responsedocName, responsedocPath
          );
        } else if (errorData) {
          this.toasterAlert(errorData, "Warning");
        }
      }
      );
    } else {
      this.handleAgingassetsubmit(type, null);
    }
  };

  handleAgingassetsubmit = (type, fileId, documentName, documentPath) => {
    konsole.log("typetype1", type);

    let inputdata = JSON.parse(JSON.stringify(this.state));
    let assetBeneficiarysList = [];
    if (this.state.beneficiary !== "" && this.state.beneficiary !== undefined) {
      assetBeneficiarysList = [{ beneficiaryUserId: this.state.beneficiary, },];
    }
    let assetDocuments = [];
    if (fileId !== null) {
      assetDocuments = [{ documentName: documentName, documentPath: documentPath, fileId: fileId, },];
      if (this.state.natureId !== undefined && this.state.natureId !== null && this.state.natureId !== "" && inputdata.fileuserInsDocId !== undefined) {
        // let updatejson={
        // "userInsDocId":inputdata?.fileuserInsDocId,
        // "userInsId":inputdata?.fileuserInsId
        // }
        // assetDocuments.push(updatejson)
        if (assetDocuments.length > 0) {
          assetDocuments[0]["userAgingAssetDocId"] = inputdata?.fileuserInsDocId;
        }
      }
    } else {
      assetDocuments = [];
    }

    let assetOwners = [];

    if (this.state.natureId !== undefined && this.state.natureId !== null && this.state.natureId !== "") {
      const assetOwn = this.state.OwnerTypes.filter((item) => item.value !== "JOINT");
      let assetOwnersdata = assetOwn.map((item) => {
        return { ownerUserId: item.value, OwnerUserName: "OwnerUserName", isActive: true, };
      });
      let updatupdateOwnerData = this.state.updateOwnerData;
      if (this.state.ownerTypeId == "JOINT") {
        for (let i = 0; i < updatupdateOwnerData.length; i++) {
          for (let [index, item] of assetOwnersdata.entries()) {
            if (updatupdateOwnerData[i].ownerUserId.toLowerCase() == assetOwnersdata[index].ownerUserId.toLowerCase()) {
              assetOwnersdata[index]["agingAssetOwnerId"] = updatupdateOwnerData[i].agingAssetOwnerId;
              assetOwnersdata[index].OwnerUserName = updatupdateOwnerData[i].ownerUserName;
            }
          }
        }
        assetOwners = assetOwnersdata;
      } else {
        if (updatupdateOwnerData.length == 1 && updatupdateOwnerData[0].ownerUserId.toLowerCase() == this.state.ownerTypeId.toLowerCase()) {
          assetOwnersdata = updatupdateOwnerData;
        } else {
          for (let [index, item] of assetOwnersdata.entries()) {
            if (item.ownerUserId.toLowerCase() == this.state.ownerTypeId.toLowerCase()) {
              assetOwnersdata[index].isActive = true;
              if (updatupdateOwnerData.length !== 1) {
                assetOwnersdata[index]["agingAssetOwnerId"] = updatupdateOwnerData[1].agingAssetOwnerId;
              }
            } else {
              assetOwnersdata[index].isActive = false;
              assetOwnersdata[index]["agingAssetOwnerId"] = updatupdateOwnerData[0].agingAssetOwnerId;
            }
          }
        }

        assetOwners = assetOwnersdata;
      }
    } else {
      if (this.state.ownerTypeId !== "JOINT") {
        assetOwners = [{ ownerUserId: this.state.ownerTypeId }];
      } else {
        const assetOwn = this.state.OwnerTypes.filter(
          (item) => item.value !== "JOINT"
        );

        assetOwners = assetOwn.map((item) => {
          return { ownerUserId: item.value };
        });
      }
    }

    let asset = {
      // createdBy: this.state.loggedUserId,
      createdBy: this.state.userId,
      agingAssetCatId: inputdata.agingAssetCatId,
      agingAssetTypeId: inputdata.agingAssetTypeId,
      ownerTypeId: 1, // remove from here
      nameOfInstitution: $AHelper.capitalizeAllLetters(inputdata.nameOfInstitution),
      balance: inputdata.balance,
      assetDocuments: assetDocuments,
      assetOwners: assetOwners,
      assetBeneficiarys: assetBeneficiarysList,
      isRealPropertys: [],
      isActive: true,
      quesReponse: this.state?.quesReponse
    };
    if (this.validate()) {
      let method = "POST";
      let url = (url = $Service_Url.postUseragingAsset);
      if (this.state.natureId !== undefined && this.state.natureId !== null && this.state.natureId !== "") {
        asset["userAgingAssetId"] = this.state.natureId;
        asset["updatedBy"] = this.state.logginUserId;
        // if (asset["assetOwners"].length > 0) {
        //   asset["assetOwners"][0].agingAssetOwnerId =
        //     this.state.assetOwners[0].agingAssetOwnerId;
        //   asset["assetOwners"][0].ownerUserName =
        //     this.state.assetOwners[0].ownerUserName;
        // }
        if (assetBeneficiarysList.length == 0) {
          delete asset["assetBeneficiarys"];
        } else {
          const beneficiary = this.state.beneficiaryList.filter((res) => { return res.value == this.state.beneficiary; });
          let beneficiaryUserName = beneficiary.length == 0 ? this.state.primarymemberDetails?.memberName : beneficiary[0].label
          if (this.state.agingAssetBeneficiaryId !== null && this.state.agingAssetBeneficiaryId !== undefined) {
            asset["assetBeneficiarys"] = [{ beneficiaryUserId: this.state.beneficiary, beneficiaryUserName: beneficiaryUserName, agingAssetBeneficiaryId: this.state.agingAssetBeneficiaryId, },];
          } else {
            asset["assetBeneficiarys"] = [{ beneficiaryUserId: this.state.beneficiary, beneficiaryUserName: beneficiaryUserName },];
          }
        }
        method = "PUT";
        url = $Service_Url.putUpdateUserAgingAsset;
      }

      let totalinuptdata = {
        userId: this.state.userId,
        asset: asset,
      };
      konsole.log("jsonobj", totalinuptdata);
      this.props.dispatchloader(true);
      this.setState({ disable: true })
      $CommonServiceFn.InvokeCommonApi(method, url, totalinuptdata, (response) => {
        this.setState({ disable: false })
        this.props.dispatchloader(false);
        if (response) {
          konsole.log("Success res" + JSON.stringify(response));
          this.setState({ selectfileName: "Click to Browse your file" });
          let assetResponse = response.data.data;
          if (this.state.ownerTypeId == "999999") {
            this.ownerRef.current.saveHandleOther(assetResponse.userAgingAssetId);
          }
          if (this.state.agingAssetTypeId == "999999") {
            this.NonRetirementAssestsRef.current.saveHandleOther(assetResponse.userAgingAssetId);
          }

          if (this.state.natureId !== undefined && this.state.natureId !== null && this.state.natureId !== "") {
            AlertToaster.success("Data updated successfully");
          } else {
            AlertToaster.success("Data saved successfully");
          }

          konsole.log("typetype", type);
          if (type == "Add") {
            this.props.handlenonretireproppopShow();
          } else {
            this.clearState();
          }
        } else {
          this.toasterAlert(Msg.ErrorMsg, "Warning");
          this.setState({ disable: false })
        }
        this.fetuseragingassets(this.state.userId);
      }
      );
    }
  };

  clearState = () => {
    this.setState({
      ...this.state,
      agingAssetTypeId: "",
      ownerTypeId: "",
      nameOfInstitution: "",
      balance: "",
      natureId: "",
      beneficiary: "",
      assetOwners: [],
      agingAssetBeneficiaryId: "",
      viewshowfile: false,
      viewFileId: "",
      selectfileName: "Click to Browse your file",
      fileuserInsDocId: "",
      fileObj: null,
      // relationRelationcheckBeneficiary: false,
      updateOwnerData: [],
      quesReponse: null
    });
  };
  toasterAlert(text, type) {
    this.setState({ disable: false })
    this.context.setdata({ open: true, text: text, type: type });
  }

  DeleteData = (assets) => {
    konsole.log("assetsassets", assets);
    let jsonobj = {
      userId: assets.createdBy,
      asset: {
        agingAssetCatId: assets.agingAssetCatId,
        agingAssetTypeId: assets.agingAssetTypeId,
        ownerTypeId: assets.ownerTypeId,
        maturityYear: assets.maturityYear,
        userAgingAssetId: assets.userAgingAssetId,
        updatedBy: this.state.logginUserId,
        nameOfInstitution: assets?.nameOfInstitution,
        isActive: false,
        assetDocuments: [],
        assetOwners: assets.assetOwners,
        assetBeneficiarys: [],
        isRealPropertys: [],
      },
    };

    this.setState({ disable: true })
    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUpdateUserAgingAsset, jsonobj, (res, err) => {
      this.setState({ disable: false })
      if (res) {
        konsole.log("resres", res);
      } else {
        konsole.log("errerre", err);
      }
    }
    );
  };

  deleteUserData = async (assets) => {
    const req = await this.context.confirm(true, "Are you sure? you want to delete", "Confirmation");
    if (req == false) return;
    this.props.dispatchloader(true);

    konsole.log("assetsassets", assets);
    let jsonobj = {
      userId: assets.createdBy,
      asset: {
        agingAssetCatId: assets.agingAssetCatId,
        agingAssetTypeId: assets.agingAssetTypeId,
        ownerTypeId: assets.ownerTypeId,
        maturityYear: assets.maturityYear,
        userAgingAssetId: assets.userAgingAssetId,
        updatedBy: this.state.logginUserId,
        nameOfInstitution: assets?.nameOfInstitution,
        isActive: false,
        assetDocuments: [],
        assetOwners: assets.assetOwners,
        assetBeneficiarys: [],
        isRealPropertys: [],
      },
    };

    this.setState({ disable: true })
    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUpdateUserAgingAsset, jsonobj, (res, err) => {
      this.setState({ disable: false })
      this.props.dispatchloader(false);
      if (res) {
        konsole.log("resres", res);
        AlertToaster.success("Data deleted successfully");
        this.clearState()
        this.fetuseragingassets(this.state.userId);
      } else {
        konsole.log("errerre", err);
        this.setState({ disable: false })
      }
    }
    );
  };

  getQuestionResponse = (value) => {
    // konsole.log("vadsdsddlue",value)
    if (value) {
      const jsonString = JSON.stringify(value);
      this.setState({ quesReponse: jsonString })
    }
  }

  render() {
    konsole.log('relationRelationcheckBeneficiary', this.state.relationRelationcheckBeneficiary)
    konsole.log("updateOwnerData", this.state.updateOwnerData);

    konsole.log("this.state.fileObj", this.state);

    let primaryLogId = this.state.userId;
    let spouseLogId = this.state.spouseUserId;
    let beneficiaryList = this.state.beneficiaryList;
    if (this.state.ownerTypeId.toLocaleUpperCase() == spouseLogId.toLocaleUpperCase()) {
      let obj = {
        value: this.state.userId,
        label: this.state.primarymemberDetails?.memberName,
      };
      beneficiaryList = beneficiaryList.filter((item) => item.value !== spouseLogId);
      beneficiaryList.push(obj);
    } else if (this.state.ownerTypeId == "JOINT") {
      let obj = {
        value: this.state.userId,
        label: this.state.primarymemberDetails?.memberName
      };
      beneficiaryList = beneficiaryList.filter((item) => item.value !== primaryLogId);
      beneficiaryList.push(obj);
    }

    // else if (this.state.ownerTypeId == "JOINT") {
    //   beneficiaryList = beneficiaryList.filter((item) => item.value !== primaryLogId && item.value !== spouseLogId);
    // }

    let agingAssetType = this.state.agingAssetTypeId !== "" ? this.state.PreConditionTypes.filter((item) => item.value == this.state.agingAssetTypeId) : "";

    let beneficiary = {};
    let ownerTypeId = this.state.ownerTypeId !== "" ? this.state.OwnerTypes.filter((item) => item.value.toLowerCase() === this.state.ownerTypeId.toLowerCase()) : "";
    konsole.log(typeof this.state.agingAssetTypeId);
    beneficiary = $AHelper.capitalizeAllLetters(this.state.beneficiary) !== "" ? beneficiaryList.filter((v) => v.value == this.state.beneficiary) : "";

    let beneficiaryList2 = (this.state.relationRelationcheckBeneficiary == true) ? beneficiaryList : beneficiaryList.filter(item => item.value !== primaryLogId)
    console.log('beneficiaryList2beneficiaryList2', beneficiaryList2)
    konsole.log("fileuserInsDocIdfileuserInsDocId 2", this.state.show);

    return (
      <>
        {/* <style jsx global>{`  .modal-open .modal-backdrop.show {    opacity: 0;  }`}</style> */}
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            max-width: 52.25rem;
            margin: 1.75rem auto;
          }
        `}</style>
        <Modal
          show={this.props.show}
          size="lg"
          centered
          onHide={this.props.handlenonretireproppopShow}
          animation="false"
          backdrop="static"
          enforceFocus={false}
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Non-Retirement Financial Assets</Modal.Title>
          </Modal.Header>
          <Modal.Body className="mt-2">
            <div className="person-content">
              <Form.Group as={Row} className="">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Select className="w-100 p-0 custom-select" value={agingAssetType} onChange={(event) => this.setState({ agingAssetTypeId: event.value })} options={this.state.PreConditionTypes} placeholder={$AHelper.mandatory("Description of Non-Retirement Assets")} maxMenuHeight={150} isSearchable />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className={`${this.state.agingAssetCatId == "999999" ? "d-flex align-items-center mb-2" : ""}  d-md-none mb-2 `} >
                  {this.state.agingAssetTypeId == "999999" && (
                    <Other othersCategoryId={3}
                      userId={this.state.userId}
                      dropValue={this.state.agingAssetTypeId}
                      ref={this.NonRetirementAssestsRef}
                      natureId={this.state.natureId}
                    />
                  )}
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Form.Control className="upperCasing" type="text" value={this.state.nameOfInstitution.trimStart()} onChange={(event) => this.handleInputChange(event)} name="nameOfInstitution" id="nameOfInstitution" placeholder="Name of Institution" />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="d-none d-md-flex">
                {this.state.agingAssetTypeId == "999999" && (
                  <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                    <Other othersCategoryId={3} userId={this.state.userId} dropValue={this.state.agingAssetTypeId} ref={this.NonRetirementAssestsRef} natureId={this.state.natureId} />
                  </Col>
                )}
              </Form.Group>
              <Form.Group as={Row} className="">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <CurrencyInput prefix="$" value={this.state.balance} allowNegativeValue={false} className="border" onValueChange={(balance) => this.setState({ balance: balance })} name="balance" placeholder="Balance" decimalScale="2" />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Select className="w-100 p-0 custom-select" value={ownerTypeId} onChange={(event) => this.setState({ ownerTypeId: event.value })} options={this.state.OwnerTypes} placeholder={$AHelper.mandatory("Owner")} isSearchable />
                </Col>
              </Form.Group>
              {this.state.ownerTypeId == "999999" && (
                <Form.Group as={Row} className="mb-3">
                  <Col xs="12" sm="12" md="6" lg="6"></Col>
                  <Col xs="12" sm="12" md="6" lg="6">
                    <Other othersCategoryId={21} userId={this.state.userId} dropValue={this.state.ownerTypeId} ref={this.ownerRef} natureId={this.state.natureId} />
                  </Col>
                </Form.Group>
              )}
              <Form.Group as={Row}>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Select className="custom-select" value={(beneficiary?.length > 0 ? beneficiary?.map(ele => ({ ...ele, label: ele.label ? $AHelper.capitalizeAllLetters(ele.label) : '' })) : [])}
                    options={beneficiaryList2?.map(ele => ({ ...ele, label: ele.label ? $AHelper.capitalizeAllLetters(ele.label) : '' }))}
                    isSearchable placeholder="Beneficiary" onChange={(event) => this.setState({ beneficiary: event.value })} maxMenuHeight={80} />
                </Col>



                <Col xs="12" sm="12" md="6" lg="6" >
                  {/*  */}
                  <div className="d-flex justify-content-between align-items-center p-0 " >
                    <div className="ps-2 d-flex justify-content-between align-items-center fileInoutHealth">
                      {fileNameShowInClickHere(this.state.fileObj, this.state.selectfileName)}
                      <span className="bg-secondary text-white cursor-pointer uploadButtonHeath" onClick={this.selectFileUpload}>Upload</span>
                    </div>
                    <div style={{ height: "100%", borderRadius: "0px 3px 3px 0px" }}>
                      <input className="d-none" type="file" accept="application/pdf" id="fileUploadLifeId" onChange={this.handleFileSelection} />
                      {this.state.viewshowfile && (
                        <PdfViewer2 viewFileId={this.state.viewFileId} />
                      )}
                    </div>
                  </div>

                </Col>

                <Col>
                  <ExpensesPaidQuestion getQuestionResponse={this?.getQuestionResponse} quesReponse={this.state?.quesReponse} />
                </Col>
              </Form.Group>
            </div>

            <div className="mt-3">
              <div>
                <div className="">
                  <Button style={{ backgroundColor: "#76272b", border: "none" }} className="theme-btn float-end mb-2" onClick={() => this.handleFileUpload("Add")} disabled={this.state.disable == true ? true : false}>  {this.state.natureId !== undefined && this.state.natureId !== null && this.state.natureId !== "" ? "Update" : "Save"}</Button>
                </div>
                <div className="">
                  {this.state.natureId !== undefined && this.state.natureId !== null && this.state.natureId !== "" ? ("") : (
                    <Button className="theme-btn float-end anotherBTn" onClick={() => this.handleFileUpload("AddMore")} style={{ backgroundColor: "#76272b", border: "none" }} disabled={this.state.disable == true ? true : false}>  Add Another </Button>
                  )}
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 table-responsive nonRetirementTab" style={{ display: "block", maxHeight: "34vh", overflowY: "auto" }}>
            <div className="table-responsive financialInformationTable">
              {this.state.UserAgingAssests.length !== 0 && (
                <Table bordered className="">
                  <thead>
                    <tr>
                      <th>Description of Non-Retirement Asset</th>
                      <th className="te  ">Name of Institution</th>
                      <th>Balance</th>
                      <th>Owner</th>
                      <th>Beneficiary</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.UserAgingAssests &&
                      this.state.UserAgingAssests.map((asset, i) => {
                        const assetOwners = removeDuplicate(asset.assetOwners, 'ownerUserId')
                        return (
                          <tr key={i}>
                            <td style={{ wordBreak: "break-word" }}>
                              <OtherInfo othersCategoryId={3} othersMapNatureId={asset.userAgingAssetId} FieldName={asset.assetTypeName} userId={this.state.userId} />
                            </td>
                            <td className="text-center">{$AHelper.capitalizeAllLetters(asset.nameOfInstitution || "-")}</td>
                            <td style={{ wordBreak: "break-word", textAlign: "center" }}> {asset?.balance !== null ? $AHelper.IncludeDollars(asset.balance) : "-"}</td>
                            <td> {$AHelper.capitalizeAllLetters(assetOwners?.length == 2 ? "Joint" : assetOwners.length == 1 ? assetOwners[0].ownerUserName : "-")}</td>
                            <td className="text-center">{$AHelper.capitalizeAllLetters(asset.assetBeneficiarys.length > 0 ? asset.assetBeneficiarys[0].beneficiaryUserName : "-")}</td>
                            <td style={{ verticalAlign: "middle" }}>
                              <TableEditAndViewForDecease
                                key={i}
                                forUpdateValue={asset}
                                type='primary'
                                actionType='Beneficiary'
                                handleUpdateFun={this.updateNonRetirement}
                                handleDeleteFun={this.deleteUserData}
                                refrencePage="NonRetirementAssets"
                                isOwner={(assetOwners?.length == 2 || assetOwners?.length?.length == 0) ? false : true}
                                ownerUserId={assetOwners.length > 0 ? assetOwners[0].ownerUserId : ""}
                                userId={this.state.userId}
                                memberUserId={asset?.assetBeneficiarys.length > 0 ? asset?.assetBeneficiarys[0].beneficiaryUserId : ''}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              )}
            </div>
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
)(NonRetirementAssests);
