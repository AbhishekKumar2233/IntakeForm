import React,{useState} from 'react'

import { Button, Modal} from 'react-bootstrap';
import Congratulations from './Congratulations';
import  VerifyOtp  from './VerifyOtp';
import  VerifyPassword  from './VerifyPassword';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader' ;
import { $CommonServiceFn } from '../network/Service';
import { $Service_Url } from '../network/UrlPath';
import { configdata } from '../control/Constant';
import konsole from '../control/Konsole';
import { connect } from 'react-redux';
import { SET_LOADER } from '../Store/Actions/action';
import OccurrenceParalegal from './Datatable/OccurrenceParalegal';

 const VerifyOtpPassword = (props) => {
  let clientInfo=props?.selectclientdata
konsole.log('prospropa',props?.selectclientdata?.loginUserId)
    const [showverifyotp, setshowverifyotp] = useState(false)
   const [showButtons, setShowButtons] = useState(true);
    const[showvarifyPassword,setshowvarifyPassword]=useState(false)
    const[showcongratulation,setshowcongratulation]=useState(false)
    const [lagecycongratulationsuser,setlagecycongratulationsuser]=useState('')
    const[resendotp,setresendotp]=useState(false)
    const[resendotpid,setresendotpid]=useState(false)
    const[btnDisable,setbtnDisable]=useState(false)
   
    const [otpresdata, setotpresdata] = useState()
    const [openEmailTextPreview,setOpenEmailTextPreview]=useState(false)
    const [uniqueLink,setUniqueLink]=useState('')

    const clientdata = (clientdata, buttontype) => {
      if(btnDisable) return;
      setbtnDisable(true);
     konsole.log("clientdata", clientdata)
     let createdBy = sessionStorage.getItem("loggedUserId")

    //  let jsonObj = {
    //    subtenantId: clientdata.subtenantId,
    //    loginUserId: clientdata.loginUserId,
    //    userId: clientdata.memberId,
    //    memberName: clientdata.memberName,
    //    emailAddress: clientdata.primaryEmailAddress,
    //    signUpPlatform: clientdata.signUpPlatform,
    //    createdBy: createdBy,
    //    clientIPAddress: "::1"
    //  }
    let jsonObj =  {
      "userRegstrtnId": clientdata.loginUserId,
      "userId": clientdata.memberId,  
      "signUpPlatform":  clientdata.signUpPlatform,
      "createdBy": createdBy,
      "clientIPAddress":  "::1"
    }
    
     konsole.log("jsonjsonsendactivation", JSON.stringify(jsonObj))
     konsole.log("client", clientdata)
     props.dispatchloader(true);
     $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getUserActivationLink, jsonObj, (res, error) => {
         props.dispatchloader(false);
        //  setbtnDisable(false);
         if (res) {
          konsole.log('getUserActivationLinkgetUserActivationLink',res)
          let responseData=res.data.data
           let userActivationId = responseData?.userActivationId
           let userRegstrtnId = responseData?.userRegstrtnId
           let activationKey = responseData?.activationKey
           setUniqueLink(responseData?.activationURL)

           if(buttontype == "staff"){
             sendotpApi(clientdata, userActivationId, userRegstrtnId, activationKey);
           }
           else{
            konsole.log('getUserActivationLink',error)
             setOpenEmailTextPreview(true)

           }

         } else {
           konsole.log("error", error)
         }

       });
   }

   const sendotpApi = (clientdata, userActivationId, userRegstrtnId, activationKey) => {
     let otpSendMedium;

     konsole.log("clientdataclientdata", clientdata)

     if (clientdata.primaryPhoneNumber !== null && clientdata.primaryEmailAddress) {
       otpSendMedium = configdata.OTPMEDIUMBOTH
     }
     else if (responseData.primaryPhoneNumber !== null) {
       otpSendMedium = configdata.OTPMEDIUMSMS
     }
     else if (responseData.primaryEmailAddress !== null) {
       otpSendMedium = configdata.OTPMEDIUMEMAIL;
     }

     const postData = {
       "createdBy": clientdata.memberId,
       "otpSendMedium": otpSendMedium,
       "subtenantId": clientdata.subtenantId,
       "otpType": configdata.USERACTIVATION
     }

     konsole.log("jsonjsonsendotp", JSON.stringify(postData))
     props.dispatchloader(true);
     $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postSendOtp, postData, (resp, error) => {
       props.dispatchloader(false);
       if (resp) {
         konsole.log("otp send resp", resp);

         let data = resp.data.data
         let responsejsonwithactivationid = {
           createdBy: data.createdBy,
           id: data.id,
           otpSendMedium: data.otpSendMedium,
           otpSendOn: data.otpSendOn,
           activationid: userActivationId,
           userRegstrtnId: userRegstrtnId,
           activationKey: activationKey

         }

         setotpresdata(responsejsonwithactivationid)
         setshowverifyotp(true);
         setShowButtons(false);
         // setshowverifyotppassword(true)
         // let createId = resp.data.data.createdBy;
         // let Id = resp.data.data.id;
         // let otpSendMedium = resp.data.data.otpSendMedium;
         // let otpSendOn = resp.data.data.otpSendOn;
         // konsole.log('idd', Id);
         // navigate(`/Account/verifyOtp?subtenantId=${subtenantId}`, {
         //   state: {
         //     createId: createId,
         //     Id: Id,
         //     otpSendOn: otpSendOn,
         //     otpSendMedium: otpSendMedium,
         //     subtenantId: subtenantId,
         //     signUpPlateform: parseInt(signUpPlatform)
         //   }
         // })
       }
       else if (error) {
         konsole.log("error", error)
       }
     })

   }
    

   const handleClosePreviewModal=()=>{
    setOpenEmailTextPreview(false)
     props.handleshowverifyotppassword();
   }

  return (
    <>
    <Modal show={props.showverifyotppassword} onHide={props.handleshowverifyotppassword}  animation="false" backdrop="static"  >
        {/* <Modal.Header closeVariant="white" closeButton > */}
        <div className='bg-light text-right px-3 fw-bold' style={{"color":"#720520","fontSize":"2rem","cursor":"pointer"}} onClick={()=>props.handleshowverifyotppassword()}>
          <img src='/icons/cross.png' alt='Cross-Icon'/>
        </div>
        {/* <Modal.Title>{showverifyotp ? "Verify Otp":showvarifyPassword ? "Set Password":"Congratulations"}</Modal.Title> */}
      {/* </Modal.Header> */}
      
      <Modal.Body  className=" bg-light border-danger rounded">
      <ModalHeader />
      <div>
        {
            showverifyotp ? <VerifyOtp setshowverifyotp={setshowverifyotp} setresendotp={setresendotp} setresendotpid={setresendotpid}  setshowcongratulation={setshowcongratulation} setshowvarifyPassword={setshowvarifyPassword} selectclientdata={props?.selectclientdata } otpresdata={otpresdata} callapidata={props.callapidata}   setlagecycongratulationsuser={setlagecycongratulationsuser} /> :""
        }
         {
            showvarifyPassword ? <VerifyPassword  setresendotp={setresendotp} resendotp={resendotp} resendotpid={resendotpid} setshowcongratulation={setshowcongratulation} setshowvarifyPassword={setshowvarifyPassword} selectclientdata={props?.selectclientdata } otpresdata={otpresdata} callapidata={props.callapidata}   /> :""
        }
        {
            showcongratulation ? <Congratulations lagecycongratulationsuser={lagecycongratulationsuser}    handleshowverifyotppassword={props.handleshowverifyotppassword} callapidata={props.callapidata}  setlagecycongratulationsuser={setlagecycongratulationsuser}   /> :"" 
        }
          </div>

<div>
        {
          showButtons == true ? 
          <>
              <h1 className='text-center my-3'>User Activation</h1>
              <div className='d-grid gap-3 p-3'>
                <button className='theme-btn staff-or-client-activation rounded' onClick={() => clientdata(props.selectclientdata, "staff")}>Staff Activation</button>
                <hr/>
                <button className='rounded staff-or-client-activation  theme-btn'
                  // style={{border: "2px solid #720c20", color: "#720c20", background: "transparent"}} 
                  onClick={() => clientdata(props.selectclientdata, "client")}>Client Activation</button>
              </div>
          </>
            :
            <></>
        }
          </div>
          <div className='mt-3'>
            <div
            // className="container-fluid m-0 bg-light"
            //  style={{height: 'auto'}}
            >
              <div class="my-1 brand-aging-options-footer1 pt-2 ">
                <div class="brand-aging-options display-4 d-flex justify-content-center">
                  <p class="h5">Powered By</p>
                </div>
                <div class="d-flex justify-content-center">
                  <img src="../images/logo-footer.png" alt="brandAgingOptions" />
                </div>
              </div>

            </div>
          </div>
        
       {/* <ModalFooter /> */}
      </Modal.Body>
  
   
    </Modal>
    <OccurrenceParalegal
      emailTo={clientInfo?.primaryEmailAddress}
      textTo={clientInfo?.primaryPhoneNumber}
      occurrenceId={4} 
      showpreviewmodal={openEmailTextPreview}
      handleClosePreviewModal={handleClosePreviewModal}
      memberName={clientInfo?.memberName}
      memberLoggesInId={clientInfo?.loginUserId}
      uniqueLink={uniqueLink}
      userId={clientInfo?.memberId}
      />
    </>
  )
}

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader })
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyOtpPassword)
