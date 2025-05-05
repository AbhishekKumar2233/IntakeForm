import React, { useMemo, useRef, useState } from 'react'
import { Row } from 'react-bootstrap'
import { CustomButton } from '../Custom/CustomButton'
import QRCode from 'react-qr-code';
import { lpoiceLink } from '../../components/control/Constant';
import { useEffect } from 'react';
import { getApiCall, isNotValidNullUndefile } from '../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../components/network/UrlPath';
import { useAppSelector } from '../Hooks/useRedux';
import { selectorEmergency } from '../Redux/Store/selectors';
import { $AHelper } from '../Helper/$AHelper';
import ReactToPrint from 'react-to-print';
import { $AHelper as $oldAHelper } from '../../components/control/AHelper';
import moment from 'moment';

const EmergencyCard = ({ emergencyCard, setemergencyCard, selectedUser,filteredUserContactDetails,primaryDetails,bloodTypeId,_spousePartner }) => {
    const primaryUserId = sessionStorage.getItem("SessPrimaryUserId")
    const [bloodType, setbloodType] = useState();
    const qrCodeRef = useRef(null);
    const { emergencyCardUserList } = useAppSelector(selectorEmergency);
    const { userPhysicionList } = useAppSelector(selectorEmergency);
    const { userEmergencyMember } = useAppSelector(selectorEmergency);
    const { emergencyMobileEmailDetail } = useAppSelector(selectorEmergency);
    const [address,setaddress] =useState();
    var currentDate = new Date();
    var oneYearLater = new Date();
    var VaildDate = oneYearLater.setFullYear(currentDate.getFullYear() + 1);
    const componentRef = useRef();
    let profileUrl = selectedUser.userId == primaryDetails?.userId && isNotValidNullUndefile(primaryDetails?.fileUrl) ? primaryDetails?.fileUrl : 'No-Image';

    useEffect(() => {
        getBloodType();
        getAddress();
    }, [])

    const getAddress =async()=>{
        const address = await getApiCall('GET',$Service_Url.getAllAddress +selectedUser.userId);
        if(address?.addresses?.length > 0){
        let { addressLine1, city, state, county, country, zipcode } = address?.addresses[0];
        const addressData = [addressLine1, city, state, county, country, zipcode]?.filter(value => value)?.join(", ");
        setaddress(addressData)
        }
    }
    const returnSelectedMemberData=useMemo(()=>{
        return emergencyCardUserList[selectedUser?.userId]
    },[emergencyCardUserList,selectedUser])

    const getBloodType = async () => {
        const bloodData = await getApiCall('GET', $Service_Url.getBloodType);
        let bloodtype = bloodData.filter((e) => {
            return e.value == String(returnSelectedMemberData?.bloodTypeId)
        })
        setbloodType(bloodtype[0]?.label);
    }

    return (

        <div id="newModal" className='modals'>
        <div className="modal" style={{ display: 'block', height:'95vh',borderRadius:'8px'}}>
          <div className="modal-dialog costumModal" style={{ maxWidth: '800px'}}>
            <div className="costumModal-content" style={{background:'#f8f8fa'}}>
              <div className="modal-header py-0 py-10" style={{background:'#F8F8F8'}}>
                <h5 className="modal-title ms-1">Emergency Card</h5>
                <img className='mt-0 me-1 cursor-pointer' onClick={()=>{setemergencyCard(false)}} src='/icons/closeIcon.svg'></img>
              </div>
              <div ref={componentRef} className="card-container">
              <div className="costumModal-body w-100 h-100 d-flex" >
                <div className="EmergencyCard">
                <div className="emergencycard-head">
                    {/* {profileUrl == 'No-Image' ? '' : <img src={profileUrl} />} */}
                    {/* <p className="mt-3 px-3">NAME</p> */}
                </div>
                <div className="emergencycard-body">
                    <h4 className={`fw-bold pt-4 ms-4 fs-14`} >{$AHelper.capitalizeFirstLetter(selectedUser?.fName) + " " + $AHelper.capitalizeFirstLetter(selectedUser?.lName)}</h4>
                    <div className="d-flex justify-content-between gap-2">
                    <div className="w-100">
                    <div className="d-flex pt-2 justify-content-between ms-4 gap-2">
                        <div className="item-div">
                            <p className="heading">MEMBER ID:</p>
                            <p className='fw-bold'>{returnSelectedMemberData?.memberId}</p>
                        </div>
                        <div className="item-div mx-4">
                            <p className="heading">PIN:</p>
                            <p className='fw-bold' >{returnSelectedMemberData?.pinCode}</p>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between pt-0 ms-4 gap-2">
                    <div className="item-div w-50">
                    <p className="heading">BLOOD GROUP:</p>
                    <p className='fw-bold'>{bloodTypeId ==  10 ?  "None" : bloodType}</p>
                    </div>
                    <div className="item-div w-50">
                    <p className="heading">ALLERGIES:</p>
                    <p className="fw-bold">{returnSelectedMemberData?.allergiesToMedications?.length > 50 ? returnSelectedMemberData?.allergiesToMedications.slice(0,50) +"..." : returnSelectedMemberData?.allergiesToMedications}</p>
                    </div>
                    </div>
                    <div className="pt-0 ms-4 w-100">
                    <div className="item-div w-100">
                        <p className="heading">MEDICAL CONDITIONS:</p>
                        <p className="fw-bold text-container">{returnSelectedMemberData?.medicalConditions}</p>
                    </div>
                    </div>

                    </div>
                    <div>
                    <div className="position-relative h-100 me-3" style={{marginTop:'-30px'}}>
                    <div className="d-flex justify-content-center me-4">
                    <img width="70px" loading='lazy' src="/New/image/Agingoptionlogo.svg" />
                    </div>
                    <div className="position-absolute w-100" style={{bottom:'-60px'}}>
                        <p className="mt-4 fw-7 text-center">Please Scan for additional Emergency Information Contacts</p>
                            <div className="qr-div">
                            <div>
                            <QRCode value={`${lpoiceLink}?userId=${primaryUserId}?cardId=${returnSelectedMemberData?.emergencyCardId}`} size="50" ref={qrCodeRef} />
                            </div>
                            </div>
                        </div>
                    </div>            
                </div>
                </div>
                </div>

                <div className="emergency-footer">
                    {/* <p className="fw-12 pb-1">Emergency Information</p>
                    {filteredUserContactDetails.filter((data)=>(data?.emergencyContactId != 0 ) )?.sort((a,b)=>{return a.emerContactPriorityId - b.emerContactPriorityId})?.map((item, idx) => {
                                    return <div className="d-flex pt-1 fw-10">
                                                                         
                                            <p>{item.fName + " " + item.lName} ({item?.relationshipName ? (item?.relationshipName == 'spouse' || item?.relationshipName == 'Spouse') ? `${$AHelper.$capitalizeFirstLetter(_spousePartner)}` : `${item.relationshipName}` : ""}) : {$oldAHelper.newPhoneNumberFormat(emergencyMobileEmailDetail[item?.userId]?.contact?.mobiles[0]?.mobileNo)?.length > 0 ? $oldAHelper.newPhoneNumberFormat(emergencyMobileEmailDetail[item?.userId]?.contact?.mobiles[0]?.mobileNo) : 'N/A'}</p>
                                        </div>
                                })
                            } */}

                </div>
                </div>
                <div className="EmergencyCard">
                <div className="emergencycard-head d-none">
                    {/* {profileUrl == 'No-Image' ? '' : <img src={profileUrl} />} */}
                    {/* <p className="mt-3 px-3">NAME</p> */}
                </div>
                <div className="emergencycard-body-back pt-3">
                    <div className="d-flex justify-content-between px-2" style={{height:'80px'}}>
                    <div className="px-3 pt-0">
                    <p className="fw-12 pb-1 fw-bold mt-1" style={{letterSpacing:'1.6px'}}>EMERGENCY CONTACTS:</p>
                    {filteredUserContactDetails.filter((data)=>(data?.emergencyContactId != 0 ) )?.sort((a,b)=>{return a.emerContactPriorityId - b.emerContactPriorityId})?.map((item, idx) => {
                    return <div className="d-flex pt-1 fw-10 ms-3">                   
                            <li className="contactName">{$AHelper.capitalizeFirstLetter(item.fName) + " " + $AHelper.capitalizeFirstLetter(item.lName)} ({item?.relationshipName ? (item?.relationshipName == 'spouse' || item?.relationshipName == 'Spouse') ? `${$AHelper.$capitalizeFirstLetter(_spousePartner)}` : `${item.relationshipName}` : ""}) : {$oldAHelper.newPhoneNumberFormat(emergencyMobileEmailDetail[item?.userId]?.contact?.mobiles[0]?.mobileNo)?.length > 0 ? $oldAHelper.newPhoneNumberFormat(emergencyMobileEmailDetail[item?.userId]?.contact?.mobiles[0]?.mobileNo) : 'N/A'}</li>
                        </div>
                    })}
                    <div className="d-flex pt-1 fw-10 ms-3">                   
                            <li>{userPhysicionList?.length > 0 && $AHelper.capitalizeFirstLetter(userPhysicionList[0]?.fName) + " " + $AHelper.capitalizeFirstLetter(userPhysicionList[0]?.lName)} (Primary Physician) : {userPhysicionList[0]?.mobileNumbers?.length > 0 ? $oldAHelper.newPhoneNumberFormat(userPhysicionList[0]?.mobileNumbers) : 'N/A'}</li>
                        </div>
                    </div>
                    <img  className="me-3 pt-0" style={{marginTop:'-30px'}} width="60px" height="auto" src="/New/image/WhiteLogo.svg" />
                    </div>
                    <div className="px-4" style={{marginTop:'10px'}} >
                        <p className="heading fw-12 fw-bold" style={{letterSpacing:'1.6px'}}>ADDRESS: </p>
                        <p className="fw-10 ms-4 pt-1" style={{width:'96%'}}>{isNotValidNullUndefile(address) ? ((address)?.length > 160 ? (address)?.slice(0,158)+"..." : address) : "No Data Found"}</p> 
                    </div>
                
                <div className="w-100 h-100">
                    <div className="w-100 text-center bg-white mt-2 mb-4" style={{backgroundColor:'white !important'}}>
                    <p className="fw-10 pt-2" style={{color: 'black'}}> This Card is property of AgingOptions and is intended for emergency use only. 
                        <br/>For assistance, Contact: 877-762-4464 Email: info@agingoptions.com.
                        <br/><b>Address:</b> 31919 6th Ave S, Federal Way, WA 98003.
                    </p>
                    <p className="text-center fw-9 pb-2" style={{color: 'black'}}>Valid Till: {moment(VaildDate)?.format('MM-DD-YYYY')}.</p>
                    </div>
                </div>
                </div>
              </div>
              </div>
              </div>
            <div className='d-flex justify-content-end mt-0 p-4' style={{width:"800px", fontSize:"10px"}}> 
            <ReactToPrint trigger={() => <CustomButton label="Print" />} content={()=>componentRef?.current}/>
            </div>
            </div>
         </div>
       </div>
      </div>
    )
}

export default EmergencyCard;
