import React, { useContext, useEffect, useState, useRef } from 'react'
import { Col, Row, Form, Button,InputGroup } from 'react-bootstrap'
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

let cretObj = () => {
    return { file: '', name: '', cabinetId: '', fileCategoryId: '', fileFolderId: '', belongsTo: '', dateFinalized: '', locationOfDocument: '', emergencyDocument: '', legalDocFileType: '', description: '' }
}


const AddFile = ({ functionForGetFileAfterAddEditFile, refrencePage, uniqueref, selectFolderInfo, fileAddFrom, dispatchloader, actionType, setShowAddEditFolder, setManageShowFileType }) => {
    const folderPermissionMsg="Please provide the Firm folder access to the selected person, then proceed with the further permissions"

    let { allMainCabinetContainer, cabinetList, allFolderList, beneficiaryFiduciaryList, userProfessionalList, sharedFileShatusList, paralegalList, permissionsFolder } = useContext(FileCabinetContext)
    let primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
    let loggedUserId = sessionStorage.getItem('loggedUserId')
    let spouseUserId = sessionStorage.getItem('spouseUserId')
    let userDetailOfPrimary = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'))
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
    const[showLegalTeam,setshowLegalTeam]=useState(true)
    const[showFidBen,setshowFidBen]=useState(true)
    const[disableSavebutton,setDisableSavebutton]=useState(false)
    const[uploadedFileName,setUploadedFileName]=useState({})
    const[searchedPlaceholder,setSearchedPlaceholder]=useState("All Contacts")
    const[showShareDocumentButton,setShowShareDocumentButton]=useState(false)
    const [sharedFileMemberList, setSharedFileMemberList] = useState([
        { name: "All", value: true },
        { name: "Legal Team", value: false },
        { name: "Beneficiary / Fiduciary", value: paralegalAttoryId.includes(stateObj.roleId) ? true:false },
      ]);
    const [searchedContact, setSearchedContact] = useState('')
    let paralegalList2 = (manageFileData?.fileCategoryId == categoryFileCabinet[0]) ? paralegalList : []

    useEffect(()=>{
       let getSharedMemberList= sharedFileMemberList?.filter(item => (paralegalAttoryId?.includes(stateObj?.roleId) ? item?.name !== 'Legal Team' && item?.name !== 'All' : item))?.map((item,index)=>item)
       if(getSharedMemberList?.length>0){ 
           let memberPlaceholderListName=getSharedMemberList[0].name;
           if(memberPlaceholderListName=="All"){setSearchedPlaceholder("All Contacts")}else{setSearchedPlaceholder(memberPlaceholderListName)}  
        }
        //    konsole.log("setPlaceholder",getSharedMemberList[0])
    },[])
    
    useEffect(() => {
        if (refrencePage == 'STRUCTURE' && actionType == 'Add') {
            let { folderCabinetId, folderFileCategoryId, folderId, folderName } = selectFolderInfo
            setManageFileData(prev => ({
                ...prev,
                cabinetId: folderCabinetId, fileCategoryId: folderFileCategoryId, fileFolderId: folderId
            }))
            setFileStatusId(prev => (folderName == 'Draft' ? 1 : 2));
            commonForCabinetCategory('cabinetId', folderCabinetId)
            commonForCabinetCategory('fileCategoryId', folderFileCategoryId)
            handleOnBlur(folderFileCategoryId)
        } else if (refrencePage == 'STRUCTURE' && actionType == 'Edit') {
            let { cabinetId, fileCategoryId, fileId, fileTypeId, folderId, fileBelongsTo, fileURL, fileTypeName, documentLocation, emergencyDocument, userFileName, description, dateFinalized, folderName } = selectFolderInfo

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
        dispatchloader(true)
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
            dispatchloader(false)
        }).catch((err) => {
            dispatchloader(false)
            konsole.log('getfileBelongsTo', err)
        })
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

    const handleChangeCabinet = (e) => {
        let { value, id, files } = e.target
        if (id == 'file') {      
            let fileofsize = files[0].size;
            let selectFiles = files[0]
            if (selectFiles?.type !== 'application/pdf') {
                AlertToaster.error("Only Pdf format is allowed.");
                fileRef.current.value = ''
                return;
            }
            if ($AHelper.fileuploadsizetest(fileofsize)) {
                toasterAlert(fileLargeMsg, "Warning");
                fileRef.current.value = ''
                return;
              }
            setUploadedFileName(files[0])
            // konsole.log('ggfgfgfgf', files[0])
        }
        let valueAll = (id == 'file') ? files[0] : (id == 'emergencyDocument') ? value : $AHelper.capitalizeFirstLetter(value)
        handleInput(id, valueAll)
        commonForCabinetCategory(id, value)
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
        setManageFileData(prev => ({...prev,[key]: value }))
    }

    //  this function use for get file type base on categry Id--------------------------------------------------------------------------------------------------------------
    const handleOnBlur = (fileCategoryId) => {
        let fileCategory = (refrencePage === 'STRUCTURE') ? fileCategoryId : manageFileData?.fileCategoryId
        dispatchloader(true)
        Services.getFileTypeByCategory(fileCategory)
            .then((res) => {
                dispatchloader(false)
                konsole.log('getFileTypeByCategory', res)
                const responseData = res?.data?.data;
                const result = responseData?.sort((a, b) => a?.fileType.localeCompare(b?.fileType));
                setLegalDoc(result)
            }).catch((err) => {
                dispatchloader(false)
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
        'legalDocFileType': 'Please select document type',
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
                toasterAlert(warningMessage[key])
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
        setDisableSavebutton(true)
        // if (validateObject(manageFileData)) return;
        
        let { file, name, fileCategoryId, description, belongsTo, dateFinalized, locationOfDocument, emergencyDocument, legalDocFileType } = manageFileData
        if (file == undefined || file == null || file == "") {
            toasterAlert(warningMessage['file'])
            setDisableSavebutton(false)
            return;
        }
        if (legalDocFileType == undefined || legalDocFileType == null || legalDocFileType == "") {
            toasterAlert(warningMessage['legalDocFileType'])
            setDisableSavebutton(false)
            return;
        }
        if (belongsTo == undefined || belongsTo == null || belongsTo == "") {
            toasterAlert(warningMessage['belongsTo'])
            setDisableSavebutton(false)
            return;
        }

        let jsonObj = {
            FileId: fileId,
            UserId: primaryMemberUserId,
            File: file,
            UploadedBy: loggedUserId,
            FileTypeId: legalDocFileType == '' ? null : Number(legalDocFileType),
            FileCategoryId: Number(fileCategoryId),
            FileStatusId: fileStatusId, // 2,
            EmergencyDocument: emergencyDocument,
            DocumentLocation: locationOfDocument,
            UserFileName: file?.name || name ,
            DateFinalized: dateFinalized,
            Description: description
        }
        konsole.log('jsonObjjsonObjjsonObj', jsonObj)
        dispatchloader(true)
        Services.postUploadUserDocumantV2({ ...jsonObj }).then((res) => {
            dispatchloader(false)
            konsole.log('uploadUserDoc', res)
            let responseData = res?.data?.data
            if (jsonObj.FileTypeId == '999999') {
                otherFileTypeRef.current.saveHandleOther(responseData?.fileId);
            }
            if (actionType !== 'Edit') {
                apiCallUserFileCabinetAdd(responseData)
            } else if (jsonObjForShareStatus.length > 0) {
                apiCallUpsertShareFileStatus(responseData.fileId, manageFileData?.belongsTo)
            } else {
                // window.location.reload()
                AlertToaster.success(fileAddUpdateMsg)
                openEmailModal()
            }
        }).catch((err) => {
            setDisableSavebutton(false)
            dispatchloader(false)
            konsole.log(' err in uploadUserDoc', err, err?.response)
            window.location.reload()
        })
        konsole.log('jsonObjjsonObj', jsonObj)
    }

    // konsole.log('manageFileDatamanageFileData', manageFileData)

    const apiCallUserFileCabinetAdd = (responseData) => {
        let { fileCategoryId, fileId, fileStatusId, fileTypeId } = responseData
        let belongsTo = [{ "fileBelongsTo": manageFileData.belongsTo }]
        if (manageFileData.belongsTo == 'Joint') {
            belongsTo = belongsToDetails?.filter(({ value }) => value !== 'JOINT').map(({ value }) => ({ fileBelongsTo: value }));
        }
        let postJson = createFileCabinetFileAdd({ cabinetId: manageFileData.cabinetId, belongsTo, fileUploadedBy: loggedUserId, fileCategoryId, folderId: Number(manageFileData.fileFolderId), fileId, fileStatusId, fileTypeId, primaryUserId: primaryMemberUserId })
        // konsole.log('postJsonapiCallUserFileCabinetAdd', postJson)
        // return
        dispatchloader(true)
        Services.addUserFileCabinet(postJson).then((res) => {
            dispatchloader(false)
            konsole.log('addUserFileCabinet', res)
            if (jsonObjForShareStatus.length > 0) {
                let fileBelongsTo = belongsTo[0].fileBelongsTo
                apiCallUpsertShareFileStatus(fileId, fileBelongsTo)
            } else {
                AlertToaster.success(fileAddUpdateMsg)
                // reloadPage()
                openEmailModal()
            }
        }).catch((err) => {
            dispatchloader(false)
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
        dispatchloader(true)
        Services.upsertShareFileStatus(myNewArray).then((res) => {
            konsole.log('res of upser file share', res)
            dispatchloader(false)
            AlertToaster.success(fileAddUpdateMsg)
            // window.location.reload()
            openEmailModal()
            // reloadPage()
        }).catch((err) => {
            dispatchloader(false)
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
            return toasterAlert('Please select folder.')
        }
        if (typeOfUser !== "fid/ben" && typeOfUser !== 'professional' && filterFolder == false) {
            toasterAlert(folderPermissionMsg);
            return;
        }      
        if (findIndexExistsValue != '-1') {
            let { isRead, isEdit, isDelete, } = jsonObjForShareStatus[findIndexExistsValue]
            if (id == 'isRead' && isRead == true && (isEdit == true || isDelete == true) && checked == false) {
                toasterAlert('Please uncheck Edit/Delete first.')
                return;

            }
        }

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
    
    const toggleSwitchForContacts=(e,sharedUserId,typeOfUser)=>{

        const toggleStatus=e?.target?.checked;
        let findIndexExistsValue = jsonObjForShareStatus?.length > 0 ? jsonObjForShareStatus?.findIndex((item) => item?.sharedUserId == sharedUserId) : '-1'
        let filterFolder = permissionsFolder?.length > 0 ? permissionsFolder?.some((item) => item?.folderId == manageFileData?.fileFolderId && item?.sharedUserId == sharedUserId) : false
        
        if (manageFileData?.fileFolderId == '') {
            return toasterAlert('Please select folder.')
        }
        if (typeOfUser !== "fid/ben" && typeOfUser !== 'professional' && filterFolder == false) {
            toasterAlert(folderPermissionMsg)
            return;
        }
        if (findIndexExistsValue == '-1') {
            const newObj = cretaeJsonForFilePermission({ 
                primaryUserId: primaryMemberUserId,
                sharedUserId,
                ['isRead'] : toggleStatus,
                ['isEdit'] : toggleStatus,
                ['isDelete'] : toggleStatus,
                ...manageCreate, ...manageUpdate, })
            if (jsonObjForShareStatus !== false) {
                setJsonObjForShareStatus(prevState => [...prevState, newObj]);
            } else {
                setJsonObjForShareStatus([{ ...newObj }]);
            }
        } else {
            setJsonObjForShareStatus((prev) => {
                let newArray = [...prev]
                newArray[findIndexExistsValue]['isRead']= toggleStatus
                newArray[findIndexExistsValue]['isEdit']= toggleStatus
                newArray[findIndexExistsValue]['isDelete']= toggleStatus
                return newArray
            });
        }



    }

    const checkChecked = (type, userId) => {
        // konsole.log("typeuserIduserId",type,"----",userId)
        return jsonObjForShareStatus?.length > 0 && jsonObjForShareStatus?.some((item) => item?.sharedUserId == userId && item[type] == true)
    }

    const checkToggleButton=(userId)=>{
        return jsonObjForShareStatus?.length > 0 && jsonObjForShareStatus?.some((item) => item?.sharedUserId == userId && (item?.isRead == true  || item?.isEdit == true || item?.isDelete == true) ) 
    }   

    const skipBtnFun = () => { 
        if (paralegalAttoryId.includes(stateObj?.roleId)) {
            const filtered = jsonObjForShareStatus?.filter(item => paralegalAttoryId?.includes(item?.roleId?.toString()));
            setJsonObjForShareStatus(filtered)
        } else {
            setJsonObjForShareStatus([])
        }
        setSkipForNow(!skipForNow)
    }

    const selectChackBoxForFile2 = (id, userId, typeOfUser,label) => {
        // konsole.log("iypeOfUserid",id,userId)
        return (<td>
        <Form.Group className="ms-2  d-flex justify-content-center checkbox-group ">
            <Form.Check
             className="contactCheckox" 
             type="checkbox" 
             name={id} 
             id={id} 
             checked={checkChecked(id, userId)} 
            //  label={`${label}`}
             onChange={(e) => mappingCheckBoxValue(e, userId, typeOfUser)} 
             />
             <lablel className={`${(checkChecked(id, userId)==true?"contactCheckboxlabelSelected":"contactCheckboxlabelNotSelected")}`} >{`${label}`} </lablel>
        </Form.Group>
        </td>)
    }

    const handleRadioChangeForMembers = (e) => {
        // konsole.log("handleRadioChangeForMembers", e.target.id);
        const { id, checked } = e.target;
        setSearchedPlaceholder(id)
        setshowLegalTeam(id === "Legal Team");
        setshowFidBen(id === "Beneficiary / Fiduciary");
        if(id === "All")  {
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

    const functionToAddBorderAndColorOnClickingAnyRadio=(userId)=>
    {
            const checkIfFilePermissionIsSelected=jsonObjForShareStatus?.length > 0 && jsonObjForShareStatus?.some((item) => item?.sharedUserId == userId && (item ['isRead']== true || item['isEdit']== true || item['isDelete']== true))
            return checkIfFilePermissionIsSelected
    }

    const mappingRetrurnPermissionCheckBox2 = (itemName, userId, typeOfUser,itemEmail) => {
        return (<>
            <div  className={`contactsOuterBorder mb-4 mt-4 ${functionToAddBorderAndColorOnClickingAnyRadio(userId)==true?"contactCardColorChange" : " "}`} > 
                                        <div className={`row  pt-3 pb-3 ${functionToAddBorderAndColorOnClickingAnyRadio(userId)==true?  "lightMangentaBorderBottom"  :  " greyBorderBottom"} `}>
                                                <div className='col-11 '>
                                                    <div className='row'>
                                                        <div className='col-1  p-0 d-flex justify-content-center'>
                                                            <img 
                                                            src={`${functionToAddBorderAndColorOnClickingAnyRadio(userId)==true?"./icons/userMaroon.svg":"./icons/user.svg"}`}
                                                            className='roundedImage mt-0'></img>
                                                        </div>
                                                        <div className='col  d-flex align-items-center'>
                                                            <div className='contactDetail'>
                                                                <p className="pb-1">{itemName}</p>
                                                                <span className=''>{itemEmail ? itemEmail :"N/A"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-1 mt-2'>
                                                <div class="form-check form-switch contactSwitch">
                                                    <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{width:" 39px"}} checked={checkToggleButton(userId)} onChange={(e)=>toggleSwitchForContacts(e,userId,typeOfUser)} />
                                                </div>
                                                </div>
                                        </div>
                                        <div className='row justify-content-between mt-3' style={{padding:"0px 17px"}}>
                                            <div className='col-3 p-0'>
                                                {selectChackBoxForFile2('isRead', userId, typeOfUser,"Read")}
                                            </div>
                                            <div className='col-3 p-0 d-flex justify-content-center'>
                                                {selectChackBoxForFile2('isEdit', userId, typeOfUser,"Edit")}
                                            </div>
                                            <div className='col-3 p-0 d-flex justify-content-end'>
                                                {selectChackBoxForFile2('isDelete', userId, typeOfUser,"Delete")} 
                                            </div>                                   
                                        </div>
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
    function toasterAlert(text) {
        setdata({ open: true, text: text, type: "Warning" });
    }

    function seachContacts(e)
    {
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
    // konsole.log('manageFileDatalegalDocFileType', manageFileData?.legalDocFileType,emergencyDocumentArr)
    // konsole.log("fileeename",uploadedFileName)

    let cabinetcabinetName = categoryList?.find(({ fileCategoryId }) => fileCategoryId == manageFileData?.fileCategoryId)?.fileCategoryType
    let documentsName = legaDoc?.find(({ fileTypeId }) => fileTypeId == manageFileData?.legalDocFileType)?.fileType

    konsole.log('paralegalListparalegalListparalegalList', paralegalList.length, userProfessionalList, beneficiaryFiduciaryList.length)
    // konsole.log('cabinetcabinetName', manageFileData.belongsTo,belongsToDetails)
    konsole.log('manageFileDataemergencyDocument', manageFileData.emergencyDocument)
    konsole.log('fileCategoryIdfileCategoryId', manageFileData?.fileCategoryId, categoryFileCabinet[0])
    console.log("paralegalList2",paralegalList2)

    const handeEnteredDate=(event)=>{
        const inputDate = event?.target?.value;
        const year = inputDate?.split("-")[0];
        // konsole.log("inputDateinputDate",inputDate)
        if (year.length > 4) return;
        setManageFileData(prev => ({ ...prev, dateFinalized: inputDate }));
    }

    return (
        <>
            <div className='fileFolderModalBodyForFile'>

{paralegalAttoryId?.includes(stateObj?.roleId) && <OccurrenceFileCabinet occurrenceId={28} cabinetName={cabinetcabinetName} documentsName={documentsName} showpreviewmodal={showpreviewmodal} setShowpreviewmodal={setShowpreviewmodal} reloadPage={reloadPage}/>}
<Row lg='8' >
    <Col 
     className='main-col'>
        <Row className='mt-2'>
            <Col  className=''>
                <div className='addFolderMianDiv p-4 position-relative'>
                    <div className='inputBoxUpload'>
                    {(uniqueref == 'STRUCTURE' && actionType == 'Edit') ? <>
                            {/* <Form.Control as={'input'} type='text' disabled={true} className="w-100" value={manageFileData?.name} /> */}

                        </> :
                            <Form.Control type='file' ref={fileRef} disabled={uniqueref == 'STRUCTURE' && actionType == 'Edit'} id='file' className="w-100" placeholder='Document to Upload' onChange={handleChangeCabinet} />
                    }
                    </div>  
                     <div className='row uploadFileInputBox'>
                        <div className='col-1 p-4 d-flex justify-content-center align-items-center'>
                            <img src="/icons/pdf-File-Image.svg" className="pdfOrDocImage mt-0 "></img> 
                        </div>
                        <div className='col p-0 d-flex align-items-center'>
                            <div className='row addFolderMianDivText'>
                               {actionType=="Add"?<>{uploadedFileName?.name? <p className=''>{uploadedFileName?.name}</p>: <p className=''>Upload a file to set out instructions, or <span className='text-primary'><b>Browse</b></span></p>}
                               <span className=''>PDF file(Max 100MB each)</span>
                               </>:
                               <>
                                  <p className=''>{manageFileData?.name}</p>
                                  {uploadedFileName?.size? <span className=''>File size: {uploadedFileName?.size}</span>:<span className=''>PDF file(Max 100MB each){uploadedFileName?.size}</span>}
                              </>
                              }
                            </div>  
                        </div>
                     </div> 
                   </div>
                
                    <div className='row pt-0 p-3'>
                            <div className="col-6 p-3 pt-0 mt-2 ">
                                <p className="mb-3 drawerPara">Drawer</p>
                                <div className={`position-relative ${(uniqueref === 'STRUCTURE') ? "ProductNameMainSelectDivDisabled" : "ProductNameMainSelectDiv"}`}>
                                    <img src="./icons/colletionIcon.svg"  alt="x" className="subscriptioModelboxStyleImage"></img>
                                    <div className="">
                                            <Form.Select  className="selectForProductName" id='fileCategoryId'  onChange={handleChangeCabinet}  onBlur={handleOnBlur} value={manageFileData?.fileCategoryId} disabled={uniqueref === 'STRUCTURE'}>
                                                <option disabled value="">Select any Drawer</option>
                                                {categoryList?.map(category => (
                                                <option key={category?.fileCategoryId} value={category?.fileCategoryId}>
                                                    {category?.fileCategoryType}
                                                </option>
                                                ))}
                                            </Form.Select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 p-3 pt-0 mt-2 ">
                            <p className="mb-3 drawerPara">Folder</p>
                                <div  className={`${(uniqueref === 'STRUCTURE') ? "rateCardDivOutlinesDisabled" : "rateCardDivOutlines"}`} >
                                    <span className="spanRateCardname" >Aa</span>
                                    <div className="rateCardNameInputMainDiv" >
                                        <input type="text" className='border-0 text-dark'   placeholder="Folder Name"  id={manageFileData?.fileFolderId}  value={allFolderList?.length>0? allFolderList?.find(item => item?.folderId === manageFileData?.fileFolderId)?.folderName : "Folder"}  disabled={uniqueref === 'STRUCTURE'}/>                                                
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 p-3 pt-0 ">
                                <p className="mb-3 drawerPara">Document Type</p>
                                <div  className={`position-relative ${(actionType === 'Edit') ? "ProductNameMainSelectDivDisabled" : "ProductNameMainSelectDiv"}`}  >
                                    <div className="">
                                    <Form.Select className="selectForProductNamepaddingLeftZero " disabled={actionType === 'Edit'} value={manageFileData?.legalDocFileType}  onChange={handleChangeCabinet}  id='legalDocFileType' >
                                    <option disabled value="">Select Document Type</option>
                                    {legaDoc?.map((item, index) => (<option key={index} value={item['fileTypeId']}> {item['fileType']}  </option>))}
                                    </Form.Select>
                                    </div>
                                </div>
                            </div>

                            {(manageFileData?.legalDocFileType == '999999') ? <>
                            <div className="col-6 p-3 pt-0 ">
                                <p className="mb-3 drawerPara useNewDesignSCSS">Others Description</p>
                                <Other 
                                addStyle={"addStyle"}
                                othersCategoryId={31} 
                                userId={primaryMemberUserId} 
                                dropValue={manageFileData?.legalDocFileType} 
                                ref={otherFileTypeRef} 
                                natureId={selectFolderInfo?.fileId} />
                            </div>
                            </> : null}
                          

                            <div className="col-6 p-3 pt-0 ">
                                <p className="mb-3 drawerPara">Belongs to</p>
                                <div className={`position-relative ${(actionType === 'Edit') ? "ProductNameMainSelectDivDisabled" : "ProductNameMainSelectDiv"}`} >
                                    <div className="">
                                <Form.Select id='belongsTo'  disabled={actionType == 'Edit'} className="selectForProductNamepaddingLeftZero"  value={manageFileData?.belongsTo?.toLocaleLowerCase()}  onChange={handleChangeCabinet} >
                                    <option disabled value="">Belongs to</option>
                                    {belongsToDetails?.map((item, index) => (<option key={index} value={item?.value?.toLocaleLowerCase()}> {item?.label}  </option>))}
                                    </Form.Select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 dateSignOffAndEmergencyDocumentDiv ">
                            <p className="mb-3 drawerPara">Date of sign off</p>
                                <div className="transparentInputDiv">
                                    <div className="rateCardNameInputMainDiv p-0" >
                                        <input 
                                        type="date" 
                                        className='border-0 text-dark' 
                                        // placeholder="Enter date"
                                         value={manageFileData?.dateFinalized} 
                                        onChange={(e) => {handeEnteredDate(e)}} 
                                        // readOnly={false} 
                                         max="100"  min="0" 
                                         />
                                    </div>
                                </div>
                            </div>  

                            <div className="col-6 dateSignOffAndEmergencyDocumentDiv ">
                                <p className="mb-3 drawerPara">Emergency Document</p>
                                <div className=" position-relative ProductNameMainSelectDiv">
                                    {/* <img src="./icons/alfabatTextIcon.svg"  alt="x" className="subscriptioModelboxStyleImage"></img> */}
                                        <div className="">
                                            <Form.Select className="selectForProductNamepaddingLeftZero" onChange={handleChangeCabinet} id='emergencyDocument' value={manageFileData?.emergencyDocument} >
                                                <option value="" disabled>Select Emergency Document Type</option>
                                                {emergencyDocumentArr?.map((item, index) => (<option key={index} value={item['value']}> {item['label']}  </option>))}
                                            </Form.Select>
                                    </div>
                                </div>
                            </div>         
                    </div>


           </Col>
        </Row>

             {(paralegalList2?.filter(item => (paralegalAttoryId?.includes(stateObj.roleId) ? item?.userId !== loggedUserId : item)).length !== 0 || beneficiaryFiduciaryList?.length !== 0) &&
              <>
                        <div className=' shareFolderWithMainDivFile'> 
                            <div className='row '>                                  
                      {((paralegalAttoryId.includes(stateObj?.roleId) ) || (!paralegalAttoryId?.includes(stateObj.roleId) && paralegalList2?.length !== 0)) && <>                                 
                        <div className='col-9'>
                            <p className='paraToShareFolderWith p-2 mb-3'>Who would you like to share document with ?</p>
                        </div>
                        <div className='col d-flex justify-content-end'>

                        {(actionType == 'Edit')?<></>:
                          <button onClick={(e) => skipBtnFun(e)} className='hideButton bg-transparent border-0 p-2 mb-3'>
                            {(skipForNow === true)?
                            <>
                             <img src="/icons/minusMaroon.svg" className='mt-0 ml-3' style={{width:" 18px"}}></img>
                             <span className='p-2'>Hide</span>
                            </>
                            :
                            <>
                             <img src="/icons/plusMaroon.svg" className=' ml-3' style={{height:" 15px",marginTop:" -3px"}}></img>
                             <span className='p-2'>Show</span>
                            </> 
                             }                                  
                            </button>
                        }                                  
                        </div>
                        {(skipForNow === true || actionType == 'Edit') && (
                            <>
                             <div className=''>
                             {
                                sharedFileMemberList?.filter(item => (paralegalAttoryId?.includes(stateObj.roleId) ? item.name !== 'Legal Team' && item.name !== 'All' : item))?.map((item,index)=>{
                                    // konsole.log("itemitemitemitem123",item)
                                    return <>
                                        <p className={`text-truncate memberRadioDiv  ${item?.value==true?"overallBorderOnRadioAndTextActive text-white ":"overallBorderOnRadioAndText"}    `}>
                                                <Form.Check inline  className={` ${item?.value==true?"overallBorderOnRadioAndTextActiveVisible overallBorderOnRadioAndTextActiveHidden":"margintopForRadioInFile overallBorderOnRadioAndTextActiveHidden"} ` } type="radio" name={item?.name}  id={item?.name}  checked={item?.value} onChange={handleRadioChangeForMembers}/>
                                                <span className='text-truncate d-inline-block'>{item?.name}</span>
                                        </p>                                  
                                </>                                    
                                })
                             }
                                

                            </div>
                            <div className='row mb-3' style={{marginTop: "25px",marginLeft: "3px"}}>
                            <div className='col-7 '>
                                <p className='allContactsPara'>{`${searchedPlaceholder}`} ({(searchedPlaceholder=="All Contacts")?<>{(paralegalList2?.length+beneficiaryFiduciaryList?.length)}</>:(searchedPlaceholder=="Legal Team")?<>{paralegalList2?.length}</>:<>{beneficiaryFiduciaryList?.length}</>})</p>
                            </div>
                            <div className='col'>
                                <div className='row p-0' style={{margin:" 0px 0px 0px 16px" }}>
                                <InputGroup className="mb-3 w-100 p-0" >
                                    <Form.Control className="familySearchInput" placeholder={`Search ${searchedPlaceholder}`}  onChange={seachContacts}/>
                                    <InputGroup.Text ><img src="./icons/search-icon.svg" className='mt-0' style={{padding:" 0px 5px",height:"18px"}}></img></InputGroup.Text>
                                </InputGroup>
                                </div>
                            </div>
                        </div>

                        <div className='overflowAdjustmentsInAddFile'>
                        {showLegalTeam && (
                            <>
                                {!paralegalAttoryId?.includes(stateObj.roleId) && (
                                    <>
                                        {paralegalList2?.filter(item => (paralegalAttoryId?.includes(stateObj.roleId) ? item.userId !== loggedUserId : item))?.length > 0 && (
                                            <>                                              
                                                {paralegalList2?.filter(item => (paralegalAttoryId?.includes(stateObj.roleId) ? item?.userId !== loggedUserId : item))
                                                 .filter((item) => (
                                                    (item?.fullName && item?.fullName?.toLowerCase()?.includes(searchedContact?.toLowerCase())) || 
                                                    (item?.userName && item?.userName?.toLowerCase()?.includes(searchedContact?.toLowerCase()))
                                                    ))
                                                .map((item, index) => {  
                                                    return <>{mappingRetrurnPermissionCheckBox2(item?.fullName, item?.userId, "paralegal",item?.primaryEmail)}</>;
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

                        {showFidBen && (
                            <>
                                {beneficiaryFiduciaryList?.length > 0 && (
                                    <>
                                        {beneficiaryFiduciaryList?.filter((item)=>item?.label?.toLowerCase()?.includes(searchedContact?.toLowerCase()))?.map((item, index) => {
                                            return <>{mappingRetrurnPermissionCheckBox2(item?.label, item?.value, "fid/ben",item?.emailId)}</>;
                                        })}
                                        {beneficiaryFiduciaryList?.filter((item)=>item?.label?.toLowerCase()?.includes(searchedContact?.toLowerCase()))?.length === 0 &&
                                               <div className='dataNotFound  mb-2'><q>Data not found in Beneficiary / Fiduciary</q></div>
                                        }
                                    </>
                                )}
                            </>
                        )}
                        </div>
                      

                            </>
                        )}

                      </>}                          

                            </div>
                        </div>          
              </>}            
                {((beneficiaryFiduciaryList?.length == 0 && searchedPlaceholder=="Beneficiary / Fiduciary") || (beneficiaryFiduciaryList?.length == 0 && paralegalAttoryId?.includes(stateObj.roleId))) && <div className='dataNotFound mb-3'><q>Kindly add Beneficiary/Fiduciary</q></div> }                          
        
        
        </Col>
    </Row>
    </div>
    <Row  className="d-flex justify-content-end footerBoxShadow">
    <Col lg="5" >
    <div className='d-flex justify-content-end '>
        {disableSavebutton==true? <button className='fileSaveEditButton' > {actionType=="Add"?"Save":"Update"}</button>: <button className='fileSaveEditButton' onClick={() => saveFileFun()}> {actionType=="Add"?"Save":"Update"}</button>}   
    </div>
    </Col>
    </Row>
        </>
        
    )
}


const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddFile);