import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import konsole from '../../control/Konsole';
import { $CommonServiceFn, $postServiceFn } from "../../../components/network/Service";
import { $Service_Url } from "../../../components/network/UrlPath";
import { SET_LOADER } from "../../../components/Store/Actions/action";
import { connect } from "react-redux";
// import occurrenceId from './Occurance';
import OccuranceCom from './OccuranceCom';
import PdfViewDocument from './PdfViewDocument';
const AnnualAgreementModalFile = (props) => {
  konsole.log("propspropspropsprops", props)
  const clientSubsFileId = props.subsFileId
  const subtenantId = props?.subtenantId
  const subscriptionId = props?.subscriptionId
  //-----------------------------------------------------------
  const [showpdfview, setshowpdfview] = useState(false)







  return (
    <Modal show={props.openAnnualModalFile} onHide={props.openAnnualModalFilefun} animation="false"  aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header closeButton style={{ border: "none" }} closeVariant="white" >
      <Modal.Title >Annual Maintenance Agreement</Modal.Title>
    </Modal.Header>
    <Modal.Body className='p-4 pb-5'>
      <div className='fs-4 my-2 text-center'> Document generated successfully.</div>
      <div className='d-flex mb-2 justify-content-around gap-2 flex-wrap align-items-center'>
        <PdfViewDocument viewFileId={clientSubsFileId} buttonName="Download"/>
        <OccuranceCom occuranceId={19} subtenantId={props?.subtenantId} subscriptionId={props?.subscriptionId} clientData={props.clientData} />
        {/* {/ <Button className="theme-btn" onClick={() => props.openAnnualModalFilefun()} >Cancel</Button> /} */}
      </div>
    </Modal.Body>

    {/* <Modal.Footer>
          <div className='d-flex justify-content-around'>
          <Button className="theme-btn" >View Document</Button>
          <Button className="theme-btn" >Send email to client</Button>
          <Button className="theme-btn" onClick={()=>props.openAnnualModalFilefun()} >Cancel</Button>
          </div>
          </Modal.Footer>
           */}
    {(showpdfview == true) ?
      <PdfViewer2 viewFileId={clientSubsFileId} /> : ""}
  </Modal>
  )
}

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader })
});

export default connect(mapStateToProps, mapDispatchToProps)(AnnualAgreementModalFile)