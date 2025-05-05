import React,{useCallback} from 'react'
import { Row, Col } from 'react-bootstrap'
import { CustomInput,CustomSelect,CustomCurrencyInput, CustomNumInput } from '../../Custom/CustomComponent'
import konsole from '../../../components/control/Konsole'

const BenefitInfo = ({isSideContent, setLongTermInsPolDetails, dataInfo, startTabIndex }) => {

  const startingTabIndex = startTabIndex ?? 0;  

  const handleInputChange = useCallback((key, value) => {
    // const valueUpperCase = $AHelper.$isUpperCase(value);
    konsole.log("valueUpperCase", key, value);
    setStateFun(key, value);
    // hideErrMsg(`${key}Err`, errMsg);
  }, []);

  const setStateFun = useCallback((key, value) => {
    setLongTermInsPolDetails(prev => ({
      ...prev, [key]: value
    }));
  }, [setLongTermInsPolDetails]);


  console.log(dataInfo?.maxBenefitYears,"dataInfo?.maxBenefitYears");
  

  return (
    <Row id='' className='mb-3'>

    {isSideContent &&
      <Col xs={12} md={12} xl={3}>
        <div className="heading-of-sub-side-links-3">{isSideContent}</div>
      </Col>
    }

    <Col xs={12} md={`${isSideContent ? '9' : '12'}`} >
      {/* {type == headerNav[1].value &&
        <StatusMessageForRelation msg={`You selected  ${spouseRelationSttus[primaryDetails.maritalStatusId]} as your relationship status.`} />
      } */}

      <Row className="spacingBottom gapNone">
        <Col xs={12} md={6} lg={5}>
        <CustomCurrencyInput tabIndex={startingTabIndex + 1}  name='' isError='' label="Daily benefit amount-nursing home" id='' 
      value={dataInfo?.dailyBenefitNHSetting} 
      onChange={(val) => handleInputChange('dailyBenefitNHSetting', val)}
       />
        </Col>
      </Row>
      <Row className="spacingBottom gapNone">
        <Col xs={12} md={6} lg={5}>
        <CustomCurrencyInput tabIndex={startingTabIndex + 2}   name='' isError='' label="Daily benefit amount other than nurse home setting" id='' 
      value={dataInfo?.dailyBenefitOtherThanNH} 
      onChange={(val) => handleInputChange('dailyBenefitOtherThanNH', val)}
       />
        </Col>
      </Row>
      <Row className="spacingBottom gapNone">
        <Col xs={12} md={6} lg={5}>
        <CustomCurrencyInput tabIndex={startingTabIndex + 3}  name='' isError='' label="Maximum lifetime benefits" id='' 
      value={dataInfo?.maxLifeBenefits}
       onChange={(val) => handleInputChange('maxLifeBenefits', val)}
       />
        </Col>
      </Row>
      <Row className="spacingBottom gapNone">
        <Col xs={12} md={6} lg={5}>
          <CustomNumInput
            tabIndex={startingTabIndex + 4} 
            // isError={errMsg.mNameErr}
            label="Number of years benefits will continue"
            placeholder="Enter"
            // id='mName'
            value={dataInfo?.maxBenefitYears}
            onChange={(val) => handleInputChange("maxBenefitYears",val)}
          />

        </Col>
      </Row>
      <Row className="spacingBottom gapNone">
        <Col xs={12} md={6} lg={5}>
          <CustomInput
            tabIndex={startingTabIndex + 5} 
            // isError={errMsg.mNameErr}
            label="Elimination period"
            placeholder="Days/Months/Years"
            // id='mName'
            value={dataInfo?.eliminationPeriod}
            onChange={(val) => handleInputChange('eliminationPeriod',val)}
          />

        </Col>
      </Row>
    </Col>
  </Row>
  )
}

export default BenefitInfo