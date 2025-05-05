'use client'
import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import {
  Button,
  Modal,
  Table,
  Row,
  Col,
  ModalFooter
} from "react-bootstrap";
import ReactToPrint from 'react-to-print';
import konsole from '../../control/Konsole';
import { connect } from "react-redux";
import { SET_LOADER } from "../../../components/Store/Actions/action";
import AlertToaster from '../../control/AlertToaster';
import SignatureCanvas from 'react-signature-canvas';
import { intakeBaseUrl } from '../../control/Constant';
import { $CommonServiceFn } from "../../../components/network/Service";
import { $Service_Url, Api_Url } from "../../../components/network/UrlPath";
import { isNotValidNullUndefile, getApiCall, postApiCall, getSMSNotificationPermissions, isNullUndefine, isValidateNullUndefine  } from '../../Reusable/ReusableCom';
import { createSentEmailJsonForOccurrene, createSentTextJsonForOccurrene, logoutUrl } from '../../control/Constant';
import { $AHelper } from '../../../component/Helper/$AHelper';

const AnnualMaintanceAgreementModal = ({subscriptionId, genereateViewPdf,dispatchloader, viewAMAModalOpen, setViewAMAModalOpen , clientData, callerReference, primaryName, spouseName, attorneyName, willBasedPlanAmount, checkedPlanValue, jsonforradiocheeckbox, attorneyUserId, from, selectedDate, formattedToday, isPortalSignOn}) => {

    const [signatureAttorney, setSignatureAttorney] = useState(null);
    const [signaturePrimary, setSignaturePrimary] = useState(null);
    const [signatureSpouse, setSignatureSpouse] = useState(null);
    const [inputNameUser, setInputNameUser] = useState('');
    const [signatureAnotherPrimary, setSignatureAnotherPrimary] = useState(null);
    const [signatureAnotherSpouse, setSignatureAnotherSpouse] = useState(null);
    const [prevStateAttorney, setPrevStateAttorney] = useState(null);
    const [prevStatePrimary, setPrevStatePrimary] = useState(null);
    const [prevStateSpouse, setPrevStateSpouse] = useState(null);
    const [alertState, setalertState] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const componentRef = useRef(null)
    const modalRef = useRef(null);
    konsole.log(inputNameUser,('inputNameUser'))

    const staticAlertTimer = ( text ) => {
        if(alertState == true) {
          AlertToaster.error(text);
          setalertState(false);
          setTimeout(() => setalertState(true), [5000]);
        }
      } 

    // Reset the signature if the Close Button is clicked
    const reSetState = () => {
        setSignatureAttorney(null);
        setSignaturePrimary(null);
        setSignatureSpouse(null);
        setSignatureAnotherPrimary(null);
        setSignatureAnotherSpouse(null);
        setPrevStateSpouse(null);
        setPrevStatePrimary(null);
        setPrevStateAttorney(null);
    };

    const preprocessDateForSafari = (dateString) => {
   
        if (dateString instanceof Date) {
            dateString = dateString.toLocaleDateString('en-US');
        }
   
        if (!dateString || typeof dateString !== 'string') {
            return null;
        }
   
        const parts = dateString.split('/');
   
        if (parts.length === 3) {
            const formattedDate = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
            return formattedDate;
        }
   
        return dateString;
    };
   
    const formattedSelectedDate = preprocessDateForSafari(selectedDate);

    // Define a function to generate PDF
    const handleDownloadPDF = () => {
        const adjustedFontSize = '12.6pt';

        const element = document.getElementById('mainAnnualMaintance');
        const contentWrapper = document.createElement('div');
        contentWrapper.style.width = '720px';
        contentWrapper.style.padding = '12px';
        contentWrapper.style.fontSize = adjustedFontSize;
        contentWrapper.style.fontFamily = 'Open Sans';
        
        // Clone the content and append it to the wrapper
        const clonedContent = element.cloneNode(true);

        // Find elements with class .border and add border style
        const elementsToAddBorder = clonedContent.querySelectorAll('.borderAllSide');
        elementsToAddBorder.forEach(element => {
                element.style.border = '4px solid #720C20';
        });

        // Find all elements with the class hideInPrint and add inline style to hide them
        const elementsToHide = clonedContent.querySelectorAll('.hideInPrint');
        elementsToHide.forEach(element => {
            element.style.display = 'none';
        });

        // Find all elements with the class hideInPrint and add inline style to hide them
        const elementsToHideBorderNone = clonedContent.querySelectorAll('.datePeaker');
        elementsToHideBorderNone.forEach(element => {
            element.style.border = 'none';
        });

        // Find all elements with the class showInPrint and add inline style to hide them
        const elementsToShow = clonedContent.querySelectorAll('.showInPrint');
        elementsToShow.forEach(element => {
            element.style.display = 'block';
        });

        // Adjusted font size for elements with class subHeadingAnnualMaintance based on screen width
        const subHeadingElements = clonedContent.querySelectorAll('.subHeadingAnnualMaintance');
        subHeadingElements.forEach(subHeading => {
            // subHeading.style.fontSize = screenWidth === 1366 ? '17.1pt' : (screenWidth === 1024 ? '17.3pt' : (screenWidth === 1440 ? '16.7pt' : (screenWidth === 1680 ? '13.6pt' : (screenWidth === 1920 ? '14.8pt' : '15.2pt'))));
            subHeading.style.fontSize = '17.1pt';
        });

        // Find elements with class name 'marginLeftPDF' and apply margin-left
        const elementsWithMargin = clonedContent.querySelectorAll('.marginLeftPDF');
        elementsWithMargin.forEach(element => {
            element.style.marginLeft = '55px';
        });

        // Find elements with class name 'paddingBottomBilling' and apply padding-bottom
        const elementsWithPaddingBottom = clonedContent.querySelectorAll('.paddingBottomBilling');
        elementsWithPaddingBottom.forEach(element => {
            element.style.paddingBottom = '360px';
        });

        // Manipulate the font size for elements with class subHeadingAnnualMaintance
        const h3Elements = clonedContent.querySelectorAll('.mainAnnualMaintance h3');
        h3Elements.forEach(h3 => {
            h3.style.fontSize = '21px';
        });

            // Define SVG markup for checked and unchecked boxes
            const checkSVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="16" height="16" stroke="#000" fill="none"/>
            <path d="M12.623 3.177L6.73 9.03 3.378 5.99 2 7.4l4.353 4.434a.998.998 0 001.416 0l6.27-6.283z" fill="#000"/>
            </svg>`;

            // Updated SVG with border for unchecked state
            const uncheckedSVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="16" height="16" stroke="#000" fill="none"/>
            <rect x="1" y="1" width="14" height="14" stroke="#000" fill="none"/>
            </svg>`;


            // Replace checkboxes with SVGs for checked and unchecked states
            const replaceCheckboxWithSVG = (checkbox, svgContent) => {
            const span = document.createElement('span');
            span.style.marginRight = '20px';
            span.innerHTML = svgContent;
            checkbox.parentNode.replaceChild(span, checkbox);
            };

            // Apply to all always-checked checkboxes
            const checkboxElementsChecked = clonedContent.querySelectorAll('.always-Unchecked-form-check-input[type="checkbox"]');
            checkboxElementsChecked.forEach(checkbox => replaceCheckboxWithSVG(checkbox, checkbox.checked ? checkSVG : uncheckedSVG));

        // Filter out unchecked checkboxes and append only checked ones
        const checkboxElements = clonedContent.querySelectorAll('.always-checked-form-check-input[type="checkbox"]');
        checkboxElements.forEach(checkbox => {
            const checkmark = document.createElement('span');
            if (checkbox.checked) {
                checkmark.textContent = '✔';
                checkmark.style.marginRight = '20px';
            } else {
                checkmark.textContent = '';
            }
            checkbox.parentNode.replaceChild(checkmark, checkbox);
        });

        // Replace checkbox inputs with appropriate symbols
        // const checkboxElementsFull = clonedContent.querySelectorAll('.always-Unchecked-form-check-input[type="checkbox"]');
        // checkboxElementsFull.forEach(checkbox => {
        //     const checkboxSymbol = document.createElement('span');
        //     checkboxSymbol.textContent = checkbox.checked ? '🗹' : '☐';
        //     checkboxSymbol.style.marginRight = '20px';
        //     checkbox.parentNode.replaceChild(checkboxSymbol, checkbox);
        // });

        // Add padding to each li element
        const liElements = clonedContent.querySelectorAll('li');
        liElements.forEach(li => {
            li.style.paddingLeft = '30px';
        });

        // Add border to each page
        contentWrapper.appendChild(clonedContent);

        import('html2pdf.js').then(html2pdf => {

            if (spouseName) {
                if (!isNotValidNullUndefile(signatureAttorney) || !isNotValidNullUndefile(signaturePrimary) || !isNotValidNullUndefile(signatureSpouse)) {
                    staticAlertTimer(`Please complete all the signatures before downloading the PDF file.`);
                    const scrollToElement = (elementId) => {
                        const container = document.getElementById(elementId);
                        if (container) {
                            container.scrollIntoView({ behavior: 'smooth' });
                        }
                    };
                    scrollToElement('attorneyContainer');
                    return;
                }
            } else {
                if (!isNotValidNullUndefile(signatureAttorney) || !isNotValidNullUndefile(signaturePrimary)) {
                    staticAlertTimer(`Please complete all the signatures before downloading the PDF file.`);
                    const scrollToElement = (elementId) => {
                        const container = document.getElementById(elementId);
                        if (container) {
                            container.scrollIntoView({ behavior: 'smooth' });
                        }
                    };
                    scrollToElement('attorneyContainer');
                    return;
                }
            }

            if (spouseName) {
                if (!isNotValidNullUndefile(signatureAnotherPrimary) || !isNotValidNullUndefile(signatureAnotherSpouse)) {
                    staticAlertTimer(`Please complete all the signatures before downloading the PDF file.`);
                    const scrollToElement = (elementId) => {
                        const container = document.getElementById(elementId);
                        if (container) {
                            container.scrollIntoView({ behavior: 'smooth' });
                        }
                    };
                    scrollToElement('AnotherContainer');
                    return;
                }
            } else {
                if (!isNotValidNullUndefile(signatureAnotherPrimary)) {
                    staticAlertTimer(`Please complete all the signatures before downloading the PDF file.`);
                    const scrollToElement = (elementId) => {
                        const container = document.getElementById(elementId);
                        if (container) {
                            container.scrollIntoView({ behavior: 'smooth' });
                        }
                    };
                    scrollToElement('AnotherContainer');
                    return;
                }
            }                          
                
            html2pdf?.default(contentWrapper, {
                margin: [14, 10],
                filename: `${primaryName} Annual Maintenance Agreement.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: {
                    scale: 1.4,
                    letterRendering: true,
                    allowTaint: true,
                    logging: false,
                    unit: 'px',
                    format: 'letter',
                    orientation: 'portrait',
                    allowTaint: true,
                    useCORS: true
                },
            }).then(() => {
                konsole.log('PDF generated successfully');
            }).catch(err => {
                konsole.error('Error generating PDF', err);
            });
        }).catch(err => {
            konsole.error('Error loading html2pdf module', err);
        });
    };
    
    const uploadDoc = async (btnType) => {
        setIsProcessing(true);
        try {
            if (btnType === 'makeApayment') {
                if (spouseName) {
                    if (!isNotValidNullUndefile(signatureAttorney) || !isNotValidNullUndefile(signaturePrimary) || !isNotValidNullUndefile(signatureSpouse)) {
                        staticAlertTimer(`Before completing the payment, kindly fill out all the signatures.`);
                        const scrollToElement = (elementId) => {
                            const container = document.getElementById(elementId);
                            if (container) {
                                container.scrollIntoView({ behavior: 'smooth' });
                            }
                        };
                        scrollToElement('attorneyContainer');
                        setIsProcessing(false);
                        return;
                    }
                } else {
                    if (!isNotValidNullUndefile(signatureAttorney) || !isNotValidNullUndefile(signaturePrimary)) {
                        staticAlertTimer(`Before completing the payment, kindly fill out all the signatures.`);
                        const scrollToElement = (elementId) => {
                            const container = document.getElementById(elementId);
                            if (container) {
                                container.scrollIntoView({ behavior: 'smooth' });
                            }
                        };
                        scrollToElement('attorneyContainer');
                        setIsProcessing(false);
                        return;
                    }
                }
                
                if (spouseName) {
                    if (!isNotValidNullUndefile(signatureAnotherPrimary) || !isNotValidNullUndefile(signatureAnotherSpouse)) {
                        staticAlertTimer(`Before completing the payment, kindly fill out all the signatures.`);
                        const scrollToElement = (elementId) => {
                            const container = document.getElementById(elementId);
                            if (container) {
                                container.scrollIntoView({ behavior: 'smooth' });
                            }
                        };
                        scrollToElement('AnotherContainer');
                        setIsProcessing(false);
                        return;
                    }
                } else {
                    if (!isNotValidNullUndefile(signatureAnotherPrimary)) {
                        staticAlertTimer(`Before completing the payment, kindly fill out all the signatures.`);
                        const scrollToElement = (elementId) => {
                            const container = document.getElementById(elementId);
                            if (container) {
                                container.scrollIntoView({ behavior: 'smooth' });
                            }
                        };
                        scrollToElement('AnotherContainer');
                        setIsProcessing(false);
                        return;
                    }
                }  
            } 
            
            const html2pdfModule = await import('html2pdf.js');
            const html2pdf = html2pdfModule.default;

            const adjustedFontSize = '13.2pt';

            const element = document.getElementById('mainAnnualMaintance');
            const contentWrapper = document.createElement('div');
            contentWrapper.style.width = '720px';
            contentWrapper.style.padding = '12px';
            contentWrapper.style.fontSize = adjustedFontSize;
            contentWrapper.style.fontFamily = 'Open Sans';

            contentWrapper.style.fontSize = adjustedFontSize;
            contentWrapper.style.fontFamily = 'Open Sans';
            
            // Clone the content and append it to the wrapper
            const clonedContent = element.cloneNode(true);

            // Find elements with class .border and add border style
            const elementsToAddBorder = clonedContent.querySelectorAll('.borderAllSide');
            elementsToAddBorder.forEach(element => {
                    element.style.border = '4px solid #720C20';
            });

            // Find all elements with the class hideInPrint and add inline style to hide them
            const elementsToHide = clonedContent.querySelectorAll('.hideInPrint');
            elementsToHide.forEach(element => {
                element.style.display = 'none';
            });

            // Find all elements with the class hideInPrint and add inline style to hide them
            const elementsToHideBorderNone = clonedContent.querySelectorAll('.datePeaker');
            elementsToHideBorderNone.forEach(element => {
                element.style.border = 'none';
            });

            // Find all elements with the class showInPrint and add inline style to hide them
            const elementsToShow = clonedContent.querySelectorAll('.showInPrint');
            elementsToShow.forEach(element => {
                element.style.display = 'block';
            });

            // Adjusted font size for elements with class subHeadingAnnualMaintance based on screen width
            const subHeadingElements = clonedContent.querySelectorAll('.subHeadingAnnualMaintance');
            subHeadingElements.forEach(subHeading => {
                // subHeading.style.fontSize = screenWidth === 1366 ? '17.1pt' : (screenWidth === 1024 ? '17.3pt' : (screenWidth === 1440 ? '16.7pt' : (screenWidth === 1680 ? '13.6pt' : (screenWidth === 1920 ? '14.8pt' : '15.2pt'))));
                subHeading.style.fontSize = '17.1pt';
            });

            // Find elements with class name 'marginLeftPDF' and apply margin-left
            const elementsWithMargin = clonedContent.querySelectorAll('.marginLeftPDF');
            elementsWithMargin.forEach(element => {
                element.style.marginLeft = '55px';
            });

            // Find elements with class name 'paddingBottomBilling' and apply padding-bottom
            const elementsWithPaddingBottom = clonedContent.querySelectorAll('.paddingBottomBilling');
            elementsWithPaddingBottom.forEach(element => {
                element.style.paddingBottom = '360px';
            });

            // Manipulate the font size for elements with class subHeadingAnnualMaintance
            const h3Elements = clonedContent.querySelectorAll('.mainAnnualMaintance h3');
            h3Elements.forEach(h3 => {
                h3.style.fontSize = '21px';
            });

             // Define SVG markup for checked and unchecked boxes
             const checkSVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
             <rect x="0" y="0" width="16" height="16" stroke="#000" fill="none"/>
             <path d="M12.623 3.177L6.73 9.03 3.378 5.99 2 7.4l4.353 4.434a.998.998 0 001.416 0l6.27-6.283z" fill="#000"/>
             </svg>`;
  
             // Updated SVG with border for unchecked state
             const uncheckedSVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
             <rect x="0" y="0" width="16" height="16" stroke="#000" fill="none"/>
             <rect x="1" y="1" width="14" height="14" stroke="#000" fill="none"/>
             </svg>`;
  
  
             // Replace checkboxes with SVGs for checked and unchecked states
             const replaceCheckboxWithSVG = (checkbox, svgContent) => {
             const span = document.createElement('span');
             span.style.marginRight = '20px';
             span.innerHTML = svgContent;
             checkbox.parentNode.replaceChild(span, checkbox);
             };
  
             // Apply to all always-checked checkboxes
             const checkboxElementsChecked = clonedContent.querySelectorAll('.always-Unchecked-form-check-input[type="checkbox"]');
             checkboxElementsChecked.forEach(checkbox => replaceCheckboxWithSVG(checkbox, checkbox.checked ? checkSVG : uncheckedSVG));
    
            // Filter out unchecked checkboxes and append only checked ones
            const checkboxElements = clonedContent.querySelectorAll('.always-checked-form-check-input[type="checkbox"]');
            checkboxElements.forEach(checkbox => {
                const checkmark = document.createElement('span');
                if (checkbox.checked) {
                    checkmark.textContent = '✔';
                    checkmark.style.marginRight = '20px';
                } else {
                    checkmark.textContent = '';
                }
                checkbox.parentNode.replaceChild(checkmark, checkbox);
            });
    
            // Replace checkbox inputs with appropriate symbols
            // const checkboxElementsFull = clonedContent.querySelectorAll('.always-Unchecked-form-check-input[type="checkbox"]');
            // checkboxElementsFull.forEach(checkbox => {
            //     const checkboxSymbol = document.createElement('span');
            //     checkboxSymbol.textContent = checkbox.checked ? '🗹' : '☐';
            //     checkboxSymbol.style.marginRight = '20px';
            //     checkbox.parentNode.replaceChild(checkboxSymbol, checkbox);
            // });
    
            // Add padding to each li element
            const liElements = clonedContent.querySelectorAll('li');
            liElements.forEach(li => {
                li.style.paddingLeft = '30px';
            });
    
            // Add border to each page
            contentWrapper.appendChild(clonedContent);
    
            dispatchloader(true);

            // Generate PDF with the wrapped content and additional options
            html2pdf()
                .set({
                    margin: [14, 10],
                    filename: `${primaryName} Annual Maintenance Agreement.pdf`,
                    image: { type: 'jpeg', quality: 1 },
                    html2canvas: {
                        scale: 1.4,
                        letterRendering: true,
                        allowTaint: true,
                        logging: false,
                        unit: 'px',
                        format: 'letter',
                        orientation: 'portrait',
                        allowTaint: true,
                        useCORS: true
                    },
                })
                .from(contentWrapper)
                .toPdf()
                .get('pdf')
                .then(function (pdf) {
                    const pdfBase64 = pdf.output('datauristring');
                    fetch(pdfBase64)
                        .then(res => res.blob())
                        .then(blob => {
                            konsole.log("blobblob", blob);
                            dispatchloader(false);
                            const pdfFile = new File([blob], "Annual Maintenance Agreement.pdf", {
                                lastModified: new Date().getTime(),
                                type: "application/pdf"
                            });
                            const fileDetails = { 0: pdfFile, length: 1 };
                            genereateViewPdf(fileDetails, btnType, formattedSelectedDate);
                            setViewAMAModalOpen(false);
                            setIsProcessing(false);
                        });
                });
        } catch (error) {
            konsole.error("Error loading html2pdf:", error);
            dispatchloader(false);
        }
    };

    const handleAnotherContainerClick = () => {
        konsole.log(signatureAnotherPrimary, "signatureAnotherPrimary");
    
        const scrollToElement = (elementId) => {
            const container = document.getElementById(elementId);
            if (container) {
                container.scrollIntoView({ behavior: 'smooth' });
            }
        };
    
        const primarySignaturesPresent = signaturePrimary;
        const spouseSignaturesPresent = signatureSpouse;
    
        if (spouseName) {
            if (!primarySignaturesPresent) {
                staticAlertTimer(`Please fill out the initial signature.`);
                scrollToElement('attorneyContainer');
                return;
            }
            if (!spouseSignaturesPresent) {
                staticAlertTimer(`Please fill out the spouse's signature.`);
                scrollToElement('attorneyContainer');
                return;
            }
        } else {
            if (!primarySignaturesPresent) {
                staticAlertTimer(`Please fill out the initial signature.`);
                scrollToElement('attorneyContainer');
                return;
            }
        }
    };  
    
    willBasedPlanAmount.forEach(plan => {
        plan.subsPlanSKUs.forEach(sku => {
            let skiLisnName = sku.skuListName;
            sku.modifiedSkuListName = skiLisnName?.startsWith("INDPKG_") ? skiLisnName?.replace('INDPKG_', '') : skiLisnName?.startsWith("GRPPKG_") ? skiLisnName?.replace('GRPPKG_', '') : skiLisnName;
        });
    });

    const subscriptionPlanNames = willBasedPlanAmount.map(plan => plan.subscriptionPlanName);
    konsole.log(subscriptionPlanNames,"wygdKASJHZXBM")
      
    const fontSizeLabel = {
        fontFamily: 'Open Sans',
        fontSize: '14pt',
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    };
    
    const formattedDate = formatDate(selectedDate);

  return (
    <>
    {from === 'link' ? (
        <style jsx global>{`
        .modal-open .modal-backdrop.show {
          opacity: 0.5 !important;
          background: white !important;
        }
      `}</style>
        ) : null}
    <Modal id="modal-Anuual-Maintanance" show={viewAMAModalOpen} onShow={() => setIsProcessing(false)} onHide={() => {setViewAMAModalOpen(false); reSetState();}} ref={modalRef} animation="false" backdrop="static" >
        {from === 'paralegal' ? (
            <Modal.Header closeButton style={{ border: "none" }} closeVariant="white">
                <Modal.Title>Annual Maintenance Agreement</Modal.Title>
            </Modal.Header>
        ) : null}
        {from === 'link' ? (
            <Modal.Header style={{background:'#fff', border:'none', borderBottom:'1px solid #dee2e6'}}>
                <Modal.Title style={{width:'150px', height:'70px', background:'white'}}>
                    <img style={{width:'100%'}} src='/icons/LPLlogo.png' alt='Annual Maintenance Agreement'></img>
                </Modal.Title>
                <Modal.Title className='fs-3' style={{color:'#720C20'}}>Annual Maintenance Agreement</Modal.Title>
            </Modal.Header>
        ) : null}
        <div  className='mainAnnualMaintance' id='mainAnnualMaintance' ref={componentRef}>
        <Modal.Body>
            <div className='px-5 mainAnnualMaintanceBorderPDF borderAllSide'>
                <Row style={{paddingTop:'260px', paddingBottom:'260px'}}>
                    <Col className='d-flex align-items-center justify-content-center flex-column h-100 AgreementMoto' style={{borderRight:'2px solid #D09C47'}}>
                        <div className='w-100'>
                            <img style={{width:'100%'}} src='/icons/AnnualMaintananceAgreement.png' alt='Annual Maintenance Agreement'></img>
                        </div>
                        <div>
                            <h3>ANNUAL MAINTENANCE</h3>
                            <h5 className='my-3 textColorOfAgreement float-end' style={{color:'#D09C47'}}>LIFE POINT LAW</h5>
                        </div>
                    </Col>
                    <Col className='m-auto'>
                        <div className="d-flex align-items-center justify-content-center flex-column h-100 ">
                            <h4 style={{color:'#D09C47'}} className="mb-3 textColorOfAgreement">OUR AGREEMENT</h4>
                            <p style={{textAlign: 'justify'}}>
                                One thing you can count on in life is that things will change. At Life Point Law, we strive to provide you with the advice and tools you need along your life’s journey. We are grateful to have had the opportunity to start on the road together. With this agreement, we are pleased to continue alongside you. 
                            </p>
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal.Body>
        <Modal.Footer className='d-flex'><div className="html2pdf__page-break"></div></Modal.Footer>
        <Modal.Body >
            <Row className='pt-2 px-2 paddingBottomPDF'>
                <Col className=' d-flex align-items-center justify-content-center flex-column borderAllSide'>
                    <div style={{width:'200px', paddingTop:'20px'}}>
                        <img style={{width:'100%'}} src='/icons/AnnualMaintananceAgreementLogo.png' alt='Annual Maintenance Agreement'></img>
                    </div>
                    <div className=' my-4 d-flex align-items-center justify-content-center'>
                        <h3 className='fw-bold headingAnnualMaintance'>ANNUAL MAINTENANCE AGREEMENT</h3>
                    </div>
                    <Row>
                    <p>
                        {`We, LIFE POINT LAW (“Firm”), and you, ${
                            primaryName && spouseName
                            ? primaryName?.split(' ')[1] === spouseName?.split(' ')[1]
                                ? `${primaryName?.split(' ')[0]?.charAt(0)?.toUpperCase() + primaryName?.split(' ')[0]?.slice(1)} & ${spouseName}`
                                : `${primaryName?.charAt(0)?.toUpperCase() + primaryName?.slice(1)} & ${spouseName}`
                            : primaryName
                                ? primaryName?.charAt(0)?.toUpperCase() + primaryName?.slice(1)
                                : spouseName
                                ? spouseName?.charAt(0)?.toUpperCase() + spouseName?.slice(1)
                                : ''
                        } (“Client”), enter into this Annual Maintenance Agreement (Agreement) for the services checked below:`}
                        </p>
                        <div>
                        <ol type='number' start='1'>
                                <Col>
                                    <div className='m-4'>
                                        <li className=' fw-bold mt-4 headingAnnualMaintance' >
                                            <input
                                                type="checkbox"
                                                className="always-Unchecked-form-check-input me-4"
                                                id="maintance_1"
                                                // checked={(jsonforradiocheeckbox[0]?.value === true)}
                                                checked={(jsonforradiocheeckbox && jsonforradiocheeckbox[0]?.value === true)}
                                                style={{width:'1em'}}
                                                readOnly
                                            /> 
                                            <span className='subHeadingAnnualMaintance'>{subscriptionPlanNames[0]} </span>
                                            <span className=' fw-normal text-black '>
                                                The Client and the Firm agree that the services to be provided under this Agreement are those services specifically outlined and priced below.
                                            </span>
                                            <br />
                                            <input
                                                type="checkbox"
                                                className="always-checked-form-check-input me-4"
                                                id="maintance_2"
                                                checked
                                                style={{width:'1em'}}
                                                readOnly
                                            /> 
                                            <span className='subHeadingAnnualMaintance'>Changes to Legal Documents. </span>
                                            <span className=' fw-normal text-black '>
                                                Up to one set of minor updates to legal documents created by the Firm each year. (See Section 4.a. for more details.)
                                            </span>
                                            <br />
                                            <input
                                                type="checkbox"
                                                className="always-checked-form-check-input me-4"
                                                id="maintance_3"
                                                checked
                                                style={{width:'1em', backgroundColor:'#fff', border:'none'}}
                                                readOnly
                                            /> 
                                            <span className='subHeadingAnnualMaintance'>Firm Availability to Client. </span>
                                            <span className='  fw-normal text-black '>
                                                The Firm will provide legal estate planning guidance and answers to legal estate planning questions to the Client.
                                            </span>
                                        </li>
                                        {/* {jsonforradiocheeckbox[1]?.value === true ? ( */}
                                        <li className='fw-bold my-4 headingAnnualMaintance'>
                                            <input
                                                type="checkbox"
                                                className="always-Unchecked-form-check-input me-4"
                                                id="maintance_4"
                                                // checked={(jsonforradiocheeckbox[1]?.value === true)}
                                                checked={(jsonforradiocheeckbox && jsonforradiocheeckbox[1]?.value === true)}
                                                style={{width:'1em'}}
                                                readOnly
                                            /> 
                                            <span className='subHeadingAnnualMaintance'>{subscriptionPlanNames[1]} </span>
                                            <span className=' fw-normal text-black '>
                                                The Client can elect to have their legal documents available on the Portal by AgingOptions. Here, the client can…
                                            </span>
                                            <br />
                                            <input
                                                type="checkbox"
                                                className="always-checked-form-check-input me-4"
                                                id="maintance_5"
                                                checked
                                                style={{width:'1em'}}
                                                readOnly
                                            /> 
                                            <span className='  fw-normal text-black '>
                                                Upload and store information in a structured manner.
                                            </span>
                                            <br />
                                            <input
                                                type="checkbox"
                                                className="always-checked-form-check-input me-4"
                                                id="maintance_6"
                                                checked
                                                style={{width:'1em'}}
                                                readOnly
                                            /> 
                                            <span className='  fw-normal text-black '>
                                                Share the information with named agents and family members. 
                                            </span>
                                            <br />
                                            <input
                                                type="checkbox"
                                                className="always-checked-form-check-input me-4"
                                                id="maintance_7"
                                                checked
                                                style={{width:'1em'}}
                                                readOnly
                                            /> 
                                            <span className='  fw-normal text-black '>
                                                Assign named agents and family members access rights to the account. 
                                            </span>
                                            <br />
                                            <input
                                                type="checkbox"
                                                className="always-checked-form-check-input me-4"
                                                id="maintance_8"
                                                checked
                                                style={{width:'1em'}}
                                                readOnly
                                            /> 
                                            <span className='  fw-normal text-black '>
                                                Access stored files on-demand on multiple devices. 
                                            </span>
                                        </li>
                                        {/* ) : ( null
                                        )} */}
                                    </div>
                                </Col>
                            </ol>
                            <h3 className='my-2 fw-bold headingAnnualMaintanceNew '>TERMS AND CONDITIONS</h3>
                            <ol type='number' start='3'>
                                <Col>
                                    <div className='mx-4' style={{textAlign:'justify'}}>
                                        <li className=' fw-bold mt-4 headingAnnualMaintance termConditionPadding paddingBottomPDF'>
                                            <span className='subHeadingAnnualMaintance'>Annual Cost. </span>
                                            <span className=' fw-normal text-black '>
                                                The cost each year for the Annual Maintenance Agreement depends on the type of legal estate plan:
                                            </span>
                                        </li>
                                    </div>
                                </Col>
                            </ol>
                        </div>
                    </Row>
                </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer className='d-flex'><div className="html2pdf__page-break"></div></Modal.Footer>
        <Modal.Body>
            <Row className='pt-2 px-2 paddingBottomPDF'>
                    <Col className=' d-flex align-items-center justify-content-center flex-column borderAllSide'>
                    <Row>
                            <div> 
                                <Col className='marginLeftPDF' style={{marginLeft:'26px'}}>
                                    <div className='m-4' style={{textAlign:'justify'}}>
                                        <div className=' fw-bold mt-4 headingAnnualMaintance '>
                                            <div>
                                            <input
                                                type="checkbox"
                                                className="always-Unchecked-form-check-input me-4"
                                                id="maintance_9"
                                                checked={(jsonforradiocheeckbox && jsonforradiocheeckbox[0]?.value === true) && (willBasedPlanAmount[0]?.subsPlanSKUs[0]?.endSubscriptionAmt) == checkedPlanValue[0]}
                                                // checked={
                                                //     checkedPlanValue === (
                                                //         willBasedPlanAmount && 
                                                //         willBasedPlanAmount[0]?.subsPlanSKUs && 
                                                //         willBasedPlanAmount[0]?.subsPlanSKUs[0]?.endSubscriptionAmt
                                                //     )
                                                // }
                                                style={{width:'1em'}}
                                                readOnly
                                            /> 
                                            <span className='text-decoration-underline subHeadingAnnualMaintance'> $ {(willBasedPlanAmount && willBasedPlanAmount[0]?.subsPlanSKUs && willBasedPlanAmount[0]?.subsPlanSKUs[0]?.endSubscriptionAmt) || ''}*/year for Will-Based Planning</span>
                                                <p className=' fw-normal text-black '>
                                                Will-Based Planning includes a Last Will and Testament document as the primary document of a client’s estate plan. Other Will documents such as Pour-Over Wills do not qualify for this category.
                                                </p>
                                                <br />
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="always-Unchecked-form-check-input me-4"
                                                id="maintance_10"
                                                checked={(jsonforradiocheeckbox && jsonforradiocheeckbox[0]?.value === true) && (willBasedPlanAmount[0]?.subsPlanSKUs[1]?.endSubscriptionAmt) == checkedPlanValue[0]}
                                                // checked={
                                                //     checkedPlanValue === (
                                                //         willBasedPlanAmount && 
                                                //         willBasedPlanAmount[0]?.subsPlanSKUs && 
                                                //         willBasedPlanAmount[0]?.subsPlanSKUs[1]?.endSubscriptionAmt
                                                //     )
                                                // }
                                                style={{width:'1em'}}
                                                readOnly
                                            /> 
                                            <span className='text-decoration-underline subHeadingAnnualMaintance'> $ {(willBasedPlanAmount && willBasedPlanAmount[0]?.subsPlanSKUs && willBasedPlanAmount[0]?.subsPlanSKUs[1]?.endSubscriptionAmt) || ''}*/year for Trust-Based Planning</span>
                                            <p className=' fw-normal text-black '>
                                                Trust-based planning includes a Trust as the primary document of a client’s estate plan. Trust documents may take many forms, including, but not limited to, Living Trusts, Revocable Trusts, Irrevocable Trusts, and more. Testamentary trusts, that are part of a Last Will and Testament, are not included in the definition of a Trust-based plan.
                                            </p>
                                            <br />
                                            <input
                                                type="checkbox"
                                                className="always-Unchecked-form-check-input me-4"
                                                id="maintance_11"
                                                checked={(jsonforradiocheeckbox && jsonforradiocheeckbox[0]?.value === true) && (willBasedPlanAmount[0]?.subsPlanSKUs[2]?.endSubscriptionAmt) == checkedPlanValue[0]}
                                                // checked={
                                                //     checkedPlanValue === (
                                                //         willBasedPlanAmount && 
                                                //         willBasedPlanAmount[0]?.subsPlanSKUs && 
                                                //         willBasedPlanAmount[0]?.subsPlanSKUs[2]?.endSubscriptionAmt
                                                //     )
                                                // }
                                                style={{width:'1em'}}
                                                readOnly
                                            /> 
                                            <span className='text-decoration-underline subHeadingAnnualMaintance'> $ {(willBasedPlanAmount && willBasedPlanAmount[0]?.subsPlanSKUs && willBasedPlanAmount[0]?.subsPlanSKUs[2]?.endSubscriptionAmt) || ''}*/year for Portal Services only</span>
                                            <p className=' fw-normal text-black '>
                                                Under this pricing, the client will not have <b className='text-decoration-underline fst-italic'>free</b> access to Life Point Law.
                                            </p>
                                            <br />
                                            <input
                                                type="checkbox"
                                                className="always-Unchecked-form-check-input me-4"
                                                id="maintance_12"
                                                // checked={(jsonforradiocheeckbox[1]?.value === true)}
                                                checked={(jsonforradiocheeckbox && jsonforradiocheeckbox[1]?.value === true)}
                                                style={{width:'1em'}}
                                                readOnly
                                            /> 
                                            <span className='text-decoration-underline subHeadingAnnualMaintance'>The Portal by AgingOptions</span>
                                            <p className=' fw-normal text-black'>
                                                AgingOptions is a law related entity, but distinct from Life Point Law. Your Portal membership gives you the ability to upload, store, manage, and share legal documents and other information related to your retirement plan. If you choose to opt into this benefit, you will no longer be protected by attorney-client privilege as it relates to the information you provide to AgingOptions because AgingOptions is not a law firm.
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                            <ol type='number' start='4'>
                                <Col>
                                    <div className='m-4' style={{textAlign:'justify'}}>
                                        <li className=' fw-bold mt-4 headingAnnualMaintance '>
                                            <span className='subHeadingAnnualMaintance'>Description of Services during the Effective Period. </span>  
                                            <span className=' fw-normal text-black '>
                                                The following services may be provided under this Agreement during the Effective Period, which is one calendar year following each payment made.
                                            </span>
                                            <br />
                                            <ol type='A' start='1'>
                                                <li className=' fw-bold mt-4 headingAnnualMaintance paddingBottomPDF'>
                                                <span className='subHeadingAnnualMaintance'>Changes to Legal Documents. </span>   
                                                <span className=' fw-normal text-black '>
                                                Upon request, the Firm will make up to one (1) set of updates to legal documents the Client has executed with the Firm during the
                                                </span>
                                                <span className=' fw-normal text-black hideInPrint'>
                                                Effective Period. A set of updates is defined as an unlimited number of updates requested by the Client one time each year. Changes are limited to <b>minor updates</b>. Minor updates can be understood as word-processing edits that the Client can explain to a legal assistant without requiring an attorney’s expertise. Should the changes exceed this limitation, the Firm retains the right to charge additional fees, after separate and mutual agreement.
                                                </span>
                                                <br className='hideInPrint' />
                                                <br className='hideInPrint' />
                                                <span className=' fw-normal text-black hideInPrint'>
                                                    The Firm may also, from time to time, contact the Client to recommend updates to documents due to changes in laws, taxes, or best practices.
                                                </span>
                                                <br className='hideInPrint' />
                                                <br className='hideInPrint' />
                                                <span className='fw-normal text-black hideInPrint' >All meetings must be made in the Firm offices or an online forum. <em className='text-decoration-underline'>Out-of-office meetings are specifically not included in this Agreement.</em> Should an out-of-office meeting become necessary, the Firm retains the right to charge for such time and effort, after a separate and mutual agreement.</span>
                                                <br className='hideInPrint' />
                                                </li>
                                            </ol>
                                        </li>
                                    </div>
                                </Col>
                            </ol>
                        </div>
                    </Row>
                </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer className='d-flex'><div className="html2pdf__page-break"></div></Modal.Footer>
        <Modal.Body>
            <Row className='pt-2 px-2 paddingBottomPDF'>
                <Col className=' d-flex align-items-center justify-content-center flex-column borderAllSide'>
                    <Row>
                        <div> 
                            <Col className='marginLeftPDF' style={{marginLeft:'20px'}}>
                                <div className='m-4' style={{textAlign:'justify'}}>
                                    <div className=' fw-bold mt-4 headingAnnualMaintance '>
                                        <div className='showInPrint' style={{marginLeft:'55px', display:'none'}}>
                                            <span className=' fw-normal text-black '>
                                            Effective Period. A set of updates is defined as an unlimited number of updates requested by the Client one time each year. Changes are limited to <b>minor updates</b>. Minor updates can be understood as word-processing edits that the Client can explain to a legal assistant without requiring an attorney’s expertise. Should the changes exceed this limitation, the Firm retains the right to charge additional fees, after separate and mutual agreement.
                                            </span>
                                            <br />
                                            <br />
                                            <span className=' fw-normal text-black '>
                                                The Firm may also, from time to time, contact the Client to recommend updates to documents due to changes in laws, taxes, or best practices.
                                            </span>
                                            <br />
                                            <br />
                                            <span className='fw-normal text-black' >All meetings must be made in the Firm offices or an online forum. <em className='text-decoration-underline'>Out-of-office meetings are specifically not included in this Agreement.</em> Should an out-of-office meeting become necessary, the Firm retains the right to charge for such time and effort, after a separate and mutual agreement.</span>
                                            <br />
                                        </div>
                                        <ol type='A' start='2'>
                                            <li className=' fw-bold mt-4 headingAnnualMaintance '>
                                            <span className='subHeadingAnnualMaintance'>Firm availability to Client. </span>   
                                            <span className=' fw-normal text-black '>
                                            The Firm will remain available during the Effective Period to answer any questions the Client may have about legal planning put in place with the Firm. All reasonable efforts shall be made to work with the Client as expeditiously as possible.
                                            </span>
                                            <br />
                                            </li>
                                            <li className=' fw-bold mt-4 headingAnnualMaintance '>
                                            <span className='subHeadingAnnualMaintance'>The Portal by AgingOptions. </span>     
                                            <span className=' fw-normal text-black '>
                                            By signing up for the Portal, the Client is granting AgingOptions permission to access legal documents the Firm has prepared for the Client. The Firm will remain available during the Effective Period to answer any questions the Client may have about Portal access and use. All reasonable efforts shall be made to work with the Client as expeditiously as possible. 
                                            </span>
                                            <br />
                                            </li>
                                            <li className=' fw-bold mt-4 headingAnnualMaintance '>
                                            <span className='subHeadingAnnualMaintance'>Incorporation by Reference. </span>   
                                            <span className=' fw-normal text-black '>
                                            All other provisions set out in Fee Agreement(s) previously entered into between the Client and the Firm are incorporated herein by reference.
                                            </span>
                                            <br />
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </Col>
                        </div>
                    </Row>
                </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer className='d-flex'><div className="html2pdf__page-break"></div></Modal.Footer>
        <Modal.Body>
            <Row className='pt-2 px-2 paddingBottomPDF'>
                <Col className=' d-flex align-items-center justify-content-center flex-column borderAllSide'>
                    <Row>
                        <div> 
                            <ol type='number' start='5'>
                                <Col>
                                    <div className='m-4' style={{textAlign:'justify'}}>
                                        <li className=' fw-bold mt-3 headingAnnualMaintance pt-3 '>
                                            <span className='subHeadingAnnualMaintance'>Additional Services: </span>
                                            <span className=' fw-normal text-black '>
                                            The Firm will not perform work beyond the identified scope of services detailed herein, nor will it facilitate additional services by third-party providers, without written authorization from Client approving the additional scope and cost and agreeing to make additional payment, if required.
                                            </span>
                                        </li>
                                        <li className=' fw-bold mt-3 headingAnnualMaintance pt-3 '>
                                            <span className='subHeadingAnnualMaintance'>Termination of Agreement. </span> 
                                            <span className=' fw-normal text-black '>
                                            This Agreement terminates at the end of every Effective Period of this Agreement unless the Client continues payment for the next Effective Period. The Firm may terminate this Agreement under the ethics rules governing Washington lawyers. The Client may terminate this Agreement at any time. 
                                            </span>
                                            <span className=' fw-normal text-black '>
                                            Fees paid per this Agreement are <b>non-refundable</b>. If the Client terminates the Agreement, the services under this Agreement will continue until the end of that Effective Period. 
                                            </span>
                                        </li>
                                        <li className=' fw-bold mt-3 headingAnnualMaintance pt-3 '>
                                            <span className='subHeadingAnnualMaintance'><sup>&#10038;</sup>Re-Enrollment into Program. </span>
                                            <span className=' fw-normal text-black '>
                                            If the Client terminates and then wishes to re-enroll in the Annual Maintenance Agreement, a re-enrollment fee will be charged in addition to this Agreement of $500 for Will-Based Planning, and $750 for Trust-Based Planning.  The amount will equal the fee that would have been paid to Life Point Law for each year that the payment would have been due had the Client maintained the membership in the Annual Maintenance Agreement.   
                                            </span>
                                            <br />
                                        </li>
                                        <li className=' fw-bold mt-4 headingAnnualMaintance'>
                                            <span className='subHeadingAnnualMaintance'>Non-Legal Services. </span>
                                            <span className=' fw-normal text-black fst-italic text-decoration-underline '>
                                                This provision shall not apply if you have opted out of the Portal by AgingOptions.  
                                            </span>
                                            <br />
                                            <ol type='A' start='1'>
                                                <li className=' fw-bold mt-4 headingAnnualMaintance '>
                                                <span className='subHeadingAnnualMaintance'>In addition to its legal services, </span>    
                                                <span className=' fw-normal text-black '>
                                                the Firm has entered into licensing arrangements with AgingOptions to offer complementary non-legal services. Firm attorney Rajiv Nagaich has a majority ownership interest in AgingOptions. AgingOptions is a planning and education company that is the exclusive owner and licensor of the Intellectual Property rights to LifePlanning and related non-legal services. 
                                                </span>
                                                <br />
                                                </li>
                                            </ol>
                                        </li>
                                    </div>
                                </Col>
                            </ol>
                        </div>
                    </Row>
                </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer className='d-flex'><div className="html2pdf__page-break"></div></Modal.Footer>
        <Modal.Body>
            <Row className='pt-2 px-2 paddingBottomPDF'>
                <Col className=' d-flex align-items-center justify-content-center flex-column borderAllSide'>
                    <Row>
                        <div> 
                            <ol type='number' start='9'>
                                <Col className=''>
                                    <div style={{textAlign:'justify', margin:'24px'}}>
                                        <div className='mt-4' style={{marginLeft:'24px'}}>
                                            <ol type='A' start='2'>
                                                <li className=' fw-bold mt-4 headingAnnualMaintance '>
                                                <span className='subHeadingAnnualMaintance'>Consent to Information Sharing between Life Point Law and AgingOptions. </span>    
                                                <span className=' fw-normal text-black '>
                                                    AgingOptions offers access to The Portal by AgingOptions for document storage, including legal documents, as well as instructions set by the Client to users authorized by the Client. By entering into this agreement, and for purposes of facilitating the Client’s potential use of The Portal by AgingOptions, you are giving informed consent for the Firm to share confidential information with The Portal by AgingOptions, including but not limited to personal health, housing, financial, and legal information, as well as confidential documents.
                                                </span>
                                                </li>
                                            </ol>
                                        </div>
                                        <li className=' fw-bold mt-4 headingAnnualMaintance'>
                                            <span className='subHeadingAnnualMaintance'>IOLTA Account. </span>
                                            <span className=' fw-normal text-black '>
                                            In accordance with the Washington State Bar Association (WSBA) requirements, attorneys must maintain a non-interest-bearing account into which the Client may deposit funds to apply to future legal costs. It is also referred to as an “IOLTA” account.  The WSBA requires all advance cost deposits such as recording fees to be placed into an IOLTA account. 
                                            <b> No fees referenced in this agreement will be deposited into the IOLTA Account.</b>
                                            </span>
                                            <br />
                                        </li>
                                        <li className=' fw-bold mt-4 headingAnnualMaintance '>
                                            <span className='subHeadingAnnualMaintance'>Compliance With This Agreement. </span>
                                            <span className=' fw-normal text-black '>
                                            In the case where a suit or action is instituted to enforce compliance with any of the terms or conditions of the Agreement or to collect the amounts which may become due under the Agreement, the prevailing party shall be awarded such sum as the court may adjudge reasonable as attorney’s fees to be allowed in such suit or actions, including any appeals. Jurisdiction for such suits includes the following: King County, Washington; Pierce County, Washington; or Snohomish County, Washington.
                                            </span>
                                            <br />
                                        </li>
                                        <li className=' fw-bold mt-4 headingAnnualMaintance'>
                                            <span className='subHeadingAnnualMaintance'>Billing. </span>
                                            <span className=' fw-normal text-black '>
                                            Services performed under the Annual Maintenance Agreement are billed annually in advance in keeping with the payment terms agreed to and set out in Exhibit A of this Agreement.
                                            (“Recurring Billing Account Pre-Authorization”)
                                            </span>
                                        </li>
                                    </div>
                                </Col>
                                </ol>
                            </div>
                        </Row>
                    </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer className='d-flex'><div className="html2pdf__page-break"></div></Modal.Footer>
        <Modal.Body>
            <Row className='pt-2 px-2 paddingBottomPDF'>
                <Col className=' d-flex align-items-center justify-content-center flex-column borderAllSide'>
                    <ol type='number' start='12'>
                        <Col>
                            <div className='m-4' style={{textAlign:'justify'}}>
                                <li className=' fw-bold mt-4 headingAnnualMaintance '>
                                    <span className='subHeadingAnnualMaintance'>Full Agreement. </span> 
                                    <span className=' fw-normal text-black '>
                                    This document, including Exhibit A (“Recurring Billing Account Pre-Authorization”), constitutes the entire Agreement between the Client and the Firm. Any changes or modifications must be in writing and be signed by both the Client and an attorney in the Firm. The Client and the Firm each acknowledge that they have read and understood the terms of this Agreement and agree to abide by its terms. The Client understands that he and/or she has the right to consult with another lawyer in connection with any of the terms of this Agreement before signing.
                                    </span>
                                    <br />
                                </li>
                            </div>
                            <div style={{ margin:'6px'}}>
                                <p className='ms-5 d-flex text-black'>
                                    <label className='fw-normal' htmlFor='dateInput' style={fontSizeLabel}>Signed on </label>
                                    <span className='border-0 ms-3 datePeaker' style={{ width: 'fit-content' }} type='date' id='dateInput' >{formattedToday}</span>
                                </p>
                                <div className='ms-5' style={{ paddingBottom: spouseName ? '230px' : '340px' }}>
                                    <Row className='ms-5 my-4 align-items-center' id='attorneyContainer'>
                                        <Col>
                                            <SignatureInputWithDispath
                                                dispatchloader={dispatchloader}
                                                attorneyName={attorneyName ? attorneyName?.charAt(0)?.toUpperCase() + attorneyName?.slice(1) : ''}
                                                fontSizeLabel={fontSizeLabel}
                                                setInputNameUser={setInputNameUser}
                                                setSignature={setSignatureAttorney}
                                                setPrevState={setPrevStateAttorney}
                                                prevState={prevStateAttorney}
                                                attorneyUserId={attorneyUserId}
                                                position="top"
                                                hideChangeOptions={callerReference == "AccountSetting"}
                                                from={from}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className='ms-5 my-4 align-items-center primaryContainer' id='primaryContainer'>
                                        <Col>
                                            <SignatureInputWithDispath
                                                dispatchloader={dispatchloader}
                                                primaryName={primaryName ? primaryName?.charAt(0)?.toUpperCase() + primaryName?.slice(1) : ''}
                                                fontSizeLabel={fontSizeLabel}
                                                setInputNameUser={setInputNameUser}
                                                setSignature={setSignaturePrimary}
                                                setPrevState={setPrevStatePrimary}
                                                prevState={prevStatePrimary}
                                                position="top"
                                            />
                                        </Col>
                                    </Row>
                                    {spouseName && (
                                    <Row className='ms-5 my-4 align-items-center spouseContainer' id='spouseContainer'>
                                        <Col>
                                            <SignatureInputWithDispath
                                                dispatchloader={dispatchloader}
                                                spouseName={spouseName ? spouseName?.charAt(0)?.toUpperCase() + spouseName?.slice(1) : ''}
                                                fontSizeLabel={fontSizeLabel}
                                                setInputNameUser={setInputNameUser}
                                                setSignature={setSignatureSpouse}
                                                setPrevState={setPrevStateSpouse}
                                                prevState={prevStateSpouse}
                                                position="top"
                                            />
                                        </Col>
                                    </Row>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </ol>
                </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer><div className="html2pdf__page-break"></div></Modal.Footer>
        <Modal.Body>
            <Row className='pt-4 paddingBottomPDF'>
                <div className='py-5 exhibitHeadingAnnualMaintance borderAllSide' id='exhibitHeadingAnnualMaintance' style={{textAlign:'justify'}}>
                    <h3 className='fw-bold text-center'>Exhibit A</h3>
                    <h4 className='fw-bold text-center py-3'>Recurring Billing Account Pre-Authorization</h4>
                    <p className='text-black text-justify' style={{textAlign:'justify'}}>
                    The Client authorizes regularly scheduled charges to his or her Credit Card and/or Bank Account (hereinafter referred to as “Account”). The Client will be charged the amount indicated below each billing period. The charge will appear on the Client’s Account statement.
                    <br />
                    <br />
                    <em className='fw-bold text-decoration-underline'>The Client agrees that no prior notification will be provided unless the date or amount changes,</em> in which case the Client will receive notice from the Firm at least ten (10) days before the payment being collected. 
                    <br />
                    <br />
                    {jsonforradiocheeckbox && (
                    <>
                        I, {primaryName ? primaryName.charAt(0).toUpperCase() + primaryName.slice(1) : ''} (Client) authorize LIFE POINT LAW to charge my Account referenced below for{' '}
                        {jsonforradiocheeckbox[0]?.value && !jsonforradiocheeckbox[1]?.value ? (
                            <b>$ {checkedPlanValue[0]}</b>
                        ) : jsonforradiocheeckbox[1]?.value && !jsonforradiocheeckbox[0]?.value ? (
                            <b>$ {checkedPlanValue[1]}</b>
                        ) : jsonforradiocheeckbox[0]?.value && jsonforradiocheeckbox[1]?.value && checkedPlanValue[0] !== 0 && checkedPlanValue[1] !== 0 ? (
                            <b>$ {checkedPlanValue[0]} and $ {checkedPlanValue[1]}</b>
                        ) : jsonforradiocheeckbox[0]?.value && jsonforradiocheeckbox[1]?.value && checkedPlanValue[0] === 0 && checkedPlanValue[1] !== 0 ? (
                            <b>$ {checkedPlanValue[1]}</b>
                        ) : jsonforradiocheeckbox[0]?.value && jsonforradiocheeckbox[1]?.value && checkedPlanValue[0] !== 0 && checkedPlanValue[1] === 0 ? (
                            <b>$ {checkedPlanValue[0]}</b>
                        ) : null}{' '}
                        on the <b>{formattedDate}</b> and{' '}
                        {jsonforradiocheeckbox[0]?.value && !jsonforradiocheeckbox[1]?.value ? (
                            <b>$ {checkedPlanValue[0]} annually thereafter.</b>
                        ) : jsonforradiocheeckbox[1]?.value && !jsonforradiocheeckbox[0]?.value ? (
                            <b>$ {checkedPlanValue[1]} annually thereafter.</b>
                        ) : jsonforradiocheeckbox[0]?.value && jsonforradiocheeckbox[1]?.value && checkedPlanValue[0] !== 0 && checkedPlanValue[1] !== 0 ? (
                            <b>$ {checkedPlanValue[0]} and $ {checkedPlanValue[1]} annually thereafter.</b>
                        ) : jsonforradiocheeckbox[0]?.value && jsonforradiocheeckbox[1]?.value && checkedPlanValue[0] === 0 && checkedPlanValue[1] !== 0 ? (
                            <b>$ {checkedPlanValue[1]} annually thereafter.</b>
                        ) : jsonforradiocheeckbox[0]?.value && jsonforradiocheeckbox[1]?.value && checkedPlanValue[0] !== 0 && checkedPlanValue[1] === 0 ? (
                            <b>$ {checkedPlanValue[0]} annually thereafter.</b>
                        ) : null}
                    </>
                    )}
                    <br />
                    <br />
                    I understand that this authorization will remain in effect until I cancel it in writing, and I agree to notify LIFE POINT LAW in writing of any changes in my account information or termination of this authorization at least fifteen (15) days before the next billing date. If the above-noted payment dates fall on a weekend or holiday, I understand that payments may be executed on the next business day. I acknowledge that the origination of Credit Card transactions to my account must comply with the provisions of U.S. law. I certify that I am an authorized user of this Account and will not dispute these scheduled transactions; so long as the transactions correspond to the terms indicated in this authorization form. 
                    </p>
                    <br />
                    <p className='ms-5 text-black' style={{textAlign:'justify'}}>
                        <label className='fw-normal' htmlFor='dateInput' style={fontSizeLabel}>Authorized on </label>
                        <span className='border-0 ms-3' style={{ width: 'fit-content' }} type='date' id='dateInput'>{formattedToday}</span>
                    </p>
                    <br />
                    <div className='ms-5' >
                    <Row className='align-items-center' id='AnotherContainer' style={{paddingBottom: (((primaryName && primaryName?.length > 16) && (inputNameUser > 20)) || ((spouseName && spouseName?.length > 16) && (inputNameUser > 20))) ? '20px': '80px' }} onClick={handleAnotherContainerClick} >
                            <Col className='col-2'>
                                <label style={fontSizeLabel}>Signature(s):</label>
                            </Col>
                            {/* {primaryName.length > 20 ? ( */}
                            {((primaryName && primaryName?.length > 16) && (inputNameUser > 20)) ? (
                                <Row className='col-10 d-flex justify-content-around anotherSignature' style={{gap:"15px"}}>
                                    {primaryName && spouseName && (
                                        <>
                                            <Row className='row-6'>
                                                <SignatureInputWithDispath
                                                    dispatchloader={dispatchloader}
                                                    primaryName={primaryName ? primaryName?.charAt(0)?.toUpperCase() + primaryName?.slice(1) : ''}
                                                    fontSizeLabel={fontSizeLabel}
                                                    setInputNameUser={setInputNameUser}
                                                    setSignature={setSignatureAnotherPrimary}
                                                    setPrevState={setPrevStatePrimary}
                                                    prevState={prevStatePrimary}
                                                    position="bottom"
                                                />
                                            </Row>
                                            <Row className='row-6'>
                                                <SignatureInputWithDispath
                                                    dispatchloader={dispatchloader}
                                                    spouseName={spouseName ? spouseName?.charAt(0)?.toUpperCase() + spouseName?.slice(1) : ''}
                                                    fontSizeLabel={fontSizeLabel}
                                                    setInputNameUser={setInputNameUser}
                                                    setSignature={setSignatureAnotherSpouse}
                                                    setPrevState={setPrevStateSpouse}
                                                    prevState={prevStateSpouse}
                                                    position="bottom"
                                                />
                                            </Row>
                                        </>
                                    )}
                                    {!spouseName && (
                                        <Col className='col-10'>
                                            <SignatureInputWithDispath
                                                dispatchloader={dispatchloader}
                                                primaryName={primaryName ? primaryName?.charAt(0)?.toUpperCase() + primaryName?.slice(1) : ''}
                                                fontSizeLabel={fontSizeLabel}
                                                setInputNameUser={setInputNameUser}
                                                setSignature={setSignatureAnotherPrimary}
                                                setPrevState={setPrevStatePrimary}
                                                prevState={prevStatePrimary}
                                                position="bottom"
                                            />
                                        </Col>
                                    )}
                                </Row>
                            ) : (
                                <Col>
                                    {primaryName && spouseName && (
                                        <Col className=' d-flex justify-content-around anotherSignature' style={{gap:"15px"}}>
                                            <Col className='col-6'>
                                                <SignatureInputWithDispath
                                                    dispatchloader={dispatchloader}
                                                    primaryName={primaryName ? primaryName?.charAt(0)?.toUpperCase() + primaryName?.slice(1) : ''}
                                                    fontSizeLabel={fontSizeLabel}
                                                    setInputNameUser={setInputNameUser}
                                                    setSignature={setSignatureAnotherPrimary}
                                                    setPrevState={setPrevStatePrimary}
                                                    prevState={prevStatePrimary}
                                                    position="bottom"
                                                />
                                            </Col>
                                            <Col className='col-6'>
                                                <SignatureInputWithDispath
                                                    dispatchloader={dispatchloader}
                                                    spouseName={spouseName ? spouseName?.charAt(0)?.toUpperCase() + spouseName?.slice(1) : ''}
                                                    fontSizeLabel={fontSizeLabel}
                                                    setInputNameUser={setInputNameUser}
                                                    setSignature={setSignatureAnotherSpouse}
                                                    setPrevState={setPrevStateSpouse}
                                                    prevState={prevStateSpouse}
                                                    position="bottom"
                                                />
                                            </Col>
                                        </Col>
                                    )}
                                    {!spouseName && (
                                        <Col className='col-10'>
                                            <SignatureInputWithDispath
                                                dispatchloader={dispatchloader}
                                                primaryName={primaryName ? primaryName?.charAt(0)?.toUpperCase() + primaryName?.slice(1) : ''}
                                                fontSizeLabel={fontSizeLabel}
                                                setInputNameUser={setInputNameUser}
                                                setSignature={setSignatureAnotherPrimary}
                                                setPrevState={setPrevStatePrimary}
                                                prevState={prevStatePrimary}
                                                position="bottom"
                                            />
                                        </Col>
                                    )}
                                </Col>
                            )}
                        </Row>
                    </div>
                </div>
            </Row>
        </Modal.Body>
        </div>
        <Modal.Footer className={from === 'paralegal' ? 'd-flex justify-content-between' : 'd-flex justify-content-center'}>
            {from === 'paralegal' ? (
            <Button className="theme-btn" onClick={() => {
                function isValidSignature(signature) {
                    return signature !== null && signature !== undefined && signature !== '';
                }
                if (
                    (spouseName && (
                        !isValidSignature(signatureAttorney) || 
                        !isValidSignature(signaturePrimary) || 
                        !isValidSignature(signatureSpouse) || 
                        !isValidSignature(signatureAnotherSpouse) || 
                        !isValidSignature(signatureAnotherPrimary)
                    )) ||
                    (!spouseName && (
                        !isValidSignature(signatureAttorney) || 
                        !isValidSignature(signaturePrimary) || 
                        !isValidSignature(signatureAnotherPrimary)
                    ))
                ) {
                    staticAlertTimer("Since the signature is incomplete, the AMA is pending.");
                } else {
                    staticAlertTimer("AMA is pending since the payment was not done.");
                }      
                setViewAMAModalOpen(false);
                reSetState();
            }}>
                Close
            </Button>
            ) : null}
            {/* {from === 'paralegal' ?(( spouseName && isNotValidNullUndefile(signatureAnotherSpouse) && signatureAnotherSpouse) || (!spouseName && isNotValidNullUndefile(signatureAnotherPrimary) && signatureAnotherPrimary)) &&
                <Button className="theme-btn" onClick={handleDownloadPDF}>
                    Download PDF
                </Button>
            : null} */}

            {/* {from === 'paralegal' && isNotValidNullUndefile(signatureAttorney) && !isPortalSignOn && (
                <Button className="theme-btn" disabled={isProcessing} onClick={()=>uploadDoc('sendLink')}> */}
            {/* {from === 'paralegal' && isNotValidNullUndefile(signatureAttorney) && !isPortalSignOn && (
                <Button className="theme-btn" disabled={isProcessing} onClick={()=>uploadDoc('sendLink')}> */}
                {/* <Button className="theme-btn" onClick={handleSendLinkButtonClick}> */}
                    {/* Send Link
                </Button>
            )} */}
            <div className="tooltip-container">
                {from === 'paralegal' && !isPortalSignOn && (callerReference != "AccountSetting") && (
                    <Button
                        className={`theme-btn ${signatureAttorney === null || !isNotValidNullUndefile(signatureAttorney) ? 'disabled-btn' : ''}`}
                        disabled={isProcessing || signatureAttorney === null || !isNotValidNullUndefile(signatureAttorney)}
                        onClick={isProcessing || signatureAttorney === null || !isNotValidNullUndefile(signatureAttorney) ? null : () => uploadDoc('sendLink')}
                    >
                        Send Link
                    </Button>
                )}
                {from === 'paralegal' && (signatureAttorney === null || !isNotValidNullUndefile(signatureAttorney)) && !isProcessing && !isPortalSignOn && (
                    <div className="tooltip">Kindly complete the legal staff signature</div>
                )}
                {from !== 'paralegal' && null}
            </div>

            <Button className="theme-btn" onClick={()=>uploadDoc('makeApayment')}>
                Make a Payment
            </Button>
            {/* <ReactToPrint content={reactToPrintContent} trigger={reactToPrintTrigger} /> */}
        </Modal.Footer>
    </Modal>
    </>
  );
};

// const mapStateToProps = (state) => ({ ...state });
// const mapDispatchToProps = (dispatch) => ({
//   dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader })
// });

// export default connect(mapStateToProps, mapDispatchToProps)(AnnualMaintanceAgreementModal)

export default AnnualMaintanceAgreementModal;

// Define SignatureInput component
const SignatureInput = ({
    fontSizeLabel,
    attorneyName,
    primaryName, 
    spouseName,
    setSignature,
    prevState,
    setPrevState,
    position,
    setInputNameUser,
    attorneyUserId,
    dispatchloader,
    hideChangeOptions,
    from,
}) => {

    const [selectedOption, setSelectedOption] = useState('');
    const [inputName, setInputName] = useState('');
    const [signatureImage, setSignatureImage] = useState(null);
    const [signatureImageAttorneyAPI, setSignatureImageAttorneyAPI] = useState(null);
    const [filename, setFilename] = useState('');
    const [selectedFont, setSelectedFont] = useState(null);
    const [isUploadSignature, setIsUploadSignature] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [isDigitalSignature, setIsDigitalSignature] = useState(false);
    const [isKeyboardSignature, setIsKeyboardSignature] = useState(false);
    const [selectedColorType, setSelectedColorType] = useState('#1A54C2');
    const [selectedColorDraw, setSelectedColorDraw] = useState('#1A54C2');
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
    const [alertState, setalertState] = useState(true);
    const sigCanvasRef = useRef(null);
    const reStoreState = () => {

        konsole.log("vwsdyugwagf", prevState)
        if (prevState?.signatureImage) setSignatureImage(prevState?.signatureImage);
        if (typeof prevState?.isUploadSignature == "boolean") setIsUploadSignature(prevState?.isUploadSignature);
        if (prevState?.previewImage) setPreviewImage(prevState?.previewImage);
        if (typeof prevState?.isDigitalSignature == "boolean") setIsDigitalSignature(prevState?.isDigitalSignature);
        if (typeof prevState?.isKeyboardSignature == "boolean") setIsKeyboardSignature(prevState?.isKeyboardSignature);
    }
    
    useEffect(() => {
        getAttorneyUser();
    }, [attorneyUserId]);
    
    const getAttorneyUser = () => {
        if(!attorneyUserId) return;
            // Fetch attorney user data
        dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFamilyMemberbyID + attorneyUserId , "", (res, error) => {
            dispatchloader(false);
            if (res) {
                konsole.log("getAttorneyUserRes", res);

                const loginUserId = sessionStorage.getItem("loggedUserId");

                let responseData = res?.data?.data?.member;
                konsole.log("sdasdgetAttorneyUserRes", responseData);

                const signatureId = responseData.signatureId;
                const userId = responseData.userId;
                const requestedBy = loginUserId;
                konsole.log("xhsdhdshddhsdh", signatureId, userId, requestedBy);
                if (signatureId) {
                    // Call downloadSignatureImage to fetch and display the signature image
                    showSignatureImage(userId, signatureId, requestedBy);
                    konsole.log(requestedBy,"requestedBy")
                }
            } else {
                konsole.log("Error fetching attorney user data:", error);
                // Handle error, show message to user, etc.
            }
        });
    };
    
    // Function to show the signature image
    const showSignatureImage = (userId, fileId, requestedBy) => {
        konsole.log(requestedBy,"MainrequestedBy")
        const fileTypeId = 63;
        const fileCategoryId = 1;
        dispatchloader(true)
        // alert("Loading signature image...");
        const url = `${$Service_Url.postDownloadUserDocument}/${userId}/${fileId}/${fileTypeId}/${fileCategoryId}/${userId}`;
            
        $CommonServiceFn.InvokeCommonApi("GET", url, "", (res, error) => {
            dispatchloader(false);
            if (res) {
                konsole.log(res, "djddjsdjsdsjdddjdjdsdj");
                const responseData = res?.data?.data;
                const fileUrlPath = responseData.fileUrlPath;
    
                if (fileUrlPath) {
                    konsole.log("DownloadedImageURL", fileUrlPath);
    
                    // Open modal to display signature image and options
                    setSignatureImageAttorneyAPI(fileUrlPath);
                    setSignatureImage(fileUrlPath);
                    setSignature(fileUrlPath);
                } else {
                    konsole.error("Error: fileUrlPath is missing.");
                }
            } else {
                konsole.error("Error downloading image:", error);
                // Handle error, show message to user, etc.
            }
        });
    };   
             
    // Function to change and upload the signature
    const changeSignature = (signatureData, previewImage, inputName, selectedFont, selectedColorType) => {
        if(!attorneyUserId) return;
        dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFamilyMemberbyID + attorneyUserId, "", async (res, error) => {
            dispatchloader(false);
            if (res) {
                konsole.log(res, "jaisriram");

                const userData = res?.data?.data?.member;
                const loginUserId = sessionStorage.getItem("loggedUserId");
                const convertedSignature = signatureData || previewImage || convertTextToImageType(inputName, selectedFont, selectedColorType);
                konsole.log(convertedSignature, "convertedSignature");

                // Convert the image data to a Blob object
                const signatureBlob = await getBlobFromBase64(convertedSignature);

                const userId = userData.userId || "";
                const uploadedBy = loginUserId || "";
                const fileStatusId = 2;
                const fileCategoryId = 1;
                const fileTypeId = 63;

                let formData = new FormData();
                formData.append('UserId', userId);
                formData.append('File', signatureBlob, 'signature.jpg');
                formData.append('UploadedBy', uploadedBy);
                formData.append('FileStatusId', fileStatusId);
                formData.append('FileCategoryId', fileCategoryId);
                formData.append('FileTypeId', fileTypeId);

                $CommonServiceFn.InvokeCommonApi("POST", Api_Url.postUploadUserDocument, formData, (res, error) => {
                    if (res) {
                        konsole.log("Uploaded:", res);
                        updateMemberDetails(userData, res?.data?.data?.fileId);
                    } else {
                        konsole.error("Error:", error);
                        // Handle error, show message to user, etc.
                    }
                }, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            } else {
                konsole.error("Error: Response object or its properties are null or undefined.");
                // Handle the error as needed
            }
        });
    };

    // Function to convert base64 to Blob
    const getBlobFromBase64 = async (base64Data) => {
        return fetch(base64Data)
            .then((res) => res.blob())
            .catch((error) => {
                konsole.error("Error converting base64 to Blob:", error);
                return null;
            });
    };

    // Function to update member details with the new signatureId and fileId
    const updateMemberDetails = (userData, fileId) => {
        dispatchloader(true);

        const loginUserId = sessionStorage.getItem("loggedUserId");

        const requestBody = {
            subtenantId: userData.subtenantId || "",
            fName: userData.fName || "",
            mName: userData.mName || "",
            lName: userData.lName || "",
            dob: userData.dob || "",
            citizenshipId: userData.citizenshipId || "",
            genderId: userData.genderId || "",
            fileId: fileId || "",
            signatureId: fileId || "",
            userId: userData.userId,
            updatedBy: loginUserId,
        };

        $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUpdateMember, requestBody, (res, error) => {
            dispatchloader(false);
            if (res) {
                konsole.log("Updateuh", res);

                // Perform any additional actions if needed
                showSignatureImage(requestBody.userId, requestBody.fileId, requestBody.updatedBy);
                // alert("Update successful.");
            } else {
                konsole.error("Error in PUT request:", error);
                alert("Error updating member details. Please try again.");
                // Handle error, show message to user, etc.
            }
        });
    };

    useEffect(() => {
        if((position == "bottom") && (prevState?.signatureImage != signatureImage)) {
            setSignatureImage(null); 
            setSignature(null);      
        }
    }, [prevState])

    const fonts = [
        "Aguafina Script",
        "Arizonia",
        "Parisienne",
    ];

    const fontPromises = fonts.map(font => document.fonts.load(`1em ${font}`));
    Promise.all(fontPromises).then(() => {
    });

    const sampleFonts = fonts.slice(fonts.start, fonts.end);

    const handleColorSelectType = (color) => {
        // if (!disableColorSelector) {
            setSelectedColorType(color);
        // }
    };
    
    const handleColorSelectDraw = (color) => {
        // if (!disableColorSelector) {
            setSelectedColorDraw(color);
        // }
        
        const canvas = sigCanvasRef?.current?.getCanvas();
        const ctx = canvas?.getContext('2d');
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData?.data;
    
        // Iterate over each pixel and modify its color
        for (let i = 0; i < data?.length; i += 4) {
            // Change color only if the pixel is not transparent
            if (data[i + 3] !== 0) {
                data[i] = parseInt(color.substring(1, 3), 16);
                data[i + 1] = parseInt(color.substring(3, 5), 16);
                data[i + 2] = parseInt(color.substring(5, 7), 16);
            }
        }
    
        // Put the modified image data back to the canvas
        ctx?.putImageData(imageData, 0, 0);
        
        // Change the pen color
        if (sigCanvasRef.current) {
            sigCanvasRef.current.penColor = color;
        }
    };
    
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.startsWith(" ")) {return;}
        if (!/^[A-Za-z ]*$/.test(value)) {return;}
        value = value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
        .join(' ');
        if (value?.length > 25) {
            staticAlertTimerSignature("The signature field allows a maximum of 25 characters. Please shorten your signature input.");
            return;
        }
        setInputName(value);
        setInputNameUser(value);
        setIsInputEmpty(value.length === 0);
    };

    const handleOptionClick = (option) => {

        if (signatureImageAttorneyAPI && attorneyName) {
            setSignature(signatureImageAttorneyAPI);
            setSignatureImage(signatureImageAttorneyAPI);
            setSelectedOption('');

        } else {
            setSelectedOption(option);
            setIsKeyboardSignature(false);
            setIsDigitalSignature(true);
            setIsUploadSignature(false);
            if (prevState && (prevState?.isDigitalSignature || prevState?.isKeyboardSignature || prevState?.isUploadSignature)) {
                reStoreState();
            }
            
            if (position === "bottom") {
                setSelectedOption('');
                setSignatureImage(prevState?.signatureImage);
                setSignature(prevState?.signatureImage);
            }
        }
    };    
    
    const handleToggleKeyboardSignature = () => {
        setIsDigitalSignature(false);
        setIsKeyboardSignature(true);
        setIsUploadSignature(false);
        setSignatureImage(null);
        setSignature(null);
        setIsCanvasEmpty(true)
        setPreviewImage(null);
        setFilename('');
        setInputName('');
        setPrevState({...prevState, sigCanvasData: undefined})
    };

    const handleToggleDigitalSignature = () => {
        setSignatureImage(null);
        setSignature(null);
        setSelectedFont(false);
        setIsDigitalSignature(true);
        setIsKeyboardSignature(false);
        setIsUploadSignature(false);
        setPreviewImage(null);
        setFilename('');
    };
    
    const handleToggleImageSignature = () => {
        setIsDigitalSignature(false);
        setIsKeyboardSignature(false);
        setIsUploadSignature(true);
        setSelectedFont(false);
        setIsCanvasEmpty(true);
        setPrevState({...prevState, sigCanvasData: undefined})
    };
    
    const handleFileChange = (event) => {
        const file = event?.target?.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setIsDigitalSignature(false);
            };
            reader.readAsDataURL(file);
            setFilename(file.name);
        }
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e?.dataTransfer?.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
            setFilename(file.name);
        }
    };
    
    const setPrevStateToParent = ( finalImage ) => {
        const newPrevState = {
            selectedOption: selectedOption,
            inputName: inputName,
            signatureImage: finalImage,
            filename: filename,
            selectedFont: selectedFont,
            isUploadSignature: isUploadSignature,
            previewImage: previewImage,
            isDigitalSignature: isDigitalSignature,
            isKeyboardSignature: isKeyboardSignature,
            selectedColorType: selectedColorType,
            selectedColorDraw: selectedColorDraw,
            isInputEmpty: isInputEmpty,
            isCanvasEmpty: isCanvasEmpty,
            sigCanvasData: sigCanvasRef.current?.toDataURL(),
            position: position,
        };
        setPrevState(newPrevState);
    }
    
    const handleToggleChangeSignature = (option) => {
        setSelectedOption(option);
        setIsKeyboardSignature(false);
        setIsDigitalSignature(true);
        setIsUploadSignature(false);
        // setIsAPISignature(null);
    };
    
    const handleClearUploadSignature = () => {
        // if (!disableClear) {
            if (previewImage) {
                setPreviewImage(null);
                setFilename('');
            } else {
                handleResetSignatureModal();
            }
    };
    
    const handleClearDigitalSignature = () => {
        // if (!disableClear) {

        setSelectedColorDraw('#1A54C2');
            if (isCanvasEmpty && !prevState?.sigCanvasData) {
                handleResetSignatureModal();
            } else {
                if (!isCanvasEmpty) {
                    sigCanvasRef.current.clear();
                }
                setSignatureImage(null);
                setSignature(null);
                setIsCanvasEmpty(true);
                setPrevState({ ...prevState, sigCanvasData: undefined });
            }
    };         

    const handleClearKeyboardSignature = () => {
        setInputName('');
        setSelectedFont(''); 
        setSelectedColorType('#1A54C2');
        // if (!disableClear) {
            if ( isInputEmpty || !inputName ) {
                handleResetSignatureModal();
            } else {
                const inputElement = document.getElementById('signatureInput');
                if (inputElement) {
                    inputElement.value = '';
                }
            }
    };
    
    const handleResetSignatureModal = () => {
        if(attorneyName) {
            setSelectedOption('')
        } else {
            // setIsInputEmpty(true); 
            setSelectedOption('')
            // setInputName('');
            setSignatureImage(prevState?.signatureImage);
            setSignature(prevState?.signatureImage);
        }
    };

    const handleUploadSignatureClick = async () => {
        if (previewImage) {
            setPrevStateToParent(previewImage);
            setIsUploadSignature(true);
            setIsDigitalSignature(false);
            setIsKeyboardSignature(false);
            setSignatureImage(previewImage);
            setSignature(previewImage);
            setPreviewImage(null);
            setSelectedOption('');
            changeSignature(previewImage);

        } else {
            setPrevStateToParent();
        }
    };
    
    const staticAlertTimerSignature = ( text ) => {
        if(alertState == true) {
          AlertToaster.error(text);
          setalertState(false);
          setTimeout(() => setalertState(true), [5000]);
        }
      } 

    const handleDigitalSignatureClick = async () => {
        const signatureData = (sigCanvasRef.current && sigCanvasRef.current.toDataURL()) || prevState?.sigCanvasData;
        konsole.log(signatureData, "Signature Data");
    
        if (signatureData) {
            // Convert the signature data to an image for dimension calculation
            const img = new Image();
            img.src = signatureData;
    
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
    
                const signatureBoundingBox = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const { data } = signatureBoundingBox;
    
                let nonEmptyPixels = 0;
    
                // Count non-empty pixels (i.e., area covered by signature)
                for (let i = 0; i < data.length; i += 4) {
                    const alpha = data[i + 3];
                    if (alpha > 0) {
                        nonEmptyPixels++;
                    }
                }
    
                // Calculate the area percentage covered by the signature
                const canvasArea = canvas.width * canvas.height;
                const signatureAreaPercentage = (nonEmptyPixels / canvasArea) * 100;
    
                // Set minimum area percentage threshold
                const minAreaPercentageThreshold = 1;
    
                if (signatureAreaPercentage < minAreaPercentageThreshold) {
                    staticAlertTimerSignature("Please provide a valid signature.");
                } else {
                    setPrevStateToParent(signatureData);
                    setIsDigitalSignature(true);
                    setIsUploadSignature(false);
                    setIsKeyboardSignature(false);
                    setSignatureImage(signatureData);
                    setSignature(signatureData);
                    setIsCanvasEmpty(true);
                    setSelectedOption('');
                    changeSignature(signatureData);
                }
            };
        } else {
            setPrevStateToParent();
        }
    };
    
    const handleKeyboardSignatureClick = async () => {
        const textSignature = convertTextToImageType(inputName, selectedFont, selectedColorType)
        if(textSignature){
            setPrevStateToParent(textSignature);
            setIsKeyboardSignature(false);
            setIsDigitalSignature(true);
            setIsUploadSignature(false);
            setSignatureImage(null);
            setSignature(null);
            setSelectedOption('')        
            changeSignature(textSignature);
        } else {
            setPrevStateToParent();
        }
    };
    
    // Convert Signature text to image
    const convertTextToImage = (text, selectedFont, selectedColorType, renderText = true, height = 55, x = 10, y = 35, background = '#fff') => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio || 1;
    
        // Ensure selectedFont is one of the fonts from your array
        selectedFont = fonts.includes(selectedFont) ? selectedFont : fonts[0];
    
        tempCtx.font = `23px ${selectedFont}`;
        const textWidth = tempCtx.measureText(text).width / pixelRatio;
    
        const maxWidth = 800;
        const canvasWidth = Math.min(textWidth + 20 * x, maxWidth);
    
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        canvas.width = canvasWidth;
        canvas.height = height;
    
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      
        const renderTextFunc = (font, color) => {
            ctx.font = `30px ${font}`;
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
        };
    
        // Check if selectedColorType is defined
        if (selectedColorType && renderText) {
            renderTextFunc(selectedFont, selectedColorType);
        } else if (renderText) {
            // Default to black color if selectedColorType is not defined
            renderTextFunc(selectedFont, '#1A54C2');
        }
    
        if (text && renderText) {
            setSignature(canvas.toDataURL('image/png', 1.0)); // for setting parent sign image
        }
    
        return canvas.toDataURL('image/png', 1.0);
      };
      

    const convertTextToImageType = (text, selectedFont, selectedColorType, renderText = true, height = 45, x = 10, y = 28, background = 'rgba(0, 0, 0, 0)') => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio || 1;
    
        // Ensure selectedFont is one of the fonts from your array
        selectedFont = fonts.includes(selectedFont) ? selectedFont : fonts[0];
    
        tempCtx.font = `23px ${selectedFont}`;
        const textWidth = tempCtx.measureText(text).width / pixelRatio;
    
        const maxWidth = 800;
        const canvasWidth = Math.min(textWidth + 20 * x, maxWidth);
    
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        canvas.width = canvasWidth;
        canvas.height = height;
    
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        const renderTextFunc = (font, color) => {
            ctx.font = `32px ${font}`;
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
        };
    
        if (renderText && selectedFont && selectedColorType) {
            renderTextFunc(selectedFont, selectedColorType);
        }
        if (text && renderText) {
            // No need to set the signature state here, it's already being set when calling this function
        }
    
        return canvas.toDataURL('image/png', 1.0);
    };

    const renderLabel = () => {
        if (primaryName) {
            return `${primaryName?.toUpperCase()}, Client`;
        } else if (attorneyName) {
            return <div dangerouslySetInnerHTML={{ __html: `${attorneyName?.toUpperCase()}, <br />Attorney & Counselor-at-Law LIFE POINT LAW` }} />;
        } else {
            return `${spouseName?.toUpperCase()}, Client`;
        }
    };

    return (
        <div>
            <div className='hideInPrint hideInSendDoc' id='AnnualMaintenancehideInPrint'>
                {selectedOption && (
                <>
                    <div style={{height:'100vh', width:'100vw', position:'fixed', top:'0', left:'0', backgroundColor:'#000', opacity:'0.5'}}></div>
                    <div className='mainAnnualMaintenancehideInPrint' style={{height: '620px', width: '650px', position: 'fixed', background: '#fff',top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding:'30px', zIndex: 3, borderRadius: '5px'}}>
                        <Row> 
                            <Col className='d-flex justify-content-between align-items-center text-black'>
                                <h3 className='fw-bold'>Create Signature</h3>
                                <img className='cursor-pointer fw-bolder' title='Cancel' onClick={()=>handleResetSignatureModal()} src='/icons/closeIcon.svg'></img>
                            </Col>
                        </Row>
                            <Row className='py-4 navbarAnnualMaintenance'>
                                <Col className='col-5 text-black'>
                                    <ul className="d-flex flex-row justify-content-between align-items-center navbar-nav">
                                        <li className={`nav-item ${isDigitalSignature ? 'selected' : ''}`} onClick={handleToggleDigitalSignature}>Draw</li>
                                        <li className={`nav-item ${isKeyboardSignature ? 'selected' : ''}`} onClick={handleToggleKeyboardSignature}>Type</li>
                                        <li className={`nav-item ${isUploadSignature ? 'selected' : ''}`} onClick={handleToggleImageSignature}>Upload</li>
                                    </ul> 
                                </Col>
                                <hr className={isDigitalSignature ? 'selected-draw' : isKeyboardSignature ? 'selected-type' : isUploadSignature ? 'selected-upload' : ''} />
                            </Row>
                        {isKeyboardSignature && (
                        <div>
                            <div>
                            <Col className='my-2 justify-content-center align-items-center' style={{ width: '585px', height: '315px', borderRadius: '5px', backgroundColor:'#F6F6F6' }}>
                                <Col className='d-flex justify-content-between align-items-center mx-4' style={{ height:'90px' }}>
                                    <select 
                                        style={{ width:'fit-content', cursor:'pointer', borderBottom: '1px solid #E6E6E6', borderTop:'0', borderLeft:'0', borderRight:'0', background:'none' }} 
                                        onChange={(e) => setSelectedFont(e.target.value)}
                                        value={selectedFont || ''}
                                    >
                                        <option value="" hidden>Select Font</option>
                                        {sampleFonts.map((font, index) => (
                                            <option key={index} value={font}>{font}</option>
                                        ))}
                                    </select>
                                    <input
                                        id="signatureInput"
                                        className='mx-2'
                                        placeholder={"Enter your name"}
                                        value={inputName}
                                        onChange={handleInputChange}
                                        style={{ border: '1px solid #E6E6E6', background: 'none', outline: 'none', zIndex:'4' }}
                                    />

                                    <p className='d-flex'>
                                        {['#1A54C2', '#000', '#C12B2B'].map((color, index) => (
                                            <span key={index} style={{ cursor:'pointer', display: 'inline-block', width: '21px', height: '21px', borderRadius: '50%', backgroundColor: color, marginRight: '10px', position: 'relative' }} onClick={() => handleColorSelectType(color)}>
                                                {selectedColorType === color && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '15px', color: 'white' }}>✔</span>}
                                            </span>
                                        ))}
                                    </p>
                                </Col>
                                    <Row id="fontSamples" className='d-flex justify-content-center align-items-center' style={{ margin: 'auto', borderBottom: '1px solid #E6E6E6', width: '485px', height: '175px', mixBlendMode: 'multiply' }}>
                                        {(!selectedFont || !inputName) && (
                                            <div>
                                            {(!selectedFont) ? (
                                              <p className='text-center' style={{ color: '#B3B3B3' }}>
                                                Please select a font of your choice for the signature.
                                              </p>
                                            ) : (
                                              <p className='text-center' style={{ color: '#B3B3B3' }}>
                                                Please enter your name for the signature.
                                              </p>
                                            )}
                                          </div>                                          
                                        )}
                                        {inputName && selectedFont && selectedColorType && (
                                            <div className='keyboardSignatureSample' style={{ overflow: 'hidden', marginTop: '124px', justifyContent: 'right', display: 'flex', alignItems: 'center', width:'fit-content' }}>
                                            <img
                                                src={convertTextToImageType(inputName, selectedFont, selectedColorType)}
                                                alt="Signature Sample"
                                                style={{ cursor: 'pointer', width:'100%' }}
                                            />
                                            </div>
                                        )}
                                    </Row>
                                </Col>
                            </div>
                            <Row>
                            <p className="py-3" style={{color:'#B3B3B3'}}>By signing this document with an electronic signature, I agree that such signature will be as valid as handwritten signatures to the extent allowed by local law</p>
                                <Col className='mt-2 d-flex flex-row justify-content-between align-items-center btnAnnualMaintenance'>
                                    <Row className='btnHoverEffect'>
                                        <button className='theme-btn' onClick={handleClearKeyboardSignature}>
                                            {/* {!inputName || isInputEmpty || (disableClear) ? 'Cancel' : 'Clear'} */}
                                            {!inputName || isInputEmpty ? 'Cancel' : 'Clear'}
                                        </button>
                                    </Row>
                                    <Row className={`btnAnnualMaintenance ${selectedFont && inputName  ? 'btnHoverEffect' : ''}`}>
                                        <button className='theme-btn' onClick={handleKeyboardSignatureClick} disabled={!inputName || !selectedFont}>Accept and sign</button>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                        )}
                        {isDigitalSignature && (
                            <Col>
                                <div>
                                    <Col className='my-2 d-flex justify-content-center align-items-center' style={{ position:'relative', width: '585px', height: '315px', borderRadius: '5px', backgroundColor:'#F6F6F6' }}>
                                        <Row className='d-flex justify-content-center align-items-center' style={{ borderBottom: '1px solid #E6E6E6', borderTop: '1px solid #E6E6E6', marginTop:'20px', width: '585px', height: '215px' }} >
                                            <p className='d-flex justify-content-end' style={{position:'absolute', top:'35px', right:'11px'}}>
                                                {['#1A54C2', '#000', '#C12B2B'].map((color, index) => (
                                                    <span key={index} style={{ cursor:'pointer', display: 'inline-block', width: '21px', height: '21px', borderRadius: '50%', backgroundColor: color, marginRight: '10px', position: 'relative' }} onClick={() => handleColorSelectDraw(color)}>
                                                        {selectedColorDraw === color && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '15px', color: 'white' }}>✔</span>}
                                                    </span>
                                                ))}
                                            </p>
                                            <Row style={{ cursor:'pointer'}}>
                                                { (prevState?.sigCanvasData) ? (
                                                    <div style={{ position: 'relative', width:'585px', maxHeight:'215px' }}>
                                                        <img
                                                            className='my-1'
                                                            src={prevState?.sigCanvasData}
                                                            alt="Signature"
                                                            style={{ width: '100%', height: '100%', objectFit:'fill' }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className='d-flex justify-content-center' style={{ position:'relative' }} >
                                                        {isCanvasEmpty && (
                                                            <p style={{ position: 'absolute', top: '50%', left: '50%', userSelect: 'none', transform: 'translate(-50%, -50%)', color:'#B3B3B3' }} className='py-3 text-center'>Please fill your signature here.</p>
                                                        )}
                                                        <SignatureCanvas id="SignatureCanvas" ref={sigCanvasRef} onEnd={() => setIsCanvasEmpty(sigCanvasRef.current.isEmpty())} canvasProps={{ width: 585, height: 215 }} velocityFilterWeight={0.9} minWidth={0.3} maxWidth={4} penColor={selectedColorDraw}/>
                                                        {sigCanvasRef.current && konsole.log(sigCanvasRef.current.isEmpty(), "Canvas is empty?")}
                                                    </div>
                                                )}
                                            </Row>
                                        </Row>
                                    </Col>
                                </div>
                                <Row>
                                    <p className="py-3" style={{color:'#B3B3B3'}}>By signing this document with an electronic signature, I agree that such signature will be as valid as handwritten signatures to the extent allowed by local law</p>
                                    <Col className='mt-2 d-flex flex-row justify-content-between align-items-center btnAnnualMaintenance'>
                                        <Row className='btnHoverEffect'>
                                        <button className='theme-btn' onClick={handleClearDigitalSignature}>
                                            {(!prevState?.sigCanvasData && isCanvasEmpty) ? 'Cancel' : 'Clear'}
                                        </button>
                                        </Row>
                                        <Row className={`btnAnnualMaintenance ${ !isCanvasEmpty || prevState?.sigCanvasData ? 'btnHoverEffect' : ''}`}>
                                            <button className='theme-btn' onClick={handleDigitalSignatureClick} disabled={!prevState?.sigCanvasData && isCanvasEmpty}>Accept and sign</button>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        )}
                        {isUploadSignature && (
                        <div>
                            <Col className='my-2 d-flex flex-column align-items-center' style={{ width: '585px', height: '315px', borderRadius: '5px', border:'2px dashed #E1E1E2' }} onDragOver={handleDragOver} onDrop={handleDrop}>
                                <div className='d-flex flex-column align-items-center justify-content-center' style={{ width: '100%', height: '100%' }}>
                                    {previewImage && (
                                        <>
                                        <img src={previewImage} alt="Uploaded Signature" style={{ maxWidth: '190px', maxHeight: '60px', marginBottom: '10px' }} />
                                        <div className="d-flex align-items-center">
                                            <p>{filename}</p>
                                            <p className='mx-1' style={{color:'#000'}}>or</p>
                                                <label htmlFor="signatureFileInput" style={{color:'#0D6EFD', cursor:'pointer'}} className='fw-bold'>{previewImage ? 'Browse again' : 'Select image'}</label>
                                                <input type="file" id="signatureFileInput" accept="image/*" onChange={(e) => handleFileChange(e)} style={{ display: 'none' }} key={isDigitalSignature ? 'digital' : 'file'}/>
                                        </div>
                                        </>
                                    )}
                                    {!previewImage && (
                                        <div className='text-center'>
                                            <h3 className='fw-bold'>Drag & drop or select an image signature to upload</h3>
                                        </div>
                                    )}
                                    {!previewImage && (
                                        <div className='my-2 d-flex justify-content-center align-items-center btnHoverEffect'>
                                            <label htmlFor="signatureFileInput" style={{color:'white', cursor:'pointer'}} className='theme-btn'>Select image</label>
                                            <input type="file" id="signatureFileInput" accept="image/*" onChange={(e) => handleFileChange(e)} style={{ display: 'none' }} key={isDigitalSignature ? 'digital' : 'file'}/>
                                        </div>
                                    )}
                                </div>
                            </Col>
                            <Row>
                                <p className="py-3" style={{color:'#B3B3B3'}}>By signing this document with an electronic signature, I agree that such signature will be as valid as handwritten signatures to the extent allowed by local law</p>
                                <Col className='mt-2 d-flex flex-row justify-content-between align-items-center btnAnnualMaintenance'>
                                    <Row className='btnHoverEffect'>
                                        <button className='theme-btn' onClick={handleClearUploadSignature}>
                                            {(!previewImage) ? 'Cancel' : 'Clear'}
                                        </button>
                                    </Row>
                                    <Row className={`btnAnnualMaintenance ${previewImage ? 'btnHoverEffect' : ''}`}>
                                        <button className='theme-btn' onClick={handleUploadSignatureClick} disabled={!previewImage}>Accept and sign</button>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                        )}
                    </div>
                </>
                )}
                {hideChangeOptions != true && (position === 'bottom' ? (
                    <Row>
                        <div id='primaryContainer' className='hideInPrint hideInSendDoc ps-3 d-flex'>
                            <button
                                className='theme-btn h-auto w-auto cursor-pointer text-white d-flex justify-content-center align-items-center signatureButton'
                                onClick={handleOptionClick}
                            >
                                Click here to Sign
                            </button>
                        </div>
                    </Row>
                ) : (
                    <Row>
                    {(from === 'paralegal' && attorneyName && signatureImageAttorneyAPI) ? (
                        <Col id='primaryContainer' className='hideInPrint hideInSendDoc ps-3 d-flex'>
                        <button
                            className='theme-btn h-auto w-auto cursor-pointer text-white d-flex justify-content-center align-items-center signatureButton'
                            onClick={handleToggleChangeSignature}
                        >
                            Change Signature
                        </button>
                        </Col>
                    ) : (
                        (from === 'link' && attorneyName && signatureImageAttorneyAPI) ? null : (
                        <Col id='primaryContainer' className='hideInPrint hideInSendDoc ps-3 d-flex'>
                            <button
                            className='theme-btn h-auto w-auto cursor-pointer text-white d-flex justify-content-center align-items-center signatureButton'
                            onClick={handleOptionClick}
                            >
                            Click here to Sign
                            </button>
                            {attorneyName && signatureImageAttorneyAPI && signatureImage && (
                            <button
                                className='border-0 bg-transparent h-auto w-auto cursor-pointer text-white d-flex justify-content-center align-items-center text-decoration-underline changeButton'
                                onClick={handleToggleChangeSignature}
                            >
                                Change Signature
                            </button>
                            )}
                        </Col>
                        )
                    )}
                    </Row>
                ))}
            </div>
            <div>
            <Row>
                {!selectedFont && !signatureImage && (
                    <div className='d-inline-flex my-1' style={{ width: 'fit-content'}}>
                        <div className='p-4'></div>
                    </div>
                )}
                {selectedFont && !signatureImage && !signatureImageAttorneyAPI && (
                    <div className='d-inline-flex my-1' style={{ width: 'fit-content'}}>
                        <img style={{ width: '100%', objectFit: 'fill' }} src={convertTextToImage((inputName), selectedFont, selectedColorType)} alt="Keyboard" />
                    </div>
                )}
                {(signatureImage) && (
                    <div className='m-2' style={{ position: 'relative', width: isUploadSignature || isDigitalSignature || signatureImageAttorneyAPI ? '270px' : 'fit-content', maxHeight: '45px', backgroundColor: 'transparent', background:'transparent' }}>
                        <img
                            className='my-1'
                            src={(signatureImage)}
                            alt="Signature"
                            style={{
                                width: 'fit content',
                                height: '100%',
                                objectFit: isUploadSignature || isDigitalSignature || signatureImageAttorneyAPI ? 'fill' : 'contain',
                                backgroundColor: 'transparent',
                                background:'transparent',
                            }}
                        />
                    </div>
                )}
            </Row>
            <label className='text-start' style={fontSizeLabel}>
                {renderLabel()}
            </label>
            </div>
        </div>
    );
};

// const SignatureInputWithDispath = connect(mapStateToProps, mapDispatchToProps)(SignatureInput);
const SignatureInputWithDispath =SignatureInput;