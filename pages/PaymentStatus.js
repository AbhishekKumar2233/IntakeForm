import React, { useEffect, useState } from "react";
import { SET_LOADER } from "../components/Store/Actions/action";
import { $Service_Url } from "../components/network/UrlPath";
import { postApiCall, getApiCall, isNotValidNullUndefile, recurringErrorHandled } from "../components/Reusable/ReusableCom";
import { createFileCabinetFileAdd, cabinetFileCabinetId, specificFolderName, categoryFileCabinet, cretaeJsonForFilePermission, demo, intakeBaseUrl } from "../components/control/Constant";
import konsole from "../components/control/Konsole";
import { logoutUrl } from "../components/control/Constant";
import { Services } from "../components/network/Service";
import IsLoader from "../components/IsLoader";
import AlertToaster from "../components/control/AlertToaster";
import { useAppSelector } from "../component/Hooks/useRedux";
import { selectAgreement } from "../component/Redux/Store/selectors";
import { $AHelper } from "../component/Helper/$AHelper";
import { $AHelper as $oldhelper } from "../components/control/AHelper"; 
import { $JsonHelper } from "../component/Helper/$JsonHelper";

const PaymentStatus = () => {
    const [queryParams, setQueryParams] = useState(new URLSearchParams(''));
    const [logoUrl, setlogoUrl] = useState(null)
    const [orderId, setOrderId] = useState('')
    const [isLoader, setIsLoader] = useState(false)
    const { tempData } = useAppSelector(selectAgreement);
    const [ paymentStatus, setpaymentStatus ] = useState('');
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [subsGetData, setSubsGetData] = useState([])
    const [backClickCount, setBackClickCount] = useState(0);
    const returnUrlAfterPayment = `${intakeBaseUrl}PaymentStatus`;
    // const returnUrlAfterPayment = `http://localhost:3000/PaymentStatus`
    const [selectedDate, setSelectedDate] = useState('');
    const [userSubscriptionId, setUserSubscriptionId] = useState(null);
    const [subsPlansGetData, setPlansGetData] = useState([]) 
    const [legalTeamList, setLegalTeamList] = useState([])
    const [manageCreate, setManageCreate] = useState({ createdBy: loggedInUserId, createdOn: new Date().toISOString() })

    useEffect(() => {
        const queryString = window.location.search;
        const queryParams = new URLSearchParams(queryString);
        const trxnStatus = queryParams.get('TrxnStatus');
        const orderId = queryParams.get('OrderId')
        const isCallFromFuturePayment = queryParams.get('isCallFromFuturePayment') == "true";
        setOrderId(orderId)
        konsole.log(trxnStatus, orderId, "orderId")
        setQueryParams(queryParams);

        console.log("orderIdorderIdorderId", orderId)
        if ((isCallFromFuturePayment) || (isNotValidNullUndefile(orderId) && orderId != 0 && trxnStatus === 'SUCCESS')) {
            dispatchloader(true);
            const reference = sessionStorage.getItem('refrencePage');
            if (reference === 'FeeAgreement') {
                const feeAgreementHandler = funcForOrderIdUpdateFeeAgreement();
                if (feeAgreementHandler?.fetchAndProcessFileCabinet) {
                    feeAgreementHandler.fetchAndProcessFileCabinet();
                }
            } else {
                funcForOrderIdUpdate(orderId, (isCallFromFuturePayment));
            }
            dispatchloader(false);
        } else if (isNotValidNullUndefile(orderId) && (trxnStatus == 'INVALID' || trxnStatus == 'CANCELLED')) {
            dispatchloader(false);
            handleClearSearch();
            AlertToaster.error("Payment failed. Please try again.");
        } else {
            handleRetryPayment();
        };

    }, []);

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

    useEffect(() => {
        userLogo();
    }, []);

    useEffect(() => {
        const preventGoBack = () => {
            setBackClickCount(prevCount => prevCount + 1);

            if (backClickCount >= 1) {
                window.location.href = returnUrlAfterPayment;
            } else {
                AlertToaster.error("Warning: You cannot go back after payment. Please avoid pressing the back button to proceed smoothly.");
                window.history.pushState(null, "", window.location.href);
            }
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", preventGoBack);

        return () => {
            window.removeEventListener("popstate", preventGoBack);
        };
    }, [backClickCount]);

    const dispatchloader = (val) => {
        setIsLoader(val)
    }
    const userLogo = async () => {
        const subtenantId = sessionStorage.getItem("subtenantID")

        let subtenantObj = {
            subtenantId: subtenantId
        }
        const _resultAddUserOrder = await postApiCall('POST', $Service_Url.getSubtenantDetails, subtenantObj)
        console.log("_resultAddUserOrder", _resultAddUserOrder);
        if (_resultAddUserOrder) {
            setlogoUrl(_resultAddUserOrder?.data?.data[0]?.subtenantLogoUrl)
        }
    }

    const funcForOrderIdUpdateFeeAgreement = () => {
        const getSavedSubscriptionDetails = async (array, subtenantID, userID, subPlansList) => {
            konsole.log(subtenantID, userID, array, subPlansList, "ansz")
            let subscriptionId = 2;
            const _resultSubsDetails = await getApiCall("GET", $Service_Url.getUserSubscription + `${subtenantID}/${true}?SubscriptionId=${subscriptionId}&UserId=${userID}`);
            if (_resultSubsDetails == "err") return;
            konsole.log("_resultSubsDetails", _resultSubsDetails);
            setSubsGetData(_resultSubsDetails[0])
            setLoggedInUserId(_resultSubsDetails[0]?.createdBy)
            let userSubscriptionIds = _resultSubsDetails[0]?.userSubscriptionId;
            setUserSubscriptionId(userSubscriptionIds)
            let orderID = _resultSubsDetails[0]?.orderId;
            const attorneyDetails = {
                label: _resultSubsDetails[0]?.attorneyName || '',
                value: _resultSubsDetails[0]?.attorneyId || '',
            };
            sessionStorage.setItem("attorneyID", attorneyDetails.value);
            let isActive = true;
            if (_resultSubsDetails == 'err' || _resultSubsDetails.length == 0 || _resultSubsDetails[0]?.orderId == 0);
            const _resultPlansDetails = await getApiCall("GET", `${$Service_Url.getUserSubscriptionPlans}?UserSubscriptionId=${_resultSubsDetails[0]?.userSubscriptionId}&IsActive=${isActive}`);
            if (_resultPlansDetails == "err") return;
            konsole.log(_resultPlansDetails, "_resultPlansDetails");
            let userSubscriptionId = _resultPlansDetails[0]?.userSubscriptionId;
            setPlansGetData(_resultPlansDetails)
            setUserSubscriptionId(userSubscriptionId)
            const arrayData = array;
            konsole.log(arrayData, "arrayData")
            for (let value of _resultPlansDetails) {
                for (let i = 0; i < arrayData.length; i++) {
                    if (value.subsPlanId == arrayData[i].subsPlanId) {
                        arrayData[i].value = value.isActive;
                        arrayData[i].checkedputplanid = true;
                        arrayData[i].selectedPlanIdd = value?.subsPlanSKUMapId;
                        arrayData[i].subPlanGetId = value?.userSubsPlanId;
                        arrayData[i].subtenantRateCardId = value?.subtenantRateCardId;
                    }
                }
            }
            getCheckedValueOfPlan(array, subPlansList, userID, orderID)
            await fetchAttorneyUserList(subtenantID)
            await getUserAgreementDetails(userID, subscriptionId, userSubscriptionId);
            return _resultSubsDetails[0]
        }

        const getUserAgreementDetails = async (userID, subscriptionId, userSubscriptionId) => {
            const resolvedUserSubscriptionId = await subsPlansGetData[0]?.userSubscriptionId || userSubscriptionId;
            const _UserAgreementDetails = await getApiCall("GET", $Service_Url.getUserAgreement + `${userID}/${resolvedUserSubscriptionId}/${subscriptionId}`);
            konsole.log(_UserAgreementDetails, "_UserAgreementDetails")
            if (_UserAgreementDetails === "err" || (!_UserAgreementDetails?.length)) {
              return [];
            }
            return _UserAgreementDetails;
        };

        const getCheckedValueOfPlan = (subPlansList, array, userID, orderID) => {
            konsole.log("ejssjdsj", userID)
            if (!subPlansList || !array) return null;
            konsole.log(subPlansList, array, "subPlansList");
            let checkedValueOfPlan = null;
            if (subPlansList.length > 0 && array.length > 0 && orderID) {
                subPlansList.forEach((item, outerIndex) => {
                  if (subPlansList[outerIndex]?.value === true) {
                      array[0]?.subsPlanSKUs?.forEach((skuItem) => {
                          if (skuItem.subsPlanSKUMapId === subPlansList[outerIndex]?.selectedPlanIdd) {
                              checkedValueOfPlan = `${skuItem.endSubscriptionAmt}.00`;
                              konsole.log(checkedValueOfPlan,"sjnsjnsjn")
                          }
                      });
                    }
                });
            }
            return checkedValueOfPlan;
        }

        const fetchAttorneyUserList = async (subtenantID) => {
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

        const fetchAndProcessFileCabinet = async () => {
            const userID = sessionStorage.getItem("UserID");
            const jsonObjbelongsTo = { belongsTo: userID };
            dispatchloader(true);

            const _resultOfFileFolder = await postApiCall("POST", $Service_Url.getFileCabinetFolderDetails, jsonObjbelongsTo);
            console.log(_resultOfFileFolder, "_resultOfFileFolder");

            let _responseFolder = _resultOfFileFolder?.data?.data.filter(
                (item) =>
                    item.belongsTo == userID &&
                    item?.folderFileCategoryId == categoryFileCabinet[0] &&
                    item.folderCabinetId == cabinetFileCabinetId[0]
            );

            funForAfterPaymentUpdate(userID, _responseFolder)
        };

        const funForAfterPaymentUpdate = async (userID, allFolderList) => {
            konsole.log(userID, allFolderList,"fgfkgfgkfgkfgfkg")
            const fileId = sessionStorage.getItem('nonCrisisFileId');
            const subtenantID = sessionStorage.getItem("SubtenantId") || 2;
            const loginUserID = sessionStorage.getItem("loggedUserId");
            const result = await getSavedSubscriptionDetails([], subtenantID, userID, []);
            konsole.log("_resultOfSavedSubs", result);
            if (allFolderList) {
                await addFileCabinet(fileId, userID, loginUserID, allFolderList);
                if (allFolderList && result) {
                    await updateUserSubscription(fileId, result);
                    const [userProfile] = await Promise.all([
                        getApiCall('GET', $Service_Url.get_UserProfileDetailsByUserId + userID),
                    ]);
                    konsole.log("_resultOfUserProfile", userProfile);
                    const { customerProfileId, cards } = userProfile[0];
                    const defaultCard = cards?.find(card => card.isDefault) || cards?.[0] || null;
                    await addUserRecurringSubscription(result, customerProfileId, defaultCard, userID);
                }
            }
        }

        const updateUserSubscription = async (fileId, result) => {
            const getSession = (key) => sessionStorage.getItem(key);
            const userID = result?.memberId ? result?.memberId : getSession("UserID"),
            selectAttorneyId = getSession("attorneyID") ? getSession("attorneyID") : sessionStorage.getItem('attorneyID'),
            subtenantID = result?.subtenantId ? result?.subtenantId : getSession("SubtenantId") ? getSession("SubtenantId") : getSession("subtenantID"),
            loggedInUserID = loggedInUserId ? loggedInUserId : getSession("loggedUserId"),
            orderIDFromUrl = getSession("orderIDFromUrl") || getSession("orderID"),
            orderID = orderId ? orderId : orderIDFromUrl;
            const validityFromDate = selectedDate
                ? new Date(selectedDate + "T00:00:00")
                : result?.validityFrom
                    ? result?.validityFrom
                    : new Date();
            const futurePayDate = result?.futurePayDate ?? null;
            const totalAmount = result?.totalAmount ?? 0;
            const totalPaid = result?.totalPaid;
            const totalDiscount = result?.totalDiscount ?? 0;
            dispatchloader(true);
            const commonParams = { userId: userID, selectAttorneyId, result, showHourlyBody : result?.isHourly, showFlatFeeBody : result?.isFlatFee, selectedDate: validityFromDate, validityFromDate, subtenantId: subtenantID, fileId, loggedInUserId: loggedInUserID, futurePayDate, totalAmount, totalPaid, totalDiscount };
            const UpdateUserSubscriptionJson = $JsonHelper.createUpdateUserSubscriptionJson(orderIDFromUrl ? { ...commonParams, orderId: orderID, futurePayDate, totalAmount, totalPaid, totalDiscount } : commonParams);
            konsole.log("UpdateUserSubscriptionJson", JSON.stringify(UpdateUserSubscriptionJson));
            const _resultOfUserSubscriptionUpdate = await postApiCall("PUT", $Service_Url.putUserSubUpdate, UpdateUserSubscriptionJson, "");
            dispatchloader(false);
            let  usersubsID = _resultOfUserSubscriptionUpdate?.data?.data;
            setUserSubscriptionId(usersubsID);
            konsole.log("_resultOfUserSubscriptionUpdate", _resultOfUserSubscriptionUpdate);
        }

        const addFileCabinet = async (fileId, userID, loginUserID, allFolderList) => {
            let fileCategoryId = 6;
            let fileTypeId = 59;
            let belongsTo = [{ "fileBelongsTo": userID }]
            let feeAgreementOtherForms = allFolderList?.filter((item) => item?.folderName == specificFolderName[4]);
            let currentFolder = allFolderList?.filter(({ folderName, parentFolderId }) => parentFolderId == feeAgreementOtherForms[0].folderId && folderName == specificFolderName[2])
            let currentFeeAgreeFolderId = currentFolder[0]?.folderId
            let postJson = createFileCabinetFileAdd({ cabinetId: cabinetFileCabinetId[0], belongsTo, fileUploadedBy: loginUserID, fileCategoryId, folderId: Number(currentFeeAgreeFolderId), fileId, fileStatusId: 2, fileTypeId, primaryUserId: userID, isShared: true, isActive: true, isMandatory: true, isFolder: false, isCategory: false, })
            return new Promise(async (resolve, reject) => {
                const _resultAddFile = await postApiCall('POST', $Service_Url.postAddFileCabinet2, postJson);
                if (_resultAddFile != 'err') {
                    await filePermissionsApi(userID, fileId);
                    resolve('resolve');
                } else {
                    resolve('err')
                }
            })
        }

        const filePermissionsApi = async (userID, fileId) => {
            dispatchloader(true)
            let result = legalTeamList.length > 0 ? legalTeamList : await fetchAttorneyUserList();
            konsole.log(legalTeamList, "legalTeamList", result)
            if (result !== 'err') {
                let permissionArr = []
                for (let j = 0; j < result?.length; j++) {
                    const newObj = cretaeJsonForFilePermission({ fileId: fileId, belongsTo: userID, primaryUserId: userID, sharedUserId: result[j].userId, isActive: true, isDelete: false, isEdit: false, isRead: true, ...manageCreate })
                    permissionArr.push(newObj)
                }
                dispatchloader(true)
                konsole.log('', permissionArr)
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
            const subtenantId = sessionStorage.getItem("subtenantID")
            let Result = (Array.isArray(subsGetData) && subsGetData.length > 0)
              ? subsGetData
              : await getSavedSubscriptionDetails([], subtenantId, userID, []);
        
            if (!Result || (Array.isArray(Result) && Result.length === 0)) Result = result;
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
            dispatchloader(true)
            const isCardValid = $oldhelper.isValidExpiry(cardDetails.expireDate, Result?.futurePayDate);
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
            dispatchloader(false)
        }
        handleClearSearch();
        dispatchloader(false);
        return { fetchAndProcessFileCabinet };
    }

    const funcForOrderIdUpdate = async (orderId, isCallFromFuturePayment) => {
        const externalvalues = isCallFromFuturePayment ? tempData : {};
        const subtenantID = sessionStorage.getItem("subtenantID");
        const userID = sessionStorage.getItem("userID");
        const subscriptionID = 1;
        dispatchloader(true)
        const _resultOrderIdDetails = await getApiCall("GET", $Service_Url.getUserSubscription + `${subtenantID}/${true}?SubscriptionId=${subscriptionID}&UserId=${userID}`);
        konsole.log("_resultOrderIdDetails", _resultOrderIdDetails);
        dispatchloader(false)
        if (_resultOrderIdDetails == 'err' || _resultOrderIdDetails.length < 0) return;

        const { userId, attorneyId, isActive, subsStatusId, subscriptionId, subtenantId, skuListId, userSubscriptionId, subsFileId, userLinkId, updatedBy, validityFrom , futureAuthorizeSubscriptionId } = _resultOrderIdDetails[0];

        dispatchloader(true)
        const amaDocFileId = sessionStorage.getItem('amaDocFileId');
        const validityToDate = new Date(validityFrom);
        validityToDate.setFullYear(validityToDate.getFullYear() + 1);
        const validityTo = $oldhelper.getFormattedDate(validityToDate);

        const jsonObjForUpsert = {
            "userId": userId, "attorneyId": attorneyId, "isActive": isActive,
            "subsStatusId": subsStatusId, "skuListId": isNotValidNullUndefile(skuListId) ? skuListId : 0,
            "subscriptionId": subscriptionId, "subtenantId": subtenantId,
            "userSubscriptionId": userSubscriptionId, "subsFileId": isNotValidNullUndefile(amaDocFileId) ? amaDocFileId : subsFileId,
            "userLinkId": isNotValidNullUndefile(userLinkId) ? userLinkId : 0, "orderId": Number(orderId), "updatedBy": attorneyId, "validityFrom": validityFrom,
            "validityTo": validityTo,
            futurePayDate: isCallFromFuturePayment ? externalvalues?.futurePayDate : "",
        };
        konsole.log("jsonObjForUpsert", jsonObjForUpsert);
        const _userLinkId = sessionStorage.getItem('userLinkID');
        const _linkStatusID = 4;
        const jsonObjForUserLink = {
            "userId": userId, "linkStatusId": _linkStatusID, "subtenantId": subtenantID,
            "updatedBy": userId, "userLinkId": _userLinkId, "validityFrom": validityFrom,
        };
        konsole.log("jsonObjForUserLink", jsonObjForUserLink);

        dispatchloader(true);
        const _resultUpsertUserSubscription = await postApiCall('PUT', $Service_Url.putUserSubUpdate, jsonObjForUpsert);
        konsole.log("_resultUpsertUserSubscription", _resultUpsertUserSubscription);
        dispatchloader(false)

        // const _resultUpsertUserLink = await postApiCall('PUT', $Service_Url.putuserLinksUpdate, jsonObjForUserLink);
        // konsole.log("_resultUpsertUserLink", _resultUpsertUserLink);

        {
            const jsonObjbelongsTo = { belongsTo: userID }
            dispatchloader(true);
            const _resultOfFileFolder = await postApiCall("POST", $Service_Url.getFileCabinetFolderDetails, jsonObjbelongsTo);
            konsole.log(_resultOfFileFolder, "_resultOfFileFolder");
            let _responseFolder = _resultOfFileFolder?.data?.data.filter((item) => item.belongsTo == userID && item?.folderFileCategoryId == categoryFileCabinet[0] && item.folderCabinetId == cabinetFileCabinetId[0]);
            konsole.log(_responseFolder, "_responseFolder");
            const _resultAddUserFileCabinetAdd = await apiCallUserFileCabinetAdd(jsonObjForUpsert.subsFileId, userID, _responseFolder);
            konsole.log("_resultAddUserFileCabinetAdd", _resultAddUserFileCabinetAdd);
            {
                    // Blok of Create Subscription for auto detection-------------
                    const _resultUserSubscription = _resultOrderIdDetails
                    dispatchloader(true)
                    const _resultOfSubsModel = await getApiCall('GET', $Service_Url.get_subsModelForPaymentTime);  //for GET subsModal details 
                    const _resultOfRateCard = await getApiCall('GET', $Service_Url.get_RateCard + `?IsActive=${true}&$subtenantId=${subtenantId}`); //for GET rate card details 
                    const _resultOfUserProfile = await getApiCall('GET', $Service_Url.get_UserProfileDetailsByUserId + userID); // for get userProfile  Details
                    dispatchloader(false)
                    konsole.log("_resultOfUserProfile", _resultOfUserProfile, _resultOfRateCard, _resultUserSubscription, _resultOfSubsModel);
                    if (_resultUserSubscription != 'err') {
                        const { userSubscriptionId, userId } = _resultUserSubscription[0]
                        dispatchloader(true)
                        const _resultOfOrderinfo = isNotValidNullUndefile(orderId) ? await getApiCall('GET', $Service_Url.get_Order_Info + '/' + userId + '/' + orderId, '') : "err"; // for GEt details of order info
                        konsole.log("_resultOfOrderinfo", _resultOfOrderinfo)
                        const _filterValue = getSubtenantRateCardDetails(_resultOfRateCard, isCallFromFuturePayment ? externalvalues?.subscriptionPlans : _resultOfOrderinfo?.order?.productList)?.filter((item) => item.subsModalId != 4 && item?.subsModalId != 5);
                        dispatchloader(false)
                        konsole.log("_filterValue", _filterValue);

                        if (isCallFromFuturePayment || (_filterValue?.length > 0 && _resultOfUserProfile?.length > 0 && _resultOfUserProfile !='err')) {
                            dispatchloader(true)
                            const { customerProfileId, cards } = _resultOfUserProfile[0];
                            const lastlyUsedCard = cards?.filter(ele => isCallFromFuturePayment ? ele?.paymentProfileId == externalvalues?.paymentProfileId : ele?.isDefault == true);
                            const _amount = _filterValue?.reduce((acc, current) => acc + current?.endSubscriptionAmt, 0)
                            const _discount = _filterValue?.reduce((acc, current) => acc + (current?.endSubscriptionDisc || 0), 0);
                            const finalOrderId = _resultOfOrderinfo?.order?.orderId || orderId;
                            const payScheduleVal = (_resultOfSubsModel || [])?.filter(item => item?.value == (_filterValue[0]?.subsModalId))?.map(item => item?.label?.split(" "))?.map(([length, unit]) => ({ length: length || 0, unit: unit || 'days' })).shift();

                            konsole.log("payScheduleVal", payScheduleVal)
                            const cardDetails = lastlyUsedCard?.length > 0 ? lastlyUsedCard[0] : ''
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
                            konsole.log("jsonObjOfCreateSubs", jsonObjOfCreateSubs, JSON.stringify(jsonObjOfCreateSubs))

                            if($oldhelper.isValidExpiry(cardDetails.expireDate, validityTo) != true) {
                                if(isCallFromFuturePayment) setpaymentStatus(`Payment scheduled successfully for ${$AHelper.$getDateFormatted($oldhelper.parseDateSafely(externalvalues?.futurePayDate ?? ""))}. However, unable to schedule auto-renewal as your card will expire before the renewal date. Please proceed to login to view the document in your file cabinet.`)
                                else AlertToaster.error(`Unable to schedule auto-renewal as your card will expire before the renewal date.`);
                            } else {
                                const _resultOfCreateSubs = await recurringErrorHandled(jsonObjOfCreateSubs);
                                konsole.log("_resultOfCreateSubs", _resultOfCreateSubs)
                                if(isCallFromFuturePayment) setpaymentStatus(`Payment scheduled successfully for ${$AHelper.$getDateFormatted($oldhelper.parseDateSafely(externalvalues?.futurePayDate ?? ""))}. Please proceed to login to view the document in your file cabinet.`);
                            }

                            dispatchloader(false)

                        }
                    }
            }

        }
        handleClearSearch();
        dispatchloader(false);
    };

    const handleClearSearch = () => {
        const newURL = window.location.pathname
        konsole.log("newURL", newURL)
        window.history.pushState({ path: newURL }, '', newURL);
    }

    const apiCallUserFileCabinetAdd = async (fileId, userID, allFolderList) => {
        const attorneyID = sessionStorage.getItem("attorneyID")
        konsole.log(allFolderList, "userIDuserIDuserID")
        let fileCategoryId = 6;
        let fileTypeId = 64;
        let belongsTo = [{ "fileBelongsTo": userID }]
        let feeAgreementNOtherForms = allFolderList?.filter((item) => item?.folderName == specificFolderName[4]);
        let currentFolderId = allFolderList?.filter(({ folderName, parentFolderId, folderId }) => parentFolderId == feeAgreementNOtherForms[0].folderId && folderName == specificFolderName[2])
        let currentFeeAgreeFolderId = currentFolderId[0]?.folderId
        let postJson = createFileCabinetFileAdd({ cabinetId: cabinetFileCabinetId[0], belongsTo: belongsTo, fileUploadedBy: allFolderList[0]?.folderCreatedBy, fileCategoryId, folderId: Number(currentFeeAgreeFolderId), fileId, fileStatusId: 2, fileTypeId, primaryUserId: userID, isShared: true, isActive: true, isMandatory: true, isFolder: false, isCategory: false, })
        return new Promise(async (resolve, reject) => {
            const _resultAddFile = await postApiCall('POST', $Service_Url.postAddFileCabinet2, postJson);
            if (_resultAddFile != 'err') {
                await callFilePermissionsApi(userID, fileId, attorneyID);
                resolve('resolve');
            } else {
                resolve('err')
            }
        })
    }

    const callFilePermissionsApi = async (userID, fileId, attorneyID) => {
        const roleID = sessionStorage.getItem("checkIsRoleID")
        konsole.log(roleID, "checkIsRoleIDcheckIsRoleIDcheckIsRoleID")
        const newObj = [cretaeJsonForFilePermission({ fileId: Number(fileId), roleId: roleID, belongsTo: userID, primaryUserId: userID, sharedUserId: attorneyID, isActive: true, isDelete: true, isEdit: true, isRead: true, createdBy: attorneyID })]
        konsole.log('permissionArrpermissionArr', newObj);
        return new Promise((resolve, reject) => {
            Services.upsertShareFileStatus(newObj).then((res) => {
                konsole.log('res of upsert file share', res);
                resolve('resolve');
            }).catch((err) => {
                konsole.log('err in upsert sharefile', err);
                resolve('err');
            });
        });
    }

    const handleGoToLoginPage = () => {
        window.location.href = `${logoutUrl}account/Signin`;
    };
    const handleRetryPayment = () => {
        const uniqueLinkURL = sessionStorage.getItem("uniqueLinkURL")
        window.location.href = uniqueLinkURL;
    };

    return (
        <>
            {isLoader && <IsLoader />}
            <div className="paymentStatus">
                <div className="d-flex flex-column align-items-center justify-content-center bg-white py-4" style={{ height: '100vh', paddingLeft: '100px', paddingRight: '100px' }}>
                    <div style={{ boxShadow: 'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset', height: '100%', position: 'relative' }}>
                        <div style={{ backgroundColor: '#fff', height: '75px' }}>
                            <div className="ms-2 d-flex justify-content-center" style={{ height: '100px' }}>
                                {isNotValidNullUndefile(logoUrl) && (
                                    <img style={{ height: '100%' }} src={logoUrl} alt="Logo" />
                                )}
                            </div>
                        </div>
                        <div className="d-flex-column justify-content-center align-items-center text-center m-5 py-5">
                            {queryParams.get("TrxnStatus") === "SUCCESS" && (
                                <div className="m-5 p-5" style={{ color: 'black' }}>
                                    <p className="fs-1 mb-3 text-uppercase fw-bold">Payment Status</p>
                                    <p className="fs-5 mb-3 fw-light">Payment received successfully. Please proceed to login to view the document in your file cabinet.</p>
                                    <button className="theme-btn mt-3" style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }} onClick={handleGoToLoginPage}>Proceed to Login</button>
                                </div>
                            )}
                            {queryParams.get("TrxnStatus") == "CANCELLED" && (
                                <div className="m-5 p-5" style={{ color: 'black' }}>
                                    <p className="fs-1 mb-3 text-uppercase fw-bold">Payment Status</p>
                                    <p className="fs-5 mb-3 fw-light">Payment declined !</p>
                                    <button className="theme-btn mt-3" style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }} onClick={handleRetryPayment}>Try Again</button>
                                </div>
                            )}
                            {queryParams.get("TrxnStatus") === "FAILED" && (
                                <div className="m-5 p-5" style={{ color: 'black' }}>
                                    <p className="fs-1 mb-3 text-uppercase fw-bold">Payment Status</p>
                                    <p className="fs-5 mb-3 fw-light">Payment failed !</p>
                                    <button className="theme-btn mt-3" style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }} onClick={handleRetryPayment}>Try Again</button>
                                </div>
                            )}
                            {(queryParams.get('isCallFromFuturePayment') == "true") && (
                                <div className="m-5 p-5" style={{ color: 'black' }}>
                                    <p className="fs-1 mb-3 text-uppercase fw-bold">Payment Status</p>
                                    <p className="fs-5 mb-3 fw-light">{paymentStatus ? paymentStatus : 'Pending'}</p>
                                    {paymentStatus?.includes("success") ?
                                    <button className="theme-btn mt-3" style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }} onClick={handleGoToLoginPage}>Proceed to Login</button>
                                    : paymentStatus ? <button className="theme-btn mt-3" style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }} onClick={handleRetryPayment}>Try Again</button> : <></>}
                                </div>
                            )}
                        </div>
                        <div class="my-1 pt-2 mt-4" style={{ backgroundColor: 'rgb(73, 73, 73)', color: '#fff', position: 'absolute', bottom: '20px', width: '100%' }}>
                            <div class="brand-aging-options 
                    display-4 d-flex justify-content-center">
                                <p class="h5">Powered By</p>
                            </div>
                            <div class="d-flex justify-content-center">
                                <img src="./images/logo-footer.png" alt="brandAgingOptions" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

function getSubtenantRateCardDetails(_resultOfRateCard, _resultOfProduct) {
    return _resultOfRateCard.flatMap(item =>
        item.applicableSubsModel.flatMap(subModel =>
            subModel.subtenantRateCard.filter(rateCard =>
                _resultOfProduct.some(product =>
                    product.subtenantRateCardId == rateCard.subtenantRateCardId
                )
            ).map(rateCard => ({ subtenantRateCardId: rateCard.subtenantRateCardId, subsModalId: subModel?.subsModelId, endSubscriptionAmt: subModel?.endSubscriptionAmt }))
        )
    );
}



export default PaymentStatus;