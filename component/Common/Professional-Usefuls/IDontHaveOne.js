import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { getApiCall, postApiCall } from '../../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../../components/network/UrlPath';
import { useLoader } from '../../utils/utils';
import konsole from '../../../components/control/Konsole';
import ProfessionalMetaData from './ProfessionalMetaData';
import { CustomButton } from '../../Custom/CustomButton';
import { globalContext } from '../../../pages/_app';
import { $AHelper } from '../../Helper/$AHelper';


const initialFormState = { userSubjectDataId: 0, subjectId: 0, subResponseData: '', responseId: 0 };

const IDontHaveOne = forwardRef(( props, ref ) => {
    const [formData, setformData] = useState({});
    const [showModal, setshowModal] = useState(false);
    const moreInfoRef = useRef();
    const { setWarning } = useContext(globalContext);

    useEffect(() => {
        setformData(initialFormState);
        fetchAllDatas(props.formLabelIds?.[0], props.userId);
    }, [props.formLabelIds, props.userId])

    useEffect(() => {
        if(props.disable == true && formData?.subResponseData == "true") handleInputChange(false);
        if(typeof props.setDisablePhysician == "function") props.setDisablePhysician(formData.subResponseData == "true");
    }, [props.disable, formData?.subResponseData])

    useImperativeHandle(ref, () => ({
        handleInputChange,
    }));

    const fetchAllDatas = ( formLabelIds, userId ) => {
        if(!formLabelIds || !userId) return;
        useLoader(true)
        postApiCall("POST", $Service_Url.getsubjectForFormLabelId, [formLabelIds])
        .then(res => {
            if(res?.data?.data?.length) {
                konsole.log("dbshvbhjs", formLabelIds, res.data.data)
                const _subjectId = res.data.data[0]?.subjectId || 0;
                const _responseId = res.data.data[0]?.question?.response[0]?.responseId || 0;

                setformData({
                    // userSubjectDataId: _userSubjectDataId,
                    subjectId: _subjectId,
                    // subResponseData: _response,
                    responseId: _responseId,
                })

                getApiCall("GET", $Service_Url.getSubjectResponse + userId + `/0/0/${_subjectId}`)
                .then(res2 => {
                    konsole.log("fbkjs", res2);
                    if (res2?.userSubjects?.length) {
                        const _userSubjectDataId = res2.userSubjects[0].userSubjectDataId || 0;
                        const _response = res2.userSubjects[0].response;

                        setformData({
                            userSubjectDataId: _userSubjectDataId,
                            subjectId: _subjectId,
                            subResponseData: _response,
                            responseId: _responseId,
                        })

                        konsole.log("bjkd", formData);

                    }
                    useLoader(false)
                })
            } else {
                useLoader(false)
            }
        })
    }

    const upsertIDontHave = ( _formData, userId, isUserEvent) => {
        const method = _formData.userSubjectDataId ? "PUT" : "POST";
        const url = method == "POST" ? $Service_Url.postaddusersubjectdata : $Service_Url.putSubjectResponse;
        const bodyData = method == "POST" ? [{..._formData, userId: userId}] : { userId: userId, userSubjects: [_formData]};

        postApiCall(method, url, bodyData)
        .then(res => {
            useLoader(false);
            konsole.log("bsdbv", res);
            if(res?.data?.data) setformData(_formData);
            if(method == "POST") fetchAllDatas(props.formLabelIds?.[0], props.userId);
            if(isUserEvent) setWarning("successfully", "Successfully saved data", "Your data have been saved successfully.");
        })
    }

    const handleInputChange = ( element, isUserEvent ) => {
        konsole.log("sdbjj", props.formLabelIds?.length)
        if(formData.subResponseData != "true" && props.formLabelIds?.length > 1) {
            if(showModal == false) {
                setshowModal(true);
                return;
            } else {
                moreInfoRef?.current?.upsertMetaData(props.userId);
                setshowModal(false);
            }
        }

        if((element == true && formData.subResponseData == "true") || (element == false && formData.subResponseData == "false")) return;
        useLoader(true)
        const curValue = (element?.target?.checked ?? element) === true ? "true" : "false";
        upsertIDontHave({ ...formData, subResponseData: curValue}, props.userId, isUserEvent);
    }

    return (
        <>
        {(props.disable != true) && <div className='i-dont-have-one'>
            <p>I don’t have {$AHelper.$startsWithVowel(props.profTitle) ? 'an' : 'a'} {props.profTitle}</p>
            <input type='checkbox' name='iDontHaveOne' 
                checked={formData.subResponseData == "true"} 
                onClick={(e) => handleInputChange(e, true)}
            />
        </div>}
        {(showModal == true) && 
        <div className='prof-modal'>
            <div id="newModal" className='modals'>
                <div className="modal" style={{ display: 'block'}}>
                    <div className="modal-dialog costumModal" style={{ maxWidth: '500px', margin: 'auto' }}>
                        <div className="costumModal-content">
                            <div className="modal-header">
                            <h5 className="modal-title">More Info</h5>
                            <img className='mt-0 me-1 cursor-pointer' onClick={()=> setshowModal(false)} src='/icons/closeIcon.svg'></img>
                            </div>
                            <div className="costumModal-body">
                                <ProfessionalMetaData
                                    ref={moreInfoRef}
                                    formLabels={props.formLabelIds}
                                    userId={props.userId} // DON'T GIVE USERID SO THAT IT WILL NOT FETCH OLD DATA 
                                    referPage={"iDontHave"}
                                />
                                <div className='d-flex flex-row-reverse mt-4'>
                                    <CustomButton
                                        onClick={() => handleInputChange(true, true)}
                                        label={'Save'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>}
        </>
    )
})

export default IDontHaveOne;