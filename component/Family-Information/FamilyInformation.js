import React, { useCallback, useEffect, useState, useMemo, useContext } from 'react';
import { Row, Table, Col } from 'react-bootstrap';
import { CustomSubSideBarLinks } from '../Custom/CustomHeaderTile';
import { CustomButton } from '../Custom/CustomButton';
import { useAppDispatch, useAppSelector } from '../Hooks/useRedux';
import { selectPersonal } from '../Redux/Store/selectors';
import { $AHelper } from '../Helper/$AHelper';
import { deleteFamilyMemberDetails, fetchAllChildrenDetails, fetchAllNonFamilyMemberDetails, setAllChildrenDetails, updateAllChildrenlabelValue, setAllExtentedFamilyDetails } from '../Redux/Reducers/personalSlice';
import { useLoader } from '../utils/utils';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import konsole from '../../components/control/Konsole';
import AddChildWithProgressBar from './AddChildWithProgressBar';
import EditChildWithAccordian from './EditChildWIthAccordian';
import { CustomInputSearch } from '../Custom/CustomComponent';
import { globalContext } from '../../pages/_app';
import { $dashboardLinks, $isChidSpouseArr } from '../Helper/Constant';
import { clearFidBenefiMemberList } from '../utils/utils';
import { postApiCall } from '../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../components/network/UrlPath';
import { fetchPrimaryDetails } from '../Redux/Reducers/personalSlice';
import usePersistActiveTab from '../Hooks/usePersistActiveTab';
import CustomIconTooltip from '../Custom/CustomIconTooltip';

export const headerNavFamily = [
    { label: 'Add Family', value: 'ADD-CHILDREN' },
    { label: 'Add Extended Family / Friends', value: 'ADD-EXTENDED-FAMILY' },
];

const tableHeader = ['Name', 'Relationship', 'Role', 'Edit/Delete'];

const FamilyInformation = () => {
    const dispatch = useAppDispatch();
    const personalReducer = useAppSelector(selectPersonal);
    const { primaryUserId, spouseUserId } = usePrimaryUserId();
    const { allChildrenDetails, allExtendedFamilyDetails, allChildrenlabelValue ,isState, handleOffData} = personalReducer;

    const data = useContext(globalContext)
    // const isChild = activeTab == 'ADD-CHILDREN' ? true : false
    // const [activeTab, setActiveTab] = useState('ADD-CHILDREN');
    const [{ activeTab }, setActiveTab] = usePersistActiveTab("Family", 'ADD-CHILDREN', '');
    const [actionType, setActionType] = useState(null);
    const [editInfo, setEditInfo] = useState(null);
    const [searchValue, setSearchValue] = useState(null)
    const [callWhenDeleteChild, setCallWhenDeleteChild] = useState(false)
    const { newConfirm, setWarning } = useContext(globalContext)
    const isStateText = handleOffData == true ? "Legal" : (isState == 2 ? "Finance" : "Health");

    konsole.log("datadata", data)
    // @@ define useEffect
    useEffect(() => {
        fetchApi('1');
    }, [primaryUserId]);

    useEffect(() => {
     if(callWhenDeleteChild == true){
        callWhenDeleteChildFunc()
     }
    },[callWhenDeleteChild])

    const callWhenDeleteChildFunc = async () =>{
        await dispatch(fetchAllChildrenDetails({ userId: primaryUserId }));
        setCallWhenDeleteChild(false)
    } 


    // @@ fetch api
    const fetchApi = async (type) => {
        konsole.log("type",type)
        useLoader(true);
        if ($AHelper.$isNotNullUndefine(primaryUserId)) {
            konsole.log("primaryUserIdprimaryUserId", primaryUserId)
            if (type == 1 || type == 2) {
                if (allChildrenDetails?.length == 0) {
                    const responseChild = await dispatch(fetchAllChildrenDetails({ userId: primaryUserId }));
                    konsole.log("responseChild", responseChild);
                }
            }
            if (type == 1 || type == 3) {
                if (allExtendedFamilyDetails?.length == 0 || type==3) {
                    const responseNonFamily = await dispatch(fetchAllNonFamilyMemberDetails({ userId: primaryUserId }));
                    let listOfNonFamily=responseNonFamily?.payload =='err' ? []: responseNonFamily?.payload;
                    // console.log('listOfNonFamily',listOfNonFamily)
                    dispatch(setAllExtentedFamilyDetails(listOfNonFamily))
                }
            }


        }
        useLoader(false);
    };

    const handleActiveTab = (val) => {
        konsole.log("val", val)
        setActiveTab(val);
        setSearchValue('')

        let fetchtype = val == 'ADD-EXTENDED-FAMILY' ? 3 : 2;
        fetchApi(fetchtype);
    };

    const handleAddAnother = useCallback((type) => {
        setEditInfo(null);
        setActionType(type);
        $AHelper.$scroll2Top()
    }, []);

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    };

    const handleRoute = useCallback((item) => {
        $AHelper.$dashboardNextRoute(item.route);
    }, []);

    const handleNextBtn = () => {
        if(activeTab == headerNavFamily[0].value) {
            handleActiveTab(headerNavFamily[1].value);
        } else if (activeTab == headerNavFamily[1].value) {
            const updatedSidelink = isState == "2" ? $dashboardLinks.filter(ele => ![3, 4].includes(ele?.id)) : $dashboardLinks;         
            if (handleOffData == true) {
                handleRoute(updatedSidelink[5]);
            } else {
                handleRoute(updatedSidelink[2]);
            }
        } 
    };


    // @@ Delete member data

    const deleteMember = async (item) => {
        konsole.log("item-deleteMember", item);
        if (item?.isBeneficiary == true || item?.isFiduciary == true) {
            let msg = `Action cannot be done, as ${item?.relationshipName} is a fiduciary or beneficiary. Please remove ${item?.relationshipName} from the fiduciary/ beneficiary list.`
            toasterAlert("warning", "Warning", msg);
            return;
        }
        if ($isChidSpouseArr.includes(Number(item.relationshipTypeId))) {
            let relationshipName = item.relationshipTypeId == 1 ? 'In-Law' : item.relationshipName
            toasterAlert("warning", "Warning", `${relationshipName} cannot be deleted.`);
            return;
        }
        
        let msg = `Are you sure you want to delete this ${item.relationshipName}? This action cannot be undone. The ${item.relationshipName}'s family tree will also be deleted.`
        const confirmRes = await newConfirm(true, item?.maritalStatusId == 1 || item?.maritalStatusId == 2 ? msg : `Are you sure you want to delete this ${item?.relationshipName}? This action cannot be undone.`, "Confirmation", `Delete ${item?.relationshipName}`, 2);
        if (!confirmRes) return;

        const isChild = activeTab == headerNavFamily[0].value
        const { userId, memberId, userRelationshipId } = item;

        konsole.log("itemitemitem", item, activeTab)
        // return;

        let jsonObj = {
            userId: userId,
            memberId: memberId,
            deletedBy: userId,
            userRelationshipId: userRelationshipId,
            isDeleteDescendant: isChild,
        };
        useLoader(true)
        const resultOfDeleteMember = await dispatch(deleteFamilyMemberDetails(jsonObj));
        const updateMemberChild = await postApiCall("PUT", $Service_Url?.updateMemberChildByUserId + `?userId=${item?.relativeUserId ?? primaryUserId}&IsChildUserId=${item?.relativeUserId == primaryUserId ? false : true}`, "");
        let fetApiCall = [dispatch(fetchPrimaryDetails({ userId: primaryUserId }))]
        konsole.log("resultOfDeleteMember", resultOfDeleteMember)
        toasterAlert("deletedSuccessfully", `${item?.relationshipName} has been deleted successfully`)
        clearFidBenefiMemberList()
        if (isChild) {
            setCallWhenDeleteChild(true)
            const filterdChildren = allChildrenDetails.filter((item) => item.userId != userId);
            dispatch(setAllChildrenDetails(filterdChildren));
            const filterdExtended = allExtendedFamilyDetails.filter((item) => item.relativeUserId != userId);
            dispatch(setAllExtentedFamilyDetails(filterdExtended))

            let filterallChild = allChildrenlabelValue.filter((item) => item.value != userId);
            dispatch(updateAllChildrenlabelValue(filterallChild))
        } else {
            const filterdExtended = allExtendedFamilyDetails.filter((item) => item.userId != userId);
            dispatch(setAllExtentedFamilyDetails(filterdExtended))
        }

        useLoader(false)
    };

    //@@ edit form
    const updateMember = (item) => {
        setEditInfo(item);
        setActionType(activeTab)
        $AHelper.$scroll2Top()
    }

    //@@ handle edit back to table
    const hadleEditInfo = () => {
        setEditInfo(null);
        setActionType('')
        $AHelper.$scroll2Top()
    }

    konsole.log('allExtendedFamilyDetails', allExtendedFamilyDetails,allChildrenDetails?.filter(item => item?.userId != spouseUserId))

    const sortChildDetailsArray = (array) =>{
        if(array?.length > 0){
            return array.sort((a, b) => {
              // Define the priority of each relationship_Type_Id
              const priorityA =
                a.relationship_Type_Id === 3
                  ? 2 // Last priority
                  : [1, 47, 48, 49, 50].includes(a.relationship_Type_Id)
                  ? 1 // Second last priority
                  : 0; // Top priority
            
              const priorityB =
                b.relationship_Type_Id === 3
                  ? 2
                  : [1, 47, 48, 49, 50].includes(b.relationship_Type_Id)
                  ? 1
                  : 0;
            
              // Sort based on priority (ascending order)
              return priorityA - priorityB;
            });
        }
    }

    // function sortFamilyData(data, primaryUserId) {
    //     const children = [],
    //           inLaws = [],
    //           grandChildren = [];
    //  if(data?.length > 0){
    //      // Classify relationships
    //      data.forEach((item) => {
    //        const normalizedItem = Object.isFrozen(item) ? { ...item, children: null } : { ...item, children: null };
      
    //        // Changed condition to include both 'Child' and 'Son'
    //        if (normalizedItem?.relativeUserId === primaryUserId &&
    //           (normalizedItem?.relationshipName === 'Child' || normalizedItem?.relationshipName === 'Son')) {
    //          children.push(normalizedItem);
    //        }
    //        else if (normalizedItem?.relativeUserId !== primaryUserId &&
    //                 [1, 44, 47, 48, 49, 50]?.includes(normalizedItem?.relationship_Type_Id)) {
    //          inLaws.push(normalizedItem);
    //        }
    //        else if (normalizedItem?.relationship_Type_Id === 3) {
    //          grandChildren.push(normalizedItem);
    //        }
    //      });
      
    //      // Map relationships and build sorted data
    //      return children?.flatMap((child) => {
    //        child.children = grandChildren?.filter((g) => g?.relativeUserId === child?.userId);
    //        child.inLaws = inLaws?.filter((i) => i?.relativeUserId === child?.userId);
    //        return [child, ...child.inLaws, ...child.children];
    //      });
    //  }
    //   }

    // @@ table data map according to the Step
    const tableDataMap = useMemo(() => {
        return activeTab === headerNavFamily[1].value ? allExtendedFamilyDetails?.filter(item => ![1, 47, 48, 49, 50, 3].includes(item?.relationshipTypeId)) : sortChildDetailsArray(allChildrenDetails?.filter(item => item?.userId != spouseUserId));
    }, [dispatch, activeTab, allChildrenDetails, allExtendedFamilyDetails]);


    const filteredSearchData = useMemo(() => {
        let searchQuery = searchValue;
        let data = tableDataMap;

        if ($AHelper.$isNotNullUndefine(searchQuery)) {
            const searchString = searchQuery.toLowerCase();
            return data.filter(item => {
                let fullName = `${item?.fName || ''}${item?.mName || ''}${item?.lName || ''}`.trim();
                let fNameLName = `${item?.fName || ''}${item?.lName || ''}`.trim();
                let fNamemNamelName = `${item?.fName || ''}${item?.mName || ''}${item?.lName || ''}`.trim();
                let fullNameWithSpace = `${item?.fName || ''} ${item?.lName || ''}`.trim(); // Include a space between fName and lName



                return (
                    (item?.fName && item?.fName?.toLowerCase().includes(searchString)) ||
                    (item?.mName && item?.mName?.toLowerCase().includes(searchString)) ||
                    (item?.lName && item?.lName?.toLowerCase().includes(searchString)) ||
                    (fullName && fullName.toLowerCase().includes(searchString)) ||
                    (fNameLName && fNameLName.toLowerCase().includes(searchString)) ||
                    (fullNameWithSpace && fullNameWithSpace.toLowerCase().includes(searchString)) ||
                    (fNamemNamelName && fNamemNamelName.toLowerCase().includes(searchString))
                );
            });
        } else {
            return data;
        }
    }, [searchValue, tableDataMap,primaryUserId, allChildrenDetails, allExtendedFamilyDetails]);



    konsole.log("allChildrenDetailsallChildrenDetails", allChildrenDetails)

    konsole.log("activeTabactiveTab", activeTab, tableDataMap)
    return (
        <div id="setup-family-information"
            // className="setup-family-information col-12 col-md-10 col-lg-10 col-xl-12 ms-auto"
            className="setup-family-information col"
        >

            <>
                <Row>

                    {/* sub side bar links family */}
                    <Col md={2}>
                        <CustomSubSideBarLinks
                            options={headerNavFamily}
                            refrencepage='FamilyInformation'
                            activeTab={activeTab}
                            onClick={(item) => {hadleEditInfo(null), handleActiveTab(item.value) }}


                        />
                    </Col>
                    {!$AHelper.$isNotNullUndefine(actionType) ? (
                        <Col style={{ backgroundColor: "white" }} className="familyInfoCol Scroll2Top">
                            <h1 className='heading-of-sub-side-links'>Family Information</h1>
                            <div id="information-table" className="mt-4 information-table">
                                <div className="table-search-section sticky-header-1 d-flex justify-content-between align-items-center">
                                    <div className="children-header w-50" style={{ marginTop: "10px" }}>
                                        <span>{activeTab === headerNavFamily[0].value ? "Family" : "Extended Family / Friends"}</span>
                                        <span className="badge ms-1">{tableDataMap?.length} Added</span>
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
                                        <CustomButton label={activeTab === headerNavFamily[0].value ? "Add Child" : "Add Family / Friends"}  onClick={() => handleAddAnother(activeTab)} />
                                    </div>
                                </div>
                                <div className='table-responsive fmlyTableScroll'>
                                    <Table className="custom-table mb-0">
                                        <thead className="sticky-header">
                                            <tr>
                                                {tableHeader.map((item, index) => (
                                                    <th className={`${item == 'Edit/Delete' ? 'text-end' : ''}`} key={index}>{item}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        {filteredSearchData?.length > 0 ? (
                                            <tbody className=''>
                                                {filteredSearchData.map((item, index) => {
                                                    const { relationshipName, fName, mName, lName, isBeneficiary, isFiduciary } = item;
                                                    const fullName = `${fName} ${$AHelper.$isNotNullUndefine(mName) ? mName : ''} ${lName}`;
                                                    konsole.log("itemitemitemitem", item)
                                                    // let relationshipwithPrimary=(activeTab == 'ADD-EXTENDED-FAMILY' &&  (item?.relativeUserId !== primaryUserId && item.relationshipTypeId !=1)) ? relationshipName:'In-Law';
                                                    // relationshipTypeId
                                                    let relationshipwithPrimary = (activeTab == 'ADD-EXTENDED-FAMILY' && item?.relativeUserId != primaryUserId && item.relationshipTypeId == 1) ? 'In-Law' : relationshipName;

                                                    const roleName = isBeneficiary && isFiduciary ? 'Beneficiary, Fiduciary' : isBeneficiary ? 'Beneficiary' : (isFiduciary) ? 'Fiduciary' : '-';
                                                    return (
                                                        <tr key={index}
                                                            style={{ height: "10px" }}
                                                        >
                                                            <td style={{width:"45%"}} className='FamilyNameStyle'><p className='aligningToCenterViaMargins'>{fullName}</p></td>
                                                            <td style={{width:"20%"}}><p className='aligningToCenterViaMargins'>{relationshipwithPrimary}</p></td>
                                                            <td style={{width:"25%"}}><p className='aligningToCenterViaMargins'>{roleName}</p></td>
                                                            <td style={{width:"20%"}}>
                                                                <div className="d-flex justify-content-end gap-4">
                                                                    <img src="/New/icons/edit-Icon.svg" alt="Edit Icon" className="icon cursor-pointer" onClick={() => updateMember(item)} />
                                                                    {/* {$isChidSpouseArr.includes(Number(item.relationshipTypeId)) && */}
                                                                    {$AHelper.$needDisableInLawDelete(item, primaryUserId) ? <CustomIconTooltip msg={"You can't delete an in-law directly. You need to update the child's marital status to Single, Divorced, or Widowed, and the spouse will be removed automatically."}><img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon disabler" /></CustomIconTooltip>
                                                                    : <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer disabled" onClick={() => deleteMember(item)} />}
                                                                    {/* } */}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        ) : (
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
                            </div>
                             <div className='d-flex justify-content-end'>
                             <CustomButton label={`Proceed to ${activeTab == headerNavFamily[0].value ? 'Extended family' : isStateText}`}  onClick={() => handleNextBtn()}/>
                            </div>
                        </Col>
                    ) : <>
                    <Col className='Scroll2Top'>
                        {$AHelper.$isNotNullUndefine(editInfo) ? <>
                            <EditChildWithAccordian
                                handleUpdate={hadleEditInfo}
                                actionType={actionType}
                                editInfo={editInfo}
                                activeTab={activeTab}

                            />
                        </> :
                            <AddChildWithProgressBar
                                handleActionType={handleAddAnother}
                                actionType={actionType}
                                activeTab={activeTab}
                                handleActiveTab={handleActiveTab} />
                        }
                    
                    </Col>
                    </>}
                </Row>

            </>

        </div>
    );
};

export default FamilyInformation;
