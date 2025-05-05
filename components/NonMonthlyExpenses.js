import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, } from "react-bootstrap";
import { $Service_Url } from "../components/network/UrlPath";
import { $CommonServiceFn } from "../components/network/Service";
import CurrencyInput from "react-currency-input-field";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import { globalContext } from "../pages/_app";
import { $AHelper } from "./control/AHelper";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import AlertToaster from "./control/AlertToaster";
import { isNotValidNullUndefile } from "./Reusable/ReusableCom";

export class NonMonthlyExpenses extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      initialShow: true,
      show: false,
      expenseId: "",
      disable: false,
      userExpenseId: "",
      expenseName: "",
      expenseAmt: "",
      expenseFreqId: 5,
      nonmonthlyexpenses: [],
      logginUserId: "",
    };
  }

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    this.setState(
      {
        userId: newuserid,
        logginUserId: sessionStorage.getItem("loggedUserId") || "",
        // },
        // () => {
        //   this.getNonMonthlyExpenses();
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.show != true && this.state.show == true && this.state.initialShow == true) {
      this.setState({ initialShow: false })
      this.getNonMonthlyExpenses();
    }
  }

  getNonMonthlyExpenses = () => {
    let userId = this.state.userId;
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserMonthlyExpensesPath + userId, "", (response) => {
      if (response) {
        konsole.log("ggg", response.data.data);
        let result = response.data.data;
        let filterdata = result.filter(function (a) {
          return a.expenseFreqId == 5;
        });

        this.setState({
          ...this.state,
          nonmonthlyexpenses: filterdata,
        });
      }
    }
    );
  };

  handleInputChange = (value, name) => {
    this.setState({
      ...this.state,
      [name]: value,
    });
  };


  handleInputChangeExpense = (event) => {
    event.preventDefault();
    let nameValue = $AHelper.capitalizeFirstLetter(event?.target?.value);
    this.setState({ expenseName: nameValue })
  };


  validation = (type) => {
    if (this.state.expenseName == "" && this.state.expenseAmt == "") {
      this.toasterAlert("No Field should be empty", "Warning");
    } else if (this.state.expenseName == "" && this.state.expenseAmt !== "") {
      this.toasterAlert("Enter yout description", "Warning");
    } else if (this.state.expenseAmt == undefined || (this.state.expenseAmt == "" && this.state.expenseName !== "")
    ) {
      this.toasterAlert("Enter your Amount", "Warning");
    }
    // else if(this.state.expenseAmt !== null && this.state.expenseName == ""){
    //   this.handleNonMonthlyExpenses();
    // }
    else {
      this.handleNonMonthlyExpenses(type);
    }
  };

  handleNonMonthlyExpenses = (type) => {
    if (this.state.userExpenseId == undefined || this.state.userExpenseId == "") {
      let Postnonexpense = { expenseName: this.state.expenseName };
      this.state.disable = true
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postNonMonthlyExpenses, Postnonexpense, (response, erroData) => {
        this.props.dispatchloader(false);
        if (response) {
          let expenseId = response.data.data.expenseId;
          let postNonExpenseData = [
            {
              userId: this.state.userId,
              expenseId: expenseId,
              expenseAmt: this.state.expenseAmt,
              expenseFreqId: this.state.expenseFreqId,
            },
          ];
          this.state.disable = true
          this.props.dispatchloader(true);
          $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postMonthlyExpenses, postNonExpenseData, (response, errorData) => {
            this.props.dispatchloader(false);
            this.getNonMonthlyExpenses();
            if (response) {
              this.setState({ disable: false })
              AlertToaster.success("Data saved successfully");
              // this.handleClose();
              if (type == "Add") {
                this.handleClose()
              } else {
                this.handleClear()
              }
            } else {
              this.toasterAlert(Msg.ErrorMsg, "Warning");
              this.setState({ disable: false })
            }
          }
          );
        } else {
          this.toasterAlert(Msg.ErrorMsg, "Warning");
        }
      }
      );
    } else {
      let Postnonexpense = {
        expenseName: this.state.expenseName,
        expenseId: this.state.expenseId,
      };

      this.state.disable = true
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putNonMonthlyExpenses, Postnonexpense, (response, errorData) => {
        this.props.dispatchloader(false);
        if (response) {
          this.state.disable = false
          let postNonExpenseData1 = [
            {
              userId: this.state.userId,
              expenseId: this.state.expenseId,
              expenseAmt: this.state.expenseAmt,
              expenseFreqId: this.state.expenseFreqId,
              userExpenseId: this.state.userExpenseId,
              updatedBy: this.state.userId,
              isActive: true,
            },
          ];
          $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUserExpense, postNonExpenseData1, (response) => {
            this.getNonMonthlyExpenses();
            if (response) {
              AlertToaster.success("Data updated successfully");
              this.handleClose()
            } else {
              this.toasterAlert(Msg.ErrorMsg, "Warning");
            }
          }
          );
        } else {
          this.setState({ disable: false })
        }
      }
      );
    }

  };

  updateNonRetirement = (det) => {
    this.setState({
      expenseName: det.expense,
      expenseAmt: det.expenseAmt,
      userExpenseId: det.userExpenseId,
      expenseId: det.expenseId,
    });
  };

  handleClear = () => {
    this.setState({
      ...this.state,
      expenseName: "",
      expenseAmt: "",
      userExpenseId: "",
      expenseId: "",
    });
  };

  handleClose = () => {
    this.context.setPageTypeId(null)
    this.handleClear();
    this.setState({
      show: !this.state.show,
    });
  };

  handleShow = () => {
    this.context.setPageTypeId(27)
    this.setState({
      show: !this.state.show,
    });
  };

  toasterAlert(text, type) {
    this.context.setdata({ open: true, text: text, type: type });
  }

  deleteUserData = async (data, logginUserId) => {
    this.handleClear();
    const req = await this.context.confirm(true, "Are you sure? you want to delete", "Confirmation");
    if (!req) return;
    this.props.dispatchloader(true);

    konsole.log("assetsassets", data);
    let jsonobj = [
      {
        userId: data.userId,
        expenseId: data.expenseId,
        expenseAmt: data.expenseAmt,
        expenseFreqId: data.expenseFreqId,
        userExpenseId: data.userExpenseId,
        updatedBy: logginUserId,
        isActive: false
      }
    ]

    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.deleteNonMonthlyExpense, jsonobj, (res, err) => {
      this.props.dispatchloader(false);
      if (res) {
        konsole.log("resresDelete", res);
        AlertToaster.success("Data Deleted Successfully");
        // this.props.handlenonretireproppopShow();
        this.getNonMonthlyExpenses();
      } else {
        konsole.log("errerre", err);
        this.setState({ disable: false })
      }
    }
    );
  }

  render() {
    konsole.log("sxdcfg", this.state.userExpenseId);
    const addresstype = [{ value: "Address Type", label: "Address Type" }];
    const State = [{ value: "State", label: "State" }];
    const country = [{ value: "country", label: "country" }];

    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {  opacity: 0; }
        `}</style>

        <Col xs md="4" className="cursor-pointer" onClick={this.handleShow}>
          <div className="d-flex align-items-center border py-1">
            <div className="flex-grow-1 ms-2 text-truncate border-end"> Non Monthly Expenses</div>
            <div className="">
              <a><img className="px-2" src="/icons/add-icon.svg" alt="Add Address" /></a>
            </div>
          </div>
        </Col>
        <Modal
          size="md"
          show={this.state.show}
          centered
          onHide={this.handleClose}
          animation="false"
          backdrop="static"
          enforceFocus={false}
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title> Non Monthly Expenses </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col lg={12} className="financialInformationTable">
                <Table bordered>
                  <tbody>
                    <tr className="text-center">
                      <th className="w-75">Description</th>
                      <th className="pt-2 ">Amount</th>
                    </tr>
                    <tr>
                      <td>
                        <Form.Control
                          type="text"
                          className="border-0"
                          value={this.state.expenseName}
                          name="expenseName"
                          id="expenseName"
                          // onChange={(event) => this.setState({ expenseName: event.target.value }) // }
                          onChange={(event) => this.handleInputChangeExpense(event)}
                          placeholder="Please Type Here..."
                        />
                      </td>
                      <td className="">
                        <CurrencyInput
                          prefix="$"
                          className="border-0"
                          name="expenseAmt"
                          value={this.state.expenseAmt}
                          allowNegativeValue={false}
                          onValueChange={(value, name) => {
                            this.handleInputChange(value, name);
                          }}
                          decimalScale="2"
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              {isNotValidNullUndefile(this.state.userExpenseId) ? ("") : (
                <Button className="theme-btn float-end anotherBTn" onClick={() => this.validation("AddMore")} style={{ backgroundColor: "#76272b", border: "none" }} disabled={this.state.disable == true ? true : false}>  Add Another </Button>
              )}
              <Button
                style={{ backgroundColor: "#76272b", border: "none" }}
                className="theme-btn" onClick={() => this.validation("Add")}
                disabled={this.state.disable == true ? true : false}
              >
                {this.state.userExpenseId == undefined || this.state.userExpenseId == "" ? "Save" : "Update"}
              </Button>
            </div>
            <Row className="mt-3">
              <Col lg={12} className="financialInformationTableNew">
                {this.state.nonmonthlyexpenses.length > 0 && (
                  <Table bordered>
                    <tbody>
                      <tr className="">
                        <th>S.No.</th>
                        <th className="">Description</th>
                        <th className="pt-2 ">Amount</th>
                        <th></th>
                      </tr>
                      {this.state.nonmonthlyexpenses.map((det, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td style={{ wordBreak: "break-word" }}>{det.expense || "-"}</td>
                            <td> {det.expenseAmt !== null ? $AHelper.IncludeDollars(det.expenseAmt) : "-"}</td>
                            <td style={{ verticalAlign: "middle" }}>
                              <div className="d-flex justify-content-center gap-2">
                                <div className=' d-flex flex-column align-items-center' onClick={() => this.updateNonRetirement(det)}>
                                  <img className="cursor-pointer mt-0" src="/icons/EditIcon.png" alt=" Mortgages" style={{ width: "20px" }} />
                                </div>
                                <div>
                                  <span style={{ borderLeft: "2px solid #e6e6e6", paddingLeft: "5px", height: "40px", marginTop: "5px" }} className="cursor-pointer mt-1" onClick={() => this.deleteUserData(det, this.state.logginUserId)}>
                                    <img src="/icons/deleteIcon.svg" className="mt-0" alt="g4" style={{ width: "20px" }} />
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(NonMonthlyExpenses);
