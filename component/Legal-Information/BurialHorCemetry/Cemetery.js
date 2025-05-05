import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle, memo, useCallback } from 'react';
import { Row, Col } from 'react-bootstrap';
import { CustomInput, CustomRadioSignal } from '../../Custom/CustomComponent';
import konsole from '../../../components/control/Konsole';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { useAppDispatch } from '../../Hooks/useRedux';
import { $AHelper } from '../../Helper/$AHelper';
import AddressOneLine from '../../Custom/Contact/AddressOneLine';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';

const isQuesContent = 'We strongly suggest you take the initiative and get this detail addressed.  It will go a long way to ensure that your needs are less of a burden to loved ones, and you will likely also save your estate assets in the meanwhile.'

const newObj = () => {
    return { nameOfContact: "", nameOfCmp: "", contactNo: "", cellNo: "", address: "", website: "", faxNo: "" }
}

const Cemetery = forwardRef((props, ref) => {
    const { formlabelData, updateFormLabel, userId, activeKeys } = props;

    konsole.log(activeKeys, "activeKeysactiveKeysss")
    const { displaySpouseContent } = usePrimaryUserId();
    const dispatch = useAppDispatch();

    const [ques463, setQues463] = useState({});
    const [ques1023Values, setQues1023Values] = useState({ ...newObj() });
    const [ques1024, setQues1024] = useState({});
    const [ques1025, setQues1025] = useState({});
    const [isUpdateQues1023, setIsUpdateQues1023] = useState(false)
    const formLabelData = useMemo(() => formlabelData, [formlabelData]);
    const startingTabIndex = props?.startTabIndex ?? 0; 

    let currentTabIndex = startingTabIndex;

    const getNextTabIndex = () => {
        return currentTabIndex++;
    };

    useEffect(() => {
        if (formLabelData) {
            formLabel1023Information()
        }
    }, [formLabelData])

    useImperativeHandle(ref, () => ({
        cemeteryJson, cemetryValidate
    }))

    const cemetryValidate = () => {

        return new Promise((resolve, reject) => {

            let ques1023Contact = true;
            let ques1023CellNo = true;
            let ques1023Web = true;
            let ques1023FaxNo = true;
            if (isValidContactCell(ques1023Values.contactNo)) {
                ques1023Contact = false;
            }
            if (isValidContactCell(ques1023Values.cellNo)) {
                ques1023CellNo = false;
            }
            if ($AHelper.$isNotNullUndefine(ques1023Values?.website) && !$AHelper.$isUrlValid(ques1023Values?.website)) {
                ques1023Web = false;
            }
            if (isValidContactCell(ques1023Values.faxNo)) {
                ques1023FaxNo = false;
            }
            let isValid = ques1023Contact && ques1023CellNo && ques1023Web && ques1023FaxNo;
            konsole.log(isValid);
            resolve(isValid);
        })
    }



    console.log("ques1023Values", ques1023Values)

    const cemeteryJson = async () => {
        return new Promise((resolve, reject) => {
            let userSubject = []
            if ($AHelper.$objectvalidation(ques463)) userSubject.push(ques463);
            if ($AHelper.$objectvalidation(ques1024)) userSubject.push(ques1024);
            if ($AHelper.$objectvalidation(ques1025)) userSubject.push(ques1025);

            if (isUpdateQues1023 == true) {
                const value = $AHelper.$convertObjectToQueryString(ques1023Values);
                let responseId = formLabelData.label1023.response[0].responseId
                const userSubjectDataId = (formLabelData.label1023?.userSubjectDataId) ? formLabelData.label1023?.userSubjectDataId : 0;
                const questionId = formLabelData.label1023?.questionId;
                let json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: value, userId: userId })
                userSubject.push(json)
            }
            resolve(userSubject)
        })
    }
    const formLabel1023Information = useCallback(() => {
        konsole.log("formLabelData?.label102", formLabelData?.label1023)
        const responseData = formLabelData?.label1023?.response[0];
        if ($AHelper.$isNotNullUndefine(responseData)) {
            let keyValuePairs = responseData?.response?.split("&&");
            konsole.log("keyValuePairs", keyValuePairs)
            if (!$AHelper.$isNotNullUndefine(keyValuePairs)) return;
            let contactInfo = Object.fromEntries(keyValuePairs?.map(function (keyValue) {
                var pair = keyValue?.split("=");
                var key = pair[0];
                var value = decodeURIComponent(pair[1]);
                return [key, value];
            }));
            if (contactInfo?.contactNo?.length > 0) { contactInfo.contactNo = contactInfo?.contactNo?.slice(0, 10) }
            if (contactInfo?.cellNo?.length > 0) { contactInfo.cellNo = contactInfo?.cellNo?.slice(0, 10) }
            if (contactInfo?.faxNo?.length > 0) { contactInfo.faxNo = contactInfo?.faxNo?.slice(0, 10) }
            konsole.log("contactInfo", contactInfo)
            setQues1023Values(contactInfo);
        }

    }, [formLabelData?.label1023])


    const handleChange = (e, labelData, label, setState, type) => {
        konsole.log('handleCurrencyInput', e);
        const { value, id: responseId } = e;
        const userSubjectDataId = labelData?.userSubjectDataId || 0;
        const questionId = labelData?.questionId;

        handleSetState(label, responseId, value, type);
        const json = $JsonHelper.metaDataJson({ userSubjectDataId, subjectId: questionId, responseId, subResponseData: value, userId });
        konsole.log("jsonjson", json);
        setState(json);
    };

    const handleStateUpdate = (id, value) => {
        setIsUpdateQues1023(true)
        const eValue = $AHelper.$isNotNullUndefine(value) ? value : ""
        konsole.log('handleStateUpdate', eValue, id);
        setQues1023Values(prev => ({
            ...prev, [id]: eValue
        }))
    }

    const handleSetState = (label, responseId, value, type) => {
        const formLabelInformation = { ...formLabelData };
        const selectedLabelValue = { ...formLabelData[label] };

        selectedLabelValue.response = selectedLabelValue.response.map(response => {
            if (response.responseId === responseId) {
                return type !== 'Radio' ? { ...response, response: value } : { ...response, checked: value };
            }
            if (type === 'Radio') {
                return { ...response, checked: false };
            }
            return response;
        });

        formLabelInformation[label] = selectedLabelValue;
        konsole.log("formLabelInformation", formLabelInformation);
        dispatch(updateFormLabel(formLabelInformation));
    };

    const isQuestionVisible = (label, condition, ) => {
       
        return useMemo(() => {
            const responses = formLabelData?.[label]?.response || [];
            return responses.find(item => item.response == condition)?.checked == true;
        }, [formLabelData?.[label]]);
    };



    const renderRadioGroup = (label, setState) => {

        const data = formLabelData?.[label];
        if (!data) return null;

        return (
            <div className={"radio-container w-100 d-block"}>
                <p className='mb-1'>{data.question}</p> 
                <div className="mt-2 d-flex flex-wrap gap-1">
                    {data.response.map((item, index, indexOfEle) => (
                        <CustomRadioSignal tabIndex={startingTabIndex + indexOfEle} key={index} label={item.response} name={index} value={item.checked == true} id={item.responseId}
                            onChange={(e) => handleChange({ id: item.responseId, value: e.target.checked }, data, label, setState, 'Radio')}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const isQues463No = isQuestionVisible('label463', 'No');
    const isQues463Yes = isQuestionVisible('label463', 'Yes');
    const isQues1024Yes = isQuestionVisible('label1024', 'Yes');
    const isQues1025Yes = isQuestionVisible('label1025', 'Yes');
    const isQues1025No = isQuestionVisible('label1025', 'No');
    const isQues1024No = isQuestionVisible('label1024', 'No');

    const isValidContactCell = (value) => {
        return (value?.length > 0 && ($AHelper.$formatPhoneNumber2(value)?.length <= 10 || $AHelper.$formatPhoneNumber2(value)?.length == null)) ? true : ''
    }
    // @@ konsole
    konsole.log("ndfnddndnfnfdf", displaySpouseContent)
    konsole.log("formLabelData", formLabelData);
    konsole.log("ques1023Values", ques1023Values);
    return (
        <div id='cemetery' className='cemetery'>
            <Row className='mb-3'>
                {renderRadioGroup('label463', setQues463)}
                {isQues463No &&
                    <>
                        {renderRadioGroup('label1024', setQues1024)}
                        {isQues1024Yes && <>{renderRadioGroup('label1025', setQues1025)}
                            {isQues1025Yes && <>
                                <div className="status-message-livingwill">We will get someone to call you</div>
                            </>}
                            {isQues1025No && <p className='status-message-livingwill'>{isQuesContent}</p>}
                        </>}
                        {isQues1024No && <p className='status-message-livingwill'>{isQuesContent}</p>}
                    </>
                }

                {(isQues463Yes) && <>
                <div className='Row'>
                    <div className={`spacingBottom gapNone col-xs-12 col-md-6 ${displaySpouseContent ? 'col-lg-10' : 'col-lg-5'}`}>
                    <CustomInput tabIndex={getNextTabIndex()} isError={''} label='Name of Contact' placeholder="Name of Contact" id='nameOfContact' value={ques1023Values?.nameOfContact}
                        onChange={(val) => { const result = val?.replace(/[^a-zA-Z ]/gi, ""); handleStateUpdate('nameOfContact', result) }}
                    />
                    </div>
                    <div className={`spacingBottom gapNone col-xs-12 col-md-6 ${displaySpouseContent ? 'col-lg-10' : 'col-lg-5'}`}>
                    <CustomInput tabIndex={getNextTabIndex()} isError={''} label='Name of Cemetery' placeholder="Name of Cemetery" id='nameOfCmp' value={ques1023Values?.nameOfCmp} onChange={(val) => handleStateUpdate('nameOfCmp', val)} />
                    </div>
                    <div className={`spacingBottom gapNone col-xs-12 col-md-6 ${displaySpouseContent ? 'col-lg-10' : 'col-lg-5'}`}>
                    <CustomInput 
                        tabIndex={getNextTabIndex()}
                        isError={isValidContactCell(ques1023Values.contactNo) ? 'Contact Number is not valid' : ''} max={14}
                        label='Contact Number' placeholder="Contact Number" id='contactNo' value={$AHelper.$formatPhoneNumber2(ques1023Values?.contactNo)}
                        onChange={(val) => {
                            const result = val.replace(/[^0-9]/gi, "");
                            handleStateUpdate('contactNo', result)
                        }}
                    />
                    </div>
                    <div className={`spacingBottom gapNone col-xs-12 col-md-6 ${displaySpouseContent ? 'col-lg-10' : 'col-lg-5'}`}>
                    <CustomInput tabIndex={getNextTabIndex()} isError={isValidContactCell(ques1023Values.cellNo) ? 'Cell Number is not valid' : ''} label='Cell Number' placeholder="Cell Number" id='cellNo'
                        onChange={(val) => {
                            const result = val.replace(/[^0-9]/gi, "");
                            handleStateUpdate('cellNo', result)
                        }}
                        value={$AHelper.$formatPhoneNumber2(ques1023Values?.cellNo)} max={14}
                    />
                    </div>
                    <div className={`spacingBottom gapNone col-xs-12 col-md-6 ${displaySpouseContent ? 'col-lg-10' : 'col-lg-5'}`}>
                    <CustomInput tabIndex={getNextTabIndex()} isError={''} label='Enter Plot No.' placeholder="Enter Plot No." id='plotNo' isSmall={true} value={ques1023Values?.plotNo} onChange={(val) => handleStateUpdate('plotNo', val)} />
                    </div>
                    <div className={`spacingBottom gapNone col-xs-12 col-md-6 ${displaySpouseContent ? 'col-lg-10' : 'col-lg-5'}`}>
        
                    <AddressOneLine
                        isError={''}
                        startTabIndex={getNextTabIndex()}
                        label="Address"
                        placeholder="Address"
                        onChange={(e) => handleStateUpdate("address", e)}
                        value={ques1023Values?.address}
                    />
                    </div>
                    <div className={`spacingBottom gapNone col-xs-12 col-md-6 ${displaySpouseContent ? 'col-lg-10' : 'col-lg-5'}`}>
                    <CustomInput tabIndex={getNextTabIndex()} label='Website' placeholder="https://example.com." id='website' isSmall={true} value={ques1023Values?.website} onChange={(val) => handleStateUpdate('website', val)}
                        isError={($AHelper.$isNotNullUndefine(ques1023Values?.website) && !$AHelper.$isUrlValid(ques1023Values?.website)) ? 'Url is not valid' : ''}
                    />
                    </div>
                    <div className={`spacingBottom gapNone col-xs-12 col-md-6 ${displaySpouseContent ? 'col-lg-10' : 'col-lg-5'}`}>
                    <CustomInput tabIndex={getNextTabIndex()} label='Fax Number' placeholder="Fax Number."
                        isError={isValidContactCell(ques1023Values.faxNo) ? 'Fax Number is not valid' : ''} id='faxNo'
                        value={$AHelper.$formatPhoneNumber2(ques1023Values?.faxNo)} max={14}
                        onChange={(val) => {
                            const _result = val.replace(/[^0-9]/gi, "");
                            handleStateUpdate('faxNo', _result)
                        }}
                    />
                    </div>
                </div>
                </>}
            </Row>
        </div>
    );
});

export default memo(Cemetery);
