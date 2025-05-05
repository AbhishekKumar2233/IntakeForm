import React, { Component, createRef, useEffect, useState } from "react";
import {
    Button,
    Modal,
    Table,
    Form,
    Tab,
    Row,    
    Col,

} from "react-bootstrap";
import { connect } from "react-redux";
import konsole from "../../../components/control/Konsole";
import { $CommonServiceFn, $postServiceFn} from '../../../components/network/Service';
import { $Service_Url } from '../../../components/network/UrlPath';
import { SET_LOADER } from "../../../components/Store/Actions/action";

const DragDrop = (props) => {

    const [show, setShow] = useState(false);
    const [image, setImage] = useState(null);
    const [loginUserId, setLoginUserId] = useState('');
    const [fileTypeList, setFileTypeList] = useState([]);
    const [fileType, setFileType] = useState(-1);
    const [fileCabinetTypeList, setFileCabinetTypeList] = useState([]);
    const [fileCabinetType, setFileCabinetType] = useState(-1);
    const [error, setError] = useState(false);


    useEffect(()=>{
        let loginUserId = sessionStorage.getItem('loggedUserId');
        setLoginUserId(loginUserId);
        fetchFileCabinetType();
    },[])


    const fetchFileCabinetType = () => {
        konsole.log("1");
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFileCabinetType,
            "", (response) => {
                if (response) {
                    const fileCabinetTypeObj = response.data.data;
                    setFileCabinetTypeList(fileCabinetTypeObj);
                    fetchFileType(fileCabinetTypeObj[0].value);
                }
            })
    }

    const fetchFileType = (fileCabinetTypeObjValue) => {

        konsole.log("1",fileCabinetTypeObjValue, fileType);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFileType + fileCabinetTypeObjValue ,
        "", (response) => {
            if(response){
                setFileTypeList(response.data.data);
            }
        })
    }

    const handleShow = () => {
        setShow(!show);
    };

    const handleImageChange = () => {
        document.getElementById('fileUploadId').click();
    }
    const handleImageSelection = (e) =>{
        setError(false);
        if(e.target.files.length == 0){
            setImage(null);
            return
        }
        let typeOfFile = e.target.files[0].type;
        if (typeOfFile !== "application/pdf"){
            setError(true);
            return;
        }
        setImage(e.target.files[0]);
    }

    konsole.log("image",image);

    const handleChange = (event) => {
        const eventName = event.target.name;
        const eventValue = event.target.value;
        
        switch(eventName){
            case 'fileType':
                setFileType(event.target.value);
            break;
            case 'fileCabinetType':
            setFileCabinetType(event.target.value);
            setFileType(-1);
            fetchFileType(event.target.value);
            break;
        }
    }



    const handleImageSubmit = (event) => {
        let eventId = event.target.id;
        let fileStatusId = 2; // for complete upload;
        if(eventId == "draftBtn"){
            fileStatusId = 1; // for draft upload;
        } 
        if(fileCabinetType == -1){
            alert("choose file cabinet type");
            return;
        }
        if (fileType == -1) {
            alert("choose file type");
            return;
        }
        else if(image == undefined || image == null){
            alert("please select a PDF");
            return;
        }
        props.dispatchloader(true);
        $postServiceFn.postFileUpload(image, props.client.memberId, loginUserId, fileType, fileCabinetType, fileStatusId, (response, errorData) => {
            props.dispatchloader(false);
            if (response) {
                konsole.log("resposneUP", response);
                props.handleDragNDrop();
            } else if (errorData) {
                alert(errorData);
            }
        })
    }

    return (
        <>
        <style jsx global>{`
        .modal-open .modal-backdrop.show {opacity: 0.5 !important;}
        .modal-dialog {
                max-width: 45rem !important;
            }
    `}</style>

            <Modal
                show={props.showDragNDrop}
                size="lg"
                centered
                onHide={props.handleDragNDrop} 
                backdrop="static"
                animation="false"
                id="drapnDropFileId"
            >
                <Modal.Body className="pb-5 pt-4" >
                    <Row ><h3 className="text-center mb-2">File Upload ({props.client?.memberName})</h3></Row>
                    <Row className="d-flex justify-content-around align-items-center ms-4 me-4">
                        <Col className="d-flex justify-content-start align-items-center">
                            <p className="mx-2">File Cabinet </p>
                            <Col xs={8}>
                                <Form.Select name='fileCabinetType' onChange={handleChange}>
                                    <option value="-1" selected disabled>Choose File Cabinet Type</option>
                                    {
                                        fileCabinetTypeList.length > 0 && fileCabinetTypeList.map((val, index) => {
                                            return(
                                                <option key={index} value={val.value}>{val.label}</option>
                                                )
                                            })
                                    }
                                </Form.Select>
                            </Col>
                        </Col>
                        <Col className="d-flex justify-content-start align-items-center">
                            <p className="mx-2">File Type</p>
                        <Col xs={8}>
                            <Form.Select name="fileType" onChange={handleChange} value={fileType}>
                            <option value="-1" selected disabled>Choose File Type</option>
                            {
                                fileTypeList.length > 0 && fileTypeList.map((val, index)=>{
                                    return(
                                        <option key={index} value={val.value}>{val.label}</option>
                                        )
                                    })
                            }
                        </Form.Select>
                        </Col>
                        </Col>
                    </Row>
                        <div className="py-4 mt-3 fileUpload bg-light text-center cursor-pointer" onClick={handleImageChange}>
                            {error && <p className="fs-5 text-danger">Please select only PDF file</p>}
                            <Row className="">
                                <img style={{ height: "70px" }} src='icons/fileUpload.svg' />
                                <p className="mt-3">{(image !== null && image !== undefined)? image?.name: "Click to Browse your file"}</p>
                            </Row>
                        </div>
                    <Row className="d-flex mt-4"> 
                    <Row className="mb-2 justify-content-center align-items-center">
                        <input type="file" onChange={handleImageSelection} id="fileUploadId" className="d-none" accept="application/pdf"/>
                    </Row>
                    <Row className="mb-5">
                        <p style={{color: '#76272b',fontSize:"17px"}}>Please upload PDF file only. Make sure file size should not exceed 20 MB</p>
                    </Row>
                    <Col className="d-flex justify-content-end">
                        <Button id="uploadBtn" className="" onClick={handleImageSubmit} disabled={error}>
                        Upload
                        </Button>
                    </Col>
                    <Col className="d-flex justify-content-center">
                        <Button id="draftBtn" className="" onClick={handleImageSubmit} disabled={error} > Save as Draft</Button>
                    </Col>
                        <Col className="">
                            <Button className="" onClick={props.handleDragNDrop}>
                                Close
                            </Button>
                        </Col>
                     </Row>
                </Modal.Body>
            </Modal>
        </>
    );
}

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({
            type: SET_LOADER,
            payload: loader
        }),
});

export default connect('', mapDispatchToProps)(DragDrop);