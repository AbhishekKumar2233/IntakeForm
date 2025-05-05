import React, { useState } from 'react'
import { Document, Page, pdfjs } from "react-pdf";
// import 'react-pdf/dist/esm/Page/TextLayer.css';
import { connect } from 'react-redux';
import { SET_LOADER } from '../Store/Actions/action';
import { $Service_Url } from '../network/UrlPath';
import { $CommonServiceFn } from '../network/Service';
import konsole from '../control/Konsole';
import { Modal } from 'react-bootstrap';

const PdfViewer2 = (props) => {

  const fileData = props?.uploadFileData;

  const [numPages, setNumPages] = useState(null);
  const [openfile, setopenfile] = useState(false)
  const [fileBase64, setfileBase64] = useState()

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }

  const viewPdfFile = () => {
    if (fileData !== undefined && Object.entries(props.uploadFileData).length > 0) {
      let data = 'data:application/pdf;base64,' + fileData.fileInfo.fileDataToByteArray;
      setfileBase64(data)
      setopenfile(true)
    }
    else{
      props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getfileUploadDocuments + props?.viewFileId + "/1", "", (response) => {
        if (response) {
          // konsole.log("responseresponse",response)
          let fileDocObj = response.data.data;
          let data = 'data:application/pdf;base64,' + fileDocObj.fileInfo.fileDataToByteArray;
          setfileBase64(data)
          setopenfile(true)
          props.dispatchloader(false);

        } else {
          props.dispatchloader(false);
        }
      })
    }
  }
  console.log("fileBase64fileBase64", fileBase64)


  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  return (
    <div>
      <button type="button" className="btn btn-secondary viewFile " style={{marginLeft:"15px",width:"65px" }} onClick={viewPdfFile}>View</button>

      <Modal
        show={openfile}
        size="lg"
        centered
        onHide={() => setopenfile(false)}
        animation="false"
        className='mt-5'
        backdrop="static"
      >
        <Modal.Header closeButton closeVariant="white" className=''>
          <Modal.Title>Pdf view</Modal.Title>
        </Modal.Header>
        <Modal.Body className="position-relative  mt-2 mb-5" style={{ height: "520px", "overflow-y": "scroll" }}>
          <Document
            // className="outer-doc"
            style={{ height: "500px" }}
            file={fileBase64} onLoadSuccess={onDocumentLoadSuccess} onContextMenu={(e) => e.preventDefault()}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page 
              key={`page_${index + 1}`} 
              pageNumber={index + 1} 
              renderTextLayer={false}
              renderAnnotationLayer={false}
              customTextRenderer={false}
              />
            ))}
          </Document>
        </Modal.Body>
      </Modal>




    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({
      type: SET_LOADER,
      payload: loader,
    }),
});

export default connect("", mapDispatchToProps)(PdfViewer2);
