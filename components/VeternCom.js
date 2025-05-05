import React, { useEffect, useState, useRef, useContext } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb } from 'react-bootstrap';
import useUserIdHook from './Reusable/useUserIdHook';
import { getApiCall, isNotValidNullUndefile, isNullUndefine, postApiCall } from './Reusable/ReusableCom';
import { $Service_Url } from './network/UrlPath';
import konsole from './control/Konsole';
import Select from "react-select";
import { $AHelper } from './control/AHelper';
import Other from './asssets/Other';
import { globalContext } from '../pages/_app';
import { connect } from 'react-redux';
import { SET_LOADER } from './Store/Actions/action';
import AlertToaster from './control/AlertToaster';

const newObj = () => {
    return { "activeServiceDuration": "", "warzone": "", "wartimePeriod": "", "dischargeTypeId": 0, "activityTypeId": 2, "userId": "", "createdBy": "", "UpdatedBy": "", veteranId: "" }
}
const VeternCom = ({ refrencePage, label, checkVeternProfile, userId, isVeteranChecked, dispatchloader }) => {
    const { _loggedInUserId } = useUserIdHook();
    const { setdata, confirm } = useContext(globalContext)
    const warTimeRef = useRef(null)
    const dischargeRef = useRef(null)
    const [isModalShow, setIsShowModal] = useState(false)
    const [dischargeTypes, setDischargeTypes] = useState([])
    const [warTimePeriodList, setWarTimePeriodList] = useState([])
    const [veternInfo, setVeternInfo] = useState({ ...newObj(), 'createdBy': _loggedInUserId, 'userId': userId, "UpdatedBy": _loggedInUserId })
   
    useEffect(() => {
        fetchApi();
    }, [])
    useEffect(() => {
        if (isNotValidNullUndefile(userId)) {
            fetchVernData();
        }
    }, [userId]);


// @Fetch Api
    const fetchApi = async () => {
        dispatchloader(true);
    const _resultOfdischarge = await getApiCall('GET', $Service_Url.getDischargeType, setDischargeTypes)
   const _resultOfwarTimePeriod = await getApiCall('GET', $Service_Url.getWarTimePeriodPath, setWarTimePeriodList);
        dispatchloader(false);
    }

    // @Fetch Veteran Data
    const fetchVernData = async () => {
        dispatchloader(true);
        const _resultOfVetern = await getApiCall("GET", $Service_Url.getVeteranData + userId, '');
        konsole.log("_resultOfVetern", _resultOfVetern);
        dispatchloader(false);
        if (_resultOfVetern != 'err') {
            const { activeServiceDuration, warzone, wartimePeriod, dischargeTypeId, activityTypeId, veteranId } = _resultOfVetern;
            setVeternInfo(prev => ({
                ...prev, 'veteranId': veteranId, "activeServiceDuration": activeServiceDuration, "warzone": warzone,
                "wartimePeriod": wartimePeriod, dischargeTypeId: dischargeTypeId.toString(), "activityTypeId": activityTypeId
            }))
            checkVeternProfile(true)
        } else {
            if(isVeteranChecked ==true || isVeteranChecked ==false){
                checkVeternProfile(false)
            }
        }
    }
    // @State Update
    const handleStateUpdate = (key, value) => {
        setVeternInfo(prev => ({
            ...prev,
            [key]: value
        }))
    }
// @Modal Show Hide
    const handleShowModal = (val, type) => {
        setIsShowModal(val);
        if (val == false && (type == 'DELETE' || !isNotValidNullUndefile(veternInfo?.veteranId))) {
            setVeternInfo({ ...newObj(), 'createdBy': _loggedInUserId, 'userId': userId, "UpdatedBy": _loggedInUserId })
        }
    }

    const handleChange = () => {
        handleShowModal(true)
    }

    function toasterAlert(text) {
        setdata({ open: true, text: text, type: "Warning" });
    }

    // @Validate for Mandatory
    const validate = () => {
        const { warzone, activeServiceDuration, dischargeTypeId, wartimePeriod } = veternInfo
        let nameError = "";
        if (isNullUndefine(warzone)) {
            nameError = "please choose war zone";
        }
        if (isNullUndefine(activeServiceDuration)) {
            nameError = "Please choose active service";
        }
        if (isNullUndefine(dischargeTypeId)) {
            nameError = "Discharge Type cannot be blank";
        }
        if (isNullUndefine(wartimePeriod)) {
            nameError = "War time cannot be blank";
        }
        if (nameError) {
            toasterAlert(nameError, "Warning");
            return false;
        }
        return true;
    };

    // @Data Save-----
    const saveData = async () => {
        if (!validate()) return;
        let jsonObj = veternInfo;
        jsonObj['userId'] = userId;

        konsole.log("jsonObjjsonObj", jsonObj)
        let method = isNotValidNullUndefile(veternInfo.veteranId) ? 'PUT' : 'POST';
        let url = method == 'POST' ? $Service_Url.postVeteranByUserid : $Service_Url.updateVeteranData;
        dispatchloader(true);
        const _resultSaveVetrenData = await postApiCall(method, url, jsonObj);
        AlertToaster.success(`Veteran details ${method == 'POST' ? "saved" : "updated"} successfully`)
        konsole.log("_resultSaveVetrenData", _resultSaveVetrenData);
        if (_resultSaveVetrenData != 'err') {
            const responseVeteran = _resultSaveVetrenData.data.data;
            if (veternInfo.wartimePeriod == '999999') {
                warTimeRef.current.saveHandleOther(responseVeteran.veteranId);
            }
            if (veternInfo.dischargeTypeId == '999999') {
                dischargeRef.current.saveHandleOther(responseVeteran.veteranId);
            }
            dispatchloader(false);
            checkVeternProfile(true)
            fetchVernData();
            handleShowModal(false)
        }
    }
    konsole.log("veternInfo.wartimePeriod", veternInfo.wartimePeriod);

    // @Delete Data api
    const deleteData = async () => {
        if(isVeteranChecked==null){
            checkVeternProfile(false);
            return;
        }
        const req = await confirm(true, "Are you sure? you want to delete", "Confirmation");
        if (!req) return;
        const jsonObj = {
            veteranId: veternInfo.veteranId,
            userId: userId,
            deletedBy: _loggedInUserId,
        }
        dispatchloader(true);
        const _resultDeleteVetrn = await postApiCall('DELETE', $Service_Url.deleteVeteranByUserId, jsonObj);
        checkVeternProfile(false)
        if (_resultDeleteVetrn != 'err') {
            AlertToaster.success("Veteran details deleted successfully.");
            dispatchloader(false);
            handleShowModal(false, 'DELETE');
            checkVeternProfile(false)
        }
    }

    // @konsole -------
    konsole.log("dischargeTypes", dischargeTypes, "warTimePeriodList", warTimePeriodList)
    konsole.log("veternInfoveternInfo", veternInfo, userId, refrencePage)

    return (
        <>
            <Row className="m-0 mt-2 mb-3 p-0" >
                <Col sm="12" lg="6" className="labelOfVetern" style={{marginLeft:"-10px"}}>
                    <label> {label} </label>
                </Col>
                <Col xs="12" lg="6">
                    <>
                        {isNotValidNullUndefile(veternInfo.veteranId) &&
                            <img onClick={() => handleShowModal(true)} src="/icons/pen-icon.svg" width="25px" className="ms-1 img-thumbnail rounded-circle cursor-pointer" />
                        }
                        <Form.Check inline className="chekspace cursor-pointer"
                            type="radio"
                            name={`Yes-${refrencePage}`}
                            label={'Yes'}
                            value="Yes"
                            onChange={(e) => handleChange(e)}
                            checked={isVeteranChecked == true}
                            disabled={isVeteranChecked && isNotValidNullUndefile(veternInfo.veteranId)}
                        />
                    </>
                    <Form.Check inline className="chekspace cursor-pointer"
                        type="radio"
                        name={`No-${refrencePage}`}
                        label='No'
                        value="No"
                        onChange={() => deleteData()}
                        checked={isVeteranChecked == false}

                    />
                </Col>
            </Row>

            <Modal
                show={isModalShow}
                size="md"
                centered
                animation="false"
                onHide={() => handleShowModal(false)}
                backdrop="static">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Veteran</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-3">
                        <Col xs md="12">
                            <Select
                                className="w-100 custom-select"
                                onChange={(value) => { handleStateUpdate('wartimePeriod', value.value); }}
                                options={warTimePeriodList}
                                value={warTimePeriodList?.find(item => item.value == veternInfo.wartimePeriod)}
                                placeholder={$AHelper.mandatory("War Time Period....")}
                            />
                        </Col>
                    </Row>
                    {veternInfo.wartimePeriod == "999999" &&
                        <Row className="mb-3">
                            <Col xs md="12">
                                <Other
                                    othersCategoryId={33}
                                    userId={userId}
                                    dropValue={veternInfo.wartimePeriod}
                                    ref={warTimeRef}
                                    natureId={veternInfo?.veteranId}
                                />
                            </Col>
                        </Row>
                    }
                    <Row className="mb-3">
                        <Col xs md="12">
                            <Select
                                className="w-100 custom-select"
                                options={dischargeTypes}
                                onChange={(value) => { handleStateUpdate('dischargeTypeId', value.value); }}
                                value={dischargeTypes?.find(item => item.value == veternInfo.dischargeTypeId)}
                                placeholder={$AHelper.mandatory("Discharge Type")}
                            />
                        </Col>
                    </Row>
                    {veternInfo.dischargeTypeId == "999999" && (
                        <Row className="mb-3">
                            <Col xs md="12">
                                <Other
                                    othersCategoryId={32}
                                    userId={userId}
                                    dropValue={veternInfo.dischargeTypeId}
                                    ref={dischargeRef}
                                    natureId={veternInfo?.veteranId}
                                />
                            </Col>
                        </Row>
                    )}
                    <Row className="mb-3">
                        <Col xs sm="10" lg="12" >
                            <label className="" id="veternActiveId">
                                {veternInfo.wartimePeriod == '6' ? (
                                    $AHelper.mandatoryAsteriskAtStart("Did you serve at least (90 Day) in active service ?")
                                ) : (
                                    $AHelper.mandatoryAsteriskAtStart("Did you serve at least (1 Day) in active service ?")
                                )}
                            </label>
                            <div className="d-flex justify-content-start align-items-center">
                                <div key="checkbox8" className="me-4 pe-3 mb-0 d-flex align-items-center">
                                    <Form.Check
                                        className="chekspace"
                                        type="radio"
                                        id="checkbox9"
                                        value="Yes"
                                        label="Yes"
                                        name="activeServiceDuration"
                                        onChange={(value) => handleStateUpdate('activeServiceDuration', 'Yes')}
                                        checked={veternInfo?.activeServiceDuration == 'Yes'}
                                    />
                                </div>
                                <div key="checkbox9" className="me-4 pe-3 mb-0 d-flex align-items-center">
                                    <Form.Check
                                        className="chekspace"
                                        type="radio"
                                        id="checkbox8"
                                        value="No"
                                        label="No"
                                        name="activeServiceDuration"
                                        onChange={(value) => handleStateUpdate('activeServiceDuration', 'No')}
                                        checked={veternInfo?.activeServiceDuration == 'No'}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs sm="10" lg="9">
                            <label className="" id="veternWarId">
                                {$AHelper.mandatoryAsteriskAtStart("Did you serve in war zone ?")}
                            </label>
                            <div className="d-flex justify-content-start align-items-center">
                                <div key="checkbox8" className="me-4 pe-3 mb-0 d-flex align-items-center" >
                                    <Form.Check
                                        className="chekspace"
                                        type="radio"
                                        id="checkbox8"
                                        label="Yes"
                                        value="Yes"
                                        name="warzone"
                                        onChange={(value) => handleStateUpdate('warzone', 'Yes')}
                                        checked={veternInfo?.warzone == 'Yes'}
                                    />
                                </div>
                                <div key="checkbox9" className="me-4 pe-3 mb-0 d-flex align-items-center ">
                                    <Form.Check
                                        className="chekspace"
                                        type="radio"
                                        id="checkbox9"
                                        value="No"
                                        label="No"
                                        name="warzone"
                                        onChange={(value) => handleStateUpdate('warzone', 'No')}
                                        checked={veternInfo?.warzone == 'No'}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    {isNotValidNullUndefile(veternInfo?.veteranId) ? <>
                        <Button className="theme-btn" onClick={() => deleteData()}>{" "} Delete{" "}</Button>
                        <Button className="theme-btn" onClick={() => saveData()}>{" "}Update {" "} </Button>
                    </> : <Button className="theme-btn" onClick={() => saveData()} > Save</Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({ type: SET_LOADER, payload: loader, }),
});

export default connect("", mapDispatchToProps)(VeternCom);

