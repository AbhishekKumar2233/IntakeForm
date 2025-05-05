import React, { Component } from "react";
import {  Button,  Modal,  Table,  Form,  Tab,  Row,  Col,  Container,  Nav,  Dropdown,  Collapse,  Breadcrumb,} from "react-bootstrap";
import Select from "react-select";
import { $CommonServiceFn } from "./network/Service";
import { $Service_Url } from "../components/network/UrlPath";
import { connect } from "react-redux";
import { GET_Auth_TOKEN, GET_USER_DETAILS, SET_LOADER, } from "../components/Store/Actions/action";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "react-phone-input-2/lib/bootstrap.css";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import { regexForSpecialCharacter } from "./control/Constant";
import { $AHelper } from "./control/AHelper";
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";

export class contact extends Component {
  static contextType = globalContext;
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      contactType: [],
      emailOptionsType: [],
      updateArrayValue: [],
      allContactDetails: [],
      emailContactTypeId: this.props.EditContactType == "" ? this.props.primaryEmailIdValidation != 1 ? "" : "1" : "",
      mobileContactTypeId: this.props.EditContactType == "" ? this.props.primaryContactIdValidation != 1 ? "" : "1" : "",
      userId: this.props.userId,
      loggedInUser: sessionStorage.getItem("loggedUserId") || "",
      mobileNoList: [],
      emailsList: [],
      mobileNo: "",
      emailId: "",
      activityTypeId: "4",
      countryCodes: [],
      countryCode: "1",
      allContactDetails: this.props.allContactDetails,
      mobileOthersName: "",
      emailOthersName: "",
      contactcellorlandlineno: 1,
      contactcelllandline: [],
      mobileCount: 0,
      emailCount: 0,
      numberLengthstate : 0,
      newcountryCode :"",
      removeClickEvent:false,
      userDetailOfPrimary:sessionStorage.getItem('userDetailOfPrimary'),
      disableCountryGuessState: true,
      contactTypeList: [],
      spouseUserId:sessionStorage.getItem('spouseUserId') || ''


    };
  }
  componentDidMount() {
    let newuserid = this.props.userId || "";
    this.setState({
      userId: newuserid,
    });
    this.fetchContacType();
    this.filterContactForUpdate();
    this.fetchNumberType();


  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userId !== this.props.userId) {
      this.setState({
        userId: this.props.userId,
      });
    }

  }

  filterContactForUpdate = () => {

    let EditContactType = this.props.EditContactType;
    let EditContactId = this.props.EditContactId;
    let mobileOther =
      this.props.EditContactId?.mobileOther == null
        ? ""
        : this.props.EditContactId?.mobileOther.othersName;
    let emailOther =
      this.props.EditContactId?.emailOther == null
        ? ""
        : this.props.EditContactId?.emailOther.othersName;
    let mobileOthersId =
      this.props.EditContactId?.mobileOther == null
        ? ""
        : this.props.EditContactId?.mobileOther.othersId;
    let emailOthersId =
      this.props.EditContactId?.emailOther == null
        ? ""
        : this.props.EditContactId?.emailOther.othersId;

        console.log("EditContactIdcommTypeId",this.props?.EditContactId?.commTypeId,this.state.contactcellorlandlineno)
    if (EditContactType == "mobile") {
      this.setState({
        mobileOthersName: mobileOther,
        mobileContactTypeId: EditContactId.contactTypeId,
        mobileNo: EditContactId.mobileNo,
        disableCountryGuessState: EditContactId.mobileNo.length ? false : true,
        mobileNatureId: EditContactId.contactId,
        mobileOthersId: mobileOthersId,
        contactcellorlandlineno: this.props?.EditContactId?.commTypeId ?? 1,
      });
    } else if (EditContactType == "email") {
      this.setState({
        emailContactTypeId: EditContactId.contactTypeId,
        emailId: EditContactId.emailId,
        emailNatureId: EditContactId.contactId,
        emailOthersName: emailOther,
        emailOthersId: emailOthersId,
      });
    }
  };

  fetchContacType = () => {
    let ediContacttype = this.props.EditContactType;
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getContactTypePath,
      "",
      (response) => {
      if (response) {

        this.setState({ contactTypeList: response?.data?.data })
        let contactTypeObj = [{ value: "null", label: "--select--", isDisabled: true }];
        let primaryUserId = sessionStorage.getItem("SessPrimaryUserId");
        let contactType = [];
        let emailOptionsType = [];
        // if (this.props.userId !== primaryUserId || (ediContacttype !== "" && this.props.userId == primaryUserId)) {
          contactType = response.data.data;
          emailOptionsType = response.data.data;
        // } else {
        //   contactType = response.data.data.filter((res) => res.value !== "1");
        // }
        contactType = [...contactTypeObj, ...contactType];
        emailOptionsType = [...contactType];

        this.setState({
          ...this.state,
          contactType: contactType,
          emailOptionsType: emailOptionsType,
        });
      }
    }
    );
  };

  fetchNumberType = () => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getNumberType,
      "",
      (response) => {
      if (response) {
        this.setState({
          ...this.state,
          contactcelllandline: response.data.data,
        });
      }
    }
    );
  };

  handleInputChange = (ev) => {
    ev.preventDefault();
    let attrname = ev.target.name;
    let attrvalue = ev.target.value;
    if (!regexForSpecialCharacter.test(attrvalue)) {
      this.setState({
        [attrname]: attrvalue,
      });
    }
  };

  emailValidate = (typeofSave) => {

    let mobileContactTypeId = this.state.mobileContactTypeId;
    let emailContactTypeId = this.state.emailContactTypeId;
    let mobileNo = this.state.mobileNo;
    let emailId = this.state.emailId;
    let allContactDetail = this.props.allContactDetails;
    let mobileInfo = allContactDetail ? allContactDetail.mobiles : "";
    let emailInfo = allContactDetail ? allContactDetail.emails : "";
    switch (typeofSave) {
      case "mobile":
        {
          if (mobileInfo?.length !== 0 && mobileNo !== "") {
            for (let loop = 0; loop < mobileInfo?.length; loop++) {
              if (mobileInfo[loop]?.mobileNo == mobileNo && mobileInfo[loop]?.contactTypeId != mobileContactTypeId) {
                this.toasterAlert("Duplicate number not allowed");
                this.setState({
                  mobileNo: this.state.newcountryCode
                });
                return;
              }
            }
          }
        }
        break;
      case "email":
        {
          if (emailInfo?.length !== 0 && emailId !== "") {
            for (let loop = 0; loop < emailInfo?.length; loop++) {
              if (emailInfo[loop].emailId == emailId && emailInfo[loop]?.contactTypeId != emailContactTypeId) {
                this.toasterAlert("Duplicate Email Id not allowed");
                this.setState({
                  emailId: ""
                });
                return;
              }
            }
          }
        }
        break;
    }

    let regexName = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    switch (typeofSave) {
      case "email":
        if (this.state.emailId !== "") {
          if (!regexName.test(emailId)) {
            this.setState({
              ...this.state,
              emailId: ""
            });
            this.toasterAlert("Enter the valid Email Id");
            break;
          }
          if (emailContactTypeId == "") {
            this.toasterAlert("Email type cannot be blank");
            return;
          }
        }
        break;
      case "mobile": {

        if (mobileNo !== undefined && mobileNo !== null && mobileNo !== "" && mobileNo.length < this.state?.numberLengthstate  ) {
          // konsole.log("dsdsdcxc23442343e",mobileNo,mobileNo.length,this.state?.numberLengthstate)
          this.setState({
            ...this.state,
            // mobileNo: "+1"
            mobileNo: this.state.newcountryCode
          });
          this.toasterAlert("Enter the valid Number");
          return;
        }
        break;
      }
    }
  };

  saveContactDetails = (typeofSave) => {

    let mobileContactTypeId = this.state.mobileContactTypeId;
    let emailContactTypeId = this.state.emailContactTypeId;
    let mobileNo = this.state.mobileNo;
    let emailId = this.state.emailId;
    let commTypeId = this.state.contactcellorlandlineno
    let mobileOther = null;
    let emailOther = null;
    let userDetailOfPrimarydata = JSON.parse(this.state.userDetailOfPrimary)
    let regexName = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    if (typeofSave == "email") {
      if(this.state.spouseUserId == this.props.userId && userDetailOfPrimarydata.primaryEmailId == emailId){
        this.toasterAlert(`You cannot use primary member's email please provide a different email`)
        return;
      }
      if (emailContactTypeId == "") {
        this.toasterAlert("Email type cannot be blank");
        return;
      }
      let emailTrue = this.state.emailsList.some((e)=>{return e.emailId == emailId})
      if(emailTrue){
        this.toasterAlert('Duplicate Email Id is not allowed')
        return;
      }
      if (regexName.test(emailId) && emailContactTypeId != 0 && emailId != "") {
        if (this.state.emailContactTypeId == "999999") {
          emailOther = {
            othersName: this.state?.emailOthersName,
            othersCategoryId: 6,
            isActive: true,
            createdBy: this.state.loggedInUser,
          };
        }

        this.setState({
          ...this.state,
          emailsList: [
            ...this.state.emailsList,
            {
              contactTypeId: emailContactTypeId,
              emailId: emailId,
              createdBy: this.state.loggedInUser,
              emailOther: emailOther,
            },
          ],
          emailContactTypeId: "",
          emailId: "",
          emailOthersName: "",
        });

        let mobiletypevlaueoptions2 = this.state.emailContactTypeId !== "" ? this.state.emailOptionsType.filter((item) => item.value === this.state.emailContactTypeId) : "";


        if (this.state.emailOptionsType.length > 0) {
          let emailDataOne = this.getDifferenceEmailPlusButton(mobiletypevlaueoptions2, this.state.emailOptionsType);
          this.setState({
            emailOptionsType: emailDataOne,
            emailCount: this.state.emailCount + 1
          })
          // this.state.emailCount = this.state.emailCount + 1
        }
      } else {
        this.setState({
          ...this.state,
          emailId: "",
        });
        this.toasterAlert("Enter the valid Email Id");
      }
    }
    else if (typeofSave == "mobile") {
      if (this.state.contactcellorlandlineno == "") {
        this.toasterAlert("Enter the valid Email Id");
        return;
      }
      if (mobileContactTypeId == "") {
        this.toasterAlert("Mobile type cannot be blank");
        return;
      }
      konsole.log(this.state.mobileNoList,mobileNo,"mobileNoList")
      let mobileTrue = this.state.mobileNoList.some((e)=> {return e.mobileNo == mobileNo})
      if(mobileTrue){
        // this.toasterAlert('Contact number cannot be same.');
        this.toasterAlert('Duplicate number not allowed')
        return;
      }
      if (this.state.mobileNo.length !== 0 && this.state.mobileNo.length !== this.state.newcountryCode.length) {
        // if (this.state.mobileNo.length !== 0 && this.state.mobileNo.length !== 2  && this.state.mobileNo.length!== this.state.newcountryCode.length+1) {
        if (this.state.mobileContactTypeId == "999999") {

          mobileOther = {
            othersName: this.state?.mobileOthersName,
            othersCategoryId: 6,
            isActive: true,
            createdBy: this.state.loggedInUser,
          };
        }

        this.setState({
          mobileNoList: [
            ...this.state.mobileNoList,
            {
              commTypeId: commTypeId,
              contactTypeId: mobileContactTypeId,
              mobileNo: mobileNo,
              createdBy: this.state.loggedInUser,
              mobileOther: mobileOther,
            },
          ],
          // mobileNo: "+1",
          mobileNo:this.state.newcountryCode,
          mobileContactTypeId: "",
          mobileOthersName: "",
        });


        let mobiletypevlaueoptions1 = this.state.mobileContactTypeId !== "" ? this.state.contactType.filter((item) => item.value === this.state.mobileContactTypeId) : "";


        if (this.state.contactType.length > 0) {
          let contactDataButton = this.getDifferenceContactPluseButton(mobiletypevlaueoptions1, this.state.contactType);
          this.setState({
            contactType: contactDataButton,
            mobileCount: this.state.mobileCount + 1
          })
        }


      }
      
      else {
    
        this.toasterAlert("Please enter mobile number");
        this.setState({
          ...this.state,
          // mobileNo: "+1",
          mobileNo:this.state.newcountryCode
        });

      }
    }
  };
  contactValidaton =()=>{

  }
  handleContactSubmit = () => {

    konsole.log("dsdsddsd",this.state.mobileCount ,"---", this.state.emailContactTypeId,"--", this.state.emailId)
    let countryCodelength = this.state?.newcountryCode.length;
    let mobilelength = this.state.mobileNo.length-countryCodelength
    // konsole.log("mobileContactTypeId",this.state.mobileContactTypeId,"emailContactTypeId",this.state.emailContactTypeId,"mobilelength",mobilelength,"countryCodelength",countryCodelength,"mobileNo.LENGTH",this.state.mobileNo)
    let userDetailOfPrimarydata = JSON.parse(this.state.userDetailOfPrimary)

      if(this.state.spouseUserId == this.props.userId && userDetailOfPrimarydata.primaryEmailId == this.state.emailId){
      this.toasterAlert(`You cannot use primary member's email please provide a different email`)
      return;
    }
    if (this.state.mobileCount > 0 && (this.state.emailContactTypeId != "" && this.state.emailContactTypeId != "1") && this.state.emailId == "" && mobilelength == countryCodelength) {
      
      // konsole.log("alertconsole",this.state.mobileCount,this.state.emailContactTypeId,this.state.emailId,mobilelength,countryCodelength )
      this.toasterAlert("Please enter the Email Id ");
      return;
    }
    if(this.state.mobileContactTypeId == "1" && this.state.emailContactTypeId == "1" && mobilelength == countryCodelength && this.state.emailId == "")
    {
      this.toasterAlert("Please enter Mobile Number  ");
      return;
    }
    if(this.state.mobileContactTypeId == "1" && this.state.emailContactTypeId !== "" && mobilelength == countryCodelength && this.state.emailId == "")
    {
      this.toasterAlert("Please enter the Email Id  ");
      return;
    }
    else if (this.state.mobileCount > 0 && this.state.emailContactTypeId == "" && this.state.emailId != "") {
      this.toasterAlert("Please select the Email Type");
      return;
    }
    else if (this.state.emailCount > 0 && mobilelength == countryCodelength && this.state.mobileContactTypeId != "" && this.state.mobileContactTypeId != "1") {
      this.toasterAlert("Please enter the Mobile Number");
      return;
    }
    else if (this.state.emailCount > 0 && this.state.mobileNo.length > this.state?.numberLengthstate || this.state.mobileNo.length < this.state?.numberLengthstate && this.state.mobileContactTypeId != "") {
      // konsole.log("sdfsdefdc",this.state.emailCount,"---",this.state.mobileNo.length,"---",this.state?.numberLengthstate,"-----",this.state.mobileContactTypeId)
      this.toasterAlert("Enter the valid Number");
      return;
    }

    else if (this.state.emailCount > 0 && mobilelength != countryCodelength && this.state.mobileContactTypeId == "" && this.state.mobileNo !==this.state.newcountryCode) {
      this.toasterAlert("Please select the Mobile Type");
      return
    }

    else if (this.state.mobileCount > 0 && this.state.emailContactTypeId!="" && this.state.emailContactTypeId!="1" && this.state.emailId == "") {
      this.toasterAlert("Please enter the Email Id");
      return
    }
    else if (mobilelength != countryCodelength && this.state.mobileContactTypeId == "" && this.state.mobileNo !==this.state.newcountryCode) {
      this.toasterAlert("Please select the Mobile Type");
      return
    }

    else if ((this.state.emailCount > 0 && mobilelength != countryCodelength && this.state.mobileContactTypeId != "")) {
      this.toasterAlert("Please click on contact plus button");
      return
    }
    else if ((this.state.mobileCount > 0 && mobilelength != countryCodelength && this.state.mobileContactTypeId != "")) {
      this.toasterAlert("Please click on contact plus button");
      return
    }
    else if (this.state.mobileCount > 0 && this.state.emailContactTypeId != "" && this.state.emailId != "") {
      this.toasterAlert("Please click on email plus button");
      return
    }
    else if (this.state.emailCount > 0 && this.state.emailContactTypeId != "" && this.state.emailId != "") {
      this.toasterAlert("Please click on email plus button");
      return
    }
    else if(this.state.emailId!=="" && this.state.emailContactTypeId == "")
    {
      this.toasterAlert("Please select email type");
      // }

      // else if(this.state.mobileContactTypeId != "" && mobilelength == -1){
      //   this.toasterAlert("Please enter the Mobile Number")
    }else if(this.state.mobileContactTypeId !== "" && this.state.mobileContactTypeId !== "1" && mobilelength == countryCodelength){
      this.toasterAlert("Please Enter the valid Number");
    }
    // else if(this.state.emailCount == 0 && ((this.state.emailContactTypeId == "" || this.state.emailContactTypeId == "null") && this.state.mobileContactTypeId == "")){
    //   this.toasterAlert("Please select the Email Type2")
    //   return;
    // }
    else if(this.state.mobileCount == 0 && mobilelength > 0 && countryCodelength != 0 && (this.state.emailContactTypeId == "" && (this.state.mobileContactTypeId == "" || this.state.mobileContactTypeId == "null"))){
      // konsole.log("type2sdd",this.state.mobileCount,mobilelength,countryCodelength,this.state.emailContactTypeId)
      this.toasterAlert("Please select the Mobile Type");
      return;
    }
    else {
      let contactId = this.props.EditContactId? this.props.EditContactId.contactId: "";
      let EditContactType = this.props.EditContactType;
      let emailsListObj = [];
      let mobileNoObj = [];
      let PostData = {};
      let mobileOther = null;
      let emailOther = null;
      if (this.state.mobileContactTypeId == "999999" && this.props.EditContactType == "") {
        mobileOther = {
          othersName: this.state?.mobileOthersName,
          othersCategoryId: 6,
          isActive: true,
          createdBy: this.state.loggedInUser,
        };
      }
      else if (this.state.mobileContactTypeId == "999999" && this.props.EditContactType !== "") {
        mobileOther = {
          othersName: this.state?.mobileOthersName,
          othersCategoryId: 6,
          isActive: true,
          updatedBy: this.state.loggedInUser,
          othersId: this.state?.mobileOthersId ? this.state?.mobileOthersId : 0,
        };
      }
      if(this.props.EditContactId.contactTypeId==999999  && this.state.mobileContactTypeId!=999999 && this.props.EditContactType=="mobile")
      {
        mobileOther = {
          othersName:" ",
          othersCategoryId: 6,
          isActive: false,
          updatedBy: this.state.loggedInUser,
          othersId: this.state?.mobileOthersId ? this.state?.mobileOthersId : 0,
        };
      }
      if(this.props.EditContactId.contactTypeId==999999  && this.state.emailContactTypeId!=999999 && this.props.EditContactType=="email")
      {
        emailOther = {
          othersName: " ",
          othersCategoryId: 6,
          isActive: false,
          updatedBy: this.state.userId,
          othersId: this.state?.emailOthersId ? this.state?.emailOthersId : 0,
        };
      }
      if (this.state.emailContactTypeId == "999999" && this.props.EditContactType == "") {
        emailOther = {
          othersName: this.state?.emailOthersName,
          othersCategoryId: 6,
          isActive: true,
          createdBy: this.state.loggedInUser,
        };
      } else if (this.state.emailContactTypeId == "999999" && this.props.EditContactType !== ""
      ) {
        emailOther = {
          othersName: this.state?.emailOthersName,
          othersCategoryId: 6,
          isActive: true,
          updatedBy: this.state.userId,
          othersId: this.state?.emailOthersId ? this.state?.emailOthersId : 0,
        };
      }

      if (this.state.emailsList?.length == 0 && this.state.mobileNoList?.length == 0) {

        if (mobilelength != countryCodelength && this.state.mobileContactTypeId !== "" && this.state.mobileNo !== ""  && this.state.emailId !== "" && this.state.emailContactTypeId !== "") {
          mobileNoObj = [
            {
              contactTypeId: this.state.mobileContactTypeId,
              mobileNo: this.state.mobileNo,
              createdBy: this.state.loggedInUser,
              mobileOther: mobileOther,
              commTypeId: this.state.contactcellorlandlineno,
            },
          ];

          emailsListObj = [
            {
              contactTypeId: this.state.emailContactTypeId,
              emailId: this.state.emailId,
              createdBy: this.state.loggedInUser,
              emailOther: emailOther,
            },
          ];
        }
        else if(mobilelength == countryCodelength && this.state.mobileContactTypeId == "1" && this.state.mobileNo == ""  && this.state.emailContactTypeId == "1"   )
        {
          emailsListObj = [
            {
              contactTypeId: this.state.emailContactTypeId,
              emailId: this.state.emailId,
              createdBy: this.state.loggedInUser,
              emailOther: emailOther,
            },
          ];
        }
        else if(mobilelength == countryCodelength && this.state.mobileContactTypeId == "1" && this.state.mobileNo == ""  && this.state.emailContactTypeId !== "1"   )
        {
          emailsListObj = [
            {
              contactTypeId: this.state.emailContactTypeId,
              emailId: this.state.emailId,
              createdBy: this.state.loggedInUser,
              emailOther: emailOther,
            },
          ];
        }

        // Email in input box 
       else if (mobilelength == countryCodelength && this.state.mobileContactTypeId == "" && this.state.mobileNo == ""  && this.state.emailId !== "" && this.state.emailContactTypeId !== "" ) {
          emailsListObj = [
            {
              contactTypeId: this.state.emailContactTypeId,
              updatedBy: this.state.loggedInUser,
              emailId: this.state.emailId,
              createdBy: this.state.loggedInUser,
              emailOther: emailOther,
            },
          ];
        }
        // else if (mobilelength !== countryCodelength && this.state.mobileContactTypeId == "" && this.state.mobileNo == ""  && this.state.emailId == "" && this.state.emailContactTypeId == "") {

        //   emailsListObj = [
        //     {
        //       contactTypeId: this.state.emailContactTypeId,
        //       emailId: this.state.emailId,
        //       createdBy: this.state.loggedInUser,
        //       emailOther: emailOther,
        //     },
        //   ];
        // }

        else if (this.state.mobileNo !== "" && this.state.mobileContactTypeId !== "" && this.state.emailId == "" && (this.state.emailContactTypeId == "" || (this.state.emailContactTypeId == "1" && this.state.emailId == ""))) {

          if (this.state.mobileContactTypeId !== null && this.props.EditContactType !== "") {


            mobileNoObj = [
              {
                contactTypeId: this.state.mobileContactTypeId,
                mobileNo: this.state.mobileNo,
                updatedBy: this.state.loggedInUser,
                mobileOther: mobileOther,
                commTypeId: this.state.contactcellorlandlineno,
              },
            ];
          } else {

            mobileNoObj = [
              {
                contactTypeId: this.state.mobileContactTypeId,
                mobileNo: this.state.mobileNo,
                createdBy: this.state.loggedInUser,
                mobileOther: mobileOther,
                commTypeId: this.state.contactcellorlandlineno,
              },
            ];
          }
        }else if (this.state.emailId !== "" && this.state.emailContactTypeId !== "" && mobilelength != countryCodelength && (this.state.mobileContactTypeId == ""  || (this.state.mobileContactTypeId == "1"))) {

          if (this.state.emailContactTypeId !== null && this.props.EditContactType !== "") {

            emailsListObj = [
              {
                contactTypeId: this.state.emailContactTypeId,
                emailId: this.state.emailId,
                updatedBy: this.state.loggedInUser,
                emailOther: emailOther,
              },
            ];
          } else {

            emailsListObj = [
              {
                contactTypeId: this.state.emailContactTypeId,
                emailId: this.state.emailId,
                createdBy: this.state.loggedInUser,
                emailOther: emailOther,
              },
            ];
          }
        } else if (mobilelength == countryCodelength && this.state.mobileContactTypeId !== "" && this.state.mobileContactTypeId !== "1" ) {
          this.toasterAlert("Enter the Mobile Number");
          return;
        } else if (this.state.mobileNo !== "" && this.state.mobileContactTypeId == "") {
          this.toasterAlert("Choose Mobile type");
          return;
        } else if (this.state.emailId == "" && this.state.emailContactTypeId != "") {
          this.toasterAlert("Enter the Email Id");
          return;
        } else if (this.state.emailId !== "" && this.state.emailContactTypeId == ""
        ) {
          this.toasterAlert("Choose Email Type");
          return;
        } else if (this.state.mobileNo !== "" && this.state.mobileContactTypeId !== "" && this.state.contactcellorlandlineno == "") {
          this.toasterAlert("Number Contact type cannot be black");
          return;
          
        }
        else if (
          mobilelength == countryCodelength &&
          this.state.mobileContactTypeId == "" &&
          this.state.emailId == "" &&
          this.state.emailContactTypeId == ""
        ) {
          this.toasterAlert("Please enter the Contact Detail");
          return;
        } else if (
          this.state.emailId !== "" &&
          this.state.emailContactTypeId == ""
        ) {
          this.toasterAlert("Choose Email Type");
          return;
        }
      }

      if (
        this.state.emailsList?.length !== 0 &&
        this.state.mobileNoList?.length !== 0
      ) {
        emailsListObj = this.state.emailsList;
        mobileNoObj = this.state.mobileNoList;
      } else if (
        this.state.emailsList?.length !== 0 &&
        this.state.mobileNoList?.length == 0
      ) {
        emailsListObj = this.state.emailsList;
      } else if (
        this.state.emailsList?.length == 0 &&
        this.state.mobileNoList?.length !== 0
      ) {
        mobileNoObj = this.state.mobileNoList;
      } else if (
        this.state.emailsList?.length == 0 &&
        this.state.mobileNoList?.length !== 0
      ) 
      {
        mobileNoObj = this.state.mobileNoList;
      }

      let method = EditContactType == "email" || EditContactType == "mobile" ? "PUT" : EditContactType == "" ? "POST"  : "";

      let Url =
        EditContactType == "email" || EditContactType == "mobile"
          ? $Service_Url.updateContactWithOtherDetailsPath
          : EditContactType == ""
            ? $Service_Url.postAddContactWithOther
            : "";

      EditContactType == "email"
        ? (emailsListObj[0].contactId = contactId)
        : EditContactType == "mobile"
          ? (mobileNoObj[0].contactId = contactId)
          : "";
      PostData = {
        userId: this.state.userId,
        activityTypeId: this.state.activityTypeId,
        contact: {
          mobiles: mobileNoObj,
          emails: emailsListObj,
        },
      };
      this.setState({removeClickEvent:true})
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi(method, Url, PostData, (response) => {
        if (response) {
          this.props.dispatchloader(false);
          AlertToaster.success(`Contact ${(EditContactType == "email" || EditContactType == "mobile") ? "updated" : "saved"} successfully`);
          konsole.log("Success res", response);
          this.handleClose();
        } else {
          this.toasterAlert(Msg.ErrorMsg);
        }
        this.props.fetchprntSavedContactDetails(this.state.userId);
      });

    }


  };

  handleMobileNo = (value,country) => {
    const mobileNumberLength = country?.format.split('.');
    // const mobileNumberLength = country;
    const countryCode = country?.dialCode;
    this.setState({
      disableCountryGuessState: true,
      newcountryCode : countryCode
    })

    // const countryCode = country?.dialCode;
    // const mobileNumberLength = country?.format.replace(/[\s()+-]/g, '');

    // const mobileNumberWithoutCode = mobileNumberLength?.replace('+' + countryCode, '');

    // Get the length of the resulting string
    // const length = mobileNumberWithoutCode?.length;

    let numberLength = mobileNumberLength.length

    if (value) {
          if(country?.name=="Kenya") {
        this.setState({
          mobileNo: `+${value}`,
                numberLengthstate : 13
        });
      }
            else
            {
        this.setState({
          mobileNo: `+${value}`,
                numberLengthstate : Math.min(numberLength,15)
        });
      }
    }
  };

  handleClose = () => {
    this.props.handleshowContact();
  };

  toasterAlert(test) {
    konsole.log(
      this.context.setdata({
        open: true,
        text: test,
        type: "Warning",
      }),
      this.context,
      test,
      "thiscontext"
    );
  }

  getDifferenceContactPluseButton = (arrayOne, arrayTwo) => {


    return arrayTwo?.filter((object1) => {
      if (object1.value == "999999") return true
      return !arrayOne?.some((object2) => {

        return object1?.value == object2?.value;
      })
    })

  }

  getDifferenceContact = (array1, array2) => {

    return array2?.filter((object1) => {
      if (object1.value == "999999") return true
      if(object1.value == this.props.EditContactId?.contactTypeId) return true; // added current selected contact type
      return !array1?.some((object2) => {
        return object1?.value == object2?.contactTypeId;
      });
    });
  };



  getDifferenceEmailPlusButton = (arrayEmail, arrayEmail2) => {
    return arrayEmail2?.filter((object1) => {
      if (object1.value == "999999") return true
      return !arrayEmail?.some((object2) => {
        return object1?.value == object2?.value;
      });
    });
  };


  getDifferenceEmail = (array1, array2) => {

    return array2?.filter((object1) => {
      if (object1.value == "999999") return true
      if(object1.value == this.props.EditContactId?.contactTypeId) return true; // added current selected contact type
      return !array1?.some((object2) => {
        return object1?.value == object2?.contactTypeId;
      });
    });
  };

  render() {

    console.log("this.state.contactcellorlandlineno",this.state.contactcellorlandlineno)
    konsole.log("fhdsghjagsfasgfjhagsfhjgsa", this.state.mobileContactTypeId);

    if (this.state.contactType?.length > 0) {
      let contactData = this.getDifferenceContact(this.props.allContactDetails.mobiles, this.state.contactType);
    
      this.state.contactType = contactData;
      konsole.log("dabvkjbk", this.state.contactType);
    }

    if (this.state.emailOptionsType.length > 0) {
      let emailData = this.getDifferenceEmail(
        this.props.allContactDetails.emails,
        this.state.emailOptionsType
      );
      
      this.state.emailOptionsType = emailData;
    }

    let primaryUserId = sessionStorage.getItem("SessPrimaryUserId");
    let mobileContactType = [];
    let emailContactType = [];

    if (this.state.mobileContactTypeId !== "null" || this.state.emailContactTypeId !== "null") {
      if (this.props.userId !== primaryUserId || (this.props.EditContactType !== "" && this.props.userId == primaryUserId)) {
        if (this.state.mobileContactTypeId.toString() !== "999999") {
          
          mobileContactType = this.state.mobileContactTypeId !== "" ? this.state.contactType.filter((item) => item.value === this.state.mobileContactTypeId) : "";
        } else {
        

          mobileContactType = this.state.mobileContactTypeId !== "" ? this.state.contactType[this.state.contactType?.length] : "";
        }
        if (this.state.emailContactTypeId.toString() !== "999999") {
          emailContactType =
            this.state.emailContactTypeId !== ""
              ? this.state.emailOptionsType.filter(
                (item) => item.value === this.state.emailContactTypeId
              )
              : "";
          // ? this.state.contactType[this.state.emailContactTypeId]  : "";
        } else {
          emailContactType =
            this.state.emailContactTypeId !== ""
              ? this.state.contactType[this.state.contactType?.length]
              : "";
        }
      } else {
        if (this.state.mobileContactTypeId.toString() !== "999999") {
          // alert("11")

          mobileContactType =
            this.state.mobileContactTypeId !== ""
              ? this.state.contactType.filter(item => item.value === this.state.mobileContactTypeId)
            // this.state.contactType[this.state.mobileContactTypeId - 1]
            : "";
          // this.state.contactType.filter(item => item.value === this.state.mobileContactTypeId) : ""
        } else {
          mobileContactType =
            this.state.mobileContactTypeId !== ""
              ? this.state.contactType[this.state.contactType?.length - 1]
              : "";
        }
        if (this.state.emailContactTypeId.toString() !== "999999") {
          emailContactType =
            this.state.emailContactTypeId !== ""
              ? this.state.emailOptionsType.filter(
                (item) => item.value === this.state.emailContactTypeId
              )
            // this.state.contactType[this.state.emailContactTypeId - 1]
            : "";
        } else {
          emailContactType =
            this.state.emailContactTypeId !== ""
              ? this.state.contactType[this.state.contactType?.length - 1]
              : "";
        }
      }
    }

    let mobiletypevlaueoptions = this.state.contactType;

    //   if(this.state.contactcellorlandlineno =="2"){
    //     mobiletypevlaueoptions=mobiletypevlaueoptions.filter((items)=>items.value !=="1")
    //   }
    //  let selectedcedlandnumber=this.state.contactcelllandline.filter((e)=>e.value==this.state.contactcellorlandlineno)

    // const countries = this?.PhoneInput?.getCountries().sort((a, b) => b.name.localeCompare(a.name));
    konsole.log("numberLengthstate",this.state?.numberLengthstate,this.state.mobileNo.length,this.state.newcountryCode)
    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0;
          }
        `}</style>
        {/* <a onClick={this.handleShow}>
            <img className="ms-3" src="/icons/add-icon.svg" alt="Contact" />
          </a> */}
        <Modal
          show={this.props.showContact}
          size="md"
          centered
          onHide={this.handleClose}
          animation="false"
          backdrop="static"
          enforceFocus={false}
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>{this.props.title ? this.props.title :'Contact Information'} 
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
          //  className="py-2"
          >
            <div>
              {this.props.EditContactType == "" && (
                <>
                  <Row className="m-0 mb-3">
                    {/* <Col xs md="6" className="d-flex align-items-center ps-0 bg ">
                      <Select  placeholder="Cell Phone Type" className="w-100 custom-select"  onChange={(event) => this.setState({ contactcellorlandlineno: event.value })}  options={this.state.contactcelllandline} value={selectedcedlandnumber}  />
                      </Col> */}
                    <div clasName=" me-4 mt-4" style={{ display: "flex" }}>
                      {this.state.contactcelllandline &&
                        this.state.contactcelllandline?.map((items) => {

                          return (
                            <>
                              <Form.Check
                                inline
                                className="left-radio fs-6"
                                type="radio"
                                name="cremated1"
                                label={items?.label}
                                value={items?.value}
                                onChange={(event) =>
                                  this.setState({
                                    contactcellorlandlineno: event.target.value,
                                  })
                                }
                                defaultChecked={
                                  this.state.contactcellorlandlineno ==
                                  items.value
                                }
                              />
                            </>
                          );
                        })}
                    </div>
                  </Row>

                  <Row className="m-0 mb-0 align-items-center mt-4">
                    {/* <h5>Cell Number</h5> */}
                    <Col
                      xs="4"
                      md="4"
                      className="d-flex align-items-center ps-0 bg"
                    // style={{border:"2px solid red"}}
                    >
                      <Select
                        onChange={(event) =>
                          {this.setState({ mobileContactTypeId: event.value })}
                        }
                        placeholder="Type"
                        className="w-100 custom-select "
                        options={mobiletypevlaueoptions}
                        // hideSelectedOptions={this.state.contactType[this.state.mobileContactTypeId - 1]}
                        value={mobileContactType}
                      >
                      </Select>
                    </Col>
                    <Col
                      xs="6"
                      md="7" className="d-flex align-items-center ps-0">
                      <PhoneInput
                        className="react-tel-input phoneinputpersonalinfo"
                        regions={[
                          "america",
                          "europe",
                          "asia",
                          "oceania",
                          "africa",
                        ]}
                        country="us"
                        preferredCountries={["us"]}
                        displayInitialValueAsLocalNumber={true}
                        // allCountries={countries}
                        value={this.state.mobileNo || "+1"}
                        onChange={(value,country) => this.handleMobileNo(value,country)}
                        specialOptionLabel={"Other"}
                        placeholder=""
                        name="mobileNo"
                        onBlur={() => this.emailValidate("mobile")}
                        // disableCountryGuess
                        countryCodeEditable={false}
                        disableCountryGuess={this.state.disableCountryGuessState}
                      />
                    </Col>
                    {this.props.EditContactType == "" && (
                      <Col xs="2" md="1" className="p-0">
                        <img
                          style={{ cursor: "pointer", marginBottom: "5px" }}
                          onClick={() => this.saveContactDetails("mobile")}
                          src="/icons/add-icon.svg"
                          className=""

                        />
                      </Col>
                    )}
                  </Row>
                </>
              )}
              {this.props.EditContactType == "mobile" && (
                <>
                  <Row className="m-0 mb-3">
                    {/* <Col xs md="4" className="d-flex align-items-center ps-0 bg ">
                      <Select  placeholder="Number" className="w-100 custom-select"  onChange={(event) => this.setState({ contactcellorlandlineno: event.value })}  options={this.state.contactcelllandline} value={selectedcedlandnumber}  />
                      </Col> */}

                    <div clasName=" me-4 mt-4" style={{ display: "flex" }}>
                      {this.state.contactcelllandline &&
                        this.state.contactcelllandline?.map((items) => {

                          return (
                            <>
                              <Form.Check
                                inline
                                className="left-radio fs-6 "
                                type="radio"
                                // id={response.responseId}
                                name="cremated1"
                                label={items?.label}
                                value={items?.value}
                                onChange={(event) =>
                                  this.setState({
                                    contactcellorlandlineno: event.target.value,
                                    emailContactTypeId: "",
                                  })
                                }
                                defaultChecked={ this.state.contactcellorlandlineno == items.value }
                              />
                            </>
                          );
                        })}
                    </div>
                  </Row>
                  <Row className="m-0 mb-0 align-items-center">
                    {/* <h5 className="my-3">Cell Number</h5> */}
                    <Col xs md="5" className="d-flex align-items-center ps-0">
                      <Select
                        onChange={(event) =>
                          {
                          this.setState({
                            mobileContactTypeId: event.value,
                            emailContactTypeId: "",
                          })}
                        }
                        placeholder="Type"
                        isDisabled={((this.props?.EditContactId?.contactTypeId==1)&&(this.props?.userId == primaryUserId))?true:false}
                        className="w-100 custom-select"
                        options={mobiletypevlaueoptions}
                        // hideSelectedOptions={this.state.contactType[this.state.mobileContactTypeId - 1]}
                        value={
                          mobileContactType == "" || null || undefined
                            ? {
                              value: `${this.props.EditContactId.contactTypeId}`,
                              label: `${this.props.EditContactId.contactType}`,
                            }
                            : mobileContactType
                        }
                      />
                    </Col>
                    <Col xs md="6" className="d-flex align-items-center ps-0">
                      {/* <PhoneInput className='form-control border p-0 ps-2' defaultCountry='US' value={this.state.mobileNo} onChange={(value) => this.handleMobileNo(value)} name="mobileNo" onBlur={() => this.emailValidate("mobile")} length={(value) => !isValidPhoneNumber(value)}/> */}

                      <PhoneInput
                        className="react-tel-input"
                        regions={[
                          "america",
                          "europe",
                          "asia",
                          "oceania",
                          "africa",
                        ]}
                        country="us"
                        preferredCountries={["us"]}
                        displayInitialValueAsLocalNumber={true}
                        value={this.state.mobileNo || "+1"}
                        onChange={(value,country) => this.handleMobileNo(value,country)}
                        specialOptionLabel={"Other"}
                        placeholder=""
                        name="mobileNo"
                        onBlur={() => this.emailValidate("mobile")}
                        disableCountryGuess={this.state.disableCountryGuessState}
                        countryCodeEditable={false}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {this.state.mobileContactTypeId == "999999" && (
                <Row className="mt-3">
                  <Col xs md="4" >
                    <Form.Control
                      type="text"
                      onChange={(event) =>
                        this.setState({ mobileOthersName: event.target.value?.charAt(0)?.toUpperCase() + event.target.value?.slice(1) })
                      }
                      value={this.state?.mobileOthersName}
                      placeholder=" Other Description"
                    />
                  </Col>
                </Row>
              )}

              <Row className="m-0 mb-0">
                {(this.props.EditContactType == undefined || this.props.EditContactType == null || this.props.EditContactType == "") &&
                  <>
                    {this.props.allContactDetails?.mobiles?.length > 0 && this.props.allContactDetails?.mobiles?.filter(item => item?.contactTypeId === 1 || item?.contactTypeId === 2)?.map((val, id) => {
                      // konsole.log("val?.mobileNo",val?.mobileNo,val?.mobileNo.slice(0, 3),val?.mobileNo.slice(0, 4))
                      return (
                        <>
                          <Col xs md="6" className="d-flex align-items-center  ps-0">
                            <p className="me-2 d-flex align-items-center">
                              <img className="me-1" src="/icons/mail.png" alt="mail" />
                              {$AHelper.newPhoneNumberFormat(val?.mobileNo)}
                               {/* {$AHelper.pincodeFormatInContact(val?.mobileNo) +" "+ $AHelper.formatPhoneNumber((val?.mobileNo?.slice(0, 4) == "+254") ? val?.mobileNo : val?.mobileNo?.slice(-10))} */}
                            </p>
                          </Col>
                        </>
                      );
                    })}
                  </>
                }

                {this.state.mobileNoList &&
                  this.state.mobileNoList?.map((val, id) => {
                    const contectTypeLabel = this.state?.contactTypeList?.find((item) => item?.value == val?.contactTypeId)?.label

                    return (
                      <>
                        <Col xs md="6" className="d-flex align-items-center  ps-0">
                          <p className="me-2 d-flex align-items-center">
                            <img className="me-1" src="/icons/mail.png" alt="mail" />
                            {/* {contectTypeLabel}: {$AHelper.pincodeFormatInContact(val?.mobileNo) +" "+ $AHelper.formatPhoneNumber((val?.mobileNo?.slice(0, 4) == "+254") ? val?.mobileNo : val?.mobileNo?.slice(-10))} */}
                            {contectTypeLabel}: {$AHelper.newPhoneNumberFormat(val?.mobileNo)}
                            {/* {$AHelper.pincodeFormatInContact(val?.mobileNo) +" "+ $AHelper.formatPhoneNumber((val?.mobileNo?.slice(0, 4) == "+254") ? val?.mobileNo : val?.mobileNo?.slice(-10))} */}
                          </p>
                        </Col>
                      </>
                    );
                  })}

              </Row>
            </div>

            <div>
              {this.props.EditContactType == "" && (
                <Row className="m-0 mb-0 align-items-center">
                  <h5 className="my-3">Email</h5>
                  <Col xs="4" md="4" className="d-flex align-items-center ps-0">
                    <Select
                      onChange={(event) =>
                        this.setState({ emailContactTypeId: event.value })
                      }
                      className="w-100 custom-select"
                      options={this.state.emailOptionsType}
                      placeholder="Type"
                      value={emailContactType}
                    />
                  </Col>
                  <Col xs="6" md="7" className="d-flex align-items-center ps-0">
                    <Form.Control
                      value={this.state.emailId}
                      onChange={(e) => this.handleInputChange(e)}
                      name="emailId"
                      type="email"
                      onBlur={() => this.emailValidate("email")}
                    />
                  </Col>

                  {this.props.EditContactType == "" && (
                    <Col xs="2" md="1" className="p-0">
                      <img
                        onClick={() => this.saveContactDetails("email")}
                        style={{ cursor: "pointer", marginBottom: "5px" }}
                        src="/icons/add-icon.svg"
                      />
                    </Col>
                  )}
                </Row>
              )}
              {this.props.EditContactType == "email" && (
                <Row className="m-0 mb-0">
                  <h5 className="my-3">Email</h5>
                  <Col xs md="4" className="d-flex align-items-center ps-0">
                    <Select
                      onChange={(event) =>
                        this.setState({
                          emailContactTypeId: event.value,
                          mobileContactTypeId: "",
                        })
                      }
                      className="w-100 custom-select"
                      options={this.state.emailOptionsType}
                      placeholder="Type"
                      // value={emailContactType}
                      value={
                        emailContactType == ""
                          ? {
                            value: `${this.props.EditContactId.contactTypeId}`,
                            label: `${this.props.EditContactId.contactType}`,
                          }
                          : emailContactType
                      }
                    />
                  </Col>
                  <Col xs md="6" className="d-flex align-items-center ps-0">
                    <Form.Control
                      value={this.state.emailId}
                      onChange={(e) => this.handleInputChange(e)}
                      name="emailId"
                      type="email"
                      onBlur={() => this.emailValidate("email")}
                    />
                  </Col>
                </Row>
              )}
              {this.state.emailContactTypeId == "999999" && (
                <Row className="mt-3">
                  <Col xs md="4">
                    <Form.Control
                      type="text"
                      onChange={(event) =>
                        this.setState({ emailOthersName: event.target.value?.charAt(0)?.toUpperCase() + event.target.value?.slice(1) })
                      }
                      value={this.state?.emailOthersName}
                      placeholder=" Other Description"
                    />
                  </Col>
                </Row>
              )}
              <Row className="m-0 mb-0">
                {this.state.emailsList &&
                  this.state.emailsList?.map((val, id) => {
                    return (
                      <>
                        <Col
                          xs
                          md="6"
                          className="d-flex align-items-center  ps-0"
                        >
                          <p className="me-2 d-flex align-items-center">
                            <img
                              className="me-1"
                              src="/icons/mail.png"
                              alt="mail"
                            />
                            {val.emailId}
                          </p>
                        </Col>
                      </>
                    );
                  })}
              </Row>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 mt-0">
            {(this.state.removeClickEvent==true)?
              <>
                {
              <Button className="theme-btn"  style={{backgroundColor:"#76272b"}}>
                    {this.props.EditContactType !== "" ? "Update" : "Save"}
                  </Button>
                }
              </>
              :
              <>
                {
              <Button className="theme-btn"  style={{backgroundColor:"#76272b"}} onClick={this.handleContactSubmit}>
                    {this.props.EditContactType !== "" ? "Update" : "Save"}
                  </Button>
                }
              </>
            }

          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
  dispatchUserDetail: (userDetails) =>
    dispatch({ type: GET_USER_DETAILS, payload: userDetails }),
  dispatchAuthId: (authId) =>
    dispatch({ type: GET_Auth_TOKEN, payload: authId }),
});
// export default contact;
export default connect(mapStateToProps, mapDispatchToProps)(contact)
