import React from 'react'
import { Modal, Button } from 'react-bootstrap';
import { CustomButton, CustomButton2 } from './CustomButton';
const CustomModal = (props) => {
    const { open, handleOpenModal, header, children, size, backClick } = props;
    const refrencePage = props?.refrencePage;
    return (
        <div id='custom-modal-container' className='custom-modal-container' style={{ zIndex: "100000" }}>
            <Modal show={open} size={size} enforceFocus={false} id='custom-modal-container2' className='useNewDesignSCSS' aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header >
                    <div className='row justify-content-between w-100'>
                        {(refrencePage=='InviteSpouse' || refrencePage == 'DeceaseSpecialNeed' ||  refrencePage  =='SetupSidebar') &&
                            <div className='col-1'>
                                <img src="/New/icons/whiteBackArrowIcon.svg" onClick={() => backClick(false)} className='cursor-pointer' />
                            </div>}
                        <div className='col-5'>
                            <p className='warningHeading text-center'>{header}</p>
                        </div>
                        <div className='col-1'>
                            <img src="/New/icons/whiteCrossIcon.svg" className='cursor-pointer' onClick={() => handleOpenModal(false)} />
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>

                    {children}

                </Modal.Body>
                {(refrencePage != 'DeceaseSpecialNeed' && refrencePage  !='SetupSidebar') &&
                    <Modal.Footer>
                        <div className='footer-btn w-100'>
                            <button className='send' onClick={() => handleOpenModal(false)}>Cancel</button>
                            <button className='send' onClick={() => props?.sentBtnClick()}>Send</button>
                        </div>
                        {/* <CustomModal />  */}
                    </Modal.Footer>
                }

            </Modal>

        </div>
    )
}

export default CustomModal;



