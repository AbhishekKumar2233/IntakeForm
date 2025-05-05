import React, { useState, useEffect, useContext } from 'react'
import Payment from './Payment';
import { Button, Modal } from 'react-bootstrap';
import ModalFooter from '../ModalFooter';
import ModalHeader from '../ModalHeader';
import konsole from '../../control/Konsole';
import { connect } from 'react-redux';
import { SET_LOADER } from '../../Store/Actions/action';
import AfterPaymentScreen from './AfterPaymentScreen';
import { globalContext } from '../../../pages/_app';
import CurrencyInput from 'react-currency-input-field';


const UpgradeModel = (props) => {
  konsole.log('propsprops', props)
  const { setdata } = useContext(globalContext)
  const context = useContext(globalContext)
  let enquirymemberDetail=JSON.parse(sessionStorage.getItem('enquirymemberDetails'))
  //define state-----------------------------------------------------
  const [trxnStatus, setTrxnStatus] = useState('')
  const [amtValue, setAmtValue] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [showwithOutPayment,setShowwithOutPayment] = useState(false)
  const [paymentType,setPaymentType]=useState('')

  //useEffect-----------------------------------------------------


  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const trxnStatus = queryParams.get('TrxnStatus');
    setTrxnStatus(trxnStatus)
  }, [])

  const withPayment = () => {
    const isValidAmount = amtValue > 0;
    isValidAmount ? props.dispatchloader(true) : toasterAlert('Please enter valid amount.');
    setShowPayment(isValidAmount);
  };

  //handle close and warning message show -------------------------------------

  const handleClose = () => {
    const url = window.location.origin + window.location.pathname;
    window.history.pushState({ path: url }, '', url);
    props.setshowModalState(false)
    //  window.location.reload()
  }
  function toasterAlert(text) {
    setdata({ open: true, text: text, type: "Warning" });
  }


  const handleWithOutPayment = async() => {
    const isOk = await context.confirm(true, "Are you sure? you want to upgrade this user as Intake Member wihout any payment", "Confirmation");
    if(isOk){
      sessionStorage.setItem("isStateId",1);
      setAmtValue(0)
      setPaymentType(3)
      setShowwithOutPayment(true)
    }
  }
const handleWithCash=async()=>{
    setPaymentType(2)
    const isValidAmount = amtValue > 0;
    if(isValidAmount==false){
      toasterAlert('Please enter valid amount.');
      return;
    }
    const isOk = await context.confirm(true, "Are you sure? you want to upgrade this user as Intake Member with cash", "Confirmation");
  if(isOk){
      setShowwithOutPayment(true)
    }
  }

  return (
    <>
      {(trxnStatus == 'SUCCESS') ? <>
        <AfterPaymentScreen getEnqueryMember={props.getEnqueryMember} />
      </> :
        <Modal show={props.showModalState} onHide={() => handleClose()} animation="false" backdrop="static"  >
          <div className='bg-light text-right px-3 fw-bold' style={{ "color": "#720520", "fontSize": "2rem", "cursor": "pointer" }} onClick={() => handleClose()}>
          <img src='/icons/cross.png' alt='Cross-Icon'/>
          </div>
          <Modal.Body className=" bg-light border-danger rounded">
            <div className=''>
              <ModalHeader />
            </div>

            <div className=''>
              <h1 className='text-center my-3'>User Activation</h1>
              {/* <input  className='mb-1' type='number' on placeholder='Enter Your Amount' value={amtValue} style={{ border: "1px solid #76272B", borderRadius: "5px" }} ></input> */}

              <CurrencyInput prefix="$" className="border" allowNegativeValue={false} value={amtValue} onValueChange={(e) => { setAmtValue(e) }} decimalScale="2" placeholder='Enter Your Amount' />

              <div className='text-center  p-3'>
                <button onClick={() => withPayment()} className='Payemnt rounded me-2'>Card</button>
                <button onClick={() => handleWithCash()} className='Payemnt rounded'>Cash</button>
                <hr />
                <button className=' Payemnt rounded' onClick={() => handleWithOutPayment()}>Without Payment</button>
                {/* Add order api after confirmationn order api after call all api  for withoiut payment */}
              </div>
            </div>
            <div className='Activation-footer-class'>
              <div
              // className="container-fluid m-0 bg-light"
              //  style={{height: 'auto'}}
              >
                <div class="my-1 brand-aging-options-footer1 pt-2">
                  <div class="brand-aging-options display-4 d-flex justify-content-center">
                    <p class="h5">Powered By</p>
                  </div>
                  <div class="d-flex justify-content-center">
                    <img src="../images/logo-footer.png" alt="brandAgingOptions" />
                  </div>
                </div>

              </div>
              {/* <ModalFooter /> */}
            </div>
          </Modal.Body>
        </Modal>
      }
      {showPayment && <Payment amtValue={amtValue} userId={enquirymemberDetail?.userId} seminarId={enquirymemberDetail.seminarId} />}
      {showwithOutPayment && <AfterPaymentScreen getEnqueryMember={props.getEnqueryMember} withoutpayment={true} paymentType={paymentType} amtValue={amtValue}  upgradeToIntakeClient = {props.upgradeToIntakeClient} handleClose = {handleClose} CallAfterUpgrade = {props?.CallAfterUpgrade}/>}
    </>
  )
}


const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader })
});

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeModel)
