import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col,
  Container,
  Nav,
  Dropdown,
  Collapse,
  Breadcrumb,
} from "react-bootstrap";
import Select from "react-select";
import CurrencyInput from "react-currency-input-field";



import { connect } from 'react-redux';


import { $Service_Url } from "../../../../../network/UrlPath";
import { $CommonServiceFn } from '../../../../../network/Service';

// import { SET_LOADER } from '../components/Store/Actions/action'
// import { $Service_Url } from "../components/network/UrlPath";
// import { $CommonServiceFn } from '../components/network/Service';



export class MonthlyExpenses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      userId: (props.memberId !== undefined && props.memberId !== '') ? props.memberId : '',
      totgrossamnt: "0",
      ExpenseTypes: [],
      ExpenseDetails: []
    };
  }

  componentDidMount() {
    this.setState({
        userId: (this.props.memberId !== undefined && this.props.memberId !== '') ? this.props.memberId : '',
    },()=>{
      this.fetchexpensetypes()
    })

    
}

  fetchexpensetypes = () => {
  
    
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getexpensetypesbyFreqId+"/4",
      "", (response) => {
        // debugger
        
        if (response) {
          this.setState({
            ...this.state,
            ExpenseTypes: response.data.data,
            expenseAmt: 0,
          });

          let tempincdetstate = [];
          for (let inctype = 0; inctype < response.data.data.length; inctype++) {
              tempincdetstate.push({
                  expenseId: response.data.data[inctype].value,
                  expenseAmt: 0,
              })

          }
          this.setState({
              ...this.state,
              ExpenseDetails: tempincdetstate
          },() => this.getMonthlyExpenses());


        }

      })
  }


  getMonthlyExpenses = () => {

     let userId = this.state.userId;
     let ExpenseDetailsObj = this.state.ExpenseDetails;
     
     $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserMonthlyExpensesPath + userId, "", (response) => {
       if (response) {
       
         let expenseDataObj = response.data.data;
         for (let income = 0; income < ExpenseDetailsObj.length; income++) {
           for (let res = 0; res < expenseDataObj.length; res++) {
             if (ExpenseDetailsObj[income].expenseId == expenseDataObj[res].expenseId) {
               
               ExpenseDetailsObj[income].expenseAmt = expenseDataObj[res].expenseAmt;
               

             }
           }
         }
        

         let tempExpenses = 0;
         for (let teminc = 0; teminc < ExpenseDetailsObj.length; teminc++) {
           tempExpenses += Number(ExpenseDetailsObj[teminc].expenseAmt) || 0
         }
         this.setState({
           ...this.state,
           ExpenseDetails: ExpenseDetailsObj,
           totgrossamnt: tempExpenses,
         })

        
       }
     })


  }
  render() {
    const addresstype = [{ value: "Address Type", label: "Address Type" }];
    const State = [{ value: "State", label: "State" }];
    const country = [{ value: "country", label: "country" }];

    return (
      <>
        {/* <a onClick={this.handleShow}>
          <img className="px-2" src="/icons/add-icon.svg" alt="Monthly Expenses" />
        </a> */}

        <div>
          
         <div>
         {(this?.props?.refrencePage !="SummaryDoc") && 
            <Row>
              Please summarize your currently monthly expenses, including
              expenses you may incur only once a year, or occasionally(eg,
              property taxes, prescription drug costs, etc)
            </Row>
         }
            <Row className="mt-4 p-0">
              <Col lg="8">
                <Table bordered>
                  <thead>
                    <tr className="border">
                      <th colSpan={2} className="text-start border-0 w-75 fw-bold">
                        Total
                      </th>
                      <th className="p-0 border text-center"><CurrencyInput prefix="$" className="border-0" value={this.state.totgrossamnt} disabled/> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.ExpenseTypes.length > 0 && (
                      this.state.ExpenseTypes.map((exp, index) => {
                        let expenseAmt = this.state.ExpenseDetails.length > 0 ? this.state.ExpenseDetails[index].expenseAmt : 0;
                        return (
                          <tr>
                            <td colSpan={2}>{exp.label}</td>

                            <td className="p-0">
                              <CurrencyInput prefix="$" className="border-0" name="expenseAmt" value={expenseAmt} onValueChange={(value,name) => { this.handleDynmaicInputchange(value, name, index) }}/>
                            </td>
                          </tr>

                        )
                      })
                    )}

                  </tbody>
                </Table>
              </Col>
            </Row>
            </div>
         
        </div>
      </>
    );
  }
}



export default MonthlyExpenses;

// export default MonthlyExpenses;
