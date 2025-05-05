import Api from "../../../helper/api";
import { useEffect, useState } from "react";
import konsole from "../../../../control/Konsole";
import { $CommonServiceFn } from "../../../../network/Service";
import { $Service_Url } from "../../../../network/UrlPath";
import { $AHelper } from "../../../../control/AHelper";

const FamilyMedicalHistoryComponent = (props) => {
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

  let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))
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


  const functionForYesNoNull=(questionId)=>{
    const arrayForRegularCheckups=personalLifeStyle?.filter((item)=>item.questionId==questionId && item.response)
    const _result=arrayForRegularCheckups.length>0 ? arrayForRegularCheckups[0].response:''
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

konsole.log("noofchildren", familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == siblingId && c.isCurrentlyLiving == 1}));
  return (
    <div className="container-fluid mt-3">
      <div className="pb-2">
        <span class="h4 border-bottom-thin generate-pdf-main-color fw-bold text-danger">
          Family Medical History
        </span>
      </div>
      <div className="row">
        <div className="row pb-2">
          <div className="col-4"></div>
          <div className="col-4 generate-pdf-main-color clientheading  ">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</div>
          <div className="col-4 generate-pdf-main-color clientheading   ">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</div>
        </div>
        <div className="col">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th></th>
                <th>Father</th>
                <th>Mother</th>
                <th>Father</th>
                <th>Mother</th>
              </tr>
              <tr>
                <td>Age, If Living</td>
                <td>
                  <input className="borderless-input " id="r-2-c-1" value={familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == fatherId && c.isCurrentlyLiving == 1 && Number(c.age) >= 18})[0]?.age}></input>
                </td>
                <td>
                  <input className="borderless-input " id="r-2-c-2" value={familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == motherId && c.isCurrentlyLiving == 1 && Number(c.age) >= 18})[0]?.age}></input>
                </td>
                <td>
                  <input className="borderless-input " id="r-2-c-3" value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == fatherId && c.isCurrentlyLiving == 1 && Number(c.age) >= 18})[0]?.age}></input>
                </td>
                <td>
                  <input className="borderless-input " id="r-2-c-4" value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == motherId && c.isCurrentlyLiving == 1 && Number(c.age) >= 18})[0]?.age}></input>
                </td>
              </tr>
              <tr>
                <td>Age at passing</td>
                <td>
                  <input className="borderless-input" id="r-3-c-1" value={familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == fatherId && c.isCurrentlyLiving == 0 && Number(c.age) >= 18})[0]?.age}></input>
                </td>
                <td>
                  <input className="borderless-input " id="r-3-c-2" value={familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == motherId && c.isCurrentlyLiving == 0 && Number(c.age) >= 18})[0]?.age}></input>
                </td>
                <td>
                  <input className="borderless-input" id="r-3-c-3" value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == fatherId && c.isCurrentlyLiving == 0 && Number(c.age) >= 18})[0]?.age}></input>
                </td>
                <td>
                  <input className="borderless-input" id="r-3-c-4" value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == motherId && c.isCurrentlyLiving == 0 && Number(c.age) >= 18})[0]?.age}></input>
                </td>
              </tr>

              <tr>
                <td>Reason for passing:</td>
                <td>
                  <input className="borderless-input" id="r-4-c-1" value={familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == fatherId && c.isCurrentlyLiving == 0})[0]?.causeOfDeath}></input>
                </td>
                <td>
                  <input className="borderless-input " id="r-4-c-2" value={familyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == motherId && c.isCurrentlyLiving == 0})[0]?.causeOfDeath}></input>
                </td>
                <td>
                  <input className="borderless-input" id="r-4-c-3" value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == fatherId && c.isCurrentlyLiving == 0})[0]?.causeOfDeath}></input>
                </td>
                <td>
                  <input className="borderless-input" id="r-4-c-4" value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == motherId && c.isCurrentlyLiving == 0})[0]?.causeOfDeath}></input>
                </td>
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

                <td>
                  <input class="tbl-input" id="living-col-4" value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == siblingId && c.isCurrentlyLiving == 1})[0]?.noOfLivingSibling}></input>
                  <label className="">Living</label>
                </td>
                <td>
                  <input class="tbl-input" id="deceased-col-3"  value={spouseFamilyMedicalHistoryNonSuffering.filter((c) => { return c.disease == null && c.diseaseId == null && c.relationshipId == siblingId && c.isCurrentlyLiving == 0 && c.noOfDeceasedSibling !==null})[0]?.noOfDeceasedSibling}></input>
                  <label className="">Deceased</label>
                </td>
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

      <table class="table table-borderless ">
        <tbody>
          <tr className="thead">
            <th></th>
            <th>Father</th>
            <th>Mother</th>
            <th>Siblings</th>
            <th>Father</th>
            <th>Mother</th>
            <th>Siblings</th>
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
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="da-check-4" checked={isEffectedwithAlzheimer(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="da-check-5" checked={isEffectedwithAlzheimer(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="da-check-6" checked={isEffectedwithAlzheimer(spouseFamilyMedicalHistory,siblingId)}></input>
            </td>
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
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="parkinson-check-4" checked={isEffectedwithParkinson(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="parkinson-check-5" checked={isEffectedwithParkinson(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="parkinson-check-6" checked={isEffectedwithParkinson(spouseFamilyMedicalHistory,siblingId)}></input>
            </td>
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
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="hd-check-4" checked={isEffectedHeartDisease(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="hd-check-5" checked={isEffectedHeartDisease(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="hd-check-6" checked={isEffectedHeartDisease(spouseFamilyMedicalHistory,siblingId)}></input>
            </td>
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
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="stroke-check-4" checked={isEffectedStroke(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="stroke-check-5" checked={isEffectedStroke(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="stroke-check-6" checked={isEffectedStroke(spouseFamilyMedicalHistory,siblingId)}></input>
            </td>
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
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="diabetes-check-4" checked={isEffectedDiabetes(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="diabetes-check-5" checked={isEffectedDiabetes(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="diabetes-check-6" checked={isEffectedDiabetes(spouseFamilyMedicalHistory,siblingId)}></input>
            </td>
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
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="bpi-check-4" checked={isEffectedBloodPressureIssues(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="bpi-check-5" checked={isEffectedBloodPressureIssues(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="bpi-check-6" checked={isEffectedBloodPressureIssues(spouseFamilyMedicalHistory,siblingId)}></input>
            </td>
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
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="ec-check-4" checked={isEffectedElevatedCholesterol(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="ec-check-5" checked={isEffectedElevatedCholesterol(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="ec-check-6" checked={isEffectedElevatedCholesterol(spouseFamilyMedicalHistory,siblingId)}></input>
            </td>
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
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="glaucoma-check-4" checked={isEffectedGlucoma(spouseFamilyMedicalHistory,fatherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="glaucoma-check-5" checked={isEffectedGlucoma(spouseFamilyMedicalHistory,motherId)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="glaucoma-check-6" checked={isEffectedGlucoma(spouseFamilyMedicalHistory,siblingId)}></input>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="paddTop">
        <span class="h4 border-bottom-thin generate-pdf-main-color fw-bold text-danger">
          Personal Medical History
        </span>
      </div>


      <table class="table table-borderless tbdhead  mt-2">
        <tbody>
          <tr>
            <td></td>
            <td className="col-3  text-center clientheading">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</td>
            <td className="col-4  text-center clientheading">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</td>
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
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-da-check-2" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 1 && v.isSuffering == true)} ></input>
            </td>
          </tr>
          <tr>
            <td>Parkinson{"'s"}</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-parkinson-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 2 && v.isSuffering == true)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-parkinson-check-2" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 2 && v.isSuffering == true)}></input>
            </td>
          </tr>
          <tr>
            <td>Heart Disease</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-hd-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 3 && v.isSuffering == true)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-hd-check-2" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 3 && v.isSuffering == true)}></input>
            </td>
          </tr>
          <tr>
            <td>Stroke</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-stoke-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 4 && v.isSuffering == true)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-stoke-check-2" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 4 && v.isSuffering == true)}></input>
            </td>
          </tr>
          <tr>
            <td>Diabetes</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-diabetes-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 5 && v.isSuffering == true)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-diabetes-check-2" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 5 && v.isSuffering == true)}></input>
            </td>
          </tr>
          <tr>
            <td>Blood Pressure Issues</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-bpi-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 6 && v.isSuffering == true)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-bpi-check-2" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 6 && v.isSuffering == true)}></input>
            </td>
          </tr>
          <tr>
            <td>Elevated Cholesterol</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-ec-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 7 && v.isSuffering == true)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-ec-check-2" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 7 && v.isSuffering == true)}></input>
            </td>
          </tr>
          <tr>
            <td>Glaucoma</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-glaucoma-check-1" checked={personalMedicalHistory.length > 0 && personalMedicalHistory.some(v => v.diseaseId  == 8 && v.isSuffering == true)}></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" checked={spouseMedicalHistory.length > 0 && spouseMedicalHistory.some(v => v.diseaseId  == 8 && v.isSuffering == true)}></input>
            </td>
          </tr>
          {/* <tr>
            <td>Grew up in a smoking household</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-smoking-check-1"></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-smoking-check-2"></input>
            </td>
          </tr>
          <tr>
            <td>Conditions that limit physical ability</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-ab-check-1"></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-ab-check-2"></input>
            </td>
          </tr>
          <tr>
            <td>Difficulty with gait, balance, or ambulation</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-wgb-check-1"></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="pmh-wgb-check-2"></input>
            </td>
          </tr>
          <tr>
            <td>Meds you are allergic to</td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="txt-alergic-1"></input>
            </td>
            <td className="text-center">
              <input className="form-check-input" type="checkbox" id="txt-alergic-2"></input>
            </td>
          </tr> */}
        </tbody>
      </table>
      
         {/* -----------------------------------Primary Questions----------------------- */}


        <h5 className="col-3 fs-6 clientheading">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</h5>

        <div className="row pt-3">
          <div className="col-5"><label>Did you grow up in a smoking household or work in a smoking environment?</label></div> 
          {primaryPersonalMed?.find(ele => ele.questionId == 14)?.response == "Yes" ? (
          <div className="col-6">
          <input className="pt-1" value={primaryPersonalMed?.find(ele => ele.questionId == 14)?.response+ "  -  " +primaryPersonalMed?.find(ele => ele.questionId == 234)?.response}/>
        </div>
      
         ) : (
          <div className="col-6">
        <input value={primaryPersonalMed?.find(ele => ele.questionId == 14)?.response}/>
        </div>
          )}
       </div>

       <div className="row pt-3">
          <div className="col-5"><label>Do you have conditions that limit physical ability?</label></div> 
          {primaryPersonalMed?.find(ele => ele.questionId == 15)?.response == "Yes" ? (
          <div className="col-6">
          <input className="pt-1" value={primaryPersonalMed?.find(ele => ele.questionId == 15)?.response+ "  -  " +primaryPersonalMed?.find(ele => ele.questionId == 235)?.response}/>
        </div>
      
         ) : (
          <div className="col-6">
        <input value={primaryPersonalMed?.find(ele => ele.questionId == 15)?.response}/>
        </div>
          )}
       </div>

       <div className="row pt-3">
          <div className="col-5"><label>Do you have difficulty with gait, balance, or ambulation?</label></div> 
          {primaryPersonalMed?.find(ele => ele.questionId == 16)?.response == "Yes" ? (
          <div className="col-6">
          <input className="pt-1" value={primaryPersonalMed?.find(ele => ele.questionId == 16)?.response+ "  -  " +primaryPersonalMed?.find(ele => ele.questionId == 236)?.response}/>
        </div>
      
         ) : (
          <div className="col-6">
        <input value={primaryPersonalMed?.find(ele => ele.questionId == 16)?.response}/>
        </div>
          )}
       </div>

       <div className="row pt-3">
          <div className="col-5"><label>Are you allergic to any medications?</label></div> 
          <div className="col-6">
          <input className="pt-1" value={primaryPersonalMed?.find(ele => ele.questionId == 17)?.response}/>
        </div>
       </div>
       {primaryPersonalMed?.find(ele => ele.questionId == 17)?.response != "No" && 
       <div className="row pt-3">
          <div className="col-5"><label>Which medications?</label></div> 
          <div className="col-6">
          <input className="pt-1" value={primaryPersonalMed?.find(ele => ele.questionId == 152)?.response}/>
        </div>
       </div>}

        {/* -----------------Spouse Questions----------------------------- */}

        <h5 className="col-3 fs-6 pt-3 clientheading">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</h5>
        {userDetailOfPrimary.spouseName && <>
        <div className="row pt-3">
          <div className="col-5"><label>Did you grow up in a smoking household or work in a smoking environment?</label></div> 
          {spousePersonalMed?.find(ele => ele.questionId == 14)?.response == "Yes" ? (
          <div className="col-6">
          <input className="pt-1" value={spousePersonalMed?.find(ele => ele.questionId == 14)?.response+ "  -  " +spousePersonalMed?.find(ele => ele.questionId == 234)?.response}/>
        </div>
      
         ) : (
          <div className="col-6">
        <input value={spousePersonalMed?.find(ele => ele.questionId == 14)?.response}/>
        </div>
          )}
       </div>

       <div className="row pt-3">
          <div className="col-5"><label>Do you have conditions that limit physical ability?</label></div> 
          {spousePersonalMed?.find(ele => ele.questionId == 15)?.response == "Yes" ? (
          <div className="col-6">
          <input className="pt-1" value={spousePersonalMed?.find(ele => ele.questionId == 15)?.response+ "  -  " +spousePersonalMed?.find(ele => ele.questionId == 235)?.response}/>
        </div>
      
         ) : (
          <div className="col-6">
        <input value={spousePersonalMed?.find(ele => ele.questionId == 15)?.response}/>
        </div>
          )}
       </div>

       <div className="row pt-3">
          <div className="col-5"><label>Do you have difficulty with gait, balance, or ambulation?</label></div> 
          {spousePersonalMed?.find(ele => ele.questionId == 16)?.response == "Yes" ? (
          <div className="col-6">
          <input className="pt-1" value={spousePersonalMed?.find(ele => ele.questionId == 16)?.response+ "  -  " +spousePersonalMed?.find(ele => ele.questionId == 236)?.response}/>
        </div>
      
         ) : (
          <div className="col-6">
        <input value={spousePersonalMed?.find(ele => ele.questionId == 16)?.response}/>
        </div>
          )}
       </div>

       <div className="row pt-3">
          <div className="col-5"><label>Are you allergic to any medications?</label></div> 
          <div className="col-6">
          <input className="pt-1" value={spousePersonalMed?.find(ele => ele.questionId == 17)?.response}/>
        </div>
       </div>
       {spousePersonalMed?.find(ele => ele.questionId == 17)?.response != "No" && 
       <div className="row pt-3">
          <div className="col-5"><label>Which medications?</label></div> 
          <div className="col-6">
          <input className="pt-1" value={spousePersonalMed?.find(ele => ele.questionId == 152)?.response}/>
        </div>
       </div>}


      <div className="pb-1">
        <span class="h4 fw-bold border-bottom-thin generate-pdf-main-color">
          Current Lifestyle
        </span>
      </div> </>}

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

      <div className="cointainer">

          <div className="container-fluid">
              <div className="row pb-2">
                  <div className="col-3"></div>
                  <div className="col-3  text-center generate-pdf-main-color clientheading">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</div>
                  <div className="col-1"></div>
                  <div className="col-4  text-center generate-pdf-main-color clientheading">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</div>
              </div>
          </div>
        <div className="row paddTop pb-2">
          <div className="col-3">
            <label>Are you at a healthy weight?</label>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-hw-1" type="checkbox" checked={personalLifeStyle.length > 0 && personalLifeStyle.some(v => v.questionId == 2 && v.response == "Yes")}/>
              <label className="form-check-label">Yes</label>
            </div>

            
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-hw-2" type="checkbox" checked={(personalLifeStyle.length > 0 && personalLifeStyle.some(v => v.questionId == 2 && v.response == "No"))}/>
              <label className="form-check-label">No</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-hw-3" type="checkbox" checked={(spouseCurrentLifeStyle.length > 0 && spouseCurrentLifeStyle.some(v => v.questionId == 2 && v.response == "Yes"))}/>
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-hw-4" type="checkbox" checked={(spouseCurrentLifeStyle.length > 0 && spouseCurrentLifeStyle.some(v => v.questionId == 2 && v.response == "No"))}/>
              <label className="form-check-label">No</label>
            </div>
          </div>

        </div>

        <div className="row">
            <div className="col-3"><label>How would you describe your exercise habits?</label></div>
            <div className="col-4"><input id="txt-ex-1" value={functionForYesNoNull(3)}></input></div>
            <div className="col-4"><input id="txt-ex-2" value={functionForYesNoNullSpouse(3)}></input></div>
        </div>

        <div className="row mb-2">
            <div className="col-3"><label>Description?</label></div>
            <p className=" m-2 mt-1 col-4 otherFontSize"type="text" style={{borderBottom:"1px solid #000",wordBreak:"break-all"}}>{functionForYesNoNull(96)}</p>
            <p className=" m-2 mt-1 col-4 otherFontSize"type="text" style={{borderBottom:"1px solid #000",wordBreak:"break-all"}}>{functionForYesNoNullSpouse(96)}</p>
        </div>

       {  (functionForYesNoNull(3) == "Regularly exercise" || functionForYesNoNullSpouse(3) == "Regularly exercise") && <div className="row">
            <div className="col-3"><label>How often do you exercise each week?</label></div>
            <div className="col-4">{ functionForYesNoNull(3) == "Regularly exercise" && <input id="txt-ex-1" value={weekExerciseResponseForPrimary}></input>}</div>
            { functionForYesNoNullSpouse(3) == "Regularly exercise" &&  <div className="col-4"><input id="txt-ex-2" value={weekExerciseResponseForSpouse}></input></div>}
        </div>}

        { (functionForYesNoNull(3) == "Regularly exercise" || functionForYesNoNullSpouse(3) == "Regularly exercise")  && <div className="row">
            <div className="col-3"><label>When you exercise, how long do you exercise?</label></div>
            <div className="col-4"> { functionForYesNoNull(3) == "Regularly exercise" &&  <p className="pt-2 otherFontSize" style={{borderBottom:"1px solid #000", wordBreak:"break-all"}} >{GetUserExerciseHabbit(personalLifeStyle)}</p>}</div>
            { functionForYesNoNullSpouse(3) == "Regularly exercise" && <div className="col-4"><p className="pt-2 otherFontSize" style={{borderBottom:"1px solid #000", wordBreak:"break-all"}} >{GetUserExerciseHabbit(spouseCurrentLifeStyle)}</p></div>}
        </div>}

        <div className="row mb-2">
            <div className="col-3"><label>On a scale of 1 to 10 (1 = poor; 10 = great), how would you rate your eating habits?</label></div>
            <div className="col-4"><input id="txt-ex-1" value={onscaleResponseForPrimary}></input></div>
            <div className="col-4"><input id="txt-ex-2" value={onscaleResponseForSpouse}></input></div>
        </div>
        
        <div className="row paddTop pt-2">
          <div className="col-3">
            <label>Are you good about getting regular checkups?</label>
          </div>
          <div className="col">
            <div className="form-check">
             { <input className="form-check-input" id="check-rgr-1" checked={(personalLifeStyle.length > 0 && personalLifeStyle.some(v => v.questionId == 7 && v.response == "Yes"))} type="checkbox" />}
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
            { <input className="form-check-input" id="check-rgr-2" checked={(personalLifeStyle.length > 0 && personalLifeStyle.some(v => v.questionId == 7 && v.response == "No"))}  type="checkbox" />}
              <label className="form-check-label">No</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-rgr-3" type="checkbox" checked={(spouseCurrentLifeStyle.length > 0 && spouseCurrentLifeStyle.some(v => v.questionId == 7 && v.response == "Yes"))}/>
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-rgr-4" type="checkbox" checked={(spouseCurrentLifeStyle.length > 0 && spouseCurrentLifeStyle.some(v => v.questionId == 7 && v.response == "No"))}/>
              <label className="form-check-label">No</label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-3">
            <label>Do you worry about your health?</label>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-wah-1" checked={(personalLifeStyle.length > 0 && personalLifeStyle.some(v => v.questionId == 8 && v.response == "Yes"))} type="checkbox" />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
            <input className="form-check-input" id="check-wah-2" checked={(personalLifeStyle.length > 0 && personalLifeStyle.some(v => v.questionId == 8 && v.response == "No"))} type="checkbox" />
              <label className="form-check-label">No</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-wah-3" type="checkbox" checked={(spouseCurrentLifeStyle.length > 0 && spouseCurrentLifeStyle.some(v => v.questionId == 8 && v.response == "Yes"))}/>
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-wah-4" type="checkbox" checked={(spouseCurrentLifeStyle.length > 0 && spouseCurrentLifeStyle.some(v => v.questionId == 8 && v.response == "No"))}/>
              <label className="form-check-label">No</label>
            </div>
          </div>
        </div>

       {  (functionForYesNoNull(8) != "No" || functionForYesNoNullSpouse(8) != "No") &&  <div className="row mb-2">
            <div className="col-3"><label>What is worry ?</label></div>
             <div className="col-4"> {functionForYesNoNull(8) != "No" && <p className="pt-2 otherFontSize" style={{borderBottom:"1px solid #000", wordBreak:"break-all"}}>{functionForYesNoNull(153)}</p>}</div>
            {functionForYesNoNullSpouse(8) != "No" && <div className="col-4"><p className="pt-2 otherFontSize" style={{borderBottom:"1px solid #000", wordBreak:"break-all"}}>{functionForYesNoNullSpouse(153)}</p></div>}
        </div>}
         <div className="row mb-2">
            <div className="col-3"><label>Outside of work, how do you and your spouse (if married) keep socially engaged??</label></div>
             <div className="col-4"><p className="pt-2 otherFontSize" style={{borderBottom:"1px solid #000",wordBreak:"break-all"}} >{functionForYesNoNull(9)}</p></div>
            <div className="col-4"><p className="pt-2 otherFontSize" style={{borderBottom:"1px solid #000",wordBreak:"break-all"}} >{functionForYesNoNullSpouse(9)}</p></div>
        </div>
        <div className="row mb-2">
            <div className="col-3"><label>After you retire, what will your life's purpose be?</label></div>
             <div className="col-4"><p className="pt-2 otherFontSize" style={{borderBottom:"1px solid #000",wordBreak:"break-all"}}>{functionForYesNoNull(10)}</p></div>
            <div className="col-4"><p className="pt-2 otherFontSize" style={{borderBottom:"1px solid #000",wordBreak:"break-all"}}>{functionForYesNoNullSpouse(10)}</p></div>
        </div>

        <div className="row">
          <div className="col-3">
            <label>Do you have good eating habbits?</label>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-eh-1" type="checkbox" />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-eh-2" type="checkbox" />
              <label className="form-check-label">No</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-eh-3" type="checkbox" />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-eh-4" type="checkbox" />
              <label className="form-check-label">No</label>
            </div>
          </div>
        </div>       

        <div className="row">
          <div className="col-3">
            <label>Do You have daily social interaction?</label>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-si-1" type="checkbox" />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-si-2" type="checkbox" />
              <label className="form-check-label">No</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-si-3" type="checkbox" />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-si-4" type="checkbox" />
              <label className="form-check-label">No</label>
            </div>
          </div>
        </div>

        <div className="row paddTop">
          <div className="col-3">
            <label>Do you use drugs recreationally?</label>
          </div>
          <div className="col">
            <div className="form-check">
             <input className="form-check-input" id="check-du-1" checked={(personalLifeStyle.length > 0 && personalLifeStyle.some(v => v.questionId == 11 && v.response == "Yes"))} type="checkbox" />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-du-2" checked={(personalLifeStyle.length > 0 && personalLifeStyle.some(v => v.questionId == 11 && v.response == "No"))} type="checkbox" />
              <label className="form-check-label">No</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-du-3" type="checkbox" checked={(spouseCurrentLifeStyle.length > 0 && spouseCurrentLifeStyle.some(v => v.questionId == 11 && v.response == "Yes"))}/>
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-du-4" type="checkbox" checked={(spouseCurrentLifeStyle.length > 0 && spouseCurrentLifeStyle.some(v => v.questionId == 11 && v.response == "No"))}/>
              <label className="form-check-label">No</label>
            </div>
          </div>
        </div>

        <br/>

        <div className="row paddTop">
          <div className="col-3">
            <label>Do you currently smoke?</label>
          </div>
          <div className="col">
            <div className="form-check">
             <input className="form-check-input" id="check-ysmoke-1" checked={(personalLifeStyle.length > 0 && personalLifeStyle.some(v => v.questionId == 12 && v.response == "Yes"))} type="checkbox" />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
               <input className="form-check-input" id="check-ysmoke-2" checked={(personalLifeStyle.length > 0 && personalLifeStyle.some(v => v.questionId == 12 && v.response == "No"))} type="checkbox" />
              <label className="form-check-label">No</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-ysmoke-3" type="checkbox" checked={(spouseCurrentLifeStyle.length > 0 && spouseCurrentLifeStyle.some(v => v.questionId == 12 && v.response == "Yes"))}/>
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-ysmoke-4" type="checkbox" checked={(spouseCurrentLifeStyle.length > 0 && spouseCurrentLifeStyle.some(v => v.questionId == 12 && v.response == "No"))}/>
              <label className="form-check-label">No</label>
            </div>
          </div>
        </div>
       <div className="row paddTop pt-2">
          <div className="col-3">
            <label>Have you ever smoked?</label>
          </div>
        {functionForYesNoNull(12) == "No" ?  <>
          <div className="col">
            <div className="form-check">
             <input className="form-check-input" id="check-ysmoke-1" checked={(personalLifeStyle.length > 0 && personalLifeStyle.some(v => v.questionId == 239 && v.response == "Yes"))} type="checkbox" />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
               <input className="form-check-input" id="check-ysmoke-2" checked={(personalLifeStyle.length > 0 && personalLifeStyle.some(v => v.questionId == 239 && v.response == "No"))} type="checkbox" />
              <label className="form-check-label">No</label>
            </div>
          </div>
          </> : 
          <>
          <div className="col">
            <div className="form-check">
             <input className="form-check-input" id="check-ysmoke-1" checked='' type="checkbox" />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
               <input className="form-check-input" id="check-ysmoke-2" checked='' type="checkbox" />
              <label className="form-check-label">No</label>
            </div>
          </div>
          </>}
         { functionForYesNoNullSpouse (12) == "No" ? <>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-ysmoke-3" type="checkbox" checked={(spouseCurrentLifeStyle.length > 0 && spouseCurrentLifeStyle.some(v => v.questionId == 239 && v.response == "Yes"))}/>
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-ysmoke-4" type="checkbox" checked={(spouseCurrentLifeStyle.length > 0 && spouseCurrentLifeStyle.some(v => v.questionId == 239 && v.response == "No"))}/>
              <label className="form-check-label">No</label>
            </div>
          </div>
          </>  :
           <>
           <div className="col">
             <div className="form-check">
               <input className="form-check-input" id="check-ysmoke-3" type="checkbox" checked= ''/>
               <label className="form-check-label">Yes</label>
             </div>
           </div>
           <div className="col">
             <div className="form-check">
               <input className="form-check-input" id="check-ysmoke-4" type="checkbox" checked=''/>
               <label className="form-check-label">No</label>
             </div>
           </div>
           </>
          }
        </div>
       { (functionForYesNoNull(239) == "Yes" || functionForYesNoNullSpouse(239) == "Yes") && (functionForYesNoNull (12) == "No" || functionForYesNoNullSpouse(12) == "No" ) && <div className="row pt-2">
          <div className="col-3">
            <label>When did you quit smoking?</label>
          </div>
          
          <div className="col-4"> {functionForYesNoNull(239) == "Yes" && <input id="txt-q-smoke-1" value={functionForYesNoNull(240)}></input>}</div>
        <div className="col-4"> {functionForYesNoNullSpouse (239) == "Yes" && <input id="txt-q-smoke-2" value={functionForYesNoNullSpouse(240)}></input>}</div>
        </div> }

        <div className="row paddTop pt-3">
          <div className="col-3">
            <label>Do you consume alcohol?</label>
          </div>
          <div className="col">
            <div className="form-check">
             <input className="form-check-input" id="check-ysmoke-1" checked={(personalLifeStyle.length > 0 && personalLifeStyle.some(v => v.questionId == 13 && v.response == "Yes"))} type="checkbox" />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
               <input className="form-check-input" id="check-ysmoke-2" checked={(personalLifeStyle.length > 0 && personalLifeStyle.some(v => v.questionId == 13 && v.response == "No"))} type="checkbox" />
              <label className="form-check-label">No</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-ysmoke-3" type="checkbox" checked={(spouseCurrentLifeStyle.length > 0 && spouseCurrentLifeStyle.some(v => v.questionId == 13 && v.response == "Yes"))}/>
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input className="form-check-input" id="check-ysmoke-4" type="checkbox" checked={(spouseCurrentLifeStyle.length > 0 && spouseCurrentLifeStyle.some(v => v.questionId == 13 && v.response == "No"))}/>
              <label className="form-check-label">No</label>
            </div>
          </div>
        </div>

       { (functionForYesNoNull(13) != "No" || functionForYesNoNullSpouse(13) != "No") && <div className="row paddBottom">
          <div className="col-3">
            <label>How many alcoholic drinks do you consume in a week?</label>
          </div>
           { functionForYesNoNull(13) != "No"  && <div className="col-4"><input id="txt-alc-1" value={NumberOfAlcoholicDrinksPerWeek(personalLifeStyle) || ""}></input></div>}
           { functionForYesNoNullSpouse(13) != "No" && <div className="col-4"><input id="txt-alc-2" value={NumberOfAlcoholicDrinksPerWeek(spouseCurrentLifeStyle) || ""}></input></div>}
        </div>}

        { (functionForYesNoNull(13) != "No"  || functionForYesNoNullSpouse(13) != "No") && <div className="row">
            <div className="col-3"><label>Which of these do you drink?</label></div>
            {functionForYesNoNull(13) != "No"  &&  <div className="col-4"><input id="txt-ex-1" value={functionForYesNoNull(95)}></input></div>}
            { functionForYesNoNullSpouse(13) != "No" && <div className="col-4"><input id="txt-ex-2" value={functionForYesNoNullSpouse(95)}></input></div>}
        </div>}
        



      </div>
    </div>
  );
};

export default FamilyMedicalHistoryComponent;
