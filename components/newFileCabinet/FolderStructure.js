import React, { useContext, useRef } from 'react'
import { Row, Col, Form, Tooltip, OverlayTrigger, InputGroup, Modal, DropdownButton, Dropdown } from 'react-bootstrap'
import { FileCabinetContext } from './ParentCabinet'
import { useState } from 'react';
import konsole from '../control/Konsole.js';
import { folderOperationType, createCategoryObjJson, messageForPalaregalDrawerAccess, messageClientpermissions, messageAdminPermissions, messageParalegalpermissions, createFolderObjJson, categoryFileCabinet, sortingFolderForCabinet, accessToParalegal, paralegalAttoryId } from '../control/Constant.js';
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
import { isNotValidNullUndefile } from '../Reusable/ReusableCom.js';
import useUserIdHook from '../Reusable/useUserIdHook.js';


const FolderStructure = ({ functionAfterAddingAnyFolder, callApiCabinetFolder, callApiCabinetCategory, setManageShowFileTypeFromManageFile, dispatchloader, functionForGetFileAfterAddEditFile }) => {
    let loggedUserId = sessionStorage.getItem('loggedUserId')
    let primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
    let spouseUserId = sessionStorage.getItem('spouseUserId')

    const { _userDetailOfPrimary } = useUserIdHook()

    console.log("_userDetailOfPrimary", _userDetailOfPrimary)
    const { allMainCabinetContainer, fileInformation, setShowScreenType, sharedFileShatusList, setShowAddEditFolder, showAddEditFolder, allFolderList } = useContext(FileCabinetContext)
    const { setdata } = useContext(globalContext)
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
    const [selectedClickfolderId, setselectedClickfolderId] = useState(null)
    const [searchFolder, setSearchedFolders] = useState("")
    const [searchFiles, setSearchedFiles] = useState("")
    const [folderBredCrum, setFolderBredCrum] = useState([])
    konsole.log("allFolderListallFolderList", allFolderList)
    konsole.log('isSpecificDrawerSelectisSpecificDrawerSelect', allMainCabinetContainer)
    konsole.log('stateObjstateObj', stateObj.roleId)
    konsole.log('AlertToasterAlertToaster', AlertToaster)
    konsole.log("sharedFileShatusListsharedFileShatusList", sharedFileShatusList)
    konsole.log("selectFolderInfoselectFolderInfo", selectFolderInfo)
    // konsole.log("folderBredCrumfolderBredCrum",folderBredCrum)


    useEffect(() => {
        setNewCatetoryTypeList(allMainCabinetContainer)
        setCatetoryTypeList(allMainCabinetContainer)
    }, [])

    function getFileValues(userFileName, item, commonFile) {
        // konsole.log("XZXWEFDSZXCgetFILE",userFileName,item,commonFile)
        // setFileName(userFileName)
        setFileData(item)
        // setFommonFile(commonFile)
    }

    useEffect(() => {
        let fileInfoForMapping = [...fileInformation]
        konsole.log('fileInfoForMappingfileInfoForMapping', fileInfoForMapping)
        let filterSharedFile = sharedFileShatusList.length > 0 ? sharedFileShatusList?.filter(({ sharedUserId }) => sharedUserId == loggedUserId) : []
        konsole.log('filterSharedFileaaaa', filterSharedFile)
        // let filterParalegalUploadedBy = fileInformation.length > 0 ? fileInformation.filter(({ fileUploadedBy }) => fileUploadedBy == loggedUserId) : []
        if (paralegalAttoryId?.includes(stateObj?.roleId) && filterSharedFile?.length !== 0) {
            fileInfoForMapping = [...filterSharedFile]
            let newArr = []
            for (let [index, item] of filterSharedFile?.entries()) {
                for (let i = 0; i < fileInformation.length; i++) {
                    konsole.log('fileIdfileId', filterSharedFile[index]?.fileId == fileInformation[i]?.fileId)
                    if (filterSharedFile[index]?.fileId == fileInformation[i]?.fileId) {
                        newArr.push({ ...filterSharedFile[index], ...fileInformation[i] })
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

    }, [sharedFileShatusList, fileInformation])

    //  handle delete Folder ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const deleteFolderfun = async (item, file) => {
        konsole.log('itemitem', item, item?.folder)
        let { folderId, folderRoleId, folderSubtenantId, folderName, folderFileCategoryId, folderCreatedByRoleId, folderCreatedBy } = item
        let messageForParalegalNAdmin = (paralegalAttoryId?.includes(stateObj?.roleId) || folderFileCategoryId !== categoryFileCabinet[0]) ? messageAdminPermissions : messageParalegalpermissions
        if (folderCreatedByRoleId == '4' || folderCreatedByRoleId == '11') {
            toasterAlert(messageForParalegalNAdmin);
            return;
        }
        if (paralegalAttoryId.includes(stateObj?.roleId) && !(paralegalAttoryId?.includes(folderCreatedByRoleId) || item?.deleteFolder == true)) {
            toasterAlert(messageClientpermissions);
            return;
        }

        if (!paralegalAttoryId.includes(stateObj?.roleId) && folderCreatedByRoleId == '3') {
            toasterAlert(messageForParalegalNAdmin);
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
        const question = await context.confirm(true, "Are you sure? you want to delete this folder", "Confirmation");
        konsole.log('questionquestionquestion', question)
        if (question == false) return;
        // return;
        let roleId = stateObj.roleId;
        dispatchloader(true)
        deleteFileCabinetFolderFun(jsonObj)
    }


    const deleteFileCabinetFolderFun = (jsonObj) => {
        dispatchloader(true)
        Services.deleteFileCabinetFolder({ ...jsonObj }).then((res) => {
            konsole.log('res of deleting folder', res)
            AlertToaster.success('Folder deleted successfully')
            // window.location.reload()
            functionAfterAddingAnyFolder()
        }).catch((err) => {
            dispatchloader(false)
            let messagea = "Sorry Folder/Subfolder can not be deleted as it has document/documents associated with it."
            toasterAlert(messagea)
            konsole.log('err in deleting folder', err)
        })

    }
    const deleteFilefun = async (item) => {
        let { fileId, primaryUserId, fileCabinetId, fileCategoryId, fileTypeId, fileUploadedBy, isDelete } = item

        if (paralegalAttoryId.includes(stateObj?.roleId) && !(fileUploadedBy == loggedUserId || isDelete == true)) {
            toasterAlert(messageClientpermissions);
            return;
        } else if (!paralegalAttoryId.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) {
            toasterAlert(messageParalegalpermissions);
            return;
        }
        // let josnObj = { "userId": primaryUserId, "fileCategoryId": Number(fileCategoryId), "fileTypeId": Number(fileTypeId), "fileId": Number(fileId), "deletedBy": loggedUserId }
        let josnObj = { "userId": primaryUserId, "fileCabinetId": Number(fileCategoryId), "fileTypeId": Number(fileTypeId), "fileId": Number(fileId), "deletedBy": loggedUserId }
        konsole.log('josnObj', josnObj, item)
        konsole.log('itemitemitemitem', item)
        const question = await context.confirm(true, "Are you sure? you want to delete this file.", "Confirmation");
        if (question == false) return;
        // return
        dispatchloader(true)
        Services.deleteFileCabinetByFileId(josnObj).then((res) => {
            konsole.log('res of file deleting ', res)
            dispatchloader(false)
            AlertToaster.success('Document deleted successfully')
            // window.location.reload()
            functionForGetFileAfterAddEditFile()
        }).catch((err) => {
            dispatchloader(false)
            konsole.log('err in deling file ', err)
        })

    }



    //  handle Category List------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const handleCategory = (index, item, type, specificCategory) => {
        topSchroll()
        setShowScreenType('')
        setShowAddEditFolder('')
        setselectedClickfolderId(null)
        setManageShowFileTypeFromManageFile('')
        if (type == 'customMapping') {
            setSelectIndexOfCategory(index)
            let filterSelectCategory = newCategoryTypeList?.filter(({ fileCategoryId }) => fileCategoryId == item?.fileCategoryId)
            setCatetoryTypeList(filterSelectCategory)
        } else {
            setSelectIndexOfCategory(index)
            setCatetoryTypeList(newCategoryTypeList)
        }
        setIsSpecificDrawerSelect(specificCategory)
        setSelectedFolderFiles([])
        // konsole.log("rwvsdcx ", item)
        // setSelectedFolderInfo(item) //selcted category info
    }
    // konsole.log("selectedFolderInfoselectedFolderInfo",categoryTypeList[0]?.fileCategoryType,isSpecificDrawerSelect)

    //  handle Add Edit Folder -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    const AddNewFile = () => {
        // konsole.log("selectedClicklectedClickfolderId",selectedClickfolderId)
        if (selectedClickfolderId != null) {
            let getSelectedFolderData = selectedClickfolderId && allFolderList?.find((item) => {
                // konsole.log("cxcxcxdczx",item.folderId,selectedClickfolderId)
                if (item?.folderId == selectedClickfolderId) { return item }
            })
            handleAddEditFolder('File', 'Add', getSelectedFolderData, null, 'ManageAllFile', 'Folder', 'Folder')
        }
        else {
            toasterAlert("Please select a Cabinet Folder ");
        }
    }

    function seachFolders(e) {
        // konsole.log("eeeeecemyAllFoldermyAllFolder",e?.target?.value)  
        setSearchedFolders(e?.target?.value)
    }

    function searchFilesFunction(e) {
        // konsole.log("eeeeecemyAllFoldermyAllFolder",e?.target?.value)  
        setSearchedFiles(e?.target?.value)
    }


    const handleAddEditFolder = (show, action, value, previousarray, refrencePage, manageFileType, fileAddFrom) => {
        // konsole.log('showshowshow:', show, "action:", action, "valuevalue", value)
        let messageForParalegalNAdmin = (paralegalAttoryId?.includes(stateObj?.roleId) || (value?.folderFileCategoryId !== undefined && value?.folderFileCategoryId !== categoryFileCabinet[0])) ? messageAdminPermissions : messageParalegalpermissions

        if (show == 'Folder' && (value?.folderCreatedByRoleId == 4 || value?.folderCreatedByRoleId == 11)) {
            toasterAlert(messageForParalegalNAdmin);
            return;
        }
        if (show == 'Folder' && !paralegalAttoryId?.includes(stateObj.roleId) && value?.folderCreatedByRoleId == '3') {
            toasterAlert(messageForParalegalNAdmin);
            return;

        }
        if (show == 'File' && action == 'Add' && !paralegalAttoryId.includes(stateObj?.roleId) && value?.folderCreatedByRoleId == '3') {
            toasterAlert(messageForParalegalNAdmin);
            return;
        }
        if (show == 'File' && action == 'Add' && (value?.folderCreatedByRoleId == 4 || value?.folderCreatedByRoleId == 11) && !paralegalAttoryId?.includes(stateObj?.roleId)) {
            toasterAlert(messageForParalegalNAdmin);
            return;
        }
        if (show == 'Folder' && value?.folderCreatedByRoleId == '9' && action == 'Add' && value?.createSubFolder == false) {
            toasterAlert(messageClientpermissions);
            return;
        }
        if (show == 'Folder' && value?.folderCreatedByRoleId == '9' && action == 'Edit' && value?.editFolder == false) {
            toasterAlert(messageClientpermissions);
            return;
        }
        if (show == 'File' && value?.folderCreatedByRoleId == '9' && action == 'Add' && value?.fileUpload == false) {
            toasterAlert(messageClientpermissions);
            return;
        }
        if (show == 'File' && action == 'Edit' && paralegalAttoryId?.includes(stateObj.roleId) && value?.fileUploadedBy !== loggedUserId) {
            if (value.isEdit == false) {
                toasterAlert(messageClientpermissions);
                return
            }
        }
        if (show == 'File' && action == 'Edit' && !paralegalAttoryId?.includes(stateObj.roleId) && value?.fileUploadedBy !== loggedUserId) {
            toasterAlert(messageForParalegalNAdmin);
            return
        }

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
    function toasterAlert(text) {
        setdata({ open: true, text: text, type: "Warning" });
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
        setSelectedFolderFiles(getSelectedFolderFiles)
        makeBrudCrum(id)
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
    const getfolderName = () => {
        if (selectedClickfolderId && allFolderList.length > 0) {
            let getSelectedFoldersName = selectedClickfolderId && allFolderList?.find((item) => {
                // konsole.log("cxcxcxdczx",item.folderId,selectedClickfolderId)
                if (item?.folderId == selectedClickfolderId) { return item }
            })
            // konsole.log("fddfdxcgetFoldersNamegetFoldersName",getSelectedFoldersName?.folderName,getSelectedFoldersName)
            return (getSelectedFoldersName?.folderName)
        }
    }

    // konsole.log("foledffdsxc",allFolderList)

    function fileSharedToPeople(fileId) {
        // konsole.log('fileId',fileId)
        const sharedFileCount = sharedFileShatusList?.filter((item) => item?.fileId == fileId && item?.isRead == true)
        // konsole.log("sharedFileCount",sharedFileCount)
        return sharedFileCount?.length;
    }


    const filesHtml = () => {

        let getSelectedFolderFiles = allFileForMapping?.filter(({ folderId }) => folderId == selectedClickfolderId)
        // konsole.log("getSelectedFolderFilesgetSelectedFolderFilesbefore",getSelectedFolderFiles)
        if (searchFiles != "") { getSelectedFolderFiles = getSelectedFolderFiles?.filter(value => value?.userFileName?.toLowerCase()?.includes(searchFiles?.toLowerCase())) }
        const { primaryMemberFile, myprimaryFIle, spouseFile, commonFile } = funForFileCalculation(getSelectedFolderFiles)
        const totalNumberOfFiles = () => {
            let totalFilesCount = myprimaryFIle?.length + spouseFile?.length + commonFile?.length;
            // konsole.log("totalFilesCounttotalFilesCount",totalFilesCount)
            return totalFilesCount
        }

        console.log("myprimaryFIlemyprimaryFIle", spouseFile, myprimaryFIle)
        const getSignOffAndUploadedDate = (date) => {
            if (date) {
                let getSplittedDate = date?.split("T")[0]
                getSplittedDate = getSplittedDate?.split("-");
                const formattedDate = `${getSplittedDate[1]}-${getSplittedDate[2]}-${getSplittedDate[0]}`;
                return formattedDate;
            }
        }

        return (
            <>

                <div className='manageFolderStyleBordeForFile row'>
                    <div className='col-12'>
                        <p><img src="./Group.png" className='cursor-pointer' style={{ width: "20px", height: "17px", margin: "4px 9px 9px -1px" }} /><span>{getfolderName()} ({totalNumberOfFiles()})</span></p>
                    </div>
                    <div className='col d-flex justify-content-start'>
                        <nav style={{ bsBreadcrumbDivider: '>' }} aria-label="breadcrumb">
                            <ol class="breadcrumb pathOfFileInFileCabinet mb-1 mt-2">
                                <li class="breadcrumb-item d-flex"><a href="#">All folders</a></li>
                                {
                                    folderBredCrum.map((item, index) => <>
                                        <li className={`breadcrumb-item d-flex ${(folderBredCrum.length == (index + 1)) ? "active" : ""}`} ><a href="#">{item}</a></li>
                                    </>)
                                }
                                {/* <li class="breadcrumb-item"><a href="#">All folders</a></li> 
                                        <li class="breadcrumb-item"><a href="#">Life Point Law</a></li>
                                        <li class="breadcrumb-item"><a href="#">Life Plan</a></li>
                                        <li class="breadcrumb-item active">Current</li> */}
                            </ol>
                        </nav>
                        {/* <div className='cursor-pointer addFileButton' >
                                     <p className='d-flex justify-content-center' 
                                     onClick={() => {AddNewFile()}}
                                    ><img src="/icons/WhiteAddIconWithoutMaroonborder.svg" className='maroonAddFolderIcon'></img><span className='text-right d-flex justify-content-center align-items-center'>Add File</span></p>
                                     </div>  */}
                    </div>
                </div>

                <div className='row manageSearhFileInput'>
                    <InputGroup className=" mt-2 mb-2 w-100 p-0" >
                        <InputGroup.Text id="basic-addon2"><img src="./icons/search-icon.svg" className='mt-0' style={{ padding: " 0px 5px" }}></img></InputGroup.Text>
                        <Form.Control
                            className="cabinetFileSearchox"
                            placeholder="Search Document"
                            value={searchFiles}
                            id="searchFiles"
                            onChange={searchFilesFunction}
                        />
                    </InputGroup>
                </div>
                {/* Primaryyyyyy */}

                {myprimaryFIle && myprimaryFIle?.length > 0 && <>
                    <div className='row mt-4'>
                        <h1 className='filesPrimaryHeading'>{_userDetailOfPrimary && _userDetailOfPrimary?.memberName?.toUpperCase()}</h1>
                    </div>
                    <div className='row filesTableHeadings pb-2 pt-4'>
                        <div className='col-8 p-0'>
                            <p>Document</p>
                        </div>
                        <div className='col'>
                            <p>Shared</p>
                        </div>
                    </div>
                </>}

                {myprimaryFIle?.length > 0 && myprimaryFIle?.map((item, index) => {

                    let { fileId, primaryUserId, fileCabinetId, fileCategoryId, fileTypeId, fileUploadedBy, isDelete, dateFinalized } = item
                    const isJoint = commonFile?.some(obj => obj?.fileId == fileId);
                    const isDeleeFileAllow = (paralegalAttoryId?.includes(stateObj?.roleId) && !(fileUploadedBy == loggedUserId || isDelete == true)) ? false : (!paralegalAttoryId?.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) ? false : true;
                    const isEditFileAllow = (paralegalAttoryId?.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) ? false : (!paralegalAttoryId?.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) ? false : true;
                    // konsole.log("itemitemFileId",item)
                    return (<>
                        <div className='row p-3 pt-1' key={index}>
                            <div className='col-1 p-0 cursor-pointer d-flex justify-content-center align-items-center' onClick={() => viewFileFun(item)}>
                                <img src="/icons/pdf-File-Image.svg" className="pdfOrDocImage  "></img>
                            </div>
                            <div className='col-7 p-2 pdfNameandDates d-flex align-items-center'>
                                <div className='w-100'>
                                    <p className='pdfName text-truncate'>{item?.userFileName}</p>
                                    <span className='border-right'>Sign-off: {item?.dateFinalized ? getSignOffAndUploadedDate(item?.dateFinalized) : "Not Mentioned* "}</span><span className='leftBorderUpdatedDate'>Updated: {item?.uploadedOn ? getSignOffAndUploadedDate(item?.uploadedOn) : "Not Mentioned "}</span>
                                    <p className='fileDocumentTypeText'>{item?.fileTypeName}</p>
                                </div>
                            </div>
                            <div className='col-3 p-1 m-0 accessToPeople d-flex justify-content-start align-items-center'>
                                <p><img
                                    src="/icons/PeopleGroupIcon.svg"
                                    className='mt-0 '></img>{fileSharedToPeople(item?.fileId)} People</p>
                            </div>
                            <div className='col-1 d-flex justify-content-center align-items-center'>
                                <Dropdown className='cabinetOptionsList'>
                                    <Dropdown.Toggle id="DropdownForFiles" variant="secondary">
                                        <img src="./icons/vertical-triple-Dots.svg"></img>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item className='border-bottom' onClick={() => viewFileFun(item)}><span className=' cursor-pointer'><img src="./icons/viewFileicon.svg"></img>  View</span> </Dropdown.Item>
                                        {(isEditFileAllow) && <Dropdown.Item className='border-bottom' onClick={() => handleAddEditFolder('File', 'Edit', item, " ", 'ManageAllFile', 'Folder', 'Folder')}><span className=' cursor-pointer'><img src="./icons/editIcon.svg"></img> Edit</span></Dropdown.Item>}
                                        {(isDeleeFileAllow) && <Dropdown.Item className='border-bottom' onClick={() => deleteFilefun(item)}><span className=' cursor-pointer'><img src="./icons/reddeleteIcon.svg"></img>  Delete</span></Dropdown.Item>}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </>)

                })}

                {/* SPOUSE */}

                {spouseFile && spouseFile?.length > 0 && <>

                    <div className='row mt-4'>
                        <h1 className='filesPrimaryHeading'>{_userDetailOfPrimary && _userDetailOfPrimary?.spouseName?.toUpperCase()} </h1>
                    </div>
                    <div className='row filesTableHeadings pb-2 pt-4'>
                        <div className='col-8 p-0'>
                            <p>Document</p>
                        </div>
                        <div className='col'>
                            <p>Shared</p>
                        </div>
                    </div>
                </>}

                {spouseFile?.length > 0 && spouseFile?.map((item, index) => {

                    let { fileId, primaryUserId, fileCabinetId, fileCategoryId, fileTypeId, fileUploadedBy, isDelete, dateFinalized } = item
                    const isJoint = commonFile?.some(obj => obj?.fileId == fileId);
                    const isDeleeFileAllow = (paralegalAttoryId?.includes(stateObj?.roleId) && !(fileUploadedBy == loggedUserId || isDelete == true)) ? false : (!paralegalAttoryId.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) ? false : true;
                    const isEditFileAllow = (paralegalAttoryId?.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) ? false : (!paralegalAttoryId.includes(stateObj?.roleId) && fileUploadedBy !== loggedUserId) ? false : true;

                    return (
                        <div className='row p-3 pt-1' key={index}>
                            <div className='col-1 p-0 cursor-pointer d-flex justify-content-center align-items-center ' onClick={() => viewFileFun(item)}>
                                <img src="/icons/pdf-File-Image.svg" className="pdfOrDocImage  "></img>
                            </div>
                            <div className='col-7 p-2 pdfNameandDates d-flex align-items-center'>
                                <div className='w-100'>
                                    <p className='pdfName text-truncate'>{item?.userFileName}</p>
                                    <span className='border-right'>Sign-off: {item?.dateFinalized ? getSignOffAndUploadedDate(item?.dateFinalized) : "Not Mentioned* "}</span><span className='leftBorderUpdatedDate'>Updated: {item?.uploadedOn ? getSignOffAndUploadedDate(item?.uploadedOn) : "Not Mentioned "}</span>
                                    <p className='fileDocumentTypeText'>{item?.fileTypeName}</p>
                                </div>
                            </div>
                            <div className='col-3 p-1 m-0 accessToPeople d-flex justify-content-start align-items-center'>
                                <p><img
                                    src="/icons/PeopleGroupIcon.svg"
                                    className='mt-0 '></img>{fileSharedToPeople(item?.fileId)} People</p>
                            </div>
                            <div className='col-1 d-flex justify-content-center align-items-center'>

                                <Dropdown className='cabinetOptionsList'>
                                    <Dropdown.Toggle id="DropdownForFiles" variant="secondary">
                                        <img src="./icons/vertical-triple-Dots.svg"></img>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item className='border-bottom' onClick={() => viewFileFun(item)}><span className=' cursor-pointer'><img src="./icons/viewFileicon.svg"></img>  View</span> </Dropdown.Item>
                                        {(isEditFileAllow) && <Dropdown.Item className='border-bottom' onClick={() => handleAddEditFolder('File', 'Edit', item, " ", 'ManageAllFile', 'Folder', 'Folder')}><span className=' cursor-pointer'><img src="./icons/editIcon.svg"></img> Edit</span></Dropdown.Item>}
                                        {/* <Dropdown.Item className='border-bottom'><img src="./icons/Forwardicon.svg"></img> <span className=' cursor-pointer'> Forward</span></Dropdown.Item>
                                    <Dropdown.Item className='border-bottom'><img src="./icons/PrintIcon.svg"></img> <span className=' cursor-pointer'> Print</span></Dropdown.Item> */}
                                        {(isDeleeFileAllow) && <Dropdown.Item className='border-bottom' onClick={() => deleteFilefun(item)}><span className=' cursor-pointer'><img src="./icons/reddeleteIcon.svg"></img>  Delete</span></Dropdown.Item>}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    )
                })}

                {/* JOINT */}

                {commonFile && commonFile?.length > 0 && <>
                    <div className='row mt-4'>
                        <h1 className='filesPrimaryHeading'>JOINT</h1>
                    </div>
                    <div className='row filesTableHeadings pb-2 pt-4'>
                        <div className='col-8 p-0'>
                            <p>Document</p>
                        </div>
                        <div className='col'>
                            <p>Shared</p>
                        </div>
                    </div>
                </>}

                {commonFile?.length > 0 && commonFile?.map((item, index) => {
                    // konsole.log("itemitemFileId",item)
                    return (<>
                        <div className='row p-3 pt-1' key={index}>
                            <div className='col-1 p-0 cursor-pointer d-flex justify-content-center align-items-center' onClick={() => viewFileFun(item)}>
                                <img src="/icons/pdf-File-Image.svg" className="pdfOrDocImage  "></img>
                            </div>
                            <div className='col-7 p-2 pdfNameandDates d-flex align-items-center'>
                                <div className='w-100'>
                                    <p className='pdfName text-truncate'>{item?.userFileName}</p>
                                    <span className='border-right'>Sign-off: {item?.dateFinalized ? getSignOffAndUploadedDate(item?.dateFinalized) : "Not Mentioned* "}</span><span className='leftBorderUpdatedDate'>Updated: {item?.uploadedOn ? getSignOffAndUploadedDate(item?.uploadedOn) : "Not Mentioned "}</span>
                                    <p className='fileDocumentTypeText'>{item?.fileTypeName}</p>
                                </div>
                            </div>
                            <div className='col-3 p-1 m-0 accessToPeople d-flex justify-content-start align-items-center'>
                                <p><img
                                    src="/icons/PeopleGroupIcon.svg"
                                    className='mt-0 '></img>{fileSharedToPeople(item?.fileId)} People</p>
                            </div>
                            <div className='col-1 d-flex justify-content-center align-items-center'>
                                <Dropdown className='cabinetOptionsList'>
                                    <Dropdown.Toggle id="DropdownForFiles" variant="secondary">
                                        <img src="./icons/vertical-triple-Dots.svg"></img>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item className='border-bottom' onClick={() => viewFileFun(item)}><span className=' cursor-pointer'><img src="./icons/viewFileicon.svg"></img>  View</span> </Dropdown.Item>
                                        <Dropdown.Item className='border-bottom' onClick={() => handleAddEditFolder('File', 'Edit', item, " ", 'ManageAllFile', 'Folder', 'Folder')}><span className=' cursor-pointer'><img src="./icons/editIcon.svg"></img> Edit</span></Dropdown.Item>
                                        {/* <Dropdown.Item className='border-bottom'><img src="./icons/Forwardicon.svg"></img> <span className=' cursor-pointer'> Forward</span></Dropdown.Item>
                                    <Dropdown.Item className='border-bottom'><img src="./icons/PrintIcon.svg"></img> <span className=' cursor-pointer'> Print</span></Dropdown.Item> */}
                                        <Dropdown.Item className='border-bottom' onClick={() => deleteFilefun(item)}> <span className=' cursor-pointer'><img src="./icons/reddeleteIcon.svg"></img> Delete</span></Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </>)

                })}

                {totalNumberOfFiles() == 0 && <div className='divForNoFilesSearched'>
                    <div className='row justify-content-center'>
                        <img src="/icons/emptyFilesImage.svg" className='d-block m-auto'></img>
                        <p className=' text-center'>Searched documents not found </p>
                        <div>
                        </div>
                    </div>
                </div>
                }


            </>
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


    //  konsole---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    return (
        <>
            <div className='mt-3'>
                <Row className='p-0 m-auto folderStructureMainRowWith' >
                    <Col md='2' lg="2" className='CabinetFolderDiv border-top'>
                        <Row className='p-0 m-0'>
                            <Col className='p-0 m-0'>
                                <div>
                                    <Row>
                                        <Col>  <h4 className='manageCabinetHeading'>Manage Drawer </h4> </Col>
                                    </Row>
                                    <div className='file-cabinet-file' style={{ zIndex: 0 }}>
                                        <div className="d-flex flex-column align-items-center justify-content-center" id=''>
                                            {allMainCabinetContainer?.length > 0 && <>
                                                <Row>
                                                    <Col className='p-0' style={{ margin: "14px 9px 14px" }}>
                                                        <div className='File_cabinate_category'>
                                                            {/* <h6 className="m-0 p-0" style={{ cursor: "pointer" }}>Category</h6> */}
                                                        </div>
                                                        <div className=''>
                                                            <div className='d-flex flex-column align-items-center justify-content-center '>
                                                                {allMainCabinetContainer?.sort((a, b) => a?.fileCabinetOrder - b?.fileCabinetOrder)?.map((item, index) => <>
                                                                    <div className={`${(selectIndexOfCategory === index) ? "mainDivFileCabinetFolderDesignOpen" : "mainDivFileCabinetFolderDesignClose"}`}>
                                                                        <img src="./icons/random 1.png" className='openCabinetFolder' style={{ display: selectIndexOfCategory === index ? 'block' : 'none' }} />
                                                                        <button className={`buttonCard`} key={index} onClick={() => handleCategory(index, item, 'customMapping', true)} >
                                                                            <p className='text-truncate'>{item?.fileCategoryType}</p>
                                                                            <span className='underlineUnderBox border border-secondary'></span>
                                                                        </button>
                                                                    </div>
                                                                </>)}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                {/* <Row className='' >
                                                        <Col className='m-0 p-0 m-2'>
                                                            <h6 className="m-0 p-0" style={{ cursor: "pointer" }} onClick={() => handleCategory('', '', 'viewAll', false)} >View All</h6>
                                                        </Col>
                                                    </Row> */}
                                            </>}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>

                    {/* -------------------Manage Folders------------------- */}

                    <Col md='4' lg="4" className="ManageFoldersBorder ">

                        <div className='row manageFolderStyleBorde'>
                            <p className='p-0'><img src="./icons/mangeSubscriptonImage.svg"></img><span>Manage Folders</span></p>
                        </div>

                        {selectIndexOfCategory !== null ? <div >
                            <div className='row manageFolderStyleBordeName'>
                                <p className='p-0'>
                                    {
                                        categoryTypeList?.length > 0 &&
                                        (() => {
                                            switch (categoryTypeList[0]?.fileCategoryId) {
                                                case 3: return <img src="healthblack.svg" />;
                                                case 6: return <img src="legalblack.svg" />;
                                                case 5: return <img src="financeblack.svg" />;
                                                case 2: return <img src="familyblack.svg" />;
                                                case 4: return <img src="housingblack.svg" />;
                                                default: return <img src="./icons/drawer.png" />;
                                            }
                                        })()
                                    }
                                    <span>{categoryTypeList?.length > 0 && categoryTypeList[0]?.fileCategoryType} Drawer</span></p>
                            </div>
                            <div className='row'>
                                <div
                                // id='scrollToTopScreen'
                                >
                                    <Modal size="lg" centered animation="false" backdrop="static" className='modalForFileAndFolder' show={(showAddEditFolder == 'Folder' || showAddEditFolder == 'File')} onHide={() => setShowAddEditFolder('')}>
                                        <Modal.Header closeButton closeVariant="white" className='styleAddEditModalHeader'>
                                            <Modal.Title className='d-flex'>
                                                {actionType == "Add" ? <><img src="/icons/AddFileIcon.svg" className='AddEditFileIcon'></img><span className='actionTypeStyling'>{actionType} {showAddEditFolder}</span>
                                                </> : <>
                                                    <img src="/icons/EditFileIcon.svg" className='AddEditFileIcon'></img>
                                                    <span className='actionTypeStyling'>{actionType} {showAddEditFolder}</span>
                                                </>}
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body className='pb-0' style={{ bordeRadius: " 9px" }}>
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
                                                    /> : ''}

                                        </Modal.Body>
                                    </Modal>
                                </div>
                                {isFileOpen && <FileViewer isFileOpen={isFileOpen} setIsFileOpen={setIsFileOpen} openFileInfo={openFileInfo} />}
                                <div className='mb-2' >
                                    {mapFolderNFile()}
                                </div>
                            </div>
                        </div>
                            :
                            <div className='divForNoFiles'>
                                <div className='row justify-content-center'>
                                    <img src="/icons/emptyFilesImage.svg" className='d-block m-auto'></img>
                                    <p className=' text-center'>Select a cabinet to view associated folders</p>
                                </div>
                            </div>
                        }
                    </Col>

                    {/* ---------------------Manage Files------------------- */}
                    <Col className='border-top ManageFilesMainDiv'>
                        <div className='row manageFolderStyleBorde ' >
                            <p className='p-0'><img src="./icons/mangeSubscriptonImage.svg"></img><span>Manage Document</span></p>
                        </div>
                        {selectedFolderFiles.length > 0 ?
                            <div >
                                <div>
                                    {filesHtml()}
                                </div>
                            </div> :

                            //  ------No File------

                            <div className='divForNoFiles'>
                                <div className='row justify-content-center'>
                                    <img src="/icons/emptyFilesImage.svg" className='d-block m-auto'></img>
                                    <p className=' text-center'>There are no documents present in this folder, Choose another folder</p>
                                    {selectIndexOfCategory !== null && selectedClickfolderId ? <>
                                        {/* <p className='text-center'>or</p>
                                    <div className='cursor-pointer addFileButtonInManageFiles d-flex justify-content-center align-items-center' >
                                    <p className='d-flex justify-content-center pt-2'  onClick={() => {AddNewFile()}}><img src="/icons/WhiteAddIconWithoutMaroonborder.svg" className='maroonAddFolderIcon'style={{marginTop:"-2px"}}></img><span className='text-right ' style={{whiteSpace:"nowrap"}}>Add File</span></p> */}
                                        {/* </div> */}
                                    </> : <>  </>
                                    } <div>

                                    </div>
                                </div>
                            </div>
                        }
                    </Col>
                </Row>
            </div>
        </>
    )



    function mapFolderNFile() {
        return categoryTypeList?.length > 0 && categoryTypeList?.sort((a, b) => a?.fileCabinetOrder - b?.fileCabinetOrder)?.map((fileCab, index) => {
            konsole.log("fileCabshow", fileCab);
            const { fileCategoryType, categoryDescription, folder, ...rest } = fileCab;
            let myAllFolder = (!paralegalAttoryId.includes(stateObj.roleId)) ? folder : folder?.filter(({ sharedUserId }) => sharedUserId == loggedUserId)
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


            if (isSpecificDrawerSelect == false) return;
            return (
                <>
                    {myAllFolder?.length > 0 ? <>
                        <div className='row p-0' style={{ width: "98%", margin: " 0px 4px" }}>
                            <InputGroup className="mb-3 w-100 p-0" >
                                <Form.Control className="cabinetSerchBox" placeholder="Search Folders" onChange={seachFolders} />
                                <InputGroup.Text id="basic-addon2" className="cabinetSerchBoxIcon"><img src="./icons/search-icon.svg" className='mt-0' style={{ padding: " 0px 6px", height: "15px" }}></img></InputGroup.Text>
                            </InputGroup>
                        </div>
                    </> : <></>}

                    <Row className='pb-1 p-0 m-0 justify-content-between'>
                        {myAllFolder?.length > 0 ? <>
                            <div className='col-6' ><span className='allFoldersHeading'>
                                All Folders ({myAllFolder
                                    ?.filter(folder => folder?.folderName?.toLowerCase().includes(searchFolder?.toLowerCase()))
                                    ?.sort((a, b) => a?.folderName?.localeCompare(b?.folderName))?.length})
                            </span></div>
                            {(!paralegalAttoryId.includes(stateObj.roleId)) && <div className='col-4 p-0 d-flex justify-content-end align-items-center cursor-pointer' onClick={() => handleAddEditFolder('Folder', 'Add', fileCab, '', 'ManageAllFile', 'Folder')}><img src="/icons/maroonAddIcon.svg" className='maroonAddFolderIcon m-0 d-flex justify-content-center align-items-center'></img><span className='text-right addFolderHeading pl-2'>Add Folder</span></div>} </> : <> </>}
                    </Row>

                    <Row className='mt-1 ms-3'>
                        {(categoryOpenStates[index] || isSpecificDrawerSelect == true) && (
                            <Col className='p-0'>
                                {myAllFolder?.length > 0 ? <>
                                    <div className='sideBorder'>
                                        {myAllFolder
                                            ?.filter(folder => folder.folderName.toLowerCase().includes(searchFolder.toLowerCase()))
                                            ?.sort((a, b) => a.folderName.localeCompare(b.folderName))?.sort((a, b) => {
                                                const labels = sortingFolderForCabinet
                                                const aIndex = labels.indexOf(a.folderName);
                                                const bIndex = labels.indexOf(b.folderName);
                                                return bIndex - aIndex;
                                            })?.map((folder) => (
                                                <RecursiveFolderCom
                                                    key={folder.folderId}
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
                                                />
                                            ))}

                                    </div>
                                </>
                                    :
                                    <div className='divForNoFiles'>
                                        <div className='row justify-content-center'>
                                            <img src="/icons/emptyFilesImage.svg" className='d-block m-auto'></img>
                                            <p className=' text-center'>{paralegalAttoryId.includes(stateObj.roleId) ? messageForPalaregalDrawerAccess : messageAdminPermissions}There are no folders present in this cabinet</p>
                                            {(!paralegalAttoryId.includes(stateObj.roleId)) && <div className='cursor-pointer addFileButtonInManageFolders d-flex justify-content-center align-items-center mt-2' onClick={() => handleAddEditFolder('Folder', 'Add', fileCab, '', 'ManageAllFile', 'Folder')} >
                                                <p className='d-flex justify-content-center pt-1'><img src="/icons/WhiteAddIconWithoutMaroonborder.svg" className='maroonAddFolderIcon' ></img><span className='text-right d-flex justify-content-center align-items-center'> Add Folder</span></p>
                                            </div>}
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


const RecursiveFolderCom = ({ selectFolderId, fileCollapseOpen, toggleCollapseFile, funForFileCalculation, isSpecificDrawerSelect, folder, allFileForMapping, handleAddEditFolder, deleteFolderfun, viewFileFun, deleteFilefun, getFileValues, selectedfolderId, selectedClickfolderId }) => {

    const { folderName, folderDescription, folderId, folderFileCategoryId, displayOrder, level, fileCategoryIdfolder } = folder
    konsole.log("fileCollapseOpenfileCollapseOpen", folderName, folderDescription, folderId, folderFileCategoryId, displayOrder, level, fileCategoryIdfolder)
    const stateObj = $AHelper.getObjFromStorage("stateObj");
    let loggedUserId = sessionStorage.getItem('loggedUserId')
    const primaryMemberId = sessionStorage.getItem('SessPrimaryUserId')
    const spouseUserId = sessionStorage.getItem('spouseUserId')
    const { primaryMemberFile, spouseFile, commonFile } = funForFileCalculation(fileFilter)
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [addBorder, setAddBorder] = useState("addPaddingOnFolderSelection")
    let myAllFolder = (!paralegalAttoryId.includes(stateObj.roleId)) ? folder.folder : folder.folder?.filter(({ sharedUserId }) => sharedUserId == loggedUserId)
    let fileFilter = allFileForMapping.length > 0 ? allFileForMapping?.filter(item => item.folderId == folderId) : []
    konsole.log("folderId", folderId)

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

    useEffect(() => {
        // setIsCollapsed(!isSpecificDrawerSelect)
    }, [isSpecificDrawerSelect])

    konsole.log("selectedfolderIdselectedfolderId", selectedfolderId)

    const funForAddEditDelete2 = (d, previousarray, fileFilter) => {

        if (d?.folderFileCategoryId == categoryFileCabinet[0] && d?.folder.length !== 0) return;
        const { folderCreatedByRoleId, createSubFolder, editFolder, fileUploadedBy, isEdit, deleteFolder, fileUpload } = d
        const isAllowAddFolder = (folderCreatedByRoleId == 4 || folderCreatedByRoleId == 11) ? false : (!paralegalAttoryId.includes(stateObj.roleId) && folderCreatedByRoleId == '3') ? false : (folderCreatedByRoleId == '9' && createSubFolder == false) ? false : true;
        const isAllowEditFolder = (folderCreatedByRoleId == 4 || folderCreatedByRoleId == 11) ? false : (!paralegalAttoryId.includes(stateObj.roleId) && folderCreatedByRoleId == '3') ? false : (folderCreatedByRoleId == '9' && editFolder == false) ? false : true;
        const isAllowDeleteFolder = (folderCreatedByRoleId == '4' || folderCreatedByRoleId == '11') ? false : (paralegalAttoryId.includes(stateObj.roleId) && !(paralegalAttoryId.includes(folderCreatedByRoleId) || deleteFolder == true)) ? false : (!paralegalAttoryId.includes(stateObj.roleId) && folderCreatedByRoleId == '3') ? false : true;
        const isAllowDocument = (!paralegalAttoryId.includes(stateObj.roleId) && folderCreatedByRoleId == '3') ? false : ((folderCreatedByRoleId == 4 || folderCreatedByRoleId == 11) && !paralegalAttoryId.includes(stateObj.roleId)) ? false : (folderCreatedByRoleId == '9' && fileUpload == false) ? false : true;
        return (<>
            <Col >
                {
                    ((isAllowAddFolder) || (isAllowDocument) || (isAllowEditFolder) || (isAllowDeleteFolder)) &&
                    <>
                        <Dropdown className='cabinetOptionsList' style={{ marginTop: "5px", marginLeft: "9px" }}>
                            <Dropdown.Toggle id="dropdown-button-dark-example1" variant="secondary" className='mt-0'>
                                <img src="./icons/vertical-triple-Dots.svg"></img>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {(isAllowAddFolder) && <Dropdown.Item className='border-bottom' onClick={() => handleAddEditFolder('Folder', 'Add', d, previousarray, 'FolderStructure', 'Folder')}>   <span className=' cursor-pointer' ><img src="./icons/editIcon.svg"></img>Add Sub Folder</span></Dropdown.Item>}
                                {(isAllowDocument) && <Dropdown.Item className='border-bottom' onClick={() => handleAddEditFolder('File', 'Add', d, previousarray, 'ManageAllFile', 'Folder', 'Folder')}>  <span className=' cursor-pointer' ><img src="./icons/AddFolderIcon.svg"></img> Add Document </span></Dropdown.Item>}
                                {(isAllowEditFolder) && <Dropdown.Item className='border-bottom' onClick={() => handleAddEditFolder('Folder', 'Edit', d, previousarray, 'FolderStructure', 'Folder')}>  <span className=' cursor-pointer' ><img src="./icons/editIcon.svg"></img> Edit </span></Dropdown.Item>}
                                {(isAllowDeleteFolder) && <Dropdown.Item className='border-bottom' onClick={() => deleteFolderfun(d, fileFilter)}><span className=' cursor-pointer text-danger' ><img src="./icons/reddeleteIcon.svg"></img>  Delete</span></Dropdown.Item>}
                            </Dropdown.Menu>
                        </Dropdown>
                    </>
                }
            </Col>

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
                        <img src="./textfile.png" className="cursor-pointer" style={{ width: '2rem' }} onClick={() => viewFileFun(item)} />
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


    const toggleCollapse = (value) => {
        konsole.log("edddddddvddde", value)
        if (value == "right") {
            selectFolderId([])
        }
        else {
            selectFolderId(folderId)
        }
        // konsole.log('myAllFoldermyAllFolder', myAllFolder,folderId)
        setIsCollapsed(!isCollapsed);
        // setSelectIndexOfCategory(null)
        // konsole.log("isCollapsedisCollapsed",isCollapsed)
    };
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
        selectFolderId([])
        setIsCollapsed(!isCollapsed);
    };

    useEffect(() => {
        // setIsCollapsed(!isSpecificDrawerSelect)
    }, [isSpecificDrawerSelect])

    // console.log("folderId",selectFolderId)

    return (
        <Row>
            <Col>
                <div>
                    <div className='d-flex flex-row '>
                        <Row>
                            <Col md="5" lg="5" className='cursor-pointer'>

                                <img className="cabinetsArrow" src="/icons/icons-arrow1.svg" ></img>

                                <div className='d-flex justify-content-start align-items-start mainFoderDiv '>
                                    <div style={{ width: "40px" }} className='d-flex justify-content-start align-items-start h-100'>
                                        {(folder?.folder?.length > 0) ? <>  {isCollapsed ?
                                            <img src="./icons/icons8-down-100 (2).png" style={{ height: "14px", cursor: "pointer", margin: " 12px 9px 9px 7px" }} onClick={() => toggleCollapse("down")} /> :
                                            <img src="./icons/icon-down-right.png" style={{ height: "14px", cursor: "pointer", margin: " 12px 9px 9px 7px" }} onClick={() => toggleCollapse("right")} />}</> : ''}

                                    </div>

                                    <div
                                        className={`aaa ${(selectedClickfolderId == folderId) ? "selectedFolderBorder" : ""}`}
                                    >
                                        {/* <div className={`border cabinetHeadingsInnerOnhoverColor p-0`}> */}

                                        {/* {
                                            isCollapsed? 
                                            <>
                                            <h6 
                                            onClick={()=>openFile("open")}
                                            className={` 
                                            ${(folder?.folder?.length > 0 ) ? 'cabinetHeadingsInner p-0' : 'cabinetHeadingsOuter a'} text-truncate overflow-visible cursor-pointer`} >
                                            { !isCollapsed?<img src="./icons/openFolder.svg" className='cursor-pointer' style={{width:"22px",margin: "9px 9px 9px -1px"}} onClick={() => toggleCollapse("right")}/> : <img src="./icons/closedFolder.svg" className='cursor-pointer' style={{width:"20px",margin: "9px 9px 9px -2px"}} onClick={() => toggleCollapse("down")}  /> }       
                                            {folderName.length>10? <> {folderName.slice(0, 10)}...</>:{folderName} }{folder?.folder?.length > 0 && ` (${folder?.folder?.length})`}
                                            </h6>
                                            </>                                       
                                            :
                                            <h6 
                                            onClick={()=>closeFile("close")}
                                            className={`
                                            ${(folder?.folder?.length > 0 ) ? 'cabinetHeadingsInner p-0' : 'cabinetHeadingsOuter b'} text-truncate overflow-visible cursor-pointer`} >
                                            { !isCollapsed?<img src="./icons/openFolder.svg" className='cursor-pointer' style={{width:"22px",margin: "9px 9px 9px -4px"}} onClick={() => toggleCollapse("right")}/> : <img src="./icons/closedFolder.svg" className='cursor-pointer' style={{width:"20px",margin: "9px 9px 9px -3px"}} onClick={() => toggleCollapse("down")}  /> }       
                                            {folderName.length>10? <> {folderName.slice(0, 10)}...</>:{folderName} }{folder?.folder?.length > 0 && ` (${folder?.folder?.length})`}
                                            </h6>  
                                        }             */}
                                        {isCollapsed ? (
                                            <OverlayTrigger placement="top" overlay={<Tooltip id="folder-tooltip">{folderName}</Tooltip>}>
                                                <h6 onClick={() => openFile("open")} className={`${folder?.folder?.length > 0 ? 'cabinetHeadingsInner p-0' : 'cabinetHeadingsOuter a'} text-truncate overflow-visible cursor-pointer`}>
                                                    {!isCollapsed ? (<img src="./icons/openFolder.svg" className="cursor-pointer" style={{ width: "22px", margin: "9px 9px 9px -1px" }} onClick={() => toggleCollapse("right")} />) : (<img src="./icons/closedFolder.svg" className="cursor-pointer" style={{ width: "20px", margin: "9px 9px 9px -2px" }} onClick={() => toggleCollapse("down")} />)}
                                                    {folderName?.length > 10 ? (<> {' '} {folderName?.slice(0, 10)}...  </>) : (folderName)}
                                                    {folder?.folder?.length > 0 && ` (${folder?.folder?.length})`}
                                                </h6>
                                            </OverlayTrigger>
                                        ) : (
                                            <OverlayTrigger placement="top" overlay={<Tooltip id="folder-tooltip">{folderName}</Tooltip>} >

                                                <h6 onClick={() => closeFile("close")} className={`${folder?.folder?.length > 0 ? 'cabinetHeadingsInner p-0' : 'cabinetHeadingsOuter b'} text-truncate overflow-visible cursor-pointer`} >
                                                    {!isCollapsed ? (<img src="./icons/openFolder.svg" className="cursor-pointer" style={{ width: "22px", margin: "9px 9px 9px -4px" }} onClick={() => toggleCollapse("right")} />) : (<img src="./icons/closedFolder.svg" className="cursor-pointer" style={{ width: "20px", margin: "9px 9px 9px -3px" }} onClick={() => toggleCollapse("down")} />)}
                                                    {folderName?.length > 10 ? (<> {' '}{folderName?.slice(0, 10)}...</>) : (folderName)}
                                                    {folder?.folder?.length > 0 && ` (${folder?.folder?.length})`}
                                                </h6>

                                            </OverlayTrigger>
                                        )}

                                    </div>
                                    {funForAddEditDelete2(folder, '', fileFilter)}

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
                    <div className="sideBorderinner" >
                        {myAllFolder.sort((a, b) => a.folderName.localeCompare(b.folderName)).sort((a, b) => {
                            const labels = sortingFolderForCabinet
                            const aIndex = labels.indexOf(a.folderName);
                            const bIndex = labels.indexOf(b.folderName);
                            return bIndex - aIndex;
                        }).map((nestedFolder) => (
                            <RecursiveFolderCom
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
                            />
                        ))}
                    </div>
                )}
            </Col>
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



const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FolderStructure);