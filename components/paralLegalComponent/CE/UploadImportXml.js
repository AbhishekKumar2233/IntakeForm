import React, { useEffect, useRef, useState, useContext } from "react";
import { Col, Form, Modal, Row, Table, Button, Spinner } from "react-bootstrap";
import { $AHelper } from "../../control/AHelper";
import FileUpload from "../Bulk/FileUpload";
import konsole from "../../control/Konsole";
import { $CommonServiceFn } from "../../network/Service";
import { $Service_Url } from "../../network/UrlPath";
import { getApiCall2, getApiCall, isNotValidNullUndefile, isNullUndefine, postApiCall } from "../../Reusable/ReusableCom";
import AlertToaster from "../../control/AlertToaster";
import { connect } from "react-redux";
import { SET_LOADER } from "../../Store/Actions/action";
import ListContractExpressData from "./ListContractExpressData";
import { globalContext } from "../../../pages/_app";
import useUserIdHook from "../../Reusable/useUserIdHook";

const _mportMsg = "isAlreadyImport";
 
const UploadImportXml = ({ dispatchloader, callhandleSearch, isImportXml, setIsImportXml, handleSelectFileType, selectFileDocType }) => {
    const _alreadyImportMsg = `This email address is already associated with ${sessionStorage.getItem('subtenantName')}.`;

    const inputRef = useRef(null);
    const contractExpressRef = useRef(null);
    const { setdata, confirm } = useContext(globalContext);
    const { _loggedInUserId, _subtenantId } = useUserIdHook();

    // @Define State----------------------------------

    const [genderRelationAdresstypeList, setGenderRelationAdresstypeList] = useState({ genderTypeList: [], relationshipTypeList: [], addressTypeList: [] })
    const [assetRetireNonRetileRealEstateTypeList, setAssetRetireNonRetileRealEstateTypeList] = useState({ retireAssetTypeList: [], nonRetireAssetTypeList: [], realEstateTypeList: [], insProviderList: [] })
    const [professTypeDetails, setProfessTypeDetails] = useState({ healthProfesTypeList: [], housingProfesTypeList: [], financeProfesTypeList: [], legalProfesTypeList: [], otherProfesTypeList: [], })
    const [dragActive, setDragActive] = useState(false);
    const [savedDocument, setSavedDocument] = useState([]);
    const [updateState, setUpdateState] = useState(false);
    // const [isImportXml, setIsImportXml] = useState(false);
    const [ceImportedData, setCeImportedData] = useState('');
    const [showListOfCEData, setShowListOfCEData] = useState(false);

    // konsole-----------------------------
    konsole.log("assetRetireNonRetileRealEstateTypeList", assetRetireNonRetileRealEstateTypeList);
    konsole.log("savedDocumentsavedDocument", savedDocument);
    konsole.log("professTypeDetails", professTypeDetails)
    // konsole-----------------------------

    // @useEffect-------------------------
    useEffect(() => {
        fetchApi();
    }, [])

    // @Function Get Data -----------------------------
    const fetchApi = async () => {
        dispatchloader(true);
        const _genderResult = await getApiCall('GET', $Service_Url.getGenderListPath, '');
        const _relationShipResult = await getApiCall('GET', $Service_Url.getRelationshiplist, '');
        const _resultAddressType = await getApiCall('GET', $Service_Url.getAddressTypePath, '');
        setGenderRelationAdresstypeList({
            genderTypeList: _genderResult,
            relationshipTypeList: _relationShipResult,
            addressTypeList: _resultAddressType
        })
        const _resultInsProvider = await getApiCall('GET', $Service_Url.getInsProvider);
        const _resultassestTypeNonRetireList = await getApiCall('GET', $Service_Url.getPreconditionType + "1", '');
        const _resultassestTypeRetireList = await getApiCall('GET', $Service_Url.getPreconditionType + "2", '');
        const _resultassestTypeRealEstateList = await getApiCall('GET', $Service_Url.getPreconditionType + "3", '');
        setAssetRetireNonRetileRealEstateTypeList({
            retireAssetTypeList: _resultassestTypeRetireList,
            nonRetireAssetTypeList: _resultassestTypeNonRetireList,
            realEstateTypeList: _resultassestTypeRealEstateList,
            insProviderList: _resultInsProvider
        })

        const _resultHealthProfesTypeList = await getApiCall('GET', $Service_Url.getProfesType + `?proSerDescId=1`);
        const _resultHousingProfesTypeList = await getApiCall('GET', $Service_Url.getProfesType + `?proSerDescId=2`);
        const _resultFinanceProfesTypeList = await getApiCall('GET', $Service_Url.getProfesType + `?proSerDescId=3`);
        const _resultLegalProfesTypeList = await getApiCall('GET', $Service_Url.getProfesType + `?proSerDescId=4`);
        const _resultOtherProfesTypeList = await getApiCall('GET', $Service_Url.getProfesType + `?proSerDescId=5`);

        setProfessTypeDetails({
            healthProfesTypeList: _resultHealthProfesTypeList,
            housingProfesTypeList: _resultHousingProfesTypeList,
            financeProfesTypeList: _resultFinanceProfesTypeList,
            legalProfesTypeList: _resultLegalProfesTypeList,
            otherProfesTypeList: _resultOtherProfesTypeList,
        })
        dispatchloader(false)
    }

    const handleIsImportXml = (value) => {
        if (checkisLoading(savedDocument)) {
            AlertToaster.error('You cannot close the modal before completion.');
            return;
        }
        setShowListOfCEData(false);
        if (value == false) {
            handleSelectFileType('')
            // callhandleSearch()
        }
        setIsImportXml(value)
        setSavedDocument([])
    }
    const handleShowListOfCeData = (value, userEmail) => {
        konsole.log("valuevalue", userEmail, value)
        setShowListOfCEData(value)
        if (isNotValidNullUndefile(userEmail)) {
            setSavedDocument((prev) => {
                let newArray = [...prev]
                let findEmailIndex = newArray.findIndex(item => item.userEmailId == userEmail);
                if (findEmailIndex !== '-1') {
                    newArray[findEmailIndex]['isImport'] = true;
                }
                return newArray;
            })
        }
    }

    const handleShowListOfData = () => {
        // handleIsImportXml(true)
        handleShowListOfCeData(false)
        // setFileList('')
    }

    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    const onButtonClick = () => {
        inputRef.current.click();
    };


    const documentObj = (file) => {
        return {
            document: file,
            userEmailId: "",
            isLoading: false,
            errorMsg: "",
            isUpload: false,
            isChecked: true,
            isImport: false,
            isAlreadyImport: false,
            isImportOtherSub: false,
        }
    }

    konsole.log("selectFileDocType", selectFileDocType)

    const handleFile = (file) => {
        let typeOfFile = file.type;
        if ((selectFileDocType == 1 || selectFileDocType == 2) && typeOfFile !== "text/xml") {
            AlertToaster.error("Only Xml format is allowed.");
            setUpdateState(!updateState);
            return null;
        }
        if(selectFileDocType==3 &&  typeOfFile == "text/xml"){
            AlertToaster.error("Invalid file format.");
            setUpdateState(!updateState);
            return null;
        }
        return documentObj(file);
    };
    const handleInputChange = (e) => {
        e.preventDefault();
        let newFilesPath = [...savedDocument];
        if (e.target?.files && e?.target?.files?.length > 0) {
            for (const file of e.target.files) {
                const document = handleFile(file);
                if (document) {
                    newFilesPath.push(document);
                }
            }
        }
        konsole.log("newFilesPath", newFilesPath)
        setSavedDocument(newFilesPath);
        inputRef.current.value = '';
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let newFilesPath = [...savedDocument];
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            for (const file of e.dataTransfer.files) {
                const document = handleFile(file);
                if (document) {
                    newFilesPath.push(document);
                }
            }
        }
        setSavedDocument(newFilesPath);
        inputRef.current.value = '';
    };

    // @handle delete item-------------------------------
    const hadleDelete = async (index) => {
        let confirms = await confirm(true,'Are you sure you want to delete ?','Confirmation')
        if(confirms == false) return;
        setSavedDocument((prev) => {
            const newArray = [...prev];
            return newArray.filter((i, j) => j !== index);
        });
    }
    const funFileUpload = async () => {


        // @Document Data Import 
        if (savedDocument.every(item => item.isUpload == true)) {
            if (savedDocument.some(item => isNotValidNullUndefile(item.errorMsg))) {
                AlertToaster.error("Invalid file.");
                return;
            }
            const filterData = savedDocument?.filter((item) => item.isUpload == true && item.isImport == false && item.isImportOtherSub == false && isNotValidNullUndefile(item.userEmailId))
            for (let i = 0; i < filterData.length; i++) {
                let resultOfCEdata = await getApiCall("GET", $Service_Url.getCEXMLdata + `?Email=${filterData[i].userEmailId}&DocTypeId=${selectFileDocType}&SubtenantId=${_subtenantId}`);
                if (resultOfCEdata == 'err') return;
                konsole.log('resultOfCEdata', resultOfCEdata);
                contractExpressRef.current.handleSaveData(resultOfCEdata, i == filterData.length - 1, 'funcall')
            }

            konsole.log("filterDatafilterData", filterData)
            if (filterData.length == 0) {
                AlertToaster.success('Data imported successfully.');
                handleIsImportXml(false)
            }
            return;
        }

        // @File upload
        for (let i = 0; i < savedDocument.length; i++) {
            konsole.log("itemitem", savedDocument[i]);
            const { document, errorMsg, isChecked, isImport, isLoading, isUpload, userEmailId } = savedDocument[i];
            if (isUpload != true) {
                const formData = new FormData();
                formData.append('UploadedBy', _loggedInUserId);
                formData.append('file', document);
                handleStateUpdate(i, "", true, false, '', false, false, false);
                let fileUrl = $Service_Url.postCEXMLfileUpload + `?UploadedBy=${_loggedInUserId}&DocTypeId=${selectFileDocType}&SubtenantId=${_subtenantId}`
                const _resultUploadFile = await postApiCall('POST', fileUrl, formData);
                konsole.log('_resultUploadFile', _resultUploadFile)
                // if (_resultUploadFile == 'err') return;
                const responseData = _resultUploadFile?.data?.data;
                if (responseData == null){
                    const erromMessage = isNotValidNullUndefile(_resultUploadFile?.data?.messages[0]) ?  _resultUploadFile?.data?.messages[0] : ''
                    handleStateUpdate(i, _resultUploadFile?.data?.data?.email, false, true, erromMessage, true, false);
                    // return;
                 }else{
                const erromMessage = isNotValidNullUndefile(responseData?.email) ? '' : 'User has not email';
                if (erromMessage) {
                    handleStateUpdate(i, responseData?.email, false, true, erromMessage, false, false);
                } else {
                    let _resultCheckCeData = await getApiCall("GET", $Service_Url.getCEXMLCheckMemberCeData + `?memberCEEmail=${responseData?.email}`);
                    let _resultOfGetDetails = await getApiCall2('GET', $Service_Url.getUserDetailsByUserEmailId + `?emailId=${responseData?.email}`)
                    konsole.log("_resultCheckCeData", _resultCheckCeData);
                    console.log("_resultOfGetDetails", _resultOfGetDetails)
                    let isImportData = _resultCheckCeData != 'err' ? _resultCheckCeData : false
                    let isImportOtherSub = (_resultOfGetDetails != 'err' && _resultOfGetDetails?.data?.length > 0) ? `This email address is already associated with ${_resultOfGetDetails?.data[0]?.subtenantName} firm.` : false;
                    handleStateUpdate(i, responseData?.email, false, true, erromMessage, isImportData, isImportOtherSub);
                }
                 }
            }
        }
    }

    // @file upload Functionion
    const handleStateUpdate = (index, email, isLoading, isUpload, errorMsg, isImport, isImportOtherSub) => {
        setSavedDocument((prev) => {
            const newArray = [...prev];
            newArray[index]['userEmailId'] = email;
            newArray[index]['isLoading'] = isLoading;
            newArray[index]['isUpload'] = isUpload;
            newArray[index]['errorMsg'] = errorMsg;
            newArray[index]['isImport'] = isImport;
            newArray[index]['isAlreadyImport'] = isImport;
            newArray[index]['isImportOtherSub'] = isImportOtherSub;
            return newArray;
        });
    }

    const viewFileDetails = async (emailId) => {
        dispatchloader(true)
        let resultOfCEdata = await getApiCall("GET", $Service_Url.getCEXMLdata + `?Email=${emailId}&DocTypeId=${selectFileDocType}&SubtenantId=${_subtenantId}`);
        console.log('resultOfCEdata', resultOfCEdata);
        if (resultOfCEdata != 'err') {
            setCeImportedData(resultOfCEdata)
            handleShowListOfCeData(true)
            // handleIsImportXml(false)
        }
        dispatchloader(false)
    }
    // konsole----------------------

    konsole.log("savedDocumentsavedDocument", savedDocument)
    // konsole----------------------

    return (
        <>
            <style jsx global>{` .modal-open .modal-backdrop.show {    opacity: 0;  }  `}</style>

            {/* Import XML btn */}
            {/* <div className="col-3">
                <div className=" mt-sm-3 mt-lg-0 ">
                    <button className="theme-btn w-100" style={{ height: "50px" }} onClick={() => handleIsImportXml(true)}>
                        Import File
                    </button>
                </div>
            </div> */}
            <Modal
                show={isImportXml}
                size="lg"
                onHide={() => handleIsImportXml(false)}
                backdrop="static"
                animation='false'
            >
                <Modal.Header className="text-white" closeVariant="white" closeButton>
                    Import 
                </Modal.Header>
                <Modal.Body>
                    <>
                        {/* {(showListOfCEData == true) && */}
                        <ListContractExpressData
                            key={showListOfCEData}
                            ceImportedData={ceImportedData}
                            showContractExpressList={showListOfCEData}
                            handleContractExpressList={handleShowListOfData}
                            handleIsImportXml={handleIsImportXml}
                            handleShowListOfCeData={handleShowListOfCeData}
                            genderRelationAdresstypeList={genderRelationAdresstypeList}
                            assetRetireNonRetileRealEstateTypeList={assetRetireNonRetileRealEstateTypeList}
                            professTypeDetails={professTypeDetails}
                            dispatchloader={dispatchloader}
                            ref={contractExpressRef}
                            CalLength={savedDocument?.filter((item) => item.isUpload == true && item.isImport == false && item.isImportOtherSub == false && isNotValidNullUndefile(item.userEmailId))}
                        />
                        {/* } */}
                        <div className="d-flex justify-content-center align-items-center flex-column  ">
                            <div className="drag my-2 mb-3">
                                <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                                    <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleInputChange} />
                                    <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : ""}>
                                        <div>
                                            <p>Drag and drop your file here or</p>
                                            <button className="upload-button" onClick={onButtonClick}> Upload a file</button>
                                        </div>
                                    </label>
                                    {dragActive && (
                                        <div
                                            id="drag-file-element"
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        ></div>
                                    )}
                                </form>
                            </div>

                            <div className="bg-light  w-100">
                                {/* ------------------------------- @Table Content ------------------------------- */}

                                {(savedDocument?.length > 0) && <>
                                    <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                                        <div className="table-responsive">
                                            <Table bordered responsive="sm md lg xl" className="text-center">
                                                <thead style={{ backgroundColor: 'lightgray', fontWeight: '400', position: 'sticky', top: 0, zIndex: 1 }} >
                                                    <tr>
                                                        <th className="text-center w-25 fw-bold">Document Name</th>
                                                        <th className="text-center w-25 fw-bold">Upload Status</th>
                                                        <th className="text-center w-25 fw-bold">Import Status</th>
                                                        <th className="text-center w-25 fw-bold">-</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {savedDocument.map((item, index) => {
                                                        const { document, isUpload, isChecked, isLoading, isAlreadyImport, isImportOtherSub, userEmailId, errorMsg, isImport } = item;
                                                        konsole.log("isImport", isImport)
                                                        return <>
                                                            <tr key={index} >
                                                                <td className="text-center">{document?.name}</td>
                                                                <td className={`${isUpload ? 'text-success' : ''} text-center fw-bold`}>
                                                                    {errorMsg ? <span className="text-danger">{errorMsg}</span> :
                                                                        <>
                                                                            {(isLoading) ? <div className="spinner-border" style={{ color: "#117800" }} role="status" />
                                                                                : (isUpload == true) ? <><img src="/icons/spinnerCheck.png" style={{ width: "24px" }} />
                                                                                </> : "PENDING"}
                                                                        </>}
                                                                </td>
                                                                <td className="text-center fw-bold">
                                                                    {(isImport) ? <>
                                                                        <img src="/icons/spinnerCheck.png" style={{ width: "24px" }} />
                                                                    </> : 'PENDING'}
                                                                </td>
                                                                <td className="text-center">
                                                                    {(isImport == true || isLoading == true || isImportOtherSub != false) ? <>
                                                                        {(isAlreadyImport) ? <div className="hstack w-100 h-80"><div>{_alreadyImportMsg}</div><div class="vr" ></div><div><img className="ms-1 cursor-pointer" src="/images/deleteCardIcon.svg" onClick={() => hadleDelete(index)}/> </div></div> : (isImportOtherSub != false) ? <div className="hstack w-100 h-80"><div>{isImportOtherSub}</div><div class="vr" ></div><div><img className="ms-1 cursor-pointer" src="/images/deleteCardIcon.svg" onClick={() => hadleDelete(index)}/> </div></div>: '-'}</> : <>
                                                                        {(!errorMsg && isUpload) &&
                                                                            <button className="btn border me-2 mt-2" onClick={() => viewFileDetails(userEmailId, index)}>View</button>}
                                                                        <img className="btn" onClick={() => hadleDelete(index)}  src="/images/deleteCardIcon.svg"/>
                                                                    </>}
                                                                </td>
                                                            </tr>
                                                        </>
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-between mt-5 '>
                                        <button className="theme-btn" onClick={() => handleIsImportXml(false)}>Cancel</button>
                                        {/* {(!savedDocument.every(item => item.isUpload == true)) &&
                                            <button className="btn theme-btn" onClick={() => funFileUpload()}>
                                                {savedDocument.every(item => item.isUpload == true) ? "Import" : 'Upload'}
                                            </button>
                                        } */}
                                        {savedDocument.every((item) => item.isUpload == true && item.isImport == true) ? <></> :
                                            <button className="theme-btn" onClick={() => funFileUpload()}>
                                                {savedDocument.every(item => item?.isUpload == true) ? "Import" : 'Upload'}
                                            </button>
                                        }

                                    </div>
                                </>}
                            </div>
                        </div>
                    </>
                </Modal.Body>
            </Modal>
        </>
    )
}
function checkisLoading(list) {
    if (list.length == 0) return false;
    return !list.every((item) => item.isLoading != true)
}

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect("", mapDispatchToProps)(UploadImportXml);
