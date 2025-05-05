import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Button, Form,InputGroup } from 'react-bootstrap'
import { InputCom, InputSelectCom } from './InputCom'
import { FileCabinetContext } from './ParentCabinet'
import { $AHelper } from '../control/AHelper.js';
import konsole from '../control/Konsole.js';
import { globalContext } from '../../pages/_app';
import Table from 'react-bootstrap/Table';
import { Services } from '../network/Service.js';
import { SET_LOADER } from '../Store/Actions/action';
import AlertToaster from '../control/AlertToaster';
import { connect } from 'react-redux';
import { createCategoryObjJson,categoryFileCabinet, createFolderObjJson, operationForCategoryType, folderOperationType, cretaeJsonForFolderPermission, sortingFolderForCabinet, notEditableFolderForCabinet, paralegalAttoryId } from '../control/Constant.js';

const AddCategoryFolder = ({functionAfterAddingAnyFolder, callApiCabinetCategory, callApiCabinetFolder, manageShowFileType, refrencePage, actionType, selectFolderInfo, setShowAddEditFolder, uniqueref, dispatchloader }) => {

    let primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
    let loggedInUserId = sessionStorage.getItem('loggedUserId')
    const { allMainCabinetContainer, cabinetList, setManageShowFileType, paralegalList, userProfessionalList, permissionsFolder } = useContext(FileCabinetContext)
    const { setdata } = useContext(globalContext)
    const subtenantId = sessionStorage.getItem("SubtenantId");
    const stateObj = $AHelper.getObjFromStorage("stateObj");
    const [manageUpdate, setManageUpdate] = useState({ updatedBy: loggedInUserId, updatedOn: new Date().toISOString() })
    const [manageCreate, setManageCreate] = useState({ createdBy: loggedInUserId, createdOn: new Date().toISOString() })
    const [categoryTypeList, setCatetoryTypeList] = useState([])
    const [cabinetId, setCabinetId] = useState('')
    const [fileCategoryId, setfileCategoryId] = useState('')
    const [name, setName] = useState('')
    const [subFolderName, setSubFolderName] = useState('')
    const [description, setDescription] = useState('')
    const [skipForNow, setSkipForNow] = useState(true)
    const [jsonForFolderPermission, setJsonForFolderPermission] = useState([])
    const [sharedFoldereMemberList, setSharedFoldereMemberList] = useState([
        // { name: "All", value: true },
        { name: "Legal Team", value: true },
        // { name: "Beneficiary / Fiduciary", value: false },
      ]);
      const [searchedContact, setSearchedContact] = useState('')

    konsole.log('jsonForFolderPermission', jsonForFolderPermission)
    konsole.log('categoryTypeListcategoryTypeList', categoryTypeList)
    konsole.log('permissionsFolderpermissionsFolderaaaa', permissionsFolder)
    konsole.log('paralegalListparalegalList', paralegalList)

    useEffect(() => {
        konsole.log('setCabinetIdsetCabinetId', cabinetList)
        setCabinetId(cabinetList[0].cabinetId)
        haldleCabinetInfo(cabinetList[0].cabinetId)
    }, [cabinetList])
  

    useEffect(() => {
        customFunforuseEffect()
    }, [actionType, refrencePage, selectFolderInfo])

    useEffect(() => {
        if (refrencePage == 'FolderStructure' && manageShowFileType !== 'Category' && actionType == 'Edit') {
            let filterFolderPermissions = permissionsFolder?.length > 0 && permissionsFolder?.filter(({ folderId }) => folderId == selectFolderInfo?.folderId)
            setJsonForFolderPermission(filterFolderPermissions)
            konsole.log('filterFolderPermissionsfilterFolderPermissions', filterFolderPermissions)
        } else if (actionType == 'Add' && paralegalAttoryId.includes(stateObj.roleId)) {

            let permissionArray = []
            for (let i = 0; i < paralegalList.length; i++) {
                let newObj = cretaeJsonForFolderPermission({ ...manageCreate, editFolder: true, deleteFolder: true, readFolder: true, createSubFolder: true, editSubFolder: true, deleteSubFolder: true, fileUpload: true, subtenantId, sharedRoleId: paralegalList[i]?.roleId, sharedUserId: paralegalList[i]?.userId, primaryUserId: primaryMemberUserId, isActive: true })
                permissionArray.push(newObj)
            }
            konsole.log('permissionArraypermissionArray',permissionArray)
            // let newObj = cretaeJsonForFolderPermission({ ...manageCreate, editFolder: true, deleteFolder: true, readFolder: true, createSubFolder: true, editSubFolder: true, deleteSubFolder: true, fileUpload: true, subtenantId, sharedRoleId: stateObj.roleId, sharedUserId: loggedInUserId, primaryUserId: primaryMemberUserId, isActive: true })
            // setJsonForFolderPermission([{ ...newObj }]);
            setJsonForFolderPermission(permissionArray)
        } else {
            setJsonForFolderPermission([])
        }
    }, [selectFolderInfo, refrencePage, permissionsFolder, actionType])

    useEffect(() => {
        if (actionType == 'Add') {
            // let newObj = cretaeJsonForFolderPermission({ ...manageCreate, [id]: checked, subtenantId, sharedRoleId, sharedUserId, primaryUserId: primaryMemberUserId, isActive: true })

        }
    }, [actionType])
    // useEffect functions------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const customFunforuseEffect = () => {
        // konsole.log("fwefefefef",refrencePage,"---------",manageShowFileType,"---------",selectFolderInfo)
        if (refrencePage == 'FolderStructure' && manageShowFileType !== 'Category') {
            konsole.log('selectFolderInfo', selectFolderInfo)
            let { folderCabinetId, folderFileCategoryId, folderName, folderDescription } = selectFolderInfo
            customFunfor(folderCabinetId, folderName, folderDescription, folderFileCategoryId, 'Folder')
        } else if (refrencePage == 'FolderStructure' && manageShowFileType == 'Category') {
            let { categoryCabinetId, fileCategoryType } = selectFolderInfo
            konsole.log('selectFolderInfoselectFolderInfoselectFolderInfo', selectFolderInfo)
            customFunfor(categoryCabinetId, fileCategoryType, '', '', 'Category')
        } else if (selectFolderInfo !== undefined) {
            let { categoryCabinetId, fileCategoryId } = selectFolderInfo
            customFunfor(categoryCabinetId, '', '', fileCategoryId, 'Category')

        }
    }


    const customFunfor = (cabinetId, name, description, categoryId) => {
        // konsole.log("customFunforscriptiondescription",description,actionType)
        const filterCategoryList = cabinetList?.filter(item => item.cabinetId == cabinetId)
        const categoryList = filterCategoryList?.length > 0 ? filterCategoryList[0].fileCategoryTypeMappingList : [];
        setName(name)
        if (actionType == 'Edit') {
            setDescription(description)
        }
        setCatetoryTypeList(categoryList);
        setCabinetId(cabinetId)
        setfileCategoryId(categoryId)

    }
    // useEffect functions------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //  handle cabinet----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const handleSelectCabinet = (e) => {
        const { value, id } = e?.target
        haldleCabinetInfo(value)
    }

    const haldleCabinetInfo = (value) => {
        konsole.log('haldleCabinetInfohaldleCabinetInfo', value)
        setCabinetId(value)
        const filterCategoryList = cabinetList?.filter(item => item?.cabinetId == value)
        const categoryList = filterCategoryList?.length > 0 ? filterCategoryList[0].fileCategoryTypeMappingList : [];
        setCatetoryTypeList(categoryList);
    }

    //  validate function-----------------------------------------------------------------------------------------------------------------------------------------------------------------
    const validateFun = (type) => {
        // konsole.log("typetype",type,name,subFolderName,refrencePage,actionType)
        let errMessage;
        if (cabinetId == '') {
            errMessage = 'Please select cabinet.'
        } else if (type == 'Folder' && fileCategoryId == '') {
            errMessage = "Please select Drawer"
        } else if (name == '') {
            errMessage = `${type} name can't be blank`
        }
        else if ((subFolderName == '' || subFolderName == undefined || subFolderName == null)  && refrencePage !== 'ManageAllFile' && actionType == 'Add' ) {
            errMessage = `Sub${type} name can't be blank`
        }
        if (errMessage) {
            toasterAlert(errMessage)
            return true
        }
        return false

    }
    // save category----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const callCategoryFun = () => {
        let fileCategoryId = 0;
        let categoryMappingId = 0;
        let manageDateTime = manageCreate
        if (actionType == 'Edit') {
            fileCategoryId = selectFolderInfo?.fileCategoryId
            categoryMappingId = selectFolderInfo.categoryMappingId
            manageDateTime = manageUpdate
        }
        return;
        let postJson = createCategoryObjJson({ ...manageDateTime, fileCategoryId, categoryCabinetId: cabinetId, categoryMappingId, roleId: stateObj.roleId, subtenantId, fileCategoryType: name, description, operation: operationForCategoryType[0] })
        konsole.log('postJson', postJson)
        callApiCabinetCategory([postJson], actionType)

    }
    konsole.log('selectFolderInfoselectFolderInfo', selectFolderInfo)
    // save folder --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const callFolderCabinet = () => {
        if (validateFun('Folder')) return;
        let roleId = stateObj.roleId;
        let belongsTo = primaryMemberUserId
        let fileCategoryIdassign = fileCategoryId
        let parentFolderId = 0
        let folderId = 0
        let displayOrder = 1
        let level = 1
        let folderName = name
        let folderCreatedBy=loggedInUserId
        let folderUpdatedBy=loggedInUserId
        let sharedRoleId=stateObj.roleId
        // konsole.log("refrencePage == 'FolderStructure' && actionType == 'Edit'",refrencePage == 'FolderStructure' && actionType == 'Edit')
        if (refrencePage == 'FolderStructure' && actionType == 'Add') {
            folderName = subFolderName
            level = selectFolderInfo.level + 1
            displayOrder = selectFolderInfo.displayOrder + 1
            parentFolderId = selectFolderInfo.folderId
            fileCategoryIdassign = selectFolderInfo.folderFileCategoryId
        } else if (refrencePage == 'FolderStructure' && actionType == 'Edit') {
            folderName = name
            level = selectFolderInfo?.level
            displayOrder = selectFolderInfo?.displayOrder
            folderId = selectFolderInfo?.folderId
            fileCategoryIdassign = selectFolderInfo?.folderFileCategoryId
            parentFolderId = selectFolderInfo?.parentFolderId
            folderCreatedBy=selectFolderInfo?.folderCreatedBy
            roleId=selectFolderInfo?.folderRoleId
            sharedRoleId=Number(selectFolderInfo?.folderCreatedByRoleId)
        }
        konsole.log('folderUpdatedByz',selectFolderInfo,selectFolderInfo,folderUpdatedBy)

        let postJson = createFolderObjJson({createdBy:folderCreatedBy,updatedBy:folderUpdatedBy, folderRoleId: roleId, sharedRoleId: sharedRoleId, folderSubtenantId: subtenantId, folderCabinetId: cabinetId, folderFileCategoryId: fileCategoryIdassign, folderId, parentFolderId, folderName, folderDescription: description, folderOperation: folderOperationType[0], level, displayOrder, belongsTo, folderIsActive: true })
        konsole.log('postJson', postJson)
        let message = actionType == 'Add' ? 'added' : 'updated'
        // return;
        callApiCabinetFolderfun([postJson], message)
        // konsole.log("callFolderCabinetpostJson",postJson)
        if (uniqueref == 'STRUCTURE') {
            setShowAddEditFolder('')
        }

    }


    function callApiCabinetFolderfun(postJson, msg) {
        konsole.log('postJson', postJson)
        dispatchloader(true)
        Services.upsertCabinetFolder(postJson).then((response) => {
            konsole.log('response of adding updating and deleting folder', response)
            dispatchloader(false)
            let responseData = response?.data?.data[0]
            konsole.log('responseDataresponseData', responseData)

            if (jsonForFolderPermission.length !== 0) {
                callApiUpsertFolderPermissions(responseData?.folderCabinetId, responseData?.folderId, msg)

            } else {
                if (msg) { AlertToaster.success(`Folder ${msg} successfully.`) }
                reloadScreen()
            }
        }).catch((err) => {
            dispatchloader(false)
            konsole.log('err of adding updating and deleting folder ', err, err?.response)
        })
    }

    const callApiUpsertFolderPermissions = (folderCabinetId, folderId, msg) => {
        konsole.log('folderCabinetIdfolderCabinetId')
        let newArr = jsonForFolderPermission?.map((obj) => ({ ...obj, 'cabinetId': folderCabinetId, 'folderId': folderId,updatedBy:(obj?.fPermissionId !=0)?loggedInUserId:obj?.updatedBy,createdBy:(obj?.fPermissionId ==0)?loggedInUserId:obj?.createdBy }));
        let myNewArray = newArr?.filter((item) => item?.fPermissionId !== 0 || item?.readFolder === true || item?.editFolder == true || item?.deleteFolder === true || item?.fileUpload=== true || item?.createSubFolder === true || item?.deleteSubFolder === true);
        let myThreeArray = [...myNewArray]
        for (let [index, item] of myThreeArray?.entries()) {
            if (item?.fPermissionId != 0 && item?.readFolder == false && item?.editFolder == false && item?.deleteFolder == false && item?.fileUpload == false && item?.createSubFolder == false && item?.deleteSubFolder == false) {
                myThreeArray[index].isActive = false
            }
        }

        konsole.log('myNewArraymyNewArray', myThreeArray)
        // return;
        dispatchloader(true)
        Services.upsertCabinetFolderPermissions(newArr).then((res) => {
            dispatchloader(false)
            konsole.log('res of folder permissions', res)
            if (msg) { AlertToaster.success(`Folder ${msg} successfully.`) }
            reloadScreen()
        }).catch((err) => {
            dispatchloader(false)
            konsole.log(' err in folder permissions', err)
        })
    }

    konsole.log('jsonForFolderPermissionjsonForFolderPermission', jsonForFolderPermission)
    const reloadScreen = () => {
        // window.location.reload()
        functionAfterAddingAnyFolder()
    }
    const functionCancelSave = () => {
         if (uniqueref == 'STRUCTURE') {
            setShowAddEditFolder('')
        } else {
            setManageShowFileType('')
        }
    }

    const skipBtnFun = () => {
        setSkipForNow(!skipForNow)
        // setJsonObjForShareStatus([])
    }
    konsole.log('jsonForFolderPermissionjsonForFolderPermission', jsonForFolderPermission)
    konsole.log('selectFolderInfoselectFolderInfoselectFolderInfo', selectFolderInfo)

    const mappingCheckBoxValue = (e, sharedUserId, sharedRoleId) => {
        let { id, checked } = e?.target
        konsole.log('actionTypeactionTypeAZ', actionType)
        if (uniqueref !== 'FILE') {
            let { parentFolderId, folderId } = selectFolderInfo
            let checkFolderId = (actionType == 'Add') ? folderId : selectFolderInfo?.parentFolderId
            konsole.log('parentFolderIdparentFolderId', parentFolderId, selectFolderInfo)
            if (checkFolderId !== undefined && checkFolderId != 0) {
                konsole.log('parentFolderId', checkFolderId)
                let filterFolder = permissionsFolder?.length > 0 ? permissionsFolder?.some((item) => item?.folderId == checkFolderId && item?.sharedUserId == sharedUserId) : false
                if (filterFolder == false) {
                    toasterAlert('You can not give access to subfolder without giving access to parent folder. Please edit the access for parent folder.')
                    return;
                }

            }
        }


        konsole.log('mappingCheckBoxValuemappingCheckBoxValue', e.target.checked, e.target.id)
        let findIndexExistsValue = jsonForFolderPermission?.length > 0 ? jsonForFolderPermission?.findIndex((item) => item?.sharedUserId == sharedUserId) : '-1'
        if (findIndexExistsValue != '-1') {
            let { readFolder, fileUpload, editFolder, deleteFolder, createSubFolder } = jsonForFolderPermission[findIndexExistsValue]
            konsole.log('jsonForFolderPermission[findIndexExistsValue]', jsonForFolderPermission[findIndexExistsValue])
            if (id == 'readFolder' && readFolder == true && (editFolder == true || deleteFolder == true || fileUpload == true || createSubFolder == true) && checked == false) {
                toasterAlert('Please uncheck Edit/Delete/File-Upload/Create-SubFolder first.')
                return;

            }
        }
        konsole.log('checkExistsValuecheckExistsValue', findIndexExistsValue, findIndexExistsValue > 0)
        if (findIndexExistsValue == '-1') {
            let newObj = cretaeJsonForFolderPermission({ ...manageCreate, [id]: checked, subtenantId, sharedRoleId, sharedUserId, primaryUserId: primaryMemberUserId, isActive: true })
            konsole.log('newObjnewObj', newObj)
            if (id == 'editFolder' || id == 'deleteFolder' || id == 'fileUpload' || id == 'createSubFolder') {
                newObj['readFolder'] = true
            }
            konsole.log('jsonForFolderPermissionjsonForFolderPermission', jsonForFolderPermission)
            if (jsonForFolderPermission !== false) {
                setJsonForFolderPermission(prevState => [...prevState, newObj]);
            } else {
                setJsonForFolderPermission([{ ...newObj }]);
            }
        } else {
            setJsonForFolderPermission((prev) => {
                let newArray = [...prev]
                newArray[findIndexExistsValue][id] = checked
                newArray[findIndexExistsValue]['readFolder'] = newArray?.filter((item) => item?.sharedUserId == sharedUserId)?.some(({ readFolder, editFolder, deleteFolder, fileUpload, createSubFolder }) => readFolder || editFolder || deleteFolder || fileUpload || createSubFolder)
                return newArray
            });
        }


    }

    const toggleSwitchForContacts=(e,sharedUserId,sharedRoleId)=>{
        const toggleStatus=e?.target?.checked;
        let findIndexExistsValue = jsonForFolderPermission?.length > 0 ? jsonForFolderPermission?.findIndex((item) => item?.sharedUserId == sharedUserId) : '-1'
        if (uniqueref !== 'FILE') {
            let { parentFolderId, folderId } = selectFolderInfo
            let checkFolderId = (actionType == 'Add') ? folderId : selectFolderInfo?.parentFolderId
            // konsole.log('parentFolderIdparentFolderId', parentFolderId, selectFolderInfo)
            if (checkFolderId !== undefined && checkFolderId != 0) {
                // konsole.log('parentFolderId', checkFolderId)
                let filterFolder = permissionsFolder?.length > 0 ? permissionsFolder?.some((item) => item?.folderId == checkFolderId && item?.sharedUserId == sharedUserId) : false
                if (filterFolder == false) {
                    toasterAlert('You can not give access to subfolder without giving access to parent folder. Please edit the access for parent folder.')
                    return;
                }

            }
        }

        if (findIndexExistsValue == '-1') {
            let newObj = cretaeJsonForFolderPermission({ ...manageCreate,
                ['readFolder'] : toggleStatus,
                ['editFolder'] : toggleStatus,
                ['deleteFolder'] : toggleStatus,
                ['fileUpload'] : toggleStatus,
                ['createSubFolder'] : toggleStatus,
                 subtenantId, sharedRoleId, sharedUserId, primaryUserId: primaryMemberUserId, isActive: true })
            if (jsonForFolderPermission !== false) {
                setJsonForFolderPermission(prevState => [...prevState, newObj]);
            } else {
                setJsonForFolderPermission([{ ...newObj }]);
            }
        } else {
            setJsonForFolderPermission((prev) => {
                let newArray = [...prev]
                 newArray[findIndexExistsValue] ['readFolder'] = toggleStatus
                 newArray[findIndexExistsValue] ['editFolder'] = toggleStatus
                 newArray[findIndexExistsValue] ['deleteFolder'] = toggleStatus
                 newArray[findIndexExistsValue] ['fileUpload'] = toggleStatus
                 newArray[findIndexExistsValue] ['createSubFolder'] = toggleStatus
                return newArray
            });
        }
    }

    const checkChecked = (type, userId) => {
        return jsonForFolderPermission?.length > 0 ? jsonForFolderPermission?.some((item) => item?.sharedUserId == userId && item[type] == true) : false
    }

    const checkToggleButton=(userId)=>{
        // console.log("typeuserIduserId"----",userId)
        return jsonForFolderPermission?.length > 0 && jsonForFolderPermission?.some((item) => item?.sharedUserId == userId && (item?.readFolder == true  || item?.editFolder == true || item?.deleteFolder == true || item?.fileUpload == true || item?.createSubFolder == true)) 
    }

    const selectChackBoxForFolder = (id, userId, roleId) => {
        return (<td><Form.Group className="ms-2 d-flex justify-content-center checkbox-group">
            <Form.Check className=" custom-checkbox" type="checkbox" name={id} id={id} checked={checkChecked(id, userId)} onChange={(e) => mappingCheckBoxValue(e, userId, roleId)} />
        </Form.Group>
        </td>)
    }

    const selectChackBoxForFolder2 = (id, userId, roleId,label) => {
        return (<Form.Group className="ms-2 d-flex justify-content-center checkbox-group">
            <Form.Check 
            className="contactCheckox" 
            type="checkbox"
            name={id} 
            id={id} 
            checked={checkChecked(id, userId)} 
            // label={`${label}`}
            onChange={(e) => mappingCheckBoxValue(e, userId, roleId)} />
            <lablel className={`${(checkChecked(id, userId)==true?"contactCheckboxlabelSelected":"contactCheckboxlabelNotSelected")}`} >{`${label}`} </lablel>
        </Form.Group>
        )
    }
   
    const mappingRetrurnPermissionCheckBox = (fullName, userId, roleId) => {
        return (<>
            <tr className=''>
                <td className='ms-3'>{fullName}</td>
                {selectChackBoxForFolder('readFolder', userId, roleId)}
                {selectChackBoxForFolder('editFolder', userId, roleId)}
                {selectChackBoxForFolder('deleteFolder', userId, roleId)}
                {selectChackBoxForFolder('fileUpload', userId, roleId)}
                {selectChackBoxForFolder('createSubFolder', userId, roleId)}
            </tr>
        </>)
    }

    const functionToAddBorderAndColorOnClickingAnyRadio=(userId)=>
    {
            const checkIfFolderPermissionIsSelected=jsonForFolderPermission?.length > 0 && jsonForFolderPermission?.some((item) => item?.sharedUserId== userId && (item['readFolder']== true || item['editFolder']== true || item['deleteFolder'] || item ['fileUpload']== true || item['createSubFolder'] ))
            return checkIfFolderPermissionIsSelected
    }

    const mappingRetrurnPermissionCheckBox2 = (itemName, userId, roleId,itemEmail) => {
        return (<>
            <div className= {`contactsOuterBorder mb-4 mt-4 ${functionToAddBorderAndColorOnClickingAnyRadio(userId)== true?"contactCardColorChange":""}`}>
                <div className={`row  pt-3 pb-3  ${functionToAddBorderAndColorOnClickingAnyRadio(userId)== true? "lightMangentaBorderBottom"  : " greyBorderBottom"} `}>
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
                                        <span className=''>{itemEmail}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-1 mt-2'>
                        <div class="form-check form-switch contactSwitch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{width:" 39px"}}
                              checked={checkToggleButton(userId)}
                              onChange={(e)=>toggleSwitchForContacts(e,userId,roleId)} 
                            />
                        </div>
                        </div>
                </div>
                <div className='row justify-content-around mt-3' style={{padding:"0px 0px"}}>
                    <div className='col-2 p-0 d-flex'>
                        {selectChackBoxForFolder2('readFolder', userId, roleId,"Read")}
                    </div>
                    <div className='col-2 p-0 d-flex '>
                        {selectChackBoxForFolder2('editFolder', userId, roleId,"Edit")}
                    </div>
                    <div className='col-2 p-0 d-flex '>
                        {selectChackBoxForFolder2('deleteFolder', userId, roleId,"Delete")}
                    </div>
                    <div className='col-2 p-0 d-flex '>
                        {selectChackBoxForFolder2('fileUpload', userId, roleId,"Doc Upload")}
                    </div>
                    <div className='col-3 p-0 '>
                        {selectChackBoxForFolder2('createSubFolder', userId, roleId,"Create Sub Folder")}
                    </div>                                  
                </div>
            </div>
        </>)
    }

    //  warining toaster-------------------------------------------------------------------------------------------------------------------------------------
    function toasterAlert(text) {
        setdata({ open: true, text: text, type: "Warning" });
    }

    function seachContacts(e)
    {
        // konsole.log("eeeeecemyAllFoldermyAllFolder",e?.target?.value)  
        setSearchedContact(e?.target?.value)
    }

    konsole.log('actionTypeactionTypeactionType', refrencePage, actionType)
    konsole.log('description', description)
    konsole.log('selectFolderInfo', selectFolderInfo)
    konsole.log('actionTypeactionType', actionType)
    konsole.log('refrencePage', refrencePage)
    konsole.log('manageShowFileTypemanageShowFileType', manageShowFileType)
    konsole.log('userProfessionalListuserProfessionalList', userProfessionalList, paralegalList)
    konsole.log('fileCategoryIdfileCategoryId',fileCategoryId)

    return (
        <>
        <div className='fileFolderModalBody'>
            <Row className='justify-content-center '>
                {paralegalAttoryId.includes(stateObj.roleId) &&
                    <Col lg='2'></Col>}
                    <div className='p-3 pt-0 row ' style={{marginTop:"22px"}}>
                                    <div className="col-6 ">
                                        <p className="mb-3 drawerPara">Drawer</p>
                                        <div className=" position-relative ProductNameMainSelectDivDisabled">
                                            <img src="./icons/colletionIcon.svg"  alt="x" className="subscriptioModelboxStyleImage"></img>
                                            <div className="">
                                                    <Form.Select  className="selectForProductName" id='cabinetId'  onChange={handleSelectCabinet}  value={fileCategoryId}  disabled={uniqueref == 'STRUCTURE'}  >
                                                        <option disabled>Select any Drawer</option>
                                                        {categoryTypeList?.map(category => (
                                                        <option key={category?.fileCategoryId} value={category?.fileCategoryId}>
                                                            {category?.fileCategoryType}
                                                        </option>
                                                        ))}
                                                    </Form.Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 ">
                                    <p className="mb-3 drawerPara">Folder</p>
                                        <div  className={`${(refrencePage == 'FolderStructure' && actionType !== 'Edit') || (refrencePage == 'FolderStructure' && actionType == 'Edit' && notEditableFolderForCabinet?.some((folder) => folder === name)) ? "rateCardDivOutlinesDisabled" : "rateCardDivOutlines"}`} >
                                            <span className="spanRateCardname" >Aa</span>
                                            <div className="rateCardNameInputMainDiv " >
                                                <input type="text" className='border-0' placeholder="Enter Folder Name" disabled={(refrencePage == 'FolderStructure' && actionType !== 'Edit') || (refrencePage == 'FolderStructure' && actionType == 'Edit' && notEditableFolderForCabinet?.some((folder) => folder === name))} value={name} onChange={(e) => setName($AHelper.capitalizeFirstLetter(e.target.value))}  />
                                            </div>
                                        </div>
                                    </div>

                                    {(refrencePage !== 'ManageAllFile' && actionType == 'Add') && 
                                    <div className="col-6  mt-3">
                                    <p className="mb-3 drawerPara">Sub Folder Name</p>
                                        <div className="rateCardDivOutlines bg-transparent">
                                            <span className="spanRateCardname" >Aa</span>
                                            <div className="rateCardNameInputMainDiv" >
                                                <input type="text" className='border-0' value={subFolderName} id='subfolderName' onChange={(e) => setSubFolderName($AHelper?.capitalizeFirstLetter(e.target.value))} placeholder='Enter Sub Folder Name' />    
                                            </div>
                                        </div>
                                    </div>
                                    }

                                    <div className='col-12 lowerBorderOfDescription'>
                                        <p className="mb-3 drawerPara">Description</p>
                                        <textarea className='addEditFolderTextarea'  id='fileCategoryDescription' value={description} onChange={(e) => setDescription($AHelper?.capitalizeFirstLetter(e.target.value))} placeholder="Type something..." ></textarea>
                                    </div>
                                </div>

                    <div className=' shareFolderWithMainDiv border-0'> 
                         <div className='row '>
                                 {manageShowFileType !== 'Category' &&
                                 <>
                                   {!paralegalAttoryId.includes(stateObj?.roleId) && 
                                   <>
                                        {paralegalList?.filter(item => (paralegalAttoryId?.includes(stateObj?.roleId) ? item?.userId !== loggedInUserId : item))?.length > 0 &&
                                        <>
                                            {(fileCategoryId ==categoryFileCabinet[0]) && <> 
                                                <div className='col-9'>
                                                    <p className='paraToShareFolderWith p-2 mb-3'>Who would you like to share folder with ?</p>
                                                </div>
                                                <div className='col d-flex justify-content-end'>

                                                {(actionType != 'Edit')? 
                                                    <button onClick={() => skipBtnFun()} className='hideButton bg-transparent border-0 p-2 mb-3'>
                                                    {(skipForNow === true)?
                                                        <>
                                                        <img src="/icons/minusMaroon.svg" className='mt-0 ml-3' style={{width:" 18px"}}></img>
                                                        <span className='p-2'>Hide</span>
                                                        </>
                                                        :
                                                        <>
                                                        <img src="/icons/plusMaroon.svg" className=' ml-3' style={{height:" 15px",marginTop:" -3px"}}></img>
                                                        <span className='p-2'>Show</span>
                                                        </>}     
                                                    </button>:<></>}

                                                
                                                </div>
                                                {(skipForNow === true || actionType === 'Edit') && (
                                                    <>
                                                    <div className=''>
                                                    {
                                                        sharedFoldereMemberList.map((item,index)=>{return <>
                                                          <p className={`text-truncate memberRadioDiv  ${item?.value==true?"overallBorderOnRadioAndTextActive text-white ":"overallBorderOnRadioAndText"} `}>
                                                                    <Form.Check inline  className={` ${item?.value==true?"overallBorderOnRadioAndTextActiveVisible overallBorderOnRadioAndTextActiveHidden":"margintopForRadioInFile overallBorderOnRadioAndTextActiveHidden"}` } type="radio" name={item?.name}  id={item?.name}  checked={item?.value}/>
                                                                    <span className='text-truncate d-inline-block'>{item?.name}</span>
                                                            </p>
                                                        </>         
                                                        })
                                                    }
                                                        
                                                    </div>

                                                    <div className='row mb-3' style={{marginTop: "25px",marginLeft: "3px"}}>
                                                        <div className='col-7 '>
                                                            <p className='allContactsPara'>Legal Team ({paralegalList?.length})</p>
                                                        </div>
                                                    <div className='col'>
                                                        <div className='row p-0' style={{margin:" 0px 0px 0px 16px" }}>
                                                            <InputGroup className="mb-3 w-100 p-0" >
                                                                <Form.Control className="familySearchInput" placeholder="Search Legal Team"  onChange={seachContacts}/>
                                                                <InputGroup.Text ><img src="./icons/search-icon.svg" className='mt-0' style={{padding:" 0px 5px",height:"18px"}}></img></InputGroup.Text>
                                                            </InputGroup>
                                                        </div>
                                                    </div>
                                                    </div>

                                                    {/* <div className='overflowAdjustmentsInAddFile'>
                                                        {paralegalList?.length > 0 && <>
                                                            {paralegalList?.filter(item => (paralegalAttoryId?.includes(stateObj?.roleId) ? item.userId !== loggedInUserId : item))
                                                            .filter((item)=>item.fullName.toLowerCase().includes(searchedContact.toLowerCase()))
                                                            .map((item) => {
                                                                console.log("vvitemmmmmmmmmm",item)
                                                                return <>{mappingRetrurnPermissionCheckBox2(item?.fullName, item?.userId,item?.roleId,item?.primaryEmail,item)}</>;
                                                            })}
                                                        </>}
                                                    </div> */}
                                                    <div className='overflowAdjustmentsInAddFile'>
                                                        {paralegalList?.length > 0 && (
                                                            <>
                                                                {paralegalList?.filter(item => (paralegalAttoryId?.includes(stateObj?.roleId) ? item.userId !== loggedInUserId : item))
                                                                .filter((item) => (
                                                                (item?.fullName && item?.fullName.toLowerCase().includes(searchedContact.toLowerCase())) || 
                                                                (item?.userName && item?.userName.toLowerCase().includes(searchedContact.toLowerCase()))
                                                                ))
                                                                .map((item) => {
                                                                    return <>{mappingRetrurnPermissionCheckBox2(item?.fullName, item?.userId,item?.roleId,item?.primaryEmail,item)}</>;
                                                                })}

                                                                {paralegalList?.filter(item => (paralegalAttoryId?.includes(stateObj?.roleId) ? item.userId !== loggedInUserId : item))
                                                                .filter((item) => (
                                                                (item?.fullName && item?.fullName.toLowerCase().includes(searchedContact.toLowerCase())) || 
                                                                (item?.userName && item?.userName.toLowerCase().includes(searchedContact.toLowerCase()))
                                                                )).length === 0 &&
                                                                    <div className='dataNotFound mt-4 mb-4'><q>Data not found in Legal Team</q></div>
                                                                }
                                                            </>
                                                        )}
                                                    </div>
                                                    </>
                                                )}                                   
                                            </>}                                            
                                        </>}                                                                               
                                   </>}
                                    
                                 </>
                                 }                                                 
                         </div>
                    </div>                                 
            </Row>
        </div>
           
         <Row  className="d-flex justify-content-end footerBoxShadow">
             <Col lg="5" >
                 <div className='d-flex justify-content-end '>
                     <button className='fileSaveEditButton' onClick={() => manageShowFileType === 'Category' ? callCategoryFun() : callFolderCabinet()}> {actionType=="Add"?"Save":"Update"}</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddCategoryFolder);