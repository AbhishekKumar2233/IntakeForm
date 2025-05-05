import React, { useEffect, useState, useContext } from 'react';
import konsole from '../../control/Konsole';
import { $CommonServiceFn } from '../../network/Service';
import { $Service_Url } from '../../network/UrlPath';
import { globalContext } from '../../../pages/_app';
import { connect } from 'react-redux';
import { SET_LOADER } from '../../Store/Actions/action';
import { Modal } from 'react-bootstrap'
import moment from 'moment';
import AlertToaster from '../../control/AlertToaster';
const AfterPaymentScreen = (props) => {
  konsole.log('withoutpayment', props)

  const loggedUserId = sessionStorage.getItem('loggedUserId');
  const subtenantId = sessionStorage.getItem('SubtenantId');
  const stateObj = JSON.parse(sessionStorage.getItem('stateObj'));
  let enquirymemberDetail = JSON.parse(sessionStorage.getItem('enquirymemberDetails'))
  //define state------------------------------------
  const [comChannelId, setcomChanelId] = useState(0)
  const [commmediumdata, setcommmediumdata] = useState('');
  const [temptaleshow, settemptaleshow] = useState(false)

  const [texttemp, settexttemp] = useState();
  const [texttempdata, settexttempdata] = useState();
  const [emailtemp, setemailtemp] = useState();
  const [emailtempdata, setemailtempdata] = useState();
  const [showpreviewmodal, setshowpreviewmodal] = useState(true)
  const [uniqueLink, setUniqueLink] = useState('')
  //define useEffect-------------------------------------------------------------------------
  useEffect(() => {

    const subtenantId = sessionStorage.getItem('SubtenantId');
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const orderId = urlParams.get('OrderId');
    const trxnStatus = urlParams.get('TrxnStatus');
    konsole.log("orderIdorderId", orderId, userId);
    if (props.withoutpayment) {
      postAddUserOrder()
    } else if (trxnStatus === 'SUCCESS') {
      AlertToaster.success("Payment Successfully");
      upsertPlannerBook(orderId);
    }
    getCommMediumPathfuc(subtenantId);// function call for text and api template
  }, []);


  // useEffect Function---------------------------------------------------------------------------


  //function call without poayment-----------------------------------------------------------------
  const postAddUserOrder = () => {
    let { userId, seminarId } = enquirymemberDetail
    let jsonObj = {
      "userId": userId,
      "shippingCost": 0,
      "taxCost": 0,
      "totalCost": props?.amtValue,//total cost 
      "isActive" : false,
      "createdBy": loggedUserId,
      "productList": [
        {
          "productType": "Paralegal Enquiry", // typr of prodect like seminar classroom and Planner
          "productId": seminarId,
          "productName": "Upgrade to intake member",
          "quantity": 1,
        "productPrice": props?.amtValue,
          "isActive" : false,
        }
      ]
    }
    konsole.log('jsonObj', jsonObj)
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postAddUserOrder, jsonObj, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('postAddUserOrder', res)
        let responseData = res.data.data
        confirmUserOrder(responseData)

      } else {
        konsole.log('postAddUserOrder', err)
      }
    })
  }

  const confirmUserOrder = ({ userId, order: { memberId, orderId } }) => {
    let jsonObj = {
      "userId": userId,
      "memberId": memberId,
      "orderId": orderId,
      "transactionId": "NA",
      "paymentType": props.paymentType,
      'updatedBy':loggedUserId

    }
    konsole.log('jsonObjjsonObj', jsonObj)
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postConfirmUserOrder, jsonObj, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('postConfirmUserOrder', res)
        let responseData = res?.data?.data
        let orderId = responseData?.order?.orderId
        upsertPlannerBook(orderId);
      } else {
        konsole.log('postConfirmUserOrder', err)

      }
    })
  }

  //function call with payment------------------------------------------------------------------------

  const upsertPlannerBook = (orderId) => {
    konsole.log('Planner Upsert');
    const upsertJson = [{
      plannerAppId: 0,
      seminarAttendeeId: enquirymemberDetail?.seminarAttendeeId, // # Member  seminar id
      billTrackNo: orderId, // orderid 
      paymentStatusId: 1, // payment status id
      paymentStatusDate: new Date(),
      isActive: true,
      upsertedBy: loggedUserId //# Member Login User ID
    }];

    konsole.log('upsertJson', upsertJson);
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.upsertPlannerBooking, upsertJson, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('upsertPlannerBooking', res)
        let responseData = res?.data?.data
        updatePlannerBookingStatus(responseData)
      } else {
        konsole.log("upsertPlannerBooking", err)
      }
    });
  };

  const updatePlannerBookingStatus = (responseData) => {
    if (responseData.legth == 0) return;
    let { plannerAppId, seminarAttendeeId } = responseData[0]
    const bookingStatusDate = moment(new Date().toISOString())._i
    let updateStatusJson = {
      "plannerAppId": plannerAppId,
      "seminarAttendeeId": seminarAttendeeId,
      "plannerCalId": null,
      "bookingStatusId": 7, // 6 or 1
      "bookingStatusDate": bookingStatusDate,
      "updatedBy": loggedUserId //# Member Login User ID
    }
    konsole.log("updateStatusJson", updateStatusJson)

    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.updatePlannerBookingStatus, updateStatusJson, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('updatePlannerBookingStatus', res)
        let responseData = res.data.data
        let seminarAttendiUserId = responseData?.seminarAttendeeUserId
        userAddRoles(seminarAttendiUserId)
      } else {
        konsole.log("updatePlannerBookingStatus", err)
      }
    })
  }

  const userAddRoles = (seminarAttendiUserId) => {

    let rolesAddJson = {
      "loginUserId": enquirymemberDetail?.loginUserId, // # Member LogIn ID from stateobj
      "subtenantId": subtenantId, // login member subtenent id
      "roleId": 1, // role id for adding role
      "isActive": true,
      "createdBy": loggedUserId // # Member Login User ID
    }

    konsole.log('rolesAddJsonrolesAddJson', rolesAddJson)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postUserRole + seminarAttendiUserId, rolesAddJson, (res, err) => {
      if (res) {
        konsole.log('postUserRole', res)
        userActivationLink(seminarAttendiUserId)
      } else {
        userActivationLink(seminarAttendiUserId)
        konsole.log('postUserRole', err)
      }
    })
  }

  const userActivationLink = (seminarAttendiUserId) => {
    let activationJson = {
      "userRegstrtnId": enquirymemberDetail?.loginUserId,// # Member LogIn ID from stateobj
      "userId": seminarAttendiUserId, // #Client User id
      "signUpPlatform": enquirymemberDetail?.signUpPlatform,
      "createdBy": loggedUserId, // # Member Login User ID
      "clientIPAddress": ""
    }
    konsole.log('activationJson', activationJson)
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.getUserActivationLink, activationJson, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('getUserActivationLink', res)
        let responseData = res?.data?.data
        setUniqueLink(responseData?.activationURL)
        konsole.log('responseData', responseData)
      } else {
        konsole.log('getUserActivationLink', err)
      }
    })
  }



  //occurace APi call -----------------------------------------------------------------------------------------------------

  const getCommMediumPathfuc = (subtenantId) => {
    let dataObj = { occurrenceId: 29, isActive: true, subtenantId: subtenantId, }
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getCommMediumPath, dataObj, async (res, error) => {
      props.dispatchloader(false);
      if (res) {
        let data = res.data?.data[0];
        konsole.log("getCommMediumPath", res.data.data);
        settemptaleshow(true)
        setcommmediumdata(data);
        setcomChanelId(data.commChannelId)
        if (data.commChannelId == 2) {
          getTextTemplateapifuc(data.applicableTextTempId, data.isActive, data.subtenantId);
        } else if (data.commChannelId == 1) {
          GetEmailTemplateapifuc(data.applicableEmailTempId, data.isActive, data.subtenantId);
        } else if (data.commChannelId == 3) {
          GetEmailTemplateapifuc(data.applicableEmailTempId, data.isActive, data.subtenantId);
          getTextTemplateapifuc(data.applicableTextTempId, data.isActive, data.subtenantId);
        }
      }
      else {
        settemptaleshow(false)
        if (error?.data === 'Not Found') {
          settemptaleshow(false)
        }
        props.dispatchloader(false);
      }
    });
  }

  const GetEmailTemplateapifuc = (tempid, isactive, subid) => {
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.GetEmailTemplate + "?" + "TemplateId" + "=" + tempid + "&" + "IsActive" + "=" + isactive + "&SubtenantId" + "=" + subid, '', async (res, err) => {
      props.dispatchloader(false);
      if (res) {
        konsole.log("GetEmailTemplateapi", res.data.data);
        setemailtempdata(res.data.data[0]);
        setemailtemp(res.data.data[0].templateContent);
      }
      else {
        konsole.log("GetEmailTemplateapi", err)
        props.dispatchloader(false);
      }
    });
  };


  const getTextTemplateapifuc = (tempid, isactive, subid) => {
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getTextTemplate + "?" + "TextTemplateId" + "=" + tempid + "&" + "IsActive" + "=" + isactive + "&SubtenantId" + "=" + subid, '', async (res, err) => {
      props.dispatchloader(false);
      if (res) {
        konsole.log("GettextTemplateapiresponse", res);
        settexttempdata(res.data.data[0]);
        settexttemp(res.data.data[0].textTemplateContent);
      }
      else {
        props.dispatchloader(false);
      }
    });
  };
  
  useEffect(()=> {
    if(uniqueLink !== undefined && uniqueLink !== null && uniqueLink !== ""){
      if((comChannelId == 3) && (texttemp !== undefined && texttemp !== null && texttemp !== "") && (emailtemp !== undefined && emailtemp !== null && emailtemp !== "")){
        SendEmailCommPathFunc();
      }
      else if(comChannelId = 2 && (texttemp !== undefined && texttemp !== null && texttemp !== "")){
        postSendTextPathapifunc();
      }else if(comChannelId == 1 && (emailtemp !== undefined && emailtemp !== null && emailtemp !== "")){
        SendEmailCommPathFunc();
      }
    }
  },[comChannelId, texttemp, emailtemp, uniqueLink]);


  const sendTextEmail = () => {
    comChannelId == 3 || comChannelId == 1 ? SendEmailCommPathFunc() : comChannelId == 2 ? postSendTextPathapifunc() : null;
  }


  const SendEmailCommPathFunc = () => {
    let templateinfo = templatereplace(emailtemp)
    let loggedUserId = sessionStorage.getItem('loggedUserId')
    let emailTo = enquirymemberDetail?.emailAddress
    let dataObj = {
      "emailType": emailtempdata.templateType,
      "emailTo": emailTo,
      "emailSubject": emailtempdata.emailSubject,
      "emailContent": templateinfo,
      "emailTemplateId": emailtempdata.templateId,
      "emailStatusId": 1,
      "emailMappingTable": "tblUserLinks",
      "emailMappingTablePKId": 'string',
      "createdBy": loggedUserId

    }
    konsole.log('dataObjdataObj', dataObj)
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.PostEmailCom, dataObj, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('PostEmailCom', comChannelId, res)
       
        if(comChannelId == 3){
          postSendTextPathapifunc() 
        }else{
          // AlertToaster.success("Sent Successfully");
          AlertToaster.success("Client upgraded successfully from Prospect Member to Intake Member");
        }
      } else {
        konsole.log('PostEmailCom', err)
        AlertToaster.success("Client upgraded successfully from Prospect Member to Intake Member");
        cancelModalClose()
      }
    })
  }

  const postSendTextPathapifunc = () => {
    let loggedUserId = sessionStorage.getItem('loggedUserId')
    let textTo = enquirymemberDetail?.mobileNo
    let tempolateInfo = templatereplace(texttemp)
    let dataObj = {
      smsType: texttempdata.textTemplateType,
      textTo: textTo,
      textContent: tempolateInfo,
      smsTemplateId: texttempdata.textTemplateId,
      smsStatusId: 1,
      smsMappingTable: "tblUser",
      smsMappingTablePKId: enquirymemberDetail.userId,
      createdBy: loggedUserId,
    };

    konsole.log('postSendTextPath', JSON.stringify(dataObj))
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postSendTextPath, dataObj, async (response, error) => {
      props.dispatchloader(false);
      props?.getEnqueryMember( true );
      if (response) {
        konsole.log("postSendTextPath", response);
        // AlertToaster.success("Sent Successfully");
        AlertToaster.success("Client upgraded successfully from Prospect Member to Intake Member");
        cancelModalClose()
      }
      else {
        // AlertToaster.success("Sent Successfully");
        AlertToaster.success("Client upgraded successfully from Prospect Member to Intake Member");
        konsole.log('postSendTextPath', error)
        props.dispatchloader(false);
        cancelModalClose()
      }
    });
  }


  const templatereplace = (temp) => {
    let TemplateContent = temp
    let subtenantName = sessionStorage.getItem('subtenantName')
    TemplateContent = TemplateContent.replaceAll("@@SUBTENANTNAME", subtenantName)
    TemplateContent = TemplateContent.replaceAll("@@UNIQUELINK", uniqueLink)
    konsole.log('TemplateContentTemplateContent', TemplateContent)
    return TemplateContent;
  }

  konsole.log("uniqueLink", uniqueLink)

  const cancelModalClose = () => {
    const url = window.location.origin + window.location.pathname;
    window.history.pushState({ path: url }, '', url);
    if(props?.upgradeToIntakeClient){
      props.handleClose()
      props?.CallAfterUpgrade(props?.upgradeToIntakeClient?.emailAddress, 1)
    }
    // window.location.reload()
  }


  //occurace APi call -----------------------------------------------------------------------------------------------------



  return (<>
    {/* <div>AfterPaymentScreen</div> */}

    {/* Occurance Modal------------------------------------------------------------------------------------ */}
    <Modal  size="lg" onHide={() => cancelModalClose()} backdrop="static" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px" }}>
      <Modal.Header className="text-white" closeVariant="white" closeButton>
        Preview Send {(comChannelId == 1) ? 'Email' : (comChannelId == 2) ? 'Text' : 'Email & Text'}
      </Modal.Header>
      <Modal.Body className="rounded">

        <div style={{ minHeight: "60vh", maxHeight: "60vh", height: "100vh", overflowX: "none", overflowY: "scroll" }} className="border">
          <div className="position-relative" style={{ pointerEvents: "none" }} >
            {
              (emailtemp !== null && emailtemp !== "" && emailtemp !== undefined) ?
                <>
                  <h6 className="ps-4 ms-5 mt-3">Email Template</h6>
                  <div dangerouslySetInnerHTML={{ __html: templatereplace(emailtemp) }} id="emailtemplate" contentEditable="false" className="p-0 m-0" />
                </>
                : <></>
            }
            <div className="px-5 mb-2">
              {
                (texttemp !== null && texttemp !== "" && texttemp !== undefined) ?
                  <>
                    <h6 className="mt-3">Text Template</h6>
                    <div contentEditable="false" id="templateData1" className="border p-2" style={{ padding: "10px 0 30px 0" }}>
                      {templatereplace(texttemp)}
                    </div>
                  </>
                  : <></>
              }
            </div>
          </div>
        </div>
        <div className="d-grid place-items-center p-4 gap-2">
          <button style={{ background: "#720c20", color: "white", outline: "none", borderRadius: "5px", border: "2px solid #720C20" }} className="p-1" onClick={() => sendTextEmail()}>
            Send  {(comChannelId == 1) ? 'Email' : (comChannelId == 2) ? 'Text' : 'Email & Text'}
          </button>
          <button style={{ color: "#720c20", background: "white", border: "2px solid #720C20", borderRadius: "5px" }} className="p-1" onClick={() => cancelModalClose()}> Cancel</button>
        </div>
      </Modal.Body>
    </Modal>
    {/* Occurance Modal------------------------------------------------------------------------------------ */}
  </>
  );
};

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader })
});

export default connect(mapStateToProps, mapDispatchToProps)(AfterPaymentScreen)
