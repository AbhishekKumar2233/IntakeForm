import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from 'react-bootstrap/Modal';
import { Services } from '../network/Service';
import konsole from '../control/Konsole';
import { Document, Page, pdfjs } from "react-pdf";
import PdfDocumentViewer from '../PdfDocumentViewer';
import { isNotValidNullUndefile } from '../Reusable/ReusableCom.js';
import AlertToaster from "../control/AlertToaster.js";
import { $AHelper } from '../control/AHelper.js';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from 'react-redux';
import FileRemarks from './FileRemarks';

const FileViewer = ({ openFileInfo, isFileOpen, setIsFileOpen, dispatchloader }) => {

    let primaryUserId = sessionStorage.getItem('SessPrimaryUserId')
    let loggesInId = sessionStorage.getItem('loggedUserId')
    let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))
    const stateObj = $AHelper.getObjFromStorage("stateObj");
    konsole.log('openFileInfo', openFileInfo,openFileInfo?.fileTypeName)
    konsole.log('stateObjstateObj',stateObj.roleId)
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
    const userLoggedInDetail =JSON.parse(sessionStorage.getItem("userLoggedInDetail"));
    const checkRoleId =stateObj.roleId
    const [formData, setFormData] = useState({
        to: '',
        Subject: '',
        Compose: '',
        bcc: '',
        cc:userLoggedInDetail.primaryEmailId,
      });
   
    const [memberName, setMemberName] = useState("")

    useEffect(() => {
        getFileDetails(openFileInfo);
        // konsole.log("userLoggedInDetailuserLoggedInDetail",userLoggedInDetail)
    }, [openFileInfo])

    // this function use for getting information of file -----------------------
    const getFileDetails = (openFileInfo) => {
        dispatchloader(true)
        Services.getFileForView({ ...openFileInfo }).then((res) => {
            konsole.log('response of file info', res)
            dispatchloader(false)
            let fileDocObj = res?.data?.data?.fileInfo
            let binaryData = 'data:application/pdf;base64,' + fileDocObj?.fileDataToByteArray;
            setBase64Data(binaryData);
            setBase64Data2(fileDocObj?.fileDataToByteArray)
            konsole.log('fileDocObj', fileDocObj)
        }).catch((err) => {
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


    const handleDocumnets = async(type) => {
             if(type == "print"){
        // const printWindow = window.open('', '_blank');
        // printWindow.document.write('<iframe src="' + base64data + '" width="100%" height="100%"></iframe>');
        // printWindow.document.close();
        handlePrintClick(base64data2)
              }
      if(type == "share") {
        setShowMail(true);
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
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<iframe src="' + url + '" width="100%" height="100%"></iframe>');
        printWindow.document.close();

        //   window.open(url, '_blank');
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 100);
        }
      };
      

    const closeShareModal=()=>{
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
            newErrors.to = 'Please enter valid email address.';
        }
        if (formData.cc && !validateEmails(ccEmails)) {
            newErrors.cc = 'Please enter valid email address.';
        }
        if (formData.bcc && !validateEmails(bccEmails)) { m-0
            newErrors.bcc = 'Please enter valid email address.';
        }

         if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSending(false);
            return;
          }

          const blob = await fetch(base64data).then((res) => res.blob());
          const file = new File([blob], `${openFileInfo?.fileTypeName}.pdf`, { type: "pdf" });
          let formdata = new FormData();
          const emailContent=`Hello,\n\nI trust this email finds you well.
           I am forwarding the attached document for your review
            and consideration. The document contains ${openFileInfo?.fileTypeName} of ${userDetailOfPrimary?.memberName}.\n\nWith Regards\n${userDetailOfPrimary?.memberName}
          `
          let finalEmailContent=formData?.Compose  == "" ? emailContent:formData?.Compose;
          finalEmailContent = finalEmailContent.replace(/\n/g, '<br>');
          formdata.append("CreatedBy",loggesInId)
          formdata.append("Emailcc", formData?.cc)
          formdata.append("Emailbcc" , formData?.bcc)
          formdata.append("File" , file)
          formdata.append("EmailType" , "SavePdfData")
          formdata.append("EmailTo" , formData?.to)
          formdata.append("EmailSubject" , formData?.Subject == "" ? (`${openFileInfo?.fileTypeName} - ${openFileInfo?.belongsToMemberName}`)  :formData?.Subject)
          formdata.append("EmailContent",finalEmailContent)
          formdata.append("EmailTemplateId" , 1)
          formdata.append("EmailStatusId" , 1)
          formdata.append("EmailMappingTable" , "EmailMappingTable")
          formdata.append("EmailMappingTablePKId" ,primaryUserId)
          let result = Services.PostEmail(formdata)
          dispatchloader(true)
          result.then((res) => {
          dispatchloader(false)
          setShowMail(false)
          setFormData({
              ...formData,
              to: "",Subject:"",Compose:"",cc: userLoggedInDetail.primaryEmailId ,bcc:""
              });
              AlertToaster.success("Email sent successfully");
              setIsSending(false);
          }).catch((err) => {
              konsole.log("errr",err)
              dispatchloader(false)
          })

        }

    const handleChanges =(e)=>{
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

        konsole.log("formdata",formData)


    konsole.log('base64database64database64datazyx',base64data)

    return createPortal(
        <div>       
            <style jsx global>{`.modal-open .modal-backdrop.show {  opacity: 0.5 !important;}`}</style>
            <Modal className='fileViewerModal' show={isFileOpen} onHide={() => setIsFileOpen(false)} size="lg" fullscreen='lg-down' backdrop="static">
                <Modal.Header className="text-white" closeVariant="white" closeButton>   
                    <span className='actionTypeStyling'>File View</span>   
                </Modal.Header>
                <Modal.Body className="rounded">
                    {/* <div style={{ height: '100%', width: '25rem', backgroundColor: 'white', position: 'absolute', top: '0', right: '0', marginRight: '-26rem' }}>


                   
                    </div> */}
                    {isRemarksOpen && <FileRemarks dispatchloader={dispatchloader} isRemarksOpen={isRemarksOpen} setIsRemarksOpen={setIsRemarksOpen} openFileInfo={openFileInfo} />}
                    <div className='container-fluid pdf' id='pdfId'>
                        <div id='logo' className='w-100'>
                            <div className="container-fluid mt-2 p-0 m-0">
                                <div className="side-menu p-0 mx-2 d-flex align-items-center justify-content-between">
                                    <div><p><b>Doc Status:</b> {openFileInfo?.fileStatusName} </p><p><b>File Name: </b>{(openFileInfo?.userFileName) ? openFileInfo?.userFileName : openFileInfo?.fileTypeName}</p></div>
                                    <div>
                                        {/* <button className="rounded-circle me-3 " id='remark' onClick={() => apiDeleteFile()}>
                                            <img src='/icons/deleteIcon.svg' alt='g4' />
                                            <p>Delete</p>
                                        </button> */}


                                        {(base64data !=false && (checkRoleId==9 || checkRoleId==10 || checkRoleId==1 ))
                                           
                                             && <>

                                            <button className="rounded-circle " id='print'
                                        onClick={()=>handleDocumnets("print")}>
                                            <img src='/icons/icons8-print-100.png' alt='print' /> 
                                            <p>Print</p>
                                        </button>

                                        <button className="rounded-circle" id='share'
                                        onClick={()=>handleDocumnets("share")}
                                          >
                                            <img src='/icons/forwardIcon.svg' alt='share' />
                                            <p>Share</p>
                                        </button>
                                        
                                        </> }
                                      

                                        <button className="rounded-circle" id='remark' 
                                        onClick={() => setIsRemarksOpen(true)} >
                                            <img src='/icons/remarksIcon.svg' alt='remard' />
                                            <p>Remarks</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Document className="outer-doc" file={base64data} onLoadSuccess={onDocumentLoadSuccess} onContextMenu={(e) => e.preventDefault()}>
                        {Array.from(new Array(numPages), (el, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                customTextRenderer={false}
                                scale={96/72}
                            />
                        ))}
                    </Document>
                </Modal.Body>
            </Modal>

            <Modal 
            centered={true}
            size="md"
            show={showMail}
            onHide={() => setShowMail(false)}
            backdrop="static" 
            style={{ opacity: "0.1 !importtant", zIndex: "9999", background: "rgba(0,0,0,0.5)" }}
            >
                <Modal.Header className="text-white" closeVariant="white" closeButton>   
                    <span className='actionTypeStyling'>Forward Document</span>   
                </Modal.Header> 
                <Modal.Body>
                    <> 
                        <form className="compose-container" 
                        
                        >
                            <div className="form-group" id='forwardDocumentCcBccEmail'>
                                <div className='position-relative'>
                                    <div className="recipient-input-wrapper position-relative recipientInputMargin">
                                        <span className="fixed-text position-absolute ms-2 me-4 text-secondary " style={{marginTop:'6px', fontSize:'16px'}}>To:</span>
                                        <input type="text" id="to" name="to" className="recipient-input inputPaddingTo m-0"
                                        onChange={handleChanges}
                                        />
                                
                                    {/* <h6 className='position-absolute fw-normal top-0 end-0 mt-2 me-4 border-0 bg-white cursor-pointer' 
                                    onClick={toggleCc}
                                    >Cc</h6> */}
                                        {errors.to && <p className='text-danger'> <div className="error">{errors.to}</div></p>}
                                    </div>
                                </div>
                                {/* {showField &&  */}
                                <div className="recipient-input-wrapper position-relative recipientInputMargin">
                                    <span className="fixed-text position-absolute ms-2 me-4 text-secondary " style={{marginTop:'6px', fontSize:'16px'}}>Cc:</span>
                                    <input type="text" id="cc" name="cc" className="recipient-input inputPaddingCc m-0"
                                    defaultValue={(`${userLoggedInDetail.primaryEmailId}`)} 
                                    onChange={handleChanges}
                                    />
                                 {/* } */}
                                 <h6 className='position-absolute fw-normal top-0 end-0 mt-2 pt-1 me-4 pe-1 border-0 bg-white cursor-pointer text-secondary' 
                                    onClick={toggleCc}
                                    >Bcc</h6>
                                    {errors.cc && <p className='text-danger'> <div className="error">{errors.cc}</div></p>}
                                 </div>
                                {showField && 
                                <div className="recipient-input-wrapper position-relative recipientInputMargin">
                                    <span className="fixed-text position-absolute ms-2 me-4 text-secondary " style={{marginTop:'6px', fontSize:'16px'}}>Bcc:</span>
                                    <input type="text" id="bcc" name="bcc" className="recipient-input inputPaddingBcc m-0"
                                    onChange={handleChanges}
                                    />
                                </div>
                                 }
                                 {errors.bcc && <p className='text-danger'> <div className="error">{errors.bcc}</div></p>}
                            </div>
                            <div id='forwardDocumentCcBccSubEmail' className="recipient-input-wrapper position-relative recipientInputMargin">
                                    <span className="fixed-text position-absolute ms-2 me-4 text-secondary " style={{marginTop:'6px', fontSize:'16px'}}>Sub:</span>
                                    <input type="text" id="Subject" name="Subject" className="subject-input inputPaddingSub"
                                    defaultValue={(`${(openFileInfo?.fileTypeName)} - ${openFileInfo?.belongsToMemberName}`)} 
                                    onChange={handleChanges} 
                                    />
                             </div>
                             
                            <textarea 
                            className="message-input" 
                            id="Compose" 
                            name="Compose" 
                            rows="10"
                            placeholder="Compose your message..."
                            defaultValue={`Hello,\n\nI trust this email finds you well. I am forwarding the attached document for your review and consideration. The document contains ${openFileInfo?.fileTypeName} of ${userDetailOfPrimary?.memberName}\n\nRegards,\n${userDetailOfPrimary?.memberName}`}
                            onChange={handleChanges} 
                            />
                            <div className='d-flex justify-content-between w-100 align-items-center'>
                                <div className='d-flex align-items-center'>
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
const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FileViewer);
