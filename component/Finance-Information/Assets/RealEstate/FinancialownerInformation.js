import React from "react";
import {CustomCurrencyInput, CustomRadioAndCheckBox, CustomSelect } from "../../../Custom/CustomComponent";
import CustomCalendar from "../../../Custom/CustomCalendar";
import { OwnerDropDown } from "../../../Common/OwnerDropDown";
import ExpensesQuestion from "../../../Common/ExpensesQuestion";
import { Col, Row } from "react-bootstrap";


const FinancialownerInformation = ({realEstateitem,isRealPropertys,setisRealPropertys,setRealestateitem,showError,setShowError,liabilityType,lenderList,addLender,deleteUnchecked, isSideContent, startTabIndex}) =>{
    // const options = [{id:1,response:'Mortgage'},{id:1,response:'2nd Mortgage'},{id:1,response:'Line of Credit'},{id:1,response:'Other'}];
    const options = liabilityType?.map((e)=> {return {id:e.value,response:e.label,checked:lenderList?.some((ele)=>ele.liabilityId == e.value) ? true : false}})
    const startingTabIndex = startTabIndex ?? 0;  

console.log(lenderList,"lenderList",options)
    const handleInputChange = (key,value) => {
        console.log(key,value,"key,value")
        setisRealPropertys(prev=>({...prev,[key]:value}))
    }

    const handleChange = (key,value) => {
        setRealestateitem(prev=>({...prev,[key]:value}))
      }

    const handleSelectOwner = (val) => {
        console.log(val,"handleSelectOwner")
        setRealestateitem(prev=>({...prev,['assetOwners']:val}))
    }

    const handleSetErr =()=>{
        setShowError(false)
    }

    const handleLender = (val,item) =>{
        console.log(val.target.checked,'handleLenderhandleLender',item)
        if(val.target.checked == false){
            deleteUnchecked(item)
        }else{
        addLender(item)
        }
    }

    return(
        <Row className="col-12 d-flex">
            <Col className=" d-md mt-3 col-3 col-md-12 col-xl-3">
               <p className="heading-of-sub-side-links-3">{isSideContent}</p>
            </Col>
            <Col className="col-9 col-md-9">
                <Col className="col-xs-12 col-md-6 col-lg-5">
                <div className="spacingBottom">
                <CustomCalendar tabIndex={startingTabIndex + 1} label="Purchase date" placeholder="mm/dd/yyyy" value={isRealPropertys?.purchaseDate} onChange={(e)=>handleInputChange("purchaseDate",e)} />
                </div>
                <div className="spacingBottom">
                <CustomCurrencyInput  tabIndex={startingTabIndex + 2} label="Purchase price" value={isRealPropertys?.purchasePrice} onChange={(e)=>handleInputChange("purchasePrice",e)} />
                </div>
                <div className="spacingBottom">
                <CustomCurrencyInput tabIndex={startingTabIndex + 3} label={`Current value`} value={isRealPropertys?.value} onChange={(e)=>handleInputChange("value",e)}  />
                </div>
                </Col>
                <Col className="mt-0 col-xs-12 col-md-6 col-lg-5 spacingBottom">
                <OwnerDropDown startTabIndex={startingTabIndex + 4} assetOwners={realEstateitem?.assetOwners} savedAssetOwners={realEstateitem?.assetOwners} handleSelectOwner={handleSelectOwner} isInfoAdd={realEstateitem?.assetOwners.length == 0} isError={showError == true ? 'Please select owner type' : null} handleSetErr={handleSetErr} />
                </Col>
                {/* <Col>
                <ExpensesQuestion refrencePage="realEstate" key="realEstate" value={realEstateitem?.quesReponse} setStateInsDetail={handleChange} />
                </Col> */}
                <Col className="col-12 spacingBottom">
                <p className="fw-bold ps-2 mt-3">Debt against the property</p>
                <div className="ms-2 mb-2">
                 <CustomRadioAndCheckBox tabIndex={startingTabIndex + 5} placeholderConstant="showCheckboxDesign" options={options} type="checkbox" className="" onChange={(e,item)=>handleLender(e,item)}  />
                </div>
                </Col>
            </Col>
        </Row>
    )
}

export default FinancialownerInformation;