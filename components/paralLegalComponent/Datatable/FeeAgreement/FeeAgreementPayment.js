import React, { useEffect, useRef } from 'react';
import { AoPaymentUrl, demo, intakeBaseUrl } from '../../../control/Constant';
import { isNotValidNullUndefile } from '../../../Reusable/ReusableCom';

const FeeAgreementPayment = ({ clientData, orderId, attorneyID, loggedUserId, subtenantRateCardId, refrencePage }) => {
  const _appState = JSON.parse(sessionStorage?.getItem('stateObj'))?.appState || null;
  const _loggedInUserId = loggedUserId || sessionStorage?.getItem('loggedUserId');
  const refFormBtn = useRef();
  const memberId = clientData?.memberId || clientData?.memberUserId;
  const emailId = clientData?.primaryEmailAddress || clientData?.primaryEmailId

  useEffect(() => {
    if (isNotValidNullUndefile(orderId)) {
      sessionStorage.setItem("feeAgreementUser", emailId);
      sessionStorage.setItem("orderID", orderId);
      sessionStorage.setItem('attorneyID',attorneyID)
      sessionStorage.setItem('UserID', memberId)
      sessionStorage.setItem('refrencePage', refrencePage)
      sessionStorage.setItem('loggedUserId', loggedUserId)
      sessionStorage.setItem("stateOfPayment", "feeAgreement");
      refFormBtn.current.submit();
    }
  }, [orderId]);

  let returnUrlAfterPayment;

  if (refrencePage == 'FeeAgreement') {
    returnUrlAfterPayment = `${intakeBaseUrl}PaymentStatus`
    // returnUrlAfterPayment = `http://localhost:3000/PaymentStatus`
    sessionStorage.setItem("stateOfPayment", "feeAgreement");
  } else if (refrencePage == 'portalSignOn') {
    returnUrlAfterPayment = `${intakeBaseUrl}/portal-signon/allusers?username=${clientData?.primaryEmailAddress}`;
    // returnUrlAfterPayment = `http://localhost:3000/portal-signon/allusers?username=${clientData?.primaryEmailAddress}`;
    sessionStorage.setItem("userId", clientData?.userId)
    sessionStorage.setItem("subtenantId", clientData?.subtenantId)
    sessionStorage.setItem("stateOfPayment", "feeAgreement");
  } else {
    returnUrlAfterPayment = `${intakeBaseUrl}paralegal`;
    // returnUrlAfterPayment = `http://localhost:3000/paralegal`
    sessionStorage.setItem("stateOfPayment", "feeAgreement");
  }

  return (
    <>
      <form
        action={`${AoPaymentUrl}Catalog/PaymentRequest`}
        method="POST"
        ref={refFormBtn}
      >
        <div>
          <input type="hidden" name="AppState" id="AppState" value={_appState} />
          <input type="hidden" name="ReturnUrl" id="ReturnUrl" value={returnUrlAfterPayment} />
          <input type="hidden" name="UserId" value={memberId} />
          <input type="hidden" name="OrderId" value={orderId} />
          <input type="hidden" name="PaymentType" value={"Card"} />
          <input type="hidden" name="SubtenantRateCardId" value={subtenantRateCardId} />
          <input type="hidden" name="IsBillDetail" value={true} />
          {demo && (
            <>
              <input type="hidden" name="createdBy" value={_loggedInUserId} />
              <input type="hidden" name="UpsertedBy" value={_loggedInUserId} />
            </>
          )}
        </div>
      </form>
    </>
  );
};

export default FeeAgreementPayment;