import React, { Component } from "react";
import {
  Button,
  Modal,
  Table,
  Form,
  Col,
  Card,
  Row,
  Breadcrumb,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Select from "react-select";
import { connect } from "react-redux";
import { $CommonServiceFn, $getServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import Primarycarephysician from "./primarycarephysician";
import { SET_LOADER } from "./Store/Actions/action";
import "react-phone-input-2/lib/style.css";
import "react-phone-input-2/lib/bootstrap.css";
import FinancialAdvisor from "../components/FinancialAdvisor";
import Accountant from "../components/Accountant";
import ProServiceProvider from "../components/ProServiceProvider";
import Specialists from "./specialists";
import { $AHelper } from "../components/control/AHelper";
import BookKeepar from "./Bookkeeper";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import FinancialAdvisorMoreInfo from "./FinancialAdvisorMoreInfo";
import AccountantMoreInfo from "./AccountantMoreInfo";
import { globalContext } from "../pages/_app";
import OtherInfo from "./asssets/OtherInfo";
import AlertToaster from "./control/AlertToaster";
import ProfessServices from "./ProfessServices";
import AddnewProfessmembermodal from "../components/Agentsetguidance/Addnewprofessionalmodal"
import { aorgLink,aorgLinkWithoutSlash } from "./control/Constant";
import { financialAdvisorMoreInfo, accountantMoreinfo } from "./control/Constant";
import { removeSpaceAtStart } from "./Reusable/ReusableCom";

class professSearch extends Component {
  static contextType = globalContext;
  constructor(props,context) {
    super(props,context);
    this.state = {
      pshow: this.props.pshow || false,
      showAddMember: false,
      show: false,
      userId: "",
      updatethis: false,
      fName: "",
      mName: "",
      lName: "",
      emailId: "",
      mobileNo: "",
      disablecheckbox: "data",
      showPhysician: false,
      professionaTypeList: [],
      showSpecialist: false,
      showadvisor: false,
      showaccoutant: false,
      showproserprovider: false,
      showBookeepar: false,
      proSerDescId: this.props.protypeTd,
      isPrimary: false,
      loggedInUser: sessionStorage.getItem("loggedUserId") || "",
      alreadyhaveprimaryphysician: false,
      alreadySpecialist: false,
      toUpdate: false,
      financMoreInfocheckboxdisable: false,
      professionalUserList: [],
      rowsOfPage: 10,
      fetchOnClickArrow: false,
      pageNumber: 1,
      searchText: "",
      // searchType: "",
      searchValue: "",
      showProffTable: false,
      restrictAddProfessional: "false",
      allMemberList: [],
      addNewProff: "",
      iseditprofile: this?.props?.showForm == 2 ? false : true,
      professionalButtonborder:this?.props?.showForm == 2 ? 2 : 1,
      groupedData: [],
      previouslySavedData: [],
      activeUser: this.props.activeUser,
      showMenu: false,
      showTooltip: false,
      tooltipText: "",
      userDetails : {},
      spouseUserId : "",
      hoveredIndex : "",
      addProfessFrom : "List",
      checksOfProSerDesc : [],
      userInfDetail:{},
      responseuserDetail: {},
      searchAllMemberProffList:[],
      aorgProffDetail : {},
      bothUsersIds : [],
      checkSameProff : false,
      sameProffOrNot : null,
      deleteFromSpouse : null,
      userSubDataIdOfFinanAdvToUncheck : "",
      userSubDataIdOfAccoToUncheck:"",
      spouseProCatMap: {}
    };
  }

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let spouseUserId = sessionStorage.getItem("spouseUserId") || "";
    let userDetails = sessionStorage.getItem('userDetailOfPrimary') 
    let primaryIds = [{id : newuserid},{id : spouseUserId}]
    let userId = this.props.protypeTd === "11" ? this.props.UserDetail.userId : (this.state.activeUser === "2") ? spouseUserId : newuserid     
    konsole.log("PropsSearch",this.props,newuserid,spouseUserId)

    this.setState({ userId: (this.state.activeUser === "2") ? spouseUserId : newuserid, userDetails : JSON.parse(userDetails), spouseUserId : spouseUserId, primaryuserId : newuserid, bothUsersIds : primaryIds});
    if (this.props.protypeTd == "10") this.Fetchprimaryphysician();

    this.fetchProfessionalType();
    this.fetchAndDisplaySearchList(userId,newuserid);
    this.getsubjectForFormLabelIdForFinancialAdvisor(newuserid)
    this.getsubjectForFormLabelIdForAccountant(newuserid)

    // window.addEventListener('message', (event) => {
    //   konsole.log("eventOriginnnn",event.origin,event)
    //    if(event.origin === 'https://aoorgdev.azurewebsites.net') 
    //    konsole.log("Click User_Id:",event.data);
    //  });
  }

  componentDidUpdate(prevProps, prevState) {

    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let spouseUserId = sessionStorage.getItem("spouseUserId") || "";
    // let userId = (this.state.activeUser === "2") ? spouseUserId : newuserid 
    if (prevState.activeUser !== this.state.activeUser) {
      let userId = (this.state.activeUser === "2") ? spouseUserId : newuserid;
      this.setState({ userId: userId }, () => {
        this.fetchAndDisplaySearchList(userId,newuserid);
      });
    }
    
    if(prevState.checksOfProSerDesc !== this.state.checksOfProSerDesc){
      if(this.state.addProfessFrom == "Aorg"){
        this.selectListOrAorg("Aorg",this.state.checksOfProSerDesc)
      }

      if(this.state.professionalUserList?.length > 0 && this.state.professionalButtonborder == 1){
        this.fetchDiscplayAndSearch("ClickedToSearch")
      }
      // this.filterProfessByType()
    }
    // if(prevState.showSpecialist !== this.state.showSpecialist && this.state.showSpecialist === true){
    //   this.setState({ rendering: Math.random()   })  
    // }
    if(prevProps.showForm != this.props.showForm){
      this.state({
        professionalButtonborder:this.props.showForm
      })
    }
  }

  getUserPrimaryCareMap = (userId, proUserId) => {
    return new Promise((resolve, reject) => {
      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.mapGetPrimaryCare + `/${userId}?ProUserId=${proUserId}`, "", 
      (response, errorData) => {
        if(response.data?.data?.length) {
          konsole.log("vishnudb getrslt", response.data?.data[0]?.userPrimaryCareMapId)
          return resolve(response.data?.data[0]?.userPrimaryCareMapId);
        }
        return resolve(errorData)
      })
    })
  }

  unMapUserPrimaryCareMap = ( userPrimaryCareMapId ) => {
    const json = {
      userPrimaryCareMapId: userPrimaryCareMapId,
      isDeleted: true,
      remarks: "",
      updatedBy: this.state.loggedInUser
    }
    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.mapUpdatePrimaryCare , json, 
    (response, errorData) => {
      if(response) {
        this.fetchAndDisplaySearchList(this.state.userId, sessionStorage.getItem("SessPrimaryUserId"));
      }
      this.props.dispatchloader(false);
    })

  }

  mapForSpouse = (proUserId) => {
    konsole.log("vishnudbInsideMapForSpouse", proUserId)
    const primaryUserId = this.state.primaryuserId
    const loggedInUser = this.state.loggedInUser;
  
    // only 
    if(primaryUserId != this.state.userId) return;
  
    // to get primaryCareId
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.mapGetPrimaryCare + `/${primaryUserId}?ProUserId=${proUserId}`, "", 
      (response, errorData) => {
        if(response.data?.data?.length) {
          const primaryCareId = response.data?.data[0]?.primaryCareId;
          konsole.log("vishnudbGotPrimaryCareId", primaryCareId);
  
          // to get physician's data running
          // get-primarycaremember-by-id API
          $CommonServiceFn.InvokeCommonApi("GET", `${$Service_Url.getPrimaryCareMemberById}/${primaryUserId}/${primaryCareId}`, "",
            (response, errorData) => {
              if(errorData) {
                this.props.dispatchloader(false);
                konsole.log("vishnudb error @ get-primarycaremember-by-id")
                return;
              }
  
              // json for updating physician's data
              const json1 = {
                userId: response.data.data.userId,
                physician: {
                  docMemberUserId: response.data.data.physicians[0]?.docMemberUserId,
                  doc_License: response.data.data.physicians[0]?.doc_License,
                  experience_yrs: response.data.data.physicians[0]?.experience_yrs,
                  is_Primary: response.data.data.physicians[0]?.is_Primary,
                  is_GCM: response.data.data.physicians[0]?.is_GCM,
                  is_GCM_Certified: response.data.data.physicians[0]?.is_GCM_Certified,
                  speciality_Id: response.data.data.physicians[0]?.speciality_Id,
                  other: response.data.data.physicians[0]?.other,
                  is_Primary_Care: response.data.data.physicians[0]?.is_Primary_Care,
                  happy_With_Service: response.data.data.physicians[0]?.happy_With_Service,
                  visit_Duration: response.data.data.physicians[0]?.visit_Duration,
                  isSameSpecialist: true, // setting it to true
                  pro_User_Id: response.data.data.physicians[0]?.pro_User_Id,
                  isProUserAdded: response.data.data.physicians[0]?.isProUserAdded,
                  updatedBy: loggedInUser,
                  primary_Care_Id: response.data.data.physicians[0]?.primary_Care_Id,
                  doc_User_Id: response.data.data.physicians[0]?.doc_User_Id,
                  remarks: response.data.data.physicians[0]?.remarks,
                  isActive: response.data.data.physicians[0]?.isActive
                }
              }
              konsole.log("vishnudb json1 | response", json1, response.data.data);
  
              // putPrimaryCarePhysicianPath
              $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putPrimaryCarePhysicianPath, json1,
                (response, errorData) => {
                  if(errorData) {
                    this.props.dispatchloader(false);
                    konsole.log("vishnudb error @ putPrimaryCarePhysicianPath")
                    return;
                  }
  
                  // json for userPrimaryCareMap API
                  const json2 = {
                    userId: this.state.spouseUserId,
                    primaryCareId: primaryCareId,
                    sameAsUserId: primaryUserId,
                    createdBy: loggedInUser
                  }
  
                  // userPrimaryCareMap API
                  $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.mapUpdatePrimaryCare , json2, 
                    (response, errorData) => {
                      this.props.dispatchloader(false);
                      if(response) {
                        konsole.log("vishnudbMappedToSpouse", response)
                        this.handleClose();
                        this.fetchAndDisplaySearchList(this.state.userId, sessionStorage.getItem("SessPrimaryUserId"));
                      }
                    }
                  )
  
                }
              )
  
            }
          )
  
        }
  
      }
    )
  }

  Fetchprimaryphysician = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getPrimaryPhysician + this.props.UserDetail.userId,
      "",
      (response, errorData) => {
        this.props.dispatchloader(false);
        if (response) {
          let tempprimary = response.data.data.physicians.filter(
            (v, j) => v.is_Primary_Care == true
          );
          let tempprimaryNo = response.data.data.physicians.filter(
            (v, j) => v.is_Primary_Care == false
          );
          if (!tempprimary.length) return;
          konsole.log("primarycarer physucauna", tempprimary);
          this.setState({
            ...this.state,
            alreadyhaveprimaryphysician: true,
            primaryphysiciandetails: tempprimary,
          });
        }
      }
    );
  };

  fetchProfessionalType = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getProfesType,
      this.state,
      (response) => {
        this.props.dispatchloader(false);
        if (response) {
          this.setState({
            ...this.state,
            professionaTypeList: response.data.data,
          });
        }
      }
    );
  };

  CallSearchApi = (userId) => {
    this.fetchAndDisplaySearchList(userId);
    this.props?.FetchFamilyMembers(this.state.primaryuserId);
  };

  disableProfessionalAdd = (state) => {
    konsole.log("state at accountatn", state);
    this.setState({
      restrictAddProfessional: state,
    });
  };
  
  callapidata = (proTypeId, searchForProff, proUserId,proSerDescId) => {
    konsole.log(
      "userIDDatata",
      this.props.protypeTd,
      this.props,
      proTypeId,
      searchForProff,
      proUserId,
      this.state.searchValue
    );

    const inputData = {
      searchName:
        this.state.searchValue !== "" &&
        this.state.searchValue !== undefined &&
        this.state.searchValue !== null &&
        searchForProff == "ClickedToSearch"
          ? this.state.searchValue
          : {},
      pageNumber:
        searchForProff == "ClickedToSearch" ? 1 : this.state.pageNumber,
      rowsOfPage:
        searchForProff == "checkPreviouslyAdded" ? 0 : this.state.rowsOfPage,
      proTypeId: proTypeId || this.props.protypeTd || 0,
      ProSerDescId: proSerDescId || 0,
      ProUserId: proUserId || 0,
    };

    // konsole.log("scrollDetailpostdata", JSON.stringify(inputData));
    // this.props.dispatchloader(true);
    $getServiceFn.getProfessUsers(inputData, (res, err) => {
      if (res) {
        // this.props.dispatchloader(false);

        const proffResponse = res.data.data;
        konsole.log("responseProf1212Search", proffResponse, this.state.searchAllMemberProffList);

        if (searchForProff === "checkPreviouslyAdded") {
          const outerObject = proffResponse[0];
          for (let i = 0; i < outerObject.proCategories?.length; i++) {
            const innerObject = outerObject.proCategories[i];
            innerObject.proUserId = outerObject.proUserId;
          }
          this.setState({
            previouslySavedData: proffResponse[0]?.proCategories,
          });
        } else {
          let data = this.state.professionalUserList;
          if (this.state.fetchOnClickArrow == true) {
            data.push(...proffResponse);
            konsole.log("datadd", data);
            this.setState({
              fetchOnClickArrow: false,
              professionalUserList: data,
            });
          } else {

            for(let i = 0; i< proffResponse.length; i++){
              for(let j = 0; j< this.state.searchAllMemberProffList.length; j++){
                if(proffResponse[i].proUserId === this.state.searchAllMemberProffList[j].proUserId ){
                  proffResponse[i]["disabled"] = true;
                }
              } 
            }

            this.setState({
              // showAddMember: false,
              professionalUserList: proffResponse,
            });
          }
          if (this.state.showProffTable == true) {
            setTimeout(() => {
              // alert("called")
              const footer = document.querySelector(".modal-footer");
              konsole.log("modalFooter", footer);
              footer?.scrollIntoView({ block: "end", behavior: "smooth" });
            }, 500);
          }
        }
      } else {
        // this.props.dispatchloader(false);
        konsole.log("proff error", err);
        let errorMsgStatus = err ? err.data.status : null;
        if (errorMsgStatus == 404 && searchForProff == "ClickedToSearch") {
          this.setState({
            // showAddMember: true,
            professionalUserList: [],
          });
          // this.props.dispatchloader(false);
        }
      }
    });
  };

  handleInputChnage = (event) => {
    let eventId = event.target.name;
    let eventValue = event.target.value;
    konsole.log("eventsevents", eventValue, eventId);

    if (
      (eventValue == "" || eventValue == undefined || eventValue == null) &&
      eventId == "searchValue"
    ) {
      this.state.searchValue = "";
      // this.callapidata(this.props.protypeTd)
    } else if (
      eventId == "fName" ||
      eventId == "lName" ||
      eventId == "nickName" ||
      eventId == "mName" ||
      eventId == "searchValue"
    ) {
      let nameValue = $AHelper.capitalizeFirstLetter(eventValue);
      nameValue = removeSpaceAtStart(nameValue)
      if ($AHelper.isRegexForAll(nameValue)) {
        this.setState({
          ...this.state,
          [eventId]: nameValue,
        });
      }
    } else {
      this.setState({
        ...this.state,
        [eventId]: eventValue,
      });
    }
  };

  invokeEditProfessional = async (val, addForUser) => {
    let filterGroupDataToEditForUser = []
    konsole.log("addForUser", val, addForUser,this.state.bothMemProfessionals);
    this.callapidata("", "checkPreviouslyAdded", val.proUserId);
    if (val.hasOwnProperty("proFullName")) {
      let names = val.proFullName?.includes(" ")
        ? val.proFullName.split(" ")
        : val.proFullName;
      let proffNames = [];

      for (let i = 0; i < names.length; i++) {
        if (names[i] !== "") {
          proffNames.push(names[i]);
        }
      }

      if (proffNames.length == 3) {
        val["fName"] = proffNames[0];
        val["mName"] = proffNames[1];
        val["lName"] = proffNames[2];
      } else {
        val["fName"] = proffNames[0];
        val["lName"] = proffNames[1];
      }

      konsole.log("vallalalla",val,addForUser)
     if(addForUser !== "Aorg"){
        filterGroupDataToEditForUser =
         this.state.professionalUserList.filter(
           (item) => item.proUserId == val.proUserId
         );
 
       const outerObject = filterGroupDataToEditForUser[0];
       for (let i = 0; i < outerObject?.proCategories?.length; i++) {
         const innerObject = outerObject.proCategories[i]
         innerObject.proUserId = outerObject.proUserId
       }
     }
      konsole.log("filterGroupDataToEditForUser",val, filterGroupDataToEditForUser);
    
      this.setState({
        responseuserDetail: val,
        proCategories: addForUser == "Aorg" ? val.proCategories  : filterGroupDataToEditForUser[0]?.proCategories,
        toUpdate: false,
        alreadySpecialist: false,
        showProffTable: false,
        addNewProff: addForUser,
        showSpecialist : true,
        showadvisor : true,
        showaccoutant : true,
        showBookeepar : true,
        show : true,
      });
    } else {
      konsole.log("dtatatatGrouped", this.state.groupedData, val);
      const filterGroupedDataToEdit = this.state.groupedData.filter(
        (item) => item.proUserId == val.proUserId
      );
      
      konsole.log("filterGroupedDataToEdit", filterGroupedDataToEdit);
      this.setState({
        // responseuserDetail: val,
        responseuserDetail: val,
        proCategories:
        addForUser == "updateForUser" ? filterGroupedDataToEdit : [],
        alreadySpecialist: true,
        toUpdate: true,
        addNewProff: "updateForUser",
        showProffTable: false,
        showSpecialist : true,
        showadvisor : true,
        showaccoutant : true,
        showBookeepar : true,
        show : true,
      });

      if(this.state.bothMemProfessionals == undefined) await this.fetchBothProfessData()
      const bothMemProfessionals = this.state.bothMemProfessionals;
      
      if(bothMemProfessionals?.length > 0 && bothMemProfessionals !== undefined){
        for(const value of bothMemProfessionals){
          if((value.userId !== this.state.userId) && (value.professionalUserId == val.professionalUserId)){
            this.setState({checkSameProff : true, spouseProCatMap : value.proCatMap})
            break;
          }
          else{
            this.setState({checkSameProff : false, spouseProCatMap: {}})
          }
        } 
      }
    }

    // if (this.props.protypeTd == "10") {
    //   this.showPhysician();
    // } else if (this.props.protypeTd == "11") {
    //   this.showSpecialist();
    // } else if (this.props.protypeTd == "1") {
    //   this.setshowadvisor();
    // } else if (this.props.protypeTd == "3") {
    //   this.setshowaccoutant();
    // } else if (this.props.protypeTd == "") {
    //   // this.setproserprovider();
    // } else if (this.props.protypeTd == "12") {
    //   this.setBookeeparShow();
    // }
    this.getColorChange(2);
    this.setState({
      iseditprofile: false,
    });
  };


 invokeApiPromise = (method, url, data) => {
  return new Promise((resolve, reject) => {
    $CommonServiceFn.InvokeCommonApi(method, url, data, (response, errorRes) => {
      if (response) {
        resolve(response);
      } else if (errorRes) {
        reject(errorRes);
      }
    });
  });
};

fetchBothProfessData = async (userId, primaryUserId) => {
  const getUrl = $Service_Url.getSearchProfessional;
  const fetchPromises = [];
  let _bothMemlist = [];

  for (const [ind, val] of this.state.bothUsersIds.entries()) {
    try {
      const response = await this.invokeApiPromise(
        "GET",
        getUrl + `?MemberUserId=${val.id}&EmailId=${this.state.emailId}&MobileNo=${this.state.mobileNo}&ProTypeId=${this.props.protypeTd}&Name=${this.state.fName}&primaryUserId=${this.state.primaryuserId}`,
        ""
      );

      response.data.data.forEach(ele => ele.userId = val.id);
      // konsole.log("vishnudbresponse123", response.data.data, val.id)
      const proffdata = response.data.data;
      _bothMemlist.push(proffdata);
      if (proffdata.length !== 0) {
        const groupedData = {};
        proffdata.forEach((obj) => {
          if (groupedData[obj.proUserId]) {
            groupedData[obj.proUserId].proType += `, ${obj.proType}`;
            groupedData[obj.proUserId].proCatMap = {...groupedData[obj.proUserId].proCatMap, [obj.proCatId]: obj.userProId}
          } else {
            groupedData[obj.proUserId] = { ...obj, proCatMap: {[obj.proCatId]: obj.userProId} };
          }
        });
        const result = Object.values(groupedData);
        fetchPromises.push(result);
      }
    } catch (error) {
      konsole.log("errorRes121", error);
      fetchPromises.push([]);
    }
  }

  this.setState({
    bothMemlist: _bothMemlist.flat(1)
  });

  const combinedResult = fetchPromises.flat();
  konsole.log("combinedResult12121",combinedResult)
  this.setState({
    bothMemProfessionals: combinedResult,
  });
};

  
  
  

  fetchAndDisplaySearchList = (newuserid,primaryUserId) => {
    let userId = this.props.UserDetail == undefined ? newuserid : this.props.UserDetail.userId;
    konsole.log("userIddd",this.props.UserDetail,userId,newuserid,)
    const sendData = `?MemberUserId=${userId}&EmailId=${this.state.emailId}&MobileNo=${this.state.mobileNo}&ProTypeId=${this.props.protypeTd}&Name=${this.state.fName}&primaryUserId=${primaryUserId}`
    const getUrl = $Service_Url.getSearchProfessional
    
    this.props.dispatchloader(true);
    konsole.log("isdsdjsnd", this.props.UserDetail,this.props.protypeTd,userId,getUrl,sendData);
    $CommonServiceFn.InvokeCommonApi("GET", getUrl + sendData ,"",(response, errorRes) => {
        if (response) {
          this.props.dispatchloader(false);
          konsole.log("responseFetch",response)
          const data = response.data.data;
          if (data.length !== 0) {
            // this.props.dispatchloader(false);
            konsole.log("responseProNew", response);
            this.setState({ groupedData: data });
            const groupedData = {};
            data.forEach((obj) => {
              if (groupedData[obj.proUserId]) {
                if(groupedData[obj.proUserId].proType?.includes(obj.proType) == false) groupedData[obj.proUserId].proType += `, ${obj.proType}`;
              } else {
                groupedData[obj.proUserId] = { ...obj };
              }
            });
            const result = Object.values(groupedData);

            konsole.log("groupedData",groupedData,result,data,this.state.showProffTable);
            this.setState({
              allMemberList: this.props.protypeTd == "11" ? data : result,
              searchAllMemberProffList:result,
              financMoreInfocheckboxdisable: response.data.data.length > 0 ? true : false,
            });
          }
        } else if (errorRes) {
          konsole.log("errorRes1212",errorRes)
          let errorMsgStatus = errorRes ? errorRes.data.statusCode : null;
          if (errorMsgStatus == 404) {
            this.setState({
              showAddMember: true,
              searchAllMemberProffList : []
            });
          }
          this.props.dispatchloader(false);
        }
      }
    );
  };

  searchRecommProfessional = (event) =>{
    konsole.log("evneettet",event)
    if (event.key === 'Enter') {
      this.fetchDiscplayAndSearch("ClickedToSearch")
      if(this.state.addProfessFrom == "Aorg")
       this.setState({addProfessFrom : "List"})
    }
  }

  fetchDiscplayAndSearch = (searchForProff) => {
    konsole.log("this.state.searchValue", this.state.searchValue);
    this.setState({ showProffTable: true });
    if (
      this.state.searchValue !== "" &&
      this.state.searchValue !== undefined &&
      this.state.searchValue !== null
    ) {
      if (this.props.protypeTd === "") {
        const checkedValues = this.state.checksOfProSerDesc.filter(value => value.checked);
        if (checkedValues.length > 0) {
          checkedValues.forEach(checkedValue => {
            this.callapidata(this.props.protypeTd, searchForProff, null, parseInt(checkedValue.value));
          });
        } else {
          // this.toasterAlert("Please select professional type to search", "Warning");
          // this.setState({professionalUserList : []})
          this.callapidata(this.props.protypeTd, searchForProff, null, "");
        }
      } else {
        this.callapidata(this.props.protypeTd, searchForProff);
      }      
    } else {
      this.fetchAndDisplaySearchList(this.state.userId);
    }
  };

  saveContactDetails = (typeofSave) => {
    let contactTypeId = this.state.contactTypeId;
    let mobileNo = this.state.mobileNo;
    let emailId = this.state.emailId;
    let regexName = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // konsole.log("conacttype", contactTypeId);
    if (typeofSave == "email") {
      if (regexName.test(emailId)) {
        this.setState({
          ...this.state,
          emailsList: [
            ...this.state.emailsList,
            { contactTypeId: contactTypeId, emailId: emailId },
          ],
          contactTypeId: "",
          emailId: "",
        });
      } else {
        this.setState({
          ...this.state,
          contactTypeId: "",
          emailId: "",
        });
        // alert("Enter the valid EmailId");
        this.toasterAlert("Enter the valid EmailId", "Warning");
      }
    } else if (typeofSave == "mobile") {
      if (mobileNo.length == "10") {
        this.setState({
          ...this.state,
          mobileNoList: [
            ...this.state.mobileNoList,
            { contactTypeId: contactTypeId, mobileNo: mobileNo },
          ],
          contactTypeId: "",
          mobileNo: "",
        });
      } else {
        this.setState({
          ...this.state,
          contactTypeId: "",
          mobileNo: "",
        });
        // alert("Enter the valid Cell Number");
        this.toasterAlert("Enter the valid Cell Number", "Warning");
      }
    }
  };

  handlepersonalinfosubmit = (addNewProff) => {
    const subtenantId = sessionStorage.getItem("SubtenantId")
    konsole.log(
      "addNewProffaddNewProff",
      addNewProff,
      this.state.fName,
      this.state.lName
    );
    this.setState({
      alreadySpecialist: false,
      addNewProff: addNewProff,
      showProffTable: false,
      previouslySavedData: [],
      proCategories: [],
    });
    let inputdata = {
      subtenantId: subtenantId,
      fName: this.state.fName ? this.state.fName : "pro-first-name",
      mName: this.state.mName,
      lName: this.state.lName ? this.state.lName : "pro-last-name",
      isPrimary: this.state.isPrimary,
      memberRelationship: null,
      createdBy: this.state.loggedInUser,
    };
    konsole.log("prosearch result", inputdata);

    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "POST",
      $Service_Url.postAddMember,
      inputdata,
      (response) => {

        // konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          // this.handleShow();
          konsole.log( "prosearch result at member creation", response.data.data);
          let responseData = response.data.data.member;
          // debugger;
          konsole.log('responseDataresponseData',responseData)
          let newProfessionalDetail = {
            ...responseData,
            fName: responseData.fName === "pro-first-name" ? "" : responseData.fName,
            lName: responseData.lName === "pro-last-name" ? "" : responseData.lName,
          };
          konsole.log('newProfessionalDetail',this.props,newProfessionalDetail)
          // debugger;
          this.setState({responseuserDetail: newProfessionalDetail, toUpdate: false,});
          // debugger;
          this.resetState();
          konsole.log("addNewProffAddResponse", newProfessionalDetail);
          if (this.props.protypeTd == "10") {
            this.showPhysician();
          } else if (this.props.protypeTd == "1") {
            this.setshowadvisor();
            this.setState(  
              {
                // toUpdate: false,
                iseditprofile: false,
                proCategories: [],
                // advisorUserDetail : newProfessionalDetail,
              },
              () => {
                this.setshowadvisor();
              }
            );
          } else if (this.props.protypeTd == "3") {
            this.setState(
              {
                // toUpdate: false,
                // accountantUserDetail : newProfessionalDetail,
              },
              () => this.setshowaccoutant()
            );
          } else if (this.props.protypeTd == "") {
            this.setState(
              {
                // toUpdate: false,
                iseditprofile: false,
                proCategories: [],
              },
              () => {
                this.setproserprovider();
              }
            );
          } else if (this.props.protypeTd == "11") {
            this.setState(
              {
                // toUpdate: false,
              },
              ()=>{
                this.showSpecialist();
              })
          } else if (this.props.protypeTd == "12") {
            this.setState(
              {
                // toUpdate: false,
                // bookkeeperUserDetail: newProfessionalDetail
              },
              () => this.setBookeeparShow()
            );
          }

          this.props.dispatchloader(false);
        } else {
          this.props.dispatchloader(false);
          // alert(Msg.ErrorMsg);
          konsole.log("ererere",Msg,Msg.ErrorMsg)
          this.toasterAlert(Msg.ErrorMsg, "Warning");
        }
      }
    );
  };

  handleClose = (SameAs) => {
    konsole.log(this.props,"ooooooooooooooooooooooo")
    this.setState({
      pshow: !this.state.pshow,
      pshow : (SameAs == "SameAs") && false,
      showProffTable : false,
      professionalUserList : [],
    });
    this.resetState();
    this.props.dispatchloader(false)
    if(this?.props?.showForm == 2 && (this.props.protypeTd == "7" || this.props.protypeTd == '13' || this.props.protypeTd == '4' || this.props.protypeTd == '14'|| this.props.protypeTd == '1'|| this.props.protypeTd == '12'|| this.props.protypeTd == '3'|| this.props.protypeTd == '2')){
      this.props.setshowaddprofessmodal(false)
    }
  };

  setBookeeparShow = () => {
    this.setState({
      showBookeepar: true,
    });
  };

  handleShow = () => {
    this.setState({
      pshow: !this.state.pshow,
      iseditprofile: true,
      professionalButtonborder: 1,
      addProfessFrom : "List"
    }); 
   this.changeBackground("1")
  this.searchYourProfess("",this.state.allMemberList)
  this.fetchBothProfessData()
  };
  setshowadvisor = () => {
    this.setState({
      showadvisor: true,
    });
  };

  setSpecialist = () => {
    this.setState({
      showSpecialist: true,
    });
  };

  setshowaccoutant = () => {
    this.setState({
      showaccoutant: true,
    });
  };

  setproserprovider = () => {
    this.setState({
      showproserprovider: true,
    });
  };

  showPhysician = () => {
    this.setState({
      show: true,
    });   
  };

  showSpecialist = () => {
    this.setState({
      showSpecialist: true,
    });
  };

  hideSpecialist = () => {
    this.setState({
      sshow: !this.state.show,
    });
  };

  hidePhysician = () => {
    this.setState({
      show: !this.state.show,
      pshow: false,
    });
  };

  resetState = () => {
    this.setState({
      fName: "",
      mName: "",
      lName: "",
      emailId: "",
      mobileNo: "",
    });
  };

  handleMobileNo = (value) => {
    if (value) {
      // if (!isValidPhoneNumber(value))
      this.setState({
        mobileNo: value,
      });
      // else {
      //   alert("Max length achieved")
      // }
    }
  };
  PhoneFormat = (value) => {
    konsole.log("pjoneFormateData", value?.split(","));
    let phnoneArray = value?.split(",");
    const newArr = [];
    for (let i = 0; i < phnoneArray?.length; i++) {
      let str = phnoneArray[i].slice(-10);
      let codeC = phnoneArray[i].slice(0, -10);
      let cleaned = ("" + str).replace(/\D/g, "");
      let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

      if (match) {
        let fornum =
          codeC + "" + "(" + match[1] + ") " + match[2] + "-" + match[3] + " ";
        newArr.push(fornum);
      }
    }
    return newArr;
  };

  handleFocusOut = () => {
    let attrvalue = this.state.mName;
    if (attrvalue.length !== 0) {
      if (attrvalue.length === 1) {
        attrvalue = attrvalue + ".";
      }
    }
    this.setState({
      mName: attrvalue,
    });
  };

  toasterAlert(text, type) {
    this.context.setdata({ open: true, text: text, type: type });
  }

  // scrollCallBack = (e) => {
  //   const node = e.target;
  //   konsole.log("scroll occurs", e.target);

  //   if (node) {
  //     const { scrollTop, scrollHeight, clientHeight } = node;
  //     konsole.log(
  //       "scrollDetail",
  //       Math.ceil(scrollTop + clientHeight),
  //       scrollHeight
  //     );
  //     // const scrollScreen = scrollTop + clientHeight  ;
  //     if (Math.ceil(scrollTop + clientHeight) === scrollHeight) {
  //       // if (scrollScreen >= scrollHeight / 1.15) {
  //       this.setState(
  //         {
  //           fetchByScroll: true,
  //           pageNumber: this.state.pageNumber + 1,
  //         },
  //         () => {
  //           this.callapidata(this.props.protypeTd);
  //         }
  //       );
  //       // setByScroll(true);
  //       // setPageNumber(pageNumber + 1);
  //       // setLoading(true);
  //     }
  //   }
  // };

  // handleSearchByType = (e) => {
  //   konsole.log("target", e.target.value, e.target.id);
  //   this.setState({
  //     searchType: e.target.id,
  //   });
  // };

  handlFinanceProfessional = () => {
    const protypeTd = this.props.protypeTd;
    // let IsActive = true;
    // let professinalName = "";
    if (protypeTd === "1" && this.state.restrictAddProfessional === "true") {
      // IsActive = false;
      // professinalName = "Financial Advisor";
      this.handleUpdateSubmitForFinanAdvi(this.state.userSubDataIdOfFinanAdvToUncheck,this.state.primaryuserId)
    } else if (
      protypeTd === "3" &&
      this.state.restrictAddProfessional === "true"
      ) {
        // IsActive = false;
        // professinalName = "Accountant";
        this.handleUpdateSubmitForAccountant(this.state.userSubDataIdOfAccoToUncheck,this.state.primaryuserId)
    } else if (protypeTd === "12" && this.props.isNotBookkeeper === true) {
      // IsActive = false;
      // professinalName = "Bookkeeper";
      this.props.handleUpdateSubmit(this.props.userSubDataIdOfBookToUncheck,false,386,196)
    }

    // if (!IsActive)
    //   return this.toasterAlert(
    //     `You have choosed I dont have the ${professinalName}. Please unselect the checkbox to proceed further.`,
    //     "Warning"
    //   );

    this.handleShow();
  };

  deleteProfess = async (data, loggedUserId,removeFromSpouse) => {
    konsole.log("datataDelete",data,loggedUserId,this.state.groupedData);
  
    let ques = removeFromSpouse !== true ? await this.context.confirm( true, "Are you sure? You want to delete your professional.", "Confirmation") : true;
    let deleteProffData = removeFromSpouse == true ? this.state.bothMemlist : this.state.groupedData
    let filterProffToDelete = deleteProffData.filter(item => item.professionalUserId == data?.professionalUserId && item.userId == data.userId);
    konsole.log("filterProffToDelete1212",filterProffToDelete)
    let array = []
    for(let i = 0; i < deleteProffData.length; i++){
      let index = i;

      if(filterProffToDelete[i]?.professionalUserId == data.professionalUserId){
        // alert("called")
      const json = {
      userId: filterProffToDelete[i]?.professionalUserId,
      userProId: filterProffToDelete[i]?.userProId,
      deletedBy: loggedUserId
      }
    if(ques){
      this.props.dispatchloader(true);

      // logics for unmapping userPrimaryCareMap
      if(filterProffToDelete[i]?.proTypeId == "11") {
        if((this.state.userId == this.state.primaryuserId && removeFromSpouse == true) || (this.state.userId == this.state.spouseUserId && removeFromSpouse == undefined && this.state.bothMemProfessionals.some(ele => ele.userId != this.state.userId && ele.proUserId == filterProffToDelete[i].proUserId))) {
          const userPrimaryCareMapId = await this.getUserPrimaryCareMap(this.state.spouseUserId, filterProffToDelete[i].proUserId);
          konsole.log("vishnudbunderdelete", userPrimaryCareMapId, filterProffToDelete[i]);
          if(userPrimaryCareMapId) {
            this.unMapUserPrimaryCareMap(userPrimaryCareMapId);
            continue;
          }
        }
      }
 
      $CommonServiceFn.InvokeCommonApi("DELETE",$Service_Url.deleteProfessionalUser,  json, (response, err) => {
          this.props.dispatchloader(true);
          if (response) {
            this.props.dispatchloader(false);
            this.fetchBothProfessData();
            konsole.log("responseDeleteProfess99999", response,this.props?.UserDetail);
            let len = this.props?.UserDetail?.physicians?.length;
            for (let i = 0; i <= len; i++) {
              if (this.props?.UserDetail?.physicians[i]?.docMemberUserId == data?.professionalUserId) {
                konsole.log("physicians[i]", this.props?.UserDetail);
                const json = {
                  userId: this.props.UserDetail.userId,
                  deletedBy: loggedUserId,
                  primary_Care_Id : this.props?.UserDetail?.physicians[i]?.primary_Care_Id,
                };
                konsole.log(JSON.stringify(json), "jsonsasa");
                this.props.dispatchloader(true);
                $CommonServiceFn.InvokeCommonApi("DELETE",$Service_Url.deleteSpecialistDatabyDocuserId,json,(response, err) => {
                 this.props.dispatchloader(false);
                    if (response) {
                      let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
                      this.props?.FetchFamilyMembers(newuserid);
                      // this.Fetchprimaryphysician()
                      konsole.log(response, "ApiResponse");
                    } else {
                      this.toasterAlert("Something went wrong", "error");
                    }
                  }
                );
              }
            }
  
            // konsole.log("responseDeleteProfessLoop",index,filterProffToDelete?.length-1);
            if(index === filterProffToDelete?.length-1){
              if(removeFromSpouse !== true) AlertToaster.success(`Professional deleted successfully`);
              this.setState({professionalButtonborder : 1, iseditprofile : true})
              if (this.state.allMemberList?.length == 1) {
                this.handleClose()
                this.setState({
                  allMemberList: [],
                  searchAllMemberProffList:[],
                  financMoreInfocheckboxdisable : false,
                });   
              } else {
               konsole.log("userIDdd",this.state.userId)
                this.fetchAndDisplaySearchList(this.state.userId,this.state.primaryuserId);
              }
            }
          } else {
            konsole.log("deleteErrorr", err);
          }
        }
      );
    }
      }
    }
  };

  // editprofile = () => {
  //   this.setState({
  //     iseditprofile: false,
  //   });
  // };

  getColorChange = (e, addNewProff) => {
    konsole.log("eeeeeeee", e);
    this.setState({
      professionalButtonborder: e,
      iseditprofile: e == 2 ? false : true,
    });
    konsole.log("changeBtn", e, addNewProff);
    if (e == 2 && addNewProff == "addNewProff") {
      this.handlepersonalinfosubmit(addNewProff);
    }
  };

  handleClickNext = () => {
    const { pageNumber } = this.state;
    const { data } = this.props;
    konsole.log(
      "arraydAtatat",
      this.state.professionalUserList,
      this.state.professionalUserList.length,
      this.state.rowsOfPage
    );
    const totalPages = Math.ceil(
      this.state.professionalUserList.length / this.state.rowsOfPage
    );
    konsole.log("totalPages1111", totalPages, pageNumber);
    if (pageNumber <= totalPages) {
      this.setState((prevState) => ({
        pageNumber: prevState.pageNumber + 1,
        fetchOnClickArrow: true,
      }));
      konsole.log(
        "professionalUserListLength",
        this.state.professionalUserList
      );
      if (this.state.professionalUserList.length >= 10) {
        this.callapidata(this.props.protypeTd);
      }
    }
  };

  handleClickBack = () => {
    const { pageNumber } = this.state;
    if (pageNumber > 1) {
      this.setState((prevState) => ({
        pageNumber: prevState.pageNumber - 1,
      }));
    }
  };

  changeBackground = (event) => {
    konsole.log("datattata", event, event.target?.value);
    const targetValue = event.target?.value || event
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let spouseUserId = sessionStorage.getItem("spouseUserId") || "";
    let userId = (targetValue === "2") ? spouseUserId : newuserid 
    this.setState({
      activeUser: targetValue,
      iseditprofile: true,
      professionalButtonborder : 1,
    });
    this.fetchAndDisplaySearchList(userId,newuserid); 
    // this.getColorChange(2, "addNewProff")
  };

  handleMouseEnterOnDots = (index) => {
    konsole.log("index12121",index)
    this.setState({ showMenu: true, hoveredIndex : index });
  };

  handleMouseLeaveFromDots = () => {
    this.setState({ showMenu: false });
  };

  handleMouseEnterForTooltip = (text) => {
    konsole.log("textextext",text)
    this.setState({showTooltip: true, tooltipText: (text !== "null" && text !== undefined && text !== "") ? text : "Not Provided"});
  };

  handleMouseLeaveFromTooltip = () => {
    this.setState({showTooltip: false,tooltipText: ""});
  };

  stopOpenContextMenu = (e) =>{
    e.preventDefault()
  }

  selectListOrAorg = (event,proDerDescData) =>{
    konsole.log("evnetetet",event.target?.value,event,proDerDescData)
    if(proDerDescData?.some(ele => ele.checked == true) == false) {
      this.toasterAlert("Please select professional type to search", "Warning");
      this.setState({addProfessFrom : "List"});
      return;
    }
    const calledFrom = event.target?.value || event
    this.setState({addProfessFrom : calledFrom})

    const jsonToConnect = {
      addProffTo : "calledFromIntake",
      proffTypeData : proDerDescData,
    }

    if(calledFrom == "Aorg"){
      // konsole.log("eventsAorg",event,document.getElementById("addProffToIntake"))

      // event.preventDefault();
      // setTimeout(()=>{
      //   // document.getElementById("addProffToIntake")?.contentWindow.postMessage(jsonToConnect, 'http://localhost:3001/');
      document.getElementById("addProffToIntake")?.contentWindow.postMessage(jsonToConnect, aorgLink);
      // },3000)



      window.addEventListener('message', (event) => {
        if(event?.origin === aorgLinkWithoutSlash){
          // if(event?.origin == 'http://localhost:3001') {
          konsole.log("event.data",event.data)
          if(event.data == "helloIntake") {
            konsole.log("post-intake")
            document.getElementById("addProffToIntake")?.contentWindow.postMessage(jsonToConnect, aorgLink);
            return;
          }
          const aorgProffData = event.data
          const aorgProffDataProCategories = event.data?.proCategories

          konsole.log("aorgaddprof", this.state.searchAllMemberProffList, aorgProffData);
          for(let i = 0; i < this.state.searchAllMemberProffList.length; i++) {
            let ele = this.state.searchAllMemberProffList[i];
            // konsole.log("aorgaddcondition",ele?.proUserId, aorgProffData?.proUserId);
            if(ele?.proUserId == aorgProffData?.proUserId) {
              this.toasterAlert("Selected Professional Already Added!", "Warning")
              return;
            }
          }

          const proCategoriesData = aorgProffDataProCategories?.map(item => ({
            proTypeId: item.proTypeId,
            proType: item.proType,
            proSerDescId: item.proSerDescId,
            userProId: aorgProffData.userProId,
            proCatId: item.proCatId, 
            proUserId: aorgProffData.proUserId,
            proSubType: item.proSubType,
            proSubTypeId: item.proSubTypeId,
          }));
        
  
          const obj = {
            userId: aorgProffData.userId,
            proFullName: aorgProffData.proFullName,
            proUserId: aorgProffData.proUserId,
            proCategories: proCategoriesData,
          };
  
          this.invokeEditProfessional(obj, calledFrom)
        }

      
        // this.setState({aorgProffDetail : obj})       
      })
    }

  }

  searchYourProfess = (event, data) => {
    const eventValue = event.target?.value?.toLowerCase();
    konsole.log("eventeventValue", eventValue, data);
    
    let filterInfo = data;
    if (eventValue !== undefined && eventValue !== '' && eventValue !== null) {
      filterInfo = data.filter(
        item =>
          item.fName?.toLowerCase()?.includes(eventValue) ||
          item.mName?.toLowerCase()?.includes(eventValue) ||
          item.lName?.toLowerCase()?.includes(eventValue)
      );
    } else{
      filterInfo = data;
    }
    
    konsole.log("filterInfo", filterInfo);
    // Update the state with the filtered data
    this.setState({ searchAllMemberProffList: filterInfo });
    

    // konsole.log('filterInfo',filterInfo)
    // this.setState({ searchAllMemberProffList: filterInfo });
  };

  getMappedServiceArr = (data) =>{
    konsole.log("dtattadfadhasahjs",data)
    this.setState({checksOfProSerDesc : data})
  }

  primaryRadio = () =>{
    return(
      <div style={this.state.activeUser == "1" ? {padding: "8px", background: "#720c20", borderRadius: "10px"} : {}} className="professionalTeam">
        <Form.Check type="radio" name="group1"
          // label={item.name}
          className="mb-1"
          onChange={(event) =>  this.changeBackground(event)}
          style={{ fontSize: "12px"}}
          value = "1"
          checked = {this.state.activeUser == "1" ? true : false}
          />
        <label style={this.state.activeUser == "1" ? {fontSize: "12px", color:"white",marginLeft:"6px"} : { fontSize: "12px"}} className="ms-2">{this.state.userDetails.memberName}</label>
      </div>
    )
  }

  spouseRadio = () =>{
     return(
      <div style={this.state.activeUser == "2" ? {padding: "8px", background: "#720c20", borderRadius: "10px",justifyContent:"center"} : {}} className="w-100 p-2 d-flex align-items-center justify-content-center">
        <Form.Check type="radio" name="group1"
          // label={item.name}
          className="mb-1"
          onChange={(event) =>  this.changeBackground(event)}
          style={{ fontSize: "12px"}}
          value = "2"
          checked={this.state.activeUser == "2" ? true : false}
          />
        <label style={this.state.activeUser == "2" ? {fontSize: "12px", color:"white"} : { fontSize: "12px",marginLeft:"6px"}} className="ms-2">{this.state.userDetails.spouseName}</label>
      </div>
     )
  }

  checkProffsameOrNot = (dat) =>{
    konsole.log("valueueksnd",dat,this.state.responseuserDetail)
    
    let editDetail = this.state.responseuserDetail
    const checkPreviouslySaveForBoth = this.state.bothMemProfessionals?.length && this.state.bothMemProfessionals.filter(item => item.professionalUserId == editDetail.professionalUserId)

    if(this.state.toUpdate == true && checkPreviouslySaveForBoth.length == 2 && dat == true){
      const filterProff = this.state.bothMemProfessionals.filter(item => item.professionalUserId == editDetail.professionalUserId && item.userId != editDetail.userId)
      // const filterProff = this.state.bothMemProfessionals.filter(item => item.professionalUserId == editDetail.professionalUserId && item.userProId != editDetail.userProId)
    konsole.log("filterProff121212",filterProff[0])
    this.deleteProfess(filterProff[0],this.state.loggedInUser,dat)
    }
    // this.setState({sameProffOrNot : value, deleteFromSpouse : dat})
  }

  //------------------------------- To uncheck I don't have one checkbox while adding new Financial Advisor if checkbox is already checked ----------------------

  handleUpdateSubmitForFinanAdvi = (userSubjectDataId, userId) => {
    let inputdata = JSON.parse(JSON.stringify(this.state));

    let dontFinancialAdvisor = {
      userSubjectDataId: userSubjectDataId,
      subjectId: 198,
      subResponseData: false,
      responseId: 388,
      userId: userId,
    };

   


    let totinptary = [];
    if (dontFinancialAdvisor.subjectId !== 0 && dontFinancialAdvisor.subResponseData !== "" && dontFinancialAdvisor.responseId !== 0) {
      totinptary.push(dontFinancialAdvisor);
    }
   

    let updatePostData = {
      userId: userId,
      userSubjects: totinptary
    }

    konsole.log("updatePostDataupdatePostDataa1212", updatePostData)
    // totinptary.push(medicine);

    // konsole.log(JSON.stringify(inputdata));
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi( "PUT", $Service_Url.putSubjectResponse, updatePostData, (response) => {
      if (response) {
        // this.handleClose();
        this.props.dispatchloader(false);
        this.getsubjectForFormLabelIdForFinancialAdvisor(userId);
      } 
      else
      {
        this.props.dispatchloader(false);
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
                      this.setState({userSubDataIdOfFinanAdvToUncheck : responseData?.userSubjectDataId})
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
                      this.disableProfessionalAdd(responseData.response);
                      // this.setState({checkIdontHaveFinanAdvisor : responseData.response, iDontHaveFinanAdvisorQuestionId : responseData.questionId})
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
  }

  //------------------------------- To uncheck I don't have one checkbox while adding new Accountant if checkbox is already checked ----------------------

  handleUpdateSubmitForAccountant = (userSubjectDataId, userId) => {
    let inputdata = JSON.parse(JSON.stringify(this.state));


    let dontAccoutant = {
      userSubjectDataId: userSubjectDataId,
      subjectId: 197,
      subResponseData: false,
      responseId: 387,
      userId: userId,
    };


      let totinptary = [];


    if (dontAccoutant.subjectId !== 0 && dontAccoutant.subResponseData !== "" && dontAccoutant.responseId !== 0) {
      totinptary.push(dontAccoutant);
    }


    let updatePostData = {
      userId: userId,
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
        konsole.log("SuccessProvider" + JSON.stringify(response),response);
        if (response) {
      
          this.getsubjectForFormLabelIdForAccountant(userId);
      
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
                        this.setState({userSubDataIdOfAccoToUncheck : responseData?.userSubjectDataId})
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
                          this.disableProfessionalAdd(responseData.response);
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

  // -----------------------------------------------------------------------------------------------------------------------


  render() {
    if(this.props.protypeTd === "11" && (this.props.UserDetail.userId === this.state.spouseUserId)){
      this.state.activeUser = "2"
    } 

    konsole.log("responseProfresponseProf", this.props,this.state.allMemberList,this.state.responseuserDetail);

    const { data } = this.props;
    const { pageNumber, rowsOfPage } = this.state;

    // Calculate indexes for slicing data based on current page and items per page
    const indexOfLastItem = pageNumber * rowsOfPage;
    const indexOfFirstItem = indexOfLastItem - rowsOfPage;
    const professionalsData = this.state.professionalUserList.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    const professionals = [
      ...new Set(professionalsData.map((item) => item.proUserId)),
    ].map((proUserId) => {
      return professionalsData.find((item) => item.proUserId === proUserId);
    });
    // const professionalsResult = Object.values(groupedData);

    const checkSameProfessional = this.state.allMemberList.some((item1) =>
      professionals.some((item2) => item2.proUserId === item1.proUserId)
    );

    const profLabelAccordingly = `${this.props.protypeTd == "12" ? "Bookkeeper" : this.props.protypeTd == "3" ? "Accountant" : this.props.protypeTd == "1" ? "Financial Advisor" : this.props.protypeTd == "10" ? "Primary Care Physician" : this.props.protypeTd == "11" ? "Specialist" : "Professionals"}`


    konsole.log(
      "professionalItems",
      this.state.bothMemProfessionals,
      this.state.checkSameProff
    );

    // // Generate table rows for current items
    // const tableRows = currentItems.map((item, index) => (
    //   <tr key={index}>
    //     <td>{item.id}</td>
    //     <td>{item.name}</td>
    //     {/* Render additional table cells */}
    //   </tr>
    // ));

    return this.state.alreadyhaveprimaryphysician ? (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
        `}</style>

       


        {/* <a onClick={()=> {
          this.props.disableSpouseEdit == false? 
          this.showPhysician():
            this.toasterAlert("Cannot edit details as you and  spouse share the same Primary care physician.", "Warning")
        }} style={{ textDecoration: "underline", cursor: "pointer" }}>Edit</a> */}
        <a
          onClick={() => this.showPhysician()}
          style={{ textDecoration: "underline", cursor: "pointer",fontSize:"13px" }}
        >
          Edit
        </a>

        <Primarycarephysician
          UserDetail={this.props.UserDetail}
          docUsr={this.state.responseuserDetail}
          hidePhysician={this.hidePhysician}
          show={this.state.show}
          CallSearchApi={this.CallSearchApi}
          alreadyhaveprimaryphysician={this.state.alreadyhaveprimaryphysician}
          primaryphysiciandetails={this.state.primaryphysiciandetails}
        />
      </>
    ) : (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
        `}</style>
        {this.props.protypeTd == "" ? (
          <>
            {(this.props.type == "header" || this.props.type == 'headerLpo') ? (
             this.props.type == 'headerLpo' ? <OverlayTrigger
             overlay={<Tooltip id="toolTip-disabeld">Professional</Tooltip>}
           >
             <span className="d-inline-block" onClick={this.handleShow}>
               <img className="menuLpo1 "  src="Group 15763.svg" />
             </span>
           </OverlayTrigger> : <OverlayTrigger
                overlay={<Tooltip id="toolTip-disabeld">Professional</Tooltip>}
              >
                <span className="d-inline-block" onClick={this.handleShow}>
                  <img className="menu2" src="icons/professHeader.svg" />
                </span>
              </OverlayTrigger>
            ) : (
              <a onClick={this.handleShow}>
                <div className="image">
                  <img src="icons/profesProIcon.svg" />
                </div>
                <h5> My Service Providers</h5>
              </a>
            )}
          </>
        ) : (this.props.protypeTd == "10" || this.props.protypeTd == "11" && (this.props.memberUserId == null && this?.props?.showForm != 2)) ? (
          <>
            <a onClick={this.handleShow}>
              <img
                className=""
                src="/icons/add-icon.svg"
                alt="profess Search"
                // style={{ padding: "0px 7px" }}
              />
            </a>
          </>
        ) : ( (this.props.memberUserId == null && this?.props?.showForm != 2) && 
          <>
            <Card
              className="border-0 p-0"
              onClick={this.handlFinanceProfessional}
            >
              <Card.Img variant="Top" className="" src={this.props.sourceImg} />
              <Card.Body className="p-0">
                <div className="border d-flex justify-content-between align-items-center p-2 ">
                  <p className="ms-2">
                    {this.props.PageName} ({this.state.allMemberList.length})
                  </p>
                  <div className="border-start">
                    <a>
                      <img
                        className=""
                        src="/icons/add-icon.svg"
                        alt="profess Search"
                        style={{ padding: "0px 0px 0px 9px" }}
                      />
                    </a>
                  </div>
                </div>
              </Card.Body>
            </Card>
            {
            (this.props.memberUserId == null && this?.props?.showForm != 2) && this.props?.typeofcom == "FinancialAdvisorMoreInfo" ? (
              <div className="border d-flex justify-content-start py-1">
                <div key="checkbox1">
                  <FinancialAdvisorMoreInfo
                    financMoreInfocheckboxdisable={
                      this.state?.financMoreInfocheckboxdisable
                    }
                    restrictAddProfessional={this.state.restrictAddProfessional}
                    disableProfessionalAdd={this.disableProfessionalAdd}
                  />
                </div>
                <p
                  //  className="ms-2 pt-1"s
                  className={`${
                    this.state?.financMoreInfocheckboxdisable == true
                      ? "text-secondary"
                      : ""
                  } ms-2 pt-1 `}
                >
                  I don't have one
                </p>
              </div>
            ) : (this.props?.typeofcom == "AccountantMoreInfo") ? (
              <div className="border d-flex justify-content-start py-1  ">
                <div key="checkbox1 ">
                  <AccountantMoreInfo
                    financMoreInfocheckboxdisable={
                      this.state?.financMoreInfocheckboxdisable
                    }
                    restrictAddProfessional={this.state.restrictAddProfessional}
                    disableProfessionalAdd={this.disableProfessionalAdd}
                  />
                </div>
                <p
                  // className="ms-2 pt-1 text-secondary"
                  className={`${
                    this.state?.financMoreInfocheckboxdisable == true
                      ? "text-secondary"
                      : ""
                  } ms-2 pt-1 `}
                >
                  I don't have one
                </p>
              </div>
            ) : 
            (
              (this.props.memberUserId == null && this?.props?.showForm != 2) &&  <div className="border d-flex justify-content-start py-1  ">
                <div
                  key="checkbox1"
                  onClick={() =>
                    this.state.allMemberList.length > 0 &&
                    this.props.isNotBookkeeper == false &&
                    this.toasterAlert(
                      "Bookkeeper already available.",
                      "Warning"
                    )
                  }
                >
                  {this.state.allMemberList.length > 0 ? (
                    <Form.Check
                      className="ms-2"
                      type="checkbox"
                      id="checkbox1"
                      disabled
                    />
                  ) : (
                    <Form.Check
                      className="ms-2"
                      type="checkbox"
                      id="386"
                      onChange={(e) => this.props.handleChange(e)}
                      checked={this.props.isNotBookkeeper}
                    />
                  )}
                </div>

                <p  className={`${
                    (this.state.allMemberList.length > 0 && this.props.isNotBookkeeper == false)
                      ? "text-secondary"
                      : ""
                  } ms-2 pt-1 `}>I don't have one</p>
              </div>
            )}
          </>
        )}

          <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            max-width: 54.25rem;
            margin: 1.75rem auto;
          }
        `}</style>

        <Modal
          show={this.state.pshow}
          size="lg"
          // onHide={this.handleClose}
          animation="false"
          backdrop="static"
            centered
          className="custom-modal"
          // style={{ top: this.state.modalPositionTop }}
          // ref={this.modalRef}
        >
          {/* <Modal.Header closeButton closeVariant="white">
            <Modal.Title>
              Search {this.props.protypeTd == "12" ? "BookKeeper" : this.props.protypeTd == "3" ? "Accountant" : this.props.protypeTd == "1" ? "Financial Advisor" : this.props.protypeTd == "10" ? "Primary Care Physician" : this.props.protypeTd == "11" ? "Specialist" : "Service Providers"}
            </Modal.Title>
          </Modal.Header> */}
          <div className="modal-content">
            <div className="d-flex">
              <div style={{ width: this.props.protypeTd === "10" ? "100%" : "62%" }}>
                <Modal.Body
                  style={{
                    background: "rgb(114,12,32)",
                    padding: 0,
                    color: "white",
                  }}
                >
                  {/* Modal content */}
                    <div className="text-white p-3  proServiceHeadingModal">
                    <span onClick={this.handleClose} className="cursor-pointer " 
                    style={{
                      position: "absolute",
                      right: "1rem",
                    }}>
                      {" "}
                      {/* {"\u003C"}{" "} */}
                      {this.props.protypeTd === "10" ? <i onClick={this.handleClose} style={{color: "white", fontStyle: "normal"}}>&#x2715;</i> : ""}
                      {/* <img src="/icons/backProff.svg" className="me-2 mb-2" style={{height:"20px",width:"20px"}}/> */}
                    </span>
                    {/* Search  */}
                    {this.props.protypeTd == "12"
                      ? "Bookkeeper"
                      : this.props.protypeTd == "3"
                      ? "Accountant"
                      : this.props.protypeTd == "1"
                      ? "Financial Advisor"
                      : this.props.protypeTd == "10"
                      ? "Primary Care Physician"
                      : this.props.protypeTd == "11"
                      ? "Specialist"
                      : "Service Providers"}
                  </div>

                  <div style={{ display: "flex" }}>
                    <div className="w-100 cursor-pointer">
                      <div
                        style={
                          this.state.professionalButtonborder === 1
                            ? { background: "white", color: "black",borderTopRightRadius: "10px",borderTopLeftRadius: "10px"}
                            : {}
                        }
                        className={`${
                          this.state.professionalButtonborder === 1
                            ? "h-100"
                            : "mb-2"
                        } w-100 text-center pt-3`}
                        onClick={(e) => this.getColorChange(1)}
                      >
                        {this.state.professionalButtonborder === 1 ? (
                          <>
                            <img
                              className="pb-2 pe-1 user-select-auto"
                              width={18}
                              src="/icons/blackSearch.svg"
                              //   alt="Search professional"
                            />
                          </>
                        ) : (
                          <>
                            <img
                              className="pb-2 pe-1 user-select-auto"
                              width={18}
                              src="/icons/whiteSearch.svg"
                              //   alt="Search professional"
                            ></img>
                          </>
                        )}
                        <span
                          className={`${
                            this.state.professionalButtonborder === 1
                              ? "text-with-line"
                              : ""
                          }`}
                          style={{ listStyle: "none" }}
                          onClick={() => {
                            this.setState({
                              // iseditprofile: true,
                            });
                          }}
                        >
                          {" "}
                          Search {`${profLabelAccordingly}`} From List{" "}
                        </span>
                      </div>
                    </div>

                    <div
                      // onClick={() => this.editprofile()}
                      // className="mt-0 pt-0 mb-0 w-100 border border-danger"
                      className={`${
                        this.state.professionalButtonborder === 1
                          ? "rounded-start-2"
                          : ""
                      } w-100 cursor-pointer`}
                    >
                      <div
                        className={`${
                          this.state.professionalButtonborder === 2
                            ? "borderOnClick h-100 rounded-top-3"
                            : "mb-2 rounded-start-3"
                        } w-100 text-center pt-3`}
                        onClick={(e) => this.getColorChange(2, "addNewProff")}
                        style={
                          this.state.professionalButtonborder === 2
                            ? { background: "white", color: "black" ,borderTopLeftRadius: "10px",borderTopRightRadius: "10px"}
                            : {}
                        }
                      >
                        {this.state.professionalButtonborder === 2 ? (
                          <>
                            <img
                              className="pb-2 pe-1 user-select-auto"
                              width={22}
                              src="icons/blackAddProfessionalIcon.svg"
                              //   alt="Add Professional"
                            />{" "}
                          </>
                        ) : (
                          <>
                            <img
                              className="pb-2 pe-1 user-select-auto"
                              width={22}
                              src="icons/whiteAddProfessionalIcon.svg"
                              //   alt="Add Professional"
                            />
                          </>
                        )}
                        <span
                          className={`${
                            this.state.professionalButtonborder === 2
                              ? "text-with-line"
                              : ""
                          }`}
                        >
                          {" "}
                          Add New {this.props.protypeTd == "12"
                      ? "BookKeeper"
                      : this.props.protypeTd == "3"
                      ? "Accountant"
                      : this.props.protypeTd == "1"
                      ? "Financial Advisor"
                      : this.props.protypeTd == "10"
                      ? "Primary Care Physician"
                      : this.props.protypeTd == "11"
                      ? "Specialist"
                      : "Professionals"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Body className="m-1 p-2">
                <div>
  {this.state.iseditprofile !== true ? (
    <>
          {this?.props?.showForm == 2 && (this.props.protypeTd == "7" || this.props.protypeTd == '13' || this.props.protypeTd == "2" || this.props.protypeTd == "3" || this.props.protypeTd == "12" || this.props.protypeTd == "1" ||this.props.protypeTd == "14" || this.props.protypeTd == "4") && (
        <AddnewProfessmembermodal
        showaddprofessmodal={this.props.pshow}
        setshowaddprofessmodal={this.handleClose} 
        professionaltype={this.props.protypeTd}
        proType = {this.props.proType} 
        memberUserId={this.props.memberUserId} 
        setAddnewprofessmodaldata={this.props.setAddnewprofessmodaldata }
        userData={this.state.responseuserDetail}
        checkSameProff = {this.state.checkSameProff}
        checkProffsameOrNot={this.checkProffsameOrNot}
        />
      )}
      {this.props.protypeTd === "" && (
        <ProServiceProvider
          protypeTd={this.props.protypeTd}
          docUsr={this.state.responseuserDetail}
          CallSearchApi={this.fetchAndDisplaySearchList}
          toUpdate={this.state.toUpdate}
          addNewProff={this.state.addNewProff}
          handleClose={this.handleClose}
          proCategories={this.state.proCategories}
          previouslySavedData={this.state.previouslySavedData}
          activeUser={this.state.activeUser}
          checkSameProff = {this.state.checkSameProff}
          checkProffsameOrNot = {this.checkProffsameOrNot}
          spouseProCatMap={this.state.spouseProCatMap}
          disableProfessionalAdd={this.disableProfessionalAdd}
        />
      )}

      {(this.props.protypeTd == "1" && this.state.showadvisor == true && this?.props?.showForm != 2 && (this.props.memberUserId == null)) &&(
        <FinancialAdvisor
          // setshowadvisor={this.setshowadvisor}
          // show={this.state.showadvisor}
          // key = {this.state.responseuserDetail}
          docUsr={this.state.responseuserDetail}
          EidtProfessional={this.state.EidtProfessional}
          CallSearchApi={this.fetchAndDisplaySearchList}
          toUpdate={this.state.toUpdate}
          activeUser={this.state.activeUser}
          handleClose={this.handleClose}
          addNewProff={this.state.addNewProff}
          checkSameProff = {this.state.checkSameProff}
          checkProffsameOrNot = {this.checkProffsameOrNot}
          // key={this.state.activeUser}
        />
      )}

      {(this.props.protypeTd == "3" && this.state.showaccoutant == true && (this?.props?.showForm != 2 && this.props.memberUserId == null)) && (
        <Accountant
          // setshowaccoutant={this.setshowaccoutant}
          toUpdate={this.state.toUpdate}
          // show={this.state.showaccoutant}
          docUsr={this.state.responseuserDetail}
          EidtProfessional={this.state.EidtProfessional}
          CallSearchApi={this.fetchAndDisplaySearchList}
          handleClose={this.handleClose}
          activeUser={this.state.activeUser}
          addNewProff={this.state.addNewProff}
          checkSameProff = {this.state.checkSameProff}
          checkProffsameOrNot = {this.checkProffsameOrNot}
        />
      )}

      {(this.props.protypeTd === "10" && this.state.show == true && (this.props.memberUserId == null)) && (
        <Primarycarephysician
          UserDetail={this.props.UserDetail}
          docUsr={this.state.responseuserDetail}
          Fetchprimaryphysician={this.Fetchprimaryphysician}
          hidePhysician={this.hidePhysician}
          show={this.state.show}
          CallSearchApi={this.fetchAndDisplaySearchList}
          handleClose={this.handleClose}
          toUpdate={this.state.toUpdate}
        />
      )}

      {(this.props.protypeTd === "11" && this.state.showSpecialist == true && (this.props.memberUserId == null)) && (
        <Specialists
          updatethis={this.props.updatethis}
          UserDetail={this.props.UserDetail}
          docUsr={this.state.responseuserDetail}
          // key={this.state.responseuserDetail}
          // setSpecialist={this.setSpecialist}
          // show={this.state.showSpecialist}
          CallSearchApis={this.fetchAndDisplaySearchList}
          addNewProff = {this.state.addNewProff}
          alreadySpecialist={this.state.alreadySpecialist}
          proCategories={this.state.proCategories}
          CallSearchApi={this.CallSearchApi}
          handleClose={this.handleClose}
          activeUser={this.state.activeUser}
          toUpdate={this.state.toUpdate}
          checkSameProff = {this.state.checkSameProff}
          checkProffsameOrNot = {this.checkProffsameOrNot}
          mapForSpouse = {this.mapForSpouse}
        />
      )}

      {(this.props.protypeTd == "12" && this.state.showBookeepar == true && (this.props.memberUserId == null)) &&  (
        <BookKeepar
          // setBookeeparShow={this.setBookeeparShow}
          // show={this.state.showBookeepar}
          docUsr={this.state.responseuserDetail}
          CallSearchApi={this.fetchAndDisplaySearchList}
          toUpdate={this.state.toUpdate}
          handleClose={this.handleClose}
          activeUser={this.state.activeUser}
          addNewProff={this.state.addNewProff}
          checkSameProff = {this.state.checkSameProff}
          checkProffsameOrNot = {this.checkProffsameOrNot}
        />
      )}
    </>
  ) : (
    <>
      {this.props.protypeTd === "" && (
        <div className="d-flex cursor-pointer flex-wrap mt-2">
          <ProfessServices
            getMappedServiceArr={this.getMappedServiceArr}
            typeOfPage={true}
          />
        </div>
      )}

      {this.state.addProfessFrom === "List" && 
      <Row className="d-flex">
        <Col sm="12" md="12" lg="6">
          <div className="d-flex mt-2 ps-1">
          <Form.Control
            type="text"
            placeholder={`Search ${profLabelAccordingly}`}
            name="searchValue"
            onChange={(event) => this.handleInputChnage(event)}
            style={{ height: "40px" }}
            onKeyDown={(event) => this.searchRecommProfessional(event)}
          />
          <img src="icons/blackSearch.svg" style={{zIndex:"9999",marginTop: "10px",zIndex: "9999",marginLeft: "-26px",height:"18px",width:"18px"}} onClick={()=>this.fetchDiscplayAndSearch("ClickedToSearch")}/>
          </div>
        </Col>
        {/* <Col sm="4" lg="4">
          <Select
            className="mt-3"
            style={{ height: "45px" }}
            options={array}
            placeholder="Filter"
          />
        </Col> */}
      </Row>}

      <div className="d-flex justify-content-between mt-2 mb-2 px-2">
        <div className="fs-5 ">Recommended Professionals</div>
        {this.props.protypeTd === "" && (
          <div className="d-flex">
            <div className="d-flex align-items-center">
              <Form.Check
                type="radio"
                name="group2"
                value="Aorg"
                onChange={(event) => this.selectListOrAorg(event,this.state.checksOfProSerDesc)}
                checked={this.state.addProfessFrom === "Aorg"}
                // disabled = {true}
              />
              <label className="ms-2" style={{ fontSize: "12px" }}>
                Resource Guide
              </label>
            </div>
            <div className="d-flex align-items-center">
              <Form.Check
                type="radio"
                name="group2"
                className="ms-2"
                value="List"
                checked={this.state.addProfessFrom === "List"}
                onChange={(event) => this.selectListOrAorg(event)}
              />
              <label className="ms-2" style={{ fontSize: "12px" }}>
                List
              </label>
            </div>
          </div>
        )}
      </div>

      {(this.state.showProffTable && this.state.addProfessFrom === "List" && professionals.length > 0) ? (
          <>
          <div className="recomProffessional">
            {professionals.map((item, index) => {
              konsole.log("item1212212", item);
              return (
                <div
                  key={index}
                  className="d-flex justify-content-between w-100 mt-2 p-2 cursor-pointer hoverProffTable"
                >
                  <div className="d-flex">
                      <img src="/icons/ProfilebrandColor2.svg" style={{ height: "40px", width: "40px" }}/>
                      <div className="ms-2">
                        <div className="fw-bold mt-2 d-flex">
                          <span className="userProfftextlist-container">{item.proFullName}</span>
                        </div>
                        <div>
                          <div className="d-flex" style={{ marginTop: "-8px" }}>
                            <img src="icons/doctorCaseIcon.svg" style={{height: "24px",width: "12px", marginTop:"0px"}}/>
                            <span style={{fontSize: "13px",color: "#939393",}} className="ms-1 mt-1 text-container">{item.proCategories.map((innerItem) => innerItem.proType).join(", ")}</span>
                          </div>
                          {/* <div className="d-flex align-items-center" style={{ marginTop: "-7px" }}>
                            <img src="icons/locationIcon.svg" style={{height: "12px",width: "12px",}}/>
                            <span style={{fontSize: "10px",color: "#939393",}}className="ms-1 mt-1">Delhi</span>
                          </div> */}
                        </div>
                      </div>
                    </div>
                    {/* <div className="d-flex flex-column align-items-center mt-3">
                      <span style={{fontSize: "10px", color: "#939393",}}>Phone</span>
                    <span style={{ color: "#838383" }}>{item.proPrimaryContact !== null && item.proPrimaryContact !== "" ? this.PhoneFormat(item.proPrimaryContact) : ""}</span>
                    </div>
                    <div className="d-flex flex-column align-items-center mt-3">
                      <span style={{fontSize: "10px",color: "#939393",}}>Email</span>
                      <span style={{ color: "#838383" }}>{item.proPrimaryEmail}</span>
                    </div> */}
                    <div className="d-flex justify-content-between w-100">
                    <div className="d-flex flex-column align-items-center mt-3 target-element" onMouseEnter={() =>this.handleMouseEnterForTooltip(`${item.proPrimaryContact !== null && item.proPrimaryContact !== "" ? this.PhoneFormat(item.proPrimaryContact) : ""}`)} onMouseLeave={this.handleMouseLeaveFromTooltip}>
                    {/* <div className="d-flex mt-3 target-element" onMouseEnter={() =>this.handleMouseEnterForTooltip("Mobile Tooltip")} onMouseLeave={this.handleMouseLeaveFromTooltip}> */}
                    
                      <img src="icons/phoneIcon.svg" style={{ height: "12px", width: "15px" }}/>
                      {this.state.showTooltip && <div className="toolTip">{this.state.tooltipText.split(",")}</div>}
                    </div>
                    <div className="d-flex flex-column align-items-center mt-3 target-element" onMouseEnter={() =>this.handleMouseEnterForTooltip(`${item.proPrimaryEmail}`)} onMouseLeave={this.handleMouseLeaveFromTooltip}>
                    {/* <div className="d-flex mt-2 target-element" onMouseEnter={() =>this.handleMouseEnterForTooltip("Email Tooltip")} onMouseLeave={this.handleMouseLeaveFromTooltip}> */}
                      <img src="icons/envelopIcon.svg" style={{ height: "12px", width: "15px" }}/>
                      {this.state.showTooltip && <div className="toolTip">{this.state.tooltipText}</div>}
                    </div>
                    {konsole.log("disableddd",item.disabled)}
                      <div className="d-flex justify-content-end mt-3" onClick={() =>{
                        if(item?.disabled !== true){
                          this.invokeEditProfessional(item,"addForUser")
                        }
                      }}
                      //  style ={checkSameProfessional ? {pointerEvents: "none",opacity: "0.5",cursor: "not-allowed"} : {}}
                      >
                      {
                        (item?.disabled !== true)?
                        <img src={
                          "icons/addProfessionalForUser.svg"} 
                          style={{ height: "20px", width: "20px" }}/>
                          : ""
                      }
                        </div>
                    </div>
                    </div>
                    );
                  })}
            </div>
            </>) : 
              (this.state.showProffTable && this.state.addProfessFrom === "List" && professionals.length == 0) ? 
              <div className="d-flex align-content-center justify-content-center mt-5">
              <p>No {`${profLabelAccordingly} Available`}, Please Go To Add New {`${profLabelAccordingly}`}</p>
              </div> : 
              (this.state.addProfessFrom === "Aorg") ? (
                <div className="w-100">
                  <iframe
                    src={aorgLink}
                    // src="http://localhost:3001/"
                    id= "addProffToIntake"
                    className="w-100"
                    style={{ height: "420px", minHeight: "540px", maxHeight: "100%" }}
                  />
                </div>
              ) :  
              <div className="d-flex align-content-center justify-content-center fs-4 mt-5">
                <p>Search {`${profLabelAccordingly}`}</p>
                </div>}

                {(this.state.showProffTable && this.state.addProfessFrom === "List") && 
                 <div className="mt-2 d-flex justify-content-end modal-footer">
                 <div className="">
                 <button onClick={this.handleClickBack} disabled={this.state.pageNumber === 1} className={`${this.state.pageNumber === 1 ? "rightArrowInProff" : "leftArrowInProff" }`}>{"\u2190"}</button>
                 </div>
                 <div>
                   <button onClick={this.handleClickNext} disabled={professionals.length < 10} className={`${professionals.length < 10 ? "rightArrowInProff" : "leftArrowInProff" } ms-2`}>{"\u2192"}</button>
                 </div>
               </div>}

      {/* {this.state.addProfessFrom === "Aorg" && (
        <div className="w-100">
          <iframe
            src={aorgLink}
            // src="http://localhost:3001/"
            id= "addProffToIntake"
            className="w-100"
            style={{ height: "420px", minHeight: "420px", maxHeight: "100%" }}
          />
        </div>
      )} */}
    </>
  )}
</div>

                </Modal.Body>
              </div>
              {this.props.protypeTd !== "10" && 
              <div style={{ width: "38%" }} className="border">
                <Modal.Body>
                  <div className="fw-bold fs-4 mb-3">My Professional Team
                    <span onClick={this.handleClose} className="cursor-pointer " style={{
                      position: "absolute",
                      right: "1rem",
                    }}>
                      {this.props.protypeTd != "10" ? <i onClick={this.handleClose} style={{color: "black", fontStyle: "normal"}}>&#x2715;</i> : ""}
                    </span> 
                  </div>
                  <div className="w-100 d-flex p-2 ProfessionalCheck" style={{border: "2px solid #720c20",borderRadius: "10px",}}>
                  {this.props.protypeTd !== "11" ? 
                      (this.state.spouseUserId !== "null") ?
                      <>
                        {this.primaryRadio()}
                        {this.spouseRadio()}
                      </>
                     : (
                      this.primaryRadio()
                    ) : (
                      this.props.protypeTd === "11" &&
                      this.props.UserDetail.userId === this.state.primaryuserId
                    ) ? (
                      this.primaryRadio()
                    ) : (
                      this.props.protypeTd === "11" &&
                      this.props.UserDetail.userId === this.state.spouseUserId
                    ) ? (
                      this.spouseRadio()
                    ) : (
                      <></>
                    )}
                  </div>
                  <hr style={{ border: "1px solid grey" }} />
                  <div>
                    <Form.Control
                      type="text"
                      placeholder={`Search your ${profLabelAccordingly}`}
                      name="SearchYourProff"
                      style={{ height: "35px", border: "1.4px solid black" }}
                      onChange={(event)=>this.searchYourProfess(event, this.state.allMemberList)}
                    />
                  </div>

                  {/* -------------------------User Professionals List-------------------- */}

                 <div className="search_Professional_Height">
                  {this.state.searchAllMemberProffList.length > 0 && 
                        this.state.searchAllMemberProffList.map((item, index) => {
                          konsole.log("itemitem", item);
                          return (
                  <div className="d-flex flex-wrap justify-content-between w-100 mt-2 p-2 cursor-pointer hoverProffTable" onClick={() => {this.invokeEditProfessional(item,"updateForUser")}}>
                    <div className="d-flex">
                      <img src="/icons/ProfilebrandColor2.svg" style={{ height: "40px", width: "40px" }} />
                      <div className="ms-2">
                        <div className="fw-bold d-flex mt-2">
                          <span className="userProfftext-container">{item.fName} {item.lName}</span>
                        </div>
                        <div>
                          <div className="d-flex" style={{ marginTop: "-8px" }}>
                            <span style={{ fontSize: "10px", color: "#939393"}} className="mt-2 userProfftext-container">{item.proType}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex mt-3 target-element" onMouseEnter={() =>this.handleMouseEnterForTooltip(`${item.mobileNumbers !== null && item.mobileNumbers !== "" ? this.PhoneFormat(item.mobileNumbers) : ""}`)} onMouseLeave={this.handleMouseLeaveFromTooltip}>
                    {/* <div className="d-flex mt-3 target-element" onMouseEnter={() =>this.handleMouseEnterForTooltip("Mobile Tooltip")} onMouseLeave={this.handleMouseLeaveFromTooltip}> */}
                    
                      <img src="icons/phoneIcon.svg" style={{ height: "12px", width: "15px" }}/>
                      {this.state.showTooltip && <div className="toolTip">{this.state.tooltipText.split(",")}</div>}
                    </div>
                    <div className="d-flex mt-3 target-element" onMouseEnter={() =>this.handleMouseEnterForTooltip(`${item.emaidIds}`)} onMouseLeave={this.handleMouseLeaveFromTooltip}>
                    {/* <div className="d-flex mt-2 target-element" onMouseEnter={() =>this.handleMouseEnterForTooltip("Email Tooltip")} onMouseLeave={this.handleMouseLeaveFromTooltip}> */}
                      <img src="icons/envelopIcon.svg" style={{ height: "12px", width: "15px" }}/>
                      {this.state.showTooltip && <div className="toolTip">{this.state.tooltipText}</div>}
                    </div>
                    
                    {/* <OtherInfo othersCategoryId={26} othersMapNatureId={item?.proUserId} FieldName={item.proType} userId={item.userId}/> */}
                    <div
                      className="context-menu-container d-flex mt-3"
                      onMouseEnter={()=>this.handleMouseEnterOnDots(index)}
                      onMouseLeave={this.handleMouseLeaveFromDots}
                      onContextMenu={(e)=>this.stopOpenContextMenu(e)}
                    >
                      <div className="context-menu-target">
                        <img
                          src="icons/threeDotIcon.svg"
                          style={{ height: "15px", width: "15px" }}
                        />
                      </div>
                      {(this.state.showMenu && this.state.hoveredIndex == index) && (
                        <div className="context-menu p-0">
                          <div className="context-menu-item d-flex align-items-center" onClick={() => {this.invokeEditProfessional(item,"updateForUser")}}>
                            <span className="cursor-pointer m-1 ms-2"><img src="/icons/blackEditIcon.svg" className="p-0 m-0" alt="g4" style={{height:"15px",width:"15px"}}/></span>
                            <span>Edit</span>
                            </div>
                                      {/* // this.fetchAndDisplaySearchList(this.state.userId); */}
                          <hr className="context-menu-divider" style={{margin: 0}}/>
                          <div className="context-menu-item d-flex align-items-center" onClick={() => this.deleteProfess(item,this.state.loggedInUser)}>
                            <span className="cursor-pointer m-1 ms-2">
                              <img src="/icons/deleteIcon.svg" className="p-0 m-0" alt="g4" style={{height:"20px",width:"15px"}}/></span>
                              <span className="">Delete</span>
                              </div>
                        </div>
                          )} 
                    </div>

                    {/* <div className="d-flex mt-3">
                            <img src="icons/cross.png" style={{height:"15px",width:"15px"}}/>
                            </div> */}
                    {/* <div  className="d-flex justify-content-end mt-3" onClick={() =>this.invokeEditProfessional(item,"addForUser")}>
                            <img src="icons/addProfessionalForUser.svg" style={{height:"20px",width:"20px"}}/>
                            </div> */}
                  </div>
                     )})}
                  </div>
                </Modal.Body>
              </div>}
            </div>
          </div>
        </Modal>

        {/* {this.props.protypeTd == "1" &&
          (this.state.showadvisor ? (
            <FinancialAdvisor
              setshowadvisor={this.setshowadvisor}
              show={this.state.showadvisor}
              docUsr={this.state.responseuserDetail}
              EidtProfessional={this.state.EidtProfessional}
              CallSearchApi={this.fetchAndDisplaySearchList}
              toUpdate={this.state.toUpdate}
              handleClose={this.handleClose}
            />
          ) : (
            ""
          ))} */}
        {/* {this.props.protypeTd == "3" && this.state.showaccoutant == true && (
          <Accountant
            setshowaccoutant={this.setshowaccoutant}
            toUpdate={this.state.toUpdate}
            show={this.state.showaccoutant}
            docUsr={this.state.responseuserDetail}
            EidtProfessional={this.state.EidtProfessional}
            CallSearchApi={this.fetchAndDisplaySearchList}
            handleClose={this.handleClose}
          />
        )} */}
        {/* {this.props.protypeTd == "" && this.state.showproserprovider == true && (
          <ProServiceProvider setproserprovider={this.setproserprovider} show={this.state.showproserprovider} docUsr={this.state.responseuserDetail} CallSearchApi={this.fetchAndDisplaySearchList} toUpdate={this.state.toUpdate} addNewProff = {this.state.addNewProff} handleClose={this.handleClose}/>
        )} */}
        {/* {this.props.protypeTd == "10" && (
          <Primarycarephysician
            UserDetail={this.props.UserDetail}
            docUsr={this.state.responseuserDetail}
            Fetchprimaryphysician={this.Fetchprimaryphysician}
            hidePhysician={this.hidePhysician}
            show={this.state.show}
            CallSearchApi={this.fetchAndDisplaySearchList}
            handleClose={this.handleClose}
          />
        )} */}
        {/* {this.props.protypeTd == "11" &&
          (this.state.showSpecialist ? (
            <Specialists
              updatethis={this.props.updatethis}
              UserDetail={this.props.UserDetail}
              docUsr={this.state.responseuserDetail}
              setSpecialist={this.setSpecialist}
              show={this.state.showSpecialist}
              alreadySpecialist={this.state.alreadySpecialist}
              CallSearchApi={this.CallSearchApi}
              handleClose={this.handleClose}
            />
          ) : (
            <></>
          ))} */}
        {/* {this.props.protypeTd == "12" && this.state.showBookeepar == true && (
          <BookKeepar
            setBookeeparShow={this.setBookeeparShow}
            show={this.state.showBookeepar}
            docUsr={this.state.responseuserDetail}
            CallSearchApi={this.fetchAndDisplaySearchList}
            toUpdate={this.state.toUpdate}
            handleClose={this.handleClose}
          />
        )} */}
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(professSearch);
