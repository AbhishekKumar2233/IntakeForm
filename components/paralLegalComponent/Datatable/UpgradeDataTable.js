import { $CommonServiceFn, $postServiceFn, $getServiceFn } from "../../../components/network/Service";
import { globalContext } from "../../../pages/_app";
import { $Service_Url } from "../../../components/network/UrlPath";
import { connect } from "react-redux";
import { SET_LOADER } from "../../../components/Store/Actions/action";
import { useEffect, useState, useContext } from "react";
import konsole from "../../../components/control/Konsole";
import UpgradeModel from "../ParalegalList/UpgradeModel";
import { constantEmail, constantText } from "../../control/Constant";
import { $AHelper } from "../../control/AHelper";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import AlertToaster from "../../control/AlertToaster";
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/style.css";
import "react-phone-input-2/lib/bootstrap.css";
import { isNotValidNullUndefile } from "../../Reusable/ReusableCom";


const emailObjfun = () => {
  return { currentUserName: '', newUserName: "", updatedBy: '', remarks: '', clientIPAddress: '::1' }
}
const newMobileObj = () => {
  return { contactTypeId: 1, mobileNo: "", commTypeId: "", contactId: 1,withOutCode:'' }
}
const UpgradeDataTable = (props) => {
  const { setdata } = useContext(globalContext)

  let loggedUserId = sessionStorage.getItem('loggedUserId')
  const [showModalState, setshowModalState] = useState(false)
  const [memberUserID, setmemberUserID] = useState(null)
  const [showEditEmailMobile, setShowEditEmailMobile] = useState(false)
  const [emailObj, setEmailObj] = useState({ ...emailObjfun() })
  const [mobileObj, setMobileObj] = useState({ ...newMobileObj() })
  const [checkDummyInfo,setCheckDummyInfo]=useState('')
  const [mobileObjActivityId,setMobileObjActivityId]=useState('')
  const [mobileUserId,setMobileUserId]=useState('')
  const [upgradeToIntakeClient, setUpgradeToIntakeClient] = useState(null)
  const [disableCountryGuess, setdisableCountryGuess] = useState(false);

konsole.log('checkDummyInfo',checkDummyInfo)
  //open paymentmodal----------------------------------------------------

  useEffect(() => {

    const queryParams = new URLSearchParams(window.location.search);
    const TrxnStatus = queryParams.get('TrxnStatus');
    if (TrxnStatus) {
      setshowModalState(true)
    }
  }, [])
  //open paymentmodal----------------------------------------------------



  const showModalFunction = (client) => {
    konsole.log('clientclient', client)
    let { mobileNo, emailAddress, signUpPlatform, userId, loginUserId } = client
    let isDummy = compareDummyEmailText(mobileNo, emailAddress, true)
    if (isDummy !==true ) return

    let seminarId = client?.seminars[0]?.seminarId
    let seminarAttendeeId = client?.seminars[0]?.seminarAttendeeId
    let enquirymemberDetails = { mobileNo, emailAddress, signUpPlatform, userId, seminarId, seminarAttendeeId, loginUserId }
    konsole.log('enquirymemberDetails', enquirymemberDetails)
    sessionStorage.setItem('enquirymemberDetails', JSON.stringify(enquirymemberDetails))
    setmemberUserID(userId)
    setUpgradeToIntakeClient(client)
    setshowModalState(true)
    sessionStorage.setItem("isStateId",1);
  }

  // email and mobile update modal code --------------------------------------------------------------------------------------------------------------------------------------------------
  const compareDummyEmailText = (mobileNo, emailAddress, shomsg) => {
    if ($AHelper.withSliceValue(mobileNo, -10) == constantText && $AHelper.withSliceValue(emailAddress, -8) == constantEmail) {
      shomsg == true && toasterAlert('Please update dummy email and contact no. before upgrading ')
      return 'both'
    } else if ($AHelper.withSliceValue(mobileNo, -10) == constantText) {
      shomsg == true && toasterAlert('Please update dummy contact no. before upgrading ')
      return 'mobile'
    } else if ($AHelper.withSliceValue(emailAddress, -8) == constantEmail) {
      shomsg == true && toasterAlert('Please update dummy email before upgrading ')
      return 'email'
    } else {
      return true
    }
  }

  const editClientInfo = (value) => {
  let isDummy= compareDummyEmailText(value?.mobileNo,value.emailAddress,false)
  setCheckDummyInfo(isDummy)
    setShowEditEmailMobile(true)
    setEmailObj(prevSpouseInfo => ({
      ...prevSpouseInfo, currentUserName: value?.emailAddress, newUserName: value?.emailAddress, updatedBy: value?.userId
    }));

    fetchSavedContactDetails(value?.userId)

  }

  const handleChangeEmailText = (key, value) => {
    setEmailObj((prev) => { return { ...prev, [key]: value } });
  }
  const handleChangeMobile = (value, data) => {
    setMobileObj((prev) => {
      return { ...prev, mobileNo: value.slice(data.dialCode.length), mobileNo: `+${value}`, dialCode: data.dialCode,withOutCode:value.slice(data.dialCode.length) };
    });
  }
  const handleMobileChage=(value)=>{
    setMobileObj((prev) => {
      return { ...prev, mobileNo: '' }
    });
  }
  const validate=()=>{
    let errMsg=''
    if(checkDummyInfo=='both' ){
      if( emailObj.newUserName =='' || emailObj.newUserName ==null || emailObj.newUserName ==undefined){
        errMsg='Email cannot be blank'
      }
      if( mobileObj.mobileNo=='' || mobileObj.mobileNo==null || mobileObj.mobileNo==undefined){
        errMsg='Phone cannot be blank'
      }
    }

    if(checkDummyInfo=='email' &&  emailObj.newUserName =='' || emailObj.newUserName ==null || emailObj.newUserName ==undefined){
      errMsg='Email cannot be blank'
    }
    if( checkDummyInfo=='mobile' &&   mobileObj.mobileNo=='' || mobileObj.mobileNo==null || mobileObj.mobileNo==undefined){
      errMsg='Phone cannot be blank'
    }

    if (errMsg) {
      toasterAlert(errMsg, "Warning");
      return false;
    }
  return true;

  }
  const updateEmailtext = () => {
    if(validate()) {
  
    if(checkDummyInfo=='both' || checkDummyInfo=='email'){
      saveEmailInfo()
    }
    if(checkDummyInfo=='both' || checkDummyInfo=='mobile'){
      saveMobileInfo()
    }
  }
    
  }

  const saveEmailInfo=()=>{
    let jsonObj = emailObj
    konsole.log('jsonObjjsonObj', jsonObj)
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('PUT', $Service_Url.putUserNameEmail, jsonObj, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log("putUserNameEmail", res)
        // if(checkDummyInfo=='both' || checkDummyInfo=='mobile'){
        //   saveMobileInfo()
        // }else{
        if(checkDummyInfo != 'both') {
          AlertToaster.success('Update successfully')
          props.getEnqueryMember( true );
        }
        closeModal(jsonObj.newUserName)
        // }
        resetCloseModalData()
      } else {
        // konsole.log("putUserNameEmail", err)
        AlertToaster.error('Email must be valid and unique.')
        resetCloseModalData()
      }
    })
  }

  const saveMobileInfo=()=>{
    let {contactTypeId,mobileNo,contactId,updatedBy,commTypeId}=mobileObj

    let mobileObjjson = {
      contactTypeId: contactTypeId,
      mobileNo: mobileNo,
      commTypeId: commTypeId,
      contactId: contactId,
      updatedBy: updatedBy
    };
    

    let jsonObj={
      userId:mobileUserId,
      activityTypeId: (mobileObjActivityId !==null && mobileObjActivityId !==undefined && mobileObjActivityId !==0)?mobileObjActivityId: 1,
      contact:{
        mobiles:[mobileObjjson]
      }
    }

    konsole.log('updateContactDetailsPath',JSON.stringify(jsonObj))
    $CommonServiceFn.InvokeCommonApi('PUT',$Service_Url.updateContactDetailsPath+mobileUserId,jsonObj,(res,err)=>{
      props.getEnqueryMember( true );
      AlertToaster.success('Update successfully')
      if(res){  
        konsole.log('updateContactDetailsPath',res)
        closeModal(mobileNo)
        // resetCloseModalData()
      }else{
        konsole.log('updateContactDetailsPath',err)
        resetCloseModalData()
      }
    }) 
  }


  const closeModal=(searchby)=>{
    const newURL = window.location.origin + window.location.pathname + `?toogle=1&search=`+encodeURIComponent(searchby);
    window.history.pushState({ path: newURL }, '', newURL);
    resetCloseModalData()
    // window.location.reload()
  }
  const fetchSavedContactDetails = (userId) => {
    if(!isNotValidNullUndefile(userId))return;
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAllContactOtherPath + userId, "", (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log("getAllContactOtherPath", res.data.data)
        setMobileObjActivityId(res?.data?.data?.activityTypeId)
        setMobileUserId(res?.data?.data?.userId)
        let contactInfo = res.data.data?.contact?.mobiles.filter(item => item.contactTypeId == 1)
        setMobileObj({ ...mobileObj, ...contactInfo[0], updatedBy: loggedUserId })
      } else {
        konsole.log("getAllContactOtherPath", err)
      }
    }
    );
  };
  // email and mobile update modal code ----------------------------------------------------------------------------


  const clientElement = () => {

    return props.memberData.length > 0 ? (
      props.memberData.map((client, index) => {

        konsole.log("mao fadad", client);
        return (
          <tr>
            <td className="cursor-pointer" style={{ width: "35%", height: "70px" }} >
              <span
                style={{ fontSize: "16px" }}>{client.attendeeFullName}</span> <br />
              <button className=" paralegal-button-active mt-1 py-1" onClick={() => showModalFunction(client)}>Upgrade to Intake</button>
            </td>
            <td className="verticalMiddle">{client?.emailAddress}</td>
            <td className="verticalMiddle" style={{width:'20%'}}>
              
              {/* {client?.mobileNo} */}
              <p>
                {client?.mobileNo?.slice(0, 3) == +91
                  ? client?.mobileNo?.slice(0, 3)
                  : client?.mobileNo?.slice(0, 2)} {" "}
                {$AHelper.formatPhoneNumber(client.mobileNo?.slice(-10))}
              </p>
              </td>
            <td className="verticalMiddle">{client?.seminars.map((ele,index) => (ele?.seminarTopic+ `${client?.seminars.length - 1 > index ? ", " : ''}`  ))}</td>
            <td className="verticalMiddle">{(compareDummyEmailText(client?.mobileNo, client?.emailAddress, false)!==true) && <p style={{ textDecoration: "underline", cursor: "pointer", }}
              onClick={() => editClientInfo(client)}> Edit</p>}</td>

          </tr>
        );
      })
    ) : (
      <p>No Data Found</p>
    );
  };


  konsole.log('mobileObj?.mobileNomobileObj?.mobileNo',mobileObj?.mobileNo)

  //validate email or mobile
  function validateContact(typeofSave) {
    let regexName = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    switch (typeofSave) {
      case "email":
        if (!regexName.test(emailObj.newUserName)) {
          handleChangeEmailText('newUserName','')
          toasterAlert("Enter the valid EmailId");
          break;
        }
        break;
      case "mobile": {
        if (mobileObj.withOutCode !== "" && mobileObj?.withOutCode?.length < 10) {
          handleMobileChage()
          toasterAlert("Enter the valid Mobile No.");
        }
        break;
      }
    }
  }
  function toasterAlert(text) {
    setdata({ open: true, text: text, type: "Warning" });
  }

  function resetCloseModalData() {
    setShowEditEmailMobile(false);
    setEmailObj({ ...emailObjfun() })
    setMobileObj({ ...newMobileObj() })
    setdisableCountryGuess(false);
  }

  return (
    <>
      <div onScroll={(e) => props.onScrollBack(e)} id="" className="table-wrapper-scroll-y my-custom-scrollbar " style={{ paddingBottom: "100px" }}>
        {showModalState == true &&
          <UpgradeModel showModalState={showModalState} setshowModalState={setshowModalState} getEnqueryMember={props.getEnqueryMember} upgradeToIntakeClient = {upgradeToIntakeClient} CallAfterUpgrade = {props?.CallAfterUpgrade}/>
        }

        <table id="" className="table table-responsive border paralegalTable">
          <thead style={{ position: "sticky", top: "-1px", background: "white", zIndex: "1" }}>
            <tr className="bg-light">
              <th>Name</th>
              <th >Email</th>
              <th >Cell No</th>
              <th >Source</th>
              <th >Action</th>
            </tr>
          </thead>
          <tbody>{clientElement(props)}</tbody>
        </table>
      </div>


      {(showEditEmailMobile == true) ?
        <Modal show={showEditEmailMobile} onHide={() => resetCloseModalData()} animation={false} backdrop="static">
          <div className='bg-light text-right px-3 fw-bold' style={{ color: "#720520", fontSize: "2rem", cursor: "pointer" }} onClick={() => resetCloseModalData()}>
          <img src='/icons/cross.png' alt='Cross-Icon'/>
          </div>
          <Modal.Body className=" bg-light border-danger rounded">
            <ModalHeader />
            <>
            {(checkDummyInfo=='both' ||checkDummyInfo== 'email')?
            <>
            <div>
              <div>
                      <span className="fs-5 fs-sm-5 ps-5">Email</span>
              </div>
              <div>
                      <Row className="">

                        <Col className="">
                          <Form.Control
                            className="p-2 ms-5"
                            name="emailId"
                            type="email"
                            value={emailObj?.newUserName}
                            onChange={(e) => handleChangeEmailText('newUserName', e.target.value)}
                            onBlur={() => validateContact("email")}
                            placeholder="enter your email"
                            style={{ width: "84%" }}
                          />
                        </Col>
                      </Row>
              </div>
            </div>
                

                </>:null}
{(checkDummyInfo=='both' || checkDummyInfo== 'mobile')?
<Row className=" mt-2 ">
    <span className="fs-5 fs-sm-5 ms-5 ">Cell No</span>
  <Col className="d-flex ">
    <PhoneInput
      className="react-tel-input-2-inquiry px-5"
      regions={["america", "europe", "asia", "oceania", "africa"]}
      country="us"
      preferredCountries={["us"]}
      displayInitialValueAsLocalNumber={true}
      value={mobileObj.mobileNo}
      onChange={handleChangeMobile}
      onClick={() => setdisableCountryGuess(true)}
      specialOptionLabel={"Other"}
      placeholder=""
      name="mobileNo"
      disableCountryGuess={disableCountryGuess}
      onBlur={() => validateContact("mobile")} 
      countryCodeEditable={false}
                      style={{ width: "100%" }}
    />
  </Col>
</Row>:null}

            </>
            <div className="d-flex flex-row-reverse mt-3 mb-3 px-5">
              <Button style={{ backgroundColor: "#76272b", border: "none", }} className="theme-btn" onClick={() => updateEmailtext()}>Update</Button>
            </div>
            <div className='Activation-footer-class'>
              <div
              // className="container-fluid m-0 bg-light"
              //  style={{height: 'auto'}}
              >
                <div class="my-1 brand-aging-options-footer1 pt-2">
                  <div class="brand-aging-options display-4 d-flex justify-content-center">
                    <p class="h5">Powered By</p>
                  </div>
                  <div class="d-flex justify-content-center">
                    <img src="../images/logo-footer.png" alt="brandAgingOptions" />
                  </div>
                </div>

              </div>
              {/* <ModalFooter /> */}
            </div>
            {/* <ModalFooter /> */}
          </Modal.Body>
        </Modal>
        : null
      }
    </>
  );
};



const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader, }),
});

export default connect("", mapDispatchToProps)(UpgradeDataTable);
