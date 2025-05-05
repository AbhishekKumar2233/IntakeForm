import React, { useEffect } from "react";
import { CustomCurrencyInput, CustomInput, CustomPercentageInput } from "../../../Custom/CustomComponent";
import { CustomButton } from "../../../Custom/CustomButton";
import ContactAndAddress from "../../../Custom/Contact/ContactAndAddress";
import CustomCalendar from "../../../Custom/CustomCalendar";
import { Col, Row } from "react-bootstrap";


const EditLender = ({showModal,setShowModal,lenderData,setLenderData,sumbitLender,primaryUserId,addressLenderRef,showLenderError,setShowlenderError, startTabIndex}) =>{
  
    // console.log(lenderData,"lenderDatashowModal",showModal)

    const startingTabIndex = startTabIndex ?? 0;  
    
    const handleInputChange = (key,value)=>{
        if(key == 'nameofInstitutionOrLender'){
          setShowlenderError(false);
        }
        setLenderData(prev=>({...prev,
            [key]:value
        }))
    }

    const returnContactAndAddress =(data) =>{
      console.log(data,"returnContactAndAddress")

    }
  
    const newLable = (lenderData?.liabilityId == "1" || lenderData?.liabilityId == "2") ? "Mortgage end date" : "Pay off date"

    return showModal ? <div id="hideModalScrollFromPersonalMedicalHistory" className='modals'>
        <div className="modal" style={{ display: 'block', height:'95vh',overflowY:true}}>
        <div className="modal-dialog costumModal" style={{ maxWidth: '500px'}}>
          <div className="costumModal-content">
            <div className="modal-header mt-3 ms-1">
              <h5 className="modal-title">Lender’s information</h5>
              <img className='mt-0 me-1'onClick={()=>setShowModal()} src='/icons/closeIcon.svg'></img>
            </div>
            <div className="costumModal-body">
            <div className="spacingBottom">
                <CustomInput tabIndex={startingTabIndex + 1} isPersonalMedical={true} id={"Name of Lender"} label="Name of Lender*" placeholder="Enter lender name" value={lenderData.nameofInstitutionOrLender} onChange={(e)=>handleInputChange("nameofInstitutionOrLender",e)} isError={showLenderError ? 'Please enter the lender name' : null} notCapital={false} />
                </div>
                <Row className="spacingBottom">
                  <Col xs={12} >
                    <CustomCalendar tabIndex={startingTabIndex + 2} label={newLable} placeholder="mm/dd/yyyy" allowFutureDate={true} isError='' name='insStartDate' customClassName={'allChild-w-100'} id='insStartDate' value={lenderData?.payOffDate} onChange={(val) => handleInputChange('payOffDate', val)} />
                  </Col>
                </Row>
                {/* {(lenderData?.liabilityId == "1" || lenderData?.liabilityId == "2") ? <Row className="spacingBottom">
                  <Col xs={12} >
                    <CustomCalendar tabIndex={startingTabIndex + 3} label={'Mortgage end date'} placeholder="mm/dd/yyyy" allowFutureDate={true} isError='' name='insStartDate' customClassName={'allChild-w-100'} id='insStartDate' value={lenderData?.endDateLiability} onChange={(val) => handleInputChange('endDateLiability', val)} />
                  </Col>
                </Row> : ''} */}
                <div className="spacingBottom">
                <CustomInput tabIndex={startingTabIndex + 4} notCapital={true} isPersonalMedical={true} label="Loan Number" placeholder="Enter" value={lenderData.loanNumber} onChange={(e)=>handleInputChange("loanNumber",e)} />
                </div>
                <div className="spacingBottom">
                <CustomCurrencyInput tabIndex={startingTabIndex + 5} isPersonalMedical={true} label="Monthly Amount" value={lenderData.paymentAmount} onChange={(e)=>handleInputChange("paymentAmount",e)}/>
                </div>
                <div className="spacingBottom">
                <CustomPercentageInput tabIndex={startingTabIndex + 6} isPersonalMedical={true} label="Interest Rate" value={lenderData.interestRatePercent} onChange={(e)=>handleInputChange("interestRatePercent",e)}/>
                </div>
                <CustomCurrencyInput tabIndex={startingTabIndex + 7} isPersonalMedical={true} label="Outstanding Balance" value={lenderData.outstandingBalance} onChange={(e)=>handleInputChange("outstandingBalance",e)} />
                <h5 className="py-4 modal-title">Lender's Address Infromation</h5>
                <ContactAndAddress startTabIndex={startingTabIndex + 8} isMandotry={false} refrencePage='lenderData' userId={lenderData?.lenderUserId} showType="both" returnContactAndAddress={returnContactAndAddress} ref={addressLenderRef}/>
           </div>
            <div className="modal-footer">         
            <CustomButton tabIndex={startingTabIndex + 9 + 20} label={lenderData.userLiabilityId == 0 ? "Save" : "Update"} onClick={()=>sumbitLender(lenderData.userLiabilityId == 0 ? 'addList' : '')} />
            </div>
          </div>
        </div>
      </div>
       </div>  : null
}

export default EditLender;