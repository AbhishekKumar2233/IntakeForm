import React, { useEffect, useState, useContext, createContext } from 'react';
import { Row, Col, Breadcrumb } from 'react-bootstrap'
import ManageAllFile from './ManageAllFile';
import { $AHelper } from '../control/AHelper.js';
import { Services } from '../network/Service.js';
import konsole from '../control/Konsole.js';
import { folderOperationType, cabinetFileCabinetId, categoryFileCabinet, cretaeJsonForFolderPermission, createJsonForFolderMapping, createJsonForFolderMapping2, paralegalAttoryId, operationForCategoryType } from '../control/Constant';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from 'react-redux';
import AlertToaster from '../control/AlertToaster';
import { $Service_Url } from '../network/UrlPath.js';
import { $postServiceFn } from '../network/Service.js';
import { Msg } from '../control/Msg';
import Router from 'next/router';
import OccurrenceFileCabinet from './OccurrenceFileCabinet';
import { useLoader } from '../../component/utils/utils.js';
//  cratee context for file cabinet--------------
export const FileCabinetContext = createContext({});

const ParentCabinet = (props) => {

    const subtenantId = sessionStorage?.getItem("SubtenantId");
    const stateObj = $AHelper?.getObjFromStorage("stateObj");
    let primaryMemberUserId = sessionStorage?.getItem('SessPrimaryUserId')
    let loggedUserId = sessionStorage?.getItem('loggedUserId');
    let spouseUserId = sessionStorage?.getItem('spouseUserId');

    // state for global context----------------------------------------------------------------------------------------------------------------------------------------------
    const [allMainCabinetContainer, setAllMainCabinetContainer] = useState([])
    const [cabinetList, setCabinetList] = useState([])
    const [showScreenType, setShowScreenType] = useState('')
    const [categoryList, setCategoryList] = useState([])
    const [allFolderList, setAllFolderList] = useState([])
    const [fileCabinetTypeList, setFileCabinetTypeList] = useState([])
    const [fileInformation, setFileInformation] = useState([])
    const [manageShowFileType, setManageShowFileType] = useState('')

    const [beneficiaryFiduciaryList, setBeneficiaryFiduciaryList] = useState([])
    const [userProfessionalList, setUserProfessionalList] = useState([])
    const [sharedFileShatusList, setSharedFileShatusList] = useState([])
    const [paralegalList, setParalegalList] = useState([])
    const [showAddEditFolder, setShowAddEditFolder] = useState('')
    const [permissionsFolder, setPermissionsFolder] = useState([])
    const [allContainerFolder, setAllContainerFolder] = useState([])
    const [manageCreate, setManageCreate] = useState({ createdBy: stateObj?.userId, createdOn: new Date().toISOString() })
    konsole.log('permissionsFolderpermissionsFolder', permissionsFolder)
    // konsole.log("allContainerFolder",allContainerFolder)


    const globalValue = {
        allMainCabinetContainer: allMainCabinetContainer,
        setAllMainCabinetContainer: setAllMainCabinetContainer,
        showScreenType: showScreenType,
        setShowScreenType: setShowScreenType,
        cabinetList: cabinetList,
        fileInformation: fileInformation,
        allFolderList: allFolderList,
        getFileFromCabinet: getFileFromCabinet,
        setManageShowFileType: setManageShowFileType,
        manageShowFileType: manageShowFileType,
        beneficiaryFiduciaryList: beneficiaryFiduciaryList,
        userProfessionalList: userProfessionalList,
        sharedFileShatusList: sharedFileShatusList,
        paralegalList: paralegalList,
        showAddEditFolder: showAddEditFolder,
        setShowAddEditFolder: setShowAddEditFolder,
        permissionsFolder: permissionsFolder,
        allContainerFolder: allContainerFolder,

    }


    // useEffect ------------------------------------------------------------------------------------
    useEffect(() => {
        let primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
        apiCallGetMainCabinetContainer()
        getFileFromCabinet(primaryMemberUserId)
        apiCallgetBeneficiaryList(primaryMemberUserId)
        apiCallUsertProfessionals(primaryMemberUserId)
        apiCallGetSharedFileStatus(primaryMemberUserId)
        apiCallGetUserListByRoleId(primaryMemberUserId);
    }, [])

    const functionForGetFileAfterAddEditFile = () => {
        let primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
        apiCallGetSharedFileStatus(primaryMemberUserId)
        getFileFromCabinet(primaryMemberUserId)

    }


    //  get Fiduciary and Beneficiary List  & Professional List---------------------------------------------------------------------------------------------------------------------
    const apiCallgetBeneficiaryList = (primaryUserId) => {
        dispatchloaderFun(true)
        Services.getBeneficiaryDetailsListByUserId(primaryUserId).then((res) => {
            konsole.log('res of beneficiary list', res)
            dispatchloaderFun(false)
            const responseData = res?.data?.data?.beneficiaries?.filter((item) => item?.beneficiaryUserId != primaryUserId)?.map(beneficiary => {
                return {
                    value: beneficiary?.beneficiaryUserId,
                    label: beneficiary?.beneficiaryFullName,
                    relationWithUser: beneficiary?.memberRelationshipName,
                    relationWithSpouse: beneficiary?.rltnTypeWithSpouse,
                    emailId: beneficiary?.primaryEmailId
                };
            });
            konsole.log("Beneficiary responseData", responseData)
            let beneficiaryList = $AHelper.deceasedNIncapacititedFilterFun(responseData);
            apiCallgetFiduciaryList(primaryUserId, beneficiaryList)

        }).catch((err) => {
            dispatchloaderFun(false)
            konsole.log('err in getting beneficialry list', err, err?.response)
            if (err?.response?.status == 404) {
                apiCallgetFiduciaryList(primaryUserId, [])
            }
        })
    }

    const fetchMemberRelationship = async (spouseUserIds) => {
        if (!spouseUserIds) return;
        konsole.log("spouseUserIdsPsrentcabinet", spouseUserIds)
        let url = $Service_Url.postMemberRelationship + spouseUserIds
        let method = "GET"
        let results = await $postServiceFn.memberRelationshipAddPut(method, url)
        konsole.log("resultsParentCabinet", results)
        if (results) {
            let reponseData = results?.data?.data
            konsole.log("reponseData", reponseData)
            return reponseData
        }
    }

    const apiCallgetFiduciaryList = async (primaryUserId, beneficiary) => {
        dispatchloaderFun(true)
        let getBenifiFidData;
        if (spouseUserId) {
            getBenifiFidData = await fetchMemberRelationship(spouseUserId);
        }
        Services.getFiduciaryDetailsListByUserId(primaryUserId).then((res) => {
            konsole.log('res of fiduciary list', res?.data?.data?.fiduciaries)
            dispatchloaderFun(false)
            // const responseData=res?.data?.data?.fiduciaries?.filter((item)=>item?.fiduciaryUserId !=primaryUserId)?.map(fiduciary => {
            let responseData = res?.data?.data?.fiduciaries?.map(fiduciary => {
                return {
                    value: fiduciary?.fiduciaryUserId,
                    label: fiduciary?.fiduciaryFullName,
                    relationWithUser: fiduciary?.memberRelationshipName,
                    relationWithSpouse: fiduciary?.rltnTypeWithSpouse,
                    emailId: fiduciary?.primaryEmail
                };
            });
            if ((spouseUserId != "" && spouseUserId != null && spouseUserId != undefined && spouseUserId != "null")) {
                if ((getBenifiFidData?.isBeneficiary == false && getBenifiFidData?.isFiduciary == false)) {
                    responseData = responseData?.filter(({ value }) => value != primaryMemberUserId)
                    // konsole.log("responseDatewewewea11",responseData,getBenifiFidData)
                }
            } else {
                responseData = responseData?.filter(({ value }) => value != primaryMemberUserId)
                // konsole.log("responseDatewewewea13",responseData,getBenifiFidData,primaryMemberUserId)
            }
            konsole.log("getBenifiFidData", getBenifiFidData, responseData)
            let fiduciary = $AHelper.deceasedNIncapacititedFilterFun(responseData)
            if (beneficiary.length == 0) {
                setBeneficiaryFiduciaryList(fiduciary)
            }
            if (fiduciary.length == 0) {
                setBeneficiaryFiduciaryList(beneficiary)
            }
            if (fiduciary.length !== 0 && beneficiary.length !== 0) {
                const combinedArray = [...beneficiary, ...fiduciary];
                const uniqueInfoBasedOnUserId = combinedArray.reduce((acc, obj) => {
                    if (!acc.some((item) => item.value === obj.value)) {
                        acc.push(obj);
                    }
                    return acc;
                }, []);
                konsole.log('uniqueInfoBasedOnUserId', combinedArray, uniqueInfoBasedOnUserId)
                setBeneficiaryFiduciaryList(uniqueInfoBasedOnUserId)
            }
        }).catch((err) => {
            konsole.log('err in getting Fiduciary list', err, err?.response)
            // if (err.response.status == 404) {
            dispatchloaderFun(false)
            setBeneficiaryFiduciaryList(beneficiary)
            // }
        })
    }
    const apiCallUsertProfessionals = (primaryUserId) => {
        dispatchloaderFun(true)
        Services.getMemberProfessionals({ MemberUserId: primaryUserId, PrimaryUserId: primaryUserId }).then((res) => {
            konsole.log('res of user professionals list', res)
            dispatchloaderFun(false)
            setUserProfessionalList(res?.data?.data)
        }).catch((err) => {
            dispatchloaderFun(false)
            konsole.log('err in user professionals  list', err, err?.response)
        })
    }

    const apiCallGetSharedFileStatus = (primaryMemberUserId) => {
        dispatchloaderFun(true)
        Services.getSharedFileStatus({ primaryMemberUserId: primaryMemberUserId }).then((res) => {
            konsole.log('res of ger shared file status', res)
            setSharedFileShatusList(res?.data?.data?.filter(item => { return item?.isRead == true }))
            // dispatchloaderFun(false)
        }).catch((err) => {
            dispatchloaderFun(false)
            konsole.log(' err in get shared file status', err)
        })
    }

    const apiCallGetUserListByRoleId = (primaryMemberUserId) => {
        const subtenantId = sessionStorage.getItem("SubtenantId");
        const stateObj = $AHelper.getObjFromStorage("stateObj");
        let josnObj = {
            "subtenantId": subtenantId, "isActive": true,
            //  "roleId": 3 
            "userType": "LEGAL"
        }
        dispatchloaderFun(true)
        Services.getUserListByRoleId(josnObj).then((res) => {
            dispatchloaderFun(false)
            konsole.log('res of getting paralegal list', res)
            let responseData = res?.data?.data
            setParalegalList(responseData)
        }).catch((err) => {
            dispatchloaderFun(false)
            konsole.log('err in getting palarelgal', err)
        })

    }

    //  get Fiduciary and Beneficiary List & Professional List---------------------------------------------------------------------------------------------------------------------




    //  get all file ------------------------------------------------------------------------------
    const getFileFromCabinet = (primaryMemberUserId) => {
        // dispatchloaderFun(true)
        Services.getFileFromCabinet(primaryMemberUserId).then((res) => {
            konsole.log('res  of file from cabinet', res)
            setFileInformation(res.data.data)
            dispatchloaderFun(false)
        }).catch((err) => {
            konsole.log('err in getting file ', err, err?.response)
            dispatchloaderFun(false)
        })
    }
    //  api for Main cabinet-------------------------------------------------------------------------
    function apiCallGetMainCabinetContainer() {
        dispatchloaderFun(true)
          Services.getMainCabinetContainer({belongsTo:primaryMemberUserId, isActive: true, subtenantId: subtenantId, roleId: stateObj.roleId, cabinetId: cabinetFileCabinetId[0] }).then((res) => {
            konsole.log('res of main cabinet', res)
            // let responseData = res?.data?.data
            // let responseData = res?.data?.data?.filter(({ cabinetId }) => cabinetId == 37)
            let responseData = res?.data?.data?.filter(({ cabinetId }) => cabinetId == cabinetFileCabinetId[0])
            konsole.log('responseDataresponseData', responseData)
            let fileCategoryTypeMappingList = responseData?.length > 0 && responseData[0].fileCategoryTypeMappingList
            setAllMainCabinetContainer(fileCategoryTypeMappingList)
            fileCategoryTypeMappingList.sort((a, b) => (a.fileCabinetOrder - b.fileCabinetOrder))
            setCategoryList(fileCategoryTypeMappingList)
            getFileCabinetFolderDetails(fileCategoryTypeMappingList)
            setCabinetList(responseData)
            //dispatchloaderFun(false)
            // setAllMainCabinetContainer(fileCategoryTypeMappingList)
            konsole.log('fileCategoryTypeMappingList', fileCategoryTypeMappingList)
        }).catch((err) => {
            konsole.log('errerrerr', err)
            dispatchloaderFun(false)
            konsole.log('err in main cabinet', err, err?.response)
        })
    }


    const functionAfterAddingAnyFolder = () => {
        getFileCabinetFolderDetails(categoryList)
    }

    //  get folder--------------------------------------------------------------------------------------
    const getFileCabinetFolderDetails = async (arrFileCabinetTypeList) => {
        dispatchloaderFun(true)
        Services.getFileCabinetFolderDetails({ belongsTo: primaryMemberUserId, folderCabinetId: cabinetFileCabinetId[0] }).then(async (response) => {
            konsole.log('res in get folder', response)
            dispatchloaderFun(false)
            if (response) {

                let responseData = response?.data?.data?.map(obj => {
                    return { ...obj, 'folderCreatedByRoleId': obj?.sharedRoleId };
                });
                let responseFolder = responseData?.filter(({ belongsTo, folderCabinetId }) => belongsTo == primaryMemberUserId && folderCabinetId == cabinetFileCabinetId[0])

                konsole.log('responseFolderresponseFolder', responseFolder)
                setAllFolderList(responseFolder)
                // if (!paralegalAttoryId.includes(stateObj.roleId)) {
                // let folterCategiory = responseFolder.filter(({ folderFileCategoryId, folderCabinetId }) => folderCabinetId == cabinetFileCabinetId[0] && folderFileCategoryId !== categoryFileCabinet[0])
                // let folterCategiory = response?.data?.data?.filter((item) => item.folderCabinetId == cabinetFileCabinetId[0] &&  item.folderName !=='Current' && item.folderName !=='Life Plan' && item.folderName !=='Archived')
                let folterCategiory = responseData?.filter((item) => item.folderCabinetId == cabinetFileCabinetId[0] && item.folderFileCategoryId !== categoryFileCabinet[0])

                konsole.log('folterCategioryfolterCategiory', folterCategiory)
                if (folterCategiory.length == 0) {
                    // mappingSpecificFolder()
                    mappingSpecificFolder2();
                }


                // }

                // return;
                dispatchloaderFun(true)

                // @@ for legal folder mapping and permission to paralegals
                let responseFolder2 = responseFolder?.filter(({ folderFileCategoryId }) => folderFileCategoryId == categoryFileCabinet[0])
                let results = await apiCallGetPermissionsFolder(primaryMemberUserId, responseFolder);
                if (results.length == 0 && responseFolder2.length !== 0 && paralegalAttoryId.includes(stateObj.roleId)) {
                    let result = await apiCallGetUserListByRoleIdd()
                    if (result !== 'err') {
                        let myPermissionJson = []
                        for (let i = 0; i < responseFolder2?.length; i++) {
                            for (let j = 0; j < result?.length; j++) {
                                let newArray = cretaeJsonForFolderPermission({
                                    ...manageCreate, editFolder: false, deleteFolder: false, readFolder: true, createSubFolder: false, editSubFolder: false, deleteSubFolder: false, fileUpload: false,
                                    subtenantId, sharedRoleId: stateObj.roleId, sharedUserId: result[j].userId,
                                    primaryUserId: primaryMemberUserId, isActive: true, cabinetId: cabinetFileCabinetId[0], folderId: responseFolder2[i].folderId
                                });
                                myPermissionJson.push(newArray)
                            }
                        }
                        konsole.log('myPermissionJsonmyPermissionJson', myPermissionJson, JSON.stringify(myPermissionJson))
                        await callPermissionsApi(myPermissionJson)
                    }
                }

                // @@ with append all permissions folder
                let result = await apiCallGetPermissionsFolder(primaryMemberUserId, responseFolder);
                let folderForCategoiryMapping = []
                if (paralegalAttoryId.includes(stateObj.roleId)) {
                    konsole.log("responseFolderLine345", responseFolder);
                    const filterFolderBasedOnCategory = responseFolder?.filter(({ folderFileCategoryId }) => folderFileCategoryId != categoryFileCabinet[0]);
                    let result2 = result;
                    if (filterFolderBasedOnCategory.length > 0 && result.length > 0) {
                        result2 = [...filterFolderBasedOnCategory, ...result]
                    }
                    folderForCategoiryMapping = result2;
                    konsole.log('resultresult', result);
                } else {
                    folderForCategoiryMapping = responseFolder
                }


                konsole.log('folderFolCategoiryMappingfolderFolCategoiryMapping', folderForCategoiryMapping)
                konsole.log('arrFileCabinetTypeListarrFileCabinetTypeList', arrFileCabinetTypeList)

                // @@ making Recursion Parent,Sub,Sub folder 
                for (let [index, item] of arrFileCabinetTypeList.entries()) {
                    dispatchloaderFun(true)
                    arrFileCabinetTypeList[index]["folder"] = [];
                    arrFileCabinetTypeList[index]["fileCabinetFolderList"] = [];
                    const arrResponseFolder = folderForCategoiryMapping.filter(({ folderFileCategoryId }) => folderFileCategoryId === arrFileCabinetTypeList[index].fileCategoryId).sort((a, b) => (a - b));
                    konsole.log('arrResponseFolder', arrResponseFolder, createNestedArray(arrResponseFolder))
                    arrFileCabinetTypeList[index]["folder"] = createNestedArray(arrResponseFolder)
                    if (arrResponseFolder?.length > 0) { setAllContainerFolder(arrResponseFolder) }

                }
                dispatchloaderFun(false)
                konsole.log('arrFileCabinetTypeListaz', folderForCategoiryMapping, arrFileCabinetTypeList)
                setFileCabinetTypeList(arrFileCabinetTypeList)
                setAllMainCabinetContainer(arrFileCabinetTypeList)
            }

        }).catch((err) => {
            dispatchloaderFun(false)
            konsole.log('err of gettign folder', err.response)
            setFileCabinetTypeList(categoryList)
            // setAllMainCabinetContainer(categoryList)
            if (err?.response?.data?.statusCode == 404) {
                setAllMainCabinetContainer(arrFileCabinetTypeList)
                // callcretaeFolderwithParalegalCreatedBy()
                let postjson = [{ "belongsTo": primaryMemberUserId, "folderRoleId": Number(stateObj.roleId), "folderCreatedBy": primaryMemberUserId, "folderOperation": folderOperationType[1], "folderSubtenantId": Number(subtenantId) }]
                // let postjson = createJsonForFolderMapping({ folderFileCategoryId, belongsTo, folderCreatedBy: loggedUserId, folderOperation: folderOperationType[2], folderSubtenantId: subtenantId, folderRoleId, folderCabinetId })
                mappingSpecificFolder()
                // konsole.log('postjsonpostjsonpostjson', JSON.stringify(postjson))
                // callApiCabinetFolder(postjson)
            }
            konsole.log('errrreeeeeeeeeee', err, err?.response)
        })
        dispatchloaderFun(false)
    }



    // THIS function for mapping all folder without legal category
    const mappingSpecificFolder2 = async () => {
        let belongsTo = primaryMemberUserId
        let folderRoleId = 9;
        let folderCabinetId = cabinetFileCabinetId[0]
        let folderFileCategoryId = categoryFileCabinet[0]

        let postJson = createJsonForFolderMapping2({ folderFileCategoryId, belongsTo, folderCreatedBy: primaryMemberUserId, folderOperation: operationForCategoryType[1], folderSubtenantId: subtenantId, folderRoleId, folderCabinetId, autoMapProfessionalFolderId: categoryFileCabinet[0] })
        konsole.log('postJsonpostJsonpostJson', postJson)
        // return;
        callApiCabinetFolder([postJson])

    }



    const apiCallGetUserListByRoleIdd = () => {
        const subtenantId = sessionStorage.getItem("SubtenantId");
        const stateObj = $AHelper.getObjFromStorage("stateObj");
        let josnObj = {
            "subtenantId": subtenantId, "isActive": true,
            // "roleId": stateObj.roleId 
            "userType": "LEGAL"
        }
        dispatchloaderFun(true)

        return new Promise((resolve, reject) => {
            Services.getUserListByRoleId(josnObj).then((res) => {
                dispatchloaderFun(false)
                konsole.log('res of getting paralegal list', res)
                let responseData = res?.data?.data;
                resolve(responseData)
            }).catch((err) => {
                dispatchloaderFun(false)
                konsole.log('err in getting palarelgal', err)
                resolve('err')
            })
        })

    }

    const callPermissionsApi = (newArr) => {
        dispatchloaderFun(true)
        return new Promise((resolve, reject) => {
            konsole.log('callPermissionsApi', newArr, JSON.stringify(callPermissionsApi))
            Services.upsertCabinetFolderPermissions(newArr).then((res) => {
                dispatchloaderFun(false)
                //   window.location.reload()
                konsole.log('res of folder permissions', res)
                resolve('resolve')
            }).catch((err) => {
                dispatchloaderFun(false)
                resolve('err')
                konsole.log(' err in folder permissions', err)
            })
        })
    }

    const mappingSpecificFolder = async () => {
        let belongsTo = primaryMemberUserId
        let folderRoleId = JSON.parse(sessionStorage.getItem('stateObj')).roleId
        let folderCabinetId = cabinetFileCabinetId[0]
        let folderFileCategoryId = categoryFileCabinet[0]

        // let postJson = createJsonForFolderMapping({ folderFileCategoryId, belongsTo, folderCreatedBy: loggedUserId, folderOperation: folderOperationType[2], folderSubtenantId: subtenantId, folderRoleId, folderCabinetId })
        // let autoMapProfessionalFolderId = await apiCallGetFolderDetailsForMappingFolderId()
        // konsole.log('autoMapProfessionalFolderId', autoMapProfessionalFolderId)
        // if (autoMapProfessionalFolderId == 'err') return;

        let postJson = createJsonForFolderMapping2({ folderFileCategoryId, belongsTo, folderCreatedBy: loggedUserId, folderOperation: operationForCategoryType[1], folderSubtenantId: subtenantId, folderRoleId, folderCabinetId, autoMapProfessionalFolderId: categoryFileCabinet[0] })
        konsole.log('postJsonpostJsonpostJson', postJson)
        // return;
        callApiCabinetFolder([postJson])

    }

    const apiCallGetFolderDetailsForMappingFolderId = () => {
        let subtenantId = sessionStorage.getItem('SubtenantId')
        let jsonObj = { "folderFileCategoryId": categoryFileCabinet[0], "folderRoleId": 11, "folderSubtenantId": subtenantId, "folderCabinetId": cabinetFileCabinetId[0] }
        dispatchloaderFun(true)
        return new Promise((resolve, reject) => {
            dispatchloaderFun(true)
            Services.getFileCabinetFolderDetails(jsonObj).then((res) => {
                dispatchloaderFun(false)
                konsole.log('res of get folder 2', res)
                let responseData = res.data.data
                let lifePlanFolderId = responseData?.filter(({ folderName }) => folderName == 'Life Plan')
                let currentArchieve = responseData?.filter(({ folderName, parentFolderId, folderId }) => folderId == lifePlanFolderId[0].folderId || parentFolderId == lifePlanFolderId[0].folderId)
                konsole.log('lifePlanFolderIdlifePlanFolderId', currentArchieve, lifePlanFolderId)
                // Life Plan
                // let responseData = res.data.data
                // const folderIds = responseData.map(item => item.folderId)
                const folderIds = currentArchieve.map(item => item.folderId)
                // if (responseData.length == folderIds.length) {
                //   konsole.log('folderIdsfolderIdsfolderIdslength', folderIds.join(','))
                //   resolve(folderIds.join(','))
                // }
                if (currentArchieve.length == folderIds.length) {
                    konsole.log('folderIdsfolderIdsfolderIdslength', folderIds.join(','))
                    resolve(folderIds.join(','))
                }

                konsole.log('folderIdfolderIdfolderId', "aaa", folderIds, folderIds.length)


            }).catch((err) => {
                dispatchloaderFun(false)
                folderId('err')
                konsole.log('err in fatching folder details', err?.response)
            })
        })

    }
    const apiCallGetPermissionsFolder = async (primaryMemberUserId, responseFolder) => {
        dispatchloaderFun(true)
        let jsonObj = { primaryUserId: primaryMemberUserId }
        // if (stateObj.roleId == 3) jsonObj['sharedUserId'] = loggedUserId
        return new Promise((resolve, reject) => {
            dispatchloaderFun(true)
            Services.getPermissionsFolder(jsonObj).then((res) => {
                if (res) {
                    dispatchloaderFun(false)
                    konsole.log('res of permissions folder', res)
                    let shareFolder = res?.data?.data.filter(({ isActive, readFolder }) => isActive == true)
                    setPermissionsFolder(shareFolder)
                    let resultFolder = res?.data?.data.filter(({ isActive, readFolder, sharedUserId, primaryUserId, cabinetId }) => isActive == true && sharedUserId == loggedUserId && cabinetId == cabinetFileCabinetId[0])
                    konsole.log('newArrayFoldernewArrayFolder', responseFolder, resultFolder)
                    // let createdByParalegalFolder = responseFolder?.filter(({ folderCreatedBy }) => folderCreatedBy == loggedUserId)
                    let newArrayFolder = []
                    if (responseFolder.length !== 0 && resultFolder?.length !== 0) {
                        for (let [index, item] of responseFolder?.entries()) {
                            dispatchloaderFun(true)
                            for (let i = 0; i < resultFolder?.length; i++) {
                                if (item?.folderId == resultFolder[i].folderId) {
                                    newArrayFolder.push({ ...item, ...resultFolder[i] })
                                }
                            }
                        }
                    }
                    dispatchloaderFun(false)
                    // konsole.log('createdByParalegalFolder', createdByParalegalFolder)
                    konsole.log('newArrayFoldernewArrayFolderaaaa', newArrayFolder, resultFolder)
                    let myFolders = newArrayFolder
                    resolve(myFolders)
                }
            }).catch((err) => {
                dispatchloaderFun(false)
                konsole.log(' err in permissions folder', err, err.response)
                resolve([])
            })
        })

    }



    //  this api for mapping folder  for paralegal ----------------------------------------------------------------------------------------

    // const callcretaeFolderwithParalegalCreatedBy = () => {
    //     const subtenantId = sessionStorage.getItem("SubtenantId");
    //     const stateObj = $AHelper.getObjFromStorage("stateObj");
    //     let josnObj = { "subtenantId": subtenantId, "isActive": true, "roleId": 3 }
    //    dispatchloaderFun(true)
    //     Services.getUserListByRoleId(josnObj).then((res) => {
    //         konsole.log('res of getting paralegal list', res)
    //        dispatchloaderFun(false)
    //         let folderCreatedBy = res?.data.data[0].userId
    //         let postjson = [{ "belongsTo": primaryMemberUserId, "folderRoleId": Number(stateObj.roleId), "folderCreatedBy": folderCreatedBy, "folderOperation": folderOperationType[1], "folderSubtenantId": Number(subtenantId) }]
    //         callApiCabinetFolder(postjson)

    //     }).catch((err) => {
    //         konsole.log('err in getting palarelgal', err)
    //        dispatchloaderFun(false)
    //     })

    // }

    //  this api for mapping folder  for paralegal ----------------------------------------------------------------------------------------
    function apiCallUpsertMainCabinet(postJson) {
        dispatchloaderFun(true)
        konsole.log('createCabinetObjJson', postJson)
        Services.upsertMainCabinet(postJson).then((res) => {
            dispatchloaderFun(false)
            konsole.log('res of add cabinet', res)
            apiCallGetMainCabinetContainer()
            reloadScreen()
        }).catch((err) => {
            konsole.log('err in add cabinet ', err, err?.response)
            dispatchloaderFun(false)
        })
    }

    // api call for  category--------------------------------------------------------------------
    function callApiCabinetCategory(postJson, msg) {
        konsole.log('postJson', postJson)
        dispatchloaderFun(true)
        Services.upsertCabinetCategoryType(postJson).then((res) => {
            dispatchloaderFun(false)
            konsole.log('res of file category', res)
            apiCallGetMainCabinetContainer()
            AlertToaster.success(`Category ${msg} successfully.`)
            reloadScreen()
        }).catch((err) => {
            konsole.log('err of file category ', err, err?.response)
            dispatchloaderFun(false)
        })
    }

    // api call for folder--------------------------------------------------------

    function callApiCabinetFolder(postJson, msg, mapFolder) {
        // konsole.log('postJson', postJson)
        dispatchloaderFun(true)
        Services.upsertCabinetFolder(postJson).then((response) => {
            dispatchloaderFun(false)
            konsole.log('response of adding updating and deleting folder', response)
            // apiCallGetMainCabinetContainer()
            if (msg) {
                AlertToaster.success(`Folder ${msg} successfully.`)
            }
            reloadScreen()
        }).catch((err) => {
            dispatchloaderFun(false)
            konsole.log('err of adding updating and deleting folder ', err, err?.response)
        })
    }


    const dispatchloaderFun = (val) => {
        props?.dispatchloader(val);
        useLoader(val);
    }
    const reloadScreen = () => {
        window.location.reload()
    }
    const manageFileCabinetBtn = () => {
        setShowScreenType('showManageFileCabinetScreen')
        setShowAddEditFolder('')
    }


    // konsole.log('stateObjstateObj', stateObj.roleId)
    konsole.log('allMainCabinetContainerallMainCabinetContainer', allMainCabinetContainer)

    if (allMainCabinetContainer?.length == 0) {
        return <>
            <div className="d-flex align-items-center justify-content-center " style={{ height: '70vh' }}>
                <div className="text-center">
                    <p>Loading ...</p>
                </div>
            </div>
        </>
    }

    return (
        <FileCabinetContext.Provider value={globalValue}>
            <>
                <Row className='filecabinet_css useNewDesignSCSS'>
                    <Col span={24} >
                        <Row className='justify-content-center'>
                            <Col md='12' lg='12' className='m-2 mt-0'>
                                <ManageAllFile
                                    apiCallUpsertMainCabinet={apiCallUpsertMainCabinet}
                                    callApiCabinetCategory={callApiCabinetCategory}
                                    callApiCabinetFolder={callApiCabinetFolder}
                                    functionForGetFileAfterAddEditFile={functionForGetFileAfterAddEditFile}
                                    key={showScreenType}
                                    functionAfterAddingAnyFolder={functionAfterAddingAnyFolder}
                                />
                            </Col>

                        </Row>
                    </Col>
                </Row>

            </>
        </FileCabinetContext.Provider>
    )
}



function createNestedArray(folders) {
    konsole.log('folders', folders)
    const nestedArray = [];

    function buildNestedArray(parentId, level) {
        const folder = folders.filter(folder => folder.parentFolderId === parentId);
        if (folder.length === 0) {
            return [];
        }

        const nestedChildren = folder.map(child => {
            return {
                ...child,
                folder: buildNestedArray(child.folderId, level + 1)
            };
        });

        return nestedChildren;
    }

    nestedArray.push(...buildNestedArray(0, 1));

    return nestedArray;
}
// export default ParentCabinet


const mapStateToProps = (state) => ({ ...state.main });

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ParentCabinet);