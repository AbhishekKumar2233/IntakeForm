import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import PolicyTable from "./PolicyTable";
import { useAppDispatch, useAppSelector } from "../../../Hooks/useRedux";
import { selectorFinance } from "../../../Redux/Store/selectors";
import { fetchInsProvider, fetchLifeInsByUserIdData, fetchPolicyTypeData, fetchPreFrequencyData } from "../../../Redux/Reducers/financeSlice";
import usePrimaryUserId from "../../../Hooks/usePrimaryUserId";
import { CustomSelect,CustomCheckBoxForCopyToSpouseData } from "../../../Custom/CustomComponent";
import { CustomAccordion, CustomAccordionBody } from "../../../Custom/CustomAccordion";
import PolicyInformation from "./PolicyInformation";
import FinanceInfromation from "./FinanceInformation";
import { BeneficiaryDropDown } from "../../../Common/OwnerDropDown";
import UploadAssetsFile from "../../../Common/File/UploadAssetsFile";
import { CustomButton, CustomButton2,CustomButton3 } from "../../../Custom/CustomButton";
import { focusInputBox, isNotValidNullUndefile, postApiCall } from "../../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../../components/network/UrlPath";
import { $JsonHelper } from "../../../Helper/$JsonHelper";
import ExpensesQuestion from "../../../Common/ExpensesQuestion";
import { setHideCustomeSubSideBarState, useLoader } from "../../../utils/utils";
import { globalContext } from "../../../../pages/_app";
import konsole from "../../../../components/control/Konsole";
import { Col, Row } from "react-bootstrap";
import { $AHelper } from "../../../Helper/$AHelper";
import { contentObject } from "../../../Helper/$MsgHelper";



export const isContentInsurance = `Please provide details about your life insurance policy. This information helps evaluate how well your insurance coverage supports your overall life planning strategy, ensuring it contributes effectively to your goals of aging in place and protecting your loved ones.`
export const isContentFinancial = `Enter the financial details of your life insurance policy. Understanding these aspects is crucial for assessing how your insurance integrates with your broader financial and estate planning, helping you maintain control over your retirement and avoid unnecessary institutional care.`
export const isContentFiduciary = `Provide details about your beneficiaries to confirm that your policy aligns with your life planning goals. Proper beneficiary planning ensures that your legacy is protected and directed as intended, reinforcing your overall strategy of aging with dignity and avoiding costly disruptions.`
const allkeys = ["0", "1", "2", '3']


const LifeInsurance = ({ handleActiveTab,viewEditModal,setEditCloseModal,closeEditModal,UpdateModalState,setUpdateModalState,fetchDataModalData,modalLabel}) => {
  const { primaryUserId, spouseUserId, loggedInUserId, primaryMemberFirstName, spouseFullName, spouseFirstName, isPrimaryMemberMaritalStatus,_spousePartner} = usePrimaryUserId();
  const [activeBtn, setActiveBtn] = useState(1);
  const financeApiData = useAppSelector(selectorFinance);
  const { lifeInsuranceList, policyTypeList, insProviderList, preFrequencyList, } = financeApiData;
  const dispatch = useAppDispatch();
  const userId = useMemo(() => {return activeBtn == 1 ? primaryUserId : spouseUserId}, [activeBtn, primaryUserId, spouseUserId]);
  const [showAccordion, setShowAccordion] = useState(false);
  const [data, setData] = useState($JsonHelper.lifeInsuranceJson());
  const [assetBeneficiaryDetailsJson, setAssetBeneficiaryDetailsJson] = useState('');
  const updateAssetsRef = useRef(null);
  const [quesResponse, setQuesResponse] = useState(null);
  const insCompanyRef = useRef(null);
  const policyRef = useRef(null);
  const [showError, setShowError] = useState(false);
  const [activeKeys, setActiveKeys] = useState(["0"]);
  const [isSameAsSpouse, setIsSameAsSpouse] = useState('')
  const[showAccordForBenif,setShowAccordForBenif]=useState(true) // Hide some buttons on Beneficiary letter edit button

  const { setWarning, newConfirm } = useContext(globalContext);
// console.log("dsssssssssssssssss",usePrimaryUserId())
  useEffect(() => {
    if (isNotValidNullUndefile(userId)) {
      fetchApi(userId);
    }
    // return () => setHideCustomeSubSideBarState(false)
  }, [userId]);

  const fetchApi = async (userId) => {
    useLoader(true);
    await dispatch(fetchLifeInsByUserIdData({ userId:userId }));
    useLoader(false);
    if (policyTypeList?.length == 0) dispatch(fetchPolicyTypeData());
    if (insProviderList?.length == 0) dispatch(fetchInsProvider());
    if (preFrequencyList?.length == 0) dispatch(fetchPreFrequencyData());
  };

  const setStateUserState = (key, value) => {
    setQuesResponse(value)
  }

  const updateInsurance = (updatedVal) => {
  // console.log("updateInsuranceupdatedVal",updatedVal)
  const item={...updatedVal,
      premium:$AHelper.$forIncomewithDecimal(updatedVal?.premium),
      cashValue:$AHelper.$forIncomewithDecimal(updatedVal?.cashValue),
      deathBenefits:$AHelper.$forIncomewithDecimal(updatedVal?.deathBenefits)
    }
    setShowAccordion(true);
    setData(item);
    setQuesResponse(item.quesReponse);
    setShowError(false);
    setAssetBeneficiaryDetailsJson(item?.beneficiary)
    setHideCustomeSubSideBarState(true)
    $AHelper.$scroll2Top();
    setActiveKeys(["0"])
  };

  useEffect(()=>{
    if(viewEditModal?.condition=="Edit"){
       if(viewEditModal?.tableName=="Insurance Policies"){
            if(viewEditModal?.tableData?.userId == primaryUserId){
              setActiveBtn(1)
            }else{
              setActiveBtn(2)
            }
      }
      updateInsurance(viewEditModal?.tableData)
      setShowAccordForBenif(false) // Hide other buttons when Beneficary letter edit modal opens
      setActiveKeys(allkeys) // open all accodions on Beneficary letter edit modal opening
    }
  },[viewEditModal])


  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  };

  const addInsurance = () => {
    setShowAccordion(true);
    setData($JsonHelper.lifeInsuranceJson());
    setHideCustomeSubSideBarState(true)
    setShowError(false)
    setAssetBeneficiaryDetailsJson('')
    setQuesResponse('')
    $AHelper.$scroll2Top();
    setActiveKeys(["0"]);
  };

  const handleSelectBeneficiary = (val) => {
    setAssetBeneficiaryDetailsJson(val);
  };

  const deleteInsurance = async (item) => {

    const confirmRes = await newConfirm(true, 'Are you sure you want to delete this Life Insurance? This action cannot be undone.', "Confirmation", "Deleted Life Insurance", 2);
    konsole.log("confirmRes", confirmRes);
    if (!confirmRes) return;

    submitData('delete', item);
    setData(item);
  };

  const submitData = async (type, item) => {
    let policyStartDate = "";
    let policyExpiryDate = "";
    let policyStartDateObj1 = "";
    let policyExpiryDateObj2 = "";
    if ($AHelper.$isNotNullUndefine(data.policyStartDate)) {
      policyStartDate = $AHelper.$getFormattedDate(data.policyStartDate)
    }
    if ($AHelper.$isNotNullUndefine(data.policyExpiryDate)) {
      policyExpiryDate = $AHelper.$getFormattedDate(data.policyExpiryDate);
    }

    konsole.log("datatdtatatd",data,data.policyStartDate,data.policyExpiryDate,policyStartDate,policyExpiryDate)

    if (policyStartDate != "" && policyExpiryDate != "") {
      policyStartDateObj1 = new Date(policyStartDate);
      policyExpiryDateObj2 = new Date(policyExpiryDate);
      if (policyStartDateObj1 >= policyExpiryDateObj2) {
        toasterAlert("warning","Enter a valid expiry date");
        setData((prev) => ({...prev, policyExpiryDate: "" }))
        return;
      }
    }
    
      let url = $Service_Url.putLifeInsByUserId;
      let method = 'PUT';
      let dataList = type == 'delete' ? item : data;
      
      if (dataList.insuranceCompanyId == '') {
        setShowError(true);
        focusInputBox("insuranceCompanyId");
        // setActiveKeys(allkeys);
        setActiveKeys(["0"])
        return;
      }
      useLoader(true)
      const fileUpload = await updateAssetsRef?.current?.saveUploadUserDocument(userId);
      useLoader(false)
      let jsonFile = {
        "userLifeInsuranceDocId": method == 'PUT' ? dataList?.insuranceDocs[0]?.userLifeInsuranceDocId : 0,
        "isActive": fileUpload == 'file-delete' ? false : true,
        "documentName": fileUpload?.fileName,
        "documentPath": fileUpload?.fileURL,
        "docFileId": fileUpload == 'file-delete' ? null : fileUpload?.fileId
      }
      
      
      // console.log("dataListuserLifeInsuranceIddataList",dataList?.userLifeInsuranceId)
      if (dataList.userLifeInsuranceId == 0) {// Add policy
        dataList = {
          ...dataList,
          CreatedBy: loggedInUserId,
          insuranceDocs: (fileUpload != 'err' && fileUpload != 'no-file') || fileUpload == 'file-delete' ? [jsonFile] : [],
        };
        url = $Service_Url.postaddLifeInsurance;
        method = 'POST';
      } else {
        dataList = { ...dataList, insuranceDocs: (fileUpload != 'err' && fileUpload != 'no-file') || fileUpload == 'file-delete' ? [jsonFile] : [], updatedBy: loggedInUserId };
      }
  
      if (type == 'delete') {
        dataList = { ...dataList, isActive: false };
      }
  
  
      dataList.beneficiary = [assetBeneficiaryDetailsJson?.length > 0 ? {...assetBeneficiaryDetailsJson[0],BeneficiaryName:assetBeneficiaryDetailsJson[0]?.beneficiaryUserName} : null];
      dataList = { ...dataList, quesReponse: quesResponse };
  
      // konsole.log(dataList, "dataList", dataList?.insuranceDocs[0]?.userLifeInsuranceDocId)
      const jsonObj = {
        userId: userId,
        lifeInsurance: dataList,
      };
      // console.log("jsonObjjsonObj",jsonObj)
      useLoader(true);
      const updateInsuranceApi = await postApiCall(method, url, jsonObj);
      useLoader(false);
      if(isSameAsSpouse == true){
        const mapToUserId = ((activeBtn == 2) ? primaryUserId : spouseUserId);
        const selectedBeneficiary = dataList?.beneficiary?.[0]?.beneficiaryUserId ?? '';
        const finalLifeInsurance = (selectedBeneficiary && (mapToUserId == selectedBeneficiary)) ? {
          ...dataList,
          beneficiary: [{
            ...(dataList?.beneficiary?.[0] ?? {}),
            beneficiaryUserId: ((mapToUserId == spouseUserId) ? primaryUserId : spouseUserId)
          }]
        } : dataList;

        const jsonObj2 = {
          userId: ((activeBtn == 2) ? primaryUserId : spouseUserId),
          lifeInsurance: finalLifeInsurance
        };
        // console.log("jsonObjjsonObj2",jsonObj2,"primaryUserId",primaryUserId,"spouseUserId",spouseUserId,"activeBtn",activeBtn)
        useLoader(true);
        const updateInsuranceApiForApi = await postApiCall(method, url, jsonObj2);
        setIsSameAsSpouse("")
        // console.log(mapToUserId,"updateInsuranceApiForApi",updateInsuranceApiForApi,"updateInsuranceApi",updateInsuranceApi)
        useLoader(false);
        if (updateInsuranceApiForApi !== 'err') {
          konsole.log(updateInsuranceApi, "updateInsuranceApi")
          if (type != 'delete') {
            if (dataList?.insuranceCompanyId == '999999') {
              await insCompanyRef?.current?.saveHandleOther(updateInsuranceApiForApi?.data.data.lifeInsurances[0].userLifeInsuranceId);
            }
            if (dataList?.policyTypeId == '999999') {
              await policyRef?.current?.saveHandleOther(updateInsuranceApiForApi?.data.data.lifeInsurances[0].userLifeInsuranceId);
            }
          }
        }
    
      }
  
      if (updateInsuranceApi !== 'err') {
        konsole.log(updateInsuranceApi, "updateInsuranceApi")
        if (type != 'delete') {
          // console.log("dataList?.insuranceCompanyId",dataList?.insuranceCompanyId,"dataList?.policyTypeId",dataList?.policyTypeId)
          if (dataList?.insuranceCompanyId == '999999') {
            await insCompanyRef?.current?.saveHandleOther(updateInsuranceApi?.data?.data?.lifeInsurances?.[0].userLifeInsuranceId);
          }
          if (dataList?.policyTypeId == '999999') {
            await policyRef?.current?.saveHandleOther(updateInsuranceApi?.data?.data?.lifeInsurances?.[0].userLifeInsuranceId);
          }
        }
  
        if (type == 'another') {
          await updateAssetsRef?.current?.saveNAddAnother()
          addInsurance()
          toasterAlert("successfully", "Successfully saved data", "Your data have been saved successfully")
          const _fileUpload = await updateAssetsRef.current?.saveNAddAnother();
          setActiveKeys(["0"]); 
          fetchApi(userId);
          return
        } 
        fetchApi(userId);
        setShowAccordion(false);
        setHideCustomeSubSideBarState(false)
  
        $AHelper.$scroll2Top();
        if(modalLabel=="Beneficiary-Modal"){
            fetchDataModalData()
            setEditCloseModal(false)
            setUpdateModalState(false)
        }
        if (type == 'delete') {
          toasterAlert("deletedSuccessfully", "Life Insurance has been deleted successfully.");
        } else {
          setWarning(
            'successfully',
            `Successfully ${dataList.userLifeInsuranceId == 0 ? 'saved' : 'updated'} data`,
            `Your data have been ${dataList.userLifeInsuranceId == 0 ? 'saved' : 'updated'
            } successfully`
          );
        }
        if (type == 'next') {
          if(isPrimaryMemberMaritalStatus && userId != spouseUserId){
            dispatch(fetchLifeInsByUserIdData({ userId:spouseUserId }));
            setActiveBtn(2);
          }else{
            handleActiveTab(16)
          }
        } 
      }
  };

  useEffect(()=>{
    if(UpdateModalState==true){ //click on outside update button in Beneficiary letter edit modal
      submitData()
    }
},[UpdateModalState])

  const fileInformationDetails = () => ({
    Type: 'Document',
    heading: data?.insuranceCompany,
  });

  const hideSidebar = () => {
    setShowAccordion(false)
    setHideCustomeSubSideBarState(false)
  }

  const handleAccordionClick = () => {
    setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
};

const handleAccordionBodyClick = (key) => {
    setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
};

  
  const handleSameAsSpouseCheckBox = (e) => {
    const eventChecked = e.target.checked;
    setIsSameAsSpouse(eventChecked)
  }

  
  konsole.log("activeKeys", activeKeys);
  konsole.log("datadatadata",data,"lifeInsuranceListlifeInsurances",lifeInsuranceList?.lifeInsurances, activeBtn,"isPrimaryMemberMaritalStatususerId",userId, userId != spouseUserId)


  return (
    <div className="Lifeinsurance">
    {showAccordForBenif && <div style={{borderBottom: '1px solid #F0F0F0'}}></div>}
      {!showAccordion ? (
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div className="col-auto">
              <span className="heading-of-sub-side-links-2">View and add your Life Insurance here</span>
            </div>
            {(isPrimaryMemberMaritalStatus) &&
              <div className="d-flex align-items-end justify-content-end" style={{ margin: "-62px 24px 36px" }}>
                <div className="btn-div addBorderToToggleButton ms-auto" >
                  <button className={`view-btn ${activeBtn == 1 ? "active selectedToglleBorder" : ""}`} onClick={() => setActiveBtn(1)}> {primaryMemberFirstName}</button>
                  <button className={`view-btn ${activeBtn == 2 ? "active selectedToglleBorder" : ""}`} onClick={() => setActiveBtn(2)}> {spouseFirstName}</button>
                </div>
              </div>
            }
          </div>
      ) : ('')}
      <div className={`col-12 ${!showAccordion > 0 ? 'mt-4' : ''}`}>
        {!showAccordion ? (
          <PolicyTable
            key={activeBtn}
            lifeInsuranceList={lifeInsuranceList.lifeInsurances}
            updateInsurance={updateInsurance}
            addInsurance={addInsurance}
            deleteInsurance={deleteInsurance}
            userId={userId}
            handleActiveTab={handleActiveTab}
            activeBtn={activeBtn}
            setActiveBtn={setActiveBtn}
          />
        ) : (       
          <CustomAccordion
           isExpendAllbtn={true}
           handleActiveKeys={handleAccordionClick}
           activeKeys={activeKeys}
           allkeys={allkeys}
           activekey={activeKeys}
           key={activeBtn}
           header={(showAccordForBenif)?<div className="previous-btn my-2 mt-4">
           <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer" onClick={() => hideSidebar()} />
           <span className="ms-1" onClick={() => hideSidebar()}> Previous</span>
           </div>:<span className='heading-of-sub-side-links'>Edit Life Insurance</span>}
               >
            {(isPrimaryMemberMaritalStatus && data?.userLifeInsuranceId == 0 && activeBtn == 1 && showAccordForBenif) &&
            <div className=''>
              <CustomCheckBoxForCopyToSpouseData 
              tabIndex={1}
              className="d-inline-block" 
              type="checkbox"  
              onChange={(event)=>{handleSameAsSpouseCheckBox(event)}} 
              value={isSameAsSpouse} 
              name="SameSpouseData"
              placeholder={`Copy same data to ${_spousePartner}`}
                />
              </div>}
            <CustomAccordionBody eventkey="0" name="Policy Information" setActiveKeys={() => handleAccordionBodyClick('0')}>
              <PolicyInformation
                startTabIndex={2} 
                policyTypeList={policyTypeList}
                insProviderList={insProviderList}
                data={data}
                setData={setData}
                userId={userId}
                insCompanyRef={insCompanyRef}
                policyRef={policyRef}
                showError={showError}
                setShowError={setShowError}
                isSideContent={isContentInsurance}
              />
            </CustomAccordionBody>
            <CustomAccordionBody eventkey="1" name="Financial Information" setActiveKeys={() => handleAccordionBodyClick('1')}>
              <FinanceInfromation
                startTabIndex={2 + 7} 
                data={data}
                preFrequencyList={preFrequencyList}
                setData={setData}
                isSideContent={isContentFinancial}
              />
            </CustomAccordionBody>
            <CustomAccordionBody eventkey="2" name="Beneficiary Information" setActiveKeys={() => handleAccordionBodyClick('2')}>
              <Row className="d-flex mb-2" md={12}>
                <Col className="mt-3 heading-of-sub-side-links-3" md={12} xl={3}>{isContentFiduciary}</Col>
                <Col className="" md={9} xl={8}>
                {console.log(data?.beneficiary,"databeneficiary",assetBeneficiaryDetailsJson)}
                  <BeneficiaryDropDown
                    startTabIndex={2 + 7 + 4} 
                    assetBeneficiarys={assetBeneficiaryDetailsJson}
                    savedAssetBeneficiarys={data?.beneficiary?.length > 0 ? data?.beneficiary[0].beneficiaryUserId != null ? data?.beneficiary : [] : []}
                    handleSelectBeneficiary={handleSelectBeneficiary}
                    currentUserId={activeBtn == 2 ? spouseUserId : primaryUserId}
                    filteredBenefList={[]}
                    filterOutCurrentUser={true}
                  />
                  {/* <div className="mb-4">
                  <ExpensesQuestion
                    key="Lifeinsurance"
                    value={quesResponse}
                    setStateInsDetail={setStateUserState}
                    refrencePage={'Lifeinsurance'}
                  />
                  </div> */}
                </Col>
              </Row>
            </CustomAccordionBody>
            <CustomAccordionBody eventkey="3" name="Document Upload" setActiveKeys={() => handleAccordionBodyClick('3')}>
            <Row className="mb-3">
            <Col className="mt-2 heading-of-sub-side-links-3" md={12} xl={3}>{contentObject.UploadFileLifeInsurance}</Col>
            <Col md={9} xl={9}>
              <UploadAssetsFile
                startTabIndex={2 + 7 + 4 + 1}
                savedDocuments={data?.insuranceDocs?.filter(
                  (item) => item.docFileId != null && item.docFileId != 0
                )}
                refrencePage="lifeinsurance"
                details={fileInformationDetails()}
                ref={updateAssetsRef}
              />
              </Col>
              </Row>
            </CustomAccordionBody>
               <div className="d-flex justify-content-between mt-2">
                   {showAccordForBenif &&  <CustomButton2 tabIndex={2 + 7 + 4 + 1 + 1} label={`${(data?.userLifeInsuranceId == 0) ? 'Save' : 'Update'} & Continue later`} onClick={() => submitData()} />}
                  <div>
                  {(data?.userLifeInsuranceId == 0  ) && <CustomButton3 tabIndex={2 + 7 + 4 + 1 + 1 +1} label={'Save & Add Another'} onClick={() => submitData('another')} />}
                  {showAccordForBenif && <CustomButton tabIndex={2 + 7 + 4 + 1 + 1 +1 +1} label={isPrimaryMemberMaritalStatus && userId != spouseUserId ? `Next: ${spouseFirstName} Life Insurance` : "Next:Long-Term Care Policy"} onClick={() => submitData('next')} />}
                  </div>
              </div> 
          
          </CustomAccordion>
          
        )}
        
      </div>
    </div>
  );
};

export default LifeInsurance;
