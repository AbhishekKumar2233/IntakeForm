import React, { useState, useEffect } from 'react';
import konsole from '../control/Konsole';

function fetchAllDetails () {
    // konsole.log("running usehook - fetchAllDetails");
    if (typeof window !== "undefined") {  // Ensure it's running in the browser
        return {
            _loggedInUserId: sessionStorage?.getItem('loggedUserId'),
            _primaryMemberUserId: sessionStorage?.getItem('SessPrimaryUserId'),
            _spouseUserId: sessionStorage?.getItem('spouseUserId'),
            _userLoggedInDetail: JSON.parse(sessionStorage?.getItem('userLoggedInDetail') || "null"),
            _userDetailOfPrimary: JSON.parse(sessionStorage?.getItem('userDetailOfPrimary') || "null"),
            _subtenantId: sessionStorage?.getItem('SubtenantId'),
            _subtenantName: sessionStorage?.getItem('subtenantName'),
            _loggedInRoleId: JSON.parse(sessionStorage?.getItem('stateObj') || "{}")?.roleId,
            _appState: JSON.parse(sessionStorage?.getItem('stateObj') || "{}")?.appState,
            _loggenInIdInt: JSON.parse(sessionStorage?.getItem('loggenInId') || "{}")?.appState
        };
    } else {
        return {}
    }
}

const useUserIdHook = () => {
    const [userData, setUserData] = useState(fetchAllDetails());
    // konsole.log("running usehook");

    useEffect(() => {
        setUserData(fetchAllDetails());
    }, []);

    return userData;
} 

export default useUserIdHook;
