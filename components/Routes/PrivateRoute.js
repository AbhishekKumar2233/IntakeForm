import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../App";
import commonLib from "../../control/commonLib";
import Service from "../../components/network/Service";
import { $Service_Url } from "../network/UrlPath";
import konsole from "../control/Konsole";
import { $AHelper } from "../control/AHelper";

export default function RequireAuth({ children }) {
  const AuthToken = commonLib.getSessionStoarge("AuthToken");
  const authed = AuthToken !== "" && AuthToken !== null ? true : false;
  const { setLoader } = useContext(UserContext);
  const [validUser, setValidUser] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      const stateObj = commonLib.getObjFromStorage("stateObj");
      $CommonServiceFn.InvokeCommonApi(
        "GET",
        $Service_Url.getAthenticatePath +
          `${stateObj?.userId}/${stateObj?.appState}/${stateObj?.loggedInUserId}/${stateObj?.roleId}/`,
        "",
        (response, errorData) => {
          if (response) {
            konsole.log("response", response);
            setValidUser(true);
          } else if (errorData) {
            konsole.log("err", errorData);
            $AHelper.unAuthurizeAccess();
          }
        }
      );
    }
    return () => {
      isMounted = false;
    };
  }, []);

  konsole.log("authed", authed, AuthToken);
  return authed === true ? <Container>{children}</Container> : <></>;
}
