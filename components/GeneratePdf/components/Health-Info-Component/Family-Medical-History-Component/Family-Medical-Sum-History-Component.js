import Api from "../../../helper/api";
import { useEffect, useMemo, useState } from "react";
import konsole from "../../../../control/Konsole";
import { $CommonServiceFn } from "../../../../network/Service";
import { $Service_Url } from "../../../../network/UrlPath";
import { $AHelper } from "../../../../control/AHelper";



const FamilyMedicalSumHistoryComponent = (props) => {
  const personalLifeStyle = (props.personalLifestyle !== undefined) ? props.personalLifestyle : [];
  const spouseCurrentLifeStyle = (props.spouseCurrentLifeStyle !== undefined) ? props.spouseCurrentLifeStyle : [];
  const familyMedicalHistory = props.familyMedicalHistory != undefined ? props.familyMedicalHistory.filter(idChecked) : []
  const familyMedicalHistoryNonSuffering = props.familyMedicalHistory != undefined ? props.familyMedicalHistory.filter(idCheckedFalse) : [];
  const spouseFamilyMedicalHistoryNonSuffering = props.spouseFamilyMedicalHistory !== undefined ? props.spouseFamilyMedicalHistory.filter(idCheckedFalse) : [];
  const personalMedicalHistory=props.personalMedicalHistory!=undefined?props.personalMedicalHistory:[]
  const spouseMedicalHistory=props.spouseMedicalHistory!=undefined?props.spouseMedicalHistory:[]
  const personalFamilyMedicalHistory= props.familyMedicalHistory !== undefined? props.familyMedicalHistory.filter(idChecked): [];
  const spouseFamilyMedicalHistory = props.spouseFamilyMedicalHistory !== undefined ? props.spouseFamilyMedicalHistory.filter(idChecked): [];

  const personalFatherMedicalHistory= personalFamilyMedicalHistory.length > 0 && personalFamilyMedicalHistory.filter((medHis)=> {return medHis.relationshipId == 9 })
  const personalMotherMedicalHistory= personalFamilyMedicalHistory.length > 0 && personalFamilyMedicalHistory.filter((medHis)=> {return medHis.relationshipId == 10 })
  const personalSiblingDisease= personalFamilyMedicalHistory.length > 0 && personalFamilyMedicalHistory.filter((medHis)=> {return medHis.relationshipId == 11 })

  const spouseFatherMedicalHistory= spouseMedicalHistory.length > 0 && spouseMedicalHistory.filter((medHis)=> {return medHis.relationshipId == 9 })
  const spouseMotherMedicalHistory= spouseMedicalHistory.length > 0 && spouseMedicalHistory.filter((medHis)=> {return medHis.relationshipId == 10 })
  const spouseSiblingDisease= spouseMedicalHistory.length > 0 && spouseMedicalHistory.filter((medHis)=> {return medHis.relationshipId == 11 })
 
  const primaryPersonalMed = props?.primaryPersonalMed || {};
  const spousePersonalMed = props?.spousePersonalMed || {};
 
  
// --------------------------------------------------------------------------------------------------------------------------------------
  function GetUserExerciseHabbit(arr)
  {
    for(let i=0;i<arr.length;i++){
      if(arr[i].questionId==5){
        if (arr[i].response!=null){
          return arr[i].response
        }
      }
    }
  }
  function NumberOfAlcoholicDrinksPerWeek(arr){
    if(arr==null || arr==undefined){
      return 0
    }
    for(let i=0;i<arr.length;i++){
      if(arr[i].questionId==94){
        return arr[i].response
      }
    }
    return 0
  }
// -----------------------------------------------------------------------------------------------------------------------------------------

  
  const userId = (props.userId !== '' && props.userId !== null)? props?.userId: '';
  let currentLifestyle=props.currentLifestyle!=null? props?.currentLifestyle:[]
  konsole.log("current Lifestyle",currentLifestyle)
  konsole.log("after current lifestyle",props.spouseFamilyMedicalHistory)
  const fatherId=9
  const motherId=10
  const siblingId=11
  const personalMedicalTypeId=1
  const [Alzheimer,Parkinson,HeartDisease,Stroke,Diabetes,BloodPressureIssues,ElevatedCholesterol,Glaucoma]=[1,2,3,4,5,6,7,8]
  const api = new Api();

  // let personalMedicalHistory=null
  // let spouseMedicalHistory=null

  const [varCursedByParkinson,setVarCursedByParkinson]=useState()
  const [varCursedByAlzheimer,setVarCursedByAlzheimer]=useState()
  const [varHeartDeasese,setVarHeartDeasese]=useState()
  const [varCursedByStroke,setVarCursedByStroke]=useState()
  const [varCursedByDiabetes,setVarCursedByDiabetes]=useState()
  const [varCursedByBloodPressureIssues,setVarCursedByBloodPressureIssues]=useState()
  const [varCursedByElevatedCholesterol,setVarCursedByElevatedCholesterol]=useState()
  const [varCursedByGlaucoma,setVarCursedByGlaucoma]=useState()
  const [bloodTypes,setBloodTypes]=useState([])
  const[weekExerciseResponseForPrimary,setWeekExerciseResponseForPrimary]=useState("")
  const[weekExerciseResponseForSpouse,setWeekExerciseResponseForSpouse]=useState("")
  const[onscaleResponseForPrimary,setonscaleResponseForPrimary]=useState("")
  const[onscaleResponseForSpouse,setonscaleResponseForSpouse]=useState("")
  let userDetailOfPrimary=props?.userDetailOfPrimary


  useEffect(()=>{
    api.UserMedHistoryByMedHisType(userId,personalMedicalTypeId)
    .then((res)=>{
      if(res){
        let personalMedicalHistory = res.data.data.userMedHistory
        setVarCursedByParkinson(cursedByParkinson())
        setVarCursedByAlzheimer(cursedByAlzheimer())
        setVarHeartDeasese(cursedByHeartDisease())
        setVarCursedByStroke(cursedByStroke())
        setVarCursedByDiabetes(cursedByDiabetes())
        setVarCursedByBloodPressureIssues(cursedByBloodPressureIssues())
        setVarCursedByElevatedCholesterol(cursedByElevatedCholesterol())
        setVarCursedByGlaucoma(cursedByGlaucoma())
        konsole.log('18', personalMedicalHistory)
        konsole.log("Blood Pressure Issue", cursedByDesese(personalMedicalHistory, BloodPressureIssues))
      }
    })
    .catch(error => konsole.log("apiError2", error));
    setFreqExercise(currentLifestyle[0])
    setAtAhealthyWeigth(currentLifestyle[1])
    setRegularCheckups(currentLifestyle[2])
    setWorryAboutHealth(currentLifestyle[3])
    setDailySocalInteractions(currentLifestyle[4])
    setPurposeAfterRetirement(currentLifestyle[5])
    setdrugUse(currentLifestyle[6])
    setSmoke(currentLifestyle[7])
    setConsumeAlcohol(currentLifestyle[8])
    setLongDoYouExcercise(currentLifestyle[9])
    setAlcoholicDrinksPerWeek(currentLifestyle[10])
    setAlcoholType(currentLifestyle[11])






  })
  
  useEffect(() => {
    api.getBloodTypes().then((res) => setBloodTypes(res?.data?.data || [])).catch((err) => {});
  }, [])
  useEffect(()=>{
    commonFunctionForExerciseResponse()
  },[spouseCurrentLifeStyle,personalLifeStyle])

  
//-----------------------------------------variables for current lifestyle-----------------------------------------------------------
const [atAhealthyWeigth,setAtAhealthyWeigth]=useState({})
const [freqExersice,setFreqExercise]=useState({})
const [regularCheckups,setRegularCheckups]=useState({})
const [goodEatingHabbits,setGoodEatingHabbits]=useState({})
const [worryAboutHealth,setWorryAboutHealth]=useState({})
const [dailySocalInteractions,setDailySocalInteractions]=useState({})
const [drugUse,setdrugUse]=useState({})
const [alcoholType,setAlcoholType]=useState({})
const [alcoholicDrinksPerWeek,setAlcoholicDrinksPerWeek]=useState({})
const [smoke,setSmoke]=useState({})
const [consumeAlcohol,setConsumeAlcohol]=useState({})
const [longDoYouExcercise,setLongDoYouExcercise]=useState({})
const [quitSmoking,setSmoking]=useState({})
const [purposeAfterRetirement,setPurposeAfterRetirement]=useState({})
//-------------------------------------------------------------variables for current lifestyle for spouse---------------
const [spouseAtAhealthyWeigth,setSpouseAtAhealthyWeigth]=useState({})
const [spouseFreqExersice,setspouseFreqExersice]=useState({})
const [spouseRegularCheckups,setSpouseRegularCheckups]=useState({})
const [spouseGoodEatingHabbits,setSpouseGoodEatingHabbits]=useState({})
const [spouseWorryAboutHealth,setSpouseWorryAboutHealth]=useState({})
const [spouseDailySocalInteractions,setSpouseDailySocalInteractions]=useState({})
const [spouseDrugUse,setSpouseDrugUse]=useState({})
const [spouseAlcoholType,setSpouseAlcoholType]=useState({})
const [spouseAlcoholicDrinksPerWeek,setSpouseAlcoholicDrinksPerWeek]=useState({})
const [spouseSmoke,setSpouseSmoke]=useState({})
const [spouseConsumeAlcohol,setSpouseConsumeAlcohol]=useState({})
const [spouseLongDoYouExcercise,setSpouseLongDoYouExcercise]=useState({})
const [spouseQuitSmoking,setSpouseSmoking]=useState({})
const [spousePurposeAfterRetirement,setSpousePurposeAfterRetirement]=useState({})
//-----------------------------------------FUNCTIONS FOR GETTING PERSONAL MEDICAL HISTORY-----------------------------------------------

function cursedByDesese(arr,deseseId){
  if(arr===null || arr===undefined){
    return false
  }
  let trueCount=0
  let falseCount=0
  for(let i=0;i<arr.length;i++){
    if(arr[i].diseaseId ===deseseId){
      if(arr[i].isSuffering===true){
        trueCount=trueCount+1
      }
      else{
        falseCount=falseCount+1
      }
    }
  }
  if(trueCount<=falseCount){
    return false
  }
  return true
}

function cursedByParkinson(){

  if(personalMedicalHistory===null || personalMedicalHistory===undefined){
    return false
  }
  let yes=0
  let no=0
  for(let i=0;i<personalMedicalHistory.length;i++){
    if(personalMedicalHistory[i].diseaseId ===Parkinson){
      if(personalMedicalHistory[i].isSuffering===true){
        yes+=1
      }
      else{
        no+=1
      }
    }
  }
  if(yes<=no){
    return false
  }
  return true
}
function cursedByAlzheimer(){
  if(personalMedicalHistory===null || personalMedicalHistory===undefined){
    return false
  }
  let yes=0
  let no=0
  for(let i=0;i<personalMedicalHistory.length;i++){
    if(personalMedicalHistory[i].diseaseId ===Alzheimer){
      if(personalMedicalHistory[i].isSuffering===true){
        yes+=1
      }
      else{
        no+=1
      }
    }
  }
  if(yes<=no){
    return false
  }
  return true
}
function cursedByHeartDisease(){
  if(personalMedicalHistory===null || personalMedicalHistory===undefined){
    return false
  }
  let yes=0
  let no=0
  for(let i=0;i<personalMedicalHistory.length;i++){
    if(personalMedicalHistory[i].diseaseId ===HeartDisease){
      if(personalMedicalHistory[i].isSuffering===true){
        yes+=1
      }
      else{
        no+=1
      }
    }
  }
  if(yes<=no){
    return false
  }
  return true
}
function cursedByStroke(){
  if(personalMedicalHistory===null || personalMedicalHistory===undefined){
    return false
  }
  let yes=0
  let no=0
  for(let i=0;i<personalMedicalHistory.length;i++){
    if(personalMedicalHistory[i].diseaseId ===Stroke){
      if(personalMedicalHistory[i].isSuffering===true){
        yes+=1
      }
      else{
        no+=1
      }
    }
  }
  if(yes<=no){
    return false
  }
  return true
}

function cursedByDiabetes(){
  if(personalMedicalHistory===null || personalMedicalHistory===undefined){
    return false
  }
  let yes=0
  let no=0
  for(let i=0;i<personalMedicalHistory.length;i++){
    if(personalMedicalHistory[i].diseaseId ===Diabetes){
      if(personalMedicalHistory[i].isSuffering===true){
        yes+=1
      }
      else{
        no+=1
      }
    }
  }
  if(yes<=no){
    return false
  }
  return true
}
function cursedByBloodPressureIssues(){

  if(personalMedicalHistory===null || personalMedicalHistory===undefined){
    return false
  }
  let yes=0
  let no=0
  for(let i=0;i<personalMedicalHistory.length;i++){
    if(personalMedicalHistory[i].diseaseId ===BloodPressureIssues){
      if(personalMedicalHistory[i].isSuffering===true){
        yes+=1
      }
      else{
        no+=1
      }
    }
  }
  if(yes<=no){
    return false
  }
  return true
}
function cursedByElevatedCholesterol(){

  if(personalMedicalHistory===null || personalMedicalHistory===undefined){
    return false
  }
  let yes=0
  let no=0
  for(let i=0;i<personalMedicalHistory.length;i++){
    if(personalMedicalHistory[i].diseaseId ===ElevatedCholesterol){
      if(personalMedicalHistory[i].isSuffering===true){
        yes+=1
      }
      else{
        no+=1
      }
    }
  }
  if(yes<=no){
    return false
  }
  return true
}
function cursedByGlaucoma(){

  if(personalMedicalHistory===null || personalMedicalHistory===undefined){
    return false
  }
  let yes=0
  let no=0
  for(let i=0;i<personalMedicalHistory.length;i++){
    if(personalMedicalHistory[i].diseaseId ===Glaucoma){
      if(personalMedicalHistory[i].isSuffering===true){
        yes+=1
      }
      else{
        no+=1
      }
    }
  }
  if(yes<=no){
    return false
  }
  return true
}

// ----------------------------------------------------------------------------------------------------------------------------------------

  function idChecked(obj){
    return obj.isSuffering===true
  }

  function idCheckedFalse(obj) {
    return obj.isSuffering === false
  }

  function isEffectedwithParkinson(arr,relationshipId){
    for(let i=0;i<arr.length;i++){
        if(arr[i].diseaseId ===Parkinson && arr[i].relationshipId===relationshipId){
          return true
        }
    }
    return false
  }
  function isEffectedwithAlzheimer(arr,relationshipId){
    for(let i=0;i<arr.length;i++){
        if(arr[i].diseaseId ===Alzheimer && arr[i].relationshipId===relationshipId){
          return true
        }
    }
    return false
  }
  function isEffectedHeartDisease(arr,relationshipId){
    for(let i=0;i<arr.length;i++){
        if(arr[i].diseaseId ===HeartDisease && arr[i].relationshipId===relationshipId){
          return true
        }
    }
    return false
  }
  function isEffectedStroke(arr,relationshipId){
    for(let i=0;i<arr.length;i++){
        if(arr[i].diseaseId ===Stroke && arr[i].relationshipId===relationshipId){
          return true
        }
    }
  }
  function isEffectedDiabetes(arr,relationshipId){
    for(let i=0;i<arr.length;i++){
        if(arr[i].diseaseId ===Diabetes && arr[i].relationshipId===relationshipId){
          return true
        }
    }
    return false
  }
  function isEffectedBloodPressureIssues(arr,relationshipId){
    for(let i=0;i<arr.length;i++){
        if(arr[i].diseaseId ===BloodPressureIssues && arr[i].relationshipId===relationshipId){
          return true
        }
    }
    return false
  }
  function isEffectedElevatedCholesterol(arr,relationshipId){
    for(let i=0;i<arr.length;i++){
        if(arr[i].diseaseId ===ElevatedCholesterol && arr[i].relationshipId===relationshipId){
          return true
        }
    }
    return false
  }
  function isEffectedGlucoma(arr,relationshipId){
    for(let i=0;i<arr.length;i++){
        if(arr[i].diseaseId ===Glaucoma && arr[i].relationshipId===relationshipId){
          return true
        }
    }
    return false
  }

  const getBloodType = (LifeStyle) => {
    if(!LifeStyle?.length || !bloodTypes?.length) return "";

    const bloodTypeId = LifeStyle?.filter(ele => ele.questionId == 218)?.[0]?.response;
    const selectedBlood = bloodTypes?.filter(ele => ele.value == bloodTypeId)
    // konsole.log("ebsvbwv",selectedBlood, bloodTypes, bloodTypeId)

    return selectedBlood?.[0]?.label || "";
  }


  const getResponseFromSubjectForFormLabelId = (spouseOrPersonalLifeStyle,questionId) => {
              const eachWeekExerciseQuestionData = spouseOrPersonalLifeStyle?.find((item) => item?.questionId == questionId );
              //  konsole.log("Returned23123323response:",spouseOrPersonalLifeStyle, eachWeekExerciseQuestionData);
               let questionIds = eachWeekExerciseQuestionData?.questionId == 4 ? [104] : [106]
                return new Promise((resolve, reject) => {
                if (eachWeekExerciseQuestionData) {
                        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, questionIds, (response) => {
                            if (response && response?.data?.data?.length > 0) {
                                let getsubjectForFormLabelIdResponse = response.data.data[0].question.response;
                                getsubjectForFormLabelIdResponse = getsubjectForFormLabelIdResponse.find((item) => item?.responseId == eachWeekExerciseQuestionData?.responseId);
                                if (getsubjectForFormLabelIdResponse) {
                                // konsole.log("getSubresponse",response.data.data,response.data.data[0].question.response,eachWeekExerciseQuestionData,'ls',getsubjectForFormLabelIdResponse)
                                    resolve(getsubjectForFormLabelIdResponse?.response);
                                }
                            }else{
                            resolve("err")
                            }
                        });
                  }else{
                  resolve("err")
                  }
                })  
              }

  const commonFunctionForExerciseResponse =  async() => {
    let primaryLifeStylePromise =await getResponseFromSubjectForFormLabelId(personalLifeStyle,4)
   if(primaryLifeStylePromise !="err"){
    setWeekExerciseResponseForPrimary(primaryLifeStylePromise);
     }
    
   let spouseDataPromise = await getResponseFromSubjectForFormLabelId(spouseCurrentLifeStyle,4)
    if(spouseDataPromise !="err"){
     setWeekExerciseResponseForSpouse(spouseDataPromise);
     }

     let primaryLifeStylePromise1 =await getResponseFromSubjectForFormLabelId(personalLifeStyle,6)
     if(primaryLifeStylePromise1 !="err"){
        setonscaleResponseForPrimary(primaryLifeStylePromise1);
       }
      
     let spouseDataPromise2 = await getResponseFromSubjectForFormLabelId(spouseCurrentLifeStyle,6)
      if(spouseDataPromise2 !="err"){
          setonscaleResponseForSpouse(spouseDataPromise2);
  }
}


              
  const needToShowPrimary = useMemo(() => {
    konsole.log("wsbjs", personalLifeStyle)
    return personalLifeStyle?.some(ele => [2,7,8,11,12].includes(ele.questionId)  && ele.response)
  }, [ personalLifeStyle ])
  
  const needToShowSpouse = useMemo(() => {
    konsole.log("wefewf", spouseCurrentLifeStyle)
    return spouseCurrentLifeStyle?.some(ele => [2,7,8,11,12].includes(ele.questionId)  && ele.response)
  }, [ spouseCurrentLifeStyle ])

 
  const functionForYesNoNull=(questionId)=>{
    const arrayForRegularCheckups=personalLifeStyle?.filter((item)=>item.questionId==questionId && item.response)
    const _result=arrayForRegularCheckups.length>0 ? arrayForRegularCheckups[0].response:''
    // konsole.log("_resultsssssssss",arrayForRegularCheckups)
    if(questionId == '95'){
      return arrayForRegularCheckups.length>0 ? arrayForRegularCheckups?.map(ele => ele.response)?.join(", ") : ""
    }
    return _result;
  
  }
  const functionForYesNoNullSpouse=(questionId)=>{  
    const arrayForRegularCheckups=spouseCurrentLifeStyle?.filter((item)=>item.questionId==questionId && item.response)
    const _result=arrayForRegularCheckups.length>0 ? arrayForRegularCheckups[0].response:''
    if(questionId == '95'){
      return arrayForRegularCheckups.length>0 ? arrayForRegularCheckups?.map(ele => ele.response)?.join(", ") : ""
    }
    return _result;
  
  }

  
  return (
    <div className="contain mt-2">
      {/* <div className="pb-2"> */}
        {/* <span class="h4 border-bottom-thin generate-pdf-main-color fw-bold text-danger">Family Medical History</span> */}
        {/* <div className=" d-flex justify-content-start pb-2" style={{borderBottom:"2px solid #E8E8E8", margin:"0px 10px"}}>
        <h1 className="health_Info_h1 pb-3">Family Medical History</h1>
      </div>
      </div> */}
      <div>
      <ul className="pt-3"><li className="head-2">Family Medical History</li></ul>
      </div>
      <div className="row">
        <div className="row pb-2 pt-2">
          <div className="col-4"></div>
          <div className="col-4 generate-pdf-main-color clientheading">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</div>
          {userDetailOfPrimary?.spouseName && <div className="col-4 generate-pdf-main-color clientheading">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</div>}
        </div>
        <div className="col mx-3">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th></th>
                <th>Father</th>
                <th>Mother</th>
                {userDetailOfPrimary?.spouseName && <><th>Father</th>
                <th>Mother</th></>}
              </tr>
              <tr>
                <td>Age, If Living</td>
                <td>
                  <input className="borderless-input " id="r-2-c-1" value={familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == fatherId && c.isCurrentlyLiving == 1 && Number(c.age) >= 18})[0]?.age}></input>
                </td>
                <td>
                  <input className="borderless-input " id="r-2-c-2" value={familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == motherId && c.isCurrentlyLiving == 1 && Number(c.age) >= 18})[0]?.age}></input>
                </td>
                {userDetailOfPrimary?.spouseName && <><td>
                  <input className="borderless-input " id="r-2-c-3" value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == fatherId && c.isCurrentlyLiving == 1 && Number(c.age) >= 18})[0]?.age}></input>
                </td>
                <td>
                  <input className="borderless-input " id="r-2-c-4" value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == motherId && c.isCurrentlyLiving == 1 && Number(c.age) >= 18})[0]?.age}></input>
                </td></>}
              </tr>
              <tr>
                <td>Age at passing</td>
                <td>
                  <input className="borderless-input" id="r-3-c-1" value={familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == fatherId && c.isCurrentlyLiving == 0 && Number(c.age) >= 18})[0]?.age}></input>
                </td>
                <td>
                  <input className="borderless-input " id="r-3-c-2" value={familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == motherId && c.isCurrentlyLiving == 0 && Number(c.age) >= 18})[0]?.age}></input>
                </td>
                {userDetailOfPrimary?.spouseName && <><td>
                  <input className="borderless-input" id="r-3-c-3" value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == fatherId && c.isCurrentlyLiving == 0 && Number(c.age) >= 18})[0]?.age}></input>
                </td>
                <td>
                  <input className="borderless-input" id="r-3-c-4" value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == motherId && c.isCurrentlyLiving == 0 && Number(c.age) >= 18})[0]?.age}></input>
                </td></>}
              </tr>

              <tr>
                <td>Reason for passing:</td>
                <td>
                  <input className="borderless-input" id="r-4-c-1" value={familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == fatherId && c.isCurrentlyLiving == 0})[0]?.causeOfDeath}></input>
                </td>
                <td>
                  <input className="borderless-input " id="r-4-c-2" value={familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == motherId && c.isCurrentlyLiving == 0})[0]?.causeOfDeath}></input>
                </td>
                {userDetailOfPrimary?.spouseName && <><td>
                  <input className="borderless-input" id="r-4-c-3" value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == fatherId && c.isCurrentlyLiving == 0})[0]?.causeOfDeath}></input>
                </td>
                <td>
                  <input className="borderless-input" id="r-4-c-4" value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == motherId && c.isCurrentlyLiving == 0})[0]?.causeOfDeath}></input>
                </td></>}
              </tr>

              <tr>
                <td>Number of siblings:</td>
                <td>
                  <input class="tbl-input " id="living-col-2" value={familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == siblingId && c.isCurrentlyLiving == 1})[0]?.noOfLivingSibling}></input>
                  <label className="">Living</label>
                </td>

                <td>
                  <td>
                    <input class="tbl-input " id="deceased-col-3" value={familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == siblingId && c.isCurrentlyLiving == 0 && c.noOfDeceasedSibling !==null})[0]?.noOfDeceasedSibling}></input>
                    <label className="">Deceased</label>
                  </td>
                </td>

                {userDetailOfPrimary?.spouseName && <><td>
                  <input class="tbl-input" id="living-col-4" value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == siblingId && c.isCurrentlyLiving == 1})[0]?.noOfLivingSibling}></input>
                  <label className="">Living</label>
                </td>
                <td>
                  <input class="tbl-input" id="deceased-col-3"  value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == siblingId && c.isCurrentlyLiving == 0 && c.noOfDeceasedSibling !==null})[0]?.noOfDeceasedSibling}></input>
                  <label className="">Deceased</label>
                </td></>}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="container-fluid mt-2">
              <div className="row">
                  <div className="col-3"></div>
                  <div className="col-3 colour-brick-bold"></div>
                  <div className="col-3 clientheading">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</div>
                  <div className="col-3 clientheading">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</div>
              </div>
          </div>

      <table class="table table-borderless mx-3 ">
        <tbody>
          <tr className="thead">
            <th></th>
            <th>Father</th>
            <th>Mother</th>
            <th>Siblings</th>
            {userDetailOfPrimary?.spouseName && <><th>Father</th>
            <th>Mother</th>
            <th>Siblings</th></>}
          </tr>
          <tr >
            <td>Dementia/Alzheimer{"'s"}</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="da-check-1" checked={isEffectedwithAlzheimer(familyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="da-check-2" checked={isEffectedwithAlzheimer(familyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="da-check-3" checked={isEffectedwithAlzheimer(familyMedicalHistory,siblingId)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="da-check-4" checked={isEffectedwithAlzheimer(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="da-check-5" checked={isEffectedwithAlzheimer(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="da-check-6" checked={isEffectedwithAlzheimer(spouseFamilyMedicalHistory,siblingId)}></input>
            </td></>}
          </tr>
          <tr>
            <td>Parkinson{"'s"}</td>
             <td className="text-center">
              <input className="form-check-input" type="checkbox" id="parkinson-check-1" checked={isEffectedwithParkinson(familyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="parkinson-check-2" checked={isEffectedwithParkinson(familyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="parkinson-check-3" checked={isEffectedwithParkinson(familyMedicalHistory,siblingId)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="parkinson-check-4" checked={isEffectedwithParkinson(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="parkinson-check-5" checked={isEffectedwithParkinson(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="parkinson-check-6" checked={isEffectedwithParkinson(spouseFamilyMedicalHistory,siblingId)}></input>
            </td></>}
          </tr>
          <tr>
            <td>Heart Disease</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="hd-check-1" checked={isEffectedHeartDisease(familyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="hd-check-2" checked={isEffectedHeartDisease(familyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="hd-check-3" checked={isEffectedHeartDisease(familyMedicalHistory,siblingId)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="hd-check-4" checked={isEffectedHeartDisease(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="hd-check-5" checked={isEffectedHeartDisease(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="hd-check-6" checked={isEffectedHeartDisease(spouseFamilyMedicalHistory,siblingId)}></input>
            </td></>}
          </tr>
          <tr>
            <td>Stroke</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="stroke-check-1" checked={isEffectedStroke(familyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="stroke-check-2" checked={isEffectedStroke(familyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="stroke-check-3" checked={isEffectedStroke(familyMedicalHistory,siblingId)}></input>
            </td >
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="stroke-check-4" checked={isEffectedStroke(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="stroke-check-5" checked={isEffectedStroke(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="stroke-check-6" checked={isEffectedStroke(spouseFamilyMedicalHistory,siblingId)}></input>
            </td></>}
          </tr>
          <tr>
            <td>Diabetes</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="diabetes-check-1" checked={isEffectedDiabetes(familyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="diabetes-check-2" checked={isEffectedDiabetes(familyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="diabetes-check-3" checked={isEffectedDiabetes(familyMedicalHistory,siblingId)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="diabetes-check-4" checked={isEffectedDiabetes(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="diabetes-check-5" checked={isEffectedDiabetes(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="diabetes-check-6" checked={isEffectedDiabetes(spouseFamilyMedicalHistory,siblingId)}></input>
            </td></>}
          </tr>
          <tr>
            <td>Blood Pressure Issues</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="bpi-check-1" checked={isEffectedBloodPressureIssues(familyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="bpi-check-2" checked={isEffectedBloodPressureIssues(familyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="bpi-check-3" checked={isEffectedBloodPressureIssues(familyMedicalHistory,siblingId)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="bpi-check-4" checked={isEffectedBloodPressureIssues(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="bpi-check-5" checked={isEffectedBloodPressureIssues(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="bpi-check-6" checked={isEffectedBloodPressureIssues(spouseFamilyMedicalHistory,siblingId)}></input>
            </td></>}
          </tr>
          <tr>
            <td>Elevated Cholesterol</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="ec-check-1" checked={isEffectedElevatedCholesterol(familyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="ec-check-2" checked={isEffectedElevatedCholesterol(familyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="ec-check-3" checked={isEffectedElevatedCholesterol(familyMedicalHistory,siblingId)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="ec-check-4" checked={isEffectedElevatedCholesterol(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="ec-check-5" checked={isEffectedElevatedCholesterol(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="ec-check-6" checked={isEffectedElevatedCholesterol(spouseFamilyMedicalHistory,siblingId)}></input>
            </td></>}
          </tr>
          <tr>
            <td>Glaucoma</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="glaucoma-check-1" checked={isEffectedGlucoma(familyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="glaucoma-check-2" checked={isEffectedGlucoma(familyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="glaucoma-check-3" checked={isEffectedGlucoma(familyMedicalHistory,siblingId)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="glaucoma-check-4" checked={isEffectedGlucoma(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="glaucoma-check-5" checked={isEffectedGlucoma(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="glaucoma-check-6" checked={isEffectedGlucoma(spouseFamilyMedicalHistory,siblingId)}></input>
            </td></>}
          </tr>
        </tbody>
      </table>

      
        {/* <span class="h4 border-bottom-thin generate-pdf-main-color fw-bold text-danger">  Personal Medical History</span> */}
        {/* <div className=" d-flex justify-content-start pt-3 pb-2" style={{borderBottom:"2px solid #E8E8E8", margin:"0px 10px"}}>
        <h1 className="health_Info_h1 pb-3">Personal Medical History</h1>
      </div> */}
      <div>
      <ul className="pt-5"><li className="head-2">Personal Medical History</li></ul>
      </div>


      <table class="table table-borderless tbdhead  mt-2 mx-3">
        <tbody>
          <tr>
            <td></td>
            <td className="col-3  text-center clientheading">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</td>
            {userDetailOfPrimary?.spouseName && <><td className="col-4  text-center clientheading">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</td></>}
          </tr>
          <tr>
            <td >Blood Type</td>
            <td className="text-center">
              {getBloodType(personalLifeStyle)}
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              {getBloodType(spouseCurrentLifeStyle)}
            </td></>}
          </tr>
          <tr>
            <td >Dementia/Alzheimer{"'s"}</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-da-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 1 && v.isSuffering == true)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-da-check-2" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 1 && v.isSuffering == true)} ></input>
            </td></>}
          </tr>
          <tr>
            <td>Parkinson{"'s"}</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-parkinson-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 2 && v.isSuffering == true)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-parkinson-check-2" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 2 && v.isSuffering == true)}></input>
            </td></>}
          </tr>
          <tr>
            <td>Heart Disease</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-hd-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 3 && v.isSuffering == true)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-hd-check-2" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 3 && v.isSuffering == true)}></input>
            </td></>}
          </tr>
          <tr>
            <td>Stroke</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-stoke-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 4 && v.isSuffering == true)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-stoke-check-2" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 4 && v.isSuffering == true)}></input>
            </td></>}
          </tr>
          <tr>
            <td>Diabetes</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-diabetes-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 5 && v.isSuffering == true)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-diabetes-check-2" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 5 && v.isSuffering == true)}></input>
            </td></>}
          </tr>
          <tr>
            <td>Blood Pressure Issues</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-bpi-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 6 && v.isSuffering == true)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-bpi-check-2" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 6 && v.isSuffering == true)}></input>
            </td></>}
          </tr>
          <tr>
            <td>Elevated Cholesterol</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-ec-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 7 && v.isSuffering == true)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-ec-check-2" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 7 && v.isSuffering == true)}></input>
            </td></>}
          </tr>
          <tr>
            <td>Glaucoma</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-glaucoma-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 8 && v.isSuffering == true)}></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 8 && v.isSuffering == true)}></input>
            </td></>}
          </tr>
          {/* <tr>
            <td>Grew up in a smoking household</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-smoking-check-1"></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-smoking-check-2"></input>
            </td></>}
          </tr> */}
          {/* <tr>
            <td>Conditions that limit physical ability</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-ab-check-1"></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-ab-check-2"></input>
            </td></>}
          </tr>
          <tr>
            <td>Difficulty with gait, balance, or ambulation</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-wgb-check-1"></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-wgb-check-2"></input>
            </td></>}
          </tr>
          <tr>
            <td>Meds you are allergic to</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="txt-alergic-1"></input>
            </td>
            {userDetailOfPrimary?.spouseName && <><td className="text-center">
              <input className="form-check-input" type="checkbox" id="txt-alergic-2"></input>
            </td></>}
          </tr> */}
        </tbody>
      </table>

        {/* -----------------Primary Qus---------------- */}

        <h5 className="clientheading fs-6 pb-3 pt-2">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</h5>
          <div className="contain">
          <div className="d-flex justify-content-between">
          <div className="sumPhysician pb-3" style={{ width:"55%"}}>
               <p>Did you grow up in a smoking household or work in a smoking environment?</p>
             {primaryPersonalMed?.find(ele => ele.questionId == 14)?.response == "Yes" ? (
              <div className="d-flex gap-2">
            <h5 className="pt-1">{primaryPersonalMed?.find(ele => ele.questionId == 14)?.response}</h5>{"-"}
            <h5 className="pt-1">{primaryPersonalMed?.find(ele => ele.questionId == 234)?.response}</h5>
        </div>
         ) : (
        <h5>{primaryPersonalMed?.find(ele => ele.questionId == 14)?.response}</h5>
          )}
       </div>
              <div className="sumPhysician pb-3" style={{ width: "50%" }}>
               <p>Do you have conditions that limit physical ability?</p>
             {primaryPersonalMed?.find(ele => ele.questionId === 15)?.response == "Yes" ? (
              <div className="d-flex gap-2">
            <h5 className="pt-1">{primaryPersonalMed?.find(ele => ele.questionId == 15)?.response}</h5>{"-"}
            <h5 className="pt-1">{primaryPersonalMed?.find(ele => ele.questionId == 235)?.response}</h5>
        </div>
         ) : (
        <h5>{primaryPersonalMed?.find(ele => ele.questionId == 15)?.response}</h5>
          )}
       </div>
           </div> 
              <div className="d-flex justify-content-between">
                <div className="sumPhysician pb-3" style={{ width: "55%" }}>
               <p>Do you have difficulty with gait, balance, or ambulation?</p>
             {primaryPersonalMed?.find(ele => ele.questionId === 16)?.response == "Yes" ? (
              <div className="d-flex gap-2">
            <h5 className="pt-1">{primaryPersonalMed?.find(ele => ele.questionId == 16)?.response}</h5>{"-"}
            <h5 className="pt-1">{primaryPersonalMed?.find(ele => ele.questionId === 236)?.response}</h5>
        </div>
         ) : (
        <h5>{primaryPersonalMed?.find(ele => ele.questionId == 16)?.response}</h5>
          )}
       </div>
              <div className="sumPhysician pt-3" style={{width:"50%"}}>
              <p>Are you allergic to any medications?</p>
              <h5>{primaryPersonalMed?.find(ele => ele.questionId == 17)?.response}</h5>
              </div>  
              </div> 
             { primaryPersonalMed?.find(ele => ele.questionId == 17)?.response != "No" && <div className="sumPhysician pt-3" style={{width:"50%"}}>
              <p>Which medications?</p>
              <h5>{primaryPersonalMed?.find(ele => ele.questionId == 152)?.response}</h5>
              </div> } 
          </div>
   
       {/* ----------------------Spouse Qus--------------- */}


         { userDetailOfPrimary.spouseName &&  <>
          <h5 className="clientheading fs-6 pb-3 pt-4">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</h5>
          <div className="contain">
          <div className="d-flex justify-content-between">
                 <div className="sumPhysician pb-3" style={{ width:"55%"}}>
               <p>Did you grow up in a smoking household or work in a smoking environment?</p>
             {spousePersonalMed?.find(ele => ele.questionId == 14)?.response == "Yes" ? (
              <div className="d-flex gap-2">
            <h5 className="pt-1">{spousePersonalMed?.find(ele => ele.questionId == 14)?.response}</h5>{"-"}
            <h5 className="pt-1">{spousePersonalMed?.find(ele => ele.questionId == 234)?.response}</h5>
        </div>
         ) : (
        <h5>{spousePersonalMed?.find(ele => ele.questionId == 14)?.response}</h5>
          )}
       </div>
               <div className="sumPhysician pb-3" style={{ width: "50%" }}>
               <p>Do you have conditions that limit physical ability?</p>
             {spousePersonalMed?.find(ele => ele.questionId === 15)?.response == "Yes" ? (
              <div className="d-flex gap-2">
            <h5 className="pt-1">{spousePersonalMed?.find(ele => ele.questionId == 15)?.response}</h5>{"-"}
            <h5 className="pt-1">{spousePersonalMed?.find(ele => ele.questionId == 235)?.response}</h5>
        </div>
         ) : (
        <h5>{spousePersonalMed?.find(ele => ele.questionId == 15)?.response}</h5>
          )}
       </div>

              </div> 
              <div className="d-flex justify-content-between">
                <div className="sumPhysician pb-3" style={{ width: "55%" }}>
               <p>Do you have difficulty with gait, balance, or ambulation?</p>
             {spousePersonalMed?.find(ele => ele.questionId === 16)?.response == "Yes" ? (
              <div className="d-flex gap-2">
            <h5 className="pt-1">{spousePersonalMed?.find(ele => ele.questionId == 16)?.response}</h5>{"-"}
            <h5 className="pt-1">{spousePersonalMed?.find(ele => ele.questionId === 236)?.response}</h5>
        </div>
         ) : (
        <h5>{spousePersonalMed?.find(ele => ele.questionId == 16)?.response}</h5>
          )}
       </div>
              <div className="sumPhysician pt-3" style={{width:"50%"}}>
              <p>Are you allergic to any medications?</p>
              <h5>{spousePersonalMed?.find(ele => ele.questionId == 17)?.response}</h5>
              </div>  
              </div> 
             { spousePersonalMed?.find(ele => ele.questionId == 17)?.response != "No" && <div className="sumPhysician pt-3" style={{width:"50%"}}>
              <p>Which medications?</p>
              <h5>{spousePersonalMed?.find(ele => ele.questionId == 152)?.response}</h5>
              </div> } 
          </div>
          </>}
      {/* <div className="pb-1"> */}
        {/* <span class="h4 fw-bold border-bottom-thin generate-pdf-main-color">Current Lifestyle</span> */}
        {/* <div className=" d-flex justify-content-start pb-2" style={{borderBottom:"2px solid #E8E8E8", margin:"0px 10px"}}>
        <h1 className="health_Info_h1 pb-3">Current Lifestyle</h1>
        </div> */}
        <div>
      <ul className="pt-5"><li className="head-2">Current Lifestyle</li></ul>
      </div>

      {/* 
      const [atAhealthyWeigth,setAtAhealthyWeigth]=useState("")
const [freqExersice,setFreqExercise]=useState("")
const [regularCheckups,setRegularCheckups]=useState("")
const [goodEatingHabbits,setGoodEatingHabbits]=useState("")
const [worryAboutHealth,setWorryAboutHealth]=useState("")
const [dailySocalInteractions,setDailySocalInteractions]=useState("")
const [drugUse,setdrugUse]=useState("")
const [alcoholType,setAlcoholType]=useState("")
const [alcoholicDrinksPerWeek,setAlcoholicDrinksPerWeek]=useState("")
const [smoke,setSmoke]=useState("")
const [consumeAlcohol,setConsumeAlcohol]=useState("")
const [longDoYouExcercise,setLongDoYouExcercise]=useState("")
const [quitSmoking,setSmoking]=useState("")
const [purposeAfterRetirement,setPurposeAfterRetirement]=useState("")
       */}

      <div className="cointain mx-3">
      <div className="d-flex pb-5" style={{gap:"2rem"}}>
                <div className="col">
                <div className="d-flex gap-2 pb-3 pt-3" style={{borderBottom:"2px solid #E8E8E8"}}> <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
                 <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</h5></div>
                 {needToShowPrimary ? <>
                 <div className="sumPhysician pt-3">
                 <p>Are you at a healthy weight?</p>
                 <h5>{functionForYesNoNull(2)}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>How would you describe your exercise habits?</p>
                 <h5>{functionForYesNoNull(3)}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Description?</p>
                 <h5>{functionForYesNoNull(96)}</h5>
                </div>
                { functionForYesNoNull(3) == "Regularly exercise" &&              
                <div className="sumPhysician pt-3">
                 <p>How often do you exercise each week?</p>
                 <h5>{weekExerciseResponseForPrimary}</h5>
                </div> }
                { functionForYesNoNull(3) == "Regularly exercise" &&  
                <div className="sumPhysician pt-3">
                 <p>When you exercise, how long do you exercise?</p>
                 <h5>{GetUserExerciseHabbit(personalLifeStyle)}</h5>
                </div>}
                <div className="sumPhysician pt-3">
                 <p>On a scale of 1 to 10 (1 = poor; 10 = great), how would you rate your eating habits?</p>
                 <h5>{onscaleResponseForPrimary}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Are you good about getting regular checkups?</p>
                 <h5>{functionForYesNoNull(7)}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Do you worry about your health?</p>
                 <h5>{functionForYesNoNull(8)}</h5>
                </div>
                { functionForYesNoNull(8) != "No" && <div className="sumPhysician pt-3">
                 <p>What is your worry?</p>
                 <h5>{functionForYesNoNull(153)}</h5>
                </div>}
                <div className="sumPhysician pt-3">
                 <p>Outside of work, how do you and your spouse (if married) keep socially engaged?</p>
                 <h5>{functionForYesNoNull(9)}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>After you retire, what will your life's purpose be?</p>
                 <h5>{functionForYesNoNull(10)}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Do you use drugs recreationally?</p>
                 <h5>{functionForYesNoNull(11)}</h5>
                </div>
                
                <div className="sumPhysician pt-3">
                 <p>Do you currently smoke?</p>
                 <h5>{functionForYesNoNull(12)}</h5>
                </div> 
                { functionForYesNoNull(12) == "No"  &&<div className="sumPhysician pt-3">
                 <p>Have you ever smoked?</p>
                 <h5>{functionForYesNoNull(239)}</h5>
                </div>}
                { (functionForYesNoNull(239) == "Yes" && functionForYesNoNull(12) == "No") &&<div className="sumPhysician pt-3">
                 <p>When did you quit smoking?</p>
                 <h5>{functionForYesNoNull(240)}</h5>
                </div>}
                <div className="sumPhysician pt-3">
                 <p>Do you consume alcohol?</p>
                 <h5>{functionForYesNoNull(13)}</h5>
                </div>
                { functionForYesNoNull(13) != "No" && <div className="sumPhysician pt-3">
                 <p>How many alcoholic drinks do you consume in a week?</p>
                 <h5>{NumberOfAlcoholicDrinksPerWeek(personalLifeStyle) || ""}</h5>
                </div>}
                {functionForYesNoNull(13) != "No" && <div className="sumPhysician pt-3">
                 <p>Which of these do you drink?</p>
                 <h5>{functionForYesNoNull(95)}</h5>
                 </div>} </> : <p>(Not Provided)</p>}
              </div>

              {userDetailOfPrimary?.spouseName && <><div className="col" style={{borderLeft:"2px solid  #E8E8E8", paddingLeft:"2rem"}}>
                <div className="d-flex gap-2 pb-3 pt-3" style={{borderBottom:"2px solid #E8E8E8"}}> <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
                 <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</h5></div>
                 {needToShowSpouse ? <><div className="sumPhysician pt-3">
                 <p>Are you at a healthy weight?</p>
                 <h5>{functionForYesNoNullSpouse(2)}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>How would you describe your exercise habits?</p>
                 <h5>{functionForYesNoNullSpouse(3)}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Description?</p>
                 <h5>{functionForYesNoNullSpouse(96)}</h5>
                </div>
                { functionForYesNoNullSpouse(3) == "Regularly exercise" &&  
                <div className="sumPhysician pt-3">
                 <p>How often do you exercise each week?</p>
                 <h5>{weekExerciseResponseForSpouse}</h5>
                </div>}
                { functionForYesNoNullSpouse(3) == "Regularly exercise" && 
                <div className="sumPhysician pt-3">
                 <p>When you exercise, how long do you exercise?</p>
                 <h5>{GetUserExerciseHabbit(spouseCurrentLifeStyle)}</h5>
                </div>}
                <div className="sumPhysician pt-3">
                 <p>On a scale of 1 to 10 (1 = poor; 10 = great), how would you rate your eating habits?</p>
                 <h5>{onscaleResponseForSpouse}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Are you good about getting regular checkups?</p>
                 <h5>{functionForYesNoNullSpouse(7)}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Do you worry about your health?</p>
                 <h5>{functionForYesNoNullSpouse(8)}</h5>
                </div>
                { functionForYesNoNullSpouse(8) != "No" && <div className="sumPhysician pt-3">
                 <p>What is your worry?</p>
                 <h5>{functionForYesNoNullSpouse(153)}</h5>
                </div>}
                <div className="sumPhysician pt-3">
                 <p>Outside of work, how do you and your spouse (if married) keep socially engaged?</p>
                 <h5>{functionForYesNoNullSpouse(9)}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>After you retire, what will your life's purpose be?</p>
                 <h5>{functionForYesNoNullSpouse(10)}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Do you use drugs recreationally??</p>
                 <h5>{functionForYesNoNullSpouse(11)}</h5>
                </div>
               
                <div className="sumPhysician pt-3">
                 <p>Do you currently smoke?</p>
                 <h5>{functionForYesNoNullSpouse(12)}</h5>
                </div>
                { functionForYesNoNullSpouse(12) == "No"  &&<div className="sumPhysician pt-3">
                 <p>Have you ever smoked?</p>
                 <h5>{functionForYesNoNullSpouse(239)}</h5>
                </div>}
                { functionForYesNoNullSpouse(239) == "Yes" && functionForYesNoNullSpouse(12) == "No"  &&<div className="sumPhysician pt-3">
                 <p>When did you quit smoking?</p>
                 <h5>{functionForYesNoNullSpouse(240)}</h5>
                </div>}
                <div className="sumPhysician pt-3">
                 <p>Do you consume alcohol?</p>
                 <h5>{functionForYesNoNullSpouse(13)}</h5>
                </div>
               { functionForYesNoNullSpouse(13) != "No" && <div className="sumPhysician pt-3">
                 <p>How many alcoholic drinks do you consume in a week?</p>
                 <h5>{NumberOfAlcoholicDrinksPerWeek(spouseCurrentLifeStyle) || ""}</h5>
                </div>}
                {functionForYesNoNullSpouse(13) != "No" && <div className="sumPhysician pt-3">
                 <p>Which of these do you drink?</p>
                 <h5>{functionForYesNoNullSpouse(95)}</h5>
                 </div>} </> : <p>(Not provided)</p>}
              </div></>}

              </div>
      </div>
    </div>
  );
};

export default FamilyMedicalSumHistoryComponent;
