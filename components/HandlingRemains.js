import React, { Component } from 'react'
import { Modal, Button, Form, Row, Col, Container, Card } from "react-bootstrap"
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { $Service_Url } from "./network/UrlPath";
import {$AHelper} from './control/AHelper';
import { $CommonServiceFn } from './network/Service';
import { hRemains } from "./control/Constant";
import { Msg } from './control/Msg';
import konsole from './control/Konsole';

class HandlingRemains extends Component {
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
            
            
            
            cremated1: {
                userId: "",
                userSubjectDataId: 0,
                subjectId: 0,
                subResponseData: "string",
                responseId: 0,
            },
            cremated2: {
                userId: "",
                userSubjectDataId: 0,
                subjectId: 0,
                subResponseData: "string",
                responseId: 0,
            },
            funeral1: {
              userId: "",
              userSubjectDataId: 0,
              subjectId: 0,
              subResponseData: "string",
              responseId: 0,
          },
            funeral2: {
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
        konsole.log("sId",spouseDetailsUserId)
        this.setState({
            userId: newuserid,
            SpouseDetailsUserId: spouseDetailsUserId,
            primarymemberDetails:primarymemberDetails
        })
        // this.getsubjectForFormLabelId(newuserid,spouseDetailsUserId);
        this.getsubjectForFormLabelIdForPrimary(newuserid);
        if(spouseDetailsUserId !== 'null'){
            this.getsubjectForFormLabelIdSpouse(spouseDetailsUserId)
        }
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

        konsole.log("OnchengeDataValue",eventValue,"onchangeDataName",eventName,"onchangeDataId",eventId)

        if (eventName == "cremated1") {
            this.setState({
                ...this.state,
                cremated1: {
                  userSubjectDataId: this.state.formlabelData.label461 ? this.state.formlabelData.label461.userSubjectDataId:0,
                    responseId: eventId,
                    subResponseData: eventValue,
                    subjectId: this.state.formlabelData.label461 &&
                              this.state.formlabelData.label461.questionId,
                }
            })

        } else if (eventName == "cremated2") {
            this.setState({
                ...this.state,
                cremated2: {
                  userSubjectDataId: this.state.formlabelDataSpouse.label461 ? this.state.formlabelDataSpouse.label461.userSubjectDataId:0,
                    responseId: eventId,
                    subResponseData: eventValue,
                    subjectId: this.state.formlabelData.label461 &&
                        this.state.formlabelData.label461.questionId,
                }
            })

        }


        if (eventName == "funeral1") {
          this.setState({
              ...this.state,
              funeral1: {
                userSubjectDataId: this.state.formlabelData.label462 ? this.state.formlabelData.label462.userSubjectDataId:0,
                  responseId: eventId,
                  subResponseData: eventValue,
                  subjectId: this.state.formlabelData.label462 &&
                      this.state.formlabelData.label462.questionId,
              }
          })

      } else if (eventName == "funeral2") {
          this.setState({
              ...this.state,
              funeral2: {
                userSubjectDataId: this.state.formlabelDataSpouse.label462 ? this.state.formlabelDataSpouse.label462.userSubjectDataId:0,
                  responseId: eventId,
                  subResponseData: eventValue,
                  subjectId: this.state.formlabelData.label462 &&
                      this.state.formlabelData.label462.questionId,
              }
          })

      }

    };
    



    
    getsubjectForFormLabelIdForPrimary = (newuserid) => {
      konsole.log("primary",newuserid)
      let formlabelData = {};
      this.props.dispatchloader(true);
      // hRemains.formLabelId.map((id, index) => {
      //   let data = [id.id];
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, hRemains.formLabelId, (response) => {
          if (response) {
            const resSubData = response.data.data;

            for (let resObj of resSubData) {
              let label = "label" + resObj.formLabelId;
              formlabelData[label] = resObj.question;
              $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, '', (response) => {
                if (response) {
                  konsole.log("postApiHandling",response)
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
      konsole.log("spouse",spouseUserId)
        let formlabelDataSpouse = {};
        this.props.dispatchloader(true);
        // hRemains.formLabelId.map((id, index) => {
        //     let data = [id.id];
            $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, hRemains.formLabelId, (response) => {
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
                                            this.props.dispatchloader(false);
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
        // });
    };

    handlesubmit = () => {
        // let inputdata = JSON.parse(JSON.stringify(this.state));

        let cremated1 = this.state.cremated1;

        let cremated2 = this.state.cremated2;
        let funeral1 = this.state.funeral1;
        let funeral2 = this.state.funeral2;
        if (this.state.SpouseDetailsUserId !== 'null'){
            cremated1["userId"] = this.state.userId;
            cremated2["userId"] = this.state.SpouseDetailsUserId;
            funeral1["userId"] = this.state.userId;
            funeral2["userId"] = this.state.SpouseDetailsUserId;
        }
        else{
            cremated1["userId"] = this.state.userId;
            funeral1["userId"] = this.state.userId;
        }

        let totoalinptary = [];
        let totinptary = [];

        if (this.state.SpouseDetailsUserId !== "null") {
            // totinptary.push(cremated1);
            // totoalinptary.push(cremated2);
            if(cremated1.subjectId!==0 && cremated1.subResponseData!=="" && cremated1.responseId!==0){
              totinptary.push(cremated1);
            }
            if(cremated2.subjectId!==0 && cremated2.subResponseData!=="" && cremated2.responseId!==0){
              totoalinptary.push(cremated2);
            }
            if(funeral1.subjectId!==0 && funeral1.subResponseData!=="" && funeral1.responseId!==0){
              totinptary.push(funeral1);
            }
            if(funeral2.subjectId!==0 && funeral2.subResponseData!=="" && funeral2.responseId!==0){
              totoalinptary.push(funeral2);
            }
            
        } else {
            if(cremated1.subjectId!==0 && cremated1.subResponseData!=="" && cremated1.responseId!==0){
              totinptary.push(cremated1);
            }
            if(funeral1.subjectId!==0 && funeral1.subResponseData!=="" && funeral1.responseId!==0){
              totinptary.push(funeral1);
            }
        }
        this.handleUpdateSubmit(totinptary, this.state.userId);
        if(this.state.SpouseDetailsUserId !== 'null' ){
          this.handleUpdateSubmit(totoalinptary, this.state.SpouseDetailsUserId);
        }
  };
    handleasdSubmit = (totinptary, consumerId) => {
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi(
            "POST",
            $Service_Url.postaddusersubjectdata,
            totinptary,
            (response) => {
                this.props.dispatchloader(false);
                konsole.log("Success res submit" + JSON.stringify(response));
                if (response) {
                                      // alert("Saved Successfully");
                                      if( consumerId == this.state.userId){
                                          this.getsubjectForFormLabelIdForPrimary(this.state.userId);
                                      }
                                      if ( consumerId== this.state.SpouseDetailsUserId) {
                                      this.getsubjectForFormLabelIdSpouse(this.state.SpouseDetailsUserId)
                                      }
                                  } else {
                                      // alert(Msg.ErrorMsg);
                                      this.handleClose();
                                  }
            }
        );
    }

    handleUpdateSubmit = (totoalinptary,consumerId) => {
        let postData = {
            userId: consumerId,
            userSubjects: totoalinptary,
        }
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi(
            "PUT",
            $Service_Url.putSubjectResponse, // + "?userId=" + this.state.userId
            postData,
            (response) => {
                this.props.dispatchloader(false);

                konsole.log("Success res update" + JSON.stringify(response));
                if (response) {
                  // konsole.log("handlingOfRemains",response)
                  // alert("Saved Successfully");
                  if(consumerId == this.state.userId){
                      konsole.log("handlingOfRemains",consumerId)
                      this.getsubjectForFormLabelIdForPrimary(this.state.userId);
                    }
                    if (consumerId == this.state.SpouseDetailsUserId) {
                    konsole.log("handlingOfRemains",consumerId)
                  this.getsubjectForFormLabelIdSpouse(this.state.SpouseDetailsUserId)
                  }
                  this.handleClose();

              } else {
                  // alert(Msg.ErrorMsg);
                  this.handleClose();
              }
            }
        );
    }




    render() {
      konsole.log("spouse data", this.state.formlabelDataSpouse, this.state.SpouseDetailsUserId);
        return (
            <>    
            <style jsx global>{`
            .modal-open .modal-backdrop.show {
                opacity: 0.7;
            }
            // .modal-open .modal-dialog {
            //       position: absolute;
            //       right: 100px;
            //     }
              `}</style>

                <Card.Img variant="Top" className="border" src="/icons/handlingOfRemains.svg" onClick={this.handleShow} />
                            <Card.Body className="p-0 mt-2">

                            <a onClick={this.handleShow}>
                               <div className="border d-flex justify-content-between align-items-center p-2 ">
                            <p className="ms-2">Handling of Remains</p>
                            <div className="border-start">
                 <img
                  className="px-2"
                src="/icons/add-icon.svg"
                alt="Burial Policy"
            />
            </div>
            </div>
            </a>   
            </Card.Body>   

            <Modal
            size={this.state.SpouseDetailsUserId !== "null" ? "lg" : "md"}
            // style={{width:"100%",height:"auto",padding:"0", margin:"0"}}
            show={this.state.show}
            centered
            onHide={this.handleClose}
            animation="false"
            >
            <Modal.Header closeButton closeVariant="white">
                <Modal.Title>Handling of Remains</Modal.Title>
            </Modal.Header>
            <Modal.Body className="">
              <div className="boxBorderStyle mt-4">
                <Row>
                  <Col span={3} lg="3" className='mt-4'>
                  <div> 
                     {this.state.formlabelData.label461 &&
                        this.state.formlabelData.label461.question}</div>

                  <div className='mt-2'>{this.state.formlabelData.label462 && this.state.formlabelData.label462.question}</div>
                  
                  </Col>
                  <Col className=''>
                    <div className='pb-3'>  <Col className="d-flex justify-content-center me-5">
                      {/* <b>  Primary</b> */}<b> {this.state.primarymemberDetails?.memberName}</b>
                      </Col></div>
                 
                  <div clasName=" me-4 mt-4"style={{display:"flex"}}> 
                    {this.state.formlabelData.label461 &&
                      this.state.formlabelData.label461.response.map(
                        (response) => {
                          konsole.log("responseBtnDetails",response)
                          return (
                            <>
                              <Col lg="3" >
                              <Form.Check
                              inline
                              className="left-radio fs-6 "
                              type="radio"
                              id={response.responseId}
                              name="cremated1"
                              label={response.response}
                              value={response.response}
                              onChange={(e) => {
                                this.handleChange(e);
                              }}
                              defaultChecked = {response.checked}
                            />
                              </Col>
                            </>
                          );
                        }
                      )}
                      </div>
                  <div style={{display:"flex"}} className=" mt-3">
                    {this.state.formlabelData.label462 && this.state.formlabelData.label462.response.map((response) => {
                        return (
                         
                        <>
                   
                         
                            <Form.Check
                            inline
                            className="left-radio ms-1 "
                            type="radio"
                            id={response.responseId}
                            name="funeral1"
                            style={{fontsize:"8px"}}
                            label={response.response}
                            value={response.response}
                            onChange={(e) => {
                            this.handleChange(e);
                            }}
                            defaultChecked = {response.checked}
                        />
                            
                        </>
                        );
                    }
                    )}</div>
                  </Col>
                  {/* <Col style={ this.state.SpouseDetailsUserId !== "null" ? {borderLeft:"1px solid black"} : {}}> */}
                  <Col>
                  <div className='pb-3'> {
                      this.state.SpouseDetailsUserId !== "null" &&
                      <Col className="d-flex justify-content-center"><b> {this.state.primarymemberDetails?.spouseName}</b></Col>
                    }</div>
                  <div  cllassName=" mt-4"style={{display:"flex"}}> 
                    {
                    this.state.SpouseDetailsUserId !== "null" &&
                    this.state.formlabelDataSpouse.label461 && this.state.formlabelDataSpouse.label461.response.map((response) => {
                        return (
                        <>
                            <Col   lg="3">
                            <Form.Check
                            inline
                            className="left-radio fs-6"
                            type="radio"
                            id={response.responseId}
                            name="cremated2"
                            label={response.response}
                            value={response.response}
                            onChange={(e) => {
                            this.handleChange(e);
                            }}
                            defaultChecked = {response.checked}
                        />
                            </Col>
                        </>
                        );
                    }
                    )}</div>
                  <div className='mt-3'>
                  {
                    this.state.SpouseDetailsUserId !== "null" &&
                    this.state.formlabelDataSpouse.label462 &&
                      this.state.formlabelDataSpouse.label462.response.map(
                        (response) => {
                          return (
                            <>
                          
                              <Form.Check
                              inline
                              className="left-radio fs-6 ms-1"
                              type="radio"
                              id={response.responseId}
                              name="funeral2"
                              label={response.response}
                              value={response.response}
                              onChange={(e) => {
                                this.handleChange(e);
                              }}
                              defaultChecked = {response.checked}
                            />
                            
                     {/* <Col /> */}
                            </>
                          );
                        }
                        
                      )
                      }
                  </div>
                  </Col>
                </Row>
                {/* <Row className="mt-4" >
        <Row>
                  <Col lg="3"></Col>
                  <Col lg="9">
                    <Row>
                  <Col className="justify-content-start">
                    
                     
                    </Col>
                   
                    </Row></Col>
                  </Row>


                  <Row className='mt-2'>
                    <Col lg="3">
                    
                    </Col>
                   
                   
                  </Row>
                  
           
                  <Row  className='mt-3 '  style={{display:"flex"}}>
                    <Col span={6} lg={3} >
                   
                    </Col>
                    <Col >
                     <div style={{display:"flex"}}>
                    
                    </div></Col>
                    <Col >
                     <div style={{display:"flex"}}>
                    
                      </div></Col>
                   
                    
                  </Row>
                </Row> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(HandlingRemains);

















// import React, { Component } from 'react'
// import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap"
// import { connect } from "react-redux";
// import { SET_LOADER } from "./Store/Actions/action";
// import { $Service_Url } from "./network/UrlPath";
// import {$AHelper} from './control/AHelper';
// import { $CommonServiceFn } from './network/Service';
// import { hRemains } from "./control/Constant";
// import { Msg } from './control/Msg';
// import konsole from './control/Konsole';

// class HandlingRemains extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             show: false,
//             userId: "",
//             SpouseDetailsUserId: "",
//             formlabelData: [],
//             formlabelDataSpouse: [],
            
            
//             cremated1: {
//                 userId: "",
//                 userSubjectDataId: 0,
//                 subjectId: 0,
//                 subResponseData: "string",
//                 responseId: 0,
//           