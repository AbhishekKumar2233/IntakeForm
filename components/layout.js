import React, { useState, useEffect, createRef, useContext } from 'react';
import Head from 'next/head';
import Header from './header';
import Viewprofile from './viewprofile';
import { Button, Row, Col, Container, } from 'react-bootstrap';
import { connect } from 'react-redux';
import { globalContext } from '../pages/_app';
import { useScreenshot } from 'use-react-screenshot'
import konsole from './control/Konsole';
import Router from 'next/router';
import { logoutUrl } from './control/Constant';
import { $CommonServiceFn } from './network/Service';
import { $Service_Url } from './network/UrlPath';
import Feedback from './Feedback';
import Headerlpo from './headerlpo';
import Tophead from './paralLegalComponent/header/tophead';
import AddNotes from './AddNotes';
import { paralegalAttoryId } from './control/Constant';
import CustomeIdleTimer from './TimerHandler/CustomeIdleTimer';


const layout = (props) => {

    const [loginUserDetail, setloginUserDetail] = useState("")
    const [isSideBarVisible, setisSideBarVisible] = useState(true)
    const [validUser, setValidUser] = useState(false);
    const [authorization, setauthorization] = useState("")
    const { setPageCategoryId, setPageTypeId, setPageSubTypeId, pageCategoryId } = useContext(globalContext)
    const ref = createRef(null)
    const [image, takeScreenshot] = useScreenshot()
    const [roleId, setRoleId] = useState()

    const [rolePrimaryId, setRoleprimaryId] = useState('')

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            let loginUserDetail = sessionStorage.getItem("userDetailOfPrimary");
            let authorization = sessionStorage.getItem("AuthToken");
            const rolePrimaryid = sessionStorage.getItem('roleUserId')
            const { userId, appState, loggenInId, roleId } = JSON.parse(sessionStorage.getItem('stateObj'));
            setRoleId(roleId)
            setRoleprimaryId(rolePrimaryid)
            redirectToLogin(authorization);
            setloginUserDetail(JSON.parse(loginUserDetail));
            setauthorization(authorization);
            if (pageCategoryId !== 7) {
                setAttornyData()
            }

        }
        return () => {
            isMounted = false;
        }
    }, [props])


    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            const { userId, appState, loggenInId, roleId } = {...JSON.parse(sessionStorage.getItem('stateObj'))};
            const params = `${userId}/${appState}/${loggenInId}/${roleId}/`

            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAthenticatePath + params,
                "", (response, error) => {
                    if (response) {
                        // console.log("authenticated");
                        if (response.status == 200) {
                            setValidUser(true);
                        }
                    }
                })
        }

        return () => {
            isMounted = false;
        }
    }, [])
    const setAttornyData = () => {
        let categoryId;

        switch (props?.name) {
            case "Personal Information":
                categoryId = 1;
                break;
            case "Family Information":
                categoryId = 2;
                break;
            case "Health Information":
                categoryId = 3;
                break;
            case "Housing Information":
                categoryId = 4;
                break;
            case "Financial Information":
                categoryId = 5;
                break;
            case "Legal Information":
                categoryId = 6;
                break;
            case "Agent / Guidance":
                categoryId = 8;
                break;
            case "Emergency":
                categoryId = 9;
                break;
            case "File Cabinet":
                categoryId = 10;
                break;
            case "Annual Maintenance Agreement":
                categoryId = 11;
                break;
            default:
                // Default case if props?.name does not match any of the above cases
                categoryId = null;
                break;
        }

        if (categoryId !== pageCategoryId) {
            setPageCategoryId(categoryId);
            setPageTypeId(null);
            setPageSubTypeId(null);
        }
    };


    const getImage = () => {
        takeScreenshot(document.body)
        konsole.log("screenshot taken", ref)
    }
    const redirectToLogin = (authenicate) => {
        if (!authenicate) {
            window.location.replace(`${logoutUrl}Account/SignIn`);
        }
    }

    // componentDidMount(){
    //     let loginUserDetail = sessionStorage.getItem("userDetailOfPrimary");
    //     let authorization = sessionStorage.getItem("AuthToken");
    //     this.setState({
    //         loginUserDetail: JSON.parse(loginUserDetail),
    //         authorization: authorization,
    //     })
    // }
    const showSideBar = () => {
        let value = isSideBarVisible;
        // un comment this part for sidebar

        // this.setState({
        //     ...this.state,
        //     isSideBarVisible: !value,
        // })
    }
    // setauthorization(authorization);
    // const authorization = this.state.authorization;

    return (
        <div ref={ref} className="position-relative" style={(rolePrimaryId == "9") ? { background: "#f9f9f9" } : { background: "linear-gradient(180deg, #FFFFFF 0%, #C4C4C4 100%) !important" }}>
            <Head>
                <title>Aging Options</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
            </Head>
            <CustomeIdleTimer />
            {
                (authorization) ?
                    <div className={(props.showloader ? "overlay" : "")}>
                        {props?.showloader == true &&
                            (<div className="spinner-border text-primary blockuiloader"
                                id="spinner" role="status">
                                <span className="sr-only"></span>
                            </div>)}

                        {(props.name != 'File_Cabinet') ? <>
                            <Header {...props} getImage={getImage} shoowheader={props.shoowheader} image={image} showSideBar={showSideBar} loggedin={true} userProfile={loginUserDetail} />
                        </> : <></>}  {/* <div className="" style={{ marginBottom: "6px" }}> */}
                        {(props?.showFeedbackBtn != false) &&
                            <>
                                <Feedback getImage={getImage} image={image} classNameLocal="positionFeedBackButton" />
                                {/* {console.log("dfdhsfkjhdksjfhdskjf",paralegalAttoryId.includes(roleId) )} */}
                                {paralegalAttoryId.includes(roleId) && <AddNotes classNameLocal="positionFeedBackButton" />}


                            </>
                        }

                        {/* </div> */}
                        <div className={(rolePrimaryId != "9") ? "layout-content" : "layout-content-lpo"}>
                            {(props.name != 'File_Cabinet') ? <>
                                <Viewprofile isSideBarVisible={isSideBarVisible} userProfile={loginUserDetail} image={image} getImage={getImage} />
                            </> : <>
                                <Tophead getImage={getImage} page="File_Cabinet" image={image} /></>}
                            <div className="content-section lpo-margin w-100">


                                {(props.name != 'File_Cabinet') ? <>
                                    {(rolePrimaryId == "9") && <Headerlpo {...props} shoowheader={props.shoowheader} />}
                                    {(rolePrimaryId == "9") ? <div className='icon-clas1-resonsive icon-cls2'>
                                        {props.children}
                                    </div> : <div>
                                        {props.children}
                                    </div>}
                                </> : <>
                                    <div className="" style={{ position: "fixed", width: "100%", height: "100vh", top: "128px", backgroundColor: "white" }}>
                                        {(rolePrimaryId == "9") ? <div className='icon-clas1-resonsive icon-cls2'>
                                            {props.children}
                                        </div> : <div>
                                            {props.children}
                                        </div>}
                                    </div>
                                </>}
                            </div>
                        </div>


                        {/* <ul className=''>
                            <li>Coffee</li>
                            <li>Tea</li>
                            <li>Milk</li>
                        </ul> */}
                    </div>
                    :
                    <Container>
                    </Container>
            }
        </div>
    );

}

const mapStateToProps = (state) => ({ ...state.main });

export default connect(mapStateToProps, "")(layout);