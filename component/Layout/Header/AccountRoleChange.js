import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { $AHelper } from '../../Helper/$AHelper';
import { useAppSelector } from '../../Hooks/useRedux';
import { useAppDispatch } from '../../Hooks/useRedux';
import { selectPersonal } from '../../Redux/Store/selectors';
import { updateLoginMemberRoles } from '../../Redux/Reducers/personalSlice';
import { getApiCall, getApiCall2 } from '../../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../../components/network/UrlPath';
import konsole from '../../../components/control/Konsole';
import { CustomSearchSelect } from '../../Custom/CustomComponent';
import { useLoader } from '../../utils/utils';
import { CustomButton } from '../../Custom/CustomButton';
import { globalContext } from '../../../pages/_app';
import { EventBaseUrl, CounterBaseUrl, CounterMobileBaseUrl, AoAdminBaseUrl, AoPartnerBaseUrl, AoAcaddemyUrl, IntakeEntryBaseUrl, lpoiceLink, AoAgenturl, intakeBaseUrl, lpoLiteUrl, paralegalAttoryId, PortalSignOnUrl } from '../../../components/control/Constant';
import CustomLoader from '../../Custom/CustomLoader';
const AccountRoleChange = (props) => {
    const { setConfirmation, confirm, setWarning } = useContext(globalContext)
    let header = 'Account';
    const PortalSignOnRoleId = "PortalSignOn";

    const dispatch = useAppDispatch()
    const personalInfo = useAppSelector(selectPersonal);
    const { loginMemberRoles } = personalInfo;
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [isError, setIsError] = useState(false);
    const [isAccountRoleChange, setIsAccountRoleChange] = useState(false)
    const [showLoader, setShowLoader] = useState(false)
    useEffect(() => {
        const stateObj = JSON.parse(sessionStorage.getItem('stateObj'));
        if (loginMemberRoles.length == 0 && paralegalAttoryId.includes(stateObj.roleId)) {
            fetchRole()
        }
    }, [])
    const handleUserLoader = (val) => {
        setShowLoader(val)
    }

    const fetchRole = async () => {
        let loggedInUserId = sessionStorage.getItem('loggedUserId')
        let userLoggedInDetail = JSON.parse(sessionStorage.getItem('userLoggedInDetail'));
        let url = $Service_Url.getUserDetailByEmailId + '=' + loggedInUserId;
        handleUserLoader(true);
        const _resultOf = await getApiCall2("GET", url, '');
        handleUserLoader(false);
        konsole.log("_resultOf", _resultOf);
        if (_resultOf != 'err' && _resultOf?.data?.length > 0) {
            const resData = _resultOf?.data[0];
            dispatch(updateLoginMemberRoles(resData?.roleDetails))
        } else {
            dispatch(updateLoginMemberRoles([]))
        }
    }
    function getRoleLabel(roleId) {
        const urlMap = {
            '1': intakeBaseUrl + 'login',
            '3': intakeBaseUrl,
            '4': AoAdminBaseUrl,
            '5': AoAgenturl,
            '6': CounterBaseUrl,
            '7': CounterBaseUrl,
            '8': CounterBaseUrl,
            '10': intakeBaseUrl,
            '11': AoAdminBaseUrl,
            '13': intakeBaseUrl,
            '14': intakeBaseUrl,
            '15': intakeBaseUrl,
            '16': CounterMobileBaseUrl,
            '21': IntakeEntryBaseUrl,
            [PortalSignOnRoleId]: PortalSignOnUrl,
        };
        return urlMap[roleId] || '';
    }
    const handleContinue = () => {
        if (!$AHelper.$isNotNullUndefine(selectedRoleId)) {
            setIsError(true);
            return;
        }
        let stateObj = JSON.parse(sessionStorage.getItem('stateObj'));
        let loggedInUserId = sessionStorage.getItem('loggedUserId');
        let isLegalStaff = selectedRoleId == PortalSignOnRoleId;
        let roleId = isLegalStaff ? stateObj?.roleId : selectedRoleId;
        konsole.log("stateObj", stateObj, stateObj?.appState)
        let tokenKey = `appState=${stateObj?.appState}&userId=${loggedInUserId}&roleId=${roleId}&loggenInId=${stateObj?.loggenInId}&legalStaff=${isLegalStaff}`;
        konsole.log("tokenKey", tokenKey)
        let roleUrl = getRoleLabel(selectedRoleId);
        konsole.log("roleUrl", roleUrl)
        if (!$AHelper.$isNotNullUndefine(roleUrl)) {
            toasterAlert("warning", "Warning", "Something went wrong. Please contact your Administrator.")
            return;
        }
        let redirectUrl = `${roleUrl}?token=${window.btoa(tokenKey)}`
        konsole.log("redirectUrl", redirectUrl)
        // window.open(redirectUrl, "_blank");
        sessionStorage.clear();
        window.location.replace(redirectUrl);
    }

    console.log("loginMemberRolesloginMemberRoles", loginMemberRoles)

    const logUserRoles = useMemo(() => {
        if (!loginMemberRoles || (typeof sessionStorage == "undefined")) return [];
 
        const newLoginMemberRoles = [ 
            ...loginMemberRoles, 
            {
                roleId: PortalSignOnRoleId,
                roleName: "Sign-In On App",
                userId: stateObj?.userId
            }
        ]
        const stateObj = JSON.parse(sessionStorage.getItem('stateObj'));
        const userLoggedInDetail = JSON.parse(sessionStorage.getItem('userLoggedInDetail'));

        let userRoles = paralegalAttoryId.includes(stateObj?.roleId) ? 
            newLoginMemberRoles?.filter((item) => (props?.isPortalSignOn == true ? item.roleId != PortalSignOnRoleId : item.roleId != userLoggedInDetail?.roleId) && item?.roleId != 2 && item?.roleId != 20 & item.roleId != 9 && item.roleId != 7 && item.roleId != 8 && item.roleId != 12 && item.roleId != 19 && item.roleId != 17 && item.roleId != 18)?.map((i) => ({ ...i, value: i.roleId, label: i.roleName }))
            : [];
        
        konsole.log("logUserRols", paralegalAttoryId.includes(stateObj?.roleId), userRoles);
    
        const sortOrder = [3, 13, 14, 15, 4, 11, 6, 16];
    
        // Create a shallow copy of the array before sorting
        const sortedRoles = [...userRoles]?.sort((a, b) => {
            const indexA = sortOrder.indexOf(Number(a.roleId));
            const indexB = sortOrder.indexOf(Number(b.roleId));
    
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    
        return sortedRoles;
    }, [loginMemberRoles]);
    

    const handleOpenModal = (val) => {
        setIsAccountRoleChange(val);
        props?.setIsAccountRoleChangeOpen?.(val);
    }

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }
    konsole.log("logUserRoles", logUserRoles);

    return (
        <>
            {showLoader && <CustomLoader />}
            {(logUserRoles.length > 0) &&
                <>
                    {(props?.refrencePage == 'SetupHeader') ? <>
                        <li>
                            <div className='setting' onClick={() => handleOpenModal(true)}>
                                <img className='mt-0' src='/New/image/settingIcon.svg' alt='Icon' />
                                <h3 onClick={() => handleOpenModal(true)}>Switch Account</h3>
                            </div>
                        </li>
                    </> :
                        <CustomButton label='Switch Account' onClick={() => handleOpenModal(true)} />
                    }
                    <div id='custom-modal-container' className='custom-modal-container' style={{ zIndex: "100000" }}>
                        <Modal show={isAccountRoleChange} className='useNewDesignSCSS' size={'md'} id='custom-modal-container2' aria-labelledby="contained-modal-title-vcenter" centered>
                            <Modal.Header >
                                <div className='row justify-content-between w-100'>
                                    <div className='row justify-content-between w-100 m-0 p-0'>
                                        <div className='col-1'>
                                            <img src="/New/icons/whiteBackArrowIcon.svg" onClick={() => handleOpenModal(false)} className='cursor-pointer' />
                                        </div>
                                        <div className='col-5'>
                                            <p className='warningHeading text-center'>{header}</p>
                                        </div>
                                        <div className='col-1'>
                                            <img src="/New/icons/whiteCrossIcon.svg" className='cursor-pointer' onClick={() => handleOpenModal(false)} />
                                        </div>
                                    </div>
                                </div>
                            </Modal.Header>
                            <Modal.Body>
                                <div className='mt-2 mb-4'>
                                    <Row>
                                        <Col>
                                            <CustomSearchSelect
                                                tabIndex={1}
                                                isError={(isError == true) ? 'Please select a role' : ''}
                                                label='Here are the accounts you can switch between'
                                                placeholder='Select'
                                                options={logUserRoles}
                                                value={selectedRoleId}
                                                onChange={(val) => { setIsError(false), setSelectedRoleId(val.roleId) }}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <CustomButton label='Continue' onClick={() => handleContinue()} />
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                </>
            }
        </>
    )
}

export default AccountRoleChange
