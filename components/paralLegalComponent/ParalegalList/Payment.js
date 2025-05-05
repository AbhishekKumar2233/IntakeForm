
import React, { useState, useRef, useEffect, } from 'react';
import { $CommonServiceFn, $postServiceFn } from '../../network/Service';
import { AoPaymentUrl, intakeBaseUrl } from '../../control/Constant'
import konsole from '../../control/Konsole';

const Payment = (props) => {
  konsole.log('ptopsptops',props)
  const clickbuttonref = useRef()

  let memberUserId = props?.userId
  const loggedUserId=sessionStorage.getItem('loggedUserId')
  let enquirymemberDetail=JSON.parse(sessionStorage.getItem('enquirymemberDetails'))
  konsole.log('enquirymemberDetail',enquirymemberDetail)
  
  //define state---------------------------------------------

  const [orderId, setorderId] = useState('')
  let appState = sessionStorage.getItem("stateObj").appState
  konsole.log("memberUserId", memberUserId)
  useEffect(() => {
    adduserApiCall()
  }, [])
  // SUCCESS

  useEffect(() => {
    if (orderId !== '') {
      clickbuttonref.current.submit()
    }
  }, [orderId])

  const adduserApiCall = (data) => {

    let jsonObj = {
      "userId": enquirymemberDetail?.userId,
      'createdBy': loggedUserId,
      "shippingCost": 0,
      "taxCost": 0,
      "totalCost": props?.amtValue,
      "isActive" : false,
      "productList": [{
        "productType": "Paralegal Enquiry",
        "productId": enquirymemberDetail?.seminarId,//seminar id-- props.seminarId
        "productName": "Upgrade to intake member",
        "quantity": 1,
        "productPrice": props?.AmountState || props?.amtValue ,
        "isActive" : false,
      }]
    }
konsole.log('jsonObj',jsonObj)
// return;
    $postServiceFn.postuserorderAddUserOrder(jsonObj, (response) => {
      if (response) {
        setorderId(response.data.data?.order?.orderId)
        konsole.log("postMemberAddress", response.data.data?.order?.orderId)
      }
    });
  }
  // const returnUrlAfterPayment=`http://localhost:3000/paralegal`
  const returnUrlAfterPayment=`${intakeBaseUrl}paralegal`
  return (
    <>
      <form action={`${AoPaymentUrl}Catalog/PaymentRequest`} method="POST" ref={clickbuttonref} >
        <div>
          <input type="hidden" name="AppState" id="AppState" value={appState} />
          <input type="hidden" name="ReturnUrl" id="ReturnUrl" value={returnUrlAfterPayment} />

          <input type="hidden" name="UserId" value={enquirymemberDetail?.userId} />
          <input type="hidden" name="OrderId" value={orderId} />
          <input type="hidden" name="PaymentType" value={"Card"} />
        </div>
        <div>
        </div>
      </form>


    </>
  )
}
export default Payment;