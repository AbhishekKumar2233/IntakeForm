import { connect } from 'react-redux'
import { Modal, Row, Col, Form, Button } from 'react-bootstrap'
import React, { useState, useEffect, useContext, useRef } from 'react'
import DateCalendar from './DateCalendar'

const HelpCenter = () => {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isNeedTechSupport, setIsNeedTechSupport] = useState(false)
    const [disabled, setDisabled] = useState("")

    const handleClose = () => {
        handleCancelNeedSuport()
        setIsOpenModal(false);
    }
    const handleCancelNeedSuport = () => {
        setIsNeedTechSupport(false)
        setIsOpenModal(false)
    }

    
    return (
        <>
            <style jsx global>{`
        .modal-open .modal-backdrop.show {
          opacity: 0.5 !important;
        }
      `}</style>
            <div className="d-grid gap-" style={{ zIndex: "999999999999999999999999999999999999" }}>
                <div className={`positionHelpCenterButton helpCenter-cls ${disabled}`}>
                    <ul className="help_center_Img_mainDiv">
                        <button className='help_center_needhelp_btn' onClick={() => setIsOpenModal(true)}>Need help</button>
                        <img src="icons/help_center_icon.svg" className='help_center_feedback cursor-pointer' onClick={() => setIsOpenModal(true)} />
                    </ul>
                </div>
            </div>
            <>

                <Modal show={isOpenModal} size="lg" centered onHide={() => handleClose()} animation="false" 
            backdrop="static">
                    <Modal.Header closeButton closeVariant="white">
                        <Modal.Title>Need Help</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='help_center ' id="helpCenterMainModal" >
                            <div className='d-flex flex-wrap align-items-center'>
                            <h5 className=" generate-pdf-main-color">Please download Team Viewer and allow expert to assist.</h5>
                            <a style={{color:"blue"}} href='https://www.teamviewer.com/download/' target='_blank' className='fs-5 ms-2 text-decoration-underline'>Download Team Viewer
                            <img className='ms-2 mt-0' style={{width:"22px", height:"auto"}} src='/images/helpImg.png'/></a>
                            </div>
                            {/* {(isNeedTechSupport == false) ? <>
                                <div className='text-center mt-2'>
                                    <Button style={{ backgroundColor: "#76272b", border: "none" }} className="theme-btn ms-1 mt-2" onClick={() => setIsNeedTechSupport(true)}>Need Assistance</Button>
                                </div>
                            </> : <> */}
                                <div className='m-4'>
                                    <DateCalendar minDate={1} maxDate={5} isWeakEndDisabled={true} handleClose={handleCancelNeedSuport} />
                                </div>
                            {/* </>} */}
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        </>
    )
}

export default HelpCenter