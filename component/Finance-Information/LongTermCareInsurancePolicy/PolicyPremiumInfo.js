import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import konsole from '../../../components/control/Konsole';
import { CustomInput, CustomSelect } from '../../Custom/CustomComponent';
import CustomCalendar from '../../Custom/CustomCalendar';
import { CustomCurrencyInput } from '../../Custom/CustomComponent';
import { $Service_Url } from '../../../components/network/UrlPath';
import { $AHelper } from '../../Helper/$AHelper';
import { $Msg_LongTermInsDetails } from '../../Helper/$MsgHelper';
import { useAppDispatch } from '../../Hooks/useRedux';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { useLoader } from '../../utils/utils';
import { fetchInsProvider, fetchPreFrequencyData } from '../../Redux/Reducers/financeSlice';
import { useAppSelector } from '../../Hooks/useRedux';
import { selectorFinance } from '../../Redux/Store/selectors';
import { focusInputBox, getApiCall } from '../../../components/Reusable/ReusableCom';
import { updateTypeOfPolicyList } from '../../Redux/Reducers/financeSlice';
import Other from '../../../components/asssets/Other';
import ExpensesQuestion from '../../Common/ExpensesQuestion';

const PolicyPremiumInfo = forwardRef(({ isSideContent, setLongTermInsPolDetails, dataInfo,activeAccordian, addLongTermInsFor,insRef,insCompanyRef, startTabIndex }, ref) => {

  const newObjErr = () => ({ insTypeIdErr: "" });
  const [errMsg, setErrMsg] = useState(newObjErr());     
  const dispatch = useAppDispatch();
  const financeData = useAppSelector(selectorFinance);
  const {primaryUserId, spouseUserId} = usePrimaryUserId()
  const { insProviderList, typeOfPolicyList, preFrequencyList } = financeData
  const startingTabIndex = startTabIndex ?? 0;  



  konsole.log("propsopsopso", isSideContent, setLongTermInsPolDetails, dataInfo,errMsg,financeData)

  useEffect(() => {
    if(typeOfPolicyList?.length == 0){
      fetchLongTermTypeList();
    }
    if(insProviderList?.length == 0){
      fetchInsuranceProviderList()
    }
    if(preFrequencyList?.length == 0){
      fetchPremiumFreqList();
    }

  }, [primaryUserId, spouseUserId, activeAccordian, dispatch]);

  const fetchLongTermTypeList = async () => {
    useLoader(true);
    const _resultOfInsuranceDetail = await getApiCall('GET', $Service_Url.getLongTermsInsType);
    konsole.log("_resultOfInsuranceDetail1",_resultOfInsuranceDetail);
    useLoader(false);
    const insDetails = _resultOfInsuranceDetail != 'err' ? _resultOfInsuranceDetail : []
    dispatch(updateTypeOfPolicyList(insDetails));
  }

  const fetchInsuranceProviderList = async () => {
    useLoader(true);
    const _resultOfInsuranceDetail = await dispatch(fetchInsProvider());
    konsole.log("_resultOfInsuranceDetail2", _resultOfInsuranceDetail);
    useLoader(false);
  }

  const fetchPremiumFreqList = async () => {
    useLoader(true);
    const _resultOfInsuranceDetail = await dispatch(fetchPreFrequencyData());
    konsole.log("_resultOfInsuranceDetail3", _resultOfInsuranceDetail);
    useLoader(false);
  }

  const hideErrMsg = (key, errMsg) => {
    if (!$AHelper.$isNotNullUndefine(errMsg?.[key])) {
      setErrMsg(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateField = (field, errorMessageKey) => {
    if (!$AHelper.$isNotNullUndefine(field)) {
      setErrMsg(prev => ({ ...prev, [errorMessageKey]: $Msg_LongTermInsDetails[errorMessageKey] }));
      focusInputBox(errorMessageKey?.slice(0, -3))
      return false;
    } else {
      setErrMsg(prev => ({ ...prev, [errorMessageKey]: '' }));
    }
    return true;
  };

  const handleSelectChange = useCallback((value, key) => {
    konsole.log("handleOptionClick", key, value);
    if (key === "policyStartDate" || key === "lastTimePremiumIncrease") {
      setStateFun(key, JSON.parse(JSON.stringify(value)));
    } else {
      setStateFun(key, value.value);
    }
    hideErrMsg(`${key}Err`, errMsg);
  }, []);

  const handleInputChange = useCallback((value, key) => {
    const valueUpperCase = key != "premiumAmount" ? value : value;
    konsole.log("valueUpperCase",key, valueUpperCase);
    setStateFun(key, valueUpperCase);
    hideErrMsg(`${key}Err`, errMsg);
  }, []);

  const setStateFun = useCallback((key, value) => {
    setLongTermInsPolDetails(prev => ({
      ...prev, [key]: value
    }));
  }, [setLongTermInsPolDetails]);

    // validate Long term insurance details
    const validateLongTermInc = () => {
      const { insTypeId } = dataInfo;
  
      const isValidInsuranceType = validateField(insTypeId, 'insTypeIdErr');
      konsole.log("isValidInsuranceType11",isValidInsuranceType,insTypeId,dataInfo)
  
      return isValidInsuranceType 
    };

  useImperativeHandle(ref, () => ({
    validateLongTermInc
  }));

  return (
    <Row id='' className='mb-3'>
      {isSideContent &&
        <Col xs={12} md={12} xl={3}>
          <div className="heading-of-sub-side-links-3">{isSideContent}</div>
        </Col>
      }
      <Col xs={12} md={isSideContent ? '9' : '12'}>
        <Row className="spacingBottom gapNone">
          <Col xs={12} md={6} lg={5}>
            <CustomSelect
              tabIndex={startingTabIndex + 1} 
              isError={errMsg?.insTypeIdErr}
              id="insTypeId"
              label="Type of policy*"
              placeholder='Select'
              options={typeOfPolicyList}
              onChange={(e) => handleSelectChange(e, 'insTypeId')}
              value={dataInfo?.insTypeId}
            />
          </Col>
          {dataInfo?.insTypeId == "999999" && (
                  <Col xs="12" md="6" lg="5">
                    <Other
                      tabIndex={startingTabIndex + 2} 
                      othersCategoryId={34}
                      userId={addLongTermInsFor == "Spouse" ? spouseUserId : primaryUserId}
                      dropValue={dataInfo?.insTypeId}
                      ref={insRef}
                      natureId={dataInfo?.userLongTermInsId}
                    />
                  </Col>
                )}
        </Row>
        <Row className="spacingBottom">
          <Col xs={12} md={6} lg={5}>
            <CustomInput
              tabIndex={startingTabIndex + 3} 
              notCapital={true} 
              label="Policy number"
              placeholder="Enter"
              id='additionalDetails'
              value={dataInfo?.additionalDetails}
              onChange={(val) => handleInputChange(val, 'additionalDetails')}
            />
          </Col>
        </Row>
        <Row className="spacingBottom gapNone">
          <Col xs={12} md={6} lg={5}>
            <CustomSelect
              tabIndex={startingTabIndex + 4} 
              label="Insurance provider"
              placeholder='Select'
              onChange={(e) => handleSelectChange(e, 'insCompanyId')}
              options={insProviderList}
              value={dataInfo?.insCompanyId}
            />
          </Col>
          {dataInfo?.insCompanyId == "999999" && (
                  <Col xs="12" md="6" lg="5">
                    <Other
                      tabIndex={startingTabIndex + 5} 
                      othersCategoryId={12}
                      userId={addLongTermInsFor == "Spouse" ? spouseUserId : primaryUserId}
                      dropValue={dataInfo?.insCompanyId}
                      ref={insCompanyRef}
                      natureId={dataInfo?.userLongTermInsId}
                    />
                  </Col>
                )}
        </Row>
        <Row className="spacingBottom">
          <Col xs={12} md={6} lg={5}>
            <CustomCalendar
              tabIndex={startingTabIndex + 6} 
              label="Policy start date"
              value={dataInfo?.policyStartDate}
              placeholder="dd/mm/yyyy"
              onChange={(e) => handleSelectChange(e, 'policyStartDate')}
            />
          </Col>
        </Row>
        <Row className="spacingBottom">
          <Col xs={12} md={6} lg={5}>
            <CustomSelect
              tabIndex={startingTabIndex + 7} 
              label="Premium frequency"
              placeholder='Select'
              onChange={(e) => handleSelectChange(e, 'premiumFrequencyId')}
              options={preFrequencyList}
              value={dataInfo?.premiumFrequencyId}
            />
          </Col>
        </Row>
        <Row className="spacingBottom">
          <Col xs={12} md={6} lg={5}>
            <CustomCurrencyInput
              tabIndex={startingTabIndex + 8} 
              name='PremiumAmount'
              label='Premium amount'
              id='PremiumAmount'
              value={dataInfo?.premiumAmount}
              onChange={(val) => handleInputChange(val, 'premiumAmount')}
            />
          </Col>
        </Row>
        <Row className="spacingBottom">
          <Col xs={12} md={6} lg={5}>
            <CustomCalendar
              tabIndex={startingTabIndex + 9} 
              label="When was the last premium increased"
              value={dataInfo?.lastTimePremiumIncrease}
              placeholder="dd/mm/yyyy"
              onChange={(e) => handleSelectChange(e, 'lastTimePremiumIncrease')}
            />
          </Col>
        </Row>
        {/* @@ Expenses Question */}
        {/* <ExpensesQuestion
          key = "Policy"
          value={dataInfo?.quesReponse}
          setStateInsDetail={setStateFun}
          refrencePage='Policy'
       /> */}
      </Col>
    </Row>
  );
});

export default PolicyPremiumInfo;
