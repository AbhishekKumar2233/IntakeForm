import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb } from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { connect } from 'react-redux';
import { $Service_Url } from "../../../../network/UrlPath";
import { $CommonServiceFn } from '../../../../network/Service';
import { getApiCall, isNotValidNullUndefile, isNullUndefine } from "../../../../Reusable/ReusableCom";



import moment from "moment";
import konsole from "../../../../control/Konsole";
import { $AHelper } from "../../../../control/AHelper";

export class TaxSumInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
      userId: (props.memberId !== null && props.memberId !== '') ? props?.memberId : '',
      taxYears: [{ taxYear: moment().subtract(1, 'years').toDate(), adjustedGrossIncome: null, taxableIncome: null, totalTaxAmount: null, marTaxRate: null, effTaxRate: null}],
      taxYear: "",
      grossincome: 0,
      taxableIncome: 0,
      totalTaxAmount: 0,
      marTaxRate: 0,
      effTaxRate: 0,
    };
  }

  componentDidMount() {
    if (this.state.userId !== '') {
      this.setState({
        userId: this.props.memberId
      });
      konsole.log("tax information on value");
      this.getTaxInformation(this.props.userId)
     
      konsole.log("tax information on value");
    }
}

getTaxInformation = async (newuserid) => {
           let userId = newuserid || this.state.userId;

           const _resultOfGetTaxInfo=await getApiCall('GET',$Service_Url.getTaxInfo + userId + "/0",'');
           konsole.log("_resultOfGetTaxInfo",_resultOfGetTaxInfo)
           if(_resultOfGetTaxInfo !='err' && _resultOfGetTaxInfo?.userTax?.length>0){
            let taxYear = null;
            const userTaxData =_resultOfGetTaxInfo.userTax[0]

            if(isNotValidNullUndefile(userTaxData.taxYear) &&  userTaxData.taxYear !== 'Invalid date'){
              taxYear = $AHelper.getDateFromString(userTaxData.taxYear);
              taxYear = new Date(taxYear);
            }
            const taxYears = _resultOfGetTaxInfo?.userTax?.map((tax) => {
              return {
                taxableIncome: tax.taxableIncome,
                totalTaxAmount: tax.totalTaxAmount,
                marTaxRate: tax.marTaxRate,
                effTaxRate: tax.effTaxRate,
                taxYear: new Date(tax.taxYear),
                adjustedGrossIncome: tax.adjustedGrossIncome,
            
              }
            });
            if(taxYears?.length  == 2){
              this.setState(({showAddInput:false}))
            }
           this.setState({ taxYears: taxYears });
           }
};

  render() {
    let effectivetaxrate = ''

    let effTaxRateRule = (this.state.totalTaxAmount / this.state.grossincome) * 100
    const effTaxRateAtTwoDecimalRule = Number(parseFloat(effTaxRateRule).toFixed(2))
    effectivetaxrate = (this.state.totalTaxAmount !== undefined && effTaxRateAtTwoDecimalRule !== Infinity && !isNaN(effTaxRateAtTwoDecimalRule)) ? effTaxRateAtTwoDecimalRule : ''
    const stateVal = this.state

    var currentDate = new Date();

    const lastYearDate = moment(currentDate).subtract(1, 'years').toDate();

    const taxlistData = this.state.taxYears

    return (
      <>
        <div>
        {/* <p className='Heading2 mt-5 mb-1 border-0 generate-pdf-main-color'>Tax Information:</p> */}
        <ul className="pt-4 ps-3"><li className="head-2">Tax Information</li></ul> 
          <div>
            <Row>
              <Col>
                <Table bordered>
                <thead>
                    <tr>
                      <th>Tax Year</th>
                      <th>Adjusted Gross Income</th>
                      <th>Taxable Income</th>
                      <th>Total Taxes</th>
                      <th>Marginal Tax Rate</th>
                      <th>Effective Tax Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                  {taxlistData.map((year, index) => (
                    <tr key={index}>
                    <td className="p-0 text-center">
                        <DatePicker className="border-0" selected={year.taxYear ?? lastYearDate} name="taxYear" dateFormat="yyyy" maxDate={moment().toDate()}
                        placeholderText="YYYY" showYearPicker autoComplete="off" disabled/>
                      </td>
                 
                      <td className="p-0 text-center">
                      {isNotValidNullUndefile (year.adjustedGrossIncome) ?<CurrencyInput prefix="$" className="text-center border-0" value={year.adjustedGrossIncome} name="grossincome" />:"-"}
                      </td>
                 
                      <td className="p-0 text-center">
                      { isNotValidNullUndefile(year.taxableIncome) ? <CurrencyInput prefix="$" className="text-center border-0" value={year.taxableIncome} name="taxableIncome"/>:"-"}
                      </td>
                  
                      <td className="p-0 text-center"> 
                      {isNotValidNullUndefile(year.totalTaxAmount) ? <CurrencyInput prefix="$" className="text-center border-0" value={year.totalTaxAmount} name="totalTaxAmount"/>:"-"}
                      </td>
                 
                      <td className="p-0 text-center">
                      {isNotValidNullUndefile(year.marTaxRate) ? <CurrencyInput  suffix="%" className="text-center border-0" value={year?.marTaxRate}  name="marTaxRate" />:"-" }
                      </td>
               
                      <td className="p-0 text-center">
                      {isNotValidNullUndefile(year.effTaxRate) ? <CurrencyInput suffix="%" className="text-center border-0" value={year.effTaxRate} name="effTaxRate"/>:"-"}
                      </td>
                    </tr>
                        ))}
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

export default TaxSumInformation;