import React, { useEffect, useState,useContext} from 'react';
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, } from "react-bootstrap";
import Transportation from './Transportation';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from "react-redux";
import { $Service_Url } from '../network/UrlPath';
import { getApiCall } from '../Reusable/ReusableCom';
import { globalContext } from '../../pages/_app';
import konsole from '../control/Konsole';

const TransportationModal = ({ dispatchloader }) => {

    // /** -------------------------------- state----define---------------------------------------------**/
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [autoMobilesList, setAutoMobilesList] = useState([])
    const [transportationList, setTransportationList] = useState([])
    const {setPageTypeId} = useContext(globalContext)
    const primaryUserId = sessionStorage.getItem('SessPrimaryUserId')

    useEffect(() => {
        if(isOpenModal == true && !transportationList?.length) fetchAutoMobilesInfo(primaryUserId)
    }, [isOpenModal])


    // /** -------------------------------- functuon for fetch all automobile list fir lable----define---------------------------------------------**/
    const fetchAutoMobilesInfo = async (userId) => {
        dispatchloader(true)
        const result = await getApiCall("GET", $Service_Url.getUserAgingAsset + userId)
        
        dispatchloader(false)
        if (result != 'err') {
            const responseData = result?.filter((item) => item.agingAssetCatId == 8)
         
            setTransportationList(responseData)
        }
    }
    const handleShow=()=>{
        setIsOpenModal(true)
        setPageTypeId(22)
    }
    return (
        <>
            <Col xs md="4" className="cursor-pointer" id="Transportation_Finance">
                <div className="d-flex align-items-center border py-1" onClick={() =>handleShow()}>
                    <div className="flex-grow-1 ms-2 border-end">Transportation</div>
                    <div className="">
                        <a>  <img className="px-2" src="/icons/add-icon.svg" alt="health Insurance" /></a>
                    </div>
                </div>
            </Col>
            {/*  /** ------------------ automodal component --------------------------**/}
            {isOpenModal && <Transportation
                key={transportationList}
                transportationList={transportationList}
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
export default connect(mapStateToProps, mapDispatchToProps)(TransportationModal);