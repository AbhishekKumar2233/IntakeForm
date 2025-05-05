import React,{useState, useRef, useCallback, useEffect, useContext} from 'react'
import { Row, Col } from 'react-bootstrap'
import Stepper from '../../Custom/CustomStepper'
import FidBenPersonalDetails from './FidBenPersonalDetails'
import ContactAndAddress from '../../Custom/Contact/ContactAndAddress'
import { $JsonHelper } from '../../Helper/$JsonHelper'
import usePrimaryUserId from '../../Hooks/usePrimaryUserId'
import { useAppSelector, useAppDispatch } from '../../Hooks/useRedux'
import { selectApi, selectPersonal } from '../../Redux/Store/selectors'
import StatusBackGround from '../../Personal-Information/StatusBackGround'
import { CustomButton, CustomButton2, CustomButton3 } from '../../Custom/CustomButton'
import konsole from '../../../components/control/Konsole'
import { $AHelper } from '../../Helper/$AHelper'
import { useLoader } from '../../utils/utils'
import { $Service_Url } from '../../../components/network/UrlPath'
import { isNotValidNullUndefile, postApiCall } from '../../../components/Reusable/ReusableCom'
import { specialNeedMemberStatusId } from '../../../components/Reusable/ReusableCom'
import { globalContext } from '../../../pages/_app'
import { clearFamilyNExtendedFamilyInfo } from '../../utils/utils'
import { CustomAccordion, CustomAccordionBody } from '../../Custom/CustomAccordion'
import { $getServiceFn } from '../../../components/network/Service'
import { updateOccupationList } from '../../Redux/Reducers/apiSlice'
import useResetStates from '../../Hooks/useResetStates'
import UniversalAddress from '../../Custom/Contact/UniversalAddress'
export const headerNavAddFamily = {
    1: "Personal Details",
    2: "Contact & Address Information",
}

const AddFiduciaryBeneficiary = (props) => {
    let _accordia1Name = 'Personal Details'
    let _accordia2Name = 'Fiduciary/Beneficiary Contact & Address Information';
    const { primaryUserId, spouseUserId, primaryMemberFullName, spouseFullName, primaryDetails, subtenantId, loggedInUserId ,_spousePartner} = usePrimaryUserId();
    const {setActiveTypeToPrevious, setEditInfo, tabIsActiveFor,setPersonalDetails,personalDetails,handleNextTab,fetchListAfterAddFidBen,activeType,detailsForMemberStatus,addMemberApi,clearAll, fidBenPersonalContent, fidBenStatusContent, fidBenContactAddressContent} = props;
    const personalReducer = useAppSelector(selectPersonal)
    const { resetBenFiduStates } = useResetStates();
    const dispatch = useAppDispatch();
    const apiData = useAppSelector(selectApi);
    const allkeys = ["0", "1"]
    const personalDetailsRef = useRef(null);
    const statusBackgroundRef = useRef(null)
    const contactDetailsRef = useRef(null);
    const { setWarning } = useContext(globalContext)
    const { occcupationSavedData } = apiData 
    // const [currentStep, setCurrentStep] = useState(1);
    const [activeKeys, setActiveKeys] = useState(["0"]);


      // handleNext button
      const handleNextBtn = useCallback(async (type) => {
        // @@ validate personal Detail
        const isValidate = personalDetailsRef.current.validatePersonalDetail();
        if (!isValidate) {
            // toasterAlert("warning", "Warning", "Something went wrong inside Personal details")
            // handleActiveKeys(allkeys);
            setActiveKeys(["0"]);
            return;
        }

        const isValidaateStateBack = await statusBackgroundRef?.current?.validateStateBackGround();
        if (!isValidaateStateBack) {
            // toasterAlert("warning", "Warning", "Something went wrong inside Personal details")
            // handleActiveKeys(allkeys);
            setActiveKeys(["0"]);
            return;
        }


        if ($AHelper.$isCheckNoDeceased(personalDetails?.memberStatusId)) {
            const isValidaateStateBackaddress = await contactDetailsRef.current.handleSubmit();
            if (!isValidaateStateBackaddress?.isActive) {
                // toasterAlert("warning", "Warning", "Something went wrong inside address details")
                // handleActiveKeys(allkeys);
                setActiveKeys(["1"]); 
                return;
            }

            const isValidaateStateBackContact = await contactDetailsRef.current.submitContact();
            if (!isValidaateStateBackContact?.isActive) {
                // toasterAlert("warning", "Warning", "Something went wrong inside contact details")
                // handleActiveKeys(allkeys);
                setActiveKeys(["1"]);
                return;
            }
        }

        useLoader(true);
        const _resultof = await saveData();
        konsole.log("_resultof", _resultof);
        useLoader(false);
        handlePreviousBtn()


            // useLoader(true);
            // if (!$AHelper.$isNullUndefine(personalDetails?.memberRelationship?.isEmergencyContact)) {
            //     const resultOfAddFidBenef = await saveData();
            //     konsole.log("resultOfAddFidBenef", resultOfAddFidBenef)
            // }
            // useLoader(false);
        // }
        // if (currentStep != Object.keys(headerNavAddFamily).length && type == 'Next') {
        //     setCurrentStep(currentStep + 1)
        // } else {
            if (type == 'another') {
                addMemberApi(subtenantId, loggedInUserId,primaryUserId)
                setActiveTypeToPrevious('')
                setActiveKeys(["0"]); 
            }
            else if(type == 'SaveAndContinueLater'){
                setActiveKeys(["0"]); 
                setActiveTypeToPrevious('Table')
            }
            else{
                handleNextTab()
            }
            $AHelper.$scroll2Top();
            toasterAlert("successfully", "Successfully saved data", "Your data have been saved successfully") 

            // Reseting beneficiary and fiduciary redux data
            resetBenFiduStates();
        // }
    }, [personalDetails])

    // save function for saving data
    const saveData = async () => {

    return new Promise(async (resolve, reject) => {
        const {memberRelationship, ...rest} = personalDetails;


        if (!$AHelper.$isCheckNoDeceased(rest.memberStatusId)) {
            memberRelationship.isBeneficiary = false;
            memberRelationship.isFiduciary = false;
            memberRelationship.isEmergencyContact = false;
        }
        if (rest?.memberStatusId == specialNeedMemberStatusId || occcupationSavedData?.isDisabled == true) {
            memberRelationship.isFiduciary = false;
        }
       

        const {relativeMemberId,userRltnshipId,...memberRelationshipJson} = memberRelationship;
        konsole.log("jsonObjjsonObj",memberRelationshipJson, rest);
        const method = 'PUT';
        // const url = $Service_Url.postAddMember;
        const url = $Service_Url.putUpdateMember;
        const memberRelationUrl = $Service_Url.postMemberRelationship + `?RelativeMemberID=${relativeMemberId}`;
        const _resultOfMemberRelationship = await postApiCall("POST", memberRelationUrl, memberRelationshipJson);
        rest.memberRelationship = _resultOfMemberRelationship?.data?.data
        const _resultOfSaveChild = await postApiCall(method, url, rest);
        if (_resultOfSaveChild != 'err') {
            const responseData = _resultOfSaveChild?.data?.data?.member;
            const isValidaateStateBack = await statusBackgroundRef.current.saveData(responseData.userId, responseData);
            if(personalDetails?.memberRelationship?.relationshipTypeId == 3 && isNotValidNullUndefile(personalDetails?.memberRelationship?.relativeUserId)) $getServiceFn.updateChildDetails(personalDetails?.memberRelationship?.relativeUserId, true);
            clearFamilyNExtendedFamilyInfo();
            fetchListAfterAddFidBen()
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
        }
        konsole.log("_resultOfSaveChild", _resultOfSaveChild);
        resolve(_resultOfSaveChild)
    })

}  
   useEffect(() => {
        let data = {...occcupationSavedData}
                 data['isDisabled'] = false
                 dispatch(updateOccupationList(data));
   }, [personalDetails?.userId])
   
    
    const handlePreviousBtn = () =>{
        setActiveTypeToPrevious('Table')
        setEditInfo('')
        // handleAddAnother('')
      }

      const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }

    const handleAccordionClick = () => {
        setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
    };
    
    const handleAccordionBodyClick = (key) => {
        setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
    };
    

    konsole.log("personalDetails1212",personalDetails)

  return (
    <>
    <Row className="progress-container mb-1 previous-btn mt-4">
                <div>
                    <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer me-1" onClick={() => handlePreviousBtn()} />
                    <span className='ms-1' onClick={() => handlePreviousBtn()}> Previous</span>
                </div>

            </Row>
            <br />
            {/* <hr className="hr-div mt-3" /> */}
            {/* progress loader */}
            <CustomAccordion isExpendAllbtn={true}
                activekey={activeKeys}
                handleActiveKeys={handleAccordionClick}
                activeKeys={activeKeys}
                allkeys={allkeys}
                header={<span className="heading-text">{"Add Fiduciary/Beneficiary"}</span>}
            >
                <CustomAccordionBody eventkey='0' name={_accordia1Name} setActiveKeys={() => handleAccordionBodyClick('0')}>
                    <div>
                <FidBenPersonalDetails
                    startTabIndex={1}
                    ref={personalDetailsRef}
                    refrencePage='AddFiduciaryBeneficiary'
                    type={activeType}
                    action='ADD'
                    isSideContent={fidBenPersonalContent}
                    setPersonalDetails={setPersonalDetails}
                    dataInfo={personalDetails}
                    userId={personalDetails?.userId}
                    key={personalDetails}
                    // setActiveKeys={setActiveKeys}

                />
                <StatusBackGround
                    startTabIndex={2 + 11}
                    ref={statusBackgroundRef}
                    refrencePage='AddFiduciaryBeneficiary'
                    type={activeType}
                    setPersonalDetails={setPersonalDetails}
                    dataInfo={personalDetails}
                    maritalStatusId = {personalDetails?.maritalStatusId}
                    userId={personalDetails?.userId}
                    key={personalDetails}
                    isSideContent={" "}
                    detailsForMemberStatus={detailsForMemberStatus}
                    clearAll = {clearAll}
                />
            </div>
                </CustomAccordionBody>
                <CustomAccordionBody eventkey='1' name={_accordia2Name} setActiveKeys={() => handleAccordionBodyClick('1')}>
                {/* <ContactAndAddress
                    startTabIndex={2 + 11 + 35}
                    refrencePage='AddFiduciaryBeneficiary'
                    userId={personalDetails?.userId}
                    ref={contactDetailsRef}
                    setPersonalDetails={setPersonalDetails}
                    dataInfo={personalDetails}
                    key={personalDetails}
                    showType="both"
                    // showOnlyForm={true}
                    isMandotry={false}
                    isSideContent={fidBenContactAddressContent}
                    type={tabIsActiveFor}
                /> */}
                <UniversalAddress
                   startTabIndex={2 + 11 + 35}
                   refrencePage='AddFiduciaryBeneficiary'
                   userId={personalDetails?.userId}
                   ref={contactDetailsRef}
                   setPersonalDetails={setPersonalDetails}
                   dataInfo={personalDetails}
                   key={personalDetails}
                   showType="both"
                   // showOnlyForm={true}
                   isMandotry={false}
                   isSideContent={fidBenContactAddressContent}
                   type={tabIsActiveFor}
                
                />
            </CustomAccordionBody>
            </CustomAccordion>

            <Row style={{ marginTop: '24px' }} className='mb-3'>

                <div className='justify-content-between d-flex'>
                        <CustomButton2
                           tabIndex={2 + 11 + 35 + 18}  label="Save & Continue later"  onClick={() => handleNextBtn('SaveAndContinueLater')}/>
                      <div>
                            <CustomButton3
                               tabIndex={2 + 11 + 35 + 18 + 1}  label={`${'Save & Add Another'}`} onClick={() => handleNextBtn('another')}/>
                        <CustomButton
                            tabIndex={2 + 11 + 35 + 18 + 1 + 1}  label={'Next: Living Will Details'} onClick={() => handleNextBtn('Next')}/>
                    </div>
                </div>
            </Row>
        {/* </div> */}
    </>
  )
}

export default AddFiduciaryBeneficiary