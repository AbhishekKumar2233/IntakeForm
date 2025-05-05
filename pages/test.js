import React, { useEffect } from 'react'
// import DataManager from '../components/control/DataManager'
import konsole from '../components/control/Konsole'
function test() {

    useEffect(()=>{
      // let appState = sessionStorage.getItem("appState");
      // let SessPrimaryUserId = sessionStorage.getItem("SessPrimaryUserId");
      // konsole.log("key", SessPrimaryUserId,"   ",appState);
      // DataManager.setEncryptId(appState);


      // let data = {
      //   name: 'pankaj',
      //   work: "web"
      // }
      // DataManager.setEncryptData("logginUserId",SessPrimaryUserId);
      // // DataManager.setEncryptData("data", data);
      // // DataManager.getEncryptData("data");
      // DataManager.getEncryptData("logginUserId");

    },[])
  return (
    <div>test</div>
  )
}

export default test