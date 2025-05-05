import React, { useState } from 'react'
import { createPortal } from 'react-dom';
import { Col, Form, Row, Modal, OverlayTrigger, Button, Tooltip } from 'react-bootstrap';
import konsole from '../components/control/Konsole';

const AddNotes = () => {
    const [showNotes, setShowModal] = useState(false)
    const [isRecording, setIsRecording] = useState(false);
    const [textValue, setTextValue] = useState('');





    //openNotesmodal  function use for open notes modal or close modal
    const openNotesmodal = () => {
        setShowModal(!showNotes)
    }

    // handleSpeechRecognition function for recording and setting the value in the text state
    const handleSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.onstart = () => {
            setIsRecording(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setTextValue(transcript);
            setIsRecording(false);
        };

        recognition.start();

        // Set isRecording to false after 6-7 seconds if the user doesn't speak
        setTimeout(() => {
            if (isRecording) {
                setIsRecording(false);
            }
        }, 6000); // Adjust the duration as needed
    };



    const handlechange = (e) => {
        setIsRecording(false);
        let { value } = e.target
        konsole.log("eeeeeeeeeeee", value)
        setTextValue(value)

    }

    //konsole values
    konsole.log("isRecording", isRecording)
    konsole.log("textValue", textValue)

    return (
        <>
            <button className="theme-btn py-0" onClick={openNotesmodal} >Add Notes</button>

            <Modal show={showNotes} size="lg" onHide={openNotesmodal} backdrop="static" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px" }} >
                <Modal.Header className="text-white" closeVariant="white" closeButton> Add Notes</Modal.Header>
                <Modal.Body className="rounded mt-2">

                    <div className='d-flex justify-content-end m-2'> {isRecording == true ? 'Speak now' : ""}<OverlayTrigger placement="top" overlay={<Tooltip id="svg-tooltip">Add notes by voice</Tooltip>}>
                        {(isRecording == true) ? <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16" style={{ cursor: "pointer" }} onClick={() => setIsRecording(false)}>
                            <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
                            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
                        </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-mic-mute-fill" viewBox="0 0 16 16" style={{ cursor: 'pointer' }} onClick={handleSpeechRecognition}>
                            <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3z" />
                            <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z" />
                        </svg>}
                    </OverlayTrigger>
                    </div>
                    <div className="m-2">
                        <Form.Control className="fs-3" as="textarea" value={textValue} placeholder='Enter text' onChange={handlechange} rows={3} />
                    </div>



                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button className="theme-btn py-0" onClick={openNotesmodal}>
                        Cancel
                    </Button>
                    <Button className="theme-btn py-0" onClick={openNotesmodal}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddNotes