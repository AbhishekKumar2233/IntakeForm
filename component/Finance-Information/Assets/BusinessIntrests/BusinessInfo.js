import React, { useState, useEffect, useCallback, useRef, useMemo, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { isContent } from '../../../Personal-Information/PersonalInformation';
import { useAppDispatch, useAppSelector } from '../../../Hooks/useRedux';
import { selectorFinance } from '../../../Redux/Store/selectors';
import { fetchBusinesstype } from '../../../Redux/Reducers/financeSlice';
import { CustomInput, CustomSelect,CustomTextarea } from '../../../Custom/CustomComponent';
import { CustomCurrencyInput } from '../../../Custom/CustomComponent';
import { $AHelper } from '../../../Helper/$AHelper';
import ExpensesQuestion from '../../../Common/ExpensesQuestion';
import Other from '../../../../components/asssets/Other';
import CustomCalendar from '../../../Custom/CustomCalendar';


const BusinessInfo = ({editInfo,userDetails,setUserDetails,isBusinessIntrests,bussRef,errMsg, setErrMsg,primaryUserId, isSideContent, startTabIndex}) => {

  const startingTabIndex = startTabIndex ?? 0;  

    const financeData = useAppSelector(selectorFinance);
    const { businessTypeList } = financeData;
   
    const dispatch = useAppDispatch();

    useEffect(() => {
      if($AHelper?.$isNotNullUndefine(editInfo)){
        const { nameofBusiness, businessTypeId, dateFunded, estimatedMarketValue,taxIDNo,additionalDetails,descOfBusiness,quesReponse} = editInfo
        setUserDetails(prevState => ({
            ...prevState,
            nameOfBusiness: nameofBusiness || '',
            businessTypeId: businessTypeId || '',
            insStartDate: dateFunded || '',
            balance: estimatedMarketValue || '',
            federaltaxno: taxIDNo || '',
            ubiNumber: additionalDetails || '',
            businessDescription: descOfBusiness || '',
            quesReponse: quesReponse || '',
            // Add other fields as needed
        }));
      }
    }, [editInfo])
    useEffect(() => {
        fetchApi()
    }, [])
    const fetchApi = async (userId) => {
        apiCallIfNeed(businessTypeList, fetchBusinesstype());     
       
      };
      const apiCallIfNeed = (data, action) => {
        if (data.length > 0) return;
        dispatch(action)
      }

      
    
    

   
    // @@ input change for input
    const handleInputChange = (key, value) => {
        setUserDetails(prev => ({
            ...prev, [key]: value
          }))
          handleSetErr(key, value)
    }
     // @@handle state update
  const setStateUserState = (key, value) => {
    setUserDetails(prev => ({
      ...prev, [key]: value
    }))
    handleSetErr(key, value)
  }
   // @@ handle setError

   const handleSetErr = (key, value) => {
    setErrMsg(prev => ({ ...prev, [key]: '' }));
  }

  return (
    <>
       {/* @@ This is the ui */}
      <Row className='mt-3'>
        <Col xs={12} md={12} xl={3}>
          <div className="heading-of-sub-side-links-3">{isSideContent}</div>
        </Col>
        <Col xs={12} md={9} xl={9} className=''>
          <Row className='spacingBottom'>
            {/* @@Name of institution */}
            <Col xs={12} md={6} lg={5}>
              <CustomInput tabIndex={startTabIndex + 1} isError={errMsg?.nameOfBusiness} label='Name of Business*' placeholder='Enter name' isDisable={false} id='nameOfBusiness' name='nameOfBusiness' value={userDetails?.nameOfBusiness} onChange={(val) => handleInputChange('nameOfBusiness', val)} />
            </Col>
          </Row>
          <Row className='spacingBottom'>
            {/* @@Description of asset */}
            <Col xs={12} md={6} lg={5}>
              <CustomSelect tabIndex={startTabIndex + 2}  isError={errMsg?.businessTypeId} name='businesstype' id='businesstype' label='Business Type*' placeholder='Select' options={businessTypeList} value={userDetails?.businessTypeId} onChange={(e) => handleInputChange('businessTypeId', e?.value)} />
            </Col>


          </Row>

          {userDetails?.businessTypeId == "999999" && (
            <Row className='spacingBottom'>
              <Col xs={12} md={6} lg={5}>
                <Other
                  tabIndex={startTabIndex + 3} 
                  othersCategoryId={30}
                  dropValue={userDetails?.businessTypeId}
                  ref={bussRef}
                  userId={primaryUserId}
                  natureId={userDetails?.natureId}
                />
              </Col>
            </Row>



          )}
            <Row className='spacingBottom'>
            {/* @@Description of asset */}
            <Col xs={12} md={6} lg={5}>
              <CustomCalendar tabIndex={startTabIndex + 4}  label={'Start date'} isError='' placeholder="mm/dd/yyyy" name='insStartDate' id='insStartDate' value={userDetails?.insStartDate} onChange={(val) => handleInputChange('insStartDate', val)} />
            </Col>


          </Row>
          <Row className='spacingBottom'>
            {/* @@Balance */}
            <Col xs={12} md={6} lg={5}>
              <CustomCurrencyInput tabIndex={startTabIndex + 5}  name='Estimated market value' isError='' label='Estimated market value' value={userDetails?.balance} id='balance' onChange={(val) => handleInputChange('balance', val)} />
            </Col>
          </Row>
          <Row className='spacingBottom'>
            {/* @@Name of institution */}
            <Col xs={12} md={6} lg={5}>
              <CustomInput tabIndex={startTabIndex + 6} notCapital={true} isError='' label='UBI number' placeholder='Enter' isDisable={false} id='ubiNumber' name='ubiNumber' value={userDetails?.ubiNumber} onChange={(val) => handleInputChange('ubiNumber', val)} />
            </Col>
          </Row>
          <Row className='spacingBottom'>
            {/* @@Name of institution */}
            <Col xs={12} md={6} lg={5}>
              <CustomInput tabIndex={startTabIndex + 7} notCapital={true} isError='' label='Federal tax ID no' placeholder='Enter' isDisable={false} id='federaltaxno' name='federaltaxno' value={userDetails?.federaltaxno} onChange={(val) => handleInputChange('federaltaxno', val)} />
            </Col>
          </Row>
          {/* <ExpensesQuestion
            key={`${"actionType"} ${isBusinessIntrests}`}
            value={userDetails?.quesReponse}
            refrencePage='Business'

            setStateInsDetail={setStateUserState}
          /> */}
          <Row className='mb-3 mt-3 ms-0' style={{fontWeight:"600",fontSize:"14px"}}>
            {/* @@Name of institution */}
            <Col className='ps-0' xs={12} md={6} lg={5}>
              <CustomTextarea tabIndex={startTabIndex + 8}  label={"Business description"} value={userDetails?.businessDescription} id={"businessDescription"} onChange={(val) => handleInputChange('businessDescription', val)} placeholder={"Description"} />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default BusinessInfo