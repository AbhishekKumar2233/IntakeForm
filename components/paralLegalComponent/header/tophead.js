import React, { useContext, useEffect, useState } from "react";
import { $AHelper, authLogout } from "../../control/AHelper";
import Router from "next/router";
import { confirmationMsg, logoutUrl } from "../../control/Constant";
import konsole from "../../control/Konsole";
import { $CommonServiceFn, $getServiceFn } from "../../network/Service";
import { $Service_Url } from "../../network/UrlPath";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { globalContext } from "../../../pages/_app";
import { isNotValidNullUndefile } from "../../Reusable/ReusableCom";
import AccountRoleChange from "../../../component/Layout/Header/AccountRoleChange";
import { CustomButton } from "../../../component/Custom/CustomButton";


const tophead = (props) => {
  const [topheadheading, setTopheadheading] = useState("In-Take Form List");
  const [userdetails, setUserDetails] = useState({});
  const [logoUrl, setLogoUrl] = useState(null);
  const context = useContext(globalContext);

  useEffect(() => {
    const userDetails = $AHelper.getObjFromStorage("userLoggedInDetail");
    const sample = $AHelper.getObjFromStorage("userLoggedInDetail")
    setUserDetails(userDetails);
    // console.log("userLoggedInDetail",sample)
    userLogo();
    // konsole.log("userDetails",userDetails)
  }, []);

  konsole.log("usedetails", userdetails);


  const userLogo = () => {
    const subtenantId = sessionStorage.getItem("SubtenantId");
    const subtenantLogoUrl = $AHelper.getCookie("subtenantLogoUrl");
    // const userId = "7aeea162-1200-4bb8-b53b-e7e3013a0f28"
    // const loggedUserId = "7aeea162-1200-4bb8-b53b-e7e3013a0f28";

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

  const handleLogout = async () => {
    let confirmQuestion = await context.confirm(true, confirmationMsg, "Confirmation");
    if (!confirmQuestion) return;

    $getServiceFn.handleLogout();
  };



  return (
    <>


      <div className="row  justify-content-between" style={{
        position: "fixed",
        width: "100%",
        zIndex: 1,
        backgroundColor: "white"


      }}>
        <div className="col-6 d-flex align-items-center gap-2">
          <img src={logoUrl !== null ? logoUrl : ""} alt="Subtenant Logo" className="" style={{ maxWidth: "120px", height: "50px", width: "100%" }} />
          <div className="vr h-50 align-items-center mt-4 mx-1"></div>
          <h2 className="fs-4 mt-3 mx-1" style={{ color: 'black' }} >
            {props.page == "Assignrole" ? "Assigning Chart" : props.page == 'Inquiry' ? 'Inquiry List' : (props.page == 'File_Cabinet') ? "File Cabinet" : "Intake / LPO Member List"}
          </h2>
        </div>
        <div className="col-6  d-flex justify-content-end">
          <div className="useNewDesignSCSS">
            <div className="row justify-content-end flex-row h-100">
              <div className="d-flex justify-content-center align-items-center">
                <div className="d-flex justify-content-center align-items-center pe-4 ps-3" style={{ background: '#dedede', borderRadius: '5px', height: '80%' }}>
                  <img
                    className="me-2"
                    src="/icons/ProfilebrandColor2.svg"
                    alt="user"
                    style={{ width: "30px" }}
                  />
                  <div className="cursor-pointer" >
                    <p className="text-dark d-inline-block m-0 me-2" style={{ fontSize: "10px" }} >{userdetails?.memberName}</p><br />
                    <p className="text-dark d-inline-block m-0 p-0 me-2" style={{ fontSize: "10px", color: '#7c7c7c' }} >{userdetails?.primaryEmailId}</p>
                  </div>
                </div>
                <span className="ms-1"><AccountRoleChange  /></span>
                <div className="vr align-item-center divder-cls" style={{ height: "20px", marginTop: "20px", padding: "0.8px" }}></div>

                <div className='right-side-heade-div-cls me-2'>
                  <button className='logout-btn ms-1 hide-div-class' onClick={handleLogout}><img src="/icons/logoutbtn.png" width="15px" className='me-1 mt-0' />
                    Logout</button>
                  <img className=' hide-div-class1' width="16px" src={"/icons/logoutcircle.svg"} alt="Logo" onClick={handleLogout} />
                </div>
              </div>
            </div>
            {/* } */}
          </div>
        </div>

      </div>
      <div className={`pt-2 pb-2  d-flex ${props?.page == 'Paralegal' ? '' : 'justify-content-between'} align-items-center`}
        style={{
          backgroundColor: "#720c20",
          position: "fixed",
          width: "100%",
          top: "61px",
          zIndex: 1
        }}>
        <div className="ps-5">
          <img src={`${(props.page == 'File_Cabinet') ? "icons/FileCabinet_White.svg" : "/icons/paralegalLogo.svg"}`} className="maleAvatarUser " alt="logo"></img>
        </div>
        <div className="d-flex ">
          {props?.page == 'Paralegal' ? <div><p className="px-2 fs-4" style={{ color: "white", border: "none", borderRadius: "5px", zIndex: "4322345" }}>WELCOME {userdetails?.memberName} ({userdetails?.roleId == 3 ? 'Paralegal' : userdetails?.roleId == 13 ? 'Attorney' : userdetails?.roleId == 14 ? 'Legal Assistant' : userdetails?.roleId == 15 ? 'Law Office Staff' : ''})</p></div> : <div className="pe-3">
            {(props.page == "Assignrole" || props.page == "File_Cabinet") ? <OverlayTrigger placement="bottom" overlay={<Tooltip>Back to Paralegal</Tooltip>} >
              <div>
                <img
                  className="menu2 me-2 cursor-pointer"
                  style={{ height: "30px", width: "30px" }}
                  onClick={() => {
                    Router.back();
                  }}
                  // src="https://img.icons8.com/pastel-glyph/64/ffffff/circled-left.png"
                  src="/icons/BackIcon.svg"
                />
              </div>
            </OverlayTrigger> : <></>}
            {/* <a className="p-2" style={{ color: "white", border: "none", fontSize: "22px", borderRadius: "5px", zIndex: "4322345" }} onClick={handleLogout} >
              Logout
            </a>} */}
          </div>}
        </div>
      </div>
    </>

  );
};

export default tophead;
