import React, { useState, useRef, useEffect, useContext, useMemo } from 'react'
import { Button, Modal, Table, Row, Col, Form } from "react-bootstrap";
import konsole from '../../control/Konsole';
import { SET_LOADER } from "../../../components/Store/Actions/action";
import { connect } from "react-redux";
import Select from 'react-select';
import AlertToaster from '../../control/AlertToaster';
import SignatureCanvas from 'react-signature-canvas';
// import ReactToPrint from 'react-to-print';
import { $CommonServiceFn, $postServiceFn, Services } from "../../../components/network/Service";
import { $Service_Url, Api_Url } from "../../../components/network/UrlPath";
import { getApiCall, getSMSNotificationPermissions, isNotValidNullUndefile, isNullUndefine, postApiCall, postUploadUserDocumant, recurringErrorHandled, getNextInstallmentDate } from '../../Reusable/ReusableCom';
import FeeAgreementPayment from '../Datatable/FeeAgreement/FeeAgreementPayment';
import { useRouter } from 'next/router';
import { cabinetFileCabinetId, categoryFileCabinet, specificFolderName, createJsonUploadFileV2, createFileCabinetFileAdd, cretaeJsonForFilePermission, logoutUrl, createSentTextJsonForOccurrene, createSentEmailJsonForOccurrene, jsonForFiduciaryAssesmentadd } from '../../control/Constant';
import { $JsonHelper } from '../../../component/Helper/$JsonHelper';
import FileViewer from '../../newFileCabinet2/FileViewer';
import PdfViewDocument from '../Datatable/PdfViewDocument';
import withFileCabinetParalegalPermissions from '../../HOC/withFileCabinetParalegalPermissions';
import { $AHelper } from '../../control/AHelper';
import { $AHelper as $oldhelper } from '../../control/AHelper';
import OccurrenceModal from '../../OccurrenceHoc/OccurrenceModal';
import { CustomCheckBox, CustomInput, CustomRadio, CustomRadioMultiChecked, CustomSearchSelect } from '../../../component/Custom/CustomComponent';
import { globalContext } from '../../../pages/_app';

const firmProvidedServicesObject = {
  'A': {
      Checked: false,
      Description: 'Develop and Draft “LifePlan” Assessment Letter providing Client with coordinated retirement options for health, housing, financial, legal, and family issues;',
  },
  'B': {
      Checked: false,
      Description: 'Follow-up meeting with attorney to review the options presented in the LifePlan Assessment Letter and develop your individualized LifePlan Roadmap and customized estate plan documents;',
      // Description: <span>Follow-up meeting with attorney to review the options presented in the <em>LifePlan</em> Assessment Letter and develop your individualized <em>LifePlan</em> Roadmap and customized estate plan documents;</span>
  },
  'C': {
      Checked: false,
      Description: 'Draft Last Will(s) and Testament(s), inclusive of:',
      subFirmProvidedServiceObject: {
          'C-1': {
              Checked: false,
              Description: 'Safe Harbor Trusts;',
          },
          'C-2': {
              Checked: false,
              Description: 'Contingent Trusts for Minors;',
          },
          'C-999999': {
            Checked: false,
            Description: 'Other: ',
            EditableDescription: '',
          },
      },
  },
  'D': {
      Checked: false,
      Description: 'Draft Revocable Living Trust, Pour Over Will, Certificate of Trustee Authority, Billfold Card, and other related documents;',
  },
  'E': {
      Checked: false,
      Description: 'Draft Stand-Alone Safe Harbor Trust(s);',
  },
  'F': {
      Checked: false,
      Description: 'Draft Power(s) of Attorney:',
      subFirmProvidedServiceObject: {
          'F-1': {
              Checked: false,
              Description: 'Durable Power(s) of Attorney for Finances;',
          },
          'F-2': {
              Checked: false,
              Description: 'Durable Power(s) of Attorney for Healthcare;',
          },
          'F-3': {
              Checked: false,
              Description: 'Limited Power(s) of Attorney;',
          },
      },
  },
  'G': {
      Checked: false,
      Description: 'Draft Living Will(s);',
  },
  'H': {
      Checked: false,
      Description: 'Draft Directive(s) for Handling of Remains, HIPAA Release, and Mental Health Advance Directive;',
  },
  'I': {
      Checked: false,
      Description: 'Revoke and record Revocation of Community Property Agreements (recording fees not included);',
  },
  'J': {
      Checked: false,
      Description: 'Prepare personalized document packets for client and listed agents;',
  },
  'K': {
      Checked: false,
      Description: 'Conduct family meeting;',
  },
  'L': {
      Checked: false,
      Description: 'Draft Beneficiary Designation Letters and Instructions;',
  },
  'M': {
      Checked: false,
      Description: 'Fund Trust to include drafting of one (1) Washington deed, real estate excise tax affidavit, assignment of personal property, and trust funding instructions;',
  },
  'N': {
    Checked: false,
    Description: 'Additional ___________ Washington deeds ($350 each plus recording fees);',
    EditableDescription: '',
  },
};

const thirdPartyProvidedObject = {
  'A': {
    Checked: false,
    Description: 'Client home safety evaluation;',
    serviceProvider: 'OTPlus',
    curCost: "750.00",
    costOptions: [ '750.00', 'Waived' ]
  },
  'B': {
    Checked: false,
    Description: 'Perform IRA to ROTH IRA analysis;',
    serviceProvider: 'Better Retirement Plan',
    curCost: "500.00",
    costOptions: [ '500.00', 'Waived' ]
  },
  'C': {
    Checked: false,
    Description: 'Provide in-depth “Financial Dashboard”;',
    serviceProvider: 'Better Retirement Plan',
    curCost: "2500.00",
    costOptions: [ '2500.00', 'Waived' ]
  },
  'D': {
    Checked: false,
    Description: 'Housing Assistance;',
    serviceProvider: 'Better Care Management',
    curCost: "1500.00",
    costOptions: [ '1500.00', 'Waived' ]
  },
  'E': {
    Checked: false,
    Description: 'Finding Geriatrician;',
    serviceProvider: 'Better Care Management',
    curCost: "1500.00",
    costOptions: [ '1500.00', 'Waived' ]
  },
  'F': {
    Checked: false,
    Description: 'Nursing Assistance, Care Plan, Summary Letter;',
    serviceProvider: 'Better Care Management',
    curCost: "1500.00",
    costOptions: [ '1500.00', 'Waived' ]
  },
  'G': {
    Checked: false,
    Description: 'WA county recording fees (deeds, etc.);',
    serviceProvider: 'County Recorder',
    curCost: "1000.00",
    costOptions: [ '1000.00', 'Waived' ]
  },
  'H': {
    Checked: false,
    Description: 'Filing Fees for LLC, Partnership, etc.;',
    serviceProvider: 'Sec. of State',
    curCost: "1000.00",
    costOptions: [ '1000.00', 'Waived' ]
  },
  'I': {
    Checked: false,
    Description: 'Out-of-state deeds;',
    serviceProvider: 'Cost Deposit',
    curCost: "1000.00",
    costOptions: [ '1000.00', 'Waived' ]
  }
};  

const today = new Date();
const sevenDaysLater = new Date();
sevenDaysLater.setDate(today.getDate() + 7);
const formattedSevenDaysLater = sevenDaysLater.toISOString().split("T")[0];

const oneYearLater = new Date();
oneYearLater.setDate(today.getDate() + 365);
const formattedOneYearLater = oneYearLater.toISOString().split("T")[0];

const NonCrisisFeeAgreement = ({ clientData, orderIDFromUrl, transactionStatus, setOrderIDFromUrl, setTransactionStatus, primaryEmailAddress, skuListNames: propsSkuListNames, showFeeAgreementModal, dispatchloader, openAnnualModalFileTable, FeeAgreement, showHourlyBody: propShowHourlyBody, setShowHourlyBody: propSetShowHourlyBody, showFlatFeeBody: propShowFlatFeeBody, setShowFlatFeeBody: propSetShowFlatFeeBody, fromFeeAgreement, selectAttornetvalue, allFolderList, showannualagreementmodal, showannualagreementmodalfun, isPortalSignOn }) => {
  konsole.log("clientData", clientData)
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [subtenantId, setSubtenantId] = useState(null);
  const [primaryUserId, setPrimaryUserId] = useState(null);
  const [userSubscriptionId, setUserSubscriptionId] = useState(null); 
  const [showFeeAgreement, setShowFeeAgreement] = useState(false);
  const [currentCheckedKey, setCurrentCheckedKey] = useState(null);
  const [subsFileId, setSubsFileId] = useState('');
  const [showHourlyBody, setShowHourlyBody] = useState(fromFeeAgreement ? propShowHourlyBody : false);
  const [showFlatFeeBody, setShowFlatFeeBody] = useState(fromFeeAgreement ? propShowFlatFeeBody: false);
  const [showFirmProvided, setShowFirmProvided] = useState( true);
  const [showWithProvided, setShowWithProvided] = useState( false);
  const [showModalBodyPrimary, setShowModalBodyPrimary] = useState(true);
  const [isClientPermissions, setIsClientPermissions] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [primaryInitials, setPrimaryInitials] = useState('');
  const [spouseInitials, setSpouseInitials] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState('');
  const [installmentDuration, setInstallmentDuration] = useState('');
  const [selectedChargeType, setSelectedChargeType] = useState('');
  const [shouldResetAgreement, setShouldResetAgreement] = useState(false);
  const [confirmedInputs, setConfirmedInputs] = useState({});
  const { newConfirm} = useContext(globalContext);
  const [legalTeamList, setLegalTeamList] = useState([])
  const [orderId, setOrderId] = useState('')
  const [inputValues, setInputValues] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState('');
  const [formattedSelectedCheckbox, setFormattedSelectedCheckbox] = useState("");
  const [formattedSelectedSubCheckboxes, setFormattedSelectedSubCheckboxes] = useState({});
  const [selectedDateFuture, setSelectedDateFuture] = useState("");
  const [inputValuesSummaryOfFee, setInputValuesSummaryOfFee] = useState(() => {
    if (orderIDFromUrl && transactionStatus === "SUCCESS" || !isNullUndefine(subsGetData)) {
      const storedValues = sessionStorage.getItem("inputValuesSummaryOfFee");
      return storedValues ? parseValues(JSON.parse(storedValues)) : getDefaultValues();
    }
    return getDefaultValues();
  });  
  const [hourlyRateParalegalsClient, setHourlyRateParalegalsClient] = useState({
    Rate1: '',
    Rate2: '',
    Rate3: '',
    Rate4: '',
    Rate5: '',
    Rate6: '',
    Rate7: '',
    Rate8: '',
  });
  const [combinedUserList, setCombinedUserList] = useState({
    attorneyList: [],
    paralegalList: [],
    clientAssistantList: []
  });  
  const [firmProvidedServices, setFirmProvidedServices] = useState(firmProvidedServicesObject);
  const [thirdPartyProvided, setThirdPartyProvided] = useState(thirdPartyProvidedObject);
  const [selectedCheckbox, setSelectedCheckbox] = useState('');
  const [selectedSubCheckboxes, setSelectedSubCheckboxes] = useState({});
  const [manualSubCheckboxClicks, setManualSubCheckboxClicks] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [checkedValueOfPlan, setCheckedValueOfPlan] = useState(`0.00`);
  const [attorneyUserListvaluelabel, setattorneyUserListvaluelabel] = useState([])
  const [selectattornetvalue, setselectattornetvalue] = useState([])
  const [selectattorneyid, setSelectAttorneId] = useState('')
  const [matterNumber, setMatterNumber] = useState('')
  const [selectedDate, setSelectedDate] = useState('');
  const [signatureAttorney, setSignatureAttorney] = useState(null);
  const [signaturePrimary, setSignaturePrimary] = useState(null);
  const [signatureSpouse, setSignatureSpouse] = useState(null);
  const [prevStateAttorney, setPrevStateAttorney] = useState(null);
  const [prevStatePrimary, setPrevStatePrimary] = useState(null);
  const [skuListNames, setSkuListNames] = useState(fromFeeAgreement ? propsSkuListNames || [] : []);
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [addupdate, setAddUpdate] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false);
  const [subsGetData, setSubsGetData] = useState([])
  const [subsPlansGetData, setPlansGetData] = useState([])
  const [selectAttorneName, setSelectAttorneName] = useState('')
  const [activeModal, setActiveModal] = useState(fromFeeAgreement ? "second" : isPortalSignOn ? "first" : "first");
  const [userAgreementDetails, setUserAgreementDetails] = useState([])
  const stateObj = $AHelper.getObjFromStorage("stateObj");
  const [manageCreate, setManageCreate] = useState({ createdBy: stateObj?.userId, createdOn: new Date().toISOString() })
  const [subscriptionPlans, setSubscriptionPlans] = useState({ names: [], ids: [] });
  const [showAmaOccurrencePreview, setShowAMAOccurrencePreview] = useState(false)
  const [jsonForRadio, setJsonForRadio] = useState([])
  const [memberDetails, setMemberDetails] = useState()
  const [sendLinkRender, setSendLinkRender] = useState(false);
  const [prevStateSpouse, setPrevStateSpouse] = useState(null);
  const [underlineWidth, setUnderlineWidth] = useState(90); 
  const [alertState, setalertState] = useState(true);
  const componentRef = useRef(null)
  const modalRef = useRef(null);
  let showInput = false;

  function getDefaultValues() {
    return {
      value1: '500.00',
      value2: '14450.00',
      value3: '0.00',
      value4: '0.00',
      value5: '0.00',
      value6: '0.00',
      value7: '0.00',
      value8: '0.00',
    };
  }
  
  function removeCommas(value) {
    return value.replace(/,/g, '');
  }

  function parseValues(values) {
    const parsedValues = {};
    for (let key in values) {
      parsedValues[key] = removeCommas(values[key]);
    }
    return parsedValues;
  }

  useEffect(() => {
    if (inputValuesSummaryOfFee?.value5 && inputValuesSummaryOfFee?.value7 && installmentDuration && paymentFrequency && paymentFrequency !== "onetime") {
      let totalFee = parseFloat(inputValuesSummaryOfFee?.value5?.replace(/,/g, '')) || 0;
      let otherAmount = parseFloat(inputValuesSummaryOfFee?.value7?.replace(/,/g, '')) || 0;
      const discount = parseFloat(subsGetData?.totalDiscount?.toString().replace(/,/g, '')) || parseFloat(inputValuesSummaryOfFee?.value6?.replace(/,/g, '')) || 0;
      const remaining = (totalFee - discount) - otherAmount;
      if (installmentDuration > 0) {
        const installmentAmount = remaining / installmentDuration;
        setInstallmentAmount(
          installmentAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        );
      }
    }
  }, [inputValuesSummaryOfFee, installmentDuration, paymentFrequency, subsGetData]);

  const storedClientData = localStorage.getItem("clientDataForFeeAgreement");
  const storedClient = storedClientData && storedClientData !== "undefined" && storedClientData !== "null"
  ? JSON.parse(storedClientData)
  : {};
  const client = clientData || storedClient;

  const sessionKeys = ["loggedUserId", "SubtenantId", "UserID", "attorneyID"];
  const getSessionData = () =>
    sessionKeys.reduce((acc, key) => ({ ...acc, [key]: sessionStorage.getItem(key) || "" }), {});

  useEffect(() => {
    const sessionData = getSessionData();
    setLoggedInUserId(sessionData.loggedUserId);
    setSubtenantId(client?.subtenant_Id || sessionData.SubtenantId || client?.subtenantId);
    setPrimaryUserId(client?.memberUserId ||client?.memberId);
    setSelectAttorneId(sessionData.attorneyID);
  }, [client]);

  useEffect(() => {
    setShowHourlyBody(propShowHourlyBody);
    setShowFlatFeeBody(propShowFlatFeeBody);
    setSkuListNames(propsSkuListNames || []);
  }, [propShowHourlyBody, propShowFlatFeeBody, propsSkuListNames]);  

  useEffect(() => {
    if (fromFeeAgreement != true) {
      sessionStorage.setItem("inputValuesSummaryOfFee", JSON.stringify(inputValuesSummaryOfFee));
    }
    konsole.log("inputValuesSummaryOfFee", inputValuesSummaryOfFee);
  }, [inputValuesSummaryOfFee]); 

  useEffect(() => {
    const fetchData = async () => {
      konsole.log(orderIDFromUrl, transactionStatus, isPortalSignOn,"transactionStatusPortal")
      if (orderIDFromUrl && transactionStatus === "SUCCESS") {
        if(allFolderList?.length > 0) {
          await funForAfterPaymentUpdate();
        } else {
          fetchAndProcessFileCabinet();
        }
      } else if (orderIDFromUrl && isPortalSignOn && transactionStatus === "SUCCESS") {
        if(allFolderList?.length > 0) {
          await funForAfterPaymentUpdate();
        } else {
          fetchAndProcessFileCabinet();
        }
      } else {
        const userID = client?.memberId || sessionStorage.getItem('userID');
        fetchMemberDetails(userID);
        await getSMSNotificationPermissions(userID, setIsClientPermissions);
      }
    };
    fetchAttorneyUserList();
    fetchData();
  }, [orderIDFromUrl, transactionStatus]);

  const fetchMemberDetails = (userID) => {
    dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getFamilyMemberbyID + userID, "", (response, error) => {
      dispatchloader(false)
      if (response) {
        konsole.log('responseData', responseData)
        let responseData = response?.data?.data?.member
        const matNo = responseData?.matNo;
        const registeredOn = responseData?.createdOn;
        const matterNumberValue = !isNotValidNullUndefile(matNo)
          ? `${new Date(registeredOn).getFullYear().toString().slice(-2)}-${responseData.memberId}`
          : matNo;
        setMemberDetails(responseData);
        setMatterNumber(matterNumberValue);
      }
      const subtenantID = sessionStorage.getItem("SubtenantId");
      getSavedSubscriptionDetails([], subtenantID, userID, []);
    })
  }

  useEffect(() => {
    const userID = primaryUserId || sessionStorage.getItem('UserID');
 
    if (userID && clientData && loggedInUserId) {
      setFileInfo({
        primaryUserId: userID,
        fileId: 0,
        fileTypeId: 59,
        fileCategoryId: 6,
        requestedBy: loggedInUserId,
        userFileName: `${clientData?.memberName} - Non-Crisis Fee Agreement`,
      });
    }
  }, [primaryUserId, clientData, loggedInUserId]);  
 

  useEffect(() => {
    if (
      selectedCheckbox?.label !== subsPlansGetData[0]?.skuListName && 
      !(selectedCheckbox?.label === undefined && subsPlansGetData[0]?.skuListName)
    ) {
      setInputValuesSummaryOfFee(getDefaultValues());
    }
  }, [selectedCheckbox?.label, subsPlansGetData]);

  const updateFamilyMembers = async (updatedMatterNo) => {
    let primaryDetails = { ...memberDetails };
    primaryDetails.matNo = updatedMatterNo;
    konsole.log(loggedInUserId,"loggedInUserId")
    let createPrimaryJson = $JsonHelper.createJsonUpdateMemberById({ ...primaryDetails, updatedBy: loggedInUserId, subtenantId: subtenantId });
    delete createPrimaryJson.memberRelationship;
    dispatchloader(true)
    const updateFamilyMember = await postApiCall('PUT', $Service_Url.putUpdateMember, createPrimaryJson); 
    dispatchloader(false)
    if (updateFamilyMember != 'err') {}
  }

  const fetchAttorneyUserList = async () => {
    dispatchloader(true);
    let subtenantID = sessionStorage.getItem('SubtenantId') || client?.subtenantId;
    let inputJson = { "subtenantId": subtenantID, "isActive": true, "roleId": 13, "userType": "LEGAL" };
    konsole.log("inputJson", inputJson);
    let _resultOfAttorneyUserList = await postApiCall("POST", $Service_Url.getUserListByRoleId, inputJson, "");
    dispatchloader(false)
    konsole.log("_resultOfAttorneyUserList", _resultOfAttorneyUserList);
    if (_resultOfAttorneyUserList == "err") return;
    let responseData = _resultOfAttorneyUserList?.data?.data;
    setLegalTeamList(responseData)
      let attorneyUserListOptions = responseData.map((item) => ({
        label: item.fullName,
        value: item.userId,
      }));
      setattorneyUserListvaluelabel(attorneyUserListOptions);

      let attorneyListOptions = responseData
      .filter(item => item.roleId === 13)
      .map(item => ({
        roleID: item.roleId,
        fullName: item.fullName,
        userPrice: item.userPrice,
      }));

    let paralegalListOptions = responseData
      .filter(item => item.roleId === 3)
      .map(item => ({
        role: item.roleId,
        fullName: item.fullName,
        userPrice: item.userPrice,
      }));

    let clientAssistantListOptions = responseData
      .filter(item => item.roleId === 14 || item.roleId === 15)
      .map(item => ({
        roleID: item.roleId,
        fullName: item.fullName,
        userPrice: item.userPrice,
      }));

      let combinedUserList = {
        attorneyList: attorneyListOptions,
        paralegalList: paralegalListOptions,
        clientAssistantList: clientAssistantListOptions,
      };

      setCombinedUserList(combinedUserList);
    
    konsole.log("CombinedUserList", combinedUserList);
    konsole.log("AttorneyList", attorneyListOptions);
    konsole.log("ParalegalList", paralegalListOptions);
    konsole.log("ClientAssistantList", clientAssistantListOptions);
  };

  const formatValue = (value) => {
    if (value !== null && value !== undefined && value !== '') {
      return parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return value;
  };

  const sortedAttorneyList = combinedUserList.attorneyList.sort((a, b) => b.userPrice - a.userPrice);
  const sortedParalegalList = combinedUserList.paralegalList.sort((a, b) => b.userPrice - a.userPrice);
  const sortedClientAssistantList = combinedUserList.clientAssistantList.sort((a, b) => b.userPrice - a.userPrice);

  const filterValidUsers = (list) => {
    return list?.filter(user => user?.userPrice !== null && user?.userPrice !== 0 && user?.userPrice !== "0.00" && user?.userPrice !== undefined && user?.userPrice !== "");
  };
  const filteredAttorneyList = filterValidUsers(sortedAttorneyList);
  const filteredClientAssistantList = filterValidUsers(sortedClientAssistantList);
  const filteredParalegalList = filterValidUsers(sortedParalegalList);

  useEffect(() => {
    let filterdata = attorneyUserListvaluelabel.find((items) => items.value == selectattorneyid)
    setselectattornetvalue(filterdata)
    if (fromFeeAgreement == true){
      fetchMemberDetailsById(selectAttornetvalue?.value)
    } else if (skuListNames?.length === 0 && !fromFeeAgreement) {
      fetchSubscriptionDetailsfun(subtenantId, selectattorneyid, 2);
    }
  }, [selectattorneyid, skuListNames, selectAttornetvalue])

  const fetchMemberDetailsById = async (selectattorneyid) => {
    if (!selectattorneyid) return;
    sessionStorage.setItem("attorneyID", selectattorneyid);
    dispatchloader(true)
    let _resultOfMemberDetailsById = await getApiCall("GET", $Service_Url.getFamilyMemberbyID + selectattorneyid, "");
    dispatchloader(false)
    konsole.log("_resultOfMemberDetailsById", _resultOfMemberDetailsById);
    if (_resultOfMemberDetailsById == "err") return;
      let responseData = _resultOfMemberDetailsById?.member;
      let createdOn = responseData?.createdOn;
      konsole.log(createdOn,"createdOn")
      let memberId = responseData?.memberId;
      const userIdPrimary = client?.memberId;
      let subtenantID = responseData?.subtenantId || subtenantId;
      fetchSubscriptionDetailsfun(subtenantID, userIdPrimary, 2);
      fetchSubscriptionDetailsfun(subtenantID, userIdPrimary, 1);
      konsole.log('responseData', responseData);
  };

  const fetchSubscriptionDetailsfun = async (subtenantID, userIdPrimary, subscriptionID) => {
    konsole.log(subscriptionID, userIdPrimary, subtenantID,"subtenantID")
    const subtenant = subtenantID || sessionStorage.getItem('SubtenantId')
    dispatchloader(true)
    let url =
    $Service_Url.getSubscriptionDetails + subtenant + "/" + subscriptionID;
    const _resultOfSubscription = await getApiCall("GET", url, "");
    dispatchloader(false)
    konsole.log("_resultOfSubscription", _resultOfSubscription);
    if (_resultOfSubscription != "err" && _resultOfSubscription?.length > 0) {
    let subPlansList = _resultOfSubscription[0]?.subsPlans;
    if (subscriptionID === 2) {
      setJsonForRadio(subPlansList);
    }
    let array = []
    for (let [index, value] of subPlansList.entries()) {
        let results = createjsonforcheckboxradio(index, value.subsPlanId);
        array.push(results)
    }
    let allSkuListNames = [];
    for (let plan of subPlansList) {
      if (plan.subscriptionId === 2) {
        for (let sku of plan.subsPlanSKUs) {
          allSkuListNames.push(sku.skuListName);
        }
      }
    }
    if (allSkuListNames?.length > 0) {
      setSkuListNames(prevState => {
        return prevState?.length === 0 ? allSkuListNames : prevState;
      });
    }

    let allSubscriptionPlanNames = [];
    let allSubscriptionPlanIds = [];

    for (let plan of subPlansList) {
      if (plan.subscriptionId === 2) {
        allSubscriptionPlanNames.push(plan.subscriptionPlanName);
        allSubscriptionPlanIds.push(plan.subsPlanId); 
      }
    }
    if (allSubscriptionPlanNames?.length > 0 && allSubscriptionPlanIds?.length > 0) {
      setSubscriptionPlans(prevState => {
          return {
              names: allSubscriptionPlanNames,
              ids: allSubscriptionPlanIds
          };
      });
    }
    konsole.log(allSubscriptionPlanIds,allSubscriptionPlanNames,"allSubscriptionPlanNames")
    
    fetchPrimaryMemberDetailsById(array,subtenantID, subPlansList)
    }
  }; 

  let isFetchingPrimary = false; 

  const fetchPrimaryMemberDetailsById = async (array,subtenantID, subPlansList) => {
    if (isFetchingPrimary) return;
    isFetchingPrimary = true;
    konsole.log("userIdClient", client?.memberId)
    let userIdPrimary = client?.memberId || primaryUserId;
    if (!userIdPrimary) return;
    dispatchloader(true)
    let _resultOfGetPrimary = await getApiCall("GET", $Service_Url.getFamilyMemberbyID + userIdPrimary, "");
    dispatchloader(false)
    konsole.log("_resultOfGetPrimary", _resultOfGetPrimary);
    if (_resultOfGetPrimary == "err") return;
    let responseData = _resultOfGetPrimary?.member;
    const matNo = responseData?.matNo;
    const registeredOn = responseData?.createdOn;
    const matterNumberValue = !isNotValidNullUndefile(matNo)
      ? `${new Date(registeredOn).getFullYear().toString().slice(-2)}-${responseData.memberId}`
      : matNo;
    setMemberDetails(responseData);
    setMatterNumber(matterNumberValue);
    const userID = responseData.userId;
    sessionStorage.setItem("UserID", userID);
    getSavedSubscriptionDetails(array,subtenantID, userID, subPlansList)
    isFetchingPrimary = false;
  };

  let isFetchingSubscription = false;

  const getSavedSubscriptionDetails = async (array, subtenantID, userID, subPlansList) => {
    if (isFetchingSubscription) return;
    isFetchingSubscription = true;
    konsole.log(subtenantID, userID, array, subPlansList, "ansz")
    if (FeeAgreement) {
      subtenantID = 2;
    } else if (subtenantID == null || subtenantID === "" || isNaN(subtenantID)) {
      subtenantID = 2;
    }
    let subscriptionId = 2;
    dispatchloader(true)
    const _resultSubsDetails = await getApiCall("GET", $Service_Url.getUserSubscription + `${subtenantID}/${true}?SubscriptionId=${subscriptionId}&UserId=${userID}`);
    dispatchloader(false)
    if (_resultSubsDetails == "err" )  return;
    konsole.log("_resultSubsDetails", _resultSubsDetails);
    setSubsGetData(_resultSubsDetails[0])
    setShowHourlyBody(_resultSubsDetails[0]?.isHourly)
    setShowFlatFeeBody(_resultSubsDetails[0]?.isFlatFee)
    setLoggedInUserId(_resultSubsDetails[0]?.createdBy)
    let userSubscriptionIds = _resultSubsDetails[0]?.userSubscriptionId;
    setUserSubscriptionId(userSubscriptionIds)
    setSubsFileId(_resultSubsDetails[0]?.subsFileId)
    let orderID = _resultSubsDetails[0]?.orderId;
    setOrderId(orderID)
    const attorneyDetails = {
      label: _resultSubsDetails[0]?.attorneyName || '', 
      value: _resultSubsDetails[0]?.attorneyId || '',
    };
    const attorneyName = _resultSubsDetails[0]?.attorneyName;
    setSelectAttorneName(attorneyName);
    setselectattornetvalue(attorneyDetails);
    sessionStorage.setItem("attorneyID", attorneyDetails.value);
    let isActive = true;
    if (_resultSubsDetails == 'err' || _resultSubsDetails?.length == 0 || _resultSubsDetails[0]?.orderId == 0 );
    dispatchloader(true)
    const _resultPlansDetails = await getApiCall("GET", `${$Service_Url.getUserSubscriptionPlans}?UserSubscriptionId=${_resultSubsDetails[0]?.userSubscriptionId}&IsActive=${isActive}`);
    dispatchloader(false)
    if (_resultPlansDetails == "err") return;
    konsole.log(_resultPlansDetails, "_resultPlansDetails");
    let userSubscriptionId = _resultPlansDetails[0]?.userSubscriptionId;
    setPlansGetData(_resultPlansDetails)
    setUserSubscriptionId(userSubscriptionId)
    const arrayData = array;
    konsole.log(arrayData,"arrayData")
    for (let value of _resultPlansDetails) {
      for (let i = 0; i < arrayData?.length; i++) {
        if (value.subsPlanId == arrayData[i].subsPlanId) {
          arrayData[i].value = value.isActive;
          arrayData[i].checkedputplanid = true;
          arrayData[i].selectedPlanIdd = value?.subsPlanSKUMapId;
          arrayData[i].subPlanGetId = value?.userSubsPlanId;
          arrayData[i].subtenantRateCardId = value?.subtenantRateCardId;
        }
      }
    }
    getCheckedValueOfPlan(array,subPlansList, userID, orderID)
    await getUserAgreementDetails(userID, subscriptionId, userSubscriptionId);
    setAddUpdate(true)
    isFetchingSubscription = false;
    return _resultSubsDetails[0]
  }

  const getUserAgreementDetails = async (userID, subscriptionId, userSubscriptionId) => {
    const resolvedUserSubscriptionId = await subsPlansGetData[0]?.userSubscriptionId || userSubscriptionId;
    dispatchloader(true)
    const _UserAgreementDetails = await getApiCall("GET", $Service_Url.getUserAgreement + `${userID}/${resolvedUserSubscriptionId}/${subscriptionId}`);
    dispatchloader(false)
    konsole.log(_UserAgreementDetails, "_UserAgreementDetails")
    if (_UserAgreementDetails === "err" || (!_UserAgreementDetails?.length)) {
      setUserAgreementDetails([])
      setFirmProvidedServices(firmProvidedServicesObject);
      setThirdPartyProvided(thirdPartyProvidedObject);
      return [];
    }
    setUserAgreementDetails(_UserAgreementDetails)
    const { matchedFirmServices, matchedThirdPartyServices } = matchServices(_UserAgreementDetails);
    setFirmProvidedServices(prev => ({ ...prev, ...matchedFirmServices }));
    setThirdPartyProvided(prev => ({ ...prev, ...matchedThirdPartyServices }));
    if (matchedFirmServices && matchedThirdPartyServices) {
      const subCheckedKey = getSubCheckedKey(subsPlansGetData);
      if (subCheckedKey) {
        subCheckedClass(subCheckedKey, true);
      }
    }
    return _UserAgreementDetails;
  };

  const matchServices = (_UserAgreementDetails) => {
    let matchedFirmServices = { ...firmProvidedServicesObject };  
    let matchedThirdPartyServices = { ...thirdPartyProvidedObject };

    const lastFirmKey = Object.keys(firmProvidedServicesObject).sort().pop() || 'A'; 
    const lastThirdPartyKey = Object.keys(thirdPartyProvidedObject).sort().pop() || 'A';

    let nextFirmKey = String.fromCharCode(lastFirmKey.charCodeAt(0) + 1);  
    let nextThirdPartyKey = String.fromCharCode(lastThirdPartyKey.charCodeAt(0) + 1);  

    _UserAgreementDetails.forEach(service => {
        const descOfService = service?.descOfService?.trim() || "";
        const serviceProvider = service?.serviceProvider?.trim() || null;  
        const curCost = service?.cost !== undefined ? String(service.cost).trim() : "0.00";

        let isMatched = false;

        Object.keys(firmProvidedServicesObject).forEach(key => {
          if (firmProvidedServicesObject[key].Description?.trim().toLowerCase() === descOfService.toLowerCase()) {
              matchedFirmServices[key] = {
                  ...firmProvidedServicesObject[key],
                  Checked: service.isIncluded === true,
                  isHourly: service.isHourly === true,
                  isFlatFee: service.isFlatFee === true
              };
              isMatched = true;
          }
          if (firmProvidedServicesObject[key].subFirmProvidedServiceObject) {
            Object.keys(firmProvidedServicesObject[key].subFirmProvidedServiceObject).forEach(subKey => {
                if (firmProvidedServicesObject[key].subFirmProvidedServiceObject[subKey].Description?.trim().toLowerCase() === descOfService.toLowerCase()) {
                    matchedFirmServices[key].subFirmProvidedServiceObject[subKey] = {
                        ...firmProvidedServicesObject[key].subFirmProvidedServiceObject[subKey],
                        Checked: service.isIncluded === true
                    };
                    isMatched = true;
                }
            });
          }
        });

        Object.keys(thirdPartyProvidedObject).forEach(key => {
          if (thirdPartyProvidedObject[key].Description?.trim().toLowerCase() === descOfService.toLowerCase()) {
              matchedThirdPartyServices[key] = {
                  ...thirdPartyProvidedObject[key],
                  Checked: service.isIncluded === true,
                  serviceProvider,
                  curCost
              };
              isMatched = true;
          }
        });

        if (!isMatched) {
          if (curCost) {  
              matchedThirdPartyServices[nextThirdPartyKey] = {
                  Checked: service.isIncluded === true,
                  Description: descOfService,
                  serviceProvider,
                  curCost,
                  costOptions: [curCost, 'Waived']
              };
              nextThirdPartyKey = String.fromCharCode(nextThirdPartyKey.charCodeAt(0) + 1);
          } else {  
              matchedFirmServices[nextFirmKey] = {
                  Checked: service.isIncluded === true,
                  isHourly: service.isHourly === true,
                  isFlatFee: service.isFlatFee === true,
                  Description: descOfService
              };
              nextFirmKey = String.fromCharCode(nextFirmKey.charCodeAt(0) + 1);
          }
      }
    });

    return { matchedFirmServices, matchedThirdPartyServices };
  };
  
  const getCheckedValueOfPlan = (subPlansList, array, userID, orderID) => {
    konsole.log("ejssjdsj", userID)
    if (!subPlansList || !array) return null;
    konsole.log(subPlansList, array, "subPlansList");
    let checkedValueOfPlan = null;
    if (subPlansList?.length > 0 && array?.length > 0 && orderID) {
        subPlansList.forEach((item, outerIndex) => {
          if (subPlansList[outerIndex]?.value === true) {
              array[0]?.subsPlanSKUs?.forEach((skuItem) => {
                  if (skuItem.subsPlanSKUMapId === subPlansList[outerIndex]?.selectedPlanIdd) {
                      checkedValueOfPlan = `${skuItem.endSubscriptionAmt}.00`;
                      konsole.log(checkedValueOfPlan,"sjnsjnsjn")
                      setCheckedValueOfPlan(checkedValueOfPlan);
                  }
              });
            }
        });
    }
    return checkedValueOfPlan;
  }

  const genereateViewPdf = async (fileDetails, btnType) => {
    konsole.log("primaryUserId", primaryUserId)
    if(btnType =='sendLink' && isNullUndefine(commChannelId)){
        AlertToaster.error("Occurrence not available. Please contact your administrator.");
        return;
    }
    const jsonObj = createJsonUploadFileV2({ UserId: primaryUserId || client?.memberId, File: fileDetails[0], UploadedBy: loggedInUserId, FileTypeId: 59, FileCategoryId: 6, FileStatusId: 2, DateFinalized: selectedDate, UserFileName: client?.memberName + ' - Non-Crisis Fee Agreement', });
    konsole.log("jsonObj2", jsonObj)
    dispatchloader(true);
    const _resultUploadFile = await postUploadUserDocumant(jsonObj);
    let fileId = _resultUploadFile?.fileId;
    dispatchloader(false);
    generateAMAfun(fileId, btnType)
  }

  const generateAMAfun = (fileId, btnType) => {
    sessionStorage.setItem("nonCrisisFileId", fileId)
    if (addupdate == false) {
      addUserSubscription(fileId, btnType)
    } else {
      updateUserSubscription(fileId, btnType)
    }
  }

  function msgFunForDOcumentenerate(type) {
    AlertToaster.success(`Document ${type === "add" ? "generated" : "updated"} successfully.`);
    handleIsPayment();
  }

  const handleIsPayment = () => {
      if(isPaymentOpen && addupdate==false ){
        fetchSubscriptionDetailsfun(subtenantId, primaryUserId, 2);
      }
      setIsPaymentOpen(prev => !prev)  
  }

  const addUserSubscription = async (fileId, btnType) => {
    const userID = client?.memberId
    dispatchloader(true)
    const validityFrom = new Date();
    const baseDate = new Date(validityFrom);
    let futurePayDate = null;
    if (paymentChoice === "installment") {
      if (paymentFrequency === "onetime" && selectedDateFuture) {
        futurePayDate = new Date(selectedDateFuture);
      } else {
        const date = new Date(baseDate);
        switch (paymentFrequency) {
          case "weekly":
            date.setDate(date.getDate() + 7);
            break;
          case "monthly":
            date.setMonth(date.getMonth() + 1);
            break;
          case "yearly":
            date.setFullYear(date.getFullYear() + 1);
            break;
          default:
            break;
        }
        futurePayDate = date;
      }
    }

    const storedInputValues = sessionStorage.getItem("inputValuesSummaryOfFee");
    const inputValuesSummaryOfFee = storedInputValues ? JSON.parse(storedInputValues) : {};
    const parseValue = (val) => {
      return !isNaN(parseFloat(val?.replace(/,/g, ''))) ? parseFloat(val.replace(/,/g, '')) : 0;
    };

    
    const totalAmountFromUI = parseValue(inputValuesSummaryOfFee?.value5);
    const totalPaidFromUI = parseValue(inputValuesSummaryOfFee?.value7);
    const totalDiscountFromUI = parseValue(inputValuesSummaryOfFee?.value6);
    const finalTotalInstallment = paymentFrequency === "onetime" ? 1 : installmentDuration ?? null;
    const finalIsInstallmentPlan = paymentFrequency === "onetime" ? false : true;
    const finalInstallmentAmount = paymentFrequency === "onetime"
    ? (totalDiscountFromUI > 0
      ? (totalAmountFromUI - totalDiscountFromUI - totalPaidFromUI)
          : (totalAmountFromUI - totalPaidFromUI))
      : installmentAmount;

    const totalAmount = totalAmountFromUI !== 0 
    ? totalAmountFromUI 
    : "0.00";
    
    const totalDiscount = totalDiscountFromUI !== 0 
    ? totalDiscountFromUI 
    : "0.00";
    
    const totalPaid = paymentChoice === "full" && totalDiscount > 0 
    ? (totalAmount - totalDiscount) 
    : totalPaidFromUI !== 0 
    ? totalPaidFromUI 
    : 0.00;
    
    // let jsonobj = { "userId": userID, "attorneyId": selectattorneyid, "isActive": true, "subsStatusId": 1, "subscriptionId": 2, "isHourly": showHourlyBody ? true : false, "isFlatFee": showFlatFeeBody ? true : false, "validityFrom" : selectedDate, "subtenantId": subtenantId, "createdBy": loggedInUserId }
    const AddUserSubscriptionJson = $JsonHelper.createAddUserSubscriptionJson({userId: userID,selectAttorneyId: selectattorneyid,showHourlyBody,showFlatFeeBody,subtenantId,loggedInUserId, validityFrom: validityFrom, futurePayDate : futurePayDate, totalAmount: totalAmount, totalPaid: totalPaid, totalDiscount: totalDiscount, isInstallmentPlan: finalIsInstallmentPlan, totalInstallment: finalTotalInstallment, installmentAmount: finalInstallmentAmount });
    konsole.log("AddUserSubscriptionJson", JSON.stringify(AddUserSubscriptionJson))
    let _resultOfUserSubscriptionAdd = await postApiCall("POST", $Service_Url.postuserSubscriptionAdd, AddUserSubscriptionJson, "");
    dispatchloader(false)
    konsole.log("_resultOfUserSubscriptionAdd", _resultOfUserSubscriptionAdd);
    let  usersubsID = _resultOfUserSubscriptionAdd?.data?.data;
    setUserSubscriptionId(usersubsID);
    if (_resultOfUserSubscriptionAdd != 'err') {
      handleUserSubscriptionPlans ("add", fileId, btnType, subtenantId, userID, usersubsID)
    }
  };

  const updateUserSubscription = async (fileId, btnType, result) => {
    konsole.log(result, subsGetData, client, inputValuesSummaryOfFee?.value7,"inputValuesSummaryOfFeeAlongWithsubsGetData")
    const getSession = (key) => sessionStorage.getItem(key);
    const userID = client?.memberId ? client?.memberId : getSession("UserID"),
    selectAttorneyId = selectattorneyid ? selectattorneyid : getSession("attorneyID") ? getSession("attorneyID") : sessionStorage.getItem('attorneyID'),
    subtenantID = client?.subtenantId ? client?.subtenantId : getSession("SubtenantId") ? getSession("SubtenantId") : getSession("subtenantID"),
    loggedInUserID = loggedInUserId ? loggedInUserId : getSession("loggedUserId"),
    orderIDFromUrl = getSession("orderIDFromUrl") || getSession("orderID"),
    orderID = orderId ? orderId : orderIDFromUrl;
    const validityFromDate = new Date();
    
    // Parse input values from sessionStorage
    const storedInputValues = sessionStorage.getItem("inputValuesSummaryOfFee");
    const inputValuesSummaryOfFee = storedInputValues ? JSON.parse(storedInputValues) : {};

    const parseValue = (val) => {
      return !isNaN(parseFloat(val?.replace(/,/g, ''))) ? parseFloat(val.replace(/,/g, '')) : 0;
    };

    const totalAmountFromUI = parseValue(inputValuesSummaryOfFee?.value5);
    const totalPaidFromUI = parseValue(inputValuesSummaryOfFee?.value7);
    const totalDiscountFromUI = parseValue(inputValuesSummaryOfFee?.value6);
    const source = result ?? subsGetData;
    const isOneTimePayment = paymentFrequency === "onetime" || source?.totalInstallment === 1;
    const finaltotalInstallment = installmentDuration || source?.totalInstallment || 0;
    const finalsInstallmentPlan = isOneTimePayment ? false  : (source?.isInstallmentPlan ?? true);
    const finalInstallmentAmount = isOneTimePayment
    ? (totalDiscountFromUI > 0
        ? (totalAmountFromUI - totalDiscountFromUI - totalPaidFromUI)
        : (totalAmountFromUI - totalPaidFromUI))
    : (installmentAmount || source?.installmentAmount || 0);
  
    const isValueDifferentAndValid = (uiValue, subsValue) => {
        return uiValue !== 0 && uiValue !== subsValue;
    };

    const isValueDifferent = (uiValue, subsValue) => {
      return parseFloat(uiValue) !== parseFloat(subsValue);
    };    

    const baseDate = new Date(validityFromDate);
    let futurePayDate = null;
    if (paymentChoice === "installment") {
      if (paymentFrequency === "onetime" && selectedDateFuture) {
        futurePayDate = new Date(selectedDateFuture);
      } else {
        const date = new Date(baseDate);
        switch (paymentFrequency) {
          case "weekly":
            date.setDate(date.getDate() + 7);
            break;
          case "monthly":
            date.setMonth(date.getMonth() + 1);
            break;
          case "yearly":
            date.setFullYear(date.getFullYear() + 1);
            break;
          default:
            date.setDate(date.getDate() + 1);
            break;
        }
        futurePayDate = date;
      }
    } else {
      futurePayDate = selectedDateFuture
        ? selectedDateFuture
        : result?.futurePayDate !== undefined
          ? result.futurePayDate
          : subsGetData?.futurePayDate !== undefined
            ? subsGetData.futurePayDate
            : client?.futurePayDate !== undefined
              ? client.futurePayDate
              : null;
    }

    const totalAmount = isValueDifferentAndValid(totalAmountFromUI, subsGetData?.totalAmount)
        ? totalAmountFromUI
        : subsGetData?.totalAmount !== undefined 
            ? subsGetData.totalAmount 
            : result?.totalAmount !== undefined 
                ? result.totalAmount 
                : client?.totalAmount !== undefined 
                    ? client.totalAmount 
                    : "0.00";

    const totalDiscount = isValueDifferent(totalDiscountFromUI, subsGetData?.totalDiscount)
        ? totalDiscountFromUI
        : subsGetData?.totalDiscount !== undefined 
            ? subsGetData.totalDiscount 
            : result?.totalDiscount !== undefined 
                ? result.totalDiscount 
                : client?.totalDiscount !== undefined 
                    ? client.totalDiscount 
                    : "0.00";

    const totalPaid = paymentChoice === "full" && totalDiscount > 0 && totalAmount > 0
        ? (totalAmount - totalDiscount) 
        : isValueDifferentAndValid(totalPaidFromUI, subsGetData?.totalPaid)
            ? totalPaidFromUI
            : subsGetData?.totalPaid !== undefined 
                ? subsGetData.totalPaid 
                : result?.totalPaid !== undefined 
                    ? result.totalPaid 
                    : client?.totalPaid !== undefined 
                        ? client.totalPaid 
                        : "0.00";

    dispatchloader(true);
    // let jsonobj = { "userId": userID, "attorneyId": selectattorneyid, "authorizeSubscriptionId": subsGetData?.authorizeSubscriptionId, "isCancelSubscription": subsGetData?.isCancelSubscription, "orderId": subsGetData?.orderId, "isActive": true, "subsStatusId": subsGetData?.subsStatusId, "isHourly": showHourlyBody ? true : false, "isFlatFee": showFlatFeeBody ? true : false, "subscriptionId": subsGetData?.subscriptionId, "userLinkId": subsGetData?.userLinkId, "subtenantId": subtenantId, "userSubscriptionId": subsGetData?.userSubscriptionId, "subsFileId": fileId, "validityFrom" : selectedDate, "validityTo": validityToDate, "userLinkId": subsGetData?.userLinkId, "updatedBy": loggedInUserId }
    const shouldIncludeOrderId = (orderIDFromUrl || orderID) && transactionStatus === "SUCCESS";
    const commonParams = { userId: userID, selectAttorneyId, subsGetData, result, showHourlyBody : result?.isHourly || subsGetData?.isHourly || client?.isHourly, showFlatFeeBody : result?.isFlatFee || subsGetData?.isFlatFee || client?.isFlatFee, selectedDate: validityFromDate, validityFromDate, subtenantId: subtenantID, fileId, loggedInUserId: loggedInUserID, futurePayDate : futurePayDate, totalAmount: totalAmount, totalPaid: totalPaid, totalDiscount: totalDiscount, isInstallmentPlan: finalsInstallmentPlan, totalInstallment: finaltotalInstallment, installmentAmount: finalInstallmentAmount, ...(shouldIncludeOrderId && { orderId: orderID, totalAmount: totalAmount, totalPaid: totalPaid, totalDiscount: totalDiscount }) };
    const UpdateUserSubscriptionJson = $JsonHelper.createUpdateUserSubscriptionJson(commonParams);
    konsole.log("UpdateUserSubscriptionJson", JSON.stringify(UpdateUserSubscriptionJson));
    const _resultOfUserSubscriptionUpdate = await postApiCall("PUT", $Service_Url.putUserSubUpdate, UpdateUserSubscriptionJson, "");
    dispatchloader(false);
    let  usersubsID = _resultOfUserSubscriptionUpdate?.data?.data;
    setUserSubscriptionId(usersubsID);
    konsole.log("_resultOfUserSubscriptionUpdate", _resultOfUserSubscriptionUpdate);
    if ((orderIDFromUrl && transactionStatus === "SUCCESS") || (orderIDFromUrl && isPortalSignOn && transactionStatus === "SUCCESS")) {
      const subtenantID = subtenantId;
      const userIdPrimary = primaryUserId;
      await fetchSubscriptionDetailsfun(subtenantID, userIdPrimary, 2);
    } else {
      if (fromFeeAgreement){
        await postAddUserOrder();
      } else{
        handleUserSubscriptionPlans("update", fileId, btnType, subtenantId, userID, usersubsID);
      }
    }
  };

  const handleUserSubscriptionPlans = async (type, fileId, btnType, subtenantId, userID, usersubsID) => {
    konsole.log(type, fileId, btnType, subtenantId, loggedInUserId, "UserSubscriptionPlans", skuListNames);
  
    let jsonobjArray = [];
    const subsPlanSKUMapIdArray = [];
  
    const checkboxMapping = {
      'check-a1-a': 0,
      'check-a1-b': 1,
      'check-a1-e': 2,
      'check-a1-ee': 3,
      'check-a1-g': 4,
    };
  
    jsonForRadio.forEach((item) => {
      if (item?.subsPlanSKUs && item.subsPlanSKUs?.length > 0) {
        item.subsPlanSKUs.forEach((sku) => {
          let jsonobj = {
            userSubscriptionId: userSubscriptionId || usersubsID,
            userSubsPlanId: null,
            subsPlanSKUMapId: sku.subsPlanSKUMapId,
            isActive: false,
            upsertedBy: userID,
            subtenantRateCardId: sku.subtenantRateCardId,
          };
          jsonobjArray.push(jsonobj);
          subsPlanSKUMapIdArray.push(sku.subsPlanSKUMapId);
        });
      }
    });
  
    if (formattedSelectedCheckbox) {
      jsonobjArray = jsonobjArray.map((item, index) => {
        const checkboxIndex = checkboxMapping[formattedSelectedCheckbox];
        return {
          ...item,
          isActive: index === checkboxIndex ? true : item.isActive,
        };
      });
    }
  
    if (formattedSelectedCheckbox === 'check-a1-g' && formattedSelectedSubCheckboxes) {
      Object.keys(formattedSelectedSubCheckboxes).forEach((subKey) => {
        if (formattedSelectedSubCheckboxes[subKey]) {
          const subCheckboxMapping = {
            'check-a1-k': 5,
            'check-a1-l': 6,
            'check-a1-m': 7,
          };
  
          const subIndex = subCheckboxMapping[subKey];
          jsonobjArray[subIndex] = {
            ...jsonobjArray[subIndex],
            isActive: true,
          };
        }
      });
    }
  
    const oldSubPlansPayload = subsPlansGetData || [];
    jsonobjArray = jsonobjArray.map((item) => {
      const match = oldSubPlansPayload.find(p => p.subsPlanSKUMapId === item.subsPlanSKUMapId);
      if (match) {
        item.userSubsPlanId = match.userSubsPlanId;
        if (!item.isActive) {
          item.isActive = false;
        }
      }
      return item;
    });
  
    jsonobjArray = jsonobjArray.filter(item => !(item.userSubsPlanId === null && item.isActive === false));
    const activeItems = jsonobjArray.filter(item => item.isActive);
    const inactiveItems = jsonobjArray.filter(item => !item.isActive);
    const combinedPlans = (activeItems.length > 0 && inactiveItems.length > 0)
    ? [...activeItems, ...inactiveItems]
    : [...activeItems];

    const hasChanges = combinedPlans.some((item) => {
      const match = oldSubPlansPayload.find(p => p.subsPlanSKUMapId === item.subsPlanSKUMapId);
      return !(
        match &&
        match.subtenantRateCardId === item.subtenantRateCardId
      );
    });    
      
    if (!hasChanges) {
      msgFunForDOcumentenerate(type);
      await addUserAgreementDetails(fileId, btnType, subtenantId, userID);
      return;
    }
  
    const url = type === "add"
      ? $Service_Url.upsertuserSubscriptionPlans
      : $Service_Url.upsertuserSubscriptionPlans;
  
    dispatchloader(true)
    const _resultOfUserSubscriptionPlans = await postApiCall("POST", url, combinedPlans, "");
    dispatchloader(false)
    konsole.log(
      `_resultOfUserSubscriptionPlans${type === "add" ? "Add" : "Update"}`,
      _resultOfUserSubscriptionPlans
    );
    msgFunForDOcumentenerate(type);
    await addUserAgreementDetails(fileId, btnType, subtenantId, userID);
  };

  const addUserAgreementDetails = async (fileId, btnType, subtenantId, userID) => {
    dispatchloader(true);

    let result = (Array.isArray(subsGetData) && subsGetData?.length > 0) 
      ? subsGetData
      : await getSavedSubscriptionDetails([], subtenantId, userID, []);

    let userSubscriptionId = subsPlansGetData?.[0]?.userSubscriptionId || result?.userSubscriptionId;
    let subscriptionId = subsPlansGetData?.[0]?.subscriptionId || result?.subscriptionId;

    if (!userSubscriptionId || !subscriptionId) {
      result = await getSavedSubscriptionDetails([], subtenantId, userID, []);
      userSubscriptionId ||= result?.userSubscriptionId;
      subscriptionId ||= result?.subscriptionId;
    }

    const existingData = userAgreementDetails?.length > 0
      ? userAgreementDetails
      : await getUserAgreementDetails(primaryUserId, userSubscriptionId, subscriptionId);

    const firmProvidedServicesArray = Object.entries(firmProvidedCombinedServices).reduce((acc, [itemKey, itemValue]) => {
      let isHourly = false, isFlatFee = false;
      
      if (showHourlyBody && !showFlatFeeBody) {
        isHourly = Boolean(itemValue?.Checked);
      } else if (showFlatFeeBody && !showHourlyBody) {
        isFlatFee = Boolean(itemValue?.Checked);
      } else if (showHourlyBody && showFlatFeeBody) {
        isHourly = Boolean(itemValue?.Checked);
        isFlatFee = Boolean(itemValue?.Checked);
      }

      const mainService = {
        primaryUserId: userID,
        userAgtId: 0,
        userSubscriptionId,
        subscriptionId,
        subsPlanId: subscriptionPlans?.ids?.[0],
        item: `${itemKey}.`,
        isIncluded: Boolean(itemValue?.Checked || Object.values(itemValue?.subFirmProvidedServiceObject || {}).some(subItem => subItem.Checked)),
        isHourly,
        isFlatFee,
        descOfService: itemValue?.EditableDescription || itemValue?.Description || "",
        serviceProvider: null,
        cost: 0,
        isCostIncluded: true,
        isActive: Boolean(itemValue?.Checked),
        upsertedBy: loggedInUserId,
      };

      const subServices = Object.entries(itemValue?.subFirmProvidedServiceObject || {}).map(([subKey, subValue]) => ({
        primaryUserId: userID,
        userAgtId: 0,
        userSubscriptionId,
        subscriptionId,
        subsPlanId: subscriptionPlans?.ids?.[0],
        item: `${subKey}.`,
        isIncluded: Boolean(subValue?.Checked),
        isHourly,
        isFlatFee,
        descOfService: subValue?.EditableDescription || subValue?.Description || "",
        serviceProvider: null,
        cost: 0,
        isCostIncluded: true,
        isActive: Boolean(subValue?.Checked),
        upsertedBy: loggedInUserId,
      }));
      return acc.concat(mainService, ...subServices);
    }, []);

    const thirdPartyProvidedServicesArray = Object.entries(thirdPartyCombinedServices).map(([serviceKey, serviceValue]) => {
      let isHourly = false, isFlatFee = false;

      if (showHourlyBody && !showFlatFeeBody) {
        isHourly = Boolean(serviceValue?.Checked);
      } else if (showFlatFeeBody && !showHourlyBody) {
        isFlatFee = Boolean(serviceValue?.Checked);
      } else if (showHourlyBody && showFlatFeeBody) {
        isHourly = Boolean(serviceValue?.Checked);
        isFlatFee = Boolean(serviceValue?.Checked);
      }

      return {
        primaryUserId: userID,
        userAgtId: 0,
        userSubscriptionId,
        subscriptionId,
        subsPlanId: subscriptionPlans?.ids?.[1],
        item: `${serviceKey}.`,
        isIncluded: Boolean(serviceValue?.Checked),
        isHourly,
        isFlatFee,
        descOfService: serviceValue?.Description || "",
        serviceProvider: serviceValue?.serviceProvider || "",
        cost: serviceValue?.curCost === 'Waived' ? null : (serviceValue?.curCost === '0.00' ? serviceValue.curCost : (serviceValue?.curCost === 0 || serviceValue?.curCost === '0') ? 0 : (serviceValue?.curCost != null && serviceValue?.curCost !== '' ? parseValueRemoveComma(serviceValue.curCost) : 0)),
        isCostIncluded: true,
        isActive: Boolean(serviceValue?.Checked),
        upsertedBy: loggedInUserId,
      };
    });

    const jsonArray = [...firmProvidedServicesArray, ...thirdPartyProvidedServicesArray];

    const duplicates = jsonArray.filter(newItem =>
      existingData.some(existingItem =>
        existingItem.primaryUserId === newItem.primaryUserId &&
        existingItem.userSubscriptionId === newItem.userSubscriptionId &&
        existingItem.subscriptionId === newItem.subscriptionId &&
        existingItem.subsPlanId === newItem.subsPlanId &&
        existingItem.item === newItem.item &&
        existingItem.isIncluded === newItem.isIncluded &&
        existingItem.descOfService === newItem.descOfService &&
        existingItem.serviceProvider === newItem.serviceProvider
      )
    );

    if (duplicates?.length > 1) {
      const matchingExistingData = existingData.filter(item =>
        item.primaryUserId === userID &&
        item.userSubscriptionId === userSubscriptionId &&
        (item.subsPlanId === subscriptionPlans?.ids?.[0] || item.subsPlanId === subscriptionPlans?.ids?.[1])
      );

      if (matchingExistingData?.length > 0) {
        dispatchloader(true)
        const deleteUrl = `${$Service_Url.deleteUserAgreement}${userID}/${userSubscriptionId}/${subscriptionId}`;
        const _resultOfDelete = await postApiCall("DELETE", deleteUrl);
        dispatchloader(false)
        if (_resultOfDelete === 'err') {
          dispatchloader(false);
          return;
        }
      }
    }
    const _resultOfPostUserAgreement = await postApiCall("POST", $Service_Url.postUserAgreement, jsonArray, "");
    dispatchloader(false);
    if (_resultOfPostUserAgreement !== 'err') {
      await getUserAgreementDetails(primaryUserId, userSubscriptionId, subscriptionId);
      if (btnType === 'sendLink') {
        await funForSentLink(fileId, btnType, subtenantId, userID);
      } else {
        await postAddUserOrder();
      }
    }
  };

  const getSelectedLabel = () => {
    const mainCheckboxIds = ['check-a1-a', 'check-a1-b', 'check-a1-e', 'check-a1-ee', 'check-a1-g'];
    const subCheckboxKeys = ['health', 'housing', 'finance'];

    let mainLabel = skuListNames.includes(subsPlansGetData[0]?.skuListName)
      ? subsPlansGetData[0]?.skuListName
      : null;
  
    if (!mainLabel) {
      const mainSelectedIndex = mainCheckboxIds?.indexOf(formattedSelectedCheckbox);
      mainLabel = mainSelectedIndex !== -1 ? skuListNames[mainSelectedIndex] : null;
    }
  
    const subLabels = subCheckboxKeys
      .map((key, index) => {
        const id = `check-a1-${['k', 'l', 'm'][index]}`;
        const isChecked = formattedSelectedSubCheckboxes[id];
        const label = isChecked
          ? skuListNames[5 + index]?.replace('Comprehensive LifePlan {', '').replace('}', '')
          : null;
        return label;
      })
      .filter(Boolean);
    konsole.log( mainLabel, subLabels,"Labels")
    return { mainLabel, subLabels };
  };  

  const parseValueRemoveComma = (val) => {
    return !isNaN(parseFloat(val?.replace(/,/g, ''))) ? parseFloat(val.replace(/,/g, '')) : 0;
  };

  const postAddUserOrder = async () => {
    const { mainLabel, subLabels } = getSelectedLabel();
    const productName = subLabels?.length > 1
      ? `${mainLabel} with ${subLabels.join(' and ')} - Fee Agreement`
      : subLabels?.length === 1
        ? `${mainLabel} with ${subLabels[0]} - Fee Agreement`
        : `${mainLabel} - Fee Agreement`;

    const productList = mainLabel
      ? [
        {
          productType: "Fee_Agreement",
          productId: 3,
          productName: productName,
          quantity: 1,
          subtenantRateCardId: subsPlansGetData?.[0]?.subtenantRateCardId || subsPlansGetData[0]?.subtenantRateCardId || 7,
          productPrice: (
            parseValueRemoveComma(inputValuesSummaryOfFee?.value7 || 0) +
            (paymentChoice === "full" ? 0 : parseValueRemoveComma(inputValuesSummaryOfFee?.value6 || 0))
          ).toFixed(2),
          paidProductPrice: (
            parseValueRemoveComma(inputValuesSummaryOfFee?.value7 || 0) +
            (paymentChoice === "full" ? 0 : parseValueRemoveComma(inputValuesSummaryOfFee?.value6 || 0))
          ).toFixed(2),
          totalProductPrice:
            paymentChoice === "full"
              ? (parseValueRemoveComma(inputValuesSummaryOfFee?.value7 || 0) -
                parseValueRemoveComma(inputValuesSummaryOfFee?.value6 || 0)
              ).toFixed(2)
              : inputValuesSummaryOfFee?.value7,
          promoCode: "",
        },
      ]
      : [];

    const jsonObj = {
      userId: primaryUserId,
      createdBy: loggedInUserId,
      currencyTypeId: 2,
      isActive: false,
      isBillDetail: true,
      orderId: 0,
      paidAmt: (
        parseValueRemoveComma(inputValuesSummaryOfFee?.value7 || 0) +
        (paymentChoice === "full" ? 0 : parseValueRemoveComma(inputValuesSummaryOfFee?.value6 || 0))
      ).toFixed(2),
      paymentTypeId: 1,
      productList,
      discountAmt: 0,
      shippingCost: 0,
      taxCost: 0,
      totalCost:
        paymentChoice === "full"
          ? (parseValueRemoveComma(inputValuesSummaryOfFee?.value7 || 0) -
            parseValueRemoveComma(inputValuesSummaryOfFee?.value6 || 0)
          ).toFixed(2)
          : inputValuesSummaryOfFee?.value7,
    };

    konsole.log("jsonObjjsonObj", jsonObj)
    dispatchloader(true);
    const _resultAddUserOrder = await postApiCall('POST', $Service_Url.postAddUserOrder, jsonObj)
    dispatchloader(false);
    konsole.log("_resultAddUserOrder", _resultAddUserOrder);
    if (_resultAddUserOrder !== 'err') {
      const _newOrderId = _resultAddUserOrder?.data?.data?.order?.orderId;
      setOrderId(_newOrderId);
      sessionStorage.setItem("orderIDFromUrl", _newOrderId);
      setIsPaymentOpen(true)
    }
  }

  const fetchAndProcessFileCabinet = async () => {
    const userID = sessionStorage.getItem("UserID");
    const jsonObjbelongsTo = { belongsTo: userID };
    dispatchloader(true);

    const _resultOfFileFolder = await postApiCall("POST", $Service_Url.getFileCabinetFolderDetails, jsonObjbelongsTo);
    konsole.log(_resultOfFileFolder, "_resultOfFileFolder");
    dispatchloader(false)
    let _responseFolder = _resultOfFileFolder?.data?.data.filter(
      (item) =>
        item.belongsTo == userID &&
        item?.folderFileCategoryId == categoryFileCabinet[0] &&
        item.folderCabinetId == cabinetFileCabinetId[0]
    );

    funForAfterPaymentUpdate(_responseFolder)
  };

  const funForAfterPaymentUpdate = async (_responseFolder) => {
    const folderList = _responseFolder || allFolderList;
    const fileId = sessionStorage.getItem('nonCrisisFileId');
    const btnType = 'makeApayment';
    const subtenantID = subtenantId || sessionStorage.getItem("SubtenantId");
    const userID = primaryUserId || sessionStorage.getItem("UserID");
    const loginUserID = loggedInUserId || sessionStorage.getItem("loggedUserId");
    const result = await getSavedSubscriptionDetails([], subtenantID, userID, []);
    konsole.log("_resultOfSavedSubs", result, folderList);
    if(folderList?.length > 0) {
      await addFileCabinet(fileId, userID, loginUserID, folderList);
      if (result) {
        await updateUserSubscription(fileId, btnType, result);
        dispatchloader(true)
        const [userProfile] = await Promise.all([
          getApiCall('GET', $Service_Url.get_UserProfileDetailsByUserId + userID),
        ]);
        dispatchloader(false)
        konsole.log("_resultOfUserProfile", userProfile);
        const { customerProfileId, cards } = userProfile[0];
        const defaultCard = cards?.find(card => card.isDefault) || cards?.[0] || null;
        await addUserRecurringSubscription(result, customerProfileId, defaultCard, userID);
      }
    }
  }

  const addFileCabinet = async (fileId, userID, loginUserID, folderList) => {
    const mainFolderList = folderList || allFolderList;
    let fileCategoryId = 6;
    let fileTypeId = 59;
    let belongsTo = [{ "fileBelongsTo": userID }]
    let feeAgreementOtherForms = mainFolderList?.filter((item) => item?.folderName == specificFolderName[4]);
    let currentFolder = mainFolderList?.filter(({ folderName, parentFolderId }) => parentFolderId == feeAgreementOtherForms[0].folderId && folderName == specificFolderName[2])
    let currentFeeAgreeFolderId = allFolderList ? currentFolder[0]?.folderId : currentFolder?.folderId;
    let postJson = createFileCabinetFileAdd({ cabinetId: cabinetFileCabinetId[0], belongsTo, fileUploadedBy: loginUserID, fileCategoryId, folderId: Number(currentFeeAgreeFolderId), fileId, fileStatusId: 2, fileTypeId, primaryUserId: userID, isShared: true, isActive: true, isMandatory: true, isFolder: false, isCategory: false, })
    konsole.log(postJson, currentFeeAgreeFolderId, currentFolder, feeAgreementOtherForms,"feeAgreementOtherForms",folderList)
    return new Promise(async (resolve, reject) => {
      dispatchloader(true)
      const _resultAddFile = await postApiCall('POST', $Service_Url.postAddFileCabinet2, postJson);
      dispatchloader(false)
      if (_resultAddFile != 'err') {
        await filePermissionsApi(userID, fileId);
        resolve('resolve');
      } else {
        resolve('err')
      }
    })
  }

  const fetchAttorneyUserListNew = async (subtenantID) => {
    dispatchloader(true);
    let subtenant = sessionStorage.getItem('SubtenantId') || subtenantID;
    let inputJson = { "subtenantId": subtenant, "isActive": true, "roleId": 13, "userType": "LEGAL" };
    konsole.log("inputJson", inputJson);
    let _resultOfAttorneyUserList = await postApiCall("POST", $Service_Url.getUserListByRoleId, inputJson, "");
    dispatchloader(false)
    konsole.log("_resultOfAttorneyUserList", _resultOfAttorneyUserList);
    if (_resultOfAttorneyUserList == "err") return;
    let responseData = _resultOfAttorneyUserList?.data?.data || [];
    setLegalTeamList(responseData);
    return responseData;
  }

  const filePermissionsApi = async (userID, fileId) => {
    dispatchloader(true)
    let result = legalTeamList?.length > 0 ? legalTeamList : await fetchAttorneyUserListNew();
    konsole.log(legalTeamList, "legalTeamList", result)
    if (result !== 'err') {
      let permissionArr = []
      for (let j = 0; j < result?.length; j++) {
        const newObj = cretaeJsonForFilePermission({ fileId: fileId, belongsTo: userID, primaryUserId: userID, sharedUserId: result[j].userId, isActive: true, isDelete: false, isEdit: false, isRead: true, ...manageCreate })
        permissionArr.push(newObj)
      }
      dispatchloader(true)
      konsole.log('permissionArrpermissionArr', permissionArr)
      return new Promise((resolve, reject) => {
        Services.upsertShareFileStatus(permissionArr).then((res) => {
          konsole.log('res of upser file share', res)
          dispatchloader(false)
          resolve('resolve');
        }).catch((err) => {
          dispatchloader(false)
          konsole.log('err in upsert sharefile', err)
          resolve('err');
        })
      })
    }
  }

  const addUserRecurringSubscription = async (result, customerProfileId, cardDetails, userID) => {
    if (!customerProfileId || !cardDetails) { return; }
    let Result = (Array.isArray(subsGetData) && subsGetData?.length > 0)
      ? subsGetData : result ? result
      : await getSavedSubscriptionDetails([], subtenantId, userID, []);

    if (!Result || (Array.isArray(Result) && Result?.length === 0)) Result = result;
    const isOneTimePay = Result?.isInstallmentPlan;
    if (isOneTimePay) {
      if (!Result || (Array.isArray(Result) && Result?.length === 0) || !Result?.futurePayDate) return;
    } else {
      if (!Result || (Array.isArray(Result) && Result?.length === 0)) return;
    }
    const totalDiscount = Result?.totalDiscount;
    const isValidDiscount = totalDiscount !== null && totalDiscount !== undefined && totalDiscount !== 0 && totalDiscount !== 0.00 && totalDiscount !== '';
    const totalSubtract = isValidDiscount ? (Result?.totalPaid ?? 0) + totalDiscount : Result?.totalPaid ?? 0;
    const amountDue = (Result?.totalAmount ?? 0) - totalSubtract;
    if (Result?.totalAmount === Result?.totalPaid) { return; }
    if (amountDue <= 0) { return; }
    const futurePayDate = new Date(Result?.futurePayDate);
    const validityFrom = new Date(Result?.validityFrom);    
    const futurePayDateUTC = new Date(Date.UTC(futurePayDate.getFullYear(), futurePayDate.getMonth(), futurePayDate.getDate()));
    const validityFromUTC = new Date(Date.UTC(validityFrom.getFullYear(), validityFrom.getMonth(), validityFrom.getDate()));
    const paySchedule = Math.round((futurePayDateUTC - validityFromUTC) / (1000 * 60 * 60 * 24));
    const stateobj = sessionStorage.getItem("stateObj");
    const parsedStateObj = stateobj ? JSON.parse(stateobj) : null;
    const orderIdFromSession = sessionStorage.getItem("orderID");
    const userLoginID = parsedStateObj?.loggenInId;

    const jsonObjOfCreateSubs = {
      "userLoginId": userLoginID ?? 0,
      "userId": userID,
      "subscriptionName": "Non Crisis Fee Agreement",
      "paySchedule": { "length": paySchedule ?? 0, "unit": "days" },
      "totalOccurrences": Result?.totalInstallment,
      "amount": (Result?.installmentAmount && parseFloat(Result?.installmentAmount) !== 0) ? Result?.installmentAmount : amountDue,
      "customerProfileId": customerProfileId,
      "paymentProfileId": cardDetails?.paymentProfileId,
      "cardNumber": cardDetails?.cardNumber,
      "expirationDate": cardDetails?.expireDate,
      "userSubscriptionId": Result?.userSubscriptionId,
      "subscriptionId":  Result?.subscriptionId,
      "isOneTimePay": Result?.isInstallmentPlan == false ? true : false,
      "totalAmount": Result?.totalAmount,
      "totalDiscount": Result?.totalDiscount,
      "orderId": Result?.orderId ?? orderIdFromSession,
   }

   konsole.log(Result, jsonObjOfCreateSubs, "kkkksseeeert")
    dispatchloader(true)
    const isCardValid = $oldhelper.isValidExpiry(cardDetails?.expireDate, Result?.futurePayDate);
    if (!isCardValid) {
      dispatchloader(false);
      AlertToaster.error(`Unable to schedule auto-renewal as your card will expire before the renewal date.`);
      return;
    } else {
      const _resOneTimeRecurring = await recurringErrorHandled(jsonObjOfCreateSubs);
      if (_resOneTimeRecurring === "err") {
        dispatchloader(false);
        if (Result?.futurePayDate) {
          const formattedDate = Result?.futurePayDate
            ? new Date(Result.futurePayDate).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })
            : "";
          AlertToaster.error(`Unable to schedule next installment on ${formattedDate}. Please try again later.`);
        } else {
          dispatchloader(false);
          AlertToaster.success(`Payment scheduled successfully for ${$AHelper.$getDateFormatted(Result?.futurePayDate ?? "")}.`);
        }
        return;
      }
    }
    dispatchloader(false);
    handleFeeAgreementShowOccurrence(true);
    handleClearSearch();
  }

  const handleFeeAgreementShowOccurrence = (val) => {
    setShowAMAOccurrencePreview(val);
  }

  const handleClearSearch = () => {
    const searchItemSS = sessionStorage.getItem('searchItem');
    const emailTo = primaryEmailAddress || clientData?.primaryEmailAddress;
    let searchItem = (searchItemSS == "") ? (emailTo) : (isNullUndefine(searchItemSS) ? "" : searchItemSS);
    const newURL = window.location.pathname + `?toogle=2&search=` + encodeURIComponent(searchItem)
    konsole.log("newURL", newURL)
    window.history.pushState({ path: newURL }, '', newURL);
    sessionStorage.setItem("feeAgreementUser", '')
  }

  const funForSentLink = async (fileId, btnType, subtenantId, userID) => {
    let jsonobj = {
        "subtenantId": subtenantId,
        "linkTypeId": 3,
        "linkStatusId": 1,
        "occurrenceId": 20,
        "createdBy": loggedInUserId,
        "userId": userID,
    }
    dispatchloader(true);
    const _resultOfUserLinkgenerate = await postApiCall('POST', $Service_Url.postuserlinkgenerate, jsonobj);
    dispatchloader(false);
    konsole.log('_resultOfUserLinkgenerate', _resultOfUserLinkgenerate);
    let responseData = _resultOfUserLinkgenerate.data?.data
    let subscriptionId = 2;
    let linkstatusid = responseData?.linkStatusId
    let jsonobj2 = {
        "userSubscriptionId": subscriptionId,
        "userLinkId": linkstatusid,
        "updatedBy": loggedInUserId
    }

    dispatchloader(true);
    const _resultOfPustUserSubsLink = await postApiCall('PUT', $Service_Url.putUserSubscriptionsetLink, jsonobj2);
    dispatchloader(false);
    konsole.log("_resultOfPustUserSubsLink", _resultOfPustUserSubsLink);
    await sentTextNMail(responseData, fileId, btnType, subtenantId, userID);
  }

  useEffect(() => {
    fetchApi();
  }, []);

  const [emailObj, setEmailObj] = useState({ emailTempData: '', emailTemp: '' });
  const [textObj, setTextObj] = useState({ textTempData: '', textTemp: '' });
  const [commChannelId, setCommChannelId] = useState('');
  const fetchApi = async () => {
    const _subtenantId = sessionStorage.getItem("SubtenantId")
    if (!isNotValidNullUndefile(_subtenantId)) return;

    const occurrenceId = (orderIDFromUrl && transactionStatus === "SUCCESS") ? 28 : 19;
    dispatchloader(true)
    let jsonObj = { occurrenceId: occurrenceId, isActive: true, subtenantId: _subtenantId };
    const _resultComMediumPath = await postApiCall('POST', $Service_Url.getCommMediumPath, jsonObj);
    dispatchloader(false)

    if (_resultComMediumPath === 'err' || _resultComMediumPath?.data?.data?.length < 0) return;
    dispatchloader(true)
    const { commChannelId, applicableTextTempId, applicableEmailTempId, isActive, subtenantId } = _resultComMediumPath?.data?.data[0];
    const text_Url = `${$Service_Url.getTextTemplate}?TextTemplateId=${applicableTextTempId}&IsActive=${isActive}&SubtenantId=${subtenantId}`;
    const email_Url = `${$Service_Url.GetEmailTemplate}?TemplateId=${applicableEmailTempId}&IsActive=${isActive}&SubtenantId=${subtenantId}`;
    dispatchloader(false)
    setCommChannelId(commChannelId);

    if (commChannelId === 1) {
      const _resultEmailTemplate = await getApiCall('GET', email_Url);
      konsole.log('_resultEmailTemplate', _resultEmailTemplate);
      if (_resultEmailTemplate?.length > 0) {
        setEmailObj({ emailTempData: _resultEmailTemplate, emailTemp: _resultEmailTemplate[0]?.templateContent });
      }
    } else if (commChannelId === 2) {
      const _resultTextTemplate = await getApiCall('GET', text_Url);
      if (_resultTextTemplate?.length > 0) {
        setTextObj({ textTempData: _resultTextTemplate, textTemp: _resultTextTemplate[0]?.textTemplateContent });
      }
      konsole.log('_resultTextTemplate', _resultTextTemplate);
    } else {
      const _resultEmailTemplate = await getApiCall('GET', email_Url);
      if (_resultEmailTemplate?.length > 0) {
        setEmailObj({ emailTempData: _resultEmailTemplate, emailTemp: _resultEmailTemplate[0]?.templateContent });
      }
      konsole.log('_resultEmailTemplate', _resultEmailTemplate);

      const _resultTextTemplate = await getApiCall('GET', text_Url);
      konsole.log('_resultTextTemplate', _resultTextTemplate);
      if (_resultTextTemplate?.length > 0) {
        setTextObj({ textTempData: _resultTextTemplate, textTemp: _resultTextTemplate[0]?.textTemplateContent });
      }
    }
  };

  const replaceTemplate = (temp, generateData, fileId, btnType, subtenantId, userID) => {
    let cabinetName = 'Legal';
    let documentName = '(documentNAme)';
    let memberUserName = clientData?.memberName;
    let universallink = `${logoutUrl}account/Signin?subtenantId=${subtenantId}`
    let TemplateContent = temp;
    let UniqueLink = generateData?.uniqueLinkURL;
    let _subtenantName = sessionStorage.getItem("subtenantName");
    let _userLoggedInDetail = sessionStorage.getItem("userLoggedInDetail");
    const userLoggedInDetail = _userLoggedInDetail ? JSON.parse(_userLoggedInDetail) : {};
    
    TemplateContent = TemplateContent?.replace("@@USERNAME", memberUserName)
    TemplateContent = TemplateContent?.replace("@@LEGALPERSONNAME", userLoggedInDetail?.memberName)
    TemplateContent = TemplateContent?.replace("@@LEGALPERSONNAME ", userLoggedInDetail?.memberName)
    TemplateContent = TemplateContent?.replace("@@CABINETNAME", cabinetName)
    TemplateContent = TemplateContent?.replace("@@SUBTENANTNAME", _subtenantName)
    TemplateContent = TemplateContent?.replace("@@PARALEGALEMAIL", userLoggedInDetail?.primaryEmailId)
    TemplateContent = TemplateContent?.replace("@@UNIVERSALLINK", universallink)
    TemplateContent = TemplateContent?.replaceAll("@@UNIQUELINK", UniqueLink)
    TemplateContent = TemplateContent?.replace("some documents", 'Non-Crisis Fee Agreement document')

    return TemplateContent;
  }

  const sentTextNMail = async (generateData, fileId, btnType, subtenantId, userID) => {
    const { textTemplateType, textTemplateId } = textObj?.textTempData[0]
    const { templateType, templateId } = emailObj?.emailTempData[0];
    const emailTo = primaryEmailAddress || clientData?.primaryEmailAddress;
    const primaryMemberUserId = clientData?.memberId;
    let textTo = clientData?.primaryPhoneNumber;
    if (isClientPermissions != true) {
        textTo = ''
    }
    const emailSubject = "Non-Crisis Fee Agreement Process";
    const emailJson = createSentEmailJsonForOccurrene({
        emailType: templateType,
        emailTo: emailTo,
        emailSubject,
        emailContent: replaceTemplate(emailObj?.emailTemp.replace(/Annual Maintenance Agreement/g, "Non-Crisis Fee Agreement"), generateData),
        emailTemplateId: templateId,
        emailMappingTablePKId: primaryMemberUserId,
        emailStatusId: 1,
        emailMappingTablePKId: primaryMemberUserId,
        createdBy: loggedInUserId,
    })
    const textJson = createSentTextJsonForOccurrene({
        smsType: textTemplateType,
        textTo: textTo,
        textContent: replaceTemplate(textObj?.textTemp.replace(/Annual Maintenance Agreement/g, "Non-Crisis Fee Agreement"), generateData),
        smsTemplateId: textTemplateId,
        smsMappingTablePKId: primaryMemberUserId,
        smsStatusId: 1,
        smsMappingTablePKId: primaryMemberUserId,
        createdBy: loggedInUserId,

    });
    konsole.log("textJson", textJson, emailJson)
    dispatchloader(true)
    const _resultSentEmailtext = await sentMail(emailJson, textJson);
    konsole.log('_resultSentEmailtext', _resultSentEmailtext)
    dispatchloader(false)
    if (_resultSentEmailtext === 'resolve' && orderIDFromUrl && transactionStatus === "SUCCESS") {
      AlertToaster.success(
          "Non-Crisis Fee Agreement generated successfully."
      );
  } else if (_resultSentEmailtext === 'resolve') {
      AlertToaster.success("Fee Agreement Link sent successfully.");
  }
    return;
  }

  const modalCLose = () => {
    setShowAMAOccurrencePreview(false);
  };

  const sentMail = async (emailJson, mobileJson) => {
    return new Promise(async (resolve, reject) => {
        try {
            dispatchloader(true);
            if (commChannelId === 2 && isNotValidNullUndefile(mobileJson?.textTo)) {
                const _resultTextSent = await postApiCall('POST', $Service_Url.postSendTextPath, mobileJson);
                konsole.log("_resultTextSent", _resultTextSent);

                dispatchloader(false);
                resolve('resolve');
            } else if (commChannelId === 1) {
                const _resultEmailSent = await postApiCall('POST', $Service_Url.sentEmailWithAsyncCcBc, emailJson);
                konsole.log('_resultEmailSent', _resultEmailSent);

                dispatchloader(false);
                resolve('resolve');
            } else {
                const _resultEmailSent = await postApiCall('POST', $Service_Url.sentEmailWithAsyncCcBc, emailJson);
                konsole.log('_resultEmailSent', _resultEmailSent);
                if (isNotValidNullUndefile(mobileJson?.textTo)) {
                    const _resultTextSent = await postApiCall('POST', $Service_Url.postSendTextPath, mobileJson);
                    konsole.log("_resultTextSent", _resultTextSent);
                    resolve('resolve');
                } else {
                    resolve('resolve');
                }
            }
            dispatchloader(false);
            resolve('resolve');
            modalCLose();
        } catch (error) {
            konsole.error('Error in sending mail or text:', error);
            dispatchloader(false);
            resolve(error);
        }
    });
};

  function checkedClass(section, key, value, subKey) {
    konsole.log(section, key, value, subKey, "sectionAndKey");
    let updatedSection = {};
    if (section === 'firmProvided') {
      updatedSection = { ...firmProvidedServices };
      if (!subKey) {
        updatedSection[key].Checked = value;
        if (updatedSection[key]?.subFirmProvidedServiceObject) {
          Object.keys(updatedSection[key].subFirmProvidedServiceObject).forEach(childKey => {
            if (["C-1", "C-2"].includes(childKey) || ["F-1", "F-2"].includes(childKey)) {
              updatedSection[key].subFirmProvidedServiceObject[childKey].Checked = value;
            }
          });
        }
      }
      if (subKey) {
        updatedSection[key].subFirmProvidedServiceObject[subKey].Checked = value;
        if (!value) {
          const anyChildChecked = Object.entries(updatedSection[key].subFirmProvidedServiceObject || {})
            .filter(([childKey]) => ["C-1", "C-2", "F-1", "F-2"].includes(childKey))
            .some(([, child]) => child.Checked);

          updatedSection[key].Checked = anyChildChecked;
        }
      }
      konsole.log(updatedSection[key], "updatedSectionKey", subKey);
      setFirmProvidedServices(updatedSection);
    }

    else if (section === 'thirdParty') {
      updatedSection = { ...thirdPartyProvided };
      updatedSection[key].Checked = value;
      if(subKey) updatedSection[key].subFirmProvidedServiceObject[subKey].Checked = value;
      setThirdPartyProvided(updatedSection);
    }
  }

  function toCamelCase(str) {
    if (typeof str !== 'string') { return}
    return str
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
      .replace(/\s+/g, '');
  }

  const checkboxKeyMapping = {
    "Legal Planning": "check-a1-a",
    "Legal LifePlanning": "check-a1-b",
    "Update Planning": "check-a1-e",
    "Guided Planning": "check-a1-ee",
    "Comprehensive LifePlan": "check-a1-g",
    "health": "check-a1-k",
    "housing": "check-a1-l",
    "finance": "check-a1-m",
    "Comprehensive LifePlan {Health}": "check-a1-k",
    "Comprehensive LifePlan - health": "check-a1-k",
    "Comprehensive LifePlan {Housing}": "check-a1-l",
    "Comprehensive LifePlan - housing": "check-a1-l",
    "Comprehensive LifePlan {Finance}": "check-a1-m",
    "Comprehensive LifePlan - finance": "check-a1-m",
  };

  const handleMainCheckboxChange = (e, key) => {
    const matchedSkuListName = subsPlansGetData[0]?.skuListName == key; 
    if (selectedChargeType && selectedChargeType !== key) {
      if (!matchedSkuListName && shouldResetAgreement) {
        resetAgreementCheckbox();
        setShouldResetAgreement(false);
      } else {
        setShouldResetAgreement(true);
      }
    }
    setSelectedChargeType(key);
    if (showModalBodyPrimary && !fromFeeAgreement) {
      const formattedKey = checkboxKeyMapping[key] || toCamelCase(key);
      const formattedKeyforChecked = toCamelCase(key);
      if (key) {
        setSelectedCheckbox(e);
        setFormattedSelectedCheckbox(formattedKey);
        subCheckedClass(formattedKeyforChecked, true);
      } else {
        setSelectedCheckbox("");
        setFormattedSelectedCheckbox("");
        subCheckedClass(formattedKeyforChecked, false);
      }
    } else {
      const { id, checked } = e.target;
      const formattedKey = toCamelCase(key);
      if (checked) {
        setSelectedCheckbox(id);
        subCheckedClass(formattedKey, true);
      } else {
        setSelectedCheckbox("");
        subCheckedClass(formattedKey, false);
      }
    }
  };

  const handleSubCheckboxChange = (e, key) => {
    if (showModalBodyPrimary && !fromFeeAgreement) {
      const formattedKey = checkboxKeyMapping[key] || key;
      const formattedKeyforChecked = toCamelCase(key);
      setManualSubCheckboxClicks((prev) => ({
        ...prev,
        [toCamelCase(key)]: true
      }));
      setSelectedSubCheckboxes((prev) => {
        const updatedCheckboxes = { ...prev };
        if (e) {
          updatedCheckboxes[formattedKey] = true;
        } else {
          delete updatedCheckboxes[formattedKey];
        }
        return updatedCheckboxes;
      });
      setFormattedSelectedSubCheckboxes((prev) => ({
        ...prev,
        [formattedKey]: e ? true : false,
      }));
      subCheckedClass(formattedKeyforChecked, e ? true : false);
    } else {
      const { id, checked } = e.target;
      const formattedKey = toCamelCase(key);
      setSelectedSubCheckboxes((prev) => {
        let updatedCheckboxes = { ...prev };
        if (checked) {
          updatedCheckboxes[id] = true;
        } else {
          delete updatedCheckboxes[id];
        }
        return updatedCheckboxes;
      });
      subCheckedClass(formattedKey, checked);
    }
  };

  const isChecked = (checkboxId) => {
    return subsPlansGetData.some((item) => item.skuListName === checkboxId);
  };

  const getSubCheckedKey = (subsPlansGetData) => {
    let subCheckedKey = null;
  
    if (subsPlansGetData[0]?.skuListName?.includes("Comprehensive LifePlan")) {
      if (subsPlansGetData[0]?.skuListName.includes("{Health}")) {
        subCheckedKey = "health";
      } else if (subsPlansGetData[0]?.skuListName.includes("{Housing}")) {
        subCheckedKey = "housing";
      } else if (subsPlansGetData[0]?.skuListName.includes("{Finance}")) {
        subCheckedKey = "finance";
      }
    } else if (subsPlansGetData[1]?.skuListName?.includes("Comprehensive LifePlan")) {
      if (subsPlansGetData[1]?.skuListName.includes("{Health}")) {
        subCheckedKey = "health";
      } else if (subsPlansGetData[1]?.skuListName.includes("{Housing}")) {
        subCheckedKey = "housing";
      } else if (subsPlansGetData[1]?.skuListName.includes("{Finance}")) {
        subCheckedKey = "finance";
      }
    } else {
      switch (subsPlansGetData[0]?.skuListName) {
        case "Legal Planning":
        case "Legal LifePlanning":
        case "Update Planning":
        case "Guided Planning":
          subCheckedKey = toCamelCase(subsPlansGetData[0]?.skuListName);
          break;
        default:
          break;
      }
    }
  
    return subCheckedKey;
  };  

  useEffect(() => {
    let subCheckedKey = getSubCheckedKey(subsPlansGetData);
  
    if (subCheckedKey && subCheckedKey !== currentCheckedKey) {
      setCurrentCheckedKey(subCheckedKey);
  
      const triggerCheck = ["housing", "health", "finance"];
      let selectedKeys = triggerCheck.filter((key) => selectedCheckbox?.label === key);
  
      if (selectedKeys?.length > 0 || selectedCheckbox?.label === "comprehensiveLifePlan") {
        subCheckedClass("comprehensiveLifePlan", true);
  
        selectedKeys.forEach((key) => subCheckedClass(key, true));
  
        if (subsPlansGetData[0]?.skuListName !== "comprehensiveLifePlan") {
          subCheckedClass(toCamelCase(subsPlansGetData[0]?.skuListName), false);
        }
      } else {
        if (selectedCheckbox?.label !== subsPlansGetData[0]?.skuListName) {
          subCheckedClass(toCamelCase(subsPlansGetData[0]?.skuListName), true);
        } else if (selectedCheckbox?.label === undefined && subsPlansGetData[0]?.skuListName) {
          subCheckedClass(toCamelCase(subsPlansGetData[0]?.skuListName), true);
        } else {
          subCheckedClass(toCamelCase(subCheckedKey), true);
        }
      }
    }
  }, [subsPlansGetData, currentCheckedKey, selectedCheckbox?.label]);
  
  function subCheckedClass(key, value) {
    konsole.log(key, value,"subCheckedClassKeyValue", selectedCheckbox?.label, subsPlansGetData[0]?.skuListName)
    if (!key) return;
    let updatedStateFirmProvided = { ...firmProvidedServices };
    let updatedStateThirdParty = { ...thirdPartyProvided };
  
    const firmProvidedOptionsMap = {
      legalPlanning: ['C', 'C-1', 'C-2', 'D', 'E', 'F', 'F-1', 'F-2', 'G', 'H', 'I', 'J', 'L', 'M', 'N'],
      legalLifePlanning: ['A', 'B', 'C', 'C-1', 'C-2', 'D', 'E', 'F', 'F-1', 'F-2', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
      updatePlanning: ['B', 'C', 'C-1', 'C-2', 'D', 'E', 'F', 'F-1', 'F-2', 'G', 'H', 'I', 'J', 'L', 'M', 'N'],
      guidedPlanning: ['B', 'C', 'C-1', 'C-2', 'D', 'E', 'F', 'F-1', 'F-2', 'G', 'H', 'I', 'J', 'L', 'M', 'N'],
      comprehensiveLifePlan:['A', 'B', 'C', 'C-1', 'C-2', 'D', 'E', 'F', 'F-1', 'F-2', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
    };
  
    const thirdPartyOptionsMap = {
      legalPlanning: ['A', 'B', 'C', 'D', 'E'],
      housing: ['A', 'D'],
      health: ['E', 'F'],
      finance: ['B', 'C'],
    };

    // Uncheck all options in thirdPartyOptionsMap for firm-provided services
    if (firmProvidedOptionsMap.hasOwnProperty(key)) {
      Object.keys(thirdPartyOptionsMap).forEach(mapKey => {
        thirdPartyOptionsMap[mapKey].forEach(option => {
          if (updatedStateThirdParty[option]) {
            updatedStateThirdParty[option].Checked = false;
          }
          Object.keys(updatedStateThirdParty).forEach(mainKey => {
            if (updatedStateThirdParty[mainKey].subFirmProvidedServiceObject && updatedStateThirdParty[mainKey].subFirmProvidedServiceObject[option]) {
              updatedStateThirdParty[mainKey].subFirmProvidedServiceObject[option].Checked = false;
            }
          });
        });
      });
    }
    
    // Uncheck all options not present in the selected key's options list for firmProvidedOptionsMap
    Object.keys(updatedStateFirmProvided).forEach(mainKey => {
      const optionsToKeepChecked = firmProvidedOptionsMap[mainKey] || [];
      if (!optionsToKeepChecked.includes(mainKey)) {
          updatedStateFirmProvided[mainKey].Checked = false;
          if (updatedStateFirmProvided[mainKey].subFirmProvidedServiceObject) {
              Object.keys(updatedStateFirmProvided[mainKey].subFirmProvidedServiceObject).forEach(subKey => {
                  updatedStateFirmProvided[mainKey].subFirmProvidedServiceObject[subKey].Checked = false;
              });
          }
      }
    });
  
    // Handle checking/unchecking of firmProvided services
    if (firmProvidedOptionsMap.hasOwnProperty(key)) {
      const firmProvidedCheckedOptions = firmProvidedOptionsMap[key];
      firmProvidedCheckedOptions.forEach(option => {
        if (updatedStateFirmProvided[option]) {
          updatedStateFirmProvided[option].Checked = value;
        } else {
          Object.keys(updatedStateFirmProvided).forEach(mainKey => {
            if (updatedStateFirmProvided[mainKey].subFirmProvidedServiceObject && updatedStateFirmProvided[mainKey].subFirmProvidedServiceObject[option]) {
              updatedStateFirmProvided[mainKey].subFirmProvidedServiceObject[option].Checked = value;
            }
          });
        }
      });
      setFirmProvidedServices(updatedStateFirmProvided);
    } else {
      konsole.log("Invalid key:", key);
    }
  
    // Handle checking/unchecking of thirdParty services
    if (thirdPartyOptionsMap.hasOwnProperty(key)) {
      const thirdPartyCheckedOptions = thirdPartyOptionsMap[key];
      thirdPartyCheckedOptions.forEach(option => {
          if (updatedStateThirdParty[option]) {
              updatedStateThirdParty[option].Checked = value;
          } 
      });
  
      // Ensure comprehensiveLifePlan is also checked when health, housing, or finance are selected
      if (['health', 'housing', 'finance'].includes(key)) {
          const firmProvidedCheckedOptions = firmProvidedOptionsMap['comprehensiveLifePlan'];
          firmProvidedCheckedOptions.forEach(option => {
              if (updatedStateFirmProvided[option]) {
                  updatedStateFirmProvided[option].Checked = true;
              } Object.keys(updatedStateFirmProvided).forEach(mainKey => {
                if (updatedStateFirmProvided[mainKey].subFirmProvidedServiceObject &&
                    updatedStateFirmProvided[mainKey].subFirmProvidedServiceObject[option]) {
                    updatedStateFirmProvided[mainKey].subFirmProvidedServiceObject[option].Checked = true;
                }
            });
        });
      }
  
      // Handle additional checking logic for multiple selections
      const selectedKeys = ['housing', 'health', 'finance'];
      let combinedOptions = [];
      selectedKeys.forEach(selectedKey => {
        if (updatedStateThirdParty[selectedKey] && updatedStateThirdParty[selectedKey].Checked) {
          combinedOptions = [...combinedOptions, ...thirdPartyOptionsMap[selectedKey]];
        }
      });
  
      combinedOptions.forEach(option => {
        if (updatedStateThirdParty[option]) {
          updatedStateThirdParty[option].Checked = true;
        } else {
          Object.keys(updatedStateThirdParty).forEach(mainKey => {
            if (updatedStateThirdParty[mainKey].subFirmProvidedServiceObject && updatedStateThirdParty[mainKey].subFirmProvidedServiceObject[option]) {
              updatedStateThirdParty[mainKey].subFirmProvidedServiceObject[option].Checked = true;
            }
          });
        }
      });
  
      konsole.log("Updated State (Third Party):", updatedStateThirdParty);
      setThirdPartyProvided(updatedStateThirdParty);
    } else {
      konsole.log("Invalid key:", key);
    }
    
    if (!updatedStateThirdParty['I']) {
      updatedStateThirdParty['I'] = {};
    }
    
    if (value && checkedValueOfPlan === '750.00') {
      updatedStateThirdParty['I'].Checked = true;
    } else {
      updatedStateThirdParty['I'].Checked = false;
    }
    
    // setThirdPartyProvided(updatedStateThirdParty);    
  }  

  const setAllCheckboxesFalse = () => {
    const updatedFirmProvided = { ...firmProvidedServicesObject };
    const updatedThirdParty = { ...thirdPartyProvidedObject };
  
    Object.keys(updatedFirmProvided).forEach(key => {
      updatedFirmProvided[key].Checked = false;
      if (updatedFirmProvided[key].subFirmProvidedServiceObject) {
        Object.keys(updatedFirmProvided[key].subFirmProvidedServiceObject).forEach(subKey => {
          updatedFirmProvided[key].subFirmProvidedServiceObject[subKey].Checked = false;
        });
      }
    });
  
    Object.keys(updatedThirdParty).forEach(key => {
      updatedThirdParty[key].Checked = false;
    });
  
    setFirmProvidedServices(updatedFirmProvided);
    setThirdPartyProvided(updatedThirdParty);
  };
  
  const handleShowFeeAgreement = (value) => {
    setShowFeeAgreement(value);
    if (!value) {
      setAllCheckboxesFalse();
    }
  };

  const handleEditableDescriptionChange = (key, event) => {
    const newDescription = event?.target?.value;
    setFirmProvidedServices(prevState => {
      const updatedServices = { ...prevState };
      if (updatedServices[key].EditableDescription !== undefined) {
        updatedServices[key].EditableDescription = newDescription;
      }
      return updatedServices;
    });
  };

  const keysForFirmProvidedCombined = Object.keys(firmProvidedServices);
  const firmProvidedCombinedServices = keysForFirmProvidedCombined.map((key) => ({
    key,
    ...firmProvidedServices[key],
  }));

  const keysForThirdPartyCombined = Object.keys(thirdPartyProvided);
  const thirdPartyCombinedServices = keysForThirdPartyCombined.map((key) => ({
    key,
    ...thirdPartyProvided[key],
  }));

  const handleProceedButton = () => {
    const isSkuMatch = skuListNames.includes(subsPlansGetData[0]?.skuListName);

    if (!selectattornetvalue) {
      staticAlertTimer("Please select a Legal Staff to proceed.");
      return;
    } 
    if (!matterNumber || matterNumber.trim() === "") {
      staticAlertTimer("Enter the Matter Number before proceeding.");
      return;
    } 
    if (selectedCheckbox?.label === "Comprehensive LifePlan" && (!selectedSubCheckboxes || selectedSubCheckboxes?.length === 0)) {
      staticAlertTimer("Please select a Provided Service under Comprehensive LifePlan.");
      return;
    } 
    if (!showHourlyBody && !showFlatFeeBody) {
      staticAlertTimer("Select either Hourly Basis or Flat Fee Basis before proceeding.");
      return;
    } 
    if (!showFirmProvided) {
      staticAlertTimer("Select Firm Provided Services to continue.");
      return;
    } 
    if (isSkuMatch === false && showFirmProvided && (!selectedCheckbox || (typeof selectedCheckbox === "object" && Object.keys(selectedCheckbox)?.length === 0))) {
      staticAlertTimer("Choose a Firm Provided Services Plan.");
      return;
    } 
    if (
      selectedCheckbox?.value === "Comprehensive LifePlan" &&
      (typeof selectedSubCheckboxes === "object" && Object.keys(selectedSubCheckboxes)?.length === 0)
    ) {
      staticAlertTimer("Select a Plan under Comprehensive LifePlan.");
      return;
    }

    setShowModalBodyPrimary(false);
    setActiveModal("second"); 
    setShowFeeAgreement(true);
    calculateInitialValues();
    updateFamilyMembers(matterNumber);
  };

  const handleViewButton = () => {
    if (!isNullUndefine(orderId)) {
      const jsonObj = {
        userId: client?.memberId || sessionStorage.getItem('UserID'),
        requestedBy: loggedInUserId,
        fileCategoryId: 6,
        fileTypeId: 59,
        fileId: subsFileId,
      };
      setFileInfo({
        ...fileInfo,
        ...jsonObj,
      });
      setIsFileViewerOpen(true);
      return;
    }
  };
  
  // Filter the options array to remove null, undefined, and empty string values
  const filteredOptionsattorneyUserListvaluelabel = attorneyUserListvaluelabel.filter(option =>
    option.label && option.label.trim() !== ''
  );

  useEffect(() => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    today.setHours(0, 0, 0, 0);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${month}-${day}-${year}`;
    if (!selectedDate) {
      setSelectedDate(formattedDate);
    }
  }, [selectedDate]);

  // const handleDateChange = (event) => {
  //   const dateValue = event.target.value;
  //   setSelectedDate(dateValue || getFormattedTodayDate());
  // };

  const getFormattedTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!showHourlyBody && !showFlatFeeBody) {
      setShowFeeAgreement(false);
    }
  }, [showHourlyBody, showFlatFeeBody]);

  const staticAlertTimer = ( text ) => {
    if(alertState == true) {
      AlertToaster.error(text);
      setalertState(false);
      setTimeout(() => setalertState(true), [5000]);
    }
  } 

  useEffect(() => {
    if (subsGetData?.isHourly) {
      setShowHourlyBody(true);
    }
    if (subsGetData?.isFlatFee) {
      setShowFlatFeeBody(true);
    }
  }, [subsGetData]);

  const toggleState = (setter, dependentSetters = []) => {
    setter(prev => {
      const newState = !prev;
      if (!newState) {
        dependentSetters.forEach(setterFunc => setterFunc(false));
      }
      return newState;
    });
  };

  const resetAgreementChargeType = () => {
    setShowHourlyBody(false);
    setShowFlatFeeBody(false);
    setShowFeeAgreement(false);
    setSelectedCheckbox(null);
    setUserAgreementDetails([]);
    setFirmProvidedServices(firmProvidedServicesObject);
    setThirdPartyProvided(thirdPartyProvidedObject);
  };
  
  const resetAgreementCheckbox = () => {
    const previousFirmProvidedState = showFirmProvided;
    setShowFeeAgreement(false);
    setShowWithProvided(false);
    setSelectedCheckbox(null);
    setUserAgreementDetails([]);
    setFirmProvidedServices(firmProvidedServicesObject);
    setThirdPartyProvided(thirdPartyProvidedObject);
    setShowFirmProvided(previousFirmProvidedState);
  };
  
  const handleChargeTypeChange = (type) => {
    const matchedSkuListName = subsPlansGetData[0]?.skuListName == type;
    if (selectedChargeType && selectedChargeType !== type) {
      if (!matchedSkuListName && shouldResetAgreement) {
        resetAgreementChargeType();
        setShouldResetAgreement(false);
      } else {
        setShouldResetAgreement(true);
      }
    }
    setSelectedChargeType(type);
    setShowHourlyBody(type === 'hourly');
    setShowFlatFeeBody(type === 'flat');
    setShowFeeAgreement(false);
  };
  
  const handleHourlyCheckboxChange = () => handleChargeTypeChange('hourly');
  const handleFlatFeeCheckboxChange = () => handleChargeTypeChange('flat');
  const handleWithCheckboxChange = () => toggleState(setShowWithProvided);
  const handleFirmProvidedCheckboxChange = () => {};

  const handleInputChangeHourlyRate = (e, rateKey) => {
    let newValue = e.target.value.replace(/[^0-9.]/g, '');
    if (newValue === '.' || newValue === '') {
        newValue = '';
    }
    setHourlyRateParalegalsClient(prevRates => ({
        ...prevRates,
        [rateKey]: newValue,
    }));
  };

  const handleBlurHourlyRate = (e, rateKey) => {
      let newValue = e.target.value.replace(/[^0-9.]/g, '');
      if (newValue === '' || newValue === '0' || newValue === '0.') {
          newValue = '0.00';
      } else if (!newValue.includes('.')) {
          newValue += '.00';
      } else if (newValue.split('.')[1]?.length === 1) {
          newValue += '0';
      }
      setHourlyRateParalegalsClient(prevRates => ({
          ...prevRates,
          [rateKey]: newValue,
      }));
  };

  const handleThirdPartyChange = (key, field, value) => {
    setThirdPartyProvided((prevState) => ({
        ...prevState,
        [key]: {
            ...prevState[key],
            [field]: value
        },
    }));
  };

  const addNewRowA = (key) => {
    const nextKey = String.fromCharCode(key.charCodeAt(0) + 1);
    if (nextKey > 'Z') return;

    setFirmProvidedServices((prevState) => ({
        ...prevState,
        [nextKey]: {
            Checked: false,
            Description: '',
            EditableDescription: '',
            subFirmProvidedServiceObject: {},
        },
    }));
  };
  
  const removeRowA = (key) => {
    const updatedFirmProvidedServices = { ...firmProvidedServices };
    delete updatedFirmProvidedServices[key];
    setFirmProvidedServices(updatedFirmProvidedServices);
  };

  const addNewRowB = (key) => {
    const nextKey = String.fromCharCode(key.charCodeAt(0) + 1);
    if (nextKey > 'Z') return;

    setThirdPartyProvided((prevState) => ({
        ...prevState,
        [nextKey]: {
            Checked: false,
            Description: '',
            serviceProvider: '',
            curCost: '',
            costOptions: [],
        },
    }));
  };
  
  const removeRowB = (key) => {
    const updatedThirdPartyProvided = { ...thirdPartyProvided };
    delete updatedThirdPartyProvided[key];
    setThirdPartyProvided(updatedThirdPartyProvided);
  };

  // Function to add a new row for sub-services
  const addNewRowC = (key) => {
    setFirmProvidedServices((oldState) => {
      const newObj = { ...oldState[key] };
      const curSubListLen = Object.keys(newObj.subFirmProvidedServiceObject)?.length || 0;
  
      newObj.subFirmProvidedServiceObject = {
        ...newObj.subFirmProvidedServiceObject,
        [`${key}-999999${curSubListLen}`]: {
          Checked: false,
          Description: 'Other: ',
          EditableDescription: '',
        },
      };
  
      const finalObj = { ...oldState, [key]: newObj };
      konsole.log(finalObj, 'finalObj');
  
      return finalObj;
    });
  };

  // Function to remove the last row for sub-services
  const removeRowC = (key) => {
    setFirmProvidedServices((oldState) => {
      const newObj = { ...oldState[key] };
      const subServices = newObj.subFirmProvidedServiceObject;
  
      const initialRows = ['C-1', 'C-2', 'C-999999'];
      const subServiceKeys = Object.keys(subServices).filter((subKey) => !initialRows.includes(subKey));
  
      const lastSubServiceKey = subServiceKeys.pop();
      if (lastSubServiceKey) {
        delete subServices[lastSubServiceKey];
      }
  
      const finalObj = { ...oldState, [key]: newObj };
  
      return finalObj;
    });
  };

  useEffect(() => {
    if (selectedCheckbox?.label) {
      setInputValuesSummaryOfFee((prevState) => ({
        ...prevState,
        value6: "0.00",
        value7: "0.00",
      }));
    } else if (subsGetData?.totalPaid || fromFeeAgreement) {
      setInputValuesSummaryOfFee((prevState) => {
        const updatedValue7 = subsGetData?.totalPaid 
          ? parseFloat(subsGetData.totalPaid).toFixed(2) 
          : prevState.value7;
  
        const updatedValue4 = fromFeeAgreement
          ? computeValue4(prevState?.value1, prevState?.value2, showFlatFeeBody)
          : prevState.value4;
  
        const updatedTotalCost = fromFeeAgreement ? calculateTotalCost : prevState.totalCost;
        const updatedValue5 = fromFeeAgreement ? computeValue5(updatedValue4, updatedTotalCost) : prevState.value5;
        const updatedValue8 = fromFeeAgreement ? computeValue8(updatedValue5, prevState?.value6, updatedValue7) : prevState.value8;
        const updatedValue6 = subsGetData?.totalDiscount 
          ? parseFloat(subsGetData.totalDiscount).toFixed(2) 
          : prevState.value6;
  
        return {
          ...prevState,
          value7: updatedValue7,
          value4: updatedValue4,
          value5: updatedValue5,
          value6: updatedValue6,
          value8: updatedValue8,
          totalCost: updatedTotalCost,
        };
      });
  
      setSendLinkRender(prev => !prev);
    }
  }, [subsGetData?.totalPaid]);

  const calculateTotalCost = useMemo(() => {
    let totalCost = 0;
  
    const parseNumericValue = (value) => {
      const numericValue = parseFloat(value.replace(/,/g, ''));
      return isNaN(numericValue) ? 0 : numericValue;
    };

    thirdPartyCombinedServices
    .filter(service => service.Checked)
    .forEach(service => {
      const costValue = parseNumericValue(service.curCost);
      totalCost += costValue;
    });

    const hourlyServiceCost = parseNumericValue(inputValuesSummaryOfFee?.value3);
    totalCost += hourlyServiceCost;
  
    return totalCost;
  }, [thirdPartyCombinedServices, inputValuesSummaryOfFee?.value3]);

  const handleInputFocusSummaryOfFees = async(e, inputName) => {
    const currentValue = inputValuesSummaryOfFee[inputName];
    if (inputName === "value3" || inputName === "value6" || inputName === "value7" || inputName === "value4") {
      if (currentValue === "0.00") {
          setConfirmedInputs((prev) => ({ ...prev, [inputName]: true }));
          setInputValuesSummaryOfFee((prevState) => ({
              ...prevState,
              [inputName]: "",
          }));
      }
      else {
          setConfirmedInputs((prev) => ({ ...prev, [inputName]: true }));
          setInputValuesSummaryOfFee((prevState) => ({
              ...prevState,
              [inputName]: currentValue,
          }));
      }
      return;
    }

    // IF VALUE 1 AND VALUE 2 ARE CHANGEABLE, THEN UNCOMMENT THIS CODE; ELSE, DO NOT TOUCH.  
    // if (inputName !== "value1" && inputName !== "value2") {
    //   return;
    // }
    // if (currentValue === "0.00" || currentValue === "" || currentValue === "0") {
    //   return;
    // }
    // if (confirmedInputs[inputName]) return;
    // const userConfirmed = await newConfirm(true, `Are you sure you want to change this value?`, 'Permission', 'Confirmation',);
    // if (!userConfirmed) {
    //   e.target.blur();
    //   return;
    // }
    // setConfirmedInputs((prev) => ({ ...prev, [inputName]: true }));
    // setInputValuesSummaryOfFee((prevState) => ({
    //   ...prevState,
    //   [inputName]: "",
    // }));

    // IF VALUE 1 AND VALUE 2 ARE NON-CHANGEABLE, THEN THIS CODE STAYS UNCOMMENTED; ELSE, COMMENT IT.  
    if (inputName === "value1" || inputName === "value2") {
      if (confirmedInputs[inputName]) return;

      setConfirmedInputs((prev) => ({ ...prev, [inputName]: true }));
      setInputValuesSummaryOfFee((prevState) => ({
          ...prevState,
          [inputName]: prevState[inputName] || "0.00",
      }));
  }
  };

  const handleInputChangeSummaryOfFees = (e, inputName) => {
    const { value } = e.target;
    value = value.replace(/[^0-9.]/g, '');

    if ((value.match(/\./g) || [])?.length > 1) {
        return;
    }
    setInputValuesSummaryOfFee((prevState) => {
      const parseNumericValue = (value) => {
          if (value === '') {
              return '';
          }
          const numericValue = parseFloat(value.replace(',', ''));
          return isNaN(numericValue) ? 0 : numericValue;
      };

      const numericValue = parseNumericValue(value);
      const formattedValue = numericValue === '' ? '0.00' : numericValue.toFixed(2);
      formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
      const updatedState = {
          ...prevState,
          [inputName]: formattedValue,
      };

      return updatedState;
    });

    updateDependentValues(inputName, value);
  };

  const handleInputBlurSummaryOfFees = (inputName) => {
    setConfirmedInputs((prev) => ({ ...prev, [inputName]: false }));
    setInputValuesSummaryOfFee((prevState) => {
      const parseNumericValue = (value) => {
          if (value === '') {
              return 0;
          }
          const numericValue = parseFloat(value.replace(',', ''));
          return isNaN(numericValue) ? 0 : numericValue;
      };

      const rawValue = prevState[inputName];
      if (!confirmedInputs[inputName]) {
        return prevState;
      }
      const numericValue = parseNumericValue(rawValue);
      const formattedValue = rawValue === '' ? '0.00' : numericValue.toFixed(2);
      if ((inputName === "value1" || inputName === "value2") && formattedValue === "0.00") {
        AlertToaster.error(`Please enter a valid amount before proceed.`);
      }
      formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
      const updatedState = {
          ...prevState,
          [inputName]: formattedValue,
      };

      return updatedState;
  });

    updateDependentValues(inputName);
  };

  const updateDependentValues = (inputName, value) => {
    if (value === undefined || value === null) {
      value = '';
    }
  
    const valueWithoutCommas = value.replace(/,/g, '');
  
    setInputValuesSummaryOfFee((prevState) => {
      const updatedState = {
        ...prevState,
        [inputName]: valueWithoutCommas || prevState[inputName],
      };
  
      const num1 = parseFloat(updatedState.value1?.replace(/,/g, '') || '0');
      const num2 = parseFloat(updatedState.value2?.replace(/,/g, '') || '0');
  
      if (inputName === 'value1' || inputName === 'value2') {
        updatedState.value4 = computeValue4(num1, num2, showFlatFeeBody);
      }
  
      const num4 = parseFloat(updatedState.value4?.replace(/,/g, '') || '0');
      const num5 = parseFloat(updatedState.value5?.replace(/,/g, '') || '0');
  
      updatedState.value5 = computeValue5(num4, calculateTotalCost);
      updatedState.value8 = computeValue8(updatedState.value5, updatedState.value6, updatedState.value7);
      return updatedState;
    });
  };  
  
  const computeValue4 = (value1, value2, showFlatFeeBody) => {
    const parseNumericValue = (value) => {
      const numericValue = parseFloat(String(value)?.replace(',', ''));
      return isNaN(numericValue) ? 0 : numericValue;
    };
  
    const num1 = parseNumericValue(value1);
    const num2 = parseNumericValue(value2);
    const totalNum = num1 + num2;
  
    return showFlatFeeBody ? totalNum.toFixed(2) : num1.toFixed(2);
  };
  
  const computeValue5 = (value4, totalCost) => {
    konsole.log(value4, totalCost,"totalCostValue")
    const parseNumericValue = (value) => {
      const numericValue = parseFloat(String(value)?.replace(',', ''));
      return isNaN(numericValue) ? 0 : numericValue;
    };
  
    const num4 = parseNumericValue(value4);
    return (num4 + totalCost).toFixed(2);
  };
  
  const computeValue8 = (value5, value6, value7) => {
    const parseNumericValue = (value) => {
      const numericValue = parseFloat(String(value)?.replace(',', ''));
      return isNaN(numericValue) ? 0 : numericValue;
    };
  
    const num5 = parseNumericValue(value5);
    const num6 = parseNumericValue(value6);
    const num7 = parseNumericValue(value7);
  
    const amountDue = num5 - (num6 + num7);
    const finalAmountDue = Math.max(amountDue, 0);
  
    return finalAmountDue.toFixed(2);
  };
  
  const calculateInitialValues = () => {
    const initialValue4 = computeValue4(inputValuesSummaryOfFee?.value1, inputValuesSummaryOfFee?.value2, showFlatFeeBody);
    const initialValue5 = computeValue5(initialValue4, calculateTotalCost);
    const initialValue8 = computeValue8(initialValue5, inputValuesSummaryOfFee?.value6, inputValuesSummaryOfFee?.value7);
  
    setInputValuesSummaryOfFee(prevState => ({
      ...prevState,
      value4: initialValue4,
      value5: initialValue5,
      value8: initialValue8
    }));
  };
  
  const handleInputChangeThirdParty = (key, value, fromDropdown = false) => {
    if (value === "Waived") {
      setThirdPartyProvided(prevThirdParty => ({
        ...prevThirdParty,
        [key]: { ...prevThirdParty[key], curCost: "Waived" }
      }));
    } else {
      value = value.replace(/[^0-9.]/g, '');

      if ((value.match(/\./g) || [])?.length > 1) {
        return;
      }
      setInputValues(prevInputValues => ({
        ...prevInputValues,
        [key]: value,
      }));

      setThirdPartyProvided(prevThirdParty => ({
        ...prevThirdParty,
        [key]: {
          ...prevThirdParty[key],
          curCost: value,
        }
      }));

      if (fromDropdown) {
        setShowDropdown(prev => ({
          ...prev,
          [key]: false,
        }));
      }
    }
    // Call the functions to update dependent values
    updateDependentValues('value8');
  };

  const handleInputBlurThirdParty = (key) => {
    const rawValue = inputValues[key] || '';
    const numericValue = parseFloat(rawValue.replace(/[^\d.-]/g, '')) || 0;
    const formattedValue = numericValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
    setInputValues(prevInputValues => ({
      ...prevInputValues,
      [key]: formattedValue,
    }));
  
    setThirdPartyProvided(prevState => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        curCost: formattedValue,
      }
    }));
  
    // Call the functions to update dependent values after blur
    updateDependentValues('value8');
  };

  const handleInputKeyPressThirdParty = (event, key) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleInputBlurThirdParty(key);
    }
  };

  const toggleDropdown = (key) => {
    setThirdPartyProvided(prevState => {
      const updatedService = { ...prevState[key] };
      const inputValue = updatedService.curCost;
      inputValue = inputValue.replace(/,/g, '');
      if (inputValue && !updatedService?.costOptions?.includes(inputValue)) {
        updatedService.costOptions = [inputValue, `Waived`];
      }
      return {
        ...prevState,
        [key]: updatedService
      };
    });
  
    setShowDropdown(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  
    updateDependentValues('value8');
  };

  const prepareClonedHTML = (isBase64 = false) => {
    const element = componentRef.current;
    if (!(element instanceof HTMLElement)) return null;

    const clonedContent = element.cloneNode(true);

    clonedContent.querySelectorAll('.hideInPrint').forEach(el => {
      el.style.display = 'none';
    });

    if (isBase64) {
      const style = document.createElement('style');
      style.textContent = `
    * { box-sizing: border-box; }
    p, div, table, tr, td, th, textarea, span {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    table { width: 100%; page-break-before: auto; page-break-after: auto; }
    .page-break { page-break-before: always; }
    .AnnualAgreemetModal { margin: 20px; }
    input, select { border: none; }
    td > div { display: flex; justify-content: start; }
    td > div select {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background: none;
      border: none;
      padding: 0;
      margin-left: 5px;
    }
    .feeAgreementMain > div > div:first-child, h3, h2 {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal-body > div:nth-child(2) > div:nth-child(2) {
      display: flex;
      justify-content: end;
    }
    .text-center.mb-3.row { display: flex; justify-content: center; }
    span { font-weight: normal; }
    hr { top: 17px !important; }
    .desclaimerheading2.ms-4.pb-3,
    .desclaimerheading2.ms-4.py-3,
    .formatedValueSorted h5 {
      margin: 10px 0px !important;
    }
    .modal-footer { display: none; }
    .twoColumn { margin-top: 20px; }
    .formatedValueSorted tr td:nth-child(3),
    .formatedValueSorted tr td:nth-child(4) {
      width: 200px !important;
      max-width: 200px;
      min-width: 200px;
    }
    .fw-bold.vertical.ps-3.pt-3 span {
      writing-mode: vertical-rl;
      text-orientation: upright;
      white-space: nowrap;
      transform: inherit !important;
    }
    img.my-1 {
      width: 200px !important;
      position: relative;
      bottom: 15px;
      height: auto !important;
    }
    @page { margin: 20mm; }
  `;
      clonedContent.appendChild(style);
    }

    clonedContent.querySelectorAll(".textBlackInput input, .textBlackInput textarea").forEach(input => {
      const span = document.createElement("span");
      span.textContent = input.value;
      span.style.whiteSpace = "pre-wrap";
      span.style.wordBreak = "break-word";
      span.style.overflowWrap = "break-word";
      span.style.width = "100%";
      span.style.minHeight = "20px";
      span.style.display = "block";
      input.replaceWith(span);
    });

    clonedContent.querySelectorAll('th.vertical > span').forEach(span => {
      span.style.transform = 'rotate(-90deg)';
      span.style.display = 'inline-block';
      span.style.verticalAlign = 'middle';
      span.style.textAlign = 'center';
      span.style.paddingRight = '15px';
    });

    clonedContent.querySelectorAll("td .currencyInputWrapper").forEach(wrapper => {
      const input = wrapper.querySelector("input");
      const dollarSpan = wrapper.querySelector("span");
    
      if (input && dollarSpan) {
        const combinedContainer = document.createElement("div");
        combinedContainer.style.display = "flex";
        combinedContainer.style.alignItems = "center";
        combinedContainer.style.justifyContent = "flex-start";
        combinedContainer.style.textAlign = "left";
        combinedContainer.style.whiteSpace = "nowrap";
        combinedContainer.style.width = "100%";
    
        const dollarText = document.createElement("span");
        dollarText.textContent = "$";
        dollarText.style.marginRight = "4px";

        const amountText = document.createElement("span");
        amountText.textContent = input.value;
    
        combinedContainer.appendChild(dollarText);
        combinedContainer.appendChild(amountText);
    
        wrapper.replaceWith(combinedContainer);
      }
    });

    clonedContent.querySelectorAll('table, th, td, tr, thead, tbody').forEach(el => {
      el.style.border = '1px solid grey';
      el.style.borderCollapse = 'collapse';
    });

    clonedContent.querySelectorAll('th, td').forEach(cell => {
      cell.style.border = '1px solid grey';
      cell.style.padding = '6px';
      cell.style.overflow = 'hidden';
      cell.style.textOverflow = 'ellipsis';
      cell.style.whiteSpace = 'normal';
    });

    clonedContent.querySelectorAll('td, span').forEach(cell => {
      cell.style.textAlign = 'center';
      cell.style.verticalAlign = 'middle';
    });

    clonedContent.querySelectorAll('.desclaimerheading2, thead th, thead th label').forEach(el => {
      el.style.color = 'black';
    });

    clonedContent.querySelectorAll('.twoColumn tr').forEach(row => {
      row.style.borderBottom = '2px solid white';
    });

    return clonedContent;
  };

  const handleDownloadPDF = async() => {
    const requiredSignatures = client?.spouseName
    if (requiredSignatures) {
      if (!isNotValidNullUndefile(signatureAttorney) || !isNotValidNullUndefile(signaturePrimary) || !isNotValidNullUndefile(signatureSpouse)) {
          AlertToaster.error(`Please complete all the signatures before downloading the PDF file.`);
          const scrollToElement = (elementId) => {
              const container = document.getElementById(elementId);
              if (container) {
                  container.scrollIntoView({ behavior: 'smooth' });
              }
          };
          scrollToElement('attorneyContainer');
          return;
      }
    } else {
        if (!isNotValidNullUndefile(signatureAttorney) || !isNotValidNullUndefile(signaturePrimary)) {
            AlertToaster.error(`Please complete all the signatures before downloading the PDF file.`);
            const scrollToElement = (elementId) => {
                const container = document.getElementById(elementId);
                if (container) {
                    container.scrollIntoView({ behavior: 'smooth' });
                }
            };
            scrollToElement('attorneyContainer');
            return;
        }
    }

    const html2pdf = (await import('html2pdf.js')).default;
    const preparedContent = prepareClonedHTML(false);
    konsole.log(preparedContent,"xxxllljjjhhh")
    if (!preparedContent) return;
    html2pdf().from(preparedContent).set({
      margin: [30, 0, 30, 0],
      filename: `${client?.memberName} Non-Crisis Fee Agreement.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 1.4, allowTaint: true, useCORS: true },
      jsPDF: { unit: 'pt', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }).toPdf().get('pdf').then(pdf => {
      for (let i = 1, n = pdf.internal.getNumberOfPages(); i <= n; i++) {
        pdf.setPage(i);
        pdf.rect(20, 20, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 40);
      }
      pdf.save(`${client?.memberName} Non-Crisis Fee Agreement.pdf`);
    });
  };

  const logoBase64String = "data:image/png;base64,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06ZOn+7t2nQ0UkNg/7c3velNXmtgWyr2s2PvSbapwqJFDsSDPRVpajhO4eL3pptuarNmzfI28d///ve+g88NegfiveAb37D//Oc/7v6hhx7qcpn1yKO280672MXf+a43ZYS1j8O6x26lVwh7JKzkcYyVgGazFcHXDV8REitpanqZGDUxl2kbFFDWUPXydrKWRlUxf+MKvyyWJWbaEGOMHUhe0oYzHWnsJnLIIYfYJptvrntRWkDIVJ9ZFLyYyUpZS3byiSc6cToxKw1P/8D73JL7ldIUNvjhD37g+/x95dxzraznp512mm8V9frXv94+8IEP2I033ujuzZk922ZusIH94+qrfc+2n/ziF77JJ4QM4e2x555uGR5xxBH28Y9/3DevZQuhP/7xj/aajTayefKDvdkg1reroKDJwKECBav+4AP293c32Wwz+61Ij22t/va3v1lSRHfuOef4xr+nf+Qj/t2tIsaf//zndumll1pCBLjf6/aygw46xL6g92Su28f0HnFiKys2+9x1113tXMWPjUA/f/bZvs8czyjM9tt3X9+glP0sr7vuOvvzX//qwfreJZf41l74sddee/l+fTtLLnvttpvvso0MCe+vfvUra58y1XeknqAzgIhxO4zI+K4KqrDf3khIVtIwxssDxsmKQBMaOoEeUUiSfmz1Rn7yTRBqouavNY01ajFT4kPEtJtls32+j1bo8R5ETMxrEyQvSoVFxw4YWHyQzeFHHSXhV14SsNJ8GBvpIYU74HWvs7POOsuOOu4t3rQA2e6w8w52psgTnP/1r/uoi899/vP+/gdl0bJ56Mc+9jH7iAiO/Q8h6g9+8IO2p6znq664wi6//HIn4xYVEHuIqLA2Ga6GVYt1irXLvb/85S921d//7tthJeT2hz/0ISdJLPhkpfDv6+pyy/R3IuKtttjcLWGOv+s7LGPay8877zzfS+6DikdZuskmsGwYC7kijzcdcbj99aq/23SFW4Kyhx54wK3fp2SlHyWL+T3veY+9+ZhjXK+/9a1veRhPP/10H0p4/Fvf6lY8e/9hJWPZk4l9RIbCNuu//7XTTj3ViZV4IZd/qmCgjRlZUktYf8PX2Fe+/H+26RZbumVGm30gZc477bTTwBDEkRAT8+iwMmJmj0RqUPPmzfO0xLBhw+GJ3oGMNT1GrcEQ86hQLEWH/nNk+vr90M1y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";

  const validatePayment = (paymentChoice, formattedRemainingBalance, inputValuesSummaryOfFee, formattedFullAmount, formattedInstallmentAmount, signatureAttorney, signaturePrimary, signatureSpouse, btnType, client) => {
    const removeCommas = (value) => (typeof value === "string" ? value.replace(/,/g, "") : value);

    const scrollToElement = (elementId) => {
      const container = document.getElementById(elementId);
      if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
        konsole.log("Scrolling to:", container);
      }
    };

    formattedFullAmount = parseFloat(removeCommas(formattedFullAmount)) || 0;
    formattedInstallmentAmount = parseFloat(removeCommas(formattedInstallmentAmount)) || 0;
    formattedRemainingBalance = parseFloat(removeCommas(formattedRemainingBalance)) || 0;

    if (!inputValuesSummaryOfFee?.value1 || inputValuesSummaryOfFee?.value1 === "0.00") {
      staticAlertTimer("Please enter a valid amount in Retainer before proceeding.");
      scrollToElement('retainerField');
      return { valid: false, message: "Retainer amount is missing." };
    }
  
    if (!inputValuesSummaryOfFee?.value2 || inputValuesSummaryOfFee?.value2 === "0.00") {
      staticAlertTimer("Please enter a valid amount in Deposit for Services Provided on a Flat Fee Basis before proceeding.");
      scrollToElement('flatFeeDepositField');
      return { valid: false, message: "Deposit amount is missing." };
    }

    if (!paymentChoice && isNullUndefine(inputValuesSummaryOfFee?.value7)) {
      staticAlertTimer("Please fill in the amount you wish to pay now.");
      scrollToElement('makeAmountPaid');
      return { valid: false, message: "Amount is missing." };
    }

    if (formattedInstallmentAmount > formattedFullAmount) {
      staticAlertTimer(`The payment amount cannot exceed the total amount of $${formattedFullAmount}. Please enter a valid amount.`);
      scrollToElement('makeAmountPaid');
      return { valid: false, message: "Installment exceeds full amount." };
    }

    const discountValue = parseFloat(removeCommas(inputValuesSummaryOfFee?.value6)) || 0;
    const paidAmount = parseFloat(removeCommas(inputValuesSummaryOfFee?.value7)) || 0;
    const netFullAmount = formattedFullAmount - discountValue;
    const minimumInstallmentAmount = 0.10 * netFullAmount;

    if (["installment", "full"].includes(paymentChoice)) {
      if ((paidAmount < minimumInstallmentAmount) || (paidAmount === 0.00)) {
        staticAlertTimer(`Please pay at least 10% of the discounted amount. The minimum payment is $${minimumInstallmentAmount.toFixed(2)}.`);
        scrollToElement('makeAmountPaid');
        return { valid: false, message: "Installment amount too low." };
      }
    }

    const totalPaidWithDiscount = paidAmount - discountValue;
    if (totalPaidWithDiscount > formattedFullAmount) {
      staticAlertTimer(`The entered amount exceeds the remaining balance of $${formattedRemainingBalance.toFixed(2)}.`);
      scrollToElement('makeAmountPaid');
      return { valid: false, message: "Payment exceeds remaining balance." };
    }
  
    if (btnType === 'makeApayment' || btnType === 'sendLink') {
      if (btnType !== 'sendLink') {
        if (client?.spouseName && btnType === 'makeApayment') {
          if (
            !isNotValidNullUndefile(signatureAttorney) ||
            !isNotValidNullUndefile(signaturePrimary) ||
            !isNotValidNullUndefile(signatureSpouse)
          ) {
            AlertToaster.error(`Please complete all the signatures before processing the PDF.`);
            scrollToElement('attorneyContainer');
            return { valid: false, message: "Missing signatures." };
          }
        } else {
          if (
            !isNotValidNullUndefile(signatureAttorney) ||
            !isNotValidNullUndefile(signaturePrimary)
          ) {
            AlertToaster.error(`Please complete all the signatures before processing the PDF.`);
            scrollToElement('attorneyContainer');
            return { valid: false, message: "Missing signatures." };
          }
        }
      }

      if (btnType === 'sendLink') {
        if (!isNotValidNullUndefile(signatureAttorney)) {
          AlertToaster.error(`Please complete the signature before sending the link.`);
          scrollToElement('attorneyContainer');
          return { valid: false, message: "Missing attorney signature." };
        }
      }
    }
    return { valid: true };
  };

  const handlePayment = async (btnType) => {
    const fullAmount = !isNaN(parseFloat(inputValuesSummaryOfFee?.value4))
      ? parseFloat(computeValue5(inputValuesSummaryOfFee?.value4, calculateTotalCost))
      : parseFloat(subsGetData?.totalAmount || "0");

    const installmentAmount = !isNaN(parseFloat(inputValuesSummaryOfFee?.value7))
      ? parseFloat(inputValuesSummaryOfFee?.value7)
      : parseFloat(subsGetData?.totalPaid || "0");

    const remainingBalance = inputValuesSummaryOfFee?.value6 
    ? fullAmount - inputValuesSummaryOfFee?.value6 
    : fullAmount;
    
    const paymentChoice = subsGetData?.totalPaid === subsGetData?.totalAmount ? "full" : "installment";
    const formattedFullAmount = fullAmount;
    const formattedInstallmentAmount = installmentAmount;
    const formattedRemainingBalance = remainingBalance;

    const validation = validatePayment(paymentChoice, formattedRemainingBalance, inputValuesSummaryOfFee, formattedFullAmount, formattedInstallmentAmount, signatureAttorney, signaturePrimary, signatureSpouse, btnType, client);

    if (!validation.valid) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    // Generate the PDF and handle as a Blob
    const html2pdf = (await import('html2pdf.js')).default;
    const preparedContent = prepareClonedHTML(false);
    if (!preparedContent) return;
    html2pdf().from(preparedContent).set({
      margin: [30, 0, 30, 0],
      filename: `${client?.memberName} Non-Crisis Fee Agreement.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 1.4, allowTaint: true, useCORS: true },
      jsPDF: { unit: 'pt', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }).toPdf().get('pdf').then(pdf => {
      for (let i = 1, n = pdf.internal.getNumberOfPages(); i <= n; i++) {
        pdf.setPage(i);
        pdf.rect(20, 20, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 40);
      }
      const pdfBlob = pdf.output('blob');
      dispatchloader(false);
      const pdfFile = new File([pdfBlob], "Non-Crisis Fee Agreement.pdf", {
        lastModified: new Date().getTime(),
        type: "application/pdf"
      });
      const fileDetails = { 0: pdfFile, length: 1 };
      genereateViewPdf(fileDetails, btnType, selectedDate);
      setIsProcessing(false);
    });
  };

  const headingStyle = {
    fontFamily: 'Cambria, sans-serif',
    fontSize: '13pt',
    textAlign: 'justify',
    fontWeight: 700,
    paddingLeft: '40px',
    textIndent: '-15pt'
  };  

  const headingStyleNew = {
    fontFamily: 'Cambria, sans-serif',
    fontSize: '13pt',
    textAlign: 'left',
  };

  const headingStyleJust = {
    fontFamily: 'Cambria, sans-serif',
    fontSize: '13pt',
    textAlign: 'Justify',
    marginBottom: '15px',
  }

  const headingStyleMain = {
    fontFamily: 'Cambria, sans-serif',
    fontSize: '15pt',
  }

  const headingStyleMainAnother = {
    fontFamily: 'Cambria, sans-serif',
    fontSize: '13pt',
  }

  const fontSizeLabel = {
    fontFamily: 'Open Sans',
    fontSize: '14pt',
  }

  const renderNameInput = (name) => {
    if (!name) return null;
  
    const nameParts = name?.split(' ');
    if (nameParts?.length >= 2) {
      const firstNameInitial = nameParts[0]?.charAt(0);
      const lastNameInitial = nameParts[nameParts?.length - 1]?.charAt(0);
      return `${firstNameInitial}. ${lastNameInitial}.`;
    }
    return '';
  };

  const handleInputBlurSummaryOfFeesOther = (inputName) => {
    setInputValuesSummaryOfFee((prevState) => {
        let numericValue = parseFloat(prevState[inputName]);

        if (isNaN(numericValue)) numericValue = 0;

        return {
            ...prevState,
            [inputName]: new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numericValue),
        };
    });
  };

  const handleInputChangeSummaryOfFeesOther = (e, inputName) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');

    if ((value.match(/\./g) || []).length > 1) return;

    setInputValuesSummaryOfFee((prevState) => ({
      ...prevState,
      [inputName]: value,
    }));
  };

  const handleInputClick = (e) => {
    if (e.target.value === "0.00") {
        setInputValuesSummaryOfFee((prevState) => ({
            ...prevState,
            value7: "",
        }));
    }
    setShowModal(true);
  };

  const handlePaymentChoiceChange = (e) => {
    const selectedPaymentChoice = e.target.value;
    setPaymentChoice(selectedPaymentChoice);
    
    if (selectedPaymentChoice === "installment") {
      setInputValuesSummaryOfFee({
        ...inputValuesSummaryOfFee,
        value7: "0.00",
      });
    } else if (selectedPaymentChoice === "full") {
      setInputValuesSummaryOfFee({
        ...inputValuesSummaryOfFee,
        value7: parseFloat(computeValue5(inputValuesSummaryOfFee?.value4, calculateTotalCost)).toFixed(2),
      });
    }
  };

  const handlePaymentFrequencyChange = (e) => {
    const selectedFrequency = e.target.value;
    setPaymentFrequency(selectedFrequency);
    if (selectedFrequency !== "onetime") {
      setInstallmentDuration("");
    }
  };

  const handleInstallmentDurationChange = (e) => {
    const value = e.target.value;
    let maxInstallments = 20;
    if (paymentFrequency === 'monthly') {
      maxInstallments = 240;
    } else if (paymentFrequency === 'weekly') {
      maxInstallments = 1043;
    } else if (paymentFrequency === 'yearly') {
      maxInstallments = 20;
    }
    if (value > maxInstallments) {
      staticAlertTimer(`The maximum number of installments are ${maxInstallments}.`);
      setInstallmentDuration("");
    } else if (value >= 1 && value <= maxInstallments) {
      setInstallmentDuration(value);
    } else if (value === "") {
      setInstallmentDuration(value);
    }
  };

  const getInstallmentFrequency = (dataItem) => {
    const { futurePayDate, validityFrom, totalInstallment } = dataItem;
  
    if (!totalInstallment || totalInstallment === 1) return "One Time";
  
    const start = new Date(validityFrom);
    const end = new Date(futurePayDate);
    const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
    if (diffInDays <= 7) return "Weekly";
    if (diffInDays >= 365) return "Yearly";
    if (diffInDays >= 28 && diffInDays < 365) return "Monthly";
  
    return "Custom";
  };
  
  const frequencyLabel = getInstallmentFrequency(subsGetData); 

  const handleModalClose = () => {
    setPaymentFrequency("");
    setInstallmentDuration("");
    setSelectedDateFuture("");
    setShowModal(false);
  };
  
  const handleConfirm = () => {
    if (inputValuesSummaryOfFee?.value7 === '0.00' && paymentChoice === "installment"){
      staticAlertTimer("Installment payment cannot be 0.00. Please enter a valid amount.");
      return;
    }
    if (paymentChoice === "installment" && !paymentFrequency) {
      staticAlertTimer("Please select an Installment Frequency.");
      return;
    }
    if (paymentChoice === "installment" && paymentFrequency === "onetime" && !selectedDateFuture) {
      staticAlertTimer("Please select a date before confirming. Date must be between 7 and 365 days from today!");
      return;
    }
    if (paymentChoice === "installment" && paymentFrequency !== "onetime" && (!installmentDuration || parseInt(installmentDuration) <= 0)) {
      staticAlertTimer("Please enter a valid number of installments.");
      return;
    }
    setInputValuesSummaryOfFee((prevState) => ({
      ...prevState,
      value7: paymentChoice === "full"
        ? parseFloat(computeValue5(prevState.value4, calculateTotalCost)).toFixed(2)
        : prevState.value7,
    }));
    setShowModal(false);
  };
  
  const handleDateChangeFuture = (e) => setSelectedDateFuture(e.target.value);

  const formatDateToUS = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const isOrderFound = subsGetData?.orderId !== null && subsGetData?.orderId !== undefined && subsGetData?.orderId !== 0;
  
  const getInitials = (name) => {
    const nameParts = name?.trim().split(' ');
    if (nameParts?.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts?.length - 1][0]}`.toUpperCase();
    } else if (nameParts?.length === 1) {
      return nameParts[0].slice(0, 2).toUpperCase();
    }
    return '';
  };
  const initials = getInitials(client?.memberName || clientData?.memberName || "");

  const handleChange = (value) => {    
    setMatterNumber(value);
  };

  const handleCloseFeeAgreement = () => {
    if (orderId && transactionStatus) {
      sessionStorage.removeItem("feeAgreementUser");
      sessionStorage.removeItem("inputValuesSummaryOfFee")
      setOrderIDFromUrl(null); 
      setTransactionStatus(null);
      setPrimaryInitials('')
      setSpouseInitials('')
      window.location.reload();
    }
    if (!fromFeeAgreement) {
      handleShowFeeAgreement(false);
      if (isPortalSignOn) {
        showannualagreementmodalfun("feeAgreement", false);
      } else {
        openAnnualModalFileTable(!!orderId);
      }
      setAddUpdate(false);
    }
  };

  const shouldShowTR = () => {
    const skuListName = subsPlansGetData[0]?.skuListName;
    const selectedLabel = selectedCheckbox?.label;
    const isSkuComprehensive = skuListName?.startsWith("Comprehensive LifePlan") || skuListName === "Comprehensive LifePlan";
    if (!isSkuComprehensive) return false;
    const isLabelComprehensive = !selectedLabel || selectedLabel?.startsWith("Comprehensive LifePlan") || selectedLabel === "Comprehensive LifePlan";
    if (!(isSkuComprehensive && isLabelComprehensive)) return false;
  
    const isComprehensivePlan =
      skuListName?.startsWith("Comprehensive LifePlan") ||
      skuListName === "Comprehensive LifePlan" ||
      selectedLabel === "Comprehensive LifePlan" ||
      ["Comprehensive LifePlan - health", "Comprehensive LifePlan - housing", "Comprehensive LifePlan - finance"].includes(selectedSubCheckboxes?.label);
  
    const isInvalidCombination =
      ["check-a1-a", "check-a1-b", "check-a1-e", "check-a1-ee"].includes(selectedCheckbox) &&
      skuListName === "Comprehensive LifePlan";
  
    const isValidPlanSelection =
      (selectedLabel === "Comprehensive LifePlan" && (!skuListName || skuListName === "Comprehensive LifePlan")) ||
      (skuListName?.startsWith("Comprehensive LifePlan") && (!selectedLabel || selectedLabel === "Comprehensive LifePlan")) ||
      (selectedLabel && skuListName);
  
    return (selectedCheckbox === "check-a1-g" || isComprehensivePlan) && !isInvalidCombination && isValidPlanSelection;
  };

  const updatedOptions = selectattornetvalue && !filteredOptionsattorneyUserListvaluelabel.some(opt => opt.value === selectattornetvalue.value)
  ? [...filteredOptionsattorneyUserListvaluelabel, { label: selectattornetvalue.label, value: selectattornetvalue.value }]
  : filteredOptionsattorneyUserListvaluelabel;

  useEffect(() => {
    if (matterNumber) {
      const newWidth = Math.max(matterNumber?.length * 9, 90);
      setUnderlineWidth(newWidth);
    }
  }, [matterNumber]);

  const handleInputTextHeight = (e) => {
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };

  const variableValue7 = (() => {
    if (!inputValuesSummaryOfFee || !subsGetData) return "0.00";
  
    if (confirmedInputs["value7"] == false) {
      if (inputValuesSummaryOfFee?.value7 === "0.00") {
        return "Please enter amount";
      } else if (paymentChoice === "full" && inputValuesSummaryOfFee?.value6) {
        return (
          (parseFloat(inputValuesSummaryOfFee?.value7.replace(/,/g, "")) -
            parseFloat(inputValuesSummaryOfFee?.value6.replace(/,/g, "")))
          .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        );
      } else {
        return inputValuesSummaryOfFee?.value7 || "0.00";
      }
    } else if (inputValuesSummaryOfFee?.value7 === "0.00") {
      return "Please enter amount";
    } else if (subsGetData?.totalPaid) {
      return Number(subsGetData.totalPaid).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return "0.00";
    }
  })();
  
  const variableValue = (() => {
    if (!inputValuesSummaryOfFee || !subsGetData) return "0.00";
    const hasThirdPartyChanges = thirdPartyCombinedServices.some(service => service.curCost !== "Waived" && service.Checked);
    const matchedSkuListName = subsPlansGetData[0]?.skuListName == selectedChargeType;
    if (hasThirdPartyChanges) {
      if (matchedSkuListName && subsGetData?.totalAmount && parseFloat(subsGetData.totalAmount) !== 0) {
        return `${Number(
          subsGetData.totalAmount -
            computeValue5(
              inputValuesSummaryOfFee?.value4?.replace(/,/g, "") || "0",
              calculateTotalCost || 0
            )
        ).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    }
  
    if (inputValuesSummaryOfFee?.value3) {
      return String(inputValuesSummaryOfFee.value3).toLocaleString();
    }
    return "0.00";
  })();  
  
  const variableValue6 = (() => {
    if (!inputValuesSummaryOfFee || !subsGetData) return "0.00";

    if (confirmedInputs["value6"]) {
      return inputValuesSummaryOfFee?.value6 || "";
    }
    if (subsGetData?.totalDiscount) {
      const rawValue = inputValuesSummaryOfFee?.value6?.replace(/,/g, "") || "0";
      return rawValue !== "0"
        ? Number(rawValue).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : "";
    }
    return inputValuesSummaryOfFee?.value6 || "0.00";
  })();

  const variableValuePayment = (() => {
    if (paymentChoice === "full") {
      return (
        (parseFloat(inputValuesSummaryOfFee?.value5.replace(/,/g, "")) -
          parseFloat(inputValuesSummaryOfFee?.value7.replace(/,/g, "")))
        .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      );
    } else {
      return (
        inputValuesSummaryOfFee?.value6 === "0.00" || !inputValuesSummaryOfFee?.value6
          ? (inputValuesSummaryOfFee?.value7
              ? parseFloat(inputValuesSummaryOfFee?.value5?.replace(/,/g, "")) -
                parseFloat(inputValuesSummaryOfFee?.value7?.replace(/,/g, ""))
              : parseFloat(inputValuesSummaryOfFee?.value5?.replace(/,/g, ""))
            )
          : (inputValuesSummaryOfFee?.value7
              ? parseFloat(inputValuesSummaryOfFee?.value5?.replace(/,/g, "")) -
                parseFloat(inputValuesSummaryOfFee?.value6?.replace(/,/g, "")) -
                parseFloat(inputValuesSummaryOfFee?.value7?.replace(/,/g, ""))
              : parseFloat(inputValuesSummaryOfFee?.value5?.replace(/,/g, "")) -
                parseFloat(inputValuesSummaryOfFee?.value6?.replace(/,/g, ""))
            )
      ).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  })();  

  const formatName = (fullName) => {
    if (!fullName) return "";
    let nameParts = fullName.trim().split(/\s+/);
    let lastName = nameParts.pop().toUpperCase();
    let firstName = nameParts.join(' ');

    return `${lastName}, ${firstName}`;
  };

  useEffect(() => {
    const updatedValue5 = computeValue5(inputValuesSummaryOfFee?.value4, calculateTotalCost);
    setInputValuesSummaryOfFee(prev => ({
      ...prev,
      value5: updatedValue5,
    }));
  }, [inputValuesSummaryOfFee?.value4, calculateTotalCost]); 

  const scrollToSignatureContainer = () => {
    const signatureContainer = document.getElementById('mainSignatureContainer');
    if (signatureContainer) {
      signatureContainer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrimaryClick = () => {
    if (!primaryInitials) {
      scrollToSignatureContainer();
    }
  };

  const handleSpouseClick = () => {
    if (!spouseInitials) {
      scrollToSignatureContainer();
    }
  };
  
  const nextInstallmentDate = getNextInstallmentDate(
    subsGetData?.validityFrom ?? client?.validityFrom,
    frequencyLabel,
    subsGetData?.totalInstallment ?? client?.totalInstallment
  );

  const formattedNextDate = nextInstallmentDate ? formatDateToUS(nextInstallmentDate) : formatDateToUS(subsGetData?.futurePayDate);

  return (
    <>
      {fromFeeAgreement === true ? (
        <style jsx global>{`
        .modal-open .modal-backdrop.show {
          opacity: 0.5 !important;
          background: offwhite !important;
        }
      `}</style>
      ) : null}
      {isFileViewerOpen && (
        <FileViewer
          openFileInfo={fileInfo}
          isFileOpen={isFileViewerOpen}
          setIsFileOpen={setIsFileViewerOpen}
          fileCabinetDesign='new'
          isDirectFeeAgreement={true}
        />
      )}
      {showAmaOccurrencePreview && (
        <OccurrenceModal
          textObj={replaceTemplate(textObj?.textTemp)}
          emailObj={replaceTemplate(emailObj?.emailTemp)}
          commChannelId={commChannelId}
          show={showAmaOccurrencePreview}
          onHide={handleFeeAgreementShowOccurrence}
          sentMail={sentTextNMail}
          isClientPermissions={isClientPermissions}
        />
      )}
      {(isPaymentOpen && (orderId || orderIDFromUrl)) &&
      <FeeAgreementPayment
        clientData={client}
        attorneyID={selectattorneyid}
        orderId={orderId || orderIDFromUrl}
        loggedUserId={loggedInUserId}
        subtenantRateCardId={subsPlansGetData[0]?.subtenantRateCardId}
        refrencePage={fromFeeAgreement ? "FeeAgreement" : isPortalSignOn ? "portalSignOn" : "directFeeAgreement"}
      />
      }
      <Modal  id={showModalBodyPrimary && !fromFeeAgreement || (activeModal === "first" && !showModalBodyPrimary) ? "modal-contents-paralegal-AnnualAgreemetModal" : "modal-contents-paralegal"}  className='AnnualAgreemetModal' onShow={() => setIsProcessing(false)} show={showFeeAgreementModal || showannualagreementmodal || fromFeeAgreement || activeModal === "second"} onHide={() => { if (activeModal === "first" && !fromFeeAgreement) {  setActiveModal("second"); handleShowFeeAgreement(false); if (isPortalSignOn) { showannualagreementmodalfun("feeAgreement", false); } else { openAnnualModalFileTable(!!orderId || false); } setActiveModal("first"); setAddUpdate(false); } }} animation="false" backdrop="static" aria-labelledby="contained-modal-title-vcenter" ref={modalRef} centered>
      <Modal.Header 
        className={showModalBodyPrimary && !fromFeeAgreement  ||  (activeModal === "first" && !showModalBodyPrimary)? 'AnnualModalHeader d-flex h-auto justify-content-between' : ''} 
        style={{ border: "none" }} 
      >
        <Modal.Title>Non-Crisis Fee Agreement</Modal.Title>
        {activeModal === "first" && (showFeeAgreement || showFeeAgreementModal ||  fromFeeAgreement || isPortalSignOn) && (
          <img className="mt-0 me-1" src="/icons/closeIcon.svg" alt="Close" 
          onClick={handleCloseFeeAgreement}
          />
        )}
        {activeModal === "second" && (!showModalBodyPrimary && !fromFeeAgreement) && (
          <button type="button" onClick={() => { setActiveModal("first"); setShowModalBodyPrimary(true); }} class="btn-close btn-close-white" aria-label="Close"></button>
        )}
        </Modal.Header>
        {((activeModal === "first" && (showModalBodyPrimary && !fromFeeAgreement)) || (activeModal === "first" && !showModalBodyPrimary)) && (
          <div className='modalBodyPrimary'>
            <Modal.Body className='p-2 pt-0'>
              <Col className='px-2'>
                <Row className='borderBelow d-flex align-items-center p-2'>
                  <Col xs={12} md={1} xl={1} className='profilePortalSignOnLeft'>
                    <Row>
                      <Col className='header_Icon d-flex align-items-center justify-content-center cursor-pointer px-0'>
                        <div className='initialIcon'>
                          {initials}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={11} xl={11} className='profilePortalSignOnRight'>
                    <Row>
                      <p className='userName'>{$AHelper.capitalizeAllLetters(client?.memberName || clientData?.memberName)}</p>
                    </Row>
                    <Row>
                      <p className='userPosition'>Client</p>
                    </Row>
                  </Col>
                </Row>
                <div className='borderBelow d-flex justify-content-between allAmountAndDateLegalMatter'>
                  <Row className='d-flex align-items-center py-2'>
                    <Col xs={12} md={12} xl={12} className='profilePortalSignOnLeft'>
                      <Row>
                        <p className='paymentLabel'>Legal Staff &#x2a;</p>
                      </Row>
                      <Row className='useNewDesignSCSS'>
                        <CustomSearchSelect
                          placeholder='Select legal staff'
                          options={updatedOptions}
                          onChange={(e) => setSelectAttorneId(e.value)}
                          value={selectattornetvalue?.value}
                          isDisable={isOrderFound}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <Row className='d-flex align-items-center py-2 anotherWithoutBackgroundBelow'>
                    <Col xs={12} md={12} xl={12} className='profilePortalSignOnLeft pe-0'>
                      <Row>
                        <p className='lableService'>Matter No: &#x2a;</p>
                      </Row>
                      <Row className='useNewDesignSCSS pt-2 ps-3'>
                        <div className='customCheckboxRadio' title={matterNumber?.matterNo ?? matterNumber}>
                          <CustomInput
                            className="customInputEllipse"
                            value={matterNumber?.matterNo ?? matterNumber}
                            title={matterNumber?.matterNo ?? matterNumber}
                            onChange={(e) => handleChange(e)}
                            isDisable={isOrderFound}
                          />
                        </div>
                      </Row>
                    </Col>
                  </Row>
                </div>
                <Row className="d-flex align-items-center py-2 mainChargesTypeCompo">
                  <Col xs={12} md={12} xl={12} className="profilePortalSignOnLeft">
                    <Row>
                      <p className="lableService">Charges Types: &#x2a;</p>
                    </Row>
                    <Row className="useNewDesignSCSS d-flex flex-row-reverse borderBelow pt-2 px-3">
                      <Row className="ms-5 pt-0 ps-0 flex-column customCheckboxRadio">
                        {['hourly', 'flat'].map((id) => (
                          <div key={id} style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                            <CustomRadio
                              className="mt-2 fs-6"
                              type="radio"
                              id={`${id}Radio`}
                              name="chargeType"
                              options={[{ value: id, label: id === 'hourly' ? 'Hourly Basis' : 'Flat Fee Basis' }]}
                              value={showHourlyBody ? 'hourly' : showFlatFeeBody ? 'flat' : ''}
                              onChange={(selected) => selected ? handleChargeTypeChange(selected.value) : null}
                              isDisabled={isOrderFound}
                            />
                          </div>
                        ))}
                      </Row>
                    </Row>
                  </Col>
                </Row>
                <Row className="d-flex align-items-center py-2">
                  <Col xs={12} md={12} xl={12} className="profilePortalSignOnLeft">
                    <Row>
                      <p className="lableService">Provided Services: &#x2a;</p>
                    </Row>
                    <Row className="useNewDesignSCSS borderBelow pt-2 px-3">
                      {['Firm Provided'].map(type => {
                        const isFirmProvided = type === 'Firm Provided';
                        const shouldCheck =
                          Array.isArray(skuListNames) &&
                          skuListNames?.length > 0 &&
                          subsPlansGetData[0]?.skuListName &&
                          skuListNames.includes(subsPlansGetData[0]?.skuListName);
                        if (shouldCheck && !showFirmProvided) {
                          setShowFirmProvided(true);
                        }
                        if (subsPlansGetData[0]?.skuListName === "Comprehensive LifePlan" && !showWithProvided) {
                          setShowWithProvided(true);
                        }
                        return (
                          <div key={type} className="customCheckboxRadio">
                            <CustomCheckBox
                              id={`${type.replace(/\s/g, '')}Checkbox`}
                              label={'Firm Provided'}
                              value={isFirmProvided ? showFirmProvided : showFirmProvided}
                              isDisabled={isOrderFound}
                            />
                            {showFirmProvided && (
                              <Row className="ms-5 ps-0 mainRadioContainer">
                                {['check-a1-a', 'check-a1-b', 'check-a1-e', 'check-a1-ee', 'check-a1-g'].map((id, index) => {
                                  const isCheckedAutomatically = skuListNames[index] === subsPlansGetData[0]?.skuListName;
                                  const isCheckedAutomaticallymatch = skuListNames[index] === "Comprehensive LifePlan" &&
                                    subsPlansGetData[0]?.skuListName.startsWith("Comprehensive LifePlan");
                                  return (
                                    <div key={id} style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                                      <CustomRadio
                                        className="mt-2 fs-6"
                                        type="radio"
                                        name={`subscription-${skuListNames[index]}`}
                                        value={selectedCheckbox?.label ? selectedCheckbox?.label : isCheckedAutomatically ? skuListNames[index] : isCheckedAutomaticallymatch ? skuListNames[index] : selectedCheckbox?.label}
                                        id={id}
                                        options={skuListNames[index] ? [{ value: skuListNames[index], label: skuListNames[index] }] : []}
                                        onChange={(e) => handleMainCheckboxChange(e, skuListNames[index])}
                                        isDisabled={isOrderFound}
                                      />
                                    </div>
                                  );
                                })}
                              </Row>
                            )}
                          </div>
                        );
                      })}
                    </Row>
                    {showFirmProvided && (
                      selectedCheckbox?.label === "Comprehensive LifePlan" ||
                      (
                        (subsPlansGetData[0]?.skuListName === "Comprehensive LifePlan" ||
                          subsPlansGetData[0]?.skuListName?.startsWith("Comprehensive LifePlan")) &&
                        (selectedCheckbox?.label === undefined || selectedCheckbox?.label === "Comprehensive LifePlan")
                      )
                    ) ? (
                      <Row className="useNewDesignSCSS borderBelow pt-2 px-3">
                        {['With Provided'].map(type => {
                          const isFirmProvided = type === 'Firm Provided';
                          const shouldCheck =
                            Array.isArray(skuListNames) &&
                            skuListNames?.length > 0 &&
                            subsPlansGetData[0]?.skuListName &&
                            skuListNames.includes(subsPlansGetData[0]?.skuListName);
                          if (shouldCheck && !showFirmProvided) {
                            setShowFirmProvided(true);
                          }
                          if ((subsPlansGetData[0]?.skuListName === "Comprehensive LifePlan" || selectedCheckbox?.label === "Comprehensive LifePlan" || subsPlansGetData[0]?.skuListName.startsWith("Comprehensive LifePlan")) && !showWithProvided) {
                            setShowWithProvided(true);
                          }
                          return (
                            <div key={type} className="customCheckboxRadio">
                              <CustomCheckBox
                                id={`${type.replace(/\s/g, '')}Checkbox`}
                                label={isFirmProvided ? 'Firm Provided' : 'With Provided'}
                                onChange={isFirmProvided ? handleFirmProvidedCheckboxChange : handleWithCheckboxChange}
                                value={isFirmProvided ? showFirmProvided : showWithProvided}
                                isDisabled={isOrderFound}
                              />
                              {showWithProvided && (
                                <Row className="ms-5 ps-0 mainRadioContainer">
                                  {['health', 'housing', 'finance'].map((key, index) => {
                                    const id = `check-a1-${String.fromCharCode(107 + index)}`;
                                    const optionValue = skuListNames[5 + index] || '';
                                    const formattedLabel = `Comprehensive LifePlan - ${key}`;
                                    const normalizeText = (text) =>
                                      (text || "").toLowerCase().replace(/[\{\}-]/g, '').replace(/\s+/g, ' ').trim();

                                    const isManuallyClicked = manualSubCheckboxClicks[toCamelCase(key)];
                                    const isCheckedAutomatically = !isManuallyClicked && normalizeText(optionValue) === normalizeText(formattedLabel);
                                    const normalizedOptionValue = normalizeText(optionValue);
                                    const normalizedSubPlan = normalizeText(selectedSubCheckboxes?.label ? selectedSubCheckboxes?.label : subsPlansGetData.map(item => normalizeText(item.skuListName)).filter(Boolean).join(' '));
                                    const matchecvalue = normalizedSubPlan.includes(normalizedOptionValue) ? optionValue : null;
                                    const isPreviouslyChecked = selectedSubCheckboxes[id] === true;

                                    return (
                                      <div key={key} style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                                        <CustomRadioMultiChecked
                                          className="mt-2 fs-6"
                                          type="radio"
                                          name={`subscription-${optionValue}`}
                                          value={isPreviouslyChecked ? optionValue : isCheckedAutomatically ? matchecvalue : selectedSubCheckboxes?.label}
                                          id={id}
                                          options={optionValue ? [{ value: optionValue, label: formattedLabel }] : []}
                                          onChange={(e) => handleSubCheckboxChange(e, key)}
                                          isDisabled={isOrderFound}
                                        />
                                      </div>
                                    );
                                  })}
                                </Row>
                              )}
                            </div>
                          );
                        })}
                      </Row>
                    ) : null}
                  </Col>
                </Row>
                {((subsGetData?.totalAmount != null && orderId != null) || (client?.totalAmount != null && orderId != null)) && (
                  <Row className="d-flex align-items-center py-2">
                    <>
                      <div className='borderBelow d-flex justify-content-between allAmountAndDate'>
                        <Row className='d-flex align-items-center py-2 anotherWithoutBackgroundBelow'>
                          <Col className='profilePortalSignOnLeft'>
                            <Row>
                              <p className='lableService'>Total Amount:</p>
                            </Row>
                            <Row className='useNewDesignSCSS pt-2 px-3'>
                              <div className='customCheckboxRadio'>
                                <CustomInput
                                  className="customInputEllipse"
                                  value={`$ ${(parseFloat(subsGetData?.totalAmount) ?? parseFloat(client?.totalAmount) ?? 0).toFixed(2)}`}
                                  title={`$ ${(parseFloat(subsGetData?.totalAmount) ?? parseFloat(client?.totalAmount) ?? 0).toFixed(2)}`}
                                  isDisable={isOrderFound}
                                />
                              </div>
                            </Row>
                          </Col>
                        </Row>
                        <Row className='d-flex align-items-center py-2 anotherWithoutBackgroundBelow'>
                          <Col className='profilePortalSignOnLeft'>
                            <Row>
                              <p className='lableService'>
                                {parseFloat(subsGetData?.totalAmount) === parseFloat(subsGetData?.totalPaid)
                                  ? 'Total Paid:'
                                  : 'Total Paid till date:'}
                              </p>
                            </Row>
                            <Row className='useNewDesignSCSS pt-2 px-3'>
                              <div className='customCheckboxRadio'>
                                <CustomInput
                                  className="customInputEllipse"
                                  value={`$ ${(
                                    parseFloat(subsGetData?.totalAmount) ===
                                      parseFloat(subsGetData?.totalPaid)
                                      ? parseFloat(subsGetData?.totalPaid) - parseFloat(subsGetData?.totalDiscount)
                                      : parseFloat(subsGetData?.totalPaid)
                                  ).toFixed(2)}`}
                                  title={`$ ${(
                                    parseFloat(subsGetData?.totalAmount) ===
                                      parseFloat(subsGetData?.totalPaid)
                                      ? parseFloat(subsGetData?.totalPaid) - parseFloat(subsGetData?.totalDiscount)
                                      : parseFloat(subsGetData?.totalPaid)
                                  ).toFixed(2)}`}
                                  isDisable={isOrderFound}
                                />
                              </div>
                            </Row>
                          </Col>
                        </Row>
                          <Row className='d-flex align-items-center py-2 anotherWithoutBackgroundBelow'>
                            <Col className='profilePortalSignOnLeft'>
                              <Row>
                                <p className='lableService'>Discount:</p>
                              </Row>
                              <Row className='useNewDesignSCSS pt-2 px-3'>
                                <div className='customCheckboxRadio'>
                                  <CustomInput
                                    className="customInputEllipse"
                                    value={`$ ${(parseFloat(subsGetData?.totalDiscount) ?? parseFloat(client?.totalDiscount) ?? 0).toFixed(2)}`}
                                    title={`$ ${(parseFloat(subsGetData?.totalDiscount) ?? parseFloat(client?.totalDiscount) ?? 0).toFixed(2)}`}
                                    isDisable={isOrderFound}
                                  />
                                </div>
                              </Row>
                            </Col>
                          </Row>
                        {(parseFloat(subsGetData?.totalAmount ?? client?.totalAmount) ?? 0) >
                          (parseFloat(subsGetData?.totalPaid ?? client?.totalPaid) ?? 0) &&
                          (parseFloat(subsGetData?.totalAmount ?? client?.totalAmount ?? 0) -
                            (parseFloat(subsGetData?.totalPaid ?? 0) + parseFloat(subsGetData?.totalDiscount ?? 0))
                          ).toFixed(2) !== "0.00" && (
                            <>
                              <Row className='d-flex align-items-center py-2 anotherWithoutBackgroundBelow'>
                                <Col className='profilePortalSignOnLeft'>
                                  <Row>
                                    <p className='lableService'>Balance:</p>
                                  </Row>
                                  <Row className='useNewDesignSCSS pt-2 px-3'>
                                    <div className='customCheckboxRadio'>
                                      <CustomInput
                                        className="customInputEllipse"
                                        value={`$ ${(
                                          parseFloat(subsGetData?.totalAmount ?? client?.totalAmount ?? 0) -
                                          (parseFloat(subsGetData?.totalPaid ?? 0) + parseFloat(subsGetData?.totalDiscount ?? 0))
                                        ).toFixed(2)}`}
                                        title={`$ ${(
                                          parseFloat(subsGetData?.totalAmount ?? client?.totalAmount ?? 0) -
                                          (parseFloat(subsGetData?.totalPaid ?? 0) + parseFloat(subsGetData?.totalDiscount ?? 0))
                                        ).toFixed(2)}`}
                                        isDisable={isOrderFound}
                                      />
                                    </div>
                                  </Row>
                                </Col>
                              </Row>
                            </>
                          )}
                      </div>
                      {(subsGetData?.futurePayDate || client?.futurePayDate) && (
                        <div className='borderBelow d-flex justify-content-between allAmountAndDate'>
                          <Row className='d-flex align-items-center py-2 anotherWithoutBackgroundBelow'>
                            <Col className='profilePortalSignOnLeft'>
                              <Row>
                                <p className='lableService'> Next Installment Date:</p>
                              </Row>
                              <Row className='useNewDesignSCSS pt-2 px-3'>
                                <div className='customCheckboxRadio'>
                                  <CustomInput
                                    className="customInputEllipse"
                                    value={formattedNextDate} 
                                    title={formattedNextDate}
                                    isDisable={isOrderFound}
                                  />
                                </div>
                              </Row>
                            </Col>
                          </Row>
                          {(subsGetData?.installmentAmount ?? client?.installmentAmount) > 0 && (
                            <Row className='d-flex align-items-center py-2 anotherWithoutBackgroundBelow'>
                              <Col className='profilePortalSignOnLeft'>
                                <Row>
                                  <p className='lableService'>Installment Amount:</p>
                                </Row>
                                <Row className='useNewDesignSCSS pt-2 px-3'>
                                  <div className='customCheckboxRadio'>
                                    <CustomInput
                                      className="customInputEllipse"
                                      value={`$ ${(parseFloat(subsGetData?.installmentAmount) ?? parseFloat(client?.installmentAmount) ?? 0).toFixed(2)}`}
                                      title={`$ ${(parseFloat(subsGetData?.installmentAmount) ?? parseFloat(client?.installmentAmount) ?? 0).toFixed(2)}`}
                                      isDisable={isOrderFound}
                                    />
                                  </div>
                                </Row>
                              </Col>
                            </Row>
                          )}
                          {(subsGetData?.totalInstallment ?? client?.totalInstallment) > 0 && (
                            <Row className='d-flex align-items-center py-2 anotherWithoutBackgroundBelow'>
                              <Col className='profilePortalSignOnLeft'>
                                <Row>
                                  <p className='lableService'>Total no. of installments:</p>
                                </Row>
                                <Row className='useNewDesignSCSS pt-2 px-3'>
                                  <div className='customCheckboxRadio'>
                                    <CustomInput
                                      className="customInputEllipse"
                                      value={`${(subsGetData?.totalInstallment ?? client?.totalInstallment) ?? 0}`}
                                      title={`${(subsGetData?.totalInstallment ?? client?.totalInstallment) ?? 0}`}
                                      isDisable={isOrderFound}
                                    />
                                  </div>
                                </Row>
                              </Col>
                            </Row>
                          )}
                          {frequencyLabel && (
                            <Row className='d-flex align-items-center py-2 anotherWithoutBackgroundBelow'>
                              <Col className='profilePortalSignOnLeft'>
                                <Row>
                                  <p className='lableService'>Installment Frequencies:</p>
                                </Row>
                                <Row className='useNewDesignSCSS pt-2 px-3'>
                                  <div className='customCheckboxRadio'>
                                    <CustomInput
                                      className="customInputEllipse"
                                      value={`${(frequencyLabel)}`}
                                      title={`${(frequencyLabel)}`}
                                      isDisable={isOrderFound}
                                    />
                                  </div>
                                </Row>
                              </Col>
                            </Row>
                          )}
                        </div>
                      )}
                    </>
                  </Row>
                )}
              </Col>
            </Modal.Body>
            <Modal.Footer>
              {(!showFeeAgreement || (activeModal === "first" && showFeeAgreement)) && ( 
                <>
                  {orderId ? (
                    <>
                      <div className="d-flex justify-content-between w-100">
                        <div className="d-flex flex-grow-1 justify-content-center">
                          <button className='border-0 shadow bg-white btn fw-bold me-auto '>Start Date: {formatDateToUS(subsGetData?.validityFrom ?? subsGetData?.updatedOn)}</button>
                        </div>
                        <div className="d-flex flex-grow-1 justify-content-center">
                          <PdfViewDocument isfeeAgreement={true} viewFileId={subsFileId} buttonName="Download" primaryName={client?.memberName} />
                        </div>
                        <div className="d-flex flex-grow-1 justify-content-center">
                          <Button className="theme-btn " onClick={handleViewButton}>
                            <h6 className="tag">View</h6>
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Button className="theme-btn " onClick={handleProceedButton}>
                      <h6 className="tag">Proceed</h6>
                    </Button>
                  )}
                </>
              )}
            </Modal.Footer>
          </div>
        )}
      {activeModal === "second" && (showFeeAgreement || fromFeeAgreement) && (
        <div className={fromFeeAgreement ? 'disabled-form' : ''}>
          <div className='p-3 feeAgreementMain' ref={componentRef}>
            <Modal.Body className='p-5 pt-3 pb-5'>
              <Row className='mb-3'>
                <img className='m-auto' style={{ width: '40%' }} src={logoBase64String} alt='Non-CrisisFeeAgreementLogo' />
              </Row>
              <Row>
                <Col style={{ textAlign: 'right', flexWrap:'nowrap', textWrap:'nowrap', marginLeft:'50px' }} className='d-flex justify-content-end mb-3 col-12'>
                  <label htmlFor="matterNumber" style={{ display: 'inline-flex', alignItems:'center' }} className='matterNumber text-right mr-2'>
                    Matter No.
                  </label>
                  <div style={{ position: 'relative', minWidth:'90px', width:'auto', paddingLeft:'5px', maxWidth: "130px", overflow:'hidden' }}>
                    <input id="matterNumber " className='ps-1' type="text" style={{ border: 'none', width: '100%', padding: '5px 0', boxSizing: 'border-box', outline: 'none', textOverflow: "ellipsis", fontSize: '13px'}} value={matterNumber} readOnly title={matterNumber}/>
                    <hr style={{ position: 'absolute', top: '12px', left: 0, width: `${underlineWidth}px`, height: 1, backgroundColor: 'black', border: 'none' }} />
                  </div>
                </Col>
              </Row>
              <Row className='text-center mb-3'>
                <h2 className='desclaimerheading2 m-0 p-0' style={headingStyleMain}>AGREEMENT FOR “LIFEPLANNING” & “ESTATE PLANNING” SERVICES</h2>
              </Row>
              <Row>
                <p style={headingStyleJust}>
                  {`We, LIFE POINT LAW (“Firm”), and you, ${client?.memberName && client?.spouseName
                    ? client.memberName.split(' ')[1] === client.spouseName.split(' ')[1]
                      ? `${client.memberName.split(' ')[0]} & ${client.spouseName}`
                      : `${client.memberName} & ${client.spouseName}`
                    : client?.memberName
                      ? client.memberName
                      : client?.spouseName
                        ? client.spouseName
                        : ''
                    } (“Client”), enter into this Agreement for `}<em>“LifePlanning”</em>{` & “Estate Planning” services on the following terms and conditions, and for the following fees and costs.`}
                </p>
              </Row>
              <ol type='number' start="1" className='custom-ordered-list p-0'>
                <Row>
                  <Col>
                  <div className='ms-4'>
                    <li className='desclaimerheading2' style={headingStyle}>Scope and Duration of Services and Pricing Basis: <span className='fw-normal text-black noneFontTable'>Client and Firm agree that the services to be provided under this Agreement are those services specifically marked below as “Included” and are priced as specifically marked on an “Hourly Basis” or “Flat Fee Basis”. Unless noted, third-party service costs shown are estimates only.</span></li>
                  </div>
                    <ol type="A" start="1" className='p-0 m-5 me-0 mb-3 mt-4' style={headingStyleNew}>
                      <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>{subscriptionPlans?.names[0]}</li>
                      <div className='tableMain'>
                        <Table bordered>
                          <thead className='text-center'>
                            <tr>
                              <th className='fw-bold vertical' style={{ writingMode: 'vertical-rl' }} rowSpan="3">
                                <span>Item</span>
                              </th>
                              <th className='fw-bold text-nowrap' colSpan="2">Included ?</th>
                              <th className='fw-bold borderDashed'>Description of Firm-Provided Services</th>
                            </tr>
                            <tr>
                              {(showHourlyBody && !showFlatFeeBody) && (
                                <th className='fw-bold' colSpan="2" rowSpan="2">Hourly Basis</th>
                              )}
                              {(showFlatFeeBody && !showHourlyBody) && (
                                <th className='fw-bold' colSpan="2" rowSpan="2">Flat Fee Basis</th>
                              )}
                              {(showHourlyBody && showFlatFeeBody) && (
                                <>
                                  <th className='fw-bold' rowSpan="2">Hourly Basis</th>
                                  <th className='fw-bold' rowSpan="2">Flat Fee Basis</th>
                                </>
                              )}
                              <th className='fw-bold borderDashed'>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', cursor: 'no-drop' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {['check-a1-a', 'check-a1-b', 'check-a1-e'].map((id, index) => {
                                      const label = skuListNames[index];
                                      const disableAll = skuListNames;
                                      const isCheckedAutomaticallyMatched =
                                        label === "Comprehensive LifePlan" &&
                                        subsPlansGetData[0]?.skuListName === "Comprehensive LifePlan" &&
                                        selectedCheckbox?.label === "Comprehensive LifePlan";

                                      return (
                                        <div key={id} style={{ display: 'flex', alignItems: 'center' }}>
                                          <input
                                            type="checkbox"
                                            className="form-check-input me-2"
                                            id={id}
                                            onChange={(e) => handleMainCheckboxChange(e, label)}
                                            checked={
                                              isCheckedAutomaticallyMatched ? label :
                                              selectedCheckbox ? selectedCheckbox?.label === label :
                                              isChecked(label)
                                            }
                                            disabled={disableAll}
                                          />
                                          <label
                                            className="form-check-label"
                                            style={{ fontSize: '13pt', color: '#720C20', whiteSpace: 'nowrap', opacity: 1, cursor: 'no-drop' }}
                                            htmlFor={id}
                                          >
                                            {label}
                                          </label>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {['check-a1-ee', 'check-a1-g'].map((id, index) => {
                                      const label = skuListNames[index + 3];
                                      const disableAll = skuListNames;
                                      const isCheckedAutomaticallyMatched =
                                        label === "Comprehensive LifePlan" &&
                                        subsPlansGetData[0]?.skuListName === "Comprehensive LifePlan" &&
                                        selectedCheckbox?.label === "Comprehensive LifePlan";

                                      return (
                                        <div key={id} style={{ display: 'flex', alignItems: 'center' }}>
                                          <input
                                            type="checkbox"
                                            className="form-check-input me-2"
                                            id={id}
                                            onChange={(e) => handleMainCheckboxChange(e, label)}
                                            checked={
                                              isCheckedAutomaticallyMatched ? label :
                                              selectedCheckbox ? selectedCheckbox?.label === label :
                                              isChecked(label)
                                            }
                                            disabled={disableAll}
                                          />
                                          <label
                                            className="form-check-label"
                                            style={{ fontSize: '13pt', color: '#720C20', whiteSpace: 'nowrap', opacity: 1, cursor: 'no-drop' }}
                                            htmlFor={id}
                                          >
                                            {label}
                                          </label>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </th>
                            </tr>
                            {shouldShowTR() && (
                              <tr>
                                <th>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center', cursor:'no-drop' }}>
                                    <label
                                      className="form-check-label fw-bold me-4"
                                      style={{ fontSize: '13pt', color: '#720C20', cursor:'no-drop' }}
                                      htmlFor="check-a1-j"
                                    >
                                      With
                                    </label>
                                      {['health', 'housing', 'finance'].map((key, index) => {
                                        const id = `check-a1-${String.fromCharCode(107 + index)}`;
                                        const optionValue = skuListNames[5 + index] || '';
                                        const formattedLabel = `Comprehensive LifePlan - ${key}`;
                                        const normalizeText = (text) =>
                                          (text || "").toLowerCase().replace(/[\{\}-]/g, '').replace(/\s+/g, ' ').trim();
                                        const labelText = skuListNames[5 + index]?.includes('Comprehensive LifePlan')
                                        ? skuListNames[5 + index]?.replace('Comprehensive LifePlan {', '')?.replace('}', '')
                                        : skuListNames[5 + index];
                                        const isManuallyClicked = manualSubCheckboxClicks[toCamelCase(key)];
                                        const isCheckedAutomatically = !isManuallyClicked && normalizeText(optionValue) === normalizeText(formattedLabel);
                                        const normalizedOptionValue = normalizeText(optionValue);
                                        const normalizedSubPlan = normalizeText(selectedSubCheckboxes?.label ? selectedSubCheckboxes?.label : subsPlansGetData.map(item => normalizeText(item.skuListName)).filter(Boolean).join(' '));
                                        const matchecvalue = normalizedSubPlan.includes(normalizedOptionValue) ? optionValue : null;
                                        const isPreviouslyChecked = selectedSubCheckboxes[id] === true;
                                        const disableAll = skuListNames;
                                      return (
                                        <React.Fragment key={key}>
                                          <input
                                            type="checkbox"
                                            className="form-check-input me-4"
                                            id={id}
                                            onChange={(e) => handleSubCheckboxChange(e, key)}
                                            checked={isPreviouslyChecked ? optionValue : isCheckedAutomatically ? matchecvalue : selectedSubCheckboxes?.label}
                                            disabled={disableAll} 
                                          />
                                          <label
                                            className="form-check-label fw-bold me-4"
                                            style={{ fontSize: '13pt', color: '#720C20', opacity: 1, cursor:'no-drop' }}
                                            htmlFor={id}
                                          >
                                            {labelText}
                                          </label>
                                        </React.Fragment>
                                      );
                                    })}
                                  </div>
                                </th>
                              </tr>
                            )}
                          </thead>
                          <tbody>
                          {firmProvidedCombinedServices.map((service) => {
                            const key = service?.key;
                            const isSubService = service.subFirmProvidedServiceObject !== undefined;
                            const isSpecialKey = key === 'D' || key === 'G' || key === 'A';
                            
                            return (
                              <React.Fragment key={key}>
                                <tr className={`text-center ${isSubService ? 'borderSolid' : ''}`}
                                  style={isSpecialKey ? { borderTop: '' } : {}}>
                                  <td>{key}.</td>
                                  {(showHourlyBody && !showFlatFeeBody) && (
                                    <td colSpan="2">
                                      <input
                                        type="checkbox"
                                        className="form-check-input draftPowerChecked"
                                        id={`check-${key}-hourly`}
                                        onChange={(e) => checkedClass('firmProvided', service?.key, e.target.checked)}
                                        checked={firmProvidedServices[service?.key]?.Checked || false}
                                      />
                                    </td>
                                  )}
                                  {(showFlatFeeBody && !showHourlyBody) && (
                                    <td colSpan="2">
                                      <input
                                        type="checkbox"
                                        className="form-check-input draftPowerChecked"
                                        id={`check-${key}-flatfee`}
                                        onChange={(e) => checkedClass('firmProvided', service?.key, e.target.checked)}
                                        checked={firmProvidedServices[service?.key]?.Checked || false}
                                      />
                                    </td>
                                  )}
                                  {(showHourlyBody && showFlatFeeBody) && (
                                    <>
                                      <td>
                                        <input
                                          type="checkbox"
                                          className="form-check-input draftPowerChecked"
                                          id={`check-${key}-hourly`}
                                          onChange={(e) => checkedClass('firmProvided', service?.key, e.target.checked)}
                                          checked={firmProvidedServices[service?.key]?.Checked || false}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="checkbox"
                                          className="form-check-input draftPowerChecked"
                                          id={`check-${key}-flatfee`}
                                          onChange={(e) => checkedClass('firmProvided', service?.key, e.target.checked)}
                                          checked={firmProvidedServices[service?.key]?.Checked || false}
                                        />
                                      </td>
                                    </>
                                  )}
                                  <td className="text-start">
                                    {service.EditableDescription !== undefined ? (
                                    <span style={{ display: "flex", width: "100%", wordWrap: "break-word", whiteSpace: "pre-wrap", }}>
                                      <div style={{ position: 'relative', display: service?.key == 'N' ? 'ruby':'flex', alignItems: 'center', width: '100%' }}>
                                        <div>{service.Description.split('___________')[0]}</div>
                                        <div className="textBlackInput" style={{ position: 'relative', width: service?.key > 'N' ? '100%' : service?.key == 'N' ? '80%' : 'auto', wordWrap: service?.key > 'N' ? 'break-word' : 'normal', whiteSpace: service?.key > 'N' ? 'pre-wrap' : 'nowrap', margin: service?.key > 'N' ? '0px' : '5px' }}>
                                          {service?.key > 'N' ? (
                                            <textarea
                                              id="matterNumber"
                                              className='textAreaEditable'
                                              value={service.EditableDescription}
                                              onChange={(e) => handleEditableDescriptionChange(key, e)}
                                              rows={1}
                                              onInput={handleInputTextHeight}
                                            />
                                          ) : (
                                            <input
                                              id="matterNumber"
                                              type="text"
                                              className='px-1 py-0'
                                              style={{ border: 'none', width: '100%', boxSizing: 'border-box', outline: 'none', fontSize: '13pt', cursor: 'text', fontFamily: 'Cambria, sans-serif', margin: '0px', position:'relative', top:'3px'}}
                                              value={service.EditableDescription}
                                              onChange={(e) => handleEditableDescriptionChange(key, e)}
                                            />
                                          )}
                                          <hr style={{ width: '90%', height: 1, backgroundColor: 'black', border: 'none', margin: '0px' }} />
                                        </div>
                                        <div>{service.Description.split('___________')[1]}</div>
                                      </div>
                                    </span>
                                    ) : (
                                      <span contentEditable={!(typeof service?.Description === 'string' && service.Description.trim())}>
                                        {service.Description}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                                {/* Render sub-items if they exist */}
                                {service.subFirmProvidedServiceObject &&
                                  Object.entries(service.subFirmProvidedServiceObject).map(([subKey, subService], index, array) => {
                                    const isLastSubService = index === array?.length - 1;
                                    return (
                                      <tr key={`${key}-${subKey}`} className={`text-center ${isSubService ? 'borderDashed' : 'borderSolid'}`}>
                                        <td></td> {/* Empty cell for alignment */}
                                        {(showHourlyBody && !showFlatFeeBody) && (
                                          <td colSpan="2">
                                            <input
                                              type="checkbox"
                                              className="form-check-input draftPowerChecked"
                                              onChange={(e) => checkedClass('firmProvided', service?.key, e.target.checked, subKey ? subKey : "")}
                                              checked={subService?.Checked || false}
                                            />
                                          </td>
                                        )}
                                        {(showFlatFeeBody && !showHourlyBody) && (
                                          <td colSpan="2">
                                            <input
                                              type="checkbox"
                                              className="form-check-input draftPowerChecked"
                                              onChange={(e) => checkedClass('firmProvided', service?.key, e.target.checked, subKey ? subKey : "")}
                                              checked={subService?.Checked || false}
                                            />
                                          </td>
                                        )}
                                        {(showHourlyBody && showFlatFeeBody) && (
                                          <>
                                            <td>
                                              <input
                                                type="checkbox"
                                                className="form-check-input draftPowerChecked"
                                                // onChange={(e) => checkedClass('firmProvided', service?.key, e.target.checked, subKey ? subKey : "")}
                                                // checked={subService?.Checked || false}
                                              />
                                            </td>
                                            <td>
                                              <input
                                                type="checkbox"
                                                className="form-check-input draftPowerChecked"
                                                onChange={(e) => checkedClass('firmProvided', service?.key, e.target.checked, subKey ? subKey : "")}
                                                checked={subService?.Checked || false}
                                              />
                                            </td>
                                          </>
                                        )}
                                        <td className='text-start'>
                                          <ul type="disc">
                                            <div className='d-flex justify-content-between'>
                                              <div style={{width:'100%'}}>
                                                <li>
                                                  {subKey === 'C-999999' || subKey.startsWith(`${key}-999999`) ? (
                                                    <div className='discInputField' style={{ position: 'relative', display: 'flex', width:'450px' }}>
                                                      <div>{subService.Description}</div>
                                                      <p
                                                        contentEditable
                                                        onInput={(e) => handleEditableDescriptionChange(key, subKey, e)}
                                                        style={{
                                                          border: 'none',
                                                          outline: 'none',
                                                          display: 'block',
                                                          whiteSpace: 'pre-wrap',
                                                          wordWrap: 'break-word',
                                                          width: '100%',
                                                          margin: 0,
                                                          paddingLeft:'10px',
                                                          paddingRight:'50px'
                                                        }}
                                                      >
                                                        {subService.EditableDescription}
                                                      </p>
                                                      <hr style={{ position: 'absolute', bottom: '-10px', left: 0, width: '90%', height: 1, backgroundColor: 'black', border: 'none', marginLeft: '50px' }} />
                                                    </div>
                                                  ) : (
                                                    subService.Description
                                                  )}
                                                </li>
                                              </div>
                                              {isLastSubService && key !== 'F' && (
                                                <div className='d-flex'>
                                                  <Button className='paralegalBtn hideInPrint px-2 py-0 me-1' onClick={() => addNewRowC(key)} style={{ minWidth: 'auto', maxHeight:'30px', top: '50px', backgroundColor: '#720C20', border: 'none' }}>
                                                    <h6 className='tag'>+</h6>
                                                  </Button>
                                                  {subKey !== 'C-999999' ? (
                                                  <Button className='paralegalBtn hideInPrint px-2 py-0 ms-1' onClick={() => removeRowC(key)} style={{ minWidth: 'auto', maxHeight:'30px', top: '50px', backgroundColor: '#720C20', border: 'none', cursor: 'pointer' }}>
                                                    <h6 className='h4 tag'>-</h6>
                                                  </Button>
                                                  ) : null}
                                                </div>
                                              )}
                                            </div>
                                          </ul>
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </React.Fragment>
                            );
                          })}
                        </tbody>

                        </Table>
                        <div>
                        <div className='d-flex'>
                          <Button
                            className='paralegalBtn mb-3 hideInPrint'
                            onClick={() => addNewRowA(firmProvidedCombinedServices[firmProvidedCombinedServices?.length - 1]?.key || 'A')}
                            style={{ minWidth: 'auto', top: '50px' }}
                            disabled={firmProvidedCombinedServices[firmProvidedCombinedServices?.length - 1]?.key === 'Z'}
                          >
                            <h6 className='tag'>+</h6>
                          </Button>
                          <Button
                            className='paralegalBtn mb-3 hideInPrint'
                            onClick={() => removeRowA(firmProvidedCombinedServices[firmProvidedCombinedServices?.length - 1]?.key)}
                            style={{ minWidth: 'auto', top: '50px', cursor: firmProvidedCombinedServices?.length === 0 ? 'not-allowed' : 'pointer' }}
                            disabled={firmProvidedCombinedServices[firmProvidedCombinedServices?.length - 1]?.key === 'N'}
                          >
                            <h6 className='h4 tag'>-</h6>
                          </Button>
                        </div>
                        <p>Filing Fees and fees paid to third parties are not covered by Flat Fee and will be billed separately.</p>
                        </div>
                      </div>
                      <div>
                      <li start="2" className='desclaimerheading2 ms-4 py-3' style={{ ...headingStyle}}>{subscriptionPlans.names[1]}</li>
                        <Table bordered>
                          <thead className='text-center'>
                            <tr>
                              <th className='fw-bold vertical ps-3 pt-3' style={{ writingMode: 'vertical-rl' }}><span>Included</span></th>
                              <th className='fw-bold vertical' style={{ writingMode: 'vertical-rl' }}><span>Item</span></th>
                              <th className='fw-bold' style={{width: '300px'}}>Description of Third-Party Provided Services</th>
                              <th className='fw-bold'>Third-Party Service Provider</th>
                              <th className='fw-bold' style={{width: '150px'}}>Cost Estimate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {thirdPartyCombinedServices.map((service) => (
                              <tr className='text-center' key={service?.key}>
                                <td>
                                  <input
                                    type="checkbox"
                                    className={`form-check-input ${service.Checked ? 'checked' : ''}`}
                                    id={`check-a1-z1-${service?.key}`}
                                    onChange={(e) => checkedClass('thirdParty', service?.key, e.target.checked ? e.target.id : "")}
                                    checked={service.Checked || false}
                                  />
                                </td>
                                <td>{service?.key}.</td>
                                <td contentEditable onBlur={(e) => handleThirdPartyChange(service?.key, "Description", e.target.innerText)}>{service.Description || ""}</td>
                                <td contentEditable onBlur={(e) => handleThirdPartyChange(service?.key, "serviceProvider", e.target.innerText)}>
                                    {service.serviceProvider || ""}
                                </td>
                                <td className='text-start'>
                                {service?.key.charCodeAt(0) > 'F'.charCodeAt(0) ? (
                                    <>
                                      <div className='formatedValueSorted d-flex currencyInputWrapper'>
                                        {!showDropdown[service?.key] && (
                                          <>
                                          <div style={{ position: 'relative', width:'100%'}}>
                                            <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', alignItems: 'baseline', left: '5px', display:'flex', }}>$<span className='ms-1'></span>
                                              { fromFeeAgreement ? (
                                                <input
                                                type="text"
                                                className="border-0 p-0"
                                                placeholder="Enter Cost"
                                                value={
                                                  thirdPartyProvided[service?.key]?.curCost !== undefined &&
                                                  thirdPartyProvided[service?.key]?.curCost !== null &&
                                                  thirdPartyProvided[service?.key]?.curCost !== '' &&
                                                  !isNaN(parseFloat(thirdPartyProvided[service?.key]?.curCost))
                                                    ? Number(thirdPartyProvided[service?.key]?.curCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                    : inputValues[service?.key] || 'Waived'
                                                }
                                                onChange={(e) => handleInputChangeThirdParty(service?.key, e.target.value, true)}
                                                onBlur={() => handleInputBlurThirdParty(service?.key)}
                                                onKeyPress={(e) => handleInputKeyPressThirdParty(e, service?.key)}
                                                onFocus={(e) => {
                                                  if (e.target.value === '0.00' || e.target.value === '$0.00') {
                                                    handleInputChangeThirdParty(service?.key, '', true);
                                                  }}}
                                                disabled={
                                                  isNaN(parseFloat(thirdPartyProvided[service?.key]?.curCost)) ||
                                                  thirdPartyProvided[service?.key]?.curCost === 'Waived' ||
                                                  isNaN(service?.curCost) || 
                                                  service?.curCost === 'Waived'
                                                }
                                              />
                                              ) : (
                                                <input
                                                type="text"
                                                className="border-0 p-0"
                                                placeholder="Enter Cost"
                                                value={
                                                  inputValues[service?.key] !== undefined
                                                    ? inputValues[service?.key]
                                                    : service?.curCost !== undefined && service?.curCost !== null && service?.curCost !== '' && !isNaN(parseFloat(service?.curCost))
                                                      ? Number(service?.curCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                      : 'Waived'
                                                }                                       
                                                onChange={(e) => handleInputChangeThirdParty(service?.key, e.target.value, true)}
                                                onBlur={() => handleInputBlurThirdParty(service?.key)}
                                                onKeyPress={(e) => handleInputKeyPressThirdParty(e, service?.key)}
                                                onFocus={(e) => {
                                                  if (e.target.value === '0.00' || e.target.value === '$0.00') {
                                                    handleInputChangeThirdParty(service?.key, '', true);
                                                  }}}
                                                disabled={
                                                  isNaN(service?.curCost) || 
                                                  service?.curCost === 'Waived'
                                                }
                                              />
                                              )}
                                            </span>
                                          </div>
                                            <button className='bg-white border-0 hideInPrint' onClick={() => {
                                              const inputValue = thirdPartyProvided[service?.key]?.curCost;
                                              if (inputValue && inputValue.trim() !== '') {
                                                toggleDropdown(service?.key);
                                              } else {
                                                staticAlertTimer('Please add a cost before clicking.');
                                              }
                                            }}>
                                              &#9662;
                                            </button>
                                          </>
                                        )}
                                      </div>
                                      {showDropdown[service?.key] && (
                                        <div className='d-flex'>
                                          <select className='border-0 p-0' value={service?.curCost || ''} onChange={(e) => handleInputChangeThirdParty(service?.key, e?.target?.value, true)}>
                                            {service?.costOptions?.map((option, index) => (
                                              <option key={index} value={option}>{option.includes('Waived') ? 'Waived' : `$ ${Number(option).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</option>
                                            ))}
                                            {service?.curCost !== "Waived" && <option value={service?.curCost || ''} onChange={(e) => handleInputChangeThirdParty(service?.key, e?.target?.value, true)}>Edit Cost</option>}
                                          </select>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className='d-flex'>
                                      <select className='border-0 p-0' value={service?.curCost || ''} onChange={(e) => handleInputChangeThirdParty(service?.key, e?.target?.value, true)}>
                                        {service?.costOptions?.map((option, index) => (
                                          <option key={index} value={option}>{option.includes('Waived') ? 'Waived' : `$ ${Number(option).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</option>
                                        ))}
                                      </select>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        <div className='d-flex'>
                            <Button
                              className='paralegalBtn mb-3 hideInPrint'
                              onClick={() => addNewRowB(thirdPartyCombinedServices[thirdPartyCombinedServices?.length - 1]?.key || 'A')}
                              style={{ minWidth: 'auto', top: '50px' }}
                              disabled={thirdPartyCombinedServices[thirdPartyCombinedServices?.length - 1]?.key === 'Z'}
                            >
                              <h6 className='tag'>+</h6>
                            </Button>
                            <Button
                              className='paralegalBtn mb-3 hideInPrint'
                              onClick={() => removeRowB(thirdPartyCombinedServices[thirdPartyCombinedServices?.length - 1]?.key)}
                              style={{ minWidth: 'auto', top: '50px', cursor: thirdPartyCombinedServices?.length === 0 ? 'not-allowed' : 'pointer' }}
                              disabled={thirdPartyCombinedServices[thirdPartyCombinedServices?.length - 1]?.key === 'I'}
                            >
                              {konsole.log(thirdPartyCombinedServices?.length,"thirdPartyCombinedServices")}
                              <h6 className='h4 tag'>-</h6>
                            </Button>
                          </div>
                      </div>
                      <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Summary of Fees, Costs, and Deposits:</li>
                      <div className='formatedValueSorted'>
                        <Table bordered>
                          <thead className='text-center'>
                            <tr>
                              <th className='fw-bold vertical' style={{ writingMode: 'vertical-rl' }}><span>Item</span></th>
                              <th className='fw-bold' style={{width:'300px'}}>For Firm-Provided Services:</th>
                              <th className='fw-bold'>Payment Amount</th>
                              <th className='fw-bold' style={{width: '150px'}}>Advance Fee & Cost Deposit</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className='text-center' id='retainerField'>
                              <td>1.</td>
                              <td className='text-start w-50'>Retainer</td>
                              <td className='text-start'>
                              <div style={{ position: 'relative'}} className="currencyInputWrapper">
                                <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', alignItems: 'baseline', left: '5px', display:'flex', }}>$<span className='ms-1'></span>
                                <input
                                  type="text"
                                  className='border-0 p-0'
                                  value={inputValuesSummaryOfFee?.value1 ? String(inputValuesSummaryOfFee.value1).toLocaleString() : ""}
                                  onFocus={(e) => handleInputFocusSummaryOfFees(e, 'value1')}
                                  onChange={(e) => handleInputChangeSummaryOfFees(e, 'value1')}
                                  onBlur={() => handleInputBlurSummaryOfFees('value1')}
                                  readOnly
                                />
                                </span>
                              </div>
                              </td>
                              <td className='text-start' style={{ background: '#CDCBCB' }}></td>
                            </tr>
                          {showFlatFeeBody && !showHourlyBody && (
                            <tr className='text-center' id='flatFeeDepositField'>
                              <td>2.</td>
                              <td className='text-start w-50'>Services Provided on a Flat Fee Basis</td>
                              <td className='text-start'>
                              <div style={{ position: 'relative'}} className="currencyInputWrapper">
                                <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', alignItems: 'baseline', left: '5px', display:'flex', }}>$<span className='ms-1'></span>
                                <input
                                  type="text"
                                  className='border-0 p-0'
                                  value={inputValuesSummaryOfFee?.value2 ? String(inputValuesSummaryOfFee.value2).toLocaleString() : ""}
                                  onFocus={(e) => handleInputFocusSummaryOfFees(e, 'value2')}
                                  onChange={(e) => handleInputChangeSummaryOfFees(e, 'value2')}
                                  onBlur={() => handleInputBlurSummaryOfFees('value2')}
                                  readOnly
                                />
                                </span>
                              </div>
                            </td>
                              <td className='text-start' style={{ background: '#CDCBCB' }}></td>
                            </tr>
                          )}
                          {!showFlatFeeBody && showHourlyBody && (
                            <tr className='text-center'>
                              <td>2.</td>
                              <td className='text-start w-50'>Deposit for Services Provided on an Hourly Basis</td>
                              <td className='text-start' style={{ background: '#CDCBCB' }}></td>
                              <td className={!showInput ? 'text-start' : 'text-center'}>
                              {!showInput ? (
                                <div style={{ position: 'relative'}} className="currencyInputWrapper">
                                <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', alignItems: 'baseline', left: '5px', display:'flex', }}>$<span className='ms-1'></span>
                                <input
                                  type="text"
                                  className='border-0 p-0'
                                  value={variableValue}
                                  onFocus={(e) => handleInputFocusSummaryOfFees(e, 'value3')}
                                  onChange={(e) => handleInputChangeSummaryOfFees(e, 'value3')}
                                  onBlur={() => handleInputBlurSummaryOfFees('value3')}
                                />
                                </span>
                              </div>
                              ) : (
                                <span>N/A</span>
                              )}
                            </td>
                            </tr>
                          )}
                          {showFlatFeeBody && showHourlyBody && (
                            <>
                            <tr className='text-center'>
                              <td>2.</td>
                              <td className='text-start w-50'>Services Provided on a Flat Fee Basis</td>
                              <td className='text-start'>
                              <div style={{ position: 'relative'}} className="currencyInputWrapper">
                                <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', alignItems: 'baseline', left: '5px', display:'flex', }}>$<span className='ms-1'></span>
                                <input
                                  type="text"
                                  className='border-0 p-0'
                                  value={inputValuesSummaryOfFee?.value2}
                                  onChange={(e) => handleInputChangeSummaryOfFees(e, 'value2')}
                                  onBlur={() => handleInputBlurSummaryOfFees('value2')}
                                  readOnly
                                />
                                </span>
                              </div>
                            </td>
                              <td className='text-start' style={{ background: '#CDCBCB' }}></td>
                            </tr>
                            <tr className='text-center'>
                              <td>3.</td>
                              <td className='text-start w-50'>Services Provided on an Hourly Basis</td>
                              <td className='text-start' style={{ background: '#CDCBCB' }}></td>
                              <td className={!showInput ? 'text-start' : 'text-center'}>
                              {!showInput ? (
                                <div style={{ position: 'relative'}} className="currencyInputWrapper">
                                <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', alignItems: 'baseline', left: '5px', display:'flex', }}>$<span className='ms-1'></span>
                                <input
                                  type="text"
                                  className='border-0 p-0'
                                  value={inputValuesSummaryOfFee?.value3}
                                  onChange={(e) => handleInputChangeSummaryOfFees(e, 'value3')}
                                  onBlur={() => handleInputBlurSummaryOfFees('value3')}
                                  readOnly
                                />
                                </span>
                              </div>
                              ) : (
                                <span>N/A</span>
                              )}
                            </td>
                            </tr>
                            </>
                          )}
                          </tbody>
                        </Table>
                      </div>
                      <div className='formatedValueSorted'>
                        <h5 className='desclaimerheading2 ms-3 pb-3' id="makeAmountPaid" style={headingStyle}>For Third-Party Provided Services:</h5>
                        <Table bordered>
                          <tbody>
                            <tr className='text-center'>
                            {showFlatFeeBody && !showHourlyBody && (
                              <td style={{width: '6%'}}>3.</td>
                            )}
                            {!showFlatFeeBody && showHourlyBody && (
                              <td style={{width: '6%'}}>3.</td>
                            )}
                            {showFlatFeeBody && showHourlyBody && (
                              <td style={{width: '6%'}}>4.</td>
                            )}
                              <td className='text-start w-50'>Cost Estimate</td>
                              <td className='text-start' style={{ background: '#CDCBCB' }}></td>
                              <td className={`${showInput ? 'text-center' : 'text-start'} w-25`}>
                                {!showInput ? (
                                  <div style={{ position: 'relative'}} className="currencyInputWrapper">
                                  <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', alignItems: 'baseline', left: '5px', display:'flex', }}>$<span className='ms-1'></span>
                                    <input
                                      type="text"
                                      className='border-0 p-0'
                                      // value={`${calculateTotalCost.toFixed(2)}${Object.values(inputValues).some(value => value.includes('Waived')) ? 'Waived' : ''}`}
                                      value={calculateTotalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      readOnly
                                    />
                                    </span>
                                  </div>
                                ) : (
                                  <span>N/A</span>
                                )}
                              </td>
                            </tr>
                            <br />
                            <tr className='text-start'>
                              <td className='text-end' style={{borderLeft: '1px solid white', textAlign: 'right',borderBottom: '1px solid white', borderTop: '1px solid white' }} colSpan="2">Sub-Totals</td>
                              <td className="bordernone" style={{borderBottom: '1px solid #dee2e6'}}>
                                <div style={{ position: 'relative'}} className="currencyInputWrapper">
                                  <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', alignItems: 'baseline', left: '5px', display:'flex', }}>$<span className='ms-1'></span>
                                  <input
                                    type="text"
                                    className='border-0 p-0'
                                    value={
                                      inputValuesSummaryOfFee?.value4
                                        ? Number(inputValuesSummaryOfFee?.value4.replace(/,/g, "")).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : "0.00"
                                    }
                                    onChange={(e) => handleInputChangeSummaryOfFees(e, 'value4')}
                                    onBlur={() => handleInputBlurSummaryOfFees('value4')}
                                    readOnly
                                    key={sendLinkRender}
                                  />
                                  </span>
                                </div>
                              </td>
                              <td className={`${showInput ? 'text-center' : 'text-start'} w-25`}>
                              {!showInput ? (
                                <div style={{ position: 'relative'}} className="currencyInputWrapper">
                                  <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', alignItems: 'baseline', left: '5px', display:'flex', }}>$<span className='ms-1'></span>
                                    <input
                                      type="text"
                                      className='border-0 p-0'
                                      // value={`${calculateTotalCost.toFixed(2)}${Object.values(inputValues).some(value => value.includes('Waived')) ? 'Waived' : ''}`}
                                      value={calculateTotalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      readOnly
                                    />
                                  </span>
                              </div>
                              ) : (
                                <span>N/A</span>
                              )}
                              </td>
                            </tr>
                            <tr className='text-start'>
                              <td className='bordernoneright text-end' style={{border: '1px solid white', borderRight: '1px solid #dee2e6', textAlign: 'right'}} colSpan="3">Total of Flat-Fees and Deposits</td>
                              <td>
                              <div style={{ position: 'relative'}} className="currencyInputWrapper">
                                <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', alignItems: 'baseline', left: '5px', display:'flex', }}>$<span className='ms-1'></span>
                                <input
                                  type="text"
                                  className='border-0 p-0'
                                  // value={`${(parseFloat(computeValue5(inputValuesSummaryOfFee?.value4, calculateTotalCost))).toFixed(2)}${Object.values(inputValues).some(value => value.includes('Waived')) ? 'Waived' : ''}`}
                                  value={`${Number(computeValue5(inputValuesSummaryOfFee?.value4.replace(/,/g, ""), calculateTotalCost)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                  onChange={(e) => handleInputChangeSummaryOfFees(e, 'value5')}
                                  onBlur={() => handleInputBlurSummaryOfFees('value5')}
                                  readOnly
                                />
                                </span>
                              </div>
                              </td>
                            </tr>
                            <tr className='text-start'>
                              <td className='bordernoneright text-end' style={{border: '1px solid white', borderRight: '1px solid #dee2e6', textAlign: 'right', borderTop: '2px solid white',}} colSpan="3">Full Payment Discount</td>
                              <td>
                              {/* <div style={{ position: 'relative'}} onClick={handleDiscountClick}> */}
                              <div style={{ position: 'relative'}} className="currencyInputWrapper">
                                <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', alignItems: 'baseline', left: '5px', display:'flex', }}>$<span className='ms-1'></span>
                                <input
                                  type="text"
                                  className='border-0 p-0'
                                  value={variableValue6}                                  
                                  onFocus={(e) => handleInputFocusSummaryOfFees(e, 'value6')}
                                  onChange={(e) => handleInputChangeSummaryOfFees(e, 'value6')}
                                  onBlur={() => handleInputBlurSummaryOfFees('value6')}
                                  // disabled={isDiscountDisabled()}
                                />
                                </span>
                              </div>
                              </td>
                            </tr>
                            {checkedValueOfPlan === '0.00' ? null : (
                            <tr className='text-start'>
                              <td className='bordernoneright text-end' style={{border: '1px solid white', borderRight: '1px solid #dee2e6',borderBottom: '2px solid white', borderTop: '2px solid white', textAlign: 'right'}} colSpan="3">AMA Credit</td>
                              <td>
                              <div style={{ position: 'relative'}} className="currencyInputWrapper">
                                <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', alignItems: 'baseline', left: '5px', display:'flex', }}>$<span className='ms-1'></span>
                                <input
                                  type="text"
                                  className='border-0 p-0'
                                  value={checkedValueOfPlan}
                                  readOnly
                                />
                                </span>
                              </div>
                              </td>
                            </tr>
                            )}
                            <tr className='text-start'>
                              <td className='bordernoneright text-end' style={{border: '1px solid white', borderRight: '1px solid #dee2e6',borderBottom: '2px solid white', borderTop: '2px solid white', textAlign: 'right'}} colSpan="3">Amount Paid</td>
                              <td>
                              <div style={{ position: 'relative'}} className="currencyInputWrapper">
                                <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', alignItems: 'baseline', left: '5px', display:'flex', }}>{inputValuesSummaryOfFee?.value7 !== "0.00" && "$"}<span className='ms-1'></span>
                                <input
                                  type="text"
                                  className='border-0 p-0'
                                  value={variableValue7}                                                                                                                                                   
                                  onChange={(e) => handleInputChangeSummaryOfFees(e, 'value7')}
                                  onBlur={() => handleInputBlurSummaryOfFees('value7')}
                                  onClick={handleInputClick}
                                  readOnly
                                />
                                </span>
                              </div>
                              </td>
                            </tr>
                            <Modal id="modal-contents-paralegal-InBetween" className='hideInPrint hideInSendDoc' dialogClassName="custom-modal-dialog-inBetween"  show={showModal} onHide={handleModalClose}>
                              <Modal.Header closeButton closeVariant="white"><Modal.Title>Select Payment Type</Modal.Title></Modal.Header>
                              <Modal.Body>
                                <label className='fw-bold'>Please select the payment option</label>
                                <Form className="mb-4 mt-3">
                                  <div className="d-flex align-items-center mb-3">
                                    <Form.Check
                                      type="radio"
                                      value="full"
                                      checked={paymentChoice === "full"}
                                      onChange={handlePaymentChoiceChange}
                                      className="me-2"
                                    />
                                    <label>
                                      Full Payment - ${" "}
                                      {(
                                        parseFloat(inputValuesSummaryOfFee?.value5?.replace(/,/g, '')) - 
                                        (inputValuesSummaryOfFee?.value6 ? parseFloat(inputValuesSummaryOfFee?.value6?.replace(/,/g, '')) : 0)
                                      ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </label>
                                  </div>
                                  <div className="d-flex align-items-center mb-3">
                                    <Form.Check
                                      type="radio"
                                      value="installment"
                                      checked={paymentChoice === "installment"}
                                      onChange={handlePaymentChoiceChange}
                                      className="me-2"
                                    />
                                    <label>Installment</label>
                                  </div>
                                </Form>
                                {paymentChoice === "installment" && (
                                  <div>
                                    <div className="mt-3">
                                      <label className='fw-bold'>How much would you like to pay now? &#x2a;</label>
                                      <div className="mt-2">
                                        <div className="input-group">
                                          <span className="input-group-text">$</span>
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={
                                              inputValuesSummaryOfFee?.value7
                                                ? String(inputValuesSummaryOfFee.value7).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                : ""
                                            }                                            
                                            onChange={(e) => handleInputChangeSummaryOfFeesOther(e, "value7")}
                                            onBlur={() => handleInputBlurSummaryOfFeesOther("value7")}
                                            onClick={handleInputClick}
                                            placeholder="Enter amount"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                      <div className="mt-3">
                                        <label className='fw-bold'>Installment Frequencies: &#x2a;</label>
                                        <Form.Select value={paymentFrequency} onChange={handlePaymentFrequencyChange}>
                                          <option value="">Select frequency</option>
                                          <option value="weekly">Weekly</option>
                                          <option value="monthly">Monthly</option>
                                          <option value="yearly">Yearly</option>
                                          <option value="onetime">One-time</option>
                                        </Form.Select>
                                      </div>
                                      {paymentFrequency && paymentFrequency !== "onetime" && (
                                        <>
                                          <div className="mt-3">
                                            <label className='fw-bold'>How many installments? &#x2a;</label>
                                            <input
                                              type="number"
                                              className="form-control"
                                              min="1"
                                              max={paymentFrequency === 'monthly' ? 240 : paymentFrequency === 'weekly' ? 1043 : paymentFrequency === 'yearly' ? 20 : 20}
                                              value={installmentDuration}
                                              onChange={handleInstallmentDurationChange}
                                            />
                                          </div>
                                          {installmentDuration && installmentAmount && (
                                            <div className="fw-bold text-end">
                                              {paymentFrequency === "weekly" && (
                                                <div>
                                                  Weekly Installment Amount: ${installmentAmount}
                                                </div>
                                              )}
                                              {paymentFrequency === "monthly" && (
                                                <div>
                                                  Monthly Installment Amount: ${installmentAmount}
                                                </div>
                                              )}
                                              {paymentFrequency === "yearly" && (
                                                <div>
                                                  Yearly Installment Amount: ${installmentAmount}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                  {(paymentFrequency === "onetime") && (
                                    <div>
                                    <div className="mt-3">
                                      <label className='fw-bold'>Select Installment Date: &#x2a;</label>
                                      <input
                                        type="date"
                                        value={selectedDateFuture}
                                        onChange={handleDateChangeFuture}
                                        className="form-control mt-2"
                                        // min={new Date().toISOString().split("T")[0]}
                                        min={formattedSevenDaysLater}
                                        max={formattedOneYearLater}
                                      />
                                      {selectedDateFuture === "" && <p className="text-danger">Please enter a date.</p>}
                                    </div>
                                    <div className="mt-3">
                                      <label className='fw-bold'>Note: <span className='fw-normal'>Next Installment will be accepted between 7th to 365th day from the current payment.</span></label>
                                    </div>
                                  </div>
                                )}
                                {paymentChoice === "full" && (
                                  <div className="mt-3">
                                    <label>Total Payment Amount:</label>
                                    <div className="mt-2">
                                      <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <input
                                          type="text"
                                          className="form-control"
                                          value={`$ ${(
                                            parseFloat(inputValuesSummaryOfFee?.value5?.replace(/,/g, '')) - 
                                            (inputValuesSummaryOfFee?.value6 ? parseFloat(inputValuesSummaryOfFee?.value6?.replace(/,/g, '')) : 0)
                                          ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Modal.Body>
                              <Modal.Footer>
                              <Button className="theme-btn" onClick={() => {
                                setInputValuesSummaryOfFee((prevState) => ({
                                  ...prevState,
                                  value7: "0.00",
                                }));
                                handleModalClose();
                              }}>Close</Button>
                              <Button className="theme-btn" onClick={handleConfirm}>Confirm</Button>
                              </Modal.Footer>
                            </Modal>
                            <tr className='text-start'>
                              <td className='bordernoneright text-end' style={{ border: '1px solid white', borderRight: '1px solid #dee2e6', borderBottom: '2px solid white', borderTop: '2px solid white', textAlign: 'right' }} colSpan="3">Amount Due</td>
                              <td>
                              <div style={{ position: 'relative'}} className="currencyInputWrapper">
                                <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', alignItems: 'baseline', left: '5px', display:'flex', }}>$<span className='ms-1'></span>
                                <input
                                  type="text"
                                  className='border-0 p-0'
                                  // value={`${(parseFloat(computeValue8((parseFloat(computeValue5(inputValuesSummaryOfFee?.value4, calculateTotalCost))) + '', inputValuesSummaryOfFee?.value6, inputValuesSummaryOfFee?.value7))).toFixed(2)}${Object.values(inputValues).some(value => value.includes('Waived')) ? 'Waived' : ''}`}
                                  value={variableValuePayment}                                                                                                                                  
                                  onChange={(e) => handleInputChangeSummaryOfFees(e, 'value8')}
                                  onBlur={() => handleInputBlurSummaryOfFees('value8')}
                                  readOnly
                                />
                                </span>
                              </div>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                      <div>
                        {(showFlatFeeBody && !showHourlyBody) || (showFlatFeeBody && showHourlyBody) ? (
                          <div>
                            <li className='desclaimerheading2 ms-4' style={headingStyle}>Duration of Agreement for Fixed Fee Agreement. <span className='text-black noneFontTable' style={headingStyleJust}> If the agreement is a Fixed Fee Agreement, then the following time limits apply to the duration of time the Firm will make itself available, after which additional fees will apply as set out elsewhere in this Agreement. <br /></span></li>
                            <ul>
                              <ol type='i' start="1" className='mt-4'>
                                <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Legal Planning: <span className='text-black noneFontTable p-2' style={headingStyle}>3-months</span></li>
                                <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Legal LifePlanning: <span className='text-black noneFontTable p-2' style={headingStyle}>12-months</span></li>
                                <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Comprehensive LifePlanning: <span className='text-black noneFontTable p-2' style={headingStyle}>18-months</span></li>
                              </ol>
                            </ul>
                          </div>
                        ) : null}
                      </div>
                      <div className='my-4'>
                        {(showFlatFeeBody && !showHourlyBody) || (showFlatFeeBody && showHourlyBody) ? (
                          <div>
                            <li className='desclaimerheading2 ms-4' style={headingStyle}>Scope of Estate Planning Services. <span className='fw-normal text-black noneFontTable'>When you embark on the estate planning portion of your <em>LifePlanning </em> work, here is what you can expect from us:  We will prepare an initial set of legal documents based on the initial discussions that we feel will address your planning objectives.  You can make one set of changes to the documents, no matter how drastic, when you meet with an attorney to review your drafts.  And you can make one set of corrections to the updated drafts to correct scrivener’s errors (spellings of names, address and phone number corrects, and the like).  Anything outside of this scope will be billed on an hourly basis. <br /></span></li>
                          </div>
                        ) : null}
                      </div>
                      <div className='my-4'>
                        {(showFlatFeeBody && !showHourlyBody) || (showFlatFeeBody && showHourlyBody) ? (
                          <div>
                            <li className='desclaimerheading2 ms-4' style={headingStyle}>Work beyond the time limits. <span className='fw-normal text-black noneFontTable'>Once the <em>LifePlan</em> It is possible that the work may not be completed during the time limits set out in this Agreement. Should the delay be caused by Client, the Firm will continue to provide services to completion under the Annual Maintenance Agreement. <br /></span></li>
                          </div>
                        ) : null}
                      </div>
                    </ol>
                    </Col>
                </Row>
              </ol>
                <ol type='A' start="4">
                  <div>
                    {(showHourlyBody || showFlatFeeBody) && (
                      <div>
                        <li className='desclaimerheading2 ms-4' style={headingStyle}>Optional Annual Maintenance Agreement. <span className='fw-normal text-black noneFontTable'>Once the <em>LifePlan</em> is completed, it is very common for Clients to experience life changes that may require updates to the <em>LifePlan</em>. Given that the purpose of the <em>LifePlan</em> is to pull together health, housing, financial, legal, and family affairs, and that each aspect of the <em>LifePlan</em> is subject to change over time, the Firm is committed to remain available to the Client to keep the Plan up to date via the Annual Maintenance Agreement (AMA) for an annual fee of seven hundred and fifty dollars an no cents ($750.00) for a Trust based plan or five hundred dollars and no cents ($500.00) for a Will based plan.  Through this Agreement the client will be able to have access to the Firm at no additional cost, be able to make an unlimited number of changes to legal documents once every year at no extra cost, and have access to the Portal at no additional cost. <em style={{ textDecoration: 'underline', fontWeight: 'bold' }}>The attached Exhibit C describes the services the Firm will provide under the Annual Maintenance Agreement, which will automatically begin after the time limit discussed in paragraph 1D has expired.</em> The Client can always opt out of the enrollment from the AMA, subject to the terms and conditions set out in the Annual Maintenance Agreement. <br /></span></li>
                        <div className={`d-flex ${client?.spouseName ? 'justify-content-around' : 'justify-content-start'}`} style={{ marginLeft: client?.spouseName ? '0' : '60px' }}>
                          <div style={{ position: 'relative' }}>
                            <input type="text" value={primaryInitials} onClick={handlePrimaryClick} style={{ border: 'none', width: '100%', padding: '5px 0', boxSizing: 'border-box', outline: 'none', textAlign:'center', fontSize: '13pt', fontFamily:'Cambria, sans-serif' }} readOnly/>
                            <hr style={{ position: 'absolute', top: '10px', left: 0, textAlign: 'center', width: '100%', height: 1, backgroundColor: 'black', border: 'none' }} />
                          </div>
                          {client?.spouseName && (
                            <div style={{ position: 'relative' }}>
                              <input type="text" value={spouseInitials} onClick={handleSpouseClick}style={{ border: 'none', width: '100%', padding: '5px 0', boxSizing: 'border-box', outline: 'none', textAlign:'center', fontSize: '13pt', fontFamily:'Cambria, sans-serif' }} readOnly/>
                              <hr style={{ position: 'absolute', top: '10px', left: 0, textAlign: 'center', width: '100%', height: 1, backgroundColor: 'black', border: 'none' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </ol>
              <ol type='number' start="2" className='custom-ordered-list p-0'>
                <Row>
                  <Col>
                  <div className='pb-3'>
                    {(showHourlyBody || showFlatFeeBody) && (
                      <li className='desclaimerheading2 ms-4' style={headingStyle}>
                        Additional Services: <span className='fw-normal text-black noneFontTable'>
                        The Firm will not perform work beyond the identified scope of services detailed above, including any implementation of the <em>“LifePlan,”</em> nor will it facilitate additional services by third-party providers, without written authorization from Client approving the additional scope and cost and agreeing to make an additional fee and cost deposit, if required.
                        </span>
                      </li>
                    )}
                  </div>

                    <div>
                      {showHourlyBody && !showFlatFeeBody && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Explanation of Terms Used in This Agreement: </li>
                          <ol type='A' start="1">
                            <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Advance Fee and Cost Deposit: <span className='fw-normal text-black noneFontTable'>A payment made by Client, to be applied against future fees and costs for services provided by Firm on an Hourly Basis and for third-party provided services. Advance fee and cost deposits are NOT a guarantee to provide services for a fixed cost and are deposited into the Firm’s lawyer’s trust account.</span></li>
                            <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Retainer: <span className='fw-normal text-black noneFontTable'>A fee you pay to the Firm for it to make its attorneys and staff available during a specific period or on a specific matter, in addition to and apart from compensation paid for services performed. The retainer covers eighteen (18) months for a Comprehensive LifePlan, twelve (12) months for a Legal LifePlan, or three (3) months for a Legal only plan. A retainer is the Firm’s property on receipt and is not refundable.</span></li>
                            <li className='desclaimerheading2 ms-4' style={headingStyle}>Lawyer’s Trust Account: <span className='fw-normal text-black noneFontTable'>In accordance with the Washington State Bar Association (WSBA) requirements, attorneys must maintain a non-interest-bearing account into which Client Advance Fee and Cost Deposits are deposited. It is also referred to as an “IOLTA” account.  The WSBA requires all hourly and cost deposit charges to be processed separately from flat fee funds and placed into an IOLTA account.</span></li>
                          </ol>
                        </div>
                      )}
                    </div>
                    <div>
                      {(showHourlyBody || showFlatFeeBody) && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>How We Bill for Our Services: </li>
                          <ol type='A' start="1">
                            <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Hourly Basis Services: <span className='fw-normal text-black noneFontTable'>For services provided on an hourly basis, now or in future, the Firm bills the Client hourly rates for the work performed by its attorneys and staff, plus costs incurred on Clients behalf. The Firm will strive to minimize your expenditure, but there is no guarantee as to the total amount you will spend.</span></li>
                            <ol type='i' start="1">
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>How Time is Billed: <span className='fw-normal text-black noneFontTable'>You will be billed for attorney and staff time in 1/10th hour (6 minute) increments. Hourly rates are charged for all time expended on your matter, including time spent in conferences, time spent on all telephone calls to you and received from you, legal research specific to your matter, preparation of documents and memoranda, review of Client-provided materials, team meetings concerning the case, drafting and reviewing email and other correspondence, travel time (if required), and other activities that we may deem necessary for your matter. A minimum time charge of 1/10th of an hour is charged for any item billed.</span></li>
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Hourly Rates: <span className='fw-normal text-black noneFontTable'>Our hourly rates are based on many factors, including individual education, experience, and expertise. We review and adjust our rates from time to time. You will be charged the rates in effect at the time the fees are incurred, but we will provide you with at least one month advance notice of any rate changes. Our current hourly rates are shown below. The Firm may also use other personnel on your matter at similar hourly rates.</span>
                              {(filteredAttorneyList?.length > 0 || filteredParalegalList?.length > 0 || filteredClientAssistantList?.length > 0) && (
                                <div className="me-5 ms-4">
                                  {filteredAttorneyList?.length > 0 && (
                                    <div className="twoColumn" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <div className="firstColumn mt-3">
                                        <Table bordered>
                                          <thead className="text-start">
                                            <tr>
                                              <th className="fw-bold" style={{ border: '1px solid white', textAlign: 'left', whiteSpace: 'nowrap' }}>Attorney</th>
                                              <th className="fw-bold" style={{ border: '1px solid white', textAlign: 'left', whiteSpace: 'nowrap' }}>Hourly Rate</th>
                                            </tr>
                                          </thead>
                                          <tbody className='formatedValueSorted'>
                                            {filteredAttorneyList.map((attorney, index) => (
                                              <tr key={index} className="text-start">
                                                <td style={{ border: '1px solid white', paddingBottom: '0', whiteSpace: 'nowrap' }}>{formatName(attorney.fullName)}</td>
                                                <td className="text-start" style={{ border: '1px solid white', paddingBottom: '0', whiteSpace: 'nowrap' }}>$ {formatValue(attorney.userPrice)}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </Table>
                                      </div>
                                    </div>
                                  )}
                                  {(filteredClientAssistantList?.length > 0 || filteredParalegalList?.length > 0) && (
                                    <div className="twoColumn" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      {filteredClientAssistantList?.length > 0 && (
                                        <div className="firstColumn mt-3">
                                          <Table bordered>
                                            <thead className="text-start">
                                              <tr>
                                                <th className="fw-bold" style={{ border: '1px solid white', textAlign: 'left', whiteSpace: 'nowrap' }}>Client Assistant</th>
                                                <th className="fw-bold" style={{ border: '1px solid white', textAlign: 'left', whiteSpace: 'nowrap' }}>Hourly Rate</th>
                                              </tr>
                                            </thead>
                                            <tbody className='formatedValueSorted'>
                                              {filteredClientAssistantList.map((assistant, index) => (
                                                <tr key={index} className="text-start">
                                                  <td style={{ border: '1px solid white', paddingBottom: '0', whiteSpace: 'nowrap' }}>{formatName(assistant.fullName)}</td>
                                                  <td className="text-start" style={{ border: '1px solid white', paddingBottom: '0', whiteSpace: 'nowrap' }}>$ {formatValue(assistant.userPrice)}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </Table>
                                        </div>
                                      )}
                                      {filteredParalegalList?.length > 0 && (
                                        <div className="secondColumn mt-3">
                                          <Table bordered>
                                            <thead className="text-start">
                                              <tr>
                                                <th className="fw-bold" style={{ border: '1px solid white', textAlign: 'left', whiteSpace: 'nowrap' }}>Paralegal</th>
                                                <th className="fw-bold" style={{ border: '1px solid white', textAlign: 'left', whiteSpace: 'nowrap' }}>Hourly Rate</th>
                                              </tr>
                                            </thead>
                                            <tbody className='formatedValueSorted'>
                                              {filteredParalegalList.map((paralegal, index) => (
                                                <tr key={index} className="text-start">
                                                  <td style={{ border: '1px solid white', paddingBottom: '0', whiteSpace: 'nowrap' }}>{formatName(paralegal.fullName)}</td>
                                                  <td className="text-start" style={{ border: '1px solid white', paddingBottom: '0', whiteSpace: 'nowrap' }}>$ {formatValue(paralegal.userPrice)}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </Table>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                              </li>
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Costs: <span className='fw-normal text-black noneFontTable'>You will be billed for costs incurred on your behalf, such as filing fees, mailing and delivery charges, in-office and commercial photocopy charges, long-distance telephone charges, facsimile transmission, special research services, service of process, witness fees, travel and related costs, title searches, court or registry filing fees, fees and costs of out-of-state or other law firms necessary in the completion of this matter, and other incidental expenses. While the Firm may prepay such costs to expedite the case, they are the Client’s responsibility, and you agree to reimburse the Firm. We will not make cost disbursements in excess of $500.00 without your prior permission.</span></li>
                            </ol>
                            <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Flat-Fee Basis Services: <span className='fw-normal text-black noneFontTable'>For services provided on a flat-fee basis, now or in future, the Firm commits to their completion for a fixed price, independent of the time incurred to complete these services.</span></li>
                            <ol type='i' start="1">
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Payment Terms: <span className='fw-normal text-black noneFontTable'>If special payment terms are set forth on Exhibit B (“Payment Received Form”) or a “Recurring Payment Authorization Form” authorizing less than full payment upon execution of this Agreement, documents deliverable under this Agreement, including the draft and finalized business documents <em>will not</em> be provided to Client until payment has been received by the Firm sufficient to pay flat-fees earned by the Firm, as defined above, through the date of document delivery.</span></li>
                            </ol>
                          </ol>
                        </div>
                      )}
                    </div>
                    <div>
                      {(showHourlyBody || showFlatFeeBody) && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>When Our Fees and Costs Are Considered Earned: </li>
                          <ol type='A' start="1">
                            <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Hourly Basis Services: <span className='fw-normal text-black noneFontTable'>Fees and costs for services provided on an hourly basis are considered as having been earned by the Firm at the point in time where work is performed and costs are incurred.</span></li>
                            <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Flat-Fee Basis Services: <span className='fw-normal text-black noneFontTable'>Fees for Firm services provided on a flat-fee basis are <b>not</b> placed in the Firm Trust Account and are considered as having been earned by the Firm as a percentage of the total flat-fee amount based on the following criteria:</span></li>
                            <ol type='i' start="1">
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}><span className='fw-normal text-black noneFontTable'><b>20%</b> when the Firm has taken the steps to open a case, established responsibilities for staff to follow, and the attorney has established a preliminary strategy for the casehas been determined on how to proceed with the case, and the work flow has been defined by the attorney responsible to supervise the case.</span></li>
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}><span className='fw-normal text-black noneFontTable'><b>30%</b> when the LifePlan Assessment Letter providing coordinated retirement options for health, housing, financial, legal, and family issues customized for Client has been drafted, <em style={{textDecoration:'underline'}}>which usually is done the day of the first client meeting</em> (100% if Agreement is for LifePlan Assessment Letter only);</span></li>
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}><span className='fw-normal text-black noneFontTable'>An additional <b>30%</b>when the initial drafts of the legal documents are completed (<b>80%</b> if Agreement is for legal documents only);</span></li>
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}><span className='fw-normal text-black noneFontTable'>An additional <b>10%</b> when the first Follow-Up Meeting is held with an attorney to review the <em>LifePlan</em> Assessment Letter, legal documents, and/or development of the <em>LifePlan</em> Roadmap;</span></li>
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}><span className='fw-normal text-black noneFontTable'>The final <b>10%</b> when estate planning documents are finalized and ready to sign; and</span></li>
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}><span className='fw-normal text-black noneFontTable'>In the event our relationship is terminated before the agreed upon Firm services have been fully completed, you may or may not have a right to a pro-rata refund of a portion of the flat-fee amount for services not yet completed. Incomplete services are considered earned on a pro-rata basis based on their percentage of completion, as determined by the Firm.</span></li>
                              <div className={`d-flex ${client?.spouseName ? 'justify-content-around' : 'justify-content-start'}`} style={{ marginLeft: client?.spouseName ? '0' : '60px' }}>
                                <div style={{ position: 'relative' }}>
                                  <input type="text" value={primaryInitials} onClick={handlePrimaryClick} style={{ border: 'none', width: '100%', padding: '5px 0', boxSizing: 'border-box', outline: 'none', textAlign:'center', fontSize: '13pt', fontFamily:'Cambria, sans-serif' }} readOnly/>
                                  <hr style={{ position: 'absolute', top: '10px', left: 0, textAlign:'center', width: '100%', height: 1, backgroundColor: 'black', border: 'none' }} />
                                </div>
                                {client?.spouseName && (
                                <div style={{ position: 'relative' }}>
                                  <input type="text" value={spouseInitials} onClick={handleSpouseClick}style={{ border: 'none', width: '100%', padding: '5px 0', boxSizing: 'border-box', outline: 'none', textAlign:'center', fontSize: '13pt', fontFamily:'Cambria, sans-serif' }} readOnly/>
                                  <hr style={{ position: 'absolute', top: '10px', left: 0, textAlign:'center', width: '100%', height: 1, backgroundColor: 'black', border: 'none' }} />
                                </div>
                                )}
                              </div>
                            </ol>
                          </ol>
                        </div>
                      )}
                    </div>
                    <div>
                      {showHourlyBody && !showFlatFeeBody && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Payment Terms: </li>
                          <ol type='A' start="1">
                            <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Hourly Basis Services: </li>
                            <ol type='i' start="1">
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}><span className='fw-normal text-black noneFontTable'>Client agrees to maintain in the Lawyer’s Trust Account funds sufficient to pay the anticipated hourly fees and costs, as identified by the Firm, for the current month’s and the next month’s invoicing; We will send you monthly bills showing current time and expense charges and the balance of your advance fee deposit remaining in trust on your behalf.</span></li>
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}><span className='fw-normal text-black noneFontTable'>Upon receipt of the monthly bill from Attorney, you agree to pay the bill within ten (10) days of receipt in order to replenish your original advance fee deposit amount. We will have previously paid your bill from funds held in Trust and will use your monthly payment to replenish your advance fee deposit to the amount you originally paid into Trust. You agree to deposit additional funds within twenty-four (24) hours of being notified that your monthly payment has not been made and/or the advance fee deposit is no longer at its original balance. You acknowledge that you will not reasonably expect Attorney to continue to represent you if you fail to timely pay your monthly fees and costs when due. You further acknowledge by signing this Agreement that we have advised you that we will withdraw from representing you, upon proper notice to you, if you fail to pay fees and costs as they become due.</span></li>
                            </ol>
                          </ol>
                        </div>
                      )}
                      {showFlatFeeBody && !showHourlyBody && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Payment Terms: </li>
                          <ol type='A' start="1">
                            <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Flat-Fee Basis Services: </li>
                            <ol type='i' start="1">
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}><span className='fw-normal text-black noneFontTable'>Client payment for flat-fee basis services is due in full upon execution of this Agreement unless otherwise agreed, and becomes the property of the Firm upon receipt. Payment in advance of all or any portion of the flat-fee does not affect your right to terminate the client-lawyer relationship.</span></li>
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}><span className='fw-normal text-black noneFontTable'>If special payment terms are set forth on Exhibit B (“Payment Received Form”) authorizing less than full payment upon execution of this Agreement, documents deliverable under this Agreement, including the <em>LifePlan</em> Roadmap and draft and finalized estate planning documents will not be provided to Client until payment has been received by the Firm sufficient to pay flat-fees earned by the Firm, as defined above, through the date of document delivery.</span></li>
                            </ol>
                          </ol>
                        </div>
                      )}
                      {showFlatFeeBody && showHourlyBody && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Payment Terms: </li>
                          <ol type='A' start="1">
                            <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Overdue Balances: </li>
                            <ol type='i' start="1">
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}><span className='fw-normal text-black noneFontTable'>Unpaid balances will be considered overdue thirty (30) days after the date of the invoice, and a finance charge of one percent (1%) per month may be assessed on that overdue balance. In the event of Client’s failure to pay fees or costs that have been billed, the Firm reserves the right not to perform any services or incur any costs beyond flat-fee payments received or Advance Fee and Cost Deposits Received, to withdraw as your attorneys, and, after six (6) months, to turn over your account to third-parties for collections.</span></li>
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}><span className='fw-normal text-black noneFontTable'>Timely Payment of Outstanding Fees is required. In the event that the advance fee deposit is not replenished promptly as agreed above and/or any bill is not paid within thirty (30) days of becoming due, we reserve the right to cease providing any legal services to you, or on your behalf, until payment is received, or other satisfactory arrangements are made and confirmed in writing.  In the alternative, for non-payment of outstanding fees for more than thirty (30) days, we reserve the right to withdraw as your attorney, and you agree to sign any documents necessary for us to withdraw, upon our request.  You agree that your failure to comply with this Agreement will be grounds for Attorney (and attorney of record) to withdraw, including pursuant to the Rules of Professional Conduct No. 1.16 (b) (4) (permitting an attorney to withdraw from matters if the Client substantially fails to fulfill an obligation to the attorney regarding attorney’s services, and the attorney gives the Client reasonable warning that the withdrawal will occur unless the obligation is fulfilled).</span></li>
                              <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}><span className='fw-normal text-black noneFontTable'>Documents deliverable under this Agreement, including the <em>LifePlan</em> Assessment Letter and draft and finalized estate planning documents will not be provided to Client until Lawyer’s Trust Account funds are sufficient to pay Firm for fees and costs earned through that date.</span></li>
                            </ol>
                            <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Cancellation or No-Show Policy. <span className='fw-normal text-black noneFontTable'>We know your time is valuable, and ours is too. Preparing for an appointment requires time and effort on the part of our staff.  A missed appointment is often unable to be filled, and appointment times are limited.  Out of respect for our staff and our other clients, we ask that you give us at least 72 hours’ notice if you need to cancel an appointment.  Below is the fee schedule for no-shows or cancellations without at least 72 hours’ notice:</span><br /><p style={headingStyle} className='ps-5'>First Cancellation or No-Show: $250</p><p style={headingStyle} className='ps-5'>Second Cancellation or No-Show: $500</p><br /><span className='noneFontTable fw-normal text-black'>If further cancellations or no-shows occur, then you as the client will fall into our “Non-Response” category as described in Section E.</span><br /><span className='noneFontTable fw-normal text-black'>If you feel you have special circumstances that resulted in a cancellation within 72 hours of your appointment, please feel free to let someone within Life Point Law know so we can assess the circumstances and possibly waive these fees. </span></li>
                            <div className={`d-flex ${client?.spouseName ? 'justify-content-around' : 'justify-content-start'}`} style={{ marginLeft: client?.spouseName ? '0' : '60px' }}>
                              <div style={{ position: 'relative' }}>
                                <input type="text" value={primaryInitials} onClick={handlePrimaryClick} style={{ border: 'none', width: '100%', padding: '5px 0', boxSizing: 'border-box', outline: 'none', textAlign:'center', fontSize: '13pt', fontFamily:'Cambria, sans-serif' }} readOnly/>
                                <hr style={{ position: 'absolute', top: '10px', left: 0, textAlign:'center', width: '100%', height: 1, backgroundColor: 'black', border: 'none' }} />
                              </div>
                              {client?.spouseName && (
                              <div style={{ position: 'relative' }}>
                                <input type="text" value={spouseInitials} onClick={handleSpouseClick}style={{ border: 'none', width: '100%', padding: '5px 0', boxSizing: 'border-box', outline: 'none', textAlign:'center', fontSize: '13pt', fontFamily:'Cambria, sans-serif' }} readOnly/>
                                <hr style={{ position: 'absolute', top: '10px', left: 0, textAlign:'center', width: '100%', height: 1, backgroundColor: 'black', border: 'none' }} />
                              </div>
                              )}
                            </div>
                            <li className='desclaimerheading2 ms-4 pb-3 pt-2' style={headingStyle}>“Non-Responsive” Clients. <span className='fw-normal text-black noneFontTable'>Non-Responsive clients will be sent a letter in the mail describing the circumstances around their matter and are expected to contact our firm further if they would like to continue work with us.</span></li>
                          </ol>
                        </div>
                      )}
                    </div>
                    <div>
                    {(showHourlyBody || showFlatFeeBody) && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Services Provided by Third-Parties: <span className='fw-normal text-black noneFontTable'>To help shape its recommendations for your <em>“LifePlan”</em> and legal documents, the Firm believes it is often beneficial to gain input from third-party professionals outside the Firm, and may agree to facilitate the provision of their services to the Client. Such professionals include financial planners, investment advisors, tax professionals, home health agencies, housing specialists, geriatric care managers, and other professionals as specifically needed.</span></li>
                          <ol type='A' start="1">
                            <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Third-Party Provided Services: <span className='fw-normal text-black noneFontTable'>Client payment for third-party provided services facilitated through the Firm is due in full upon execution of this Agreement.</span></li>
                            <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Referral and Disclosure of Information to Other Professionals: <span className='fw-normal text-black noneFontTable'>With some limitations, the information relating to your legal representation by the Firm is confidential under the ethics rules applicable to Washington lawyers and our communications are protected under the lawyer-client privilege. The Firm generally cannot release or disclose information relating to your representation without your informed consent unless compelled to do so by court order. It is desirable that we be able to communicate with other, third-party, professionals you select who can assist in developing your <em>“LifePlan.”</em> For example, consulting your geriatric care management service provider will assist us in advising you regarding housing choices in formulating your <em>“LifePlan.”</em>  Similarly, consulting your financial advisor will permit us to take into account all the relevant economic considerations in formulating your <em>“LifePlan.”</em> While much of this information will be provided to us without having to disclose to non-lawyer professionals confidential information relating to your representation, there are times when we will need to share certain information with these professionals in order to obtain relevant and meaningful information for developing your <em>“LifePlan.”</em> When we feel it is necessary to disclose such information to these professionals, we will take precautions to limit the disclosure to information necessary to carry out our representation and we will avoid disclosing information that would be adverse to your interests. <br /><em style={{ fontWeight: 'bold' }}>By entering into this agreement, you are giving informed consent for the Firm to consult with and disclose confidential information to the third-party service providers identified in Section 1.B. above as well to the named fiduciaries in the planning documents and professional service providers, including but not limited to medical providers, financial services providers, and accountants. </em>There may be times as we proceed in advising you when we ask for your informed consent to disclosure of specific information to these or other professionals in carrying out our representation of you. </span></li>
                            <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Financial Planning Services: <span className='fw-normal text-black noneFontTable'>While the regulations of the Washington State Department of Financial Institutions do not allow the promotion of specific financial planners or investment advisors by the Firm, we believe it is highly beneficial to coordinate with Client’s financial planner and/or investment advisor in developing a <em>“LifePlan”</em>, and would encourage the Client to facilitate that coordination.</span></li>
                          </ol>
                        </div>
                      )}
                    </div>
                    <div>
                    {(showHourlyBody || showFlatFeeBody) && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Disclosure of Rajiv Nagaich’s Ownership and Conflicts. <span className='fw-normal text-black noneFontTable'>Attorney Rajiv Nagaich has a majority ownership interest in the following companies that are affiliated with the Firm and that you may be referred to for related services: AgingOptions and Better Care Management Company. You will never be under any obligation to work with any of these companies. Mr. Nagaich may make a referral to Better Financial Services, which is owned and operated by Mr. Saket Sengar. Mr. Sengar has worked for AgingOptions in the past and has a history with the Firm and AgingOptions, and rents office space from a building owned by Rajiv Nagaich.</span></li>
                        </div>
                      )}
                    </div>
                    <div>
                      {(showHourlyBody || showFlatFeeBody) && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Geriatric Care Management Services / Better Care Management Company: <span className='fw-normal text-black noneFontTable'>The Firm may refer you to Better Care Management Company as a possible geriatric care management service provider to assist in developing your comprehensive <em>“LifePlan”</em>. <em style={{ fontWeight: 'bold' }}>You have no obligation to engage the services of Better Care Management Company.</em> The Firm is very willing to work with any geriatric care management services professional you choose. A complete disclosure regarding Mr. Nagaich’s majority ownership of Better Care Management Company, which requires your acknowledgment, is incorporated as Exhibit A to this Agreement.</span></li>
                        </div>
                      )}
                    </div>
                    <div>
                      {(showHourlyBody || showFlatFeeBody) && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Cooperation: <span className='fw-normal text-black noneFontTable'>Client agrees to cooperate fully with Firm in all matters during the term of this Agreement, including providing us with all relevant information necessary to pursue the work described above. From the date that the Firm provides initial draft documents to the Client, Client agrees to review and work with Firm to finalize documents within eighteen (18) months for a Comprehensive <em>LifePlan</em>, twelve (12) months for a Legal <em>LifePlan</em>, or three (3) months for a Legal only plan. Delay beyond that period may result in the necessity to re-work Client’s documents, at Client’s additional expense, to comply with changes in applicable laws and regulations. In addition, Client agrees to pay all fees and expenses promptly. In the event you do not fully cooperate with Firm or pay fees and expenses when billed, the Firm reserves the right to withdraw from its representation of you and terminate this agreement in accordance with the applicable Rules of the Court and ethics rules governing Washington lawyers. In addition, the Firm reserves the right to charge Client for extra work caused by Client’s failure to cooperate using the Firm’s then-prevailing hourly billing rates in one-tenth (1/10) of an hour increments.</span></li>
                        </div>
                      )}
                    </div>
                    {client.spouseName && (
                      <div>
                        {(showHourlyBody || showFlatFeeBody) && (
                          <div className='pb-3'>
                            <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Joint Representation of Spouses: <span className='fw-normal text-black noneFontTable'>It is a common practice for spouses to employ the same lawyer to assist them in planning their estates. If you are married, you have taken this approach by asking that the Firm represent both of you in your planning. It is important that you understand that, because the Firm will be representing both of you, you are considered the Firm’s client, collectively. Ethical considerations prohibit the Firm from agreeing with either of you to withhold information from the other. Accordingly, in agreeing to this form of representation, each of you is authorizing the Firm to disclose to the other any matters related to the representation that one of you might discuss with the Firm’s lawyers or staff or that they might acquire from any other source. In this representation, the Firm will not give legal advice to either of you or make any changes in any of your estate planning documents without your mutual knowledge and consent. Of course, anything either of you discusses with a Firm lawyer or staff person is privileged from disclosure to third-parties, except (a) with your consent, (b) for communication with other advisors, or (c) as otherwise required or permitted by law or the rules governing professional conduct. <br />If a conflict of interest arises between you during the course of your planning or if the two of you have a difference of opinion concerning the proposed plan for disposition of your property or on any other subject, your Firm attorney can point out the pros and cons of your respective positions or differing opinions. However, ethical considerations prohibit your Firm attorney, as the lawyer for both of you, from advocating one of your positions over the other. Furthermore, the Firm attorney would not be able to advocate one of your positions versus the other if a dispute arose at any time as to your respective property rights or interests or as to other legal issues between you. If actual conflicts of interest do arise between you of such a nature that in your Firm attorney’s judgment it is impossible to perform their ethical obligations to both of you, it would become necessary for the Firm to cease acting as your joint counsel. </span></li>
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      {(showHourlyBody || showFlatFeeBody) && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Outcome: <span className='fw-normal text-black noneFontTable'>Outcomes in the practice of law are not guaranteed. By signing below, the Client understands and acknowledges that the Firm will work diligently on Client’s behalf, but it cannot and does not promise or guarantee any specific result or outcome in this matter.</span></li>
                        </div>
                      )}
                    </div>
                    <div>
                      {(showHourlyBody || showFlatFeeBody) && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Termination of Agreement & Timing Of Refunds: <span className='fw-normal text-black noneFontTable'>This Agreement terminates upon completion of the work set forth on in Section 1, or upon completion of additional work governed by the terms of this Agreement, pursuant to Section 2. The Firm may also terminate this Agreement in accordance with the ethics rules governing Washington lawyers. Client may terminate this Agreement at any time. If either the Client or the Firm terminates the Agreement, Client agrees to immediately pay all accrued fees, costs, and finance charges for fees and costs earned up through the termination date, plus compensation for any time spent on work reasonably necessary to conclude Firm’s involvement in the matter.<br />Upon termination of representation, Firm will surrender papers and property to which Client is entitled, subject to the provisions in paragraph 14 below, and will refund fees that have not been earned and deposits for costs not incurred as soon as possible. The delay in the issuance of a refund is primarily due to the fact that the firm utilizes the revenues not placed in the IOLTA account to meet its budgeted financial obligations, and refunds are a non-budgeted expense. Nonetheless, the Firm will make all attempts to issue a refund as quickly as funds become available.</span></li>
                            <div className={`d-flex ${client?.spouseName ? 'justify-content-around' : 'justify-content-start'}`} style={{ marginLeft: client?.spouseName ? '0' : '60px' }}>
                              <div style={{ position: 'relative' }}>
                                <input type="text" value={primaryInitials} onClick={handlePrimaryClick} style={{ border: 'none', width: '100%', padding: '5px 0', boxSizing: 'border-box', outline: 'none', textAlign:'center', fontSize: '13pt', fontFamily:'Cambria, sans-serif' }} readOnly/>
                                <hr style={{ position: 'absolute', top: '10px', left: 0, textAlign:'center', width: '100%', height: 1, backgroundColor: 'black', border: 'none' }} />
                              </div>
                              {client?.spouseName && (
                              <div style={{ position: 'relative' }}>
                                <input type="text" value={spouseInitials} onClick={handleSpouseClick}style={{ border: 'none', width: '100%', padding: '5px 0', boxSizing: 'border-box', outline: 'none', textAlign:'center', fontSize: '13pt', fontFamily:'Cambria, sans-serif' }} readOnly/>
                                <hr style={{ position: 'absolute', top: '10px', left: 0, textAlign:'center', width: '100%', height: 1, backgroundColor: 'black', border: 'none' }} />
                              </div>
                              )}
                            </div>
                        </div>
                      )}
                    </div>
                    <div>
                      {(showHourlyBody || showFlatFeeBody) && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>File Retention: <span className='fw-normal text-black noneFontTable'>The Firm will send you documents, correspondence, any pleadings, and other information as they are generated throughout the matter, subject to the payment provisions of this Agreement. The information will also be maintained in a paper file in the Firm’s office (the “Firm File”) which will include, for example, firm administrative records, time and expense reports, personnel and staffing materials, credit and account records, and internal lawyers' work product (such as drafts, notes, internal memoranda, legal research, and factual research, including investigative reports prepared by or for the internal use of lawyers). The Firm reserves the right to make, at its expense, copies of all documents generated or received by the Firm in the course of its representation. <br />When all of the work necessary for Client’s matter has been completed, the Firm will close the matter and return to Client all original documents, including wills, trusts, and other testamentary documents. Client is expected to pick up the Estate Planning Binder within two (2) months; a storage fee of $100.00 per year will be charged to Client for an Estate Planning Binder that has not been picked up within twelve (12) months of the date that Client is first notified it is available. The Firm will retain the paper Firm File for approximately ninety (90) days after closing, at which point the Firm File will be digitized and then destroyed, unless Client provides specific written instructions to the Firm as to a longer retention period at the time this Agreement is executed. An electronic copy will be maintained for seven (7) years. <br />Client may request documents from the Firm File at any time, including after Firm’s representation of Client has terminated, and the Firm will arrange for copies to be made at Client’s expense. </span></li>
                        </div>
                      )}
                    </div>
                    <div>
                      {(showHourlyBody || showFlatFeeBody) && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Compliance With This Agreement: <span className='fw-normal text-black noneFontTable'>In the case where a suit or action is instituted to enforce compliance with any of the terms or conditions of the Agreement, or to collect the amounts which may become due under the Agreement, the prevailing party shall be awarded such sum as the court may adjudge reasonable as attorney’s fees to be allowed in such suit or actions, including any appeals. Jurisdiction for such suits shall be: King County, Washington; Pierce County, Washington; or Snohomish County, Washington.</span></li>
                        </div>
                      )}
                    </div>
                    <div>
                      {(showHourlyBody || showFlatFeeBody) && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>E-Mail Communications: <span className='fw-normal text-black noneFontTable'>By entering their email address in the space provided below, Client elects to receive correspondence from the Firm via e-mail. Client assumes any and all responsibility associated with this method of communication, including the risk that the e-mail transmission will be intercepted by a third-party.<br />The e-mail address Client has provided Firm is:</span></li>
                          <div style={{ textAlign: 'left', marginLeft: '60px', display:'flex', flexDirection:'column' }}>
                            <div style={{ position: 'relative', width:'600px' }}>
                                <input id="matterNumber " type="text" style={{ border: 'none', width: '100%', padding: '5px 0', boxSizing: 'border-box', outline: 'none', fontSize: '13pt',cursor:'no-drop',fontFamily:'Cambria, sans-serif'  }}   value={`${ primaryEmailAddress} - ${ client.memberName }`}readOnly />
                                <hr style={{ position: 'absolute', top: '10px', left: 0, textAlign:'center', width: '100%', height: 1, backgroundColor: 'black', border: 'none' }} />
                              </div>
                              {client.spouseName && (
                              <div style={{ position: 'relative', width:'600px' }}>
                                <input id="matterNumber " type="text" style={{ border: 'none', width: '100%', padding: '5px 0', boxSizing: 'border-box', outline: 'none', fontSize: '13pt',cursor:'no-drop',fontFamily:'Cambria, sans-serif'  }}   value={`${ primaryEmailAddress} - ${ client.spouseName }`} readOnly />
                                <hr style={{ position: 'absolute', top: '10px', left: 0, textAlign:'center', width: '100%', height: 1, backgroundColor: 'black', border: 'none' }} />
                              </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={headingStyleNew}>
                      {(showHourlyBody || showFlatFeeBody) && (
                        <div className='pb-3'>
                          <li className='desclaimerheading2 ms-4 pb-3' style={headingStyle}>Full Agreement: <span className='fw-normal text-black noneFontTable'>This document, including Exhibit A (“Disclosure Regarding Better Care Management Company”) and Exhibit B (“Payments, Special Terms, and Credit Card Pre-Authorization”) constitutes the entire agreement between you and the Firm. Any changes or modifications must be in writing and be signed by both you and an attorney in the Firm. The Client and the Firm each acknowledge that they have read and understood the terms of this Agreement and agree to abide by its terms. The Client understands that he and/or she has the right to consult with another lawyer in connection with any of the terms of this Agreement prior to signing. </span></li>
                          <div style={{marginLeft:'70px'}}>
                            <br />
                            <p className='ms-3'>
                              <label className='fs-6 desclaimerheading2' >DATE: {selectedDate} <input className='border-0' style={{ width: '13%', fontSize:'20px', cursor:'pointer'  }} /></label>
                            </p>
                            <br />
                            <div id='mainSignatureContainer' className='ms-5'>
                                <Row className='ms-5 align-items-center' id='attorneyContainer'>
                                    <Col>
                                        <SignatureInputWithDispath
                                            dispatchloader={dispatchloader}
                                            attorneyName={selectattornetvalue?.label || selectAttornetvalue?.label}
                                            attorneyUserId={selectattornetvalue}
                                            fontSizeLabel={fontSizeLabel}
                                            setSignature={setSignatureAttorney}
                                            setPrevState={setPrevStateAttorney}
                                            prevState={prevStateAttorney}
                                            fromFeeAgreement={fromFeeAgreement}
                                            loggedInUserId={loggedInUserId}
                                            position="top"
                                        />
                                    </Col>
                                </Row>
                                <br />
                                <Row className='ms-5 align-items-center' id='signatureContainers'>
                                    <Col className='primaryContainer'>
                                        <SignatureInputWithDispath
                                            dispatchloader={dispatchloader}
                                            primaryName={client?.memberName}
                                            fontSizeLabel={fontSizeLabel}
                                            setSignature={setSignaturePrimary}
                                            setPrevState={setPrevStatePrimary}
                                            prevState={prevStatePrimary}
                                            fromFeeAgreement={fromFeeAgreement}
                                            initials={primaryInitials}
                                            setInitials={setPrimaryInitials}
                                            position="top"
                                        />
                                    </Col>
                                    {client?.spouseName && (
                                    <Col className='spouseContainer'>
                                        <SignatureInputWithDispath
                                            dispatchloader={dispatchloader}
                                            spouseName={client?.spouseName}
                                            fontSizeLabel={fontSizeLabel}
                                            setSignature={setSignatureSpouse}
                                            setPrevState={setPrevStateSpouse}
                                            prevState={prevStateSpouse}
                                            fromFeeAgreement={fromFeeAgreement}
                                            initials={spouseInitials}
                                            setInitials={setSpouseInitials}
                                            position="top"
                                        />
                                    </Col>
                                    )}
                                </Row>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </ol>
            </Modal.Body>
            <Modal.Footer><div class="html2pdf__page-break"></div></Modal.Footer>
            <Modal.Body>
              <div className='px-5'>
                {(showHourlyBody || showFlatFeeBody) && (
                  <div className='pb-3'>
                    <h2 className='desclaimerheading2 text-center' style={headingStyleMain}>Exhibit A</h2>
                    <h3 className='desclaimerheading2 fs-5 text-center pb-3' style={headingStyleMainAnother}>Disclosure Regarding Better Care Management Company</h3>
                    <p className='fw-normal' style={headingStyleJust}>Among other third-party providers, the Firm may refer you to Better Care Management Company (“Better Care Management”), formerly known as Aging Options, as a possible geriatric care management service provider to assist in developing the comprehensive “<em>LifePlan.</em>” You have <b>no obligation</b> to engage the services of Better Care Management. The Firm is willing to work with any geriatric care management services professional you choose.<p style={headingStyleJust}>This is to disclose to you that Rajiv Nagaich, a shareholder in the Firm, holds a majority interest in Better Care Management. Although Better Care Management is a separate legal entity from the Firm, Mr. Nagaich, as an owner of Better Care Management, will receive a financial benefit from your retaining Better Care Management and its professionals for geriatric care management services. </p><p style={headingStyleJust}>Because of Mr. Nagaich’s interest in Better Care Management, the ethics rules governing Washington lawyers require your written, informed consent to the essential terms of your transaction with Better Care Management and Mr. Nagaich’s role in the transaction.  If you engage Better Care Management, the essential terms of the transaction will be set forth in a separate agreement you will execute with Better Care Management which includes payment for services assisting Firm in developing a “<em>LifePlan</em>”, plus hourly fees for any additional services. Mr. Nagaich, or a lawyer in the Firm in which he is a shareholder, will be providing legal services to you relating to developing the “<em>LifePlan</em>,” but notwithstanding his ownership of Better Care Management, Better Care Management operates independently of the Firm, and Mr. Nagaich does not provide any geriatric care management services at Better Care Management or otherwise advise or consult clients in connection with the geriatric care management services provided by Better Care Management. </p><p style={headingStyleJust}>You should understand that Better Care Management is not a law firm and will <b>not</b> be providing you legal services. As such, your relationship with Better Care Management <b>will not be a client-lawyer relationship</b> and the ethical and legal protections applicable in a client-lawyer relationship will not apply. One of the protections of the client-lawyer relationship that does not necessarily apply to Better Care Management, or any non-lawyer service provider for that matter, is confidentiality.  For example, unlike lawyers, social workers, which would include geriatric care managers of Better Care Management or any other health care service provider, have a statutory duty under Washington law to report abandonment, abuse, financial exploitation, or neglect of vulnerable adults to state authorities under penalty of criminal sanctions.  While we will take reasonable precautions to protect the confidentiality of matters relating to our representation of you as required by the ethics rules governing Washington lawyers, you should understand that there is a risk that information we provide to social workers or other health care professionals you hire will be used by them in making mandatory reports to authorities. The information the Firm may provide to Better Care Management to facilitate its role in the <em>LifePlanning</em> process includes copies of your Health Care Power(s) of Attorney, Living Will(s), Disposition(s) of Remains, and other pertinent information as needed. </p><p style={headingStyleJust}>In deciding whether or not to use the services of Better Care Management and whether or not to give your informed consent to the transaction involving Better Care Management, you have the right to consult with an independent lawyer regarding the transaction. The Firm is not acting as your counsel in this regard. Because this is a conflict of interest under Washington ethics rules, it is desirable that you consult independent counsel. To avoid any issue as to whether the lawyer you select is independent, the Firm cannot recommend a lawyer to advise you about this referral to Better Care Management. You can use the services of any lawyer you wish.  If you do not know any lawyers to advise you, the King County Bar Association Lawyer Referral Service provides recommendations of lawyers who will consult with you at a discounted rate.  The lawyer referral service can be contacted by calling the King County Bar Association. </p><p style={headingStyleJust}>In order to provide you with a reasonable opportunity to consult independent counsel in retaining Better Care Management for geriatric care management services, the Firm will deposit your payment of fees for geriatric care services in a lawyer’s trust account as a third-party expense for five (5) business days.  If you inform Better Care Management prior to the expiration of that five (5) business day period that you would prefer not to utilize its geriatric care management services, this payment will be returned to you in full, with the understanding that you will not use any work performed by Better Care Management thereafter.  Upon expiration of the five-day period, Client authorizes Firm to pay the funds placed in the Firm’s client trust account to Better Care Management. </p><p style={headingStyleJust}>By entering into this agreement and initialing below, you are giving your informed consent to the essential terms of the transaction with Better Care Management Company and of Mr. Nagaich’s involvement in the transaction as described above, and acknowledge that you have been informed of the desirability of obtaining independent counsel to advise you regarding the transaction and have been afforded a reasonable opportunity to do so. </p></p>
                      <div className={`d-flex ${client?.spouseName ? 'justify-content-around' : 'justify-content-start'}`} style={{ marginLeft: client?.spouseName ? '0' : '60px' }}>
                        <div style={{ position: 'relative' }}>
                          <input type="text" value={primaryInitials} onClick={handlePrimaryClick} style={{ border: 'none', width: '100%', padding: '5px 0', boxSizing: 'border-box', outline: 'none', textAlign:'center', fontSize: '13pt', fontFamily:'Cambria, sans-serif' }} readOnly/>
                          <hr style={{ position: 'absolute', top: '10px', left: 0, textAlign:'center', width: '100%', height: 1, backgroundColor: 'black', border: 'none' }} />
                        </div>
                        {client?.spouseName && (
                        <div style={{ position: 'relative' }}>
                          <input type="text" value={spouseInitials} onClick={handleSpouseClick}style={{ border: 'none', width: '100%', padding: '5px 0', boxSizing: 'border-box', outline: 'none', textAlign:'center', fontSize: '13pt', fontFamily:'Cambria, sans-serif' }} readOnly/>
                          <hr style={{ position: 'absolute', top: '10px', left: 0, textAlign:'center', width: '100%', height: 1, backgroundColor: 'black', border: 'none' }} />
                        </div>
                        )}
                      </div>
                  </div>
                )}
              </div>
            </Modal.Body>
          </div>
          <Modal.Footer className='justify-content-around' id='annualAgreementButtons'>
            {/* <Button className="theme-btn" onClick={() => setShowFeeAgreement(false)}>
                Close
            </Button> */}
            {!fromFeeAgreement && (
              <>
                <Button className="theme-btn" onClick={() => {
                  function isValidSignature(signature) {
                    return signature !== null && signature !== undefined && signature !== '';
                  }
                  if (
                    (client?.spouseName && (
                      !isValidSignature(signatureAttorney) ||
                      !isValidSignature(signaturePrimary) ||
                      !isValidSignature(signatureSpouse)
                    )) ||
                    (!client?.spouseName && (
                      !isValidSignature(signatureAttorney) ||
                      !isValidSignature(signaturePrimary)
                    ))
                  ) {
                    // staticAlertTimer("Since the signature is incomplete, the Non-Crisis is pending.");
                  } else {
                    staticAlertTimer("Non-Crisis is pending since the payment was not done.");
                  }
                  setActiveModal("first")
                }}>
                  Close
                </Button>
                {/* <Button className="theme-btn me-2" onClick={handleDownloadPDF}>
                  Download PDF
                </Button> */}
                <Button className="theme-btn me-2" disabled={isProcessing} onClick={() => handlePayment('sendLink')}>
                  Send Link
                </Button>
              </>
            )}
          <Button className="theme-btn me-2" disabled={isProcessing} onClick={()=>handlePayment('makeApayment')}>
            Make a Payment
          </Button>
          </Modal.Footer>
        </div>
      )}
    </Modal>
    </>
  )
}

function createjsonforcheckboxradio (index, items)  {
  return {
      index: index,
      value: false,
      subsPlanId: items,
      selectedPlanIdd: null,
      checkedputplanid: null,
      subPlanGetId: null,
      subtenantRateCardId: null,
  }
}

// const mapStateToProps = (state, ownProps) => ({
//   ...state,
//   client: ownProps.client
// });

// const mapDispatchToProps = (dispatch) => ({
//   dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader })
// });

// export default withFileCabinetParalegalPermissions(
//   connect(mapStateToProps, mapDispatchToProps)(NonCrisisFeeAgreement), 
//   'NonCrisisFeeAgreement'
// );

export default withFileCabinetParalegalPermissions(NonCrisisFeeAgreement, "NonCrisisFeeAgreement");

// Define SignatureInput component
const SignatureInput = ({
  fontSizeLabel,
  attorneyName,
  primaryName, 
  fromFeeAgreement,
  loggedInUserId,
  spouseName,
  setSignature,
  prevState,
  setPrevState,
  position,
  dispatchloader,
  attorneyUserId,
  initials,
  setInitials,
}) => {

  const [selectedOption, setSelectedOption] = useState('');
  const [inputName, setInputName] = useState('');
  const [signatureImage, setSignatureImage] = useState(null);
  const [signatureImageAttorneyAPI, setSignatureImageAttorneyAPI] = useState(null);
  const [filename, setFilename] = useState('');
  const [selectedFont, setSelectedFont] = useState(null);
  const [isUploadSignature, setIsUploadSignature] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [alertState, setalertState] = useState(true);
  const [isDigitalSignature, setIsDigitalSignature] = useState(false);
  const [isKeyboardSignature, setIsKeyboardSignature] = useState(false);
  const [selectedColorType, setSelectedColorType] = useState('#1A54C2');
  const [selectedColorDraw, setSelectedColorDraw] = useState('#1A54C2');
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [base64SignatureImage, setBase64SignatureImage] = useState(null);
  const [base64SigCanvasData, setBase64SigCanvasData] = useState(null);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const sigCanvasRef = useRef(null);
  const reStoreState = () => {

      konsole.log("vwsdyugwagf", prevState)
      if (prevState?.signatureImage) setSignatureImage(prevState?.signatureImage);
      if (typeof prevState?.isUploadSignature == "boolean") setIsUploadSignature(prevState?.isUploadSignature);
      if (prevState?.previewImage) setPreviewImage(prevState?.previewImage);
      if (prevState?.selectedFont) setSelectedFont(prevState?.selectedFont);
      if (prevState?.selectedColorType) setSelectedColorType(prevState?.selectedColorType);
      if (prevState?.initials) setInitials(prevState.initials);
      if (prevState?.inputName) setInputName(prevState?.inputName);
      if (
        prevState?.selectedFont &&
        prevState?.selectedColorType &&
        prevState?.inputName &&
        typeof prevState?.isKeyboardSignature === "boolean"
      ) {
        setIsKeyboardSignature(prevState?.isKeyboardSignature);
      }
      if (typeof prevState?.isDigitalSignature == "boolean") setIsDigitalSignature(prevState?.isDigitalSignature);
      if (typeof prevState?.isKeyboardSignature == "boolean") setIsKeyboardSignature(prevState?.isKeyboardSignature);
  }

  useEffect(() => {
    getAttorneyUser(attorneyUserId);
  }, [attorneyUserId]);
  
  const getAttorneyUser = (attorneyUserId) => {
    konsole.log(attorneyUserId,"wdajndajnsn")
    if (!attorneyUserId || typeof attorneyUserId !== 'object' || !attorneyUserId.value) return;

    // Construct the URL using string interpolation
    const apiUrl = `${$Service_Url.getUserbyId}${attorneyUserId.value}`;
    // Fetch attorney user data
    dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", apiUrl, "", (res, error) => {
        dispatchloader(false);
        if (res) {
            konsole.log("getAttorneyUserRes", res);

            const loginUserId = sessionStorage.getItem("loggedUserId") || loggedInUserId;

            let responseData = res?.data?.data;
            konsole.log("sdasdgetAttorneyUserRes", responseData);

            const signatureId = responseData.signatureId;
            const userId = responseData.memberUserId;
            const requestedBy = loginUserId;
            konsole.log("signatureIdUserId", signatureId, userId, requestedBy);
            if (signatureId) {
                // Call downloadSignatureImage to fetch and display the signature image
                showSignatureImage(userId, signatureId, requestedBy);
            }
        } else {
            konsole.log("Error fetching attorney user data:", error);
            // Handle error, show message to user, etc.
        }
    });
  };
  
  // Function to show the signature image
  const showSignatureImage = (userId, fileId, requestedBy) => {
      const fileTypeId = 63;
      const fileCategoryId = 1;
      dispatchloader(true)
      if (!userId || !fileId || !requestedBy) {
        return;
      }
      const url = `${$Service_Url.postDownloadUserDocument}/${userId}/${fileId}/${fileTypeId}/${fileCategoryId}/${requestedBy}`;
          
      $CommonServiceFn.InvokeCommonApi("GET", url, "", (res, error) => {
          dispatchloader(false);
          if (res) {
              konsole.log(res, "responseOfSignatureImage");
              const responseData = res?.data?.data;
              const fileUrlPath = responseData.fileUrlPath;
  
              if (fileUrlPath) {
                  konsole.log("DownloadedImageURL", fileUrlPath);
  
                  // Open modal to display signature image and options
                  setSignatureImageAttorneyAPI(fileUrlPath);
                  setSignatureImage(fileUrlPath);
                  setSignature(fileUrlPath);

              } else {
                  konsole.error("Error: fileUrlPath is missing.");
              }
          } else {
              konsole.error("Error downloading image:", error);
              // Handle error, show message to user, etc.
          }
      });
  };   
           
  // Function to change and upload the signature
  const changeSignature = (signatureData, previewImage, inputName, selectedFont, selectedColorType) => {
    if (!attorneyUserId || typeof attorneyUserId !== 'object' || !attorneyUserId.value || fromFeeAgreement) return;
    // Construct the URL using string interpolation
    const apiChangeUrl = `${$Service_Url.getFamilyMemberbyID}${attorneyUserId.value}`;
    dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", apiChangeUrl, "", async (res, error) => {
      dispatchloader(false);
      if (res) {
        konsole.log(res, "jaisriram");
 
        const userData = res?.data?.data?.member;
        const loginUserId = sessionStorage.getItem("loggedUserId");
        const convertedSignature = signatureData || previewImage || convertTextToImageType(inputName, selectedFont, selectedColorType);
        konsole.log(convertedSignature, "convertedSignature");
 
        // Convert the image data to a Blob object
        const signatureBlob = await getBlobFromBase64(convertedSignature);
 
        const UserId = userData.userId || "";
        const uploadedBy = loginUserId || "";
        const fileStatusId = 2;
        const fileCategoryId = 1;
        const fileTypeId = 63;
 
        $postServiceFn.postFileUpload(signatureBlob, UserId, uploadedBy, fileTypeId, fileCategoryId, fileStatusId, (res, error) => {
          dispatchloader(false);
          if (res) {
            konsole.log("Uploaded:", res);
            updateMemberDetails(userData, res?.data?.data?.fileId);
          } else {
            konsole.error("Error:", error);
            // Handle error, show message to user, etc.
          }
        }, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      } else {
        konsole.error("Error: Response object or its properties are null or undefined.");
        // Handle the error as needed
      }
    });
  };

  // Function to convert base64 to Blob
  const getBlobFromBase64 = async (base64Data) => {
    return fetch(base64Data)
        .then((res) => res.blob())
        .catch((error) => {
            konsole.error("Error converting base64 to Blob:", error);
            return null;
        });
  };

  // Function to update member details with the new signatureId and fileId
  const updateMemberDetails = (userData, fileId) => {
      dispatchloader(true);

      const loginUserId = sessionStorage.getItem("loggedUserId");

      const requestBody = {
          subtenantId: userData.subtenantId || "",
          fName: userData.fName || "",
          mName: userData.mName || "",
          lName: userData.lName || "",
          dob: userData.dob || "",
          citizenshipId: userData.citizenshipId || "",
          genderId: userData.genderId || "",
          fileId: fileId || "",
          signatureId: fileId || "",
          userId: userData.userId,
          updatedBy: loginUserId,
      };

      $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUpdateMember, requestBody, (res, error) => {
          dispatchloader(false);
          if (res) {
              konsole.log("Updateuh", res);

              // Perform any additional actions if needed
              showSignatureImage(requestBody.userId, requestBody.fileId, requestBody.updatedBy);
              // alert("Update successful.");
          } else {
              konsole.error("Error in PUT request:", error);
              alert("Error updating member details. Please try again.");
              // Handle error, show message to user, etc.
          }
      });
  };

  useEffect(() => {
      if((position == "bottom") && (prevState?.signatureImage != signatureImage)) {
          setSignatureImage(null); 
          setSignature(null);      
      }
  }, [prevState])

  const fonts = [
      "Aguafina Script",
      "Arizonia",
      "Parisienne",
  ];

  const fontPromises = fonts.map(font => document.fonts.load(`1em ${font}`));
  Promise.all(fontPromises).then(() => {
  });

  const sampleFonts = fonts.slice(fonts.start, fonts.end);

  const handleColorSelectType = (color) => {
      // if (!disableColorSelector) {
          setSelectedColorType(color);
      // }
  };
  
  const handleColorSelectDraw = (color) => {
      // if (!disableColorSelector) {
          setSelectedColorDraw(color);
      // }
      
      const canvas = sigCanvasRef?.current?.getCanvas();
      const ctx = canvas?.getContext('2d');
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData?.data;
  
      // Iterate over each pixel and modify its color
      for (let i = 0; i < data?.length; i += 4) {
          // Change color only if the pixel is not transparent
          if (data[i + 3] !== 0) {
              data[i] = parseInt(color.substring(1, 3), 16);
              data[i + 1] = parseInt(color.substring(3, 5), 16);
              data[i + 2] = parseInt(color.substring(5, 7), 16);
          }
      }
  
      // Put the modified image data back to the canvas
      ctx?.putImageData(imageData, 0, 0);
      
      // Change the pen color
      if (sigCanvasRef.current) {
          sigCanvasRef.current.penColor = color;
      }
  };
  
  const handleInputChange = (e) => {
    const value = e?.target?.value;
    if (value.startsWith(" ")) {return;}
    if (!/^[A-Za-z ]*$/.test(value)) {return;}
    value = value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
        .join(' ');
        if (value?.length > 25) {
            staticAlertTimerSignature("The signature field allows a maximum of 25 characters. Please shorten your signature input.");
            return;
        }
      setInputName(value);
      setIsInputEmpty(value?.length === 0);
  };

  const handleOptionClick = (option) => {

      if (signatureImageAttorneyAPI && attorneyName) {
          setSignature(signatureImageAttorneyAPI);
          setSignatureImage(signatureImageAttorneyAPI);
          setSelectedOption('');

      } else {
          setSelectedOption(option);
          setIsKeyboardSignature(false);
          setIsDigitalSignature(true);
          setIsUploadSignature(false);
          
          if (prevState && (prevState.isDigitalSignature || prevState.isKeyboardSignature || prevState.isUploadSignature)) {
              reStoreState();
          }
      }
  };    
  
  const handleToggleKeyboardSignature = () => {
      setIsDigitalSignature(false);
      setIsKeyboardSignature(true);
      setIsUploadSignature(false);
      setSignatureImage(null);
      setSignature(null);
      setIsCanvasEmpty(true)
      setPreviewImage(null);
      setFilename('');
      setInputName('');
      setInitials('')
      setPrevState({...prevState, sigCanvasData: undefined})
  };

  const handleToggleDigitalSignature = () => {
      setSignatureImage(null);
      setSignature(null);
      setSelectedFont(false);
      setIsDigitalSignature(true);
      setIsKeyboardSignature(false);
      setIsUploadSignature(false);
      setPreviewImage(null);
      setFilename('');
      setInitials('')
  };
  
  const handleToggleImageSignature = () => {
      setIsDigitalSignature(false);
      setIsKeyboardSignature(false);
      setIsUploadSignature(true);
      setSelectedFont(false);
      setIsCanvasEmpty(true);
      setInitials('')
      setPrevState({...prevState, sigCanvasData: undefined})
  };
  
  const handleFileChange = (event) => {
      const file = event.target.files[0];
      
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setPreviewImage(reader.result);
              setIsDigitalSignature(false);
          };
          reader.readAsDataURL(file);
          setFilename(file.name);
      }
  };
  
  const handleDragOver = (e) => {
      e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
        setFilename(file.name);
    }
  };
  
  const setPrevStateToParent = ( finalImage ) => {
      const newPrevState = {
        selectedOption: selectedOption,
        inputName: inputName,
        signatureImage: finalImage,
        filename: filename,
        selectedFont: selectedFont,
        isUploadSignature: isUploadSignature,
        initials: initials,
        previewImage: previewImage,
        isDigitalSignature: isDigitalSignature,
        isKeyboardSignature: isKeyboardSignature,
        selectedColorType: selectedColorType,
        selectedColorDraw: selectedColorDraw,
        isInputEmpty: isInputEmpty,
        isCanvasEmpty: isCanvasEmpty,
        sigCanvasData: sigCanvasRef.current?.toDataURL(),
        position: position,
    };
    setPrevState(newPrevState);
    setInitials('');
  }
  
  const handleToggleChangeSignature = (option) => {
    setSelectedOption(option);
    setIsKeyboardSignature(false);
    setIsDigitalSignature(true);
    setIsUploadSignature(false);
  };  

  const handleClearUploadSignature = () => {
    if (previewImage) {
        setPreviewImage(null);
        setFilename('');
    } else {
        handleResetSignatureModal();
    }
  };
  
  const handleClearDigitalSignature = () => {
    setSelectedColorDraw('#1A54C2');
    if (isCanvasEmpty && !prevState?.sigCanvasData) {
        handleResetSignatureModal();
    } else {
        if (!isCanvasEmpty) {
            sigCanvasRef.current.clear();
        }
        setSignatureImage(null);
        setSignature(null);
        setIsCanvasEmpty(true);
        setPrevState({ ...prevState, sigCanvasData: undefined });
    }
  };         

  const handleClearKeyboardSignature = () => {
      setInputName('');
      setSelectedFont(''); 
      setSelectedColorType('#1A54C2');
          if ( isInputEmpty || !inputName ) {
              handleResetSignatureModal();
          } else {
              const inputElement = document.getElementById('signatureInput');
              if (inputElement) {
                  inputElement.value = '';
              }
          }
  };
  
  const handleResetSignatureModal = () => {
      if(attorneyName) {
          setSelectedOption('')
      } else {
          setIsInputEmpty(true); 
          setSelectedOption('')
          setInputName('');
          setInitials('')
      }
      if (prevState && (prevState.isDigitalSignature || prevState.isKeyboardSignature || prevState.isUploadSignature)) {
        reStoreState();
      }
  };

  const handleUploadSignatureClick = async () => {
    if (previewImage) {
        setPrevStateToParent(previewImage);
        setIsUploadSignature(true);
        setIsDigitalSignature(false);
        setIsKeyboardSignature(false);
        setSignatureImage(previewImage);
        setSignature(previewImage);
        setPreviewImage(null);
        setSelectedOption('');
        changeSignature(previewImage);
        setInitials(initials);
    } else {
        setPrevStateToParent();
    }
};

const staticAlertTimerSignature = ( text ) => {
    if(alertState == true) {
      AlertToaster.error(text);
      setalertState(false);
      setTimeout(() => setalertState(true), [5000]);
    }
  } 

const handleDigitalSignatureClick = async () => {
    const signatureData = (sigCanvasRef.current && sigCanvasRef.current.toDataURL()) || prevState?.sigCanvasData;
    konsole.log(signatureData, "Signature Data");

    if (signatureData) {
        // Convert the signature data to an image for dimension calculation
        const img = new Image();
        img.src = signatureData;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const signatureBoundingBox = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const { data } = signatureBoundingBox;

            let nonEmptyPixels = 0;

            // Count non-empty pixels (i.e., area covered by signature)
            for (let i = 0; i < data?.length; i += 4) {
                const alpha = data[i + 3];
                if (alpha > 0) {
                    nonEmptyPixels++;
                }
            }

            // Calculate the area percentage covered by the signature
            const canvasArea = canvas.width * canvas.height;
            const signatureAreaPercentage = (nonEmptyPixels / canvasArea) * 100;

            // Set minimum area percentage threshold
            const minAreaPercentageThreshold = 1;

            if (signatureAreaPercentage < minAreaPercentageThreshold) {
                staticAlertTimerSignature("Please provide a valid signature.");
            } else {
                setPrevStateToParent(signatureData);
                setIsDigitalSignature(true);
                setIsUploadSignature(false);
                setIsKeyboardSignature(false);
                setSignatureImage(signatureData);
                setSignature(signatureData);
                setIsCanvasEmpty(true);
                setSelectedOption('');
                changeSignature(signatureData);
                setInitials(initials);
            }
        };
    } else {
        setPrevStateToParent();
    }
  };
  
  const handleKeyboardSignatureClick = async () => {
    const textSignature = convertTextToImageType(inputName, selectedFont, selectedColorType)
    if(textSignature){
        setPrevStateToParent(textSignature);
        setIsKeyboardSignature(false);
        setIsDigitalSignature(true);
        setIsUploadSignature(false);
        setSignatureImage(null);
        setSignature(null);
        setSelectedOption('')        
        changeSignature(textSignature);
        setInitials(initials);
    } else {
        setPrevStateToParent();
    }
  };
  
  // Convert Signature text to image
  const convertTextToImage = (text, selectedFont, selectedColorType, renderText = true, height = 55, x = 10, y = 35, background = '#fff') => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio || 1;

    // Ensure selectedFont is one of the fonts from your array
    selectedFont = fonts.includes(selectedFont) ? selectedFont : fonts[0];

    tempCtx.font = `23px ${selectedFont}`;
    const textWidth = tempCtx.measureText(text).width / pixelRatio;

    const maxWidth = 800;
    const canvasWidth = Math.min(textWidth + 20 * x, maxWidth);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = canvasWidth;
    canvas.height = height;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    const renderTextFunc = (font, color) => {
        ctx.font = `30px ${font}`;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    };

    // Check if selectedColorType is defined
    if (selectedColorType && renderText) {
        renderTextFunc(selectedFont, selectedColorType);
    } else if (renderText) {
        // Default to black color if selectedColorType is not defined
        renderTextFunc(selectedFont, '#1A54C2');
    }

    if (text && renderText) {
        setSignature(canvas.toDataURL('image/png', 1.0)); // for setting parent sign image
    }

    return canvas.toDataURL('image/png', 1.0);
  };

  const convertTextToImageType = (text, selectedFont, selectedColorType, renderText = true, height = 45, x = 10, y = 28, background = 'rgba(0, 0, 0, 0)') => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      const pixelRatio = window.devicePixelRatio || 1;

      // Ensure selectedFont is one of the fonts from your array
      selectedFont = fonts.includes(selectedFont) ? selectedFont : fonts[0];

      tempCtx.font = `23px ${selectedFont}`;
      const textWidth = tempCtx.measureText(text).width / pixelRatio;

      const maxWidth = 800;
      const canvasWidth = Math.min(textWidth + 20 * x, maxWidth);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = canvasWidth;
      canvas.height = height;

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const renderTextFunc = (font, color) => {
          ctx.font = `32px ${font}`;
          ctx.fillStyle = color;
          ctx.fillText(text, x, y);
      };

      if (renderText && selectedFont && selectedColorType) {
          renderTextFunc(selectedFont, selectedColorType);
      }
      if (text && renderText) {
          // No need to set the signature state here, it's already being set when calling this function
      }

      return canvas.toDataURL('image/png', 1.0);
  };

  const renderLabel = () => {
      if (primaryName) {
          return `${primaryName}, Client`;
      } else if (attorneyName) {
          return <div dangerouslySetInnerHTML={{ __html: `${attorneyName}, <br />Attorney & Counselor-at-Law LIFE POINT LAW` }} />;
      } else {
          return `${spouseName}, Client`;
      }
  };

  const convertImageToBase64 = async (url) => {
    if (!url || typeof url !== 'string') throw new Error("Invalid URL");
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    handleImageConversions();
  }, [signatureImage, prevState?.sigCanvasData]);
  
  const handleImageConversions = async () => {
    try {
      if (signatureImage && !signatureImage.startsWith('data:image')) {
        const base64 = await convertImageToBase64(signatureImage);
        setBase64SignatureImage(base64);
      } else if (signatureImage) {
        setBase64SignatureImage(signatureImage);
      }
  
      if (prevState?.sigCanvasData && !prevState.sigCanvasData.startsWith('data:image')) {
        const base64 = await convertImageToBase64(prevState.sigCanvasData);
        setBase64SigCanvasData(base64);
      } else if (prevState?.sigCanvasData) {
        setBase64SigCanvasData(prevState.sigCanvasData);
      }
    } catch (error) {
      console.error("Image conversion failed", error);
    }
  };

  const handleInitialsChange = (e) => {
    let value = e.target.value;
    if (/[^a-zA-Z\s]/.test(value)) {
      staticAlertTimerSignature('Only alphabetic characters are allowed.');
      return;
    }
    value = value.replace(/^[\s]+/, '');
    value = value.replace(/[^a-zA-Z\s]/g, '');
    if (value.length > 15) {
      staticAlertTimerSignature('Maximum 15 characters are allowed.');
      return;
    }
    setInitials(value);
  };
  
  return (
      <div>
          <div className='hideInPrint hideInSendDoc' id='AnnualMaintenancehideInPrint'>
              {selectedOption && (
              <>
                  <div style={{height:'100vh', width:'100vw', position:'fixed', top:'0', left:'0', backgroundColor:'#000', opacity:'0.5'}}></div>
                  <div style={{height: '780px', width: '650px', position: 'fixed', background: '#fff',top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding:'30px', zIndex: 3, borderRadius: '5px'}}>
                      <Row> 
                          <Col className='d-flex justify-content-between align-items-center text-black'>
                              <h3 className='fw-bold'>Create Signature and Initials</h3>
                              <img className='cursor-pointer fw-bolder' title='Cancel' onClick={handleResetSignatureModal} src='/icons/closeIcon.svg'></img>
                          </Col>
                      </Row>
                          <Row className='py-4 navbarAnnualMaintenance'>
                              <Col className='col-5 text-black'>
                                  <ul className="d-flex flex-row justify-content-between align-items-center navbar-nav">
                                      <li className={`nav-item ${isDigitalSignature ? 'selected' : ''}`} onClick={handleToggleDigitalSignature}>Draw</li>
                                      <li className={`nav-item ${isKeyboardSignature ? 'selected' : ''}`} onClick={handleToggleKeyboardSignature}>Type</li>
                                      <li className={`nav-item ${isUploadSignature ? 'selected' : ''}`} onClick={handleToggleImageSignature}>Upload</li>
                                  </ul>
                              </Col>
                              <hr className={isDigitalSignature ? 'selected-draw' : isKeyboardSignature ? 'selected-type' : isUploadSignature ? 'selected-upload' : ''} />
                          </Row>
                      {isKeyboardSignature && (
                      <div>
                          <div>
                          <Col className='my-2 justify-content-center align-items-center' style={{ width: '585px', height: '315px', borderRadius: '5px', backgroundColor:'#F6F6F6' }}>
                              <Col className='d-flex justify-content-between align-items-center mx-4' style={{ height:'90px' }}>
                                  <select 
                                      style={{ width:'fit-content', cursor:'pointer', borderBottom: '1px solid #E6E6E6', borderTop:'0', borderLeft:'0', borderRight:'0', background:'none' }} 
                                      onChange={(e) => setSelectedFont(e?.target?.value)}
                                      value={selectedFont || ''}
                                  >
                                      <option value="" hidden>Select Font</option>
                                      {sampleFonts.map((font, index) => (
                                          <option key={index} value={font}>{font}</option>
                                      ))}
                                  </select>
                                  <input
                                      id="signatureInput"
                                      className='mx-2'
                                      placeholder={"Enter your name"}
                                      value={inputName}
                                      onChange={handleInputChange}
                                      style={{ border: '1px solid #E6E6E6', background: 'none', outline: 'none' }}
                                  />

                                  <p className='d-flex'>
                                      {['#1A54C2', '#000', '#C12B2B'].map((color, index) => (
                                          <span key={index} style={{ cursor:'pointer', display: 'inline-block', width: '21px', height: '21px', borderRadius: '50%', backgroundColor: color, marginRight: '10px', position: 'relative' }} onClick={() => handleColorSelectType(color)}>
                                              {selectedColorType === color && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '15px', color: 'white' }}>✔</span>}
                                          </span>
                                      ))}
                                  </p>
                              </Col>
                                  <Row id="fontSamples" className='d-flex justify-content-center align-items-center' style={{ margin: 'auto', borderBottom: '1px solid #E6E6E6', width: '485px', height: '175px', mixBlendMode: 'multiply' }}>
                                      {(!selectedFont || !inputName) && (
                                          <div className='d-flex justify-content-center align-items-center'>
                                          {(!selectedFont) ? (
                                            <p className='text-center' style={{ color: '#B3B3B3' }}>
                                              Please select a font of your choice for the signature.
                                            </p>
                                          ) : (
                                            <p className='text-center' style={{ color: '#B3B3B3' }}>
                                              Please enter your name for the signature.
                                            </p>
                                          )}
                                        </div>                                          
                                      )}
                                      {inputName && selectedFont && selectedColorType && (
                                          <div className='keyboardSignatureSample' style={{ overflow: 'hidden', marginTop: '124px', justifyContent: 'right', display: 'flex', alignItems: 'center', width:'fit-content' }}>
                                          <img
                                              src={convertTextToImageType(inputName, selectedFont, selectedColorType)}
                                              alt="Signature Sample"
                                              style={{ cursor: 'pointer', width:'100%' }}
                                          />
                                          </div>
                                      )}
                                  </Row>
                              </Col>
                          </div>
                          <div>
                            <Col className='my-2 d-flex justify-content-center align-items-center' style={{ position: 'relative', width: '585px', height: '150px', borderRadius: '5px', backgroundColor: '#F6F6F6' }}>
                              <Row className='d-flex justify-content-center align-items-center' style={{ marginTop: '20px', width: '585px', height: '50px' }} >
                                <Row style={{ cursor: 'pointer' }}>
                                  <p className='d-flex justify-content-end' style={{ position: 'absolute', top: '25px', right: '460px', fontSize: '12pt', fontWeight: '500' }}>Your Initials &#x2a;</p>
                                </Row>
                                <Row>
                                  <input
                                    type="text"
                                    placeholder="Enter initials"
                                    value={initials}
                                    onChange={handleInitialsChange}
                                    style={{ width: '150px', height: '50px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none' }}
                                  />
                                  {initials && <span onClick={() => setInitials('')} style={{ position: 'absolute', left: '154px', top: '41%', transform: 'translateY(-50%)', cursor: 'pointer', fontWeight: 'bold', color: '#999', fontSize: '16px', width:'auto', padding: '0px' }}>&times;</span>}
                                </Row>
                              </Row>
                              <p className="py-3" style={{ color: '#B3B3B3', position: 'absolute', top: '105px', left: '0px', paddingLeft: '20px' }}>Your initials will be used to mark all pages of the document.</p>
                            </Col>
                          </div>
                          <Row>
                          <p className="py-3" style={{color:'#B3B3B3'}}>By signing this document with an electronic signature, I agree that such signature will be as valid as handwritten signatures to the extent allowed by local law</p>
                              <Col className='mt-2 d-flex flex-row justify-content-between align-items-center btnAnnualMaintenance'>
                                  <Row className='btnHoverEffect'>
                                      <button className='theme-btn' onClick={handleClearKeyboardSignature}>
                                          {/* {!inputName || isInputEmpty || (disableClear) ? 'Cancel' : 'Clear'} */}
                                          {!inputName || isInputEmpty ? 'Cancel' : 'Clear'}
                                      </button>
                                  </Row>
                                  <Row className={`btnAnnualMaintenance ${selectedFont && inputName && initials ? 'btnHoverEffect' : ''}`}>
                                      <button className='theme-btn' onClick={handleKeyboardSignatureClick} disabled={!inputName || !selectedFont || !initials}>Accept and sign</button>
                                  </Row>
                              </Col>
                          </Row>
                      </div>
                      )}
                      {isDigitalSignature && (
                          <Col>
                              <div>
                                  <Col className='my-2 d-flex justify-content-center align-items-center' style={{ position:'relative', width: '585px', height: '315px', borderRadius: '5px', backgroundColor:'#F6F6F6' }}>
                                      <Row className='d-flex justify-content-center align-items-center' style={{ borderBottom: '1px solid #E6E6E6', borderTop: '1px solid #E6E6E6', marginTop:'20px', width: '585px', height: '215px' }} >
                                          <p className='d-flex justify-content-end' style={{position:'absolute', top:'35px', right:'11px'}}>
                                              {['#1A54C2', '#000', '#C12B2B'].map((color, index) => (
                                                  <span key={index} style={{ cursor:'pointer', display: 'inline-block', width: '21px', height: '21px', borderRadius: '50%', backgroundColor: color, marginRight: '10px', position: 'relative' }} onClick={() => handleColorSelectDraw(color)}>
                                                      {selectedColorDraw === color && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '15px', color: 'white' }}>✔</span>}
                                                  </span>
                                              ))}
                                          </p>
                                          <Row style={{ cursor:'pointer'}}>
                                              { (prevState?.sigCanvasData) ? (
                                                  <div style={{ position: 'relative', width:'585px', maxHeight:'215px' }}>
                                                      <img
                                                          className='my-1'
                                                          src={base64SigCanvasData || prevState?.sigCanvasData}
                                                          alt="Signature"
                                                          style={{ width: '100%', height: '100%', objectFit:'fill' }}
                                                      />
                                                  </div>
                                              ) : (
                                                  <div className='d-flex justify-content-center' style={{ position:'relative' }} >
                                                      {isCanvasEmpty && (
                                                          <p style={{ position: 'absolute', top: '50%', left: '50%', userSelect: 'none', transform: 'translate(-50%, -50%)', color:'#B3B3B3' }} className='py-3 text-center'>Please fill your signature here.</p>
                                                      )}
                                                      <SignatureCanvas id="SignatureCanvas" ref={sigCanvasRef} onEnd={() => setIsCanvasEmpty(sigCanvasRef.current.isEmpty())} canvasProps={{ width: 585, height: 215 }} velocityFilterWeight={0.9} minWidth={0.3} maxWidth={4} penColor={selectedColorDraw}/>
                                                      {sigCanvasRef.current && konsole.log(sigCanvasRef.current.isEmpty(), "Canvas is empty?")}
                                                  </div>
                                              )}
                                          </Row>
                                      </Row>
                                  </Col>
                                <div>
                                  <Col className='my-2 d-flex justify-content-center align-items-center' style={{ position: 'relative', width: '585px', height: '150px', borderRadius: '5px', backgroundColor: '#F6F6F6' }}>
                                    <Row className='d-flex justify-content-center align-items-center' style={{ marginTop: '20px', width: '585px', height: '50px' }} >
                                      <Row style={{ cursor: 'pointer' }}>
                                        <p className='d-flex justify-content-end' style={{position:'absolute', top:'25px', right:'460px', fontSize:'12pt', fontWeight:'500'}}>Your Initials &#x2a;</p>
                                      </Row>
                                      <Row>
                                        <input
                                          type="text"
                                          placeholder="Enter initials"
                                          value={initials}
                                          onChange={handleInitialsChange}
                                          style={{ width: '150px', height: '50px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none' }}
                                        />
                                        {initials && <span onClick={() => setInitials('')} style={{ position: 'absolute', left: '154px', top: '41%', transform: 'translateY(-50%)', cursor: 'pointer', fontWeight: 'bold', color: '#999', fontSize: '16px', width:'auto', padding: '0px' }}>&times;</span>}
                                      </Row>
                                    </Row>
                                    <p className="py-3" style={{color:'#B3B3B3', position:'absolute', top: '105px', left: '0px',  paddingLeft:'20px'}}>Your initials will be used to mark all pages of the document.</p>
                                  </Col>
                                </div>
                              </div>
                              <Row>
                                  <p className="py-3" style={{color:'#B3B3B3'}}>By signing this document with an electronic signature, I agree that such signature will be as valid as handwritten signatures to the extent allowed by local law</p>
                                  <Col className='mt-2 d-flex flex-row justify-content-between align-items-center btnAnnualMaintenance'>
                                      <Row className='btnHoverEffect'>
                                      <button className='theme-btn' onClick={handleClearDigitalSignature}>
                                          {(!prevState?.sigCanvasData && isCanvasEmpty) ? 'Cancel' : 'Clear'}
                                      </button>
                                      </Row>
                                      <Row className={`btnAnnualMaintenance ${ (!isCanvasEmpty || prevState?.sigCanvasData) && initials ? 'btnHoverEffect' : ''}`}>
                                          <button className='theme-btn' onClick={handleDigitalSignatureClick} disabled={(!prevState?.sigCanvasData && isCanvasEmpty) || !initials}>Accept and sign</button>
                                      </Row>
                                  </Col>
                              </Row>
                          </Col>
                      )}
                      {isUploadSignature && (
                      <div>
                          <Col className='my-2 d-flex flex-column align-items-center' style={{ width: '585px', height: '315px', borderRadius: '5px', border:'2px dashed #E1E1E2' }} onDragOver={handleDragOver} onDrop={handleDrop}>
                              <div className='d-flex flex-column align-items-center justify-content-center' style={{ width: '100%', height: '100%' }}>
                                  {previewImage && (
                                      <>
                                      <img src={previewImage} alt="Uploaded Signature" style={{ maxWidth: '190px', maxHeight: '60px', marginBottom: '10px' }} />
                                      <div className="d-flex align-items-center">
                                          <p>{filename}</p>
                                          <p className='mx-1' style={{color:'#000'}}>or</p>
                                              <label htmlFor="signatureFileInput" style={{color:'#0D6EFD', cursor:'pointer'}} className='fw-bold'>{previewImage ? 'Browse again' : 'Select image'}</label>
                                              <input type="file" id="signatureFileInput" accept="image/*" onChange={(e) => handleFileChange(e)} style={{ display: 'none' }} key={isDigitalSignature ? 'digital' : 'file'}/>
                                      </div>
                                      </>
                                  )}
                                  {!previewImage && (
                                      <div className='text-center'>
                                          <h3 className='fw-bold'>Drag & drop or select an image signature to upload</h3>
                                      </div>
                                  )}
                                  {!previewImage && (
                                      <div className='my-2 d-flex justify-content-center align-items-center btnHoverEffect'>
                                          <label htmlFor="signatureFileInput" style={{color:'white', cursor:'pointer'}} className='theme-btn'>Select image</label>
                                          <input type="file" id="signatureFileInput" accept="image/*" onChange={(e) => handleFileChange(e)} style={{ display: 'none' }} key={isDigitalSignature ? 'digital' : 'file'}/>
                                      </div>
                                  )}
                              </div>
                          </Col>
                          <div>
                            <Col className='my-2 d-flex justify-content-center align-items-center' style={{ position: 'relative', width: '585px', height: '150px', borderRadius: '5px', backgroundColor: '#F6F6F6' }}>
                              <Row className='d-flex justify-content-center align-items-center' style={{ marginTop: '20px', width: '585px', height: '50px' }} >
                                <Row style={{ cursor: 'pointer' }}>
                                  <p className='d-flex justify-content-end' style={{ position: 'absolute', top: '25px', right: '460px', fontSize: '12pt', fontWeight: '500' }}>Your Initials &#x2a;</p>
                                </Row>
                                <Row>
                                  <input
                                    type="text"
                                    placeholder="Enter initials"
                                    value={initials}
                                    onChange={handleInitialsChange}
                                    style={{ width: '150px', height: '50px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none' }}
                                  />
                                  {initials && <span onClick={() => setInitials('')} style={{ position: 'absolute', left: '154px', top: '41%', transform: 'translateY(-50%)', cursor: 'pointer', fontWeight: 'bold', color: '#999', fontSize: '16px', width:'auto', padding: '0px' }}>&times;</span>}
                                </Row>
                              </Row>
                              <p className="py-3" style={{ color: '#B3B3B3', position: 'absolute', top: '105px', left: '0px', paddingLeft: '20px' }}>Your initials will be used to mark all pages of the document.</p>
                            </Col>
                          </div>
                          <Row>
                              <p className="py-3" style={{color:'#B3B3B3'}}>By signing this document with an electronic signature, I agree that such signature will be as valid as handwritten signatures to the extent allowed by local law</p>
                              <Col className='mt-2 d-flex flex-row justify-content-between align-items-center btnAnnualMaintenance'>
                                  <Row className='btnHoverEffect'>
                                      <button className='theme-btn' onClick={handleClearUploadSignature}>
                                          {(!previewImage) ? 'Cancel' : 'Clear'}
                                      </button>
                                  </Row>
                                  <Row className={`btnAnnualMaintenance ${previewImage && initials ? 'btnHoverEffect' : ''}`}>
                                      <button className='theme-btn' onClick={handleUploadSignatureClick} disabled={!previewImage || !initials}>Accept and sign</button>
                                  </Row>
                              </Col>
                          </Row>
                      </div>
                      )}
                  </div>
              </>
              )}
              {position === 'bottom' ? (
                  <Row>
                      <div id='primaryContainer' className='hideInPrint hideInSendDoc ps-3 d-flex'>
                          <button
                              className='theme-btn h-auto w-auto cursor-pointer text-white d-flex justify-content-center align-items-center signatureButton'
                              onClick={handleOptionClick}
                          >
                              Click here to Sign
                          </button>
                      </div>
                  </Row>
              ) : (
                  <Row>
                  {(attorneyName && signatureImageAttorneyAPI) ? (
                      <Col id='primaryContainer' className='hideInPrint hideInSendDoc ps-3 d-flex'>
                      <button
                          className='theme-btn h-auto w-auto cursor-pointer text-white d-flex justify-content-center align-items-center signatureButton'
                          onClick={handleToggleChangeSignature}
                      >
                          Change Signature
                      </button>
                      </Col>
                  ) : (
                      (attorneyName && signatureImageAttorneyAPI) ? null : (
                      <Col id='primaryContainer' className='hideInPrint hideInSendDoc ps-3 d-flex'>
                          <button
                          className='theme-btn h-auto w-auto cursor-pointer text-white d-flex justify-content-center align-items-center signatureButton'
                          onClick={handleOptionClick}
                          >
                          Click here to Sign
                          </button>
                          {attorneyName && signatureImageAttorneyAPI && signatureImage && (
                          <button
                              className='border-0 bg-transparent h-auto w-auto cursor-pointer text-white d-flex justify-content-center align-items-center text-decoration-underline changeButton'
                              onClick={handleToggleChangeSignature}
                          >
                              Change Signature
                          </button>
                          )}
                      </Col>
                      )
                  )}
                  </Row>
              )}
          </div>
          <div>
          <Row>
              {!selectedFont && !signatureImage && (
                  <div className='d-inline-flex my-1' style={{ width: 'fit-content'}}>
                      <div className='p-4'></div>
                  </div>
              )}
              {selectedFont && !signatureImage && !signatureImageAttorneyAPI && (
                  <div className='d-inline-flex my-1' style={{ width: 'fit-content'}}>
                      <img style={{ width: '100%', objectFit: 'fill' }} src={convertTextToImage((inputName), selectedFont, selectedColorType)} alt="Keyboard" />
                  </div>
              )}
              {(signatureImage) && (
                  <div className='m-2' style={{ position: 'relative', width: isUploadSignature || isDigitalSignature || signatureImageAttorneyAPI ? '270px' : 'fit-content', maxHeight: '45px', backgroundColor: 'transparent', background:'transparent' }}>
                      <img
                          className='my-1'
                          src={base64SignatureImage || (signatureImage)}
                          alt="Signature"
                          style={{
                              width: '100%',
                              height: '100%',
                              objectFit: isUploadSignature || isDigitalSignature || signatureImageAttorneyAPI ? 'fill' : 'contain',
                              backgroundColor: 'transparent',
                              background:'transparent',
                          }}
                      />
                  </div>
              )}
          </Row>
          <label style={fontSizeLabel}>
              {renderLabel()}
          </label>
          </div>
      </div>
  );
  };

  // const SignatureInputWithDispath = connect(mapStateToProps, mapDispatchToProps)(SignatureInput);
  const SignatureInputWithDispath =SignatureInput;