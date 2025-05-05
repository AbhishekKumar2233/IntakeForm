import React,{useEffect,useState,useContext} from 'react';
import konsole from '../control/Konsole';
import { $AHelper } from '../control/AHelper';
import { $Service_Url } from '../network/UrlPath';
import { $CommonServiceFn,$getServiceFn } from '../network/Service';
import { globalContext } from '../../pages/_app';
import {confirmationMsg} from '../control/Constant';
import {Tooltip, OverlayTrigger, } from 'react-bootstrap';
import Router from 'next/router';
import { isNotValidNullUndefile } from '../Reusable/ReusableCom';

const HeaderActivation = () => {
    let context=useContext(globalContext)
    const [logoUrl,setlogoUrl]=useState(null)
    const [userDetailOfPrimary,setuserDetailOfPrimary]=useState('')
  const roleId = (JSON.parse(sessionStorage.getItem("stateObj")).roleId);
          let userDetailOfPrimaryy=JSON.parse(sessionStorage.getItem('userDetailOfPrimary')) || '';
  useEffect(() => {
    let logginUser = sessionStorage?.getItem("userLoggedInDetail") || '';
        let userDetailOfPrimary=JSON.parse(sessionStorage.getItem('userLoggedInDetail')) || '';

    setuserDetailOfPrimary(userDetailOfPrimary)
    userLogo();
  }, [])
  const userLogo = () => {
    const subtenantId = sessionStorage.getItem("SubtenantId");
    const subtenantLogoUrl = $AHelper.getCookie("subtenantLogoUrl");

    if (isNotValidNullUndefile(subtenantLogoUrl) && subtenantLogoUrl != 'undefined') {
      setlogoUrl(subtenantLogoUrl);
      return;
    }


    let subtenantObj = {
      subtenantId: subtenantId
    }
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getSubtenantDetails, subtenantObj,(response) => {
      if (response) {
        konsole.log("subtenentdetails", response.data);
        setlogoUrl(response.data.data[0].subtenantLogoUrl)
        sessionStorage.setItem("subtenantName",response.data.data[0].subtenantName)
      }
    }
    );
  };
      const logOut=async()=>{
         let confirmQuestion =await context.confirm(true,confirmationMsg,'Confirmation')
         if(!confirmQuestion) return;
    $getServiceFn.handleLogout();
  }

  const handleChangeLink = () => {
    if (roleId == "3" || roleId == '13' || roleId == '14' || roleId == '15') {
        if(context?.previousRoute?.toLowerCase()?.includes("paralegal".toLowerCase())){
        Router.back();
        } else{
        Router.push("/paralegal");
      }
    }
  }

  return (
    <header className=" top-header-2 bg-white useNewDesignSCSS">
      <div className="d-flex align-items-center justify-content-between py-0">
        <div>
          <img src={logoUrl !== null ? logoUrl : "/images/logoImage.png"} alt="Logo" />
        </div>
        <div className="content-box d-flex align-items-center justify-content-start me-2">
          <img src="/icons/ProfilebrandColor2.svg" className="maleAvatarUser" alt="user" />
          <h2 className="ms-2">{userDetailOfPrimary?.primaryEmailId}</h2>
          <h2 className='d-flex align-item-center justify-content-center' style={{ marginTop: "5px", marginLeft: "0px" }}>
              <a href="#" onClick={logOut} className='mx-1'> <span className=' px-1'>Logout</span>
              <img className='pb-2' width="20px" height="20px" src="/icons/logoutcircle.svg" /></a>
            </h2>
          </div>
      </div>
      <div className="title-header ps-5">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center justify-content-start" style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
            <img src="/icons/ProfilebrandColor2.svg" className="w-75 m-0 p-0" alt="user" />
          </div>
          <div className="d-flex align-items-center justify-content-start w-100">
            <h2 className="overflow-hidden">{$AHelper.capitalizeAllLetters(userDetailOfPrimaryy?.memberName)}</h2>
          </div>
          {/* <div className="d-flex align-items-center justify-content-end gap-2">
            <h2 style={{ marginTop: "5px", marginLeft: "0px" }}><a href="#" onClick={()=>logOut()}>Logout</a></h2>
          </div> */}
          <div className="d-flex align-items-center justify-content-end gap-2">

            {
              (roleId == "3" || (roleId == "13" || roleId == "14" || roleId == "15")) &&
              <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">{(roleId == "3") ? "Back to Paralegal" : (roleId == "13") ? "Back to Attorney" : (roleId == "14") ? "Back to Legal Assistant" : (roleId == "15") ? "Back to Law Office Staff" : ""}</Tooltip>} >
                <span className="d-inline-block" onClick={()=>handleChangeLink()}>
                  <img className='menu2' src="icons/BackIcon.svg" />
                </span>
              </OverlayTrigger>
            }
          </div>
        </div>
      </div>
    </header>
  );


};


export default HeaderActivation;
