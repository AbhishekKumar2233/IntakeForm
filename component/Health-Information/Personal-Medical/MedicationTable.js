import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import { CustomButton } from "../../Custom/CustomButton";
import { CustomInputSearch } from "../../Custom/CustomComponent";
import { useAppDispatch, useAppSelector } from "../../Hooks/useRedux";
import { selectHideCustomeSubSideBar, selectorHealth } from "../../Redux/Store/selectors";
import { fetchBloodtype, fetchmedication, fetchUsermedication } from "../../Redux/Reducers/healthISlice";
import { $AHelper } from "../../Helper/$AHelper";
import { useSelector } from "react-redux";
import AddEditMedication from "./AddEditMedications";
import { cleanMedicationNsuplement,healthMedicationPageType, setHideCustomeSubSideBarState } from "../../utils/utils";
import { setLoader } from "../../Redux/Reducers/uiSlice";
import { isNotValidNullUndefile, postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import OtherInfo from "../../../components/asssets/OtherInfo";
import { $JsonHelper } from "../../Helper/$JsonHelper";
import { globalContext } from "../../../pages/_app";
import konsole from "../../../components/control/Konsole";
import UploadedFileView from "../../Common/File/UploadedFileView";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";
import { $dashboardLinks } from "../../Helper/Constant";



// const newFormDataObj = () => { return { userMedicationId: 0, medicationId: null, doseAmount: '', frequency: '', time: '', startDate: '', endDate: '', doctorPrescription: '',isActive:true } }

const MedicationTable = ({ userId, setHideAllAccrodian, isAdded, editUser, setEdituser, medicationAndSupplementsPlaceholder, submitForm, activeBtn, setActiveBtn, handleActiveTabMain, setShowTable }) => {
    const healthApiData = useAppSelector(selectorHealth);
    const { userMedicationListPrimary, userMedicationListSpouse, medicationList } = healthApiData;
    const dispatch = useAppDispatch()
    const [searchValue, setSearchValue] = useState(null)
    const [isAddedit, setIsAddedit] = useState(isAdded == true ? true : false);
    const [viewPdfdata, setviewPdfdata] = useState([]);
    const [viewFileInfo, setViewFileInfo] = useState(false)
    const { primaryUserId , spouseUserId} = usePrimaryUserId();
    const userMedicationList = userId == primaryUserId ? userMedicationListPrimary : userMedicationListSpouse;
    const { spouseFullName, isPrimaryMemberMaritalStatus, spouseFirstName , primaryMemberFirstName} = usePrimaryUserId();
    // const [editUser,setEdituser] = useState({...$JsonHelper.newFormDataObj()})
    const tableHeader = [{ id: 1, name: "Medication" }, { id: 2, name: "Dosage" }, { id: 3, name: "Frequency" }, { id: 4, name: "Timing" }, { id: 5, name: "Note" }, { id: 6, name: "View/Edit/Delete" }];

    const { newConfirm, setWarning } = useContext(globalContext)
    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(userId)) {
            fetchApi(userId)
            setSearchValue("");
        }
    }, [userId, isAddedit])

    useEffect(() => {
        if(isNotValidNullUndefile(viewFileInfo)) {
            fetchDataForPdf(viewFileInfo);
        }
    }, [viewFileInfo])

    const fetchApi = (userId) => {
        // if(userMedicationList.length == 0){
        dispatch(fetchUsermedication({userId, user: userId == primaryUserId ? "primary" : "Spouse"}))
        // }
        if (userMedicationList?.length == 0) {
            dispatch(fetchmedication())
        }
        // console.log("dsdsds",userMedicationList)
    }

    const filteredSearchData = useMemo(() => {
        let searchQuery = searchValue;
        let data = userMedicationList?.userMedications;

        if ($AHelper.$isNotNullUndefine(searchQuery)) {
            const searchString = searchQuery.toLowerCase();
            return data?.filter(item => {
                return (
                    (item?.medicationName?.toLowerCase().includes(searchString))
                );
            });
        } else {
            return data;
        }
    }, [searchValue, userMedicationList?.userMedications]);


    const handleAddAnother = (type) => {
        // if(type !='ADD' && type !='EDIT'){
        // submitForm("fromMedication");
        // }
        setIsAddedit(true)
        setShowTable(userId)
        setHideCustomeSubSideBarState(true)
        setHideAllAccrodian(true)
        setEdituser({ ...$JsonHelper.newFormDataObj() })
        $AHelper.$scroll2Top()
    }

    const updateMember = (data) => {
        konsole.log(data, "userMedicationList2")
        handleAddAnother('EDIT')
        setShowTable(userId)
        setEdituser(data);
    }

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }


    const deleteMember = async (data) => {
        const confirmRes = await newConfirm(true, "Are you sure you want to delete this medication ? This action cannot be undone.", "Confirmation", "Delete Medication", 2);
        if (!confirmRes) return;
        toasterAlert("deletedSuccessfully", `Medication & Supplements has been deleted successfully`);
        handleSubmit(data);
    }

    const handleSubmit = async (data) => {
        let deleteJson = { ...data, isActive: false }
        let jsonObj = {
            'userId': userId,
            'userMedications': [deleteJson],
            'UpsertedBy': userId
        }
        setLoader(true)
        const responseMedication = await postApiCall('POST', $Service_Url.UpsertUserMedication, jsonObj)
        setLoader(false)
        if (responseMedication != 'err') {
            cleanMedicationNsuplement(healthMedicationPageType);
            konsole.log(responseMedication, "responseMedication")
            fetchApi(userId)

        }
    }

    konsole.log("userMedicationList", editUser)

      const handleRoute = useCallback((item) => {
            $AHelper.$dashboardNextRoute(item?.route);
        }, []);

    // const handleNextBtn =()=>{
    //     if(isPrimaryMemberMaritalStatus && activeBtn == 1) {
    //         setActiveBtn(2);
    //         $AHelper?.$scroll2Top()
    //     } else  handleRoute($dashboardLinks?.[3]);
    // }

    
      const handleNextBtn = () => {
            $AHelper?.$scroll2Top()
            handleRoute($dashboardLinks?.[3]);
    }

    
    const handleViewFileInfo = (val) => {
        setViewFileInfo(val)
        setviewPdfdata([]);
    }

    const fetchDataForPdf = async  (item ) => {  
        const otherObj=[{isActive: true, othersMapNatureId: String(item?.userMedicationId), othersMapNature: '', userId: primaryUserId}]
        const getOtherRes = item?.medicationName == "Other" ? await postApiCall("POST", $Service_Url.getOtherFromAPI, otherObj) : {};
        konsole.log("ViewOtherData", item, getOtherRes)

    setviewPdfdata ([{'Medication Type':  getOtherRes?.data?.data?.[0]?.othersName || item.medicationName}, {'Dosage':  item.doseAmount}, {'How often do you take this':  item.frequency},
        {'Timing': item.time}, {'Note': <span className="bottom me-3" >{item.doctorPrescription}</span>}
    ]);
}

    return (
        isAddedit == false ? <div className="col-12 d-xl-flex justify-content-xl-between">
               {viewFileInfo && <UploadedFileView refrencePage='Medication & Supplyments' isOpen={true} handleViewFileInfo={handleViewFileInfo} fileDetails={{ name: 'Medication & Supplements' }} itemList={viewPdfdata}  />}
            {/* <div className="col-xl-3 col-12 mt-2" style={{fontSize:"12px"}}>
                {medicationAndSupplementsPlaceholder}
            </div> */}
            <div className="col-12">
                <div id="information-table" className="mt-2 information-table">
                    <div className="table-search-section sticky-header-1 d-flex  align-items-center">
                        <div className="children-header">
                         <span>{(userId == primaryUserId ? primaryMemberFirstName : spouseFirstName) + "'s" + " Medication & Supplements"}</span>
                            {/* <span className="badge ms-1">{tableDataMap?.length} Added</span> */}
                        </div>
                        <div style={{ marginLeft: 'auto', marginBottom: "43px", width: '40%' }}>
                            <CustomInputSearch
                                isEroor=''
                                label=''
                                id='search'
                                placeholder='Search'
                                value={searchValue}
                                onChange={(val) => setSearchValue(val)}

                            />

                        </div>
                        <div className=' d-flex flex-row-reverse'>
                            <CustomButton label="Add Medication" onClick={() => handleAddAnother('ADD')} />
                        </div>
                    </div>
                    <div className='table-responsive fmlyTableScroll'>
                        <Table className="custom-table">
                            <thead className="sticky-header">
                                <tr>
                                    {tableHeader.map((item, index) => (
                                        <th key={index} className={`${item.name == 'View/Edit/Delete' ? 'text-center' : ''}`} >{item.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            {filteredSearchData?.length > 0 ? (
                                <tbody>
                                    {filteredSearchData.map((item, index) => {
                                        const { medicationName, doseAmount, frequency, time, doctorPrescription } = item;
                                {konsole.log(item, "aaaaaaaaaaaaaaaa")}

                                        return (
                                            <tr key={index}>
                                                <td><OtherInfo key={index + item.medicationId}  othersCategoryId={38} userId={userId} othersMapNatureId={item.userMedicationId} FieldName={item.medicationName || "-"} /></td>
                                                <td>{doseAmount || "-"}</td>
                                                <td>{frequency || "-"}</td>
                                                <td>{time || "-"}</td>
                                                <td style={{wordBreak:"break-word"}}>{doctorPrescription || "-"}</td>
                                                <td>
                                                    <div className="d-flex justify-content-center gap-4">
                                                    {<img src="/New/icons/file-eye-view.svg" alt="view Icon" className="icon cursor-pointer" onClick={() => handleViewFileInfo(item)} />}
                                                        <img src="/New/icons/edit-Icon.svg" alt="Edit Icon" className="icon cursor-pointer" onClick={() => updateMember(item)} />
                                                        <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer" onClick={() => deleteMember(item)} />
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
                 <div className="d-flex justify-content-end">
                 {/* <CustomButton label={`Proceed to ${(isPrimaryMemberMaritalStatus && activeBtn == 1) ? spouseFirstName + ' Information': 'Housing'}`} onClick={()=>handleNextBtn()}/>)} */}
                 { userId == spouseUserId && (
                 <CustomButton label={"Proceed to Housing"} onClick={()=>handleNextBtn()}/>)}
                </div>
            </div>
        </div>
            : 
            <AddEditMedication 
             setIsAddedit={setIsAddedit} 
             setShowTable={setShowTable}
             activeBtn={activeBtn}
             setActiveBtn={setActiveBtn}
             handleActiveTabMain={handleActiveTabMain} 
             setHideAllAccrodian={setHideAllAccrodian} 
             setHideCustomeSubSideBarState={setHideCustomeSubSideBarState} 
             medicationList={medicationList} editUser={editUser} 
             setEdituser={setEdituser} userId={userId} /> 
    )
}
export default MedicationTable;