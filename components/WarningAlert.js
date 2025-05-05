import React from 'react'
import { Modal } from 'react-bootstrap'

const WarningAlert = (props) => {
    return (
        <div>
              <Modal
                show={props?.showModal}
                centered={true} 
                size="md"
                onHide={() => props?.setShowModal(false)}
                backdrop="static"
                className="newModal"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px"}} >
                <Modal.Header className="text-white" closeVariant="white" closeButton>
                <Modal.Title className='mt-2' id="example-modal-sizes-title-lg">
                      <div style={{width:"33rem"}}><h3 className='heading text-center' >{props?.header}</h3></div>
                        
                    </Modal.Title>   
                </Modal.Header>
                <Modal.Body className="rounded">
                <h3 className='SelectOptionsh4Tag mb-2 mt-3 text-center'>
                 {props?.msg}
                    </h3>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default WarningAlert