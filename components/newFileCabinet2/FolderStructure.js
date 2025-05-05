import React, { useContext, useRef,useCallback, useMemo } from 'react'
import { Row, Col, Form, Tooltip, OverlayTrigger, InputGroup, Modal, DropdownButton, Dropdown } from 'react-bootstrap'
import { FileCabinetContext } from './ParentCabinet'
import { useState } from 'react';
import konsole from '../control/Konsole.js';
import { folderOperationType,cretaeJsonForFilePermission , createCategoryObjJson, messageForPalaregalDrawerAccess, messageClientpermissions, messageAdminPermissions, messageParalegalpermissions, createFolderObjJson, categoryFileCabinet, sortingFolderForCabinet, accessToParalegal, paralegalAttoryId } from '../control/Constant.js';
import AddCategoryFolder from './AddCategoryFolder';
import { $AHelper } from '../control/AHelper.js';
import { useEffect } from 'react';
import AddFile from './AddFile';
import { globalContext } from '../../pages/_app';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from 'react-redux';
import FileViewer from './FileViewer';
import AlertToaster from '../control/AlertToaster';
import { Services } from '../network/Service';
import { isNotValidNullUndefile, isValidateNullUndefine ,getApiCall,postApiCall } from '../Reusable/ReusableCom.js';
import useUserIdHook from '../Reusable/useUserIdHook.js';
import UserGuidance from './UserGuidance.js';
import { demo } from '../control/Constant.js';
import { $Service_Url } from "../../components/network/UrlPath"
import { $AHelper as $AHelperNew } from "../../component/Helper/$AHelper";
import ShareDocumentModal from "./ShareDocumentModal"
import { fetchFamilyMembers} from '../../component/Redux/Reducers/apiSlice'
import { useAppSelector, useAppDispatch } from '../../component/Hooks/useRedux'
import usePrimaryUserId from "../../component/Hooks/usePrimaryUserId"
import { selectApi } from '../../component/Redux/Store/selectors';
import OtherInfo from '../asssets/OtherInfo.js';

const FolderStructure = ({ functionAfterAddingAnyFolder, callApiCabinetFolder, callApiCabinetCategory, setManageShowFileTypeFromManageFile, dispatchloader, functionForGetFileAfterAddEditFile, fileCabinetDesign }) => {
    let loggedUserId = sessionStorage.getItem('loggedUserId')
    let primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
    let getMaritalStatusId = sessionStorage.getItem('maritalStatusId')
    let spouseUserId = sessionStorage.getItem('spouseUserId')
    const userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
    const { _userDetailOfPrimary } = useUserIdHook()
    const { allMainCabinetContainer, fileInformation, setShowScreenType, sharedFileShatusList, setShowAddEditFolder, showAddEditFolder, allFolderList, allContainerFolder } = useContext(FileCabinetContext)
    const { primaryDetails, isPrimaryMemberMaritalStatus} = usePrimaryUserId();
    const { setdata } = useContext(globalContext)
    const apiData = useAppSelector(selectApi);
    const {familyMembersList} = apiData;
    const dispatch = useAppDispatch();
    const context = useContext(globalContext);
    const subtenantId = sessionStorage.getItem("SubtenantId");
    const stateObj = $AHelper.getObjFromStorage("stateObj");
    const [cabinetId, setCabinetId] = useState('')
    const [categoryTypeList, setCatetoryTypeList] = useState([])
    const [newCategoryTypeList, setNewCatetoryTypeList] = useState([])
    const [selectFolderInfo, setSelectFolderInfo] = useState([])
    const [actionType, setActionType] = useState('Add')
    const [selectIndexOfCategory, setSelectIndexOfCategory] = useState(null)
    const [refrencePage, setRefrencePage] = useState('FolderStructure')
    const [manageShowFileType, setManageShowFileType] = useState('Folder')
    const [openFileInfo, setOpenFileInfo] = useState({ primaryUserId: '', fileId: 0, fileTypeId: 0, fileCategoryId: 0, requestedBy: loggedUserId, fileTypeName: '' })
    const [isFileOpen, setIsFileOpen] = useState(false)
    const [fileAddFrom, setFileAddFrom] = useState('')
    const [allFileForMapping, setAllFileMapping] = useState([])
    const [categoryOpenStates, setcategoryOpenStates] = useState({});
    const [isSpecificDrawerSelect, setIsSpecificDrawerSelect] = useState(false)
    const [showAddEditModal, setShowAddEditModal] = useState(false)
    const [fileCollapseOpen, setFileCollapseOpen] = useState([])
    const [fileData, setFileData] = useState({})
    const [folderName, setFolderName] = useState("")
    const [totalFilesOfTheFolder, setTotalFilesOfTheFolder] = useState([])
    const [selectedFolderFiles, setSelectedFolderFiles] = useState([])
    const [searchFolder, setSearchedFolders] = useState("")
    const [searchFiles, setSearchedFiles] = useState("")
    const [folderBredCrum, setFolderBredCrum] = useState([])
    const [selectedClickfolderId, setselectedClickfolderId] = useState(null)
    const [selectedClickSubfolderId, setselectedClickSubfolderId] = useState(null)
    const [selectedClickInnerSubfolderId, setselectedClickInnerSubfolderId] = useState(null)
    const [selectedFolderIds, setSelectedFolderIds] = useState(null)
    const [showPrimaryFiles, setShowPrimaryFiles] = useState(true)
    const [showUserGuidanceModal, setShowUserGuidanceModal] = useState(false);
    const [showOldFilesAgain, setShowOldFilesAgain] = useState(true);
    const [openShareDocument,setOpenShareDocument]=useState(false);
    const { setWarning, newConfirm } = useContext(globalContext);
    const[familyMembersListForCabinet,setFamilyMembersListForCabinet]=useState([])
    const [jsonObjForShareStatus, setJsonObjForShareStatus] = useState([]);
    const [manageUpdate, setManageUpdate] = useState({ updatedBy: stateObj?.userId, updatedOn: new Date().toISOString() })
    const [manageCreate, setManageCreate] = useState({ createdBy: stateObj?.userId, createdOn: new Date().toISOString() })
    const [fileId, setFileId] = useState(0) 
    const [searchedFamilyMemeberValue,setSearchedFamilyMemeberValue]=useState("")
    const[showOpenCabinetShareDoc,setShowOpenCabinetShareDoc]=useState(false)
    const[shareWithModal,setShareWithModal]=useState(false)
    const[closeCabinetShareModal,setCloseCabinetShareModal]=useState(false)
    const[jsonForMultiplePermission,setJsonForMultiplePermission]=useState([])
    const[checkedFileJson,setCheckedFileJson]=useState([])
    const[ disableConfirmButton,setDisableConfirmButton]=useState(false)
    const[selectedCabinetData,setSelectedCabinetData]=useState(null)
    const[fileInformationList,setFileInformationList]=useState(fileInformation)
    // konsole.log("selectedCabinetId",selectedCabinetId)
    // console.log("allFolderListallFolderList", familyMembersList)
    // console.log("usePrimaryUserId",primaryDetails)
    // konsole.log('stateObjstateObj', stateObj.roleId)
    // konsole.log('AlertToasterAlertToaster', AlertToaster)
    // konsole.log("sharedFileShatusListsharedFileShatusList", sharedFileShatusList)
    // konsole.log("selectFolderInfoselectFolderInfo", selectFolderInfo)
    // console.log("familyMembersListForCabinet",familyMembersListForCabinet,familyMembersList)
    // konsole.log("categoryTypeList",categoryTypeList)
    // konsole.log("allFilesList", allFileForMapping,selectIndexOfCategory)  {allMainCabinetContainer?.sort((a, b) => a?.fileCabinetOrder - b?.fileCabinetOrder)?.map((item, index) => {
    // konsole.log("cabinetId",cabinetId)
    // konsole.log("consolejsonObjForShareStatus",jsonObjForShareStatus)
    // konsole.log("folderBr555555edCrumfolderBredCrum", selectedClickfolderId, selectedClickSubfolderId, selectedClickInnerSubfolderId)
        // console.log("familyMembersListForCabinet",familyMembersListForCabinet)
    // console.log("showPrimaryFiles",showPrimaryFiles)
    useEffect(() => {
        setNewCatetoryTypeList(allMainCabinetContainer)
        setCatetoryTypeList(allMainCabinetContainer)
        fetchApi()
    }, [])

    const fetchApi = useCallback(async () => {
         let fetApiCall = [dispatch(fetchFamilyMembers({ userId: primaryMemberUserId }))]
        //  console.log("fetApiCall",fetApiCall)
       },[]);

    useEffect(()=>{
        if(familyMembersList?.length>0){
        let filterMapList=[...familyMembersList]
        let filterRemovedSpouseList=filterMapList?.filter((data)=>data?.userId!=spouseUserId) // List without spouse user
        // console.log("showPrimaryFiles",showPrimaryFiles,"filterRemovedSpouseList",filterRemovedSpouseList)
        const appendMobAndEmail={fName:userDetailOfPrimary?.memberName,email:_userDetailOfPrimary.primaryEmailId,mobileNo:_userDetailOfPrimary.userMob,relationshipName:"Spouse",userId: primaryMemberUserId }
        // console.log("appendMobAndEmail",appendMobAndEmail)
        let getMappedValues=(showPrimaryFiles==false)?[appendMobAndEmail,...filterRemovedSpouseList]:filterMapList // On toggle add Primary / Spouse in family list
            setFamilyMembersListForCabinet(getMappedValues)
        }
    },[familyMembersList,showPrimaryFiles])

    function getFileValues(userFileName, item, commonFile) {
        setFileData(item)
    }
    
    // konsole.log("fileInformationdgs", fileInformationList)
    useEffect(() => {
        let fileInfoForMapping = [...fileInformation]
        konsole.log('fileInfoForMappingfileInfoForMapping', fileInfoForMapping)
        let logedRoleId = stateObj?.roleId
        // let filterSharedFile = sharedFileShatusList.length > 0 ? sharedFileShatusList?.filter(({ sharedUserId }) => sharedUserId == loggedUserId) : []
        // let filterSharedFile = sharedFileShatusList.length > 0 ? sharedFileShatusList?.filter(({ roleId }) => roleId == logedRoleId) : []
        let filterSharedFile = sharedFileShatusList;
        konsole.log('filterSharedFileaaaa', filterSharedFile)
        // let filterParalegalUploadedBy = fileInformation.length > 0 ? fileInformation.filter(({ fileUploadedBy }) => fileUploadedBy == loggedUserId) : []
        if (paralegalAttoryId?.includes(stateObj?.roleId) && filterSharedFile?.length !== 0) {
            fileInfoForMapping = [...filterSharedFile]
            let newArr = []
            for (let [index, item] of filterSharedFile?.entries()) {
                for (let i = 0; i < fileInformation.length; i++) {
                    // konsole.log('fileIdfileId', filterSharedFile[index]?.fileId == fileInformation[i]?.fileId)
                    if (filterSharedFile[index]?.fileId == fileInformation[i]?.fileId) {
                        newArr.push({ ...filterSharedFile[index], ...fileInformation[i] })
                    } else if (fileInformation[i]?.fileCategoryId != categoryFileCabinet) {
                        newArr.push({ ...fileInformation[i] })
                    }
                }
            }
            fileInfoForMapping = [...newArr]?.sort((a, b) => {
                const dateA = new Date(a?.dateFinalized);
                const dateB = new Date(b?.dateFinalized);

                return dateB - dateA;
            });
        }
        setAllFileMapping(fileInfoForMapping)

    }, [sharedFileShatusList, fileInformationList,fileInformation])

    // konsole.log("allFileForMappingagain",allFileForMapping)
    useEffect(() => {
        if (allMainCabinetContainer.length > 0) {
            const getIndexOfCategorySelected = allMainCabinetContainer?.findIndex((item) => {
                return item?.fileCategoryId == 6
            })
            setSelectIndexOfCategory(getIndexOfCategorySelected)
            // konsole.log("getIndexOfCategorySelected",getIndexOfCategorySelected)
            let filterSelectCategory = allMainCabinetContainer?.filter(({ fileCategoryId }) => fileCategoryId == 6)
            setCatetoryTypeList(filterSelectCategory) // Show legal folders list
            setIsSpecificDrawerSelect(true) // Sselect parent folder   

        }
    }, [])

    useEffect(()=>{
        // konsole.log("cssssssssss",actionType,refrencePage,refrencePage == 'FolderStructure' , actionType == 'Share')
        // if(refrencePage == 'FolderStructure' && actionType == 'Share')
        if(actionType == 'Share')
        {
            // functionForGetFileAfterAddEditFile()
            let { cabinetId, fileCategoryId, fileId, fileTypeId, folderId, fileBelongsTo, fileURL, fileTypeName, documentLocation, emergencyDocument, userFileName, description, dateFinalized, folderName } = selectFolderInfo
            // konsole.log('21selectFolderInfoNewCabinet', selectFolderInfo)
            let filterShareFileInfo = sharedFileShatusList.filter((item) => item?.fileId == fileId && (item?.belongsTo==((showPrimaryFiles == true) ? primaryMemberUserId : spouseUserId)) )
            // konsole.log('22selectFolderInfoNewCabinet', sharedFileShatusList)
            // konsole.log('filterShareFileInfofilterShareFileInfoParentCabinet', filterShareFileInfo)
            setJsonObjForShareStatus(filterShareFileInfo)
            setFileId(fileId)
        }
          
        
    },[selectFolderInfo,actionType,refrencePage,openShareDocument])

    // konsole.log("newactionType",actionType)    

    useEffect(() => {
    if (selectedClickfolderId) {
        //Select innerFolder for LPL
        const lifePointLawFolderId = allFolderList && allFolderList.length > 0 && allFolderList?.filter((item) => {
            if (item?.parentFolderId == selectedClickfolderId) return item
        })

        const findEstatePlanFolder = lifePointLawFolderId && lifePointLawFolderId?.find((data) => {
            return data?.folderName == "Estate planning documents"
        })

        // konsole.log("findEstatePlanFolderfindEstatePlanFolder",findEstatePlanFolder,"===",lifePointLawFolderId,"====selectedClickfolderId".selectedClickfolderId,"selectedClickSubfolderId",selectedClickSubfolderId)
        if (findEstatePlanFolder) {
            const ClickSubFolderIDs = findEstatePlanFolder?.folderId
            setselectedClickSubfolderId(ClickSubFolderIDs)
            makeBrudCrum(ClickSubFolderIDs)
            const getListOfInnerSubFolderOfEstatePlan = allFolderList && allFolderList.length > 0 && allFolderList?.filter((item) => {
                if (item?.parentFolderId == ClickSubFolderIDs) return item
            })
            // konsole.log("getListOfInnerSubFolderOfEstatePlan",getListOfInnerSubFolderOfEstatePlan)
            const getCurrentFolderOFEstatePlan = getListOfInnerSubFolderOfEstatePlan && getListOfInnerSubFolderOfEstatePlan?.length > 0 && getListOfInnerSubFolderOfEstatePlan?.find((item1) => { if (item1?.folderName == "Current") return item1?.folderId })
            const getDraftFolderOFEstatePlan = getListOfInnerSubFolderOfEstatePlan && getListOfInnerSubFolderOfEstatePlan?.length > 0 && getListOfInnerSubFolderOfEstatePlan?.find((item1) => { if (item1?.folderName == "Draft") return item1?.folderId })

            // konsole.log("getCurrentFolderOFEstatePlan",getCurrentFolderOFEstatePlan.folderId,"getDraftFolderOFEstatePlan",getDraftFolderOFEstatePlan.folderId,allFileForMapping)
            if (getCurrentFolderOFEstatePlan) {
                const checkFilesForCurrentFolderId = allFileForMapping && allFileForMapping?.length > 0 && allFileForMapping.filter((item2) => {
                    return (item2?.folderId == getCurrentFolderOFEstatePlan?.folderId && item2?.fileBelongsTo == ((showPrimaryFiles == true) ? primaryMemberUserId : spouseUserId))
                })
                const checkFilesForDraftFolderId = allFileForMapping && allFileForMapping?.length > 0 && allFileForMapping.filter((item2) => {
                    return (item2?.folderId == getDraftFolderOFEstatePlan?.folderId && item2?.fileBelongsTo == ((showPrimaryFiles == true) ? primaryMemberUserId : spouseUserId))
                })
                // konsole.log("checkFilesForDraftFolderId",checkFilesForDraftFolderId,"checkFilesForCurrentFolderId",checkFilesForCurrentFolderId,showPrimaryFiles,primaryMemberUserId,spouseUserId)
                // konsole.log("checkFilesForCurrentFolderId",allFileForMapping,checkFilesForCurrentFolderId)
                if (checkFilesForCurrentFolderId?.length > 0) {
                    setselectedClickInnerSubfolderId(getCurrentFolderOFEstatePlan?.folderId)
                    // setSelectedFolderFiles(checkFilesForCurrentFolderId)
                } else {
                    if (checkFilesForDraftFolderId?.length > 0) {
                        setselectedClickInnerSubfolderId(getDraftFolderOFEstatePlan?.folderId)
                        // setSelectedFolderFiles(checkFilesForDraftFolderId)
                    } else {
                        setselectedClickInnerSubfolderId(getCurrentFolderOFEstatePlan?.folderId)
                    }
                }
            }

            // konsole.log("checkFilesForCurrentFolderId",checkFilesForCurrentFolderId,"checkFilesForDraftFolderId",checkFilesForDraftFolderId)
        }
        // konsole.log("allFolderListewewewe",findEstatePlanFolder,lifePointLawFolderId,allFolderList)   
        // konsole.log("sdsdsdsdsdsdselectedClickfolderId",selectedClickfolderId)
    }
// }, [selectedClickfolderId, showPrimaryFiles,selectedClickSubfolderId])
}, [selectedClickfolderId])

const renderingKey = useMemo(() => {
    return new Date().toString();
}, [showAddEditFolder])


    //  handle delete Folder ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const deleteFolderfun = async (item, file) => {
        konsole.log('itemitem', item, item?.folder)
        let { folderId, folderRoleId, folderSubtenantId, folderName, folderFileCategoryId, folderCreatedByRoleId, folderCreatedBy } = item
        let messageForParalegalNAdmin = (paralegalAttoryId?.includes(stateObj?.roleId) || folderFileCategoryId !== categoryFileCabinet[0]) ? messageAdminPermissions : messageParalegalpermissions
        if (folderCreatedByRoleId == '4' || folderCreatedByRoleId == '11') {
            setWarning("successfully", messageForParalegalNAdmin, ``);
            // toasterAlert(messageForParalegalNAdmin);
            return;
        }
        if (paralegalAttoryId.includes(stateObj?.roleId) && !(paralegalAttoryId?.includes(folderCreatedByRoleId) || item?.deleteFolder == true)) {
            setWarning("successfully", messageForParalegalNAdmin, ``);
            // toasterAlert(messageClientpermissions);
            return;
        }

        if (!paralegalAttoryId.includes(stateObj?.roleId) && folderCreatedByRoleId == '3') {
            setWarning("successfully", messageForParalegalNAdmin, ``);
            // toasterAlert(messageForParalegalNAdmin);
            return;
        }

        let jsonObj = {
            "memberUserId": primaryMemberUserId,
            "folderId": folderId,
            'subtenantId': folderSubtenantId,
            "folderName": folderName,
            "roleId": folderRoleId,
            "deletedBy": stateObj.userId,
            "folderCategoryId": folderFileCategoryId
        }

        konsole.log('jsonObjjsonObjjsonObj', JSON.stringify(jsonObj))
        // const question = await context.confirm(true, "Are you sure? you want to delete this folder", "Confirmation");
        // konsole.log('questionquestionquestion', question)
        const confirmRes = await newConfirm(true, 'Are you sure? you want to delete this folder', "Confirmation", "", 2);
        konsole.log("confirmRes", confirmRes);
        if (!confirmRes) return;
        // return;
        let roleId = stateObj.roleId;
        dispatchloader(true)
        deleteFileCabinetFolderFun(jsonObj)
    }


    const deleteFileCabinetFolderFun = (jsonObj) => {
        dispatchloader(true)
        Services.deleteFileCabinetFolder({ ...jsonObj }).then((res) => {
            konsole.log('res of deleting folder', res)
            toasterAlert("deletedSuccessfully", 'Folder has been deleted successfully')
            // AlertToaster.success('Folder deleted successfully')
            // window.location.reload()
            functionAfterAddingAnyFolder()
        }).catch((err) => {
            dispatchloader(false)
            let messagea = "Sorry Folder/Subfolder can not be deleted as it has document/documents associated with it."
            // toasterAlert(messagea)
            setWarning("warning", `${messagea}`, ``);
            konsole.log('err in deleting folder', err)
        })

    }
    const deleteFilefun = async (item) => {
        let { fileId, primaryUserId, fileCabinetId, fileCategoryId, fileTypeId, fileUploadedBy, isDelete } = item
        // const isDeleteFileAllow = (paralegalAttoryId?.includes(stateObj?.roleId) && ((fileUploadedBy != primaryUserId) || (isDelete == true))) ? true : (!paralegalAttoryId?.includes(stateObj?.roleId) && fileUploadedBy == loggedUserId) ? true : false;
        // console.log("stateObj13",stateObj?.roleId!=13)
            if (paralegalAttoryId.includes(stateObj?.roleId) && !(fileUploadedBy == loggedUserId || isDelete == true) && stateObj?.roleId!=13) {
                // toasterAlert(messageClientpermissions);
                setWarning("successfully", `${messageClientpermissions}`, ``);
                return;
        } else if (!paralegalAttoryId.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) {
            // toasterAlert();
            setWarning("successfully", `${messageParalegalpermissions}`, ``);
            return;
        }
        // let josnObj = { "userId": primaryUserId, "fileCategoryId": Number(fileCategoryId), "fileTypeId": Number(fileTypeId), "fileId": Number(fileId), "deletedBy": loggedUserId }
        let josnObj = { "userId": primaryUserId, "fileCabinetId": Number(fileCategoryId), "fileTypeId": Number(fileTypeId), "fileId": Number(fileId), "deletedBy": loggedUserId }
        konsole.log('josnObj', josnObj, item)
        konsole.log('itemitemitemitem', item)
        const confirmRes = await newConfirm(true, 'Are you sure? you want to delete this folder', "Confirmation", "", 2);
        konsole.log("confirmRes", confirmRes);
        if (!confirmRes) return;
        // const question = await context.confirm(true, "Are you sure? you want to delete this file.", "Confirmation");
        // if (question == false) return;

        // return
        dispatchloader(true)
        Services.deleteFileCabinetByFileId(josnObj).then((res) => {
            konsole.log('res of file deleting ', res)
            dispatchloader(false)
            toasterAlert("deletedSuccessfully", 'Document has been deleted successfully')
            // AlertToaster.success('Document deleted successfully')
            // window.location.reload()
            functionForGetFileAfterAddEditFile()
        }).catch((err) => {
            dispatchloader(false)
            konsole.log('err in deling file ', err)
        })

    }



    //  handle Category List------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const handleCategory = (index, item, type, specificCategory) => {

        // konsole.log("handleCatregory",index, item, type, specificCategory)
        setSelectedCabinetData(item)
        topSchroll()
        setShowScreenType('')
        setShowAddEditFolder('')
        setselectedClickfolderId(null)
        if (type == 'customMapping') {
            setSelectIndexOfCategory(index)
            let filterSelectCategory = newCategoryTypeList?.filter(({ fileCategoryId }) => fileCategoryId == item?.fileCategoryId)
            setCatetoryTypeList(filterSelectCategory)
        } else {
            setSelectIndexOfCategory(index)
            setCatetoryTypeList(newCategoryTypeList)
        }
        setselectedClickInnerSubfolderId(null)
        setselectedClickSubfolderId(null)
        // konsole.log("specificCategory", item)
        if (item.fileCategoryId == "6") {
            const lifePointLawFolderId = item?.folder?.map((item) => { return item?.folderName == "Life Point Law" })
            if (lifePointLawFolderId) {
                setselectedClickfolderId(lifePointLawFolderId);
                // konsole.log("lifePointLawFolderIdewew",lifePointLawFolderId)
                let getSelectedFolderFiles = allFileForMapping?.filter(({ folderId }) => folderId == lifePointLawFolderId);
                if (getSelectedFolderFiles.length > 0) { setSelectedFolderFiles(getSelectedFolderFiles) }
                else { setSelectedFolderFiles([]) }
                makeBrudCrum(lifePointLawFolderId)
                setSelectedFolderIds(lifePointLawFolderId)

            } else {
                setIsSpecificDrawerSelect(specificCategory)
                setFolderBredCrum([])
                setManageShowFileTypeFromManageFile('')
                setSelectedFolderFiles([])
                setSelectedFolderIds(null)
            }

        }
        setIsSpecificDrawerSelect(specificCategory)
        setFolderBredCrum([])
        setManageShowFileTypeFromManageFile('')
        setSelectedFolderFiles([])
        setSelectedFolderIds(null)

    }
    //  handle Add Edit Folder -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    const AddNewFile = () => {
        // konsole.log("selectedClicklectedClickfolderId",selectedClickfolderId)
        //  const [selectedClickfolderId,setselectedClickfolderId]=useState(null)
        //  const [selectedClickSubfolderId,setselectedClickSubfolderId]=useState(null)
        //  const [selectedClickInnerSubfolderId,setselectedClickInnerSubfolderId]=useState(null)
        // const selectedFolderIds=(selectedClickInnerSubfolderId==null)?selectedClickSubfolderId: selectedClickInnerSubfolderId;
        const selectedFolderIds = (selectedClickfolderId && !selectedClickSubfolderId) ? selectedClickfolderId : (selectedClickSubfolderId && !selectedClickInnerSubfolderId) ? selectedClickSubfolderId : selectedClickInnerSubfolderId
        if (selectedClickfolderId != null) {
            // if(selectedClickInnerSubfolderId!=null){}
            let getSelectedFolderData = selectedFolderIds && allFolderList?.find((item) => {
                // konsole.log("cxcxcxdczx",item.folderId,selectedClickfolderId)
                if (item?.folderId == selectedFolderIds) { return item }
            })
            handleAddEditFolder('File', 'Add', getSelectedFolderData, null, 'ManageAllFile', 'Folder', 'Folder')
        }
        else {
            setWarning("successfully", `Please select a Cabinet Folder`, ``);
            // toasterAlert("Please select a Cabinet Folder ");
        }
    }

    function seachFolders(e) {
        // konsole.log("eeeeecemyAllFoldermyAllFolder",e?.target?.value)  
        setSearchedFolders(e?.target?.value)
        setselectedClickSubfolderId(null)
        setselectedClickInnerSubfolderId(null)
        setFolderBredCrum([])
        setShowOldFilesAgain(false)
        // allFileForMapping?.filter((item) => item?.folderId == selectedFolderIds )

    }

    function searchFilesFunction(e) {
        // konsole.log("eeeeecemyAllFoldermyAllFolder",e?.target?.value)  
        setSearchedFiles(e?.target?.value)
    }


    const handleAddEditFolder = (show, action, value, previousarray, refrencePage, manageFileType, fileAddFrom) => {
        // konsole.log('showshowshow:', show, "action:", action, "valuevalue", value);
        let messageForParalegalNAdmin = (paralegalAttoryId?.includes(stateObj?.roleId) || (value?.folderFileCategoryId !== undefined && value?.folderFileCategoryId !== categoryFileCabinet[0])) ? messageAdminPermissions : messageParalegalpermissions
        konsole.log("valueOf", value)
        if (show == 'Folder' && (value?.folderCreatedByRoleId == 4 || value?.folderCreatedByRoleId == 11)) {
            setWarning("successfully", messageForParalegalNAdmin, ``);
            // alert('1');
            return;
        }
        if (show == 'Folder' && !paralegalAttoryId?.includes(stateObj.roleId) && value?.folderCreatedByRoleId == '3') {
            setWarning("successfully", messageForParalegalNAdmin, ``);
            // alert('2');
            return;

        }
        if (show == 'File' && action == 'Add' && !paralegalAttoryId.includes(stateObj?.roleId) && value?.folderCreatedByRoleId == '3') {
            setWarning("successfully", messageForParalegalNAdmin, ``);
            // alert('3');
            return;
        }
        if (show == 'File' && action == 'Add' && ((value?.folderFileCategoryId == categoryFileCabinet[0]) && (value?.folderCreatedByRoleId == 4 || value?.folderCreatedByRoleId == 11)) && !paralegalAttoryId?.includes(stateObj?.roleId)) {
            setWarning("successfully", messageForParalegalNAdmin, ``);
            // alert('4');
            return;
        }
        if (show == 'Folder' && value?.folderCreatedByRoleId == '9' && action == 'Add' && value?.createSubFolder == false) {
            setWarning("successfully", messageClientpermissions, ``);
            // alert('5');
            return;
        }
        if (show == 'Folder' && value?.folderCreatedByRoleId == '9' && action == 'Edit' && value?.editFolder == false) {
            setWarning("successfully", messageClientpermissions, ``);
            // alert('6');
            return;
        }
        if (show == 'File' && value?.folderCreatedByRoleId == '9' && action == 'Add' && value?.fileUpload == false) {
            setWarning("successfully", messageClientpermissions, ``);
            // alert('7');
            return;
        }
        if (show == 'File' && action == 'Edit' && paralegalAttoryId?.includes(stateObj.roleId) && value?.fileUploadedBy !== loggedUserId) {
            if (value.isEdit == false) {
                setWarning("successfully", messageClientpermissions, ``);
                // alert('8');
                return
            }
        }
        if (show == 'File' && action == 'Edit' && !paralegalAttoryId?.includes(stateObj.roleId) && value?.fileUploadedBy !== loggedUserId) {
            setWarning("successfully", messageForParalegalNAdmin, ``);
            // alert('9');
            return
        }

        if (show == 'Folder' && action == 'Add' && previousarray == '' && refrencePage == 'ManageAllFile' && manageFileType == 'Folder' && paralegalAttoryId.includes(stateObj.roleId)) {
            const filteredFolders = value?.folder?.filter((item) => item.createSubFolder == true)?.filter((item) => (item?.folderCreatedByRoleId != 4 && item?.folderCreatedByRoleId !== 11));
            if (isValidateNullUndefine(filteredFolders?.length)) {
                setWarning("successfully", "You do not have the permission to add folder within firm. Kindly contact client for permission.", ``);
                // toasterAlert("You do not have the permission to add folder within firm. Kindly contact client for permission.")
                return;
            }
        }
        // return ;
        topSchroll()
        setManageShowFileTypeFromManageFile('')
        setRefrencePage(refrencePage)
        setShowAddEditFolder(show)
        setActionType(action)
        setSelectFolderInfo(value)
        setManageShowFileType(manageFileType)
        setFileAddFrom(fileAddFrom)
        // konsole.log('showAddEdsdsditFolder', previousarray,fileAddFrom,action,value,manageFileType)
    }

    //  file view function--------------------------------------------------------------------------------------
    const viewFileFun = (item) => {
        // konsole.log('itemitemitemitemitem', item)
        // if (item?.fileUploadedBy !== loggedUserId) {
        //     toasterAlert('You don`t have the permission please contact your Legally entitled person for the changes.')
        //     return;
        // }
        // setShowAddEditFolder(show)
        setOpenFileInfo({ ...openFileInfo, ...item, requestedBy: loggedUserId })
        setIsFileOpen(true)
    }

    //  warning toaster-------------------------------------------------------------------------------------------------------------------------------------------------------
    // function toasterAlert(text) {
    //     setdata({ open: true, text: text, type: "Warning" });
    // }
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);

    }


    function topSchroll() {
        const element = document.getElementById('scrollToTopScreen');
        konsole.log('elementelement', element)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: "center", inline: "start" });
        }
    }
    const toggleCategoryCollapse = (categoryIndex) => {
        setcategoryOpenStates(prevStates => ({
            ...prevStates,
            [categoryIndex]: !prevStates[categoryIndex]
        }));
    };

    const funForFileCalculation = (allFileForMapping) => {

        let primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
        let spouseUserId = sessionStorage.getItem('spouseUserId')
        let primaryMemberALlFiles = (allFileForMapping?.length > 0) ? allFileForMapping?.filter(({ fileBelongsTo }) => fileBelongsTo == primaryMemberUserId) : []
        let spouseFileAll = (allFileForMapping?.length > 0) ? allFileForMapping?.filter(({ fileBelongsTo }) => fileBelongsTo == spouseUserId) : []

        function removeDuplicatesByKey(arr, key) {
            const uniqueMap = new Map();
            return arr.filter(item => {
                if (!uniqueMap.has(item[key])) { uniqueMap.set(item[key], true); return true; }
                return false;
            });
        }
        function findCommonObjects(arr1, arr2) {
            const commonObjects = arr1?.filter(obj1 => arr2.some(obj2 => obj2?.fileId == obj1?.fileId));
            return commonObjects;
        }
        function findObjectsNotInSecondArray(arr1, arr2) {
            const objectsNotInSecondArray = arr1?.filter(obj1 => !arr2.some(obj2 => obj2?.fileId == obj1?.fileId));
            return objectsNotInSecondArray;
        }

        let primaryMemberFile = primaryMemberALlFiles?.length > 0 ? removeDuplicatesByKey(primaryMemberALlFiles, 'fileId') : []
        let spouseFiles = spouseFileAll?.length > 0 ? removeDuplicatesByKey(spouseFileAll, 'fileId') : []
        let commonFile = findCommonObjects(primaryMemberFile, spouseFiles);
        let myprimaryFIle = primaryMemberFile
        if (commonFile.length > 0) {
            myprimaryFIle = primaryMemberFile?.filter(obj1 => !commonFile?.some(obj2 => obj1?.fileId == obj2?.fileId));
        }
        const spouseFile = findObjectsNotInSecondArray(spouseFiles, commonFile)
        konsole.log("primaryMemberFfffffffffffileprimaryMemberFile32", primaryMemberFile, commonFile)
        konsole.log("commonFilecommonFilecommonFile", commonFile)
        // konsole.log("nsdjcnzcxnczlknzxklnclkznnlk", primaryMemberFile, spouseFile, commonFile, myprimaryFIle)
        return { primaryMemberFile, spouseFile, commonFile, myprimaryFIle }
    }


    const toggleCollapseFile = (folderId, userId) => {
        // konsole.log("setFileCollapseOpensetFileCollapseOpen",folderId,userId)
        setFileCollapseOpen((prev) => {
            const isOpen = prev.some(entry => entry?.userId === userId && entry?.folderId === folderId);
            if (isOpen) {
                return prev.filter(entry => !(entry?.userId === userId && entry?.folderId === folderId));
            } else {
                return [...prev, { userId, folderId }];
            }
        });
    };

    const selectFolderId = (id) => {
        // konsole.log("idddddddd",id)
        setselectedClickfolderId(id);
        let getSelectedFolderFiles = allFileForMapping?.filter(({ folderId }) => folderId == id);
        if (getSelectedFolderFiles.length > 0) { setSelectedFolderFiles(getSelectedFolderFiles) }
        else { setSelectedFolderFiles([]) }
        setselectedClickSubfolderId(null)
        setselectedClickInnerSubfolderId(null)
        makeBrudCrum(id)
        setSelectedFolderIds(id)


        // setToatalFilesOfTheFolder(getSelectedFolderFiles)
        // konsole.log("selectFolderId",allFileForMapping,selectedClickfolderId,getSelectedFolderFiles)
    }

    const selectSubFolderId = (id) => {
        const clickedSubfolderIds = id
        setselectedClickSubfolderId(id)
        makeBrudCrum(id)

        // konsole.log("selecteweweweFolderId",selectedClickSubfolderId,allFolderList)
        const filterSubFolderofSelectedFolder = allFolderList?.filter((item) => {
            return item.parentFolderId == clickedSubfolderIds
        })
        if (filterSubFolderofSelectedFolder?.length > 0) {
            const folderListAccordingtoName = filterSubFolderofSelectedFolder?.sort((a, b) => a?.folderName.localeCompare(b?.folderName))?.sort((a, b) => {
                const labels = sortingFolderForCabinet
                const aIndex = labels?.indexOf(a?.folderName);
                const bIndex = labels?.indexOf(b?.folderName);
                return bIndex - aIndex;
            })
            // konsole.log("qeqeqwqwqww",folderListAccordingtoName)
            setselectedClickInnerSubfolderId(folderListAccordingtoName?.[0]?.folderId)
            let getSelectedFolderFiles = allFileForMapping?.filter(({ folderId }) => folderId == folderListAccordingtoName?.[0]?.folderId);
            // konsole.log("getsddsdsdsdSelectedFolderFiles1dsdsdsd21212",id,allFileForMapping,getSelectedFolderFiles,folderListAccordingtoName)
            if (getSelectedFolderFiles.length > 0) { setSelectedFolderFiles(getSelectedFolderFiles) }
            else { setSelectedFolderFiles([]) }
            setSelectedFolderIds(filterSubFolderofSelectedFolder[0].folderId)
        } else {
            let getSelectedFolderFiles = allFileForMapping?.filter(({ folderId }) => folderId == id);
            // konsole.log("getSelectedFolderFiles121212",id,getSelectedFolderFiles,allFileForMapping)
            if (getSelectedFolderFiles.length > 0) { setSelectedFolderFiles(getSelectedFolderFiles) }
            else { setSelectedFolderFiles([]) }
            setSelectedFolderIds(id)
            setselectedClickInnerSubfolderId(null);
        }
        // konsole.log("ssasasasasasasaassas",filterSubFolderofSelectedFolder)

    }
    const selectinnerSubFolderId = (id) => {
        // konsole.log("idddddddd",id)
        // konsole.log("selectinnerSubFolderId",id)
        setselectedClickInnerSubfolderId(id)
        // setselectedClickSubfolderId(null)
        // setselectedClickfolderId(null); 
        setSelectedFolderIds(id)
        // setSelectedFolderIds(id)
        let getSelectedFolderFiles = allFileForMapping?.filter(({ folderId }) => folderId == id);
        // konsole.log("getSelectedFolderFiles4444",id,getSelectedFolderFiles,allFileForMapping)
        if (getSelectedFolderFiles.length > 0) { setSelectedFolderFiles(getSelectedFolderFiles) }
        else { setSelectedFolderFiles([]) }
        // makeBrudCrum(id)
        // setToatalFilesOfTheFolder(getSelectedFolderFiles)
        // konsole.log("selectFolderId",allFileForMapping,selectedClickfolderId,getSelectedFolderFiles)
    }



    const makeBrudCrum = (folderId) => {
        const bredCrum = [];
        const filterDataByFolderID = allFolderList?.find(item => item?.folderId === folderId);

        if (!filterDataByFolderID) {
            konsole.log("Folder not found for folderId:", folderId);
            return bredCrum;
        }

        bredCrum.push(filterDataByFolderID?.folderName);

        if (filterDataByFolderID.parentFolderId !== 0) {
            const result = recursionBredCrum(filterDataByFolderID?.parentFolderId, allFolderList);
            bredCrum.unshift(...result);
            konsole.log("bredCrum", bredCrum);
            setFolderBredCrum(bredCrum)
        } else {
            setFolderBredCrum(bredCrum)
            konsole.log("bredCrum", bredCrum);
        }
    }


    // konsole.log("selectedClickfolderIdselectedClickfolderId",selectedClickfolderId)

    // konsole.log("foledffdsxc",allFolderList)

    function fileSharedToPeople(fileId) {
        // konsole.log('fileId',fileId)
        const sharedFileCount = sharedFileShatusList?.filter((item) => item?.fileId == fileId && item?.isRead == true)
        // konsole.log("sharedFileCount",sharedFileCount)
        return sharedFileCount?.length;
    }

    const getfolders = (folderIds) => {
        if (allFolderList.length > 0) {
            let getSelectedFoldersName = allFolderList?.filter((item) => {
                if (item?.parentFolderId == folderIds) { return item }
            })
            return (getSelectedFoldersName)
        }
    }

          
    const filesHtml = () => {

        let getSelectedFolderFiles = allFileForMapping?.filter((item) => item?.folderId == selectedFolderIds);
        // konsole.log("getSelectedFolderFilesgetSelectedFolderFiles", allFileForMapping, getSelectedFolderFiles,)
        if (paralegalAttoryId.includes(stateObj.roleId)) {
            //  File filter and mapping with match  folderId
            getSelectedFolderFiles = allFileForMapping?.filter((item) => (item?.folderId == selectedFolderIds && item.fileCategoryId == categoryFileCabinet[0] && item?.isRead == true) || (item?.folderId == selectedFolderIds && item.fileCategoryId != categoryFileCabinet[0]));


            // fileCategoryId
        }
        // konsole.log("firstgetSelectedFolderFilesgetSelectedFolderFilesbefore",getSelectedFolderFiles)
        if (selectedClickInnerSubfolderId !== null) {
            //  File filter and mapping with match  folderId
            getSelectedFolderFiles = allFileForMapping?.filter((item) => { return (item?.folderId == selectedClickInnerSubfolderId) })
            if (paralegalAttoryId.includes(stateObj.roleId)) {
                // getSelectedFolderFiles = allFileForMapping?.filter((item) => { return (item?.folderId == selectedClickInnerSubfolderId && item?.isRead == true) })
                getSelectedFolderFiles = allFileForMapping?.filter((item) => (item?.folderId == selectedClickInnerSubfolderId && item.fileCategoryId == categoryFileCabinet[0] && item?.isRead == true) || (item?.folderId == selectedClickInnerSubfolderId && item.fileCategoryId != categoryFileCabinet[0]));
            }
            // getSelectedFolderData = allFolderList?.filter(({ folderId }) => folderId == selectedClickInnerSubfolderId)
        }
        // konsole.log("forInntersubfoldergetSelectedFolderFilesgetSelectedFolderFilesbefore",getSelectedFolderFiles)
        if (searchFiles != "") { getSelectedFolderFiles = getSelectedFolderFiles?.filter(value => value?.userFileName?.toLowerCase()?.includes(searchFiles?.toLowerCase())) }
        const { primaryMemberFile, myprimaryFIle, spouseFile, commonFile } = funForFileCalculation(getSelectedFolderFiles)
        // konsole.log("dssdssdsdd",myprimaryFIle,spouseFile,commonFile)
        let combinedPrimaryAndJointFile = myprimaryFIle.concat(commonFile);
        let parentKey = renderingKey;

        // konsole.log("sdsdssdsdsd",combinedPrimaryAndJointFile)
        // {...(myprimaryFIle || []),...(commonFile || [])}
        let combinedSpouseAndJointFile = spouseFile.concat(commonFile)
        // {...(spouseFile || []),...(commonFile || [])}
        // konsole.log("combinedPrimaryAndJointFile",combinedPrimaryAndJointFile,"combinedSpouseAndJointFile",combinedSpouseAndJointFile,"myprimaryFIle",myprimaryFIle,"commonFile",commonFile)
        const totalNumberOfFiles = () => {
            let totalFilesCount = ((showPrimaryFiles)? myprimaryFIle?.length || 0:spouseFile?.length || 0 )+ (commonFile?.length || 0);
            // konsole.log("totalFilesCounttotalFilesCount",totalFilesCount)
            return totalFilesCount
        }

        let getSelectedFolderData2 = allContainerFolder && allContainerFolder?.length > 0 && allContainerFolder?.find((item) => { return item?.folderId == selectedFolderIds })
        const isAllowDocument = (!paralegalAttoryId.includes(stateObj.roleId) && getSelectedFolderData2?.folderCreatedByRoleId == '3') ? false : ((getSelectedFolderData2?.folderCreatedByRoleId == 4 || getSelectedFolderData2?.folderCreatedByRoleId == 11) && !paralegalAttoryId.includes(stateObj.roleId)) ? false : (getSelectedFolderData2?.folderCreatedByRoleId == '9' && getSelectedFolderData2?.fileUpload == false) ? false : true;
        // konsole.log("getSelectedFolderDatdsdsdda",getSelectedFolderData,getSelectedFolderData.folderCreatedByRoleId,getSelectedFolderData.fileUpload)
        konsole.log("getSelectedFolderData2", allContainerFolder, getSelectedFolderData2, isAllowDocument)


        const returnMessage = () => {
            if (selectedClickfolderId && selectedClickSubfolderId && selectedClickInnerSubfolderId) {
                if (totalNumberOfFiles() > 0) {
                    return ""
                } else {
                    return ""
                    // return "No files available"
                }
            }
            if (categoryTypeList.length > 0) {
                // konsole.log('categoryTypeListcategoryTypeList', categoryTypeList)
            }
            if (selectedClickfolderId && !selectedClickSubfolderId && categoryTypeList.length > 0) {
                const getSunFoldersLength = getfolders(selectedClickfolderId)
                // konsole.log("getSunFoldersLength",getSunFoldersLength)
                // let msg = categoryTypeList[0].fileCategoryId == categoryFileCabinet[0] ? "Please add a subfolder using the 'New Folder' button." : "No files available";
                // konsole.log("ssssssssssssssss",categoryTypeList?.[0]?.fileCategoryId , "-----",categoryFileCabinet?.[0],"---",categoryTypeList?.[0]?.fileCategoryId == categoryFileCabinet?.[0])
                let msg = categoryTypeList?.[0]?.fileCategoryId == categoryFileCabinet?.[0] ? "Please add a subfolder using the 'New Folder' button." : "";
                if (getSunFoldersLength.length > 0) {
                    return "Please select a subfolder to view or upload a file"
                } else {
                    // return "Please add a subfolder using the 'New Folder' button."
                    return msg;
                }
            }
            if (selectedClickfolderId && selectedClickSubfolderId) {
                const getSunFoldersLength = getfolders(selectedClickSubfolderId)
                // konsole.log("getSunFoldersLength",getSunFoldersLength)
                if (getSunFoldersLength.length > 0) {
                    // const getSunFoldersLength=getfolders(selectedClickInnerSubfolderId)
                    if (selectedClickInnerSubfolderId) {
                        if (totalNumberOfFiles() > 0) {
                            return ""
                        } else {
                            // return "No files available"
                            return ""
                        }
                    } else {
                        return "Select any inner Status to view files"
                    }
                } else {
                    if (totalNumberOfFiles() > 0) {
                        return ""
                    } else {
                        // return "No files available"
                         return ""
                    }
                }
            }
            if (!selectedClickfolderId && !selectedClickSubfolderId && !selectedClickInnerSubfolderId) {
                return "Please select a firm folder"
            }
        }

        // konsole.log("fdfddfdfdfd",selectedClickfolderId,selectedClickSubfolderId,selectedClickInnerSubfolderId,gettotalSubFolders,selectedFolderIds,returnMessage(),totalNumberOfFiles())
        // konsole.log("myprimaryFIlemyprimaryFIle",spouseFile,myprimaryFIle)
        // konsole.log("returnMessage",returnMessage())
        const getSignOffAndUploadedDate = (date) => {
            if (date) {
                let getSplittedDate = date?.split("T")[0]
                getSplittedDate = getSplittedDate?.split("-");
                const formattedDate = `${getSplittedDate[1]}-${getSplittedDate[2]}-${getSplittedDate[0]}`;
                return formattedDate;
            }
        }

        const notAnArchiveFolder=()=>{

            // konsole.log("selectedClickInnerSubfolderId",selectedClickInnerSubfolderId)
            const deepCopyOfAllFilesList=JSON.parse(JSON.stringify(allFolderList))
            const findClickedSubfolderName=deepCopyOfAllFilesList?.find((data)=>data?.folderId==selectedClickInnerSubfolderId)
            // konsole.log("findClickedSubfolderName",findClickedSubfolderName)
            let checkForTrueFalse=(findClickedSubfolderName?.folderName=="Archived" && findClickedSubfolderName?.parentFolderId!==0)
            return checkForTrueFalse !== undefined ? !checkForTrueFalse : true;
        }

        const shareFilefun=(item,actionTypeClicked)=>{
            functionForGetFileAfterAddEditFile()
            setOpenShareDocument(true)
            setDisableConfirmButton(false)
            setSelectFolderInfo(item)
            setActionType(actionTypeClicked)
        }

        const moveFileFun=async(item,actionTypeClicked,fileData)=>{
            const updateJson={fileCabinetId:item?.fileCabinetId ,fileStatusId:(fileData?.folderName=="Draft")?1:(fileData?.folderName=="Current")?2:3,updatedBy:loggedUserId,folderId: fileData?.folderId,userId:item.primaryUserId,fileId: item?.fileId}
        //    console.log("item",item,"fileData",fileData)
            let noteMessage=""
            if((item?.fileStatusName=="Archived" && fileData?.folderName=="Current") || (item?.fileStatusName=="Draft" && fileData?.folderName=="Current")){
                    noteMessage ="*Note: If same type of file exists in the current folder, it will be moved to the archive"
            }
            const confirmRes = await newConfirm(true, noteMessage, "Permission", "Are you sure? ", 0);
            if (!confirmRes) return;
            dispatchloader(true)
            const _resultUpdateData = await postApiCall("POST",$Service_Url.postFileFolderUpdate, updateJson);
            if (_resultUpdateData !== 'err') {
                toasterAlert("successfully","File moved successfully")
                functionForGetFileAfterAddEditFile()
                dispatchloader(false)
            }else{
                functionForGetFileAfterAddEditFile()
                dispatchloader(false)
            }

        }

        const getInnerSunfolderList=()=>{
            const filterSubFolderofSelectedFolder = allFolderList?.filter((item) => {
                return (item?.parentFolderId == selectedClickSubfolderId && item?.folderId!==selectedClickInnerSubfolderId)
            })
            // konsole.log("32folderBr555555edCrumfolderBredCrum", selectedClickfolderId, selectedClickSubfolderId, selectedClickInnerSubfolderId)
            // console.log("12filterSubFolderofSelectedFolder",filterSubFolderofSelectedFolder)
            return filterSubFolderofSelectedFolder || []
        }

        

        const shareDocumentFun=()=>{
            dispatchloader(true)
            setDisableConfirmButton(true)
            let FileBelongsTo=(showPrimaryFiles == true) ? primaryMemberUserId : spouseUserId
            apiCallUpsertShareFileStatus(fileId, FileBelongsTo)
        }

        const apiCallUpsertShareFileStatus = (fileId, fileBelongsTo) => {
            // konsole.log('belongsTobelongsTobelongsTo', fileBelongsTo, fileId)
            // konsole.log('newArrnewArr', newArr)
            // konsole.log('jsonObjForShareStatus', newArr, JSON.stringify(newArr))
            let newArr = jsonObjForShareStatus?.map((obj) => ({ ...obj, 'fileId': fileId, 'belongsTo': fileBelongsTo, 'createdBy': (obj?.sharedFileId == 0) ? loggedUserId : obj?.createdBy, 'updatedBy': (obj?.sharedFileId == 0) ? obj?.updatedBy : loggedUserId }));
            let myNewArray = newArr.filter((item) => item?.sharedFileId !== 0 || item?.isRead === true || item?.isEdit == true || item?.isDelete === true);
            myNewArray=myNewArray?.filter((data1)=>{
                return (data1?.roleId==undefined)
            })
            // console.log("myNewArraymyNewArray",myNewArray,jsonObjForShareStatus)
            if(myNewArray?.length==0){
                    AlertToaster.error('Kindly select a family member')
                    setDisableConfirmButton(false)
                    dispatchloader(false);
                    return
            }
            Services.upsertShareFileStatus(myNewArray).then((res) => {
                AlertToaster.success('Permissions updated successfully')
                setOpenShareDocument(false)
                setSearchedFamilyMemeberValue("")
                functionForGetFileAfterAddEditFile()
               
            }).catch((err) => {            
                // konsole.log('err in upsert sharefile', err)
                setOpenShareDocument(false)
                setSearchedFamilyMemeberValue("")
                functionForGetFileAfterAddEditFile()
            })
            dispatchloader(false);   
        }

        const checkCheckedForShare=(data,id, userId)=>{
            // konsole.log("checkCheckedForShareParent",data,"isRead",data,id, userId)
            // konsole.log("sjsonObjForShareStatusddddddddd",jsonObjForShareStatus,"jsonObjForShareStatus[9]",jsonObjForShareStatus[9],"datadata",data.userId)
            // console.log("dssssssssssss",jsonObjForShareStatus?.length > 0 && jsonObjForShareStatus?.some((item) => item?.sharedUserId == data.userId && item["isRead"] == true))
            return jsonObjForShareStatus?.length > 0 && jsonObjForShareStatus?.some((item) => {
                return item?.sharedUserId == data.userId  && item["isRead"] == true
            })
        }

        const mappingCheckBoxValue = (e, sharedUserId, typeOfUser) => {
            let { checked } = e?.target;
            let id="isRead"
            konsole.log("mappingCheckBoxValueParentCabinet",id, checked, sharedUserId, typeOfUser)
              let findIndexExistsValue = jsonObjForShareStatus?.length > 0 ? jsonObjForShareStatus?.findIndex((item) => item?.sharedUserId == sharedUserId) : '-1'
            //   konsole.log("findIndexExistsValueFOlderStu",findIndexExistsValue)

              if (findIndexExistsValue == '-1') {
                const newObj = cretaeJsonForFilePermission({ 
                    belongsTo:((showPrimaryFiles == true) ? primaryMemberUserId : spouseUserId),
                    primaryUserId: primaryMemberUserId, 
                    sharedUserId, 
                    [id]: checked, 
                    ...manageCreate, 
                    ...manageUpdate,
                    fileId,

                 })
                if (id == 'isEdit' || id == 'isDelete') {
                    newObj['isRead'] = true
                }
                // konsole.log('newObjnewObj', newObj)
                if (jsonObjForShareStatus !== false) {
                    setJsonObjForShareStatus(prevState => [...prevState, newObj]);
                } else {
                    setJsonObjForShareStatus([{ ...newObj }]);
                }
            } else {
                setJsonObjForShareStatus((prev) => {
                    let newArray = [...prev]
                    newArray[findIndexExistsValue][id] = checked
                    // newArray[findIndexExistsValue]['isRead'] = newArray?.filter((item) => item?.sharedUserId == sharedUserId)?.some(({ isRead, isEdit, isDelete }) => isRead || isEdit || isDelete)
                    return newArray
                });
            }
    }

    const filterFamilyMemebers=(event)=>{
        const eventValue=event?.target?.value;
        setSearchedFamilyMemeberValue(eventValue)
        // konsole.log("searchedFamilyMemeberValue",searchedFamilyMemeberValue,"familyMembersList",familyMembersList)
    }

    function hideOpenShareDocument()
    {
        setOpenShareDocument(false)
        setSearchedFamilyMemeberValue("")
    }

    function checkeIfAllBoxesAreChecked(){
        const filterParalegals=jsonObjForShareStatus?.filter((data1)=>{
            return (data1?.roleId==undefined)
        })
        // console.log("filterParalegals",filterParalegals,"familyMembersList",familyMembersList)
        let checkIfAllFamilyMemberSharedPermission=familyMembersListForCabinet?.every((data1)=>{
            return filterParalegals?.find((data2)=>{   
                return data1?.userId==data2?.sharedUserId
            })
        })
        // console.log("checkIfAllFamilyMemberSharedPermission",checkIfAllFamilyMemberSharedPermission)
        if(filterParalegals?.length>0){
            if(familyMembersListForCabinet?.length>0 && (!checkIfAllFamilyMemberSharedPermission)){
                return false
            }
            let checkForTrueFalse=filterParalegals?.every((data)=>{
                return data["isRead"]==true
            })
        // console.log("checkForTrueFalse",checkForTrueFalse)
        return checkForTrueFalse
        }
        return false
    }

    function onChangeAllcheckboxesAtOnce(event)
    {
        // console.log("onChangeAllcheckboxesAtOnce",event,event.target.checked)
        let { checked } = event?.target;
        // console.log("familyMembersList",familyMembersList)
        familyMembersListForCabinet?.map((data)=>{
            mappingCheckBoxValue(event,data?.userId)
        })
    }

    

    // console.log("jsonObjForShareStatus",jsonObjForShareStatus)
        const FilesTable = (primaryFileList) => {
            // konsole.log("primaryFileListprimaryFileList",primaryFileList)
            const checkForLegalCabinet=primaryFileList?.length>0 && primaryFileList.every(({fileCategoryId})=>fileCategoryId==6)
            return (
                <>
                <div className="fileCAbinetTableHeight">
                <table className='w-100 p-3 filesTable'>
                    <tr className='filesTableHeading'>
                        <th>File name</th>
                        {checkForLegalCabinet && 
                        <>
                            <th className="text-center">Type</th>
                            <th className="text-center">Sign-off</th>
                            </>
                        }
                        <th className="text-center">Updated</th>
                        {/* <th>Shared</th> */}
                        <th className={`${checkForLegalCabinet?"text-center":"text-end px-5"}`}>View</th>
                    </tr>

                    {primaryFileList && primaryFileList?.map((item, index) => {
                        let { fileId, primaryUserId, fileCabinetId, fileCategoryId, fileTypeId, fileUploadedBy, isDelete, dateFinalized, isEdit } = item
                        const isJoint = commonFile?.some(obj => obj?.fileId == fileId);
                        // const isDeleteFileAllow = (paralegalAttoryId?.includes(stateObj?.roleId) && !(fileUploadedBy == loggedUserId || isDelete == true)) ? false : (!paralegalAttoryId?.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) ? false : true;
                        // const isEditFileAllow = (paralegalAttoryId?.includes(stateObj?.roleId) && !(fileUploadedBy == loggedUserId || isEdit == true)) ? false : (!paralegalAttoryId?.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) ? false : true;
                        const isDeleteFileAllow = 
                        (paralegalAttoryId?.includes(stateObj?.roleId) && ((fileUploadedBy != primaryUserId) || (isDelete == true))) ? true : (!paralegalAttoryId?.includes(stateObj?.roleId) && fileUploadedBy == loggedUserId) ? true 
                        :(stateObj?.roleId==13)?true:false; // allow attorney to directly delete file without checking from any other id
                        const isEditFileAllow = (paralegalAttoryId?.includes(stateObj?.roleId) && (fileUploadedBy != primaryUserId) || (isEdit == true)) ? true : (!paralegalAttoryId?.includes(stateObj?.roleId) && fileUploadedBy == loggedUserId) ? true : false;
                        // const isEditFileAllow = (paralegalAttoryId?.includes(stateObj?.roleId) && !(fileUploadedBy == loggedUserId || isEdit == true)) ? false : (!paralegalAttoryId?.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) ? false : true;
                        // const isEditFileAllow = (paralegalAttoryId?.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) ? false : (!paralegalAttoryId?.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) ? false : true;
                        konsole.log("isEditFileAllowisEdit", !(fileUploadedBy == loggedUserId || isEdit == true), isEdit,)
                        return (
                            <>
                              <tr className={`${(checkForLegalCabinet?"filesTableMainDivWidth20":"filesTableMainDivWidth33")}`}> 
                                <td className='cursor-pointer'> {/*File name*/}
                                    <OverlayTrigger placement="top" overlay={<Tooltip id="folder-tooltip">{item?.userFileName}</Tooltip>}>
                                        <p onClick={() => viewFileFun(item)} className=' fileDocumentTypeText text-truncate cursor-pointer first' style={{ width: "90%" }}><img src="/icons/pdfFileImage.svg" className="pdfOrDocImage mt-0"></img>{item?.userFileName}</p>
                                    </OverlayTrigger>
                                </td>
                               
                                {checkForLegalCabinet &&  
                                <>
                                     <td className='cursor-pointer'>{/*File Type*/}
                                    <OverlayTrigger placement="top" overlay={<Tooltip id="folder-tooltip">{item?.fileTypeName}</Tooltip>}>
                                        <p onClick={() => viewFileFun(item)} className='fileDocumentTypeText text-truncate text-center cursor-pointer' style={{ width: "100%" }}>
                                            {/* {item?.fileTypeName} */}
                                            {/* {konsole.log("swdbhkdsbvk", item?.updatedOn ?? (parentKey + index))} */}
                                            <OtherInfo 
                                                key={item?.updatedOn ?? (parentKey + index)}
                                                othersCategoryId={31} 
                                                othersMapNatureId={item?.fileId} 
                                                FieldName={item?.fileTypeName}
                                                userId={primaryMemberUserId}
                                            />
                                        </p>
                                    </OverlayTrigger>
                                     {/*Sign off*/}
                                </td>
                                <td className='cursor-pointer'>
                                        <p onClick={() => viewFileFun(item)} className='fileDocumentTypeText text-center' style={{ width: "100%" }}  >{item?.dateFinalized ? getSignOffAndUploadedDate(item?.dateFinalized) : "Not Mentioned* "}</p>
                                </td>
                                </>                                   
                                }                            
                                <td className='cursor-pointer'>{/*Updated*/}
                                    <p onClick={() => viewFileFun(item)} className='fileDocumentTypeText text-center' style={{ width: "100%" }} >{item?.uploadedOn ? getSignOffAndUploadedDate(item?.uploadedOn) : "Not Mentioned "}</p>
                                </td>
                                {/* <td className='cursor-pointer'>
                                    <p onClick={() => viewFileFun(item)} style={{ width: "60px" }}><img src="/icons/filesSharedIcon.svg" className='mt-0 filesSharedIconSize' ></img>{fileSharedToPeople(item?.fileId)}</p>
                                </td> */}
                                <td>{/*Shared*/}
                                    {
                                        <Dropdown className={`cabinetOptionsList d-flex ${(checkForLegalCabinet)?"justify-content-center":"justify-content-end px-5"}`}>
                                            <Dropdown.Toggle id="DropdownForFiles" variant="secondary">
                                                <img src="/icons/vertical-triple-Dots.svg"></img>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item className='border-bottom' onClick={() => viewFileFun(item)}><span className=' cursor-pointer'><img src="/icons/viewFileicon.svg"></img>View</span> </Dropdown.Item>
                                                <Dropdown.Item className='border-bottom' onClick={() => shareFilefun(item,"Share")}><span className=' cursor-pointer'><img src="/icons/ShareFileCabinet.svg"></img>  Share</span></Dropdown.Item>
                                                {((stateObj?.roleId==13) || (stateObj?.roleId==3)) && getInnerSunfolderList()?.map((data)=>
                                                   {return (<Dropdown.Item className='border-bottom' onClick={() => moveFileFun(item,"MoveTo",data)}><span className=' cursor-pointer'><img src="/icons/move_File_svg.svg"></img>{`Move to ${data?.folderName}`} </span></Dropdown.Item>)}
                                                )} {/* Show move to options only to Attorney and Paralegal*/}
                                                {(isEditFileAllow) && <Dropdown.Item className='border-bottom' onClick={() => handleAddEditFolder('File', 'Edit', item, " ", 'ManageAllFile', 'Folder', 'Folder')}><span className=' cursor-pointer'><img src="/icons/editIcon.svg"></img> Edit</span></Dropdown.Item>}
                                                {(isDeleteFileAllow) && <Dropdown.Item className='border-bottom' onClick={() => deleteFilefun(item)}><span className=' cursor-pointer'><img src="/icons/reddeleteIcon.svg"></img>  Delete</span></Dropdown.Item>}
                                            </Dropdown.Menu>
                                        </Dropdown> 
                                    }
                                </td>
                              </tr>
                            </>                        
                        )
                    })
                    }

                </table>
                </div>  
                {notAnArchiveFolder() &&  <div className={`a fileUploadDragDropFuncForFolders FullWidthForUploadFile cursor-pointer`}   onClick={() => { AddNewFile() }}>
                    <div className={`row justify-content-end`} >
                        <div className="p-0 m-0 col-7 fileUploadContentSection mt-2">
                            <div class="row">
                                <div class="col-1 d-flex m-0 p-0"> <img src={`/icons/uploadIconFileCabinet.svg`} className="d-block m-auto uploadIconFileCabinetCss"/></div>
                                <div class="col m-0 d-flex flex-column align-items-start">
                                     <p><span>Click to upload your file</span></p>
                                     <p>PDF file (Max 100mb each)</p></div>
                            </div>
                        </div>
                        <div className="p-0 col-2 uploadButtonWithHandCssCol d-flex justify-content-end align-items-end">
                            <img src="/icons/pdfFileIconNewFileCabinet.svg" className=""/>
                        </div>                      
                    </div>
                    </div>
                }   

                        {
                            openShareDocument &&                               
                                 <ShareDocumentModal
                                  mappingValues={familyMembersListForCabinet}
                                  familyMembersListForCabinet={familyMembersListForCabinet} 
                                  filterFamilyMemebers={filterFamilyMemebers}
                                  hideOpenShareDocument={hideOpenShareDocument}
                                  openShareDocument={openShareDocument}
                                  searchedFamilyMemeberValue={searchedFamilyMemeberValue}
                                  disableConfirmButton={disableConfirmButton}
                                  shareDocumentFun={shareDocumentFun}
                                  checkCheckedForShare={checkCheckedForShare}
                                  mappingCheckBoxValue={mappingCheckBoxValue}
                                  closeCabinetShareModal={closeCabinetShareModal}
                                  shareWithModal={shareWithModal}
                                  setSearchedFamilyMemeberValue={setSearchedFamilyMemeberValue}
                                  checkeIfAllBoxesAreChecked={checkeIfAllBoxesAreChecked}
                                  onChangeAllcheckboxesAtOnce={onChangeAllcheckboxesAtOnce}
                                  />
                          }
          
                </>
               
            )
        }

        
        const functionToCheckForInnerFolder = () => {

            // if(!selectedFolderIds){return []}
            const selectedFolderIds = (selectedClickfolderId && !selectedClickSubfolderId) ? selectedClickfolderId : (selectedClickSubfolderId && !selectedClickInnerSubfolderId) ? selectedClickSubfolderId : selectedClickInnerSubfolderId
            // const [selectedClickfolderId,setselectedClickfolderId]=useState(null)
            // const [selectedClickSubfolderId,setselectedClickSubfolderId]=useState(null)
            // const [selectedClickInnerSubfolderId,setselectedClickInnerSubfolderId]=useState(null)
            // const[selectedFolderIds,setSelectedFolderIds]=useState(null)
            const filterFoldersViaClickedFolderId = allFolderList.filter((item) => {
                return item.parentFolderId == selectedFolderIds
            })
            return (filterFoldersViaClickedFolderId)
            // return []
        }
        return (
            <>
                {/* Folder Name  */}
                <div className='manageFolderStyleBordeForFile row minWidthOfRightAreaOfFileCabinetFilder'>
                    <div className='col m-0 p-0'>
                        <ol class="breadcrumb pathOfFileInFileCabinet mb-1 mt-2 ">
                            {(!selectedClickfolderId && !selectedClickSubfolderId && !selectedClickInnerSubfolderId) ?
                                <></>
                                :
                                <>
                                    {folderBredCrum.map((item, index) =>
                                        <li className={`breadcrumb-item d-flex p-0 ${(folderBredCrum.length == (index + 1)) ? "active" : ""}`} ><a href="#">{item}</a></li>
                                    )}
                                </>
                            }
                        </ol>
                    </div>                  
                    <div className='col m-0 p-0 d-flex justify-content-end align-items-center'>
                                <div className={`${(!(getMaritalStatusId == 1 || getMaritalStatusId == 2 )) ? "changePrimaryButtonStyle" : "changePsrimaryOrSpuseFile"}`}>
                                    <OverlayTrigger placement="top" overlay={<Tooltip id="folder-tooltip">{_userDetailOfPrimary && _userDetailOfPrimary?.memberName?.toUpperCase()}</Tooltip>}>
                                        <button className={`${showPrimaryFiles ? "fileFilterButtonSelected" : "fileFilterButtonNotSelected"} `} id="primaryFileListShow" onClick={ShowFolderFilesList}>{_userDetailOfPrimary && $AHelperNew.capitalizeFirstLetterFirstWord(_userDetailOfPrimary?.memberName)}</button>
                                    </OverlayTrigger>
                                    {(getMaritalStatusId == 1 || getMaritalStatusId == 2 ) && <OverlayTrigger placement="top" overlay={<Tooltip id="folder-tooltip">{_userDetailOfPrimary && _userDetailOfPrimary?.spouseName?.toUpperCase()}</Tooltip>}>
                                        <button className={`${!showPrimaryFiles ? "fileFilterButtonSelected" : "fileFilterButtonNotSelected"} `} id="SpouseFileListShow" onClick={ShowFolderFilesList}>{_userDetailOfPrimary && $AHelperNew.capitalizeFirstLetterFirstWord(_userDetailOfPrimary?.spouseName)}</button>
                                    </OverlayTrigger>
                                    }
                                </div>
                                {/* {
                            (isAllowDocument && selectedFolderIds && functionToCheckForInnerFolder()?.length == 0 && ((selectedClickSubfolderId && categoryTypeList.length > 0 && categoryTypeList[0].fileCategoryId == 6)) || (categoryTypeList.length > 0 && categoryTypeList[0].fileCategoryId != 6)) && <button
                                className="addNewFileButton"
                                onClick={() => { AddNewFile() }}
                            >
                                <img src="/icons/addFileNewFileCabinetIcon.svg" />
                                <span>Upload file</span>
                            </button>
                        } */}
                    </div>
                </div>

                {innerSubFolderOnly()}

                {
                    ((selectedClickfolderId!==null  && categoryTypeList.length > 0 && categoryTypeList[0].fileCategoryId != 6)  || ((selectedClickSubfolderId != null && categoryTypeList.length > 0 && categoryTypeList[0].fileCategoryId == 6) )) && showPrimaryFiles &&
                    <>
                        <h2 className='filesHeading a '> Files ({combinedPrimaryAndJointFile?.length})</h2>
                        {combinedPrimaryAndJointFile?.length > 0 &&
                            <>
                                {FilesTable(combinedPrimaryAndJointFile)}
                            </>

                        }

                    </>

                }

                {
                    ((selectedClickfolderId!==null  && categoryTypeList.length > 0 && categoryTypeList[0].fileCategoryId != 6)  ||  ((selectedClickSubfolderId != null && categoryTypeList.length > 0 && categoryTypeList[0].fileCategoryId == 6) )) && !showPrimaryFiles &&
                    <>
                        <h2 className='filesHeading b'> Files ({combinedSpouseAndJointFile?.length})</h2>
                        {combinedSpouseAndJointFile?.length > 0 &&
                            <>
                                {FilesTable(combinedSpouseAndJointFile)}
                            </>
                        }
                    </>

                }
                {totalNumberOfFiles() == 0 && <div className='divForNoFilesSearched a'>
                    <div className='row justify-content-center'>
                        {returnMessage()!="" &&<img src="/icons/emptyFilesImage.svg" className='d-block m-auto'></img>}
                        {!notAnArchiveFolder() &&  
                            <div>
                                <img src="/icons/emptyFilesImage.svg" className='d-block m-auto'></img>
                                <p className='text-center'>Can't upload any file in Archive folder</p>
                            </div>
                        }                  
                        <p className=' text-center'> {returnMessage()} 
                            {(isAllowDocument && selectedFolderIds && functionToCheckForInnerFolder()?.length == 0 &&
                             ((selectedFolderIds && selectedClickSubfolderId && categoryTypeList?.length > 0 && categoryTypeList?.[0]?.fileCategoryId == 6)) 
                            || (categoryTypeList?.length > 0 && categoryTypeList?.[0]?.fileCategoryId != 6 && selectedFolderIds) )
                             && notAnArchiveFolder() &&
                            <>


                            {/* <button
                                className="addNewFileButton w-25" onClick={() => { AddNewFile() }}>
                                <img src="/icons/addFileNewFileCabinetIcon.svg" />
                                <span>Upload file</span>
                            </button> */}
                            <div>
                                <div className={`b fileUploadDragDropFuncForFolders cursor-pointer`}  onClick={() => { AddNewFile() }}>
                                        <div className={`row justify-content-end`} >
                                            <div className="p-0 m-0 col-12">
                                                <img src={`/icons/uploadIconFileCabinet.svg`} className="d-block m-auto uploadIconFileCabinetCss"/>
                                            </div>
                                            <div className="p-0 m-0 col-9 fileUploadContentSection mt-2">
                                                <p><span>Click to upload your file</span> </p>
                                                <p>PDF file (Max 100mb each)</p>
                                            </div>
                                            <div className="p-0 col-2 uploadButtonWithHandCssCol d-flex justify-content-end">
                                                <img src="/icons/pdfFileIconNewFileCabinet.svg" className="uploadButtonWithHandCss"/>
                                            </div> 
                                            
                                        </div>
                                </div>
                            </div>
                            
                            </>
                        }</p>
                         <div>
                        </div>
                    </div>
                </div>
                }
            </>
        )
    }

    const SearchedfilesHtml = () => {
        const getSearchedFileByNameAll = allFileForMapping;
        const getSearchedFileByNameOnly = allFileForMapping.filter((value) => { return value?.userFileName?.toLowerCase()?.includes(searchFolder?.toLowerCase()) })
        // konsole.log("dsdsddsddsdsxx",searchFolder)
        // konsole.log("getSearchedFileByName",getSearchedFileByNameAll)
        // konsole.log("getSearchedFileByNameOnly",getSearchedFileByNameOnly);
        let uniueObjectMap = {};
        const uniqueFileIds = new Set()
        getSearchedFileByNameOnly.forEach((data) => {
            if (!uniqueFileIds.has(data.fileId)) {
                uniqueFileIds.add(data.fileId);
                uniueObjectMap[data.fileId] = data
            }
        })
        uniueObjectMap = Object.values(uniueObjectMap)
        const filterPrimaryFiles = uniueObjectMap && uniueObjectMap.length > 0 && uniueObjectMap?.filter(({ fileBelongsTo }) => fileBelongsTo == primaryMemberUserId)
        const filterSpouseFiles = uniueObjectMap && uniueObjectMap.length > 0 && uniueObjectMap?.filter(({ fileBelongsTo }) => fileBelongsTo == spouseUserId)
        uniueObjectMap = showPrimaryFiles ? filterPrimaryFiles : filterSpouseFiles
        // konsole.log("uniueObjectMap",uniueObjectMap)
        // searched Files

        const getSignOffAndUploadedDate = (date) => {
            if (date) {
                let getSplittedDate = date?.split("T")[0]
                getSplittedDate = getSplittedDate?.split("-");
                const formattedDate = `${getSplittedDate[1]}-${getSplittedDate[2]}-${getSplittedDate[0]}`;
                return formattedDate;
            }
        }

        return (
            <table className='w-100 p-3 filesTable'>
                <tr className='filesTableHeading'>
                    <th>File name</th>
                    <th>Type</th>
                    <th>Sign-off</th>
                    <th>Updated</th>
                    <th>Shared</th>
                    <th>View</th>
                </tr>

                {uniueObjectMap && uniueObjectMap?.map((item) => {
                    let { folderId, fileId, primaryUserId, fileCabinetId, fileCategoryId, fileTypeId, fileUploadedBy, isDelete, dateFinalized, isEdit } = item
                    const isDeleteFileAllow = (paralegalAttoryId?.includes(stateObj?.roleId) && !(fileUploadedBy == loggedUserId || isDelete == true)) ? false : (!paralegalAttoryId?.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) ? false : true;
                    const isEditFileAllow = (paralegalAttoryId?.includes(stateObj?.roleId) && !(fileUploadedBy == loggedUserId || isEdit == true)) ? false : (!paralegalAttoryId?.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) ? false : true;
                    const getPath = () => {
                        const path = [];
                        const findParentFolder = (folderId) => {
                            const folder = allFolderList.find(item => item.folderId === folderId);
                            if (folder) {
                                path.unshift(folder?.folderName); // Add the folder name to the path
                                if (folder.parentFolderId) {
                                    findParentFolder(folder?.parentFolderId); // Recursively find the parent
                                }
                            }
                        };

                        findParentFolder(item?.folderId); // Start from the current folder
                        // konsole.log("pathhhhhh", path);
                        return path;
                    };

                    const pathValue = getPath().join(" > ");
                    // konsole.log("getPath", pathValue);
                    // konsole.log("itemssasass",item,folderId)
                    return (
                        <tr>
                            <td className='cursor-pointer d-flex'>
                                <img src="/icons/pdfFileImage.svg" className="pdfOrDocImage"></img>
                                <div className='row flex-column'>
                                    <div className='col'>
                                        <OverlayTrigger placement="top" overlay={<Tooltip id="folder-tooltip">{item?.userFileName}</Tooltip>}>
                                            <p onClick={() => viewFileFun(item)} className=' fileDocumentTypeText text-truncate cursor-pointer' style={{ width: "90%" }}>{item?.userFileName}</p>
                                        </OverlayTrigger>
                                    </div>
                                    <div className='col'>
                                        <p><b>File path:</b> {pathValue}</p>
                                    </div>                                    
                                </div>

                            </td>
                            <td className='cursor-pointer'>{/*File Type*/}
                                <OverlayTrigger placement="top" overlay={<Tooltip id="folder-tooltip">{item?.fileTypeName}</Tooltip>}>
                                    <p onClick={() => viewFileFun(item)}
                                        className='fileDocumentTypeText text-truncate cursor-pointer' style={{ width: "90%" }}>{item?.fileTypeName}</p>
                                </OverlayTrigger>
                            </td>
                            <td className='cursor-pointer'>{/*Sign off*/}
                                <p onClick={() => viewFileFun(item)}
                                    className='fileDocumentTypeText' style={{ width: "100px" }} >{item?.dateFinalized ? getSignOffAndUploadedDate(item?.dateFinalized) : "Not Mentioned* "}</p>
                            </td>
                            <td className='cursor-pointer'>{/*Updated*/}
                                <p onClick={() => viewFileFun(item)}
                                    className='fileDocumentTypeText' style={{ width: "100px" }}>{item?.uploadedOn ? getSignOffAndUploadedDate(item?.uploadedOn) : "Not Mentioned "}</p>
                            </td>
                            <td className='cursor-pointer'>{/*Shared*/}
                                <p onClick={() => viewFileFun(item)}
                                    style={{ width: "60px" }}><img src="/icons/filesSharedIcon.svg" className='mt-0 filesSharedIconSize' ></img>{fileSharedToPeople(item?.fileId)}</p>
                            </td>
                            <td>{/*Shared*/}
                                {
                                    (isDeleteFileAllow == true || isEditFileAllow == true) ?
                                        <Dropdown className='cabinetOptionsList d-flex justify-content-start'>
                                            <Dropdown.Toggle id="DropdownForFiles" variant="secondary">
                                                <img src="/icons/vertical-triple-Dots.svg"></img>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item className='border-bottom' onClick={() => viewFileFun(item)}><span className=' cursor-pointer'><img src="/icons/viewFileicon.svg"></img>  View</span> </Dropdown.Item>
                                                {(isEditFileAllow) && <Dropdown.Item className='border-bottom' onClick={() => handleAddEditFolder('File', 'Edit', item, " ", 'ManageAllFile', 'Folder', 'Folder')}><span className=' cursor-pointer'><img src="/icons/editIcon.svg"></img> Edit</span></Dropdown.Item>}
                                                {(isDeleteFileAllow) && <Dropdown.Item className='border-bottom' onClick={() => deleteFilefun(item)}><span className=' cursor-pointer'><img src="/icons/reddeleteIcon.svg"></img>  Delete</span></Dropdown.Item>}
                                            </Dropdown.Menu>
                                        </Dropdown> :
                                        <p className='fileDocumentTypeText text-truncate' style={{ width: "" }}> <img src="/icons/filesViewIcon.svg" className='viewFileImage' onClick={() => viewFileFun(item)} /></p>

                                }

                            </td>
                        </tr>
                    )
                })
                }



            </table>
        )
    }



    //  konsole--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    konsole.log('showAddEditFoldershowAddEditFolder', showAddEditFolder)
    konsole.log('categoryTypeListcategoryTypeList', categoryTypeList)
    konsole.log('newCategoryTypeListnewCategoryTypeList', newCategoryTypeList)
    konsole.log('selectFolderInfo', selectFolderInfo)
    konsole.log('sharedFileShatusListsharedFileShatusList', sharedFileShatusList)
    konsole.log('roleIdroleIdroleId', stateObj.roleId)
    // konsole.log("selectedFolderFilesselectedFolderFiles",selectedFolderFiles)
    konsole.log("selectIndexOfCategoryselectIndexOfCategory", selectIndexOfCategory)

    function innerSubFolderOnly() {
        // konsole.log("selecteweweweFolderId",selectedClickSubfolderId,allFolderList)
        const filterSubFolderofSelectedFolder = allFolderList?.filter((item) => {
            return item?.parentFolderId == selectedClickSubfolderId
        })
        // konsole.log("filterSubFolderofSelectedFolder2",filterSubFolderofSelectedFolder)
        return (
            <>
                {filterSubFolderofSelectedFolder && filterSubFolderofSelectedFolder?.length > 0 &&
                    <div className='mb-3 minWidthOfRightAreaOfFileCabinetFilder'>
                        {filterSubFolderofSelectedFolder?.sort((a, b) => a.folderName.localeCompare(b.folderName))?.sort((a, b) => {
                            const labels = sortingFolderForCabinet
                            const aIndex = labels.indexOf(a.folderName);
                            const bIndex = labels.indexOf(b.folderName);
                            return bIndex - aIndex;
                        })?.map((item) => {
                            return (
                                <>

                                    <button className={`${(selectedClickInnerSubfolderId == item?.folderId) ? "innerSubFolderButtonStyleSelected" : "innerSubFolderButtonStyleNotSelected"} bg-transparent`} onClick={() => { selectinnerSubFolderId(item.folderId) }} >
                                        {item?.folderName?.length > 15 ? (<> {' '} {item?.folderName?.slice(0, 13)}...  </>) : (item?.folderName)}
                                    </button>
                                </>
                            )
                        })
                        }
                        <hr className="underlineUnderFolder"></hr>
                    </div>
                }

            </>
        )
    }


    //  konsole---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    const ShowFolderFilesList = (event) => {
        const buttonId = event.target.id;
        // if(!selectedFolderIds){return}
        if (buttonId == "primaryFileListShow") {
            setShowPrimaryFiles(true)
        } else {
            setShowPrimaryFiles(false)
        }

    }

    function removeDuplicateValue(files) {
        let sharedFileStatusList = files;
        if (sharedFileStatusList?.length > 0) {
            const uniqueFiles = sharedFileStatusList?.filter((file => {
                const seen = new Set();
                return (file => {
                    if (seen.has(file.fileId)) {
                        return false;
                    } else {
                        seen.add(file.fileId);
                        return true;
                    }
                });
            })());
            return uniqueFiles;
        }
        return sharedFileStatusList;
    }

    const getFilesCountForDrawer = (item) => {
        const { fileCategoryId } = item;
        const getSelectedDrawerToalFiles = allFileForMapping && allFileForMapping.length > 0 && allFileForMapping.filter((item) => item?.fileCategoryId == fileCategoryId)
        // konsole.log("ddddddddddddd",getSelectedDrawerToalFiles)
        // konsole.log("drawrData",fileCategoryId,allFileForMapping,getSelectedDrawerToalFiles)
        const filterPrimaryFiles = getSelectedDrawerToalFiles && getSelectedDrawerToalFiles.length > 0 && getSelectedDrawerToalFiles?.filter(({ fileBelongsTo }) => fileBelongsTo == primaryMemberUserId)
        const filterSpouseFiles = getSelectedDrawerToalFiles && getSelectedDrawerToalFiles.length > 0 && getSelectedDrawerToalFiles?.filter(({ fileBelongsTo }) => fileBelongsTo == spouseUserId)
        // konsole.log("drawrData2344",filterPrimaryFiles,filterSpouseFiles,primaryMemberUserId)
        if (showPrimaryFiles) {
            // return (filterPrimaryFiles?.length || 0)
            let files = removeDuplicateValue(filterPrimaryFiles)
            return (files?.length || 0)
        }
        // return (filterSpouseFiles?.length || 0)
        let filespouse = removeDuplicateValue(filterSpouseFiles)
        return (filespouse?.length || 0)
    }

    function clearFamilyMembersModalChekboxes()
    {
        setFamilyMembersListForCabinet(prev=>{
           return prev.map((data)=>{
                return {...data,checked:false}
            })
        })
    }

    const handleShowUserGuidance = (show) => {
        setShowUserGuidanceModal(show);
    };

    function openCabinetShareDoc()
    {
        setFileInformationList(fileInformation)
        setDisableConfirmButton(false)
        setShowOpenCabinetShareDoc(true)
        setCloseCabinetShareModal(true)
    }

    function fileSharedWihCount(data)
    {
        // konsole.log("alFilesForMapping",allFileForMapping,data)
        // konsole.log("fileInformationFun",fileInformationList)
        const deepCopyOFShaedFiles=JSON.parse(JSON.stringify(sharedFileShatusList))
        // console.log("deepCopyOFShaedFiles",deepCopyOFShaedFiles)
        let filterSharedFiles=deepCopyOFShaedFiles.filter(({fileId,belongsTo})=>fileId==data?.fileId && belongsTo==data.fileBelongsTo)
        konsole.log("filterSharedFiles")
        return filterSharedFiles.length ?? 0

    }

    function selectAllCheckboxes(valueChecked)
    {
        konsole.log("valueChecked",valueChecked)
    }

    
    const mappingCheckBoxValueForCabinetShare = (e, sharedUserId, typeOfUser) => {
        let { checked } = e?.target;
        let id="isRead"
        konsole.log("mappingCheckBoxValueParentCabinet",id, checked,sharedUserId, typeOfUser) 
        // konsole.log("setFamilyMembersListForCabinet",familyMembersListForCabinet)
            const newObj = cretaeJsonForFilePermission({ 
                belongsTo:((showPrimaryFiles == true) ? primaryMemberUserId : spouseUserId),
                primaryUserId: primaryMemberUserId, 
                sharedUserId, 
                [id]: checked, 
                ...manageCreate, 
                ...manageUpdate,
                fileId,

             })
            setJsonForMultiplePermission(prevState => {
                    let newArray=[...prevState]
                    let checkIfTrue=newArray.some((data)=>data?.sharedUserId==sharedUserId)
                    if(checkIfTrue)
                    {
                        return newArray.filter((value)=>value?.sharedUserId!==sharedUserId)
                    }
                    return [...newArray,newObj]
            })
             setFamilyMembersListForCabinet(prev=>{
                let newArr=[...prev]
                 newArr=newArr.map((data)=>{
                 if(data.userId==sharedUserId){return {...data,checked}}
                return data
                })
                // konsole.log("newArrnewArr",newArr)
                return newArr
             })
            //  konsole.log("newObj",newObj)
    }
    function getFilteredFilesAccToToggle()
    {
        let filtersToggleSelectedFiles=fileInformationList?.filter(({fileBelongsTo})=>fileBelongsTo==((showPrimaryFiles == true) ? primaryMemberUserId : spouseUserId))
        // console.log("filtersToggleSelectedFiles",filtersToggleSelectedFiles)
        return filtersToggleSelectedFiles?.filter((value)=>{
              // console.log("fileCategoryIdfileCategoryId",value,selectedCabinetData?.fileCategoryId)
              return (value?.fileCategoryId==selectedCabinetData?.fileCategoryId)
          })
    }
    function checkFileInformationFun(data,event)
    {        
        const {checked}=event?.target
        // konsole.log("checkFileInformationFun",data,index)
        setCheckedFileJson((prevState) => {
            let newArray=[...prevState]
            let filterFOrPrevObject=newArray?.some((value)=>value?.fileId==data?.fileId)
            // konsole.log("filterFOrPrevObject",filterFOrPrevObject)
            if(filterFOrPrevObject){
                // konsole.log("sdddddd",value.fileId==data.fileId)
                return newArray.filter((value)=>value?.fileId!==data?.fileId)
            }
            // konsole.log("sdddddd",[...newArray,data])
            return [...newArray,{...data,checked:true}]
        });
        
        let getFilteredFileList=getFilteredFilesAccToToggle()
        getFilteredFileList=getFilteredFileList?.map((dataValue)=>{
                // console.log("dataValuedataValue",dataValue.fileId,"data",data.fileId)
                if(dataValue?.fileId==data?.fileId){
                    return {...dataValue,checked}
                }
                return dataValue
        })
        // console.log("getFilteredFileList",getFilteredFileList)
        setFileInformationList(getFilteredFileList)

       
    }

    function cabinetShareModalCloseButton()
    {
        setShareWithModal(false)
        setCloseCabinetShareModal(false)
        setShowOpenCabinetShareDoc(false)
        clearFamilyMembersModalChekboxes()
        setCheckedFileJson([])
        setJsonForMultiplePermission([])
        setSearchedFamilyMemeberValue("")
        setFileInformationList(fileInformation)
    }

    function confirmAndShareFun()
    {
        setDisableConfirmButton(true)
        const deepCopyOfSaredFiles=JSON.parse(JSON.stringify(sharedFileShatusList))
        // konsole.log("checkedFileJsonCOnfirmButton",checkedFileJson,"jsonForMultiplePermission",jsonForMultiplePermission)
        if(jsonForMultiplePermission?.length==0)
        {
            AlertToaster.error('Kindly select a Family member');
            setDisableConfirmButton(false)
            return  
        }
        let newArray=[]
        let jsonForMultiplePermissionConst=jsonForMultiplePermission?.map((value1)=>{
            let data= checkedFileJson?.map((value2)=>{
                newArray.push({...value1,belongsTo:value2?.fileBelongsTo,fileId:value2?.fileId})
                return {...value1,belongsTo:value2?.fileBelongsTo,fileId:value2?.fileId}
            })
            return data
        })
        // konsole.log("1jsonForMultiplePermissionConst",jsonForMultiplePermissionConst)
        let filterAlreadySharedPermission=newArray.filter((value)=>{
            // konsole.log("jsonForMultiplePermissionConstvalue",value)
            return !deepCopyOfSaredFiles?.some((data)=>{
                // konsole.log("jsonForMultiplePermissionConstvalue",value,data?.fileId==value?.fileId && data?.sharedUserId==value?.sharedUserId)
                return (data?.fileId==value?.fileId && data?.sharedUserId==value?.sharedUserId)
            })
        })
        //  konsole.log("2jsonForMultiplePermissionConst",jsonForMultiplePermissionConst)
        //  konsole.log("filterAlreadySharedPermission",filterAlreadySharedPermission)
        //  konsole.log("newArrayAfterCOmpletepn",newArray)
        // konsole.log("jsonForMultiplePermissionConst",jsonForMultiplePermissionConst)
        // konsole.log("jsonForMultiplePermissionconfirmAndShareFun",jsonForMultiplePermission,checkedFileJson)
        if(filterAlreadySharedPermission?.length==0)
        {
            AlertToaster.success('Permissions already shared')
            cabinetShareModalCloseButton()
            functionForGetFileAfterAddEditFile()
            setJsonForMultiplePermission([])
            return
        }
        dispatchloader(true);
        Services.upsertShareFileStatus(filterAlreadySharedPermission).then((res) => {
            AlertToaster.success('Permissions shared successfully')
            cabinetShareModalCloseButton()
            functionForGetFileAfterAddEditFile()
            setJsonForMultiplePermission([])  
            dispatchloader(false);
        }).catch((err) => {
            cabinetShareModalCloseButton()
            functionForGetFileAfterAddEditFile()
            setJsonForMultiplePermission([])
            dispatchloader(false);
            setFileInformationList(fileInformation)
        })   
    }

    function onClickSharedFiles()
    {
        if(checkedFileJson.length==0){
            AlertToaster.error('Kindly select a File for sharing');
            return
        }
        setCloseCabinetShareModal(false);
        setShareWithModal(true)
    }

    function filterFamilyMemebers(event)
    {
        const eventValue=event?.target?.value;
        setSearchedFamilyMemeberValue(eventValue)
    }
    
    function onChangeAllcheckboxesAtOnceForFiles(event){
        const {checked}=event?.target;
        // console.log("checked12",checked)
        if(checked==false){
            setCheckedFileJson([])
            setFileInformationList(fileInformation)
            return
        }
        
        const filteredFileAccToToggle=getFilteredFilesAccToToggle()
        const checkedDateList=filteredFileAccToToggle?.map((data)=>{
            setCheckedFileJson((prevState) => {
                let newArray=[...prevState]
                let filterFOrPrevObject=newArray?.some((value)=>value?.fileId==data?.fileId)
                // konsole.log("filterFOrPrevObject",filterFOrPrevObject)
                if(filterFOrPrevObject){
                    // konsole.log("sdddddd",value.fileId==data.fileId)
                    return newArray.filter((value)=>value?.fileId!==data?.fileId)
                }
                // konsole.log("sdddddd",[...newArray,data])
                return [...newArray,{...data,checked:true}]
            });
            return {...data,checked}
          })
        // console.log("checkedDateList",checkedDateList)
        setFileInformationList(checkedDateList)

    }

    function onChangeAllcheckboxesAtOnceForFamilyMembers(event){
        familyMembersListForCabinet.map((data)=>{
            mappingCheckBoxValueForCabinetShare(event,data?.userId)
        })
        // console.log("123familyMembersListForCabinet",familyMembersListForCabinet)
        
    }
    function checkeIfAllBoxesAreCheckedFilesAndFamily(){
        if(fileInformationList?.length==0){return false}
        const checkAllChecked=(closeCabinetShareModal?fileInformationList:familyMembersListForCabinet)?.every((data)=>data?.checked==true)
        // console.log("checkAllChecked",checkAllChecked)
        return checkAllChecked ?? false
    }
    
   

    // konsole.log("selectFolderInfoselectFolderInfoDown", selectFolderInfo)
    // konsole.log("jsonForMultiplePermission",jsonForMultiplePermission)
    // konsole.log("checkedFileJson",checkedFileJson,)
    // console.log("fileInformationList",fileInformationList)

    return (
        <>
            <div className='' style={{ paddingLeft: "0px" }}>
                <Row className='p-0 m-auto folderStructureMainRowWith' >
                    <div className='mainDivForFileCabinet '>
                        <div className='row p-0 m-0 setBackgroundStylingForUpperCabinet'>

                            {/* ----------Heading----------- */}
                            <div className='col-12 m-0 p-0 '>
                                <p className='fileCabinetHeadingStyle'>File Cabinet</p>
                                <p className="welcomeMessageFileCabinet">Welcome to the file cabinet! Efficiently manage all your files in one place.</p>
                            </div>
                            {/* -----------Search------------ */}
                            <div className="col-12 m-0 p-0 mt-4">
                                <div class="p-1 bg-light rounded rounded-pill shadow-sm  FileCabinetSearchBarStyle">
                                    <div class="input-group d-flex align-items-center h-100">
                                        <div class="input-group-prepend d-flex align-items-center">
                                            <img src="/icons/FileCabinetSearchIcon.svg" className="mt-0" />
                                        </div>
                                        <input type="search" onChange={seachFolders} placeholder="Search the file cabinet" aria-describedby="button-addon2" class="form-control border-0 bg-light" />
                                    </div>
                                </div>
                            </div>

                            <div className='col-12 m-0 p-0 mt-4 d-flex justify-content-between align-items-center' >
                                <div>
                                    {demo == true && (
                                        <div className='' style={{ width: '140px', marginRight: '10px' }}>
                                            <div className='fileFilterButtonNotSelected p-0' style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '135px' }} onClick={() => handleShowUserGuidance(true)}>
                                                <img src="/icons/UserGuidanceIcon.png" className="dotColor mt-0" style={{ width: '35px', padding: '13px', paddingRight: '0px' }} />
                                                <button className='fileFilterButtonNotSelected text-black' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', padding: '0', borderBottom: '2px solid black', height: 'auto' }}>User Guidance</button>
                                            </div>

                                            <UserGuidance userGuidance={showUserGuidanceModal} handleShowUserGuidance={handleShowUserGuidance} />
                                        </div>
                                    )}
                                </div>
                               {/* <div
                                    className={`${(!_userDetailOfPrimary?.spouseName) ? "changePrimaryButtonStyle" : "changePsrimaryOrSpuseFile"}`}
                                // className='changePsrimaryOrSpuseFile'
                                >
                                    <OverlayTrigger placement="top" overlay={<Tooltip id="folder-tooltip">{_userDetailOfPrimary && _userDetailOfPrimary?.memberName?.toUpperCase()}</Tooltip>}>
                                        <button className={`${showPrimaryFiles ? "fileFilterButtonSelected" : "fileFilterButtonNotSelected"} `} id="primaryFileListShow" onClick={ShowFolderFilesList}>{_userDetailOfPrimary && _userDetailOfPrimary?.memberName?.toUpperCase()}</button>
                                    </OverlayTrigger>
                                    {_userDetailOfPrimary?.spouseName && <OverlayTrigger placement="top" overlay={<Tooltip id="folder-tooltip">{_userDetailOfPrimary && _userDetailOfPrimary?.spouseName?.toUpperCase()}</Tooltip>}>
                                        <button className={`${!showPrimaryFiles ? "fileFilterButtonSelected" : "fileFilterButtonNotSelected"} `} id="SpouseFileListShow" onClick={ShowFolderFilesList}>{_userDetailOfPrimary && _userDetailOfPrimary?.spouseName?.toUpperCase()}</button>
                                    </OverlayTrigger>
                                    }


                                </div> */}
                            </div>
                            {/* ------------Drawer----------- */}
                            <div className="col-12 m-0 p-0 mt-3">
                                <p className="drawerNameHeading">Drawer</p>
                            </div>
                            {/* -----------DrawerList-------- */}
                            <div className="col-12 p-0 m-0 drawerScollAdjustment mt-1">
                                {allMainCabinetContainer?.length > 0 &&
                                    <>
                                        {allMainCabinetContainer?.sort((a, b) => a?.fileCabinetOrder - b?.fileCabinetOrder)?.map((item, index) => {
                                            // konsole.log("item212312",item)  
                                            return (<>
                                                <div
                                                    className={`drawerOuterStyle ${(selectIndexOfCategory === index) ? "highLighYellowBorder" : ""}`}
                                                    style={{ backgroundColor: '#f0f0f0' }}
                                                    key={index} onClick={() => handleCategory(index, item, 'customMapping', true)}
                                                >    
                                                <p className="d-flex align-items-center justify-content-between" >
                                                    <img src={` ${(selectIndexOfCategory === index) ? "/icons/fileCabinetWhiteColor.svg" : "/icons/blackFileCabinetDrawer.svg"} `} className="folderimg" /> 
                                                    <span className=' cursor-pointer cabinetShareButton' onClick={openCabinetShareDoc} ><img src={`${(selectIndexOfCategory === index)?"/icons/whiteShareIcon.svg" : "/icons/BlackShareIcon.svg"}`} className={`m-0`}></img>  Share</span>
                                                </p>                                                                           
                                                    <p>{item?.fileCategoryType}</p>
                                                    <span className="d-inline-block">{(item?.folder)?.length} Folder</span>
                                                    <img src="/icons/yellowDotIcon.svg" className="dotColor" />
                                                    <span>{getFilesCountForDrawer(item)} Files</span>
                                                </div>
                                            </>)
                                        }
                                        )}
                                    </>
                                }

                     {
                        showOpenCabinetShareDoc &&                               
                                 <ShareDocumentModal
                                 closeCabinetShareModal={closeCabinetShareModal}
                                 shareWithModal={shareWithModal}
                                 fileSharedWihCount={fileSharedWihCount}
                                 fileInformationList={fileInformationList}
                                 showPrimaryFiles ={showPrimaryFiles}
                                 mappingValues={familyMembersListForCabinet}
                                 onClickSharedFiles={onClickSharedFiles}
                                 checkFileInformationFun={checkFileInformationFun}
                                 familyMembersListForCabinet={familyMembersListForCabinet}
                                 disableConfirmButton={disableConfirmButton}
                                 confirmAndShareFun={confirmAndShareFun}
                                 mappingCheckBoxValueForCabinetShare={mappingCheckBoxValueForCabinetShare}
                                 cabinetShareModalCloseButton={cabinetShareModalCloseButton}
                                 filterFamilyMemebers={filterFamilyMemebers}
                                 searchedFamilyMemeberValue={searchedFamilyMemeberValue}
                                 setSearchedFamilyMemeberValue={setSearchedFamilyMemeberValue}
                                 selectedCabinetData={selectedCabinetData}
                                 onChangeAllcheckboxesAtOnceForFiles={onChangeAllcheckboxesAtOnceForFiles}
                                 onChangeAllcheckboxesAtOnceForFamilyMembers={onChangeAllcheckboxesAtOnceForFamilyMembers}
                                 checkeIfAllBoxesAreCheckedFilesAndFamily={checkeIfAllBoxesAreCheckedFilesAndFamily}
                                  />
                      }
                               

                            </div>
                        </div>
                        <div className="row p-0 mt-3 m-1" style={{ marginBottom: "50px" }}>
                            {/* <div className=" m-0 p-3 border"> */}
                            <div className="col-3 m-0 p-4 pt-0 leftNavbarHeightSet">
                                {selectIndexOfCategory !== null ? <div >
                                    <div className='row' >
                                        <div>
                                            <Modal enforceFocus={false} id='modalForFileAndFolderNew' centered animation="false" backdrop="static" className='modalForFileAndFolderNew' show={(showAddEditFolder == 'Folder' || showAddEditFolder == 'File')} onHide={() => setShowAddEditFolder('')}>
                                                <Modal.Header
                                                    className={`${(fileCabinetDesign == "new") ? "oldFileViewerModalStyle" : "newFileCabinteModalHeaderBackground"}`}
                                                >
                                                    {fileCabinetDesign == "new" ?
                                                        <>
                                                            <span className='actionTypeStylingNewDesign'>{actionType} {showAddEditFolder}</span>
                                                            <button onClick={() => setShowAddEditFolder('')} className='bg-transparent border-0'><img src="/icons/filePrieviewClosebutton.svg" className='AddEditFileIcon'></img></button>
                                                        </>
                                                        :
                                                        <>
                                                            <span className='actionTypeStylingNewDesign'>{actionType} {showAddEditFolder}</span>
                                                            <button onClick={() => setShowAddEditFolder('')} className='bg-transparent border-0'><img src="/icons/filePrieviewClosebutton.svg" className='AddEditFileIcon'></img></button>
                                                        </>
                                                    }
                                                </Modal.Header>
                                                <Modal.Body className='p-0' style={{ bordeRadius: " 9px" }}>
                                                    {(showAddEditFolder == 'Folder') ?
                                                        <AddCategoryFolder
                                                            callApiCabinetFolder={callApiCabinetFolder}
                                                            callApiCabinetCategory={callApiCabinetCategory}
                                                            refrencePage={refrencePage}
                                                            actionType={actionType}
                                                            // manageShowFileType='Folder'
                                                            manageShowFileType={manageShowFileType}
                                                            selectFolderInfo={selectFolderInfo}
                                                            setShowAddEditFolder={setShowAddEditFolder}
                                                            key={selectFolderInfo}
                                                            functionAfterAddingAnyFolder={functionAfterAddingAnyFolder}
                                                            uniqueref='STRUCTURE'
                                                        />
                                                        : (showAddEditFolder == 'File') ?
                                                            <AddFile
                                                                uniqueref='STRUCTURE'
                                                                refrencePage='STRUCTURE'
                                                                actionType={actionType}
                                                                key={selectFolderInfo}
                                                                selectFolderInfo={selectFolderInfo}
                                                                fileAddFrom={fileAddFrom}
                                                                setShowAddEditFolder={setShowAddEditFolder}
                                                                functionForGetFileAfterAddEditFile={functionForGetFileAfterAddEditFile}
                                                                showPrimaryFiles={showPrimaryFiles}
                                                            /> : ''}

                                                </Modal.Body>
                                            </Modal>
                                        </div>
                                        {isFileOpen && <FileViewer isFileOpen={isFileOpen} setIsFileOpen={setIsFileOpen} openFileInfo={openFileInfo} fileCabinetDesign="new" />}
                                        <div className='mb-2' >
                                            {mapFolderNFile()}
                                        </div>
                                    </div>
                                </div>
                                    :
                                    // <div className='divForNoFiles'>
                                    <div className='row justify-content-center'>
                                        <img src="/icons/emptyFilesImage.svg" className='d-block m-auto'></img>
                                        <p className=' text-center'>Select a cabinet to view associated folders</p>
                                    </div>
                                    // </div>
                                }
                            </div>
                            {/* </div> */}
                            <div className="col-9 m-0 p-0 setBackgroundStylingForLowerCabinet overflowXScroll">
                                <div className=' p-3'>
                                    <div> {(searchFolder.length == 0 || showOldFilesAgain == true) ? filesHtml() : SearchedfilesHtml()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
            </div>
        </>
    )



    function mapFolderNFile() {
        return categoryTypeList?.length > 0 && categoryTypeList?.sort((a, b) => a?.fileCabinetOrder - b?.fileCabinetOrder)?.map((fileCab, index) => {
            konsole.log("fileCabshow", fileCab);
            const { fileCategoryType, categoryDescription, folder, ...rest } = fileCab;
            let myAllFolder = (!paralegalAttoryId.includes(stateObj.roleId)) ? folder : folder?.filter((item) => (item.folderFileCategoryId == categoryFileCabinet[0] && item?.sharedUserId == loggedUserId) || (item.folderFileCategoryId != categoryFileCabinet[0] && item?.sharedUserId != loggedUserId));
            konsole.log('filecabfilecab', folder, myAllFolder, fileCab)

            function removeDuplicatesByKey(arr, key) {
                const uniqueMap = new Map();
                return arr?.filter(item => {
                    if (!uniqueMap.has(item[key])) { uniqueMap.set(item[key], true); return true; }
                    return false;
                });
            }

            if (myAllFolder?.length > 0) {
                myAllFolder = removeDuplicatesByKey(myAllFolder, 'folderId')
            }

            let fileWithCategoryFilter = allFileForMapping.length > 0 ? allFileForMapping?.filter(item => item?.fileCategoryId == fileCab?.fileCategoryId) : []
            const { primaryMemberFile, spouseFile, commonFile } = funForFileCalculation(fileWithCategoryFilter)
            konsole.log('primaryMemberFileprimaryMemberFile', primaryMemberFile, spouseFile)
            let filelength = primaryMemberFile?.length + spouseFile?.length;
            // konsole.log("filelengthfilelength",filelength,primaryMemberFile)
            // konsole.log('allFileForMappingallFileForMapping', allFileForMapping,spouseFile)           
            //  konsole.log("myAllFoldermyAllFolder",myAllFolder)
            //  konsole.log("srchFoldewwwwwwwwwwwwwr",searchFolder)
            return (
                <>
                    {/* {myAllFolder?.length > 0 ? <>
                            <div className='row p-0' style={{width: "98%",margin:" 0px 4px"}}>
                        <InputGroup className="mb-3 w-100 p-0" >
                            <Form.Control className="cabinetSerchBox" placeholder="Search Folders" onChange={seachFolders} />
                            <InputGroup.Text id="basic-addon2" className="cabinetSerchBoxIcon"><img src="/icons/search-icon.svg" className='mt-0' style={{padding:" 0px 6px",height:"15px"}}></img></InputGroup.Text>
                        </InputGroup>
                        </div>
                        </>:<></>} */}

                    {/* <Row className='pb-1 p-0 m-0 justify-content-between'>
                                {myAllFolder?.length > 0 ? <>
                                 <div className='col-6' ><span className='allFoldersHeading'>
                                    All Folders ({myAllFolder
                                    ?.filter(folder => folder?.folderName?.toLowerCase().includes(searchFolder?.toLowerCase()))
                                    ?.sort((a, b) => a?.folderName?.localeCompare(b?.folderName))?.length}) 
                                    </span></div>                            
                                 {(!paralegalAttoryId.includes(stateObj.roleId)) &&  <div className='col-4 p-0 d-flex justify-content-end align-items-center cursor-pointer' onClick={() => handleAddEditFolder('Folder', 'Add', fileCab, '', 'ManageAllFile', 'Folder')}><img src="/icons/maroonAddIcon.svg" className='maroonAddFolderIcon m-0 d-flex justify-content-center align-items-center'></img><span className='text-right addFolderHeading pl-2'>Add Folder</span></div>} </>   : <> </>}
                        </Row> */}
                    <button className="addNewFolderButton" onClick={() => handleAddEditFolder('Folder', 'Add', fileCab, '', 'ManageAllFile', 'Folder')}>
                        <img src="/icons/marronAddFolderIcon.svg" />
                        <span>New Folder</span>
                    </button>
                    <Row className='mt-1 p-0 m-0'>
                        {(categoryOpenStates[index] || isSpecificDrawerSelect == true) && (
                            <Col className='p-0'>
                                {myAllFolder?.length > 0 ? <>
                                    <div className=''>
                                        {myAllFolder
                                            ?.filter(folder => folder.folderName.toLowerCase().includes(searchFolder.toLowerCase()))
                                            ?.sort((a, b) => a.folderName.localeCompare(b.folderName))?.sort((a, b) => {
                                                const labels = sortingFolderForCabinet
                                                const aIndex = labels.indexOf(a.folderName);
                                                const bIndex = labels.indexOf(b.folderName);
                                                return bIndex - aIndex;
                                            })?.map((folder, index) => (
                                                <RecursiveFolderCom
                                                    isOpen={index == 0}
                                                    key={folder?.folderId}
                                                    getFileValues={getFileValues}
                                                    folder={{ ...folder, isChild: false }}
                                                    allFileForMapping={allFileForMapping}
                                                    handleAddEditFolder={handleAddEditFolder}
                                                    deleteFolderfun={deleteFolderfun}
                                                    viewFileFun={viewFileFun}
                                                    deleteFilefun={deleteFilefun}
                                                    isSpecificDrawerSelect={isSpecificDrawerSelect}
                                                    funForFileCalculation={funForFileCalculation}
                                                    toggleCollapseFile={toggleCollapseFile}
                                                    fileCollapseOpen={fileCollapseOpen}
                                                    selectFolderId={selectFolderId}
                                                    selectedClickfolderId={selectedClickfolderId}
                                                    selectSubFolderId={selectSubFolderId}
                                                    selectedClickSubfolderId={selectedClickSubfolderId}
                                                    showOldFilesAgain={showOldFilesAgain}
                                                    setShowOldFilesAgain={setShowOldFilesAgain}
                                                />
                                            ))}

                                    </div>
                                </>
                                    :
                                    <div className='divForNoFiles'>
                                        <div className='row justify-content-center'>
                                            <img src="/icons/emptyFilesImage.svg" className='d-block m-auto'></img>
                                            <p className=' text-center'>{paralegalAttoryId.includes(stateObj.roleId) ? messageForPalaregalDrawerAccess : messageAdminPermissions}There are no folders present in this cabinet</p>
                                            {/* {(!paralegalAttoryId.includes(stateObj.roleId)) &&<div className='cursor-pointer addFileButtonInManageFolders d-flex justify-content-center align-items-center mt-2' onClick={() => handleAddEditFolder('Folder', 'Add', fileCab, '', 'ManageAllFile', 'Folder')} >
                                                <p className='d-flex justify-content-center pt-1'><img src="/icons/WhiteAddIconWithoutMaroonborder.svg" className='maroonAddFolderIcon' ></img><span className='text-right d-flex justify-content-center align-items-center'> Add Folder</span></p>
                                            </div>} */}
                                        </div>
                                    </div>
                                }
                            </Col>)}

                        {((myAllFolder?.filter(folder => folder?.folderName?.toLowerCase().includes(searchFolder?.toLowerCase()))).length == 0 && (categoryTypeList?.length > 0 && categoryTypeList[0]?.fileCategoryId == categoryFileCabinet)) &&
                            <div className='divForNoFilesSearched'>
                                <div className='row justify-content-center'>
                                    <img src="/icons/emptyFilesImage.svg" className='d-block m-auto'></img>
                                    <p className='text-center'>Searched folder not found</p>
                                </div>
                            </div>
                        }

                    </Row>
                </>
            )
        })
    }

}



const RecursiveFolderCom = ({ isOpen, selectFolderId, fileCollapseOpen, toggleCollapseFile, funForFileCalculation, isSpecificDrawerSelect, folder, allFileForMapping, handleAddEditFolder, deleteFolderfun, viewFileFun, deleteFilefun, getFileValues, selectedfolderId, selectedClickfolderId, subFolder, selectSubFolderId, selectedClickSubfolderId, showOldFilesAgain, setShowOldFilesAgain }) => {

    const { folderName, folderDescription, folderId, folderFileCategoryId, displayOrder, level, fileCategoryIdfolder } = folder
    konsole.log("fileCollapseOpenfileCollapseOpen", folderName, folderDescription, folderId, folderFileCategoryId, displayOrder, level, fileCategoryIdfolder)
    const stateObj = $AHelper.getObjFromStorage("stateObj");
    let loggedUserId = sessionStorage.getItem('loggedUserId')
    const primaryMemberId = sessionStorage.getItem('SessPrimaryUserId')
    const spouseUserId = sessionStorage.getItem('spouseUserId')
    const { primaryMemberFile, spouseFile, commonFile } = funForFileCalculation(fileFilter)
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [addBorder, setAddBorder] = useState("addPaddingOnFolderSelection")
    let myAllFolder = (!paralegalAttoryId.includes(stateObj.roleId)) ? folder.folder : folder?.folder?.filter((item) => (item?.folderFileCategoryId == categoryFileCabinet[0] && item?.sharedUserId == loggedUserId) || (item?.folderFileCategoryId != categoryFileCabinet[0] && item?.sharedUserId != loggedUserId));
    let fileFilter = allFileForMapping.length > 0 ? allFileForMapping?.filter(item => item.folderId == folderId) : []

    function removeDuplicatesByKey(arr, key) {
        const uniqueMap = new Map();
        return arr?.filter(item => {
            if (!uniqueMap.has(item[key])) { uniqueMap.set(item[key], true); return true; }
            return false;
        });
    }
    if (myAllFolder?.length > 0) {
        myAllFolder = removeDuplicatesByKey(myAllFolder, 'folderId')
    }

    // konsole.log("folderIdfolderId",folder)
    //  toggleCollapseFile(folderId, primaryMemberFile[0]?.belongsTo) 
    //  toggleCollapseFile(folderId, spouseUserId) 
    // konsole.log("primaryMemberFileprimaryMemberFile",primaryMemberFile,"spouseFile",spouseFile,"commonFile")

    const toggleCollapse = (value) => {
        konsole.log("edddddddvddde", value)
        if (value == "right") {
            selectFolderId(null)
        } else {
            selectFolderId(folderId)
        }
        setIsCollapsed(!isCollapsed);
    };

    useEffect(() => {
        // setIsCollapsed(!isSpecificDrawerSelect)    
    }, [isSpecificDrawerSelect])

    konsole.log("selectedfolderIdselectedfolderId", selectedfolderId)

    const funForAddEditDelete2 = (d, previousarray, fileFilter) => {
        konsole.log("dsdsdsdds", d, "previousarray", previousarray, "fileFilter", fileFilter)
        // if (d?.folderFileCategoryId == categoryFileCabinet[0] && d?.folder.length !== 0) return;
        const { folderCreatedByRoleId, createSubFolder, editFolder, fileUploadedBy, isEdit, deleteFolder, fileUpload } = d
        const isAllowAddFolder = (folderCreatedByRoleId == 4 || folderCreatedByRoleId == 11) ? false : (!paralegalAttoryId.includes(stateObj.roleId) && paralegalAttoryId.includes(folderCreatedByRoleId)) ? false : (folderCreatedByRoleId == '9' && createSubFolder == false) ? false : true;
        const isAllowEditFolder = (folderCreatedByRoleId == 4 || folderCreatedByRoleId == 11) ? false : (!paralegalAttoryId.includes(stateObj.roleId) && paralegalAttoryId.includes(folderCreatedByRoleId)) ? false : (folderCreatedByRoleId == '9' && editFolder == false) ? false : true;
        const isAllowDeleteFolder = (folderCreatedByRoleId == '4' || folderCreatedByRoleId == '11') ? false : (paralegalAttoryId.includes(stateObj.roleId) && !(paralegalAttoryId.includes(folderCreatedByRoleId) || deleteFolder == true)) ? false : (!paralegalAttoryId.includes(stateObj.roleId) && paralegalAttoryId.includes(folderCreatedByRoleId)) ? false : true;
        const isAllowDocument = (!paralegalAttoryId.includes(stateObj.roleId) && paralegalAttoryId.includes(folderCreatedByRoleId)) ? false : ((folderCreatedByRoleId == 4 || folderCreatedByRoleId == 11) && !paralegalAttoryId.includes(stateObj.roleId)) ? false : (folderCreatedByRoleId == '9' && fileUpload == false) ? false : true;
        return (<>
            {/* <Col > */}
            {
                ((isAllowAddFolder) || (isAllowDocument) || (isAllowEditFolder) || (isAllowDeleteFolder)) && (folderCreatedByRoleId != 4 && folderCreatedByRoleId != 11) &&
                <>
                    {/* <Dropdown className='cabinetOptionsList' style={{marginTop: "5px",marginLeft: "9px"}}>
                            <Dropdown.Toggle id="dropdown-button-dark-example1" variant="secondary" className='mt-0'>
                                <img src="/icons/vertical-triple-Dots.svg"></img>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {(isAllowAddFolder) && <Dropdown.Item className='border-bottom' onClick={() => handleAddEditFolder('Folder', 'Add', d, previousarray, 'FolderStructure', 'Folder')}>   <span className=' cursor-pointer' ><img src="/icons/editIcon.svg"></img>Add Sub Folder</span></Dropdown.Item>}
                                {(isAllowDocument) && <Dropdown.Item className='border-bottom' onClick={() => handleAddEditFolder('File', 'Add', d, previousarray, 'ManageAllFile', 'Folder', 'Folder')}>  <span className=' cursor-pointer' ><img src="/icons/AddFolderIcon.svg"></img> Add Document </span></Dropdown.Item>}
                                {(isAllowEditFolder) && <Dropdown.Item className='border-bottom' onClick={() => handleAddEditFolder('Folder', 'Edit', d, previousarray, 'FolderStructure', 'Folder')}>  <span className=' cursor-pointer' ><img src="/icons/editIcon.svg"></img> Edit </span></Dropdown.Item>}
                                {(isAllowDeleteFolder) && <Dropdown.Item className='border-bottom' onClick={() => deleteFolderfun(d, fileFilter)}><span className=' cursor-pointer text-danger' ><img src="/icons/reddeleteIcon.svg"></img>  Delete</span></Dropdown.Item>}
                            </Dropdown.Menu>
                            </Dropdown> */}
                    {/* <Dropdown className='cabinetOptionsList' style={{marginTop: "5px",marginLeft: "9px"}}>
                            <Dropdown.Toggle id="dropdown-button-dark-example1" variant="secondary" className='mt-0'>
                              <img src="/icons/vertical-triple-Dots.svg"></img>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>  */}
                    {/* {(isAllowAddFolder) && <button className=' bg-transparent' onClick={() => handleAddEditFolder('Folder', 'Add', d, previousarray, 'FolderStructure', 'Folder')}>   <span className=' cursor-pointer' ><img src="/icons/editIcon.svg"></img></span></button>} */}
                    {/* {(isAllowDocument) &&  <button  className=' bg-transparent' onClick={() => handleAddEditFolder('File', 'Add', d, previousarray, 'ManageAllFile', 'Folder', 'Folder')}>  <span className=' cursor-pointer' ><img src="/icons/AddFolderIcon.svg"></img></span></button>} */}
                    {(isAllowEditFolder) && <button className='border-0 bg-transparent' onClick={() => handleAddEditFolder('Folder', 'Edit', d, previousarray, 'FolderStructure', 'Folder')}><span className=' cursor-pointer' ><img src="/icons/editIcon.svg"></img></span></button>}
                    {(isAllowDeleteFolder) && (d?.folder.length == 0) && <button className='border-0 bg-transparent' onClick={() => deleteFolderfun(d, fileFilter)}><span className=' cursor-pointer text-danger' ><img src="/icons/reddeleteIcon.svg"></img></span></button>}
                    {/* </Dropdown.Menu>
                            </Dropdown> */}
                </>
            }
            {/* </Col> */}

        </>)
    }

    const funForAddEditViewFile2 = (userFileName, item, previousarray, commonFile) => {
        // {konsole.log("filccccccccccccccedata",item.userFileName, item, '',commonFile)}
        getFileValues(item.userFileName, item, commonFile)
        // setFileName(item.userFileName)
        // setFileData(item)
        // setFommonFile(commonFile)
        let { fileId, primaryUserId, fileCabinetId, fileCategoryId, fileTypeId, fileUploadedBy, isDelete, dateFinalized } = item
        const isJoint = commonFile?.some(obj => obj.fileId == fileId);
        const isDeleeFileAllow = (paralegalAttoryId.includes(stateObj.roleId) && !(fileUploadedBy == loggedUserId || isDelete == true)) ? false : (!paralegalAttoryId.includes(stateObj.roleId) && fileUploadedBy !== loggedUserId) ? false : true;
        const isEditFileAllow = (paralegalAttoryId.includes(stateObj.roleId) && fileUploadedBy !== loggedUserId) ? false : (!paralegalAttoryId.includes(stateObj.roleId) && fileUploadedBy !== loggedUserId) ? false : true;
        return (<>
            <div className="d-flex justify-content-between ms-5 ">
                <div className="d-flex align-items-start" >
                    <div className="d-flex align-items-center h-100w-100">
                        <img src="/textfile.png" className="cursor-pointer" style={{ width: '2rem' }} onClick={() => viewFileFun(item)} />
                        <h6 className="m-0 p-0 ms-2 mt-2"><b>Document: </b>({`${item?.fileTypeName}`}) <b>{(isJoint) ? "Joint" : ''}</b></h6>
                        <h6 className="m-0 p-0 ms-2 mt-2" >{isNotValidNullUndefile(dateFinalized) && $AHelper.getFormattedDate(dateFinalized)}</h6>

                    </div>
                </div>
                {/* dateFinalized?.split("T")[0]} */}
                <div className="d-flex align-items-start" >
                    <div className="d-flex align-items-center h-100w-100">
                        <h6 className="m-0 p-0 ms-2 mt-2">
                            {/* {item.description} */}
                        </h6>
                    </div>
                </div>
                <div className="w-20">
                    <span className='me-3 p-0 cursor-pointer' onClick={() => viewFileFun(item)} >  View</span>
                    {(isEditFileAllow) && <span className='me-3 p-0 cursor-pointer' onClick={() => handleAddEditFolder('File', 'Edit', item, previousarray, 'ManageAllFile', 'Folder', 'Folder')} >Edit</span>}
                    {(isDeleeFileAllow) && <span className='me-3 p-0 cursor-pointer' onClick={() => deleteFilefun(item)} >Delete</span>}
                </div>

            </div>

        </>)
    }


    useEffect(() => {
        if (isOpen == true) {
            openFile()
        }
    }, [])
    const openFile = () => {
        // setShowFolderAndFiles(true)
        // alert("open file")
        selectFolderId(folderId)
        setIsCollapsed(!isCollapsed);
    };

    const closeFile = () => {
        // alert("close file")
        // setShowFolderAndFiles(false)   
        // selectFolderId(folderId)
        selectFolderId(null)
        setIsCollapsed(!isCollapsed);
    };

    useEffect(() => {
        // setIsCollapsed(!isSpecificDrawerSelect)
    }, [isSpecificDrawerSelect])

    // konsole.log("folderId",selectFolderId)
    // konsole.log("subFolder",subFolder)





    return (
        <Row
            className={`${(subFolder == "SubFolder" && selectedClickSubfolderId == folderId) ? "m-0 p-0 selectedInnerFolderName" : "m-0 p-0 ald"}`} onClick={() => { setShowOldFilesAgain(true) }} >
            <Col
                className={`${(subFolder == "SubFolder") ? "aa m-0 p-0" : " bb m-0 p-0"}`}
            >
                <div
                    className={`${(subFolder == "SubFolder") ? "marginBetweenInnerFolderName" : " marginBetweenFolderName"}`}
                >

                    <div className=''>
                        <Row className='p-0 m-0'>
                            <Col className='cursor-pointer p-0 m-0'>

                                {/* <img className="cabinetsArrow" src="/icons/icons-arrow1.svg" ></img> */}

                                <div className={`${(subFolder !== "SubFolder") ? "aab d-flex justify-content-between align-items-start mainFoderDiv " : " mainFoderDivInner d-flex justify-content-between "}`}>
                                    <div className={`aaa d-flex ${(selectedClickfolderId == folderId) ? "selectedFolderBorder" : ""}`}>
                                        {isCollapsed ? (
                                            // <OverlayTrigger placement="top" overlay={<Tooltip id="folder-tooltip">{folderName}</Tooltip>}>
                                            <>
                                                {(subFolder !== "SubFolder") ?
                                                    <>
                                                        <OverlayTrigger placement="top" overlay={<Tooltip id="folder-tooltip">{folderName}</Tooltip>}>
                                                            <h6 onClick={() => openFile("open")} className={` w-100 ${!isCollapsed ? 'cabinetHeadingsInner p-0 a' : 'cabinetHeadingsOuter a1'} ${subFolder !== "SubFolder" ? "" : "marronInnserFolderName"} text-truncate cursor-pointer`}>
                                                                {!isCollapsed ? (<img src="/icons/maroonFolderOnlyImage.svg" className="cursor-pointer a" style={{ width: "22px", margin: "3px 9px 9px 0px" }} onClick={() => toggleCollapse("right")} />) : (<img src="/icons/blackfolderImage.svg" className="cursor-pointer b" style={{ width: "22px", margin: "3px 9px 9px 0px" }} onClick={() => toggleCollapse("down")} />)}
                                                                {folderName}
                                                            </h6>
                                                        </OverlayTrigger>
                                                    </>
                                                    :
                                                    <>

                                                        <OverlayTrigger placement="top" overlay={<Tooltip id="folder-tooltip">{folderName}</Tooltip>}>
                                                            <h6 onClick={() => { selectSubFolderId(folderId) }} className={`w-100 ${!isCollapsed ? 'cabinetHeadingsInner p-0 a' : 'cabinetHeadingsOuter a2 d-flex justify-content-center'} ${subFolder !== "SubFolder" ? "" : "marronInnserFolderName"} text-truncate cursor-pointer`}>
                                                                {/* {folderName?.length > 15 ? (  <> {' '} {folderName?.slice(0, 13)}...  </>) : (folderName)} */}
                                                                <span className='CabinetFolderName foldercolap d-flex align-items-center'>{folderName}</span>
                                                            </h6>
                                                        </OverlayTrigger>
                                                    </>
                                                }
                                            </>

                                            // </OverlayTrigger>
                                        ) : (
                                            <OverlayTrigger placement="top" overlay={<Tooltip id="folder-tooltip">{folderName}</Tooltip>} >
                                                <h6 onClick={() => closeFile("close")} className={`w-100 ${folder?.folder?.length > 0 ? 'cabinetHeadingsInner p-0 b' : 'cabinetHeadingsOuter b marronInnserFolderName '} text-truncate cursor-pointer`} >
                                                    {subFolder != "SubFolder" &&
                                                        <>
                                                            {!isCollapsed ? (<img src="/icons/maroonFolderOnlyImage.svg" className="cursor-pointer c" style={{ width: "22px", margin: "3px 9px 9px 0px" }} onClick={() => toggleCollapse("right")} />) : (<img src="/icons/maroonFolderOnlyImage.svg" className="cursor-pointer d" style={{ width: "22px", margin: "3px 9px 9px 0px" }} onClick={() => toggleCollapse("down")} />)}

                                                        </>}
                                                    {folderName}

                                                </h6>

                                            </OverlayTrigger>
                                        )}

                                    </div>
                                    {funForAddEditDelete2(folder, '', fileFilter)}
                                    {/* <div style={{ width: "40px" }} className='d-flex justify-content-end align-items-start h-100'> */}
                                    {(folder?.folder?.length > 0) ? <>  {isCollapsed ?
                                        <>
                                            <div style={{ width: "40px" }} className='d-flex justify-content-end align-items-start h-100' onClick={() => toggleCollapse("down")}>
                                                {subFolder != "SubFolder" && <img src="/icons/blackDownimage.svg" style={{ height: "8px", cursor: "pointer", margin: " 12px 9px 9px 7px" }} />}
                                            </div>
                                        </>

                                        :
                                        <div style={{ width: "40px" }} className='d-flex justify-content-end align-items-start h-100' onClick={() => toggleCollapse("right")} >
                                            <img src="/icons/marronDownnewArrow.svg" style={{ height: "8px", cursor: "pointer", margin: " 12px 9px 9px 7px" }} />
                                        </div>
                                    }

                                    </> :
                                        // <img src="/icons/marronDownnewArrow.svg" className='' style={{ height: "14px",cursor: "pointer",margin: " 2px",visibility:"hidden" }} onClick={() => toggleCollapse("down")} /> 
                                        " "
                                    }

                                    {/* </div> */}

                                </div>
                            </Col>
                            {/* <Col lg='3' className='ps-5'>
                                <div className='d-flex align-items-center h-100'>
                                    <h6 className='m-0 p-0 ms-5 text-truncate' style={{ fontFamily: "sans-serif", fontSize: "12px" }}>{folderDescription}</h6>
                                </div>
                            </Col> */}



                        </Row>
                    </div>
                </div>
                {(!isCollapsed) && (
                    <div className="sideBorderinner " >
                        {myAllFolder?.sort((a, b) => a.folderName.localeCompare(b.folderName)).sort((a, b) => {
                            const labels = sortingFolderForCabinet
                            const aIndex = labels.indexOf(a.folderName);
                            const bIndex = labels.indexOf(b.folderName);
                            return bIndex - aIndex;
                        })?.map((nestedFolder) => {
                            const subFolder = "SubFolder"
                            return (
                                <RecursiveFolderCom
                                    isOpen={false}
                                    key={nestedFolder.folderId}
                                    folder={nestedFolder}
                                    allFileForMapping={allFileForMapping}
                                    handleAddEditFolder={handleAddEditFolder}
                                    deleteFolderfun={deleteFolderfun}
                                    viewFileFun={viewFileFun}
                                    deleteFilefun={deleteFilefun}
                                    isSpecificDrawerSelect={isSpecificDrawerSelect}
                                    funForFileCalculation={funForFileCalculation}
                                    toggleCollapseFile={toggleCollapseFile}
                                    fileCollapseOpen={fileCollapseOpen}
                                    getFileValues={getFileValues}
                                    selectFolderId={selectFolderId}
                                    selectedClickfolderId={selectedClickfolderId}
                                    subFolder={subFolder}
                                    selectSubFolderId={selectSubFolderId}
                                    selectedClickSubfolderId={selectedClickSubfolderId}
                                    showOldFilesAgain={showOldFilesAgain}
                                    setShowOldFilesAgain={setShowOldFilesAgain}

                                />
                            )
                        })}
                    </div>
                )}
            </Col>

            {subFolder !== "SubFolder" && <hr class="borderBelowfolderStructure"></hr>}


        </Row>
    )

}


function recursionBredCrum(parentFolderIdR, allFolderList) {
    const bredCrum = [];

    if (parentFolderIdR !== 0) {
        const parentFolder = allFolderList?.find(item => item?.folderId === parentFolderIdR);

        if (parentFolder) {
            bredCrum.push(parentFolder?.folderName);
            const result = recursionBredCrum(parentFolder?.parentFolderId, allFolderList);
            bredCrum.push(...result);
        } else {
            konsole.log("Parent folder not found for folderId:", parentFolderIdR);
        }
    }

    return bredCrum;
}



const mapStateToProps = (state) => ({ ...state.main });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FolderStructure);