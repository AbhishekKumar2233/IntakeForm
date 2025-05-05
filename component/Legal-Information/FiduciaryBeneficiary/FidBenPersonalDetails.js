import React, { useEffect, useCallback, useState, useImperativeHandle, ref, forwardRef, useContext } from 'react';
import { Form, Col, Row, Alert, Button } from 'react-bootstrap';
import { CustomInput, CustomSelect, CustomSearchSelect } from '../../Custom/CustomComponent';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { selectApi } from '../../Redux/Store/selectors';
import { fetchGenderType, fetchCitizenshipType, fetchSuffixType } from '../../Redux/Reducers/apiSlice';
import konsole from '../../../components/control/Konsole';
import { selectPersonal } from '../../Redux/Store/selectors';
import { $AHelper } from '../../Helper/$AHelper';
import { $Msg_PersonalDetails } from '../../Helper/$MsgHelper';
import { headerNav } from '../../Personal-Information/PersonalInformation';
import CustomCalendar from '../../Custom/CustomCalendar';
// import { deceaseMemberStatusId } from '../../components/Reusable/ReusableCom';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { setIsShowSpouseMaritalTile } from '../../Redux/Reducers/personalSlice';
import AddressOneLine from '../../Custom/Contact/AddressOneLine';
import { globalContext } from '../../../pages/_app';
import { $Msg_StateBackground } from '../../Helper/$MsgHelper';
import { focusInputBox } from '../../../components/Reusable/ReusableCom';

const spouseRelationSttus = {
  '1': 'married',
  '2': 'widowed',
  '3': 'living together',
  '4': 'widowed'


}

const newObjErr = () => ({ fNameErr: "", mNameErr: "", lNameErr: "", birthPlaceErr: "", citizenshipIdErr: "", dobErr: "" });

const FidBenPersonalDetails = forwardRef((props, ref) => {
  const { refrencePage, isSideContent, type, dataInfo, isChild, setActiveKeys } = props;
  const { _spousePartner, primaryUserId, spouseUserId } = usePrimaryUserId();
  let dataObj = dataInfo;
  const {setWarning} = useContext(globalContext);
  const dispatch = useAppDispatch();
  const apiData = useAppSelector(selectApi);
  const { genderList, citizenshipList, suffixPrefixList } = apiData;
  const personalReducer = useAppSelector(selectPersonal)
  const { primaryDetails, spouseDetails, isShowSpouseMaritalTile } = personalReducer;
  const startingTabIndex =  props?.startTabIndex ?? 0;

  const [errMsg, setErrMsg] = useState(newObjErr());

  konsole.log("errMsg", errMsg,dataObj)


  useEffect(() => {
    fetchApi();
  }, []);


  // call api form parent component
  useImperativeHandle(ref, () => ({
    validatePersonalDetail
  }));


  // fetchRelationType
  const fetchApi = useCallback(() => {
    apiCallIfNeed(genderList, fetchGenderType());
    apiCallIfNeed(citizenshipList, fetchSuffixType());
    apiCallIfNeed(suffixPrefixList, fetchCitizenshipType());
  }, [genderList, citizenshipList, suffixPrefixList, dispatch]);

  const apiCallIfNeed = useCallback((data, action) => {
    if (data.length > 0) return;
    dispatch(action);
  }, [dispatch]);

  const handleInputChange = useCallback((value, key) => {
    // const valueUpperCase = $AHelper.$isUpperCase(value);
    const valueUpperCase = value;
    konsole.log("valueUpperCase", valueUpperCase)
    setStateFun(key, valueUpperCase);
    hideErrMsg(`${key}Err`, errMsg)
  }, []);


  // select drop down
  const handleSelectChange = useCallback((value, key) => {
 
    // setStateFun(key, valueUpperCase);
    if (key == 'dob' || key == 'dateofDeath') {
      setStateFun(key, value);
    } else {
      setStateFun(key, value?.value);
    }

    if (key == 'dob' && $AHelper.$isNullUndefine(value)) {
      handleStateUpdate("isFiduciary", false)
    }

    if (key == 'genderId') {
      konsole.log("genderIIDIDI",key,value)
      let primarySpouseId = value.value == 1 ? 5 : value.value == 2 ? 6 : 2;
      if (props.isChildSpouse == true) {
        primarySpouseId = value.value == 1 ? 48 : value.value == 2 ? 47 : 2;
      }
      if ((isChild == true || props.isChildSpouse == true) && dataObj?.memberRelationship?.relationshipTypeId != 3) {
        props?.setPersonalDetails((prev) => ({
          ...prev,
          memberRelationship: {
              ...prev.memberRelationship,
              ['relationshipTypeId']: primarySpouseId,
              ['rltnTypeWithSpouseId']: primarySpouseId,
          }
      }))
      }
    }

    hideErrMsg(`${key}Err`, errMsg)

  }, []);

  const handleChangeOnFocusOut = (value, key) =>{
    konsole.log("valueKey",value,key)
    if(key == 'dob'){
      let datedob = $AHelper?.$isNotNullUndefine(value) ? $AHelper.$calculate_age($AHelper.$getFormattedDate(value)) : 0;
      if (datedob < 18 && dataObj?.memberRelationship?.isFiduciary == true) {
        konsole.log("handleOptionClick", key, value,datedob,dataObj)
        toasterAlert("warning", "Warning", $Msg_StateBackground.minorFiduciary);
        setStateFun(key, null)
        return;
    }
    }
  }


  // update personal  details state
  const setStateFun = useCallback((key, value) => {
    props?.setPersonalDetails(prev => ({
      ...prev, [key]: value
    }))
  }, []);

  const handleStateUpdate = (key, value) => {
    props?.setPersonalDetails((prev) => ({
        ...prev,
        memberRelationship: {
            ...prev.memberRelationship,
            [key]: value
        }
    }))
}



  //  error msg set null
  const hideErrMsg = (key, errMsg) => {

    if (!$AHelper.$isNotNullUndefine(errMsg?.key)) {
      setErrMsg(prev => ({ ...prev, [key]: '' }));
    }
  }


  //  validate field
  const validateField = (field, errorMessageKey) => {
    if (!$AHelper.$isNotNullUndefine(field)) {
      setErrMsg(prev => ({ ...prev, [errorMessageKey]: $Msg_PersonalDetails[errorMessageKey] }));
      focusInputBox(errorMessageKey?.slice(0, -3))
      // setActiveKeys(["0"]); 
      return false;
    } else {
      setErrMsg(prev => ({ ...prev, [errorMessageKey]: '' }));
    }
    return true;
  };


  // validate personal details
  const validatePersonalDetail = () => {
    const { fName, mName, lName, citizenshipId, birthPlace, dob,userId, memberRelationship} = dataObj;

    const isValidDob =  ((memberRelationship?.isBeneficiary == true || memberRelationship?.isBeneficiary == false) && userId != primaryUserId) ? true : validateField(dob, 'dobErr');
    const isValidCitizenship = validateField(citizenshipId, 'citizenshipIdErr');
    const isValidLName = validateField(lName, 'lNameErr');
    // const isValidMName = validateField(mName, 'mNameErr');
    const isValidFName = validateField(fName, 'fNameErr');

    // Return overall validation result
    return isValidFName && isValidLName && isValidCitizenship && isValidDob;
  };

  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
}


  //@@ konsole----------------------------------
  konsole.log("ComprimaryDetails", primaryDetails);
  konsole.log("dataObjVal", dataObj);

  konsole.log("isShowSpouseMaritalTile", isShowSpouseMaritalTile)
  konsole.log("primaryDetailsprimaryDetails", primaryDetails)

  return (
    <>
      <Row id='Personal-Details' className='Personal-Details pb-0'>

        {isSideContent &&
          <Col xs={12} xl={3}>
            <div className="heading-of-sub-side-links-3">{isSideContent}</div>
          </Col>
        }

        <Col xs={12} md={12} xl={`${isSideContent ? '9' : '12'}`} >
          {/* {(type == headerNav[1].value && isShowSpouseMaritalTile == true) &&
            <StatusMessageForRelation msg={`You selected  ${spouseRelationSttus[primaryDetails?.maritalStatusId]} as your relationship status.`} />
          } */}

          <Row className="spacingBottom gapNone mt-3">
            <Col xs={12} md={6} lg={5}>
              <CustomInput
                tabIndex={startingTabIndex + 1}
                isError={errMsg.fNameErr}
                label="First name*"
                placeholder="Enter first name"
                id='fName'
                value={$AHelper.$isNotNullUndefine(dataObj?.fName) ? dataObj?.fName : ""}
                onChange={(val) => handleInputChange(val, 'fName')} />

            </Col>
            <Col xs={12} md={6} lg={5}>
              <CustomSearchSelect
                tabIndex={startingTabIndex + 2}
                isError=''
                label="Prefix / Suffix"
                placeholder='Select'
                options={suffixPrefixList}
                onChange={(e) => handleSelectChange(e, 'suffixId')}
                value={dataObj?.suffixId}
              />
            </Col>
          </Row>
          <Row className="spacingBottom">
            <Col xs={12} md={6} lg={5}>
              <CustomInput
                tabIndex={startingTabIndex + 3}
                isError={errMsg.mNameErr}
                label="Middle name"
                placeholder="Enter middle name"
                id='mName'
                value={$AHelper.$isNotNullUndefine(dataObj?.mName) ? dataObj?.mName : ""}
                onChange={(val) => handleInputChange(val, 'mName')}
              />

            </Col>
          </Row>
          <Row className="spacingBottom gapNone">
            <Col xs={12} md={6} lg={5}>
              <CustomInput
                tabIndex={startingTabIndex + 4}
                isError={errMsg.lNameErr}
                label="Last name*"
                placeholder="Enter last name"
                id='lName'
                value={$AHelper.$isNotNullUndefine(dataObj?.lName) ? dataObj?.lName : ""}
                onChange={(val) => handleInputChange(val, 'lName')}
              />
            </Col>
            <Col xs={12} md={6} lg={5}>
              <CustomInput
                tabIndex={startingTabIndex + 5}
                notCapital={true}
                isError=''
                label="Nickname / Also known as(Optional)"
                placeholder="Enter nickname"
                id='nickName'
                value={$AHelper.$isNotNullUndefine(dataObj?.nickName) ? dataObj?.nickName : ""}
                onChange={(val) => handleInputChange(val, 'nickName')}
              />
            </Col>
          </Row>
          <Row className="spacingBottom">
            <Col xs={12} md={6} lg={5}>
              <CustomSelect
                tabIndex={startingTabIndex + 6}
                label="Gender"
                isError=''
                placeholder='Select'
                onChange={(e) => handleSelectChange(e, 'genderId')}
                options={genderList}
                value={dataObj?.genderId}
              />
            </Col>
          </Row>
          <Row className="spacingBottom gapNone">
            <Col xs={12} md={6} lg={5}>
              <CustomCalendar
                tabIndex={startingTabIndex + 7}
                isError={errMsg.dobErr}
                id={"dob"}
                label={`${(dataObj?.userId == primaryUserId) ? 'Date of birth*' : 'Date of birth'}`}
                type={dataObj?.maritalStatusId != null && dataObj?.maritalStatusId != 3 ? "validUser" : "dateOfBirth"}
                value={dataObj?.dob}
                placeholder="mm/dd/yyyy"
                onChange={(e) => handleSelectChange(e, 'dob')}
                handleChangeOnFocusOut = {(e)=>handleChangeOnFocusOut(e, 'dob')}
                callFocusOutFuncFor = "FidBeneficiary"
                setMaxMinDateFor = {`${((dataObj?.userId == primaryUserId || dataObj?.userId == spouseUserId)) ? "PrimaryMember" : ""}`}
                />
            </Col>
            {((type == headerNav[1]?.value && primaryDetails?.maritalStatusId == 4) || !$AHelper.$isCheckNoDeceased(dataObj?.memberStatusId)) &&
              <Col xs={12} md={6}>
                <CustomCalendar
                 key={dataObj + 'dod'}
                 tabIndex={startingTabIndex + 8}
                  label="Date of death"
                  type="dateofDeath"
                  value={dataObj?.dateOfDeath}
                  placeholder="mm/dd/yyyy"
                  onChange={(e) => handleSelectChange(e, 'dateofDeath')}
                  compareDate={dataObj?.dob} />
              </Col>
            }
            {(type == headerNav[1].value && primaryDetails?.maritalStatusId == 5) &&
              <Col xs={12} md={6} lg={5}>
                <CustomCalendar
                  tabIndex={startingTabIndex + 9}
                  label="Date of divorce"
                  type="dateofDivorce"
                  value={dataObj?.dateofDivorce}
                  placeholder="mm/dd/yyyy"
                  onChange={(e) => handleSelectChange(e, 'dateofDivorce')}
                  compareDate={dataObj?.dateOfWedding}
                />
              </Col>
            }
          </Row>
          <Row className="gapNone spacingBottom">
            <Col xs={12} md={6} lg={5}>
              <CustomSearchSelect
                tabIndex={startingTabIndex + 10}
                isError={errMsg?.citizenshipIdErr}
                label="Citizenship*"
                placeholder='Select'
                id="citizenshipId"
                onChange={(e) => handleSelectChange(e, 'citizenshipId')}
                options={citizenshipList}
                value={dataObj?.citizenshipId}
              />
            </Col>
            <Col xs={12} md={6} lg={5}>
 
             <AddressOneLine
                startTabIndex={startingTabIndex + 11}
                isError=''
                label="Place of Birth"
                placeholder="Place of birth"
                onChange={(e) => handleInputChange(e,'birthPlace')}
                value={$AHelper.$isNotNullUndefine(dataObj?.birthPlace) ? dataObj?.birthPlace : ""}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
});


const StatusMessageForRelation = ({ msg }) => {

  const dispatch = useAppDispatch();

  const handleClose = () => {
    // alert('hiii')
    dispatch(setIsShowSpouseMaritalTile(false))
  }
  return <>
    <div className="status-message personal-details">
      <span className='content-status'>{msg}</span>
      <button className="close-btn" aria-label="Close">
        {/* <span aria-hidden="true">&times;</span> */}
        <span aria-hidden="true" onClick={() => handleClose()}>
          <img src='/New/icons/status_cros-circle.svg' />
        </span>

      </button>
    </div>
  </>
}

export default React.memo(FidBenPersonalDetails);
