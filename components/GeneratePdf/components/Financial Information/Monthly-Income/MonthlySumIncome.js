import React, { Component } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb } from 'react-bootstrap';
import Select from 'react-select';
import CurrencyInput from "react-currency-input-field";
import { connect } from 'react-redux';
import { monthlyIncome } from '../../../../control/Constant';
import {$Service_Url} from '../../../../network/UrlPath'
import {$CommonServiceFn} from '../../../../network/Service'
import {SET_LOADER} from '../../../../Store/Actions/action'
import konsole from '../../../../control/Konsole';
import { Msg } from '../../../../control/Msg';
import { uscurencyFormate } from '../../../../control/Constant';
import { $AHelper } from '../../../../control/AHelper';



export class MonthlyIncome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            spousePension: false,
            percentageValue: "",
            userId: (props?.memberId !== null && props?.memberId !== '')?props?.memberId: '',
            spouseUserId: (props?.spouseId !== null && props?.spouseId !== '') ? props?.spouseId : '',
            IncomeTypes: [],

            IncomeDetailsprimary: [],
            IncomeDetailsspouse: [],

            totgrossamntprimary: 0,
            totrefprojamtprimary: 0,

            totgrossamntspouse: 0,
            totrefprojamtspouse: 0,
            memberspouseDetails: "",
            isWorkingPrimaryCheck:null,
            isWorkingSpouseCheck:null,
            formlabelData: {},
            spouseNetIncome:
            {
              userSubjectDataId: 0,
              subjectId: 0,
              subResponseData: "",
              responseId: 0,
              userId:""
            }  ,
            incomeChange: {
              userId: "",
              userSubjectDataId: 0,
              subjectId: 0,
              subResponseData: "string",
              responseId: 0,
            },
           
        };
    }

    componentDidMount() {
        let memberspouseDetails =JSON.parse(sessionStorage.getItem("userDetailOfPrimary")) || "";
        let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
        let spouseDetailUserId = sessionStorage.getItem("spouseUserId") || "";

        this.setState({
            memberspouseDetails: memberspouseDetails,
            spouseUserId: spouseDetailUserId,
      })
       
            this.fetchincometypes();
            this.fetchUserIncome();
            this.fetchSpouseIncome();
            this.getOccupationbyUserIdForPrimary(newuserid)
            this.getNetIncomeForSpouse(spouseDetailUserId);
            this.getsubjectForFormLabelId(newuserid)
            
       
        if(spouseDetailUserId !== "null"){
            this.getOccupationbyUserIdForSpouse(spouseDetailUserId)
        }
    }

    componentDidUpdate(prevProps, prevState){
        // if(prevProps.memberId !== this.props.memberId){
        //     this.setState({
        //         userId : memberId
        //     },()=>{
        //     })
        // }
        if(prevProps.spouseId !== this.props.spouseId){
            this.setState({
                spouseUserId: this.props.spouseId
            },()=>{
                this.fetchSpouseIncome()
            })
        }
    } 
    getsubjectForFormLabelId = (newuserid) => {
        konsole.log("newUswerId", newuserid);
        let formlabelData = {};
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, monthlyIncome.formLabelId, (response) => {
          this.props.dispatchloader(true)
          if (response) {
            konsole.log(response,"responseresponseresponseresponse")
            this.props.dispatchloader(false)
            const resSubData = response.data.data;
            for (let resObj of resSubData) {
              let label = "label" + resObj.formLabelId;
              formlabelData[label] = resObj.question;
              $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, "", (response) => {
                this.props.dispatchloader(true)
                if (response) {
                  this.props.dispatchloader(false)
                  if (response?.data?.data?.userSubjects?.length > 0) {
                    konsole.log("formlebleotherresponse", response.data.data.userSubjects[0]);
                    let responseData = response.data.data.userSubjects[0];
                    // this.props.dispatchloader(true);
                    for (let i = 0; i < formlabelData[label].response.length; i++) {
                      if (formlabelData[label]?.response[i]?.responseId === responseData?.responseId) {
                        this.props.dispatchloader(false);
                        if (responseData?.responseNature == "Radio") {
                          formlabelData[label].response[i]["checked"] = true;
                          formlabelData[label]["userSubjectDataId"] = responseData?.userSubjectDataId;
                          if (resObj.formLabelId == 916 && responseData?.responseId == 241) {
                            this.setState({
                              spousePension: {
                                ...this.state.spousePension,
                                responseId: responseData?.responseId,
                                userSubjectDataId: responseData?.userSubjectDataId,
                                subjectId: formlabelData[label]?.questionId,
                              },
                            });
                          }
                        } 
                        else if (responseData?.responseNature == "Text") {
                          formlabelData[label].response[i]["response"] = responseData?.response;
                          formlabelData[label]["userSubjectDataId"] = responseData?.userSubjectDataId;
                          if (responseData.questionId === 122) {
                            this.setState({ currency: responseData?.response })
                          }
                          if (responseData.questionId === 232) {
                            this.setState({ anticipatedIncome: responseData.response })
                          }
                        } 
                        else if (responseData?.responseNature == "DropDown") {
                          formlabelData[label].response[i]["selected"] = true;
                          formlabelData[label]["userSubjectDataId"] = responseData?.userSubjectDataId;
                          if (resObj.formLabelId == 917) {
                            this.setState({
                              percentageValue: responseData?.responseId,
                            });
                          }
                        }
                      }
                    }
                  }
                  let refreshpage = true;
                  this.setState({
                    refreshpage: !refreshpage,
                  });
                  this.props.dispatchloader(false);
                }
              }
              );
            }
          } else {
            this.toasterAlert(Msg?.ErrorMsg, "Warning");
          }
        }
        );
        this.setState({
          formlabelData: formlabelData,
        });
      };


    getOccupationbyUserIdForPrimary=(userId)=>{
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getOccupationbyUserId + userId, "", (response,error) => {
          this.props.dispatchloader(true);
                    if (response) {
                      
                        konsole.log("res of occupation", response);
                        let responseData=response?.data?.data
                        konsole.log('responseData',responseData)
                        if(responseData?.length > 0){
                          konsole.log('responseData',responseData)
                          if(userId == responseData[0]?.userId)
                          {
                            this.setState({isWorkingPrimaryCheck:responseData[0]?.isWorking})
                            this.props.dispatchloader(false);
                          }
                         
                          
                        }
                    }else{
                        konsole.log('error of  occupation',error)
                    }
                })
      }



                  getOccupationbyUserIdForSpouse=(userId)=>{
                  $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getOccupationbyUserId + userId, "", (response,error) => {
                   this.props.dispatchloader(true);
                        if (response) {
                      
                        konsole.log("res of occupation", response);
                        let responseData=response?.data?.data
                        konsole.log('responseData',responseData)
                        if(responseData?.length>0){
                          konsole.log('responseData',responseData)
                          if(userId == responseData[0]?.userId)
                          {
                            this.setState({isWorkingSpouseCheck:responseData[0]?.isWorking,})
                            this.props.dispatchloader(false);
                          }
                         
                        }
                    }else{
                        konsole.log('error of  occupation',error)
                    }
                })
    }

    fetchincometypes = () => {
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getincometypes, "", (response) => {
          // debugger
          this.props.dispatchloader(false);
                 if (response) {
            konsole.log(response,"asasasdxsxd")
            this.setState({
              ...this.state,
              IncomeTypes: response?.data?.data,
            });
    
            let tempincdetstate = [];
            let tempincdetstateSpouse = [];
                       for (let inctype = 0; inctype < response?.data?.data?.length > 0 && response?.data?.data?.length; inctype++) {
              tempincdetstate.push({
                incomeTypeId: response.data.data[inctype]?.value,
                grossAmt1: 0,
                retProjAmt1: 0,
              });
    
              tempincdetstateSpouse.push({
                incomeTypeId: response.data.data[inctype]?.value,
                grossAmt2: 0,
                retProjAmt2: 0,
              });
            }
            this.setState({
              ...this.state,
              IncomeDetailsprimary: tempincdetstate,
              IncomeDetailsspouse: tempincdetstateSpouse,
            }, () => this.fetchUserIncome());
          }
        }
        );
      };

    getNetIncomeForSpouse=(spouseId)=>{
    
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + spouseId + `/0/0/154`, "", (response) =>
         {
          this.props.dispatchloader(true)
          if (response) {
            this.props.dispatchloader(false);
            // konsole.log("reposetytyeee",response?.data?.data,this.state.formlabelData);
            const spouseNetIncome=response?.data?.data?.userSubjects;
            const spouseNetIncomeLength=spouseNetIncome?.length;
            // konsole.log("spouseNetIncofererere",spouseNetIncome,response?.data?.data)
            if(spouseNetIncomeLength>0)
            {
              this.setState(
                {
                  netIncomeForSpouse:spouseNetIncome[0].response,
                  spouseuserSubjectData:spouseNetIncome,
                  spouseSubjectDataIdFornetIncome:spouseNetIncome[0].userSubjectDataId,
                  spouseNetIncome : {
                    userSubjectDataId: spouseNetIncome[0].userSubjectDataId,
                    subjectId:spouseNetIncome[0].subjectId,
                    subResponseData: spouseNetIncome[0].response || " ",
                    responseId: spouseNetIncome[0].responseId,
                    userId: spouseId,
                }
                })
            }
              
              }
            })
          }

         fetchUserIncome = () => {
            let userId = this.state.userId;
            let spouseUserId = this.state.spouseUserId;
            let IncomeDetailsprimary = this.state.IncomeDetailsprimary;
            konsole.log("incomeprimary before", IncomeDetailsprimary);
            this.props.dispatchloader(true);
            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserMonthlyIncomePath + this.state.userId, "", (response) => {
              this.props.dispatchloader(true)
              if (response) {
                this.props.dispatchloader(false)
                let IncomeDetailsprimary = this.state.IncomeDetailsprimary;
                let incomeDataObj = response.data.data;
                konsole.log("incomePrimary inside API", IncomeDetailsprimary);
                for (let income = 0; income < IncomeDetailsprimary.length; income++) {
                  for (let res = 0; res < incomeDataObj.length; res++) {
                    if (IncomeDetailsprimary[income].incomeTypeId == incomeDataObj[res].incomeTypeId) {
                      IncomeDetailsprimary[income].grossAmt1 = incomeDataObj[res].grossAmt;
                      IncomeDetailsprimary[income].retProjAmt1 = incomeDataObj[res].retProjAmt;
                      IncomeDetailsprimary[income].userIncomeId = incomeDataObj[res].userIncomeId;
                      konsole.log("incomePrimary inside", IncomeDetailsprimary);
                    }
                  }
                }
                let temptotgross = 0;
                let temptotrefpro = 0;
                for (let teminc = 0; teminc < IncomeDetailsprimary.length; teminc++) {
                  temptotgross += Number(IncomeDetailsprimary[teminc].grossAmt1) || 0;
                  temptotrefpro += Number(IncomeDetailsprimary[teminc].retProjAmt1) || 0;
                }
                this.setState({
                  totgrossamntprimary: temptotgross,
                  totrefprojamtprimary: temptotrefpro,
                  IncomeDetailsprimary: IncomeDetailsprimary,
                });
                this.props.dispatchloader(false);
              }
            }
            );
        
            if (spouseUserId !== "null") {
              $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserMonthlyIncomePath + spouseUserId, "", (response) => {
                this.props.dispatchloader(true)
                if (response) {
                  konsole.log(response,"asasresponse")
                  this.props.dispatchloader(false)
                  let IncomeDetailsspouse = this.state.IncomeDetailsspouse;
                  let incomeDataObj = response.data.data || [];
                  for (let income = 0; income < IncomeDetailsspouse.length; income++) {
                    for (let res = 0; res < incomeDataObj.length; res++) {
                      if (IncomeDetailsspouse[income].incomeTypeId == incomeDataObj[res].incomeTypeId) {
                        IncomeDetailsspouse[income].grossAmt2 = incomeDataObj[res].grossAmt;
                        IncomeDetailsspouse[income].retProjAmt2 = incomeDataObj[res].retProjAmt;
                        IncomeDetailsspouse[income].userIncomeId = incomeDataObj[res].userIncomeId;
                      }
                    }
                  }
                  let temptotgross = 0;
                  let temptotrefpro = 0;
                  for (let teminc = 0; teminc < IncomeDetailsspouse.length; teminc++) {
                    temptotgross += Number(IncomeDetailsspouse[teminc].grossAmt2) || 0;
                    temptotrefpro += Number(IncomeDetailsspouse[teminc].retProjAmt2) || 0;
                  }
                  this.setState({
                    totgrossamntspouse: temptotgross,
                    totrefprojamtspouse: temptotrefpro,
                    IncomeDetailsspouse: IncomeDetailsspouse,
                  });
                  this.props.dispatchloader(false);
                }
              }
              );
            }
          };
   


    hideLastName(memberspouseDetails) {
        konsole.log("Detailssss", memberspouseDetails);
        return memberspouseDetails?.split(" ")[0] || "";
    }

    fetchSpouseIncome = () => {
        if (this.state.spouseUserId !== "") {
            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserMonthlyIncomePath + this.state.spouseUserId, "", (response) => {
                if (response) {
                    let IncomeDetailsspouse = this.state.IncomeDetailsspouse;
                    let incomeDataObj = response.data.data || [];
                    for (let income = 0; income < IncomeDetailsspouse.length; income++) {
                        for (let res = 0; res < incomeDataObj.length; res++) {
                            if (IncomeDetailsspouse[income].incomeTypeId == incomeDataObj[res].incomeTypeId) {
                                IncomeDetailsspouse[income].grossAmt2 = incomeDataObj[res].grossAmt;
                                IncomeDetailsspouse[income].retProjAmt2 = incomeDataObj[res].retProjAmt;
                            }
                        }
                    }
                    let temptotgross = 0;
                    let temptotrefpro = 0;
                    for (let teminc = 0; teminc < IncomeDetailsspouse.length; teminc++) {
                        temptotgross += Number(IncomeDetailsspouse[teminc].grossAmt2) || 0
                        temptotrefpro += Number(IncomeDetailsspouse[teminc].retProjAmt2) || 0
                    }
                    this.setState({
                        totgrossamntspouse: temptotgross,
                        totrefprojamtspouse: temptotrefpro,
                        IncomeDetailsspouse: IncomeDetailsspouse,

                    });
                    this.props.dispatchloader(false);
                }
            })
        }
    }
radioValue = (event) => {
    const radioName = event.target.name;
    const radioValue = event.target.value;
    // konsole.log(event.target.value);
    if (radioName == "spousePension" && radioValue == "Yes") {
        this.setState({ ...this.state, [radioName]: true })
    }
    else {
        this.setState({ ...this.state, [radioName]: false, percentageValue: "" });

    }
}

render() {
    // const percentageOptions = [
    //     { value: "Percentage Value", label: "Percentage Value" },
    //     { value: "100%", label: "100%" },
    //     { value: "75%", label: "75%" },
    //     { value: "50%", label: "50%" },
    //     { value: "Other", label: "Other" },
    // ]
    const percentageOptions = this.state.formlabelData?.label917?.response?.map((map, index) => {
        return { value: map.responseId, label: map.response, };
      }
      );


    const percentageValueObj = this.state.percentageValue !== 0 ? percentageOptions?.filter((filt) => { return filt.value == this.state.percentageValue; }) : "";
    
    return (
         

           <div className="contain">
           {/* <p className='Heading mt-5 mb-1 generate-pdf-main-color'>Monthly Income:</p> */}
           <ul className="pt-4 ps-3"><li className="head-2">Monthly Income</li></ul> 
                <div className="contain">
                    <div className='cc'>
                        <div className='contain mb-3'>

                            
                            <Table bordered className='tblwidth'>
                                <thead className='text-center'>
                                  {(((this.state.isWorkingPrimaryCheck==true || this.state.isWorkingSpouseCheck == true) || (this.state.isWorkingPrimaryCheck==null || this.state.isWorkingSpouseCheck == null) && this.state.spouseUserId !== "null")) &&
                    <tr className="border-0">
                      {(((this.state.isWorkingPrimaryCheck==true || this.state.isWorkingPrimaryCheck==null) && (this.state.isWorkingSpouseCheck == true || this.state.isWorkingSpouseCheck == null)) !== true) && <th className="border-0"></th>}
                      {((this.state.isWorkingSpouseCheck == true && this.state.isWorkingPrimaryCheck==true) || (this.state.isWorkingPrimaryCheck==null)) && (
                        <th className="border-0"></th>
                      )}
                      {(this.state.spouseUserId !== "null" && ((this.state.isWorkingSpouseCheck == false && this.state.isWorkingPrimaryCheck==true) || this.state.isWorkingPrimaryCheck == null) 
                      || ((this.state.isWorkingSpouseCheck == true && this.state.isWorkingPrimaryCheck==false) || this.state.isWorkingSpouseCheck == null)) && <th className="border-0"></th>}
                      {((this.state.isWorkingPrimaryCheck==null && this.state.isWorkingSpouseCheck == null) && this.state.spouseUserId !== "null") && <th className="border-0"></th>}
                         <th colSpan={2} className="border text-dark bg-grey" style={{ backgroundColor: "#DCDCDC" }}>Projected Retirement Income</th>
                    </tr>
                        }
                        <tr className='border-0'>
                            <th className='border-0' style={{width:"35%"}}></th>
                           {(this.state.isWorkingPrimaryCheck == false || this.state.isWorkingPrimaryCheck == null) &&
                            <th className='border'>{this.hideLastName($AHelper.capitalizeAllLetters(this.state.memberspouseDetails?.memberName))}<br/>{this.state.spouseUserId !== "null" && '(Primary)'}</th>}
                           {(this.state.isWorkingPrimaryCheck == true || this.state.isWorkingPrimaryCheck == null) &&
                         <th className="border"> {this.hideLastName($AHelper.capitalizeAllLetters(this.state.memberspouseDetails?.memberName))} <br /> Projected Retirement</th>}
                        {((this.state.isWorkingSpouseCheck == true || this.state.isWorkingSpouseCheck == null) && this.state.spouseUserId !== "null") && (
                          <th className="border "> {this.hideLastName($AHelper.capitalizeAllLetters(this.state.memberspouseDetails?.spouseName))} <br /> Projected Retirement</th>)}
                         {((this.state.isWorkingSpouseCheck == false || this.state.isWorkingSpouseCheck == null) && this.state.spouseUserId !== "null") && (
                          <th className='border'>{this.hideLastName($AHelper.capitalizeAllLetters(this.state.memberspouseDetails?.spouseName))}<br/>(Spouse)</th>)}
                            </tr>
                            </thead>
                         <tbody>
                                       
                        {this.state.IncomeTypes.length > 0 &&
                        this.state.IncomeTypes.map((incometype, index) => {
                        let priamryIncomeGrossAmt = this.state.IncomeDetailsprimary.length > 0 && this.state.IncomeDetailsprimary[index].grossAmt1;
                         let priamryIncomeRetAmt = this.state.IncomeDetailsprimary.length > 0 && this.state.IncomeDetailsprimary[index].retProjAmt1;
                        let spouseIncomeGrossAmt = this.state.IncomeDetailsspouse.length > 0 && this.state.IncomeDetailsspouse[index].grossAmt2;
                        let spouseIncomeRetAmt = this.state.IncomeDetailsspouse.length > 0 && this.state.IncomeDetailsspouse[index].retProjAmt2;
                        return (
                          <tr>
                            <td>{incometype.label}</td>
                            {(this.state.isWorkingPrimaryCheck == false || this.state.isWorkingPrimaryCheck == null) &&
                            <td className="p-0">
                              <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" name="grossAmt1" value={priamryIncomeGrossAmt} />
                            </td>}
                            {((this.state.isWorkingSpouseCheck == false || this.state.isWorkingSpouseCheck == null) && this.state.spouseUserId !== "null") && (
                              <td className="p-0">
                                <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" name="grossAmt2" value={spouseIncomeGrossAmt}/>
                              </td>
                            )}
                            {(this.state.isWorkingPrimaryCheck==true || this.state.isWorkingPrimaryCheck==null) &&
                            <td className="p-0">
                              <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" name="retProjAmt1" value={priamryIncomeRetAmt} />
                            </td>}
                            {((this.state.isWorkingSpouseCheck == true || this.state.isWorkingSpouseCheck == null) && this.state.spouseUserId !== "null") && (
                              <td className="p-0">
                                <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" name="retProjAmt2" value={spouseIncomeRetAmt} />
                              </td>
                            )}
                          </tr>
                        );
                      })}

                    <tr>
                      <td className="text-start">TOTAL:</td>
                      {(this.state.isWorkingPrimaryCheck == false || this.state.isWorkingPrimaryCheck == null) &&
                      <td>
                        <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" value={this.state.totgrossamntprimary} disabled />
                      </td>}
                      {((this.state.isWorkingSpouseCheck == false || this.state.isWorkingSpouseCheck == null) && this.state.spouseUserId !== "null") && (
                        <td>
                          <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" value={this.state.totgrossamntspouse} disabled />
                        </td>
                      )}
                      {(this.state.isWorkingPrimaryCheck==true || this.state.isWorkingPrimaryCheck==null) &&
                      <td>
                        <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" value={this.state.totrefprojamtprimary} disabled />
                      </td>}
                      {((this.state.isWorkingSpouseCheck == true || this.state.isWorkingSpouseCheck == null) && this.state.spouseUserId !== "null") && (
                        <td>
                          <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" value={this.state.totrefprojamtspouse} disabled />
                        </td>
                      )}
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <div>
                             <Form.Group as={Row} className="">
                {(this.state.formlabelData.label950)&&(
                  //  if (value !== undefined && value !== null && value !== '
                  <>
                   <Col xs sm="12" lg="12" className="d-flex align-items-start flex-column" id="monthlyIncomeId1">
                    <div className="row w-100 mb-2">
                      <div className="col-4">
                        <label className="">
                          {" "} {this.state.formlabelData.label950.question}{" "}
                        </label>
                      </div>
                      <div className="col-4">
                      
                        <div>
                         { this.state.formlabelData.label950.response.map(
                          (response) =>
                    
                          {
                            konsole.log("ccxcxccx",response,this.state.formlabelData)
                            return (
                              <>
                                  <div  className="styleCurrentNetIncome">  {$AHelper.capitalizeAllLetters(this.state.memberspouseDetails?.memberName)}</div>
                                  <CurrencyInput
                                  prefix="$"
                                  allowNegativeValue={false} 
                                  className="border-1 border-secondary p-0" 
                                  id={response.responseId}
                                  value={response.response}
                                  name="netIncome"
                                 
                                />
                              </>
                                
                            );
                          }
                        )} 
                        </div>

                      </div>
                      <div className="col-4">
                      {(this.state.spouseUserId !== "null" ) && (
                     <>
                     <div className="styleCurrentNetIncome">{$AHelper.capitalizeAllLetters(this.state.memberspouseDetails?.spouseName)}</div>
                        <div>
                           <CurrencyInput prefix="$" allowNegativeValue={false} className="border-1 border-secondary p-0" value={this?.state?.spouseNetIncome?.subResponseData} />
                        </div>                
                      </>                      
                      )}            
                    </div>
                  </div>

                  </Col>
                  </>
                )}
                 
                </Form.Group>

                   <Form.Group as={Row} className="">
                  <Col xs sm="12" lg="12" className="d-flex align-items-start flex-column" id="monthlyIncomeId1">
                    <div className="">
                      <label className="">
                        {" "}{this.state.formlabelData.label914 && this.state.formlabelData.label914.question}{" "}
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      {this.state.formlabelData.label914 &&
                        this.state.formlabelData.label914.response.map(
                          (response) => {
                            return (
                              <div className="mb-2">
                                <CurrencyInput prefix="$" allowNegativeValue={false} className="border-1 border-secondary" id={response.responseId} value={response.response} name="savingIncome"/>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </Col>
                </Form.Group>
                {this.state.spouseUserId !== "null" && (
                  <Form.Group as={Row} className="mb-2">
                    <Col xs sm="8" lg="12" className="" id="monthlyIncomeId2">
                      <div>
                        <label className="">
                          {" "} {this.state.formlabelData.label916 && this.state.formlabelData.label916.question}{" "}
                        </label>
                        <div className="d-flex align-items-center justify-content-start mb-2 gap-2">
                          {this.state.formlabelData.label916 &&
                            this.state.formlabelData.label916.response.map(
                              (response) => {
                                return (
                                  <div className="d-flex align-items-center">
                                    <Form.Check className="left-radio" label={response.response} name="spousePension" type="radio" id={response.responseId}
                                      defaultValue={response.response} defaultChecked={response.checked}
                                      value={response.responseId} />
                                  </div>
                                );
                              }
                            )}
                        </div>
                      </div>
                    </Col>

                    {this.state.spousePension.responseId == 241 ? (
                      <Col xs sm="4" lg="3">
                        <Select className="custom-select" options={percentageOptions} value={percentageValueObj} name="percentageValue" isSearchable={false} isDisabled />
                      </Col>
                    ) : ( "")}

                    {this.state.spousePension.responseId == 241 &&
                      this.state.percentageValue == 246 ? (
                      <Col xs sm="4" lg="3">
                        <CurrencyInput suffix="%" allowNegativeValue={false} value={this.state.currency} name="PercentCurrency" className="border-1 border-secondary"/>
                      </Col>
                    ) : ( "")}
                  </Form.Group>
                )}
                <Form.Group as={Row}>
                  <Col xs md="9">
                    <div className="d-flex align-items-start justify-content-start flex-column">
                      <label className="">
                        {" "}{this.state.formlabelData.label918 && this.state.formlabelData.label918.question}{" "}
                      </label>
                      <div className="d-flex align-items-center justify-content-start gap-2">
                        {this.state.formlabelData.label918 &&
                          this.state.formlabelData.label918.response.map(
                            (response) => {
                              return (
                                <div className="">
                                  <Form.Check className="left-radio  " label={response.response} name="incomeChange" type="radio"
                                    id={response.responseId} defaultValue={response.response} defaultChecked={response.checked} />
                               </div>
                              );
                            }
                          )}
                      </div>
                    </div>
                  </Col>
                {this.state.formlabelData?.label918?.response?.some(ele => ele?.response == "Yes" && ele?.checked == true) ?
                <>
                     <Col xs sm="4" lg="3">
                              <div className="mb-2">
                                <CurrencyInput 
                                prefix="$" 
                                allowNegativeValue={false} 
                                className="border-1 border-secondary" 
                                value={this.state.anticipatedIncome} 
                                name="anticipatedIncome"/>
                              </div>
                        </Col>
                              <Col xs sm="4" lg="7" className='mt-3'>
                              {this.state.formlabelData.label1034 &&
                                this.state.formlabelData.label1034.response.map(
                                  (response) => {
                                    return (
                                      <Form.Control label={response.response} 
                                      name="AnticipationComment" type="text"
                                        id={response.responseId}
                                        value={response.response}
                                        placeholder="Comment"
                                       
                                      />
                                    );
                                  }
                                )}
                               
                      </Col>
                </>
                   :""} 
                                    
                 </Form.Group>

                  </div>
                    </div>
                    </div>
                
                </div>

       
    )
}
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyIncome);












// const MonthlyIncome = () => {
//     return ( 
//         <div>
//         <p className='Heading mt-5 mb-1 text-danger'>Monthly Income:</p>
//         <table className='container'>
//           <tr>
//             <th className="col-4 border-0"></th>
//             <th className="col-2 border-0"></th>
//             <th className="col-2 border-0"></th>
//             <th className="col-4 text-center thd" colSpan='2'>Complete if not yet retired</th>
//           </tr>
//           <tr>
//             <th className="col-4 border-0"></th>
//             <th className='thd text-center'>Client #1 Current</th>
//             <th className="thd text-center">Client #2 Current</th>
//             <th className="thd text-center">Client #1 Projected Retirement</th>
//             <th className="thd text-center">Client #2 Projected Retirement</th>
//           </tr>
//           <tr>
//             <td className='ps-2 tdd'>Social Security (gross):</td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//           </tr>
//           <tr>
//             <td className='ps-2 tdd'>Employment (gross):</td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//           </tr>
//           <tr>
//             <td className='ps-2 tdd'>Pension (gross):</td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//           </tr>
//           <tr>
//             <td className='ps-2 tdd'>IRAs, annuities, etc. (gross):</td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//           </tr>
//           <tr>
//             <td className='ps-2 tdd'>Income from investments:</td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//           </tr>
//           <tr>
//             <td className='ps-2 tdd'>Rental income (net, before taxes):</td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//           </tr>
//           <tr>
//             <td className='ps-2 tdd'>Business Interests (net, EBITDA):</td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//             <td className='tdd'><input type="text" className='w-100 dirrgt border-0' /></td>
//           </tr>
//           <tr>
//             <td className='text-end fw-bold p-1 tdd'>TOTAL</td>
//             <td className='fw-bold tdd'>$<input type="text" className='w-75 border-0'/></td>
//             <td className='fw-bold tdd'>$<input type="text" className='w-75 border-0'/></td>
//             <td className='fw-bold tdd'>$<input type="text" className='w-75 border-0'/></td>
//             <td className='fw-bold tdd'>$<input type="text" className='w-75 border-0'/></td>
//           </tr>
//         </table>
//         <p className="p1 mt-3 text-danger">How much do you contribute, monthly, to your retirement?
//         <input type='text' className='border-bottom border-1 border-dark ms-2'/>
//         </p>
//         <p>Which sources of income have a benefit for a surviving spouse?</p>
//         <input type='text' className='border-bottom border-1 border-dark w-100'/>
//         <input type='text' className='border-bottom border-1 border-dark w-100'/>
//         <p className='mt-4'>Do you anticipate any changes to your income?</p>
//         <input type='text' className='border-bottom border-1 border-dark w-100'/>
//         <input type='text' className='border-bottom border-1 border-dark w-100'/>
//         <p className="p1 mt-3 text-danger">Is your monthly income less than, equal to, or greater than your monthly expenses?
//         <input type='text' className='border-bottom border-1 border-dark ms-2'/>
//         </p>
//         </div>
//      );
// }
 
// export default MonthlyIncome;