import React from 'react';
import { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import konsole from '../components/control/Konsole';
import { $CommonServiceFn } from '../components/network/Service';
import { $Service_Url } from '../components/network/UrlPath';
import { useState } from 'react';
import Emergencymain from '../components/Emergeny/Emergencymain';
import Emergencydata from '../components/Emergencydata';

const EmergencyLogin = () => {
  const[memberId,setMemberId] = useState('')
  const[pinCode,setPincode] = useState('')
  const[Emergencycard,setemergencycard] = useState([])
  const[showPage,setShowpage] = useState(false)
  const[primaryUserId,setprimaryuserid]=useState('')
  useEffect(()=>{
let url = window.location.href?.split('?')
let cardid = url[2]?.split('=')[1]
let userId = url[1]?.split('=')[1]
setprimaryuserid(userId)
konsole.log(userId,"urlurl")
getEmergencyCard(cardid)
  },[])
  const getEmergencyCard = (cardid)=>{
    $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getEmergencyApi + "?emergencyCardId=" + cardid, '', (response, error) => {
      if(response){
        konsole.log(response,"response")

        setemergencycard(response.data.data[0])
      }

    })
  }



  const loginFunction = () => {
    konsole.log(memberId,pinCode,"memberId,pinCode")
    if(Emergencycard.memberId == memberId || Emergencycard.pinCode == pinCode){
      setShowpage(true)
    }
  }
  return (
    showPage==true ? <Emergencydata primaryUserId={primaryUserId} cardData={Emergencycard} /> : <div className='EmergencyLoginMain d-flex flex-wrap'>
      <Col className='EmergencyLoginLeft d-flex flex-column d-none d-lg-block '>
        <Row>
          <Col>
            <label className="fs-1 fw-bold" style={{ color: '#720C20' }}>Member Login <>&#x2212;</></label>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className='fs-2 fw-normal me-5 mw-75' style={{ color: '#333333' }}>Please login to access your medical details in case of emergency.</p>
          </Col>
        </Row>
      </Col>

      <Col className='EmergencyLoginRight d-flex flex-column'>
        <Row className='p-5'>
          <img className='w-100 w-sm-50 w-md-50 w-lg-50 w-xl-50 w-xxl-50 rounded d-block' src="./images/LoginLogo.png" alt="Login Logo" />
        </Row>

        <Col className='EmergencyLoginLefthide d-flex d-block d-lg-none d-xl-none d-xxl-none pb-5'>
          <Row>
            <Col>
              <label className="fs-1 fw-bold" style={{ color: '#720C20' }}>Member Login <>&#x2212;</></label>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className='fs-2 fw-normal' style={{ color: '#333333' }}>Please login to access your medical details in case of emergency.</p>
            </Col>
          </Row>
        </Col>
        <Row className='m-auto d-flex flex-column'>
          <Col className='d-flex flex-column mb-4'>
            <label className='fs-3 fw-bold mb-3'>Member ID</label>
            <form>
              <input style={{ background: '#E6E9EC' }} className='EmergencyInputLogin border border-5 rounded p-2' type="email" id="mid" name="mid" placeholder='Enter your Member ID' value={memberId} onChange={(e)=>{setMemberId(e.target.value)}} />
            </form>
          </Col>
          <Col className='d-flex flex-column'>
            <label className='fs-3 fw-bold mb-3'>PIN</label>
            <form>
              <input style={{ background: '#E6E9EC' }} className='EmergencyInputLogin border border-5 rounded p-2' type="pin" id="mpin" name="mpin" placeholder='Enter your PIN' value={pinCode} onChange={(e)=>{setPincode(e.target.value)}} />
            </form>
          </Col>
          <Col className='mt-5'>
            <button className='EmergencyLogin-btn fs-3 rounded' onClick={()=>loginFunction()}>
                Login
            </button>
          </Col>
          <Col className='my-3 text-center pb-5'>
            <label className='fs-3'>Lost your card? <a style={{ color: '#720C20' }}>Contact Us</a></label>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default EmergencyLogin;
