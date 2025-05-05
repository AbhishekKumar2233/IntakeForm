import React, { useEffect, useState, useContext } from 'react'
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import Select from "react-select";
import { $Service_Url } from '../network/UrlPath';
import { getApiCall, isNotValidNullUndefile, postApiCall,postApiCallNew } from '../Reusable/ReusableCom';
import ModalHeader from '../paralLegalComponent/ModalHeader';
import { globalContext } from '../../pages/_app';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from 'react-redux';
import AlertToaster from '../control/AlertToaster';
import konsole from '../control/Konsole';
import EmailUpdateOccurance from './EmailUpdateOccurance';
import useUserIdHook from '../Reusable/useUserIdHook';
const EmailUpdate = ({ show, onHide, mailForUpdate, dispatchloader, userId, fetchSavedContactDetails, isEmailActive }) => {
    const { _userDetailOfPrimary } = useUserIdHook();
    const context = useContext(globalContext)

    const previousEmail = mailForUpdate
    const { setdata } = useContext(globalContext)
    const loggedInUserId = sessionStorage.getItem('loggedUserId') || ''
    const [userUpdatedEmail, setUserUpdateEmail] = useState(mailForUpdate)
    const [showOccurrance, setShowOccurrence] = useState(false)
    konsole.log('mailForUpdatemailForUpdate', userUpdatedEmail, mailForUpdate)
    console.log('isEmailActiveisEmailActive', isEmailActive)

    const handleChange = (e) => {
        setUserUpdateEmail(e.target.value)
    }

    function validateContact(typeofSave) {
        let regexName = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        switch (typeofSave) {
            case "email":
                if (!regexName.test(userUpdatedEmail)) {
                    setUserUpdateEmail('')
                    toasterAlert("Enter the valid Email Id");
                    break;
                }
                break;
        }
    }

    const updateEmail = async () => {
        if (!isNotValidNullUndefile(userUpdatedEmail)) {
            toasterAlert('Enter the Email Id')
            return;
        }
        let jsonObj = {
            "currentUserName": previousEmail,
            "newUserName": userUpdatedEmail,
            "updatedBy": loggedInUserId,
            "remarks": "Client Primary Email Updated by Legal",
            "clientIPAddress": "::1",
            "isParaResquest": isEmailActive
        }
        konsole.log('jsonObj', jsonObj)

        if (userUpdatedEmail != previousEmail) {
            if (isEmailActive == true) {
                const ques = await context.confirm(true, "Are you sure you want to change your email? If yes, please send the reactivation link to client's account after the email update.", 'Confirmation');
                if (!ques) return;
            }

            dispatchloader(true);
            let result = await postApiCallNew('PUT', $Service_Url.putUserNameEmail, jsonObj);
            konsole.log('_result', result)
            if (result?.isError == "true") {
                let res = result?.resPonse?.data?.messages?.[0]
                dispatchloader(false);
                AlertToaster.success(res);
                return;
              }
            let userPrimaryDetails=_userDetailOfPrimary;
            userPrimaryDetails.primaryEmailId=userUpdatedEmail;
            userPrimaryDetails.userName=userUpdatedEmail;
            sessionStorage.setItem("userDetailOfPrimary", JSON.stringify(userPrimaryDetails));
            if(isEmailActive==true){
                handleEmailOccurrance(true);
                return;
            }
            // return;

        }
        AlertToaster.success('Email updated successfully.');
        // handleEmailOccurrance(true);
        onHideAndFetchData()

    }


    const onHideAndFetchData = () => {
        fetchSavedContactDetails(userId)
        onHide()
    }


    const handleEmailOccurrance = (value) => {
        setShowOccurrence(value)
        if(value=='close'){
            onHideAndFetchData();
        }
    }
    function toasterAlert(text) {
        setdata({ open: true, text: text, type: "Warning" });
    }

    console.log('oldEmailAddress', previousEmail, userUpdatedEmail)

    return (

        <>
            {(showOccurrance) &&
                <EmailUpdateOccurance
                    oldEmailAddress={previousEmail}
                    newEmailAddress={userUpdatedEmail}
                    key={showOccurrance}
                    showOccurrance={showOccurrance}
                    handleEmailOccurrance={handleEmailOccurrance}
                    userUpdatedEmail={userUpdatedEmail}
                     />
            }

            <style jsx global>{`
        .modal-open .modal-backdrop.show {
          opacity: 0.5 !important;
        }
        `}</style>
            <Modal show={show} onHide={() => onHide(false)} animation="false" backdrop="static" centered size='md'>
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Contact Information</Modal.Title>
                </Modal.Header>
                <Modal.Body className=" bg-light border-danger rounded">
                    <Row className="m-0 mb-0 align-items-center">
                        <h5 className="my-3 d-flex">
                            <span>Email</span>
                            <span className='ms-3'>
                                {isEmailActive ?
                                    <>  <span style={{ backgroundColor: 'green', borderRadius: "50%", color: "green", padding: '1px' }}>***</span> Active </>:
                                    <>  <span style={{ backgroundColor: 'orange', borderRadius: "50%", color: "orange", padding: '1px' }}>***</span> InActive    </>
                                }
                            </span>
                        </h5>
                        <Col xs="4" md="4" className="d-flex align-items-center ps-0">
                            <Select
                                className="w-100 custom-select"
                                options={[{ value: "1", label: "Primary" }]}
                                placeholder="Type"
                                isDisabled
                                value={[{ value: "1", label: "Primary" }]}
                            />
                        </Col>
                        <Col xs="6" md="7" className="d-flex align-items-center ps-0">
                            <Form.Control
                                value={userUpdatedEmail}
                                name="emailId"
                                type="email"
                                onChange={(e) => handleChange(e)}
                                onBlur={() => validateContact("email")}
                                placeholder="Enter email"
                            />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="border-0 mt-0">
                    <Button className="theme-btn" style={{ backgroundColor: "#76272b" }} onClick={() => updateEmail()}>Update</Button>
                </Modal.Footer>
            </Modal>
        </>)
}

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps, mapDispatchToProps)(EmailUpdate);