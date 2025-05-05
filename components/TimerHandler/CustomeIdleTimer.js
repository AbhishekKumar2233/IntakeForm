'use client'

import { useEffect, useRef, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useIdleTimer } from 'react-idle-timer'
import konsole from '../control/Konsole';
import { useLoader } from '../../component/utils/utils';
import { getApiCall, postApiCall } from '../Reusable/ReusableCom';
import { $Service_Url } from '../network/UrlPath';
import { demo, logoutUrl } from '../control/Constant';
import { $ApiHelper } from '../../component/Helper/$ApiHelper';
import { specialIPv4, specialRoleIds, specialUserIds } from '../../component/Helper/Constant';

export default function CustomeIdleTimer() {

    const [state, setState] = useState('Active')
    const [isSpecialUser, setIsSpecialUser] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const timeout = isSpecialUser ? 235 * 60 * 1000 : 15 * 60 * 1000;
    const promptBeforeIdle = isSpecialUser ? 5 * 60 * 1000 : 1 * 60 * 1000;
    const [remaining, setRemaining] = useState(timeout / 1000)
    const [open, setOpen] = useState(false)
    const [activeButton, setActiveButton] = useState('continue')
    const [logoutClicked, setLogoutClicked] = useState(false);
    


    useEffect(() => {
        initiateProcess();
    }, []);

    const initiateProcess = async () => {
        const userId = sessionStorage.getItem('loggedUserId');
        const stateObj = JSON.parse(sessionStorage.getItem('stateObj'));
        const loggedInRoleId = stateObj?.roleId;

        setLoggedInUserId(userId);

        // checking for specialUser
        if(specialUserIds?.some(ele => ele?.value == userId)) return setIsSpecialUser(true);

        const userIPv4 = await $ApiHelper.$getUserIPv4();
        if(specialIPv4?.some(ele => ele?.value == userIPv4) && specialRoleIds?.some(ele => ele?.value == loggedInRoleId)) return setIsSpecialUser(true);
    }

    const logoutCalled = useRef(false);

    const onIdle = () => {
        setState('Idle')
        setOpen(false)
    }

    const onActive = () => {
        setState('Active')
        setOpen(false)
    }

    const onPrompt = () => {
        setState('Prompted')
        setOpen(true)
        setActiveButton('continue')
    }

    const { getRemainingTime, activate, pause } = useIdleTimer({
        onIdle,
        onActive,
        onPrompt,
        timeout,
        promptBeforeIdle,
        throttle: 500
    })

    const postLogout = async () => {
        return new Promise(async (resolve) => {
            if (logoutCalled.current) {
                resolve(false);
                return;
            }
            logoutCalled.current = true;
            const stateObj = JSON.parse(sessionStorage.getItem('stateObj'));
            const params = `${stateObj?.userId}/${stateObj?.appState}/${stateObj?.loggenInId}/${stateObj?.roleId}`
            useLoader(true)
            const resultOf = await getApiCall('GET', $Service_Url.postLogUserout + params)
            konsole.log(resultOf, "resultOf")
            useLoader(false)
            resolve(true)

        })

    }

    useEffect(() => {
        // if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        //     pause();
        //     return;
        // }
        const interval = setInterval(async () => {
            const remainingTime = Math.ceil(getRemainingTime() / 1000);
            setRemaining(remainingTime); 
            // konsole.log("remainingTime", formatTime(remainingTime));

            if (remainingTime <= 0 && !logoutClicked) {
                setOpen(false)
                const result = await postLogout();
                console.log("result", result)
                if (result == true) {
                    window.location.href = `${logoutUrl}Account/Signin?expired=true`;
                    sessionStorage?.clear()
                }
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [getRemainingTime]);

    const getSubtenantDetails = async () => {
        const subtenantId = sessionStorage.getItem("subtenantID")

        let subtenantObj = {
            subtenantId: subtenantId
        }
        useLoader(true)
        const resultOf = await postApiCall('POST', $Service_Url.getSubtenantDetails, subtenantObj)
        useLoader(false)
    }

    const handleStillHere = () => {
        getSubtenantDetails();
        activate()
        setOpen(false);
        setActiveButton('')
    }

    const handleLogoutNow = () => {
        setOpen(false)
        setLogoutClicked(true);
        sessionStorage?.clear()
        window.location.href = `${logoutUrl}Account/SignIn`;
    }

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
    };

    const formatedTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${String(minutes)?.padStart(2, '0')} : ${String(secs)?.padStart(2, '0')}`
    }

    return (
        <>
            <Modal id="idleTimerModal" show={open} enforceFocus={false} onHide={handleStillHere} className={`customModal ${open ? 'slide-down' : ''} useNewDesignSCSS`}>
                <Modal.Header closeButton className="d-flex justify-content-between"></Modal.Header>
                <Modal.Body className='text-center'>
                    <Col className='d-flex justify-content-center'>
                        <Row className='idleTimerClock'>
                            <img src='/icons/idleTimerClock.svg' />
                        </Row>
                    </Col>
                    <Col className='idleTimerContent'>
                        <Row>
                            <h1>Are you still here?</h1>
                        </Row>
                        <Row>
                            <p className='pt-0'>In order to keep your account safe, we periodically check to see if you’re still here. You can stay logged in by clicking below.</p>
                        </Row>
                    </Col>
                    <Col className='idleTimerSession'>
                        <Row>
                            <h3 className='pb-0'>Your current session will expire in:</h3>
                        </Row>
                        <Row>
                            <h2>{formatedTime(remaining)}</h2>
                        </Row>
                    </Col>
                    <Col className='idleTimerButton'>
                        <Row>
                            <Col>
                                <button
                                    onMouseEnter={() => setActiveButton('logout')}
                                    onMouseLeave={() => setActiveButton('continue')}
                                    onClick={handleLogoutNow}
                                    className={activeButton === 'logout' ? 'active' : ''}
                                >
                                    Log out now
                                </button>
                            </Col>
                            <Col>
                                <button
                                    onMouseEnter={() => setActiveButton('continue')}
                                    onMouseLeave={() => setActiveButton('continue')}
                                    onClick={handleStillHere}
                                    className={activeButton === 'continue' ? 'active' : ''}
                                >
                                    Continue session
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}