import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, InputGroup, } from "react-bootstrap";
import Contact from "../components/contact";
import { $getServiceFn, $postServiceFn, $CommonServiceFn, } from "../components/network/Service";
import konsole from "../components/control/Konsole";
import { $AHelper } from "../components/control/AHelper";
import { connect } from 'react-redux';
import { GET_USER_DETAILS, SET_LOADER } from './Store/Actions/action';
import { $Service_Url } from './network/UrlPath';
import { Msg } from './control/Msg';
import { globalContext } from "../pages/_app"
import AlertToaster from "./control/AlertToaster";
import { paralegalAttoryId } from "./control/Constant";
import EmailUpdate from "./ContactUpdate/EmailUpdate";
import { getApiCall2 } from "./Reusable/ReusableCom";
import NotificationPermission from "./contact/NotificationPermission";
import { lpoIntakeRoleId } from "./control/Constant";


class ContactListComponent extends Component {
    static contextType = globalContext
    constructor(props) {
        super(props)
        this.state = {
            userId: "",
            loggedInUser: "",
            allContactDetails: [],
            showContact: false,
            primaryUserId: "",

            primaryContactIdValidation: "",
            primaryEmailIdValidation: "",
            loggedInRoleId: '',
            isUpdatePrimaryEmail: '',
            mailForUpdate: '',
            isEmailActive: false,



        }
    }

    componentDidMount() {
        let loggedInUser = sessionStorage.getItem("loggedUserId") || "";
        let primaryUserId = sessionStorage.getItem("SessPrimaryUserId") || "";
        let loggedInDetails = JSON.parse(sessionStorage.getItem('stateObj'))
        // konsole.log("adadadd",this.props.userId)
        this.setState({
            userId: this.props.userId,
            loggedInUser: loggedInUser,
            primaryUserId: primaryUserId,
            loggedInRoleId: loggedInDetails?.roleId
        });
        this.fetchSavedContactDetails(this.props.userId);

    }

    InvokeEditContactID = async (contactTypeId, EditContactType) => {

        if (EditContactType == 'email' && contactTypeId.contactTypeId == 1) {
            this.props.dispatchloader(true);
            // let result = await getApiCall2('GET', $Service_Url.getUserDetailsByUserEmailId + `?emailId=${contactTypeId?.emailId}`);
            let result = await getApiCall2('GET', $Service_Url.getUserDetailsByUserEmailId + `?UserId=${this.state.userId}`);
            this.props.dispatchloader(false);
            konsole.log('result', result,contactTypeId?.emailId)
            const response = result?.data;
            if (result != 'err' && response?.length > 0) {
                const { isActive } = response[0]
                if (isActive == true) {
                    // this.toasterAlert("You can not edit primary email after Activation.");
                    console.log('loggedInRoleIdloggedInRoleId',this.state.loggedInRoleId)
                    if (paralegalAttoryId.includes(this.state.loggedInRoleId)) {  // ------------------- This condition is for allowing only the paralegal(to edit client email id) not the client theirself  ------------------
                        this.setState({
                            isEmailActive: true,
                            mailForUpdate: contactTypeId?.emailId,
                            isUpdatePrimaryEmail: true,
                        })
                    } else {
                        this.toasterAlert("You can not edit primary email after Activation. Please contact the Paralegal.");
                    }
                    return;
                } else if (isActive != true) {
                    this.setState({
                        isEmailActive: false,
                        mailForUpdate: contactTypeId?.emailId,
                        isUpdatePrimaryEmail: true,
                    })
                    return;
                }
            }else{
                this.setState({
                    EditContactType: EditContactType,
                    EditContactId: contactTypeId,
                });
                this.handleshowContact();
            // this.toasterAlert('Unable to process your request; please try again after some time.');
            return;
            }
        } if (this.state.userId == this.state.primaryUserId || this.props.checkjointconditionforoccurance == 2) {
            // if ((contactTypeId.contactTypeId !== 1) || (EditContactType == 'mobile' && paralegalAttoryId.includes(this.state.loggedInRoleId))) { // ------------------- This condition is for allowing only the paralegal(to edit client mobile number) not the client theirself  ------------------
                this.setState({
                    EditContactType: EditContactType,
                    EditContactId: contactTypeId,
                });
                this.handleshowContact();
            // } else {
            //     this.toasterAlert(EditContactType == "mobile" ? "You can not edit primary contact no. please contact Paralegal for the changes." : "You can not edit primary email please contact Paralegal for the changes.");
            // }
        }
        else {

            this.setState({
                EditContactType: EditContactType,
                EditContactId: contactTypeId,

                // primaryEmailIdValidation:""
            });
            this.handleshowContact();
        }

    };




    

    fetchSavedContactDetails = (userid) => {
        konsole.log("fetchSavedContactDetailsuserid", userid)
        this.props.dispatchloader(true);
        userid = userid || this.state.userId;
        if(!userid) return;
        $CommonServiceFn.InvokeCommonApi(
            "GET",
            $Service_Url.getAllContactOtherPath + userid,
            "",
            (response, error) => {
                this.props.dispatchloader(false);
                if (response) {
                    this.setState({
                        ...this.state,
                        allContactDetails: response.data.data?.contact,
                    });
                    konsole.log("response.data.data?.contact", response.data.data.contact)
                    if (this.props?.contactDetails !== undefined) {
                        this.props?.contactDetails(response.data.data.contact.mobiles, response.data.data.contact.mobiles)
                    }

                    if (this.props.editType === "Spouse") {
                        const filterContact = response.data.data.contact.emails.find((data) => data.contactTypeId === 1);
                        const filterContactMobile = response.data.data.contact?.mobiles.find((data) => data.contactTypeId === 1)
                        konsole.log("filterContactMobilefilterContactMobile", filterContactMobile)
                        if (Object.entries(filterContact).length > 0) {
                            konsole.log("filterContactfilterContact")
                            this.props.setSpouseEmail(filterContact.emailId)
                        }
                        if (Object.entries(filterContactMobile)?.length > 0) {
                            konsole.log("filterContactfilterContact")
                            this.props.setSpouseMobile(filterContactMobile.mobileNo)
                        }
                    }

                    konsole.log("responseatsav", response);
                } else {
                    // alert(Msg.ErrorMsg);
                    konsole.log("Errrtt", error)
                }
            }
        );
    };

    setUserId = (userId) => {
        if (userId) {
            this.setState({
                userId: userId,
            }, () => {
                this.contactClick();
            })
        }
    }
    handleshowContact = () => {
        this.setState({
            showContact: !this.state.showContact,
        });
    };

    handleDeleteContact = async (userid, contactId) => {
        konsole.log("ageon", contactId.contactId)
        // let ques = confirm("are you sure you want to delete this contact?");
        let ques = await this.context.confirm(true, "Are you sure you want to delete this contact ?", "Confirmation")
        if (ques) {
            this.props.dispatchloader(true);

            let jsonobj = {
                userId: userid,
                contactId: contactId?.contactId,
                deletedBy: this.state.loggedInUser
            }
            konsole.log('responseeeeeerror', jsonobj)
            $CommonServiceFn.InvokeCommonApi(
                "DELETE",
                $Service_Url.deleteContactPath, jsonobj,
                (response, error) => {
                    this.props.dispatchloader(false);
                    if (response) {
                        konsole.log("responseeeeerror", response)
                        AlertToaster.success("Contact deleted successfully");
                        this.fetchSavedContactDetails(userid);
                    } else {
                        // alert(Msg.ErrorMsg);
                        this.toasterAlert(Msg.ErrorMsg);
                        konsole.log("responseeeeeerror", error)
                    }
                }
            );
        }
    };


    contactClick = () => {
        if (this.props.type !== undefined && this.props.type == "personalkinfo" && this.state.allContactDetails?.mobiles?.length == 0) {
            this.InvokeEditContactID("", "")

        } else {
            this.InvokeEditContactID("", "")
        }
    }

    toasterAlert(test) {
        this.context.setdata({
            open: true,
            text: test,
            type: "Warning"
        })
    }
    handlePrimaryEmailUpdate = () => {
        this.setState({
            mailForUpdate: '',
            isEmailActive: false,
            isUpdatePrimaryEmail: false,
        })
    }

    render() {
        konsole.log("contactcontact", this.state.allContactDetails)

        {
            if (this.state.allContactDetails?.mobiles?.length == (0 || undefined || null)) {
                this.state.allContactDetails?.mobiles?.length == (0 || undefined || null) ? this.state.primaryContactIdValidation = 1 : ""
            }

        }

        {
            this.state.allContactDetails &&
                this.state.allContactDetails.mobiles &&
                this.state.allContactDetails.mobiles.map((valuee, id) => {
                    konsole.log("edddddddddddddd", this.state.allContactDetails?.mobiles?.length, valuee.contactTypeId, this.state.primaryContactIdValidation);

                    if (this.state.allContactDetails?.mobiles?.length > 0 && valuee.contactTypeId == 1) {
                        this.state.primaryContactIdValidation = ""
                    } else if ((this.state.allContactDetails?.mobiles?.length > 0 && valuee.contactTypeId == 1) || (this.state.allContactDetails?.mobiles?.length > 0 && valuee.contactTypeId == 2) || (this.state.allContactDetails?.mobiles?.length > 0 && valuee.contactTypeId == 3) || (this.state.allContactDetails?.mobiles?.length > 0 && valuee.contactTypeId == 4) || (this.state.allContactDetails?.mobiles?.length > 0 && valuee.contactTypeId == 5) || (this.state.allContactDetails?.mobiles?.length > 0 && valuee.contactTypeId == 999999)) {

                        // alert("hi")
                        // else if (this.state.allContactDetails?.mobiles?.length > 0 && valuee.contactTypeId == (1 || 2 || 3 || 4 || 5 || 999999)) {

                        this.state.primaryContactIdValidation = ""
                    }
                    else if (this.state.allContactDetails?.mobiles?.length > 0 && valuee.contactTypeId != 1 && valuee.contactTypeId == (2 || 3 || 4 || 5 || 999999)) {
                        this.state.primaryContactIdValidation = 1
                    }

                })
        }

        {
            if (this.state.allContactDetails?.emails?.length == (0 || undefined || null)) {
                this.state.allContactDetails?.emails?.length == (0 || undefined || null) ? this.state.primaryEmailIdValidation = 1 : ""
            }
        }
        {
            this.state.allContactDetails &&
                this.state.allContactDetails.emails &&
                this.state.allContactDetails.emails.map((valuee, id) => {
                    konsole.log("uuudddnnbbb", this.state.allContactDetails?.emails?.length);
                    konsole.log("valuee.contactTypeId", this.state.allContactDetails?.emails?.length, valuee.contactTypeId)

                    if (this.state.allContactDetails?.emails?.length > 0 && valuee.contactTypeId == 1) {
                        this.state.primaryEmailIdValidation = ""
                    } else if ((this.state.allContactDetails?.emails?.length > 0 && valuee.contactTypeId == 1) || (this.state.allContactDetails?.emails?.length > 0 && valuee.contactTypeId == 2) || (this.state.allContactDetails?.emails?.length > 0 && valuee.contactTypeId == 3) || (this.state.allContactDetails?.emails?.length > 0 && valuee.contactTypeId == 4) || (this.state.allContactDetails?.emails?.length > 0 && valuee.contactTypeId == 5) || (this.state.allContactDetails?.emails?.length > 0 && valuee.contactTypeId == 999999)) {
                        this.state.primaryEmailIdValidation = ""
                    }
                    else if (this.state.allContactDetails?.emails?.length > 0 && valuee.contactTypeId != 1 && valuee.contactTypeId == (2 || 3 || 4 || 5 || 999999)) {
                        this.state.primaryEmailIdValidation = 1
                    }

                })
        }





        konsole.log("opopopopopopopo", this.state.allContactDetails?.emails?.length, this.state.primaryEmailIdValidation)


        return (
            <>

                <EmailUpdate
                    key={this.state.isUpdatePrimaryEmail}
                    mailForUpdate={this.state.mailForUpdate}
                    show={this.state.isUpdatePrimaryEmail}
                    onHide={this.handlePrimaryEmailUpdate}
                    fetchSavedContactDetails={this.fetchSavedContactDetails}
                    userId={this.props.userId}
                    isEmailActive={this.state.isEmailActive}
                />


                <Row className="m-0 mb-4">
                    <Col xs md="6" className="d-flex  align-items-center p-0" >
                        {/* <button
                  className="white-btn"
                  onClick={() => this.InvokeEditContactID("", "")}
                >   
                  Contact
                </button> */}
                        <button
                            className="white-btn"
                            // onClick={() => {
                            //     this.state.allContactDetails?.mobiles?.length == 0 && this.InvokeEditContactID("", "")
                            // }
                            // }
                            disabled={(this.state.allContactDetails?.mobiles?.length > 0 || this.state.allContactDetails.emails?.length > 0) ? true : false}
                            onClick={this.contactClick}

                        >
                            {/* Contact Information{(this.props?.editType == 'Non Family Member') ? '*' : ""} */}
                            {this.props.title ? this.props.title : 'Contact Information'}
                        </button>
                        {
                            (this.state.allContactDetails?.mobiles?.length > 0 || this.state.allContactDetails.emails?.length > 0) &&
                            <img onClick={() => this.InvokeEditContactID("", "")}
                                className="ms-3 cursor-pointer mb-1"
                                src="/icons/add-icon.svg"
                                alt="Add Contact"
                            />
                        }



                        {this.state.showContact ? (
                            <Contact
                                fetchprntSavedContactDetails={this.fetchSavedContactDetails}
                                userId={this.props.userId}
                                handleshowContact={this.handleshowContact}
                                showContact={this.state.showContact}
                                allContactDetails={this.state.allContactDetails}
                                EditContactId={this.state.EditContactId}
                                EditContactType={this.state.EditContactType}
                                primaryContactIdValidation={this.state.primaryContactIdValidation}
                                primaryEmailIdValidation={this.state.primaryEmailIdValidation}
                                title={this.props.title}
                            />
                        ) : (
                            ""
                        )}
                    </Col>
                </Row>
                <Row className="m-0 p-0 gap-3 mb-3 ">
                    {this.state.allContactDetails &&
                        this.state.allContactDetails.mobiles &&
                        this.state.allContactDetails.mobiles.map((val, id) => {

                            // konsole.log("valueeeeekkkkkkkk", val.contactType, );
                            return (
                                <>
                                    <Col xs="12" md="8" lg="7" className="m-0 p-0 text-truncate-personal">
                                        {/* <InputGroup className="mb-2 rounded" style={{ height: "3.5rem" }}  > */}
                                        <InputGroup className="rounded">
                                            <InputGroup.Text className="bg-secondary" onClick={() => this.InvokeEditContactID(val, "mobile")}>
                                                <img src="icons/mob-icon.svg" alt="" className='cursor-pointer othericonsizeinContact' />
                                            </InputGroup.Text>
                                            <div className="form-control" style={{ overflow: 'hidden' }}  >
                                                <p style={{ fontSize: "10px" }} className='mb-2'>{val.contactType} {val.commType ? "-" : ""} {val.commType}</p>
                                                <p className="" key={val.id}>
                                                    {$AHelper.newPhoneNumberFormat(val?.mobileNo)}{" "}
                                                    {/* {$AHelper.formatPhoneNumber(($AHelper.pincodeFormatInContact(val?.mobileNo).slice(0, 4) == +254)?val?.mobileNo:val?.mobileNo?.slice(-10), $AHelper.pincodeFormatInContact(val?.mobileNo))} */}
                                                    {/* {$AHelper.formatPhoneNumber(val?.mobileNo)}
                                                    {console.log("dsdsd",$AHelper.pincodeFormatInContact(val?.mobileNo),$AHelper.formatPhoneNumber(($AHelper.pincodeFormatInContact(val?.mobileNo).slice(0, 4) == +254)?val?.mobileNo:val?.mobileNo?.slice(-10)))} */}
                                                
                                                </p>
                                            </div>
                                            {val.contactTypeId !== 1 && (
                                                <InputGroup.Text className="bg-secondary" onClick={() => this.handleDeleteContact(this.props.userId, val)}>
                                                    <img className='cursor-pointer binSize' src="icons/BinIcon.svg" alt="Add Address" />{" "}
                                                </InputGroup.Text>
                                            )}
                                        </InputGroup>
                                    </Col>

                                    {(val.contactTypeId == 1 && lpoIntakeRoleId.includes(Number(this.state.loggedInRoleId)) && (this.state.userId == this.state.primaryUserId)) &&
                                        <>
                                            <NotificationPermission setLoader={this.props.dispatchloader} />
                                        </>
                                    }
                                </>
                            );
                        })}
                    {this.state.allContactDetails &&
                        this.state.allContactDetails.emails &&
                        this.state.allContactDetails.emails.map((val, id) => {
                            // konsole.log("abababababab", val)
                            return (
                                <Col

                                    xs="12" md="8" lg="7" className="m-0 p-0 text-truncate"
                                    key={id}
                                >
                                    <InputGroup className="mb-2 rounded " style={{}}>
                                        <InputGroup.Text
                                            className="bg-secondary"
                                            onClick={() => this.InvokeEditContactID(val, "email")}
                                        >
                                            <img src="icons/mob-icon.svg" alt="" className='cursor-pointer othericonsizeinContact' />
                                        </InputGroup.Text>
                                        <div className="form-control" style={{ overflow: 'hidden' }}>
                                            <p style={{ fontSize: "10px" }} className='mb-2'>{val.contactType} - Email</p>
                                            <p className="text-truncate w-100" key={val.id}>
                                                {val.emailId}{" "}
                                            </p>
                                        </div>
                                        {val.contactTypeId !== 1 && (

                                            <InputGroup.Text
                                                className="bg-secondary"
                                                onClick={() =>
                                                    this.handleDeleteContact(
                                                        this.props.userId,
                                                        val
                                                    )
                                                }
                                            // style={{zIndex:"1000"}}
                                            >
                                                <img
                                                    src="icons/BinIcon.svg"
                                                    alt="Add Address"
                                                    className='cursor-pointer binSize'
                                                />{" "}
                                            </InputGroup.Text>
                                        )}
                                    </InputGroup>
                                </Col>
                            );
                        })}
                </Row>
            </>
        )
    }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
    dispatchAuthId: (authId) =>
        dispatch({ type: GET_Auth_TOKEN, payload: authId }),
});

// export default connect(mapStateToProps, mapDispatchToProps)(ContactListComponent);
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(ContactListComponent);