import React, { useEffect, useState } from 'react';
import konsole from '../control/Konsole';
import { deceaseMemberStatusId, isValidateNullUndefine, specialNeedMemberStatusId, livingMemberStatusId, getApiCall, isNotValidNullUndefile } from '../Reusable/ReusableCom';
import { $Service_Url } from '../network/UrlPath';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { connect } from 'react-redux';
import { SET_LOADER } from '../Store/Actions/action';
const TableEditAndViewForDecease = ({ dispatchloader, ownerUserId, isOwner, actionType, forUpdateValue, memberUserId, handleUpdateFun, handleDeleteFun, type, userId, refrencePage }) => {
    const loggedInUserId = sessionStorage.getItem('loggedUserId')
    const [isDeceasedMember, setIsDeceasedMember] = useState(false)
    const [memberStausId, setMemberStatusId] = useState(null)
    useEffect(() => {
        if (isNotValidNullUndefile(memberUserId)) {
            getMemberInfo()
        } else if (isOwner == true) {
            ownerInfo()
        }
        return () => { };
    }, [memberUserId, ownerUserId]);

    console.log('isOwnerisOwner', memberUserId, isOwner)
    const getMemberInfo = async () => {
        dispatchloader(true)
        const result = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + memberUserId);
        konsole.log('result of memberdetail', result)
        dispatchloader(false)
        if (result == 'err') return;
        const memberStatusId = result?.member?.memberStatusId;
        setMemberStatusId(memberStatusId)
        if (actionType === 'Fiduciary') {
            setIsDeceasedMember(memberStatusId == deceaseMemberStatusId || memberStatusId == specialNeedMemberStatusId);
            if ((memberStatusId == deceaseMemberStatusId || memberStatusId == specialNeedMemberStatusId) == false && isOwner == true) {
                const _result = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + ownerUserId);
                konsole.log('_result_resultbb', _result)
                if (_result == 'err') return;
                const _memberStatusId = result?.member?.memberStatusId;
                konsole.log('_memberStatusId', _memberStatusId)
                setIsDeceasedMember(_memberStatusId == deceaseMemberStatusId || _memberStatusId == specialNeedMemberStatusId);
            }
        } else if (actionType === 'Beneficiary') {
            setIsDeceasedMember(memberStatusId == deceaseMemberStatusId);
            if ((memberStatusId == deceaseMemberStatusId) == false && isOwner == true) {
                const _result = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + ownerUserId);
                konsole.log('_result_resultaaa', _result)
                if (_result == 'err') return;
                const _memberStatusId = _result?.member?.memberStatusId;
                konsole.log('_memberStatusId', _memberStatusId, deceaseMemberStatusId, _memberStatusId == deceaseMemberStatusId)
                setIsDeceasedMember(_memberStatusId == deceaseMemberStatusId);
            }
        } else if (actionType === 'Owner') {
            setIsDeceasedMember(memberStatusId == deceaseMemberStatusId);
        }
    }
    const ownerInfo = async () => {
        const _result = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + ownerUserId);
        konsole.log('_result_resultaaa', _result)
        if (_result == 'err') return;
        const _memberStatusId = _result?.member?.memberStatusId;
        konsole.log('_memberStatusId', _memberStatusId, deceaseMemberStatusId, _memberStatusId == deceaseMemberStatusId)
        setIsDeceasedMember(_memberStatusId == deceaseMemberStatusId);

    }


    const deleteFun = () => {
        konsole.log('refrencePagerefrencePage', refrencePage)

        if (refrencePage == "FiduciaryAssignmentForm") {
            handleDeleteFun(type, forUpdateValue, userId, loggedInUserId)
        } else if (refrencePage == 'NonRetirementAssets' || refrencePage == "RetirementAssets" || refrencePage == "LifeInsuraneForm") {
            handleDeleteFun(forUpdateValue)
        } else {
            handleDeleteFun(forUpdateValue)
        }
    }

    const msgObj = {
        2: "As the fiduciary member living status changed to deceased, please remove the deceased member from the documents",
        3: "As the fiduciary member living status changed to special needs, please remove the special needs member from the documents",
        'msgBeneficiary': " As the beneficiary member living status changed to deceased, please remove the deceased member from the documents."
    }

    const tooltip = (
        <Tooltip id="tooltip-disabeld" style={{ zIndex: "9999999999" }}>
            {(actionType === 'Beneficiary') ? msgObj['msgBeneficiary'] : msgObj[Number(memberStausId)]}
        </Tooltip>
    );
    konsole.log('isDeceasedMember', isDeceasedMember)

    return (
        <>
            <div className='d-flex justify-content-center gap-2'>
                {(isDeceasedMember == false) && (
                    <div className='d-flex flex-column align-items-center' onClick={() => handleUpdateFun(forUpdateValue, type)}>
                        <img className="cursor-pointer mt-0" src="/icons/EditIcon.png" alt="Mortgages" style={{ width: "20px" }} />
                    </div>)}
                {(isDeceasedMember) && <>
                    <OverlayTrigger overlay={tooltip} >
                        <img style={{ cursor: "pointer", width: "20px", marginBottom: ".30rem", marginLeft: "2px" }} src="/icons/information.png" />
                    </OverlayTrigger>
                </>}
                <span style={{ borderLeft: "2px solid #e6e6e6", paddingLeft: "5px", height: "20px" }} className="cursor-pointer" onClick={() => deleteFun()}  >
                    <img src='/icons/deleteIcon.svg' alt='g4' className='cursor-pointer mt-0' style={{ width: "20px" }} />
                </span>
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps, mapDispatchToProps)(TableEditAndViewForDecease);
