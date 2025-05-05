import React, { Component } from "react";
import {
  Button,
  Modal,
  Table,
  Form,
  Tab,
  Row,
  Col,
  Container,
  Nav,
  Dropdown,
  Collapse,
  Breadcrumb,
} from "react-bootstrap";
import { connect } from "react-redux";
import konsole from "./control/Konsole";
import LongTermCareInsurancePolicyForm from "./LongTermCareInsurancePolicyForm";
import { $CommonServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import { SET_LOADER } from "./Store/Actions/action";
import AlertToaster from "./control/AlertToaster";
import { $AHelper } from "./control/AHelper";
import { globalContext } from "../pages/_app";

class LongTermCareInsurancePolicy extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      primaryMemberUserId: "",
      spouseDetailUserId: "",
      primarymemberDetails: {},
    };
  }

  componentDidMount() {
    // debugger
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let spouseDetailUserId = sessionStorage.getItem("spouseUserId") || "";
    let primarymemberDetails = JSON.parse(
      sessionStorage?.getItem("userDetailOfPrimary")
    );
    this.setState({
      primaryMemberUserId: newuserid,
      spouseDetailUserId: spouseDetailUserId,
      primarymemberDetails: primarymemberDetails,
    });
    let url = window.location.href;

    if (url.indexOf("query") != -1) {
      newuserid = url.split("query=")[1];
      this.setState({ userId: newuserid });
    }
    // konsole.log(JSON.stringify("Props " + JSON.stringify(this.props)))
  }

  handleClose = () => {
    this.context.setPageTypeId(null)
    this.setState({
      show: !this.state.show,
    });
  };

  handleShow = () => {
    this.context.setPageTypeId(20)
    this.setState({
      show: !this.state.show,
    });
  };

  handleClose1 = () => {
    // AlertToaster.success("Data saved successfully");
    this.setState({
      show: !this.state.show,
    });
  };

  render() {
    konsole.log(
      "primarymemberDetails",
      this.state.primarymemberDetails.spouseName
    );
    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.5 !important;
          }
        `}</style>
        <Col xs md="4" onClick={this.handleShow} className="cursor-pointer mb-3">
          <div className="d-flex align-items-center border py-1">
            <div className="flex-grow-1 ms-2 border-end">
              Long-Term Care Insurance Policies
            </div>
            <div className="cursor-pointer">
              <a>
                <img
                  className="px-2"
                  src="/icons/add-icon.svg"
                  alt="health Insurance"
                />
              </a>
            </div>
          </div>
        </Col>

        {this.state.show == true &&
          this.state.primarymemberDetails.spouseName == null ? (
          <LongTermCareInsurancePolicyForm
            userId={this.state.primaryMemberUserId}
            show={this.state.show}
            showLongTerm={this.handleShow}
          />
        ) : (
          ""
        )}

        {this.state.primarymemberDetails.spouseName !== null ? (
          <Modal
            show={this.state.show}
            centered
            onHide={this.handleClose}
            animation="false"
            size="md"
            backdrop="static"
            enforceFocus={false}
          >
            <Modal.Header closeButton closeVariant="white">
              <Modal.Title>Long-Term Care Insurance Policy</Modal.Title>
            </Modal.Header>
            <Modal.Body className="">
              <div className="person-content">
                <Form.Group as={Row} className="ms-1 mt-3" >
                  <Col xs sm="6" lg="6" className='m-0 p-0 d-flex align-items-center mb-2'>
                    <button className="white-btn" style={{ width: "185px" }}>
                      {/* Primary Member */}
                      {$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.memberName)}
                    </button>
                    <LongTermCareInsurancePolicyForm
                      userId={this.state.primaryMemberUserId}
                    />
                  </Col>
                  {this.state.spouseDetailUserId !== "null" && (
                    <Col
                      xs
                      sm="6"
                      lg="6"
                      className="m-0 p-0 d-flex justify-content-end align-items-center mb-2"
                    >
                      <button className="white-btn" style={{ width: "185px" }}>
                        {/* Spouse */}
                        {$AHelper.capitalizeAllLetters(this.state.primarymemberDetails?.spouseName)}
                      </button>
                      <LongTermCareInsurancePolicyForm
                        userId={this.state.spouseDetailUserId}
                      />
                    </Col>
                  )}
                </Form.Group>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button className="theme-btn" onClick={this.handleClose1}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        ) : (
          ""
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LongTermCareInsurancePolicy);
