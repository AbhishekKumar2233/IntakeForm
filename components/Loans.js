import React, { Component } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb } from 'react-bootstrap';

export default class Loans extends Component {
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

    render(){

        return(
            <>
                <style jsx global>{`
                    .modal-open .modal-backdrop.show{opacity:0;}
                    
                `}</style>
                <a onClick={this.handleShow}><img className='px-2' src="/icons/add-icon.svg" alt="health Insurance"/></a>

                <Modal show={this.state.show} size="md" centered onHide={this.handleClose} animation="false" backdrop="static">
                    <Modal.Header closeButton closeVariant="white">
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pb-5 pt-4">
                        <div className='person-content'>
                            <Form.Group as={Row} className="mb-3">
                                <Col xs sm="6" lg="5">
                                    <Form.Control type="text" defaultValue="Name of Institution" placeholder="Name of Institution" />
                                </Col>
                                <Col xs sm="6" lg="5">
                                    <Form.Control type="text" defaultValue="Payment Amount" placeholder="Payment Amount" />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Col xs sm="6" lg="5">
                                    <Form.Control type="text" defaultValue="Interest Rate" placeholder='Interest Rate' />
                                </Col>
                                <Col xs sm="6" lg="5">
                                    <Form.Control type="text" defaultValue="Payoff Date" placeholder='Payoff Date' />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col xs sm="6" lg="5">
                                    <Form.Control type="text" defaultValue="Minimum Payment" placeholder='Minimum Payment' />
                                </Col>
                                <Col xs sm="6" lg="5">
                                    <Form.Control type="text" defaultValue="Extra Payment Made" placeholder='Extra Payment Made' />
                                </Col>
                            </Form.Group>
                            
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button className="theme-btn" onClick={this.handleClose}>
                            Save
                        </Button>

                        {/* <Table bordered>
                            <thead>
                                <tr>
                                    <td>Description of Retirement Assets</td>
                                    <td>Name of Institution</td>
                                    <td>Balance</td>
                                    <td>Owner</td>
                                    <td>Beneficiary</td>   
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>Checking Account</td>
                                    <td>Bank of America</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>

                                </tr>
                            </tbody>
                            </Table> */}
                    </Modal.Footer>
                </Modal>

            </>
        )
    }
}