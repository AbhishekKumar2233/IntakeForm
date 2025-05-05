import React, { useEffect, useCallback,useMemo, useState, useImperativeHandle, ref, forwardRef, useContext } from 'react';
import { Form, Col, Row, Alert, Button } from 'react-bootstrap';
import { CustomInput, CustomSearchSelect, CustomSelect } from '../Custom/CustomComponent';
import { useAppSelector, useAppDispatch } from '../Hooks/useRedux';
import { selectApi } from '../Redux/Store/selectors';
import { fetchGenderType, fetchCitizenshipType, fetchSuffixType } from '../Redux/Reducers/apiSlice';
import konsole from '../../components/control/Konsole';
import { selectPersonal } from '../Redux/Store/selectors';
import { $AHelper } from '../Helper/$AHelper';
import { $Msg_PersonalDetails } from '../Helper/$MsgHelper';
import { headerNav } from './PersonalInformation';
import CustomCalendar from '../Custom/CustomCalendar';
import { deceaseMemberStatusId, focusInputBox } from '../../components/Reusable/ReusableCom';
import { setIsShowSpouseMaritalTile } from '../Redux/Reducers/personalSlice';
import { paralegalAttoryId } from '../../components/control/Constant';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import AddressOneLine from '../Custom/Contact/AddressOneLine';
import { globalContext } from '../../pages/_app';
import { $Msg_Calender } from '../Helper/$MsgHelper';



const newObjErr = () => ({ fNameErr: "", mNameErr: "", lNameErr: "", birthPlaceErr: "", citizenshipIdErr: "", dobErr: "" });

const PersonalDetails = forwardRef((props, ref) => {
  const { refrencePage, isSideContent, type, dataInfo, isChild } = props;
  let dataObj = dataInfo;
  const dispatch = useAppDispatch();
  const apiData = useAppSelector(selectApi);
  const { genderList, citizenshipList, suffixPrefixList } = apiData;
  const personalReducer = useAppSelector(selectPersonal)
  const { primaryDetails, spouseDetails, isShowSpouseMaritalTile, loginMemberRoles } = personalReducer;
  const { loggedInMemberRoleId, isPrimaryMemberMaritalStatus,spouseUserId } = usePrimaryUserId();
  const {setWarning} = useContext(globalContext);
  const startingTabIndex = props?.startTabIndex ?? 0;

  const [errMsg, setErrMsg] = useState(newObjErr());

  konsole.log("errMsg", errMsg);
  konsole.log("loggedInMemberRoleId", loggedInMemberRoleId)



  useEffect(() => {
    if(type !=headerNav[1].value){
      fetchApi();
    }
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
  const handleSelectChange = (value, key) => {
    konsole.log("handleOptionClick", key, value)
    // setStateFun(key, valueUpperCase);
    if (key == 'dob' || key == 'dateOfDeath' || key == 'dateofDivorce') {
      konsole.log("dateOfDeathdob", key, value)
      setStateFun(key, value);
    } else {
      setStateFun(key, value?.value);
    }

    konsole.log("isChildisChildisChildDefine", isChild)
    if (key == 'genderId') {
      let primarySpouseId = value.value == 1 ? 5 : value.value == 2 ? 6 : 2;
      if (props.isChildSpouse == true) {
        primarySpouseId = value.value == 1 ? 48 : value.value == 2 ? 47 : 2;
      }
      if ((isChild == true || props.isChildSpouse == true) && dataObj?.memberRelationship?.relationshipTypeId != 3) {
        handleStateUpdate(primarySpouseId, primarySpouseId)
      }
    }
    hideErrMsg(`${key}Err`, errMsg)

  };

  const handleChangeOnFocusOut = (value, key) =>{
    konsole.log("valueKey",value,key, dataObj)
    if(key == 'dob' && isChild == true){
      let datedob = $AHelper?.$isNotNullUndefine(value) ? $AHelper.$calculate_age($AHelper.$getFormattedDate(value)) : 0;
      // if (datedob < 16 && dataObj?.maritalStatusId == 1) {
      if (datedob < 14 && dataObj?.maritalStatusId == 1) {
        konsole.log("handleOptionClick", key, value,datedob,dataObj)
        toasterAlert("warning", "Warning", $Msg_Calender.validAge);
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

  const handleStateUpdate = (primaryRelatonId, spouseRelation) => {
    props?.setPersonalDetails((prev) => ({
      ...prev,
      memberRelationship: {
        ...prev.memberRelationship,
        ['relationshipTypeId']: primaryRelatonId,
        ['rltnTypeWithSpouseId']: spouseRelation,
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
  const validateField = (field, inputKey, dontFocus) => {
    // const checkAgeLimit = (isChild == true && dataObj?.maritalStatusId == 1 && ($AHelper.$calculate_age($AHelper.$getFormattedDate(field)) < 16 || !$AHelper?.$isNotNullUndefine(field))) ? true : false
    const checkAgeLimit = (isChild == true && dataObj?.maritalStatusId == 1 && ($AHelper.$calculate_age($AHelper.$getFormattedDate(field)) < 14 || !$AHelper?.$isNotNullUndefine(field))) ? true : false
    if (!$AHelper.$isNotNullUndefine(field) || checkAgeLimit == true) {
      setErrMsg(prev => ({ ...prev, [inputKey + "Err"]: $Msg_PersonalDetails[inputKey + "Err"] })); 

      if(checkAgeLimit == true){
        setStateFun(inputKey, null)
        toasterAlert("warning", "Warning", $Msg_Calender.validAge);
      }
      if(dontFocus != true) focusInputBox(inputKey)
      return false;
    } else {
      setErrMsg(prev => ({ ...prev, [inputKey + "Err"]: '' }));
    }
    return true;
  };


  konsole.log("dobdobdobdob", props.isChildSpouse)
  // validate personal details
  const validatePersonalDetail = () => {
    const { fName, mName, lName, citizenshipId, birthPlace, dob } = dataObj;

    // konsole.log("dobdobdobdob", dob)

    let dontFocus = false;
    const isValidFName = validateField(fName, 'fName', dontFocus);
    dontFocus = dontFocus || !isValidFName;
    // const isValidMName = validateField(mName, 'mNameErr');
    const isValidLName = validateField(lName, 'lName', dontFocus);
    dontFocus = dontFocus || !isValidLName;
    const isValidCitizenship = validateField(citizenshipId, 'citizenshipId', dontFocus);
    dontFocus = dontFocus || !isValidCitizenship;
    // const isValidDob = (isChild == true && dataObj?.maritalStatusId == 1 && ($AHelper.$calculate_age($AHelper.$getFormattedDate(dob)) < 16 || !$AHelper?.$isNotNullUndefine(dob))) || (type == "Personal")  ? validateField(dob, 'dob', dontFocus) : true;
    const isValidDob = (isChild == true && dataObj?.maritalStatusId == 1 && ($AHelper.$calculate_age($AHelper.$getFormattedDate(dob)) < 14 || !$AHelper?.$isNotNullUndefine(dob))) || (type == "Personal")  ? validateField(dob, 'dob', dontFocus) : true;
    // const isValidDob = (type == "Personal") ? validateField(dob, 'dob', dontFocus) : true;
    // Return overall validation result
    return isValidFName && isValidLName && (isValidCitizenship || (props?.isWidow && props?.type == "Spouse")) && isValidDob;
  };

// For display side by side view
  const isPersonalScreen = refrencePage == 'PersonalInformation';
  const isactivationScreen = refrencePage == 'activationForm'
  const displaySpouseContent = useMemo(() => {
    let value = (($AHelper.$isNotNullUndefine(spouseUserId) && (dataInfo?.maritalStatusId != 3 && dataInfo?.maritalStatusId != 5))) ? true : false;
    return value;
}, [spouseUserId,dataInfo])

const toasterAlert = (type, title, description) => {
  setWarning(type, title, description);
}

  //@@ konsole----------------------------------
  konsole.log("ComprimaryDetails", primaryDetails);
  konsole.log("dataObjVal", dataObj);

  konsole.log("isShowSpouseMaritalTile", isShowSpouseMaritalTile)
  konsole.log("primaryDetailsprimaryDetails", primaryDetails)
  konsole.log("fetch-maritalStatusId", dataObj?.maritalStatusId)

  return (
    <>
      <Row id='Personal-Details' className='Personal-Details'>

        {(isSideContent && !isPersonalScreen) &&
          <Col xs={12} xl={3}>
            <div className="heading-of-sub-side-links-3">{isSideContent}</div>
          </Col>
        }

        <Col xs={12} md={12} xl={`${(isSideContent && !isPersonalScreen) ? '9' : '12'}`} >
          {/* {(type == headerNav[1].value && isShowSpouseMaritalTile == true) &&
            <StatusMessageForRelation msg={`You selected  ${spouseRelationStatus[primaryDetails.maritalStatusId]} as your relationship status.`} />
          } */}

          {/* @@ SPOUSE CLIENT PERSONAL SCREEN */}
          {(isPersonalScreen && displaySpouseContent ) && <Row className='spacingBottom'>
            <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
              <CustomSearchSelect tabIndex={startingTabIndex + 1} isError='' label="Prefix / Suffix" placeholder='Select' options={suffixPrefixList} onChange={(e) => handleSelectChange(e, 'suffixId')} value={dataObj?.suffixId} />
            </ColumnRender>
          </Row>}
          {/* @@ SPOUSE CLIENT PERSONAL SCREEN */}
           
            {!isactivationScreen && !(isPersonalScreen && displaySpouseContent) && (
             <Row className={`d-flex align-items-center gapNone headingActivation ${(dataObj?.maritalStatusId == 1 || dataObj?.maritalStatusId == 2 || dataObj?.maritalStatusId == null) || (isChild || dataObj?.maritalStatusId !== 2)  ? 'spacingBottom' : ''}`}>        
              <ColumnRender isPersonalScreen={isPersonalScreen}>
                <CustomSearchSelect tabIndex={startingTabIndex + 2} isError='' label="Prefix / Suffix" placeholder='Select' options={suffixPrefixList} onChange={(e) => handleSelectChange(e, 'suffixId')} value={dataObj?.suffixId} />
              </ColumnRender>
              </Row>
            )}

          <Row className="d-flex align-items-center spacingBottom gapNone headingActivation" >
            <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
              <CustomInput tabIndex={startingTabIndex + 3} isError={errMsg.fNameErr} label="First name*" placeholder="Enter first name" id='fName' value={$AHelper.$isNotNullUndefine(dataObj?.fName) ? dataObj?.fName : ""} onChange={(val) => handleInputChange(val, 'fName')} />
            </ColumnRender>
          </Row>
            {/* @@ This content hide for personal information page spouse and primary if client is married and living */}
            {/* {!isactivationScreen && !(isPersonalScreen && displaySpouseContent) && (
              <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
                <CustomSearchSelect tabIndex={startingTabIndex + 3} isError='' label="Prefix / Suaaffix" placeholder='Select' options={suffixPrefixList} onChange={(e) => handleSelectChange(e, 'suffixId')} value={dataObj?.suffixId} />
              </ColumnRender>)} */}
            {/* @@ This content hide for personal information page spouse and primary if client is married and living */}




          {/*  */}
          <Row className="d-flex align-items-center spacingBottom gapNone headingActivation">
            <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
              <CustomInput tabIndex={startingTabIndex + 4} isError={errMsg.mNameErr} label="Middle name" placeholder="Enter middle name" id='mName' value={$AHelper.$isNotNullUndefine(dataObj?.mName) ? dataObj?.mName : ""} onChange={(val) => handleInputChange(val, 'mName')} />
            </ColumnRender>
          </Row>

          <Row className="d-flex align-items-center spacingBottom gapNone headingActivation">
            <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
              <CustomInput tabIndex={startingTabIndex + 5} isError={errMsg.lNameErr} label="Last name*" placeholder="Enter last name" id='lName' value={$AHelper.$isNotNullUndefine(dataObj?.lName) ? dataObj?.lName : ""} onChange={(val) => handleInputChange(val, 'lName')} />
            </ColumnRender>

            {/* @@ This content hide for personal information page spouse and primary if client is married and living */}
            {!isactivationScreen && !(isPersonalScreen && displaySpouseContent) && (
              <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
                <CustomInput tabIndex={ startingTabIndex + 6} notCapital={true} isError='' label="Nickname / Also known as(Optional)" placeholder="Enter nickname" id='nickName' value={$AHelper.$isNotNullUndefine(dataObj?.nickName) ? dataObj?.nickName : ""} onChange={(val) => handleInputChange(val, 'nickName')} />
              </ColumnRender>)}
            {/* @@ This content hide for personal information page spouse and primary if client is married and living */}

          </Row>

          {/* @@SHOW SPOUSE CLIENT PERSONAL SCREEN */}
          {(isPersonalScreen && displaySpouseContent ) && <Row className='spacingBottom'>
            <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
              <CustomInput tabIndex={startingTabIndex +  7} notCapital={true}  isError='' label="Nickname / Also known as(Optional)" placeholder="Enter nickname" id='nickName' value={dataObj?.nickName} onChange={(val) => handleInputChange(val, 'nickName')} />
            </ColumnRender>
          </Row>}
          {/* @@ SPOUSE CLIENT PERSONAL SCREEN */}

          <Row className="d-flex align-items-center spacingBottom gapNone headingActivation" >
            <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
              <CustomSelect tabIndex={startingTabIndex + 8} label="Gender" isError='' placeholder='Select' onChange={(e) => handleSelectChange(e, 'genderId')} options={genderList} value={dataObj?.genderId} />
            </ColumnRender>
          </Row>
          <Row className={`d-flex align-items-center spacingBottom ${props?.isWidowed ? '' : 'gapNone'} headingActivation`}>
            <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
              <CustomCalendar id={'dob'} tabIndex={ startingTabIndex +  9} isError={(type == "Personal") ? errMsg.dobErr : ''} label={`${(type == "Personal") ? 'Date of birth*' : 'Date of birth'}`} type={((dataObj?.maritalStatusId != null || dataObj?.maritalStatusId != 3) && (type == "Personal" || type == "Spouse") || refrencePage == "activationForm") ? "validUser" : "dateOfBirth"} value={dataObj?.dob} min="100"
                // max="16" placeholder="mm/dd/yyyy" setMaxMinDateFor={`${(refrencePage == "PersonalInformation" || refrencePage == "activationForm") ? "PrimaryMember" : ""}`} onChange={(e) => handleSelectChange(e, 'dob')} handleChangeOnFocusOut = {(e)=>handleChangeOnFocusOut(e, 'dob')} callFocusOutFuncFor = "forChild" dod={dataObj?.dateOfDeath} />
                max="14" placeholder="mm/dd/yyyy" setMaxMinDateFor={`${(refrencePage == "PersonalInformation" || refrencePage == "activationForm") ? "PrimaryMember" : ""}`} onChange={(e) => handleSelectChange(e, 'dob')} handleChangeOnFocusOut = {(e)=>handleChangeOnFocusOut(e, 'dob')} callFocusOutFuncFor = "forChild" dod={dataObj?.dateOfDeath} />
            </ColumnRender>

            {konsole.log(props,"shdfshzxhcjzdfhasfyewqweuq")}
            {((type == headerNav[1].value && primaryDetails?.maritalStatusId == 4) || !$AHelper.$isCheckNoDeceased(dataObj.memberStatusId)) && (!(isPersonalScreen )) || (isactivationScreen && props.isWidowed) &&
              <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
                <CustomCalendar customClassName={"dateOfDeath"} tabIndex={startingTabIndex +  10} label="Date of death" type="dateofDeath" value={dataObj?.dateOfDeath} placeholder="mm/dd/yyyy" onChange={(e) => handleSelectChange(e, 'dateOfDeath')} compareDate={dataObj?.dob} />
              </ColumnRender>
            }
            {(type == headerNav[0].value && primaryDetails?.maritalStatusId == 5) && (isPersonalScreen) &&
              <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
                <CustomCalendar tabIndex={ startingTabIndex + 11} label="Date of divorce" type="dateofDivorce" value={dataObj?.dateofDivorce} placeholder="mm/dd/yyyy" onChange={(e) => handleSelectChange(e, 'dateofDivorce')} compareDate={dataObj?.dateOfWedding} />
              </ColumnRender>
            }
            {/* @@ This content hide for personal information page spouse and primary if client is married and living */}

          </Row>
          {/* @@ DISPLAY FOR NOT EQAL PERSONAL INFO */}
          {(isPersonalScreen) && (((type == headerNav[1].value && primaryDetails?.maritalStatusId == 4) || !$AHelper.$isCheckNoDeceased(dataObj.memberStatusId)) || (type == headerNav[0].value && primaryDetails?.maritalStatusId == 5)) && 
            <Row className="d-flex align-items-center spacingBottom gapNone">
              {((type == headerNav[1].value && primaryDetails?.maritalStatusId == 4) || !$AHelper.$isCheckNoDeceased(dataObj.memberStatusId)) &&
                <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
                  <CustomCalendar tabIndex={startingTabIndex +  12} label="Date of death" type="dateofDeath" value={dataObj?.dateOfDeath} placeholder="mm/dd/yyyy" onChange={(e) => handleSelectChange(e, 'dateOfDeath')} compareDate={dataObj?.dob} personalDetails={props?.personalDetails} />
                </ColumnRender>
              }

              {/* {(type == headerNav[0].value && primaryDetails.maritalStatusId == 5) &&
                <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
                  <CustomCalendar tabIndex={9} label="Date of divorce" type="dateofDivorce" value={dataObj?.dateofDivorce} placeholder="mm/dd/yyyy" onChange={(e) => handleSelectChange(e, 'dateofDivorce')} compareDate={dataObj?.dateOfWedding} />
                </ColumnRender>
              } */}
            </Row>
          }

          {/* @@ DISPLAY FOR NOT EQAL PERSONAL INFO */}
          <Row className='d-flex align-items-center gapNone headingActivation spacingBottom'>
            {!(props?.isWidow && props?.type == "Spouse") && (
              <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
                <CustomSearchSelect tabIndex={startingTabIndex + 13} id={'citizenshipId'} isError={errMsg?.citizenshipIdErr} label="Citizenship*" placeholder='Select' onChange={(e) => handleSelectChange(e, 'citizenshipId')} options={citizenshipList} value={dataObj?.citizenshipId} />
              </ColumnRender>
            )}
            {/* @@ This content hide for personal information page spouse and primary if client is married and living */}
            {!isactivationScreen && !(isPersonalScreen && displaySpouseContent) && (
              ($AHelper.$isCheckNoDeceased(dataObj.memberStatusId)) &&
              <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
                <AddressOneLine startTabIndex={startingTabIndex +  14} isError='' label="Place of Birth" placeholder="Place of birth" onChange={(e) => handleInputChange(e, 'birthPlace')} value={$AHelper.$isNotNullUndefine(dataObj?.birthPlace) ? dataObj?.birthPlace : ""} />
              </ColumnRender>
            )}
            {/* @@ This content hide for personal information page spouse and primary if client is married and living */}

          </Row>

          {/* @@ DISPLAT PLACEOF BIRTH  */}
          {(isPersonalScreen && displaySpouseContent) &&
              ($AHelper.$isCheckNoDeceased(dataObj.memberStatusId)) &&
          <Row className={`d-flex align-items-center spacingBottom gapNone headingActivation ${type == 'Personal' ? 'spacingTop ' : ''}`} >
              <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
                <AddressOneLine startTabIndex={startingTabIndex +  15} isError='' label="Place of Birth" placeholder="Place of birth" onChange={(e) => handleInputChange(e, 'birthPlace')} value={dataObj?.birthPlace} />
              </ColumnRender>
          </Row>
            }
          {/* @@ DISPLAT PLACEOF BIRTH  */}

          {(type == "Personal" && paralegalAttoryId.includes(loggedInMemberRoleId)) &&
            <Row className="d-flex align-items-center spacingBottom gapNone" >
              <ColumnRender isPersonalScreen={isPersonalScreen} displaySpouseContent = {displaySpouseContent}>
                <CustomInput tabIndex={ startingTabIndex + 16} isError={''} label="Matter No." placeholder="Enter matter number" id='matNo' value={dataObj?.matNo} onChange={(val) => handleInputChange(val, 'matNo')} />
              </ColumnRender>
            </Row>
          }
        </Col>
      </Row>
    </>
  );
});


export const StatusMessageForRelation = ({ msg }) => {

  const dispatch = useAppDispatch();

  const handleClose = () => {
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



export const ColumnRender = ({ children, isPersonalScreen,displaySpouseContent }) => {
  // const { loggedInMemberRoleId, isPrimaryMemberMaritalStatus ,spouseUserId,primaryDetails} = usePrimaryUserId();
//   const displaySpouseContent = useMemo(() => {
//     let value = (($AHelper.$isNotNullUndefine(spouseUserId) && (dataInfo?.maritalStatusId != 3 && dataInfo?.maritalStatusId != 5))) ? true : false;
//     return value;
// }, [spouseUserId, dataInfo])


  if (isPersonalScreen && displaySpouseContent) {
    return <Col xs={12} md={6} lg={9} className='pe-5'>{children}</Col>
  }
  return <Col xs={12} md={6} lg={5}>{children} </Col>
}



export default React.memo(PersonalDetails);
