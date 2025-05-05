import React, { useState, useEffect, useContext } from "react";
import konsole from "../../control/Konsole";
import { Breadcrumb, BreadcrumbItem, Col, Form, Modal, Row, Table,OverlayTrigger,Tooltip } from "react-bootstrap";
import { globalContext } from "../../../pages/_app";
import { $CommonServiceFn } from "../../network/Service";
import { $Service_Url } from "../../network/UrlPath";
import { deceaseMemberStatusId, specialNeedMemberStatusId } from "../../Reusable/ReusableCom";
import { $AHelper } from "../../control/AHelper";


export default function AgentsTable({ dataSource, Rendermember }) {
  const [paginationInfo, setPaginationInfo] = useState({ current: 1, pageSize: 10, });
  const [commmediumdata, setcommmediumdata] = useState("");
  const [emailtemp, setemailtemp] = useState("");
  const [emailtempLocal, setemailtemplocal] = useState("");
  const [emailtempdata, setemailtempdata] = useState("");
  const [userData, setUserData] = useState();
  const [showModal, closeModal] = useState(false);
  const [texttempLocal, settexttempLocal] = useState("");
  const [texttemp, settexttemp] = useState();
  const [texttempdata, settexttempdata] = useState();
  const [filterdata, setFilterdata] = useState(dataSource);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [datauser, setdatauser] = useState(null);
  const [disabledButton, setdisabledButton] = useState(false);
  const { setdata } = useContext(globalContext)
  const context = useContext(globalContext)
  const [showwarningpoput, setshowwarningLagecyModal] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [loggedUser,setloggedUser] =useState("")
  const [subtenantId,setsubtenantId] = useState("")
  const [loggeduserid,setloggeduserid] = useState("")
  const [useridPrimary,setuseridPrimary] =useState({})
  // konsole.log("hsfuyehcjjf", open)

  useEffect(() => {
    const subtenantId = sessionStorage.subtenantId
    var loggedUser = JSON.parse (sessionStorage.getItem("userDetailOfPrimary"))
    setloggedUser(loggedUser)
    var loggeduserId = sessionStorage.getItem( "loggedUserId");
    setloggeduserid(loggeduserId)
    let primaryuserid = sessionStorage.getItem("SessPrimaryUserId");
    setuseridPrimary(primaryuserid)
    setsubtenantId(subtenantId)
    getCommMediumPathfuc(subtenantId);
  }, [Rendermember]);

  useEffect(() => {
    if (Rendermember == "Spouse") {

      let filterdatas = dataSource?.map(d => (d.agentUserId === userId) ? { ...d, relationWithSpouse: "Spouse" } : d);

      setFilterdata(
        filterdatas.sort((a, b) => a.fullName.localeCompare(b.fullName))
      );
      konsole.log("fileteedd", filterdatas, userId);
    } else {
      setFilterdata(
        dataSource.sort((a, b) => a.fullName.localeCompare(b.fullName))
      );
    }
  }, [dataSource]);
  // useEffect(() => {
  //   if(showModal === true){
  //     // document.getElementById("showEmailTemplate").innerHTML = emailtemp;
  //   }
  // }, [showModal]);

  const getCommMediumPathfuc = (subtenantId) => {
    let dataobj = { "occurrenceId": 20, "isActive": true, "subtenantId": subtenantId };
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getCommMediumPath, dataobj, (response, error) => {
      if (response) {
        konsole.log(response, "response")
        let data = response.data.data[0];
        konsole.log("getCommMediumPath", response.data.data);
        setcommmediumdata(data);
        if (data.commChannelId == 2) {
          getTextTemplateapifuc(
            data.applicableTextTempId,
            data.isActive,
            data.subtenantId
          );
        } else if (data.commChannelId == 1) {
          GetEmailTemplateapifuc(
            data.applicableEmailTempId,
            data.isActive,
            data.subtenantId
          );
        } else if (data.commChannelId == 3) {
          GetEmailTemplateapifuc(
            data.applicableEmailTempId,
            data.isActive,
            data.subtenantId
          );
          getTextTemplateapifuc(
            data.applicableTextTempId,
            data.isActive,
            data.subtenantId
          );
        }
      } else {
        konsole.log(error, "responseerror")
      }
    })
  };

    const GetEmailTemplateapifuc = (tempid, isactive, subid) => {
      let SubtenantIds = sessionStorage.getItem( "SubtenantId");
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.GetEmailTemplate+ "?" + "TemplateId" + "=" + tempid + "&" + "IsActive" + "=" + isactive + "&SubtenantId" + "=" + SubtenantIds , "", (res, error) => {
        if(res){
        konsole.log("GetEmailTemplateapi", res.data.data);
        setemailtempdata(res.data.data[0]);
        setemailtemp(res.data.data[0].templateContent);
      }else{
        konsole.log(error,"GetEmailTemplateapierror")
      }
        })
      }

    const getTextTemplateapifuc = (tempid, isactive, subid) => {
      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getTextTemplate+ "?" + "TextTemplateId" + "=" + tempid + "&" + "IsActive" + "=" + isactive + "&SubtenantId" + "=" + subid , "", (res, error) => {
        if(res){
        konsole.log("GettextTemplateapiresponse", res);
        settexttempdata(res.data.data[0]);
        settexttemp(res.data.data[0].textTemplateContent);
      }else{
        konsole.log("GettextTemplateapierr", err);
      }
    })
  }
    const showEmailPreview1 = (userData) => {
      konsole.log("userDataEmaill",userData)
      setAgentName(userData?.fullName?.split(" ")[0]);
      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserDetailsByEmailId+`?emailId=${userData.agentEmailId}`,"", (res, error) => {
        if(res){
          konsole.log("getUserDetaildByEmailres1", res);
          let responseData = res?.data[0];
          let rolesDetails = responseData?.roleDetails;
          let checkRoleLagecy = rolesDetails?.some((item) => item?.roleId === 20);
          if (checkRoleLagecy == true && responseData?.auth0Id !== null) {
            setshowwarningLagecyModal(true);
          } else {
            showEmailPreview(userData)
          }
          konsole.log("getUserDetaildByEmailres", res, responseData);
        }else{
          konsole.log("getUserDetaildByEmailerr", error);
        }
      })
    };
    const showEmailPreview = (userData) => {
      console.log('userDatauserData',userData)
      let TemplateContent = emailtemp;
      konsole.log(userData,loggedUser,loggedUser.memberName,Rendermember, TemplateContent,"TemplateContentTemplateContent");
      TemplateContent = TemplateContent.replace(
        "@@AGENTNAME",
        userData?.fullName?.split(" ")[0]?.split(" ")[0]
      );
      if (Rendermember == "primary") {
        TemplateContent = TemplateContent.replace(
          "@@USERNAME",
          loggedUser?.memberName
        );
      } else {
        TemplateContent = TemplateContent.replace(
          "@@USERNAME",
          loggedUser.spouseName
        );
      }

      let TemplateContenttext = texttemp;
      TemplateContenttext = TemplateContenttext.replace(
        "@@AGENTNAME",
        userData?.fullName?.split(" ")[0]
      );
      if (Rendermember == "primary") {
        TemplateContenttext = TemplateContenttext.replace(
          "@@USERNAME",
          loggedUser?.memberName
        );
      } else {
        TemplateContenttext = TemplateContenttext.replace(
          "@@USERNAME",
          loggedUser.spouseName
        );
      }
      konsole.log(TemplateContenttext , texttemp,"TemplateContenttext = texttemp")
      konsole.log(TemplateContenttext,texttemp,Rendermember,"TemplateContenttext")

      setemailtemplocal(TemplateContent);
      settexttempLocal(TemplateContenttext);
      setUserData(userData);
      closeModal(true);
    };

    const sendInvite = (data) => {
      konsole.log(data, subtenantId,"postaddmemberres");
      let dataObj = {
        subtenantId: subtenantId ? subtenantId :2,
        linkTypeId: 2,
        linkStatusId: 1,
        userId: data?.agentUserId,
        occurrenceId: 20,
        createdBy: loggeduserid,
      };
      // message.destroy()
      if (data.agentEmailId == null) {
        toasterAlert( "Please enter the user's primary email to send the invitation link");
      } 
      // else if (data.agentMobileNo == null) {
      //   toasterAlert(
      //     "Please enter the user's primary cell no. to send the invitation link"
      //   );
      // } 
      else {
        getAddMemberUserByUserId(data, dataObj);
      }
    };

    const getAddMemberUserByUserId = async (userdata, dataObj) => {
      konsole.log("userdata111111",userdata)
      $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.userGenerateLinks,dataObj,(res,error)=>{
        if(res){
          konsole.log(res, "postaddmemberres121212");
          let responsedata = res.data.data;

          // let acceptLink = `${responsedata.uniqueLinkURL}&&ACCEPT`
          // let declineLink = `${responsedata.uniqueLinkURL}&&DECLINE`

          let UniQuiLink = `${responsedata.uniqueLinkURL}&&SHOW_LIST_ALL`;
            if (emailtemp !== null && emailtemp !== "") {
               SendEmailCommPathFunc(userdata, responsedata, UniQuiLink);
            }
            if (texttemp !== null && texttemp !== "") {
               postSendTextPathapifunc(userdata, responsedata, UniQuiLink);
            }
      }else{
          konsole.log("errorin messafe", error);
        }
          closeModal(false);
        });
    };

    const SendEmailCommPathFunc = (userdata, responsedata, UniQuiLink) => {
      let TemplateContent = document.getElementById("emailtemplate").innerHTML;
      konsole.log("TemplateContentTemplateContent", TemplateContent);
      TemplateContent = TemplateContent.replace(
        "@@AGENTNAME",
        userData?.fullName?.split(" ")[0]
      );
      if (Rendermember == "Primary") {
        TemplateContent = TemplateContent.replace(
          "@@USERNAME",
          loggedUser.memberName
        );
      } else {
        TemplateContent = TemplateContent.replace(
          "@@USERNAME",
          loggedUser.spouseName
        );
      }
      // TemplateContent = TemplateContent.replace(
      //   "@@UNIQUELINK",
      //   responsedata.activationLink
      // );
      // TemplateContent = TemplateContent.replace(
      //   "@@UNIQUELINK",
      //   responsedata.activationLink
      // );
      TemplateContent = TemplateContent.replace("@@UNIQUELINK", UniQuiLink);
      // TemplateContent = TemplateContent.replace(
      //   "@@ACCPETLINK",
      //   acceptLink
      // );
      // TemplateContent = TemplateContent.replace(
      //   "@@DECLINELINK",
      //   declineLink
      // );

      konsole.log(
        TemplateContent,
        responsedata.activationLink,
        "TemplateContentemail"
      );
      konsole.log("userdataagentEmailId", userdata);
      let dataObj = {
        emailType: emailtempdata.templateType,
        emailTo: userdata?.agentEmailId,
        emailSubject: emailtempdata.emailSubject,
        emailContent: TemplateContent,
        // "emailFrom": commmediumdata.commMediumRoles[0].fromRoleId,
        emailFromDisplayName: commmediumdata.commMediumRoles.fromRoleName,
        emailTemplateId: emailtempdata.templateId,
        emailStatusId: 1,
        emailMappingTable: userdata.fullName,
        emailMappingTablePKId: userdata.agentUserId,
        createdBy: loggeduserid,
      };
     $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.SendEmailCommPath,dataObj,(res,error)=>{
      if(res){
        konsole.log("SendEmailComm", res);
        closeModal(false)
        toasterAlert("Invitation for agent sent successfully","Success");
      }else{
        konsole.log("SendEmailComm", error);
      }
     })
    };

  const SendmailInvite = async (data) => {
    konsole.log('datadata',data)
    const memberStatusId=data.memberStatusId;
    const fullName=data.fullName
    if(deceaseMemberStatusId==memberStatusId){
      toasterAlert(`We apologize to inform you that ${fullName}, whom you intended to add as an agent is deceased.`)
      return;
    }
    if(memberStatusId==specialNeedMemberStatusId){
      toasterAlert(`We apologize to inform you that ${fullName}, whom you intended to add as an agent is special needs.`)
      return;
    }
    let sentMailSate = filterdata?.filter((ele) => {
     return ele?.agentUserId == data?.agentUserId;
    });

    let boolValue = sentMailSate.every((ele) => ele.statusName == "Accepted" && ele.isUserActive == true);
    if (boolValue == false) {
    if ( sentMailSate.every( (ele) =>ele.statusName == "Pending" &&(ele.isUserActive == true || ele.isUserActive == false) )    ) {
        showEmailPreview1(...sentMailSate);
      } else if (
        sentMailSate.some((ele) => ele.statusName == "Declined" &&(ele.isUserActive == true || ele.isUserActive == false))) {
        konsole.log("sentMailSate",sentMailSate)
        setdatauser(sentMailSate);
        const ques = await context.confirm(true, `${data?.fullName} had declined to act as your agent, Are you sure you want to resend the invite?`, 'Confirmation');
        konsole.log(sentMailSate, "sentMailSate")
        if (ques){
            showEmailPreview1(data);
            setOpen(false);
        }
      } else {
        showEmailPreview1(...sentMailSate);
      }
    }
  };
  //   // konsole.log("confirmLoading", confirmLoading)

    const postSendTextPathapifunc = (userdata, responsedata, acceptLink) => {
      let TemplateContenttext =
        document.getElementById("templateData1").innerHTML;
      konsole.log("TemplateContenttext", TemplateContenttext);
      TemplateContenttext = TemplateContenttext.replace(
        "@@AGENTNAME",
        userdata.fullName
      );
      TemplateContenttext = TemplateContenttext.replace(
        "@@USERNAME",
        loggedUser.memberName
      );
      TemplateContenttext = TemplateContenttext.replace(
        "@@UNIQUELINK",
        acceptLink
      );

      konsole.log(TemplateContenttext, "TemplateContenttext");
      let dataObj = {
        smsType: texttempdata.textTemplateType,
        textTo: userdata.agentMobileNo,
        textContent: TemplateContenttext,
        smsTemplateId: texttempdata.textTemplateId,
        smsStatusId: 1,
        smsMappingTable: "",
        smsMappingTablePKId: "",
        createdBy: loggeduserid,
      };
      $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.postSendTextPath,dataObj,(res,err)=>{
        if(res){
          konsole.log("postSendTextPath", res);
        }else{
          konsole.log("postSendTextPath", err);
        }
      })
    };

  const shoButtons = (filterdata, data, fname, trueIndex) => {
        konsole.log(filterdata, datauser, fname, trueIndex, "43784736473647")
        let filterSate = filterdata.filter((ele) => { return ele.fullName == fname; });
    filterdata.filter((e) => {
      konsole.log(e.fullName == fname, "utirturtiutiutirturtur")
    })
    let FilterdButton = filterSate.every((ele) => ele?.statusName === "Accepted" && ele?.isUserActive === true);
    let Filterddata = filterdata.filter((ele) => ele?.statusName === "Declined" && (ele?.isUserActive === true || ele.isUserActive == false));

    let AllAccepted = filterSate.every(item => item?.statusName === 'Accepted' && item?.isUserActive == false)
    let AllAccepted2 = filterSate.every(item => item?.statusName === 'Accepted' && item?.isUserActive == true)
    let checkDecline = filterSate.some(item => item?.statusName === 'Declined')

    // konsole.log("gajfiuyiofd",data)
    konsole.log("filterSatefilterSatefilterSate", filterSate)
    konsole.log("AllAcceptedAllAccepted", AllAccepted)

    konsole.log("filterdatafilterdata", filterdata, Filterddata)
    // konsole.log(open,"tryeuio")
    return (
      <>
        <button className={AllAccepted2 ? 'disable' : 'activebtn'}
          disabled={(AllAccepted2 == true) ? true : false}
          onClick={() => { SendmailInvite(data) }}>
          {(AllAccepted == true) ? "Activate Agent" : (AllAccepted2 == true) ? "User Activated" : (checkDecline == true) ? "Send Invite for Declined Role" : "Send Invite"}
        </button>
      </>
    );
    // data.isUserActive == true ? (
    //   <button className="disable" disabled>
    //     User Activated
    //   </button>
    // ) : (
    //   <button
    //     className="activebtn"
    //     onClick={() => {
    //       SendmailInvite(data)
    //      }}
    //   >
    //     Send Invite
    //   </button>
    // )
  };



  const handleChange = (pagination) => {
    setPaginationInfo(pagination);
  };

  const modalOnDisable = () => {
    setshowwarningLagecyModal(!showwarningpoput);
  };
  function toasterAlert(text,type) {
    setdata({ open: true, text: text, type: type ? type :"Warning" });
  }
useEffect(()=>{
  function mergeCells() {
  let db = document.getElementById("databody");
  let dbRows = db?.rows;
  let lastValue = "";
  let lastCounter = 1;
  let lastRow = 0;
  for (let i = 0; i < dbRows?.length; i++) {
    let thisValue = dbRows[i]?.cells[0]?.innerHTML;
    konsole.log(thisValue,"yrueyn")
    if (thisValue == lastValue) {
      lastCounter++;
      dbRows[lastRow].cells[0].rowSpan = lastCounter;
      dbRows[i].cells[0].style.display = "none";
    } else {
      dbRows[i].cells[0].style.display = "table-cell";
      lastValue = thisValue;
      lastCounter = 1;
      lastRow = i;
    }
  }
}
mergeCells()
})


  return (
    <div className="agentModuleShowMap">
      <Modal className="modalsetguidance" show={showwarningpoput} size="lg" centered={true}   onHide={() => {modalOnDisable}}  >
      <Modal.Header className="modal-header-color">
          <Row className="d-flex w-100">
            <Col lg={11} className="d-flex justify-content-center align-items-center">
            <span className="text-center" style={{color:"white"}}>Send Invite</span>
            </Col>
            <Col lg={1} className="d-flex justify-content-end">
            <button className="btncloseagentmodal" onClick={() => {modalOnDisable}}>X</button>
            </Col>
          </Row>
        </Modal.Header>
        <Modal.Body style={{ margin: "0px auto", width: "100%" }}>
        <div className="text-center">
          <p className="mt-3" style={{ fontSize: "1.1rem" }}>
            This user email address is already associated with the legacy
            system.
            <br />
            {/* <Link to="/Fiduciaries">Click here</Link> to update primary email */}
            address for {agentName}.
          </p>
        </div>
        </Modal.Body>
      </Modal>
      

      <ModalForOccurrence showpreviewmodal={showModal} cancelModalClose={closeModal}  emailtemp={emailtempLocal} texttemp={texttempLocal} sendTextEmail={sendInvite} userData={userData}/>
 

      <div className="mt-3 FiduciaryBeneficiaryscroll  mb-3"  style={{ borderTop: "1px solid #ced4da" }}>
  <Table id="datatable" bordered style={{ backgroundColor: "#ffffff"}}>
    <thead className="sticky-top bg-light border" style={{top:"-2px",zIndex:0}}>
      <tr>
        <th>Agent</th>
        {/* <th>Relation</th> */}
        <th>Document</th>
        <th>Role</th>
        <th>Order</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody id="databody">
      {/* {filterdata.map((item, index) => ( */}
      {filterdata.sort((a, b) => {
      const dateA = new Date(a.agentDOB);
      const dateB = new Date(b.agentDOB);
      if (isNaN(dateA) || isNaN(dateB)) {
        konsole.log("Invalid date found in agentDOB:", a.agentDOB, b.agentDOB);
        return 0;
      }
      return dateA - dateB;
    }).map((item, index) => (

        <tr key={index}>
          <td>{$AHelper.capitalizeAllLetters(item.fullName)} &nbsp; {shoButtons(filterdata, item, item.fullName, index)}</td>
          {/* <td className="agent-td-span-tag">{Rendermember == "Spouse" && (item?.relationWithSpouse != null || item?.relationWithSpouse != undefined) ? item.relationWithSpouse : (item.agentUserId == useridPrimary ) ? "Spouse" : item.relationWithMember}</td> */}
          <td className="agent-td-span-tag" >{item.legalDocName}</td>
          <td className="agent-td-span-tag">{item.agentRole}</td>
          <td >
            <span className="agent-td-span-tag">
            {item.agentRank}
            </span>
            </td>
          <td>
            {item.statusName === "Accepted" ? (
              <span className="statusbtn" style={{ color: "#117800" }}>{item.statusName}</span>
            ) : item.statusName === "Pending" ? (
              <span className="statusbtn" style={{ color: "#DD7819" }}>{item.statusName}</span>
            ) : item.statusName === "Declined" ? (
              <span className="statusbtn" style={{ color: "#d2222d" }}>{item.statusName}</span>
            ) : (
              <span className="statusbtn" style={{ color: "#DD7819" }}>Pending</span>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
</div>

    </div>
  );
}


const ModalForOccurrence=({comChannelId,cancelModalClose,showpreviewmodal,emailtemp,texttemp,sendTextEmail,userData})=>{
  return(
    <>
          <Modal
              show={showpreviewmodal}
              size="lg"
              onHide={() => cancelModalClose()}
              backdrop="static"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px" }}
            >
              <Modal.Header className="text-white" closeVariant="white" closeButton>
                Preview Send {(comChannelId==1)?'Email':(comChannelId==2)?'Text':'Email & Text'}
              </Modal.Header>
              <Modal.Body className="rounded">

                <div style={{ minHeight: "60vh", maxHeight: "60vh", height: "100vh", overflowX: "none", overflowY: "scroll" }} className="border">
                  <div className="position-relative" style={{ pointerEvents: "none" }} >
                    {
                      (emailtemp !== null && emailtemp !== "" && emailtemp !== undefined) ?
                        <>
                          <h6 className="ps-4 ms-5 mt-3">Email Template</h6>
                          <div dangerouslySetInnerHTML={{ __html: emailtemp}} id="emailtemplate" contentEditable="false" className="p-0 m-0" />
                        </>
                        : <></>
                    }
                    <div className="px-5 mb-2">
                      {
                        (texttemp !== null && texttemp !== "" && texttemp !== undefined) ?
                          <>
                            <h6 className="mt-3">Text Template</h6>
                            <div contentEditable="false" id="templateData1" className="border p-2" style={{ padding: "10px 0 30px 0" }}>
                              {texttemp}
                            </div>
                          </>
                          : <></>
                      }
                    </div>
                  </div>
                </div>
                <div className="d-grid place-items-center p-4 gap-2">
                  <button style={{ background: "#720c20", color: "white", outline: "none", borderRadius: "5px", border: "2px solid #720C20" }} className="p-1" onClick={() => sendTextEmail(userData)}> 
                  Send  {(comChannelId==1)?'Email':(comChannelId==2)?'Text':'Email & Text'}
                   </button>
                  <button style={{ color: "#720c20", background: "white", border: "2px solid #720C20", borderRadius: "5px" }} className="p-1" onClick={() =>  cancelModalClose()}> Cancel</button>
                </div>
              </Modal.Body>
            </Modal>
    </>
  )
}