import { useState } from "react";
import { Col, Row, Modal } from "react-bootstrap";
import { connect } from 'react-redux';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';

const initialQuestionsAnswers = [
    {
        question: "What is a File Cabinet?",
        steps: [
            { text: "The File Cabinet feature provides users with a convenient and secure way to upload, organize, and manage their documents across various categories such as Family Health, Housing, Legal, and Finance. Users can easily sort their files into designated drawers for better organization and quick access. Additionally, this feature allows users to share their documents with others via email, ensuring seamless collaboration and communication.", image: '/icons/WhatIsFileCabinet.png', note:'Under pre-defined folders of LifePointLaw user cannot upload or delete any documents.' },
        ]
    },
    {
        question: "How to create a Folder in File Cabinet?",
        steps: [
            { text: "Click on the 'New Folder Button'", image: '/icons/HowToCreate-1.png', note:''  },
            { text: "Click on the 'Create a Firm folder' button", image: null, note:'' },
            { text: "Enter the Folder Name and Description", image: '/icons/HowToCreate-2.png', note:'' },
        ]
    },
    {
        question: "How to define the folder access permissions?",
        steps: [
            { text: "After adding the Folder name and description, Click on the 'Yes' button", image: null, note:'' },
            { text: "Select the legal team member from the list.", image: null, note:'' },
            { text: "Select permission to be given.", image: null, note:'' },
            { text: "Click on the 'Save'", image: '/icons/HowToDefineTheFolder-1.png', note:'' },
            { text: "New Folder is successfully created.", image: '/icons/HowToDefineTheFolder-2.png', note:'No files can be uploaded in the Firm Folder.' },
        ]
    },
    {
        question: "How to create a sub folder within a firm?",
        steps: [
            { text: "Click on the 'New Folder Button'", image: '/icons/HowToCreateSub-1.png', note:'' },
            { text: "Click on the 'Create a folder within the firm'", image: '/icons/HowToCreateSub-2.png', note:'' },
            { text: "Select the Folder for which you want to create the sub folder", image: null, note:'' },
            { text: "Enter Sub Folder Name", image: '/icons/HowToCreateSub-3.png', note:'' }
        ]
    },
    {
        question: "How to define the folder within a Firm access permission?",
        steps: [
            { text: "After adding the Folder name and description, Click on the 'Yes' button", image: null, note:'' },
            { text: "Select the legal team member from the list.", image: null, note:'' },
            { text: "Select permission to be given.", image: null, note:'' },
            { text: "Select the Folder for which you want to create the sub folder", image: null, note:'' },
            { text: "Click on the 'Save'", image: null, note:'' },
            { text: "New sub-folder is successfully created.", image: '/icons/HowToDefineTheFolderWithin-1.png', note:'' }
        ]
    },
    {
        question: "How to Upload a file in folder with a firm?",
        steps: [
            { text: "Click on the Firm Folder created by the user", image: null, note:'' },
            { text: "Open the sub folder", image: null, note:'' },
            { text: "Click on the Upload file button", image: '/icons/HowToDefineTheFolderWithin-2.png', note:'' },
            { text: "After clicking on Upload file button, fill all the needed field such as File type, belongs to, Date of Sign Off, Emergency contact (Yes/No)", image: '/icons/HowToDefineTheFolderWithin-3.png', note:'' },
            { text: "User is allowed to upload multiple files with size of 100mb each", image: null, note:'' },
            { text: "Select with whom the user wants to share the file.", image: null, note:'' },
            { text: "Click on save button and files gets uploaded successfully", image: '/icons/HowToDefineTheFolderWithin-4.png', note:'' },
        ]
    },
    {
        question: "How to add and view Remarks for the uploaded file?",
        steps: [
            { text: "Click on the document / file for which you want to add the remarks", image: null, note:'' },
            { text: "Click the Remarks button", image: '/icons/HowToAddRemarks-1.png', note:'' },
            { text: "Add your remarks in the description box and click on the submit button.", image: '/icons/HowToAddRemarks-2.png', note:'All the remarks will be shared with Paralegal.' },
        ]
    },
    {
        question: "How to share the files?",
        steps: [
            { text: "Click on the document / file for which you want to share the file", image: null, note:'' },
            { text: "Click the Share button", image: '/icons/HowToShareFile-1.png', note:'' },
            { text: "Add the email address in the recipient fields.", image: null, note:'' },
            { text: "Multiple emails can be added by separating each email id with comma.", image: null, note:'' },
            { text: "Click on the send.", image: null, note:'' },
            { text: "Files will be successfully shared.", image: '/icons/HowToShareFile-2.png', note:'' },
        ]
    },
];

const UserGuidance = (props) => {
    const [questionsAnswers, setQuestionsAnswers] = useState(initialQuestionsAnswers);
    const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null);

    const toggleQuestion = (index) => {
        setExpandedQuestionIndex(expandedQuestionIndex === index ? null : index);
    };

    return (
        <Modal id="userGuidanceModal" show={props.userGuidance} onHide={() => { props.handleShowUserGuidance(false); }} centered animation={false} backdrop="static" aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton style={{ border: "none" }} closeVariant="white">
                <Modal.Title><h4 style={{ fontSize: '1.5rem', fontWeight: '600' }}>User Guidance / FAQ</h4></Modal.Title>
            </Modal.Header>
            <Modal.Body className="rounded">
                <Col className="mx-4">
                    <Row className="mb-4 mt-3">
                        <h1 className="fs-2">Step-by-Step User Manual</h1>
                    </Row>
                    <Row>
                        {questionsAnswers.map((item, qIndex) => (
                            <div key={qIndex} style={{ marginBottom: '1rem' }}>
                                <button className="user-guidance-button" onClick={() => toggleQuestion(qIndex)}>
                                    <div className={`triangle ${expandedQuestionIndex === qIndex ? 'rotate' : ''}`} />
                                    <span className="question-number">{qIndex + 1}. </span> {item.question}
                                </button>
                                {expandedQuestionIndex === qIndex && (
                                    <div className="user-guidance-steps">
                                        {item.steps.map((step, sIndex) => (
                                            <div key={sIndex}>
                                                {qIndex !== 0 && <p><strong>Step {sIndex + 1}:</strong> {step.text}</p>}
                                                {qIndex === 0 && <p>{step.text}</p>}
                                                {step.image && (<InnerImageZoom src={step.image} zoomSrc={step.image} alt={`Step ${sIndex + 1}`} zoomScale={1.5} style={{ maxWidth: '100%', marginBottom: '5px' }} />)}
                                                {step.note && <p><strong>Note: </strong>{step.note}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </Row>

                </Col>
            </Modal.Body>
        </Modal>
    );
};

const mapStateToProps = (state) => ({ ...state.main });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserGuidance);
