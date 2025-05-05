import { useEffect, useState,useCallback } from "react";
import { $CommonServiceFn, $getServiceFn } from "../../../components/network/Service";
import Data from "../Datatable/Data";
import UpgradeDataTable from "../Datatable/UpgradeDataTable";

import { $Service_Url } from "../../../components/network/UrlPath";
import konsole from "../../../components/control/Konsole";
import BulkRegistration from "../Bulk/BulkRegistration";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import SignUp from "../signup/SignUp";
import { SET_LOADER } from "../../Store/Actions/action";
import { connect } from "react-redux";
import { useScreenshot } from 'use-react-screenshot'
import Feedback from "../../Feedback";
import { createSentEmailJsonForOccurrene, createSentTextJsonForOccurrene, demo, intakeBaseUrl } from "../../control/Constant";
// import ImportXML from "../CE/ImportXML";
import { isNotValidNullUndefile, postApiCall } from "../../Reusable/ReusableCom";
import AlertToaster from "../../control/AlertToaster";
import UploadImportXml from "../CE/UploadImportXml";
import moment from "moment";
import { OccurrenceApiGettemplatefun, OccurrenceApiSentMailMsg } from "../../OccurrenceHoc/withApiOccurreneFun";
import useUserIdHook from "../../Reusable/useUserIdHook";
import ImportFileButton from "../CE/ImportFileButton";
import Paralegaldata from "./Paralegaldata";
import ConvertToExcel from "../ConvertToExcel"
const headings = ["Name","Email","Cell No",	"Source"]
import { $AHelper } from "../../control/AHelper";
import { fetchProductPlans } from "../../../component/Redux/Reducers/apiSlice";
import { useAppDispatch,useAppSelector } from "../../../component/Hooks/useRedux";
import { selectApi } from "../../../component/Redux/Store/selectors";
import { update } from "@react-spring/web";

const ParalegalList = (props) => {
  const { _subtenantName, _primaryMemberUserId, _loggedInUserId } = useUserIdHook();
  const [rowsOfPage] = useState(40);
  const [sortingCol, setSortingCol] = useState("REGISTRATIONDATE");
  const [sortType, setSortType] = useState("ASC");
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [lastPage, setLastPage] = useState(2);
  const [searchText, setSearchText] = useState("");
  const [fetchByScroll, setByScroll] = useState(false);
  const [bulkopen, setBulkopen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [togglebtn, settogglebtn] = useState(false)
  const [enquiryMember, setEnquiryMember] = useState(false)
  const [emquiryMemberData, setEnquerymemberData] = useState([])
  const [filteredEnquiryMember, setFilteredEnquiryMember] = useState([])
  const [image, takeScreenshot] = useScreenshot()
  const [render, setRender] = useState(false);
  const [isAmaPayment, setIsPayment] = useState(false);
  const [isFeeAgreementPayment, setIsFeeAgreementPayment] = useState(false);
  const [isPaymentOrderId, setIsPaymentOrderId] = useState(null);
  const [isPaymentStatus, setIsPaymentStatus] = useState(null)
  const [apiCallStoper, setapiCallStoper] = useState(false);
  const loggedInUserId = sessionStorage.getItem("loggedUserId")
  const subtenantId = sessionStorage.getItem('SubtenantId');

  const [updateData, setUpdateData] = useState(false)
  const [isRotated, setIsRotated] = useState(false);
  const [excel, setExcel] = useState([])
  const [selectedCategoryIdParaList, setselectedCategoryIdParaList] = useState('Total_clients');
  const sessionRoleId = (JSON.parse(sessionStorage.getItem("stateObj"))?.roleId);
  const [isStateId, setIsStateId] = useState('1')
  const [isRender, setisRender] = useState(false)
  const [docName, setdocName] = useState('Total_clients.xlsx')
  const dispatch = useAppDispatch();
  const apiData = useAppSelector(selectApi);
  const [finalSearchValue, setFinalSearchValue] = useState('')
  const {productPlans} = apiData  
  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    getQueryParams()
    functionForAfterAmaPayment();
    fetchApi()
  
  }, [])

  useEffect(() => {
    const isSecureMode = sessionStorage.getItem('secureMode');
    const toBoolean = (value) => String(value).toLowerCase() === "true";
    setToggled(toBoolean(isSecureMode))
  }, [toggled])  

  const handleToggle = (data) => {
    setToggled(!toggled);
    sessionStorage.setItem('secureMode', !toggled);
    if(toggled == true){
      setLoading(true)
    }
  };




    const fetchApi = useCallback(() => {
      apiCallIfNeed(productPlans, fetchProductPlans());
    }, [productPlans, dispatch]);
  
    const apiCallIfNeed = useCallback((data, action) => {
      if (data.length > 0) return;
      dispatch(action);
    }, [dispatch]);

const functionHandleorderIdNStatus=(status,orderId)=>{
    setIsPaymentStatus(status)
    setIsPaymentOrderId(orderId)
  }
  const functionForAfterAmaPayment = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const trxnStatus = queryParams.get('TrxnStatus');
    const orderId = queryParams.get('OrderId');
    const amaUserEmail = sessionStorage.getItem('amaUser');
    const _isStateId = isStateId ? isStateId : sessionStorage.getItem('isStateId');
    const feeAgreementEmail = sessionStorage.getItem('feeAgreementUser');
    konsole.log("oramaUserEmailamaUserEmailderId", orderId, trxnStatus, amaUserEmail, feeAgreementEmail)
    if (isNotValidNullUndefile(orderId) && (isNotValidNullUndefile(amaUserEmail) || isNotValidNullUndefile(feeAgreementEmail))) {
      konsole.log("amaUserEmail", amaUserEmail, feeAgreementEmail, orderId, trxnStatus);
      setIsStateId(_isStateId);
      setLoading(true);
      // debugger
      if(trxnStatus != 'SUCCESS'){
        // sessionStorage.setItem("amaUser",null)
        AlertToaster.error("Payment failed. Please try again.");
      }
      functionHandleorderIdNStatus(trxnStatus,orderId)

      if (isNotValidNullUndefile(amaUserEmail)) {
        setIsFeeAgreementPayment(() => false);
        sessionStorage.setItem('amaUser', amaUserEmail);
        sessionStorage.setItem('searchItem', amaUserEmail);
        setIsPayment(() => true);
      } else if (isNotValidNullUndefile(feeAgreementEmail)) {
        setIsPayment(() => false);
        sessionStorage.setItem('feeAgreementUser', feeAgreementEmail);
        sessionStorage.setItem('searchItem', feeAgreementEmail);
        setIsFeeAgreementPayment(() => true);
      }
      const searchEmail = amaUserEmail || feeAgreementEmail;
      setSearchText(searchEmail);
      const newURL = window.location.pathname + `?toogle=2&search=` + encodeURIComponent(searchEmail)
      konsole.log("newURL", newURL)
      window.history.pushState({ path: newURL }, '', newURL);
      sessionStorage.setItem('searchItem', searchEmail);
    } else {
      setLoading(true);
      functionHandleorderIdNStatus(null,null)
      setIsPayment(false)
      setIsFeeAgreementPayment(false)
      let searchData = sessionStorage.getItem('searchItem');
      setSearchText(searchData != 'null' ? searchData : ' ')
      const newURL = window.location.origin + window.location.pathname + `?toogle=${togglebtn == true ? 1 : 2}&search=` + encodeURIComponent(searchData == null ? '' : searchData);
      if (searchData == "") {
        const url = window.location.origin + window.location.pathname;
        window.history.pushState({ path: url }, '', url);
      }
      else {
        window.history.pushState({ path: newURL }, '', newURL);
      }
    }

    setTimeout(()=>{
      setRender(!render)
    },1000)
    handleKeypress(13)
    handleSearch()
    detectPageAndPerformActions()

  }

  useEffect(() => {
  }, [isFeeAgreementPayment, isAmaPayment]);

  const detectPageAndPerformActions = () => {
    const currentPage = window.location.href;
    konsole.log("currentPage1233", currentPage, `${intakeBaseUrl}paralegal`)
    if (currentPage.includes(`${intakeBaseUrl}paralegal`)) {
      // if (currentPage.includes("http://localhost:3000/paralegal")) {
      sessionStorage.removeItem("userDetailOfPrimary");
    }
  };

  function GetQueryValues(param) {
    let url = "";
    let urlparam = [];
    url = window.location.href?.slice(window.location.href?.indexOf('?') + 1)?.split('&');
    for (let i = 0; i < url.length; i++) {
      urlparam = url[i]?.split('=');
      if (urlparam[0] == param) {
        return urlparam[1]?.split("#")?.[0] ?? "";
      }
    }
    return "";
  }


  const handlebulkregistration = () => {
    setBulkopen(!bulkopen);
  };

  useEffect(() => {
    window.onpopstate = function () {
      location.reload();
    };
  }, [])

  //code for enquiry member details---------------------------------------------------------------
  useEffect(() => {
    props?.setEnquiryMemberShow(enquiryMember)
  }, [enquiryMember])
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const trxnStatus = queryParams.get('TrxnStatus');
    if (trxnStatus) {
      setEnquiryMember(true)
      setLoading(true)
      settogglebtn(true)
    }
  }, [])

  function getQueryParams() {

    const queryParams = new URLSearchParams(window.location.search);
    const trxnStatus = queryParams.get('TrxnStatus');
    const orderId = queryParams.get('OrderId');
    konsole.log("trxnStatustrxnStatus",trxnStatus,orderId)
    // Using for upgrading member to intake after payment by card
    let upgradedMemberMail =JSON.parse(sessionStorage.getItem('enquirymemberDetails'));
    if(trxnStatus == 'SUCCESS' && isNotValidNullUndefile(upgradedMemberMail)){
      konsole.log("upgradedMemberMail",upgradedMemberMail)
      upsertPlannerBook(orderId,upgradedMemberMail)
      // CallAfterUpgrade(upgradedMemberMail?.emailAddress)
      // sessionStorage.setItem('enquirymemberDetails',null)
    }
  }

  const upsertPlannerBook = (orderId,upgradedMemberMail) => {
    konsole.log('Planner Upsert');
    const upsertJson = [{
      plannerAppId: 0,
      seminarAttendeeId: upgradedMemberMail?.seminarAttendeeId, // # Member  seminar id
      billTrackNo: orderId, // orderid 
      paymentStatusId: 1, // payment status id
      paymentStatusDate: new Date(),
      isActive: true,
      upsertedBy: loggedInUserId //# Member Login User ID
    }];

    konsole.log('upsertJson', upsertJson);
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.upsertPlannerBooking, upsertJson, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('upsertPlannerBooking', res)
        let responseData = res?.data?.data
        updatePlannerBookingStatus(responseData,upgradedMemberMail)
      } else {
        konsole.log("upsertPlannerBooking", err)
      }
    });
  };

  const updatePlannerBookingStatus = (responseData,upgradedMemberMail) => {
    if (responseData.legth == 0) return;
    let { plannerAppId, seminarAttendeeId } = responseData[0]
    const bookingStatusDate = moment(new Date().toISOString())._i
    let updateStatusJson = {
      "plannerAppId": plannerAppId,
      "seminarAttendeeId": seminarAttendeeId,
      "plannerCalId": null,
      "bookingStatusId": 7, // 6 or 1
      "bookingStatusDate": bookingStatusDate,
      "updatedBy": loggedInUserId //# Member Login User ID
    }
    konsole.log("updateStatusJson", updateStatusJson)

    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.updatePlannerBookingStatus, updateStatusJson, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('updatePlannerBookingStatus', res)
        let responseData = res.data.data
        let seminarAttendiUserId = responseData?.seminarAttendeeUserId
        userAddRoles(seminarAttendiUserId,upgradedMemberMail)
      } else {
        konsole.log("updatePlannerBookingStatus", err)
      }
    })
  }

  const userAddRoles = (seminarAttendiUserId,upgradedMemberMail) => {

    let rolesAddJson = {
      "loginUserId": upgradedMemberMail?.loginUserId, // # Member LogIn ID from stateobj
      "subtenantId": subtenantId, // login member subtenent id
      "roleId": 1, // role id for adding role
      "isActive": true,
      "createdBy": loggedInUserId // # Member Login User ID
    }

    konsole.log('rolesAddJsonrolesAddJson', rolesAddJson)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postUserRole + seminarAttendiUserId, rolesAddJson, (res, err) => {
      if (res) {
        konsole.log('postUserRole', res)
        userActivationLink(seminarAttendiUserId,upgradedMemberMail)
      } else {
        userActivationLink(seminarAttendiUserId,upgradedMemberMail)
        konsole.log('postUserRole', err)
      }
    })
  }

  const userActivationLink = (seminarAttendiUserId,upgradedMemberMail) => {
    let activationJson = {
      "userRegstrtnId": upgradedMemberMail?.loginUserId,// # Member LogIn ID from stateobj
      "userId": seminarAttendiUserId, // #Client User id
      "signUpPlatform": upgradedMemberMail?.signUpPlatform,
      "createdBy": loggedInUserId, // # Member Login User ID
      "clientIPAddress": ""
    }
    konsole.log('activationJson', activationJson)
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.getUserActivationLink, activationJson, (res, err) => {
      if (res) {
        konsole.log('getUserActivationLink', res)
        let responseData = res?.data?.data
        // activationURL
        apiCallOccurrene(upgradedMemberMail, responseData?.activationURL);
        // setUniqueLink(responseData?.activationURL)
        konsole.log('responseData', responseData)
        // CallAfterUpgrade(upgradedMemberMail?.emailAddress)
      } else {
        props.dispatchloader(false)
        konsole.log('getUserActivationLink', err)
      }
    })
  }

  const getEnqueryMember = ( calledAfterEdit ) => {
    if(apiCallStoper) return;
    setapiCallStoper(true);
    let SubtenantId = sessionStorage.getItem("SubtenantId")
    props.dispatchloader(true);
    $getServiceFn.getEnqurieMemberlist(SubtenantId, (res, err) => {
      setapiCallStoper(false);
      if (res) {
        props.dispatchloader(false);
        const response = res.data?.data;
        konsole.log('getEnqurieMemberlist', response)
        setFilteredEnquiryMember(response)
        setEnquerymemberData(response);
        const headings = ["Name","Email","Cell No",	"Source"]      
        const excelArray = response?.map((data) => {
          return {
            "Name": data?.attendeeFullName,
            "Email": data?.emailAddress,
            "Cell No":`${$AHelper.newPhoneNumberFormat(data?.mobileNo)}`,
            "Source": data?.seminars?.[0]?.seminarTopic,
          };
        });
        setExcel(excelArray)
        props.dispatchloader(false);
      }
      else {
        konsole.log("contract error", err);
        props.dispatchloader(false);
      }
    })
    if(calledAfterEdit === true) setUpdateData(oldState => !oldState);

  }
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
    link.download =`${(selectedCategoryIdParaList=="Total AMA")?`AMA Clients`:`${selectedCategoryIdParaList} Clients`}` ;
    link.click();
  }


  const getMembersByParealegalIdAll=()=>{
    if (apiCallStoper) return;
    setapiCallStoper(true);
    props.dispatchloader(true);
    let inputData = {
      paraLegalId: loggedInUserId,
      pageNumber: "1",
      rowsOfPage: "50000",
      sortingCol: "REGISTRATIONDATE",
      sortType: "ASC",
      searchingCol: "NAME",
      searchingText:null,
      
    };
    inputData={...inputData,...(selectedCategoryIdParaList=="Total AMA")?{"isAMA": true}:{'roleId':(selectedCategoryIdParaList=='Intake')?'1,10':(selectedCategoryIdParaList=='LPO')?'9':null}}
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getDocMembersByParalegalId, inputData, (response, errorData) => {
      setapiCallStoper(false);
      props.dispatchloader(false);
      konsole.log("response client", response);
      const apiResponse = response?.data?.data;
      showDocxFile("totalIntakeCientList", apiResponse);
      setByScroll(false);
      setLoading(false);
    }
    );
  }

  const apiCallFun=()=>{
    if(selectedCategoryIdParaList=="Total Prospect Members"){
      getEnqueryMember()
    }else{
      getMembersByParealegalIdAll(selectedCategoryIdParaList)
    }
  }
  //code for enquiry member details---------------------------------------------------------------



  useEffect(() => {
    const isStateIdBySession = sessionStorage.getItem('isStateId');
    if (isStateIdBySession != '999999') { 
      if(isNotValidNullUndefile(isStateIdBySession)){
        callapidata("","","",isStateIdBySession,undefined,selectedCategoryIdParaList);
        
      }else{
        callapidata("","","",isStateId);
      }
      
    } else {
      if (emquiryMemberData.length > 0) {
        props.dispatchloader(true);
        const filteredData = emquiryMemberData.filter((item) => (item?.emailAddress?.toLowerCase()?.includes(searchText?.toLowerCase()) || item?.mobileNo?.includes(searchText) || item?.attendeeFullName?.toLowerCase()?.includes(searchText?.toLowerCase())));
        konsole.log("searchtext values", filteredData, searchText)
        props.dispatchloader(false);
        setFilteredEnquiryMember(filteredData);
        setLoading(false)
      } else {
        getEnqueryMember()
      }
    }
    if(loading==true){
      setUpdateData(true)
    }
  }, [sortingCol, pageNumber, loading,isStateId,selectedCategoryIdParaList,toggled]);


   const isSubsId = (newId)=>{
    if(newId == 'null' || newId == 0){
      return null
    }
    let stateID = newId == 999999 ? 1 : newId
    if(newId == 999999){
      setIsStateId(stateID)
      sessionStorage.setItem("isStateId", stateID);
    }   
      return stateID
   }


   const callapidata = async (UpgradedClientMail, filterData, id, newId, forcefulServicePlanId,fileNames) => {
     const loggedUserId = sessionStorage.getItem("loggedUserId");
     const searchText = decodeURIComponent(GetQueryValues("search"));
     const feeAgreementEmail = sessionStorage.getItem('feeAgreementUser') || sessionStorage.getItem('searchItem');
     const _pageNumber = fetchByScroll ? pageNumber : 1;
     const searchingVal = isNotValidNullUndefile(UpgradedClientMail) ? UpgradedClientMail : searchText ? searchText : feeAgreementEmail ? feeAgreementEmail : '';
     setSearchText(decodeURI(searchingVal));
    let inputData = {
      paraLegalId: loggedUserId,
      pageNumber: _pageNumber,
      rowsOfPage: rowsOfPage,
      sortingCol: sortingCol,
      sortType: sortType,
      searchingCol: "NAME",
      searchingText: searchingVal || null,
      servicePlanId: forcefulServicePlanId ?? (isSubsId(newId) == null ? isSubsId(newId) : isSubsId(newId)) ?? (isStateId == 0 ? null : isStateId),
      ...((filterData || headerScrollInfo) && {
        ...(filterData === 'Total_clients' || headerScrollInfo === 'Total_clients' ? {} : fetchByScroll == true ? headerScrollInfo : filterData),
        ...(isNotValidNullUndefile(filterData) ? { pageNumber: 1 } : {})
      })
    };
  
    // konsole.log("bnbnvbncJSON", inputData, forcefulServicePlanId ?? (isSubsId(newId) == null ? isSubsId(newId) : isSubsId(newId)) ?? (isStateId == 0 ? null : isStateId));
  
    if (UpgradedClientMail || loading || filterData) {
      if (apiCallStoper) {
        setClient([]);
        setUpdateData(prev => !prev);
        return;
      }
      
      inputData = {...inputData,...(fileNames == "Total AMA" ? { isAMA: true } : fileNames == "LPO" ? { roleId: "9" } : fileNames === "Intake" ? { roleId: "1,10" }: {}),
        ...(isNotValidNullUndefile(isStateId) && !isNotValidNullUndefile(searchingVal) ? { servicePlanId: 1 } : {})
      };
      setapiCallStoper(true);
      props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi(
          "POST",
          $Service_Url.getMembersByParalegalIdPathV2,inputData,
          (response)=>{
        const clientResponse = response?.data?.data?.clients || [];
        setClient([])
        let updatedClient = fetchByScroll ? [...client, ...clientResponse] : clientResponse;
        if(isNotValidNullUndefile(searchingVal) && toggled == true){
          setFinalSearchValue(searchingVal)
        }
        if (fetchByScroll) {
          setLastPage(clientResponse.length ? _pageNumber + 1 : _pageNumber);
          setClient(updatedClient);
          setByScroll(false);
        } else {
          setClient(updatedClient);
          setUpdateData(prev => !prev);
          setByScroll(false);
          setLoading(false);
          // if (_pageNumber !== pageNumber) setPageNumber(_pageNumber);
        }
        setapiCallStoper(false);
        props.dispatchloader(false);
        // setLoading(false);
        // setUpdateData(prev => !prev);
        // konsole.log(clientResponse,"clientResponse",updatedClient,"updatedClient",response?.data?.data?.clients,"fetchByScroll",fetchByScroll,"inputData",inputData)
      })
    }
  
    konsole.log("API Call Completed", { inputData, sortType });
  };
  

  konsole.log("dxzczXCz", pageNumber, lastPage)

  const handlechange = (event) => {
    const eventId = event.target.id;
    const eventValue = event.target.value;

    switch (eventId) {
      case "sortingCol":
        setLoading(true);
        setPageNumber(1);
        setLastPage(2);
        setSortingCol(eventValue);
        // if(eventValue == 'NAME'){
        //     const data = client.sort((a, b) => a.memberName.localeCompare(b.memberName));
        //     konsole.log("dataog", data);
        //     setClient(data);
        // }
        // setSortingCol(eventValue);
        break;
    }
  };


  const scrollCallBack = (e) => {
    const node = e.target;
    // konsole.log("scroll occurs", e.target);

    if (node) {
      const { scrollTop, scrollHeight, clientHeight } = node;
      // const scrollScreen = scrollTop + clientHeight / 1.1;
      // // if (Math.ceil(scrollTop + clientHeight) === (scrollHeight)) {
      // if ((scrollScreen >= scrollHeight / 1.15) && lastPage > pageNumber) {
      //   setByScroll(true);
      //   setPageNumber(pageNumber + 1);
      //   setLoading(true);
      // }
      const scrollScreen = scrollTop + clientHeight;
      // konsole.log(`bdhcbqbjhcqbj (${scrollTop} + ${clientHeight}) =  ${scrollScreen} >= ${scrollHeight}, ${lastPage} , ${pageNumber}`)
      if (Math.ceil(scrollScreen) >= scrollHeight && lastPage > pageNumber) {
        setByScroll(true);
        setPageNumber(pageNumber + 1);
        setLoading(true);
      }
    }
  };


  const callApiAgain = () => {
    setLoading(true);
  }

  const handleIconClick = () => {
    const newIsRotated = !isRotated;
    setIsRotated(newIsRotated);
    const newSortType = newIsRotated ? "DESC" : "ASC";
    setSortType(newSortType);
    setLoading(!loading);
    callapidata();
  };

  const handleSearch = () => {
    setPageNumber(1);
    if (isStateId == '999999') {
      setLoading(!loading);
    } else {
      setLoading(true);

    }
  };

  const CallAfterUpgrade = (UpgradedClientMail, _isStateId) => {
    if(_isStateId) setIsStateId(_isStateId);
    settogglebtn(false)
    // setLoading(true)
    setselectedCategoryIdParaList("Total_clients")
    setEnquiryMember(false)
    setSearchText(UpgradedClientMail)
    const newURL = window.location.origin + window.location.pathname + `?toogle=${2}&search=` + encodeURIComponent(UpgradedClientMail);
    sessionStorage.setItem('searchItem',UpgradedClientMail)
    konsole.log("UpgradedClientMail",UpgradedClientMail)
    setByScroll(false);
    callapidata(UpgradedClientMail, undefined, undefined, undefined, _isStateId || undefined);
    window.history.pushState({ path: newURL }, '', newURL);
    sessionStorage.setItem('enquirymemberDetails',null)

  }

  const ChangeData = (e) => {
    const id = e.target.value
    const url = window.location.origin + window.location.pathname;
    window.history.pushState({ path: url }, '', url);
    settogglebtn(e.target.checked)
    setisRender(!isRender)
   
         
      if(id == 'Prospect' || id == 999999){
        setIsStateId("999999");
        sessionStorage.setItem("isStateId", "999999");
      }
      if((id != 999999) && (id !== 'Prospect')){
        setIsStateId(id);  
        setPageNumber(1)
        // callapidata("","","",id,"");
        setHeaderScrollInfo('');
        callapidata("","Total_clients","",id,undefined,"Total_clients");
        sessionStorage.setItem("isStateId", id);
      }
      

 
    setLoading(!loading)
    setSearchText("")
    if(e.target.checked == true){
      getEnqueryMember()
    }
  }
  const handleKeypress = (e) => {
    if (e.which === 13) {
      setPageNumber(1);
      if(isNotValidNullUndefile(e.target?.value) || toggled == false){
        setLoading(!loading)}
        else{
          AlertToaster.warn("Empty search is not allowed when Secured Mode is enabled.")
        }
        setLastPage(2);
    
    }
  };

  const NewRegistration = () => {
    konsole.log("workingDataData");
    setOpenModal(!openModal);
    setUpdateData(!updateData)
  };

  const clearSearch = () => {
    setSearchText('');
    setFinalSearchValue('')
    const url = window.location.origin + window.location.pathname;
    window.history.pushState({ path: url }, '', url);
    sessionStorage.setItem('searchItem', '');
    if(toggled == false){setLoading(!loading)};
    // callapidata();
    const isStateIdBySession = sessionStorage.getItem('isStateId');
    if(isNotValidNullUndefile(isStateIdBySession) && toggled == false){
      setIsStateId(isStateIdBySession)
      callapidata("","","",isStateIdBySession,undefined,selectedCategoryIdParaList);
    }else{
       if(toggled == false){
         callapidata("","","",isStateId);
       }
    }
  };


  const [headerScrollInfo,setHeaderScrollInfo]=useState('');
  const handleHeaderValue=(val)=>{
    setHeaderScrollInfo(val) 
  }

  // @@ function for api call based on header tile click selection like, all memebrs, AMA etc
  const apiCallFromParalegalDataHeader = (info,newId,fileNames) => {
    setdocName(`${fileNames?.Title}.xlsx`)
        setSearchText("")
    if (info !== 'Prospect') {
      setEnquiryMember(false);
      sessionStorage.setItem("isStateId", newId);
      setByScroll(false)
      setPageNumber(1)
      callapidata('', info,'',newId,undefined,fileNames?.Id);
      // if(fetchByScroll == true){
      setHeaderScrollInfo(info);
      // }
    } else {
      let e = { target: { checked: true, value: "Prospect" } };
      ChangeData(e);
      setHeaderScrollInfo('')
    }
  }
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const toogleValue = searchParams.get('toogle')
    const toogleValueType = (toogleValue == null || toogleValue == 2) ? false : true
    settogglebtn(toogleValueType)
    setEnquiryMember(toogleValueType)
    setLoading(!loading)
    // const trxnStatus = queryParams.get('TrxnStatus');
  }, [])

  const getImage = () => {
    takeScreenshot(document.body)
    konsole.log("screenshot taken", document.body)
  }

  const replaceTemplate = (temp, uniqueLink) => {
    let TemplateContent = temp;
    TemplateContent = TemplateContent.replaceAll("@@SUBTENANTNAME", _subtenantName)
    TemplateContent = TemplateContent.replaceAll("@@UNIQUELINK", uniqueLink)
    konsole.log('TemplateContentTemplateContent', TemplateContent)
    return TemplateContent;
  }

  const apiCallOccurrene = async (upgradedMemberMail, uniqueLink) => {
    props.dispatchloader(true);
    let _resultOfTemplate = await OccurrenceApiGettemplatefun(29);
    konsole.log("_resultOfTemplateResult", _resultOfTemplate)
    if (_resultOfTemplate == 'err') return;

    const { textTemplateType, textTemplateId } = _resultOfTemplate?.textObj.textTempData[0]
    const { templateType, emailSubject, templateId } = _resultOfTemplate?.emailObj?.emailTempData[0];

    let emailTo = upgradedMemberMail?.emailAddress
    // let emailTo = "nitinkumarja@mailinator.com"
    const emailJson = createSentEmailJsonForOccurrene({
      emailType: templateType,
      emailTo: emailTo,
      emailSubject,
      emailContent: replaceTemplate(_resultOfTemplate?.emailObj.emailTemp, uniqueLink),
      emailTemplateId: templateId,
      emailMappingTablePKId: upgradedMemberMail?.userId,
      createdBy: _loggedInUserId
    })
    let textTo = upgradedMemberMail?.mobileNo
    const mobileJson = createSentTextJsonForOccurrene({
      smsType: textTemplateType,
      textTo: textTo,
      textContent: replaceTemplate(_resultOfTemplate?.textObj?.textTemp, uniqueLink),
      smsTemplateId: textTemplateId,
      smsMappingTablePKId: upgradedMemberMail?.userId,
      createdBy: _loggedInUserId
    })
    konsole.log("mobileJsonEmail", mobileJson, emailJson, _resultOfTemplate.commChannelId);
    const _resultOfSentEmailOrMsg = await OccurrenceApiSentMailMsg(_resultOfTemplate.commChannelId, emailJson, mobileJson);
    konsole.log("_resultOfSentEmailOrMsg", _resultOfSentEmailOrMsg)
    getEnqueryMember( true );
    props.dispatchloader(false);
    CallAfterUpgrade(upgradedMemberMail?.emailAddress);
  }
  return (
    <div>
      <div className="ms-3" style={{ position: "sticky", top: "100" }}>
        {bulkopen ? (
          <BulkRegistration
            bulkopen={bulkopen}
            handlebulkregistration={handlebulkregistration}
            callapidata={callapidata}
          />
        ) : (
          ""
        )}
        <div className="row no-gutters justify-content-between mt-0"
          style={{
            position: "fixed", width: "97%",
            top: "118px",
            backgroundColor: '#fff',
          }}
        >
          <Paralegaldata handleClickApi={apiCallFromParalegalDataHeader} subtenantId={subtenantId} updateData={updateData} selectedCategoryIdParaList={selectedCategoryIdParaList} setselectedCategoryIdParaList={setselectedCategoryIdParaList} enquiryMember={enquiryMember}isStateId={isStateId}isRender={isRender}/>
          <div className="col-6 col-lg-6 m-0 p-0 d-flex gap-3">
            <div className="col-3">
              <select className="custom-selectparalegal ps-3" name="head-select" id="sortingCol"
                onChange={ChangeData}
                value={isStateId}
                style={{
                  borderColor: "#333333",
                  color: "#FFFFFF",
                  height: "42px",
                  backgroundColor: "#333333"
                }}
              >  
              <option value="0" disabled>Select plan</option>
              {isNotValidNullUndefile(productPlans) && productPlans !== "err" && productPlans.length > 0 && productPlans.map((ele)=>(
                  <option value={ele?.value}>{ele?.label}</option>
              ))}
                {Array?.isArray(productPlans) && productPlans?.length > 0 && (
                    <option value="999999">Prospective Clients</option>
                  )}
              </select>
              {/* <label className={`${(togglebtn == true) ? "toggle1" : "toggle2"} toggle`} style={{ marginTop: "1.2rem" }} >
                  <input type="checkbox"
                    onChange={ChangeData}
                    checked={enquiryMember} />
                  <span class="slider"></span>
                  <span class="labels" data-on="Inquiry" data-off="Intake"></span>
                </label> */}
            </div>
            <div className="col-8 ml-0 mr-0 mb-0 d-flex border rounded" style={{ margin: "0px 0px 0px 0px !important" }}>
              <div className="d-flex align-items-center col-9" style={{background: '#EFF1F3', border:'1px solid #EFF1F3',}}>
                <img
                  src="icons/searchParalegalIcon.svg"
                  alt="Profile "
                  className="cursor-pointer mt-0 p-2 mx-2"
                  onClick={handleSearch}
                  style={{
                    // position: "relative",
                    width: "25px", height: "25px", backgroundColor: "#EFF1F3",

                    // border: "1px solid black",
                    // borderStyle: "solid solid solid none",
                    // borderRadius: "0px 10px 10px 0px",
                  }}
                ></img>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => {
                  if(apiCallStoper) return;
                    setSearchText(e.target.value);
                    const newURL = window.location.origin + window.location.pathname + `?toogle=${togglebtn == true ? 1 : 2}&search=` + encodeURIComponent(e.target.value);
                    if (e.target.value == "") {
                      const url = window.location.origin + window.location.pathname;
                      window.history.pushState({ path: url }, '', url);
                      // sessionStorage.setItem('searchItem', '')
                    }
                    else {
                      window.history.pushState({ path: newURL }, '', newURL);
                      setIsStateId(0)
                      sessionStorage.setItem("isStateId", null);
                    }
                    sessionStorage.setItem('searchItem', e.target.value)
                  }}
                  onKeyPress={handleKeypress}
                  placeholder="Search.. "
                  className="header-search p-1"
                  style={{
                    height: "40px",
                    width: "100%",
                    // position:'absolute',
                  border:'none',
                  background:"#EFF1F3"
                    // border: "1px solid black",
                    // borderStyle: "solid none solid solid",
                    // borderRadius: "10px 0px 0px 10px",
                  }}
                ></input>
              <div className='vr h-50 align-items-center mt-3' style={{background:'#838383'}}></div>
                {searchText && (
                  <div className="ms-3">
                <img class="m-0 cursor-pointer" src="icons/crossIcon.svg" style={{width:'10px'}} onClick={()=>clearSearch()} alt="Clear search" />
                  </div>
                )}
              </div>
              <div className="col-3" >
                <div className="mt-lg-0">
                  <select className="changeselecticon pt-2 custom-selectparalegal ps-4" name="head-select" id="sortingCol"
                    onChange={handlechange}
                    style={{
                      borderColor: "#EFF1F3",
                      color: "#838383",
                      height: "42px",
                      backgroundColor:"#EFF1F3",
                      fontSize:'12px',
                    }}
                  >
                    <option value="-1">SORT BY</option>
                    <option value="NAME">Name</option>
                    {/* <option value="STATUS">Status</option> */}
                    <option value="REGISTRATIONDATE">Reg. Date</option>
                    {/* <option value="INTAKESENDON">In-Take-sent-On</option> */}
                    {/* <option value="MODIFIEDBY"> Modified By</option> */}
                    {/* <option value="MODIFIEDON">Modified On</option> */}
                  </select>
                </div>
              </div>
              <div className="ms-3 d-flex align-items-center">
                <div>
                  <img
                    className="cursor-pointer"
                    src="icons/AscDescIcon.svg"
                    style={{ width: '20px', transform: isRotated ? 'rotate(0deg)' : 'rotate(180deg)' }}
                    alt="Toggle Icon"
                    title={isRotated ? 'Descending' : 'Ascending'}
                    onClick={handleIconClick}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-6 m-0 p-0">
            <div className="d-flex justify-content-end gap-4">
              <div className="mt-auto mb-auto">
              <div className='mt-auto mb-auto ms-3  W-50' onClick={()=>handleToggle(toggled)}>
                <div className={`toggles-switch ${toggled ? 'active' : ''}`} >
                  <div className="toggles-thumb" />
                  <span className="toggles-label" >{'Secure Mode'}</span>
                </div>
                </div>
              </div>
               
              <div className="cursor-pointer" onClick={NewRegistration} >
                <OverlayTrigger placement='top' overlay={<Tooltip>New Registration</Tooltip>}>
                <div className="NewRegImg mt-lg-0">
                 <img className="cursor-pointer" src='icons/NewRegIcon.svg' alt="NewReg" />                
              </div>
                 </OverlayTrigger>
              </div>

              <div className="cursor-pointer" onClick={handlebulkregistration}  >
                <OverlayTrigger placement='top' overlay={<Tooltip>Bulk Registration</Tooltip>}>
                <div className="NewRegImg mt-lg-0" >
                    <img className="cursor-pointer" src='icons/BulkIcon.svg' alt="Bulk"  />
              </div>
                    </OverlayTrigger>

              </div>
              {/*______________________________________________ Import XML ______________________________________________ */}
              {/* <ImportXML /> */}
              {/* <ImportBulkXML /> */}
              {/* <UploadImportXml callapidata={callapidata} callhandleSearch={handleSearch} /> */}
                <ImportFileButton  callhandleSearch={handleSearch} />
               {sessionRoleId==13 && <ConvertToExcel data={excel} headings={headings} pName={docName} apiCallFun={apiCallFun} selectedCategoryIdParaList={selectedCategoryIdParaList}/>}

              {/*______________________________________________ Import XML ______________________________________________ */}
            </div>
          </div>
        </div>
      </div>


      <div
        style={{
          position: "relative",
          top: "240px",
          // background:"none",
          //  overflow:"auto",
          // height: "100vh",
          zIndex: '1',

        }} className="mt-paratable pt-md-2 pt-xl-2">
        {
         isStateId != 999999 ? 
          <Data key={isAmaPayment} dispatchloader={props.dispatchloader} isPaymentStatus={isPaymentStatus} isPaymentOrderId={isPaymentOrderId} functionHandleorderIdNStatus={functionHandleorderIdNStatus} client={client} setClient={setClient} isAmaPayment={isAmaPayment} isFeeAgreementPayment={isFeeAgreementPayment} onScrollBack={scrollCallBack} loading={loading} callapidata={callApiAgain}isStateId={isStateId}toggled={toggled}finalSearchValue={finalSearchValue} /> :
          <UpgradeDataTable client={client} onScrollBack={scrollCallBack} getEnqueryMember={getEnqueryMember} loading={loading} callapidata={callApiAgain} memberData={filteredEnquiryMember} CallAfterUpgrade={CallAfterUpgrade} selectedCategoryIdParaList={selectedCategoryIdParaList} setselectedCategoryIdParaList={setselectedCategoryIdParaList} />}
      </div>

      {(props?.showFeedbackBtn != false) &&
        <Feedback getImage={getImage} image={image} classNameLocal="positionFeedBackButton" />}



      {/* </div> */}


      {openModal && (
        <>
          <Modal
            show={openModal}
            // size="lg"
            centered
            // fullscreen

            // onHide={NewRegistration}
            animation="false"
          >
            {/* <Modal.Header style={{color: }}>

            <Modal.Title>Accountant</Modal.Title>
          </Modal.Header> */}
            <div className=" w-100 d-flex justify-content-end"


            >
              <div
                className="fs-3 me-3"
                style={{ cursor: "pointer" }}
                onClick={NewRegistration}
              >
                <img src="/icons/cross.png" alt="" />
              </div>
            </div>
            <Modal.Body className="pb-5 pt-4">
              <SignUp setOpenModal={setOpenModal} callapidata={callapidata} />
            </Modal.Body>
            {/* <Modal.Footer className="border-0">
            <Button className="theme-btn" >
              Save
            </Button>
          </Modal.Footer> */}
          </Modal>
        </>
      )}


    </div>
  );
};






const mapStateToProps = state => ({ ...state.main });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps, mapDispatchToProps)(ParalegalList)
