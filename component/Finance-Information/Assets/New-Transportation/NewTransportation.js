import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CustomAccordion, CustomAccordionBody } from "../../../Custom/CustomAccordion";
import AutoInformation from "./AutoInformation";
import OwnershipInformation from "./OwnershipInformation";
import LoanDetails from "./LoanDetails";
import { CustomRadio, CustomRadioAndCheckBox } from "../../../Custom/CustomComponent";
import { Col, Row } from "react-bootstrap";
import { CustomButton, CustomButton2, CustomButton3} from "../../../Custom/CustomButton";
import UploadAssetsFile from "../../../Common/File/UploadAssetsFile";
import usePrimaryUserId from "../../../Hooks/usePrimaryUserId";
import TransportationTable from "./TransportationTable";
import { getApiCall, postApiCall, isNotValidNullUndefile, focusInputBox } from "../../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../../components/network/UrlPath";
import konsole from "../../../../components/control/Konsole";
import { $AHelper } from "../../../Helper/$AHelper";
import ContactAndAddress from "../../../Custom/Contact/ContactAndAddress";
import Other from "../../../../components/asssets/Other";
import ExpensesQuestion from "../../../Common/ExpensesQuestion";
import { $JsonHelper } from "../../../Helper/$JsonHelper";
import { globalContext } from "../../../../pages/_app";
import { setHideCustomeSubSideBarState, useLoader } from "../../../utils/utils";
import { $dashboardLinks } from "../../../Helper/Constant";
import { useAppDispatch, useAppSelector } from "../../../Hooks/useRedux";
import { fetchPreconditionType, getUserLiabilityByUserRealPropertyId, getUserAgingAsset, updatePreconditiontypeList } from "../../../Redux/Reducers/financeSlice";
import { selectorFinance } from "../../../Redux/Store/selectors";
import { contentObject } from "../../../Helper/$MsgHelper";


export const isContentAsset = `Provide the details of your transport assets. This information will help in planning and managing your transport resources as part of your overall life planning.`
export const isContentAutoInformation = `Please provide the following details about your vehicle(s).`
export const isContentOwnerShip = `Please provide details about the ownership and loan information for your transport assets.`
export const isContentLoan = `Please provide the following information regarding any loans associated with your transport assets.`
export const isContentExpense = `provide details on how your transport-related expenses are paid. Include information on the payment methods for vehicle-related costs`
export const isContentContact = `Accurate loan contact and address information is crucial for timely processing and communication regarding your loan. Keep these details updated to receive important notifications, repayment reminders, and assistance with your loan services.`


const allkeys = ["0", "1", "2", "3", "4", "5", "6"]

const NewTransportation = (props) => {
  const { primaryUserId, loggedInUserId, spouseUserId, loggedInMemberDetail, primaryMemberFullName, spouseFullName } = usePrimaryUserId();

  const fileTypeId = 11;
  const fileCategoryId = 5;
  const liabilityTypeId = 7;
  const liabilityId = 4;

  // const [preConditionTypeList, setPreConditionTypeList] = useState([]);
  // const [transportationList, setTransportationList] = useState([]);
  const [ownerTypesList, setOwnerTypeList] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false)

  const [assetInfo, setAssetInfo] = useState(() => {
    const initialAssetInfo = $JsonHelper.assetObj();
    return { ...initialAssetInfo, createdBy: loggedInUserId, agingAssetCatId: 8 };
  });
  const [isRealPropertyObj, setIsRealPropertyObj] = useState($JsonHelper.isRealPropertyNewObj());
  const [liabilityInfo, setLiabilityInfo] = useState(() => {
    const initialLiabilityInfo = $JsonHelper.objLiability();
    return { ...initialLiabilityInfo, createdBy: loggedInUserId, liabilityId: liabilityId, liabilityTypeId: liabilityTypeId };
  });
  const [liabilityloan, setLiabilityloan] = useState(() => {
    const initialLiabilityloan = $JsonHelper.objLiability();
    return { ...initialLiabilityloan, createdBy: loggedInUserId, liabilityId: 5, liabilityTypeId: liabilityTypeId, lenderuserid: '', loanNumber: '', interestRatePercent: '' };
  });

  const [loanSelection, setLoanSelection] = useState(false);
  const [lenderUserId, setLenderUserId] = useState(null);
  const [showAccordion, setShowAccordion] = useState(false);
  const [activeBtn, setActiveBtn] = useState(1);
  const [showError, setShowError] = useState(false);
  const updateAssetsRef = useRef(null);
  const uploadAssetsFileRef = useRef(null);
  const contactDetailsRef = useRef(null);
  const autoMobileOtherRef = useRef(null);
  const addressRef = useRef(null)
  const { handleActiveTab, activeTab } = props;
  const [isDataUpdate, setIsDataUpdate] = useState(false)
  const [updateOwnerDetail, setUpdateOwnerDetail] = useState([])
  const [quesReponse, setQuesResponse] = useState(null)
  const [activeKeys, setActiveKeys] = useState(["0"]);


  konsole.log("dbvhjvb", loanSelection)

  const { newConfirm, setWarning } = useContext(globalContext)
  const financeData = useAppSelector(selectorFinance)
  const { preconditionTypeList , UserAgingAssetList, preconditiontypeList } = financeData;

  const LiabilityByUserRealPropertyId = useMemo(() => financeData?.LiabilityByUserRealPropertyId, [financeData?.LiabilityByUserRealPropertyId]);
  const dispatch = useAppDispatch()

  const transportationList = useMemo(() => UserAgingAssetList?.filter((item) => item.agingAssetCatId == 8), [UserAgingAssetList])

  const preConditionTypeList = useMemo(() => {
    return preconditiontypeList;
  }, [preconditiontypeList])
  useEffect(() => {
    if(isNotValidNullUndefile(primaryUserId)) {
    fetchApiCall();
    // fetchAutoMobilesInfo(primaryUserId);
    fetchApi()
    }
    return () => setHideCustomeSubSideBarState(false)
  }, [primaryUserId, isUpdate]);


  const fetchApi = (userRealPropertyId) => {
    // if (preconditionTypeList.length == 0) {
    // dispatch(fetchPreconditionType())
    // }
    if (isNotValidNullUndefile(userRealPropertyId)) {
      dispatch(getUserLiabilityByUserRealPropertyId({
        userId: primaryUserId,
        userRealPropertyId: userRealPropertyId,
      }))
          }
    dispatch(getUserAgingAsset({
      userId: primaryUserId,
    }))
  }


  useEffect(() => {
    // if (isNotValidNullUndefile(LiabilityByUserRealPropertyId) && LiabilityByUserRealPropertyId?.liability?.length > 0) {
    if (isNotValidNullUndefile(LiabilityByUserRealPropertyId)) {
      fetchLiabilityWithLiabilityId(LiabilityByUserRealPropertyId)
    }
  }, [LiabilityByUserRealPropertyId])


  const transporatationArray = [];

  const addTransportation = () => {
    setIsUpdate(false)
    setShowAccordion(true);
    setAssetInfo({ ...$JsonHelper.assetObj(), createdBy: loggedInUserId, agingAssetCatId: 8 })
    setIsRealPropertyObj($JsonHelper.isRealPropertyNewObj())
    setLiabilityInfo({ ...$JsonHelper.objLiability(), createdBy: loggedInUserId, liabilityId: liabilityId, liabilityTypeId: liabilityTypeId });
    setLenderUserId('')
    setLoanSelection(null);
    setLiabilityloan(() => {
      const initialLiabilityloan = $JsonHelper.objLiability();
      return { ...initialLiabilityloan, createdBy: loggedInUserId, liabilityId: 5, liabilityTypeId: liabilityTypeId, lenderuserid: '', loanNumber: '', interestRatePercent: '' };
    })
    setIsDataUpdate(false)
    // setAssetInfo({ ...$JsonHelper.assetObj(), createdBy: loggedInUserId });
    setHideCustomeSubSideBarState(true)
    $AHelper.$scroll2Top();
    setActiveKeys(["0"]);
  };

  const fileInformationDetails = () => ({
    Type: 'Document',
    heading: 'Transportation',
  });


  const hideSidebar = ()=>{
    setShowAccordion(false)
    setHideCustomeSubSideBarState(false)
    handleAddUpdateDataReset();
  }

  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  };

  const handleAddUpdateDataReset = () => {
    setAssetInfo({ ...$JsonHelper.assetObj(), createdBy: loggedInUserId, agingAssetTypeId: null });
    setIsRealPropertyObj({ ...$JsonHelper.isRealPropertyNewObj() });
    setLiabilityInfo({ ...$JsonHelper.objLiability(), createdBy: loggedInUserId, liabilityId: liabilityId, liabilityTypeId: liabilityTypeId });
    setIsDataUpdate(false);
    setLoanSelection(false);
    setLiabilityloan(() => {
      const initialLiabilityloan = $JsonHelper.objLiability();
      return { ...initialLiabilityloan, createdBy: loggedInUserId, liabilityId: 5, liabilityTypeId: liabilityTypeId, lenderuserid: '', loanNumber: '', interestRatePercent: '' };
    })
    // contactDetailsRef?.current?.resetAddress();
  };


  const handleSubmit = async (type, nextStep) => {

    // Check if assetInfo.agingAssetTypeId is not selected
    if (assetInfo.agingAssetTypeId == null) {
      toasterAlert("warning", "Warning", "Please select the transportation type");
      focusInputBox("agingAssetType")
      setActiveKeys(["0"]);
      return;
    }

    // Check if owner type is not selected
    const activeOwner = assetInfo.assetOwners.filter((e) => e.isActive === true)[0];
    if (activeOwner?.ownerUserId == undefined) {
      toasterAlert("warning", "Warning", "Please select the Owner");
      focusInputBox("ownerTypeId")
      setActiveKeys(["2"]);
      return;
    }

    // Check if Company Name is not selected
    if (isRealPropertyObj?.isDebtAgainstProperty == false && loanSelection == true) {
      if (liabilityloan?.nameofInstitutionOrLender == '') {
        toasterAlert("warning", "Warning", "Please select the company name");
        focusInputBox("nameofInstitutionOrLender")
        setActiveKeys[("3")]
        return;
      }
    }
    
    if (isRealPropertyObj?.isDebtAgainstProperty == true) {
      if (liabilityInfo?.nameofInstitutionOrLender == '') {
        toasterAlert("warning", "Warning", "Please select the company name");
        focusInputBox("nameofInstitutionOrLender")
        setActiveKeys[("2")]
        return;
      }
    }


    const assesDocument = []; // Placeholder for assesDocument processing

    let assetJson = { ...assetInfo, assetOwners: assetInfo.assetOwners, assetDocuments: assesDocument, ownerTypeId: 1, isRealPropertys: [{ ...isRealPropertyObj }] };
    // console.log(" [{ ...isRealPropertyObj }]", [{ ...isRealPropertyObj }])


    // konsole.log("dsvbkjsb", assetJson);
    // @@ File upload Document
    {
      useLoader(true)
      const _fileUpload = await uploadAssetsFileRef.current.saveUploadUserDocument(primaryUserId);
      useLoader(false)
      if (_fileUpload != 'no-file') {
        let fileId = _fileUpload?.fileId;
        let documentName = _fileUpload?.userFileName;
        let documentPath = _fileUpload?.fileURL;
        if (_fileUpload == 'file-delete') {
          fileId = null;
          documentName = assetInfo?.assetDocuments[0]?.documentName;
          documentPath = assetInfo?.assetDocuments[0]?.documentPath;
        }
        let assetDocumentsJson = [{ documentName, documentPath, fileId: fileId }]
        if (assetInfo?.assetDocuments?.length > 0) {
          assetDocumentsJson[0]['userAgingAssetDocId'] = assetInfo?.assetDocuments[0]?.userAgingAssetDocId
        }


        assetJson['assetDocuments'] = assetDocumentsJson;
      }
    }
    const jsonObj = {
      userId: primaryUserId,
      asset: assetJson
    };

    let method = (isDataUpdate == true) ? "PUT" : "POST";
    let url = method === 'POST' ? $Service_Url.postUseragingAsset : $Service_Url.putUpdateUserAgingAsset;
    useLoader(true)
    const result = await postApiCall(method, url, jsonObj);
    useLoader(false)
    if (result !== 'err') {
      const responseData = result?.data?.data;

      if (responseData.agingAssetTypeId == '999999') {
        autoMobileOtherRef.current?.saveHandleOther(responseData.userAgingAssetId);
      }

      if (responseData?.isRealPropertys?.length > 0) {
        let liablityJson = isRealPropertyObj?.isDebtAgainstProperty == false ? liabilityloan : liabilityInfo;

        let isDeleted = (assetInfo?.isRealPropertys.length > 0 && isNotValidNullUndefile(assetInfo?.isRealPropertys[0].userRealPropertyId) && (responseData.isRealPropertys[0]?.isDebtAgainstProperty) !== (assetInfo?.isRealPropertys.length > 0 && assetInfo?.isRealPropertys[0]?.isDebtAgainstProperty) || (isRealPropertyObj?.isDebtAgainstProperty == false && loanSelection == false))
        //////////  delete liability
        if (isDeleted == true && LiabilityByUserRealPropertyId !== "err") {
          await deleteApiForLiabilities(assetInfo?.isRealPropertys?.[0]?.userRealPropertyId);
          useLoader(false)

        }

        liablityJson = { ...liablityJson, userRealPropertyId: responseData.isRealPropertys[0].userRealPropertyId }
        let jsonObj = {
          userId: primaryUserId,
          liability: liablityJson
        };
        const methodLiability = isNotValidNullUndefile(liablityJson?.userLiabilityId) && !isDeleted ? 'PUT' : 'POST';

        if (methodLiability === 'PUT') {
          jsonObj.liability['updatedBy'] = loggedInUserId;
          jsonObj.liability['isActive'] = loanSelection;
        } else {
          jsonObj.liability['CreatedBy'] = loggedInUserId;
        }

        ///////////////// is own and loan is false  then  

         if (!(isRealPropertyObj?.isDebtAgainstProperty == false && loanSelection == false)) {

          useLoader(true)

          if (isNotValidNullUndefile(liabilityInfo?.nameofInstitutionOrLender) || isNotValidNullUndefile(liabilityloan?.nameofInstitutionOrLender)) {
            //  let datajson =  await postApiCall(methodLiability, urlLiability, jsonObj);
            let address = await contactDetailsRef?.current?.handleSubmit()
            let contact = await contactDetailsRef?.current?.submitContact();
            const postJson = $JsonHelper?.jsonForLiabilities({

              primaryUserId: primaryUserId,
              loggedInUserId: loggedInUserId,
              liabilityTypeId: liablityJson?.liabilityTypeId,
              nameofInstitutionOrLender: liablityJson?.nameofInstitutionOrLender,
              outstandingBalance: liablityJson?.outstandingBalance,
              payOffDate: liablityJson?.payOffDate,
              paymentAmount: liablityJson?.paymentAmount,
              userRealPropertyId: responseData.isRealPropertys[0].userRealPropertyId,
              liabilityId: liablityJson?.liabilityId,
              interestRatePercent: liablityJson?.interestRatePercent,
              loanNumber: liablityJson?.loanNumber,
              lenderUserId: lenderUserId,
              userLiabilityId: liablityJson?.userLiabilityId,
              addressData: address?.json,
              contactData: contact?.json
            })
            const _resultGetActivationLink = await postApiCall("POST", $Service_Url?.putUpsertLiabilitiy, postJson);
            useLoader(false)
          }
          useLoader(false)
        }
        if(!$AHelper.$isNotNullUndefine(loanSelection)){
          await deleteApiForLiabilities(assetInfo?.isRealPropertys?.[0]?.userRealPropertyId);
        }
        toasterAlert("successfully", `Successfully  ${method === 'POST' ? 'saved' : 'updated'} data`, `Your data have been ${method === 'POST' ? 'saved' : 'updated'} successfully`);
        setIsUpdate(false)
        fetchApi();
        handleAddUpdateDataReset();
        $AHelper.$scroll2Top();
        if (nextStep == true) {
          handleActiveTab(14);
          setShowAccordion(false);
        }else if(nextStep == "another"){
          const _fileUpload = await uploadAssetsFileRef.current.saveNAddAnother();
          addTransportation()
          setActiveKeys(["0"]); 
          return;
        } else {
          setShowAccordion(false);
        }
      }
    };
    setHideCustomeSubSideBarState(false)
  };


  const deleteTransportation = async (item) => {
    const confirmRes = await newConfirm(true, `Are you sure you want to delete this transportation? This action cannot be undone.`, "Confirmation", "Delete Transportation", 2);
    konsole.log(confirmRes, "responsebdah")
    if (!confirmRes) return;
    let jsonObjAsset = item
    jsonObjAsset = { ...jsonObjAsset, isActive: false, updatedBy: loggedInUserId };
    const jsonObj = {
      userId: item.createdBy,
      asset: jsonObjAsset
    }
    // return;

    if (item?.isRealPropertys?.length > 0) {
      // if (item?.isRealPropertys?.length > 0) {
      await deleteApiForLiabilities(item?.isRealPropertys[0].userRealPropertyId)
    }
    const result = await postApiCall('PUT', $Service_Url.putUpdateUserAgingAsset, jsonObj);
    useLoader(false)
    if (result != 'err') {
      toasterAlert("deletedSuccessfully", "Transport assets has been deleted successfully",)
      fetchApi();
    }
  }

  const deleteApiForLiabilities = async (userRealPropertyId) => {
    useLoader(true)
    return new Promise(async (resolve, reject) => {
      const resultofLiabilities = await getApiCall('GET', $Service_Url.getUserLiabilityByUserRealPropertyId + "/" + primaryUserId + '/' + userRealPropertyId);
      if (resultofLiabilities !== 'err' && resultofLiabilities?.liability?.length > 0) {
        const result = await postApiCall('DELETE', $Service_Url.deleteUserLiability + `?UserId=${primaryUserId}&UserLiabilityId=${resultofLiabilities?.liability[0].userLiabilityId}&DeletedBy=${loggedInUserId}`)
        useLoader(false)
        setLenderUserId(null)
        resolve('deleted')
      } else {
        useLoader(false)
        resolve('err')
      }
    })

  }
  // updatePreconditiontypeList

  const fetchApiCall = async () => {
    try {
      useLoader(true);
      if (preconditiontypeList?.length == 0) {
        konsole.log("preconditiontypeListaaa",preconditiontypeList)
        const resultOfpre = await getApiCall('GET', $Service_Url.getPreconditionType + '8', '');
        konsole.log("resultOfpre", resultOfpre);
        dispatch(updatePreconditiontypeList(resultOfpre != 'err' ? resultOfpre : []))
      }

      const ownerTypeResult = await getApiCall('GET', $Service_Url.getFileBelongsToPath + `?ClientUserId=${primaryUserId}`);
      konsole.log('ownerTypeResultTransportation', ownerTypeResult)
      if (ownerTypeResult !== 'err') {
        const responseMap = ownerTypeResult.map(item => ({
          value: item.fileBelongsTo,
          label: (item.fileBelongsTo === "JOINT") ? "JOINT" : $AHelper.$capitalizeAllLetters(item.belongsToMemberName)
        }));
        setOwnerTypeList(responseMap);
        konsole.log(responseMap, "responseMapresponseMap")
      }
      useLoader(false)
    } catch (error) {
      konsole.error('Error fetching API data', error);
    }
  };

  const fetchLiabilityWithLiabilityId = useCallback((LiabilityByUserRealPropertyIds) => {
    konsole.log('resultTransportresultTransportresultTransportresultTransport', LiabilityByUserRealPropertyIds);
    if (LiabilityByUserRealPropertyIds?.liability?.length > 0) {
      const { nameofInstitutionOrLender, outstandingBalance, payOffDate, paymentAmount, userLiabilityId, userRealPropertyId, liabilityId } = LiabilityByUserRealPropertyIds?.liability[0]
      const array = LiabilityByUserRealPropertyId?.liability
      konsole.log(array, "arrayarrayarrayarray", liabilityId)
      if (liabilityId == 5) {
        setLiabilityloan(LiabilityByUserRealPropertyIds?.liability[0])
        setLoanSelection(true)
        setLenderUserId(LiabilityByUserRealPropertyIds?.liability[0]?.lenderUserId)
        setIsRealPropertyObj(oldState => ({ ...oldState, isDebtAgainstProperty: false }))
      } else {
        setLiabilityInfo(prev => ({
          ...prev, "nameofInstitutionOrLender": nameofInstitutionOrLender,
          "outstandingBalance": $AHelper.$forIncomewithDecimal(outstandingBalance), "payOffDate": payOffDate,
          "paymentAmount":$AHelper.$forIncomewithDecimal(paymentAmount),
          "userLiabilityId": userLiabilityId,
          "userRealPropertyId": userRealPropertyId,
        }))
        setLiabilityloan({ ...$JsonHelper.objLiability(), createdBy: loggedInUserId, liabilityId: 5, liabilityTypeId: liabilityTypeId, lenderuserid: '', loanNumber: '', interestRatePercent: '' })
        setLoanSelection(false)
      }
    } else {

      setLiabilityInfo(prev => ({
        // ...prev, 
        ...$JsonHelper.objLiability(), createdBy: loggedInUserId, liabilityId: liabilityId, liabilityTypeId: liabilityTypeId
      }))
      setLoanSelection(false);
    }
  }, [LiabilityByUserRealPropertyId])

  const handleOnchange = (key, value) => {
    setAssetInfo(prev => ({
      ...prev,
      [key]: value,
    }))
  };

  const handleRadioOnchange = (key, value) => {
    konsole.log(key, value, "hjsdjdhjdhjfdf", value?.value)
    setAssetInfo(prev => ({
      ...prev,
      [key]: value?.value,
    }));
  };

  konsole.log(assetInfo, "assetInfoassetInfoassetInfoassetInfo")

  const updateTransportation = async (item) => {
    if (liabilityId == 5) {
      setLiabilityInfo($JsonHelper.objLiability());
    }     
    const updateValue={...item,balance:$AHelper.$forIncomewithDecimal(item.balance)}
    konsole.log(updateValue, "itemupdateValue");
    setIsUpdate(true);
    setShowAccordion(true);
    setAssetInfo(updateValue);
    setLenderUserId(null);

    if (updateValue && updateValue.agingAssetCatId && updateValue.agingAssetTypeId) {
      const { agingAssetCatId, agingAssetTypeId, assetDocuments, assetOwners, assetTypeName, balance, isActive, isRealPropertys, nameOfInstitution, ownerType, ownerTypeId, remarks, userAgingAssetId, licensePlate, vinno, productColor, yearMade, modelNumber, expiryDate, quesReponse } = updateValue;

      setAssetInfo(prev => ({
        ...prev,
        "agingAssetCatId": agingAssetCatId,
        "agingAssetTypeId": agingAssetTypeId,
        "ownerTypeId": assetOwners?.length === 2 ? 'Joint' : assetOwners?.length === 1 ? assetOwners[0].ownerUserId : "-",
        "nameOfInstitution": nameOfInstitution,
        "balance": balance,
        "userAgingAssetId": userAgingAssetId,
        "UpdatedBy": loggedInUserId,
        "isActive": true,
        "productColor": productColor,
        "licensePlate": licensePlate,
        "vinno": vinno,
        "modelNumber": modelNumber,
        "yearMade": yearMade,
        "expiryDate": expiryDate,
        "quesReponse": quesReponse,
      }));

      setQuesResponse(updateValue.quesReponse);

      if (isRealPropertys && isRealPropertys.length > 0) {
        const { purchasePrice, purchaseDate, value, isDebtAgainstProperty, userRealPropertyId } = isRealPropertys[0];
        setIsRealPropertyObj(prev => ({
          ...prev,
          "purchasePrice": $AHelper.$forIncomewithDecimal(purchasePrice), "purchaseDate": purchaseDate,
          "value":  $AHelper.$forIncomewithDecimal(value), "isDebtAgainstProperty": isDebtAgainstProperty,
          "userRealPropertyId": userRealPropertyId,
        }));
        konsole.log(isDebtAgainstProperty, isRealPropertys, "isDebtAgainstProperty")
        fetchApi(userRealPropertyId)
      }

      setUpdateOwnerDetail(assetOwners);
      setIsDataUpdate(true);
    } else {
      setLoanSelection(false);
      setIsRealPropertyObj($JsonHelper.isRealPropertyNewObj());
      setLiabilityInfo($JsonHelper.objLiability());
    }
    $AHelper.$scroll2Top();
    setShowAccordion(true);
    setHideCustomeSubSideBarState(true)
    setActiveKeys(["0"]);
  };

  const handleAccordionClick = () => {
    setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
};

const handleAccordionBodyClick = (key) => {
    setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
};

  konsole.log(assetInfo, "assetInfo")
  konsole.log("isRealPropertyObj",isRealPropertyObj)

  return (
    <div className="Lifeinsurance">
      <div className="col-12">
        {!showAccordion ? (

          <TransportationTable
            transportationData={transportationList}
            addTransportation={addTransportation}
            deleteTransportation={deleteTransportation}
            updateTransportation={updateTransportation}
            userId={primaryUserId}
            handleActiveTab={handleActiveTab}
          />
        ) : (
          <div>

            <div style={{ borderBottom: '1px solid #F0F0F0' }}></div>
            <CustomAccordion
              key={activeBtn}
              isExpendAllbtn={true}
              handleActiveKeys={handleAccordionClick}
              activeKeys={activeKeys}
              allkeys={allkeys}
              activekey={activeKeys}
              header={<div className="previous-btn mt-4">
                <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer" onClick={() => hideSidebar()} />
                <span className="ms-1 cursor-pointer" onClick={() => hideSidebar()}> Previous</span>
              </div>}
            >
              <CustomAccordionBody eventkey="0" name="Transport Asset Information" setActiveKeys={() => handleAccordionBodyClick('0')}>
                {konsole.log(assetInfo.agingAssetTypeId, "assetInfo.agingAssetTypeId", preConditionTypeList)}
                <Row>
                  <Col md={12} xl={3} className="mt-3 ">
                    <p className="heading-of-sub-side-links-3">{isContentAsset}</p>
                  </Col>
                  <Col md={12} xl={9} className="mt-3">
                    <CustomRadio
                      tabIndex={1} 
                      placeholder={<span style={{ fontWeight: 'bold' }}>Type of Transport Assets* :</span>}
                      id="agingAssetType"
                      options={preConditionTypeList}
                      value={assetInfo.agingAssetTypeId}
                      onChange={(val) => handleRadioOnchange('agingAssetTypeId', val)}
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={12} xl={3}>
                  </Col>
                  <Col xs={12} md={6} lg={4} className="my-3">
                    {assetInfo.agingAssetTypeId == "999999" && (
                      <Other
                       tabIndex={2}
                        othersCategoryId={3}
                        userId={primaryUserId}
                        dropValue={assetInfo.agingAssetTypeId}
                        ref={autoMobileOtherRef}
                        natureId={assetInfo.userAgingAssetId}
                      />
                    )}
                  </Col>
                </Row>


              </CustomAccordionBody>

              <CustomAccordionBody eventkey="1" name="Auto Information" setActiveKeys={() => handleAccordionBodyClick('1')}>
                <AutoInformation startTabIndex={3} transportationData={transportationList} setAssetInfo={setAssetInfo} assetInfo={assetInfo} isSideContent={isContentAutoInformation} />
              </CustomAccordionBody>

              <CustomAccordionBody eventkey="2" name="Ownership & Loan Information" setActiveKeys={() => handleAccordionBodyClick('2')}>
                <OwnershipInformation startTabIndex={3 + 8} ownerTypesList={ownerTypesList} setAssetInfo={setAssetInfo} assetInfo={assetInfo} isRealPropertyObj={isRealPropertyObj} setIsRealPropertyObj={setIsRealPropertyObj} liabilityInfo={liabilityInfo} setLiabilityInfo={setLiabilityInfo} loanSelection={loanSelection} setLoanSelection={setLoanSelection} isSideContent={isContentOwnerShip} />
              </CustomAccordionBody>
              {loanSelection === true && isRealPropertyObj?.isDebtAgainstProperty == false && (
                <>
                  <CustomAccordionBody eventkey="3" name="Loan Details" setActiveKeys={() => handleAccordionBodyClick('3')}>
                    <LoanDetails startTabIndex={3 + 8 + 7} liabilityloan={liabilityloan} setLiabilityloan={setLiabilityloan} isSideContent={isContentLoan} />
                  </CustomAccordionBody>

                  <CustomAccordionBody eventkey="4" name="Loan Company Contact & Address Information" setActiveKeys={() => handleAccordionBodyClick('4')}>
                    <Row>
                      <Col xl={3}><p className="heading-of-sub-side-links-3">{contentObject.transportContactContent}</p></Col>
                      <Col>
                        <ContactAndAddress
                          startTabIndex={3 + 8 + 7 + 6} 
                          refrencePage='transportation'
                          ref={contactDetailsRef}
                          userId={lenderUserId}
                          showType={"both"}
                          isMandotry={false}
                        // type={activeTab}
                        />
                      </Col>
                    </Row>
                  </CustomAccordionBody>
                </>
              )}

              <CustomAccordionBody eventkey="5" name="Document Upload" setActiveKeys={() => handleAccordionBodyClick('5')}>
                <Row className="mb-3">
                  <Col xs={12} md={12} xl={3}><p className="heading-of-sub-side-links-3">{contentObject.UploadFileTransport}</p></Col>
                  <Col className="mt-3" xs={12} md={12} xl={9}>
                    <UploadAssetsFile startTabIndex={3 + 8 + 7 + 6 + 18}  refrencePage="Transport Assets"
                      savedDocuments={assetInfo?.assetDocuments.filter(
                        (item) => item.fileId != null
                      )}
                      details={fileInformationDetails()}
                      ref={uploadAssetsFileRef}
                    />
                  </Col>
                </Row>
              </CustomAccordionBody>

              {/* <CustomAccordionBody eventkey="6" name="Expense Paid" setActiveKeys={setActiveKeys}>
                <Row className="mt-2">
                  <Col md={12} xl={3} className="mt-3">
                    <p className="heading-of-sub-side-links-3">{isContentExpense}</p>
                  </Col>
                  <Col md={12} xl={9} className="mt-3 mb-4">
                    <ExpensesQuestion
                      key="Transportation"
                      value={assetInfo.quesReponse}
                      setStateInsDetail={handleOnchange}
                      refrencePage={'transportation'}
                    />
                  </Col>
                </Row>

              </CustomAccordionBody> */}
        <Row style={{ marginTop: '24px' }} className='mb-3'>
              <div className="d-flex justify-content-between mt-3 mb-4">
                <CustomButton2 tabIndex={3 + 8 + 7 + 6 + 18 + 1} label={`${isUpdate ? 'Update' : 'Save'} & Continue later`} onClick={() => handleSubmit(true, false)} />
              <div>
                {!isUpdate && <CustomButton3 tabIndex={3 + 8 + 7 + 6 + 18 + 1 + 1}  label={`${'Save & Add Another'}`} onClick={() => handleSubmit(false,'another')}/>}
                <CustomButton tabIndex={3 + 8 + 7 + 6 + 18 +1 +1 + 1} label="Next: Life Insurance" onClick={() => handleSubmit(false, true)} />
              </div>
              </div>
              </Row>
            </CustomAccordion>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewTransportation;
