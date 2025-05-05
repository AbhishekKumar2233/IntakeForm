import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, } from "react-bootstrap";
import AutoMobiles from './AutoMobiles';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from "react-redux";
import { $Service_Url } from '../network/UrlPath';
import { getApiCall } from '../Reusable/ReusableCom';
import konsole from '../control/Konsole';

const AutoMobileModal = ({ dispatchloader }) => {

    // /** -------------------------------- state----define---------------------------------------------**/
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [autoMobilesList, setAutoMobilesList] = useState([])

    useEffect(() => {
        const primaryUserId = sessionStorage.getItem('SessPrimaryUserId')
        fetchAutoMobilesInfo(primaryUserId)
    }, [])


    // /** -------------------------------- functuon for fetch all automobile list fir lable----define---------------------------------------------**/
    const fetchAutoMobilesInfo = async (userId) => {
        dispatchloader(true)
        const result = await getApiCall("GET", $Service_Url.getUserAgingAsset + userId)
        konsole.log('resultresult', result)
        dispatchloader(false)
        if (result != 'err') {
            const responseData = result?.filter((item) => item.agingAssetCatId == 8)
            setAutoMobilesList(responseData)
        }
    }
    return (
        <>
            <Col xs md="4" className="cursor-pointer">
                <div className="d-flex align-items-center border py-1" onClick={() => setIsOpenModal(true)}>
                    <div className="flex-grow-1 ms-2 border-end">Transportation</div>
                    <div className="">
                        <a>  <img className="px-2" src="/icons/add-icon.svg" alt="health Insurance" /></a>
                    </div>
                </div>
            </Col>
            {/*  /** ------------------ automodal component --------------------------**/}
            {isOpenModal && <AutoMobiles
                key={autoMobilesList}
                autoMobilesList={autoMobilesList}
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
                fetchAutoMobilesInfo={fetchAutoMobilesInfo}
            />}
        </>
    )
}

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps, mapDispatchToProps)(AutoMobileModal);