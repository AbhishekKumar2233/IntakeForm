import React, { useEffect, useState,useImperativeHandle,forwardRef,useRef,useContext} from 'react'
import {Row, Col, Modal,Button,Form} from 'react-bootstrap';
import konsole from '../control/Konsole';
import { postApiCall } from '../Reusable/ReusableCom';
import { Api_Url } from '../network/UrlPath';
import { $AHelper } from '../control/AHelper';
import AlertToaster from '../control/AlertToaster';
import { isNullUndefine } from '../Reusable/ReusableCom';
import { globalContext } from '../../pages/_app';

const userProfileJson = () => {return { id: 0, merchantCustomerId: "", customerProfileId: "", userId: "", profileType: "",isDeleted: false,createdBy: "",isActive: true}}
const userCardJson = () => {return {id: 0, userProfileId: 0, cardNickName: "", paymentProfileId: "", customerProfileId: "", cardNumber: "", expireDate: "", cardType: "", cardIsDeleted: false, isDefault: false, streetAddress: "", apartmentNo: "", city : "", state: "", zipCode: "", cardIsActive: true, remarks: "", createdBy: "" }}

const PaymentMethod = (props,ref) => {  
  const { setdata, confirm } = useContext(globalContext);
    const userDetail = JSON.parse(sessionStorage.getItem("stateObj"))
    const primaryUserId = sessionStorage.getItem("SessPrimaryUserId") 
    const loginUserId = sessionStorage.getItem("loggedUserId")

    const [userCardJsonSet, setUserCardJsonSet] = useState({...userCardJson(),createdBy : loginUserId})
    konsole.log("propsposp",props,userCardJsonSet,loginUserId,props.updateCard)

    // const horizontalLine = () =>{
    //     return(
    //     <div className="d-flex justify-content-center mb-0 AMABorder">
    //          <div className="borderStylesInAMA">{/* Horizontal Line */}</div>
    //     </div>
    //     )
    // }

    useEffect(()=>{
      setStateToUpdate()
    },[props.updateCard])

    useImperativeHandle(ref,()=>({
      deleteCardDetails
    }))

    const setStateToUpdate = () =>{
      if(props.updateCard != undefined || props.updateCard != null){
         const mergeUpdateCardDetailObj = {...userCardJson(), ...props.updateCard,customerProfileId : "", updatedBy:loginUserId}
         const {createdBy, createdOn, updatedOn, ...rest} = mergeUpdateCardDetailObj
         konsole.log("mergeUpdateCardDetailObj",mergeUpdateCardDetailObj,rest)
         setUserCardJsonSet(rest)
      }
    }

    const formatCreditCardNumber = (value) => {
        // Remove any non-digit characters
        const digitsOnly = value?.replace(/\D/g, '');

        // Insert a space after every 4 digits
        const formattedValue = digitsOnly?.replace(/(\d{4}(?=\d))/g, '$1 ');
        return formattedValue;
    };
 
    const expiryDateValidationInput = (data) => {
      let value = data?.replace(/\D/g, ''); // Remove non-digit characters
    
      // Ensure month is between 01 and 12
      value = value?.replace(/^(\d{2})/, (match, month) => {
        if (parseInt(month) < 1 || parseInt(month) > 12) {
          return '0';
        }
        return month;
      });
    
      // Add slash after the second digit of the month
      value = value?.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
    
      // Remove slash if the last character being deleted is a slash
      value = value?.replace(/\/$/, '');
    
      // Truncate year to 2 digits
      value = value?.replace(/(\d{4})\d*/, '$1');
    
      return value; // Return the updated input value
    };
    
    
     
    const handleCardDetails = (e) => {
      const { name, value } = e.target;
      konsole.log("nammememmeme",name,value)
    
      let updatedValue = '';
      switch (name) {
        case "cardNumber":
          updatedValue = $AHelper.isNumberAndSpaceRegex(value) ? value?.replace(/\s/g, "") : '';
          break;
        case "expireDate":
          updatedValue = $AHelper.isNumberAndSlash(value) ? value : '';
          break;
        case "cardNickName":
          updatedValue = $AHelper.isNotallowspecialRegex(value) ? $AHelper.capitalizeFirstLetter(value) : '';
          break;
        default:
          updatedValue = value;
      }
    
      setUserCardJsonSet(prev => ({
        ...prev,
        [name]: updatedValue
      }));
    };

    const makeCardDefault = async() =>{ 
      let confirms = await confirm(true,'Are you sure you want to make this card default ?','Confirmation')
      if(confirms == false) return;
      setUserCardJsonSet(prev => ({
        ...prev,
        ["isDefault"]: true
      }));
    }
    

    // function getCardType(cardNumber) {
    //   // Visa
    //   if (/^4/.test(cardNumber)) {
    //     return 'Visa';
    //   }
    //   // Mastercard
    //   if (/^5[1-5]/.test(cardNumber)) {
    //     return 'Mastercard';
    //   }
    //   // American Express
    //   if (/^3[47]/.test(cardNumber)) {
    //     return 'American Express';
    //   }
    //   // Discover
    //   if (/^6(?:011|5)/.test(cardNumber)) {
    //     return 'Discover';
    //   }
    //   // Unknown
    //   return 'Unknown';
    // }

    const validateExpirationDate = (date) => {
      // Check if the date matches the mm/yy format
      const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!regex.test(date)) {
        return false;
      }
  
      // Check if the date is in the future
      const [month, year] = date.split('/');
      const expirationDate = new Date(`20${year}`, month);
      const currentDate = new Date();
  
      return expirationDate > currentDate;
    };
    
    const validate = () =>{
      if(isNullUndefine(userCardJsonSet?.cardNickName) == true){
        AlertToaster.error("Please enter card holder name")
        return;
      }
      if(isNullUndefine(userCardJsonSet?.cardNumber) == true){
        AlertToaster.error("Please enter card number")
        return;
      }
      if(userCardJsonSet?.cardNumber?.length != 16){
        AlertToaster.error("Please enter correct card number")
        return;
      }
      if (!validateExpirationDate(userCardJsonSet?.expireDate)) {
        AlertToaster.error('Please enter correct expiration date.');
        return;
      }
      if(isNullUndefine(userCardJsonSet?.expireDate) == true){
        AlertToaster.error("Please enter expiration date")
        return;
      }
      return true;
    }

    const saveAndEditCardDetails = () =>{
      if(validate()){
      if(props.updateCard != undefined || props.updateCard != null){
        userCard(userCardJsonSet,"updateCardDetail")
      }
      else{
        if(props?.profileDetails?.status == 404){
          userProfile()
        }
        else{
          const cardJson = {...userCardJsonSet,userProfileId:props?.profileDetails[0]?.id}
          userCard(cardJson)
        }
      } 
    }
    }

    const deleteCardDetails = (data) =>{
      const {createdBy, createdOn, updatedOn, updatedBy, ...rest} = data
      const json = {...rest, updatedBy : loginUserId,customerProfileId : "", cardIsDeleted : true, cardIsActive : false}
      konsole.log("deleteCardEtails",data,json)
      userCard(json,"deleteCardDetail")
    }

    const userProfile = async() => {
      
        const profileJson = {...userProfileJson(),merchantCustomerId : `AOUL-${userDetail?.loggenInId}`,userId:primaryUserId,createdBy: loginUserId}
        const responseData = await postApiCall("POST",Api_Url.postUserProfile,profileJson)
        konsole.log("responseDataUserProf",responseData,responseData?.data?.data)
        const userProfileId = responseData?.data?.data?.id
        const cardJson = {...userCardJsonSet,userProfileId:userProfileId}
        userCard(cardJson)
    }

    const userCard = async(cardJson,cardEvent) =>{
    const checkAlreadyAddedCard = props?.alreadyAddedCards.some(item => (item.cardNumber == cardJson.cardNumber) && (item.cardIsDeleted == false || item.cardIsDeleted == null))
    konsole.log("checkAlreadyAddedCard12",checkAlreadyAddedCard,cardJson,props?.alreadyAddedCards)
    if(!checkAlreadyAddedCard){
      const responseData = await postApiCall("POST",Api_Url.postUserCard,cardJson)
      AlertToaster.success(`Card details ${cardEvent == "deleteCardDetail" ? "deleted" : cardEvent == "updateCardDetail"  ? "updated" : "added"} successfully`)
      props?.getUserProfileFunc(primaryUserId)
      props?.handleClose()
      konsole.log("responseDataCard",responseData)
    }
    else{
      AlertToaster.error("Card already exists")  
    } 
  }



  return (
    <Modal
      show = {props.show}
      onHide = {props.handleClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton closeVariant='white'>
        <Modal.Title id="contained-modal-title-vcenter">
        {`${props?.updateCard ? "Update" : "Add"} Payment Method`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
            <Row>
                <Col lg={12}>
            <Row>
                <Col lg={8} md={8}>
                {/* <div className="d-flex">
                <div className='d-flex'>
                <Form.Check name="group1" type="radio" />
                <Form.Label className='mt-1 ms-2'>Credit Card</Form.Label>
            </div>
            <div className='d-flex ms-4'>
          <Form.Check name="group1" type="radio"/>
          <Form.Label className='mt-1 ms-2'>Debit Card</Form.Label>
            </div>
        </div> */}
                </Col>
            </Row>
            <Row className='mt-3'> 
                <Col lg={12} md={12}>
                <h5 className='fw-bold'>Credit Card Details</h5>
                </Col>
            </Row>
            <Row className='mt-4'>
            <Form.Group as={Row} className="financial-Adviser-Class mb-4">
                <Col xs={12} sm={6} lg={6} className="mb-2">
                  <Form.Label>Card Holder</Form.Label>
                  <Form.Control type="text" placeholder="Card holder name" name='cardNickName' value={userCardJsonSet?.cardNickName} onChange={(e)=>handleCardDetails(e)}/>
                </Col>
                <Col xs={12} sm={6} lg={6} className="mb-2">
                <Form.Label>Card Number</Form.Label>
                  <Form.Control type="text" placeholder="Card number" name='cardNumber' maxLength="19" value={formatCreditCardNumber(userCardJsonSet?.cardNumber)} onChange={(e)=>handleCardDetails(e)}/>
                </Col>
              </Form.Group>
            </Row>
            <Row>
            <Form.Group as={Row} className="financial-Adviser-Class mb-4">
                <Col xs={12} sm={6} lg={4} className="mb-2">
                 <Form.Label>Expiration Date</Form.Label>
                  <Form.Control type="text" placeholder="Expiration Date" maxLength="5" name='expireDate' value={expiryDateValidationInput(userCardJsonSet?.expireDate)} onChange={(e)=>handleCardDetails(e)}/>
                </Col>
                {/* <Col xs={12} sm={6} lg={3} className="mb-2">
                <Form.Label>CVV</Form.Label>
                  <Form.Control type="text" maxLength="4" placeholder="CVV" />
                </Col> */}
              </Form.Group>
            </Row>
            <Row>
            <Form.Group as={Row} className="financial-Adviser-Class">
                <Col xs={12} sm={6} lg={12} className="mb-2">
                <Form.Label>Billing Address1</Form.Label>
                <Form.Control type="text" placeholder="Billing Address" name='streetAddress' value={userCardJsonSet?.streetAddress} onChange={(e)=>handleCardDetails(e)}/>
                </Col>
                <Col xs={12} sm={6} lg={12} className="mb-2">
                <Form.Label>Billing Address2</Form.Label>
                <Form.Control type="text" placeholder="Billing Address" name='apartmentNo' value={userCardJsonSet?.apartmentNo} onChange={(e)=>handleCardDetails(e)}/>
                </Col>
                <Col xs={12} sm={6} lg={4} className="mb-2">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" placeholder="City" name='city' value={userCardJsonSet?.city} onChange={(e)=>handleCardDetails(e)}/>
                </Col>
                <Col xs={12} sm={6} lg={4} className="mb-2">
                <Form.Label>State</Form.Label>
                <Form.Control type="text" placeholder="State" name='state' value={userCardJsonSet?.state} onChange={(e)=>handleCardDetails(e)}/>
                </Col>
                <Col xs={12} sm={6} lg={4} className="mb-2">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control type="text" placeholder="Zip code" name='zipCode' value={userCardJsonSet?.zipCode} onChange={(e)=>handleCardDetails(e)}/>
                </Col>
              </Form.Group>
            </Row>
            </Col>
        </Row>
        <Row>
            <Col lg="12">
              <div className='d-flex justify-content-between'>
              <div className='mt-4'>
              {(userCardJsonSet?.isDefault == false || userCardJsonSet?.isDefault == null) && 
              <Button onClick={()=>makeCardDefault()} name = "isDefault" style={{backgroundColor:"white",border:"1px solid #720c20",color:"#720c20"}} className='px-4 py-2'>Set as default</Button>}
                </div>
                <div className='mt-4'>
            <Button onClick={()=>saveAndEditCardDetails()} style={{backgroundColor:"#720c20",borderStyle:"none"}} className='px-4 py-2'>{`${props?.updateCard ? "Update" : "Save"}`}</Button>
                </div>
              </div>
            </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default forwardRef(PaymentMethod);