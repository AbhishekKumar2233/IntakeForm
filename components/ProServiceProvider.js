import React, { Component } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, InputGroup,Accordion } from 'react-bootstrap';
import Select from 'react-select';
import Address from './address';
import Contact from './contact';
import { $CommonServiceFn, $postServiceFn } from './network/Service';
import { $Service_Url } from './network/UrlPath';
import { $AHelper } from '../components/control/AHelper';
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { Msg } from './control/Msg';
import konsole from './control/Konsole';
import Other from './asssets/Other';
// import AddressListComponent from './addressListComponent';
import {globalContext} from "../pages/_app";
import ContactListComponent from './ContactListComponent';
// import PlaceOfBirth from './PlaceOfBirth';
import ProfessionalContact from './ProfessionalContact';
import ProfessServices from './ProfessServices';
import { accountantMoreinfo, financialAdvisorMoreInfo } from './control/Constant';
import DynamicAddressForm from "./DynamicAddressForm";
import { isNotValidNullUndefile, isUrlValid, removeSpaceAtStart } from './Reusable/ReusableCom';

export class ProServiceProvider extends Component {
  static contextType = globalContext
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      userId: "",
      // professTypeId: this.props?.proCategories.length > 0,
      loggedInUser: '',
      showAddress: false,
      showContact: false,
      professType: [],
      docUserId: (this.props.docUsr) ? this.props.docUsr?.professionalUserId || this.props.docUsr?.userId : "",
      fName: (this.props.docUsr) ? this.props.docUsr.fName : "",
      mName: (this.props.docUsr) ? this.props.docUsr.mName : "",
      lName: (this.props.docUsr) ? this.props.docUsr.lName : "",
      professTypeId: (this.props.proCategories.length > 0) ? this.props.proCategories[0].proTypeId : "",
      natureId: (this.props.docUsr) ? this.props.docUsr.proUserId : "",   
      addressData: [],
      emailData: [],
      mobileData: [],
      allAddress: [],
      allAddres: [],
      birthPlace: "",
      getAddres: [],
      newAddress:[],
      checksOfProSerDesc: [],
      // professType : [],
      imageClicked : "",
      selectedImages: [],
      iseditprofile : false,
      familyButtonborder : 1,
      professSubType : [],
      isHovered : false,
      hoveredProSerDesc : "",
      maritalStatusId:"",
      selectedServices : false,
      checkProType : false,
      primaryUserId : "",
      addressLine2 :null,
      sameWithPrimary: this.props.checkSameProff !== undefined ? this.props.checkSameProff : false,
      spouseId : "",
      userSubjectDataIdOfFinanAdv : "",
      userSubjectDataIdOfAccountant : "",
      userSubjectDataIdOfBookkeeper : "", 
      checkIdontHaveAccountant : "",
      iDontHaveAcccountantQuestionId : null,
      checkIdontHaveFinanAdvisor : "",
      iDontHaveFinanAdvisorQuestionId : null,
      checkIdontHaveBookkeeper : "",
      iDontHaveBookkeeperQuestionId : null,
      businessName : "",
      businessTypeId : this.props.docUsr?.businessTypeId ? this.props.docUsr?.businessTypeId : "",
      businessTypes: [],
      websiteLink : this.props.docUsr?.websiteLink ? this.props.docUsr?.websiteLink : "",
    };

    this.professTypeRef = React.createRef();
    this.professSubTypeRef = React.createRef();
    this.professionalContactRef = React.createRef();
    this.professionalAddressRef = React.createRef();
    this.businessOther = React.createRef();
  }

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let maritalStatusId = sessionStorage.getItem("maritalStatusId");
    let loggedInUser = sessionStorage.getItem('loggedUserId');
    let spouseUserId = sessionStorage.getItem('spouseUserId') || "";

    this.setState({
      maritalStatusId: maritalStatusId,
      userId: this.props.activeUser == "2" ? spouseUserId : newuserid,
      loggedInUser: loggedInUser,
      primaryUserId : newuserid,
      spouseId : spouseUserId,
      businessName: this.props.docUsr?.businessName ? this.props.docUsr?.businessName : "",
      businessTypeId : this.props.docUsr?.businessTypeId ? this.props.docUsr?.businessTypeId : "",
      websiteLink : this.props.docUsr?.websiteLink ? this.props.docUsr?.websiteLink : "",
    })
      // this.fetchProfessType();
      // this.professSerChecks();
      this.fetchBussinessType();
      this.fetchSavedContactDetails(this.props.docUsr?.professionalUserId || this.props.docUsr?.userId)
      // this.fetchSavedAddress(this.props.docUsr?.professionalUserId || this.props.docUsr?.userId)
      this.professionalAddressRef?.current?.getByUserId(this.props.docUsr?.professionalUserId || this.props.docUsr?.userId);
      this.getsubjectForFormLabelIdForAccountant(newuserid)
      this.getsubjectForFormLabelIdForFinancialAdvisor(newuserid)
      this.getSubjectResponseForBookkeeper(newuserid);

      konsole.log("docUsrpropAdddMount",this.props,JSON.stringify(this.props.proCategories),this.props.checkSameProff,this.props.restrictAddProfessional,this.props.iDontHaveAcccountantQuestionId)
      if(this.props?.proCategories?.length > 0){
        this.updateProCategories(this.props?.proCategories,this.state.checksOfProSerDesc)
        const uniqueProSerDescIds = new Set(this.props?.proCategories.map(item => item.proSerDescId));
        const uniqueProSerDescIdArray = Array.from(uniqueProSerDescIds);

        // const uniqueProTypeIds = new Set(this.props?.proCategories.map(item => item.proTypeId));
        // const uniqueProTypeIdArray = Array.from(uniqueProTypeIds);
        konsole.log("uniqueProSerDescIdArray",uniqueProSerDescIdArray)

        for(let i = 0; i < uniqueProSerDescIdArray?.length; i++){
          this.fetchProfessType(null,uniqueProSerDescIdArray[i],this.props?.proCategories,this.props.addNewProff)
        }
        // this.getProfessSubtype(null,uniqueProTypeIdArray[i],this.props?.proCategories,this.props.addNewProff)
  }
  }

  componentDidUpdate(prevProps, prevState) {
    konsole.log("porpssss", this.props)
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let spouseUserId = sessionStorage.getItem('spouseUserId') || "";
  
    const {
      docUsr,
      proCategories,
      addNewProff,
      activeUser,
    } = this.props;
    

    konsole.log("previousUser", prevProps.docUsr, docUsr)

    if (JSON.stringify(prevProps.docUsr) !== JSON.stringify(docUsr)) {
      this.updateProCategories(proCategories, this.state.checksOfProSerDesc);
      const uniqueProSerDescIds = new Set(proCategories.map(item => item.proSerDescId));
      const uniqueProSerDescIdArray = Array.from(uniqueProSerDescIds);
  
      konsole.log("docUsrpropUpdate", this.props.checkSameProff,this.props.restrictAddProfessional,this.props.iDontHaveAcccountantQuestionId);
      this.setState(
        {
          docUserId: docUsr ? docUsr.professionalUserId || docUsr.userId : "",
          fName: docUsr ? docUsr.fName : "",
          mName: docUsr ? docUsr.mName : "",
          lName: docUsr ? docUsr.lName : "",
          professTypeId: docUsr ? docUsr.professTypeId : "",
          natureId: docUsr ? docUsr.proUserId : "",
          userId: activeUser === "2" ? spouseUserId : newuserid,
          sameWithPrimary : this.props.checkSameProff !== undefined ? this.props.checkSameProff : false,  
          professType: [],
          professSubType: [],
          businessName: docUsr?.businessName ? docUsr?.businessName : "",
          businessTypeId : docUsr?.businessTypeId ? docUsr?.businessTypeId : "",
          websiteLink : docUsr?.websiteLink ? docUsr?.websiteLink : "",
        },
        () => {
          konsole.log("dshgsd", this.state.professType)
          uniqueProSerDescIdArray.forEach(proSerDescId => {
            this.fetchProfessType(null, proSerDescId, proCategories, addNewProff);
          });
        }
      );
  
      // this.fetchSavedAddress(docUsr?.professionalUserId || docUsr?.userId);
      this.professionalAddressRef?.current?.getByUserId(docUsr?.professionalUserId || docUsr?.userId);
      this.fetchSavedContactDetails(docUsr?.professionalUserId || docUsr?.userId);
    }
  
    if (prevState.userId !== (activeUser === "2" ? spouseUserId : newuserid)) {
      this.setState({ userId: activeUser === "2" ? spouseUserId : newuserid });
    }
  }
  

  getMappedServiceArr = (data) =>{
    konsole.log("dtattadfadhasahjs",data)
    this.setState({checksOfProSerDesc : data})
  }

  updateProCategories = (proCategories,checksOfProSerDescData) =>{
    const checksOfProSerDesc = checksOfProSerDescData
    konsole.log("proUserIdddd",proCategories,checksOfProSerDesc)
    // const toUpdateServiceProvider = (proCategories || [])?.map((proCategory) => ({
    //   value: parseInt(proCategory.proTypeId),
    //   label: proCategory.proType,
    //   proSerDescId: parseInt(proCategory.proSerDescId),
    //   userProId : parseInt(proCategory.userProId) || null,
    //   proCatId : parseInt(proCategory.proCatId),
    //   proUserId : proCategory.proUserId,
    //   checked :  true,
    //   isActive : true,
    // }));

    for (let i = 0; i < checksOfProSerDesc.length; i++) {
      const matchingItem = proCategories?.find(item => item.proSerDescId == checksOfProSerDesc[i].value);
      konsole.log("matchingItem",matchingItem,proCategories)
      if (matchingItem) {
        checksOfProSerDesc[i].checked = true;
      }else{
        checksOfProSerDesc[i].checked = false;
      }
    }
    // konsole.log("checksOfProSerDesc[i]",checksOfProSerDesc,proCategories,toUpdateServiceProvider)

    this.setState({ checksOfProSerDesc : checksOfProSerDesc })
  }

  handleChange = (event) => {
    const eventId = event.target.id;
    const eventValue = event.target.value;

    // konsole.log("eventId", eventId);
    // konsole.log('eventValue', eventValue);

    if (
      eventId == "fName" ||
      eventId == "lName" ||
      eventId == "nickName" ||
      eventId == "mName" ||
      eventId == "businessName" || 
      eventId == "birthPlace"
    ) {
      let nameValue = $AHelper.capitalizeFirstLetter(eventValue);
      nameValue = removeSpaceAtStart(nameValue)
      if (eventId =='businessName' ? $AHelper.isAlphabetRegex2(nameValue) : $AHelper.isAlphabetRegex(nameValue)) {
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
  }

  // selectService = (index, data, click) => {
  //   if (click === "clicked") {
  //     const updatedDivArray = [...this.state.checksOfProSerDesc];
  //     updatedDivArray[index].checked = !updatedDivArray[index].checked;
  //     this.setState({ checksOfProSerDesc: updatedDivArray }, () => {
  //       this.fetchProfessType(updatedDivArray[index].checked,data);
  //     });
  //   }
  //   // konsole.log("eventstss", event, this.state.selectedServices, click,data);
  // };

  fetchProfessType = (checked,updateProSerDescId, data,update) => {
    konsole.log("updateProSerDescId111",updateProSerDescId)
   const proSerDesc = parseInt(updateProSerDescId?.value) || updateProSerDescId
   konsole.log("proSerDesc12123231",proSerDesc,data,this.state.checksOfProSerDesc)

    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getProfesType + `?proSerDescId=${proSerDesc}`, "", (response) => {
      if (response) {
        const responseData = response.data.data;
        for(let i = 0; i < responseData.length; i++){
          responseData[i]["proSerDescId"] = parseInt(proSerDesc) 
        }
        konsole.log("rresponse protype",responseData)
        if(update == "updateForUser" || update == "addForUser" || update == "Aorg"){
          for(let i = 0; i < responseData.length; i++){
          for(let j = 0; j < data?.length; j++){
              if(responseData[i].value == data[j].proTypeId){
                
                responseData[i].checked = true;
                responseData[i].proTypeId = parseInt(data[j].proTypeId);
                responseData[i].label= data[j].proType;
                responseData[i].proSerDescId= parseInt(data[j].proSerDescId);
                responseData[i].userProId = parseInt(data[j].userProId) || null;
                responseData[i].proCatId = parseInt(data[j].proCatId);
                responseData[i].proUserId = data[j].proUserId;
                responseData[i].isActive = updateProSerDescId.checked;

              }
              }
          }
          konsole.log("responseData12121266",responseData)
          this.setState(prevState => {return {professType : [...prevState.professType, ...responseData]}},()=>{
          konsole.log("kdshgkfdhjkghdfkjghdkjfhgkjfdhg", this.state.professType, this.props?.proCategories.filter(item => item.proSerDescId === proSerDesc))
          const uniqueProTypeIds = new Set(this.props?.proCategories.filter(item => item.proSerDescId === proSerDesc).map(item => item.proTypeId));
          const uniqueProTypeIdArray = Array.from(uniqueProTypeIds);
          const checkproSubTypeId = this.props?.proCategories.some(item => item.proSubTypeId)
          konsole.log("asdasdafsdfhfhdsadfsadf", uniqueProTypeIdArray, uniqueProTypeIds,checkproSubTypeId)
          for(let i = 0; i < uniqueProTypeIdArray.length; i++){
            if(checkproSubTypeId){
              this.getProfessSubtype(null,uniqueProTypeIdArray[i],this.props?.proCategories,this.props.addNewProff, updateProSerDescId)
              this.setState({ checkProType: true}) 
            }
          }
        })
      }
       else{  
        konsole.log("professSubTtype",this.state.professSubType,this.state.checksOfProSerDesc) 
         this.setState(prevState => {
           if (checked) {
             return { professType: [...prevState.professType, ...responseData]};
           } else {
             const filteredArray = prevState.professType.filter(obj =>
               !responseData.some(item => item.value === obj.value)
             ); 
             
             const filterSubArray = prevState.professSubType.filter(obj =>
              !this.state.checksOfProSerDesc.some(item => item.value == obj.proSerDescId)
            );
             return { professType: filteredArray, professSubType : filterSubArray};
           }
         });        
       }


      }
    });
  };
  

  // fetchSavedAddress = (userId) => {
  //   userId = userId || this.state.docUserId;
  //   konsole.log("userIdprofessioanl",userId)
  //   this.props.dispatchloader(true);
  //   $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAllAddress + userId,
  //     "", (response) => {
  //       this.props.dispatchloader(false);
  //       if (response) {
  //         konsole.log("resposeAddress",response)
  //         // this.props.addNewProff = "" 
  //         this.setState({
  //           ...this.state,
  //           // allAddress: response.data.data.addresses,
  //           addressData: response.data.data.addresses[0],
  //           addressLine2: response.data.data.addresses[0]?.addressLine2

  //         });
  //         this.setState({
  //           ...this.state,
  //           getAddres: response.data.data.addresses
  //         })
  //         this.setState({
  //           ...this.state,
  //           newAddress: response.data.data.addresses[0]
  //         })
  //       }
  //       konsole.log("newdslfj",response)
  //       // else {
  //       //   this.toasterAlert(Msg.ErrorMsg,"Warning")
  //       // }
  //     })
  // }
  validate = () => {
    konsole.log("jhgkjd", this.state.professTypeId,this.state.checksOfProSerDesc)
    const checkProfessType = this.state.checksOfProSerDesc.some(item => item.checked == true)
    const checkSubType = this.state.professSubType.some(item => item.proSubTypes.some(dat => dat.checked == true))
    konsole.log("checkSubTypecheckSubType",checkProfessType,checkSubType)
    let nameError = "";
    if (checkProfessType !== true) {
      nameError = "Please select professional type";
    }
    // else if (this.state.professTypeId == undefined  || this.state.professTypeId == "" || this.state.professTypeId == null) {
    //   nameError = "Please select type of professional";
    // }
    // else if (checkSubType !== true  && this.state.professSubType.length > 0) {
    //   nameError = "Please select professionals sub type";
    // }
    else if (isNotValidNullUndefile(this.state.fName) == false) {
      nameError = "First Name cannot be empty";
    }
    // ================= Don't remove these comments ========================
    // else if (this.state.lName == 0) {
    //   nameError = "Last Name cannot be empty";
    // }
    // else if (this.professionalAddressRef?.current?.isEmpty()) {
    //   nameError = "Address cannot be blank";
    // }
    // =====================================================================
    // else if(this.state.professType?.length == 0 && this.props.toUpdate !== true){
    //   nameError = "Please select the professional type check box";
    // }
    // if(this.state.emailData.length == 0 && this.state.mobileData.length==0){
    //   nameError = "Contact cannot be blank";
    // }
    // else if(this.professionalContactRef?.current?.checkvalidation(true)) return false;

    if (nameError) {
      // alert(nameError);
      this.toasterAlert(nameError,"Warning")
      return false
    }

    if(this.validateWebLink(this.state.websiteLink) != true) return false;

    return true;
  };
  // addressDetails = (attrvalue) => {
  //   konsole.log("attrvalueattrvalue", attrvalue)
  //   this.setState({
  //     addressData: attrvalue,
  //   });
  // }
  // updateAddress = (userID,json,addressId,createdBy) => {
 
  // konsole.log("addressId",userID,json,addressId,createdBy)
  //   const addressPhysical = this.state.getAddres.filter(item => { return item.addressTypeId == 1 });
  //   const isActive = false
    


  //   this.props.dispatchloader(true);
  //   if (addressPhysical.length > 0){
  //     this.props.dispatchloader(true);
  //     $postServiceFn.putMemberAddressData(userID,json,addressId,createdBy, (response) => {
  //         this.props.dispatchloader(false);
  //         if (response) {
  //             this.fetchSavedAddress(response?.data?.data?.userId)
  //             konsole.log("postMemberAddress", response)
  //         } else {
  //             this.props.dispatchloader(false);
  //         }
  //     });
  // }

  // }


  // handleAddressByUserId = (userID) => {
  //   this.props.dispatchloader(true);
  //   const addressPrimary = this.state.allAddressPrimary[0]?.addressId
  //   // konsole.log("primarySpouseUserId",this.state.spouseUserId,addressPrimary,this.state.primaryUserId,true,this.state.loggedInUser)
  //   $postServiceFn.postAddressByUserId(userID, addressPrimary, this.state.primaryUserId, true, this.state.loggedInUser, (response) => {
  //     this.props.dispatchloader(false);
  //     if (response) {
  //       this.fetchSavedAddress(userID)
  //       konsole.log("postMemberAddress", response)
  //     }
  //   });
  // };

  // postAddressUser = (userId, adress, createdBy) => {
 
  //   this.props.dispatchloader(true);
  //   $postServiceFn.postAddressByUserId(userId, adress, createdBy, (response) => {
  //     this.props.dispatchloader(false);
  //     if (response) {

  //       konsole.log("postMemberAddressPo", response)
  //     }
  //   });

  // }

  fetchSavedContactDetails = (userid) => {
    this.props.dispatchloader(true);
    userid = userid || this.state.userId;
    konsole.log("useridContact",userid)
    if(!isNotValidNullUndefile(userid))return;
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getAllContactOtherPath + userid,
      "",
      (response) => {
        this.props.dispatchloader(false);
        if (response) {
          konsole.log("conatctsss",response)
          this.setState({
            ...this.state,
            allContactDetails: response.data.data.contact,
          });
          // konsole.log("responseatsav", response);
        } else {
          // alert(Msg.ErrorMsg);
          // this.toasterAlert(Msg.ErrorMsg,"Warning")
        }
      }
    );
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


  handleshowAddress = () => {
    this.setState({
      showAddress: !this.state.showAddress
    })
  }

  handleshowContact = () => {
    this.setState({
      showContact: !this.state.showContact
    })
  }

  InvokeEditAddress = (addressid) => {
    this.setState({
      EditAddress: addressid
    })
    this.handleshowAddress();
  } 

  
  addProfessional = () => {
    const { professType, professSubType, docUserId, userId, loggedInUser, checksOfProSerDesc } = this.state;
    const previouslySavedData = this.props.previouslySavedData
    let proCatIsAvailable = professType.some(item => item.hasOwnProperty("proCatId") == false && item.checked);  //while adding new professional we didn't get proCatId in professType Array
    proCatIsAvailable = proCatIsAvailable || professSubType?.some((item) => item.proSubTypes?.some((proSub) => proSub.hasOwnProperty("proCatId") == false && proSub.checked));
    // const proCatIdNotZero =  professType.every(item => item.proCatId !== 0)
    const countOfCheckedProSerDesc = checksOfProSerDesc?.filter((item) => item.checked).length;
    const uniqueProSerDesc = Array.from(new Set(this.props.proCategories.map(item => item.proSerDescId))).length
    const countOfCheckedProType = professType?.filter((item) => item.checked).length;
    const uniqueProTypeIds = Array.from(new Set(this.props.proCategories.map(item => item.proTypeId))).length
    let countOfCheckedProSubType = 0; professSubType?.forEach((item) => item.proSubTypes?.forEach((proSub) => {if(proSub.checked) countOfCheckedProSubType++;}));
    const uniqueProSubTypeIds = Array.from(new Set(this.props.proCategories?.map(item => item.proSubTypeId)));
    const uniqueProSubTypeIdsLength = uniqueProSubTypeIds.length - (uniqueProSubTypeIds?.some(element => element == 0) ? 1 : 0) // removing proSubTypeId 0 count
    konsole.log("enfksjvejkfnsvjk", professSubType, countOfCheckedProSubType, uniqueProSubTypeIdsLength);
    konsole.log("countOfCheckedProSerDesc",countOfCheckedProType,uniqueProTypeIds,(countOfCheckedProType < uniqueProTypeIds))

    let checkPreviouslySavedData=[]
    if(!this.validate()) return
      for (let [index,item] of professType.entries()){
        if(item.checked == true && item.hasOwnProperty('proCatId') == false){
          let filterdata = previouslySavedData.filter(data => data.proSerDescId == item.proSerDescId && data.proTypeId == item.value)
          konsole.log("filterdata",filterdata)
          checkPreviouslySavedData.push(...filterdata)
          if(this.props.toUpdate == true && checkPreviouslySavedData.length > 0){
            item.proCatId = checkPreviouslySavedData[0]?.proCatId          // We set proCatId of zero index beacuse after proper working we get only data from previouslySavedData
            item.proUserId = checkPreviouslySavedData[0]?.proUserId         // We set proUserId of zero index beacuse it is same in whole array objects
            item.userProId = 0
          }
        }
      }
      konsole.log('checkPreviouslySavedData',checkPreviouslySavedData,professType, professSubType, this.props.proCategories,this.props.previouslySavedData)
      konsole.log('checkPreviouslySavedData222',this.props.addNewProff,this.props.toUpdate,proCatIsAvailable,checkPreviouslySavedData)
      konsole.log("checkPreviouslySavedData333",((this.props.addNewProff == "updateForUser" || this.props.addNewProff == "addForUser") && this.props.toUpdate == true && proCatIsAvailable !== true),(proCatIsAvailable !== true && this.props.addNewProff == "addForUser"),(checkPreviouslySavedData.length > 0),(countOfCheckedProSerDesc < uniqueProSerDesc))

    this.professionalContactRef.current?.saveContactinfo(this.state.docUserId)

    if (((this.props.addNewProff == "updateForUser") && this.props.toUpdate == true && proCatIsAvailable !== true) || (checkPreviouslySavedData.length > 0) || ((countOfCheckedProSerDesc < uniqueProSerDesc) && (countOfCheckedProType < uniqueProTypeIds) && (countOfCheckedProSubType < uniqueProSubTypeIdsLength))) {
    // alert("Iffff")
      const newArray = [
        ...professType.map(item => {
          const newObj = {
            proUserId: item?.proUserId,
            proCatId: item.proCatId,
            userId: userId,
            isActive: item.checked,
            upsertedBy: loggedInUser,
            proTypeId : item.proTypeId
          };
      
          if (item.userProId !== null && item.userProId !== undefined && item.userProId !== "") {
            newObj["userProId"] = item.userProId;
          }
          return newObj;
        })
      ]
      const filterIsActiveTrue = newArray.filter(item => item.proCatId !== undefined)
      const userProfessionalArray = (this.props.addNewProff == "" && this.props.toUpdate == true && proCatIsAvailable !== true) ? newArray : filterIsActiveTrue

      konsole.log("newArray",filterIsActiveTrue,newArray,userProfessionalArray)
      if(this.props.toUpdate == true && ((this.props.checkSameProff != true && this.state.sameWithPrimary == true) || (this.props.docUsr?.businessName != this.state.businessName) || (this.props.docUsr?.businessTypeId != this.state.businessTypeId) || (this.props.docUsr?.businessTypeId == "999999") || (this.props.docUsr?.websiteLink != this.state.websiteLink))) {
        this.postProSec(docUserId); 
      } else {
        this.professionalAddressRef?.current?.upsertAddress(this.state?.docUserId, 1)
        this.postProfessionalUser(userProfessionalArray, true); // run the other api to update the data
        if(this.state.sameWithPrimary == true) this.postProfessionalUser(userProfessionalArray, true, true);
      }
      const primaryCareMemberDelete = newArray.filter(ele => ele.isActive != true && ele.proTypeId == "11")
      konsole.log("vishnudbprimaryCareId", primaryCareMemberDelete);
      if(primaryCareMemberDelete.length) this.deletePrimaryCareMember(primaryCareMemberDelete[0].proUserId)
    }
    else {
      // alert("else")
      this.postProSec(docUserId);
    }
    this.handlePutName();

    // if (this.state?.getAddres[0]?.addressId) {
    //   konsole.log("adrekjkhkjlsdadddtaaa",this.state.addressLine2);
    //   this.state.newAddress["addressLine2"] = this.state.addressLine2
    // this.professionalAddressRef?.current?.upsertAddress(this.state?.docUserId, 1)
    //  this.updateAddress(this.state?.docUserId,this.state.newAddress,this.state.getAddres[0]?.addressId,this.state?.docUserId) 
    // }

    if(this.props.addNewProff == "updateForUser" && this.state.sameWithPrimary == false && this.props.checkSameProff == true){
      this.props.checkProffsameOrNot(true)
    }
  }

  fetchBussinessType = () => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getBusinessType,
      "",
      (response) => {
        if (response) {
          this.setState({businessTypes: response.data.data})
        }
      }
    );
  };

  handleBusinessTypeChange = (value) => {
    if(value != "999999" && this.state.businessTypeId == "999999") {
      this.businessOther?.current?.setState({othersName: ""});
      setTimeout(() => {
        this.businessOther?.current?.saveHandleOther(this.state.natureId);
        this.setState({businessTypeId: value})
      }, [100])
    } else {
      this.setState({businessTypeId: value})
    }
  }

  handlePutName = () => {
    let physicianInfo = {
      userId: this.state.docUserId,
      fName: $AHelper.capitalizeAllLetters(this.state.fName),
      mName: $AHelper.capitalizeAllLetters(this.state.mName),
      lName: $AHelper.capitalizeAllLetters(this.state.lName),
      updatedBy: this.state.loggedInUser,
      subtenantId : sessionStorage.getItem('SubtenantId')
    }
    this.props.dispatchloader(true);
    // this.professionalContactRef.current?.saveContactinfo(this.state.docUserId)
    $postServiceFn.putUserInfo(physicianInfo, (res) => {
      this.props.dispatchloader(false);
      this.props.CallSearchApi(this.state.userId,this.state.primaryUserId);
      this.props.setproserprovider();
      konsole.log("done", res);
     
    })
  }

  // handleDeleteAddress = (userid, addressid) => {
  //   userid = userid || this.state.docUserId;
  //   // let ques = confirm("Are you sure? You want to delete your address.")
  //   // userid = userid || this.state.userId;
  //   if (ques) {
  //     this.props.dispatchloader(true);
  //     $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteAddress + userid + "/" + addressid + "/" + this.state.loggedInUser, "", (response) => {
  //       this.props.dispatchloader(false);
  //       if (response) {
  //         this.fetchSavedAddress(userid);
  //       } else {
  //         // alert(Msg.ErrorMsg);
  //         this.toasterAlert(Msg.ErrorMsg,"Warning")
  //       }
  //     });
  //   }
  // }

  handleDeleteContact = async (userid, contactId) => {
    userid = userid || this.state.docUserId;
    let ques =  await this.context.confirm(true, "Are you sure? You want to delete your Contact.","Confirmation")
    if (ques) {
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteContactPath + userid + "/" + contactId, "", (response) => {
        this.props.dispatchloader(false);
        if (response) {
          this.fetchSavedContactDetails(userid);
        } else {
          // alert(Msg.ErrorMsg);
          this.toasterAlert(Msg.ErrorMsg,"Warning")
        }
      });
    }
  }

  InvokeEditContactID = (contactTypeId, EditContactType) => {
    this.setState({
      EditContactType: EditContactType,
      EditContactId: contactTypeId
    })
    this.handleshowContact();
  }

  handleFocusOut = () => {
    let attrvalue = this.state.mName;
    if (attrvalue?.length !== 0) {
      if (attrvalue?.length === 1) {
        attrvalue = attrvalue + ".";
      }
    }
    this.setState({
      mName: attrvalue,
    });
  };
  toasterAlert(text,type) {
    this.context.setdata({open:true,
      text:text,
      type:type})
  }

  addressDetails = (attrvalue) => {
    konsole.log("attrvalueattrvalueUppp", attrvalue)
    this.setState({
        addressData: attrvalue || [],
    });
    this.setState({
      newAddress: attrvalue || [],
    });
}
  contactDetails = (mobile, email) => {
    konsole.log("attrvalueattrvalue", mobile, email)
    this.setState({
        mobileData: mobile,
        emailData: email
         });
  }

  handleProfessionalType = (event,data) =>{
    const checked = event.target.checked
    konsole.log("checked12121",checked,data, this.state.professType)

   for(let i = 0; i < this.state.professType?.length; i++){
    if((this.state.professType[i]?.value == data.value)){
      this.state.professType[i].checked = checked
      this.getProfessSubtype(checked,data,undefined,undefined, this.state.professType[i].proSerDescId)
    }
   }
  this.setState({professTypeId : data.value, checkProType : checked})
  }

  handleProfessionalSubType = (event,data) =>{
    const checked = event.target.checked
    konsole.log("eventsss",data,checked)
    const professSubTypeArray = this.state.professSubType

    for(let i = 0; i < professSubTypeArray.length; i++){
      if(professSubTypeArray[i].proTypeId == data.proTypeId){
        for(let j = 0; j < professSubTypeArray[i]?.proSubTypes.length; j++){
          konsole.log("1val121212121",professSubTypeArray[i]?.proSubTypes[j]?.proSubTypeId,data.proSubTypeId)
          if(professSubTypeArray[i].proSubTypes[j].proSubTypeId === data.proSubTypeId){
            professSubTypeArray[i].proSubTypes[j].checked = checked
          }
        }
      }
    }
    this.setState({professSubType : professSubTypeArray})
  }
  
  

//   professSerChecks = () =>{

//     $CommonServiceFn.InvokeCommonApi("Get", $Service_Url.getProfessionalSecDesc,'', (response, error) => {
//      if (response) {
//        konsole.log("responseServicePro",response.data.data)
//        const responseData = response.data.data
//        const themeIcons = [
//         "icons/healthTheme.svg",
//         "icons/housingTheme.svg",
//         "icons/financeTheme.svg" ,
//         "icons/legalTheme.svg",
//         "icons/otherTheme.svg"
//        ]

//        const whiteIcons = [
//         "icons/Healthwhite.svg",
//         "icons/housing white.svg",
//         "icons/Financewhite.svg" ,
//         "icons/Legal white.svg",
//         "icons/Otherswhite.svg"
//        ]
//        for(let i = 0; i < responseData.length; i++){
//               responseData[i]["themeIcons"] = themeIcons[i]
//               responseData[i]["whiteIcons"] = whiteIcons[i]
//       }
//       konsole.log("responseDataIcons",responseData)
//        this.setState({
//          checksOfProSerDesc : responseData
//        })
//        if(this.props?.proCategories?.length > 0){
//          this.updateProCategories(this.props?.proCategories,responseData)
//        }
//      }
//      else {
         
//          konsole.log("ErroService",error)
//      }
//    })
//  }

postProSec = (professionalUserId) =>{
const professTypes = this.state.professType
const professSubTypesArr = this.state.professSubType

konsole.log("professSubTypesArr12313",professSubTypesArr,professTypes)
const newArray = []

  if(this.validate()){
    // if(this.professionalContactRef.current.checkvalidation()){
    //   return;
    //  }
      // if (this.state?.getAddres[0]?.addressId) {
      //   this.state.newAddress["addressLine2"] = this.state.addressLine2
      //  this.updateAddress(this.state?.docUserId,this.state.newAddress,this.state.getAddres[0]?.addressId,this.state?.docUserId) 
      // } else {
      //   this.state.newAddress["addressLine2"] = this.state.addressLine2
      //   this.postAddressUser(this.state?.docUserId, this.state.newAddress, professionalUserId)
      // }
      this.professionalAddressRef?.current?.upsertAddress(this.state?.docUserId, 1)

      konsole.log("professTypes12121221",professTypes)
      for (let i = 0; i < professTypes?.length; i++) {
        if (professTypes[i].checked && !professSubTypesArr.some(ele => ele.proTypeId == professTypes[i].value)) {
          const newObj = {
            proCatId: professTypes[i].proCatId || 0,
            proSerDescId: parseInt(professTypes[i].proSerDescId),
            proTypeId: parseInt(professTypes[i].value),
            proSubTypeId: null,
          };
          newArray.push(newObj);
        }
      }
      
      konsole.log("newArrayPost",newArray,professSubTypesArr)

      // for (let j = 0; j < newArray.length; j++) {
      //   if(professSubTypesArr.length > 0){
      //     for (let k = 0; k < professSubTypesArr.length; k++) {
      //       for (let l = 0; l < professSubTypesArr[k].proSubTypes?.length; l++) {
      //         if (
      //           newArray[j].proTypeId === professSubTypesArr[k].proSubTypes[l].proTypeId &&
      //           professSubTypesArr[k].proSubTypes[l].checked
      //         ) {
      //           newArray[j]["proSubTypeId"] = professSubTypesArr[k].proSubTypes[l].proSubTypeId;
      //         }
      //       }
      //     }
      //   }
      //   else{
      //     newArray[j]["proSubTypeId"] = null
      //   }
      // }

      let checkedProSubType = [];
      professSubTypesArr.forEach(proSubObj => {
        for (let j = 0; j < proSubObj.proSubTypes?.length; j++) {
          const element = proSubObj.proSubTypes[j];
          konsole.log("bfsbafjhwn", element);
          // if(element.checked == true && (element?.hasOwnProperty("proCatId") == false)) {
          if(element.checked == true) {
            checkedProSubType.push({
              proCatId: element.proCatId || 0,
              proSerDescId: parseInt(proSubObj.proSerDescId),
              proTypeId: parseInt(element.proTypeId),
              proSubTypeId: parseInt(element.proSubTypeId),
            })
          }
        }
      });

      checkedProSubType.forEach(element => newArray.push(element));

      konsole.log("newArryayayaSub", newArray, professSubTypesArr, checkedProSubType)

      if(newArray.length == 0) return this.toasterAlert("Please select service provider (and sub category).", "Warning")

        const jsonObj =  {
          proUserId: this.props.docUsr ? this.props.docUsr?.proUserId : 0,  //Sent id of zero index beacause in this array we have same id's in all array objects
          userId: professionalUserId,
          isGenAuth: true,
          isStatus: true,
          isActive: true,
          upsertedBy: this.state.loggedInUser,
          proCategories: newArray,
          businessName: $AHelper.capitalizeAllLetters(this.state.businessName),
          businessTypeId : this.state.businessTypeId,
          websiteLink : this.state.websiteLink,
        }
        konsole.log("jsonObj1221",JSON.stringify(jsonObj))

        this.props.dispatchloader(true);
        // API1
     $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postProfessionalUserMapping,jsonObj,
      async (response,error) => {
       this.props.dispatchloader(false);
         if(response){
             konsole.log("responseProfessional2121", response); 

              // logic for adding primary care member
              if(newArray.some(ele => ele.proTypeId == "11") && (this.props.proCategories.some(ele => ele.proTypeId == "11") == false)) {
                await this.addPrimaryCareMember(response.data.data[0]);
                konsole.log("vishnudbnotUpdate", response.data.data[0], newArray, this.state.primaryCareId);
              }
            
              // let professUserId = response.data.data;
              const responseData = response.data.data
              if(this.state.businessTypeId == "999999") this.businessOther?.current?.saveHandleOther(responseData[0]?.proUserId);
              // this.professionalContactRef.current?.saveContactinfo(responseData.userId)
              if(responseData?.length > 0 && this.state.sameWithPrimary == true){
                this.callIfSameAsSpouse(responseData,this.state.primaryUserId)
                this.callIfSameAsSpouse(responseData,this.state.spouseId)
              }
             else if(responseData?.length > 0){
             const jsonObj = []
             for(let i = 0; i < responseData[0].proCategories?.length; i++){
              let obj = {
                userProId: 0,
                proUserId: responseData[0]?.proUserId,
                proCatId: responseData[0].proCategories[i].proCatId,
                userId: ((this.props.checkSameProff != true && this.state.sameWithPrimary == true) && this.props.activeUser == "1") ? this.state.spouseId : ((this.props.checkSameProff != true && this.state.sameWithPrimary == true) && this.props.activeUser == "2") ? this.state.primaryUserId : this.state.userId,
                isActive: true,
                lpoStatus: false,
                upsertedBy: this.state.loggedInUser
              }
              obj.proTypeId = responseData[0]?.proCategories[i]?.proTypeId
              obj.proCatId = responseData[0]?.proCategories[i]?.proCatId
               jsonObj.push(obj)
              } 

              const proCategoriesForProtype = responseData[0].proCategories.filter(({ proTypeId }, index) => (proTypeId === 999999));
              if (proCategoriesForProtype.length > 0) {
                this.professTypeRef.current?.saveHandleOther(proCategoriesForProtype[0].proCatId);
              }

              const proCategoriesSubType = responseData[0].proCategories.filter(({ proSubTypeId }, index) => (proSubTypeId === 999999));
              if (proCategoriesSubType.length > 0) {
                this.professSubTypeRef.current?.saveHandleOther(proCategoriesSubType[0].proCatId);
              }

              this.handlePutName();

              const filterNewlyAddedData = jsonObj.filter(item1 => !this.props.proCategories.some(item2 => item1.proCatId === item2.proCatId));
              const userProffJson = (this.props.toUpdate == true && ((this.props.checkSameProff != true && this.state.sameWithPrimary == true) !== true)) ? filterNewlyAddedData : jsonObj;
              konsole.log("userProffJson",userProffJson,filterNewlyAddedData,jsonObj)
              // if(userProffJson?.length !== 0){
                this.postProfessionalUser(userProffJson, false) // do not run the other api in adding time 
            //  }
            //  else{
            //   this.props.handleClose()
            //  }
            }
         }else{
             konsole.log("error1212",error)
             this.toasterAlert(Msg.ErrorMsg, "Warning")
            
         }
         })
}
  }

       callIfSameAsSpouse = (response,userid) => {
       konsole.log("responseForSameAsApouse",response, userid)
      //  const primaryMemData = this.state.primaryData
          const jsonObj = []
          for(let i = 0; i < response[0].proCategories?.length; i++){
           let obj = {
             userProId: 0,
             proUserId: response[0]?.proUserId,
             proCatId: response[0].proCategories[i].proCatId,
             userId : userid,
             isActive: true,
             lpoStatus: false,
             upsertedBy: this.state.loggedInUser
           }
           obj.proTypeId = response[0]?.proCategories[i]?.proTypeId
           obj.proCatId = response[0]?.proCategories[i]?.proCatId
            jsonObj.push(obj)
           } 
           
          const proCategoriesForProtype = response[0].proCategories.filter(({ proTypeId }, index) => (proTypeId === 999999));
          konsole.log("jsonObjjsonObj12121",jsonObj,response[0],response[0].proCategories,proCategoriesForProtype)
    
              if (proCategoriesForProtype.length > 0) {
                konsole.log("proCategoriesForProtype111",proCategoriesForProtype,proCategoriesForProtype[0].proCatId)
      
                this.professTypeRef.current?.saveHandleOther(proCategoriesForProtype[0].proCatId);
              }

              const proCategoriesSubType = response[0].proCategories.filter(({ proSubTypeId }, index) => (proSubTypeId === 999999));
              if (proCategoriesSubType.length > 0) {
                konsole.log("proCategoriesForProtype222",proCategoriesSubType,proCategoriesSubType[0].proCatId)
                this.professSubTypeRef.current?.saveHandleOther(proCategoriesSubType[0].proCatId);
              }

              this.handlePutName();

              const filterNewlyAddedData = jsonObj.filter(item1 => !this.props.proCategories.some(item2 => item1.proCatId === item2.proCatId));
              const updateCondition = this.props.checkSameProff != true && this.state.sameWithPrimary == true && this.state.userId != userid;
              const userProffJson = this.props.toUpdate == true ? (updateCondition ? jsonObj : filterNewlyAddedData) : jsonObj;
              konsole.log("userProffJson",userProffJson,filterNewlyAddedData,jsonObj)
              if(userProffJson?.length !== 0 ){
                this.postProfessionalUser(userProffJson, false, userid != this.state.userId) // do not run the other api in adding time 
             }
             else{
              this.props.handleClose(userid != this.state.userId)
             }    
       }
   
   postProfessionalUser = (userProffJson, shouldRunOtherApi,sameAs) =>{
     konsole.log("professionalUserId121212",JSON.stringify(userProffJson),userProffJson,this.props.proCategories)
     let propsProCategories = this.props.proCategories;
     const professTypesArr = this.state.professType
     const professSubTypesArr = this.state.professSubType
     if(this.props.addNewProff == "Aorg" || this.props.addNewProff == "addForUser") {
      let _userProffJson = userProffJson.filter(ele => ele.isActive == true);
      userProffJson = _userProffJson;
     }

     let removedProTypes = propsProCategories?.filter(prevProfObj => {
        if(prevProfObj.proSubTypeId != 0) return !professSubTypesArr.some(proSubTypeObj => proSubTypeObj.proSubTypes.some(proSubEle => proSubEle.proSubTypeId == prevProfObj.proSubTypeId && proSubEle.checked == true));
        return !professTypesArr.some(proType => proType.proTypeId == prevProfObj.proTypeId && proType.checked == true);
     });
      konsole.log("bskjdbbvksbkbv", propsProCategories, userProffJson, removedProTypes, this.state.professType);
      userProffJson = [...userProffJson, ...removedProTypes?.map(item => {
          return {
            userProId: sameAs ? this.props.spouseProCatMap[item.proCatId] : item.userProId,
            proUserId: item.proUserId,
            proCatId: item.proCatId,
            userId : sameAs ? (this.state.userId != this.state.primaryUserId ? this.state.primaryUserId : this.state.spouseId) : item.userid,
            isActive: false,
            lpoStatus: false,
            upsertedBy: this.state.loggedInUser
          }
      })]
      konsole.log("bskjdbbvksbkbvuserProffJson", userProffJson);

     if(this.state.checkIdontHaveAccountant == "true" || this.state.checkIdontHaveFinanAdvisor == "true" || this.state.checkIdontHaveBookkeeper == "true"){
      for(const val of userProffJson){
         if(val.proTypeId == "3" && this.state.iDontHaveAcccountantQuestionId == 197 && this.state.checkIdontHaveAccountant == "true"){
          this.handleUpdateSubmitForAccountant(this.state.userSubjectDataIdOfAccountant)
        }
        else if(val.proTypeId == "1" && this.state.iDontHaveFinanAdvisorQuestionId == 198 && this.state.checkIdontHaveFinanAdvisor == "true"){
          this.handleUpdateSubmitForFinanAdvi(this.state.userSubjectDataIdOfFinanAdv)
        }
        else if(val.proTypeId == "12" && this.state.iDontHaveBookkeeperQuestionId == 196 && this.state.checkIdontHaveBookkeeper == "true"){
          this.handleUpdateSubmitForBookkeeper(this.state.userSubjectDataIdOfBookkeeper)
        }
      }
     }

    for(const val of userProffJson) {
      konsole.log("vishnudb-val of userProffJson", val)
      if(val.proTypeId == "11" ) {
        if(this.state.sameWithPrimary == true && val.userId == this.state.spouseId) {
          userProffJson = userProffJson.filter(ele => ele.proTypeId != "11")
          this.primaryCareMapWithUserId(val.proUserId, val.userId, this.state.primaryUserId);
        } else {
          this.primaryCareMapWithUserId(val.proUserId, val.userId);
        }
        break;
      }
    }

    for(const val of propsProCategories) {
      konsole.log("vishnudb-val of proCategories", val)
      if(val.proTypeId == "11") {
        if(this.state.sameWithPrimary == true && val.userId == this.state.spouseId) {
          propsProCategories = propsProCategories.filter(ele => ele.proTypeId != "11")
          this.primaryCareMapWithUserId(val.proUserId, val.userId, this.state.primaryUserId);
        } else {
          this.primaryCareMapWithUserId(val.proUserId, val.userId);
        }
        break;
      }
    }

    //  API2
     $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postProfessionalUser,
     userProffJson, (response,error) => {
       this.props.dispatchloader(false);
         if(response){
             konsole.log("responseProfessional213", response);
             if (shouldRunOtherApi === true) {
              const proCategoriesForProtype = propsProCategories.filter(({ proTypeId }, index) => (proTypeId === 999999));
              if (proCategoriesForProtype.length > 0) {
                this.professTypeRef.current?.saveHandleOther(proCategoriesForProtype[0].proCatId);
              }
  
              const proCategoriesSubType = propsProCategories.filter(({ proSubTypeId }, index) => (proSubTypeId === 999999));
              if (proCategoriesSubType.length > 0) {
                this.professSubTypeRef.current?.saveHandleOther(proCategoriesSubType[0].proCatId);
              }
            }
             this.props.CallSearchApi(this.state.userId,this.state.primaryUserId) 
            //  this.props.handleClose("SameAs")
            //  this.props.setproserprovider() 
         }else{
             konsole.log("error1212",error)
         }
         this.props.handleClose(sameAs)
         })
      }

      getProfessSubtype = (checked,proTypeIds,data,update, updateProSerDescId) =>{
        const protypeId = proTypeIds.value || proTypeIds
        const subTypeArray = []
        let subTypeObj = {}
        // const checked = event.target.checked
        konsole.log("protypeIdSubtype",protypeId,data,checked,this.state.professType,update)
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getProffesionalSubType + `?protypeId=${protypeId}`, "", (response,error) => {
          if (response) {
            const responseData = response.data.data;
            konsole.log("responseresposhdfjkdgsjfgdjsgfjsdgfsdgfjdshjnseSubbb",response,  $Service_Url.getProffesionalSubType + `?protypeId=${protypeId}`)
            if(response.data.succeeded == true){
              if(update == "updateForUser" || update == "addForUser" || update == "Aorg"){
                for(let i = 0; i < responseData.length; i++){
                for(let j = 0; j < data?.length; j++){
                  if (responseData[i].proSubTypeId == data[j].proSubTypeId) {
                    responseData[i].checked = true;
                    responseData[i].proCatId = data[j].proCatId;
                    subTypeObj = {
                      proType: data[j].proType,
                      proTypeId: data[j].proTypeId,
                      proSerDescId: updateProSerDescId,
                    }
                  }
                    }
                }
                subTypeObj["proSubTypes"] =  responseData
                subTypeArray.push(subTypeObj)
                konsole.log("kdshgkfdhjkghdfkjghdkjfhgkjfdhg", JSON.stringify(responseData),subTypeArray)
              this.setState(prevState => {return {professSubType : [...prevState.professSubType, ...subTypeArray]}})
              // this.setState({professType : responseData}) 
            }else{
              konsole.log("proTypeIdsssssss",proTypeIds)
               subTypeObj = {
               proType : proTypeIds.label,
               proTypeId : proTypeIds.value,
               proSerDescId : proTypeIds.proSerDescId,
               proSubTypes : responseData
              }
              subTypeArray.push(subTypeObj) 
              konsole.log("subTypeArray",subTypeArray)          
    
               this.setState(prevState => {
                 if (checked) {
                   return { professSubType: [...prevState.professSubType, ...subTypeArray] };
                 } else {
                   const filteredArray = prevState.professSubType.filter(obj =>
                     !subTypeArray.some(item => item.proTypeId === obj.proTypeId)
                   );
                   return { professSubType: filteredArray };
                 }
                });
                konsole.log("subTypeArrayFill",filteredArray) 
            }
            }
            
          }else{
            konsole.log("subErorr",error)
          }
        });
      }

      
  handleMouseEnter = (event,data) => {
    konsole.log("evnetOnHover",event,data)
    this.setState({
      isHovered : true,
      hoveredProSerDesc : data.value
    })
  }

   handleMouseLeave = () => {
    this.setState({
      isHovered : false,
      hoveredProSerDesc : ""
    })
  };
  addressLines = (value) => {
    this.setState({
      addressLine2 : value
    })
  };

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

  handleUpdateSubmitForAccountant = (userSubjectDataId) => {
    let inputdata = JSON.parse(JSON.stringify(this.state));


    let dontAccoutant = {
      userSubjectDataId: userSubjectDataId,
      subjectId: 197,
      subResponseData: false,
      responseId: 387,
      userId: this.state.primaryUserId,
    };


      let totinptary = [];


    if (dontAccoutant.subjectId !== 0 && dontAccoutant.subResponseData !== "" && dontAccoutant.responseId !== 0) {
      totinptary.push(dontAccoutant);
    }


    let updatePostData = {
      userId: this.state.primaryUserId,
      userSubjects: totinptary
    }
    konsole.log("updatePostDataupdatePostDataupdatePostDataupdatePostData", JSON.stringify(updatePostData))
    // konsole.log(JSON.stringify(inputdata));
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "PUT",
      $Service_Url.putSubjectResponse, // + "?userId=" + this.state.userId
      updatePostData,
      (response) => {
        this.props.dispatchloader(false);
        konsole.log("SuccessProvider" + JSON.stringify(response),response.data.data);
        if (response) {
      
          this.getsubjectForFormLabelIdForAccountant(this.state.primaryUserId);
      
        } 
      }
    );
  };

  getsubjectForFormLabelIdForAccountant = (newuserid) => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    konsole.log("accountantMoreinfo122",accountantMoreinfo)
    $CommonServiceFn.InvokeCommonApi( "POST", $Service_Url.getsubjectForFormLabelId, accountantMoreinfo, (response) => {
        if (response) {
          konsole.log("sujectName", JSON.stringify(response.data.data),response.data.data);
          this.props.dispatchloader(false);
          const responseData = response.data.data;

          for (let resObj of responseData) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = resObj.question;
            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, "", (response) => {
              if (response) {
                if (response.data.data.userSubjects.length !== 0) {
                  this.setState({
                    updateCaregiverSuitabilty: true,
                  })
                  let responseData = response.data.data.userSubjects[0];
                  konsole.log("datashownatcaregiverAccoProffSeach",responseData.questionId, responseData);
                  this.props.dispatchloader(true);
                  for (let i = 0; i < formlabelData[label].response.length; i++) {
                    if (formlabelData[label].response[i].responseId === responseData.responseId) {
                      this.props.dispatchloader(false);

                      if(responseData.questionId == 197){
                        this.setState({userSubjectDataIdOfAccountant : responseData?.userSubjectDataId})
                      }

                      if (responseData.responseNature == "Radio") {
                        formlabelData[label].response[i]["checked"] = true;
                        formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                      }
                      else if (responseData.responseNature == "Text") {
                        formlabelData[label].response[i]["response"] = responseData.response;
                        formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                      }
                      else if (responseData.responseNature == "CheckBox") {
                        if(responseData.questionId == "197"){
                          this.props.disableProfessionalAdd(responseData.response);
                          this.setState({checkIdontHaveAccountant : responseData.response, iDontHaveAcccountantQuestionId : responseData.questionId})
                          formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        }
                      }
                    }
                  }
                  this.setState({ formlabelData: formlabelData });
                }
                this.props.dispatchloader(false);
              }
            })
            konsole.log("sujectName shoerjiowehtu", JSON.stringify(response.data.data));
            this.setState({ formlabelData: formlabelData });
          }
          // this.setState({
          //   formlabelData: formlabelData,
          // });
        } else {
          // alert();
          // Msg.ErrorMsg
        }
      }
    );
    this.setState({
      formlabelData: formlabelData,
    });
  };

  handleUpdateSubmitForFinanAdvi = (userSubjectDataId) => {
    let inputdata = JSON.parse(JSON.stringify(this.state));

    let dontFinancialAdvisor = {
      userSubjectDataId: userSubjectDataId,
      subjectId: 198,
      subResponseData: false,
      responseId: 388,
      userId: this.state.primaryUserId,
    };

   


    let totinptary = [];
    if (dontFinancialAdvisor.subjectId !== 0 && dontFinancialAdvisor.subResponseData !== "" && dontFinancialAdvisor.responseId !== 0) {
      totinptary.push(dontFinancialAdvisor);
    }
   

    let updatePostData = {
      userId: this.state.primaryUserId,
      userSubjects: totinptary
    }

    konsole.log("updatePostDataupdatePostDataa1212", updatePostData)
    // totinptary.push(medicine);

    // konsole.log(JSON.stringify(inputdata));
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi( "PUT", $Service_Url.putSubjectResponse, updatePostData, (response) => {
      this.props.dispatchloader(false);
      if (response) {
        // this.handleClose();
        this.getsubjectForFormLabelIdForFinancialAdvisor(this.state.primaryUserId);
      } 
    }
    );
  }

  getsubjectForFormLabelIdForFinancialAdvisor = (newuserid) => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, financialAdvisorMoreInfo, (response) => {
      if (response) {
        konsole.log("datashownatcaregiver formlabelData finance", formlabelData);
        for (let obj of response.data.data) {
          let label = "label" + obj.formLabelId;
          formlabelData[label] = obj.question;
          $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, "", (response) => {
            if (response) {
              if (response.data.data.userSubjects.length !== 0) {
                this.setState({
                  updateCaregiverSuitabilty: true,
                })
                let responseData = response.data.data.userSubjects[0];
                this.props.dispatchloader(true);
                for (let i = 0; i < formlabelData[label].response.length; i++) {
                  if (formlabelData[label].response[i].responseId === responseData.responseId) {
                    formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                    this.props.dispatchloader(false);
                    konsole.log("responseDateInOfFinancialAdvOnPro",responseData)
                     
                    if(responseData.questionId == 198){
                      this.setState({userSubjectDataIdOfFinanAdv : responseData?.userSubjectDataId})
                    }

                    if (responseData.responseNature == "Radio") {
                      formlabelData[label].response[i]["checked"] = true;
                      if(responseData.responseId === 145){
                        this.setState({ currentState: "No"})
                      }
                    }
                    else if (responseData.responseNature == "Text") {
                      formlabelData[label].response[i]["response"] = responseData.response;
                    }
                    else if (responseData.responseNature == "CheckBox") { 
                      this.props.disableProfessionalAdd(responseData.response);
                      this.setState({checkIdontHaveFinanAdvisor : responseData.response, iDontHaveFinanAdvisorQuestionId : responseData.questionId})
                    }
                  }
                }
                this.setState({ formlabelData: formlabelData });
              }
              this.props.dispatchloader(false);
            }
          })
          this.setState({ formlabelData: formlabelData });
        }
      } else {
        // alert( Msg.ErrorMsg );
        this.toasterAlert(Msg.ErrorMsg, "Warning")
      }
    }
    );
  };

  handleUpdateSubmitForBookkeeper =  (userSubjectDataId) => {
    let inputData = {
      userId: this.state.primaryUserId,
      userSubjects: [
        {
          userSubjectDataId: userSubjectDataId,
          subjectId: 196,
          subResponseData: false,
          responseId: 386,
        },
      ],
    };

    konsole.log("bookkeeeper response json1212", inputData);
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "PUT",
      $Service_Url.putSubjectResponse,
      inputData,
      (response, error) => {
        konsole.log("responseBookkeeperProPost",response)
        // this.setState({
        //   disable:false
        // })
        this.props.dispatchloader(false);
        this.getSubjectResponseForBookkeeper(this.state.primaryUserId);
      }
    );
  };

  getSubjectResponseForBookkeeper = (userId) => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getSubjectResponse +
      userId +
        `/0/0/${196}`,
      "",
      (response, error) => {
        this.props.dispatchloader(false);
        konsole.log("response bookkeeper", response, error);
        if (response) {
          konsole.log("responseBookkeeperPro",response)
          const responseData = response.data.data
          if(responseData.userSubjects[0]?.questionId == 196){
            this.setState({userSubjectDataIdOfBookkeeper : responseData.userSubjects[0]?.userSubjectDataId})
          }
          this.setState({
            checkIdontHaveBookkeeper : responseData.userSubjects[0]?.response, 
            iDontHaveBookkeeperQuestionId : responseData.userSubjects[0]?.questionId,
          })
        } else if (error) {
          konsole.log("ErrorBookkeeperPro",response)
        }
      }
    );
  };

  // function for add new primary care member
  addPrimaryCareMember = (proffResponse) => {
    return new Promise( async (resolve, reject) => {
    konsole.log("vishnudb addPrimaryCareMember para", proffResponse);
    const primaryUserId = sessionStorage.getItem("SessPrimaryUserId");
    const loggedInUser = sessionStorage.getItem('loggedUserId');
    // const spouseUserId = sessionStorage.getItem('spouseUserId');
    const addToUserId = this.state.sameWithPrimary == true ? primaryUserId : this.state.userId;

    // checking - is there proTypeId = "11" 
    let flag = proffResponse.proCategories.some(ele => ele.proTypeId == "11");
    if(!flag ) return resolve(null);

    konsole.log("vishnudb-apcm bfr", flag)
    flag = await this.findPrimaryCareId(proffResponse.proUserId);
    konsole.log("vishnudb-apcm afr", flag)
    if(flag) return resolve(null);

    // json for addPrimaryCare API
    const physicianinput = {
      userId: addToUserId,
      physician: {
        docMemberUserId: proffResponse.userId,
        doc_License: null,
        experience_yrs: null,
        is_Primary: false,
        is_GCM: false,
        is_GCM_Certified: null,
        // speciality_Id: 0, 
        other: null,
        is_Primary_Care: false,
        isProUserAdded : true,
        pro_User_Id: proffResponse.proUserId,
        happy_With_Service: null,
        visit_Duration: "",
        isSameSpecialist: this.state.sameWithPrimary,
        createdBy: loggedInUser
      },
    }

    // addPrimaryCareMember API
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postAddPhysician, physicianinput,
      (response,error) => {
        if(error) {
          konsole.log("vishnudb error @ addPrimaryMember API", error);
          return resolve(null);
        }
        konsole.log("vishnudb resp @ addPrimaryMember API", response.data.data.physicians[0].primary_Care_Id);
        this.setState({primaryCareId: response.data.data.physicians[0].primary_Care_Id});
        return resolve(response.data.data.physicians[0].primary_Care_Id);
      }
    )

    }) // promise end
  }

  deletePrimaryCareMember = async (proUserId, userId) => {
    konsole.log("vishnudbdeletePrimaryCareMemberpara", proUserId, userId);
    if(!userId) userId = this.state.userId;
    
    const primaryCareId = await this.findPrimaryCareId(proUserId, userId);
    konsole.log("vishnudbdeletePrimaryCareMember", proUserId, userId, primaryCareId);
    
    const json = {
      userId: userId,
      deletedBy: this.state.loggedInUser,
      primary_Care_Id: primaryCareId
    }

    $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteSpecialistDatabyDocuserId, json, 
      (response, error) => {
        if(error) {
          konsole.log("vishnudb error @ deletePrimaryCareMember", error)
          return
        }
        konsole.log("vishnudb resp @ deletePrimaryCareMember", response)
      }
    )
  }

  getPrimaryCareMember = (primaryCareId, userId) => {
    return new Promise((resolve, reject) => {
      $CommonServiceFn.InvokeCommonApi("GET", `${$Service_Url.getPrimaryCareMemberById}/${userId}/${primaryCareId}`, "",
        (response, error) => {
          if(error) {
            konsole.log("vishnudb error @ getPrimaryCareMember", error)
            return resolve(null);
          }
          const formatedResponse = {
            userId: response.data.data.userId,
            physician: response.data.data.physicians[0]
          }
          konsole.log("vishnudbfomatedResponse", formatedResponse);
          return resolve(formatedResponse);
        }
      )
    })
  }

  updatePrimaryCareMember = async (primaryCareId, sameWithSpouse = false) => {
    // get particular primary care member data
    let formatedJson = await this.getPrimaryCareMember(primaryCareId, this.state.primaryUserId);
    if(!formatedJson) return
    
    formatedJson.physician.isSameSpecialist = sameWithSpouse;
    formatedJson.physician.updatedBy = this.state.loggedInUser;

    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putPrimaryCarePhysicianPath, formatedJson,
      (response, error) => {
        if(error) {
          konsole.log("vishnudb error @ updatePrimaryCareMember", error)
          return;
        }
      }
    )

  }

  primaryCareMapWithUserId = async (proUserId, userId, sameAsUserId = null) => {
    konsole.log("vishnu-primaryCareMapWithUserId-para", proUserId, userId, sameAsUserId)
    const primaryCareId = this.state.primaryCareId ? this.state.primaryCareId : await this.findPrimaryCareId(proUserId);
    konsole.log("vishnu-primaryCare-id", primaryCareId, this.state.primaryUserId);
    const loggedInUser = sessionStorage.getItem('loggedUserId');

    // mapping primaryCareMember with current selected user
    const json = {
      userId: userId,
      primaryCareId: primaryCareId,
      sameAsUserId: sameAsUserId,
      createdBy: loggedInUser
    }

    if(await this.findPrimaryCareId(proUserId, userId)) return;

    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.mapPrimaryCare, json, 
      (response, error) => {
        if(error) {
          konsole.log("vishnudb error @ mapPrimaryCare API", error);
          return;
        }
        konsole.log("vishnudb resp @ mapPrimaryCare", response)
        this.setState({primaryCareId: undefined});
        return
      }
    )

    if(sameAsUserId) this.updatePrimaryCareMember(primaryCareId, true);
  }

  findPrimaryCareId = (proUserId, userId) => {
    if(!userId) userId = this.state.primaryUserId;
    return new Promise((resolve, reject) => {
      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.mapGetPrimaryCare + `/${userId}?ProUserId=${proUserId}`, "", 
      (response, error) => {
        if(error) {
          konsole.log("vishnudb error @ findPrimaryCareId", error);
          return resolve(null)
        }
        konsole.log("vishnudb resp @ findPrimaryCareId", response.data?.data[0]?.primaryCareId);
        return resolve(response.data?.data[0]?.primaryCareId)
      })
    })
  }

  handleBusinessNameChange = (_businessName) => {
    this.setState({businessName: _businessName});
    konsole.log("dbbusiness", _businessName)
  }

  
    render(){
      let professTypeforselect=$AHelper.relationshipListsortingByString(this.state?.professType)
      let professSubTypeForSelect=$AHelper.relationshipListsortingByString(this.state?.professSubType)

      konsole.log("propspskdskndjs", this.state.checkIdontHaveBookkeeper)
     
        return (
          <>
            <style jsx global>{`
              .modal-open .modal-backdrop.show {
                opacity: 0;
              }
            `}</style>
        {/* <a onClick={this.handleShow}>
                    <div className="image">
                        <img src='icons/profesProIcon.svg' />
                    </div>
                    <h5> My Professional Service Provider</h5>
                    <div className="progressbar">
                        <div>70%</div>
                    </div>  
                </a> */}

        {/* <Modal
          show={this.props.show}
          size="lg"
          centered
          onHide={this.props.setproserprovider}
          animation="false"
          backdrop="static"
        > */}
          {/* <Modal.Header closeButton closeVariant="white">
            <Modal.Title> */}
              {/* <h5>Professional Service Provider</h5> */}
              {/* </Modal.Title>
          </Modal.Header> */}
          {/* <Modal.Body className="pb-5 pt-4"> */}
            <div className="person-content p-2">
            {/* {this.props.addNewProff == "addNewProff" &&  */}
              <Col xs md="6" lg="8" className='w-100'>
                <div className='d-flex flex-wrap'>
                    <ProfessServices fetchProfessType = {this.fetchProfessType} updateProCategories = {this.updateProCategories} proCategories = {this.props?.proCategories} getMappedServiceArr = {this.getMappedServiceArr} typeOfPage = {true} calledFrom = {"fromProServiceProvider"}/>
                </div>
                <hr style={{color:"grey"}}/>
                  </Col>
                {/* } */}
                <div className='service_provider'>
                <Row >
                  <Col sm="12" md="12" lg="6">
                       <Accordion style={{ zIndex:"99999", position:"absolute",width : "210px"}} className='Service_accor'>
          <Accordion.Item eventKey="1">
            <Accordion.Header>{$AHelper.mandatory("Select Service Provider")}</Accordion.Header>
            <Accordion.Body className={`${professTypeforselect.length > 0 ? "excelscroll p-0" : ""}`}>
            {professTypeforselect.length > 0 ? professTypeforselect.map((option) => (

<>
                            {konsole.log("chekcekekc", option)}
                            <div className='d-flex'>
                              <Form.Check type="checkbox" id={`checkbox-${option.value}`} checked={option?.checked == true} onChange={(event) => this.handleProfessionalType(event, option)} className="ms-3 mt-1" />
                              <label className='mt-2 ms-2' style={{ fontSize: "12px" }}>{option.label}</label>
                            </div>
                            {
                              option.value === "999999" && option?.checked == true &&
                              <div className='mx-3 mt-2'>
                                <Other othersCategoryId={26} userId={this.state.docUserId} dropValue={option.value} natureId={option?.proCatId} ref={this.professTypeRef} />
                              </div>
                            }
                            <hr style={{ background: "grey" }} />
                          </>
            )):<div className='text-center'>No data available,Please select professional type</div>}
            </Accordion.Body>
          </Accordion.Item>
                       </Accordion>
                 </Col>

            {professSubTypeForSelect.length > 0 && 
            <Col sm="12" md="12" lg="6" className='col mt-5 pt-2 mt-lg-0 pt-lg-0'>
              {/* {this.state.checkProType && */}
               <div className="border-grey">
                     <Accordion className='Sub_Service_Prvdr' style={{width:'210px'}}>
            <Accordion.Item eventKey="1">
              <Accordion.Header className=''>{$AHelper.mandatory("Select Sub Category")}</Accordion.Header>
              <Accordion.Body className={`${professSubTypeForSelect.length > 0 ? "excelscroll p-0" : ""}d-flex justify-content-center`} style={professSubTypeForSelect.length === 0 ? { height: "65px" } : {height: "160px",maxHeight:"100%"}}>
                <Accordion className='1'>
                  {professSubTypeForSelect.length > 0 ?
                    professSubTypeForSelect.map((item, index) => (
                      <Accordion.Item key={index} eventKey={`inner-${index}`}>
                        <Accordion.Header>{item.proType}</Accordion.Header>
                        <Accordion.Body className={`${professSubTypeForSelect.length > 0 ? "excelscrolls" : ""} excelscroll`} style={professSubTypeForSelect.length === 0 ? { height: "65px"} : {zIndex: "9999",position: "absolute",background: "white",border: "1.3px solid rgb(228, 219, 219)"}}>
                          {item?.proSubTypes.length > 0 ? item?.proSubTypes?.sort((a,b)=>{return a?.proSubType?.toLowerCase()?.localeCompare(b?.proSubType?.toLowerCase())}).map((data, ind) => {
                            konsole.log("dttatataCubbb",data)
                            return(
                              <>
                              <div className='d-flex'>
                                <Form.Check
                                  type="checkbox"
                                  //  id={`checkbox-${data.value}`}
                                  // label={}
                                  checked={data?.checked == true}
                                  onChange={(event) => this.handleProfessionalSubType(event, data)}
                                  className="ms-2 mt-1"
                                />
                                <label className='mt-2 ms-2' style={{ fontSize: "12px" }}>{data.proSubType}</label>
                              </div>
                              {
                                data.proSubTypeId == "999999" && data?.checked == true &&
                                <div className='mx-3 mt-2'>
                                  <Other othersCategoryId={28} userId={this.state.docUserId} dropValue={data.proSubTypeId} natureId={data?.proCatId} ref={this.professSubTypeRef} />
                                </div>
                              }
                              <hr style={{ background: "grey" }} />
                            </>

                            )
                            }) : <div className='text-center'>No data available</div>}
                        </Accordion.Body>
                      </Accordion.Item>
                    )) : <div className='text-center'>No data available,Please select service provider</div>}
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>
                     </Accordion>
                 </div>
        {/* } */}

                {/* {
                  this.state.professTypeId == "999999"
                  &&
                  <Col xs sm="6">
                    <Other othersCategoryId={26} userId={this.state.docUserId} dropValue={this.state.professTypeId} ref={this.professTypeRef} natureId={this.state.natureId} />
                  </Col>
                } */}
                </Col>}
                </Row>
              </div>

              <div style={{position: "relative"}}>
              <div className='Professonal_Details pt-lg-5 pt-sm-6'>
                    Professional Details
                </div>
                {/* <div className='border p-2 rounded mb-3'> */}
              <Form.Group as={Row} className="mt-1">
                <Col xs="12" sm="12" lg="4" className='mb-2'>
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
                {/* <Col xs="12" sm="12" lg="4" className='mb-2'>
                  <Form.Control
                    type="text"
                    value={this.state.mName}
                    placeholder="Middle Name"
                    id="mName"
                    onChange={(event) => {
                      this.handleChange(event);
                    }}
                    onBlur={this.handleFocusOut}
                  />
                </Col> */}
                <Col sm="12" lg="4" className='mb-2'>
                  <Form.Control
                  className='upperCasing'
                    type="text"
                    value={this.state.lName}
                    // placeholder={$AHelper.mandatory("Last Name")}
                    placeholder={"Last Name"}
                    id="lName"
                    onChange={(event) => {
                      this.handleChange(event);
                    }}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mt-1">
                <Col sm="6" lg="4" >
                  <input size="" id="businessName" name="businessName" value={this.state.businessName} className="border rounded upperCasing mb-2" placeholder="Business name" onChange={this.handleChange}/>
                </Col> 
                <Col sm="6" lg="4" >
                  <Select
                    className="w-100 p-0 custom-select border rounded mb-2"
                    options={this.state.businessTypes}
                    name="businessTypeId"
                    onChange={e => this.handleBusinessTypeChange(e.value)}
                    value={this.state.businessTypes?.filter(ele => ele.value == this.state.businessTypeId)}
                    placeholder="Business Type"
                  />
                </Col>
                {this.state.businessTypeId == "999999" && <Col sm="6" lg="4" >
                  <Other
                    othersCategoryId={30}
                    userId={this.state?.docUserId}
                    dropValue="999999"
                    ref={this.businessOther}
                    natureId={this.state.natureId}
                  />
                </Col>}
                <Col sm="6" lg="4" >
                  <input size="" id="websiteLink" name="websiteLink" value={this.state.websiteLink} className="border rounded mb-2" placeholder="Website link" onChange={this.handleChange} onBlur={e => this.validateWebLink(e.target.value)} />
                </Col>
              </Form.Group>

              {/* </div> */}
              {/* <AddressListComponent userId={this.state.docUserId} addressDetails={this.addressDetails} /> */}
              {/* <Col xs sm="12" lg="12" className='border p-2 rounded'>
                <div style={{fontSize: "19px", margin: "0 10px"}}>
                    Address
                </div>
                <div className='mt-1'>
              <PlaceOfBirth
                addressDetails={this.addressDetails}
                addressLine={this.addressLines}
                // handlePlaceBirth={this.handlePlaceBirth}
                addressData={this.state.addressData}
                placeholder={true}
                // addNewProff = {this.props.addNewProff}
                protypeTd = {this.props.protypeTd}
                businessName = {this.state.businessName}
                handlebusinessNameChange = {this.handleBusinessNameChange}
              />
              </div>
            </Col> */}
            <Row className="my-3 ">
                <Col xs sm="12" lg="12" className='border p-2 rounded'>
                  <Row className="">
                    <Col xs="12" sm="6" md="4" className="mt-0 mb-2" style={{fontSize: "1.15rem", fontWeight: "400", lineHeight: "1.5"}}>
                      Address
                    </Col>
                  </Row>
                  <DynamicAddressForm ref={this.professionalAddressRef} setLoader={this.props.dispatchloader}/>
                </Col>
              </Row>
            <div className='mt-2'>
              <ProfessionalContact  userId={this.state.docUserId}  ref={this.professionalContactRef} key = {this.state.docUserId} fromModal="proServiceProvider"/>
            </div>

            {/* ------------------------For same as spouse----------------------------- */}

            {this.state.spouseId !== "null" && <Row className="m-0 mt-2 border pb-2 pt-1 ps-3 rounded">
              <Col xs sm="10" lg="9" id="healthInsurance1">
                <label className="mb-1">
                  {`Does your ${this.state.maritalStatusId == 2 ? "partner" : "spouse"} use the same Professional?`}{" "}
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
                      checked={this.props.addNewProff == "addNewProff" ? null : this.state?.sameWithPrimary == true}
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
                      checked={this.props.addNewProff == "addNewProff" ? null : this.state?.sameWithPrimary == false}
                    />
                  </div>
                </div>
              </Col>
            </Row>}

            </div>
              {/* <ContactListComponent userId={this.state.docUserId} contactDetails={this.contactDetails} /> */}
            </div>
          {/* </Modal.Body> */}
          {/* <Modal.Footer className="border-0"> */}
            <Button className="theme-btn mt-1 ms-2" 
            onClick={()=>this.addProfessional()}
            >{this.props.toUpdate ? "Update" : "Save" }</Button>

            {(this.props.toUpdate == false && this.props.enableAddAnother == true) && <Button className="theme-btn mt-1 ms-2" 
            onClick={()=>{
              this.props.clickedAddAnother(); 
              this.addProfessional();
            }}
            >Save and Add Another</Button>}
            

            {/* <Table bordered>
                            <thead>
                                <tr>
                                    <td>Description of Retirement Assets</td>
                                    <td>Name of Institution</td>
                                    <td>Balance</td>
                                    <td>Owner</td>
                                    <td>Beneficiary</td>   
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>Checking Account</td>
                                    <td>Bank of America</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>

                                </tr>
                            </tbody>
                            </Table> */}
          {/* </Modal.Footer> */}
         {/* </Modal> */}
      </>
    );
  }
}


const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProServiceProvider);