import React, { useState, useEffect, useRef, useContext } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from "react-datepicker";

import { connect } from 'react-redux';

import { SET_LOADER } from './Store/Actions/action'
import { $Service_Url } from "./network/UrlPath";
import { $CommonServiceFn } from './network/Service';
import { $AHelper } from './control/AHelper';
import { Msg } from './control/Msg';
import konsole from './control/Konsole';
import moment from 'moment';
import { globalContext } from "../pages/_app";
import AddressListComponent from './addressListComponent';
import ContactListComponent from './ContactListComponent';


const RealPropertyLenders = (props) => {
    konsole.log("propaprops", props)
    const liabilityRef = useRef();
    const addressaddref = useRef()

    const { data, setdata, confirmyes, setConfirmyes, handleCloseYes } = useContext(globalContext);


    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    const [nameofLender, setnameofLender] = useState('')
    const [userId, setuserId] = useState('')
    const [loggedUserId, setloggedUserId] = useState('')
    const [subtenantId, setsubtenantId] = useState('')
    const [update, setupdate] = useState('')
    const [lenderUserId, setLenderUserId] = useState('')

    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
        let loggedUserId = sessionStorage.getItem("loggedUserId") || "";
        let subtenantId = sessionStorage.getItem("SubtenantId") || "";
        setloggedUserId(loggedUserId)
        setuserId(newuserid)
        setsubtenantId(subtenantId)


    }, [])
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    const toasterShowMsg = (message, type) => {
        setdata({
            open: true,
            text: message,
            type: type,
        })
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const validate = () => {
        let nameError = ""
        if (nameofLender == "") {
            nameError = "Name of lender can not be Blank"
        }
        if (nameError) {

            toasterShowMsg(nameError, "Warning")
            return false;
        }
        return true;
    }
    const saveBtnFun = (type) => {
        if (validate()) {

            addmemberfun(type)
        }
    }

    const addmemberfun = (type) => {
        props.dispatchloader(true)
        let jsonobj = {
            "subtenantId": subtenantId,
            "fName": null,
            "lName": null,
            "isPrimaryMember": false,

        }
        //------------------------------------------------------------------
        let ApiUrl = $Service_Url.postAddMember
        let method = "POST"
        if (update == true) {
            jsonobj["updatedBy"] = loggedUserId
            jsonobj["userId"] = lenderUserId
            ApiUrl = $Service_Url.putUpdateMember
            method = "PUT"

        } else {
            ApiUrl = $Service_Url.postAddMember
            jsonobj["createdBy"] = loggedUserId
            method = "POST"
        }
        //------------------------------------------------------------------------
        let nameofLendersplit = nameofLender.split(' ')
        if (nameofLendersplit.length == 1) {
            jsonobj['fName'] = nameofLendersplit[0]
            jsonobj['lName'] = null
        } else if (nameofLendersplit.length > 1) {
            let lastName = nameofLendersplit.splice(nameofLendersplit.length - 1, 1).join('')
            jsonobj['fName'] = nameofLendersplit.join(' ')
            jsonobj['lName'] = lastName
        }
        console.log("jsonobj2", jsonobj)

        $CommonServiceFn.InvokeCommonApi(method, ApiUrl, jsonobj, (res, err) => {
            props.dispatchloader(false)
            if (res) {
                konsole.log("postAddMember", res)
                let userId = res.data?.data?.member?.userId
                postUserLiabilities(userId, type)
                setLenderUserId(userId)


            } else {
                konsole.log('postAddMember', err)
            }
        })


    }


    const postUserLiabilities = (lenderUserId, type) => {
        props.dispatchloader(true)


        let liableinput = {
            "liabilityTypeId": 6,
            "liabilityId": props?.liabitiestypeId,
            "userRealPropertyId": props?.userRealPropertyId,
            "nameofInstitutionOrLender": nameofLender,
            "lenderUserId": lenderUserId,
        }


        if (update == true) {
            liableinput["updatedBy"] = loggedUserId
        }
        else {
            liableinput["createdBy"] = loggedUserId

        }
        let totalinput = {
            userId: userId,
            liability: liableinput
        }
        //------------------------------------------
        var apiurl = $Service_Url.postAddLiability
        var method = "POST"
        if (update == true) {
            apiurl = $Service_Url.putAddLiability
            method = "PUT"

        }
        konsole.log("jaonobj2", JSON.stringify(totalinput))
        konsole.log("apiurl", apiurl, method)

        // ----------------------
        $CommonServiceFn.InvokeCommonApi(method, apiurl, totalinput, (res, err) => {
            props.dispatchloader(false)

            if (res) {
                konsole.log("postAddLiability", res)
                if (type !== 'save') {

                    addressaddref.current.setUserId(lenderUserId);
                } else {
                    props.handleClose()
                }

            } else {
                konsole.log("postAddLiability", err)
            }
        })

    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    return (
        <>

            <Modal size="lg" show={props.show}enforceFocus={false} onHide={props.handleClose} centered animation="false" backdrop="static">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Add Lender Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pb-5 pt-4">
                    <div className='person-content'>

                        <Form.Group as={Row} className="mb-3">
                            <Col xs sm="6" lg="5">
                                <Form.Control type="text"
                                    value={nameofLender}
                                    onChange={(e) => setnameofLender(e.target.value)}
                                    name="nameofLender"
                                    placeholder="Name of Lender" />
                            </Col>

                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <AddressListComponent userId={lenderUserId} ref={addressaddref} invokepostmember={saveBtnFun} />
                            {(lenderUserId !== undefined && lenderUserId !== '' && lenderUserId !== null) ?
                                <ContactListComponent userId={lenderUserId} />
                                :
                                <Row className="m-0 mb-4">
                                    <Col xs md="6" className="d-flex align-items-center ps-0 ">
                                        <button
                                            className="white-btn" onClick={() => saveBtnFun()}>Contact</button>

                                    </Col> </Row>}


                        </Form.Group>


                    </div>
                    <Button className="theme-btn " onClick={() => props.handleClose()} >Cancel</Button>

                    <Button className="theme-btn float-end" onClick={() => saveBtnFun("save")} >Save</Button>



                </Modal.Body>
                <Modal.Footer className="border-0 mb-3" style={{ maxHeight: "15vh", overflowY: "scroll" }}>


                </Modal.Footer>


            </Modal>
        </>
    )
}


const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RealPropertyLenders);