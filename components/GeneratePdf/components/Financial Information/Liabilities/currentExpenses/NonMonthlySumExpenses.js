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

import { $Service_Url } from "../../../../../network/UrlPath";
import { $CommonServiceFn } from '../../../../../network/Service';
import konsole from "../../../../../control/Konsole";
import CurrencyInput from "react-currency-input-field";


export class NonMonthlySumExpenses extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      nonMonthlyExpensesList: [],
      expenseFreqId: 5
    };
  }

  componentDidMount() {
    this.getMonthlyExpenses();
  }

  getMonthlyExpenses = () => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserMonthlyExpensesPath + this.props.memberId, "", (response) => {
      if (response) {
        let NonMonthlyExpenses = response.data.data.filter(v => { return v.expenseFreqId === this.state.expenseFreqId});
        konsole.log("monthly cosdf", NonMonthlyExpenses);
        this.setState({
          nonMonthlyExpensesList: NonMonthlyExpenses,
        })
      }
    })
  }
 
  render() {

    return (
      <table className="container">
        <tr>
          <th className="col-5 thd ps-1" colSpan="2"> Non-Monthly Expenses </th>
        </tr>
        <tr>
          <th className="col-5 thd ps-1" colSpan="2">
            Example: Property Taxes, etc.
          </th>
        </tr>
        <tr>
          <th className="col-3 thd ps-1">Description</th>
          <th className="col-2 thd ps-1">Amount</th>
        </tr>

        {
          this.state.nonMonthlyExpensesList.length > 0 && this.state.nonMonthlyExpensesList.map((exp,index) => {
            return(
            <tr>
              <td  type="text" style={{wordBreak:"break-word"}} className="tdd ps-1"  name="expenseName" >{exp?.expense}</td>
              <td className="tdd">
                <CurrencyInput prefix="$" className="w-100 border-0" name="expenseAmt"  value={exp?.expenseAmt}/>
              </td>
            </tr>              
            )
          })
        }

      </table>
    );
  }
}

export default NonMonthlySumExpenses;
