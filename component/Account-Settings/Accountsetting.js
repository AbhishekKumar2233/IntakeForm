import React, {useState,useEffect} from 'react'
import {Row,Col} from 'react-bootstrap'
import { $editProfileSideBar } from '../Helper/Constant'
import AccountDetails from './AccountDetails'
import ProductPlans from './ProductPlans'
import { connect } from "react-redux";
import { SET_LOADER } from '../../components/Store/Actions/action'
import withOccurrenceApi from '../../components/OccurrenceHoc/withOccurrenceApi'
import { isNotValidNullUndefile } from '../../components/Reusable/ReusableCom'

const Accountsetting = (props) => {
   const {emailTmpObj, textTmpObj, sentMail, commChannelId} = props;
   const [activeTab, setactiveTab] = useState("TB01")
   const newObjErr = () => ({ firstName: "", lastName: "",phone: "", email: "", password: "", oldPassword: "",confirmPassword: '', newPassword: "",countryCode:""});
   const [profileData, setprofileData] = useState({...newObjErr()})
   let OrderId = "";
   let paymentSuccesStatus = ''

if (typeof window !== "undefined") {
    OrderId = new URLSearchParams(window.location.search).get("OrderId");
    paymentSuccesStatus = new URLSearchParams(window.location.search).get("TrxnStatus");
}

  

   useEffect(() => {
     let payment =  JSON.parse(sessionStorage.getItem('paymentState'));
     if(isNotValidNullUndefile(payment)){
      setactiveTab(payment?.tab)
      delete payment.tab;
      sessionStorage.setItem('paymentState',JSON.stringify(payment)) 
      
     }
    
   },[OrderId])
   
   useEffect(() => {
    const  activeTabs = JSON.parse(sessionStorage.getItem('activeTab'))
     if(isNotValidNullUndefile(activeTabs)){
      setactiveTab(activeTabs)
     }
     return ()=>{
      resetSession()
     }
   }, [])
   
   const resetSession =()=>{
   sessionStorage.removeItem("activeTab");
   }

    const handleTabChange =(item)=>{
      setactiveTab(item?.id)
      sessionStorage.setItem('activeTab',JSON.stringify(item?.id)) 
    }

    const setprofileDatachange = (data) => {
      setprofileData(data)
    }

   


  return (
    <>
    <div  className='ps-3 pe-3'>
        <Row style={{ padding: "10px 0px 10px 0px", backgroundColor: "#FFFFFF", borderRadius: "8px" }}>
          <Col lg="12" md="12" sm="12" xs="12">
            <h2 className='fw-bold heading-of-sub-side-links'>Account Settings</h2>
            <p className='heading-of-sub-side-links-2'>Update your personal info, security settings, and preferences here.</p>
          </Col>
        </Row>
        <Row className='mt-4'>
          <Col xs={3} sm={3} md={3} xl={2}>
          <div>
        
          {$editProfileSideBar.map((ele)=><>
            <div style={{height:"35px",width:"148px",backgroundColor:`${activeTab == ele?.id ? "#F1E7E9" : ""}`,marginBottom:"5px", padding: "6px 10px 6px 10px",fontSize:"14px",borderRadius:"4px",cursor:"pointer" }}onClick={()=>handleTabChange(ele)}>
              <div style={{display:"flex",alignItems:"baseline"}}>
              <img className='me-2 mt-auto mb-auto' src={`/New/newIcons/${activeTab == ele?.id ? ele?.imageSrcRed : ele?.imageSrcBlack}`} alt='profile'/>
              <p style={{color : activeTab !== ele?.id ? "" : "#720C20"}}>{ele?.title}</p>
              
              </div>
              </div>
          </>)}
          </div>
        
          </Col>
          <Col xs={9} sm={9} md={9} xl={10} style={{backgroundColor: "#FFFFFF",borderRadius: "8px",padding: "10px 20px 10px 20px"}}>
          <Row> 
            {activeTab == "TB01" ? <> 
             <AccountDetails profileData={profileData} setprofileData={setprofileDatachange} emailTmpObj ={emailTmpObj} textTmpObj={textTmpObj} sentMail={sentMail} commChannelId={commChannelId}/>
            </> : <> 
            <ProductPlans/>
            </>}
          </Row>
         
          </Col>
        </Row>
    </div>         
    </>
  )
}


const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
      dispatch({
          type: SET_LOADER,
          payload: loader,
      }),
});
export default connect("",mapDispatchToProps)(withOccurrenceApi(Accountsetting,34, 'profileOccurrence'));