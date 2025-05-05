
import React, { useEffect, useState, useContext, useRef } from 'react';
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, } from "react-bootstrap";
import { SelectCom, getApiCall, InputCom, isNotValidNullUndefile, postApiCall, removeDuplicate, fileNameShowInClickHere, getOtherFieldsName, removeSpaceAtStart } from '../Reusable/ReusableCom';
import { $Service_Url } from '../network/UrlPath';
import { $CommonServiceFn, $postServiceFn } from '../network/Service';
import konsole from '../control/Konsole';
import { $AHelper } from '../control/AHelper';
import Select from 'react-select';
import CurrencyInput from 'react-currency-input-field';
import DatepickerComponent from '../DatepickerComponent';
import Other from '../asssets/Other';
import { globalContext } from '../../pages/_app';
import { fileLargeMsg } from '../control/Constant';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from 'react-redux';
import OtherInfo from '../asssets/OtherInfo';
import AlertToaster from '../control/AlertToaster';
import PdfViewer2 from '../PdfViwer/PdfViewer2';
import PlaceOfBirth from '../PlaceOfBirth';
import ContactListComponent from '../ContactListComponent';
import DynamicAddressForm from '../DynamicAddressForm';
import TableEditAndViewForDecease from '../Deceased/TableEditAndViewForDecease';
import ExpensesPaidQuestion from '../ExpensesPaidQues';
import { uscurencyFormate } from '../control/Constant';

const assetObj = () => {
    return { agingAssetCatId: 8, agingAssetTypeId: null, ownerTypeId: null, nameOfInstitution: '', balance: null, userAgingAssetId: '', createdBy: '', assetDocuments: [], assetOwners: [], assetBeneficiarys: [], isRealPropertys: [], isActive: true, vinno: "", licensePlate: "", productColor: "" }
}
const assetDocObj = () => {
    return { documentName: '', documentPath: '', fileId: '', selectfileName: 'Click to Browse your file' }
}
const isRealPropertyNewObj = () => {
    return { purchasePrice: '', purchaseDate: '', value: '', isDebtAgainstProperty: null }
}
const objLiability = () => {
    return { nameofInstitutionOrLender: '', userRealPropertyId: '', createdBy: '', payOffDate: null, paymentAmount: null, outstandingBalance: null, liabilityTypeId: '', liabilityId: '' }
}

const customStyles = {
    placeholder: (provided) => ({
        ...provided,
        marginRight: '10px',
    }),
};
const Transportation = ({ dispatchloader, isOpenModal, setIsOpenModal, transportationList, fetchAutoMobilesInfo }) => {
    const { setdata,setPageTypeId} = useContext(globalContext)
    const context = useContext(globalContext);
    const autoMobileOtherRef = useRef(null)

    const loggedInUserId = sessionStorage.getItem('loggedUserId')
    const primaryUserId = sessionStorage.getItem('SessPrimaryUserId')
    const spouseUserId = sessionStorage.getItem('spouseUserId')
    const primarymemberDetails = JSON.parse(sessionStorage?.getItem("userDetailOfPrimary"));
    const fileTypeId = 11;
    const fileCategoryId = 5;
    const liabilityTypeId = 7;
    const liabilityId = 4;

    // /** -------------------------------- state----define---------------------------------------------**/
    const [preConditionTypeList, setPreConditionTypeList] = useState([])
    const [ownerTypesList, setOwnerTypeList] = useState([])
    const [assetInfo, setAssetInfo] = useState({ ...assetObj(), createdBy: loggedInUserId })
    const [assetDocInfo, setAssetDocInfo] = useState({ ...assetDocObj() });
    const [isRealPropertyObj, setIsRealPropertyObj] = useState({ ...isRealPropertyNewObj() })
    const [liabilityInfo, setLiabilityInfo] = useState({ ...objLiability(), createdBy: loggedInUserId, liabilityId: liabilityId, liabilityTypeId: liabilityTypeId })
    const [liabilityloan, setLiabilityloan] = useState({ ...objLiability(), createdBy: loggedInUserId, liabilityId: 5, liabilityTypeId: liabilityTypeId, lenderuserid: '', loanNumber: '', interestRatePercent: '' })
    const [uploadedFileObj, setUploadedFileObj] = useState(null)
    const [selectfileName, setSelectFileName] = useState('Click to Browse your file')
    const [isDataUpdate, setIsDataUpdate] = useState(false)
    const [updateOwnerDetail, setUpdateOwnerDetail] = useState([])
    const [isBtnDisable, setIsBtnDisable] = useState(false)
    const [loanSelection, setLoanSelection] = useState(null)
    const [addloandata, setaddloandata] = useState(false)
    const contactRef = useRef();
    const [lenderUserId, setLenderUserId] = useState(null);
    const[quesReponse,setQuesResponse]=useState(null)
    const addressRef = useRef(null)

    useEffect(() => {
        const primaryUserId = sessionStorage.getItem('SessPrimaryUserId')
        fetchApiCall();
        fetchAutoMobilesInfo(primaryUserId)

    }, [])

    // /** ********************************************************* fetch api call*********************************************************
    const fetchApiCall = async () => {
        dispatchloader(true)
        await getApiCall('GET', $Service_Url.getPreconditionType + '8', setPreConditionTypeList);
        const ownerTypeResult = await getApiCall('GET', $Service_Url.getFileBelongsToPath + `?ClientUserId=${primaryUserId}`);
        konsole.log('ownerTypeResultownerTypeResult', ownerTypeResult)
        if (ownerTypeResult !== 'err') {
            const responseMap = ownerTypeResult?.map(item => ({
                value: item.fileBelongsTo,
                label: (item.fileBelongsTo === "JOINT") ? "JOINT" : $AHelper.capitalizeAllLetters(item.belongsToMemberName)
            }));
            setOwnerTypeList(responseMap);
        }
        dispatchloader(false)
    }
    const fetchLiabilityWithLiabilityId = async (userId, liablityId) => {
        dispatchloader(true)
        const result = await getApiCall('GET', $Service_Url.getUserLiabilityByUserRealPropertyId + "/" + userId + '/' + liablityId);
        dispatchloader(false)
        konsole.log('result of liability', result)
        // if (result == 'err') return;
        if (result?.liability?.length > 0) {
            const { nameofInstitutionOrLender, outstandingBalance, payOffDate, paymentAmount, userLiabilityId, userRealPropertyId, liabilityId } = result?.liability[0]

            if (liabilityId == 5) {
                setLiabilityloan(result?.liability[0])
                setLoanSelection(true)
                setLenderUserId(result?.liability[0]?.lenderUserId)
                addressRef?.current?.getByUserId(result?.liability[0]?.lenderUserId)
                setIsRealPropertyObj(prev => ({...prev, isDebtAgainstProperty: false}))
            } else {
                setLiabilityInfo(prev => ({
                    ...prev, "nameofInstitutionOrLender": nameofInstitutionOrLender,
                    "outstandingBalance": outstandingBalance, "payOffDate": payOffDate,
                    "paymentAmount": paymentAmount,
                    "userLiabilityId": userLiabilityId,
                    "userRealPropertyId": userRealPropertyId,
                }))
                setLiabilityloan({ ...objLiability(), createdBy: loggedInUserId, liabilityId: 5, liabilityTypeId: liabilityTypeId, lenderuserid: '', loanNumber: '', interestRatePercent: '' })
                setLoanSelection(null)
            }
        } else {
            setLiabilityInfo(prev => ({
                ...prev, ...objLiability(), createdBy: loggedInUserId, liabilityId: liabilityId, liabilityTypeId: liabilityTypeId
            }))
            setLoanSelection(null)
        }


    }
    // ********************************************************* handle all set State*********************************************************
    const handleAssetInfo = (key, value) => {
        // if(key == 'agingAssetTypeId'){
        //     handleAddUpdateDataReset() 
        // }
        setAssetInfo(prev => ({
            ...prev,
            [key]: value
        }));
    }
    const handleIsRealPropertyObj = (key, value) => {
        setIsRealPropertyObj(prev => ({
            ...prev,
            [key]: value
        }));
    }
    const handleLiablityObj = (key, value) => {
        value = removeSpaceAtStart(value);
        setLiabilityInfo(prev => ({
            ...prev,
            [key]: value
        }));
    }
    const handleLiablityloanObj = (key, value) => {
        value = removeSpaceAtStart(value)
        setLiabilityloan(prev => ({
            ...prev,
            [key]: value
        }));
    }

    const handleLoanNumber = (value) => {
        if ($AHelper.isNumberRegex(value)) {
            handleLiablityloanObj("loanNumber", value)
        }
    }


    const handleIsLeaseCheckBox = (e) => {
        const checkedVal = e
        konsole.log("handleIsLeaseCheckBox", e)
        handleIsRealPropertyObj('isDebtAgainstProperty', checkedVal)
        if (checkedVal == false) {
            setLiabilityInfo(prev => ({
                ...prev, nameofInstitutionOrLender: '', payOffDate: '', paymentAmount: '', outstandingBalance: '', createdBy: loggedInUserId, liabilityId: liabilityId, liabilityTypeId: liabilityTypeId
            }))
        }
    }
    // ********************************************************* handle all set State*********************************************************

    // ********************************************************* handle file upload with api*********************************************************
    const handleFileUpload = () => {
        document.getElementById("fileUploadLifeId").click();
    }
    // /** ********************************************************* function for upload & select docment *********************************************************

    const handleFileUploadSelect = (e) => {

        const file = e.target?.files;
        if (file.length == 0) {
            setUploadedFileObj(null);
            return;
        }
        const typeOfFIle = file[0].type;
        const fileOfSize = file[0].size;

        if (typeOfFIle !== "application/pdf") {
            toasterAlert("Only pdf format allowed");
            return;
        }
        if ($AHelper.fileuploadsizetest(fileOfSize)) {
            toasterAlert(fileLargeMsg);
            setUploadedFileObj(null);
            setSelectFileName("Click to Browse your file")
            setAssetDocInfo({ ...assetDocObj() })
            return;
        }
        setUploadedFileObj(file[0])
    }
    // konsole.log("updateValue", assetInfo)
    //  handle file upload*********************************************************
    // /** ********************************************************* function edit data set *********************************************************
    const handleEditAutoMobilesDetail = async (updateValue) => {
        
        konsole.log("updateValue", updateValue)
        setLiabilityloan({ ...objLiability(), createdBy: loggedInUserId, liabilityId: 5, liabilityTypeId: liabilityTypeId, lenderuserid: '', loanNumber: '', interestRatePercent: '' })
        setLenderUserId(null)
        const { agingAssetCatId, agingAssetCategory, agingAssetTypeId, assetDocuments, assetOwners, assetTypeName, balance, isActive, isRealPropertys, nameOfInstitution, ownerType, ownerTypeId, remarks, userAgingAssetId, licensePlate, vinno, productColor,quesReponse } = updateValue
        setAssetInfo(prev => ({
            ...prev, "agingAssetTypeId": agingAssetCatId, "agingAssetTypeId": agingAssetTypeId,
            "ownerTypeId": assetOwners?.length == 2 ? 'Joint' : assetOwners?.length == 1 ? assetOwners[0].ownerUserId : "-",
            "nameOfInstitution": nameOfInstitution,
            "balance": balance, "userAgingAssetId": userAgingAssetId, "updatedBy": loggedInUserId, "isActive": true,
            "productColor": productColor, "licensePlate": licensePlate, "vinno": vinno,
        }))
        setQuesResponse(updateValue.quesReponse)

        if (isRealPropertys.length > 0) {
            const { purchasePrice, purchaseDate, value, isDebtAgainstProperty, userRealPropertyId } = isRealPropertys[0]
            setIsRealPropertyObj(prev => ({
                ...prev, "purchasePrice": purchasePrice, "purchaseDate": purchaseDate,
                "value": value, "isDebtAgainstProperty": isDebtAgainstProperty, "userRealPropertyId": userRealPropertyId,
            }))
            konsole.log(isDebtAgainstProperty, "isDebtAgainstProperty")
            fetchLiabilityWithLiabilityId(primaryUserId, userRealPropertyId)
            if (isDebtAgainstProperty == true) {
                fetchLiabilityWithLiabilityId(primaryUserId, userRealPropertyId)
            }
        }
        if (assetDocuments.length > 0) {
            const { fileId, documentName, userAgingAssetDocId } = assetDocuments[0]
            konsole.log('filefile', fileId, documentName, userAgingAssetDocId)
            setAssetDocInfo(prev => ({
                ...prev, 'viewFileId': fileId, 'fileId': fileId,
                "viewshowfile": (isNotValidNullUndefile(fileId)) ? true : false,
                "selectfileName": isNotValidNullUndefile(documentName) ? updateValue?.assetTypeName : "Click to Browse your file",
                "userAgingAssetDocId": userAgingAssetDocId
            }))

            if (updateValue.agingAssetTypeId == '999999') {
                const obj = { userId: primaryUserId, othersCategoryId: 3, othersMapNatureId: updateValue?.userAgingAssetId, isActive: true, othersMapNature: '' }
                let selectfileName = await getOtherFieldsName(obj);
                setAssetDocInfo(prev => ({
                    ...prev,
                    'selectfileName': selectfileName
                }))
            }
        } else {
            setAssetDocInfo({ ...assetDocObj() })
        }
        setUpdateOwnerDetail(assetOwners)
        setIsDataUpdate(true)

    }
    konsole.log('assestdocumentinfo', assetDocInfo)
    // ********************************************************* this function for handle owner data *********************************************************
    function calculateAssetOwners() {
        const { ownerTypeId } = assetInfo
        let assetOwners = [];

        if (isDataUpdate == true) {
            const assetOwn = ownerTypesList.filter((item) => item.value !== "JOINT");
            let assetOwnersdata = assetOwn.map((item) => {
                return { ownerUserId: item.value, OwnerUserName: "OwnerUserName", isActive: true, };
            });
            let updatupdateOwnerData = updateOwnerDetail;
            if (ownerTypeId == "JOINT") {
                for (let i = 0; i < updatupdateOwnerData.length; i++) {
                    for (let [index, item] of assetOwnersdata.entries()) {
                        if (updatupdateOwnerData[i].ownerUserId.toLowerCase() == assetOwnersdata[index].ownerUserId.toLowerCase()) {
                            assetOwnersdata[index]["agingAssetOwnerId"] = updatupdateOwnerData[i].agingAssetOwnerId;
                            assetOwnersdata[index].OwnerUserName = updatupdateOwnerData[i].ownerUserName;
                        }
                    }
                }
                assetOwners = assetOwnersdata;
            } else {
                if (updatupdateOwnerData.length == 1 && updatupdateOwnerData[0].ownerUserId.toLowerCase() == ownerTypeId.toLowerCase()) {
                    assetOwnersdata = updatupdateOwnerData;
                } else {
                    for (let [index, item] of assetOwnersdata.entries()) {
                        if (item.ownerUserId.toLowerCase() == ownerTypeId.toLowerCase()) {
                            assetOwnersdata[index].isActive = true;
                            if (updatupdateOwnerData.length !== 1) {
                                assetOwnersdata[index]["agingAssetOwnerId"] = updatupdateOwnerData[1].agingAssetOwnerId;
                            }
                        } else {
                            assetOwnersdata[index].isActive = false;
                            assetOwnersdata[index]["agingAssetOwnerId"] = updatupdateOwnerData[0].agingAssetOwnerId;
                        }
                    }
                }
                assetOwners = assetOwnersdata;
            }
        } else {
            if (ownerTypeId !== "JOINT") {
                assetOwners = [{ ownerUserId: ownerTypeId }];
            } else {
                const assetOwn = ownerTypesList.filter((item) => item.value !== "JOINT");
                assetOwners = assetOwn.map((item) => {
                    return { ownerUserId: item.value };
                });
            }
        }


        return assetOwners;
    }

    // /** ********************************************************* handle document for api *********************************************************
    const processOfAccessDocument = (fileId, documentName, documentPath) => {
        let assetDocuments = [];
        if (isNotValidNullUndefile(fileId)) {
            assetDocuments = [{ documentName: documentName, documentPath: documentPath, "fileId": fileId }];
        } else {
            assetDocuments = []
        }
        if (isDataUpdate == true && assetDocInfo?.userAgingAssetDocId !== undefined) {
            if (assetDocuments.length > 0) {
                assetDocuments[0]['userAgingAssetDocId'] = assetDocInfo?.userAgingAssetDocId
            }
        }
        return assetDocuments
    }
    // /** ********************************************************* validate data *********************************************************
    const validate = () => {
        let nameErr = ''
        // assetInfo
        const { agingAssetTypeId, ownerTypeId } = assetInfo
        if(
            isNotValidNullUndefile(addressRef?.current?.state?.addressLine1) && 
            addressRef?.current?.validate(addressRef?.current?.state) == false){
            // addressRef?.current?.resetAddress()
            // nameErr= 'Please enter the correct Address'
            return true;
        }
        if (!isNotValidNullUndefile(ownerTypeId)) {
            nameErr = 'Owner cannot be blank'
        }
        if (!isNotValidNullUndefile(agingAssetTypeId)) {
            nameErr = 'Transportation cannot be blank'
        }
        if ((isRealPropertyObj?.isDebtAgainstProperty == true && liabilityInfo.nameofInstitutionOrLender == "") || (loanSelection == true && liabilityloan.nameofInstitutionOrLender == "")) {
            nameErr = "Name of Company can not be Blank";
        }

        if (isNotValidNullUndefile(nameErr)) {
            toasterAlert(nameErr)
            return true;
        }
        return false;
    }
    konsole.log(loanSelection, "loanSelection")
    // /** ********************************************************* upload file*********************************************************

    const saveFile = (type) => {
        if (validate()) return;
        setIsBtnDisable(true)
        setaddloandata(true)
        if (isNotValidNullUndefile(uploadedFileObj)) {
            dispatchloader(true);
            $postServiceFn.postFileUpload(uploadedFileObj, primaryUserId, loggedInUserId, fileTypeId, fileCategoryId, 2, (response, errorData) => {
                dispatchloader(false);
                if (response) {
                    konsole.log("resposne", response);
                    let responseFileId = response?.data?.data?.fileId;
                    let responsedocName = response?.data?.data?.fileName;
                    let responsedocPath = response?.data?.data?.fileURL;
                    saveData(responseFileId, responsedocName, responsedocPath, type)
                    // this.handleAgingassetsubmit(type,responseFileId, responsedocName, responsedocPath);
                } else if (errorData) {
                    toasterAlert(errorData, "Warning")
                }
            })
        } else {
            saveData(null, null, null, type)
        }

    }
    // /** ********************************************************* save update data *********************************************************

    const saveData = async (fileId, documentName, documentPath, type) => {
        const assesDocument = processOfAccessDocument(fileId, documentName, documentPath)
        const myAssetOwners = calculateAssetOwners();
        let assetJson = JSON.parse(JSON.stringify(assetInfo))
        assetJson.assetOwners = myAssetOwners;
        assetJson.assetDocuments = assesDocument;
        assetJson.ownerTypeId = 1
        assetJson.isRealPropertys = [{...isRealPropertyObj}];
        if(loanSelection == true) assetJson.isRealPropertys[0].isDebtAgainstProperty = true;
        // return
        assetJson.quesReponse=quesReponse
        if (type == 'Contact') {
            let jsonobj = {
                subtenantId: 2,
                fName: null,
                lName: null,
                isPrimaryMember: false,
                createdBy: loggedInUserId
            };
            let ApiUrl = $Service_Url.postAddMember;
            if (lenderUserId == null) {
                let addmember = await postApiCall('POST', ApiUrl, jsonobj)
                var lenderuserid = addmember.data.data.member.userId
            } else {
                lenderuserid = lenderUserId
            }
            setLenderUserId(lenderuserid)
            contactRef.current.setUserId(lenderuserid);
            setIsBtnDisable(false)
            return;
        }

        const jsonObj = {
            userId: primaryUserId,
            asset: assetJson
        }
        konsole.log("jsonObj", jsonObj)
        let method = (isDataUpdate == true) ? "PUT" : "POST"
        let url = method == 'POST' ? $Service_Url.postUseragingAsset : $Service_Url.putUpdateUserAgingAsset
        dispatchloader(true)
        const result = await postApiCall(method, url, jsonObj);
        dispatchloader(false)
        if (result != 'err') {
            const responseData = result?.data?.data;
            konsole.log(isRealPropertyObj?.isDebtAgainstProperty, liabilityInfo, liabilityloan, "liablityJson0")
            if (responseData?.isRealPropertys.length > 0) {
                let liablityJson = isRealPropertyObj?.isDebtAgainstProperty == true ? liabilityloan : liabilityInfo;
                konsole.log(liablityJson, "liablityJsonliablityJson")
                if (isNotValidNullUndefile(liablityJson.userLiabilityId)) {
                    dispatchloader(true)
                    await deleteApiForLiabilities(responseData?.isRealPropertys[0].userRealPropertyId)
                    dispatchloader(false)
                    setIsBtnDisable(false)
                }
                if (responseData?.isRealPropertys.length > 0) {
                    // debugger
                    let liablityJson = isRealPropertyObj?.isDebtAgainstProperty == true ? liabilityInfo : liabilityloan;
                    konsole.log(liablityJson, liabilityloan, "liablityJson")
                    liablityJson['userRealPropertyId'] = responseData?.isRealPropertys[0].userRealPropertyId;
                    let jsonObj = {
                        userId: primaryUserId,
                        liability: liablityJson
                    }
                    const methodLiability = isNotValidNullUndefile(liablityJson?.userLiabilityId) ? 'PUT' : 'POST';
                    if (methodLiability == 'PUT') {
                        jsonObj.liability['updatedBy'] = loggedInUserId
                        jsonObj.liability['isActive'] = loanSelection
                    } else {
                        jsonObj.liability['CreatedBy'] = loggedInUserId
                    }
                    konsole.log(liablityJson.liabilityId, "liablityJson.liabilityId")
                    if (liablityJson.liabilityId == 5) {
                        if (methodLiability == 'POST') {
                            let jsonobj = {
                                subtenantId: 2,
                                fName: null,
                                lName: null,
                                isPrimaryMember: false,
                                createdBy: loggedInUserId
                            };
                            let ApiUrl = $Service_Url.postAddMember;
                            if (lenderUserId == null) {
                                let addmember = await postApiCall(methodLiability, ApiUrl, jsonobj)
                                var lenderuserid = addmember.data.data.member.userId
                            } else {
                                lenderuserid = lenderUserId
                            }
                            jsonObj.liability['lenderuserid'] = lenderuserid
                            setLenderUserId(lenderuserid)
                            konsole.log(lenderuserid, type, "lenderuserid")
                            addressRef?.current?.upsertAddress(lenderuserid, 1)

                        }
                        addressRef?.current?.upsertAddress(liablityJson.lenderUserId, 1)

                    }
                    const urlLiability = methodLiability == "POST" ? $Service_Url.postAddLiability : $Service_Url.putAddLiability;
                    konsole.log('liablityesJson', liablityJson?.nameofInstitutionOrLender != '', jsonObj)
                    if (liablityJson.nameofInstitutionOrLender != undefined && liablityJson.nameofInstitutionOrLender != '') {
                        dispatchloader(true)
                        const liabilityResult = await postApiCall(methodLiability, urlLiability, jsonObj);
                        konsole.log('liabilityResultliabilityResult', liabilityResult)
                    }
                    setIsBtnDisable(false)

                }
                dispatchloader(false)
            }


            // /** --------------------------------handle other for automolibe select ---------------------------------------------**/
            if (responseData?.agingAssetTypeId == '999999') {
                autoMobileOtherRef.current.saveHandleOther(responseData?.userAgingAssetId);
            }
            AlertToaster.success(`Data ${method == 'POST' ? 'saved' : 'updated'} successfully. `)
            fetchAutoMobilesInfo(primaryUserId)
            if(type =='save'){
                handleCloseModal()
            }
            handleAddUpdateDataReset()
            addressRef?.current?.resetAddress()
        } else {
            setIsBtnDisable(true)
        }
    }



    // /** ********************************************************* function delete data *********************************************************
    const deleteDetails = async (item) => {
        const req = await context.confirm(true, "Are you sure? you want to delete", "Confirmation");
        if (req == false) return;
        // handleAddUpdateDataReset()
        let jsonObjAsset = item
        jsonObjAsset.isActive = false;
        jsonObjAsset.updatedBy = loggedInUserId
        const jsonObj = {
            userId: item.createdBy,
            asset: jsonObjAsset
        }
        // return;
        // debugger;
        if (item?.isRealPropertys?.length > 0 && item?.isRealPropertys[0].isDebtAgainstProperty == true) {
        // if (item?.isRealPropertys?.length > 0) {
            await deleteApiForLiabilities(item?.isRealPropertys[0].userRealPropertyId)
        }

        dispatchloader(true)
        const result = await postApiCall('PUT', $Service_Url.putUpdateUserAgingAsset, jsonObj);
        dispatchloader(false)
        if (result != 'err') {
            AlertToaster.success(`Data deleted successfully.`)
            fetchAutoMobilesInfo(primaryUserId)
        }
    }

    const deleteApiForLiabilities = async (userRealPropertyId) => {
        dispatchloader(true)
        return new Promise(async (resolve, reject) => {
            const resultofLiabilities = await getApiCall('GET', $Service_Url.getUserLiabilityByUserRealPropertyId + "/" + primaryUserId + '/' + userRealPropertyId);
            if (resultofLiabilities !== 'err' && resultofLiabilities?.liability?.length > 0) {
                dispatchloader(true)
                const result = await postApiCall('DELETE', $Service_Url.deleteUserLiability + `?UserId=${primaryUserId}&UserLiabilityId=${resultofLiabilities?.liability[0].userLiabilityId}&DeletedBy=${loggedInUserId}`)
                dispatchloader(false)
                resolve('deleted')
            } else {
                dispatchloader(false)
                resolve('err')
            }
        })

    }
    // /** ********************************************************* close modal  *********************************************************
    const handleCloseModal = () => {
        handleAddUpdateDataReset()
        setPageTypeId(null)
        setIsOpenModal(false)
    }
    // /** ********************************************************* close modal & reset all fields *********************************************************
    const handleAddUpdateDataReset = () => {
        setAssetInfo({ ...assetObj(), createdBy: loggedInUserId, 'agingAssetTypeId': null })
        setAssetDocInfo({ ...assetDocObj() })
        setIsRealPropertyObj({ ...isRealPropertyNewObj() })
        setLiabilityInfo({ ...objLiability(), createdBy: loggedInUserId, liabilityId: liabilityId, liabilityTypeId: liabilityTypeId })
        setIsDataUpdate(false)
        setUploadedFileObj(null)
        setLoanSelection(null)
        addressRef?.current?.resetAddress()

    }
    // /** ********************************************************* fwarning toaste *********************************************************
    function toasterAlert(text) {
        setdata({ open: true, text: text, type: "Warning" });
    }
    konsole.log(liabilityloan, "fetchSavedAddress")
    useEffect(() => {
        // if(lenderUserId){

        //   fetchSavedAddress(lenderUserId)
        addressRef?.current?.getByUserId(lenderUserId)
        // }
    }, [loanSelection])

    const getQuestionResponse=(value)=>{
        // konsole.log("vadsdsddlue",value)
        if(value){
          const jsonString = JSON.stringify(value);
          setQuesResponse(jsonString)
        }
      }


    // /** ********************************************************* value select in drop down *********************************************************

    const selectedValueOfAutoMobile = preConditionTypeList?.find((item) => item.value == assetInfo.agingAssetTypeId)
    const selectedValueOfOwner = ownerTypesList.find((item) => item?.value?.toLowerCase() === (isNotValidNullUndefile(assetInfo?.ownerTypeId) ? assetInfo?.ownerTypeId?.toLowerCase() : assetInfo?.ownerTypeId))

    // /** ********************************************************* value select in drop down *********************************************************
    // /** ------------------------------------konsole---------------------------------------**/
    konsole.log('setUploadedFileObjsetUploadedFileObj', uploadedFileObj)
    konsole.log('liabilityInfoliabilityInfo', liabilityInfo)
    // /** ------------------------------------konsole---------------------------------------**/


    konsole.log(loanSelection, "loanSelection")

    return (
        <>
            <style jsx global>{`.modal-open .modal-backdrop.show {  opacity: 0.5 !important;}`}</style>

            <Modal show={isOpenModal} size="lg"enforceFocus={false} centered onHide={() => handleCloseModal()} animation="false" backdrop="static">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Transportation</Modal.Title>
                </Modal.Header>
                <Modal.Body className='mt-2'>
                    <div className='person-content'>
                        <Form.Group as={Row} className="">
                            <div>
                                <div className='d-flex align-items-center'>
                                    <p className='me-2'>Type of Transportation* :</p>
                                    {preConditionTypeList.map(response => (
                                        <div className='d-flex'>
                                            <Form.Check
                                                inline
                                                className="chekspace"
                                                type="radio"
                                                id={response.responseId}
                                                name="agingAssetType"
                                                label={response.label}
                                                value={response.value}
                                                onChange={() => handleAssetInfo('agingAssetTypeId', response.value)}
                                                checked={selectedValueOfAutoMobile && selectedValueOfAutoMobile.value === response.value}
                                            />
                                        </div>))}
                                </div>
                                <Col xs="12" sm="12" md="6" lg="6" className="mb-2 mt-2">
                                    {
                                        assetInfo.agingAssetTypeId == "999999" &&
                                        <Other
                                            othersCategoryId={3}
                                            userId={primaryUserId}
                                            dropValue={assetInfo.agingAssetTypeId}
                                            ref={autoMobileOtherRef}
                                            natureId={assetInfo.userAgingAssetId}
                                        />
                                    }
                                </Col>
                            </div>
                            <Col xs="12" sm="12" md="6" lg="6" className='mb-2'>
                                <CurrencyInput prefix='$' type="text" allowNegativeValue={false} className='border'
                                    name="balance" placeholder='Value' decimalScale="2"
                                    value={assetInfo?.balance}
                                    onValueChange={(e) => handleAssetInfo('balance', e)}
                                />
                            </Col>
                            {/*  /** ------------------ select other automobile --------------------------**/}

                            <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                                <Form.Control type="text" id="nameOfInstitution"
                                    value={assetInfo.nameOfInstitution}
                                    onChange={(e) => handleAssetInfo('nameOfInstitution', e.target.value)}
                                    name="modalName" placeholder="Year Made/ Model no."
                                />
                            </Col>
                        </Form.Group>

                        {/*  *************************OWN SECTION*************************************************************** */}
                        <Form.Group as={Row} className="">
                            <Col xs sm="6" lg="6" md="6" className='mb-2'>
                                <Select className="w-100 p-0 custom-select"
                                    onChange={(e) => handleAssetInfo("ownerTypeId", e.value)}
                                    placeholder={$AHelper.mandatory("Owner")}
                                    value={selectedValueOfOwner ? selectedValueOfOwner : ''}
                                    styles={customStyles}
                                    options={ownerTypesList}
                                    isSearchable
                                />
                            </Col>
                            <Col xs sm="6" lg="6" md="6" className='mb-2'>
                                <Form.Control type="text" id="licensePlate"
                                    value={$AHelper.capitalizeAllLetters(assetInfo.licensePlate)}
                                    onChange={(e) => handleAssetInfo('licensePlate', e.target.value)}
                                    name="licensePlate" placeholder="License Plate"
                                />
                            </Col>

                        </Form.Group>
                        <Form.Group as={Row} className="">
                            <Col xs sm="6" lg="6" md="6" className='mb-2'>
                                <Form.Control type="text" id="vinno"
                                    value={assetInfo.vinno}
                                    onChange={(e) => handleAssetInfo('vinno', e.target.value)}
                                    name="vinno" placeholder="VIN No."
                                />
                            </Col>
                            <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                                <Form.Control type="text" id="productColor"
                                    value={assetInfo.productColor}
                                    onChange={(e) => handleAssetInfo('productColor', $AHelper.capitalizeFirstLetter(e.target.value))}
                                    name="productColor" placeholder="Color"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="">
                            <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                                {/*  /** ------------------ upload document --------------------------**/}
                                <div className='d-flex justify-content-between align-items-center p-0 ' >
                                    <div className='ps-2 d-flex align-items-center justify-content-between fileInoutHealth'>
                                        {fileNameShowInClickHere(uploadedFileObj, assetDocInfo?.selectfileName)}
                                        <span className='bg-secondary text-white cursor-pointer uploadButtonHeath' onClick={() => handleFileUpload()}>
                                            Upload
                                        </span>
                                    </div>
                                    <div style={{ height: "100%", borderRadius: "0px 3px 3px 0px" }}>
                                        <input className="d-none" type="file" accept='application/pdf' id="fileUploadLifeId" onChange={(e) => handleFileUploadSelect(e)} />

                                        {/*  /** ------------------ view pdf --------------------------**/}
                                        {(assetDocInfo?.viewshowfile == true) &&
                                            <PdfViewer2 viewFileId={assetDocInfo?.viewFileId} />
                                        }
                                    </div>
                                </div>
                            </Col>

                        </Form.Group>
                        <Form.Group as={Row} className="">
                            <Col xs sm="6" lg="6" md="6" className='mb-2'>
                                <div className='d-flex flex-row'>
                                    <Form.Check
                                        type="radio"
                                        className="left-radio"
                                        name="propertyType"
                                        inline
                                        label="Own"
                                        checked={isRealPropertyObj?.isDebtAgainstProperty == false}
                                        onChange={() => handleIsLeaseCheckBox(false)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="left-radio"
                                        name="propertyType"
                                        inline
                                        label="Lease"
                                        checked={isRealPropertyObj?.isDebtAgainstProperty == true}
                                        onChange={() =>{ handleIsLeaseCheckBox(true),setLoanSelection(false) }}
                                    />
                                </div>
                            </Col>
                        </Form.Group>                     
                    </div>

                    {/*  **********************************************LEASE SECTION*************************************************************** */}
                    {(isRealPropertyObj?.isDebtAgainstProperty == true) ? <>
                        <Form.Group as={Row} className="mt-2 mb-2">
                            <Col xs="12" sm="12" md="6" lg="6">
                                <Form.Control type="text" id="nameOfInstnameofInstitutionOrLenderitution"
                                    value={$AHelper.capitalizeAllLetters(liabilityInfo?.nameofInstitutionOrLender)}
                                    onChange={(e) => handleLiablityObj('nameofInstitutionOrLender', e.target.value)}
                                    name="modalName" placeholder="Company Name*"
                                    onInput={(e) => (e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}

                                />
                            </Col>
                            <Col xs="12" sm="12" md="6" lg="6">
                                <CurrencyInput
                                    prefix='$'
                                    type="text"
                                    allowNegativeValue={false}
                                    className='border'
                                    value={liabilityInfo?.paymentAmount}
                                    onValueChange={(e) => handleLiablityObj('paymentAmount', e)}
                                    name="balance"
                                    placeholder='Monthly Amt.'
                                    decimalScale="2"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="">
                            <Col xs="12" sm="12" md="6" lg="6">
                                <CurrencyInput
                                    prefix="$"
                                    allowNegativeValue={false}
                                    value={liabilityInfo?.outstandingBalance}
                                    onValueChange={(value) => handleLiablityObj("outstandingBalance", value)}
                                    className="border"
                                    placeholder='Outstanding Balance'
                                    name="outstandingBalance"
                                    decimalScale="2"
                                />
                            </Col>
                            <Col xs="12" sm="12" md="6" lg="6">
                                <DatepickerComponent
                                    name="payOffDate"
                                    value={liabilityInfo?.payOffDate}
                                    setValue={(value) => handleLiablityObj("payOffDate", value)}
                                    placeholderText="PayOff Date"
                                    minDate="100"
                                    maxDate="0"
                                    future="show"
                                />
                            </Col>
                        </Form.Group>
                    </> : (isRealPropertyObj.isDebtAgainstProperty == false) && <>
                        <div className='d-flex align-items-center'>
                            <p className='me-4'>Loan</p>
                            <Form.Check
                                type="radio"
                                className="left-radio"
                                name="hasLoan"
                                inline
                                label="Yes"
                                checked={loanSelection == true}
                                onChange={() => setLoanSelection(true)}
                            />
                            <Form.Check
                                type="radio"
                                className="left-radio"
                                name="hasLoan"
                                inline
                                label="No"
                                checked={loanSelection == false}
                                onChange={() => setLoanSelection(false)}
                            />
                        </div>
                        {loanSelection == true && <div className="person-content">
                            <Form.Group as={Row} className="d-flex mt-2" md='12'>
                                <Col xs="12" sm="12" lg="6" md='6' className="mb-2">
                                    <Form.Control
                                        type="text"
                                        value={$AHelper.capitalizeAllLetters(liabilityloan.nameofInstitutionOrLender)}
                                        onChange={(e) => handleLiablityloanObj("nameofInstitutionOrLender", e.target.value)}
                                        name="nameofLender"
                                        placeholder="Name of Company*"

                                        onInput={(e) => (e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                                    />
                                </Col>
                                <Col xs="12" sm="12" lg="6" className="mb-2" md='6'>
                                    <CurrencyInput
                                        prefix="$"
                                        value={liabilityloan.paymentAmount}
                                        allowNegativeValue={false}
                                        className="border"
                                        onValueChange={(value) => handleLiablityloanObj("paymentAmount", value)}
                                        name="Monthly Amount"
                                        placeholder="Monthly Amount"
                                        decimalScale="2"
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="d-flex" md='12'>

                                <Col xs="12" sm="12" lg="6" md='6' className="mb-2">
                                    {/* <Form.Control
                                        type="number"
                                        value={liabilityloan.interestRatePercent}
                                        onChange={(e) => handleLiablityloanObj("interestRatePercent", e.target.value)}
                                        name="interestRate"
                                        placeholder="Interest rate"
                                        min={0}
                                    /> */}
                                    {/* <CurrencyInput
                                        style={{ border: "1px solid #cacaca", borderRadius: "3px" }}
                                        suffix="%"
                                        allowNegativeValue={false}
                                        // disabled={checkDisabledVal}
                                        value={liabilityloan.interestRatePercent}
                                        name="interestRate"
                                        onValueChange={(value) => handleLiablityloanObj("interestRatePercent", value)}
                                        placeholder="Interest rate"
                                    /> */}

                                        <CurrencyInput
                                         suffix='%'
                                         value={liabilityloan.interestRatePercent}
                                         onValueChange={(value) => {
                                         const newValue = (value);
                                         if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                                         handleLiablityloanObj("interestRatePercent", newValue);
                                         } else {
                                         handleLiablityloanObj("interestRatePercent", "");
                                        }}}
                                         name="interestRate"
                                         placeholder="Interest rate"
                                         className="border"
                                         allowDecimals={true}
                                         allowNegativeValue={false}
                                    />
                                </Col>

                                <Col xs="12" sm="12" lg="6" className="mb-2" md='6'>
                                    <CurrencyInput
                                        prefix="$"
                                        value={liabilityloan.outstandingBalance}
                                        allowNegativeValue={false}
                                        className="border"
                                        onValueChange={(value) => handleLiablityloanObj("outstandingBalance", value)}
                                        name="outstandingBalance"
                                        placeholder="Outstanding balance"
                                        decimalScale="2"
                                    />
                                </Col>
                                <Col xs="12" sm="12" md="6" lg="6">
                                    <DatepickerComponent
                                        name="payOffDate"
                                        value={liabilityloan?.payOffDate}
                                        setValue={(value) => handleLiablityloanObj("payOffDate", value)}
                                        placeholderText="PayOff Date"
                                        minDate="100"
                                        maxDate="100"
                                        future="show"
                                    />
                                </Col>

                                <Col xs="12" md='6' sm="12" lg="6" className="mb-2">
                                    <Form.Control
                                        type="text"
                                        value={liabilityloan.loanNumber}
                                        onChange={(e) => handleLoanNumber(e.target.value)}
                                        name="loanNumber"
                                        placeholder="Loan number"
                                        min={0}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Col xs="12" md='6' sm="12" lg="12">
                                    <DynamicAddressForm ref={addressRef} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} >
                                <Col xs="12" sm="12" lg="12" className="mb-3" >
                                    {lenderUserId !== undefined &&
                                        lenderUserId !== "" &&
                                        lenderUserId !== null ? (
                                        <ContactListComponent userId={lenderUserId} ref={contactRef} />
                                    ) : (
                                        <Row className="">
                                            <Col xs="12" sm="12" md="12" className="d-flex align-items-center ">
                                                <button
                                                    className="white-btn"
                                                    onClick={() => saveFile('Contact')}
                                                >
                                                    Contact
                                                </button>
                                            </Col>
                                        </Row>
                                    )}
                                </Col>
                            </Form.Group>
                        </div>}
                    </>}

                    <Col>
                            <ExpensesPaidQuestion getQuestionResponse={getQuestionResponse}  quesReponse={quesReponse}/>
                    </Col>
                    <div className='mt-3'></div>
                    <Button style={{ backgroundColor: "#76272b", border: "none" }} disabled={isBtnDisable} className="theme-btn float-end mb-2"
                        onClick={() => saveFile('save')}>
                        {isDataUpdate == true ? "Update" : "Save"}</Button>
                        {isDataUpdate !=true && 
                    <Button className="theme-btn float-end anotherBTn" style={{ backgroundColor: "#76272b", border: "none" }} disabled={isBtnDisable} onClick={() => saveFile('addMore')}>  Add Another </Button> }

                </Modal.Body>
                <Modal.Footer className="border-0 table-responsive retirementTab" style={{ display: "block", maxHeight: "15vh", overflowY: "auto" }}>
                    {/*  **********************************************TABLE SECTION*************************************************************** */}
                    <div className="table-responsive financialInformationTable">
                        {transportationList?.length > 0 && <>
                            <Table bordered>
                                <thead className='text-center align-middle'>
                                    <tr>
                                        <th>Type of Transportation</th>
                                        <th>Model</th>
                                        <th>Owner</th>
                                        <th>Value</th>
                                        <th>VIN No.</th>
                                        <th>License Plate</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transportationList?.map((item, index) => {
                                        console.log('itemitemitemitem', item)
                                        const assetOwners = removeDuplicate(item.assetOwners, 'ownerUserId')
                                        const isRealProperty = item.isRealPropertys
                                        return (
                                            <tr key={index}>
                                                <td style={{ wordBreak: "break-word", textAlign: "center" }}>
                                                    <OtherInfo othersCategoryId={3} othersMapNatureId={item.userAgingAssetId} FieldName={item.assetTypeName} userId={primaryUserId} />
                                                </td>
                                                <td className='text-center'>{item?.nameOfInstitution || "-"}</td>
                                                <td className='text-center'>{(assetOwners.length == 2) ? "Joint" : (assetOwners.length == 1) ? $AHelper.capitalizeAllLetters(assetOwners[0].ownerUserName) : "-"}</td>
                                                <td className='text-center'>{item?.balance !== null ? $AHelper.IncludeDollars(item.balance) : "-"}</td>
                                                <td className='text-center'>{item?.vinno || "-"}</td>
                                                <td className='text-center'>{item?.licensePlate || "-"}</td>

                                                {/* <td className="d-flex justify-content-around align-items-center text-center">
                                                    <div className="d-flex gap-2">
                                                        <div>
                                                            <h6 style={{ textDecoration: "underline", cursor: "pointer", }} onClick={() => handleEditAutoMobilesDetail(item)}>Edit</h6>
                                                        </div>
                                                        <div className="cursor-pointer" >
                                                            <img src="/icons/deleteIcon.svg" className="p-0 m-0" alt="g4" style={{ width: "16px", display: "flex" }} onClick={() => deleteDetails(item)} />
                                                        </div>
                                                    </div>
                                                </td> */}
                                                <td style={{ verticalAlign: "middle" }}>
                                                    <TableEditAndViewForDecease
                                                        key={index}
                                                        forUpdateValue={item}
                                                        type='primary'
                                                        actionType='Owner'
                                                        handleUpdateFun={handleEditAutoMobilesDetail}
                                                        handleDeleteFun={deleteDetails}
                                                        refrencePage="Transportation"
                                                        userId={primaryUserId}
                                                        memberUserId={assetOwners.length > 0 ? assetOwners[0].ownerUserId : ''}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </>}
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Transportation);
