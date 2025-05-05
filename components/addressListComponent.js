import React, { Component, useContext } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, InputGroup, } from "react-bootstrap";
import Address from "../components/address";
import { $getServiceFn, $postServiceFn, $CommonServiceFn, } from "../components/network/Service";
import konsole from "../components/control/Konsole";
import { $AHelper } from "../components/control/AHelper";
import { connect } from 'react-redux';
import { GET_USER_DETAILS, SET_LOADER } from './Store/Actions/action';
import { $Service_Url } from './network/UrlPath';
import { Msg } from './control/Msg';
import { globalContext } from "../pages/_app";
import { Portal } from "../components/Portal";
import AlertToaster from './control/AlertToaster';
import { isNotValidNullUndefile, getApiCall } from './Reusable/ReusableCom';



class AddressListComponent extends Component {
    static contextType = globalContext;
    constructor(props) {
        super(props)
        this.state = {
            userId: "",
            loggedInUser: "",
            allAddress: [],
            showAddress: false,
            loginUserDetail: {},
            primaryUserId: "",
            AddAddress: [],
            maritalStatusId: "",
            allAddressPrimary: [],
            spouseUserId: "",
            userAddressId: 0,
            addressId: "",
            is_checked: false,
            is_checked_spouse: false,
            spouseAddreessCompleteData: {}
        }
    }


    componentDidMount() {
        let maritalStatusId = sessionStorage.getItem("maritalStatusId");
        let loggedInUser = sessionStorage.getItem("loggedUserId") || "";
        let primaryUserId = sessionStorage.getItem("SessPrimaryUserId") || "";
        let spouseUserId = sessionStorage.getItem("spouseUserId") || "";
        let loginUserDetail = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));

        // konsole.log("propsdata",this.props.innerSpouseUserId);
        const innerSpouseUserIds = this?.props?.innerSpouseUserId;
        if (isNotValidNullUndefile(innerSpouseUserIds)) {
            this.fetchSpouseAddress(innerSpouseUserIds)
        }
        // konsole.log("innerSpouseUserIdsinnerSpouseUserIds",innerSpouseUserIds)
        this.setState({
            maritalStatusId: maritalStatusId,
            userId: this.props.userId,
            loggedInUser: loggedInUser,
            loginUserDetail: loginUserDetail,
            spouseUserId: spouseUserId,
            primaryUserId: this.props.relativeUserId ?? primaryUserId,
            confirm: this.context.confirmyes
        }, () => {
            konsole.log("relativeUserId porps", this.props?.relativeUserId, this.state.primaryUserId)
            this.fetchSavedAddress(this.props.userId);
            if ((this.state?.primaryUserId != this.props?.userId) && ((this.props.editType !== "Extended Family / Friends" && this.props?.relativeUserId) || this.props.editType !== "Extended Family / Friends")) {
                this.fetchSavedAddress(this.state?.primaryUserId)
            }
        });
    }

    componentDidUpdate() {
        if (this.context.confirmyes != this.context.confirmyes) {
            this.setState({
                confirm: this.context.confirmyes
            })
        }

    }

    InvokeEditAddress = (val) => {
        // alert("sddsfdsfsd")
        konsole.log("valaaa", val);
        this.setState({
            EditAddress: val,
        });
        this.handleshowAddress();
    };

    fetchSpouseAddress = async (innerSpouseUserId) => {

        if (!isNotValidNullUndefile(innerSpouseUserId)) return;
        this.props.dispatchloader(true);
        const result = await getApiCall('GET', $Service_Url.getAllAddress + innerSpouseUserId)
        // konsole.log('res of  fetching in-law address')
        if (result == 'err') return;
        const spouseCompleteAddressesData = result?.addresses
        // konsole.log('spouseCompleteAddressesData',spouseCompleteAddressesData)
        if (spouseCompleteAddressesData.length > 0) {
            const getSpousePhysicalAddress = spouseCompleteAddressesData?.find((data) => data.addressTypeId === 1);
            // konsole.log('getSpousePhysicalAddress',getSpousePhysicalAddress)
            if (Object.values(getSpousePhysicalAddress).length > 0) {
                this.setState({ spouseAddreessCompleteData: getSpousePhysicalAddress });
            }
        }
    };



    fetchSavedAddress = (userid) => {
        if (!userid) return;

        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi(
            "GET",
            $Service_Url.getAllAddress + userid,
            "",
            (response) => {
                this.props.dispatchloader(false);
                if (response) {
                    konsole.log("useriduserid", userid, this.state.primaryUserId, response)
                    if (userid === this.state.primaryUserId) {
                        konsole.log("showAddress userdiIF", (userid === this.state.primaryUserId));
                        if (this.props?.editType == "personal") {
                            this.setState({
                                allAddress: response.data.data.addresses,
                            })
                            konsole.log("this.state.allAddress", this.state.allAddress)
                            this.props.setAllAddress(response.data.data.addresses)
                        }
                        else {
                            const address = response.data.data.addresses.filter((item) => parseInt(item.addressTypeId) === 1)
                            this.setState({
                                allAddressPrimary: address,
                                // addressId : address[0].addressId,
                                // userAddressId : address[0].userAddressId  
                            });
                            if (this.props?.spouseComAddress) {
                                this.props?.spouseComAddress(address)
                            }
                        }
                    }
                    else {
                        konsole.log("showAddressUserdi", response, (userid === this.state.primaryUserId), this.props.editType, userid);
                        konsole.log("addressDetails={this.addressDetails}", this.props?.addressDetails)
                        if (this.props?.addressDetails !== undefined) {
                            this.props?.addressDetails(response.data.data.addresses)
                        }
                        const filterAddress = response.data.data.addresses.filter((item) => parseInt(item.addressTypeId) === 1)
                        konsole.log("addressesaddresses", response, filterAddress, (filterAddress.length !== 0 && filterAddress[0].sameAsUserId !== null))
                        this.setState({
                            is_checked: (filterAddress.length !== 0 && filterAddress.some(item => { return item.sameAsUserId !== null && item.addressTypeId == 1 })) ? true : false,
                            is_checked_spouse: (filterAddress.length !== 0 && filterAddress.some(item => { return item.sameAsUserId !== null && item.addressTypeId == 1 })) ? true : false,
                            allAddress: response.data.data.addresses,
                        })
                    }

                }
            }
        );
    };



    handleMemberAddress = (userID) => {
        this.props.dispatchloader(true);
        const addressPrimary = this.state.allAddressPrimary[0]?.addressId
        // konsole.log("primarySpouseUserId",this.state.spouseUserId,addressPrimary,this.state.primaryUserId,true,this.state.loggedInUser)
        $postServiceFn.memberAddress(userID, addressPrimary, this.state.primaryUserId, true, this.state.loggedInUser, (response) => {
            this.props.dispatchloader(false);
            if (response) {
                this.fetchSavedAddress(userID)
                konsole.log("postMemberAddress", response)
            }
        });
    };

    updateAddress = (userID) => {
        const addressPhysical = this.state.allAddress.filter(item => { return item.sameAsUserId !== null && item.addressTypeId == 1 });
        const isActive = false
        const isDeleted = true
        // konsole.log("showaddressmapping", addressPhysical,userID)
        // konsole.log("primarySpouseUserId",userID,addressPhysical.addressId,this.state.primaryUserId,false,addressPhysical.userAddressId,true,this.state.loggedInUser)
        if (addressPhysical.length > 0 && addressPhysical[0].sameAsUserId == this.state.primaryUserId) {
            this.props.dispatchloader(true);
            $postServiceFn.putMemberAddress(userID, addressPhysical[0]?.addressId, this.state.primaryUserId, isActive, addressPhysical[0]?.userAddressId, isDeleted, this.state.loggedInUser, (response) => {
                this.props.dispatchloader(false);
                if (response) {
                    this.fetchSavedAddress(this.state.userId)
                    this.setState({
                        is_checked: false,
                        is_checked_spouse: false
                    })
                    konsole.log("postMemberAddress", response)
                } else {
                    this.props.dispatchloader(false);
                }
            });

            const spouseAddreessCompleteDatas = this.state.spouseAddreessCompleteData;
            // konsole.log("spouseAddreessCompleteData",this.state.spouseAddreessCompleteData, Object.keys(spouseAddreessCompleteDatas).length, spouseAddreessCompleteDatas.sameAsUserId, userID )  
            if (
                this.props.editType == 'Child' &&
                Object.keys(spouseAddreessCompleteDatas)?.length > 0 &&
                spouseAddreessCompleteDatas.sameAsUserId == userID
            ) {
                const innerSpouseUserIds = this?.props?.innerSpouseUserId;
                const addressPhysical = spouseAddreessCompleteDatas
                $postServiceFn.putMemberAddress(innerSpouseUserIds, addressPhysical.addressId, this.state.primaryUserId, isActive, addressPhysical.userAddressId, isDeleted, this.state.loggedInUser, (response) => {
                    this.props.dispatchloader(true);
                    if (response) {
                        this.props.dispatchloader(false);
                        konsole.log("postMemberAddress", response)
                    } else {
                        this.props.dispatchloader(false);
                    }
                });

            }

        }

    }

    handleshowAddress = () => {
        konsole.log("module call");
        this.setState({
            showAddress: !this.state.showAddress,
        });
    };



    handleDeleteAddress = async (userid, addressid) => {
        let confirm = await this.context.confirm(true, "Are you sure? You want to delete your address.", "Confirmation")
        if (confirm) {
            this.props.dispatchloader(true);
            $CommonServiceFn.InvokeCommonApi(
                "DELETE",
                $Service_Url.deleteAddress +
                userid +
                "/" +
                addressid +
                "/" +
                this.state.loggedInUser,
                "",
                (response) => {
                    this.props.dispatchloader(false);
                    konsole.log("delete", response)
                    if (response) {
                        AlertToaster.success("Address deleted successfully");
                        this.fetchSavedAddress(userid);
                    } else {
                        // alert(Msg.ErrorMsg);
                        this.toasterAlert(Msg.ErrorMsg, "Warning")
                    }
                }
            );
        }
    };


    handleCheckBox = (e) => {
        const checkedValue = e?.target?.checked ?? e;
        konsole.log("e.atar", checkedValue, e)
        if (this.state.userId !== "") {
            if (checkedValue == true) {
                const address = [];
                address.unshift(this.state.allAddressPrimary[0]);
                konsole.log("address unshift", address);
                this.setState({
                    is_checked: true,
                })
                this.handleMemberAddress(this.state.userId)
            }
            else {
                let allAddressPrimary = this.state.allAddressPrimary.filter((item) => parseInt(item.addressTypeId) == 1)
                let address = this.state.allAddress.filter((item) => (parseInt(item.addressTypeId) !== 1))
                this.setState({
                    is_checked: false,
                })
                this.updateAddress(this.state.userId)
            }
        }
        else {
            if (this.props.sameAddressForChildFunc) {
                this.props.sameAddressForChildFunc(true)
            }
        }
    }


    handleRadioSelection = (e) => {


        // const checkedValue = e?.target?.checked ?? e;
        // const checkedTargetValue = e?.target?.value ?? e;

        const checkedValue = e.target.checked ?? e;
        const checkedTargetValue = e.target.value ?? e;

        konsole.log("e.atar", this.state.userId, checkedTargetValue, this.state.allAddress?.addressTypeId)

        if (isNotValidNullUndefile(this.state.userId)) {
            if (checkedTargetValue == "Yes") {
                let filterAddressType = this.state.allAddress.filter(item => item.addressTypeId == 1);

                console.log("filterAddressType", this.state.allAddressPrimary, this.state.allAddress, filterAddressType)
                if (this.state.allAddressPrimary.length == 0) {
                    return;
                }
                // return;
                if (filterAddressType[0]?.addressTypeId == 1) {
                    // AlertToaster.warn("You already have a physical address")
                    this.toasterAlert("You already have a physical address please delete your current physical address first then make your selection.", "Warning")
                } else {
                    const address = [];
                    address.unshift(this.state.allAddressPrimary[0]);
                    konsole.log("address unshift", address);
                    this.setState({
                        is_checked: true,
                    })
                    this.handleMemberAddress(this.state.userId)
                }
            }
            if (checkedTargetValue == "No") {
                this.setState({
                    is_checked: false,
                })
                this.updateAddress(this.state.userId);
                konsole.log("allPhysiclaAddersss", this.state.allAddress)
            }
        }
        else {
            if (checkedTargetValue == "Yes") {
                if (this.props.sameAddressForChildFunc) {
                    this.props.sameAddressForChildFunc(true)
                }
            }
            if (checkedTargetValue == "No") {
                if (this.props.sameAddressForChildFunc) {
                    this.props.sameAddressForChildFunc(false)
                }
            }
        }
    }

    setUserId = (userId) => {
        if (userId) {
            this.setState({
                userId: userId,
            }, () => {
                this.handleshowAddress();
            })
        }
    }
    setUserIdOnly = (userId) => {
        if (userId) {
            this.setState({
                userId: userId,
            })
        }
    }

    setUserIdForsameAddress = (userId, chekecBoxValue) => {
        if (userId) {
            this.setState({
                userId: userId,
            }, () => {
                this.handleCheckBox(chekecBoxValue);
            })
        }
    }


    toasterAlert = (text, type) => {
        this.context.confirm(true, text, type)
    }

    mandatory = (str) => {
        if (this.props.editType !== "Child") {
            return `${str}*`
        } else {
            return `${str}`
        }
    }

    reArrangeAddress = (addressLine1, addressSuite = "") => {
        const addressArray = addressLine1.split(",");
        addressArray.splice(1, 0, ` ${addressSuite}`);
        konsole.log(addressArray);
        return addressArray.join(",");
        konsole.log(formattedAddress);
    }



    editAddressfun = (val) => {
        if (isNotValidNullUndefile(val.sameAsUserId) && this.state.is_checked_spouse == true && val.addressTypeId == 1) {
            this.toasterAlert("This address can not be changed from here as this is the primary member`s physical address. Please update this from there.", "Warning")
        } else {
            this.InvokeEditAddress(val)
        }
    }

    deleteAddressfun = (val) => {
        if (isNotValidNullUndefile(val.sameAsUserId) && this.state.is_checked_spouse == true && val.addressTypeId == 1) {
            ""
        } else {
            this.handleDeleteAddress(this.state.userId, val.addressId)
        }
    }


    render() {
        konsole.log("is_checked_spouse", this.state.is_checked_spouse)
        konsole.log('propseditType', this.props.editType)
        konsole.log("thispropsthisprops", this.state.userId)
        konsole.log("this.state.addressId", this.state.addressId, this.props?.editType)
        konsole.log("isdishdis", this.props?.editType, this.state.allAddressPrimary, this.state.userAddressId, this.state.addressId, this.state.allAddress)
        konsole.log("addressadesaa", this.state.AddAddress, this.state.allAddress)
        konsole.log("ppsadasdas dasdp2", this.state);

        const radioText = (this.props.editType == "Spouse") ? (this.props.maritalStatusId == 2 ? "Partner" : "Spouse") : "Child"


        const userID = this.props.userId;
        const primaryUserId = this.state.primaryUserId;
        const spouseUserId = this.state.spouseUserId;
        const ageValidation = this.props.ageValidation ?? 1;
        let showCheckBoxForAddresss = false;


        if (this.props.editType !== undefined && this.props.editType !== 'Extended Family / Friends') {
            if (((userID !== primaryUserId))) {
                if (((userID !== spouseUserId) &&
                    // (ageValidation < 18) &&
                    (this.props.editType == 'Child' || this.props.editType == 'In-Law'))) {
                    showCheckBoxForAddresss = true
                    // konsole.log("agevalidation in user", this.props, showCheckBoxForAddresss, userID, spouseUserId);
                }
                else if (((userID == spouseUserId))) {
                    showCheckBoxForAddresss = true
                }
            }
            else {
                showCheckBoxForAddresss = false
            }
        }
        else {
            // do something else here
        }
        // if((this.props.editType == "Child" && this.state.is_checked)){
        //     if(((this.props.dob !== undefined && this.props.dob !== null && this.props.dob !== "") && ((this.props.validationUnder14.years < 14) || (this.props.validationUnder14.years == 14 && this.props.validationUnder14.days == 0))) || (this.props.validationUnder14.years == 14 && this.props.validationUnder14.months > 0)){
        //     this.updateAddress(this.state.userId)
        //     this.state.is_checked = false
        //     konsole.log("calllAPIIII")
        //     }
        //      }

        konsole.log("editTypeeditType", this.props.editType)
        konsole.log("agevalidation in user", this.state, this.props, showCheckBoxForAddresss, userID, spouseUserId);
        konsole.log("propspropsprops", this.state.userId)
        konsole.log("this.state.allAddress", this.state.allAddress, this.props?.editType)
        konsole.log("conditionTOMApAddress", (this.props.userId == this.state.primaryUserId), this.state.allAddress)

        let disabledtrue = (this.state.AddAddress.length > 0 || this.state.allAddress.length > 0) ? true : false


        return (
            <>
                {
                    showCheckBoxForAddresss == true &&
                    <Row className='m-0 mb-3'>

                        {((isNotValidNullUndefile(this.props.dob)) && ((this.props.validationUnder14.years > 14 || (this.props.validationUnder14.years >= 14 && this.props.validationUnder14.days > 0))) || (this.props.editType !== "Child")) ? <Col xs='12' className='d-flex p-0 flex-column'>
                            <label className='me-3'>{this.props.editType === "In-Law" ? `Does this ${this.props.childMaritalStatusId == 2 ? "Partner" : "Spouse"}  live with your Child?` : (radioText == 'Spouse' || radioText == 'Partner') ? `Does your ${radioText} live with ${$AHelper.capitalizeAllLetters(this.state.loginUserDetail?.memberName)}?` : `Does your ${radioText} live with you?`}</label>
                            <div className='d-flex'>
                                <Form.Check
                                    className="chekspace"
                                    type="radio"
                                    value='Yes'
                                    checked={this.state.is_checked == true}
                                    onChange={(e) => this.handleRadioSelection(e)}
                                    name="livein"
                                    label='Yes'
                                />
                                <Form.Check
                                    className="chekspace"
                                    type="radio"
                                    value='No'
                                    checked={this.state.is_checked == false}
                                    onChange={(e) => this.handleRadioSelection(e)}
                                    name="livein"
                                    label='No'
                                />
                            </div>
                        </Col>
                            : ""}
                    </Row>

                }
                <Row className="m-0 mb-4">
                    <Col xs md="5" className="d-flex align-items-center ps-0">
                        {/* {(this.props.typecomponentcall == false && this.props.typecomponent=="child")?
                           <button    className="white-btn"    onClick={this.props.efssddata}>
                             {$AHelper.mandatory("Address")}
                               </button>:
                                 <button  className="white-btn" onClick={this.props.efssddata} onClick={this.InvokeEditAddress}>
                                  {$AHelper.mandatory("Address")} </button>  } */}

                        <button className="white-btn" disabled={disabledtrue} onClick={() => { (this.state.userId) ? this.InvokeEditAddress() : this.props.invokepostmember("address") }} ref={this.props.ref} >
                            {(this.props.editType !== 'Grand-Child' && this.props.editType !== 'In-Law' && this.props.editType !== 'liabilities' && this.props.editType !== 'EstateLenders' && this.props.editType !== 'Extended Family / Friends' && this.props.editType !== 'Fiduciary/Beneficiary') ? this.mandatory("Address") : 'Address'}
                        </button>
                        {
                            this.state.allAddress.length > 0 &&
                            <img onClick={() => this.InvokeEditAddress("")}
                                className="ms-3 cursor-pointer mb-1"
                                src="/icons/add-icon.svg"
                                alt="Add Address"
                            />
                        }

                        {this.state.showAddress ? (
                            <Address
                                fetchSavedAddress={this.fetchSavedAddress}
                                userid={this.state.userId}
                                showAddress={this.state.showAddress}
                                handleshowAddress={this.handleshowAddress}
                                savedAddress={this.state.allAddress}
                                EditAddress={this.state.EditAddress}
                            />
                        ) : (
                            ""
                        )}
                    </Col>
                    {/* {(showCheckBoxForAddresss == true) &&
                        <Col>
                            <Form.Check
                                className="chekspace"
                                type="checkbox"
                                checked={this.state.is_checked}
                                onChange={this.handleCheckBox}
                                name="livein"
                                label={`Same as ${this.state.loginUserDetail.memberName} address`}
                            />
                        </Col>
                    } */}
                </Row>
                <Row className="m-0 p-0 mb-4 gap-3">
                    <>
                        {this.state.allAddress.map((val, id) => {
                            konsole.log("eeeeeeeeeee", val)
                            konsole.log("eeeeeeeebbbb", val.sameAsUserId)
                            konsole.log("address show in html ", val);

                            const addlressLabel1 = (
                                (isNotValidNullUndefile(val?.addressLine1) ? val.addressLine1 + ', ' : '') +
                                (isNotValidNullUndefile(val?.city) ? val.city + ', ' : '') +
                                (isNotValidNullUndefile(val?.state) ? val.state + ', ' : '') +
                                (isNotValidNullUndefile(val?.zipcode) ? val.zipcode  : '') +
                                (isNotValidNullUndefile(val?.county) ? ","+ val.county : '')
                            );

                            return (
                                <>
                                    {/* {((val.sameAsUserId !=='' && val.sameAsUserId !==null && val.sameAsUserId !==undefined) ==true) ?
                                    <></> :  */}
                                    <Col md="8" lg="6" className="m-0 p-0" key={id}>
                                        <InputGroup className=" rounded" style={{ height: "3.5rem" }}>
                                            <InputGroup.Text
                                                className="bg-secondary"
                                                onClick={() => this.editAddressfun(val)}
                                            // onClick={() => val.sameAsUserId !== null ?  this.toasterAlert("This address can not be changed from here as this is the primary member`s physical address. Please update this from there.", "Warning") : this.InvokeEditAddress(val)}
                                            >
                                                <img src="/icons/travel-bag.svg" alt="" className='cursor-pointer' />
                                            </InputGroup.Text>
                                            <div className="form-control" style={{ overflow: 'hidden', height: "100%" }}>
                                                {" "}
                                                {((val.addressTypeId == 1 || val.addressTypeId == 3) && isNotValidNullUndefile(val.addressLine2)) ? val.addressLine2 + "," : ""}
                                                {addlressLabel1}

                                                {/* : val.addressLine1}   */}
                                            </div>

                                            {/* {val.addressTypeId == 1  && this.state.primaryUserId == this.state.userId ?
                                        "":<> <InputGroup.Text
                                                className="bg-secondary"
                                                onClick={() => val.sameAsUserId !== null ? "" :
                                                    this.handleDeleteAddress(
                                                        this.state.userId,
                                                        val.addressId
                                                    )
                                                }
                                            > <img
                                                    className='cursor-pointer'
                                                    src="icons/BinIcon.svg"
                                                    alt="Add Address"
                                                />{" "}
                                            </InputGroup.Text> 
                                        </>
                                          } */}
                                            {((this.props.userId == this.state.primaryUserId && val.addressTypeId == 1) || (val.addressTypeId == 1 && this.state.is_checked_spouse == true && val.sameAsUserId !== null)) ?
                                                "" : <>
                                                    <InputGroup.Text className="bg-secondary" onClick={() => this.deleteAddressfun(val)}>
                                                        <img className='cursor-pointer' src="/icons/BinIcon.svg" alt="Add Address" />{" "}
                                                    </InputGroup.Text>
                                                </>
                                            }
                                        </InputGroup>
                                    </Col>
                                    {/* } */}
                                </>
                            );
                        })}
                    </>
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

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(AddressListComponent);
