import React,{useCallback} from 'react'
import { Row, Col } from 'react-bootstrap'
import { CustomRadio,CustomPercentageInput } from '../../Custom/CustomComponent'
import { radioYesNoLabelWithBool,radioSimpleCompound } from '../../Helper/Constant'
import konsole from '../../../components/control/Konsole'
import { $AHelper } from '../../Helper/$AHelper'

const InflationProtection = ({isSideContent, setLongTermInsPolDetails, dataInfo, startTabIndex}) => {

  const startingTabIndex = startTabIndex ?? 0;  
  
  const handleInputChange = useCallback((key, value) => {
    // const valueUpperCase = $AHelper.$isUpperCase(value);
    konsole.log("valueUpperCase",key, value);
    setStateFun(key, value);
    // hideErrMsg(`${key}Err`, errMsg);
  }, []);

  const setStateFun = useCallback((key, value) => {
    setLongTermInsPolDetails(prev => ({
      ...prev, [key]: value
    }));
  }, [setLongTermInsPolDetails]);

  return (
    <Row>
      {isSideContent &&
      <Col xs={12} md={12} xl={3}>
        <p className="heading-of-sub-side-links-3">{isSideContent}</p>
      </Col>
    }
     <Col xs={12} md={`${isSideContent ? '12' : '12'}`} xl={`${isSideContent ? '9' : '12'}`} >
    <Row className='mb-3'>
    <Col xs={12} md={7}>
    <div className="custom-input-field">
        <CustomRadio 
         tabIndex={startingTabIndex + 1} 
         options={radioYesNoLabelWithBool}
         classType='' 
         placeholder={'Does the plan have an inflation rider?'} 
         value={$AHelper.$isNotNullUndefine(dataInfo?.planWithInflationRider) ? JSON?.parse(dataInfo?.planWithInflationRider) : null}
         onChange={(item) => handleInputChange('planWithInflationRider',item?.value)} 
         />
      </div>
    </Col>
    </Row>
    {(dataInfo?.planWithInflationRider == true || dataInfo?.planWithInflationRider == "true") && 
    <Row className='mb-5'>
      <Col lg={12} xl={10} xs={12} md={12} className='p-3' style={{backgroundColor:"#F8F8F8",borderRadius:"8px"}}>
    <Row className='mb-0'>
    <Col xs={12} md={6} lg={6}>
        <CustomPercentageInput
          tabIndex={startingTabIndex + 2} 
          isError=''
          label="Inflation Percentage"
          placeholder="% Enter"
          id='accountnumber'
          onChange={(val) => handleInputChange('planWithInflationRiderPer', val)}
          value={dataInfo?.planWithInflationRiderPer}
      />
    </Col>
    </Row>
    <Row className='mb-3'>
    <Col xs={12} md={7}>
        <CustomRadio 
         tabIndex={startingTabIndex + 3} 
         options={radioSimpleCompound}
         classType='' 
         value={dataInfo?.inflationRiderTypeId} 
        onChange={(item) => handleInputChange("inflationRiderTypeId",item?.value)} 
         />
    </Col>
    </Row>
      </Col>
    </Row>}
     </Col>
    </Row>
  )
}

export default InflationProtection