import React, { useState, useCallback, useEffect, useMemo, useContext } from 'react'
import { Col, Row, Table } from 'react-bootstrap'
import { CustomInputSearch } from '../../Custom/CustomComponent'
import { CustomButton } from '../../Custom/CustomButton'
import { $AHelper } from '../../Helper/$AHelper'
import usePrimaryUserId from '../../Hooks/usePrimaryUserId'
import LongTermCareInsuranceAccordians from './LongTermCareInsuranceAccordians'
import { getApiCall, isNotValidNullUndefile, isNullUndefine, postApiCall } from '../../../components/Reusable/ReusableCom'
import { $Service_Url } from '../../../components/network/UrlPath'
import konsole from '../../../components/control/Konsole'
import { setHideCustomeSubSideBarState, useLoader } from '../../utils/utils'
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux'
import { selectorFinance } from '../../Redux/Store/selectors'
import { updatePrimaryMemLongTermInsuranceList, updateSpouseLongTermInsuranceList } from '../../Redux/Reducers/financeSlice'
import { globalContext } from '../../../pages/_app'
import OtherInfo from '../../../components/asssets/OtherInfo'
import UploadedFileView from '../../Common/File/UploadedFileView'

const LongTermCareInsurancePolicyTable = ({ handleActiveTab }) => {
  const [activeType, setActiveType] = useState('Table');
  const [activeTab, setActiveTab] = useState('Personal');
  const [searchValue, setSearchValue] = useState(null);
  const [editInfo, setEditInfo] = useState('')
  const [activeBtn, setActiveBtn] = useState("Personal");
  const [viewFileInfo, setViewFileInfo] = useState(false)
  const [viewPdfdata, setviewPdfdata] = useState([]);
  const tableHeader = ['Type of Policy', 'Insurance Provider', 'Premium Frequency', 'Premium Amount', 'Policy No.', 'View/Edit/Delete']

  const { primaryUserId, spouseUserId, loggedInUserId, spouseFirstName, primaryMemberFirstName, isPrimaryMemberMaritalStatus, spouseFullName } = usePrimaryUserId();
  const dispatch = useAppDispatch()
  const LongTermInsTableData = useAppSelector(selectorFinance)

  const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
  const { addedPrimaryMemLongTermInsuranceList, addedSpouseLongTermInsuranceList } = LongTermInsTableData;

  useEffect(() => {
    if ($AHelper.$isNotNullUndefine(primaryUserId) && activeTab == "Personal" && addedPrimaryMemLongTermInsuranceList?.length == 0) {
      fetchAddedPrimaryMemLongTermInsuranceList()
    }
    if ($AHelper.$isNotNullUndefine(spouseUserId) && isPrimaryMemberMaritalStatus && activeTab == "Spouse" && addedSpouseLongTermInsuranceList?.length == 0) {
      fetchAddedSpouseLongTermInsuranceList()
    }
    return () => setHideCustomeSubSideBarState(false)
  }, [primaryUserId, activeTab])

  const fetchAddedPrimaryMemLongTermInsuranceList = async () => {
    useLoader(true);
    const _resultOfInsuranceDetail = await getApiCall('GET', $Service_Url.getUserLongTermIns + primaryUserId);
    useLoader(false);
    const insDetails = _resultOfInsuranceDetail != 'err' ? _resultOfInsuranceDetail?.longTermIns : []
    konsole.log("_resultOfInsuranceDetail13", _resultOfInsuranceDetail, insDetails);
    dispatch(updatePrimaryMemLongTermInsuranceList(insDetails));
  }

  const fetchAddedSpouseLongTermInsuranceList = async () => {
    useLoader(true);
    const _resultOfInsuranceDetail = await getApiCall('GET', $Service_Url.getUserLongTermIns + spouseUserId);
    useLoader(false);
    const insDetails = _resultOfInsuranceDetail != 'err' ? _resultOfInsuranceDetail?.longTermIns : []
    konsole.log("_resultOfInsuranceDetail14", _resultOfInsuranceDetail, insDetails);
    dispatch(updateSpouseLongTermInsuranceList(insDetails));
  }

  // @@ @@ table Data tab
  const tableDataMap = useMemo(() => {
    return activeTab == "Personal" ? addedPrimaryMemLongTermInsuranceList : addedSpouseLongTermInsuranceList;
  }, [dispatch, activeTab, addedPrimaryMemLongTermInsuranceList, addedSpouseLongTermInsuranceList]);

  // @@ Searching Value

  const filteredSearchData = useMemo(() => {
    let searchQuery = searchValue;
    let data = tableDataMap;

    if ($AHelper.$isNotNullUndefine(searchQuery)) {
      const searchString = searchQuery.toLowerCase();
      return data.filter(item => {
        return (
          (item?.insType && item?.insType?.toLowerCase().includes(searchString))
        );
      });
    } else {
      return data;
    }
  }, [searchValue, tableDataMap, addedPrimaryMemLongTermInsuranceList, addedSpouseLongTermInsuranceList]);

  const deleteLongTermCareIns = async (item) => {
    konsole.log("item", item);

    const confirmRes = await newConfirm(true, `Are you sure you want to delete this long term care insurance policy? This action cannot be undone.`, "Confirmation", "Delete Long Term Care Insurance Policy", 2);
    konsole.log("confirmRes", confirmRes);
    if (!confirmRes) return;
    const userId = activeTab == "Spouse" ? spouseUserId : primaryUserId
    useLoader(true);
    const _resultOfDeleteInsurance = await postApiCall('DELETE', $Service_Url.deleteUserLongTermIns + userId + "/" + item?.userLongTermInsId, "",)
    konsole.log("_resultOfDeleteInsurance", _resultOfDeleteInsurance);

    // Update redux Data 
    if (_resultOfDeleteInsurance != 'err') {
      const filterInsuranceDetails = (details) => details.filter(i => i.userLongTermInsId !== item.userLongTermInsId);

      if (activeTab == "Personal") {
        const filteredInsurance = filterInsuranceDetails(addedPrimaryMemLongTermInsuranceList);
        dispatch(updatePrimaryMemLongTermInsuranceList(filteredInsurance));
      } else if (activeTab == "Spouse") {
        const filteredInsurance = filterInsuranceDetails(addedSpouseLongTermInsuranceList);
        dispatch(updateSpouseLongTermInsuranceList(filteredInsurance));
      }
    }
    toasterAlert("deletedSuccessfully", "Long term care insurance policy has been deleted successfully.")
    useLoader(false);

  }

  // const handleActiveTab = useCallback((val) => {
  //     setActiveTab(val);
  // }, []);

  // @@update Member--- edit value state update and btn type
  const updateLongTermCareIns = (item) => {
    konsole.log("update-item", item)

    const updatedItem = {
      ...item,
      dailyBenefitNHSetting: $AHelper.$forIncomewithDecimal(item?.dailyBenefitNHSetting),
      dailyBenefitOtherThanNH: $AHelper.$forIncomewithDecimal(item?.dailyBenefitOtherThanNH),
      maxLifeBenefits: $AHelper.$forIncomewithDecimal(item?.maxLifeBenefits),
      premiumAmount: $AHelper.$forIncomewithDecimal(item?.premiumAmount),
    }
    setEditInfo(updatedItem);
    handleAddAnother(activeTab)
    setHideCustomeSubSideBarState(true)
    $AHelper.$scroll2Top();
  }

  const handleAddAnother = (val) => {
    setActiveType('ADDEDIT')
    setActiveTab(val)
    setHideCustomeSubSideBarState(true)
    // setEditInfo('')
    $AHelper.$scroll2Top();
  }

  const handleActiveTabButton = (val) => {
    setActiveBtn(val)
    setSearchValue("")
    setActiveTab(val)
  }

  // Toaster Alert
  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  }
  konsole.log("setActiveType", activeType, activeTab)

  const handleViewFileInfo = (val) => {
    setViewFileInfo(val)
    setviewPdfdata([]);
    fetchDataForPdf(val)
  }


  const handleNextBtn = ()=>{
      if (activeTab == "Personal" && isPrimaryMemberMaritalStatus) {
        handleActiveTabButton("Spouse")
        $AHelper.$scroll2Top();
      } else {
        handleActiveTab(17)
      }
  }

  const fetchDataForPdf = async (selectedItem) => {
    if (!selectedItem) return {};

    konsole.log("sdvbkjbjs", selectedItem);

    const bankdetails = isNotValidNullUndefile(selectedItem?.quesReponse) ? JSON?.parse(selectedItem?.quesReponse) : '';
    const otherObj = [{ isActive: true, othersMapNatureId: String(selectedItem?.userLongTermInsId), othersMapNature: '', userId: primaryUserId }]
    const getOtherRes = (selectedItem?.insType == "Other") ? await postApiCall("POST", $Service_Url.getOtherFromAPI, otherObj) : {};
    const getOtherInsurance = (selectedItem?.insCompany == "Other") ? await postApiCall("POST", $Service_Url.getOtherFromAPI, otherObj) : {};
    konsole.log("ViewOtherData", selectedItem, getOtherRes, getOtherInsurance)

    setviewPdfdata([{ 'Type of Policy':  getOtherRes?.data?.data?.[0]?.othersName || selectedItem.insType },
    { 'Policy number': selectedItem.additionalDetails || "N/A" },
    { 'Insurance provider':  getOtherInsurance?.data?.data?.[1]?.othersName || selectedItem.insCompany || "N/A" },
    { 'Policy start date': $AHelper.$isNotNullUndefine(selectedItem?.policyStartDate) ? $AHelper.$getFormattedDate(selectedItem.policyStartDate) : "N/A" },
    { 'Premium frequenecy': selectedItem.premiumFrequency || "N/A" },
    { 'Premium amount': isNullUndefine(selectedItem.premiumAmount) ? "N/A" : $AHelper.$IncludeDollars(selectedItem.premiumAmount) },
    { 'When was the last premium increased': $AHelper.$isNotNullUndefine(selectedItem?.lastTimePremiumIncrease) ? $AHelper.$getFormattedDate(selectedItem.lastTimePremiumIncrease) : "N/A" },
    // { 'How are the expenses paid?': bankdetails.expensePaid == 2 ? "Auto Pay" : bankdetails.expensePaid == 1 ? "Manually" : "N/A" },
    // ...(bankdetails?.expensePaid == 1 ? [{ "Please specify the mode of payment": bankdetails.paymentMode == 11 ? "Mail" : bankdetails.paymentMode == 12 ? "In person" : bankdetails.paymentMode == 13 ? "Electronically" : "N/A" }] : []),
    // ...(bankdetails?.expensePaid == 2 ? [{ 'Enter the Bank Name': bankdetails?.bankname || 'N/A' },
    // { 'Enter the Account Number': bankdetails?.accountnumber || 'N/A' }] : []),
    { 'Daily benefit amount-nursing home': $AHelper.$isNullUndefine(selectedItem.dailyBenefitNHSetting) || selectedItem.dailyBenefitNHSetting == "0.00" ? "N/A" : $AHelper.IncludeDollars(selectedItem.dailyBenefitNHSetting)  },
    { 'Daily benefit amount other than nurse home setting': $AHelper.$isNullUndefine(selectedItem.dailyBenefitOtherThanNH) || selectedItem.dailyBenefitOtherThanNH == "0.00" ? "N/A" : $AHelper.IncludeDollars(selectedItem.dailyBenefitOtherThanNH)},
    { 'Maximum lifetime benefits': $AHelper.$isNullUndefine(selectedItem.maxLifeBenefits) || selectedItem.maxLifeBenefits == "0.00" ? "N/A" : $AHelper.IncludeDollars(selectedItem.maxLifeBenefits)},
    { 'Number of years benefits will continue': selectedItem.maxBenefitYears || "N/A" },
    { 'Elimination period': selectedItem.eliminationPeriod || "N/A" },
    { 'Inflation Percentage': selectedItem && selectedItem?.planWithInflationRiderPer.length > 0 ? (selectedItem.planWithInflationRiderPer + "%") : "N/A" }]);


  }

  return (
    <>

      {(activeType == 'Table') ?
        <>
        {viewFileInfo && <UploadedFileView refrencePage='Long Term Care Insurance Policy' isOpen={true} fileId={viewFileInfo?.longTermInsDocs[0]?.fileId} handleViewFileInfo={handleViewFileInfo} fileDetails={{ name: 'Long Term Care Policy' }} itemList={viewPdfdata} />}
          <div style={{ borderBottom: '1px solid #F0F0F0' }}></div>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div className="col-auto">
              <span className="heading-of-sub-side-links-2">View and add your Long-Term Care Policy  here</span>
            </div>
            {(isPrimaryMemberMaritalStatus) &&
              <div className="d-flex align-items-end justify-content-end" style={{ margin: "-62px 24px 36px" }}>
                <div className="btn-div addBorderToToggleButton ms-auto" >
                  <button className={`view-btn ${activeBtn == "Personal" ? "active selectedToglleBorder" : ""}`} onClick={() => handleActiveTabButton("Personal")}> {primaryMemberFirstName}</button>
                  <button className={`view-btn ${activeBtn == "Spouse" ? "active selectedToglleBorder" : ""}`} onClick={() => handleActiveTabButton("Spouse")}> {spouseFirstName}</button>
                </div>
              </div>
            }
          </div>
          {/* Search and count and add another content */}

          <div id="information-table" className=" mt-2 information-table table-responsive">

            <div className="table-search-section sticky-header-1 d-flex justify-content-between align-items-center">
              <div className="children-header w-50">
                <span>Long-Term Care Policy</span>
                <span className="badge ms-1">
                  {filteredSearchData?.length} Added</span>
              </div>
              <div style={{ marginBottom: "43px" }} className=' w-50'>
                <CustomInputSearch
                  isEroor=''
                  label=''
                  id='search'
                  placeholder='Search'
                  value={searchValue}
                  onChange={(val) => setSearchValue(val)}
                />
              </div>
              <div className='w-25 d-flex flex-row-reverse'>
                <CustomButton label="Add Policy"
                  onClick={() => handleAddAnother(activeTab)}
                />
              </div>
            </div>

            {/* Search and count and add another content */}
            {/* TABLE */}
            <div className='table-responsive fmlyTableScroll'>
              <Table className="custom-table">
                {/* @@ header content */}
                <thead className="sticky-header">
                  <tr>
                    {tableHeader.map((item, index) => (
                      <th key={index}>{item}</th>
                    ))}
                  </tr>
                </thead>
                {/* @@ header content */}
                {filteredSearchData?.length > 0 ? (
                  <tbody className='table-body-tr'>
                    {filteredSearchData.map((item, index) => {
                      konsole.log("longtermItem", item);

                      return (
                        <tr key={index}>
                          <td>
                            <OtherInfo othersCategoryId={34} othersMapNatureId={item?.userLongTermInsId} FieldName={item?.insType || "-"} userId={activeTab == "Spouse" ? spouseUserId : primaryUserId} />
                          </td>
                          {/* <td>{$AHelper.$isNotNullUndefine(item?.policyStartDate) ? $AHelper.$getFormattedDate(item?.policyStartDate) : "-"}</td> */}
                          <td>
                            <OtherInfo othersCategoryId={12} othersMapNatureId={item?.userLongTermInsId} FieldName={item?.insCompany || "-"} userId={activeTab == "Spouse" ? spouseUserId : primaryUserId} />
                          </td>
                          {/* <td>{$AHelper.$isNotNullUndefine(item?.eliminationPeriod) ? item?.eliminationPeriod : "-"}</td> */}
                          {/* <td>{$AHelper.$isNotNullUndefine(item?.maxLifeBenefits) ? $AHelper.IncludeDollars(item?.maxLifeBenefits) : "-"}</td>
                          <td>{$AHelper.$isNotNullUndefine(item?.maxBenefitYears) ? item?.maxBenefitYears : "-"}</td> */}
                          <td>{$AHelper.$isNotNullUndefine(item?.premiumFrequency) ? item?.premiumFrequency : "-"}</td>
                          <td>{$AHelper.$isNotNullUndefine(item?.premiumAmount) ? $AHelper.IncludeDollars(item?.premiumAmount) : "-"}</td>
                          {/* <td>{$AHelper.$isNotNullUndefine(item?.lastTimePremiumIncrease) ? $AHelper.$getFormattedDate(item?.lastTimePremiumIncrease) : "-"}</td> */}
                          <td>{$AHelper.$isNotNullUndefine(item?.additionalDetails) ? item?.additionalDetails : "-"}</td>

                          <td>
                            <div className="d-flex justify-content-around gap-3">
                            {<img src="/New/icons/file-eye-view.svg" alt="view Icon" className="icon cursor-pointer" onClick={() => handleViewFileInfo(item)} />}
                              <img src="/New/icons/edit-Icon.svg" alt="Edit Icon" className="icon cursor-pointer" onClick={() => updateLongTermCareIns(item)} />
                              <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer" onClick={() => deleteLongTermCareIns(item)} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={tableHeader.length}>
                        <div className="text-center no-data-found">No Data Found</div>
                      </td>
                    </tr>
                  </tbody>
                )}
              </Table>
            </div>
            {/* TABLE */}
          </div>

          <div className='d-flex justify-content-end'>
            <CustomButton label={`Proceed to ${(activeTab == "Personal" && isPrimaryMemberMaritalStatus) ? spouseFirstName + ' Information' : 'Future Expectations'}`}
             onClick={() => handleNextBtn('next')} />
          </div>
          
          {/* Search and count and add another content */}
        </> : <>

          {/* @@Add LongTerm Care Insurance Policy */}
          <LongTermCareInsuranceAccordians
            addLongTermInsFor={activeTab}
            setActiveTypeToPrevious={setActiveType}
            handleActiveTabButton={handleActiveTabButton}
            setEditInfo={setEditInfo}
            handleAddAnother={handleAddAnother}
            editInfo={editInfo}
            type={!$AHelper.$isNotNullUndefine(editInfo) ? 'ADD' : 'EDIT'}
            fetchAddedPrimaryMemLongTermInsuranceList={fetchAddedPrimaryMemLongTermInsuranceList}
            fetchAddedSpouseLongTermInsuranceList={fetchAddedSpouseLongTermInsuranceList}
            handleActiveTab={handleActiveTab} />
        </>
      }


    </>
  )
}

export default LongTermCareInsurancePolicyTable