import React, { useState,useRef,useEffect } from "react";
import { useLoader } from "../utils/utils";
import { Row } from "react-bootstrap";
import { $Service_Url } from "../../components/network/UrlPath";
import { getApiCall2,isNotValidNullUndefile,postApiCall2 } from "../../components/Reusable/ReusableCom";
import { AOAcademyIframUrl,AOAcademyIframUrlNew} from "../../components/control/Constant";
import usePrimaryUserId from "../Hooks/usePrimaryUserId";
import { $getServiceFn } from "../../components/network/Service";
import konsole from "../../components/control/Konsole";

const AcademyInformation = () => {
    const [iframeloaded, setiframeloaded] = useState(false);
    const {userDetailOfPrimary, spouseUserId, isPrimaryMemberMaritalStatus, primaryMemberFullName, spouseFullName, maritalStatusId} = usePrimaryUserId();
    const [isRedirect, setIsRedirect] = useState(false)
    
    useEffect(() => {
      if(isNotValidNullUndefile(userDetailOfPrimary?.primaryEmailId)) {
        const stateObj = JSON.parse(sessionStorage.getItem('stateObj') ?? '{}');
        const finalSideBarMenu = sessionStorage.getItem('finalSideBarMenu') ?? "";
        const userObj = {
          user_email: userDetailOfPrimary?.primaryEmailId,
          menuIds: finalSideBarMenu,
          spouseUserId: spouseUserId,
          primaryMemberFullName, 
          spouseFullName: isPrimaryMemberMaritalStatus ? spouseFullName : null, 
          maritalStatusId
        }
        const finalObj = { ...userObj, ...stateObj };
        const queryFormat = new URLSearchParams(finalObj).toString();
        const finalUrl = `https://academyportalnew.nsplindia.co.in/wp-json/custom/v1/signin?${queryFormat}`

        konsole.log("dsafsadf", finalObj, queryFormat, finalUrl);
        
        window.location.replace(finalUrl);
      }
    }, [userDetailOfPrimary?.primaryEmailId])
    
    // const urlForAuththentication = `https://aointakeuatapi.azurewebsites.net/api/User/AuthenticateLoggedInUser/${userId}/${appState}/${loggenInId}/${roleId}/`;
  
    return (
        <Row className="academyMain">
          <div>loading...</div>
        </Row>
    )
}

export default AcademyInformation;