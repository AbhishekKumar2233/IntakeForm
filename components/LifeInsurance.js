import React, { Component } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb } from 'react-bootstrap';
import { connect } from 'react-redux';
import LifeInsuranceForm from './LifeInsuranceForm';
import konsole from './control/Konsole';
import AlertToaster from './control/AlertToaster';
import { $AHelper } from './control/AHelper';
import { globalContext } from '../pages/_app';

class LifeInsurance extends Component {
    static contextType = globalContext;
    constructor(props, context) {
        super(props, context);
        this.state = {
            show: false,
            primaryMemberUserId: "",
            spouseDetailUserId: "",
            primarymemberDetails: {},
        };
    }
    componentDidMount() {
        // debugger
        let primaryUserId = sessionStorage.getItem("SessPrimaryUserId") || "";
        let spouseDetailUserId = sessionStorage.getItem("spouseUserId") || "";
        let primarymemberDetails = JSON.parse(sessionStorage?.getItem("userDetailOfPrimary"))
        this.setState({
            primaryMemberUserId: primaryUserId,
            spouseDetailUserId: spouseDetailUserId,
            primarymemberDetails: primarymemberDetails
        })
    }

    handleClose = () => {
        this.context.setPageTypeId(null)
        this.setState({
            show: !this.state.show
        })
    }

    handleClose1 = () => {
        // AlertToaster.success("Data saved successfully");

        this.setState({
            show: !this.state.show,
        });
    };


    handleShow = () => {
       this.context.setPageTypeId(18)
       this.setState({
            show: !this.state.show
        })
    }

    render() {
        return (
            <>
                <style jsx global>{`
                    .modal-open .modal-backdrop.show{opacity:0.5 !important;}
                    
                `}</style>
                {this.state.show == true &&
                    this.state.spouseDetailUserId == 'null' ? (
                    <LifeInsuranceForm
                        userId={this.state.primaryMemberUserId}
                        show={this.state.show}
                        showLifeIns={this.handleShow}
                    />
                ) : (
                    ""
                )}

                <Col xs md="4" onClick={this.handleShow} className="cursor-pointer mb-3">
                    <div className="d-flex align-items-center border py-1">
                        <div className="flex-grow-1 ms-2 border-end">
                            Life Insurance
                        </div>
                        <div className=" cursor-pointer" >
                            <a><img className='px-2' src="/icons/add-icon.svg" alt="health Insurance" /></a>
                        </div>
                    </div>
                </Col>
                {
                    this.state.spouseDetailUserId !== "null" ?
                    <Modal show={this.state.show}enforceFocus={false} centered onHide={this.handleClose} animation="false" size='md' backdrop="static">
                    <Modal.Header closeButton closeVariant="white">
                        <Modal.Title>Life Insurance</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="">
                        <div className='person-content'>
                            <Form.Group as={Row} className="ms-1 mt-3">
                                <Col xs sm="6" lg="6" className='m-0 p-0 d-flex align-items-center mb-2'>
                                    <button className='white-btn' style={{width:"185px"}}>
                                        {/* Primary Member */}{$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.memberName)}
                                    </button><LifeInsuranceForm userId={this.state.primaryMemberUserId} />
                                </Col>
                                {
                                    this.state.spouseDetailUserId !== "null" &&
                                    <Col xs sm="6" lg="6" className='m-0 p-0 d-flex align-items-center mb-2'>
                                                    <button className='white-btn' style={{ width: "185px" }}>
                                            {/* Spouse */}{(this.state.primarymemberDetails?.spouseName)? $AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.spouseName):this.state.primarymemberDetails?.memberName +"-Spouse" }
                                           
                                        </button><LifeInsuranceForm userId={this.state.spouseDetailUserId} />
                                    </Col>
                                }
                            </Form.Group>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button
                          style={{backgroundColor:"#76272b", border:"none"}}
                        className="theme-btn" onClick={this.handleClose1}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                : <></>
                }

            </>
        )
    }
}

const mapStateToProps = (state) => ({ ...state });

export default connect(mapStateToProps, "")(LifeInsurance)

