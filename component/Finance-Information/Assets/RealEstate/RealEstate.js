import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CustomAccordion, CustomAccordionBody } from "../../../Custom/CustomAccordion";
import RealEstateTable from "./RealEstateTable";
import usePrimaryUserId from "../../../Hooks/usePrimaryUserId";
import { useAppDispatch, useAppSelector } from "../../../Hooks/useRedux";
import { selectorFinance } from "../../../Redux/Store/selectors";
import { fetchPropertytype, fetchRetirementNonRetirementData, getLiabilities, getUserLiabilityByUserRealPropertyId } from "../../../Redux/Reducers/financeSlice";
import { CustomSelect } from "../../../Custom/CustomComponent";
import ContactAndAddress from "../../../Custom/Contact/ContactAndAddress";
import FinancialownerInformation from "./FinancialownerInformation";
import { CustomButton, CustomButton2,CustomButton3 } from "../../../Custom/CustomButton";
import { $AHelper } from "../../../Helper/$AHelper";
import { focusInputBox, isNotValidNullUndefile, isNullUndefine, postApiCall } from "../../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../../components/network/UrlPath";
import Other from "../../../../components/asssets/Other";
import { $JsonHelper } from "../../../Helper/$JsonHelper";
import { globalContext } from "../../../../pages/_app";
import { setHideCustomeSubSideBarState, useLoader } from "../../../utils/utils";
import { Col, Row } from "react-bootstrap";
import LenderTable from "./LenderTable";
import EditLender from "./EditLender";
import konsole from "../../../../components/control/Konsole";
// import LenderTable from "./LenderTable";

export const isContentProperty = `Please provide details about your property. This information helps us evaluate your real estate assets, allowing us to understand your property holdings and guide you appropriately in managing these assets to support your retirement goals and protect against unplanned expenses.`
export const isContentFinancial = `Provide the financial details and ownership information of your property. This helps us assess your property’s financial impact on your overall asset portfolio, allowing us to guide you appropriately in planning for asset management, potential income generation, and long-term security.`
export const isContentLender = 'Accurate contact and address information is essential for effective communication and service delivery. Keep these details current to ensure your Lender receive important updates and support';

const allkeys = ["0", "1", "2"]

const RealEstate = ({ handleActiveTab }) => {
  const { primaryUserId } = usePrimaryUserId();
  const financeData = useAppSelector(selectorFinance)
  const { realEstateList, propertyTypeList, liabilityType, LiabilityByUserRealPropertyId } = financeData;
  const [showAccordion, setShowAccordion] = useState(true)
  const dispatch = useAppDispatch()
  const realEstateData = useMemo(() => realEstateList?.length > 0 ? realEstateList?.filter((e) => e.agingAssetCatId == '3') : [], [realEstateList, showAccordion])
  const [realEstateitem, setRealestateitem] = useState({ ...$JsonHelper.assetObj(), agingAssetCatId: 3 });
  const [isRealPropertys, setisRealPropertys] = useState(realEstateitem?.isRealPropertys?.length > 0 ? realEstateitem?.isRealPropertys[0] : { ...$JsonHelper.isRealPropertyNewObj() })
  const addressRef = useRef(null)
  const realPropertyRef = useRef(null)
  const { setWarning, newConfirm } = useContext(globalContext)
  const [showError, setShowError] = useState(false)
  const [lenderList, setLenderlist] = useState(LiabilityByUserRealPropertyId.liability)
  const [openModal, setOpenmodal] = useState(false)
  const [lenderData, setLenderData] = useState({ ...$JsonHelper.lenderObj() })
  const addressLenderRef = useRef(null)
  const [showLenderError, setShowlenderError] = useState(false)

  const [activeKeys, setActiveKeys] = useState("0")

  useEffect(() => {
    if (isNullUndefine(primaryUserId)) return;
    fetchApi(primaryUserId)
    if (realEstateData.length == 0) {
      fetchApi(primaryUserId)
    }
    setShowError(false)
  }, [primaryUserId, showAccordion])

  useMemo(() => {
    setLenderlist(LiabilityByUserRealPropertyId.liability)
  }, [LiabilityByUserRealPropertyId.liability])


  const fetchApi = useCallback((primaryUserId) => {
    useLoader(true)
    // if(realEstateList.length == 0){
    dispatch(fetchRetirementNonRetirementData({ userId: primaryUserId }))
    // }
    if (propertyTypeList.length == 0) {
      dispatch(fetchPropertytype())
    }
    if (liabilityType.length == 0) {
      dispatch(getLiabilities({ lenderId: 6 }))
    }
    konsole.log(liabilityType, "liabilityType")

    if (realEstateitem.isRealPropertys.length > 0) {
      dispatch(getUserLiabilityByUserRealPropertyId({ userId: primaryUserId, userRealPropertyId: realEstateitem.isRealPropertys[0].userRealPropertyId }))
    }
    useLoader(false)
  }, [realEstateitem.userAgingAssetId])

  konsole.log(LiabilityByUserRealPropertyId.liability, "LiabilityByUserRealPropertyId")

  const updateRealEstate = (item) => {
    konsole.log(item, "itemitemitemitem");
    let updatedItem = item;
    if (item?.isRealPropertys?.length > 0) {
      let isRealPropertys = item?.isRealPropertys[0]
      let isRealPropertysUpdate = { ...isRealPropertys, value: $AHelper.$forIncomewithDecimal(isRealPropertys?.value), purchasePrice: $AHelper.$forIncomewithDecimal(isRealPropertys?.purchasePrice) }
      updatedItem = { ...item, isRealPropertys: [isRealPropertysUpdate] }
    }
    konsole.log("updatedItem",updatedItem);
    setRealestateitem(updatedItem);
    setisRealPropertys(updatedItem?.isRealPropertys[0])
    setShowAccordion(false)
    setHideCustomeSubSideBarState(true)
    setActiveKeys(["0"])
  }

  const hideSidbar = () => {
    setHideCustomeSubSideBarState(false)
    setShowAccordion(true)
  }

  const handleInputChange = async (key, value) => {
    setRealestateitem(prev => ({ ...prev, [key]: value.value }))
    if (key == "agingAssetTypeId" && value.value == "20") {
      let addressIds = await addressRef.current.setUserData(primaryUserId)
      setisRealPropertys((prev => ({ ...prev, addressId: addressIds })))
    } else {
      let addressIds = await addressRef.current.setUserData()
    }
    setShowError(false);
  }

  const addRealEstate = () => {
    setRealestateitem({ ...$JsonHelper.assetObj(), agingAssetCatId: 3, isRealPropertys: [{ ...$JsonHelper.isRealPropertyNewObj() }] })
    setisRealPropertys({ ...$JsonHelper.isRealPropertyNewObj() })
    setShowAccordion(false)
    setLenderlist([])
    setHideCustomeSubSideBarState(true)
    $AHelper.$scroll2Top()
    setActiveKeys(["0"]);
  }

  const deleteRealEstate = async (item) => {

    let newConfirmtion = await newConfirm(true, 'Are you sure you want to delete this Real Estate? This action cannot be undone.', "Confirmation", "Deleted Real Estate", 2)
    if (!newConfirmtion) return;
    submitData('delete', item)

  }
  const submitData = async (type, item) => {
    konsole.log(realEstateitem, isRealPropertys, "isRealPropertysrealEstateitem", type, item)


    if (type != 'delete' && (realEstateitem.agingAssetTypeId == null || realEstateitem?.assetOwners?.length == 0)) {
      if(realEstateitem.agingAssetTypeId == null) {
        focusInputBox('agingAssetType');
        setActiveKeys(["0"]);
      }else if(realEstateitem?.assetOwners?.length == 0) {
        focusInputBox('ownerTypeSelect');
        setActiveKeys(["1"]);
      }
      setShowError(true);
      return;
    }
    
  
    const addressResponse = type != 'delete' ? await addressRef.current.handleSubmit() : 'err';
    if(addressResponse?.isActive == false){
      return
    }
    if (addressResponse != 'err') {
      setisRealPropertys({ ...isRealPropertys, 'addressId': addressResponse.addressId })
    }
    let url = $Service_Url.putUpdateUserAgingAsset;
    let method = 'PUT'
    let updatedJson = type == 'delete' ? item : realEstateitem

    setisRealPropertys({ ...isRealPropertys, isDebtAgainstProperty: lenderList?.some((e) => e.isActive == true)})


    if (updatedJson.userAgingAssetId == 0) {
      url = $Service_Url.postUseragingAsset
      method = 'POST'
      updatedJson = { ...updatedJson, 'ownerTypeId': 1 }
    }

    if (type != 'delete') {
      updatedJson = { ...updatedJson, 'isRealPropertys': (updatedJson.userAgingAssetId == 0) ? [isRealPropertys] : [isRealPropertys] };
    }

    if (type == 'delete') {
      updatedJson = { ...updatedJson, 'isActive': false }
    }

    updatedJson = { ...updatedJson, 'UpdatedBy': primaryUserId };

    let jsonObj = {
      userId: primaryUserId,
      asset: updatedJson
    }

    konsole.log(jsonObj, "jsonObjjsonObjjsonObjjsonObj")

    useLoader(true)
    const responseData = await postApiCall(method, url, jsonObj)
    useLoader(false)
    if (responseData != 'err') {
      konsole.log(responseData, "responseData", updatedJson)
      if (updatedJson.agingAssetTypeId == '999999' && type != 'delete') {
        realPropertyRef.current.saveHandleOther(responseData.data.data.userAgingAssetId)
      } 
      if (type == 'AddRealEstate') {
        setRealestateitem(responseData.data.data)
        setisRealPropertys(responseData.data.data.isRealPropertys[0])
        setOpenmodal(true)
        return;
      }

    { type != "delete" ? setWarning( 'successfully', `Successfully ${updatedJson.userAgingAssetId == 0 ? 'saved' : 'updated'} data.`, `Your data have been ${updatedJson.userAgingAssetId == 0 ? 'saved' : 'updated'} successfully`) :
      setWarning("deletedSuccessfully", "Real Estate has been deleted successfully",)}
      
      // setWarning('successfully', `Successfully ${updatedJson.userAgingAssetId == 0 ? 'saved' : type == 'delete' ? 'deleted' : 'updated'} data.`, `Your data has been successfully ${updatedJson.userAgingAssetId == 0 ? 'saved' : type == 'delete' ? 'deleted' : 'updated'}`)

      // if (updatedJson.userAgingAssetId == 0) {
      //   konsole.log(responseData.data.data, "responseData2")
      //   setRealestateitem(responseData.data.data);
      //   if (lenderList?.length > 0) {
      //     await sumbitLender('add', lenderData, responseData.data.data);
      //   }
      // }
      $AHelper.$scroll2Top()
      if (type == 'another') {
        setRealestateitem({ ...$JsonHelper.assetObj(), agingAssetCatId: 3 })
        setisRealPropertys({ ...$JsonHelper.isRealPropertyNewObj() })
        await addressRef.current.setUserData()
        fetchApi(primaryUserId)
        setActiveKeys(["0"])
        return
      } 

      fetchApi(primaryUserId)
      setRealestateitem({ ...$JsonHelper.assetObj(), agingAssetCatId: 3 })
      setisRealPropertys({ ...$JsonHelper.isRealPropertyNewObj() })
      if (type == 'Next') {
        handleActiveTab(15)
      }
      setShowAccordion(true);
      setHideCustomeSubSideBarState(false)
    }
  }

  const editLender = (item) => {
    // if(isRealPropertys?.userRealPropertyId == undefined){
    //   submitData('AddRealEstate')
    //   return;
    // }
    let updatedItem={...item,
      paymentAmount: $AHelper.$isNotNullUndefine(item?.paymentAmount) ? $AHelper.$forIncomewithDecimal(item?.paymentAmount) : null,
      outstandingBalance: $AHelper.$isNotNullUndefine(item?.outstandingBalance) ? $AHelper.$forIncomewithDecimal(item?.outstandingBalance) : null,
      debtAmount: $AHelper.$isNotNullUndefine(item?.debtAmount) ? $AHelper.$forIncomewithDecimal(item?.debtAmount) : null
    }
    console.log("updatedItem",updatedItem)
    setOpenmodal(true)
    setLenderData(updatedItem)
  }



  const addLender = (item) => {
    if (isRealPropertys?.userRealPropertyId == undefined) {
      submitData('AddRealEstate')


      let jsonObj = { ...$JsonHelper.lenderObj() }
      jsonObj['liabilityId'] = item?.id;
      jsonObj['liabilityName'] = item?.response;
      setLenderData(jsonObj)
      return
    }

    let jsonObj = { ...$JsonHelper.lenderObj() }
    jsonObj['liabilityId'] = item?.id;
    jsonObj['liabilityName'] = item?.response;
    setLenderData(jsonObj)
    setOpenmodal(true)

    // konsole.log(jsonObj, 'addLenderaddLender', item)
  }

  const closeModal = () => {
    setOpenmodal(false)
    setShowlenderError(false);
    setLenderData({ ...$JsonHelper.lenderObj() })
  }

  const deleteUnchecked = (item) => {
    let lenderJson = lenderList.filter((e) => { return e.liabilityId == item.id })
    deleteLender(lenderJson[0])
  }

  const deleteLender = async (item) => {
    konsole.log(item, 'deleteLender')
    let newConfirmtion = await newConfirm(true, 'Are you sure you want to delete this Lender? This action cannot be undone.', "Confirmation", "Deleted Lender", 2)
    if (!newConfirmtion) return;
    sumbitLender('delete', item)
  }

  konsole.log(realEstateitem, 'realEstateitemrealEstateitem')

  const sumbitLender = async (type, data, realEstateitems) => {

    let upsertUserLiabilitie = {};
    let getAddressContact = [];
    let getContactData = {};
    let realEstate = type == 'add' ? realEstateitems : realEstateitem
    upsertUserLiabilitie = (type == 'delete') ? data : lenderData;
    konsole.log(upsertUserLiabilitie, "lenderDatalenderData", type, "realEstateitem", realEstateitem)

    if (isNullUndefine(upsertUserLiabilitie.nameofInstitutionOrLender)) {
      setShowlenderError(true);
      if(type != "delete") focusInputBox("Name of Lender", true);
      return;
    }
    // if (realEstate?.isRealPropertys.length > 0 && isNullUndefine(realEstate.isRealPropertys[0]?.userRealPropertyId) && type == 'addList') {
    //   getAddressContact = await addressLenderRef.current.handleSubmit()
    //   let lenderInformation = { ...lenderInformation, addresses: [getAddressContact] }
    //   upsertUserLiabilitie = { ...upsertUserLiabilitie, lenderInformation: lenderInformation, userRealPropertyId: [] }
    //   konsole.log(upsertUserLiabilitie, "upsertUserLiabilitie",getAddressContact)
    //   let addLenders = lenderList?.map((e) => {
    //     if (e.liabilityId == upsertUserLiabilitie.liabilityId) {
    //       return upsertUserLiabilitie;
    //     }
    //     return e;
    //   });
    //   konsole.log(addLenders,"addLendersaddLenders",upsertUserLiabilitie)
    //   setLenderlist((prev) => lenderList?.length > 0 ? lenderList.some((e)=> (e.liabilityId == upsertUserLiabilitie.liabilityId)) ? [addLenders[0]] : [...prev,upsertUserLiabilitie] : [upsertUserLiabilitie])

    //   setOpenmodal(false);
    //   return;
    // }
    if (type == 'delete') {
      upsertUserLiabilitie = { ...upsertUserLiabilitie, isActive: false, nameofInstitutionOrLender: '', liabilityTypeId: null, lenderUserId: null };
      if (realEstate.isRealPropertys.length > 0 && isNullUndefine(realEstate.isRealPropertys[0]?.userRealPropertyId)) {
        let deleteLender = lenderList?.filter((e) => e.liabilityId != upsertUserLiabilitie.liabilityId)
        setLenderlist(deleteLender)
        konsole.log(deleteLender, "deleteLenderdeleteLender", lenderList, "l", upsertUserLiabilitie)
        return;
      }
    }
    if (realEstate?.isRealPropertys.length > 0 && realEstate.isRealPropertys[0]?.userRealPropertyId && type == 'add') {
      getAddressContact = await addressLenderRef?.current?.handleSubmit();
      konsole.log(getAddressContact, "getAddressContact1")
      getContactData = await addressLenderRef?.current?.submitContact();
      delete getContactData?.userId
      let lenderInformation = { ...lenderInformation, addresses: getAddressContact?.address }
      upsertUserLiabilitie = { ...upsertUserLiabilitie, lenderInformation: lenderInformation, userRealPropertyId: realEstate.isRealPropertys[0]?.userRealPropertyId }
      if (upsertUserLiabilitie.userLiabilityId == 0) {
        delete upsertUserLiabilitie.userLiabilityId
      }
    } else {
      getAddressContact = await addressLenderRef?.current?.handleSubmit();
      konsole.log(getAddressContact?.json[0]?.address, "getAddressContact2", getAddressContact)
      getContactData = await addressLenderRef?.current?.submitContact();
      upsertUserLiabilitie = { ...upsertUserLiabilitie, userRealPropertyId: realEstate?.isRealPropertys[0]?.userRealPropertyId }
    }

    // konsole.log(getContactData,"getContactData")
    if ((!isNotValidNullUndefile(getContactData) || getContactData.isActive == false) && (type !== 'delete')) {
      return;
    }

    // konsole.log(upsertUserLiabilitie, "lenderDatalenderData8989",getAddressContact,"getContactData",type)


    let contactData = getContactData
    delete contactData?.userId

    let informationObj = {
      addresses: $AHelper.$isNotNullUndefine(getAddressContact?.json[0]?.address) ? [getAddressContact?.json[0]?.address] : [],
      contacts: getContactData == false ? {} : getContactData?.contact
    }
    upsertUserLiabilitie = { ...upsertUserLiabilitie, lenderInformation: informationObj }

    // return;
    let jsonObj = {

      userId: primaryUserId,
      upsertedBy: primaryUserId,
      upsertUserLiabilities: realEstate?.isRealPropertys?.length == 0 && lenderList?.length > 1 ? lenderList : [isNullUndefine(upsertUserLiabilitie.userLiabilityId) ? upsertUserLiabilitie :
        {
          liabilityTypeId: upsertUserLiabilitie.liabilityTypeId,
          nameofInstitutionOrLender: upsertUserLiabilitie.nameofInstitutionOrLender,
          outstandingBalance: upsertUserLiabilitie.outstandingBalance,
          paymentAmount: upsertUserLiabilitie.paymentAmount,
          userLiabilityId: upsertUserLiabilitie.userLiabilityId,
          loanNumber: upsertUserLiabilitie.loanNumber,
          interestRatePercent: upsertUserLiabilitie.interestRatePercent,
          userRealPropertyId: upsertUserLiabilitie.userRealPropertyId,
          isActive: upsertUserLiabilitie.isActive,
          liabilityId: upsertUserLiabilitie.liabilityId,
          lenderUserId: upsertUserLiabilitie.lenderUserId,
          lenderInformation: informationObj,
          payOffDate:upsertUserLiabilitie?.payOffDate ?? null,
          endDateLiability: upsertUserLiabilitie?.endDateLiability ?? null,
        }
      ]
    }


    // konsole.log(jsonObj,"jsonObjPost",getAddressContact?.address,"informationObj",informationObj,"getContactData",getContactData)
    useLoader(true);
    const responseUpdatelender = await postApiCall('POST', $Service_Url.putUpsertLiabilitiy, jsonObj)
    useLoader(false);
    if (responseUpdatelender != 'err') {
      konsole.log(responseUpdatelender, "responseUpdatelender", realEstateitem, realEstateitem.isRealPropertys[0]?.userRealPropertyId)
      { type != "delete" ? setWarning('successfully', `Successfully ${isNullUndefine(upsertUserLiabilitie.userLiabilityId) ? 'saved' : 'updated'} data.`, `Your data have been ${isNullUndefine(upsertUserLiabilitie.userLiabilityId) ? 'saved' : 'updated'} successfully`) :
         setWarning("deletedSuccessfully", "Lender information has been deleted successfully")}
      // if(isNullUndefine(upsertUserLiabilitie.userLiabilityId)){
      // setShowAccordion(true);
      dispatch(getUserLiabilityByUserRealPropertyId({ userId: primaryUserId, userRealPropertyId: realEstate.isRealPropertys[0]?.userRealPropertyId }))
      dispatch(fetchRetirementNonRetirementData({ userId: primaryUserId }))
      fetchApi(primaryUserId);
      setLenderData({ ...$JsonHelper.lenderObj() })
      setOpenmodal(false);
      // }
    }
    else {
      setOpenmodal(false);
    }
  }

  const handleAccordionClick = () => {
    setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
};

const handleAccordionBodyClick = (key) => {
    setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
};



  konsole.log(realEstateitem, "realEstateData", realEstateData)
  konsole.log(lenderList, "lenderListlenderList", lenderData)
  return (
    showAccordion ? <div>
      <RealEstateTable realEstateData={realEstateData} updateRealEstate={updateRealEstate} addRealEstate={addRealEstate} deleteRealEstate={deleteRealEstate} primaryUserId={primaryUserId} handleActiveTab={handleActiveTab} /></div> : <div>

      <CustomAccordion
        isExpendAllbtn={true}
        handleActiveKeys={handleAccordionClick}
        activeKeys={activeKeys}
        allkeys={allkeys}
        activekey={activeKeys}
        header={<div className="previous-btn my-2 mt-2">
          <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer" onClick={() => hideSidbar()} />
          <span className="ms-1" onClick={() => hideSidbar()}>Previous</span>
        </div>}
      >
        <CustomAccordionBody eventkey="0" name="Property information" setActiveKeys={() => handleAccordionBodyClick('0')}>
          <Row md={12} xl={12} className="d-flex">
            <Col className="mt-3" md={12} xl={3}>
            <p className="heading-of-sub-side-links-3">{isContentProperty}</p>     
            </Col>
            <Col className="mt-3" md={9}>
              <Col xs={12} md={6} lg={5} className="mb-2 pe-3">
                <CustomSelect tabIndex={1} id="agingAssetType" label="Description of property*" placeholder="Select" options={propertyTypeList} value={realEstateitem?.agingAssetTypeId} onChange={(e) => handleInputChange("agingAssetTypeId", e)} isError={(showError && realEstateitem.agingAssetTypeId == null) ? 'Please select the propert type' : null} />
              </Col>
              <Col xs={12} md={6} lg={5} className="mb-2 pe-3">
                {realEstateitem?.agingAssetTypeId == '999999' && <Other tabIndex={2} othersCategoryId={3} userId={primaryUserId} dropValue={realEstateitem?.agingAssetTypeId} ref={realPropertyRef} natureId={realEstateitem.userAgingAssetId} />}
              </Col>
              <ContactAndAddress startTabIndex={3} refrencePage="RealEstate" showType="address" businessInterestAddressId={realEstateitem?.isRealPropertys[0]?.addressId} ref={addressRef} isMandotry={false} showOnlyForm={true} />
            </Col>

          </Row>
        </CustomAccordionBody>
        <CustomAccordionBody eventkey="1" name="Financial and ownership Information" setActiveKeys={() => handleAccordionBodyClick('1')}>
          <FinancialownerInformation startTabIndex={3 + 20} realEstateitem={realEstateitem} isRealPropertys={isRealPropertys} setisRealPropertys={setisRealPropertys} setRealestateitem={setRealestateitem} showError={showError && realEstateitem?.assetOwners?.length == 0} setShowError={setShowError} liabilityType={liabilityType}
            addLender={addLender} lenderList={lenderList} deleteUnchecked={deleteUnchecked} isSideContent={isContentFinancial} />
        </CustomAccordionBody>
        {(lenderList?.length > 0 || openModal) && <CustomAccordionBody eventkey="2" name="Lender Information" onClick={() => konsole.log("Lender Information")} setActiveKeys={() => handleAccordionBodyClick('2')}>
          <div className="col-12 d-flex row">
            <div className="d-md mt-3 col-3 col-md-12 col-xl-3 heading-of-sub-side-links-3 col">
              {isContentLender}
            </div>
            <div className="col-9">
              <LenderTable  lenderList={lenderList} editLender={editLender} addLender={addLender} deleteLender={deleteLender} />
            </div>
          </div>
        </CustomAccordionBody>}
        {openModal && <EditLender startTabIndex={3 + 20 + 5} showModal={openModal} setShowModal={closeModal} lenderData={lenderData} setLenderData={setLenderData} sumbitLender={sumbitLender} primaryUserId={primaryUserId} addressLenderRef={addressLenderRef} showLenderError={showLenderError} setShowlenderError={setShowlenderError} submitData={submitData} isRealPropertys={isRealPropertys} />}
        <div className="d-flex justify-content-between mt-2">
        <CustomButton2 tabIndex={3 + 20 + 5 + 29} label={`${realEstateitem.userAgingAssetId == 0 ? 'Save' : 'Update'} & Continue later`} onClick={() => submitData()} />
          <div>
                {(realEstateitem.userAgingAssetId == 0) && <CustomButton3 tabIndex={3 + 20 + 5 + 29 + 1} label={'Save & Add Another'} onClick={() => submitData('another')} />}
                  <CustomButton tabIndex={3 + 20 + 5 + 29 + 1 + 1} label="Next: Business Interests" onClick={() => submitData('Next')} />
          </div>
        </div>
      </CustomAccordion>
    </div>
  )

}
export default RealEstate;