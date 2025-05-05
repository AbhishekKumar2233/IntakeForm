import React, { useEffect, useState, useMemo, useContext, useRef } from 'react';
import { CustomAccordion, CustomAccordionBody } from '../../Custom/CustomAccordion'
import { $AHelper } from '../../Helper/$AHelper'
import { useAppSelector } from '../../Hooks/useRedux';
import { $Service_Url } from '../../../components/network/UrlPath';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import LifeStyle from './LifeStyle';
import { useLoader } from '../../utils/utils';
import { selectPersonal } from '../../Redux/Store/selectors';
import { postApiCall, getApiCall } from '../../../components/Reusable/ReusableCom';
import { globalContext } from '../../../pages/_app'
import { health } from '../../../components/control/Constant';
import { CustomButton } from '../../Custom/CustomButton';
import { HeaderOfPrimarySouseName } from '../../Personal-Information/PersonalInformation';
import { Row, Col } from 'react-bootstrap';


const allkeys = ["0", "1", "2"]
export const headerNav = [{ label: 'Information', value: 'Personal' }, { label: 'Information', value: 'Spouse' }];
const PrimaryAndSpouseLifeStyle = ({ handleActiveTabMain }) => {
  const initialState = () => ({ userSubjectDataId: 0, subjectId: 0, subResponseData: "", responseId: 0 });
  const [formlabelData, setFormlabelData] = useState({})
  const [formlabelData1, setFormlabelData1] = useState({})
  const [updateOrSave, setUpdateOrSave] = useState(false)
  const { setWarning } = useContext(globalContext)
  const keys = ['healthy', 'habit', 'long', 'checkup', 'worry', 'worryHealth', 'socially', 'purpose','quitSmoke', 'exerciseDescribe',
     'drug', 'smoke', 'everSmoke', 'alcohol', 'drinks','drugsName', 'naturalHabitId', 'weekExerciseId'];

     const initialStateUser = {habit1: false,alcohol1: false,isSmoke: '',isEverSmoked: undefined,worryAboutHealth: false,weekExerciseValue: undefined,
      beer: [],eatingHabitScale: "",naturalHabitIdSave: undefined,isDrugs: undefined,
      ...Object.fromEntries(keys.map(key => [key, initialState()]))
    };
  
  const [primaryUser, setPrimaryUser] = useState(initialStateUser);
  const [spouseUser, setSpouseUser] = useState(initialStateUser);
  

  const personalReducer = useAppSelector(selectPersonal)
  const [activeBtn, setActiveBtn] = useState(1);
  const { primaryDetails, spouseDetails, isJointAccount, isShowSpouseMaritalTile } = personalReducer;
  const islifestyleHealthContent = `Provide details about your ${activeBtn == 2 ? "Spouse's" : ""} health, exercise, and nutrition habits. This information helps us understand your lifestyle choices, allowing us to assess your current health status and guide you appropriately toward healthier aging strategies.`
  const islifestyleSubstanceContent =  `Please share your ${activeBtn == 2 ? "Spouse's" : ""} substance use habit. This is essential for evaluating potential health risks, allowing us to understand your habits and guide you appropriately with tailored health recommendations for aging well.`
  const islifestyleHabitContent = `Please describe your ${activeBtn == 2 ? "Spouse's" : ""} social habits and engagement outside of work. Understanding your social connections helps us assess your level of social engagement, allowing us to guide you appropriately on why maintaining a fulfilling and active lifestyle as you age is important.`
  const { primaryUserId, spouseUserId, loggedInUserId, spouseFullName, spouseFirstName, primaryMemberFirstName, isPrimaryMemberMaritalStatus } = usePrimaryUserId();
  const [activeTab, setActiveTab] = useState(1);
  const lifeStyleRef = useRef(null);

  const [activeKeys, setActiveKeys] = useState(["0"]);

  const btnLabel =  `Save & Proceed to Family Medical History`

  const startingTabIndex = 1 ?? 0;
  let currentTabIndex = startingTabIndex;

  const getNextTabIndex = () => {
      return currentTabIndex++;
  };


  

  // function toster  
  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  }



  useEffect(() => {
    fectchsubjectForFormLabelId(primaryUserId,setPrimaryUser,setFormlabelData)
    if(isPrimaryMemberMaritalStatus){
      fectchsubjectForFormLabelId(spouseUserId,setSpouseUser,setFormlabelData1)
    }
    
  }, [primaryUserId,spouseUserId])

 
  const fectchsubjectForFormLabelId = async (userID,setuseData,formLabel) => {
    if (typeof setuseData !== 'function') {
      return;
    }
    let formlabelData2 = {};
    useLoader(true);

    let resultsubjectlabel = await postApiCall('POST', $Service_Url.getsubjectForFormLabelId, health.formLabelId);
    if (resultsubjectlabel == 'err') return;
    const responseData = resultsubjectlabel.data.data;


    let result = await getApiCall('GET', $Service_Url.getSubjectResponse + userID + `/0/${17}/0`, null);
    for (let resObj of responseData) {

      let label = "label" + resObj.formLabelId;
      formlabelData2[label] = resObj.question;

      if (result === 'err' && result?.userSubjects?.length == 0) return;
      if (result?.userSubjects?.length !== 0 && result?.userSubjects?.length > 0) {
        let responseData = result?.userSubjects;
        if (responseData[0].response || responseData[0].responseId) {
          setUpdateOrSave(true)
        }
        for (let i = 0; i < formlabelData2[label].response?.length; i++) {
          for (let j = 0; j < responseData.length; j++) {

            if (formlabelData2[label].response[i].responseId == responseData[j].responseId) {

            
              if (responseData[j].responseNature == "Radio") {
                formlabelData2[label].response[i]["checked"] = true;
                formlabelData2[label]["userSubjectDataId"] = responseData[j].userSubjectDataId;

                if (resObj.formLabelId == 111 && responseData[j].response == "Yes") {
                  setuseData((prevState) => ({...prevState,isDrugs : responseData[j].response}));
                }
                if (resObj.formLabelId == 103 && responseData[j].response == "Regularly exercise") {
                  setuseData((prevState) => ({...prevState,habit1 : true}));
                }
                if (resObj.formLabelId == 113 && responseData[j].response == "Yes") {
                  setuseData((prevState) => ({...prevState,alcohol1 : true}));
                }
                if (resObj.formLabelId == 108 && responseData[j].response == "Yes") {
                  setuseData((prevState) => ({...prevState,worryAboutHealth : true}));
                }
                if (resObj.formLabelId == 112) {
                  setuseData((prevState) => ({...prevState,isSmoke : responseData[j].response}));
                }
                if (resObj.formLabelId == 1035) {
                  setuseData((prevState) => ({...prevState,isEverSmoked : responseData[j].response}));
                }

              } if (responseData[j].responseNature == "Text") {

                formlabelData2[label].response[i]["response"] = responseData[j].response;
                formlabelData2[label]["userSubjectDataId"] = responseData[j].userSubjectDataId;
              } if (responseData[j].responseNature == "DropDown") {
               
                if (formlabelData2[label]?.questionId == 6 && responseData[j]?.subjectId == 6) {
                  formlabelData2[label]["userSubjectDataId"] = responseData[j].userSubjectDataId;
                  setuseData((prevState) => ({...prevState,naturalHabitIdSave : responseData[j].responseId}));
                }
                if (formlabelData2[label]?.questionId == 4 && responseData[j]?.subjectId == 4) {
                  formlabelData2[label]["userSubjectDataId"] = responseData[j].userSubjectDataId;
                  setuseData((prevState) => ({...prevState,weekExerciseValue : responseData[j].responseId}));
                }

              }
              if (responseData[j].responseNature == "CheckBox" && responseData[j].response !== null) {
                formlabelData2[label].response[i]["userSubjectDataId"] = responseData[j].userSubjectDataId;
                formlabelData2[label].response[i]["checked"] = true;
                // formlabelData1[label].response[i]["userSubjectDataId"] = responseData[j].userSubjectDataId;

              } else if (responseData[j].responseNature == "CheckBox") {
                formlabelData2[label].response[i]["checked"] = false;
                formlabelData2[label].response[i]["userSubjectDataId"] = responseData[j].userSubjectDataId;
              }
            }
          }
        }

      }
    }


    formLabel(formlabelData2)
    useLoader(false);
  }



  const handleUpdateSubmit = async () => {
    useLoader(true);   
    // Execute for both users
    const promises = [processUserData(primaryUser,primaryUserId,formlabelData),isPrimaryMemberMaritalStatus && processUserData(spouseUser,spouseUserId,formlabelData1)];  
    Promise.all(promises).then((results) => {
      useLoader(false);  
      if (results.every((res) => res)) {
        // resetAllStates();
      } else {
        toasterAlert("error", "Update Failed", "Some data failed to save.");
      }
    });
  };
  // Generalized function to process user data
  const processUserData = (user, newuserId,formLabel1) => {
    return new Promise(async (resolve) => {
      let totinptary = [];
      let beerArray = user?.beer || [];

      const { habit, healthy, checkup, naturalHabitId, weekExerciseId, exerciseDescribe, worry, worryHealth, 
              socially, purpose, quitSmoke, drug, smoke, everSmoke, alcohol, drinks, drugsName, long, habit1,eatingHabitScale} = user;

              const pushIfValid = (type,item) => {
                if(type == "type1" && item.subjectId !== 0 && item.subResponseData !== "" && item.responseId !== 0){                  
                  totinptary.push(item);
                }
                if(type == "type2" && item.subjectId !== 0 && item.responseId !== 0 && item.responseId !== null){                  
                  totinptary.push(item);
                }
                else if(type == "type3" && item?.subjectId !== 0 && item?.responseId !== 0){                  
                  totinptary.push(item);
                }              
                };
      

            
           [habit, healthy, checkup, worry, drug, smoke, everSmoke, alcohol].forEach(field => pushIfValid("type1", field));
           [naturalHabitId, weekExerciseId].forEach(field => pushIfValid("type2", field));
           [exerciseDescribe, eatingHabitScale, worryHealth, socially, purpose, quitSmoke, drinks, drugsName].forEach(field => pushIfValid("type3", field));
           if (habit1) pushIfValid("type3", long);

             
      let inputData = {
        userId: newuserId,
        userSubjects: totinptary.filter((item) => $AHelper?.$isNotNullUndefine(item)),
      };

     

      const subjectsToDelete = Object.values(formLabel1)
        .filter((data) => data?.response?.every((elem) => elem?.checked === false))
        .map((data) => ({ userSubjectDataId: data.userSubjectDataId }));
   
      if (subjectsToDelete.length > 0) {
        await postApiCall("DELETE", `${$Service_Url.deleteSubjectUser}?UserId=${newuserId}`, subjectsToDelete);
        inputData.userSubjects = inputData.userSubjects.filter(
          (data) => !subjectsToDelete.some((item) => item.userSubjectDataId === data.userSubjectDataId)
        );
      }
     

        const lableId = $AHelper.$isNotNullUndefine(totinptary) && totinptary.length > 0 && totinptary.map((ele) => {
        return ele?.labelId
       })
      const responses = await new Promise(async (resolve, reject) => {
       
        if(inputData?.userSubjects?.length > 0){
        useLoader(true)
        const _resultGetActivationLink = await postApiCall('PUT', $Service_Url.putSubjectResponse, inputData);        
        useLoader(false)
        if (_resultGetActivationLink == "err") {
          useLoader(false)
          return;
        }
        }

        if (beerArray.length == 0) {
          toasterAlert("successfully", `Successfully ${updateOrSave ? "updated" : "saved"} data`, `Your data have been ${updateOrSave ? "updated" : "saved"} successfully`)
          handleActiveTabMain(4)

        } else {
          resolve("updatedSuccessFul");
        }

      })


      if (responses == "updatedSuccessFul" && alcohol?.responseId !== "26") {
        const responseded = await handleAlcoholSelection(inputData.userSubjects.length, beerArray,newuserId);
      }
      else {
        // resetAllStates()
      }






   
     
    });
  };

  

  ///////////////////////////////////////////////////////
  /////////  post and put function for drinks
  const handleAlcoholSelection = async (arrayLength, beerArray,newuserId) => {

    return new Promise(async (resolve, reject) => {
      const updatedJson = beerArray.filter((beer) => beer.userSubjectDataId !== 0 && beer.userSubjectDataId !== null && beer.userSubjectDataId !== "" && beer.userSubjectDataId !== undefined);
      const postJson = beerArray.filter((beer) => { return (beer?.userSubjectDataId == 0 || beer?.userSubjectDataId == undefined || beer?.userSubjectDataId == "") });

      if (postJson.length > 0) {
        useLoader(true)
        const _resultGetActivationLink = await postApiCall('POST', $Service_Url.postaddusersubjectdata, postJson);

        useLoader(false)
        if (_resultGetActivationLink == "err") {
          resolve("POSTERROR")
          return;
        } else {
          if (postJson.length > 0 && updatedJson.length == 0) {
            toasterAlert("successfully", "Successfully saved data", "Your data have been saved successfully")

            handleActiveTabMain(4)
          } else {
            resolve("POSTCOMPLETE");

          }

        }


      }
      //   this.setState({ disable:false})
      if (updatedJson.length > 0) {
        let inputCLons = {
          userId: newuserId,
          userSubjects: updatedJson,
        };
        useLoader(true)
        const _resultGetActivationLink1 = await postApiCall('PUT', $Service_Url.putSubjectResponse, inputCLons)

        useLoader(false)
        if (_resultGetActivationLink1 == "err") {
          if (arrayLength == 0 && updatedJson.length > 0 && postJson.length == 0) {
            // resetAllStates()
          }

        } else {
          if (updatedJson.length > 0 && postJson.length == 0) {
            toasterAlert("successfully", "Successfully saved data", "Your data have been saved successfully")
            handleActiveTabMain(4)
            }
           }


      }
      if (postJson.length === 0 && updatedJson.length === 0) {
        resolve("POSTLENGTHZERO");
      } else {
        resolve("POSTLENGTHZERO");
      }
    });


  };


  const handleAccordionClick = () => {
    setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
};

const handleAccordionBodyClick = (key) => {
    setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
};

  const mdxlUi = useMemo(() => {
    return {
        md: spouseUserId ? 6 : 10,
        xl: spouseUserId ? (primaryDetails?.maritalStatusId == 3 ? 12 : 6) : 10,
    };
    }, [spouseUserId, primaryDetails?.maritalStatusId]);

    const displaySpouseContent = useMemo(() => {
      let value = ((isPrimaryMemberMaritalStatus == true) || 
    ($AHelper.$isNotNullUndefine(spouseUserId)) && primaryDetails?.maritalStatusId == 4) ? true : false;
    return value;
    }, [isPrimaryMemberMaritalStatus, spouseUserId])

  return (
    <>
      <div style={{ marginTop: "-47px" }} className='PrimaryAndSpouse'>


        <CustomAccordion key={activeBtn} isExpendAllbtn={true} handleActiveKeys={handleAccordionClick} activeKeys={activeKeys} allkeys={allkeys} activekey={activeKeys} header={<></>}>
        <> 
        <div className="d-flex justify-content-between align-items-center">
            <div className="col-auto">
              <span className="heading-of-sub-side-links-2">View and add/edit your Lifestyle.</span>
            </div>
     
        </div>
        </>
        <CustomAccordionBody eventkey='0' activeTab={activeTab} name={"General Health & Nutrition"} setActiveKeys={() => handleAccordionBodyClick('0')} isHeader = {true}
          header = {islifestyleHealthContent}>
         
            <Row className='personalInformation' id='personalinformation'>
              <Col xs={12} md={12} xl={12}>
                {/* @@ Primary SpouseName */}
                {isPrimaryMemberMaritalStatus &&
                  <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi} isGap={true} />
                }
                {/* @@ Primary SpouseName */}
                <Row className={`d-flex ${isPrimaryMemberMaritalStatus ? "mt-3 mb-4" : ""}`}>
                  <Col xs={12} md={12} xl={6} {...mdxlUi} className={!isPrimaryMemberMaritalStatus ? "ps-4" : ""}>
                    <LifeStyle
                      startTabIndex={getNextTabIndex()}
                      userId={primaryUserId}
                      formlabelData={formlabelData}
                      setFormlabelData={setFormlabelData}
                      userDetails={primaryUser}setuserDetails={setPrimaryUser}
                      setUpdateOrSave={setUpdateOrSave}
                      ref={lifeStyleRef}
                      activeTab={activeTab}
                      step={1}                    
                    />
                  </Col>
                  {isPrimaryMemberMaritalStatus &&
                    <Col xs={12} md={12} xl={6} {...mdxlUi}>
                     <LifeStyle 
                      startTabIndex={getNextTabIndex()}
                      userId={spouseUserId}
                      formlabelData={formlabelData1}
                      setFormlabelData={setFormlabelData1}
                      userDetails={spouseUser}setuserDetails={setSpouseUser}             
                      setUpdateOrSave={setUpdateOrSave}
                      ref={lifeStyleRef}
                      activeTab={activeTab}
                      step={1}                    
                    />
                    </Col>
                  }
                </Row>
              </Col>
            </Row>
        </CustomAccordionBody>
        
        <CustomAccordionBody eventkey='1' activeTab={activeTab} name={"Substance Use"} setActiveKeys={() => handleAccordionBodyClick('1')}isHeader = {true}
          header = {islifestyleSubstanceContent}>
     
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
                    <LifeStyle
                      startTabIndex={getNextTabIndex()}
                      userId={primaryUserId}
                      setFormlabelData={setFormlabelData}
                      formlabelData={formlabelData}
                      userDetails={primaryUser} setuserDetails={setPrimaryUser}
                      ref={lifeStyleRef}
                      activeTab={activeTab}
                      step={2} />
                  </Col>
                  {isPrimaryMemberMaritalStatus &&
                    <Col xs={12} md={12} xl={6} {...mdxlUi}>
                      <LifeStyle
                        startTabIndex={getNextTabIndex()}
                        userId={spouseUserId}
                        setFormlabelData={setFormlabelData1}
                        formlabelData={formlabelData1}
                        userDetails={spouseUser} setuserDetails={setSpouseUser}
                        ref={lifeStyleRef}
                        activeTab={activeTab}
                        step={2} />
                    </Col>
                  }
                </Row>
              </Col>
            </Row>
        </CustomAccordionBody>
        <CustomAccordionBody eventkey='2' activeTab={activeTab} name={"Social Habits"} setActiveKeys={() => handleAccordionBodyClick('2')} isHeader = {true}
          header = {islifestyleHabitContent}  >
         
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
                    <LifeStyle
                      startTabIndex={getNextTabIndex()}
                      userId={primaryUserId}
                      setFormlabelData={setFormlabelData}
                      formlabelData={formlabelData}
                      userDetails={primaryUser} setuserDetails={setPrimaryUser}
                      setUpdateOrSave={setUpdateOrSave}
                      ref={lifeStyleRef}
                      step={3}
                      isPersonalMedical={true} />
                  </Col>
                  {isPrimaryMemberMaritalStatus &&
                    <Col xs={12} md={12} xl={6} {...mdxlUi}>
                      <LifeStyle
                        startTabIndex={getNextTabIndex()}
                        userId={spouseUserId}
                        setFormlabelData={setFormlabelData1}
                        formlabelData={formlabelData1}
                        userDetails={spouseUser} setuserDetails={setSpouseUser}
                        setUpdateOrSave={setUpdateOrSave}
                        ref={lifeStyleRef}
                        step={3}
                        isPersonalMedical={true} />

                    </Col>
                  }
                </Row>
              </Col>
            </Row>
        </CustomAccordionBody>

      </CustomAccordion>
      <div className='d-flex justify-content-end container mb-3 mt-3'>
        <CustomButton startTabIndex={getNextTabIndex()} onClick={handleUpdateSubmit} label={btnLabel} />
        </div>
        </div>

    </>
  )
}

export default PrimaryAndSpouseLifeStyle