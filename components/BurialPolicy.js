
import React, { Component } from 'react'
import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap"
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { $Service_Url } from "./network/UrlPath";
import Select from "react-select";
import {$AHelper} from './control/AHelper';
import { $CommonServiceFn } from './network/Service';
import {legal } from './control/Constant'
import { burial } from "./control/Constant";
import { Msg } from './control/Msg';
import konsole from './control/Konsole';

class BurialPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            userId: "",
            SpouseDetailsUserId: "",
            formlabelData: [],
            formlabelDataSpouse: [],
            updatePrimaryMetaData: false,
            updateSpouseMetaData: false,
            primarymemberDetails:{},
            
            plotprimary: {
                    userId: "",
                    userSubjectDataId: 0,
                    subjectId: 0,
                    subResponseData: "string",
                    responseId: 0,
                },
            
            plotSpouse: {
                    userId: "",
                    userSubjectDataId: 0,
                    subjectId: 0,
                    subResponseData: "string",
                    responseId: 0,
                },
        };
    }

    componentDidMount() {
        let newuserid = sessionStorage.getItem("SessPrimaryUserId");
        let spouseDetailsUserId = sessionStorage.getItem("spouseUserId");
        let primarymemberDetails=JSON.parse(sessionStorage?.getItem("userDetailOfPrimary"))
        this.setState({
            userId: newuserid,
            SpouseDetailsUserId: spouseDetailsUserId,
            primarymemberDetails:primarymemberDetails
        })
        this.getsubjectForFormLabelIdForPrimary(newuserid);
        if(spouseDetailsUserId !== 'null'){
            this.getsubjectForFormLabelIdSpouse(spouseDetailsUserId)
        }
    }
  
    
    handleChange = (e) => {
        const eventId = e.target.id;
        const eventValue = e.target.value;
        const eventName = e.target.name;
        
        if (eventName == "plot1") {
            this.setState({
                ...this.state,
                plotprimary: {
                    userSubjectDataId: this.state.formlabelData.label464 ? this.state.formlabelData.label464.userSubjectDataId:0,
                    responseId: eventId,
                    subResponseData: eventValue,
                    subjectId: this.state.formlabelData.label464 &&
                        this.state.formlabelData.label464.questionId,
                }
            })
        } else if (eventName == "plot2") {
            this.setState({
                ...this.state,
                plotSpouse: {
                    userSubjectDataId: this.state.formlabelDataSpouse.label464 ? this.state.formlabelDataSpouse.label464.userSubjectDataId:0,
                    responseId: eventId,
                    subResponseData: eventValue,
                    subjectId: this.state.formlabelData.label464 &&
                        this.state.formlabelData.label464.questionId,
                }
            })
        }
       
    };
    
    getsubjectForFormLabelIdForPrimary = (newuserid) => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    // burial.formLabelId.map((id, index) => {
    //   let data = [id.id];
      $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, burial.formLabelId, (response) => {
        if (response) {
            const resSubData = response.data.data;

          for (let resObj of resSubData) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = resObj.question;
            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, '', (response) => {
              if (response) {
                if (response.data.data.userSubjects.length !== 0) {
                  this.setState({
                    updatePrimaryMetaData: true,
                  })
                  let responseData = response.data.data.userSubjects[0];
                  for (let i = 0; i < formlabelData[label].response.length; i++) {
                    this.props.dispatchloader(true);
                    if (formlabelData[label].response[i].responseId === responseData.responseId) {
                      if (responseData.responseNature == "Radio") {
                        formlabelData[label].response[i]["checked"] = true;
                        formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                      } else if (responseData.responseNature == "Text") {
                        formlabelData[label].response[i]["response"] = responseData.response;
                        formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                      }
                    }
                    if(formlabelData[label].response.length - 1 == i ){
                        this.props.dispatchloader(false);
                    }
                  }
                }
                this.props.dispatchloader(false);
              }
            })
            this.setState({
              formlabelData: formlabelData,
            });
          }
        }
      });
    // });
  };

  getsubjectForFormLabelIdSpouse = (spouseUserId) => {
      let formlabelDataSpouse = {};
      this.props.dispatchloader(true);
    //   burial.formLabelId.map((id, index) => {
    //       let data = [id.id];
          $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, burial.formLabelId, (response) => {
              if (response) {
                const resSubData = response.data.data;

                  for (let resObj of resSubData) {
                      let label = "label" + resObj.formLabelId;
                      formlabelDataSpouse[label] = resObj.question;
                      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + spouseUserId + `/0/0/${formlabelDataSpouse[label].questionId}`, '', (response) => {
                          if (response) {
                              if (response.data.data.userSubjects.length !== 0) {
                                  this.setState({
                                      updateSpouseMetaData: true,
                                  })
                                  let responseData = response.data.data.userSubjects[0];
                                  this.props.dispatchloader(true);
                                  for (let i = 0; i < formlabelDataSpouse[label].response.length; i++) {
                                      if (formlabelDataSpouse[label].response[i].responseId === responseData.responseId) {
                                        //   this.props.dispatchloader(false);
                                          if (responseData.responseNature == "Radio") {
                                            formlabelDataSpouse[label].response[i]["checked"] = true;
                                            formlabelDataSpouse[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                                          } else if (responseData.responseNature == "Text") {
                                            formlabelDataSpouse[label].response[i]["response"] = responseData.response;
                                            formlabelDataSpouse[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                                          }
                                    }
                                    if(formlabelDataSpouse[label].response.length - 1 == i ){
                                        this.props.dispatchloader(false);
                                    }   
                                  }
                              }
                              this.props.dispatchloader(false);
                          }
                      })
                      this.setState({
                          formlabelDataSpouse: formlabelDataSpouse,
                      });
                  }
              } else {
                  //   alert(Msg.ErrorMsg);
              }
          });
    //   });
  };

    handlesubmit = () => {
        let plotprimary = this.state.plotprimary;
        let plotSpouse = this.state.plotSpouse;

        if (this.state.SpouseDetailsUserId !== 'null'){
            plotprimary["userId"] = this.state.userId;
            plotSpouse["userId"] = this.state.SpouseDetailsUserId;
        }
        else{
            plotprimary["userId"] = this.state.userId;
        }

        let totoalinptary = [];
        let totinptary = [];
        if (this.state.SpouseDetailsUserId !== "null") {
            if(plotprimary.subjectId!==0 && plotprimary.subResponseData!=="" && plotprimary.responseId!==0){
                totinptary.push(plotprimary);
              }
              if(plotSpouse.subjectId!==0 && plotSpouse.subResponseData!=="" && plotSpouse.responseId!==0){
                totoalinptary.push(plotSpouse);
              }
        } else {

            if(plotprimary.subjectId!==0 && plotprimary.subResponseData!=="" && plotprimary.responseId!==0){
                totinptary.push(plotprimary);
              }
            
        }
        if(this.state.SpouseDetailsUserId !== 'null' ){
            if (this.state.updatePrimaryMetaData == true && this.state.updateSpouseMetaData == true) {
                this.handleUpdateSubmit(totinptary, this.state.userId);
                this.handleUpdateSubmit(totoalinptary, this.state.SpouseDetailsUserId);
            } else if (this.state.updatePrimaryMetaData == true && this.state.updateSpouseMetaData == false) {
                this.handleUpdateSubmit(totinptary, this.state.userId);
                this.handleasdSubmit(totoalinptary,this.state.SpouseDetailsUserId);
            } else if (this.state.updateSpouseMetaData == true && this.state.updatePrimaryMetaData == false) {
                this.handleUpdateSubmit(totinptary, this.state.SpouseDetailsUserId);
            } else if (this.state.updateSpouseMetaData == false && this.state.updatePrimaryMetaData == false) {
                this.handleasdSubmit(totinptary, this.state.userId);
                this.handleasdSubmit(totoalinptary, this.state.SpouseDetailsUserId);
            }
        }
        else{
            if (this.state.updatePrimaryMetaData == true) {
                this.handleUpdateSubmit(totinptary, this.state.userId);
            } else if ( this.state.updatePrimaryMetaData == false ) {
                this.handleasdSubmit(totinptary, this.state.userId);
            }
        }
    };

    handleasdSubmit = (totinptary, consumerId) => {
        konsole.log("submit");
        this.props.dispatchloader(true);
        konsole.log("update", totinptary);
        $CommonServiceFn.InvokeCommonApi(
            "POST",
            $Service_Url.postaddusersubjectdata,
            totinptary,
            (response) => {
                this.props.dispatchloader(false);
                konsole.log("Success res submit" + JSON.stringify(response));
                if (response) {
                    // alert("Saved Successfully");
                    if(consumerId == this.state.userId){
                        this.getsubjectForFormLabelIdForPrimary(this.state.userId);
                    }
                    if (consumerId == this.state.SpouseDetailsUserId) {
                    this.getsubjectForFormLabelIdSpouse(this.state.SpouseDetailsUserId)
                    }
                } else {
                    // alert(Msg.ErrorMsg);
                    this.props.handleClose();
                }
            }
        );
    }

    handleUpdateSubmit = (totinptary, consumerId) => {
        konsole.log("update");
        let postData = {
            userId: consumerId,
            userSubjects: totinptary,
        }
        konsole.log("update",postData);
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi(
            "PUT",
            $Service_Url.putSubjectResponse, // + "?userId=" + this.state.userId
            postData,
            (response) => {
                this.props.dispatchloader(false);
                konsole.log("Success res update" + JSON.stringify(response));
                if (response) {
                    // alert("Saved Successfully");
                    if(consumerId == this.state.userId){
                        this.getsubjectForFormLabelIdForPrimary(this.state.userId);
                    }
                    if (consumerId == this.state.SpouseDetailsUserId) {
                    this.getsubjectForFormLabelIdSpouse(this.state.SpouseDetailsUserId)
                    }
                    this.props.handleClose();
                } else {
                    this.props.handleClose();
                }
            }
        );
    }




    render() {
        konsole.log("this.state", this.state);

        const rowSpanClass = (this.state.SpouseDetailsUserId !== "null") ? { span: 3, offset: 5 } : { span: 3, offset: 6 };

        return (
            <>
            <style jsx global>{`
            .modal-open .modal-backdrop.show {
                opacity: 0.7;
            }
            `}</style>     
            <Modal
            size={this.state.SpouseDetailsUserId !== "null" ? "lg" : "md"}
            show={this.props.show}
            centered
            onHide={this.props.handleClose}
            animation="false"
            backdrop="static"
            >
            <Modal.Header closeButton closeVariant="white">
                <Modal.Title>Burial/Cremation  Plan</Modal.Title>
            </Modal.Header>
            <Modal.Body className="m-4">
                {/* <Container className="bg-white info-details p-3 "> */}
                <div className="boxBorderStyle">
                    {/* <Row className="mx-1 person-head">
                        <Col className="p-0">
                            <div className="d-flex align-items-center justify-content-between ">
                                <div className="content-box">
                                    <div className="d-flex d-flex align-items-center justify-content-start">
                                        <h4 className="ms-2">Burial Policy</h4>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row> */}
                    <Row className="mt-4 ms-4">
                        <Row>
                                    <Col className="d-flex justify-content-center" lg={rowSpanClass}><b>{this.state.primarymemberDetails.memberName}</b>
                                     {/* Primary */}
                                      </Col>
                            { this.state.SpouseDetailsUserId !== "null" && <Col className="d-flex justify-content-center"><b>{this.state.primarymemberDetails.spouseName}</b>
                                {/* Spouse */}
                                </Col>}
                        </Row>

                        <Row className="my-4">
                            <Col lg="5">
                                {this.state.formlabelData.label464 && this.state.formlabelData.label464.question}
                            </Col>
                                {this.state.formlabelData.label464 && this.state.formlabelData.label464.response.map((response) => {
                                    return (
                                        <>
                                            <Col>
                                                <Form.Check inline className="left-radio" type="radio" id={response.responseId} name="plot1" label={response.response} value={response.response} onChange={(e) => { this.handleChange(e); }} defaultChecked = {response.checked}/>
                                            </Col>
                                        </>
                                    );
                                }
                            )}
                            {
                            this.state.SpouseDetailsUserId !== "null" &&
                            this.state.formlabelDataSpouse.label464 &&
                            this.state.formlabelDataSpouse.label464.response.map(
                                (response) => {
                                return (
                                    <>
                                        <Col>
                                            <Form.Check inline className="left-radio" type="radio" id={response.responseId} name="plot2" label={response.response} value={response.response} onChange={(e) => { this.handleChange(e) }} defaultChecked = {response.checked}/>
                                        </Col>
                                    </>
                                );
                                }
                            )}
                        </Row>
                    </Row>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button className="theme-btn" onClick={this.handlesubmit}>
                Save
                </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(BurialPolicy);
