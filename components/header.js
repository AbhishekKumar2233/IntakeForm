import React, { useState, useEffect, useContext } from 'react'
import Router from "next/router";
import { Button, Row, Col, Popover, Modal, Tooltip, OverlayTrigger, Container, Breadcrumb, Navbar } from 'react-bootstrap';
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
import NewProServiceProvider from './NewProServiceProvider';
import { isNotValidNullUndefile, } from './Reusable/ReusableCom';
import MoveToNewNOldDesign from '../component/Common/MoveToNewNOldDesign';
import AccountRoleChange from '../component/Layout/Header/AccountRoleChange';

const header = (props) => {

  const [showPdf, setShowPdf] = useState(false);
  const [loginUser, setLoggedInUser] = useState({});
  const [LogoUrl, setLogoUrl] = useState()
  const primaryUserId = sessionStorage.getItem("SessPrimaryUserId");
  const roleId = (JSON.parse(sessionStorage.getItem("stateObj")).roleId);
  const rolePrimaryId = sessionStorage.getItem('roleUserId')
  const context = useContext(globalContext);
  const NotifyMessageCount = useContext(globalContext);
  const [openmodalagent, setOpenmodalagent] = useState(false)

  const [clickedSideMenu, setClickedSideMenu] = useState(0)
  const [innerWidthState, setInnerWidthState] = useState(innerWidthState);


  useEffect(() => {
    const handleResize = () => {
      setInnerWidthState(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);



  useEffect(() => {
    let logginUser = sessionStorage.getItem("userLoggedInDetail") || '';
    setLoggedInUser(JSON.parse(logginUser));
    userLogo();
  }, [])


  const userLogo = () => {
    const subtenantId = sessionStorage.getItem("SubtenantId");
    const subtenantLogoUrl = $AHelper.getCookie("subtenantLogoUrl");

    if (isNotValidNullUndefile(subtenantLogoUrl) && subtenantLogoUrl != 'undefined') {
      setLogoUrl(subtenantLogoUrl);
      return;
    }

    let subtenantObj = {
      subtenantId: subtenantId
    }
    konsole.log("useId", subtenantId);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getSubtenantDetails, subtenantObj,
      (response) => {
        if (response) {
          konsole.log("fiduciaryList", response.data);
          setLogoUrl(response.data.data[0].subtenantLogoUrl)
          $AHelper.setCookie("subtenantLogoUrl", response.data.data[0].subtenantLogoUrl)
          sessionStorage.setItem("subtenantName", response.data.data[0].subtenantName)
        }
      }
    );
  };

  const handleClick = () => {
    props.showSideBar();
  }
  const handleShowPdf = () => {
    setShowPdf(!showPdf)
  }

  const handleChangeLink = () => {
    konsole.log("contenxtksdnfjskhfjkshf", context);

    if (roleId == "3" || roleId == '13' || roleId == '14' || roleId == '15') {
      if (context?.previousRoute?.toLowerCase()?.includes("paralegal".toLowerCase())) {
        Router.back();
      }
      else {
        Router.push("/paralegal");
      }
    }
    else if (roleId == "9" || roleId == "1") {
      konsole.log("asdjsahf", roleId);
      window.location.replace(lpoLiteUrl + "Dashboard");
    }
  }


  const handleLogout = async () => {
    let confirmQuestion = await context.confirm(true, confirmationMsg, "Confirmation");
    if (!confirmQuestion) return;
    $getServiceFn.handleLogout();
  };

  // showprefessservice = () => {
  //   this.setState({
  //     showProfess: !this.state.showProfess
  //   })
  // }


  const sidemenuFunction = (e) => {
    setClickedSideMenu(e)
    konsole.log("eeeesseee", e)
    if (e == 1) {
      Router.push("./dashboard")
    } else if (e == 6) {
      Router.push("./FileCabinetNew")

    }
  }
  const onselect = (item) => {
    NotifyMessageCount?.setIsbool(item)
    setOpenmodalagent(false)

  }
  const formatDate = (dateString) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const formattedDate = `${day} ${months[monthIndex]}`;
    return formattedDate;
  }



  const inputDate = "2009-08-28T00:00:00";

  return (
    <>
      <header className="bg-white" style={(rolePrimaryId != "9") ? { height: "auto" } : { height: "auto" }}>
        {
          showPdf ? <GeneratePdf memberId={primaryUserId} show={showPdf} handleShow={handleShowPdf} /> : <></>
        }

        <div className="top-header d-flex flex-wrap align-items-center justify-content-md-between justify-content-center useNewDesignSCSS">
          <div className={`${rolePrimaryId != "9" ? "logo-box d-flex flex-wrap align-items-center justify-content-between w-100" : "logo-box"}`}
            onClick={() => { Router.push("./dashboard"); }} >
            <div className='LifePointLowLogo'>
              <img src={LogoUrl !== null ? LogoUrl : "/images/logoImage.png"} alt="Logo" onClick={props.getImage} />
            </div>
            {/* primary user name and spouse name for responsive screen code start */}
            <div className={`${rolePrimaryId == "9" ? "d-none" : ""}`}>
              <div className='' onClick={() => { handleClick() }} style={{ cursor: "pointer" }}>
               
                {
                  props.loggedin &&
                  <div className='d-flex w-100' >
                    <div className="d-flex align-items-center justify-content-start" style={{ "whiteSpace": "nowrap", "overFlow": "hidden", }} >
                      <img src="/icons/ProfilebrandColor2.svg" className='intakeEmailLogo m-0 p-0' alt="user" />
                    </div>
                    <div className="emailIntakeText">
                      <h5> {loginUser.primaryEmailId}</h5>
                      <span className='ms-2'>
                      <AccountRoleChange />
                      </span>
                    </div>
                  </div>
                }
              </div>
            </div>
            {/* primary user name and spouse name for responsive screen code end */}
          </div>

          <div className=''>{(rolePrimaryId == "9") &&
            props.loggedin &&
            <div className=''>
              <div className="responsive-username">
                <img src="/icons/ProfilebrandColor2.svg"
                  className={`${(isNotValidNullUndefile(props.userProfile.spouseName)) ? "maleAvatarUser primaryuser-image-class hide-div-class " : "maleAvatarUser primaryuser-image-class1 hide-div-class"}`}
                  alt="user" />

                {(isNotValidNullUndefile(props.userProfile.spouseName)) && <img src="/icons/ProfilebrandColor2.svg" className='maleAvatarUser Spousecls hide-div-class img-fluid' alt="user" />}
                <div className='hide-div-class ms-2 mt-1'>
                  <h3 className="overflow-hidden usernme-h3-tag" >
                    {props.userProfile ? $AHelper.capitalizeAllLetters(props.userProfile.memberName) + (($AHelper.capitalizeAllLetters(props.userProfile.spouseName) !== null && $AHelper.capitalizeAllLetters(props.userProfile.spouseName) !== undefined && $AHelper.capitalizeAllLetters(props.userProfile.spouseName !== '')) ? (" & " + $AHelper.capitalizeAllLetters(props.userProfile.spouseName)) : '') : ''}
                  </h3>
                  {/* <h3 className="overflow-hidden usernme-h3-tag">
                  {props.userProfile ? (
                    <span className='showDottName d-inline-block'>{$AHelper.capitalizeAllLetters(props.userProfile.memberName)}</span>
                  ) : null}
                  {props.userProfile && props.userProfile.spouseName && (
                    <span className='showDottName d-inline-block'>{isNotValidNullUndefile($AHelper.capitalizeAllLetters(props.userProfile.spouseName)) ? 
                    ("& " + $AHelper.capitalizeAllLetters(props.userProfile.spouseName)) : ''}</span>)}
                   </h3> */}
                </div>
              </div>
            </div>
          }
          </div>
          <div className="content-box d-flex">
            <div>
              {/* <Feedback getImage={props.getImage} image={props.image}/> */}
            </div>
            {(rolePrimaryId == "9") &&
              props.loggedin &&
              <>

                <div className='right-side-heade-main-div w-100 pb-2 mt-3'>
                  <div className='d-flex headerBorder mt-2 me-1'>
                    <div className='right-side-heade-div-cls ms-3 mb-2 mt-2 me-4'>
                      <img style={{ width: "40px" }} src="/icons/ProfilebrandColor2.svg" className='maleAvatarUser' alt="user" />
                      <div className='cursor-pointer'>
                        <h2 className='ms-2 usernme-h2-tag' style={{ color: "#5A5A5A" }}>{$AHelper.capitalizeAllLetters(props.userProfile.memberName)}</h2>
                        <h2 className="ms-2 useremail-h2-tag" style={{ marginTop: "2px", color: "rgba(181, 181, 181, 1)" }}  >{loginUser.primaryEmailId}</h2>
                      </div>
                    </div>
                    {!paralegalAttoryId.includes(roleId) && <>
                      <div className="vrs align-item-center divder-cls" style={{ height: "20px", marginTop: "19px", padding: "0.8px" }}></div>
                      <div className='right-side-heade-div-cls me-3'>
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Account settings</Tooltip>} >
                          <img src="/settingsIcon.svg" width="15px" style={{ cursor: "pointer" }} className='mt-0' onClick={() => Router.push('./Editprofile')} />
                        </OverlayTrigger>
                      </div>
                    </>}
                  </div>
                  <span className='mt-3 h-25'>
                    <AccountRoleChange />
                  </span>
                  <div className="vr align-item-center divder-cls" style={{ height: "20px", marginTop: "26px", padding: "0.8px" }}></div>

                  <div className='right-side-heade-div-cls mt-2 me-2'>
                    <button className='logout-btn ms-1 hide-div-class' onClick={handleLogout}><img src="/icons/logoutbtn.png" width="15px" className='me-1 mt-0' />
                      Logout</button>
                    <img className=' hide-div-class1' width="16px" src={"/icons/logoutcircle.svg"} alt="Logo" onClick={handleLogout} />
                  </div>
                </div>

              </>
            }
          </div>
        </div>

        {(rolePrimaryId != "9") && <div className={` title-header py-2  ${rolePrimaryId == "9" ? "title-header1" : ""}`} >
          <Row className="d-flex align-items-center">
            <Col lg={"5"} className='header-tablet-hide-primary-user-cls' onClick={handleClick} style={{ cursor: "pointer" }}>
              {
                props.loggedin &&
                <div className='d-flex ' >
                  <div className="d-flex align-items-center justify-content-start " style={{ "whiteSpace": "nowrap", "overFlow": "hidden", }} >
                    <img src="/icons/ProfilebrandColor2.svg" className='w-75 m-0 p-0' alt="user" />
                  </div>
                  <div className="d-flex align-items-center justify-content-start w-100">
                    <h3 className="overflow-hidden text-light" >{props.userProfile ? $AHelper.capitalizeAllLetters(props.userProfile.memberName) + ((isNotValidNullUndefile(props.userProfile.spouseName)) ? (" & " + $AHelper.capitalizeAllLetters(props.userProfile.spouseName)) : '') : ''}</h3>
                  </div>
                </div>
              }
            </Col>
            <Col sm="6" md="6" lg={window.innerWidth > 1120 ? "3" : "6"} className="d-flex align-items-center justify-content-between ps-0 pe-0">
              <h2>{props.name}</h2>
              <div className='d-md-none mb-2' style={{ padding: "3px 5px", borderRadius: "5px", border: "1px solid #fff" }}>
                <img className='mb-1 mt-0  intakelogoutBtn' src='icons/simple_intake_logoutBtn.svg' onClick={handleLogout} /><h3 className='d-inline logout_h3 ms-1'>Logout</h3>
              </div>
            </Col>
            <Col sm="6" md="6" lg={window.innerWidth > 1120 ? "4" : "6"} className="d-flex  align-items-center justify-content-end gap-2">
              {
                (roleId == "3" || (roleId == "13" || roleId == "14" || roleId == "15")) &&
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">{(roleId == "3") ? "Back to Paralegal" : (roleId == "13") ? "Back to Attorney" : (roleId == "14") ? "Back to Legal Assistant" : (roleId == "15") ? "Back to Law Office Staff" : ""}</Tooltip>} >
                  <span className="d-inline-block" onClick={handleChangeLink}>
                    <img className='menu2' src="icons/BackIcon.svg" />
                  </span>
                </OverlayTrigger>
              }


              {
                (props?.name !== "File Cabinet") ?
                  <>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Personal Info</Tooltip>} >
                      <span className="d-inline-block" onClick={() => Router.push('./personalinfo')}>
                        <img className='menu2' src="icons/personalInfoHeader.svg" />
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Family info</Tooltip>} >
                      <span className="d-inline-block" onClick={() => Router.push('./familyinfo')}>
                        <img className='menu2' src="icons/FamilyInfoHeader.svg" />
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Health Info</Tooltip>} >
                      <span className="d-inline-block" onClick={() => Router.push('./healthpage')}>
                        <img className='menu2' src="icons/healthInfoHeader.svg" />
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Housing Info</Tooltip>} >
                      <span className="d-inline-block" onClick={() => Router.push('./housinginfo')}>
                        <img className='menu2' src="icons/housingInfoHeader.svg" />
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Financial Info</Tooltip>} >
                      <span className="d-inline-block" onClick={() => Router.push('./Finance')}>
                        <img className='menu2' src="icons/financialInfoHeader.svg" />
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Legal Information</Tooltip>} >
                      <span className="d-inline-block" onClick={() => Router.push("./LegalInfo")}>
                        <img className='menu2' src="icons/legalHeader.svg" />
                      </span>
                    </OverlayTrigger>

                    {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Fiduciary/Beneficiary</Tooltip>} >
                    <span className="d-inline-block" onClick={() => Router.push('./Fiduciary')}>
                      <img className='menu2' src="icons/fidheaderIcon.svg" />
                    </span>
                  </OverlayTrigger> */}
                    {props.shoowheader == true ? "" : <>
                      {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Professional</Tooltip>} > */}
                      <span className="d-inline-block">
                        {/* <div  className='menu2'>                      <ProfessSearch  protypeTd="" /></div> */}
                        <NewProServiceProvider protypeTd="" type='header' uniqueKey="header" />
                      </span>
                      {/* </OverlayTrigger> */}
                    </>}
                    {(rolePrimaryId == "9") &&
                      <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Agent / Guidance</Tooltip>} >
                        <span className=" d-flex justify-content-center align-items-center mt-1 agentguidence-span-tag" onClick={() => { Router.push('./Agentguidance') }} >
                          <img className='m-0 p-0' style={{ width: "15px" }} src="icons/agent1.svg" />
                        </span>
                      </OverlayTrigger>
                    }
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Generate Pdf</Tooltip>} >
                      <span className="d-inline-block headerSpan2 bg-white mt-1">
                        <img className="menu2" src='./icons/pdfIcon.svg' onClick={handleShowPdf} />
                      </span>
                    </OverlayTrigger>
                    {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Professional Service Provider</Tooltip>} >
                    <span className="d-inline-block" onClick={this.showprefessservice }>
                      <img className='menu2' src="icons/professHeader.svg"/>
                    </span>
                  </OverlayTrigger> */}
                  </>
                  : <></>
              }
              {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Generate Pdf</Tooltip>} >
              <span className="d-inline-block headerSpan bg-white mt-1">
                <img className="menu2" src='./icons/pdfIcon.svg' onClick={handleShowPdf} />
              </span>
            </OverlayTrigger> */}
              <h3 className='text-light d-none d-sm-block' style={{ marginTop: "5px", marginLeft: "0px" }} >
                <a onClick={handleLogout}>Logout</a>
              </h3>

              {/* @@ NEW DESIGN MOVE */}
              {/* <MoveToNewNOldDesign refrencePage='header' action='new' /> */}
              {/* @@ NEW DESIGN MOVE */}

            </Col>
          </Row>
        </div>}
      </header>
      <Modal show={openmodalagent}
        onHide={() => setOpenmodalagent(false)}
        className="modalDialogbox mt-4"
        style={{ zIndex: "999999", borderRadius: "1 !important" }}
      >
        <Modal.Header className="" closeVariant="white" closeButton></Modal.Header>
        <Modal.Body className="modalDialog_body1" style={{ padding: "7px" }}>
          <div className="justify-content-center border-bottom">
            {(NotifyMessageCount?.NotifyMessageCount && NotifyMessageCount?.NotifyMessageCount.length > 0) ?
              NotifyMessageCount?.NotifyMessageCount.map((item, index) => {
                return <>
                  <div className='card text-dark bg-light' style={{ borderBottom: "1px solid lightgry", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer" }} onClick={() => onselect(item)}>
                    <div className="card-body">
                      <div className='d-flex justify-content-between mb-2'><h3 className="card-title contactName"><img src='images/user.svg' style={{ height: "22px", marginTop: "unset", marginRight: "5px" }}></img>{item?.personFName + " " + item?.personLName}'s birthday</h3> <p className="card-text text-align-end">Today</p></div>
                      <h6 className="card-title contactName" style={{ color: "gray" }}> Wish {item?.personFName + " " + item?.personLName} happy birthday on {formatDate(item?.personDOB)}</h6>
                    </div>
                  </div>
                </>
              }) :
              <>
                <div className="fw-bold mt-1" style={{ border: "none" }}> No notificaton available</div>
              </>
            }
          </div>
        </Modal.Body>
      </Modal>
    </>
  );

}

export default header
