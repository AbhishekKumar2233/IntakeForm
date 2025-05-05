import React, { useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { OverlayTrigger, Row, Col, Tooltip } from 'react-bootstrap';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { $AHelper } from '../../Helper/$AHelper';
import MoveToNewNOldDesign from '../../Common/MoveToNewNOldDesign';
import AccountRoleChange from './AccountRoleChange';
import { paralegalAttoryId } from '../../../components/control/Constant';
import { $getServiceFn } from '../../../components/network/Service';
import { globalContext } from '../../../pages/_app';
import { confirmationMsg } from '../../../components/control/Constant';
import { useAppSelector } from '../../Hooks/useRedux';
import { selectPersonal } from '../../Redux/Store/selectors';
import Router from 'next/router';
import { demo } from '../../../components/control/Constant';
const SetUpHeader = (props) => {
    const { setConfirmation, newConfirm, setWarning } = useContext(globalContext);
    const personalSliceData = useAppSelector(selectPersonal);
    const { isSetupSidebarLink, primaryDetails } = personalSliceData

    const [isOpen, setIsOpen] = useState(false);
    const { loggedInMemberName, loggedInMemberDetail, loggedInMemberRoleId,primaryMemberFirstName, primaryMemberFullName, spouseFirstName, isPrimaryMemberMaritalStatus } = usePrimaryUserId();
    const [loggedInMember, setloggedInMember] = useState('');
    const [loggedInRoleId, setLogedInRoleId] = useState('');
    const [isAccountRoleChangeOpen, setIsAccountRoleChangeOpen] = useState(false)
    const dropdownRef = useRef(null);

    useEffect(() => {
        const loggedInMember = JSON.parse(sessionStorage.getItem("userLoggedInDetail"));
        const stateObj = JSON.parse(sessionStorage.getItem('stateObj'));
        setloggedInMember(loggedInMember)
        setLogedInRoleId(stateObj?.roleId)
    }, [])

    const getGreeting = () => {
        const currentHour = new Date().getHours();
  
        if (currentHour < 12) {
          return 'Good Morning';
        } else if (currentHour >= 12 && currentHour < 18) {
          return 'Good Afternoon';
        } else {
          return 'Good Evening';
        }
    }

    const handleOptionClick = () => {
        if (isAccountRoleChangeOpen == false) {
            setIsOpen(false);
        }
    };

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target) && isAccountRoleChangeOpen == false) {
            setIsOpen(false);
        }
    }, [isAccountRoleChangeOpen]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside, isAccountRoleChangeOpen]);

    const handleLogout = async () => {
        const confirmRes = await newConfirm(true, confirmationMsg, "Permission");
        if (!confirmRes) return;
        $getServiceFn.handleLogout();
    }


    // @@ display profile URL
    const userProfileURL = useMemo(() => {
        let url = `/icons/ProfilebrandColor2.svg`;
        let urlApi = loggedInMemberDetail?.fileUrl || loggedInMemberDetail?.member?.fileUrl
        if ($AHelper.$isNotNullUndefine(urlApi)) {
            url = urlApi
        }
        return url;
    }, [loggedInMemberDetail])

    // console.log('userProfileURLHeader', userProfileURL,"loggedInMember",loggedInMember)


    const renderedOptions = useMemo(() => {
        return (
            <>
                <div className='ps-4'>
                    <div className='data_Option'>
                        <img src={userProfileURL} alt='Icon' style={{ borderRadius: '50%', width: '45px', height: '45px',  objectFit: 'cover', display: 'block', }}/>
                        <h3>{loggedInMember?.primaryEmailId}</h3>
                    </div>
                    <hr style={{ color: "lightgrey" }} />
                </div>
                {(paralegalAttoryId.includes(loggedInRoleId)) && (
                    // <li>
                    //     <div className='setting'>
                    //         <img className='mt-0' src='/New/image/settingIcon.svg' alt='Icon' />
                    <AccountRoleChange refrencePage='SetupHeader' setIsAccountRoleChangeOpen={setIsAccountRoleChangeOpen} isPortalSignOn={props?.isPortalSignOn} />
                    //     </div>
                    // </li>
                )}
              

                {!paralegalAttoryId.includes(loggedInRoleId) && (props?.parentReference != "ActivationForm") && <li className='mt-1' onClick={() => Router.push(`/setup-dashboard/AccountSettings`)}>
                    <div className='setting' >
                        <img className='mt-0' src="/settingsIcon.svg" alt='Icon' />
                        <h3>Account Settings</h3>
                    </div>
                </li>}
                <li className='mt-1' onClick={() => handleLogout()}>
                    <div className='setting'>
                        <img className='mt-0' src='/New/image/logOutIcon.svg' alt='Icon' />
                        <h3>Logout</h3>
                    </div>
                </li>
            </>
        );
    }, [handleOptionClick, isAccountRoleChangeOpen]);


    const tooltipMsg = {
        3: 'Back to Paralegal',
        13: 'Back to Attorney',
        14: 'Back to Legal Assistant',
        15: 'Back to Law Office Staff'
    }

    const backLegal = () => {
        const searchItem = sessionStorage.getItem('searchItem')
        let url = `/paralegal?toogle=2&search=${searchItem}`
        Router.push(url);
    }

    return (
        <>

            <Row id='setupHeader' className='setup-header' ref={dropdownRef}>
                <Col md={2} lg={2} xl={2} className='cursor-pointer' onClick={() => {
                    const path = window.location.pathname + (window.location.search || "");
                    if(props?.isPortalSignOn) Router.push(path);
                }} style={{ minWidth: '155px'}} >
                    <img className='image_logo' src="https://devintakeformdocs.blob.core.windows.net/aodocs/2/9/17/fz0nbiolos4.png" alt="Logo" />
                </Col>
                    <Col id='layout-child-1' className='me-3' md={6} lg={6} xl={6}>
                    <div className='content-1' style={{ padding: " 7px 0px 0px" }}>{getGreeting()},{primaryMemberFirstName && ` ${primaryMemberFirstName}${(isPrimaryMemberMaritalStatus && spouseFirstName) ? ` & ${spouseFirstName}` : ''}`}</div>
                    <div className='content-2'>Welcome back!</div>
                    </Col>
        
                <Col className='header_part custom-select-field' md={4} lg={4} xl={4}  style={{ marginLeft: "auto" }}>
                    {(!props?.isPortalSignOn && paralegalAttoryId.includes(loggedInRoleId)) &&
                        <div className='d-flex align-items-center mt-3'>
                            <div className='d-flex align-items-center'>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-disabled" style={{ marginBottom: "-16px" }}>  {tooltipMsg[Number(loggedInMemberRoleId)]} </Tooltip>}>
                                    <span className="d-inline-block" style={{ padding: "5px 0px", margin: "0" }} onClick={() => backLegal()}><img className="menu2" src="/New/icons/Arrow-white.svg" style={{ cursor: "pointer", transform: "rotate(180deg)" }} alt="Back Icon" />  </span>
                                </OverlayTrigger>
                            </div>
                        </div>
                    }
  
                    <div className='header_Icon d-flex align-items-center cursor-pointer'>
                        <img src={userProfileURL} alt="Profile Icon" style={{ borderRadius: '50%', width: '45px',  height: '45px', objectFit: 'cover',  display: 'block',  border:'1px solid #939393'}} />
                    </div>
                    <h3>{loggedInMemberName}</h3>
                    <div className='h_selectIcon' onClick={() => setIsOpen(!isOpen)}>
                        <img src='/New/image/headerIcon.svg' alt="Header Icon" className='cursor-pointer' />
                    </div>
                    {isOpen && (
                        <ul className="dropdown-options_h useNewDesignSCSS">
                            {renderedOptions}
                        </ul>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default SetUpHeader;


