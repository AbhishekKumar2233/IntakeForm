import React, { useState, useRef, useMemo, useImperativeHandle, forwardRef, useEffect, useContext } from 'react';
import { Form, Row, ProgressBar, Col, Table } from 'react-bootstrap';
import { globalContext } from '../../../pages/_app';
import { $AHelper } from '../../Helper/$AHelper';
import konsole from '../../../components/control/Konsole';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { $Service_Url } from '../../../components/network/UrlPath';
import { postApiCall } from '../../../components/Reusable/ReusableCom';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { selectorLegal } from '../../Redux/Store/selectors';
import { updateCemeteryDocumentDetails, updateHorDocumentDetails } from '../../Redux/Reducers/legalSlice';
import { useLoader } from '../../utils/utils';
import UploadedFileView from '../../Common/File/UploadedFileView';

const tableHeader = ['File name', 'Actions']

const BurialHorDocumentUpload = (props) => {

  const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
  const { loggedInUserId, primaryUserId } = usePrimaryUserId();
  const { details, useFor, FileCategoryId, FileTypeId, FileStatusId } = props;

  const dispatch = useAppDispatch()
  const legalData = useAppSelector(selectorLegal);
  const { horUploadedDocumentDetails, cemeteryUploadedDocumentDetails } = legalData;
  const inputFileRef = useRef(null);

  const [isDelete, setIsDelete] = useState(false)
  const [viewFileInfo, setViewFileInfo] = useState('')

  const documentInformation = useMemo(() => {
    if (useFor == 'HOR') {
      return horUploadedDocumentDetails;
    } else if (useFor == 'Cemetery') {
      return cemeteryUploadedDocumentDetails;
    }
  }, [useFor, horUploadedDocumentDetails, cemeteryUploadedDocumentDetails])


  useEffect(() => {
    if (documentInformation.length == 0 && $AHelper.$isNotNullUndefine((primaryUserId))) {
      fetchUploadedFile()
    }
  }, [documentInformation, primaryUserId])

  const handleViewFileInfo = (val) => {
    setViewFileInfo(val)
  }

  const fetchUploadedFile = async () => {
    const jsonObj = { "userId": primaryUserId, "fileCabinetId": FileCategoryId, "fileTypeId": FileTypeId }
    useLoader(true)
    console.log("jsonObjGetDocument", jsonObj)
    const result = await postApiCall("POST", $Service_Url.postFileDocumentCabinetById, jsonObj);
    useLoader(false)
    if (result != 'err') {
      const responseData = result?.data?.data?.cabinetFiles
      if (responseData.length > 0 && responseData[0].fileTypes.length > 0 && responseData[0].fileTypes[0].currentFiles.length > 0) {
        disptchData(responseData[0].fileTypes[0].currentFiles[0])
      }
    }
  }


  const disptchData = (details) => {
    let dispatchValue = (useFor == 'HOR') ? updateHorDocumentDetails : updateCemeteryDocumentDetails
    dispatch(dispatchValue([details]))
  }

  // @@ Handle File Select
  async function handleFileChange(e) {
    konsole.log("erwer", e)
    const files = e.target.files;
    if (files.length > 0) {
      let typeOfFile = files[0].type;
      let typeOfSize = files[0].size;
      if (typeOfFile !== "application/pdf") {
        alert("only pdf format allowed");
        return;
      }
      // Non-Retirement

      if ($AHelper.$fileUploadMaxSize(typeOfSize)) {
        alert('"File is too large, file size should be 100MB";');
        return;
      }
      const confirmRes = await newConfirm(true, `Are you sure you want to upload this file? `, "Permission", "Confirmation", 3);
      console.log("confirmRes", confirmRes)
      if (confirmRes == true) {
        useLoader(true)
        const jsonObj = $JsonHelper.createUploadUserDocument({ File: files[0], UploadedBy: loggedInUserId, UserFileName: files[0].name, UserId: primaryUserId, FileCategoryId, FileTypeId, FileStatusId, UserFileName: details.heading, });
        console.log("jsonObj", jsonObj)
        const formDataJson = $AHelper.$appendFormData(jsonObj);
        konsole.log("formDataJson", formDataJson)
        const _resultOf = await postApiCall('POST', $Service_Url.postUploadUserDocumentVersion2, formDataJson)
        useLoader(false)
        konsole.log("_resultOfUploadUserDocumnt", _resultOf);
        console.log("jsonObj", jsonObj)
        inputFileRef.current.value = "";
        setIsDelete(false)
        disptchData(_resultOf?.data?.data)
      } else {
        inputFileRef.current.value = "";
      }
      // setFileInformation([returnFileObj({ file: files[0], name: files[0].name, size: $AHelper.$fileSizeConvertInKb(typeOfSize) })])
    }
    konsole.log("filesfiles", files)
  }

  console.log("details", details)
  console.log("documentInformation", documentInformation)
  return (
    <>
      {(documentInformation.length == 0 || isDelete == true) &&
        <Row className='mb-3' id='container-file-upload'>
          <span className='heading-of-sub-side-links ' style={{ fontSize: "20px" }}> {details?.heading} </span>
          <Col>
            <div className='upload-component-file p-4' onClick={() => inputFileRef.current.click()}>
              <Row>
                <Col xs={10} md={10} >
                  <Row className='d-flex justify-content-center align-items-center ms-5'>
                    <input type="file" className="d-none" ref={inputFileRef} onChange={handleFileChange} />
                    <div className='Image'>
                      <img src='/New/icons/upload-file-icon.svg' />
                    </div>
                  </Row>
                  <Row className='d-flex justify-content-center align-items-center mb-1 ms-5'>
                    <div className='upload-heaing'>
                      Click to upload your file   <span> or drag and drop <br /> <span>PDF file (Max 100mb each)</span></span>
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
        </Row>
      }
      {(documentInformation.length > 0 && isDelete == false) && <>
        <div id="information-table" className="information-table" style={{ height: '106px', border: 'none' }} >
          <div className='table-responsive fmlyTableScroll-file'>
            <Table className="custom-table">
              <thead className="sticky-header">
                <tr>
                  {tableHeader.map((item, index) => (
                    <th key={index} className='text-center'>{item}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documentInformation?.map((item, index) => {
                  return <>
                    <tr key={'index'}>
                      <td className='text-center'>{details?.heading}</td>
                      {/* <td>{'roleName'}</td> */}
                      <td className='text-center'>
                        <div className="d-flex justify-content-around">
                          <img src="/New/icons/file-eye-view.svg" alt="View Icon" className="icon cursor-pointer" onClick={() => handleViewFileInfo(item)} />
                          <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer" onClick={() => setIsDelete(true)} />
                        </div>
                      </td>
                    </tr>
                  </>
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </>}

      {($AHelper.$isNotNullUndefine(viewFileInfo) && $AHelper.$isNotNullUndefine(viewFileInfo?.fileId) || $AHelper.$isNotNullUndefine(viewFileInfo?.docFileId)) &&
        <UploadedFileView refrencePage='BurialHorDocumentUpload' isOpen={true} fileId={viewFileInfo?.fileId || viewFileInfo?.docFileId} handleViewFileInfo={handleViewFileInfo} fileDetails={{ name: details?.heading }} />
      }
      {/* @@ display File in File View */}

    </>
  )
}

export default BurialHorDocumentUpload
