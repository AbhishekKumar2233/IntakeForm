import React, { useEffect, useState } from 'react'
import PdfViwer from '../PdfViwer/PdfViwer';
import { Col, Collapse, Row } from 'react-bootstrap'; 
import { $CommonServiceFn } from '../network/Service';
import { $Service_Url } from '../network/UrlPath';
import konsole from '../control/Konsole';
import { connect } from 'react-redux';
import { SET_LOADER } from '../Store/Actions/action';

const Cabinet = (props) => {
  const fileCabinetType = props.fileCabinetType ?? {};
  const primaryUserId = sessionStorage.getItem("SessPrimaryUserId")
  // const [collapse, setCollapse] = useState(true);
  const [cabinetFiles, setCabinetFiles] = useState([]);
  const [selectFiles, setSelectedFiles] = useState(null);
  const [selectFileTypeIndex, setSelectedFileTypeIndex] = useState(null);

  useEffect(() => {
    getDocumentByFileCabinetCategoryId();
  }, [fileCabinetType])



  const getDocumentByFileCabinetCategoryId = () => {
    const postData = {
      userId: primaryUserId,
      fileCabinetId: fileCabinetType.value
    }
    konsole.log("fileDocObj", postData);
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postFileDocumentCabinetById, postData, (response, error,final) => {
      if (response) {
        props.dispatchloader(false);
        let fileDocObj = response.data.data;
        if(fileDocObj.cabinetFiles.length !== 0){
          konsole.log("fileDocObj", fileDocObj);
          setCabinetFiles(fileDocObj.cabinetFiles);
        }
        else{
          setCabinetFiles([]);
        }
      }
      else if(error){
        props.dispatchloader(false);
        setCabinetFiles([]);
      }
      else if (final) {
        props.dispatchloader(false);
      }
    })
  }


  const handleCollapse = () => {
    setCollapse(!collapse);
  }


  const handleListSelection = (fileTypeIndex, files) => {
    setSelectedFiles(files);
    setSelectedFileTypeIndex(fileTypeIndex);
    konsole.log("index", files);
  }


  const mapFilesUnderFileType = (files,fileTypeIndex) => {
    return(
        <>
        {
          files.length > 0 && files.map((file, index) =>
            <li className='my-2 ms-4'><span className='cursor-pointer text-decoration-underline' onClick={() => handleListSelection  (fileTypeIndex, file)}>{file.fileStatusName + " - " + file.fileDisplayName}</span>
            </li>
          )}
        </>
    )
  }

  const mapFileTypename = cabinetFiles.length > 0 && cabinetFiles[0].fileTypes.map((fileType, index)=>{
    return(
      <li className='mt-2' key={index}>
        {/* <span onClick={handleCollapse} aria-expanded={open}
          aria-controls={`collapseId${index}`}> collapse</span> */}
          <h5><span className='text-decoration-underline'>{fileType.fileTypeName}</span> </h5>
        {/* <Collapse in={collapse}>
          <div id={`collapseId${index}`}
            style={{
              width: 300,
              textAlign: 'justify'
            }}> */}
        {
          fileType.currentFiles.length > 0 &&
          <ul className='list-unstyled ms-4 pt-2'>
              <li className='text-decoration-underline fw-bold'>Current Files</li>
            {mapFilesUnderFileType(fileType.currentFiles, index)}
          </ul>
        }
        {
          fileType.archiveFiles.length > 0 &&
          <ul className='list-unstyled ms-4'>
              <li className='text-decoration-underline fw-bold'>Archive Files</li>
            {mapFilesUnderFileType(fileType.archiveFiles, index)}
          </ul>
        }
          {/* </div> */}
        {/* </Collapse> */}
      </li>
    )
  })

  return (
    <div className='container-fluid p-0'>
      <Row className='row ms-1 p-0'>
        <Col xs={3} className="p-0" id='fileCabinetList'>
              <h4 className='ms-1 '><img className='me-2' src={fileCabinetType?.imageUrl} />{fileCabinetType?.label}</h4>
              {/* <h5 className='mt-3 mb-2'> <span className='border-bottom border-2 border-secondary'>Assessment Letter</span></h5> */}
              < ul className = 'd-flex flex-column p-0 ms-5 list-unstyled' >
                {mapFileTypename}
              </ul>
        </Col>
        <Col xs={9} id="fileCabinetPdfView">
          <div>
            {
              (cabinetFiles.length > 0 && selectFiles !== null && selectFileTypeIndex !== null) ?
              <PdfViwer cabinetFiles={cabinetFiles} selectFileTypeIndex={selectFileTypeIndex} selectFiles={selectFiles} />:
              <></>
            }
          </div>
        </Col>
      </Row>
    </div>
  );
};


const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({
    type: SET_LOADER,
    payload: loader
  }),
});

export default connect('', mapDispatchToProps)(Cabinet);