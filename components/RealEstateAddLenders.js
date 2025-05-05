import React, { useState, useEffect, useRef, useContext } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb,} from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { $Service_Url } from "./network/UrlPath";
import { $CommonServiceFn } from "./network/Service";
import { $AHelper } from "./control/AHelper";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import moment from "moment";
import { globalContext } from "../pages/_app";
import AddressListComponent from "./addressListComponent";
import ContactListComponent from "./ContactListComponent";
import AlertToaster from "./control/AlertToaster";
import PlaceOfBirth from './PlaceOfBirth';
import { $getServiceFn,$postServiceFn } from "./network/Service";
import CurrencyInput from "react-currency-input-field";
import DynamicAddressForm from "./DynamicAddressForm";
import { isNotValidNullUndefile } from "./Reusable/ReusableCom";

const RealEstateAddLenders = (props) => {
  konsole.log("propaprops", props);

  const liabilityRef = useRef();
  const addressaddref = useRef();
  const contactRef = useRef();

  const { data, setdata, confirmyes, setConfirmyes, handleCloseYes } =
    useContext(globalContext);

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  let lenderName = props?.liabilitiesjson[props?.index].lendername;
  let Paymentamountes = props?.liabilitiesjson[props?.index].paymentAmount
  let lenderUserIdd = props?.liabilitiesjson[props?.index].lenderuserid;
  let outstandingBalances = props?.liabilitiesjson[props?.index].outstandingBalance
  let interestRates = props?.liabilitiesjson[props?.index].interestRatePercent
  let loanNumbers = props?.liabilitiesjson[props?.index].loanNumber

konsole.log(props,"asaasa")
  const [nameofLender, setnameofLender] = useState(lenderName);
  const [outstandingBalance, setOutstandingbalance] = useState(outstandingBalances);
  const [interestRate, setInterestrate] = useState(interestRates);
  const [loanNumber, setLoanNumber] = useState(loanNumbers);
  const [paymentAmount, setpaymentAmount] = useState (Paymentamountes)
 
  const [userId, setuserId] = useState("");
  const [loggedUserId, setloggedUserId] = useState("");
  const [subtenantId, setsubtenantId] = useState("");
  const [lenderUserId, setLenderUserId] = useState(lenderUserIdd);
  const addressdataRef = useRef(null)

useEffect(() => {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let loggedUserId = sessionStorage.getItem("loggedUserId") || "";
    let subtenantId = sessionStorage.getItem("SubtenantId") || "";
    setloggedUserId(loggedUserId);
    setuserId(newuserid);
    setsubtenantId(subtenantId);
   

  }, []);
  const toasterShowMsg = (message, type) => {
    setdata({
      open: true,
      text: message,
      type: type,
    });
  };
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

 
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const validate = () => {
    let nameError = "";
    if (nameofLender == "") {
      nameError = "Name of lender can not be Blank";
    }
    if (nameError) {
      toasterShowMsg(nameError, "Warning");
      return false;
    }
    return true;
  };
  const saveBtnFun = (type) => {
    if (validate()) {
      addmemberfun(type);
    }
  };

  const addmemberfun = (type) => {
 
    props.dispatchloader(true);
    let jsonobj = {
      subtenantId: subtenantId,
      fName: null,
      lName: null,
      isPrimaryMember: false,
    };
    let userId = props?.liabilitiesjson[props?.index]?.lenderuserid
    let ApiUrl = $Service_Url.postAddMember;
    let method = "";

    if (props.type == "Edit") {
      jsonobj["updatedBy"] = loggedUserId;
      jsonobj["userId"] = lenderUserId;
      ApiUrl = $Service_Url.putUpdateMember;
      method = "PUT";
    } else {
      ApiUrl = $Service_Url.postAddMember;
      jsonobj["createdBy"] = loggedUserId;
      method = "POST";
     
      
    
    //------------------------------------------------------------------------
    let nameofLendersplit = nameofLender.split(" ");
    if (nameofLendersplit.length == 1) {
      jsonobj["fName"] = nameofLendersplit[0];
      jsonobj["lName"] = null;
    }
     else if (nameofLendersplit.length > 1) {
      let lastName = nameofLendersplit
        .splice(nameofLendersplit.length - 1, 1)
        .join("");
      jsonobj["fName"] = nameofLendersplit.join(" ");
      jsonobj["lName"] = lastName;
    
    console.log("jsonobj2", jsonobj);
 }
  } 
  
  $CommonServiceFn.InvokeCommonApi(method, ApiUrl, jsonobj, (res, err) => {
    props.dispatchloader(false);
    if (res) {
      console.log("resresresres",res)
      
      console.log("typetype",type)
      konsole.log("postAddMember", res);
      let userId = res.data?.data?.member?.userId;
    
      addressdataRef?.current.upsertAddress(userId,1)

    
      let liabilitiesjson = props?.liabilitiesjson;
      liabilitiesjson[props?.index].lenderuserid = userId;
      liabilitiesjson[props?.index].lendername = nameofLender;
      liabilitiesjson[props?.index].paymentAmount = paymentAmount;
      liabilitiesjson[props?.index].outstandingBalance = outstandingBalance;
      liabilitiesjson[props?.index].loanNumber = loanNumber;
      liabilitiesjson[props?.index].interestRatePercent = interestRate;
      liabilitiesjson[props?.index].isActive = true;
     
     
     
      // contactRef.current.setUserIdOnly(userId);
     
      setLenderUserId(userId);
      if (type !== "save") {
         if (type == "contact") {
          contactRef.current.setUserId(userId);
        }
      } else {
        AlertToaster.success(`Data ${(method=='POST')?'saved ':'updated '}successfully`)
        props.handleClose();
      }
    }
     else {
      konsole.log("postAddMember", err);
    }
    
  });
    //------------------------------------------------------------------
   
  };
// const addmemberfun = (type) => {
//   props.dispatchloader(true);
//   let jsonobj = {
//     subtenantId: subtenantId,
//     fName: null,
//     lName: null,
//     isPrimaryMember: false,
//   };
//   //------------------------------------------------------------------
//   let ApiUrl = $Service_Url.postAddMember;
//   let method = "POST";
//   if (props.type == "Edit") {
//     jsonobj["updatedBy"] = loggedUserId;
//     jsonobj["userId"] = lenderUserId;
//     ApiUrl = $Service_Url.putUpdateMember;
//     method = "PUT";
//     AlertToaster.success("Data updated successfully");
//   } else {
//     ApiUrl = $Service_Url.postAddMember;
//     jsonobj["createdBy"] = loggedUserId;
//     method = "POST";
//     AlertToaster.success("Data saved successfully");
//   }
//   //------------------------------------------------------------------------
//   let nameofLendersplit = nameofLender.split(" ");
//   if (nameofLendersplit.length == 1) {
//     jsonobj["fName"] = nameofLendersplit[0];
//     jsonobj["lName"] = null;
//   } else if (nameofLendersplit.length > 1) {
//     let lastName = nameofLendersplit
//       .splice(nameofLendersplit.length - 1, 1)
//       .join("");
//     jsonobj["fName"] = nameofLendersplit.join(" ");
//     jsonobj["lName"] = lastName;
//   }
//   console.log("jsonobj2", jsonobj);

//   $CommonServiceFn.InvokeCommonApi(method, ApiUrl, jsonobj, (res, err) => {
//     props.dispatchloader(false);
//     if (res) {
//       konsole.log("postAddMember", res);
//       let userId = res.data?.data?.member?.userId;

//       let liabilitiesjson = props?.liabilitiesjson;
//       liabilitiesjson[props?.index].lenderuserid = userId;
//       liabilitiesjson[props?.index].lendername = nameofLender;
//       liabilitiesjson[props?.index].isActive = true;

//       // postUserLiabilities(userId, type)
//       // addressaddref.current.setUserIdOnly(userId);
//       setLenderUserId(userId);
//       if (type !== "save") {
//         if (type == "address") {
//           addressaddref.current.setUserId(userId);
//         } else if (type == "contact") {
//           contactRef.current.setUserId(userId);
//         }
//       } else {
//         props.handleClose();
//       }
//     } else {
//       konsole.log("postAddMember", err);
//     }
//   });
// };



  //     props.dispatchloader(true)

  //     let liableinput = {
  //         "liabilityTypeId": 6,
  //         "liabilityId": props?.liabitiestypeId,
  //         "userRealPropertyId": props?.userRealPropertyId,
  //         "nameofInstitutionOrLender": nameofLender,
  //         "lenderUserId": lenderUserId,
  //     }

  //     if (update == true) {
  //         liableinput["updatedBy"] = loggedUserId
  //     }
  //     else {
  //         liableinput["createdBy"] = loggedUserId

  //     }
  //     let totalinput = {
  //         userId: userId,
  //         liability: liableinput
  //     }
  //     //------------------------------------------
  //     var apiurl = $Service_Url.postAddLiability
  //     var method = "POST"
  //     if (update == true) {
  //         apiurl = $Service_Url.putAddLiability
  //         method = "PUT"

  //     }
  //     konsole.log("jaonobj2", JSON.stringify(totalinput))
  //     konsole.log("apiurl", apiurl, method)

  //     // ----------------------
  //     $CommonServiceFn.InvokeCommonApi(method, apiurl, totalinput, (res, err) => {
  //         props.dispatchloader(false)

  //         if (res) {
  //             konsole.log("postAddLiability", res)
  //             if (type !== 'save') {

  //                 addressaddref.current.setUserId(lenderUserId);
  //             } else {
  //                 props.handleClose()
  //             }

  //         } else {
  //             konsole.log("postAddLiability", err)
  //         }
  //     })

  // }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 useEffect(() => {
  if(props.type == "Edit"){
    addressdataRef?.current.getByUserId(props?.liabilitiesjson[props?.index]?.lenderuserid)
    }
 }, [props.type])

 const handleLoanNumber = (value) => {
  if ($AHelper.isNumberRegex(value)) {
     setLoanNumber(value)
  }
}


const handleCloseOnCancelBtn=()=>{
  if(props.type !="Edit"){
    let liabilitiesjson = props?.liabilitiesjson;
    liabilitiesjson[props?.index].lenderuserid = '';
    liabilitiesjson[props?.index].lendername = '';
    liabilitiesjson[props?.index].paymentAmount = '';
    liabilitiesjson[props?.index].outstandingBalance = '';
    liabilitiesjson[props?.index].loanNumber = '';
    liabilitiesjson[props?.index].interestRatePercent = '';
    liabilitiesjson[props?.index].isActive = false;
  }
 
  props.handleClose()
}
 
  return (
    <>
      <Modal
        size="md"
        show={props.show}
        onHide={()=>handleCloseOnCancelBtn()}
        centered
        animation="false"
        backdrop="static"
        enforceFocus={false}
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>{props.type !='Edit' ?'Add':'Update' }  Lender Details </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <div className="person-content">
            <Form.Group as={Row} className="">
              <Col xs="12" sm="12" lg="6" className="mb-2">
                <Form.Control
                className="upperCasing"
                  type="text"
                  value={nameofLender}
                  onChange={(e) => setnameofLender(e.target.value.trimStart())}
                  name="nameofLender"
                  placeholder="Name of Lender*"
                
                  onInput={(e) => (e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}

                  />
              </Col>
              {/* <Col xs sm="6" lg="4">
                <Form.Control
                  type="text"
                  value={props?.contactName}
                  onChange={(e) => props?.setContactname(e.target.value)}
                  name="contactName"
                  placeholder="Contact name"
                />
              </Col> */} 
                <Col xs="12" sm="12" lg="6" className="mb-2">
                <CurrencyInput
                  prefix="$"
                  value={paymentAmount}
                  allowNegativeValue={false}
                  className="border"
                  onValueChange={(value)=> setpaymentAmount(value)}
                  name="Monthly Amount"
                  placeholder="Monthly Amount"
                  decimalScale="2"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="">
             
              <Col xs="12" sm="12" lg="6" className="mb-2">
                <CurrencyInput
                  suffix='%'
                  value={interestRate}
                  onValueChange={(e) => {
                  const newValue = (e);
                  if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                  setInterestrate(newValue); 
                  }else{
                  setInterestrate("")
                  }}}
                  name="interestRate"
                  placeholder="Interest rate"
                  // maxLength={4}
                  className="border"
                  allowDecimals={true}
                  allowNegativeValue={false}
                />
              </Col>
              {konsole.log("hjyhyhyhyy", outstandingBalance)}
              <Col xs="12" sm="12" lg="6" className="mb-2">
                <CurrencyInput
                  prefix="$"
                  // defaultValue={outstandingBalance}
                  value={outstandingBalance}
                  allowNegativeValue={false}
                  className="border"
                  onValueChange={(value) => setOutstandingbalance(value)}
                  name="outstandingBalance"
                  placeholder="Outstanding balance"
                  decimalScale="2"
                />
                {/* <Form.Control
                  type="number"
                  value={outstandingBalance}
                  onChange={(e) =>setOutstandingbalance(e.target.value)}
                  name="outstandingBalance"
                  placeholder="Outstanding balance"
                  min={0}
                /> */}
              </Col>

              <Col xs="12" sm="12" lg="6" className="mb-2">
                <Form.Control
                  type="text"
                  value={loanNumber}
                  onChange={(e) => handleLoanNumber(e.target.value)}
                  
                  name="loanNumber"
                  placeholder="Loan number"
                  min={0}
                />
              </Col>
            </Form.Group>
            
            <Form.Group as={Row} className="mb-3">
            <Col xs="12" sm="12" lg="12">
               {/* <AddressListComponent
                userId={lenderUserId}
                ref={addressaddref}
                invokepostmember={saveBtnFun}
                editType="EstateLenders"
              /> */}
               {/* <PlaceOfBirth
                addressDetails={addressDetails}
                invokepostmember={saveBtnFun}
                addressData={addressData}
                placeholder={"Address"}
              /> */}
              <DynamicAddressForm ref={addressdataRef} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} >
            <Col xs="12" sm="12" lg="12"  className="mb-3" >
              {lenderUserId !== undefined &&
              lenderUserId !== "" &&
              lenderUserId !== null ? (
                <ContactListComponent userId={lenderUserId} ref={contactRef} />
              ) : (
                <Row className="">
                  <Col xs="12" sm="12" md="12" className="d-flex align-items-center ">
                    <button
                      className="white-btn"
                      onClick={() => saveBtnFun("contact")}
                    >
                      Contact
                    </button>
                  </Col>
                </Row>
              )}
              </Col>
            </Form.Group>
          </div>

          {console.log("propstype",props.type)}
          <Button
            className="theme-btn float-end mb-2"
            onClick={() => {props.type !== "Edit" && isNotValidNullUndefile(lenderUserId) ? props.handleClose() : saveBtnFun("save"); }} > {props.type !='Edit' ?'Save':'Update' } {" "}
           </Button>
          <Button  className='cancel-Button'  onClick={() => handleCloseOnCancelBtn()}> Cancel</Button>
         
        </Modal.Body>
        {/* <Modal.Footer
          className="border-0 mb-3"
          style={{ maxHeight: "15vh", overflowY: "scroll" }}
        ></Modal.Footer> */}
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RealEstateAddLenders);
