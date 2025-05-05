import React, { Component } from 'react'
import { Modal, Button, Form, Row, Col,Card, Table } from "react-bootstrap"
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { $Service_Url } from "../components/network/UrlPath";
import Select from "react-select";
import {$AHelper} from './control/AHelper';
import { $CommonServiceFn } from '../components/network/Service';
import {legal } from './control/Constant'
import { Msg } from './control/Msg';
import konsole from './control/Konsole';
import {globalContext} from "../pages/_app";


class LegalRoles extends Component {
    static contextType = globalContext
    constructor(props){
        super(props);
        this.state = {
            show:false,
            formlabelData: {},
            showLegalRoles: false,
            updateCaregiverSuitabilty: false,
            userId: this.props.primaryUserId,
            legalDocTypeId: 0,
            dateExecuted: new Date(),
            docName: '',
            docPath: '',

            legalDocType: [],
            legalDocument: [],

            legally: {
                userId: "",
                userSubjectDataId: 0,
                subjectId: 0,
                subResponseData: "",
                responseId: 0,
            },
            power: {
                userId: "",
                userSubjectDataId: 0,
                subjectId: 0,
                subResponseData: "string",
                responseId: 0,
            },
            executor: {
                userId: "",
                userSubjectDataId: 0,
                subjectId: 0,
                subResponseData: "string",
                responseId: 0,
            },
            lawsuit: {
                userId: "",
                userSubjectDataId: 0,
                subjectId: 0,
                subResponseData: "string",
                responseId: 0,
            },
            seperate: {
                userId: "",
                userSubjectDataId: 0,
                subjectId: 0,
                subResponseData: "string",
                responseId: 0,
            },
            inherit: {
                userId: "",
                userSubjectDataId: 0,
                subjectId: 0,
                subResponseData: "",
                responseId: 0,
            },
            special: {
                userId: "",
                userSubjectDataId: 0,
                subjectId: 0,
                subResponseData: "string",
                responseId: 0,
            },
        };
    }

    componentDidMount() {
        let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
        this.setState({
            userId: newuserid,
        });
        this.getsubjectForFormLabelId(newuserid);
    }

    handleClose = () => {
        this.setState({
          show: false,
        });
      };
    
      handleShow = () => {
        this.setState({
          show: true,
        });
      };
    handleChange = (e) => {
        const eventId = e.target.id;
        const eventValue = e.target.value;
        const eventName = e.target.name;

        if (eventName == "legally") {

            // let nameValue = $AHelper.capitalizeFirstLetter(eventValue);
            if ($AHelper.isAlphabetRegex(eventValue)) {
                this.setState({
                    ...this.state,
                    legally: {
                        userSubjectDataId: this.state.formlabelData.label445 ? this.state.formlabelData.label445.userSubjectDataId:0,
                        responseId: eventId,
                        subResponseData: eventValue,
                        subjectId: this.state.formlabelData.label445 &&
                            this.state.formlabelData.label445.questionId
                    }
    
                })
            } 
            else {
                // alert("please enter valid ");
                this.setState({
                    ...this.state,
                    legally: {
                        userSubjectDataId: this.state.formlabelData.label445 ? this.state.formlabelData.label445.userSubjectDataId:0,
                        responseId:"",
                        subResponseData: "",
                        subjectId: this.state.formlabelData.label445 &&
                            this.state.formlabelData.label445.questionId
                    }
    
                })
            }
         } else if (eventName == "power") {
            this.setState({
                ...this.state,
                power: {
                    userSubjectDataId: this.state.formlabelData.label446 ? this.state.formlabelData.label446.userSubjectDataId:0,
                    responseId: eventId,
                    subResponseData: eventValue,
                    subjectId: this.state.formlabelData.label446 &&
                        this.state.formlabelData.label446.questionId
                }

            })
        } else if (eventName == "executor") {

            this.setState({
                ...this.state,
                executor: {

                    userSubjectDataId: this.state.formlabelData.label447 ? this.state.formlabelData.label447.userSubjectDataId:0,
                    responseId: eventId,
                    subResponseData: eventValue,
                    subjectId: this.state.formlabelData.label447 &&
                        this.state.formlabelData.label447.questionId,
                }
            })

        } else if (eventName == "lawsuit") {

            this.setState({
                ...this.state,
                lawsuit: {

                    userSubjectDataId: this.state.formlabelData.label448 ? this.state.formlabelData.label448.userSubjectDataId:0,
                    responseId: eventId,
                    subResponseData: eventValue,
                    subjectId: this.state.formlabelData.label448 &&
                        this.state.formlabelData.label448.questionId,
                }
            })

        } else if (eventName == "seperate") {

            this.setState({
                ...this.state,
                seperate: {

                    userSubjectDataId: this.state.formlabelData.label449 ? this.state.formlabelData.label449.userSubjectDataId:0,
                    responseId: eventId,
                    subResponseData: eventValue,
                    subjectId: this.state.formlabelData.label449 &&
                        this.state.formlabelData.label449.questionId,
                }
            })

        } else if (eventName == "inherit") {
            if ($AHelper.isRegexForAll(eventValue)) {
                this.setState({
                    ...this.state,
                    inherit: {
                        userSubjectDataId: this.state.formlabelData.label450 ? this.state.formlabelData.label450.userSubjectDataId:0,
                        responseId: eventId,
                        subResponseData: eventValue,
                        subjectId: this.state.formlabelData.label450 &&
                            this.state.formlabelData.label450.questionId
                    }
    
                })
            } else{

            this.setState({
                ...this.state,
                inherit: {

                    userSubjectDataId: this.state.formlabelData.label450 ? this.state.formlabelData.label450.userSubjectDataId:0,
                    responseId: "",
                    subResponseData: "",
                    subjectId: this.state.formlabelData.label450 &&
                        this.state.formlabelData.label450.questionId,
                }
            })
        }
        } else if (eventName == "special") {

            this.setState({
                ...this.state,
                special: {

                    userSubjectDataId: this.state.formlabelData.label451 ? this.state.formlabelData.label451.userSubjectDataId:0,
                    responseId: eventId,
                    subResponseData: eventValue,
                    subjectId: this.state.formlabelData.label451 &&
                        this.state.formlabelData.label451.questionId,
                }
            })

        }


    };


    handleInputChange = (event) => {
        event.preventDefault();

        const eventId = event.target.id;
        const eventValue = event.target.value;
        konsole.log("eventUd",eventId,eventValue);
        if(eventId == "institution"){
            let nameValue = $AHelper.capitalizeFirstLetter(eventValue);
            if($AHelper.isAlphabetRegex(nameValue)){
              this.setState({
                ...this.state,
                [eventId]: nameValue,
              });
            }
            else{
              this.setState({
                ...this.state,
                [eventId]: "",
              })
              
            }
        }
        else if (eventId == "noOfChildren") {
          if ($AHelper.isNumberRegex(eventValue)) {
            this.setState({
              ...this.state,
              [eventId]: eventValue,
            });
          } else {
            // alert("please enter valid number");
            this.toasterAlert("please enter valid number","Warning")
            this.setState({
              noOfChildren: 0,
            })
          }
        }
        else{
          this.setState({
            [eventId]: eventValue
          })
        }
    }


    handlesubmit = () => {
        let inputdata = JSON.parse(JSON.stringify(this.state));

        let legally = this.state.legally;
        let power = this.state.power;
        let executor = this.state.executor
        let lawsuit = this.state.lawsuit
        let seperate = this.state.seperate
        let inherit = this.state.inherit
        let special = this.state.special

        if(!this.state.updateCaregiverSuitabilty){
            let userId = this.state.userId;
            legally["userId"] = userId;
            power["userId"] = userId;
            executor["userId"] = userId;
            lawsuit["userId"] = userId;
            seperate["userId"] = userId;
            inherit["userId"] = userId;
            special["userId"] = userId;
        }



        let totinptary = [];
        // totinptary.push(legally);
        // totinptary.push(power);
        // totinptary.push(executor);
        // totinptary.push(lawsuit);
        // totinptary.push(seperate);
        // totinptary.push(inherit);
        // totinptary.push(special);

        if(legally.subjectId!==0 && legally.subResponseData!=="" && legally.responseId!==0){
            totinptary.push(legally);
          }
          if(power.subjectId!==0 && power.subResponseData!=="" && power.responseId!==0){
            totinptary.push(power);
          }
          if(executor.subjectId!==0 && executor.subResponseData!=="" && executor.responseId!==0){
            totinptary.push(executor);
          }
          if(lawsuit.subjectId!==0 && lawsuit.subResponseData!=="" && lawsuit.responseId!==0){
            totinptary.push(lawsuit);
          }

          if(seperate.subjectId!==0 && seperate.subResponseData!=="" && seperate.responseId!==0){
            totinptary.push(seperate);
          }
          if(inherit.subjectId!==0 && inherit.subResponseData!=="" && inherit.responseId!==0){
            totinptary.push(inherit);
          }
          if(special.subjectId!==0 && special.subResponseData!=="" && special.responseId!==0){
            totinptary.push(special);
          }



        let PostData = {}
        let UrlPath = ""
        let method = (this.state.updateCaregiverSuitabilty) ? "PUT" : "POST" ;
        if(this.state.updateCaregiverSuitabilty){
            PostData = {
            userId: this.state.userId,
            userSubjects: totinptary
            }
            UrlPath = $Service_Url.putSubjectResponse

        } else{
            PostData = totinptary
            UrlPath = $Service_Url.postaddusersubjectdata
        }

        // konsole.log(JSON.stringify(inputdata));
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi(
            method,
            UrlPath, // + "?userId=" + this.state.userId
            PostData,
            (response) => {
                this.props.dispatchloader(false);
                konsole.log("Success res legal roles" + JSON.stringify(response));
                if (response) {
                    // alert("Saved Successfully");
                    this.handleClose();
                    this.getsubjectForFormLabelId(this.state.userId);
                    konsole.log("method",method,"postData",PostData);
                } else {
                    // alert(Msg.ErrorMsg);
                    this.handleClose();

                    
                }
            }
        );
    };

    getsubjectForFormLabelId = (newuserid) => {
        let formlabelData = {};
        this.props.dispatchloader(true);
        // legal.formLabelId.map((id, index) => {
        //     let data = [id.id];
            $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, legal.formLabelId, (response) => {
                if (response) {
                    const resSubData = response.data.data;

                    for (let resObj of resSubData) {
                        let label = "label" + resObj.formLabelId;
                        formlabelData[label] = resObj.question;
                        konsole.log("future expectation formlabelData", formlabelData);
                        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, "", (response) => {
                            if (response) {
                                if (response.data.data.userSubjects.length !== 0) {
                                    this.setState({
                                        updateCaregiverSuitabilty: true,
                                    })
                                    let responseData = response.data.data.userSubjects[0];
                                    this.props.dispatchloader(true);
                                    for (let i = 0; i < formlabelData[label].response.length; i++) {
                                        if (formlabelData[label].response[i].responseId === responseData.responseId) {
                                            this.props.dispatchloader(false);
                                            if (responseData.responseNature == "Radio") {
                                                formlabelData[label].response[i]["checked"] = true;
                                                formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                                            } else if (responseData.responseNature == "Text") {
                                                formlabelData[label].response[i]["response"] = responseData.response;
                                                formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                                            }
                                        }
                                    }
                                }
                                this.props.dispatchloader(false);
                            }
                        })
                        this.setState({
                            formlabelData: formlabelData
                        });
                    }
                }
            });
        // });
    };

    toasterAlert(text,type) {
        this.context.setdata({open:true,
          text:text,
          type:type})
      }
    


    render() {
        return (
            <>
                <style jsx global>{`
                    .modal-open .modal-backdrop.show {
                        opacity: 0.7;
                    }
                `}
                </style>
            <Card.Img variant="Top" className="" src="/icons/legalRole.svg" onClick={this.handleShow} /> 
                                        <Card.Body className="p-0 mt-2 ">
                <a onClick={this.handleShow}>
                <div className="border d-flex justify-content-between align-items-center p-2 ">
                                        <p className="ms-2">Legal Roles You Play</p>
                                        <div className="border-start">
                    <img className="px-2" src="/icons/add-icon.svg" alt="Monthly Expenses" />
                    </div>
                    </div>
                </a>
                </Card.Body>

                <Modal show={this.state.show} size="lg" centered onHide={this.handleClose} animation="false" backdrop="static">
                        <Modal.Header closeButton closeVariant="white">
                            <Modal.Title>Legal Roles You Play</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="pb-3 pt-4">
                            <Row>
                            <Col lg="6" className='mb-4 fs-3'>
                                    <p>
                                    Your role in other's estate planning
                                    </p>
                                    </Col>
                            </Row>
                            <div className="border p-4">
                                <Row className="d-flex ">
                                    <Col lg="6">
                                    <p>
                                        {this.state.formlabelData.label445 &&
                                        this.state.formlabelData.label445.question}
                                    </p>
                                    </Col>
                                    <Col lg="5" className="">
                                        {this.state.formlabelData.label445 && this.state.formlabelData.label445.response.map((response) => {
                                            return ( 
                                            <>
                                                <Form.Control type="text" name="legally"  onChange={(e) => {
                                                        this.handleChange(e);
                                                    }} onInput ={(event) => {this.handleInputChange(event)}} className="w-100" id={response.responseId} defaultValue={response.response} />
                                            </>
                                            )}
                                        )}
                                    </Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col lg="6">
                                        <p>{ this.state.formlabelData.label446 && this.state.formlabelData.label446.question }</p>
                                    </Col>
                                    <Col lg="5" className="d-flex align-items-center justify-content-end ">
                                        <div>
                                            {this.state.formlabelData.label446 && this.state.formlabelData.label446.response.map(
                                                (response) => {
                                                return (
                                                    <>
                                                    <Form.Check className="left-radio me-3" type="radio" id={response.responseId} value={response.response} name="power" label={response.response} onChange={(e) => { this.handleChange(e); }} defaultChecked={response.checked}/>
                                                    </>
                                                );
                                                }
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col lg="6">
                                        <p>{this.state.formlabelData.label447 && this.state.formlabelData.label447.question}</p>
                                    </Col>
                                    <Col lg="5">
                                        <div className="d-flex align-items-center justify-content-end">
                                            {this.state.formlabelData.label447 &&
                                            this.state.formlabelData.label447.response.map(
                                                (response) => {
                                                return (
                                                    <>
                                                    <Form.Check
                                                    className = "left-radio me-3"
                                                    type="radio"
                                                    id={response.responseId}
                                                    value={response.response}
                                                    name="executor"
                                                    label={response.response}
                                                    onChange={(e) => {
                                                        this.handleChange(e);
                                                    }}
                                                    defaultChecked={response.checked}
                                                    />
                                                    </>
                                                );
                                                }
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col lg="6">
                                    <p>
                                        {this.state.formlabelData.label448 &&
                                        this.state.formlabelData.label448.question}
                                    </p>
                                    </Col>
                                    <Col lg="5">
                                    <div className="d-flex align-items-center justify-content-end">
                                        {this.state.formlabelData.label448 &&
                                        this.state.formlabelData.label448.response.map(
                                            (response) => {
                                            return (
                                                <>
                                                    <Form.Check
                                                className="left-radio me-3"
                                                type="radio"
                                                id={response.responseId}
                                                value={response.response}
                                                name="lawsuit"
                                                label={response.response}
                                                onChange={(e) => {
                                                    this.handleChange(e);
                                                }}
                                                defaultChecked={response.checked}
                                                />
                                                </>
                                            );
                                            }
                                        )}
                                    </div>
                                    </Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col lg="6">
                                    <p>
                                        {this.state.formlabelData.label449 &&
                                        this.state.formlabelData.label449.question}
                                    </p>
                                    </Col>
                                    <Col lg="5">
                                        <div className="d-flex align-items-center justify-content-end">
                                            {this.state.formlabelData.label449 &&
                                            this.state.formlabelData.label449.response.map(
                                                (response) => {
                                                return (
                                                    <>
                                                        <Form.Check className="left-radio me-3" type="radio" id={response.responseId} value={response.response} name="seperate" label={response.response} onChange={(e) => { this.handleChange(e);}} defaultChecked={response.checked}/>
                                                    </>
                                                );
                                                }
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            <div className='p-4'>
                                <Row className="my-4">
                                    <Col className="border-0" lg="6">
                                        <p>
                                            {this.state.formlabelData.label450 &&
                                            this.state.formlabelData.label450.question}
                                        </p>
                                    </Col>
                                    <Col className="" lg="5">
                                        {this.state.formlabelData.label450 &&
                                            this.state.formlabelData.label450.response.map(
                                            (response) => {
                                                return (
                                                <>
                                                    <Form.Control type="text" name="inherit"  onChange={(e) => {
                                                            this.handleChange(e);
                                                        }} onInput ={(event) => {this.handleInputChange(event)}} className="w-100" id={response.responseId} defaultValue={response.response} />
                                                </>
                                                );
                                            }
                                        )}
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col lg="6">
                                    <p>
                                        {this.state.formlabelData.label451 &&
                                        this.state.formlabelData.label451.question}
                                    </p>
                                    </Col>
                                    <Col lg="5" className='d-flex align-items-center justify-content-end'>
                                        {this.state.formlabelData.label451 &&
                                        this.state.formlabelData.label451.response.map(
                                            (response) => {
                                            return (
                                                <>
                                                    <Form.Check
                                                    className="left-radio me-3"
                                                    type="radio"
                                                    id={response.responseId}
                                                    value={response.response}
                                                    name="special"
                                                    label={response.response}
                                                    onChange={(e) => {
                                                        this.handleChange(e);
                                                    }}
                                                    defaultChecked={response.checked}
                                                    />
                                                </>
                                            );
                                            }
                                        )}
                                    </Col>
                                </Row> 
                            </div>   
                        </Modal.Body>
                        <Modal.Footer className="border-0">
                            <Button className="theme-btn"onClick={this.handlesubmit}> Save </Button>
                        </Modal.Footer>
                    </Modal>
            </>
    )
  }
}


const mapStateToProps = (state) => ({
    ...state
});

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({
            type: SET_LOADER,
            payload: loader
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LegalRoles);