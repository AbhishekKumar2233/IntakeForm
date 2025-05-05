import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { isNotValidNullUndefile, postApiCall } from '../../../components/Reusable/ReusableCom';
import { $AHelper } from '../../Helper/$AHelper';
import { $Service_Url } from '../../../components/network/UrlPath';
import konsole from '../../../components/control/Konsole';
import { CustomInput, CustomNumInput, CustomRadio } from '../../Custom/CustomComponent';
import { useLoader } from '../../utils/utils';
import { $ApiHelper } from '../../Helper/$ApiHelper';
import { Col, Row } from 'react-bootstrap';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';

const ProfessionalMetaData = forwardRef(( props, ref ) => {
    const formLabels = useMemo(() => (props?.referPage == "iDontHave") ? props.formLabels?.slice(1) : props.formLabels, [props.formLabels]);
    const currentUserId = props.userId;
    const [formQuestions, setformQuestions] = useState({});
    const [formResponse, setformResponse] = useState({});
    const { primaryDetails, primaryMemberFullName, spouseDetails, spouseFullName, isPrimaryMemberMaritalStatus } = usePrimaryUserId();
    const dontShowPrevResp = props.referPage == 'iDontHave';
    const startingTabIndex = props?.startTabIndex ?? 0;

    useEffect(() => {
        if(formLabels?.length) fetchQuestions();
    }, [formLabels, currentUserId]);

    useImperativeHandle(ref, () => ({
        upsertMetaData,
    }))
    
    const fetchQuestions = async () => {
        useLoader(true)
        const response = await $ApiHelper.$getSujectQuestions(formLabels);
        useLoader(false)
        if(response != "err") {
            const result = response?.reduce((TempResult, curElement) => {
                if(curElement) TempResult["label" + curElement.formLabelId] = curElement;
                konsole.log("sdbkjv", TempResult, curElement);
                return TempResult;
            }, {});
            
            konsole.log("sdbkjv", result);
            setformQuestions(result);

            fetchUserResponses(response);
        }
        else setformQuestions({});
    }

    const fetchUserResponses = async ( _formQuestions ) => {
        useLoader(true)
        if(currentUserId) var response = await $ApiHelper.$getSubjectResponseWithQuestions({ memberId: currentUserId, questions: _formQuestions });
        useLoader(false)
        konsole.log("wedas", response, _formQuestions);

        const userReponse = response?.questionResponse;
        const _formResponse = _formQuestions?.reduce(( tempResult, ele ) => {
            const correspondingResponse = userReponse?.find(ele2 => ele2.subjectId == ele.subjectId);
            konsole.log("dabhjvb", tempResult, ele);
            return {
                ...tempResult,
                [ele.subjectId]: {
                    responseId: dontShowPrevResp ? undefined : correspondingResponse?.responseId ?? "", 
                    subResponseData: dontShowPrevResp ? '' : correspondingResponse?.response ?? "",
                    subjectId: ele?.subjectId, 
                    userId: currentUserId, 
                    userSubjectDataId: correspondingResponse?.userSubjectDataId ?? ""
                }
            }
        }, {})
        setformResponse(_formResponse);
        konsole.log("adsfas", _formResponse);
    }

    const upsertMetaData = ( forUserId ) => {
        const allSubjects = Object.values(formResponse);
        const postUserSubjects = {
            userId: forUserId,
            userSubjects: allSubjects?.filter(ele => isNotValidNullUndefile(ele.userSubjectDataId) && isNotValidNullUndefile(ele.responseId))
        }
        const saveUserSubjects = allSubjects?.filter(ele => isNotValidNullUndefile(ele.userSubjectDataId) == false && ele.responseId)?.map(ele => ({
            ...ele, 
            userId: forUserId,
            userSubjectDataId: undefined
        }));

        const filterDeselectedArray=allSubjects?.filter(ele=>ele?.userSubjectDataId!="" && ele.subResponseData==undefined)
        if(filterDeselectedArray?.length>0){
            const filteruserSubjectDataId=filterDeselectedArray.map((data)=>data.userSubjectDataId).filter(Boolean)
            const newJsonoDelete=filteruserSubjectDataId.map(data=>
            ({...data,
              userSubjectDataId:data})    
            )
            // console.log("filteruserSubjectDataIdfilteruserSubjectDataId",filteruserSubjectDataId,newJsonoDelete)
            postApiCall("DELETE", $Service_Url.deleteSubjectUser+"?UserId="+currentUserId, newJsonoDelete);
        }
        // console.log("filterDeselectedArray")

        if(postUserSubjects?.userSubjects?.length) {
            postApiCall("PUT", $Service_Url.putSubjectResponse, postUserSubjects);
        }

        if(saveUserSubjects?.length) {
            postApiCall("POST", $Service_Url.postaddusersubjectdata, saveUserSubjects);
        }

        konsole.log("dabjkvbk", postUserSubjects, saveUserSubjects)
    }

    const handleChange = ( subjectId, responseId, subResponseData ) => {
        konsole.log("dsbkjvb", formResponse, subjectId, responseId, subResponseData)
        const updatedState = {
            ...formResponse[subjectId],
            responseId: responseId,
            subResponseData: subResponseData,
        }
        konsole.log("wdnvjkn", {
            ...formResponse, 
            [subjectId]: updatedState
        })
        setformResponse({
            ...formResponse, 
            [subjectId]: updatedState
        });
    }

    const isCostumModalOpen = typeof window !== 'undefined' && document.querySelector('.costumModal-body');
    const isFinanceInfoContainerVisible = typeof window !== 'undefined' && document.querySelector('.finance-information-container');
    const isEditFinancialAdvisorVisible = typeof window !== 'undefined' &&  ((document.querySelector('.heading-text')?.textContent.trim() === 'Edit Financial Advisor' || document.querySelector('.heading-text')?.textContent.trim() === 'Edit Accountant') || document.querySelector('.heading-text')?.textContent.trim() === 'Edit Bookkeeper');
    const isFamilyInfoVisible = typeof window !== 'undefined' && (
    document.querySelector('.setup-family-information') ||
    document.querySelector('.withDescription') ||
    document.querySelector('.finance-body')
    );

    return (
    <Row>

    {formLabels?.map((formLabelId, indexOfEle) => {
        const questionSection = formQuestions?.["label" + formLabelId]?.question;
        const questionNature = questionSection?.response?.[0]?.responseNature;
        const subjectId = questionSection?.questionId;

        konsole.log("sndkvj", formLabelId, questionSection, questionNature, formResponse?.[subjectId]);


        // All RENDERING CONDITION GOES HERE
        if(['82', '81', '76', '84', '85']?.includes(String(subjectId)) && !isPrimaryMemberMaritalStatus) return ''; // This line is to avoid displaying questions that are  related to spouse 
        if(subjectId == '82' && formResponse?.['76']?.responseId != '140' && isPrimaryMemberMaritalStatus) return ''; // FINANCE ADVISOR I DONT HAVE
        if(subjectId == '81' && formResponse?.['76']?.responseId != '139' && isPrimaryMemberMaritalStatus) return ''; // FINANCE ADVISOR I DONT HAVE
        if(subjectId == '205' && formResponse?.['78']?.responseId != '145') return ''; // FINANCE ADVISOR I DONT HAVE
        if(subjectId == '86' && formResponse?.['83']?.responseId != '154') return ''; // ACCOUNTANT I DONT HAVE
        // debugger
        if(subjectId == '81') questionSection.question = $AHelper.$RemoveFakeNames(questionSection?.question, spouseFullName ); // FINANCE ADVISOR I DONT HAVE
        if(subjectId == '82') questionSection.question = $AHelper.$RemoveFakeNames(questionSection?.question, primaryMemberFullName); // FINANCE ADVISOR I DONT HAVE
        if(subjectId == '76' || subjectId == '84' || subjectId == '85') { // FINANCE ADVISOR & ACCOUNTANT I DONT HAVE
            questionSection.response[0].response = $AHelper.$RemoveFakeNames(questionSection.response[0]?.response, primaryDetails?.fName) // FINANCE ADVISOR & ACCOUNTANT I DONT HAVE
            questionSection.response[1].response = $AHelper.$RemoveFakeNames(questionSection.response[1]?.response, spouseDetails?.fName) // FINANCE ADVISOR & ACCOUNTANT I DONT HAVE
        }

        // RETURN UI HERE
        if(questionNature == "Text") {
            const curResponseId = questionSection?.response?.[0]?.responseId;
            const isShowLabel = (subjectId != '205');
            const type = (questionSection?.question?.includes("How long have you used this")) ? 'number' : '';

            if(type == 'number') return (
            <div className="custom-input-field" id={'label' + subjectId}>
                <p>{isShowLabel ? questionSection?.question : ''}</p>
            <Col className ='pe-2' xs={12} md={isCostumModalOpen ? undefined : 12} lg={isCostumModalOpen ? undefined : (isFinanceInfoContainerVisible && isEditFinancialAdvisorVisible ? 9 : (isFinanceInfoContainerVisible ? 8 : (isFamilyInfoVisible ? 7 : 8)))} >
            <CustomInput
                tabIndex={startingTabIndex + indexOfEle}
                customStyle={{display: 'block'}}
                // label={isShowLabel ? questionSection?.question : ''}
                placeholder={isShowLabel ? 'Enter number' : questionSection?.question}
                id='used'
                value={formResponse?.[subjectId]?.subResponseData}
                onChange={(val) => {
                    $AHelper.$isNumberRegexWithDecimalUnder100(val) && handleChange(subjectId, curResponseId, val)
                }}
            />
            </Col>
            </div>)
 
            return (
            <div className="custom-input-field" id={'label' + subjectId}>
                {/* <p>{isShowLabel ? questionSection?.question : ''}</p> */}
                <Col className='pe-2' xs={12} md={isCostumModalOpen ? undefined : 12} lg={isCostumModalOpen ? undefined : (isFinanceInfoContainerVisible && isEditFinancialAdvisorVisible ? 8 : (isFinanceInfoContainerVisible ? 8 : (isFamilyInfoVisible ? 7 : 8)))} >
            <CustomInput
                // label={isShowLabel ? questionSection?.question : ''}
                notCapital={true}
                tabIndex={startingTabIndex + indexOfEle}
                placeholder={isShowLabel ? '' : questionSection?.question}
                id='used'
                value={formResponse?.[subjectId]?.subResponseData}
                onChange={(val) => handleChange(subjectId, curResponseId, val)} 
            />
            </Col>
            </div>)
        } 

        if(questionNature == "Radio") {
            const questionOptions = questionSection?.response?.map(ele => ({
                label: ele.response, 
                value: ele.responseId
            }))

            return (
            <div className='spacingBottom' id={'label' + subjectId}>
            <CustomRadio
                tabIndex={startingTabIndex + indexOfEle}
                placeholder={questionSection?.question}
                options={questionOptions}
                value={formResponse?.[subjectId]?.responseId}
                classType='vertical'
                onChange={(selected) => handleChange(subjectId, selected?.value, selected?.label)}
            />
            </div>)
        }

        return "";
    })}

    </Row>
    )
})

export default ProfessionalMetaData;