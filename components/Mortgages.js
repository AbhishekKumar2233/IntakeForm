import React, { Component } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from "react-datepicker";

import { connect } from 'react-redux';

import { SET_LOADER } from '../components/Store/Actions/action'
import { $Service_Url } from "../components/network/UrlPath";
import { $CommonServiceFn } from '../components/network/Service';
import { $AHelper } from './control/AHelper';
import CurrencyInput from 'react-currency-input-field';
import { Msg } from './control/Msg';
import konsole from './control/Konsole';
import moment from 'moment';
import Other from './asssets/Other';
import {globalContext} from "../pages/_app";
import DatepickerComponent from './DatepickerComponent';

export class Mortgages extends Component {
    static contextType = globalContext
    constructor(props, context) {
        super(props, context);
        this.state = {
            show: false,
            userId: "",
            loggedUserId:'',
            LiabilityTypes: [],
            UserLiabilities: [],
            natureId: "",
            liabilityTypeId: 0,
            liabilityId: 0,
            userRealPropertyId: 0,
            description: "",
            nameofInstitutionOrLender: "",
            debtAmount: "",
            outstandingBalance: "",
            payOffDate: "",
            interestRateTypeId: 0,
            interestRatePercent: 0,
            extraPaymentMode: "string",
            paymentFrequencyId: 0,
            paymentAmount: "",
            update:false,
        };
        this.liabilityRef = React.createRef();
    }

    handleClose = () => {
        this.setState({
            show: !this.state.show
        })
    }

    handleShow = () => {
        this.setState({
            show: !this.state.show
        })
    }

    componentDidMount() {
        let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
        let loggedUserId = sessionStorage.getItem("loggedUserId") || "";
        this.setState({
            userId: newuserid,
            loggedUserId:loggedUserId
        })
        this.fetchliabilitytypes();
        this.fetchliabilityUsertypes(newuserid);
    }

    fetchliabilitytypes = () => {
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getLiabilityTypes,
            "", (response) => {

                this.props.dispatchloader(false);
                if (response) {
                    this.setState({
                        ...this.state,
                        LiabilityTypes: response.data.data,
                    });
                }
            })
    }

    fetchliabilityUsertypes = (userid) => {
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getLiabilityUserTypes + userid + "/0",
            "", (response) => {
                // konsole.log(JSON.stringify(response));
                this.props.dispatchloader(false);
                if (response) {
                    this.setState({
                        ...this.state,
                        UserLiabilities: response.data.data.liability,
                    });
                }
            })
    }

    handleLiableSubmit = () => {
        let inputdata = JSON.parse(JSON.stringify(this.state));
        let PayOffDate=null
        if(this.state.payOffDate !=='' && this.state.payOffDate !== null && this.state.payOffDate !== undefined ){
            PayOffDate=$AHelper.getFormattedDate(this.state.payOffDate)
        }

        let liableinput = {
            "liabilityTypeId": this.state.liabilityTypeId,
            "userLiabilityId": this.state.natureId,
            "userRealPropertyId": this.state.userRealPropertyId,
            "description": this.state.description,
            "nameofInstitutionOrLender": this.state.nameofInstitutionOrLender,
            "debtAmount": this.state.debtAmount,
            "outstandingBalance": this.state.outstandingBalance,
            // "payOffDate": PayOffDate,
            "interestRateTypeId": 0,
            "interestRatePercent": 0,
            "extraPaymentMode": "string",
            "paymentFrequencyId": 0,
            "paymentAmount": this.state.paymentAmount,
            "liabilityDocs":null,
        }
        if(this.state.payOffDate !== null){
            liableinput["payOffDate"] = PayOffDate
        }
        if(this.state.update == true){
            liableinput["updatedBy"] = this.state.loggedUserId
        }
        else{
            liableinput["createdBy"] = this.state.loggedUserId

        }
        let totalinput = {
            userId: this.state.userId,
            liability: liableinput
        }
        

      
        konsole.log("Sumit",JSON.stringify(totalinput));
        if(this.validate()){
            this.props.dispatchloader(true);
            var apiurl=$Service_Url.postAddLiability
            var method="POST"
            if(this.state.update==true){
                apiurl=$Service_Url.putAddLiability
                method="PUT"

            }
            konsole.log("apiurl",apiurl,method)
            $CommonServiceFn.InvokeCommonApi(method, apiurl, // + "?userId=" + this.state.userId
                totalinput, (response) => {
                    this.props.dispatchloader(false);
                
                    konsole.log("Success res" + JSON.stringify(response));
                    if (response) {
                        konsole.log("kkk",response.data.data)
                        let liabilityResponse = response.data.data.liability[0].userLiabilityId;
                        // alert("Liability Saved Successfully",response)  ;
                        this.toasterAlert("Liability Saved Successfully" ,"Success")
                        
                        if(this.state.liabilityTypeId == "999999"){
                            this.liabilityRef.current.saveHandleOther(liabilityResponse);
                        }
                        this.props.handleLiablitypopShow();
                        this.fetchliabilityUsertypes(this.state.userId)
                    } else {
                        // alert(Msg.ErrorMsg);
                        this.toasterAlert(Msg.ErrorMsg,"Warning")
                    }
                })  
        }
      konsole.log("Validate", this.state.UserLiabilities)
    }


    validate = () => {
        let nameError = ""
        // if (this.state.outstandingBalance == "") {
        //     nameError = "outstanding balance cannot be blank"
        // }
        // if (this.state.payOffDate == "") {
        //     nameError = "Please enter the payoff date"
        // }
        // if (this.state.paymentAmount == 0) {
        //     nameError = "payment amount cannot be Blank"
        // }
        // if (this.state.nameofInstitutionOrLender == "") {
        //     nameError = "Name of Lender cannot be Blank"
        // }
        if (this.state.liabilityTypeId == 0) {
            nameError = "Type of Liability cannot be Blank"
        }

        if (nameError) {
            // alert(nameError);
            this.toasterAlert(nameError,"Warning")
            return false;
        }
        return true;
    }

    handleInputChange = (event) => {
        let attrname = event.target.name;
        let attrvalue = event.target.value;

        if(attrname == 'nameofInstitutionOrLender'){
            let nameValue = $AHelper.capitalizeAllLetters(attrvalue);
            if($AHelper.isRegexForAll(nameValue)){
                this.setState({
                    ...this.state,
                    [attrname]: nameValue
                })
            }
            else {
                this.setState({
                    ...this.state,
                    [attrname]: ""
                })
            }
            return;
        }

        this.setState({
            ...this.state,
            [attrname]: attrvalue
        })
    }

    updateLiabilityFromTable = (liability) => {

        let payOffDate = (liability.payOffDate !== null && liability.payOffDate !== undefined && liability.payOffDate !== "Invalid Date") ?  moment(liability.payOffDate).toDate() : ""
        konsole.log("updatepayOffDate",payOffDate)
        this.setState({
            liabilityTypeId: liability.liabilityTypeId,
            nameofInstitutionOrLender: liability.nameofInstitutionOrLender,
            payOffDate: payOffDate,
            outstandingBalance: liability.outstandingBalance,
            paymentAmount: liability.paymentAmount,
            natureId: liability.userLiabilityId,
            update:true
        })
    }
    toasterAlert(text,type) {
        this.context.setdata({open:true,
          text:text,
          type:type})
      }

     

    render() {
 
        konsole.log("update",this.state.update)
        let liabilityType = {};
        if ($AHelper.typeCasteToString(this.state.liabilityTypeId) !== "999999") {
            liabilityType = (this.state.liabilityTypeId !== "") ? this.state.LiabilityTypes[this.state.liabilityTypeId - 1] : "";
        } else {
            liabilityType = (this.state.liabilityTypeId !== "") ? this.state.LiabilityTypes[this.state.LiabilityTypes.length - 1] : "";
        }


        //----------------
        let typeofliabilities=(this.state.LiabilityTypes.length > 0) && this.state.LiabilityTypes.filter((item)=>item.value !=='6')
    
        return (
            <>
                <style jsx global>{`
                    .modal-open .modal-backdrop.show{opacity:0;}
                    
                `}</style>
                {/* <a onClick={this.handleShow}><img className='px-2' src="/icons/add-icon.svg" alt=" Mortgages" /></a> */}

                <Modal show={this.props.show} size="lg" centered onHide={this.props.handleLiablitypopShow} animation="false" backdrop="static">
                    <Modal.Header closeButton closeVariant="white">
                        <Modal.Title>Types of Liabilities</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pb-5 pt-4">
                        <div className='person-content'>
                            {/* <Row>
                                <h4>Mortgages, Notes to Banks, Notes to Others, Loans on Insurance, Other:</h4>
                            </Row> */}
                            <Form.Group as={Row} className="mb-3">

                                <Col xs sm="6" lg="5">
                                    <Select className="w-100 p-0 custom-select"
                                        onChange={(event) => this.setState({ liabilityTypeId: event.value })}
                                        options={typeofliabilities} 
                                        value={liabilityType}
                                        placeholder="Types of Liabilities"
                                        isSearchable />
                                </Col>
                                {
                                    this.state.liabilityTypeId == "999999" &&
                                    <Col xs sm="6" lg="5">
                                        <Other othersCategoryId={15} userId={this.state.userId} dropValue={this.state.liabilityTypeId} natureId={this.state.natureId} ref={this.liabilityRef}/>
                                    </Col>
                                }

                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Col xs sm="6" lg="5">
                                    <Form.Control type="text"
                                        value={$AHelper.capitalizeAllLetters(this.state.nameofInstitutionOrLender)} onChange={this.handleInputChange} name="nameofInstitutionOrLender"
                                        placeholder="Name of Lender" />
                                </Col>
                                <Col xs sm="6" lg="5">
                                    <DatepickerComponent name="payOffDate" value={this.state.payOffDate} setValue={(value) => this.setState({ payOffDate: value })} placeholderText='PayOff Date' maxDate={0} minDate="100" />
                                </Col>

                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col xs sm="6" lg="5">
                                    <CurrencyInput prefix="$" allowNegativeValue={false} className="border" value={this.state.outstandingBalance} placeholder='Outstanding Balance'  name="outstandingBalance" onValueChange={(value) => { this.setState({outstandingBalance: value})}} decimalScale="2"/>
                                </Col>
                                <Col xs sm="6" lg="5">
                                    <CurrencyInput prefix="$" allowNegativeValue={false}  className="border" value={this.state.paymentAmount} placeholder='Payment Amount'  name="paymentAmount" onValueChange={(value) => { this.setState({paymentAmount: value})}} decimalScale="2"/>
                                </Col>
                            </Form.Group>

                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                       
                        <Button className="theme-btn" onClick={this.handleLiableSubmit}>
                        {
                            (this.state.update==true)?  'Update' :'Save'
                        }
                            
                        </Button>
                        {
                            this.state.UserLiabilities.length > 0 && (
                                <Table bordered>
                                    <thead>
                                        <tr>
                                            <td>Type of Liabilities </td>
                                            <td>Name of Lender</td>
                                            <td>Payoff Date</td>
                                            <td>Outstanding Balance</td>
                                            <td>Monthly Payment Amount</td>
                                            <td></td>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.UserLiabilities.map((liability, index) => {
                                            return (
                                                <tr key={index} >
                                                    <td> {liability.liabilityType} </td>
                                                    <td> {liability.nameofInstitutionOrLender} </td>
                                                    <td>{liability.payOffDate !== null ? $AHelper.getFormattedDate(liability.payOffDate) : ""}</td>
                                                    <td>{liability.outstandingBalance !== null && liability.outstandingBalance !== undefined && liability.outstandingBalance !== "" ? $AHelper.IncludeDollars(liability.outstandingBalance) : "-"}</td>
                                                    <td>{liability.paymentAmount !== null && liability.paymentAmount !== undefined && liability.paymentAmount !== "" ? $AHelper.IncludeDollars(liability.paymentAmount) : "-"}</td>
                                                    <td><p style={{textDecoration:"underline", cursor:"pointer"}} onClick={() => this.updateLiabilityFromTable(liability)}>Edit</p></td>
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </Table>
                            )
                        }

                    </Modal.Footer>
                </Modal>

            </>
        )
    }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Mortgages);