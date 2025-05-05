import { useContext, useEffect, useState } from "react";
import { Col, Modal, ModalFooter, Row } from "react-bootstrap";
import { getApiCall, isNotValidNullUndefile, isNullUndefine, postApiCall, postApiCall2, recurringErrorHandled } from "../../Reusable/ReusableCom";
import { $Service_Url } from "../../network/UrlPath";
import konsole from "../../control/Konsole";
import { CustomInput } from "../../../component/Custom/CustomComponent";
import { $AHelper } from "../../../component/Helper/$AHelper";
import { CustomButton } from "../../../component/Custom/CustomButton";
import AlertToaster from "../../control/AlertToaster";
import { $JsonHelper } from "../../../component/Helper/$JsonHelper";
import NewPaymentModal from "../../../component/Account-Settings/NewPaymentModal";
import { useAppDispatch, useAppSelector } from "../../../component/Hooks/useRedux";
import { selectAgreement } from "../../../component/Redux/Store/selectors";
import { setTempData } from "../../../component/Redux/Reducers/agreementSlice";
import { $AHelper as $oldHelper } from "../../control/AHelper";
import Router from "next/router";
import { globalContext } from "../../../pages/_app";

const AmaFuturePayment = ( props ) => {
    const [loggedUserId, setloggeduserId] = useState("");
    const [showModal, setShowModal] = useState(true);
    const [userProfile, setUserProfile] = useState({});
    const [selectedCard, setSelectedcard] = useState({});
    const [cardFormData, setCardFormData] = useState({});
    const { setWarning, confirm } = useContext(globalContext)
    const { agreementType } = useAppSelector(selectAgreement);
    const dispatcher = useAppDispatch();

    const { clientData, subscriptionId, subtenantId, paymentDate, paidAmount, funForOrderIdUpdate, dispatchloader, handleIsShow, refrencePage, callerReference } = props;

    useEffect(() => {
        let loggedUserId = sessionStorage.getItem('loggedUserId')
        setloggeduserId(loggedUserId)
        fetchUserAllCards();
    }, [])

    const fetchUserAllCards = async () => {
        const _responseOfProfile = await getApiCall("GET", $Service_Url.get_UserProfileDetailsByUserId + clientData?.memberId, "");
        konsole.log(clientData, "_responseOfProfile", _responseOfProfile?.[0]);
        setUserProfile(_responseOfProfile?.[0] ?? {});
    }

    const modalCLose = () => {
        // setShowModal(!showModal);
        handleIsShow();
    }

    const handleChange = ( key, value ) => {
        setCardFormData({
            ...cardFormData,
            [key]: value
        })
    }

    const handleCardSelect = ( _cardDetails ) => {
        konsole.log("dfklsjdfl", _cardDetails)
        setSelectedcard(_cardDetails);
        setCardFormData(_cardDetails);
    }

    const handleSubmit = async ( ) => {
        // if(!isValidCard()) return;
        if($oldHelper.isValidExpiry(cardFormData.expireDate, paymentDate) != true) {
            // giving warning to user
            if(callerReference == "AccountSetting") setWarning("warning", "Warning", "Your card will expire before the selected future payment date. Please use a different card.");
            else AlertToaster.error(`Your card will expire before the selected future payment date. Please use a different card.`);
            return;
        }

        const oldSameCardProfileId = userProfile?.cards?.find(ele => ele?.cardNumber == cardFormData?.cardNumber)?.paymentProfileId;
        if(isNotValidNullUndefile(oldSameCardProfileId) && (oldSameCardProfileId != cardFormData?.paymentProfileId)) return setWarning(
            "warning", "Warning", "Card already exist"
        )
        // debugger
        if(isNullUndefine(cardFormData?.paymentProfileId)) {
            const userRes = await confirm(
                true, 
                "To add your card, we need to verify your card details. A temporary charge of $0.01 will be applied and refunded to your card within seven days. Please note that we do not store your CVV number.", 
                "Confirmation", 
                "custom", 
                [
                    {
                        label: "Cancel",
                        value: false,
                    },
                    {
                        label: "Proceed",
                        value: true,
                    },
                ]
            );

            if(userRes != true) return;

            // formating data
            let [ _month, _year ] = cardFormData?.expireDate?.split('/');
            _year = _year?.length == 2 ? "20" + _year : _year;


            const verfiyCardJson = {
                "cardNumber": cardFormData?.cardNumber,
                "expirationDate": _year + "-" + _month, // formate must be "2030-03"
                "cardCvv": String(cardFormData?.cardCvv)
            }

            dispatchloader(true);
            
            const isVarifiedCard = await postApiCall("POST", $Service_Url.postCardVerify, verfiyCardJson);
            konsole.log("sdjkfhsd", isVarifiedCard);
            
            dispatchloader(false);

            if(isVarifiedCard?.data != true) {
                return AlertToaster.error("Invalid card details. Please check your card information and try again.")
            }
        }

        dispatchloader(true);

        const { firstName, lastName } = $AHelper.$getFirstAndLastName(clientData?.memberName);
        const finalCardJson = {
            ...$JsonHelper.userCardJson(),
            ...cardFormData,

            userProfileId: cardFormData?.userProfileId ?? userProfile?.id ?? 0,
            customerProfileId: cardFormData?.customerProfileId ?? userProfile?.customerProfileId ?? "",
            userLoginId: clientData?.loginUserId ?? "",
            userId: clientData?.memberId ?? "",
            emailId: clientData?.primaryEmailAddress ?? "",
            phoneNumber: clientData?.primaryPhoneNumber ?? "",

            firstName,
            lastName,

            createdBy: loggedUserId,
            updatedBy: loggedUserId,
            isDefault: false
        }

        const responseData = await postApiCall("POST", $Service_Url.fetchAllCard, finalCardJson);
        konsole.log("sdnxcjshdfl", responseData);
        dispatchloader(false);

        if(responseData == "err") return setWarning("warning", "Warning", "Enter valid card details")
        setUserProfile(responseData?.data?.data ?? {});
        setSelectedcard(responseData?.data?.data?.cards?.find(ele => ele?.cardNumber == cardFormData?.cardNumber))

        if(responseData != "err") await oneTimeRecuring(responseData?.data?.data);
        handleCardSelect(responseData?.data?.data?.cards?.find(ele => ele?.cardNumber == cardFormData?.cardNumber))
    }

    const oneTimeRecuring = async ( userProfileRes ) => {
        dispatchloader(true);
        const subscriptionRes = await postApiCall('GET', $Service_Url.getUserSubscription + `${subtenantId}/${true}?SubscriptionId=${subscriptionId}&UserId=${clientData?.memberId}`);
        dispatchloader(false);
        if(!subscriptionRes?.data?.data?.[0]?.userSubscriptionId) return;

        const userSubscriptionId = subscriptionRes?.data?.data?.[0]?.userSubscriptionId;
        const paymentProfileId = userProfileRes?.cards?.find(ele => ele?.cardNumber == cardFormData?.cardNumber)?.paymentProfileId;
        const oneDayMilliSec = 24 * 60 * 60 * 1000;
        const daysDiff = Math.ceil((paymentDate - new Date()) / oneDayMilliSec);

        konsole.log("hjkhkjh", clientData, clientData?.loginUserId);

        const jsonObj = $JsonHelper.createUserRecurringSubscription({
            ...cardFormData,
            userLoginId: clientData?.loginUserId,
            userId: clientData?.memberId,

            userSubscriptionId: userSubscriptionId,
            subscriptionId: subscriptionId,

            subscriptionName: "Annual Maintenance Agreement",
            totalOccurrences: 1,
            paySchedule: {
                length: daysDiff,
                unit: 'days'
            },
            amount: paidAmount,
            totalAmount: paidAmount ?? 0,
            totalDiscount: 0,
            orderId: null,
            isOneTimePay: true,

            customerProfileId: userProfileRes?.customerProfileId,
            paymentProfileId: paymentProfileId,

        })

        dispatchloader(true);
        const _resOneTimeRecurring = await recurringErrorHandled(jsonObj);
        konsole.log("dhjklfja", _resOneTimeRecurring);
// debugger
        if(_resOneTimeRecurring == "err") {
            dispatchloader(false);
            if(callerReference == "AccountSetting") setWarning("warning", "Warning", `Unable to schedule future payment on ${$AHelper.$getDateFormatted(paymentDate ?? "")}, Please try again after sometime`);
            else AlertToaster.error(`Unable to schedule future payment on ${$AHelper.$getDateFormatted(paymentDate ?? "")}, Please try again after sometime`);
            return;
        }

        const _resultPlansDetails = await getApiCall("GET", `${$Service_Url.getUserSubscriptionPlans}?UserSubscriptionId=${userSubscriptionId}&IsActive=${true}`);
        // dispatchloader(false);

        const dataToPassOn = {
            amount: paidAmount,
            subscriptionPlans: _resultPlansDetails,
            futurePayDate: $oldHelper.getFormattedDate(paymentDate),
            paymentProfileId: paymentProfileId,
        }

        if(refrencePage == "AMA") {
            // debugger
            dispatcher(setTempData(dataToPassOn))
            // redirecting to /PaymentStatus page
            Router.push(`/PaymentStatus?isCallFromFuturePayment=true`);
        } else {
            funForOrderIdUpdate( undefined , true , dataToPassOn);
        }
    }

    const toasterAlert = ( text ) => AlertToaster.error(text);

    // const isValidCard = () => {  
    //     const cardNumbers =  cardFormData?.cardNumber?.toString();
    //     if(isNullUndefine(cardFormData?.cardNickName) == true){
    //         toasterAlert("Please enter card holder name")
    //         return;
    //     }
    //     if(isNullUndefine(cardNumbers) == true){
    //         toasterAlert("Please enter card number")
    //         return;
    //     }
    //     if(!(cardNumbers?.length >= 14 && cardNumbers?.length <= 16)){
    //         toasterAlert("Please enter correct card number")
    //         return;
    //     }
    //     if (!$AHelper.$expiryDateValidationInput(cardFormData?.expireDate)) {
    //         toasterAlert("Please enter correct expiration date.")
    //         return;
    //     }
    //     if(isNullUndefine(cardFormData?.expireDate) == true){
    //         toasterAlert("Please enter expiration date")
    //         return;
    //     }
    //     return true;
    // }

    return (
        <>
        <style jsx global>{`
        .fade.ama-future-payment  {
          background: color(srgb 0 0 0 / 0.5) !important;
        }
        `}</style>
        <Modal id='AnnualAgreemetModal' className='ama-future-payment' show={showModal} size="lg" animation="false" backdrop="static"  >
            <Modal.Header className='AnnualModalHeader d-flex justify-content-between' style={{ border: "none" }} >
                <Modal.Title>{'AMA Future Payment'}</Modal.Title>
                <img className='mt-0 me-1 cursor-pointer' onClick={()=>modalCLose()} src='/icons/closeIcon.svg'></img>
            </Modal.Header>
            <Modal.Body>
                {userProfile?.cards?.length > 0 && <>
                <section className="select-card p-3">
                    <p className="lableService">Select your card</p>
                    {userProfile?.cards?.map(cardDetails => <PaymentCard key={cardDetails?.cardNumber} cardDetails={cardDetails} selectedCardNum={selectedCard?.cardNumber} onSelect={handleCardSelect} />)}
                    <PaymentCard key={"addNewCard"} selectedCardNum={selectedCard?.cardNumber} onSelect={handleCardSelect} />
                </section>

                <hr/>

                </>}

                <section className="payment-form useNewDesignSCSS p-3">
                    <p className="lableService pb-3">Payment details</p>

                    <NewPaymentModal formOnlyUse={true} cardFormData={cardFormData} setCardFormData={setCardFormData} onSubmit={handleSubmit} />

                    {/* <Row className="mt-3" >
                        <Col xs={6}>
                            <CustomInput tabIndex={7}  isPersonalMedical={true} name='CardHolder' label="Card Holder*" placeholder="Enter Card Holder" id='CardHolder' value={cardFormData?.cardNickName} onChange={(val) => handleChange('cardNickName', val)} /> 
                        </Col>
                        <Col xs={6}>
                            <Row>
                                <Col xs={2} >
                                    {$AHelper.$getCardCompany(cardFormData?.cardNumber)?.cardType}
                                </Col>
                                <Col xs={10} >
                                    <div id="custom-input-field" className="financial-Adviser-Class " style={{ fontSize: "14px" }}>
                                        <p style={{ fontWeight: "600" }}>Card Number*</p>
                                        <input tabIndex={7} isPersonalMedical={true} name='CardNumber' label="Card Number*" placeholder="Enter Card Number" id='CardNumber' notCapital={true} value={$AHelper.$formatCreditCardNumber(cardFormData?.cardNumber) ?? ""} onChange={(e) => handleChange('cardNumber', e.target.value)} className="form-control" style={{ fontSize: "14px", height: "44px", border: "1px solid #AEAEAE", borderRadius: "6px", marginTop: "5px" }} /> 
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mt-3" >
                        <Col xs={6} lg={6}>
                            <div id="custom-input-field" className="financial-Adviser-Class " style={{fontSize:"14px"}}>
                                <p style={{fontWeight:"600"}}>Expiration Date*</p>
                                <input className="form-control" style={{fontSize:"14px",height:"44px",border:"1px solid #AEAEAE",borderRadius:"6px",marginTop:"5px"}} tabIndex={7} isPersonalMedical={true} name='ExpirationDate' label="Expiration Date*" placeholder="Enter Expiration Date" id='ExpirationDate' notCapital={true} maxLength="5" value={$AHelper.$expiryDateValidationInput(cardFormData?.expireDate) ?? ''} onChange={(e) => handleChange('expireDate', $AHelper.$isNumberAndSlash(e.target.value) ? e.target.value : '')} /> 
                            </div>
                        </Col>
                    </Row>
                    <Row className="mt-3" >
                        <CustomInput tabIndex={7} isPersonalMedical={true} name='Billing Address' label="Billing Address" placeholder="Enter Billing Address" id='BillingAddress' notCapital={true} value={cardFormData?.streetAddress} onChange={(val) => handleChange('streetAddress', val)} /> 
                    </Row>
                    <Row className="mt-3" >
                        <CustomInput tabIndex={7} isPersonalMedical={true} name='Apartment No' label="Apartment No" placeholder="Enter Apartment No" id='ApartmentNo' notCapital={true} value={cardFormData?.apartmentNo} onChange={(val) => handleChange('apartmentNo', val)} /> 
                    </Row>
                    <Row className="mt-3">
                        <Col xs={4} lg={4}>
                            <CustomInput tabIndex={7} isPersonalMedical={true} name='City' label="City" placeholder="Enter City" id='City' notCapital={true} value={cardFormData?.city} onChange={(val) => handleChange('city', val)} /> 
                        </Col>
                        <Col xs={4} lg={4}>
                            <CustomInput tabIndex={7} isPersonalMedical={true} name='State' label="State" placeholder="Enter State" id='State' notCapital={true} value={cardFormData?.state} onChange={(val) => handleChange('state', val)} /> 
                        </Col>
                        <Col xs={4} lg={4}>
                            <CustomInput tabIndex={7} isPersonalMedical={true} name='Zip Code' label="Zip Code" placeholder="Enter Zip Code" id='ZipCode' notCapital={true} value={cardFormData?.zipCode} onChange={(val) => handleChange('zipCode', val)} /> 
                        </Col>
                    </Row> */}
                </section>

            </Modal.Body>
            {/* <ModalFooter>
                <section className="submittion useNewDesignSCSS pe-3 pb-3"> 
                    <CustomButton label={"Save"} onClick={handleSubmit} ></CustomButton>
                </section>
            </ModalFooter> */}
        </Modal>
        </>
    )
}

export default AmaFuturePayment;

const PaymentCard = ({ cardDetails, selectedCardNum, onSelect }) => {
    const { cardNumber, expireDate } = cardDetails ?? {};
    const last3Digit = cardNumber?.substr(cardNumber?.length - 3, 3);
    konsole.log("dkladjka", cardDetails, last3Digit)

    return (
        <>
        <div className="card-collection" onClick={() => onSelect(cardDetails)}>
            <div className="each-card">
                <label class="radio-label custom-checkbox">
                    <input type="checkbox" checked={selectedCardNum == cardNumber} />
                    <span  className="checkmark m-0"></span>
                </label>
                {isNotValidNullUndefile(cardNumber) ? <>
                <img src="/New/newIcons/card.png" alt="each-card-img" className="card-size-60-40 align-self-center m-0" />
                <div>
                    <p className="card-t1">{$AHelper.$getCardCompany(cardNumber)?.cardType} ending with {last3Digit}</p>
                    <p className="card-t2">Expiry {expireDate}</p>
                </div>
                </> : <p className="card-t1">Add new payment Card</p>}
            </div>
        </div>
        </>
    )
}