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
import Select from "react-select";
import { $CommonServiceFn } from "./network/Service";
import { $Service_Url } from "../components/network/UrlPath";
import { SET_LOADER } from "./Store/Actions/action";
import { connect } from "react-redux";
import { Msg } from "./control/Msg";
import Other from "./asssets/Other";
import konsole from "./control/Konsole";
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";
import { $AHelper } from "./control/AHelper";
import { isNotValidNullUndefile } from "./Reusable/ReusableCom";

export class Veteran extends Component {
  static contextType = globalContext;

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      logginUserId: sessionStorage.getItem("loggedUserId") || "",
      warTimePeriodList: [],
      DischargeTypes: [],
      updateVeteran: false,
      userId: this.props.userId,
      activeServiceDuration: "",
      warzone: "",
      wartimePeriod: "",
      dischargeTypeId: "",
      dischargeTypeIdForCancel:"",
      wartimePeriodForCancel:"",
      activityTypeId: "2",
      veteranId: "",
      natureId: "",
    };
    this.checkboxRef = React.createRef();
    this.warTimeRef = React.createRef();
    this.dischargeRef = React.createRef();
  }

  componentDidMount() {
    let newuserid = this.props.userId || "";
    let logginUserId = sessionStorage.getItem("loggedUserId") || "";
    this.setState({
      userId: newuserid,
      logginUserId: logginUserId,
    });

    this.fetchDischargeType();
    this.fetchWarTimePeriodList();
    // if (this.props.isVeteranChecked) {
    this.fetchVeteranData();
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userId !== this.props.userId) {
      this.setState({
        userId: this.props.userId,
      });
    }
    if (prevProps.isVeteranChecked !== this.props.isVeteranChecked || prevProps.userId !== this.props.userId) {
      // if (this.props.isVeteranChecked) {
      this.fetchVeteranData();
      // }
    }
  }

  fetchDischargeType = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getDischargeType,
      this.state,
      (response) => {
        this.props.dispatchloader(false);
        if (response) {
          this.setState({
            ...this.state,
            DischargeTypes: response.data.data,
          });
        }
      }
    );
  };

  fetchWarTimePeriodList = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getWarTimePeriodPath,
      this.state,
      (response) => {
        this.props.dispatchloader(false);
        if (response) {
          this.setState({
            ...this.state,
            warTimePeriodList: response.data.data,
          });
        }
      }
    );
  };

  fetchVeteranData = () => {
    if(!this.props.userId) {
      this.props.checkVeternProfile(false);
      this.setState({
        updateVeteran: false,
      });
      return;
    }
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getVeteranData + this.props.userId,
      "",
      (response, errorRes) => {
        // konsole.log("response", response)
        this.props.dispatchloader(false);
        if (response) {
          konsole.log("fetch response data", response);
          let disy = response.data.data.dischargeTypeId.toString();
          this.setState({
            activeServiceDuration: response.data.data.activeServiceDuration,
            warzone: response.data.data.warzone,
            wartimePeriod: response.data.data.wartimePeriod,
            dischargeTypeId: disy,
            wartimePeriodForCancel:response.data.data.wartimePeriod,
            dischargeTypeIdForCancel:disy,
            natureId: response.data.data.veteranId,
            veteranId: response.data.data.veteranId,
            updateVeteran: true,
          });
          this.props.checkVeternProfile(true);
        } else if (errorRes) {
          this.props.checkVeternProfile(false);
          this.setState({
            updateVeteran: false,
          });
        }
      }
    );
  };

  handleClose = (check) => {
    console.log('showshow',this.state.updateVeteran,this.state.show)
    this.setState({
      show: !this.state.show,
    });
    if(check==true && this.state.updateVeteran==true){
      console.log('thishhhshs',this.state.wartimePeriod,this.state.wartimePeriodForCancel)
      this.setState({
        wartimePeriod:this.state.wartimePeriodForCancel,
        dischargeTypeId:this.state.dischargeTypeIdForCancel
      })
      this.fetchVeteranData()
    }
  };

  handleShow = () => {
    this.fetchWarTimePeriodList();
    if (this.checkboxRef.current.checked) {
      this.setState({
        show: !this.state.show,
        wartimePeriod : "",
        warzone : "",
        activeServiceDuration:"",
        dischargeTypeId:""
      });
    }
  };

  handleVeteranSubmit = () => {
    let activeServiceDuration =
      this.state.activeServiceDuration == ""
        ? null
        : this.state.activeServiceDuration;
    let warzone = this.state.warzone == "" ? null : this.state.warzone;

    konsole.log("warzonePeriod", warzone, activeServiceDuration)

    const PostData = {
      userId: this.state.userId,
      activeServiceDuration: activeServiceDuration,
      warzone: warzone,
      wartimePeriod: this.state.wartimePeriod,
      dischargeTypeId: this.state.dischargeTypeId,
      activityTypeId: this.state.activityTypeId,
      createdBy: this.state.logginUserId,
    };
    konsole.log("validation api", PostData);
    if (this.validate()) {
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi(
        "POST",
        $Service_Url.postVeteranByUserid,
        PostData,
        (response) => {
          this.props.dispatchloader(false);
          if (response) {
            let responseVeteran = response.data.data;
            AlertToaster.success("Veteran details saved successfully");
            //   alert("Information saved successfully");
            this.checkboxRef.current.checked = true;
            this.props.checkVeternProfile(this.checkboxRef.current.checked);
            if (this.state.wartimePeriod == "999999") {
              this.warTimeRef.current.saveHandleOther(
                responseVeteran.veteranId
              );
            }

            if (this.state.dischargeTypeId == "999999") {
              this.dischargeRef.current.saveHandleOther(
                responseVeteran.veteranId
              );
            }
            this.fetchVeteranData();
            this.handleClose();
          } else {
            // alert(Msg.ErrorMsg);
            this.toasterAlert(Msg.ErrorMsg, "Warning");
          }
        }
      );
    }
  };

  handleUpdateVeteran = () => {
    let activeServiceDuration =
      this.state.activeServiceDuration == ""
        ? null
        : this.state.activeServiceDuration;
    let warzone = this.state.warzone == "" ? null : this.state.warzone;
    this.props.dispatchloader(true);
    const updateData = {
      veteranId: this.state.veteranId,
      userId: this.state.userId,
      activeServiceDuration: this.state.activeServiceDuration,
      warzone: this.state.warzone,
      wartimePeriod: this.state.wartimePeriod,
      dischargeTypeId: this.state.dischargeTypeId,
      updatedBy: this.state.logginUserId,
    };
    // const PostData = {
    //   userId: this.state.userId,
    //   activeServiceDuration: activeServiceDuration,
    //   warzone: warzone,
    //   wartimePeriod: this.state.wartimePeriod,
    //   dischargeTypeId: this.state.dischargeTypeId,
    //   activityTypeId: this.state.activityTypeId,
    //   createdBy: this.state.logginUserId,
    // };

    $CommonServiceFn.InvokeCommonApi(
      "PUT",
      $Service_Url.updateVeteranData,
      updateData,
      (response) => {
        this.props.dispatchloader(false);
        if (response) {
          AlertToaster.success("Veteran details updated successfully");

          let responseVeteran = response.data.data;
          if (this.state.wartimePeriod == "999999") {
            this.warTimeRef.current.saveHandleOther(responseVeteran.veteranId);
          }
          if (this.state.dischargeTypeId == "999999") {
            this.dischargeRef.current.saveHandleOther(
              responseVeteran.veteranId
            );
          }
          this.handleClose();
        } else {
          // alert(Msg.ErrorMsg);
          this.toasterAlert(Msg.ErrorMsg, "Warning");
        }
      }
    );
  };

  handleactiveServiceDuration = (event) => {
    const radioName = event.target.name;
    const radioValue = event.target.value;
    konsole.log(radioValue);
    if (radioName == "activeServiceDuration" && radioValue == "Yes") {
      this.setState({ ...this.state, [radioName]: "Yes" });
    } else {
      this.setState({ ...this.state, [radioName]: "No" });
    }
  };

  handleWarZone = (event) => {
    const radioName = event.target.name;
    const radioValue = event.target.value;
    // konsole.log(event.target.name);
    if (radioName == "warzone" && radioValue == "Yes") {
      this.setState({ ...this.state, [radioName]: "Yes" });
    } else {
      this.setState({ ...this.state, [radioName]: "No" });
    }
  };

  handleDeleteVeteran = () => {
    let deleteData = {
      veteranId: this.state.veteranId,
      userId: this.props.userId,
      deletedBy: this.state.logginUserId,
    };
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "DELETE",
      $Service_Url.deleteVeteranByUserId,
      deleteData,
      (response) => {
        AlertToaster.success("Veteran details deleted successfully.");

        this.props.dispatchloader(false);
        konsole.log("veteran delete response", response);
        this.setState({
          updateVeteran: false,
        });
        this.handleClose();
        this.resetState();
        this.checkboxRef.current.checked = false;
        this.props.checkVeternProfile(this.checkboxRef.current.checked);
      }
    );
  };

  validate = () => {
    konsole.log("dischargeTypeIddd", this.state.activeServiceDuration, this.state.warzone)
    let nameError = "";
    if ((this.state.warzone == "")) {
      nameError = "please choose war zone";
    }
    if (this.state.activeServiceDuration == "") {
      nameError = "Please choose active service";
    }
    if (this.state.dischargeTypeId == "") {
      nameError = "Discharge Type cannot be blank";
    }
    if (this.state.wartimePeriod == "") {
      nameError = "War time cannot be blank";
    }

    if (nameError) {
      //   alert(nameError);
      this.toasterAlert(nameError, "Warning");
      return false;
    }
    return true;
  };

  resetState = () => {
    this.setState({
      activeServiceDuration: "",
      warzone: "",
      wartimePeriod: "",
      dischargeTypeId: "",
      natureId: "",
      veteranId: "",
    });
  };

  toasterAlert(text, type) {
    this.context.setdata({ open: true, text: text, type: type });
  }

  render() {
    // konsole.log("state", this.state);

    let wartimePeriodOptionsSelected = {};
    let DischargeTypeSelected = {};
    if (this.state.wartimePeriod !== "999999") {
      wartimePeriodOptionsSelected =
        this.state.warTimePeriodList[this.state.wartimePeriod - 1] || 0;
    } else {
      wartimePeriodOptionsSelected =
        this.state.warTimePeriodList[this.state.warTimePeriodList.length - 1] ||
        0;
    }

    if (this.state.dischargeTypeId !== "999999") {
      DischargeTypeSelected =
        this.state.DischargeTypes[this.state.dischargeTypeId - 1] || 0;
    } else {
      DischargeTypeSelected =
        this.state.DischargeTypes[this.state.DischargeTypes.length - 1] || 0;
    }
    konsole.log("veteran", this.state);
    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0;
          }
        `}</style>
        <span className="d-flex align-items-center" >
        {this.props.label}
          <div key="checkboxvet" className="d-flex align-items-center" >
            <Form.Check
              className={`${this.state.updateVeteran == true ? "chekbox-backgrn-color right-chebox-with-theme-color " : "right-checkbox"} m-0 p-0`}
              // className="right-checkbox chekbox-backgrn-color"
              type="checkbox"
              id="checkboxvet"
              // label={this.props.label}
              ref={this.checkboxRef}
              onClick={this.handleShow}
              checked={this.state.updateVeteran}
              disabled={this.state.updateVeteran}
            />
            {this.props.isVeteranChecked && this.state.updateVeteran && (
              <span className="ms-2 cursor-pointer" onClick={this.handleClose}>
                <img
                  src="/icons/pen-icon.svg"
                  width="22px"
                  className="img-thumbnail rounded-circle"
                  style={{marginBottom:"3px"}}
                />
              </span>
            )}
          </div>
        </span>
        <Modal
          show={this.state.show}
          size="md"
          centered
          onHide={()=>this.handleClose(true)}
          animation="false"
          backdrop="static"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Veteran</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Col xs md="12">
                <Select
                  className="w-100 custom-select"
                  onChange={(value) => {
                    this.setState({ wartimePeriod: value.value });
                  }}
                  options={this.state.warTimePeriodList}
                  value={wartimePeriodOptionsSelected}
                  // placeholder="War Time Period...."
                  placeholder={$AHelper.mandatory("War Time Period....")}
                />
              </Col>
            </Row>
            {this.state.wartimePeriod == "999999" && (
              <Row className="mb-3">
                <Col xs md="12">
                  <Other
                    othersCategoryId={33}
                    userId={this.state.userId}
                    dropValue={this.state.wartimePeriod}
                    ref={this.warTimeRef}
                    natureId={this.state.natureId}
                  />
                </Col>
              </Row>
            )}
            <Row className="mb-3">
              <Col xs md="12">
                <Select
                  className="w-100 custom-select"
                  onChange={(value) => {
                    this.setState({ dischargeTypeId: value.value });
                  }}
                  options={this.state.DischargeTypes}
                  value={DischargeTypeSelected}
                  // placeholder="Discharge Type"
                  placeholder={$AHelper.mandatory("Discharge Type")}
                />
                {/* <Form.Control type="text" defaultValue="Discharge type" placeholder="Discharge type" /> */}
              </Col>
            </Row>
            {this.state.dischargeTypeId == "999999" && (
              <Row className="mb-3">
                <Col xs md="12">
                  <Other
                    othersCategoryId={32}
                    userId={this.state.userId}
                    dropValue={this.state.dischargeTypeId}
                    ref={this.dischargeRef}
                    natureId={this.state.natureId}
                  />
                </Col>
              </Row>
            )}
            <Row className="mb-3">
              <Col xs sm="10" lg="12" >
                <label className="" id="veternActiveId">
                  {this.state.wartimePeriod == '6' ? (
                   $AHelper.mandatoryAsteriskAtStart("Did you serve at least (90 Day) in active service ?")
                  ) : (
                 $AHelper.mandatoryAsteriskAtStart("Did you serve at least (1 Day) in active service ?")
                  )}
                </label>
                <div className="d-flex justify-content-start align-items-center">
                  <div
                    key="checkbox8"
                    className="me-4 pe-3 mb-0 d-flex align-items-center"
                  >
                    <Form.Check
                      className="chekspace"
                      type="radio"
                      id="checkbox8"
                      value="Yes"
                      label="Yes"
                      name="activeServiceDuration"
                      onChange={(event) =>
                        this.handleactiveServiceDuration(event)
                      }
                      checked={
                        this.state.activeServiceDuration == "Yes" ? true : false
                      }
                    />
                  </div>
                  <div
                    key="checkbox9"
                    className="me-4 pe-3 mb-0 d-flex align-items-center"
                  >
                    <Form.Check
                      className="chekspace"
                      type="radio"
                      id="checkbox8"
                      value="No"
                      label="No"
                      name="activeServiceDuration"
                      onChange={(event) =>
                        this.handleactiveServiceDuration(event)
                      }
                      checked={
                        this.state.activeServiceDuration == "No" ? true : false
                      }
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs sm="10" lg="9">
                <label className="" id="veternWarId">
                  {/* Did you serve in war zone ? */}
                  {$AHelper.mandatoryAsteriskAtStart("Did you serve in war zone ?")}
                </label>
                <div className="d-flex justify-content-start align-items-center">
                  <div
                    key="checkbox8"
                    className="me-4 pe-3 mb-0 d-flex align-items-center"
                  >
                    <Form.Check
                      className="chekspace"
                      type="radio"
                      id="checkbox8"
                      label="Yes"
                      value="Yes"
                      name="warzone"
                      onChange={(event) => this.handleWarZone(event)}
                      checked={this.state.warzone == "Yes" ? true : false}
                    />
                  </div>
                  <div
                    key="checkbox9"
                    className="me-4 pe-3 mb-0 d-flex align-items-center "
                  >
                    <Form.Check
                      className="chekspace"
                      type="radio"
                      id="checkbox8"
                      value="No"
                      label="No"
                      name="warzone"
                      onChange={(event) => this.handleWarZone(event)}
                      checked={this.state.warzone == "No" ? true : false}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            {this.state.updateVeteran && (
              <Button className="theme-btn" onClick={this.handleDeleteVeteran}>
                {" "}
                Delete{" "}
              </Button>
            )}
            <Button
              className="theme-btn"
              onClick={
                this.state.updateVeteran
                  ? this.handleUpdateVeteran
                  : this.handleVeteranSubmit
              }
            >
              {this.state.updateVeteran ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({
      type: SET_LOADER,
      payload: loader,
    }),
});

export default connect("", mapDispatchToProps)(Veteran);
