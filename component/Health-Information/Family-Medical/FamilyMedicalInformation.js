import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import ParentInformation from "./ParentInformation";
import { CustomAccordion, CustomAccordionBody } from "../../Custom/CustomAccordion";
import SiblingInformation from "./SiblingInformation";
import FamilyMedicalHistory from "./FamilyMedicalHistory.js";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId.js";
import { useAppSelector } from "../../Hooks/useRedux.js";
import { selectorHealth } from "../../Redux/Store/selectors.js";
import { getApiCall, isNotValidNullUndefile, postApiCall } from "../../../components/Reusable/ReusableCom.js";
import { $Service_Url } from "../../../components/network/UrlPath.js";
import konsole from "../../../components/control/Konsole.js";
import { CustomButton } from "../../Custom/CustomButton.js";
import { useLoader } from "../../utils/utils.js";
import { globalContext } from "../../../pages/_app.js";
import { $JsonHelper } from "../../Helper/$JsonHelper.js";
import { $AHelper } from "../../Helper/$AHelper.js";
import { familyMedicalHistry } from "../../../components/control/Constant.js";
import { $ApiHelper } from "../../Helper/$ApiHelper.js";
import { Row, Col } from 'react-bootstrap';
import { HeaderOfPrimarySouseName } from "../../Personal-Information/PersonalInformation.js";

const allkeys = ["0", "1", "2"]
const FamilyMedicalInformation = ({ handleActiveTabMain }) => {
  const { setWarning } = useContext(globalContext)
  const { primaryUserId,primaryDetails ,spouseUserId, loggedInUserId, primaryMemberFirstName, spouseFullName, spouseFirstName, isPrimaryMemberMaritalStatus ,_spousePartner} = usePrimaryUserId();
  const healthApiData = useAppSelector(selectorHealth);
  const { familyFetchMedicalHistory } = healthApiData;
  const [activeBtn, setActiveBtn] = useState(1);
  const accordionName = activeBtn === 1 ? "My" : $AHelper. $capitalizeFirstLetter(_spousePartner) ;
  const [primaryFatherData, setPrimaryFatherData] = useState([$JsonHelper.medicalHistoryObj()]);
  const [primaryMotherData, setPrimaryMotherData] = useState([$JsonHelper.medicalHistoryObj()]);
  const [primarySiblingData,setPrimarytSiblingData] = useState([$JsonHelper.medicalHistoryObj()]);
  const [spouseFatherData, setSpouseFatherData] = useState([$JsonHelper.medicalHistoryObj()]); ///////////fro spouse
  const [spouseMotherData, setSpouseMotherData] = useState([$JsonHelper.medicalHistoryObj()]);
  const [spouseSiblingData,setSpouseSiblingData] = useState([$JsonHelper.medicalHistoryObj()]);
  const siblingPrimaryRef = useRef();
  const siblingSpouseRef = useRef();
  const parentPrimaryRef = useRef();
  const parentSpouseRef = useRef();
  const [activeKeys, setActiveKeys] = useState(["0"]);
  const [formLabelData, setFormLabelData] = useState([])
  const [formLabelData1, setFormLabelData1] = useState([])
  // const [formResponse, setFormResponse] = useState({ label1041: ''});
  const [formResponseForPrimary, setFormResponseForPrimary] = useState({ label1041: ''});
  const [formResponseForSpouse, setFormResponseForSpouse] = useState({ label1041: ''});
  const userId = useMemo(() => {
    return activeBtn == 1 ? primaryUserId : spouseUserId;
  }, [activeBtn, primaryUserId, spouseUserId]);
  const familyMedHistParentPlaceholder = `Provide your ${activeBtn == 2 ? "Spouse's" : ""} parent’s living status and age. This information helps us assess your family health history and potential hereditary factors, allowing us to understand your unique background and guide you appropriately in your aging and care planning.`
  const familyMedHistSiblingPlaceholder = `Understanding your ${activeBtn == 2 ? "Spouse's" : ""} sibling information helps us evaluate family health trends, enabling us to better comprehend your potential health risks and guide you appropriately in your aging journey.` 
  const familyMedHistPlaceholder = `Indicate any known medical conditions in your ${activeBtn == 2 ? "Spouse's" : ""} family. This helps identify hereditary risks, allowing us to understand your health profile and guide you appropriately with personalized planning and preventive measures as you age.`

  useEffect(() => {
    getPrimarySpouseData(primaryUserId,setPrimaryFatherData,setPrimaryMotherData,setPrimarytSiblingData)
    isPrimaryMemberMaritalStatus && getPrimarySpouseData(spouseUserId,setSpouseFatherData,setSpouseMotherData,setSpouseSiblingData)
    // konsole.log(userId,activeBtn,"activeBtn")
  }, [primaryUserId,spouseUserId, isPrimaryMemberMaritalStatus]);

  const getPrimarySpouseData = (userID,setFatherDatas,setMotherDatas,setSiblingDatas)=>{
    if (isNotValidNullUndefile(userID)) {
      fetchApi(userID,setFatherDatas,setMotherDatas,setSiblingDatas);
      getSubjectData(userID);
    }
    setFatherDatas([$JsonHelper.medicalHistoryObj()])
    setMotherDatas([$JsonHelper.medicalHistoryObj()])
    setSiblingDatas([$JsonHelper.medicalHistoryObj()])
  }


// To check the data which is saved before applying the Are you adopted question functionlaity, and show No by default when their is some old saved data
  const checkOldData = (dataArray) => {
    return dataArray?.some(item => $AHelper?.$isNotNullUndefine(item.medicalHistId) && item.medicalHistId != 0);
  };

  const showAdoptRadioValueWhenDataIsOld = (formData,userId) =>{
    const checkOldFatherDataArr = checkOldData(userId == primaryUserId ? primaryFatherData : spouseFatherData);
    const checkOldMotherDataArr = checkOldData(userId == primaryUserId ? primaryMotherData : spouseFatherData);
   const checkOldSiblingDataArr = checkOldData(userId == primaryUserId ? primarySiblingData:spouseSiblingData);
    const checkOldQuestionData = formData?.some(item => item?.hasOwnProperty("userSubjectDataId") && $AHelper?.$isNotNullUndefine(item?.userSubjectDataId))
    konsole.log("checkOldData",formData,checkOldQuestionData,checkOldFatherDataArr,checkOldMotherDataArr,checkOldSiblingDataArr)
    if((checkOldFatherDataArr || checkOldMotherDataArr || checkOldSiblingDataArr) && checkOldQuestionData){
      setAdoptedRadioToNo(userId)
    }
  }
 
  const setAdoptedRadioToNo = (userId) =>{
    const objForOldData = {
      [`label${1041}`]: {"categoryId": null,
      "resFormLabelId" : 282,
      "resScore": 0,
      "response" : "No",
      "responseId": 464,
      "responseNature": "Radio",
      "responseNatureId": 1,
      "topicId": null}
  }
    if(userId == primaryUserId){
      setFormResponseForPrimary(objForOldData)
    }
    else if(userId == spouseUserId){
      setFormResponseForSpouse(objForOldData)
    }
  }

  const fetchApi = async (userId,setFatherDatas,setMotherDatas,setSiblingDatas) => {
    if (familyFetchMedicalHistory?.length > 0) return;

    useLoader(true)
    const result = await getApiCall('GET', `${$Service_Url.getuserfamilyHistory}${userId}/2`);
    const checkAddedData = result.userMedHistory?.some(
      (item) => item?.diseaseId != null && item?.isSuffering === true
    );
  
    useLoader(false)
    if (result !== "err" && result.userMedHistory.length > 0) {
      const familyData = result.userMedHistory;
      const fatherLiving = familyData?.filter(e => e.relationshipId === 9);
      const motherLiving = familyData?.filter(e => e.relationshipId === 10);
      const siblingLiving = familyData?.filter(e => e.relationshipId === 11);
     
      console.log(familyData, "Filtered family data");

      fatherLiving.length > 0 && setFatherDatas(fatherLiving)
      motherLiving.length > 0 && setMotherDatas(motherLiving)
      siblingLiving.length > 0 && setSiblingDatas(siblingLiving)
    }
    else{
      setFatherDatas([$JsonHelper.medicalHistoryObj()])
      setMotherDatas([$JsonHelper.medicalHistoryObj()])
      setSiblingDatas([$JsonHelper.medicalHistoryObj()])
    }

    // When In My family history the medical condition data is filled for old users than Are you adopted "No" radio will shown selected by default
    if(checkAddedData == true){
      // setAdoptedRadioToNo(userId)  
    }
  };

  const runApis = async(method,url,jsonData)=>{
    return new Promise(async(resolve, reject) => {
      const updateMedicalInfop = await postApiCall(method, url, jsonData);

      if (updateMedicalInfop !== "err") {
          resolve(updateMedicalInfop)
        toasterAlert('successfully', 'Successfully saved data', 'Your data have been saved successfully')
      
      }
      
    })
  }


  


const submitData = async (type) => {
    const fetchData = async (ref) => ref?.current?.submitData();
    
  
    const [parentPrimaryData, parentSpouseData, siblingPrimaryData, siblingSpouseData] = await Promise.all([
        fetchData(parentPrimaryRef),fetchData(parentSpouseRef),fetchData(siblingPrimaryRef),fetchData(siblingSpouseRef),
    ]);
  
    

  const combinedPrimaryData = [
    ...parentPrimaryData?.fatherData || [],
    ...parentPrimaryData?.motherData || [],
    ...(Array.isArray(siblingPrimaryData) ? siblingPrimaryData : [])
];

const combinedSpouseData = [
    ...parentSpouseData?.fatherData || [],
    ...parentSpouseData?.motherData || [],
    ...(Array.isArray(siblingSpouseData) ? siblingSpouseData : [])
];

await Promise.all([
    submitMedicalHistory(primaryUserId, combinedPrimaryData.flat()),  // Primary Combined Data
    submitMedicalHistory(spouseUserId, combinedSpouseData.flat())     // Spouse Combined Data
]);

   console.log(parentPrimaryData, parentSpouseData, siblingPrimaryData, siblingSpouseData,"parentPrimaryData, parentSpouseData, siblingPrimaryData, siblingSpouseData")
          await SubmitSubjectData(primaryUserId,formLabelData,formResponseForPrimary);
          isPrimaryMemberMaritalStatus &&  await SubmitSubjectData(spouseUserId,formLabelData1,formResponseForSpouse)
          handleActiveTabMain(5);
};
 const submitMedicalHistory = async (userId, medHistoryList) => { 
  if (!medHistoryList?.length) return;  
  useLoader(true);
  const response = await postApiCall('POST', $Service_Url.upsertUserMedHistory, {
      userId,
      userMedHistories: medHistoryList.filter((e) => Object.keys(e).length > 0 && e?.relationshipId !== 0),
      upsertedBy: loggedInUserId,
  });
  useLoader(false);

  if (response !== "err") {
      toasterAlert('successfully', 'Successfully saved data', 'Your data have been saved successfully');
  }
 }; 
 const SubmitSubjectData =async (newuserid,formLebaldatanew,formlabelDataForPrimaryspouse) =>{
    let userSubjectarray = formLebaldatanew.map((e)=> {
      return{
        "userSubjectDataId":formlabelDataForPrimaryspouse[`label${e.formLabelId}`]?.userSubjectDataId ?? 0,
        "subjectId":e.subjectId,
        "subResponseData": formlabelDataForPrimaryspouse[`label${e.formLabelId}`]?.response,
        "responseId": formlabelDataForPrimaryspouse[`label${e.formLabelId}`]?.responseId,
      }
    })

    let arrayToDelete = userSubjectarray.filter((data)=>(data.responseId == undefined))
   
    if(arrayToDelete.length > 0){
      arrayToDelete = arrayToDelete.map((data)=>({userSubjectDataId:data.userSubjectDataId}))
      arrayToDelete = arrayToDelete.filter((ele)=> ele?.userSubjectDataId != 0)
      if(arrayToDelete.length > 0){
        await postApiCall("DELETE", $Service_Url.deleteSubjectUser+"?UserId="+newuserid, arrayToDelete);
      }
   
      userSubjectarray=userSubjectarray.filter((data)=>data.responseId != undefined)
    }
   

    let jsonObj = {
      userId:newuserid,
      userSubjects:userSubjectarray
    }
    if(userSubjectarray.length > 0){
      useLoader(true)
      const postSubjectresponse = postApiCall('PUT',$Service_Url.putSubjectResponse,jsonObj);    
      useLoader(false)
      if(postSubjectresponse != "err"){
       
      }
    }
    getSubjectData(newuserid);
   
  }

  const handleAccordionClick = () => {
    setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
};

const handleAccordionBodyClick = (key) => {
    setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
};

const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  }

 const updateStates = async (userIds,relationshipIds) => {
  const isPrimary = userIds == primaryUserId;
  const parentData = await (isPrimary ? parentPrimaryRef : parentSpouseRef)?.current?.submitData();
  const siblingData = await (isPrimary ? siblingPrimaryRef : siblingSpouseRef)?.current?.submitData();

  // console.log(parentData,siblingData,userIds == primaryUserId,relationshipIds,"parentDatasiblingData")
   if(isPrimary){
    if(relationshipIds == 9 || relationshipIds == 10){
      setPrimaryFatherData(parentData?.fatherData)
      setPrimaryMotherData(parentData?.motherData)
    }else{
      setPrimarytSiblingData(siblingData)
    }
   }else{
    if(relationshipIds == 9 || relationshipIds == 10){
      setSpouseFatherData(parentData?.fatherData)
      setSpouseMotherData(parentData?.motherData)
    }else{
      setSpouseSiblingData(siblingData)
    }
   }
}


  const handleInputChange = (value, key,id) => { 
    if(id == primaryUserId){
      setFormResponseForPrimary(prevState => ({
        ...prevState,
        [`label${key}`]: {
            ...prevState[`label${key}`], // Preserve other properties inside the label
            responseId: value?.responseId,           // Update the specific key
            response: value?.response,           // Update the specific key
        },
    }));
    }
    else if(id == spouseUserId){
      setFormResponseForSpouse(prevState => ({
        ...prevState,
        [`label${key}`]: {
            ...prevState[`label${key}`], // Preserve other properties inside the label
            responseId: value?.responseId,           // Update the specific key
            response: value?.response,  
        },
    }));
    }
};

  // konsole.log("sdnzjkvbsd", formResponse)
  const getSubjectData = async (userId) => {
    useLoader(true)
    const resultOf = await $ApiHelper.$getSujectQuestions(familyMedicalHistry?.formLabelId);
    konsole.log("formLabelData1212",resultOf)
    const resultOfRes = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicId({ questions: resultOf, memberId: userId, topicId: 18 });
    useLoader(false)
    // setFormResponse({ label1041: ''});
    // konsole.log("sdnzjkvbsd", userId);
    const userSubjects = resultOfRes.userSubjects || [];
    let formLabelData = resultOf !== "err" ? resultOf : [];
    showAdoptRadioValueWhenDataIsOld(formLabelData,userId)
    konsole.log("formLabelData121233",resultOfRes,formLabelData)

    const updatedFormLabelData = formLabelData.map(label => {
        userSubjects.forEach(subject => {
            if (label.question?.questionId === subject.questionId) {
                if (subject.responseNature === "Radio") {
                    label.question.response.forEach((response, index) => {
                        if (response.responseId === subject.responseId) {
                            label.question.response[index].checked = true;
                            label.userSubjectDataId = subject.userSubjectDataId;
                            konsole.log("sbvbks", subject, response);
                            if(resultOfRes?.userId == primaryUserId){
                              setFormResponseForPrimary(prevState => ({
                                  ...prevState,
                                  [`label${label.formLabelId}`]: {...subject, response: response?.response}
                              }));
                            }
                            else if(resultOfRes?.userId == spouseUserId){
                              setFormResponseForSpouse(prevState => ({
                                ...prevState,
                                [`label${label.formLabelId}`]: {...subject, response: response?.response}
                            }));
                            }
                        }
                    });
                }
                label.responseNature = subject.responseNature;
            }
        });
        return label;
    });
    // if(!isNotValidNullUndefile(updatedFormLabelData)){
        userId == primaryUserId  ? setFormLabelData(updatedFormLabelData) : setFormLabelData1(updatedFormLabelData)
    // }
};

  // konsole.log(siblingData,"faterhdate",fatherData)
const handleTab = (val) =>{
  setActiveBtn(val)
  if(val == 2 && $AHelper?.$isNullUndefine(formResponseForSpouse?.label1041?.userSubjectDataId)){
    setFormResponseForSpouse({ label1041: ''})
    setFormResponseForPrimary({ label1041: ''})
  }
  else if(val == 1 && $AHelper?.$isNullUndefine(formResponseForPrimary?.label1041?.userSubjectDataId)){
    setFormResponseForPrimary({ label1041: ''})
    setFormResponseForSpouse({ label1041: ''})
  }
}


/////////////////////new ui  combine primary spouse
const displaySpouseContent = useMemo(() => {
  let value = ((isPrimaryMemberMaritalStatus == true) || 
($AHelper.$isNotNullUndefine(spouseUserId)) && primaryDetails?.maritalStatusId == 4) ? true : false;
return value;
}, [isPrimaryMemberMaritalStatus, spouseUserId])

const mdxlUi = useMemo(() => {
return {
    md: spouseUserId ? 6 : 10,
    xl: spouseUserId ? (primaryDetails?.maritalStatusId == 3 ? 12 : 6) : 10,
};
}, [spouseUserId, primaryDetails?.maritalStatusId]);

//////////////////////////////////////////////////
// konsole.log("formLabelData13123",formLabelData)
// konsole.log("formResponseForPrimary",formResponseForPrimary)
// konsole.log("formResponseForSpouse",formResponseForSpouse)
  return (
    <>
      <div className="family-Info" style={{ marginTop: "-47px" }}>


        <CustomAccordion
          key={activeBtn}
          isExpendAllbtn={true}
          handleActiveKeys={handleAccordionClick}
          activeKeys={activeKeys}
          allkeys={allkeys}
          activekey={activeKeys}
          header={<></>}
        >
          <> 
      <div className="d-flex justify-content-between align-items-center">
          <div className="col-auto">
            <span className="heading-of-sub-side-links-2">View and add/edit your Family Medical History.</span>
          </div>
      {/* {(isPrimaryMemberMaritalStatus) &&
        <div className="d-flex align-items-end justify-content-end" style={{margin:"-35px 73px 24px"}}>
          <div className="btn-div addBorderToToggleButton ms-auto" >
            <button className={`view-btn ${activeBtn == 1 ? "active selectedToglleBorder" : ""}`} onClick={() => handleTab(1)}> {primaryMemberFirstName}</button>
            <button className={`view-btn ${activeBtn == 2 ? "active selectedToglleBorder" : ""}`} onClick={() => handleTab(2)} > {spouseFirstName}</button>
          </div>
        </div>
      } */}
      </div>
      </>

          <CustomAccordionBody name={`${accordionName} Parent Information`} setActiveKeys={() => handleAccordionBodyClick('0')} eventkey={'0'} isHeader = {true} header = {familyMedHistParentPlaceholder}>
            <Row className='personalInformation' id='personalinformation'>
              {/* @@ FIrst time display Relationship */}

              <Col xs={12} md={12} xl={12}>
                {/* @@ Primary SpouseName */}
                {isPrimaryMemberMaritalStatus &&
                  <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi} isGap={true} />
                }
                {/* @@ Primary SpouseName */}
                <Row className={`d-flex ${isPrimaryMemberMaritalStatus ? "mt-3 mb-4" : ""}`}>
                  <Col xs={12} md={12} xl={6} {...mdxlUi} className={!isPrimaryMemberMaritalStatus ? "ps-4" : ""}>
                    <ParentInformation
                     startTabIndex={1}
                      activeTab={accordionName}
                      fatherData={primaryFatherData}
                      motherData={primaryMotherData}
                      setFatherData={setPrimaryFatherData}
                      setMotherData={setPrimaryMotherData}
                      ref={parentPrimaryRef}
                    />
                  </Col>
                  {isPrimaryMemberMaritalStatus &&
                    <Col xs={12} md={12} xl={6} {...mdxlUi}>
                      <ParentInformation
                       startTabIndex={2 +5}
                      activeTab={accordionName}
                      fatherData={spouseFatherData}
                      motherData={spouseMotherData}
                      setFatherData={setSpouseFatherData}
                      setMotherData={setSpouseMotherData}
                      ref={parentSpouseRef}
                    />
                    </Col>
                  }
                </Row>
              </Col>
            </Row>
          </CustomAccordionBody>
          <CustomAccordionBody eventkey="1" setActiveKeys={() => handleAccordionBodyClick('1')} name={`${accordionName} Sibling Information`} isHeader = {true} header = {familyMedHistSiblingPlaceholder}>
           
              <Row className='personalInformation' id='personalinformation'>
              {/* @@ FIrst time display Relationship */}

              <Col xs={12} md={12} xl={12}>
                {/* @@ Primary SpouseName */}
                {isPrimaryMemberMaritalStatus &&
                  <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi} isGap={true} />
                }
                {/* @@ Primary SpouseName */}
                <Row className={`d-flex ${isPrimaryMemberMaritalStatus ? "mt-3 mb-4" : ""}`}>
                  <Col xs={12} md={12} xl={6} {...mdxlUi} className={!isPrimaryMemberMaritalStatus ? "ps-4" : ""}>
                    <SiblingInformation
                      startTabIndex={2 + 5 + 5}
                      siblingDataList={primarySiblingData}
                      setSiblingDataList={setPrimarytSiblingData}
                      ref={siblingPrimaryRef}
                    />
                  </Col>
                  {isPrimaryMemberMaritalStatus &&
                    <Col xs={12} md={12} xl={6} {...mdxlUi}>
                      <SiblingInformation
                        startTabIndex={2 + 5 + 5 + 2}
                        siblingDataList={spouseSiblingData}
                        setSiblingDataList={setSpouseSiblingData}
                        ref={siblingSpouseRef}
                      />
                    </Col>
                  }
                </Row>
              </Col>
            </Row>
          </CustomAccordionBody>
          <CustomAccordionBody eventkey="2" setActiveKeys={() => handleAccordionBodyClick('2')}name={`${accordionName} Family Medical History`} isHeader = {true} header = {familyMedHistPlaceholder}>
          
             <Row className='personalInformation' id='personalinformation'>
              {/* @@ FIrst time display Relationship */}


              <Col xs={12} md={12} xl={12}>
                {/* @@ Primary SpouseName */}
                {isPrimaryMemberMaritalStatus &&
                  <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi} isGap={true} />
                }
                {/* @@ Primary SpouseName */}
                <Row className={`d-flex ${isPrimaryMemberMaritalStatus ? "mt-3 mb-4" : ""}`}>
                  <Col xs={12} md={12} xl={6} {...mdxlUi} className={!isPrimaryMemberMaritalStatus ? "ps-4" : ""}>
                    <FamilyMedicalHistory
                      startTabIndex={2 + 5 + 5 + 2 + 2}
                      fatherData={primaryFatherData}
                      motherData={primaryMotherData}
                      siblingData={primarySiblingData}
                      setFatherData={setPrimaryFatherData}
                      setMotherData={setPrimaryMotherData}
                      setSiblingData={setPrimarytSiblingData}
                      updateStates={updateStates}
                      formLabelData={formLabelData}
                      formResponse={formResponseForPrimary}
                      handleSubjectInputChange={handleInputChange}
                      userId={primaryUserId}
                    />
                  </Col>
                  {isPrimaryMemberMaritalStatus &&
                    <Col xs={12} md={12} xl={6} {...mdxlUi}>
                      <FamilyMedicalHistory
                        startTabIndex={2 + 5 + 5 + 2 + 2 + 9}
                        fatherData={spouseFatherData}
                        motherData={spouseMotherData}
                        siblingData={spouseSiblingData}
                        setFatherData={setSpouseFatherData}
                        setMotherData={setSpouseMotherData}
                        setSiblingData={setSpouseSiblingData}
                        updateStates={updateStates}
                        formLabelData={formLabelData1}
                        formResponse={formResponseForSpouse}
                        handleSubjectInputChange={handleInputChange}
                        userId={spouseUserId}
                      />

                    </Col>
                  }
                </Row>
              </Col>
            </Row>
          </CustomAccordionBody>
          <div className="d-flex justify-content-end mt-4">
            <CustomButton tabIndex={2 + 5 + 5 + 2 + 2 + 9 +9} label="Save & Proceed to Primary Care Physician " onClick={() => submitData('nextLifestyle')} />
          </div>
        </CustomAccordion>
      </div>
    </>
  );
};

export default FamilyMedicalInformation;
