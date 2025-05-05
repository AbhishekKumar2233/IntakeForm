import React, { useEffect, useCallback, useState, useMemo, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { selectApi } from '../../Redux/Store/selectors';
import { fetchStatusType } from '../../Redux/Reducers/apiSlice';
import konsole from '../../../components/control/Konsole';
import { CustomRadio, CustomTextarea } from '../../Custom/CustomComponent';
import { livingMemberStatusId, deceaseMemberStatusId, specialNeedMemberStatusId, isNotValidNullUndefile } from '../../../components/Reusable/ReusableCom';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import DeceasedModal from '../DeceasedModal';

const DeceaseSpecialNeed = (props) => {

    const { detailsForMemberStatus, setPersonalDetails, refrencePage, dataInfo } = props;
    const { primaryDetails, primaryMemberFullName, loggedInUserId,primaryMemberContactDetails } = usePrimaryUserId()
    const dispatch = useAppDispatch();
    const apiData = useAppSelector(selectApi);
    const { memberStatusTypeList } = apiData;

    // @@ define state 
    konsole.log("dataInfoprimaryDetails",primaryDetails, dataInfo);
    const [memberStatusDescription, setMemberStatusDescription] = useState('');
    const [selectMemberStatusId, setSelectMemberStatusId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const startingTabIndex = props?.startTabIndex ?? 0;
    

    useEffect(() => {
        if (memberStatusTypeList.length === 0) {
            dispatch(fetchStatusType());
        }
    }, [dispatch, memberStatusTypeList]);



    // @@ handle change radio
    const handleChangeRadio = (val, key) => {
        konsole.log("aakakakka", key, val)
        const value = val?.value;
        setSelectMemberStatusId(value)
        if (props?.refrencePage == 'AddChildWithProgressBar' || props.refrencePage == 'AddFiduciaryBeneficiary') {
            handleRadio(key, value);
        } else {
            if (detailsForMemberStatus?.name) {
                const { memberStatusIdForTestRef, isFiduciaryForTest, isBeneficiaryForTest, genderId } = detailsForMemberStatus
                if (memberStatusIdForTestRef == livingMemberStatusId && value == deceaseMemberStatusId && (isFiduciaryForTest == true || isBeneficiaryForTest == true)) {
                    handleOpenModal(true)
                } else if (memberStatusIdForTestRef == livingMemberStatusId && value == specialNeedMemberStatusId && (isBeneficiaryForTest == true || isFiduciaryForTest == true)) {
                    handleOpenModal(true)
                } else if (memberStatusIdForTestRef == specialNeedMemberStatusId && value == deceaseMemberStatusId && isBeneficiaryForTest == true) {
                    handleOpenModal(true)
                } else {
                    handleRadio(key, value);
                }
            } else {
                handleRadio(key, value);
            }
        }
    }
    // @@update member status Id
    const handleRadio = useCallback((key, value) => {
        konsole.log("memberStatusId");
        konsole.log("keykey", key, value);
        setPersonalDetails(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);



    // Modal close with update member status is 
    const handleModalOpenChange = () => {
        handleRadio('memberStatusId', selectMemberStatusId)
        handleOpenModal(false)
    }


    const handleOpenModal = (val) => {
        setIsModalOpen(val)
    }

    // @@ Rado disabled condition
    const disableCheck = useCallback((value) => {
        konsole.log("valuevalue", value)
        if (refrencePage == 'EditChildWithAccordian' || (refrencePage == 'PersonalInformation') || refrencePage == 'EditFiduciaryBeneficiary') {
            const testValue = props?.detailsForMemberStatus?.memberStatusIdForTestRef
            konsole.log("valuevalue2", props, value, testValue, props)
            if (testValue == deceaseMemberStatusId && value != deceaseMemberStatusId) {
                konsole.log("valuevalue3", value)
                return true;
            } else if (testValue == specialNeedMemberStatusId && value == livingMemberStatusId) {
                konsole.log("valuevaluea4", value)
                return true;
            }
        }
        return false;
    }, [props])
    // konsole.log("disableCheckRadio", disableCheckRadio)
    konsole.log("memberStatusTypeList", memberStatusTypeList);
    konsole.log("dataInfovalue", dataInfo);
    konsole.log("detailsForMemberStatus", detailsForMemberStatus)
    konsole.log("DeceaseddataInfo", dataInfo)

    const handleKeyDownForCheckbox = (event, item, field) => {
        if (event?.key == "Enter" && !disableCheck(item?.value)) {
            const isChecked = item?.value == String(dataInfo?.memberStatusId);
            if (!isChecked) {
                handleChangeRadio(item, field);
            }
            event?.preventDefault();
        }
    };

    return (
        <>
            <>
                <Row className='mb-2'>

                    {/* @@ RADIO OF DECEASED SPECIAL NEED */}
                    <div className={" p-0 radio-container d-flex flex-column mt-0"}>
                        <p className='mt-3 mb-1'>{'This person is'}</p>
                        <div className={"d-flex gap-1"}>
                            {memberStatusTypeList?.map((item) => (
                                <label key={item.value} className={`radio-label mt-2 mb-0 custom-checkbox ${item.label !== 'Living' ? 'mx-2' : ''}`} onKeyDown={(event) => handleKeyDownForCheckbox(event, item, 'memberStatusId')}>
                                <input  className="me-2" value={item.value} type="checkbox"  onChange={() => handleChangeRadio(item, 'memberStatusId')} disabled={disableCheck(item?.value)} checked={item?.value == String(dataInfo?.memberStatusId)}/>
                                <span  tabIndex={startingTabIndex + 1}  className="checkmark"></span>
                                <p className="customCheckBox ms-2">{item?.label}</p>
                            </label>
                            ))}
                        </div>
                    </div>
                </Row>
                {/* DESCROIPTION OF DECEASE/SPECIAL NEED */}
                {(dataInfo?.memberStatusId == deceaseMemberStatusId || dataInfo?.memberStatusId == specialNeedMemberStatusId) &&
                    <div className='vetern-Info'>
                        <Row>
                            <Col xs={12} md={6} lg={refrencePage === 'PersonalInformation' ? 9 : 5} className="mt-2">
                                <CustomTextarea
                                   tabIndex={startingTabIndex + 2} 
                                    sError=''
                                    name="memberStatusDesc"
                                    placeholder="Describe..."
                                    id='memberStatusDesc'
                                    type='textarea'
                                    rows={4}
                                    onChange={(val) => handleRadio("memberStatusDesc", val)}
                                    value={dataInfo?.memberStatusDesc || ''}

                                />
                            </Col>
                        </Row>
                    </div>
                }
            </>


            {/* @@ MODAL FOR EMAIL PREVIEW */}
            {isModalOpen &&
                <>
                    <DeceasedModal
                          tabIndex={startingTabIndex + 3} 
                        isModalOpen={isModalOpen}
                        handleOpenModal={handleOpenModal}
                        handleModalOpenChange={handleModalOpenChange}
                        key={isModalOpen}
                        childName={detailsForMemberStatus?.name}
                        selectMemberStatusId={selectMemberStatusId}
                        refrencePage={props?.refrencePage}
                        genderId={detailsForMemberStatus?.genderId}
                        primaryMemberFullName={primaryMemberFullName}
                        memberStatusIdforTestRef={detailsForMemberStatus?.memberStatusIdForTestRef}
                        loggedInUserId={loggedInUserId}
                        dataInfo={dataInfo}
                        livingMemberStatusId={livingMemberStatusId}
                        deceaseMemberStatusId={deceaseMemberStatusId}

                    />

                </>
            }
            {/* @@ MODAL FOR EMAIL PREVIEW */}
        </>
    );
}



export default React.memo(DeceaseSpecialNeed);
