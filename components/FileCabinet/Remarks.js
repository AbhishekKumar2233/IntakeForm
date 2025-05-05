import React, { useContext, useEffect, useState} from "react";

import { Button, Modal, Table, Form, Tab, Row, Col } from "react-bootstrap";
import konsole from "../control/Konsole";
import { $CommonServiceFn } from "../network/Service";
import { $Service_Url } from "../network/UrlPath";
import { $AHelper} from '../control/AHelper';
import { connect } from "react-redux";
import { SET_LOADER } from "../Store/Actions/action";
import {globalContext} from "../../pages/_app"



const Remarks = (props) => {
  const{setdata} = useContext(globalContext)

  const primaryUserId = sessionStorage.getItem("SessPrimaryUserId") || "";
  const loggedInUser = sessionStorage.getItem("loggedUserId") || "";
  const [ remarks, setRemarks] = useState('');
  const [ remarksList, setRemarksList] = useState([]);
  const [ isUpdate, setIsUpdate ] = useState(false);
  const [selectedRemark, setSelectedRemarks ] = useState({});


  useEffect(() => {
    getFileCabinetRemarks();
  }, [])

  const getFileCabinetRemarks = () => {
    const postData = {
      userId: primaryUserId,
      fileCategoryId: props?.fileCabinetId,
      fileTypeId: props?.fileTypeId,
      fileId: props?.fileId,
      remarks: remarks,
      createdBy: loggedInUser
    }
    konsole.log("postData at remarks", postData);
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getFileCabinetRemarksPath, postData, (response) => {
      if (response) {
        props.dispatchloader(false);
        let res = response.data.data;
        konsole.log("get at file cabinet remarks", res);
        if(res.fileCabinets.length > 0){
          let fileCabinets = res.fileCabinets[0].fileTypes[0].fileRemarks;
          setRemarksList(fileCabinets);
        }
      }
    })
  }





  const handleChange=(e)=>{
    let value = e.target.value;
    setRemarks(value);
  }

  const handleRemarksSubmit = () => {
    if(remarks == ''){
      toasterAlert("remarks cannot be empty.");
    }
    const postData = {
      userId: primaryUserId,
      fileCategoryId: props?.fileCabinetId,
      fileTypeId: props?.fileTypeId,
      fileId: props?.fileId,
      remarks: remarks,
    }
    let method = 'POST'
    let url = $Service_Url.postFileCabinetRemarksPath;

    if(isUpdate == false){
      postData["createdBy"] = loggedInUser;
    }
    else{
      method = "PUT"
      url = $Service_Url.putFileCabinetRemarksPath;
      postData["updatedBy"] = loggedInUser;
      postData['fileRemarkId'] = selectedRemark.fileRemarkId;
    }

    konsole.log("saved remarks data", postData);
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi( method, url, postData, (response) => {
      if (response) {
        props.dispatchloader(false);
        getFileCabinetRemarks();
        konsole.log("res at file cabinet remarks", response.data.data);
        props.handleClose();
      } 
    })
  }

  const handleRemarksForUpdate = (SelectedRemarkObj) => {
    setRemarks(SelectedRemarkObj.fileRemark);
    setSelectedRemarks(SelectedRemarkObj);
    setIsUpdate(true);

    konsole.log("selected Remarks obj", SelectedRemarkObj);
  }

    const tableMap = remarksList.length > 0 && remarksList.map((mapRemark, index)=>{
      return(
        <tr className="cursor-pointer" key={index} onClick={() => handleRemarksForUpdate(mapRemark)}>
          <td>{index + 1}</td>
          <td className="text-start text-truncate w-75" style={{maxWidth: '400px'}}>{mapRemark.fileRemark}</td>
          <td>{$AHelper.getFormattedDate(mapRemark.createdOn)}</td>
        </tr>
      )
    })

   function toasterAlert(text,type) {
     setdata({open:true,
        text:text,
        type:type})
    }
  


    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.5 !important;
          }
        `}</style>

        <Modal show={props.show} size="lg" centered onHide={props.handleClose} animation="false" id="remarksId" backdrop="static">
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title >Remarks</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-5 pt-4">
              <div className="m-2">
                <h3>Describe</h3> 
                <Form.Control className="" as="textarea" rows={3} value={remarks} onChange={(e)=>handleChange(e)}  />
              </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button className="theme-btn" onClick={handleRemarksSubmit}>
              {
                (!isUpdate) ? "Submit" : 'Update'
              }
            </Button>
            <Button className="theme-btn" onClick={props.handleClose} >
              Cancel
            </Button>
            {
              remarksList.length > 0 && 
            <Table striped bordered className="text-center" size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="text-start w-75">Remarks</th>
                  <th className="">Date</th>
                </tr>
              </thead>
              <tbody>
                {tableMap}
              </tbody>
            </Table>
            }
          </Modal.Footer>
        </Modal>
      </>
    );
  
}

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({
    type: SET_LOADER,
    payload: loader
  }),
});

export default connect('', mapDispatchToProps)(Remarks);