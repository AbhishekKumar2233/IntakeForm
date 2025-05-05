
import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Row, Table} from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { selectorFinance } from '../../Redux/Store/selectors';
import { $AHelper } from '../../Helper/$AHelper';
import { getApiCall, isNotValidNullUndefile } from '../../../components/Reusable/ReusableCom';
import { CustomInputSearch } from '../../Custom/CustomComponent';
import { fetchLiabilitiesData,updateLiabilitiesList } from '../../Redux/Reducers/financeSlice';
import { CustomButton } from '../../Custom/CustomButton';
import { postApiCall} from '../../../components/Reusable/ReusableCom';
import { setHideCustomeSubSideBarState, useLoader } from '../../utils/utils';
import { globalContext } from '../../../pages/_app';
import { $Service_Url } from '../../../components/network/UrlPath';
import AddLiabilitys from './AddLiabilitys';
import EditLiabilities from './EditLiabilities';
import OtherInfo from '../../../components/asssets/OtherInfo';
import konsole from '../../../components/control/Konsole';
import UploadedFileView from '../../Common/File/UploadedFileView';
import { $ApiHelper } from '../../Helper/$ApiHelper';
import { $JsonHelper } from '../../Helper/$JsonHelper';


const LiblitiesHome = ({handleNextTab}) => {
    
const tableHeader = ['Type of liability', 'Name of lender', 'Pay off date', 'Outstanding balance', 'Monthly amount', 'View/Edit/Delete']

    const [liablitiesData, setliablitiesData] = useState($JsonHelper.createLiablitiesData)    
    const [activeType, setActiveType] = useState('Table');   
    const [leaseNRealEstatelist, setLeaseNRealEstateList] = useState([])
    const [leaseNRealEstaeliabilitiesId, setLeaseNRealEstaeliabilitiesId] = useState()
    const { primaryUserId, loggedInUserId } = usePrimaryUserId();
    const {newConfirm, setWarning} = useContext(globalContext)
    const dispatch = useAppDispatch();
    const financeData = useAppSelector(selectorFinance);
    const { liabilitiesData } = financeData;    
    const [searchValue, setSearchValue] = useState(null);
    const [editInfo, setEditInfo] = useState()
    const [viewPdfdata, setviewPdfdata] = useState([]);
    const [viewFileInfo, setViewFileInfo] = useState(false)
   
    useEffect(()=>{
        if(isNotValidNullUndefile(primaryUserId)) {
        useLoader(true)
        dispatch(fetchLiabilitiesData({ userId: primaryUserId }))
        useLoader(false)
        }
    },[primaryUserId])

    // useEffect(() => {
    //     if(isNotValidNullUndefile(viewFileInfo)) {
    //         fetchDataForPdf(viewFileInfo);
    //     }
    // }, [viewFileInfo])
  
     // @@ SEARCHING Based on name of institure
    const filteredSearchData = useMemo(() => {
        let searchQuery = searchValue;
        let data = liabilitiesData?.liability;

        if ($AHelper.$isNotNullUndefine(searchQuery)) {
            const searchString = searchQuery.toLowerCase();
            return data?.filter(item => {
                return (
                    (item?.liabilityType && item?.liabilityType?.toLowerCase().includes(searchString))
                );
            });
        } else {
            return data;
        }
    }, [searchValue, liabilitiesData]);

    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(primaryUserId) && liabilitiesData?.length == 0) {
            fetchData();
        }
        return ()=>setHideCustomeSubSideBarState(false)
    }, [primaryUserId, dispatch])

    // @ fetch businessIntrest Data
    const fetchData = async () => {
        useLoader(true);
        const _resultOf = await dispatch(fetchLiabilitiesData({ userId: primaryUserId }));
        useLoader(false);
        let liblitiesData = []
        if (_resultOf.payload == 'err') {
            liblitiesData = []
        } else {              
            liblitiesData = _resultOf.payload
        }
        updateLiabilitiesDetails('Fetch',liblitiesData)
    }
    // functon for update busniness data
    const updateLiabilitiesDetails = (action,details) => {
        const updateList = updateLiabilitiesList;
        if (action === 'Fetch' || action === 'DELETE') {
            dispatch(updateList(details));
        }
    };
     // functon for addnaother
    const handleAddAnother = () => {
        setActiveType('ADDEDIT')
        setHideCustomeSubSideBarState(true)
        setEditInfo('')
        setliablitiesData('')
        $AHelper.$scroll2Top();
    }
    // functon for go previeus
    const handlePreviousBtn = (type) => {
        setActiveType('Table')
        setEditInfo('')
        setHideCustomeSubSideBarState(false)
        fetchData();
    }
    const updateInformation = (editInfo) => {

        let item={...editInfo ,
            paymentAmount:$AHelper.$forIncomewithDecimal(editInfo?.paymentAmount, null),
            outstandingBalance:$AHelper.$forIncomewithDecimal(editInfo?.outstandingBalance, null),
            debtAmount:$AHelper.$forIncomewithDecimal(editInfo?.debtAmount, null)
        };
        konsole.log('asjdhfjk', item);

        const prev = $JsonHelper.createLiablitiesData;
        setEditInfo(item);
        setliablitiesData({
            "liabilityTypeId": item.liabilityTypeId || prev.liabilityTypeId,
            "nameofInstitutionOrLender": item.nameofInstitutionOrLender || prev.nameofInstitutionOrLender,
            "payOffDate": item.payOffDate || prev.payOffDate,
            "endDateLiability": item.endDateLiability || prev.endDateLiability,
            "outstandingBalance": item.outstandingBalance || prev.outstandingBalance,
            "paymentAmount": item.paymentAmount || prev.paymentAmount,
            "liabilityId": item.liabilityId || prev.liabilityId,
            "userRealPropertyId":item.userRealPropertyId || prev.userRealPropertyId,
            "natureId":item.userLiabilityId || prev.natureId
          });
          fetchLiabilityId(item.liabilityTypeId ) 
         setHideCustomeSubSideBarState(true)
        //  konsole.log("liabilityId",item)
        // setliablitiesData(prev => ({ ...prev, [name]: value }));
        $AHelper.$scroll2Top();
    }
     
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
      };
      const fetchLiabilityId = async (liabilitiID) => {
        const result = await getApiCall('GET', $Service_Url.getLiabilities + liabilitiID, setLeaseNRealEstateList)
    }

    // functon for delete a specif data from table
    const deleteInformation = async (item) => {
        const confirmRes = await newConfirm(true, 'Are you sure you want to delete this information? This action cannot be undone.', "Confirmation", "Delete Liabilities", 2);
        if (!confirmRes) return;
        useLoader(true);
        const _resultOfDelete = await postApiCall('DELETE', $Service_Url.deleteUserLiability + `?UserId=${primaryUserId}&UserLiabilityId=${item?.userLiabilityId}&DeletedBy=${loggedInUserId}`, '');
        fetchData();
        toasterAlert("deletedSuccessfully", "Liabilities has been deleted successfully.");
        useLoader(false);
       
    }
    const handleClick =()=>{
        handleNextTab()
    }   
   
    const handleViewFileInfo = async (val) => {
        setViewFileInfo(val)
        setviewPdfdata([]);
        fetchDataForPdf(val);
        
    }
        
    const fetchDataForPdf =  async (item) => {  
        const addressLine1 = await $ApiHelper.$getAddressByUserId(item?.lenderUserId);
        const contactDetails = await $ApiHelper.$getContactByUserId(item?.lenderUserId);

        konsole.log(item,"itemDataaa")
            setviewPdfdata ([{'Type of Liabilities':  item.liabilityType || "N/A"}, 
                {'Sub-types of liabilities':  item.liabilityName || "N/A"}, 
                {'Name of Lender':  item.nameofInstitutionOrLender || "N/A"},
                (item?.liabilityId == "1" || item?.liabilityId == "2" || item?.liabilityTypeId == "1") 
                ? {'Mortgage end date': $AHelper.$isNullUndefine(item.payOffDate) ? "N/A" : $AHelper.$getFormattedDate(item.payOffDate)} : 
                {'Pay off date': $AHelper.$isNullUndefine(item.payOffDate) ? "N/A" : $AHelper.$getFormattedDate(item.payOffDate)},
                {'Monthly amount': $AHelper.$isNullUndefine(item.paymentAmount) ? "N/A" : $AHelper.IncludeDollars(item.paymentAmount)}, 
                {'Outstanding Balance': $AHelper.$isNullUndefine(item.outstandingBalance) ? "N/A" :  $AHelper.IncludeDollars(item.outstandingBalance)},
                {'Address of lender': addressLine1 || "N/A"},
                {"Lender Phone number": contactDetails?.mobileNo || "N/A"},
            ]);
    }

  return (
    <>  

       {$AHelper.$isNotNullUndefine(editInfo) ? <EditLiabilities handleActionType={handlePreviousBtn} setHideCustomeSubSideBarState={setHideCustomeSubSideBarState} liablitiesData={liablitiesData} setliablitiesData={setliablitiesData} setEditInfo={setEditInfo} editInfo={editInfo} fetchData={fetchData} leaseNRealEstatelist={leaseNRealEstatelist} handleNextTab={handleNextTab}/>  : 
       <>
        {(activeType == 'Table') ?
              <>

              {viewFileInfo && <UploadedFileView refrencePage='Liabilities' isOpen={true} handleViewFileInfo={handleViewFileInfo} fileDetails={{ name: 'Liabilities' }} itemList={viewPdfdata}  />}

                  {/* Search and count and add another content */}

                  <div style={{borderBottom: '1px solid #F0F0F0'}}></div>
                    <Row className='mt-2'>
                        <span className='heading-of-sub-side-links-2'>(Mortgages, Car/Automobile Loan, Students Loan, Personal Loan, Credit Cards, Etc.) </span>
                    </Row>

                  <div id="information-table" className="mt-2 information-table table-responsive">

                      <div className="table-search-section sticky-header-1 d-flex justify-content-between align-items-center">
                          <div className="children-header w-50">
                              <span>{"Liabilities"} </span>
                              <span className="badge ms-1">{liabilitiesData?.liability?.length} Added</span>
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
                              <CustomButton label="Add Liability" onClick={() => handleAddAnother()} />
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
                                      {filteredSearchData?.map((item, index) => {
                                          const { liabilityType, nameofInstitutionOrLender, payOffDate, outstandingBalance, paymentAmount,liabilityTypeId,userLiabilityId } = item;
                                          konsole.log(item,"dataliabilty")
                                       
                                          return (
                                              <tr key={index}>
                                                  <td>{<OtherInfo othersCategoryId={15} othersMapNatureId={userLiabilityId} FieldName={liabilityType} userId={primaryUserId} />}</td>
                                                  <td>{nameofInstitutionOrLender || "-"}</td>
                                                  <td style={{whiteSpace:"nowrap"}}>{$AHelper.$getFormattedDate(payOffDate) == "Invalid date" ? "-" : $AHelper.$getFormattedDate(payOffDate)}</td>
                                                  <td>{$AHelper.$isNullUndefine(outstandingBalance) ? "-" : $AHelper.$IncludeDollars(outstandingBalance)}</td>
                                                  <td>{$AHelper.$isNotNullUndefine(paymentAmount) ? $AHelper.$IncludeDollars(paymentAmount) : "-"}</td>
                                                  
                                                  <td>
                                                      <div className="d-flex justify-content-start gap-4">
                                                      {<img src="/New/icons/file-eye-view.svg" alt="view Icon" className="icon cursor-pointer" onClick={() => handleViewFileInfo(item)} />}
                                                          <img src="/New/icons/edit-Icon.svg" alt="Edit Icon" className="icon cursor-pointer" onClick={() => updateInformation(item)} />
                                                          <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer" onClick={() => deleteInformation(item)} />
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
                  <div className='d-flex justify-content-end mt-4 mb-2'>
                      <CustomButton onClick={handleClick} label={"Proceed to Income"} /> 
                  </div>

                  {/* Search and count and add another content */}
              </> : <>
                  {/* @@Add AddBusinessIntrests */}
                  <>
                  {/* <AddLiabilitys handleActionType={handlePreviousBtn} liablitiesData={liablitiesData} setliablitiesData={setliablitiesData}/> */}
                  <EditLiabilities handleActionType={handlePreviousBtn} liablitiesData={liablitiesData} setliablitiesData={setliablitiesData} handleNextTab={handleNextTab} handleAddAnother = {handleAddAnother}/>
                  </>
              </>
            }
       
       </>
       }
       

         
    </>
  )
}

export default LiblitiesHome