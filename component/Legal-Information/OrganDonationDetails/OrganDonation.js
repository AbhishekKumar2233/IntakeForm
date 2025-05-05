import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { Row, Col } from 'react-bootstrap';
import { $AHelper } from '../../Helper/$AHelper';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { isContent } from '../../Personal-Information/PersonalInformation';
import { aGifts } from '../../../components/control/Constant';
import { useAppSelector, useAppDispatch } from '../../Hooks/useRedux';
import { selectSubjectData } from '../../Redux/Store/selectors';
import { $ApiHelper } from '../../Helper/$ApiHelper';
import { useLoader } from '../../utils/utils';
import konsole from '../../../components/control/Konsole';
import { getApiCall, postApiCall } from '../../../components/Reusable/ReusableCom';
import { updateOrganDonationQuestion, updatePrimaryOrganDonationFormLabel, updateSpouseOrganDonationFormLabel } from '../../Redux/Reducers/subjectDataSlice';
import { CustomRadioSignal } from '../../Custom/CustomComponent';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { $Service_Url } from '../../../components/network/UrlPath';
import { $OrganDonationPlaceholder } from '../../Helper/$MsgHelper';

const OrganDonation = forwardRef((props, ref) => {
    const { userId, activeTab } = props;
    const dispatch = useAppDispatch();
    const subjectData = useAppSelector(selectSubjectData);
    const { organDonationQuestion, primaryOrganDonationFormLabel, spouseOrganDonationFormLabel } = subjectData;
    // @@ define state
    const [ques459, setQues459] = useState({});
    const [ques460, setQues460] = useState({});
    const startingTabIndex = props?.startTabIndex ?? 0;

    konsole.log("ques459ques459", ques459, ques460)
    // selected answer list
    const answersList = useMemo(() => {
        return activeTab == 1 ? primaryOrganDonationFormLabel : spouseOrganDonationFormLabel;
    }, [activeTab, primaryOrganDonationFormLabel, spouseOrganDonationFormLabel])

    // define useEffect
    useEffect(() => {
        if (organDonationQuestion?.length == 0 && $AHelper.$isNotNullUndefine(userId)) {
            fetchQuestionsWithFormLabelId()
        } else if (organDonationQuestion?.length > 0 && $AHelper.$isNotNullUndefine(userId) && !$AHelper.$isNotNullUndefine(answersList)) {
            fetchResponseWithQuestionId(organDonationQuestion)
        }
    }, [userId, answersList])

    // @@ useImperative Handle
    useImperativeHandle(ref, () => ({
        saveData
    }));

    // @@ fetch questions list
    const fetchQuestionsWithFormLabelId = async () => {
        useLoader(true);
        const resultOf = await $ApiHelper.$getSujectQuestions(aGifts.formLabelId);
        useLoader(false);
        konsole.log("resultOfSubjectResponse", resultOf);
        dispatch(updateOrganDonationQuestion(resultOf))
        if (resultOf !== 'err' && resultOf.length > 0) {
            fetchResponseWithQuestionId(resultOf)
        }
    }

    // @@ fetch answer list
    const fetchResponseWithQuestionId = async (questions) => {
        konsole.log("questions", questions);
        // let formlabelData = {}
        useLoader(true);
        const resultOfRes = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicId({ memberId: userId, questions: questions,topicId:20 })
        useLoader(false);
        konsole.log("resultOfRes", resultOfRes);
        const questionRespons = resultOfRes?.userSubjects
        konsole.log("questionRespons", questionRespons)

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
                                return { ...response, 'checked': true };
                            }
                        }
                        return response;
                    });
                }
                // Assign userSubjectDataId if applicable
                formlabelData[label].userSubjectDataId = resultOfResponse.userSubjectDataId;
            }
        }
        useLoader(false);
        konsole.log("formlabelData", formlabelData)
        handleUpdateDispatch(formlabelData)
    }

    // @@SATA SAVE
    const saveData = () => {
        return new Promise(async (resolve, reject) => {

            let userSubject = []
            if ($AHelper.$objectvalidation(ques459)) {
                userSubject.push(ques459)
            }
            if ($AHelper.$objectvalidation(ques460)) {
                userSubject.push(ques460)
            }
            if (userSubject.length == 0) {
                resolve('no-data')
            } else {
                const filterToDeleteData=userSubject.filter((data)=>data.subResponseData==false)
                const filterToUpdate=userSubject.filter((data)=>data.subResponseData==true)
                const newJsonToDelete=filterToDeleteData?.map(data=>({userSubjectDataId:data.userSubjectDataId}))
                // konsole.log("filterToDeleteData",filterToDeleteData,"filterToUpdate",filterToUpdate)
                // konsole.log("newJsonToDelete",newJsonToDelete)
                const jsonObj = { userId: userId, userSubjects: filterToUpdate }
                konsole.log('jsonObjOrgan', jsonObj)
                if(newJsonToDelete?.length>0){
                    await postApiCall("DELETE", $Service_Url.deleteSubjectUser+"?UserId="+userId, newJsonToDelete);
                }
                const resultOfsubjectsData = await postApiCall('PUT', $Service_Url.putSubjectResponse, jsonObj)
                if (resultOfsubjectsData != 'err') {
                    fetchResponseWithQuestionId(organDonationQuestion)
                }
                resolve(resultOfsubjectsData)
            }
        })
    }

    // @@ habdle change radio
    const handleChange = (e, labelData, label, setState, type) => {
        const isChecked = e.target.checked;
        const responseId = e.target.id
        const userSubjectDataId = (labelData?.userSubjectDataId) ? labelData?.userSubjectDataId : 0;
        const questionId = labelData?.questionId;

        konsole.log("responseId", responseId, isChecked)
        handleSetState(label, responseId, isChecked);
        let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: isChecked, userId: userId })
        konsole.log("jsonjson", json)
        setState(json)
        if (responseId == 104) {
            handleChangeRadio(isChecked)
        }
    }

    // @@ handle change radio for 106 ,460
    const handleChangeRadio = (isChecked) => {
        let labelData = answersList?.label460
        let responseId = labelData?.response?.find((item) => item?.response == 'No')?.responseId
        const userSubjectDataId = (labelData?.userSubjectDataId) ? labelData?.userSubjectDataId : 0;
        const questionId = labelData?.questionId;
        konsole.log("responseId2", responseId, isChecked)
        let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: isChecked, userId: userId })
        setQues460(json)
    }

    // @@ handle globaly state
    const handleSetState = (label, responseId, value, type) => {

        const formLabelInformation = { ...answersList };
        const selectedLabelValue = { ...answersList[label] };
        konsole.log("selectedLabelValue", selectedLabelValue, selectedLabelValue)
        selectedLabelValue.response = selectedLabelValue.response?.map(response => {
            if (response.responseId == responseId) {
                return { ...response, checked: value };
            } else if (response.responseId != responseId) {
                return { ...response, checked: false };
            }
            return response;
        });
        if (responseId == 104) {
            const selectedLabelValue = { ...answersList?.label460 };
            let responseId = 107
            selectedLabelValue.response = selectedLabelValue.response?.map(response => {
                if (response.responseId == responseId) {
                    return { ...response, checked: value };
                } else if (response.responseId != responseId) {
                    return { ...response, checked: false };
                }
                return response;
            });;
            formLabelInformation['label460'] = selectedLabelValue;
        }
        // Handle auto label 460  if 459 Yes then auto set no
        formLabelInformation[label] = selectedLabelValue;
        konsole.log("formLabelInformation", formLabelInformation);
        handleUpdateDispatch(formLabelInformation)
    }
    // @@ handle Disptch
    const handleUpdateDispatch = (information) => {
        if (activeTab == 1) {
            dispatch(updatePrimaryOrganDonationFormLabel(information))
        } else if (activeTab == 2) {
            dispatch(updateSpouseOrganDonationFormLabel(information))
        }
    }
    // @@ check disable radio or not
    const disableQues460 = useMemo(() => {
        if (answersList?.label459 && answersList?.label459?.response?.find((item) => item?.response == 'Yes')?.checked == true) {
            return true
        }
        return false;
    }, [answersList]);

    konsole.log("disableQues460", disableQues460)
    return (
        <>
            <Row className='mb-3'>
                {/* <Col xs={12} md={12} xl={4}>
                    <div className="content-placeholder">{$OrganDonationPlaceholder?.content}</div>
                </Col> */}
                {/* <Col xs={12} md={12} xl={8}> */}
                    <p className='organ-donor-heading'>Please identify your choices for organ donation.</p>
                    {(answersList?.label459) &&
                        <div className={"radio-container w-100  d-block"}>
                            <p className='mb-1'>{answersList?.label459?.question}</p>
                            <div className="mt-2 d-flex gap-1">
                                {answersList?.label459?.response?.map((item, index) => {
                                    konsole.log("itemitemalue", answersList?.label459, item);
                                    let isChecked = item?.checked == true ? true : ''
                                    return <>
                                        <CustomRadioSignal tabIndex={startingTabIndex + 1} key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                                            onChange={(e) => handleChange(e, answersList?.label459, 'label459', setQues459, 'Radio')}
                                        />
                                    </>
                                })}
                            </div>
                        </div>
                    }
                    {(answersList?.label460) &&
                        <div className={"radio-container w-100 d-block"}>
                            <p className='mb-1'>{answersList?.label460?.question}</p>
                            <div className="mt-2 d-flex gap-1">
                                {answersList?.label460?.response?.map((item, index) => {
                                    konsole.log("itemitemalue", answersList?.label460, item);
                                    let isChecked = item?.checked ? true : ''
                                    return <>
                                        <CustomRadioSignal tabIndex={startingTabIndex + 2}  key={index} name={index} value={isChecked} disabled={disableQues460} id={item?.responseId} label={item.response}
                                            onChange={(e) => handleChange(e, answersList?.label460, 'label460', setQues460, 'Radio')}
                                        />
                                    </>
                                })}

                            </div>
                        </div>
                    }
                {/* </Col> */}
            </Row>
        </>
    )
})

export default OrganDonation
