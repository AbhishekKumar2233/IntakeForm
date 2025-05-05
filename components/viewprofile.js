import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Row, Col, Popover, Tooltip, OverlayTrigger, Container, Breadcrumb, Navbar } from 'react-bootstrap';

import Image from "react-bootstrap/Image";
import Feedback from "./Feedback";
import { demo } from '../components/control/Constant';
import Router from "next/router";
import konsole from "./control/Konsole";
import WarningAlert from "./WarningAlert";
import MoveToNewNOldDesign from "../component/Common/MoveToNewNOldDesign";





const viewprofile = (props) => {
  const [clickedSideMenu, setClickedSideMenu] = useState(1)
  let roleId = sessionStorage.getItem('roleUserId')
  let userRoleId = JSON.parse(sessionStorage.getItem('stateObj')).roleId
  const [showModal, setShowModal] = useState(false)

  const selectedDashboardIcon = (roleId) ? "Setupiconwhite.svg" : "Setupiconwhite.svg";
  const dashboardIcon = (roleId) ? "setupblack.svg" : "setupblack.svg";
  const dashboardText = (roleId) ? "Setup" : "Dashboard";

  useLayoutEffect(() => {
    const subUrl = window.location.pathname;
    konsole.log("Suburl", subUrl);
    if (subUrl.includes("dashboard") || subUrl.includes("setup")) {
      setClickedSideMenu(1);
    } else if (subUrl.includes("FileCabinetNew")) {
      setClickedSideMenu(6);
    }
    else if (subUrl.includes("Emergency")) {
      setClickedSideMenu(3);
    }

    else if (subUrl.includes("import_contact")) {
      setClickedSideMenu(7);
    }
    else if (subUrl.includes("MyRoles")) {
      setClickedSideMenu(8);
    }

    else if (subUrl.includes("Communication")) {
      setClickedSideMenu(9);
    }
    else if (subUrl.includes("AnnualMaintAgreement")) {
      setClickedSideMenu(11);
    }
    else if (subUrl.includes("Helpcenter")) {
      setClickedSideMenu(10);
    }


  }, [])

  const sidemenuFunction = (e) => {
    setClickedSideMenu(e)
    // console.log("eeeesseee", JSON.parse(userRoleId).roleId)
    if (e == 1) {
      Router.push("./dashboard")
    } else if (e == 6) {
      Router.push("./FileCabinetNew")
    }
    else if (e == 3) {
      Router.push("./Emergency")
    }
    else if (e == 7) {
      Router.push("./import_contact")
    }

    else if (e == 8) {
      Router.push("./MyRoles")
    }
    else if (e == 9) {
      Router.push("./Communication")
    }
    else if (e == 11) {
      Router.push("./AnnualMaintAgreement")
    }
    else if (e == 10) {
      Router.push("./Helpcenter")
    } else if (e == "warning") {
      setShowModal(true)
    }
  }
  return (
    <>
      {(roleId == 9) ?
        <>
          <div className="sidebar-main-div lpo-sidebar">
            <div>
              <div className='logo-main-div px-3 pt-4'>
              <div className="mb-3 useNewDesignSCSS">
              <MoveToNewNOldDesign type='LPO' refrencePage='viewprofile' action='new' />
              </div>
              <hr style={{ width: "87%", margin: "10px auto", height: "5px", color: "#B4B4B4 " }}/>
                <h2 className='logo-tag-life-h1 text-center' >Life Plan Organizer</h2>
              </div>
              <hr style={{ width: "80%", margin: "10px auto", height: "5px", color: "#B4B4B4" }}></hr>
              <div className='left-menu-main-div  text-center' style={{ position: "relative" }}>
           {/* @@ FOR NEW UI */}
              
           {/* @@ FOR NEW UI */}
                <div className="d-flex justify-content-between mt-1">
                  <div className={`${clickedSideMenu == 1 ? 'd-flex gap-4 left-menu-inner-div-border' : 'd-flex gap-4 left-menu-inner-div'}`} >
                    <div className={`left-menu-inner-image-div ${clickedSideMenu == 1 ? 'imgDiv' : ""}`}>
                      <img src={clickedSideMenu == 1 ? selectedDashboardIcon : dashboardIcon} className={clickedSideMenu == 1 ? 'img-fluid1' : "img-fluid3"} onClick={(e) => sidemenuFunction(1)} />
                    </div>
                    <div className="left-menu-inner-text-div">
                      <h6 className={`${clickedSideMenu == 1 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={(e) => sidemenuFunction(1)}>{dashboardText}</h6>
                      {clickedSideMenu == 1 ? <div className="active-left-menu-inner-image-div"> </div> : " "}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-1">
                  <div className={`${clickedSideMenu == 3 ? 'd-flex gap-4 left-menu-inner-div-border' : 'd-flex gap-4 left-menu-inner-div'}`} >
                    <div className={`left-menu-inner-image-div ${clickedSideMenu == 3 ? 'imgDiv' : ""}`}>
                      <img src={clickedSideMenu == 3 ? "Emergencywhite.svg" : "emergency.svg"} className={clickedSideMenu == 3 ? 'img-fluids' : "img-fluid2"} onClick={() => sidemenuFunction(3)} />
                    </div>
                    <div className="left-menu-inner-text-div">
                      <h6 className={`${clickedSideMenu == 3 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={() => sidemenuFunction(3)}>Emergency</h6>
                      {clickedSideMenu == 3 ? <div className="active-left-menu-inner-image-div"> </div> : " "}
                    </div>
                  </div>

                </div>

                <div className="d-flex justify-content-between mt-1">
                  <div className={`${clickedSideMenu == 6 ? 'd-flex gap-4 left-menu-inner-div-border' : 'd-flex gap-4 left-menu-inner-div'}`} >
                    <div className={`left-menu-inner-image-div ${clickedSideMenu == 6 ? 'imgDiv' : ""}`}>
                      <img src={clickedSideMenu == 6 ? "Filecabinetwhite.svg" : "filecabinet.svg"} className={clickedSideMenu == 6 ? 'img-fluids' : "img-fluid2"} onClick={() => sidemenuFunction(6)} />
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
                    <div className={`${clickedSideMenu == 8 && clickedSideMenu != 1 ? 'd-flex gap-4 left-menu-inner-div-border' : 'd-flex gap-4 left-menu-inner-div'}`} >
                      <div className={`left-menu-inner-image-div ${clickedSideMenu == 8 ? 'imgDiv' : ""}`}>
                        <img src={clickedSideMenu == 8 ? "myroleswhite.svg" : "myroles.svg"} className={clickedSideMenu == 8 ? 'img-fluids' : "img-fluid2"} onClick={() => sidemenuFunction(8)} />
                      </div>
                      <div className="left-menu-inner-text-div">
                        <h6 className={`${clickedSideMenu == 8 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={() => sidemenuFunction(8)}>My Roles</h6>
                        {clickedSideMenu == 8 ? <div className="active-left-menu-inner-image-div"> </div> : " "}
                      </div>
                    </div>
                    {/* {clickedSideMenu == 8 ? <div className="active-left-menu-inner-image-div"> </div> : " "} */}
                  </div>
                ) : ""}

                <div className="d-flex justify-content-between mt-1">
                  <div className={`${clickedSideMenu == 7 ? 'd-flex gap-4 left-menu-inner-div-border' : 'd-flex gap-4 left-menu-inner-div'}`} >
                    <div className={`left-menu-inner-image-div ${clickedSideMenu == 7 ? 'imgDiv' : ""}`}>
                      <img src={clickedSideMenu == 7 ? "contactswhite.svg" : "contact.svg"} className={clickedSideMenu == 7 ? 'img-fluids' : "img-fluid2"} onClick={() => sidemenuFunction(userRoleId == 3 ? "warning" : 7)} />
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
                      <img src={clickedSideMenu == 9 ? "Communicationwhite.svg" : "Communication.svg"} className={clickedSideMenu == 9 ? 'img-fluids' : "img-fluid2"} onClick={() => sidemenuFunction(9)} />
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
                      <div className={`left-menu-inner-image-div ${clickedSideMenu == 11 ? 'imgDiv' : ""}`}>
                        <img src={clickedSideMenu == 11 ? selectedDashboardIcon : dashboardIcon} className={clickedSideMenu == 11 ? 'img-fluid1' : "img-fluid3"} onClick={(e) => sidemenuFunction(11)} />
                      </div>
                      <div className="left-menu-inner-text-div w-100">
                        <h6 className={`${clickedSideMenu == 11 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={() => sidemenuFunction(11)}>Annual Maintenance Plan</h6>
                        {clickedSideMenu == 11 ? <div className="active-left-menu-inner-image-div"> </div> : " "}
                      </div>
                    </div>
                    {/* {clickedSideMenu == 9 ? <div className="active-left-menu-inner-image-div"> </div> : " "} */}
                  </div>
                }
                <div className="d-flex justify-content-between mt-1">
                  <div className={`${clickedSideMenu == 10 ? 'd-flex gap-4 left-menu-inner-div-border' : 'd-flex gap-4 left-menu-inner-div'}`} >
                    <div className={`left-menu-inner-image-div ${clickedSideMenu == 10 ? 'imgDiv' : ""}`}>
                      <img src={clickedSideMenu == 10 ? "Helpcenterwhite.svg" : "help.svg"} className={clickedSideMenu == 10 ? 'img-fluids' : "img-fluid2"} onClick={() => sidemenuFunction(10)} />
                    </div>
                    <div className="left-menu-inner-text-div">
                      <h6 className={`${clickedSideMenu == 10 ? "side-menu-tag-red" : 'side-menu-tag'} left-menu-inner-text-tag-h6`} onClick={() => sidemenuFunction(10)}>Help Center</h6>
                      {clickedSideMenu == 10 ? <div className="active-left-menu-inner-image-div"> </div> : " "}
                    </div>
                  </div>
                  {/* {clickedSideMenu == 10 ? <div className="active-left-menu-inner-image-div"> </div> : " "} */}
                </div>
                <hr style={{ width: "80%", margin: "10px auto", height: "5px", color: "grey" }}></hr>
                <div style={{ position: "fixed", bottom: "15px" }}>
                  <div className="d-flex justify-content-center">
                    <img className="w-75" src="footerlogo.png" alt="brandAgingOptions" />
                  </div>
                </div>
              </div>


            </div>

          </div>

        </>
        :
        <>
          <div
            className={` article-scetion hide-div-class  ${props.isSideBarVisible ? "visible" : "invisible"
              }`
            }
          >

            <div className="container mt-3">
              <div className="imageContainer rounded position-relative">
                {/* <Image src="/images/AgingOptions.jpg" fluid={true} rounded={true}></Image> */}
                <div className="containerImagebackground"></div>
                <img src="/images/SideBarPng2.svg" className="img-2" alt="profile-image" />
                <p className="position-absolute text-white ">Intake Form</p>
              </div>
              <div className="container bg-white useNewDesignSCSS mt-2 p-2">
                <MoveToNewNOldDesign type='Intake' action='new' refrencePage='viewprofile' />
                <div className="row mt-2 ps-2">
                  <div className="row">
                    <h2 style={{ color: '#CD9952' }}>Success Tips.</h2>
                  </div>
                  <div className="row p-2">
                    <ul className="feedbackBullet ps-5">
                      <li className="mt-1"> <span className="headingfeed">Don’t rush </span>
                        You will be asked to gather information that may take a while to locate. That’s normal. Take as much time as you need to work through each screen.
                      </li>
                      <li className="mt-1"><span className="headingfeed">Take it in small bites. </span>
                        Slow and steady wins the race. Set aside an hour or two each day to focus on this project. If you feel like doing more, great.
                      </li>
                      <li className="mt-1"><span className="headingfeed">Keep the big picture in mind. </span>
                        You’re laying the groundwork for the kind of retirement you want, one where you live the good life without going broke, burdening your family, or being forced into a nursing home when your health fails.
                      </li>
                    </ul>
                  </div>
                </div>
                <hr />
                <Feedback getImage={props.getImage} image={props.image} classNameLocal={""} />
              </div>
            </div>
          </div>
        </>}
      <WarningAlert setShowModal={setShowModal} showModal={showModal} msg="You don't have the permission to access the Contacts" header="Warning" />

    </>
  );
};

export default viewprofile;
