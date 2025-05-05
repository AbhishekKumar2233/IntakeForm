import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle, memo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { isContent } from '../../Personal-Information/PersonalInformation';
import { CustomInput, CustomRadioSignal, CustomTextarea } from '../../Custom/CustomComponent';
import konsole from '../../../components/control/Konsole';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { useAppDispatch } from '../../Hooks/useRedux';
import { $AHelper } from '../../Helper/$AHelper';
const HandlingOfRemains = forwardRef((props, ref) => {
    const { formlabelData, updateFormLabel, userId } = props;
    // export const burialHorCemetryLabelId = [461, 462]

    const dispatch = useAppDispatch()
    // @@ define state
    const [ques461, setQues461] = useState({});
    const [ques462, setQues462] = useState({});
    const [ques952, setQues952] = useState({});

    const startingTabIndex = props?.startTabIndex ?? 0;

    useImperativeHandle(ref, () => ({
        horJson,
    }))

    const formLabelData = useMemo(() => {
        return formlabelData;
    }, [formlabelData])

    const horJson = async (userId) => {
        return new Promise((resolve, reject) => {

            let userSubject = []
            if ($AHelper.$objectvalidation(ques461)) {
                userSubject.push(ques461)
            }
            if ($AHelper.$objectvalidation(ques462)) {
                userSubject.push(ques462)
            }
            if ($AHelper.$objectvalidation(ques952)) {
                userSubject.push(ques952)
            }
            resolve(userSubject)
        })
    }

    const handleChange = (e, labelData, label, setState, type) => {
        konsole.log('handleCurrencyInput', e)
        let value = e?.value;
        const responseId = e.id
        const userSubjectDataId = (labelData?.userSubjectDataId) ? labelData?.userSubjectDataId : 0;
        const questionId = labelData?.questionId;

        handleSetState(label, responseId, value, type);
        let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: value, userId: userId })
        konsole.log("jsonjson", json)
        setState(json)
    }
    // @@ handle globaly state
    const handleSetState = (label, responseId, value, type) => {
        const formLabelInformation = { ...formLabelData };
        const selectedLabelValue = { ...formLabelData[label] };
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
        dispatch(updateFormLabel(formLabelInformation))
    }

    const isQuestion952show = useMemo(() => {
        if (formLabelData?.label461 && formLabelData?.label461?.response?.find((item) => item?.response == 'Cremation')?.checked == true) {
            return true
        }
        return false;
    }, [formLabelData?.label461])


    konsole.log("isQuestion952show", isQuestion952show)
    konsole.log("formLabelData?.label952", formLabelData?.label952)

    konsole.log("ques461ques952", ques461, ques462, ques952);

    return (
        <>
            <div id='handlingofremains' className='handlingofremains'>
                <Row className='mb-3'>
                    {(formLabelData?.label461) &&
                        <div className={"radio-container w-100 mt-3 d-block"}>
                            <p className='mb-1'>{formLabelData?.label461?.question}</p>
                            <div className="mt-2 d-flex flex-wrap gap-1">
                                {formLabelData?.label461?.response?.map((item, index, indexOfEle) => {
                                    konsole.log("itemitemalue", formLabelData?.label461, item);
                                    let isChecked = item?.checked == true ? true : ''
                                    return <>
                                        <CustomRadioSignal tabIndex={startingTabIndex + indexOfEle} key={index} label={item.response} name={index} value={isChecked} id={item?.responseId}
                                            onChange={(e) => handleChange({ id: item?.responseId, value: e.target.checked }, formLabelData?.label461, 'label461', setQues461, 'Radio')}
                                        />
                                    </>
                                })}
                            </div>
                        </div>
                    }

                    {(isQuestion952show == true) && <>
                        {formLabelData?.label952 && formLabelData?.label952?.response?.map((item, index, indexOfEle) => {
                            konsole.log("handleChangehandleChange", item,item?.response)
                            return <>
                                <div className={"radio-container w-100 mt-3 d-block"} style={{ backgroundColor: "#F8F8F8", minHeight:"9.5rem", borderRadius:"7px"}}>
                                    <p className='fw-bold mt-2'>{formLabelData?.label952?.question}</p>
                                    <div className="d-flex p-0 gap-4">
                                        <CustomTextarea tabIndex={startingTabIndex + indexOfEle}  isError='' name={item?.response} placeholder="Comment..." id={item?.responseId} type='textarea' rows={3} value={item?.response}
                                            onChange={(e) => handleChange({ id: item?.responseId, value: e }, formLabelData?.label952, 'label952', setQues952)} />
                                    </div>
                                </div>
                            </>
                        })}
                    </>}
                    {(formLabelData?.label462) &&
                        <div className={"radio-container w-100 d-block"}>
                            <p className='mb-1'>{formLabelData?.label462?.question}</p>
                            <div className="mt-2 d-flex flex-wrap gap-1 ">
                                {formLabelData?.label462?.response?.map((item, index, indexOfEle) => {
                                    konsole.log("itemitemalue", formLabelData?.label462, item);
                                    let isChecked = item?.checked == true ? true : ''
                                    return <>
                                        <CustomRadioSignal tabIndex={startingTabIndex + indexOfEle}  key={index} name={index} value={isChecked} id={item?.responseId} label={item.response}
                                            onChange={(e) => handleChange({ id: item?.responseId, value: e.target.checked }, formLabelData?.label462, 'label462', setQues462, 'Radio')}
                                        />
                                    </>
                                })}

                            </div>
                        </div>
                    }
                </Row>
            </div>
        </>
    )
})

export default memo(HandlingOfRemains)
