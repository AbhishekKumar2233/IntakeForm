import React, { useState, useEffect ,useContext} from 'react'
import Form from 'react-bootstrap/Form';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import ModalBody from 'react-bootstrap/ModalBody'
import konsole from '../../control/Konsole';
import { globalContext } from '../../../pages/_app';
import { $CommonServiceFn, $postServiceFn } from "../../../components/network/Service";
import { $Service_Url } from "../../../components/network/UrlPath";
import { SET_LOADER } from "../../../components/Store/Actions/action";
import { connect } from "react-redux";
import { DEFAULT_SUBTENANTID_FOR_OCCURRENCE } from "../../control/AHelper";

const OccuranceCom = (props) => {
  const subtenantId = props?.subtenantId
  const subscriptionId = props?.subscriptionId
  const {setdata}=useContext(globalContext)


  //----------------------------------------------------------
  const [loggeduserId, setloggeduserId] = useState('')
  const [subtenantName, setSubtenamtName] = useState('')
  const [chhanelid, setChhanleId] = useState('')
  const [sendText, setsendText] = useState(false)
  const [sendEmail, setsendEmail] = useState(false)

  const [generatedata, setGeneratedata] = useState([])


  const [openmodal, setopemmodal] = useState(false)

  //-------------------------------------------------

  const [texttemplatedata, settextTemplateData] = useState('')
  const [emailtemplatedata, setemailtemplatedata] = useState('')
  const [allData, setAlldata] = useState()
  const [emailresponsetemplatedata, setEmailResponsetemplateData] = useState('')
  const [textresponsetemplatedata, settextResponsetemplateData] = useState('')

  //------------------------------------------------------


  console.log("texttemplatedatatexttemplatedata", texttemplatedata, emailtemplatedata)





  useEffect(() => {

    if (chhanelid == 3 && texttemplatedata !== '' && texttemplatedata !== undefined && texttemplatedata !== null && emailtemplatedata !== '' && emailtemplatedata !== undefined && emailtemplatedata !== null || chhanelid == 2 && emailtemplatedata !== '' && emailtemplatedata !== undefined && emailtemplatedata !== null || chhanelid == 1 && texttemplatedata !== '' && texttemplatedata !== undefined && texttemplatedata !== null) {
      setopemmodal(true)
    }

    if (openmodal == true) {
      if (chhanelid == 3) {

        document.getElementById('templateData').innerHTML = texttemplatedata
        document.getElementById('templateData1').innerHTML = emailtemplatedata
      } else if (chhanelid == 2) {
        document.getElementById('templateData1').innerHTML = emailtemplatedata
      } else {
        document.getElementById('templateData').innerHTML = texttemplatedata
      }
    }
  }, [texttemplatedata, chhanelid, openmodal, emailtemplatedata])


  useEffect(() => {
    console.log("ababababab", chhanelid, sendText, sendEmail)
    if (chhanelid == 3 && sendText == true && sendEmail == true ) {
      updateUserLinks()
    } else if (chhanelid == 2 && sendEmail == true) {
      updateUserLinks()
    } else if (chhanelid == 1 && sendText == true && props.occuranceId==19) {
      updateUserLinks()
    }
  }, [chhanelid, sendText, sendEmail])
  console.log("ababababab", chhanelid, sendText, sendEmail)


  //----------------------------------------------------------------
  useEffect(() => {
    let loggedUserId = sessionStorage.getItem('loggedUserId')
    setloggeduserId(loggedUserId)
    getSubtenantDetails()
  }, [])

  //---------------------------------------------------------------
  console.log("subtenantNamesubtenantName", subtenantName)
  const getSubtenantDetails = () => {
    props.dispatchloader(true)
    let subtenantid = sessionStorage.getItem("SubtenantId")
    let jsonobj = {
      "subtenantId": subtenantid,
      "isActive": true,
    }
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubdetails, jsonobj, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        setSubtenamtName(res.data?.data[0]?.subtenantName)
        console.log("ressub", res)
      } else {
        console.log("errsub", err)
      }
    })
  }


  const sendMailToClient = () => {
    props.dispatchloader(true)
    let jsonobj = {
      "subtenantId": subtenantId,
      "linkTypeId": 1,
      "linkStatusId": 1,
      "createdBy": loggeduserId
    }


    konsole.log("jsonobj11", JSON.stringify(jsonobj), $Service_Url.postuserlinkgenerate)
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postuserlinkgenerate, jsonobj, (res, error) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log("res11", res)
        let data = res.data?.data
        let allData1 = {
          "Data1": data,
          "clientdata": props.clientData,
          "subtenantName": subtenantName
        }
        setAlldata(allData1)
        let loggedUsersubtenantId = sessionStorage.getItem('SubtenantId')
        setGeneratedata(data)
        let linkstatusid = res.data?.data?.linkStatusId
        if (props.occuranceId == 19) {
          putUserSubSetLink(linkstatusid, data)
        } else {

          calloccuranceIdfun(props.occuranceId, loggedUsersubtenantId, allData1)
        }
      } else {
        konsole.log("err11", error)
      }
    })
    console.log("sendmailtoclient")
  }


  const putUserSubSetLink = (linkstatusid, data) => {
    props.dispatchloader(true)

    let jsonobj = {
      "userSubscriptionId": subscriptionId,
      "userLinkId": linkstatusid,
      "updatedBy": loggeduserId
    }
    konsole.log("jsonobj12", JSON.stringify(jsonobj), $Service_Url.putUserSubscriptionsetLink)
    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUserSubscriptionsetLink, jsonobj, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log("res12", res)
        let data2 = res.data?.data
        let allData1 = {
          "Data1": data,
          "Data2": data2,
          "clientdata": props.clientData,
          "subtenantName": subtenantName
        }
        setAlldata(allData1)
        let loggedUsersubtenantId = sessionStorage.getItem('SubtenantId')
        // occurrenceId.callOccurrenceIdFunc(19, loggedUsersubtenantId, allData1)

        calloccuranceIdfun(props.occuranceId, loggedUsersubtenantId, allData1)
      } else {
        konsole.log("err12", err)
      }

    })


  }
  //-----------------------------------------------------------------------------------------

  const calloccuranceIdfun = (occurrenceIdData, subtenantIdData, allData) => {
    //             occurrenceId.callOccurrenceIdFunc1(occurrenceIdData, subtenantId, allData, ) 
    props.dispatchloader(true)
    let jsonobj = {
      "occurrenceId": occurrenceIdData,
      "isActive": true,
      "subtenantId": subtenantIdData
    }
    konsole.log("json111", JSON.stringify(jsonobj))
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getCommMediumPath, jsonobj, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log("res111", res)

        const commChannelIdId = res.data?.data[0]?.commChannelId
        setChhanleId(commChannelIdId)
        const applicableEmailTempIdId = res.data?.data[0]?.applicableEmailTempId
        const applicableTextTempIdId = res.data?.data[0]?.applicableTextTempId
        console.log("commChannelIdId", commChannelIdId, applicableEmailTempIdId, applicableTextTempIdId)

        console.log("ababaa", applicableEmailTempIdId, applicableTextTempIdId, allData, occurrenceIdData)
        if (commChannelIdId == 3) {
          callBothTextAndEmailApiFunc(applicableEmailTempIdId, applicableTextTempIdId, allData, occurrenceIdData)
        } else if (commChannelIdId == 2) {
          callTextApiFunc(applicableTextTempIdId, allData)
        } else if (commChannelIdId == 1) {
          callEmailApiFunc(applicableEmailTempIdId, allData, occurrenceIdData)
        }
        // commChannelIdId == 3 ? occurrenceId.callBothTextAndEmailApiFunc(applicableEmailTempIdId, applicableTextTempIdId, allData, occurrenceIdData) : commChannelIdId == 2 ? occurrenceId.callTextApiFunc(applicableTextTempIdId, allData) : commChannelIdId == 1 && occurrenceId.callEmailApiFunc(applicableEmailTempIdId, allData, occurrenceIdData);

      } else {
        konsole.log("err111", err)
        if (err.status == 404) {
          // let subtenantId = DEFAULT_SUBTENANTID_FOR_OCCURRENCE;
          // callOccurrenceIdFunc2(occurrenceIdData, subtenantId, allData)
        }
      }
    })
  }


  const callOccurrenceIdFunc2 = (occurrenceIdData, subtenantIdData, allData) => {
    props.dispatchloader(true)

    let jsonobj = {
      "occurrenceId": occurrenceIdData,
      "isActive": true,
      "subtenantId": subtenantIdData
    }
    konsole.log("res1112", JSON.stringify(jsonobj))
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getCommMediumPath, jsonobj, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        console.log("res1112", res)
        const commChannelIdId = res.data?.data[0]?.commChannelId;
        setChhanleId(commChannelIdId)
        const applicableEmailTempIdId = res.data?.data[0]?.applicableEmailTempId;
        const applicableTextTempIdId = res.data?.data[0]?.applicableTextTempId;

        if (commChannelIdId == 3) {
          callBothTextAndEmailApiFunc(applicableEmailTempIdId, applicableTextTempIdId, allData, occurrenceIdData)
        } else if (commChannelIdId == 2) {
          callTextApiFunc(applicableTextTempIdId, allData)
        } else if (commChannelIdId == 1) {
          callEmailApiFunc(applicableEmailTempIdId, allData, occurrenceIdData)
        }

        // commChannelIdId == 3 ? occurrenceId.callBothTextAndEmailApiFunc(applicableEmailTempIdId, applicableTextTempIdId, allData, occurrenceIdData) : commChannelIdId == 2 ? occurrenceId.callTextApiFunc(applicableTextTempIdId, allData) : commChannelIdId == 1 && occurrenceId.callEmailApiFunc(applicableEmailTempIdId, allData, occurrenceIdData);




      } else {
        konsole.log("err1112", err)

      }
    })


  }


  const callBothTextAndEmailApiFunc = (emailTempalteId, textTempalteId, allData, occurrenceIdDataValue) => {
    console.log("both", emailTempalteId, textTempalteId, allData, occurrenceIdDataValue)
    callTextApiFunc(textTempalteId, allData)
    callEmailApiFunc(emailTempalteId, allData, occurrenceIdDataValue)
  }

  const callTextApiFunc = (TempalteId, allData) => {
    props.dispatchloader(true)
    console.log("alldata", allData)
    let isActive = true
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getTextTemplate + `?TextTemplateId=${TempalteId}&IsActive=${isActive}`, "", (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log("res123", res)
        let responseData = res.data.data[0]
        konsole.log("responseData", responseData)
        let templateData = templateReplacer(responseData?.textTemplateContent, allData)
        settextTemplateData(templateData)
        settextResponsetemplateData(responseData)
        // sendTextAPIFunc(responseData, allData)

      } else {
        konsole.log("err123", err)
      }
    })
  }

  const callEmailApiFunc = (TempalteId, allData, occurrenceIdDataValue) => {
    props.dispatchloader(true)
    let isActive = true
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.GetEmailTemplate + `?TemplateId=${TempalteId}&IsActive=${isActive}`, "", (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log("res1233", res)
        let responseData = res.data.data[0]
        setEmailResponsetemplateData(responseData)
        let templateData = templateReplacer(responseData?.templateContent, allData)
        setemailtemplatedata(templateData)
        // sendEmailAPIFunc(responseData, allData)

      } else {
        konsole.log("err1233", err)
      }
    })
  }


  //------------------------------- 
  const sendEmailTexttemplate = () => {
    if (chhanelid == 3 || chhanelid == 2) {
      sendEmailAPIFunc()
    } else {
      sendTextAPIFunc()
    }
  }
  //-----------------------------------------------------------------


  const sendEmailAPIFunc = () => {
    let responseData = emailresponsetemplatedata
    props.dispatchloader(true)
    // let templateData = templateReplacer(responseData?.templateContent, allData)
    // console.log("templateData11", responseData?.templateContent)
    // console.log("templateData12", templateData)
    let templateData = emailtemplatedata
    let emailto = allData?.clientdata?.primaryEmailAddress
    let createdBy = sessionStorage.getItem('loggedUserId')
    let smsMappingTablePKId = allData?.Data1?.userLinkId

    console.log("emailemail", allData)
    let jsonobj = {
      "emailType": responseData?.templateType,
      "emailTo": emailto,
      "emailSubject": responseData?.emailSubject,
      "emailContent": templateData,
      "emailTemplateId": responseData?.templateId,
      "emailStatusId": 1,
      "emailMappingTable": "tblUserLinks",
      "emailMappingTablePKId": smsMappingTablePKId,
      "createdBy": createdBy

    }
    console.log("jsonobjjsonobj11", JSON.stringify(jsonobj))
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.PostEmailCom, jsonobj, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        console.log("resres11", res)

        setsendEmail(true)
        if (chhanelid == 3) {
          sendTextAPIFunc()
        }

      } else {
        console.log("errerr11", err)
      }
    })

    console.log("jsonobj1122", JSON.stringify(jsonobj))
  }

  const sendTextAPIFunc = () => {
    props.dispatchloader(true)
    let responseData = textresponsetemplatedata
    console.log("alldata", allData)
    // let templateData = templateReplacer(responseData?.textTemplateContent, allData)
    let templateData = texttemplatedata
    let textto = allData?.clientdata?.primaryPhoneNumber;
    let smsMappingTablePKId = allData?.Data1?.userLinkId
    let createdBy = sessionStorage.getItem('loggedUserId')
    // let textMappingTable=
    let jsobobj = {
      "smsType": responseData?.textTemplateType,
      "textTo": textto,
      "textContent": templateData,
      "smsTemplateId": responseData?.textTemplateId,
      "smsStatusId": 1,
      "smsMappingTable": "tblUserLinks",
      "smsMappingTablePKId": smsMappingTablePKId,
      "createdBy": createdBy
    }

    console.log("json1234", JSON.stringify(jsobobj))
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postSendTextPath, jsobobj, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        console.log("res1234", res)
        setsendText(true)
      } else {
        console.log("err1234", err)
      }
    })
  }


  //-----------------------------------------------------------------------------

  const templateReplacer = (templateData, allData) => {

    console.log("templateDatatemplateData",allData, templateData)

    let SubtenantName = allData.subtenantName
    let UserName = allData?.clientdata?.memberName;
    let uniquelink = allData?.Data1?.uniqueLinkURL
    konsole.log("uniquelinkuniquelink",SubtenantName,UserName,SubtenantName,allData?.Data1?.uniqueLinkURL,uniquelink)



    let updatedTemplateData = templateData;
    let ATTENDEENAME;
    konsole.log("updatedTemplateDataupdatedTemplateData", updatedTemplateData, allData)
    // if (props.occuranceId == 19) {
    //   console.log("uniquelinkuniquelinkk",props.occuranceId)
    //   updatedTemplateData = updatedTemplateData?.replace('@@SUBTENANTNAME', SubtenantName).replace('@@USERNAME', UserName).replace('@@UNIQUELINK', uniquelink)
    // } else if (props.occuranceId == 20) {
    //   console.log("occurance20")
    //   updatedTemplateData = updatedTemplateData?.replace('@@AGENTNAME', SubtenantName).replace('@@USERNAME', UserName).replace('@@UNIQUELINK', uniquelink)
    // }


    updatedTemplateData = updatedTemplateData?.replace('@@SUBTENANTNAME', SubtenantName)
    updatedTemplateData = updatedTemplateData?.replace('@@SUBTENANTNAME', SubtenantName)
    updatedTemplateData = updatedTemplateData?.replace('@@SUBTENANTNAME', SubtenantName)
    updatedTemplateData = updatedTemplateData?.replace('@@USERNAME', UserName)
    updatedTemplateData = updatedTemplateData?.replace('@@USERNAME', UserName)
    updatedTemplateData = updatedTemplateData?.replace('@@USERNAME', UserName)
    updatedTemplateData = updatedTemplateData?.replace('@@USERNAME', UserName)
    updatedTemplateData = updatedTemplateData?.replace('@@UNIQUELINK', uniquelink)
    updatedTemplateData = updatedTemplateData?.replace('@@UNIQUELINK', uniquelink)
    updatedTemplateData = updatedTemplateData?.replace('@@UNIQUELINK', uniquelink)
    updatedTemplateData = updatedTemplateData?.replace('@@UNIQUELINK', uniquelink)
    updatedTemplateData = updatedTemplateData?.replace('@@UNIQUELINK', uniquelink)
    updatedTemplateData = updatedTemplateData?.replace('@@UNIQUELINK', uniquelink)
    updatedTemplateData = updatedTemplateData?.replace('@@UNIQUELINK', uniquelink)
    updatedTemplateData = updatedTemplateData?.replace('@@UNIQUELINK', uniquelink)
    konsole.log("updatedTemplateDataupdatedTemplateData", updatedTemplateData)

    return updatedTemplateData



  }


  //---------------------UPDATE-----------------------------------------------------

  const updateUserLinks = () => {
    if(props.occuranceId !==19){
      // alert("Mail or SMS sent successfully")
      toasterShowMsg("Email and Text sent successfully","Success")
      modalopenfun()
      return;
    }
    props.dispatchloader(true)
    let createdBy = sessionStorage.getItem('loggedUserId')
    let subtenantId = sessionStorage.getItem('SubtenantId')
    let userLinksId = generatedata?.userLinkId
    let jsonobj = {
      "userLinkId": userLinksId,
      "linkStatusId": 2,
      "subtenantId": subtenantId,
      "updatedBy": createdBy
    }
    console.log("json123", JSON.stringify(jsonobj))
    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putuserLinksUpdate, jsonobj, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log("resres123", res)
        // alert("Mail or SMS sent successfully")
        toasterShowMsg("Email and Text sent successfully","Success")
        modalopenfun()
      } else {
        konsole.log("errerr123", err)
      }
    })
  }
  //-------------------------------------------------------------------

  const toasterShowMsg = (message, type) => {
    setdata({
        open: true,
        text: message,
        type: type,
    })
  }
  const modalopenfun = () => {
    settextTemplateData('')
    setChhanleId('')
    setemailtemplatedata('')
    setopemmodal(!openmodal)
  }
  return (
    <>    <Button className="theme-btn" onClick={() => sendMailToClient()}>Send Email/Text to client</Button>
      {/* <button onClick={() => modalopenfun()}>open</button> */}
        <Modal show={openmodal} className="SampleData1"
          onHide={() => modalopenfun()}
          borderRadius={20}
          closable={false}
          footer={false}
          size='xl'
          maskClosable={false}
        >
          <Modal.Body
            style={{
              // maxHeight: 'calc(100vh - 105px)',
              // overflowY: 'auto',


            }}
          >

            <div
              style={{
                border: "1px solid #720c20",
                width: "auto",
                margin: "-14px",
                backgroundColor: "#720c20",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                marginTop: '-16px'
              }}
              className="rounded-top"
            >
              <div className=""></div>
              <div className="fs-5 ">{chhanelid === 3 ? "Send Text & Mail" : chhanelid === 1 ? "Send Text" : "Send Mail"}</div>

              <div className="me-2 mt-1" style={{ cursor: "pointer" }} onClick={() => modalopenfun()}  >X</div>
            </div>

            <br />

            <div >
              <ModalBody
                style={{
                  maxHeight: 'calc(100vh - 222px)',
                  overflowY: 'auto',
                  // marginRight : '-0.8rem',
                  // marginLeft : '-13px'


                }}
                className="vertical-scroll"
              >
                <div id="templateData1"></div>

                <div id="templateData"> </div>


              </ModalBody>
            </div>

            <Row className="d-flex flex-column">
              <div className="me-4">
                <Button className="w-100 mt-2"
                  style={{
                    backgroundColor: "#720c20",
                    color: "white",
                    border: "none",
                    width: "150%",
                    borderRadius: "5px",
                    marginBottom: "10px"
                  }}

                  onClick={() => sendEmailTexttemplate()}
                >
                  {chhanelid === 3 ? "Send Text & Mail" : chhanelid === 1 ? "Send Text" : "Send Mail"}

                </Button>
              </div>
              <div className="md-2">
                <Button className="w-100"
                  style={{
                    backgroundColor: "white",
                    color: "#720C20",
                    border: "2px solid #720c20",
                    width: "150%",
                    borderRadius: "5px",
                    marginBottom: "10px"

                  }}

                  onClick={() => modalopenfun()}
                >
                  Cancel
                </Button>
              </div>

            </Row>
          </Modal.Body>
        </Modal>
    </>

  )
}

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader })
});

export default connect(mapStateToProps, mapDispatchToProps)(OccuranceCom)