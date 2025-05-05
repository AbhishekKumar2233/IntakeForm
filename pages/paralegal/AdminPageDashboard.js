import React, { Component } from 'react';
import Router from "next/router";
import Head from 'next/head';
import { Button, Table, Form, Row, Col, Popover, Tooltip, OverlayTrigger, Container, Breadcrumb, Navbar } from 'react-bootstrap';


class dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            // 'dee3d66e-29be-43e1-b89e-1982d93a07d0',
            // userId: '6240AAEC-2AAF-479E-B6D6-009C83549599',
            showProfess: false
        }
    }

    render() {

        return (
            <div className="bg-white min-vh-100">
                <Head>
                    <title>Aging Options</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
                </Head>
                <header className="bg-white">
                    <div className="top-header d-flex align-items-center justify-content-between py-0 useNewDesignSCSS">
                        <div
                            className="logo-box"
                            onClick={() => {
                                Router.push("./dashboard");
                            }}
                        >
                            <img src="/images/logoImage.png" alt="Logo" />
                        </div>
                        <div className="content-box">


                        </div>
                    </div>
                    <div className="title-header py-2">
                        <Row className="d-flex align-items-center">
                            <Col xs lg="4" onClick={this.handleClick} style={{ cursor: "pointer" }}>

                            </Col>
                            <Col className="d-flex align-items-center justify-content-center">
                                <h2
                                // style={{
                                //     marginTop:"10px"
                                // }}
                                >{this.props.name}</h2>
                            </Col>
                            < Col className="d-flex align-items-center justify-content-end gap-3" >

                            </Col>
                        </Row>
                    </div>
                </header>
                <div className="bg-white mt-4 ">
                    <Row className="d-flex justify-content-between mt-4 p-4">
                        <Col className="d-flex justify-content-start ms-4" lg={3}>
                            <p className='me-4 mt-1'>Subtenent</p>
                            <Form.Select required id="suffixId" >
                                <option>Subtenent</option>
                            </Form.Select>
                        </Col>
                        <Col className="d-flex justify-content-around me-4" lg={1}>
                            <p className="mt-1">Add new</p>
                            <a onClick={this.handleShow}>
                                <img
                                    className="px-2"
                                    src="/icons/add-icon.svg"
                                    alt="health Insurance"
                                />
                            </a>
                        </Col>
                    </Row>
                    <Row className="m-4">
                        <Table bordered >
                            <tbody >
                                <tr  >

                                    <td className="p-4"><Form.Select required id="suffixId" >
                                        <option>Menu</option>
                                    </Form.Select></td>
                                    <td className="p-4"><Form.Select required id="suffixId" >
                                        <option>Category</option>
                                    </Form.Select></td>
                                    <td className="p-4"><Form.Select required id="suffixId" >
                                        <option>Subject</option>
                                    </Form.Select></td>
                                </tr>
                                <tr>

                                    <td className="p-4"><Form.Select required id="suffixId" >
                                        <option>Submenu</option>
                                    </Form.Select></td>
                                    <td className="p-4"><Form.Select required id="suffixId" >
                                        <option>Topic</option>
                                    </Form.Select></td>

                                </tr>
                            </tbody>
                        </Table>
                    </Row>
                    <Row className="mt-4 me-4">
                        <Col xs md="12" className="d-flex align-items-center justify-content-end ps-0">
                            <button className="theme-btn">Submit</button>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}


export default dashboard;
