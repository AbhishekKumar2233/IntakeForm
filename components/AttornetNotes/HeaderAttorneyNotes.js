import React, { useEffect, useState, useContext } from 'react';
import Router from 'next/router';
import { OverlayTrigger, Tooltip, Modal, Button, Row, Col, } from "react-bootstrap";
import { $AHelper } from "../control/AHelper";
import { isNotValidNullUndefile } from "../Reusable/ReusableCom";
import konsole from '../control/Konsole';
import { globalContext } from '../../pages/_app';
import { confirmationMsg } from '../control/Constant';
import { $CommonServiceFn, $getServiceFn } from '../network/Service';


const HeaderAttonerNotes = (props) => {
    let context = useContext(globalContext)
    const [userdetails, setUserDetails] = useState({});
    const [logoUrl, setLogoUrl] = useState(null);
    const [roleId, setRoleId] = useState(null)
    
    useEffect(() => {
        let roleID = JSON.parse(sessionStorage.getItem('stateObj'))?.roleId;
        setRoleId(roleID)
        konsole.log("12roleId",roleId)
        const userDetails = $AHelper.getObjFromStorage("userLoggedInDetail");
        setUserDetails(userDetails);
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
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getSubtenantDetails, subtenantObj, (response) => {
            if (response) {
                konsole.log("subtenentdetails", response.data);
                setLogoUrl(response.data.data[0].subtenantLogoUrl)
                sessionStorage.setItem("subtenantName", response.data.data[0].subtenantName)
            }
        }
        );
    };
    const logOut = async () => {
        let confirmQuestion = await context.confirm(true, confirmationMsg, 'Confirmation')
        if (!confirmQuestion) return;
        $getServiceFn.handleLogout();
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

    return (


        <>

            <div className="row  justify-content-between" style={{ position: "fixed", width: "100%", zIndex: 1, backgroundColor: "white" }}>
                <div className="col-6 ">
                    <img src={logoUrl !== null ? logoUrl : ""} alt="Subtenant Logo" className="" style={{ maxWidth: "120px", width: "100%" }} />
                </div>
                <div className="col-6  d-flex justify-content-end">
                    <div className="">
                        <div className="row justify-content-end flex-row h-100">
                            <div className="d-flex justify-content-center align-items-center">
                                <img   className="  me-2"   src="/icons/ProfilebrandColor2.svg"   alt="user"   style={{ width: "30px" }}/>
                                <p className="mt-2 text-dark  d-inline-block" style={{ fontSize: "16px" }} >{userdetails?.primaryEmailId}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


            <div className=" pt-2 pb-2  d-flex justify-content-between align-items-center"
                style={{  backgroundColor: "#720c20",  position: "fixed",  width: "100%",  top: "61px",  zIndex: 1}}>
                <div className="ps-5">
                    <img src={`/icons/paralegalLogo.svg`} className="maleAvatarUser " alt="logo"></img>
                </div>
                <div>
                    <h2 className="fs-4" style={{ color: "white" }}>LPO Attorney Notes</h2>
                </div>




                <div className="d-flex gap-3  ">
                <div>
                {
            ((roleId == "3" || (roleId == "13" || roleId == "14" || roleId == "15"))) &&
          <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">{(roleId == "3") ? "Back to Paralegal" : (roleId == "13") ? "Back to Attorney" : (roleId == "14") ? "Back to Legal Assistant" : (roleId == "15") ? "Back to Law Office Staff" : ""}</Tooltip>} >
           <span className="d-inline-block" onClick={handleChangeLink}>
           <img  className='backbutton-cls mt-0' style={{ cursor: "pointer", width: "25px", color:"white", paddingTop:"5px" }} src="icons/backbtnAttrny.svg" />
            </span>
           </OverlayTrigger>
                 }</div>
                    <div className="pe-3">
                        {(props?.page == "Assignrole" || props?.page == "File_Cabinet") ? <OverlayTrigger placement="bottom" overlay={<Tooltip>Back to Paralegal</Tooltip>} >
                            <span className="">
                                <img
                                    className="menu2 me-2 cursor-pointer"
                                    style={{ height: "30px", width: "30px" }}
                                    onClick={() => {
                                        Router.back();
                                    }}
                                    src="/icons/BackIcon.svg"
                                />
                            </span>
                        </OverlayTrigger> : <a className="p-2" style={{ color: "white", border: "none", fontSize: "22px", borderRadius: "5px", zIndex: "4322345" }} onClick={logOut} >
                            Logout
                        </a>}
                    </div>
                </div>


            </div>

        </>
    );


};


export default HeaderAttonerNotes;
