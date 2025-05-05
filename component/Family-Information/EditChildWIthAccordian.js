import React, { useCallback, useEffect, useState, useRef, useMemo, useContext } from 'react'
import { Row, Col } from 'react-bootstrap'
import { CustomAccordion, CustomAccordionBody } from '../Custom/CustomAccordion'
import PersonalDetails from '../Personal-Information/PersonalDetails';
import { isContent } from '../Personal-Information/PersonalInformation';
import { $AHelper } from '../Helper/$AHelper';
import { deceaseMemberStatusId, getApiCall, specialNeedMemberStatusId } from '../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../components/network/UrlPath';
import konsole from '../../components/control/Konsole';
import { useLoader } from '../utils/utils';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import { $JsonHelper } from '../Helper/$JsonHelper';
import StatusBackGround from '../Personal-Information/StatusBackGround';
import { CustomButton } from '../Custom/CustomButton';
import { postApiCall } from '../../components/Reusable/ReusableCom';
import { useAppDispatch } from '../Hooks/useRedux';
import { fetchAllChildrenDetails, fetchAllNonFamilyMemberDetails } from '../Redux/Reducers/personalSlice';
import ContactAndAddress from '../Custom/Contact/ContactAndAddress';
import { globalContext } from '../../pages/_app';
import { $isChidSpouseArr } from '../Helper/Constant';
import { clearFidBenefiMemberList } from '../utils/utils';
import { contentObject} from '../Helper/$MsgHelper';
import { cleanUpdateUserFamilyMember } from '../utils/utils';
import useResetStates from '../Hooks/useResetStates';
import UniversalAddress from '../Custom/Contact/UniversalAddress';

const allkeys = ["0", "1", "2"]
const EditChildWithAccordian = (props) => {
    const { handleUpdate, actionType, editInfo, activeTab } = props;
    const isChild = (activeTab == 'ADD-CHILDREN') ? true : false;
    const { primaryUserId, spouseUserId, primaryMemberFullName, spouseFullName, subtenantId, loggedInUserId, primaryDetails } = usePrimaryUserId();
    const { setWarning } = useContext(globalContext);
    const { resetBenFiduStates } = useResetStates();
    const dispatch = useAppDispatch()
    const statusBackgroundRef = useRef(null)
    const personalDetailsRef = useRef(null)
    const contactDetailsRef = useRef(null)
    // define state---
    const relationshipName = (activeTab == 'ADD-EXTENDED-FAMILY' && editInfo?.relativeUserId != primaryUserId && editInfo.relationshipTypeId == 1) ? 'In-Law' : editInfo?.relationshipName;
    const personalContent = 'This section contains personal information. Please ensure all details are accurate and up-to-date.';
    const statusContent = 'Provide current status and background information to better tailor our services to your situation.';
    const contactAddressContent = 'Enter current contact and address information. Keeping this updated ensures smooth communication and service delivery.';

    const [personalDetails, setPersonalDetails] = useState({
        ...$JsonHelper.createPersonalDetails(),
        'memberRelationship': $JsonHelper.createMemberRelationship(),
        'primaryUserId': primaryUserId, 'subtenantId': subtenantId,
        'createdBy': loggedInUserId, userId: null, 'updatedBy': loggedInUserId
    })
    const [detailsForMemberStatus, setDetailsForMemberStatus] = useState('')
    const [activeKeys, setActiveKeys] = useState(["0"]);

    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(editInfo?.userId)) {
            fetchSavedData();
        }
    }, [editInfo?.userId])

    // @@ fetch data with userId
    const fetchSavedData = async () => {
        useLoader(true)
        const _memberResult = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + editInfo?.userId);
        konsole.log("_memberResult_memberResult", _memberResult);
        if (_memberResult != 'err') {
            const responseData = _memberResult?.member;
            const citizenshipId = $AHelper.$isNotNullUndefine(responseData.citizenshipId) ? responseData?.citizenshipId : '187'
            konsole.log("responseData", responseData, subtenantId)
            setDetailsForMemberStatus({
                memberStatusIdForTestRef: responseData?.memberStatusId,
                name: responseData?.fName,
                isFiduciaryForTest: responseData?.memberRelationship?.isFiduciary,
                isBeneficiaryForTest: responseData?.memberRelationship?.isBeneficiary
            })

            let includecheckfname = responseData?.fName;
            let lastLName = responseData?.lName;
            konsole.log("includecheckfname", includecheckfname)
            let firstName = includecheckfname.includes("- Child -") || includecheckfname.includes("- Spouse") || includecheckfname.includes("- Partner") ? "" : includecheckfname;
            let lastName = ((includecheckfname.includes("- Child -") && lastLName == 'Name')) ? primaryDetails?.lName : (((includecheckfname.includes("- Spouse") || includecheckfname.includes("- Partner")) && lastLName == 'Name')) ? '' : lastLName;
            setPersonalDetails({
                ...$JsonHelper.createJsonUpdateMemberById({
                    ...responseData,
                    ...responseData?.memberRelationship, 'updatedBy': loggedInUserId,
                    subtenantId: subtenantId, citizenshipId: citizenshipId,
                    fName: firstName,
                    lName: lastName,
                    maritalStatusId: responseData.maritalStatusId
                }),
                'memberid': responseData.memberId
            })
        }
        useLoader(false)
    }
    // back to table
    const handleActiontypeFun = useCallback((val) => {
        handleUpdate(val);
    }, []);

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }
    // @update Data 
    const handleUpdateData = async () => {
        const isValidate = personalDetailsRef.current.validatePersonalDetail();
        if (!isValidate) {
            setActiveKeys(["0"]);
            return;
        }
        const isValidaateStateBack = await statusBackgroundRef?.current?.validateStateBackGround();
        if (!isValidaateStateBack) {
            setActiveKeys(["1"]);
            return;
        }
        if ($AHelper.$isCheckNoDeceased(personalDetails?.memberStatusId)) {
            const isValidaateStateBackaddress = await contactDetailsRef.current.handleSubmit();
            if (!isValidaateStateBackaddress?.isActive) {
                setActiveKeys(["2"]);
                return;
            }
            const isValidaateStateBackContact = await contactDetailsRef.current.submitContact();
            if (!isValidaateStateBackContact?.isActive) {
                setActiveKeys(["2"]);
                return;
            }
        }
        useLoader(true);
        const _resultof = await saveData();
        konsole.log("_resultof", _resultof);
        handleActiontypeFun('')
        useLoader(false);

        // Reseting beneficiary and fiduciary redux data
        resetBenFiduStates();
    }

    const isGrandChild = useMemo(() => {
        return personalDetails?.memberRelationship?.relationshipTypeId == 3
    }, [personalDetails?.memberRelationship])
    // data save with apu
    const saveData = async () => {
        return new Promise(async (resolve, reject) => {
            cleanUpdateUserFamilyMember();
            let jsonObj = personalDetails;
            if (!$AHelper.$isCheckNoDeceased(jsonObj.memberStatusId)) {
                jsonObj.memberRelationship.isBeneficiary = false;
                jsonObj.memberRelationship.isFiduciary = false;
                jsonObj.memberRelationship.isEmergencyContact = false;
            }
            if (jsonObj?.isDisabled == true) {
                jsonObj.memberRelationship.isFiduciary = false;
            }
            if (isChildSpouse == true || isGrandChild == true) {
                jsonObj.maritalStatusId = null;
            }
            konsole.log("jsonObjjsonObj", jsonObj);
            // return;
            const method = 'PUT'
            useLoader(true)
            const url = method == 'POST' ? $Service_Url.postAddMember : $Service_Url.putUpdateMember
            const _resultOfSaveChild = await postApiCall(method, url, jsonObj);
            if (_resultOfSaveChild != 'err') {
                const responseData = _resultOfSaveChild?.data?.data?.member;
                toasterAlert("successfully", "Successfully updated data", "Your data have been updated successfully")
                const isValidaateStateBack = await statusBackgroundRef.current?.saveData(responseData.userId, responseData);
                clearFidBenefiMemberList();
                if (isChild) {
                    await dispatch(fetchAllChildrenDetails({ userId: primaryUserId }));
                } else {
                    await dispatch(fetchAllNonFamilyMemberDetails({ userId: primaryUserId }))
                }
            }
            konsole.log("_resultOfSaveChild", _resultOfSaveChild);
            useLoader(false)
            resolve(_resultOfSaveChild)
        })
    }
    const labelOfAccordian = useMemo(() => {
        const relationName = relationshipName + '`s';
        let accordian1 = `${relationName} Personal Details`
        let accordian2 = `${relationName} Status and Background`
        let accordian3 = `${relationName} Contact & Address Information`
        return { accordian1, 'accordian2': accordian2, 'accordian3': accordian3 }
    }, [isChild])

    const sideContent = contentObject.dynamicFamilyContent(relationshipName?.toLowerCase());

    const isChildSpouse = useMemo(() => {
        return $isChidSpouseArr.includes(Number(editInfo.relationshipTypeId || editInfo.relationship_Type_Id))
    }, [editInfo])

    // @@ accordian keys
  const handleAccordionClick = () => {
        setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
    };
    
    const handleAccordionBodyClick = (key) => {
        setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
    };

      // @@ konsole
      konsole.log("editInfoeditInfo", editInfo);
      konsole.log("personalDetailsEditChild", personalDetails);
      konsole.log("detailsForMeberStatus", detailsForMemberStatus)

    return (
        <>
            <div className='edit-child' style={{ backgroundColor: "white", padding: "15px 15px" }}>
                <Row className="progress-container mb-1 previous-btn">
                    <div>
                        <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer" onClick={() => handleActiontypeFun('')} />
                        <span className='ms-1' onClick={() => handleActiontypeFun('')} > Previous</span>
                    </div>
                </Row>
                <Row>

                    <div className='mt-1'>
                        <CustomAccordion
                            isExpendAllbtn={true}
                            activekey={activeKeys}
                            handleActiveKeys={handleAccordionClick}
                            activeKeys={activeKeys}
                            allkeys={allkeys}
                            header={`Edit ${relationshipName}\`s Information`}
                        >
                            <CustomAccordionBody eventkey='0' name={labelOfAccordian?.accordian1} setActiveKeys={() => handleAccordionBodyClick('0')}>

                                <PersonalDetails
                                    ref={personalDetailsRef}
                                    refrencePage='EditChildWithAccordian'
                                    type={actionType}
                                    action='EDIT'
                                    isSideContent={sideContent.personalContent}
                                    setPersonalDetails={setPersonalDetails}
                                    dataInfo={personalDetails}
                                    isChildSpouse={isChildSpouse}
                                    isChild={isChild}
                                    startTabIndex={1}
                                />
                            </CustomAccordionBody>
                            <CustomAccordionBody eventkey='1' name={labelOfAccordian?.accordian2} setActiveKeys={() => handleAccordionBodyClick('1')} >
                                <StatusBackGround
                                    ref={statusBackgroundRef}
                                    refrencePage={'EditChildWithAccordian'}
                                    type={actionType}
                                    setPersonalDetails={setPersonalDetails}
                                    dataInfo={personalDetails}
                                    maritalStatusId = {personalDetails?.maritalStatusId}
                                    userId={editInfo?.userId}
                                    isSideContent={sideContent.statusContent}
                                    isChildSpouse={isChildSpouse}
                                    isChild={isChild}
                                    detailsForMemberStatus={{ ...detailsForMemberStatus, name: detailsForMemberStatus?.name, genderId: personalDetails?.genderId }}
                                    startTabIndex={2 + 16}
                                    editInfo = {editInfo}

                                />

                            </CustomAccordionBody>
                            {$AHelper.$isCheckNoDeceased(personalDetails.memberStatusId) &&
                                <CustomAccordionBody eventkey='2' name={labelOfAccordian?.accordian3} setActiveKeys={() => handleAccordionBodyClick('2')}>

                                    {/* <ContactAndAddress
                                        isChildOther={true}
                                        refrencePage='EditChildWithAccordian'
                                        userId={editInfo?.userId}
                                        ref={contactDetailsRef}
                                        type={actionType}
                                        dataInfo={personalDetails}
                                        setPersonalDetails={setPersonalDetails}
                                        isChild={isChild}
                                        showType="both"
                                        isSideContent={sideContent.contactAddressContent}
                                        isChildSpouse={isChildSpouse}
                                        isMandotry={false}
                                        startTabIndex={2 + 16 + 35}
                                        isGrandChild={isGrandChild}
                                    /> */}
                                    <UniversalAddress
                                        isChildOther={true}
                                        refrencePage='EditChildWithAccordian'
                                        userId={editInfo?.userId}
                                        ref={contactDetailsRef}
                                        type={actionType}
                                        dataInfo={personalDetails}
                                        setPersonalDetails={setPersonalDetails}
                                        isChild={isChild}
                                        showType="both"
                                        isSideContent={sideContent.contactAddressContent}
                                        isChildSpouse={isChildSpouse}
                                        isMandotry={false}
                                        startTabIndex={2 + 16 + 35}
                                        isGrandChild={isGrandChild}
                                    />

                                </CustomAccordionBody>
                            }

                        </CustomAccordion>
                    </div>
                </Row>
                <Row style={{ marginTop: '24px' }}>
                    <div className='d-flex flex-row-reverse'>
                        <CustomButton
                            onClick={handleUpdateData}
                            label={'Update'}
                            tabIndex={2 + 16 + 35 + 19}
                        />
                    </div>
                </Row>

            </div>
        </>
    )
}

export default EditChildWithAccordian
