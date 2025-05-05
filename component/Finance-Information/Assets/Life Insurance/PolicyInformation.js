import React from "react";
import { CustomInput, CustomSelect } from "../../../Custom/CustomComponent";
import CustomCalendar from "../../../Custom/CustomCalendar";
import Other from "../../../../components/asssets/Other";
import { Col, Row } from "react-bootstrap";


const PolicyInformation = ({insProviderList,policyTypeList,data,setData,userId,insCompanyRef,policyRef,showError,setShowError, isSideContent, startTabIndex}) =>{

    const startingTabIndex = startTabIndex ?? 0;  
    // console.log(data,"data3244444444",insProviderList)
    const handleInputChange = (value,key)=>{
        console.log(value,key,data,"value,key")

        setData(prev=>({
            ...prev,
            [key]:value
        }))
        setShowError(false)
    }

    return (
        <Row className="d-flex mb-4" md={12}>
            <Col md={12} xl={3} className="mt-3">
                <p className="heading-of-sub-side-links-3">{isSideContent}</p>
            </Col>
            <Col xs={12} md={6} lg={4}>
                <Col className="spacingBottom">
                    <CustomSelect tabIndex={startingTabIndex + 1} label="Insurance company*" id="insuranceCompanyId" placeholder="Select" options={[...insProviderList].sort((a, b) => a.label.localeCompare(b.label))} value={data.insuranceCompanyId} onChange={(e)=>handleInputChange(e.value,"insuranceCompanyId")} isError={showError ? 'Insurance company is required' : ''} />
                    </Col>
                    {data.insuranceCompanyId == "999999" && (
                     <Col className="spacingBottom">   
                    <Other tabIndex={startingTabIndex + 2}  othersCategoryId={12} userId={userId} dropValue={data.insuranceCompanyId} ref={insCompanyRef} natureId={data.userLifeInsuranceId} /> </Col>
                  )}
               
                <Col className="spacingBottom">
                    <CustomSelect tabIndex={startingTabIndex + 3}  label="Type of policy" placeholder="Select" options={policyTypeList} value={data.policyTypeId} onChange={(e)=>handleInputChange(e.value,"policyTypeId")} />
                </Col>
                    {data.policyTypeId == "999999" && (
                    <Col className="spacingBottom">
                    <Other tabIndex={startingTabIndex + 4}  othersCategoryId={23} userId={userId} dropValue={data.policyTypeId} ref={policyRef} natureId={data.userLifeInsuranceId} />
                    </Col>
                  )}
                <Col className="spacingBottom">
                    <CustomInput tabIndex={startingTabIndex + 5}  notCapital={true} label="Policy number" placeholder="Enter number " value={data.additionalDetails} onChange={(e)=>handleInputChange(e,"additionalDetails")} />
                </Col>
                <Col className="spacingBottom">
                    <CustomCalendar tabIndex={startingTabIndex + 6}  label="Policy start date" placeholder="mm/dd/yyyy" value={data.policyStartDate} onChange={(e)=>handleInputChange(e,"policyStartDate")} />
                </Col>
                <Col className="">
                    <CustomCalendar tabIndex={startingTabIndex + 7}  label="Policy end date" placeholder="mm/dd/yyyy" value={data.policyExpiryDate} onChange={(e)=>handleInputChange(e,"policyExpiryDate")} allowFutureDate="true" />
                </Col>
            </Col>

        </Row>
    )
}

export default PolicyInformation;