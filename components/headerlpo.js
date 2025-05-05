import React, { useState, useEffect, useContext } from 'react'
import Router from "next/router";
import { Button, Row, Col, Popover, Tooltip, OverlayTrigger, Container, Breadcrumb, Navbar } from 'react-bootstrap';
import GeneratePdf from './GeneratePdf/GeneratePdf';
import { $AHelper, authLogout } from './control/AHelper';
import { confirmationMsg, logoutUrl, lpoLiteUrl } from './control/Constant';
import { $CommonServiceFn, $getServiceFn } from './network/Service';
import konsole from './control/Konsole';
import { $Service_Url } from "./network/UrlPath";
import { globalContext } from '../pages/_app';
import ProfessSearch from './professSearch';
import Agentguidence from '../pages/Agentguidance';
import { demo, paralegalAttoryId } from '../components/control/Constant';

import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import WarningAlert from './WarningAlert';
import NewProServiceProvider from './NewProServiceProvider';
import MoveToNewNOldDesign from '../component/Common/MoveToNewNOldDesign';

export default function Headerlpo(props) {
  konsole.log("Propsopso", props, props.shoowheader)

  const primaryUserId = sessionStorage.getItem("SessPrimaryUserId");
  let roleId = JSON.parse(sessionStorage.getItem('stateObj')).roleId
  const [showModal, setShowModal] = useState(false)
  const context = useContext(globalContext);

  const [showPdf, setShowPdf] = useState(false);
  const [clickedSideMenu, setClickedSideMenu] = useState(2)
  const selectedDashboardIcon = (roleId) ? "Setupiconwhite.svg" : "Setupiconwhite.svg";
  const dashboardIcon = (roleId) ? "setupblack.svg" : "setupblack.svg";
  const dashboardText = (roleId) ? "Setup" : "Dashboard";
  let userRoleId = JSON.parse(sessionStorage.getItem('stateObj')).roleId


  const handleShowPdf = () => {
    setShowPdf(!showPdf)
  }

  const handleChangeLink = () => {

    konsole.log("contenxtksdnfjskhfjkshf", context);

    if (roleId == "3" || roleId == '13' || roleId == '14' || roleId == '15' || roleId == "9") {

      if (context?.previousRoute?.toLowerCase()?.includes("paralegal".toLowerCase())) {
        Router.back();
      }
      else {
        Router.push("/paralegal");

      }
    }
    else if (roleId == "9" || roleId == "1") {
      konsole.log("asdjkkksahf", roleId);
      window.location.replace(lpoLiteUrl + "Dashboard");
    }
  }



  const sidemenuFunction = (e) => {
    setClickedSideMenu(e)
    konsole.log("eeeesseee", e)
    if (e == 1) {
      Router.push("./dashboard")
    } else if (e == 6) {
      Router.push("./FileCabinetNew")
    }
    else if (e == 3) {
      Router.push("./Emergency")
    }
    else if (e == 11) {
      Router.push("./AnnualMaintAgreement")
    }
    else if (e == 7) {
      Router.push("./import_contact")
    } else if (e == "warning") {
      setShowModal(true)
    }
  }
  
  return (<>

    {showPdf ? <GeneratePdf memberId={primaryUserId} show={showPdf} handleShow={handleShowPdf} /> : <></>}
    <div className="d-flex align-items-center row" style={{ background: 'white', position: 'sticky', top: '0', zIndex: '999' }}>
      {(props.name != 'File_Cabinett') ? <>
        {/* **************** responsive navbar code start ************* */}
        <div className='offcanvas-menu  col-3 col-md-1 ' style={{ marginLeft: "6px" }}>
          <>
            {['xl',].map((expand) => (
              <Navbar key={expand} expand={expand} className="bg-body-tertiary offcanvas-menu" >
                <Container fluid>
                  <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                  <Navbar.Brand href="#">{clickedSideMenu == 1 ? "Dashboard" : ""}</Navbar.Brand>

                  <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${expand}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="start"
                  >
                    <Offcanvas.Header closeButton className=''>
                      <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                        <div className='logo-main-div px-3'>
                          <h1 className='logo-tag-life-h1' >Life Plan Organizer</h1>
                        </div>
                        <hr style={{ width: "90%", margin: "10px auto", height: "5px", color: "grey" }}></hr>
                        
                      </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className='offencepadding'>
                      <Nav className="justify-content-end flex-grow-1">
                      <div className='useNewDesignSCSS' style={{margin:"0px 20px"}}>
                      <MoveToNewNOldDesign type='LPO' refrencePage='viewprofile' action='new' />
                      </div>
                        {/* <Nav.Link href="#action1">Dashboaed</Nav.Link>
                      <Nav.Link href="#action2">Emergency</Nav.Link> */}

                        <div
                          //   className={`article-scetion min-vh-100 ${
                          //     props.isSideBarVisible ? "visible" : "invisible"
                          //   }`
                          // }
                          className="sidebar-main-div1"
                        >
                          <div>
                            {/* <div className='logo-main-div px-3 pt-4'>
                            <h1 className='logo-tag-life-h1 text-center' >Life Plan Organizer</h1>
                          </div>
                          <hr style={{ width: "60%", margin: "10px auto", height: "5px", color: "grey" }}></hr> */}
                            <div className='left-menu-main-div mt-2 text-center'>
                              <div className="d-flex justify-content-between mt-1">
                                <div className={`${clickedSideMenu == 1 ? 'd-flex gap-4 left-menu-inner-div-border' : 'd-flex gap-4 left-menu-inner-div'}`} >
                                  <div className={`left-menu-inner-image-div ${clickedSideMenu == 1 ? 'imgDiv' : ""}`}>
                                    <img src={clickedSideMenu == 1 ? selectedDashboardIcon : dashboardIcon} className={clickedSideMenu == 1 ? 'img-fluid1' : "img-fluid3"} />
                                  </div>
                                  <div className="left-menu-inner-text-div">
                                    <h6 className={`${clickedSideMenu == 1 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={(e) => sidemenuFunction(1)}>{dashboardText} </h6>
                                    {clickedSideMenu == 1 ? <div className="active-left-menu-inner-image-div"> </div> : " "}
                                  </div>
                                </div>
                                {/* {clickedSideMenu == 1 ? <div className="active-left-menu-inner-image-div"> </div> : " "} */}
                              </div>
                              <div className="d-flex justify-content-between mt-1">
                                <div className={`${clickedSideMenu == 3 ? 'd-flex gap-4 left-menu-inner-div-border' : 'd-flex gap-4 left-menu-inner-div'}`} >
                                  <div className={`left-menu-inner-image-div ${clickedSideMenu == 3 ? 'imgDiv' : ""}`}>
                                    <img src={clickedSideMenu == 3 ? "Emergencywhite.svg" : "emergency.svg"} className={clickedSideMenu == 3 ? 'img-fluids' : "img-fluid2"} />
                                  </div>
                                  <div className="left-menu-inner-text-div">
                                    <h6 className={`${clickedSideMenu == 3 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={() => sidemenuFunction(3)}>Emergency</h6>
                                    {clickedSideMenu == 3 ? <div className="active-left-menu-inner-image-div"> </div> : " "}
                                  </div>
                                </div>
                                {/* {clickedSideMenu == 3 ? <div className="active-left-menu-inner-image-div"> </div> : " "} */}
                              </div>

                              <div className="d-flex justify-content-between mt-1">
                                <div className={`${clickedSideMenu == 6 ? 'd-flex gap-4 left-menu-inner-div-border' : 'd-flex gap-4 left-menu-inner-div'}`} >
                                  <div className={`left-menu-inner-image-div ${clickedSideMenu == 6 ? 'imgDiv' : ""}`}>
                                    <img src={clickedSideMenu == 6 ? "Filecabinetwhite.svg" : "filecabinet.svg"} className={clickedSideMenu == 6 ? 'img-fluids' : "img-fluid2"} />
                                  </div>
                                  <div className="left-menu-inner-text-div">
                                    <h6 className={`${clickedSideMenu == 6 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={() => sidemenuFunction(6)}>File Cabinet</h6>
                                    {clickedSideMenu == 6 ? <div className="active-left-menu-inner-image-div"> </div> : " "}
                                  </div>
                                </div>
                                {/* {clickedSideMenu == 6 ? <div className="active-left-menu-inner-image-div"> </div> : " "} */}
                              </div>
                              {roleId != 9 ? (
                                <div className="d-flex justify-content-between mt-1">
                                  <div className={`${clickedSideMenu == 8 ? 'd-flex gap-4 left-menu-inner-div-border' : 'd-flex gap-4 left-menu-inner-div'}`} >
                                    <div className={`left-menu-inner-image-div ${clickedSideMenu == 8 ? 'imgDiv' : ""}`}>
                                      <img src={clickedSideMenu == 8 ? "myroleswhite.svg" : "myroles.svg"} className={clickedSideMenu == 8 ? 'img-fluids' : "img-fluid2"} />
                                    </div>
                                    <div className="left-menu-inner-text-div">
                                      <h6 className={`${clickedSideMenu == 8 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} style={{ marginTop: "10px", fontWeight: 600, fontSize: "17px" }} onClick={() => sidemenuFunction(8)}>My Roles</h6>
                                      {clickedSideMenu == 8 ? <div className="active-left-menu-inner-image-div"> </div> : " "}
                                    </div>
                                  </div>
                                  {/* {clickedSideMenu == 8 ? <div className="active-left-menu-inner-image-div"> </div> : " "} */}
                                </div>
                              ) : ""}

                              <div className="d-flex justify-content-between mt-1">
                                <div className={`${clickedSideMenu == 7 ? 'd-flex gap-4 left-menu-inner-div-border' : 'd-flex gap-4 left-menu-inner-div'}`} >
                                  <div className={`left-menu-inner-image-div ${clickedSideMenu == 7 ? 'imgDiv' : ""}`}>
                                    <img src={clickedSideMenu == 7 ? "contactswhite.svg" : "contact.svg"} className={clickedSideMenu == 7 ? 'img-fluids' : "img-fluid2"} />
                                  </div>
                                  <div className="left-menu-inner-text-div" >
                                    <h6 className={`${clickedSideMenu == 7 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={() => sidemenuFunction(userRoleId == 3 ? "warning" : 7)}>Contacts</h6>
                                    {clickedSideMenu == 7 ? <div className="active-left-menu-inner-image-div"> </div> : " "}
                                  </div>
                                </div>
                                {/* {clickedSideMenu == 7 ? <div className="active-left-menu-inner-image-div"> </div> : " "} */}
                              </div>


                              <div className="d-flex justify-content-between mt-1">
                                <div className={`${clickedSideMenu == 9 ? 'd-flex gap-4 left-menu-inner-div-border' : 'd-flex gap-4 left-menu-inner-div'}`} >
                                  <div className={`left-menu-inner-image-div ${clickedSideMenu == 9 ? 'imgDiv' : ""}`}>
                                    <img src={clickedSideMenu == 9 ? "Communicationwhite.svg" : "Communication.svg"} className={clickedSideMenu == 9 ? 'img-fluids' : "img-fluid2"} />
                                  </div>
                                  <div className="left-menu-inner-text-div">
                                    <h6 className={`${clickedSideMenu == 9 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={() => sidemenuFunction(9)}>Communication  </h6>
                                    {clickedSideMenu == 9 ? <div className="active-left-menu-inner-image-div"> </div> : " "}
                                  </div>
                                </div>
                                {/* {clickedSideMenu == 9 ? <div className="active-left-menu-inner-image-div"> </div> : " "} */}
                              </div>
                              {demo == true &&
                                <div className="d-flex justify-content-between mt-1">
                                  <div className={`${clickedSideMenu == 11 ? 'd-flex gap-4 left-menu-inner-div-border' : 'd-flex gap-4 left-menu-inner-div'}`} >
                                    <div className={`left-menu-inner-image-div ${clickedSideMenu == 1 ? 'imgDiv' : ""}`}>
                                      <img src={clickedSideMenu == 11 ? selectedDashboardIcon : dashboardIcon} className={clickedSideMenu == 11 ? 'img-fluid1' : "img-fluid3"} />
                                    </div>
                                    <div className="left-menu-inner-text-div w-100">
                                      <h6 className={`${clickedSideMenu == 11 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={(e) => sidemenuFunction(11)}>Annual Maintenance Plan</h6>
                                      {clickedSideMenu == 11 ? <div className="active-left-menu-inner-image-div"> </div> : " "}
                                    </div>
                                  </div>
                                  {/* {clickedSideMenu == 1 ? <div className="active-left-menu-inner-image-div"> </div> : " "} */}
                                </div>
                              }
                              <div className="d-flex justify-content-between mt-1">
                                <div className={`${clickedSideMenu == 10 ? 'd-flex gap-4 left-menu-inner-div-border' : 'd-flex gap-4 left-menu-inner-div'}`} >
                                  <div className={`left-menu-inner-image-div ${clickedSideMenu == 10 ? 'imgDiv' : ""}`}>
                                    <img src={clickedSideMenu == 10 ? "Helpcenterwhite.svg" : "help.svg"} className={clickedSideMenu == 10 ? 'img-fluids' : "img-fluid2"} />
                                  </div>
                                  <div className="left-menu-inner-text-div">
                                    <h6 className={`${clickedSideMenu == 10 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={() => sidemenuFunction(10)}>Help Center</h6>
                                    {clickedSideMenu == 10 ? <div className="active-left-menu-inner-image-div"> </div> : " "}
                                  </div>
                                </div>
                                {/* {clickedSideMenu == 10 ? <div className="active-left-menu-inner-image-div"> </div> : " "} */}
                              </div>
                              <hr style={{ width: "60%", margin: "10px auto", height: "5px", color: "grey" }}></hr>
                              <div className="footerImg md-5">
                                <div className="d-flex justify-content-center md-5">
                                  <img width="80%" height="auto" src="footerlogo.png" alt="brandAgingOptions" />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <div>

                          <div className='left-menu-main-div px-3'>
                            <div className='d-flex gap-3 left-menu-inner-div' >
                              <div className='left-menu-inner-image-div'>
                                <img src={clickedSideMenu == 1 ? "dasboardmaroonpreview.png" : "dasboard1.png"} className='img-fluids' />
                              </div>
                              <div className="left-menu-inner-text-div">
                                <h6 className={`${clickedSideMenu == 1 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={(e) => sidemenuFunction(1)}>Dashboard</h6>
                              </div>
                            </div>

                            <div className='d-flex gap-4 left-menu-inner-div' >
                              <div className='left-menu-inner-image-div'>
                                <img src={clickedSideMenu == 3 ? "ambulance.svg" : "vanblack1.png"} className='img-fluids' />
                              </div>
                              <div className="left-menu-inner-text-div">
                                <h6 className={`${clickedSideMenu == 3 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={() => sidemenuFunction(3)}>Emergency</h6>
                              </div>
                            </div>
                            <div className='d-flex gap-4 left-menu-inner-div' >
                              <div className='left-menu-inner-image-div'>
                                <img src={clickedSideMenu == 6 ? "filecabinetred.png" : "filecabinetblack2.png"} className='img-fluids' />
                              </div>
                              <div className="left-menu-inner-text-div">
                                <h6 className={`${clickedSideMenu == 6 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={() => sidemenuFunction(6)}>File Cabinet</h6>
                              </div>
                            </div>
                            <div className='d-flex gap-4 left-menu-inner-div' >
                              <div className='left-menu-inner-image-div'>
                                <img src={clickedSideMenu == 8 ? "rolered.png" : "roleblack.png"} className='img-fluids' />
                              </div>
                              <div className="left-menu-inner-text-div">
                                <h6 className={`${clickedSideMenu == 8 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} style={{ marginTop: "10px", fontWeight: 600, fontSize: "17px" }} onClick={() => sidemenuFunction(8)}>My Roles</h6>
                              </div>
                            </div>
                            <div className='d-flex gap-4 left-menu-inner-div' >
                              <div className='left-menu-inner-image-div'>
                                <img src={clickedSideMenu == 7 ? "phone.svg" : "contactblack1.png"} className='img-fluids' />
                              </div>
                              <div className="left-menu-inner-text-div" >
                                <h6 className={`${clickedSideMenu == 7 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={() => sidemenuFunction(7)}>Contacts</h6>
                              </div>
                            </div>
                            <div className='d-flex gap-4 left-menu-inner-div' >
                              <div className='left-menu-inner-image-div'>
                                <img src={clickedSideMenu == 9 ? "3 people.svg" : "communication3.png"} className='img-fluids' />
                              </div>
                              <div className="left-menu-inner-text-div">
                                <h6 className={`${clickedSideMenu == 9 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={() => sidemenuFunction(9)}>Communication  </h6>
                              </div>
                            </div>
                            <div className='d-flex gap-4 left-menu-inner-div' >
                              <div className='left-menu-inner-image-div'>
                                <img src={clickedSideMenu == 10 ? "helpred.png" : "helpblack1.png"} className='img-fluids' />
                              </div>
                              <div className="left-menu-inner-text-div">
                                <h6 className={`${clickedSideMenu == 10 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={() => sidemenuFunction(10)}>Help center</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="brand-aging-options-footer pt-2" style={{ width: "370px" }}>
                          <div className="brand-aging-options display-4 d-flex justify-content-center">
                            <p className="h6">Powered By</p>
                          </div>
                          <div className="d-flex justify-content-center">
                            <img src="../images/logo-footer.png" alt="brandAgingOptions" />
                          </div>
                        </div> */}
                        </div>
                        {/* <NavDropdown
                        title="Dropdown"
                        id={`offcanvasNavbarDropdown-expand-${expand}`}
                      >
                        <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action4">
                          Another action
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action5">
                          Something else here
                        </NavDropdown.Item>
                      </NavDropdown> */}
                      </Nav>
                      {/* <Form className="d-flex">
                      <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                      />
                      <Button variant="outline-success">Search</Button>
                    </Form> */}
                    </Offcanvas.Body>
                  </Navbar.Offcanvas>
                </Container>
              </Navbar>
            ))}
          </>
        </div>
      </> : <></>}
      {/* **************** responsive navbar code end *************** */}

      <div className='col-md-3 col-8 '>

        <div className='setuplop w-100  py-2 icon-clas1-resonsive icon-cls2 ps-md-3 ps-0 pe-0 '>
          <h2 className='Setup-text' style={{ marginLeft: "1px" }}>{props?.name == "Annual Maintenance Agreement" ? "" : props?.name ? props?.name : 'Setup'}</h2>
        </div>
      </div>
      <div className='col ms-1 d-flex justify-content-md-end justify-content-start align-items-center me-5 mt-2 ps-4 '>
        {/* <div className=' '> */}
        <div className='d-flex gap-2 justify-content-start pb-2 scrollersizePersonal' >

          {
            ((roleId == "3" || (roleId == "13" || roleId == "14" || roleId == "15"))) &&
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">{(roleId == "3") ? "Back to Paralegal" : (roleId == "13") ? "Back to Attorney" : (roleId == "14") ? "Back to Legal Assistant" : (roleId == "15") ? "Back to Law Office Staff" : ""}</Tooltip>} >
              <span className="d-inline-block" onClick={handleChangeLink}>
                <img className='backbutton-cls' style={{ cursor: "pointer", width: "25px" }} src="icons/backbtn.svg" />
              </span>
            </OverlayTrigger>
          }
          {(props?.name != 'File_Cabinet') ? <>
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Personal Info</Tooltip>} >
              <span className={"d-inline-block ImageIcons cursor-pointer"} style={props.name == 'Personal Information' ? { background: "#720c20" } : { background: "#d9d9d9" }} onClick={() => Router.push('./personalinfo')}>
                {props.name == 'Personal Information' ? <img className='menuLpo' src="personalinfpowhite.svg" /> : <img className='menuLpo' src="personalinfo.svg" />}
              </span>
            </OverlayTrigger>
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Family info</Tooltip>} >
              <span className="d-inline-block ImageIcons cursor-pointer " style={props.name == 'Family Information' ? { background: "#720c20" } : { background: "#d9d9d9" }} onClick={() => Router.push('./familyinfo')}>
                {props.name == 'Family Information' ? <img className='menuLpo' src="Vector-4.svg" /> : <img className='menuLpo' src="familyblack.svg" />}
              </span>
            </OverlayTrigger>
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Health Info</Tooltip>} >
              <span className="d-inline-block ImageIcons cursor-pointer " style={props.name == 'Health Information' ? { background: "#720c20" } : { background: "#d9d9d9" }} onClick={() => Router.push('./healthpage')}>

                {props.name == 'Health Information' ? <img className='menuLpo' src="healthwhite.svg" /> : <img className='menuLpo' src="healthblack.svg" />}

              </span>
            </OverlayTrigger>
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Housing Info</Tooltip>} >
              <span className="d-inline-block ImageIcons cursor-pointer " style={props.name == 'Housing Information' ? { background: "#720c20" } : { background: "#d9d9d9" }} onClick={() => Router.push('./housinginfo')}>
                {props.name == 'Housing Information' ? <img className='menuLpo' src="Vector-2.svg" /> : <img className='menuLpo' src="housingblack.svg" />}
              </span>
            </OverlayTrigger>
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Financial Info</Tooltip>} >
              <span className="d-inline-block ImageIcons cursor-pointer " style={props.name == 'Financial Information' ? { background: "#720c20" } : { background: "#d9d9d9" }} onClick={() => Router.push('./Finance')}>
                {props.name == 'Financial Information' ? <img className='menuLpo' src="professional.svg" /> : <img className='menuLpo' src="financeblack.svg" />}

              </span>
            </OverlayTrigger>
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Legal Information</Tooltip>} >
              <span className="d-inline-block ImageIcons cursor-pointer " style={props.name == 'Legal Information' || props.name == 'Fiduciary / Beneficiary' ? { background: "#720c20" } : { background: "#d9d9d9" }} onClick={() => Router.push("./LegalInfo")}>
                {props.name == 'Legal Information' || props.name == 'Fiduciary / Beneficiary' ? <img className='menuLpo' src="legalwhite.svg" /> : <img className='menuLpo' src="legalblack.svg" />}

              </span>
            </OverlayTrigger>

            {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Fiduciary/Beneficiary</Tooltip>} >
  <span className="d-inline-block ImageIcons cursor-pointer " style={props.name == 'Fiduciary / Beneficiary' ? { background: "#720c20" } : { background: "#d9d9d9" }} onClick={() => Router.push('./Fiduciary')}>
    {props.name == 'Fiduciary / Beneficiary' ? <img className='menuLpo' src="fiduciarywhite.svg" /> : <img className='menuLpo' src="fiduciaryblack.svg" />}

  </span>
</OverlayTrigger> */}
            {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Professional</Tooltip>} > */}
            {props.shoowheader == true ? "" : <>
              <span className="ImageIcons cursor-pointer">
                {/* <div  className='menuLpo'>                      <ProfessSearch  protypeTd="" /></div> */}
                <NewProServiceProvider protypeTd="" type='headerLpo' uniqueKey="headerlpo" />
              </span>
            </>}
            {/* </OverlayTrigger> */}

            <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Agent / Guidance</Tooltip>} >
              <span className=" d-flex justify-content-center align-items-center agentguidence-span-tag ImageIcons cursor-pointer" style={props.name == 'Agent / Guidance' ? { background: "#720c20" } : { background: "#d9d9d9" }} onClick={() => { Router.push('./Agentguidance') }} >
                {props.name == 'Agent / Guidance' ? <img className='menuLpo' src="setguidancewhite.svg" /> : <img className='menuLpo' src="setguidance.svg" />}

              </span>
            </OverlayTrigger>
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Generate Pdf</Tooltip>} >
              <span className=" d-flex justify-content-center align-items-center agentguidence-span-tag ImageIcons cursor-pointer" style={props.name == ' ' ? { background: "#720c20" } : { background: "#d9d9d9" }} onClick={() => handleShowPdf()} >
                {props.name == '' ? <img className='menuLpo' src="Vector-6.svg" /> : <img className='menuLpo' src="pdfviewblack.svg" />}

              </span>
            </OverlayTrigger>
          </> : <></>}

          {/* @@ NEW DESIGN MOVE */}
          {/* <MoveToNewNOldDesign refrencePage='headerlpo' action='new' /> */}
          {/* @@ NEW DESIGN MOVE */}
        </div>
        {/* </div> */}

      </div>
    </div>
    <WarningAlert setShowModal={setShowModal} showModal={showModal} msg="You don't have the permission to access the Contacts" header="Warning" />
  </>
  )
}