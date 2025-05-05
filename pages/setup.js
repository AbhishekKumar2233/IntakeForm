"use client"
import React, { Component } from 'react';
import Layout from '../components/layout'
import Router from "next/router";
import { $getServiceFn, $postServiceFn, $CommonServiceFn } from '../components/network/Service';
import { GET_Auth_TOKEN, GET_USER_DETAILS, SET_LOADER } from '../components/Store/Actions/action'
import { connect } from 'react-redux';
import ProfessSearch from '../components/professSearch';
import TosterComponent from '../components/TosterComponent';
import { demo } from '../components/control/Constant';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import NewProServiceProvider from '../components/NewProServiceProvider';

class setup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            // 'dee3d66e-29be-43e1-b89e-1982d93a07d0',
            // userId: '6240AAEC-2AAF-479E-B6D6-009C83549599',
            showProfess: false,
            roleId:'',
            stateObj:'',

        }
    }
   
    componentDidMount() {
        let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
        let rolePrimaryId=sessionStorage.getItem('roleUserId');
        let stateObj=sessionStorage.getItem('stateObj')
    
        // console.log('stateObjstateObj',stateObj)
        this.setState({
            userId: newuserid,
            roleId:rolePrimaryId,
            stateObj:stateObj
        })
    }

    showprefessservice =() => {
        // debugger
        this.setState({
            showProfess: true
        })
    }
    render() {
        console.log("this.state.showmodal",this.state.showmodal)
        console.log("demodemodemo",demo)
        console.log('this.state.roleId',this.state.roleId)

        return (
            <Layout>
                <style jsx global>{`
                    .article-scetion{padding-top:0.725rem!important}
                    .dashboarditems{cursor:pointer}
                    
                `}</style>
                <div className="dashboard min-vh-100 m-0" id="dashboard" >
                    {/* <div className="dashboard-slide bg-white d-flex align-items-start justify-content-between flex-column py-4 px-4">
                        < h5 className="mb-auto" >Your life is about to get a whole lot more organized!</h5>
                        <button type="submit" className='px-2' onClick={() => { Router.push('./personalinfo') }}>GET STARTED</button>
                    </div> */}


                    <div className="dashboard-options mt-0">
                    <hr className='hr-setup'></hr>
                        <div className="dashboardItemList">
                            <div className="dashboarditems" id="prsnl" onClick={() => { Router.push('./personalinfo') }}>
                                <div className="image">
                                    <img src='icons/personalIcon.svg' alt="" />
                                </div>
                                <h5 >Personal Info</h5>
                                {/* <div className="progressbar">
                                    <div>70%</div>
                                </div> */}
                            </div>
                            <div className="dashboarditems" onClick={() => { Router.push('./familyinfo') }}>
                                <div className="image">
                                    <img src={'icons/FamilyIcon.svg'} />
                                </div>
                                <h5>Family</h5>
                                {/* <div className="progressbar">
                                    <div>70%</div>
                                </div> */}
                            </div>
                            <div className="dashboarditems" onClick={() => { Router.push('./healthpage') }}>
                                <div className="image">
                                    <img src='icons/HealthIcon.svg' />
                                </div>
                                <h5>Health </h5>
                                {/* <div className="progressbar">
                                    <div>70%</div>
                                </div> */}
                            </div>
                            <div className="dashboarditems" onClick={() => { Router.push('./housinginfo') }}>
                                <div className="image">
                                    <img src="icons/HousingIcon.svg" />
                                </div>
                                <h5>Housing</h5>
                                {/* <div className="progressbar">
                                    <div>70%</div>
                                </div> */}
                            </div>
                            <div className="dashboarditems" onClick={() => { Router.push('./Finance') }}>
                                <div className="image">
                                    <img src='icons/FinancialIcon.svg' />
                                </div>
                                <h5>Finance</h5>
                                {/* <div className="progressbar">
                                    <div>70%</div>
                                </div> */}
                            </div>
                            <div className="dashboarditems" onClick={() => { Router.push('./LegalInfo') }}>
                                <div className="image">
                                    <img src="icons/Legal.svg" />
                                </div>
                                <h5>Legal </h5>
                                {/* <div className="progressbar">
                                    <div>70%</div>
                                </div> */}
                            </div>
                            {/* <div className="dashboarditems" onClick={() => { Router.push('./Legal-Fiduciary') }}>
                                <div className="image">
                                    <img src={'icons/fidbenIcon.svg'} />
                                </div>
                                <h5>Fiduciary / Beneficiary</h5>
                                {/* <div className="progressbar">
                                    <div>70%</div>
                                </div> 
                            </div> */}
                            <div className="dashboarditems" onClick={this.showprefessservice}>
                                {/* <a >
                                    <div className="image">
                                        <img src='icons/profesProIcon.svg' />
                                    </div>
                                    <h5> My Professional Service Provider</h5>
                                    <div className="progressbar">
                                        <div>70%</div>
                                    </div>
                                </a> */}
                                <NewProServiceProvider  protypeTd="" uniqueKey="setup" />
                            </div>
                            {(this.state.roleId==9)?
                            <div className="dashboarditems" onClick={() => { Router.push('./Agentguidance') }}>
                                <div className="image">
                                    <img src={'icons/setGuidance.svg'} />
                                </div>
                                <h5>Agent / Guidance</h5>
                            </div>:null}
                            {/* {(this.state.stateObj?.roleId !==3)&& 
                            <div className="dashboarditems" onClick={() => { Router.push('./FileCabinetNew') }}>
                                <div className="image">
                                    <img src={'icons/personalIcon.svg'} />
                                </div>
                                <h5>File Cabinet</h5>
                            </div>} */}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({ type: SET_LOADER, payload: loader }),
    dispatchUserDetail: userDetails =>
        dispatch({ type: GET_USER_DETAILS, payload: userDetails }),
    dispatchAuthId: authId =>
        dispatch({ type: GET_Auth_TOKEN, payload: authId })
});

export default connect(mapStateToProps, mapDispatchToProps)(setup);
