'use client'

import Head from 'next/head';
import React, { useCallback, memo, useEffect,useState,useContext} from 'react';
// import SetUpHeader from './Header/SetupHeader';
import { Container, Row, Col } from 'react-bootstrap';
// import SetupSidebar from './Sidebar/SetupSidebar';
// import { $dashboardLinks } from '../Helper/Constant';
import { $AHelper } from '../Helper/$AHelper';
// import { CustomInput, CustomSelect } from '../Custom/CustomComponent';
// import { useSelector } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../Hooks/useRedux';
import { selectActiveNavbarItem, selectApi, selectPersonal, selectShowLoader } from '../Redux/Store/selectors';
// import { setLoaderState, setActiveNavbarState, resetCompleteStore } from '../utils/utils.js';
import konsole from '../../components/control/Konsole.js';
import CustomLoader from '../Custom/CustomLoader.js';
import { fetchLoginMemberDetails, fetchPrimaryDetails, fetchSpouseDetails,setSpouseMemberDetails,fetchPrimaryMemberContactDetials, setSessionData } from '../Redux/Reducers/personalSlice.js';
import { useLoader } from '../utils/utils.js';
import usePrimaryUserId from '../Hooks/usePrimaryUserId.js';
// import SetUpHeader from './Header/SetUpHeader.js';
// import CustomeIdleTimer from '../../components/TimerHandler/CustomeIdleTimer.js';
import { deceaseSpouseRelationId, getApiCall } from '../../components/Reusable/ReusableCom.js';
import { $Service_Url } from '../../components/network/UrlPath.js';
import { logoutUrl } from '../../components/control/Constant.js';
import { $CommonServiceFn } from '../../components/network/Service.js';
// import Feedback from '../Feedback/Feedback.js';
// import AddNotes from '../../components/AddNotes.js';
import { paralegalAttoryId } from '../../components/control/Constant.js';
import { globalContext } from '../../pages/_app.js';
import { clearSessionActiveTabData } from '../Hooks/usePersistActiveTab.js';
import dynamic from 'next/dynamic.js';

const CustomeIdleTimer = dynamic(() => import('../../components/TimerHandler/CustomeIdleTimer.js'), { ssr: false });
const Feedback = dynamic(() => import('../Feedback/Feedback.js'), { ssr: false });
const AddNotes = dynamic(() => import('../../components/AddNotes.js'), { ssr: false });
const SetUpHeader = dynamic(() => import('./Header/SetUpHeader.js'), { ssr: false });
const SetupSidebar = dynamic(() => import('./Sidebar/SetupSidebar'), { ssr: false}); 


const SetupLayout = memo(({ children, id, hideAllContent,agentActivetab,setAgentactivetab }) => {

    const dispatch = useAppDispatch();
    const storeData = useAppSelector(i => i)
    const showLoader = useAppSelector(selectShowLoader);
    const personalReducer = useAppSelector(selectPersonal);
    const [roleId, setRoleId] = useState()
    const { setPageCategoryId, setPageTypeId, setPageSubTypeId, pageCategoryId } = useContext(globalContext)
    const { primaryDetails, spouseDetails } = personalReducer;

    const { primaryUserId, spouseUserId, loggedInMemberDetail, primaryMemberFullName, spouseFullName, isPrimaryMemberMaritalStatus,primaryMemberContactDetails, roleUserId,primaryMemberFirstName,spouseFirstName, } = usePrimaryUserId();

    konsole.log("loggedInMemberDetail", loggedInMemberDetail)
    konsole.log("storeData", storeData)

    useEffect(() => {
        dispatch(setSessionData());
    }, [])

    useEffect(() => {
        const stateObj = JSON.parse(sessionStorage.getItem('stateObj'));
        const { userId, appState, loggenInId, roleId } = stateObj || {};
        setRoleId(roleId)
        const dataAuthenticate = async () => {
            if(id !=9) return ;
          
            if (!userId || !appState || !loggenInId || !roleId) {
                window.location.replace(`${logoutUrl}Account/SignIn`);
                return;
            }
    
            const params = `${userId}/${appState}/${loggenInId}/${roleId}/`;
            $CommonServiceFn.InvokeCommonApi("GET", `${$Service_Url.getAthenticatePath}${params}`, "",
                (response, error) => {
                    if (response && response.status === 200) {
                        console.log("authenticated");
                    } else {
                        window.location.replace(`${logoutUrl}Account/SignIn`);
                    }
                }
            );
        };
        fetchApi();
        if (id != 7) {
            setAttornyData(id)
        }
        // dataAuthenticate();
    }, [primaryDetails, spouseDetails]);  

    const fetchApi = async () => {
        useLoader(true);

        if (!$AHelper.$isNotNullUndefine(loggedInMemberDetail)) {
            const loggedInUserId = sessionStorage.getItem("loggedUserId");
            konsole.log("loggedInUserId", loggedInUserId)
            if ($AHelper.$isNotNullUndefine(loggedInUserId) && loggedInUserId != null) {
                const resultOfloggedUser = await dispatch(fetchLoginMemberDetails({ userId: loggedInUserId }));
                konsole.log("resultOfloggedUser", resultOfloggedUser)
            }

        }
        if (!$AHelper.$isNotNullUndefine(primaryDetails)) {
            const primaryUserId = sessionStorage.getItem("SessPrimaryUserId")
            if ($AHelper.$isNotNullUndefine(primaryUserId) && primaryUserId != null) {
                const resultOfPrimary = await dispatch(fetchPrimaryDetails({ userId: primaryUserId }));
                const resultOfpayload = resultOfPrimary.payload;

                konsole.log("resultOfPrimaryresultOfPrimary", resultOfpayload, resultOfPrimary);
                // @@ check if client is married then fetch spouse details;
                if ($AHelper.$isMarried(resultOfpayload?.maritalStatusId) || resultOfpayload?.maritalStatusId == 4) {

                    let spouseUserId = ($AHelper.$isNotNullUndefine(resultOfpayload.spouseUserId) && resultOfpayload.spouseUserId != '00000000-0000-0000-0000-000000000000') ? resultOfpayload?.spouseUserId : '';

                    if ($AHelper.$isNotNullUndefine(spouseUserId)) {

                        const resultOfSpouse = await dispatch(fetchSpouseDetails({ userId: spouseUserId }));
                        konsole.log("resultOfSpouse", resultOfSpouse)

                    } else {
                        // spouseUserId
                        const response_decease = await getApiCall('GET', $Service_Url.getFamilyMembers + primaryUserId + `?MemberStatusId=2`) // for deceased only
                        konsole.log("response_decease", response_decease)
                        const _decease_spouse = response_decease?.length > 0 ? response_decease?.findLast(({ relationshipTypeId }) => relationshipTypeId == deceaseSpouseRelationId) : {}

                        konsole.log("_decease_spouse",_decease_spouse)
                        if(_decease_spouse){
                            let userId=_decease_spouse.userId
                            const resultOfSpouse = await dispatch(fetchSpouseDetails({ userId: userId }));
                            konsole.log("resultOfSpouse2",resultOfSpouse)
                      
                        }
                    }

                }
            }

            if(!$AHelper.$isNotNullUndefine(primaryMemberContactDetails)){
                // const resultOfprimaryMemberContactDetails = await dispatch(fetchPrimaryMemberContactDetials({ userId: primaryUserId }));
            }
        }
        useLoader(false)
    }

    const handleRoute = useCallback((item) => {
        // if (item.id == 1 || item.id == 2 || item.id == 3 || item.id==4) {
        clearSessionActiveTabData();
        $AHelper.$dashboardNextRoute(item.route);
        // }
    }, []);

    // const getGreeting = () => {
    //     const currentHour = new Date().getHours();
  
    //     if (currentHour < 12) {
    //       return 'Good Morning';
    //     } else if (currentHour >= 12 && currentHour < 18) {
    //       return 'Good Afternoon';
    //     } else {
    //       return 'Good Evening';
    //     }
    // }
    const setAttornyData = (id) => {
        const typeMapping = {5: 24,3: 5,6: 33,4: 11,};      
        if (id !== pageCategoryId) {
          setPageCategoryId(id);
          setPageSubTypeId(null);
          setPageTypeId(typeMapping[id] ?? null); // Set mapped value or null if not found
        }
      };      
    konsole.log('idid', id);
    konsole.log("personalReducer", personalReducer);

    konsole.log("primaryUserIdspouseUserId", primaryUserId, spouseUserId);
    konsole.log("loggedInMemberDetail", loggedInMemberDetail)
    konsole.log(id,"showIdNumber")

    if(hideAllContent === true) return "";
    return (
        <>
            <div className='overAllGreyBackgroundColor'>

                <Head>
                    <title>Aging Options</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
                </Head>
                <CustomeIdleTimer />
                <Feedback/>
                {paralegalAttoryId.includes(roleId) && <AddNotes classNameLocal="positionFeedBackButton" />}
                {showLoader && <CustomLoader />}
                <SetUpHeader />
                <div className='main-container-of-setup useNewDesignSCSS'>
                    <Row className='p-2'>
                        <Col xl={2} className='p-0 d-xl-block d-none'>
                            <SetupSidebar id={id} key={id}  handleRoute={handleRoute} agentActivetab={agentActivetab} setAgentactivetab={setAgentactivetab} />
                        </Col>
                        <Col xs={12} xl={10} className=''>
                      <Row>
                               {id != "8" &&  <Col xs={12} md={3} lg={2} className='p-0 d-xl-none d-block'>
                                    <SetupSidebar id={id} key={id + "hidable"}  handleRoute={handleRoute} agentActivetab={agentActivetab} setAgentactivetab={setAgentactivetab} />
                                </Col>}
                                <Col xs={12} md={9} lg={id == "8" ? 12 :10} xl={12}>
                                    {(id != '9' && id != '11' && id != '12' && id != '99' && id != '999') ? (

                                       <div className='setup-layout' >
                                            { id !="8" && <div className='layout-main-container p-0 d-block w-100'>
                                                <div className='layout-main-2'>
                                                    {/* <Row>
                                                        <div className='layout-child-1'>
                                                            <div className='content-1 ' style={{ padding: " 14px 16px 0px" }}>{getGreeting()},{primaryMemberFirstName && ` ${primaryMemberFirstName}${(isPrimaryMemberMaritalStatus && spouseFirstName) ? ` & ${spouseFirstName}` : ''}.`}</div>
                                                            <div className='content-2 ' style={{ padding: " 0px 16px" }}>Welcome back!</div>
                                                        </div>
                                                    </Row> */}
                                                    {/* <Row>
                                                        <div className='d-flex flex-wrap col-12 ' style={{ padding: "1px 20px 22px;" }}>
                                                            {$dashboardLinks.map((item, index) => (
                                                                (item.id == 8 && roleUserId != 9) ? "" :
                                                                <div className="col-xl-3 col-md-6 col-lg-4 col-6" style={{ display: "flex", justifyContent: "center" }}>
                                                                    <div
                                                                        key={index}
                                                                        className={`${item.id == id ? "active-dashboard" : ""} card-dashboard`}
                                                                        onClick={() => handleRoute(item)}
                                                                    >
                                                                        <div className="card-content">
                                                                            <div className="left-side">
                                                                                <h3>{item.label}</h3>
                                                                            </div>
                                                                            <div className="right-side">
                                                                                <img src={`/New/icons/${item.route}${item.id == id ? "-active" : ""}.svg`} alt="User Icon" className="icon" />
                                                                            </div>
                                                                        </div> */}
                                                                        {/* BELOW IS THE CODE TO SHOW THE STATUS OF EACH SECTION */}
                                                                        {/* <hr />
                                                                        <div className="status-content">
                                                                            {item.id == id ? <img
                                                                                src={item.isComplete == "COMPLETED" ? "/New/icons/check-circle.svg" : item.isComplete == "INCOMPLETE" ? "/New/icons/Incomplete-white.svg" : "/New/icons/Pending-white.svg"}
                                                                                alt={item.isComplete == "COMPLETED" ? "Complete" : "Incomplete"}
                                                                                className={`m-0 p-0 icon ${item.isComplete ? 'Complete' : 'incomplete'}`}
                                                                            /> : <img
                                                                                src={item.isComplete == "COMPLETED" ? "/New/icons/check-circle-primary.svg" : item.isComplete == "INCOMPLETE" ? "/New/icons/Incomplete.svg" : "/New/icons/Pending.svg"}
                                                                                alt={item.isComplete == "COMPLETED" ? "Complete" : "Incomplete"}
                                                                                className={`m-0 p-0 icon ${item.isComplete ? 'Complete' : 'incomplete'}`}
                                                                            />}
                                                                            <span>{item.isComplete}</span>
                                                                        </div>  */}
                                                                    {/* </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Row> */}
                                                </div>
                                            </div>}
                                            
                                           {(id >= "1" && id <= "8") && (
                                            <Row style={id != "8" ? { overflowY: "auto", height: "83vh", maxHeight: "83vh", overflowX: "hidden" } : { overflowY: "auto", height: "80vh", maxHeight: "80vh", overflowX: "hidden" }}>
                                                <Col xs={12}>
                                                    {children}
                                                </Col>
                                            </Row>
                                             )}
                                        </div>
                                           ) : (
                                      (id == "9" || id == "11" || id == "8" || id == "99" || id == "999") ? (
                                        <Row style={id != "8" ? {overflowY:"auto", height:"80vh", maxHeight:"80vh", overflowX:"hidden"} : {overflowY:"auto", height:"80vh", maxHeight:"80vh", overflowX:"hidden"}}>
                                       <Col xs={12}>
                                           {children}
                                       </Col>
                                      </Row>):"")}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
});

export default SetupLayout;
