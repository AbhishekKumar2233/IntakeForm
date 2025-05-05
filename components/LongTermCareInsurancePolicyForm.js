import React, { Component } from "react";
import {
  Button,
  Modal,
  Table,
  Form,
  Tab,
  Row,
  Col,
  Container,
  Nav,
  Dropdown,
  Collapse,
  Breadcrumb,
} from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { $AHelper } from "./control/AHelper";
import konsole from "./control/Konsole";
import { $CommonServiceFn, $postServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import { Msg } from "./control/Msg";
import moment from "moment";
import Other from "./asssets/Other";
import PdfViewer2 from "./PdfViwer/PdfViewer2";
import { globalContext } from "../pages/_app";
import DatepickerComponent from "./DatepickerComponent";
import OtherInfo from "./asssets/OtherInfo";
import AlertToaster from "./control/AlertToaster";
import { SET_LOADER } from "./Store/Actions/action";
import { connect } from "react-redux";
import {fileLargeMsg} from "./control/Constant";
import ExpensesPaidQuestion from "./ExpensesPaidQues";
import { fileNameShowInClickHere, getOtherFieldsName, isNotValidNullUndefile } from "./Reusable/ReusableCom";




class LongTermCareInsurancePolicyForm extends Component {

  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      fileCategoryId: 5, //finance,
      fileTypeId: 13,
      fileObj: null,
      show: false,
      startDate: new Date(),
      longTermInsProvider: [],
      premiumFreList: [],
      longTermTypeList: [],
      longtermcareinsuranecpolicyformdata: [],
      userId: (this.props.userId && this.props.userId) || "",
      insTypeId: 0,
      documentTypeId: "",
      insCompanyId: 0,
      policyStartDate: "",
      dailyBenefitNHSetting: "",
      dailyBenefitOtherThanNH: "",
      eliminationPeriod: "",
      maxLifeBenefits: "",
      maxBenefitYears: "",
      maxBenefitAmount: "",
      premiumFrequencyId: "",
      planWithInflationRider:false,
      lastTimePremiumIncrease: "",
      userLongTermInsId: null,
      planWithInflationRiderPer:null,
      viewFileId: "",
      selectfileName: "Click to Browse your file",
      fileuserLongTermInsDocId: "",
      documentTypeValue: "",
      disable: false,
      inflationRiderTypeId:1,
      longTermInsDocs: {
        documentName: "string",
        documentPath: "string",
      },
      premiumAmount:"",
      spouseUserIds:"",
      SameSpouseData:false,
      SamePremFeqAndAmount:false,
      showPremiumFreqRadio:false,
      showSameAsSouseCheck:true,
      premiumAmountForSpouse:"",
      quesReponse:null
    };

    this.insRef = React.createRef();
    this.insCompanyRef = React.createRef();
  }

  componentDidMount() {
    const spouseUserId = sessionStorage.getItem("spouseUserId");
    this.setState({spouseUserIds:spouseUserId})
    if (spouseUserId === "null") {
      this.fetchInsProvider();
      this.fetchLongTermInsType();
      this.fetchPremiumFreList(); 
      this.getLongTermCareInsurancePolicyForm();
    }
  }

  getLongTermCareInsurancePolicyForm = () => {
    let userId = this.props.userId;
    konsole.log("Nk", userId);
    // konsole.log("NkNK")
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getUserLongTermIns + userId,
      "",
      (response) => {
        if (response) {
          konsole.log(
            "longtermcareinsuranecpolicyformdata",
            response.data.data.longTermIns
          );
          this.setState({
            ...this.state,
            longtermcareinsuranecpolicyformdata: response.data.data.longTermIns,
          });
        }
      }
    );
  };

  handleClose = () => {
    this.setState({
      show: !this.state.show && this.props?.showLongTerm(),
      showPremiumFreqRadio:false,
      showSameAsSouseCheck:true,
      SameSpouseData:false,
    });
    // this.props?.showLongTerm()
    this.handleClear();
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userId !== this.props.userId) {
      this.setState({
        userId: this.props.userId,
      });
    }
  }

  fetchPremiumFreList = () => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getPreFrequency,
      "",
      (response) => {
        // konsole.log("response01",response)
        if (response) {
          this.setState({
            ...this.state,
            premiumFreList: response.data.data,
          });
        }
      }
    );
  };

  fetchInsProvider = () => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getInsProvider,
      this.state,
      (response) => {
        if (response) {
          this.setState({
            ...this.state,
            longTermInsProvider: response.data.data,
          });
        }
      }
    );
  };

  handleClear = () => {
    this.setState({
      insTypeId: "",
      insCompanyId: "",
      policyStartDate: "",
      dailyBenefitNHSetting: "",
      dailyBenefitOtherThanNH: "",
      eliminationPeriod: "",
      maxLifeBenefits: "",
      maxBenefitYears: "",
      maxBenefitAmount: "",
      premiumFrequencyId: "",
      planWithInflationRider:false,
      planWithInflationRiderPer:null,
      lastTimePremiumIncrease: "",
      premiumAmount:"",
      inflationRiderTypeId:1,
      fileObj: null,
      viewFileId: "",
      selectfileName: "Click to Browse your file",
      fileuserLongTermInsDocId: "",
      documentTypeValue: "",
      userLongTermInsId: "",
      quesReponse:null
    });
  };

  validate = () => {
    let nameError = "";
    // if (this.state.premiumFrequencyId == "") {
    //     nameError = " Premium cannot be blank";
    //   }

    // if (this.state.premiumFrequencyId == "") {
    //   nameError = " Premium cannot be blank";
    // }

    // if (this.state.maxBenefitAmount == "") {
    //     nameError = "Max "
    // }
    // if (this.state.maxBenefitYears == "") {
    //   nameError = "Number of Year Benefits will Continue cannot be blank";
    // }
    // if (this.state.maxLifeBenefits == "") {
    //   nameError = "Max Lifetime benefit cannot be blank";
    // }
    // if (this.state.eliminationPeriod == "") {
    //   nameError = "Elimination Period cannot be Blank";
    // }
    // if (this.state.dailyBenefitOtherThanNH == "") {
    //   nameError =
    //     "Daily Amount other than nursing home setting cannot be blank";
    // }
    // if (this.state.dailyBenefitNHSetting == "") {
    //   nameError = "Daily Amount nursing home cannot be blank";
    // }
    // if (this.state.policyStartDate == "") {
    //   nameError = "Please enter the policy start date";
    // }
    // if (this.state.insTypeId == 0) {
    //   nameError = "Type of Policy cannot be Blank";
    // }
    // if (this.state.insCompanyId == "") {
    //   nameError = "Insurance Company cannot be Blank";
    // }
    if (nameError) {
      // alert(nameError);
      this.toasterAlert(nameError, "Warning");
      return false;
    }
    return true;
  };
  handleShow = () => {
    this.fetchInsProvider();
    this.fetchLongTermInsType();
    this.fetchPremiumFreList();
    this.setState({show: !this.state.show,});
    this.getLongTermCareInsurancePolicyForm()
  };

  fetchLongTermInsType = () => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getLongTermsInsType,
      this.state,
      (response) => {
        // konsole.log("response0",response)
        if (response) {
          this.setState({
            ...this.state,
            longTermTypeList: response.data.data,
          });
          konsole.log("longTermTypeList", longTermTypeList);
        }
      }
    );
  };

  getplanWithInflationRider = (event) => {
    const InflationName = event?.target?.name;
    const InflationValue = event?.target?.value;
    // konsole.log("InflationRiderName",InflationRiderName,"InflationRiderValue",InflationRiderValue);
    if (InflationName == "planWithInflationRider"){
      let vlaueOf=(InflationValue == "Yes")?"true":"false";
      this.setState({ ...this.state, [InflationName]: vlaueOf })
    } else{
      let vlaueOf=(InflationValue == "Simple")?1:2;
      this.setState({ ...this.state, [InflationName]:vlaueOf })
    }

  
  };

  updatelong = async(det) => {
    let viewFileId = det?.longTermInsDocs[0]?.fileId;
    // let selectfileName = det?.longTermInsDocs[0]?.documentName;
    let selectfileNameongTerm=this.state?.longTermTypeList?.find(item=>item?.value==det?.insTypeId)?.label 
    let selectfileName=''
    if(viewFileId){
      selectfileName =isNotValidNullUndefile(selectfileNameongTerm)?selectfileNameongTerm:'Long Term Care'
    }
    let fileuserLongTermInsDocId = det?.longTermInsDocs[0]?.userLongTermInsDocId;
    const lastTimePremiumIncrease = det.lastTimePremiumIncrease !== null ? "" : new Date(det.lastTimePremiumIncrease);
    // Konsole.log("fileuserLongTermInsDocId", fileuserLongTermInsDocId)
    this.setState({
      insTypeId: det.insTypeId,
      // maxBenefitYears: det.maxBenefitYears,
      dailyBenefitOtherThanNH: det.dailyBenefitOtherThanNH,
      dailyBenefitNHSetting: det.dailyBenefitNHSetting,
      eliminationPeriod: det.eliminationPeriod,
      maxLifeBenefits: det.maxLifeBenefits,
      maxBenefitYears: det.maxBenefitYears,
      insCompanyId: det.insCompanyId,
      premiumFrequencyId: det.premiumFrequencyId,
      policyStartDate: det.policyStartDate !== null ? new Date(det.policyStartDate) : null,
      planWithInflationRider: det.planWithInflationRider,
      premiumAmount:det.premiumAmount,
      planWithInflationRiderPer:det.planWithInflationRiderPer,
      inflationRiderTypeId:det.inflationRiderTypeId,
      lastTimePremiumIncrease: det.lastTimePremiumIncrease !== null ? new Date(det.lastTimePremiumIncrease) : null,
      userLongTermInsId: det.userLongTermInsId,
      selectfileName: selectfileName !== null && selectfileName !== "" && selectfileName !== undefined ? selectfileName : "Click to Browse your file",
      viewFileId: viewFileId,
      fileuserLongTermInsDocId: (fileuserLongTermInsDocId !== undefined) ? fileuserLongTermInsDocId : 0,
      documentTypeValue: det?.additionalDetails !== null ? det?.additionalDetails : "",
      showSameAsSouseCheck:false,
      quesReponse:det?.quesReponse

    });

    if(viewFileId && det.insTypeId== '999999'){
        const obj = { userId: this.state.userId, othersCategoryId: 34, othersMapNatureId: det?.userLongTermInsId, isActive: true, othersMapNature: '' }
        selectfileName = await getOtherFieldsName(obj);
    }

    this.setState({
      selectfileName:selectfileName
    })
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
      // alert("only pdf format allowed");
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

  handleFileUpload = () => {
    let SpouseUserId=this.state.spouseUserIds;
    if( !this.state.insTypeId && !this.state.dailyBenefitNHSetting && !this.state.dailyBenefitOtherThanNH && !this.state.eliminationPeriod && !this.state.maxLifeBenefits && !this.state.maxBenefitYears && !this.state.maxBenefitAmount && !this.state.premiumFrequencyId  && !this.state.documentTypeValue && !this.state.premiumAmount ){
      AlertToaster.error("Long-Term Care Insurance Policy details cant be blank")
      this.setState({disable:false})
      return;
    }
    this.setState({disable: true})
    if ( isNotValidNullUndefile(this.state.fileObj)) {
      //   this.props.dispatchloader(true);
      $postServiceFn.postFileUpload( this.state.fileObj, this.state.userId, this.state.logginUserId, this.state.fileTypeId, this.state.fileCategoryId, 2, (response, errorData) => {
          // this.props.dispatchloader(false);
          if (response) {
            konsole.log("resposneresposne", response);
            let responseFileId = response.data.data.fileId;
            let responsedocName = response.data.data.fileName;
            let responsedocPath = response.data.data.fileURL;
            konsole.log("ababab", responseFileId, responsedocName, responsedocPath);
            this.handleLongTermPolicySubmit( responseFileId, responsedocName, responsedocPath,this.state.userId);// for primary with file
            if (this.state.SameSpouseData==true){ //same as spouse data if checked with file
              this.handleLongTermPolicySubmit(responseFileId,responsedocName,responsedocPath,SpouseUserId,"Same Spouse Data") 
              this.setState({SameSpouseData:false,SamePremFeqAndAmount:false})
            }
          } else if (errorData) {
            // alert(errorData);
            this.toasterAlert(errorData, "Warning");
          }
        }
      );
    } else {
      this.handleLongTermPolicySubmit(null,null,null,this.state.userId,); //for Primary
        if (this.state.SameSpouseData==true){ // Same as spouse data if checked
              this.handleLongTermPolicySubmit(null,null,null,SpouseUserId,"Same Spouse Data") 
              this.setState({SameSpouseData:false,SamePremFeqAndAmount:false})
            }
    }
  };

  handleLongTermPolicySubmit = (fileId, documentName, documentPath,userIds,sameSpouseDatas) => {

    // konsole.log("this.state.userId &&  this.state.insCompanyId &&  this.state.dailyBenefitNHSetting && this.state.dailyBenefitOtherThanNH && this.state.eliminationPeriod && this.state.maxLifeBenefits && this.state.maxBenefitYears && this.state.maxBenefitAmount && this.state.premiumFrequencyId && this.state.planWithInflationRider && this.state.documentTypeValue && this.state.premiumAmount && this.state.planWithInflationRiderPer && this.state.inflationRiderTypeId",
     if( !this.state.insTypeId && !this.state.dailyBenefitNHSetting && !this.state.dailyBenefitOtherThanNH && !this.state.eliminationPeriod && !this.state.maxLifeBenefits && !this.state.maxBenefitYears && !this.state.maxBenefitAmount && !this.state.premiumFrequencyId  && !this.state.documentTypeValue && !this.state.premiumAmount ){
       AlertToaster.error("Long-Term Care Insurance Policy details cant be blank")
       this.setState({disable:false})
       return;
     }
    let PolicyStartDate = null;
    let lastTimePremiumIncreasedate = null;
    let longTermInsDocs = [];
    let premiumAmountValue="";
    if (fileId !== "" && fileId !== null && fileId !== undefined && documentName !== "" && documentName !== null && documentName !== undefined && documentPath !== "" && documentPath !== null && documentPath !== undefined) {
      longTermInsDocs = [{
        documentName: documentName,
        documentPath: documentPath,
        fileId: fileId,
      },];
      if (this.state.userLongTermInsId !== null && this.state.userLongTermInsId !== "" && this.state.userLongTermInsId !== undefined) {
        longTermInsDocs[0]["userLongTermInsDocId"] = this.state.fileuserLongTermInsDocId;
      }
    }
    if (this.state.policyStartDate !== "" && this.state.policyStartDate !== null && this.state.policyStartDate !== undefined) {
      PolicyStartDate = $AHelper.getFormattedDate(this.state.policyStartDate);
    }
    if (this.state.lastTimePremiumIncrease !== "" && this.state.lastTimePremiumIncrease !== null && this.state.lastTimePremiumIncrease !== undefined) {
      lastTimePremiumIncreasedate = $AHelper.getFormattedDate(this.state.lastTimePremiumIncrease);
    }

    if (sameSpouseDatas === "Same Spouse Data" && this.state.SameSpouseData) {
      premiumAmountValue = this.state.SamePremFeqAndAmount ? this.state.premiumAmountForSpouse : "";
    } else {
        premiumAmountValue = this.state.premiumAmount;
    }

    let method = "POST";
    let Url = $Service_Url.postUserLongTermIns;

    let postData = {
      userId:userIds,
      longTermIns: {
        insTypeId: this.state.insTypeId,
        insCompanyId: this.state.insCompanyId,
        policyStartDate: PolicyStartDate,
        dailyBenefitNHSetting: this.state.dailyBenefitNHSetting,
        dailyBenefitOtherThanNH: this.state.dailyBenefitOtherThanNH,
        eliminationPeriod: this.state.eliminationPeriod,
        maxLifeBenefits: this.state.maxLifeBenefits,
        maxBenefitYears: this.state.maxBenefitYears,
        maxBenefitAmount: this.state.maxBenefitAmount,
        planWithInflationRider: this.state.planWithInflationRider,
        lastTimePremiumIncrease: lastTimePremiumIncreasedate,
        additionalDetails: this.state.documentTypeValue,
        longTermInsDocs: longTermInsDocs,
        premiumFrequencyId:this.state.premiumFrequencyId,
        premiumAmount:premiumAmountValue,
        planWithInflationRiderPer:this.state.planWithInflationRiderPer,
        inflationRiderTypeId:this.state.inflationRiderTypeId,
        isActive: true,
        quesReponse:this.state?.quesReponse
      },
    };

    if (this.state.userLongTermInsId !== null && this.state.userLongTermInsId !== "" && this.state.userLongTermInsId !== undefined) {
      postData.userLongTermInsId = this.state.userLongTermInsId;
      method = "PUT";
      Url = $Service_Url.updateUserLongTerm;
    }

    // konsole.log("postdatapostDatakkk", postData, Url);
    // konsole.log("postdatapostData", JSON.stringify(postData));
    this.props.dispatchloader(true);

    if (this.validate()) {
      $CommonServiceFn.InvokeCommonApi(
        method,
        Url,
        postData,

        (response) => {
          if (response) {
            this.setState({disable: false})
            // this.getLongTermCareInsurancePolicyForm();
            konsole.log("Success res" + JSON.stringify(response));
            konsole.log("Successkjklres", response);
            this.setState({ selectfileName: "Click to Browse your file" });

            { this.state.userLongTermInsId !== null && this.state.userLongTermInsId !== "" && this.state.userLongTermInsId !== undefined ? AlertToaster.success("Data updated successfully") : AlertToaster.success("Data saved successfully"); }

            let longTermResponse = response.data.data.longTermIns[0];
            if (this.state.insTypeId == "999999") {
              this.insRef.current.saveHandleOther(longTermResponse.userLongTermInsId);
            }
            if (this.state.insCompanyId == "999999") {
              this.insCompanyRef.current.saveHandleOther(longTermResponse.userLongTermInsId);
            }
            this.handleClose();
            this.props.dispatchloader(false);

          } else {
            // alert(Msg.ErrorMsg);
            this.toasterAlert(Msg.ErrorMsg, "Warning");
            this.setState({disable:false})
          }
        }
      );
    }   
  };

  toasterAlert(text, type) {
    this.context.setdata({
      open: true,
      text: text,
      type: type,
    });
  }

  deleteUserData =  async (data, userid) => {
    this.handleClear();
    const req = await this.context.confirm(true, "Are you sure? you want to delete", "Confirmation");
    if (!req) return;
    konsole.log("datata", data)
    this.props.dispatchloader(true);
    // konsole.log("jsonDelete", userid + "/" + data.userLongTermInsId,$Service_Url.deleteUserLongTermIns)
    $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteUserLongTermIns + userid + "/" + data?.userLongTermInsId, "", (response) => {
      this.props.dispatchloader(false);
      if (response) {
        konsole.log("responseDeleteLongIns", response)
        AlertToaster.success("Data Deleted Successfully");
        this.getLongTermCareInsurancePolicyForm()
      } else {
        konsole.log("errorLong", err)
      }
    });
  }

  functionForPremiumAmount=(eventValue)=>{
      this.setState({premiumAmount:eventValue})
      
  }

  functionForPremiumAmountForSpouse=(eventValue)=>{
    // konsole.log("wwwwdfasffd",event.target.value)
      this.setState({premiumAmountForSpouse:eventValue,})
      
  }

  functionForInflationPercentage=(value)=>{
    this.setState({planWithInflationRiderPer:value})
  }

  handleCheckBox=(event)=>{
    let eventName=event?.target?.name;
    let eventChecked=event?.target?.checked
    // konsole.log("nameee,value",eventName,eventChecked)
    this.setState({[eventName]:eventChecked,showPremiumFreqRadio:eventChecked})
  }

  handleRadioEvent=(event)=>{
    let eventName=event?.target?.name;
    let eventChecked=event?.target?.value
    // konsole.log("namevaluehandleRadioEvent",eventName,eventChecked)
    this.setState({[eventName]:eventChecked=="Yes"?true:false})
  }

  getQuestionResponse=(value)=>{
    // konsole.log("vadsdsddlue",value)
    if(value){
      const jsonString = JSON.stringify(value);
      this.setState({quesReponse:jsonString})
    }
  }


  render() {
    { konsole.log("kkkssssssssssssssskkkkkk", this.state.policyStartDate, this.state.lastTimePremiumIncrease,) }
    // konsole.log("lklklklklklk",this.state.state1)

    konsole.log(
      "documentTypeValue",
      this.state.documentTypeValue,
      this.state.premiumFreList,
      this.state.premiumFrequencyId
    );
    // konsole.log("planWithInflationRider", this.state.planWithInflationRider);
    // konsole.log("inflationRiderTypeId",this.state.inflationRiderTypeId)

    const insCompanyId = {
      value: "Insurance Provider",
      label: "Insurance Provider",
    };

    let Companyins = {};
    let premiumUpdate = {};
    let policyType = {};
    premiumUpdate =
      this.state.premiumFrequencyId !== ""
        ? this.state.premiumFreList.filter(
         (item) => item.value == this.state.premiumFrequencyId
        )
        : "";
    if (this.state.insCompanyId !== "999999") {
      Companyins =
        this.state.insCompanyId !== ""
          ? this.state.longTermInsProvider[this.state.insCompanyId - 1]
          : "";
    } else {
      Companyins =
        this.state.insCompanyId !== ""
          ? this.state.longTermInsProvider[
          this.state.longTermInsProvider.length - 1
          ]
          : "";
    }
    if (this.state.insCompanyId == "999999") {
      Companyins = this.state.longTermInsProvider.filter(
        (v) => v.value == this.state.insCompanyId
      );
    }
    policyType =
      this.state.insTypeId !== "" && this.state.insTypeId !== undefined
        ? this.state.longTermTypeList?.filter(
          (v) => v.value == this.state.insTypeId
        )
        : "";
    // policyType = (this.state.insTypeId !== '' && this.state.insTypeId !== undefined && this.state.insTypeId !== "999999") ? this.state.longTermTypeList?.filter(v => v.value == this.state.insTypeId) : "";
    konsole.log(
      "policyTypepolicyType",
      this.state.longTermTypeList,
      this.state.insTypeId,
      policyType
    );

    konsole.log(
      "CompanyinsCompanyins",
      this.state.longTermInsProvider,
      Companyins
    );  
  // konsole.log("thSameSpouseData",this.state.SameSpouseData,"SamePremFeqAndAmount",this.state.SamePremFeqAndAmount)
  // konsole.log("thipremiumAmountForSpouse",this.state.premiumAmountForSpouse,)

    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.5 !important;
          }
        `}</style>
        <a onClick={this.handleShow}>
          <img
            className="ms-2"
            src="/icons/add-icon.svg"
            alt="Life Insurance Form"
          />
        </a>

        <Modal
          show={this.props.show || this.state.show}
          size="lg"
          centered
          onHide={this.handleClose}
          animation="false"
          backdrop="static"
          enforceFocus={false}
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Long-Term Care Insurance Policies  </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="person-content">
              <Form.Group as={Row} className="mt-3">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Select
                    className="w-100 p-0 custom-select"
                    value={policyType}
                    options={this.state.longTermTypeList}
                    onChange={(event) =>
                      this.setState({ insTypeId: event.value })
                    }
                    placeholder="Type of Policy"
                  />
                </Col>
                {this.state.insTypeId == "999999" && (
                  <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                    <Other
                      othersCategoryId={34}
                      userId={this.state.userId}
                      dropValue={this.state.insTypeId}
                      ref={this.insRef}
                      natureId={this.state.userLongTermInsId}
                    />
                  </Col>
                )}
              </Form.Group>
              <Form.Group as={Row} className="datePlaceholderBlackColor">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <DatepickerComponent
                    name="dateFunded"
                    value={this.state.policyStartDate}
                    setValue={(value) =>
                      this.setState({ policyStartDate: value })
                    }
                    placeholderText="Date Policy Started"
                    maxDate={0}
                    minDate="100"
                  />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Select
                    className="w-100 p-0 custom-select"
                    value={Companyins}
                    // defaultValue={insCompanyId}
                    placeholder="Insurance Provider"
                    options={this.state.longTermInsProvider}
                    onChange={(event) =>
                      this.setState({ insCompanyId: event.value })
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="">
                <Col xs="12" sm="12" md="6" lg="6"></Col>
                {this.state.insCompanyId == "999999" && (
                  <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                    <Other
                      othersCategoryId={12}
                      userId={this.state.userId}
                      dropValue={this.state.insCompanyId}
                      ref={this.insCompanyRef}
                      natureId={this.state.userLongTermInsId}
                    />
                  </Col>
                )}
              </Form.Group>
              <Form.Group as={Row} className="">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <CurrencyInput
                    prefix="$"
                    className="border currencyInputPlaceholder"
                    allowNegativeValue={false}
                    name="grossincome"
                    value={this.state.dailyBenefitNHSetting}
                    onValueChange={(value) =>
                      this.setState({ dailyBenefitNHSetting: value })
                    }
                    decimalScale="2"
                    placeholder="Daily Benefit Amount-Nursing Home"
                  />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <CurrencyInput
                    prefix="$"
                    className="border currencyInputPlaceholder1"
                    allowNegativeValue={false}
                    name="grossincome"
                    onValueChange={(value) =>
                      this.setState({ dailyBenefitOtherThanNH: value })
                    }
                    decimalScale="2"
                    value={this.state.dailyBenefitOtherThanNH}

                    placeholder="Daily Benefit Amount other than Nurse Home Setting"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Form.Control
                    type="text"
                    defaultValue=""
                    placeholder="Elimination Period (Days/Months/Years)"
                    value={this.state.eliminationPeriod == null ? "" : this?.state?.eliminationPeriod}
                    onChange={(event) => this.setState({ eliminationPeriod:(event?.target?.value), })}
                    min={1}
                    decimalScale="2"
                  />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <CurrencyInput
                    prefix="$"
                    className="border"
                    allowNegativeValue={false}
                    value={this.state.maxLifeBenefits}
                    placeholder="Maximum Lifetime Benefits"
                    name="maxLifeBenefits"
                    onValueChange={(value) => {
                      this.setState({ maxLifeBenefits: value });
                    }}
                    decimalScale="2"
                  />
                </Col>
              </Form.Group>
              {konsole.log("yuituitutuiir", this.state.maxBenefitYears, this.state.eliminationPeriod)}
              <Form.Group as={Row} className="">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Form.Control
                    type="number"
                    defaultValue=""
                    value={this.state.maxBenefitYears == null ? "" : this.state.maxBenefitYears}
                    placeholder="Number of Year Benefits will Continue"
                    onChange={(event) =>
                      this.setState({
                        maxBenefitYears: parseFloat(event.target.value),
                      })
                    }
                    min={1}
                  />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Select
                    className="w-100 custom-select"
                    value={premiumUpdate}
                    options={this.state.premiumFreList}
                    onChange={(event) =>
                      this.setState({
                        premiumFrequencyId: event.value,
                      })
                    }
                    placeholder="Premium Frequeny"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="datePlaceholderBlackColor">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <DatepickerComponent
                    name="dateFunded"
                    value={this.state.lastTimePremiumIncrease}
                    setValue={(value) =>
                      this.setState({ lastTimePremiumIncrease: value })
                    }
                    placeholderText="When was the last premium Increase?"
                    maxDate={0}
                    minDate="100"
                  />

                  {/* name="dateFunded"
                  value={this.state.policyStartDate}
                  setValue={(value) =>
                    this.setState({ policyStartDate: value })
                  }
                  placeholderText="Date Policy Started"
                  maxDate={0}
                  minDate="100" */}
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                {/* <Form.Control
                    type="text"
                    defaultValue=""
                    value={this.state.premiumAmount == null ? "" : this.state.premiumAmount}
                    placeholder="Premium amount"
                    onChange={(event)=>{this.functionForPremiumAmount(event)}}
                    // min={0}
                    decimalScale="2"
                  /> */}

                 <CurrencyInput
                    prefix="$"
                    className="border"
                    allowNegativeValue={false}
                    // name="grossincome"
                    value={this.state.premiumAmount == null ? "" : this.state.premiumAmount}
                    onValueChange={(value) =>this.functionForPremiumAmount(value)}
                    decimalScale="2"
                    placeholder="Premium amount"
                  />

                </Col>
              </Form.Group>
              <Form.Group as={Row} className="">
                <Col
                  xs="12"
                  sm="12"
                  lg="12"
                  className="d-flex justify-content-start flex-column mb-2 "
                >
                  <p className="">Does the plan have an inflation rider?</p>
                  <div className="d-flex align-items-center justify-content-start">
                    <Form.Check
                      inline
                      className="left-radio"
                      label="Yes"
                      name="planWithInflationRider"
                      type="radio"
                      id="inline-radio-1"
                      defaultValue="Yes"
                      onChange={(event) =>
                        this.getplanWithInflationRider(event)
                      }
                      checked={ (this.state.planWithInflationRider == "true")  ? true  : null}
                    />
                    <Form.Check
                      inline
                      className="left-radio"
                      label="No"
                      name="planWithInflationRider"
                      type="radio"
                      id="inline-radio-2"
                      defaultValue="No"
                      onChange={(event) =>
                        this.getplanWithInflationRider(event)
                      }
                      checked={(this.state.planWithInflationRider == "false") ? true : null}
                    />
                  </div>
                </Col>
              
              </Form.Group >

              {(this.state.planWithInflationRider == "true" ) &&
               <>
               <Form.Group as={Row} className="mb-3">
               <Col xs="6" sm="6" lg="6" className="d-flex justify-content-start flex-column mb-2 " >
               <CurrencyInput
                    suffix="%"
                    className="border currencyInputPlaceholder"
                    allowNegativeValue={false}
                    name="Inflation Percentage"
                    value={this.state.planWithInflationRiderPer == null ? "" : this.state.planWithInflationRiderPer} 
                    onValueChange={(value)=>{this.functionForInflationPercentage(value)}}
                    // decimalScale="2"
                    decimalSeparator="."
                    groupSeparator=""
                    disableGroupSeparators
                    placeholder="Inflation Percentage"
                  />
                </Col>
                <Col xs="6" sm="6" lg="6" className="d-flex justify-content-start flex-column mb-2 ">
                  <div className="d-flex align-items-center justify-content-start">
                        <Form.Check inline className="left-radio" label="Simple" name="inflationRiderTypeId" type="radio" defaultValue="Simple" onChange={(event) =>this.getplanWithInflationRider(event)} checked={(this.state.inflationRiderTypeId == 1)? true: null} />
                        <Form.Check  inline  className="left-radio"  label="Compound"  name="inflationRiderTypeId"  type="radio"  defaultValue="Compound"  onChange={(event) =>this.getplanWithInflationRider(event)}  checked={(this.state.inflationRiderTypeId == 2)? true: null}/>
                      </div>
                </Col>
                  </Form.Group>              
               </>}
              {/* <Form.Group as={Row} className="mb-3">
                                <Col xs sm="6" lg="6">
                                    <   Form.Select>
                                        <option selected>Choose Document Type</option>
                                    </Form.Select>
                                </Col>
                                <Col xs sm="6" lg="6">
                                    <Form.Control type="file" />
                                </Col>
                            </Form.Group> */}
            <Form.Group as={Row} className="">
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  {/* <Form.Select onChange={(e)=>this.setState({documentTypeId:e.target.value})}>
                        <option selected value=''> Document Type </option>
                        <option value=" Choose Document 1" >Choose Document 1</option>
                        <option value="Choose Document 2">Choose Document 2</option>
                        <option value="Choose Document 3">Choose Document 3</option>
                      </Form.Select> */}

                  <Form.Control
                    type="text"
                    value={$AHelper.capitalizeFirstLetter(
                      this.state.documentTypeValue
                    )}
                    id="DocumentType"
                    placeholder="Policy No "
                    onChange={(e) =>
                      this.setState({ documentTypeValue: e.target.value })
                    }
                  />
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <div className="d-flex justify-content-between align-items-center p-0">
                    <div className="ps-2 d-flex align-items-center fileInoutHealth">
                      {fileNameShowInClickHere(this.state.fileObj, this.state.selectfileName)}
                    </div>
                    <span
                      className="bg-secondary text-white cursor-pointer uploadButtonHeath"
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

                      {this.state.userLongTermInsId !== null &&
                        this.state.viewFileId !== "" &&
                        this.state.viewFileId !== null &&
                        this.state.viewFileId !== undefined && (
                          <PdfViewer2 viewFileId={this.state.viewFileId} />
                        )}
                    </div>
                  </div>
                </Col>

                <Col xs="12">
                    <ExpensesPaidQuestion getQuestionResponse={this?.getQuestionResponse}  quesReponse={this.state?.quesReponse}/>
                </Col>

              </Form.Group>

              {/* show only when users add amount not update time */}
             {( this.props.userId &&  (this.state.spouseUserIds !== "null" && this.state.spouseUserIds!=this.props.userId) && this.state.showSameAsSouseCheck==true) && <>
                    <Form.Check className="d-inline-block longTermInsurenceChekbox" type="checkbox" checked={this.state.SameSpouseData} onChange={(event)=>{this.handleCheckBox(event)}} name="SameSpouseData" label="Copy same data to Spouse" />
                    {(this.state.showPremiumFreqRadio==true) && <>
                          <p className="marginTopForPremiumFrequencyQuestion">Save premium frequency for spouse also ?</p>

                          <Form.Check 
                          className="d-inline-block longTermInsurenceChekbox " 
                          type="radio" 
                          defaultValue="Yes" 
                          checked={(this.state.SamePremFeqAndAmount)==true?true:null} 
                          onChange={(event)=>{this.handleRadioEvent(event)}} 
                          name="SamePremFeqAndAmount" label="Yes"/>

                          <Form.Check 
                          className="d-inline-block longTermInsurenceChekbox " 
                          type="radio" defaultValue="No" 
                          checked={(this.state.SamePremFeqAndAmount==false)?true:null} 
                          onChange={(event)=>{this.handleRadioEvent(event)}} name="SamePremFeqAndAmount" label="No"/>
                          {
                            (this.state.SamePremFeqAndAmount==true) && 
                            <CurrencyInput
                            prefix="$"
                            className="border mt-3 mb-3"
                            allowNegativeValue={false}
                            name="grossincome"
                            value={this.state.premiumAmountForSpouse == null ? "" : this.state.premiumAmountForSpouse} 
                            onValueChange={(value) =>
                              this.functionForPremiumAmountForSpouse(value)
                            }
                            placeholder="Premium amount for Spouse"
                          />
                            // <Form.Control 
                            // type="text" 
                            // className="marginTopForPremiumFrequencyQuestion"
                            // defaultValue="" 
                            // value={this.state.premiumAmountForSpouse == null ? "" : this.state.premiumAmountForSpouse} 
                            // placeholder="Premium amount for Spouse" 
                            // onChange={(event)=>{this.functionForPremiumAmountForSpouse(event)}} 
                            // decimalScale="2" />
                          }
                          
                      </>
                    }
                  </>
              }

            </div>     
            <div className=" w-100 d-flex justify-content-end">
              <Button
                style={{ backgroundColor: "#76272b", border: "none" }}
                className="theme-btn"
                // onClick={this.handleLongTermPolicySubmit}
                onClick={this.handleFileUpload}
                disabled={this.state.disable == true ? true : false}
              >
                {isNotValidNullUndefile(this.state.userLongTermInsId) ? "Update" : "Save"}
              </Button>
            </div>
         
            <Row  style={{marginTop:"16px"}}>
              <Col xs={12} className="overflow-auto excelscroll financialInformationTable">
              {this.state.longtermcareinsuranecpolicyformdata.length > 0 && (
                <Table bordered className="m-0 p-0">
                  <tbody>
                    <tr>
                      <th>Type of Policy</th>
                      <th>Policy Start Date</th>
                      <th>Insurance Provider</th>
                      <th>Elimination Period</th>
                      <th>Max Life Benefits</th>
                      <th>Max Benefit Years</th>
                      <th>Premium Frequency</th>
                      <th>Premium Amount</th>
                      <th>Last Time Premium Increase</th>
                      <th>Policy No.</th>
                      <th></th>
                    </tr>

                      {this.state.longtermcareinsuranecpolicyformdata.map(
                        (det, index) => {
                          konsole.log("instypeinstype", det);
                          return (
                            <tr key={index}>

                              <td style={{wordBreak:"break-word"}}>
                                {/* {det.insType} */}
                                <OtherInfo
                                  othersCategoryId={34}
                                  othersMapNatureId={det?.userLongTermInsId}
                                  FieldName={det.insType}
                                  userId={this.state.userId}
                                />
                              </td>
                              <td className="text-center"> {det.policyStartDate == null ? "-" : $AHelper.getFormattedDate( det?.policyStartDate?.slice(0, 10))}</td>
                              <td  style={{wordBreak:"break-word"}}>
                                {/* {det.insCompany} */}
                                <OtherInfo
                                  othersCategoryId={12}
                                  othersMapNatureId={det?.userLongTermInsId}
                                  FieldName={det.insCompany}
                                  userId={this.state.userId}
                                />
                              </td>
                              <td className="text-center">{det?.eliminationPeriod || "-"}</td>
                              <td className="text-center">
                                {isNotValidNullUndefile( det.maxLifeBenefits) ? $AHelper.IncludeDollars(det?.maxLifeBenefits) : "-"}
                              </td>
                              <td className="text-center">{det?.maxBenefitYears || "-"}</td>

                              <td className="text-center" >{det?.premiumFrequency || "-"}</td>
                              <td className="text-center">  {isNotValidNullUndefile( det.premiumAmount) ? $AHelper.IncludeDollars(det?.premiumAmount) : "-"}</td>

                              <td className="text-center">
                                
                                {det.lastTimePremiumIncrease == null
                                  ? "-"
                                  : det.lastTimePremiumIncrease?.slice(0, 10)}
                              </td>
                              <td className="text-center">{det?.additionalDetails || "-"}</td>
                              <td style={{verticalAlign:"middle"}}>
                                {/* <div className="d-flex gap-2">
                                <p style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => this.updatelong(det)}>Edit</p>
                                <span className="cursor-pointer" onClick={() => this.deleteUserData(det, this.state.userId)}><img src="/icons/deleteIcon.svg" className="h-75 p-0 m-0" alt="g4" /></span>
                              </div> */}
                                <div className="d-flex justify-content-center gap-2">
                                            <div className=' d-flex flex-column align-items-center' onClick={() => this.updatelong(det)}>
                                                <img className="cursor-pointer mt-0" src="/icons/EditIcon.png" alt=" Mortgages" style={{ width: "20px"}}/>
                                                {/* <span className='fw-bold mt-1' style={{ color: "#720C20", cursor: "pointer"}}>Edit</span> */}
                                            </div>
                                            <div>
                                                <span  style={{borderLeft:"2px solid #e6e6e6", paddingLeft:"5px", height:"40px", marginTop:"5px"}} className="cursor-pointer mt-1" onClick={() => this.deleteUserData(det, this.state.userId)}>
                                                    <img src="/icons/deleteIcon.svg" className="mt-0" alt="g4" style={{ width: "20px" }}/>
                                                </span>
                                            </div>
                                        </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                  </tbody>
                </Table>
                )}
              </Col>
            </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(LongTermCareInsurancePolicyForm);
