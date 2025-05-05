import React, { Component } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from "react-datepicker";
export class marriagedetails extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            show: false,
        };
    }
    handleClose = () => {
        this.setState({
            show: !this.state.show
        })
    }

    handleShow = () => {
        this.setState({
            show: !this.state.show
        })
    }
    handleDate = (date) => {
        this.setState({
            startDate: new Date(),
        })
    }
    render() {
        const options = [
            { value: 'War time period served in ?', label: 'War time period served in ?' },
        ]


        return (
            <>
                <style jsx global>{`
                    .modal-open .modal-backdrop.show{opacity:0;}
                    
                `}</style>
                    <a  onClick={this.handleShow}><img className="ms-3 user-select-auto" src="/icons/add-icon.svg" alt="Occupation" /></a>
              
                <Modal show={this.state.show} centered onHide={this.handleClose} animation="false" backdrop="static">
                    <Modal.Header closeButton closeVariant="white">
                        <Modal.Title>Marriagedetails </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pt-4">
                        <p className="mb-4">Current Occupation</p>
                        <Form.Group as={Row} className="mb-4">
                            <Col xs sm="6" lg="5">
                                <div className="calender-sel">
                                <DatePicker className="w-100 border h-100" selected={this.state.startDate} dateFormat="MMM d, yyyy" />
                                <span><img className="user-select-auto" src="/icons/calender-icon.svg" alt="calender" /></span></div>
                            </Col>
                            <Col xs sm="6" lg="5">
                                <Form.Control type="text" defaultValue="Place of Birth" placeholder="Place of Birth" />
                            </Col>
                        </Form.Group>
                        <Row className="m-0 mb-4">
                            <Col xs md="10" className="d-flex align-items-center ps-0">
                                <p>Previous Occupation</p><a><img className="ms-3 user-select-auto" src="/icons/add-icon.svg" alt="Previous Occupation" /></a>
                            </Col>
                        </Row>
                        <Form.Group as={Row} className="mb-4">
                            <Col xs sm="6" lg="5">
                            <div className="calender-sel">
                                <DatePicker className="w-100 border h-100" selected={this.state.startDate} dateFormat="MMM d, yyyy" />
                                <span><img className="user-select-auto" src="/icons/calender-icon.svg" alt="calender" /></span></div>
                            </Col>
                            <Col xs sm="6" lg="5">
                            <div className="calender-sel">
                                <DatePicker className="w-100 border h-100" selected={this.state.startDate} dateFormat="MMM d, yyyy" />
                                <span><img className="user-select-auto" src="/icons/calender-icon.svg" alt="calender" /></span></div>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-4">
                            <Col xs sm="6" lg="5">
                                <Form.Control type="text" defaultValue="Designation" placeholder="Designation" />
                            </Col>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button className="theme-btn" onClick={this.handleClose}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default marriagedetails