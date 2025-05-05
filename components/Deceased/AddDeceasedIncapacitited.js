import { connect } from 'react-redux'
import { Modal, Row, Col, Form, Button } from 'react-bootstrap'
import React, { useState, useEffect, useContext } from 'react'
import { $AHelper } from '../control/AHelper'
import { $CommonServiceFn } from '../network/Service'
import { $Service_Url } from '../network/UrlPath'
import { globalContext } from '../../pages/_app'
import { InputCom, SelectCom, getApiCall, postApiCall, isValidateNullUndefine } from '../Reusable/ReusableCom'
import { SET_LOADER } from '../Store/Actions/action'
import AlertToaster from '../control/AlertToaster'
import DatepickerComponent from '../DatepickerComponent'
import konsole from '../control/Konsole'
import { deceasedIncapacititedQuestion } from '../control/Constant'

const basicNewObj = () => {
    return { subtenantId: '', fName: '', mName: '', lName: '', nickName: '', memberStatusId: null, dateOfDeath: '', memberRelationship: '', genderId: '', suffixId: '', dob: '', isPrimaryMember: false, createdBy: '' }
}
const memberRelationShipNewObj = () => {
    return { primaryUserId: '', relationshipTypeId: '', isFiduciary: false, isBeneficiary: false, relativeUserId: '', isEmergencyContact: false }
}
const AddDeceasedIncapacitited = ({ actionType, selectedItemValue, dispatchloader, show, showScreenTypeId, handleAddCloseModal, suffixList, genderList, memberStatusList }) => {

    konsole.log('actionTypeactionType', actionType, selectedItemValue)

    const userDetailOfPrimary = $AHelper.getObjFromStorage("userDetailOfPrimary")
    const spouseUserId=sessionStorage.getItem('spouseUserId')
    const { setdata } = useContext(globalContext)
    const context = useContext(globalContext)
    const subtenantId = sessionStorage.getItem('SubtenantId')
    const loggedInUserId = sessionStorage.getItem('loggedUserId')
    const primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
    const [basicFormDetails, setBasicFormDetails] = useState({ ...basicNewObj(), 'createdBy': loggedInUserId, subtenantId: Number(subtenantId) })
    const [memberRelationShipDetails, setMemberRelationShipDetails] = useState({ ...memberRelationShipNewObj(), relativeUserId: primaryMemberUserId, primaryUserId: primaryMemberUserId })
    const [relationShipList, setRelationShipList] = useState([])
    //  this state define for meta sata question & answer ------------------------------------------------------
    const [specialNeedmember, setSpecialNeedmember] = useState({})
    const [specialNeedDetails, setSpecialNeedDetails] = useState({})

    useEffect(() => {
        fetchApiCall(showScreenTypeId);
        (actionType == 'ADD' && showScreenTypeId !== null) && handleBasicState('memberStatusId', showScreenTypeId);
        (actionType == 'EDIT' && selectedItemValue !== undefined && selectedItemValue !== null) && handleUpdatedValue()
    }, [actionType, showScreenTypeId, selectedItemValue])



    const fetchApiCall = async (relationTypeId) => {
        console.log('relationTypeId',relationTypeId)
        const RelationshipCatId =relationTypeId==2 ? 5 :6
        dispatchloader(true)
        await getApiCall('GET', $Service_Url.getRelationshiplist+`?RelationshipCatId=${RelationshipCatId}`, setRelationShipList)
        dispatchloader(false)
    }


    //  this function for update set value ---------------------------------------------------------------------------
    const handleUpdatedValue = () => {
        console.log("selectedItemValueselectedItemValue", selectedItemValue)
        let { fName, mName, lName, nickName, dob, suffixId, genderId, relationshipTypeId, isFiduciary, isBeneficiary, memberStatusId, dateOfDeath, userRelationshipId, subtenantId, memberId, userId, relativeUserId, } = selectedItemValue

        setBasicFormDetails(prev => ({
            ...prev,
            'fName': fName, 'mName': mName, 'lName': lName, 'nickName': nickName, "dob": dob,
            "updatedBy": loggedInUserId, "genderId": genderId, "suffixId": suffixId, "userId": userId,
            "dateOfDeath": dateOfDeath, 'memberStatusId': memberStatusId, "userMemberId": memberId
        }));
        setMemberRelationShipDetails(prev => ({
            ...prev,
            "primaryUserId": primaryMemberUserId,
            "relationshipTypeId": relationshipTypeId, "isBeneficiary": isBeneficiary, "isFiduciary": isFiduciary, "userRltnshipId": userRelationshipId, "userMemberId": memberId
        }));

    }
    //  this function for Input  value update --------------------------------------------------------------------------
    const handleChange = (e) => {
        const { value, id } = e.target
        konsole.log('handleChange', value, id)
        let enteredValue = $AHelper.capitalizeFirstLetter(value)
        handleBasicState(id, enteredValue)
    }

    //  this function for Select  value update --------------------------------------------------------------------------
    const handleSelect = (e) => {
        const { value, id } = e.target
        konsole.log('handleSelect', value, id)
        handleBasicState(id, Number(value))
    }
    //  this function for Checkbox  value update --------------------------------------------------------------------------
    const handleCheck = (e) => {
        const { checked, id } = e.target;
        konsole.log('handleCheck', checked, id)
        handleMemberRelationShipDetails(id, checked)
    }
    //  this function for Radio  value update --------------------------------------------------------------------------
    const handleRadio = (e) => {
        const { value, id, name } = e.target
        konsole.log('handleRadio', name, value, id)
        if(actionType=='ADD'){
            setBasicFormDetails({...basicNewObj(),loggedInUserId, subtenantId: Number(subtenantId) })
            setMemberRelationShipDetails({...memberRelationShipNewObj(),relativeUserId: primaryMemberUserId, primaryUserId: primaryMemberUserId})
        }else{
            handleBasicState('dateOfDeath','')
            handleMemberRelationShipDetails('isFiduciary',false)
            handleMemberRelationShipDetails('isFiduciary',false)
            handleMemberRelationShipDetails('relationshipTypeId','')
        }
        handleBasicState(name, Number(value))
        fetchApiCall(value)
    }

    //  this function for On Blur m name .  value update ---------------------------------------------------------------------------------------
    const handleChangeBlur = (e) => {
        const { id, value } = e.target
        konsole.log('handleChangeBlur', id, value)
        if (id === 'mName' && value?.length == 1) {
            handleBasicState('mName', value + ".")
        }
    }

    
    //  this function for check date validity with onBlur------------------------------------------------------------------------
    const handleDateBlur=(type)=>{
        var dob = new Date(basicFormDetails?.dob);
        var dod = new Date(basicFormDetails?.dateOfDeath);
        var isValid = dob <= dod;
        if(type=='dob' &&  !(isValidateNullUndefine(basicFormDetails?.dateOfDeath)) && !isValid ){
            toasterAlert('Please enter valid DOB')
            handleBasicState(type, '')
        }
        if(type=='dateOfDeath' &&   !(isValidateNullUndefine(basicFormDetails?.dob)) &&  !isValid){
            toasterAlert('Please enter valid DOD')
            handleBasicState(type,'')
        }
    }

    //  common funtion for update  basic state  value update -------------------------------------------------------------------------------------
    const handleBasicState = (key, value) => {
        setBasicFormDetails(prev => ({
            ...prev,
            [key]: value
        }));
    }

    //  common funtion for update member relationship state  value update --------------------------------------------------------------------------
    const handleMemberRelationShipDetails = (key, value) => {
        setMemberRelationShipDetails(prev => ({
            ...prev,
            [key]: value
        }));
    }

    

    //  this is validation function for validate info-----------------------------------------

    const validateFun = () => {
        const { fName, lName, memberStatusId, genderId } = basicFormDetails
        const { relationshipTypeId } = memberRelationShipDetails
        let errorMsg;
        if (isValidateNullUndefine(relationshipTypeId)) errorMsg = (`Please Choose Relation with ${userDetailOfPrimary?.memberName}`)
        // if (isValidateNullUndefine(genderId)) errorMsg = ('Please select Gender.')
        if (isValidateNullUndefine(lName)) errorMsg = ('Last name cannot be blank.')
        if (isValidateNullUndefine(fName)) errorMsg = ('First name cannot be blank.')
        if (isValidateNullUndefine(memberStatusId)) errorMsg = ('Please select current status.')
        if (!isValidateNullUndefine(errorMsg)) {
            toasterAlert(errorMsg)
            return true
        }
        return false
    }
    //  this is common  function for toaster info-------------------------------------------------------------------------------------------------------------------------
    function toasterAlert(text) {
        setdata({ open: true, text: text, type: "Warning" });
    }

    //  this is save for toaster info-------------------------------------------------------------------------------------------------------------------------------------
    const saveFun = async () => {
        if (validateFun()) return;
        let jsonObj = basicFormDetails
        jsonObj.memberRelationship = memberRelationShipDetails

        konsole.log('jsonObj', jsonObj, JSON.stringify(jsonObj))
        // return;
        let method = actionType == 'ADD' ? 'POST' : "PUT"
        let url = method == 'POST' ? $Service_Url.postAddMember : $Service_Url.putUpdateMember
        dispatchloader(true)
        let result = await postApiCall(method, url, jsonObj)
        konsole.log('resultresultresult', result)
        dispatchloader(false)
        if (result == 'err') return;
        const memberUserId = result.data.data.member.userId
        konsole.log('memberUserId', memberUserId)
        savePostData(memberUserId)
        // AlertToaster.success(`Data ${actionType == 'ADD' ? "saved" : "updated"}  successfully`)
        // handleAddCloseModal(false)

    }
    // save meta data---------------------------------------------------------------------------------------------------------------------------------------------------
    const savePostData = async (userId) => {
        konsole.log('userId', userId)
        let userSubjects = []
        if ($AHelper.objectvalidation(specialNeedmember)) { userSubjects.push(specialNeedmember) }
        if ($AHelper.objectvalidation(specialNeedDetails)) { userSubjects.push(specialNeedDetails) }
        let jsonobj = { "userId": userId, "userSubjects": userSubjects }
        konsole.log('userSubjectsuserSubjects', jsonobj, userSubjects)
        if (userSubjects.length > 0) {
            dispatchloader(true)
            const resultSaveSubject = await postApiCall('PUT', $Service_Url.putusersubjectdata, jsonobj)
            konsole.log('resultSaveSubject', resultSaveSubject)
            dispatchloader(false)
            handleAddCloseModal(false)
            AlertToaster.success(`Data ${actionType == 'ADD' ? "saved" : "updated"}  successfully`)
            konsole.log('resultSaveSubject', resultSaveSubject)
        } else {
            handleAddCloseModal(false)
            AlertToaster.success(`Data ${actionType == 'ADD' ? "saved" : "updated"}  successfully`)
        }
    }

    let idOfNonFamily = [1, 4, 7, 8, 12, 46, 999999];
    if (spouseUserId == undefined || spouseUserId == null || spouseUserId == '' || spouseUserId == 'null') {
        idOfNonFamily.push(51, 54);
    }
    const relationShipListRemoveFirstWords = relationShipList?.map(item => ({ ...item, label: item.label.split(" ").slice(1).join(" ") }))
    const familyMemberRelationShipList = relationShipListRemoveFirstWords?.length > 0 ? relationShipListRemoveFirstWords?.filter(({ value }) => !idOfNonFamily?.includes(Number(value)))?.sort((a, b) => a.label.localeCompare(b.label)) : [];
    konsole.log('familyMemberRelationShipList', familyMemberRelationShipList)
    return (
        <>
            <Modal show={show} size="lg" centered onHide={() => handleAddCloseModal(false)} animation="false" backdrop="static">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title> Deceased / Incapacitated Member Details</Modal.Title>
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
                        <div className='d-flex justify-content-between'>
                            <div className='mt-2'><span className='fw-bold'>Current status:*</span></div>
                            <div>
                                {memberStatusList.length > 0 && memberStatusList?.filter(i => i.value != 1).map((item, index) => {
                                    return <Form.Check inline className="radio_chekspace_Deceased cursor-pointer" checked={basicFormDetails?.memberStatusId == item.value} name='memberStatusId' type="radio" id={item.label} label={item.label} value={item.value} onChange={(e) => handleRadio(e)} />
                                })}
                            </div>
                        </div>   <hr />
                        <div>
                            <div className='mt-3'>
                                <Form.Group as={Row} className="mb-2">
                                    <InputCom type="text" id='fName' name="fName" label="First Name" value={basicFormDetails?.fName} onChange={(e) => handleChange(e)} placeholder={$AHelper.mandatory("First Name")} />
                                    <InputCom type="text" id='mName' name="mName" label="Middle Name" value={basicFormDetails?.mName} onChange={(e) => handleChange(e)} onBlur={(e) => handleChangeBlur(e)} placeholder="Middle Name" />
                                    <InputCom type="text" id='lName' name="lName" label="Last Name" value={basicFormDetails?.lName} onChange={(e) => handleChange(e)} placeholder={$AHelper.mandatory("Last Name")} />
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2">
                                    <SelectCom id='suffixId' value={basicFormDetails?.suffixId} options={suffixList} onChange={handleSelect} placeholder="Prefix / Suffix" />
                                    <SelectCom id='genderId' value={basicFormDetails?.genderId} options={genderList} onChange={handleSelect} placeholder="Gender" />
                                    <InputCom type="text" id='nickName' name="nickName" label="Nick Name" value={basicFormDetails?.nickName} onChange={(e) => handleChange(e)} placeholder="Nick Name" />
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Col xs sm="6" lg="6" className="mb-2">
                                        <label>Date of Birth</label>
                                        <DatepickerComponent handleOnBlurFocus={() => handleDateBlur('dob')} setValue={(date) => handleBasicState('dob', date)} value={basicFormDetails?.dob} minDate='1000' name="dob" placeholderText="Enter DOB." />
                                    </Col>
                                    {(basicFormDetails?.memberStatusId == 2) && <>
                                        <Col xs sm="6" lg="6" className="mb-2">
                                            <label>Date of Death</label>
                                            <DatepickerComponent name="dateOfDeath" handleOnBlurFocus={() => handleDateBlur('dateOfDeath')} setValue={(date) => handleBasicState('dateOfDeath', date)} minDate='100' value={basicFormDetails?.dateOfDeath} placeholderText="Enter DOD." />
                                        </Col>
                                    </>}
                                </Form.Group>
                            </div>
                        </div>
                        
                        {/*  this component for handle meta data questions --------------------------------------------------------------- */}
                            <MetaDataQuestion memberStatusId={basicFormDetails?.memberStatusId} dispatchloader={dispatchloader}  memberUserid={selectedItemValue?.userId} setSpecialNeedDetails={setSpecialNeedDetails} setSpecialNeedmember={setSpecialNeedmember} />
                        {/*  this component for handle meta data questions --------------------------------------------------------------- */}
                        
                        <hr />
                        <Form.Group as={Row}>
                            <Col className='mt-0'> <span className='fw-bold'>Relationship with {userDetailOfPrimary?.memberName}*</span></Col>
                            <SelectCom id='relationshipTypeId' value={memberRelationShipDetails?.relationshipTypeId} options={familyMemberRelationShipList} onChange={(e) => handleMemberRelationShipDetails(e.target.id, Number(e.target.value))} placeholder="Select.." />
                        </Form.Group>
                        {/* {(basicFormDetails?.memberStatusId ==2) && <>
                        <Form.Group as={Row} className='mt-2'>
                            <Col> <span className='fw-bold'>Role at the time of death</span></Col>
                            <Col xs sm="4" lg="4" className="mb-2">
                                <div className='d-flex justify-content-between'>
                                    <div>
                                        <Form.Check inline className="radio_chekspace_Deceased cursor-pointer" id='isFiduciary' name='Fiduciary' type="checkbox" label='Fiduciary' value="isFiduciary" checked={memberRelationShipDetails.isFiduciary} onChange={(e) => handleCheck(e)} />
                                        <Form.Check inline className="radio_chekspace_Deceased cursor-pointer" id='isBeneficiary' name='Beneficiary' type="checkbox" label='Beneficiary' value="isBeneficiary" checked={memberRelationShipDetails.isBeneficiary} onChange={(e) => handleCheck(e)} />
                                    </div>
                                </div>
                            </Col>
                        </Form.Group>
                        </>} */}
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button style={{ backgroundColor: "#76272b", border: "none" }} className="theme-btn" onClick={() => saveFun()}> {actionType == 'ADD' ? 'Save' : "Update"}</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}



const MetaDataQuestion = ({ dispatchloader,memberStatusId,memberUserid, setSpecialNeedDetails, setSpecialNeedmember }) => {

    const [formlabelData, setFormlabelData] = useState({})

    useEffect(() => {
        fectchsubjectForFormLabelId()
    }, [])

    const fectchsubjectForFormLabelId = async () => {
        let formlabelData = {}
        konsole.log('deceasedIncapacititedQuestion', deceasedIncapacititedQuestion)
        dispatchloader(true)
        let resultsubjectlabel = await postApiCall('POST', $Service_Url.getsubjectForFormLabelId, deceasedIncapacititedQuestion);
        konsole.log('resultsubjectlabel', resultsubjectlabel)
        if (resultsubjectlabel == 'err') return;
        for (let obj of resultsubjectlabel.data.data) {
            let label = "label" + obj.formLabelId;
            formlabelData[label] = obj.question;
            let result = await getApiCall('GET', $Service_Url.getSubjectResponse + memberUserid + `/0/0/${formlabelData[label].questionId}`, null);
            konsole.log('resultresult', result)
            if(result !=='err' && result?.userSubjects?.length !=0){
                let responseData =result?.userSubjects[0];
                konsole.log('responseData',responseData)
                for(let i=0; i< formlabelData[label].response.length;i++){
                    if (formlabelData[label].response[i].responseId ===responseData.responseId ){
                        if (responseData.responseNature == "Radio") {
                            formlabelData[label].response[i]["checked"] = true;
                            formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        }else if (responseData.responseNature == "Text"){
                            formlabelData[label].response[i]["response"] =responseData.response;
                            formlabelData[label].response[i]["response"] =responseData.response;
                            formlabelData[label].response[i]["subResponseData"] =responseData.response;
                            formlabelData[label]["userSubjectDataId"] =responseData.userSubjectDataId;
                        }   
                    }
                }
            }
        }
        dispatchloader(false)
        konsole.log('formlabelData', formlabelData)
        setFormlabelData(formlabelData)
    }

    const metaDatafunJson = (userSubjectDataId, eventValue, eventId, subjectId) => {
        return { userSubjectDataId: userSubjectDataId, subjectId: subjectId, subResponseData: eventValue, responseId: eventId }
    }

    const handleRadioChange = (event, formLabelDatawithlabel, formlabelwithlabel) => {
        event.stopPropagation()
        const eventId = event.target.id;
        const eventValue = event.target.value;
        const eventName = event.target.name;
        const userSubjectDataId = (formLabelDatawithlabel?.userSubjectDataId) ? formLabelDatawithlabel?.userSubjectDataId : 0
        const subjectId = formLabelDatawithlabel?.questionId;

        konsole.log('formLabelDatawithlabel', formLabelDatawithlabel, formlabelwithlabel)
        setFormlabelData(prevState => ({
            ...prevState,
            [formlabelwithlabel]: {
                ...prevState[formlabelwithlabel],
                response: prevState[formlabelwithlabel].response.map(item => ({
                    ...item,
                    checked: item.responseId == eventId ? true : false
                }))
            }
        }));
        let returnMetaData = metaDatafunJson(userSubjectDataId, eventValue, eventId, subjectId)
        konsole.log('returnMetaDatareturnMetaData', returnMetaData)
        setSpecialNeedmember(returnMetaData)

    }
    const handleInputChange = (event, formLabelDatawithlabel, formlabelwithlabel) => {
        event.stopPropagation()
        const eventId = event.target.id;
        const eventValue = event.target.value;
        const eventName = event.target.name;
        const userSubjectDataId = (formLabelDatawithlabel?.userSubjectDataId) ? formLabelDatawithlabel?.userSubjectDataId : 0
        const subjectId = formLabelDatawithlabel?.questionId;

        konsole.log('formLabelDatawithlabel', formLabelDatawithlabel, formlabelwithlabel)
        setFormlabelData(prevState => ({
            ...prevState,
            [formlabelwithlabel]: {
                ...prevState[formlabelwithlabel],
                response: prevState[formlabelwithlabel].response.map(item => ({
                    ...item,
                    subResponseData: eventValue
                }))
            }
        }));
        let returnMetaData = metaDatafunJson(userSubjectDataId, eventValue, eventId, subjectId)
        konsole.log('returnMetaData', returnMetaData)
        setSpecialNeedDetails(returnMetaData)
    }

    const QuestionAndAnswerRadio = (formLabelDatawithlabel, name, withlabel) => {
        return (
            <>
                <div class="d-flex justify-content-between">
                    <p>{formLabelDatawithlabel && formLabelDatawithlabel.question}{" "} </p>
                    <p>{formLabelDatawithlabel && formLabelDatawithlabel?.response.map((response) => {
                        konsole.log("response", response?.checked);
                        const checked = isValidateNullUndefine(response.checked) ? false : true
                        return (
                            <Form.Check
                                key={response.responseId}
                                inline
                                className="left-radio"
                                type="radio"
                                onChange={(e) => handleRadioChange(e, formLabelDatawithlabel, withlabel)}
                                checked={checked}
                                value={response.response}
                                label={response.response}
                                id={response.responseId}
                                name={name}
                            />
                        );
                    })}</p>
                </div>
            </>
        )
    }

    const QuestionAndAnswerInput = (formLabelDatawithlabel, name, withlabel) => {
        return (
            <>
                <div class="d-flex justify-content-between mt-2">
                    <p>{formLabelDatawithlabel && formLabelDatawithlabel.question}{" "} </p>
                    <p>{formLabelDatawithlabel && formLabelDatawithlabel?.response.map((response) => {
                        konsole.log("response", response?.checked);
                        return (
                            <Form.Control type='text' id={response.responseId} placeholder='Special needs' value={response.subResponseData} name={name} onChange={(e) => handleInputChange(e, formLabelDatawithlabel, withlabel)} className='custom-input' />
                        )
                    })}</p>
                </div>
            </>
        )
    }
    const returnvalue = (formLabelData) => {
        konsole.log("formLabelDataformLabelData", formLabelData)
        if (formLabelData !== undefined) {
            for (let item of formLabelData?.response) {
                if (item.response === 'Yes' && item?.checked === true) {
                    return true
                }
            }
        }
    }

    return (
        <>
           {memberStatusId==3 &&   <div className='mt-2'>
                {QuestionAndAnswerRadio(formlabelData?.label1007, '', 'label1007')}
                {(returnvalue(formlabelData?.label1007) === true) &&
                    QuestionAndAnswerInput(formlabelData?.label1008, 'stylehomeSub', 'label1008')}
            </div>}
        </>
    )
}


const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddDeceasedIncapacitited);