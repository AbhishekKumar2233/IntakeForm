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
  InputGroup,
} from "react-bootstrap";
import Select from "react-select";
import Address from "../components/address";
import Contact from "../components/contact";
import { $AHelper } from "../components/control/AHelper";
import { connect } from "react-redux";
import { SET_LOADER } from "../components/Store/Actions/action";
import { $Service_Url } from "../components/network/UrlPath";
import {
  $CommonServiceFn,
  $postServiceFn,
} from "../components/network/Service";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
// import AddressListComponent from "./addressListComponent";
// import ContactListComponent from "./ContactListComponent";
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";
// import PlaceOfBirth from './PlaceOfBirth';
import DynamicAddressForm from "./DynamicAddressForm";
import { isNotValidNullUndefile, isUrlValid, removeSpaceAtStart } from "./Reusable/ReusableCom";
import ProfessionalContact from "./ProfessionalContact";

export class primarycarephysician extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      // docUserId: this.props.docUsr ? this.props.docUsr.userId : "",
      docUserId: this.props.docUsr ? this.props.docUsr.professionalUserId || this.props.docUsr.userId : "",
      fName: this.props.docUsr ? this.props.docUsr.fName : "",
      mName: this.props.docUsr ? this.props.docUsr.mName : "",
      lName: this.props.docUsr ? this.props.docUsr.lName : "",
      businessName: "",
      businessTypeId : this.props.docUsr?.businessTypeId ? this.props.docUsr?.businessTypeId : "",
      websiteLink: "",
      loggedInUser: sessionStorage.getItem("loggedUserId") || "",
      proCategoriesAtUpdate : this.props.docUsr ? [this.props.docUsr] : [],
      mappingAndUserProffJsons: [],

      showAddress: false,
      showContact: false,
      genderId: "0",
      maritalStatusId: "0",
      suffixId: "0",
      birthPlaceId: "0",
      birthPlace: "",
      citizenshipId: "0",
      noOfChildren: "0",

      dob: "2022-03-18T15:22:48.672Z",
      sameWithPrimary: undefined,
      spouseUserId: sessionStorage.getItem("spouseUserId") || null,
      isVeteran: false,
      isPrimaryMember: false,
      memberRelationshipVM: null,
      spouseSamePrimaryData: [],

      maritalStatusId:"",
      doc_User_Id : "",
      doctorUserId : "",
      experience_yrs: "",
      is_GCM: null,
      is_GCM_Certified: null,
      speciality_Id: null,
      other: "string",
      happy_With_Service: null,
      visit_Duration: "",
      disable: false,
      addressData: [],
      suite: "",
      emailData: [],
      mobileData: [],
      alreadyspouseprimarycarephysician: false,
      allAddress: [],
      allAddres: [],
      birthPlace: "",
      getAddres: [],
      newAddres: [],
      primaryUserId : "",
      subtenantId: null,
      addressforupdating: {
        city: '',
        zipcode: '',
        country: '',
        addressLine1: '',
        state: '',
      }
    }

    this.professionalAddressRef = React.createRef();
    this.professionalContactRef = React.createRef();
  }
  componentDidMount() {
    konsole.log("dbprop", this.props);
    const primaryUserId = sessionStorage.getItem("SessPrimaryUserId");
    const subtenantid = sessionStorage.getItem("SubtenantId");
    let maritalStatusId = sessionStorage.getItem("maritalStatusId");
    this.setState({primaryUserId : primaryUserId, subtenantId : subtenantid})
    // this.Fetchprimaryphysician()
    let tempprimary = this.props.primaryphysiciandetails || [];

     this.setState({
      maritalStatusId: maritalStatusId,
     })
    // konsole.log("konsoleprinarymeber", addressData);s
    konsole.log("trtkhgjhdfjkghdfjkghjdfk", tempprimary)
    if (tempprimary.length > 0) {
      let spouseSamePrimaryData =
        tempprimary[0].userPrimaryCareMaps.length > 0 &&
          this.state.spouseUserId !== null
          ? tempprimary[0].userPrimaryCareMaps.filter(
            (item) => item.userId === this.state.spouseUserId
          )
          : [];

      let isSamePrimary = spouseSamePrimaryData.length > 0 ? true : false;
      this.setState({
        ...this.state,
        docUserId: tempprimary[0].docMemberUserId,
        fName: tempprimary[0].f_Name,
        mName: tempprimary[0].m_Name,
        lName: tempprimary[0].l_Name,
        businessName: tempprimary[0].businessName != null ? tempprimary[0].businessName : "",
        businessTypeId : tempprimary[0]?.businessTypeId ? tempprimary[0]?.businessTypeId : "",
        websiteLink: tempprimary[0].websiteLink != null ? tempprimary[0].websiteLink : "",
        proUserId: tempprimary[0].pro_User_Id,
        experience_yrs:
          tempprimary[0].experience_yrs !== null
            ? tempprimary[0].experience_yrs
            : "",
        is_GCM: tempprimary[0].is_GCM,
        is_GCM_Certified: tempprimary[0].is_GCM_Certified,
        happy_With_Service: tempprimary[0].happy_With_Service,
        visit_Duration: tempprimary[0].visit_Duration,
        doctorUserId: tempprimary[0].docMemberUserId,
        doc_User_Id: tempprimary[0].doc_User_Id,
        primary_Care_Id: tempprimary[0].primary_Care_Id,
        spouseSamePrimaryData: spouseSamePrimaryData,
        sameWithPrimary: isSamePrimary,
      });
    }
    konsole.log("vbsdh", this.professionalAddressRef, tempprimary[0]?.docMemberUserId)
    this.professionalAddressRef?.current?.getByUserId(tempprimary[0]?.docMemberUserId || this.props.docUsr?.userId)
    this.fetchSavedContactDetails(this.state.docUserId)

    let spouseUserId = sessionStorage.getItem("spouseUserId")
    this.Fetchprimaryphysician(spouseUserId)
    this.updateProCategories(this.state.proCategoriesAtUpdate || this.props.docUsr?.proCategories);
  }


  updateProCategories = (proCategories) =>{
    konsole.log("proUserIdddd",proCategories)
    
    const toUpdateServiceProvider = (proCategories || [])?.map((proCategory) => ({
      proUserId : proCategory?.proUserId || this.state.proUserId || 0,
      proCatId: proCategory?.proCatId || 0,
      proSerDescId: proCategory?.proSerDescId || 1,
      proTypeId: proCategory?.proTypeId || 10,
    //   proSubTypeId: isNaN(parseInt(this.state.proSubTypeId)) ? null : parseInt(this.state.proSubTypeId),
      proSubTypeId : 1,
      userProId : proCategory?.userProId || null
    }));

    this.setState({mappingAndUserProffJsons : toUpdateServiceProvider})
    konsole.log("toUpdateServiceProvider",toUpdateServiceProvider)
  
  }

  // ------------------------------------------------------------------------------------------------------------------------------------
  Fetchprimaryphysician = (spouseUserId) => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getPrimaryPhysician + spouseUserId,
      "",
      (response, errorData) => {
        this.props.dispatchloader(false);
        // debugger
        if (response) {
          let responseData = response.data.data?.physicians
          let physiciansDataFilterData = responseData?.filter(item => item.is_Primary_Care == true)
          if (physiciansDataFilterData.length > 0) {
            let userPrimaryCareMaps = physiciansDataFilterData[0]?.userPrimaryCareMaps
            konsole.log("physiciansDataFilterDataphysiciansDataFilterData", userPrimaryCareMaps, physiciansDataFilterData)
            if (userPrimaryCareMaps.length !== 2) {
              this.setState({ alreadyspouseprimarycarephysician: true })
            }
          }

        }
      }
    );
  };







  // ------------------------------------------------------------------------------------------------------------------------------------
  componentDidUpdate(prevProps, prevState) {
    konsole.log("dbpropupdate", this.props);

    if (prevProps.docUsr !== this.props.docUsr) {
      this.setState(
        {
          docUserId: this.props.docUsr ? this.props.docUsr.userId : "",
          fName: this.props.docUsr ? this.props.docUsr.fName : "",
          mName: this.props.docUsr ? this.props.docUsr.mName : "",
          lName: this.props.docUsr ? this.props.docUsr.lName : "",
          businessName : this.props.docUsr?.businessName ? this.props.docUsr?.businessName : "",
          businessTypeId : this.props.docUsr?.businessTypeId ? this.props.docUsr?.businessTypeId : "",
          websiteLink : this.props.docUsr?.websiteLink ? this.props.docUsr?.websiteLink : "",
        },
        () => {
          this.fetchSavedContactDetails(this.state.docUserId);
        }
      );
    }

    konsole.log("fsbhsb", this.props, this.state);
    
    if(prevProps.docUsr !== this.props.docUsr || prevProps.show != this.props.show){
      this.professionalAddressRef?.current?.getByUserId(this.props?.docUsr?.userId || this.state.docUserId);
    }
  }



  validate = () => {
    const { newAddres } = this.state;
    konsole.log(newAddres, "newAddresshssdhh")
    let nameError = "";

    // ================= Don't remove these comments ========================
    // if (this.professionalAddressRef?.current?.isEmpty()) {
    //   nameError = "Address cannot be blank";
    //   this.setState({disable: false})
    // }
    // if (this.state.lName == "") {
    //   nameError = "Last Name cannot be blank";
    //   this.setState({disable: false})
    // }
    // =====================================================================
    
    if (isNotValidNullUndefile(this.state.fName) == false) {
      nameError = "First Name cannot be blank";
      this.setState({disable: false})
    }
    // if(this.state.emailData.length == 0 && this.state.mobileData.length==0){
    //   nameError = "Contact cannot be blank";
    // }
    if (nameError) {

      this.toasterAlert(nameError, "Warning");

      return false;
    }

    if(this.validateWebLink(this.state.websiteLink) != true) return false;

    // if(this.professionalContactRef?.current?.checkvalidation(true)) return false;

    return true;
  };

  validateWebLink ( websiteLink, isOnSave ) {
    if(!websiteLink) return true;
    if(isUrlValid(websiteLink) == false) {
      if(isOnSave != true) {
        this.toasterAlert(`Please enter valid website link`, "Warning");
        this.setState({websiteLink: ""})
      } else {
        this.toasterAlert(`Please enter valid website link`, "Warning");
        // setwebsiteLink("");
      }
      return false;
    }
    return true;
  }

  safeHandleSubmit = async () => {
    if(this.validate() != true) return;

    this.props.dispatchloader(true);
    this.setState({disable: true});
    
    try {
      await this.handleOnSubmit();
    } catch (error) {
      konsole.log("mainErrorphysician", error);
      this.toasterAlert(Msg.ErrorMsg, "Warning");
    } 
    
    this.props.dispatchloader(false);
    this.setState({disable: false});
  }

  handleOnSubmit = async () => {    
    if(this.props.toUpdate != true) {
      this.funcUpdateProfUser();
      this.professionalAddressRef?.current?.upsertAddress(this.state.docUserId, 1);
      this.professionalContactRef?.current?.saveContactinfo(this.state.docUserId)

      let inputdata = {
        proUserId: this.state.mappingAndUserProffJsons[0]?.proUserId || this.state.proUserId || 0,
        userId: this.state.docUserId,
        isGenAuth: true,
        isStatus: true,
        isActive: true,
        upsertedBy: this.state.loggedInUser,
        proCategories: this.state.mappingAndUserProffJsons,
        businessName: this.state.businessName,
        businessTypeId : this.state.businessTypeId,
        websiteLink: this.state.websiteLink
      }


      const resp = await this.funcPostProfMapping(inputdata);
      if(!resp && resp == "err") throw new Error("error");

      let jsonArray = [
        {
          userProId: resp[0]?.userProId || 0, // always 0
          proUserId: resp[0]?.proUserId,
          proCatId: resp[0]?.proCatId || resp[0]?.proCategories[0]?.proCatId,
          userId: this.props.UserDetail.userId,
          lpoStatus: false,
          isActive: true,
          upsertedBy: this.state.loggedInUser
        }
      ]

      this.funcPostProfUser(jsonArray);

      let physicianinput = {
        "docMemberUserId": this.state.docUserId,
        "doc_License": null,
        "experience_yrs": isNaN(parseInt(this.state.experience_yrs)) ? 0 : parseInt(this.state.experience_yrs),
        "is_Primary": true,
        "is_GCM": this.state.is_GCM,
        'is_GCM_Certified': this.state.is_GCM_Certified,
        "speciality_Id": parseInt(this.state.speciality_Id),
        "other": null,
        "is_Primary_Care": true,
        "isProUserAdded": true,
        "pro_User_Id": resp[0]?.proUserId,
        "happy_With_Service": this.state.happy_With_Service,
        "visit_Duration": this.state.visit_Duration,
        "isSameSpecialist": (this.state.sameWithPrimary !== undefined) ? this.state.sameWithPrimary : false,
        "createdBy": this.state.loggedInUser,
      }

      const responsePrimary = await this.funcPostAddPhysician("POST", physicianinput);


      konsole.log("fbsvhyus", responsePrimary);

      let jsonData = {
        userId: this.props.UserDetail?.userId,
        primaryCareId: responsePrimary?.physicians[0]?.primary_Care_Id,
        sameInsUserId: null,
        createdBy: this.state.loggedInUser,
      }
      await this.funcMapPrimaryCare("POST", jsonData);

      if(this.state.sameWithPrimary == true) {
        jsonData = {
          userId: this.state.spouseUserId,
          primaryCareId: responsePrimary?.physicians[0]?.primary_Care_Id,
          sameInsUserId: this.props.UserDetail?.userId,
          createdBy: this.state.loggedInUser,
        }
        await this.funcMapPrimaryCare("POST", jsonData);
      }

    } else {
      const checkuserId = this.state.spouseUserId !== null && this.props.UserDetail?.userId == this.state.spouseUserId;
      const checkmemberphysicians = (this.props.UserDetail?.physicians !== undefined && this.props.UserDetail?.physicians.length > 0) && this.props.UserDetail?.physicians?.filter((item) => item.is_Primary_Care === true && item.userPrimaryCareMaps.length == 2).length > 0;

      if(checkuserId && checkmemberphysicians) {
        const _profUserId = await this.funcChangeProfUser();

        konsole.log("snbhjbs", _profUserId)

        this.professionalAddressRef?.current?.upsertAddress(_profUserId, 1, true);
        this.professionalContactRef?.current?.saveContactinfo(_profUserId)
        this.funcGetPrevProfPostNewProfContact(this.state.docUserId, _profUserId);

        let inputdata = {
          proUserId: 0,
          userId: _profUserId,
          isGenAuth: true,
          isStatus: true,
          isActive: true,
          upsertedBy: this.state.loggedInUser,
          proCategories: [
            {
              proCatId: 0,
              proSerDescId: this.state.mappingAndUserProffJsons?.[0]?.proSerDescId,
              proTypeId: this.state.mappingAndUserProffJsons?.[0]?.proTypeId,
              proSubTypeId: this.state.mappingAndUserProffJsons?.[0]?.proSubTypeId
            }
          ],
          businessName: this.state.businessName,
          businessTypeId : this.state.businessTypeId,
          websiteLink: this.state.websiteLink
        }
  
        const resp = await this.funcPostProfMapping(inputdata);
        if(resp == "err") throw new Error("error");

        let jsonArray = [
          {
            userProId: resp[0]?.userProId || 0, // always 0
            proUserId: resp[0]?.proUserId,
            proCatId: resp[0]?.proCatId || resp[0]?.proCategories[0]?.proCatId,
            userId: this.props.UserDetail.userId,
            lpoStatus: false,
            isActive: true,
            upsertedBy: this.state.loggedInUser
          }
        ]

        this.funcPostProfUser(jsonArray);

        let physicianinput = {
          "docMemberUserId": _profUserId,
          "doc_License": null,
          "experience_yrs": isNaN(parseInt(this.state.experience_yrs)) ? 0 : parseInt(this.state.experience_yrs),
          "is_Primary": true,
          "is_GCM": this.state.is_GCM,
          'is_GCM_Certified': this.state.is_GCM_Certified,
          "speciality_Id": parseInt(this.state.speciality_Id),
          "other": null,
          "is_Primary_Care": true,
          "isProUserAdded": true,
          "pro_User_Id": resp[0]?.proUserId,
          "happy_With_Service": this.state.happy_With_Service,
          "visit_Duration": this.state.visit_Duration,
          "isSameSpecialist": false,
          "createdBy": this.state.loggedInUser,
        }
  
        const responsePrimary = await this.funcPostAddPhysician("POST", physicianinput);
        let jsonData = {
          userId: this.props.UserDetail?.userId,
          primaryCareId: responsePrimary?.physicians[0]?.primary_Care_Id,
          sameInsUserId: null,
          createdBy: this.state.loggedInUser,
        }
        await this.funcMapPrimaryCare("POST", jsonData);
      } else {
        this.professionalAddressRef?.current?.upsertAddress(this.state.docUserId, 1);
        this.professionalContactRef?.current?.saveContactinfo(this.state.docUserId)
        this.funcUpdateProfUser();

        let inputdata = {
          proUserId: this.state.mappingAndUserProffJsons[0]?.proUserId || this.state.proUserId || 0,
          userId: this.state.docUserId,
          isGenAuth: true,
          isStatus: true,
          isActive: true,
          upsertedBy: this.state.loggedInUser,
          proCategories: this.state.mappingAndUserProffJsons,
          businessName: $AHelper.capitalizeAllLetters(this.state.businessName),
          businessTypeId : this.state.businessTypeId,
          websiteLink: this.state.websiteLink
        }
  
        const resp = await this.funcPostProfMapping(inputdata);
        if(resp == "err") throw new Error("error");

  
        let physicianinput = {
          "docMemberUserId": this.state.docUserId,
          "doc_License": null,
          "experience_yrs": isNaN(parseInt(this.state.experience_yrs)) ? 0 : parseInt(this.state.experience_yrs),
          "is_Primary": true,
          "is_GCM": this.state.is_GCM,
          'is_GCM_Certified': this.state.is_GCM_Certified,
          "speciality_Id": parseInt(this.state.speciality_Id),
          "other": null,
          "is_Primary_Care": true,
          "isProUserAdded": true,
          "pro_User_Id": resp[0]?.proUserId,
          "happy_With_Service": this.state.happy_With_Service,
          "visit_Duration": this.state.visit_Duration,
          "isSameSpecialist": (this.state.sameWithPrimary !== undefined) ? this.state.sameWithPrimary : false,
          "primary_Care_Id": this.state.primary_Care_Id,
          "doc_User_Id": this.state.doc_User_Id,
          "updatedBy": this.state.loggedInUser
        }
  
        await this.funcPostAddPhysician("PUT", physicianinput);
      }

    }

    AlertToaster.success(`Physician ${this.props.toUpdate == true ? "updated" : "saved"} successfully`);
    // this.props.CallSearchApi(this.props.UserDetail?.userId,this.state.primaryUserId);
    // setTimeout(() => window.location.reload(), [600]);
    this.props.hidePhysician();
  }

  /**
   * API 1
   * @param {object} inputdata 
   * @returns 
   */
  funcPostProfMapping = (inputdata) => {
    return new Promise((resolve, reject) => {
      $CommonServiceFn.InvokeCommonApi( "POST", $Service_Url.postProfessionalUserMapping, inputdata, (response,error) => {
        konsole.log("Success resPhy" + JSON.stringify(response));
        if (response) {
          let professUserId = response.data.data;
          konsole.log("professUserId12121",professUserId)
          return resolve(professUserId)
        } else {
          konsole.log("errorAccount",error)
          this.toasterAlert(Msg.ErrorMsg, "Warning");
          this.setState({disable:false})
          return resolve("err")
        }
      })
    })
  }

  /**
   * API 2
   * @param {object} jsonArray 
   * @returns 
   */
  funcPostProfUser = (jsonArray) => {
    return new Promise((resolve, reject) => {
      $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postProfessionalUser, jsonArray, (response,error) => {
        this.props.dispatchloader(false);
        if(response){
          konsole.log("responseProfessional213", response);
          let proUserId = response.data?.data?.[0]?.proUserId;
          return resolve(proUserId);
        }else{
          konsole.log("error1212",error)
          this.setState({disable:false})
          return resolve("err")
        }
      })
    })
  }

  /**
   * API 3
   * @param {string} method 
   * @param {object} physicianinput 
   * @returns 
   */
  funcPostAddPhysician = (method, physicianinput) => {
    if(method != "POST" && method != "PUT") return "err";
    let URL = method == "PUT" ? $Service_Url.putPrimaryCarePhysicianPath : $Service_Url.postAddPhysician;

    let postData = {
      userId: this.props.UserDetail.userId,
      physician: physicianinput
    }

    return new Promise ((resolve, reject) => {
      $CommonServiceFn.InvokeCommonApi(method, URL, postData, (response, error) => {
        if(response) {
          konsole.log("ghjvhj", response)
          return resolve(response.data.data);
        } else {
          konsole.log("ghjvhj", error)
          return resolve("err");
        }
      })
    })
  }

  /**
   * API 4
   * @param {string} method 
   * @param {object} _responsePrimary 
   * @param {string} _userPrimaryCareMapId 
   * @returns 
   */
  funcMapPrimaryCare = async (method, _responsePrimary, _userPrimaryCareMapId) => {
    if(method != "POST" && method != "PUT") return "err";
    const apiUrl = $Service_Url.mapPrimaryCare;

    const userPostData = method == "POST" ? _responsePrimary : {
      userPrimaryCareMapId: _userPrimaryCareMapId,
      isDeleted: true,
      remarks: "",
      updatedBy: this.state.loggedInUser,
    }

    return new Promise(async (resolve, reject) => {
      const resp = await $postServiceFn.mapDataWithPrimaryUser(method, apiUrl, userPostData);
      return resolve(resp == "reject" ? "err" : "done");
    })
  }

  funcChangeProfUser = async () => {
    const jsonobj = {
      subtenantId: this.state.subtenantId, 
      fName: this.state.fName, 
      mName: this.state.mName, 
      lName: this.state.lName, 
      createdBy: this.state.loggedInUser 
    }

    const physicianInfouserPrimaryCareMaps = this.state.spouseSamePrimaryData.filter(item => item.userId === this.state.spouseUserId);
    const userPrimaryCareMapId = physicianInfouserPrimaryCareMaps[0]?.userPrimaryCareMapId;

    this.funcMapPrimaryCare("PUT", undefined, userPrimaryCareMapId); // delete prev mapped prof

    const addRep = await $postServiceFn.addmemberprimarycarephycians("POST", $Service_Url.postAddMember, jsonobj);
    const _profUserId = addRep?.data?.data?.member?.userId;

    return _profUserId;
  }

  funcUpdateProfUser = () => {
    let physicianInfo = {
      userId: this.state.docUserId,
      fName: $AHelper.capitalizeAllLetters(this.state.fName),
      mName: $AHelper.capitalizeAllLetters(this.state.mName),
      lName: $AHelper.capitalizeAllLetters(this.state.lName),
      // nickName: this.state.nickName,

      updatedBy: this.state.loggedInUser,
      subtenantId : sessionStorage.getItem('SubtenantId')
    };

    $postServiceFn.putUserInfo(physicianInfo, (res) => {
      if(res) {
        konsole.log("succupdateprof", res);
      }
    })

    return;
  }

  funcGetPrevProfPostNewProfContact = (oldProfUserId, newProfUserId) => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAllContactOtherPath + oldProfUserId, undefined, (res, err) => {
      if(res?.data?.data) {
        konsole.log("vdvda", res?.data?.data);
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postAddContactWithOther, {
          ...res?.data?.data,
          userId: newProfUserId,
          activityTypeId: "4"
        }, (response, error) => {
          if(response) konsole.log("vdvdain", response?.data?.data);
          else konsole.log("vdvdainerror", error);
        })
      }
      else konsole.log("vdvdaerror", err);
    })
  }

  handleChange = (event) => {
    const eventId = event.target.id;
    const eventValue = event.target.value;

    // konsole.log("eventId", eventId);
    // konsole.log('eventValue', eventValue);

    if (
      eventId == "fName" ||
      eventId == "lName" ||
      eventId == "businessName" ||
      eventId == "mName" ||
      eventId == "birthPlace"
    ) {
      let nameValue = $AHelper.capitalizeFirstLetter(eventValue);
      nameValue = removeSpaceAtStart(nameValue);
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
    } else if (eventId == "visit_Duration") {
      if ($AHelper.isNumberRegexformedical(eventValue)) {
        this.setState({
          ...this.state,
          [eventId]: eventValue,
        });
      } else {
        this.setState({
          ...this.state,
          [eventId]: "",
        });
      }
    } else if (eventId == "suite" || eventId == "websiteLink") {
      this.setState({
        ...this.state,
        [eventId]: eventValue,
      });
    }
  };

  fetchSavedContactDetails = (userid) => {
    konsole.log("contactUserId",userid)
    this.props.dispatchloader(true);
    userid = userid || this.state.userId;
    if(!userid) return;
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getAllContactOtherPath + userid,
      "",
      (response) => {
        this.props.dispatchloader(false);
        if (response) {
          this.setState({
            ...this.state,
            allContactDetails: response.data.data.contact,
          });
          // konsole.log("responseatsav", response);
        } else {

          // this.toasterAlert(Msg.ErrorMsg, "Warning"); 
        }
      }
    );
  };

  hidePopup = () => {
    this.context.setPageTypeId(null)
      this.props.hidePhysician();
  
    
  };

  toasterAlert(text, type) {
    this.context.setdata({ open: true, text: text, type: type });
  }

  fsameWithPrimary = (event) => {
    const radioName = event.target.name;
    const radioValue = event.target.value;
    if (radioName == "sameWithPrimary" && radioValue == "Yes") {
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

  contactDetails = (mobile, email) => {
    konsole.log("attrvalueattrvalue", mobile, email);
    this.setState({
      mobileData: mobile,
      emailData: email,
    });
  };


  ModalTitle = () => {
    return (
      <div className='ms-10px fs-5 fw-bold'>
        {" "}
        Primary Care Physician -{" "}
        {this.props.UserDetail
          ? this.props.UserDetail.fName +
          " " +
          (this.props.UserDetail.mName !== null
            ? this.props.UserDetail.mName
            : "") +
          " " +
          this.props.UserDetail.lName
          : ""}
      </div>
    )
  }

  ModalBody = () => {
    return (
      <>
      <Row className=" mt-2">
        <Col xs="12" sm="6" md="6" className="d-flex align-items-center mb-3 ">
          <Form.Control
            className="upperCasing"
            type="text"
            value={this.state.fName}
            placeholder={$AHelper.mandatory("First Name")}
            id="fName"
            onChange={(event) => {
              this.handleChange(event);
            }}
          />
        </Col>
        {/* <Col xs="12" sm="12" md="4" className="d-flex align-items-center mb-3">
          <Form.Control
            value={this.state.mName}
            placeholder="Middle Name"
            id="mName"
            onBlur={this.handleFocusOut}
            onChange={(event) => {
              this.handleChange(event);
            }}
            type="text"
          />
        </Col> */}
        <Col  xs="12" sm="6" md="6" className="d-flex align-items-center mb-3">
          <Form.Control
            className="upperCasing"
            value={this.state.lName}
            // placeholder={$AHelper.mandatory("Last Name")}
            placeholder={"Last Name"}
            id="lName"
            onChange={(event) => {
              this.handleChange(event);
            }}
            type="text"
          />
        </Col>
      </Row>
      <Row className="">
      <Col xs="12" sm="6" md="6" className="d-flex align-items-center mb-3">
          <Form.Control
            className="upperCasing"
            value={this.state.businessName}
            placeholder="Clinic Name"
            id="businessName"
            onChange={(event) => {
              this.handleChange(event);
            }}
            type="text"
          />
        </Col>
        <Col xs="12" sm="6" md="6" className="mb-2">
            <Form.Control
              value={this.state.websiteLink}
              placeholder="Website link"
              id="websiteLink"
              onChange={(event) => {
                this.handleChange(event);
              }}
              onBlur={e => this.validateWebLink(e.target.value)}
              type="text"
            />
        </Col>
      </Row>
      <Row className="my-3 px-3">
        <Col xs sm="12" lg="12" className='border p-2 rounded'>
          <Row className="">
            <Col xs="12" sm="6" md="4" className="mt-0 mb-2" style={{fontSize: "1.15rem", fontWeight: "400", lineHeight: "1.5"}}>
              Address
            </Col>
          </Row>
          <DynamicAddressForm ref={this.professionalAddressRef} setLoader={this.props.dispatchloader}/>
        </Col>
      </Row>
      {/*             
      <Col xs sm="6" lg="3" className='mb-3'>
        <PlaceOfBirth
          addressDetails={this.addressDetails}
          // handlePlaceBirth={this.handlePlaceBirth}
          addressData={this.state.addressData}
          placeholder={true}
        />
      </Col> */}

      {/* <AddressListComponent userId={this.state.docUserId} addressDetails={this.addressDetails}  />  */}
      {/* <ContactListComponent userId={this.state.docUserId} contactDetails={this.contactDetails} key={this.state.docUserId}/> */}
      <div className='m-3'>
      <ProfessionalContact  userId={this.state.docUserId}  ref={this.professionalContactRef} key = {this.state.docUserId} />
      </div>
      {/* <Row className="m-0 mb-4">
        <Col xs md="4" className="d-flex align-items-center ps-0">
          <button className="white-btn" onClick={() =>this.InvokeEditContactID("","")}>{$AHelper.mandatory("Contact")}</button>
          {this.state.showContact?
          <Contact
            fetchprntSavedContactDetails={this.fetchSavedContactDetails}
            userId={this.state.docUserId}
            handleshowContact={this.handleshowContact}
            showContact={this.state.showContact}
            allContactDetails={this.state.allContactDetails} EditContactId={this.state.EditContactId} EditContactType={this.state.EditContactType}
          />
          :
        ""
          }
        </Col>
      </Row>
      <Row className="m-0 mb-3">
            {this.state.allContactDetails && this.state.allContactDetails?.mobiles && this.state.allContactDetails.mobiles.map((val, id) => {
              return (
                    <Col xs md="4" className="d-flex align-items-center" >
                      <InputGroup className="mb-3 rounded">
                        <InputGroup.Text className='bg-secondary' onClick={() => this.InvokeEditContactID(val, "mobile")}><img src="icons/mob-icon.svg" alt="" /></InputGroup.Text>
                        <div className="form-control">
                          <p className='' key={val.id}>{val.mobileNo.slice(0,-10)} {$AHelper.formatPhoneNumber(val.mobileNo.slice(-10))} </p></div>
                          {
                            val.contactTypeId !== 1 &&
                            <InputGroup.Text className='bg-secondary' onClick={() => this.handleDeleteContact(this.state.docUserId, val.contactId)}><img className= "" src="icons/BinIcon.svg" alt="Add Address" /> </InputGroup.Text>
                          }
                      </InputGroup>
                    </Col>
                );
              })}
            {this.state.allContactDetails && this.state.allContactDetails.emails && this.state.allContactDetails.emails.map((val, id) => {
                return (
                    <Col xs md="4" className="d-flex align-items-center  ps-0 flex-wrap" key={id} >
                      <InputGroup className="mb-3 rounded">
                        <InputGroup.Text className='bg-secondary' onClick={() => this.InvokeEditContactID(val, "email")}><img src="icons/mob-icon.svg" alt="" /></InputGroup.Text>
                        <div className="form-control">
                          <p className='' key={val.id}>{val.emailId} </p></div>
                          {
                            val.contactTypeId !== 1 &&
                            <InputGroup.Text className='bg-secondary' onClick={() => this.handleDeleteContact(this.state.docUserId, val.contactId)}><img className= "" src="icons/BinIcon.svg" alt="Add Address" /> </InputGroup.Text>
                          }
                      </InputGroup>
                    </Col>
                );
              })}
          </Row> */}
      <Row className="ms-10px m-0 mb-3 border p-3">
        <Col xs sm="6" lg="6" className="ps-0" id="primaryCare1">
          <label className="mb-3">
            How many years have you seen this physician ?
          </label>
          <div className="w-100 ">
            <div
              key="checkbox122" 
              className="mb-2 d-flex align-items-center border position-relative"
            >
              <Form.Control
                value={this.state.visit_Duration}
                placeholder="Years/Months with this physician"
                id="visit_Duration"
                onChange={(event) => {
                  this.handleChange(event);
                }}
                onBlur={(e) => {
                  this.setState({
                    visit_Duration: e.target.value.includes(".")
                      ? e.target.value
                      : e.target.value + "",
                  });
                }}
                className="w-100 border-0"
                type="text"
              />
              {(this.state.visit_Duration?.length>0) && <span className="ms-2 me-2 position-absolute end-0">
                Years/Months
              </span> }
             
            </div>
          </div>
        </Col>
        <Col
          xs
          sm="6"
          lg="6"
          className=" d-flex justify-content-start align-items-start flex-column"
          id="primaryCare2"
        >
          <label className="mb-3 text-center ">
            Are you happy with his/her care ?{" "}
          </label>
          <div className="d-flex justify-content-center align-items-end">
            <div
              key="checkbox8324"
              className="me-4 pe-3 mb-0 d-flex align-items-center"
            >
              <Form.Check
                value={this.state.happy_With_Service}
                name="happy_With_Service"
                id="happy_With_Service"
                onChange={(event) =>
                  this.setState({ happy_With_Service: true })
                }
                className="chekspace d-inline-flex align-items-center mb-3"
                type="radio"
                checked={this.state.happy_With_Service}
                label="Yes"
              />
            </div>
            <div
              key="checkbox8234"
              className="me-4 pe-3 mb-0 d-flex align-items-center"
            >
              <Form.Check
                value={this.state.happy_With_Service}
                checked={
                  this.state.happy_With_Service == false
                    ? !this.state.happy_With_Service
                    : ""
                }
                onChange={() =>
                  this.setState({ happy_With_Service: false })
                }
                name="happy_With_Service"
                id="happy_With_Service"
                className="chekspace d-inline-flex align-items-center mb-3"
                type="radio"
                label="No"
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row className="ms-10px m-0 mb-3 border p-3">
        <Col
          xs
          sm="6"
          lg="6"
          className="ps-0 d-flex justify-content-start align-items-start flex-column"
          id="primaryCare3"
        >
          <label className="mb-3 text-center">
            Is the physician a geriatrician?
          </label>
          <div className="d-flex justify-content-center align-items-end">
            <div
              key="checkbox812312"
              className="me-4 pe-3 mb-0 d-flex align-items-center"
            >
              <Form.Check
                value={this.state.is_GCM}
                checked={this.state.is_GCM}
                onChange={() => {
                  this.setState({ is_GCM: true });
                }}
                className="chekspace d-inline-flex align-items-center"
                type="radio"
                name="is_GCM"
                label="Yes"
              />
            </div>
            <div
              key="checkbox8675"
              className="me-4 pe-3 mb-0 d-flex align-items-center"
            >
              <Form.Check
                value={this.state.is_GCM}
                checked={
                  this.state.is_GCM == false ? !this.state.is_GCM : ""
                }
                onChange={() => {
                  this.setState({ is_GCM: false });
                }}
                className="chekspace d-inline-flex align-items-center"
                type="radio"
                name="is_GCM"
                label="No"
              />
            </div>
          </div>
        </Col>

        {this.state.is_GCM == true ? (
          <>
            <Col
              xs
              sm="6"
              lg="6"
              className="ps-0 d-flex justify-content-start align-items-start flex-column"
              id="primaryCare4"
            >
              <label className="mb-3">
                Is the physician a ‘board certified’ geriatrician ?
              </label>
              <div className="d-flex justify-content-center align-items-end">
                <div
                  key="checkbox8564"
                  className="me-4 pe-3 mb-0 d-flex align-items-center"
                >
                  <Form.Check
                    className="chekspace d-inline-flex align-items-center"
                    value={this.state.is_GCM_Certified}
                    checked={this.state.is_GCM_Certified}
                    type="radio"
                    name="is_GCM_Certified"
                    onChange={() =>
                      this.setState({ is_GCM_Certified: true })
                    }
                    label="Yes"
                  />
                </div>
                <div
                  key="checkbox84564"
                  className="me-4 pe-3 mb-0 d-flex align-items-center"
                >
                  <Form.Check
                    className="chekspace d-inline-flex align-items-center"
                    value={this.state.is_GCM_Certified}
                    checked={
                      this.state.is_GCM_Certified == false
                        ? !this.state.is_GCM_Certified
                        : ""
                    }
                    type="radio"
                    name="is_GCM_Certified"
                    onChange={() =>
                      this.setState({ is_GCM_Certified: false })
                    }
                    label="No"
                  />
                </div>
              </div>
            </Col>
          </>
        ) : (
          ""
        )}
      </Row>
      {(this.state.alreadyspouseprimarycarephysician == false) && this.state.spouseUserId !== "null" && this.props.UserDetail.userId == this.state.primaryUserId && (
        <Row className="ms-10px m-0 mb-3 border p-3">
          <Col xs sm="10" lg="9" className="ps-0" id="healthInsurance1">
            <label className="mb-3">
              {`Does your ${this.state.maritalStatusId == 2 ? "partner" :"spouse"} use the same Primary Care Physician?`}{" "}
            </label>
            {/* <div className="d-flex justify-content-start align-items-end ">
              <div
                key="checkbox8"
                className="me-4 pe-3 mb-0 d-flex align-items-center"
              >
                <Form.Check
                  className="chekspace"
                  type="radio"
                  id="checkbox8212"
                  label="Yes"
                  value="Yes"
                  name="sameWithPrimary"
                  onChange={(event) => this.fsameWithPrimary(event)}
                  checked={this.state?.sameWithPrimary == true}
                />
                  <div
                key="checkbox812"
                className="me-4 pe-3 mb-0 d-flex align-items-center"
              >
                <Form.Check
                  className="chekspace"
                  type="radio"
                  id="checkbox8"
                  label="No"
                  value="No"
                  name="sameWithPrimary"
                  onChange={(event) => this.fsameWithPrimary(event)}
                  checked={this.state?.sameWithPrimary == false}
                />
              </div>
              </div>
              </div> */}
            <div className="d-flex justify-content-start align-items-end ">
              <div
                key="checkbox8"
                className="me-4 pe-3 mb-0 d-flex align-items-center"
              >
                <Form.Check
                  className="chekspace"
                  type="radio"
                  id="checkbox8212"
                  label="Yes"
                  value="Yes"
                  name="sameWithPrimary"
                  onChange={(event) => this.fsameWithPrimary(event)}
                  checked={this.state?.sameWithPrimary == true}
                />
              </div>
              <div
                key="checkbox812"
                className="me-4 pe-3 mb-0 d-flex align-items-center"
              >
                <Form.Check
                  className="chekspace"
                  type="radio"
                  id="checkbox8"
                  label="No"
                  value="No"
                  name="sameWithPrimary"
                  onChange={(event) => this.fsameWithPrimary(event)}
                  checked={this.state?.sameWithPrimary == false}
                />
              </div>
            </div>
          </Col>
        </Row>
      )}
      </>
    )
  }

  ModalFooter = () => {
    return (
      <Button
        style={{ backgroundColor: "#76272b", border: "none",marginTop:"0px" }}
        className="ms-3 theme-btn"
        onClick={() => this.safeHandleSubmit()}
        disabled={this.state.disable == true ? true : false}
      >
        {this.props.toUpdate == true ? "Update" : "Save"}
      </Button>
    )
  }


  render() {
    konsole.log("addressDataaddressDataaddressData", this.props.UserDetail,this.props,this.props.alreadyhaveprimaryphysician,this.state.allContactDetails)
    konsole.log("spouseUserIdspouseUserId", this.state.spouseUserId)
    konsole.log("addressDataaddressData", this.state.mobileData, this.state.emailData, this.state.newAddres)
    // konsole.log("prumary", this.state);

    konsole.log("spouseUserIdspouseUserId", this.state.experience_yrs)




    konsole.log(
      "addressDataaddressData",
      this.state.mobileData,
      this.state.emailData,
      this.state.addressData
    );
    konsole.log("prumary", this.state)

    konsole.log(
      "spouseUserIdspouseUserId",
      this.state.spouseUserId,
      this.props.UserDetail
    );
    let member = this.props.UserDetail;
    //  let checkuserId=this.state.spouseUserId !== null && member.userId == this.state.spouseUserId
    //   let checkmemberphysicians= (member?.physicians !== undefined && member?.physicians.length > 0) &&member?.physicians?.filter(item => (item.is_Primary_Care === true && item.userPrimaryCareMaps.length == 2)).length > 0
    // konsole.log("checkuserIdcheckuserId",checkuserId,checkmemberphysicians)
    let physicianInfouserPrimaryCareMaps =
      member?.physicians?.length !== undefined &&
      member?.physicians[0]?.userPrimaryCareMaps?.filter(
        (item) => item.userId === this.state.spouseUserId
      );
    konsole.log(
      "physicianInfouserPrimaryCareMaps",
      physicianInfouserPrimaryCareMaps
    );

    // this.state.spouseUserId !== "null" && this.props.UserDetail.userId == primaryUserId
    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
          }
        `}</style>
        {/* <a onClick={this.handleShow}>
          <img src="/icons/add-icon.svg" alt="Health Insurance" />
        </a> */}

        {this.props.alreadyhaveprimaryphysician ?
        <Modal
          show={this.props.show}
          centered
          onHide={this.hidePopup}
          animation="false"
          id="primaryCare"
          backdrop="static"
          enforceFocus={false}
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>
              <this.ModalTitle/>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-3 pt-4">
            <this.ModalBody/>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <this.ModalFooter/>
          </Modal.Footer>
        </Modal>
        :
        <>
          <this.ModalTitle/>
          <this.ModalBody/>
          <this.ModalFooter/>
        </>}
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
)(primarycarephysician);