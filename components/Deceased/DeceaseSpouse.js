import { connect } from 'react-redux'
import { Modal, Row, Col, Form, Button } from 'react-bootstrap'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { $AHelper } from '../control/AHelper'
import { $CommonServiceFn, $getServiceFn } from '../network/Service'
import { $Service_Url } from '../network/UrlPath'
import { InputCom, SelectCom, getApiCall, postApiCall, isValidateNullUndefine, isNotValidNullUndefile, deceaseSpouseRelationId, removeSpaceAtStart } from '../Reusable/ReusableCom'
import { SET_LOADER } from '../Store/Actions/action'
import AlertToaster from '../control/AlertToaster'
import { globalContext } from '../../pages/_app'
import DatepickerComponent from '../DatepickerComponent'
import konsole from '../control/Konsole'
import Veteran from '../Veteran'
import VeternCom from '../VeternCom'
import moment from 'moment'

const basicNewObj = () => {
    return { subtenantId: '', fName: '', mName: '', lName: '', nickName: '', memberStatusId: null, maritalStatusId: '', noOfChildren: "0", previoudNoOfChild: "0", dateOfDeath: '', memberRelationship: '', genderId: '', currentChild: '', suffixId: '', dob: '', citizenshipId: 187, birthPlace: null, isPrimaryMember: false, createdBy: '' }
}
const memberRelationShipNewObj = () => {
    return { primaryUserId: '', relationshipTypeId: '', rltnTypeWithSpouseId: '', isFiduciary: false, isBeneficiary: false, relativeUserId: '', isEmergencyContact: false }
}

const DeceaseSpouse = ({ dispatchloader, suffixList, genderList, dateOfWedding }) => {
    const { setdata } = useContext(globalContext)

    const primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
    const subtenantId = sessionStorage.getItem('SubtenantId')
    const loggedInUserId = sessionStorage.getItem('loggedUserId')

    // ----***--------***---- define state ----***--------***----
    const [basicFormDetails, setBasicFormDetails] = useState({ ...basicNewObj(), 'createdBy': loggedInUserId, subtenantId: Number(subtenantId) })
    const [memberRelationShipDetails, setMemberRelationShipDetails] = useState({ ...memberRelationShipNewObj(), relativeUserId: primaryMemberUserId, primaryUserId: primaryMemberUserId })

    const [isOpenModal, setIsOpenModal] = useState(false)
    const [deceaseSpouse, setDeceaseSpouse] = useState({})
    const [isEdit, setIsEdit] = useState(false)
    const [isVeteran,setisVeteran] = useState(false)
    konsole.log('basicFormDetailsbasicFormDetails', basicFormDetails, memberRelationShipDetails)

    useEffect(() => {
        fetchDeceaseFamily(primaryMemberUserId)
    }, [])
    // {/*   ----***--------***---- decease Family get  ----***--------***---- */ }
    const fetchDeceaseFamily = async (userId) => {
        if (isValidateNullUndefine(userId)) return;
        dispatchloader(true)
        const response_decease = await getApiCall('GET', $Service_Url.getFamilyMembers + userId + `?MemberStatusId=2`) // for deceased only
        konsole.log('response_decease', response_decease)
        dispatchloader(false)
        const _decease_spouse = response_decease?.length > 0 ? response_decease?.find(({ relationshipTypeId }) => relationshipTypeId == deceaseSpouseRelationId) : {}
        konsole.log('_decease_spouse', _decease_spouse)
        if(_decease_spouse){
            handleUpdatedValue(_decease_spouse)
            setDeceaseSpouse(_decease_spouse)
            setisVeteran(_decease_spouse?.isveteran)
        }
   
    }
    // /*   ----***--------***---- update spouse info in state  ----***--------***---- */
    const handleUpdatedValue = (_decease_spouse) => {
        konsole.log("_decease_spouse_decease_spouse", _decease_spouse)
        let { fName, mName, lName, nickName, dob, suffixId, genderId, citizenshipId, maritalStatusId, rltnTypeWithSpouseId, relationshipTypeId, isFiduciary, isBeneficiary, memberStatusId, dateOfDeath, noOfChildren, userRelationshipId, memberId, userId, birthPlace, relativeUserId, } = _decease_spouse

        setBasicFormDetails(prev => ({
            ...prev,
            'fName': fName, 'mName': mName, 'lName': lName, 'nickName': nickName, "dob": dob,
            "updatedBy": loggedInUserId, "genderId": genderId, "suffixId": suffixId, "userId": userId,
            "dateOfDeath": dateOfDeath, 'memberStatusId': memberStatusId, "userMemberId": memberId,
        }));
        setMemberRelationShipDetails(prev => ({
            ...prev,
            "primaryUserId": primaryMemberUserId, "rltnTypeWithSpouseId": rltnTypeWithSpouseId,
            "relationshipTypeId": relationshipTypeId, "isBeneficiary": isBeneficiary, "isFiduciary": isFiduciary, "userRltnshipId": userRelationshipId, "userMemberId": memberId
        }));
    }
    // /*   ----***--------***---- close modal  ----***--------***---- */
    const handleCloseModal = () => {
        setIsOpenModal(false)
        setIsEdit(false)
    }
    const handleIsEdit = () => {
        setIsEdit(!isEdit)
    }

    // /*   ----***--------***---- input & select  value onChange  ----***--------***---- */

    const handleChange = (e) => {
        const { value, id } = e.target
        konsole.log('handleChange', value, id)
        let enteredValue = $AHelper.capitalizeFirstLetter(value)
        enteredValue = removeSpaceAtStart(enteredValue);
        handleBasicState(id, enteredValue)
    }
    const handleSelect = (e) => {
        const { value, id } = e.target
        konsole.log('handleSelect', value, id)
        handleBasicState(id, Number(value))
    }
    // /*   ----***--------***---- function for On Blur m name .  value update ----***--------***---- */
    const handleChangeBlur = (e) => {
        const { id, value } = e.target
        konsole.log('handleChangeBlur', id, value)
        if (id === 'mName' && value?.length == 1) {
            handleBasicState('mName', value + ".")
    }
    }
    // /*   ----***--------***---- this function for check date validity with onBlur ----***--------***---- */
    const handleDateBlur = (type) => {
        var dob = new Date(basicFormDetails?.dob);
        var dod = new Date(basicFormDetails?.dateOfDeath);
        var isValid = dob <= dod;
        var dow = new Date(dateOfWedding)
        var dateOfWeddingyear = dow.getFullYear()
        var dobyaer = dob.getFullYear()


        if (type == 'dob' && !(isValidateNullUndefine(basicFormDetails?.dateOfDeath)) && !isValid) {
            toasterAlert('Please enter valid DOB')
            handleBasicState(type, '')
        }
        if (type == 'dateOfDeath' && !(isValidateNullUndefine(basicFormDetails?.dob)) && !isValid ) {
            toasterAlert('Please enter valid DOD')
            handleBasicState(type, '')
        }
        if(type == 'dateOfDeath' && dow >= dod){
            toasterAlert('For a deceased member, the date of death cannot be below the date of marriage.')
            handleBasicState(type, '')
        }
        // if(type == 'dob' && ( dow <= dob || dobyaer > dateOfWeddingyear - 16 )){
        if(type == 'dob' && ( dow <= dob || dobyaer > dateOfWeddingyear - 14 )){
            toasterAlert('For a deceased member,the date of birth cannot be minor to date of marriage.')
            handleBasicState(type, '')
        }
        validateMaritalDate()
    }

    const validateMaritalDate = () => {
        if (!isValidateNullUndefine(basicFormDetails?.dateOfDeath) && !isValidateNullUndefine(basicFormDetails?.dob)) {
            let dateBirth = $AHelper.checkIFMinor(basicFormDetails?.dob)
            let dateDeath = $AHelper.checkIFMinor(basicFormDetails?.dateOfDeath)
            let calDate = dateBirth - dateDeath;
            // if (calDate < 16) {
            if (calDate < 14) {
                toasterAlert("Check member's DOB and DOD. Members can't be minor")
                handleBasicState("dob", '')
                handleBasicState('dateOfDeath', '')
            }
        }
    }
    // /*   ----***--------***---- common funtion for update  basic state  value update  ----***--------***---- */
    const handleBasicState = (key, value) => {
        setBasicFormDetails(prev => ({
            ...prev,
            [key]: value
        }));
    }
    // /*   ----***--------***---- this is validation function for validate info  ----***--------***---- */
    const validateFun = () => {
        const { fName, lName, memberStatusId, genderId } = basicFormDetails
        let errorMsg;
        if (isValidateNullUndefine(lName)) errorMsg = ('Last name cannot be blank.')
        if (isValidateNullUndefine(fName)) errorMsg = ('First name cannot be blank.')
        if (!isValidateNullUndefine(errorMsg)) {
            toasterAlert(errorMsg)
            return true
        }
        return false
    }

    // /*   ----***--------***---- save/update data  ----***--------***---- */
    const saveData = async () => {
        if (validateFun()) return;
        let jsonObj = basicFormDetails
        jsonObj.memberRelationship = memberRelationShipDetails
        konsole.log('jsonObj', jsonObj)
        // return;
        dispatchloader(true)
        let result = await postApiCall("PUT", $Service_Url.putUpdateMember, jsonObj)
        konsole.log('resultresult', result)
        dispatchloader(false)
        if (result == 'err') return;
        AlertToaster.success(`Data updated successfully`)
        fetchDeceaseFamily(primaryMemberUserId);
        handleCloseModal();
    }
    const checkVeternProfile = (checked) => {
        // this.setState({ isVeteran: checked });
        setisVeteran(checked)
        konsole.log("isChecked" + checked);
      };
    // /*   ----***--------***---- this is common  function for toaster info- ----***--------***---- */
    function toasterAlert(text) {
        setdata({ open: true, text: text, type: "Warning" });
    }

    return (
        <>
            {/*   ----***--------***---- Decease Spouse ----***--------***---- */}

            {(Object.keys(deceaseSpouse).length > 0) && <>
                <span style={{fontSize:"1.5rem"}}>{deceaseSpouse.fName +" " +deceaseSpouse.mName+ " " + deceaseSpouse.lName}</span>
                <img style={{ cursor: "pointer", marginBottom: "10px", height: "18px",marginTop:"0px" }} className='ms-1' src="/icons/EDITICON.png" onClick={() => setIsOpenModal(true)} />
            </>}
            {/*   ----***--------***---- Decease Spouse ----***--------***---- */}


            <Modal show={isOpenModal} size="lg" centered onHide={() => handleCloseModal()} animation="false" backdrop='static'>
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Deceased Spouse Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='m-1'>
                        <Row className="m-0 f-details person-head">
                            <Col xs md="12" className="p-0">
                                <div className="d-flex justify-content-start ">
                                    <div> <img src="/icons/ProfilebrandColor2.svg" alt="user" /></div>
                                </div>
                            </Col>
                        </Row>
                        <div>
                            <div className='mt-3'>
                                <Form.Group as={Row} className="mb-2">
                                    <InputCom type="text" id='fName' name="fName" label="First Name" placeholder={$AHelper.mandatory("First Name")}
                                        value={basicFormDetails?.fName}
                                        onChange={(e) => handleChange(e)}
                                        disable={!isEdit}
                                    />
                                    <InputCom type="text" id='mName' name="mName" label="Middle Name" placeholder="Middle Name"
                                        value={basicFormDetails?.mName}
                                        onChange={(e) => handleChange(e)}
                                        onBlur={(e) => handleChangeBlur(e)}
                                        disable={!isEdit}
                                    />

                                    <InputCom type="text" id='lName' name="lName" label="Last Name" placeholder={$AHelper.mandatory("Last Name")}
                                        value={basicFormDetails?.lName}
                                        onChange={(e) => handleChange(e)}
                                        disable={!isEdit}
                                    />
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2">
                                    <SelectCom id='suffixId' sm='4' lg='4' placeholder="Prefix / Suffix"
                                        value={basicFormDetails?.suffixId}
                                        onChange={handleSelect}
                                        options={suffixList}
                                        disabled={!isEdit}

                                    />
                                    <SelectCom id='genderId' sm='4' lg='4'
                                        value={basicFormDetails?.genderId}
                                        options={genderList}
                                        onChange={handleSelect}
                                        placeholder="Gender"
                                        disabled={!isEdit}
                                    />
                                    <InputCom type="text" id='nickName' name="nickName" label="Nick Name" placeholder="Nick Name"
                                        value={basicFormDetails?.nickName}
                                        onChange={(e) => handleChange(e)}
                                        disable={!isEdit}
                                    />

                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Col xs sm="6" lg="6" className="mb-2">
                                        <label>Date of Birth</label>
                                        <DatepickerComponent
                                            handleOnBlurFocus={() => handleDateBlur('dob')}
                                            setValue={(date) => handleBasicState('dob', date)}
                                            value={basicFormDetails?.dob}
                                            maxDate="16" minDate="100" name="dob" placeholderText="Enter DOB."
                                            disable={!isEdit}
                                            // validDate='16'
                                        />
                                    </Col>
                                    <Col xs sm="6" lg="6" className="mb-2">
                                        <label>Date of Death</label>
                                        <DatepickerComponent name="dateOfDeath"
                                            handleOnBlurFocus={() => handleDateBlur('dateOfDeath')}
                                            setValue={(date) => handleBasicState('dateOfDeath', date)}
                                            minDate='100'
                                            maxDate="31-12-9999"
                                            value={basicFormDetails?.dateOfDeath}
                                            placeholderText="Enter DOD."
                                            disable={!isEdit}
                                        />
                                    </Col>
                                </Form.Group>
                                <VeternCom refrencePage={'DeceasedSpouse'} label="Are you a U.S. Veteran ?"  checkVeternProfile={checkVeternProfile} userId={deceaseSpouse?.userId} isVeteranChecked={isVeteran} />
                            </div>
                        </div>
                        <hr />
                    </div>
                    <div className='d-flex justify-content-center'>
                        <Button style={{ backgroundColor: "#76272b", border: "none" }} className="theme-btn me-1"
                            onClick={() => (!isEdit) ? handleIsEdit() : saveData()}>
                            {(isEdit) ? 'Update' : "EDIT"}
                        </Button>
                        <Button style={{ backgroundColor: "#76272b", border: "none" }} className="theme-btn ms-1" onClick={() => handleCloseModal()} >Cancel</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps, mapDispatchToProps)(DeceaseSpouse);