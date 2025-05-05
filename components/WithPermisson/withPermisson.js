"use client"
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import konsole from '../control/Konsole';
import { $AHelper } from '../control/AHelper';
import { logoutUrl } from '../control/Constant';

const withAuth = (WrappedComponent, allowedRoles = []) => {
  return () => {

    const router = useRouter();
    const [state, setState] = useState("no");


    const userRole = useRef();
    useEffect(() => {
      userRole.current = $AHelper.getObjFromStorage("stateObj")?.roleId;
      const authToken = sessionStorage.getItem('AuthToken')

      konsole.log("userRole", userRole);
      if (authToken && allowedRoles.includes(userRole.current)) {
        return setState("permission");
      }
      else if(authToken) {
        return setState("nopermission");
      }else{
        return setState("404");
      }

    }, []);

    if (state === "permission" && allowedRoles.includes(userRole.current)){
      return <WrappedComponent />;
    } else if (state === "nopermission") {
      return <p className='p-2'>You do not have permission to access this page</p>; // Render nothing if the user doesn't have the required role
    }else if(state=='404'){
      return  window.location.replace(`${logoutUrl}Account/SignIn`)
    }
    else {
      return <></>
    }
  };
};

export default withAuth;
