import React, { useState, useRef, useEffect } from 'react'
import {
  Button,
  Modal,
  Table,
  Row,
  Col
} from "react-bootstrap";
import konsole from '../../control/Konsole';
import AlertToaster from '../../control/AlertToaster';
import { connect } from "react-redux";
import { SET_LOADER } from "../../../components/Store/Actions/action";
import SignatureCanvas from 'react-signature-canvas';
import AnnualMaintanceAgreement from "./AnnualMaintanceAgreement";

const SignatureAnnualMaintanance = ({genereateViewPdf, signatureAMAModalOpen, setSignatureAMAModalOpen, primaryName, spouseName, attorneyName, willBasedPlanAmount, checkedPlanValue, jsonforradiocheeckbox}) => {
    konsole.log(attorneyName,"ajdjddjadjsjdsjdsdjsdsj")
    const [viewAMAModalOpen, setViewAMAModalOpen] = useState(false);
    const [selectedOptionAttorney, setSelectedOptionAttorney] = useState('');
    const [selectedOptionUser, setSelectedOptionUser] = useState('');
    const [selectedOptionSpouse, setSelectedOptionSpouse] = useState('');
    const [signatureImageAttorney, setSignatureImageAttorney] = useState(null);
    const [signatureImageUser, setSignatureImageUser] = useState(null);
    const [signatureImageSpouse, setSignatureImageSpouse] = useState(null);
    const [keyboardSignatureAttorney, setKeyboardSignatureAttorney] = useState('');
    const [keyboardSignatureUser, setKeyboardSignatureUser] = useState('');
    const [keyboardSignatureSpouse, setKeyboardSignatureSpouse] = useState('');
    const [selectedFontAttorney, setSelectedFontAttorney] = useState(null);
    const [selectedFontUser, setSelectedFontUser] = useState('');
    const [selectedFontSpouse, setSelectedFontSpouse] = useState('');
    const [isUploadSignatureUser, setIsUploadSignatureUser] = useState(false);
    const [isUploadSignatureSpouse, setIsUploadSignatureSpouse] = useState(false);
    const [isUploadSignatureAttorney, setIsUploadSignatureAttorney] = useState(false);
    const [isDigitalSignatureUser, setIsDigitalSignatureUser] = useState(false);
    const [isDigitalSignatureSpouse, setIsDigitalSignatureSpouse] = useState(false);
    const [isDigitalSignatureAttorney, setIsDigitalSignatureAttorney] = useState(false);
    const [isKeyboardSignatureAttorney, setIsKeyboardSignatureAttorney] = useState(false);
    const [isKeyboardSignatureUser, setIsKeyboardSignatureUser] = useState(false);
    const [isKeyboardSignatureSpouse, setIsKeyboardSignatureSpouse] = useState(false);
    const [fontsToShow, setFontsToShow] = useState({ start: 0, end: 3 });
    const sigCanvasRefAttorney = useRef({});
    const sigCanvasRefUser = useRef({});
    const sigCanvasRefSpouse = useRef({});

    const fonts = [
        "Pacifico, cursive",
        "Sacramento, cursive",
        "Arizonia, cursive",
        "Clicker Script, cursive",
        "Yellowtail, cursive",
        "Aguafina Script, cursive",
        "Kristi, cursive",
        "Meow Script, cursive",
        "Qwigley, cursive",
        "Rochester, cursive",
        "Great Vibes, cursive",
        "Dancing Script, cursive",
        "Cookie, cursive",
        "Cedarville Cursive, cursive",
        "Satisfy, cursive",
        "Lobster, cursive",
        "Alex Brush, cursive",
        "Allura, cursive",
        "Sofia, cursive",
        "Lovers Quarrel, cursive",
        "Parisienne, cursive",
        "Kaushan Script, cursive"
    ];

    const showNextFonts = () => {
        let newStart = fontsToShow.end;
        let newEnd = fontsToShow.end + 3;
        if (newEnd > fonts.length) {
            newStart = 0;
            newEnd = 3;
        }
        setFontsToShow({ start: newStart, end: newEnd });
    };

    const sampleFonts = fonts.slice(fontsToShow.start, fontsToShow.end);
    
    const handleOptionClickAttorney = () => {
        setSelectedOptionAttorney(true);
        setSelectedOptionUser(false);
        setSelectedOptionSpouse(false);
        setIsKeyboardSignatureAttorney(true);
        setIsDigitalSignatureAttorney(false);
        setIsUploadSignatureAttorney(false);
    };
    
    const handleToggleKeyboardSignatureAttorney = () => {
        setIsDigitalSignatureAttorney(false);
        setSignatureImageAttorney(false);
        setIsKeyboardSignatureAttorney(true);
        setIsUploadSignatureAttorney(false)
    };
    
    const handleToggleDigitalSignatureAttorney = () => {
        setSignatureImageAttorney(false);
        setIsKeyboardSignatureAttorney(false);
        setKeyboardSignatureAttorney(false);
        setIsDigitalSignatureAttorney(true);
        setIsUploadSignatureAttorney(false)
    };
    
    const handleToggleImageSignatureAttorney = () => {
        setIsDigitalSignatureAttorney(false);
        setIsKeyboardSignatureAttorney(false);
        setKeyboardSignatureAttorney(false);
        setIsUploadSignatureAttorney(true);
    };
    
    const handleFileChangeAttorney = (event) => {
        const file = event.target.files[0];
    
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setSignatureImageAttorney(reader.result);
            setIsDigitalSignatureAttorney(false);
            setSelectedOptionAttorney('');
          };
          reader.readAsDataURL(file);
        }
    };
    
    const handleClearSignatureAttorney = () => {
        sigCanvasRefAttorney.current.clear();
    };
    
    const handleRemoveKeyboardSignatureAttorney = () => {
        setSelectedOptionAttorney('');
        setSelectedFontAttorney('');
    };
    
    const handleRemoveKeyboardSignatureUser = () => {
        setSelectedOptionUser('');
        setSelectedFontUser('');
    };
    
    const handleRemoveKeyboardSignatureSpouse = () => {
        setSelectedOptionSpouse('');
        setSelectedFontSpouse('');
    };
    
    const handleDigitalSignatureClickAttorney = () => {
        const signatureData = sigCanvasRefAttorney.current.toDataURL();
        setIsDigitalSignatureAttorney(true);
        setSignatureImageAttorney(signatureData);
        setSelectedOptionAttorney('');
    };

    const handleKeyboardSignatureClickAttorney = () => {
        setIsKeyboardSignatureAttorney(true);
        setIsDigitalSignatureAttorney(false);
        setIsUploadSignatureAttorney(false);
        setSelectedOptionAttorney('');
        setSignatureImageAttorney('')
    };
    
    const handleDigitalSignatureClickUser = () => {
        const signatureData = sigCanvasRefUser.current.toDataURL();
        setIsDigitalSignatureUser(true);
        setSignatureImageUser(signatureData);
        setSelectedOptionUser('');
    };

    const handleKeyboardSignatureClickUser = () => {
        setIsKeyboardSignatureUser(true);
        setIsDigitalSignatureUser(false);
        setIsUploadSignatureUser(false);
        setSelectedOptionUser('');
        setSignatureImageUser('')
    };
    
    const handleDigitalSignatureClickSpouse = () => {
        const signatureData = sigCanvasRefSpouse.current.toDataURL();
        setIsDigitalSignatureSpouse(true);
        setSignatureImageSpouse(signatureData);
        setIsUploadSignatureSpouse(false);
        setSelectedOptionSpouse('');
    };

    const handleKeyboardSignatureClickSpouse = () => {
        setIsKeyboardSignatureSpouse(true);
        setIsDigitalSignatureSpouse(false);
        setIsUploadSignatureSpouse(false);
        setSelectedOptionSpouse('');
        setSignatureImageSpouse('')
    };

    const handleOptionClickUser = () => {
        setSelectedOptionUser(true);
        setSelectedOptionAttorney(false);
        setSelectedOptionSpouse(false);
        setIsKeyboardSignatureUser(true);
        setIsDigitalSignatureUser(false);
        setIsUploadSignatureUser(false);
    };
    
    const handleToggleKeyboardSignatureUser = () => {
        setIsDigitalSignatureUser(false);
        setSignatureImageUser(false);
        setIsKeyboardSignatureUser(true);
        setIsUploadSignatureUser(false)
    };
    
    const handleToggleDigitalSignatureUser = () => {
        setSignatureImageUser(false);
        setIsKeyboardSignatureUser(false);
        setKeyboardSignatureUser(false);
        setIsDigitalSignatureUser(true);
        setIsUploadSignatureUser(false)
    };
    
    const handleToggleImageSignatureUser = () => {
        setIsDigitalSignatureUser(false);
        setIsKeyboardSignatureUser(false);
        setKeyboardSignatureUser(false);
        setIsUploadSignatureUser(true);
    };
    
    const handleFileChangeUser = (event) => {
        const file = event.target.files[0];
    
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setSignatureImageUser(reader.result);
            setIsDigitalSignatureUser(false);
            setSelectedOptionUser('');
          };
          reader.readAsDataURL(file);
        }
    };
    
    const handleClearSignatureUser = () => {
        sigCanvasRefUser.current.clear();
    };
    
    const handleOptionClickSpouse = () => {
        setSelectedOptionSpouse(true);
        setSelectedOptionAttorney(false);
        setSelectedOptionUser(false);
        setIsKeyboardSignatureSpouse(true);
        setIsDigitalSignatureSpouse(false);
        setIsUploadSignatureSpouse(false);
    };
    
    const handleToggleKeyboardSignatureSpouse = () => {
        setIsDigitalSignatureSpouse(false);
        setSignatureImageSpouse(false);
        setIsKeyboardSignatureSpouse(true);
        setIsUploadSignatureSpouse(false);
    };
    
    const handleToggleDigitalSignatureSpouse = () => {
        setSignatureImageSpouse(false);
        setIsKeyboardSignatureSpouse(false);
        setKeyboardSignatureSpouse(false);
        setIsDigitalSignatureSpouse(true);
        setIsUploadSignatureSpouse(false);
    };
    
    const handleToggleImageSignatureSpouse = () => {
        setIsDigitalSignatureSpouse(false);
        setIsKeyboardSignatureSpouse(false);
        setKeyboardSignatureSpouse(false);
        setIsUploadSignatureSpouse(true);
    };
    
    const handleFileChangeSpouse = (event) => {
        const file = event.target.files[0];
    
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setSignatureImageSpouse(reader.result);
            setIsDigitalSignatureSpouse(false);
            setSelectedOptionSpouse('');
          };
          reader.readAsDataURL(file);
        }
    };
    
    const handleClearSignatureSpouse = () => {
        sigCanvasRefSpouse.current.clear();
    };

    const clearSignatures = () => {
        setSelectedFontAttorney('');
        handleToggleDigitalSignatureAttorney();
        handleToggleImageSignatureAttorney();
        setSelectedFontUser('');
        handleToggleDigitalSignatureUser();
        handleToggleImageSignatureUser();
        setSelectedFontSpouse('');
        handleToggleDigitalSignatureSpouse();
        handleToggleImageSignatureSpouse();
    };

    // Convert Signature text to image
    const convertTextToImage = (text, selectedFontSpouse, width = 150, height = 45, x = 10, y = 25, background = '#fff') => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        const pixelRatio = window.devicePixelRatio || 1;
    
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
    
        ctx.scale(pixelRatio, pixelRatio);
    
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        if ( selectedFontSpouse) {
            const fontToUse = selectedFontSpouse;
            ctx.font = `23px ${fontToUse}`;
            ctx.fillStyle = '#000';
            ctx.fillText(text, x * pixelRatio, y * pixelRatio);
        }
    
        return canvas.toDataURL('image/png', 1.0);
    };      

    const handleViewAMA = () => {
        if (!selectedFontAttorney && !isDigitalSignatureAttorney && !signatureImageAttorney) {
            AlertToaster.error(`Please fill all signature before proceed to View AMA`);
    
            const attorneyContainer = document.getElementById('attorneyContainer');
            if (attorneyContainer) {
                attorneyContainer.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        } else if (!selectedFontUser && !isDigitalSignatureUser && !signatureImageUser) {
            AlertToaster.error(`Please fill all signature before proceed to View AMA`);
    
            const primaryContainer = document.getElementById('primaryContainer');
            if (primaryContainer) {
                primaryContainer.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        } else if (spouseName && (!selectedFontSpouse && !isDigitalSignatureSpouse && !signatureImageSpouse)) {
            AlertToaster.error(`Please fill all signature before proceed to View AMA`);
    
            const spouseContainer = document.getElementById('spouseContainer');
            if (spouseContainer) {
                spouseContainer.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }
        setViewAMAModalOpen(true);
    };

    return (
        <Modal id="modal-Anuual-Signature-Maintanance" show={signatureAMAModalOpen} onHide={() => setSignatureAMAModalOpen(false)} animation="false" backdrop="static">
            {/* <Modal.Header closeButton style={{ border: "none" }} closeVariant="white">
                <Modal.Title>Signatue Annual Maintenance</Modal.Title>
            </Modal.Header>
            <Modal.Body className='mainSignatureAnnualMaintance'>
                <Row>
                    <div className='headingAnnualMaintance '>
                        <div className='hideInPrint'>
                            {selectedOptionAttorney && (
                            <div style={{height: '300px', width: '500px', border: '1px solid #720C20', position: 'absolute', background: '#fff', right:'10px', bottom: '25px', zIndex: 1, borderRadius: '5px'}}>
                                <div className='d-flex justify-content-around align-items-baseline mt-1 '>
                                    <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none'}} onClick={() => handleToggleKeyboardSignatureAttorney(true)}>Keyboard</button>
                                    <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none'}} onClick={() => handleToggleDigitalSignatureAttorney(true)}>Touchpad</button>
                                    <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none'}} onClick={() => handleToggleImageSignatureAttorney(true)}>Upload</button>
                                    <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none'}} onClick={handleRemoveKeyboardSignatureAttorney}>&#9932;</button>
                                </div>
                                {isUploadSignatureAttorney && (
                                <div className='my-2 d-flex align-items-center justify-content-center' style={{ position: 'relative', boxShadow: 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px', width: '450px', height: '215px', marginLeft: '23px', borderRadius: '5px' }}>
                                <div>
                                    <label htmlFor="signatureFileInputSpouse" style={{color:'white'}} className='theme-btn'>Insert Image</label>
                                    <input type="file" id="signatureFileInputSpouse" accept="image/*" onChange={(e) => handleFileChangeAttorney(e)} style={{ display: 'none' }} key={isDigitalSignatureAttorney ? 'digital' : 'file'}/>
                                </div>
                                </div>
                            )}
                                {isDigitalSignatureAttorney && (
                                <div>
                                    <div className='my-2' style={{ position: 'relative', boxShadow: 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px', width: '450px', height: '215px', marginLeft: '23px', borderRadius: '5px' }}>
                                    <SignatureCanvas id="SignatureCanvas" ref={sigCanvasRefAttorney} canvasProps={{ width: 450, height: 215 }} velocityFilterWeight={0.9} minWidth={0.3} maxWidth={3} penColor="#720C20" style={{ border: '1px solid #000' }} />
                                    </div>
                                    <div>
                                        <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none', position: 'absolute', bottom: '5px', left: '5px'}} onClick={handleDigitalSignatureClickAttorney}>Save</button>
                                        <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none', position: 'absolute', bottom: '5px', right: '5px'}} onClick={handleClearSignatureAttorney}>Clear</button>
                                    </div>
                                </div>
                                )}
                                {isKeyboardSignatureAttorney && (
                                    <div>
                                        <div className='my-2 d-flex align-items-center' style={{ position: 'relative', boxShadow: 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px', width: '450px', height: '215px', marginLeft: '23px', borderRadius: '5px' }}>
                                            <div id="fontSamples" className='d-flex flex-row justify-content-around' style={{height:'110px'}}>
                                                {sampleFonts.map((font, index) => (
                                                    <div className='keyboardSigantureSample' key={index} style={{ margin:'10px', width: '130px', display:'flex', alignItems:'center', boxShadow: font === selectedFontAttorney ? 'rgba(114, 12, 32, 0.9) 0px 0px 0px 3px' : 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px' }} onClick={() => setSelectedFontAttorney(font)}>
                                                        <img
                                                            src={convertTextToImage(attorneyName, font)}
                                                            alt="Signature Sample"
                                                            style={{width:'100%'}}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none', position: 'absolute', bottom: '5px', left: '5px'}} onClick={handleKeyboardSignatureClickAttorney}>Save</button>
                                            <button className='float-end btn btn-outline-danger cursor-pointer mt-3' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none', position: 'absolute', bottom: '5px', right: '5px'}} onClick={showNextFonts}>Show More</button>
                                        </div>
                                    </div>
                                )}
                                {!isKeyboardSignatureAttorney && keyboardSignatureAttorney && selectedFontAttorney && (
                                    <div className='d-inline-flex my-2' style={{ boxShadow: 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px' }}>
                                        <img src={convertTextToImage(keyboardSignatureAttorney, selectedFontAttorney)} alt="Keyboard Signature" style={{ width: 'fit-content', maxHeight: '50px' }} />
                                    </div>
                                )}
                            </div>
                            )}
                        </div>
                        <div className='hideInPrint'>
                            {selectedOptionUser && (
                            <div style={{height: '300px', width: '500px', border: '1px solid #720C20', position: 'absolute', background: '#fff', right:'10px', bottom: '25px', zIndex: 1, borderRadius: '5px'}}>
                                <div className='d-flex justify-content-around align-items-baseline mt-1'>
                                    <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none'}} onClick={() => handleToggleKeyboardSignatureUser(true)}>Keyboard</button>
                                    <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none'}} onClick={() => handleToggleDigitalSignatureUser(true)}>Touchpad</button>
                                    <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none'}} onClick={() => handleToggleImageSignatureUser(true)}>Upload</button>
                                    <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none'}} onClick={handleRemoveKeyboardSignatureUser}>&#9932;</button>
                                </div>
                                {isUploadSignatureUser && (
                                <div className='my-2 d-flex align-items-center justify-content-center' style={{ position: 'relative', boxShadow: 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px', width: '450px', height: '215px', marginLeft: '23px', borderRadius: '5px' }}>
                                <div>
                                    <label htmlFor="signatureFileInputUser" style={{color:'white'}} className='theme-btn'>Insert Image</label>
                                    <input type="file" id="signatureFileInputUser" accept="image/*" onChange={(e) => handleFileChangeUser(e)} style={{ display: 'none' }} key={isDigitalSignatureUser ? 'digital' : 'file'}/>
                                </div>
                                </div>
                            )}
                                {isDigitalSignatureUser && (
                                <div>
                                    <div className='my-2' style={{ position: 'relative', boxShadow: 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px', width: '450px', height: '215px', marginLeft: '23px', borderRadius: '5px' }}>
                                    <SignatureCanvas id="SignatureCanvas" ref={sigCanvasRefUser} canvasProps={{ width: 450, height: 215 }} velocityFilterWeight={0.9} minWidth={0.3} maxWidth={3} penColor="#720C20" style={{ border: '1px solid #000' }} />
                                    </div>
                                    <div>
                                        <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none', position: 'absolute', bottom: '5px', left: '5px'}} onClick={handleDigitalSignatureClickUser}>Save</button>
                                        <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none', position: 'absolute', bottom: '5px', right: '5px'}} onClick={handleClearSignatureUser}>Clear</button>
                                    </div>
                                </div>
                                )}
                                {isKeyboardSignatureUser && (
                                    <div>
                                        <div className='my-2 d-flex align-items-center' style={{ position: 'relative', boxShadow: 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px', width: '450px', height: '215px', marginLeft: '23px', borderRadius: '5px' }}>
                                            <div id="fontSamples" className='d-flex flex-row justify-content-around' style={{height:'110px'}}>
                                                {sampleFonts.map((font, index) => (
                                                    <div className='keyboardSigantureSample' key={index} style={{ margin:'10px', width: '130px', display:'flex', alignItems:'center', boxShadow: font === selectedFontUser ? 'rgba(114, 12, 32, 0.9) 0px 0px 0px 3px' : 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px'}} onClick={() => setSelectedFontUser(font)}>
                                                        <img
                                                            src={convertTextToImage(primaryName, font)}
                                                            alt="Signature Sample"
                                                            style={{width:'100%'}}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none', position: 'absolute', bottom: '5px', left: '5px'}} onClick={handleKeyboardSignatureClickUser}>Save</button>
                                            <button className='float-end btn btn-outline-danger cursor-pointer mt-3' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none', position: 'absolute', bottom: '5px', right: '5px'}} onClick={showNextFonts}>Show More</button>
                                        </div>
                                    </div>
                                )}
                                {!isKeyboardSignatureUser && keyboardSignatureUser && selectedFontUser && (
                                    <div className='d-inline-flex my-2' style={{ boxShadow: 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px' }}>
                                        <img src={convertTextToImage(keyboardSignatureUser, selectedFontUser)} alt="Keyboard Signature" style={{ width: 'fit-content', maxHeight: '50px' }} />
                                    </div>
                                )}
                            </div>
                            )}
                        </div>
                        <div className='hideInPrint'>
                            {selectedOptionSpouse && (
                            <div style={{height: '300px', width: '500px', border: '1px solid #720C20', position: 'absolute', background: '#fff', right:'10px', bottom: '25px', zIndex: 1, borderRadius: '5px'}}>
                            <div className='d-flex justify-content-around align-items-baseline mt-1'>
                                <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none'}} onClick={() => handleToggleKeyboardSignatureSpouse(true)}>Keyboard</button>
                                <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none'}} onClick={() => handleToggleDigitalSignatureSpouse(true)}>Touchpad</button>
                                <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none'}} onClick={() => handleToggleImageSignatureSpouse(true)}>Upload</button>
                                <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none'}} onClick={handleRemoveKeyboardSignatureSpouse}>&#9932;</button>
                            </div>
                            {isUploadSignatureSpouse && (
                                <div className='my-2 d-flex align-items-center justify-content-center' style={{ position: 'relative', boxShadow: 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px', width: '450px', height: '215px', marginLeft: '23px', borderRadius: '5px' }}>
                                <div>
                                    <label htmlFor="signatureFileInputSpouse" style={{color:'white'}} className='theme-btn'>Insert Image</label>
                                    <input type="file" id="signatureFileInputSpouse" accept="image/*" onChange={(e) => handleFileChangeSpouse(e)} style={{ display: 'none' }} key={isDigitalSignatureSpouse ? 'digital' : 'file'}/>
                                </div>
                                </div>
                            )}
                            {isDigitalSignatureSpouse && (
                                <div>
                                    <div className='my-2' style={{ position: 'relative', boxShadow: 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px', width: '450px', height: '215px', marginLeft: '23px', borderRadius: '5px' }}>
                                        <SignatureCanvas id="SignatureCanvas" ref={sigCanvasRefSpouse} canvasProps={{ width: 450, height: 215 }} velocityFilterWeight={0.9} minWidth={0.3} maxWidth={3} penColor="#720C20" style={{ border: '1px solid #000' }} />
                                    </div>
                                    <div>
                                        <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none', position: 'absolute', bottom: '5px', left: '5px'}} onClick={handleDigitalSignatureClickSpouse}>Save</button>
                                        <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none', position: 'absolute', bottom: '5px', right: '5px'}} onClick={handleClearSignatureSpouse}>Clear</button>
                                    </div>
                                </div>
                                )}
                            {isKeyboardSignatureSpouse && (
                            <div>
                                <div className='my-2 d-flex align-items-center' style={{ position: 'relative', boxShadow: 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px', width: '450px', height: '215px', marginLeft: '23px', borderRadius: '5px' }}>
                                    <div id="fontSamples" className='d-flex flex-row justify-content-around' style={{height:'110px'}}>
                                        {sampleFonts.map((font, index) => (
                                            <div className='keyboardSigantureSample' key={index} style={{ margin:'10px', width: '130px', display:'flex', alignItems:'center', boxShadow: font === selectedFontSpouse ? 'rgba(114, 12, 32, 0.9) 0px 0px 0px 3px' : 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px' }} onClick={() => setSelectedFontSpouse(font)}>
                                                <img
                                                    src={convertTextToImage(spouseName, font)}
                                                    alt="Signature Sample"
                                                    style={{width:'100%'}}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <button className='btn btn-outline-danger cursor-pointer' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none', position: 'absolute', bottom: '5px', left: '5px'}} onClick={handleKeyboardSignatureClickSpouse}>Save</button>
                                    <button className='float-end btn btn-outline-danger cursor-pointer mt-3' style={{fontSize:'13px', backgroundColor:'#720C20', color:'white', border:'none', position: 'absolute', bottom: '5px', right: '5px'}} onClick={showNextFonts}>Show More</button>
                                </div>
                            </div>
                        )}
                        {!isKeyboardSignatureSpouse && keyboardSignatureSpouse && selectedFontSpouse && (
                            <div className='d-inline-flex my-2' style={{ boxShadow: 'rgba(114, 12, 32, 0.3) 0px 0px 0px 3px' }}>
                                <img src={convertTextToImage(keyboardSignatureSpouse, selectedFontSpouse)} alt="Keyboard Signature" style={{ width: 'fit-content', maxHeight: '50px' }} />
                            </div>
                        )}
                            </div>
                        )}
                        </div>
                        <div className='ms-5 my-4'>
                        {attorneyName && (
                            <Row>
                                <Col className='col-5'>
                                    <label className='textColorOfAgreement'>{attorneyName}'s Signature(s): <br />
                                    Attorney & Counselor-at-Law <br />LIFE POINT LAW</label>
                                </Col>
                            <Col id='attorneyContainer' className='col-7'>
                                <label
                                    className='theme-btn h-auto text-white cursor-pointer ms-3 fw-bold hideInPrint'
                                    onClick={handleOptionClickAttorney}
                                >
                                    Signature
                                </label>
                                <Row>
                                    {!signatureImageAttorney && (
                                        <div className='d-inline-flex my-2' style={{ width: 'fit-content' }}>
                                            <img src={convertTextToImage(attorneyName, selectedFontAttorney)} alt="Keyboard" />
                                        </div>
                                    )}
                                    {signatureImageAttorney && (
                                        <div style={{ position: 'relative', width:'200px', maxHeight:'60px' }}>
                                            <img
                                            className='my-2'
                                            src={signatureImageAttorney}
                                            alt="Signature"
                                            style={{ width: '100%', height: '100%' }}
                                            />
                                        </div>
                                    )}
                                </Row>
                            </Col>
                            </Row>
                            )}
                        </div>
                        <div className='ms-5 my-4'>
                        {primaryName &&(
                            <Row>
                                <Col className='col-5'>
                                <label className='textColorOfAgreement'>{primaryName}'s Signature(s): <br />Client </label>
                                </Col>
                                <Col id='primaryContainer' className='col-7'>
                                    <label
                                        className='theme-btn h-auto text-white cursor-pointer ms-3 fw-bold hideInPrint'
                                        onClick={handleOptionClickUser}
                                    >
                                        Signature
                                    </label>
                                    <Row>
                                    {!signatureImageUser &&(
                                        <div className='d-inline-flex my-2' style={{ width: 'fit-content' }}>
                                        <img src={convertTextToImage(primaryName, selectedFontUser)} alt="Keyboard" />
                                        </div>
                                    )}
                                    {signatureImageUser && (
                                        <div style={{ position: 'relative', width:'200px', maxHeight:'60px' }}>
                                        <img
                                        className='my-2'
                                        src={signatureImageUser}
                                        alt="Signature"
                                        style={{ width: '100%', height: '100%' }}
                                        />
                                        </div>
                                        )}
                                    </Row>
                                </Col>
                            </Row>
                            )}
                        </div>
                        <div className='ms-5 my-4'>
                        {spouseName && (
                            <Row>
                                <Col className='col-5'>
                                <label className='textColorOfAgreement'>{spouseName}'s Signature(s): <br />Client </label>
                                </Col>
                                <Col id='primaryContainer' className='col-7'>
                                    <label
                                        className='theme-btn h-auto text-white cursor-pointer ms-3 fw-bold hideInPrint'
                                        onClick={handleOptionClickSpouse}
                                    >
                                        Signature
                                    </label>
                                    <Row>
                                    {!signatureImageSpouse &&(
                                        <div className='d-inline-flex my-2' style={{ width: 'fit-content' }}>
                                        <img src={convertTextToImage(spouseName, selectedFontSpouse)} alt="Keyboard" />
                                        </div>
                                    )}
                                    {signatureImageSpouse && (
                                        <div style={{ position: 'relative', width:'200px', maxHeight:'60px' }}>
                                            <img
                                            className='my-2'
                                            src={signatureImageSpouse}
                                            alt="Signature"
                                            style={{ width: '100%', height: '100%' }}
                                            />
                                        </div>
                                        )}
                                    </Row>
                                </Col>
                            </Row>
                        )}
                        </div>
                    </div>
                </Row>
            </Modal.Body> */}
            <Modal.Footer className='d-flex justify-content-between'>
                <Button className="theme-btn" onClick={() => { clearSignatures(); setSignatureAMAModalOpen(false); }}>
                    Close
                </Button>
                <Button className="theme-btn" onClick={handleViewAMA}>
                    Proceed To View AMA
                </Button>
                {/* <AnnualMaintanceAgreement
                    viewAMAModalOpen={viewAMAModalOpen}
                    setViewAMAModalOpen={setViewAMAModalOpen}
                    primaryName={primaryName}
                    spouseName={spouseName}
                    attorneyName={attorneyName}
                    attorneySignature={isKeyboardSignatureAttorney ? convertTextToImage(attorneyName, selectedFontAttorney) : signatureImageAttorney}
                    primarySignature={isKeyboardSignatureUser ? convertTextToImage(primaryName, selectedFontUser) : signatureImageUser}
                    spouseSignature={isKeyboardSignatureSpouse ? convertTextToImage(spouseName, selectedFontSpouse) : signatureImageSpouse}
                    willBasedPlanAmount={willBasedPlanAmount}
                    checkedPlanValue={checkedPlanValue}
                    jsonforradiocheeckbox={jsonforradiocheeckbox}
                    genereateViewPdf={genereateViewPdf}
                    /> */}
            </Modal.Footer>
        </Modal>
    );
};

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader })
});

export default connect(mapStateToProps, mapDispatchToProps)(SignatureAnnualMaintanance);