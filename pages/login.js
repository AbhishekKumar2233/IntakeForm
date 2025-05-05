import React, { Component } from "react";

import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import Router from "next/router";
import { $CommonServiceFn } from "../components/network/Service";
import { $Service_Url } from "../components/network/UrlPath";
import { GET_USER_DETAILS, SET_LOADER } from "../components/Store/Actions/action";
import { connect } from "react-redux";
import Head from "next/head";
import { Msg } from "../components/control/Msg";
import konsole from "../components/control/Konsole";
import { $AHelper } from "../components/control/AHelper";
import { logoutUrl } from "../components/control/Constant";
import { isNotValidNullUndefile } from "../components/Reusable/ReusableCom";

class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      authtoken: ""
    }
  }

  componentDidMount() {

   
    // debugger

    let token = this.GetQueryValues("token") || ""; 
    let selectedPage = this.GetQueryValues("page") || "";
    let modType = this.GetQueryValues("modType") || ""; 
    let actionType = this.GetQueryValues("actionType") || ""; 
    konsole.log("tokenMapKey", token);
    const decodedKey = window?.atob(token);
    konsole.log("dece", decodedKey);
    const loggenInId = this.GetQueryDecodedValues(decodedKey, "loggenInId") || "";
    const legalStaff = this.GetQueryDecodedValues(decodedKey, "legalStaff") || "";
    const userId = this.GetQueryDecodedValues(decodedKey, "userId") || "";
    const roleId = this.GetQueryDecodedValues(decodedKey, "roleId") || "";
    const appState = this.GetQueryDecodedValues(decodedKey, "appState") || "";
    konsole.log("loggin", loggenInId, userId, roleId, appState);
    if (loggenInId !== "" && userId !== "" && appState !=="" && roleId !== "" ){
      this.getLoggedInUser(userId, appState, loggenInId, roleId, selectedPage, actionType, modType, legalStaff);
    }
    else{
      window.location.replace(`${logoutUrl}Account/SignIn`);
    }   
  }

  GetQueryValues(param) {
    var url = "";
    url = decodeURIComponent(window.location.href).slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
      var urlparam = url[i].split('=');
      if (urlparam[0] == param) {
        return urlparam[1].split("#")[0];
      }
    }
    return "";
  }
  GetQueryDecodedValues = (query,param)=> {
      var url = "";
      url = query.slice(query.indexOf('?') + 1).split('&');
      konsole.log(url);
      for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
          return urlparam[1];
        }
      }
      return "";
    }

    getLoggedInUser = (userId, appState, loggenInId, roleId,selectedPage, actionType, modType, legalStaff, username) => {
      const params = `${userId}/${appState}/${loggenInId}/${roleId}/`
   $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAthenticatePath + params,
        "", (response) => {
          if(response){
            sessionStorage.setItem("AuthToken", response.data.data.accessToken);
            sessionStorage.setItem("SubtenantId", response.data.data.subtenant_Id);
            sessionStorage.setItem("subtenantName", response.data?.data?.subtenantName);
            if(isNotValidNullUndefile(response.data?.data?.servicePlanId)){
              sessionStorage.setItem("isStateId",response.data?.data?.servicePlanId);
            }
            
            let roleUserId = 0;
            let loginDetail = {};
            let primaryDetail = {};
            let loggedUserId = "";
            konsole.log("responsesadasas",response);
            if (response.data !== null || response.data !== "") {
              this.setState({ authtoken: response.data.data.accessToken });
              const stateObj = {
                loggenInId: loggenInId,
                userId: userId,
                roleId: roleId,
                appState: appState,
                legalStaff: legalStaff,
                username:username
              }
              sessionStorage.setItem("stateObj", JSON.stringify(stateObj));
              sessionStorage.setItem("modType", modType);
              sessionStorage.setItem("actionType", actionType);

              loginDetail = {
                memberName: response.data && response.data.data.memberName,
                primaryEmailId: response.data && response.data.data.loginUserEmailId,
                userName: response.data && response.data.data.userName,
                userMob:response?.data && response?.data?.data?.primaryPhoneNumber,
                memberId:response?.data && response?.data?.data?.memberId,
                roleId:response?.data && response?.data?.data?.roleId
              }
              primaryDetail = {
                memberName: response.data && response.data.data.memberName,
                primaryEmailId: response.data && response.data.data.primaryEmailId,
                userName: response.data && response.data.data.primaryEmailId,
                userMob:response?.data && response?.data?.data?.primaryPhoneNumber,
                memberId:response?.data && response?.data?.data?.memberId
              }

              if (response.data) {
                loggedUserId = response.data.data.memberUserId;
                roleUserId = response.data.data.roleId;
                sessionStorage.setItem("roleUserId", response.data.data.roleId);
                sessionStorage.setItem("userLoggedInDetail", JSON.stringify(loginDetail));
              }
            }
            if (appState != "" && (roleUserId == 1 || roleUserId == 10 || roleUserId == 9)) {
              sessionStorage.setItem("SessPrimaryUserId", loggedUserId);
              loginDetail.spouseName = response.data.data.spouseName;
              sessionStorage.setItem("userDetailOfPrimary", JSON.stringify(loginDetail));
              sessionStorage.setItem("loggedUserId", userId);
              sessionStorage.setItem("spouseUserId", response.data.data.spouseUserId);



              $CommonServiceFn.InvokeCommonApi('GET',$Service_Url.getFamilyMemberbyID+loggedUserId ,"",(res,err)=>{
                if(res){
                  konsole.log('responselogin',res)
                  let responseData=res?.data?.data?.member
                  if(responseData.maritalStatusId==null){
                    sessionStorage.setItem('activateform',false)
                    Router.push({pathname: './Activationform',search: '?query=' + userId,state: {  userid: userId,}})
                  }else{
                    sessionStorage.setItem('activateform',true)
                    sessionStorage.setItem('maritalStatusId',responseData.maritalStatusId)
                    if(selectedPage?.startsWith("iframe")) {
                      this.goToIframe(selectedPage, userId)
                      return;
                    }
                    Router.push({ pathname: './setup-dashboard', search: '?query=' + userId, state: {   userid: userId, } })
                    // Router.push({ pathname: './dashboard', search: '?query=' + userId, state: {   userid: userId, } })
                  }
                  loginDetail['memberId'] = responseData?.memberId
                  sessionStorage.setItem("userDetailOfPrimary", JSON.stringify(loginDetail));
                }else{
                  sessionStorage.setItem('activateform',true)
                  if(selectedPage?.startsWith("iframe")) {
                    this.goToIframe(selectedPage, userId)
                    return;
                  }
                  // Router.push({ pathname: './dashboard', search: '?query=' + userId, state: {   userid: userId, } })
                  Router.push({ pathname: './setup-dashboard', search: '?query=' + userId, state: {   userid: userId, } })
                }
              })
            } else if (appState != "" && roleUserId == 9) {
              konsole.log("checking", selectedPage);
              let selectedPagePath = '';
              sessionStorage.setItem("SessPrimaryUserId", loggedUserId);
              loginDetail.spouseName = response.data.data.spouseName
              sessionStorage.setItem("userLoggedInDetail", JSON.stringify(loginDetail));
              sessionStorage.setItem("userDetailOfPrimary", JSON.stringify(loginDetail));
              sessionStorage.setItem("loggedUserId", loggedUserId);
              sessionStorage.setItem("spouseUserId", response.data.data.spouseUserId);
              if (selectedPage == "") {
                Router.push({ pathname: './setup-dashboard', search: '?query=' + userId, state: {   userid: userId, }})
                return;
              }
              if(selectedPage?.startsWith("iframe")) {
                this.goToIframe(selectedPage, userId)
                return;
              }
              if (selectedPage == "legal") {
                Router.push({ pathname: '/LegalInfo', state: {   userid: userId, }})
                return;
              }
              if (selectedPage == "FileCabinet") {
                Router.push({ pathname: '/LegalInfo', state: {   userid: userId, }})
                return;
              }
            }
            else if ((appState !== "" && roleUserId == 3 || roleUserId == 13 || roleUserId == 14 || roleUserId == 15) && legalStaff !=="true") {
              sessionStorage.setItem("loggedUserId", loggedUserId);
              Router.push({ pathname: '../paralegal/', search: '?query=' + userId, state: {   userid: userId, }})
            }
            else if ((appState !== "" && roleUserId == 3 || roleUserId == 13 || roleUserId == 14 || roleUserId == 15 ||  roleUserId == 6) && legalStaff === "true") {
              sessionStorage.setItem("loggedUserId", loggedUserId);
              const query = username ? { username: username } : {};
              Router.push({
                pathname: '../portal-signon/allusers/',
                query: query,
                state: {
                  userid: userId,
                }
              })
            }
        }
        })
  }

  goToIframe = ( selectedPage, userId ) => {
    Router.push({ 
      pathname: './iframe/RequestHandler', 
      query: { 
        selectedPage: selectedPage, 
        userId: userId
      } 
    });
  }

  handleInputChange = (event) => {
    event.preventDefault();
    let attrname = event.target.name;
    let attrvalue = event.target.value;

    this.setState({
      ...this.state,
      [attrname]: attrvalue
    })
  }


  handleLoginSubmit = (event) => {
    event.preventDefault();
    // this.fetchAuthToken();
  }


  // fetchAuthToken = () => {
  //   const dataObj = {
  //     // userName: "TestUser",
  //     // password: "Password@123"
  //     userName: this.state.emailName,
  //     password: this.state.password
  //   }
  //   this.props.dispatchloader(true);


  //   $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getAuthTokenPath,
  //     dataObj, (response) => {

  //       if (response) {
  //         // konsole.log("path", response);
  //         const authToken = response.data.data.jwtToken;
  //         const loginDetail = {
  //           memberName: response.data.data.memberName,
  //           primaryEmailId: response.data.data.primaryEmailId,
  //           userName: response.data.data.userName
  //         }

  //         konsole.log("authToken", authToken);
  //         this.props.dispatchUserDetail(loginDetail);
  //         window.sessionStorage.setItem("AuthToken", authToken);
  //         window.sessionStorage.setItem("userDetailOfPrimary", JSON.stringify(loginDetail));
  //         window.sessionStorage.setItem("SessPrimaryUserId",
  //           //  '6240AAEC-2AAF-479E-B6D6-009C83549599'
  //           // 'dee3d66e-29be-43e1-b89e-1982d93a07d0'
  //           response.data.data.memberUserId
  //         );
  //         window.sessionStorage.setItem("subtenentId", 0);
  //         window.sessionStorage.setItem("RoleId", 0);
  //         window.sessionStorage.setItem("spouseUserId", "null")
  //         this.props.dispatchloader(false);
  //         Router.push({
  //           pathname: './dashboard',
  //           search: '?query=' + response.data.data.memberUserId,
  //           state: {
  //             userid: response.data.data.memberUserId,
  //           }
  //         })
  //       }
  //       else {
  //         alert(Msg.ErrorMsg);

  //       }
  //     });

  // }



  render() {
    return (
      <>
        {
          this.state.authtoken == "" &&
          (
            <>
              <Head>
                <title>Aging Options</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
              </Head>
              {/* <Container>
                <Row className="mt-5">
                  <Col
                    lg={5}
                    md={6}
                    sm={12}
                    className="p-5 m-auto shadow-sm rounded-lg"
                  >
                    <div className="alert alert-info">
                      Access Denied. Please contact administrator.
                    </div>
                  </Col>
                </Row>
              </Container> */}
            </>
          )
        }
      </>

    );
  }
};


const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
  dispatchUserDetail: userDetails =>
    dispatch({ type: GET_USER_DETAILS, payload: userDetails }),
});


export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
