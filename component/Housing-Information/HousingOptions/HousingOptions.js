import React, { useContext, useEffect, useState} from "react";
import { CustomAccordion, CustomAccordionBody } from "../../Custom/CustomAccordion";
import { CustomButton, CustomButton2 } from "../../Custom/CustomButton";
import { Button, Col, Row } from "react-bootstrap";
import CurrentResidence from "./CurrentResidence";
import Suitabilty from "./Suitabilty";
import { globalContext } from "../../../pages/_app";
import LivingPreferences from "./LivingPreferences";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";
import { getApiCall, isNotValidNullUndefile, postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import { housingChar } from "../../../components/control/Constant";
import konsole from "../../../components/control/Konsole";
import { useLoader } from "../../utils/utils";
import { $dashboardLinks } from "../../Helper/Constant";
import { $AHelper } from "../../Helper/$AHelper";
import { useAppSelector, useAppDispatch } from "../../Hooks/useRedux";
import { selectorLegal,selectSubjectData } from "../../Redux/Store/selectors";
import { updateFamilyMemberList } from "../../Redux/Reducers/legalSlice";
import { $ApiHelper } from "../../Helper/$ApiHelper";
import { updatehousingMetaQuestions } from "../../Redux/Reducers/subjectDataSlice";

export const isContentLiving = `Provide details about your current living arrangements and future preferences. This information helps us understand your housing needs and lifestyle choices, allowing us to guide you appropriately on how to plan for a living situation that supports your comfort, safety, and well-being as you age.`;
export const isContentCareGiver = `Share your thoughts on the suitability of your home for live-in care. This helps us evaluate your home’s readiness for caregiving, allowing us to understand any adjustments needed and guide you appropriately in planning for potential caregiving arrangements that ensure your safety and quality of life.`;
export const isContentResidence = `Provide information about your home's features, including its age, size, and design. This helps us assess the suitability of your current residence, allowing us to identify necessary modifications and guide you appropriately in planning housing that supports aging comfortably and independently.`;

const allkeys = ["0", "1", "2"]
const HousingOption = (props) => {
  const { primaryUserId } = usePrimaryUserId();
  const [formlabelData, setFormlabelData] = useState({});
  const [prevFormlabelData, setprevFormlabelData] = useState({});
  const [updateCaregiverSuitability, setUpdateCaregiverSuitability] = useState(false);
  const [activeKeys, setActiveKeys] = useState(["0"]);
  const [isUpdate, setIsUpdate]= useState(false)

  const { setWarning,setPageTypeId } = useContext(globalContext);
  const dispatch = useAppDispatch()
  const legalSliceStateData = useAppSelector(selectorLegal)
  const subjectData = useAppSelector(selectSubjectData);
  const { housingMetaQuestions } = subjectData;
  const { familyMemberList } = legalSliceStateData;
  konsole.log("allChildrenDetails454",familyMemberList)

  useEffect(() => {
    if ($AHelper.$isNotNullUndefine(primaryUserId)) {
      konsole.log("bdkabk_called")
      setPageTypeId(11)
      getsubjectForFormLabelId(primaryUserId);
    }
    if(familyMemberList?.length == 0){
      fetchFamilyMembersList()
    }
    
  }, [primaryUserId]);

  const getsubjectForFormLabelId = async (newUserId) => {
    let formlabelData = {};

    // First API call to fetch subject response
    const subjectResponse = await postApiCall("POST", $Service_Url.getsubjectForFormLabelId, housingChar);
    konsole.log("subjectResponse99", subjectResponse);

    if (subjectResponse !== "err") {
        konsole.log("currentResponsecurrentResponse", subjectResponse);
        let resSubData1 = subjectResponse.data.data;
        dispatch(updatehousingMetaQuestions(resSubData1));

        // Second API call to fetch questions with category ID
        const resgetdata1 = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicId({ memberId: primaryUserId, categoryId: 3 });
        konsole.log("resgetdata199", resgetdata1);

        // Processing each question from the subject response
        for (let resObj of resSubData1) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = { ...resObj.question };

            const questionRespons = resgetdata1?.userSubjects;
            const filterQuestion = questionRespons?.filter((item) => item.questionId === resObj?.question?.questionId);

            // Check if there are any filtered questions
            if (filterQuestion.length > 0) {
                setUpdateCaregiverSuitability(true);

                let responseData1 = filterQuestion[0];

                // Iterate over response array to update based on responseId match
                formlabelData[label].response = formlabelData[label].response.map((response) => {
                    if (response.responseId === responseData1.responseId) {
                        if (responseData1.responseNature === "Radio") {
                            return {
                                ...response,
                                checked: true,
                            };
                        } else if (responseData1.responseNature === "Text") {
                            return {
                                ...response,
                                response: responseData1.response,
                            };
                        }
                    }
                    return response;
                });

                formlabelData[label]["userSubjectDataId"] = responseData1.userSubjectDataId;

                // Check specific question ID and response ID for setting nohouse1 state
                if (formlabelData[label].questionId === 32 && [59, 60, 61].includes(responseData1.responseId)) {
                    setFormlabelData((prevData) => ({
                        ...prevData,
                        nohouse1: true,
                    }));
                }
            }
        }

        setFormlabelData(formlabelData);
        setprevFormlabelData(formlabelData);
    } else {
        konsole.log("Error in subject response:", subjectResponse);
    }
};




  const getFinalArray = (_formlabelData,type) => {
    return Object.values(_formlabelData)?.map((value) => {
      // konsole.log("valuedatadata", value,value?.response);
      const forChecked = value?.response?.find(ele => ele.checked == true);
      const forInput = (forChecked || (value?.response?.length > 1))? undefined : value?.response?.[0];
      const isCheckInput = (forChecked || (value?.response?.length > 1))? true : false;
      const forCheckedFalse = value?.userSubjectDataId!=undefined && value.response.every(ele=>ele.checked==false)
      if(forCheckedFalse){
          return { userSubjectDataId:value.userSubjectDataId, subResponseData:"Delete"}
        }
      // console.log("forCheckedFalse",forCheckedFalse) 
      // konsole.log("valuedataChecked", forChecked, forInput, " \n -------- \n",);
      
      if ((forChecked?.subjectId !== 0 && forChecked?.subResponseData !== "" && forChecked?.responseId !== 0) || (forInput?.subjectId !== 0 && forInput?.subResponseData !== "" && forInput?.responseId !== 0)) return {
        userSubjectDataId: value?.userSubjectDataId,
        subjectId: value?.questionId,
        subResponseData: isCheckInput ? forChecked?.response : forInput?.response,
        responseId: isCheckInput ? forChecked?.responseId : forInput?.responseId,
        userId: primaryUserId,
      };

    }).filter(value => value && value.subResponseData); // Filter out empty objects
  };

  const handleSubmit = async (redirectToNext) => {
    let FinalArray = getFinalArray(formlabelData)
    if(FinalArray.length>0){
      FinalArray=FinalArray?.filter(ele=>ele?.subResponseData!="Delete");
    }
    const arrayToDelete = getFinalArray(formlabelData);
    const prevFinalArray = getFinalArray(prevFormlabelData);
    const filterToDelete=arrayToDelete.filter(ele=>ele.subResponseData=="Delete").map(ele=>({userSubjectDataId:ele.userSubjectDataId}))
    // console.log("arrayToDelete",arrayToDelete)
    // console.log("filterToDelete",filterToDelete)
    if(filterToDelete.length>0){
     await postApiCall("DELETE", $Service_Url.deleteSubjectUser+"?UserId="+primaryUserId, filterToDelete);
    }
    // console.log("FinalArray",FinalArray,"prevFinalArray",prevFinalArray)
    const fieldsToUpdate = FinalArray.filter((currentField) => {
        const prevField = prevFinalArray.find((field) => field.userSubjectDataId == currentField.userSubjectDataId);
        return (
          !prevField || prevField.subResponseData !== currentField.subResponseData || prevField.responseId !== currentField.responseId
        );     
    });

    // konsole.log("sadaadData", 
    //   "\nformlabelData=", formlabelData, 
    //   "\nprevFormlabelData", prevFormlabelData,
    //   "\nFinalArray", FinalArray,
    //   "\nprevFinalArray", prevFinalArray,
    //   "\nfieldsToUpdate", fieldsToUpdate
    // );

    konsole.log("fieldsToUpdate", formlabelData, FinalArray, fieldsToUpdate, updateCaregiverSuitability);
    // konsole.log("fieldsToUpdate",fieldsToUpdate )

    if (updateCaregiverSuitability) { 
      useLoader(true);
      let arrayToUpdate=[]
      let arrayToPost=[];
      fieldsToUpdate.map((data)=>{
          if(data?.userSubjectDataId) {
            arrayToUpdate.push(data)
          }else{
            arrayToPost.push(data)
          }
        })

        // konsole.log("arrayToUpdate",arrayToUpdate,"arrayToPost",arrayToPost)
        // return;
        if(arrayToUpdate?.length>0){
          const response = await postApiCall("PUT", $Service_Url.putSubjectResponse, {
            userId: primaryUserId,
            userSubjects: arrayToUpdate,
          });
          konsole.log(response, "responsePUT");  
        }
        if(arrayToPost.length>0){
          const response = await postApiCall("POST", $Service_Url.postaddusersubjectdata, arrayToPost);
          konsole.log(response, "responsePOST");
        }

        // After successful post or update, set `isUpdate` to true
        setIsUpdate(true);

        getsubjectForFormLabelId(primaryUserId); // to call get API
        toasterAlert("successfully", "Successfully updated data", "Your data have been updated successfully");
        useLoader(false);
      // konsole.log(response, "responsePUT");

    } else {
      if(fieldsToUpdate && fieldsToUpdate?.length>0) {
        useLoader(true);
        const response = await postApiCall("POST", $Service_Url.postaddusersubjectdata, fieldsToUpdate);
        useLoader(false);
        konsole.log(response, "responsePOST");
        toasterAlert("successfully", "Successfully saved data", "Your data have been saved successfully");
  
        // After saving data for the first time, set `isUpdate` to true
        setIsUpdate(true);
        
        getsubjectForFormLabelId(primaryUserId); // to call get Api
      }
      
    }

    if (redirectToNext) {
      // $AHelper.$dashboardNextRoute($dashboardLinks[4]?.route);
      // props?.setActiveSubTab(1)
      // props?.setActiveTab(2)
      props?.setActiveTabData(2, 1)
    }
    setActiveKeys([]);
  };

  const handleAccordionClick = () => {
    setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
};

const handleAccordionBodyClick = (key) => {
    setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
};


  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  };

  const fetchFamilyMembersList = async () => {
    useLoader(true);
    const _resultOfInsuranceDetail = await getApiCall('GET', $Service_Url.getFamilyMembers + primaryUserId);
    useLoader(false);
    const insDetails = _resultOfInsuranceDetail != 'err' ? _resultOfInsuranceDetail.filter(item =>  $AHelper.$isCheckNoDeceased(item?.memberStatusId)) : []
    konsole.log("_resultOfInsuranceDetail13", _resultOfInsuranceDetail, insDetails)

     // Add the condition for setIsUpdate
     setIsUpdate(_resultOfInsuranceDetail !== 'err' ? true : false);
     
    dispatch(updateFamilyMemberList(insDetails));
  }


  konsole.log(formlabelData, "formlabelData787878787")

  return (
    <div className="housing-Options">
      <CustomAccordion isExpendAllbtn={true} handleActiveKeys={handleAccordionClick} activeKeys={activeKeys} allkeys={allkeys} activekey={activeKeys} header={<span className="heading-text">Housing Information</span>}>
        <CustomAccordionBody eventkey="0" name="Living Arrangements Preferences" setActiveKeys={() => handleAccordionBodyClick('0')}>
          <LivingPreferences startTabIndex={1} formlabelData={isNotValidNullUndefile(formlabelData) && formlabelData} setFormlabelData={setFormlabelData} isSideContent={isContentLiving} familyMemberList = {familyMemberList}/>
        </CustomAccordionBody>

        {(formlabelData?.label327?.response?.filter((item) => item.checked == true)[0]?.responseId != 50 &&
          formlabelData?.label327?.response?.filter((item) => item.checked == true)[0]?.responseId != undefined && formlabelData?.label318?.response?.filter((item) => (item.response == "Yes" && item.checked == true) || (item.response == "Not Sure" && item.checked == true)).length > 0) ? (
          <>
            <CustomAccordionBody eventkey="1" name="Caregiver Suitability" setActiveKeys={() => handleAccordionBodyClick('1')} >
              <Suitabilty  startTabIndex={2 + 10} formlabelData={isNotValidNullUndefile(formlabelData) && formlabelData} setFormlabelData={setFormlabelData} isSideContent={isContentCareGiver} />
            </CustomAccordionBody>

            <CustomAccordionBody eventkey="2" name="Current Residence Characteristics" setActiveKeys={() => handleAccordionBodyClick('2')}>
              <CurrentResidence startTabIndex={2 + 10 + 2} formlabelData={isNotValidNullUndefile(formlabelData) && formlabelData} setFormlabelData={setFormlabelData} isSideContent={isContentResidence}  />
            </CustomAccordionBody>
          </>
        ) : null}
        <div className="d-flex justify-content-between mt-3 mb-4">
          <CustomButton2 tabIndex={ 2 + 10 + 2 + 12}  label={`${isUpdate ? 'Update': 'Save'} & Continue later`} onClick={() => handleSubmit(false)} />
          <CustomButton tabIndex={ 2 + 10 + 2 + 12 + 1}  label="Save & Next: Housing Professionals" onClick={() => handleSubmit(true)} />
        </div>
      </CustomAccordion>
    </div>
  );
};

export default HousingOption;