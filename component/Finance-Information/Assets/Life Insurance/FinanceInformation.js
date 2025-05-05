import React from "react";
import { CustomCurrencyInput, CustomSelect } from "../../../Custom/CustomComponent";
import { Col, Row } from "react-bootstrap";


const FinanceInfromation = ({data,preFrequencyList,setData, isSideContent, startTabIndex}) => {
    const startingTabIndex = startTabIndex ?? 0;  
    
    const handleInputChange = (value,key)=>{
        console.log(value,key,data,"value,key")

        setData(prev=>({
            ...prev,
            [key]:value
        }))
    }

    return(
        <Row className="d-flex" md={12}>
            <Col className="mt-3 description" md={12} xl={3}>
               <p className="heading-of-sub-side-links-3"> {isSideContent}</p>
            </Col>
            <Col xs={12} md={6} lg={4}>
                <Col className="spacingBottom">
                    <CustomCurrencyInput tabIndex={startingTabIndex + 1} label="Premium amount" value={data.premium} onChange={(e)=>handleInputChange(e,"premium")} />
                </Col>
                <Col className="spacingBottom">
                    <CustomSelect tabIndex={startingTabIndex + 2} label="Premium frequency" placeholder="Select" value={data.premiumId} options={preFrequencyList} onChange={(e)=>handleInputChange(e.value,"premiumId")} />
                </Col>
                <Col className="spacingBottom">
                    <CustomCurrencyInput tabIndex={startingTabIndex + 3} label="Cash value" value={data.cashValue} onChange={(e)=>handleInputChange(e,"cashValue")} />
                </Col>
                <Col className="spacingBottom">
                    <CustomCurrencyInput tabIndex={startingTabIndex + 4} label="Death benefit" value={data.deathBenefits} onChange={(e)=>handleInputChange(e,"deathBenefits")} />
                </Col>
            </Col>
            
        </Row>
    )
}

export default FinanceInfromation;