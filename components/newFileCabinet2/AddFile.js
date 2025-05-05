import React, { useContext, useEffect, useState, useRef, useMemo } from 'react'
import { Col, Row, Form, Button, InputGroup } from 'react-bootstrap'
import { InputCom, InputSelectCom } from './InputCom'
import { Services } from '../network/Service';
import { createFileCabinetFileAdd, emergencyDocumentArr, cretaeJsonForFilePermission, categoryFileCabinet, paralegalAttoryId, fileLargeMsg } from '../control/Constant';
import { FileCabinetContext } from './ParentCabinet'
import konsole from '../control/Konsole';
import { $AHelper } from '../control/AHelper';
import { globalContext } from '../../pages/_app';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from 'react-redux';
import AlertToaster from '../control/AlertToaster';
import Table from 'react-bootstrap/Table';
import OccurrenceFileCabinet from './OccurrenceFileCabinet';
import Other from '../asssets/Other';
import DatepickerComponent from '../DatepickerComponent';
import DragNdrop from './DragNdrop';
import { isNotValidNullUndefile } from '../Reusable/ReusableCom';
import { useLoader } from '../../component/utils/utils';
import {getRandomColor,getUserColor} from "../../component/Custom/CustomComponent"

let cretObj = () => {
    return { file: '', name: '', cabinetId: '', fileCategoryId: '', fileFolderId: '', belongsTo: '', dateFinalized: '', locationOfDocument: '', emergencyDocument: '', legalDocFileType: '', description: '' }
}


const AddFile = ({ functionForGetFileAfterAddEditFile, refrencePage, uniqueref, selectFolderInfo, fileAddFrom, dispatchloader, actionType, setShowAddEditFolder, setManageShowFileType, showPrimaryFiles }) => {
    const folderPermissionMsg = "Please provide the Firm folder access to the selected person, then proceed with the further permissions"

    let { allMainCabinetContainer, cabinetList, allFolderList, beneficiaryFiduciaryList, userProfessionalList, sharedFileShatusList, paralegalList, permissionsFolder } = useContext(FileCabinetContext)
    let primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
    let loggedUserId = sessionStorage.getItem('loggedUserId')
    let spouseUserId = sessionStorage.getItem('spouseUserId')
    let userDetailOfPrimary = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'))
    let userLoggedInDetail = JSON.parse(sessionStorage.getItem('userLoggedInDetail'))
    const { setdata } = useContext(globalContext)
    const fileRef = useRef(null)
    const otherFileTypeRef = useRef(null)
    const fileAddUpdateMsg = `Document ${actionType == 'Add' ? 'uploaded' : 'updated'} successfully.`
    const subtenantId = sessionStorage.getItem("SubtenantId");
    const stateObj = $AHelper.getObjFromStorage("stateObj");
    const [showpreviewmodal, setShowpreviewmodal] = useState(false)
    const [manageUpdate, setManageUpdate] = useState({ updatedBy: stateObj.userId, updatedOn: new Date().toISOString() })
    const [manageCreate, setManageCreate] = useState({ createdBy: stateObj.userId, createdOn: new Date().toISOString() })
    const [manageFileData, setManageFileData] = useState({ ...cretObj() })
    const [legaDoc, setLegalDoc] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [folderList, setFolderList] = useState([])
    const [belongsToDetails, setBelongsToDetails] = useState([])
    const [jsonObjForShareStatus, setJsonObjForShareStatus] = useState([]);
    const [skipForNow, setSkipForNow] = useState(true)
    const [fileId, setFileId] = useState(0)
    const [fileStatusId, setFileStatusId] = useState(2);
    const [showLegalTeam, setshowLegalTeam] = useState(true)
    const [showFidBen, setshowFidBen] = useState(true)
    const [disableSavebutton, setDisableSavebutton] = useState(false)
    const [uploadedFileName, setUploadedFileName] = useState({})
    const [searchedPlaceholder, setSearchedPlaceholder] = useState("All Contacts")
    const [showShareDocumentButton, setShowShareDocumentButton] = useState(false)
    const [selectedFileType, setSelectedFileType] = useState(null)
    const [FileBelongsTo, setFileBelongsTo] = useState(null)
    const [emergencyDocumentType, setEmergencyDocumentType] = useState(null)
    const [sharedFileMemberList, setSharedFileMemberList] = useState([
        { name: "All", value: true },
        { name: "Legal Team", value: false },
        { name: "Beneficiary / Fiduciary", value: paralegalAttoryId.includes(stateObj.roleId) ? true : false },
    ]);
    const [searchValue, setSearchValue] = useState('')
    const [searchedContact, setSearchedContact] = useState('')
    const [showFileTypeDropdown, setShowFileTypeDropdown] = useState(false)
    const [showBelongsToDropdown, setShowBelongsToDropdown] = useState(false)
    const [showEmergencyDocumentTypeDropdown, setShowEmergencyDocumentTypeDropdown] = useState(false)
    let paralegalList2 = (manageFileData?.fileCategoryId == categoryFileCabinet[0]) ? paralegalList : []
    // const dropdownRef = useRef(null);
    const [files, setFiles] = useState([]);

    const fileTypeRef = useRef(null);
    const belongsRef = useRef(null);
    const EmergencyRef = useRef(null);
    const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
    const selectedCabinetId=(actionType == 'Add')?selectFolderInfo?.folderFileCategoryId:selectFolderInfo?.fileCategoryId;   
    // const tableHeadingForFile=["Name","Read","Edit","Delete"]
    const tableHeadingForFile=["Name","Email","Relationship"]
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (
            fileTypeRef.current && !fileTypeRef.current.contains(event.target) ||
            belongsRef.current && !belongsRef.current.contains(event.target) ||
            EmergencyRef.current && !EmergencyRef.current.contains(event.target)
          ) {
            setShowFileTypeDropdown(false);
            setShowBelongsToDropdown(false);
            setShowEmergencyDocumentTypeDropdown(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    useEffect(() => {
        let getSharedMemberList = sharedFileMemberList?.filter(item => (paralegalAttoryId?.includes(stateObj?.roleId) ? item?.name !== 'Legal Team' && item?.name !== 'All' : item))?.map((item, index) => item)
        if (getSharedMemberList?.length > 0) {
            let memberPlaceholderListName = getSharedMemberList[0].name;
            if (memberPlaceholderListName == "All") { setSearchedPlaceholder("All Contacts") } else { setSearchedPlaceholder(memberPlaceholderListName) }
        }
        //    konsole.log("setPlaceholder",getSharedMemberList[0])
    }, [])

    useEffect(() => {
        if (refrencePage == 'STRUCTURE' && actionType == 'Add') {
            let { folderCabinetId, folderFileCategoryId, folderId, folderName } = selectFolderInfo
            // console.log("dsssssssdsdFiolderData",folderCabinetId, folderFileCategoryId, folderId, folderName)
            setManageFileData(prev => ({
                ...prev,
                cabinetId: folderCabinetId, fileCategoryId: folderFileCategoryId, fileFolderId: folderId
            }))
            setFileStatusId(prev => (folderName == 'Draft' ? 1 : 2));
            commonForCabinetCategory('cabinetId', folderCabinetId)
            commonForCabinetCategory('fileCategoryId', folderFileCategoryId)
            if(folderFileCategoryId!==6){setSelectedFileType('999999')}
            handleOnBlur(folderFileCategoryId)
        } else if (refrencePage == 'STRUCTURE' && actionType == 'Edit') {
            let { cabinetId, fileCategoryId, fileId, fileTypeId, folderId, fileBelongsTo, fileURL, fileTypeName, documentLocation, emergencyDocument, userFileName, description, dateFinalized, folderName } = selectFolderInfo
            setSelectedFileType(fileTypeId)
            if (showPrimaryFiles) {
                setFileBelongsTo(primaryMemberUserId)
            } else {
                setFileBelongsTo(spouseUserId)
            }
            setEmergencyDocumentType(emergencyDocument)
            setFiles({ name: userFileName })
            // konsole.log("selectFolderInfoselectFolderInfosa",selectFolderInfo)
            setManageFileData(prev => ({
                ...prev, cabinetId, fileCategoryId, fileFolderId: folderId,
                legalDocFileType: fileTypeId, belongsTo: fileBelongsTo, locationOfDocument: documentLocation,
                emergencyDocument, description, name: (userFileName) ? userFileName : fileTypeName, dateFinalized: dateFinalized !== null ? dateFinalized?.split("T")[0] : '',
                file: fileURL
            }))
            setFileStatusId(prev => (folderName == 'Draft' ? 1 : 2));
            setFileId(fileId)
            commonForCabinetCategory('cabinetId', cabinetId)
            commonForCabinetCategory('fileCategoryId', fileCategoryId)
            handleOnBlur(fileCategoryId)
            let filterShareFileInfo = sharedFileShatusList.filter((item) => item?.fileId == fileId)
            setJsonObjForShareStatus(filterShareFileInfo)
            konsole.log('filterShareFileInfofilterShareFileInfo', filterShareFileInfo)

        }
        if (actionType == 'Add' && paralegalAttoryId.includes(stateObj.roleId)) {
            // const newObj = cretaeJsonForFilePermission({ primaryUserId: primaryMemberUserId, sharedUserId: loggedUserId, isActive: true, roleId: stateObj.roleId, isDelete: true, isEdit: true, isRead: true, ...manageCreate })
            // setJsonObjForShareStatus([{ ...newObj }]);
            const paralegalFilePermission = []
            for (let i = 0; i < paralegalList.length; i++) {
                const newObj = cretaeJsonForFilePermission({ primaryUserId: primaryMemberUserId, sharedUserId: paralegalList[i].userId, isActive: true, roleId: paralegalList[i]?.roleId, isDelete: true, isEdit: true, isRead: true, ...manageCreate })
                paralegalFilePermission.push(newObj)
            }

            konsole.log('paralegalFilePermission', paralegalFilePermission)
            setJsonObjForShareStatus(paralegalFilePermission)
        }

    }, [refrencePage, uniqueref, selectFolderInfo, actionType])

    useEffect(() => {
        konsole.log('cabinetListcabinetListcabinetList', cabinetList[0].cabinetId)
        commonForCabinetCategory('cabinetId', cabinetList[0]?.cabinetId)
        setManageFileData(prev => ({
            ...prev,
            ['cabinetId']: cabinetList[0].cabinetId
        }))
    }, [cabinetList])

    useEffect(() => {
        let primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
        getBelongsTo(primaryMemberUserId)
    }, [])   
    
    const getBelongsTo = (primaryMemberUserId) => {
        dispatchloaderFun(true)
        Services.getfileBelongsTo(primaryMemberUserId).then((res) => {
            konsole.log('getfileBelongsTo', res)
            const valueLabelArray = res?.data?.data?.map(obj => ({
                value: obj?.fileBelongsTo,
                label: obj?.belongsToMemberName !== null ? obj?.belongsToMemberName : 'Joint',
                memberType: obj?.memberType,
                belongsToRelationShipId: obj?.belongsToRelationShipId,
                belongsToRelationShipName: obj?.belongsToRelationShipName,
            }));
            setBelongsToDetails(valueLabelArray)
            dispatchloaderFun(false)
        }).catch((err) => {
            dispatchloaderFun(false)
            konsole.log('getfileBelongsTo', err)
        })
    }

    const dispatchloaderFun=(val)=>{
        dispatchloader(val)
        useLoader(val);
    }
    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

    const handleChangeCabinet = (e) => {
        // konsole.log("wsewewewe",e?.target)
        // let { value, id, files } = e?.target
        // // konsole.log("wsewewewe", value, id, files)
        // if (id == 'file') {      
        //     let fileofsize = files[0].size;
        //     let selectFiles = files[0]
        //     if (selectFiles?.type !== 'application/pdf') {
        //         AlertToaster.error("Only Pdf format is allowed.");
        //         fileRef.current.value = ''
        //         return;
        //     }
        //     if ($AHelper.fileuploadsizetest(fileofsize)) {
        //          setWarning("warning",fileLargeMsg, "Warning");
        //         fileRef.current.value = ''
        //         return;
        //       }
        //     setUploadedFileName(files[0])
        //     // konsole.log('ggfgfgfgf', files[0])
        // }
        // let valueAll = (id == 'file') ? files[0] : (id == 'emergencyDocument') ? value : $AHelper.capitalizeFirstLetter(value)
        // handleInput(id, valueAll)
        // commonForCabinetCategory(id, value)
    }

    const commonForCabinetCategory = (id, value) => {
        konsole.log('idididvalue', id, value)
        if (id == 'cabinetId') {
            const filterCategoryList = cabinetList?.filter(item => item?.cabinetId == value)
            const categoryList = filterCategoryList?.length > 0 ? filterCategoryList[0].fileCategoryTypeMappingList : [];
            setCategoryList(categoryList);
        } else if (id == 'fileCategoryId') {
            konsole.log('allMainCabinetContainer', allMainCabinetContainer)
            let filterfolderList = allFolderList.filter(item => item?.folderFileCategoryId == value)
            setFolderList(filterfolderList)
        }
    }

    const handleInput = (key, value) => {
        konsole.log('handleInput', key, value)
        setManageFileData(prev => ({ ...prev, [key]: value }))
    }

    //  this function use for get file type base on categry Id--------------------------------------------------------------------------------------------------------------
    const handleOnBlur = (fileCategoryId) => {
        let fileCategory = (refrencePage === 'STRUCTURE') ? fileCategoryId : manageFileData?.fileCategoryId
        dispatchloaderFun(true)
        Services.getFileTypeByCategory(fileCategory)
            .then((res) => {
                dispatchloaderFun(false)
                konsole.log('getFileTypeByCategory', res)
                const responseData = res?.data?.data;
                const result = responseData?.sort((a, b) => b?.fileType == "Other" ? 1 : a?.fileType == "Other" ? -1 : a?.fileType.localeCompare(b?.fileType));
                setLegalDoc(result)
            }).catch((err) => {
                dispatchloaderFun(false)
                konsole.log('getFileTypeByCategory', err)
            })
    }


    //  validation function----------------------------------------------------------------------------------------------------------------------------------------------------

    let warningMessage = {
        "file": "Please attach the document",
        "name": "Name can't be blank",
        "cabinetId": "Please select cabinet",
        "fileFolderId": "Please select folder",
        "belongsTo": "Please select file belongs ",
        "dateFinalized": "Date finalized can't be blank",
        "locationOfDocument": "Location of document can't be blank",
        "emergencyDocument": "Please select emrgency document type",
        "emergencyDocument": "Please select emrgency document type",
        'legalDocFileType': 'Please select File type',
        'description': "Description can't be blank"
    }


    const isEmpty = (value) => {
        if (value === undefined || value === null || value === "") {
            return true;
        }
        return false;
    };

    const validateObject = (obj) => {
        for (const key in obj) {
            if (isEmpty(obj[key])) {
                if (key == 'dateFinalized') {
                    return false
                }
                 setWarning("warning",warningMessage[key])
                return true;
            }
        }
        return false; // Return null if there are no empty fields
    };

    const functionCancelSave = () => {
        if (refrencePage == 'STRUCTURE') {
            setShowAddEditFolder('')
        } else {
            setManageShowFileType('')
        }
    }
    const saveFileFun = () => {
        dispatchloaderFun(true)
        setDisableSavebutton(true)
        // if (validateObject(manageFileData)) return;
        // konsole.log("lrgaldocumentType",selectedFileType,files)           
        let { file, name, fileCategoryId, description, belongsTo, dateFinalized, locationOfDocument, emergencyDocument, legalDocFileType } = manageFileData
        // console.log("newfileCategoryId",fileCategoryId)
        if (files.length < 1 || files == undefined || files == null || files == "") {
            setWarning("warning",warningMessage['file'])
            dispatchloaderFun(false)
            setDisableSavebutton(false)
            return;
        }
        if ((selectedFileType == "Select File Type" || !selectedFileType) && (fileCategoryId!==6) ) {
             setWarning("warning",warningMessage['legalDocFileType'])
            dispatchloaderFun(false)
            setDisableSavebutton(false)
            return;
        }
        if (FileBelongsTo == "Belongs to" || !FileBelongsTo ) {
             setWarning("warning",warningMessage['belongsTo'])
            dispatchloaderFun(false)
            setDisableSavebutton(false)
            return;
        }
        // konsole.log("filesfilesfilessasasa",files,selectedFileType,FileBelongsTo)

        if (actionType == 'Add') {
            const filterChckedTrueFiles = files?.filter((item) => {
                // konsole.log("sdsdd",item,item.checked);
                return item?.checked == true
            })

            
            // konsole.log("filesArray32323",files,filterChckedTrueFiles)
            if (filterChckedTrueFiles?.length > 0) {
                // konsole.log('jsonObjjsodsdsdsnObj', filterChckedTrueFiles)
                filterChckedTrueFiles?.forEach((item) => {
                    let jsonObj = {
                        FileId: fileId,
                        UserId: primaryMemberUserId,
                        File: item.document,
                        UploadedBy: loggedUserId,
                        FileTypeId: selectedFileType,
                        FileCategoryId: Number(fileCategoryId),
                        FileStatusId: fileStatusId,
                        EmergencyDocument: emergencyDocumentType,
                        DocumentLocation: locationOfDocument,
                        UserFileName: item?.document?.name || "FileName",
                        DateFinalized: dateFinalized,
                        Description: description
                    }
                    konsole.log('jsonObjjsonOfdfdfbjjsonObj', jsonObj, item)
                    dispatchloaderFun(true)
                    Services.postUploadUserDocumantV2({ ...jsonObj }).then((res) => {
                        dispatchloaderFun(false)
                        // konsole.log('AddFileuploadUserDoc', res)
                        let responseData = res?.data?.data
                        if (jsonObj.FileTypeId == '999999') {
                            otherFileTypeRef.current.saveHandleOther(responseData?.fileId);
                        }
                        if (actionType !== 'Edit') {
                            apiCallUserFileCabinetAdd(responseData, FileBelongsTo)
                        } else if (jsonObjForShareStatus.length > 0) {
                            apiCallUpsertShareFileStatus(responseData.fileId, FileBelongsTo)
                            apiCallUpsertShareFileStatus(responseData.fileId, FileBelongsTo)
                        } else {
                            setWarning("successfully",fileAddUpdateMsg,``);
                           openEmailModal()
                        }
                    }).catch((err) => {
                        setDisableSavebutton(false)
                        dispatchloaderFun(false)
                        konsole.log('err in uploadUserDoc', err, err?.response)
                        window.location.reload()
                    })
                })
            }
            else {
                 setWarning("warning",warningMessage['file'])
                dispatchloaderFun(false)
                setDisableSavebutton(false)
                return;
            }
        }


        if (actionType == 'Edit') {
            let jsonObj = {
                FileId: fileId,
                UserId: primaryMemberUserId,
                // File: files?.[0],
                UploadedBy: loggedUserId,
                FileTypeId: selectedFileType,
                FileCategoryId: Number(fileCategoryId),
                FileStatusId: fileStatusId,
                EmergencyDocument: emergencyDocumentType,
                DocumentLocation: locationOfDocument,
                UserFileName: files?.name || "Filename.pdf",
                DateFinalized: dateFinalized,
                Description: description
            }
            konsole.log('ewewewdscscjosn', jsonObj, files)
            dispatchloaderFun(true)
            Services.postUploadUserDocumantV2({ ...jsonObj }).then((res) => {
                dispatchloaderFun(false)
                konsole.log('uploadUserDoc', res)
                let responseData = res?.data?.data
                if (jsonObj.FileTypeId == '999999') {
                    otherFileTypeRef.current.saveHandleOther(responseData?.fileId);
                }
                if (actionType !== 'Edit') {
                    apiCallUserFileCabinetAdd(responseData, FileBelongsTo)
                } else if (jsonObjForShareStatus.length > 0) {
                    apiCallUpsertShareFileStatus(responseData.fileId, FileBelongsTo)
                    // apiCallUpsertShareFileStatus(responseData.fileId,FileBelongsTo)
                } else {
                    setWarning("successfully",fileAddUpdateMsg,``);
                   openEmailModal()
                }
            }).catch((err) => {
                setDisableSavebutton(false)
                dispatchloaderFun(false)
                konsole.log('err in uploadUserDoc', err, err?.response)
                window.location.reload()
            })
            konsole.log('jsonObjjsonObj', jsonObj)
        }
    }

    // konsole.log('manageFileDatamanageFileData', manageFileData)

    const apiCallUserFileCabinetAdd = (responseData, getFileBelongsTo) => {
        let { fileCategoryId, fileId, fileStatusId, fileTypeId } = responseData
        // konsole.log("ewewewewe",responseData,getFileBelongsTo)
        let belongsTo = [{ "fileBelongsTo": getFileBelongsTo }]
        if (getFileBelongsTo.toLocaleLowerCase() == 'joint') {
            belongsTo = belongsToDetails?.filter(({ value }) => value.toLocaleLowerCase() !== 'joint').map(({ value }) => ({ fileBelongsTo: value }));
            // konsole.log("ewewewewsdsddse",belongsTo,belongsToDetails)
        }
        let postJson = createFileCabinetFileAdd({ cabinetId: manageFileData.cabinetId, belongsTo, fileUploadedBy: loggedUserId, fileCategoryId, folderId: Number(manageFileData.fileFolderId), fileId, fileStatusId, fileTypeId, primaryUserId: primaryMemberUserId })
        konsole.log('postJsonapiCallUserFileCabinetAdd', postJson)
        dispatchloaderFun(true)
        Services.addUserFileCabinet(postJson).then((res) => {
            dispatchloaderFun(false)
            konsole.log('addUserFileCabinet', res)
            if (jsonObjForShareStatus.length > 0) {
                let fileBelongsTo = belongsTo[0].fileBelongsTo
                apiCallUpsertShareFileStatus(fileId, fileBelongsTo)
            } else {
                setWarning("successfully",fileAddUpdateMsg,``);
               openEmailModal()
            }
        }).catch((err) => {
            dispatchloaderFun(false)
            reloadPage()
            konsole.log('err in file ading in cabiner', err, err?.response)
        })
    }

    // upsertShareFileStatus ----------------------------------------------------------------------------------------------------------------------------------------------
    const apiCallUpsertShareFileStatus = (fileId, fileBelongsTo) => {
        konsole.log('belongsTobelongsTobelongsTo', fileBelongsTo, fileId)
        konsole.log('newArrnewArr', newArr)
        konsole.log('jsonObjForShareStatus', newArr, JSON.stringify(newArr))
        let newArr = jsonObjForShareStatus?.map((obj) => ({ ...obj, 'fileId': fileId, 'belongsTo': fileBelongsTo, 'createdBy': (obj?.sharedFileId == 0) ? loggedUserId : obj?.createdBy, 'updatedBy': (obj?.sharedFileId == 0) ? obj?.updatedBy : loggedUserId }));
        let myNewArray = newArr.filter((item) => item?.sharedFileId !== 0 || item?.isRead === true || item?.isEdit == true || item?.isDelete === true);
        let myThreeArray = [...myNewArray]
        for (let [index, item] of myThreeArray?.entries()) {
            if (item.sharedFileId != 0 && item?.isRead == false && item?.isEdit == false && item?.isDelete == false) {
                // myThreeArray[index].isActive = false
            }
        }
        konsole.log('myThreeArraymyThreeArray', myThreeArray)
        dispatchloaderFun(true)
        Services.upsertShareFileStatus(myNewArray).then((res) => {
            konsole.log('res of upser file share', res)
            dispatchloaderFun(false)
            setWarning("successfully",fileAddUpdateMsg,``);
            // window.location.reload()
            openEmailModal()
            // reloadPage()
        }).catch((err) => {
            dispatchloaderFun(false)
            konsole.log('err in upsert sharefile', err)
            // window.location.reload()
            reloadPage()
        })
    }
    // konsole.log('jsonObjForShareStatus', jsonObjForShareStatus)
    // konsole.log('permissionsFolderpermissionsFolder', permissionsFolder)
    // upsertShareFileStatus ----------------------------------------------------------------------------------------------------------------------------------------------
    // beneficiaryList, fiduciaryList, userProfessionalList-------------------------------------------------------------------------------------------------------------

    const mappingCheckBoxValue = (e, sharedUserId, typeOfUser) => {
        let { id, checked } = e?.target;
        let filterFolder = permissionsFolder?.length > 0 ? permissionsFolder?.some((item) => item?.folderId == manageFileData?.fileFolderId && item?.sharedUserId == sharedUserId) : false
        let findIndexExistsValue = jsonObjForShareStatus?.length > 0 ? jsonObjForShareStatus?.findIndex((item) => item?.sharedUserId == sharedUserId) : '-1'       
        if (manageFileData?.fileFolderId == '') {
            return  setWarning("warning",'Please select folder.')
        }
        if (typeOfUser !== "fid/ben" && typeOfUser !== 'professional' && filterFolder == false) {
             setWarning("warning",folderPermissionMsg);
            return;
        }
        // if (findIndexExistsValue != '-1') {
        //     let { isRead, isEdit, isDelete, } = jsonObjForShareStatus[findIndexExistsValue]
        //     // if (id == 'isRead' && isRead == true && (isEdit == true || isDelete == true) && checked == false) {
        //         if (id == 'isRead' && isRead == true && checked == false) {
        //         //  setWarning("warning",'Please uncheck Edit/Delete first.')
        //         return;

        //     }
        // }

        // konsole.log('findIndexExistsValue', jsonObjForShareStatus[findIndexExistsValue])
        // konsole.log('checkExistsValuecheckExistsValue', findIndexExistsValue, findIndexExistsValue > 0)
        if (findIndexExistsValue == '-1') {
            const newObj = cretaeJsonForFilePermission({ primaryUserId: primaryMemberUserId, sharedUserId, [id]: checked, ...manageCreate, ...manageUpdate, })
            if (id == 'isEdit' || id == 'isDelete') {
                newObj['isRead'] = true
            }
            konsole.log('newObjnewObj', newObj)
            if (jsonObjForShareStatus !== false) {
                setJsonObjForShareStatus(prevState => [...prevState, newObj]);
            } else {
                setJsonObjForShareStatus([{ ...newObj }]);
            }
        } else {
            setJsonObjForShareStatus((prev) => {
                let newArray = [...prev]
                newArray[findIndexExistsValue][id] = checked
                newArray[findIndexExistsValue]['isRead'] = newArray?.filter((item) => item?.sharedUserId == sharedUserId)?.some(({ isRead, isEdit, isDelete }) => isRead || isEdit || isDelete)
                return newArray
            });
        }
    }

    const toggleSwitchForContacts = (e, sharedUserId, typeOfUser) => {

        const toggleStatus = e?.target?.checked;
        let findIndexExistsValue = jsonObjForShareStatus?.length > 0 ? jsonObjForShareStatus?.findIndex((item) => item?.sharedUserId == sharedUserId) : '-1'
        let filterFolder = permissionsFolder?.length > 0 ? permissionsFolder?.some((item) => item?.folderId == manageFileData?.fileFolderId && item?.sharedUserId == sharedUserId) : false

        if (manageFileData?.fileFolderId == '') {
            return  setWarning("warning",'Please select folder.')
        }
        if (typeOfUser !== "fid/ben" && typeOfUser !== 'professional' && filterFolder == false) {
             setWarning("warning",folderPermissionMsg)
            return;
        }
        if (findIndexExistsValue == '-1') {
            const newObj = cretaeJsonForFilePermission({
                primaryUserId: primaryMemberUserId,
                sharedUserId,
                ['isRead']: toggleStatus,
                ['isEdit']: toggleStatus,
                ['isDelete']: toggleStatus,
                ...manageCreate, ...manageUpdate,
            })
            if (jsonObjForShareStatus !== false) {
                setJsonObjForShareStatus(prevState => [...prevState, newObj]);
            } else {
                setJsonObjForShareStatus([{ ...newObj }]);
            }
        } else {
            setJsonObjForShareStatus((prev) => {
                let newArray = [...prev]
                newArray[findIndexExistsValue]['isRead'] = toggleStatus
                newArray[findIndexExistsValue]['isEdit'] = toggleStatus
                newArray[findIndexExistsValue]['isDelete'] = toggleStatus
                return newArray
            });
        }



    }

    const checkChecked = (type, userId) => {
        // konsole.log("typeuserIduserId",type,"----",userId)
        return jsonObjForShareStatus?.length > 0 && jsonObjForShareStatus?.some((item) => item?.sharedUserId == userId && item[type] == true)
    }

    const checkToggleButton = (userId) => {
        return jsonObjForShareStatus?.length > 0 && jsonObjForShareStatus?.some((item) => item?.sharedUserId == userId && (item?.isRead == true || item?.isEdit == true || item?.isDelete == true))
    }

    const skipBtnFun = (e, value) => {
        if ((value === 'yes' && !skipForNow) || (value === 'no' && skipForNow)) {
            if (paralegalAttoryId.includes(stateObj?.roleId)) {
                const filtered = jsonObjForShareStatus?.filter(item => paralegalAttoryId?.includes(item?.roleId?.toString()));
                setJsonObjForShareStatus(filtered)
            } else {
                setJsonObjForShareStatus([])
            }
            setSearchedContact("")
            setSkipForNow(!skipForNow)
            
        }
    }

    const selectChackBoxForFile2 = (id, userId, typeOfUser, label) => {
        // konsole.log("iypeOfUserid",id,userId)
        return (
            <Form.Group className="d-flex justify-content-center checkbox-group ">
                <Form.Check
                    className="contactCheckox"
                    type="checkbox"
                    name={id}
                    id={id}
                    checked={checkChecked(id, userId)}
                    //  label={`${label}`}
                    onChange={(e) => mappingCheckBoxValue(e, userId, typeOfUser)}
                />
                {/* <lablel className={`${(checkChecked(id, userId) == true ? "contactCheckboxlabelSelected" : "contactCheckboxlabelNotSelected")}`} >{`${label}`} </lablel> */}
            </Form.Group>
        )
    }

    const handleRadioChangeForMembers = (e) => {
        // konsole.log("handleRadioChangeForMembers", e.target.id);
        const { id, checked } = e.target;
        setSearchedPlaceholder(id)
        setshowLegalTeam(id === "Legal Team");
        setshowFidBen(id === "Beneficiary / Fiduciary");
        if (id === "All") {
            setshowLegalTeam(true);
            setshowFidBen(true);
            setSearchedPlaceholder("All Contacts")
        }

        const updatedList = sharedFileMemberList?.map((item) => {
            return {
                ...item,
                value: item?.name === id,
            };
        });
        setSharedFileMemberList(updatedList);

    };



    // const mappingRetrurnPermissionCheckBox = (fullName, userId, typeOfUser) => {
    //     konsole.log('badc', fullName, userId, typeOfUser)
    //     return (<>
    //         <tr className=''>
    //             <td className='ms-1'>{fullName}</td>
    //             {selectChackBoxForFile('isRead', userId, typeOfUser)}
    //             {selectChackBoxForFile('isEdit', userId, typeOfUser)}
    //             {selectChackBoxForFile('isDelete', userId, typeOfUser)}
    //         </tr>
    //     </>)
    // }

    const functionToAddBorderAndColorOnClickingAnyRadio = (userId) => {
        const checkIfFilePermissionIsSelected = jsonObjForShareStatus?.length > 0 && jsonObjForShareStatus?.some((item) => item?.sharedUserId == userId && (item['isRead'] == true || item['isEdit'] == true || item['isDelete'] == true))
        return checkIfFilePermissionIsSelected
    }

    const mappingRetrurnPermissionCheckBox2 = (itemName, userId, typeOfUser, itemEmail,item) => {
        return (<>
            <div id='contactsOuterBorderNewFileCabinet' className={`contactsOuterBorderNewFileCabinet w-100  ${functionToAddBorderAndColorOnClickingAnyRadio(userId) == true ? "" : ""}`}>
                     <tr className="tabelDataRow w-100 tabDataRowFile">
                         <td className="addFleTbaleHeadings p-0">
                             <div className="d-flex align-items-center firstDiv ">
                             {selectChackBoxForFile2('isRead', userId, typeOfUser, "Read")}
                                     <div className="dummyImgFolder dummyHeightInc" style={{ backgroundColor: getUserColor(itemName),margin:"0px 10px" }}>
                                         <p className="ps-0">
                                             {`${itemName[0] ?? ''}`}
                                         </p>
                                     </div>
                                     <span className="DocumentNameTable">{itemName}</span>
                             </div>
                         </td>
                         <td className="p-0">
                             <p className="text-start wordBreak fontSizeEmailRole">{itemEmail ?? "Not available"}</p>
                         </td>
                         <td className="p-0">
                         <p className="text-start wordBreak fontSizeEmailRole">
                             {(userDetailOfPrimary?.memberName==itemName)?"Primary member" :((item?.roleKey || item?.relationWithUser) ?? "-")}  
                         </p>
                         </td>
                     </tr>
            </div>
        </>)
    }


    let openEmailModal = () => {
        if (paralegalAttoryId.includes(stateObj.roleId) && actionType == 'Add') {
            setShowpreviewmodal(true)
        } else {
            reloadPage()
        }
    }

    let reloadPage = () => {
        // window.location.reload()
        setShowAddEditFolder('')
        functionForGetFileAfterAddEditFile()
    }

    //  warning ---------------------------------------------------------------------------------------------------------------------------
    // function toasterAlert(text) {
    //     setdata({ open: true, text: text, type: "Warning" });
    // }
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    
      }

    function seachContacts(e) {
        // konsole.log("eeeeecemyAllFoldermyAllFolder",e?.target?.value)  
        setSearchedContact(e?.target?.value)
    }

    //  konsole-----------------------------------------------------------------------------------------------------------------------------
    konsole.log('jsonObjForShareStatus', jsonObjForShareStatus)
    konsole.log('userProfessionalList', userProfessionalList)
    konsole.log('sharedFileShatusList', sharedFileShatusList)
    konsole.log('legaDocaaaaa', legaDoc)
    konsole.log('folderListfolder', folderList.folder, JSON.stringify(folderList.folder))
    konsole.log('allMainCabinetContainerallMainCabinetContainer', allFolderList, allMainCabinetContainer)
    // konsole.log("allFolderLFolderList",allFolderList)
    konsole.log('categoryListcategoryList', categoryList)
    konsole.log('belongsToDetailsbelongsToDetails', belongsToDetails)
    konsole.log('selectFolderInfoselectFolderInfo', selectFolderInfo)
    konsole.log('manageFileDatamanageFileData', manageFileData)
    konsole.log('cabinetListcabinetList', cabinetList)
    konsole.log('jsonObjForShareStatus', jsonObjForShareStatus)
    konsole.log('beneficiaryFiduciaryList', beneficiaryFiduciaryList)
    konsole.log('manageFileData.dateFinalized', manageFileData.dateFinalized)
    konsole.log('paralegalListparalegalList', paralegalList)
    konsole.log('userProfessionalList', userProfessionalList)
    konsole.log('beneficiaryFiduciaryListbeneficiaryFiduciaryList', beneficiaryFiduciaryList)
    konsole.log('actionTypeactionTypeactionTypeactionType', actionType)
    // konsole.log("filese233323",files)
    // konsole.log("disableSavebutton",disableSavebutton)
    // konsole.log("showPrimaryFilesfdfdfdfdfdfdffdsf",showPrimaryFiles)
    // konsole.log('manageFileDatalegalDocFileType', manageFileData?.legalDocFileType,emergencyDocumentArr)
    // konsole.log("fileeename",uploadedFileName)

    let cabinetcabinetName = categoryList?.find(({ fileCategoryId }) => fileCategoryId == manageFileData?.fileCategoryId)?.fileCategoryType
    let documentsName = legaDoc?.find(({ fileTypeId }) => fileTypeId == manageFileData?.legalDocFileType)?.fileType

    konsole.log('paralegalListparalegalListparalegalList', paralegalList.length, userProfessionalList, beneficiaryFiduciaryList.length)
    // konsole.log('cabinetcabinetName', manageFileData.belongsTo,belongsToDetails)
    konsole.log('manageFileDataemergencyDocument', manageFileData.emergencyDocument)
    konsole.log('fileCategoryIdfileCategoryId', manageFileData?.fileCategoryId, categoryFileCabinet[0])
    // konsole.log("paralegalList2",paralegalList2)

    const handeEnteredDate = (event) => {
        const inputDate = event?.target?.value;
        const year = inputDate?.split("-")[0];
        // konsole.log("inputDateinputDate",inputDate)
        if (year.length > 4) return;
        setManageFileData(prev => ({ ...prev, dateFinalized: inputDate }));
    }

    const handleBlurDate = (event) => {
        const inputDate = event?.target?.value;
        const currentDate = new Date().toISOString().split('T')[0];
    
        if (inputDate > currentDate) {
             setWarning("warning","Please enter a valid date of sign off.");
            setManageFileData(prev => ({ ...prev, dateFinalized: '' }));
        }
    };

    const getSelectedFileType = () => {
        if (selectedFileType == null) { return "Select File Type" }
        const returnLegalDocTypeName = legaDoc?.length > 0 && legaDoc?.find((item) => { return item?.fileTypeId == selectedFileType })
        // konsole.log("returnLegalDocTypeName",returnLegalDocTypeName)
        if (returnLegalDocTypeName != false) { return returnLegalDocTypeName.fileType }
        else { return "Select File Type" }


    }
    const fileBelongsToFun = () => {
        //     konsole.log("belongsToDetailssasas",belongsToDetails,FileBelongsTo)
        if (FileBelongsTo == null) { return "Belongs to" }
        const returnFilebelongsTo = belongsToDetails?.length > 0 && belongsToDetails?.find((item) => { return item?.value?.toLocaleLowerCase() == FileBelongsTo })
        // konsole.log("e344returnLegalDocTypeName",returnFilebelongsTo)
        if (returnFilebelongsTo != false) { return returnFilebelongsTo.label }
        else { return "Belongs to" }
    }

    const emergencyDocumentTypeValue = () => {
        // konsole.log("belongsToDetailssasas",belongsToDetails,FileBelongsTo)
        if (emergencyDocumentType == null) { return "Select emergency document type" }
        const returnEmergencyDocumentType = emergencyDocumentArr?.length > 0 && emergencyDocumentArr?.find((item) => { return item?.value == emergencyDocumentType })
        // konsole.log("returnEmergencyDocumentType",returnEmergencyDocumentType)
        if (returnEmergencyDocumentType != false) { return returnEmergencyDocumentType.label }
        else { return "Select emergency document type" }

    }

    const openFileDropdownFun = () => {
        if (actionType === 'Add') {
            setShowFileTypeDropdown(!showFileTypeDropdown)
            setShowBelongsToDropdown(false)
            setShowEmergencyDocumentTypeDropdown(false)
        }
    }
    const openBelongsTofun = () => {
        if (actionType === 'Add') {
            setShowFileTypeDropdown(false)
            setShowBelongsToDropdown(!showBelongsToDropdown)
            setShowEmergencyDocumentTypeDropdown(false)
        }
    }
    const emergencyDocumentTypeFun = () => {
        setShowEmergencyDocumentTypeDropdown(!showEmergencyDocumentTypeDropdown)
        setShowBelongsToDropdown(false)
        setShowFileTypeDropdown(false)
    }
    // konsole.log("emergencyDocumentType",emergencyDocumentType)

    const paralegalListCount = paralegalList2?.filter(item => (paralegalAttoryId?.includes(stateObj.roleId) ? item?.userId !== loggedUserId : item))
        .filter((item) => (
            (item?.fullName && item?.fullName?.toLowerCase()?.includes(searchedContact?.toLowerCase())) ||
            (item?.userName && item?.userName?.toLowerCase()?.includes(searchedContact?.toLowerCase()))
        ))

    const beneficiaryFiduciaryListCount = beneficiaryFiduciaryList?.filter((item) => 
        (
            (item?.label?.toLowerCase()?.includes(searchedContact?.toLowerCase())) || 
            (item?.emailId?.toLowerCase()?.includes(searchedContact?.toLowerCase()))
        ))

    const filteredOptions = useMemo(() => {
        const _searchValue = searchValue?.toLowerCase();
        if(!_searchValue?.length) return legaDoc;
        // konsole.log("sndjnsd", legaDoc, searchValue)
        return legaDoc?.filter(ele => ele?.fileType?.toLowerCase()?.includes(_searchValue));
    }, [searchValue, legaDoc])
    
    return (
        <>
            <div className='fileFolderModalBodyForFile' id='fileFolderModalBodyForFile'>

                {paralegalAttoryId?.includes(stateObj?.roleId) && <OccurrenceFileCabinet occurrenceId={28} cabinetName={cabinetcabinetName} documentsName={documentsName} showpreviewmodal={showpreviewmodal} setShowpreviewmodal={setShowpreviewmodal} reloadPage={reloadPage} />}
                <div className='row justify-content-center m-0 p-0'>
                    <div className="col-11  m-0 p-0">
                        <Row className='mt-4'>
                            <Col className=''>
                                <div className='row pt-0 p-3'>
                                    {/* File type dropdown, Show input field for legal only */}
                                    <div className={`dropdown-container p-0 ${(selectedCabinetId!=6 ?"d-none":"")}`}> 
                                        <p className="mb-2 drawerPara">File type*</p>
                                        <div className={`${(actionType === 'Edit') ? "disableCursor" : ""} row selectBorderHearAboutUs justify-content-between m-0 p-0`} onClick={() => { openFileDropdownFun() }}>
                                            <div className='col-11 p-0 selectBorderHearAboutUsLeftCol'>
                                                <span className={`${(selectedFileType == null) ? "" : "text-dark"}`}>{getSelectedFileType()}</span>
                                            </div>
                                            <div className='col-1 d-flex justify-content-center selectBorderHearAboutUsRightCol'>
                                                <img src="/icons/dropdownArrowNewFileCabinet.svg" alt="Dropdown Arrow" />
                                            </div>
                                        </div>
                                        {showFileTypeDropdown &&
                                            <div className='dropdown-content useNewDesignSCSS' ref={fileTypeRef}>
                                                <div className='d-flex justify-content-end mt-3'>
                                                    <div className='hearAbout p-3 pt-0 pb-0' style={{maxHeight: '250px', height: 'auto'}}>
                                                        <div className='search-bg px-0'>
                                                            <div className="input-container-Search">
                                                                <img className="mt-0" src="/New/icons/searchIconF.svg" alt="Search icon" />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search..."
                                                                    value={searchValue}
                                                                    onChange={(e) => setSearchValue(e.target.value)}
                                                                    // disabled={isDisable}
                                                                    autoFocus
                                                                />
                                                            </div>
                                                        </div>
                                                        {filteredOptions?.length > 0 ?  filteredOptions?.map((item, index) => (
                                                            <div className='options' key={index}>
                                                                <h3 className={`cursor-pointer ${item?.fileTypeId == selectedFileType ? "labelFontSizeForhearAbotusselected" : "labelFontSizeForhearAbotusUnselected"} ${item?.fileType == "Other" ?  'otherValueName' : ''}`}
                                                                    onClick={() => { setShowFileTypeDropdown(false); setSelectedFileType(item?.fileTypeId) }}
                                                                    title={item.fileType}
                                                                >{item.fileType}</h3>
                                                            </div>
                                                        )):     <div className="text-center no-data-found my-2">No Data Found</div>}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <Other
                                            addStyle={"NEWFILECABINET2"}
                                            othersCategoryId={31}
                                            userId={primaryMemberUserId}
                                            dropValue={selectedFileType}
                                            ref={otherFileTypeRef}
                                            natureId={isNotValidNullUndefile(selectFolderInfo?.fileId) ? selectFolderInfo?.fileId : ''} />
                                    </div>

                                    {/* <div className="col-12 mb-4 mt-4 p-0">
                              <p className="mb-2 drawerPara">Name</p>
                                <div className="rateCardDivOutlines" >
                                
                                    <div className="rateCardNameInputMainDivFile" >
                                        <input 
                                        type="text" 
                                        className='border-0 text-dark'   
                                        placeholder="Enter file name"
                                        // id={manageFileData?.fileFolderId}  
                                        // value={allFolderList?.length>0? allFolderList?.find(item => item?.folderId === manageFileData?.fileFolderId)?.folderName : "Folder"}  
                                        // disabled={uniqueref === 'STRUCTURE'}  
                                        />                                                
                                    </div>
                                </div>
                            </div> */}

                                    {/* {(manageFileData?.legalDocFileType == '999999') ? <>
                            <div className="col-12  mb-4 p-0">
                                <p className="mb-2 drawerPara">Others Description</p>
                                <Other 
                                addStyle={"addStyle"}
                                othersCategoryId={31} 
                                userId={primaryMemberUserId} 
                                dropValue={manageFileData?.legalDocFileType} 
                                ref={otherFileTypeRef} 
                                natureId={selectFolderInfo?.fileId} />
                            </div>
                            </> : null} */}

                                    <div className={`col-12  mb-3 p-0 ${(selectedCabinetId==6)?"mt-3":"mt-0"}`}>
                                        <div className='dropdown-container p-0'>
                                            <p className="mb-2 drawerPara">Belongs to*</p>
                                            <div className={`${(actionType === 'Edit') ? "disableCursor" : ""} row selectBorderHearAboutUs justify-content-between m-0 p-0`} onClick={() => { openBelongsTofun() }}  >
                                                <div className='col-11 p-0 selectBorderHearAboutUsLeftCol'>
                                                    <span className={`${(FileBelongsTo == null) ? "" : "text-dark"}`}>{fileBelongsToFun()}</span>
                                                </div>
                                                <div className='col-1 d-flex justify-content-center selectBorderHearAboutUsRightCol'>
                                                    <img src="/icons/dropdownArrowNewFileCabinet.svg" />
                                                </div>
                                            </div>
                                            {showBelongsToDropdown &&
                                                <div className='dropdown-content' ref={belongsRef}>
                                                    <div className='d-flex justify-content-end mt-3' >
                                                        <div className='hearAbout2 p-3 pt-2 pb-0'>
                                                            {belongsToDetails?.length > 0 && belongsToDetails?.map((item, index) => {
                                                                return (<div className='options'>
                                                                    <h3
                                                                        className={`cursor-pointer ${item?.value?.toLocaleLowerCase() == FileBelongsTo ? "labelFontSizeForhearAbotusselected" : "labelFontSizeForhearAbotusUnselected"}`}
                                                                        // className='labelFontSizeForhearAbotus' 
                                                                        onClick={() => { setShowBelongsToDropdown(false); setFileBelongsTo(item?.value?.toLocaleLowerCase()) }}
                                                                        key={index}
                                                                        value={item?.value?.toLocaleLowerCase()}> {item?.label}   </h3>
                                                                </div>)
                                                            }
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>}
                                        </div>
                                    </div>
                                    {/* <div className={`position-relative ${(actionType === 'Edit') ? "ProductNameMainSelectDivDisabled" : "ProductNameMainSelectDiv"}`} >
                                    <div className="">
                                <Form.Select id='belongsTo'  disabled={actionType == 'Edit'} className="selectForProductNamepaddingLeftZero"  value={manageFileData?.belongsTo?.toLocaleLowerCase()}  onChange={handleChangeCabinet} >
                                    <option disabled value="">Belongs to</option>
                                    {belongsToDetails?.map((item, index) => (<option key={index} value={item?.value?.toLocaleLowerCase()}> {item?.label}  </option>))}
                                    </Form.Select>
                                    </div>
                                </div> */}

                                    {/* Date of Sign off */}
                                    {
                                      manageFileData?.fileCategoryId==6 &&  
                                        <div className="col-12  mb-3 dateSignOffAndEmergencyDocumentDiv p-0">
                                        <p className="mb-2 drawerPara">Date of sign off</p>
                                        <div className="transparentInputDiv">
                                            <div className="rateCardNameInputMainDiv p-0" >
                                                <input
                                                    type="date"
                                                    className='border-0 text-dark'
                                                    // placeholder="Enter date"
                                                    value={manageFileData?.dateFinalized}
                                                    onChange={(e) => { handeEnteredDate(e) }}
                                                    onBlur={(e) => handleBlurDate(e)}
                                                    max={new Date().toISOString().split('T')[0]}
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    }                                  

                                    {/* Emeergency Document */}

                                    <div className="col-12 mb-4 p-0">
                                        <div className='dropdown-container p-0'>
                                            <p className="mb-2 drawerPara">You want to include this as an Emergency Document</p>
                                            <div className='row selectBorderHearAboutUs justify-content-between m-0 p-0' onClick={() => { emergencyDocumentTypeFun() }}>
                                                <div className='col-11 p-0 selectBorderHearAboutUsLeftCol'>
                                                    <span className={`${(emergencyDocumentType == null) ? "" : "text-dark"}`}>{emergencyDocumentTypeValue()}</span>
                                                </div>
                                                <div className='col-1 d-flex justify-content-center selectBorderHearAboutUsRightCol'>
                                                    <img src="/icons/dropdownArrowNewFileCabinet.svg" />
                                                </div>
                                            </div>
                                            {showEmergencyDocumentTypeDropdown &&
                                                <div className='dropdown-content' ref={EmergencyRef}>
                                                    <div className='d-flex justify-content-end mt-3' >
                                                        <div className='hearAbout2 p-3 pt-2 pb-0'>
                                                            {emergencyDocumentArr?.length > 0 && emergencyDocumentArr?.map((item, index) => {
                                                                return (<div className='options'>
                                                                    <h3
                                                                        className={`cursor-pointer ${item?.value == emergencyDocumentType ? "labelFontSizeForhearAbotusselected" : "labelFontSizeForhearAbotusUnselected"}`}
                                                                        // className='labelFontSizeForhearAbotus' 
                                                                        onClick={() => { setShowEmergencyDocumentTypeDropdown(false); setEmergencyDocumentType(item?.value) }}
                                                                        key={index}
                                                                        value={item?.value}> {item?.label}   </h3>
                                                                </div>)
                                                            }
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>}
                                        </div>
                                    </div>


                                    {/* <div className="col-12  mb-4 dateSignOffAndEmergencyDocumentDiv p-0">
                                <p className="mb-3 drawerPara">Emergency Document</p>
                                <div className=" position-relative ProductNameMainSelectDiv">
                                 
                                        <div className="">
                                            <Form.Select className="selectForProductNamepaddingLeftZero" onChange={handleChangeCabinet} id='emergencyDocument' value={manageFileData?.emergencyDocument} >
                                                <option value="" disabled>Select Emergency Document Type</option>
                                                {emergencyDocumentArr?.map((item, index) => (<option key={index} value={item['value']}> {item['label']}  </option>))}
                                            </Form.Select>
                                    </div>
                                </div>
                            </div>   */}






                                    {/* <div className='addFolderMianDiv position-relative'>
                                <div className='inputBoxUpload'>
                                {(uniqueref == 'STRUCTURE' && actionType == 'Edit') ? <></> :<Form.Control type='file' ref={fileRef} disabled={uniqueref == 'STRUCTURE' && actionType == 'Edit'} id='file' className="w-100" placeholder='Document to Upload' onChange={handleChangeCabinet} />}
                                </div>  
                                <div className='row uploadFileInputBox pl-2 pr-2'>
                                    <div className='col-1 p-2 d-flex justify-content-center align-items-center'>
                                        <img src="/icons/pdf-File-Image.svg" className="pdfOrDocImage mt-0 "></img> 
                                    </div>
                                    <div className='col p-0 d-flex align-items-center'>
                                        <div className='row addFolderMianDivText'>
                                        {actionType=="Add"?<>{uploadedFileName?.name? <p className=''>{uploadedFileName?.name}</p>: <p className=''>Upload a file to set out instructions, or <span className='text-primary'><b>Browse</b></span></p>}
                                        <span className=''>PDF file(Max 28MB each)</span>
                                        </>:
                                        <>
                                            <p className=''>{manageFileData?.name}</p>
                                            {uploadedFileName?.size? <span className=''>File size: {uploadedFileName?.size}</span>:<span className=''>PDF file(Max 28MB each){uploadedFileName?.size}</span>}
                                        </>
                                        }
                                        </div>  
                                    </div>
                                </div> 
                            </div>         */}


                                    <DragNdrop
                                        onFilesSelected={setFiles}
                                        width="300px"
                                        height='400px'
                                        handleChangeCabinet={handleChangeCabinet}
                                        filesProp={files}
                                        actionType={actionType}
                                    />

                                </div>


                            </Col>
                        </Row>
                        {(paralegalList2?.filter(item => (paralegalAttoryId?.includes(stateObj.roleId) ? item?.userId !== loggedUserId : item)).length !== 0 || beneficiaryFiduciaryList?.length !== 0) &&
                            <>
                                <div className=' shareFolderWithMainDivFile'>
                                    <div className='row '>
                                        {((paralegalAttoryId.includes(stateObj?.roleId)) || (!paralegalAttoryId?.includes(stateObj.roleId) && paralegalList2?.length !== 0)) && <>
                                            <div className='col d-flex justify-content-between align-items-center paddingNonInNewFileCabinet'>
                                                <div className='col-9 paddingNonInNewFileCabinet'>
                                                    <p className='newdrawerParaText p-2'>Who would you like to share document with ?</p>
                                                </div>

                                                {(actionType == 'Edit') ? <></> :
                                                    <div className='hideButtonContainer d-flex'>
                                                        <button onClick={(e) => skipBtnFun(e, 'yes')} className='hideButton d-flex align-items-center justify-content-center bg-transparent border-0 p-2 mb-3'>
                                                            <Form.Check inline className="chekspace cursor-pointer"
                                                                type="radio"
                                                                id="yesRadio"
                                                                name="skipOption"
                                                                value="yes"
                                                                checked={skipForNow}
                                                                onChange={(e) => skipBtnFun(e, 'yes')}
                                                            />
                                                            <label className='newdrawerParaText' htmlFor="yesRadio">Yes</label>
                                                        </button>
                                                        <button onClick={(e) => skipBtnFun(e, 'no')} className='hideButton d-flex align-items-center justify-content-center bg-transparent border-0 p-2 mb-3'>
                                                            <Form.Check inline className="chekspace cursor-pointer"
                                                                type="radio"
                                                                id="noRadio"
                                                                name="skipOption"
                                                                value="no"
                                                                checked={!skipForNow}
                                                                onChange={(e) => skipBtnFun(e, 'no')}
                                                            />
                                                            <label className='newdrawerParaText' htmlFor="noRadio">No</label>
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                            {(skipForNow === true || actionType == 'Edit') && (
                                                <>
                                                    <div className='InSomeNewFileCabinet'>
                                                        {
                                                            sharedFileMemberList?.
                                                                filter(item => (paralegalAttoryId?.includes(stateObj.roleId) ? item.name !== 'Legal Team' && item.name !== 'All' : item))?.
                                                                map((item, index) => {
                                                                    // konsole.log("itemitemitemitem123",item)
                                                                    return <>
                                                                        <div className="member-container" key={index}>
                                                                            {index != 0 && <p className="divider"> | </p>}
                                                                            <p
                                                                                className={`text-truncate memberRadioDiv cursor-pointer ${item?.value == true ? "overallBorderOnRadioAndTextActive text-white " : "overallBorderOnRadioAndText d-flex align-items-center"}`}
                                                                                style={{ marginLeft: index !== 0 ? '2px' : '0' }}
                                                                            >
                                                                                <Form.Check inline className={` ${item?.value == true ? "overallBorderOnRadioAndTextActiveVisible overallBorderOnRadioAndTextActiveHidden" : "margintopForRadioInFile overallBorderOnRadioAndTextActiveHidden d-flex"} `} type="radio" name={item?.name} id={item?.name} checked={item?.value} onChange={handleRadioChangeForMembers} />
                                                                                <span className='text-truncate d-inline-block'>{item?.name}</span>
                                                                            </p>
                                                                        </div>
                                                                    </>
                                                                })
                                                        }


                                                    </div>
                                                    <div className='row my-1' style={{ marginLeft: "3px" }}>
                                                        <div className='col-7 p-0 m-0 d-flex align-items-center'>
                                                            <p className='allContactsPara'>{`${searchedPlaceholder}`} ({(searchedPlaceholder == "All Contacts") ? <>{(paralegalListCount?.length + beneficiaryFiduciaryListCount?.length)}</> : (searchedPlaceholder == "Legal Team") ? <>{paralegalListCount?.length}</> : <>{beneficiaryFiduciaryListCount?.length}</>})</p>
                                                        </div>
                                                        <div className='col-3 p-0 m-0'>
                                                            <div className='search-bar'>
                                                                <InputGroup className="custom-input-group">
                                                                    <InputGroup.Text className="custom-input-group-text">
                                                                        <img src="/icons/FileCabinetSearchIcon.svg" className="search-icon bg-transparent"></img>
                                                                    </InputGroup.Text>
                                                                    <Form.Control className="custom-search-input" placeholder={`Search ${searchedPlaceholder}`} onChange={seachContacts} />
                                                                </InputGroup>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='overflowAdjustmentsInAddFile mt-4 mb-5'>
                                                        <table className="familyMemberTableForFile">
                                                                            <tr className="firstRowTable tabRowWidth">
                                                                                {tableHeadingForFile.map((values,key)=><th><div className={`d-flex align-items-center`} >{values}</div></th>)}
                                                                            </tr>
                                                       

                                                        {showFidBen && (
                                                            <>
                                                                {beneficiaryFiduciaryList?.length > 0 && (
                                                                    <>
                                                                        {beneficiaryFiduciaryListCount?.map((item, index) => {
                                                                            return <>{mappingRetrurnPermissionCheckBox2(item?.label, item?.value, "fid/ben", item?.emailId,item)}</>;
                                                                        })}
                                                                        {beneficiaryFiduciaryList?.filter((item) => (
                                                                            (item?.label?.toLowerCase()?.includes(searchedContact?.toLowerCase())) || 
                                                                            (item?.emailId?.toLowerCase()?.includes(searchedContact?.toLowerCase()))
                                                                    ))?.length === 0 && 
                                                                            <div className='dataNotFound  mb-2'><q>Data not found in Beneficiary / Fiduciary</q></div>
                                                                        }
                                                                    </>
                                                                )}
                                                            </>
                                                        )}

                                                         {showLegalTeam && (
                                                            <>
                                                                {!paralegalAttoryId?.includes(stateObj.roleId) && (
                                                                    <>
                                                                        {paralegalList2?.filter(item => (paralegalAttoryId?.includes(stateObj.roleId) ? item.userId !== loggedUserId : item))?.length > 0 && (
                                                                            <> 
                                                                                {paralegalListCount?.map((item, index) => {
                                                                                        return <>{mappingRetrurnPermissionCheckBox2(item?.fullName, item?.userId, "paralegal", item?.primaryEmail,item)}</>;
                                                                                    })}
                                                                                     {paralegalList2?.filter(item => (paralegalAttoryId?.includes(stateObj.roleId) ? item.userId !== loggedUserId : item))
                                                                                    .filter((item) => (
                                                                                        (item?.fullName && item?.fullName?.toLowerCase()?.includes(searchedContact?.toLowerCase())) ||
                                                                                        (item?.userName && item?.userName?.toLowerCase()?.includes(searchedContact?.toLowerCase()))
                                                                                    ))?.length === 0 &&
                                                                                    <div className='dataNotFound mb-2'><q>Data not found in Legal Team</q></div>
                                                                                }                                                                                                                                              
                                                                            </>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </table>
                                                    </div>


                                                </>
                                            )}

                                        </>}

                                    </div>
                                </div>
                            </>}
                        {((beneficiaryFiduciaryList?.length == 0 && searchedPlaceholder == "Beneficiary / Fiduciary") || (beneficiaryFiduciaryList?.length == 0 && paralegalAttoryId?.includes(stateObj.roleId))) && skipForNow==true && <div className='dataNotFound mb-3 mt-2'><q>Kindly add Beneficiary/Fiduciary</q></div>}


                    </div>
                </div>
            </div>
            <Row className="d-flex justify-content-end footerBoxShadow">
                <Col lg="5" >
                    <div className='d-flex justify-content-end '>
                        {disableSavebutton == true ? <button className='fileSaveEditButton' > {actionType == "Add" ? "Save" : "Update"}</button> : <button className='fileSaveEditButton' onClick={() => saveFileFun()}> {actionType == "Add" ? "Save" : "Update"}</button>}
                    </div>
                </Col>
            </Row>
        </>

    )
}


const mapStateToProps = (state) => ({ ...state.main });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddFile);