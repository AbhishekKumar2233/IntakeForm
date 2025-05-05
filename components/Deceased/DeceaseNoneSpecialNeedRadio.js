import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, FormGroup, } from "react-bootstrap";
import { getApiCall, isNotValidNullUndefile, livingMemberStatusId, deceaseMemberStatusId, specialNeedMemberStatusId } from '../Reusable/ReusableCom';
import { $Service_Url } from '../network/UrlPath';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from 'react-redux';
import konsole from '../control/Konsole';
import ModalForDecease from './ModalForDecease';

const DeceaseNoneSpecialNeedRadio = ({ dispatchloader, memberStatusId, memberStatusIdforTestRef, handleMemberStatusRadio, refrencePage,childName, fName, isBeneficiary, isFiduciary,genderId }) => {

    const [memberStatusList, setMemberStatusList] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectMemberStatusId, setSelectMemberStatusId] = useState('')
    konsole.log("memberStatusList", memberStatusList)
    konsole.log('memberStatusIdmemberStatusId', memberStatusId)

    useEffect(() => {
        fetchApiCall()
    }, [])

    //  *************************************_______fetch_Api_Call______******************************************************************
    const fetchApiCall = async () => {
        dispatchloader(true)
        await getApiCall('GET', $Service_Url.getMemberStatus, setMemberStatusList)
        dispatchloader(false)
    }


    //  *************************************_______Handle_Radio______******************************************************************

    const handleSelectRadio = (value) => {
        console.log('refrencePage', refrencePage, fName)
        setSelectMemberStatusId(value)
        if (refrencePage == "childdetails") {
            handleMemberStatusRadio(value)
            return;
        } else {
            if (fName) {
                if (memberStatusIdforTestRef == livingMemberStatusId && value == deceaseMemberStatusId && (isBeneficiary == true || isFiduciary == true)) {
                    handleOpenModal()
                } else if (memberStatusIdforTestRef == livingMemberStatusId && value == specialNeedMemberStatusId && (isBeneficiary == true || isFiduciary == true)) {
                    handleOpenModal()
                } else if (memberStatusIdforTestRef == specialNeedMemberStatusId && value == deceaseMemberStatusId && isBeneficiary == true) {
                    handleOpenModal()
                } else {
                    handleMemberStatusRadio(value)
                }
                return;
            } else {
                handleMemberStatusRadio(value)
            }
        }
    }

    //  *************************************_______Disable/Enable_Radio______******************************************************************

    const disableCheck = (value) => {
        if (refrencePage == 'spouseDetails' || refrencePage=='spouseComponent') {
            if (fName) {
                if (memberStatusIdforTestRef == deceaseMemberStatusId && value != deceaseMemberStatusId) {
                    return true;
                } else if (memberStatusIdforTestRef == specialNeedMemberStatusId && value == livingMemberStatusId) {
                    return true;
                }
            }
        }
        return false;
    }

    // /********************************-------------------MODAL---functions----------------------****************************************************/


    const handleModalOpenCloseWithId = () => {
        console.log('selectMemberStatusId', selectMemberStatusId)
        handleMemberStatusRadio(selectMemberStatusId)
        handleCloseModalWithoutId()
    }
    const handleCloseModalWithoutId = () => {
        setIsModalOpen(false)
    }
    const handleOpenModal = () => {
        setIsModalOpen(true)
    }


    // /********************************-------------------MODAL---functions----------------------****************************************************/

    return (
        <>
            <div className="m-0 mb-3">
                <div className="mt-3">
                    <div className='d-flex flex-row'>
                        <h2 className="emrgncy_h2 mt-1">Is this {refrencePage=='spouseComponent' ? 'spouse':'person'} ?</h2>
                        <span className='ms-2'>
                            {memberStatusList?.length > 0 && memberStatusList?.map((item, index) => {
                                return (
                                    <Form.Check
                                        type="radio"
                                        className="left-radio"
                                        name="none_decease_specialneed"
                                        inline
                                        label={item.label}
                                        checked={memberStatusId == item.value}
                                        onChange={() => handleSelectRadio(item.value)}
                                        disabled={disableCheck(item.value)}
                                    />)
                            })}
                        </span>
                    </div>
                </div>
            </div>
            
    {/* // /********************************-------------------MODAL-------------------------****************************************************/ }

            {(isModalOpen) &&
                <ModalForDecease
                    handleModalOpenCloseWithId={handleModalOpenCloseWithId}
                    isModalOpen={isModalOpen}
                    key={isModalOpen}
                    handleCloseModalWithoutId={handleCloseModalWithoutId}
                    childName={childName}
                    selectMemberStatusId={selectMemberStatusId}
                    refrencePage={refrencePage}
                    genderId={genderId}
                    memberStatusIdforTestRef={memberStatusIdforTestRef}
                />
            }
        </>
    )
}


const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps, mapDispatchToProps)(DeceaseNoneSpecialNeedRadio);