import React, { useState, useRef, useEffect, } from 'react';
import { Button, Modal, Row, Col, Container, Card, Table } from 'react-bootstrap';
import useUserIdHook from '../../../Reusable/useUserIdHook';
import konsole from '../../../control/Konsole';
import { $Service_Url } from '../../../network/UrlPath';
import { getApiCall, isNotValidNullUndefile, postApiCall } from '../../../Reusable/ReusableCom';
import AmaStepper from './AmaStepper';
import { demo, discountRateCard } from '../../../control/Constant';
import AmaPayment from '../AmaPayment';
import AmaFuturePayment from '../AmaFuturePayment';
import { $AHelper } from '../../../control/AHelper';
const AmaOrderSummary = (props) => {
    const { clientData, subscriptionId, subscriptionSubPlans, dispatchloader, show, handleIsShow, refrencePage, isPortalSignOn, paymentDate, funForOrderIdUpdate, callerReference } = props
    const memberId = clientData?.memberId;
    const { _loggedInUserId, _primaryMemberUserId, _appState, _subtenantId } = useUserIdHook();
    let loggedInUserId = refrencePage !== 'AMA' ? _loggedInUserId : props.uploadUserID;
    let subtenantId = refrencePage !== 'AMA' ? _subtenantId : sessionStorage.getItem("subtenantID");
    // const _paymentDate = new Date(paymentDate);
    const _paymentDate = $AHelper.parseDateSafely(paymentDate);
    const _todayDate = $AHelper.parseDateSafely(Date());
    const isFuturePayment = $AHelper.getDateDiff(_paymentDate, _todayDate) >= 7;
    konsole.log("asndkjasnllnlnlnlk", _paymentDate, _todayDate, $AHelper.getDateDiff(_paymentDate, _todayDate));


    const [currentStep, setCurrentStep] = useState(0);
    const [subtenantRateCardId, setSubtenantRateCardId] = useState('');
    const [discountDetailsList, setDiscountDetailsList] = useState([])
    const [productList, setProductList] = useState([])
    const [orderId, setOrderId] = useState('');
    const [isConfirmOrderSummary, setIsConfirmOrderSummary] = useState(false);


    useEffect(() => {
        // getSavedSubscriptionDetails();
        getsubscriptionDetailsfun();
    }, [subscriptionSubPlans]);

    const getsubscriptionDetailsfun = async () => {
        dispatchloader(true);
        const _resultOfSubsDetails = await getApiCall('GET', $Service_Url.getSubscriptionDetails + subtenantId + "/" + subscriptionId, '')
        konsole.log("_resultOfSubsDetails", _resultOfSubsDetails);
        if (_resultOfSubsDetails != 'err' && _resultOfSubsDetails.length > 0) {
            const subPlansList = _resultOfSubsDetails[0]?.subsPlans;
            getSavedSubscriptionDetails(subPlansList)
        }
        dispatchloader(false);
    }

    const getSavedSubscriptionDetails = async (subPlansList) => {
        dispatchloader(true);
        // getSubscriptionDetails
        const _resultSubsDetails = await getApiCall("GET", $Service_Url.getUserSubscription + `${subtenantId}/${true}?SubscriptionId=${subscriptionId}&UserId=${memberId}`);
        konsole.log("_resultSubsDetails", _resultSubsDetails);
        dispatchloader(false);
        if (_resultSubsDetails == 'err' || _resultSubsDetails.length < 0) return;
        let userSubscriptionId = _resultSubsDetails[0]?.userSubscriptionId;
        getUserSubscriptionPlans(userSubscriptionId, subPlansList);
    }
    const getUserSubscriptionPlans = async (userSubscriptionId, subPlansList) => {
        dispatchloader(true);
        let IsActive = true;
        const _resultPlansDetails = await getApiCall("GET", `${$Service_Url.getUserSubscriptionPlans}?UserSubscriptionId=${userSubscriptionId}&IsActive=${IsActive}`);
        dispatchloader(false);
        konsole.log("_resultPlansDetails", _resultPlansDetails, subPlansList);
        if (_resultPlansDetails == 'err') return;

        let arrayData = subPlansList;
        let responseData = _resultPlansDetails;

        konsole.log("arrayDataarrayData", arrayData);

        if (responseData.length > 1) {

            for (let [item, value] of responseData.entries()) {
                for (let i = 0; i < arrayData.length; i++) {
                    if (value.subsPlanId == arrayData[i].subsPlanId) {
                        arrayData[i] = { ...arrayData[i], ...value }
                    }
                }
            }
        } else {
            arrayData=responseData
        }


        konsole.log("arrayDataarrayData", arrayData, responseData);



        konsole.log("subPlansArrayaaaa", arrayData)
        // getsubscriptionSubPlans(_resultPlansDetails);
        getsubscriptionSubPlans(arrayData);
    }

    const getsubscriptionSubPlans = (_resultPlansDetails) => {
        let allFamilyDetails = subscriptionSubPlans?.reduce((accumulator, current) => {
            return accumulator.concat(current.subsPlanSKUs);
        }, []);

        let newArray = _resultPlansDetails?.map(item => {
            let matchingFamilyDetail = allFamilyDetails?.find(familyItem => familyItem?.subsPlanId === item?.subsPlanId && familyItem?.subsPlanSKUMapId == item?.subsPlanSKUMapId && item?.isActive === true);
            return matchingFamilyDetail ? { ...matchingFamilyDetail, ...item } : item;
        });

        konsole.log("userPlansList", newArray, _resultPlansDetails, allFamilyDetails)
        // setUserPlansList(newArray)
        setSubtenantRateCardId(newArray[0].subtenantRateCardId);
        postAddUserOrder(newArray)
    }

    function jsonForProductList(items, discountDetailsList) {
        konsole.log("jsonForProductListitems", items);
        const { subtenantRateCardId, skuListName, endSubscriptionAmt, } = items;
        const amaTitle = (subtenantRateCardId == 4 || subtenantRateCardId == 3) ? "Annual Maintenance Agreement" : "";

        const skiLisnNameRemoveUnderschore = skuListName?.startsWith("INDPKG_") ? skuListName?.replace('INDPKG_', '') : skuListName?.startsWith("GRPPKG_") ? skuListName?.replace('GRPPKG_', '') : skuListName;
        const discountAmt = returnPercentageCalculate(subtenantRateCardId, endSubscriptionAmt, discountDetailsList);
        konsole.log("discountAmt", discountAmt)
        let productName = amaTitle || skiLisnNameRemoveUnderschore;

        if (productName?.includes('Will Based Planning') || productName?.includes('Trust Based Planning')) {
            productName = productName?.replace('Will Based Planning', 'Annual Maintenance Agreement');
        }

        return {
            productType: "AMA",
            productId: subtenantRateCardId,// subtenant Rate Card Id
            productName: productName, // Radio Label
            quantity: 1,
            productPrice: endSubscriptionAmt, // priduct price

            // after addition properties
            subtenantRateCardId: subtenantRateCardId,
            totalProductPrice: endSubscriptionAmt,
            paidProductPrice: endSubscriptionAmt - discountAmt,
            discountAmt: discountAmt,
            isActive : false,
        }
    }
    const postAddUserOrder = async (userPlansList) => {
        // if (!demo) {
        //     postAddUserOrder2(userPlansList);
        //     return;
        // }
        const jsonObjDis = { "subtenantId": subtenantId, disValidityTill: new Date() }
        props.dispatchloader(true)
        const _resultOfGetDiscount = await postApiCall("POST", $Service_Url.getDescountDetails, jsonObjDis);
        props.dispatchloader(false)
        konsole.log("_resultOfGetDiscount", _resultOfGetDiscount);
        const discountResponse = _resultOfGetDiscount?.data?.data;
        setDiscountDetailsList(discountResponse);
        let _productList = userPlansList?.length > 0 ? userPlansList?.map(item => jsonForProductList(item, discountResponse)) : [];
        konsole.log("_productLista", _productList)
        setProductList(_productList)
    }
    const postAddUserOrder2 = async (userPlansList) => {
        let _productList = userPlansList?.length > 0 ? userPlansList?.map(item => jsonForProductList(item)) : [];
        konsole.log("_productList", _productList)
        const _allProductPriceAmt = userPlansList?.length > 0 ? userPlansList?.reduce((acc, current) => acc + current?.endSubscriptionAmt, 0) : 0;
        konsole.log("_allProductPriceAmt", _allProductPriceAmt);
        const jsonObj = {
            "userId": clientData?.memberId,
            'createdBy': _loggedInUserId,
            "shippingCost": 0,
            "taxCost": 0,
            "totalCost": _allProductPriceAmt || 0,
            "productList": _productList
        }
        konsole.log("jsonObjjsonObj", jsonObj)
        dispatchloader(true);
        const _resultAddUserOrder = await postApiCall('POST', $Service_Url.postAddUserOrder, jsonObj)
        konsole.log("_resultAddUserOrder", _resultAddUserOrder);
        dispatchloader(false);
        if (_resultAddUserOrder == 'err') return;
        setOrderId(_resultAddUserOrder?.data?.data?.order?.orderId)
    }
    konsole.log("productList", productList)

    const totalAmount = returnTotalPaidPrice('totalProductPrice', productList);
    const paidAmount = returnTotalPaidPrice('paidProductPrice', productList);

    useEffect(() => {
        if ((isFuturePayment != true) && productList && productList.length > 0) {
            addOrderUser(productList);
        }
    }, [productList]);

    const addOrderUser = async () => {

        const jsonObj = {
            "userId": clientData?.memberId,
            'createdBy': loggedInUserId,
            "shippingCost": 0,
            "promoCode": '',
            "taxCost": 0,
            "orderId": 0,
            "totalCost": paidAmount || 0,
            "productList": productList,

            // after addition properties
            "paidAmt": paidAmount || 0,
            "paymentTypeId": 1,
            "currencyTypeId": 2,
            "isBillDetail": true,
            "isActive" : false,
        }
        konsole.log('jsonObjAddrder', JSON.stringify(jsonObj));
        props.dispatchloader(true)
        const _resultAddUserOrder = await postApiCall('POST', $Service_Url.postAddUserOrder, jsonObj);
        konsole.log("_resultAddUserOrder", _resultAddUserOrder)
        if (_resultAddUserOrder == 'err') {
            return;
        }
        setOrderId(_resultAddUserOrder?.data?.data?.order?.orderId);
        props.dispatchloader(false);
    }




    // @this functon for handle Increment and decrement of product quantity
    const handleQuantityBtn = (index, type) => {
        setProductList(prev => {
            let newArray = [...prev]
            const newQuantity = (type == 'ADD') ? newArray[index].quantity + 1 : newArray[index].quantity - 1;
            if (newQuantity > 0) {
                const productPriceVal = newArray[index].productPrice;
                const totalProductPriceVal = newQuantity * productPriceVal;
                const discountAmt = returnPercentageCalculate(newArray[index].subtenantRateCardId, totalProductPriceVal, discountDetailsList);
                konsole.log("discountAmtdiscountAmt", discountAmt, newQuantity)
                newArray[index].quantity = newQuantity;
                newArray[index].totalProductPrice = totalProductPriceVal;
                newArray[index].discountAmt = discountAmt;
                newArray[index].paidProductPrice = totalProductPriceVal - discountAmt;
            }
            return newArray;
        })
    }


    const handleConfirmCheckout = (val) => {
        setIsConfirmOrderSummary(val)
        if (val == true) {
            setCurrentStep(1)
        } else {
            setCurrentStep(0)
        }
    }

    konsole.log("tabConsole", productList, isFuturePayment, _paymentDate , _todayDate, $AHelper.getDateDiff(_paymentDate, _todayDate), paymentDate)

    if(isFuturePayment) return (
        <AmaFuturePayment callerReference={callerReference} clientData={clientData} subscriptionId={subscriptionId} subtenantId={subtenantId} paymentDate={_paymentDate} paidAmount={paidAmount} funForOrderIdUpdate={funForOrderIdUpdate} dispatchloader={props.dispatchloader} handleIsShow={handleIsShow}
            refrencePage={refrencePage}
        />
    )
    return (
        <>
            <style jsx global>{`
        .modal-open .modal-backdrop.show {
          opacity: 0.5 !important;
        }
      `}</style>

            {isNotValidNullUndefile(orderId) &&
                <AmaPayment
                    clientData={clientData}
                    orderId={orderId}
                    subtenantRateCardId={subtenantRateCardId}
                    refrencePage={refrencePage}
                    isPortalSignOn={isPortalSignOn}
                />}
            {/* <Modal show={(demo) ? show : false} onHide={() => handleIsShow()} backdrop="static" size={`${currentStep == 0 ? "xl" : 'md'}`} animation="false" variant="white" className="">
                <Modal.Body className='AmaOrderSummary'>
                    <h1 className='text-center'>Payment Details</h1>
                    <div id='AmaOrderSummary'>
                        <Container>
                            @Header Stepper------
                            <AmaStepper setCurrentStep={setCurrentStep} currentStep={currentStep} />
                            @Header Stepper------
                            <h2 className='text-center mb-4'>Order Confirmation</h2>

                            <div>
                                {(currentStep == 0) ? <>

                                    @@ORDER SUMMARY 
                                    <Row>
                                        <Col xs={12} md={7} lg={6}>
                                            <Card className="w-full max-w-lg mx-auto  product_details">
                                                <Card.Header className='product_details_heading'>
                                                    <Card.Title><h3>Order Summary</h3><span style={{ fontSize: "12px" }}> Review & Check your orders</span></Card.Title>
                                                    <Card.Text>Review & checked your orders</Card.Text>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className='mt-5 order_details_table'>
                                                        <div className='border-bottom'>
                                                            <Row className='text-center fw-bold'>
                                                                <Col xs={5} md={5} lg={5}>Product Name</Col>
                                                                <Col xs={3} md={3} lg={3}>Quantity</Col>
                                                                <Col xs={4} md={4} lg={4}>Price</Col>
                                                            </Row>
                                                        </div>
                                                        {(productList?.length > 0) ? <>
                                                            {productList?.map((item, index) => {
                                                                konsole.log("orderSummeryDetailsItem", item)
                                                                const { productName, quantity, productPrice, totalProductPrice } = item;
                                                                return <>
                                                                    <div key={index} className='border mt-2 p-2 rounded'>
                                                                        <Row className='text-center '>
                                                                            <Col xs={5} md={5} lg={5} className=''>{productName}</Col>
                                                                            <Col xs={3} md={3} lg={3} className='text-center'>
                                                                                <button class onClick={() => handleQuantityBtn(index, 'SUBS')} >-</button>
                                                                                {quantity}
                                                                                <button onClick={() => handleQuantityBtn(index, 'ADD')}>+</button>
                                                                            </Col>
                                                                            <Col xs={4} md={4} lg={4} className=''>${totalProductPrice}</Col>
                                                                        </Row>
                                                                    </div>
                                                                </>
                                                            })}
                                                        </> : <p className='text-center mt-3'>No Data Found</p>}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        @@PRICE SUMMARY
                                        <Col xs={12} md={5} lg={6} className="mt-md-0 mt-3"> Add custom class for margin-top
                                            <Card className="w-full max-w-lg mx-auto  product_details">
                                                <Card.Header className='product_details_heading'>
                                                    <Card.Title>Price Summary</Card.Title>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className='order_details_table'>
                                                        {(productList?.length > 0) ? <>
                                                            {productList?.map((item, index) => {
                                                                const { productName, quantity, productPrice, discountAmt, totalProductPrice } = item;
                                                                return <>
                                                                    <Card key={index} className="w-full max-w-lg mx-auto mt-2" >
                                                                        <Card.Body>
                                                                            <HeaderColCom xs1={3} md1={3} lg1={3} xs2={9} md2={9} lg2={9} label1={'Product'} label2={productName} className1={'fw-bold'} className2={'text-end'} />
                                                                            <HeaderColCom xs1={4} md1={4} lg1={4} xs2={8} md2={8} lg2={8} label1={'Price'} label2={<>${totalProductPrice}</>} className1={'fw-bold'} className2={'text-end'} />
                                                                            <HeaderColCom xs1={4} md1={4} lg1={4} xs2={8} md2={8} lg2={8} label1={'Discount'} label2={<>${discountAmt}</>} className1={'fw-bold'} className2={'text-end'} />
                                                                        </Card.Body>
                                                                    </Card>
                                                                </>
                                                            })}
                                                            <Card className="w-full max-w-lg mx-auto mt-2">
                                                                <Card.Body>
                                                                    <HeaderColCom label1={'Sub Total'} label2={<>${totalAmount}</>} className1={'fw-bold'} className2={'text-end'} />
                                                                    <HeaderColCom label1={'Total Discount'} label2={<>${totalAmount - paidAmount}</>} className1={'fw-bold'} className2={'text-end'} />
                                                                    <HeaderColCom label1={'GRAND TOTAL'} label2={<b>${paidAmount}</b>} className1={'fw-bold mt-2'} className2={'text-end mt-2'} />
                                                                </Card.Body>
                                                            </Card>
                                                        </> : <p className='text-center mt-3'>No Data Found</p>}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                            <div className='d-flex justify-content-between mt-4 m-2'>
                                                {productList?.length > 0 &&
                                                    <button className='confirmNCheckoutBtn' onClick={() => addOrderUser()} >Confirm & Checkout</button>}
                                                <button className='confirmNCheckoutBtn ms-1' onClick={() => handleIsShow(true)}>Cancel</button>
                                            </div>
                                            {productList?.length > 0 &&
                                                <div className='d-flex justify-content-center mt-4'>
                                                    <button className='confirmNCheckoutBtn' onClick={() => handleConfirmCheckout(true)}>Confirm & Checkout</button>
                                                </div>}
                                            <div className='d-flex justify-content-center mt-3'>
                                                <button className='confirmNCheckoutBtn' onClick={() => handleIsShow()}>Cancel</button>
                                            </div>
                                        </Col>
                                    </Row></> : <>
                                    @@MAKE PAYMENT
                                    <div>
                                        {productList?.length > 0 &&
                                            <div className='d-flex justify-content-center mt-5'>
                                                <button className='w-50 confirmNCheckoutBtn' onClick={() => addOrderUser()}>Make Payment</button>
                                            </div>}
                                        <div className='d-flex justify-content-center mt-3'>
                                            <button className='w-50 confirmNCheckoutBtn' onClick={() => handleConfirmCheckout(false)}>Cancel</button>
                                        </div>
                                    </div>

                                </>}
                            </div>
                        </Container>
                    </div>
                </Modal.Body >
            </Modal > */}
        </>
    )
}

const HeaderColCom = ({ xs1, md1, lg1, xs2, md2, lg2, label1, label2, className1, className2 }) => {
    return <>
        <Row>
            <Col xs={xs1} md={md1} lg={lg1} className={className1}>{label1}</Col>
            <Col xs={xs2} md={md2} lg={lg2} className={className2}>{label2}</Col>
        </Row>
    </>
}

function returnPercentageCalculate(subtenantRateCardId, endSubscriptionAmt, discountDetailsList) {
    konsole.log("returnPercentageCalculate", subtenantRateCardId, endSubscriptionAmt, discountDetailsList);
    const _resultOfFind = discountDetailsList?.find(item => item?.subtenantRateCardId == subtenantRateCardId);
    konsole.log("_resultOfFind", _resultOfFind);
    if (isNotValidNullUndefile(_resultOfFind) && _resultOfFind?.percentMaxAllowed != 0 && isNotValidNullUndefile(_resultOfFind?.percentMaxAllowed)) {
        return (_resultOfFind.percentMaxAllowed / 100) * endSubscriptionAmt
    } else if (isNotValidNullUndefile(_resultOfFind) && _resultOfFind?.amtMaxAllowed != 0 && isNotValidNullUndefile(_resultOfFind?.amtMaxAllowed)) {
        konsole.log("endSubscriptionAmt", endSubscriptionAmt, _resultOfFind.amtMaxAllowed)
        return _resultOfFind.amtMaxAllowed;
    }
    return 0;
}


function returnTotalPaidPrice(key, userPlansList) {
    const _amount = userPlansList?.length > 0 ? userPlansList?.reduce((acc, current) => acc + current[key], 0) : 0;
    console.log("_amount_amount", _amount, userPlansList)
    return _amount;
}



export default AmaOrderSummary
