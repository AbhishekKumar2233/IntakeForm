import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle, memo, useCallback,useContext } from 'react';
import { Row, Table, Col } from 'react-bootstrap';
import { CustomInput, CustomRadioSignal, CustomTextarea } from '../../Custom/CustomComponent';
import konsole from '../../../components/control/Konsole';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { $AHelper } from '../../Helper/$AHelper';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { useLoader } from '../../utils/utils';
import OtherInfo from '../../../components/asssets/OtherInfo';
import CustomCalendar from '../../Custom/CustomCalendar';
import AddressOneLine from '../../Custom/Contact/AddressOneLine';
import UploadedFileView from '../../Common/File/UploadedFileView'
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { $Service_Url } from "../../../components/network/UrlPath";
import { postApiCall, removeDuplicate,isNullUndefine,getApiCall,isNotValidNullUndefile } from '../../../components/Reusable/ReusableCom';
import { globalContext } from '../../../pages/_app';

const newObjQues1020 = () => {
  return { nameOfInsuranceCmp: "", policyNo: "", issueDate: "", address: "", contactNo: "", website: "", userSubjectDataId:null}
}
const newObjQues1022 = () => {
  return { nameOfContact: "", nameOfCmp: "", contactNo: "", cellNo: "", address: "", website: "", faxNo: "" }
}


// const tableHeader = ['Insurance Company', 'Policy No', 'Type of Policy', 'Policy Start', 'Policy Expire', 'Premium Frequency', 'Premium Amount', 'Death Benefits', 'Beneficiary']
const tableHeader = ['Insurance Company', 'Policy No', 'Type of Policy',"View"]

const BurialCremationPlans = forwardRef((props, ref) => {
  const { formlabelData, updateFormLabel, userId, userType, lifeInsurance, activeKeys} = props;
  konsole.log(activeKeys,"activeKeysactiveKeys")
  const dispatch = useAppDispatch();
  const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
  const { primaryUserId, loggedInUserId,spouseUserId,userDetailOfPrimary,loggedInMemberRoleId } = usePrimaryUserId();
  const startingTabIndex = props?.startTabIndex ?? 0;


  const [ques464, setQues464] = useState({});
  const [ques933, setQues933] = useState({});
  const [ques934, setQues934] = useState({});
  const [ques935, setQues935] = useState({});
  const [ques936, setQues936] = useState({});
  const [ques937, setQues937] = useState({});
  const [ques938, setQues938] = useState({});
  const [ques939, setQues939] = useState({});
  const [ques1018, setQues1018] = useState({});
  const [ques1019, setQues1019] = useState({});
  const [ques1020, setQues1020] = useState({ ...newObjQues1020() });
  const [isUpdateques1020, setIsUpdateQues1020] = useState(false);

  const [ques1021, setQues1021] = useState({});
  const [ques1022, setQues1022] = useState({ ...newObjQues1022() });
  const [isUpdateQues1022, setIsUpdateQues1022] = useState({});
  const [ques1027, setQues1027] = useState({});
  const [ques1029, setQues1029] = useState({});
  const[viewEditModal,setViewEditModal]=useState(false)
  const[itemAdditiDetails, setItemAdditiDetails] = useState({});
  const[selectedTableData,setSelectedTableData]=useState([])
  const[lifeInsuranceData,setLifeInsuranceData]=useState([])
  

  const formLabelData = useMemo(() => formlabelData, [formlabelData]);


  useEffect(() => {
    if (formLabelData) {
      formLabel1020Information()
      formLabel1022Information()
    }
  }, [formLabelData])


  const getOthersInfo=async (userLifeInsuranceId,value)=>{
    try{
        let jsonobj = [{userId, othersMapNatureId:userLifeInsuranceId, isActive: true,othersMapNature: ""}];
        let getOtherRes = await postApiCall("POST", $Service_Url.getOtherFromAPI, jsonobj);
        getOtherRes= await getOtherRes?.data?.data;
        getOtherRes=await getOtherRes?.filter((data)=>data?.othersCategoryId==12)
        getOtherRes=(getOtherRes?.length==0)?"Other":getOtherRes?.[0].othersName
        useLoader(false)
        return getOtherRes || "Other"
    }
    catch(err){
      konsole.error("errgetOthersInfo",err)
      return ""
    }
  }

  const updateLifeInsuraceData=async()=>{
    if (lifeInsurance?.length>0) {
      useLoader(true)
      const setAllFalseVariable=await Promise.all(lifeInsurance?.map(async(data)=>{   
         if(data?.insuranceCompany=="Other"){
            return({...data,checked:false,insuranceCompany: await getOthersInfo(data?.userLifeInsuranceId,data)})
          }
          return({...data,checked:false,})
      }))
      setLifeInsuranceData(setAllFalseVariable)
      useLoader(false)
    }
  }

  useEffect(() => {
    updateLifeInsuraceData()
  }, [lifeInsurance])

  useImperativeHandle(ref, () => ({
    burialJson, burialValidate
  }))

  function decodeKeyValuePairs(encodedString) {
    const objVal = {};
    encodedString.split('&&').forEach(pair => {
      const [key, value] = pair.split('=');
      objVal[key] = decodeURIComponent(value);
    });
    return objVal;
  }

  function removeUSFormatting(phoneNumber) {
    return phoneNumber.replace(/\D/g, '');
  }

  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  }

  const formLabel1020Information = useCallback(() => {
    konsole.log("formLabelData?.label102", formLabelData?.label1020)
    const responseData = formLabelData?.label1020?.response[0];
    if ($AHelper.$isNotNullUndefine(responseData) && $AHelper.$isNotNullUndefine(responseData?.response)) {

      konsole.log("responseData", responseData)
      let keyValuePairs = decodeKeyValuePairs(responseData?.response);
      konsole.log("keyValuePairs", keyValuePairs)
      if (!$AHelper.$isNotNullUndefine(keyValuePairs)) return;
      konsole.log('contactInfo', keyValuePairs)
      if (keyValuePairs?.contactNo?.length > 0) {
        keyValuePairs.contactNo = removeUSFormatting(keyValuePairs?.contactNo)?.slice(0, 10)
      }
      konsole.log("contactInfoVal", keyValuePairs)
      setQues1020(keyValuePairs);
    }

  }, [formLabelData?.label1020])


  const formLabel1022Information = useCallback(() => {
    const responseData = formLabelData?.label1022?.response[0];
    if ($AHelper.$isNotNullUndefine(responseData) && $AHelper.$isNotNullUndefine(responseData?.response)) {
      let keyValuePairs = decodeKeyValuePairs(responseData?.response);
      konsole.log("keyValuePairs", keyValuePairs)
      if (keyValuePairs?.contactNo?.length > 0) {
        keyValuePairs.contactNo = removeUSFormatting(keyValuePairs?.contactNo)?.slice(0, 10)
      }
      if (keyValuePairs?.cellNo?.length > 0) {
        keyValuePairs.cellNo = removeUSFormatting(keyValuePairs?.cellNo)?.slice(0, 10)
      }
      setQues1022(keyValuePairs);
    }
  }, [formLabelData?.label1022])


  const burialValidate = () => {
    return new Promise((resolve) => {
      const validations = [
        { condition: ques935?.subResponseData && isValidContactCell(ques935?.subResponseData), flag: "ques935Contact" },
        { condition: ques936?.subResponseData && isValidContactCell(ques936?.subResponseData), flag: "ques936CellNo" },
        { condition: ques939?.subResponseData && isValidContactCell(ques939?.subResponseData), flag: "ques939FaxNo" },
        { condition: $AHelper.$isNotNullUndefine(ques1020?.website) && !$AHelper.$isUrlValid(ques1020?.website), flag: "ques1020Web" },
        { condition: ques1020?.contactNo && isValidContactCell(ques1020?.contactNo), flag: "ques1020Contact" },
        { condition: $AHelper.$isNotNullUndefine(ques1022?.website) && !$AHelper.$isUrlValid(ques1022?.website), flag: "ques1022Web" },
        { condition: ques1022?.contactNo && isValidContactCell(ques1022?.contactNo), flag: "ques1022Contact" },
        { condition: ques1022?.cellNo && isValidContactCell(ques1022?.cellNo), flag: "ques1022CellNo" },
        { condition: ques1022?.faxNo && isValidContactCell(ques1022?.faxNo), flag: "ques1022FaxNo" },
      ];

      const isValid = validations?.every(({ condition }) => !condition);
      resolve(isValid);
    });
  };

  const burialJson = () => {
    return new Promise((resolve, reject) => {
      let userSubject = []
      if ($AHelper.$objectvalidation(ques464)) userSubject.push(ques464);
      if ($AHelper.$objectvalidation(ques933)) userSubject.push(ques933);
      if ($AHelper.$objectvalidation(ques934)) userSubject.push(ques934);
      if ($AHelper.$objectvalidation(ques935)) userSubject.push(ques935);
      if ($AHelper.$objectvalidation(ques936)) userSubject.push(ques936);
      if ($AHelper.$objectvalidation(ques937)) userSubject.push(ques937);
      if ($AHelper.$objectvalidation(ques938)) userSubject.push(ques938);
      if ($AHelper.$objectvalidation(ques939)) userSubject.push(ques939);
      if ($AHelper.$objectvalidation(ques1018)) userSubject.push(ques1018);
      if ($AHelper.$objectvalidation(ques1019)) userSubject.push(ques1019);
      if ($AHelper.$objectvalidation(ques1021)) userSubject.push(ques1021);
      if ($AHelper.$objectvalidation(ques1027)) userSubject.push(ques1027);
      if ($AHelper.$objectvalidation(ques1029)) userSubject.push(ques1029);

      // console.log("isUpdateques1020",isUpdateques1020)
      if (isUpdateques1020 == true) {
        const value = $AHelper.$convertObjectToQueryString(ques1020);
        // console.log("990value",value)
        let responseId = formLabelData.label1020.response[0].responseId
        const userSubjectDataId = (formLabelData.label1020?.userSubjectDataId) ? formLabelData.label1020?.userSubjectDataId : 0;
        const questionId = formLabelData.label1020?.questionId;
        let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: `${value}&&userSubjectDataId=${userSubjectDataId}`, userId: userId })
        // console.log("q34324json",json)
        userSubject.push(json)
      }

      if (isUpdateQues1022 == true) {
        const value = $AHelper.$convertObjectToQueryString(ques1022);
        let responseId = formLabelData.label1022.response[0].responseId
        const userSubjectDataId = (formLabelData.label1022?.userSubjectDataId) ? formLabelData.label1022?.userSubjectDataId : 0;
        const questionId = formLabelData.label1022?.questionId;
        let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: value, userId: userId })
        userSubject.push(json)
      }
      resolve(userSubject)
    })
  }




  //@@ update formlabeldata
  const handleSetState = async (label, responseId, value, type) => {
    const formLabelInformation = { ...formLabelData };
    const selectedLabelValue = { ...formLabelData[label] };
    selectedLabelValue.response = selectedLabelValue.response.map(response => {
      if (response.responseId === responseId) {
        return type !== 'Radio' ? { ...response, response: value } : { ...response, checked: value };
      }
      if (type === 'Radio') {
        return { ...response, checked: false };
      }
      return response;
    });
    formLabelInformation[label] = selectedLabelValue;
    konsole.log("formLabelInformation", label, responseId, selectedLabelValue, formLabelInformation);
    dispatch(updateFormLabel(formLabelInformation));
  };

  //@@ handle change
  const handleChange = (e, labelData, label, setState, type) => {
    konsole.log('handleCurrencyInput', e);
    const { value, id: responseId } = e;
    const userSubjectDataId = labelData?.userSubjectDataId || 0;
    const questionId = labelData?.questionId;
    handleSetState(label, responseId, value, type);
    const json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: value, userId });
    konsole.log("jsonjson", json);
    setState(json);
  };

  //@@ render Radio
  const renderRadioGroup = (label, setState, orderNo) => {
    const data = formLabelData?.[label];
    if (!data) return null;

    return (
      <div className={"radio-container w-100 d-block"}>
        <p className='mb-1' >{data.question}</p>
        <div className="mt-2 d-flex flex-wrap gap-1 "> 
          {data.response.map((item, index) => (
            <CustomRadioSignal tabIndex={startingTabIndex + orderNo} key={index} label={item.response} name={index} value={item.checked == true} id={item.responseId}
              onChange={(e) => handleChange({ id: item.responseId, value: e.target.checked }, data, label, setState, 'Radio')}
            />
          ))}
        </div>
      </div>
    );
  };



  const isValidContactCell = (value) => {
    return (value?.length > 0 && ($AHelper.$formatPhoneNumber2(value)?.length <= 10 || $AHelper.$formatPhoneNumber2(value)?.length == null)) ? true : ''
  }
  const renderInputGroup = (type, label, setState , orderNo) => {
    const data = formLabelData?.[label];
    if (!data) return null;

    const handleEventChange = (id, val) => {
      let value = val;
      if (type == 'nameOfContact') {
        value = val?.replace(/[^a-zA-Z ]/gi, "");
      } else if (type == 'contactNo' || type == 'cellNo' || type == 'faxNo') {
        value = val?.replace(/[^0-9]/gi, "");
      }
      handleChange({ id: id, value: value }, data, label, setState, 'Input')
    }

    return (
      <>
        {data.response.map((item, index) => {
          konsole.log("nameOfCmp", data.question, label, data, item);
          let isError = ''
          if (type == 'Website') {
            isError = ($AHelper.$isNotNullUndefine(item?.response) && !$AHelper.$isUrlValid(item?.response)) ? 'Url is not valid' : ''
          } else if (type == 'faxNo') {
            isError = ($AHelper.$isNotNullUndefine(item?.response)) ? (item?.response?.length > 0 && $AHelper.$formatPhoneNumber2(item?.response)?.length <= 10 || $AHelper.$formatPhoneNumber2(item?.response)?.length == null) ? 'Fax Number is not valid' : '' : ''
          }
          let valValue = item?.response;
          if (type == 'contactNo' || type == 'cellNo' || type == 'faxNo') {
            let myinp = item?.response?.length > 10 ? item?.response?.slice(0, 10) : item?.response;
            valValue = $AHelper.$formatPhoneNumber2(myinp)
            const isErr = isValidContactCell(valValue);
            if (isErr) {
              isError = type == 'contactNo' ? "Contact Number is not valid" : type == 'cellNo' ? "Cell Number is not valid" : type == 'faxNo' ? "Cell Number is not valid" : ''
            }

          }

          return (
            <Row className='box'>
              <Col xs={12} md={6} lg={10}>
             {/* <CustomTextarea/> */}
              {(type != 'Address' && type !== "Description") ? <CustomInput tabIndex={startingTabIndex + orderNo}  isError={isError} label={data.question} placeholder={data.question} id={item?.responseId} isSmall={type == 'Website'} value={valValue}
                max={(type == 'contactNo' || type == 'cellNo' || type == 'faxNo') ? 14 : ''}
                onChange={(val) => handleEventChange(item?.responseId, val)}
              />
                : (type == "Description") ? <CustomTextarea tabIndex={startingTabIndex + orderNo}  isError={isError} label={data.question} placeholder={data.question} id={item?.responseId} isSmall={type == 'Description'} value={valValue}
                onChange={(val) => handleEventChange(item?.responseId, val)}/>  :
                
                <>
                  <AddressOneLine
                    startTabIndex={startingTabIndex + orderNo - 1}
                    isError=''
                    label={data.question}
                    placeholder={data.question}
                    onChange={(e) => handleEventChange(item?.responseId, e)}
                    value={valValue}
                    // activeKeys={activeKeys}
                  />
                </>}
                </Col>
            </Row>
          )
        })}
      </>
    )
  }

  const handle1020StateUpdate = (id, value) => {
    // console.log("23q323ues1020",ques1020,"id23233",id, value)
    setIsUpdateQues1020(true)
    const eValue = $AHelper.$isNotNullUndefine(value) ? value : ""
    konsole.log('handleStateUpdate', eValue, id);
    setQues1020(prev => ({ ...prev, [id]: eValue }))
  }

  const handle1022StateUpdate = (id, value) => {
    setIsUpdateQues1022(true)
    const eValue = $AHelper.$isNotNullUndefine(value) ? value : ""
    konsole.log('handleStateUpdate', eValue, id);
    setQues1022(prev => ({ ...prev, [id]: eValue }))
  }

  const isQuestionVisible = (label, condition) => {
    return useMemo(() => {
      const responses = formLabelData?.[label]?.response || [];
      return responses.find(item => item.response == condition)?.checked == true;
    }, [formLabelData?.[label]]);
  };


  const isQues464Yes = isQuestionVisible('label464', 'Yes');
  const isQues464No = isQuestionVisible('label464', 'No');
  const isQues1018Yes = isQuestionVisible('label1018', 'Yes');
  const isQues1019Yes = isQuestionVisible('label1019', 'Yes');
  const isQues1019No = isQuestionVisible('label1019', 'No');
  const isQues1021Yes = isQuestionVisible('label1021', 'Yes');
  const isQues1021No = isQuestionVisible('label1021', 'No');
  const isQues1027Yes = isQuestionVisible('label1027', 'Yes');

  // @@ konsole
  konsole.log("lifeInsurance", lifeInsurance)
  // konsole.log("lifeInsuranceData", lifeInsuranceData)
  konsole.log('formlabelData', formlabelData)

  const fetchDataForPdf = async ( selectedItem ) => {
    const otherOj=[{isActive: true, othersMapNatureId: String(selectedItem?.userAgingAssetId ?? selectedItem?.userLifeInsuranceId), othersMapNature: '', userId: primaryUserId}]
    const getOtherRes = (selectedItem?.insuranceCompany == "Other" ||  selectedItem?.assetTypeName == "Other" )? await postApiCall("POST", $Service_Url.getOtherFromAPI, otherOj) : {};
    setItemAdditiDetails({otherDescription: getOtherRes?.data?.data?.[0]?.othersName});
   }

   const itemList = useMemo(()=>{
      let item=selectedTableData
      let itemAddress=selectedTableData?.institutionAddress
      return (
      [{'Insurance company': itemAdditiDetails?.otherDescription || item?.insuranceCompany},
      {'Policy No': item?.additionalDetails != '' ? item?.additionalDetails: "N/A"},
      {'Type of Policy': itemAdditiDetails?.otherDescription || item?.policyType || "N/A"},
      {'Policy Start': $AHelper.$isNullUndefine(item?.policyStartDate) ? "N/A" : $AHelper.$getFormattedDate(item?.policyStartDate)},
      {'Policy Expire': $AHelper.$isNullUndefine(item?.policyExpiryDate) ? "N/A" : $AHelper.$getFormattedDate(item?.policyExpiryDate)},
      {'Premium Frequency':item?.premiumType || "N/A"},
      {'Premium Amount':$AHelper.$isNullUndefine(item?.premium) ? "N/A" :  $AHelper.$IncludeDollars(item?.premium)},
      {'Death Benefits': isNullUndefine(item?.deathBenefits) ? "N/A" :  $AHelper.$IncludeDollars(item?.deathBenefits)},
      {'Beneficiary': item?.beneficiary?.[0]?.beneficiaryName || "N/A"},
      ])
   },[viewEditModal])

   const handleViewFileInfo=async(value,tableData)=>{
    if(value==""){
      setViewEditModal(false);
      setSelectedTableData([])
      return;
    }
    setSelectedTableData(tableData)
    setViewEditModal(true)
    fetchDataForPdf()
   }

   const onChangeAllcheckboxesFun=async(event,item)=>{
    const checkedData=event?.target?.checked
    let mapCheckboxData=lifeInsuranceData?.map((data)=>{ // check one policy at a time
    if((data?.userLifeInsuranceId==item?.userLifeInsuranceId)){
          return{...data,checked:checkedData}
      }
    return{...data,checked:false}
    })

  if(!checkedData){ // if user uncheks the cheked policy
    const confirmRes = await newConfirm(true, `Are you sure you want to uncheck.`, "Confirmation", "Remove plan", 2);
    konsole.log("21confirmRes", confirmRes);
    if (!confirmRes) return;
    toasterAlert("deletedSuccessfully", `Insurance plan has been removed successfully.`);
  }

  setLifeInsuranceData(mapCheckboxData)
  // console.log("312321ques1020",ques1020)
  const filter_Checked_insuranceTable_data=mapCheckboxData?.filter(data=>data?.checked==true)
  // console.log("filter_Checked_insuranceTable_data",filter_Checked_insuranceTable_data[0])
  if(checkedData){
      var { policyStartDate,insuranceCompany,additionalDetails}=filter_Checked_insuranceTable_data[0]
  }
  const updatedJson={
    nameOfInsuranceCmp:(checkedData)?insuranceCompany:"",
    policyNo: (checkedData)?additionalDetails:"",
    issueDate: (checkedData)?policyStartDate:"",
    address:"",
    contactNo:"",
    website: "",
  } // on chekcking policy to repopulate the fields below
  setIsUpdateQues1020(true)
  setQues1020(prev => ({ ...prev,...updatedJson}))
}

  return (
    <>
      <div id='burialCremationPlans' className='burialCremationPlans'>
        <Row className='mb-3'>
          {renderRadioGroup('label464', setQues464, 1)}
          {(isQues464No == true) && <>
            <div className="status-message-livingwill">
              <span>
                We strongly suggest you take the initiative and get this detail addressed. It will go a long way to ensure that your needs are less of a burden to loved ones, and you will likely also save your estate assets in the meanwhile.<br /><br />
                <span>SUGGESTION:</span><br /><br />
                <ul>
                  <li>
                    If you are looking to acquire a cemetery plot, we suggest that you go to &nbsp;
                    <a href="https://www.craigslist.com" style={{ textDecoration: 'underline' }}>www.craigslist.com</a> and look for one there. Often private parties who have elected not to use a plot will want to sell it at a deep discount. It might take you a year or two to find the plot in the cemetery of your choice, but it is doable.
                  </li>
                  <li>
                    If you have not paid for a casket, know that you can usually leave instructions for your loved ones to buy a casket at <a href="https://www.costco.com" style={{ textDecoration: 'underline' }}>Caskets | Costco</a> or at <a href="https://www.walmart.com" style={{ textDecoration: 'underline' }}>Caskets - Walmart.com</a>. You may want to let the funeral home of this decision and see if they may want to match the price.
                  </li>
                </ul>
              </span>
            </div>
          </>}
          {(isQues464Yes == true) && <>
            <div  className='spacingBottom gapNone'>
            {renderInputGroup('nameOfContact', 'label933', setQues933, 2)}
            </div>
            <div  className='spacingBottom gapNone'>
            {renderInputGroup('nameOfFun', 'label934', setQues934, 3)}
            </div>
            <div  className='spacingBottom gapNone'>
            {renderInputGroup('contactNo', 'label935', setQues935, 4)}
            </div>
            <div  className='spacingBottom gapNone'>
            {renderInputGroup('cellNo', 'label936', setQues936, 5)}
            </div>
            <div  className='spacingBottom gapNone'>
            {renderInputGroup('Address', 'label937', setQues937, 6)}
            </div>
            <div  className='spacingBottom gapNone'>
            {renderInputGroup('Website', 'label938', setQues938, 7)}
            </div>
            <div  className='spacingBottom gapNone'>
            {renderInputGroup('faxNo', 'label939', setQues939, 8)}
            </div>
            <div  className='spacingBottom gapNone'>
            {renderInputGroup('Description', 'label1029', setQues1029, 9)}
            </div>
          </>}
          {renderRadioGroup('label1018', setQues1018, 10)}
          {(isQues1018Yes == true) && <>
            {renderRadioGroup('label1019', setQues1019, 11)}
            {(isQues1019Yes == true) && <>
              {renderRadioGroup('label1027', setQues1027, 12)}
                {(isQues1027Yes == true && lifeInsuranceData.length > 0) && <>
                <p className="burialCreamtionTableHeading">Please select a plan below:</p>
                <div className='table-responsive fmlyTableScroll-life-burial m-2'>
                  <Table className="custom-table">
                    <thead className="sticky-header">
                      <tr>
                        {tableHeader.map((item, index) => (
                          <th key={index} className='customHeadingForTable'><p>{item}</p></th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className='table-body-tr'>
                      {lifeInsuranceData.length > 0 && lifeInsuranceData.map((item, index) => {
                        const { insuranceCompany, additionalDetails, policyType, policyStartDate, policyExpiryDate, premiumType, premium, deathBenefits, beneficiary, userLifeInsuranceId } = item;
                        return (
                          <tr key={index}>
                            <td>
                            <div className="d-flex align-items-center">
                              <input type="checkbox" className="searchChekbox addPadding " 
                                checked={item?.checked} 
                                onChange={(e) => onChangeAllcheckboxesFun(e,item)}
                              />
                              <p className="p-2 pt-0 pb-0">{item?.insuranceCompany}
                                {/* <OtherInfo othersCategoryId={12} othersMapNatureId={userLifeInsuranceId} FieldName={insuranceCompany} userId={userId} /> */}
                              </p>
                              </div>
                            </td>
                            <td>{additionalDetails || '-'}</td>
                            <td><OtherInfo othersCategoryId={23} othersMapNatureId={userLifeInsuranceId} FieldName={policyType} userId={userId} /></td>
                            {/* <td>{$AHelper.$isNotNullUndefine(policyStartDate) ? $AHelper.$getFormattedDate(policyStartDate) : '-'}</td> */}
                            {/* <td>{$AHelper.$isNotNullUndefine(policyExpiryDate) ? $AHelper.$getFormattedDate(policyExpiryDate) : '-'}</td> */}
                            {/* <td>{$AHelper.$isNotNullUndefine(premiumType) ? premiumType : '-'}</td> */}
                            {/* <td>{$AHelper.$isNotNullUndefine(premium) ?  $AHelper.$IncludeDollars(premium) : '-'}</td> */}
                            {/* <td>{$AHelper.$isNotNullUndefine(deathBenefits) ?  $AHelper.$IncludeDollars(deathBenefits) : '-'}</td> */}
                            <td><img src="/New/icons/file-eye-view.svg" 
                                    alt="Edit Icon" 
                                    className="iconHeightIncrease cursor-pointer border-0 m-3 mt-0 mb-0" 
                                    onClick={() => handleViewFileInfo("View",item)}
                            /></td>
                            {/* <td>{beneficiary[0]?.beneficiaryName ?? '-'}</td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </>}
              <Question1020Values orderNo={13} startTabIndex={startingTabIndex} handle1020StateUpdate={handle1020StateUpdate} ques1020={ques1020} lifeInsuranceData={lifeInsuranceData}/>
            </>}
            {viewEditModal && 
              <UploadedFileView 
                  refrencePageName='Retirement'
                  isOpen={true} 
                  handleViewFileInfo={handleViewFileInfo}
                  itemList={itemList}
                  fileId={selectedTableData?.insuranceDocs[0]?.docFileId}
                  fileDetails={{ name:"Insurance Policies" }} 
              />                  
            }
            {(isQues1019No == true) && <>
              {renderRadioGroup('label1021', setQues1021, 14)}
              {(isQues1021Yes == true) && <>
                <Question1022Values orderNo={15} startTabIndex={startingTabIndex} handle1022StateUpdate={handle1022StateUpdate} ques1022={ques1022} />
              </>}
              {(isQues1021No == true) && <>
                <div className="status-message-livingwill">You may want to ask them to give you a copy of the trust or fund in which the purchase price has been placed. Federal Law requires them to provide you this information.</div>
              </>}
            </>}
          </>
          }
        </Row>
      </div>
    </>
  )
})


const Question1020Values = ({ handle1020StateUpdate, ques1020, startTabIndex, orderNo ,lifeInsuranceData}) => {
  const startingTabIndex = startTabIndex ?? 0;
  const isValidContactCell = (value) => {
    return (value?.length > 0 && ($AHelper.$formatPhoneNumber2(value)?.length <= 10 || $AHelper.$formatPhoneNumber2(value)?.length == null)) ? true : ''
  }
  return (
    <>
    <div className='spacingBottom gapNone col-xs-12 col-md-6 col-lg-10'>
      <CustomInput  tabIndex={startingTabIndex + orderNo}  isError={''} label='Insurance Company' placeholder="Insurance Company" id='nameOfInsuranceCmp'
        onChange={(val) => handle1020StateUpdate('nameOfInsuranceCmp', val)}
        value={ques1020?.nameOfInsuranceCmp}
      />
      </div>
      <div className='spacingBottom gapNone col-xs-12 col-md-6 col-lg-10'>
      <CustomInput tabIndex={startingTabIndex + orderNo} isError={''} label='Policy Number' placeholder="Policy No." id='policyNo'
        value={ques1020?.policyNo}
        onChange={(val) => handle1020StateUpdate('policyNo', val)}
      />
      </div>
      <div className='spacingBottom gapNone col-xs-12 col-md-6 col-lg-10'>
      <CustomCalendar tabIndex={startingTabIndex + orderNo} label={'Issue  Date'} isError='' name='issueDate' id='issueDate'
        value={ques1020?.issueDate}
        placeholder="mm/dd/yyyy"
        onChange={(val) => handle1020StateUpdate('issueDate', val)} />
        </div>
        <div className='spacingBottom gapNone col-xs-12 col-md-6 col-lg-10'>
      <CustomInput tabIndex={startingTabIndex + orderNo} label='Contact Number' placeholder="Contact Number" id='contactNo'
        isError={(isValidContactCell(ques1020?.contactNo) ? 'Contact Number is not valid' : '')} max={14}
        value={$AHelper.$formatPhoneNumber2(ques1020?.contactNo)}
        onChange={(val) => {
          const result = val.replace(/[^0-9]/gi, "");
          handle1020StateUpdate('contactNo', result);
        }}
      />
      </div>
      {/* <CustomInput isError={''} label='Address' placeholder="Address" id='address' notCapital={true} value={ques1020?.address}
        onChange={(val) => handle1020StateUpdate('address', val)}
      /> */}
      <div className='spacingBottom gapNone col-xs-12 col-md-6 col-lg-10'>
      <AddressOneLine
        startTabIndex={startingTabIndex + orderNo - 1}
        isError=''
        label="Address"
        placeholder="Address"
        onChange={(e) => handle1020StateUpdate("address", e)}
        value={ques1020?.address}
      />
      </div>
      <div className='spacingBottom gapNone col-xs-12 col-md-6 col-lg-10'>
      <CustomInput
        tabIndex={startingTabIndex + orderNo}
        isError={($AHelper.$isNotNullUndefine(ques1020?.website) && !$AHelper.$isUrlValid(ques1020?.website)) ? 'Url is not valid' : ''}
        label={'Website'} isSmall={true} placeholder="https://example.com" id='website' value={ques1020?.website}
        onChange={(val) => handle1020StateUpdate('website', val)}
      />
      </div>
    </>
  );
};

const Question1022Values = ({ handle1022StateUpdate, ques1022, startTabIndex, orderNo }) => {
  const startingTabIndex = startTabIndex ?? 0;

  // let currentTabIndex = startingTabIndex;
  //   const getNextTabIndex = () => {
  //       return currentTabIndex++;
  //   };

  const isValidContactCell = (value) => {
    return (value?.length > 0 && ($AHelper.$formatPhoneNumber2(value)?.length <= 10 || $AHelper.$formatPhoneNumber2(value)?.length == null)) ? true : ''
  }

  return (
    <>
    <div className='spacingBottom gapNone'>
      <CustomInput tabIndex={startingTabIndex + orderNo} isError={''} label='Name of Contact' placeholder="Name of Contact" id='nameOfContact' value={ques1022?.nameOfContact}
        onChange={(val) => handle1022StateUpdate('nameOfContact', val?.replace(/[^a-zA-Z ]/gi, ""))}
      />
      </div>
      <div className='spacingBottom gapNone'>
      <CustomInput tabIndex={startingTabIndex + orderNo} isError={''} label='Name of Company' placeholder="Name of Company" id='nameOfCmp' value={ques1022?.nameOfCmp}
        onChange={(val) => handle1022StateUpdate('nameOfCmp', val)}
      />
      </div>
      <div className='spacingBottom gapNone'>
      <CustomInput
        tabIndex={startingTabIndex + orderNo}
        isError={(isValidContactCell(ques1022?.contactNo) ? 'Contact Number is not valid' : '')} max={14}
        label='Contact Number' placeholder="Contact Number" id='contactNo' value={$AHelper.$formatPhoneNumber2(ques1022?.contactNo)}
        onChange={(val) => {
          const result = val.replace(/[^0-9]/gi, "");
          handle1022StateUpdate('contactNo', result);
        }}
      />
      </div>
      <div className='spacingBottom gapNone'>
      <CustomInput
        tabIndex={startingTabIndex + orderNo}
        isError={(isValidContactCell(ques1022?.cellNo) ? 'Cell Number is not valid' : '')} max={14}
        label='Cell Number' placeholder="Cell Number" id='cellNo' value={$AHelper.$formatPhoneNumber2(ques1022?.cellNo)}
        onChange={(val) => {
          const result = val.replace(/[^0-9]/gi, "");
          handle1022StateUpdate('cellNo', result);
        }}
      />
      </div>
      {/* <CustomInput isError={''} label='Address' placeholder="Address" id='address' notCapital={true} value={ques1022?.address}
        onChange={(val) => handle1022StateUpdate('address', val)}
      /> */}
      <div className='spacingBottom gapNone'>
      <AddressOneLine
        startTabIndex={startingTabIndex + orderNo - 1}
        isError=''
        label="Address"
        placeholder="Address"
        onChange={(e) => handle1022StateUpdate("address", e)}
        value={ques1022?.address}
        // activeKeys={activeKeys}
      />
      </div>
      <div className='spacingBottom gapNone'>
      <CustomInput
        tabIndex={startingTabIndex + orderNo}
        isError={($AHelper.$isNotNullUndefine(ques1022?.website) && !$AHelper.$isUrlValid(ques1022?.website)) ? 'Url is not valid' : ''}
        label={'Website'} placeholder="https://example.com" id='website' isSmall={true} value={ques1022?.website} onChange={(val) => handle1022StateUpdate('website', val)}
      />
      </div>
    </>
  )
}


export default BurialCremationPlans;
