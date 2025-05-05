
import React, { useEffect, useState, useContext, useRef } from 'react';
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, } from "react-bootstrap";
import { SelectCom, getApiCall, InputCom, isNotValidNullUndefile, postApiCall } from '../Reusable/ReusableCom';
import { $Service_Url } from '../network/UrlPath';
import { $postServiceFn } from '../network/Service';
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

const assetObj = () => {
    return { agingAssetCatId: 8, agingAssetTypeId: null, ownerTypeId: null, nameOfInstitution: '', balance: null, userAgingAssetId: '', createdBy: '', assetDocuments: [], assetOwners: [], assetBeneficiarys: [], isRealPropertys: [], isActive: true }
}
const assetDocObj = () => {
    return { documentName: '', documentPath: '', fileId: '', selectfileName: 'Click to Browse your file' }
}
const isRealPropertyNewObj = () => {
    return { purchasePrice: '', purchaseDate: '', value: '' }
}

const customStyles = {
   
    placeholder: (provided) => ({
      ...provided,
      marginRight: '10px',
    }),
  };
const AutoMobiles = ({ dispatchloader, isOpenModal, setIsOpenModal, autoMobilesList, fetchAutoMobilesInfo }) => {
    const { setdata } = useContext(globalContext)
    const context = useContext(globalContext);
    const autoMobileOtherRef = useRef(null)

    const loggedInUserId = sessionStorage.getItem('loggedUserId')
    const primaryUserId = sessionStorage.getItem('SessPrimaryUserId')
    const spouseUserId = sessionStorage.getItem('spouseUserId')
    const primarymemberDetails = JSON.parse(sessionStorage?.getItem("userDetailOfPrimary"));

    // /** -------------------------------- state----define---------------------------------------------**/
    const [preConditionTypeList, setPreConditionTypeList] = useState([])
    const [ownerTypesList, setOwnerTypeList] = useState([])
    const [assetInfo, setAssetInfo] = useState({ ...assetObj(), createdBy: loggedInUserId })
    const [assetDocInfo, setAssetDocInfo] = useState({ ...assetDocObj() });
    const [isRealPropertyObj, setIsRealPropertyObj] = useState({ ...isRealPropertyNewObj() })
    const [uploadedFileObj, setUploadedFileObj] = useState(null)
    const [selectfileName, setSelectFileName] = useState('Click to Browse your file')
    const [isDataUpdate, setIsDataUpdate] = useState(false)
    const [updateOwnerDetail, setUpdateOwnerDetail] = useState([])
    const [fileTypeId, setFileTypeId] = useState(11)
    const [fileCategoryId, setFileCategoryId] = useState(5)


    useEffect(() => {
        const primaryUserId = sessionStorage.getItem('SessPrimaryUserId')
        fetchApiCall();
        fetchAutoMobilesInfo(primaryUserId)
    }, [])
    // warning toaster---------------------
    function toasterAlert(text) {
        setdata({ open: true, text: text, type: "Warning" });
    }
    // warning toaster---------------------


    // /** -------------------------------- fetch api call---------------------------------------------**/
    const fetchApiCall = async () => {
        dispatchloader(true)
        await getApiCall('GET', $Service_Url.getPreconditionType + '8', setPreConditionTypeList);
        const ownerTypeResult = await getApiCall('GET', $Service_Url.getFileBelongsToPath + `?ClientUserId=${primaryUserId}`);
        konsole.log('ownerTypeResultownerTypeResult', ownerTypeResult)
        if (ownerTypeResult !== 'err') {
            const responseMap = ownerTypeResult?.map(item => ({
                value: item.fileBelongsTo,
                label: (item.fileBelongsTo === "JOINT") ? "Joint" : item.belongsToMemberName
            }));
            setOwnerTypeList(responseMap);
        }
        dispatchloader(false)
    }



    //  handle all set State---------------------------
    const handleAssetInfo = (key, value) => {
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
    //  handle all set State---------------------------

    //  handle file upload with api---------------------------------------------------------------------------
    const handleFileUpload = () => {
        document.getElementById("fileUploadLifeId").click();
    }



    // /** -------------------------------- function for upload & select docment---------------------------------------------**/

    const handleFileUploadSelect = (e) => {

        const file = e.target?.files;
        if (file.length == 0) {
            setUploadedFileObj(null);
            return;
        }
        const typeOfFIle = file[0].type;
        const fileOfSize = file[0].size;

        if (typeOfFIle !== "application/pdf") {
            toasterAlert("only pdf format allowed");
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
    //  handle file upload---------------------------------------------------------------------------


    // /** -------------------------------- function edit data set ---------------------------------------------**/
    const handleEditAutoMobilesDetail = (updateValue) => {
        console.log('updateValueupdateValue', updateValue)
        const { agingAssetCatId, agingAssetCategory, agingAssetTypeId, assetDocuments, assetOwners, assetTypeName, balance, isActive, isRealPropertys, nameOfInstitution, ownerType, ownerTypeId, remarks, userAgingAssetId } = updateValue

        setAssetInfo(prev => ({
            ...prev, "agingAssetTypeId": agingAssetCatId, "agingAssetTypeId": agingAssetTypeId,
            "ownerTypeId": assetOwners?.length == 2 ? 'Joint' : assetOwners?.length == 1 ? assetOwners[0].ownerUserId : "-",
            "nameOfInstitution": nameOfInstitution,
            "balance": balance, "userAgingAssetId": userAgingAssetId, "updatedBy": loggedInUserId, "isActive": true,
        }))

        if (isRealPropertys.length > 0) {
            const { purchasePrice, purchaseDate, value, isDebtAgainstProperty, userRealPropertyId } = isRealPropertys[0]
            setIsRealPropertyObj(prev => ({
                ...prev, "purchasePrice": purchasePrice, "purchaseDate": purchaseDate,
                "value": value, "isDebtAgainstProperty": isDebtAgainstProperty, "userRealPropertyId": userRealPropertyId,
            }))
        }
        if (assetDocuments.length > 0) {
            const { fileId, documentName, userAgingAssetDocId } = assetDocuments[0]
            konsole.log('filefile', fileId, documentName, userAgingAssetDocId)
            setAssetDocInfo(prev => ({
                ...prev, 'viewFileId': fileId, 'fileId': fileId,
                "viewshowfile": (isNotValidNullUndefile(fileId)) ? true : false,
                "selectfileName": isNotValidNullUndefile(documentName) ? documentName : "Click to Browse your file",
                "userAgingAssetDocId": userAgingAssetDocId
            }))
        }
        setUpdateOwnerDetail(assetOwners)
        setIsDataUpdate(true)

    }


    konsole.log('assestdocumentinfo', assetDocInfo)

    //  this function for handle owner data -----------------------------------
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

    // /** -------------------------------- handle document for api ---------------------------------------------**/
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
    // /** -------------------------------- validate data ---------------------------------------------**/
    const validate = () => {
        let nameErr = ''
        // assetInfo
        const { agingAssetTypeId, ownerTypeId } = assetInfo
        if (!isNotValidNullUndefile(ownerTypeId)) {
            nameErr = 'Owner cannot be blank'
        }
        if (!isNotValidNullUndefile(agingAssetTypeId)) {
            nameErr = 'Transportation cannot be blank'
        }

        if (isNotValidNullUndefile(nameErr)) {
            toasterAlert(nameErr)
            return true;
        }
        return false;
    }
    // /** -------------------------------- upload file---------------------------------------------**/
    const saveFile = () => {
        if (validate()) return;
        if (isNotValidNullUndefile(uploadedFileObj)) {
            dispatchloader(true);
            $postServiceFn.postFileUpload(uploadedFileObj, primaryUserId, loggedInUserId, fileTypeId, fileCategoryId, 2, (response, errorData) => {
                dispatchloader(false);
                if (response) {
                    konsole.log("resposne", response);
                    let responseFileId = response?.data?.data?.fileId;
                    let responsedocName = response?.data?.data?.fileName;
                    let responsedocPath = response?.data?.data?.fileURL;
                    saveData(responseFileId, responsedocName, responsedocPath)
                    // this.handleAgingassetsubmit(type,responseFileId, responsedocName, responsedocPath);
                } else if (errorData) {
                    toasterAlert(errorData, "Warning")
                }
            })
        } else {
            saveData(null)
        }

    }
    // /** -------------------------------- save update data ---------------------------------------------**/

    const saveData = async (fileId, documentName, documentPath) => {
        const assesDocument = processOfAccessDocument(fileId, documentName, documentPath)
        const myAssetOwners = calculateAssetOwners();
        let assetJson = JSON.parse(JSON.stringify(assetInfo))
        assetJson.assetOwners = myAssetOwners;
        assetJson.assetDocuments = assesDocument;
        assetJson.ownerTypeId = 1
        assetJson.isRealPropertys = [isRealPropertyObj]

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
        konsole.log('resultresult', result)
        if (result != 'err') {

            // /** --------------------------------handle other for automolibe select ---------------------------------------------**/
            if (result?.data?.data?.agingAssetTypeId == '999999') {
                autoMobileOtherRef.current.saveHandleOther(result?.data?.data?.userAgingAssetId);
            }
            AlertToaster.success(`Data ${method == 'POST' ? 'saved' : 'updated'} successfully. `)
            fetchAutoMobilesInfo(primaryUserId)
            // handleAddUpdateDataReset()
            handleCloseModal()
        }
    }



    // /** -------------------------------- function delete data ---------------------------------------------**/
    const deleteDetails = async (item) => {
        const req = await context.confirm(true, "Are you sure? you want to delete", "Confirmation");
        if (req == false) return;
        // handleAddUpdateDataReset()
        handleCloseModal()
        let jsonObjAsset = item
        jsonObjAsset.isActive = false;
        jsonObjAsset.updatedBy = loggedInUserId
        const jsonObj = {
            userId: item.createdBy,
            asset: jsonObjAsset
        }

        console.log('jsonObjjsonObj', jsonObj)
        dispatchloader(true)
        const result = await postApiCall('PUT', $Service_Url.putUpdateUserAgingAsset, jsonObj);
        dispatchloader(false)
        if (result != 'err') {
            AlertToaster.success(`Data deleted successfully.`)
            fetchAutoMobilesInfo(primaryUserId)
        }
    }



    // /** -------------------------------- close modal  ---------------------------------------------**/
    const handleCloseModal = () => {
        handleAddUpdateDataReset()
        setIsOpenModal(false)
    }
    // /** -------------------------------- close modal & reset all fields ---------------------------------------------**/
    const handleAddUpdateDataReset = () => {
        setAssetInfo({ ...assetObj(), createdBy: loggedInUserId, 'agingAssetTypeId': null })
        setAssetDocInfo({ ...assetDocObj() })
        setIsRealPropertyObj({ ...isRealPropertyNewObj() })
        setIsDataUpdate(false)
        setUploadedFileObj(null)
    }


    // /** ------------------------------------konsole---------------------------------------**/
    konsole.log('setUploadedFileObjsetUploadedFileObj', uploadedFileObj)
    // /** ------------------------------------konsole---------------------------------------**/


    // /** --------------------------------value select in drop down ---------------------------------------------**/

    const selectedValueOfAutoMobile = preConditionTypeList?.find((item) => item.value == assetInfo.agingAssetTypeId)
    const selectedValueOfOwner = ownerTypesList.find((item) => item?.value?.toLowerCase() === (isNotValidNullUndefile(assetInfo?.ownerTypeId) ? assetInfo?.ownerTypeId?.toLowerCase() : assetInfo?.ownerTypeId))


    return (
        <>
            <style jsx global>{`.modal-open .modal-backdrop.show {  opacity: 0.5 !important;}`}</style>

            <Modal
                show={isOpenModal}
                size="lg"
                centered
                onHide={() => handleCloseModal()}
                animation="false"
                backdrop="static"
            >
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Transportation</Modal.Title>
                </Modal.Header>
                <Modal.Body className='mt-2'>
                    <div className='person-content'>
                        <Form.Group as={Row} className="">
                            <Col xs="12" sm="12" md="6" lg="6" className='mb-2'>

                                {/*  /** ------------------ select automobile --------------------------**/}
                                <Select className="w-100 p-0 custom-select"
                                    onChange={(e) => handleAssetInfo('agingAssetTypeId', e.value)}
                                    options={preConditionTypeList}
                                    styles={customStyles}
                                    value={selectedValueOfAutoMobile ? selectedValueOfAutoMobile : ''}
                                    placeholder={$AHelper.mandatory("Type of Transportation")} maxMenuHeight={150} isSearchable />
                            </Col>
                            <Col xs="12" sm="12" md="6" lg="6" className='mb-2'>

                                {/*  /** ------------------ enter model no --------------------------**/}
                                <Form.Control type="text" id="nameOfInstitution"
                                    value={assetInfo.nameOfInstitution}
                                    onChange={(e) => handleAssetInfo('nameOfInstitution', e.target.value)}
                                    name="modalName" placeholder="Year Made/Model no."
                                />

                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} >
                            {
                                assetInfo.agingAssetTypeId == "999999" &&
                                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">

                                    {/*  /** ------------------ select other automobile --------------------------**/}
                                    <Other
                                        othersCategoryId={3}
                                        userId={primaryUserId}
                                        dropValue={assetInfo.agingAssetTypeId}
                                        ref={autoMobileOtherRef}
                                        natureId={assetInfo.userAgingAssetId}
                                    />
                                </Col>
                            }
                        </Form.Group>
                        <Form.Group as={Row} className="">
                            <Col xs="12" sm="12" md="6" lg="6" className="mb-2">

                                {/*  /** ------------------ sente rpurchase price--------------------------**/}
                                <CurrencyInput
                                    prefix="$"
                                    value={isRealPropertyObj.purchasePrice}
                                    allowNegativeValue={false}
                                    className="border"
                                    onValueChange={(e) => handleIsRealPropertyObj('purchasePrice', e)}
                                    name="purchasePrice"
                                    placeholder="Purchase Price"
                                    decimalScale="2"
                                />
                            </Col>
                            <Col xs="12" sm="12" md="6" lg="6" className="mb-2">

                                {/*  /** ------------------ select purchase date --------------------------**/}
                                <DatepickerComponent
                                    name="purchaseDate"
                                    value={isRealPropertyObj?.purchaseDate}
                                    setValue={(value) => handleIsRealPropertyObj("purchaseDate", value)}
                                    placeholderText="Purchase Date"
                                    maxDate={0}
                                    minDate="100"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="">
                            <Col xs sm="6" lg="6" md="6" className='mb-2'>

                                {/*  /** ------------------ select owner type --------------------------**/}
                                <Select className="w-100 p-0 custom-select"
                                    onChange={(e) => handleAssetInfo("ownerTypeId", e.value)}
                                    placeholder={$AHelper.mandatory("Owner")}
                                    value={selectedValueOfOwner ? selectedValueOfOwner : ''}
                                    styles={customStyles}
                                    options={ownerTypesList}
                                    isSearchable />
                            </Col>
                            <Col xs="12" sm="12" md="6" lg="6">

                                {/*  /** ------------------ upload document --------------------------**/}
                                <div className='d-flex justify-content-between align-items-center p-0 ' >
                                    <div className='ps-2 d-flex align-items-center justify-content-between fileInoutHealth'>
                                        {(isNotValidNullUndefile(uploadedFileObj)) ? uploadedFileObj?.name : assetDocInfo?.selectfileName}
                                        <span className='bg-secondary text-white cursor-pointer uploadButtonHeath' onClick={() => handleFileUpload()}>
                                            Upload
                                        </span>
                                    </div>
                                    <div style={{ height: "100%", borderRadius: "0px 3px 3px 0px" }}>
                                        <input className="d-none" type="file" accept='application/pdf' id="fileUploadLifeId"
                                            onChange={(e) => handleFileUploadSelect(e)}
                                        />

                                        {/*  /** ------------------ view pdf --------------------------**/}
                                        {(assetDocInfo?.viewshowfile == true) &&
                                            <PdfViewer2 viewFileId={assetDocInfo?.viewFileId} />
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Form.Group>
                    </div>
                    <div className='mt-3'></div>
                    <Button style={{ backgroundColor: "#76272b", border: "none" }} className="theme-btn float-end mb-2"
                        onClick={() => saveFile()}> {isDataUpdate == true ? "Update" : "Save"}</Button>
                </Modal.Body>
                <Modal.Footer className="border-0 table-responsive retirementTab" style={{ display: "block", maxHeight: "15vh", overflowY: "auto" }}>

                    {/*  /** ------------------ list of data------------------------**/}
                    <div className="table-responsive financialInformationTable">
                        {autoMobilesList?.length > 0 && <>
                            <Table bordered>
                                <thead className='text-center align-middle'>
                                    <tr>
                                        <th>Type of Transportation</th>
                                        <th>Model</th>
                                        <th>Owner</th>
                                        <th>Price</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {autoMobilesList?.map((item, index) => {
                                        console.log('itemitemitemitem', item?.assetTypeName)
                                        const assetOwners = item.assetOwners
                                        const isRealProperty = item.isRealPropertys
                                        return (
                                            <tr key={index}>
                                                <td style={{ wordBreak: "break-word",textAlign:"center" }}>
                                                    <OtherInfo othersCategoryId={3} othersMapNatureId={item.userAgingAssetId} FieldName={item.assetTypeName} userId={primaryUserId} />
                                                </td>
                                                <td className='text-center'>{item?.nameOfInstitution || "-"}</td>
                                                <td className='text-center'>{(assetOwners.length == 2) ? "Joint" : (assetOwners.length == 1) ? assetOwners[0].ownerUserName : "-"}</td>
                                                <td className='text-center'>{isRealProperty.length > 0 ? isRealProperty[0].purchasePrice : '-'}</td>
                                                <td className="d-flex justify-content-around align-items-center text-center">
                                                    <div className="d-flex gap-2">
                                                        <div>
                                                            <h6 style={{ textDecoration: "underline", cursor: "pointer", }} onClick={() => handleEditAutoMobilesDetail(item)}>Edit</h6>
                                                        </div>
                                                        <div className="cursor-pointer" >
                                                            <img src="/icons/deleteIcon.svg" className="p-0 m-0" alt="g4" style={{ width: "16px", display: "flex" }} onClick={() => deleteDetails(item)} />
                                                        </div>
                                                    </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(AutoMobiles);