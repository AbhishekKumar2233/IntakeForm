import React, { useCallback, useState, useRef, useContext, useMemo, useEffect } from 'react';
import { CustomAddChildProgressBar } from '../Custom/CustomHeaderTile';
import { Col, Row } from 'react-bootstrap';
import PersonalDetails from '../Personal-Information/PersonalDetails';
import { CustomButton, CustomButton2, CustomButton3 } from '../Custom/CustomButton';
import { headerNavFamily } from './FamilyInformation';
import { $JsonHelper } from '../Helper/$JsonHelper';
import konsole from '../../components/control/Konsole';
import StatusBackGround from '../Personal-Information/StatusBackGround';
import { useAppSelector, useAppDispatch } from '../Hooks/useRedux';
import { selectPersonal } from '../Redux/Store/selectors';
import { postApiCall } from '../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../components/network/UrlPath';
import { fetchAllChildrenDetails, fetchAllNonFamilyMemberDetails, setAllExtentedFamilyDetails } from '../Redux/Reducers/personalSlice';
import { cleanUpdateUserFamilyMember, useLoader } from '../utils/utils';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import ContactAndAddress from '../Custom/Contact/ContactAndAddress';
import Stepper from '../Custom/CustomStepper';
import { $dashboardLinks } from '../Helper/Constant';
import { $AHelper } from '../Helper/$AHelper';
import { globalContext } from "../../pages/_app"
import { specialNeedMemberStatusId, deceaseMemberStatusId, livingMemberStatusId } from '../../components/Reusable/ReusableCom';
import { clearFidBenefiMemberList } from '../utils/utils';
import {contentObject, extentedcontactAddressContent, extentedpersonalContent, extentedstatusContent } from '../Helper/$MsgHelper';
import { CustomAccordion, CustomAccordionBody } from '../Custom/CustomAccordion';
import useResetStates from '../Hooks/useResetStates';
import UniversalAddress from '../Custom/Contact/UniversalAddress';

export const headerNavAddChild = {
    1: "Step 1/ 3 - Child’s Personal Details",
    2: "Step 2/ 3 - Child’s Status and Background",
    3: "Step 3/ 3 - Child’s Contact & Address Information",
}
export const headerNavAddFamily = {
    1: "Personal Details",
    2: "Status & Background",
    3: "Contact & Address Information"
}
export const addChildbtnSteps = {
    1: 'Next: Status and background',
    2: 'Next: Contact & address information',
    // 3: 'Next: Grandchildren information',
    3: 'Next: Extended family'
}
export const addExtendedFamilybtnSteps = {
    1: 'Next: Status and background',
    2: 'Next: Contact & address information',
    3: 'Next: Health'
}

const allkeys = ["0", "1", "2"]
const AddChildWithProgressBar = (props) => {

    const { handleActiveTab, handleActionType, actionType, activeTab } = props;

    const isChild = activeTab == 'ADD-CHILDREN' ? true : false
    const { primaryUserId, spouseUserId, primaryMemberFullName, spouseFullName, primaryDetails, subtenantId, loggedInUserId } = usePrimaryUserId();
    const personalReducer = useAppSelector(selectPersonal);
    const {isState, handleOffData} = personalReducer
    const { resetBenFiduStates } = useResetStates();
    const dispatch = useAppDispatch();
    const [clearAll, setClearAll] = useState(false)
    const [activeKeys, setActiveKeys] = useState(["0"]);

    const personalDetailsRef = useRef(null);
    const statusBackgroundRef = useRef(null)
    const contactDetailsRef = useRef(null);

    //@@ define state 
    const [currentStep, setCurrentStep] = useState(1);
    const [personalDetails, setPersonalDetails] = useState({
        ...$JsonHelper.createPersonalDetails(),
        'memberRelationship': $JsonHelper.createMemberRelationship(primaryUserId, primaryUserId),
        'primaryUserId': primaryUserId, 'subtenantId': subtenantId,
        'createdBy': loggedInUserId, 'updatedBy': loggedInUserId, 'lName': isChild ? primaryDetails?.lName : ''
    })

    const { setWarning, returnTrue } = useContext(globalContext)

    konsole.log("headerNavAddChild", headerNavAddChild[1])
    konsole.log("personalDetails", personalDetails)

    useEffect(()=>{
        addMemberApi()
    },[])

    const addMemberApi = async() =>{
        const jsonObj = $JsonHelper.createPersonalDetails(subtenantId, loggedInUserId);
        const url = $Service_Url.postAddMember;
        const responseOfAddMember = await postApiCall("POST", url, jsonObj);
        
        let memberUserId = responseOfAddMember?.data?.data?.member?.userId
        let relativeMemberId = responseOfAddMember?.data?.data?.member?.memberId
        setPersonalDetails({
          ...$JsonHelper.createPersonalDetails(),
          'memberRelationship': {...$JsonHelper.createMemberRelationship(primaryUserId, primaryUserId),relativeMemberId : relativeMemberId},
          'userId' : memberUserId, 'subtenantId': subtenantId, 'updatedBy': loggedInUserId,'lName': isChild ? primaryDetails?.lName : ''
        })
        konsole.log("responseOfAddMember33",responseOfAddMember,memberUserId,relativeMemberId)
        setClearAll(true);
      }

    //@@ handle Previous button
    const previousHandle = () => {
        // if (currentStep == 1) {
            handleActiontypeFun('');
            handleAddAnother(false)
        // } else {
            // setClearAll(true);
            // setCurrentStep(currentStep - 1);
        // }
    };

    // handleNext button
    // const handleNextBtn = async (type) => {
    //     // @@ validate personal Detail
    //         const isValidate = personalDetailsRef.current.validatePersonalDetail();
    //         konsole.log("isValidatePersonal",isValidate)
    //         if (!isValidate) {
    //             handleActiveKeys(allkeys);
    //             // handleClearAfterAdd(type)
    //             return;
    //         }

    //         const isValidaateStateBack = await statusBackgroundRef.current.validateStateBackGround();
    //         if (!isValidaateStateBack){
    //             handleActiveKeys(allkeys);
    //             return;
    //         } 
    //         useLoader(true);
    //         const resultOfAddChild = await saveData();
    //         if (resultOfAddChild != 'err') {
    //             // const responseData = resultOfAddChild?.data?.data?.member;
    //             useLoader(true)
    //             const isValidaateStateBack = await statusBackgroundRef.current?.saveData(personalDetails.userId, responseData);
    //             useLoader(false)
    //             // handleClearAfterAdd(type)
    //         }else{
    //             useLoader(false)
    //             // handleClearAfterAdd(type)
    //         }
    //         konsole.log("resultOfAddChild", resultOfAddChild)

    //     if ($AHelper.$isCheckNoDeceased(personalDetails?.memberStatusId)) {
    //         const isValidaateStateBackContact = await contactDetailsRef.current?.submitContact();
    //         if (!isValidaateStateBackContact?.isActive) {
    //             useLoader(false)
    //             handleActiveKeys(allkeys);
    //             return;
    //         }
    //         const isValidaateStateBackaddress = await contactDetailsRef.current?.handleSubmit();
    //         if (!isValidaateStateBackaddress?.isActive) {
    //             useLoader(false)
    //             handleActiveKeys(allkeys);
    //             return;
    //         }
    //         useLoader(true);
    //         if (!$AHelper.$isNullUndefine(personalDetails?.memberRelationship?.isEmergencyContact)) {
    //             useLoader(true)
    //             const resultOfAddChild = await saveData();
    //             useLoader(false)
    //             konsole.log("resultOfAddChild", resultOfAddChild);
    //             // handleClearAfterAdd(type)
    //         }else{
    //             useLoader(false)
    //             // handleClearAfterAdd(type)
    //         }

    //         useLoader(false);
    //     }

    //     // if (currentStep != Object.keys(addChildbtnSteps2).length) {
    //     //     setCurrentStep(currentStep + 1)
    //     // } else {
    //     //     if (type == 'another') {
    //     //         handleAddAnother();
    //     //         toasterMsg();
    //     //     } else if (activeTab == headerNavFamily[0].value) {
    //     //         handleActiveTab(headerNavFamily[1].value);
    //     //         handleActiontypeFun('');
    //     //         toasterMsg();
    //     //     } else {
    //     //         toasterMsg();
    //     //         handleRoute($dashboardLinks[2])
    //     //     }
    //     // }
    //     handleClearAfterAdd(type)
    // }

    const handleNextBtn = async (type) => {
        const isValidate = personalDetailsRef?.current?.validatePersonalDetail();
        if (!isValidate) {
            // toasterAlert("warning", "Warning", "Something went wrong inside Personal details")
            setActiveKeys(["0"]);
            return;
        }
        const isValidaateStateBack = await statusBackgroundRef?.current?.validateStateBackGround();
        if (!isValidaateStateBack) {
            // toasterAlert("warning", "Warning", "Something went wrong inside Personal details")
            setActiveKeys(["1"]);
            return;
        }
        if ($AHelper.$isCheckNoDeceased(personalDetails?.memberStatusId)) {
            const isValidaateStateBackaddress = await contactDetailsRef?.current?.handleSubmit();
            if (!isValidaateStateBackaddress?.isActive) {
                toasterAlert("warning", "Warning", "Something went wrong inside address details");
                setActiveKeys(["2"]); 
                return;
            }
            const isValidaateStateBackContact = await contactDetailsRef?.current?.submitContact();
            if (!isValidaateStateBackContact?.isActive) {
                toasterAlert("warning", "Warning", "Something went wrong inside contact details");
                setActiveKeys(["2"]);
                return;
            }
        }
        useLoader(true);
        const _resultof = await saveData();
        konsole.log("_resultof", _resultof);
        // handleActiontypeFun('')
        useLoader(false);

        // Reseting beneficiary and fiduciary redux data
        resetBenFiduStates();

        handleClearAfterAdd(type)
    }


    const handleClearAfterAdd = (type) => {
        konsole.log("bhcdfhd22",activeTab,(activeTab == headerNavFamily[0].value),type)
        useLoader(false);
        // if (currentStep != Object.keys(addChildbtnSteps2).length) {
        //     setCurrentStep(currentStep + 1)
        // }
        //  else {
        if (type == 'another') {
            toasterMsg();
            setClearAll(true);
            addMemberApi();
            $AHelper.$scroll2Top();
            setActiveKeys(["0"]); 
        }
        else if (type == 'save&Continue') {
                handleAddAnother();
                toasterMsg();
                handleActiontypeFun('');
            }
             else if (activeTab == headerNavFamily[0].value) {
                handleActiveTab(headerNavFamily[1].value);
                handleActiontypeFun('');
                toasterMsg();
            } else {
                toasterMsg();           
                const updatedSidelink = isState == "2" ? $dashboardLinks.filter(ele => ![3, 4].includes(ele?.id)) : $dashboardLinks
                handleRoute(updatedSidelink[2]);
            }
        //    };
    }

    const handleAddAnother = (isStepSet) => {
        setPersonalDetails({
            ...$JsonHelper.createPersonalDetails(),
            'memberRelationship': $JsonHelper.createMemberRelationship(primaryUserId),
            'primaryUserId': primaryUserId, 'subtenantId': subtenantId,
            'createdBy': loggedInUserId, 'updatedBy': loggedInUserId
        })
        if(isStepSet !=false){
            setCurrentStep(1)
        }
    }

    // handle Route
    const handleRoute = useCallback((item) => {
        $AHelper.$dashboardNextRoute(item.route);
    }, []);

    // handle Save and  Continue btn;
    const handleActiontypeFun = useCallback((val) => {
        handleActionType(val);
    }, []);


    const toasterMsg = () => {
        toasterAlert("successfully", "Successfully saved data", `Your data have been saved successfully`);
    }

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    };

    // save function for saving data
    const saveData = async () => {
        return new Promise(async (resolve, reject) => {
            cleanUpdateUserFamilyMember();
            const jsonObj = personalDetails;
            const {memberRelationship, ...rest} = jsonObj;
            konsole.log("jsonObjjsonObj", memberRelationship,rest);


            if (!$AHelper.$isCheckNoDeceased(jsonObj.memberStatusId)) {
                jsonObj.memberRelationship.isBeneficiary = false;
                jsonObj.memberRelationship.isFiduciary = false;
                jsonObj.memberRelationship.isEmergencyContact = false;
            }
            if (jsonObj?.isDisabled == true) {
                jsonObj.memberRelationship.isFiduciary = false;
            }


            const method = 'PUT';
            const {relativeMemberId,userRltnshipId,...memberRelationshipJson} = memberRelationship;
            const url = method == 'POST' ? $Service_Url.postAddMember : $Service_Url.putUpdateMember
            const memberRelationUrl = $Service_Url.postMemberRelationship + `?RelativeMemberID=${relativeMemberId}`;
            const _resultOfMemberRelationship = await postApiCall("POST", memberRelationUrl, memberRelationshipJson);
            rest.memberRelationship = _resultOfMemberRelationship.data.data
            konsole.log("jsonObjjsonObj22",memberRelationshipJson,_resultOfMemberRelationship, rest);            
            const _resultOfSaveChild = await postApiCall(method, url, rest);
            if (_resultOfSaveChild != 'err') {
                const responseData = _resultOfSaveChild?.data?.data?.member;
                const isValidaateStateBack = await statusBackgroundRef.current.saveData(responseData.userId, responseData);
                const updateMemberChild = await postApiCall("PUT", $Service_Url?.updateMemberChildByUserId + `?userId=${responseData?.memberRelationship?.relativeUserId}&IsChildUserId=${isChild ? false : true}`, "");
                konsole.log("updateMemberChild",updateMemberChild,responseData)
                setPersonalDetails(prev => ({
                    ...prev,
                    ['userId']: responseData.userId
                }));
                setPersonalDetails((prev) => ({
                    ...prev,
                    memberRelationship: {
                        ...prev.memberRelationship,
                        ['userMemberId']: responseData?.memberId,
                        ['relationshipType']: responseData?.memberRelationship?.relationshipType,
                        ['relativeUserId']: responseData?.memberRelationship?.relativeUserId,
                        ['userRltnshipId']: responseData?.memberRelationship?.userRltnshipId,
                        ['isChildCapableMgmtfinanc']: responseData?.memberRelationship?.isChildCapableMgmtfinanc,
                    }
                }))

                useLoader(true);
                clearFidBenefiMemberList();
                resolve(_resultOfSaveChild)
                if (isChild) {
                    await dispatch(fetchAllChildrenDetails({ userId: primaryUserId }));
                    dispatch(setAllExtentedFamilyDetails([]))
                } else {
                    await dispatch(fetchAllNonFamilyMemberDetails({ userId: primaryUserId }))
                }
                useLoader(false)
            }else{

                resolve(_resultOfSaveChild)
            }
            konsole.log("_resultOfSaveChild", _resultOfSaveChild);
        })

    }

    const labelOfAccordian = useMemo(() => {
        const relationName = isChild == true ? 'Child`s' : 'Extended Family';
        let accordian1 = `${relationName} Personal Details`
        let accordian2 = `${relationName} Status and Background`
        let accordian3 = `${relationName} Contact & Address Information`
        return { accordian1, 'accordian2': accordian2, 'accordian3': accordian3 }
    }, [isChild])

    // @@konsole
    konsole.log("personalDetailsAddChildWithProgressBae", personalDetails)
    konsole.log("actionTypeactionType", actionType);
    konsole.log("personalReducer", personalReducer);
    konsole.log("activeTab", activeTab)


    let headerNavAddChild2 = headerNavAddChild;
    let addChildbtnSteps2 = addChildbtnSteps
    if (!$AHelper.$isCheckNoDeceased(personalDetails?.memberStatusId)) {
        headerNavAddChild2 = {
            1: "Step 1/ 2 - Child’s Personal Details",
            2: "Step 2/ 2 - Child’s Status and Background"
        }
        addChildbtnSteps2 = {
            1: 'Next: Status and background',
            2: 'Next: Extended family'
        }
    }

    const handleAccordionClick = () => {
        setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
    };
    
    const handleAccordionBodyClick = (key) => {
        setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
    };

    const isStateText = handleOffData == true ? "Legal" : (isState == 2 ? "Finance" : "Health");
    

    return (
        <Col style={{ backgroundColor: "white" }} className="familyInfoCol col-12 ms-auto">

            {/* progress loader
            // {isChild == true ? <CustomAddChildProgressBar currentStep={currentStep} totalSteps={Object.keys(headerNavAddChild2)?.length}>
            //     <Row className="progress-container mb-1 previous-btn">
            //         <div>
            //             <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer me-2" onClick={previousHandle} />
            //             <span className='ms-1' onClick={previousHandle}> Previous</span>
            //         </div>
            //     </Row>

            //     {isChild && currentStep == 1 &&
                    // <Row className="mb-0 mt-4">
                    //     <p>Add Child</p>
                    // </Row>
            //     }
            //     <Row className='mb-2'>
            //         <h1 className="heading-text">{isChild == true ? headerNavAddChild2[currentStep] : headerNavAddFamily[currentStep]}</h1>
            //     </Row>
            // </CustomAddChildProgressBar> :
            //     }
            // <br />
            // <hr className="hr-div mt-3" /> */}
            <div className='progress-container'>
                    <Row className="progress-container mb-1 previous-btn">
                        <div>
                            <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer me-2" onClick={previousHandle} />
                            <span className="ms-1" onClick={previousHandle}>Previous</span>
                        </div>
                    </Row>
                    {/* <h2 className="heading-text">{currentStep == 1 && "Add Extended Family/Friend"}</h2>
                    <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} steps={Object.values(headerNavAddFamily)} /> */}
                </div>
            {/* progress loader */}
            {/* <div id='AddChildWithProgressBar' className='addChildWithProgressBar'> */}
            <div className='mt-1 edit-child'>
                        <CustomAccordion
                            isExpendAllbtn={true}
                            activekey={activeKeys}
                            handleActiveKeys={handleAccordionClick}
                            activeKeys={activeKeys}
                            allkeys={allkeys}
                            header={isChild ? 'Add child' : 'Add Extended Family / Friends'}
                        >
                <CustomAccordionBody eventkey='0' name={labelOfAccordian?.accordian1} setActiveKeys={() => handleAccordionBodyClick('0')} >
                {/* {currentStep == 1 && */}
                    <PersonalDetails
                        ref={personalDetailsRef}
                        refrencePage='AddhildWithProgressbar'
                        type={actionType}
                        action='ADD'
                        isSideContent={isChild == true ? contentObject.childPersonalContent : contentObject?.extendedPersonalContent}
                        setPersonalDetails={setPersonalDetails}
                        dataInfo={personalDetails}
                        userId={personalDetails.userId}
                        isChild={isChild}
                        key={currentStep}
                        startTabIndex={1}

                    />
                    </CustomAccordionBody>
                {/* }
                {currentStep == 2 && */}
                <CustomAccordionBody eventkey='1' name={labelOfAccordian?.accordian2} setActiveKeys={() => handleAccordionBodyClick('1')}>

                    <StatusBackGround
                        ref={statusBackgroundRef}
                        refrencePage={'AddChildWithProgressBar'}
                        type={actionType}
                        setPersonalDetails={setPersonalDetails}
                        dataInfo={personalDetails}
                        userId={personalDetails?.userId}
                        isChild={isChild}
                        maritalStatusId = {personalDetails?.maritalStatusId}
                        key={currentStep}
                        isSideContent={isChild == true ? contentObject.childStatusContent : contentObject.extendedStatusContent}
                        clearAll={clearAll}
                        startTabIndex={2 + 16}

                    />
                    </CustomAccordionBody>
                {/* }


                {currentStep == 3 && */}
              
              {$AHelper.$isCheckNoDeceased(personalDetails.memberStatusId) &&
                    <CustomAccordionBody eventkey='2' name={labelOfAccordian?.accordian3} setActiveKeys={() => handleAccordionBodyClick('2')}>
                    {/* <ContactAndAddress
                        isChildOther = {true}
                        refrencePage='AddChildWithProgressBar'
                        userId={personalDetails?.userId}
                        ref={contactDetailsRef}
                        type={actionType}
                        isChild={isChild}
                        setPersonalDetails={setPersonalDetails}
                        dataInfo={personalDetails}
                        key={currentStep}
                        showType="both"
                        isSideContent={isChild == true ? contentObject.childContactAddressContent : contentObject.extendedContactAddressContent}
                        isMandotry={false}
                        startTabIndex={2 + 16 + 35}
                    /> */}
                    <UniversalAddress
                     isChildOther = {true}
                     refrencePage='AddChildWithProgressBar'
                     userId={personalDetails?.userId}
                     ref={contactDetailsRef}
                     type={actionType}
                     isChild={isChild}
                     setPersonalDetails={setPersonalDetails}
                     dataInfo={personalDetails}
                     key={currentStep}
                     showType="both"
                     isSideContent={isChild == true ? contentObject.childContactAddressContent : contentObject.extendedContactAddressContent}
                     isMandotry={false}
                     startTabIndex={2 + 16 + 35}
                    />
                    </CustomAccordionBody>}
                    </CustomAccordion>
                    </div>
                {/* } */}

                <Row style={{ marginTop: '24px' }} className='mb-3'>

                    <div className={`${'justify-content-between flex-row-reverse'} d-flex`}>
                        <div>
                            {/* {currentStep == 3 && */}
                                <CustomButton3
                                    tabIndex={2 + 16 + 35 + 19 +1} label={`${isChild == true ? 'Save & Add Another Child' : 'Save & Add Another Extended Family'}`}
                                    onClick={() => handleNextBtn('another')}
                                />
                            {/* } */}
                            <CustomButton
                                // tabIndex={17} label={isChild == true ? addChildbtnSteps2[currentStep] : addExtendedFamilybtnSteps[currentStep]}
                                tabIndex={2 + 16 + 35 + 19 + 1 + 1} label={`Save & Proceed to ${isChild == true ? 'Extended family' :  isStateText }`}
                                onClick={() => handleNextBtn()}
                            />
                        </div>
                         {/* {(currentStep != 1) && */}
                         <CustomButton2
                                tabIndex={2 + 16 + 35 + 19} label="Save & Continue later"
                                onClick={() => handleNextBtn("save&Continue")}
                            />
                        {/* } */}
                    </div>
                </Row>
            {/* </div> */}
        </Col>
    );
};

export default AddChildWithProgressBar;
