import Router from "next/router";
import React, { Component } from 'react'
import { Breadcrumb, Col, Container, Row, Card, Alert } from 'react-bootstrap';
import { globalContext } from "./_app";
import Layout from '../components/layout'
import LegalDoc from '../components/LegalDoc'
import LegalRoles from "../components/LegalRoles";
import BurialPolicy from "../components/BurialPolicy"
import Cemetery from "../components/Cemetery";
import HandlingRemains from "../components/HandlingRemains";
import AnatomicalGifts from "../components/AnatomicalGifts";
import LivingWill from "../components/LivingWill";
import FiduciaryAssignment from "../components/FiduciaryAssignment";
import GeneratePdf from "../components/GeneratePdf/GeneratePdf";
import DeathComponent from "../components/DeathComponent";
import konsole from "../components/control/Konsole";
import AlertToaster from "../components/control/AlertToaster";
import SummaryDoc from "../components/Summary/SummaryDoc";
import NewProServiceProvider from "../components/NewProServiceProvider";
import { elderLawAttorneyMoreInfo, legalCounselMoreInfo, taxBusinessSuccessionMoreInfo } from "../components/control/Constant";

export default class extends Component {
    static contextType = globalContext;
    constructor(props,context) {
        super(props);
        this.state = {
            actionType: '',
            show: false,
            userId: "",
            showpdf: false,
            showLegalDoc: false,
            rolePrimaryid : "",
        }
    }
    componentDidMount() {
        let newuserid = sessionStorage.getItem("SessPrimaryUserId");
        const rolePrimaryid = sessionStorage.getItem('roleUserId')
        let actionType = sessionStorage.getItem('actionType');
        this.setState({
            actionType: actionType,
            userId: newuserid,
            rolePrimaryid :rolePrimaryid
        })
    }

    handleClose = () => {
        this.context.setPageTypeId(null)
        konsole.log("state at legal 1");
        this.setState({
            show: false,
        });
    };

    handleLegalClose = () => {
        this.context.setPageTypeId(null)
        konsole.log("state at legal 1");
        this.setState({
            showLegalDoc: false,
        });
    };

    handleShow = () => {
        this.context.setPageTypeId(37)
        this.setState({
            show: true,
        });
    };

    handleLegalShow = () => {
        this.context.setPageTypeId(33)
        this.setState({
            showLegalDoc: true
        });
    };

    GeneratePdfun = () => {
        this.setState({ showpdf: !this.state.showpdf })
    }

    callSaveFunction = () => {
        if(
            this.state.rolePrimaryid == 9 
        ){
            AlertToaster.success("Data saved successfully");
            setTimeout(() => {
                Router.push({ pathname: "./Agentguidance" })
            }, 1000)
        }else{
            AlertToaster.success("Data saved successfully");
        }       
    };

    hadleFiduciaryShow=()=> {
        this.context.setPageTypeId(32)
        Router.push({ pathname: "./Legal-Fiduciary" })
    }
    render() {
        return (
            <Layout name="Legal Information">
                <Row className="pt-md-0 pt-2">
                    <Col xs="10" sm="12" md="6" lg="6">
                        <Breadcrumb>
                            <Breadcrumb.Item href="#" onClick={() => { Router.push("./dashboard"); }}> Home  </Breadcrumb.Item>
                            <Breadcrumb.Item href="#"> Legal Information</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col> 
                    <Col xs="10" sm="12" md="6" lg="6" className="margintop-cls mt-3"> 
                    <button
                    className="theme-btn me-md-3 me-sm-0"
                   onClick={this.GeneratePdfun}
                   style={{float: "right"}}
                  >
                    Generate PDF
                  </button>{
                            this.state.showpdf && <GeneratePdf  memberId={this.state.userId} show={this.state.showpdf} handleShow={this.GeneratePdfun} />
                  }

            </Col>
                </Row>
                <Container fluid className="bg-white info-details min-vh-100" id="LegalInfoId">
                    <div className="d-flex legalProfess">
                        {/* <Col className="cursor-pointer border-0 m-3 ">
                            <NewProServiceProvider
                                hideFilters={true}
                                proSerDescTd="4"
                                protypeTd="6"
                                PageName="Legal Counsel"
                                sourceImg="/legalCounselRL.svg"
                                showForm={3}
                                formLabels={legalCounselMoreInfo}
                            />
                        </Col> */}
                        <Col className="cursor-pointer border-0 m-3">
                            <NewProServiceProvider
                                uniqueKey="elderlaw"
                                hideFilters={true}
                                proSerDescTd="4"
                                protypeTd="13"
                                PageName="Elder Law Attorney"
                                sourceImg="/elderlawAttorneyRL.svg"
                                showForm={3}
                                formLabels={elderLawAttorneyMoreInfo}
                            />
                        </Col>
                        <Col className="cursor-pointer border-0 m-3 ">
                            <NewProServiceProvider
                                uniqueKey="familylaw"
                                hideFilters={true}
                                proSerDescTd="4"
                                protypeTd="45"
                                PageName="Family Law Attorney"
                                sourceImg="/familyLawRL.svg"
                                showForm={3}
                                formLabels={legalCounselMoreInfo}
                            />
                        </Col>
                        <Col className="cursor-pointer border-0 m-3">
                            <NewProServiceProvider
                                uniqueKey="taxBusiness"
                                hideFilters={true}
                                proSerDescTd="4"
                                protypeTd="46"
                                PageName="Tax & Business Succession"
                                sourceImg="/taxSucessionRL.svg"
                                showForm={3}
                                formLabels={taxBusinessSuccessionMoreInfo}
                            />
                        </Col>
                    </div>
                    <div className=" legalInfoClass ">
                        {
                            (this.state.showLegalDoc == true) ?
                                <LegalDoc primaryUserId={this.state.userId} show={this.state.showLegalDoc} handleClose={this.handleLegalClose} />
                                :
                                <></>
                        }
                        {
                            (this.state.actionType !== "setGuidance") ?
                                < >

                                    <Card className="border-0 m-3 cursor-pointer" onClick={this.hadleFiduciaryShow}>


                                        <Card.Img variant="Top" className="" src="/icons/Beneficiary.svg" style={{ width: "214px", height: "166px " }} />
                                        <Card.Body className="p-0 mt-2" style={{ width: "214px " }}>
                                            <a>
                                                <div className="border d-flex justify-content-between align-items-center p-2 p-2">
                                                    <p className="ms-2">Fiduciary / Beneficiary</p>
                                                    <div className="border-start">
                                                        <img className="px-2" src="/icons/add-icon.svg" alt="Monthly Expenses" />
                                                    </div>
                                                </div>
                                            </a>
                                        </Card.Body>

                                    </Card>
                                    <Card className="border-0 m-3 cursor-pointer" onClick={this.handleLegalShow}>


                                        <Card.Img variant="Top" className="" src="/icons/legalDoc.svg" style={{ width: "214px", height: "166px " }} />
                                        <Card.Body className="p-0 mt-2" style={{ width: "214px " }}>
                                            <a>
                                                <div className="border d-flex justify-content-between align-items-center p-2 p-2">
                                                    <p className="ms-2">Legal Documents</p>
                                                    <div className="border-start">
                                                        <img className="px-2" src="/icons/add-icon.svg" alt="Monthly Expenses" />
                                                    </div>
                                                </div>
                                            </a>
                                        </Card.Body>

                                    </Card>
                                    <Card className="border-0 m-3 cursor-pointer">

                                        <FiduciaryAssignment />

                                    </Card>
                                </>
                                :
                                <></>
                        }


                    </div>

                    <div className="legalInfoClass2">
                    <Card className="border-0 m-3  cursor-pointer">
                            {/* <Card.Img variant="Top" className="border" src="/icons/anatomicalGift.svg" /> */}
                            {/* <Card.Body className="p-0 mt-2"> */}
                            {/* --------------------- */}
                            <LivingWill primaryUserId={this.state.userId} />
                            {/* --------------------- */}
                            {/* </Card.Body> */}
                        </Card>
                        <Card className="border-0 m-3  cursor-pointer">
                            {/* <Card.Img variant="Top" className="border" src="/icons/anatomicalGift.svg" /> */}
                            {/* <Card.Body className="p-0 mt-2"> */}
                            {/* --------------------- */}
                            <AnatomicalGifts />
                            {/* --------------------- */}
                            {/* </Card.Body> */}
                        </Card>
                        <Card className="border-0 m-3  cursor-pointer" onClick={this.handleShow}>
                            <div className="d-flex">
                                {/* <Card.Img variant="Top" className="border" src="icons/burialPolicy.svg" /> */}
                                {/* <Card.Img variant="Top" className="border" src="/icons/cemetery.svg" /> */}
                                <Card.Img variant="Top" className="border" src="/icons/handlingOfRemains.svg" style={{width:"204px", height:"166px"}}/>
                            </div>
                            <Card.Body className="p-0 mt-2  cursor-pointer">
                                {
                                    <a>
                                        <div className="border d-flex justify-content-between align-items-center p-2 " style={{width:"204px"}}>
                                            <p className="ms-2">Burial/Cremation Plan</p>
                                            <div className="border-start">
                                                <img
                                                    className="px-2"
                                                    src="/icons/add-icon.svg"
                                                    alt="Burial Policy"
                                                />
                                            </div>
                                        </div>
                                    </a>
                                }
                                {/* {
                                    this.state.show &&
                                    <BurialPolicy show={this.state.show} handleClose={this.handleClose} handleShow={this.handleShow} />
                                } */}
                            </Card.Body>
                        </Card>
                        {/* <Card className="border-0 m-3 cursor-pointer" style={{ width: "15rem" }}>
                            <Card.Img variant="Top" className="border" src="icons/cemetery.svg" />
                            <Card.Body className="p-0 mt-2">
                                <Cemetery />
                            </Card.Body>
                        </Card> */}
                        {/* <Card className="border-0 m-3 cursor-pointer" style={{ width: "15rem" }}>
                            <Card.Img variant="Top" className="border" src="/icons/handlingOfRemains.svg" />
                            <Card.Body className="p-0 mt-2">
                                <HandlingRemains />
                            </Card.Body>
                        </Card> */}
                        {/* <Card className="border-0 m-3 cursor-pointer" style={{ width: "15rem" }}>
                                <FiduciaryAssignment />
                        </Card> */}
                    </div>
                    <Row className="m-2 ">
                        <Col xs md="12" className="fiduciaryBottom d-flex  justify-content-between ps-0 pe-0" style={{ marginTop: "3rem",marginBottom:"2rem" }}>
                               {/* ************************** ________SUMMARY_COMPONENT________************** */}
                               <SummaryDoc btnLabel="View Legal Summary" modalHeader="Legal Detail" component="Legal" />
                               {/* ************************** ________SUMMARY_COMPONENT________************** */}          
                            <button className="theme-btn mb-1" onClick={() => this.callSaveFunction()}> {(this.state.rolePrimaryid == "9") ?  'Save & Proceed to Agent / Guidance' :" Save "} </button>
                        </Col>
                    </Row>
                </Container>
                {
                    this.state.show &&
                    <DeathComponent show={this.state.show} handleClose={this.handleClose} handleShow={this.handleShow} />
                }
            </Layout>
        )
    }
}
