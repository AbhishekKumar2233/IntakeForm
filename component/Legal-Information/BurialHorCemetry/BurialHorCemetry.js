import React, { useEffect, useMemo, useState, useRef, useContext, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { $AHelper } from '../../Helper/$AHelper';
import { CustomButton, CustomButton2 } from '../../Custom/CustomButton';
import { CustomAccordion, CustomAccordionBody } from '../../Custom/CustomAccordion';
import konsole from '../../../components/control/Konsole';
import HandlingOfRemains from './HandlingOfRemains';
import { isContent } from '../../Personal-Information/PersonalInformation';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { selectSubjectData } from '../../Redux/Store/selectors';
import { $ApiHelper } from '../../Helper/$ApiHelper';
import { useLoader } from '../../utils/utils';
import { updateBurialHorCemetryMetaQuestions, updatePrimaryBurialHorCemetryFormLabel, updateSpouseBurialHorCemetryFormLabel } from '../../Redux/Reducers/subjectDataSlice';
import { postApiCall } from '../../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../../components/network/UrlPath';
import Cemetery from './Cemetery';
import { globalContext } from '../../../pages/_app';
import BurialCremationPlans from './BurialCremationPlans';
import BurialHorDocumentUpload from './BurialHorDocumentUpload';
import { selectorLegal } from '../../Redux/Store/selectors';
import { updateSpouseBurialInsuranceDetail, updatePrimaryBurialInsuranceDetail, updateAddressInputHeight } from '../../Redux/Reducers/legalSlice';
import { fetchBurialLifeInsurance } from '../../Redux/Reducers/legalSlice';
import { $BurialCremationPlaceholder, $CemetryAggrimentPlaceholder, $HandleOfRemainsPlaceholder } from '../../Helper/$MsgHelper';
import { HeaderOfPrimarySouseName } from '../../Personal-Information/PersonalInformation';

export const burialHorCemetryLabelId = [461, 462, 952, 463, 464, 933, 934, 935, 936, 937, 938, 939, 1018, 1019, 1020, 1021, 1022, 1027, 1029, 1023, 1024, 1025]
const allkeys = ["0", "1", "2"]
const BurialHorCemetry = forwardRef((props,ref) => {
    const { handleNextTab, referencePage, userId } = props;
    const { primaryUserId, primaryDetails, spouseUserId, primaryMemberFullName, spouseFullName, isPrimaryMemberMaritalStatus} = usePrimaryUserId();
    const { setConfirmation, confirm, setWarning } = useContext(globalContext)
    const dispatch = useAppDispatch();
    const subjectData = useAppSelector(selectSubjectData);
    const legalApiData = useAppSelector(selectorLegal);
    const { burialSpouseLifeInsurance, burialPrimaryLifeInsurance, adjustAddressInputHeight  } = legalApiData
    const { burialCremationHORCemetryQuestions, primaryCremationHORCemetryFormLabel, spouseCremationHORCemetryFormLabel } = subjectData;
    const [activeKeys, setActiveKeys] = useState(["0"]);
    const primaryHorRef = useRef(null);
    const spouseHorRef = useRef(null);
    const primaryCemeteryRef = useRef(null);
    const spouseCemeteryRef = useRef(null);
    const primaryBurialRef = useRef(null);
    const spouseBurialRef = useRef(null);
    const isPrimaryuser = useMemo(()=> userId == primaryUserId ? true : false,[props?.userId])

    // @@ define useEffect
    useEffect(() => {
        if (burialCremationHORCemetryQuestions.length == 0 && $AHelper.$isNotNullUndefine(primaryUserId)) {
            fetchQuestionsWithFormLabelId()
        } else if (burialCremationHORCemetryQuestions?.length > 0 && $AHelper.$isNotNullUndefine(primaryUserId) && !$AHelper.$isNotNullUndefine(primaryCremationHORCemetryFormLabel)) {
            fetchResponseWithQuestionId(burialCremationHORCemetryQuestions, 1)
        }
        if (burialCremationHORCemetryQuestions?.length > 0 && $AHelper.$isNotNullUndefine(spouseUserId) && isPrimaryMemberMaritalStatus && !$AHelper.$isNotNullUndefine(spouseCremationHORCemetryFormLabel)) {
            fetchResponseWithQuestionId(burialCremationHORCemetryQuestions, 2)
        }
    }, [primaryUserId, spouseUserId, isPrimaryMemberMaritalStatus])

    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(primaryUserId)) {
            fetchPrimaryInsurance(updatePrimaryBurialInsuranceDetail)
        }
        if ($AHelper.$isNotNullUndefine(spouseUserId) && isPrimaryMemberMaritalStatus && isPrimaryMemberMaritalStatus) {
            fetchSpouseLifeInsurance(updateSpouseBurialInsuranceDetail)
        }
    }, [primaryUserId, spouseUserId, isPrimaryMemberMaritalStatus])

    // @@ fetch life insurance
    const fetchSpouseLifeInsurance = useCallback(() => {
        fetchInsurance(spouseUserId, updateSpouseBurialInsuranceDetail)
    }, [spouseUserId, isPrimaryMemberMaritalStatus])
    const fetchPrimaryInsurance = useCallback(() => {
        fetchInsurance(primaryUserId, updatePrimaryBurialInsuranceDetail)
    }, [primaryUserId])

    useImperativeHandle(ref,()=>({
        saveData,
    }))

    const fetchInsurance = (userId, dispatchMethod) => {
        return new Promise(async (resolve, reject) => {
            const _resultOfInsuranceDetail = await dispatch(fetchBurialLifeInsurance({ userId: userId }));
            const insDetails = _resultOfInsuranceDetail?.payload != 'err' ? _resultOfInsuranceDetail?.payload?.lifeInsurances : [];
            dispatch(dispatchMethod(insDetails))
            resolve('insDetails')
        })
    }

    // @@ fetch life insurance

    // @@ fetch questions list
    const fetchQuestionsWithFormLabelId = async () => {
        useLoader(true);
        const resultOf = await $ApiHelper.$getSujectQuestions(burialHorCemetryLabelId);
        useLoader(false);
        konsole.log("resultOfSubjectResponse", resultOf);
        dispatch(updateBurialHorCemetryMetaQuestions(resultOf))
        if (resultOf !== 'err' && resultOf.length > 0) {
            fetchResponseWithQuestionId(resultOf, 1)
            if ($AHelper.$isNotNullUndefine(spouseUserId) && isPrimaryMemberMaritalStatus) {
                fetchResponseWithQuestionId(resultOf, 2)
            }
        }
    }
    const fetchResponseWithQuestionId = async (questions, type) => {

        return new Promise(async (resolve, reject) => {
            konsole.log('questionslust', questions)
            let memberId = (type == 1) ? primaryUserId : spouseUserId;
            let topicId = 21

            konsole.log("memberIdmemberIdmemberId", memberId)
            let updateAnswerDispatch = type == 1 ? updatePrimaryBurialHorCemetryFormLabel : updateSpouseBurialHorCemetryFormLabel
            useLoader(true)
            const resultOfRes = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicId({ questions: questions, memberId: memberId, topicId: topicId });
            useLoader(false)
            konsole.log("resultOfResBurial", resultOfRes);
            const userSubjectsList = resultOfRes.userSubjects;
            const questionsList = questions
            konsole.log("userSubjectsList", userSubjectsList)
            if (questionsList.length > 0) {
                let formlabelData = {};
                for (let resObj of questions) {
                    let label = "label" + resObj.formLabelId;
                    formlabelData[label] = { ...resObj.question }; // Shallow copy of the question object

                    const filterQuestion = userSubjectsList?.filter((item) => item.questionId == resObj?.question?.questionId);
                    konsole.log("filterQuestion", userSubjectsList, resObj, filterQuestion);
                    if (filterQuestion?.length > 0) {
                        const resultOfResponse = filterQuestion[0];

                        // Iterate over the response array if it exists
                        if (formlabelData[label]?.response) {
                            formlabelData[label]["userSubjectDataId"] = resultOfResponse.userSubjectDataId;
                            formlabelData[label].response = formlabelData[label].response.map((response, i) => {
                                if (response.responseId == resultOfResponse?.responseId) {
                                    konsole.log("resultOfResponse?.responseNature", resultOfResponse?.responseNature)
                                    if (resultOfResponse?.responseNature == 'Radio') {
                                        return { ...response, 'checked': true };
                                    } else if (resultOfResponse?.responseNature == 'Text') {
                                        konsole.log("formlabelDatalabelresultOfResponse", resultOfResponse, response);
                                        return {
                                            ...response, response: resultOfResponse.response
                                        };
                                    }
                                }
                                return response;
                            });
                        }
                        formlabelData[label].userSubjectDataId = resultOfResponse.userSubjectDataId;
                    }
                }
                dispatch(updateAnswerDispatch(formlabelData))
                resolve('resolve')
            } else {
                resolve('resolve')
            }
        })
    }





    const saveData = async (type) => {
        konsole.log("spouseHorRef", spouseHorRef);
        konsole.log("primaryHorRef", primaryHorRef);

        let primaryUserSubjects = []
        let spouseUserSubjects = []


        // @@ validate Burial/Cremation
        const _burialValidate = await primaryBurialRef?.current?.burialValidate();
        const _cemeteryValidate = await primaryCemeteryRef?.current?.cemetryValidate();
        if(referencePage == 'agentdeathinfopage' && isPrimaryuser == true && (!_burialValidate || !_cemeteryValidate)){
            return false;
        }
        if (referencePage != 'agentdeathinfopage' && !_burialValidate) {
            openAccordian('1');        
            return;
        }
        if (referencePage != 'agentdeathinfopage' && !_cemeteryValidate) {
            openAccordian('2');            
            return;
        }
        if ($AHelper.$isNotNullUndefine(spouseUserId) && isPrimaryMemberMaritalStatus) {
            const _sburialValidte = await spouseBurialRef?.current?.burialValidate();
            const _cemeteryValidte = await spouseCemeteryRef?.current?.cemetryValidate();
            if (!_sburialValidte && referencePage != 'agentdeathinfopage') {
                openAccordian('1')                
                return;
            }
            if (!_cemeteryValidte && referencePage != 'agentdeathinfopage' ) {
                openAccordian('2')                
                return;
            }
        }

        // HOR
        const primaryHorJson = await primaryHorRef?.current?.horJson();
        // konsole.log("2232primaryHorJson", primaryHorJson);
        if (primaryHorJson?.length > 0) primaryUserSubjects.push(...primaryHorJson);

        //Burial
        const primaryBurialJson = await primaryBurialRef?.current?.burialJson();
        // konsole.log("144primaryHorJson", primaryBurialJson);
        // konsole.log("44primaryHorJson", primaryBurialJson, JSON.stringify(primaryBurialJson));
        if (primaryBurialJson?.length > 0) primaryUserSubjects.push(...primaryBurialJson);
        // Cemetery
        const primaryCemetryJson = await primaryCemeteryRef?.current?.cemeteryJson();
        // konsole.log("55primaryHorJson", primaryCemetryJson, JSON.stringify(primaryCemetryJson));
        if (primaryCemetryJson?.length > 0) primaryUserSubjects.push(...primaryCemetryJson);
        // @@ Spouse
        if ($AHelper.$isNotNullUndefine(spouseUserId) && isPrimaryMemberMaritalStatus) {
            const spouseHorJson = await spouseHorRef?.current?.horJson();
            if (spouseHorJson?.length > 0) spouseUserSubjects.push(...spouseHorJson);
            const spouseBurialJson = await spouseBurialRef?.current?.burialJson();
            if (spouseBurialJson?.length > 0) spouseUserSubjects.push(...spouseBurialJson);
            const spouseCemetryJson = await spouseCemeteryRef?.current?.cemeteryJson();
            if (spouseCemetryJson?.length > 0) spouseUserSubjects.push(...spouseCemetryJson);
        }

        let apiJson = []

        konsole.log("primaryUserSubjects", primaryUserSubjects, spouseUserSubjects);
        // @@primary json
        if (primaryUserSubjects.length > 0) {
            const filterToDeleteData=primaryUserSubjects?.filter((data)=>data.subResponseData==false)
            const filterToUpdate=primaryUserSubjects?.filter((data)=>(data.subResponseData==true || data.subResponseData.length>0))
            console.log("filterToDeleteDataBurial",filterToDeleteData,filterToUpdate)
            const jsonObj = { userId: primaryUserId, userSubjects: filterToUpdate }
            const newJsonToDelete=filterToDeleteData?.map(data=>({userSubjectDataId:data.userSubjectDataId}))
            apiJson.push(postApiCall('PUT', $Service_Url.putSubjectResponse, jsonObj));
            if(newJsonToDelete?.length>0){
                postApiCall("DELETE", $Service_Url.deleteSubjectUser+"?UserId="+primaryUserId, newJsonToDelete);
            }
        }  // @@spouse json
        if (spouseUserSubjects.length > 0) {
            const filterToDeleteData=spouseUserSubjects.filter((data)=>data.subResponseData==false)
            const filterToUpdate=spouseUserSubjects.filter((data)=>data.subResponseData==true || data.subResponseData.length>0)
            // console.log("filterToDeleteDataBurial",filterToDeleteData,filterToUpdate)
            const newJsonToDelete=filterToDeleteData?.map(data=>({userSubjectDataId:data.userSubjectDataId}))
            const jsonObj = { userId: spouseUserId, userSubjects: filterToUpdate }
            apiJson.push(postApiCall('PUT', $Service_Url.putSubjectResponse, jsonObj));
            if(newJsonToDelete?.length>0){
                postApiCall("DELETE", $Service_Url.deleteSubjectUser+"?UserId="+spouseUserId, newJsonToDelete);
            }
        }

        if (apiJson.length > 0) {
            useLoader(true)
            // const _resofOfSavedData = await Promise.all(apiJson.map(item => postApiCall('PUT', $Service_Url.putSubjectResponse, item)));
            const _resofOfSavedData = await Promise.all(apiJson);
            konsole.log("_resofOfSavedData", _resofOfSavedData)
            const callApi = []
            if (primaryUserSubjects.length > 0) { callApi.push(fetchResponseWithQuestionId(burialCremationHORCemetryQuestions, 1)) }
            if (spouseUserSubjects.length > 0) { callApi.push(fetchResponseWithQuestionId(burialCremationHORCemetryQuestions, 2)) }
            if (callApi.length > 0) {
                const _resofOfgetData = await Promise.all(callApi);
                konsole.log("_resofOfgetData", _resofOfgetData)
            }
            useLoader(false)
        }
        toasterAlert("successfully", "Successfully saved data", `Your data have been saved successfully.`);
        $AHelper.$scroll2Top()
        if (type == 'next') {
            handleNextTab()
        }
    }

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }

    konsole.log("resultOfSubjectResponseresultOfSubjectResponse", burialCremationHORCemetryQuestions, primaryCremationHORCemetryFormLabel, spouseCremationHORCemetryFormLabel)

    const handleAccordionClick = () => {
        setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
    };
    
    const handleAccordionBodyClick = (key) => {
        setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
        dispatch(updateAddressInputHeight(!adjustAddressInputHeight))
    };

    const openAccordian = ( id ) => {
        if(activeKeys?.some(ele => ele == id) == false) {
            setActiveKeys(oldState => [...oldState, id]);
        }
    }
    

    const mdxlUi = useMemo(() => {
        return {
            md: spouseUserId ? 6 : 10,
            xl: spouseUserId ? (primaryDetails?.maritalStatusId == 3 ? 12 : 6) : 10,
        };
        }, [spouseUserId, primaryDetails?.maritalStatusId]);
    
        const displaySpouseContent = useMemo(() => {
          let value = ((isPrimaryMemberMaritalStatus == true) || 
        ($AHelper.$isNotNullUndefine(spouseUserId)) && primaryDetails?.maritalStatusId == 4) ? true : false;
        return value;
        }, [isPrimaryMemberMaritalStatus, spouseUserId])

        // console.log("burialPrimaryLifeInsurance",burialPrimaryLifeInsurance)
    return (
        <>
            <div id='burialCremation' className='burialCremation' >
                <div>
                    {referencePage == 'agentdeathinfopage' ? <>
                    <div>
                        <h4 className="fs-16 fw-bold">Handling of remains</h4>
                        <hr />
                        { isPrimaryuser == true ? <HandlingOfRemains startTabIndex={1} ref={primaryHorRef} userId={primaryUserId} refrencePage='BurialHorCemetry' formlabelData={primaryCremationHORCemetryFormLabel} updateFormLabel={updatePrimaryBurialHorCemetryFormLabel} />
                        : <HandlingOfRemains startTabIndex={2 + 3} ref={spouseHorRef} userId={spouseUserId} refrencePage='BurialHorCemetry' formlabelData={spouseCremationHORCemetryFormLabel} updateFormLabel={updateSpouseBurialHorCemetryFormLabel} />}
                    </div>
                    <div>
                        <h4 className="fs-16 fw-bold">Burial / Cremation plan</h4>
                        <hr />
                        { isPrimaryuser == true ? <BurialCremationPlans startTabIndex={2 + 3 + 3} ref={primaryBurialRef} key='primary' userType='primary' userId={primaryUserId} refrencePage='BurialHorCemetry' formlabelData={primaryCremationHORCemetryFormLabel} updateFormLabel={updatePrimaryBurialHorCemetryFormLabel} lifeInsurance={burialPrimaryLifeInsurance} />
                        : <BurialCremationPlans startTabIndex={2 + 3 + 3 + 17} ref={spouseBurialRef} userId={spouseUserId} refrencePage='BurialHorCemetry' formlabelData={spouseCremationHORCemetryFormLabel} key='spouse' userType='spouse' lifeInsurance={burialSpouseLifeInsurance} updateFormLabel={updateSpouseBurialHorCemetryFormLabel} />}
                    </div>
                    <div>
                        <h4 className="fs-16 fw-bold">Cemetery arrangement</h4>
                        <hr />
                        { isPrimaryuser == true ? <Cemetery startTabIndex={2 + 3 + 3 + 17 + 17} ref={primaryCemeteryRef} key='primary' userId={primaryUserId} refrencePage='BurialHorCemetry' formlabelData={primaryCremationHORCemetryFormLabel} updateFormLabel={updatePrimaryBurialHorCemetryFormLabel}/>
                        : <Cemetery startTabIndex={2 + 3 + 3 + 17 + 17 + 8} ref={spouseCemeteryRef} userId={spouseUserId} refrencePage='BurialHorCemetry' formlabelData={spouseCremationHORCemetryFormLabel} key='spouse' updateFormLabel={updateSpouseBurialHorCemetryFormLabel}/>}
                    </div>
                    </>:
                    <CustomAccordion isExpendAllbtn={true}
                        handleActiveKeys={handleAccordionClick}
                        activeKeys={activeKeys}
                        allkeys={allkeys}
                        activekey={activeKeys}
                        header={<span className='heading-of-sub-side-links mt-5'><p className='mt-2'>Legal Information</p></span>}

                    >
                        <CustomAccordionBody eventkey='0' name='Handling of remains' setActiveKeys={() => handleAccordionBodyClick('0')}
                            header={$HandleOfRemainsPlaceholder?.content}
                            isHeader = {true}
                        >
                            {/* <HandlingOfRemains> */}

                            <Row className='mb-3'>
                                <Col xs={12} md={12} xl={12}>
                                    <Row className='d-none d-md-flex'>
                                        {isPrimaryMemberMaritalStatus &&
                                            <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi} isGap={true} />
                                        }
                                    </Row>
                                    <Row className='d-flex gap-2'>
                                        <Col>
                                            {primaryCremationHORCemetryFormLabel &&
                                                <HandlingOfRemains startTabIndex={1} ref={primaryHorRef} key='primary' userId={primaryUserId} refrencePage='BurialHorCemetry' formlabelData={primaryCremationHORCemetryFormLabel} updateFormLabel={updatePrimaryBurialHorCemetryFormLabel} />
                                            }
                                        </Col>
                                        {($AHelper.$isNotNullUndefine(spouseUserId) && isPrimaryMemberMaritalStatus) &&
                                            <Col>
                                                {(spouseCremationHORCemetryFormLabel) &&
                                                    <HandlingOfRemains startTabIndex={2 + 3} ref={spouseHorRef} userId={spouseUserId} refrencePage='BurialHorCemetry' formlabelData={spouseCremationHORCemetryFormLabel} key='spouse' updateFormLabel={updateSpouseBurialHorCemetryFormLabel} />}
                                            </Col>}
                                    </Row>
                                    {/* <Row>
                                        <BurialHorDocumentUpload details={{ 'heading': "Handling of remains" }} FileTypeId={60} FileStatusId={1} useFor='HOR' FileCategoryId={13} />
                                    </Row> */}
                                </Col>
                            </Row>

                            {/* </HandlingOfRemains> */}

                        </CustomAccordionBody>
                        <CustomAccordionBody eventkey='1' name='Burial / Cremation plan' setActiveKeys={() => handleAccordionBodyClick('1')}
                        header={$BurialCremationPlaceholder?.content}
                        isHeader = {true}
                        >
                            <Row className='mb-3'>
                                <Col xs={12} md={12} xl={12}>
                                    <Row className='d-none d-md-flex'>                                   
                                        {isPrimaryMemberMaritalStatus &&
                                            <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi} isGap={true} />
                                        }
                                    </Row>
                                    <div className='mt-2' style={{display:"flex", gap:"20px"}}>
                                        <div className='m-1 w-50'>
                                            {primaryCremationHORCemetryFormLabel &&
                                                <BurialCremationPlans startTabIndex={2 + 3 + 3} ref={primaryBurialRef} key='primary' userType='primary' userId={primaryUserId} refrencePage='BurialHorCemetry' formlabelData={primaryCremationHORCemetryFormLabel} updateFormLabel={updatePrimaryBurialHorCemetryFormLabel} lifeInsurance={burialPrimaryLifeInsurance} />
                                            }
                                        </div>
                                        {($AHelper.$isNotNullUndefine(spouseUserId) && isPrimaryMemberMaritalStatus) &&
                                            <div className='m-1 w-50'>
                                                {(spouseCremationHORCemetryFormLabel) &&
                                                    <BurialCremationPlans startTabIndex={2 + 3 + 3 + 17} ref={spouseBurialRef} userId={spouseUserId} refrencePage='BurialHorCemetry' formlabelData={spouseCremationHORCemetryFormLabel} key='spouse' userType='spouse' lifeInsurance={burialSpouseLifeInsurance} updateFormLabel={updateSpouseBurialHorCemetryFormLabel} />}
                                            </div>}
                                    </div>
                                </Col>
                            </Row>
                        </CustomAccordionBody>
                        <CustomAccordionBody eventkey='2' name='Cemetery arrangement' setActiveKeys={() => handleAccordionBodyClick('2')} 
                         header={$CemetryAggrimentPlaceholder?.content}
                         isHeader = {true}    
                        >
                            <Row className='mb-3'>
                                <Col xs={12} md={12} xl={12}>
                                    <Row className='d-none d-md-flex'>
                                        {isPrimaryMemberMaritalStatus &&
                                            <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi} isGap={true} />
                                        }
                                    </Row>
                                    <Row className='mt-2'>
                                        <Col className='m-1 burialhorcemetryCustomCol'>
                                            {primaryCremationHORCemetryFormLabel &&
                                                <Cemetery startTabIndex={2 + 3 + 3 + 17 + 17} ref={primaryCemeteryRef} key='primary' userId={primaryUserId} refrencePage='BurialHorCemetry' formlabelData={primaryCremationHORCemetryFormLabel} updateFormLabel={updatePrimaryBurialHorCemetryFormLabel}/>
                                            }
                                        </Col>
                                        {($AHelper.$isNotNullUndefine(spouseUserId) && isPrimaryMemberMaritalStatus) &&
                                            <Col className='m-1 burialhorcemetryCustomCol'>
                                                {(spouseCremationHORCemetryFormLabel) &&
                                                    <Cemetery startTabIndex={2 + 3 + 3 + 17 + 17 + 8} ref={spouseCemeteryRef} userId={spouseUserId} refrencePage='BurialHorCemetry' formlabelData={spouseCremationHORCemetryFormLabel} key='spouse' updateFormLabel={updateSpouseBurialHorCemetryFormLabel}/>}
                                            </Col>}
                                    </Row>
                                    {/* <Row>
                                        <BurialHorDocumentUpload details={{ 'heading': "Cemetery arrangement" }} FileTypeId={62} FileStatusId={1} useFor='Cemetery' FileCategoryId={13} />
                                    </Row> */}
                                </Col>
                            </Row>
                        </CustomAccordionBody>
                    </CustomAccordion>}
                </div>
            </div>
            {referencePage != 'agentdeathinfopage' && <Row style={{ marginTop: '24px' }} className='mb-3'>
                <div className='d-flex justify-content-between'>
                    <CustomButton2 tabIndex={2 + 3 + 3 + 17 + 17 + 8 + 8} label="Save & Continue later" onClick={() => saveData('later')} />
                    <div>
                        <CustomButton tabIndex={2 + 3 + 3 + 17 + 17 + 8 + 8 + 1} label={'Next : Legal Professionals'} onClick={() => saveData('next')} />
                    </div>
                </div>
            </Row>}
        </>
    );
})
export default BurialHorCemetry;
