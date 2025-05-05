import DragDrop from "./DragDrop";
import Router from "next/router";
import { Modal } from "react-bootstrap";
import { $CommonServiceFn, $postServiceFn, Services } from "../../../components/network/Service";
import { globalContext } from "../../../pages/_app";
import { $Service_Url } from "../../../components/network/UrlPath";
import { connect } from "react-redux";
import { SET_LOADER } from "../../../components/Store/Actions/action";
import { useEffect, useState, useContext} from "react";
import GeneratePDF from "../../../components/GeneratePdf/GeneratePdf";
import konsole from "../../../components/control/Konsole";
import { $AHelper } from "../../control/AHelper";
import ContractExpress from "../contractExpress/ContractExpress";
import BulkUpload from "../../FileCabinet/BulkUpload";
import { jsonObj } from "../contractExpress/xml";
import VerifyOtpPassword from "../VerifyOtpPassword";
import { configdata, demo } from "../../control/Constant";
import NonCrisisFeeAgreement from "../annualAgreement/NonCrisisFeeAgreement";
import AnnualAgreemetModal from "./AnnualAgreemetModal";
import { lpoLiteUrl } from "../../control/Constant";
import Form from 'react-bootstrap/Form';
import { isNotValidNullUndefile, postApiCall, _handOff_Msg, getApiCall2 } from "../../Reusable/ReusableCom";
import AlertToaster from "../../control/AlertToaster";
import withFileCabinetParalegalPermissions from "../../HOC/withFileCabinetParalegalPermissions";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Stepcomplete from "./Stepcomplete";
import { useResetStore } from "../../../component/utils/utils";
import { $getServiceFn } from "../../../components/network/Service";
import { updateHandleChecked } from "../../../component/Redux/Reducers/personalSlice";
import { useDispatch } from "react-redux";
import AiModal from '../../../component/Finance-Information/Assets/RetirementNonRetirement.js/AiModal';
import SelectAvailableDocModal from "./SelectAvailableDocModal"
const Data = (props) => {
      konsole.log("apiCallGetFolderDetails",props)
  const { setdata,setWarning } = useContext(globalContext)
  const context = useContext(globalContext);
  const [showPdf, setShowPdf] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [loggedInRoleId, setloggedInRoleId] = useState("");
  const [showDragNDrop, setDragNDrop] = useState(false);
  const [client, setClient] = useState({});
  const [ipaddress, setIpaddress] = useState('::1')
  const [showverifyotppassword, setshowverifyotppassword] = useState(false)
  const [selectclientdata, setselectclientdata] = useState()
  const [otpresdata, setotpresdata] = useState()
  const [orderId,setOrderId]=useState(null)
  const [stopLoader, setStopLoader] = useState(false)
  const dispatch = useDispatch();
  // const [selectedRowData, setSelectedRowData] = useState({
  //   index: null,
  //   showDocumentOptions: false,
  // })
  const initialState = {
    index: null,
    showDocumentOptions: false,
  };

  const [selectedRowData, setSelectedRowData] = useState({ ...initialState });
  const [selectedFileUpload, setSelectedFileUpload] = useState({ ...initialState });
  const [selectedFileCabinet, setSelectedFileCabinet] = useState({ ...initialState });
  const [showannualagreementmodal, setshowannualagreementmodal] = useState(false)
  const [showFeeAgreementModal, setshowFeeAgreementModal] = useState(false);
  const [clientdataforannualagreement, setclientdataforannualagreement] = useState([])
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [orderIDFromUrl, setOrderIDFromUrl] = useState(null);
  const [clientDataForFeeAgreement, setClientDataForFeeAgreement] = useState([]);
  const [AssigneeList,setAssigneeList] = useState([])
  const [showStepmodal,setShowstepmodal] = useState({show:false,data:null})
  const [showAiDoc, setShowAiDoc] = useState(false)
  const [aiDocuments, setAiDocuments] = useState()
  const [showSelectAvailableDocModal, setShowSelectAvailableDocModal] = useState(null)
  const[selectedDocument,setSelectedDocument]=useState([])
  const [documentNameVersion, setDocumentNameVersion] = useState({client_name: "",version: ""});
  const[selectedMemberId,setSelectedMemberId]=useState(null)
  const[showTime,setShowTime]=useState([])
  const[paralegal_client_name,setParalegal_client_name]=useState("")
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionStatus = urlParams.get("TrxnStatus") || props?.isPaymentStatus;
    const orderIDFromUrl = urlParams.get("OrderId") || props?.isPaymentOrderId;
    const userEmail = sessionStorage.getItem('feeAgreementUser');
    konsole.log(orderIDFromUrl, transactionStatus, props?.isFeeAgreementPayment,"TransactionStatusWithOrderID", userEmail, props)
    if (orderIDFromUrl && transactionStatus === "SUCCESS" && props?.isFeeAgreementPayment == true && isNotValidNullUndefile(userEmail) && props.client?.length > 0 ) {
      setshowFeeAgreementModal(true)
      setTransactionStatus(transactionStatus);
      setOrderIDFromUrl(orderIDFromUrl);
    } else {
      setTransactionStatus(transactionStatus);
    }
    if (orderIDFromUrl && transactionStatus === "SUCCESS" && props?.isFeeAgreementPayment == true && props.client?.length > 0 && isNotValidNullUndefile(userEmail)) {
      openAnnualModalFileTable(props.client[0]); 
    }
  }, [props?.isFeeAgreementPayment,props.client]);
  
  useEffect(()=>{
    const amaUserEmail = sessionStorage.getItem('amaUser');
    const subtenantId = sessionStorage.getItem('SubtenantId')
    const userDetails = JSON.parse(sessionStorage.getItem('userLoggedInDetail'))

    if(props?.isAmaPayment==true && props?.client?.length>0 && isNotValidNullUndefile(amaUserEmail)){
    setSelectedRowData({index:0,showDocumentOptions:true});
    showannualagreementmodalfun(props.client[0])
    }

    // if(props?.client?.length > 0){
    // getAssigneeFunction(subtenantId,userDetails)
    // }
  },[props?.isAmaPayment,props?.client])

  useEffect(() => {
    setSelectedRowData({ ...initialState });
  }, [props?.client]);

  useEffect(()=>{
    if(!showSelectAvailableDocModal && showSelectAvailableDocModal!==null){ //on Clicking proceed
      setShowAiDoc(true)
      HandleXmlGenrater(selectedMemberId)
    }
  },[showSelectAvailableDocModal])

  useEffect(()=>{
    const subtenantId = sessionStorage.getItem('SubtenantId')
    const userDetails = JSON.parse(sessionStorage.getItem('userLoggedInDetail'))
    const stateObj = JSON.parse(sessionStorage.getItem('stateObj'));
    const _loggedInRoleId = stateObj?.roleId;
    setloggedInRoleId(_loggedInRoleId);
    getAssigneeFunction(subtenantId,userDetails)
  },[])

  const openAnnualModalFileTable = (client) => {
    localStorage.setItem("clientDataForFeeAgreement", JSON.stringify(client));
    setshowFeeAgreementModal(!showFeeAgreementModal);
    setClientDataForFeeAgreement(client);
  }

  const getDateFromString = (dob) => {
    return dob?.split("T")[0];
  };

  // const redirectLpoLite = (item) => {
  //   let userRoles=item?.userRoles
  //   let stateObj = JSON.parse(sessionStorage.getItem("stateObj"))
  //   konsole.log("stateobj", userRoles)
  //   const appState = stateObj?.appState;
  //   const userId = stateObj?.userId;
  // const roleId = item?.roleId;
  //   const loggenInId = stateObj.loggenInId;

  //   for(let value of userRoles){
  //     if(value.roleId == 9){
  //     let tokenKey = `appState=${appState}&userId=${userId}&roleId=${stateObj.roleId}&loggenInId=${loggenInId}`;
  //     window.open(`${lpoLiteUrl}?token=${window.btoa(tokenKey)}`, '_blank')
  //   }
  // }

  // }

  const handleDataClick = (client, screenType) => {

    // if (screenType == 'dashboard' && client?.isHandOff == true) {
    //   toasterShowMsg(_handOff_Msg._isHandOff, 'Warning')
    //   return;
    // }
    //clear store of reduxx
    useResetStore()
    //clear store of reduxx

    konsole.log("client details", client);
    sessionStorage.setItem("SessPrimaryUserId", client.memberId);
    sessionStorage.setItem("isStateId", props?.isStateId);
    sessionStorage.setItem("maritalStatusId", client.maritalStatusId)
    sessionStorage.setItem("SubtenantId", client.subtenantId);
    let roleId = null;
    const lpoRoleIndex = client.userRoles.findIndex(d => d.roleId === 9);
    if (lpoRoleIndex >= 0) {
      roleId = client.userRoles[lpoRoleIndex].roleId
    }
    else {
      const intakeRoleIndex = client.userRoles.findIndex(d => d.roleId === 1 || d.roleId === 10);
      if (intakeRoleIndex >= 0) {
        roleId = client.userRoles[intakeRoleIndex].roleId;
      }
    }


    sessionStorage.setItem("isUserActive",client.isUserActive);
    sessionStorage.setItem("roleUserId", roleId);

    getLoggedInUser(client.memberId, screenType, client?.maritalStatusId, client.primaryUserMemberId);
  };

  const sendResetPasswordLink = async (client) => {
 
    let msg=`Are you sure you want to send the reset password link to ${client.memberName} ?`
    const req = await context.confirm(true,msg, "Confirmation");
    if (!req) return;
 
    const postData = {
        userName: client.primaryEmailAddress,
        emailID: client.primaryEmailAddress,
        requestedIP: "::1",
        commMedium: "Email",
        commSendOn: client.primaryEmailAddress
    };
 
    props.dispatchloader(true);
    const _res=await postApiCall('POST', $Service_Url.postForgotPassword, postData);
    props.dispatchloader(false);
    console.log('_res',_res)
    if(_res !='err'){
      AlertToaster.success('Reset password link successfully sent.')
    }
    else
    {
      AlertToaster.error('Something went wrong. Please contact the administrator.')
    }
 
};
 


  const getLoggedInUser = (userid, screenType, maritalStatusId, memberId) => {
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserbyId + userid, "", (response) => {
      props.dispatchloader(false);
      if (response) {
        if (isNotValidNullUndefile(response?.data?.data?.spouseUserId)) {
          props.dispatchloader(true);
          $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFamilyMemberbyID + response.data.data.spouseUserId, "", (res) => {
            props.dispatchloader(false);
            let loginDetail = {};
            if (isNotValidNullUndefile(res?.data?.data?.member)) {
              const memberData = res.data.data.member;
              let mName = memberData.mName == null ? " " : " " + memberData.mName + " ";
              const fullName = memberData.fName + mName + memberData.lName;
              loginDetail = {
                memberName: response.data && response.data.data.memberName,
                primaryEmailId: response.data && response.data.data.primaryEmailId,
                userName: response.data && response.data.data.userName,
                spouseName: fullName,
                userMob: response?.data && response?.data?.data?.primaryPhoneNumber,
                memberId: memberId
                // + mName + res.data.data.member.lName
              };
              if (response.data) {
                sessionStorage.setItem("userDetailOfPrimary", JSON.stringify(loginDetail));
                sessionStorage.setItem("spouseUserId", response.data.data.spouseUserId);
                if(screenType == "AttorneyNotes"){
                  Router.push("/AttorneyNotes")
                  return;
                }
                if (screenType == "dashboard" & maritalStatusId !== null) {
                  sessionStorage.setItem('activateform', true)
                  // Router.push({ pathname: "./dashboard", search: "?query=" + userid, state: { userid: userid, }, }); 
                  Router.push({ pathname: "./setup-dashboard", search: "?query=" + userid, state: { userid: userid, }, }); 
                  
                } else if (screenType == "dashboard" & maritalStatusId == null) {
                  sessionStorage.setItem('activateform', false)
                  Router.push({ pathname: './Activationform', search: '?query=' + userid, state: { userid: userid, } })
                }
                else if (screenType == "assignRoles") {
                  Router.push({
                    pathname: "/paralegal/assignrole",
                    state: { userid: userid, },
                  });
                }
                else if (screenType == "FileCabinet") {
                  Router.push({
                    // pathname: "FileCabinet",
                    pathname: "File_Cabinet",
                  });
                }
              }
            }
          }
          );
        } else {
          konsole.log("spouseDetails", response);

          let loginDetail = {};
          if (response.data !== null || response.data !== "") {
            loginDetail = {
              memberName: response.data && response.data.data.memberName,
              primaryEmailId: response.data && response.data.data.primaryEmailId,
              userName: response.data && response.data.data.userName,
              spouseName: null,
              userMob: response?.data && response?.data?.data?.primaryPhoneNumber,
              memberId: memberId
            };
            if (response.data) {
              sessionStorage.setItem("userDetailOfPrimary", JSON.stringify(loginDetail));
              sessionStorage.setItem("spouseUserId", response.data.data.spouseUserId);

              // sessionStorage.setItem("userDetailOfPrimary", JSON.stringify(loginDetail));
              if(screenType == "AttorneyNotes"){
                Router.push("/AttorneyNotes")
              }
              if (screenType == "dashboard" & maritalStatusId !== null) {
                sessionStorage.setItem('activateform', true)
                // Router.push({ pathname: "./dashboard", search: "?query=" + userid, state: { userid: userid, }, });
                Router.push({ pathname: "./setup-dashboard", search: "?query=" + userid, state: { userid: userid, }, });
              } else if (screenType == "dashboard" & maritalStatusId == null) {
                sessionStorage.setItem('activateform', false)
                Router.push({ pathname: './Activationform', search: '?query=' + userid, state: { userid: userid, } })

              } else if (screenType == "assignRoles") {
                Router.push({
                  pathname: "/paralegal/assignrole",
                  state: { userid: userid, },
                });
              }
              else if (screenType == "FileCabinet") {
                Router.push({
                  // pathname: "FileCabinet",
                  pathname: "File_Cabinet",
                });
              }
            }
          }
        }
      }
    }
    );
  };

  const handleshowverifyotppassword = () => {
    setshowverifyotppassword(!showverifyotppassword)
  }

  const showannualagreementmodalfun = (client) => {
    setshowannualagreementmodal(!showannualagreementmodal)
    setclientdataforannualagreement(client)
  }
  const handleShowPdf = () => {
    setShowPdf(!showPdf);
  };
  const handleUpload = () => {
    setDragNDrop(!showDragNDrop);
  };

  const handleGeneratePdf = (client) => {
    setMemberId(client.memberId);
    handleShowPdf();
    konsole.log("show Member Id in data", memberId);
  };

  const handleDragNDrop = (client) => {
    setClient(client);
    handleUpload();
  };

  const handleContract = (client) => {
    setClient(client);
    setShowContract(!showContract);
  };

  // useEffect(() => {
  //   let promise = $postServiceFn.getIpAddress();
  //   promise.then(res => {
  //     konsole.log("IP address", res.IPv4);
  //     setIpaddress(res.IPv4)
  //   })


  // }, [])

  const base64toBlob = (data, fileType) => {

    const bytes = window.atob(data);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
      out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: fileType });
  };

  const showDocxFile = (client, currentFile) => {
    if (currentFile.fileContentType == undefined) return <p> No file attached.</p>
    const blob = base64toBlob(currentFile.fileDataToByteArray, currentFile.fileContentType);
    const url = URL.createObjectURL(blob);

    var link = document.createElement("a");
    link.href = url;
    link.download = client.memberName;
    link.click();
  }

  const handleAssessmentLetter = (client) => {
    const currentDate = $AHelper.getFormattedDate(new Date()); props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.assessmentLetterUrl + client.memberId + '?currentDate=' + currentDate, "", (resp, error) => {
      props.dispatchloader(false);
      if (resp) {
        konsole.log("resp", resp);
        showDocxFile(client, resp.data.data);
        setSelectedRowData({
          index: null,
          showDocumentOptions: false,
        })
      }
      else if (error) {
        props.dispatchloader(false);
        konsole.log("error", error)
        if (error.status == 500) {
          toasterShowMsg("There is network issue. Please try again after some time.", 'Warning')
          // alert("There is network issue. Please try again after some time.")
        }
      }
    })
  }
  const handleRoadMapLetter = (client) => {
    const currentDate = $AHelper.getFormattedDate(new Date());    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.roadmapLetterUrl + client.memberId + '?currentDate='+currentDate, "", (resp, error) => {
      props.dispatchloader(false);
      if (resp) {
        konsole.log("resp", resp);
        showDocxFile(client, resp.data.data);
        setSelectedRowData({
          index: null,
          showDocumentOptions: false,
        })
      }
      else if (error) {
        props.dispatchloader(false);
        konsole.log("error", error)
        if (error.status == 500) {
          toasterShowMsg("There is network issue. Please try again after some time.",'Warning')
          // alert("There is network issue. Please try again after some time.")
        }
      }
    })
  }

  const handleAnnualLetter = (client) => {
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.anualLetterUrl + client.memberId, "", (resp, error) => {
      props.dispatchloader(false);
      if (resp) {
        konsole.log("resp", resp);
        showDocxFile(client, resp.data.data);
        setSelectedRowData({
          index: null,
          showDocumentOptions: false,
        })
      }
      else if (error) {
        props.dispatchloader(false);
        konsole.log("error", error)
        if (error.status == 500) {
          alert("There is network issue. Please try again after some time.")
        }
      }
    })
  }

  const handleDocOptionsFileUpload = (index, showDocumentOptions) => {
    setSelectedFileUpload({
      index: index,
      showDocumentOptions: showDocumentOptions
    });

    setSelectedRowData({
      index: null,
      showDocumentOptions: false,
    });
    setSelectedFileCabinet({
      index: null,
      showDocumentOptions: false,
    });
  };

  const handleDocumentOptions = (index, status) => {
    setSelectedRowData((prevState) => ({
      index: prevState?.index == index && prevState?.showDocumentOptions ? null : index,
      showDocumentOptions: prevState?.index == index ? !prevState?.showDocumentOptions : status,
    }));

    setSelectedFileUpload({
      index: null,
      showDocumentOptions: false,
    });
    setSelectedFileCabinet({
      index: null,
      showDocumentOptions: false,
    });
  };

  const handleDocOptionsInfo = (index, showDocumentOptions) => {
    setSelectedFileCabinet({
      index: index,
      showDocumentOptions: showDocumentOptions
    });

    setSelectedRowData({
      index: null,
      showDocumentOptions: false,
    });
    setSelectedFileUpload({
      index: null,
      showDocumentOptions: false,
    });
  };



  const LpoRoleCheck = (e, client) => {
    konsole.log("LpoRoleCheck", e, checkedStatus, client)

    let checkedStatus = e.target.checked
    konsole.log("checkedStatus", checkedStatus)

    let userRoles = client.userRoles
    let filterData = userRoles.filter(item => item.roleId == 9)
    let filterData2 = userRoles.filter(item => item.roleId == 1 || item.roleId == 10)

    if (filterData.length > 0) {
      updateURLRoles(client?.memberId, filterData, client);
    }
    else if (filterData2.length > 0) {
      updateURLRoles(client?.memberId, filterData2, client);
    }

  }
  const funForCheckAnyLegalDocIsUploadNot = (e, client) => {

    // if (client.isHandOff == true) {
    //   toasterShowMsg(_handOff_Msg?._isHandOffRoleChange, "Warning")
    //   return;
    // }
    // console.log('clientclientclientclientclientclient', client.memberId)

    if (client.isHandOff == true && e.target.checked == false) {
      toasterShowMsg("You cannot switch to Intake as Hand Off is enabled.", "Warning");
      return;
  }

    props.dispatchloader(true);
    Services.apiCallForChechLegalDocStatus(client?.memberId).then((res) => {
      konsole.log('res of getting status of legal doc', res)
      props.dispatchloader(false);
      if (res?.data == false) {
        toasterShowMsg("Please upload any legal document in order to convert the client to LPO.", 'Warning')
        return;
      }

      if(e.target.checked==false){
        // memberId
        const belongsToMemberId=client?.memberId ;
        props.apiCallGetFolderDetails(belongsToMemberId);
      }
      // if (client.isUserActive == true) {
        LpoRoleCheck(e, client)
        // return;
      // } else {
        // toasterShowMsg("Please activated client to proceed further.", 'Warning')
      // }
    }).catch((err) => {
      props.dispatchloader(false);
      konsole.log('err im getting staus of legal doc', err)
    })

    return;


  }


  const updateURLRoles = (userId, rolesDetails, client) => {
    props.dispatchloader(true)
    let subtenantId = sessionStorage.getItem("SubtenantId")
    let stateObj = JSON.parse(sessionStorage.getItem("stateObj"))

    let loggedUserId = sessionStorage.getItem("loggedUserId")
    let jsonObj = {
      "loginUserId": parseInt(client?.loginUserId),
      "subtenantId": subtenantId,
      "roleId": rolesDetails[0].roleId,
      "isActive": false,
      "userRoleId": rolesDetails[0]?.userRoleId,
      "updatedBy": loggedUserId,
      "remarks": "string"
    }

    konsole.log("jsonObjjsonObj", JSON.stringify(jsonObj))
    $CommonServiceFn.InvokeCommonApi(
      "PUT",
      $Service_Url.putUserRole + "/" + userId,
      jsonObj,
      (response, errorData) => {
        if (response) {
          konsole.log("postUserRole", response);
          konsole.log("jsonObjjsonObj", response)
          props.dispatchloader(false)
          postRole(jsonObj, userId, rolesDetails)
        } else {
          konsole.log("postUserRole", errorData)
          props.dispatchloader(false)
        }
      }
    );
  }

  const clientDataFunc = (clientData) => {
    setselectclientdata(clientData);
    setshowverifyotppassword(true);
  }

  const postRole = (jsonObj, userId, rolesDetails) => {
    props.dispatchloader(true)
    let jsonobj2 = {
      "loginUserId": parseInt(jsonObj?.loginUserId),
      "subtenantId": jsonObj.subtenantId,
      "roleId": (jsonObj.roleId == 9) ? 1 : (jsonObj.roleId == 1 || jsonObj.roleId == 10) ? 9 : '',
      "isActive": true,
      'createdBy': jsonObj.updatedBy
    }
    konsole.log("jsonObjjsonObj2", jsonobj2)
    $CommonServiceFn.InvokeCommonApi(
      "POST",
      $Service_Url.postUserRole + userId,
      jsonobj2,
      (response, errorData) => {
        if (response) {
          props.dispatchloader(false)
          konsole.log("response", response)
          props.callapidata()

        } else {
          konsole.log("error", errorData);
          props.dispatchloader(false)

        }
      }
    );
  }



  const funForHandOff = async (e, client) => {
    konsole.log('funForHandOff', client, e)
    const userRoles = client?.userRoles
    const memberUserId = client?.memberId
    const isUserActive = client?.isUserActive
    const isHandOff = client?.isHandOff
    dispatch(updateHandleChecked(isHandOff))
    const isHandOffChecked = e.target.checked;
    konsole.log('memberUserId&isHandOff', memberUserId, isHandOffChecked)
    // console.log('isHandOffCheckedisHandOffChecked', isHandOffChecked)

    if (isHandOff == true) {
      toasterShowMsg(_handOff_Msg?._isHandOff, "Warning");
      return;
    }
    if (!userRoles.some((item) => item?.roleId == 9) && isUserActive == false) {
      toasterShowMsg(_handOff_Msg?._intakeMember_InActive, "Warning");
      return;
    }
    if (!userRoles.some((item) => item?.roleId == 9)) {
      toasterShowMsg(_handOff_Msg?._intakeMember_Active, "Warning");
      return;
    }
    if (isUserActive == false) {
      toasterShowMsg(_handOff_Msg?._lpoMember_InActive, "Warning");
      return;
    }

    const req = await context.confirm(true, _handOff_Msg?._confirmationMsgForHandOff, "Confirmation");
    if (req == false) return;

    konsole.log('postApiCall', isHandOffChecked)
    props.dispatchloader(true)
    const result = await postApiCall("PUT", $Service_Url.postClientHandOffUrl + `?userId=${memberUserId}&IsHandOff=${isHandOffChecked}`, '')
    console.log('result'), result
    props.dispatchloader(false)
    if (result !== 'err') {
      AlertToaster.success(_handOff_Msg?._handOff_save)
      props.callapidata()
    }

  }

  const getAssigneeFunction = async (subtenantId,userDetails) =>{
    konsole.log(subtenantId,userDetails,"subtenantIduserDetails")
    let jsonObj ={
      subtenantId:subtenantId,
      roleId:13
    }
    const getAssigneeList = await postApiCall('POST',$Service_Url.getUserListByRoleId,jsonObj)
    konsole.log(getAssigneeList,"getAssigneeList")
    if(getAssigneeList=='err') return;
    // getAssigneeList.then((response)=>{
    //   konsole.log(response,"response")
      setAssigneeList(getAssigneeList.data.data)
    // })
  
  }

  const handleAssigneeselect = async (e,client) =>{
    let loggedUserId = sessionStorage.getItem("loggedUserId")
    let jsonObj =[
      {
        "userLegalStaffId": 0,
        "isActive": true,
        "isDeleted": false,
        "primaryUserId": client.memberId,
        "legalUserId": e.target.value,
        "staffTypeId": 1,
        "upsertedBy": loggedUserId
      }
    ]
    const postAssignee = await postApiCall('POST',$Service_Url.postLegalstaffdata,jsonObj)
    if(postAssignee == 'err') return;
    konsole.log(jsonObj,postAssignee,client,"handleAssigneeselect")
  }

  const handleDeleteUser = async ( userData, index ) => {
    let loggedUserId = sessionStorage.getItem("loggedUserId")
    const { memberId, loginUserId } = userData;

    konsole.log("ahsdjfak", userData, index, props?.client);

    const req = await context.confirm(true, _handOff_Msg?._deleteConfirmation, "Confirmation");
    if(!req) return;

    const deleteRes = await postApiCall("DELETE", $Service_Url.deleteUserAccount + `/${memberId}/${loginUserId}/${loggedUserId}`, "")
    if(deleteRes != 'err') {
      AlertToaster.success('This client account deleted successfully');

      handleDocOptionsInfo(index, false);

      const newClientdata = props.client?.filter((ele, idx) => idx != index);
      konsole.log("newClientdata", props.client, newClientdata);
      props?.setClient(newClientdata);

    } else AlertToaster.error('Something went wrong. Please try again.');
  }

  function onClickAiDocument(client){
    setParalegal_client_name(client?.memberName)
    setShowSelectAvailableDocModal(true);
    setSelectedMemberId(client)
  }


  const clientElement = () => {
    let clientData = props.client && props.client.length > 0 ? props.client : [];
    return clientData.length > 0 ? (
      clientData.map((client, index) => {
        konsole.log("clientmap", client)
        const modifiedBy = client.modifiedBy !== null ? client.modifiedBy : "";
        let toggleisactiveoffalse = client?.userRoles.some((item) => item.roleId == 9)
        konsole.log("toggleisactiveoffalse", toggleisactiveoffalse, client.memberName, client.userRoles)
        let spouseName = (client?.spouseName !== undefined && client?.spouseName !== null) && ` & ${client?.spouseName}`
        konsole.log('spouseName', spouseName)
        const assessmentDate = client.assessment.assessmentDate !== null ? $AHelper.getFormattedDate(getDateFromString(client.assessment.assessmentDate)) : "";
        const assessmentDue = client.assessment.assessmentDue !== null ? $AHelper.getFormattedDate(getDateFromString(client.assessment.assessmentDue)) : "";
        const modifiedOnDate = (client?.modifiedOn !== '0001-01-01T00:00:00') ? $AHelper.getFormattedDate(getDateFromString(client?.modifiedOn)) : null;

        let renewaldate = client?.validityTo != null ? $AHelper.getFormattedDate(client?.validityTo) : client?.validityFrom != null ? $AHelper.getFormattedDate(new Date(new Date(client?.validityFrom).setFullYear(new Date(client?.validityFrom).getFullYear() + 1))) : client?.renewalDate != null ? $AHelper.getFormattedDate(client?.renewalDate):null;
        let otherAgmtOrderIds = client?.otherAgmtOrderId
        const getBgClass = () => {

          if (isNotValidNullUndefile(otherAgmtOrderIds) && renewaldate == null) {

            return 'bg-Yellow-Data-Table'
          } else if (renewaldate == null && !isNotValidNullUndefile(otherAgmtOrderIds)) {
            return 'bg-Blue-Data-Table'
          } else if (new Date(renewaldate) > new Date()) {
            return 'bg-Green-Data-Table'
          } else if (new Date(renewaldate) < new Date()) {
            return 'bg-Red-Data-Table'
          } else {
            return 'bg-Blue-Data-Table';
          }

        };
        const isHandOfCheck = isNotValidNullUndefile(client?.isHandOff) ? client?.isHandOff : false
        return (
          <tr key={client?.memberId}>
             <td className={`text-wrap ${getBgClass()}`} style={{ width: '', height: '65px', cursor: 'default' }} >
              <span className="paraData" onClick={() => handleDataClick(client, "dashboard")} style={{ fontSize: "16px",cursor:'pointer' }}>{$AHelper.capitalizeAllLetters(client.memberName)}{$AHelper.capitalizeAllLetters(spouseName)}</span> <br />
              <div className='d-flex gap-2 align-items-center'>{(client.isUserActive == true) ? 
                <p className='paralegal-button-inactive py-1 align-items-center' style={{background:'transparent'}}>
                  {/* <span className='green-dot mx-1'></span>Client Activated */}
                  <button className="paralegal-button-active mt-1 py-1 px-3" style={{background:'transparent',cursor:'default'}}>
                  <span className="d-flex gap-2 align-items-center"><img className="p-0 m-0" width="12px" height="auto" src="New/icons/checkIcon.svg" />Client Activated</span></button>

              <OverlayTrigger placement='top' overlay={<Tooltip>Reset Password</Tooltip>}>
              <img className="cursor-pointer ms-2" style={{ height: "21px", marginTop: "0px" }} src='icons/resetPassword.svg' onClick={() =>sendResetPasswordLink(client)}  />
              </OverlayTrigger></p>
 
                :<button onClick={() => { (client.isUserActive == false) ? clientDataFunc(client) : "" }} className="paralegal-button-active mt-1 py-1 px-3 " style={{background:'transparent'}}>
                Activate Client</button>}
                <div className='d-flex align-items-center'>
                  <div className='h-100 me-2 ms-0' style={{color:'grey'}}>{"|"}</div>
                  <label className={`${(toggleisactiveoffalse == true) ? "toggle1" : "toggle2"} toggle`}>
                  <input type="checkbox" checked={(toggleisactiveoffalse == true) ? true : false} onChange={(e) => funForCheckAnyLegalDocIsUploadNot(e, client)} />
                  <span class="slider"></span>
                  <span class="labels" data-on="LPO" data-off="Intake"></span>
                  </label>
                </div>
              </div>
            </td>



            {/* <td className="verticleMiddle">
              <div>
                <p className='p-1 px-2' style={{border:'1px solid #838383', borderRadius:'20px',fontSize:'12px'}}><b>Updated on: </b>02/04/2024</p>
                <p><span className="pe-1" style={{fontWeight:"600",color:"#720c20"}}>Step 1:</span>Plan letter review</p>
                <button className="d-flex gap-1 align-items-center p-1" style={{background:"#E7E7E7", border:"none",borderRadius:"5px"}} onClick={()=>setShowstepmodal({show:true,data:client})}>
                  <img className="mt-0" src='icons/gridLightImg.svg' />
                  <p className="ps-1">Grid View</p>
                </button>
              </div>
            </td> */}
            <td className="verticalMiddle">
              {AssigneeList?.length > 0 && <div className="mx-2">
                <select 
                key={client?.legalUserId}
                onChange={(e)=>handleAssigneeselect(e,client)} 
                defaultValue={AssigneeList?.some((ele)=> ele.userId == client?.legalUserId) ? client?.legalUserId : "default"}>
                {AssigneeList?.some((ele)=> ele.userId == client?.legalUserId) ? <option value="default" disabled>{'Select Attorney'}</option> : <option value="default" disabled >{client?.legalUserName != null ? client?.legalUserName : 'Select Attorney'}</option>}
                {AssigneeList?.sort((a,b)=> a.fullName.localeCompare(b.fullName)).map((e)=>(
                    <option value={e?.userId}>{e?.fullName}</option>
                  ))}
                  </select>
              </div>}
            </td>
            <td className="verticalMiddle">
              <div className="progressBar container m-0">
                <div className="row">
                  <div className={`col ${(assessmentDate == "01-01-0001") ? "orange" : "green"}`}></div>
                  <div className={`col ${(assessmentDue == "01-01-0001") ? "orange" : "green"}`}></div>
                </div>
                <div className="row">
                  <div className="col-sm-6 leftBar">{assessmentDate == "01-01-0001" ? "Due" : assessmentDate}</div>
                  <div className="col-sm-6 rightBar">{assessmentDue == "01-01-0001" ? "Due" : assessmentDue}</div>
                </div>
              </div>
            </td>
            <td className="verticalMiddle">
              <label className={`${(isHandOfCheck == true) ? "toggle1" : "toggle2"} toggle`}>
                <input type="checkbox"
                  checked={isHandOfCheck}
                  onChange={(e) => funForHandOff(e, client)}
                />
                <span class="slider"></span>
                <span class="labels" data-on="YES" data-off="NO"></span>
              </label>
            </td>
            <td className=" text-center verticalMiddle mx-0 my-1" >
              <div className='d-flex gap-3 align-items-center'>
                {/* <img className="cursor-pointer" style={{ height: "25px" }} src='images/assignroles.png' onClick={() => { (client.isUserActive == true) ? handleDataClick(client, 'assignRoles') : toasterShowMsg("Please activated client to proceed further.",'Warning')}} /> */}
                <OverlayTrigger placement='top' overlay={<Tooltip>Assign Role</Tooltip>}>
                <img className="cursor-pointer" style={{ height: "30px", marginTop: "0px" }} src='images/assignroles.png' onClick={() => handleDataClick(client, 'assignRoles')} />
                </OverlayTrigger>
                <div className="d-flex justify-content-center align-items-center">
                <span className="cursor-pointer text-center position-relative">

                <OverlayTrigger placement='top' overlay={<Tooltip>File</Tooltip>}>
                  <img
                    className=""
                    style={{ height: "30px", cursor: 'pointer', marginTop: "0px" }}
                    src="icons/FileCabinetIcon.svg"
                    // src="icons/fileUpload.svg"
                    // onClick={() => { handleDragNDrop(client) }}
                    onClick={() => handleDocOptionsFileUpload(index, true)}
                  />
                  </OverlayTrigger>
                  {
                    (index === selectedFileUpload.index && selectedFileUpload.showDocumentOptions === true) ?
                      <div className="bg-white position-absolute end-0 top-0 p-0 documentOptions boxShadowDocuments rounded-start rounded-bottom" >
                        <span className="bg-white boxShadowDocumentsCross p-2 px-3 float-end rounded-end border-0" style={{ zIndex: "2" }} onClick={() => handleDocOptionsFileUpload(index, false)}><img style={{ width: "10px" }} className="m-0" src="icons/crossIcon.svg" /></span>
                        <div className="border-0 border-bottom mb-2 p-2">
                          <p>{$AHelper.capitalizeAllLetters(client.memberName)}</p>
                          <p className="text-decoration-underline">{client.primaryEmailAddress}</p>
                        </div>
                        <div className="paralegalDocumentListFileUpload justify-content-between p-2">
                          <div onClick={() => handleDataClick(client, "FileCabinet")}>
                            <img style={{ height: "30px", marginTop: "0px" }} src="/icons/filedrawer.svg" />
                            <p className="documentOptionsFont">File Cabinet</p>
                          </div>
                          <div onClick={() => { handleDragNDrop(client) }}>
                            <img style={{ height: "30px", marginTop: "0px" }} src="icons/fileUpload.svg" />
                            <p className="documentOptionsFont">File Upload</p>
                          </div>
                        </div>
                      </div>
                      : <></>
                  }
                </span>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <span className="cursor-pointer text-center position-relative">
                <OverlayTrigger placement='top' overlay={<Tooltip>Document</Tooltip>}>
                  <img style={{ height: "30px", marginTop: "0px" }} src="images/Hamburger.svg" onClick={() => handleDocumentOptions(index, true)} />
                  </OverlayTrigger>                  {
                    (index === selectedRowData.index && selectedRowData.showDocumentOptions === true) ?
                      <div className="bg-white position-absolute end-0 p-0 documentOptions boxShadowDocuments rounded-start rounded-bottom"
                        style={{top: props?.client?.length > 2 && props?.client?.length - index - 1 < 2 ? "auto" : "100%", bottom: props?.client?.length > 2 && props?.client?.length - index - 1 < 2 ? "100%" : "auto"}}>
                        <span className="bg-white boxShadowDocumentsCross p-2 px-3 float-end rounded-end border-0" style={{ zIndex: "2" }} onClick={() => handleDocumentOptions(index, false)}><img style={{ width: "10px" }} className="m-0" src="icons/crossIcon.svg" /></span>
                        <div className="border-0 border-bottom mb-2 p-2">
                          <p>{$AHelper.capitalizeAllLetters(client.memberName)}</p>
                          <p className="text-decoration-underline">{client.primaryEmailAddress}</p>
                        </div>
                        <div className="paralegalDocumentList p-2">
                          {/* <div onClick={() => { handleGeneratePdf(client) }}>
                          <img src="icons/nonCrisisLifeplanning.svg" />
                          <p className="documentOptionsFont">Non-crisis Lifeplanning</p>
                        </div> */}
                          <div onClick={() => handleAssessmentLetter(client)}>
                            <img src="icons/assessmentLetter.svg" />
                            <p className="documentOptionsFont">Assessment Letter</p>
                          </div>
                          {demo == true && <div onClick={() => handleRoadMapLetter(client)}>
                            <img style={{ height: "30px",marginTop:"5px" }} src="icons/roadmapLetterIcon.svg" />
                            <p className="documentOptionsFont">RoadMap Letter</p>
                          </div>}
                          {/*    <div onClick={() => handleAnnualLetter(client)}>  */}
                          <div onClick={() => showannualagreementmodalfun(client)}>
                            <img style={{ height: "30px", marginTop: "5px" }} src="icons/AnnualAgreementIcon.svg" />
                            <p className="documentOptionsFont">Annual Agreement</p>
                          </div>
                          <div onClick={() => openAnnualModalFileTable(client)}>
                            <img style={{ height: "30px",marginTop:"5px" }} src="icons/feeAgreementIcon.svg" />
                            <p className="documentOptionsFont">Non-Crisis Fee Agreement</p>
                          </div>
                          <div onClick={() => { handleContract(client) }}>
                            <img src="icons/ContractExpressIcon.svg" />
                            <p className="documentOptionsFont">Contract Express</p>
                          </div>
                          <div  onClick={()=>{onClickAiDocument(client)}}>
                            <img src="icons/ContractExpressIcon.svg" />
                            <p className="documentOptionsFont">Ai Document</p>
                          </div>
                        </div>
                      </div>
                      : <></>
                  }
                </span>
              </div>


              <OverlayTrigger placement='top' overlay={<Tooltip>Attorney Notes</Tooltip>}>
                <img className="cursor-pointer" style={{ height: "30px", marginTop: "0px" }} src='images/AttorneyNotes.svg' onClick={() => handleDataClick(client, 'AttorneyNotes')} />
                </OverlayTrigger>
              </div>
            </td>
            {/* <td className="verticalMiddle" >

            </td> */}
            {/* <th
              className="text-center cursor-pointer"
            >
              Contract
            </th>
            <th className="text-center cursor-pointer">
              {" "}
              <img
                style={{ height: "25px" }}
                src="./icons/pdfIcon.svg"
                onClick={() => { (client.isUserActive == true) ? handleGeneratePdf(client) : alert("Please activated client to proceed further") }}
              />
            </th> */}
            {/* <td className="verticalMiddle">
              
            </td> */}
            <td className="verticalMiddle">{`${client.productName != null ? client.productName : ''} - ${client.totalCost != null ? $AHelper.IncludeDollars(client.totalCost) : ''}`}</td>
            <td className="verticalMiddle">
              {`${client?.paymentDate != null ? $AHelper.getFormattedDate(client?.paymentDate) + '/' : '-'} 
                ${client?.validityTo != null ? $AHelper.getFormattedDate(client?.validityTo) : 
                client?.validityFrom != null ? $AHelper.getFormattedDate(new Date(new Date(client?.validityFrom).setFullYear(new Date(client?.validityFrom).getFullYear() + 1))) : 
                client?.renewalDate != null ? $AHelper.getFormattedDate(client?.renewalDate) : ''}`}
            </td>
            <td className="verticalMiddle">
              <div className="d-flex align-items-center">
                <span className="cursor-pointer text-center position-relative">
                  <img style={{ height: "25px", marginTop: "0px" }} src="icons/information.png" onClick={() => handleDocOptionsInfo(index, true)} />
                  {
                    (index === selectedFileCabinet.index && selectedFileCabinet.showDocumentOptions === true) ?
                      <div className="bg-white position-absolute end-0 top-0 p-0 documentOptions boxShadowDocuments rounded-start rounded-bottom" >
                        <span className="bg-white boxShadowDocumentsCross p-2 px-3 float-end rounded-end border-0" style={{ zIndex: "2" }} onClick={() => handleDocOptionsInfo(index, false)}><img style={{ width: "10px" }} className="m-0" src="icons/crossIcon.svg" /></span>
                        <div className="border-0 border-bottom mb-2 p-2 d-flex justify-content-center gap-2 position-relative">
                          <div>
                            <p>{$AHelper.capitalizeAllLetters(client.memberName)}</p>
                            <p className="text-decoration-underline">{client.primaryEmailAddress}</p>
                          </div>
                          {(loggedInRoleId == 13) && <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer bg-white rounded position-absolute" style={{width: '20px', height: '50%', right: '0'}}
                            onClick={() => handleDeleteUser(client, index)}
                          />}
                        </div>
                        <div className="paralegalDocumentListInfo p-2">
                          <div className="d-flex flex-column">
                            <p className="text-center fw-bold" style={{ color: '#76272B' }}>Reg. Date</p>
                            <p className="text-center verticalMiddle">
                              {$AHelper.getFormattedDate(getDateFromString(client.registeredOn))}
                            </p>
                          </div>
                          <div className="d-flex flex-column">
                            <p className="text-center fw-bold" style={{ color: '#76272B' }}>In-Take-sent-On</p>
                            <p className="text-center verticalMiddle">
                              {$AHelper.getFormattedDate(getDateFromString(client.intakeSentOn))}
                            </p>
                          </div>
                          <div className="d-flex flex-column">
                            <p className="text-center fw-bold" style={{ color: '#76272B' }}>Modified By</p>
                            <p className="text-center verticalMiddle">{modifiedBy}</p>
                          </div>
                          <div className="d-flex flex-column">
                            <p className="text-center fw-bold" style={{ color: '#76272B' }}>Modified On</p>
                            <p className="text-center verticalMiddle">
                              {modifiedOnDate}
                            </p>
                          </div>
                        </div>
                      </div>
                      : <></>
                  }
                </span>
              </div>
            </td>
          </tr>
        );
      })
      
    ) : (
      <p>No Data Found</p>
    );
  };


  const toasterShowMsg = (message, type) => {
    setdata({ open: true, text: message, type: type, })
  }

  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  }

  let attempts = 0; // Counter to track consecutive empty responses
  let intervalId = null
  let startTime = Date.now();
  let timings = [];
  let api4Start, api4End; 

  const HandleXmlGenrater =async(data)=>{ 
    // console.log("memberIdHandleXmlGenrater",data)
    props.dispatchloader(true) 
    let api1Start = Date.now();
    const _resultOf = await getApiCall2('GET', $Service_Url.createXmlGenrater+"/"+data?.memberId, "") 
    let api1End = Date.now();
    // toasterAlert("successfully", "Successfully" , "Data fetched successfully")
    timings.push(`Fetching client's data: ${(api1End - api1Start) / 1000} sec`);
    props.dispatchloader(false)
  
    const jsonString = JSON.stringify(_resultOf.data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], `UserMember_${data?.memberId}_Details.json`, { type: 'application/json' });
    let fileData;
    const formData = new FormData();
    formData.append('file', file);
    
    // Use this approach to log form data contents
    formData.forEach((value, key) => {
      fileData = value;
    });
    let formdata = new FormData();
    formdata.append("input_file", fileData)
    props.dispatchloader(true) 
    // toasterAlert("successfully", "Successfully" , "Sharing client's data to Ai")
    let api2Start = Date.now();
    const getDocumentData = await getDocumentDetails(formdata)
    // console.log("1233getDocumentData",getDocumentData,"sssssssssssssss",getDocumentData.message)
    let api2End = Date.now();
    if(getDocumentData.message!="Document processing started"){
      // toasterAlert("deletedSuccessfully", `Error while generating Ai document, Please try after sometime`);
      props.dispatchloader(false);
      return;
    }
  // toasterAlert("successfully", "Successfully" , "Client's data validated successfully from AI now processing for document generation")   
  timings.push(`Sharing client's data to Ai: ${(api2End - api2Start) / 1000} sec`);
  const document_directory_name=getDocumentData?.directory_name
  // console.log("document_directory_name",document_directory_name)
  // toasterAlert("successfully", "Successfully" , "Calling api to get version for documents urls")
  let api3Start = Date.now();
  const getDocumentVersionData = await getDocumentVersion(document_directory_name)
  // c] onsole.log("getDocumentVersionData",getDocumentVersionData)
  let api3End = Date.now();
  if(getDocumentVersionData=="err"){
      // toasterAlert("warning", `Document not found, Try after sometime`);
      props.dispatchloader(false);
      return;
  }

  // toasterAlert("successfully", "Successfully" , "SuccessFully got version name, now sending for getting document urls")
  timings.push(`Calling api to get version for document urls : ${(api3End - api3Start) / 1000} sec`);
  const latestDocument = getDocumentVersionData?.reduce((latestDoc, currentDoc) => {
    return new Date(currentDoc.timestamp) > new Date(getDocumentVersionData.timestamp)
          ? currentDoc
          : latestDoc;
      });

    setDocumentNameVersion({
        client_name: document_directory_name || "" ,
        version: latestDocument?.file_name || ""
    });
    startTime = Date.now();
    // toasterAlert("successfully", "Successfully", `Document generation started`); 
    api4Start = Date.now();
    intervalId = setInterval(async () => {
            await checkAndFetchDocuments(document_directory_name,latestDocument?.file_name);
    }, 5000);
    }

  const checkAndFetchDocuments = async (getDocumentData,version) => {
    props.dispatchloader(false) 
    const updatedDocumentStatus = await getDocument(getDocumentData,version);
    setStopLoader(true)
    if(updatedDocumentStatus == 'err'){
      clearInterval(intervalId); // Stop the interval
      setStopLoader(false)
    }
    setAiDocuments(updatedDocumentStatus)
    if (updatedDocumentStatus?.in_progress_documents?.length === 0) {
        attempts += 1; // Increment the counter if no documents are in progress

        if (attempts >= 2) {
            setStopLoader(false)
            clearInterval(intervalId); // Stop the interval
            api4End = Date.now(); 
            timings.push(`Document generation timing: ${(api4End - api4Start) / 1000} sec`);
            //  console.log("timings",timings)
            setShowTime(timings)
        } else {
            // Log and wait for the next interval to check again
            // console.log("No documents in progress, will check again...");
        }
    } else {
        // Reset counter if documents are in progress
        attempts = 0;
        // console.log("Documents found in progress:", updatedDocumentStatus.in_progress_documents);
    }
  };

  const getDocumentDetails =(data)=>{
    return new Promise((resolve, reject) => {
        const documentString2=selectedDocument.join("&target_template=")
        // console.log("documentString2",documentString2)
        $getServiceFn.getSelectedDocuments(data,documentString2, (res, err) => {
        // console.log("selectedDocument",selectedDocument)
        if (res) {            
            const response = res?.data;
            resolve(response)
        }
        else {
          resolve('err')
        }
      })      
    })
  }

  const getDocument =(data,version)=>{
    return new Promise((resolve, reject) => {
      const json ={"userName":data,"version":version}
      // console.log("getDocumentjson",json)
      $getServiceFn.postGenrateDoc(json, (res, err) => {
        if (res) {            
            const response = res?.data;
            resolve(response)
        }
        else {
          resolve('err')
        }
      })      
    })
  }
  const getDocumentVersion =(data)=>{
    return new Promise((resolve, reject) => {
      $getServiceFn.getDocumentVersion(data, (res, err) => {
        if (res) {            
            const response = res?.data;
            resolve(response)
        }
        else {
          resolve('err')
        }
      })      
    })
  }

  // console.log("DataselectedDocument",selectedDocument)

  return (
    <div
      onScroll={(e) => props.onScrollBack(e)}
      id=""
      className="table-wrapper-scroll-y my-custom-scrollbar "
      style={{ paddingBottom: "100px" }}
    >
      {showPdf ? (
        <GeneratePDF
          memberId={memberId}
          show={showPdf}
          handleShow={handleShowPdf}
        />
      ) : (
        <></>
      )}

      {showverifyotppassword ? <VerifyOtpPassword
        showverifyotppassword={showverifyotppassword}
        handleshowverifyotppassword={handleshowverifyotppassword}
        selectclientdata={selectclientdata}
        callapidata={props.callapidata}

      /> : ""}
      {showannualagreementmodal ?
        <AnnualAgreemetModal
          showannualagreementmodal={showannualagreementmodal}
          showannualagreementmodalfun={showannualagreementmodalfun}
          clientData={clientdataforannualagreement}
          subscriptionId="1"
          key={showannualagreementmodal}
          dispatchloader={props.dispatchloader}
          isPaymentStatus={props?.isPaymentStatus}
          isPaymentOrderId={props?.isPaymentOrderId}
          callapidata={props?.callapidata}
          functionHandleorderIdNStatus={props?.functionHandleorderIdNStatus}
        /> : ""
      }
      {showFeeAgreementModal && 
        <NonCrisisFeeAgreement
          clientData={clientDataForFeeAgreement}
          primaryEmailAddress={clientDataForFeeAgreement?.primaryEmailAddress}
          showFeeAgreementModal={showFeeAgreementModal}
          openAnnualModalFileTable={openAnnualModalFileTable}
          orderIDFromUrl={orderIDFromUrl}
          setTransactionStatus={setTransactionStatus}
          setOrderIDFromUrl={setOrderIDFromUrl}
          transactionStatus={transactionStatus}
          dispatchloader={props.dispatchloader}
          />
      }



      {showDragNDrop && (
        // <DragDrop client= {client} showDragNDrop={showDragNDrop} handleDragNDrop={handleDragNDrop}/>
        <BulkUpload
          showDragNDrop={showDragNDrop}
          handleDragNDrop={handleDragNDrop}
          client={client}
          callapidata={props.callapidata}
          handleUpload={handleUpload}
          dispatchloader={props.dispatchloader}

        />
      )}
      {showContract && (
        <ContractExpress
          client={client}
          showContract={handleContract}
          handleContract={handleContract}
        />
      )}
      {showStepmodal?.show == true && <Stepcomplete showModal={showStepmodal} setShowstepmodal={setShowstepmodal} />}
      {(props?.toggled == false || isNotValidNullUndefile(props?.finalSearchValue)) ? <table id="" className="paralegalTable table table-responsive border">
        <thead style={{ position: "sticky", top: "-1px", background: "white", zIndex: "1" }}>
          <tr className="bg-light">
            <th className="fw-bold">Name</th>
            {/* <th className="text-center fw-bold">Role</th> */}
            {/* <th className="text-center fw-bold">Status</th> */}
            {/* <th className="text-center">Reg. Date</th>
            <th className="text-center">In-Take-sent-On</th>
            <th className="text-center">Modified By</th>
            <th className="text-center">Modified On</th> */}
            {/* <th className="fw-bold">Status</th> */}
            <th className="fw-bold">Attorney Assigned</th>
            {/* <th className="text-center ">File Cabinet</th> */}
            <th className=" fw-bold">Assessment/RM</th>
            <th className=" fw-bold">Hand Off</th>
            <th className=" fw-bold">AR/File/Doc/AN</th>
            <th className="fw-bold">Product</th>
            <th className="fw-bold">Payment Date/Renewel Date</th>
            {/* <th className="text-center fw-bold">Documents</th> */}
            <th className=" fw-bold">Info</th>
          </tr>
        </thead>
        <tbody>{clientElement(props)}</tbody>
        
      </table> : <>
      <div className="table-responsive table-body-hidden" style={{borderRadius: "10px"}}>
        <div className="table-container" style={{borderRadius: "10px"}}>
          <div className="initialDiv1">Find a client by name, email, or phone using the search bar.</div>
          </div>
          </div>       
     </>}
      {/* <Modal show={showAiDoc} centered
            animation="false"
          >
         
            <div className=" w-100 d-flex justify-content-end">
       
             <div className="fs-3 me-3">
              {stopLoader == true ? <>
              <div className="d-flex">

                 <h5 className="m-auto">Document Generating in Progress...</h5>
                <div className="mt-2 ms-1"
              style={{
                border: '4px solid #f3f3f3',       
                borderTop: '4px solid #3498db',     
                borderRadius: '50%',                
                width: '30px',
                height: '30px',
                animation: 'spin 1s linear infinite'
                marginRight:"-5px"
              }}
            />
               </div>
        

              </>
                :<><img src="/icons/cross.png" alt="" style={{ cursor: "pointer" }} onClick={()=>setShowAiDoc(false)}/></>}
            
           

          </div>
            </div>
            <Modal.Body className="pb-5 pt-4">
          
           <div className="MainSignUp">
            <div className=" InnerSignUp w-100">
              <p className="text-center">
                <strong className="fs-4 " style={{ color: "#720c20" }}>Ai Documents</strong>
              </p>
              {isNotValidNullUndefile(aiDocuments) ? <>
                <div className="">
                  {aiDocuments?.generated_document?.length > 0 && 
                  <div className="m-3">
                    <h4 style={{fontSize:"16px"}}>Completed</h4>
                      {aiDocuments?.generated_document?.map((ele) => {
                        return (
                         <>
                            <ul style={{listStyleType:"none"}}>
                            <li>
                            <span className="" style={{fontSize:"12px"}}>
                            {ele?.file_name} - {<a style={{textDecoration: 'underline',color:'black',textDecorationColor:'red'}} href={ele?.share_link} target="_blank" rel="noopener noreferrer">{ele?.share_link}</a>}
                            </span>
                            </li>
                          </ul>
                        
                         
                            </>
                        );
                        
                      })}
                  </div>}
                  {aiDocuments?.in_progress_documents?.length > 0 &&
                  <div className="m-3">
                    <h4 style={{fontSize:"16px"}}>In-Process</h4>
                    {aiDocuments?.in_progress_documents?.map((ele) => {
                        return (
                          <>

                           <ul style={{listStyleType:"none"}}>
                            <li>
                            <span className="" style={{fontSize:"12px"}}>
                            {ele?.document_name} ------ {<a rel="noopener noreferrer">{ele?.progress_percentage}</a>}
                            </span> 
                            </li>
                          </ul>
                          </>
                         
                        );
                      })}
                    </div>}
                </div>  
              </>:""}  
           
            </div>
           </div>

            </Modal.Body>
         
          </Modal> */}
   
           
    {showSelectAvailableDocModal && <SelectAvailableDocModal showSelectAvailableDocModal={showSelectAvailableDocModal}  setShowSelectAvailableDocModal={setShowSelectAvailableDocModal} selectedDocument={selectedDocument} setSelectedDocument={setSelectedDocument}/>}
    <AiModal showAiDoc={showAiDoc} setShowAiDoc={setShowAiDoc} aiDocuments={aiDocuments} setAiDocuments={setAiDocuments} stopLoader={stopLoader} showTime={showTime} setShowTime={setShowTime}documentNameVersion={documentNameVersion}selectedDocument={selectedDocument}setSelectedDocument={setSelectedDocument} paralegal_client_name={paralegal_client_name} pathName={"Paralegal_Screen"}/>
    </div>
  );
};

// const mapDispatchToProps = (dispatch) => ({
//   dispatchloader: (loader) =>
//     dispatch({
//       type: SET_LOADER,
//       payload: loader,
//     }),
// });

// export default connect("", mapDispatchToProps)(Data);

// withFileCabinetParalegalPermissions
export default withFileCabinetParalegalPermissions(Data,'paralegalListData');
