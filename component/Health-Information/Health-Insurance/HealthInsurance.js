import React, { useEffect, useState, useMemo, useContext } from 'react';
import { Row, Table, Col, Tab } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { getApiCall, postApiCall, isNotValidNullUndefile, isNullUndefine } from '../../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../../components/network/UrlPath';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import konsole from '../../../components/control/Konsole';
import { $AHelper } from '../../Helper/$AHelper';
import { selectorHealth } from '../../Redux/Store/selectors';
import { updatePrimaryHealthInsuranceDetail, updateSpouseHealthInsuranceDetail } from '../../Redux/Reducers/healthISlice';
import { CustomInput } from '../../Custom/CustomComponent';
import { CustomButton } from '../../Custom/CustomButton';
import OtherInfo from '../../../components/asssets/OtherInfo';
import { $ApiHelper } from '../../Helper/$ApiHelper';
import HealthInsuranceAddUpdate from './HealthInsuranceAddUpdate';
import { fetchHealthInsurance } from '../../Redux/Reducers/healthISlice';
import { useLoader } from '../../utils/utils';
import { CustomInputSearch } from '../../Custom/CustomComponent';
import { globalContext } from '../../../pages/_app';
import UploadedFileView from "../../Common/File/UploadedFileView";

const tableHeader = ['Type of Plan', 'Insurance Company', 'Premium Frequency', 'Premium Amount', 'Policy No.', 'View/Edit/Delete']
const HealthInsurance = ({ handleActiveTabMain }) => {
  const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
  const { primaryUserId, spouseUserId, loggedInUserId, spouseFirstName, primaryMemberFirstName,isPrimaryMemberMaritalStatus,spouseFullName,primaryMemberFullName } = usePrimaryUserId();
  const healthApiData = useAppSelector(selectorHealth);
  const { primaryHealthInsuranceDetail, spouseHealthInsuranceDetail } = healthApiData
  const dispatch = useAppDispatch();

  // state define
  const [activeTab, setActiveTab] = useState(1);
  const [activeTableAddType, setActiveTableAddType] = useState('');
  const [searchValue, setSearchValue] = useState(null);
  const [editInfo, setEditInfo] = useState('')
  const [viewPdfdata, setviewPdfdata] = useState([]);
  const [viewFileInfo, setViewFileInfo] = useState(false)
  const isContent = `Provide your ${activeTab == 2 ? "Spouse's" : ""} health insurance details to help us tailor healthcare guidance to your needs.`

  // User Effect for get Primary and spouse data getting

  useEffect(() => {
    if ($AHelper.$isNotNullUndefine(primaryUserId) && activeTab == 1 && primaryHealthInsuranceDetail?.length == 0) {
      fetchPrimaryInsurance();
    }
    if ($AHelper.$isNotNullUndefine(spouseUserId) &&  isPrimaryMemberMaritalStatus==true && activeTab == 2 && spouseHealthInsuranceDetail?.length == 0) {
      fetchSpouseInsurance()
    }

  }, [primaryUserId, spouseUserId,isPrimaryMemberMaritalStatus, activeTab, dispatch]);


  useEffect(() => {
    if(isNotValidNullUndefile(viewFileInfo)) {
        fetchDataForPdf(viewFileInfo);
    }
}, [viewFileInfo])

  // @@ function for fetch primary member Insurance
  const fetchPrimaryInsurance = async () => {
    return new Promise(async (resolve, reject) => {
      useLoader(true);
      const _resultOfInsuranceDetail = await dispatch(fetchHealthInsurance({ userId: primaryUserId }));
      konsole.log("_resultOfInsuranceDetail", _resultOfInsuranceDetail);
      useLoader(false);
      const insDetails = _resultOfInsuranceDetail?.payload != 'err' ? _resultOfInsuranceDetail?.payload : []
      dispatch(updatePrimaryHealthInsuranceDetail(insDetails));
      resolve('res')
    })
  }



  // @@ function for fetch spouse Insurance
  const fetchSpouseInsurance = async () => {
    return new Promise(async (resolve, reject) => {
      useLoader(true);
      const _resultOfInsuranceDetail = await dispatch(fetchHealthInsurance({ userId: spouseUserId }));
      useLoader(false);
      konsole.log("_resultOfInsuranceDetail", _resultOfInsuranceDetail);
      const insDetails = _resultOfInsuranceDetail?.payload != 'err' ? _resultOfInsuranceDetail?.payload : []
      dispatch(updateSpouseHealthInsuranceDetail(insDetails));
      resolve('res')

    })

  }


  // @@ handle Delete Insurance
  const deleteInsurance = async (item) => {
    konsole.log("item", item);

    const confirmRes = await newConfirm(true, `Are you sure you want to delete this health insurance? This action cannot be undone.`, "Confirmation", "Delete Health Insurance", 2);
    konsole.log("confirmRes", confirmRes);
    if (!confirmRes) return;
    const userId = activeTab == 2 ? spouseUserId : primaryUserId
    useLoader(true);
    const _resultOfDeleteInsurance = await postApiCall('DELETE', $Service_Url.deleteUserInsurance + `?UserId=${userId}&UserInsuranceId=${item?.userInsuranceId}&DeletedBy=${loggedInUserId}`, '')
    konsole.log("_resultOfDeleteInsurance", _resultOfDeleteInsurance);

    // Update redux Data 
    if (_resultOfDeleteInsurance != 'err') {
      const filterInsuranceDetails = (details) => details.filter(i => i.userInsuranceId !== item.userInsuranceId);

      if (activeTab === 1) {
        const filteredInsurance = filterInsuranceDetails(primaryHealthInsuranceDetail);
        dispatch(updatePrimaryHealthInsuranceDetail(filteredInsurance));
      } else if (activeTab === 2) {
        const filteredInsurance = filterInsuranceDetails(spouseHealthInsuranceDetail);
        dispatch(updateSpouseHealthInsuranceDetail(filteredInsurance));
      }
    }
    toasterAlert("deletedSuccessfully", "Health insurance has been deleted successfully.")
    useLoader(false);

  }


  // @@ @@ table Data tab
  const tableDataMap = useMemo(() => {
    return activeTab === 1 ? primaryHealthInsuranceDetail : spouseHealthInsuranceDetail;
  }, [dispatch, activeTab, spouseHealthInsuranceDetail, primaryHealthInsuranceDetail]);

  // @@ Searching Value

  const filteredSearchData = useMemo(() => {
    let searchQuery = searchValue;
    let data = tableDataMap;

    if ($AHelper.$isNotNullUndefine(searchQuery)) {
      const searchString = searchQuery.toLowerCase();
      return data.filter(item => {
        return (
          (item?.insName && item?.insName?.toLowerCase().includes(searchString))
        );
      });
    } else {
      return data;
    }
  }, [searchValue, tableDataMap,activeTab, spouseHealthInsuranceDetail, primaryHealthInsuranceDetail]);



  // @@update Member--- edit value state update and btn type
  const updateInsurance = (item) => {

    let coPayment= $AHelper.$forIncomewithDecimal(item?.coPayment);
    let deductibleAmount= $AHelper.$forIncomewithDecimal(item?.deductibleAmount);
    let outOfPocketMaximum= $AHelper.$forIncomewithDecimal(item?.outOfPocketMaximum);
    let premiumAmt= $AHelper.$forIncomewithDecimal(item?.premiumAmt);
    let itemupdate ={...item,coPayment,deductibleAmount,outOfPocketMaximum,premiumAmt}
    console.log("updateInsurance",deductibleAmount,itemupdate,item);
    setEditInfo(itemupdate);
    handleActiveTableAddType(activeTab)
  }

  // handlePrevious
  const handlePreviousBtn = () => {
    setEditInfo('')
    handleActiveTableAddType('')
  }

  // @@ this for previous and cancel btn for primary care physian
  const handleActiveTabButton = (val, next) => {
    setActiveTab(val);
    setSearchValue('')
    if (next) {
      handleActiveTabMain(2)
    }
    $AHelper.$scroll2Top()
  }

  // @@ addd type primary or spouse insurance
  const handleActiveTableAddType = (val) => {
    setActiveTableAddType(val)
    $AHelper.$scroll2Top()
  }

  // Toaster Alert
  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  }

  // @@ konsole
  konsole.log("primaryHealthInsuranceDetail", primaryHealthInsuranceDetail);

  const handleViewFileInfo = (val) => {
    setViewFileInfo(val)
    setviewPdfdata([]);
}


const fetchDataForPdf = async (item ) => {  
  const bankdetails= isNotValidNullUndefile(item?.quesReponse) ? JSON?.parse(item?.quesReponse) : '' 
  konsole.log(bankdetails,"bankdetails")
  const otherObj=[{isActive: true, othersMapNatureId: String(item?.userInsuranceId), othersMapNature: '', userId: primaryUserId}]
  const getOtherRes = ( item?.typePlan == "Other" ||item?.suppPlan == "Other" || item?.insComName == "Other" ) ? await postApiCall("POST", $Service_Url.getOtherFromAPI, otherObj,) : {};
  konsole.log("ViewOtherData", item, getOtherRes,)


  let policyHolderName=activeTab==2 ? spouseFullName:primaryMemberFullName
  let arrPdfData=[{'Primary policy holder': policyHolderName || "N/A"}, 
    {'Type':  item.typePlanId == '999999' && getOtherRes?.data?.data?.filter((e)=>{return e?.othersCategoryId == 31})?.[0]?.othersName ||  item?.typePlan || "N/A"}, 
    {'Supplement Insurance': item.typePlanId == '999999' ? 'N/A' : getOtherRes?.data?.data.filter((e)=>{return e?.othersCategoryId == 30})?.[0]?.othersName ||   item?.suppPlan || "N/A"},
    {'Insurance company': getOtherRes?.data?.data?.filter((e)=>{return e?.othersCategoryId == 35})?.[0]?.othersName ||  item?.insComName || "N/A"}, 
    {'Policy/Plan Name': item.insName || "N/A"}, 
    {'policy number':item.insCardPath1 || "N/A"},
    {'Group number':item.groupNo || "N/A"},
    {'Premium frequency':  item.premiumFrePerYear || "N/A"},
    {'Premium amount': isNullUndefine(item.premiumAmt) ? "N/A" :  $AHelper.IncludeDollars(item.premiumAmt)}, 
    {'Deductible amount': isNullUndefine(item.deductibleAmount)? "N/A" : $AHelper.IncludeDollars(item.deductibleAmount)},
    {'Co-payment': isNullUndefine(item.coPayment) ? "N/A" : $AHelper.IncludeDollars(item.coPayment)},
    {'Out of pocket maximum': isNullUndefine(item.outOfPocketMaximum) ?  "N/A": $AHelper.IncludeDollars(item.outOfPocketMaximum)},
    {'Coverage start date': isNullUndefine(item.insStartDate) ? "N/A" :  $AHelper.$getFormattedDate(item.insStartDate)},
    {'Coverage end date':  isNullUndefine(item.insEndDate) ? "N/A" :   $AHelper.$getFormattedDate(item.insEndDate)}, 
    {'How are the expenses paid?':bankdetails.expensePaid == 2 ? "Auto Pay" : bankdetails.expensePaid == 1 ?  "Manually" :"N/A"},
    ...(bankdetails?.expensePaid == 1 ? [{"Please specify the mode of payment": bankdetails.paymentMode == 11 ? "Mail" :bankdetails.paymentMode ==12 ? "In person" : bankdetails.paymentMode ==13 ? "Electronically" :"N/A"}]:[]),
    ...(bankdetails?.expensePaid == 2 ? [{ 'Enter the Bank Name': bankdetails?.bankname || 'N/A' },
        { 'Enter the Account Number': bankdetails?.accountnumber || 'N/A' }] : []),]
setviewPdfdata(arrPdfData);
};



const handleNextBtn = ()=> {
  if (activeTab == 1 && isPrimaryMemberMaritalStatus) {
    handleActiveTabButton(2)
} else {
    handleActiveTabButton(2, 2)
}
}


  return (
    <div className='setup-health-insurance pl-2 mt-2 pr-2 pb-2' id='setup-health-insurance'>
      {viewFileInfo && <UploadedFileView refrencePage='HealthInsurance' isOpen={true} fileId={viewFileInfo?.userInsuranceDocs?.[0]?.fileId}  handleViewFileInfo={handleViewFileInfo} fileDetails={{ name: 'Health Insurance' }} itemList={viewPdfdata}  />}

      {!($AHelper.$isNotNullUndefine(activeTableAddType)) ?
        <>
          <Row>
            <div className="d-flex justify-content-between align-items-center">
              <div className="col-auto">
                <span className='heading-of-sub-side-links-2'>View and add/edit your Health insurance here.</span>
              </div>
              {(isPrimaryMemberMaritalStatus) &&
                <div className="d-flex align-items-end justify-content-end" style={{ margin: "-62px 24px 0px" }}>
                  <div className="btn-div addBorderToToggleButton ms-auto" >
                    <button className={`view-btn ${activeTab == "1" ? "active selectedToglleBorder" : ""}`} onClick={() => handleActiveTabButton(1)}>{primaryMemberFirstName && <>{primaryMemberFirstName}</>}</button>
                    {(isPrimaryMemberMaritalStatus) && <button className={`view-btn ${activeTab == "2" ? "active selectedToglleBorder" : ""}`} onClick={() => handleActiveTabButton(2)}>{spouseFirstName && <> {spouseFirstName}</>}</button>}
                  </div>
                </div>
              }
            </div>
          </Row>

          {/*  @@ THIS IS TABLE CONTENT */}


          <div id="information-table" className="mt-4 information-table table-responsive">

            {/* Search and count and add another content */}
            <div className="table-search-section sticky-header-1 d-flex justify-content-between align-items-center">
              <div className="children-header w-50">
                <span>Health Insurance</span>
                <span className="badge ms-1">{tableDataMap?.length} Added</span>
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
              <div className='w-50 d-flex flex-row-reverse'>
                <CustomButton label="Add Health Insurance" onClick={() => handleActiveTableAddType(activeTab)} />
              </div>
            </div>

            {/* Search and count and add another content */}

            <div className='table-responsive fmlyTableScroll'>
              <Table className="custom-table">
                {/* @@ header content */}
                <thead className="sticky-header">
                  <tr>
                    {tableHeader.map((item, index) => (
                      <th key={index} className='customHeadingForTable'><p>{item}</p></th>
                    ))}
                  </tr>
                </thead>

                {/* @@ header content */}

                {console.log("filteredSearchDataDOM",filteredSearchData)}
                {filteredSearchData?.length > 0 ? (
                  <tbody className='table-body-tr'>
                    {filteredSearchData.map((item, index) => {
                      konsole.log("primaryHealthInsuranceDetail-item", item);
                      const { typePlan, suppPlan, insComName, insName, premiumFrePerYear, premiumAmt, insCardPath1 } = item;
                      konsole.log(item,"dataitem")
                      return (
                        <tr key={index}>
                          <td>
                            <OtherInfo key={activeTab} othersCategoryId={31} othersMapNatureId={item?.userInsuranceId} FieldName={item?.typePlan || "-"} userId={primaryUserId} />
                          </td>
                          {/* <td>
                            <OtherInfo key={activeTab} othersCategoryId={30} othersMapNatureId={item?.userInsuranceId} FieldName={item?.suppPlan || "-"} userId={primaryUserId} />
                          </td> */}
                          <td>
                            <OtherInfo key={activeTab} othersCategoryId={35} othersMapNatureId={item?.userInsuranceId} FieldName={item?.insComName || "-"} userId={primaryUserId} />
                          </td>
                          {/* <td><p className='customTDataWidth'>{$AHelper.capitalizeFirstLetterFirstWord(insName) || "-"}</p></td> */}
                          <td>{premiumFrePerYear || "-"}</td>
                          <td>{$AHelper.$isNullUndefine(premiumAmt) ? "-" : $AHelper.$IncludeDollars(premiumAmt)}</td>
                          <td>{insCardPath1 || '-'}</td>
                          <td>
                            <div className="d-flex justify-content-around">
                            {<img src="/New/icons/file-eye-view.svg" alt="view Icon" className="icon cursor-pointer" onClick={() => handleViewFileInfo(item)} />}
                              <img src="/New/icons/edit-Icon.svg" alt="Edit Icon" className="icon cursor-pointer m-2" onClick={() => updateInsurance(item)} />
                              <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer m-2" onClick={() => deleteInsurance(item)} />
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
            
          </div>
          <div className='d-flex justify-content-end'>
            <CustomButton label={`Proceed to ${(isPrimaryMemberMaritalStatus && activeTab == 1) ? spouseFirstName + ' Information' : 'Medication & Supplements'}`} onClick={() => handleNextBtn()} />
          </div>

          {/*  @@ THIS IS TABLE CONTENT */}
        </> : <>

          <HealthInsuranceAddUpdate
            activeTab={activeTab}
            handleActiveTableAddType={handleActiveTableAddType}
            handleActiveTabButton={handleActiveTabButton}
            fetchPrimaryInsurance={fetchPrimaryInsurance}
            fetchSpouseInsurance={fetchSpouseInsurance}
            editInfo={editInfo}
            isHealthInsContent = {isContent}
            type={!$AHelper.$isNotNullUndefine(editInfo) ? 'ADD' : 'EDIT'}
            handlePreviousBtn={handlePreviousBtn}
          />
        </>
      }
    </div>
  );
};

export default HealthInsurance;
