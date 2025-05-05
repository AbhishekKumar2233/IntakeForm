import React, { Component } from "react";
import Select from "react-select";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, InputGroup, } from "react-bootstrap";
import { $Service_Url } from "./network/UrlPath";
import { $CommonServiceFn } from "./network/Service";
import { SET_LOADER } from "./Store/Actions/action";
import { connect } from "react-redux";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import { globalContext } from "../pages/_app";
import { $AHelper } from "../components/control/AHelper";
import Childdetails from "./childdetails";
import TableEditAndViewForDecease from "./Deceased/TableEditAndViewForDecease";
import AlertToaster from "./control/AlertToaster";
import { getApiCall, getApiCall2,postApiCall} from "./Reusable/ReusableCom";

class FiduciaryAssignmentForm extends Component {
  static contextType = globalContext;
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showFidAssignment: "1",
      fiduciaryAssignmentSelectOptions: [],
      TrusteeSuccessor: [],
      AttorneyFinancesSuccessor: [],
      AttorneyHealthcareSuccessor: [],
      spouseUserId: "",
      loginUserId: sessionStorage.getItem("loggedUserId") || "",
      primarymemberDetails: {},
      legalDocTypeId: 1,
      userId: "",
      primarySRank: "",
      spouseSRank: "",
      primarySuccessorUserId: "",
      primarySuccessorRelationId: "",
      primarySuccessorUserId: "",
      spouseSuccessorUserId: "",
      spouseSuccessorRelationId: "",
      spouseSuccessorUserId: "",
      isDocExecuted: "",
      docName: "",
      docPath: "",
      fidPriList: [],
      fidSpouseList: [],
      duplicateNameoptions: [],
      duplicateNameOptionsforSpose: [],
      optionsData: [],
      userFiduAsgnmntId: 0,
      updateFidAss: false,
      spouseUpdateFidAss: false,
      relationShipUser: [],
      spouseRelationShip: [],
      showEditChildpopup: false,
      EditProfieUserid: "",
      NameOptionsforSpose: [],
      isChecked: false,
      rankvalue: 1,
      spouseValue: 1,
      deletprevdata: false,
      returnAllFidData: [],
      isFiduciary:'',
      disabledbtn:false,
      allJsonsToSubmit:[],
      deleteJson:[],
      sameAsCheckedForHippaState:true
    };
  }

  componentDidMount() {

    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let spouseUserId = sessionStorage.getItem("spouseUserId") || "";
    let loginUserId = sessionStorage.getItem("loggedUserId") || "";
    let primarymemberDetails = JSON.parse(sessionStorage?.getItem("userDetailOfPrimary"));
    this.setState({ userId: newuserid, spouseUserId: spouseUserId, loginUserId: loginUserId, primarymemberDetails: primarymemberDetails });
    this.fetchFiduciaryprimary(spouseUserId)
    this.fetchFiduciaryList(newuserid);
    this.fetchPrimaryFid(newuserid);
    if (spouseUserId !== undefined && spouseUserId !== "null" && spouseUserId !== "") {
      this.fetchSpouseFid(spouseUserId)
    }
    this.fetchSuccessor();
    this.fetchRelationShipList();
    this.props.handleSaveData(() => this.fetchFiduciaryList(newuserid));
    this.getTotalOfFidCheckedList()
    this.props.updateStateButtonStateForHippa()

  }

  componentDidUpdate(prevProp, prevSatte)
  {
    // konsole.log("asjdkjakl", this.state.allJsonsToSubmit)
    if(prevProp?.hippaReleaseSaveButton == false && this.props?.hippaReleaseSaveButton==true){
      this.handleHippaSaveButton() 
    }
    this.getTotalOfFidCheckedList()
  }

  refreshPageApiCollection=()=>{
    this.fetchPrimaryFid(this.state.userId);
    if (this.state?.spouseUserId) {
      this.fetchSpouseFid(this.state.spouseUserId)
    }
    this.fetchSuccessor();
    this.fetchRelationShipList();
   }


  sendData = (val34) => { this.props.onDataReceived(val34) }

  fetchSuccessor = () => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFiduciarySRank, "", (response) => {
      this.props.dispatchloader(true);
      if (response) {
        this.props.dispatchloader(false);
        let sRankObj = response?.data?.data;
        let arrayObj = sRankObj.map((item) => {
          return {
            label: item.desc,
            value: item.value,
          };
        });
        this.setState({
          ...this.state,
          fidSuccessor: arrayObj,
        });
      }
    }
    );
  };
  
  fetchPrimaryFid = async(userId) => {
    this.props.dispatchloader(true);
    userId = userId || this.state.userId;
    const response = await getApiCall("GET", $Service_Url.getFiduciaryAsgnmntData + userId)
    if (response == 'err') return;
        if (response?.fiduciaryAssignments.length == 0) {
          this.sendData(false)
        }
        let checkfirnull = response?.fiduciaryAssignments;
        for (let val1 = 0; val1 < response?.fiduciaryAssignments.length; val1++) {
          if (checkfirnull[val1].fiduAsgnmntTypeId == null) {
            this.sendData(false);
          }
          else {
            this.sendData(true)
          }
        }
        if (response) {
         
          // konsole.log("hiiiiiiiii", response?.fiduciaryAssignments);
          // konsole.log("wrerrererere",response?.fiduciaryAssignments?.filter(
          //   (v, j) => v?.lDocTypeId == this.props?.selectedLegalDocId
          // ))
          if (this.props?.selectedLegalDocId) {
            this.setState({ fidPriList: response?.fiduciaryAssignments?.filter((v, j) => v?.lDocTypeId == this.props?.selectedLegalDocId)});
            this.setState({ duplicateFidPriList: response?.fiduciaryAssignments?.filter((v, j) => v?.lDocTypeId == this.props?.selectedLegalDocId)});
          }
          this.props.dispatchloader(false);
         
        }
        else {
           this.props.dispatchloader(false);
           this.toasterAlert(Msg.ErrorMsg, "Warning");
           konsole.log("errorerror", error);
         }
   };
  
  
  fetchFiduciaryprimary= (userId)=>{
    // konsole.warn("fetchFiduciaryprimary")
    let isFiduciary = getApiCall2('GET',$Service_Url.postMemberRelationship+userId)
    this.props.dispatchloader(true);
    isFiduciary.then((response,error)=>{
      konsole.log(response?.data?.data,'responseresponseresponseresponse')   
      if(response?.data?.data){       
        this.setState({
          isFiduciary:response.data.data.isFiduciary
        })
        this.fetchFiduciaryList(this.state.userId);
        this.props.dispatchloader(false);
      }else{      
        this.fetchFiduciaryList(this.state.userId);
        this.props.dispatchloader(false);
      }
    })
  }


  fetchSpouseFid = async(userId) => {
    // konsole.log("fetchSpouseFid")
    userId = userId || this.state.spouseUserId;
    const response = await getApiCall("GET", $Service_Url.getFiduciaryAsgnmntData + userId)
    if (response == 'err') return;
      this.stopper = false;
      if (response) {
        let responseFetchSpouseFid = response?.fiduciaryAssignments;
        this.setState({ returnAllFidData: responseFetchSpouseFid })
        // konsole.log("fetchSpouseFidsdsdsd",response?.fiduciaryAssignments.filter(
        //   (v, j) => v.lDocTypeId == this.props.selectedLegalDocId
        // ))
        konsole.log("responseFetchSpouseFid", responseFetchSpouseFid);
        if (this.props.selectedLegalDocId) {
          this.setState({fidSpouseList: response?.fiduciaryAssignments.filter((v, j) => v.lDocTypeId == this.props.selectedLegalDocId),});
          this.setState({duplicateFidSpouseList: response?.fiduciaryAssignments.filter((v, j) => v.lDocTypeId == this.props.selectedLegalDocId),});
        }
        this.props.dispatchloader(false);
      }
  };

  handleSucSelect = (event) => {
    this.setState({
      ...this.state,
      sRankId: event.value,
    });
  };

  
  handleCheckBoxChange=(e, index,fiduciary,checkedUserId)=>{
    let event = e?.target;
    let eventId = fiduciary?.sRankId;
    let eventName = event?.name;
    let eventValue = event?.value;
    let eventChecked = event?.checked;
    let valuelabel = fiduciary?.relationWithUser;
    let relationfilter = this.state.optionsData?.filter((items) => items.label == valuelabel);
    if (eventName === "primaryCheckboxList") {
        let updatePrimaryOptions = [...this.state.Nameoptions];
        updatePrimaryOptions[index].checked = eventChecked;
        this.setState({ Nameoptions: updatePrimaryOptions, primarySRank: eventId, primarySuccessorUserId: fiduciary?.value, primarySuccessorRelationId: relationfilter[0]?.value });
    }else{
        let updateSpouseOptions = [...this.state.NameOptionsforSpose];
        updateSpouseOptions[index].checked = eventChecked;
        this.setState({ NameOptionsforSpose: updateSpouseOptions, primarySRank: eventId, primarySuccessorUserId: fiduciary?.value, primarySuccessorRelationId: relationfilter[0]?.value });
    }
}

  filterrelationId=(valuelabels)=>{ // To get srankId from relationshipwithuser
    let valuelabel=valuelabels
    valuelabel=this.state.optionsData?.filter((items) => items.label == valuelabel)
    return valuelabel[0]?.value || 0
  }

    postFidAssign = async (postArray,userName)  => { // post hippa json data
      // konsole.log("postArraysasas",postArray)
      const userId=(userName=="Primary")?this.state?.userId: this.state?.spouseUserId;
      const postArrayjson=postArray?.map((item)=>{
        return {
          userId:userId, 
            fiduciaryAssignments: [
                {
                    userLegalDocId:this.props.selecteduserLegalDocId,
                    fiduAsgnmntTypeId: null,
                    sRankId: item.sRankId ,
                    successorUserId: item.value ,
                    successorRelationId: item?.successorRelationId || this.filterrelationId(item?.relationWithUser),
                    isDocExecuted: "",
                    docName: "",
                    docPath: "",
                    createdBy:this.state?.loginUserId,
                }
            ]
    }; 
      })
        let url =$Service_Url.postFiduciaryAsmgentData 
        this.props.dispatchloader(true);
        const response=await postApiCall('POST',url,postArrayjson);
        this.props.dispatchloader(false);
        if (response == 'err') return;
      
    }

    deleteFidAssign = async (type, data, userid, loggedInUser) => {
      const ques = await this.context.confirm(true, "Are you sure you want to delete this assignment ?", "Confirmation");
      if (ques) {
        $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteFidAssign + "/" + userid + "/" + (type=="primaryCheckboxForHippa"?data:data?.userFiduAsgnmntId) + "/" + loggedInUser, "", (response) => {
          this.props.dispatchloader(true);
          if (response) {
            konsole.log("responseDelete", response)
            if (type == "primary" || type=="primaryCheckboxForHippa") {
              this.fetchPrimaryFid(userid);
            } else if (type == "Spouse") {
              this.fetchSpouseFid(userid)
            }
            this.props.dispatchloader(false);
          }
        });
      }
    }

    deleteFidForHippa=async(deleteArray,userName)=>{
        let deleteJson=[...deleteArray]
        // konsole.log("deleteFidForHippadeleteJson",deleteJson)
        const userId=(userName=="Primary")?this.state.userId: this.state.spouseUserId
              this.props.dispatchloader(true);
              deleteJson?.forEach((val) => {
                // konsole.log("valll",val)
                var fiduAsgnmntTypeIdvalue = val?.userFiduAsgnmntId;
                if(fiduAsgnmntTypeIdvalue!=null){
                      $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteFidAssign + "/" + userId + "/" +fiduAsgnmntTypeIdvalue + "/" + this.state.loginUserId, "", (response) => {
                      if (response) {
                        konsole.log("responseDelete", response)
                      }
                      else{
                          this.props.dispatchloader(false);
                          this.toasterAlert(Msg.ErrorMsg, "Warning");
                          konsole.log("errorerror", error);
                      }             
                    })
                  }
              })
              this.props.dispatchloader(false);
            }

    handleHippaSaveButton=async()=>{

      const Nameoptions=this.state?.Nameoptions
      const NameOptionsforSpose =this.state?.NameOptionsforSpose
      const duplicateNameoptions=this.state?.duplicateNameoptions|| []
      const duplicateNameOptionsforSpose =this.state?.duplicateNameOptionsforSpose|| []
      const primarytrueFromOldList=duplicateNameoptions.filter((item)=>item?.checked==true)
      const spousetrueFromOldList=duplicateNameOptionsforSpose.filter((item)=>item?.checked==true)
      const primarytrueFromNewList=Nameoptions.filter((item)=>item?.checked==true)
      const spousetrueFromNewList=NameOptionsforSpose.filter((item)=>item?.checked==true)
      const combinedTrueListForNewPost= [...(primarytrueFromNewList || []),...(spousetrueFromNewList || [])];
      let checkForAnyDataCheckedForPrimary=(this.state?.Nameoptions?.every((data)=>{ return data?.checked==false }))
      let checkForAnyDataCheckedForSpouse=(this.state?.NameOptionsforSpose?.every((data)=>{ return data?.checked==false }))
      const listData = [...(this.state?.fidSpouseList || []),...(this.state?.fidPriList || [])];
      const hippaOnlySelectedList=listData.map((value)=>value?.lDocTypeId==13);
      konsole.log("hippaOnlySelectedList",hippaOnlySelectedList,listData,checkForAnyDataCheckedForPrimary,checkForAnyDataCheckedForSpouse)
      if((checkForAnyDataCheckedForPrimary==true && checkForAnyDataCheckedForSpouse==true && listData.length==0)){// All false
        this.toasterAlert("Check atleast any one checkbox of primary or spouse", "Warning");
        this.props.updateStateButtonStateForHippa()
        return;
      } 
      await this.deleteFidForHippa(primarytrueFromOldList,"Primary")
      await this.deleteFidForHippa(spousetrueFromOldList,"Spouse")
      await this.postFidAssign(primarytrueFromNewList,"Primary")
      await this.postFidAssign(spousetrueFromNewList,"Spouse")
      this.props.updateStateButtonStateForHippa()
      if(hippaOnlySelectedList.length>0){
        AlertToaster.success("Data updated successfully");  
      this.props.close()
      }else{
        AlertToaster.success("Data Saved Successfully")
        this.props.close()
      } 
      // konsole.log("primarytrueFromNewList",primarytrueFromNewList,"spousetrueFromNewList",spousetrueFromNewList)
      // konsole.log("primarytrueFromOldList",primarytrueFromOldList,"spousetrueFromOldList",spousetrueFromOldList,"combinedTrueListForNewPost",combinedTrueListForNewPost)
      // konsole.log("primarytrueFromNewList",primarytrueFromNewList,"spousetrueFromNewList",spousetrueFromNewList)
    }

  handleFidSubmit = (checkedUserId, primaryspousetype) => {
    
    let method;
    let postDataObj;

    if (primaryspousetype == "primary") {
      if (this.state.fidPriList.length == 6) {
        this.toasterAlert("You have reached the maximum number of agents/Executor/Personal Representative/Trustee and cannot add more.", "Warning");
        return;
      }
      if (this.state.primarySRank == "") {
        this.toasterAlert("Please choose primary successor type", "Warning");
        return;
      }
      if (this.state.primarySuccessorUserId == "") {
        this.toasterAlert("Please choose primary successor", "Warning");
        return;
      }
      if (this.state.primarySuccessorRelationId == "") {
        this.toasterAlert("Please choose successor relation", "Warning");
        return;
      }

      if (this.state.updateFidAss == true) {
        method = "PUT";
        konsole.log("putputput");
        if (this.props.selecteduserLegalDocId > 4) {
          postDataObj = {
            userId: checkedUserId,
            fiduciaryAssignments: [{
              userLegalDocId: this.props.selecteduserLegalDocId,
              fiduAsgnmntTypeId: null,
              sRankId: this.state?.primarySRank,
              successorUserId: this.state?.primarySuccessorUserId,
              successorRelationId: this.state?.primarySuccessorRelationId || 0,
              isDocExecuted: this.state?.isDocExecuted,
              docName: this.state?.docName,
              docPath: this.state?.docPath,
              userFiduAsgnmntId: this.state?.userFiduAsgnmntId,
              updatedBy: this.state.loginUserId,
            },],
          };

        }
        else {
          postDataObj = {
            userId: checkedUserId,
            fiduciaryAssignments: [{
              fiduAsgnmntTypeId: this.props?.selecteduserLegalDocId,
              sRankId: this.state?.primarySRank,
              successorUserId: this.state?.primarySuccessorUserId,
              successorRelationId: this.state?.primarySuccessorRelationId || 0,
              isDocExecuted: this.state?.isDocExecuted,
              docName: this.state?.docName,
              docPath: this.state?.docPath,
              userFiduAsgnmntId: this.state?.userFiduAsgnmntId,
              updatedBy: this.state.loginUserId,
            },],
          };
        }

      }
      else {
        method = "POST";
        if (this.props.selecteduserLegalDocId > 4) {
          postDataObj = [{
            userId: checkedUserId,
            fiduciaryAssignments: [
              {
                userLegalDocId: this.props.selecteduserLegalDocId,
                fiduAsgnmntTypeId: null,
                sRankId: this.state?.primarySRank,
                successorUserId: this.state?.primarySuccessorUserId,
                successorRelationId: this.state?.primarySuccessorRelationId || 0,
                isDocExecuted: this.state?.isDocExecuted,
                createdBy: this.state?.loginUserId,
                docName: this.state?.docName,
                docPath: this.state?.docPath,
              },
            ],
          },];
        }
        else {
          postDataObj = [{
            userId: checkedUserId,
            fiduciaryAssignments: [
              {
                fiduAsgnmntTypeId: this.props?.selecteduserLegalDocId,
                sRankId: this.state?.primarySRank,
                successorUserId: this.state?.primarySuccessorUserId,
                successorRelationId: this.state?.primarySuccessorRelationId || 0,
                isDocExecuted: this.state?.isDocExecuted,
                createdBy: this.state?.loginUserId,
                docName: this.state?.docName,
                docPath: this.state?.docPath,
              },
            ],
          },];
        }

      }


    }
    else {
      konsole.log(this.state.spouseSRank,"this.state.spouseSRank")
      if (primaryspousetype == "Spouse") {
        konsole.log(this.state.fidSpouseList, "this.state.fidSpouseList")

        if (this.state.fidSpouseList.length == 6) {
          this.toasterAlert("You have reached the maximum number of agents/Executor/Personal Representative/Trustee and cannot add more.", "Warning");
          return;
        }
        if (this.state.spouseSRank == "") {
          this.toasterAlert("Please choose spouse successor type", "Warning");
          return;
        }
        if (this.state.spouseSuccessorUserId == "") {
          this.toasterAlert("Please choose spouse successor", "Warning");
          return;
        }
        if (this.state.spouseSuccessorRelationId == "") {
          this.toasterAlert("Please choose successor relation", "Warning");
          return;
        }
      }

      if (this.state.spouseUpdateFidAss == true) {

        method = "PUT";
        if (this.props.selecteduserLegalDocId > 4) {
          postDataObj = {
            userId: this.state.spouseUserId,
            fiduciaryAssignments: [
              {
                userLegalDocId: this.props.selecteduserLegalDocId,
                fiduAsgnmntTypeId: this.props?.fiduAsgnmntTypeId,
                sRankId: this.state?.spouseSRank,
                successorUserId: this.state?.spouseSuccessorUserId,
                successorRelationId: this.state?.spouseSuccessorRelationId || 0,
                isDocExecuted: this.state?.isDocExecuted,
                docName: this.state?.docName,
                docPath: this.state?.docPath,
                userFiduAsgnmntId: this.state?.userFiduAsgnmntId,
                updatedBy: this.state.loginUserId,
              },
            ],
          };
        }
        else {
          postDataObj = {
            userId: this.state.spouseUserId,
            fiduciaryAssignments: [
              {
                fiduAsgnmntTypeId: this.props?.selecteduserLegalDocId,
                sRankId: this.state?.spouseSRank,
                successorUserId: this.state?.spouseSuccessorUserId,
                successorRelationId: this.state?.spouseSuccessorRelationId || 0,
                isDocExecuted: this.state?.isDocExecuted,
                docName: this.state?.docName,
                docPath: this.state?.docPath,
                userFiduAsgnmntId: this.state?.userFiduAsgnmntId,
                updatedBy: this.state.loginUserId,
              },
            ],
          };
        }
      }
      else {

        if (primaryspousetype == true) {

          let fiduciaryAssignments = [];
          const findPrimary = this.state.NameOptionsforSpose.find((item) => item.relationWithUser === "Spouse");
          konsole.log("findPrimary", this.state.NameOptionsforSpose, this.state.Nameoptions, this.state.fidPriList)
          const postSpouseFidJson = JSON.parse(JSON.stringify(this.state.fidPriList));
          for (let i = 0; i < postSpouseFidJson?.length; i++) {
            const element = postSpouseFidJson[i];
            if (element.relationshipWithUser === "Spouse") {
              element.succesorName = findPrimary.label;
              element.successorUserId = findPrimary.value;
            }
            const relationwithSpouseIndex = this.state.Nameoptions.findIndex((d) => (d.value == element.successorUserId && d.relationWithSpouse !== null));

            if (relationwithSpouseIndex >= 0) {
              let relationfilter = this.state.optionsData?.filter((items) => items.label == this.state.Nameoptions[relationwithSpouseIndex].relationWithSpouse);
              konsole.log("elemensdfgdghgftelement", relationwithSpouseIndex, relationfilter);
              if (relationfilter.length > 0) {
                element.successorRelationId = Number(relationfilter[0].value);
                element.relationshipWithUser = relationfilter[0].label;
              }
            }
            fiduciaryAssignments.push(element);
          }
          konsole.log("elementelement", fiduciaryAssignments);
          method = "POST"
          postDataObj = [{ userId: checkedUserId, fiduciaryAssignments: fiduciaryAssignments, },];
          konsole.log("postDataObjpostDataObj", postDataObj, this.state.NameOptionsforSpose);



        }
        else {
          method = "POST";
          if (this.props.selecteduserLegalDocId > 4) {
            postDataObj = [
              {
                userId: checkedUserId,
                fiduciaryAssignments: [
                  {
                    userLegalDocId: this.props.selecteduserLegalDocId,
                    fiduAsgnmntTypeId: null,
                    sRankId: this.state?.spouseSRank,
                    successorUserId: this.state?.spouseSuccessorUserId,
                    successorRelationId: this.state?.spouseSuccessorRelationId || 0,
                    isDocExecuted: this.state?.isDocExecuted,
                    docName: this.state?.docName,
                    docPath: this.state?.docPath,
                    createdBy: this.state?.loginUserId,
                  },
                ],
              },
            ];
          }
          else {
            postDataObj = [
              {
                userId: checkedUserId,
                fiduciaryAssignments: [
                  {
                    userLegalDocId: null,
                    fiduAsgnmntTypeId: this.props?.selecteduserLegalDocId,
                    sRankId: this.state?.spouseSRank,
                    successorUserId: this.state?.spouseSuccessorUserId,
                    successorRelationId:
                      this.state?.spouseSuccessorRelationId || 0,
                    isDocExecuted: this.state?.isDocExecuted,
                    docName: this.state?.docName,
                    docPath: this.state?.docPath,
                    createdBy: this.state?.loginUserId,
                  },
                ],
              },
            ];
          }
        }
      }
    }

    if (postDataObj !== undefined) {
      
      konsole.log("postDatcxcaObjpostDataObrerej", postDataObj)
      let rankId = 1
      let url = method == "POST" ? $Service_Url.postFiduciaryAsmgentData : $Service_Url.putFiduciaryAsmgentData;
      this.props.dispatchloader(true);
      this.setState({
        disabledbtn:true
      })
      $CommonServiceFn.InvokeCommonApi(
        method,
        url,
        postDataObj,
        (response, error) => {
          this.props.dispatchloader(false);
          konsole.log("Success res Postdata at Fid" + JSON.stringify(response));
          if (response) {
            this.fetchPrimaryFid(this.state.userId);
            if (this.state.spouseUserId != undefined && this.state.spouseUserId != "null" && this.state.spouseUserId != "") {
              this.fetchSpouseFid(this.state.spouseUserId);
            }
            this.setState({ updateFidAss: false, spouseUpdateFidAss: false });
          }
          else {
            this.toasterAlert(Msg.ErrorMsg, "Warning");
            konsole.log("errorerror", error);
          }
          this.handleClear();
          konsole.log(postDataObj?.fiduciaryAssignments,this.state.updateFidAss,response?.data?.data,"response?.data?.data[0]response?.data?.data")
          let sortList = this.state.updateFidAss == true ?  response?.data?.data?.fiduciaryAssignments?.sort((a,b)=>{return a.sRankId - b.sRankId}) : response?.data?.data[0]?.fiduciaryAssignments?.filter((v, j) => v?.userLegalDocId == this.props?.selecteduserLegalDocId).sort((a,b)=>{return b.sRankId - a.sRankId})
          let rankIds = sortList[0]?.sRankId
          if (primaryspousetype == "Spouse") {
            this.setState({
              spouseSRank:this.state.fidSuccessor[rankIds].value
            })
          }else{
            konsole.log(rankIds,sortList,"rankIdsrankIdsrankIdsrankIds")
            this.setState({
              primarySRank:parseInt(this.state.fidSuccessor[rankIds].value)
            })
          }
          this.setState({
            disabledbtn:false
          })
        }
      );
    }
  };

  updateFidAssignments = (priList, updatetype) => {
    let valuelabel = priList?.relationshipWithUser;
    let relationfilter = this.state.optionsData?.filter(
      (items) => items.label == valuelabel
    );
    if (updatetype == "primary") {
      this.setState({
        updateFidAss: true,
        userLegalDocId: this.props.selecteduserLegalDocId,
        userFiduAsgnmntId: priList?.userFiduAsgnmntId,
        primarySuccessorUserId: priList?.successorUserId,
        primarySuccessorRelationId: priList?.successorRelationId,
        primarySRank: priList?.sRankId,
        succesorName: priList?.succesorName,
        // relationshipWithUser : priList?.relationshipWithUser,
        primarySuccessorRelationId: relationfilter[0]?.value,
        relationShipUser: relationfilter,
      });
    }
    else {
      this.setState({
        spouseUpdateFidAss: true,
        userFiduAsgnmntId: priList?.userFiduAsgnmntId,
        spouseSRank: priList?.sRankId,
        spouseSuccessorUserId: priList?.successorUserId,
        spouseSuccessorRelationId: priList?.successorRelationId,
        succesorName: priList?.succesorName,
        relationshipWithUser: priList?.relationshipWithUser,
        spouseSuccessorRelationId: relationfilter[0]?.value,
        spouseRelationShip: relationfilter,
      });
    }
  };


  
  fetchFiduciaryList = (newuserid) => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFiduciaryforAssigment + newuserid, "", (response,error) => {
      this.props.dispatchloader(false);
      if (response) {
        let responseArray = []
        konsole.log('getFiduciaryforAssigmentgetFiduciaryforAssigment', response)
        const responseData = $AHelper.deceasedNIncapacititedFilterFun(response?.data?.data)
        let obj = {
          label: `${this.state.primarymemberDetails.memberName}`,
          relationWithUser: "Spouse",
          value: newuserid,
          relationWithSpouse: null
        }

        let respnsePrimaryList = responseData?.map((d) => { return { ...d, label: `${d.label}, ${d.relationWithUser}`} })
        responseArray = responseData?.filter((items) => items.value !== this.state.spouseUserId)
        if(this.state.isFiduciary==true){
          responseArray.push(obj)
          }
        let respnseSpouseList = responseArray?.map((d) => {
          let relationwithSpouse = d.relationWithSpouse !== null ? d.relationWithSpouse : d.relationWithUser
          return {...d,label: `${d.label + ',' + relationwithSpouse}`,relationWithSpouse: relationwithSpouse,relationWithUser: d.relationWithUser !== null ? d.relationWithUser : d.relationWithSpouse};
        });

        // konsole.log("respnsePrimaryListrespnsePrimaryList",respnsePrimaryList,this.state.fidPriList)

        if(this.props?.selectedLegalDocId == 13){
          respnsePrimaryList = respnsePrimaryList?.map((value1) => {
            let gettruth = this.state.fidPriList?.find((value2) => {
                // konsole.log("daaaaaaaaa", value2 , value1.value)
                return value2.successorUserId == value1.value;
            });
            // konsole.log("value1value1",value1)

            if (gettruth !== undefined) {
              return {...value1, checked: true,userFiduAsgnmntId:gettruth.userFiduAsgnmntId};
            } else {
                return {...value1, checked: false};
            }
           });
       
          respnseSpouseList = respnseSpouseList?.map((value1) => {
            let gettruth = this.state.fidSpouseList?.find((value2) => {
                // konsole.log("daaaaaaaaa", value2 , value1.value)
                return value2.successorUserId == value1.value;
            });
            // konsole.log("gettruthrelationWithUser",value1.relationWithUser)
            if (gettruth !== undefined) {
              return {...value1, checked: true,userFiduAsgnmntId:gettruth?.userFiduAsgnmntId};
            } else {
                return {...value1, checked: false, };
            }
           });
        }
        const deepClone = (data) => JSON.parse(JSON.stringify(data));

       
        this.setState({
          ...this.state,
          Nameoptions:respnsePrimaryList,
          duplicateNameoptions:deepClone(respnsePrimaryList),
          NameOptionsforSpose:respnseSpouseList,
          duplicateNameOptionsforSpose:deepClone(respnseSpouseList),
        });
        // konsole.log("Nameoptions ,NameOptionsforSpose", this.state.Nameoptions, this.state.NameOptionsforSpose)
        this.props.dispatchloader(false);
      }
      else
      {
           this.props.dispatchloader(false);
           this.toasterAlert(Msg.ErrorMsg, "Warning");
           konsole.log("errorerror", error);
      }
      
    })
  }

  fetchRelationShipList = () => {
    // konsole.log("fetchRelationShipList")
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getRelationshiplist,
      this.state,
      (response, err) => {    
        if (response) {
          konsole.log("responserealt", response?.data?.data);
          const optionsFilteredData = response?.data?.data;
          const filteredData = optionsFilteredData.splice(3, 1);
          konsole.log("relationAPI1", optionsFilteredData, this.state.userId);
          this.setState({
            ...this.state,
            optionsData: optionsFilteredData,
          });
          this.props.dispatchloader(false);
        }
        else
        {
             this.props.dispatchloader(false);
             this.toasterAlert(Msg.ErrorMsg, "Warning");
             konsole.log("errorerror", err);
        }
      }
    );
  };

  handleClear = () => {
    this.setState({
      primarySRank: "",
      spouseSRank: "",
      primarySuccessorUserId: "",
      primarySuccessorRelationId: "",
      primarySuccessorUserId: "",
      spouseSuccessorUserId: "",
      spouseSuccessorRelationId: "",
      spouseSuccessorUserId: "",
      relationShipUser: [],
      spouseRelationShip: [],
      disabledbtn:false,
      allJsonsToSubmit:[],
      deleteJson:[] 
    });
  };

  toasterAlert(text, type) {
    this.context.setdata({ open: true, text: text, type: type });
  }

  onChangeName = (e) => {
    konsole.log("onChangeName", e)
    let valuelabel = e?.relationWithUser;
    let relationfilter = this.state.optionsData?.filter(
      (items) => items.label == valuelabel
    );
    this.setState({
      relationShipUser: relationfilter,
      primarySuccessorUserId: e.value,
      primarySuccessorRelationId: relationfilter[0]?.value,
    });
  };

  onChangeNameSuccessor = (event) => {
    let valueselect = event.value;
    // konsole.log("eventvalue", valueselect);
    this.setState({ primarySRank: valueselect });
    let filterarrayforspouse = this.state.Nameoptions.filter(
      (items) => items.relationWithUser == "Spouse"
    );
    let relationfilter = this.state.optionsData?.filter(
      (items) => items.label == "Spouse"
    );
  };
  customStyles = {
    control: (styles) => {
      return {
        ...styles,
        backgroundColor: "white",
      };
    },
  };

  onChangeSpouseNameSuccessor = (event) => {
    konsole.log("onChangeSpouseNameSuccessor", event);
    let valueselect = event.value;
    this.setState({ spouseSRank: valueselect });
    let filterarrayforspouse = this.state.NameOptionsforSpose.filter(
      (items) => items.relationWithUser == "Spouse"
    );
    let relationfilter = this.state.optionsData?.filter(
      (items) => items.label == "Spouse"
    );
    konsole.log("filterarrayforspouse", filterarrayforspouse);
    // if (valueselect == 1) {
    //   this.setState({
    //     spouseSuccessorUserId: filterarrayforspouse[0].value,
    //     spouseRelationShip: relationfilter,
    //     spouseSuccessorRelationId: relationfilter[0]?.value,
    //   });
    // } else {
    //   this.setState({
    //     spouseSuccessorUserId: "",
    //     spouseRelationShip: [],
    //     spouseSuccessorRelationId: "",
    //   });
    // }
  };
  onChangeSpouseName = (e) => {
    konsole.log("spouseSuccessorUserId", e);
    let valuelabel = e?.relationWithSpouse;
    let relationfilter = this.state.optionsData?.filter((items) => items.label == valuelabel);
    // konsole.log("relationfilter",relationfilter,this.state.optionsData,valuelabel)
    this.setState({
      spouseSuccessorUserId: e.value,
      spouseRelationShip: relationfilter,
      spouseSuccessorRelationId: relationfilter[0]?.value,
    });
  };

  handleEditChildPopupClose = () => {
    this.setState({ showEditChildpopup: !this.state.showEditChildpopup });
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    this.fetchFiduciaryList(newuserid);
  };
  InvokeChildDetails = (userid, edittype) => {
    this.setState({
      showEditChildpopup: !this.state.showEditChildpopup,
      EditProfieUserid: userid + "|" + edittype,
    });
  };

  stopper = false;
  handleCheckBox = (e) => {
    if(this.stopper) return;
    this.stopper = true;
    let loggedInUserId = sessionStorage.getItem("loggedUserId") || "";
    let checked = e.target.checked;
    let userId = userId || this.state.spouseUserId;
    this.props.dispatchloader(true);
    let SpuseList = this.state.fidSpouseList;//only spouse data in array
    konsole.log(this.state.fidPriList,this.state.fidPriList.some((e)=> {return e.successorUserId == this.state.spouseUserId}),this.state.isFiduciary,"this.state.fidPriList")
    if(this.state.fidPriList.some((e)=> {return e.successorUserId == this.state.spouseUserId})){

      if(this.state.isFiduciary === false){
        this.toasterAlert("Primary member is not Fiduciary.", "Warning");
      }
    }
    let arrayuserFiduAsgnmntId = []; //to set userFiduAsgnmntId of spouse there for delete api
    for (let i = 0; i < SpuseList.length; i++) {
      konsole.log("usssdsdsd", SpuseList[i].userFiduAsgnmntId)
      arrayuserFiduAsgnmntId?.push(SpuseList[i]?.userFiduAsgnmntId)
    }
    this.startDeletApi(arrayuserFiduAsgnmntId, checked, loggedInUserId, userId)// a function to send id of spouse to delete 
  };


  handleCheckBoxForHippa = (e) => {
   
    let sameAschecked = e.target.checked;
    // console.log("nnnnnnnnnnnnnn",this.state.Nameoptions,this.state.NameOptionsforSpose)
    const checkForAllPrimaryEmpty=this.state?.Nameoptions?.every((value)=>value?.checked==false)
    if(checkForAllPrimaryEmpty==true)return
          let updatedNameOptions = this.state.NameOptionsforSpose.map((value1) => {
            const gettruth= this.state?.Nameoptions && this.state.Nameoptions?.find((value2) => {
                // konsole.log("tytyghaaaaaa", value2?.value==value1?.value , value2?.value==this.state.spouseUserId)
                return(value1?.value==value2?.value  )       
            });
            // konsole.log("gettruthgettruth",gettruth)
            if (gettruth !== undefined) {
                return {...value1, checked: 
                  (sameAschecked==true)? gettruth?.checked:false};
            } else {
                return {...value1, checked:(sameAschecked==true)?false:gettruth?.checked};
            }
           });
           const isSpouseChecked=this.state.Nameoptions.find((item)=>item.value==this.state.spouseUserId)?.checked;
           if(sameAschecked==true)
            {
               updatedNameOptions=updatedNameOptions.map((item)=>{
                return {...item, checked:(item.value==this.state.userId)
                  ?isSpouseChecked:item.checked}
              })
            }

          //  console.log("isSpouseChecked",isSpouseChecked);
           konsole.log("updatedNameOptions",updatedNameOptions)
           this.setState({...this.setState,NameOptionsforSpose:updatedNameOptions})
    }


 


  startDeletApi = async (arrayuserFiduAsgnmntId, checked, loggedInUserId, userId) => {
    try {
      for (const userFiduAsgnmntId of arrayuserFiduAsgnmntId) {
        const response =  $CommonServiceFn.InvokeCommonApi(
        // $CommonServiceFn.InvokeCommonApi(
          "DELETE",
          `${$Service_Url.deleteFidAssign}/${userId}/${userFiduAsgnmntId}/${loggedInUserId}`,
          "",
          () => this.fetchSpouseFid(this.state.spouseUserId)
        );
        // konsole.log("responseDelete", response);
      }

      this.props.dispatchloader(false);
      this.setState({ isChecked: checked });
      konsole.log("checkedccdlicke", this.state.fidPriList, checked);
      if (checked && this.state.fidPriList.length > 0) {
        konsole.log("checkedclick", this.state.fidPriList.length, checked);
        await this.handleFidSubmit(this.state.spouseUserId, checked);
      // } else if(arrayuserFiduAsgnmntId?.length) {
      //   this.fetchSpouseFid(this.state.spouseUserId);
      }
    } catch (error) {
      konsole.log("Error deleting data:", error);
    }
  };



  CustomMenu = ({ innerRef, innerProps, isDisabled, children }) =>

    !isDisabled ? (
      <div className="customReactSelectMenu" style={{ overflowY: "auto", minhHeight: "13vh", boxShadow: "2px 2px 9px grey" }} ref={innerRef} {...innerProps}>
        {konsole.log("childrenchildren", children)}
        {children}
        <div className="d-flex justify-content-end">
          <button
            className="theme-btn me-2 mb-2"
            onClick={() => { this.setState({ rankvalue: this.state.rankvalue + 1 }); }}
            style={{ fontSize: "12px", height: "40%", width: "40%" }}
          >
            Add New
          </button>
        </div>
      </div>
    ) : null;

  CustomSuccessorMenu = ({ innerRef, innerProps, isDisabled, children }) =>

    !isDisabled ? (
      <div className="customReactSelectMenu" style={{ overflowY: "auto", minhHeight: "13vh", boxShadow: "2px 2px 9px grey" }} ref={innerRef} {...innerProps}>
        {konsole.log("childrenchildren", children)}
        {children}
        <div className="d-flex justify-content-end">
          <button
            className="theme-btn me-2 mb-2"
            onClick={() => this.setState({ spouseValue: this.state.spouseValue + 1 })}
            style={{ fontSize: "12px", height: "40%", width: "40%" }}
          >
            Add New
          </button>
        </div>
      </div>
    ) : null;


  getCheckOnSameRanks(array1, array2) {

    konsole.log("sameRankssameRanks1", array1, array2)
    if (array1.length !== array2.length) {
      return [];
    }

    konsole.log("sameRankssameRanks1", array1, array2)
    return array1.filter(object1 => {
      return array2.some(object2 => {
        if (object1.relationshipWithUser == 'Spouse' && object2.relationshipWithUser == 'Spouse') {
          konsole.log('sameRankssameRankss', object1.sRankId, object2.sRankId, object1.successorUserId, this.state.spouseUserId, object2.successorUserId, this.state.userId)
          return (
            object1.sRankId == object2.sRankId
          )
        }
        else {
          konsole.log("seconds consition")
          return (object1.sRankId == object2.sRankId && object1.successorUserId == object2.successorUserId)
        }
      }
      );
    });

  }

  getDifference = (array1, array2) => {
    return array2?.filter((object1) => {
      return !array1?.some((object2) => {
        return object1?.label === object2?.succesorRank;
      });
    });
  };
  getDifference2 = (array1, array2) => {
    return array2?.filter((object1) => {
      return !array1?.some((object2) => {
        return object1?.label === object2?.succesorRank;
      });
    });
  };

  getDifference3 = (array1, array2) => {
    // 2=successorUserId
    return array2?.filter(object1 => {
      return !array1?.some(object2 => {
        return object1?.value == object2?.successorUserId
          ;
      });
    });
  }

  getDifference4 = (array1, array2) => {
    konsole.log("arra111", array1, array2)
    return array2?.filter((object1) => {
      return !array1?.some((object2) => {
        konsole.log("object1", object1, "object1", object2)
        return object1?.value === object2?.successorUserId;
      });
    });
  };

  deleteFidAssign = async (type, data, userid, loggedInUser) => {
    this.handleClear();
    if(type=='primary'){
      this.setState({updateFidAss:false})
    }else{
      this.setState({spouseUpdateFidAss:false})
    }
    const ques = await this.context.confirm(true, "Are you sure you want to delete this assignment ?", "Confirmation");

    if (ques) {
      konsole.log("datata323", data.userFiduAsgnmntId)
      this.props.dispatchloader(true);
      konsole.log("data.userFiduAsgnmntId", data.userFiduAsgnmntId)
      konsole.log("jsonDelete", userid + "-------------" + data.userFiduAsgnmntId + "-----------" + loggedInUser)
      $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteFidAssign + "/" + userid + "/" + data?.userFiduAsgnmntId + "/" + loggedInUser, "", (response) => {
        this.props.dispatchloader(false);
        if (response) {
          konsole.log("responseDelete", response)
          if (type == "primary") {
            this.fetchPrimaryFid(userid)
          } else if (type == "Spouse") {
            this.fetchSpouseFid(userid)
          }
        }
      });
    }
  }

  showWarningOfNoFid = (length) => {
    // konsole.log("length121", length)
    if (length == undefined || length == null || length == "" || length == 0) {
      this.toasterAlert("Maximum number of fiduciary exceeded you can not add more please contact your legal team.", "Warning");
    }
  }

  checkForSameCheckedSuccessorUserIds = () => {
    const { Nameoptions, NameOptionsforSpose, spouseUserId, userId } = this.state;
    if (Nameoptions && NameOptionsforSpose) {
        const checkedIds1 = Nameoptions?.filter(item => item?.checked).map(item => item?.value);
        const checkedIds2 = NameOptionsforSpose?.filter(item => item?.checked).map(item => item?.value);
        if(checkedIds1?.length==0 && checkedIds2?.length==0)
          {
            return false
          }
        // konsole.log("checkedIds1", checkedIds1, "checkedIds2", checkedIds2);
        const set1 = new Set(checkedIds1);
        const set2 = new Set(checkedIds2);

        if (set1.size !== set2.size) {
            return false;
          }
       
        if (checkedIds1.includes(spouseUserId) && checkedIds2.includes(userId)) {
            const list1WithoutSpouseuserId=checkedIds1?.filter((value)=>value!=this.state.spouseUserId)
            const list1WithoutPrimary=checkedIds2?.filter((value)=>value!=this.state.userId)
                return list1WithoutSpouseuserId?.every(item => list1WithoutPrimary?.includes(item));
            
        }
        for (let id of set1) {
            if (!set2.has(id)) {
                return false;
            }
        }
        return true;
    }
    return false;
  };

  getTotalOfFidCheckedList=()=>{
    const listData = [...(this.state?.fidSpouseList || []),...(this.state?.fidPriList || [])];
    // konsole.log("getTotalOfFidCheckedListlistData",listData)
    this.props?.funToGetListOfSelectedHippaReleaseChecked(listData)
    // konsole.log("listData",listData,this.state?.fidSpouseList,this.state?.fidPriList)
  }


  render() {
    // konsole.log("NameoptionsNameoptions", this.state.Nameoptions,this.state.NameOptionsforSpose)
    // konsole.log("props", this.props,this.state)
    // konsole.log("selectedLegalDocId",this.props.selectedLegalDocId)
    // konsole.log("checkForSameCheckedSuccessorUserIds",this.checkForSameCheckedSuccessorUserIds())
    // konsole.log("abbbbbbbbbbbbbbbSpouse", this.state?.NameOptionsforSpose);
    // konsole.log("dataawawa", this.state.fidSpouseList[0]?.succesorRank);
    // konsole.log('fidSpouseListfidSpouseList', this.state.fidSpouseList)
    // konsole.log('fidPriListfidPriList', this.state.fidPriList)
    // konsole.log("deletjson",this.state.deleteJson)
    // konsole.log(" fidPriListewewewewe ",this.state.fidPriList ,"fidSpouseListrerer",this.state.fidSpouseList,"renderdeleteJson",this.state.deleteJson,"allJsonsToSubmit",this.state.allJsonsToSubmit)
    // konsole.log("selecteduserLegalDocId",this.props.selecteduserLegalDocId,this.state.selectedLegalDocId)
    // konsole.log("psrank",this.state.primarySRank)
    // konsole.log("allJsonsToSubmit",this.state.allJsonsToSubmit)
    // konsole.log("renderdeleteJsononlyyyyy",this.state.deleteJson,"allJsonsToSubmit",this.state.allJsonsToSubmit)
    // konsole.log("thn",this.props.hippaReleaseSaveButton,"deleteJson",this.state.deleteJson,"allstatejson",this.state.allJsonsToSubmit,"fidprilist",this.state.fidPriList)

    let primarySRank = {};
    let succesorName = {};
    let relationshipWithUser = {};
    let spouseSRank = {};
    let succesorSpouseName = {};
    let spouseSuccessorRelation = {};
    let primarySuccessorRank = {};
    let spouseSuccessorRank = {};
    let primaryRank = {}
    let spouseRank = {}
    let sameRanks = {}

    primarySRank =
      this.state.primarySRank !== ""
        ? this.state.fidSuccessor[this.state.primarySRank - 1]
        : "";

    succesorName =
      this.state.primarySuccessorUserId !== ""
        ? this.state.Nameoptions?.filter(
          (v) => v.value == this.state.primarySuccessorUserId
        )
        : "";

    konsole.log(
      "succesorNamesuccesorName",
      succesorName,
      this.state.primarySuccessorUserId
    );


    relationshipWithUser =
      this.state.primarySuccessorRelationId !== "" &&
        this.state.primarySuccessorRelationId !== undefined
        ? this.state.optionsData?.filter(
          (v) => v.value == this.state.primarySuccessorRelationId
        )
        : "";

    spouseSRank =
      this.state.spouseSRank !== ""
        ? this.state.fidSuccessor[this.state.spouseSRank - 1]
        : "";

    succesorSpouseName =
      this.state.spouseSuccessorUserId !== ""
        ? this.state.NameOptionsforSpose?.filter(
          (v) => v.value == this.state.spouseSuccessorUserId
        )
        : "";

    spouseSuccessorRelation =
      this.state.spouseSuccessorRelationId !== "" &&
        this.state.spouseSuccessorRelationId !== undefined
        ? this.state.optionsData?.filter(
          (v) => v.value == this.state.spouseSuccessorRelationId
        )
        : "";

    primarySuccessorRank =
      this.state?.fidPriList?.length > 0
        ? this.getDifference(this.state?.fidPriList, this.state?.fidSuccessor)
        : this.state?.fidSuccessor;
    spouseSuccessorRank =
      this.state?.fidSpouseList?.length > 0
        ? this.getDifference2(
          this.state?.fidSpouseList,
          this.state?.fidSuccessor
        )
        : this.state?.fidSuccessor;

    if (primarySuccessorRank !== undefined && primarySuccessorRank.length > 0) {
      konsole.log("rankvaluerankvalue1", this.state.rankvalue, primarySuccessorRank)
      primaryRank = primarySuccessorRank.slice(0, this.state.rankvalue)
    }
    if (spouseSuccessorRank !== undefined && spouseSuccessorRank.length > 0) {
      konsole.log("rankvaluerankvalue2", this.state.spouseValue, spouseSuccessorRank)
      spouseRank = spouseSuccessorRank.slice(0, this.state.spouseValue)
    }

    const uniqueFidSpouseList = [...new Map(this.state.fidSpouseList?.map((m) => [m.sRankId, m])).values()];
    konsole.log('uniqueFidSpouseList', this.state.fidSpouseList, uniqueFidSpouseList)

    sameRanks = this.getCheckOnSameRanks(this.state.fidPriList, uniqueFidSpouseList)
    konsole.log("getCheckOnSameRanks", sameRanks)
    konsole.log("sameranks", this.state.fidPriList, uniqueFidSpouseList)
    konsole.log("NameoptionsNameoptiodsdsdsns", sameRanks);

    let primarysuccorrelationRelation = {}
    let spouseSuccessorRelation2 = {}
    primarysuccorrelationRelation = (this.state?.fidPriList?.length > 0) ? this.getDifference3(this.state?.fidPriList, this.state?.Nameoptions) : this.state?.Nameoptions;
    spouseSuccessorRelation2 = (uniqueFidSpouseList.length > 0) ? this.getDifference4(this.state.fidSpouseList, this.state?.NameOptionsforSpose) : this.state?.NameOptionsforSpose;
    konsole.log("primarysuccorrelationRelation11", this.state.fidPriList, uniqueFidSpouseList, sameRanks, this.getCheckOnSameRanks(this.state.fidPriList, uniqueFidSpouseList))
    konsole.log("primarysuccorrelationRelation2", this.state?.NameOptionsforSpose, spouseSuccessorRelation2)
    konsole.log("uniqueFidSpouseList", this.state.NameOptionsforSpose)
    konsole.log("spouseRankspouseRank", spouseRank.length, typeof spouseRank)
    konsole.log("checking", this.state.fidPriList, sameRanks?.length)
    konsole.log('sameRankssameRanks', (sameRanks.length === 0) ? false : ((sameRanks.length === this.fidPriList) ? true : false))
    konsole.log('spouseSuccessorRelation2', spouseSuccessorRelation2,)
    konsole.log("fetchSpouseFid", this.state.fetchSpouseFid)
    // konsole.log("primarysuccorrelationRelationprimarysuccorrelationRelation",primarysuccorrelationRelation)
    return (

      <div>
        <div className="m-0 p-0">
        
          {(this.props.selectedLegalDocId != 13)?
          <>
            <h4 className="m-0 mb-2">
            {$AHelper.capitalizeAllLetters(this.state.primarymemberDetails.memberName)}
          </h4>
          <Row className="m-0 mb-3" onClick={()=>this.showWarningOfNoFid(primaryRank.length)}>
            <Col xs="10" sm="10" md="4" className="m-0 mb-2 p-0">
              <div className="FiduciaryDivRel" >
                <div className="FiduciaryDivAbslte"  >
                  <Select
                    value={((primarySRank == undefined) && primaryRank?.length > 0) ? primaryRank : primarySRank}
                    // value={primarySRank}
                    className="w-100 custom-select zindex bg-white"
                    options={(primaryRank.length > 0) ? primaryRank : []}
                    placeholder="Choose Successor"
                    onChange={(e) => this.onChangeNameSuccessor(e)}
                    // components={(primarySuccessorRank !== undefined && primaryRank !== undefined && primarySuccessorRank.length == primaryRank.length) ? { Menu: this.CustomMenu } : ""}
                  />
                </div>
              </div>
            </Col>
            <Col xs="10" sm="10" md="7" lg="7" className="fiduciaryPadd">
              <Select
                // value={succesorName}
                value = {(succesorName?.length > 0 ? succesorName?.map(ele => ({...ele, label: ele.label ? $AHelper.capitalizeAllLetters(ele.label) : ''})) : [])}
                className="custom-select p-0"
                // options={(primarysuccorrelationRelation)}
                options={primarysuccorrelationRelation?.map(ele => ({ ...ele, label: ele.label ? $AHelper.capitalizeAllLetters(ele.label) : ''}))} 
                placeholder="Name"
                onChange={(e) => this.onChangeName(e)}
              />
            </Col>
            <Col xs="2" sm="2" md="1" lg="1" className="m-0 p-0 d-flex justify-content-center">
              {this.state.updateFidAss == true ? (
                <Button
                  onClick={() => this.handleFidSubmit(this.state.userId, "primary")}
                  style={{ height: "30px", background: "#720c20", border: "none", fontWeight: 600 }}
                >
                  Update
                </Button>
              ) : (
                <img
                  className="cursor-pointer"
                  src="/icons/add-icon.svg"
                  alt="Fiduciary Assigment"
                  onClick={this.state.disabledbtn == false ? () => this.handleFidSubmit(this.state.userId, "primary") : null}
                  style={{ width: "22px" }}
                />
              )}
            </Col>
          </Row>
          <div className="mb-2 mt-2 financialInformationTable" style={{ overflowX: "auto" }}>
          {this.state.fidPriList.length !== 0 && (
            <Table bordered className="">
              <thead>
                <tr>
                  <th>Successor</th>
                  <th>Name</th>
                  <th>Relationship</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {this.state.fidPriList.length > 0 &&
                  this.state.fidPriList.sort(function (a, b) { return a.sRankId - b.sRankId }).map((priList, index) => {

                    return (
                      <tr key={index} >
                        <td>{priList.succesorRank}</td>
                        <td>{$AHelper.capitalizeAllLetters(priList.succesorName)}</td>
                        <td>{priList.relationshipWithUser}</td>
                        <td style={{verticalAlign:"middle"}}>
                          <TableEditAndViewForDecease
                            key={index}
                            forUpdateValue={priList}
                            type='primary'
                            actionType='Fiduciary'
                            handleUpdateFun={this.updateFidAssignments}
                            handleDeleteFun={this.deleteFidAssign}
                            userId={this.state.userId}
                            memberUserId={priList?.successorUserId}
                            refrencePage="FiduciaryAssignmentForm"
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          )}
          </div>
          </>:<></>}
        </div>
       
        {(this.props.selectedLegalDocId == 13)&&
       <div className="row mb-4">
          <div className="col-6 ">
          <h4 className="m-0 mb-2">
            {$AHelper.capitalizeAllLetters(this.state.primarymemberDetails.memberName)}
          </h4>
                <div className="">
                {
                  this.state.Nameoptions?.length > 0 && this.state.Nameoptions?.map((fiduciary, index) => {
                      // konsole.log("fiduciaryfiduciary",fiduciary)
                      return <Form.Check 
                      type='checkbox' 
                      id={index+"Nameoptions"+1} 
                      name='primaryCheckboxList' 
                      className='d-flex gap-3 align-items-center' 
                      key={Math.random() * 10} 
                      label={fiduciary?.label} 
                      onClick={(e) => this.handleCheckBoxChange(e, index,fiduciary,this.state.userId, "HippaReleasePrimary")} 
                      checked={fiduciary.checked}
                      />
                  })
              }
                </div>
          </div>
          {(this.state.spouseUserId !== "null" &&  this.props.selectedLegalDocId == 13 ) && (
              <div className="col-6">
              <h4 className="m-0 mb-2">
                {$AHelper.capitalizeAllLetters(this.state.primarymemberDetails.spouseName)}
              </h4>
              <div className="">
                {
                  this.state.NameOptionsforSpose?.length > 0 && this.state.NameOptionsforSpose?.map((fiduciary, index) => {
                      // konsole.log("fiduciaryfiduciary",fiduciary)
                      return <Form.Check 
                      type='checkbox' 
                      id={index+"NameOptionsforSpose"+1}
                      // id='customFiduciaryList' 
                      name='spouseCheckboxList' 
                      className='d-flex gap-3 align-items-center' 
                      key={Math.random() * 10} 
                      label={fiduciary?.label} 
                      onClick={(e) => this.handleCheckBoxChange(e, index,fiduciary,this.state.spouseUserId, "HippaReleaseSpouse")} 
                      checked={fiduciary?.checked}
                      />
                  })
              }
                </div>
              </div>
            )}    
          {(this.state.spouseUserId !== "null" &&  this.props.selectedLegalDocId == 13 ) && (
          <Row>
              <Col md="6" className="mt-4">
                <Form.Check
                  className="chekspace"
                  type="checkbox"
                  checked={this.checkForSameCheckedSuccessorUserIds()}
                  onChange={(e) => this.handleCheckBoxForHippa(e)}
                  name="sameAsPrimaryForHippa"
                  label={<span className="d-flex align-items-center m-0" style={{ paddingTop: "5px" }}>Same as {$AHelper.capitalizeAllLetters(this.state.primarymemberDetails.memberName)}</span>}
                />
              </Col>
            </Row>)}
            
        </div>
        }
        {/* <button onClick={this.handleHippaSaveButton}>Save</button> */}
        {(this.state.spouseUserId !== "null" &&  this.props.selectedLegalDocId != 13 ) && (
          <div className="">
            <Row>
              <Col md="6" className="">
                <Form.Check
                  className="chekspace"
                  type="checkbox"
                  checked={((sameRanks.length === 0) ? false : ((sameRanks.length === this.state.fidPriList.length) ? true : false))}
                  onChange={(e) => this.handleCheckBox(e)}
                  name="sameAsPrimary"
                  label={<span className="d-flex align-items-center m-0" style={{ paddingTop: "5px" }}>Same as {$AHelper.capitalizeAllLetters(this.state.primarymemberDetails.memberName)}</span>}
                />
              </Col>
            </Row>

            <div className="mt-3">
             
              {(this.props.selectedLegalDocId != 13)?<>
                 <h4 className="m-0 mb-2">
                {$AHelper.capitalizeAllLetters(this.state.primarymemberDetails.spouseName)}
              </h4>
              <Row className="m-0 mb-2" onClick={() => this.showWarningOfNoFid(spouseRank.length)}>
              <Col xs="10" sm="10" md="4" className="m-0 mb-2 p-0">
                <div className="FiduciaryDivRel">
                  <div className="FiduciaryDivAbslte" >
                    <Select
                      value={spouseSRank == undefined && spouseRank.length > 0 ? spouseRank : spouseSRank}
                      className="w-100 custom-select "
                      options={(spouseRank.length > 0) ? spouseRank : []}
                      placeholder="Choose Successor"
                      onChange={(e) => this.onChangeSpouseNameSuccessor(e)}
                      // components={{ Menu: spouseRank.length !== 0 ? this.CustomSuccessorMenu : "" }}
                      // components={(spouseSuccessorRank !== undefined && spouseRank !== undefined && spouseSuccessorRank.length !== spouseRank.length) ? { Menu: this.CustomSuccessorMenu } : ""}
                    />
                  </div>
                </div>
              </Col>
              <Col xs="10" sm="10" md="7" lg="7" className="fiduciaryPadd">
                <Select
                  value={succesorSpouseName}
                  className="custom-select p-0"
                  options={spouseSuccessorRelation2}
                  placeholder="Name"
                  onChange={(e) => this.onChangeSpouseName(e)}
                />
              </Col>
              <Col xs="2" sm="2" md="1" lg="1" className="m-0 p-0 d-flex justify-content-center">
                {this.state.spouseUpdateFidAss == true ? (
                  <Button
                    onClick={() => this.handleFidSubmit(this.state.spouseUserId, "Spouse")}
                    style={{ height: "30px", background: "#720c20", border: "none", fontWeight: 600 }}
                  >
                    Update
                  </Button>
                ) : (
                  <img
                    src="/icons/add-icon.svg"
                    alt="Fiduciary Assigment"
                    onClick={this.state.disabledbtn == false ? () => this.handleFidSubmit(this.state.spouseUserId, "Spouse") : null}
                    style={{ width: "22px" }}
                    className="cursor-pointer"
                  />
                )}
              </Col>
            </Row>
              </>: <></>}
              <div className="mt-3 financialInformationTable" style={{ overflowX: "auto" }}>
                {uniqueFidSpouseList?.length !== 0 && (
                  <Table bordered className="">
                    <thead>
                      <tr>
                        <th>Successor</th>
                        <th>Name</th>
                        <th>Relationship</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>

                      {this.state.legalDocument &&
                        this.state.legalDocument.map((l, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <OtherInfo
                                  key={l?.userLegalDocId}
                                  othersCategoryId={14}
                                  othersMapNatureId={l?.userLegalDocId}
                                  FieldName={l.legalDocType}
                                  userId={this.state.userId}
                                />
                              </td>
                            </tr>)
                        }
                        )
                      }

                      {uniqueFidSpouseList.length > 0 &&
                        uniqueFidSpouseList.sort(function (a, b) { return a.sRankId - b.sRankId }).map((priList, index) => {
                          konsole.log("priListpriList", priList);
                          return (
                            <tr key={index}>
                              <td>{priList.succesorRank}</td>
                              <td>{$AHelper.capitalizeAllLetters(priList.succesorName)}</td>
                              <td>{priList.relationshipWithUser}</td>
                              {/* <td>
                                <div className='d-flex justify-content-center align-items-center'>
                                  <p style={{ textDecoration: "underline", cursor: "pointer", }}
                                    onClick={() => this.updateFidAssignments(priList, "Spouse")}>
                                    Edit
                                  </p>
                                  <img className='cursor-pointer mb-2 ms-2' style={{ width: "20px" }} onClick={() => this.deleteFidAssign("spouse", priList, this.state.spouseUserId, this.state.loginUserId)} src='/icons/deleteIcon.svg' alt='g4' />
                                </div>
                              </td> */}
                              <TableEditAndViewForDecease
                                  key={index}
                                  forUpdateValue={priList}
                                  type='Spouse'
                                  actionType='Fiduciary'
                                  handleUpdateFun={this.updateFidAssignments}
                                  handleDeleteFun={this.deleteFidAssign}
                                  userId={this.state.spouseUserId}
                                  memberUserId={priList?.successorUserId}
                                  refrencePage="FiduciaryAssignmentForm"
                                />
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                )}
              </div>
            </div>
          </div>
        )} 

        {this.state.showEditChildpopup && (
          <Childdetails
            handleEditPopupClose={this.handleEditChildPopupClose}
            show={this.state.showEditChildpopup}
            UserID={this.state.EditProfieUserid}
            name={"Edit Profile"}
          />
        )}

      </div>

    )
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiduciaryAssignmentForm);