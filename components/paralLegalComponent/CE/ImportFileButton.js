import React, { useEffect, useRef, useState, useContext } from "react";
import { Col, Form, Modal, Row, Table, Button, Spinner, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { getApiCall, isNotValidNullUndefile } from "../../Reusable/ReusableCom";
import { $Service_Url } from "../../network/UrlPath";
import konsole from "../../control/Konsole";
import UploadImportXml from "./UploadImportXml";

const ImportFileButton = ({ callhandleSearch }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [enumFileTypeList, setEnumFileTypeList] = useState([])
    const [selectFileDocType, setSelectFileDocType] = useState('');

    const [isImportXml, setIsImportXml] = useState(false);

    useEffect(() => {
        fetchApi();
    }, [])


    const fetchApi = async () => {
        const _resiltEnumTypeValue = await getApiCall('GET', $Service_Url.getEnumValuesType, setEnumFileTypeList)
        konsole.log("_resiltEnumTypeValue", _resiltEnumTypeValue)
    }

    const handleModalOpen = (value) => {
        setIsModalOpen(value)
        setIsImportXml(false)
        if (value == false) {
            handleSelectFileType('')
        }
    }
    const handleSelectFileType = (val) => {
        setSelectFileDocType(val)
    }


    konsole.log("enumFileTypeList", enumFileTypeList)
    konsole.log("isImportXml",isImportXml)
    return (
        <>
            <style jsx global>{` .modal-open .modal-backdrop.show {    opacity: 0;  }  `}</style>

            {/* {isNotValidNullUndefile(selectFileDocType) && */}
            
            {isImportXml && 
            <UploadImportXml
                callhandleSearch={callhandleSearch}
                selectFileDocType={selectFileDocType}
                isImportXml={isImportXml}
                setIsImportXml={setIsImportXml}
                handleSelectFileType={handleSelectFileType}
            />
}
             <div className="cursor-pointer" onClick={() => handleModalOpen(true)} >
            <OverlayTrigger placement='top' overlay={<Tooltip>Import Client</Tooltip>}>
                <div className=" NewRegImg mt-lg-0">
                    <img  src="icons/ImportIcon.svg" className="cursor-pointer" alt="Import" />
                </div>
            </OverlayTrigger>
            </div>
            <Modal
                show={isModalOpen}
                size="md"
                backdrop="static"
                animation='false'
                onHide={() => handleModalOpen(false)}
            >
                <Modal.Header className="text-white" closeVariant="white" closeButton> </Modal.Header>
                <Modal.Body>

                    {(enumFileTypeList.length > 0) ? <>
                        <div className="fw-bold mb-1">
                            <p>Please choose any one file type for importing data.</p>
                        </div>
                        <div className="d-flex justify-content-around">
                            {enumFileTypeList.map((item, index) => {
                                console.log("item", item)

                                const imageUrl=(item.value==3)?"icons/anxFileIconGroup.svg":"icons/xls_4726040 1.svg"
                                return <>
                                    <Card style={{ width: '9rem', height: "12rem", cursor: "pointer", textAlign: "center" }} onClick={() => { setIsImportXml(true), handleSelectFileType(item.value) }}>
                                        {/* <Card.Img variant="top" src="icons/fileUpload.svg" /> */}
                                            <Card.Img variant="top" src={imageUrl} />
                                        
                                        <Card.Body className='pt-1 p-0'>
                                            <p className="fw-bold">{item.label}</p>
                                        </Card.Body>
                                    </Card>
                                </>
                            })}
                        </div>
                        <br />
                    </> : <><p className="text-center fw-bold">Not available</p></>}

                </Modal.Body>
            </Modal>
        </>
    )
}

export default ImportFileButton
