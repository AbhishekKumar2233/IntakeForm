import React, { Component, createRef } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, } from "react-bootstrap";
import { $CommonServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import { financialAdvisorMoreInfo } from "./control/Constant";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { accountantMoreinfo } from "./control/Constant";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import { globalContext } from "../pages/_app"
import { $AHelper } from "./control/AHelper";
import { deceasedOrIncapcitatedId } from "./control/Constant";
import { isNotValidNullUndefile } from "./Reusable/ReusableCom";

export class AccountantMoreInfo extends Component {
  static contextType = globalContext
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      formlabelData: {},
      SpouseDetails: [],
      restrictAddProfessional: "false",
      updateCaregiverSuitabilty: false,
      fName: "",
      userId: "",
      spouseUserId:"",
      dontAccoutant: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      news: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,

        subResponseData: "string",
        responseId: 0,
      },
      updateCaregiverSuitabilty: false,
      offerbillpay: true,
      files: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      pay: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      offer: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
    };

    this.checkboxRef = React.createRef();
  }
  handleClose = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  handleShow = (checked) => {
    if (checked) {
      this.setState({
        show: !this.state.show,
      })
    }
  };

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let spouseId = sessionStorage.getItem("spouseUserId")
    this.getsubjectForFormLabelId(newuserid);
    this.setState({
      userId: newuserid,
      spouseUserId : spouseId
    });
    this.fetchmemberbyID(newuserid);
    this.FetchFamilyMembers(newuserid);
  }

  componentDidUpdate(prevProp, prevState) {
    if((this.props.profMemberCount > 0 || this.props.forceUncheck == true) && this.state.restrictAddProfessional === "true" && this.state.formlabelData?.label993?.userSubjectDataId != undefined) {
      this.setState({restrictAddProfessional: "false"});
      this.handleUpdateSubmitSeconde(this.state.formlabelData?.label993?.userSubjectDataId ?? 0, false, 387, 197);
    }
  }

  handleChange = (e) => {
    const eventId = e.target.id;
    const eventValue = e.target.value;
    const eventChecked = e.target.checked;
    const eventName = e.target.name;
    konsole.log("eventIdeventId", eventId, eventValue, eventName)



    if (eventName == "news") {
      this.setState({
        ...this.state,
        news
          : {
          userSubjectDataId: this.state.formlabelData.label683 ? this.state.formlabelData.label683.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label683 &&
            this.state.formlabelData.label683.questionId
        }
      })
      if (eventValue == 'No') {
        this.setState({ offerbillpay: false })
      } else {
        this.setState({ offerbillpay: true })
      }
    }

    else if (eventName == "files") {
      konsole.log("abaabbabababbababbabab", eventId, eventValue)
      this.setState({
        ...this.state,
        files: {
          userSubjectDataId: this.state.formlabelData.label684 ? this.state.formlabelData.label684.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label684 && this.state.formlabelData.label684.questionId
        }

      })
    }
    else if (eventName == "pay") {
      this.setState({
        ...this.state,
        pay: {
          userSubjectDataId: this.state.formlabelData.label685 ? this.state.formlabelData.label685.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label685 && this.state.formlabelData.label685.questionId
        }
      })
    }
    else if (eventName == "offer") {
      this.setState({
        ...this.state,
        offer: {
          userSubjectDataId: this.state.formlabelData.label686 ? this.state.formlabelData.label686.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label686 && this.state.formlabelData.label686.questionId
        }

      })
    }
    else if (eventName == "dontAccoutant") {
      if (this.props.financMoreInfocheckboxdisable == true) {
        this.toasterAlert('Accountant already available.', 'Warning')
        return;
      }
      this.setState({
        ...this.state,
        dontAccoutant: {
          userSubjectDataId: this.state.formlabelData?.label993?.userSubjectDataId ?? 0,
          responseId: eventId,
          subResponseData: eventChecked,
          subjectId: this.state.formlabelData.label993 && this.state.formlabelData.label993.questionId
        }
      })
      this.handleShow(eventChecked);
    }
  };

  handlesubmit = () => {
    let inputdata = JSON.parse(JSON.stringify(this.state));
    let dontAccoutant = {
      userSubjectDataId: this.state.dontAccoutant?.userSubjectDataId,
      subjectId: this.state.dontAccoutant?.subjectId,
      subResponseData: this.state.dontAccoutant?.subResponseData,
      responseId: this.state.dontAccoutant?.responseId,
      userId: this.state.userId,
    };

    let news = {
      userSubjectDataId: this.state.news?.userSubjectDataId,
      subjectId: this.state.news?.subjectId,
      subResponseData: this.state.news?.subResponseData,
      responseId: this.state.news?.responseId,
      userId: this.state.userId,
    };
    let files = {
      userSubjectDataId: this.state.files?.userSubjectDataId,
      subjectId: this.state.files?.subjectId,
      subResponseData: this.state.files?.subResponseData,
      responseId: this.state.files?.responseId,
      userId: this.state.userId,
    };
    let pay = {
      userSubjectDataId: this.state.pay?.userSubjectDataId,
      subjectId: this.state.pay?.subjectId,
      subResponseData: this.state.pay?.subResponseData,
      responseId: this.state.pay?.responseId,
      userId: this.state.userId,
    };
    let offer = {
      userSubjectDataId: this.state.offer?.userSubjectDataId,
      subjectId: this.state.offer?.subjectId,
      subResponseData: this.state.offer?.subResponseData,
      responseId: this.state.offer?.responseId,
      userId: this.state.userId,
    };

    let totinptary = [];

    // totinptary.push(news);
    // totinptary.push(files);
    // totinptary.push(pay);
    // totinptary.push(offer);
    if (dontAccoutant.subjectId !== 0 && dontAccoutant.subResponseData !== "" && dontAccoutant.responseId !== 0) {
      totinptary.push(dontAccoutant);
    }
    if (news.subjectId !== 0 && news.subResponseData !== "" && news.responseId !== 0) {
      totinptary.push(news);
    }
    if (offer.subjectId !== 0 && offer.subResponseData !== "" && offer.responseId !== 0) {
      totinptary.push(offer);
    }
    if (files.subjectId !== 0 && files.subResponseData !== "" && files.responseId !== 0) {
      totinptary.push(files);
    }
    if (pay.subjectId !== 0 && pay.subResponseData !== "" && pay.responseId !== 0) {
      totinptary.push(pay);
    }
    // konsole.log(JSON.stringify(inputdata));
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi( "POST", $Service_Url.postaddusersubjectdata,  totinptary, (response) => {
        this.props.dispatchloader(false);
        // konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          this.handleClose();
          this.getsubjectForFormLabelId(this.state.userId);
          // alert("Saved Successfully");
          // this.props.handlenonretireproppopShow();
        } else {
          // alert(Msg.ErrorMsg);
          this.handleClose();
        }
      }
    );
  };




  handleUpdateSubmit = () => {
    let inputdata = JSON.parse(JSON.stringify(this.state));

    let dontAccoutant = {
      userSubjectDataId: this.state.dontAccoutant?.userSubjectDataId,
      subjectId: this.state.dontAccoutant?.subjectId,
      subResponseData: this.state.dontAccoutant?.subResponseData,
      responseId: this.state.dontAccoutant?.responseId,
      userId: this.state.userId,
    };


    let news = {
      userSubjectDataId: this.state.news?.userSubjectDataId,
      subjectId: this.state.news?.subjectId,
      subResponseData: this.state.news?.subResponseData,
      responseId: this.state.news?.responseId,
      userId: this.state.userId,
    };
    let files = {
      userSubjectDataId: this.state.files?.userSubjectDataId,
      subjectId: this.state.files?.subjectId,
      subResponseData: this.state.files?.subResponseData,
      responseId: this.state.files?.responseId,
      userId: this.state.userId,
    };
    let pay = {
      userSubjectDataId: this.state.pay?.userSubjectDataId,
      subjectId: this.state.pay?.subjectId,
      subResponseData: this.state.pay?.subResponseData,
      responseId: parseInt(this.state.pay?.responseId),
      userId: this.state.userId,
    };
    let offer = {
      userSubjectDataId: this.state.offer?.userSubjectDataId,
      subjectId: this.state.offer?.subjectId,
      subResponseData: this.state.offer?.subResponseData,
      responseId: this.state.offer?.responseId,
      userId: this.state.userId,
    };




    let totinptary = [];

    // totinptary.push(news);
    // totinptary.push(files);
    // totinptary.push(pay);
    // totinptary.push(offer);

    if (dontAccoutant.subjectId !== 0 && dontAccoutant.subResponseData !== "" && dontAccoutant.responseId !== 0) {
      totinptary.push(dontAccoutant);
    }

    if (news.subjectId !== 0 && news.subResponseData !== "" && news.responseId !== 0) {
      totinptary.push(news);
    }
    if (offer.subjectId !== 0 && offer.subResponseData !== "" && offer.responseId !== 0) {
      totinptary.push(offer);
    }
    if (files.subjectId !== 0 && files.subResponseData !== "" && files.responseId !== 0) {
      totinptary.push(files);
    }
    if (pay.subjectId !== 0 && pay.subResponseData !== "" && pay.responseId !== 0) {
      totinptary.push(pay);
    }

    let updatePostData = {
      userId: this.state.userId,
      userSubjects: totinptary
    }
    konsole.log("updatePostDataupdatePostDataupdatePostDataupdatePostData", JSON.stringify(updatePostData))
    // konsole.log(JSON.stringify(inputdata));
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putSubjectResponse, updatePostData, (response) => {
        this.props.dispatchloader(false);
        konsole.log('res of acccountant more info update', response)
        if (response) {
          this.handleClose();
          this.getsubjectForFormLabelId(this.state.userId);
          // alert("Saved Successfully");
          // this.props.handlenonretireproppopShow();
        } else {
          this.handleClose();
          // alert(Msg.ErrorMsg);
        }
      }
    );
  };


  FetchFamilyMembers = (userid) => {
    userid = userid || this.state.userId;
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFamilyMembers + userid, "", (response) => {
      konsole.log("accountant more info", response);
      konsole.log("Success res" + JSON.stringify(response));
      // konsole.log(response.data.data);
      this.props.dispatchloader(false);
      if (response) {
        const responseData=$AHelper.deceasedNIncapacititedFilterFun(response?.data?.data)

        
        // const responseFilter=responseData.length >0 ? responseData?.filter(({memberStatusId})=>!deceasedOrIncapcitatedId.includes(memberStatusId)):[]
        konsole.log('response filter of deceased',responseData,response)
        this.setState({
          ...this.state,
          AllFamilyMembers: responseData,
        });
        this.setState({
          SpouseDetails: responseData.filter((v, j) => v.relationshipTypeId == 1),
        });
        this.setState({
          ChildDetails: responseData.filter((v, j) => v.relationshipTypeId == 2),
        });
      } else {
        // alert(Msg.ErrorMsg);
        this.toasterAlert(Msg.ErrorMsg, "Warning")
      }
    }
    );
  };


  getsubjectForFormLabelId = (newuserid) => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, accountantMoreinfo, (response) => {
      if (response) {
        konsole.log("sujectName", JSON.stringify(response.data.data));
        this.props.dispatchloader(false);
        const responseData = response.data.data;

        for (let resObj of responseData) {
          let label = "label" + resObj.formLabelId;
          formlabelData[label] = resObj.question;
          $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, "", (response) => {
            if (response) {
              if (response.data.data.userSubjects.length !== 0) {
                this.setState({
                  updateCaregiverSuitabilty: true,
                })
                let responseData = response.data.data.userSubjects[0];
                konsole.log("datashownatcaregiver at accoutant", responseData.questionId, responseData);
                this.props.dispatchloader(true);
                for (let i = 0; i < formlabelData[label].response.length; i++) {
                  if (formlabelData[label].response[i].responseId === responseData.responseId) {
                    this.props.dispatchloader(false);
                    if (responseData.responseNature == "Radio") {
                      formlabelData[label].response[i]["checked"] = true;
                      formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                    }
                    else if (responseData.responseNature == "Text") {
                      formlabelData[label].response[i]["response"] = responseData.response;
                      formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                    }
                    else if (responseData.responseNature == "CheckBox") {
                      if (responseData.questionId == "197") {
                        this.setState({restrictAddProfessional: responseData.response});
                        formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                      }
                    }
                  }
                }
                this.setState({ formlabelData: formlabelData });
              }
              this.props.dispatchloader(false);
            }
          })
          konsole.log("sujectName shoerjiowehtu", JSON.stringify(response.data.data));
          this.setState({ formlabelData: formlabelData });
        }
        // this.setState({
        //   formlabelData: formlabelData,
        // });
      } else {
        // alert();
        // Msg.ErrorMsg
      }
    }
    );
    this.setState({
      formlabelData: formlabelData,
    });
  };



  handleChangeCheckbox = (event) => {
    if (this.props.financMoreInfocheckboxdisable == true) {
      this.toasterAlert('Accountant already available.', 'Warning')
      return;
    }
    const eventId = event.target.id;
    const questionId = event.target.getAttribute("data-questionId");
    const userSubjectDataId = event.target.getAttribute("data-userSubjectDataId");
    const eventChecked = event.target.checked;
    konsole.log("usersubjectCheckbox", userSubjectDataId, eventChecked, eventId, questionId)
    this.handleUpdateSubmitSeconde(userSubjectDataId, eventChecked, eventId, questionId);
  };

  handleUpdateSubmitSeconde = async (userSubjectDataId, subResponseData, responseId, questionId) => {
    let inputData = {
      userId: this.state.userId,
      userSubjects: [{
        userSubjectDataId: userSubjectDataId,
        subjectId: questionId,
        subResponseData: subResponseData,
        responseId: responseId,
      }],
    };

    konsole.log("bookkeeeper response json", inputData);
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putSubjectResponse, inputData, (response, error) => {
      this.props.dispatchloader(false);
      this.getsubjectForFormLabelId(this.state.userId)
    }
    );
  };




  fetchmemberbyID = (userid) => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFamilyMemberbyID + userid, "", (response) => {
      if (response) {
        konsole.log('response getFamilyMemberbyID',response)
        this.setState({
          userId: response.data.data.member.userId,
          fName: response.data.data.member.fName,
        });
      }
    }
    );
  };

  toasterAlert(test, type) {
    this.context.setdata($AHelper.toasterValueFucntion(true, test, type))
  }


  render() {

    let formlabelDatalabel684 = this.state.formlabelData?.label684?.response;
    let formlabelDatalabel685 = this.state.formlabelData?.label685?.response;
    if (this.state.spouseUserId == "null" && this.state.formlabelData?.label684 !== undefined) {
      formlabelDatalabel684 = this.state.formlabelData?.label684?.response?.filter((item) => item?.responseId !== 157 && item?.responseId !== 158)
    }
    if (this.state.spouseUserId == "null" && this.state.formlabelData?.label685) {
      formlabelDatalabel685 = this.state.formlabelData?.label685?.response?.filter((item) => item?.responseId !== 160 && item?.responseId !== 161)
    }

    konsole.log("formlabelDatalabel576 accounatnat", this.state, this.props, this.checkboxRef)
    return (
      <>
        <style jsx global>{` .modal-open .modal-backdrop.show {   opacity: 0.5 !important; }`}</style>

        <Form.Check className="ms-2" type="checkbox" name="dontAccoutant"
          // disabled={this.props.financMoreInfocheckboxdisable}
          onChange={(e) => (this.state.restrictAddProfessional === "false") ? this.handleChange(e) : this.handleChangeCheckbox(e)} data-userSubjectDataId={this.state.formlabelData?.label993?.userSubjectDataId ?? 0} data-questionId="197" id="387" checked={this.state.restrictAddProfessional === "true"} />

        <Modal
          show={this.state.show}
          size="md"
          centered
          onHide={this.handleClose}
          animation="false"
          id="accountantMoreInfo"
          backdrop="static"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>More Info</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-3 pt-4">
            <Form.Group as={Row} className="mb-3">
              <Col xs sm="12" lg="10" id="accountantMoreInfo1">
                <p> {this.state.formlabelData.label683 && this.state.formlabelData.label683.question}{" "}</p>
                <div className="d-flex align-items-center justify-content-start mt-1">
                  {this.state.formlabelData.label683 &&
                    this.state.formlabelData.label683.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Check
                              inline
                              className="chekspace"
                              type="radio"
                              id={response.responseId}
                              name="news"
                              label={response.response}
                              value={response.response}
                              onChange={(e) => this.handleChange(e)}
                              defaultChecked={response.checked}
                            />
                          </>
                        );
                      }
                    )}
                </div>
              </Col>
            </Form.Group>
            {(this.state.offerbillpay == true) &&
              <Form.Group as={Row} className="mb-3">
                <Col xs sm="12" lg="10" id="accountantMoreInfo4">
                  <p>{this.state.formlabelData.label686 && this.state.formlabelData.label686.question}{" "} </p>
                  <div className="d-flex align-items-center mt-1">
                    {this.state.formlabelData.label686 &&
                      this.state.formlabelData.label686.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Check
                                inline
                                className="chekspace"
                                type="radio"
                                id={response.responseId}
                                name="offer"
                                label={response.response}
                                value={response.response}
                                onChange={(e) => this.handleChange(e)}
                                defaultChecked={response.checked}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Form.Group>}

              
              {(isNotValidNullUndefile(this.state.spouseUserId) && this.state.spouseUserId !='null'  ) && <>
            <Form.Group as={Row} className="mb-3" >
              <Col xs sm="7" lg="10" id="accountantMoreInfo2">
                <p>{this.state.formlabelData.label684 &&this.state.formlabelData.label684.question}{" "}</p>
                <div className="d-flex align-items-center justify-content-between flex-wrap mt-1">
                  {this.state.formlabelData.label684 &&
                    formlabelDatalabel684?.map(
                      (response) => {
                        // konsole.log("responsetresponse1", response)
                        return (
                          <>
                            <Form.Check
                              inline
                              className="left-radio"
                              type="radio"
                              name="files"
                              label={(response.responseId == 156) ? this.state.fName : (response.responseId == 157) ? this.state?.SpouseDetails[0]?.fName : "Joint"}
                              value={response.response}
                              id={response.responseId}
                              onChange={(e) => this.handleChange(e)}
                              defaultChecked={response.checked}
                            />
                          </>
                        );
                      }
                    )}
                </div>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col xs sm="7" lg="10" id="accountantMoreInfo3">
                <p>{this.state.formlabelData.label685 &&this.state.formlabelData.label685.question}{" "}</p>
                <div className="d-flex align-items-center justify-content-between flex-wrap mt-1">
                  {this.state.formlabelData.label685 &&
                    formlabelDatalabel685?.map(
                      (response) => {
                        konsole.log("responsetresponse", response)
                        return (
                          <>
                            <Form.Check
                              inline
                              className="left-radio"
                              type="radio"
                              name="pay"
                              label={(response.responseId == 159) ? this.state.fName : (response.responseId == 160) ? this.state?.SpouseDetails[0]?.fName : "Joint"}
                              value={response.response}
                              id={response.responseId}
                              onChange={(e) => this.handleChange(e)}
                              defaultChecked={response.checked}
                            />
                          </>
                        );
                      }
                    )}
                </div>
              </Col>
            </Form.Group>
            </>}
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button className="theme-btn" onClick={this.handleUpdateSubmit}> Save</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect( mapStateToProps, mapDispatchToProps)(AccountantMoreInfo);
