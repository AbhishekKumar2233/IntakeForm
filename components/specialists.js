import React, { Component } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Tooltip, OverlayTrigger, Nav, Dropdown, Collapse, Breadcrumb, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import Address from "../components/address"
import Contact from "../components/contact"
import { $AHelper } from '../components/control/AHelper';
// import PlaceOfBirth from './PlaceOfBirth';

import { connect } from 'react-redux';

import { SET_LOADER } from '../components/Store/Actions/action'
import { $Service_Url } from "../components/network/UrlPath";
import {
  $CommonServiceFn,
  $postServiceFn,
} from "../components/network/Service";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import Other from "./asssets/Other";
import OtherInfo from "./asssets/OtherInfo";
// import AddressListComponent from "./addressListComponent";
import ContactListComponent from "./ContactListComponent";
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";
import DynamicAddressForm from "./DynamicAddressForm";
import { isNotValidNullUndefile, isUrlValid, removeSpaceAtStart } from './Reusable/ReusableCom';
import ProfessionalContact from './ProfessionalContact';

export class specialists extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,
      showAddress: false,
      showContact: false,
      Specalisttypes: [],
      Specialists: [],
      loggedInUser: sessionStorage.getItem("loggedUserId") || "",
      // docUserId: this.props.docUsr ? this.props.docUsr.userId : "",
      docUserId: this.props.docUsr ? this.props.docUsr.professionalUserId || this.props.docUsr.userId : "",
      fName: this.props.docUsr ? this.props.docUsr.fName : "",
      mName: this.props.docUsr ? this.props.docUsr.mName : "",
      lName: this.props.docUsr ? this.props.docUsr.lName : "",
      nickName: this.props.docUsr ? this.props.docUsr.nickName : "",
      clinicname: "",
      genderId: "0",
      maritalStatusId: "0",
      suffixId: "0",
      birthPlaceId: "0",
      disable:false,
      birthPlace: "",
      citizenshipId: "0",
      noOfChildren: "0",
      dob: "2022-03-18T15:22:48.672Z",
      spouseUserId: sessionStorage.getItem("spouseUserId") || null,
      SessPrimaryUserId:sessionStorage.getItem("SessPrimaryUserId") || null,
      sameWithPrimary: undefined,
      spouseSameInsuranceData: [],
      isVeteran: false,
      isPrimaryMember: false,
      allAddress: [],
      experience_yrs: "",
      is_GCM: false,
      speciality_Id: "",
      other: "string",
      happy_With_Service: false,
      visit_Duration: "",
      natureId: "",
      maritalStatusId:"",
      filterdataforupdate:[],
      getAddres : [],
      addressData: [],
      newAddress :[],
      suite: "",
      emailData: [],
      mobileData: [],
      spouseSamePrimaryData:[],
      // proCategoriesAtUpdate : this.props.addNewProff == "addForUser" ? this.props.docUsr.proCategories : [this.props.docUsr],
      mappingAndUserProffJsons: [],
      proSubTypeId : "",
      userId : "",
      loggedInUser : "",
      specialityType : "",
      subtenantId : null,
      showOtherField : false,
      addressforupdating:{
        city:'',
        zipcode:'',
        country:'',
        addressLine1:'',
        state:'',
       }
    };
    this.professSubTypeRef = React.createRef();
    this.professionalAddressRef = React.createRef();
    this.professionalContactRef = React.createRef();
  //  this.specalistRef = React.createRef();
  }
  componentDidMount() {
    konsole.log("propsopsops",this.props)
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let maritalStatusId = sessionStorage.getItem("maritalStatusId");
    let loggedInUser = sessionStorage.getItem("loggedUserId");
    let updateProData = this.props.addNewProff == "addForUser" ? this.props.docUsr.proCategories : [this.props.docUsr]
    let subtenantid = sessionStorage.getItem("SubtenantId");
    this.setState({
      ...this.state,
         maritalStatusId:maritalStatusId,
        userId: this.props.UserDetail.userId || newuserid,
        loggedInUser: loggedInUser,
        speciality_Id: (this.props?.proCategories?.length > 0 && this.props?.proCategories != null) ? this.props?.proCategories[0].proSubTypeId : 0,
        subtenantId : subtenantid, 
        showOtherField : this.props?.docUsr?.proSubTypeId == 999999 ? true : false,
        clinicname: this.props?.docUsr?.businessName ? this.props?.docUsr?.businessName : "",
        websiteLink: this.props?.docUsr?.websiteLink ? this.props?.docUsr?.websiteLink : "",
      },()=>{
        this.updateProCategories(updateProData);
      });
    this.professionalAddressRef?.current?.getByUserId(this.props.docUsr?.professionalUserId || this.props.docUsr?.userId);
    // this.fetchSavedAddress(this.props.docUsr.professionalUserId || this.props.docUsr.userId);
    this.fetchSavedContactDetails(this.props.docUsr.professionalUserId || this.props.docUsr.userId);
    this.FetchSpecalistType(this.props.proCategories);
    this.Fetchprimaryphysician();
  }

  componentDidUpdate(prevProps, prevState) {
    konsole.log("prevPropsprevProps", prevProps, this.props.docUsr);
    let updateProData = this.props.addNewProff == "addForUser" ? this.props.docUsr.proCategories : [this.props.docUsr]
    if (prevProps.docUsr !== this.props.docUsr) {
      this.setState({
        ...this.state,
          docUserId: this.props.docUsr ? this.props.docUsr?.professionalUserId || this.props.docUsr?.userId : "",
          fName: this.props.docUsr ? this.props.docUsr.fName : "",
          mName: this.props.docUsr ? this.props.docUsr.mName : "",
          lName: this.props.docUsr ? this.props.docUsr.lName : "",
          nickName: this.props.docUsr ? (this.props.docUsr.nickName || "") : "",
          speciality_Id:  (this.props?.proCategories?.length > 0 && this.props?.proCategories != null) ? this.props?.proCategories[0].proSubTypeId : 0,
          showOtherField : this.props?.docUsr?.proSubTypeId == 999999 ? true : false,
          clinicname: this.props?.docUsr?.businessName ? this.props?.docUsr?.businessName : "",
          websiteLink: this.props?.docUsr?.websiteLink ? this.props?.docUsr?.websiteLink : "",
          sameWithPrimary: undefined
          // mappingAndUserProffJsons: []
        }, () => {
          // konsole.log("namemem",this.state.fName,this.state.lName)
          this.updateProCategories(updateProData)
        }
        );
    // this.fetchSavedAddress(this.props.docUsr.professionalUserId || this.props.docUsr.userId);
        this.fetchSavedContactDetails(this.props.docUsr.professionalUserId || this.props.docUsr.userId);
        this.Fetchprimaryphysician();
      // this.fetchSavedAddress();
    }
    if(prevProps.docUsr !== this.props.docUsr || prevProps.show != this.props.show) {
      this.professionalAddressRef?.current?.getByUserId(this.props.docUsr?.professionalUserId || this.props.docUsr?.userId);
    }

    if(prevState.speciality_Id !== this.state.speciality_Id){
      this.updateProCategories(updateProData)
    }
  }

  updateProCategories = (proCategories) =>{
    konsole.log("proUserIdddd",this.props.docUsr,proCategories,this.state.speciality_Id)
    
    const toUpdateServiceProvider = (proCategories || [])?.map((proCategory) => ({
      proUserId : proCategory?.proUserId || 0,
      proCatId: proCategory?.proCatId || 0,
      proSerDescId: proCategory?.proSerDescId || 1,
      proTypeId: proCategory?.proTypeId || 11,
    //   proSubTypeId: isNaN(parseInt(this.state.proSubTypeId)) ? null : parseInt(this.state.proSubTypeId),
      proSubTypeId : (this.state.speciality_Id !== undefined && this.state.speciality_Id !== null && this.state.speciality_Id !== "") ? this.state.speciality_Id : proCategories[0]?.proSubTypeId,
      userProId : proCategory?.userProId || null
    }));

    this.setState({mappingAndUserProffJsons : toUpdateServiceProvider})
    konsole.log("toUpdateServiceProviderSpecia",toUpdateServiceProvider)
  
  }

  Fetchprimaryphysician = () => {
    $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getPrimaryPhysician + this.props.UserDetail.userId,"",(response,error) => {
        // debugger
        if (response) {
          let tempprimary = response.data.data.physicians.filter( (v, j) => v.is_Primary_Care == false);
          let filterdata = tempprimary?.filter( (v) => v?.docMemberUserId == this.state?.docUserId);
          let spouseSamePrimaryData =filterdata[0].userPrimaryCareMaps.length > 0 && this.state.spouseUserId !== null ? filterdata[0].userPrimaryCareMaps.filter((item) => item.userId === this.state.spouseUserId): [];
          konsole.log("spouseSamePrimaryData",spouseSamePrimaryData)

          let isSamePrimary = spouseSamePrimaryData.length > 0 ? true : false;
          this.setState({
            ...this.state,
            Specialists: tempprimary,
            // speciality_Id: this.props.docUsr ? this.props.docUsr.specialityId : 0,
            filterdataforupdate: filterdata,
            sameWithPrimary: isSamePrimary,
            spouseSamePrimaryData: spouseSamePrimaryData,
            speciality_Id: filterdata[0].speciality_Id,
            natureId: filterdata[0].primary_Care_Id
          });

          konsole.log("filterdatafilterdatafilterdatafilterdata",speciality_Id, filterdata, response);
          
        }else{
          konsole.log("eroorr",error)
          this.setState({disable:false})
        }
      }
    );
  };

  // FetchSpecalistType = (proCategories) => {
  //   this.props.dispatchloader(true);
  //   $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSpecialistType, "", (response) => {
  //     this.props.dispatchloader(false);
  //     if (response) {
  //       const sortArray = response.data.data.sort((a, b) => {
  //         if (a.label === "Other") return 1; // Move "Other" value to the end
  //         if (b.label === "Other") return -1; // Move "Other" value to the end
  //         return a.label.toLowerCase().localeCompare(b.label.toLowerCase()); // Sort by label name
  //       });
  //       konsole.log("specialtist primarycare", sortArray);
  //       // if(proCategories.length > 0){
  //       //  let filterSpecialistType = sortArray.filter(item => item.value == proCategories[0].proSubTypeId)
  //       //  konsole.log("filterSpecialistType",filterSpecialistType)
  //       //  this.setState({
  //       //   ...this.state,
  //       //   Specalisttypes: filterSpecialistType,
  //       // });
  //       // }else{
  //         this.setState({
  //           ...this.state,
  //           Specalisttypes: sortArray,
  //         });
  //       // }
  //     } else {
  //       this.toasterAlert(Msg.ErrorMsg, "Warning");
  //     }
  //   }
  //   );
  // };

  
  FetchSpecalistType = (proCategories) => {
    konsole.log("proCategories12121",proCategories)
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getProffesionalSubType + `?protypeId=${11}`, "",(response,error) => {
      this.props.dispatchloader(false);
      if (response) {
        const sortArray = response.data.data.sort((a, b) => {
          if (a.proSubType === "Other") return 1; // Move "Other" value to the end
          if (b.proSubType === "Other") return -1; // Move "Other" value to the end
          return a.proSubType.toLowerCase().localeCompare(b.proSubType.toLowerCase()); // Sort by label name
        });
        konsole.log("specialtist primarycare",response,sortArray);
        // if(proCategories.length > 0){
        //  let filterSpecialistType = sortArray.filter(item => item.value == proCategories[0].proSubTypeId)
        //  konsole.log("filterSpecialistType",filterSpecialistType)
        //  this.setState({
        //   ...this.state,
        //   Specalisttypes: filterSpecialistType,
        // });
        // }else{
          const subTypesData = sortArray.map((item) => ({
            value: item.proSubTypeId,
            label: item.proSubType
          }));
          this.setState({
            ...this.state,
            Specalisttypes: subTypesData,
          });
        // }
      } else {
        konsole.log("errorSub",error)
        this.setState({disable:false})
        this.toasterAlert(Msg.ErrorMsg, "Warning");
      }
    }
    );
  };

  getProfessSubtype = (checked,proTypeIds,data,update) =>{
    const protypeId = proTypeIds.value || proTypeIds
    const subTypeArray = []
    let subTypeObj = {}
    // const checked = event.target.checked
    konsole.log("protypeIdSubtype",protypeId,data,checked,this.state.professType)
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getProffesionalSubType + `?protypeId=${protypeId}`, "", (response,error) => {
      if (response) {
        const responseData = response.data.data;
        konsole.log("responseresposhdfjkdgsjfgdjsgfjsdgfsdgfjdshjnseSubbb",responseData)
        this.setState({Specalisttypes : responseData})  
      }else{
        konsole.log("subErorr",error)
        this.setState({disable:false})
      }
    });
  }

  // fetchSavedAddress = (userid) => {
  //   this.props.dispatchloader(true);
  //   userid = userid || this.state.docUserId;
  //   if(!userid) return;
  //   $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getAllAddress + userid,"",(response,error) => {
  //       this.props.dispatchloader(false);
  //       if (response) {
  //         let responseData=response.data.data
  //         console.log("jguiiih88888",response.data.data.addresses[0])
  //         this.setState({
  //           ...this.state,            
  //           addressData: response.data.data.addresses[0]
  //         });
  //         this.setState({
  //           ...this.state,
  //           getAddres: response.data.data.addresses
  //         })
  //         this.setState({
  //           ...this.state,
  //           newAddress: response.data.data.addresses[0]
  //         })
  //         this.setState({
  //           ...this.state,
  //           suite: response.data.data.addresses[0]?.addressLine2 || ""
  //         })
  //         let {city,zipcode,addressLine1,country,state}=responseData.addresses[0]
  //         let stateaddressforupdatingvalue={
  //           city:city,
  //           zipcode:zipcode,
  //           country:country,
  //           addressLine1:addressLine1,
  //           state:state,
  //         }
  //         this.setState({ addressforupdating: stateaddressforupdatingvalue });
  //         konsole.log("allAddress",this.state.allAddress)
  //       } else {
  //         konsole.log("getAllAddress",error)
  //       }
  //     }
  //   );
  // };

  fetchSavedContactDetails = (userid) => {
    konsole.log("useridwConsSpes",userid)
    this.props.dispatchloader(true);
    userid = userid || this.state.docUserId;
    if(!userid) return;
    $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getAllContactOtherPath + userid,"",(response) => {
        this.props.dispatchloader(false);
        if (response) {
          this.setState({
            ...this.state,
            allContactDetails: response.data.data.contact,
          });
          konsole.log("responseatsav", response);
        } else {
          // alert(Msg.ErrorMsg);
          this.setState({disable:false})
          this.toasterAlert(Msg.ErrorMsg, "Warning");
        }
      }
    );
  };

  handleshowAddress = () => {
    this.setState({showAddress: !this.state.showAddress});
    konsole.log("AddressDisplay", this.state.showAddress);
    // this.fetchSavedAddress();
  };

  handleshowContact = () => {
    this.setState({showContact: !this.state.showContact});
  };

  InvokeEditAddress = (val) => {
    konsole.log("val", val);
    this.setState({ EditAddress: val});
    this.handleshowAddress();
  };

  validate = (state) => {
    let newError = "";

    if (state.speciality_Id == 0 && this.props.toUpdate == false) {
      newError = "Please Choose Speciality Type";
    }
    // ================= Don't remove these comments ========================
    // else if (state.lName == "") {
    //   newError = "Please enter the last Name";
    // }
    // =====================================================================
    else if (isNotValidNullUndefile(state.fName) == false) {
      newError = "Please enter the first Name";
    }
    // else if(this.professionalContactRef?.current?.checkvalidation(true)) return false;
    // ================= Don't remove these comments ========================
    // else if (this.professionalAddressRef?.current?.isEmpty()) {
    //   newError = "Address cannot be blank";
    // }
    // =====================================================================
    // if(this.state.emailData.length == 0 && this.state.mobileData.length==0){
    //   newError = "Contact cannot be blank";
    // }
    konsole.log("validation", state.speciality_Id, this.props.alreadySpecialist);
    if (newError) {
      // alert(newError)
      this.setState({disable : false,})
      this.toasterAlert(newError, "Warning");
      return false;
    }

    if(this.validateWebLink(this.state.websiteLink) != true) return false;

    return true;
  }

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
   
//   postAddressUser = (userId, adress, createdBy) => {
//     adress.addressLine2 = this.state.suite; // adding suite data
//     this.props.dispatchloader(true);
//     console.log("dklsjfld", userId, adress, createdBy)
//     $postServiceFn.postAddressByUserId(userId, adress, createdBy, (response,error) => {
//       this.props.dispatchloader(false);
//       if (response) {
//          konsole.log("postMemberAddress", response)
//       }else{
//         konsole.log("errorerrorerror",error)
//       }
//     });

//   }
//   updateAddress = (userID,json,addressId,createdBy) => {
//     // konsole.log("addressId",userID,json,addressId,createdBy)
//       json.addressLine2 = this.state.suite; // adding suite data
//       const addressPhysical = this.state.getAddres.filter(item => { return item.addressTypeId == 1 });
//       const isActive = false 
//       konsole.log("addressId",this.state.getAddres)

//       this.props.dispatchloader(true);
//       if (addressPhysical.length > 0){
//         this.props.dispatchloader(true);
//         $postServiceFn.putMemberAddressData(userID,json,addressId,createdBy, (response) => {
//             this.props.dispatchloader(false);
//             if (response) {
//                 this.fetchSavedAddress(response?.data?.data?.userId)
//                 konsole.log("postMemberAddress", response)
//             } else {
//                 this.props.dispatchloader(false);
//             }
//         });
//     }
//  }

 selectSpecialityType = (event) =>{
  konsole.log("evenySpeciality",event.value,event) 
  this.setState({speciality_Id : event.value,specialityType : event.label,showOtherField : event.value == 999999 ? true : false}) 
 }

 
   

addSpecialist = () => {
  let inputdata = {
    proUserId: this.state.mappingAndUserProffJsons[0]?.proUserId || 0,
    userId: this.state.docUserId,
    isGenAuth: true,
    isStatus: true,
    isActive: true,
    upsertedBy: this.state.loggedInUser,
    proCategories: this.state.mappingAndUserProffJsons,
    businessName: $AHelper.capitalizeAllLetters(this.state.clinicname),
    websiteLink: this.state.websiteLink
  }
  konsole.log("this.state.mappingAndUserProffJsons",this.state.mappingAndUserProffJsons,JSON.stringify(inputdata))

  
  // console.log("mwffj",this.state.getAddres)
  // if(this.state.getAddres[0]?.addressId){
  //   this.updateAddress(this.props?.docUsr?.userId, this.state.newAddress, this.state.getAddres[0]?.addressId, this.props?.docUsr?.userId)
  // }else{
  //  this.postAddressUser(this.props?.docUsr?.userId,this.state.newAddress,this.props?.docUsr?.userId)
  // }  
  // this.handlePutName();
  if(this.validate(this.state)){
    this.props.dispatchloader(true);
    this.setState({disable:true})
    this.professionalContactRef?.current?.saveContactinfo(this.state.docUserId)
  // } else {
    // $CommonServiceFn.InvokeCommonApi( "POST", $Service_Url.postaddprofessionluserMappingPath, inputdata, (response,error) => {
      $CommonServiceFn.InvokeCommonApi( "POST", $Service_Url.postProfessionalUserMapping, inputdata, (response,error) => {
        konsole.log("Success resSpe" + JSON.stringify(response));
        this.props.dispatchloader(false);
        if (response) {
          let professUserId = response.data.data;
          konsole.log("professUserId12121",professUserId)

          const proCategoriesSubType = professUserId[0].proCategories.filter(({ proSubTypeId }, index) => (proSubTypeId === 999999));
          const proCatId = (proCategoriesSubType !== undefined && proCategoriesSubType.length > 0) ? proCategoriesSubType[0]?.proCatId : null
          konsole.log("proCategoriesSubType",proCategoriesSubType,this.props.alreadySpecialist,proCatId)
          let proCatIdToHandlePutName;

            if (proCategoriesSubType.length > 0) {
              this.professSubTypeRef.current.saveHandleOther(proCatId);
              if(this.props.alreadySpecialist == true){
                this.handlePutName(proCatId);
              }
            } else {
              proCatIdToHandlePutName = proCatId; 
            }

            if (this.props.alreadySpecialist !== true) {
              this.postProfessionalUser(professUserId);
            } else {
              if (proCatIdToHandlePutName !== undefined) {
                this.handlePutName(proCatIdToHandlePutName);
              }
            }

            if(this.props.alreadySpecialist == true){
              this.professionalAddressRef?.current?.upsertAddress(this.state?.docUserId, 1);
            //   this.updateAddress(this.state?.docUserId,this.state.newAddress,this.state.getAddres[0]?.addressId,this.state?.docUserId) 
            }

            konsole.log("vishnudb update cdn", this.props.addNewProff, this.state.spouseSamePrimaryData.length, (this.state.spouseSamePrimaryData.length ? true : false), this.state.sameWithPrimary, professUserId[0])
            if(this.props.addNewProff == "updateForUser" && ((this.state.spouseSamePrimaryData.length ? true : false) != this.state.sameWithPrimary)){
              konsole.log("vishnudb update cdn", this.state.sameWithPrimary, professUserId[0])
              if(this.state.sameWithPrimary == false){
                this.props.checkProffsameOrNot(true) 
              }
              else{
                this.props.mapForSpouse(professUserId[0]?.proUserId)
              }
            }
            // this.setState({disable:false})

        } else {
          konsole.log("errorAccount",error)
          this.toasterAlert(Msg.ErrorMsg, "Warning");
          this.setState({disable:false})
        }
      }
    );
}

  // if (this.state.updateCaregiverSuitabilty == true) {
  //   this.handleUpdateMetaDataSubmit();
  // } else {
  //   this.handleMetataDataSubmit();
  // }
};

postProfessionalUser = (userProffJson) =>{
  konsole.log("userProffJsonFinanAdvisor",userProffJson)
  let jsonArray = [
    {
      userProId: userProffJson[0]?.userProId || 0,
      proUserId: userProffJson[0]?.proUserId,
      proCatId: userProffJson[0]?.proCatId || userProffJson[0]?.proCategories[0]?.proCatId,
      userId: this.state.userId,
      lpoStatus: false,
      isActive: true,
      upsertedBy: this.state.loggedInUser
    }
  ]

  konsole.log("professionalUserId121212",JSON.stringify(jsonArray))
 
  $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postProfessionalUser,
  jsonArray, (response,error) => {
    this.props.dispatchloader(false);
      if(response){
          konsole.log("responseProfessional213", response);
          let proUserId = response.data.data[0].proUserId
          let proCatId = response.data.data[0].proCatId
          if(this.props.toUpdate !== true){
          this.handleSpecialistSubmit(proUserId,proCatId)
          }
          this.props.CallSearchApi(this.state.userId) 
         //  this.props.setproserprovider() 
      //    this.props.handleClose()
      }else{
          konsole.log("error1212",error)
          this.setState({disable:false})
      }
      })
   }

   toasterAlert(text, type) {
      this.context.setdata({ open: true, text: text, type: type });
    }

  handleSpecialistSubmit = async(proUserId,proCatId) => {
    this.setState({disable:true})
    konsole.log("proUserIdSubmit",proUserId)

    let isSameUnMappingSpecialist = false;
    let userDetailsInfo=this.props?.UserDetail?.physicians?.filter(item=>item.docMemberUserId===this.props?.docUsr?.professionalUserId)
    konsole.log("userDetailsInfoUpdate",userDetailsInfo,this.props?.UserDetail?.physicians)
    
    if(this.props.UserDetail.userId == this.state.spouseUserId && (userDetailsInfo && userDetailsInfo?.length !==0) &&  userDetailsInfo[0].userPrimaryCareMaps.length == 2 && this.props.alreadySpecialist == true ){
      isSameUnMappingSpecialist = true;
     let userPrimaryCareMapId= (userDetailsInfo && userDetailsInfo?.length !== 0) && userDetailsInfo[0].userPrimaryCareMaps.filter(item=>item.userId===this.state.spouseUserId)
      let userPostDataUnmapped = {
        userPrimaryCareMapId: userPrimaryCareMapId[0]?.userPrimaryCareMapId,
        isDeleted: true,
        updatedBy: this.state.loggedInUser
      }
      konsole.log("userPrimaryCareMapIduserPrimaryCareMapId",userPrimaryCareMapId)
      let userPostData = {
        "userId": this.state.spouseUserId,
        "userProId": this.props?.docUsr?.userProId,
        "deletedBy": this.state.loggedInUser
      }
      konsole.log("userPostDatauserPostDatauserPostData",JSON.stringify(userPostData)),JSON.stringify(userPostDataUnmapped)
        // konsole.log("userPostDatauserPostDatauserPostData",userDetailsInfo,userPrimaryCareMapId,userPostData)
      const apiUrlUnmapped = $Service_Url.mapUpdatePrimaryCare;
      const methodUnmapped = "PUT";

      const apiUrl = $Service_Url.deleteprofessionalUser;
      const method = "DELETE";
      let infores1=await $postServiceFn.unMappedInsDataofSpouse(methodUnmapped, apiUrlUnmapped, userPostDataUnmapped);
      // let infores=await $postServiceFn.deleteprofessionalMapedUser(method, apiUrl, userPostData);
      // konsole.log("inforesinfores",infores,infores1)
    }

    let physicianinput = {
      userId: this.props.UserDetail.userId,
      physician: {
        docMemberUserId: this.state.docUserId,
        doc_License: null,
        experience_yrs: null,
        is_Primary: false,
        is_GCM: this.state.is_GCM,
        // speciality_Id:this.state?.speciality_Id == 0 ? this.state?.filterdataforupdate[0]?.speciality_Id : this.state?.speciality_Id,
        other: null,
        is_Primary_Care: false,
        isProUserAdded : true,
        pro_User_Id: this.props.proCategories.length > 0 ? this.props.proCategories[0].proUserId : proUserId,
        happy_With_Service: this.state.happy_With_Service,
        visit_Duration: this.state.visit_Duration,
        isSameSpecialist:(this.state.sameWithPrimary !== undefined)?this.state.sameWithPrimary:false ,
        // "createdBy": this.state.loggedInUser,
      },
    }


   
    
    if(this.props.UserDetail.userId == this.state.spouseUserId && (userDetailsInfo && userDetailsInfo?.length !==0) &&  userDetailsInfo[0].userPrimaryCareMaps.length == 2 && this.props.alreadySpecialist == true ){
      let jsonobj = {subtenantId: this.state.subtenantId, fName: $AHelper.capitalizeAllLetters(this.state.fName),  mName: $AHelper.capitalizeAllLetters(this.state.mName),  lName: $AHelper.capitalizeAllLetters(this.state.lName),  nickName: $AHelper.capitalizeAllLetters(this.state.nickName),  createdBy: this.state.loggedInUser}
      konsole.log("jsonobjaddmemberprimarycarephycians",jsonobj)
      let loginuserid=sessionStorage.getItem('loggedUserId')
      this.props.dispatchloader(true)
      let infoaddmembver=await $postServiceFn.addmemberprimarycarephycians("POST",$Service_Url.postAddMember,jsonobj)
     

      let jsonforaddaddress= {
        "userId": infoaddmembver.data?.data?.member?.userId,
        "address": {
          "addressLine1": this.state.addressforupdating?.addressLine1,
          "zipcode":this.state.addressforupdating?.zipcode,
          "city": this.state.addressforupdating?.city,
          "state":this.state.addressforupdating?.state,
          "country":this.state.addressforupdating?.country,
          "addressTypeId": 1,
          "createdBy": loginuserid
        }
         }
         konsole.log("jsonforaddaddress",jsonforaddaddress)
   let infoaddmembveraddress=await $postServiceFn.addmemberprimarycarephycians("POST",$Service_Url.postAddAddress,jsonforaddaddress)
   this.props.dispatchloader(false)
   konsole.log("infoaddmembveraddressinfoaddmembveraddress",infoaddmembveraddress)
     //  this.props.dispatchloader(false)
      konsole.log("jsonobjaddmemberprimarycarephycians",infoaddmembver)
      physicianinput.physician["docMemberUserId"] = infoaddmembver.data?.data?.member?.userId;
      physicianinput.physician["createdBy"] = this.state.loggedInUser;
      physicianinput.physician["isSameSpecialist"] = false;
    }else{
    if(this.props.alreadySpecialist == true){
      physicianinput.physician["primary_Care_Id"] = this.state.filterdataforupdate[0]?.primary_Care_Id;
      physicianinput.physician["updatedBy"] = this.state.loggedInUser;
      physicianinput.physician["doc_User_Id"] = this.state.filterdataforupdate[0]?.doc_User_Id
      physicianinput.physician["docMemberUserId"] = this.state.docUserId;
    }else{
      physicianinput.physician["createdBy"] = this.state.loggedInUser;
      physicianinput.physician["docMemberUserId"] = this.state.docUserId;
    }}

    konsole.log("validate", this.validate(this.state));
    if (this.validate(this.state)) {
      // if(this.props.alreadySpecialist == true && isSameUnMappingSpecialist === false){
        
      //   this.updateAddress(this.state?.docUserId,this.state.newAddress,this.state.getAddres[0]?.addressId,this.state?.docUserId) 

      // }else if(isSameUnMappingSpecialist === false){ 
      //   this.postAddressUser(this?.state?.docUserId,this.state.newAddress,this?.state?.docUserId)
      // }
      this.professionalAddressRef?.current?.upsertAddress(this.state?.docUserId, 1);
      console.log("postDataPrimarySubmit", JSON.stringify(physicianinput));
      let url = (this.props.alreadySpecialist == true) ? $Service_Url.putPrimaryCarePhysicianPath : $Service_Url.postAddPhysician;
      let method = (this.props.alreadySpecialist == true) ? "PUT" : "POST";
      
     if(this.props.UserDetail.userId == this.state.spouseUserId && (userDetailsInfo && userDetailsInfo?.length !==0) &&  userDetailsInfo[0].userPrimaryCareMaps.length == 2 && this.props.alreadySpecialist == true ){
      method="POST"
      url=$Service_Url.postAddPhysician;
    }

      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi(method,url,physicianinput,async (response,error) => {
          this.props.dispatchloader(false);
          if (response) {
            let responseData = response.data.data;
             konsole.log("response data",JSON.stringify(responseData));

           const responsePrimary = response.data.data;
          //  this.setState({disable:false})
            if (method == "POST") {
              const method = "POST";
              const apiUrl = $Service_Url.mapPrimaryCare;
              const userPostData = {
                userId: responsePrimary.userId,
                primaryCareId: responsePrimary?.physicians[0]?.primary_Care_Id,
                // sameInsUserId: null,
                sameAsUserId:null,
                createdBy: this.state.loggedInUser,
              };
              
           this.props.dispatchloader(true);
              await $postServiceFn.mapDataWithPrimaryUser(method,apiUrl,userPostData);
              this.props.dispatchloader(false);
            }
            konsole.log("userPostDatauserPostData2",this.state.spouseUserId,this.state.sameWithPrimary)
            if (this.state.spouseUserId !== null && this.state.sameWithPrimary !== undefined ) {
              konsole.log("userPostDatauserPostData3")
              let method = "POST";
              let apiUrl = $Service_Url.mapPrimaryCare;
              let userPostData = {};
              const loggedInUser = this.state.loggedInUser;
              const spouseSameInsuranceData = this.state.spouseSamePrimaryData;
              konsole.log("spousedatadasdsfdsagfsdgdf",spouseSameInsuranceData);

              const sameWithPrimary = this.state.sameWithPrimary;
              konsole.log("userPostDatauserPostDatauserPostDatauserPostDatauserPostDatauserPostData1",userPostData,spouseSameInsuranceData.length,sameWithPrimary,spouseSameInsuranceData?.length)
              if (spouseSameInsuranceData?.length > 0 && sameWithPrimary == false) {
                method = "PUT";
                apiUrl = $Service_Url.mapUpdatePrimaryCare;
                const userPrimaryCareMapId = spouseSameInsuranceData[0].userPrimaryCareMapId;
                userPostData = {
                  userPrimaryCareMapId: userPrimaryCareMapId,
                  isDeleted: true,
                  updatedBy: loggedInUser
                }
                konsole.log("userPostData",userPostData)
              }
                else if (spouseSameInsuranceData?.length == 0  && sameWithPrimary == true) {
                userPostData = {
                  userId: this.state.spouseUserId,
                  primaryCareId:responsePrimary?.physicians[0]?.primary_Care_Id,
                  // sameInsUserId: responsePrimary.userId,
                  sameAsUserId: responsePrimary.userId,
                  createdBy: this.state.loggedInUser,
                };
              }

              this.props.dispatchloader(true);
              konsole.log("userPostDatauserPostDatauserPostDatauserPostDatauserPostDatauserPostData",JSON.stringify(userPostData))
              const resposneHealthData = await $postServiceFn.mapInsuranceWithSpouseUser(method, apiUrl, spouseSameInsuranceData, this.state.sameWithPrimary, userPostData);
              konsole.log("resposneHealthDataresposneHealthData",resposneHealthData)
              this.props.dispatchloader(false);
            }
            

            if(this.props.UserDetail.userId == this.state.spouseUserId && (userDetailsInfo && userDetailsInfo?.length !==0) &&  userDetailsInfo[0].userPrimaryCareMaps.length == 2 && this.props.alreadySpecialist == true ){
              // let result=await  this.specalistRef.current.saveHandlerOtherOnlypost(responseData.physicians[0].primary_Care_Id);
              let result=await  this.professSubTypeRef.current.saveHandlerOtherOnlypost(proCatId);
              konsole.log("resultresult",result)
              this.Fetchprimaryphysician();
              this.props.CallSearchApi(this.state.userId);
              this.props.setSpecialist();
              return;
            }else{
            this.handlePutName(proCatId);  
            }
          } else {
            konsole.log("errorSpee",error)
            this.toasterAlert(Msg.ErrorMsg, "Warning");
            this.setState({disable:false})
          }
        }
      );
    }
  }
  
  handlePutName = (primary_Care_Id) => {
    let physicianInfo = {
      userId: this.state.docUserId,
      fName: $AHelper.capitalizeAllLetters(this.state.fName),
      mName: $AHelper.capitalizeAllLetters(this.state.mName),
      lName: $AHelper.capitalizeAllLetters(this.state.lName),
      nickName: this.state.nickName,
      updatedBy: this.state.loggedInUser,
      subtenantId : sessionStorage.getItem('SubtenantId')
    };

    konsole.log("postData", JSON.stringify(physicianInfo)); 

    this.props.dispatchloader(true);
    let messageForSaving=(this.props.alreadySpecialist==true)?'Specialist updated successfully':'Specialist saved successfully'
    AlertToaster.success(messageForSaving);

    $postServiceFn.putUserInfo(physicianInfo, (res) => {
      this.props.dispatchloader(false);
     
      let spouseUserId;
      const sameWithPrimary = this.state.sameWithPrimary;
      if (this.state.spouseSamePrimaryData?.length == 0  && sameWithPrimary == true) {
        spouseUserId = this.state.spouseUserId;
      }
      konsole.log("spouseUserIdaaa",spouseUserId)
      if (this.state.speciality_Id == "999999") { 
        // this.specalistRef.current.saveHandleOther(primary_Care_Id,spouseUserId);
        this.professSubTypeRef.current.saveHandleOther(primary_Care_Id,spouseUserId);
      }
      //  else {
      // }
      // window.location.reload();
      this.props.handleClose();
      this.setState({disable:false})
      this.Fetchprimaryphysician();
      this.props.CallSearchApi(this.props.UserDetail.userId);
      this.props.setSpecialist();
      // callback(true);
    });
  };

  handleClose = () => {
    this.setState({show: !this.state.show});
  };
  handleShow = () => {
    this.setState({show: !this.state.show});
  };
  handleChange = (event) => {
    const eventId = event.target.id;
    const eventValue = event.target.value;

    konsole.log("eventValue", eventValue);

    if (eventId == "fName" ||eventId == "lName" || eventId == "nickName" ||eventId == "mName" || eventId == "birthPlace" || eventId == "clinicname") {
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
    } else {
      this.setState({
        ...this.state,
        [eventId]: eventValue,
      });
    }
  };

  // handleDeleteAddress = (userid, addressid) => {
  //   userid = userid || this.state.docUserId;
  //   // let ques = confirm("Are you sure? You want to delete your address.")
  //   // userid = userid || this.state.userId;
  //   if (ques) {
  //     this.props.dispatchloader(true);
  //     $CommonServiceFn.InvokeCommonApi("DELETE",$Service_Url.deleteAddress + userid + "/" + addressid + "/" + this.state.loggedInUser,"",(response,error) => {
  //         this.props.dispatchloader(false);
  //         if (response) {
  //           konsole.log("errorerror",response)
  //           this.fetchSavedAddress(userid);
  //         } else {
  //           konsole.log("errorerror",error)
  //           this.toasterAlert(Msg.ErrorMsg, "Warning");
  //         }
  //       }
  //     );
  //   }
  // };

  handleDeleteContact = async (userid, contactId) => {
    userid = userid || this.state.docUserId;
    let ques = await this.context.confirm(true, "Are you sure? You want to delete your Contact.","Confirmation");
    if (ques) {
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("DELETE",$Service_Url.deleteContactPath + userid + "/" + contactId,"",(response,error) => {
          this.props.dispatchloader(false);
          if (response) {
            konsole.log("deleteContactPathresponse",response)
            this.fetchSavedContactDetails(userid);
          } else {
            konsole.log("deleteContactPathresponse",error)
            this.toasterAlert(Msg.ErrorMsg, "Warning");
          }
        }
      );
    }
  };

  InvokeEditContactID = (contactTypeId, EditContactType) => {
    this.setState({
      EditContactType: EditContactType,
      EditContactId: contactTypeId,
    });

    this.handleshowContact();
  };

  handleFocusOut = () => {
    let attrvalue = this.state.mName;
    if (attrvalue.length !== 0) {
      if (attrvalue.length === 1) {
        attrvalue = attrvalue + ".";
      }
    }
    this.setState({mName: attrvalue});
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

  addressDetails = (attrvalue) => {
    konsole.log("attrvalueattrvalue", attrvalue)
    // let {city,country,state,zip,addressLine1}=attrvalue
    this.setState({
      newAddress: attrvalue || [],
    });
    this.setState({
      addressData: attrvalue || [],
    });
    let stateaddressforupdatingvalue={
      city: attrvalue?.city || "",
      zipcode: attrvalue?.zip || "",
      country: attrvalue?.country || "",
      addressLine1: attrvalue?.addressLine1 || "",
      state: attrvalue?.state || "",
    }
    this.setState({ addressforupdating: stateaddressforupdatingvalue });
  };
  contactDetails = (mobile, email) => {
    konsole.log("attrvalueattrvalue", mobile, email);
    this.setState({
      mobileData: mobile,
      emailData: email,
    });
  };

  render() {

    // const tooltip = (
    //   <Tooltip id="toolTip-disabeld">{(this.state.speciality_Id !== 0) && specialiststypeget}</Tooltip>
    // );
    
    let spouseUserId=sessionStorage.getItem("spouseUserId")
    konsole.log("propspropspropspropspropsprops",this.props,this.props.UserDetail)
    let userDetailsInfo=this.props?.UserDetail?.physicians?.filter(item=>item.docMemberUserId===this.props?.docUsr?.userId)

    // konsole.log("userDetailsInfo",(userDetailsInfo?.length !== 0) && userDetailsInfo[0]?.userPrimaryCareMaps?.filter(item=>item.userId===spouseUserId))
    konsole.log("thispropsthis",this.props,this.state.allContactDetails)
    konsole.log("propspropsporps",this.props?.UserDetail,this.props?.docUsr)
    konsole.log("propspropsporpspropspropsporps",this.props?.docUsr,this.props.alreadySpecialist)
    const primaryUserId = sessionStorage.getItem("SessPrimaryUserId");

    console.log("Specalisttypes",this.state)
    konsole.log("SpecialistsSpecialists",this.state.mappingAndUserProffJsons)
    konsole.log("propspropspropsprops",this.props,this.state.filterdataforupdate)
    let filterdata=this.props.proCategories 
    let specialiststypeget = {}
    if (filterdata?.length > 0) {
      let valuel= (this.state.speciality_Id !== undefined && this.state.speciality_Id !== null && this.state.speciality_Id !== "") ? this.state.speciality_Id : filterdata[0]?.proSubTypeId
      let labelv= (this.state.specialityType !== undefined && this.state.specialityType !== null && this.state.specialityType !== "") ? this.state.specialityType : filterdata[0]?.proSubType
      konsole.log("defaultValue",valuel,labelv)
      specialiststypeget = { value:valuel, label:labelv }
    }else{
      specialiststypeget = { value: this.state.speciality_Id, label:this.state.specialityType }
      konsole.log('specialiststypegetspecialiststypeget',specialiststypeget)
    }

// specialiststypeget=(this.state.speciality_Id !== 0) ? this.state.Specalisttypes.filter((v)=>Number(v.value) == Number(this.state.speciality_Id) ):specialiststypegetdata
konsole.log("specialiststypeget",this.state.speciality_Id,this.state.showOtherField)

    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            max-width: 50.563rem;
            margin: 1.75rem auto;
          }
        `}</style>
        {
          // <a onClick={this.handleShow}><img src="/icons/add-icon.svg" alt="Health Insurance" /></a>
        }

        {/* <Modal
          show={this.props.show}
          centered
          onHide={this.props.setSpecialist}
          animation="false"
          backdrop="static"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title> */}
            <div className='mx-2 fs-5 fw-bold'>
              Health Specialist -{" "}
              {this.props.UserDetail.fName +
                " " +
                (this.props.UserDetail.mName !== null
                  ? this.props.UserDetail.mName
                  : "") +
                " " +
                this.props.UserDetail.lName}
                </div>
            {/* </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-3 pt-4"> */}
            <Row className="mb-2 mt-2">
              <div title= {specialiststypeget?.label} className=''>
              <Col xs = "12" lg="12" sm="12" className="">
                <Select
                  defaultValue={28}
                  onChange={(event)=>this.selectSpecialityType(event)}
                  className="w-100 custom-select"
                  options={this.state.Specalisttypes}
                  placeholder={$AHelper.mandatory("Speciality")}
                  value={(this.state.speciality_Id !== 0) && specialiststypeget} 
                />
              </Col>
              </div>  
              {(this.state.speciality_Id == "999999" || this.state.showOtherField == true) && (
                <Col xs = "12" lg="12" sm="12" className="mt-2">
                  <Other  
                  othersCategoryId={28} 
                  userId={this.state.docUserId} 
                  dropValue={this.state.speciality_Id}  
                  // ref={this.specalistRef}                
                  ref={this.professSubTypeRef}
                  natureId={this.props.proCategories.length > 0 && this.props.proCategories[0]?.proCatId}
                  showOtherField = {this.state.showOtherField}
                  />
                </Col>
              )}
            </Row>
            <Row className=" mb-2 mt-2">
              <Col xs="12" sm="6" lg="6" className='mb-2'>
                <Form.Control
                  className='upperCasing'
                  type="text"
                  value={this.state.fName}
                  placeholder={$AHelper.mandatory("First Name")}
                  id="fName"
                  onChange={(event) => {
                    this.handleChange(event);
                  }}
                />
              </Col>
          {/* <Col xs="12" sm="12" lg="6" className="margintop-clas">
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
            {/* </Row>
        <Row className="ms-10px mb-2 mt-2"> */}
            <Col xs="12" sm="6" lg="6" className='mb-2'>
                <Form.Control
                className='upperCasing'
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
              {/* <Col xs="12" sm="6" lg="4" className='mb-2'>
                <Form.Control
                  value={$AHelper.capitalizeAllLetters(this.state.nickName)}
                  placeholder="Nickname"
                  id="nickName"
                  onChange={(event) => {
                    this.handleChange(event);
                  }}
                  type="text"
                />
              </Col> */}

              
            {/* </Row>
            <Row className="mt-2"> */}
                  <Col xs="12" sm="6" lg="6" className='mb-2'>
                      <Form.Control
                        className='upperCasing'
                        value={this.state.clinicname}
                        placeholder="Clinic name"
                        id="clinicname"
                        onChange={(event) => {
                          this.handleChange(event);
                        }}
                        type="text"
                      />
                  </Col>
                  <Col xs="12" sm="6" lg="6" className='mb-2'>
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
            <Row className="mx-2 my-3">
              <Col xs sm="12" lg="12" className='border p-2 rounded'>
                <Row className="">
                  <Col xs="12" sm="6" md="4" className="mt-0 mb-2" style={{fontSize: "1.15rem", fontWeight: "400", lineHeight: "1.5"}}>
                    Address
                  </Col>
                </Row>
                <DynamicAddressForm ref={this.professionalAddressRef} setLoader={this.props.dispatchloader}/>
              </Col>
            </Row>

        <Row className="mx-2 my-3">
          {/* <Col xs="12" sm="12" lg="12" className=''> */}
            {/* <ContactListComponent userId={this.state.docUserId} contactDetails={this.contactDetails} key={this.state.docUserId}/> */}
            <ProfessionalContact  userId={this.state.docUserId}  ref={this.professionalContactRef} key = {this.state.docUserId} />
              {/* </Col> */}
            </Row>
            {/* <AddressListComponent userId={this.state.docUserId}  addressDetails={this.addressDetails}  /> */}
            
            {/* <Row className="m-0 mb-4">
              <Col xs md="4" className="d-flex align-items-center ps-0">
                <button className="white-btn" onClick={() => this.InvokeEditContactID("", "")}>{$AHelper.mandatory("Contact")}</button>
                {
                  this.state.showContact ?
                    <Contact
                      fetchprntSavedContactDetails={this.fetchSavedContactDetails}
                      userId={this.state.docUserId}
                      handleshowContact={this.handleshowContact}
                      showContact={this.state.showContact}
                      allContactDetails={this.state.allContactDetails} EditContactId={this.state.EditContactId} EditContactType={this.state.EditContactType}
                    />
                    : ""
                }
              </Col>
            </Row>
            <Row className="m-0 mb-3">
              {this.state.allContactDetails && this.state.allContactDetails.mobiles && this.state.allContactDetails.mobiles.map((val, id) => {
                return (
                  <Col xs md="4" className="d-flex align-items-center" >
                    <InputGroup className="mb-3 rounded">
                      <InputGroup.Text className='bg-secondary' onClick={() => this.InvokeEditContactID(val, "mobile")}><img src="icons/mob-icon.svg" alt="" /></InputGroup.Text>
                      <div className="form-control">
                        <p className='' key={val.id}>{val.mobileNo?.slice(0,-10)} {$AHelper.formatPhoneNumber(val.mobileNo?.slice(-10))}</p></div>
                      {
                        val.contactTypeId !== 1 &&
                        <InputGroup.Text className='bg-secondary' onClick={() => this.handleDeleteContact(this.state.docUserId, val.contactId)}><img className="" src="icons/BinIcon.svg" alt="Add Address" /> </InputGroup.Text>
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
                        <InputGroup.Text className='bg-secondary' onClick={() => this.handleDeleteContact(this.state.docUserId, val.contactId)}><img className="" src="icons/BinIcon.svg" alt="Add Address" /> </InputGroup.Text>
                      }
                    </InputGroup>
                  </Col>
                );
              })}
            </Row> */}
            {/* <Row className="m-0 mb-5">
              <Col xs md="10" className="d-flex align-items-center ps-0">
                <p>Add More Specialist </p><a><img className="ms-4" src="/icons/add-icon.svg" alt="Health Insurance" /></a>
              </Col>
            </Row> */}
            {this.state.spouseUserId !== "null" &&
              this.props.UserDetail.userId == primaryUserId && (
              <Row className="mx-2 m-0 mb-3 border pb-2 pt-1">
                  <Col xs sm="10" lg="9" id="healthInsurance1">
                    <label className="mb-1">
                      {`Does your ${this.state.maritalStatusId == 2 ? "partner" :" spouse"} use the same Specialist?`}{" "}
                    </label>
                    <div className="d-flex flex-wrap justify-content-start align-items-center">
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
            <Row >
              <Col
                xs
                md="12"
                className="d-flex align-items-center"
              >
                <Button
                style={{backgroundColor:"#76272b", border:"none"}}
                  className="theme-btn"
                  onClick={this.addSpecialist}

                  disabled={this.state.disable == true ? true : false}
                >
                  {this.props.alreadySpecialist == true ? "Update" : "Save"}
                </Button>
              </Col>
            </Row>
{/*             
            {this.state.Specialists.length > 0 && (
            {this.state.Specialists.length > 0 &&
              this.state.Specialists.map((specalist, index) => {
                console.log("specalistspecalist", specalist);
                return (
                  <Row className="m-0 mb-3" key={index}>
                    <Col
                      xs
                      md="12"
                      className="d-flex align-items-center flex-column  p-0"
                    >
                      <div className="data-row w-100 d-flex align-items-center justify-content-start mb-3">
                        <Col xs md="4" className="vline p-3">{specalist.f_Name + " " + specalist.m_Name + " " + specalist.l_Name + " " } </Col>
                        <Col xs md="4" className="vline p-3">Specalist : 
                        <OtherInfo othersCategoryId={28} othersMapNatureId={specalist?.primary_Care_Id} FieldName={specalist.speciality_Name} userId={this.props?.UserDetail?.userId} />
                          </Col>
                        <Col xs md="4" className="p-3">Experience  : {specalist.experience_yrs}</Col>
                      </div>
                    </Col>
                  </Row>
                )
              }
              )
            )} */}
          {/* </Modal.Body>
        </Modal> */}
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(specialists);
