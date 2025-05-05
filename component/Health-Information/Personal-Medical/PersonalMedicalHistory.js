import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CustomAccordion, CustomAccordionBody } from "../../Custom/CustomAccordion";
import { CustomSelect } from "../../Custom/CustomComponent";
import PersonalMedicalCondition from "./PersonalMedicalCondition";
import EnvironmentLifestyle from "./EnvironmentLifestyle";
import { useAppDispatch, useAppSelector } from "../../Hooks/useRedux";
import { selectorHealth,selectPersonal } from "../../Redux/Store/selectors";
import { fetchBloodtype } from "../../Redux/Reducers/healthISlice";
import konsole from "../../../components/control/Konsole";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";
import { $Service_Url } from "../../../components/network/UrlPath";
import { getApiCall, isNotValidNullUndefile, postApiCall } from "../../../components/Reusable/ReusableCom";
import { CustomButton } from "../../Custom/CustomButton";
import MedicationTable from "./MedicationTable";
import { Row, Col } from 'react-bootstrap';
import { $JsonHelper } from "../../Helper/$JsonHelper";
import { useLoader } from "../../utils/utils";
import { globalContext } from "../../../pages/_app";
import { $AHelper } from "../../Helper/$AHelper";
import { HeaderOfPrimarySouseName } from "../../Personal-Information/PersonalInformation";

const allkeys = ["0", "1", "2", '3']

const PersonalMedicalHistory = ({ handleActiveTabMain, activeTab }) => {
  const [activeBtn, setActiveBtn] = useState(1);
  const healthApiData = useAppSelector(selectorHealth)
  const { primaryUserId, spouseUserId, primaryMemberFirstName, spouseFullName, spouseFirstName, isPrimaryMemberMaritalStatus } = usePrimaryUserId();
  let { bloodtypeList } = healthApiData;
  const [selectPrimaryBloodtype, setSelectPrimarybloodtype] = useState('')
  const [selectSpouseBloodtype, setSelecttSpousebloodtype] = useState('')
  const [formLabelData, setFormLabelData] = useState([]);
  const [formLabelData1, setFormLabelData1] = useState([]);
  const dispatch = useAppDispatch()
  const [hideAllAccordion, setHideAllAccrodian] = useState(false)
  const [editUser, setEdituser] = useState({ ...$JsonHelper.newFormDataObj() })
  const { setWarning } = useContext(globalContext);
  const [activeKeys, setActiveKeys] = useState(["0"]);
  const [showTable, setShowTable] = useState("")
  const personalReducer = useAppSelector(selectPersonal);
  const { primaryDetails} = personalReducer;
  const bloodTypeContent = `Please enter your ${activeBtn == 2 ? "spouse's" : ""} blood type (e.g., A+, B-, O, etc.). This information is essential for your ${activeBtn == 2 ? "spouse's" : ""} medical records and life planning to ensure accurate health management in case of emergencies.`
  const medicalConditionsContent = `Please provide details of any medical conditions ${activeBtn == 2 ? "your spouse" : "you"} currently have or have had in the past. This information will help in creating a personalized plan for your ${activeBtn == 2 ? "spouse's" : ""} health and well-being.`
  const environmentLifestyleContent = `Please provide details about your ${activeBtn == 2 ? "spouse's" : ""} environmental and lifestyle factors that may impact your ${activeBtn == 2 ? "spouse's" : ""} health and well-being.`
  const medicationAndSupplementsContent = `Please provide details of any medications and supplements ${activeBtn == 2 ? "your spouse" : "you"} are currently taking or have taken in the past. Include the medication name, dosage, frequency, and purpose. This information is essential for understanding your ${activeBtn == 2 ? "spouse's" : ""} overall health.`

  const userId = useMemo(() => {
    return activeBtn === 1 ? primaryUserId : spouseUserId;
  }, [activeBtn, primaryUserId, spouseUserId]);
  const medicalConditionRefPrimary = useRef(null);
  const medicalConditionRefSpouse = useRef(null);
  const environmentPrimaryLifestyleRef = useRef(null)
  const environmentSpouseLifestyleRef = useRef(null)


  useEffect(() => {
    getUserDeatilsById(primaryUserId,setSelectPrimarybloodtype,setFormLabelData)
    getUserDeatilsById(spouseUserId,setSelecttSpousebloodtype,setFormLabelData1)
    fetchApi();
    setSelecttSpousebloodtype('')
    setSelectPrimarybloodtype('')
    
  }, [primaryUserId,spouseUserId])
  
  const getUserDeatilsById=(userIds,setUserData,setFormLabelDataNew)=>{
    if(isNotValidNullUndefile(userIds)){     
      getSubjectData(userIds,setUserData,setFormLabelDataNew)
    }

  }

  const fetchApi = () => {
    if (bloodtypeList.length == 1) {
      dispatch(fetchBloodtype())
    }
  }

  const getSubjectData = async (userId,setUserData,setFormLabelDataNew) => {
    useLoader(true)
    const [responseSubjectData, responseGetApi] = await Promise.all([
      getApiCall('GET', `${$Service_Url.getSubjectResponse}${userId}/0/0/0`),
      postApiCall('POST', $Service_Url.getsubjectForFormLabelId, [1014])
    ]);
    // konsole.log("responseSubjectData",responseSubjectData)
    useLoader(false)
    konsole.log(formLabelData, "formLabelDataformLabelData", userId)

    const userSubjects = responseSubjectData.userSubjects || [];
    let formLabelData = responseGetApi !== "error" ? responseGetApi.data.data : [];
    const updatedFormLabelData = formLabelData.map(label => {
      userSubjects.forEach(subject => {
        if (label.question?.questionId === subject.questionId) {
          if (subject.responseNature === "Radio") {
            label.question.response.forEach((response, index) => {
              if (response.responseId === subject.responseId) {
                label.question.response[index].checked = true;
                label.userSubjectDataId = subject.userSubjectDataId;
              }
            });
          } else if (subject.responseNature === "Text") {
            label.question.response.forEach((response, index) => {
              if (response.responseId === subject.responseId) {
                label.question.response[index].response = subject.response;
                label.userSubjectDataId = subject.userSubjectDataId;
                setUserData(subject.response)
              }
            });
          }
          label.responseNature = subject.responseNature;
        }
      });
      return label;
    });

    setFormLabelDataNew(updatedFormLabelData);
  };

  const SubmitData = async() => {
    useLoader(true)
     const bloodType = await postBloodTypePrimarySpouse(selectPrimaryBloodtype,formLabelData,primaryUserId) ///////primary
       isPrimaryMemberMaritalStatus && postBloodTypePrimarySpouse(selectSpouseBloodtype,formLabelData1,spouseUserId)  ////////spouse
       await  medicalConditionRefPrimary?.current?.submitData();
       isPrimaryMemberMaritalStatus ?  await medicalConditionRefSpouse?.current?.submitData() : "";
       await  environmentPrimaryLifestyleRef?.current?.SubmitData();
       isPrimaryMemberMaritalStatus ? await  environmentSpouseLifestyleRef?.current?.SubmitData() : "";
        if(bloodType != "error") {
          useLoader(false)
          toasterAlert('successfully', 'Successfully saved data', 'Your data have been saved successfully')
          handleActiveTabMain(6)
         }
         useLoader(false)
  };

  const postBloodTypePrimarySpouse = async(bloodType,formLabelDatas,newUserId)=>{
    let userSubjectarray = formLabelDatas.map((e) => {
      return {
        "userSubjectDataId": e.userSubjectDataId,
        "subjectId": e.subjectId,
        "subResponseData": bloodType,
        "responseId": e.question.response[0].responseId
      }
    })
    userSubjectarray = userSubjectarray?.filter((ele)=> isNotValidNullUndefile(ele?.subjectId) && isNotValidNullUndefile(ele?.subResponseData) && isNotValidNullUndefile(ele?.responseId))    


    let jsonObj = {
      userId: newUserId,
      userSubjects: userSubjectarray
    }
   
   if(userSubjectarray.length > 0){
    return new Promise((resolve, reject) => {
      const postSubjectresponse = postApiCall('PUT', $Service_Url.putSubjectResponse, jsonObj);
      resolve(postSubjectresponse)    
      
    })
   }
  }

  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  }

  let noneObj = { value: 10, label: "None" };

  if (bloodtypeList && Object.isExtensible(bloodtypeList)) {
    bloodtypeList.push(noneObj);
  } else {
    bloodtypeList = (bloodtypeList || []).concat(noneObj);
  }

  const handleAccordionClick = () => {
    setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
};

const handleAccordionBodyClick = (key) => {
    setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
};


// new ui  combine primary spouse

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


  return (
    activeTab == 6 ? <>

    {/* PRIMARY MEMBER SECTION */}

    { (showTable == primaryUserId || showTable == "" ) && <div>
 
    {hideAllAccordion != true && ( <div className="col-auto">
      <span className="heading-of-sub-side-links-2" style={{ fontSize: "12px" }}>View and add/edit your primary's
      {isPrimaryMemberMaritalStatus && ` ${primaryDetails.maritalStatusId == 2 ? " and partner's" : " and spouse's"}`}{" "}
      {activeTab == 6 ? "Medication & Supplements" : "Personal Medical History"}.</span>
  </div>
  )}

    <MedicationTable userId={primaryUserId} activeBtn={activeBtn} setActiveBtn={setActiveBtn} handleActiveTabMain={handleActiveTabMain} setHideAllAccrodian={setHideAllAccrodian}
     editUser={editUser} setEdituser={setEdituser} medicationAndSupplementsPlaceholder={medicationAndSupplementsContent} submitForm={SubmitData} setShowTable={setShowTable} />
     </div> }
     
     {/* SPOUSE MEMBER SECTION */}

  { (showTable == spouseUserId || showTable == "" ) && isPrimaryMemberMaritalStatus  && <div>  
     <MedicationTable userId={spouseUserId} activeBtn={activeBtn} setActiveBtn={setActiveBtn} handleActiveTabMain={handleActiveTabMain} setHideAllAccrodian={setHideAllAccrodian}
     editUser={editUser} setEdituser={setEdituser} medicationAndSupplementsPlaceholder={medicationAndSupplementsContent} submitForm={SubmitData} setShowTable={setShowTable} />
      </div> }

    </> :
      <>
        <div style={{ marginTop: "-47px" }} className="personalMedical">


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
                  <span className="heading-of-sub-side-links-2">View and add/edit your {activeTab == 6 ? 'Medication & Supplyments' : 'Personal Medical History'}.</span>
                </div>
                {(isPrimaryMemberMaritalStatus  && activeTab !== 1) &&
                  <div className="d-flex align-items-end justify-content-end" style={{ margin: "-62px 73px 24px" }}>
                    <div className="btn-div addBorderToToggleButton ms-auto" >
                      <button className={`view-btn ${activeBtn == 1 ? "active selectedToglleBorder" : ""}`} onClick={() => setActiveBtn(1)}> {primaryMemberFirstName}</button>
                      <button className={`view-btn ${activeBtn == 2 ? "active selectedToglleBorder" : ""}`} onClick={() => setActiveBtn(2)} > {spouseFirstName}</button>
                    </div>
                  </div>
                }
             
              </div>
              {/* {displaySpouseContent &&  <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi} />} */}
            </>
            {activeTab == 1 && <>
              <CustomAccordionBody eventkey="0" name="Blood Type" key={activeBtn} setActiveKeys={() => handleAccordionBodyClick('0')} >
                <Row className='personalInformation' id='personalinformation'>
                  {/* @@ FIrst time display Relationship */}

                  <Col xs={12} md={12} xl={3}>
                    <div className="heading-of-sub-side-links-3">{bloodTypeContent}</div>
                  </Col>
                  <Col xs={12} md={12} xl={9}>
                    {/* @@ Primary SpouseName */}
                    {isPrimaryMemberMaritalStatus &&
                      <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi} isGap={true} />
                    }
                    {/* @@ Primary SpouseName */}
                    <Row className={`d-flex ${isPrimaryMemberMaritalStatus ? "mt-3 mb-4" : ""}`}>
                      <Col xs={12} md={12} xl={6} {...mdxlUi} className={!isPrimaryMemberMaritalStatus ? "ps-4" : ""}>
                        <CustomSelect tabIndex={1} label="Blood Type" placeholder="Select" options={bloodtypeList} onChange={(e) => setSelectPrimarybloodtype(e.value)} value={selectPrimaryBloodtype} />

                      </Col>
                      {isPrimaryMemberMaritalStatus &&
                      <Col xs={12} md={12} xl={6} {...mdxlUi}>
                        <CustomSelect tabIndex={2} label="Blood Type" placeholder="Select" options={bloodtypeList} onChange={(e) => setSelecttSpousebloodtype(e.value)} value={selectSpouseBloodtype} />

                      </Col>
                     }
                    </Row>
                  </Col>
                </Row>
              </CustomAccordionBody>
                <CustomAccordionBody eventkey="1" name="Medical Conditions" key={activeBtn} setActiveKeys={() => handleAccordionBodyClick('1')}>
                <Row className='personalInformation' id='personalinformation'>
                  {/* @@ FIrst time display Relationship */}

                  <Col xs={12} md={12} xl={3}>
                    <div className="heading-of-sub-side-links-3">{medicalConditionsContent}</div>
                  </Col>
                  <Col xs={12} md={12} xl={9}>
                    {/* @@ Primary SpouseName */}
                    {isPrimaryMemberMaritalStatus &&
                      <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi} isGap={true} />
                    }


                    {/* @@ Primary SpouseName */}
                    <Row className={`d-flex ${isPrimaryMemberMaritalStatus ? "mt-3 mb-4" : ""}`}>
                      <Col xs={12} md={12} xl={6} {...mdxlUi}>
                        <PersonalMedicalCondition startTabIndex={3} userId={primaryUserId} ref={medicalConditionRefPrimary} isPrimaryMemberMaritalStatus={isPrimaryMemberMaritalStatus}/>

                      </Col>
                      {isPrimaryMemberMaritalStatus &&
                      <Col xs={12} md={12} xl={6} {...mdxlUi}>
                      <PersonalMedicalCondition startTabIndex={3 + 4} userId={spouseUserId} ref={medicalConditionRefSpouse}/>

                      </Col>
                      }
                    </Row>
                  </Col>
                </Row>
                  {/* <PersonalMedicalCondition userId={userId} ref={medicalConditionRef} medicalConditionsPlaceholder={medicalConditionsContent} /> */}
                </CustomAccordionBody>
                <CustomAccordionBody eventkey="2" name="Environmental & Lifestyle Factors" key={activeBtn} setActiveKeys={() => handleAccordionBodyClick('2')} >
                <Row className='personalInformation' id='personalinformation'>
                  {/* @@ FIrst time display Relationship */}

                  <Col xs={12} md={12} xl={3}>
                    <div className="heading-of-sub-side-links-3">{medicalConditionsContent}</div>
                  </Col>
                  <Col xs={12} md={12} xl={9}>
                    {/* @@ Primary SpouseName */}
                    {isPrimaryMemberMaritalStatus &&
                      <HeaderOfPrimarySouseName displaySpouseContent={environmentLifestyleContent} mdxlUi={mdxlUi} isGap={true} />
                    }
                    {/* @@ Primary SpouseName */}
                    <Row className={`d-flex ${isPrimaryMemberMaritalStatus ? "mt-3" : ""}`}>
                      <Col xs={12} md={12} xl={6} {...mdxlUi}>
                  <EnvironmentLifestyle startTabIndex={3 + 4 + 4}  userId={primaryUserId} ref={environmentPrimaryLifestyleRef}/>

                      </Col>
                      {isPrimaryMemberMaritalStatus &&
                      <Col xs={12} md={12} xl={6} {...mdxlUi}>
                     <EnvironmentLifestyle startTabIndex={3 + 4 + 4 + 2} userId={spouseUserId} ref={environmentSpouseLifestyleRef}/>
                      </Col>
                    }
                    </Row>
                  </Col>
                </Row>
                  {/* <EnvironmentLifestyle userId={userId} ref={environmentLifestyleRef} environmentLifestylePlaceholder={environmentLifestyleContent} /> */}
                </CustomAccordionBody>
            </>}
          </CustomAccordion>
          <div className="d-flex justify-content-end mt-4">
            {/* {(isPrimaryMemberMaritalStatus) && activeBtn == 1 ? <CustomButton label={`Save & Next: ${spouseFullName} medical history`} onClick={() => { SubmitData('nextSpouse') }} /> : <CustomButton label="Save & Next: Lifestyle" onClick={() => SubmitData('nextLifestyle')} />} */}
            {<CustomButton tabIndex={3 + 4 + 4 + 2 + 2} label={`Save & Proceed to ${activeTab == 1 ? 'LifeStyle' : 'Family Medical History'}`} onClick={() => SubmitData('FamilyMedicalHistory')} />}
          </div>
        </div>
      </>
  )
}

export default PersonalMedicalHistory;