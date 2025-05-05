import React, { useState, useRef, useEffect, useContext } from 'react'
// import Form from 'react-bootstrap/Form';
import { Button, Modal, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import konsole from '../../control/Konsole';
import { $CommonServiceFn, $postServiceFn } from "../../../components/network/Service";
import { $Service_Url } from "../../../components/network/UrlPath";
// import Select from 'react-select';
// import { SET_LOADER } from "../../../components/Store/Actions/action";
// import { connect } from "react-redux";
import AnnualAgreementModalFile from './AnnualAgreementModalFile';
import PdfViewDocument from './PdfViewDocument';
// import OccuranceCom from './OccuranceCom'
import { globalContext } from '../../../pages/_app';
import { $AHelper } from '../../control/AHelper';
import { $AHelper as $newHelper } from '../../../component/Helper/$AHelper';
// import SignatureCanvas from 'react-signature-canvas';
// import SignatureAnnualMaintanance from './SignatureAnnualMaintanance';
import AnnualMaintanceAgreement from "./AnnualMaintanceAgreement";
import AlertToaster from '../../control/AlertToaster';
import useUserIdHook from '../../Reusable/useUserIdHook';
import { getApiCall, isNotValidNullUndefile, isNullUndefine, postApiCall, postUploadUserDocumant, recurringErrorHandled } from '../../Reusable/ReusableCom';
// import AmaPayment from './AmaPayment';
import withFileCabinetParalegalPermissions from '../../HOC/withFileCabinetParalegalPermissions';
import { createJsonUploadFileV2, createFileCabinetFileAdd, cabinetFileCabinetId, specificFolderName, cretaeJsonForFilePermission, demo, rajivAttorneyUserId } from '../../control/Constant';
import { Services } from '../../../components/network/Service';
import AmaOccurrence from './AmaOccurrence';
import AmaOrderSummary from './AMA/AmaOrderSummary';
import { createSentEmailJsonForOccurrene, createSentTextJsonForOccurrene, logoutUrl } from '../../control/Constant';
import { getSMSNotificationPermissions } from '../../Reusable/ReusableCom';
import { CustomCheckBox, CustomRadio, CustomSearchSelect } from '../../../component/Custom/CustomComponent';
import CustomCalendar from '../../../component/Custom/CustomCalendar';
import FileViewer from '../../newFileCabinet2/FileViewer';
// import AmaFuturePayment from './AmaFuturePayment';
import moment from 'moment';

const formatDate = (date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
        const monthNames = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];
        const month = monthNames[date.getMonth()];
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    }
    return '';
};

const today = new Date();
const formattedToday = formatDate(today);

const AnnualAgreemetModal = (props) => {
    konsole.log("propsprops", props)
    const subtenantId = props?.clientData?.subtenantId;
    const subscriptionId = props?.subscriptionId;
    const memberIdClientId = props?.clientData?.memberId;
    let clientData = props.clientData;
    const legalCategoryLifePlanFolderId = props?.legalCategoryLifePlanFolderId;
    const allFolderList = props?.allFolderList;
    const callerReference = props?.callerReference;
    konsole.log("allFolderListallFolderList", legalCategoryLifePlanFolderId, allFolderList)
    const { _loggedInUserId, _subtenantId, _userLoggedInDetail, _subtenantName, _loggenInIdInt } = useUserIdHook()
    const stateObj = $AHelper.getObjFromStorage("stateObj");
    const { setdata } = useContext(globalContext)
    const [selectedDate, setSelectedDate] = useState($AHelper.parseDateSafely(Date()));
    const [formattedValidityFrom, setFormattedValidityFrom] = useState(''); 
    const [paymentDate, setPaymentDate] = useState(callerReference == "AccountSetting" ? $AHelper.getFormattedDate(today) : "");
    const { setWarning } = useContext(globalContext)

    //--------------------------------------------------------------------
    const [isClientPermissions, setIsClientPermissions] = useState(false);
    const [addupdate, setAddUpdate] = useState(false)
    // const [signatureAMAModalOpen, setSignatureAMAModalOpen] = useState(false);
    const [viewAMAModalOpen, setViewAMAModalOpen] = useState(false);
    const [subscriptiondetails, setSubscriptionDetails] = useState([])
    const [subscriptionSubPlans, setSubscriptionSubPlans] = useState([])
    const [subsPlanIdstate, setSubplanIdstate] = useState('')
    const [subsPlanSKUMapIdstate, setsubsPlanSKUMapIdstate] = useState('')
    const [attorneyUserList, setattorneyUserList] = useState([])
    const [attorneyUserListvaluelabel, setattorneyUserListvaluelabel] = useState([])
    const [selectattorneyid, setSelectAttorneId] = useState('')
    const [selectAttorneName, setSelectAttorneName] = useState('')
    const [checkedValueOfPlan, setCheckedValueOfPlan] = useState({0: "", 1: ""})
    const [loggeduserId, setloggeduserId] = useState('')
    const [jsonforradiocheeckbox, setjsonforradiocheeckbox] = useState([])
    const [renderpage, setrenderpage] = useState(true)
    const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
    const [fileInfo, setFileInfo] = useState({ primaryUserId: memberIdClientId, fileId: 0, fileTypeId: 64, fileCategoryId: 6, requestedBy: loggeduserId, userFileName: `${props?.clientData?.memberName} - Annual Maintenance Agreement`,})
    const [subscriptionPlansDetails, setSubscriptionPlansDetails] = useState([])
    const [selectattornetvalue, setselectattornetvalue] = useState([])
    const [selectedOptionAttorney, setSelectedOptionAttorney] = useState(false);
    const [isDigitalSignatureAttorney, setIsDigitalSignatureAttorney] = useState(false);
    const [signatureImageAttorney, setSignatureImageAttorney] = useState(null);
    const [paymentOrderId, setPaymentOrderId] = useState(null);
    const [authorizeSubscriptionId, setauthorizeSubscriptionId] = useState(null);
    const [futureAuthorizeSubscriptionId, setfutureAuthorizeSubscriptionId] = useState(null);
    const [futurePaymentdate, setfuturePaymentdate] = useState('');
    const [orderIdUpdatedOn, setOrderIdUpdatedOn] = useState(null)
    const [orderIdStartOn, setOrderIdStartOn] = useState(null)
    const [alertState, setalertState] = useState(true);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);
    const isAmaPlanActive = isNotValidNullUndefile(paymentOrderId) || isNotValidNullUndefile(futureAuthorizeSubscriptionId);
    konsole.log("orderDetails", orderDetails)

    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const sigCanvasRefAttorney = useRef({});

    konsole.log("subscriptionPlansDetailspaymentDate", subscriptionPlansDetails, paymentDate, today.toLocaleDateString('en-CA'))

    //---------------------------------------------------------------
    const [openAnnualModalFile, setOpenAnnualModalFile] = useState(false)
    const [subsFileId, setSubsFileId] = useState('');
    const [legalTeamList, setLegalTeamList] = useState([])
    const [manageCreate, setManageCreate] = useState({ createdBy: stateObj?.userId, createdOn: new Date().toISOString() })
    const [showAmaOccurrencePreview, setShowAMAOccurrencePreview] = useState(false)

    konsole.log("jsonforradiocheeckbox", jsonforradiocheeckbox)

    konsole.log("legalTeamListlegalTeamList", legalTeamList)
    // ------------------------

    useEffect(() => { // This useEffect is for account setting AMA flow
        konsole.log("asdssdf-accountSettingAttorney", attorneyUserListvaluelabel, attorneyUserList)

        if(callerReference == "AccountSetting") {
            let finalSelectedAttorney = {};

            if(demo == false && subtenantId == "742") finalSelectedAttorney = attorneyUserListvaluelabel?.find(ele => ele?.value == rajivAttorneyUserId);
            else finalSelectedAttorney = attorneyUserListvaluelabel?.[0];

            if(isNotValidNullUndefile(finalSelectedAttorney?.value)) {
                setSelectAttorneId(finalSelectedAttorney?.value);
                setIsConfirmed(true);
            }
        }
    }, [attorneyUserListvaluelabel, attorneyUserList, callerReference]);

    const [SubAndPlansGetData, setSubAndPlansGetData] = useState([])
    konsole.log("SubAndPlansGetDataSubAndPlansGetData", SubAndPlansGetData)
    //---------------------------
    useEffect(() => {

        let loggedUserId = sessionStorage.getItem('loggedUserId')
        setloggeduserId(loggedUserId)
        konsole.log("loggedUserId", loggedUserId)
        getAttorneyUserList()
        // getUserSubscription()
        apiParalegalCallGetUserListByUserId()

    }, [])

    // useEffect(() => {
    //     if (orderIdStartOn) {
    //         const initialDate = new Date(orderIdStartOn);
    //         if (!isNaN(initialDate.getTime())) {
    //             setSelectedDate(formatDate(initialDate));
    //         }
    //     }
    // }, [orderIdStartOn]);

    useEffect(() => {
        fetchDataa(clientData?.memberId)
    }, [clientData?.memberId])

    const fetchDataa = async (primaryuserId) => {
        konsole.log("primaryuserIdwithOccurrenceAPI", primaryuserId);
        if (!isNotValidNullUndefile(primaryuserId)) return;
        await getSMSNotificationPermissions(primaryuserId, setIsClientPermissions);
    }

    useEffect(() => {
        let filterdata = attorneyUserListvaluelabel.filter((items) => items.value == selectattorneyid)
        setselectattornetvalue(filterdata)
    }, [selectattorneyid])

    const [subsApicall,setSubsApicall]=useState(true)
    useEffect(() => {
        // const queryParams = new URLSearchParams(window.location.search);
        // const trxnStatus = queryParams.get('TrxnStatus');
        // const orderId = queryParams.get('OrderId')
        const trxnStatus = props.isPaymentStatus
        const orderId = props.isPaymentOrderId
        konsole.log("OrderIdqueryParams", trxnStatus, orderId);
        if (isNotValidNullUndefile(orderId) && trxnStatus == 'SUCCESS' && props?.allFolderList?.length > 0) {
            funForOrderIdUpdate(orderId)
        } else {
            console.log("subsApicall",subsApicall);
            if(subsApicall){
                getsubscriptionDetailsfun()
            }
            if (trxnStatus == 'INVALID' || trxnStatus == 'CANCELLED') {
                handleClearSearch();
            }
        }
    }, [props?.subscriptionId, props?.clientData?.memberId, props.isPaymentOrderId, props.isPaymentStatus, props?.allFolderList])

    const handleDateChange = (value, key) => {
        if(isNotValidNullUndefile(value)) setPaymentDate(moment(value).format("MM-DD-YYYY"));
        else setPaymentDate("");
    };

    konsole.log("dsafhjf", paymentDate);

    const handleAttorneySelect = (e) => {
        setSelectAttorneId(e.value);
    };  

    const apiParalegalCallGetUserListByUserId = async () => {
        const result = await apiCallGetUserListByRoleId();
        setLegalTeamList(result)
    }
    const apiCallGetUserListByRoleId = () => {
        if (legalTeamList && legalTeamList.length > 0) return legalTeamList;
        const subtenantId = sessionStorage.getItem("SubtenantId");
        const stateObj = $AHelper.getObjFromStorage("stateObj");
        let josnObj = {
            "subtenantId": subtenantId,
             "isActive": true,
            //  "roleId": stateObj.roleId
            "userType": "LEGAL"
        }
        props.dispatchloader(true)

        return new Promise((resolve, reject) => {
            Services.getUserListByRoleId(josnObj).then((res) => {
                props.dispatchloader(false)
                konsole.log('res of getting paralegal list', res)
                let responseData = res?.data?.data;
                resolve(responseData)
            }).catch((err) => {
                props.dispatchloader(false)
                konsole.log('err in getting palarelgal', err)
                resolve('err')
            })
        })
    }
    konsole.log("subscriptionIdsubscriptionId", subscriptionId)

    const funForOrderIdUpdate = async (orderId, isCallFromFuturePayment, externalvalues ) => {
        konsole.log("_resultUserSubscriptionzz", orderId, props?.subscriptionId)
        if (!isNotValidNullUndefile(props?.subscriptionId)) return;
        // props.dispatchloader(true);
        const Api_Url = $Service_Url.getUserSubscription + `${_subtenantId}/${true}?SubscriptionId=${props?.subscriptionId}&UserId=${props?.clientData?.memberId}`
        konsole.log("Api_Url", Api_Url)
        const _resultUserSubscription = await getApiCall('GET', Api_Url);
        props.dispatchloader(false);
        konsole.log("_resultUserSubscription", _resultUserSubscription);
        if (_resultUserSubscription == 'err' || _resultUserSubscription?.length < 0) return;
        const { userId, attorneyId, isActive, subsStatusId, subscriptionId, subtenantId, skuListId, userSubscriptionId, subsFileId, userLinkId, validityFrom } = _resultUserSubscription[0]

        const amaDocFileId = sessionStorage.getItem('amaDocFileId')

        const validityFromDate = new Date(validityFrom);
        const validityToDate = new Date(validityFromDate);
        validityToDate.setFullYear(validityToDate.getFullYear() + 1);
        const validityTo = $AHelper.getFormattedDate(validityToDate);
        
        const jsonObj = {
            "userId": userId, "attorneyId": attorneyId, "isActive": isActive,
            "subsStatusId": subsStatusId, "skuListId": isNotValidNullUndefile(skuListId) ? skuListId : 0,
            "subscriptionId": subscriptionId, "subtenantId": subtenantId,
            "userSubscriptionId": userSubscriptionId, "subsFileId": isNotValidNullUndefile(amaDocFileId) ? amaDocFileId : subsFileId,
            "userLinkId": isNotValidNullUndefile(userLinkId) ? userLinkId : 0,
            "orderId": Number(orderId),
            "updatedBy": _loggedInUserId,
            "validityFrom": validityFrom,
            validityTo,
            futurePayDate: isCallFromFuturePayment ? externalvalues?.futurePayDate : "",
        }

        konsole.log("jsonObjForUpsert", jsonObj)

        props.dispatchloader(true);
        const _resultUpsertUserSubscription = await postApiCall('PUT', $Service_Url.putUserSubUpdate, jsonObj);
        konsole.log("_resultUpsertUserSubscription", _resultUpsertUserSubscription);
        const _resultAddUserFileCabinetAdd = await apiCallUserFileCabinetAdd(jsonObj.subsFileId, userId);

        //props.dispatchloader(false);
                //props.dispatchloader(true);
                // Blok of Create Subscription for auto detection-------------
                const _resultOfSubsModel = await getApiCall('GET', $Service_Url.get_subsModelForPaymentTime);  //for GET subsModal details 
                const _resultOfRateCard = await getApiCall('GET', $Service_Url.get_RateCard + `?IsActive=${true}&$subtenantId=${_subtenantId}`); //for GET rate card details 
                const _resultOfUserProfile = await getApiCall('GET', $Service_Url.get_UserProfileDetailsByUserId + props?.clientData?.memberId); // for get userProfile  Details
                konsole.log("_resultOfUserProfile", _resultOfUserProfile, _resultOfRateCard, _resultUserSubscription, _resultOfSubsModel);
                props.dispatchloader(false);
                if (_resultUserSubscription != 'err') {
                    const { userSubscriptionId, userId } = _resultUserSubscription[0]
                    const _resultOfOrderinfo = isNotValidNullUndefile(orderId) ? await getApiCall('GET', $Service_Url.get_Order_Info + '/' + userId + '/' + orderId, '') : "err"; // for GEt details of order info
                    konsole.log("_resultOfOrderinfo", _resultOfOrderinfo)
                    const _filterValue = getSubtenantRateCardDetails(_resultOfRateCard, isCallFromFuturePayment ? externalvalues?.subscriptionPlans : _resultOfOrderinfo?.order?.productList)?.filter((item) => item.subsModalId != 4 && item?.subsModalId != 5);
                    konsole.log("_filterValue", _filterValue);

                    if ((_filterValue?.length > 0 && _resultOfUserProfile?.length > 0) || isCallFromFuturePayment) {
                        const { customerProfileId, cards } = _resultOfUserProfile[0];
                        const lastlyUsedCard = cards?.filter(ele => isCallFromFuturePayment ? ele?.paymentProfileId == externalvalues?.paymentProfileId : ele?.isDefault == true);
                        const _amount = _filterValue?.reduce((acc, current) => acc + current?.endSubscriptionAmt, 0)
                        const _discount = _filterValue?.reduce((acc, current) => acc + (current?.endSubscriptionDisc || 0), 0);
                        const finalOrderId = _resultOfOrderinfo?.order?.orderId || orderId;
                        const payScheduleVal = (_resultOfSubsModel || [])?.filter(item => item?.value == (_filterValue[0]?.subsModalId))?.map(item => item?.label?.split(" "))?.map(([length, unit]) => ({ length: length || 0, unit: unit || 'days' })).shift();

                        konsole.log("payScheduleVal", payScheduleVal)
                        const cardDetails = lastlyUsedCard.length > 0 ? lastlyUsedCard[0] : ''
                        const jsonObjOfCreateSubs = {
                            "userLoginId": _resultOfOrderinfo?.userLoginId ?? 0,
                            "userId": userId,
                            "subscriptionName": "Annual Maintenance Agreement",
                            //"paySchedule": { "length": 7, "unit": 'days' },
                            "paySchedule": payScheduleVal,
                            "totalOccurrences": 9999,
                            // "trialOccurrences": 0,
                            "amount": _amount ?? 0,
                            // "trialAmount": 0,
                            "customerProfileId": customerProfileId,
                            "paymentProfileId": cardDetails?.paymentProfileId,
                            // "customerAddressId": "string",
                            "cardNumber": cardDetails?.cardNumber,
                            "expirationDate": cardDetails?.expireDate,
                            userSubscriptionId: userSubscriptionId,
                            subscriptionId: subscriptionId,
                            totalAmount: _amount ?? 0,
                            totalDiscount: _discount ?? 0,
                            orderId: finalOrderId ?? null
                        }
                        konsole.log("jsonObjOfCreateSubs auto", jsonObjOfCreateSubs, JSON.stringify(jsonObjOfCreateSubs), cardDetails.expireDate, validityTo)                        

                        const isValidExpiryDate = $AHelper.isValidExpiry(cardDetails.expireDate, validityTo);
                        // alert(isValidExpiryDate);
                        if(isValidExpiryDate != true) {
                            if(isCallFromFuturePayment) AlertToaster.success(`Payment scheduled successfully for ${$newHelper.$getDateFormatted($AHelper.parseDateSafely(externalvalues?.futurePayDate ?? ""))}. However, unable to schedule auto-renewal as your card will expire before the renewal date.`)
                            else AlertToaster.error(`Unable to schedule auto-renewal as your card will expire before the renewal date.`);
                        } else {
                            // return;
                            props.dispatchloader(true);
                            const _resultOfCreateSubs = await recurringErrorHandled(jsonObjOfCreateSubs);
                            konsole.log("_resultOfCreateSubs", _resultOfCreateSubs)
                            props.dispatchloader(false)

                            if(isCallFromFuturePayment) AlertToaster.success(`Payment scheduled successfully for ${$newHelper.$getDateFormatted($AHelper.parseDateSafely(externalvalues?.futurePayDate ?? ""))}`)
                        }
                    }
                }   

        konsole.log("_resultAddUserFileCabinetAdd", _resultAddUserFileCabinetAdd);
        if(isCallFromFuturePayment) handleIsPayment();
        if(callerReference != "AccountSetting") {
            handleAMAShowOccurrence(true);
            getsubscriptionDetailsfun()
        }
        props.dispatchloader(false);
        handleClearSearch()
    }

    // konsole.log("tabCon-autonew-o", $AHelper.isValidExpiry("08/29", "03-26-2026"), new Date());

    const handleClearSearch = (fromModalClose = false) => {
        if(callerReference == "AccountSetting") {
            props?.callapidata?.();
            return props?.showannualagreementmodalfun(false);
        }
        if (fromModalClose && props.isPaymentOrderId && props.isPaymentStatus) {
            props.functionHandleorderIdNStatus(null, null)
            window.location.reload();
        }
        const searchItemSS = sessionStorage.getItem('searchItem');
        let searchItem = (searchItemSS == "") ? (props?.clientData?.primaryEmailAddress) : (isNullUndefine(searchItemSS) ? "" : searchItemSS);
        const newURL = window.location.pathname + `?toogle=2&search=` + encodeURIComponent(searchItem)
        konsole.log("newURL", newURL)
        window.history.pushState({ path: newURL }, '', newURL);
        sessionStorage.setItem("amaUser", '')
    }

    //-------------------------------Get First Data--------------------------------------------

    const createjsonforcheckboxradio = (index, items) => {
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
    const getsubscriptionDetailsfun = () => {
        konsole.log("getsubscriptionDetailsfun")
        setSubsApicall(false)
        props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getSubscriptionDetails + subtenantId + "/" + subscriptionId, "", (res, error) => {
                props.dispatchloader(false)
                if (res) {
                    setjsonforradiocheeckbox([])
                    konsole.log("response", res)
                    setSubscriptionDetails(res.data.data[0])
                    setSubscriptionSubPlans(res.data.data[0]?.subsPlans)
                    konsole.log("jfbasjkbjsdjkbsaj", res.data.data[0]?.subsPlans.length)
                    let arrayforjson = res.data.data[0]?.subsPlans
                    let array = []
                    for (let [index, value] of arrayforjson.entries()) {
                        let results = createjsonforcheckboxradio(index, value.subsPlanId)
                        // setjsonforradiocheeckbox(oldarray => [...oldarray, results])
                        array.push(results)
                        konsole.log("valuevlaue", results)
                    }
                    // debugger
                    setjsonforradiocheeckbox(array)
                    getUserSubscription(array)
                } else {
                    konsole.log("error", error)
                }

            })
    }
    const createattorneyjson = (fulllname, userid) => {
        return {
            value: userid,
            label: fulllname
        }
    }

    const getAttorneyUserList = () => {
        props.dispatchloader(true)
        let inputJson = {
            "subtenantId": subtenantId,
            "isActive": true,
            "roleId": 13,
            "userType": "LEGAL"
        }
        konsole.log("inputJson", inputJson)
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getUserListByRoleId, inputJson, (res, error) => {
            props.dispatchloader(false)
            if (res) {
                konsole.log("responseresponse", res)
                setattorneyUserListvaluelabel([])
                let responseData = res.data.data
                if(callerReference == "AccountSetting") responseData = responseData?.filter(ele => isNotValidNullUndefile(ele?.signatureId));
                setattorneyUserList(responseData)
                for (let item of responseData) {
                    let jsonvalue = createattorneyjson(item?.fullName, item.userId)
                    setattorneyUserListvaluelabel(oldarray => [...oldarray, jsonvalue])
                    konsole.log("jsonvalue", jsonvalue)
                }
            } else {
                konsole.log("error", error)
            }
        })
    }
    konsole.log("memberIdClientIdmemberIdClientId", subtenantId, subscriptionId, memberIdClientId)

    //------------------------ GET SAVED DATA for update------------------------------------------------
    const getUserSubscription = (array) => {
        props.dispatchloader(true)
        const isActive = true
        $CommonServiceFn.InvokeCommonApi(
            "GET",
            $Service_Url.getUserSubscription + `${subtenantId}/${isActive}?SubscriptionId=${subscriptionId}&UserId=${memberIdClientId}`,
            "",
            (res, err) => {
                props.dispatchloader(false)
                if (res) {
                    konsole.log("res4", res)
                    let userSubscriptionId = res.data.data[0]?.userSubscriptionId
                    let attorneyId = res.data.data[0]?.attorneyId
                    let attorneyName = res.data.data[0]?.attorneyName
                    let fileid = res?.data?.data[0]?.subsFileId
                    let orderId = res?.data?.data[0]?.orderId
                    let orderIdupdatedOn = res?.data?.data[0]?.updatedOn
                    let renewDate = res?.data?.data[0]?.validityTo;
                    let startOnDate = res?.data?.data[0]?.validityFrom;
                    let _authorizeSubscriptionId = Number(res?.data?.data[0]?.authorizeSubscriptionId);
                    let _futureAuthorizeSubscriptionId = Number(res?.data?.data[0]?.futureAuthorizeSubscriptionId);
                    let futurePayDate = res?.data?.data[0]?.futurePayDate;
                    
                    const parseDateSafely = (dateStr) => {
                        if (!dateStr) return null;
                        const normalizedDateStr = dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00Z`;
                    
                        const date = new Date(normalizedDateStr);
                        if (isNaN(date.getTime())) {
                            const parts = dateStr.split(/[-/]/);
                            if (parts.length === 3) {
                                const [part1, part2, part3] = parts.map((p) => p.padStart(2, '0'));
                                const isoDate = `${part3}-${part1}-${part2}T00:00:00Z`;
                                const safariSafeDate = new Date(isoDate);
                                if (!isNaN(safariSafeDate.getTime())) return safariSafeDate;
                            }
                            return null;
                        }
                        return date;
                    };
                    
                    const addOneYear = (dateStr) => {
                        const date = parseDateSafely(dateStr);
                        if (!date) return null;
                        date.setFullYear(date.getFullYear() + 1);
                        return $AHelper.getFormattedDate(date.toISOString());
                    };
                    
                    const noAddOneYear = (dateStr) => {
                        const date = parseDateSafely(dateStr);
                        if (!date) return null;
                        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                    };
                    
                    const myDataStartOn = startOnDate
                        ? $AHelper.getFormattedDate(parseDateSafely(startOnDate)?.toISOString())
                        : orderIdupdatedOn
                        ? $AHelper.getFormattedDate(parseDateSafely(orderIdupdatedOn)?.toISOString())
                        : '';
                    
                    const localFormattedValidityFrom = startOnDate
                        ? noAddOneYear(startOnDate)
                        : orderIdupdatedOn
                        ? noAddOneYear(orderIdupdatedOn)
                        : '';
                    
                    const myDataRenewOn = renewDate
                        ? $AHelper.getFormattedDate(parseDateSafely(renewDate)?.toISOString())
                        : localFormattedValidityFrom
                        ? $AHelper.getFormattedDate(parseDateSafely(addOneYear(localFormattedValidityFrom))?.toISOString())
                        : '';

                    setPaymentOrderId(orderId)
                    setauthorizeSubscriptionId((isNaN(_authorizeSubscriptionId) == false) && (_authorizeSubscriptionId != 0) ? _authorizeSubscriptionId : null);
                    setfutureAuthorizeSubscriptionId((isNaN(_futureAuthorizeSubscriptionId) == false) && (_futureAuthorizeSubscriptionId != 0) ? _futureAuthorizeSubscriptionId : null);
                    if(callerReference != "AccountSetting") setSelectAttorneId(attorneyId);
                    setSelectAttorneName(attorneyName)
                    setOrderIdUpdatedOn(myDataRenewOn)
                    setOrderIdStartOn(myDataStartOn)
                    setfuturePaymentdate(futurePayDate);
                    setSubsFileId(fileid)
                    setSubAndPlansGetData(res.data.data)
                    setAddUpdate(true)
                    // let filterdata = attorneyUserListvaluelabel.filter((items) => items.value == attorneyId)
                    // setselectattornetvalue(filterdata)
                    updateCalendarValue(localFormattedValidityFrom);
                    getUserSubscriptionPlansDetails(userSubscriptionId, array)
                    getUserOrderDetailsHistory(memberIdClientId, myDataRenewOn, myDataStartOn);

                } else {
                    konsole.log("err4", err)
                }
            }
        )
    }

    const updateCalendarValue = (dateValue) => {
        const formattedDate = formatDateForSafari(dateValue);
        setFormattedValidityFrom(formattedDate);
        konsole.log(dateValue, formattedValidityFrom, 'fabc')
    };

    const formatDateForSafari = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`);
        if (isNaN(date)) return null;
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    };

    const getUserOrderDetailsHistory = (userId, myDataRenewOn, myDataStartOn) =>{
        konsole.log("userIdprofile",userId, myDataRenewOn, myDataStartOn)
        props.dispatchloader(true)
        Services.getUserOrderDetails(userId, myDataRenewOn, myDataStartOn)
        .then((res) => {
            konsole.log("responseOrderDetails", res);
            if (res?.data?.data && res?.data?.data?.length > 0) {
                const firstRenewalDate = res?.data?.data[0]?.nextRenewalDate;
                const formattedDate = firstRenewalDate
                    ? $AHelper.getFormattedDate(new Date(firstRenewalDate).toISOString())
                    : myDataRenewOn;

                const renewalDate = myDataStartOn;
                const date = renewalDate ? new Date(renewalDate) : null;
                if (date && !isNaN(date.getTime())) {
                    date.setFullYear(date.getFullYear() + 1);
                }
                
                const formattedDateRenewalDate = date && !isNaN(date.getTime())
                    ? `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`
                    : myDataRenewOn;
                
                setOrderDetails(res?.data?.data)
                setOrderIdUpdatedOn(formattedDateRenewalDate);
            }
            props.dispatchloader(false);
        }).catch((err) => {
            konsole.log("erroorrOrderDetails", err);
        });
   }

    const getUserSubscriptionPlansDetails = (userSubscriptionId, array) => {
        props.dispatchloader(true)
        let memberId= memberIdClientId;
        konsole.log("jdjdjddjdjddjdj", memberId)
        let isActive = true;
        const url = `${$Service_Url.getUserSubscriptionPlans}?UserSubscriptionId=${userSubscriptionId}&IsActive=${isActive}`;
    
        $CommonServiceFn.InvokeCommonApi(
            "GET",
            url,
            "",
            (res, err) => {
                props.dispatchloader(false)
                if (res) {
                    konsole.log("res5", res)
                    // konsole.log("res5", res.data.data, array)
                    setrenderpage(!renderpage)
                    let arrayData = array
                    konsole.log("arrayData", arrayData)
                    for (let [item, value] of res.data.data.entries()) {
                        // konsole.log("res5", value)
                        for (let i = 0; i < arrayData.length; i++) {
                            // konsole.log("res5", arrayData[i].value)
                            if (value.subsPlanId == arrayData[i].subsPlanId) {
                                // konsole.log("res5", arrayData[i].value, value.isActive)
                                arrayData[i].value = value.isActive
                                arrayData[i].checkedputplanid = true
                                arrayData[i].selectedPlanIdd = value?.subsPlanSKUMapId
                                arrayData[i].subPlanGetId = value?.userSubsPlanId,
                                    arrayData[i].subtenantRateCardId = value?.subtenantRateCardId

                            }
                        }
                    }
                    // jsonforradioceeckbox
                    konsole.log("jsonforradiocheeckbox", jsonforradiocheeckbox, arrayData)
                    setSubscriptionPlansDetails(res.data.data)
                    setAddUpdate(true)
                } else {
                    konsole.log("err5", err)
                }
            }
        )
    }





    //---------------------------------------------------------------
    const subscriptionfirstcheckfun = (e, index) => {
        let checkedvalue = e.target.checked
        konsole.log("jsonforradiocheeckboxindex", subscriptionSubPlans[index].subsPlanSKUs.length)
        // konsole.log("indexindex",index,checkedvalue)
        // konsole.log("eeeeeeeeeeeeeeee", e.target.value,e.target.checked,index)
        setSubplanIdstate(e.target.value)
        jsonforradiocheeckbox[index].value = checkedvalue
        if (subscriptionSubPlans[index].subsPlanSKUs.length == 1) {
            jsonforradiocheeckbox[index].selectedPlanIdd = subscriptionSubPlans[index]?.subsPlanSKUs[0]?.subsPlanSKUMapId
            jsonforradiocheeckbox[index].subtenantRateCardId = subscriptionSubPlans[index]?.subsPlanSKUs[0]?.subtenantRateCardId
            // Set checkedValueOfPlan here if endSubscriptionAmt is not empty
            const endSubscriptionAmt = subscriptionSubPlans[index]?.subsPlanSKUs[0]?.endSubscriptionAmt;
            if (endSubscriptionAmt !== undefined && endSubscriptionAmt !== null) {
                setCheckedValueOfPlan(oldState => ({ ...oldState, [index]: endSubscriptionAmt }));
            }
        } else {
            // Reset checkedValueOfPlan if unchecked
            setCheckedValueOfPlan(oldState => ({ ...oldState, [index]: "" }));
            // jsonforradiocheeckbox[index].selectedPlanIdd = "";
            // jsonforradiocheeckbox[index].subtenantRateCardId = "";
        }
        setrenderpage(!renderpage)
    }


    const subscriptionradiofun = (e, index) => {
        const _subtenantRateCardId = subscriptionSubPlans?.[index]?.subsPlanSKUs?.find(ele => ele?.subsPlanSKUMapId == e?.value)?.subtenantRateCardId;
        konsole.log("eeeeeeeeeeeeeeeeee", e?.value, e?.id, _subtenantRateCardId);
        jsonforradiocheeckbox[index].selectedPlanIdd = e?.value;
        jsonforradiocheeckbox[index].subtenantRateCardId = _subtenantRateCardId;
        setrenderpage(!renderpage)
    }

    const validate = () => {
        konsole.log("selectattornetvalue1", selectattorneyid)
        let newError = "";

        if (!(selectattorneyid !== '' && selectattorneyid !== undefined && selectattorneyid !== null)) {
            newError = "Please choose name of attorney to generate AMA.";
        }
        let valuecheck = false
        let valueradio = true
        for (let [index, value] of jsonforradiocheeckbox.entries()) {
            if (jsonforradiocheeckbox[index].value == true) {
                valuecheck = true;
            }
            if (jsonforradiocheeckbox[index].value == true && !(jsonforradiocheeckbox[index].selectedPlanIdd !== null && jsonforradiocheeckbox[index].selectedPlanIdd !== '' && jsonforradiocheeckbox[index].selectedPlanIdd !== undefined)) {
                valueradio = false
            }
        }
        konsole.log("valueradio", valueradio, valuecheck)
        if (valuecheck == false) {
            newError = "Please choose service";
        }
        if (valuecheck == true && valueradio == false) {
            newError = "Please select any one of the plan"
        }
        konsole.log("valuecheck", valuecheck)



        if (newError) {
            toasterShowMsg(newError, 'Warning')
            // alert(newError);
            konsole.log(newError)
            return false;
        }

        return true;
    }


    const genereateViewPdf = async (fileDetails, btnType, selectedDate) => {
        if (!validate()) return;
        konsole.log("fileDetails", fileDetails)
        if(btnType =='sendLink' && isNullUndefine(commChannelId)){
            if(callerReference == "AccountSetting") setWarning("warning", "Warning", "Occurrence not available. Please contact your administrator.");
            else AlertToaster.error("Occurrence not available. Please contact your administrator.");
            return;
        }

        const jsonObj = createJsonUploadFileV2({ UserId: memberIdClientId, File: fileDetails[0], UploadedBy: _loggedInUserId, FileTypeId: 64, FileCategoryId: 6, FileStatusId: 2, UserFileName: props?.clientData?.memberName + ' - Annual Maintenance Agreement',DateFinalized: selectedDate && typeof selectedDate === 'string' ? selectedDate.split("T")[0] : selectedDate instanceof Date ? selectedDate.toISOString().split("T")[0] : ''});
        konsole.log("jsonObj2", jsonObj)

        props.dispatchloader(true);
        const _resultUploadFile = await postUploadUserDocumant(jsonObj);
        konsole.log("_resultUploadFile", _resultUploadFile)
        props.dispatchloader(false);
        if (_resultUploadFile == 'err') return;
        props.dispatchloader(true);
        // const _resultAddUserFileCabinetAdd = await apiCallUserFileCabinetAdd(_resultUploadFile?.fileId, memberIdClientId);
        // konsole.log("_resultAddUserFileCabinetAdd", _resultAddUserFileCabinetAdd)
        props.dispatchloader(false);
        konsole.log("_resultUploadFile", _resultUploadFile);
        generateAMAfun(_resultUploadFile?.fileId, btnType, selectedDate)
    }


    const apiCallUserFileCabinetAdd = async (fileId, memberIdClientId) => {
        // let { fileCategoryId, fileId, fileStatusId, fileTypeId } = responseData;
        let fileCategoryId = 6;
        let fileTypeId = 64;
        let belongsTo = [{ "fileBelongsTo": memberIdClientId }]
        let feeAgreementNOtherForms = allFolderList?.filter((item) => item?.folderName == specificFolderName[4]);
        let currentFolderId = allFolderList?.filter(({ folderName, parentFolderId, folderId }) => parentFolderId == feeAgreementNOtherForms[0].folderId && folderName == specificFolderName[2])
        let currentFeeAgreeFolderId = currentFolderId[0]?.folderId
        let postJson = createFileCabinetFileAdd({ cabinetId: cabinetFileCabinetId[0], belongsTo, fileUploadedBy: _loggedInUserId, fileCategoryId, folderId: Number(currentFeeAgreeFolderId), fileId, fileStatusId: 2, fileTypeId, primaryUserId: memberIdClientId, isShared: true, isActive: true, isMandatory: true, isFolder: false, isCategory: false, })

        return new Promise(async (resolve, reject) => {
            const _resultAddFile = await postApiCall('POST', $Service_Url.postAddFileCabinet2, postJson);
            if (_resultAddFile != 'err') {
                await callFilePermissionsApi(memberIdClientId, fileId);
                resolve('resolve');
            } else {
                resolve('err')
            }
        })
    }

    const callFilePermissionsApi = async (memberIdClientId, fileId) => {
        props.dispatchloader(true)
        const result = await apiCallGetUserListByRoleId();
        konsole.log(legalTeamList,"legalTeamListqshdlkhdslhalks", result)
        if (result !== 'err') {
            let primaryMemberUserId = memberIdClientId
            let permissionArr = []
            for (let j = 0; j < result?.length; j++) {
                const newObj = cretaeJsonForFilePermission({ fileId: fileId, belongsTo: memberIdClientId, primaryUserId: memberIdClientId, sharedUserId: result[j].userId, isActive: true, isDelete: false, isEdit: false, isRead: true, ...manageCreate })
                permissionArr.push(newObj)
            }
            props.dispatchloader(true)
            konsole.log('permissionArrpermissionArr', permissionArr)
            return new Promise((resolve, reject) => {
                Services.upsertShareFileStatus(permissionArr).then((res) => {
                    konsole.log('res of upser file share', res)
                    resolve('resolve');
                }).catch((err) => {
                    konsole.log('err in upsert sharefile', err)
                    resolve('err');
                })
            })

        }


    }



    //----------------------common-add-update--data-------------------------------------------
    const generateAMAfun = (fileid, btnType, selectedDate) => {
        if (validate()) {
            sessionStorage.setItem("amaDocFileId", fileid)
            if (addupdate == false) {
                konsole.log(addupdate,"jdjdjjsjsjsjdsdjsdj")
                postuserSubscriptionAdd(fileid, btnType, selectedDate)
            } else {
                putuserSubscriptionUpdate(fileid,btnType, selectedDate)
            }
        }
    }

    //--------------------POST data--------------------------------------------
    const postuserSubscriptionAdd = (fileid, btnType, selectedDate) => {
        props.dispatchloader(true)
        let jsonobj = {
            "userId": memberIdClientId,
            "attorneyId": selectattorneyid,
            "isActive": true,
            "subsStatusId": 1,
            "subscriptionId": props?.subscriptionId,
            "subtenantId": subtenantId,
            "validityFrom" : selectedDate,
            "futurePayDate": paymentDate,
            "createdBy": loggeduserId
        }
        konsole.log("jsonobj1", JSON.stringify(jsonobj))
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postuserSubscriptionAdd, jsonobj, (res, error) => {
            props.dispatchloader(false)
            if (res) {
                konsole.log("res1", res)
                const data = res.data.data
                postuserSubscriptionPlansAdd(data, fileid, btnType, selectedDate)
            } else {
                konsole.log("err1", error)
            }
        })
    }

    let createjsonforpostuserPlans = (userSubscriptionIdd, subsPlanSKUMapIdd, subtenantRateCardId) => {
        konsole.log("subsPlanSKUMapIdd", subsPlanSKUMapIdd)
        return {
            "userSubscriptionId": userSubscriptionIdd,
            "subsPlanSKUMapId": subsPlanSKUMapIdd,
            "userSubsPlanId": null,
            "isActive": true,
            "upsertedBy": loggeduserId,
            "subtenantRateCardId": subtenantRateCardId
        }
    }
    const postuserSubscriptionPlansAdd = (userSubscriptionId, fileid, btnType) => {
        let jsonobj = []
        let jsonforradiocheeckboxfilter = jsonforradiocheeckbox.filter((items) => items.selectedPlanIdd !== null)
        konsole.log("jsonforradiocheeckboxfilter", jsonforradiocheeckboxfilter, jsonforradiocheeckbox)
        for (let value of jsonforradiocheeckboxfilter) {
            if(value?.value != true) continue;
            let resultsresults = createjsonforpostuserPlans(userSubscriptionId, value.selectedPlanIdd, value.subtenantRateCardId)
            jsonobj.push(resultsresults)
        }
        props.dispatchloader(true)

        konsole.log("jsonobj2", JSON.stringify(jsonobj))
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.upsertuserSubscriptionPlans, jsonobj, (res, error) => {
            props.dispatchloader(false)
            if (res) {
                konsole.log("res2", res)
                // postuserSubscriptiongeneratesDocs(userSubscriptionId ,fileid)
                let subsfileiddata = fileid
                setSubsFileId(subsfileiddata)
                // console.log('btnTypebtnType',btnType)
                if(btnType =='sendLink'){
                    funForSentLink()
                    // function of sent link
                } else {
                    msgFunForDOcumentenerate('add')

                }
            } else {
                konsole.log("err2", error)
            }
        })
    }


    function msgFunForDOcumentenerate(type) {
        if(callerReference == "AccountSetting") setWarning("successfully", 'Successfully Generated Document', 'Document generated successfully.');
        else AlertToaster.success('Document generated successfully.');
        // if (type == 'add') {
        handleIsPayment()
        // } else {
        //     openAnnualModalFilefun()
        // }
    }

    const handleIsPayment = () => {
        if(demo && isPaymentOpen && addupdate==false ){
            getsubscriptionDetailsfun();
        }
        setIsPaymentOpen(prev => !prev)  
    }
    const postuserSubscriptiongeneratesDocs = (userSubscriptionId) => {
        props.dispatchloader(true)
        let jsonobj = {
            "subtenantId": subtenantId,
            "subscriptionId": props?.subscriptionId,
            "userId": memberIdClientId,
            "userSubscriptionId": userSubscriptionId,
            "subsStatusId": 2,
            "generatedBy": loggeduserId
        }
        konsole.log("jsonobj3", JSON.stringify(jsonobj))

        const currentDate = $AHelper.getFormattedDate(new Date());
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postusersubscriptionGeneratesDocs + '?currentDate=' + currentDate, jsonobj, (res, error) => {
            props.dispatchloader(false)
            if (res) {
                konsole.log("res3", res)
                let subsfileiddata = res.data?.data?.subsFileId
                setSubsFileId(subsfileiddata)
                msgFunForDOcumentenerate('add')
            } else {
                konsole.log("err3", error)
            }
        })
    }

    const openAnnualModalFilefun = () => {
        // setOpenAnnualModalFile(!openAnnualModalFile)
        setSignatureAMAModalOpen(false);
    }

    konsole.log("jsonforradiocheeckboxjsonforradiocheeckbox", jsonforradiocheeckbox, subscriptionSubPlans)
    konsole.log("selectattornetvalue", selectattornetvalue)

    //-----------------------------------PUT-PUT------------------------------

    const putuserSubscriptionUpdate = (fileId, btnType, selectedDate) => {
        let jsonobj = {
            "userId": memberIdClientId,
            "attorneyId": selectattorneyid,
            "isActive": true,
            "subsStatusId": SubAndPlansGetData[0]?.subsStatusId,
            "subscriptionId": SubAndPlansGetData[0]?.subscriptionId,
            "subtenantId": subtenantId,
            "userSubscriptionId": SubAndPlansGetData[0]?.userSubscriptionId,
            "subsFileId": fileId || null ,
            "validityFrom" : selectedDate,
            "futurePayDate": paymentDate,
            // "subsFileId": SubAndPlansGetData[0]?.subsFileId,
            "userLinkId": SubAndPlansGetData[0]?.userLinkId,
            "updatedBy": loggeduserId
        }
        konsole.log("json123", JSON.stringify(jsonobj))

        $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUserSubUpdate, jsonobj, (res, err) => {
            if (res) {
                konsole.log("res123", res)
                putUserSubscriptionPlans(fileId, btnType, selectedDate)
            } else {
                konsole.log("err123", err)
            }
        })
    }


    let createJsonforupdateplans = (selectedPlanIdd, subsPlanId, isActive, checkedputplanid, subtenantRateCardId) => {
        konsole.log("ababababbaba", checkedputplanid)
        return {
            // "userSubscriptionId": SubAndPlansGetData[0]?.subscriptionId,
            // "subsPlanSKUMapId": selectedPlanIdd,
            // "userSubsPlanId": subsPlanId,
            // "userCntrlSubsTrxnId": null,
            // "isActive": true,
            // "updatedBy": loggeduserId,

            "userSubscriptionId": SubAndPlansGetData[0]?.userSubscriptionId,
            "userSubsPlanId": (checkedputplanid == true) ? subsPlanId : null,
            "subsPlanSKUMapId": selectedPlanIdd,
            "isActive": isActive,
            "upsertedBy": loggeduserId,
            "subtenantRateCardId": subtenantRateCardId
        }
    }

    konsole.log("jsonforradiocheeckboxjsonforradiocheeckbox", jsonforradiocheeckbox)

    const putUserSubscriptionPlans = (fileId, btnType) => {
        props.dispatchloader(true)
        let jsonobj = []
        let jsonforradiocheeckboxfilter = jsonforradiocheeckbox.filter((items) => items.selectedPlanIdd !== null)
        konsole.log("jsonforradiocheeckboxfilter", jsonforradiocheeckboxfilter, jsonforradiocheeckbox)
        for (let value of jsonforradiocheeckboxfilter) {
            konsole.log(value,"asdjnksankdjksn")
            // if(value?.value != true) continue;
            if(value?.subsPlanSKUMapId == "" || value?.subtenantRateCardId == "") continue;
            let resultsresults = createJsonforupdateplans(value?.selectedPlanIdd, value?.subPlanGetId, value?.value, value?.checkedputplanid, value?.subtenantRateCardId)
            jsonobj.push(resultsresults)
            konsole.log(resultsresults,"wdjisadkaskd")
        }


        konsole.log("jsonobj44", JSON.stringify(jsonobj))
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.upsertuserSubscriptionPlans, jsonobj, (res, err) => {
            props.dispatchloader(false)
            if (res) {
                konsole.log("resr44", res)
                // putuserSubscriptiongeneratesDocs(fileId)
                setSubsFileId(fileId)

                if (btnType == 'sendLink') {
                    // function for srnt link
                    funForSentLink()
                } else {
                    msgFunForDOcumentenerate('update')
                }
            } else {
                konsole.log("errr44", err)
            }
        })

        // }
        konsole.log("updateupdate")
    }



    useEffect(() => {
        fetchApi();
    }, []);


    const [emailObj, setEmailObj] = useState({ emailTempData: '', emailTemp: '' });
    const [textObj, setTextObj] = useState({ textTempData: '', textTemp: '' });
    const [commChannelId, setCommChannelId] = useState('');
    const fetchApi = async () => {
        if (!isNotValidNullUndefile(_subtenantId)) return;

        const occurrenceId = 19;
        props.dispatchloader(true)
        let jsonObj = { occurrenceId: occurrenceId, isActive: true, subtenantId: _subtenantId };
        const _resultComMediumPath = await postApiCall('POST', $Service_Url.getCommMediumPath, jsonObj);
        props.dispatchloader(false)

        if (_resultComMediumPath === 'err' || _resultComMediumPath?.data?.data?.length < 0) return;
        props.dispatchloader(true)
        const { commChannelId, applicableTextTempId, applicableEmailTempId, isActive, subtenantId } = _resultComMediumPath?.data?.data[0];
        const text_Url = `${$Service_Url.getTextTemplate}?TextTemplateId=${applicableTextTempId}&IsActive=${isActive}&SubtenantId=${subtenantId}`;
        const email_Url = `${$Service_Url.GetEmailTemplate}?TemplateId=${applicableEmailTempId}&IsActive=${isActive}&SubtenantId=${subtenantId}`;

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

    const funForSentLink = async () => {
        let jsonobj = {
            "subtenantId": _subtenantId,
            "linkTypeId": 1,
            "linkStatusId": 1,
            "occurrenceId": 20,
            "createdBy": _loggedInUserId,
            "userId": clientData?.memberId,
        }
        props.dispatchloader(true);
        const _resultOfUserLinkgenerate = await postApiCall('POST', $Service_Url.postuserlinkgenerate, jsonobj);
        props.dispatchloader(false);
        konsole.log('_resultOfUserLinkgenerate', _resultOfUserLinkgenerate);
        let responseData = _resultOfUserLinkgenerate.data?.data

        let linkstatusid = responseData?.linkStatusId
        let jsonobj2 = {
            "userSubscriptionId": subscriptionId,
            "userLinkId": linkstatusid,
            "updatedBy": _loggedInUserId
        }

        props.dispatchloader(true);
        const _resultOfPustUserSubsLink = await postApiCall('PUT', $Service_Url.putUserSubscriptionsetLink, jsonobj2);
        props.dispatchloader(false);
        konsole.log("_resultOfPustUserSubsLink", _resultOfPustUserSubsLink);

        await sentTextNMail(responseData);
    }

    const replaceTemplate = (temp, generateData) => {
        let cabinetName = 'Legal';
        let documentName = '(documentNAme)';
        let memberUserName = clientData?.memberName;
        let universallink = `${logoutUrl}account/Signin?subtenantId=${_subtenantId}`
        let TemplateContent = temp;
        let UniqueLink = generateData?.uniqueLinkURL;
        konsole.log(UniqueLink, "UniqueLinkUniqueLinkUniqueLink")


        TemplateContent = TemplateContent?.replace("@@USERNAME", memberUserName)
        TemplateContent = TemplateContent?.replace("@@LEGALPERSONNAME", _userLoggedInDetail?.memberName)
        TemplateContent = TemplateContent?.replace("@@LEGALPERSONNAME", _userLoggedInDetail?.memberName)
        TemplateContent = TemplateContent?.replace("@@CABINETNAME", cabinetName)
        TemplateContent = TemplateContent?.replace("@@SUBTENANTNAME", _subtenantName)
        TemplateContent = TemplateContent?.replace("@@PARALEGALEMAIL", _userLoggedInDetail?.primaryEmailId)
        TemplateContent = TemplateContent?.replace("@@UNIVERSALLINK", universallink)
        TemplateContent = TemplateContent?.replaceAll("@@UNIQUELINK", UniqueLink)
        TemplateContent = TemplateContent?.replace("some documents", 'Annual Maintenance Agreement document')

        return TemplateContent;
    }

    const sentTextNMail = async (generateData) => {

        const { textTemplateType, textTemplateId } = textObj?.textTempData[0]
        const { templateType, emailSubject, templateId } = emailObj?.emailTempData[0];

        konsole.log("clientDataxyz", clientData)

        const emailTo = clientData?.primaryEmailAddress;
        const primaryMemberUserId = clientData?.memberId;
        let textTo = clientData?.primaryPhoneNumber;
        if (isClientPermissions != true) {
            textTo = ''
        }
        const emailJson = createSentEmailJsonForOccurrene({
            emailType: templateType,
            emailTo: emailTo,
            emailSubject,
            emailContent: replaceTemplate(emailObj?.emailTemp, generateData),
            emailTemplateId: templateId,
            emailMappingTablePKId: primaryMemberUserId,
            emailStatusId: 1,
            emailMappingTablePKId: primaryMemberUserId,
            createdBy: _loggedInUserId,
        })
        const textJson = createSentTextJsonForOccurrene({
            smsType: textTemplateType,
            textTo: textTo,
            textContent: replaceTemplate(textObj?.textTemp, generateData),
            smsTemplateId: textTemplateId,
            smsMappingTablePKId: primaryMemberUserId,
            smsStatusId: 1,
            smsMappingTablePKId: primaryMemberUserId,
            createdBy: _loggedInUserId,

        });
        konsole.log("textJson", textJson, emailJson)
        props.dispatchloader(true)
        const _resultSentEmailtext = await sentMail(emailJson, textJson);
        konsole.log('_resultSentEmailtext', _resultSentEmailtext)
        props.dispatchloader(false)
        if (_resultSentEmailtext == 'resolve') {
            // const message = `Email ${commChannelId == 3 ? "and Text " : ''}Sent Successfully.`;
            const message = `AMA Link Sent Successfully`;
            if(callerReference == "AccountSetting") setWarning("successfully", message, 'Annual Maintenance Agreement link has been sent to your email');
            else AlertToaster.success(message);
        }
        // setViewAMAModalOpen(false);
        return;
    }
    konsole.log("subsFileIdsubsFileIdsubsFileId", subsFileId)
    const sentMail = async (emailJson, mobileJson) => {
        return new Promise(async (resolve, reject) => {
            try {
                props.dispatchloader(true);
                if (commChannelId === 2 && isNotValidNullUndefile(mobileJson?.textTo)) {
                    const _resultTextSent = await postApiCall('POST', $Service_Url.postSendTextPath, mobileJson);
                    konsole.log("_resultTextSent", _resultTextSent);

                    props.dispatchloader(false);
                    resolve('resolve');
                } else if (commChannelId === 1) {
                    const _resultEmailSent = await postApiCall('POST', $Service_Url.sentEmailWithAsyncCcBc, emailJson);
                    konsole.log('_resultEmailSent', _resultEmailSent);

                    props.dispatchloader(false);
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

                props.dispatchloader(false);
                resolve('resolve');
                modalCLose();
            } catch (error) {
                konsole.error('Error in sending mail or text:', error);
                props.dispatchloader(false);
                resolve(error); // Reject the promise in case of an error
            }
        });
    };
    //-----------------------------------------------------------------
    const modalCLose = () => {
        handleClearSearch(true)
        setSubsFileId('')
        subtenantId = ''
        subscriptionId = ''
        setAddUpdate(false)
        if(props?.isPortalSignOn) props.showannualagreementmodalfun("annualAgreement", false);
        else props.showannualagreementmodalfun();
        if ((isNotValidNullUndefile(futureAuthorizeSubscriptionId)) || (isNotValidNullUndefile(orderDetails[0]?.orderId) && isNotValidNullUndefile(orderDetails[0]?.paidAmount)) || (isNotValidNullUndefile(orderDetails[1]?.orderId) && isNotValidNullUndefile(orderDetails[1]?.paidAmount))){
            props?.callapidata?.()
        }
    }
    const cancelbtn = () => {
        handleClearSearch();
        if(props?.isPortalSignOn) props.showannualagreementmodalfun("annualAgreement", false);
        else props.showannualagreementmodalfun();
        if ((isNotValidNullUndefile(futureAuthorizeSubscriptionId)) || (isNotValidNullUndefile(orderDetails[0]?.orderId) && isNotValidNullUndefile(orderDetails[0]?.paidAmount)) || (isNotValidNullUndefile(orderDetails[1]?.orderId) && isNotValidNullUndefile(orderDetails[1]?.paidAmount))){
            props?.callapidata?.()
        }
    }
    const toasterShowMsg = (message, type, btnType) => {
        setdata({
            open: true,
            text: message,
            type: type,
            btnType: btnType
        })
    }

    const staticAlertTimer = (text) => {
        if (alertState == true) {
            if(callerReference == "AccountSetting") setWarning("warning", "Warning", text);
            else AlertToaster.error(text);
            setalertState(false);
            setTimeout(() => setalertState(true), [5000]);
        }
    }

    // const handleSignatureAMA = () => {
    //     if (isNotValidNullUndefile(paymentOrderId)) {
    //         AlertToaster.error("This user already has taken the AMA. If you want to view the document, please click on the download button.");
    //         return;
    //     }
    //     const anyChecked = jsonforradiocheeckbox.some(item => item.value === true);
    //     const isAttorneySelected = selectattorneyid !== null && selectattorneyid !== '';

    //     if (!anyChecked) {
    //         AlertToaster.error(`Please choose your Service`);
    //     } else if (!checkedValueOfPlan) {
    //         AlertToaster.error(`Please choose your Service Plan`);
    //     } else if (!isAttorneySelected) {
    //         AlertToaster.error(`Please choose your Legal Staff`);
    //     } else {
    //         setSignatureAMAModalOpen(true);
    //     }
    // };

    const isSameDate = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    };
    
    const handleViewAMA = () => {
        // if(callerReference == "AccountSetting") {
        //     return generateAMAfun('', 'sendLink', selectedDate);
        // }
        if (isAmaPlanActive) {
            const jsonObj = { 
                userId: memberIdClientId, 
                requestedBy: loggeduserId,
                fileCategoryId: 6,
                fileTypeId: 64,
                fileId: subsFileId,
            };
            setFileInfo({ 
                ...fileInfo,
                ...jsonObj,
            });
            setIsFileViewerOpen(true);
            return;
        }
        // debugger
        const anyChecked = jsonforradiocheeckbox[0]?.value === true;
        // const anyChecked = jsonforradiocheeckbox.some(item => item.value === true);
        const planCheckConditions = [
            jsonforradiocheeckbox[0]?.value === true && isNullUndefine(jsonforradiocheeckbox[0]?.selectedPlanIdd),
            jsonforradiocheeckbox[1]?.value === true && isNullUndefine(jsonforradiocheeckbox[1]?.selectedPlanIdd),
            jsonforradiocheeckbox[0]?.value === true && jsonforradiocheeckbox[1]?.value === true &&
            (isNullUndefine(jsonforradiocheeckbox[0]?.selectedPlanIdd) || isNullUndefine(jsonforradiocheeckbox[1]?.selectedPlanIdd))
        ];
        konsole.log(jsonforradiocheeckbox,"xjdjsdwjddjs")
        const isAttorneySelected = selectattornetvalue?.length > 0 &&
            selectattornetvalue
                .map(item => item.label?.trim())
                .filter(label => isNotValidNullUndefile(label))
                .length > 0;
        // konsole.log(selectattornetvalue,"qdadkaZksdkdjkasdjhkd")
        konsole.log(selectedDate, today, new Date(selectedDate) < today , formatDate(today), orderIdStartOn, "qdadkaZksdkdjkasdjhkd")

        if (!isAttorneySelected) {
            staticAlertTimer(`Please choose your Legal Staff`);
        } else if (planCheckConditions.some(condition => condition)) {
            staticAlertTimer("Please choose your Service Plan");
        } else if (!anyChecked) {
            staticAlertTimer(`Please choose your Service`);
        } else if (!formattedValidityFrom && (paymentDate === 'mm-dd-yyyy' || !paymentDate || (typeof paymentDate === 'string' && paymentDate.trim() === '') || (paymentDate instanceof Date && isNaN(paymentDate)))) {
            staticAlertTimer(`Please choose a payment date`);
        } else if (new Date(selectedDate) < today && !isSameDate(new Date(selectedDate), today)) {
            staticAlertTimer(`The selected date cannot be earlier than today.`);
        } else {
            // if(callerReference == "AccountSetting") {
            //     return generateAMAfun('', 'sendLink', selectedDate);
            // } else {
                setViewAMAModalOpen(true);
            // }
        }
    }
    const handleAMAShowOccurrence = (val) => {
        setShowAMAOccurrencePreview(val);
    }


    const sortingOfPackages = (data) => {
        return data.sort((a, b) => a.skuListName.includes("Free Portal") == b.skuListName.includes("Free Portal") ? 0 : (a?.skuListName?.includes("Free Portal") ? -1 : 1));
    };

    const filteredOptionsattorneyUserListvaluelabel = attorneyUserListvaluelabel.filter(option =>
        option.label && option.label.trim() !== ''
    );
    let isCeckboxRadioDisabled = (isAmaPlanActive) ? true : false;

    const optionsWithAttorneyName = [
        ...filteredOptionsattorneyUserListvaluelabel?.map(ele => ({
            ...ele,
            label: ele.label ? $AHelper.capitalizeAllLetters(ele.label) : '',
        })) || [],
    ];

    // konsole.log("dhkfsdhfjkshdkj", selectattorneyid, selectattornetvalue, optionsWithAttorneyName, selectAttorneName, optionsWithAttorneyName.find(option => option.label?.toLowerCase() == selectAttorneName?.toLowerCase()));


    if (selectAttorneName && (!optionsWithAttorneyName.some(option => option.label?.toLowerCase() == selectAttorneName?.toLowerCase()))) {
        if(isAmaPlanActive) {
            optionsWithAttorneyName.push({
                value: selectAttorneName,
                label: $AHelper.capitalizeAllLetters(selectAttorneName),
            });
        } else {
            setSelectAttorneId('');
            setSelectAttorneName('');
        }
    }

    const formattedDate = new Date(selectedDate|| formattedValidityFrom).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    const handleConfirm = () => {
        setIsConfirmed(true);
    };

    const getInitials = (name) => {
        const nameParts = name.trim().split(' ');
        if (nameParts.length >= 2) {
            return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
        } else if (nameParts.length === 1) {
            return nameParts[0].slice(0, 2).toUpperCase();
        }
        return '';
    };

    const initials = getInitials(clientData?.memberName || '');

    // return ( <AmaFuturePayment clientData={props?.clientData} subscriptionId={subscriptionId} subtenantId={subtenantId} /> )

    return (
        <div>
            <Modal id='AnnualAgreemetModal' className='AnnualAgreemetModal' show={props.showannualagreementmodal} size="lg" animation="false" backdrop="static"  >
                <Modal.Header className='AnnualModalHeader d-flex h-auto justify-content-between' style={{ border: "none" }} >
                    <Modal.Title>{subscriptiondetails?.subscriptionName}</Modal.Title>
                    <img className='mt-0 me-1 cursor-pointer' onClick={()=>modalCLose()} src='/icons/closeIcon.svg'></img>
                </Modal.Header>
                <Modal.Body className='p-2 pt-0'>
                    {showAmaOccurrencePreview &&
                        <AmaOccurrence
                            dispatchloader={props.dispatchloader}
                            clientData={props?.clientData}
                            allFolderList={allFolderList}
                            legalCategoryLifePlanFolderId={legalCategoryLifePlanFolderId}
                            handleAMAShowOccurrence={handleAMAShowOccurrence}
                            showAmaOccurrencePreview={showAmaOccurrencePreview}
                        />
                    }
                    {(isPaymentOpen) &&
                        <AmaOrderSummary
                            dispatchloader={props.dispatchloader}
                            clientData={props?.clientData}
                            subscriptionId={subscriptionId}
                            subscriptionSubPlans={subscriptionSubPlans}
                            key={isPaymentOpen}
                            show={isPaymentOpen}
                            paymentDate={paymentDate}
                            handleIsShow={handleIsPayment}
                            isPortalSignOn={props?.isPortalSignOn}
                            refrencePage={callerReference == "AccountSetting" ? "AccountSetting" : "AnnualAgreementModal"}
                            callerReference={callerReference}
                            getsubscriptionDetailsfun={getsubscriptionDetailsfun}
                            funForOrderIdUpdate={funForOrderIdUpdate}
                        />
                    }
                    {isFileViewerOpen && (
                        <FileViewer
                            openFileInfo={fileInfo}
                            isFileOpen={isFileViewerOpen}
                            setIsFileOpen={setIsFileViewerOpen}
                            fileCabinetDesign='new'
                            isDirectAMA={true}
                        />
                    )}
                    {(openAnnualModalFile == true) ?
                        <AnnualAgreementModalFile
                            key={openAnnualModalFile}
                            openAnnualModalFile={openAnnualModalFile}
                            openAnnualModalFilefun={openAnnualModalFilefun}
                            subsFileId={subsFileId}
                            subtenantId={subtenantId}
                            subscriptionId={subscriptionId}
                            clientData={props?.clientData}
                        /> : ""}
                    <Col className='px-2'>
                        <Row className='borderBelow d-flex align-items-center p-2'>
                            <Col xs={12} md={1} xl={1} className='profilePortalSignOnLeft  '>
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
                                    <p className='userName'>{$AHelper.capitalizeAllLetters(props?.clientData?.memberName)}</p>
                                </Row>
                                <Row>
                                    <p className='userPosition'>Client</p>
                                </Row>
                            </Col>
                        </Row>
                        {(callerReference != "AccountSetting") && <Row className='borderBelow d-flex align-items-center py-2'>
                            <Col xs={12} md={6} xl={6} className='profilePortalSignOnLeft'>
                                <Row>
                                    <p className='paymentLabel'>Legal Staff &#x2a;</p>
                                </Row>
                                <Row className='useNewDesignSCSS'>
                                    <CustomSearchSelect
                                        placeholder='Select legal staff'
                                        options={optionsWithAttorneyName}
                                        onChange={(e) => handleAttorneySelect(e, 'selectedOption')}
                                        value={selectattornetvalue[0]?.value || selectAttorneName || undefined}
                                        isDisable={isCeckboxRadioDisabled}
                                    />
                                </Row>
                            </Col>
                        </Row>}
                        <Row className='borderBelow d-flex align-items-center py-2'>
                            <Col xs={12} md={12} xl={12} className='profilePortalSignOnLeft'>
                                <Row>
                                    <p className='lableService'>Services:</p>
                                </Row>
                                <Row className='useNewDesignSCSS pt-2 px-3'>
                                    {subscriptionSubPlans.length > 0 && subscriptionSubPlans.map((items, outerIndex) => {
                                        if (!items?.subsPlanSKUs?.length) return ""
                                        return (
                                            <div className='customCheckboxRadio' key={items?.subscriptionPlanName} >
                                                <CustomCheckBox
                                                    id={items?.subsPlanId}
                                                    label={items?.subscriptionPlanName}
                                                    onChange={(e) => subscriptionfirstcheckfun(e, outerIndex)}
                                                    value={(jsonforradiocheeckbox[outerIndex]?.value === true)}
                                                    isDisabled={isCeckboxRadioDisabled}
                                                />
                                                <Row className='ms-5 ps-0 mainRadioContainer'>
                                                    {items?.subsPlanSKUs?.length > 0 && sortingOfPackages(items?.subsPlanSKUs)?.map((items2) => {
                                                        let labelAmt = (items2?.endSubscriptionAmt === 0) ? "" : `$${items2?.endSubscriptionAmt}/year `;
                                                        let skiLisnName = items2?.skuListName;
                                                        const skiLisnNameRemoveUnderschore = skiLisnName?.startsWith("INDPKG_")
                                                            ? skiLisnName?.replace('INDPKG_', '')
                                                            : skiLisnName?.startsWith("GRPPKG_")
                                                                ? skiLisnName?.replace('GRPPKG_', '')
                                                                : skiLisnName;

                                                        let labelvalue = {
                                                            label: <span><b>{labelAmt}</b> {(items2?.endSubscriptionAmt === 0 ? "" : "for")} {skiLisnNameRemoveUnderschore}</span>,
                                                            value: items2?.subsPlanSKUMapId
                                                        };

                                                        if (jsonforradiocheeckbox[outerIndex]?.selectedPlanIdd === items2.subsPlanSKUMapId) {
                                                            if (items2?.endSubscriptionAmt !== checkedValueOfPlan[outerIndex]) {
                                                                setCheckedValueOfPlan(oldState => ({ ...oldState, [outerIndex]: items2?.endSubscriptionAmt || 0 }));
                                                            }
                                                        }

                                                        return (
                                                            (jsonforradiocheeckbox[outerIndex]?.value === true) ? (
                                                                <>
                                                                    <CustomRadio
                                                                        className="mt-2 fs-6"
                                                                        type="radio"
                                                                        name={`subscription-${items2?.subsPlanId}`}
                                                                        value={jsonforradiocheeckbox[outerIndex]?.selectedPlanIdd || ''}
                                                                        id={items2?.subtenantRateCardId}
                                                                        options={[labelvalue]}
                                                                        onChange={(e) => subscriptionradiofun(e, outerIndex)}
                                                                        isDisabled={isCeckboxRadioDisabled}
                                                                    />
                                                                    {konsole.log(isCeckboxRadioDisabled,"ksdkdskfkdfkdfkd")}
                                                                </>
                                                            ) : null
                                                        );
                                                    })}
                                                </Row>
                                            </div>
                                        );
                                    })}
                                </Row>
                            </Col>
                        </Row>
                        {(callerReference != "AccountSetting") && <Row className='borderBelow d-flex align-items-center pt-1 pb-2'>
                            <Col xs={12} md={12} xl={12} className='profilePortalSignOnLeft'>
                                <Row>
                                    <p className='paymentLabel mb-2'>Payment Starts On:
                                    <OverlayTrigger placement='bottom' overlay={<Tooltip style={{ width: "150px !important", zIndex: 9999 }}>Note: Future payments will be accepted between 7th to 365th day from the current date</Tooltip>}>
                                        <img src='/icons/information.png' style={{width: '15px', height: '15px'}} className="p-0 m-0 ms-2" />
                                    </OverlayTrigger>
                                    </p>
                                    {/* <p className='paymentLabel mb-2'>Starts On: &#x2a;</p> */}
                                </Row>
                                <Row className='useNewDesignSCSS d-flex align-items-center'>
                                    <Col>
                                        <CustomCalendar
                                            name="dateFunded"
                                            value={$AHelper.parseDateSafely(isNotValidNullUndefile(futureAuthorizeSubscriptionId) ? futurePaymentdate : isNotValidNullUndefile(paymentOrderId) ? orderIdStartOn : paymentDate)}
                                            onChange={(e) => { handleDateChange(e, 'setPaymentDate'); setIsConfirmed(false);}}
                                            future='show'
                                            futureLimit={364}
                                            startAfter={7}
                                            showToday={true}
                                            referencePage='AMA'
                                            type="default"
                                            placeholder="mm/dd/yyyy"
                                            isDisabled={isCeckboxRadioDisabled || (callerReference == "AccountSetting")}
                                            isAMAStartDate={true}
                                            allowFutureDate={true} 
                                        />
                                    </Col>
                                    {(isAmaPlanActive && authorizeSubscriptionId) && <Col>
                                        <div className='d-flex .custom-checkbox-setup'>
                                            <p className='label'>Auto Renew</p>
                                            <CustomCheckBox value={true} onChange={() => {}} isDisabled />
                                        </div>
                                    </Col>}
                                </Row>
                                {/* <>{konsole.log(formattedValidityFrom, "MMMMMMM", selectedDate,)}</> */}
                            </Col>
                            {((isNotValidNullUndefile(paymentDate)) && (isAmaPlanActive != true) ) && ( <Col xs={12} md={12} xl={12} className='profilePortalSignOnLeft py-2'>
                            <Row className={`p-2 p-0 ${isConfirmed ? "afterConfirmCont" : "confimationCont"}`}>
                                <p className="py-3 py-lg-4 mb-0 d-flex align-items-center justify-content-between">
                                    {/* <span>You selected <b>{formattedDate}</b> as your Payment Start Date. Please confirm</span> */}
                                    <span className='paymentConfirmation' title={`You selected ${paymentDate} as your Payment Start Date for Annual Maintenance Agreement. ${isConfirmed ? "" : "Please confirm"}`}>You selected <b>{paymentDate}</b> as your Payment Start Date for Annual Maintenance Agreement. {isConfirmed ? "" : "Please confirm"}</span>
                                    <Button className="theme-btn" onClick={handleConfirm}>
                                        {isConfirmed && <span className="checkmark pe-2">&#x2713;</span>}
                                        <span className="button-text">{isConfirmed ? "Confirmed" : "Confirm"}</span>
                                    </Button>
                                </p>
                            </Row>
                            </Col>)}
                        </Row>}
                    </Col>
                </Modal.Body>
                <Modal.Footer className='pt-0' >
                    {(addupdate == true && subsFileId !== '' && subsFileId !== null && subsFileId !== undefined) ?
                        <>
                            {(isAmaPlanActive) &&
                                <button className='border-0 shadow bg-white btn fw-bold'>Start Date: {orderIdStartOn}</button>
                            }
                            {(isAmaPlanActive) &&
                                <button className='border-0 shadow bg-white btn fw-bold me-auto '>Renew Date: {orderIdUpdatedOn}</button>
                            }
                            {(isAmaPlanActive) &&
                                <PdfViewDocument viewFileId={subsFileId} buttonName="Download" primaryName={props.clientData?.memberName} />
                            }
                        </>

                        : ""}

                    {(isAmaPlanActive || isConfirmed) && (   
                        <Button className="theme-btn " onClick={handleViewAMA}>
                            {(isAmaPlanActive) ? "View AMA" : "Proceed AMA"}    
                        </Button>
                    )}
                    <AnnualMaintanceAgreement
                        viewAMAModalOpen={viewAMAModalOpen}
                        setViewAMAModalOpen={setViewAMAModalOpen}
                        clientData={props?.clientData}
                        primaryName={isNotValidNullUndefile(props?.clientData?.memberName) ? props.clientData.memberName.charAt(0).toUpperCase() + props.clientData.memberName.slice(1) : ''}
                        spouseName={isNotValidNullUndefile(props?.clientData?.spouseName) ? props.clientData.spouseName.charAt(0).toUpperCase() + props.clientData.spouseName.slice(1) : ''}
                        attorneyName={isNotValidNullUndefile(selectattornetvalue) && selectattornetvalue.length > 0 ? selectattornetvalue[0]?.label.charAt(0).toUpperCase() + selectattornetvalue[0]?.label?.slice(1) : ''}
                        attorneyUserId={selectattornetvalue?.length > 0 ? selectattornetvalue[0]?.value : ''}
                        willBasedPlanAmount={subscriptionSubPlans}
                        checkedPlanValue={checkedValueOfPlan}
                        genereateViewPdf={genereateViewPdf}
                        jsonforradiocheeckbox={jsonforradiocheeckbox}
                        subscriptionId={props?.subscriptionId}
                        from="paralegal"
                        callerReference={callerReference}
                        dispatchloader={props.dispatchloader}
                        selectedDate={selectedDate}
                        formattedToday={formattedToday}
                        isPortalSignOn={props?.isPortalSignOn}
                        paymentDate={paymentDate}
                    />

                    <Button className="theme-btn" onClick={() => cancelbtn()}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
function getSubtenantRateCardDetails(_resultOfRateCard, _resultOfProduct) {
    return _resultOfRateCard?.flatMap(item =>
        item.applicableSubsModel?.flatMap(subModel =>
            subModel.subtenantRateCard?.filter(rateCard =>
                _resultOfProduct?.some(product =>
                    product.subtenantRateCardId == rateCard.subtenantRateCardId
                )
            ).map(rateCard => ({ subtenantRateCardId: rateCard.subtenantRateCardId, subsModalId: subModel?.subsModelId, endSubscriptionAmt: subModel?.endSubscriptionAmt }))
        )
    );
}

export default withFileCabinetParalegalPermissions(AnnualAgreemetModal, 'AnnualAgreementModal');
