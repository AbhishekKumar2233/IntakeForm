import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from 'react-bootstrap/Modal';
import { Services } from '../network/Service';
import konsole from '../control/Konsole';
import { Document, Page, pdfjs } from "react-pdf";
import { isNotValidNullUndefile } from '../Reusable/ReusableCom.js';
import AlertToaster from "../control/AlertToaster.js";
import { $AHelper } from '../control/AHelper.js';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from 'react-redux';
import FileRemarks from './FileRemarks';
import { globalContext } from '../../pages/_app.js';
import { useContext } from 'react';
import { useLoader } from '../../component/utils/utils.js';
// paralegalAttoryId
import { paralegalAttoryId } from '../control/Constant.js';

const FileViewer = ({ openFileInfo, isFileOpen, setIsFileOpen, dispatchloader, fileCabinetDesign, isDirectAMA, isDirectFeeAgreement }) => {

    let primaryUserId = sessionStorage.getItem('SessPrimaryUserId')
    let loggesInId = sessionStorage.getItem('loggedUserId')
    let userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))
    const stateObj = $AHelper.getObjFromStorage("stateObj");
    konsole.log('openFileInfo', openFileInfo, openFileInfo?.fileTypeName)
    konsole.log('stateObjstateObj', stateObj.roleId)
    // state define -----------------------------------
    const [base64data, setBase64Data] = useState(false);
    const [base64data2, setBase64Data2] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [isRemarksOpen, setIsRemarksOpen] = useState(false);
    const [showMail, setShowMail] = useState(false);
    const [alertState, setAlertState] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [errors, setErrors] = useState({});
    const [showField, setShowField] = useState(false);
    const userLoggedInDetail = JSON.parse(sessionStorage.getItem("userLoggedInDetail"));
    const checkRoleId = stateObj.roleId
    const [formData, setFormData] = useState({
        to: '',
        Subject: '',
        Compose: '',
        bcc: '',
        cc: userLoggedInDetail.primaryEmailId,
    });
    const { setWarning, newConfirm } = useContext(globalContext);
    const [memberName, setMemberName] = useState("")

    useEffect(() => {
        getFileDetails(openFileInfo);
        // konsole.log("userLoggedInDetailuserLoggedInDetail",userLoggedInDetail)
    }, [openFileInfo])

    const initialFormData = {
        to: '',
        cc: '',
        bcc: '',
        Subject: '',
        Compose: ''
    };

    // this function use for getting information of file -----------------------
    const getFileDetails = (openFileInfo) => {
        useLoader(true)
        dispatchloader(true)
        Services.getFileForView({ ...openFileInfo }).then((res) => {
            konsole.log('response of file info', res)
            useLoader(false)
            dispatchloader(false)
            let fileDocObj = res?.data?.data?.fileInfo
            let binaryData = 'data:application/pdf;base64,' + fileDocObj?.fileDataToByteArray;
            setBase64Data(binaryData);
            setBase64Data2(fileDocObj?.fileDataToByteArray)
            konsole.log('fileDocObj', fileDocObj)
        }).catch((err) => {
            useLoader(false)
            dispatchloader(false)
            konsole.log('err in response file info', err)
        })
    }


    //  this fun use for deleting file --------------------------------------------------- 
    const apiDeleteFile = () => {
        let { fileId, primaryUserId, fileCabinetId, fileCategoryId, fileTypeId, } = openFileInfo
        let josnObj = { "userId": primaryUserId, "fileCabinetId": Number(fileCategoryId), "fileTypeId": Number(fileTypeId), "fileId": Number(fileId), "deletedBy": loggesInId }
        konsole.log('josnObj', josnObj)
        Services.deleteFileCabinetByFileId(josnObj).then((res) => {
            konsole.log('res of file deleting ', res)
            window.location.reload()
        }).catch((err) => konsole.log('err in deling file ', err))
    }



    //  this is predefine for view  file 
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    }
    //  this is predefine for view  file 
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);

    }


    const handleDocumnets = async (type) => {
        if (type == "print") {
            // const printWindow = window.open('', '_blank');
            // printWindow.document.write('<iframe src="' + base64data + '" width="100%" height="100%"></iframe>');
            // printWindow.document.close();
            handlePrintClick(base64data2)
        }
        if (type == "share") {
            setShowMail(true);
        }
        else if (type === "download") {
            // console.log("dsdsddddddd",base64data)
            // let linkSource = base64data;
            // let downloadLink = document.createElement("a");
            // const fileName = openFileInfo?.userFileName
 
            // downloadLink.href = linkSource;
            // downloadLink.download = fileName;
            // downloadLink.click();
            // AlertToaster.success("Document downloaded successfully.");
            downloadPDF();
        }
    }
 
    const downloadPDF = ( forPrint ) => {
        try {
            // Remove the data URL prefix if it exists
            const fileByteArray = forPrint == true ? base64data2 : base64data;
            const base64Data = fileByteArray.replace(/^data:application\/pdf;base64,/, '');
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const linkSource = URL.createObjectURL(blob);
            if(forPrint == true) return linkSource;
            const downloadLink = document.createElement("a");
            const fileName = openFileInfo?.userFileName;
   
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink); // Append the link to the body
            downloadLink.click();
            document.body.removeChild(downloadLink); // Remove the link after clicking
            URL.revokeObjectURL(linkSource); // Clean up the object URL
            AlertToaster.success("Document downloaded successfully.");
        } catch (error) {
            AlertToaster.error("An error occurred while downloading the document.");
            konsole.error("Error downloading PDF:", error);
        }
    }

    const handlePrintClick = (pdfBase64) => {
        if (pdfBase64) {
            const byteCharacters = atob(pdfBase64);
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, { type: 'application/pdf' });

            const url = URL.createObjectURL(blob);
            const printWindow = window.open(url, '_blank');
            if (printWindow) {
                printWindow.document.title = 'Print PDF';

                // Wait until the PDF is fully loaded and then trigger the print dialog
                printWindow.onload = () => {
                    setTimeout(() => {
                        printWindow.print(); // Trigger the print dialog on the new window
                        URL.revokeObjectURL(url); // Revoke the object URL after printing
                    }, 500); // A slight delay to make sure the content is fully loaded
                };
            } else {
                konsole.error("Unable to open print window.");
            }
        }
    };


    const closeShareModal = () => {
        setShowMail(false);
        setShowField(false)
    }

    const toggleCc = () => {
        setShowField(!showField);
    }

    const staticAlertTimer = (text) => {
        if (alertState) {
            AlertToaster.error(text);
            setAlertState(false);
            setTimeout(() => {
                setAlertState(true);
            }, 5000);
        }
        setIsSending(false);
    };

    const handleSubmit = async (e) => {
        setIsSending(true);

        e.preventDefault();
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const normalizeEmail = (email) => email.trim().toLowerCase();

        const toEmails = formData.to ? formData.to.split(',').map(normalizeEmail) : [];
        const ccEmails = formData.cc ? formData.cc.split(',').map(normalizeEmail) : [];
        const bccEmails = formData.bcc ? formData.bcc.split(',').map(normalizeEmail) : [];

        const allEmails = [...toEmails, ...ccEmails, ...bccEmails];
        const emailSet = new Set(allEmails);

        if (emailSet.size !== allEmails.length) {
            staticAlertTimer("Duplicate emails are not allowed for the recipient.");
            return;
        }

        if (
            (formData?.to && (toEmails?.includes(normalizeEmail(formData?.cc)) || toEmails?.includes(normalizeEmail(formData?.bcc)))) ||
            (formData?.cc && ccEmails?.includes(normalizeEmail(formData?.bcc)))
        ) {
            staticAlertTimer("Duplicate emails are not allowed for the recipient.");
            return;
        }

        if (!formData.to) {
            newErrors.to = 'Field cannot be blank.';
        }
        if (showField) {
            if (formData.to) {
                const toEmails = formData.to.split(',').map((email) => email.trim());
                for (const toEmail of toEmails) {
                    if (!emailRegex.test(toEmail)) {
                        newErrors.to = 'Please enter a valid email';
                        break;
                    }
                }
            }
            if (formData.cc) {
                const ccEmails = formData.cc.split(',').map((email) => email.trim());
                for (const ccEmail of ccEmails) {
                    if (!emailRegex.test(ccEmail)) {
                        newErrors.cc = 'Please enter a valid email';
                        break;
                    }
                }
            }
            if (formData.bcc) {
                const bccEmails = formData.bcc.split(',').map((email) => email.trim());
                for (const bccEmail of bccEmails) {
                    if (!emailRegex.test(bccEmail)) {
                        newErrors.bcc = 'Please enter a valid email';
                        break;
                    }
                }
            }
        }

        // Validate email format
        const validateEmails = (emails) => emails.every(email => emailRegex.test(email));

        if (formData.to && !validateEmails(toEmails)) {
            newErrors.to = 'Please enter a valid email address.';
        }
        if (formData.cc && !validateEmails(ccEmails)) {
            newErrors.cc = 'Please enter a valid email address.';
        }
        if (formData.bcc && !validateEmails(bccEmails)) {
            newErrors.bcc = 'Please enter a valid email address.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSending(false);
            return;
        }

        const blob = await fetch(base64data).then((res) => res.blob());
        const file = new File([blob], `${openFileInfo?.fileTypeName}.pdf`, { type: "pdf" });
        let formdata = new FormData();
        const emailContent = `Hello,\n\nI trust this email finds you well.
           I am forwarding the attached document for your review
            and consideration. The document contains ${openFileInfo?.fileTypeName} of ${userDetailOfPrimary?.memberName}.\n\n${userDetailOfPrimary?.memberName}
          `
        let finalEmailContent = formData?.Compose == "" ? emailContent : formData?.Compose;
        finalEmailContent = finalEmailContent.replace(/\n/g, '<br>');
        formdata.append("CreatedBy", loggesInId)
        formdata.append("Emailcc", formData?.cc)
        formdata.append("Emailbcc", formData?.bcc)
        formdata.append("File", file)
        formdata.append("EmailType", "SavePdfData")
        formdata.append("EmailTo", formData?.to)
        formdata.append("EmailSubject", formData?.Subject == "" ? (`${openFileInfo?.fileTypeName} - ${openFileInfo?.belongsToMemberName}`) : formData?.Subject)
        formdata.append("EmailContent", finalEmailContent)
        formdata.append("EmailTemplateId", 1)
        formdata.append("EmailStatusId", 1)
        formdata.append("EmailMappingTable", "EmailMappingTable")
        formdata.append("EmailMappingTablePKId", primaryUserId)
        let result = Services.PostEmail(formdata)
        dispatchloader(true)
        result.then((res) => {
            dispatchloader(false)
            setShowMail(false)
            setFormData({
                ...formData,
                to: "", Subject: "", Compose: "", cc: userLoggedInDetail.primaryEmailId, bcc: ""
            });
            AlertToaster.success("Email sent successfully");
            setIsSending(false);
        }).catch((err) => {
            konsole.log("errr", err)
            dispatchloader(false)
        })

    }

    const resetFormData = () => {
        setFormData(initialFormData);
        setErrors({});
    };

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: ''
        });
    }

    const numberFormatee = (number) => {

        const lastTenDigitArray = array => array.slice(-10);
        let countryCode = getCountryCode(number)
        if (countryCode == '1') {
            return $AHelper.convertToUSFormat(lastTenDigitArray(number), countryCode)
        } else {
            return Services.convertToIndiaFormat(lastTenDigitArray(number), countryCode);
        }

    }


    function getCountryCode(mobileNumber) {
        const digitsOnly = isNotValidNullUndefile(mobileNumber) && mobileNumber?.replace(/\D/g, '');

        if (digitsOnly.startsWith('1')) {

            return '1';
        }
        if (digitsOnly.startsWith('91')) {
            return '91';
        }
        return null;
    }

    konsole.log("formdata", formData)


    konsole.log('base64database64database64datazyx', base64data)

    return createPortal(
        <div>
            <style jsx global>{`.modal-open .modal-backdrop.show {  opacity: 0.5 !important;}`}</style>
            <Modal id={`${(base64data)?    'fileViewerModal-newFileCabinet-filecabinet':'fileViewerModal-newFileCabinet' }`}
         
              className='fileViewerModal' enforceFocus={false} show={isFileOpen} onHide={() => setIsFileOpen(false)} size="lg" fullscreen='lg-down' backdrop="static">
                <Modal.Header
                    className={`${(fileCabinetDesign == "new") ? "newFileCabinteModalHeaderBackground" : "oldFileViewerModalStyle"}`}
                >
                    {fileCabinetDesign == "new" ?
                        <>
                            <span className='newFileCabinetFileModalheader'>{openFileInfo?.userFileName}</span>
                            <button type="button" className=" filePrieviewClosebuttonStyle" onClick={() => { resetFormData(); setIsFileOpen(false) }}> <img src="/icons/filePrieviewClosebutton.svg" className='viewFileImage mt-0' /></button>
                        </>

                        :
                        <>
                            <span className='actionTypeStyling'>File View</span>
                            <button type="button" className=" btn border-0 bg-transparent" onClick={() => setIsFileOpen(false)}> <img src="/icons/filePrieviewClosebutton.svg" className='viewFileImage mt-0' /></button>
                        </>
                    }
                </Modal.Header>
                <Modal.Body className="rounded">
                    {/* <div style={{ height: '100%', width: '25rem', backgroundColor: 'white', position: 'absolute', top: '0', right: '0', marginRight: '-26rem' }}>


                   
                    </div> */}
                    {isRemarksOpen && <FileRemarks dispatchloader={dispatchloader} isRemarksOpen={isRemarksOpen} setIsRemarksOpen={setIsRemarksOpen} openFileInfo={openFileInfo} fileCabinetDesign={fileCabinetDesign} />}


                    {fileCabinetDesign == "new" ?
                        <div className='row justify-content-between modalBodyFileView'>
                            <div className='col-4 p-0'>
                                {(!isDirectAMA && !isDirectFeeAgreement) && (<p className='fileStatusStyle'>Status: <span>{openFileInfo?.fileStatusName}</span> </p>)}
                            </div>
                            <div className='col-7 d-flex justify-content-end'>

                                <button className='printButtonFileView' id='download' onClick={() => handleDocumnets("download")}><img src="/icons/marronDownloadIcon.svg" className='imageSizePrint mt-0 '></img>Download</button>
                                <button className='printButtonFileView' id='print' onClick={() => handleDocumnets("print")}><img src="/icons/maroonPrintIconNewFileCab.svg" className='imageSizePrint mt-0 '></img>Print</button>
                                {(base64data != false && (checkRoleId == 9 || checkRoleId == 10 || checkRoleId == 1)) &&
                                    <>
                                        <button className='shareButtonFileView w-25' id='share' onClick={() => handleDocumnets("share")}><img src="/icons/shareIconMarron.svg" className='imageSizePrint mt-0'></img>Share</button>
                                    </>
                                }
                                {(!isDirectAMA && !isDirectFeeAgreement) && (<button className='remarkButtonFileView' id='remark' onClick={() => setIsRemarksOpen(true)}><img src="/icons/renameMarronIcon.svg" className='imageSizePrint mt-0'></img>Remark</button>)}
                            </div>
                        </div>
                        :
                        <>
                            <div className='container-fluid pdf' id='pdfId'>
                                <div id='logo' className='w-100'>
                                    <div className="container-fluid mt-2 p-0 m-0">
                                        <div className="side-menu p-0 mx-2 d-flex align-items-center justify-content-between">
                                            <div><p><b>Doc Status:</b> {openFileInfo?.fileStatusName} </p>
                                                <p><b>File Name: </b>{(openFileInfo?.userFileName) ? openFileInfo?.userFileName : openFileInfo?.fileTypeName}</p></div>
                                            <div>
                                                {(base64data != false && (checkRoleId == 9 || checkRoleId == 10 || checkRoleId == 1)) && <>
                                                    <button className="rounded-circle " id='print' onClick={() => handleDocumnets("print")}>
                                                        <img src='/icons/icons8-print-100.png' alt='print' />
                                                        <p>Print</p>
                                                    </button>
                                                    <button className="rounded-circle" id='share' onClick={() => handleDocumnets("share")} >
                                                        <img src='/icons/forwardIcon.svg' alt='share' />
                                                        <p>Share</p>
                                                    </button>
                                                </>}

                                                <button className="rounded-circle" id='remark'onClick={() => setIsRemarksOpen(true)} >
                                                    <img src='/icons/remarksIcon.svg' alt='remard' />
                                                    <p>Remarks</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                    {/* pdf */}
                    <div className='borderAroundDocument' >
                        <Document className="outer-doc" file={base64data} onLoadSuccess={onDocumentLoadSuccess} onContextMenu={(e) => e.preventDefault()}>
                            {Array.from(new Array(numPages), (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    customTextRenderer={false}
                                    scale={96 / 72}
                                />
                            ))}
                        </Document>
                    </div>

                </Modal.Body>
            </Modal>
            
            <Modal show={showMail} size="lg" enforceFocus={false} centered onHide={() => setShowMail(false)} animation="false" id="remarksId-newFileCabinet" backdrop="static" dialogClassName="left-side-modal">
                <Modal.Header
                    className={`${(fileCabinetDesign == "new") ? "newFileCabinteModalHeaderBackground" : "oldFileViewerModalStyle"}`}
                >
                    {fileCabinetDesign == "new" ?
                        <>
                            <span className='newFileCabinetFileModalheader'>Forward the document</span>
                            <button type="button" className=" filePrieviewClosebuttonStyle" onClick={() => setShowMail(false)}> <img src="/icons/filePrieviewClosebutton.svg" className='viewFileImage mt-0' /></button>
                        </>
                        :
                        <>
                            <span className='actionTypeStyling'>Forward the document</span>
                            <button type="button" className=" btn border-0 bg-transparent" onClick={() => setShowMail(false)}> <img src="/icons/filePrieviewClosebutton.svg" className='viewFileImage mt-0' /></button>
                        </>
                    }
                </Modal.Header>
                <Modal.Body
                    className='newFileCabinteModal'
                >
                    <>
                        <form className="compose-container-newFileCabinte"
                            onSubmit={handleSubmit}
                        >
                            <div className="form-group-newFileCabinte">
                                <div className={`d-flex align-items-center position-relative recipient-container ${errors.to ? 'margin-bottom-10' : ''}`}>
                                    <span className="fixed-text position-absolute text-secondary ">To:</span>
                                    <input type="text" id="to" name="to" className={`recipient-input-newFileCabinet flex-grow-1`}
                                        onChange={handleChanges}
                                    />
                                    {errors.to && <p className='text-danger-newFileCabinet position-absolute text-danger'> <div className="error">{errors.to}</div></p>}
                                </div>
                                <div className={`position-relative ${errors.cc ? 'margin-bottom-10' : ''} ${showField ? 'hide-cc-container-after' : 'cc-container'}`}>                                    <span className="fixed-text position-absolute text-secondary ">Cc:</span>
                                    <input type="text" id="cc" name="cc" className={`recipient-input-newFileCabinet flex-grow-1 ${showField ? '' : 'extra-padding'}`}
                                        defaultValue={(`${userLoggedInDetail.primaryEmailId}`)}
                                        onChange={handleChanges}
                                    />
                                    {showField ? ('') : (
                                        <h6 className="fw-normal border-0 bg-white cursor-pointer position-absolute cc-bcc"
                                            onClick={toggleCc}
                                        >Bcc</h6>
                                    )}
                                    {errors.cc && <p className='text-danger-newFileCabinet position-absolute text-danger'> <div className="error">{errors.cc}</div></p>}
                                </div>
                                {showField && (
                                    <div className={`position-relative ${errors.bcc ? 'margin-bottom-10' : ''}`}>
                                        <span className="fixed-text position-absolute text-secondary ">Bcc:</span>
                                        <input type="text" id="bcc" name="bcc" className={`recipient-input-newFileCabinet flex-grow-1`}
                                            onChange={handleChanges}
                                        />
                                        {errors.bcc && <p className='text-danger-newFileCabinet position-absolute text-danger'> <div className="error">{errors.bcc}</div></p>}
                                    </div>
                                )}
                                <div id='forwardDocumentCcBccSubEmail' className="recipient-input-wrapper position-relative recipientInputMargin">
                                    <span className="fixed-text position-absolute text-secondary ">Sub:</span>
                                    <input type="text" id="Subject" name="Subject" className={`recipient-input-newFileCabinet flex-grow-1`}
                                        defaultValue={(`${(openFileInfo?.fileTypeName)} - ${openFileInfo?.belongsToMemberName}`)}
                                        onChange={handleChanges}
                                    />
                                </div>

                                <h5>Description</h5>

                                <textarea
                                    className="message-input-newFileCabinte"
                                    id="Compose"
                                    name="Compose"
                                    rows="10"
                                    placeholder="Enter a message here..."
                                    defaultValue={`Hello User,\n\nI trust this email finds you well. I am forwarding the attached document for your review and consideration. The document contains ${openFileInfo?.fileTypeName} of ${userDetailOfPrimary?.memberName}.\n\n${userDetailOfPrimary?.memberName}`}
                                    onChange={handleChanges}
                                />
                            </div>
                            <div className='d-flex-column justify-content-between w-100 align-items-center'>
                                <div className='d-flex align-items-center margin-bottom-10'>
                                    <img src="/icons/pdf-File-Image.svg" className="pdfOrDocImage me-2"></img>
                                    <p className='m-0'><b>File Name: </b>{(openFileInfo?.userFileName) ? openFileInfo?.userFileName : openFileInfo?.fileTypeName}</p>
                                </div>
                                <div>
                                    <button disabled={isSending} onClick={handleSubmit} type="button" style={{ height: "40px" }} className="send-button d-flex align-items-center">Send</button>
                                </div>
                            </div>
                        </form>
                    </>
                </Modal.Body >

            </Modal >

        </div>,
        document.querySelector('#viewPdfFile')
    );
};


// export default FileViewer;
const mapStateToProps = (state) => ({ ...state.main });

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FileViewer);