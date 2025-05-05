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
import CurrencyInput from "react-currency-input-field";

import { connect } from "react-redux";

import { SET_LOADER } from "../components/Store/Actions/action";
import { $Service_Url } from "../components/network/UrlPath";
import { $CommonServiceFn } from "../components/network/Service";
import konsole from "./control/Konsole";
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";
import useUserIdHook from "./Reusable/useUserIdHook";

export class MonthlyExpenses extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      userId: "",
      totgrossamnt: "0",
      disable:false,
      ExpenseTypes: [],
      ExpenseDetails: [],
      toUpdate: false,
    };
  }

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    this.setState({
      userId: newuserid,
    });

    this.fetchexpensetypes();
  }

  fetchexpensetypes = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getexpensetypesbyFreqId + "/4",
      "",
      (response) => {
        // debugger
        this.props.dispatchloader(false);
        if (response) {
          this.setState({
            ...this.state,
            ExpenseTypes: response.data.data,
            expenseAmt: 0,
          });

          let tempincdetstate = [];
          for (
            let inctype = 0;
            inctype < response.data.data.length;
            inctype++
          ) {
            tempincdetstate.push({
              expenseId: response.data.data[inctype].value,
              expenseAmt: 0,
            });
          }
          this.setState(
            {
              ...this.state,
              ExpenseDetails: tempincdetstate,
            },
            () => this.getMonthlyExpenses()
          );
        }
      }
    );
  };

  getMonthlyExpenses = () => {
    let userId = this.state.userId;
    let ExpenseDetailsObj = this.state.ExpenseDetails;
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getUserMonthlyExpensesPath + userId,
      "",
      (response) => {
        if (response) {
          this.props.dispatchloader(true);
          let expenseDataObj = response.data.data;
          let setToUpdate = false;

          for (let income = 0; income < ExpenseDetailsObj.length; income++) {
            for (let res = 0; res < expenseDataObj.length; res++) {
              if (
                ExpenseDetailsObj[income].expenseId ==
                expenseDataObj[res].expenseId
              ) {
                // ExpenseDetailsObj[income].expenseAmt =
                //   expenseDataObj[res].expenseAmt;
                ExpenseDetailsObj[income] = expenseDataObj[res];
                this.props.dispatchloader(false);
                setToUpdate = true;
              }
            }
          }
          konsole.log("expenses with data", ExpenseDetailsObj);
          let tempExpenses = 0;
          for (let teminc = 0; teminc < ExpenseDetailsObj.length; teminc++) {
            tempExpenses += Number(ExpenseDetailsObj[teminc].expenseAmt) || 0;
          }
          this.setState({
            ...this.state,
            ExpenseDetails: ExpenseDetailsObj,
            totgrossamnt: tempExpenses,
            toUpdate: setToUpdate,
          });

          this.props.dispatchloader(false);
        }
      }
    );
  };

  handleDynmaicInputchange = (value, name, index) => {
    event.preventDefault();
    // debugger
    let tempincomedet = [...this.state.ExpenseDetails];
    tempincomedet[index][name] = value;
    // konsole.log("here expenses", tempincomedet);
    this.setState({
      ...this.state,
      ExpenseDetails: tempincomedet,
    });

    let tempExpenses = 0;
    for (let teminc = 0; teminc < tempincomedet.length; teminc++) {
      tempExpenses += Number(tempincomedet[teminc].expenseAmt) || 0;
    }

    this.setState({
      ...this.state,
      totgrossamnt: tempExpenses,
    });
  };

  // handleSaveExpenses = () => {
  //   this.setState({disable:true})
  //   let reqcnt = 0;
  //   let rescnt = 0;
  //   let boolres = true;
  //   for (let lpcnt = 0; lpcnt < this.state.ExpenseDetails.length; lpcnt++) {
  //     reqcnt++;

  //     let totalinput = [
  //       {
  //         userId: this.state.userId,
  //         expenseId: this.state.ExpenseDetails[lpcnt].expenseId,
  //         expenseAmt: this.state.ExpenseDetails[lpcnt].expenseAmt,
  //         expenseFreqId: 4,
  //       },
  //     ];

  //     // konsole.log(JSON.stringify(totalinput));
  //     this.setState({disable:true})
  //     this.props.dispatchloader(true);
  //     $CommonServiceFn.InvokeCommonApi(
  //       "POST",
  //       $Service_Url.postMonthlyExpenses, // + "?userId=" + this.state.userId
  //       totalinput,
  //       (response) => {
  //         rescnt++;
  //         this.props.dispatchloader(false);
  //         konsole.log("Success res" + JSON.stringify(response));

  //         if (response) {
  //         } else {
  //           boolres = false;
  //         }
  //         if (this.state.ExpenseDetails.length == rescnt) {
  //           if (boolres) {
  //             this.setState({disable:false})
  //             AlertToaster.success("Data saved successfully");
  //             // alert("Saved Successfully");
  //             this.props.handlemonthexppopShow();
  //             this.getMonthlyExpenses();
  //           } else {
  //             // alert("Unable to process your request. Please contact support team.");
  //             this.toasterAlert(
  //               "Unable to process your request. Please contact support team.",
  //               "Warning"
  //             );
  //           }
  //         }
  //       }
  //     );
  //   }
  // };

  handleSaveExpenses = () => {
    this.setState({disable:true})
    console.log("expenseDatacall" , this.state.ExpenseDetails);

    const dataObj = this.state.ExpenseDetails;
    const method = this.state.toUpdate != true ? "POST" : "PUT";
    const url = method == "POST" ? $Service_Url.postMonthlyExpenses : $Service_Url.putUserExpense;
    const loggedUserId = useUserIdHook()?._loggedInUserId;
    
    if(this.state.toUpdate != true) {
      dataObj.forEach(item => {
        item.userId = this.state.userId;
        item.expenseFreqId = 4;
        item.createdBy = loggedUserId;
      })
    } else {
      dataObj.forEach(item => {
        item.updatedBy = loggedUserId;
      })
    }

    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(method, url, dataObj, (res, err) => {
      this.setState({disable:false})
      this.props.dispatchloader(false);
      if(res) {
        konsole.log("expenseDataupdate", res);
        AlertToaster.success("Data saved successfully");
        this.props.handlemonthexppopShow();
        this.getMonthlyExpenses();
      } else {
        konsole.log("expenseDataupdatefail", err);
        this.toasterAlert("Unable to process your request. Please contact support team.", "Warning");
      }
    })
  }

  toasterAlert(text, type) {
    this.context.setdata({ open: true, text: text, type: type });
  }

  render() {
    const addresstype = [{ value: "Address Type", label: "Address Type" }];
    const State = [{ value: "State", label: "State" }];
    const country = [{ value: "country", label: "country" }];

    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0;
          }
        `}</style>
        {/* <a onClick={this.handleShow}>
          <img className="px-2" src="/icons/add-icon.svg" alt="Monthly Expenses" />
        </a> */}

        <Modal
          size="lg"
          show={this.props.show}
          centered
          onHide={this.props.handlemonthexppopShow}
          animation="false"
          backdrop="static"
          enforceFocus={false}
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Monthly Expenses </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
             <Col className="fw-bold">
                Please summarize your currently monthly expenses, including
                expenses you may incur only once a year, or occasionally(eg,
                property taxes, prescription drug costs, etc)
             </Col>
            </Row>
            <Row className="mt-3">
              <Col lg="8">
                <Table bordered>
                  <thead>                  
                  </thead>
                  <tbody>
                    {this.state.ExpenseTypes.length > 0 &&
                      this.state.ExpenseTypes.map((exp, index) => {
                        let expenseAmt =
                          this.state.ExpenseDetails.length > 0
                            ? this.state.ExpenseDetails[index].expenseAmt
                            : 0;
                        return (
                          <tr>
                            <td colSpan={2}>{exp.label}</td>

                            <td className="p-0">
                              <CurrencyInput
                                prefix="$"
                                className="border-0"
                                name="expenseAmt"
                                value={expenseAmt}
                                allowNegativeValue={false}
                                onValueChange={(value, name) => {
                                  this.handleDynmaicInputchange(
                                    value,
                                    name,
                                    index
                                  );
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                  <tr className="border">
                      <th colSpan={2} className="text-start border-0 w-75 fw-bold ">
                        Total
                      </th>
                      <th className="p-0 border text-center">
                        <CurrencyInput
                          prefix="$"
                          allowNegativeValue={false}
                          className="border-0"
                          value={this.state.totgrossamnt}
                          disabled
                        />{" "}
                      </th>
                    </tr>
                </Table>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button
                style={{ backgroundColor: "#76272b", border: "none" }}
                className="theme-btn" onClick={this.handleSaveExpenses}
                disabled={this.state.disable == true ? true : false}
              >
                Save
              </Button>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyExpenses);

// export default MonthlyExpenses;
