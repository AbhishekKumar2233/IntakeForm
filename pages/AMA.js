import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { intakeBaseUrl, AoPaymentUrl } from "../components/control/Constant";
import konsole from "../components/control/Konsole";
import { $getServiceFn } from "../components/network/Service";
import { $Service_Url } from "../components/network/UrlPath";
import Alert from "react-bootstrap/Alert";
import { $AHelper } from "../components/control/AHelper";
import { getApiCall, getApiCall2, isNotValidNullUndefile, postApiCall } from "../components/Reusable/ReusableCom";
import AnnualMaintanceAgreement from "../components/paralLegalComponent/Datatable/AnnualMaintanceAgreement";
import { createJsonUploadFileV2 } from "../components/control/Constant";
import { postUploadUserDocumant } from "../components/Reusable/ReusableCom";
import AmaOrderSummary from "../components/paralLegalComponent/Datatable/AMA/AmaOrderSummary";
import IsLoader from "../components/IsLoader";

const AMA = () => {
    const [linkvalidate, setLinkValidate] = useState();
    const [confirmOrderId, setConfirmOrderId] = useState();
    const [attorneyName, setAttorneyName] = useState("");
    const [primaryName, setPrimaryName] = useState("");
    const [spouseName, setSpouseName] = useState("");
    const [subscriptionPlan, setSubscriptionPlans] = useState([]);
    const [jsonforradiocheeckbox, setjsonforradiocheeckbox] = useState([]);
    const [attorneyID, setAttorneyID] = useState("");
    const [uploadUserID, setUploadUserID] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [subscriptionAmount, setSubscriptionAmount] = useState([]);
    const [checkedValueOfPlan, setCheckedValueOfPlan] = useState({0: "", 1: ""})
    const [planDetails, setPlanDetails] = useState([]);
    const [viewAMAModalOpen, setViewAMAModalOpen] = useState(false);
    const [uniqueLinkKey, setUniqueLinkKey] = useState('');
    const [orderId, setorderId] = useState('');
    const [subtenantRateCardId, setSubtenantRateCardId] = useState('');
    const [clientUserId, setClientUserId] = useState('')
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [isLoader,setIsLoader]=useState(false);
    const [paymentDate, setPaymentDate] = useState("");
    const [clientFullDetails, setclientFullDetails] = useState({});

    useEffect(() => {
        const queryString = window.location.search;

        const UID = $AHelper.getQueryParameters(queryString, 'UID');
        const Stage = $AHelper.getQueryParameters(queryString, 'Stage');
        const Linktype = $AHelper.getQueryParameters(queryString, 'Linktype');
        // const authLink = $AHelper.getQueryParameters(queryString, 'XXYZ');

        // if(authLink){
        //     sessionStorage.setItem("AuthToken",authLink);
        // }
        konsole.log(UID, "iASDJNIQdnasj");

        if (isNotValidNullUndefile(UID) && isNotValidNullUndefile(Stage) && isNotValidNullUndefile(Linktype) && Linktype !== "null") {
            let result = $getServiceFn.userValidateLinks({ LinkStatusId: 1, UniqueLinkKey: window.atob(UID), LinkTypeId: window.atob(Linktype) });
            result.then((res) => {
                konsole.log(res, "userValidateLinksAMA");
                setLinkValidate(false);
                let response = res?.data?.data;
                konsole.log("userValidateLinks", response);
                sessionStorage.setItem("uniqueLinkURL", res?.data?.data[0]?.uniqueLinkURL)
                const userId = res?.data?.data[0]?.userId;
                let subtenantID = res?.data?.data[0]?.subtenantId;
                sessionStorage.setItem("subtenantID", res?.data?.data[0]?.subtenantId)
                sessionStorage.setItem("userLinkID", res?.data?.data[0]?.userLinkId)
                konsole.log(res?.data?.data[0]?.userLinkId, "userLinkIduserLinkId")
                konsole.log(userId, "ADSAJHJDsdsdjdasj");
                setClientUserId(userId)
                getFullDetails(userId)
                fetchPrimaryMemberDetailsById(userId);
                fetchSubscriptionDetailsfun(subtenantID, userId)
                setUniqueLinkKey(window.atob(UID));
            }).catch((err) => {
                setLinkValidate(true);
                konsole.log("userValidateLinks", err);
            }).finally(() => {
                konsole.log("userValidateLinks");
            });
        }

        return () => {
            konsole.log("Component unmounted");
        };
    }, []);

    const fetchPrimaryMemberDetailsById = async (userId) => {
        sessionStorage.setItem("userID", userId)
        konsole.log("userID", userId)
        if (!userId) return;
        let _resultOfGetPrimary = await getApiCall("GET", $Service_Url.getFamilyMemberbyID + userId, "");
        konsole.log("_resultOfGetPrimary", _resultOfGetPrimary);
        if (_resultOfGetPrimary == "err") return;
        let responseData = _resultOfGetPrimary?.member;
        const firstName = isNotValidNullUndefile(responseData.fName) ? responseData.fName : '';
        const middleName = isNotValidNullUndefile(responseData.mName) ? responseData.mName : '';
        const lastName = isNotValidNullUndefile(responseData.lName) ? responseData.lName : '';
        setPrimaryName(`${firstName} ${middleName} ${lastName}`);
        let spouseId = responseData.spouseUserId;

        if (responseData?.maritalStatusId == 1 || responseData?.maritalStatusId == 2) {
            konsole.log(spouseId, "spo")
            let _resultOfGetSpouse = await getApiCall("GET", $Service_Url.getFamilyMemberbyID + spouseId, "");
            konsole.log("_resultOfGetSpouse", _resultOfGetSpouse);
            if (_resultOfGetSpouse == "err") return;
            let responseData = _resultOfGetSpouse?.member;
            const firstName = isNotValidNullUndefile(responseData.fName) ? responseData.fName : '';
            const middleName = isNotValidNullUndefile(responseData.mName) ? responseData.mName : '';
            const lastName = isNotValidNullUndefile(responseData.lName) ? responseData.lName : '';
            setSpouseName(`${firstName} ${middleName} ${lastName}`);
        }
    };

    const getFullDetails = async ( userId ) => {
        if(!userId) return {}; 
        let _resultOfGetClient = await getApiCall("GET", $Service_Url.getUserbyId + userId, "");
        konsole.log("_resultOfGetClient", _resultOfGetClient);

        setclientFullDetails(_resultOfGetClient)
    }

    const fetchSubscriptionDetailsfun = async (subtenantID, userId) => {
        const subscriptionID = 1;
        let url =
            $Service_Url.getSubscriptionDetails + subtenantID + "/" + subscriptionID;
        const _resultOfSubscription = await getApiCall("GET", url, "");
        konsole.log("_resultOfSubscription", _resultOfSubscription);
        if (_resultOfSubscription != "err" && _resultOfSubscription.length > 0) {
            let subPlansList = _resultOfSubscription[0]?.subsPlans;
            setSubscriptionPlans(subPlansList);
            let subscriptionAmount = [];
            setSubscriptionAmount(subscriptionAmount);
            let array = []
            for (let [index, value] of subPlansList.entries()) {
                let results = createjsonforcheckboxradio(index, value.subsPlanId);
                array.push(results)
            }
            konsole.log("valuevlaue", array)
            getSavedSubscriptionDetails(array, subtenantID, userId, subPlansList)
        }
    };

    //   fetchUserSubscriptionDetails

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const monthNames = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];
        const month = monthNames[date.getMonth()];
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    };

    const today = new Date();
    const formattedToday = formatDate(today);

    const getSavedSubscriptionDetails = async (array, subtenantID, userId, subscriptionAmount) => {
        konsole.log(array, subtenantID, userId, subscriptionAmount, "asdnkzxcmweasfnklCZ");
        let subscriptionId = 1;
        const _resultSubsDetails = await getApiCall("GET", $Service_Url.getUserSubscription + `${subtenantID}/${true}?SubscriptionId=${subscriptionId}&UserId=${userId}`);
        konsole.log("_resultSubsDetails", _resultSubsDetails);
        if (_resultSubsDetails == 'err' || _resultSubsDetails.length == 0) return setConfirmOrderId("err");
        let attorneyName = _resultSubsDetails[0]?.attorneyName;
        let attorneyID = _resultSubsDetails[0]?.attorneyId;
        let uploadUserID = _resultSubsDetails[0]?.userId;
        let confirmOrderId = $AHelper.isPositiveNumber(_resultSubsDetails[0]?.orderId) ? _resultSubsDetails[0]?.orderId : null;
        let futureAuthorizeSubscriptionId = $AHelper.isPositiveNumber(_resultSubsDetails[0]?.futureAuthorizeSubscriptionId) ? _resultSubsDetails[0]?.futureAuthorizeSubscriptionId : null;
        let validity = _resultSubsDetails[0]?.validityFrom;
        let _paymentDate = _resultSubsDetails[0]?.futurePayDate;
        let _selectedDate = validity ? formatDate(validity) : undefined;
        setConfirmOrderId(confirmOrderId || futureAuthorizeSubscriptionId || null);
        sessionStorage.setItem("attorneyID", _resultSubsDetails[0]?.attorneyId)
        setAttorneyName(attorneyName);
        setAttorneyID(attorneyID);
        setUploadUserID(uploadUserID);
        setSelectedDate(_selectedDate);
        setPaymentDate(_paymentDate);
        let isActive = true;
        // const _resultPlansDetails = await getApiCall("GET", `${$Service_Url.getUserSubscriptionPlans}/${_resultSubsDetails[0]?.userSubscriptionId}/${isActive}`);
        const _resultPlansDetails = await getApiCall("GET", `${$Service_Url.getUserSubscriptionPlans}?UserSubscriptionId=${_resultSubsDetails[0]?.userSubscriptionId}&IsActive=${isActive}`);
        konsole.log(_resultPlansDetails, "_resultPlansDetails");

        let planDetails = _resultPlansDetails;
        setPlanDetails(planDetails);

        const arrayData = array;
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

        const valueOfPlanIndex = {};
        arrayData.forEach((item, index) => {
            if (item.value) {
                let endSubscriptionAmt = 0;
                subscriptionAmount.forEach(subs => {
                    const foundPlan = subs.subsPlanSKUs?.find(ele => item.selectedPlanIdd === ele.subsPlanSKUMapId);
                    if (foundPlan) {
                        endSubscriptionAmt = foundPlan.endSubscriptionAmt || 0;
                    }
                });
                valueOfPlanIndex[index] = endSubscriptionAmt;
            } else {
                valueOfPlanIndex[index] = 0;
            }
        });

        setCheckedValueOfPlan(valueOfPlanIndex);
        setjsonforradiocheeckbox(arrayData);
        getRoleID(attorneyID);
        konsole.log("arrayData", valueOfPlanIndex, arrayData);
    }

    const getRoleID = async (attorneyID) => {
        const _resultMemberDetails = await getApiCall2("GET", $Service_Url.getUserDetailsByUserEmailId + `?UserId=${attorneyID}`);
        console.log("_resultMemberDetails", _resultMemberDetails)
        if (_resultMemberDetails == 'err') return;
        if (_resultMemberDetails?.data.length > 0) {
            const roleIds = _resultMemberDetails.data[0].roleDetails.map(role => role.roleId.toString());
            const allowedRoleIds = ["3", "13", "14", "15"];
            const checkIsRoleID = roleIds.find(roleId => allowedRoleIds.includes(roleId));
            console.log("checkIsRoleID", checkIsRoleID);
            sessionStorage.setItem("checkIsRoleID", checkIsRoleID);
        }
    }

    const genereateViewPdf = async (fileDetails) => {
        konsole.log("ABfileDetails", fileDetails);
        isLoaderCheck(true)
        const jsonObj = createJsonUploadFileV2({ UserId: uploadUserID, File: fileDetails[0], UploadedBy: uploadUserID, FileTypeId: 64, FileCategoryId: 6, FileStatusId: 2, UserFileName: primaryName + ' - Annual Maintenance Agreement',DateFinalized: selectedDate && typeof selectedDate === 'string' ? selectedDate.split("T")[0] : selectedDate instanceof Date ? selectedDate.toISOString().split("T")[0] : ''});
        konsole.log("jsonObj2", jsonObj);
        const _resultUploadFile = await postUploadUserDocumant(jsonObj);
        konsole.log("_resultUploadFile", _resultUploadFile);
        isLoaderCheck(false)
        if (_resultUploadFile == 'err') return;
        sessionStorage.setItem("amaDocFileId", _resultUploadFile?.fileId)
        handleIsPayment()
    }

    const isLoaderCheck = (val) => {
        setIsLoader(val)
    }
    
    const clientData = {
        memberId: clientUserId,
        ...clientFullDetails,
        loginUserId: clientFullDetails?.id
    }

    const handleIsPayment = () => {
        setIsPaymentOpen(prev => !prev)

    }


    return (
        <>   
        {isLoader &&   <IsLoader /> }
            <div className="bg-white">

                {linkvalidate == true && (
                    <div
                        className="container d-flex justify-content-center align-items-center"
                        style={{ minHeight: "100vh" }}
                    >
                        <div className="col-lg-6 col-md-8 col-sm-10">
                            <Alert variant="danger">
                                <Alert.Heading>The link you followed has expired or Invalid !</Alert.Heading>
                                <p>Please try again</p>
                            </Alert>
                        </div>
                    </div>
                )}
                {linkvalidate == false && (
                    <>
                        {(confirmOrderId === null || confirmOrderId === "err") && (
                            <>
                                <AnnualMaintanceAgreement
                                    viewAMAModalOpen={true}
                                    setViewAMAModalOpen={setViewAMAModalOpen}
                                    primaryName={primaryName}
                                    spouseName={spouseName}
                                    willBasedPlanAmount={subscriptionPlan}
                                    attorneyName={attorneyName}
                                    jsonforradiocheeckbox={jsonforradiocheeckbox}
                                    checkedPlanValue={checkedValueOfPlan}
                                    attorneyUserId={attorneyID}
                                    genereateViewPdf={genereateViewPdf}
                                    from="link"
                                    dispatchloader={isLoaderCheck}
                                    selectedDate={selectedDate}
                                    formattedToday={formattedToday}
                                />

                                {(isPaymentOpen) &&
                                    <AmaOrderSummary
                                        dispatchloader={isLoaderCheck}
                                        clientData={clientData}
                                        subscriptionId={1}
                                        subscriptionSubPlans={subscriptionPlan}
                                        show={isPaymentOpen}
                                        handleIsShow={handleIsPayment}
                                        refrencePage='AMA'
                                        uploadUserID={uploadUserID}
                                        paymentDate={paymentDate}
                                    />
                                }
                            </>
                        )}
                        {isNotValidNullUndefile(confirmOrderId) && (
                            <>
                                <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                                    <div className="col-lg-6 col-md-8 col-sm-10">
                                        <Alert variant="warning">
                                            <Alert.Heading>You have already taken a subscription.</Alert.Heading>
                                            <p>Please proceed accordingly.</p>
                                        </Alert>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </>

    );
};

function createjsonforcheckboxradio(index, items) {
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

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AMA);
