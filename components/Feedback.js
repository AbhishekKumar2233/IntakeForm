import React, { useEffect, useState, createRef, useContext } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { SET_LOADER } from "../components/Store/Actions/action";
import { $CommonServiceFn, $postServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import konsole from "./control/Konsole";
import { globalContext } from "../pages/_app";
import { $AHelper } from "../components/control/AHelper";
import AlertToaster from "./control/AlertToaster";
import { createPortal } from 'react-dom';
import HelpCenter from "./HelpCenter/HelpCenter";
import { getApiCall2 } from "./Reusable/ReusableCom";
import { demo } from "./control/Constant";

const Feedback = (props) => {
  const { setdata } = useContext(globalContext);
  const userId = sessionStorage.getItem("SessPrimaryUserId") || "";
  const loggedInUser = sessionStorage.getItem("loggedUserId") || "";
  const roleUserId = sessionStorage.getItem('roleUserId')
  const roleObj = JSON.parse(sessionStorage.getItem('stateObj'))?.roleId
  const roleIdCheckIntakeLpoDirect = (roleObj != 1 && roleObj != 9 && roleObj != 10) ? true : false
  const [show, setshow] = useState(false);
  const [feedbackQuery, setfeedbackQuery] = useState("");
  const [imageURL, setimageURL] = useState("");
  const currentTime = new Date().toLocaleString()
  const [selectPriority, setselectPriority] = useState('')
  const [priority, setpriorities] = useState([])
  const [disabled, setDisabled] = useState("")

  const [isHandOffCheck, setIsHandOffCheck] = useState('null')
  let clientName = JSON.parse(sessionStorage.getItem('userLoggedInDetail'))
  let userDetailOfPrimary = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'))
  let userLoggedInDetail = JSON.parse(sessionStorage.getItem('userLoggedInDetail'));



  useEffect(() => {
    // if (roleUserId == 9 || roleUserId == 10 || roleUserId == 1) {
    //   setselectPriority(2);
    // } else {
    //   setselectPriority(null)
    // }
    if (!roleIdCheckIntakeLpoDirect) {
      setselectPriority(null)
    } else {
      setselectPriority(2);
    }
    // getFeedbackPriorityfunc()
  }, [])

  useEffect(() => {
    if (roleObj == 9 && isHandOffCheck == 'null') {
      // fetchApi()
    }
  }, [roleObj])

  useEffect(() => {
    if(show == true && !priority?.length) getFeedbackPriorityfunc()
  }, [show]);

  const fetchApi = async () => {
    const _resultMemberDetails = await getApiCall2("GET", $Service_Url.getUserDetailsByUserEmailId + `?UserId=${loggedInUser}`);
    console.log("_resultMemberDetails", _resultMemberDetails)
    if (_resultMemberDetails == 'err') return;
    if (_resultMemberDetails?.data.length > 0) {
      const checkIsHandOff = _resultMemberDetails?.data[0].isHandOff;
      setIsHandOffCheck(checkIsHandOff)
    }
  }

  const handleClose = () => {
    setshow(!show);
    setDisabled("")
  };

  const handleShow = () => {
    setshow(!show);
    setDisabled("disabled")
  };

  const handleChange = (e) => {
    let value = e.target.value;
    setfeedbackQuery(value);
  };

  const getFeedbackPriorityfunc = () => {
    $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.GetFeedbackPriority, '', (response, error) => {
      if (response) {
        setpriorities(response.data.data)
        konsole.log(response, "response")
      } else {
        konsole.log(error, "error")
      }
    })
  }

  const handleImageSubmit = async () => {
    const fileTypeId = 3; //for feedback
    const fileCategoryId = 7; //for feedback
    const fileStatusId = 2; //for feedback
    const imageSrc = props.image;
    const blob = await fetch(imageSrc).then((res) => res.blob());
    const file = new File([blob], 'FEEDBACK.jpg', { type: "image/png" });

    if (feedbackQuery == "") {
      // toasterAlert("Feedback query cannot be blank.", "Warning");
      AlertToaster.error("Feedback query cannot be blank.")
      return;
    }
    props.dispatchloader(true);
    // $postServiceFn.postFileUpload(file, userId, loggedInUser, fileTypeId, fileCategoryId, fileStatusId, (response, errorData) => {
    $postServiceFn.postFileUpload(file, loggedInUser, loggedInUser, fileTypeId, fileCategoryId, fileStatusId, (response, errorData) => {
      konsole.log("Feedbackresposne", file, response);
      props.dispatchloader(false);
      if (response) {
        const imageUrl = response.data.data.fileURL;
        const fileId = response.data.data.fileId;
        handleFeedbackSubmit(imageUrl, fileId, blob), props.image;
      } else if (errorData) {
      }
    }
    );
  };

  const handleFeedbackSubmit = (imageUrl, fileId, blob, img) => {
    // let inputdata = JSON.parse(JSON.stringify(this.state));
    let totalinuptdata = {
      // userId: userId,
      userId: loggedInUser,
      feedbackQuery: feedbackQuery,
      feedbackType: "string",
      applicationURL: window.location.href,
      imageURL: imageUrl,
      fileId: fileId,
      createdBy: loggedInUser,
      moduleTypeId: roleUserId == 9 ? '4' : '1',
      moduleTypeName: roleUserId == 9 ? 'Lpo Lite' : 'Intake Form',
      feedbackPriorityId: selectPriority
    };

    konsole.log("PostData at realProperty", totalinuptdata);
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postFeedback, totalinuptdata, (response) => {
      props.dispatchloader(false);
      konsole.log("Success res at RealProperty" + JSON.stringify(response));
      if (response) {
        let subtenantId = sessionStorage.getItem('SubtenantId')
        // if (subtenantId == 2 || subtenantId == 742) {
          sendFeedBackEmail(blob, subtenantId, response)
        // } else {
          // toasterAlert("Feedback submitted Successfully", "Success");
          // AlertToaster.success("Feedback submitted Successfully", "Success");
          // handleClose();
        // }
      } else {
        // toasterAlert(Msg.ErrorMsg, "Warning");
        AlertToaster.error(Msg.ErrorMsg)
      }
    }
    );
  };

  function toasterAlert(text, type) {
    setdata({ open: true, text: text, type: type, });
    konsole.log(text, type, "test,type");
  }

  const sendFeedBackEmail = (blob, subtenantId, res) => {
    const file = new File([blob], 'FEEDBACK.jpg', { type: "image/png" });


    let userType = roleObj == 1 ? "Intake Member" : roleObj == 3 ? "Paralegal" : roleObj == 9 ? "LPO" : roleObj == 10 ? "Direct Intake Member" : roleObj == 13 ? "Attorney" : roleObj == 14 ? "Legal Assistant" : roleObj == 15 ? "Law Office Staff" : 'Client Name'
    let emailto = (demo == false && subtenantId == 742) ? 'TechSupport@agingoptions.com' : 'shreyasinha@agingoptions.com';

    let emailContent = `
    <p style="font-size: 16px; color: #333; background-color: #f5f5f5; padding: 10px; margin: 0; box-sizing: border-box;">
      <span style="display: block; padding-bottom: 10px;"><b>Ticket Number:</b> @@ticketno<br></span>
      <span style="display: block; padding-bottom: 10px;"><b>Name:</b> @@CLIENT_NAME<br></span>
      <span style="display: block; padding-bottom: 10px;"><b>Email:</b> @@CLIENT_EMAIL<br></span>
      <span style="display: block; padding-bottom: 10px;"><b>Sender Email:</b> @@SENDER_EMAIL<br></span>
      <span style="display: block; padding-bottom: 10px;"><b>Application URL:</b> @@APPLICATION_URL<br></span>
      <span style="display: block; padding-bottom: 10px;"><b>Query:</b> @@FEEDBACK_QUERY<br></span>
      ${roleIdCheckIntakeLpoDirect ? `<span style="display: block; padding-bottom: 10px;"><b>Priority:</b> @@priority<br></span>` : ''}
      <span style="display: block; padding-bottom: 10px;"><b>Time:</b> @@time</span><br>
    </p>
    <p>(<b>Note:</b> Sent from @@USERTYPE)</p>
  `;


    emailContent = emailContent.replace('@@CLIENT_NAME', userDetailOfPrimary?.memberName == undefined ? userLoggedInDetail?.memberName : userDetailOfPrimary?.memberName);
    emailContent = emailContent.replace('@@CLIENT_EMAIL', userDetailOfPrimary?.primaryEmailId == undefined ? userLoggedInDetail?.primaryEmailId : userDetailOfPrimary?.primaryEmailId);
    emailContent = emailContent.replace('@@SENDER_EMAIL', userLoggedInDetail?.primaryEmailId);
    emailContent = emailContent.replace('@@FEEDBACK_QUERY', feedbackQuery);
    emailContent = emailContent.replace('@@APPLICATION_URL', window.location.href);
    if (roleIdCheckIntakeLpoDirect == true) {
      emailContent = emailContent.replace('@@priority', priority?.find(e => e.value == selectPriority)?.label)
    }
    emailContent = emailContent.replace('@@time', currentTime)
    emailContent = emailContent.replace('@@USERTYPE', userType)
    emailContent = emailContent.replace('@@ticketno', res?.data?.data?.feedbackId)

    let formdata = new FormData();
    formdata.append('File', file)
    formdata.append('EmailType', 'Client_Feedback_Details')
    formdata.append('EmailTo', emailto)
    formdata.append('EmailSubject', 'Feedback Details')
    formdata.append('EmailContent', emailContent)
    formdata.append('EmailMappingTable', 'tblMember')
    formdata.append('EmailStatusId', '1')
    // formdata.append('Emailcc',clientName?.userName)
    formdata.append('EmailMappingTablePKId', loggedInUser)
    formdata.append('CreatedBy', loggedInUser)
    props.dispatchloader(true);
    $CommonServiceFn.InvokeFileApi("POST", $Service_Url.sendMailFeedBack, formdata, async (response, errorData) => {
      props.dispatchloader(false);
      if (response) {
        konsole.log("responseresponse", response)
        await functionForAcknowledgementMail(res)
        AlertToaster.success("Feedback submitted successfully");
        handleClose();
        setfeedbackQuery('')
      }
      else if (errorData) {
        konsole.log("responseresponse", errorData)
      }
    })
  }

  const functionForAcknowledgementMail = (response) => {

    let emailContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Feedback Acknowledgement | New Ticket @@ticketno</title>
      </head>
      <body>
        <p>Hi @@CLIENT_NAME,</p>
        <p>We would like to acknowledge that we have received your request and a ticket @@ticketno has been created.</p>
        <p><b>Ticket Details</b></p>
        <p>Ticket No.: @@ticketno</p>
        <p>Ticket Title: @@FEEDBACK_QUERY</p>
        <p>Rest assured, our tech support team has initiated an investigation based on your feedback.</p>
        <p>Warm regards,</p>
        <p>Tech Support Team<br>Aging Options</p>
      </body>
    </html>
`;

    emailContent = emailContent.replace('@@CLIENT_NAME', clientName?.memberName);
    emailContent = emailContent.replace('@@FEEDBACK_QUERY', feedbackQuery);
    emailContent = emailContent.replace(/@@ticketno/g, response?.data?.data?.feedbackId);

    const jsonObj = {
      emailType: "Client_Feedback_Details",
      emailTo: clientName?.userName,
      emailSubject: `Feedback Acknowledgement | New Ticket ${response?.data?.data?.feedbackId}`,
      emailContent: emailContent,
      // emailFrom: "string",
      // emailFromDisplayName: "string",
      // emailTemplateId: 0,
      emailStatusId: 1,
      emailMappingTable: "tblMember",
      emailMappingTablePKId: loggedInUser,
      createdBy: loggedInUser,
      // emailcc: ""
    }
    return new Promise((resolve, reject) => {
      $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.sendPostEmailCC, jsonObj, (response, errorData) => {
        if (response) {
          konsole.log("responseresponseForUser", response)
          resolve('resolve')
        }
        else if (errorData) {
          resolve('err')
          konsole.log("responseresponseForUser", errorData)
        }
      })
    })
  }


  console.log('isHandOffCheckisHandOffCheck',isHandOffCheck)

  return (
    <>

      <>
        <style jsx global>{`
        .modal-open .modal-backdrop.show {
          opacity: 0.5 !important;
        }
      `}</style>

        <a onClick={handleShow} className="d-grid gap-3" style={{ zIndex: "999999999999999999999999999999999999" }}>
          <button
            className={`btn ${props.classNameLocal} feedbackButton-cls ${disabled}`}
            onClick={props.getImage}

          // style={{backgroundColor: "#751521",color: "white",border: "none",fontSize: "1.2em",borderRadius: "5px",zIndex: "999999"}}
          > Feedback</button>
        </a>
        {/* *******************HELP CENTER COMPONENT ************************ */}
        {/* {(roleObj == 9 && isHandOffCheck==true) &&
          createPortal(<HelpCenter />, document.querySelector("#Feedback"))
        } */}
        {/* *******************HELP CENTER COMPONENT ************************ */}
        <Modal
          show={show}
          size="lg"
          centered
          onHide={handleClose}
          animation="false"
          id="futureExpectationId"
          backdrop="static"
          style={{ zIndex: "" }}
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Feedback</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-5 pt-4">
            <Row>
              <Col className="d-flex"><h6>Name:</h6> <h6 className="ps-1"> {clientName?.memberName}</h6></Col>
              <Col className="d-flex"><h6>Time: </h6> <h6 className="ps-1"> {currentTime}</h6></Col>

              {(roleIdCheckIntakeLpoDirect == true) &&
                <Col className="d-flex justify-content-center align-items-center">
                  {konsole.log(selectPriority, "selectPriority")}
                  <h6>Priority: </h6> <select className="ms-2" value={selectPriority} onChange={((e) => { setselectPriority(e.target.value) })}>
                    {priority?.map((e) => (
                      <option value={e.value}>{e?.label}</option>
                    ))}
                  </select>
                </Col>}
            </Row>
            <Row>
              <Col className="">
                <h3>Describe</h3>
              </Col>
            </Row>
            <Form.Control className="mt-1 mb-1" as="textarea" rows={3} onChange={(e) => handleChange(e)} style={{ borderRadius: "2px" }} />
            <div>
              <img width="100%" src={props.image} alt={"Screenshot"} style={{ borderRadius: "2px" }} />
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 pb-5 pt-5">
            <Button className="theme-btn" onClick={handleImageSubmit}>
              Submit
            </Button>
            <Button className="theme-btn" onClick={handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
};

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
