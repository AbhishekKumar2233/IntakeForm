import React,{useState,useEffect,useRef, useContext} from 'react'
import {Row, Col} from 'react-bootstrap'
import { getApiCall, isNotValidNullUndefile,postApiCall, recurringErrorHandled, getNextInstallmentDate } from '../../components/Reusable/ReusableCom'
import { Services } from '../../components/network/Service'
import { $Service_Url } from '../../components/network/UrlPath'
import NewPaymentModal from './NewPaymentModal'
import { $AHelper } from '../Helper/$AHelper'
import usePrimaryUserId from '../Hooks/usePrimaryUserId'
import { useLoader } from '../utils/utils'
import { globalContext } from '../../pages/_app'
import NewPamentGateway from './NewPamentGateway.js'
import AnnualAgreemetModal from '../../components/paralLegalComponent/Datatable/AnnualAgreemetModal.js'
import { $CommonServiceFn } from '../../components/network/Service'


const ProductPlans = () => {
    const [show, setShow] = useState(false)
    const [profileDetails, setProfileDetails] = useState([])
    const [attorneyDetail, setAttorneyDetail] = useState({})
    const [cardDetails, setCardDetails] = useState([])
    const [cardDetailsFee, setCardDetailsFee] = useState([])
    const [updateCard, setUpdateCard] = useState(null)
    const [userOrderDetail, setUserOrderDetail] = useState([])
    const [userActiveOrder, setUserActiveOrder] = useState(null)
    const [subsFileId, setSubsFileId] = useState('');
    const [subsFileIdFee, setSubsFileIdFee] = useState('')
    const deleteCreditCardRef = useRef();
    const [currentPage, setCurrentPage] = useState(1);
    const {primaryMemberFullName,primaryUserId,subtenantId,loggedInUserId, spouseFullName, userDetailOfPrimary} = usePrimaryUserId()
    const [subsDetails, setSubsDetails] = useState()
    const [subsDetailsFee, setSubsDetailsFee] = useState()
    const [paymentInnerjson, setPaymentInnerjson] = useState()
    const textCenter = "d-flex justify-content-center"
    const textStart = "d-flex justify-content-start"
    const [orderIdData, setOrderIdData] = useState()
    const [planTotalCost, setPlanTotalCost] = useState()
    const { setWarning } = useContext(globalContext)
    const OrderId = window.location.search;    
    const paymentSuccesStatus = $AHelper.$getQueryParameters( OrderId, "TrxnStatus")
    const OrderIdNew = $AHelper.$getQueryParameters( OrderId, "OrderId")
    const [showAmaModal, setshowAmaModal] = useState(false);
    const [clientDataForAma, setClientDataForAma] = useState({});
    const [authorizeSubscriptionId, setauthorizeSubscriptionId] = useState(null);
    const [futureAuthorizeSubscriptionId, setfutureAuthorizeSubscriptionId] = useState(null);
    const [matterNumber, setMatterNumber] = useState('')
    const [anualAgreementData, setAnualAgreementData] = useState('')
    const [feeAgreementPlans, setFeeAgreementPlans] = useState('')
    const [cardType, setCardType] = useState('')
    const [newAMAPaymentStatus, setNewAMAPaymentStatus] = useState({});




    useEffect(() => {
        let paymentState =JSON.parse(sessionStorage.getItem('paymentState'));
        let stateOfPayment = sessionStorage.getItem('stateOfPayment');
     if(paymentSuccesStatus == "SUCCESS" && isNotValidNullUndefile(subtenantId) && isNotValidNullUndefile(primaryUserId) && isNotValidNullUndefile(subsDetails)){
        if(paymentState?.isActive == true) fetchDataAfterPaymentSuccess(subtenantId,primaryUserId)
        else if(stateOfPayment == "annualAgreement") {
            completeAMAPaymentProcess()
        }
     }
    }, [subtenantId,primaryUserId,subsDetails])


    const completeAMAPaymentProcess = () => {        
        const requiredJsonForAMA = {
            "memberId": primaryUserId,
            "memberName": primaryMemberFullName,
            "primaryEmailAddress": (userDetailOfPrimary?.userName || userDetailOfPrimary?.primaryEmailId) ?? "",
            "primaryPhoneNumber": userDetailOfPrimary?.userMob ?? "",
            "spouseName": spouseFullName,
            "subtenantId": subtenantId
        }
        
        setClientDataForAma(requiredJsonForAMA)
        setNewAMAPaymentStatus({
            isPaymentStatus: paymentSuccesStatus,
            isPaymentOrderId: OrderIdNew,
        })
        setshowAmaModal(true);
        // clear entry point
        sessionStorage.removeItem("stateOfPayment");
        const url = window.location.origin + window.location.pathname;
        window.history.pushState({ path: url }, '', url);
    }
  
const fetchDataAfterPaymentSuccess = async(subtenantId1)=>{
    useLoader(true)
    sessionStorage.removeItem("paymentState") 
    const currentDate = new Date();
    const extendedDate =new Date();
    const currentPlusOneYear = new Date(extendedDate.setFullYear(extendedDate.getFullYear() + 1));  
    const {attorneyId,subsStatusId,subscriptionId,subtenantId,userSubscriptionId,subsFileId} = subsDetails || {}
    const jsonObjForUpsert = {
        "userId": primaryUserId, "attorneyId": attorneyId, "isActive": true,
        "subsStatusId": subsStatusId, "skuListId": null,
        "subscriptionId": subscriptionId, "subtenantId": subtenantId,
        "userSubscriptionId": userSubscriptionId, "subsFileId": subsFileId,
        "userLinkId": null, "orderId": OrderIdNew, "updatedBy": loggedInUserId, validityFrom: currentDate, validityTo: currentPlusOneYear,
    };
    const _resultUpsertUserSubscription = await postApiCall('PUT', $Service_Url.putUserSubUpdate, jsonObjForUpsert);
    useLoader(true)
    const _getDataReturn = await getUserProfileFunc(primaryUserId)
    if(_getDataReturn == 'err'){return}
    const _resultOfOrderinfo = await getApiCall('GET', $Service_Url.get_Order_Info + '/' + primaryUserId + '/' + OrderIdNew, ''); // for GEt details of order info
    if(_resultOfOrderinfo == 'err'){return}
    const {customerProfileId,cards} = _getDataReturn[0] || {}    
    const filteredCard = cards?.filter((ele)=>ele?.isDefault == true)
    const {cardNumber,expireDate,paymentProfileId} = filteredCard[0] || {}
    let stateObj=JSON.parse(sessionStorage.getItem('stateObj'));
  
    const jsonPost = {
        "userLoginId": stateObj?.loggenInId, "userId": primaryUserId,
        "subscriptionName": "Annual Maintenance Agreement",
        "paySchedule": { "length": "365", "unit": "days" },
        "totalOccurrences": 9999, "amount": _resultOfOrderinfo?.order?.totalCost,
        "customerProfileId": customerProfileId,
        "paymentProfileId": paymentProfileId,
        "cardNumber": cardNumber, "expirationDate": expireDate
    }
    const _resultOfCreateSubs = await recurringErrorHandled(jsonPost);
    const url = new URL(window.location.href);  
    url.search = ''; 
    useLoader(false); 
    window.history.replaceState(null, "", url.toString())
    fetchAllData(primaryUserId)
}

    useEffect(()=>{        
        if(primaryUserId){
            fetchAllData(primaryUserId)
            fetchMemberDetails(primaryUserId);
        }
    },[primaryUserId])



    const fetchAllData = async (userId) => {
        const subtenantID = sessionStorage.getItem("SubtenantId") || "";
        useLoader(true);     
            const _result1 = await getSavedSubscriptionDetails(subtenantID, userId,'1')
            const _resultFeeAgrrement = await getSavedSubscriptionDetails(subtenantID, userId,'2')
            if(_resultFeeAgrrement !== 'err'){setAnualAgreementData(_resultFeeAgrrement)}            
            const _result2= await getUserProfileFunc(userId)
            const _result3 = await getUserOrderDetailsHistory(userId)                    
            useLoader(false); 
            if (_result2 !== 'err') {
                if (_result1 !== 'err') {
                    filteredCard(_result2, _result1, setCardDetails);
                }
                if (_resultFeeAgrrement !== 'err') {
                    filteredCard(_result2, _resultFeeAgrrement, setCardDetailsFee);
                }
            }
            
           
            
          
    };   

     const filteredCard =(_result2,_result1,setData)=>{
        if(_result2.length > 0 && _result1 !== 'err' && _result2 !== 'err' && _result1[0]?.authorizeSubscriptionId !== "Duplicate"){
            const filteredCard = _result2[0]?.cards?.filter((ele)=>ele?.paymentProfileId == _result1[0]?.authorizePaymentProfileId)
            setData(filteredCard)
          
          } 

     }


    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }

    useEffect(() => {
         if(isNotValidNullUndefile(subsDetails)){
            fetchAllRenewData(subsDetails,1)
         }
         if(isNotValidNullUndefile(subsDetailsFee)){
            fetchAllRenewData(subsDetailsFee,2)
         }
    }, [subsDetails,subsDetailsFee])
      


    const fetchAllRenewData = async(data,type)=>{
        useLoader(true)
        const _resultPlansDetails = await getApiCall("GET", `${$Service_Url.getUserSubscriptionPlans}?UserSubscriptionId=${data?.userSubscriptionId}&IsActive=${true}`);
        if(_resultPlansDetails == 'err'){return}

        if(type == 2){
            setFeeAgreementPlans(_resultPlansDetails)
        }
        
        let subscriptionId = 1;
        const _resultOfSubsDetails = await getApiCall('GET', $Service_Url.getSubscriptionDetails + subtenantId + "/" + subscriptionId, '')
        useLoader(false)
        const mergedJson = _resultPlansDetails.map(plan1 => {
            return _resultOfSubsDetails[0]?.subsPlans
                .filter(plan2 => plan2.subsPlanSKUs.some(sku => sku.skuListId === plan1.skuListId))
                .map(plan2 => ({
                    index: _resultOfSubsDetails[0]?.subsPlans.indexOf(plan2),
                    subsPlanId: plan1.subsPlanId,
                    subscriptionPlanName: plan1.subscriptionPlanName,
                    skuDetails: plan2.subsPlanSKUs.find(sku => sku.skuListId === plan1.skuListId)
                }));
        }).flat();        
        const totalEndSubscriptionAmt = mergedJson.reduce((total, item) => total + item.skuDetails.endSubscriptionAmt, 0);
        setPlanTotalCost(totalEndSubscriptionAmt)

      const productDetails = mergedJson.map((item, index) => {
        const {endSubscriptionAmt,subtenantRateCardId,skuListName} = item.skuDetails   
        let productName = index === 0 ? "Annual Maintenance Agreement" : skuListName;      
          if (productName.includes("_")) {
              productName = productName.split("_")[1];
          }      
                
        return {
          productType: "AMA",
          productId: subtenantRateCardId,
          productName: productName || "",
          quantity: 1,
          productPrice: endSubscriptionAmt,
          subtenantRateCardId: subtenantRateCardId,
          totalProductPrice: endSubscriptionAmt,
          paidProductPrice: endSubscriptionAmt,
          isActive: true
        };
      });
      setPaymentInnerjson(productDetails)
    }  



    const getSavedSubscriptionDetails = async (subtId, userId,SubscriptionId) => {       
        return new Promise(async (resolve, reject) => {
            const _resultSubsDetails = await getApiCall("GET", $Service_Url.getUserSubscription + `${subtId}/${true}?SubscriptionId=${SubscriptionId}&UserId=${userId}`);
            resolve(_resultSubsDetails)
            if (_resultSubsDetails === 'err' || _resultSubsDetails.length === 0) {
                useLoader(false);
                return;
            }
            
            let fileid = _resultSubsDetails[0]?.subsFileId
            if(SubscriptionId == '1'){
                setSubsFileId($AHelper.$isNumber(fileid) ? fileid : '');
                setSubsDetails(_resultSubsDetails[0])
            }else{
                setSubsFileIdFee($AHelper.$isNumber(fileid) ? fileid : '')
                setSubsDetailsFee(_resultSubsDetails[0])
            }
            let orderId = _resultSubsDetails.some(item => item?.orderId != null || item?.isActive == true)
            const attorneyId = _resultSubsDetails[0]?.attorneyId
            const _authorizeSubscriptionId = _resultSubsDetails[0]?.authorizeSubscriptionId;
            const _futureAuthorizeSubscriptionId = _resultSubsDetails[0]?.futureAuthorizeSubscriptionId;
           
            setauthorizeSubscriptionId($AHelper.$isNumber(_authorizeSubscriptionId) ? _authorizeSubscriptionId : null)
            if(SubscriptionId == '1'){ setfutureAuthorizeSubscriptionId(_futureAuthorizeSubscriptionId)}           
            getUserListByRoleIdForAttorneyType(subtId, attorneyId)
        })       
    }

    const getUserOrderDetailsHistory = (userId) => {   
        Services.getUserOrderDetails(userId).then((res) => {
            const sortedProducts = filterClosestDate(res.data.data);
            const filterSameDateOrder = filterOrders(sortedProducts)
            const responseWithOrderDateSorting = res.data.data?.length > 0 && res.data.data.sort((a, b) => new Date(b.validityFromDate) - new Date(a.validityFromDate));
            setUserActiveOrder(filterSameDateOrder)
            setUserOrderDetail(responseWithOrderDateSorting)
        }).catch((err) => {
            useLoader(false)
        })
    }
    const getUserListByRoleIdForAttorneyType = (subtId,attorneyId) => {
        Services.getLoginUserDetails(attorneyId).then((res) => {
            if (res.data?.length > 0) {
                for (const item of res.data) {
                    if (item?.subtenantId == subtId && item?.userId == attorneyId) {
                        const findRole = item?.roleDetails.find(det => [3, 13, 14, 15].includes(det.roleId))
                        const obj = {
                            attorneyName: item?.userFullName,
                            attorneyType: findRole?.roleName ?? "Legal Staff"
                        }
                        setAttorneyDetail(obj)
                    }
                }
            }
        }).catch((err) => {
            useLoader(false);
        })
    }


    const filterClosestDate = (items) => {
        const currentDate = new Date();
        const isPastDate = (date) => {
            const givenDate = new Date(date);
            return givenDate < currentDate.setHours(0, 0, 0, 0); // compare only date part, ignore time part
        };
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
   
    const getUserProfileFunc = (userId)=>{
        return new Promise((resolve, reject) => {
            Services.getUserProfile(userId).then((res)=>{
                const responseData = res.data.data
                setProfileDetails(responseData)
                resolve(responseData)
                }).catch((err)=>{
                    setProfileDetails(JSON.parse(JSON.stringify(err)))
                    resolve('err')
                    useLoader(false);
                })    
            
        })
    }
    const updateCardDetail = (data,type) =>{
        setCardType(type)
        setUpdateCard(data)
        setShow(true)
       }


    const DownloadButton = ({id,alignment,btnName,width,padding,onClick ,isDisable}) => (
        <Col lg="4" md="4" sm="4" xs="4" className={`d-flex justify-content-${alignment} mt-auto mb-auto`}>
              <button className="profileDetailsEditButton" style={{border: id == "btn2" ? "none":"2px solid #E8E8E8", borderRadius: "8px", width: width, height: "35px",
                  fontSize: "16px", color: "#1A1A1A", backgroundColor: "#FFFFFF", padding: padding,display:isDisable == true || !isNotValidNullUndefile(userOrderDetail) || userOrderDetail == false ?  "none" : ""}} onClick={()=> id == "btn2" ? "" : onClick()} disabled={isDisable}><div>{btnName}</div>
              </button>
        </Col>
    ); 
     
    const columns = 2;

// Distribute plans across columns
const distributedPlans = Array.from({ length: columns }, (_, colIndex) =>
    userActiveOrder?.filter((_, index) => index % columns === colIndex)
);

const distributedPlansFuture = Array.from({ length: columns }, (_, colIndex) =>
    paymentInnerjson?.filter((_, index) => index % columns === colIndex)?.map(ele => ({ ...ele, "paidAmount": ele?.paidProductPrice}))
);

const distributedServices = isNotValidNullUndefile(feeAgreementPlans) && feeAgreementPlans?.length > 0
  ? Array.from({ length: columns }, (_, colIndex) =>  feeAgreementPlans?.filter((_, index) => index % columns === colIndex)
    )
  : [];


const handleClose = () =>{
    setShow(false)
    fetchAllData(primaryUserId)
   }


 ///////////pagination code////
 const totalItems = userOrderDetail?.length;
 const itemsPerPage = 3;
 const totalPages = Math.ceil(totalItems / itemsPerPage);

 const getCurrentPageData = () => {
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   return userOrderDetail?.slice(startIndex, endIndex);
 };

 const handlePageChange = (pageNumber) => {
   setCurrentPage(pageNumber);
 };
 ////////////////////////////// 
 
 /////////////////download doc//////////
 const viewPdfFile = async(id,fileId) => {
    useLoader(true)
    const _resultDoc = await getApiCall("GET",$Service_Url.getfileUploadDocuments + fileId + `/1`);
    useLoader(false)
    if (_resultDoc !== 'err') {
        let data = 'data:application/pdf;base64,' + _resultDoc?.fileInfo?.fileDataToByteArray;
        let fileName = `${primaryMemberFullName} ${id == 1 ? "Annual Maintenance Agreement.pdf" : "Non-Crisis Fee Agreement"}`
        downloadPDF(data, fileName)
    }

}

const proceedToAMA = ( ) => {
    const requiredJsonForAMA = {
        "memberId": primaryUserId,
        "memberName": primaryMemberFullName,
        "primaryEmailAddress": (userDetailOfPrimary?.userName || userDetailOfPrimary?.primaryEmailId) ?? "",
        "primaryPhoneNumber": userDetailOfPrimary?.userMob ?? "",
        "spouseName": spouseFullName,
        "subtenantId": subtenantId
    }

    setClientDataForAma(requiredJsonForAMA)
    setshowAmaModal(true);
}


const downloadPDF = (fileByteArray, file) => {
    try {
        // Remove the data URL prefix if it exists
        const base64Data = fileByteArray.replace(/^data:application\/pdf;base64,/, '');
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const linkSource = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        const fileName = file;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink); // Append the link to the body
        downloadLink.click();
        document.body.removeChild(downloadLink); // Remove the link after clicking
        URL.revokeObjectURL(linkSource); // Clean up the object URL
        toasterAlert("successfully","Successfully downloaded file" ,"Document downloaded successfully.")
    } catch (error) {
        toasterAlert("warning", "An error occurred while downloading the document.")
    }
}
const DateFormate =(data)=>{
    return $AHelper.$getFormattedDateForCE(data)
}
const isIntigerOrNotNull =()=>{
    const isInteger = Number.isInteger(Number(subsDetails?.futureAuthorizeSubscriptionId));
    if(isInteger && $AHelper.$isNotNullUndefine(subsDetails?.futureAuthorizeSubscriptionId) && $AHelper.$isNotNullUndefine(subsDetails?.futurePayDate)){
        return ['Future Payment Date:',DateFormate(subsDetails?.futurePayDate)]
    }

}
 //////////////////////////////////////
const Anualplanss = () => {
    if (!isNotValidNullUndefile(anualAgreementData) || anualAgreementData.length === 0) return [];

    const { isHourly, isFlatFee } = anualAgreementData[0];
    return [
        ...(isHourly ? ["Hourly Basis"] : []),
        ...(isFlatFee ? ["Flat Fee Basis"] : [])
    ];
};
  
  const getInstallmentFrequency = () => {
    const futurePayDate = new Date(anualAgreementData[0]?.futurePayDate);
    const validityFrom = new Date(anualAgreementData[0]?.validityFrom);
    const totalInstallment = anualAgreementData[0]?.totalInstallment;

    if (totalInstallment === 1) return 'One-Time';

    const diffTime = futurePayDate - validityFrom;
    const diffDays = diffTime / (1000 * 3600 * 24);
    if (diffDays <= 7) return 'Weekly';
    if (diffDays <= 31) return 'Monthly';
    return 'Yearly';
};

const formatDateToUS = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }; 

  const getTableData = () => {
    const data = [];
    const agreement = anualAgreementData[0];
    if (!agreement) return [];
    const { totalAmount, totalDiscount = 0, totalPaid, validityFrom, installmentAmount, totalInstallment, futurePayDate } = agreement;
    const frequency = getInstallmentFrequency();
    const nextDate = getNextInstallmentDate(validityFrom, frequency, totalInstallment);
    data.push(["Total Amount:", totalAmount || 0]);
    data.push(["Total Discount:", totalDiscount]);
    data.push([
      totalPaid == totalAmount ? "Total Paid:" : "Total Paid till date:",
      totalPaid || 0,
    ]);
    if (totalPaid != totalAmount) {
        const remaining = totalAmount - (totalPaid + totalDiscount);
        remaining != null && data.push(["Remaining Amount:", remaining]);
        nextDate ? data.push(["Next Installment Date:", formatDateToUS(nextDate)]) : futurePayDate && data.push(["Next Installment Date:", futurePayDate]);
        if (installmentAmount && parseFloat(installmentAmount) !== 0) {
            installmentAmount != null && data.push(["Installment Amount:", installmentAmount]);
            totalInstallment != null && data.push(["Total no. of installments:", totalInstallment]);
            frequency && data.push(["Installment Frequency:", frequency]);
        }
    }
    return isNotValidNullUndefile(anualAgreementData) && anualAgreementData.length > 0 ? data : [];
  };  
 
 const getStyle = (isLabel) => ({fontSize:'14px',fontWeight:isLabel ? '600' : '400',marginBottom:"2px"});  
 const data = [['Validity From:',DateFormate(subsDetails?.validityFrom)],['Validity To:',DateFormate(subsDetails?.validityTo)],isIntigerOrNotNull() || []];
 const feeAgreementData = [['Charges Type:',Anualplanss()],['Matter No:',matterNumber?.matterNo ?? matterNumber]];
 const colProps = {lg:3,md:3,sm:3,xs:3};
 const colProps1 = {lg:9,md:9,sm:9,xs:9};
 const isEnrolled = $AHelper.$isNumber(subsDetails?.orderId) || $AHelper.$isNumber(futureAuthorizeSubscriptionId);
 const isNotEnrolled = !isEnrolled;
 const isActive = isEnrolled && new Date(subsDetails?.validityTo).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0);
  
 
 const renewPlan = async() => {
    let paymentState =  {isActive:true,tab:"TB02"}
    sessionStorage.setItem('paymentState',JSON.stringify(paymentState));
       let jsonObj = {
        "userId": primaryUserId,
        "orderId": 0,
        "promoCode": "",
        "shippingCost": 0,
        "taxCost": 0,
        "totalCost": planTotalCost,
        "paidAmt": planTotalCost,
        "paymentTypeId": 1,
        "currencyTypeId": 2,
        "isActive": true,
        "createdBy": loggedInUserId,
        "isBillDetail": true,
        "productList": paymentInnerjson
      }
    useLoader(true)      
    const _addOrderUser = await postApiCall('POST', $Service_Url.postAddUserOrder,jsonObj);
    setOrderIdData(_addOrderUser?.data?.data?.order)
    
    
    useLoader(false)   
   
  }
  const isActiveBtn = isActive ? "Active" : isNotEnrolled ? "Not Enrolled"  : "Inactive"
 
  //////////////////////// fee agreement data///////////////////////////////////////////
 
  const fetchMemberDetails = (userID) => {
    $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getFamilyMemberbyID + userID, "", (response, error) => {
      if (response) {
        let responseData = response?.data?.data?.member
        const matNo = responseData?.matNo;
        const registeredOn = responseData?.createdOn;
        const matterNumberValue = !isNotValidNullUndefile(matNo)
          ? `${new Date(registeredOn).getFullYear().toString().slice(-2)}-${responseData.memberId}`
          : matNo;
        setMatterNumber(matterNumberValue);
      }
    })
  }

  const returnAmaountFormate = (value) =>{
    return `$ ${(parseFloat(value) ?? parseFloat(value) ?? 0).toFixed(2)}`
  }



  return (
     <> 
          <div>

              {show && <NewPaymentModal show={show} handleClose={handleClose} subsDetails={cardType == 1 ? subsDetails : subsDetailsFee} getUserProfileFunc={getUserProfileFunc} updateCard={updateCard} ref={deleteCreditCardRef} profileDetails={profileDetails} alreadyAddedCards={cardType == 1 ? cardDetails : cardDetailsFee} key={show} />
              }
              <Row className='mb-2'>
                  <Col lg="12" md="12" sm="12" xs="12">
                      <div><h2 className='fw-bold' style={{ fontWeight: "600", fontSize: "16px", marginBottom: "8px" }}>Product/Plans</h2></div>
                      <div style={{ fontSize: "13px", color: "#5E5E5E", marginBottom: "10px" }}><p>Update your product and plans.</p></div>
                  </Col>
              </Row>
              <Row style={{ border: "1px solid #EBEBEB", borderRadius: "10px", padding: "10px" }} >
                  <Row>
                      <Col lg="6" md="6" sm="6" xs="6" className='d-flex mt-auto mb-auto'>
                          <Row lg="6" md="6" sm="6" xs="6" className='me-3'>

                              <div className='d-flex  w-auto'>

                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                      <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", background: isActive ? "#28a745" : "#720C20", borderRadius: 4 }}>
                                          <span style={{ color: "white", fontWeight: "bold", fontSize: "14px", lineHeight: 0 }}>✔</span>
                                      </div>
                                  </div>
                                  <label className='ms-2' style={{ color: isActive ? "#4DAF00" : "red" }}>{isActiveBtn}</label>
                              </div>
                          </Row>

                          {isNotValidNullUndefile(cardDetails) && cardDetails.length > 0 && isActiveBtn == "Active" && <Row lg="6" md="6" sm="6" xs="6" className='ms-2'>

                              <div className='d-flex  w-auto'>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                      <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", background: isActive ? "#28a745" : "#720C20", borderRadius: 4 }}>
                                          <span style={{ color: "white", fontWeight: "bold", fontSize: "14px", lineHeight: 0 }}>✔</span>
                                      </div>
                                  </div>
                                  <label className='ms-2' style={{ color: isActive ? "#4DAF00" : "red" }}>Auto-Renew</label>
                              </div>
                          </Row>}

                      </Col>
                      {isEnrolled && isNotValidNullUndefile(subsFileId) && <Col lg="6" md="6" sm="6" xs="6" className='d-flex justify-content-end mt-auto mb-auto'>
                          <button className="profileDetailsEditButton" style={{ border: "2px solid #E8E8E8", borderRadius: "8px", width: "181.04px", height: "35px", fontSize: "16px", color: "#1A1A1A", backgroundColor: "#FFFFFF" }} onClick={() => viewPdfFile(1, subsFileId)}><div><img style={{ marginTop: "-1px" }} className='me-2' src="/New/newIcons/DownLoadVector.svg" />Download AMA</div></button>
                      </Col>}
                  </Row >
                  <Row className='m-0 mt-2 p-0'>
                      <Col lg="12" md="12" sm="12" xs="12" className='mb-1'>
                          <h2 className='fw-bold' style={{ fontWeight: "600", fontSize: "15px" }}>Annual maintenance plan</h2>
                      </Col>
                      <Col lg="12" md="12" sm="12" xs="12">
                          <p style={{ fontSize: "13px", fontWeight: "400", color: "#5E5E5E", marginBottom: "10px" }}>Our comprehensive Annual Maintenance Plan is designed to safeguard your valuable assets and maintain optimal functionality throughout the year.</p>
                      </Col>
                  </Row>

                  {(userActiveOrder?.length > 0 || ($AHelper.$isNumber(futureAuthorizeSubscriptionId) && paymentInnerjson?.length > 0)) && <Row className='m-0 mt-2 p-0'>
                      <Col lg="3" md="3" sm="3" xs="3" className='mb-1'>
                          <h2 className='fw-bold' style={{ fontWeight: "600", fontSize: "14px", marginTop: "3px" }}>Products included:</h2>
                      </Col>
                      <Col lg="9" md="9" sm="9" xs="9" className='mb-1 d-flex justify-content-start'>
                          <Row>
                              {(userActiveOrder?.length > 0 ? distributedPlans : distributedPlansFuture)?.map((columnPlans, colIndex) => (
                                  <Col lg="12" md="12" sm="12" xs="12" className='d-flex' key={colIndex}>

                                      {columnPlans.map((plan, index) => (
                                          <div className='d-flex mb-2'>
                                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "5px" }}>
                                                  <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", background: isActive ? "#28a745" : "#720C20", borderRadius: 4 }}>
                                                      <span style={{ color: "white", fontWeight: "bold", fontSize: "14px", lineHeight: 0 }}>✔</span>
                                                  </div>
                                              </div>
                                              <div key={index} style={{ fontWeight: "400", fontSize: "14px" }}>

                                                  {plan?.productName} {plan?.paidAmount == 0 ? "(Free)" : `($${plan?.paidAmount})`}
                                              </div>
                                          </div>
                                      ))}

                                  </Col>
                              ))}
                          </Row>
                      </Col>
                  </Row>}
                  <Row className="m-0 p-0">
                      {isEnrolled && isNotValidNullUndefile(subsDetails) && data.map(([label, value], index) => (
                          <React.Fragment key={index}>
                              <Col {...colProps} style={getStyle(true)}>{label}</Col>
                              <Col {...colProps1} style={getStyle(false)}>{value == "Invalid date" ? '-' : value}</Col>
                          </React.Fragment>
                      ))}
                  </Row>

                  {isNotValidNullUndefile(cardDetails) && cardDetails.length > 0 && isActiveBtn == "Active" &&
                      <Row style={{ marginTop: "10px" }} >
                          <Row className='mb-2 mt-3'>
                              <Col lg="12" md="12" sm="12" xs="12" className='mb-1'>
                                  <h2 className='fw-bold' style={{ fontWeight: "600", fontSize: "16px", marginBottom: "8px" }}>Payment</h2>
                              </Col>
                              <Row style={{ border: "1px solid #EBEBEB", borderRadius: "6.47px", padding: "10px", marginLeft: "auto" }} >
                                  <Row>
                                      {isNotValidNullUndefile(cardDetails) && cardDetails.length > 0 && cardDetails?.map((ele, index) =>
                                          (ele?.cardIsActive == true || ele?.cardIsActive == null) && (
                                              <>

                                                  <Col lg="6" md="6" sm="6" xs="6" className='d-flex justify-content-start mt-auto mb-auto'>
                                                      <div className='d-flex'><img style={{ marginTop: "-1px", height: "30px", width: "40px" }} className='me-2' src="/New/newIcons/card.png" />
                                                          <div>
                                                              <p style={{ fontWeight: "600", fontSize: "16px" }}>Card ending in {$AHelper.$getLastCharacter(ele?.cardNumber, 4)}</p>
                                                              <p> Expiry {ele?.expireDate}</p>
                                                          </div>
                                                      </div>
                                                  </Col>
                                                  <Col lg="6" md="6" sm="6" xs="6" className='d-flex justify-content-end mt-auto mb-auto'>
                                                      <button onClick={() => updateCardDetail(ele,1)} className="profileDetailsEditButton" style={{ border: "1px solid #720C20", borderRadius: "6.26px", width: "85px", height: "35px", fontSize: "16px", color: "#1A1A1A", backgroundColor: "#720C20", color: "#FFFFFF" }}>Update</button>
                                                  </Col>
                                              </>


                                          ))}

                                  </Row>
                              </Row>

                          </Row>
                      </Row>
                  }
                  {isActiveBtn == "Not Enrolled" && <Row className='p-0 m-0'>
                      <Col lg="12" md="12" sm="12" xs="12" className='d-flex justify-content-end p-0 mt-1'>
                          <button onClick={() => proceedToAMA()} className="profileDetailsEditButton" style={{ border: "1px solid #720C20", borderRadius: "6.26px", width: "auto", padding: "0 20px", height: "35px", fontSize: "16px", color: "#1A1A1A", backgroundColor: "#720C20", color: "#FFFFFF" }}>Proceed to Annual Maintenance Agreement</button>
                      </Col>
                  </Row>}

                  {isActiveBtn == "Inactive" && <Row>
                      <Col lg="12" md="12" sm="12" xs="12" className='d-flex justify-content-end mt-1'>
                          <button onClick={() => renewPlan()} className="profileDetailsEditButton" style={{ border: "1px solid #720C20", borderRadius: "6.26px", width: "85px", height: "35px", fontSize: "16px", color: "#1A1A1A", backgroundColor: "#720C20", color: "#FFFFFF" }}>Renew</button>
                      </Col>
                  </Row>}


              </Row>
              {/* fee agreement code */}
              {isNotValidNullUndefile(anualAgreementData) && anualAgreementData.length > 0 && <Row style={{ border: "1px solid #EBEBEB", borderRadius: "10px", padding: "10px", marginTop: "1rem" }} >

                  <Row>
                      <Col lg="6" md="6" sm="6" xs="6">
                      </Col>
                      {isNotValidNullUndefile(subsFileIdFee) && <Col lg="6" md="6" sm="6" xs="6" className='d-flex justify-content-end mt-auto mb-auto'>
                          <button className="profileDetailsEditButton" style={{ border: "2px solid #E8E8E8", borderRadius: "8px", width: "281.04px", height: "35px", fontSize: "16px", color: "#1A1A1A", backgroundColor: "#FFFFFF" }} onClick={() => viewPdfFile(2, subsFileIdFee)}><div><img style={{ marginTop: "-1px" }} className='me-2' src="/New/newIcons/DownLoadVector.svg" />Download Fee Agreement</div></button>
                      </Col>}                    


                  </Row>
                  <Row className='m-0 mt-2 p-0'>
                      <Col lg="12" md="12" sm="12" xs="12" className='mb-1'>
                          <h2 className='fw-bold' style={{ fontWeight: "600", fontSize: "15px" }}>Non-Crisis Fee Agreement</h2>
                      </Col>
                      <Col lg="12" md="12" sm="12" xs="12">
                          <p style={{ fontSize: "13px", fontWeight: "400", color: "#5E5E5E", marginBottom: "10px" }}>Our Non-Crisis Fee Agreement ensures proactive support, safeguarding your assets and maintaining optimal functionality year-round with structured, non-emergency service solutions.</p>
                      </Col>
                  </Row>
                  <Row className="m-0 p-0">
                      {isNotValidNullUndefile(subsDetailsFee) && feeAgreementData?.map(([label, value], index) => (
                          <React.Fragment key={index}>
                              <Col {...colProps} style={getStyle(true)}>{label}</Col>
                              <Col {...colProps1} style={getStyle(false)}>
                                  {label == "Charges Type:" ? <>
                                      {value.map((ele, index) => (
                                          <div className='d-flex mb-2'>
                                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "5px" }}>
                                                  <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "#28a745", borderRadius: 4 }}>
                                                      <span style={{ color: "white", fontWeight: "bold", fontSize: "14px", lineHeight: 0 }}>✔</span>
                                                  </div>
                                              </div>
                                              <div key={index} style={{ fontWeight: "400", fontSize: "14px" }}>{ele}</div>
                                          </div>
                                      ))}
                                  </> : value}
                              </Col>
                          </React.Fragment>
                      ))}
                  </Row>
                  {feeAgreementPlans?.length > 0 && <Row className='m-0 mt-2 p-0'>
                      <Col lg="3" md="3" sm="3" xs="3" className='mb-1'>
                          <h2 className='fw-bold' style={{ fontWeight: "600", fontSize: "14px", marginTop: "3px" }}>Provided Services:</h2>
                      </Col>
                      <Col lg="9" md="9" sm="9" xs="9" className='mb-1 d-flex justify-content-start'>
                          <Row>
                              {distributedServices.map((columnPlans, colIndex) => (
                                  <Col lg="12" md="12" sm="12" xs="12" className='d-flex' key={colIndex}>

                                      {columnPlans.map((plan, index) => (
                                          <div className='d-flex mb-2'>
                                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "5px" }}>
                                                  <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "#28a745", borderRadius: 4 }}>
                                                      <span style={{ color: "white", fontWeight: "bold", fontSize: "14px", lineHeight: 0 }}>✔</span>
                                                  </div>
                                              </div>
                                              <div key={index} style={{ fontWeight: "400", fontSize: "14px" }}>

                                                  {plan?.skuListName} {index == 0 ? `(${plan?.subscriptionPlanName})` : ""}
                                              </div>
                                          </div>
                                      ))}

                                  </Col>
                              ))}
                          </Row>
                      </Col>
                  </Row>}

                  <Row className="m-0 p-0">
                      {isNotValidNullUndefile(anualAgreementData) && anualAgreementData.length > 0 && getTableData()?.map(([label, value], index) => (
                          <React.Fragment key={index}>
                              <Col {...colProps} style={getStyle(true)}>{label}</Col>
                              <Col {...colProps1} style={getStyle(false)}>{label !== 'Next Installment Date:' ? (label !== 'Total no. of installments:' && label !== 'Installment Frequency:' ? returnAmaountFormate(value) : value) : (formatDateToUS(value) === 'Invalid date' ? '-' : formatDateToUS(value))}</Col>

                          </React.Fragment>
                      ))}
                  </Row>


                  {isNotValidNullUndefile(cardDetailsFee) && cardDetailsFee.length > 0 &&
                      <Row style={{ marginTop: "10px" }} >
                          <Row className='mb-2 mt-3'>
                              <Col lg="12" md="12" sm="12" xs="12" className='mb-1'>
                                  <h2 className='fw-bold' style={{ fontWeight: "600", fontSize: "16px", marginBottom: "8px" }}>Payment</h2>
                              </Col>
                              <Row style={{ border: "1px solid #EBEBEB", borderRadius: "6.47px", padding: "10px", marginLeft: "auto" }} >
                                  <Row>
                                      {isNotValidNullUndefile(cardDetailsFee) && cardDetailsFee.length > 0 && cardDetailsFee?.map((ele, index) =>
                                          (ele?.cardIsActive == true || ele?.cardIsActive == null) && (
                                              <>

                                                  <Col lg="6" md="6" sm="6" xs="6" className='d-flex justify-content-start mt-auto mb-auto'>
                                                      <div className='d-flex'><img style={{ marginTop: "-1px", height: "30px", width: "40px" }} className='me-2' src="/New/newIcons/card.png" />
                                                          <div>
                                                              <p style={{ fontWeight: "600", fontSize: "16px" }}>Card ending in {$AHelper.$getLastCharacter(ele?.cardNumber, 4)}</p>
                                                              <p> Expiry {ele?.expireDate}</p>
                                                          </div>
                                                      </div>
                                                  </Col>
                                                  <Col lg="6" md="6" sm="6" xs="6" className='d-flex justify-content-end mt-auto mb-auto'>
                                                      <button onClick={() => updateCardDetail(ele,2)} className="profileDetailsEditButton" style={{ border: "1px solid #720C20", borderRadius: "6.26px", width: "85px", height: "35px", fontSize: "16px", color: "#1A1A1A", backgroundColor: "#720C20", color: "#FFFFFF" }}>Update</button>
                                                  </Col>
                                              </>
                                          ))}
                                  </Row>
                              </Row>
                          </Row>
                      </Row>
                  }
              </Row>}
              <Row style={{ border: "1px solid #EBEBEB", borderRadius: "8px", padding: "10px", marginTop: "10px" }}>
                  <Row className='mb-2'>
                      <Col lg="12" md="12" sm="12" xs="12">
                          <h2 style={{ fontWeight: "600", fontSize: "16px" }}>Products/Plan History</h2>
                          <p style={{ fontSize: "13px", color: "#5E5E5E", fontWeight: "400" }}>Update your payment methods & credentials</p>
                      </Col>
                  </Row>
                  <Row className='mb-2'>
                      <Col lg="12" md="12" sm="12" xs="12" className='ms-2'>
                          <div >
                              {/* Table Header */}
                              <Row className="fw-bold border-bottom" style={{ padding: "10px", backgroundColor: "#F1F1F1", color: "#606060", fontSize: "14px", fontWeight: "500" }}>
                                  <Col className={textStart} xs={5}>Product/Plan Name</Col>
                                  <Col className={textCenter} xs={2}>Order No.</Col>
                                  <Col className={textCenter} xs={3}>Payment On</Col>
                                  {/* <Col className={textCenter} xs={3}> Product/Plan Type</Col> */}
                                  <Col className={textCenter} xs={2}> Amount</Col>
                              </Row>

                              {/* Table Rows */}
                              {userOrderDetail.length > 0 && getCurrentPageData()?.map((item, index) => (
                                  <Row key={item.id} className="border-bottom align-items-center" style={{ padding: "16px 0px" }}>
                                      <Col className={textStart} xs={5}><img style={{ marginTop: "-1px" }} className='me-2' src="/New/newIcons/tableIcon.svg" />{item?.productName}</Col>
                                      <Col className={textCenter} xs={2}>{item.orderId}</Col>
                                      <Col className={textCenter} xs={3}>{item.validityFromDate ? $AHelper.$getFormattedDateForCE(item.validityFromDate) : ""}</Col>
                                      {/* <Col className={textCenter} xs={3}>{item.productType}</Col> */}
                                      <Col className={textCenter} xs={2}>{item?.paidAmount && item.paidAmount !== 0 ? returnAmaountFormate(item.paidAmount) : "Free"}</Col>
                                  </Row>
                              ))}
                          </div>
                      </Col>
                  </Row>


                  <DownloadButton id="btn1" alignment="start" btnName="Previous" width="96px" padding="0px 14px" onClick={() => handlePageChange(currentPage - 1)} isDisable={currentPage < 2} />
                  <DownloadButton id="btn2" alignment="center" btnName={`Page ${currentPage} to ${totalPages}`} width="130px" padding="0px 14px" isDisable={(currentPage == totalPages) && (currentPage < 2)} />
                  <DownloadButton id="btn3" alignment="end" btnName="Next" width="65px" padding="0px 14px" onClick={() => handlePageChange(currentPage + 1)} isDisable={currentPage == totalPages} />



              </Row>
          </div>
    {orderIdData?.orderId && <NewPamentGateway orderIdData={orderIdData} primaryUserId={primaryUserId}/> } 

    {showAmaModal ? <AnnualAgreemetModal
        showannualagreementmodal={showAmaModal}
        showannualagreementmodalfun={setshowAmaModal}
        clientData={clientDataForAma}
        subscriptionId="1"
        key={showAmaModal}
        dispatchloader={useLoader}
        callerReference="AccountSetting"
        isPaymentStatus={newAMAPaymentStatus?.isPaymentStatus}
        isPaymentOrderId={newAMAPaymentStatus?.isPaymentOrderId}
        callapidata={() => getSavedSubscriptionDetails(subtenantId, primaryUserId, '1')}
        // functionHandleorderIdNStatus={props?.functionHandleorderIdNStatus}
    /> : ''}

    </>
  )
}

export default ProductPlans