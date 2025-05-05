import React, { Fragment } from 'react'
import { Button, Modal, Row, Col, Container, Card } from 'react-bootstrap';

const stepsList = [
    {
        text: 'Order Summary',
        imgRed: "Immediateactionred.svg",
        imgWhite: "Immediateactionwhite.svg",
        id: '1'
    }, {
        text: 'Make Payment',
        imgRed: "Notifyred.svg",
        imgWhite: "Notifywhite.svg",
        id: '2'
    }
]

const AmaStepper = ({ currentStep, setCurrentStep }) => {

    let activeStep = currentStep;
    return (
        <>
            <Row>
                {(currentStep == 0) && <Col md={3} className='mt-2 mb-2'></Col>}
                <Col
                    //  md={ 12} 
                    className='mt-2 mb-2'>

                    <div className="ms-5 me-5 agentIllness">
                        <div className="custom-stepper">
                            {stepsList.map((item, index) => {
                                return <>
                                    <Fragment key={index}>
                                        <div className="stepper-container" style={{ fontSize: '1.4rem' }}>
                                            <div className={`steps ${activeStep == index ? "active" : activeStep > index ? "darkColor" : ""}`}
                                                onClick={() => setCurrentStep(index)}
                                            >
                                                {(activeStep <= index) && activeStep == index ? <> 1</> : activeStep > index ? "" : <>2</>}
                                            </div>
                                            <div className="fs_Agent">
                                                {item?.text}
                                            </div>
                                        </div>
                                    </Fragment>
                                </>
                            })}
                        </div>
                    </div>
                </Col>
                {(currentStep == 0) && <Col md={3} className='mt-2 mb-2'></Col>}
            </Row>
        </>
    )
}

export default AmaStepper
