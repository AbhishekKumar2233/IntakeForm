import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import AlertToaster from '../control/AlertToaster';
import { isNotValidNullUndefile, _$MSG } from '../Reusable/ReusableCom';
const OccurrenceModal = ({ show, commChannelId, onHide, textObj, emailObj, sentMail, isClientPermissions }) => {
    return (
        <>
            <Modal
                show={show}
                size="lg"
                onHide={() => onHide(false)} emailObj
                backdrop="static"
                enforceFocus={false}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px" }}
            >
                <Modal.Header className="text-white" closeVariant="white" closeButton>
                    Preview Send {(commChannelId == 1) ? 'Email' : (commChannelId == 2) ? 'Text' : 'Email & Text'}
                </Modal.Header>
                <Modal.Body className="rounded">

                    <div style={{ minHeight: "60vh", maxHeight: "60vh", height: "100vh", overflowX: "none", overflowY: "scroll" }} className="border">
                        <div className="position-relative" style={{ pointerEvents: "none" }} >
                            {
                                (isNotValidNullUndefile(emailObj)) ?
                                    <>
                                        <h6 className="ps-4 ms-5 mt-3">Email Template</h6>
                                        <div dangerouslySetInnerHTML={{ __html: emailObj }} id="emailtemplate" contentEditable="false" className="p-0 m-0" />
                                    </>
                                    : <></>
                            }
                            <div className="px-5 mb-2">
                                {
                                    (isNotValidNullUndefile(textObj)) ?
                                        <>
                                            <h6 className="mt-3">Text Template</h6>
                                            {(isClientPermissions == true) ?
                                                <div contentEditable="false" id="templateData1" className="border p-2" style={{ padding: "10px 0 30px 0" }}>
                                                    {textObj}
                                                </div> : <> <span className='ms-5 mt-2'>{_$MSG._clientTextPermission}</span></>}
                                        </>
                                        : <></>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="d-grid place-items-center p-4 gap-2">
                        <button style={{ background: "#720c20", color: "white", outline: "none", borderRadius: "5px", border: "2px solid #720C20" }} className="p-1"
                            onClick={() => sentMail()}
                        >
                            Send  {(commChannelId == 1) ? 'Email' : (commChannelId == 2) ? 'Text' : 'Email & Text'}
                        </button>
                        <button style={{ color: "#720c20", background: "white", border: "2px solid #720C20", borderRadius: "5px" }} className="p-1"
                            onClick={() => onHide(false)}
                        > Cancel</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default OccurrenceModal