import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { postApiCall } from '../../../../components/Reusable/ReusableCom'
import { $Service_Url } from '../../../../components/network/UrlPath'
import { $ApiHelper } from '../../../Helper/$ApiHelper'
import konsole from '../../../../components/control/Konsole'
import usePrimaryUserId from '../../../Hooks/usePrimaryUserId'
import { useAppDispatch, useAppSelector } from '../../../Hooks/useRedux'
import { selectSubjectData } from '../../../Redux/Store/selectors'
import { $AHelper } from '../../../Helper/$AHelper';
import { updateFutureExpectionsSubjectQuestion, updateFutureExpectionsSubjectResponse } from '../../../Redux/Reducers/subjectDataSlice'
import { CustomCheckBox, CustomCurrencyInput, CustomRadioSignal } from '../../../Custom/CustomComponent';
import { CustomButton, CustomButton2 } from '../../../Custom/CustomButton';
import { useLoader } from '../../../utils/utils';
import { $JsonHelper } from '../../../Helper/$JsonHelper';
import { futureExpectation } from '../../../../components/control/Constant';
import { globalContext } from '../../../../pages/_app';
import { HeaderOfPrimarySouseName } from '../../../Personal-Information/PersonalInformation';

export const isContentFuture = `Please provide details about your future financial goals and expectations.`
const FutureExpections = (props) => {

    const { handleActiveTab, activeTab } = props;
    const { setConfirmation, confirm, setWarning } = useContext(globalContext)
    const [isUpdating, setIsUpdating] = useState(false);
    const subjectData = useAppSelector(selectSubjectData);
    const { futureExpectationQuestion, futureExpectionFormLabel } = subjectData;
    const { primaryMemberFullName, spouseFullName, spouseDetails, primaryUserId, spouseUserId, primaryDetails, _spousePartner, isPrimaryMemberMaritalStatus,primaryMemberFirstName,spouseFirstName, } = usePrimaryUserId()
    const dispatch = useAppDispatch();

    // @@ state define
    const [ques887, setQues887] = useState({});
    const [ques888, setQues888] = useState({});
    const [ques920, setQues920] = useState({});
    const [ques921, setQues921] = useState({});
    const [ques922, setQues922] = useState({});
    const [ques924, setQues924] = useState({});

    konsole.log("ques887", ques887, "ques888", ques888, "ques920", ques920, "ques921", ques921, "ques922", ques922, "ques924", ques924)
    // define useEffect
    useEffect(() => {
        if (futureExpectationQuestion?.length == 0 && $AHelper.$isNotNullUndefine(primaryUserId)) {
            fetchQuestionsWithFormLabelId()
        } else if (futureExpectationQuestion?.length > 0 && $AHelper.$isNotNullUndefine(primaryUserId) && !$AHelper.$isNotNullUndefine(futureExpectionFormLabel)) {
            fetchResponseWithQuestionId(futureExpectationQuestion)
        }
        setIsUpdating(futureExpectionFormLabel?.label887?.response?.some(res => res?.response));
    }, [futureExpectationQuestion, primaryUserId]);

    // @@ fetch questions list
    const fetchQuestionsWithFormLabelId = async () => {
        useLoader(true);
        const resultOf = await $ApiHelper.$getSujectQuestions(futureExpectation?.formLabelId);
        useLoader(false);
        konsole.log("resultOfSubjectResponse", resultOf);
        dispatch(updateFutureExpectionsSubjectQuestion(resultOf))
        if (resultOf !== 'err' && resultOf.length > 0) {
            fetchResponseWithQuestionId(resultOf)
        }
    }
    // @@ fetch answer list
    const fetchResponseWithQuestionId = async (questions) => {
        konsole.log("questions", questions);
        // let formlabelData = {}
        useLoader(true);
        const resultOfRes = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicId({topicId:9, memberId: primaryUserId, questions: questions })
        useLoader(false);
        konsole.log("resultOfRes", resultOfRes);
        const questionRespons = resultOfRes?.userSubjects;
        konsole.log("questionRespons", questionRespons);


        let isUpdate = questionRespons?.length > 0 ? true : false;
        setIsUpdating(isUpdate)

        let formlabelData = {};
        useLoader(true);
        for (let resObj of questions) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = { ...resObj.question }; // Shallow copy of the question object
            const filterQuestion = questionRespons?.filter((item) => item.questionId == resObj?.question?.questionId);
            konsole.log("filterQuestion", questionRespons, resObj, filterQuestion);

            if (filterQuestion.length > 0) {
                const resultOfResponse = filterQuestion[0];
                // Iterate over the response array if it exists
                if (formlabelData[label]?.response) {
                    formlabelData[label]["userSubjectDataId"] = resultOfResponse.userSubjectDataId;
                    formlabelData[label].response = formlabelData[label].response.map((response, i) => {
                        if (response.responseId == resultOfResponse?.responseId) {
                            if (resultOfResponse?.responseNature == 'Radio') {
                                return {
                                    ...response, 'checked': true
                                };
                            } else if (resultOfResponse?.responseNature == 'Text') {
                                 const repsonseValue=isNaN(Number(resultOfResponse?.response))?resultOfResponse?.response:  $AHelper.$forIncomewithDecimal(resultOfResponse?.response);
                                    konsole.log("repsonseValue",repsonseValue)
                                return {
                                    ...response, response: repsonseValue
                                };
                            }
                        }
                        return response;
                    });
                }
                // Assign userSubjectDataId if applicable
                if (resultOfResponse?.responseNature == 'Radio') {
                    formlabelData[label].userSubjectDataId = resultOfResponse.userSubjectDataId;
                }
            }
        }
        useLoader(false);
        konsole.log("formlabelData", formlabelData)
        dispatch(updateFutureExpectionsSubjectResponse(formlabelData))
    }
    // @@ DATA SAVE AND UPDATE
    const handleSave = async (type) => {

        let userSubject = []
        if ($AHelper.$objectvalidation(ques887)) {
            userSubject.push(ques887)
        }
        if ($AHelper.$objectvalidation(ques888)) {
            userSubject.push(ques888)
        }
        if ($AHelper.$objectvalidation(ques920)) {
            userSubject.push(ques920)
        }
        if ($AHelper.$objectvalidation(ques921)) {
            userSubject.push(ques921)
        }
        if ($AHelper.$objectvalidation(ques922)) {
            userSubject.push(ques922)
        }
        if ($AHelper.$objectvalidation(ques924)) {
            userSubject.push(ques924)
        }
        konsole.log("userSubjectjsonObj", userSubject)
        useLoader(true);
        if (userSubject.length > 0) {
            const jsonObj = { userId: primaryUserId, userSubjects: userSubject }
            konsole.log("userSubjectjsonObj", jsonObj);
            const resultOfsubjectsData = await postApiCall('PUT', $Service_Url.putSubjectResponse, jsonObj)
            if (resultOfsubjectsData != 'err') {
                // api call for getting response
                fetchResponseWithQuestionId(futureExpectationQuestion);
            }
        }
        setIsUpdating(true)
        useLoader(false);
        let newTab = type == 'next' ? 4 : activeTab;
        // messages
        {
            toasterAlert("successfully", `Successfully ${isUpdating ? 'updated': 'saved'} data`, `Your data have been ${isUpdating ? 'updated' : 'saved'} successfully`);
        }
        if(type != "later") handleActiveTab(newTab);
        handleCrearAll();
    }
    const handleCrearAll = () => {
        setQues887({})
        setQues888({})
        setQues920({})
        setQues921({})
        setQues922({})
        setQues924({})
    }

    // @@ handle checkbox
    const handleCheckBox = (e, labelData, label, setState, type) => {

        const isChecked = e.target.checked;
        const responseId = e.target.id
        const userSubjectDataId = (labelData?.userSubjectDataId) ? labelData?.userSubjectDataId : 0;
        const questionId = labelData?.questionId;
        konsole.log("futureExpectionFormLabel", labelData, futureExpectionFormLabel)
        handleSetState(label, responseId, isChecked, type);
        let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: isChecked, userId: primaryUserId })
        setState(json)
    }

    // handle input
    const handleCurrencyInput = (e, labelData, label, setState) => {
        konsole.log('handleCurrencyInput', e)
        let value = e.value;
        const responseId = e.id
        const userSubjectDataId = (labelData?.userSubjectDataId) ? labelData?.userSubjectDataId : 0;
        const questionId = labelData?.questionId;

        handleSetState(label, responseId, value);
        let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: value, userId: primaryUserId })
        konsole.log("jsonjson", json)
        setState(json)

    }

    // @@ handle globaly state
    const handleSetState = (label, responseId, value, type) => {
        const formLabelInformation = { ...futureExpectionFormLabel };
        const selectedLabelValue = { ...formLabelInformation[label] };
        konsole.log("selectedLabelValue", selectedLabelValue, selectedLabelValue)
        selectedLabelValue.response = selectedLabelValue.response?.map(response => {
            if (response.responseId == responseId) {
                konsole.log('responseresponse', response);
                if (type !== 'Radio') {
                    return { ...response, response: value };
                } else {
                    return { ...response, checked: value };
                }
            } else if (type == 'Radio') {
                return { ...response, checked: false };
            }
            return response;
        });;

        formLabelInformation[label] = selectedLabelValue;
        konsole.log("formLabelInformation", formLabelInformation);
        dispatch(updateFutureExpectionsSubjectResponse(formLabelInformation))
    }
    // Question label of 887
    const returnIsCheckedPrimary = useMemo(() => {
        let isChecked = false
        if (futureExpectionFormLabel?.label887?.response.length > 0) {
            isChecked = futureExpectionFormLabel?.label887?.response[0].response == true || futureExpectionFormLabel?.label887?.response[0].response == 'true'
        }
        return isChecked;
    }, [futureExpectionFormLabel])

    const returnIsCheckedSpouse = useMemo(() => {
        let isChecked = false
        if (futureExpectionFormLabel?.label924?.response?.length > 0) {
            isChecked = futureExpectionFormLabel?.label924?.response[0].response == true || futureExpectionFormLabel?.label924?.response[0].response == 'true'
        }
        return isChecked;
    }, [futureExpectionFormLabel])


    const isQuestion922show = useMemo(() => {
        if (futureExpectionFormLabel?.label922 && futureExpectionFormLabel?.label888?.response?.find((item) => item?.response == 'Yes')?.checked == true) {
            return true
        }
        return false;
    }, [futureExpectionFormLabel])


    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
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
    
    // @@ konsole

    konsole.log("isQuestion922show", isQuestion922show)
    konsole.log("subjectData", subjectData);
    konsole.log("futureExpectionFormLabel", futureExpectionFormLabel, futureExpectionFormLabel?.label888)

    return (
        <>
            <div style={{borderBottom: '1px solid #F0F0F0'}}></div>
            <div className='mt-2'><span className="heading-of-sub-side-links-2 mt-2">View and add your Future Expectations here</span></div>
            <div className='d-flex flex-column h-100'>
            <Row id='future-expections' className='future-expections mb-3' >
                <Col xs={12} md={12} xl={3}>
                    <div className="heading-of-sub-side-links-2 mt-3">{isContentFuture}</div>
                </Col>
                <Col xs={12} md={12} xl={9} className=''>
                    <Row className='d-none d-md-flex mt-2'>
                         {isPrimaryMemberMaritalStatus &&
                  <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi} isGap={true} />
                }
                    </Row>
                    <Row className='d-flex mt-3'>
                        {/* @@  Primary Member  */}
                        <Col xs={12} md={6} xl={6}>
                            <span className='question-heading '>{futureExpectionFormLabel?.label887?.question}</span>
                                <div className='mt-2'>
                                    {futureExpectionFormLabel?.label887?.response?.map((item) => {
                                        konsole.log("itemitemPrimary", item);
                                        const isChecked = (item.response == 'true' || item.response == true) ? true : false
                                        return <>
                                            <CustomCheckBox tabIndex={1} label={`${primaryMemberFirstName} (Primary)`} name={item?.response} id={item?.responseId}
                                                value={isChecked} onChange={(e) => handleCheckBox(e, futureExpectionFormLabel?.label887, 'label887', setQues887)}
                                            />
                                        </>
                                    })}
                                </div>
                                {(returnIsCheckedPrimary == true) && <>
                                    {futureExpectionFormLabel?.label920 && futureExpectionFormLabel?.label920?.response?.map((item, index) => {
                                        return <>
                                            <Row className='p-2 box' style={{margin:"10px 0px"}}>
                                                <CustomCurrencyInput tabIndex={2}  name='balance' isError='' label='Value of inheritance amount' id='balance'
                                                    value={item?.response} onChange={(e) => handleCurrencyInput({ id: item?.responseId, value: e }, futureExpectionFormLabel?.label920, 'label920', setQues920)} />
                                            </Row>
                                        </>
                                    })}
                                </>}
                            {/* </div> */}
                        </Col>
                        {/* @@ SPOUSE and Partner Section */}
                        {(isPrimaryMemberMaritalStatus) &&
                            <Col xs={12} md={6} xl={6}>
                                <span className='question-heading '>{futureExpectionFormLabel?.label887?.question}</span>
                                {(futureExpectionFormLabel?.label924 && $AHelper.$isNotNullUndefine(spouseUserId) && $AHelper.$isMarried(primaryDetails?.maritalStatusId)) &&
                                    <div>
                                        <div className='mt-2'>
                                            {futureExpectionFormLabel?.label924?.response?.map((item) => {
                                                konsole.log("itemitemSpouse", item)
                                                const isChecked = (item?.response == 'true' || item.response == true) ? true : false
                                                return <>
                                                    <CustomCheckBox tabIndex={3}  name={item?.response} id={item?.responseId} value={isChecked}
                                                        label={`${spouseFirstName} (${$AHelper.capitalizeFirstLetterFirstWord(_spousePartner)})`}
                                                        onChange={(e) => handleCheckBox(e, futureExpectionFormLabel?.label924, 'label924', setQues924)}
                                                    />
                                                </>
                                            })}
                                        </div>
                                        {/* @@ Value of inheritance amount' For Spouse */}
                                        {(returnIsCheckedSpouse == true) && <>
                                            {futureExpectionFormLabel?.label921 && futureExpectionFormLabel?.label921?.response?.map((item, index) => {
                                                return <>
                                                    <Row className='box p-2' style={{margin:"10px 0px"}}>
                                                        <CustomCurrencyInput tabIndex={4}  name='balance' isError='' label='Value of inheritance amount' id='balance' value={item?.response}
                                                            onChange={(e) => handleCurrencyInput({ id: item?.responseId, value: e }, futureExpectionFormLabel?.label921, 'label921', setQues921)} />
                                                    </Row>
                                                </>
                                            })}
                                        </>}
                                    </div>
                                }
                            </Col>
                        }
                    </Row>
                </Col>
            </Row>
            <Row className='mt-auto'>
                <Row style={{ marginTop: '24px' }} className='mb-3'>
                    <div className='d-flex justify-content-between'>
                        <CustomButton2 tabIndex={5}  label={isUpdating ? "Update & Continue later" : "Save & Continue later"} onClick={() => handleSave('later')} />
                        <CustomButton  tabIndex={6}  label={`Next: Liabilities`} onClick={() => handleSave('next')} />
                    </div>
                </Row>
            </Row>
            </div>
        </>
    )
}

export default FutureExpections
