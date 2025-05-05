import ClientFormComponent from "./client-form-component/client-form-component";
// import AddtionalPhysicanComponent from "./addtional-physican-component/addtional-physican-component";
import HealthInsurencePlanComponent from "./Health-Insurence-Plan-Component/HealthInsurencePlanComponent";
import FamilyMedicalHistoryComponent from "./Family-Medical-History-Component/Family-Medical-History-Component";
import { useEffect, useState } from "react";
import Api from "../../helper/api";
import { health } from './../../../control/Constant'
import konsole from "../../../control/Konsole";
import CommProff from "../Housing-Information-Component/CommonProff";
import MedicationSum from "./medicationSum";
import { $AHelper } from "../../../control/AHelper";

const HealthInfoComponent = ({primaryUserId, spouseUserId,refrencePage}) => {
  const userId = (primaryUserId !== undefined && primaryUserId !== null && primaryUserId !== "")? primaryUserId : '';
  const spouseId = (spouseUserId !== undefined && spouseUserId !== null && spouseUserId !== "") ? spouseUserId : '';
  const primaryPhysicanDetails = "";
  const api = new Api();
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
  const [primaryPersonalMed, setprimaryPersonalMed] = useState([])
  const [spousePersonalMed, setspousePersonalMed] = useState([])

  let [addtionalPhysicanDetailsPrimary,setAddtionPhysicanDetailsPrimary]=useState([]);
  let [addtionalPhysicanDetailsSpouse,setAddtionPhysicanDetailsSpouse]=useState([]);
  let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))

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
            setPersonalLifestyle(res.data.data.userSubjects)
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
    <div className="container-fluid pt-3">
      <div className=" d-flex justify-content-center  title">
        <h1 class="h4 fw-bold generate-pdf-main-color">Health Information</h1>
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
      <div className="contain">
        <span className="head-2">
          Primary Care Physician
        </span>
      </div>
      <div className="contain">
        <span className="clientheading">
        {$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}
        </span>
      </div>
      {primaryCareMember && api && (
        <ClientFormComponent
          primaryCareMember={primaryCareMember}
          api={api}
        ></ClientFormComponent>
      )}
      <div className="contain">
        <span className="clientheading">
        {$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}
        </span>
      </div>
      {primarySpouseMember && api && (
        <ClientFormComponent
          primaryCareMember={primarySpouseMember}
          api={api}
        ></ClientFormComponent>
      )}
      <div className="container-fluid">
        <span className="h3 border-bottom border-danger fs-3" style={{color: '#720c20'}}  >
          Specialists
        </span>
      </div>
      <div className="container-fluid ">
        <p className="text-start lead fw-bold pt-2" style={{color: '#720c20'}}>
          Please provide the names and specialties of any additional healthcare
          providers. Use additional paper as necessary.
        </p>
      </div>
       {/* {
        addtionalPhysicanDetailsPrimary.length > 0 && <AddtionalPhysicanComponent memberUserId={userId} addtionalPhysicanDetails={addtionalPhysicanDetailsPrimary}></AddtionalPhysicanComponent> 
      } */}
      
       <CommProff api={api} memberId={userId} proTypeId={'11'} profName={"Specialist"} userDetailOfPrimary={$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}/> 
       <CommProff api={api} memberId={spouseId} proTypeId={'11'} profName={"Specialist"} userDetailOfPrimary={$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}/> 
      
      {
        // addtionalPhysicanDetailsSpouse.length > 0 && <AddtionalPhysicanComponent memberUserId={userId} addtionalPhysicanDetails={addtionalPhysicanDetailsSpouse}></AddtionalPhysicanComponent> 
      }
      
      

      {healthInsurence && <HealthInsurencePlanComponent healthInsurence={healthInsurence} secondhealthInsurance={secondhealthInsurance}></HealthInsurencePlanComponent>}
      
      

      {
         <FamilyMedicalHistoryComponent primaryPersonalMed={primaryPersonalMed} spousePersonalMed={spousePersonalMed} personalLifestyle={personalLifestyle} spouseMedicalHistory={spouseMedicalHistory} personalMedicalHistory={personalMedicalHistory}  spouseFamilyMedicalHistory={spouseFamilyMedicalHistory} familyMedicalHistory={familyMedicalHistory} userId={userId} spouseCurrentLifeStyle={spouseCurrentLifeStyle}></FamilyMedicalHistoryComponent>
      }
      <hr className="fw-bold text-danger"></hr>
       
      <div>
      <p className="Heading mt-3 mb-3 generate-pdf-main-color fs-5">Medication and Supplements</p>
      </div>   
      <div className="pt-2 mx-3">
       
        <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</h5>
      </div>
      <MedicationSum userId={userId}/>
      {spouseId && <>
      <div className="pt-1 mx-3">
        <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</h5>
      </div>
      <MedicationSum userId={spouseId}/>
      </>}

    </div>
  );
};

export default HealthInfoComponent;
