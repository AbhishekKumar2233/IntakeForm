import React, { useState, useEffect, useCallback, useRef, useMemo, useContext,useImperativeHandle ,forwardRef} from 'react';
import { Row, Col } from 'react-bootstrap';
import { useAppDispatch, useAppSelector  } from '../../Hooks/useRedux';
import { selectorFinance } from '../../Redux/Store/selectors';
import { fetchLiabilityType } from '../../Redux/Reducers/financeSlice';
import { CustomInput, CustomSelect,CustomTextarea  } from '../../Custom/CustomComponent';
import { CustomCurrencyInput } from '../../Custom/CustomComponent';
import { $AHelper } from '../../Helper/$AHelper';
import CustomCalendar from '../../Custom/CustomCalendar';
import { $Msg_Liability } from '../../Helper/$MsgHelper';
import Other from '../../../components/asssets/Other';
import { focusInputBox } from '../../../components/Reusable/ReusableCom';
import konsole from '../../../components/control/Konsole';

const AddLiabilityInfromation = forwardRef(({editInfo,setUserDetails,liablitiesData, setliablitiesData,isContent,isEdit,leaseNRealEstatelist,otherRef,primaryUserId, startTabIndex, setActiveKeys},ref) => {
    const newObjErr = () => ({ liabilityTypeIdErr: "", nameofInstitutionOrLenderErr: ""});
    const [errMsg, setErrMsg] = useState(newObjErr());
    const leaseNtransportId = [6, 7]    
    const financeData = useAppSelector(selectorFinance);
    const { liabilityTypes } = financeData;
    const dispatch = useAppDispatch();
    const startingTabIndex = startTabIndex ?? 0;

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
        apiCallIfNeed(liabilityTypes, fetchLiabilityType());     
       
   };
   const apiCallIfNeed = (data, action) => {
        if (data.length > 0) return;
        dispatch(action)
   }
   const handleInputChange =async(value,name)=>{
    
    setliablitiesData(prev => ({ ...prev, [name]: value }));
    hideErrMsg(`${name}Err`, errMsg)

   }
   const validateField = (field, errorMessageKey) => {
    if (!$AHelper.$isNotNullUndefine(field)) {
      setErrMsg(prev => ({ ...prev, [errorMessageKey]: $Msg_Liability[errorMessageKey] }));
      focusInputBox(errorMessageKey?.slice(0,-3));
      setActiveKeys(["0"]); 
      return false;
    } else {
      setErrMsg(prev => ({ ...prev, [errorMessageKey]: '' }));
    }
    return true;
  }; 
  const validateContacts = () => {
    const isValidliabilityTypeId = validateField(liablitiesData?.liabilityTypeId, 'liabilityTypeIdErr');
    const isValidnameofInstitutionOrLender = validateField(liablitiesData?.nameofInstitutionOrLender, 'nameofInstitutionOrLenderErr');
    return isValidliabilityTypeId && isValidnameofInstitutionOrLender;
  };
  useImperativeHandle(ref, () => ({
    validateContacts
  }));

// konsole.log("liabilityTypes",liablitiesData?.liabilityTypeId)

  const hideErrMsg = (key, errMsg) => {

    if ($AHelper.$isNotNullUndefine(errMsg[key])) {

      setErrMsg(prev => ({ ...prev, [key]: '' }));
    }
  }

  const matchedValue = leaseNRealEstatelist?.find(item => item.value == liablitiesData?.liabilityId);
  const newLabel = (liablitiesData?.liabilityTypeId == "1" ||  ['1','2'].includes(liablitiesData?.liabilityId) || [1, 2].includes(Number(matchedValue?.value))) ? "Mortgage end date" : "Pay off date"

  return (
    <>
      {!isEdit && <div><h6 className="heading-text">Step 1:Liability Information</h6></div>}
      <Row className="mb-3">
        {isContent && isEdit &&
          <Col xs={12} md={12} xl={3}>
            <div className="heading-of-sub-side-links-3">{isContent}</div>
          </Col>
        }
        <Col>
          <Row className='spacingBottom mt-3'>
            <Col xs={12} md={6} xl={isContent ? 5 : 4} className=''>
              <CustomSelect
                tabIndex={startingTabIndex + 1}
                isError=''
                id='liabilityTypeId'
                label="Types of liabilities*"
                placeholder='Select'
                options = {liabilityTypes}
                onChange={(e) => handleInputChange(e.value, 'liabilityTypeId')}
                value={(liablitiesData?.liabilityTypeId == 7) ? { value: "7", label: "Transport Assets" } : (liablitiesData?.liabilityTypeId == 6) ? {value: "6",label: "Real Estate"} : liablitiesData?.liabilityTypeId}
                isDisable={leaseNtransportId.includes(Number(liablitiesData?.liabilityTypeId))}
              />
              {(errMsg.liabilityTypeIdErr) && <><span className="err-msg-show mt-2">{errMsg.liabilityTypeIdErr}</span></>}
            </Col>
            
          </Row>
          {leaseNtransportId.includes(Number(liablitiesData?.liabilityTypeId)) && <>
          
          <Row className='spacingBottom'>
            <Col xs={12} md={6} xl={isContent ? 5 : 4} className='mt-1'>
            
              <CustomSelect
                tabIndex={startingTabIndex + 2}
                id='liabilityTypeId'
                label="Sub-types of liabilities*"
                options = {leaseNRealEstatelist}
                value={matchedValue || ''}
                isDisable={true}
              />
              
            </Col>

          </Row>
          </>}
          {liablitiesData?.liabilityTypeId == "999999" &&
            <Row className='spacingBottom'>
              <Col xs={12} md={6} xl={isContent ? 5 : 4} >
                <Other  tabIndex={startingTabIndex + 3} othersCategoryId={15} userId={primaryUserId} dropValue={liablitiesData?.liabilityTypeId} ref={otherRef} natureId={liablitiesData?.natureId} notCapital={true} />
              </Col>
            </Row>}
          <Row className='spacingBottom'>
            <Col xs={12} md={6} xl={isContent ? 5 : 4}>
              <CustomInput
                tabIndex={startingTabIndex + 4}
                // isError={errMsg.fNameErr}
                label="Name of lender*"
                placeholder="Enter lender name"
                id='nameofInstitutionOrLender'
                value={liablitiesData?.nameofInstitutionOrLender}
                onChange={(val) => handleInputChange(val, 'nameofInstitutionOrLender')} />
              {(errMsg.nameofInstitutionOrLenderErr) && <><span className="err-msg-show mt-1">{errMsg.nameofInstitutionOrLenderErr}</span></>}

            </Col>
          </Row>
          <Row className='spacingBottom'>
            <Col xs={12} md={6} xl={isContent ? 5 : 4}>
              <CustomCalendar tabIndex={startingTabIndex + 5}  label={newLabel} placeholder="mm/dd/yyyy" allowFutureDate={true} isError='' name='insStartDate' id='insStartDate' value={liablitiesData?.payOffDate} onChange={(val) => handleInputChange(val, 'payOffDate')} />
            </Col>
          </Row>
          <Row className='spacingBottom'>
            {/* @@Balance */}
            <Col xs={12} md={6} xl={isContent ? 5 : 4}>
              <CustomCurrencyInput tabIndex={startingTabIndex + 7}  name='Estimated market value' isError='' label='Outstanding balance' value={liablitiesData?.outstandingBalance} id='balance' onChange={(val) => handleInputChange(val, 'outstandingBalance')} />
            </Col>
          </Row>
          <Row className='spacingBottom'>
            {/* @@Balance */}
            <Col xs={12} md={6} xl={isContent ? 5 : 4}>
              <CustomCurrencyInput tabIndex={startingTabIndex + 8}  name='monthly Amount' isError='' label='Monthly amount' value={liablitiesData?.paymentAmount} id='monthlyAmount' onChange={(val) => handleInputChange(val, 'paymentAmount')} />
            </Col>
          </Row>
        </Col>


      </Row>
    </>
  )
});

export default AddLiabilityInfromation