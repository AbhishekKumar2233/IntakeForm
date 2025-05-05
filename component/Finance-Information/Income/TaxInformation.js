import React, { useEffect, useState, useMemo, useContext, useRef, useImperativeHandle, forwardRef, useCallback } from "react";
import { CustomCurrencyInput, CustomCurrencyInput2, CustomInput, CustomNumInput2, CustomSelect,CustomSearchSelect } from "../../Custom/CustomComponent";
import { CustomButton, CustomButton2, CustomButton3, } from "../../Custom/CustomButton";
import Table from "react-bootstrap/Table";
import UploadAssetsFile from "../../Common/File/UploadAssetsFile";
import { focusInputBox, getApiCall, isNotValidNullUndefile, postApiCall, postApiCall2, } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";
import { fetchTaxInformationData, updateAndSaveTaxDataList, updatetaxDataList, } from "../../Redux/Reducers/financeSlice";
import { useAppDispatch, useAppSelector } from "../../Hooks/useRedux";
import { selectorFinance } from "../../Redux/Store/selectors";
import { Row, Col, Accordion } from "react-bootstrap";
import konsole from "../../../components/control/Konsole";
import { useLoader } from "../../utils/utils";
import { globalContext } from "../../../pages/_app";
import { $JsonHelper } from "../../Helper/$JsonHelper";
import { $AHelper } from "../../Helper/$AHelper";
import UploadedFileView from '../../Common/File/UploadedFileView';
import { CustomeSubTitleWithEyeIcon } from "../../Custom/CustomHeaderTile";
import DatePicker from "react-datepicker";
import moment from "moment";
import { CustomInputSearch,CustomRadioSignal } from "../../Custom/CustomComponent";
import { $ApiHelper } from "../../Helper/$ApiHelper";
import { updateTaxInfoQuestion} from "../../Redux/Reducers/subjectDataSlice";


const TaxInformation = forwardRef((props, ref,) => {
  const tableHeader = ["Tax Year", "Taxable Income", "Total Taxes", "Edit/Delete"];
  const { primaryUserId, loggedInUserId,isPrimaryMemberMaritalStatus ,spouseFirstName,primaryMemberFirstName,spouseUserId,_spousePartner,primaryDetails} = usePrimaryUserId();
  const [showAddTax, setshowAddTax] = useState(false);
  const [userTaxId, setuserTaxId] = useState(0);
  const yearOptions = Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => new Date().getFullYear() - i);
  const dispatch = useAppDispatch();
  const { taxDataList } = useAppSelector(selectorFinance);
  const { newConfirm, setWarning } = useContext(globalContext);
  const uploadAssetsFileRef = useRef(null);
  const [fileIds, setFileIds] = useState(null);
  const [taxinfo, settaxinfo] = useState($JsonHelper.taxInformation({}));
  const dropdownData = yearOptions?.map(year => ({ label: year, value: year }));
  const [taxYearDropdownData, setTaxYearDropDownData] = useState(dropdownData)
  const [btn, setbtn] = useState({ showbtn1: false, showbtn2: false, showbtn3: true, });
  const [viewFileInfo, setViewFileInfo] = useState(false)
  const [prevTaxableIncome, setPrevTaxableIncome] = useState();
  const [activeBtn, setActiveBtn] = useState(1);
  const [searchValue, setSearchValue] = useState(null);
  const userId = useMemo(() => {return activeBtn == 1 ? primaryUserId : spouseUserId}, [activeBtn, primaryUserId, spouseUserId]);
  const startingTabIndex = props?.startTabIndex ?? 0;
  const [isJoint, setisJoint] = useState(false)
  const [formLabelData, setFormLabelData] = useState([]);
  const [ques1243, setQues1243] = useState('')


  useImperativeHandle(ref, () => ({
    getTaxList,
    handledata
  }));

  useEffect(() => {
    fetchQuestionsWithFormLabelId()
  }, [])

    //@@ handle change
    const handleChanges = async(e, labelData, label, setState, type) => {
      const { value, id: responseId } = e;
      const userSubjectDataId = labelData?.userSubjectDataId || 0;
      const questionId = labelData?.questionId;
      if (value !== false) {
        setActiveBtnData(1)       
        handleSetState(label, responseId, value, type);
        const json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: value, userId });
        setState(json);
        let userSubject = []
        if ($AHelper.$objectvalidation(json)) userSubject.push(json);
        const filterToUpdate = userSubject?.filter((data) => (data.subResponseData == true || data.subResponseData.length > 0))
        const jsonObj = { userId: primaryUserId, userSubjects: filterToUpdate }
         await postApiCall('PUT', $Service_Url.putSubjectResponse, jsonObj);
        fetchQuestionsWithFormLabelId()

      }

    };
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
      setFormLabelData(formLabelInformation);
    };
    const renderRadioGroup = (label, setState, orderNo) => {
      const data = formLabelData?.[label];
      if (!data) return null;
  
      return (
        <div className={"radio-container w-100 d-block"}>
          <p className="mb-1">{_spousePartner === 'partner' ? data.question?.replace(/spouse/i, 'partner').replace(/spouse/i, 'partner') : data.question}</p>
          <div className="mt-2 d-flex gap-1 ">
            {data?.response?.map((item, index) => (
              <CustomRadioSignal tabIndex={startingTabIndex + orderNo} key={index} label={item.response} name={index} value={item.checked == true} id={item.responseId}
                onChange={(e) => handleChanges({ id: item.responseId, value: e.target.checked }, data, label, setState, 'Radio')}
              />
            ))}
          </div>
        </div>
      );
    };
    ///////////////////////////////////////////////////////////
    const fetchQuestionsWithFormLabelId = async () => {
      useLoader(true);
      const resultOf = await $ApiHelper.$getSujectQuestions([1243]);
      useLoader(false);
      dispatch(updateTaxInfoQuestion(resultOf))
      if (resultOf !== 'err' && resultOf.length > 0) {
          fetchResponseWithQuestionId(resultOf, 1) 
      }
    }



  const fetchResponseWithQuestionId = async (questions, type) => {
    return new Promise(async (resolve, reject) => {
      let memberId = primaryUserId
      let questionId = 452
      useLoader(true)
      const resultOfRes = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicIdV2({ questions: questions, memberId: memberId, questionId: questionId });
      useLoader(false)
      const userSubjectsList = resultOfRes.userSubjects;
      const questionsList = questions
      if (questionsList.length > 0) {
        let formlabelData = {};
        for (let resObj of questions) {
          let label = "label" + resObj.formLabelId;
          formlabelData[label] = { ...resObj.question }; // Shallow copy of the question object
          const filterQuestion = userSubjectsList?.filter((item) => item.questionId == resObj?.question?.questionId);
          if (filterQuestion?.length > 0) {
            const resultOfResponse = filterQuestion[0];

            // Iterate over the response array if it exists
            if (formlabelData[label]?.response) {
              formlabelData[label]["userSubjectDataId"] = resultOfResponse.userSubjectDataId;
              formlabelData[label].response = formlabelData[label].response.map((response, i) => {
                if (response.responseId == resultOfResponse?.responseId) {
                  konsole.log("resultOfResponse?.responseNature", response)
                  if (resultOfResponse?.responseNature == 'Radio') {
                    if (response?.response == 'Yes') {
                      setisJoint(true)
                    } else {
                      setisJoint(false)
                    }
                    return { ...response, 'checked': true };
                  }
                }
                return response;
              });
            }
            formlabelData[label].userSubjectDataId = resultOfResponse.userSubjectDataId;
          } else {
            // Iterate over the response array if it exists
            if (formlabelData[label]?.response) {
              formlabelData[label]["userSubjectDataId"] = 0;
              formlabelData[label].response = formlabelData[label].response.map((response, i) => {
                if (response?.responseNature == 'Radio' && response?.response == 'No') {
                  setisJoint(false)
                  return { ...response, 'checked': true };
                }


                return response;
              });
            }
            formlabelData[label].userSubjectDataId = 0;
          }
        }
        setFormLabelData(formlabelData)
        resolve('resolve')
      } else {
        resolve('resolve')
      }
    })
  }


  const saveTaxClick = (isprev) => {
    useLoader(true);
    props?.showButton(false)
    if (isprev) {
      props?.showButton(true);
    }
    setshowAddTax(!showAddTax);
    setbtn({ showbtn1: true, showbtn2: true, showbtn3: false, });
    settaxinfo($JsonHelper.taxInformation({}));
    setFileIds(null);
    getTaxList(true);
    useLoader(false);
    setuserTaxId(0);


  };

  useEffect(() => {
    if ($AHelper.$isNotNullUndefine(userId)) {
      getTaxList(userId);
    }
  }, [primaryUserId,userId,activeBtn]);



  const toasterAlert = (type, title, description,modal) => {
    if(modal !== "SaveAndAddAnother"){
      setTaxYearDropDownData(dropdownData)
      }    
    setWarning(type, title, description);
  };

  const handleChange = (key, val) => {
    let value = key == 'taxYearFin' ? val.value : val
    settaxinfo((prev) => ({ ...prev, [key]: value, [key + 'Err']: '' }));
  };
  const getmarTaxRate = async () => {
    if (taxinfo.taxableIncome === prevTaxableIncome) {
      return;
    }
    
    useLoader(true);
    let userTypeId = isPrimaryMemberMaritalStatus ? 2 : 1;

    const data = await getApiCall("GET", $Service_Url.getMarginalTaxRate + `?taxableIncome=${taxinfo.taxableIncome}&countryId=${230}&userTypeId=${userTypeId}&TaxYear=01/01/${taxinfo.taxYearFin}`, "");

    if (isNaN(data.marginalTaxRate))
      settaxinfo((prev) => ({ ...prev, marTaxRate: 0 }));
    else settaxinfo((prev) => ({ ...prev, marTaxRate: data.marginalTaxRate }));
    useLoader(false);
  };

  const getEffTaxRate = () => {
    if (taxinfo.adjustedGrossIncome == 0)
      settaxinfo((prev) => ({ ...prev, effTaxRate: 0 }));

    if (taxinfo.adjustedGrossIncome != 0 && taxinfo.totalTaxAmount) {
      settaxinfo((prev) => ({
        ...prev,
        effTaxRate: taxinfo?.adjustedGrossIncome > 0 ? parseFloat(
          (taxinfo.totalTaxAmount / taxinfo.adjustedGrossIncome) * 100
        ).toFixed(2) : 0,
      }));
    }
  };

  const saveAndAddAnother = async () => {
    const isErr = await props?.UpsertUserExpense()
    if (isErr) return;
    props?.showButton(false)
    if (isValidateData() != true) {
      return;
    }
    if (isValidTaxInfoData()) {
      const data = await handledata();
      setbtn({
        showbtn1: true,
        showbtn2: false,
        showbtn3: false,
      });
      const _fileUpload = await uploadAssetsFileRef.current.saveNAddAnother(null);
      taxYearDropDownArray("SaveAndAddAnother",taxinfo)
      settaxinfo($JsonHelper.taxInformation({}));
      dispatch(updateAndSaveTaxDataList(data?.data?.data?.[0]));
      toasterAlert("successfully", "Successfully saved data", "Your data have been saved successfully","SaveAndAddAnother");
      await getTaxList(true)      
      useLoader(false);
      $AHelper.$scroll2Top()
    }
  };

  const uploadFileFunc = async () => {
    return new Promise(async (resolve, reject) => {
      // let userId = userId;
      let fileId = null;
      const _fileUpload =
        await uploadAssetsFileRef.current?.saveUploadUserDocument(userId);

      if (_fileUpload == "file-delete") {
        fileId = null;
      } else if (_fileUpload == "no-file") {
        fileId = fileIds;
      } else {
        fileId = _fileUpload?.fileId;
      }
      resolve(fileId);
      return fileId;
    });
  };

  const handledata = async () => {
    useLoader(true);
    const fileIdToSend = await uploadFileFunc();
    const baseTaxInfo = $JsonHelper.taxInformation({ ...taxinfo });
    const newJson = [
      {
        ...baseTaxInfo,
        taxYear: taxinfo.taxYearFin,
        taxFileId: fileIdToSend,
        userTaxId: userTaxId,
      },
    ];

    const jsonObj = {
      userId: userId,
      upsertedBy: loggedInUserId,
      upsertUserTaxes: newJson,
    };

    const data = await postApiCall("POST", $Service_Url.upsertTaxInfo, jsonObj);
    let forceCall = true;
    await getTaxList(forceCall);
    return data;
  };
  const isValidTaxInfoData = ()=>{
    return [
      taxinfo?.marTaxRate,
      taxinfo?.taxableIncome,
      taxinfo?.adjustedGrossIncome,
      taxinfo?.totalTaxAmount,
      taxinfo?.effTaxRate,
      taxinfo?.taxYearFin
  ].every(isNotValidNullUndefile);
  }

  const saveAndContLaterBtn = async () => {

    if (isValidateData() != true) {
      return;
    }
    const isErr = await props?.UpsertUserExpense()
    if (isErr) return;
    props?.showButton(false);  
    if (isValidTaxInfoData()) {     
      const data = await handledata();      
      dispatch(updateAndSaveTaxDataList(data?.data?.data?.[0]));
      settaxinfo($JsonHelper.taxInformation({}));
      setshowAddTax(false);
      props?.showButton(true)
      useLoader(false);
      toasterAlert("successfully", "Successfully saved data", "Your data have been saved successfully");
      $AHelper.$scroll2Top()
    }
  };

  const deleteTax = async (e) => {
    const confirmRes = await newConfirm(true, `Are you sure you want to delete this This action cannot be undone.`, "Confirmation", "Tax Information", 2);
    if (!confirmRes) return;
    useLoader(true);
    const data = await postApiCall("DELETE", $Service_Url.putTaxInformation + `?userId=${userId}&userTaxId=${e.userTaxId}&deletedBy=${loggedInUserId}`);
    let forceCall = true;
    await getTaxList(forceCall);
    toasterAlert("deletedSuccessfully", "Tax information has been deleted successfully")
    useLoader(false);
  };

  const EditTaxData = async (item) => {
    props?.showButton(false)
    setshowAddTax(!showAddTax);

    let taxableIncome = $AHelper.$forIncomewithDecimal(item?.taxableIncome);
    let adjustedGrossIncome = $AHelper.$forIncomewithDecimal(item?.adjustedGrossIncome);
    let totalTaxAmount = $AHelper.$forIncomewithDecimal(item?.totalTaxAmount);
    setPrevTaxableIncome(taxableIncome)
    settaxinfo(
      $JsonHelper.taxInformation({
        taxableIncome:taxableIncome,
        adjustedGrossIncome:adjustedGrossIncome,
        totalTaxAmount:totalTaxAmount,
        effTaxRate: item?.effTaxRate,
        marTaxRate: item?.marTaxRate,
        taxYearFin: item?.taxYear?.slice(0, 4)
      })
    );
    setbtn({ showbtn1: false, showbtn2: false, showbtn3: true, });
    setuserTaxId(item?.userTaxId);
    setFileIds(item?.taxFileId);
    taxYearDropDownArray("Edit")
    $AHelper.$scroll2Top()
    useLoader(false);
  };

  const getTaxList = useCallback((forceCall) => {
    useLoader(true);
    const taxListExists = taxDataList?.length > 0;
    if (forceCall || !taxListExists) {
      dispatch(fetchTaxInformationData({ userId }));
    }
    
   
    useLoader(false);
  },[taxDataList,userId]);

  const setError = ( inputKey, needFocus ) => {
    settaxinfo((prev) => ({ ...prev, [inputKey + 'Err']: 'This Field is Required' }));
    if(needFocus) focusInputBox(inputKey);
  }

  const isValidateData = () => {
    let isErr = false;
    if (!taxinfo.taxYearFin) {
      setError('taxYearFin', !isErr);
      isErr = true;
    }
    if (!taxinfo.adjustedGrossIncome) {
      setError('adjustedGrossIncome', !isErr);
      isErr = true;
    }
    if (!taxinfo.taxableIncome) {
      setError('taxableIncome', !isErr);
      isErr = true;
    }
    if (!taxinfo.totalTaxAmount) {
      setError('totalTaxAmount', !isErr);
      isErr = true;
    }

    return isErr == false;
  }
  const saveAndNextNew =()=>{
     setSearchValue('')
    if(isPrimaryMemberMaritalStatus && activeBtn == 1 && isJoint == true){
      setActiveBtn(2)
    }else{
      props.next(7)
    }
    $AHelper.$scroll2Top()
  }

  const saveAndNext = async () => {
    if (isValidateData() != true) {
      return;
    }
    const isErr = await props?.UpsertUserExpense()
    toasterAlert("successfully", `Successfully ${btn.showbtn1 ? "saved" : "updated"} data`, `Your data have been ${btn.showbtn1 ? "saved" : "updated"} successfully`);

    if (isErr) return;
    if(isPrimaryMemberMaritalStatus && activeBtn == 1 && isJoint == true){
    const data = await handledata();
     setActiveBtn(2)
     setshowAddTax(false)
    }else{
      props?.handleNextTab('next')
    }
    $AHelper.$scroll2Top();    
  }

  const UpdateBtn = async () => {
    if (isValidateData() != true) {
      return;
    }
    const isErr = await props?.UpsertUserExpense()
    if (isErr) return;

    if (isValidTaxInfoData()) {
      useLoader(true);
      const fileId = await uploadFileFunc();
      const baseTaxInfo = $JsonHelper.taxInformation({ ...taxinfo });
      const newJson = [
        {
          ...baseTaxInfo,
          taxYear: taxinfo.taxYearFin,
          taxFileId: fileId,
          userTaxId: userTaxId,
        },
      ];

      const jsonObj = {
        userId: userId,
        upsertedBy: loggedInUserId,
        upsertUserTaxes: newJson,
      };

      const data = await postApiCall("POST", $Service_Url.upsertTaxInfo, jsonObj);
      dispatch(updatetaxDataList(data?.data?.data?.[0]));
      settaxinfo($JsonHelper.taxInformation({}));
      setshowAddTax(false);
      props?.showButton(true)
      useLoader(false);
      toasterAlert("successfully", "Successfully updated data", "Your data have been updated successfully");
    }
  };

  const TaxInformationDetails = useMemo(() => {
    return {
      Type: "Tax Document",
      heading: `Tax Information Document`,
    };
  });

 

  function taxYearDropDownArray(value,data) {
    if (!value) { return [] }
    if (value == "Edit") {
      // setTaxYearDropDownData([currentyearConst, lastaddedYearCoonst])
    } else if (value == "Add") {
      const filterData = taxYearDropdownData?.filter(
        (ele) => !taxDataList.some((ele1) => ele?.value == getSafeYear(ele1?.taxYear))
      );
      setTaxYearDropDownData(filterData)
    } else if(value == "SaveAndAddAnother"){
      const filteredData = taxYearDropdownData.filter((ele)=> ele?.value !== data?.taxYearFin)
      setTaxYearDropDownData(filteredData)
    }
  }

  const handleViewFileInfo = (val) => {
    setViewFileInfo(val)
}


  let taxyearoptions = (isNotValidNullUndefile(taxinfo?.taxYearFin) && taxinfo?.taxYearFin != 0) ? [...taxYearDropdownData,{label:taxinfo?.taxYearFin,value:taxinfo?.taxYearFin}] : [...taxYearDropdownData] ;
  taxyearoptions = taxyearoptions.filter((value, index, self) => 
    index === self.findIndex(t => t.value === value.value)
  );

    const filteredSearchData = useMemo(() => {
          let searchQuery = searchValue;
          let data = taxDataList;
  
          if ($AHelper.$isNotNullUndefine(searchQuery)) {
              const searchString = searchQuery.toLowerCase();
              return data?.filter(item => {
                  return (
                      (item?.taxYear && item?.taxYear.includes(searchString))
                  );
              });
          } else {
              return data;
          }
      }, [searchValue,taxDataList]);
  
      const setActiveBtnData =(id)=>{
        setActiveBtn(id)
        setSearchValue('')

      }
      const getSafeYear = (dateStr) => {
        // If it's just a year (length is 4 and all digits)
        if (/^\d{4}$/.test(dateStr)) {
          // Add a safe middle-of-the-year date to avoid timezone issues
          dateStr = `${dateStr}-07-01`;
        }
      
        const date = new Date(dateStr);
        return date.getUTCFullYear();
      };

  return (
    <div id="monthlyIncome">
      {viewFileInfo &&  <UploadedFileView key={viewFileInfo.taxFileId} refrencePage='UploadLegalDoc' isOpen={true} fileId={viewFileInfo.taxFileId} handleViewFileInfo={handleViewFileInfo} fileDetails={{ name: 'Tax Information' }} itemList={[{'Tax Year': viewFileInfo.taxYear == "0" ? "" : viewFileInfo?.taxYear?.slice(0, 4)},{'Adjustable Gross Income': $AHelper.$isNullUndefine(viewFileInfo?.adjustedGrossIncome) ? "" : $AHelper.$IncludeDollars(viewFileInfo?.adjustedGrossIncome)},{'Taxable Income': $AHelper.$isNullUndefine(viewFileInfo?.taxableIncome) ? ""  : $AHelper.$IncludeDollars(viewFileInfo.taxableIncome)},
      {'Total Taxes': $AHelper.$isNullUndefine(viewFileInfo?.totalTaxAmount) ? "" : $AHelper.$IncludeDollars(viewFileInfo?.totalTaxAmount)},{'Marginal Tax Rate': $AHelper.$isNullUndefine(viewFileInfo?.marTaxRate) ? "" : viewFileInfo.marTaxRate +'%'},{'Effective Tax Rate': $AHelper.$isNullUndefine(viewFileInfo?.effTaxRate) ? "" :  viewFileInfo.effTaxRate+'%'}]} />}
      <div className="d-flex justify-content-between">
        <div className=''>
         <CustomeSubTitleWithEyeIcon title={'Tax Information'} sideContent={props?.isSideContent} />
         {$AHelper.$isMarried(primaryDetails?.maritalStatusId) && !showAddTax && renderRadioGroup('label1243', setQues1243, 14)}
          </div>   
      {(isPrimaryMemberMaritalStatus && !showAddTax && isJoint) &&
              <div className="d-flex align-items-end justify-content-end" style={{ margin: "-62px 24px 36px" }}>
                <div className="btn-div addBorderToToggleButton ms-auto" >
                  <button className={`view-btn ${activeBtn == 1 ? "active selectedToglleBorder" : ""}`} onClick={() => setActiveBtnData(1)}> {primaryMemberFirstName}</button>
                  <button className={`view-btn ${activeBtn == 2 ? "active selectedToglleBorder" : ""}`} onClick={() => setActiveBtnData(2)}> {spouseFirstName}</button>
                </div>
              </div>
            }
      </div>
    
      {!showAddTax ? (
        <div id="TaxInformation" style={{marginTop: '8px'}}>
          <div className="d-xl-flex">
            <Col className=" rounded" md={12} xl={12}>
              <div id="information-table" className="information-table ">
                <div className="d-flex justify-content-between p-2 m-2  ">
                  <div className="d-flex p-2 align-items-center me-5">
                    <h4>Taxes</h4>
                    <span
                      className="badge ms-3"
                      style={{ height: "22px", paddingLeft: "10px", paddingRight: "10px", color: "#720D21", backgroundColor: "#F1E7E9", borderRadius: "10px", fontWeight: "Bold", textWrap: "noWrap", display: "flex", alignItems: "center", }}
                    >
                      {taxDataList?.length} Added
                    </span>
                  </div>
                  <div style={{ marginBottom: "43px" }} className='w-50 ms-5'>
                    <CustomInputSearch
                      isEroor=''
                      label=''
                      id='search'
                      placeholder='Search'
                    value={searchValue}
                    onChange={(val) => setSearchValue(val)}
                    />
                  </div>
                  {taxYearDropdownData?.length !== (isNotValidNullUndefile(taxDataList) && taxDataList?.length) && (
                    <div className="ms-1 me-3 text-nowrap" style={{ marginLeft: "500px" }}>
                      <CustomButton label={"Add Tax"} onClick={() => { saveTaxClick(); taxYearDropDownArray("Add"); $AHelper.$scroll2Top() }} />
                    </div>
                  )}
                </div>

                <div className="table-responsive fmlyTableScroll" style={{ border: "none" }}>
                  <Table className="custom-table mb-0">
                    <thead className="sticky-header">
                      <tr>
                        {tableHeader.map((item, index) => (
                          <th key={index} className={`${item == 'Edit/Delete' ? 'text-end' : ''}`} >{item == 'Edit/Delete' ? `View/${item}` : item}</th>
                        ))}
                      </tr>
                    </thead>
                    {filteredSearchData?.length > 0 && isNotValidNullUndefile(filteredSearchData) ? (
                      <tbody className="">
                        {filteredSearchData.slice().sort((a, b) => Number(b.taxYear) - Number(a.taxYear))?.map((item, index) => {
                            return (
                            <tr key={index} style={{ height: "10px" }}>
                              <td className="FamilyNameStyle " style={{ width: "30%" }}>
                                <p className="aligningToCenterViaMargins">{getSafeYear(item?.taxYear)}</p>
                              </td>
                              <td style={{ width: "30%" }}>
                                <p className="aligningToCenterViaMargins">
                                  {$AHelper.$isNullUndefine(item.taxableIncome) ? "-":  $AHelper.$IncludeDollars(item.taxableIncome)}

                                </p>
                              </td>
                              <td style={{ width: "30%" }}>
                                <p className="aligningToCenterViaMargins">
                                  {$AHelper.$isNullUndefine(item?.totalTaxAmount) ? "-": $AHelper.$IncludeDollars(item?.totalTaxAmount)}

                                </p>
                              </td>
                              <td style={{ width: "10%" }}>
                                <div className="d-flex justify-content-end gap-4 me-3 ">
                                  <img src="/New/icons/file-eye-view.svg" alt="view Icon" className="icon cursor-pointer" onClick={() => handleViewFileInfo(item)} />
                                  <img src="/New/icons/edit-Icon.svg" alt="Edit Icon" className="icon cursor-pointer" onClick={() => EditTaxData(item)} />
                                  <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer" onClick={() => deleteTax(item)} />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>) :
                      <tbody>
                        <tr>
                          <td colSpan={tableHeader.length}>
                            <div className="text-center no-data-found">No Data Found</div>
                          </td>
                        </tr>
                      </tbody>}
                  </Table>
                </div>
                
              </div>
              <div className="d-flex justify-content-end">
              <CustomButton label= {`Proceed to ${isPrimaryMemberMaritalStatus && activeBtn == 1  && isJoint == true ? `${spouseFirstName} Tax Information` : "Financial Professionals"}`} onClick={()=>saveAndNextNew("goNext")}/>
              </div>
            </Col>
          </div>
        </div>
      ) : (
        <div id="AddTax" className="col-12 AddTax">
          <Row className="progress-container mb-1 previous-btn">
            <div onClick={() => saveTaxClick(true)} style={{ cursor: "pointer" }}>
              {" "}
              <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer me-1" />
              <span className='ms-1' onClick={() => saveTaxClick(true)}> Previous</span>
            </div>
          </Row>
          <div className="mt-2 col-6">
            <div className="mt-3 mb-3">
            <CustomSearchSelect tabIndex={startingTabIndex + 1} isError={taxinfo.taxYearFinErr} label="Tax Year*" placeholder='Select a Tax Year'id="taxYearFin"
                              options={taxyearoptions} onChange={(val) => handleChange('taxYearFin', val)} value={taxinfo.taxYearFin} isDisable={btn?.showbtn3}
                            />
            </div>

            <div className="mt-2">
              <CustomCurrencyInput tabIndex={startingTabIndex + 2} name="balance" isError={taxinfo.adjustedGrossIncomeErr} value={taxinfo.adjustedGrossIncome} label="Adjustable Gross Income*" id="adjustedGrossIncome" onChange={(event) => handleChange("adjustedGrossIncome", event)} onBlur={getEffTaxRate} />
            </div>

            <div className="mt-2">
              <CustomCurrencyInput tabIndex={startingTabIndex + 3} name="balance" value={taxinfo.taxableIncome} isError={taxinfo.taxableIncomeErr} label="Taxable Income*" id="taxableIncome" onBlur={getmarTaxRate} onChange={(event) => handleChange("taxableIncome", event)} />
            </div>

            <div className="mt-2">
              <CustomCurrencyInput tabIndex={startingTabIndex + 4} name="balance" isError={taxinfo.totalTaxAmountErr} value={taxinfo.totalTaxAmount} onBlur={getEffTaxRate} label="Total Taxes*" id="totalTaxAmount" onChange={(event) => handleChange("totalTaxAmount", event)} />
            </div>

            <div className="mt-2">
              <CustomNumInput2 tabIndex={startingTabIndex + 5} label="Marginal Tax Rate" placeholder="% Enter" value={taxinfo.marTaxRate + " %"} isDisable={true} />
            </div>

            <div className="mt-2 mb-4">
              <CustomNumInput2 tabIndex={startingTabIndex + 6} label="Effective Tax Rate (total figures)" value={taxinfo.effTaxRate + " %"} placeholder="% Enter" isDisable={true} />
            </div>
          </div>

          <UploadAssetsFile
            savedDocuments={fileIds ? [{ fileId: fileIds, documentName: "Tax Information" }] : []}
            ref={uploadAssetsFileRef}
            refrencePage={"Tax Information"}
            details={TaxInformationDetails}
            startTabIndex={ startingTabIndex + 7}
          />

          <div className="my-4 d-flex justify-content-between">
            <div>
              {btn.showbtn1 && (
                <div>
                  <CustomButton2 tabIndex={startingTabIndex + 8} label={"Save & Continue Later"} onClick={saveAndContLaterBtn} />
                </div>
              )}
              {btn.showbtn3 && (
                <div>
                  <button tabIndex={startingTabIndex + 9} className="custom-button-3 me-4"  type="button" onMouseDown={(e) => {e.preventDefault(); getmarTaxRate().then(()=>{UpdateBtn()}); $AHelper.$scroll2Top();}}>Update</button>
                </div>
              )}
            </div>
            <div className=" d-flex justify-content-between">
              {taxYearDropdownData?.length > 1 && !btn?.showbtn3 && (
                <div>
                  <CustomButton3 tabIndex={startingTabIndex + 10} label={"Save & Add Another"} onClick={saveAndAddAnother} />
                </div>
              )}
               <div>
                <CustomButton tabIndex={startingTabIndex + 11} label={` Save & Proceed to ${isPrimaryMemberMaritalStatus && activeBtn == 1  && isJoint == true ? `${spouseFirstName} Tax Information` : "Financial Professionals"}`} onClick={saveAndNext} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default TaxInformation;
