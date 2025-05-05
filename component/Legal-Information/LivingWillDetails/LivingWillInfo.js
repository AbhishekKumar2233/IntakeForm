import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { Row, Col } from 'react-bootstrap';
import { $AHelper } from '../../Helper/$AHelper';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { isContent } from '../../Personal-Information/PersonalInformation';
import { useAppSelector, useAppDispatch } from '../../Hooks/useRedux';
import { selectSubjectData } from '../../Redux/Store/selectors';
import { $ApiHelper } from '../../Helper/$ApiHelper';
import { useLoader } from '../../utils/utils';
import konsole from '../../../components/control/Konsole';
import { getApiCall, postApiCall } from '../../../components/Reusable/ReusableCom';
import { updateSpouseLivingWillFormLabel, updatePrimaryLivingWillFormLabel, updateLivingWillQuestion } from '../../Redux/Reducers/subjectDataSlice';
import { CustomRadioSignal } from '../../Custom/CustomComponent';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { $Service_Url } from '../../../components/network/UrlPath';
import { $LivingWillPlaceholder } from '../../Helper/$MsgHelper';

export const livingWillFormLabelId = [452, 453, 454, 455, 456, 457, 458]

const LivingWillInfo = forwardRef((props, ref) => {
  const { userId, activeTab, type } = props;
  const dispatch = useAppDispatch();
  const subjectData = useAppSelector(selectSubjectData);
  const { livingWillQuestion, primarylivingWillFormLabel, spouselivingWillFormLabel } = subjectData;

  const startingTabIndex = props?.startTabIndex ?? 0; 

  // @@ define state
  const [ques452, setQues452] = useState({});
  const [ques453, setQues453] = useState({});
  const [ques454, setQues454] = useState({});
  const [ques455, setQues455] = useState({});
  const [ques456, setQues456] = useState({});
  const [ques457, setQues457] = useState({});
  const [ques458, setQues458] = useState({});


  // selected answer list
  const answersList = useMemo(() => {
    return activeTab == 1 ? primarylivingWillFormLabel : spouselivingWillFormLabel;
  }, [activeTab, primarylivingWillFormLabel, spouselivingWillFormLabel])


  // define useEffect
  useEffect(() => {
    if (livingWillQuestion?.length == 0 && $AHelper.$isNotNullUndefine(userId)) {
      fetchQuestionsWithFormLabelId()
    } else if (livingWillQuestion?.length > 0 && $AHelper.$isNotNullUndefine(userId) && !$AHelper.$isNotNullUndefine(answersList)) {
      fetchResponseWithQuestionId(livingWillQuestion)
    }
  }, [userId, answersList])


  // @@ useImperative
  useImperativeHandle(ref, () => ({
    saveData
  }))

  // @@ fetch questions list
  const fetchQuestionsWithFormLabelId = async () => {
    useLoader(true);
    const resultOf = await $ApiHelper.$getSujectQuestions(livingWillFormLabelId);
    useLoader(false);
    konsole.log("resultOfSubjectResponse", resultOf);
    dispatch(updateLivingWillQuestion(resultOf))
    if (resultOf !== 'err' && resultOf.length > 0) {
      fetchResponseWithQuestionId(resultOf)
    }
  }

  // @@ fetch answer list
  const fetchResponseWithQuestionId = async (questions) => {
    konsole.log("questions", questions);
    useLoader(true);
    const resultOfRes = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicId({ memberId: userId, questions: questions ,topicId:19})
    useLoader(false);
    konsole.log("resultOfRes", resultOfRes);
    const questionRespons = resultOfRes?.userSubjects;
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


  // @@ save Data

  const saveData = () => {
    return new Promise(async (resolve, reject) => {

      let userSubject = []
      if ($AHelper.$objectvalidation(ques452)) {
        userSubject.push(ques452)
      }
      if ($AHelper.$objectvalidation(ques453)) {
        userSubject.push(ques453)
      }
      if ($AHelper.$objectvalidation(ques454)) {
        userSubject.push(ques454)
      }
      if ($AHelper.$objectvalidation(ques455)) {
        userSubject.push(ques455)
      }

      if ($AHelper.$objectvalidation(ques456)) {
        userSubject.push(ques456)
      }

      if ($AHelper.$objectvalidation(ques457)) {
        userSubject.push(ques457)
      }
      if ($AHelper.$objectvalidation(ques458)) {
        userSubject.push(ques458)
      }

      konsole.log("userSubject322222222222222222", userSubject)
      const filterToDeleteData=userSubject.filter((data)=>data.subResponseData==false)
      const filterToUpdate=userSubject.filter((data)=>data.subResponseData==true)
      // console.log("filterToDeleteDatalivingWill",filterToDeleteData,filterToUpdate)
      if (userSubject.length == 0) {
        resolve('no-data')
      } else {
        const jsonObj = { userId: userId, userSubjects: filterToUpdate }
        const newJsonToDelete=filterToDeleteData?.map(data=>({userSubjectDataId:data.userSubjectDataId}))
        konsole.log('jsonObjOrgan', jsonObj);
        if(newJsonToDelete?.length>0){
          await postApiCall("DELETE", $Service_Url.deleteSubjectUser+"?UserId="+userId, newJsonToDelete);
        }
        const resultOfsubjectsData = await postApiCall('PUT', $Service_Url.putSubjectResponse, jsonObj)
        if (resultOfsubjectsData != 'err') {
          fetchResponseWithQuestionId(livingWillQuestion)
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
    konsole.log("responseIdresponseIdresponseId", responseId,isChecked,userSubjectDataId,questionId)
    handleSetState(label, responseId, isChecked);
    let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: isChecked, userId: userId })
    konsole.log("jsonjson", json)
    setState(json)
    if (responseId == 90) {
      handleChangeRadio(isChecked)
    }
    if (responseId == 91) {
      handleChangeRadio2(isChecked)
    }
  }


  // @@ handle change radio for 106 ,460
  const handleChangeRadio = (isChecked) => {
    let labelData = answersList?.label453
    let responseId = labelData?.response?.find((item) => item?.response == 'No')?.responseId
    const userSubjectDataId = (labelData?.userSubjectDataId) ? labelData?.userSubjectDataId : 0;
    const questionId = labelData?.questionId;
    let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: isChecked, userId: userId })
    setQues453(json)
    //////////////for new anhencemt to select all 
    commoanLabalaFunc("Do Want",isChecked)
  }
  function handleLabelData(labels, userId, isChecked, responseType, setQuestions) {
    return labels.map((labelData, index) => {
      const responseId = labelData?.response?.find(item => item?.response === responseType)?.responseId;
      const json = $JsonHelper.metaDataJson({
        userSubjectDataId: labelData?.userSubjectDataId || 0,
        subjectId: labelData?.questionId,
        responseId,
        subResponseData: isChecked,
        userId,
      });
      setQuestions[index](json);
      return json;
    });
  }


  const commoanLabalaFunc =(newLable,isChecked)=>{
    const { label454, label455, label456, label457, label458 } = answersList
    const labels = [label454, label455, label456, label457, label458];
    const setQuesFunctions = [setQues454, setQues455, setQues456, setQues457, setQues458];
    handleLabelData(labels, labels, isChecked,newLable, setQuesFunctions)
  }
  const handleChangeRadio2 = (isChecked) => {
    let labelData = answersList?.label453
    let responseId = labelData?.response?.find((item) => item?.response == 'Yes')?.responseId
    const userSubjectDataId = (labelData?.userSubjectDataId) ? labelData?.userSubjectDataId : 0;
    const questionId = labelData?.questionId;
    let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: isChecked, userId: userId })
    setQues453(json)
    //////////////for new anhencemt to select all 
      commoanLabalaFunc("Don't Want",isChecked)

  }
  // @@ handle globaly state
  const handleSetState = (label, responseId, value, type) => {

    const formLabelInformation = { ...answersList };
    const selectedLabelValue = { ...answersList[label] };
    selectedLabelValue.response = selectedLabelValue.response?.map(response => {
      if (response.responseId == responseId) {
        return { ...response, checked: value };
      } else if (response.responseId != responseId) {
        return { ...response, checked: false };
      }
      return response;
    });;

    // @@ 
    if (responseId == 90) {
      const selectedLabelValue = { ...answersList?.label453 };
      let responseId = 93
      selectedLabelValue.response = selectedLabelValue.response?.map(response => {
        return {
          ...response,
          checked: response.responseId === responseId ? value : false
        };
      });

    
      [92, 94, 96, 98, 100, 102].forEach((responseId, index) => {
        formLabelInformation[`label${453 + index}`] = index === 0 ? selectedLabelValue : updateResponse({ ...answersList?.[`label${453 + index}`] }, responseId, value);
      });
    }
    // @@ 
    if (responseId == 91) {
      [92, 95, 97, 99, 101, 103].forEach((responseId, index) => {
        formLabelInformation[`label${453 + index}`] = updateResponse({ ...answersList?.[`label${453 + index}`] }, responseId, value);
      });
      
    }
    formLabelInformation[label] = selectedLabelValue;
    handleUpdateDispatch(formLabelInformation)
  }

  // @@ handle Disptch
  const handleUpdateDispatch = (information) => {
    if (activeTab == 1) {
      dispatch(updatePrimaryLivingWillFormLabel(information))
    } else if (activeTab == 2) {
      dispatch(updateSpouseLivingWillFormLabel(information))
    }
  }


  ///////////////////////////update resposne for global func///////
  const updateResponse = (label, responseId, value) => ({
    ...label,
    response: label.response?.map(r => ({
      ...r,
      checked: r.responseId === responseId ? value : false
    }))
  });

  /////////////////////////////////////////////////////////////////

  // @@ check disable radio or not
  const disableQues453 = useMemo(() => {
    if (answersList?.label452 && (answersList?.label452?.response?.find((item) => item?.response == 'Yes')?.checked == true || answersList?.label452?.response?.find((item) => item?.response == 'No')?.checked == true)) {
      return true
    }
    return false;
  }, [answersList]);



  // @@ konsole.log

  konsole.log("subjectData", subjectData)
  return (
    <>
      {/* <Row className=''> */}
      {/* <Col xs={12} md={12} xl={4}>
          <div className="content-placeholder">{$LivingWillPlaceholder?.content}</div>
        </Col> */}
      {/* <Col xs={12} md={12} xl={8}> */}
      {/* <Row>
            <div className="status-message-livingwill">
              <span className='content-status'>If you were diagnosed with terminal illness (no reasonable hope for living more than 6 months) <b>OR</b>  In a persistent vegetative state (comatose) <b>AND</b>  Your loved ones concurred that there is no reasonable hope of you getting better, then what instructions do you want to give your loved ones with regards to the use of artificial means of life support?</span>
            </div>
          </Row> */}
      <p className='organ-donor-heading mb-2'>Please identify your choices for your living will.</p>
      <hr />
      {/* @@ first part */}
      <Row className='mt-2'>

        {(answersList?.label452) &&
          <div className={"radio-container w-100 d-block mb-1"}>
            <p style={{ fontWeight: '600' }} className='w-100'>{answersList?.label452?.question}</p>
            <div className="mt-2 d-flex gap-1">
              {answersList?.label452?.response?.map((item, index) => {
                konsole.log("itemitemaluelabel452", answersList?.label452, item);
                let isChecked = item?.checked == true ? true : ''
                return <>
                  <CustomRadioSignal tabIndex={startingTabIndex + 1} key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                    onChange={(e) => handleChange(e, answersList?.label452, 'label452', setQues452, 'Radio')}
                  />
                </>
              })}

            </div>
          </div>
        }

        {(answersList?.label453) &&
          <div className={"radio-container w-100 d-block"}>
            <p className='mb-1' style={{ fontWeight: '600' }}>{answersList?.label453?.question}</p>
            <div className="mt-2 d-flex gap-1">
              {answersList?.label453?.response?.map((item, index) => {
                konsole.log("itemitemalue", answersList?.label453, item);
                let isChecked = item?.checked == true ? true : ''
                return <>
                  <CustomRadioSignal tabIndex={startingTabIndex + 2} key={index} name={index} value={isChecked} disabled={disableQues453} id={item?.responseId} label={item.response}
                    onChange={(e) => handleChange(e, answersList?.label453, 'label453', setQues453, 'Radio')}
                  />
                </>
              })}
            </div>
          </div>
        }
      </Row>
      <hr />

      {/* @@ second part */}
      <Row>
        {/* <div className={"w-100  d-flex justify-content-between mt-3"}>
          <p className='w-75'>{''}</p>
          <div className="d-flex w-50 justify-content-around">
            <p className='do-want-dont-want'>Do want</p>
            <p className='do-want-dont-want'>Don’t want</p>
          </div>
        </div> */}

        {(answersList?.label454) &&
          <div className={"radio-container w-100 d-block"}>
            <p className='mb-1'>{answersList?.label454?.question}</p>
            <div className='mt-2 d-flex gap-1'>
              {answersList?.label454?.response?.map((item, index) => {
                konsole.log("itemitemaluelabel454", answersList?.label454, item);
                let isChecked = item?.checked == true ? true : ''
                return <>
                  <CustomRadioSignal tabIndex={startingTabIndex + 3} key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                    onChange={(e) => handleChange(e, answersList?.label454, 'label454', setQues454, 'Radio')}
                  />
                </>
              })}
            </div>
          </div>
        }

        {(answersList?.label455) &&
          <div className={"radio-container w-100 d-block"}>
            <p className='mb-1'>{answersList?.label455?.question}</p>
            <div className='mt-2 d-flex gap-1'>
              {answersList?.label455?.response?.map((item, index) => {
                konsole.log("itemitemalue", answersList?.label455, item);
                let isChecked = item?.checked == true ? true : ''
                return <>
                  <CustomRadioSignal tabIndex={startingTabIndex + 4} key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                    onChange={(e) => handleChange(e, answersList?.label455, 'label455', setQues455, 'Radio')}
                  />
                </>
              })}
            </div>
          </div>
        }
        {(answersList?.label456) &&
            <div className={"radio-container w-100 d-block"}>
            <p className='mb-1'>{answersList?.label456?.question}</p>
            <div className="mt-2 d-flex gap-1">
              {answersList?.label456?.response?.map((item, index) => {
                konsole.log("itemitemalue", answersList?.label456, item);
                let isChecked = item?.checked == true ? true : ''
                return <>
                  <CustomRadioSignal tabIndex={startingTabIndex + 5} key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                    onChange={(e) => handleChange(e, answersList?.label456, 'label456', setQues456, 'Radio')}
                  />
                </>
              })}
            </div>
          </div>
        }
        {(answersList?.label457) &&
            <div className={"radio-container w-100 d-block"}>
            <p className='mb-1'>{answersList?.label457?.question}</p>
            <div className="mt-2 d-flex gap-1">
              {answersList?.label457?.response?.map((item, index) => {
                konsole.log("itemitemalue", answersList?.label457, item);
                let isChecked = item?.checked == true ? true : ''
                return <>
                  <CustomRadioSignal tabIndex={startingTabIndex + 6} key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                    onChange={(e) => handleChange(e, answersList?.label457, 'label457', setQues457, 'Radio')}
                  />
                </>
              })}
            </div>
          </div>
        }
        {(answersList?.label458) &&
             <div className={"radio-container w-100 d-block"}>
            <p className='mb-1'>{answersList?.label458?.question}</p>
            <div className="mt-2 d-flex gap-1">
              {answersList?.label458?.response?.map((item, index) => {
                konsole.log("itemitemalue", answersList?.label458, item);
                let isChecked = item?.checked == true ? true : ''
                return <>
                  <CustomRadioSignal tabIndex={startingTabIndex + 7} key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                    onChange={(e) => handleChange(e, answersList?.label458, 'label458', setQues458, 'Radio')}
                  />
                </>
              })}
            </div>
          </div>
        }
      </Row>
      {/* </Col> */}
      {/* </Row> */}

    </>
  )
})

export default LivingWillInfo
