import React, { useEffect, useState } from 'react'

import { Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';

import { $postServiceFn } from '../../network/Service'
import { SET_LOADER } from '../../Store/Actions/action';
import konsole from '../../control/Konsole';

import FileUpload from './FileUpload';
import AlertToaster from '../../control/AlertToaster';



const BulkRegistration = (props) => {


  konsole.log("props", props)
  const [fileList, setFileList] = useState()
  const [FileText, setFileText] = useState("")
  const [same, setSame] = useState('')
  const [uploadedby, setuploadedBy] = useState()


  konsole.log("filelist", fileList)
  useEffect(() => {
    let uploadedBy = sessionStorage.getItem("loggedUserId")
    konsole.log("uploadedBy", uploadedBy)
    setuploadedBy(uploadedBy)
  }, [])


  const handleBulkUpload = () => {

    if(fileList !== undefined && fileList !== null && fileList !== ""){
      props.dispatchloader(true)
      $postServiceFn.postbulkfileupload(fileList, uploadedby, (response, errorData) => {
        props.dispatchloader(false)
        if (response) {
          AlertToaster.success("File Uploaded Successfully")
  
          konsole.log("responseresponse", response)
          props.callapidata()
  
          calldownloadexcelfile(response)
  
          // props.handlebulkregistration()
  
        } else if (errorData) {
          // alert(errorData);
          konsole.log("errorData", errorData)
          AlertToaster.error(errorData?.data?.errors?.file[0])
          props.dispatchloader(false)
          // props.handlebulkregistration()
        }
      })
    }else{
      AlertToaster.error("Please select a file")
    }
    
  }


  const calldownloadexcelfile = (data) => {
    props.dispatchloader(true)
    let responsedata = data?.data?.data;
    // console.log("responsedata",responsedata.fileDetails?.fileDataToByteArray)
    // const ArrayByteString=responsedata?.fileDetails?.fileDataToByteArray;
    const ArrayByteString = `data:image/png;base64,`.concat(
      responsedata?.fileDetails?.fileDataToByteArray
    );
    var a = document.createElement("a"); //Create <a>
    a.href = ArrayByteString; //Image Base64 Goes here
    a.download = responsedata?.fileDetails?.fileName; //File name Here
    a.click(); //Downloaded file
    props.dispatchloader(false)
    props.handlebulkregistration()

  }


  return (
    <Modal show={props.bulkopen} onHide={props.handlebulkregistration} backdrop="static" animation="false" variant="white" >

      <Modal.Header closeButton style={{ border: "none" }} closeVariant="white" >
        <Modal.Title>Upload  File </Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <div className='body-BULK-register'>
          <div className="box-BULK-register">
            <h3 className="header-BULK-register">
              Drag and Drop your Files
            </h3>
            {/* <FileUpload setFileText={setFileText} setFileList={setFileList} fileList={fileList}/> */}
            <FileUpload setFileText={setFileText} setFileList={setFileList} fileList={fileList} />

          </div>
        </div>

      </Modal.Body>
      <Modal.Footer style={{ display: "flex", justifyContent: "center" }}>

        <Button style={{ backgroundColor: '#720c20',border:"none" }} onClick={handleBulkUpload}>
          Upload
        </Button>

      </Modal.Footer>
    </Modal>
  )
}

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect("", mapDispatchToProps)(BulkRegistration)
