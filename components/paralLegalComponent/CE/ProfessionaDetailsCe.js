import React from 'react'
import { Card, Row, Col } from "react-bootstrap";
import NotFound from './Not-Found';
import { $AHelper } from '../../control/AHelper';
const _notAvailableMsg = 'Not available.'
const ProfessionaDetailsCe = ({ professionalsList }) => {
    return (
        <><hr />
            <Row>
                <p className='fw-bold'>Professionals</p>
                {professionalsList.length > 0 ? professionalsList.map((item, index) => {
                    const { professionalName, professionalCompanyName, professionalEmail, professionalPhone, professionalRole, professionalAddressLine } = item
                    return <>
                        <Col key={index} md={6} className='mt-2 mb-2'>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title> <p className=''>{professionalName} {"-"} {professionalRole}</p></Card.Title>
                                    <Card.Text>
                                        <strong>Name:</strong> {professionalName}<br />
                                        <strong>Email:</strong> {professionalEmail ? professionalEmail : _notAvailableMsg}<br />
                                        <strong>Phone Number:</strong>   {professionalPhone ? $AHelper.convertToUSFormat(professionalPhone, '1') : _notAvailableMsg}<br />
                                        <strong>Business Name:</strong> {professionalCompanyName ? professionalCompanyName : _notAvailableMsg}<br />
                                        <strong>Address:</strong> {professionalAddressLine ? professionalAddressLine : _notAvailableMsg}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </>
                }) :
                    <> <NotFound key="Professional" /></>
                }
            </Row>
        </>

    )
}

export default ProfessionaDetailsCe
