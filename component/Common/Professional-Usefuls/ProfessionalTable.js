import React, { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { CustomButton } from '../../Custom/CustomButton';
import { Table } from 'react-bootstrap';
import { $Service_Url } from '../../../components/network/UrlPath';
import { getApiCall, isNotValidNullUndefile, postApiCall } from '../../../components/Reusable/ReusableCom';
import { $AHelper } from '../../Helper/$AHelper';
import { useLoader } from '../../utils/utils';
import konsole from '../../../components/control/Konsole';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { deletePrimaryCareProf, deleteProfessional, getPrimaryCareMapId, getPrimaryProfs, mapPrimaryProf, primaryProfUpsert } from './ProfessionalCommonFunction';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { setaddedPrimaryProfList, setBothFormData, setBothMetaData, setformData, setformMetaData, setspousePrimaryPhysAdded } from '../../Redux/Reducers/professionalSlice';
import { globalContext } from '../../../pages/_app';
import { profConstants } from '../../Helper/Constant';
import IDontHaveOne from './IDontHaveOne';
import OtherInfo from '../../../components/asssets/OtherInfo';
import UploadedFileView from '../File/UploadedFileView';
import { selectProfessional } from '../../Redux/Store/selectors';
import { $JsonHelper } from '../../Helper/$JsonHelper';

const PhoneFormat = (value) => {
    if(value?.length < 10) return "Not Provided";
    let phoneArray = value?.split(",");
    const newArr = [];
    for (let i = 0; i < phoneArray?.length; i++) {
        let phoneNumber = phoneArray[i]
        let cleaned = ("" + phoneNumber).replace(/\D/g, "");
        // console.log("cleanfdf",cleaned?.startsWith("254"))  
        if(cleaned?.startsWith("254")){
            let fornum = `+254 ${cleaned?.slice(3,6)+" "+cleaned?.slice(6,9)+" "+cleaned?.slice(9)}`;
            newArr.push(fornum);
          }
          else
          {
            let contactNumber=cleaned?.slice(-10)
            let match = contactNumber?.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                let fornum = `${phoneNumber.includes("+91")?"+91":"+1"} ${"(" + match[1] + ") " + match[2] + "-" + match[3]}`;
                newArr.push(fornum);
            }  
        }
  
    }
    return newArr?.join(", ");
}
const searchFilter = ( profDetails , _searchText ) => {
    const searchText = _searchText?.toLocaleLowerCase();
    const fullName = profDetails?.fName + " " + profDetails?.lName;
    if(fullName?.toLocaleLowerCase()?.includes(searchText) || profDetails?.emaidIds?.toLocaleLowerCase()?.includes(searchText) || profDetails?.proType?.toLocaleLowerCase()?.includes(searchText)) return true;
    return false;
}

const ProfessionalTable = forwardRef(( props, ref ) => {
    const [addedProfList, setaddedProfList] = useState({});
    // const [addedPrimaryProfList, setaddedPrimaryProfList] = useState({});
    const [searchText, setsearchText] = useState("");
    const [viewPdfdata, setviewPdfdata] = useState([]);
    const [viewFileInfo, setViewFileInfo] = useState(false)
    const { primaryUserId, spouseUserId, loggedInUserId, isPrimaryMemberMaritalStatus, spouseFullName, spouseFirstName } = usePrimaryUserId();
    const isPrimaryProf = [10, 11].includes(parseInt(props.proTypeId)) ? true : false;
    const selectedUser = props?.selectedUser;
    const currentUserId = (selectedUser == "2") ? spouseUserId : primaryUserId;
    const dispatch = useAppDispatch();
    const [getOtherRes, setGetOtherRes] = useState({});
    const [otherDataByRow, setOtherDataByRow] = useState({});
    const { setWarning, newConfirm,setPageCategoryId, setPageTypeId} = useContext(globalContext);
    const [savedAddressByUserId, setsavedAddressByUserId] = useState({});
    const iDontHaveRef = useRef();
    const isMyProfessional = (props.proSerDescId == '' && props.proTypeId == '') ? true : false;
    const tableHeader = profConstants.allTableHeaders[(isPrimaryProf || isMyProfessional) ? 0 : 1];
    const firstUserId = props?.userId;
    const { addedPrimaryProfList } = useAppSelector(selectProfessional)

    useEffect(() => {
        fetchAllRequired()
        // setWarning("successfully", "Successfully updated data", "Your data has been successfully updated.");
    }, [primaryUserId, spouseUserId])

    useEffect(() => {
        setsearchText("");
    }, [selectedUser])

    useEffect(() => {
        if(props?.proTypeId == "10") {
            konsole.log('started',);
            const finalResultForTable = addedProfList?.[selectedUser];
            const primaryPhysicianProUserId = addedPrimaryProfList[selectedUser]?.filter(ele => ele.is_Primary == true && ele.userPrimaryCareMaps?.some(ele2 => ele2.userId == currentUserId))?.[0]?.pro_User_Id;
            const primaryPhysician = finalResultForTable?.find(ele => ele.proUserId == primaryPhysicianProUserId);
            konsole.log("bvdsjkqbakjbkj", finalResultForTable, addedPrimaryProfList, primaryPhysicianProUserId, primaryPhysician);
            if(primaryPhysician) handleProfEdit('EDIT', primaryPhysician);
            else handleProfEdit('ADD', {});
        }
        fetchOtherData();
    }, [addedProfList, addedPrimaryProfList, selectedUser])


    useEffect(() => {
          const typeIdMapping = {10: 2, 11: 3, 16: 8, 17: 9, 4: 10, 1: 12, 3: 13, 12: 14, 13: 29, 45: 30, 46: 31};          
          props.proTypeId === ""  ? setPageCategoryId(7)  : setPageTypeId(typeIdMapping[props.proTypeId]);

        return ()=>{
            if (["11", "10", "16", "17", "4", "1", "3", "12", "13", "45", "46", ""].includes(props.proTypeId)) {
                props.proTypeId === "" ? setPageCategoryId(null) : setPageTypeId(null);
              }              
       }
    }, [props])
    
    useEffect(() => {
        if(isNotValidNullUndefile(viewFileInfo)) {
            fetchDataForPdf(viewFileInfo);
        }
    }, [viewFileInfo])

    useImperativeHandle(ref, () => ({
        fetchAllRequired,
    }))

    const fetchAllRequired = () => {
        if(!primaryUserId) return;

        fetchAddedProfList('1', primaryUserId);
        if(spouseUserId) fetchAddedProfList('2', spouseUserId);

        if(isPrimaryProf || isMyProfessional) fetchAddedPrimaryProfList('1', primaryUserId);
        if((isPrimaryProf || isMyProfessional) && spouseUserId) fetchAddedPrimaryProfList('2', spouseUserId);
    }

    const fetchAddedProfList = async (key2Map, userId) => {

        useLoader(true)
        const sendData = `?MemberUserId=${userId}&ProTypeId=${props.proTypeId}&primaryUserId=${props.primaryUserId}`;
        const getUrl = $Service_Url.getSearchProfessional;

        const res_addedProflist = await getApiCall("GET", getUrl + sendData);
        if(!isPrimaryProf) useLoader(false) // to fix loader bug

        if(res_addedProflist == undefined || res_addedProflist == "err") return setaddedProfList(oldState => ({...oldState, [key2Map]: []}));
        
        useLoader(true)
        const groupedData = {};
        konsole.log("snvdjks", res_addedProflist);
        res_addedProflist?.forEach((obj) => {
            if (groupedData[obj.proUserId]) {
                const uniqueProTypeString = obj.proSubType ? obj.proSubType : obj.proType;
                // if(obj.fName == "KUMARAN") konsole.log("sdfdsads", groupedData[obj.proUserId].proType, "|", uniqueProTypeString, "|", groupedData[obj.proUserId].proType?.includes(uniqueProTypeString))
                if(uniqueProTypeString == "Other" || groupedData[obj.proUserId].proType?.includes(uniqueProTypeString) == false) {
                    groupedData[obj.proUserId].proType += `, ${uniqueProTypeString}`;
                    groupedData[obj.proUserId].allProCatList = [
                        ...groupedData[obj.proUserId].allProCatList,
                        {
                            proCatId: obj.proCatId,
                            proUserId: obj.proUserId,
                            userProId: obj.userProId,
                            proSerDescId: obj.proSerDescId,
                            proTypeId: obj.proTypeId,
                            proSubTypeId: obj.proSubTypeId,
                            directlyMapped: userId == obj?.userId,
                            lpoStatus: obj.lpoStatus,
                            userId: userId 
                        }
                    ]
                } else {
                    // konsole.log("dfcbjkbdf", userId, groupedData[obj.proUserId].allProCatList?.find(ele => (ele.proCatId == obj.proCatId))?.directlyMapped)
                    const findMappedObj = groupedData[obj.proUserId]?.allProCatList?.find(ele => (ele.proCatId == obj.proCatId));
                    if(findMappedObj?.directlyMapped == false) {
                        findMappedObj.directlyMapped = true;
                        findMappedObj.userProId = obj.userProId;
                    }
                    // konsole.log("dfcbjkbdf-after", userId, groupedData[obj.proUserId].allProCatList, findMappedObj)
                }
            } else {
                groupedData[obj.proUserId] = { 
                    ...obj,
                    proType: obj.proSubType ? obj.proSubType : obj.proType,
                    allProCatList: [
                        {
                            proCatId: obj.proCatId,
                            proUserId: obj.proUserId,
                            userProId: obj.userProId,
                            proSerDescId: obj.proSerDescId,
                            proTypeId: obj.proTypeId,
                            proSubTypeId: obj.proSubTypeId,
                            directlyMapped: userId == obj?.userId,
                            lpoStatus: obj.lpoStatus,
                            userId: userId 
                        }
                    ]
                };
            }
        });

        const result = Object.values(groupedData)
        konsole.log("dbajkvb", result)
        setaddedProfList(oldState => ({
            ...oldState,
            [key2Map]: result,
        }));

        useLoader(false)
    }

    const setaddedPrimaryProfListFunc = ( key, value ) => {
        dispatch(setaddedPrimaryProfList({ key, value }));
    }

    const fetchAddedPrimaryProfList = async ( key, userId ) => {
        useLoader(true)
        const response = await getPrimaryProfs(userId)
        if(!spouseUserId || spouseUserId == userId) useLoader(false) // to fix bug related to loader
        if(response == "err") setaddedPrimaryProfListFunc(key, []);
        else {
            setaddedPrimaryProfListFunc(key, response?.data?.data?.physicians);
            // if(response?.data?.data?.physicians?.some(ele => ele?.is_Primary)) dispatch(setspousePrimaryPhysAdded(true));
            // else dispatch(setspousePrimaryPhysAdded(false));
        }
    }

    const getPrimaryCareMapItByProUserId = ( proUserId, userId ) => {
        return addedPrimaryProfList?.[userId == primaryUserId ? '1' : '2']?.find(ele => ele?.pro_User_Id == proUserId) ?? {};
    }

    const handleProfEdit = ( action, item ) => {
        konsole.log("com_prof", action, item);

        // dispatch(setBothFormData({}));
        dispatch(setBothMetaData({}));
        
        if(props.proTypeId != '10' && action == "ADD") {
            iDontHaveRef?.current?.handleInputChange(false);
        }

        const _spouseAllProCatList = addedProfList?.[selectedUser == '1' ? '2' : '1']?.find(ele => ele?.proUserId == item?.proUserId)?.allProCatList;
        const _primaryProDeatils = addedPrimaryProfList[selectedUser]?.find(ele => ele.pro_User_Id == item.proUserId);
        props.setEditProfDetails({
            ...item,
            spouseAllProCatList: _spouseAllProCatList,
            sameAsSpouse: _spouseAllProCatList?.length ? true : (action == "ADD" ? undefined : false),
            primaryProfDetails: _primaryProDeatils,
        });
        dispatch(setBothMetaData({
            is_GCM: _primaryProDeatils?.is_GCM,
            is_GCM_Certified: _primaryProDeatils?.is_GCM_Certified,
            happy_With_Service: _primaryProDeatils?.happy_With_Service,
            visit_Duration: _primaryProDeatils?.visit_Duration,
        }))
        props.setpageAction(action);
        if(props.proTypeId != '10') $AHelper.$scroll2Top()
    }

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
      }
    

    const deleteProfUser = async ( item ) => {
        const confirmRes = await newConfirm(true, `Are you sure you want to delete this professional? This action cannot be undone.`, "Confirmation", `Delete ${props.profTitle}`, 2);
        if(!confirmRes) return;

        useLoader(true);

        // Deleting all Professional Mapping including primary professional
        const listOfProCat = item?.allProCatList?.filter(ele => ele.directlyMapped)?.map(ele => ({
            deletedBy: loggedInUserId,
            userProId: ele?.userProId,
            userId: currentUserId,
        }))
        await deleteProfessional(listOfProCat);

        // Handleing primary professional
        if(isMyProfessional || isPrimaryProf) {
            // - is same as spouse
            const _spouseAllProCatList = addedProfList?.[selectedUser == '1' ? '2' : '1']?.find(ele => ele?.proUserId == item?.proUserId)?.allProCatList;
            const sameAsSpouse = _spouseAllProCatList?.some(ele => ele?.proTypeId == "10" || ele?.proTypeId == "11");

            // - get matching primary professional details
            let primaryCareDetails = await getPrimaryCareMapItByProUserId(item?.proUserId, sameAsSpouse == true ? primaryUserId : firstUserId);

            // - if professional saved as same as spouse and user deleting spouse primary mapped professional
            if(selectedUser == '2' && sameAsSpouse) {
                let _userPrimaryCareMapId  =  primaryCareDetails?.userPrimaryCareMaps?.find(ele => ele.userId == spouseUserId)?.userPrimaryCareMapId;
                
                await mapPrimaryProf("PUT", {
                    userPrimaryCareMapId: _userPrimaryCareMapId,
                    isDeleted: true,
                    remarks: "",
                    updatedBy: loggedInUserId
                })

                useLoader(false);
                toasterAlert("deletedSuccessfully", `${props.profTitle} has been deleted successfully`);
                fetchAllRequired();
                return;
            }

            // - delete matching primary professional itself
            if(primaryCareDetails?.primary_Care_Id) deletePrimaryCareProf(primaryCareDetails?.primary_Care_Id, sameAsSpouse == true ? primaryUserId : firstUserId, loggedInUserId);

            // - if deleting from primary user
            // - or if deleting primary care physician who also have specialist and currently deleting from specialist
            if(selectedUser == '1' && sameAsSpouse) { 
                const userIdForMapping = spouseUserId;

                // - map all unmapped professional categories to spouse from primary user
                const primaryUsersAlreadyAddedSpecialistCatIds = item?.allProCatList?.filter(ele => ele?.proTypeId == "11" || ( ele?.proTypeId == "10" && (primaryCareDetails?.is_Primary == true) ) )?.map(proCatObj => {
                    return {
                        userProId: 0,
                        proUserId: item?.proUserId,
                        proCatId: proCatObj?.proCatId,
                        userId: userIdForMapping,
                        lpoStatus: proCatObj?.lpoStatus || false,
                        upsertedBy: loggedInUserId,
                        instructionsToAgent: proCatObj?.instructionsToAgent,
                        isActive: true
                    }
                });
                if(primaryUsersAlreadyAddedSpecialistCatIds?.length) await postApiCall("POST", $Service_Url.postProfessionalUser, primaryUsersAlreadyAddedSpecialistCatIds);
                
                // - creating a new primary professional using proUserId
                const JSONObject1 = $JsonHelper.createPrimaryProf({
                    userId: userIdForMapping,
                    professionalUserId: item?.professionalUserId,
                    isPhysician: primaryCareDetails?.is_Primary || false,
                    isGCM: primaryCareDetails?.is_GCM,
                    isGCMCertified: primaryCareDetails?.is_GCM_Certified,
                    proUserId: item?.proUserId,
                    isHappy: primaryCareDetails?.happy_With_Service,
                    visitDuration: primaryCareDetails?.visit_Duration,
                    sameAsSpouse: false,
                    createdBy: loggedInUserId,
                })
                const primaryCareRes = await primaryProfUpsert("POST", JSONObject1);
                const primaryCareId = primaryCareRes?.data?.data?.physicians?.[0]?.primary_Care_Id;
                
                // - mapping primary professional with spouse
                const JSONObject2 = {
                    userId: userIdForMapping,
                    primaryCareId: primaryCareId,
                    sameInsUserId: null,
                    createdBy: loggedInUserId,
                }
                await mapPrimaryProf("POST", JSONObject2);
            }
        }
        
        useLoader(false);
        toasterAlert("deletedSuccessfully", `${props.profTitle} has been deleted successfully`);
        fetchAllRequired();
    }

    const finalResultForTable = addedProfList?.[selectedUser]?.filter(ele => searchFilter(ele, searchText))?.sort((a, b) => a.fName.localeCompare(b.fName));
    const primaryPhysicianProUserId = addedPrimaryProfList[selectedUser]?.filter(ele => ele.is_Primary == true && ele.userPrimaryCareMaps?.some(ele2 => ele2.userId == currentUserId))?.[0]?.pro_User_Id;
    const primaryPhysician = finalResultForTable?.find(ele => ele.proUserId == primaryPhysicianProUserId);
    // const primaryPhysicianAddress = useMemo(async () => {
    //     if(primaryPhysician?.professionalUserId) {
    //         const allAddress = await getApiCall("GET", $Service_Url.getAllAddress + primaryPhysician?.professionalUserId, '');
    //         if(allAddress == "res") return "";

    //         const primaryAddress = allAddress?.data?.data?.addresses?.find(ele => ele.addressTypeId == '1');
    //         return primaryAddress?.city || primaryAddress?.state || primaryAddress?.county || "";
    //     }
    //     return "";
    // }, [primaryPhysician?.professionalUserId])
    // konsole.log("sdbjsk", primaryPhysicianAddress)

    const fetchAddress = async (addressId) => {
        if(!addressId) return "";

        const response = await getApiCall('GET',$Service_Url.getAllAddress + addressId,'')
        console.log(response,"professionalAddress")
        if(response == 'err'){
            return '';
        }
        return response?.addresses?.[0]?.addressLine1
       
    }


    const handleViewFileInfo = (val) => {
        setViewFileInfo(val)
        setviewPdfdata([]);
    }

    const fetchDataForPdf =  async (item ) => {  
    const addressOfCur = await fetchAddress(viewFileInfo?.professionalUserId);
    const otherObj=[{isActive: true, othersMapNatureId: String(item?.proCatId), othersMapNature: '', userId: viewFileInfo?.professionalUserId}]
    const getOtherRes = item?.proType == "Other" ? await postApiCall("POST", $Service_Url.getOtherFromAPI, otherObj) : {};
    konsole.log("ViewOtherData", item, getOtherRes)

    const fullName = ` ${item.fName} ${$AHelper.$isNotNullUndefine(item.lName) ? item.lName : ''}`;
    
    let formattedNumbers = '';
    
    if (item.mobileNumbers) {
        formattedNumbers = PhoneFormat(item.mobileNumbers)?.split(', ').map(number => {
        return $AHelper.$formatNumber(number.trim())}).join(', '); 
    }
    setviewPdfdata ([ {'Name': fullName}, 
        (isPrimaryProf || isMyProfessional) ? { "Speciality": getOtherRes?.data?.data?.[0]?.othersName ||  item.proType } : undefined, 
        {'Business name': $AHelper.$isNullUndefine(item.businessName) ? "N/A" :  item.businessName},
        {'Phone number':  $AHelper.$isNullUndefine(formattedNumbers) ? "N/A" : formattedNumbers}, 
        {'Email address':  $AHelper.$isNullUndefine(item.emaidIds) ? "N/A" : item.emaidIds}, 
        {'Website Link':  $AHelper.$isNullUndefine(item.websiteLink) ? "N/A" : item.websiteLink},
        {'Address': $AHelper.$isNullUndefine(addressOfCur) ? "N/A" : addressOfCur},
        {'Notes for Agents': $AHelper.$isNullUndefine(item?.instructionsToAgent) ? "N/A" : item?.instructionsToAgent}
    ]);
}
    
    konsole.log("fjfh", viewPdfdata)

    const handleNextBtn = () => {
        if(firstUserId == primaryUserId && isPrimaryMemberMaritalStatus) {
            props?.setpageAction("VIEW", 2);
            $AHelper.$scroll2Top();
        }
        else props.handleActiveTabMain(props.nextPageId)
    };

    const fetchOtherData = () => {
        if (Array.isArray(finalResultForTable)) {
            finalResultForTable
            .filter(({ proCatId, professionalUserId, proType }) => proCatId && professionalUserId && proType === "Other")
            .forEach(({ proCatId, professionalUserId }) => {
                const otherObj = [{ isActive: true, othersMapNatureId: String(proCatId), othersMapNature: '', userId: professionalUserId }];
                postApiCall("POST", $Service_Url.getOtherFromAPI, otherObj).then(response => {
                    if (response?.data?.data) {
                        setOtherDataByRow(prevState => ({
                            ...prevState,
                            [professionalUserId]: response.data.data[0]?.othersName,
                        }));
                    }
                });
            });
        }
    };

    return (
        <>
        {viewFileInfo && <UploadedFileView refrencePage='Professional' isOpen={true} handleViewFileInfo={handleViewFileInfo} fileDetails={{ name: props.tableName }} itemList={viewPdfdata}  />}
        {((props.proTypeId != '10') && props.iDontHaveOneFormLabels?.length > 0 ) && <IDontHaveOne key={props.profTitle} profTitle={props.profTitle} userId={currentUserId} formLabelIds={props.iDontHaveOneFormLabels} ref={iDontHaveRef} disable={addedProfList?.[selectedUser]?.length > 0} />}
        {(props?.proTypeId != '10') ? <> <div className='professional-table mt-3'>
            <div className='header-box'>
                <div className='d-flex align-items-center'>
                    <p className='prof-t1' >{props.tableName}</p>
                    <div className='prof-count'>{finalResultForTable?.length ?? 0} Added</div>
                </div>
                <div className='d-flex align-items-center '>
                    <div className='search'>
                        <img className="mt-0" src="/New/icons/searchIconF.svg" />
                        <input type='text' placeholder='Search'
                            value={searchText}
                            onChange={(e) => setsearchText(e.target.value)}
                        />
                    </div>
                    <CustomButton label={props.addBtnName}
                    onClick={() => handleProfEdit("ADD", {})}
                     />
                </div>
            </div>
            <div className='table-responsive profTableScroll'>
                <Table className="custom-table mb-0">
                    <thead className="table-header">
                        <tr>
                            {tableHeader.map((item, index) => (
                                <th key={index} className={item == "Name" ? 'customHeadingForTable ps-24' : item == "" ? 'pe-24 customHeadingForTable' : 'customHeadingForTable'}
                                 style={{minWidth: `${item == "Phone number" ? '175px' : item == "Name" ? '150px' : ''}`}}><p className={`${item == 'Edit/Delete' ? 'text-end' : ''}`} >{item}</p></th>
                            ))}
                        </tr>                    
                    </thead>
                    {finalResultForTable?.length > 0 ? (
                        <tbody>
                            {finalResultForTable.map((item, index) => {
                                const { fName, mName, lName, proType, proSubType, mobileNumbers, emaidIds, businessName, businessType, professionalUserId, proCatId, proUserId } = item;
                                konsole.log(item,"specialityItem")
                                const othersName = otherDataByRow[professionalUserId];
                                const fullName = ` ${fName} ${$AHelper.$isNotNullUndefine(lName) ? lName : ''}`;
                                const formatedMobiles = PhoneFormat(mobileNumbers)?.split(', ')?.map(contact => <p>{contact}</p>);
                                // const roleName = isBeneficiary && isFiduciary ? 'Beneficiary, Fiduciary' : isBeneficiary ? 'Beneficiary' : (isFiduciary) ? 'Fiduciary' : '-';
                                return (
                                    <tr key={professionalUserId}>
                                        <td className="name ps-24" >{fullName}</td>
                                        {isMyProfessional ? 
                                        <td>{proType === "Other" ? othersName : (proType || "")}</td>
                                        : isPrimaryProf ? 
                                        <td>
                                            <OtherInfo
                                                othersCategoryId={28} 
                                                othersMapNatureId={proCatId} 
                                                FieldName={proSubType || proType} 
                                                userId={professionalUserId}
                                            />
                                        </td>
                                        : <>
                                        <td>{businessName ?? ""}</td>
                                        {/* <td>{businessType ?? ""}</td> */}
                                        {/* <td>
                                            <OtherInfo
                                                othersCategoryId={30} 
                                                othersMapNatureId={proUserId} 
                                                FieldName={businessType || ""} 
                                                userId={professionalUserId}
                                            />
                                        </td> */}
                                        </>}
                                        <td>{formatedMobiles}</td>
                                        <td>{emaidIds}</td>
                                        <td className='pe-24' style={{width: '90px'}}>
                                            <div className="d-flex justify-content-end gap-4">
                                        <img src="/New/icons/file-eye-view.svg" alt="view Icon" className="icon cursor-pointer" onClick={() => handleViewFileInfo(item)} />
                                                <img src="/New/icons/edit-Icon.svg" alt="Edit Icon" className="icon cursor-pointer" 
                                                    onClick={() => handleProfEdit("EDIT", item)}
                                                />
                                                <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer"
                                                    onClick={() => deleteProfUser(item)}
                                                />
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
        <div className='d-flex justify-content-end mt-3'>
            <CustomButton label={`Proceed to ${firstUserId == primaryUserId && isPrimaryMemberMaritalStatus ? spouseFirstName + " Information" : props.nxtBtnName}`}
            onClick={() => handleNextBtn()}/>
        </div>
        </> : ''}
        </>
    )
})

export default ProfessionalTable;