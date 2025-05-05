import React, { useRef, useEffect, useState, useContext } from 'react'
import { $CommonServiceFn, $postServiceFn } from '../network/Service'
import { $Service_Url } from '../network/UrlPath'
import konsole from '../control/Konsole'
import { globalContext } from '../../pages/_app'
import { Modal, Button } from 'react-bootstrap'
import { Document, Page, pdfjs } from "react-pdf"
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from 'react-redux';

const UploadFile = (props) => {

    //-props-------------------------------------
    const { setdata } = useContext(globalContext)
    const context = useContext(globalContext)
    let memberuserid = props?.memberUserId

    let primaryuserid = sessionStorage.getItem('SessPrimaryUserId')
    let spouseuserid = sessionStorage.getItem('spouseUserId')
    let logedInuserid = sessionStorage.getItem('loggedUserId')
    //define state--------------------------------

    const inputFileRef = useRef(null)
    const [filedetails, setfiledetails] = useState([])
    const [currentFileesDetails, setCurrentFilsDetaild] = useState([])

    const [numPages, setNumPages] = useState(null);
    const [fileBase64, setfileBase64] = useState('')
    const [openfile, setopenfile] = useState(false)

    //useEffect--------------------------------------------

    useEffect(() => {
        getFileDocumentCabinetById(props?.memberUserId)
        setfiledetails([])
    }, [props?.memberUserId])


    //useEFfect fun------------------------------------------------------
    const getFileDocumentCabinetById = (userId) => {
        let jsonobj = {
            "userId": userId,
            "fileCabinetId": 12,
            "fileTypeId": 58
        }
        konsole.log('jsonobj', jsonobj)
        props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postFileDocumentCabinetById, jsonobj, (res, err) => {
            props.dispatchloader(false)
            if (res) {
                konsole.log('postFileDocumentCabinetByIdres', res)
                setfiledetails(res?.data?.data?.cabinetFiles)
                setCurrentFilsDetaild(res?.data?.data?.cabinetFiles[0]?.fileTypes[0])
                getfileinfo(res?.data?.data?.cabinetFiles[0]?.fileTypes[0]?.currentFiles[0])
            } else {
                konsole.log('postFileDocumentCabinetByIderr', err)
            }
        })
    }

    const getfileinfo = (filedetails) => {
        console.log('filedetails', filedetails)
        props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getfileUploadDocuments + filedetails.fileId + '/1', '', (res, err) => {
            props.dispatchloader(false)
            if (res) {
                konsole.log('getfileUploadDocumentsres', res)
                let fileDocObj = res?.data?.data;
                let data = 'data:application/pdf;base64,' + fileDocObj.fileInfo.fileDataToByteArray;
                setfileBase64(data)
            } else {
                konsole.log('getfileUploadDocumentserr', err)
            }
        })
    }

    //modal handlechange

    const fileuploadhandlechange = async (e) => {
        let selectFiles = e.target.files
        console.log("selectFiles", selectFiles)
        if (selectFiles.length > 0) {
            let { size, type } = selectFiles[0]
            konsole.log("selectFilesselectFiles", selectFiles, size, type)
            if (type !== "application/pdf") {
                toasterAlert("Only pdf format allowed")
                return;
            }
            if (size > 105906176) {
                toasterAlert("File is too large, file size should be 100MB")
                return;
            }
        }

        const ques = await context.confirm(true, 'Are you sure you want to upload this file?', 'Confirmation');
        ques && handleFileUpload(selectFiles[0])
        konsole.log('quesques', ques)
    }

    const handleFileUpload = (fileobj) => {
        konsole.log("selectFilesselectFilesa", fileobj)
        let fileTypeId = 58
        let fileStatusId = 1
        let fileCategoryId = 12


        props.dispatchloader(true)
        $postServiceFn.postFileUpload(fileobj, memberuserid, logedInuserid, fileTypeId, fileCategoryId, fileStatusId, (res, err) => {
            props.dispatchloader(false)
            if (res) {
                konsole.log('postFileUploadres', res)
                getFileDocumentCabinetById(memberuserid)
            } else {
                konsole.log('postFileUploaderr', err)
            }
        })


    }


    function toasterAlert(text) {
        setdata({ open: true, text: text, type: "Warning" });
    }

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    }


    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    return (
        <><h5 style={{ width: '90%' }}>This is a great place for you to upload your What About Me document so your agents will know what your preferences are. There may be other instructions not contained in the What About Me document that you can list here.</h5><br />
            <div className="d-flex flex-wrap justify-content-start">
                <span className='me-5 mt-1' style={{ fontSize: "1.25rem" }}>What about me ?</span>
                {filedetails?.length === 1 ? (
                    <>
                        <button className="btn" style={{ color: "#720c20", borderColor: "#720c20" }} onClick={() => setopenfile(true)}> View File</button>
                        <button className="btn ms-2" style={{ color: "#720c20", borderColor: "#720c20" }} onClick={() => inputFileRef?.current?.click()}>
                            Click to Browse and Update File
                        </button>
                        <input type="file" className="d-none" accept="application/pdf" ref={inputFileRef} onChange={fileuploadhandlechange} />
                        <Modal
                            show={openfile}
                            onHide={() => setopenfile(false)}
                            dialogClassName="modal-dialog-scrollable"
                            size='lg'
                        >
                            <Modal.Header closeButton closeVariant='white'>
                                <Modal.Title>File View</Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{ height: "57vh", overflow: "scroll", overflowX: "auto" }} className='mt-4'>
                                <Document
                                    file={fileBase64}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onContextMenu={(e) => e.preventDefault()}
                                >
                                    {Array.from(new Array(numPages ?? 0), (el, index) => (
                                        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                                    ))}
                                </Document>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className='btn' style={{ backgroundColor: '#720C20', color: 'white' }} onClick={() => setopenfile(false)}>Cancel</button>
                            </Modal.Footer>
                        </Modal>
                    </>
                ) : (
                    <>
                        <button className="btn" style={{ color: "#720c20", borderColor: "#720c20" }} onClick={() => inputFileRef.current.click()}>
                            Click to Browse and Upload File
                        </button>
                        <input type="file" className="d-none" ref={inputFileRef} accept="application/pdf" onChange={fileuploadhandlechange} />
                    </>
                )}
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);