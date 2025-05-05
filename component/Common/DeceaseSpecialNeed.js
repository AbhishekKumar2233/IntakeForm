import React, { useEffect, useCallback, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../Hooks/useRedux';
import { selectApi } from '../Redux/Store/selectors';
import { fetchStatusType } from '../Redux/Reducers/apiSlice';
import konsole from '../../components/control/Konsole';
import { CustomRadio, CustomTextarea } from '../Custom/CustomComponent';
import { livingMemberStatusId, deceaseMemberStatusId, specialNeedMemberStatusId } from '../../components/Reusable/ReusableCom';

const _msgConfirmation = "These changes should be incorporated into your legal documents. Would you like to notify your legal counsel of this update?";
const _msgConfirmationSpouse = "We are sorry to learn about {{CHILD_NAME}}'s passing. It appears that {{CHILD_NAME}} has been named in a fiduciary/beneficiary capacity in different legal documents.  Please contact your legal counsel to update your documents and then update the agent assignment portion of this Portal.  You can contact your legal counsel here.";
const _textAreaDefaultVal = 'Client ({{CLINT_NAME}}) has made a change to {{GENDER_STATUS}} information form by indicating that {{CHILD_NAME}} {{RELATIONSHIPWITH_PRIMARY}} {{CHILD_DECEASE_SPECIAL_NEED}}.Please contact {{CLINT_NAME}} to review this issue.  Phone number is {{PRIMARY_MOBILE}}, email is {{PRIMARY_EMAIL}}.'
const _understandMsg = "Please understand that making the change in this organizer will have no impact on the legal documents that may affect your estate plan. We encourage you to update your legal documents to reflect this new reality. Please click below to acknowledge that you understand the importance of this matter."
const _deceasedEmail = "{{CLINT_NAME}}  has updated {{GENDER_STATUS}} information form, stating that {{CHILD_NAME}} {{RELATIONSHIPWITH_PRIMARY}} has passed away. Please reach out to {{CLINT_NAME}} for further review of this matter. The client's phone number is {{PRIMARY_MOBILE}}, and email address is {{PRIMARY_EMAIL}}."
const _specialNeedEmal = "{{CLINT_NAME}} has updated {{GENDER_STATUS}} information form, indicating that {{CHILD_NAME}} {{RELATIONSHIPWITH_PRIMARY}} has special needs. Please contact {{CLINT_NAME}} to review this matter. The client's phone number is  {{PRIMARY_MOBILE}}, and {{GENDER_STATUS}} email is {{PRIMARY_EMAIL}}."
const _bodyShowAction = ['Warning', 'Email Preview', 'Understand']

const DeceaseSpecialNeed = (props) => {

    const { detailsForMemberStatus, setPersonalDetails, dataInfo } = props;
    const dispatch = useAppDispatch();
    const apiData = useAppSelector(selectApi);
    const { memberStatusTypeList } = apiData;

    // @@ define state;
    konsole.log("dataInfo", dataInfo)
    const [memberStatusDescription, setMemberStatusDescription] = useState('');
    const [selectMemberStatusId, setSelectMemberStatusId] = useState('')

    useEffect(() => {
        if (memberStatusTypeList.length === 0) {
            dispatch(fetchStatusType());
        }
    }, [dispatch, memberStatusTypeList]);


    const handleChangeRadio = (val, key) => {
        const value = val?.value;
        setSelectMemberStatusId(value)
        if (props?.refrencePage == 'AddChildWithProgressBar') {
            handleRadio(key, value);
        } else {
            if (detailsForMemberStatus?.name) {
                const { memberStatusIdForTestRef, isFiduciaryForTest, isBeneficiaryForTest, genderId } = detailsForMemberStatus
                if (memberStatusIdForTestRef == livingMemberStatusId && value == deceaseMemberStatusId && (isFiduciaryForTest == true || isBeneficiaryForTest == true)) {
                    handleOpenModal()
                } else if (memberStatusIdForTestRef == livingMemberStatusId && value == specialNeedMemberStatusId && (isBeneficiaryForTest == true || isFiduciaryForTest == true)) {
                    handleOpenModal()
                } else if (memberStatusIdForTestRef == specialNeedMemberStatusId && value == deceaseMemberStatusId && isBeneficiaryForTest == true) {
                    handleOpenModal()
                } else {
                    handleRadio(key, value);
                }
            }
        }
    }



    const handleOpenModal = () => {
        alert("aa")
    }
    const handleRadio = useCallback((key, value) => {
        konsole.log("memberStatusId");
        konsole.log("keykey", key, value);
        setPersonalDetails(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);


    konsole.log("memberStatusTypeList", memberStatusTypeList);
    konsole.log("dataInfo", dataInfo);
    konsole.log("detailsForMemberStatus", detailsForMemberStatus)

    return (
        <>
            <>
                {/* <div className='deceased-specialneed' id='deceased-specialneed'> */}
                <Row className='mb-2 mt-3'>
                    <CustomRadio
                        placeholder='This person is'
                        name='memberStatusId'
                        options={memberStatusTypeList}
                        value={String(dataInfo?.memberStatusId)}
                        // value={'2'}
                        onChange={(e) => handleChangeRadio(e, 'memberStatusId')}
                    />
                </Row>

                <div className='vetern-Info'>
                    <Row>
                        <Col xs={12} md={8} className="mt-2">
                            <CustomTextarea
                                sError=''
                                name="memberStatusDescription"
                                placeholder="Describe..."
                                id='memberStatusDescription'
                                type='textarea'
                                rows={4}
                                onChange={(val) => setMemberStatusDescription(val)}
                                value={memberStatusDescription}

                            />
                        </Col>
                    </Row>
                </div>
            </>
        </>
    );
}

export default React.memo(DeceaseSpecialNeed);
