import React,{useState,useEffect,useRef, useContext} from 'react'
import {Row, Col,Card,Table} from 'react-bootstrap';
import PaymentMethod from './PaymentMethod';
import { Services } from '../network/Service';
import konsole from '../control/Konsole';
import { $AHelper } from '../control/AHelper';
import { getApiCall, isNullUndefine } from '../Reusable/ReusableCom';
import { $Service_Url } from '../network/UrlPath';
import { isNotValidNullUndefile } from '../Reusable/ReusableCom';
import PdfViewDocument from '../paralLegalComponent/Datatable/PdfViewDocument';
import { globalContext } from '../../pages/_app';

const PlansSetting = () => {
   const [show, setShow] = useState(false)
   const [subtenantId, setSubtenantId] = useState("")
   const [userID, setUserID] = useState("")
   const [profileDetails, setProfileDetails] = useState([])
   const [attorneyDetail, setAttorneyDetail] = useState({})
   const [cardDetails, setCardDetails] = useState([])
   const [updateCard, setUpdateCard] = useState(null)
   const [userOrderDetail, setUserOrderDetail] = useState([])
   const [userActiveOrder, setUserActiveOrder] = useState(null)
   const [subsFileId, setSubsFileId] = useState('');
   const [paymentOrderId, setPaymentOrderId] = useState(null)
   const deleteCreditCardRef = useRef();
   const { confirm } = useContext(globalContext);
   const userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary")) || "";
   konsole.log("userPackage",userActiveOrder,userOrderDetail,attorneyDetail,profileDetails,userDetailOfPrimary)

   useEffect(()=>{
      const subtenantID = sessionStorage.getItem("SubtenantId") || "";
      const userId = sessionStorage.getItem("SessPrimaryUserId") || "";
      konsole.log("subtenantID12",subtenantID)
      setSubtenantId(subtenantID)
      setUserID(userId)
      if(userId){
          getSavedSubscriptionDetails(subtenantID,userId)
          getUserProfileFunc(userId)
          getUserOrderDetailsHistory(userId)
      }
   },[])

   const getUserListByRoleIdForAttorneyType = (subtId,attorneyId) => {
       Services.getLoginUserDetails(attorneyId)
       .then((res)=>{
       konsole.log("responseByRoleID",res,subtId,attorneyId)
       if(res.data?.length > 0){
           for(const item of res.data){
               if(item?.subtenantId == subtId && item?.userId == attorneyId){
                const findRole = item?.roleDetails.find(det => det.roleId == 3 || det.roleId == 13 || det.roleId == 14 || det.roleId == 15)
                   const obj = {
                       attorneyName : item?.userFullName,
                       attorneyType : findRole?.roleName ?? "Legal Staff"
                   } 
                   setAttorneyDetail(obj)
               }
           }
       }
       }).catch((err)=>{
           konsole.log("erroorrSaleableSku",err)
       })
   }

   const getUserProfileFunc = (userId) => {
       konsole.log("userIdprofile",userId)
       Services.getUserProfile(userId)
       .then((res)=>{
       konsole.log("responseUserProfile",res)
       const responseData = res.data.data
       setProfileDetails(responseData)
       setCardDetails(responseData[0]?.cards)
       }).catch((err)=>{
           konsole.log("erroorrUserProfile",JSON.parse(JSON.stringify(err)))
           setProfileDetails(JSON.parse(JSON.stringify(err)))
       })
   }

   const getUserOrderDetailsHistory = (userId) =>{
        konsole.log("userIdprofile",userId)
        Services.getUserOrderDetails(userId)
        .then((res)=>{
        konsole.log("responseOrderDetails",res)
        const sortedProducts = filterClosestDate(res.data.data);
        const filterSameDateOrder = filterOrders(sortedProducts)
        const responseWithOrderDateSorting = res.data.data?.length > 0 && res.data.data.sort((a, b) => new Date(b.validityFromDate) - new Date(a.validityFromDate));
        konsole.log("sortedProducts",res.data.data,sortedProducts,filterSameDateOrder,responseWithOrderDateSorting);
        setUserActiveOrder(filterSameDateOrder)
        setUserOrderDetail(responseWithOrderDateSorting)
        }).catch((err)=>{
            konsole.log("erroorrOrderDetails",err)
        })
   }

   const getSavedSubscriptionDetails = async (subtId,userId) => {
    const _resultSubsDetails = await getApiCall("GET", $Service_Url.getUserSubscription + `${subtId}/${true}?SubscriptionId=${"1"}&UserId=${userId}`);
    konsole.log("_resultSubsDetails", _resultSubsDetails);
    if (_resultSubsDetails == 'err' || _resultSubsDetails.length < 0) return;
    let fileid = _resultSubsDetails[0]?.subsFileId
    let orderId = _resultSubsDetails.some(item => item?.orderId != null || item?.isActive == true)
    const attorneyId = _resultSubsDetails[0]?.attorneyId 
    setSubsFileId(fileid)
    setPaymentOrderId(orderId)
    getUserListByRoleIdForAttorneyType(subtId,attorneyId)
}

const filterClosestDate = (items) => {
    const currentDate = new Date();

    // Helper function to check if a date is in the past
    const isPastDate = (date) => {
        const givenDate = new Date(date);
        return givenDate < currentDate.setHours(0, 0, 0, 0); // compare only date part, ignore time part
    };

    // Separate items with valid expiration dates and null expiration dates
    const validItems = items.filter(item => item.expirationDate !== null && !isPastDate(item.expirationDate));
    const nullItems = items.filter(item => item.expirationDate === null);

    // Sort valid items by the absolute difference between the expiration date and the current date
    validItems.sort((a, b) => {
        const dateA = new Date(a.expirationDate);
        const dateB = new Date(b.expirationDate);

        // Calculate the absolute difference in milliseconds
        const diffA = Math.abs(dateA - currentDate);
        const diffB = Math.abs(dateB - currentDate);

        return diffA - diffB;
    });

    // Identify the closest expiration date
    let closestDate = null;
    if (validItems.length > 0) {
        closestDate = new Date(validItems[0].expirationDate);
    }

    // Filter valid items to include only those with the closest expiration date
    const filteredValidItems = validItems.filter(item => new Date(item.expirationDate).getTime() === closestDate.getTime());

    // Include items with the same validityFromDate as those with the closest expiration date, and not expired
    const closestValidityFromDate = filteredValidItems.length > 0 ? filteredValidItems[0].validityFromDate : null;
    const sameValidityFromDateItems = validItems.filter(item => item.validityFromDate === closestValidityFromDate && !isPastDate(item.validityFromDate));

    // Merge the items with the closest expiration date and the items with the same validityFromDate, avoiding duplicates
    const mergedItems = new Set();
    filteredValidItems.forEach(item => mergedItems.add(item));
    sameValidityFromDateItems.forEach(item => mergedItems.add(item));

    // Convert the Set back to an array
    const uniqueValidItems = Array.from(mergedItems);

    // Filter null items based on productType being "Lifetime" or "Free"
    const filteredNullItems = nullItems.filter(item => item.productType === "Lifetime" || item.productType === "Free");

    // Combine the filtered valid items with the filtered null items
    return [...uniqueValidItems, ...filteredNullItems];
};





const filterOrders = (items) => {
    const orderGroups = {};
    const result = [];

    // Group items by orderId
    items.forEach(item => {
        if (!orderGroups[item.orderId]) {
            orderGroups[item.orderId] = [];
        }
        orderGroups[item.orderId].push(item);
    });

    // Add items with the same orderId to result array
    Object.keys(orderGroups).forEach(orderId => {
        result.push(...orderGroups[orderId]);
    });

    // Filter items with productType "Free" or "Lifetime"
    const freeOrLifetimeItems = items.filter(item => 
        item.paidAmount === 0 || item.productType === "Lifetime"
    );

    // Remove duplicates from freeOrLifetimeItems that are already in result
    freeOrLifetimeItems.forEach(item => {
        if (!result.some(r => r.orderId === item.orderId && r.productType === item.productType)) {
            result.push(item);
        }
    });

    return result;
};

  const isDateCloserToCurrent = (givenDateString) => {
    const currentDate = new Date();
    const givenDate = new Date(givenDateString);

    // Zero out the time part of the dates for comparison
    currentDate.setHours(0, 0, 0, 0);
    givenDate.setHours(0, 0, 0, 0);

    const diff = givenDate - currentDate;

    // Return true if the given date is in the future or exactly the same as the current date
    return diff >= 0;
};


   const addCardDetails = () =>{
    setUpdateCard(null)
    setShow(true)
   }

   const updateCardDetail = (data) =>{
    setUpdateCard(data)
    setShow(true)
   }

   const deleteCard = async(data) =>{
    let confirms = await confirm(true,'Are you sure you want to delete this card ?','Confirmation')
    if(confirms == false) return;
    deleteCreditCardRef.current.deleteCardDetails(data);
   }

   const handleClose = () =>{
    setShow(false)
   }

   konsole.log("Dattettete",isDateCloserToCurrent(userActiveOrder?.expirationDate),userActiveOrder)

  return (
    <>
    <PaymentMethod show = {show} handleClose = {handleClose} getUserProfileFunc = {getUserProfileFunc} updateCard = {updateCard} ref = {deleteCreditCardRef} profileDetails = {profileDetails} alreadyAddedCards = {cardDetails} key={show}/>
    <Row className='mt-4'>
      <Col lg={6} md={6} sm={12}>
        <Card className='mb-4 p-2'>
          <Card.Body>
          <Row className='mb-4'>
            <Col lg="8" md="8" sm="12" xs="12"><div><h4 className='fw-bold'>Annual Maintenance Plan</h4></div></Col>
            <Col lg="3" md="3" sm="12" xs="12">
            <div style={userActiveOrder?.length > 0 ? {border:"1px solid #4DAF00",backgroundColor:"#FFFFFF",width:"70px"}: {border:"1px solid red",backgroundColor:"#FAE0E0",width:"70px"}} className='d-flex p-1 rounded-pill justify-content-center align-items-center'>
            <div className='rounded-circle me-1' style={userActiveOrder?.length > 0 ? {border:"3px solid green"} : {border:"3px solid D70101"}}></div>
            <div style={userActiveOrder?.length > 0 ? {color:"#4DAF00"} : {color:"red"}}>{`${userActiveOrder?.length > 0 ? "Active" : "Inactive"}`}</div>
            </div>
        </Col>
        </Row>
       {userActiveOrder?.length > 0 && userActiveOrder.map((item,ind)=>{
        return(
            <Card className='m-2'>
                <Card.Body>
                <Row>
            <Col lg="5" md="5" sm="12">
            <div className='plansSettingText fw-bold'>Products Included: </div>
            </Col>
            <Col lg="7" md="7" sm="12">
            <div className='plansSettingText'>
            {item?.productName && <li>{item?.productName}</li>}
            </div>
            </Col>
        </Row>
        <Row>
            <Col lg="12" md="12" sm="12" className='mt-3'>
            <div style={{color:"#808080",fontSize:"12px",fontWeight:"400"}}>{item?.description}</div>
            </Col>
        </Row>
        <Row className='d-flex align-items-center justify-content-center'>
            <Col lg="5" md="12" sm="12" xs="12" className='mt-3'>
            <div className='d-flex align-items-center'>
                <div>
                    <img src='./images/validityWatchImg.png' alt='Validity Icon' />
                </div>
                <div className='mt-2 ms-2'>
                    <span className='fw-bold'>Valid Till:</span> {item?.expirationDate ? $AHelper.getFormattedDateForCE(item?.expirationDate) : item?.productType == "Lifetime" || item?.productType == "Free" ? item?.productType : ""}
                </div>
            </div>
            </Col>
            <Col lg="7" md="12" sm="12" xs="12" className='mt-3'>
            <div className='d-flex align-items-center'>
                <div>
                 <img src='./images/validityWatchImg.png' alt='Validity Icon' />
                </div>
            <div className='mt-2 ms-2'><span className='fw-bold'>Last Renewed on: </span>{item?.validityFromDate ? $AHelper.getFormattedDateForCE(item?.validityFromDate) : ""}</div>
            </div>
            </Col>
        </Row>
        <Row>
        <Col lg="12" md="12" sm="12" xs="12">
            <div className="d-flex justify-content-center mb-0 AMABorder">
                <div className="borderStylesInAMA">{/* Horizontal Line */}</div>
            </div>
            </Col>
        </Row>
        <Row>
            <Col lg="12" md="12" sm="12" xs="12" className='mt-3'>
                <div className='d-flex align-items-center'>
                    <div className='fw-bold'>Payment :</div>  
                {/* {profileDetails?.length > 0 && profileDetails[0]?.cards.map((item,index)=>(
                        (item.isDefault == true || item.isActive == true) && ( */}
                <div className='d-flex justify-content-center align-items-center mb-1'>
                    <div className='d-flex align-items-center ms-2'>
                        {/* <div>
                            <img src='./images/AnnualBillCalendarImg.png' style={{height:"16px",width:"16px"}}/>
                        </div> */}
                        {item?.paidAmount && <div className='mt-2'>{`$${item?.paidAmount}, Billed ${item?.productType}`}</div>}
                    </div>
                    {/* <div className='d-flex align-items-center ms-2'>
                    (<div className='ms-1'>
                        <img src='./images/visa.svg' style={{height:"18px",width:"20px"}}/>
                    </div>
                    <div className='text-danger ms-2 mt-1 me-1'>
                        {`${item.cardType} ending ****${$AHelper.getLastCharacter(item.cardNumber,4)}`}    
                    </div>)
                    </div> */}
                    </div>
                        {/* )
                    ))} */}
                </div>
            </Col>
            </Row>
            </Card.Body>
        </Card>)})}

        <Row>
        <Col lg="12" md="12" sm="12" xs="12">
            <div className="d-flex justify-content-center mb-0 AMABorder">
                <div className="borderStylesInAMA">{/* Horizontal Line */}</div>
            </div>
            </Col>
        </Row>
        <Row>
            <Col lg="6" md="12" sm="12" className='mt-4'>
        <div className='d-flex'>
        <div>
            <img src='./icons/ProfilebrandColor.svg' style={{height:"48px",width:"48px"}}/>
        </div>
          <div className='m-2 ms-3'>
            <p style={{fontSize:"16px",fontWeight:"bold"}}>{attorneyDetail?.attorneyName}</p>
            <p style={{fontSize:"11px",color:"rgba(147, 147, 147, 1)"}}>{attorneyDetail?.attorneyType}</p>
          </div>
        </div>
            </Col>
            {(paymentOrderId == true) &&
            <Col lg="4" md="12" sm="12" className='mt-4'>
                <PdfViewDocument viewFileId={subsFileId} buttonName="DownloadAMAFromPlansSetting" primaryName={userDetailOfPrimary?.memberName} />
            </Col>
            }
        </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={6} md={6} sm={12}>
        <Card className='mb-4 p-2'>
          {/* Content for the second card */}
          <Card.Body>
          <Row>
            <Col lg="8" md="8" sm="12" xs="12"><div><h4 className='fw-bold'>Payment Method Used</h4></div></Col>
        </Row>
        <Row>
            <Col lg="12" md="12" sm="12" className='mt-3'>
            <div style={{color:"#808080",fontSize:"12px",fontWeight:"400"}}>Choose the option that suits you best for a hassle-free and reliable payment experience.</div>
            </Col>
        </Row>
        <Row className='d-flex justify-content-center align-items-center excelscroll'>
            <Col lg="11" md="12" sm="12" xs="12">
                {cardDetails.map((item,ind)=>(
                    (item?.cardIsActive == true || item?.cardIsActive == null) && (
                <Row className='p-2 d-flex align-items-center justify-content-between mt-4' style={{border:"1.5px solid #ECECEC",borderRadius:"8px"}}>
                    <Col lg="7" md="12" sm="12" xs="12">
                    <div className='d-flex'>
                <div>
                    <img src='./images/visa.svg' style={{height:"48px",width:"48px"}}/>
                </div>
                <div className='m-2 ms-3'>
                    <p style={{fontSize:"14px",fontWeight:"bold"}}>Visa Ending In {$AHelper.getLastCharacter(item?.cardNumber,4)}</p>
                    <p style={{fontSize:"11px",color:"rgba(147, 147, 147, 1)"}}>Expiry {item?.expireDate}</p>
                </div>
                </div>      
                    </Col>
                    <Col lg="2" md="3" sm="4" xs="4">
                    <div className='d-flex justify-content-center align-items-center me-3'>
                    {item?.isDefault == true && <div style={{border:"1.2px solid #333333",color:"#333333",fontSize:"8px",fontWeight:"600"}} className='px-1 py-1 rounded-pill'>Default</div>}    
                    </div>
                    </Col>
                    <Col lg="2" md="3" sm="4" xs="4">
                    <div className='d-flex justify-content-center align-items-center px-1 py-2 border-0 cursor-pointer' style={{backgroundColor:"#720c20",color:"white",borderRadius:"8px",fontSize:"12px",fontWeight:"600"}} onClick={()=>updateCardDetail(item)}>
                        <div>Edit</div>
                    </div>
                    </Col>
                    <Col lg="1" md="2" sm="4" xs="4">
                        <div className='mb-2 cursor-pointer' onClick={()=>deleteCard(item)}><img src='./images/deleteCardIcon.svg'/></div>
                    </Col>
                </Row>)))}
            </Col>
        </Row>
                <Row className='d-flex justify-content-center'> 
                    <Col lg="11" md="12" sm="12" xs="12">
                        <div className='planSettingAddNewBtn p-3 cursor-pointer' onClick={()=>addCardDetails()}>+ Add New</div>
                    </Col>
                </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Card>
        <Card.Body>
        <Row>
        <Col lg="12" md="12" sm="12" xs="12" className='p-3'>
        <Row>
            <Col lg="8" md="8" sm="12" xs="12"><div><h4 className='fw-bold'>Products/Plans History</h4></div></Col>
        </Row>
        <Row>
            <Col lg="12" md="12" sm="12" className='mt-2'>
            <div style={{color:"#808080",fontSize:"12px",fontWeight:"400"}}>View your products/plans history</div>
            </Col>
            <Row>
                <Col lg="12" md="12" sm="12" xs="12" className='mt-4'>
                <Table className='plansSettingTable text-center' responsive bordered>
                    <thead style={{borderTop:"1.6px solid #ECECEC",borderBottom:"1.6px solid #ECECEC",backgroundColor:"#F2F2F2"}}>
                        <tr>
                        <th>Products/Plans Name</th>
                        <th>Order No.</th>
                        <th>Order Date</th>
                        <th>Expiration Date</th>
                        <th>Auto Renewal Date</th>
                        <th>Products/Plans Type</th>
                        <th>Amount</th>
                        {/* <th></th> */}
                        </tr>
                    </thead>
                    <tbody>
                    {userOrderDetail?.length > 0 && userOrderDetail.map((item, ind)=> (
                        <tr key={ind}>
                        <td >{item.productName}</td>
                        <td>{item.orderId}</td>
                        <td>{item.validityFromDate ? $AHelper.getFormattedDateForCE(item.validityFromDate) : ""}</td>
                        <td>{item.expirationDate ? $AHelper.getFormattedDateForCE(item.expirationDate) : ""}</td>
                        <td>{item.nextRenewalDate ? $AHelper.getFormattedDateForCE(item.nextRenewalDate) : ""}</td>
                        <td>{item.productType}</td>
                        <td>{item.paidAmount || item.paidAmount == 0 ? `$${item.paidAmount}` : ""}</td>
                        {/* <td><div className='d-flex justify-content-center align-items-center border-0 cursor-pointer' style={{backgroundColor:"#720c20",borderRadius:"8px",height:"36px",width:"35px"}}>
                        <img src='./images/DownloadPlanDetailIcon.svg' style={{height:"15px",width:"15px"}} className='mb-1'/>
                        </div>
                        </td> */}
                        </tr>
                        )
                    )}
                    </tbody>
                </Table>
                </Col>
            </Row>
        </Row>
        </Col>
    </Row>
        </Card.Body>
    </Card>
    </>
    
  )
}

export default PlansSetting