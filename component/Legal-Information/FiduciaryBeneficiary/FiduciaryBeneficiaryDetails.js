import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Row, Col, Table, Form } from 'react-bootstrap';
import AddFiduciaryBeneficiary from './AddFiduciaryBeneficiary';
import { CustomInputSearch } from '../../Custom/CustomComponent';
import { CustomButton } from '../../Custom/CustomButton';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { $AHelper } from '../../Helper/$AHelper';
import EditFiduciaryBeneficiary from './EditFiduciaryBeneficiary';
import legalSlice, { updateFamilyMemberList } from '../../Redux/Reducers/legalSlice';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { selectorLegal,selectPersonal } from '../../Redux/Store/selectors';
import konsole from '../../../components/control/Konsole';
import { useLoader } from '../../utils/utils';
import { getApiCall, postApiCall } from '../../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../../components/network/UrlPath';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { $isChidSpouseArr } from '../../Helper/Constant';
import { fetchAllChildrenDetails, fetchPrimaryDetails,fetchSpouseDetails } from '../../Redux/Reducers/personalSlice';
import { updatebenefidficiaryList } from '../../Redux/Reducers/financeSlice';
import { $Msg_StateBackground, $SpecialNeed } from '../../Helper/$MsgHelper';
import { globalContext } from '../../../pages/_app';



const FiduciaryBeneficiaryDetails = ({ handleNextTab }) => {
  const { primaryUserId, spouseUserId, loggedInUserId, spouseFirstName, primaryMemberFirstName, subtenantId, isPrimaryMemberMaritalStatus, primaryDetails, _spousePartner, spouseFullName } = usePrimaryUserId();
  const [activeType, setActiveType] = useState('Table');
  const [activeTab, setActiveTab] = useState('Personal');
  const [editInfo, setEditInfo] = useState(null)
  const [activeBtn, setActiveBtn] = useState("Personal");
  const [searchValue, setSearchValue] = useState(null);
  const [clearAll, setClearAll] = useState(false)
  const [isUserDisable, setisUserDisable] = useState(false)
  const [personalDetails, setPersonalDetails] = useState({
    ...$JsonHelper.createPersonalDetails(),
    'memberRelationship': $JsonHelper.createMemberRelationship(primaryUserId, primaryUserId),
    'primaryUserId': primaryUserId, 'subtenantId': subtenantId,
    'createdBy': loggedInUserId, 'updatedBy': loggedInUserId,
    'lName':
      //  isChild ? primaryDetails.lName : 
      ''
  })
  const [detailsForMemberStatus, setDetailsForMemberStatus] = useState('')
  const [updateMemRel, setUpdateMemRel] = useState([])
  const tableHeader = ['Name','Relationship','Role', 'Edit']
  const dispatch = useAppDispatch()
  const legalSliceStateData = useAppSelector(selectorLegal)
  const personalReducer = useAppSelector(selectPersonal)
  const { familyMemberList } = legalSliceStateData;
  const [updateListWhileCheckUncheck, setUpdateListWhileCheckUncheck] = useState([])
  
  const fidBenPersonalContent = `Your ${activeTab == "Spouse" ? "Spouse's" : ""} Fiduciary/Beneficiary's personal information helps us tailor our services to your unique needs. Please ensure all details are accurate as they form the basis for personalized advice and recommendations.`;
  const fidBenStatusContent = `Provide your ${activeTab == "Spouse" ? "Spouse's" : ""} Fiduciary/Beneficiary's current status and background information to ensure we can offer guidance that's relevant to your personal circumstances.`
  const fidBenContactAddressContent = `Accurate contact and address information is essential for effective communication and service delivery. Keep these details current to ensure your ${activeTab == "Spouse" ? "Spouse's" : ""} Fiduciary/Beneficiary receives important updates and support.`
  const { allChildrenDetails } = personalReducer;
  const { setWarning} = useContext(globalContext);

  konsole.log("beficiaryListArr11212", activeTab, primaryDetails, familyMemberList,updateListWhileCheckUncheck)

  useEffect(() => {
  
    if ($AHelper.$isNotNullUndefine(editInfo)) {
      fetchSavedData()
      // setEditInfo(null)
    }
  }, [editInfo])

  useEffect(() => {
    if (!familyMemberList || familyMemberList.length === 0) {
      fetchFamilyMembersList();
    }
    if (!allChildrenDetails || allChildrenDetails.length === 0) {
      dispatch(fetchAllChildrenDetails({ userId: primaryUserId }));
    }
  }, [primaryUserId, spouseUserId, allChildrenDetails?.length, dispatch]);

  useEffect(()=>{
    fetchFamilyMembersList()
    return () => {
      // alert("clearing beneficiary list")
      dispatch(updatebenefidficiaryList([]))
    }
  },[])


  const fetchListAfterAddFidBen = () => {
    fetchFamilyMembersList()
    // fetchSavedData()
  }

  const handleActiveTabButton = (val) => {
    setActiveBtn(val)
    setActiveTab(val)
    if (val == "Spouse") {
      const checkPrimaryIsFidBen = familyMemberList.some(item => item?.userId == primaryUserId)
      if (!checkPrimaryIsFidBen) {
        const mergePrimaryInFidBenList = [primaryDetails, ...familyMemberList]
        const mergePrimaryMemInFidBenList = [primaryDetails, ...updateListWhileCheckUncheck]
        dispatch(updateFamilyMemberList(mergePrimaryInFidBenList));
        setUpdateListWhileCheckUncheck(mergePrimaryMemInFidBenList)
      }
    }
  }

  const handleAddAnother = (val) => {
    setActiveType('ADDEDIT')
    setActiveTab(val)
    addMemberApi(subtenantId, loggedInUserId,primaryUserId)
    $AHelper.$scroll2Top();
  }

  const addMemberApi = async(subtId, logUserId,primUserId) =>{
    konsole.log("idsdsds",subtId, logUserId,primUserId)
    const jsonObj = $JsonHelper.createPersonalDetails(subtId, logUserId);
    const url = $Service_Url.postAddMember;
    const responseOfAddMember = await postApiCall("POST", url, jsonObj);
    
    let memberUserId = responseOfAddMember?.data?.data?.member?.userId
    let relativeMemberId = responseOfAddMember?.data?.data?.member?.memberId
    setPersonalDetails({
      ...$JsonHelper.createPersonalDetails(),
      'memberRelationship': {...$JsonHelper.createMemberRelationship(primUserId, primUserId),relativeMemberId : relativeMemberId},
      'userId' : memberUserId, 'subtenantId': subtenantId, 'updatedBy': loggedInUserId,
    })
    setClearAll(true)
    konsole.log("responseOfAddMember33",responseOfAddMember,memberUserId,relativeMemberId)
  }

  const fetchFamilyMembersList = async () => {
    useLoader(true);
    const _resultOfInsuranceDetail = await getApiCall('GET', $Service_Url.getFamilyMembers + primaryUserId);
    useLoader(false);
    const insDetails = _resultOfInsuranceDetail != 'err' ? _resultOfInsuranceDetail : []
    konsole.log("_resultOfInsuranceDetail13", _resultOfInsuranceDetail, insDetails);
    dispatch(updateFamilyMemberList(insDetails));
    setUpdateListWhileCheckUncheck(insDetails)
  }

  const sortList = (array) => {
    return array.sort((a, b) => {
      const getPriority = (obj) => {
        if ((obj.userId === spouseUserId) || (obj.userId === primaryUserId)) return 4; // Highest priority
        if (obj.isBeneficiary && obj.isFiduciary) return 3;
        if (obj.isFiduciary) return 2;
        if (obj.isBeneficiary) return 1;
        return 0; // Lowest priority
      };

      // Calculate the priority for each item
      const priorityA = getPriority(a);
      const priorityB = getPriority(b);

      // Sort by priority (higher priority first)
      return priorityB - priorityA;
    });

  }


 
  const filterFiduciaryList = (totalArray, activeTabOf) => {
    let arr = [];
    if (activeTabOf == "Personal") {
      arr = totalArray.filter(({ userId }) => userId !== primaryUserId)
    } else if (activeTabOf == "Spouse") {
      const checkListHavePrimOrSpouse = totalArray.some(item => item.userId == primaryUserId)
      if(!checkListHavePrimOrSpouse){
            const filterSpouseData = totalArray.filter(item => item.userId != spouseUserId)
            const array = [primaryDetails, ...filterSpouseData]
            arr = array.filter(({ userId }) => userId !== spouseUserId).map(d => (d.userId === primaryUserId) ? { ...d, rltnTypeWithSpouse: "Spouse" } : d);
          }
          else{
            arr = totalArray.filter(({ userId }) => userId !== spouseUserId).map(d => (d.userId === primaryUserId) ? { ...d, rltnTypeWithSpouse: "Spouse" } : d);
          }
    }
    return arr
  }

  // @@ Searching Value

  const filteredSearchData = useMemo(() => {
    let searchQuery = searchValue;
    let data = filterFiduciaryList(sortList(updateListWhileCheckUncheck?.filter(item =>  $AHelper.$isCheckNoDeceased(item?.memberStatusId))), activeTab);

    if ($AHelper.$isNotNullUndefine(searchQuery)) {
      const searchString = searchQuery.toLowerCase();
      return data.filter(item => {
        return (
          (item?.fName && item?.fName?.toLowerCase().includes(searchString)) ||
          item?.lName && item?.lName?.toLowerCase().includes(searchString));
      });
    } else {
      return data;
    }
  }, [searchValue, updateListWhileCheckUncheck, activeTab]);

  const fetchSavedData = async () => {
    useLoader(true)
    const _memberResult = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + editInfo?.userId);
    konsole.log("_memberResult_memberResult", _memberResult);
    if (_memberResult != 'err') {
      const responseData = _memberResult?.member;
      setisUserDisable(responseData?.isDisabled)
      konsole.log("responseData", responseData, subtenantId)
      let includecheckfname = responseData?.fName;
      let lastLName = responseData?.lName;
      konsole.log("includecheckfname", includecheckfname)
      let firstName = includecheckfname.includes("- Child -") || includecheckfname.includes("- Spouse") || includecheckfname.includes("- Partner") ? "" : includecheckfname;
      let lastName = ((includecheckfname.includes("- Child -") && lastLName == 'Name')) ? primaryDetails?.lName : (((includecheckfname.includes("- Spouse") || includecheckfname.includes("- Partner")) && lastLName == 'Name')) ? '' : lastLName;
      setPersonalDetails($JsonHelper.createJsonUpdateMemberById({ ...responseData, ...responseData?.memberRelationship, fName: firstName, lName: lastName, 'updatedBy': loggedInUserId, subtenantId: subtenantId }))
      setDetailsForMemberStatus({
        memberStatusIdForTestRef: responseData?.memberStatusId,
        name: responseData?.fName,
        isFiduciaryForTest: responseData?.memberRelationship?.isFiduciary,
        isBeneficiaryForTest: responseData?.memberRelationship?.isBeneficiary
    })
    }
    useLoader(false)
  }

  const updateFidBen = (data) => {
    setEditInfo(data)
    setActiveType('ADDEDIT')
    $AHelper.$scroll2Top();
  }

  const isChildSpouse = useMemo(() => {
    if (spouseUserId != editInfo?.userId) {
      return $isChidSpouseArr.includes(Number(editInfo?.relationshipTypeId))
    }
  }, [editInfo])

  // konsole.log("isChildSpouse1232", isChildSpouse)
  konsole.log("detailsForMemberStatus",detailsForMemberStatus)

  const handleNextBtn = async ()=>{
    const filterDataNotToUpdate = updateMemRel?.length > 0 ? updateMemRel.filter(item => 
      familyMemberList.some(det => 
        det.memberId === item.relativeMemberID && 
        (det.isBeneficiary == false && item.isBeneficiary == false && 
        det.isFiduciary == false && item.isFiduciary == false)
      )
    ) : [];

    const filterUpdatingFidBen = updateMemRel?.length > 0 ? updateMemRel.filter(
      item => !filterDataNotToUpdate.some(det => det.relativeMemberID === item.relativeMemberID)
    ) : [];
    
    const filterOutSameData = filterUpdatingFidBen?.length > 0 ? filterUpdatingFidBen.filter(
      item => !familyMemberList.some(
        det =>
          det.memberId === item.relativeMemberID &&
          det.isBeneficiary === item.isBeneficiary &&
          det.isFiduciary === item.isFiduciary
      )
    ) : [];
    konsole.log("filterOutSameData",filterOutSameData)
    
   const response = await postApiCall("POST", $Service_Url.upsertMemberRelationship,filterOutSameData)
   const checkPrimaryOrSpouseIsUpdated = filterOutSameData?.find(item => ((item.primaryUserId == item.relativeUserId) && item?.relationshipTypeId == 1))
   konsole.log("responseskjdksjdk",response)
   if(response?.data?.data?.length > 0){
    if($AHelper?.$isNotNullUndefine(checkPrimaryOrSpouseIsUpdated) && checkPrimaryOrSpouseIsUpdated?.primaryUserId == spouseUserId){
      dispatch(fetchPrimaryDetails({ userId: primaryUserId }))
    }
    dispatch(fetchAllChildrenDetails({ userId: primaryUserId }));
    await fetchFamilyMembersList()
    setUpdateMemRel([])
  } 
  if (activeBtn == "Personal" && isPrimaryMemberMaritalStatus) {
    await dispatch(fetchPrimaryDetails({ userId: primaryUserId }))
    await dispatch(fetchSpouseDetails({ userId: spouseUserId }))
    await handleActiveTabButton("Spouse")
    $AHelper.$scroll2Top();
  }else{
    handleNextTab()
  }
}

const managingListCheckbox = (eventChecked, fidBenData, callFor) => {
  if((fidBenData?.userId == primaryUserId) && $AHelper?.$isNullUndefine(fidBenData?.memberRelationship)){
    fidBenData.memberRelationship = {...$JsonHelper.updateMemberRelationship(spouseUserId, false, false, 1, fidBenData?.memberId, spouseUserId, loggedInUserId)}
  }
  let item = (fidBenData?.userId == primaryUserId) ? fidBenData?.memberRelationship : fidBenData
  konsole.log("itemietme",item,fidBenData)

  const merged = Object.keys($JsonHelper.updateMemberRelationship())
    .filter((key) => item?.hasOwnProperty(key))
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: item[key],
        userRltnshipId: item?.userRelationshipId || item?.userRltnshipId,
        upsertedBy: loggedInUserId,
        relativeMemberID: fidBenData?.memberId,
      }),
      {}
    );

  setUpdateMemRel((prev) => {
    // Check if the object with the same userRltnshipId already exists
    const existingIndex = prev.findIndex(
      (data) => data.userRltnshipId === (item?.userRelationshipId || item?.userRltnshipId)
    );

    if (existingIndex === -1) {
      // If object does not exist, add it with the correct property
      if (callFor === "isBeneficiary") merged.isBeneficiary = eventChecked;
      if (callFor === "isFiduciary") merged.isFiduciary = eventChecked;

      return [...prev, merged]; // Add to the array
    } else {
      // If it already exists, update the property
      const updatedArray = [...prev];
      if (callFor === "isBeneficiary")
        updatedArray[existingIndex].isBeneficiary = eventChecked;
      if (callFor === "isFiduciary")
        updatedArray[existingIndex].isFiduciary = eventChecked;

      return updatedArray;
    }
  });
};

const makeFidBen = async (e, item, callFor) => {
  let eventChecked = e.target.checked;

   let datedob = $AHelper?.$isNotNullUndefine(item?.dob) ? $AHelper.$calculate_age($AHelper.$getFormattedDate(item?.dob)) : 0;
    if ((datedob < 18 || item?.isDisabled == true) && callFor == "isFiduciary") {
        toasterAlert("warning", "Warning", `${item?.isDisabled == true ? $SpecialNeed?.whileCheckFiduciaryErr : $Msg_StateBackground.minorFiduciary}`);
        handleStateUpdate("isFiduciary", false, item)
        return;
    }
   
    if(activeTab == "Spouse" && (item?.userId == primaryUserId)){
      await handleActiveTabButton("Spouse")
    }
  await managingListCheckbox(eventChecked, item, callFor);
  await handleStateUpdate(callFor, eventChecked, item)

};

const handleStateUpdate = (key, value, item) => {
  setUpdateListWhileCheckUncheck((prevRelationships) =>
    prevRelationships.map((relationship) => {
      if ((item?.userId == primaryUserId) && (relationship?.memberRelationship?.userRltnshipId == item?.memberRelationship?.userRltnshipId)) {
        // Update within memberRelationship
        return {
          ...relationship,
          memberRelationship: {
            ...relationship?.memberRelationship,
            [key]: value,
          },
        };
      }
      else if (relationship?.userRelationshipId === item?.userRelationshipId) {
        // Update at the top level
        return { ...relationship, [key]: value };
      }
      // Return unchanged if no conditions match
      return relationship;
    })
  );
};


const toasterAlert = (type, title, description) => {
  setWarning(type, title, description);
}

function sortByRelationshipTypeId(data) {
  const priorityOrder = [
    [1, 4],                                 // Group 0
    [2, 5, 6, 28, 29, 41],                  // Group 1
    [44, 47, 48, 49, 50],                   // Group 2
    [3]                                     // Group 3
  ];

  const getEffectiveTypeId = (item) => {
    if (item.relationshipTypeId === 1 && item.primaryUserId !== item.relativeUserId) {
      return 50; // Treat it as part of Group 2
    }
    if (item?.memberRelationship?.relationshipTypeId === 1 && item?.memberRelationship?.primaryUserId == item?.memberRelationship?.relativeUserId) {
      return 2; // Treat it as part of Group 2
    }
    return item.relationshipTypeId || 0;
  };

  const getPriorityIndex = (typeId) => {
    for (let i = 0; i < priorityOrder.length; i++) {
      if (priorityOrder[i].includes(typeId)) return i;
    }
    return Infinity; // Not in any group, push to bottom
  };

  return data.sort((a, b) => {
    const aId = getEffectiveTypeId(a);
    const bId = getEffectiveTypeId(b);
    const aPriority = getPriorityIndex(aId);
    const bPriority = getPriorityIndex(bId);
    if (aPriority !== bPriority) return aPriority - bPriority;
    return aId - bId; // If same group, sort by ID
  });
}
  return (
    <>
      {(activeType == 'Table') ?
        <>
          <div className='d-flex justify-content-between'>
          <span className='heading-of-sub-side-links mb-3'>Legal Information</span></div>
          <div style={{borderBottom: '1px solid #F0F0F0'}}></div>
          {/* <div className='d-flex justify-content-between mb-3 mt-3'><span className='heading-of-sub-side-links_1' style={{fontSize: '16px', color:"#939393", fontWeight:"400"}}>(View and add your Fiduciary/Beneficiary)</span>
          {isPrimaryMemberMaritalStatus && (
              <div className="d-flex align-items-end justify-content-between divAligmentForPersonlaMedicalHostory mt-0">
                <div className="btn-div addBorderToToggleButton">
                  <button className={`view-btn ${activeBtn == "Personal" ? "active selectedToglleBorder" : ""}`} onClick={() => handleActiveTabButton("Personal")}>{primaryMemberFirstName}</button>
                  <button className={`view-btn ${activeBtn == "Spouse" ? "active selectedToglleBorder" : ""}`} onClick={() => handleActiveTabButton("Spouse")}>{spouseFirstName}</button>
                </div>
              </div>
            )}
          </div> */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="col-auto">
              <span className='  heading-of-sub-side-links-2 '>(View and add your Fiduciary/Beneficiary)</span>
            </div>
            {(isPrimaryMemberMaritalStatus) &&
              <div className="d-flex align-items-end justify-content-end" style={{ margin: "-62px 30px 24px" }}>
                <div className="btn-div addBorderToToggleButton ms-auto" >
                  <button className={`view-btn ${activeBtn == "Personal" ? "active selectedToglleBorder" : ""}`} onClick={() => handleActiveTabButton("Personal")}>{primaryMemberFirstName}</button>
                  <button className={`view-btn ${activeBtn == "Spouse" ? "active selectedToglleBorder" : ""}`} onClick={() => handleActiveTabButton("Spouse")}>{spouseFirstName}</button>
                </div>
              </div>
            }
          </div>
          {/* Search and count and add another content */}

          <div id="information-table" className="mt-2 information-table table-responsive">

            <div className="table-search-section sticky-header-1 d-flex justify-content-between align-items-center">
              <div className="children-header w-50">
                <span>Fiduciary/Beneficiary</span>
                <span className="badge ms-1">{filteredSearchData?.length} Added</span>
              </div>
              <div style={{ marginBottom: "43px" }} className=' w-50'>
                <CustomInputSearch
                  isEroor=''
                  label=''
                  id='search'
                  placeholder='Search'
                  value={searchValue}
                  onChange={(val) => setSearchValue(val)}
                />
              </div>
              <div className='w-25 d-flex flex-row-reverse'>
                <CustomButton label="Add another"
                  onClick={() => handleAddAnother(activeTab)}
                />
              </div>
            </div>

            {/* Search and count and add another content */}
            {/* TABLE */}
            <div className='table-responsive fmlyTableScroll'>
              <Table className="custom-table">
                {/* @@ header content */}
                <thead className="sticky-header">
                  <tr>
                    {tableHeader.map((item, index) => (
                      <th className='text-center' key={index}>{item}</th>
                    ))}
                  </tr>
                </thead>
                {/* @@ header content */}
                {filteredSearchData?.length > 0 ? (
                  <tbody className='table-body-tr'>
                    {sortByRelationshipTypeId(filteredSearchData).map((item, index) => {
                      let relationshipwithPrimary = (item?.relativeUserId != primaryUserId && item.relationshipTypeId == 1) ? 'In-Law' : (item.relationshipTypeId == 3 || item.relationshipTypeId == 2 || activeBtn == "Personal") ? item?.relationshipName : item?.rltnTypeWithSpouse;
                      return (
                        <tr>
                          <td className="fidBenName">{`${item.fName} ${item.lName}`}</td>
                          <td className="text-center">{relationshipwithPrimary == 'Spouse' ? $AHelper.$capitalizeFirstLetter(_spousePartner) : relationshipwithPrimary}</td>
                          <td className="d-flex justify-content-around">
                            <div>Beneficiary</div>
                            <div>
                              <Form.Check className="form-check-smoke" type="checkbox"
                                // value={item?.isBeneficiary}
                                checked={item?.isBeneficiary == false ? false : (item?.isBeneficiary || item?.memberRelationship?.isBeneficiary)} 
                                onChange={(e)=>makeFidBen(e, item, "isBeneficiary")}
                                // disabled={(item?.isBeneficiary == true || item?.memberRelationship?.isBeneficiary == true) ? false : true}
                                ></Form.Check>
                            </div>
                            <div>Fiduciary</div>
                            <div>
                              <Form.Check className="form-check-smoke" type="checkbox"
                                // value={item.isFiduciary}
                                checked={item.isFiduciary == false ? false : (item.isFiduciary || item?.memberRelationship?.isFiduciary)}
                                onChange={(e)=>makeFidBen(e, item, "isFiduciary")}
                                // disabled={(item.isFiduciary == true || item?.memberRelationship?.isFiduciary == true) ? false : true}
                                ></Form.Check>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-around">
                              <img src="/New/icons/edit-Icon.svg" alt="Edit Icon" className="icon cursor-pointer"
                                onClick={() => updateFidBen(item)}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )
                  : (
                    <tbody>
                      <tr>
                        <td colSpan={tableHeader.length}>
                          <div className="text-center no-data-found">No Data Found</div>
                        </td>
                      </tr>
                    </tbody>
                  )}
              </Table>
            </div>
            {/* TABLE */}
          </div>

          <div className='d-flex justify-content-end'>
          <CustomButton  label={`Proceed to ${(isPrimaryMemberMaritalStatus && activeBtn == "Personal") ? spouseFirstName + ' Information' : 'Living Will Details'}`} onClick={() => handleNextBtn('Next')}/>

          </div>
          {/* Search and count and add another content */}
        </> : <>

          {/* @@Add LongTerm Care Insurance Policy */}
          {$AHelper.$isNotNullUndefine(editInfo) ?
            <EditFiduciaryBeneficiary detailsForMemberStatus={detailsForMemberStatus} setActiveTypeToPrevious={setActiveType} setEditInfo={setEditInfo} tabIsActiveFor={activeTab} personalDetails={personalDetails} setPersonalDetails={setPersonalDetails} handleNextTab={handleNextTab} fetchListAfterAddFidBen={fetchListAfterAddFidBen} activeType={activeType} isChildSpouse={isChildSpouse} fidBenPersonalContent = {fidBenPersonalContent} fidBenStatusContent = {fidBenStatusContent} fidBenContactAddressContent = {fidBenContactAddressContent} isUserDisable={isUserDisable}/>
            : <AddFiduciaryBeneficiary detailsForMemberStatus={detailsForMemberStatus} setActiveTypeToPrevious={setActiveType} setEditInfo={setEditInfo} tabIsActiveFor={activeTab} personalDetails={personalDetails} setPersonalDetails={setPersonalDetails} handleNextTab={handleNextTab} fetchListAfterAddFidBen={fetchListAfterAddFidBen} activeType={activeType} isChildSpouse={isChildSpouse} addMemberApi = {addMemberApi} clearAll = {clearAll} fidBenPersonalContent = {fidBenPersonalContent} fidBenStatusContent = {fidBenStatusContent} fidBenContactAddressContent = {fidBenContactAddressContent}/>}
        </> 
      }


    </>
  )
}

export default FiduciaryBeneficiaryDetails