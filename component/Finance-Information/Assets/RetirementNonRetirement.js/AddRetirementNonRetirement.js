import React, { useState, useEffect, useCallback, useRef, useMemo, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { isContent } from '../../../Personal-Information/PersonalInformation';
import { useAppDispatch, useAppSelector } from '../../../Hooks/useRedux';
import { selectorFinance } from '../../../Redux/Store/selectors';
import { fetchAssetTypepreConditiontype, fetchBeneficiaryList, fetchOwnerType,fetchAssetTypepreConditiontypeForRetirement,fetchAssetTypepreConditiontypeNonRetirement,updatebenefidficiaryList } from '../../../Redux/Reducers/financeSlice';
import konsole from '../../../../components/control/Konsole';
import { useLoader } from '../../../utils/utils';
import { CustomInput, CustomSelect } from '../../../Custom/CustomComponent';
import { CustomCurrencyInput } from '../../../Custom/CustomComponent';
import usePrimaryUserId from '../../../Hooks/usePrimaryUserId';
import { $JsonHelper } from '../../../Helper/$JsonHelper';
import { CustomButton, CustomButton2, CustomButton3 } from '../../../Custom/CustomButton';
import { $AHelper } from '../../../Helper/$AHelper';
import { focusInputBox, isNotValidNullUndefile, postApiCall } from '../../../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../../../components/network/UrlPath';
import ExpensesQuestion from '../../../Common/ExpensesQuestion';
import Other from '../../../../components/asssets/Other';
import { BeneficiaryDropDown, OwnerDropDown, assetBeneficiarys } from '../../../Common/OwnerDropDown';
import { globalContext } from '../../../../pages/_app';
import UploadAssetsFile from '../../../Common/File/UploadAssetsFile';
import { CustomAccordionBody ,CustomAccordion} from '../../../Custom/CustomAccordion';
import ContactAndAddress from '../../../Custom/Contact/ContactAndAddress';
import BeneficiaryTable from './BeneficiaryTable'

const AddRetirementNonRetirement = (props) => {
  const { handlePreviousBtn, actionType, isRetirement, fetchData, updateRetirementNonRetirementDetails, editInfo,contentData,memberUserID,modalLabel,closeEditModal, setEditCloseModal, UpdateModalState,setUpdateModalState,fetchDataModalData, setEditInfo} = props;                        
  // console.log("AddRetirementNonRetirementTableEditDeleteDeceaseprops",props)
  const { setConfirmation, confirm, setWarning } = useContext(globalContext)

  const dispatch = useAppDispatch();
  const { primaryUserId,spouseUserId, loggedInUserId ,isPrimaryMemberMaritalStatus, _spousePartner, subtenantId} = usePrimaryUserId()


  const financeData = useAppSelector(selectorFinance);
  const { nonRetirementAssetsList, retirementAssetsList, assetTypePreconditionTypeListForRetirement,assetTypePreconditionTypeListForNonRetirement, ownerTypeList, beneficiaryList } = financeData;
  const agingAssetCatId = isRetirement ? 2 : 1;
  const allkeys = ["0", "1", "2", "3"]

  // @@ define Ref
  const agingAssetTypeRef = useRef(null);
  const uploadAssetsFileRef = useRef(null);
  // @@ define state
  const [assetDetails, setAssetDetails] = useState({ ...$JsonHelper.createUserAgingAsset(), 'createdBy': loggedInUserId, 'agingAssetCatId': agingAssetCatId, 'ownerTypeId': 1 });
  const [assetOwnersDetailsJson, setAssetOwnersDetailsJson] = useState('');
  const [assetBeneficiaryDetailsJson, setAssetBeneficiaryDetailsJson] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [filteredBenefList, setFilteredBenefList] = useState(beneficiaryList)
  const [activeKeys, setActiveKeys] = useState(["0"]);
  const [componentKey, setComponentKey] = useState("addRetirement");
  const [deleteBene,setDeletebene] = useState([])
  
  const contactDetailsRef = useRef(null);

  const startingTabIndex = props?.startTabIndex ?? 0;  
  // console.log("hancldeCaccactiveKeys",activeKeys)
  useEffect(()=>{
    if(actionType != 'EDIT'){
    setFilteredBenefList(beneficiaryList)
    }
  },[beneficiaryList,actionType])

  useEffect(() => {
    fetchApi()
  }, [dispatch])

  useEffect(() => {
    if (actionType == 'EDIT' && $AHelper.$isNotNullUndefine(editInfo)) {
      if(modalLabel=="Beneficiary-Modal"){
        setActiveKeys(allkeys); // open all accordions on Beneficiary Edit modal opening 
      }
      editFunction(editInfo)
    } else {
      handleAllClear()
      setAssetOwnersDetailsJson('')
    }
  }, [actionType, editInfo])

  useEffect(()=>{
    // console.log("insideUpdateModalState",UpdateModalState)
      if(UpdateModalState==true && modalLabel=="Beneficiary-Modal"){ //click on outside update button in Beneficiary letter edit modal
        saveData('later')
      }
  },[UpdateModalState])

  const fetchApi = async () => {
    const userDetailOfPrimary = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'));
    useLoader(true);
    await dispatch(fetchBeneficiaryList({ userId: primaryUserId, spouseUserId: isPrimaryMemberMaritalStatus ? spouseUserId : undefined, userDetailOfPrimary: userDetailOfPrimary}));
    apiCallIfNeed(assetTypePreconditionTypeListForRetirement, fetchAssetTypepreConditiontypeForRetirement());
    apiCallIfNeed(assetTypePreconditionTypeListForNonRetirement, fetchAssetTypepreConditiontypeNonRetirement());
    useLoader(false);
  }

  const apiCallIfNeed = useCallback(async (data, action) => {
    if (data.length > 0) return;
    await dispatch(action);
  }, [dispatch]);


  const editFunction = async(editInfo)=>{
    // console.log("editInfoeditFunction",editInfo)
    const userDetailOfPrimary = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'));
      let data =  await dispatch(fetchBeneficiaryList({ userId: primaryUserId, spouseUserId: isPrimaryMemberMaritalStatus ? spouseUserId : undefined, userDetailOfPrimary: userDetailOfPrimary}));
      dispatch(updatebenefidficiaryList(data != 'err' ? data?.payload : []))
      const beneficiaryLists = beneficiaryList.length > 0 ? beneficiaryList : data?.payload
      const filterList = editInfo?.assetOwners?.length == 2 ? beneficiaryLists : beneficiaryLists?.filter(item => !editInfo?.assetOwners?.some(det => det.ownerUserId == item.value));
      konsole.log("beneficiaryLists",editInfo,beneficiaryLists,filterList,"data?.payload",data?.payload)
      updateAssetsDetails()
      konsole.log(filterList,"filterList")
      setFilteredBenefList(filterList?.length == 0 ? null : [...filterList])

  }



  // @@ handle Change----------------
  const handleChange = (key, value) => {
    setStateUserState(key, value)
  }
  // @@ handle Select----------------
  const handleSelect = (key, value) => {
    setStateUserState(key, value?.value)
  }

  // @@ owner Json
  const handleSelectOwner = (val) => {
    const filterActiveOwners = val?.filter(item => item?.isActive == true) 
    const filterBeneficiaryAccorToOwner = filterActiveOwners?.length == 1 ? beneficiaryList?.filter(item => !filterActiveOwners?.some(det => det.ownerUserId?.toUpperCase() == item.value?.toUpperCase())) : beneficiaryList;
    konsole.log("vall",val,editInfo,filterBeneficiaryAccorToOwner,beneficiaryList)

    setAssetOwnersDetailsJson(val)
    setFilteredBenefList(filterBeneficiaryAccorToOwner?.length == 0 ? null : filterBeneficiaryAccorToOwner)
  }
  // @@ Beneficiary Json
  const handleSelectBeneficiary = (val) => {
    setAssetBeneficiaryDetailsJson(val)
  }
  // @@handle state update
  const setStateUserState = (key, value) => {
    setAssetDetails(prev => ({
      ...prev, [key]: value
    }))
    handleSetErr(key, value)
  }

  // @@ handle setError
  const handleSetErr = (key, value) => {
    setErrMsg(prev => ({ ...prev, [key]: '' }));
  }


  // @@ validate
  const validate = () => {
    let isAssetOwnersDetails = true;
    let isAgingAssetTypeId = true;
    let errorInputId = "";
    if (!$AHelper.$isNotNullUndefine(assetOwnersDetailsJson)) {
      let errorOwner = 'Owner cannot be Blank';
      errorInputId = "assetOwnersDetails";
      isAssetOwnersDetails = $AHelper.$isValidateField(assetOwnersDetailsJson, 'assetOwnersDetailsJson', errorOwner, setErrMsg)
      setActiveKeys(["0"]);
    }
    if (assetDetails?.agingAssetTypeId == 0) {
      // Description of asset"
      errorInputId = "agingAssetTypeId";
      let errorAgingAsset = `Description of asset cannot be Blank`
      isAgingAssetTypeId = $AHelper.$isValidateField(assetDetails?.agingAssetTypeId, 'agingAssetTypeId', errorAgingAsset, setErrMsg)
      setActiveKeys(["0"]);
      return;
    }
    if(errorInputId?.length) focusInputBox(errorInputId);

    return isAgingAssetTypeId && isAssetOwnersDetails;

  }

  const updateAssetsDetails = () => {
    // konsole.log("updateAssetsDetails", editInfo);
    const { assetOwners, assetBeneficiarys } = editInfo;
    setAssetDetails(prev => ({
      ...prev, ...editInfo, 'updatedBy': loggedInUserId,
    }))
    // konsole.log("assetOwners", assetOwners, assetBeneficiarys)
    setAssetOwnersDetailsJson(assetOwners)
    setAssetBeneficiaryDetailsJson(assetBeneficiarys)
  }
  // console.log("updateAssetsDetailsassetDetails",assetDetails)

  const saveData =  useCallback(async(type) => {
    if (!validate()) return;

    let assetJson = assetDetails;
    // @@ Owners Json & assetbeneficiary JSON
    assetJson['assetOwners'] = assetOwnersDetailsJson;

    // @@ File upload Document
    {
      useLoader(true)
      const _fileUpload = await uploadAssetsFileRef.current.saveUploadUserDocument(primaryUserId);
      useLoader(false)
      konsole.log("_fileUpload", _fileUpload);
      if (_fileUpload != 'no-file') {
        let fileId = _fileUpload?.fileId;
        let documentName = _fileUpload?.userFileName;
        let documentPath = _fileUpload?.fileURL;
        if (_fileUpload == 'file-delete') {
          fileId = null;
          documentName = assetDetails?.assetDocuments[0]?.documentName;
          documentPath = assetDetails?.assetDocuments[0]?.documentPath;
        }
        let assetDocumentsJson = [{ documentName, documentPath, fileId: fileId }]
        if (assetDetails?.assetDocuments?.length > 0) {
          assetDocumentsJson[0]['userAgingAssetDocId'] = assetDetails?.assetDocuments[0]?.userAgingAssetDocId
        }


        assetJson['assetDocuments'] = assetDocumentsJson;
      }
    } 

    // console.log(assetJson?.assetBeneficiarys,"assetJsonassetBeneficiarys",filteredBenefList)
    if(assetDetails?.assetBeneficiarys?.length > 0){
       // console.log(assetDetails?.assetBeneficiarys,"assetDetailsassetBeneficiarys")
      if(assetJson?.assetBeneficiarys.some((e)=>{return ((e?.isCharity == false && e?.isActive == true && e.beneficiaryUserId == '' && e?.beneficiaryPer != '')||( e?.isCharity == true && e.beneficiaryUserName == ''))})){
        toasterAlert('warning','Warning',`Please enter the beneficiary's information.`)
        return;
      }
      // console.log(assetJson?.assetBeneficiarys,"assetJsonhjassetBkleneficiarys",filteredBenefList)
      assetJson['assetBeneficiarys'] = assetJson?.assetBeneficiarys?.filter((e)=>{return e.beneficiaryUserId != ''});
      let updateCharityname = assetDetails?.assetBeneficiarys?.filter((e)=>{return e.isCharity == true})
      let dataobjArr = updateCharityname.map((ele)=>{return{
        subtenantId: subtenantId || 2,
        userId:ele.beneficiaryUserId,
        fName: ele.beneficiaryUserName,
        mName: "",
        lName: "",
        isPrimaryMember: false,
        memberRelationship: null,
        UpdatedBy: memberUserID,
    }});

    dataobjArr.map(async(item)=>{
      const apiResponse = await postApiCall("PUT",$Service_Url.putUpdateMember,item)
      if(apiResponse){
          konsole.log(apiResponse,"apiResponse")
      }
    })
  }
  // console.log(deleteBene,"deleteBenedeleteBene",assetDetails?.assetBeneficiarys)

  assetJson['assetBeneficiarys'] = [...assetJson?.assetBeneficiarys,...deleteBene]
  assetJson['assetBeneficiarys'] = assetJson?.assetBeneficiarys?.map((e)=>{return e?.isCharity == false ? filteredBenefList?.some((ele)=> ele?.value == e?.beneficiaryUserId) ? e : {...e,isActive:false}: e});


    let jsonObj = {
      userId: primaryUserId,
      asset: assetDetails
    }


    konsole.log("assetDetailsJsonObj", jsonObj, JSON.stringify(jsonObj));

    // return;
    // @@ Save details----------
    let method = (actionType == 'ADD') ? 'POST' : 'PUT'
    let url = method == 'POST' ? $Service_Url.postUseragingAsset : $Service_Url.putUpdateUserAgingAsset;
    useLoader(true);
    const _resultOfSaveDetails = await postApiCall(method, url, jsonObj);
    useLoader(false);
   
    if (_resultOfSaveDetails != 'err') {
      const responseData = _resultOfSaveDetails?.data?.data;
      const isValidAddressData = contactDetailsRef.current?.isValidateAddress()
      const isValidContactData = contactDetailsRef.current?.validateContacts()
      if(isValidAddressData == false){return}
      if(isValidContactData == false){return}
      const isValidaateStateBackaddress = await contactDetailsRef.current.handleSubmit("","","",responseData?.institutionUserId);     
      const isValidaateStateBackContact = await contactDetailsRef.current.submitContact("","",responseData?.institutionUserId);
      if(!(isNotValidNullUndefile(isValidaateStateBackaddress) && isValidaateStateBackaddress?.isActive == true)){return}     
      if(!(isNotValidNullUndefile(isValidaateStateBackContact) && isValidaateStateBackContact?.isActive == true)){return}     

      let retirementValue = isRetirement ? 1 : 2;
      // @@ handle array in parent component
      updateRetirementNonRetirementDetails(actionType, retirementValue, responseData)

      // @@ handle array in parent component

      // @@ handle other flow
      {
        //   {/* @@ Other of Description assets */}
        if (assetDetails.agingAssetTypeId == 999999) {
          let result = await agingAssetTypeRef.current.saveHandleOther(responseData?.userAgingAssetId);
          konsole.log("result", result)
        }
      }
      fetchData()
      if(modalLabel=="Beneficiary-Modal"){
        fetchDataModalData() //refresh new data
        setUpdateModalState(false) 
        setEditCloseModal(false) //close edit modal
      }
    }


    // messages
    {
      toasterAlert("successfully", `Successfully ${actionType == 'ADD' ? 'saved' : 'updated'} data`, `Your data have been ${actionType == 'ADD' ? 'saved' : 'updated'} successfully.`);
    }


    // if (type == 'next') {
    //   handlePreviousBtn
    // }
    $AHelper.$scroll2Top()
    // console.log("234234type",type,"modalLabel",modalLabel)
    // console.log("sdddddddddd",(type == 'later' || type == 'next') && modalLabel!=="Beneficiary-Modal")
    if ((type == 'later' || type == 'next') && modalLabel!=="Beneficiary-Modal") {
      handlePreviousBtn(type);
    }

    // @@ handle another 
    if (type == 'another') {
      handleAllClear();
      setActiveKeys(["0"])
    }
  },[assetDetails,assetOwnersDetailsJson])

  // @@ reset All field
  const handleAllClear = async() => {
    const _fileUpload = await uploadAssetsFileRef.current?.saveNAddAnother();
    setAssetDetails({ ...$JsonHelper.createUserAgingAsset(), 'createdBy': loggedInUserId, 'agingAssetCatId': agingAssetCatId, 'ownerTypeId': 1 });
    setAssetOwnersDetailsJson('');
    setAssetBeneficiaryDetailsJson('');
    setErrMsg('');
    const newKey = new Date().getTime().toString();
    setComponentKey(newKey);
  }


  // @@ return heading
  const returnHeading = useMemo(() => {
    let msg = (isRetirement) ? `${(actionType == 'ADD') ? 'Add' : 'Edit'}  Retirement Asset` : `${(actionType == 'ADD') ? 'Add' : 'Edit'}  Non-Retirement Asset`
    return msg;
  }, [isRetirement, actionType])



  const fileInformationDetails = useMemo(() => {

    return {
      'Type': assetDetails?.assetTypeName,
      'heading': `${isRetirement ? 'Retirement' : 'Non-Retirement'} Assets Document`
    }

  }, [assetDetails, isRetirement])

  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  }

  const handleAccordionClick = () => {
    setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
};

const handleAccordionBodyClick = (key) => {
    setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
};

  // @@ konsole

  konsole.log(filteredBenefList,"filteredBenefList")
  // console.log("retuassetDetails",assetDetails)
  return (
    <>
      {/* @@ Previous Button */}
      {modalLabel!=="Beneficiary-Modal" &&  
         <Row className="progress-container mb-1 previous-btn">
          <div>
            <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer me-1" onClick={() => handlePreviousBtn('')} />
            <span className='ms-1' onClick={() => handlePreviousBtn('')}> Previous</span>
          </div>
         </Row>}
       
      <CustomAccordion 
        isExpendAllbtn={true}  
        header={<Row className='mt-2 mb-1'>
                  <span className='heading-of-sub-side-links'> {returnHeading} </span>
                </Row>}
         handleActiveKeys={handleAccordionClick} activeKeys={activeKeys} allkeys={allkeys} refrencePage={isRetirement ? 'Retirement' : 'Non-Retirement'}
        key={componentKey} activekey={activeKeys} obj={"personalInfoObj"}>
        <CustomAccordionBody setActiveKeys={() => handleAccordionBodyClick('0')} eventkey={'0'} name="Financial and ownership Information">
          <Row className='d-md mt-0 mt-1'>
            <Col xs={12} md={12} xl={3} className='ps-0 mb-3' >
              <div className="heading-of-sub-side-links-3 p-2">{isRetirement == true ? contentData?.retire?.description : contentData?.nonRetire?.description}</div>
            </Col>
            <Col xs={12} md={12} xl={9} className=''>
              <Row className='spacingBottom gapNone'>
                {/* @@Description of asset */}
                {isRetirement == true ?
                  <Col xs={12} md={6} lg={5}>
                    <CustomSelect
                      tabIndex={startingTabIndex + 1}
                      isError={errMsg?.agingAssetTypeId}
                      name='Description of Property*'
                      id='agingAssetTypeId'
                      label='Type of Retirement Asset*'
                      placeholder='Select'
                      options={assetTypePreconditionTypeListForRetirement}
                      value={assetDetails?.agingAssetTypeId}
                      onChange={(e) => handleSelect('agingAssetTypeId', e)}
                    />
                  </Col>
                  :
                  <Col xs={12} md={6} lg={5}>
                    <CustomSelect tabIndex={startingTabIndex + 2} isError={errMsg?.agingAssetTypeId} name='Description of assets*' id='agingAssetTypeId' label='Type of asset*' placeholder='Select' options={assetTypePreconditionTypeListForNonRetirement} value={assetDetails?.agingAssetTypeId} onChange={(e) => handleSelect('agingAssetTypeId', e)} />
                  </Col>
                }
                {/* label={`Next: ${isRetirement == false ? 'Retirement' : 'Real estate'}`} */}

                {/* @@ Other of Description assets */}
                {(assetDetails?.agingAssetTypeId == 999999) &&
                  <Col xs={12} md={6} lg={5}>
                    <Other tabIndex={startingTabIndex + 3} othersCategoryId={3} userId={primaryUserId} dropValue={assetDetails?.agingAssetTypeId} ref={agingAssetTypeRef} natureId={assetDetails?.userAgingAssetId} />
                  </Col>
                }
              </Row>

              <Row className='spacingBottom gapNone'>
              <Col xs={12} md={6} lg={5}>
                  <CustomInput tabIndex={startingTabIndex + 4} isError='' label='Name of Institution' placeholder='Enter name' isDisable={false} id='nameOfInstitution' name='nameOfInstitution' value={assetDetails?.nameOfInstitution} onChange={(val) => handleChange('nameOfInstitution', val)} />
                </Col>
              </Row>
              <Row className='spacingBottom gapNone'>
                {/* @@Balance */}
                <Col xs={12} md={6} lg={5}>
                  <CustomCurrencyInput tabIndex={startingTabIndex + 5} name='balance' isError='' label='Balance' id='balance' value={assetDetails?.balance} onChange={(val) => handleChange('balance', val)} />
                </Col>
              </Row>


              {/* @@ Owner Details && Beneficiary Detials */}
              <Row className='spacingBottom gapNone'>
                <Col xs={12} md={6} lg={5}>
                  <OwnerDropDown
                    startTabIndex={startingTabIndex + 6}
                    id="assetOwnersDetails"
                    assetOwners={assetOwnersDetailsJson}
                    savedAssetOwners={assetDetails?.assetOwners}
                    isInfoAdd={actionType != 'EDIT'}
                    key={actionType != 'EDIT'}
                    handleSelectOwner={handleSelectOwner}
                    isError={errMsg?.assetOwnersDetailsJson}
                    handleSetErr={handleSetErr}
                  />
                </Col>
              </Row>
              {/* <div className="d-none"><BeneficiaryDropDown
                startTabIndex={startingTabIndex + 6}
                assetBeneficiarys={assetBeneficiaryDetailsJson}
                savedAssetBeneficiarys={assetDetails?.assetBeneficiarys}
                isInfoAdd={actionType != 'EDIT'}
                key={actionType != 'EDIT'}
                handleSelectBeneficiary={handleSelectBeneficiary}
                currentUserId={primaryUserId}
                filteredBenefList={filteredBenefList}
              /></div> */}
              <div className="mb-3"><CustomInput tabIndex={startingTabIndex + 7} notCapital={true} label="Last four digits of the account number" placeholder="Please enter the last 4 digits of the account no." value={assetDetails?.accountNo} onChange={(val)=>{handleChange('accountNo',val)}} max={4} /></div>
            </Col>
          </Row>
        </CustomAccordionBody>
        <CustomAccordionBody setActiveKeys={() => handleAccordionBodyClick('1')} eventkey={'1'} name="Address">
          <Row className='d-md mt-0 mt-1'>
            <Col xs={12} md={12} xl={3} className='ps-0 mb-3' >
              <div className="heading-of-sub-side-links-3 p-2">{"Accurate address information is essential for effective communication and service delivery. Keep these details current to ensure you receive important updates and support."}</div>
            </Col>
            <Col xs={12} md={12} xl={9} className=''>
              <ContactAndAddress
                    startTabIndex={startingTabIndex + 8}
                     refrencePage='Non-Retirement'
                    userId={actionType == 'EDIT' ? memberUserID : ""}
                    ref={contactDetailsRef}
                    editJsonData={""}
                    showType="both"
                    showOnlyForm={true}
                    isMandotry={false}
                  />
            </Col>
           
            
          </Row>
        </CustomAccordionBody>
        <CustomAccordionBody setActiveKeys={() => handleAccordionBodyClick('2')} eventkey={'2'} name="Beneficiary">
          <BeneficiaryTable  startTabIndex={8 + 20} assetBeneficiary={assetDetails?.assetBeneficiarys} beneficiaryList={filteredBenefList} setAssetBeneficiaryDetailsJson={setAssetBeneficiaryDetailsJson} setAssetDetails={setAssetDetails} assetDetails={assetDetails} memberUserID={memberUserID} toasterAlert={toasterAlert} useLoader={useLoader} primaryUserId={primaryUserId} spouseUserId={spouseUserId} _spousePartner={_spousePartner} subtenantId={subtenantId} setDeletebene={setDeletebene} assetOwnersDetailsJson={assetOwnersDetailsJson} />
        </CustomAccordionBody>
        <CustomAccordionBody setActiveKeys={() => handleAccordionBodyClick('3')} eventkey={'3'} name="Document Upload">
          <Row className='mb-3'>
            <Col className='mt-2 heading-of-sub-side-links-3' xs={12} md={12} xl={3}>{isRetirement == true ? contentData.retire.documentation : contentData.nonRetire.documentation}</Col>
            <Col xs={12} md={9}>
              <UploadAssetsFile
                startTabIndex={8 + 20 + 62}
                savedDocuments={assetDetails?.assetDocuments?.filter((item) => item.fileId !== null)}
                ref={uploadAssetsFileRef}
                refrencePage={isRetirement ? 'Retirement' : 'Non-Retirement'}
                details={fileInformationDetails}

              />
            </Col>
          </Row>
        </CustomAccordionBody>

      </CustomAccordion>



      <Row style={{ marginTop: '24px' }} className='mb-3'>
        {(actionType == 'ADD') &&
          <div className='d-flex justify-content-between'>
          <CustomButton2  tabIndex={8 + 20 + 62 + 1}  label="Save & Continue later" onClick={() => saveData('later')} />
            <div>
              <CustomButton3 tabIndex={8 + 20 + 62 + 1+ 1} onClick={() => saveData('another')} label='Save & Add Another' />
              <CustomButton
                //  label='Next : Real estate' 
                tabIndex={8 + 20 + 9 + 1 + 1 + 1}  label={`Next: ${isRetirement == false ? 'Retirement' : 'Real estate'}`}
                onClick={() => saveData('next')} />
            </div>
          </div>
        }
        {(actionType == 'EDIT' && modalLabel!="Beneficiary-Modal") &&
          <div className='d-flex justify-content-end'>
            <CustomButton  tabIndex={8 + 20 + 62 + 1 + 1 + 1 + 1}  onClick={() => saveData('later')} label='Update'/>
          </div>}
      </Row>


    </>
  )
}

export default AddRetirementNonRetirement
