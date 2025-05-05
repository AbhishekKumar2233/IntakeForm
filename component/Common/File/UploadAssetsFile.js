// src/components/UploadComponent.js
import React, { useState, useRef, useMemo, useImperativeHandle, forwardRef, useEffect, useContext } from 'react';
import { Form, Row, ProgressBar, Col, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import konsole from '../../../components/control/Konsole';
import { $AHelper } from '../../Helper/$AHelper';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { $ApiHelper } from '../../Helper/$ApiHelper';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { postApiCall } from '../../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../../components/network/UrlPath';
import UploadedFileView from './UploadedFileView';
import { globalContext } from '../../../pages/_app';

const tableHeader = ['File name', 'Type', "Uploaded on", 'View/Delete']

const UploadAssetsFile = forwardRef((props, ref) => {

    const { refrencePage, savedDocuments, details } = props;
    konsole.log("rreere", props, ref)

    const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)

    const { primaryUserId, loggedInUserId } = usePrimaryUserId()
    // define state
    const [fileInformation, setFileInformation] = useState(null)
    const [isFileDelete, setIsFileDelete] = useState(false);
    const [viewFileInfo, setViewFileInfo] = useState('')
    // ref define
    const inputFileRef = useRef(null);
    const startingTabIndex = props?.startTabIndex ?? 0;



    // define use Imperative Handle;
    useImperativeHandle(ref, () => ({
        saveUploadUserDocument, saveNAddAnother
    }))

    const handleDragOver = (e) => {
        e.preventDefault(); // Prevent default behavior to allow drop
    }

    // @@ Create file upload json
    const returnFileObj = ({ file, name, size }) => {
        return { document: file, name: name, isChecked: true, size: size, percentage: 100 }
    }

    // @@ Handle File Select
    async function handleFileChange(e, isDroped) {
        konsole.log("erwer", e)
        if(isDroped) e.preventDefault();
        const files = isDroped ? e.dataTransfer.files : e.target.files;
        if (files.length > 0) {
            let typeOfFile = files[0].type;
            let typeOfSize = files[0].size;
            if (typeOfFile !== "application/pdf") {
                toasterAlert("warning", "Warning", 'Only pdf format allowed.');
                inputFileRef.current.value = ''
                return;
            }
            // Non-Retirement

            if ($AHelper.$fileUploadMaxSize(typeOfSize)) {
                toasterAlert("warning", "Warning", "File is too large, file size should be 100MB.");
                inputFileRef.current.value = ''
                return;
            }
            setFileInformation([returnFileObj({ file: files[0], name: files[0].name, size: $AHelper.$fileSizeConvertInKb(typeOfSize) })])
            e.target.value = '';
            updateIsApiCall(true);
        }

        konsole.log("filesfiles", files)
    }

const updateIsApiCall=()=>{
    if(refrencePage == 'Health Insurance'){
        props?.setIsApiCall(true);
    }
}

    // @@ return category ,file type and status id
    const fileTypeCategoryObj = useMemo(() => {
        let FileCategoryId = null;
        let FileTypeId = null;
        let FileStatusId = 2;
        if (refrencePage == 'Non-Retirement') {
            FileCategoryId = 5;
            FileTypeId = 10;
        }
        else if (refrencePage == 'Retirement') {
            FileCategoryId = 5;
            FileTypeId = 11;
        }
        else if (refrencePage == 'Health Insurance') {
            FileCategoryId = 3;
            FileTypeId = 9;
        }
        else if (refrencePage == 'LongTermCarePolicy') {
            FileCategoryId = 5;
            FileTypeId = 13;
        }
        else if (refrencePage == 'lifeinsurance') {
            FileTypeId = 12;
            FileCategoryId = 5;

        }
        else if (refrencePage == "Business Interests") {
            FileCategoryId = 5;
            FileTypeId = 14;
        }
        else if (refrencePage == "Transport Assets") {
            FileCategoryId = 5;
            FileTypeId = 11;
        }

        else if (refrencePage == "Tax Information") {
            FileCategoryId = 5;
            FileTypeId = 65;
        }

        return { FileCategoryId, FileTypeId, FileStatusId }

    }, [refrencePage])




    // @@ save & add another

    const saveNAddAnother = () => {
        return new Promise((resolve, reject) => {
            setIsFileDelete(false);
            setFileInformation(null);
            setViewFileInfo('');
            resolve('res')
        })

    }



    konsole.log("detailsincome", details)
    // @@ Upload user document
    const saveUploadUserDocument = async (UserId) => {

        return new Promise(async (resolve, reject) => {

            if (isFileDelete == true && !$AHelper.$isNotNullUndefine(fileInformation)) {
                saveNAddAnother()
                resolve('file-delete')
            }

            if (fileInformation?.length > 0) {
                const jsonObj = $JsonHelper.createUploadUserDocument({
                    File: fileInformation[0].document,
                    UploadedBy: loggedInUserId,
                    UserFileName: fileInformation[0].name,
                    UserId: UserId,
                    ...fileTypeCategoryObj
                });

                konsole.log("jsonObj", jsonObj)
                const formDataJson = $AHelper.$appendFormData(jsonObj);
                konsole.log("formDataJson", formDataJson)
                const _resultOf = await postApiCall('POST', $Service_Url.postUploadUserDocumentVersion2, formDataJson)
                konsole.log("_resultOfUploadUserDocumnt", _resultOf);
                if (_resultOf == 'err') {
                    saveNAddAnother()
                    resolve('no-file')
                }
                const responseData = _resultOf?.data?.data;
                resolve(responseData)

            } else {
                saveNAddAnother()
                resolve('no-file')
            }
        })

    }


    const handleViewFileInfo = (val) => {
        setViewFileInfo(val)
    }


    const handleFileDelete = async () => {
        const confirmRes = await newConfirm(true, `Are you sure you want to delete this document? This action cannot be undone.`, "Confirmation", "Delete Document", 2);
        konsole.log("confirmRes", confirmRes);
        if (!confirmRes) return;
        setIsFileDelete(true);
        toasterAlert("deletedSuccessfully", `Document has been deleted successfully.`);
        updateIsApiCall()
    }

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }

    const removeUploadedDoc = (data) =>{
        const removeDoc = fileInformation.filter(item => item.name !== data.name)
        setFileInformation(removeDoc)
        inputFileRef.current.value = '';
        updateIsApiCall()
    }
    // konsole.log
    konsole.log("fileInformation", fileInformation);
    konsole.log("savedDocuments", savedDocuments, "1212");
    konsole.log("viewfileinfo", viewFileInfo)

    const handleKeyPress = (e) => {
        if (e.key == "Enter") {
          inputFileRef.current.click();
        }
      }
    return (
        <>

            {/* @@ Upload file  UI */}
            <Row className='mb-3 mt-3' id='container-file-upload'>
                {/* <span className='heading-of-sub-side-links ' style={{ fontSize: "20px" }}> {details?.heading} </span> */}
                {(isFileDelete == true || savedDocuments?.length == 0) &&
                    <Col>
                        <div className='upload-component-file p-4' onClick={() => inputFileRef.current.click()}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleFileChange(e, true)}
                        >
                            <Row>
                                <Col xs={10} md={10} >
                                    <Row className='d-flex justify-content-center align-items-center ms-5'>
                                        <input type="file" className="d-none" ref={inputFileRef} onChange={handleFileChange} />
                                        <div tabIndex={startingTabIndex + 1}   onKeyDown={handleKeyPress}  className='Image'>
                                            <img src='/New/icons/upload-file-icon.svg' />
                                        </div>
                                    </Row>

                                    <Row className='d-flex justify-content-center align-items-center mb-1 ms-5'>
                                        <div className='upload-heaing'>
                                            Click to upload your file   <span> or drag and drop <br /> <span>PDF file (Max 100MB each)</span></span>
                                        </div>
                                    </Row>
                                </Col>
                                <Col xs={2} md={2}>
                                    <div class="file-icon-upload h-100">
                                        <img src="/New/icons/upload-pdf-icon.svg" alt="PDF Icon" />
                                    </div>
                                </Col>
                            </Row>

                        </div>
                    </Col>
                }
            </Row>

            {/* @@ Upload file UI  */}


            {/* @@ Display selected file with progress bae */}

            {(fileInformation?.length > 0) && <> {
                fileInformation?.map((item, index) => {
                    return <>
                        <Row>
                            <Col id='containet-file-display'>
                                <div className='upload-file-display-container'>

                                    <div class="upload-file-display">
                                        <>
                                            <div class="file-info">
                                                <div class="file-icon">
                                                    <img src='/New/icons/upload-pdf-icon.svg' alt="PDF Icon" />
                                                </div>

                                                <div class="file-details">
                                                    <div class="file-name">{item?.name}</div>
                                                    <div class="file-size"> {item?.size} KB</div>
                                                </div>

                                            </div>
                                            {/* <div class="file-details">
                                                <div class="file-name">Financial Assets.pdf</div>
                                                <div class="file-size">200 KB</div>
                                            </div> */}
                                        </>
                                    <div style={{height:"19px"}}><img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer" onClick={()=>removeUploadedDoc(item)}/></div>
                                    </div>

                                    <div className='upload-file-progress-container mt-1'>
                                        <div className='upload-file-progress-bar'>
                                            <ProgressBar now={item?.percentage} />
                                        </div>
                                        <span className='progress-percent'>{item?.percentage}%</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </>
                })}
            </>}

            {/* @@ Display selected file with progress bar */}


            {/* display already added document */}
            {(savedDocuments?.length > 0 && isFileDelete == false) &&
                <div id="information-table" className="information-table" style={{ border: 'none' }} >
                    <div className='table-responsive fmlyTableScroll'>
                        <Table className="custom-table">
                            <thead className="sticky-header">
                                <tr>
                                    {tableHeader.map((item, index) => (
                                        <th key={index} className=''>{item}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {savedDocuments?.map((item, index) => {
                                    return <>
                                        <tr key={'index'}>
                                            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-disabled" className="custom-tooltip">
                                            <div className='d-flex align-items-center'><span>{details?.heading || "-"}.pdf</span></div></Tooltip>}>
                                            <td><img src="/New/icons/mapPdf.svg" className='me-1' alt="PDF Icon" /><span className='truncateText'>{details?.heading || "-"}.pdf</span></td>
                                            </OverlayTrigger>
                                            <td className=''>{details?.Type || "-"}</td>
                                            <td>{$AHelper.$getFormattedDate(details?.updatedDate) == "Invalid date" ? "-" : $AHelper.$getFormattedDate(details?.updatedDate) || "-"}</td>
                                            <td className=''>
                                                <div className="d-flex">
                                                    <img src="/New/icons/file-eye-view.svg" alt="View Icon" className="icon cursor-pointer me-3" onClick={() => handleViewFileInfo(item)} />
                                                    <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer" onClick={() => handleFileDelete()} />
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                })}

                            </tbody>
                        </Table>
                    </div>
                </div>
            }
            {/* display already added document */}

            {/* @@ display File in File View */}
            {($AHelper.$isNotNullUndefine(viewFileInfo) && $AHelper.$isNotNullUndefine(viewFileInfo?.fileId) || $AHelper.$isNotNullUndefine(viewFileInfo?.docFileId)) &&
                <UploadedFileView
                    refrencePage='UploadAssetsFile'
                    isOpen={true}
                    fileId={viewFileInfo?.fileId || viewFileInfo?.docFileId}
                    handleViewFileInfo={handleViewFileInfo}
                    fileDetails={{ name: `${refrencePage} - ${details?.Type}` }}

                />
            }
            {/* @@ display File in File View */}

        </>
    );
});




export default UploadAssetsFile;
