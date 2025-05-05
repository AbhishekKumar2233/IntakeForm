import React, {useState, useEffect } from 'react';
import {Row,Col} from "react-bootstrap";
import Layout from "../components/layout"; 
import EditPaymentMethod from '../components/AnnualMaintenanceAgreement/EditPaymentMethod';
import { Services } from '../components/network/Service';
import konsole from '../components/control/Konsole';
import { $AHelper } from '../components/control/AHelper';


function AnnualMaintAgreement(){
    const [editPayment, setEditPayment] = useState("")
    const [subtenantId, setSubtenantId] = useState("")
    const [userID, setUserID] = useState("")
    const [userPackage, setUserPackage] = useState([])
    const [cardDetails, setCardDetails] = useState([])
    const [skuListName, setSkuListName] = useState("")
    const [skuDescription, setSkuDescription] = useState("")
    const [attorneyDetail, setAttorneyDetail] = useState({})
    const [subscriptionAmnt, setSubscriptionAmnt] = useState("")
    const [subscriptionDetail, setSubscriptionDetail] = useState({})
    const [validityTill, setValidityTill] = useState('')
    konsole.log("userPackage",userPackage,attorneyDetail)

    useEffect(()=>{
        const subtenantID = sessionStorage.getItem("SubtenantId") || "";
       const userId = sessionStorage.getItem("SessPrimaryUserId") || "";
       konsole.log("subtenantID12",subtenantID)
       setSubtenantId(subtenantID)
       setUserID(userId)

       getUserSubscriptionFunc(subtenantID,userId)
    },[subtenantId])

    const getUserSubscriptionFunc = (subtenantID,userId) => {
        const json = `${subtenantID}/${true}?UserId=${userId}`
        // const json = `${3}/${true}?UserId=${"FD2E067D-14B4-4AFE-9D8E-00B8EB74EA75"}`
        konsole.log("json2121",json)
        Services.getUserSubscriptions(json)
        .then((res)=>{
        konsole.log("responsegeUserSubs",res)
        if(res.data.data.length > 0){
            const userSubscId = res.data.data[0].userSubscriptionId
            const attorneyId = res.data.data[0]?.attorneyId 
            const validityToTill = res?.data?.data[0]?.validityTo 
        
            setValidityTill(validityToTill)
          getUserListByRoleIdForAttorneyType(attorneyId)            
          getUserSubscriptionPlanFunc(userSubscId)
        }
        }).catch((err)=>{
            konsole.log("erroorrUserSubs",err)
        })
    }

    const getUserListByRoleIdForAttorneyType = (attorneyId) => {
        const json = {
            subtenantId: subtenantId,
            userId: attorneyId,
            isActive: true,
            userType: "staff"
          }
          konsole.log("json1212",json)
        Services.getUserListByRoleId(json)
        .then((res)=>{
        konsole.log("responseByRoleID",res)
        if(res.data.data?.length > 0){
            for(const item of res.data.data){
                if(item?.subtenantId == subtenantId && item?.userId == attorneyId){
                    const obj = {
                        attorneyName : res.data.data[0]?.fullName,
                        attorneyType : res.data.data[0]?.roleKey
                    } 
                    setAttorneyDetail(obj)
                }
            }
        }
        }).catch((err)=>{
            konsole.log("erroorrSaleableSku",err)
        })
    }

    const getUserSubscriptionPlanFunc = (userSubscriptionId) => {
        // const json = `${userSubscriptionId}/${true}`
        let isActive = true;
        const json = `?IsActive=${isActive}&UserId=${memberId}`
        Services.getUserSubscriptionPlans(json)
        .then((res)=>{
        konsole.log("responsegeUserSubsPlan",res)
        if(res.data.data.length > 0){
            const SkuListId = res.data.data[0].skuListId                       
            getSaleAbleSKUFunc(SkuListId)
        }
        }).catch((err)=>{
            konsole.log("erroorrUserSubsPlan",err)
        })
    }

    const getSaleAbleSKUFunc = (SkuListId) => {
        const json = `?SkuListId=${SkuListId}&IsActive=${true}`
        Services.getSaleAbleSKU(json)
        .then((res)=>{
        konsole.log("responseSaleableSku",res)
        if(res.data.data.length > 0){
            setUserPackage(res.data.data)
            setSkuListName(res.data.data[0]?.skuListName)
            setSkuDescription(res.data.data[0]?.description)
            rateCards(SkuListId)
            getCentralizedSubsTranscFunc(SkuListId)
        }
        }).catch((err)=>{
            konsole.log("erroorrSaleableSku",err)
        })
    }

    const rateCards = (SkuListId) => {
        const promise = Services.getRateCard('',SkuListId,subtenantId,true)
        promise.then((res)=>{
            const responseData = res.data.data;
            const endSubscriptionAmt = responseData?.length > 0 && responseData[0]?.applicableSubsModel[0]?.endSubscriptionAmt
            konsole.log("ressRateCards",res.data.data,subtenantId,endSubscriptionAmt)
          setSubscriptionAmnt(endSubscriptionAmt)
        }).catch((err)=>{
          konsole.log("errr",err)
        })
      } 

    const getCentralizedSubsTranscFunc = (SkuListId) => {
        const json = {
            date: "2024-04-01",
            memberId: userID,
            subtenantId: subtenantId,
            skuListId: SkuListId,
            subsModelId: 3
          }
          konsole.log("json1212",JSON.stringify(json))
        Services.getCentralizedSubsTransc(json)
        .then((res)=>{
        konsole.log("responseCentra",res)
        if(res.data.data?.length > 0){
            const obj = {
                validityFromDate : res.data.data[0]?.validityFromDate ,
                validityToDate : res.data.data[0]?.validityToDate,
            }
            setSubscriptionDetail(obj)
            getUserProfileFunc()
            }
        }).catch((err)=>{
            konsole.log("erroorrCentra",err)
        })
    }

    const getUserProfileFunc = () => {
        // Services.getUserProfile(userID)
        Services.getUserProfile(userID)
        .then((res)=>{
        konsole.log("responseUserProfile",res)
        setCardDetails(res.data.data)
        }).catch((err)=>{
            konsole.log("erroorrUserProfile",err)
        })
    }

    return(
        <>
        <Layout name="Annual Maintenance Agreement">

            {editPayment == "editPaymentMethod" ? <EditPaymentMethod setEditPayment={setEditPayment}/> : 
            <>
            <Row className=''>
                <Col lg={8}>
            <h1>Annual Maintenance Plan</h1>
            <p>Manage your plans and subscriptions here.</p>
                </Col>
            </Row>
            <Row>
                <Col lg={12} md={12} sm={12}>
                <div className="d-flex justify-content-center mb-0 AMABorder">
                    <div className="borderStylesInAMA">{/* Horizontal Line */}</div>
                </div>
                </Col>
            </Row>
            <Row className="mb-4 mb-md-0 mb-lg-0">
    <Col lg={4} md={4}>
        <div className='card mt-4'>
            <Row>
                <Col lg={12}>
                    <div className='rounded'>
                        <img src='./images/AMACardImg.png' className='img-fluid mt-0' alt='Card Image'/>
                    </div>
                </Col>
            </Row>
            <div className='m-2'>
                <h4>{`${skuListName.split(skuListName.includes("INDPKG_") ? "INDPKG_" : "GRPPKG_").pop() ?? skuListName}`}</h4>
            </div>
            <div className='m-2'>
            {(skuDescription != undefined && skuDescription != null && skuDescription != "") ? skuDescription : "Our comprehensive Annual Maintenance Plan is designed to safeguard your valuable assets and maintain optimal functionality throughout the year."}
            </div>
            <div className='d-flex align-items-center m-2'>
                <div>
                    <img src='./images/validityWatchImg.png' alt='Validity Icon' />
                </div>
                <div className='mt-2 ms-2'>
                    <span className='fw-bold'>Valid till:</span> {$AHelper.getFormattedDateForCE(validityTill)}
                </div>
            </div>
        </div>
    </Col>
    <Col lg={4} md={4}>
        <div className='mt-4 AMAList'>
        <div>
        <h4>Included in your plan:</h4>
        </div>
        <div>
        <ul className='pt-3'>
    {userPackage.length > 0 && userPackage.map((item, ind) => (
      <li key={ind}>
        {`${item.skuListName.split(item.skuListName.includes("INDPKG_") ? "INDPKG_" : "GRPPKG_").pop() ?? item.skuListName}`}
        {item?.services?.length > 0 && (
          <ul className='pt-2'>
            {item?.services.map((serv, inx) => (
              <li key={inx}>{serv.skuServiceName}
              {serv?.services?.length > 0 && (
                <ul>
                    {serv?.services.map((inServ,index)=>(
                        <li>{inServ?.serviceName}</li>
                    ))}
                </ul>
              )}
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
   {/* <li style={{ listStyle: "none", color: "rgba(13, 110, 253, 1)", textDecoration: "underline", cursor: "pointer",marginTop:"10px"}}>+5 view more</li> */}
   <li style={{listStyle:"none", marginTop:"12px"}}>
    <div>
        <div className='d-flex'>
        <div>
            <img src='./icons/ProfilebrandColor.svg' style={{height:"48px",width:"48px"}}/>
        </div>
          <div className='w-50 m-2'>
            <p style={{fontSize:"18px",fontWeight:"bold"}}>{attorneyDetail?.attorneyName}</p>
            <p style={{fontSize:"13px",color:"rgba(147, 147, 147, 1)"}}>{attorneyDetail?.attorneyType}</p>
          </div>
        </div>
    </div>
   </li>
        </ul>
        </div>
        </div>
    </Col>
    <Col lg={4} md={4}>
    <div className='mt-4 ms-2 AMAPaymentDetailList'>
        <div>
        <h4>Billing & Payment</h4>
        </div>
        {cardDetails.length > 0 && cardDetails[0]?.cards.map((item,index)=>{
            return(
       <div>
        <div className='d-flex align-items-center mt-2'>
        <div>
            <img src='./images/paymentCardImg.png'/>
        </div>
        <div className='text-danger ms-2'>
            {`${item.cardType} ending ****${item.cardNumber}`}    
        </div>
        </div>
        {/* <div className='mt-4'>
            <button className='rounded-pill w-75' style={{backgroundColor:"#720c20",borderStyle:"none",color:"white",padding:"10px"}} onClick={()=>setEditPayment("editPaymentMethod")}>Edit Payment Method</button>
        </div> */}
        <div className='d-flex align-items-center mt-2'>
            <div>
                <img src='./images/AnnualBillCalendarImg.png'/>
            </div>
            <div className='fw-bold mt-2 ms-2'>${subscriptionAmnt}(Billed Annually)</div>
        </div>
        <div style={{color:"rgba(131, 131, 131, 1)",marginTop:"10px"}}>Last renewed on: {$AHelper.getFormattedDateForCE(subscriptionDetail?.validityFromDate)}</div>
        </div>
            )
        })}
        {/* <div style={{color:"rgba(13, 110, 253, 1)",textDecoration:"underline",cursor:"pointer",marginTop:"20px"}}>Generate Invoice</div> */}
        </div>
    </Col>
           </Row>
            </>}
           

        </Layout>
        </>
    )
}
export default AnnualMaintAgreement;