import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Remarks from '../FileCabinet/Remarks';
import { Document, Page, pdfjs } from "react-pdf";
import { $CommonServiceFn } from '../network/Service';
import { $Service_Url } from '../network/UrlPath';
import konsole from '../control/Konsole';
import { connect } from 'react-redux';
import { SET_LOADER } from '../Store/Actions/action';
import { $AHelper } from "../control/AHelper";
import PdfDocumentViewer from '../PdfDocumentViewer';
import { globalContext } from "../../pages/_app";



const PdfViwer = ({doctypeName, setDoctypeName, ...props }) => {
  const context = useContext(globalContext)
  const loginUserId = sessionStorage.getItem('SessPrimaryUserId');
  const [show, setshow] = useState(false);
  const [base64data, setBase64Data] = useState(false);
  const pdfViewRef = useRef();
  
  // konsole.log("selectedId",selectedFiles);

  useEffect(()=>{
    if(doctypeName?.fileId !== undefined){
      if(doctypeName?.fileId !== undefined && doctypeName?.fileStatusId !== undefined) {
      getBinaryFilesFromUpload();
      }
    }
  }, [doctypeName?.fileId]);


  useLayoutEffect(() => {
    if(!pdfViewRef.current) return;
    konsole.log("prinet", document.getElementById("fileCabinetContainer").clientHeight);
    pdfViewRef.current.style.height = `calc(${`${document.getElementById("fileCabinetContainer").clientHeight}px - 13rem`})`
    pdfViewRef.current.style.overflowY = "hidden"
    
  }, [pdfViewRef.current]);



  const toasterAlert =(test, type) =>{
    context.setdata($AHelper.toasterValueFucntion(true, test, type))
  }

  const getBinaryFilesFromUpload = () =>  {
    const getPost = {
        userId: loginUserId,
        fileId: doctypeName?.fileId,
        fileTypeId: doctypeName?.fileTypeId,
        fileStatusId: doctypeName?.fileStatusId,
        fileCategoryId: doctypeName?.fileCategoryId,
        requestedBy: loginUserId,
    }
    konsole.log("post Data at pdf", JSON.stringify(getPost))
    // props.dispatchloader(true);
    
      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.postDownloadUserDocument + `/${loginUserId}/${doctypeName?.fileId}/${doctypeName?.fileTypeId}/${doctypeName?.fileCategoryId}/${loginUserId}`, '', (response) => {
        // props.dispatchloader(false);
        if (response) {
          let fileDocObj = response.data.data;
          let data = 'data:application/pdf;base64,' + fileDocObj.fileInfo.fileDataToByteArray;
          setBase64Data(data);
          konsole.log("response ar pdfView", fileDocObj);
        }
      })
  }
  
  const onDocumentLoadSuccess = ({ numPages }) =>{
    setNumPages(numPages);
  }
  
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


  const addWidth = (e) => {
    e.preventDefault();
    let menuBar = document.getElementById("fileCabinetList");
    let currentWidth = document.getElementById("fileCabinetPdfView");
    let ZoomOut = document.getElementById("zoomOut")
    let zoonIn = document.getElementById("zoom-In")
      currentWidth.classList.add('col-sm-12');
      currentWidth.classList.remove('col-sm-8');
      menuBar.classList.add('d-none');
      ZoomOut.classList.remove('d-none');
      zoonIn.classList.add('d-none');

  }
  const removeWidth = (e) => {
    e.preventDefault();
    let menuBar = document.getElementById("fileCabinetList");
    let currentWidth = document.getElementById("fileCabinetPdfView");
    let ZoomOut = document.getElementById("zoomOut")
    let zoonIn = document.getElementById("zoom-In")
    
    currentWidth.classList.remove('col-sm-12');
    currentWidth.classList.add('col-sm-9');
    menuBar.classList.remove('d-none');
    ZoomOut.classList.add('d-none');
    zoonIn.classList.remove('d-none');
  
  }


  const handleShowRemarks = () => {
    setshow(!show);
   };

  const handleDeleteFile = async() => {
    const fileObj = doctypeName;
    let loggeduserId = sessionStorage.getItem("loggedUserId")

    let jsonobj = {
      "userId": fileObj.primaryUserId,
      "fileCabinetId": fileObj.fileCategoryId,
      "fileTypeId": fileObj.fileTypeId,
      "fileId": fileObj.fileId,
      "deletedBy": loggeduserId
    }
    konsole.log("jsonobjDeletefile",JSON.stringify(jsonobj), doctypeName);
    props.dispatchloader(true);
    let ques = await context.confirm(true, "Are you sure? You want to delete this file.", "Confirmation")
    if (ques) {
      $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteFileCabinetFileByFileId, jsonobj,(res,err)=>{
        props.dispatchloader(false);
        if(res){
          konsole.log("resfiledelete",res)
          toasterAlert("File deleted succesfully.","Success")
          setDoctypeName()
        }else{
          konsole.log("errrfiledelete",err)
        }
      })
    }
    konsole.log("fileobj delete", fileObj);
  };

  return (

    <div className='container-fluid pdf' id='pdfId'>
      {show && <Remarks show={show} handleClose={handleShowRemarks} fileCabinetId={doctypeName?.fileCategoryId} fileId={doctypeName?.fileId} fileTypeId={doctypeName?.fileTypeId}/>}
      <div id='logo' className='w-100' >
        <div className="container-fluid mt-3 p-0 m-0">
          <div className="side-menu p-0 mx-2 d-flex align-items-center justify-content-between">
            {/* <button className="rounded-circle" type="submit">
              <img src='../images/Group1.png' alt='g1' />
              <p>Text Size</p>
            </button>
            <button className="rounded-circle" type="submit">
              <img src='../images/Group2.png' alt='g2' />
              <p>Pin</p>
            </button>
            <button className=" rounded-circle" type="submit">
              <img src='../images/Group3.png' alt='g3' />
              <p>HighLight</p>
            </button>
            <button className=" rounded-circle" type="submit">
              <img src='../images/Group4.png' alt='g4' />
              <p>BookMark</p>
            </button> */}
            {/* <button className="rounded-circle" id='zoom-In' value={1} type="submit" onClick={addWidth}>
              <img src='/images/Group5.png' alt='g4' />
              <p>Zoom In</p>
            </button>
            <button className="rounded-circle  d-none" id='zoomOut' value={2} type="submit" onClick={removeWidth}>
              <img src='/images/Group6.png' alt='g4' />
              <p>Zoom Out</p>
            </button> */}
            
            <h3 className='mb-3 ms-3'>{doctypeName?.fileStatusName}</h3>
            <div>
              <button className="rounded-circle me-3" id='remark' onClick={handleDeleteFile} >
                <img src='/icons/deleteIcon.svg' alt='g4' />
                <p>Delete</p>
              </button>

              <button className="rounded-circle" id='remark' onClick={handleShowRemarks} >
                <img src='/icons/remarksIcon.svg' alt='g4' />
                <p>Remarks</p>
              </button>  
            </div>            
          </div>
        </div>
      </div>
      {/* <div className="page d-flex">
        <p>1</p><span className='ms-1'>of</span>
        <p>173</p><span className='ms-1'>pages</span>
      </div> */}
      {/* <div className="progress rounded-pill mt-4 ms-2 me-2">
        <div className="progress-bar bg-dark" role="progressbar" aria-valuenow="5" aria-valuemin="0" aria-valuemax="100"></div>

      </div> */}
      <div ref={pdfViewRef}>
        <PdfDocumentViewer fileBase64={base64data}/>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({
    type: SET_LOADER,
    payload: loader
  }),
});

export default connect('', mapDispatchToProps)(PdfViwer);