import React, { useEffect, useRef, useState } from 'react'
import {
    Button,
    Modal,
    Form,
    Row,
    Col
} from "react-bootstrap";
import konsole from '../control/Konsole';
import ReactToPrint from 'react-to-print';
import AlertToaster from '../control/AlertToaster';
import { $AHelper } from '../control/AHelper';
import QRCode from 'react-qr-code';
import { $CommonServiceFn } from '../network/Service';
import { $Service_Url } from '../network/UrlPath';
import { lpoiceLink } from '../control/Constant';

const EmergencyCard = ({ showEmergencyCard, selectEmergency, selectContacttype, selectallergytype, selectbloodtype, selectphysicalemergeny, AllFamilyMembers, AllPhysician, bloodType, onClose, emergencyContact, medicalConditions, pinNumber, cardId,addressData }) => {

    const [showModal, setShowModal] = useState(showEmergencyCard)
    const componentRef = useRef(null)
    const qrCodeRef = useRef(null);
    const [base64URL, setBase64URL] = useState('');
    const [addressInfo, setAddressInfo] = useState(addressData)
    const [memberInfo, setMemberInfo] = useState({})
    const [isRender,setIsRender]=useState(false)

    const primaryUserId = sessionStorage.getItem("SessPrimaryUserId")
    var currentDate = new Date();
    var oneYearLater = new Date();
    var VaildDate = oneYearLater.setFullYear(currentDate.getFullYear() + 1);

    useEffect(() => {
        if (!selectContacttype) {
            AlertToaster.error('Please select a contact type.')
            setShowModal(false)
        }
        konsole.log(addressData,"addressData")
    }, [])

    useEffect(() => {
        console.log(AllFamilyMembers,"AllFamilyMembers")
        const selectedMemberInfo = AllFamilyMembers?.filter((item) => item?.userId == selectContacttype)
        if (selectedMemberInfo?.length > 0) {
            setMemberInfo(selectedMemberInfo[0])
            if(selectedMemberInfo[0]?.address){
            setAddressInfo(selectedMemberInfo[0]?.address?.addresses[0])
            }
        }
        // console.log('selectedMemberInfo', selectedMemberInfo)       
    }, [selectContacttype, AllFamilyMembers])

    const handleClose = () => {
        setShowModal(false)
        onClose()
    }

    konsole.log(selectphysicalemergeny[selectphysicalemergeny.length - 1]?.professionalUserId, AllPhysician, selectphysicalemergeny, "selectphysicalemergeny", AllPhysician)
    let bloodtype = bloodType.filter((e) => {
        return e.value == selectbloodtype
    })
    let physicalContact = AllPhysician.filter((e) => {
        return e.professionalUserId == (selectphysicalemergeny[selectphysicalemergeny.length - 1]?.professionalUserId || selectphysicalemergeny[selectphysicalemergeny.length - 1]?.emergencyPhysicianUserId)
    })

    const reactToPrintTrigger = React.useCallback(() => {
        return <button className="theme-btn me-2" > Print</button>;
    }, []);
    const reactToPrintContent = React.useCallback(() => {
        let elem = componentRef.current;
        let domClone = elem.cloneNode(true);
        let $printSection = document.createElement("div");
        let $printImg = document.getElementsByTagName('img')
        $printSection.id = "printSection";
        $printSection.innerHTML = "";
        $printSection.appendChild(domClone);
        $printSection.style.width = "298mm"; /* DIN A4 standard paper size */

        // Calculate the height of the content
        let contentHeight = $printSection.scrollHeight;

        // Set the height of the $printSection element to match the height of the content
        $printSection.style.height = contentHeight + "px";

        // Set the padding of the $printSection element
        $printSection.style.padding = "0 50px";

        return $printSection;
    }, []);
    return (
        <div>
            <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            max-width: 47rem;
            margin: 1.75rem auto;
          }
        `}</style>


            <Modal
                show={showModal}
                //   size="md"
                //   centered
                onHide={handleClose}
                animation="false"
                backdrop="static"
            >
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Emergency Card</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row ref={componentRef}>
                        <div md="12" lg="12" className='p-3 emrgencyMainCol'>
                            <Col md='12' className='card-Col-Class px-0 m-3 bgforeccard'>
                                <Row id="divs" className='w-100' >
                                    <Col className='w-50 pt-4' style={{ paddingLeft: '32px' }}>
                                        <h6 className='bold pt-1'>Card Holder -</h6>
                                        <h1 style={{ color: "#720c20", fontSize: '24px',textTransform:"uppercase" }}><b>

                                            {Object.keys(memberInfo).length > 0 ? memberInfo?.fName + " " + memberInfo?.lName : ''}</b></h1>
                                        <div className='mt-2 list-e1'>
                                            <li>
                                                <img width='10px' src='/Member id.svg' /><b>Member ID : </b>  {memberInfo?.memberId}
                                            </li>
                                            <li>
                                                <img src='/Pin.svg' /><b>PIN : </b> {pinNumber}
                                            </li>
                                            <li>
                                                <img src='Valid till.svg' /><b>Valid till : </b> {$AHelper.getFormattedDate(VaildDate)}
                                            </li>
                                        </div>
                                    </Col>
                                    <Col className='w-50 mt-0 pt-0 ps-5 ms-5 pt-3'>
                                        <img className='mt-0 mx-auto d-flex justify-content-center' width='50%' src='logolpl.png'></img>
                                        <div className='mt-3 mx-auto d-flex justify-content-center' style={{ width: '80%' }} >
                                            <h6 className='text-center' style={{ fontSize: '10px' }}>  <img width='12px' className='mb-2 me-1' src='home logo.svg' /> 31919, 6th Ave S, Suite A100 Federal Way, WA 98003</h6>

                                        </div>
                                        <p className='text-center pt-4' style={{ fontSize: "7px", color: "light-grey" }}>powered by</p>
                                        <img className='mx-auto d-flex justify-content-center' width='30%' src='agingoption.png' />
                                    </Col>
                                </Row>
                                <Row id="divs" className='w-100 px-0 mx-0 pt-2' >
                                    <div className='pt-2' style={{ width: "40%" }}>

                                        <h6 className='ps-3 pt-2' style={{ fontSize: '10px' }}><i>Scan or Go online to access additional Emergency Information Contacts & Advanced Directives:</i></h6>
                                    </div>
                                    <div className=' px-0' style={{ width: "60%" }}>
                                    <div className='d-flex qrcodeDiv justify-content-center '>

                                    <QRCode value={`${lpoiceLink}?userId=${primaryUserId}?cardId=${cardId}`} size="50" ref={qrCodeRef} />
                                    <p className='ms-4 mt-2' id='font-7' style={{ fontSize: '7px !important', width: '90%' }}>{`${lpoiceLink}?userId=${primaryUserId}?cardId=${cardId}`}</p>
                                    </div>
                                    </div>
                                </Row>
                            </Col></div>
                        <Col md="12" lg="12" className='p-3 emrgencyMainCol' >
                            <Row className='d-flex justify-content-center bgforeccard'>
                                <Col lxs="6" sm="6" md="12" lg="12" className='p-3 card-Col-Class' >
                                    <Row id="divs" >
                                        <h2 className="headinge2">My Emergency Info & Medical Directives</h2>
                                        <Col xs="12" sm="12" md="12" lg="12" className='d-flex flex-column gap-4 px-3' id="div2">
                                            <Row className=' mt-2'>
                                                <div className='adressAlign'>
                                                    <h6 className='fw-bold me-2' >Address:</h6>
                                                    {addressInfo && Object.keys(addressInfo).length > 0 ? <><h6>{addressInfo?.addressLine1 + ", " + addressInfo?.city + ", " + addressInfo?.zipcode}</h6></>:<h6>Not available</h6>}

                                                </div>
                                            </Row>
                                            <Row>
                                                <div className='emergencydAlign'>
                                                    <h6 className='fw-bold me-2' >Emergency Contact:</h6>                                                
                                                    {(emergencyContact?.length > 0 && (emergencyContact?.filter((e) => e?.isEmergencyShow == true)?.length>0)) ? 
                                                    <>
                                                    {(emergencyContact?.filter((e) => e.isEmergencyShow == true))
                                                     ?.sort((a, b) => a?.emerContactPriorityId - b?.emerContactPriorityId)?.slice(0, 2)?.map((e, index) => (
                                                        <div>{
                                                            <div>
                                                            <h6><span className='upperCasing'>{e?.fName + " " + e?.lName}</span>
                                                               {(e?.contact?.contact?.mobiles[0]?.mobileNo)?
                                                                $AHelper.newPhoneNumberFormat(e?.contact?.contact?.mobiles[0]?.mobileNo)
                                                            //    $AHelper.newPhoneNumberFormat(e?.contact?.contact?.mobiles[0]?.mobileNo) +" "+ $AHelper.formatPhoneNumber((e?.contact?.contact?.mobiles[0]?.mobileNo?.slice(0, 4) == "+254") ? e?.contact?.contact?.mobiles[0]?.mobileNo : e?.contact?.contact?.mobiles[0]?.mobileNo?.slice(-10))
                                                               :<></>}
                                                             {index < emergencyContact.filter((e) => e.isEmergencyShow == true).slice(0, 2).length - 1 && <span>,&nbsp; </span>}</h6>
                                                        </div>}
                                                        </div>
                                                     ))
                                                        
                                                    }
                                                    </>: 'Not available'
                                                    }

                                                </div>
                                            </Row>
                                            <Row>
                                                <div className='physcianAlign'>

                                                    <h6 className='fw-bold me-2' >Physicians:</h6>

                                                    {(AllPhysician?.length > 0 && AllPhysician?.[0]?.isEmergencyPhysicianshow==true )
                                                    
                                                    ? AllPhysician?.map((e) => (<>
                                                        <h6><span className='upperCasing'>{e?.fName + ' ' + e?.lName}</span>
                                                         {e?.mobileNumbers && e?.mobileNumbers != 1 ?
                                                        <>
                                                            {(e?.mobileNumbers)?
                                                             $AHelper.newPhoneNumberFormat(e?.mobileNumbers)
                                                            // $AHelper.pincodeFormatInContact(e?.mobileNumbers) +" "+ $AHelper.formatPhoneNumber((e?.mobileNumbers?.slice(0, 4) == "+254") ? e?.mobileNumbers : e?.mobileNumbers?.slice(-10))
                                                            :<></>}
                                                        </>
                                                          : ''}</h6></>
                                                    )) : 'Not available'}

                                                </div>
                                            </Row>
                                            <Row>
                                                <div className='bloodAlign'>

                                                    <h6 className='fw-bold me-2' >Blood Group:</h6>

                                                    {bloodtype?.length > 0 ? bloodtype?.map((e) => (
                                                        <h6>{e?.label}</h6>

                                                    )) : 'Not available'}

                                                </div>
                                            </Row>
                                            <Row>
                                                <div className='allergiesAlign'>

                                                    <h6 className='fw-bold me-2' >Allergies:</h6>

                                                    {selectallergytype?.length > 50 ? selectallergytype?.slice(0, 50) + "..." : selectallergytype}

                                                </div>
                                            </Row>
                                            <Row>
                                                <div className='allergiesAlign d-flex'>

                                                    <h6 className='fw-bold me-2' >Medical Conditions:</h6>
                                                    {medicalConditions?.length > 50 ? medicalConditions?.slice(0, 50) + "..." : medicalConditions}

                                                </div>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <ReactToPrint content={reactToPrintContent} trigger={reactToPrintTrigger} />
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EmergencyCard