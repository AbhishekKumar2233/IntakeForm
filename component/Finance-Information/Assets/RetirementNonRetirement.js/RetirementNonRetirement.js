import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Row, Table, Col, Tab } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../Hooks/useRedux';
import usePrimaryUserId from '../../../Hooks/usePrimaryUserId';
import { selectorFinance } from '../../../Redux/Store/selectors';
import { $AHelper } from '../../../Helper/$AHelper';
import { CustomInputSearch } from '../../../Custom/CustomComponent';
import { fetchRetirementNonRetirementData, updateNonRetirementAssestsList, updateRetirementAssetsList, fetchXmlGenerater} from '../../../Redux/Reducers/financeSlice';
import { CustomButton } from '../../../Custom/CustomButton';
import konsole from '../../../../components/control/Konsole';
import OtherInfo from '../../../../components/asssets/OtherInfo';
import { getApiCall, postApiCall, removeDuplicate } from '../../../../components/Reusable/ReusableCom';
import { setHideCustomeSubSideBarState, useLoader } from '../../../utils/utils';
import AddRetirementNonRetirement from './AddRetirementNonRetirement';
import { globalContext } from '../../../../pages/_app';
import { $Service_Url } from '../../../../components/network/UrlPath';
import TableEditDeleteDecease from '../../../Common/DeceasedSpecialNeed/TableEditDeleteDecease';
import useUserIdHook from '../../../../components/Reusable/useUserIdHook';
import { $getServiceFn } from "../../../../components/network/Service";
import AiModal from "./AiModal"


export const contentData = {
    nonRetire: {
      description: `Provide details about your non-retirement assets, such as checking accounts, savings, investments, and other financial holdings. This information helps us assess your overall financial portfolio outside of retirement accounts, allowing us to understand your asset allocation and guide you appropriately in managing your wealth and planning for financial security throughout your aging journey.`,
      institutionInfo: `Enter the Institution information to maintain accurate records of your Asset location.`,
      documentation: `Upload any relevant documents related to your non-retirement assets. Providing these documents ensures that all necessary information is available for a comprehensive review of your coverage and supports accurate alignment with your non-retirement planning goals.`
    },
    retire: {
      description: `Please provide details about your retirement assets. This helps us evaluate your financial readiness, allowing us to understand your retirement portfolio and guide you appropriately in planning for a secure and sustainable retirement while protecting you from unplanned healthcare costs.`,
      documentation: `Upload any relevant documents related to your retirement assets. Providing these documents ensures that all necessary information is available for a comprehensive review of your coverage and supports accurate alignment with your retirement planning goals.`
    }
  };
  
const RetirementNonRetirement = ({ type, handleActiveTab}) => {
    const isRetirement = type == 'Retirement';
    const { primaryUserId, loggedInUserId } = usePrimaryUserId();
    const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
    const dispatch = useAppDispatch();
    const financeData = useAppSelector(selectorFinance);
    const { nonRetirementAssetsList, retirementAssetsList } = financeData;
    // state define
    const [searchValue, setSearchValue] = useState(null);
    const [activeType, setActiveType] = useState('Table');
    const [editInfo, setEditInfo] = useState('')
    const [memberUserID, setmemberUserID] = useState('')
    const tableHeader = [type == 'Retirement' ? 'Type of Retirement Asset' : 'Type of Assest','Name of Institution', 'Balance', 'Owner', 'Beneficiary/Charity', 'View/Edit/Delete']
    //State for Generate Document
    const [showAiDoc, setShowAiDoc] = useState(false)
    const [aiDocuments, setAiDocuments] = useState()
    const [stopLoader, setStopLoader] = useState(false)
    const {_primaryMemberUserId} = useUserIdHook();
    const [beneficiaryList,setBeneficiarylist] = useState([])
    

    useEffect(() => {
        fetchBeneficiarydata();
        if ($AHelper.$isNotNullUndefine(primaryUserId) && retirementAssetsList?.length == 0 && nonRetirementAssetsList.length == 0) {
            fetchData();
        }
        return () => setHideCustomeSubSideBarState(false)
    }, [primaryUserId, dispatch])
    
    const fetchBeneficiarydata = async () => {
        const _resultBeneficiary = await getApiCall('GET',$Service_Url?.getBeneficiaryDetailsByUserId+primaryUserId)
        if(_resultBeneficiary != 'err'){
            setBeneficiarylist(_resultBeneficiary?.beneficiaries)
        }else{
            setBeneficiarylist([])
        }
    }


    const fetchData = async () => {
        useLoader(true);
        const _resultOf = await dispatch(fetchRetirementNonRetirementData({ userId: primaryUserId }));
        konsole.log("_resultOf", _resultOf);
        useLoader(false);
        let retirementData = []
        let nonRetirementData = []
        if (_resultOf.payload == 'err') {
            retirementData = []
            nonRetirementData = []
        } else {
            nonRetirementData = _resultOf.payload?.filter((v, j) => v.agingAssetCatId == "1")?.filter((v)=> v.assetBeneficiarys?.filter((e)=> e.beneficiaryUserId != ''));
            retirementData = _resultOf.payload?.filter((v, j) => v.agingAssetCatId == "2");
        }

        updateRetirementNonRetirementDetails('Fetch', 1, retirementData)
        updateRetirementNonRetirementDetails('Fetch', 2, nonRetirementData)
    }

    const updateRetirementNonRetirementDetails = (action, type, details) => {
        const updateList = type == 1 ? updateRetirementAssetsList : updateNonRetirementAssestsList;
        const assetList = (type == 1 ? retirementAssetsList : nonRetirementAssetsList) || [];

        if (action === 'Fetch' || action === 'DELETE') {
            dispatch(updateList(details));
        } else if (action === 'ADD') {
            let updatedValue = [...assetList, details];
            dispatch(updateList(updatedValue));
        } else if (action == 'EDIT') {
            let updatedValue = assetList?.map((item) =>
                item.userAgingAssetId === details.userAgingAssetId ? details : item
            );
            dispatch(updateList(updatedValue));
        }
    };




    const tableDataMap = useMemo(() => {
        return isRetirement ? retirementAssetsList : nonRetirementAssetsList;
    }, [dispatch, isRetirement, nonRetirementAssetsList, retirementAssetsList])


    // @@ SEARCHING Based on name of institure
    const filteredSearchData = useMemo(() => {
        let searchQuery = searchValue;
        let data = tableDataMap;

        if ($AHelper.$isNotNullUndefine(searchQuery)) {
            const searchString = searchQuery.toLowerCase();
            return data.filter(item => {
                return (
                    (item?.nameOfInstitution?.toLowerCase().includes(searchString)) || (item?.assetTypeName?.toLowerCase().includes(searchString))
                );
            });
        } else {
            return data;
        }
    }, [searchValue, tableDataMap, nonRetirementAssetsList, retirementAssetsList]);



    // @@ handle Add Another

    const handleAddAnother = () => {
        setActiveType('ADDEDIT')
        setEditInfo('')
        setHideCustomeSubSideBarState(true)
        $AHelper.$scroll2Top();
    }
    // 
    const handlePreviousBtn = (type) => {
        setActiveType('Table')
        setHideCustomeSubSideBarState(false)
        setEditInfo('')
        if (type == 'next') {
            handleActiveTab(isRetirement ? 13 : 12)
        }

    }


    // @@ delete information

    const deleteInformation = async (item) => {
        konsole.log("deleteInformation", item);
        const confirmRes = await newConfirm(true, 'Are you sure you want to delete this information? This action cannot be undone.', "Confirmation", `${type == 'Retirement' ? "Delete Retirement" : "Delete Non-Retirement"}`, 2);
        konsole.log("confirmRes", confirmRes);
        if (!confirmRes) return;

        let jsonobj = {
            userId: primaryUserId,
            asset: {
                agingAssetCatId: item.agingAssetCatId,
                agingAssetTypeId: item.agingAssetTypeId,
                ownerTypeId: item.ownerTypeId,
                maturityYear: item.maturityYear,
                userAgingAssetId: item.userAgingAssetId,
                updatedBy: loggedInUserId,
                nameOfInstitution: item?.nameOfInstitution,
                isActive: false,
                assetDocuments: [],
                assetOwners: item.assetOwners,
                assetBeneficiarys: [],
                isRealPropertys: [],
            },
        };
        konsole.log("jsonobj", jsonobj);
        useLoader(true);
        const _resultOfDelete = await postApiCall('PUT', $Service_Url.putUpdateUserAgingAsset, jsonobj);
        useLoader(false);
        konsole.log("_resultOfDelete", _resultOfDelete);
        if (_resultOfDelete != 'err') {
            const filterAssetsDetails = (details) => details.filter(i => i.userAgingAssetId !== item.userAgingAssetId);
            if (isRetirement == true) {
                updateRetirementNonRetirementDetails('DELETE', 1, filterAssetsDetails(retirementAssetsList))
            } else if (isRetirement == false) {
                updateRetirementNonRetirementDetails('DELETE', 2, filterAssetsDetails(nonRetirementAssetsList))
            }
            toasterAlert("deletedSuccessfully", `${type == 'Retirement' ? "Retirement" : "Non-Retirement"} has been deleted successfully.`);
        }
    }

    // @@ update Information
    const updateInformation = (item) => {
        setmemberUserID(item?.institutionUserId)
        let updateInput={...item,balance:$AHelper.$forIncomewithDecimal(item.balance)}
        setEditInfo(updateInput);
        setActiveType('ADDEDIT')
        setHideCustomeSubSideBarState(true)
        $AHelper.$scroll2Top()
        konsole.log(updateInput, item, "updateInputupdateInput")
    }

    // @@ toaster
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }

    // @@ konsole
    konsole.log("financeData", financeData);
    konsole.log("nonRetirementAssetsListretirementAssetsList ", nonRetirementAssetsList, retirementAssetsList)
    // @@ konsole

    const getDocumentDetails =(data)=>{
        return new Promise((resolve, reject) => {
          $getServiceFn.getLegalDocForAsset(data, (res, err) => {
            if (res) {            
                const response = res?.data;
                resolve(response)
            }
            else {
              resolve('err')
            }
          })      
        })
      }

      const getDocument =(data,version)=>{
        return new Promise((resolve, reject) => {
          const json ={"userName":data,"version":version}
          $getServiceFn.postGenrateDoc(json, (res, err) => {
            if (res) {            
                const response = res?.data;
                resolve(response)
            }
            else {
              resolve('err')
            }
          })      
        })
      }

      const getDocumentVersion =(data)=>{
        return new Promise((resolve, reject) => {
          $getServiceFn.getDocumentVersion(data, (res, err) => {
            if (res) {            
                const response = res?.data;
                resolve(response)
            }
            else {
              resolve('err')
            }
          })      
        })
    }

    
    let attempts = 0; // Counter to track consecutive empty responses
    let intervalId = null
    const funToGenerateDoc=async()=>{
        useLoader(true);
        let _resultOf = await dispatch(fetchXmlGenerater({ userId: _primaryMemberUserId }));
        let contresultOfUserAgents= JSON.parse(JSON.stringify(_resultOf.payload.data))
        let newcontresultOfUserAgents=contresultOfUserAgents?.userAgingAsset?.map((data1)=>{
            const retirementData=filteredSearchData.some((data2)=>data1.userAgingAssetId==data2.userAgingAssetId)
            return {...data1,"generateBeneficiaryLetter":retirementData}
        })
        contresultOfUserAgents={...contresultOfUserAgents,"userAgingAsset":newcontresultOfUserAgents}
        // console.log("contresultOfUserAgents",contresultOfUserAgents)
         useLoader(false);
        const jsonString = JSON.stringify( contresultOfUserAgents, null, 2);
        // console.log("jsonString",jsonString)
        const blob = new Blob([jsonString], { type: 'application/json' });
        // console.log("blobjsonString",blob)
        const file = new File([blob], `UserMember_${_primaryMemberUserId}_Details.json`, { type: 'application/json' });
        // console.log("filejsonString",file,"typrof",typeof file,"length",file.name)
        const formData = new FormData();
        formData.append('input_file', file);
        // console.log("formData:", formData);
        const getDocumentData =  await getDocumentDetails(formData)       
        // console.log("getDocumentData",getDocumentData)
        if(getDocumentData.message!="Document processing started"){
                toasterAlert("deletedSuccessfully", `Error while generating Ai document, Please try after sometime`);
                return;
        }
        const document_directory_name=getDocumentData?.directory_name
        // const getDocumentData =  await getDocumentDetails(formdata)
        const getDocumentVersionData = await getDocumentVersion(document_directory_name)
        const latestDocument = getDocumentVersionData?.reduce((latestDoc, currentDoc) => {
        return new Date(currentDoc.timestamp) > new Date(getDocumentVersionData?.timestamp)
            ? currentDoc
            : latestDoc;
        });
        intervalId = setInterval(async () => {
                await checkAndFetchDocuments(document_directory_name,latestDocument?.file_name);
        }, 5000);
    }

       
    const checkAndFetchDocuments = async (getDocumentData,version) => {
        useLoader(false)
        const updatedDocumentStatus = await getDocument(getDocumentData,version);
        setStopLoader(true)
        if(updatedDocumentStatus == 'err'){
          clearInterval(intervalId); // Stop the interval
          setStopLoader(false)
        }
        setAiDocuments(updatedDocumentStatus)
        setShowAiDoc(true)
        if (updatedDocumentStatus?.in_progress_documents?.length === 0) {
            attempts += 1; // Increment the counter if no documents are in progress
    
            if (attempts >= 2) {
                setStopLoader(false)
                clearInterval(intervalId); // Stop the interval
            } else {
                // Log and wait for the next interval to check again
                // console.log("No documents in progress, will check again...");
            }
        } else {
            // Reset counter if documents are in progress
            attempts = 0;
            // console.log("Documents found in progress:", updatedDocumentStatus.in_progress_documents);
        }
      };

    return (
        <>
            {/* <AiModal showAiDoc={showAiDoc} setShowAiDoc={setShowAiDoc} aiDocuments={aiDocuments} setAiDocuments={setAiDocuments} stopLoader={stopLoader}/> */}
            {(activeType == 'Table') ?
                <>
                <div style={{borderBottom: '1px solid #F0F0F0'}}></div>
                    <Row className='mt-2'>
                        <span className='heading-of-sub-side-links-2 mt-2 mb-3'> {isRetirement ? '(IRAs, 401(k)s, 403(b)s, Etc.)' : '(Bank Accounts, CDs, Money Market Funds, Stocks, Bonds, Etc.)'} </span>
                    </Row>

                    {/* Search and count and add another content */}

                    <div id="information-table" className="information-table table-responsive mt-0">
                        <div className="table-search-section sticky-header-1 d-flex justify-content-between align-items-center">
                            <div className="children-header w-50">
                                <span>{isRetirement ? 'Retirement Assets' : "Non-Retirement Assets"} </span>
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
                            <div className='w-25 d-flex flex-row-reverse'>
                                <CustomButton label="Add Asset" onClick={() => handleAddAnother()} />
                            </div>
                        </div>

                        {/* Search and count and add another content */}
                        {/* TABLE */}
                        <div className='table-responsive fmlyTableScroll mt-0'>
                            <Table className="custom-table">
                                {/* @@ header content */}
                                <thead className="sticky-header">
                                    <tr>
                                        {tableHeader.map((item, index) => (
                                            <th key={index} className={`${item == 'View/Edit/Delete' ? 'text-end' : ''}`} >{item}</th>
                                        ))}
                                    </tr>
                                </thead>
                                {/* @@ header content */}
                                {filteredSearchData?.length > 0 ? (
                                    <tbody className='table-body-tr'>
                                        {filteredSearchData.map((item, index) => {
                                            const { userAgingAssetId, assetTypeName, nameOfInstitution, balance, assetOwners, assetBeneficiarys } = item;
                                            {/* konsole.log(item,"itemitemitem") */}
                                            //    assetBeneficiarys = assetBeneficiarys?.length > 0 && assetBeneficiarys?.filter((ele)=> ele?.isCharity == false ? beneficiaryList?.length > 0 && beneficiaryList?.some((benf)=> benf.beneficiaryUserId == ele.beneficiaryUserId) : ele)
                                            const assetOwnersVal = removeDuplicate(assetOwners, 'ownerUserId');
                                            // console.log(assetBeneficiarys,"assetBeneficiaryslist",beneficiaryList)
                                            return (
                                                <tr key={index}>

                                                    <td>
                                                        <OtherInfo key={index} othersCategoryId={3} othersMapNatureId={userAgingAssetId} FieldName={assetTypeName || "-"} userId={primaryUserId} />
                                                    </td>
                                                    <td>{nameOfInstitution || "-"}</td>
                                                    <td>{$AHelper.$isNullUndefine(balance) ? "-" : $AHelper.$IncludeDollars(balance)}</td>
                                                    <td >{$AHelper.capitalizeFirstLetterFirstWord((assetOwnersVal.length == 2) ? "Joint" : (assetOwnersVal.length == 1) ? assetOwnersVal[0].ownerUserName : "-")}</td>
                                                    <td>{$AHelper.capitalizeFirstLetterFirstWord((assetBeneficiarys?.length > 0) ? assetBeneficiarys?.map((e)=>" "+e?.beneficiaryUserName)?.toString() : "-")}</td>

                                                    <td>
                                                        <TableEditDeleteDecease
                                                            item={item}
                                                            handleUpdate={updateInformation}
                                                            handleDelete={deleteInformation}
                                                            refrencePage={isRetirement ? 'Retirement' : 'Non-Retirement'}
                                                            loggedInUserId={loggedInUserId}
                                                            actionType='Beneficiary'
                                                            isOwner={(assetOwnersVal?.length == 2 || assetOwnersVal?.length?.length == 0) ? false : true}
                                                            ownerUserId={assetOwnersVal.length > 0 ? assetOwnersVal[0].ownerUserId : ""}
                                                            userId={primaryUserId}
                                                            memberUserId={assetBeneficiarys.length > 0 ? assetBeneficiarys[0].beneficiaryUserId : ''}
                                                        />
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
                    {/* {filteredSearchData?.length > 0 && <section style={{marginRight:"10px"}}>
                        <CustomButton label={`Generate Beneficiary Letter`} onClick={() => funToGenerateDoc()} />
                    </section>} */}
                    <CustomButton label={`Proceed to ${isRetirement == false ? 'Retirement' : 'Real Estate'}`} onClick={() => handlePreviousBtn('next')} />
                    </div>

                    {/* Search and count and add another content */}
                </> : <>

                    {/* @@Add RetirementNonRetirement */}
                    <AddRetirementNonRetirement
                        startTabIndex={1}
                        handlePreviousBtn={handlePreviousBtn}
                        actionType={$AHelper.$isNotNullUndefine(editInfo) ? "EDIT" : "ADD"}
                        isRetirement={isRetirement}
                        activeType={`${activeType}`}
                        fetchData={fetchData}
                        updateRetirementNonRetirementDetails={updateRetirementNonRetirementDetails}
                        editInfo={editInfo}
                        contentData={contentData}
                        memberUserID={memberUserID}
                        setEditInfo={setEditInfo}
                    />
                    {/* @@Add RetirementNonRetirement */}
                </>
            }


        </>
    )
}

export default RetirementNonRetirement
