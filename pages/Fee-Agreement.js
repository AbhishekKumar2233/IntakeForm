import React, { useState, useEffect } from "react";
import konsole from '../components/control/Konsole';
import { $AHelper } from "../components/control/AHelper";
import { SET_LOADER } from "../components/Store/Actions/action";
import { getApiCall, isNotValidNullUndefile } from "../components/Reusable/ReusableCom";
import { $getServiceFn } from "../components/network/Service";
import { $Service_Url } from "../components/network/UrlPath";
import { connect } from "react-redux";
import NonCrisisFeeAgreement from "../components/paralLegalComponent/annualAgreement/NonCrisisFeeAgreement";
import IsLoader from "../components/IsLoader";
import { Alert } from "react-bootstrap";

function FeeAgreement() {
    const [linkvalidate, setLinkValidate] = useState();
    const [clientUserId, setClientUserId] = useState('');
    const [confirmOrderId, setConfirmOrderId] = useState();
    const [primaryName, setPrimaryName] = useState("");
    const [fromFeeAgreement, setFromFeeAgreement] = useState(true);
    const [spouseName, setSpouseName] = useState("");
    const [isLoader, setIsLoader] = useState(false);
    const [client, setClient] = useState({});
    const [skuListNames, setSkuListNames] = useState([]);
    const [primaryDetails, setPrimaryDetails] = useState({});
    const [showHourlyBody, setShowHourlyBody] = useState(true);
    const [showFlatFeeBody, setShowFlatFeeBody] = useState(true);
    const [selectAttornetvalue, setSelectAttornetvalue] = useState([])

    useEffect(() => {
        const queryString = window.location.search;
        const UID = $AHelper.getQueryParameters(queryString, 'UID');
        const Stage = $AHelper.getQueryParameters(queryString, 'Stage');
        const Linktype = $AHelper.getQueryParameters(queryString, 'Linktype');
        konsole.log(UID, "Mosai", Stage, "Babu", Linktype);
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
                setClientUserId(userId);
                fetchClientDetailsById(userId);
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

    const fetchClientDetailsById = async (userId) => {
        sessionStorage.setItem("userID", userId);
        konsole.log("userID", userId);
        if (!userId) return;
        setIsLoader(true)
        let _resultOfGetClient = await getApiCall("GET", $Service_Url.getUserbyId + userId, "");
        setIsLoader(false)
        konsole.log("_resultOfGetClient", _resultOfGetClient);
        if (_resultOfGetClient == "err") return;
        let responseData = _resultOfGetClient;
        setClient(responseData);
        fetchDetailsById(userId)
    };

    const fetchDetailsById = async (userId) => {
        sessionStorage.setItem("userID", userId);
        konsole.log("userID", userId);
        if (!userId) return;
        setIsLoader(true)
        let _resultOfGetPrimary = await getApiCall("GET", $Service_Url.getFamilyMemberbyID + userId, "");
        setIsLoader(false)
        konsole.log("_resultOfGetPrimary", _resultOfGetPrimary);
        if (_resultOfGetPrimary == "err") return;
        let responseData = _resultOfGetPrimary?.member;
        const subtenantID = responseData?.subtenantId;
        setPrimaryDetails(responseData);
        fetchSubscriptionDetailsfunction(subtenantID, 2, userId)
    };

    const fetchSubscriptionDetailsfunction = async (subtenantID, subscriptionID, userId) => {
        setIsLoader(true)
        let url = $Service_Url.getSubscriptionDetails + subtenantID + "/" + subscriptionID;
        setIsLoader(false)
        const _resultOfSubscription = await getApiCall("GET", url, "");
        konsole.log("_resultOfSubscription", _resultOfSubscription);
        if (_resultOfSubscription != "err" && _resultOfSubscription.length > 0) {
            let subPlansList = _resultOfSubscription[0]?.subsPlans;
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
            if (allSkuListNames.length > 0) {
                setSkuListNames(prevState => {
                    return prevState.length === 0 ? allSkuListNames : prevState;
                });
            }
            getSavedSubscriptionDetails(subtenantID, subscriptionID, userId)
        }
    };

    const getSavedSubscriptionDetails = async (subtenantID, subscriptionID, userId) => {
        setIsLoader(true)
        const _resultSubsDetails = await getApiCall("GET", $Service_Url.getUserSubscription + `${subtenantID}/${true}?SubscriptionId=${subscriptionID}&UserId=${userId}`);
        setIsLoader(false)
        if (_resultSubsDetails == "err" )  return setConfirmOrderId("err");
        const attorneyDetails = {
            label: _resultSubsDetails[0]?.attorneyName || '', 
            value: _resultSubsDetails[0]?.attorneyId || '',
        };
        let confirmOrderId = _resultSubsDetails[0]?.orderId;
        setConfirmOrderId(confirmOrderId);
        konsole.log("_resultSubsDetails", _resultSubsDetails);
        setSelectAttornetvalue(attorneyDetails);
        setShowHourlyBody(_resultSubsDetails[0]?.isHourly)
        setShowFlatFeeBody(_resultSubsDetails[0]?.isFlatFee)
    }

    const isLoaderCheck = (val) => {
        setIsLoader(val)
    }

    return (
        <>
            {isLoader && <IsLoader />}
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
                                {Object.keys(client).length > 0 && (
                                    <NonCrisisFeeAgreement
                                        clientData={client}
                                        primaryEmailAddress={client?.primaryEmailAddress || client?.primaryEmailId}
                                        FeeAgreement={true}
                                        primaryName={primaryName}
                                        spouseName={spouseName}
                                        fromFeeAgreement={fromFeeAgreement}
                                        setShowFlatFeeBody={setShowFlatFeeBody}
                                        showFlatFeeBody={showFlatFeeBody}
                                        setShowHourlyBody={setShowHourlyBody}
                                        showHourlyBody={showHourlyBody}
                                        primaryDetails={primaryDetails}
                                        skuListNames={skuListNames}
                                        dispatchloader={isLoaderCheck}
                                        selectAttornetvalue={selectAttornetvalue}
                                    />
                                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(FeeAgreement);
