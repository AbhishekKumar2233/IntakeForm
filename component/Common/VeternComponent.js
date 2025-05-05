import React, { useState, useEffect, useMemo, useCallback, useImperativeHandle, forwardRef, useRef } from 'react'
import { Row, Col } from 'react-bootstrap';
import { CustomRadio, CustomSelect } from '../Custom/CustomComponent';
import { $JsonHelper } from '../Helper/$JsonHelper';
import { useAppDispatch, useAppSelector } from '../Hooks/useRedux';
import { selectApi, selectPersonal } from '../Redux/Store/selectors';
import { fetchDischargeType, fetchWarTimePeriodType, fetchVeteranData, saveVeteranData } from '../Redux/Reducers/apiSlice';
import { $AHelper } from '../Helper/$AHelper';
import { useLoader } from '../utils/utils';
import konsole from '../../components/control/Konsole';
import { $Msg_StateBackground } from '../Helper/$MsgHelper';
import { Msg } from '../../components/control/Msg';
import { deleteVeteranData } from '../Redux/Reducers/apiSlice';
import { useSelector } from 'react-redux';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import Other from '../../components/asssets/Other';
import { headerNav } from '../Personal-Information/PersonalInformation';

const radioValues = [{ label: "Yes", value: 'Yes' }, { label: "No", value: 'No' }];

const VeternComponent = forwardRef((props, ref) => {
    const { userId, questionlabel, type } = props;
    const { loggedInUserId, _spousePartner, isPrimaryMemberMaritalStatus, spouseUserId, primaryDetails, displaySpouseContent } = usePrimaryUserId();
    const warTimeRef = useRef(null);
    const dischargeRef = useRef(null);

    const dispatch = useAppDispatch();
    const apiData = useAppSelector(selectApi);
    const personalDetails = useSelector(selectPersonal)
    const { dischargeTypeList, warTimePeriodList } = apiData;
    let veternSavedDataFromStore = apiData?.veternSavedData;

    let veternSavedData = useMemo(() => {
        return veternSavedDataFromStore[userId]
    }, [userId, veternSavedDataFromStore])
    konsole.log("personalDetailsxassssssssssssssssss", props?.dataInfo, personalDetails?.primaryDetails?.isVeteran)

    const [veternInfo, setVeternInfo] = useState($JsonHelper.createVeternJson());
    const [errMsg, setErrMsg] = useState('');
    const [isApiCall, setIsApiCall] = useState(false)
    const startingTabIndex = props?.startTabIndex ?? 0;

    konsole.log("isApiCallisApiCall", isApiCall)
    konsole.log("veternSavedData", veternSavedData)



    // useEffect

    useEffect(() => {
        if (type != headerNav[1].value){
            fetchApi();
        }
    }, [])

    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(userId) && !$AHelper.$isNotNullUndefine(veternSavedData)) {
            fetchSavedData()
        }
    }, [userId])

    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(veternSavedData)) {
            konsole.log("veternSavedDataveternSavedData",props,veternSavedData,userId)
            console.log("veternSavedDataveternSavedData", veternSavedData, userId)
            updateDetails();
        } else {
            const isVeteran = props?.dataInfo?.isVeteran == true ? 'Yes' : props?.dataInfo?.isVeteran == false ? 'No' : null;
            konsole.log("isVeteranisVeteranisVeteran", isVeteran, props?.dataInfo)
            setVeternInfo({ ...$JsonHelper.createVeternJson(), isVeteran: isVeteran, 'UpdatedBy': loggedInUserId, 'createdBy': loggedInUserId });
        }
    }, [veternSavedData, userId, props?.dataInfo?.isVeteran])

    useImperativeHandle(ref, () => ({
        isValidate, saveVeternData
    }));



    // saved data set in state
    const updateDetails = useCallback(() => {
        konsole.log("propsdataInfoisVeteran",props?.dataInfo)
        const isVeteran = props?.dataInfo?.isVeteran == true ? 'Yes' : props?.dataInfo?.isVeteran == false ? 'No' : null;
        const { activeServiceDuration, warzone, wartimePeriod, dischargeTypeId, activityTypeId, veteranId } = veternSavedData;
        setVeternInfo(prev => ({
            ...prev, veteranId, activeServiceDuration, warzone, wartimePeriod,
            dischargeTypeId: dischargeTypeId?.toString(), activityTypeId,
            isVeteran: isVeteran, 'UpdatedBy': loggedInUserId
        }));
    }, [veternSavedData, props?.dataInfo, userId]);



    const isValidate = () => {

        var isValidWarzone = true;
        var isValidWarTimePeriod = true;
        var isValidactiveServiceDuration = true;
        var isValidateDischargeTypeIdErr = true;



        if (veternInfo.isVeteran == 'Yes') {
            const { warzoneErr, wartimePeriodErr, activeServiceDurationErr, dischargeTypeIdErr } = $Msg_StateBackground;
            const { warzone, wartimePeriod, dischargeTypeId, activeServiceDuration } = veternInfo;
            isValidateDischargeTypeIdErr = dischargeTypeId !== 0 && $AHelper.$isValidateField(dischargeTypeId, 'dischargeTypeId', dischargeTypeIdErr, setErrMsg);
            isValidWarzone = $AHelper.$isValidateField(warzone, 'warzone', warzoneErr, setErrMsg);
            isValidWarTimePeriod = $AHelper.$isValidateField(wartimePeriod, 'wartimePeriod', wartimePeriodErr, setErrMsg);
            isValidactiveServiceDuration = $AHelper.$isValidateField(activeServiceDuration, 'activeServiceDuration', activeServiceDurationErr, setErrMsg);
            konsole.log("isValidateDischargeTypeIdErr", isValidateDischargeTypeIdErr, dischargeTypeId, dischargeTypeIdErr)
            if (isValidateDischargeTypeIdErr == false) {
                setErrMsg(prev => ({ ...prev, ['dischargeTypeId']: dischargeTypeIdErr }));
            }
        }
        return isValidWarTimePeriod && isValidWarzone && isValidactiveServiceDuration && isValidateDischargeTypeIdErr;
    }


    // fetch api function
    const fetchApi = useCallback(() => {
        useLoader(true)

        apiCallIfNeed(dischargeTypeList, fetchDischargeType);
        apiCallIfNeed(warTimePeriodList, fetchWarTimePeriodType);

        useLoader(false)
    }, [dischargeTypeList, warTimePeriodList, dispatch]);

    const apiCallIfNeed = useCallback((data, action) => {
        if (data.length === 0) {
            dispatch(action());
        }
    }, [dispatch]);

    // @@ fetch saved data------

    const fetchSavedData = async () => {
        useLoader(true)
        const _resultOfVetern = await dispatch(fetchVeteranData({ userId }));
        konsole.log("_resultOfVetern", _resultOfVetern)
        useLoader(false)
    }

    const handleRadioChange = useCallback((e, key) => {
        konsole.log("keykeykeykey", key, e)
        hanldeApiCall(true)
        if(e==null && (key=="activeServiceDuration" || key=="warzone ")){
            handleSetState(key,null);  
            return
        }
        handleSetState(key,e?.value);
        if (key == 'isVeteran' && e?.value == 'No') {
            setErrMsg('')
        }
        if (key == 'isVeteran') {
            if(e==null){handlePersonalDetails(null); return}
            let boolValue = e?.value == 'No' ? false : true;
            handlePersonalDetails(boolValue)
        }
    }, []);

    const handleSetState = useCallback((key, value) => {
        setErrMsg(prev => ({ ...prev, [key]: '' }));
        setVeternInfo(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);


    const handlePersonalDetails = (value) => {
        konsole.log("valuevaluevaluevaluevalue",value)
        props?.setPersonalDetails(prev => ({
            ...prev,
            ['isVeteran']: value
        }))
    }

    const hanldeApiCall = () => {
        setIsApiCall(true);
    }

    const saveVeternData = useCallback(async (userId) => {

        return new Promise(async (resolve, reject) => {
           
            // konsole.log("saveVeternData", userId, veternInfo.isVeteran,)
           
            if (isApiCall === false) {
                resolve('resolve without api call');
                return;
            }
            if ((veternInfo.isVeteran == 'No'  || !$AHelper.$isNotNullUndefine(veternInfo.isVeteran)) && !$AHelper.$isNotNullUndefine(veternInfo.veteranId)) {
                konsole.log("datasave2")
                resolve("resolve")
                return;
            }
            if ((veternInfo.isVeteran == 'No' || !$AHelper.$isNotNullUndefine(veternInfo.isVeteran)) && $AHelper.$isNotNullUndefine(veternInfo.veteranId)) {
                // konsole.log("datasave3",veternInfo.isVeteran)              
                const jsonObj = {
                    veteranId: veternInfo.veteranId,
                    userId: userId,
                    deletedBy: loggedInUserId,
                }                
                useLoader(true);
                const _resultOfVeternDelete = await dispatch(deleteVeteranData(jsonObj));
                if (_resultOfVeternDelete != 'err') {

                }
                useLoader(false)
                konsole.log("_resultOfVeternDelete", _resultOfVeternDelete);
                setVeternInfo($JsonHelper.createVeternJson());
                resolve("resolve")
                return;
            }
            konsole.log("datasave4")
            let jsonObj = veternInfo;
            jsonObj['userId'] = userId;
            jsonObj['UpdatedBy'] = loggedInUserId;
            konsole.log("jsonObjjsonObj", jsonObj);
            const _resultOfSaveData = await dispatch(saveVeteranData(jsonObj));
            konsole.log("_resultOfSaveData", _resultOfSaveData)
            if (_resultOfSaveData?.payload !== 'err') {
                const responseVeteran = _resultOfSaveData?.payload;
                if (veternInfo.wartimePeriod == '999999') {
                    await warTimeRef.current.saveHandleOther(responseVeteran?.veteranId);
                }
                if (veternInfo.dischargeTypeId == '999999') {
                    await dischargeRef.current.saveHandleOther(responseVeteran?.veteranId);
                }
            }
            konsole.log("_resultOfSaveData", _resultOfSaveData);
            resolve("resolve")
        })

    }, [veternInfo, userId])


    const activeServiceDurationLabel = useMemo(() => (
        veternInfo.wartimePeriod == 6 ? `Did  ${props?.type == 'Personal' ? 'you' : `this ${_spousePartner}`} serve at least (90 Day) in active service?*` : `Did ${props?.type == 'Personal' ? 'you' : `this ${_spousePartner}`} serve at least 1 day in active service?*`
    ), [veternInfo.wartimePeriod, type])


    let msgUsVetern = (type === 'Personal') ? "Are you a U.S Veteran?" : `Is this ${_spousePartner} a U.S. Veteran?`;
    let msgwarZone = (type === 'Personal') ? "Did you serve in war zone?*" : `Did this ${_spousePartner} serve in war zone?*`;
    const isPersonalScreen = props?.refrencePage == 'PersonalInformation';

    konsole.log("dischargeTypeIdErr", errMsg);
    konsole.log("isPersonalScreen", isPersonalScreen, props, props?.refrencePage)
    konsole.log("veternInfosVeteran",veternInfo?.isVeteran)
    konsole.log("dsssssssssssssss",veternInfo?.isVeteran == 'Yes' , veternInfo.isVeteran !=null,"--",veternInfo?.isVeteran == 'Yes' && veternInfo.isVeteran !=null)
    return <>


        <Row className='mt-1 mb-2'>
            <CustomRadio
                tabIndex={startingTabIndex + 1}
                name='isVetern'
                options={radioValues}
                placeholder={msgUsVetern}
                onChange={(e) => handleRadioChange(e, 'isVeteran')}
                value={veternInfo.isVeteran}
            />
        </Row>

        {(veternInfo?.isVeteran == 'Yes' && veternInfo.isVeteran !=null) && (
            <div className='vetern-Info mt-3'>
                <Row>
                    <Col xs={12} md={`${(veternInfo?.wartimePeriod == '999999' && !(isPersonalScreen && displaySpouseContent)) ? 6 : ''}`} lg={isPersonalScreen && !displaySpouseContent ? 5 : 9} className="mt-2 mb-2" >
                        <CustomSelect tabIndex={startingTabIndex + 2} isError={errMsg?.wartimePeriod} label="War period*" id='wartimePeriod' name="wartimePeriod" placeholder="Select" options={warTimePeriodList} value={veternInfo?.wartimePeriod} onChange={(e) => handleRadioChange(e, 'wartimePeriod')} />
                    </Col>
                    {!(isPersonalScreen && displaySpouseContent) && (veternInfo?.wartimePeriod == '999999') &&
                        <Row>
                            <Col xs={12} md={`${(veternInfo?.wartimePeriod == '999999' && !(isPersonalScreen && displaySpouseContent)) ? 6 : ''}`} lg={isPersonalScreen && !displaySpouseContent ? 5 : 9}>
                                <Other tabIndex={startingTabIndex + 3} hanldeApiCall={hanldeApiCall} othersCategoryId={33} userId={userId} dropValue={veternInfo.wartimePeriod} ref={warTimeRef} natureId={veternInfo?.veteranId} />
                            </Col>
                        </Row>
                    }
                </Row>
                {((isPersonalScreen && displaySpouseContent) && veternInfo?.wartimePeriod == '999999') &&
                    <Row className="mt-2">
                        <Col xs={12} md={`${(veternInfo?.wartimePeriod == '999999' && !(isPersonalScreen && displaySpouseContent)) ? 6 : ''}`} lg={isPersonalScreen && !displaySpouseContent ? 5 : 9}>
                            <Other tabIndex={startingTabIndex + 4} hanldeApiCall={hanldeApiCall} othersCategoryId={33} userId={userId} dropValue={veternInfo.wartimePeriod} ref={warTimeRef} natureId={veternInfo?.veteranId} />
                        </Col>
                    </Row>
                }
                <Row>
                    <Col xs={12} md={12}>
                        <CustomRadio tabIndex={startingTabIndex + 5} isError={errMsg?.activeServiceDuration} name='activeServiceDuration' placeholder={activeServiceDurationLabel} options={radioValues} value={veternInfo.activeServiceDuration} onChange={(e) => handleRadioChange(e, 'activeServiceDuration')} />
                    </Col>
                </Row>
                <Row className='spacingBottom'>
                    <Col xs={12} md={12}>
                        <CustomRadio tabIndex={startingTabIndex + 6} isError={errMsg?.warzone} name='warzone' placeholder={msgwarZone} options={radioValues} value={veternInfo.warzone} onChange={(e) => handleRadioChange(e, 'warzone')} />

                    </Col>
                </Row>
                <Row className='spacingBottom'>
                    <Col xs={12} md={`${(veternInfo?.dischargeTypeId == '999999' && !(isPersonalScreen && displaySpouseContent)) ? 6 : ''}`} lg={isPersonalScreen && !displaySpouseContent ? 5 : 9}>
                        <CustomSelect tabIndex={startingTabIndex + 7} isError={errMsg?.dischargeTypeId} label="Discharge type*" name="dischargeTypeId" id='dischargeTypeId' placeholder="Select" options={dischargeTypeList} value={veternInfo?.dischargeTypeId} onChange={(e) => handleRadioChange(e, 'dischargeTypeId')} />
                    </Col>
                    {(!(isPersonalScreen && displaySpouseContent) && veternInfo?.dischargeTypeId == '999999') &&
                        <Row className="mt-2">
                            <Col xs={12} md={`${(veternInfo?.wartimePeriod == '999999' && !(isPersonalScreen && displaySpouseContent)) ? 6 : ''}`} lg={isPersonalScreen && !displaySpouseContent ? 5 : 9} >
                                <Other tabIndex={startingTabIndex + 8} hanldeApiCall={hanldeApiCall} othersCategoryId={32} userId={userId} dropValue={veternInfo.dischargeTypeId} ref={dischargeRef} natureId={veternInfo?.veteranId} />
                            </Col>
                        </Row>
                    }

                </Row>

                {(isPersonalScreen && displaySpouseContent && veternInfo?.dischargeTypeId == '999999') && <Row>
                    <Col xs={12} md={`${(veternInfo?.wartimePeriod == '999999' && !(isPersonalScreen && displaySpouseContent)) ? 6 : ''}`} lg={isPersonalScreen && !displaySpouseContent ? 5 : 9}>
                        <Other tabIndex={startingTabIndex + 9} hanldeApiCall={hanldeApiCall} othersCategoryId={32} userId={userId} dropValue={veternInfo.dischargeTypeId} ref={dischargeRef} natureId={veternInfo?.veteranId} />
                    </Col>
                </Row>}
            </div>
        )}
    </>
})

export default VeternComponent
