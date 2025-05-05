import React, { Component } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { SET_LOADER } from './Store/Actions/action';
import { $Service_Url } from "../components/network/UrlPath";
import { $CommonServiceFn } from '../components/network/Service';
import { Msg } from './control/Msg';
import konsole from './control/Konsole';
import { isUserUnder18 } from './control/Constant';
import { $AHelper } from './control/AHelper';
import { globalContext } from "../pages/_app";
import { isNotValidNullUndefile } from './Reusable/ReusableCom';

export class occupation extends Component {
    static contextType = globalContext
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            dob : this.props?.dob,
            updateOccupation: false,
            occupationObj: {},
            isWorking: null,
            occupationType: null,
            ageOfRetirement: null,
            professionalBackground:null,
            maritalStatusId: "",
            isDisabled: null,
            activityTypeId: 5,
            logginUserId: null,
            reasonOfDisable:''

        };
    }

    componentDidMount() {
        let logginUserId = sessionStorage.getItem("loggedUserId");
        let maritalStatusId = sessionStorage.getItem("maritalStatusId")
        this.setState({
            logginUserId: logginUserId,
            maritalStatusId: maritalStatusId
        }, () => {
            this.getOccupationbyUserId()
        })
    }
   
     

    componentDidUpdate(prevProps, prevState) {
        if(this.props.dob !== prevProps.dob && isUserUnder18(this.props.dob) && !isNotValidNullUndefile(this.state.professionalBackground) && this.props?.refrencePage !='SpouseComponent' && this.props?.refrencePage !='PersonalInfoComponent' && this.props?.refrencePage !='personalInfo' ){
            this.setState({professionalBackground:"Student"})
        }
        if (this.props.userId !== prevProps.userId) {

            this.getOccupationbyUserId()
        }
    }
    getOccupationbyUserId = () => {
        if(!isNotValidNullUndefile(this.props.userId)) return;
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getOccupationbyUserId + this.props.userId,
            "", (response) => {
                if (response) {
                    konsole.log("setvalue", response);
                    let responseData = response.data.data[0];
                    this.setState({
                        occupationObj: responseData,
                        updateOccupation: true,
                        reasonOfDisable:responseData?.reasonOfDisable
                    })
                    this.autoFillOccupationData(responseData);
                }

            })
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevProps.userID !== this.props.userID) {
    //         this.setState({
    //             userId : this.props.userId,
    //         })
    //     }
    // }

    autoFillOccupationData = (responseDataObj) => {
        let retirementAge = null;
        if (responseDataObj.ageOfRetirement !== null) {
            retirementAge = parseInt(responseDataObj.ageOfRetirement)
        }

        if (responseDataObj.isWorking == true) {
            this.setState({
                isWorking: true,
                occupationType: responseDataObj.occupationType,
                ageOfRetirement: retirementAge
            })
        } else if (responseDataObj.isWorking == false) {
            this.setState({
                isWorking: false,
                professionalBackground: responseDataObj.professionalBackground,
                isDisabled: responseDataObj.isDisabled
            })
        }
    }

    handleInputChange = (event) => {
        event.preventDefault();
        let attrname = event.target.name;
        let attrvalue = event.target.value;
        // konsole.log("attrname",attrname,"attrvalue",attrvalue,$AHelper.isNumberRegex(attrvalue), attrvalue < 100)
        switch (attrname) {
            case 'professionalBackground': {
                if ($AHelper.isRegexForAll(attrvalue)) {
                    this.setState({
                        [attrname]: attrvalue
                    })
                }
                else {
                    this.setState({
                        [attrname]: ' '
                    })
                }
            }
                break;
            case 'occupationType':
                if ($AHelper.isRegexForAll(attrvalue)) {
                    this.setState({
                        [attrname]: attrvalue
                    })
                }
                else {
                    this.setState({
                        [attrname]: ' '
                    })
                }
                break;
            default:
                if ($AHelper.isNumberRegex(attrvalue) && attrvalue < 100 ) {
                    this.setState({[attrname]: attrvalue})
                }
                else {
                    this.setState({[attrname]: ""})
                }
        }
    }

    handleRadio = (event) => {
        const radioName = event.target.name;
        const radioValue = event.target.value;
        // konsole.log(event.target.name);
        if ((radioName == "isWorking" || radioName == "isWorking2") && radioValue == "Yes") {
            this.setState({ ...this.state, isWorking: true });
        } else if ((radioName == "isWorking" || radioName == "isWorking2") && radioValue == "No") {
            this.setState({ ...this.state, isWorking: false });
        }
        if ((radioName == "isDisabled" || radioName == "isDisabled2") && radioValue == "Yes") {
            this.setState({ ...this.state, isDisabled: true });
        } else if ((radioName == "isDisabled" || radioName == "isDisabled2") && radioValue == "No") {
            this.setState({ ...this.state, isDisabled: false });
        }
    };

    handleClearState = () => {
        this.setState({
            occupationType: null,
            ageOfRetirement: null,
            professionalBackground: null,
            isDisabled: null,
        })
    }

    handleOccupationSubmit = (AddUserID) => {
        const stateObj = this.state;
        let postDataObj = {};
        if (stateObj.isWorking == null) {
            return null
        }
        if (stateObj.isWorking == true) {
            if (stateObj.occupationType == null || stateObj.occupationType == "") {
                return "occuption";
            }
            // if (stateObj.ageOfRetirement == null) {
            //     return 'ageOfRetirement';
            // }
            postDataObj = {
                isWorking: true,
                occupationType: stateObj.occupationType,
                ageOfRetirement: parseInt(stateObj.ageOfRetirement)
            }
        }
        if (stateObj.isWorking == false) {
            if (stateObj.professionalBackground == null || stateObj.professionalBackground == "") {
                return "professBackground";
            }
            // if (stateObj.isDisabled == null) {
            //     return 'isDisabled';
            // }
            postDataObj = {
                isWorking: false,
                professionalBackground: stateObj.professionalBackground,
                isDisabled: stateObj.isDisabled
            }
        }
        let Url = $Service_Url.postAddOccupation;
        let method = "POST";
        if (this.state.updateOccupation !== null && this.state.updateOccupation) {
            postDataObj["updatedBy"] = this.state.logginUserId;
            postDataObj["userOccId"] = this.state.occupationObj.userOccId
            method = "PUT";
            Url = $Service_Url.putOccupationbyUserId;
        }
        else {
            postDataObj["createdBy"] = this.state.logginUserId;
        }
        postDataObj['reasonOfDisable'] = this.state.reasonOfDisable
        postDataObj["userId"] = AddUserID ? AddUserID : this.props.userId;
        konsole.log("occupation", JSON.stringify(postDataObj),this.state.updateOccupation);
        $CommonServiceFn.InvokeCommonApi(method, Url,
            postDataObj, (response) => {
                konsole.log("Success res" + JSON.stringify(response));
                if (response) {
                    return 'success';
                }
                else {
                    // this.toasterAlert(Msg.ErrorMsg, "Warning")
                }
            })
    }

    handleMouseLeave = (e) => {
        let eventValue=e?.target?.value;
        let eventName=e?.target?.name;
        // konsole.log("e.target.value",eventValue,eventName)

        if (eventValue < 18 && eventValue != '') {
            this.toasterAlert("Retirement age can not be below 18", "Warning")
            this.setState({[eventName]:""})
        } else {
            this.setState({[eventName]: eventValue})
        }
    }


    toasterAlert(text, type) {
        this.context.setdata({
            open: true,
            text: text,
            type: type
        })
    }


    render() {
        
        const occupationTypeValue = this.state.occupationType
        let professionalBackgroundValue = this.state.professionalBackground
     
        return (
            <>
                <Row className="m-0 mt-2 mb-3 p-0" >
                    <Col sm="12" lg="6" className="">
                        <label>
                            {`${this.props.editType == "Child" ? "Is this child employed ?" : (this.props.editType == "Spouse" ? `Is this ${this.state.maritalStatusId == 2 ? "partner" : "spouse"} employed ?` : "Are you still employed?")}`}
                        </label>
                    </Col>
                    <Col xs="12" lg="6">
                        <Form.Check inline className="chekspace cursor-pointer" type="radio" name={this.props.usertype == "spouse" ? "isWorking2" : "isWorking"} label='Yes' value="Yes" onChange={(event) => this.handleRadio(event)} checked={this.state.isWorking == true} />
                        <Form.Check inline className="chekspace cursor-pointer" type="radio" name={this.props.usertype == "spouse" ? "isWorking2" : "isWorking"} label='No' value="No" onChange={(event) => this.handleRadio(event)} checked={this.state.isWorking == false} />
                    </Col>

                </Row>
                {(this.state.isWorking == true) ?
                    <>
                        <Row className="m-0 mb-3 p-0" key={"occupation"}>
                            <Col lg="6" className='d-flex align-items-center'>
                                <label className='' >Occupation*</label>
                            </Col>
                            <Col lg="6" className="">
                                <Form.Control inline type="text" name="occupationType" onChange={(event) => this.handleInputChange(event)} value={occupationTypeValue} />
                            </Col>

                        </Row>
                        {(this?.props?.editType != "Child") && (<Row className="m-0 p-0 mb-3">
                            <Col lg="6" className='d-flex align-items-center'>
                                <label className="pb-1">
                                    At what age do you anticipate retiring?
                                </label>
                            </Col>

                            <Col lg="6" className="">
                                <Form.Control  inline  className="text"  type="text"  name="ageOfRetirement"  onChange={(event) => this.handleInputChange(event)}  value={this.state.ageOfRetirement}  onBlur={this.handleMouseLeave} />
                            </Col>
                        </Row>)}

                    </>
                    :
                    (this.state.isWorking == false) ?
                        <>
                            <Row className="m-0 p-0 mb-3" key={"professional"}>
                                <Col xs sm="11" lg="6" className="">
                                    <label>Professional Background*</label>
                                </Col>
                                <Col xs={12} lg="6" >
                                    <Form.Control inline className="form-input-control" type="text" name="professionalBackground" onChange={(event) => this.handleInputChange(event)} value={professionalBackgroundValue}/>
                                </Col>
                            </Row>
                            <Row className="m-0 p-0 mb-3">
                                <Col xs sm="12" lg="6" className="align-items-center">
                                    <label>
                                        {/* Are you disabled? */}
                                    {`${this.props.editType == "Child" ? "Is this child disabled ?" : (this.props.editType == "Spouse" ? `Is this ${this.state.maritalStatusId == 2 ? "partner" :"spouse" } disabled ?` : "Are you disabled ?")}`}
                                    </label>
                                </Col>
                                <Col lg="6">
                                    <Form.Check inline className="chekspace cursor-pointer" type="radio" name={this.props.usertype == "spouse" ? "isDisabled2" : "isDisabled"} label='Yes' value="Yes" onChange={(event) => this.handleRadio(event)} checked={this.state.isDisabled == true} />
                                    <Form.Check inline className="chekspace cursor-pointer" type="radio" name={this.props.usertype == "spouse" ? "isDisabled2" : "isDisabled"} label='No' value="No" onChange={(event) => this.handleRadio(event)} checked={(this.state.isDisabled == false)} />
                                    {this.state.isDisabled && <Col>
                                    <textarea placeholder='Comment' className='mt-2 border w-100 rounded-2' value={this.state.reasonOfDisable} onChange={(e)=>this.setState({reasonOfDisable:e.target.value})} />
                                </Col>}
                                </Col>
                            </Row>
                        </>
                        :
                        ""
                }
            </>
        )
    }
}

export default occupation;