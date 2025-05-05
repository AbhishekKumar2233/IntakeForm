import React from "react";
import { Col, Row } from "react-bootstrap";
import CustomCalendar from "../../../Custom/CustomCalendar";
import { CustomCurrencyInput, CustomInput, CustomSearchSelect, CustomSelect } from "../../../Custom/CustomComponent";
import { isNullUndefine } from "../../../../components/Reusable/ReusableCom";
import { $AHelper } from "../../../Helper/$AHelper";
import konsole from "../../../../components/control/Konsole";

const AutoInformation = ({setAssetInfo, assetInfo, isSideContent, startTabIndex}) => {
  const startingTabIndex = startTabIndex ?? 0;  


  const handleOnchange = (key, value) => {
    konsole.log("dsvnjkn-change", key, value)
     setAssetInfo(prev => ({
         ...prev,
         [key]: value
     }))
   };

  const today = new Date();
  const years = Array.from({ length: today.getFullYear() - 1900 + 1 }, (_, i) => ({label: String(1900 + i), value: 1900 + i}));
 
  return (
    <>
      <Row className="spacingBottom">
        <Col md={12} xl={3}>
          <p className="heading-of-sub-side-links-3">{isSideContent}</p>
        </Col>
        <Col xs={12} md={6} lg={4}>
          {/* <CustomCalendar
            label='Year made'
            isError=''
            placeholder="mm/dd/yyyy"
            name='yearMade'
            id='yearMade'
            value={assetInfo.yearMade}
          onChange={(val) => handleOnchange('yearMade', val)} 
          /> */}
          <CustomSearchSelect
            tabIndex={startingTabIndex + 1}
            isError={''}
            name='yearMade'
            id='yearMade'
            label='Year made'
            placeholder='Select'
            options={years}
            value={$AHelper.$getYearFromDate(assetInfo.yearMade)}
            onChange={(e) => {
              const dateSelected =  $AHelper.$getDateFromYear(e.value);
              handleOnchange('yearMade', dateSelected)
            }}
          />
        </Col>
      </Row>
      
      <Row className="spacingBottom">
        <Col md={12} xl={3}>

        </Col>
        <Col xs={12} md={6} lg={4}>
          <CustomInput
            tabIndex={startingTabIndex + 2}
            // isError={errMsg.fNameErr}
            label="Make"
            placeholder="Enter"
            id='MaknameOfInstitutione'
            value={assetInfo.nameOfInstitution}
            notCapital={true}
          onChange={(val) => handleOnchange( 'nameOfInstitution', val)}
          />
        </Col>
      </Row>
      <Row className="spacingBottom">
        <Col md={12} xl={3}>

        </Col>
        <Col xs={12} md={6} lg={4}>
          <CustomInput
           tabIndex={startingTabIndex + 3}
            // isError={errMsg.fNameErr}
            label="Model"
            placeholder="Enter"
            id='modelNumber'
            value={assetInfo.modelNumber}
            notCapital={true}
           onChange={(val) => handleOnchange('modelNumber', val)}
          />
        </Col>
      </Row>

      <Row className="spacingBottom">
        <Col md={12} xl={3}>

        </Col>
        <Col xs={12} md={6} lg={4}>
          <CustomCurrencyInput
            tabIndex={startingTabIndex + 4}
            name='value'
            isError=''
            placeholder="0.00"
            label='Value'
            value={assetInfo.balance}
            id='value'
          onChange={(val) => handleOnchange('balance', val)} 

          />
        </Col>
      </Row>
      <Row className="spacingBottom">
        <Col md={12} xl={3}>

        </Col>
        <Col xs={12} md={6} lg={4}>
          <CustomInput
            tabIndex={startingTabIndex + 5}
            // isError={errMsg.fNameErr}
            label="Color (Optional)"
            placeholder="Enter"
            id='Color'
            value={assetInfo.productColor}
            notCapital={true}
            onChange={(val) => handleOnchange('productColor', val)}
          />
        </Col>
      </Row>
      <Row className="spacingBottom">
        <Col md={12} xl={3}>

        </Col>
        <Col xs={12} md={6} lg={4}>
          <CustomInput
            tabIndex={startingTabIndex + 6}
            notCapital={true}
            // isError={errMsg.fNameErr}
            label="License Plate"
            placeholder="Enter"
            id='License'
            value={assetInfo.licensePlate}
          onChange={(val) => handleOnchange('licensePlate', val)}
          />
        </Col>
      </Row>
      <Row className="spacingBottom">
        <Col md={12} xl={3}>

        </Col>
        <Col xs={12} md={6} lg={4}>
          <CustomInput
            notCapital={true}
            tabIndex={startingTabIndex + 7}
            // isError={errMsg.fNameErr}
            label="VIN No."
            placeholder="Enter"
            id='VIN'
            value={assetInfo.vinno}
            // isSmall={true}
          onChange={(val) => handleOnchange('vinno', val )}
          />
        </Col>
      </Row>

      <Row className="spacingBottom">
        <Col md={12} xl={3}>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <CustomCalendar
           tabIndex={startingTabIndex + 8}
            label={'Vehical registration expiry date'}
            isError=''
            placeholder="mm/dd/yyyy" 
            name='expiryDate'
            id='exipryDate'
            value={assetInfo.expiryDate}
            allowFutureDate={true}
          onChange={(val) => handleOnchange('expiryDate', val)} 
          />
        </Col>
      </Row>

    </>
  )
}
export default AutoInformation