import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Row, Table} from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../Hooks/useRedux';
import usePrimaryUserId from '../../../Hooks/usePrimaryUserId';
import { selectorFinance } from '../../../Redux/Store/selectors';
import { $AHelper } from '../../../Helper/$AHelper';
import { CustomInputSearch } from '../../../Custom/CustomComponent';
import { fetchBusinessIntrestsData,updateBusinessIntrestsList } from '../../../Redux/Reducers/financeSlice';
import { CustomButton } from '../../../Custom/CustomButton';
import konsole from '../../../../components/control/Konsole';
import { getApiCall, isNotValidNullUndefile, postApiCall} from '../../../../components/Reusable/ReusableCom';
import { setHideCustomeSubSideBarState, useLoader } from '../../../utils/utils';
import { globalContext } from '../../../../pages/_app';
import { $Service_Url } from '../../../../components/network/UrlPath';
import AddBusinessIntrests from './AddBusinessIntrests';
import OtherInfo from '../../../../components/asssets/OtherInfo';
import { setHideCustomeSubSideBar } from '../../../Redux/Reducers/uiSlice';
import UploadedFileView from '../../../Common/File/UploadedFileView';



const BusnessIntrestHome = ({type,handleActiveTab}) => {
    
const tableHeader = ['Name of business', 'Business type', 'Start date', 'Estimated market value', 'Federal tax ID no', 'View/Edit/Delete']
    
    const [activeType, setActiveType] = useState('Table');   
    const isBusinessIntrests = type == 'Busness Intrests'; 
    const { primaryUserId, loggedInUserId } = usePrimaryUserId();
    const [updateBusiness, setUpdateBusiness] = useState(false)
    const {newConfirm, setWarning} = useContext(globalContext)
    const dispatch = useAppDispatch();
    const financeData = useAppSelector(selectorFinance);
    const { businessIntrests } = financeData;    
    const [searchValue, setSearchValue] = useState(null);
    const [editInfo, setEditInfo] = useState('')
    const initialState = { nameOfBusiness: '', businessTypeId: '', insStartDate: '', balance: '', ubiNumber: '', federaltaxno: '', businessDescription: '', quesReponse: '', natureId: '', ownershipType: '' };
    const [userDetails, setUserDetails] = useState(initialState);
    const [viewPdfdata, setviewPdfdata] = useState([]);
    const [viewFileInfo, setViewFileInfo] = useState(false);

    // functon for tableMaping
    const tableDataMap = useMemo(() => {
        return businessIntrests;
    }, [dispatch, businessIntrests])

  
     // @@ SEARCHING Based on name of institure
    const filteredSearchData = useMemo(() => {
        let searchQuery = searchValue;
        let data = tableDataMap?.businessInterest;

        if ($AHelper.$isNotNullUndefine(searchQuery)) {
            const searchString = searchQuery.toLowerCase();
            return data.filter(item => {
                return (
                    (item?.nameofBusiness && item?.nameofBusiness?.toLowerCase().includes(searchString))
                );
            });
        } else {
            return data;
        }
    }, [searchValue, tableDataMap, businessIntrests]);

    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(primaryUserId)) {
            fetchData();
        }
         return ()=> setHideCustomeSubSideBarState(false)
    }, [primaryUserId, dispatch])

    // @ fetch businessIntrest Data
    const fetchData = async () => {
        useLoader(true);
        const _resultOf = await dispatch(fetchBusinessIntrestsData({ userId: primaryUserId }));
        konsole.log("_resultOf", _resultOf);
        useLoader(false);
        let businessIntrestsData = []
        if (_resultOf.payload == 'err') {
            businessIntrestsData = []
        } else {
              
            businessIntrestsData = _resultOf.payload
        }
        updateBusnessIntrestDetails('Fetch',businessIntrestsData)
    }
    // functon for update busniness data
    const updateBusnessIntrestDetails = (action,details) => {
        const updateList = updateBusinessIntrestsList;
        if (action === 'Fetch' || action === 'DELETE') {
            dispatch(updateList(details));
        }
    };
     // functon for addnaother
    const handleAddAnother = () => {
        setActiveType('ADDEDIT')
        setHideCustomeSubSideBarState(true)
        setEditInfo('')
        $AHelper.$scroll2Top();
    }
    // functon for go previeus
    const handlePreviousBtn = (type) => {
        setActiveType('Table')
        setEditInfo('')
        setUserDetails(initialState)
        setUpdateBusiness(false)
        setHideCustomeSubSideBarState(false)
        fetchData();
    }
    const updateInformation = (item) => {
        const updatedItem={...item,estimatedMarketValue:$AHelper.$forIncomewithDecimal(item?.estimatedMarketValue)}
        konsole.log("jkhdkjsfhdjskf",updatedItem,item);
        setEditInfo(updatedItem);
        setActiveType('ADDEDIT')
        setHideCustomeSubSideBarState(true)
        setUpdateBusiness(true)
        $AHelper.$scroll2Top();
    }
     
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
      };

    // functon for delete a specif data from table
    const deleteInformation = async (item) => {
        const confirmRes = await newConfirm(true, 'Are you sure you want to delete this information? This action cannot be undone.', "Confirmation", "Delete Business Interest", 2);
        konsole.log("confirmRes", confirmRes);
        if (!confirmRes) return;

        let jsonobj = {
            "userId": primaryUserId,
            "userBusinessInterestId": item?.userBusinessInterestId,
            "deletedBy": loggedInUserId
          }
        konsole.log("jsonobj", jsonobj);
        useLoader(true);
        const _resultOfDelete = await postApiCall('DELETE', $Service_Url.deleteBussinessInterest, jsonobj);
        fetchData();
        toasterAlert("deletedSuccessfully", "Business Interest has been deleted successfully.");
        useLoader(false);
       
    }
    const handleClick=()=>{
        handleActiveTab(18)
    }

    const handleViewFileInfo = (val) => {
        setViewFileInfo(val)
        setviewPdfdata([]);
        fetchDataForPdf(val)
    }
   
    const fetchAddress = async (addressId) => {
      
        const response = await getApiCall('GET',$Service_Url.getAddressByaddressID+addressId,'')
        console.log(response.addressLine1,"responsessssssss")
        if(response == 'err'){
            return '';
        }
        return response?.addressLine1
       
    }
   
    const fetchDataForPdf = async (selectedItem) => {
        if(!selectedItem) return {};

        konsole.log("sdvbkjbjs", selectedItem);

        const bankdetails= isNotValidNullUndefile(selectedItem?.quesReponse) ? JSON?.parse(selectedItem?.quesReponse) : '' ;
        const addressOfCur = await fetchAddress(selectedItem.businessAddressId)
        const otherObj=[{isActive: true, othersMapNatureId: String(selectedItem?.userBusinessInterestId), othersMapNature: '', userId: primaryUserId}]
        const getOtherRes = selectedItem?.businessType == "Other" ? await postApiCall("POST", $Service_Url.getOtherFromAPI, otherObj) : {};
        konsole.log("ViewOtherData", selectedItem, getOtherRes)

        setviewPdfdata([{'Name of Business':selectedItem.nameofBusiness || "N/A"}, 
            {'Business Type': getOtherRes?.data?.data?.[0]?.othersName || selectedItem.businessType || "N/A"},
            {'Start date': $AHelper.$isNotNullUndefine(selectedItem?.dateFunded) ? $AHelper.$getFormattedDate(selectedItem?.dateFunded) :"N/A"},
            {'Estimated market value': $AHelper.$isNullUndefine(selectedItem.estimatedMarketValue) ? "N/A" : $AHelper.IncludeDollars(selectedItem.estimatedMarketValue)},
            {'UBI number':selectedItem.additionalDetails || "N/A"},
            {'Federal tax ID No':selectedItem.taxIDNo || "N/A"},  
            // {'How are the expenses paid?':bankdetails.expensePaid == 2 ? "Auto Pay" : bankdetails.expensePaid == 1 ?  "Manually" :"N/A"},
            // ...(bankdetails?.expensePaid == 1 ? [{"Please specify the mode of payment": bankdetails.paymentMode == 11 ? "Mail" :bankdetails.paymentMode ==12 ? "In person" : bankdetails.paymentMode == 13 ? "Electronically" :"N/A"}]:[]),
            // ...(bankdetails?.expensePaid == 2 ? [{ 'Enter the Bank Name': bankdetails?.bankname || 'N/A' },
            // {'Enter the Account Number': bankdetails?.accountnumber || 'N/A' }] : []),
            {'Business description': <span className="bottom me-3" >{selectedItem.descOfBusiness || "N/A" }</span> },
            {'Address':addressOfCur || "N/A"}, 
            {'Owner(S) & Co-Owner(S)': selectedItem.ownershipType || "N/A"}
        ]);
    }

  return (
    <>
        {(activeType == 'Table') ?
              <>
              {viewFileInfo && <UploadedFileView refrencePage='Business Interests' isOpen={true} fileId={viewFileInfo?.businessInterestDocs[0]?.docFileId} handleViewFileInfo={handleViewFileInfo} fileDetails={{ name: 'Business Interests' }} itemList={viewPdfdata}  />}
              <div style={{borderBottom: '1px solid #F0F0F0'}}></div>
                  <Row className='mt-2 mb-1'>
                      <span className='heading-of-sub-side-links-2 m-0'> {'View and add your business interests here'} </span>
                  </Row>

                  {/* Search and count and add another content */}

                  <div id="information-table" className="mt-2 information-table table-responsive">

                      <div className="table-search-section sticky-header-1 d-flex justify-content-between align-items-center">
                          <div className="children-header w-50">
                              <span>{"Business Interests"} </span>
                              <span className="badge ms-1">{tableDataMap?.businessInterest?.length} Added</span>
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
                              <CustomButton label="Add Business" onClick={() => handleAddAnother()} />
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
                                          <th key={index} className={`${item == 'View/Edit/Delete' ? 'text-start' : ''}`}>{item}</th>
                                      ))}
                                  </tr>
                              </thead>
                              {/* @@ header content */}
                              {filteredSearchData?.length > 0 ? (
                                  <tbody className='table-body-tr'>
                                      {filteredSearchData.map((item, index) => {
                                          const { nameofBusiness, businessType, dateFunded, estimatedMarketValue, taxIDNo,userBusinessInterestId } = item;

                                          return (
                                              <tr key={index}>

                                                  <td>{nameofBusiness || "-"}</td>
                                                  <td>{<OtherInfo othersCategoryId={30} othersMapNatureId={userBusinessInterestId} FieldName={businessType} userId={primaryUserId} />}</td>
                                                
                                                  <td>{$AHelper.$getFormattedDate(dateFunded) == "Invalid date" ? "-" : $AHelper.$getFormattedDate(dateFunded)}</td>
                                                  <td>{$AHelper.$isNotNullUndefine(estimatedMarketValue) ? $AHelper.$IncludeDollars(estimatedMarketValue) : "-"}</td>
                                                  <td>{taxIDNo || "-"}</td>
                                                  <td>
                                                      <div className="d-flex justify-content-start gap-4">
                                                        {<img src="/New/icons/file-eye-view.svg" alt="view Icon" className="icon cursor-pointer" onClick={() => handleViewFileInfo(item)} />}
                                                          <img src="/New/icons/edit-Icon.svg" alt="Edit Icon" className="icon cursor-pointer" onClick={() => updateInformation(item)} />
                                                          <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer" onClick={() => deleteInformation(item)} />
                                                      </div>
                                                  </td>
                                                  {/* {viewFileInfo && <UploadedFileView refrencePage='Business Interests' isOpen={true} fileId={viewFileInfo?.businessInterestDocs[0]?.docFileId} handleViewFileInfo={handleViewFileInfo} fileDetails={{ name: 'Business Interests' }} itemList={viewPdfdata}  />} */}
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
                  <CustomButton onClick={() => handleClick()} label={"Proceed to Transport Assets"} />
                  </div>
                  {/* <div className='d-flex justify-content-end mt-2 mb-2'>
                      <CustomButton onClick={handleClick}
                        //   label={"Next: Long-term Care Insurance Policy"} />
                          label={"Next: Transportation"} />
                  </div> */}

                  {/* Search and count and add another content */}
              </> : <>

                  {/* @@Add AddBusinessIntrests */}
                  <>
                      <AddBusinessIntrests
                          handlePreviousBtn={handlePreviousBtn}
                          actionType={$AHelper.$isNotNullUndefine(editInfo) ? "EDIT" : "ADD"}
                          isBusinessIntrests={isBusinessIntrests}
                          activeType={`${activeType}`}
                          fetchData={fetchData}
                          handleClick={handleClick}
                          setUpdateBusiness={setUpdateBusiness}
                          updateBusiness={updateBusiness}
                          editInfo={editInfo}
                          userDetails={userDetails}
                          setUserDetails={setUserDetails}
                          setEditInfo={setEditInfo}
                          initialState={initialState}
                      />
                  </>
              </>
            }
    </>
  )
}

export default BusnessIntrestHome