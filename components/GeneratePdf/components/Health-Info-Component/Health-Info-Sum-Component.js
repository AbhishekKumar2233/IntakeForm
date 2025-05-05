import ClientFormSumComponent from "./client-form-component/Client-Form-Sum-Component";
// import AddtionalPhysicanSumComponent from "./addtional-physican-component/Additional-Physician-Sum-Component";
import HealthInsurencePlanSumComponent from "./Health-Insurence-Plan-Component/HealthInsurancePlanSumComponent";
import FamilyMedicalSumHistoryComponent from "./Family-Medical-History-Component/Family-Medical-Sum-History-Component";
import { useEffect, useState } from "react";
import Api from "../../helper/api";
import { health } from '../../../control/Constant'
import konsole from "../../../control/Konsole";
import MedicationSum from "./medicationSum";
import CommProfSum from "../Housing-Information-Component/commProfSum";
import { $AHelper } from "../../../control/AHelper";

const HealthInfoSumComponent = ({primaryUserId, spouseUserId,refrencePage}) => {
  const userId = (primaryUserId !== undefined && primaryUserId !== null && primaryUserId !== "")? primaryUserId : '';
  const spouseId = (spouseUserId !== undefined && spouseUserId !== null && spouseUserId !== "") ? spouseUserId : '';
  const primaryPhysicanDetails = "";
  const api = new Api();
  let primaryuserId = sessionStorage.getItem('SessPrimaryUserId')
  const [primaryPersonalMed, setprimaryPersonalMed] = useState([])
  const [spousePersonalMed, setspousePersonalMed] = useState([])

  let [primaryCareMember, setPrimaryCareMember] = useState();
  let [primarySpouseMember, setPrimarySpouseMember] = useState();
  let [healthInsurence, setHealthInsurence] = useState();
  let[secondhealthInsurance, setsecondHealthInsurance] = useState();
  let [familyMedicalHistory,setFamilyMedicalHistory]=useState();
  let [spouseFamilyMedicalHistory,setSpouseFamilyMedicalHistory]=useState()
  let [spouseMedicalHistory,setSpouseMedicalHistory]=useState()
  let [personalMedicalHistory,setPersonalMedicalHistory]=useState()
  let [currentLifeStyle,setCurrentLifeStyle]=useState()
  let [spouseCurrentLifeStyle,setSpouseCurrentLifeStyle]=useState()

  let [personalLifestyle,setPersonalLifestyle]=useState()
  let [spouseLifestyle,setSpouseLifestyle]=useState()

  let [addtionalPhysicanDetailsPrimary,setAddtionPhysicanDetailsPrimary]=useState([]);
  let [addtionalPhysicanDetailsSpouse,setAddtionPhysicanDetailsSpouse]=useState([]);
  let userDetailOfPrimary = refrencePage == 'SummaryDoc' ? JSON.parse(sessionStorage.getItem('userDetailOfPrimary')) : primaryuserId == userId ?  {memberName:JSON.parse(sessionStorage.getItem("userDetailOfPrimary")).memberName} : {memberName:JSON.parse(sessionStorage.getItem("userDetailOfPrimary")).spouseName}

  const category1ID=1  //represents the categoryID used to fetch the current lifestyle
  let arr=[]
  

  useEffect(()=>{
    // console.log("YTYTYTYTYT",healthInsurence)
   
   

  },[])

  useEffect(() => {
    let tempSpecialCarePhysicans=[]
    if(userId !== ""){
      api.GetUserSubject(userId, 0, 2, 0)
        .then((res) => {
          if (res) {
            konsole.log("zdvgaszgh", res.data.data.userSubjects)
            setPersonalLifestyle(res?.data?.data?.userSubjects)
          }
        }).catch(error => {
          konsole.log("error", error.response);
        })
      api.GetUserSubject(userId, 0, 3, 0)
      .then((res) => {
        if (res) {
          setprimaryPersonalMed(res?.data?.data?.userSubjects)
        }
      }).catch(error => {
        konsole.log("error", error.response);
      })
        api.GetPrimaryCareMembersByPrimaryUserId(userId).then((res)=>{
          if(res){
            res.data.data.physicians.map((item)=>{
              if(item.is_Primary==false){
                tempSpecialCarePhysicans.push(item)
              }
            })
            setAddtionPhysicanDetailsPrimary(tempSpecialCarePhysicans)
          }
        }).catch((error)=>{
          konsole.log("error",error)
        })
      api.GetPrimaryCareMembersByPrimaryUserId(userId).then((res) => {
        if (res) {
          const primaryCareMemberUser = res?.data?.data?.physicians?.filter(ele => ele?.is_Primary_Care == true);
          // konsole.log("sdghagdhja", res, primaryCareMemberUser)
          setPrimaryCareMember(primaryCareMemberUser?.[0]);
        }
      }).catch(error => {
        konsole.log("error", error.response);
      })
      api.GetUserInsuranceByUserid(userId).then((res) => {
        if (res) {
          setHealthInsurence(res);
        }
      }).catch(error => {
        konsole.log("error", error.response);
      })

      api.GetUserInsuranceByUserid(spouseId).then((res) => {
        if (res) {
          setsecondHealthInsurance(res);
        }
      }).catch(error => {
        konsole.log("error", error.response);
      })
      
      api.UserMedHistoryByMedHisType(userId, 2)
        .then((res) => {
          if (res) {
            setFamilyMedicalHistory(res.data.data.userMedHistory)

          }
        }).catch(error => {
          konsole.log("error", error.response);
        })
      api.UserMedHistoryByMedHisType(userId,1)
         .then((res)=>{
           if(res){
            setPersonalMedicalHistory(res.data.data.userMedHistory)
           }
         }).catch((error)=>{
          konsole.log("error",error.response)
         })
    }
  }, [userId]);

  useEffect(()=>{
    let tempSpecialCarePhysicans = [];
    if(spouseId !== ""){
      api.GetUserSubject(spouseId, 0, 2, 0)
        .then((res) => {
          if (res) {
            setSpouseCurrentLifeStyle(res.data.data.userSubjects)
          }
        }).catch(error => {
          konsole.log("error", error.response);
        })
      api.GetUserSubject(spouseId, 0, 3, 0)
      .then((res) => {
        if (res) {
          setspousePersonalMed(res?.data?.data?.userSubjects)
        }
      }).catch(error => {
        konsole.log("error", error.response);
      })
      konsole.log("123qweasdzxc",spouseLifestyle)
      api.GetPrimaryCareMembersByPrimaryUserId(spouseId).then((res) => {
        if (res) {
          const primaryCareMemberUser = res?.data?.data?.physicians?.filter(ele => ele?.is_Primary_Care == true);
          // konsole.log("sdghagdhja", res, primaryCareMemberUser)
          setPrimarySpouseMember(primaryCareMemberUser?.[0]);
        }
      }).catch(error => {
        konsole.log("error", error.response);
      })
      api.UserMedHistoryByMedHisType(spouseId, 2).then((res) => {
        if (res) {
          setSpouseFamilyMedicalHistory(res.data.data.userMedHistory)
        }
      }).catch(error => {
        konsole.log("error", error.response);
      })
      api.UserMedHistoryByMedHisType(spouseId,1).then((res)=>{
        if(res){
          setSpouseMedicalHistory(res.data.data.userMedHistory)
        }
      }).catch((error)=>{
        konsole.log("error",error.response)
      })
      api.GetPrimaryCareMembersByPrimaryUserId(spouseId).then((res)=>{
        if(res){
          res.data.data.physicians.map((item)=>{
            if(item.is_Primary==false){
              tempSpecialCarePhysicans.push(item)
            }
          })
          setAddtionPhysicanDetailsSpouse(tempSpecialCarePhysicans)
        }
      }).catch((error)=>{
        konsole.log("error",error)
      })
    }
  },[spouseId])

  return (
    <div className="container-fluid">
      <div className=" d-flex justify-content-start" style={{borderBottom:"2px solid #E8E8E8"}}>
        <h1 className="health_Info_h1 pb-3">Health Information</h1>
      </div>
      {(refrencePage !="SummaryDoc") && 
      <div>
        <p className="para-p1 pb-1">
          Please provide information for each of your healthcare providers. This
          information supplies a frame of reference when creating a coordinated
          LifePlan with regards to Health Issues in retirement.
        </p>
      </div>
      }
      <div className="ps-3">
       <ul className="ps-0 pt-3"><li className="head-2">Primary Care Physician</li></ul> 
      </div>
      <div className=" ms-1 d-flex gap-2 pb-3" style={{borderBottom:"2px solid #E8E8E8"}}>
        <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
        <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</h5>
      </div>
      {(primaryCareMember && api) ? (
        <ClientFormSumComponent
         primaryCareMember={primaryCareMember}
         api={api}>
        </ClientFormSumComponent>
      ) : <p className="mx-3"> (Not provided) </p>}

      {spouseId && <><div>
      <div className="ms-1 d-flex gap-2 pb-4 pt-3" style={{borderBottom:"2px solid #E8E8E8"}}>
        <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
        <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</h5>
      </div>
      </div>
      {(primarySpouseMember && api) ? (
        <ClientFormSumComponent
          primaryCareMember={primarySpouseMember}
          api={api}
        ></ClientFormSumComponent>
      ) : <p className="mx-3"> (Not provided) </p>}
      </>}

      <div className="ps-4">
       <ul className="ps-0 pt-3"><li className="head-2">Specialists</li></ul> 
      </div>

      <div className="ms-3 d-flex gap-2" style={{borderBottom:"2px solid #E8E8E8"}}>
        {/* <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
        <h5 className="healthPrimary">{userDetailOfPrimary.memberName}</h5> */}
      </div>
      {userDetailOfPrimary.memberName && <CommProfSum api={api} memberId={userId} proTypeId={'11'} profName={"Specialist"} userDetailOfPrimary={userDetailOfPrimary.memberName} />}
      {userDetailOfPrimary.spouseName && <CommProfSum api={api} memberId={spouseId} proTypeId={'11'} profName={"Specialist"}  userDetailOfPrimary={userDetailOfPrimary.spouseName} />}

      <HealthInsurencePlanSumComponent healthInsurence={healthInsurence} secondhealthInsurance={secondhealthInsurance} userDetailOfPrimary={userDetailOfPrimary}></HealthInsurencePlanSumComponent>
      
      

      {
         <FamilyMedicalSumHistoryComponent primaryPersonalMed={primaryPersonalMed} spousePersonalMed={spousePersonalMed} personalLifestyle={personalLifestyle} spouseMedicalHistory={spouseMedicalHistory} personalMedicalHistory={personalMedicalHistory}  spouseFamilyMedicalHistory={spouseFamilyMedicalHistory} familyMedicalHistory={familyMedicalHistory} userId={userId} spouseCurrentLifeStyle={spouseCurrentLifeStyle} userDetailOfPrimary={$AHelper.capitalizeAllLetters(userDetailOfPrimary)}></FamilyMedicalSumHistoryComponent>
      }
      {/* <hr className="fw-bold text-danger"></hr> */}

      {/* <div className="pt-5 d-flex justify-content-start" style={{borderBottom:"2px solid #E8E8E8", margin:"0px 10px"}}>
        <h1 className="health_Info_h1 pb-3">Medications</h1>
      </div>   */}
      <div>
      <ul className="pt-3"><li className="head-2">Medication and Supplements </li></ul>
      </div>    
      <div className="pt-2 mx-3">
        {/* <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/> */}
        <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</h5>
      </div>
      <MedicationSum userId={userId}/>
      {spouseId && <>
      <div className="pt-1 mx-3">
        {/* <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/> */}
        <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</h5>
      </div>
      <MedicationSum userId={spouseId}/>
      </>}
    </div>
  );
};

export default HealthInfoSumComponent;
