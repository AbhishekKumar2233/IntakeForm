
import React, { useState, useRef, useEffect, } from 'react';
import { isNotValidNullUndefile } from '../../components/Reusable/ReusableCom';
import { intakeBaseUrl } from '../../components/control/Constant';
import { AoPaymentUrl } from '../../components/control/Constant';
import useUserIdHook from '../../components/Reusable/useUserIdHook';


const NewPamentGateway = ({orderIdData,primaryUserId}) => {
    const refFormBtn = useRef();
    const {_appState} = useUserIdHook();
    

    useEffect(() => {
        if (isNotValidNullUndefile(orderIdData?.orderId)) {
            refFormBtn.current.submit()
        }
    }, [orderIdData?.orderId])
    let returnUrlAfterPayment = `${intakeBaseUrl}setup-dashboard/AccountSettings`
    return (
        <>     
            <form action={`${AoPaymentUrl}Catalog/PaymentRequest`} method="post" ref={refFormBtn} >
                <div>
                    <input type="hidden" name="AppState" id="AppState" value={_appState} />
                    <input type="hidden" name="ReturnUrl" id="ReturnUrl" value={returnUrlAfterPayment} />
                    <input type="hidden" name="UserId" value={primaryUserId} />
                    <input type="hidden" name="OrderId" value={orderIdData?.orderId} />
                    <input type="hidden" name="PaymentType" value={"Card"} />
                </div>
            </form>
        </>
    )
}

export default NewPamentGateway
