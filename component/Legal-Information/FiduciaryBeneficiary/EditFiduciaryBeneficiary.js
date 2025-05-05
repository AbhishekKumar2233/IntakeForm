import React, { useState, useRef, useContext ,useMemo,useEffect} from 'react'
import { Row, Col } from 'react-bootstrap'
import FidBenPersonalDetails from './FidBenPersonalDetails'
import ContactAndAddress from '../../Custom/Contact/ContactAndAddress'
import { $JsonHelper } from '../../Helper/$JsonHelper'
import usePrimaryUserId from '../../Hooks/usePrimaryUserId'
import { useAppSelector, useAppDispatch } from '../../Hooks/useRedux'
import { selectPersonal, selectApi } from '../../Redux/Store/selectors'
import StatusBackGround from '../../Personal-Information/StatusBackGround'
import { CustomButton, CustomButton2, CustomButton3 } from '../../Custom/CustomButton'
import { CustomAccordion, CustomAccordionBody } from '../../Custom/CustomAccordion'
import { globalContext } from '../../../pages/_app'
import { useLoader } from '../../utils/utils'
import { $AHelper } from '../../Helper/$AHelper'
import { $Service_Url } from '../../../components/network/UrlPath'
import { specialNeedMemberStatusId } from '../../../components/Reusable/ReusableCom'
import { postApiCall } from '../../../components/Reusable/ReusableCom'
import konsole from '../../../components/control/Konsole';
import { fetchSpouseDetails } from '../../Redux/Reducers/personalSlice'
import { setPrimaryMemberDetails, setSpouseMemberDetails } from '../../Redux/Reducers/personalSlice'
import { clearFamilyNExtendedFamilyInfo } from '../../utils/utils'
import { updateOccupationList } from '../../Redux/Reducers/apiSlice'
import useResetStates from '../../Hooks/useResetStates'
import UniversalAddress from '../../Custom/Contact/UniversalAddress'
export const headerNavAddFamily = {
    1: "Personal Details",
    2: "Contact & Address Information",
}

const allkeys = ["0", "1"]
const EditFiduciaryBeneficiary = ({ setActiveTypeToPrevious, setEditInfo, personalDetails, setPersonalDetails, tabIsActiveFor, fetchListAfterAddFidBen,detailsForMemberStatus, isChildSpouse, fidBenPersonalContent, fidBenStatusContent, fidBenContactAddressContent ,isUserDisable}) => {
    let _accordia1Name = 'Personal Details'
    let _accordia2Name = 'Fiduciary/Beneficiary Contact & Address Information';
    const { primaryUserId, spouseUserId, primaryDetails } = usePrimaryUserId()
    const { resetBenFiduStates } = useResetStates();
    const dispatch = useAppDispatch()

    const personalDetailsRef = useRef(null);
    const statusBackgroundRef = useRef(null)
    const contactDetailsRef = useRef(null);
    const { setWarning } = useContext(globalContext)
    const [activeKeys, setActiveKeys] = useState(["0"]);
    const apiData = useAppSelector(selectApi);
    const { childrenRelationList,occcupationSavedData } = apiData 
    // @update Data 
    const handleUpdateData = async (type) => {
        const isValidate = personalDetailsRef.current.validatePersonalDetail();
        if (!isValidate) {
            // toasterAlert("warning", "Warning", "Something went wrong inside Personal details")
            setActiveKeys(["0"]);
            return;
        }

        const isValidaateStateBack = await statusBackgroundRef?.current?.validateStateBackGround();
        if (!isValidaateStateBack) {
            // toasterAlert("warning", "Warning", "Something went wrong inside Personal details")
            setActiveKeys(["0"]);
            return;
        }


        if ($AHelper.$isCheckNoDeceased(personalDetails?.memberStatusId)) {
            const isValidaateStateBackaddress = await contactDetailsRef.current.handleSubmit();
            if (!isValidaateStateBackaddress?.isActive) {
                // toasterAlert("warning", "Warning", "Something went wrong inside address details")
                setActiveKeys(["1"]);
                return;
            }

            const isValidaateStateBackContact = await contactDetailsRef.current.submitContact();
            if (!isValidaateStateBackContact?.isActive) {
                // toasterAlert("warning", "Warning", "Something went wrong inside contact details")
                setActiveKeys(["1"]);
                return;
            }
        }

        useLoader(true);
        const _resultof = await saveData();
        konsole.log("_resultof", _resultof);
        useLoader(false);

        // Reseting beneficiary and fiduciary redux data
        resetBenFiduStates();
        
        handlePreviousBtn()
    }

       useEffect(() => {
            let data = {...occcupationSavedData}
                     data['isDisabled'] =  isUserDisable ?? false
                     dispatch(updateOccupationList(data));
       }, [personalDetails?.userId])

    const saveData = async () => {
       
        return new Promise(async (resolve, reject) => {
            let jsonObj = personalDetails;
            if (!$AHelper.$isCheckNoDeceased(jsonObj.memberStatusId)) {
                jsonObj.memberRelationship.isBeneficiary = false;
                jsonObj.memberRelationship.isFiduciary = false;
                jsonObj.memberRelationship.isEmergencyContact = false;
            }
            if (jsonObj.memberStatusId == specialNeedMemberStatusId) {
                jsonObj.memberRelationship.isFiduciary = false;
            }
            if(occcupationDetails?.isDisabled == true && jsonObj.memberRelationship.isFiduciary == true){
                jsonObj.memberRelationship.isFiduciary = false;
            }
            
            // return;
            let _resultOfSaveChild;
            let responseData;
            if(personalDetails?.userId == primaryUserId){
              addMemberRelationForPrimary()
              useLoader(false)
            }
            else{  
            const method = 'PUT'
            const url = $Service_Url.putUpdateMember
            konsole.log("jsonObjForOther",jsonObj)
            _resultOfSaveChild = await postApiCall(method, url, jsonObj);
            responseData = _resultOfSaveChild?.data?.data?.member;
            const isValidaateStateBack = await statusBackgroundRef.current?.saveData(responseData?.userId,responseData);
            getDataAfterAddAndUpdate(_resultOfSaveChild, responseData)
            }
            resolve(_resultOfSaveChild)
        })

    }

    const addMemberRelationForPrimary = async() =>{
      const method = 'PUT'
      const url = $Service_Url.putUpdateMember
      const {memberRelationship, ...rest} = personalDetails;
      konsole.log("restForPrimary",rest)

      const {relativeMemberId,userRltnshipId,...memberRelationshipJson} = memberRelationship;
      konsole.log("memberPrimaryResponse",responseData,memberRelationshipJson,memberRelationship)
      let memberRelationJsonObj = {
        "primaryUserId": spouseUserId,
        "relationshipTypeId": 1,
        "isFiduciary": memberRelationshipJson.isFiduciary,
        "isBeneficiary": memberRelationshipJson.isBeneficiary,
        "relativeUserId": spouseUserId,
      }
      let _resultOfMemberRelationship;
      if($AHelper?.$isNotNullUndefine(userRltnshipId)){
        _resultOfMemberRelationship = await postApiCall("PUT", $Service_Url.postMemberRelationship, memberRelationship);
        konsole.log("memberRelationJsonObjForPrimaryupdate",memberRelationJsonObj,_resultOfMemberRelationship)
      }
      else{
        const memberRelationUrl = $Service_Url.postMemberRelationship + `?RelativeMemberID=${primaryDetails?.memberId}`;
        _resultOfMemberRelationship = await postApiCall("POST", memberRelationUrl, memberRelationJsonObj);
        konsole.log("memberRelationJsonObjForPrimaryAdd",memberRelationUrl,memberRelationJsonObj,_resultOfMemberRelationship)
      }
      const _resultOfSaveChild = await postApiCall(method, url, rest);
      const responseData = _resultOfSaveChild?.data?.data?.member;
      getDataAfterAddAndUpdate(_resultOfSaveChild, responseData)
    }

    const getDataAfterAddAndUpdate = async(_resultOfSaveChild,responseData) =>{
      if (_resultOfSaveChild != 'err') {
        toasterAlert("successfully", "Successfully updated data", "Your data have been updated successfully")
        konsole.log("responseDatata",_resultOfSaveChild,responseData)
        $AHelper.$scroll2Top();
        if (responseData?.userId == primaryUserId) {
            dispatch(setPrimaryMemberDetails(responseData));
        } else if (responseData?.userId == spouseUserId) {
            dispatch(setSpouseMemberDetails(responseData));
        } else {
            clearFamilyNExtendedFamilyInfo();
        }
        fetchListAfterAddFidBen();
    }
    konsole.log("_resultOfSaveChild", _resultOfSaveChild);
    }

    const handlePreviousBtn = () => {
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
    

    const occcupationDetails = useMemo(() => {
        return occcupationSavedData[personalDetails?.userId] ?? occcupationSavedData
    }, [occcupationSavedData, personalDetails?.userId])


    konsole.log("personalDyuyiuyiuyetails",occcupationDetails)
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
                header={<span className="heading-text">{"Edit Fiduciary/Beneficiary"}</span>}
            >
                <CustomAccordionBody eventkey='0' name={_accordia1Name} setActiveKeys={() => handleAccordionBodyClick('0')}>
                    <div>
                        <FidBenPersonalDetails
                            ref={personalDetailsRef}
                            refrencePage='EditFiduciaryBeneficiary'
                            // type={actionType}
                            action='Edit'
                            isSideContent={fidBenPersonalContent}
                            setPersonalDetails={setPersonalDetails}
                            dataInfo={personalDetails}
                            isChildSpouse={isChildSpouse}
                        // userId={personalDetails.userId}

                        />
                        <StatusBackGround
                            ref={statusBackgroundRef}
                            refrencePage='EditFiduciaryBeneficiary'
                            // type={actionType}
                            setPersonalDetails={setPersonalDetails}
                            dataInfo={personalDetails}
                            userId={personalDetails?.userId}
                            maritalStatusId = {personalDetails?.maritalStatusId}
                            isChild={childrenRelationList.some(item => item.value == personalDetails?.memberRelationship?.relationshipTypeId)}
                            isSideContent={" "}
                            isChildSpouse={isChildSpouse}
                            detailsForMemberStatus={{...detailsForMemberStatus}}
                            occcupationDetails={occcupationDetails}

                        />
                    </div>
                </CustomAccordionBody>
                <CustomAccordionBody eventkey='1' name={_accordia2Name} setActiveKeys={() => handleAccordionBodyClick('1')}>
                    {/* <ContactAndAddress
                        refrencePage='EditFiduciaryBeneficiary'
                        userId={personalDetails?.userId}
                        ref={contactDetailsRef}
                        type={tabIsActiveFor}
                        setPersonalDetails={setPersonalDetails}
                        dataInfo={personalDetails}
                        showType="both"
                        isMandotry={false}
                        isChildSpouse={isChildSpouse}
                    // showOnlyForm={true}
                       isSideContent={fidBenContactAddressContent}
                    /> */}
                    <UniversalAddress
                     refrencePage='EditFiduciaryBeneficiary'
                     userId={personalDetails?.userId}
                     ref={contactDetailsRef}
                     type={tabIsActiveFor}
                     setPersonalDetails={setPersonalDetails}
                     dataInfo={personalDetails}
                     showType="both"
                     isMandotry={false}
                     isChildSpouse={isChildSpouse}
                 // showOnlyForm={true}
                    isSideContent={fidBenContactAddressContent}
                    />
                </CustomAccordionBody>
            </CustomAccordion>
            <Row style={{ marginTop: '24px' }}>
                <div className='d-flex flex-row-reverse'>
                    <CustomButton
                        onClick={() => handleUpdateData('Update')}
                        label={'Update'}
                    />
                </div>
            </Row>
        </>
    )
}

export default EditFiduciaryBeneficiary