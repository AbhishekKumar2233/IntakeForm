import React from 'react';
import {Row, Col, Form, Button} from 'react-bootstrap'

function EditPaymentMethod(props){

    const horizontalLine = () =>{
        return(
        <div className="d-flex justify-content-center mb-0 AMABorder">
             <div className="borderStylesInAMA">{/* Horizontal Line */}</div>
        </div>
        )
    }
      
    return(
        <>
        <Row>
            <Col lg={8} md={8}>
                <div>
                <div className='d-flex'>
                   <img src='./images/EditPaymentLeftArrowImg.png' onClick={()=>props?.setEditPayment("")} style={{height:"18.26px",width:"21px",color:"rgba(51, 51, 51, 1)",cursor:"pointer"}}/>
                    <div className='ms-3'><h2>Edit Payment Method</h2></div>
                </div>
                    <div className='w-50 d-flex justify-content-center' style={{color:"rgba(96, 96, 96, 1)"}}>Edit your payment methods & credentials.</div>
                </div>
            </Col>
        </Row>
        <Row>
        <Col lg={12} md={12} sm={12}>
        {horizontalLine()}
        </Col>
        </Row>
            <Row>
                <Col lg={7}>
            <Row>
                <Col lg={8} md={8}>
                Visa Card
                </Col>
            </Row>
            <Row className='mt-5'> 
                <Col lg={12} md={12}>
                <h5 className='fw-bold'>Card Details</h5>
                </Col>
            </Row>
            <Row className='mt-4'>
            <Form.Group as={Row} className="financial-Adviser-Class mb-4">
                <Col xs={12} sm={6} lg={6} className="mb-2">
                  <Form.Label>Card holder</Form.Label>
                  <Form.Control type="text" placeholder="Card holder name" />
                </Col>
                <Col xs={12} sm={6} lg={6} className="mb-2">
                <Form.Label>Card number</Form.Label>
                  <Form.Control type="text" placeholder="Card number" />
                </Col>
              </Form.Group>
            </Row>
            <Row>
            <Form.Group as={Row} className="financial-Adviser-Class mb-4">
                <Col xs={12} sm={6} lg={4} className="mb-2">
                 <Form.Label>Expiration date</Form.Label>
                  <Form.Control type="text" placeholder="Expiration Date"/>
                </Col>
                <Col xs={12} sm={6} lg={3} className="mb-2">
                <Form.Label>CVV</Form.Label>
                  <Form.Control type="text" placeholder="CVV"/>
                </Col>
              </Form.Group>
            </Row>
            <Row>
            <Form.Group as={Row} className="financial-Adviser-Class">
                <Col xs={12} sm={6} lg={8} className="mb-2">
                <Form.Label>Billing Address</Form.Label>
                <Form.Control type="text" placeholder="Billing Address" />
                </Col>
                <Col xs={12} sm={6} lg={4} className="mb-2">
                <Form.Label>Zip code</Form.Label>
                <Form.Control type="text" placeholder="Zip code" />
                </Col>
              </Form.Group>
            </Row>
            </Col>
            <Col lg={1} className='mt-3'>
            <div className="d-inline-block mb-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <div style={{ borderLeft: "rgba(237, 237, 237, 0.82)", height: "100%", border: "1.3px solid rgba(237, 237, 237, 0.82)" }}>{/* Vertical Line */}</div>
            </div>
            </Col>
            <Col lg={3} md={12} sm={12}>
            <Row>
                <Col lg={12} className='mt-4'>
                    <div>Your Plan</div>
                </Col>
            </Row>
            <Row>
            <Col lg={12}>
                  {horizontalLine()}
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                <div className='d-flex justify-content-center mt-4'>
                <div className='mt-0'>    
                   <img src='./images/logoiconOnEditPayment.png' style={{height:"45px",width:"45px"}}/>
                </div>
                <div className='ms-3 mt-2'>
                    <div><h5>Annual Maintenance Plan </h5></div>
                    <div className='mt-1' style={{color:"rgba(96, 96, 96, 1)"}}>Our comprehensive Annual Maintenance 
                      Plan is designed to safeguard your valuable assets and maintain optimal functionality throughout the year.</div>
               <div className='mt-3'>
                <div style={{color:"rgba(96, 96, 96, 1)",fontSize:"14px"}}>
                Subscription:
                </div>
                <div style={{color:"rgba(128, 128, 128, 1)",fontSize:"18px"}}>
                Billed Annually
                </div>
                </div>
               </div>
                </div>
                </Col>
            </Row>
            </Col>
        </Row>
        <Row className='mt-4'>
            <Col lg={12} className='d-flex justify-content-end' >
                <Button style={{backgroundColor:"#720c20",borderStyle:"none",padding:"10px",width:"100px",borderRadius:"6.19px",fontSize:"13px"}}>Update</Button>
            </Col>
        </Row>
                
            
        </>
    )
}
export default EditPaymentMethod