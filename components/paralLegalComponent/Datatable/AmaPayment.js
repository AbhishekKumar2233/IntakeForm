import React, { useState, useRef, useEffect, } from 'react';
import { Button, Modal, Row, Col, Container, Card } from 'react-bootstrap';
import { $postServiceFn } from '../../network/Service';
import konsole from '../../control/Konsole';
import useUserIdHook from '../../Reusable/useUserIdHook';
import { AoPaymentUrl } from '../../control/Constant';
import { intakeBaseUrl } from '../../control/Constant';
import { getApiCall, isNotValidNullUndefile, postApiCall } from '../../Reusable/ReusableCom';
import { $Service_Url } from '../../network/UrlPath';
import { demo } from '../../control/Constant';

const AmaPayment = ({ clientData, orderId, subtenantRateCardId, refrencePage, isPortalSignOn }) => {
    const refFormBtn = useRef();
    const { _loggedInUserId, _primaryMemberUserId, _appState, _subtenantId } = useUserIdHook();
    const memberId = clientData?.memberId;

    useEffect(() => {
        if (isNotValidNullUndefile(orderId)) {
            sessionStorage.setItem("amaUser", clientData?.primaryEmailAddress)
            sessionStorage.setItem("stateOfPayment", "annualAgreement");
            refFormBtn.current.submit()
        }
    }, [orderId])

    let returnUrlAfterPayment;
    
    if (isPortalSignOn) {
        returnUrlAfterPayment = `${intakeBaseUrl}/portal-signon/allusers?username=${clientData?.primaryEmailAddress}`;
        // returnUrlAfterPayment = `http://localhost:3000/portal-signon/allusers?username=${clientData?.primaryEmailAddress}`;
        sessionStorage.setItem("userId", clientData?.userId)
        sessionStorage.setItem("stateOfPayment", "annualAgreement");
        sessionStorage.setItem("subtenantId", clientData?.subtenantId)
    } else {
        returnUrlAfterPayment = `${intakeBaseUrl}paralegal`;
        // returnUrlAfterPayment=`http://localhost:3000/paralegal`
        sessionStorage.setItem("stateOfPayment", "annualAgreement");
    }
    if(refrencePage=='AMA'){
        returnUrlAfterPayment = `${intakeBaseUrl}PaymentStatus`
        // returnUrlAfterPayment=`http://localhost:3000/PaymentStatus`
        sessionStorage.setItem("stateOfPayment", "annualAgreement");
    }
    if(refrencePage == "AccountSetting") {
        returnUrlAfterPayment = `${intakeBaseUrl}setup-dashboard/AccountSettings`
        // returnUrlAfterPayment=`http://localhost:3000/PaymentStatus`
        sessionStorage.setItem("stateOfPayment", "annualAgreement");
    }

    return (
        <>
            <form action={`${AoPaymentUrl}Catalog/PaymentRequest`} method="POST" ref={refFormBtn} >
                <div>
                    <input type="hidden" name="AppState" id="AppState" value={_appState} />
                    <input type="hidden" name="ReturnUrl" id="ReturnUrl" value={returnUrlAfterPayment} />
                    <input type="hidden" name="UserId" value={memberId} />
                    <input type="hidden" name="OrderId" value={orderId} />
                    <input type="hidden" name="PaymentType" value={"Card"} />
                    <input type="hidden" name="SubtenantRateCardId" value={subtenantRateCardId} />
                    <input type="hidden" name="IsBillDetail" value={true} />
                    {(demo) && <>
                        <input type="hidden" name="createdBy" value={_loggedInUserId} />
                        <input type="hidden" name="UpsertedBy" value={_loggedInUserId} />
                    </>}
                </div>
                <div>
                </div>
            </form>
        </>
    )
}

export default AmaPayment
