import React, { Component } from 'react';
import { Row, Col, Button, Table } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";
import { SET_LOADER } from '../Store/Actions/action';
import { $Service_Url } from "../network/UrlPath";
import { $getServiceFn, $postServiceFn, $CommonServiceFn, } from "../network/Service";
import { $AHelper } from "../control/AHelper";
import konsole from "../control/Konsole";
import AlertToaster from "../control/AlertToaster";
import { globalContext } from '../../pages/_app';
import EmergencyCard from './EmergencyCard';
import ModalComponent from '../Agentsetguidance/ModalComponent';
import { getApiCall, isNotValidNullUndefile } from '../Reusable/ReusableCom';
import { aGifts } from '../control/Constant';
import HealthStartingModal from '../../pages/HealthStartingModal';
import OtherInfo from '../asssets/OtherInfo';
import UserMedication from '../UserMedication';
import SummaryDoc from '../Summary/SummaryDoc';
import { paralegalAttoryId } from '../control/Constant';
import usePrimaryUserId from '../../component/Hooks/usePrimaryUserId';


class Emergencymain extends Component {

    static contextType = globalContext
    constructor(props) {
        super(props);
        this.state = {
            fidMemberByUserId: [],
            AllPhysician: [],
            AllFamilyMembers: [],
            addressData: [],
            commoArray: [],
            bloodType: [],
            allergyType: [],
            selectContacttype: '',
            userId: "",
            showEmergencyCard: false,
            selectbloodtype: '',
            selectallergytype: '',
            selectEmergency: [],
            selectphysicalemergeny: [],
            isDependentsHome: false,
            isOrganDonor: false,
            isPetsAtHome: false,
            medicalConditions: '',
            medications: '',
            addinationalInfo: '',
            emergencyCardId: 0,
            natureId: '',
            selectbloodtype:'',
            selectallergytype:'',
            isDependentsHome:false,
            isOrganDonor:false,
            isPetsAtHome:false,
            medicalConditions:'',
            medications:'',
            addinationalInfo:'',
            allergiesDescription:'',
            emergencyCardId:0,
            natureId:'',
            visible:false,
            putAllergies:'',
            PreviewData:[],
            emergencyContact:[],
            petsAtHomeDesc:'',
            pinNumber:0,
            searchTxt:'',
            spouseUserId:0,
            donor2ResponseId:0,
            donor1ResponseId:0,
            getEmerContactPriority:[],
            showHeathStartingModal:true,
            isEmergencyContactprimary:false,
            selectedFamilyMember: null,
            medicationCallApi:false,
           medicationList:[],
           loggedInMemberRoleId:null,
        };
        this.allergyRef = React.createRef()
    }

    componentDidMount(prevState) {
        let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
        let spouseUserId = sessionStorage.getItem('spouseUserId') || "";
        let  loggedInMemberRoleId  = JSON.parse(sessionStorage.getItem('stateObj')).roleId;
        this.setState({
            userId: newuserid,
            spouseUserId:spouseUserId,
            loggedInMemberRoleId:loggedInMemberRoleId
        });
        let url = window.location.href;

        if (url.indexOf("query") != -1) {
            newuserid = url.split("query=")[1];
            this.setState({ userId: newuserid });
        }
        // if(this.state.showHeathStartingModal == false){
        this.generateRandomNumbers()
        this.FetchFamilyMembers(newuserid);
        this.fetchAndDisplaySearchList(newuserid)
        this.getAllergiesTypefunc()
        this.getgetBloodTypefunc()
        this.FiduciaryList(newuserid)
        this.fetchSavedAddress(newuserid)
        this.getsubjectForFormLabelId(newuserid);
        this.getsubjectForFormLabelId(spouseUserId);
        this.GetEmerContactPriorityfunc(newuserid);
        this.fetchmemberbyID(newuserid)
        // }
    }


    getsubjectForFormLabelId = (UserId) => {
        konsole.log("test 1");
        let formlabelDataSpouse = {};
        this.props.dispatchloader(true);
        // aGifts.formLabelId.map((id, index) => {
        //   let data = [id.id];
          konsole.log("test 2");
          $CommonServiceFn.InvokeCommonApi(
            "POST",
            $Service_Url.getsubjectForFormLabelId,
            aGifts.formLabelId,
            (response) => {
              if (response) {
                const resSubData = response.data.data;
    
                for (let resObj of resSubData) {
                  let label = "label" + resObj.formLabelId;
                  formlabelDataSpouse[label] = resObj.question;
                  konsole.log("test 3");
                  $CommonServiceFn.InvokeCommonApi(
                    "GET",
                    $Service_Url.getSubjectResponse +
                    UserId +
                    `/0/0/${formlabelDataSpouse[label].questionId}`,
                    "",
                    (response) => {
                      if (response) {
                        konsole.log("test 4");
                        konsole.log(response,"responseresponseresponseresponse")
                        if (response.data.data.userSubjects.length !== 0) {
                        //   this.setState({
                        //     updateSpouseMetaData: true,
                        //   });
                          konsole.log("test 5");
                          let responseData = response.data.data.userSubjects[0];
                          this.props.dispatchloader(true);
                          for (
                            let i = 0;
                            i < formlabelDataSpouse[label].response.length;
                            i++
                          ) {
                            if (
                              formlabelDataSpouse[label].response[i].responseId ===
                              responseData.responseId
                            ) {
                              this.props.dispatchloader(false);
                              if (responseData.responseNature == "Radio") {
                                formlabelDataSpouse[label].response[i][
                                  "checked"
                                ] = true;
                                formlabelDataSpouse[label]["userSubjectDataId"] =
                                  responseData.userSubjectDataId;
                                if (responseData.questionId == 59) {
                                    konsole.log(responseData,"responseData")
                                if(UserId == this.state.userId){
                                    this.setState({
                                        donor1ResponseId: responseData.response,
                                      });
                                }else{
                                    this.setState({
                                        donor2ResponseId: responseData.response,
                                      });

                                }
                                }
    

                              }
                            }
                            this.props.dispatchloader(false);
                          }
                        }
                        this.props.dispatchloader(false);
                      }
                    }
                  );
                }
              } else {
                //   alert(Msg.ErrorMsg);
              }
            }
          );
        // });
      };
      fetchmemberbyID = (userid) => {
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFamilyMemberbyID + userid, "", (response) => {
          this.props.dispatchloader(false);
          if (response) {
            konsole.log("family at personal",response.data.data,response.data.data.member.memberRelationship?.isEmergencyContact, response);
            this.setState({
                isEmergencyContactprimary:response.data.data.member.memberRelationship?.isEmergencyContact
            });
            this.FiduciaryList(userid)
        }
        }
        );
      };


    onContactChangefunc(e,index) {
        let getMedicatiodata = $Service_Url.GetUserMedication+`${e.target.value}`
        const getMedicationresponse =  getApiCall('GET',getMedicatiodata)
        let medicationListdata = []
        getMedicationresponse.then((response)=>{
            konsole.log(response,'responseuserMedications')
            // medicationListdata.push(response?.userMedications)
            this.setState({
                medicationList:response?.userMedications
            })
        })
        let myNewArray=[...this.state.emergencyContact]
                myNewArray.map((el,index)=>{
                    myNewArray[index]['isEmergencyShow']=false
                    myNewArray[index]['emergencyContactId'] = 0
                    myNewArray[index]['emerContactPriorityId'] = 0
                })
        let OrganDonar;

        if (e.target.value === this.state.userId) {
        OrganDonar = this.state.donor1ResponseId == 'Yes' ? true : false;
        } else if (e.target.value === this.state.spouseUserId) {
        OrganDonar = this.state.donor2ResponseId == 'Yes' ? true : false;
        } else {
        OrganDonar = false;
        }
        konsole.log(OrganDonar,"OrganDonar")
        this.setState({
            selectedFamilyMember: index,
            showEmergencyCard: false,
            emergencyContact:myNewArray,
            selectbloodtype: '',
            selectallergytype: '',
            isDependentsHome: false,
            isOrganDonor: OrganDonar,
            isPetsAtHome: false,
            medicalConditions: '',
            medications: '',
            addinationalInfo: '',
            emergencyCardId: 0,
            natureId: '',
            selectbloodtype:'',
            selectallergytype:'',
            selectContacttype: e.target.value,
            isDependentsHome:false,
            petsAtHomeDesc:'',
            medicalConditions:'',
            medications:medicationListdata,
            addinationalInfo:'',
            allergiesDescription:this.state.medicationList?.length > 0 ? this.state.medicationList?.map((e)=> {return e.medicationName+" - "+e.doseAmount}).toString() : '',
            emergencyCardId:0,
            natureId:'',
            visible:false,
            putAllergies:'',
            PreviewData:[],
            pinNumber:0,
        })
        this.generateRandomNumbers()
        // this.fetchAndDisplaySearchList(e.target.value)
        this.getEmergencyCard(e.target.value)
        konsole.log(e.target.value,this.state.isEmergencyContactprimary,"kkkkkkkkkkkk")
    }

    generateRandomNumbers() {
        let randomNumbers = [];
            // Generate a random number between 1 and 100 (you can adjust the range as needed)
            let randomNumber = Math.floor(Math.random() * 10000000000) + 1;
            randomNumbers.push(randomNumber);
        // }
        this.setState({
            pinNumber:randomNumbers[0]
        })
    }




    getEmergencyCard(EUserId) {
        this.props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getEmergencyApi + "?UserId=" + EUserId, '', (response, error) => {
            if (response) {
                this.props.dispatchloader(false)
                konsole.log(response.data.data[0], "response2")

                let responsedata = response.data.data[0]

                this.setState({
                    selectbloodtype:responsedata.bloodTypeId,
                    selectallergytype:responsedata.emergAllergies[0]?.allergiesTypeId,
                    selectEmergency:responsedata.emergencyContacts,
                    selectphysicalemergeny:responsedata.emergencyPhysicians,
                    isDependentsHome:responsedata.isDependentsHome,
                    isOrganDonor:responsedata.isOrganDonor,
                    isPetsAtHome:responsedata.isPetsAtHome,
                    medicalConditions:responsedata.medicalConditions,
                    medications:responsedata.medications,
                    addinationalInfo:responsedata.addinationalInfo,
                    allergiesDescription:responsedata.allergiesDescription,
                    emergencyCardId:responsedata.emergencyCardId,
                    putAllergies:responsedata.allergiesToMedications,
                    petsAtHomeDesc:responsedata.petsAtHome
                })
                if(responsedata?.pinCode != null)
                this.setState({
                    pinNumber:responsedata?.pinCode
                })
                response.data.data[0].emergAllergies.map((e) => {
                    if (e.allergiesTypeId == '999999') {

                        this.allergyRef.current.saveHandleOther(e.allergiesId)
                        this.setState({
                            natureId: e.allergiesId
                        })
                    }

                })
               
               let myNewArray=[...this.state.emergencyContact]
                myNewArray.map((el,index)=>{
                    myNewArray[index]['isEmergencyShow']=false
                })

                responsedata.emergencyContacts.map((e)=>{
                    konsole.log(e,"el.userId == e.emergencyContactUserId",myNewArray)
                    myNewArray.map((el,index)=>{
                         if(el.userId == e.emergencyContactUserId){
                            konsole.log(el.userId == e.emergencyContactUserId,"el.userId == e.emergencyContactUserId")
                    myNewArray[index]['isEmergencyShow'] = true
                    myNewArray[index]['emergencyContactId'] = e.emergencyContactId
                    myNewArray[index]['emerContactPriorityId'] = e.emerContactPriorityId
                    }
                    this.setState({ emergencyContact: myNewArray })
                    konsole.log(myNewArray,"myNewArraymyNewArraymyNewArraymyNewArray")
                })
                })
                
                let myarrayIndex = 0
                let myarray = [...this.state.AllPhysician]
                myarrayIndex = myarray?.findIndex(({ professionalUserId }) => responsedata.emergencyPhysicians.some((e)=> e.emergencyPhysicianUserId == professionalUserId))
                myarray[myarrayIndex]['isEmergencyPhysicianshow'] = true
                myarray[myarrayIndex]['emergencyPhysicianId'] = responsedata?.emergencyPhysicians[0]?.emergencyPhysicianId
                myarray[myarrayIndex]['emergencyPhysicianUserId'] = responsedata?.emergencyPhysicians[0]?.emergencyPhysicianUserId
                this.setState({ AllPhysician: myarray })
                konsole.log(this.state.AllPhysician,myarray,"myarrayIndexmyarrayIndex")


            } else {
                this.props.dispatchloader(false)
                this.setState({
                    selectbloodtype:'',
                    selectallergytype:0,
                    selectEmergency:[],
                    selectphysicalemergeny:[],
                    isDependentsHome:false,
                    // isOrganDonor:false,
                    isPetsAtHome:false,
                    medicalConditions:'',
                    medications:'',
                    addinationalInfo:'',
                    allergiesDescription:this.state.medicationList?.length > 0 ? this.state.medicationList?.map((e)=> {return e.medicationName+" - "+e.doseAmount}).toString() : '',
                    emergencyCardId:0,
                    putAllergies:[],
                })

            let newArray = [...this.state.AllPhysician]
            if(newArray?.length > 0){
            newArray[0]['isEmergencyPhysicianshow'] = false
            newArray[0]['emergencyPhysicianId'] = 0
            this.setState({AllPhysician:newArray})
            }
            }
        })
    }

    FetchFamilyMembers = (userid) => {
        userid = userid || this.state.userId;
        let pData = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'))
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFamilyMembers + userid, "", (response) => {
            this.props.dispatchloader(false);
            if (response) {
                konsole.log('responserejkjkjsponseinfo',this.state.userId,pData.memberName.split(" "),this.state.userId,userid,response)
                response?.data?.data?.unshift({'userId':this.state.userId,'fName':pData.memberName.split(" ")[0],'lName':pData.memberName.split(" ")[pData.memberName.split(" ").length-1],'relationshipTypeId':'1','relationshipName':'Primary','memberId':pData.memberId})
                const datas = response?.data?.data

                
                if(this.state.userId == userid){
                this.setState({
                    ...this.state,
                    AllFamilyMembers: datas?.filter(member => {
                        let datedob = member.dob !== null && member.dob !== "" && member.dob !== undefined ? $AHelper.calculate_age($AHelper.getFormattedDate(member.dob)) : 0;
                        return ( (member.relationshipTypeId == 1 && (member.memberStatusId != 2 || member.memberStatusId != 3) && (member.userId == this.state.spouseUserId || member.userId == this.state.userId) ) || ((member.relationshipTypeId ==2 || member.relationshipTypeId ==5 || member.relationshipTypeId ==6 || member.relationshipTypeId ==28|| member.relationshipTypeId ==29 || member.relationshipTypeId ==41) && datedob < 18 && datedob > 0) )})
                });
                konsole.log(this.state.AllFamilyMembers,"AllFamilyMembersAllFamilyMembers")
                for (let user of this.state.AllFamilyMembers) {
                    konsole.log(user?.userId,"AllFamilyMembersuserID")
                    this.fetchSavedAddress(user?.userId);
                }                
            }
        } 
        }
        );
    };

    FiduciaryList = (primaryuserID) => {
        let pData = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'))
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFamilyMembers + primaryuserID, "", (response) => {
          if (response) {
            if(this.state.isEmergencyContactprimary){
            response.data.data.unshift({'userId':this.state.userId,'fName':pData.memberName.split(" ")[0],'lName':pData.memberName.split(" ")[pData.memberName.split(" ").length-1],'relationshipTypeId':'1','relationshipName':'Primary','isEmergencyContact':this.state.isEmergencyContactprimary})
            }
            let  responseData=$AHelper.deceasedNIncapacititedFilterFun(response?.data?.data)
            konsole.log("response of fiduciary list",this.state.isEmergencyContactprimary,responseData,response);
            let newArrays = [...response?.data?.data]
            response?.data?.data?.map((e,index)=>{
                newArrays[index]['isEmergencyShow']=false
            })
            konsole.log(newArrays,"newArraysnewArraysnewArraysnewArrays")
            this.setState({
                ...this.state,
                emergencyContact:newArrays?.filter(member => member.isEmergencyContact == true),
            });
            for (let meberID of this.state.emergencyContact) {
                konsole.log("meberID", meberID.userId)
                this.getcontactdeailswithOthger(meberID.userId)
                this.fetchSavedAddress(meberID.userId)
            }
          }
        }
        );
      };
      
    fetchAndDisplaySearchList = (userid) => {
        const userId = userid || this.state.userId;
        const sendData = `?MemberUserId=${userId}&ProTypeId=${10}&primaryUserId=${userId}`
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSearchProfessional + sendData, "", (response, error) => {
            this.props.dispatchloader(false);
            if (response) {
                konsole.log('nsedsdsdsddsrejkjkjspon',response)
                this.setState({
                    ...this.state,
                    AllPhysician: response.data.data,
                });

                this.fetchSavedAddress(response.data.data[0]?.professionalUserId)
            } else {
                konsole.log("errorMemberPhysician", error)
            }
        }
        );
    };
    getcontactdeailswithOthger = (userIds) => {
        // konsole.log("USERIDUSERID", userId)
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getcontactdeailswithOther + userIds, "", (response, error) => {
            if (response) {
                konsole.log("getcontactdeailswithOtherres", response?.data?.data)
                let responseData = response?.data?.data
                let myNewArray = [...this.state.emergencyContact]
                let arrFindIndex = myNewArray?.findIndex(({ userId }) => userId == userIds)
                myNewArray[arrFindIndex]['contact'] = responseData
                this.setState({ emergencyContact: myNewArray })
                

            } else {
                konsole.log("getcontactdeailswithOthererr", response)
            }
        })
    }


    fetchSavedAddress = (userIds) => {
        if(!isNotValidNullUndefile(userIds))return;
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAllAddress + userIds,
            "", (response) => {
                this.props.dispatchloader(false);
                if (response) {
                    konsole.log('addressData1',userIds)
                    konsole.log("resposejjAddress",response.data.data)
                    if(this.state.AllPhysician[0]?.professionalUserId == userIds){
                        konsole.log('addressData2')
                    this.state.AllPhysician[0]['address'] = response.data.data
                    this.setState({ AllPhysician: this.state.AllPhysician })
                    }
                    console.log(this.state.AllPhysician,this.state.selectContacttype,this.state.userId,userIds,"AllPhysiciandatsaddress")
                    if(this.state.selectContacttype == this.state.userId){
                        konsole.log('addressData3',this.state.selectContacttype,this.state.userId)
                    this.setState({
                        // ...this.state,
                        addressData: response.data.data.addresses[0]
                    });
                    }
                   
                    let myNewArrayfamily = [...this.state.AllFamilyMembers]
                    let arrFindIndexfamily = myNewArrayfamily?.findIndex(({ userId }) => userId == userIds)
                    if(arrFindIndexfamily != -1){
                    myNewArrayfamily[arrFindIndexfamily]['address'] = response.data.data
                    this.setState({ AllFamilyMembers: myNewArrayfamily })
                    }
                    let myNewArray = [...this.state.emergencyContact]
                    let arrFindIndex = myNewArray?.findIndex(({ userId }) => userId == userIds)
                    myNewArray[arrFindIndex]['address'] = response.data.data
                    this.setState({ emergencyContact: myNewArray })

                    
                }
                else {
                    //   this.toasterAlert(Msg.ErrorMsg,"Warning")
                }
            })
    }

    getAllergiesTypefunc() {
        $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getAllergiesType, '', (response) => {
    if(response){
            konsole.log(response, "responsegetallergies")
            this.setState({
                allergyType: response.data.data
            })
        }
        })
    }

    getgetBloodTypefunc() {
        $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getBloodType, '', (response) => {
            konsole.log(response, "responsegetbloodtype")
            if(response.data.data?.length > 0){
            this.setState({
                bloodType: response.data.data
            })
        }
        })
    }

    GetEmerContactPriorityfunc() {
        $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.GetEmerContactPriority, '', (response) => {
    if(response){
            konsole.log(response.data.data, "responseGetEmerContactPriority")
            this.setState({
                getEmerContactPriority: response.data.data
            })
        }
        })
    }

    onFinish = () => {
        let emergencyContacts = this?.state?.selectEmergency?.length > 0 && this.state.selectEmergency?.map((e) => { 
            if (e?.isActive == true) { 
                return {
                    "emerContactPriorityId":e.emerContactPriorityId,
                    "emergencyContactId": e.emergencyContactId,
                    "emergencyContactUserId": e.emergencyContactUserId,
                    "isActive": true
                };
            }  
            if (e?.isActive == false) {
                return {
                    "emergencyContactId": e.emergencyContactId,
                    "emergencyContactUserId": e.emergencyContactUserId,
                    "isActive": false
                };
            }
            
        });
        
        konsole.log(this?.state?.selectEmergency,"emergencyContacts",emergencyContacts)
        let jsonObj = [
            {
              "emergencyCardId": this.state.emergencyCardId,
              "userId": this.state.selectContacttype,
              "bloodTypeId": this.state.selectbloodtype,
              "allergiesDescription": this.state.allergiesDescription,
            //   "medications": this.state.medications,
              "medicalConditions": this.state.medicalConditions,
              "isOrganDonor": this.state.isOrganDonor,
              "isDependentsHome": this.state.isDependentsHome,
              "isPetsAtHome": this.state.isPetsAtHome,
              'petsAtHome':this.state.petsAtHomeDesc,
              "addinationalInfo": this.state.addinationalInfo,
              "isActive": true,
              "upsertedBy": this.state.userId,
            //   "emergAllergies":allergydata,
              "emergencyContacts": emergencyContacts,
              'allergiesToMedications':this.state.putAllergies,
              'pinCode':this.state.pinNumber,
              "emergencyPhysicians": [this.state.selectphysicalemergeny.length > 0 ? this.state.selectphysicalemergeny[this.state.selectphysicalemergeny.length-1] : null]
            }
          ]
          if (this.state.selectContacttype==null || this.state.selectContacttype=='' || this.state.selectContacttype==undefined) {
            AlertToaster.error("Select contact to generate Emergency Card");
            return;
          }
        //   if (this.state.selectbloodtype==null || this.state.selectbloodtype=='' || this.state.selectbloodtype==undefined) {
        //     AlertToaster.error("Blood type is not selected");
        //     return;
        //   }
          
          if (this.state.putAllergies==null || this.state?.putAllergies?.trim()=='' || this.state.putAllergies==undefined) {
            AlertToaster.error("Allergies is not provided");
            return;
          }
        //   if( this.state.allergiesDescription== null|| this.state.allergiesDescription==''|| this.state.allergiesDescription==undefined){
        //     AlertToaster.error("Allergy Description are not provided");
        //     return;
        //   }
          if (this.state.emergencyContact?.filter((e)=> e?.isEmergencyShow == true)?.length <= 0) {
            AlertToaster.error("Emergency contacts is not selected");
            return;
          }
          konsole.log(this.state.selectphysicalemergeny,"this.state.selectphysicalemergeny",this.state.AllPhysician?.some(({ professionalUserId }) => this.state.selectphysicalemergeny.some((e)=> e.emergencyPhysicianUserId == professionalUserId)))
          if (this.state.selectphysicalemergeny.length == 0 || this.state.selectphysicalemergeny[this.state.selectphysicalemergeny.length-1]?.isActive == false || (this.state.AllPhysician?.some(({ professionalUserId }) => this.state.selectphysicalemergeny.some((e)=> e.emergencyPhysicianUserId == professionalUserId)) == false)) {
            AlertToaster.error("Physicians contact information is not selected");
            return;
          }
        //   if (this.state.medicalConditions==null || this.state.medicalConditions=='' || this.state.medicalConditions==undefined) {
        //     AlertToaster.error("Medical conditions information is not provided");
        //     return;
        //   }
        //   if(this.state.isPetsAtHome==true && (this.state.petsAtHomeDesc == null || this.state.petsAtHomeDesc == '' || this.state.petsAtHomeDesc == undefined)){
        //     AlertToaster.error("Pets at home description is not provided");
        //     return;
        //   }
        //   if (this.state.addinationalInfo==null || this.state.addinationalInfo=='' || this.state.addinationalInfo==undefined) {
        //     AlertToaster.error("Additional information is not provided");
        //     return;
        //   }
          if(this.state.selectphysicalemergeny.length > 0 && emergencyContacts.length > 0 ){
          this.props.dispatchloader(true)
         $CommonServiceFn.InvokeCommonApi('POST',$Service_Url.upsertEmergencyCardApi,jsonObj,(response,error)=>{
            if(response){
                this.props.dispatchloader(false)
                konsole.log(response,"postcard")
                AlertToaster.success("Data saved successfully")
                this.setState({
                    emergencyCardId:response?.data?.data?.length > 0 ? response?.data?.data[0].emergencyCardId : 0
                })
                this.getEmergencyCard(response?.data?.data[0]?.userId)
                response?.data?.data[0]?.emergAllergies?.map((e)=>{
                    if(e.allergiesTypeId == '999999'){
                       
                        this.allergyRef.current.saveHandleOther(e?.allergiesId) 
                        this.setState({
                            natureId: e?.allergiesId
                        })
                    }
                })
            }else{
                this.props.dispatchloader(false)
                AlertToaster.error("Something went wrong")
                konsole.log(error,"error")

            }
        
        })
    }else{
        // AlertToaster.error("Please fill all details") 
    }
    }

    displayEmergencyCardFunction = () => {
        if(this.state.emergencyCardId != 0){
        this.setState({
            showEmergencyCard: true
        })
    }else{
        AlertToaster.error("Please fill all details and Save") 
    }
    }

    handleClose = () => {
        this.setState({ showEmergencyCard: false });
    };

    handleClosePreview = () => {
        konsole.log("hide modal");
        this.setState({
            visible:false
        })
    }

    filterEmergency=(e)=>{
        let searchtext = this.state.searchTxt?.toLowerCase()
        const _originalArray=[...this.state.emergencyContact]
        let _newArray=this.state.emergencyContact
        if(isNotValidNullUndefile(searchtext)){
            _newArray =_originalArray.filter((data)=> data.fName.toLowerCase().includes(searchtext))
        }else{
            _newArray=_originalArray
        }

    const searchResult= _newArray?.filter(e=> e.userId != this.state.selectContacttype)
    return searchResult;
    }

    getEmergencyContactPriority(priorityId) {
        const foundPriority = this.state.getEmerContactPriority?.find((e) => e.value == priorityId);
      
        if (foundPriority) {
          return `(${foundPriority.label})`;
        } else {
          return '';
        }
      }
      
    //   handleEmergencyContacts=(data)=>{
    //         data['isEmergencyShow'] = !data?.isEmergencyShow
    //         data['emerContactPriorityId'] = data?.isEmergencyShow == true && (!data?.emerContactPriorityId && this.state.emergencyContact?.filter((e)=> e?.isEmergencyShow==true).length <= 3 ? this.state.emergencyContact.filter((e) => e?.isEmergencyShow === true).length + 1 : '')
    //         let Objs =  {
    //             "emerContactPriorityId": data?.isEmergencyShow == true && (data.emerContactPriorityId == null && this.state.emergencyContact?.filter((e)=> e?.isEmergencyShow==true).length <= 3) ? this.state.emergencyContact.filter((e) => e?.isEmergencyShow === true).length + 1 : data.emerContactPriorityId,
    //             "emergencyContactId": data.emergencyContactId ? data.emergencyContactId : 0,
    //             "emergencyContactUserId": data.userId,
    //             "isActive": data.isEmergencyShow
    //         };
    //         this.setState({selectEmergency:[...this.state.selectEmergency,Objs]})
    //         if(this.state.emergencyContact.filter((e)=> e.isEmergencyShow==true).length > 3 ){
    //             AlertToaster.warn("Only allows a maximum of three names to be added. You have exceeded this limit.");
    //             data['isEmergencyShow'] = !data?.isEmergencyShow
    //             return;
    //         }
    //     }
    handleEmergencyContacts = (data) => {
        this.setState((prevState) => {
          const { emergencyContact } = prevState;
          const { isEmergencyShow, emerContactPriorityId } = data;
      
          const updatedIsEmergencyShow = !isEmergencyShow;
      
          const calculatePriority = () => {
            if (updatedIsEmergencyShow == true) {
              const activeContacts = emergencyContact.filter((e) => e.isEmergencyShow === true);
              if (!emerContactPriorityId && activeContacts.length < 3) {
                if(activeContacts?.every((e) => e.emerContactPriorityId != 1)){
                    return 1;
                }else if(activeContacts?.every((e) => e.emerContactPriorityId != 2)){
                    return 2;
                }else if(activeContacts?.every((e) => e.emerContactPriorityId != 3)){
                    return 3;
                }else{
                return activeContacts.length + 1;  
                }
              } else {
                return emerContactPriorityId;
              }
            }
            return null;
          };
      
          const updatedEmerContactPriorityId = calculatePriority();
      
          if (
            updatedIsEmergencyShow &&
            updatedEmerContactPriorityId === null &&
            emergencyContact.filter((e) => e.isEmergencyShow === true).length >= 3
          ) {
            AlertToaster.warn("Only allows a maximum of three names to be added. You have exceeded this limit.");
            return;
          }
      
          data['isEmergencyShow'] = updatedIsEmergencyShow;
          data['emerContactPriorityId'] = updatedEmerContactPriorityId;
          
          if(this.state.emergencyContact.filter((e)=> e.isEmergencyShow==true).length > 3 ){
            AlertToaster.warn("Only allows a maximum of three names to be added. You have exceeded this limit.");
            data['isEmergencyShow'] = !data?.isEmergencyShow
            return;
        }

          const newObj = {
            emerContactPriorityId: updatedEmerContactPriorityId,
            emergencyContactId: data.emergencyContactId || 0,
            emergencyContactUserId: data.userId,
            isActive: updatedIsEmergencyShow,
          };
          let pushArray = [...prevState.selectEmergency, newObj]
        // if(newObj.emerContactPriorityId == null){
        //     let filterArray = pushArray.filter((e)=> {return e.emergencyContactUserId != newObj.emergencyContactUserId})
        //     pushArray = filterArray
        //   }
          konsole.log(pushArray,"hjhjhjhjhjhj")
          return { selectEmergency: pushArray };
        });
      };
      functionForDicModal=(value)=>{
        konsole.log("functionForDicModalValueFromModalPage",value)
        this.setState({showHeathStartingModal:value})
        if(value==false)
        {
          this.FetchFamilyMembers(this.state.userId);
        }
      }
      
      
      medicationCallfun = (data) =>{
        konsole.log(data,"dadadadadadadaadada")
        if(data != undefined){
            let getMedicatiodata = $Service_Url.GetUserMedication+`${this.state.selectContacttype}`
            const getMedicationresponse =  getApiCall('GET',getMedicatiodata)
            getMedicationresponse.then((response)=>{
            konsole.log(response,'responseuserMedications')
            this.setState({
                medicationList:response?.userMedications
            })
        })
        }
      }
      
    

    render() {
        konsole.log(this.state.medicationCallApi,"this.medicationRef")
        konsole.log("AllPhysicianAllPhysician", this.state.AllPhysician)
        konsole.log("addressData", this.state.addressData)
        konsole.log("AllFamidsdslyMembers", this.state.AllFamilyMembers)
        konsole.log("lkhkhhsfs", this.state.selectEmergency, this.state.responseData, this.state.selectphysicalemergeny, this.state.selectContacttype)
        konsole.log(this.state.emergencyContact,this.state.isEmergencyContactprimary,"selectEmergency")

        const PhysiciansData = this.state.AllPhysician
        return (
            <div className='mb-5'>
                {this.state.visible ===true && <ModalComponent title="Emergency Card Preview" visible={this.state.visible} onCancel={this.handleClosePreview} onOk={this.handleClosePreview} >
                    <h2 style={{height:"40vh"}}>Coming Soon</h2>
                </ModalComponent>}
                <hr />
                {konsole.log(this.state.showHeathStartingModal,"this.state.showHeathStartingModal")}
                {(this.state.showHeathStartingModal == true && !paralegalAttoryId.includes(this.state.loggedInMemberRoleId)) ? <HealthStartingModal functionForDicModal={this.functionForDicModal}  />: 
                <Row>
                    <Col lg='12' className=''>
                        <Row className='mt-5'>
                            <Col xs="12" sm="12" md="6" lg="6" className='' >
                                <div>
                                    <ul className='d-sm ps-3'>
                                        <li className='li-heading-class'>Generate Emergency Cards For*</li>
                                        <li className='li-sub-heading-class'>Select contact to generate emergency card for</li>
                                    </ul>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="6" lg="6">
                                <div className='pe-3'>
                                    {/* <Form.Select className='fs-6 select-style-class' onChange={(e) => { this.onContactChangefunc(e) }}>
                                        <option value="" disabled selected hidden>Select Contact</option>
                                        {this.state.AllFamilyMembers.length > 0 &&
                                            this.state.AllFamilyMembers?.map((suffix, index) => {
                                                return (
                                                    <option key={index} value={suffix.userId}>
                                                        {suffix?.fName + `${" "}` + suffix?.lName + `${","}` + `${" "}` + suffix?.relationshipName}

                                                    </option>
                                                );
                                            })}
                                    </Form.Select> */}
                                    <div className='row'>
                                            {this.state.AllFamilyMembers.length > 0 &&
                                                    this.state?.AllFamilyMembers?.filter((item)=>item?.memberStatusId!==2).map((suffix, index) => {
                                                        return (
                                                            <div 
                                                            className={`col-3 familyMemebersMainDivEmergency`}
                                                             key={index} 
                                                             >
                                                            <Form.Check
                                                                type="radio"
                                                                checked={this.state.selectedFamilyMember === index}
                                                                className='emergencySelectRadioForMemberRadio chekspace d-flex justify-content-center'
                                                                value={suffix.userId}
                                                                onChange={(e) => { this.onContactChangefunc(e,index) }}
                                                                />
                                                            <span                                                
                                                            className={`text-truncate emergencySelectRadioForMemberSpan upperCasing ${(this.state.selectedFamilyMember === index)?"withoutCheckButtonColorEmergecyFontMagenta":"withoutCheckButtonColorEmergecyFontGrey"}`}>
                                                            {suffix?.fName + `${" "}` + suffix?.lName}
                                                            </span>
                                                            </div>
                                             )})}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col xs="12" sm="12" md="6" lg="6" className='' >
                                <div>
                                    <ul className='d-sm ps-3'>
                                        <li className='li-heading-class'>Blood Type</li>
                                        <li className='li-sub-heading-class'>Select recipient blood type</li>
                                    </ul>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="6" lg="6" className=''>
                                <div className='pe-3'>
                                    <Form.Select className='fs-6 select-style-class' value={this.state.selectbloodtype} onChange={(e) => { this.setState({ selectbloodtype: e.target.value }) }}>
                                        <option disabled value="" >Select Blood Type</option>
                                        {this.state.bloodType.map((e) => (
                                            <option value={e.value}>{e.label}</option>

                                        ))}

                                    </Form.Select>
                                </div>
                            </Col>
                        </Row>


                        <hr className='ms-3 me-3 hr-tag-class' />

                        <Row className=''>
                            <Col xs="12" sm="12" md="6" lg="6" className='' >
                                <div>
                                    <ul className='d-sm ps-3'>
                                        <li className='li-heading-class'>Allergies to Medications*</li>
                                        <li className='li-sub-heading-class'>Enter the medicine details that you are allergic to</li>
                                    </ul>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="6" lg="6" >
                                <div className='pe-3'>
                                    <input className='border' placeholder='Input allergic medicines' value={this.state.putAllergies} onChange={(e)=>{
                                        this.setState({
                                            putAllergies:e.target.value
                                        })
                                    }} />
                                </div>
                            </Col>
                        </Row>

                        <Row className='mt-2'>
                            <Col xs="12" sm="12" md="6" lg="6" className='' >

                            </Col>
                            <Col xs="12" sm="12" md="6" lg="6" >
                                <div className='pe-3'>
                                    <textarea className='w-100 ps-2' rows="4" cols="50" placeholder='What medications you take ?' style={{ border: "1px solid #ced4da" }}  value={this.state.allergiesDescription} onChange={(e) => { this.setState({ allergiesDescription: e.target.value }) }} />
                                </div>
                            </Col>
                        </Row>
<Row className='mt-2 d-flex justify-content-center'>                        
<div>{this.state.medicationList?.length > 0 && <Table bordered  className="w-100 table-responsive financialInformationTable">
        <thead className='text-center align-middle' >
          <tr  >
          <th  >Medication</th>
          <th  >Dosage</th>
          <th  >Frequency</th>
          <th  >Timing</th>
          {/* <th  >Start Date</th> */}
          {/* <th  >End Date</th> */}
          <th  >Note</th>
          </tr>
          </thead>
          <tbody>
          {this.state.medicationList?.map((e,ind)=>(<>
          <tr  style={{wordBreak:"break-word", textAlign:'center'}}className="mb-5">
            <td style={{wordBreak:"break-word"}}>
               <OtherInfo
                 key={ind}
                  othersCategoryId={38} 
                   userId={this.state.selectContacttype}
                   othersMapNatureId={e.userMedicationId} 
                  FieldName={e.medicationName}
                  />
            </td>
            <td style={{wordBreak:"break-word"}}>{e.doseAmount}</td>
            <td style={{wordBreak:"break-word"}}>{e.frequency}</td>
            <td style={{wordBreak:"break-word"}}>{e.time}</td>
            {/* <td style={{wordBreak:"break-word"}}>{e.startDate != null && $AHelper.getFormattedDate(e.startDate)}</td> */}
            {/* <td style={{wordBreak:"break-word"}}>{e.endDate != null && $AHelper.getFormattedDate(e.endDate)}</td> */}
            <td style={{wordBreak:"break-word"}}>{e.doctorPrescription}</td>
            </tr>
            </>
          ))}
          </tbody>
        </Table>}</div>
{ (  this.state.selectContacttype== this.state.spouseUserId || this.state.selectContacttype == this.state.userId) &&     <div>Add Medications : <UserMedication UserDetail={{userId:this.state.selectContacttype,medicationCallfun:this.medicationCallfun}}  /></div>
}        </Row>

                        <Row className=''>
                            <Col >
                                <hr className='ms-3 me-3 hr-tag-class' />
                            </Col>
                        </Row>

                        <Row className=''>
                            <Col md="4" lg="4" className='' >
                                <div>
                                    <ul className='d-sm ps-3'>
                                        <li className='li-heading-class'>Emergency Contacts*</li>
                                        <li className='li-sub-heading-class'>Select recipient emergency contacts</li>
                                    </ul>
                                </div>
                            </Col>
                            <Col md="8" lg="8" className='pt-2 pb-2 bg-light'>
                                <div className='me-3'>
                                    <Row>
                                        <Col md="1" lg="1" className=' m-0 p-0 d-flex justify-content-center align-items-center'>
                                            <div className=' d-flex justify-content-end align-items-center'>
                                                <img src="icons/search-icon.svg" className='m-0 p-0' />
                                            </div>
                                        </Col>
                                        <Col md="" className='m-0 p-0'>
                                            <Form.Control type="text" placeholder="Search Emergency Contacts" className='m-0 p-0 border-0 fs-4 bg-light' style={{ color: "#B0B0B0;" }} onChange={(e)=>{this.setState({searchTxt:e.target.value})}}/>


                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row >

                                        <Col md="5" lg="5" className='d-flex justify-content-start align-items-center '>
                                            <div className='d-flex justify-content-start align-items-center gap-2 m-0 p-0'>
                                                <div className='m-0 p-0'>
                                                    <h6 className='m-0 p-0 emergrncy-tag-h6'>Emergency Contacts</h6>
                                                </div>
                                                <div className='d-flex justify-content-center align-items-center number-contact-div'>
                                                    <h6 className='m-0 p-0'>{this.state.emergencyContact.length > 0 ?  this.state.emergencyContact.filter((e)=> {return e.userId != this.state.selectContacttype}).length: 0}</h6>
                                                </div>
                                            </div>
                                        </Col>


                                    </Row>
                                    <hr />
                                    <div style={{ height: "170px", overflow: "auto", overflowX: "hidden", paddingRight: "5px" }}>
                                        {this.filterEmergency()?.map((data, index) => (
                                            <div key={index}>
                                                <Row className='mb-4'>
                                                    <Col xs="2" sm="2" md="1" lg="1" className='d-flex justify-content-center'>
                                                        <div className=''>
                                                            <Form.Check
                                                                inline
                                                                className="ms-4"
                                                                type="checkbox"
                                                                onChange={()=>this.handleEmergencyContacts(data)}
                                                                checked={data?.isEmergencyShow}
                                                            />
                                                        </div>                                                    </Col>
                                                    <Col  xs="10" sm="10" md="11" lg="11">
                                                        <Row>
                                                            <Col xs="2" sm="2" md="1" lg="1" className=' d-flex justify-content-start m-0 p-0'  >
                                                                <div >
                                                                    <img src="/icons/ProfilebrandColor2.svg" className='w-75 m-0 p-0' alt="user" />
                                                                </div>
                                                            </Col>
                                                            <Col xs="10" sm="10" md="11" lg="11" >
                                                                <Row className='mt-2'>
                                                                    <Col md="7" lg="7" className='d-sm pb-1'>
                                                                        <div>
                                                                            <h6 className='contact-name-tag-h6 upperCasing'>
                                                                                {data?.fName+ " "+ data?.lName} {this.getEmergencyContactPriority(data?.emerContactPriorityId)}

                                                                            </h6>
                                                                        </div>
                                                                    </Col>
                                                                    <Col md="5" lg="5" className='emergencyView d-sm pb-1'>
                                                                        <div>
                                                                            <h6 className='Relationship-tag-h6'>
                                                                                Relationship: <span className='Neighbour-tah-span'>{data?.relationshipName}</span>
                                                                            </h6>
                                                                        </div>
                                                                    </Col>

                                                                </Row>
                                                                <Row className='d-md-mt-3'>
                                                                    <Col md="7" lg="7" className='d-flex justify-content-start align-items-center d-sm pb-1'>
                                                                        <div className='d-flex justify-content-center align-items-center '>
                                                                            <h6 className='Relationship-tag-h6 text-truncate'>
                                                                                Email: <span className='Neighbour-tah-span '>{data?.contact?.contact?.emails[0]?.emailId ? data?.contact?.contact?.emails[0]?.emailId : 'Not available'}</span>
                                                                            </h6>
                                                                        </div>
                                                                    </Col>
                                                                    <Col md="5" lg="5" className='emergencyView d-sm pb-1'>
                                                                        <div>
                                                                            <h6 className='Relationship-tag-h6'>
                                                                                Phone: <span className='Neighbour-tah-span'> 
                                                                                {$AHelper.formatPhoneNumber(data?.contact?.contact?.mobiles[0]?.mobileNo.slice(-10))? 
                                                                                <>
                                                                                {$AHelper.newPhoneNumberFormat(data?.contact?.contact?.mobiles[0]?.mobileNo)}
                                                                                  {/* {$AHelper.pincodeFormatInContact(data?.contact?.contact?.mobiles[0]?.mobileNo) +" "+ $AHelper.formatPhoneNumber((data?.contact?.contact?.mobiles[0]?.mobileNo?.slice(0, 4) == "+254") ? data?.contact?.contact?.mobiles[0]?.mobileNo : data?.contact?.contact?.mobiles[0]?.mobileNo?.slice(-10))} */}
                                                                                </>
                                                                                : 'Not available'}     
                                                                                 </span>
                                                                            </h6>
                                                                        </div>
                                                                    </Col>


                                                                </Row>
                                                                
                                                                <Row className='d-md-mt-3'>
                                                                    <Col lg="12" className=' d-flex justify-content-start align-items-center'>
                                                                        <div className='d-flex justify-content-start '>
                                                                            <h6 className='Relationship-tag-h6'>
                                                                                Address:
                                                                            </h6>
                                                                            <span className='address-tag-span w-100 ms-1'>{data?.address?.addresses[0]?.addressLine1 ? data?.address?.addresses[0]?.addressLine1 : 'Not available'}</span>
                                                                        </div>
                                                                    </Col>

                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>

                                                </Row>
                                            </div>
                                        ))
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>


                        <Row className='mt-5'>
                            <Col xs="12" sm="12" md="4" lg="4" className='' >
                                <div>
                                    <ul className='d-sm ps-3'>
                                        <li className='li-heading-class'>Physicians*</li>
                                        <li className='li-sub-heading-class'>Select recipient physicians</li>
                                    </ul>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="8" lg="8" className='pt-2 pb-2 bg-light'>
                                <div className='me-3'>
                                    <hr />
                                    <Row >
                                        <Col md="5" lg="5" className='d-flex justify-content-start align-items-center '>
                                            <div className='d-flex justify-content-start align-items-center gap-2 m-0 p-0'>
                                                <div className='m-0 p-0'>
                                                    <h6 className='m-0 p-0 emergrncy-tag-h6'>Physicians</h6>
                                                </div>
                                                <div className='d-flex justify-content-center align-items-center number-contact-div'>
                                                    <h6 className='m-0 p-0'>{PhysiciansData.length}</h6>
                                                </div>
                                            </div>
                                        </Col>

                                    </Row>
                                    <hr />
                                    {konsole.log(PhysiciansData,"PhysiciansData")}
                                    <div style={{ height: "170px", overflow: "auto", overflowX: "hidden", paddingRight: "5px" }}>
                                        {PhysiciansData.map((data, index) => {
                                            konsole.log(data, "data.isEmergencyPhysicianshow")
                                            return (
                                                <Row className='mb-4'>
                                                    <Col xs="2" sm="2" md="1" lg="1" className='d-flex justify-content-center'>
                                                        <div className=''>
                                                            <Form.Check
                                                                inline
                                                                className="ms-4"
                                                                type="checkbox"
                                                                onChange={()=>{
                                                                    data['isEmergencyPhysicianshow'] = !data.isEmergencyPhysicianshow
                                                                    let objs={
                                                                        "emergencyPhysicianId": data?.emergencyPhysicianId,
                                                                        "emergencyPhysicianUserId": data?.professionalUserId,
                                                                        "isActive": data?.isEmergencyPhysicianshow,
                                                                        "isEmergencyPhysicianshow":(!data.isEmergencyPhysicianshow)
                                                                      }
                                                                    this.setState({selectphysicalemergeny:[...this.state.selectphysicalemergeny,objs]})}}
                                                                checked={data?.isEmergencyPhysicianshow  ? data?.isEmergencyPhysicianshow  : this.state.selectphysicalemergeny.length > 0 && this.state.selectphysicalemergeny[0]?.emergencyPhysicianUserId == data?.professionalUserId && data?.isEmergencyPhysicianshow == true ? true : false}
                                                                // checked={this.state.selectphysicalemergeny.length > 0 && this.state.selectphysicalemergeny[0]?.emergencyPhysicianUserId == data?.professionalUserId ? true : data.isEmergencyPhysicianshow}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col xs="10" sm="10" md="11" lg="11">
                                                        <Row>
                                                            <Col xs="2" sm="2" md="1" lg="1" className=' d-flex justify-content-start m-0 p-0'  >
                                                                <div >
                                                                    <img src="/icons/ProfilebrandColor2.svg" className='w-75 m-0 p-0' alt="user" />
                                                                </div>
                                                            </Col>
                                                            <Col xs="10" sm="10" md="11" lg="11" >
                                                                <Row className='mt-2'>
                                                                    <Col md="7" lg="7" className='d-sm pb-1'>
                                                                        <div>
                                                                            <h6 className='contact-name-tag-h6'>
                                                                                {$AHelper.capitalizeAllLetters(data?.fName + `${" "}` + `${data?.mName ? data?.mName : ""}` + `${" "}` + data?.lName)}

                                                                            </h6>
                                                                        </div>
                                                                    </Col>
                                                                    <Col md="5" lg="5" className='emergencyView d-sm pb-1'>
                                                                        <div>
                                                                            <h6 className='Relationship-tag-h6'>
                                                                                Speciality: <span className='Neighbour-tah-span'>{data?.proType}</span>
                                                                            </h6>
                                                                        </div>
                                                                    </Col>

                                                                </Row>
                                                                <Row className='d-md-mt-3'>
                                                                    <Col md="7" lg="7" className='d-flex justify-content-start align-items-center d-sm pb-1'>
                                                                        <div className='d-flex justify-content-center align-items-center '>
                                                                            <h6 className='Relationship-tag-h6'>
                                                                                Email: <span className='Neighbour-tah-span '>{data?.emaidIds ? data?.emaidIds : 'Not available'}</span>
                                                                            </h6>
                                                                        </div>
                                                                    </Col>
                                                                    <Col md="5" lg="5" className='emergencyView d-sm pb-1'>
                                                                        <div>
                                                                            <h6 className='Relationship-tag-h6'>
                                                                                Phone: <span className='Neighbour-tah-span'>
                                                                                    {$AHelper.formatPhoneNumber(data?.mobileNumbers?.slice(-10))?
                                                                                    <>
                                                                                    {$AHelper.newPhoneNumberFormat(data?.mobileNumbers)}
                                                                                        {/* {$AHelper.pincodeFormatInContact(data?.mobileNumbers) +" "+ $AHelper.formatPhoneNumber((data?.mobileNumbers?.slice(0, 4) === "+254") ? data?.mobileNumbers : data?.mobileNumbers?.slice(-10))} */}
                                                                                    </>
                                                                                    : 'Not available'}
                                                                                    </span>
                                                                            </h6>
                                                                        </div>
                                                                    </Col>


                                                                </Row>
                                                                <Row className='d-md-mt-3'>
                                                                    <Col lg="12" className=' d-flex justify-content-start align-items-center'>
                                                                        <div className='d-flex justify-content-start '>
                                                                            <h6 className='Relationship-tag-h6'>
                                                                                Address:
                                                                            </h6>
                                                                            
                                                                            <span className='address-tag-span w-100 ms-1'>{data.address?.addresses[0]?.addressLine1 ? data.address?.addresses[0]?.addressLine1 : 'Not available'}</span>
                                                                        </div>
                                                                    </Col>

                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>

                                                </Row>
                                            )

                                        })}



                                    </div>
                                </div>
                            </Col>
                        </Row>


                        <Row className='mt-5'>
                            <Col xs="12" sm="12" md="6" lg="6" className='' >
                                <div>
                                    <ul className='d-sm ps-3'>
                                        <li className='li-heading-class'>Medical Conditions</li>
                                    </ul>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="6" lg="6" >
                                <div className='pe-3'>
                                    <textarea className='w-100 ps-2' rows="9" cols="50" placeholder='What medical condition should EMT’s know about?' style={{ border: "1px solid #ced4da" }} onChange={(e) => { this.setState({ medicalConditions: e.target.value }) }} value={this.state.medicalConditions} />
                                </div>
                            </Col>
                        </Row>

                        <Row className='d-xs-none mt-5 mb-5  '>
                            <Col className=''>
                                <Row>
                                    <Col md="4" lg="3" className='pb-1 w-50'>
                                        <div className='d-flex  align-items-center gap-2 radio-class'>
                                            <span className='w-50'>Organ Donor:</span>
                                            <Form.Check
                                                // inline
                                                className="d-flex align-items-center ms-1 roaio-inner-class w-25"
                                                type="radio"
                                                label="Yes"
                                                name="isOrganDonor"
                                                onChange={() => this.setState({ isOrganDonor: true })}
                                                checked={this.state.isOrganDonor == true}
                                            />
                                            <Form.Check
                                                // inline
                                                className="d-flex align-items-center roaio-inner-class w-25"
                                                type="radio"
                                                label="No"
                                                name="isOrganDonor"
                                                onChange={() => this.setState({ isOrganDonor: false })}
                                                checked={this.state.isOrganDonor == false}
                                            />
                                        </div>
                                    </Col>
                                    </Row>
                                    <Row>
                                    <Col md="4" lg="4" className=' mt-3 w-50'>
                                        <div className='d-flex  align-items-center gap-2  radio-class'>
                                            <span className='w-50'>Dependents At Home:</span>
                                            <Form.Check
                                                // inline
                                                className="d-flex align-items-center ms-1 roaio-inner-class w-25"
                                                type="radio"
                                                label="Yes"
                                                name="isDependentsHome"
                                                onChange={() => this.setState({ isDependentsHome: true })}
                                                checked={this.state.isDependentsHome == true}
                                            />
                                            <Form.Check
                                                // inline

                                                className="d-flex align-items-center ms-1 roaio-inner-class w-25"
                                                type="radio"
                                                label="No"
                                                name="isDependentsHome"
                                                onChange={() => this.setState({ isDependentsHome: false })}
                                                checked={this.state.isDependentsHome == false}
                                            />
                                        </div>
                                    </Col>
                                   
                                    </Row>
                                    <Row>
                                    <Col md="4" lg="12" className=' mt-3 d-flex w-100 '>
                                        <div lg='6' className='d-flex align-items-center radio-class w-50'>
                                            <span className='w-50'>Pets At Home:</span>
                                            <Form.Check
                                                className="d-flex align-items-center  roaio-inner-class w-25"
                                                type="radio"
                                                label="Yes"
                                                name="isPetsAtHome"
                                                onChange={() => this.setState({ isPetsAtHome: true })}
                                                checked={this.state.isPetsAtHome == true}
                                            />
                                            <Form.Check
                                                className="d-flex align-items-center me-2 roaio-inner-class w-25"
                                                type="radio"
                                                label="No"
                                                name="isPetsAtHome"
                                                onChange={() => this.setState({ isPetsAtHome: false })}
                                                checked={this.state.isPetsAtHome == false}
                                            />
                                        </div>
                                        {this.state.isPetsAtHome == true&&<input lg='6' className='border' style={{width:"40%"}} value={this.state.petsAtHomeDesc} onChange={(e)=>{this.setState({petsAtHomeDesc:e.target.value})}} placeholder='Description' />}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <hr />

                        <Row className='mt-5 mb-5'>
                            <Col md="6" lg="6" className='' >
                                <div>
                                    <ul className='d-sm ps-3'>
                                        <li className='li-heading-class'>Additional Information</li>
                                    </ul>
                                </div>
                            </Col>
                            <Col md="6" lg="6" >
                                <div className='pe-3'>
                                    <textarea className='w-100 ps-2' rows="9" cols="50" placeholder='Please enter additional information' style={{ border: "1px solid #ced4da" }} onChange={(e) => { this.setState({ addinationalInfo: e.target.value }) }} value={this.state.addinationalInfo} />
                                </div>
                            </Col>
                        </Row>

                        <hr />

                        <Row className='reverseEmergency' >
                        <Col >
                        {(this.state.selectContacttype == this.state.userId || this.state.selectContacttype == this.state.spouseUserId) && <SummaryDoc memberId={this.state.selectContacttype == this.state.userId ? this.state.userId : this.state.spouseUserId}  btnLabel="View Health Summary" modalHeader="Health Detail" component="Healthpage" />}
                        </Col>
                            <Col md='5' lg='5' className='justify-content-center'  style={{width:'100px'}}>
                                    <Button
                                        style={{ backgroundColor: "#76272b", border: "none", }}
                                        className="theme-btn"
                                        onClick={this.onFinish}
                                    // disabled={this.state.disable == true ? true : false}
                                    >
                                        Save
                                    </Button>
                            </Col>
                            <Col md="1" lg="1" className="d-flex justify-content-center align-items-center">
                                <div class="vertical-line"></div>
                            </Col>
                            <Col xs="12" sm="12" md="6" lg="6">
                                <div className='d-flex justify-content-start align-items-center gap-2 cursor-pointer' onClick={()=>this.displayEmergencyCardFunction()}>
                                    <div>
                                        <img src="/icons/emergency-card-img.svg" className='' />
                                    </div>
                                    <div className='d-flex  align-items-center cursor-pointer'>
                                        <h6 className='mt-2 sample-card-tag-h6' >View Emergency Card </h6>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        {(this.state.showEmergencyCard == true) && <EmergencyCard showEmergencyCard={this.state.showEmergencyCard} onClose={this.handleClose} selectEmergency={this.state.selectEmergency} selectContacttype={this.state.selectContacttype} selectallergytype={this.state.putAllergies} selectbloodtype={this.state.selectbloodtype} selectphysicalemergeny={this.state.selectphysicalemergeny} AllPhysician={this.state.AllPhysician} AllFamilyMembers={this.state.AllFamilyMembers} emergencyContact={this.state.emergencyContact} bloodType={this.state.bloodType} medicalConditions={this.state.medicalConditions} pinNumber={this.state.pinNumber} cardId={this.state.emergencyCardId} addressData={this.state.addressData} />}
                    </Col>
                </Row>}

            </div>
        );
    }
}




const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Emergencymain); 
