import React, { useEffect, useState } from "react";
import konsole from "./control/Konsole";
import { $CommonServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";

const Emergencydata = ({cardData,primaryUserId}) => {
    const[userData,setUserdata] = useState([])
    const[emergencyContacts,setEmergencyContacts]=useState([])
    const[UserIssuanceDetails,setUserIssuanceDetails]=useState([])
    const[AllPhysician,setAllPhysician] =useState([])

    useEffect(()=>{
    getmemberdata(cardData.userId)
    getmemberfamily(primaryUserId)
    GetUserIssuance(primaryUserId)
    fetchAndDisplaySearchList(primaryUserId)
        },[])

        const getmemberdata = (userId) => {
            $CommonServiceFn.InvokeCommonApi('GET',$Service_Url.getFamilyMemberbyID+userId,'',(response,error) => {
                if(response){
                    konsole.log(response,"responseuser")
                    // setUserdata(response.data.data.member)
                
                        setUserdata(response.data.data.member)

                }
            })
        }
        const getmemberfamily = (userId) => {
            $CommonServiceFn.InvokeCommonApi('GET',$Service_Url.getFamilyMembers+userId,'',(response,error) => {
                if(response){
                    konsole.log(response,"responseusergetFamilyMembers")
                    response.data.data.map((data)=>{

                    cardData.emergencyContacts.map((e)=>{
                    if((data.userId == e.emergencyContactUserId)&&data.isEmergencyContact==true){
                        setEmergencyContacts((emergencyContacts)=>[...emergencyContacts,data])
                        getcontactdeailswithOthger(e.emergencyContactUserId)
                        fetchSavedAddress(e.emergencyContactUserId)
                    }else if(cardData.userId == userId){
                        setUserdata(response.data.data.member)

                    }
                    })
                })
                }
            })
        }


        const getcontactdeailswithOthger = (userIds) => {
            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getcontactdeailswithOther + userIds, "", (response, error) => {
                if (response) {
                    konsole.log("getcontactdeailswithOtherres", response?.data?.data,userIds)
                    let responseData = response?.data?.data
                    let myNewArray = [...emergencyContacts]
                    let arrFindIndex = myNewArray?.findIndex(({ userId }) => userId == userIds)
                    myNewArray[arrFindIndex]['contact'] = responseData
                    setEmergencyContacts(myNewArray )

                } else {
                    konsole.log("getcontactdeailswithOthererr", response)
                }
            })
        }

        const fetchSavedAddress = (userIds) => {
            
            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAllAddress + userIds,
                "", (response) => {
                    if (response) {
                        konsole.log("resposejjAddress", response.data.data)
                        let myNewArray = [...emergencyContacts]

                        let arrFindIndex = myNewArray?.findIndex(({ userId }) => userId == userIds)
                        myNewArray[arrFindIndex]['address'] = response.data.data
                        konsole.log("resposejjAddress", myNewArray,response.data.data)

                        setEmergencyContacts(myNewArray )
                    }
                    else {
                        //   this.toasterAlert(Msg.ErrorMsg,"Warning")
                    }
                })
        }

        const GetUserIssuance = (userId) => {
            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserInsurance + userId, "", (response) => {
            if (response) {
                konsole.log("getUserIns", response);
                setUserIssuanceDetails(response.data.data);
            } else {
                setUserIssuanceDetails([]);
            }
            }
            );
        };

        const fetchAndDisplaySearchList = (userid) => {
            const userId = userid || this.state.userId;
            const sendData = `?MemberUserId=${userId}&ProTypeId=${10}&primaryUserId=${userId}`
            // this.props.dispatchloader(true);
            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSearchProfessional + sendData, "", (response, error) => {
                // this.props.dispatchloader(false);
                if (response) {
                    konsole.log('nsedsdsdsddsrejkjkjspon', response)
                    setAllPhysician(response.data.data)

                fetchSavedAddress(userId)
                } else {
                    konsole.log("errorMemberPhysician", error)
                }
            }
            );
        };
        
return(
       <>
       <h2>Personal Information:</h2>

       <p>Full Name</p>
       <p>{userData.fName+' '+userData.lName}</p>
       <p>Date of Birth</p>
       <p>{userData.dob}</p>
       <p>Gender</p>
       <p>{userData.genderId}</p>
       <p>Blood Type</p>
       <p>{cardData.bloodTypeId}</p>
       <h2>Emergency Contacts:</h2>
        {konsole.log(emergencyContacts,"emergencyContacts")}
       {emergencyContacts.map((e)=>(
        <div>
            <p>{e.fName}</p>
            <p>{e.relationshipName}</p>
            
        </div>
       ))}
       <h2>Medical Conditions:</h2>
       {cardData.medicalConditions}
        <h2>Insurance Information:</h2>
        <h2>Physicians:</h2>
        {konsole.log(AllPhysician,"AllPhysician")}
        {AllPhysician.map((e)=>(
            <p>{e.fName}</p>
        ))}
       </>
        
    )
    
}
export default Emergencydata;