import React, { Component } from 'react';
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, OverlayTrigger, Tooltip, Breadcrumb, CloseButton, InputGroup,Accordion, Card } from 'react-bootstrap';
import { GET_Auth_TOKEN, GET_USER_DETAILS, SET_LOADER } from '../components/Store/Actions/action';
import AlertToaster from "./control/AlertToaster";
import { connect } from 'react-redux';
import konsole from './control/Konsole';
import { globalContext } from '../pages/_app';
import ProServiceProvider from './ProServiceProvider';
import { $CommonServiceFn, $getServiceFn } from './network/Service';
import { $Service_Url } from './network/UrlPath';
import { aorgLink, demo } from './control/Constant';
import { Msg } from './control/Msg';
import Bookkeeper from './Bookkeeper';
import AccountantMoreInfo from './AccountantMoreInfo';
import Accountant from './Accountant';
import FinancialAdvisorMoreInfo from './FinancialAdvisorMoreInfo';
import FinancialAdvisor from './FinancialAdvisor';
import Specialists from './specialists';
import Primarycarephysician from './primarycarephysician';
import Addnewprofessionalmodal from './Agentsetguidance/Addnewprofessionalmodal';
import DynamicProfessForm, { SimpleProfMoreInfoConnected } from './DynamicProfessForm';
import { $AHelper } from './control/AHelper';

export class NewProServiceProvider extends Component {
    static contextType = globalContext
    constructor(props,context) {
        super(props);
        this.state = {
            showModal: false,
            searchresult: false,
            searchText: "",
            selectedUser: "1",
            openSubModal: "",
            catogories: {},
            openCatogories: [],
            // related to userIds
            currentUserId: '',
            primaryUserId: '',
            spouseUserId: '',
            loggedInUser: '',
            userDetails: {},
            // related to profess type
            professCategories: {},
            proCategories: {},
            previouslySavedData: [],
            // prof member list
            searchAllMemberProffList: [],
            responseuserDetail: {},
            toUpdate: false,
            alreadySpecialist: false,
            showProffTable: false,
            addNewProff: "",
            // pro category type filter list
            proSerDescIdList: {},
            protypeIdList: {},
            proSubTypeIdList: {},
            // newSearchProf
            newProfSearchResult: [],
            spouseProCatMap: {},
            isAddAnotherClicked: false,
            filterText: "",
            // for Finance & Health page
            profMemCountOfPrimaryUser: 0,
            // restrictAddProfessional: "false",
            hideFilters: false,
            alreadyhaveprimaryphysician: false,
        }
        this.timeoutId = null;
        this.uniqueKeySS = sessionStorage.getItem("openModalHash");

        if(this.uniqueKeySS == props.uniqueKey) this.state.selectedUser = sessionStorage.getItem("openModal4User") || "1";
    }

    componentDidMount(props) {
        let ssPrimaryUserId = sessionStorage.getItem("SessPrimaryUserId") || "";
        let ssSpouseUserId = sessionStorage.getItem("spouseUserId") || "";
        let userDetails = sessionStorage.getItem('userDetailOfPrimary');
        let loggedInUser = sessionStorage.getItem('loggedUserId');
        let userId = this.state.selectedUser == "1" ? ssPrimaryUserId : ssSpouseUserId;
        if(this.uniqueKeySS == this.props.uniqueKey) {
            sessionStorage.setItem("openModalHash", "");
            sessionStorage.setItem("openModal4User", "");
        }

        konsole.log("dzvbjkb", this.uniqueKeySS, this.props.uniqueKey )
        this.setState({
            currentUserId: userId,
            primaryUserId: ssPrimaryUserId,
            spouseUserId: ssSpouseUserId,
            userDetails: JSON.parse(userDetails),
            loggedInUser: loggedInUser,
            showModal: this.uniqueKeySS == this.props.uniqueKey,
            openSubModal: this.uniqueKeySS == this.props.uniqueKey ? "submodal1" : "",
        })

        konsole.log("pspmdidmount", {
            currentUserId: userId,
            primaryUserId: ssPrimaryUserId,
            spouseUserId: ssSpouseUserId,
            userDetails: JSON.parse(userDetails)
        })

        if (this.props.protypeTd == "10") this.Fetchprimaryphysician();
        if(this.props.showForm == 2) {
            this.setState({showModal: true});
            if(this.props.activeUser == "2") this.setState({selectedUser: "2"});
            if(this.uniqueKeySS != this.props.uniqueKey) this.openCloseSubModal("submodal2")
        }
        this.setState({hideFilters: this.props.hideFilters == true ? true : false});

        // this.fetchProSerDesc();
        this.fetchAndDisplaySearchList(userId, ssPrimaryUserId);
    }

    componentDidUpdate(prevProp, prevState) {
        if(this.state.showModal == false && this.props.showForm == 2) {
            this.props.setshowaddprofessmodal(false);
        }
        if((this.props.protypeTd == "11" || this.props.protypeTd == "10") && this.state.selectedUser != "2" && this.props.UserDetail?.userId == this.state.spouseUserId) {
            this.setState({selectedUser: "2"});
        }
        if (prevState.selectedUser != this.state.selectedUser || ((prevState.showModal != this.state.showModal) && (this.state.showModal == true))) {
            let userId = (this.state.selectedUser == "2") ? this.state.spouseUserId : this.state.primaryUserId;
            if(!Object.keys(this.state.proSerDescIdList)?.length && (this.state.showModal == true)) this.fetchProSerDesc();
            this.setState({ 
                currentUserId: userId,
                searchAllMemberProffList: []
            });
            this.fetchAndDisplaySearchList(userId, this.state.primaryUserId, true);

            if(this.props.protypeTd == '12' && this.props.showForm != 2 && this.props.showForm != 3) this.props.handleChange({target: {id: "386", checked: false}});
        }
        if((this.props.protypeTd == '12') && (this.state.profMemCountOfPrimaryUser > 0) && (this.props.isNotBookkeeper == true) && (prevState.profMemCountOfPrimaryUser != this.state.profMemCountOfPrimaryUser)) {
            this.props.handleUpdateSubmit(this.props.userSubDataIdOfBookToUncheck, false,386,196);
        }
        if(this.props.protypeTd == '10' && this.props.UserDetail?.physicians?.length != prevProp.UserDetail?.physicians?.length) {
            this.Fetchprimaryphysician();
        }
    }


    handleShow = () => {
        
             if(this.state.showModal !== true){
                if(this.props.protypeTd == 10){
                    this.context.setPageTypeId(2)
                }else if(this.props.protypeTd == 11){
                    this.context.setPageTypeId(3)
                }else if(this.props.protypeTd == 16){
                    this.context.setPageTypeId(8)
                }else if(this.props.protypeTd == 17){
                    this.context.setPageTypeId(9)
                }else if(this.props.protypeTd == 4){
                    this.context.setPageTypeId(10)
                }else if(this.props.protypeTd == 1){
                    this.context.setPageTypeId(12)
                }else if(this.props.protypeTd == 3){
                    this.context.setPageTypeId(13)
                }else if(this.props.protypeTd == 12){
                    this.context.setPageTypeId(14)
                }else if(this.props.protypeTd == 13){
                    this.context.setPageTypeId(29)
                }else if(this.props.protypeTd == 45){
                    this.context.setPageTypeId(30)
                }else if(this.props.protypeTd == 46){
                    this.context.setPageTypeId(31)
                }else if(this.props.protypeTd == ""){
                    this.context.setPageCategoryId(7)
                }

             }
            
             else if (this.state.showModal === true && ["11", "10", "16", "17", "4","1","3","12","13","45","46",""].includes(this.props.protypeTd)) {
                
                if(this.props.protypeTd == ""){
                    this.context.setPageCategoryId(null)
                }else{
                    this.context.setPageTypeId(null);
                }

            }
                // Default case if props?.name does not match any of the above cases
    
        let _resetProserDescList = this.state.proSerDescIdList;
        for(const [key, val] of Object.entries(_resetProserDescList)) {
            _resetProserDescList[key].checked = false;
            // console.log("nknkn", key, val);
        }
        
        if(this.state.showModal == true && this.props.protypeTd == "11") this.props.FetchFamilyMembers(this.state.primaryUserId);
        if(this.state.showModal == true && this.props.protypeTd == "10") {
            this.Fetchprimaryphysician();
            this.props.FetchFamilyMembers(this.state.primaryUserId);
        }
        
        this.setState({
            showModal: !this.state.showModal, 
            openSubModal: "", 
            proSerDescIdList: _resetProserDescList, 
            openCatogories: [], 
            newProfSearchResult: [], 
            searchresult: false,
            searchText: "",
            selectedUser: "1",
        });
    } 
    
    hideLastName(userDetails){
        return userDetails?.split(" ")[0] || "";
    }

    handleOpenCat = ( cat ) => {
        let openCatogories = this.state.openCatogories;
        konsole.log("vishnudbb", openCatogories?.includes(cat))
        if(openCatogories?.includes(cat)) openCatogories = openCatogories.filter(ele => ele != cat);
        else openCatogories?.push(cat);
        this.setState({openCatogories: openCatogories});
        konsole.log("vishnudbb", cat, this.state.openCatogories, openCatogories)
    }
    
    /**
     * Used to open and close submodal
     * @param {string} modalName 
     * @example 'submodal1'
     * @example 'submodal2'
     */
    openCloseSubModal = ( modalName ) => {
        if(this.state.openSubModal != modalName) {
            this.setState({openSubModal: modalName});
            if(modalName == 'submodal2') {
                this.setState({responseuserDetail: {}});
                this.handlepersonalinfosubmit("addNewProff");
            }
        } else {
            this.setState({openSubModal: ""});
        }

        // resetting filter text of my prof list sub modal
        this.setState({filterText: ''})
    }

    callWhenTimeout = (userId, primaryUserId) => {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => this.fetchAndDisplaySearchList(userId, primaryUserId, true), [2000]);
    }

    // start of code copied from professSearch ------------------------------------------------------------------------------------------------------------

    /**
     * Used to fetch list of professional members of given userid
     * @param {string} userId 
     * @param {string} primaryUserId 
     */
    fetchAndDisplaySearchList = (userId, primaryUserId, callFromTimeOut) => {
        if(callFromTimeOut != true) return this.callWhenTimeout(userId, primaryUserId);
        if(["1", "3", "12"].includes(this.props.protypeTd?.toString()) == false && this.state.showModal == false && this.props.showForm != 3) return; // for rejecting useless calls

        konsole.log("userIddd",userId, primaryUserId)
        primaryUserId = primaryUserId || this.state.primaryUserId;

        if(!userId || userId == "null" || !primaryUserId || primaryUserId == "null") {
            konsole.log("primarynull", userId, primaryUserId)
            return;
        }

        this.setState({searchAllMemberProffList: []});

        // api url
        const sendData = `?MemberUserId=${userId}&ProTypeId=${this.props.protypeTd}&primaryUserId=${primaryUserId}`
        const getUrl = $Service_Url.getSearchProfessional
        
        // this.props.dispatchloader(true);
        konsole.log("isdsdjsnd", this.props.protypeTd,userId,getUrl,sendData);

        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", getUrl + sendData ,"",(response, errorRes) => {
            this.props.dispatchloader(false);
            if (response) {
                if(this.state.primaryUserId == userId) {
                    if(response == "err") {
                        this.setState({profMemCountOfPrimaryUser: 0});
                        return;
                    }
                }
              konsole.log("responseFetch",response)
              const data = response?.data?.data;

              if (data?.length !== 0) {
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

                if(this.state.primaryUserId == userId) {
                    this.setState({profMemCountOfPrimaryUser: result?.length || 0});
                }
    
                konsole.log("groupedData",groupedData,result,data,this.state.showProffTable);
                this.setState(oldState => {
                    if(oldState.currentUserId == userId)
                        return {
                        //   allMemberList: this.props.protypeTd == "11" ? data : result,
                            searchAllMemberProffList:result,
                        //   financMoreInfocheckboxdisable: response.data.data.length > 0 ? true : false,
                        }
                    else return {}
                });
              }
              this.fetchBothProfessData();
            } else if (errorRes) {
              konsole.log("errorRes1212",errorRes)
            //   let errorMsgStatus = errorRes ? errorRes.data.statusCode : null;
            //   if (errorMsgStatus == 404) {
            //     this.setState({
            //       showAddMember: true,
            //       searchAllMemberProffList : []
            //     });
            //   }
            //   this.props.dispatchloader(false);
            }
          }
        );
    };

    /**
     * Used to formate mobile number
     * @param {string} value 
     * @returns {Array}
     */
    
     PhoneFormat = (value) => {
        if(value?.length < 10) return "Not Provided";
        // konsole.log("pjoneFormateData", value?.split(","));
        let phoneArray = value?.split(",");
        const newArr = [];
        for (let i = 0; i < phoneArray?.length; i++) {
            let phoneNumber = phoneArray[i]
            let cleaned = ("" + phoneNumber).replace(/\D/g, "");
            // console.log("cleanfdf",cleaned?.startsWith("254"))  
            if(cleaned?.startsWith("254")){
                let fornum = `+254 ${cleaned?.slice(3,6)+" "+cleaned?.slice(6,9)+" "+cleaned?.slice(9)}`;
                newArr.push(fornum);
              }
              else
              {
                let contactNumber=cleaned?.slice(-10)
                let match = contactNumber?.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    let fornum = `${phoneNumber.startsWith("+91")?"+91":"+1"} ${"(" + match[1] + ") " + match[2] + "-" + match[3]}`;
                    newArr.push(fornum);
                }  
            }
      
        }
        return newArr?.join(", ");
    }
    

    /**
     * Used to set all required state for editing professional's data and pass it to ProServiceProvider
     * @param {object} val 
     * @param {string} addForUser 
     */
    invokeEditProfessional = async (val, addForUser) => {
        let filterGroupDataToEditForUser = []
        konsole.log("addForUser", val, addForUser,this.state.bothMemProfessionals);
        // this.callapidata("", "checkPreviouslyAdded", val.proUserId);
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
                this.state.newProfSearchResult.filter(
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
                // showSpecialist : true,
                // showadvisor : true,
                // showaccoutant : true,
                // showBookeepar : true,
                openSubModal : 'submodal2',
                checkSameProff: false,
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
            // showSpecialist : true,
            // showadvisor : true,
            // showaccoutant : true,
            // showBookeepar : true,
            openSubModal : 'submodal2',
            });

            if(this.state.bothMemProfessionals == undefined) await this.fetchBothProfessData()
            const bothMemProfessionals = this.state.bothMemProfessionals;
            
            if(bothMemProfessionals?.length > 0 && bothMemProfessionals !== undefined){
                let _checkSameProff = false;
                let _spouseProCatMap = {}
                for(const value of bothMemProfessionals){
                    if((value.userId !== this.state.currentUserId) && (value.professionalUserId == val.professionalUserId)){
                        _checkSameProff= true;
                        _spouseProCatMap = value.proCatMap;
                        break;
                    }
                } 
                this.setState({checkSameProff : _checkSameProff, spouseProCatMap: _spouseProCatMap})
                konsole.log("checkSameProff", this.state.checkSameProff)
            }
        }

        // this.getColorChange(2);
        // this.setState({
        // iseditprofile: false,
        // });
    }

    invokeApiPromise = (method, url, data) => {
        return new Promise((resolve, reject) => {
          $CommonServiceFn.InvokeCommonApi(method, url, data, (response, errorRes) => {
            if (response) {
              resolve(response);
            } else if (errorRes) {
              resolve("err"); 
            }
          });
        });
    };

    fetchBothProfessData = async (userId, primaryUserId) => {
        if(this.state.showModal == false) return; // for rejecting useless calls
        const getUrl = $Service_Url.getSearchProfessional;
        const fetchPromises = [];
        let _bothMemlist = [];
        const bothUsersIds = [{id : this.state.primaryUserId},{id : this.state.spouseUserId}];

        konsole.log("bothUsersIds", bothUsersIds);
      
        for (const [ind, val] of bothUsersIds.entries()) {
            if(!this.state.primaryUserId || !val.id || val.id == "null") continue;
            try {
                const response = await this.invokeApiPromise(
                "GET",
                getUrl + `?MemberUserId=${val.id}&ProTypeId=${this.props.protypeTd}&primaryUserId=${this.state.primaryUserId}`,
                ""
                );

        
                response?.data?.data?.forEach(ele => ele.userId = val.id);
                // konsole.log("vishnudbresponse123", response.data.data, val.id)
                const proffdata = response?.data?.data;
                _bothMemlist.push(proffdata);
                if (proffdata?.length !== 0) {
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
                if(this.state.primaryUserId == val.id) {
                    this.setState({profMemCountOfPrimaryUser: result?.length || 0});
                }
                fetchPromises.push(result);
                }
            } catch (error) {
                konsole.log("errorRes121", error);
                if(this.state.primaryUserId == val.id) {
                    this.setState({profMemCountOfPrimaryUser: 0});
                }
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

    checkProffsameOrNot = (dat) =>{
        konsole.log("valueueksnd",dat,this.state.responseuserDetail)
        
        let editDetail = this.state.responseuserDetail
        const checkPreviouslySaveForBoth = this.state.bothMemProfessionals?.length && this.state.bothMemProfessionals.filter(item => item.professionalUserId == editDetail.professionalUserId)
    
        if(this.state.toUpdate == true && checkPreviouslySaveForBoth?.length == 2 && dat == true){
          const filterProff = this.state.bothMemProfessionals.filter(item => item.professionalUserId == editDetail.professionalUserId && item.userId != editDetail.userId)
          // const filterProff = this.state.bothMemProfessionals.filter(item => item.professionalUserId == editDetail.professionalUserId && item.userProId != editDetail.userProId)
        konsole.log("filterProff121212",filterProff[0])
        this.deleteProfess(filterProff[0],this.state.loggedInUser,dat)
        }
        // this.setState({sameProffOrNot : value, deleteFromSpouse : dat})
    }

    deleteProfess = async (data, loggedUserId, removeFromSpouse) => {
        konsole.log("datataDelete",data,loggedUserId,this.state.groupedData);
      
        let ques = removeFromSpouse !== true ? await this.context.confirm( true, "Are you sure? You want to delete your professional.", "Confirmation") : true;
        let deleteProffData = removeFromSpouse == true ? this.state.bothMemlist : this.state.groupedData
        let filterProffToDelete = deleteProffData.filter(item => item.professionalUserId == data?.professionalUserId && item.userId == data.userId);
        konsole.log("filterProffToDelete1212",filterProffToDelete)
        let array = []
        for(let i = 0; i < deleteProffData?.length; i++){
          let index = i;
    
          if(filterProffToDelete[i]?.professionalUserId == data?.professionalUserId){
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
            if((this.state.currentUserId == this.state.primaryUserId && removeFromSpouse == true) || (this.state.currentUserId == this.state.spouseUserId && removeFromSpouse == undefined && this.state.bothMemProfessionals.some(ele => ele.userId != this.state.currentUserId && ele.proUserId == filterProffToDelete[i].proUserId))) {
              const userPrimaryCareMapId = await this.getUserPrimaryCareMap(this.state.spouseUserId, filterProffToDelete[i].proUserId);
              if(userPrimaryCareMapId == "err") continue;
              konsole.log("vishnudbunderdelete", userPrimaryCareMapId, filterProffToDelete[i]);
              if(userPrimaryCareMapId) {
                this.unMapUserPrimaryCareMap(userPrimaryCareMapId);
                continue;
              }
            }
          }
     
          $CommonServiceFn.InvokeCommonApi("DELETE",$Service_Url.deleteProfessionalUser,  json, (response, err) => {
              this.props.dispatchloader(false);
              if (response) {
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
                        //   let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
                        //   this.props?.FetchFamilyMembers(newuserid);
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
                //   this.setState({professionalButtonborder : 1, iseditprofile : true})
                  if (this.state.allMemberList?.length == 1) {
                    // this.handleClose()
                    this.setState({
                      allMemberList: [],
                      searchAllMemberProffList:[],
                      financMoreInfocheckboxdisable : false,
                    });   
                  } else {
                   konsole.log("userIDdd",this.state.currentUserId)
                    this.fetchAndDisplaySearchList(this.state.currentUserId,this.state.primaryUserId);
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

    getUserPrimaryCareMap = (userId, proUserId) => {
        return new Promise((resolve, reject) => {
          $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.mapGetPrimaryCare + `/${userId}?ProUserId=${proUserId}`, "", 
            (response, errorData) => {
                if(response.data?.data?.length) {
                    konsole.log("vishnudb getrslt", response.data?.data[0]?.userPrimaryCareMapId)
                    return resolve(response.data?.data[0]?.userPrimaryCareMapId);
                }
                return resolve("err")
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
                this.fetchAndDisplaySearchList(this.state.currentUserId, this.state.primaryUserId);
            }
            this.props.dispatchloader(false);
        })
    
    }
    
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
            toUpdate: false,
            showProffTable: false,
            previouslySavedData: [],
            proCategories: [],
            isAddAnotherClicked: false,
        });
        let inputdata = {
            subtenantId: subtenantId,
            fName: this.state.fName ? this.state.fName : "pro-first-name",
            mName: this.state.mName ? this.state.mName : "",
            lName: this.state.lName ? this.state.lName : "pro-last-name",
            isPrimary: false,
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
                    konsole.log( "prosearch result at member creation", response?.data?.data);
                    let responseData = response?.data?.data?.member;
                    // debugger;
                    konsole.log('responseDataresponseData',responseData)
                    let newProfessionalDetail = {
                        ...responseData,
                        fName: responseData.fName === "pro-first-name" ? "" : responseData.fName,
                        lName: responseData.lName === "pro-last-name" ? "" : responseData.lName,
                    };
                    konsole.log('newProfessionalDetail',this.props,newProfessionalDetail)
                    // debugger;
                    this.setState({responseuserDetail: newProfessionalDetail, toUpdate: false, checkSameProff: false});
                    // debugger;
                    // this.resetState();
                    konsole.log("addNewProffAddResponse", newProfessionalDetail);
                    this.setState({
                            toUpdate: false,
                            iseditprofile: false,
                            proCategories: [],
                            showproserprovider: true,
                        },
                    );
            
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


    toasterAlert(text, type) {
        this.context.setdata({ open: true, text: text, type: type });
    }

    // disableProfessionalAdd = (state) => {
    //     this.setState({
    //         restrictAddProfessional: state,
    //     });
    // };

    // may be removed in next commit
    mapForSpouse = (proUserId) => {
        konsole.log("vishnudbInsideMapForSpouse", proUserId)
        const primaryUserId = this.state.primaryUserId;
        const loggedInUser = this.state.loggedInUser;
      
        // only 
        if(primaryUserId != this.state.currentUserId) return;
      
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
                            this.resetProServiceProvider();
                            this.fetchAndDisplaySearchList(this.state.currentUserId, sessionStorage.getItem("SessPrimaryUserId"));
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
        if(!this.props.UserDetail?.userId) return
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi(
            "GET",
            $Service_Url.getPrimaryPhysician + this.props.UserDetail?.userId,
            "",
            (response, errorData) => {
                // konsole.log("chjjvhsb", response, errorData);
                this.props.dispatchloader(false);
                if (response) {
                    let tempprimary = response?.data?.data?.physicians?.filter(
                        (v, j) => v.is_Primary_Care == true
                    );
                    if (!tempprimary.length) {
                        this.setState({
                            alreadyhaveprimaryphysician: false,
                            primaryphysiciandetails: undefined,
                        });
                        return;
                    }
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

    // end of code copied from professSearch ------------------------------------------------------------------------------------------------------------

    fetchProSerDesc = async () => {
        this.preFetchAllProSubTypeIds();
        $CommonServiceFn.InvokeCommonApi("Get", $Service_Url.getProfessionalSecDesc,'', (response, error) => {
            if(error) {
                konsole.log("fetchProSerDescerror",error)
            }
            konsole.log("fetchProSerDesctres",response?.data?.data);
            let responseData = response?.data?.data;

            // for state updating
            let _proSerDescIdList = {};

            // adding icons with response
            const themeIcons = [
            "/icons/healthbw.svg",
            "/icons/housingbw.svg",
            "/icons/financebw.svg",
            "/icons/legalbw.svg",
            "/icons/otherbw.svg"
            ]
            for(let i = 0; i < responseData?.length; i++){
                if(this.props.proSerDescTd && this.props.proSerDescTd != responseData[i].value) continue;
                responseData[i]["themeIcons"] = themeIcons[i];
                
                responseData[i]["checked"] = false;
                _proSerDescIdList[responseData[i].value] = responseData[i];
                
                this.fetchprotypeIds(responseData[i].value);
            }

            konsole.log("final _proSerDescIdList", _proSerDescIdList)
            this.setState({
                proSerDescIdList: _proSerDescIdList
            })

            konsole.log("fetchProSerDescIconsCommon",responseData)
        })
    }

    fetchprotypeIds = ( proSerDescId ) => {
        konsole.log("fetchprotypeIdpara", proSerDescId);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getProfesType + `?proSerDescId=${proSerDescId}`, "", (response) => {
            if(!response?.data?.data) {
                konsole.log("fetchprotypeIderror")
            }

            // for state updating
            let _protypeIdList = {};

            konsole.log("fetchprotypeIdres", response?.data?.data);
            for(let i = 0; i < response?.data?.data?.length; i++){
                if(this.props.protypeTd && response?.data?.data[i]?.value != this.props.protypeTd) continue;
                const ele = response?.data?.data[i];
                ele["checked"] = false;
                _protypeIdList[ele.value] = ele;
            }

            this.setState(oldState => {
                return {...oldState, protypeIdList: {...oldState.protypeIdList, ..._protypeIdList}}
            })

            konsole.log("final _protypeIdList", _protypeIdList)

            this.setState(oldState => {
                const newproSerDescIdList = {...oldState.proSerDescIdList}
                newproSerDescIdList[proSerDescId] = {...oldState.proSerDescIdList[proSerDescId]}
                newproSerDescIdList[proSerDescId]["subCat"] = Object.keys(_protypeIdList)
                
                return {
                    ...oldState,
                    proSerDescIdList: newproSerDescIdList
                }
            })

            for(let i = 0; i < response?.data?.data?.length; i++){
                const ele = response?.data?.data[i];
                this.fetchproSubTypeIds(ele.value)
            }

            return response?.data?.data;
        })
    }

    preFetchAllProSubTypeIds = () => {
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getProffesionalSubType + `?protypeId=`, "", (response) => {
            if(!response?.data?.data) {
                konsole.log("fetchproSubTypeIderror")
            }

            // for state updating
            let _proSubTypeIdList = {};

            // if given protypeTd have proSubType then below code will make filter visible
            if(this.props.protypeTd == "" || response?.data?.data?.some(ele => ele.proTypeId == this.props.protypeTd) == true) this.setState({hideFilters: false});

            konsole.log("fetchproSubTypeIdres",response?.data?.data);
            for(let i = 0; i < response?.data?.data?.length; i++) {
                const ele = response?.data?.data[i];
                _proSubTypeIdList[ele.proSubTypeId] = {...ele, checked: false, value: ele.proSubTypeId, label: ele.proSubType};
                
            }

            this.setState(oldState => {
                return {...oldState, proSubTypeIdList: { ...oldState.proSubTypeIdList, ..._proSubTypeIdList}}
            })

            konsole.log("final _proSubTypeIdList", _proSubTypeIdList)
        })
    }
    
    fetchproSubTypeIds = ( protypeId ) => {
        const _proSubTypeIdList = Object.keys(this.state.proSubTypeIdList).filter(proSubTypeId => this.state.proSubTypeIdList[proSubTypeId].proTypeId == protypeId);
        
        konsole.log("sfdndzvkjbsdkjdvbkjsbvdkj", protypeId, _proSubTypeIdList)

        this.setState(oldState => {
            const newprotypeIdList = {...oldState.protypeIdList}
            newprotypeIdList[protypeId] = {...oldState.protypeIdList[protypeId]}
            konsole.log("dsbvjhdsbvbdjvbhdsbj", oldState.protypeIdList, protypeId, newprotypeIdList[protypeId])
            newprotypeIdList[protypeId]["subCat"] = _proSubTypeIdList;
            return {
                ...oldState,
                protypeIdList: newprotypeIdList
            }
        })

        konsole.log("statefinal\n", this.state.proSerDescIdList, this.state.protypeIdList, this.state.proSubTypeIdList)
        return;
    }

    dynamicChecking = (_isChecked, _proSerDescId, _protypeId, _proSubTypeId) => {
        _isChecked = !_isChecked;
        konsole.log("testing", _isChecked, _proSerDescId, _protypeId, _proSubTypeId);
        if(_proSubTypeId) {
            if(_isChecked) {
                this.setState(oldState => {
                    let _proSerDescIdList = oldState.proSerDescIdList;
                    let _protypeIdList = oldState.protypeIdList;
                    let _proSubTypeIdList = oldState.proSubTypeIdList;

                    _proSerDescIdList[_proSerDescId].checked = _protypeIdList[_protypeId].checked = _proSubTypeIdList[_proSubTypeId].checked = true;

                    konsole.log("testing", _proSerDescIdList, _protypeIdList, _proSubTypeIdList);
                    return {...oldState, proSerDescIdList: _proSerDescIdList, protypeIdList: _protypeIdList, proSubTypeIdList: _proSubTypeIdList}
                })
            } else {
                this.setState(oldState => {
                    let _protypeIdList = oldState.protypeIdList;
                    let _proSubTypeIdList = oldState.proSubTypeIdList;

                    _proSubTypeIdList[_proSubTypeId].checked = false;
                    _protypeIdList[_protypeId].allCheck = false;

                    return {...oldState, protypeIdList: _protypeIdList, proSubTypeIdList: _proSubTypeIdList}
                })
            }
            konsole.log("testing", this.state.proSerDescIdList, this.state.protypeIdList, this.state.proSubTypeIdList);
        } else if(_protypeId) {
            if(_isChecked) {
                this.setState(oldState => {
                    let _proSerDescIdList = oldState.proSerDescIdList;
                    let _protypeIdList = oldState.protypeIdList;
                    let _proSubTypeIdList = oldState.proSubTypeIdList;

                    _proSerDescIdList[_proSerDescId].checked = _protypeIdList[_protypeId].checked = true;
                    _protypeIdList[_protypeId].subCat?.forEach(proSubCatId => _proSubTypeIdList[proSubCatId].checked = true);

                    return {...oldState, proSerDescIdList: _proSerDescIdList, protypeIdList: _protypeIdList, proSubTypeIdList: _proSubTypeIdList}
                })
            } else {
                this.setState(oldState => {
                    let _proSerDescIdList = oldState.proSerDescIdList;
                    let _protypeIdList = oldState.protypeIdList;
                    let _proSubTypeIdList = oldState.proSubTypeIdList;

                    _protypeIdList[_protypeId].checked = false;
                    _proSerDescIdList[_proSerDescId].allCheck = false; 
                    _protypeIdList[_protypeId].subCat?.forEach(proSubCatId => _proSubTypeIdList[proSubCatId].checked = false);
                    
                    return {...oldState, proSerDescIdList: _proSerDescIdList, protypeIdList: _protypeIdList, proSubTypeIdList: _proSubTypeIdList}
                })
            }
        } else if(_proSerDescId) {
            if(_isChecked) {
                this.setState(oldState => {
                    let _proSerDescIdList = oldState.proSerDescIdList;
                    
                    _proSerDescIdList[_proSerDescId].checked = _proSerDescIdList[_proSerDescId]["allCheck"] = true;
                    
                    return {...oldState, proSerDescIdList: _proSerDescIdList}
                })
            } else {
                this.setState(oldState => {
                    let _proSerDescIdList = oldState.proSerDescIdList;
                    
                    _proSerDescIdList[_proSerDescId].checked = _proSerDescIdList[_proSerDescId]["allCheck"] = false;
                    
                    return {...oldState, proSerDescIdList: _proSerDescIdList}
                })
            }
        }
    }

    resetProServiceProvider = ( sameAs ) => {
        if(sameAs) return;
        if(this.props.protypeTd == "") this.state.toUpdate ? AlertToaster.success("Professional updated successfully") : AlertToaster.success("Professional saved successfully");

        let _resetProserDescList = this.state.proSerDescIdList;
        for(const [key, val] of Object.entries(_resetProserDescList)) {
            _resetProserDescList[key].checked = false;
        }

        this.setState({
            toUpdate: false,
            addNewProff: "",
            openSubModal: this.state.isAddAnotherClicked == true ? "submodal2" : "submodal1",
            searchresult: false,
            searchText: "",
            openCatogories: [],
            proSerDescIdList: _resetProserDescList, 
            openCatogories: [], 
            newProfSearchResult: [], 
            responseuserDetail: {},
        });

        if(this.state.isAddAnotherClicked == true) this.handlepersonalinfosubmit("addNewProff");
    }

    searchResultUserTemplate = ( userDetails ) => {
        const {userId, proFullName, proPrimaryContact, proPrimaryEmail, isDisabled} = userDetails;

        let proTypeListString = " ";
        userDetails.proCategories.forEach(ele => proTypeListString += ele.proType + ", ");

        return (
        <Row>
            <Col xs={1}><img src='/icons/ProfilebrandColor2.svg' alt='professional profile' width={30} /></Col>
            <Col style={{textAlign: 'left'}} >
                <p>{proFullName}</p>
                <div className='profType' title={proTypeListString.substring(0, proTypeListString?.length - 2)}>
                    <img src='/icons/suitcaseGray.svg' alt='' />
                    <p className='textval'>{proTypeListString.substring(0, proTypeListString?.length - 2)}</p>
                </div>
            </Col>
            <Col xs={3}>
                <p className='textval'>{proPrimaryContact !== null && proPrimaryContact !== "" ? this.PhoneFormat(proPrimaryContact) : "Not Provided"}</p>
            </Col>
            <Col xs={3}>
                <p className='textval'>{proPrimaryEmail || "Not Provided"}</p>
            </Col>
            <Col xs={1}>
                {isDisabled != true && <img src='/icons/addProfBlack.svg' alt='' title='Add Professional' width={20} onClick={() => this.handleAddProfesFromSearch(userDetails)}/>}
            </Col>
        </Row>
        )
    }

    handleAddProfesFromSearch = async ( userDetails ) => {
        let confirmAddProfes = await this.context.confirm(true, "Are you sure you want to add this professional?", "Confirmation");
        if (!confirmAddProfes) return;

        this.invokeEditProfessional(userDetails,"addForUser");
        this.setState({searchresult: false});
    }

    pageNumber = 1;
    reachedEnd = false;
    handleProfSearch = ( e ) => {
        e.preventDefault();

        let proSerDescIds = this.state.hideFilters == true ? this.props.proSerDescTd : '';
        let proTypeIds = this.state.hideFilters == true ? this.props.protypeTd : '';
        let proSubTypeIds = '';

        if(this.state.hideFilters != true) {
            for(const [key, val] of Object.entries(this.state.proSerDescIdList)) {
                if(val.checked == true) proSerDescIds += key + ",";
            }
            if(proSerDescIds?.length) proSerDescIds = proSerDescIds.slice(0, -1);
            
            for(const [key, val] of Object.entries(this.state.protypeIdList)) {
                if(val.checked == true) proTypeIds += key + ",";
            }
            if(proTypeIds?.length) proTypeIds = proTypeIds.slice(0, -1);

            for(const [key, val] of Object.entries(this.state.proSubTypeIdList)) {
                if(val.checked == true) proSubTypeIds += key + ",";
            }
            if(proSubTypeIds?.length) proSubTypeIds = proSubTypeIds.slice(0, -1);
        }

        if(proSerDescIds?.length == 0) {
            this.toasterAlert("Please select professional type from left menu to search", "Warning");
            return;
        }

        const searchName = this.state.searchText || "";
        if(searchName?.length < 1) {
            this.toasterAlert("Please type name or email in search box", "Warning"); 
            return;
        }

        this.setState({searchresult: true, openSubModal: "", newProfSearchResult: []});
        this.pageNumber = 1, this.reachedEnd = false;
        this.setState({prevSearch: {
            searchName: searchName,
            proSerDescIds: proSerDescIds,
            proTypeIds: proTypeIds,
            proSubTypeIds: proSubTypeIds
        }})

        this.searchForProfNew(searchName, proSerDescIds, proTypeIds, proSubTypeIds);
    }

    searchForProfNew = (_searchName, _ProSerDescIds, _proTypeIds, _proSubTypeIds) => {
        this.reachedEnd = true;

        const inputData = {
            searchName: _searchName,
            pageNumber: this.pageNumber || 1,
            rowsOfPage: 100,
            ProSerDescIds: _ProSerDescIds,
            proTypeIds: _proTypeIds,
            proSubTypeIds: _proSubTypeIds,
        };

        konsole.log("bdsbjksabkbkj", inputData);

        this.props.dispatchloader(true);
        $getServiceFn.postGetProfessUsersV3(inputData, (res, err) => {
            this.props.dispatchloader(false);
            if(err) return;

            konsole.log("searchForProfNew", res.data?.data)

            // remove already added prof
            let newProfList = this.removeAlreadyAddedProf(res.data?.data || []);

            this.setState(oldState => {return {newProfSearchResult: [...oldState.newProfSearchResult, ...newProfList]}});
            this.reachedEnd = false;

            if (this.state.newProfSearchResult?.length < 20 && !this.reachedEnd && this.state.searchresult == true) {
                this.pageNumber += 1;
                const {searchName, proSerDescIds, proTypeIds, proSubTypeIds} = this.state.prevSearch;
                this.searchForProfNew(searchName, proSerDescIds, proTypeIds, proSubTypeIds);
            }
        })

    } 

    removeAlreadyAddedProf = ( newProfList ) => {
        const alreadyAddedMem = this.state.searchAllMemberProffList;
        for(let j = 0; j < newProfList?.length; j++) {
            if(newProfList[j].isDisabled) continue;
            for(let i = 0; i < alreadyAddedMem?.length; i++) {
                if(alreadyAddedMem[i].proUserId == newProfList[j].proUserId) newProfList[j].isDisabled = true;
            }
        }
        return newProfList;
    }

    handleScroll = (e) => {
        const bottom = Math.abs((e.target.scrollHeight - e.target.scrollTop) - e.target.clientHeight) <= 5;
        if (bottom && !this.reachedEnd) {
            this.pageNumber += 1;
            const {searchName, proSerDescIds, proTypeIds, proSubTypeIds} = this.state.prevSearch;
            this.searchForProfNew(searchName, proSerDescIds, proTypeIds, proSubTypeIds);
        }
    }

    openAorg = () => {
        if(demo != true) return;
        const stateObj = sessionStorage.getItem('stateObj');
        const redirectTo = window.location.href?.split("?")[0];
        const isPrimaryCarePhysician = this.props.protypeTd == "10" ? true : false;
        const isLPO = this.props.showForm == 2 ? true : false;
        
        let proSerDescIdSelected = this.props.proSerDescTd ? this.props.proSerDescTd : "";
        let proTypeSelected = this.props.protypeTd ? this.props.protypeTd : "";
        let proSubTypeSelected = "";

        if(this.props.protypeTd == "" && !this.props.proSerDescTd)
        for(let [key, value] of Object.entries(this.state.proSerDescIdList)) {
            if(value.checked == true) proSerDescIdSelected += key + ","
        }

        if(this.props.protypeTd == "" && !this.props.proSerDescTd)
        for(let [key, value] of Object.entries(this.state.protypeIdList)) {
            if(value.checked == true) proTypeSelected += key + ","
        }

        // for(let [key, value] of Object.entries(this.state.proSubTypeIdList)) { // To fix URL invalid bug, commented this to not send professional subtypes in url
        //     if(value.checked == true) proSubTypeSelected += key + ","
        // }

        if(this.props.showForm == 2 && this.props.currentPath?.length) {
            sessionStorage.setItem("lastPath", this.props.currentPath + ">" + (this.props.activeUser || "1"));
            sessionStorage.setItem("openModal4SetGuidanceProType", this.props.protypeTd);
        }

        const tokenKey = this.stringItInFormate(stateObj) + `memberUserId=${this.state.currentUserId}&redirectTo=${redirectTo}`;
        const proCategoriesKey = `isPrimaryCarePhysician=${isPrimaryCarePhysician}&isLPO=${isLPO}&proSerDescIdSelected=${proSerDescIdSelected}&proTypeSelected=${proTypeSelected}&proSubTypeSelected=${proSubTypeSelected}`;
        konsole.log("tokenKey", tokenKey, "\nproCategoriesKey:", proCategoriesKey)
        window.history.pushState("", "", redirectTo);
        sessionStorage.setItem("openModalHash", this.props.uniqueKey);
        sessionStorage.setItem("openModal4User", this.state.selectedUser);
        // window.location.replace(`http://localhost:3001/?token=${window.btoa(tokenKey)}&proCategories=${window.btoa(proCategoriesKey)}`); // for local testing
        window.location.replace(`${aorgLink}?token=${window.btoa(tokenKey)}&proCategories=${window.btoa(proCategoriesKey)}`); // for UAT and Production
    }

    UserSelectModal = () => {
        return (
            <div className='userSelect d-sm-flex flex-sm-column flex-xs-row flex-md-row flex-lg-row flex-xl-row'>
                {this.props.protypeTd == "10" ? 
                <div className={'roundCheck'}>
                    <img className='checkbox' src='/profRoundCheck.svg' alt=''/>
                    <img src='/icons/ProfilebrandColor2.svg' alt='' />
                    <label>{this.state.selectedUser == "1" ? this.hideLastName(this.state.userDetails?.memberName) : this.hideLastName(this.state.userDetails?.spouseName)}</label>
                </div>
                : <>
                <div className={this.state.selectedUser == "1" ? 'roundCheck' : 'roundUnCheck'} onClick={() => this.changeUserSelect("1")}>
                    {this.state.selectedUser == "1" ? <img className='checkbox' src='/profRoundCheck.svg' alt=''/> : <img className='checkbox' src='/profRoundUnCheck.svg' alt='' />}
                    <img src='/icons/ProfilebrandColor2.svg' alt='' />
                    <label>{this.hideLastName($AHelper.capitalizeAllLetters(this.state.userDetails?.memberName))}</label>
                </div>
                {(this.state.spouseUserId && this.state.spouseUserId != 'null') &&  
                <>
                <div style={{border: "2.16px solid #00000070", margin: "5px"}}></div>
                <div className={this.state.selectedUser == "2" ? 'roundCheck' : 'roundUnCheck'} onClick={() => this.changeUserSelect("2")}>
                    {this.state.selectedUser == "2" ? <img className='checkbox' src='/profRoundCheck.svg' alt=''/> : <img className='checkbox' src='/profRoundUnCheck.svg' alt='' />}
                    <img src='/icons/ProfilebrandColor2.svg' alt='' />
                    <label>{this.hideLastName($AHelper.capitalizeAllLetters(this.state.userDetails?.spouseName))}</label>
                </div>
                </>
                }
                </>}
            </div>
        )
    }
    handleShowAlert = () => {
        if (this.state.profMemCountOfPrimaryUser > 0 && this.props.PageName?.length > 0) {
          this.toasterAlert(`${this.props.PageName} already available.`, "Warning");
        }
    };
    changeUserSelect = (selectUser) => {
        this.setState({selectedUser: selectUser, openSubModal: ""})
        if(this.props.protypeTd == "11") {
            this.props.changeUser();
        }
    }

    searchFilter = ( prof ) => {
        const searchText = this.state.filterText?.toLocaleLowerCase();
        const fullName = prof?.fName + " " + prof?.lName;
        if(fullName?.toLocaleLowerCase()?.includes(searchText) || prof?.emaidIds?.toLocaleLowerCase()?.includes(searchText) || prof?.proType?.toLocaleLowerCase()?.includes(searchText)) return true;
        return false;
    }

    stringItInFormate = (objectString) => {
        const object = JSON.parse(objectString);
        let string = "";
        for (const [key, value] of Object.entries(object)) {
          string += `${key}=${value}&`
        }
        return string;
    }

    render () {

        let modalHeight = document.getElementById('newProfessionalServiceModal')?.offsetHeight;

        if(this.state.openSubModal != "submodal2"){
            modalHeight=600
        }

        let _modalFinalHeight=modalHeight-200;
        let _modalFinalSuCategoryHeight=_modalFinalHeight-154;

        konsole.log("openSubModal",this.state.openSubModal)

        return this.state.alreadyhaveprimaryphysician ? (
            <>
              <style jsx global>{`
                .modal-open .modal-backdrop.show {
                  opacity: 0.7;
                }show
              `}</style>
      
             
      
      
              {/* <a onClick={()=> {
                this.props.disableSpouseEdit == false? 
                this.showPhysician():
                  this.toasterAlert("Cannot edit details as you and  spouse share the same Primary care physician.", "Warning")
              }} style={{ textDecoration: "underline", cursor: "pointer" }}>Edit</a> */}
              <a
                onClick={() => this.handleShow()}
                style={{ textDecoration: "underline", cursor: "pointer",fontSize:"13px" }}>Edit</a>
      
              <Primarycarephysician
                UserDetail={this.props.UserDetail}
                docUsr={this.state.responseuserDetail}
                hidePhysician={this.handleShow}
                show={this.state.showModal}
                CallSearchApi={this.fetchAndDisplaySearchList}
                alreadyhaveprimaryphysician={this.state.alreadyhaveprimaryphysician}
                primaryphysiciandetails={this.state.primaryphysiciandetails}
                toUpdate={true}
              />
            </>
            ) : (
            <>
            {this.props.showForm == 2 ? 
            <></> :
            this.props.protypeTd == "" ? 
            <>
            {(this.props.type == "header" || this.props.type == 'headerLpo') ? 
            (this.props.type == 'headerLpo' ? <OverlayTrigger overlay={<Tooltip id="toolTip-disabeld">Professionals</Tooltip>} >
                <span className="d-inline-block" onClick={this.handleShow}>
                    <img className="menuLpo1 "  src="Group 15763.svg" />
                </span>
            </OverlayTrigger> : <OverlayTrigger overlay={<Tooltip id="toolTip-disabeld">Professionals</Tooltip>} >
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
            </> : this.props.protypeTd == '12' || this.props.protypeTd == '3' || this.props.protypeTd == '1' || this.props.showForm == 3 ?
            (<>
            <Card
              className="border-0 p-0"
              onClick={this.handleShow}
            >
              <Card.Img variant="Top" className="" src={this.props.sourceImg} style={{backgroundColor: 'white', border: "1px solid #dee2e6"}}/>
              <Card.Body className="p-0">
                <div className="border d-flex justify-content-between align-items-center p-2 ">
                  <p className="ms-2">
                    {this.props.PageName} ({this.state.profMemCountOfPrimaryUser})
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

            {/* check box of bookkeeper */}
            {this.props.protypeTd == '12' && (<div className="border d-flex justify-content-start py-1  ">
                <div //book
                  key="checkbox1"
                  onClick={() =>
                    this.state.profMemCountOfPrimaryUser > 0 &&
                    this.props.isNotBookkeeper == false &&
                    this.toasterAlert(
                      "Bookkeeper already available.",
                      "Warning"
                    )
                  }
                >
                  {this.state.profMemCountOfPrimaryUser > 0 ? (
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
                    (this.state.profMemCountOfPrimaryUser > 0 && this.props.isNotBookkeeper == false)
                      ? "text-secondary"
                      : ""
                  } ms-2 pt-1 `}>I don't have one</p>
            </div>)}

            {/* check box of accountant */}
            {this.props.protypeTd == '3' &&  <div className="border d-flex justify-content-start py-1  ">
                <div key="checkbox1 ">
                  <AccountantMoreInfo
                    financMoreInfocheckboxdisable={
                      this.state?.profMemCountOfPrimaryUser > 0
                    }
                    profMemberCount={this.state.profMemCountOfPrimaryUser}
                    forceUncheck={this.state.showModal}
                    // restrictAddProfessional={this.state.restrictAddProfessional}
                    // disableProfessionalAdd={this.disableProfessionalAdd}
                  />
                </div>
                <p
                  // className="ms-2 pt-1 text-secondary"
                  className={`${
                    this.state?.profMemCountOfPrimaryUser > 0
                      ? "text-secondary"
                      : ""
                  } ms-2 pt-1 `}
                >
                  I don't have one
                </p>
            </div>}

            {/* check box of financial advisor */}
            {this.props.protypeTd == '1' && <div className="border d-flex justify-content-start py-1">
                <div key="checkbox1">
                  <FinancialAdvisorMoreInfo
                    financMoreInfocheckboxdisable={
                      this.state?.profMemCountOfPrimaryUser > 0
                    }
                    profMemberCount={this.state.profMemCountOfPrimaryUser}
                    forceUncheck={this.state.showModal}
                    // restrictAddProfessional={this.state.restrictAddProfessional}
                    // disableProfessionalAdd={this.disableProfessionalAdd}
                  />
                </div>
                <p
                  //  className="ms-2 pt-1"s
                  className={`${
                    this.state?.profMemCountOfPrimaryUser > 0
                      ? "text-secondary"
                      : ""
                  } ms-2 pt-1 `}
                >
                  I don't have one
                </p>
            </div>}

            {["12", "3", "1"].includes(this.props.protypeTd?.toString()) == false && <div className="border d-flex justify-content-start py-1 iDontHave">
                <div key="checkbox1" onClick={this.handleShowAlert}><SimpleProfMoreInfoConnected formLabels={this.props.formLabels} professionalCount={this.state.profMemCountOfPrimaryUser} forceUncheck={this.state.showModal}/>
                </div>
                <p className={`${this.state?.profMemCountOfPrimaryUser > 0
                      ? "text-secondary" : ""} ms-2 pt-1 `} > I don't have one</p>
            </div>}

            </>)
            : this.props.protypeTd == "11"  || this.props.protypeTd == "10"? 
            <a onClick={this.handleShow}>
              <img
                className=""
                src="/icons/add-icon.svg"
                alt="profess Search"
                // style={{ padding: "0px 7px" }}
              />
            </a>
            : <></>}

            <Modal animation={false} enforceFocus={false} id="pspm" show={this.state.showModal} onHide={this.handleShow} backdrop="static" centered >
                <Row  >
                    <Col className='leftCol' style={{display: this.state.hideFilters == true ? "none" : "block"}}>
                        {this.UserSelectModal()}

                        <div style={{width: '80%', border: '1px #E7E7E7 solid', margin: '35px auto'}}></div>

                        <div className='catogories' style={{maxHeight:`${_modalFinalHeight}px`}}>

                            {Object.keys(this.state.proSerDescIdList).map(proSerDescId => {
                                const _proSerDesc = this.state.proSerDescIdList[proSerDescId];
                                const _proSerDescChecked = _proSerDesc?.checked;
                                const _checkedAtleast1ProType = _proSerDesc?.subCat?.length == 0 || _proSerDesc?.subCat?.some((ele) => this.state.protypeIdList[ele]?.checked == true);
                                if(_checkedAtleast1ProType == false && _proSerDescChecked == true && _proSerDesc?.allCheck != true) this.dynamicChecking(true, proSerDescId);

                                return (
                                <>
                                <Row>
                                    {<><div className='w2'><input type='checkbox' checked={_proSerDescChecked} onChange={() => this.dynamicChecking(_proSerDescChecked, proSerDescId)} /></div><div className='w2'><img src={_proSerDesc.themeIcons} alt={_proSerDesc.label}/></div></>}
                                    <Col onClick={() => this.handleOpenCat(_proSerDesc.label)} className='labelName'><label>{_proSerDesc.label}</label></Col>
                                    <Col xs={2} className='openIcon' onClick={() => this.handleOpenCat(_proSerDesc.label)}>{this.state.openCatogories?.includes(_proSerDesc.label) ? <>&#x2212;</> : <>&#x2b;</>}</Col>

                                    {<div className='subcatogories' style={{display: `${this.state.openCatogories?.includes(_proSerDesc.label) ? "block" : "none"}`}}>
                                        {/* {_proSerDesc.subCat?.map(protypeId => { */}
                                        {_proSerDesc.subCat ?.filter(protypeId => this.state.protypeIdList[protypeId]?.label?.toLowerCase() !== "other") .map(protypeId => {
                                            const _protype = this.state.protypeIdList[protypeId];
                                            const _protypeChecked = _protype?.checked;
                                            const _sorterSubType = this.state.proSubTypeIdList;
                                            const _checkedAtleast1ProSubType = _protype?.subCat?.length == 0 || _protype?.subCat?.some((ele) => this.state.proSubTypeIdList[ele]?.checked == true)
                                            if(_checkedAtleast1ProSubType == false && _protypeChecked == true)  this.dynamicChecking(true, proSerDescId, protypeId)
                                            else if(_protypeChecked == true && _proSerDescChecked == false) this.dynamicChecking(true, proSerDescId, protypeId)
                                            else if(_protypeChecked == false && _proSerDesc?.allCheck == true) this.dynamicChecking(false, proSerDescId, protypeId)

                                            return (
                                                <Row> 
                                                    <div className='w2'><input type='checkbox' checked={_protypeChecked} onChange={() => this.dynamicChecking(_protypeChecked, proSerDescId, protypeId)} /></div>
                                                    <Col><label>{_protype.label}</label></Col>
                                                    {_protype.subCat?.length > 0 && <Col xs={2} className='openIcon' onClick={() => this.handleOpenCat(_protype.label)}>{this.state.openCatogories?.includes(_protype.label) ? <>&#x2212;</> : <>&#x2b;</>}</Col>}

                                                    {this.state.openCatogories?.includes(_protype.label) && <div style={{maxHeight:`${_modalFinalSuCategoryHeight}px`}} className='subsubcatogories'>
                                                        {_protype.subCat?.sort((a,b)=> _sorterSubType[a]?.label?.localeCompare(_sorterSubType[b]?.label))?.map(proSubTypeId => {
                                                            const _proSubType = this.state.proSubTypeIdList[proSubTypeId];
                                                            const _proSubTypeChecked = _proSubType?.checked;
                                                            // if(_proSubTypeChecked == true && (_protypeChecked == false || _proSerDescChecked == false)) this.dynamicChecking(true, proSerDescId, protypeId, proSubTypeId)
                                                            // else if(_proSubTypeChecked == false && _protype?.allCheck == true) this.dynamicChecking(false, proSerDescId, protypeId, proSubTypeId)

                                                            return (
                                                                <Row> 
                                                                    <div className='w2'><input type='checkbox' checked={_proSubTypeChecked} onChange={() => this.dynamicChecking(_proSubTypeChecked, proSerDescId, protypeId, proSubTypeId)} /></div>
                                                                    <Col><label>{_proSubType.label}</label></Col>
                                                                </Row>
                                                            )
                                                        })}
                                                    </div>}
                                                </Row>
                                            )
                                        })}
                                    </div>}

                                </Row>
                                <div style={{width: '100%', border: '1px #E7E7E7 solid', margin: '20px auto'}}></div>
                                </>
                                )
                            })}
                                
                        </div>
                    </Col>
                    <Col className='rightCol' id='newProfessionalServiceModal'>
                        <div className='sideBorderpspm'></div>
                        <Row style={{width: '100%', margin: '0'}}>
                            <Col className='leftCol' style={{display: this.state.hideFilters == true ? "block" : "none", paddingBottom: '0px'}}>
                                {this.UserSelectModal()}
                                <div style={{width: '80%', border: '1px #E7E7E7 solid', margin: '30px auto 0px'}}></div>
                            </Col>
                            <Col className='rightCol'>
                                <div className='headerBox'>
                                    <p>{this.props.showForm == 2
                                        ? "Service Providers"
                                        : this.props.showForm == 3 && this.props.PageName && (typeof this.props.PageName === 'string')
                                        ? this.props.PageName
                                        : this.props.protypeTd == "12"
                                        ? "Bookkeeper"
                                        : this.props.protypeTd == "3"
                                        ? "Accountant"
                                        : this.props.protypeTd == "1"
                                        ? "Financial Advisor"
                                        : this.props.protypeTd == "10"
                                        ? "Primary Care Physician"
                                        : this.props.protypeTd == "11"
                                        ? "Specialist" : "Service Providers"}</p>
                                    <button onClick={this.handleShow}>&#x2715;</button>
                                </div>
                            </Col>
                        </Row>
                        <div className='bodyBox'>
                            <p className='txt1'>Search and add professionals to my list:</p>
                            <form onSubmit={this.handleProfSearch}>
                            <div className='searchbox'>
                                <Row>
                                    <img src='/icons/search-icon.svg' alt='search-icon'/>
                                    <input value={this.state.searchText} onChange={e => this.setState({searchText: e.target?.value})} name="searchText" type='text' placeholder="Professional's name  | Email "/>
                                    <button type='submit'>Search</button>
                                </Row>
                            </div>
                            </form>
                            <div style={{width: '30%', border: '01px #E7E7E7 solid', margin: '20px auto'}}></div>
                            {this.state.searchresult ? (<div className='searchResult'>
                                <Row style={{marginBottom: '20px'}}>
                                    <Col>“{" "+this.state.newProfSearchResult?.length+" "}professional{this.state.newProfSearchResult?.length <= 1 ? "" : "s"} found ”</Col>
                                    <Col xs={4} style={{textAlign:'right', color: '#720C20', cursor: 'pointer'}} onClick={() => {this.setState({searchresult: false});}}>&#129136; Back</Col>
                                </Row>
                                <div className='resCol' onScroll={this.handleScroll}>
                                    {this.state.newProfSearchResult.map(newProf => {
                                        return this.searchResultUserTemplate(newProf);
                                    })}
                                    {this.state.newProfSearchResult?.length == 0 && <Row className='searchbox border-0' ErrorMsgBox>
                                        <Col className='searchboxEmpty d-flex flex-column'>
                                            <label className='text-center mb-3' style={{fontSize:'16px'}}>
                                                There seems to be no data found.
                                                 {/* Please click below for a better search. */}
                                            </label>
                                            {(demo == true) && <button className='searchbutton m-auto' style={{width:'auto', borderRadius:'10px', paddingLeft:'20px', paddingRight:'20px'}} onClick={this.openAorg}>Search Resource Guide</button>}
                                        </Col>
                                    </Row>}
                                </div>
                            </div>) :
                            (<div className='reactangleData'>
                                <Row>
                                    <Row className='listOfData'>
                                        {/* this sub modal will not be visible in primary care physician */}
                                        {this.props.protypeTd != "10" && <Col className={`${this.state.openSubModal == 'submodal1' ? 'rectangleListOpen' : 'rectangleList'}`} >
                                            <Row onClick={() => this.openCloseSubModal("submodal1")}>
                                            <Col xs={1} title='View professional added in your list' style={{textAlign:'end'}} className={this.state.openSubModal == 'submodal1' ? 'openImg' : 'closeImg'}> {this.state.openSubModal == 'submodal1' ? ( <img className='openImgProfessional' src='/icons/RedView.svg' alt='view icon' />) : ( <img style={{ height: '19px' }} className='closeImgProfessional' src='/icons/GreyView.svg' alt='view icon' /> )}</Col>

                                                <Col xs={1} className='mx-lg-0' style={{textAlign:'center', fontSize:'25px', margin:'0 15px'}}><span style={{color:'#DCDCDC'}}>|</span></Col>
                                                <Col className='p-0'>
                                                    <label>View professional</label>
                                                </Col>
                                                <Col xs={1} className={`${this.state.openSubModal == 'submodal1' ? 'openIcon' : 'closeIcon'}`} style={{fontSize:'20px'}} >{this.state.openSubModal == "submodal1" ? <>&#x2212;</> : <>&#x2b;</>}</Col>
                                            </Row>
                                            {this.state.openSubModal == 'submodal1' ? 
                                            (<>
                                            <div style={{ width: '95%', border: '1px #720C20 solid', margin: 'auto' }}></div>
                                            <Row className='resColData'>
                                                {this.state.openSubModal == "submodal1" && (<div className='searchResult'>
                                                {this.state.searchAllMemberProffList?.length > 0 && <Row className='filterProf mb-4'>
                                                    <img src='/icons/search-icon.svg' alt='search-icon'/>
                                                    <input value={this.state.filterText} onChange={e => this.setState({filterText: e.target?.value})} name="searchText" type='text' placeholder="Search your professionals"/>
                                                </Row>}
                                                <div className='resCol'>
                                                    {this.state.searchAllMemberProffList?.length ? this.state.searchAllMemberProffList?.filter(ele => this.searchFilter(ele))?.sort((a, b) => a.fName.localeCompare(b.fName))?.map((prof) => {
                                                        return (
                                                            <Row className='resColRow'>
                                                                <Col xs={1}><img src='/icons/ProfilebrandColor2.svg' alt='professional profile' width={30} /></Col>
                                                                    <Col style={{textAlign: 'left'}}>
                                                                        <p>{$AHelper.capitalizeAllLetters(prof.fName + " " + prof.lName)}</p>
                                                                        <div className='profType' >
                                                                            <img src='/icons/suitcaseGray.svg' alt='' />
                                                                            <p className='textval' id='textval' title={prof.proType}>{prof.proType}</p>
                                                                            {/* <div className='dotGray'></div>
                                                                            <img src='/icons/locaterGray.svg' alt='' />
                                                                            <p className='textval'>Delhi</p> */}
                                                                        </div>
                                                                    </Col>
                                                                <Col>
                                                                    {/* <p>Phone</p> */}
                                                                    <p className='textval'>{prof.mobileNumbers !== null && prof.mobileNumbers !== "" ? this.PhoneFormat(prof.mobileNumbers) : "Not Provided"}</p>
                                                                </Col>
                                                                <Col>
                                                                    {/* <p>Email address</p> */}
                                                                    <p className='textval'>{prof.emaidIds !== null && prof.emaidIds !== "" ? prof.emaidIds : "Not Provided"}</p>
                                                                </Col>
                                                                <Col xs={2} className='d-flex justify-content-between'>
                                                                    <img src='/icons/blackEditIconProfessional.svg' alt='Edit' title='Edit' width={20} onClick={() => {this.invokeEditProfessional(prof,"updateForUser")}}/>
                                                                    <img src='/icons/deleteBlack.svg' alt='Delete' title='Delete' width={20} onClick={() => this.deleteProfess(prof,this.state.loggedInUser)}/>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    }) : <div className='p-2'>No Professional Added</div>}
                                                </div>
                                                </div>)}
                                            </Row>
                                            </>) : ""}
                                        </Col>}
                                    </Row>
                                    <Row className='listOfData'>
                                        <Col className={`${this.state.openSubModal == 'submodal2' ? 'rectangleListOpen' : 'rectangleList'}`} >
                                            <Row onClick={() => this.openCloseSubModal("submodal2")}>
                                            <Col xs={1} title='Add new professional to your list' style={{textAlign:'end'}} className={this.state.openSubModal == 'submodal2' ? 'openImg' : 'closeImg'}> {this.state.openSubModal == 'submodal2' ? ( <img style={{ height: '25px' }} className='openImgProfessionalNew' src='/icons/AddProfessionalIconNewState.svg' alt='add-professional-icon' />) : ( <img style={{ height: '25px' }} className='closeImgProfessionalNew' src='/icons/add-professional-icon.svg' alt='add-professional-icon' /> )}</Col>

                                                <Col xs={1} className='mx-lg-0' style={{textAlign:'center', fontSize:'25px', margin:'0 15px'}}><span style={{color:'#DCDCDC'}}>|</span></Col>
                                                <Col className='p-0'>
                                                    <label>{this.state.openSubModal == 'submodal2' && this.state.toUpdate == true ? "Update" : "Add"} professional</label>
                                                </Col>
                                                <Col xs={1} className={`${this.state.openSubModal == 'submodal2' ? 'openIcon' : 'closeIcon'}`} style={{fontSize:'20px'}} >{this.state.openSubModal == "submodal2" ? <>&#x2212;</> : <>&#x2b;</>}</Col>
                                            </Row>
                                            {this.state.openSubModal == 'submodal2' ? 
                                            (<>
                                            <div style={{ width: '95%', border: '1px #720C20 solid', margin: 'auto' }}></div>
                                            <Row className='resColData'>
                                                {this.state.openSubModal == "submodal2" && (
                                                    <div id='dfghjjj'>
                                                {console.log("openSubModalopenSubModal",this.state.openSubModal)}
                                                        {this.props.showForm == 2 && ["7","13","2","3","12","1","14","4"].includes(this.props.protypeTd?.toString()) ? 
                                                        <Addnewprofessionalmodal
                                                            toUpdate={this.state.toUpdate}
                                                            getProfessionalByUser={this.props.getProfessionalByUser}
                                                            showaddprofessmodal={this.props.pshow}
                                                            setshowaddprofessmodal={this.handleShow} 
                                                            professionaltype={this.props.protypeTd}
                                                            proSerDescType={this.props.proSerDescTd}
                                                            memberUserId={this.state.currentUserId} 
                                                            setAddnewprofessmodaldata={this.props.setAddnewprofessmodaldata }
                                                            userData={this.state.responseuserDetail}
                                                            checkSameProff = {this.state.checkSameProff}
                                                            checkProffsameOrNot={this.checkProffsameOrNot}
                                                        /> : this.props.showForm == 3 ?
                                                        <DynamicProfessForm
                                                            toUpdate={this.state.toUpdate}
                                                            proSerDescTd={this.props.proSerDescTd}
                                                            proTypeTd={this.props.protypeTd}
                                                            proTypeName={this.props.PageName}
                                                            activeUser={this.state.selectedUser}
                                                            CallSearchApi={this.fetchAndDisplaySearchList}
                                                            handleClose={this.resetProServiceProvider}
                                                            profData={this.state.responseuserDetail}
                                                            isSameForSpouse = {this.state.checkSameProff}
                                                            changeSameForSpouse = {this.checkProffsameOrNot}
                                                        /> : this.props.protypeTd == "" ? 
                                                        <ProServiceProvider
                                                            protypeTd={this.props.protypeTd}
                                                            docUsr={this.state.responseuserDetail}
                                                            CallSearchApi={this.fetchAndDisplaySearchList}
                                                            toUpdate={this.state.toUpdate}
                                                            addNewProff={this.state.addNewProff}
                                                            handleClose={this.resetProServiceProvider}
                                                            proCategories={this.state.proCategories}
                                                            previouslySavedData={this.state.previouslySavedData}
                                                            activeUser={this.state.selectedUser}
                                                            checkSameProff = {this.state.checkSameProff}
                                                            checkProffsameOrNot = {this.checkProffsameOrNot}
                                                            spouseProCatMap={this.state.spouseProCatMap}
                                                            // disableProfessionalAdd={this.disableProfessionalAdd}
                                                            enableAddAnother={true}
                                                            clickedAddAnother={() => {this.setState({isAddAnotherClicked: true})}}
                                                        /> : this.props.protypeTd == "12" ? 
                                                        <Bookkeeper
                                                            // setBookeeparShow={this.setBookeeparShow}
                                                            // show={this.state.showBookeepar}
                                                            docUsr={this.state.responseuserDetail}
                                                            CallSearchApi={this.fetchAndDisplaySearchList}
                                                            toUpdate={this.state.toUpdate}
                                                            handleClose={this.resetProServiceProvider}
                                                            activeUser={this.state.selectedUser}
                                                            addNewProff={this.state.addNewProff}
                                                            checkSameProff = {this.state.checkSameProff}
                                                            checkProffsameOrNot = {this.checkProffsameOrNot}
                                                        />
                                                        : this.props.protypeTd == "3" ? 
                                                        <Accountant
                                                            // setshowaccoutant={this.setshowaccoutant}
                                                            toUpdate={this.state.toUpdate}
                                                            // show={this.state.showaccoutant}
                                                            docUsr={this.state.responseuserDetail}
                                                            // EidtProfessional={this.state.EidtProfessional}
                                                            CallSearchApi={this.fetchAndDisplaySearchList}
                                                            handleClose={this.resetProServiceProvider}
                                                            activeUser={this.state.selectedUser}
                                                            addNewProff={this.state.addNewProff}
                                                            checkSameProff = {this.state.checkSameProff}
                                                            checkProffsameOrNot = {this.checkProffsameOrNot}
                                                        /> 
                                                        : this.props.protypeTd == "1" ? 
                                                        <FinancialAdvisor
                                                            // setshowadvisor={this.setshowadvisor}
                                                            // show={this.state.showadvisor}
                                                            // key = {this.state.responseuserDetail}
                                                            docUsr={this.state.responseuserDetail}
                                                            // EidtProfessional={this.state.EidtProfessional}
                                                            CallSearchApi={this.fetchAndDisplaySearchList}
                                                            toUpdate={this.state.toUpdate}
                                                            activeUser={this.state.selectedUser}
                                                            handleClose={this.resetProServiceProvider}
                                                            addNewProff={this.state.addNewProff}
                                                            checkSameProff = {this.state.checkSameProff}
                                                            checkProffsameOrNot = {this.checkProffsameOrNot}
                                                            // key={this.state.activeUser}
                                                        /> 
                                                        : this.props.protypeTd == "11" ? 
                                                        <Specialists
                                                            // updatethis={this.props.updatethis}
                                                            UserDetail={this.props.UserDetail}
                                                            docUsr={this.state.responseuserDetail}
                                                            // key={this.state.responseuserDetail}
                                                            // setSpecialist={this.setSpecialist}
                                                            // show={this.state.showSpecialist}
                                                            CallSearchApis={this.fetchAndDisplaySearchList}
                                                            addNewProff = {this.state.addNewProff}
                                                            alreadySpecialist={this.state.alreadySpecialist}
                                                            proCategories={this.state.proCategories}
                                                            CallSearchApi={this.fetchAndDisplaySearchList}
                                                            handleClose={this.resetProServiceProvider}
                                                            activeUser={this.state.selectedUser}
                                                            toUpdate={this.state.toUpdate}
                                                            checkSameProff = {this.state.checkSameProff}
                                                            checkProffsameOrNot = {this.checkProffsameOrNot}
                                                            mapForSpouse = {this.mapForSpouse}
                                                        /> 
                                                        : this.props.protypeTd == "10" ? 
                                                        <Primarycarephysician
                                                            UserDetail={this.props.UserDetail}
                                                            docUsr={this.state.responseuserDetail}
                                                            Fetchprimaryphysician={this.Fetchprimaryphysician}
                                                            hidePhysician={this.handleShow}
                                                            show={this.state.showModal}
                                                            CallSearchApi={this.fetchAndDisplaySearchList}
                                                            handleClose={this.resetProServiceProvider}
                                                            toUpdate={this.state.toUpdate}
                                                        /> 
                                                        : <></>}
                                                    </div>
                                                )}
                                            </Row>
                                            </>) : ""}
                                        </Col>
                                    </Row>
                                    <Row className='listOfData' title={`${demo == true ? '' : 'Coming soon'}`}>
                                        <Col className={`${demo == true ? 'rectangleList' : 'disableAORG'}`}>
                                            <Row onClick={this.openAorg}>
                                            <Col xs={1} title={`${demo == true ? 'Search new professional from Aging Options Resource Guide' : 'Coming soon'}`} style={{textAlign:'end'}} className='closeImg'> <img style={{ height: '25px' }} className='closeImgProfessionalSuggest' src='/icons/GreySearch.svg' alt='Group'  /></Col>

                                                <Col xs={1} className='mx-lg-0' style={{textAlign:'center', fontSize:'25px', margin:'0 15px'}}><span style={{color:'#DCDCDC'}}>|</span></Col>
                                                <Col>
                                                <label>Search professional</label>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Row>
                            </div>)}
                        </div>
                    </Col>
                </Row>
            </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewProServiceProvider);