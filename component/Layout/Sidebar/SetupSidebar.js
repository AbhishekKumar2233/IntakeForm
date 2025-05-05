import React, { useEffect, useState, useRef, useContext, useMemo } from 'react'
import { Nav, Row, Col } from 'react-bootstrap';
import Router from 'next/router';
import { $sideBarLinks, $dashboardLinks, $setGuidanceLinks } from '../../Helper/Constant';
import konsole from '../../../components/control/Konsole';
import { $AHelper } from '../../Helper/$AHelper';
// import CustomModal from '../../Custom/CustomModal';
import MoveToNewNOldDesign from '../../Common/MoveToNewNOldDesign';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { selectPersonal } from '../../Redux/Store/selectors';
import { fetchPrimaryDetails, updateIsSetupSidebarLink,getUserAgent,setUserAgentData, updateLoginMemberRoles, fetchLoginMemberDetails,updateIsState } from '../../Redux/Reducers/personalSlice';
// import { CustomButton } from '../../Custom/CustomButton';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { AoAcaddemyUrl, demo, AoAgenturl } from '../../../components/control/Constant';
import { getApiCall2, isNullUndefine, postApiCall, postApiCall2 } from '../../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../../components/network/UrlPath';
import { useLoader } from '../../utils/utils';
import { globalContext } from '../../../pages/_app';
import { $JsonHelper } from '../../Helper/$JsonHelper';
// import { fetchPrimaryDetails } from '../../Redux/Reducers/apiSlice';
import AlertToaster from '../../../components/control/AlertToaster';
import dynamic from 'next/dynamic';

const CustomModal = dynamic(() => import('../../Custom/CustomModal'));

// fetchPrimaryDetails
// primaryMemberJson
const SetupSidebar = React.memo(({ id, handleRoute, agentActivetab, setAgentactivetab }) => {
    const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
    const { primaryMemberFirstName, userDetailOfPrimary, loggedInUserId, subtenantId, primaryUserId } = usePrimaryUserId();

    const academyBtnRef = useRef(null);
    const fileImageInputRef = useRef(null);

    const [loggedInUserRoleId, setLoggedInUserRoleId] = useState('');
    const [loggedInRoleId, setLoggedInRoleId] = useState('');
    const [isModalShow, setIsModalShow] = useState(false)
    const [selectedItem, setSelectedItem] = useState(9);
    const [isOpenSetup, setIsOpenSetup] = useState(false);
    const [sideBarRoute, setSideBarRoute] = useState({ icon : "/", id: 9, isComplete: false, label: "Setup", route : "", urlPath : "/setup-dashboard"})
    const [stateObj, setStateObj] = useState({})
    const personalSliceData = useAppSelector(selectPersonal);
    const dispatch = useAppDispatch();
    const { isSetupSidebarLink, primaryDetails, userAgents,loginMemberRoles,isState, handleOffData } = personalSliceData

    konsole.log(handleOffData,"HandleDataFetch")

    const getSessionUserActiveData = () => {
    if (typeof window !== "undefined") {
        const data = sessionStorage.getItem("isUserActive");
        konsole.log(JSON.parse(data) ,"DataCheck")
        return data ? JSON.parse(data) : null;
    }
    return null;
   };

    const storedData = getSessionUserActiveData();

    useEffect(() => {
        let primarRoleId = JSON.parse(sessionStorage.getItem('userLoggedInDetail'))?.roleId
        let primarUserRoleId = sessionStorage.getItem('roleUserId')
        // const storedData = JSON.parse(sessionStorage.getItem("clientData"));
        // console.log(storedData,"isDataisData")
        const stateObject = sessionStorage.getItem("stateObj") !== "undefined" && sessionStorage.getItem("stateObj") !== null ? JSON.parse(sessionStorage.getItem("stateObj")) : {};
        setStateObj(stateObject)
        setLoggedInRoleId(primarRoleId)
        setLoggedInUserRoleId(primarUserRoleId)
        setSelection();
    }, [loggedInUserId])

    useEffect(() => {
        const loginUserId = sessionStorage.getItem('loggedUserId');
        konsole.log("loginUserId333",loginUserId)
        if (loginUserId) {
            fetchRole(loginUserId);
            getUserAgentData(loginUserId);
        }
    }, []);

    useEffect(() => {
        const isStateId = sessionStorage.getItem("isStateId") || "1"
         dispatch(updateIsState(isStateId))
    }, [])
    

    const getUserAgentData = async(loginUserId) =>{
        let jsonObj = {
            "agentUserId": loginUserId,
            "agentRoleId":null,
            "agentActiveStatus":true
        }
        const responseAgent = await dispatch(getUserAgent(jsonObj))
        konsole.log("responseAgent",responseAgent)
        let arrOfUserAgents=responseAgent?.payload =='err' ? []: responseAgent?.payload?.response?.data?.data;
        dispatch(setUserAgentData(arrOfUserAgents))
    }

    const fetchRole = async (loginUserId) => {
        // let userLoggedInDetail = JSON.parse(sessionStorage.getItem('userLoggedInDetail'));
        let url = $Service_Url.getUserDetailByEmailId + '=' + loginUserId;
        const _resultOf = await getApiCall2("GET", url, '');
        konsole.log("_resultOf", _resultOf);
            const resData = _resultOf?.data;
            const rolesDetails = (_resultOf == 'err' && resData?.length == 0) ? [] : resData[0]?.roleDetails;
            dispatch(updateLoginMemberRoles(rolesDetails))
    }

    const setSelection = () => {
        const curURL = window?.location?.pathname;
        let selectedItemId = 9;
        $sideBarLinks?.forEach(ele => selectedItemId = curURL?.startsWith(ele.urlPath) ? ele.id : selectedItemId);
        // konsole.log("dszff", curURL, curURL?.startsWith('/setup-dashboard'), selectedItemId)
        openPersonalInfoByDefault()
        setSelectedItem(selectedItemId);
    }

    const nextRoute = (item) => {
        konsole.log("itemitem", item);
        setSideBarRoute(item)
        if (item?.id != 12) {
            if (item?.id == 100) {
                academyRoute();
                return;
            }
            if(item?.id == 5){
                agentRoute();
                return;
            }
            handleSetupSidebar(item?.id == 9 ? !isSetupSidebarLink : false);
            $AHelper.$dashboardNextRoute(item.route);

            openPersonalInfoByDefault()
            return;
        }
        handleModalShow(true)
    }

    const openPersonalInfoByDefault = () =>{
     const curURL = window?.location?.pathname;
    //  console.log(curURL,"curURL")
     if((isSetupSidebarLink == true || isSetupSidebarLink == false) && curURL == '/setup-dashboard'){
        const item = {
            route : "PersonalInfo"
        }
        handleDashboardRoute(item);
    }   
    }

    const academyRoute = async () => {
        useLoader(true);
        let url = $Service_Url.getUserDetailByEmailId + '=' + primaryUserId;
        const _resultOf = await getApiCall2("GET", url, '');
        useLoader(false)
        konsole.log('_resultOf', _resultOf);

        if (_resultOf?.data?.length > 0) {
            const loggedInUserRoles = _resultOf?.data[0].roleDetails;
            const agingoptionsacademy = loggedInUserRoles?.some((data) => data.roleId == 17 || data.roleId == 18);
            konsole.log('loggedInUserRoles', agingoptionsacademy, loggedInUserRoles);
            if (agingoptionsacademy) {
                academyBtnRef.current.submit();
            } else {
                const jsonObj = {
                    subtenantId: subtenantId,
                    signUpPlateform: 12,
                    user: {
                        roleId: 17,
                        firstName: userDetailOfPrimary.memberName,
                        lastName: userDetailOfPrimary.memberName,
                        emailAddress: userDetailOfPrimary?.primaryEmailId,
                        userName: userDetailOfPrimary?.primaryEmailId,
                        packageCode: null,
                    },
                };
                konsole.log('jsonObj', jsonObj);
                useLoader(true);
                const _resultOfCreateAcademy = await postApiCall2('POST', $Service_Url.createAcademyUser, jsonObj);
                useLoader(false);
                konsole.log('_resultOfCreateAcademy', _resultOfCreateAcademy);
                if (_resultOfCreateAcademy.result != 400) {
                    academyBtnRef.current.submit();
                }else if(_resultOfCreateAcademy.result = 400) {
                    var checkErrorMessage = _resultOfCreateAcademy?.response?.data?.messages?.some(item => item.includes("Can not assign requested role AO-Academy Users, requested role is already assigned "));
                   if(checkErrorMessage){
                       academyBtnRef.current.submit();
                   }
                }
            }

        }

    }

    const agentRoute = () =>{
        const appState = stateObj?.appState;
        const userId = stateObj?.userId;
        const roleId = stateObj?.roleId !== undefined ? JSON.parse(stateObj?.roleId) : [];
        const loggenInId = stateObj?.loggenInId;

      let tokenKey = `appState=${appState}&userId=${userId}&roleId=${5}&loggenInId=${loggenInId}`;
      konsole.log("tokennnn",`appState=${appState}&userId=${userId}&roleId=${5}&loggenInId=${loggenInId}`,appState,userId,loggenInId)
      window.open(`${AoAgenturl}?token=${window.btoa(tokenKey)}`, "_blank");
    }


    const handleModalShow = (val) => {
        setIsModalShow(val)
    }

    const handleDashboardRoute = (item) => {

    
        if(item?.label !== 'Personal Info' && item?.route !== 'PersonalInfo'){   
            sessionStorage.removeItem("isActivateform");    
        }

        if (demo == true) {
           let arrayDemoTrue = ["7f1e7602-f6e5-4719-9311-f8bd1d1e4fc3", "305bf342-40f2-4ae3-a8c0-4ac8c3754279"]
            if (arrayDemoTrue?.includes(loggedInUserId)) {
                handleRoute(item);
                return;
            }
        } 

        else if (demo == false) {
            let arrayDemoFalse = ["9e6ea069-3eff-429a-8ffd-6a082f1c72b3", "7b37f2e4-61e3-410f-98c0-ff544212d6d8"]
            if (arrayDemoFalse?.includes(loggedInUserId)) {
                handleRoute(item);
                return;
            }
        }
    

        if ($AHelper?.$haveAccessToParalegal(loggedInRoleId)) {
            const restrictedLabels = ["Health", "Housing"];
    
            if (item?.label == "Finance") {
            if (handleOffData == true) {
                toasterAlert("warning", "Warning", `This client account has been handed off to the client. You no longer have access to ${item.label}.`);
                return;
            }
            if (storedData == true) {
                toasterAlert("warning", "Warning", "Access to financial information is restricted. For further assistance, please contact the client.");
                return;
                }
            }
    
            if (handleOffData == true && restrictedLabels.includes(item.label)) {
                toasterAlert("warning", "Warning", `This client account has been handed off to the client. You no longer have access to ${item.label}.`);
                return;
            }
            }
    
        handleRoute(item);
    };
    // primaryMemberJson

    const handleSetupSidebar = (val) => {
        dispatch(updateIsSetupSidebarLink(val))
    }


    // console.log('userDetailOfPrimary',userDetailOfPrimary)

    // @@ Image Upload  
    async function handleFileImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            konsole.log('File uploaded:', file, file.name);
            if(file.type != "image/jpeg" && file.type != 'image/svg+xml' && file.type != "image/png" ){
                AlertToaster.error('Only jpeg,png,svg are allowed.');
                return;
            }
            const confirmRes = await newConfirm(true, `Are you sure you want to upload this image? `, "Permission", "Confirmation", 3);
            fileImageInputRef.current.value = ''
            if (!confirmRes) return;
            let userId = primaryUserId || sessionStorage.getItem('SessPrimaryUserId')

            // @@ Imgae upload Json Create 
            const jsonObj = $JsonHelper.createUploadUserDocument({ File: file, UploadedBy: loggedInUserId, UserFileName: file.name, UserId: userId, FileCategoryId: 1, FileTypeId: 15, FileStatusId: 2, UserFileName: 'Profile' });
            konsole.log("jsonObj", jsonObj)
            const formDataJson = $AHelper.$appendFormData(jsonObj);
            konsole.log("formDataJson", formDataJson);
            // useLoader(true);
            // Api call of image upload
            const _resultOfUploadDoc = await postApiCall('POST', $Service_Url.postUploadUserDocumentVersion2, formDataJson);
            useLoader(false);
            konsole.log('_resultOfUploadDoc', _resultOfUploadDoc)

            if (_resultOfUploadDoc != 'err') {
                const respData = _resultOfUploadDoc?.data?.data;
                let fileId = respData?.fileId
                konsole.log('respData', respData);

                let createPrimaryJson = $JsonHelper.createJsonUpdateMemberById({ ...primaryDetails, updatedBy: loggedInUserId, fileId: fileId, subtenantId: subtenantId });
                delete createPrimaryJson.memberRelationship
                konsole.log('createPrimaryJson', createPrimaryJson);
                useLoader(true);
                // update fileid in primary member
                const resultMemberUpdateFileId = await postApiCall('PUT', $Service_Url.putUpdateMember, createPrimaryJson);
                if (resultMemberUpdateFileId != 'err') {
                    AlertToaster.success('Data updated successfully.')
                // fetch primary member details in primary member
                dispatch(fetchPrimaryDetails({ userId: primaryUserId }))
                dispatch(fetchLoginMemberDetails({ userId: loggedInUserId }));
                }
                useLoader(false);
            }

        } else {
            fileImageInputRef.current.value = ''
        }
    }


    // @@ display profile URL
    const userProfileURL = useMemo(() => {
        let url = `/New/newIcons/circle-Image-sidebar.svg`;
        let urlApi = primaryDetails?.fileUrl || primaryDetails?.member?.fileUrl
        if ($AHelper.$isNotNullUndefine(urlApi)) {
            url = urlApi
        }
        return url;
    }, [primaryDetails])

    const shouldIncludeItem = (item, demo) => {
        konsole.log("loggedInRoleId222", loggedInRoleId,item);
    
        // Evaluate all conditions independently
        const excludeForLpoAndParalegal = $AHelper?.$isLpoMember(loggedInUserRoleId) && $AHelper?.$haveAccessToParalegal(loggedInRoleId) && [100, 101, 99].includes(item.id);
        const excludeForIntake = $AHelper?.$haveAccessToIntake(loggedInUserRoleId) && [100, 101, 99, 11, 10, 12].includes(item.id);
        const excludeForAgentRole = !loginMemberRoles?.some((det) => det?.roleId == 5) && item.id == '5';
        const excludeForDemo = item.id == 99 && demo !== true;

        // Combine all conditions
        const shouldExclude = excludeForLpoAndParalegal || excludeForIntake || excludeForAgentRole || excludeForDemo;
    
        // Return the negation of the exclusion logic
        return !shouldExclude;
    };

    const finalShowableList = useMemo(() => {
        if(isNullUndefine(loggedInRoleId) || isNullUndefine(loggedInUserRoleId) || isNullUndefine(loginMemberRoles)) return [];
        const _finalShowableList = $sideBarLinks.filter((item) => shouldIncludeItem(item, demo));
        sessionStorage.setItem("finalSideBarMenu", _finalShowableList?.map(ele => ele?.id));
        return _finalShowableList;
    }, [loggedInRoleId, loggedInUserRoleId, loginMemberRoles])
    

    konsole.log('userProfileURL', userProfileURL, primaryDetails)
    konsole.log("isOpenSetupisOpenSetup", isOpenSetup);
    konsole.log("isSetupSidebarLink", isSetupSidebarLink);
    konsole.log('userDetailOfPrimary', userDetailOfPrimary)


    const updatedSideBarMenu = (dashboardLinks) => {
        return isState == "2" ? dashboardLinks.filter(ele => ![3, 4].includes(ele?.id)) : dashboardLinks;
    };
    
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    };

    return (
        <>
            <form action={AoAcaddemyUrl} target="_blank" method="post" ref={academyBtnRef}>
                <input type="hidden" name="userName" value={userDetailOfPrimary?.primaryEmailId} />
            </form>


            {isModalShow &&
                <CustomModal
                    handleOpenModal={handleModalShow}
                    open={isModalShow}
                    header='Warning'
                    children={<p className='heading-of-sub-side-links text-center' style={{ fontWeight: "100" }}>You don't have the permission to access the Contacts</p>}
                    size='md'
                    backClick={handleModalShow}
                    refrencePage='SetupSidebar'
                />
            }

            <>
                <div id="setup-sidebar" className='setup-sidebar useNewDesignSCSS'>
                    <MoveToNewNOldDesign refrencePage="SetupSidebar" action="old" />
                    <div className='setup-sidebar-Nav'>

                        {/* Profile Card */}
                        <div className="profile-card-sidebar">
                            <div className="text-center">
                                <div className="avatar-placeholder"                                
                                 
                                 >
                                    <input type="file" ref={fileImageInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileImageChange}/>
                                    <div className='parentDivv'>
                                    <img onClick={() => fileImageInputRef.current.click()}   src={userProfileURL} alt="circle-Image-sidebar" className="profile-icon" style={{  borderRadius: '50%',  width: '70px',  height: '70px',  border: '1px solid #939393'}}/>
                                    <img onClick={() => fileImageInputRef.current.click()}  src="/New/newIcons/uploadHoverIcon.svg" alt="circle-Image-sidebar" className="hover-icon"
                                        style={{borderRadius: '50%', width: '70px',height: '70px',objectFit: 'cover', border: 'none'}}/>
                                </div>
                                </div>
                                <p className="card-title" style={{ fontFamily: "Inter, sans-serif", marginBottom:"15px" }}>{primaryMemberFirstName}</p>
                                {/* <p className="card-text">No.{userDetailOfPrimary?.memberId}</p> */}
                            </div>
                        </div>
                        {/* Profile Card */}
                        {finalShowableList?.map((item, index) => {
                            const { label, route } = item;
                            konsole.log(route, "currentRouteroutecurrentRouteroute", item)
                            konsole.log("selectedItemselectedItem", label, selectedItem)
                            const setupicon = (item.id == selectedItem) ? 'SetupIcon-active' : 'SetupIcon';
                            const checkAgentRole = (loginMemberRoles?.some(det => det?.roleId == 5) && item?.id == 5);
                            return <>

                                <div className='nav-item-div' key={index} >
                                {/* <div onClick={() => nextRoute(item)} className={item.id == 10 || item.id == 11 ? '' : 'mb-3'}> */}
                                    {/* <div onClick={() => nextRoute(item)} className={item.id == 99 || item.id == 11 || item.id == 10 ? ""  : 'mb-2'}> */}
                                    <div onClick={() => nextRoute(item)} className={(item.id != 100  && (selectedItem == 9 && isSetupSidebarLink)) ? '' :  'mb-2'}>
                                        <Nav defaultActiveKey="/home" className="flex-column">
                                            <Nav.Link className={`nav-item ${(item.id == selectedItem) ? "active" : ""}`}>
                                                <div className="d-flex justify-content-between gap-2">
                                                    <div className="nav-icon">
                                                      <img src={`/New/newIcons/${route == "" ? setupicon : item.id == selectedItem ? `${route}-active` : route}.svg`} alt={route} className="icon" />
                                                    </div>
                                                    <span>{`${checkAgentRole ? (`${userAgents?.length > 0 ? `Access your agent role` : "Agent"}`) : label}`}</span>
                                                </div>
                                                {(item.id == 9) &&
                                                    <div className={`${(isSetupSidebarLink) ? 'nav-arrow-active' : ''} 'nav-arrow'`}>
                                                      {item.id != selectedItem ? <img src='/New/newIcons/openCloseSidebarUnActive.svg' alt="User Icon" className="icon me-2 m-0 p-0" /> :
                                                       <img src={`/New/newIcons/openCloseSidebar${isSetupSidebarLink ? '-active' : ''}.svg`} alt="User Icon" className="icon me-2 m-0 p-0" />
                                                       }
                                                    </div>
                                                }
                                            </Nav.Link>
                                        </Nav>
                                    </div>
                                    {(item.id == 9 && isSetupSidebarLink) &&
                                        <div className={item.id == 99 || item.id == 111 || item.id == 10 || item.id == 101 ? '' : 'ms-4 mt-2'}>{updatedSideBarMenu($dashboardLinks)?.filter(item => $AHelper?.$haveAccessToIntake(loggedInUserRoleId) ? item.id != '8' : item).map((item2, index) => {
                                            return <>
                                                <div key={index} onClick={() => handleDashboardRoute(item2)} style={{
                                                    backgroundImage: 'url(/New/newIcons/newDashboardline.svg)', // Replace with your image path
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'left center', // Position the image on the left
                                                    backgroundSize: '10px 100%', // Size the image like a border (adjust width as needed)
                                                }}>
                                                    <Nav defaultActiveKey="/home" className="flex-column" >
                                                        <Nav.Link className={`nav-item ${item2.id == id ? "active" : ""}`}>
                                                    {((($AHelper?.$haveAccessToParalegal(loggedInRoleId) && handleOffData == true) && 
                                                    (item2?.label == "Health" || item2?.label == "Housing" || item2?.label == "Finance"))
                                                    || ($AHelper?.$haveAccessToParalegal(loggedInRoleId) && item2?.label == "Finance" && storedData == true))

                                                    // demo condition

                                                    && !(
                                                        (loggedInUserId == "7f1e7602-f6e5-4719-9311-f8bd1d1e4fc3" &&
                                                        (item2?.label == "Health" || item2?.label == "Housing" || item2?.label == "Finance") && demo == true) || 
                                                        ((loggedInUserId == "9e6ea069-3eff-429a-8ffd-6a082f1c72b3" || loggedInUserId == "7b37f2e4-61e3-410f-98c0-ff544212d6d8") && demo == false) ||

                                                        // this condtion for shreyauat@maildrop.cc email ID
                                                            
                                                            (loggedInUserId == "305bf342-40f2-4ae3-a8c0-4ac8c3754279" && demo == true && 
                                                                (item2?.label == "Health" || item2?.label == "Housing" || item2?.label == "Finance"))
                                                        )
                                                        ? (
                                                        <div className="d-flex justify-content-between gap-2" style={{ pointerEvents: "none", opacity: 0.3 }}>
                                                            <div className="nav-icon">
                                                                <img src={`/New/newIcons/${item2.route}${item2.id == id ? "-active" : ""}.svg`} alt={route} className="icon" />
                                                            </div>
                                                            <span className='_wordBreak'>{item2?.label}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex justify-content-between gap-2">
                                                                <div className="nav-icon"  >
                                                                    {/* <img src={`/New/icons/${route == "" ? "SetupIcon" : route == "" ? `${route}-active` : route}.svg`} alt={route} className="icon" /> */}
                                                                <img src={`/New/newIcons/${item2.route}${item2.id == id ? "-active" : ""}.svg`} alt={route} className="icon" />

                                                            </div>
                                                            <span className='_wordBreak'>{item2?.label}</span>
                                                            </div>)}
                                                        </Nav.Link>
                                                    </Nav>
                                                </div>

                                                {/* <div className='d-flex' key={index} onClick={() => handleDashboardRoute(item2)}>
                                                <img src='/New/newIcons/newDashboardline.svg' style={{height:"30px"}}/>
                                               
                                                    <Nav defaultActiveKey="/home" className="flex-column gap-0" style={{marginTop:"10px"}}>
                                                        <Nav.Link className={`nav-item ${item2.id == id ? "active ms-2" : "ps-2"}`}>
                                                            <div className="d-flex justify-content-between gap-2">
                                                            <div className="nav-icon"  >
                                                                <img src={`/New/newIcons/${item2.route}${item2.id == id ? "-active" : ""}.svg`} alt={route} className="icon" />
                                                                </div>
                                                                <span>{item2?.label}</span>
                                                            </div>
                                                        </Nav.Link>
                                                    </Nav>
                                                
                                                </div> */}
                                        {demo == true && item?.id == 9 && item2?.id == 8 && id == 8 && $setGuidanceLinks.map((e)=>{
                                            return <div className="mt-1 ms-2" onClick={()=>setAgentactivetab(e.id)} style={{
                                                backgroundImage: 'url(/New/newIcons/newDashboardline.svg)',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'left center',
                                                backgroundSize: '10px 100%',
                                            }}><Nav defaultActiveKey="/home" className="flex-column" >
                                                        <Nav.Link className={`nav-item ${e.id == agentActivetab ? "active" : ""}`}>
                                                            <div className="d-flex justify-content-between gap-2">
                                                                <div className="nav-icon"  >
                                                                    <img src={`/New/icons/${e.route}${e.id == agentActivetab ? "-active" : ""}.svg`} alt={route} className="icon" />
                                                                </div>
                                                                <span className='_wordBreak fs-13'>{e?.label}</span>
                                                            </div>
                                                        </Nav.Link>
                                                    </Nav>
                                                </div>
                                        })}
                                            </>
                                        })}
                                        </div>
                                    }
                                </div>
                            </>
                        })}


                        {/* Completion Card */}
                        {/* <div className="completion-card-sidebar mt-5 ">
                            <Row>
                                <Col xs={12} md={6}>
                                    <LodingPercentage />
                                </Col>
                            </Row>
                            <p className='profile-completion-p'>Profile completion</p>
                            <p className='profile-completion-p-2 mt-1'>You are currently at 80% setup completion</p>
                            <p className='profile-completion-p-3 mt-2'>Continue</p>
                        </div> */}
                        {/* Completion Card */}

                        {/* Upgrate Portal */}
                        {/* <div className='upgrade-portal-card mt-2'>
                            <Row>
                                <Col>
                                    <span className='span-1'>Portal Lite</span><br />
                                    <span className='span-2'>till 27/12/26</span>
                                </Col>
                                <Col>
                                    <CustomButton label={'Upgrade'} onClick={() => konsole.log('Upgrade CLicked')} />
                                </Col>
                            </Row>
                        </div> */}
                        {/* Upgrate Portal */}

                    </div>
                </div>
            </>
        </>
    )
});



const LodingPercentage = () => {


    const percentage = 70
    const radius = 32; // Radius of the circle
    const strokeWidth = 8; // Width of the stroke
    const normalizedRadius = radius - strokeWidth * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return <div className="circular-loader-container"> <div className="circular-loader-container">
        <svg height={radius * 2} width={radius * 2}>
            <circle
                stroke="black"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <circle
                stroke="white"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
        </svg>
        <div className="percentage">{percentage}%</div>
    </div>

    </div>
}

export default SetupSidebar;