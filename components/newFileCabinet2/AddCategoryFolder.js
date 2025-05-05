import React, { useContext, useEffect, useRef, useState } from 'react'
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
import { useLoader } from '../../component/utils/utils.js';
import {getRandomColor,getUserColor} from "../../component/Custom/CustomComponent"

const AddCategoryFolder = ({functionAfterAddingAnyFolder, callApiCabinetCategory, callApiCabinetFolder, manageShowFileType, refrencePage, actionType, selectFolderInfo, setShowAddEditFolder, uniqueref, dispatchloader }) => {

    let primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
    let loggedInUserId = sessionStorage.getItem('loggedUserId')
    const { allMainCabinetContainer, cabinetList, setManageShowFileType, paralegalList, userProfessionalList, permissionsFolder,allFolderList} = useContext(FileCabinetContext)
    const { setdata } = useContext(globalContext)
    const subtenantId = sessionStorage.getItem("SubtenantId");
    const stateObj = $AHelper.getObjFromStorage("stateObj");
    const [manageUpdate, setManageUpdate] = useState({ updatedBy: loggedInUserId, updatedOn: new Date().toISOString() })
    const [manageCreate, setManageCreate] = useState({ createdBy: loggedInUserId, createdOn: new Date().toISOString() })
    const [categoryTypeList, setCatetoryTypeList] = useState([])
    const [selectedDrawer, setSelectedDrawer] = useState('Select Drawer Type');
    const [selectedFirm, setSelectedFirm] = useState('Select Firm Type');
    const [activeOption, setActiveOption] = useState('first');
    const [cabinetId, setCabinetId] = useState('')
    const [fileCategoryId, setfileCategoryId] = useState('')
    const [selectedFolderId, setSelectedFolderId] = useState(''); 
    const [name, setName] = useState('')
    const [subFolderName, setSubFolderName] = useState('')
    const [filteredParalegalList, setFilteredParalegalList] = useState(paralegalList);
    const [showBelongsToDropdown, setShowBelongsToDropdown] = useState({
        drawer: false,
        selectFirm: false,
    });    
    const drawerRef = useRef(null);
    const firmRef = useRef(null);
    const [description, setDescription] = useState('')
    const [skipForNow, setSkipForNow] = useState(true)
    const [jsonForFolderPermission, setJsonForFolderPermission] = useState([])
    const [sharedFoldereMemberList, setSharedFoldereMemberList] = useState([
        // { name: "All", value: true },
        { name: "Legal Team", value: true },
        // { name: "Beneficiary / Fiduciary", value: false },
      ]);
      const [searchedContact, setSearchedContact] = useState('')
      const[error,setError]=useState(false)
      const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
   
    const tableHeadingForFolder=["Name","Email","Read",(activeOption=='second')?"Doc Upload":"Create Sub Folder"]    
    konsole.log('jsonForFolderPermission', jsonForFolderPermission)
    konsole.log('categoryTypeListcategoryTypeList', categoryTypeList)
    konsole.log('permissionsFolderpermissionsFolderaaaa', permissionsFolder)
    konsole.log('paralegalListparalegalList', paralegalList)
    konsole.log('selectFolderInfo', selectFolderInfo)
    // console.log("selectedFirmselectedFirm",selectedFirm)
    // console.log("selectedFolderId",selectedFolderId)

    useEffect(() => {
        konsole.log('setCabinetIdsetCabinetId', cabinetList)
        setCabinetId(cabinetList[0].cabinetId)
        haldleCabinetInfo(cabinetList[0].cabinetId)
    }, [cabinetList])
  

    useEffect(() => {
        customFunforuseEffect()
    }, [actionType, refrencePage, selectFolderInfo])
    
    useEffect(()=>{
        if(paralegalAttoryId.includes(stateObj.roleId) && actionType == 'Add' ){
            // handleToggle('second');
            setActiveOption("second");
        }
    },[stateObj,actionType])

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
        // konsole.log("customFunforscriptiondescription",cabinetId, name, description, categoryId)
        const filterCategoryList = cabinetList?.filter(item => item.cabinetId == cabinetId)
        const categoryList = filterCategoryList?.length > 0 ? filterCategoryList[0].fileCategoryTypeMappingList : [];
        const selectedDrawerLabel=categoryList?.filter((item)=>{return item?.fileCategoryId==categoryId})
        // console.log("selectedDrawerLabel",selectedDrawerLabel,categoryList,cabinetId,selectedDrawerLabel[0]?.fileCategoryType)
        setName(name)
        setCatetoryTypeList(categoryList);
        setCabinetId(cabinetId)
        setfileCategoryId(categoryId)    
        if(actionType == 'Edit')
            {
                setSelectedDrawer(selectedDrawerLabel[0]?.fileCategoryType)
                setDescription(description)            
                if(selectFolderInfo?.parentFolderId==0)
                    {                     
                        setActiveOption("first")                          
                    }else{
                        setActiveOption("second")
                        const getParentFolderNameForSubFolderEdit=allFolderList?.find((item)=>{return item.folderId==selectFolderInfo?.parentFolderId })
                        setSelectedFirm(getParentFolderNameForSubFolderEdit?.folderName);
                        // console.log("getParentFolderNameForSubFolderEdit",getParentFolderNameForSubFolderEdit)
                    }
            }
        // console.log("allFolderListdsdsdsds",allFolderList,selectFolderInfo?.parentFolderId)


    }
  

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
        } else if (type == 'Folder' && (fileCategoryId == '') ) {
            errMessage = "Please select Drawer"
        } else if (name.trim() == '') {
            errMessage = `${type} name can't be blank`
        }
        else if ((subFolderName == '' || subFolderName == undefined || subFolderName == null)  && refrencePage !== 'ManageAllFile' && actionType == 'Add' ) {
            errMessage = `Sub${type} name can't be blank`
        }
        else if (type == 'Folder' && selectedFirm=="Select Firm Type" && activeOption=="second") {
            errMessage = "Please select firm name"
        }
        else if(error==true){
             errMessage = "A Folder with Similar name already exists"
        }
        if (errMessage) {
            toasterAlert("warning", errMessage)
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
        let parentFolderId = selectedFolderId
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
        dispatchloaderFun(true)
        Services.upsertCabinetFolder(postJson).then((response) => {
            konsole.log('response of adding updating and deleting folder', response)
            dispatchloaderFun(false)
            let responseData = response?.data?.data[0]
            konsole.log('responseDataresponseData', responseData)

            if (jsonForFolderPermission.length !== 0) {
                callApiUpsertFolderPermissions(responseData?.folderCabinetId, responseData?.folderId, msg)

            } else {
                if (msg) {setWarning("successfully", `Folder ${msg} successfully.`,``); }
                reloadScreen()
            }
        }).catch((err) => {
            dispatchloaderFun(false)
            konsole.log('err of adding updating and deleting folder ', err, err?.response)
        })
    }


    const dispatchloaderFun=(val)=>{
        dispatchloader(val)
        useLoader(val)
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
        const isActiveOptionSecond=(activeOption=="second")
        const updateNewArrForOldFileFolderTogglePrmission=newArr?.map((data)=>{
            return {...data,...(activeOption == "second" ? { 'createSubFolder': false } : { 'fileUpload': false }),'deleteFolder':false,'editFolder':false};
        })
        // console.log("updateNewArrForOldFileFolderTogglePrmission",updateNewArrForOldFileFolderTogglePrmission)
        dispatchloaderFun(true)
        Services.upsertCabinetFolderPermissions(updateNewArrForOldFileFolderTogglePrmission).then((res) => {
            dispatchloaderFun(false)
            konsole.log('res of folder permissions', res)
            if (msg) {   setWarning("successfully", `Folder ${msg} successfully.`,``);
}
            reloadScreen()
        }).catch((err) => {
            dispatchloaderFun(false)
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

    const handleInputChange = (value) => {
        if ((value === 'yes' && !skipForNow) || (value === 'no' && skipForNow)) {
            if (paralegalAttoryId?.includes(stateObj?.roleId)) {
                const filtered = jsonForFolderPermission?.filter(item => paralegalAttoryId?.includes(item?.roleId?.toString()));
                setJsonForFolderPermission(filtered)
            } else {
                setJsonForFolderPermission([])
            }
            setSearchedContact("")
            setSkipForNow(!skipForNow)
        }
    };

    const handleToggle = (option) => {
        setActiveOption(option);
        setName("")
        setError(false)
    };

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
                    toasterAlert("warning",'You can not give access to subfolder without giving access to parent folder. Please edit the access for parent folder.')
                   return;
                }

            }
        }


        konsole.log('mappingCheckBoxValuemappingCheckBoxValue', e.target.checked, e.target.id)
        let findIndexExistsValue = jsonForFolderPermission?.length > 0 ? jsonForFolderPermission?.findIndex((item) => item?.sharedUserId == sharedUserId) : '-1'
        if (findIndexExistsValue != '-1') {
            let { readFolder, fileUpload, editFolder, deleteFolder, createSubFolder } = jsonForFolderPermission[findIndexExistsValue]
            konsole.log('jsonForFolderPermission[findIndexExistsValue]', jsonForFolderPermission[findIndexExistsValue])
            // if (id == 'readFolder' && readFolder == true && (editFolder == true || deleteFolder == true || fileUpload == true || createSubFolder == true) && checked == false) {
                if (id == 'readFolder' && readFolder == true && (fileUpload == true || createSubFolder == true) && checked == false) {
                // toasterAlert("warning",'Please uncheck Edit/Delete/File-Upload/Create-SubFolder first.')
                toasterAlert("warning",'Please uncheck File-Upload/Create-SubFolder first.')
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
                    toasterAlert("warning",'You can not give access to subfolder without giving access to parent folder. Please edit the access for parent folder.')
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

    const selectChackBoxForFolder2 = (id, userId, roleId,label,key) => {
        return (<Form.Group className="ms-2 d-flex justify-content-center checkbox-group"   >
            <Form.Check 
            className="contactCheckox" 
            type="checkbox"
            name={id} 
            id={id} 
            checked={checkChecked(id, userId)} 
            // label={`${label}`}
            onChange={(e) => mappingCheckBoxValue(e, userId, roleId)} />
            {/* <lablel className={`${(checkChecked(id, userId)==true?"contactCheckboxlabelSelected":"contactCheckboxlabelNotSelected")}`} >{`${label}`} </lablel> */}
        </Form.Group>
        )
    }
   
    const mappingRetrurnPermissionCheckBox = (fullName, userId, roleId) => {
        return (<>
            <tr className=''>
                <td className='ms-3'>{fullName}</td>
                {selectChackBoxForFolder('readFolder', userId, roleId)}
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

    const paralegalListCount = paralegalList?.filter(item => (paralegalAttoryId?.includes(stateObj?.roleId) ? item.userId !== loggedInUserId : item))
    .filter((item) => (
    (item?.fullName && item?.fullName.toLowerCase().includes(searchedContact.toLowerCase())) || 
    (item?.userName && item?.userName.toLowerCase().includes(searchedContact.toLowerCase()))
    ))

    const mappingRetrurnPermissionCheckBox2 = (itemName, userId, roleId,itemEmail,key) => {
        return (<>
            <div id='contactsOuterBorderNewFileCabinet' className={`contactsOuterBorderNewFileCabinet w-100 ${functionToAddBorderAndColorOnClickingAnyRadio(userId)== true?"":""}`}>
            <tr className="tabelDataRow w-100 tabelDataRowFolder">
                         <td >
                             <div className="d-flex align-items-center ">
                                     <div className="dummyImgFolder" style={{ backgroundColor: getUserColor(itemName),margin:"0px 10px" }}>
                                         <p className="ps-0">
                                             {`${itemName?.[0] ?? ''}`}
                                         </p>
                                     </div>
                                     <span className="DocumentNameTable">{itemName}</span>
                             </div>
                         </td>
                         <td className="width16">
                             <p className="text-center wordBreak">{itemEmail ?? "-"}</p>
                         </td>
                         <td className="width16">
                            {selectChackBoxForFolder2('readFolder', userId, roleId,"Read",key)}
                         </td>
                         { activeOption === 'second' &&  
                         <td className="width16">
                         {selectChackBoxForFolder2('fileUpload', userId, roleId,"Doc Upload",key)}
                         </td>
                         }
                        {activeOption === 'first' &&  
                         <td className="width16">
                         {selectChackBoxForFolder2('createSubFolder', userId, roleId,"Create Sub Folder",key)}
                         </td>
                        }                
                     </tr>
            </div>
        </>)
    }

    //  warining toaster-------------------------------------------------------------------------------------------------------------------------------------
    // function toasterAlert(text) {
    //     setdata({ open: true, text: text, type: "Warning" });
    // }

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    
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

    const filteredFolders = selectFolderInfo?.folder?.filter((item)=>item?.folderCreatedByRoleId !=4 && item?.folderCreatedByRoleId !==11);
    
    if(paralegalAttoryId.includes(stateObj.roleId)){
        filteredFolders=filteredFolders.filter((item)=>item.createSubFolder==true)
    }
    konsole.log(filteredFolders,"sjdjsdjsd")
    konsole.log(selectFolderInfo?.folder,"sjdjsdjsc")

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
              drawerRef.current && !drawerRef.current.contains(event.target) || 
              firmRef.current && !firmRef.current.contains(event.target)
            ) {
                setShowBelongsToDropdown(prevState => ({
                ...prevState,
                drawer: false,
                selectFirm: false,
              }));
            }
          };
      
          document.addEventListener('mousedown', handleClickOutside);
          return () => {
            document.removeEventListener('mousedown', handleClickOutside);
          };
        }, []);

    const funFolderName=(event)=>{
        const folderNameValue=event?.target?.value
        setName($AHelper.capitalizeFirstLetter(folderNameValue))
        // console.log("dsdsdsdad",allFolderList,folderNameValue);
        if(activeOption === 'first')
        {
            const funFolderNamefindParentFoldersOfLegalCabinet=allFolderList?.filter(({parentFolderId,folderFileCategoryId})=>(parentFolderId==0 && folderFileCategoryId==6))
            // console.log("funFolderNamefindParentFoldersOfLegalCabinet",funFolderNamefindParentFoldersOfLegalCabinet)
            const funFolderNamefindFolderNameInListWithSimilarName=funFolderNamefindParentFoldersOfLegalCabinet?.some(({folderName})=>folderName.trim().toLowerCase()==folderNameValue.trim().toLowerCase())
            // console.log("funFolderNamefindFolderNameInListWithSimilarName",funFolderNamefindFolderNameInListWithSimilarName)
            if(funFolderNamefindFolderNameInListWithSimilarName && selectFolderInfo?.folderName?.trim().toLowerCase()!=folderNameValue.trim().toLowerCase()){
                setError(true)  
            }else{
                setError(false)
            }
        }else{
            const findSimilarNotParentFolder=allFolderList?.find(({folderName,folderFileCategoryId})=>(folderName==selectedFirm && folderFileCategoryId==6))
            // console.log("findSimilarNotParentFolder",findSimilarNotParentFolder?.folderId)
            const findSubFoldersOfSelectedFirm=allFolderList?.filter(({parentFolderId,folderFileCategoryId})=>(parentFolderId==findSimilarNotParentFolder?.folderId && folderFileCategoryId==6))
            // console.log("findSubFoldersOfSelectedFirm",findSubFoldersOfSelectedFirm)
            const findSubFolderNameInListWithSimilarName=findSubFoldersOfSelectedFirm?.some(({folderName})=>folderName.trim().toLowerCase()==folderNameValue.trim().toLowerCase())
            // console.log("findSubFolderNameInListWithSimilarName",findSubFolderNameInListWithSimilarName)   
            if(findSubFolderNameInListWithSimilarName && selectFolderInfo?.folderName?.trim().toLowerCase()!=folderNameValue?.trim().toLowerCase()){
                setError(true)  
            }else{
                setError(false)
            }
        }
    }
    return (
        <>
        <div className='fileFolderModalBody' id='fileFolderModalBodyNewFCabinet'>
            <Row className='justify-content-center '>
                 <div className="col-11 m-0 p-3">
                {paralegalAttoryId.includes(stateObj.roleId) &&
                    <Col lg='2'></Col>}
                    <div className='mt-2 row '>
                        <div className="col-12 p-0 ps-2 pe-2">
                            <div className="col-12 mb-3 p-0">
                                {(actionType != 'Edit') && <div className='main mb-3'>
                                    {!paralegalAttoryId.includes(stateObj.roleId) &&
                                    <div className={activeOption === 'first' ? 'first active' : 'first not-chosen'} onClick={() => handleToggle('first')}>
                                        Create a Firm folder
                                    </div>
                                     }
                                     {(selectFolderInfo?.fileCategoryId==categoryFileCabinet[0]) && 
                                    <div className={activeOption === 'second' ? 'second active' : 'second not-chosen'} onClick={() => {
                                            if (filteredFolders?.length < 1) {
                                                konsole.log(filteredFolders?.length,filteredFolders,"sdjsdjsdsj")
                                                toasterAlert("warning",'Please create a firm folder before creating a folder within a Firm.');
                                            } else {
                                                handleToggle('second');
                                            }
                                        }}>
                                        Create a folder within a Firm
                                    </div>}
                                </div> 
                                }          
                                <div className='dropdown-container p-0'>
                                    <p className="mb-2 drawerPara newdrawerPara">Drawer</p>
                                    <div
                                        className={`row selectBorderHearAboutUs justify-content-between m-0 p-0 ${selectedDrawer !== "Select Drawer Type" && "text-dark-NewFineCabinetmain"}`}
                                        onClick={() => {
                                            if (!selectFolderInfo?.fileCategoryType) {setShowBelongsToDropdown({ drawer: !showBelongsToDropdown?.drawer, selectFirm: false });}
                                        }}
                                        style={{ 
                                            backgroundColor: (selectFolderInfo?.folderFileCategoryId || uniqueref === 'STRUCTURE' ) ? "#F0F0F0" : "initial",
                                            cursor: (selectFolderInfo?.fileCategoryType || uniqueref === 'STRUCTURE') ? "not-allowed" : "pointer"
                                        }}
                                    >
                                        <div className={`col-11 p-0 selectBorderHearAboutUsLeftCol ${selectedDrawer !== "Select Drawer Type" && "text-dark-NewFineCabinet"} ${selectFolderInfo?.fileCategoryType && "text-dark-NewFineCabinet"}`}>
                                        <span>{selectFolderInfo?.fileCategoryType || selectedDrawer}</span>
                                        </div>
                                        <div className='col-1 d-flex justify-content-center selectBorderHearAboutUsRightCol'>
                                            <img src="/icons/dropdownArrowNewFileCabinet.svg" alt="x" className="subscriptioModelboxStyleImage" />
                                        </div>
                                    </div>
                                    {showBelongsToDropdown.drawer && (actionType != 'Edit') &&  (
                                        <div className='dropdown-content' ref={drawerRef}>
                                            <div className='d-flex justify-content-end mt-3'>
                                                <div className='hearAbout2 p-3 pt-2 pb-0'>
                                                    {categoryTypeList?.map(category => (
                                                        <div
                                                            className={`cursor-pointer options ${selectedDrawer !== category?.fileCategoryType ? "labelFontSizeForhearAbotusUnselected" : "labelFontSizeForhearAbotusselected"}`}
                                                            key={category?.fileCategoryId}
                                                            value={category?.fileCategoryId}
                                                            onClick={() => {
                                                                setSelectedDrawer(category?.fileCategoryType);
                                                                setShowBelongsToDropdown({ drawer: false, selectFirm: false });                                                            
                                                            }}
                                                        >
                                                            <h3 className='labelFontSizeForhearAbotusUnselected'>{category?.fileCategoryType}</h3>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {activeOption === 'second' && (
                            <div className="col-12 mb-3 p-0" >
                                <div className='dropdown-container p-0'>
                                        <p className="mb-2 drawerPara newdrawerPara">Select Firm*</p>
                                        <div
                                            className={`row selectBorderHearAboutUs justify-content-between m-0 p-0 ${selectedFirm !== "Select Firm Type" && ""}`}
                                            onClick={() => setShowBelongsToDropdown({ ...showBelongsToDropdown, selectFirm: !showBelongsToDropdown.selectFirm, drawer: false })}
                                            style={{ backgroundColor: (actionType == 'Edit') ? "#F0F0F0" : "",
                                                cursor: (actionType == 'Edit') ? "not-allowed" : "pointer"
                                             }}
                                        >
                                            <div className={`col-11 p-0 selectBorderHearAboutUsLeftCol ${selectedFirm !== "Select Firm Type" && ""}`}>
                                                <span className={`${(actionType != 'Edit' && selectedFirm !== "Select Firm Type") ?"text-dark":""}`}
                                                >{selectedFirm}</span>
                                            </div>
                                            <div className='col-1 d-flex justify-content-center selectBorderHearAboutUsRightCol'>
                                                <img src="/icons/dropdownArrowNewFileCabinet.svg" alt="x" className="subscriptioModelboxStyleImage" />
                                            </div>
                                        </div>
                                        {showBelongsToDropdown.selectFirm && (actionType != 'Edit') && (
                                            <div className='dropdown-content' ref={firmRef}>
                                                <div className='d-flex justify-content-end mt-3'>
                                                    <div className='hearAbout2 p-3 pt-2 pb-0'>
                                                        {filteredFolders?.map(folder =>{
                                                            return (
                                                                <div
                                                                    className='options'
                                                                    key={folder?.folderId}
                                                                    onClick={() => {
                                                                        setSelectedFirm(folder?.folderName);
                                                                        setSelectedFolderId(folder?.folderId); 
                                                                        setShowBelongsToDropdown({ ...showBelongsToDropdown, selectFirm: false });
                                                                        setName("")
                                                                        setError("")
                                                                    }}
                                                                >
                                                                    <h3 className={`cursor-pointer ${selectedFirm !== folder?.folderName ? "labelFontSizeForhearAbotusUnselected" : "labelFontSizeForhearAbotusselected"}`}>
                                                                        {folder?.folderName}
                                                                    </h3>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="col-12 mb-3 p-0">
                                <div className="col-12 mt-3 p-0">
                                    <p className="mb-2 drawerPara newdrawerPara">Name*</p>
                                    <div className={`${(refrencePage == 'FolderStructure' && actionType !== 'Edit') || (refrencePage == 'FolderStructure' && actionType == 'Edit' && notEditableFolderForCabinet?.some((folder) => folder === name)) ? "rateCardDivOutlinesDisabled" : "rateCardDivOutlines"}`} >
                                        <div className="rateCardNameInputMainDivFile" >
                                            <input type="text" 
                                            className='border-0 inputTextnewdrawerPara text-black'  
                                            placeholder="Enter folder name" 
                                            disabled={(refrencePage == 'FolderStructure' && actionType !== 'Edit') || (refrencePage == 'FolderStructure' && actionType == 'Edit' && notEditableFolderForCabinet?.some((folder) => folder === name))} 
                                            value={name} 
                                            onChange={(e) =>funFolderName(e)}
                                            // onChange={(e) => setName($AHelper.capitalizeFirstLetter(e.target.value))}
                                            />                                          
                                        </div>
                                    </div>
                                </div>
                                 <p className='errorParaForFolder'>{error ?<>Folder with similar name already exists</>:<></>}</p>
                            </div> 
                            <div className="col-12 p-0 mt-3">
                                <div className='col-12'>
                                    <p className="mb-2 drawerPara newdrawerPara">Description</p>
                                    <textarea className='addEditFolderTextarea inputTextnewdrawerPara text-black'  id='fileCategoryDescription' value={description} onChange={(e) => setDescription($AHelper?.capitalizeFirstLetter(e.target.value))} placeholder="Enter a description..." ></textarea>
                                </div>
                            </div>
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
                                                <div className='col d-flex justify-content-between align-items-center paddingNonInNewFileCabinet'>
                                                <div className='col-9 paddingNonInNewFileCabinet'>
                                                    <p className='paraToShareFolderWith newdrawerParaText p-2 mb-2'>Would you like to share this folder with someone in the legal team?</p>
                                                </div>
                                                {(actionType == 'Edit') ? <></> :
                                                <div className='hideButtonContainer d-flex'>
                                                    <button onClick={() => handleInputChange('yes')} className='hideButton bg-transparent border-0 p-2 mb-3'>
                                                        <Form.Check inline className="chekspace cursor-pointer"
                                                            type="radio"
                                                            id="yesRadio"
                                                            name="skipOption"
                                                            value="yes"
                                                            checked={skipForNow}
                                                            onChange={(e) => handleInputChange(e.target.value)}
                                                        />
                                                        <label className='newdrawerParaText' htmlFor="yesRadio">Yes</label>
                                                    </button>
                                                    <button onClick={() => handleInputChange('no')} className='hideButton bg-transparent border-0 p-2 mb-3'>
                                                        <Form.Check inline className="chekspace cursor-pointer"
                                                                type="radio"
                                                                id="noRadio"
                                                                name="skipOption"
                                                                value="no"
                                                                checked={!skipForNow}
                                                                onChange={(e) => handleInputChange(e.target.value)}
                                                        />
                                                        <label className='newdrawerParaText' htmlFor="noRadio">No</label>
                                                    </button>
                                                </div>
                                                }

                                                </div>
                                                {(skipForNow === true || actionType == 'Edit' && actionType == 'Add') && (
                                                    <>
                                                    <div className='paddingNonInSomeNewFileCabinet'>
                                                    {
                                                        sharedFoldereMemberList.map((item,index)=>{return <>
                                                          <p className={`text-truncate memberRadioDiv cursor-pointer  ${item?.value==true?"overallBorderOnRadioAndTextActive text-white ":"overallBorderOnRadioAndText"} `}>
                                                                    <Form.Check inline  className={` ${item?.value==true?"overallBorderOnRadioAndTextActiveVisible overallBorderOnRadioAndTextActiveHidden":"margintopForRadioInFile overallBorderOnRadioAndTextActiveHidden"}` } type="radio" name={item?.name}  id={item?.name}  checked={item?.value}/>
                                                                    <span className='text-truncate d-inline-block'>{item?.name}</span>
                                                            </p>
                                                        </>         
                                                        })
                                                    }
                                                        
                                                    </div>

                                                    <div className='d-flex align-items-center mb-1 paddingNonInSomeNewFileCabinet' style={{marginLeft: "3px"}}>
                                                        <div className='col-7 '>
                                                            <p className='allContactsPara'>Legal Team ({paralegalListCount?.length})</p>
                                                        </div>
                                                        <div className='search-bar'>
                                                            <InputGroup className="custom-input-group">
                                                                <InputGroup.Text className="custom-input-group-text">
                                                                    <img src="/icons/FileCabinetSearchIcon.svg" className="search-icon bg-transparent"></img>
                                                                </InputGroup.Text>
                                                                <Form.Control className="custom-search-input" placeholder="Search the legal team" onChange={seachContacts}/>
                                                            </InputGroup>
                                                        </div>
                                                        {/* <div className='d-flex align-items-center p-0'>
                                                            <InputGroup className="w-100 p-0" >
                                                                <InputGroup.Text ><img src="./icons/search-icon.svg" className='mt-0' style={{padding:" 0px 5px",height:"18px"}}></img></InputGroup.Text>
                                                                <Form.Control className="familySearchInput" placeholder="Search Legal Team"  onChange={seachContacts}/>
                                                            </InputGroup>
                                                        </div> */}
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
                                                    <div className='overflowAdjustmentsInAddFile mt-4 mb-5'>
                                                    <table className="familyMemberTableForFile">
                                                        <tr className="firstRowTable tabRowWidth">
                                                            {tableHeadingForFolder.map((values,key)=><th className={`${(key==0?"":"width16")}`}><div className={`d-flex align-items-center ${(key==0?"":" justify-content-center")}`}>{values}</div></th>)}
                                                        </tr>
                                                        {paralegalList?.length > 0 && (
                                                            <>
                                                                {paralegalListCount?.map((item,key) => {
                                                                    return <>{mappingRetrurnPermissionCheckBox2(item?.fullName, item?.userId,item?.roleId,item?.primaryEmail,item,key)}</>;
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
                                                    </table>
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


const mapStateToProps = (state) => ({ ...state.main });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCategoryFolder);