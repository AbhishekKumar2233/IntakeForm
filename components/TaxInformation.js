import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, } from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import { SET_LOADER } from "../components/Store/Actions/action";
import { $Service_Url } from "../components/network/UrlPath";
import { $CommonServiceFn, $getServiceFn } from "../components/network/Service";
import { $AHelper } from "./control/AHelper";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";

import moment from "moment";
import { Services } from "../components/network/Service";
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";
import { isNotValidNullUndefile, fileNameShowInClickHere, isNullUndefine } from "./Reusable/ReusableCom";
import PdfViewer2 from "./PdfViwer/PdfViewer2";
import { useContext } from "react";

export class TaxInformation extends Component {
  static contextType = globalContext
  constructor(props, context) {
    super(props, context);
    this.state = {
      loggedUserId: "",
      userId: "",
      ...this.getInitialState
    }
    this.inputRef = React.createRef();
    this.inputRefs = [];
  }
  
    getInitialState = {
      taxYears: [{ taxYear: moment().subtract(1, 'years').toDate(), adjustedGrossIncome: null, taxableIncome: null, totalTaxAmount: null, marTaxRate: null, effTaxRate: null, userTaxId: 0, taxFileId: null }],
      file: null,
      fileName: "",
      taxYear: null,
      grossincome: null,
      taxableIncome: null,
      totalTaxAmount: null,
      marTaxRate: null,
      effTaxRate: "",
      getData: "",
      removedData: [],
      disable: false,
      userTaxId: "",
      isEdit: false,
      timeoutId: null,
      displayInput: false,
      showAddInput: true,
      inputVisibility: Array.from({ length: this?.props?.taxYears?.length }).fill(false),
  }


  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let loggedUserId = sessionStorage.getItem("loggedUserId") || "";

    this.setState({
      userId: newuserid,
      loggedUserId: loggedUserId,
    });
    // this.getTaxInformation(newuserid);

    konsole.log("UserID", newuserid);
  }

  handleClose = ()=>{
    this.props.handletaxpopShow()
    this.setState(this.getInitialState)
  }   

  componentDidUpdate(prevProps, prevState) {
    if (prevState.taxableIncome != this.state.taxableIncome) {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        konsole.log(`I can see you're not typing. I can use "${this.state.taxableIncome}" value!`);
        this.fetchMarginalTax();
      }, 1000);
    }
    if (prevProps.show == false && this.props.show == true) this.getTaxInformation(this.state.userId);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  getTaxInformation = async (newuserid) => {
    let userId = newuserid || this.state.userId;
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getTaxInfo + userId + "/0", "", async (response) => {

      this.props.dispatchloader(false);
      if (response) {
        this.props.dispatchloader(false);
        let taxYear = "";
        if (response.data.data.userTax[0].taxYear !== "" && response.data.data.userTax[0].taxYear !== null && response.data.data.userTax[0].taxYear !== undefined && (response.data.data.userTax[0].taxYear !== 'Invalid date')) {
          taxYear = $AHelper.getDateFromString(response.data.data.userTax[0].taxYear);
          taxYear = new Date(taxYear);

        } else {
          taxYear = null;
        }

        const { userTax } = response?.data?.data;
        const taxYears = userTax.map((tax) => {
          return {
            userTaxId: tax.userTaxId,
            createdBy: tax.createdBy,
            createdOn: tax.createdOn,
            updatedBy: tax.updatedBy,
            updatedOn: tax.updatedOn,
            remarks: tax.remarks,
            isActive: tax.isActive,
            taxableIncome: tax.taxableIncome,
            totalTaxAmount: tax.totalTaxAmount,
            marTaxRate: tax.marTaxRate,
            effTaxRate: tax.effTaxRate,
            taxYear: new Date(tax.taxYear),
            adjustedGrossIncome: tax.adjustedGrossIncome,
            taxFileId: tax.taxFileId
          }
        });
        const currentDate = new Date();
        const lastYearDate = moment(currentDate).subtract(1, 'years').toDate();
       
        if(taxYears.some(obj => obj.taxYear?.getFullYear() == currentDate?.getFullYear() && obj.taxYear?.getFullYear() == lastYearDate.getFullYear())){
          this.setState(({showAddInput:false}))
        }else{
          this.setState(({showAddInput:true}))
        }
      
        this.props.dispatchloader(false);
        this.setState({ taxYears: taxYears });


      }else{
      
      }
    });
  };


  handleInputChange = (event) => {
    event.preventDefault();
    let attrname = event.target.name;
    let attrvalue = event.target.value;

    this.setState({
      ...this.state,
      [attrname]: attrvalue,
    });
  };
  handleUpsertTax = async () => {

    this.setState({ disable: true })

    this.props.dispatchloader(true);
    let inputdata = JSON.parse(JSON.stringify(this.state));
    const newJson = await this.returnNewJson();

    const jsonOBJ = {
      userId: inputdata.userId,
      upsertedBy: inputdata.loggedUserId,
      upsertUserTaxes: newJson,
    };
    
    if (jsonOBJ?.upsertUserTaxes.length > 0) {
      let error = false
      for(let i=0;i<jsonOBJ?.upsertUserTaxes.length;i++){
        const { adjustedGrossIncome, taxableIncome, marTaxRate, totalTaxAmount } = jsonOBJ?.upsertUserTaxes[i]
        if (!isNotValidNullUndefile(adjustedGrossIncome) && !isNotValidNullUndefile(taxableIncome) && !isNotValidNullUndefile(marTaxRate) && !isNotValidNullUndefile(totalTaxAmount)) {
          error = true
        }
      }

      if (error == true) {
        this.setState({ disable: false })
        this.props.dispatchloader(false);
        AlertToaster.warn("Please enter your data")
        return;
      } else {
        this.props.dispatchloader(true);
          $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.upsertTaxInfo, jsonOBJ, (response) => {
            this.setState({ disable: false });
            this.props.dispatchloader(false);
            if (response) {

              if (this.state.getData) AlertToaster.success("Data updated successfully");
              else AlertToaster.success("Data saved successfully");

              this.setState({ isEdit: false });

              if (this.props.handletaxpopShow) {
                this.props.handletaxpopShow();
              } else {
                this.toasterAlert("Something wrong", "Warning");
              }
            } else {
              this.toasterAlert(Msg.ErrorMsg, "Warning");
            }
          });
  
      }
    }else{
    AlertToaster.warn("Please enter your data")
    this.props.dispatchloader(false);
    this.setState({ disable:false })
    }



  };

  returnNewJson = () => {
    this.props.dispatchloader(true);
    let inputdata = JSON.parse(JSON.stringify(this.state));
    return Promise.all(this.state?.taxYears.map(async (ele) => {
      if (ele?.file) {
        this.props.dispatchloader(true);
        let fileId = await this.fileSignupload(ele?.file, inputdata.loggedUserId, inputdata.userId, 65, 5, 2);
        this.props.dispatchloader(false);
        // Remove the file property from the element and add the fileId
        delete ele.file;
        return { ...ele, taxFileId: fileId };
      } else {
        this.props.dispatchloader(false);
        return ele;
      }
    }));
  };


  onValueChangemargintaxtrate = (value) => {
    konsole.log("effetiveTaxRate", value)
    if (value <= 100 || value == null) {
      this.setState({ effTaxRate: value });
    }
  };
  onValueChangemaxtaxtrate = (value) => {
    if (value <= 100 || value == null) {
      this.setState({ marTaxRate: value });
    }
  };
  toasterAlert(text, type) {
    this.context.setdata({
      open: true,
      text: text,
      type: type
    })
  }



  fetchMarginalTax = (index, fieldName, value, year) => {

    var getYear = new Date(year)?.getFullYear();


    if (this.props.show != true) return;
    this.props.dispatchloader(true);
    let userTypeId = sessionStorage.getItem("spouseUserId")
    const json = {
      taxableIncome: value?.target?.value.replace(/\s+/g, '').replace(/,/g, '').replace('$', '') || null,
      countryId: 230,
      userTypeId: userTypeId == "null" ? 1 : 2,
      textYear: getYear
    }

    return new Promise((resolve, reject) => {
      $getServiceFn.getMarginalTax(json, (res, err) => {
        this.props.dispatchloader(false);
        if (res) {
          this.setState(prevState => {
            const updatedTaxYears = [...prevState.taxYears];
            const updatedYear = { ...updatedTaxYears[index] };
            updatedYear["marTaxRate"] = res.data.data.marginalTaxRate;
            updatedTaxYears[index] = updatedYear;
            return { taxYears: updatedTaxYears };
          });


          this.setState({
            marTaxRate: res.data.data.marginalTaxRate,
          })
          resolve(res.data.data.marginalTaxRate);
        } else {
          this.setState({
            marTaxRate: "",
          })

          resolve("");
        }
      })
    })
  }




















  
  handleChange = (index, fieldName, value) => {
    const { adjustedGrossIncome, totalTaxAmount } = this.state.taxYears[index];
    let inputdata = JSON.parse(JSON.stringify(this.state));
    if (fieldName === "adjustedGrossIncome" || fieldName === "totalTaxAmount") {
      // Fetch totalTaxAmount and grossincome from taxYears at the given index
      let effectivetaxrate = '';
      // Compute effectivetaxrate based on totalTaxAmount and grossincome
      let effTaxRateRule = (totalTaxAmount / adjustedGrossIncome) * 100;

      const effTaxRateAtTwoDecimalRule = Number(parseFloat(effTaxRateRule).toFixed(2));
      effectivetaxrate = (totalTaxAmount !== undefined && adjustedGrossIncome !== undefined && effTaxRateAtTwoDecimalRule !== Infinity && !isNaN(effTaxRateAtTwoDecimalRule)) ? effTaxRateAtTwoDecimalRule : '';
      this.setState(prevState => {
        const updatedTaxYears = [...prevState.taxYears];
        const updatedYear = { ...updatedTaxYears[index] };
        updatedYear[fieldName] = value;
        updatedYear["effTaxRate"] = effectivetaxrate;
        updatedTaxYears[index] = updatedYear;
        return { taxYears: updatedTaxYears };
      });
    } else {
      this.setState(prevState => {
        const updatedTaxYears = [...prevState.taxYears];
        const updatedYear = { ...updatedTaxYears[index] };
        updatedYear[fieldName] = value;
        updatedTaxYears[index] = updatedYear;
        return { taxYears: updatedTaxYears };
      });
    }
  };

  taxInfoDelete = (userId, userTaxId, deletedBy) => {
    return new Promise((resolve, reject) => {
      Services.deleteTaxInfoIndex(userId, userTaxId, deletedBy).then((res) => {
        let response = res?.data?.data
        resolve(response)


      }).catch((err) => {
        resolve('err')
      })
    })



  };
  fileSignupload = (file, createdBy, userId, fileTypeId, fileCategoryId, fileStatusId) => {
    return new Promise((resolve, reject) => {
      Services.postfileuploadspeaker(file, createdBy, userId, fileTypeId, fileCategoryId, fileStatusId).then((res) => {
        let response = res?.data?.data?.fileId
        resolve(response)


      }).catch((err) => {
        resolve('err')
      })
    })



  };

  handleRemove = (index) => {
    this.setState(prevState => {
      const updatedTaxYears = [...prevState.taxYears];
      const updatedYear = { ...updatedTaxYears[index] };
      updatedYear["taxFileId"] = null;
      updatedTaxYears[index] = updatedYear;
      return { taxYears: updatedTaxYears };
    });

  }

  handleAddYear = () => {
    if (this.state.isEdit == false) {
      this.setState({ isEdit: true })
    }

    let data = this.getYearReturn()
    let taxYears = [
      ...this.state.taxYears,
      { taxYear: data, adjustedGrossIncome: null, taxableIncome: null, totalTaxAmount: null, marTaxRate: null, effTaxRate: null, userTaxId: 0 }
    ];
    this.setState({ taxYears });

  };
  getYearReturn = () => {
    const lastTaxYear = this.state.taxYears[this.state.taxYears.length - 1]?.taxYear ?? moment().subtract(1, 'years').toDate();
    const nextTaxYear = moment(lastTaxYear).add(1, 'years').toDate();
    const currentDate = new Date();
    const lastYearDate = moment(currentDate).subtract(1, 'years').toDate();

   

    let returnValue = '';
    if (this.state.taxYears.every(ele => {
      const year = ele?.taxYear?.getFullYear();
      return year !== currentDate?.getFullYear() && year !== lastYearDate.getFullYear();
  })) {
   
      returnValue = lastYearDate;
  } else {
      const hasCurrentYear = this.state.taxYears.some(ele => ele?.taxYear?.getFullYear() === currentDate?.getFullYear());
      const hasLastYear = this.state.taxYears.some(ele => ele?.taxYear?.getFullYear() === lastYearDate.getFullYear());
  
      if (!hasCurrentYear) {
          returnValue = currentDate;
      } else if (!hasLastYear) {
          returnValue = lastYearDate;
      }
  }
  


    return returnValue;
  }
  isCheckCurrPrevYearExists = () =>{
    const currentDate = new Date();
    const lastYearDate = moment(currentDate).subtract(1, 'years').toDate();
    const hasExist =  this.state.taxYears.some(obj =>obj?.taxYear?.getFullYear() ==currentDate.getFullYear()) &&  this.state.taxYears.some(obj => obj.taxYear.getFullYear() == lastYearDate.getFullYear());
    return !hasExist;
  }


  handleRemoveYear = async (taxYearToRemove, index) => {
    let ques = await this.context.confirm(true, "Are you sure? You want to delete this.", "Confirmation");
    if (!ques) return;

    this.setState(prevState => ({
      removedData: [...prevState.removedData, taxYearToRemove]
    }));
   
      
      const newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
      const loggedUserId = sessionStorage.getItem("loggedUserId") || "";
      if(isNotValidNullUndefile(taxYearToRemove?.userTaxId) && taxYearToRemove?.userTaxId !==0){
        this.props.dispatchloader(true);
        const result = await this.taxInfoDelete(newuserid, taxYearToRemove?.userTaxId, loggedUserId)
        this.props.dispatchloader(false);
     
      }
      const updatedTaxYears = this.state.taxYears.filter((year) => year.taxYear !== taxYearToRemove?.taxYear);  
     this.setState({ showAddInput: true })

    this.setState({ taxYears: updatedTaxYears });


  };
  handleClick = (index) => {
    this.inputRefs[index].click();
  };

  handleFileChange = (event, index) => {
    const selectedFile = event.target.files[0];
    if (selectedFile?.type !== "application/pdf") {
      AlertToaster.error('Only pdf format allowed.');
      return;
    }
    this.setState((prevState) => {
      const updatedTaxYears = [...prevState.taxYears];
      updatedTaxYears[index].file = selectedFile;
      return { taxYears: updatedTaxYears };
    });
    this.setState({ displayInput: true })
    const updatedVisibility = [...this.state.inputVisibility];
    updatedVisibility[index] = true;
    this.setState({ inputVisibility: updatedVisibility });

  };




  render() {

    const { displayInput } = this.state;
    let effectivetaxrate = ''

    let effTaxRateRule = (this.state.totalTaxAmount / this.state.grossincome) * 100
    const effTaxRateAtTwoDecimalRule = Number(parseFloat(effTaxRateRule).toFixed(2))
    effectivetaxrate = (this.state.totalTaxAmount !== undefined && effTaxRateAtTwoDecimalRule !== Infinity && !isNaN(effTaxRateAtTwoDecimalRule)) ? effTaxRateAtTwoDecimalRule : ''
    const stateVal = this.state

    var currentDate = new Date();

    const lastYearDate = moment(currentDate).subtract(1, 'years').toDate();
 



    return (
      <>
        <style jsx global>{`.modal-open .modal-backdrop.show {opacity: 0;}`}</style>

        <Modal size="xl" show={this.props.show}enforceFocus={false}centered onHide={this.handleClose} animation="false"
          backdrop="static">
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Tax Information </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col lg={12}>



                <Table bordered>
                  <thead>
                    <tr>
                      <th>Tax Year</th>
                      <th>Adjusted Gross Income</th>
                      <th>Taxable Income</th>
                      <th>Total Taxes</th>
                      <th>Marginal Tax Rate</th>
                      <th>Effective Tax Rate</th>
                      <th className="text-center">Document</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render existing tax years */}
                    {this.state.taxYears.map((year, index) => (

                      <tr key={index || year?.taxYear}>
                        <td className="p-0" style={{ background: "rgba(0,0,0,0.1)" }}>
                          <DatePicker
                            className="border-0"
                            selected={year.taxYear ?? lastYearDate}
                            name={`taxYear_${index}`}
                            dateFormat="yyyy"
                            maxDate={moment().toDate()}
                            onChange={(date) => this.handleChange(index, 'taxYear', date)}
                            placeholderText="YYYY"
                            showYearPicker
                            autoComplete="off"
                            disabled={true}
                          />
                        </td>
                        <td className="p-0" style={year?.createdOn && stateVal.isEdit === false ? { background: "rgba(0,0,0,0.1)" } : {}}>
                          <CurrencyInput
                            allowNegativeValue={false}
                            prefix="$"
                            className="border-0"
                            disabled={year?.createdOn && stateVal.isEdit === false}
                            value={year.adjustedGrossIncome}
                            name={`adjustedGrossIncome_${index}`}
                            onValueChange={(value) => this.handleChange(index, 'adjustedGrossIncome', value)}
                          />
                        </td>
                        <td className="p-0" style={year?.createdOn && stateVal.isEdit === false ? { background: "rgba(0,0,0,0.1)" } : {}}>
                          <CurrencyInput
                            prefix="$"
                            allowNegativeValue={false}
                            disabled={year?.createdOn && stateVal.isEdit === false}
                            className="border-0"
                            value={year.taxableIncome}
                            name={`taxableIncome_${index}`}
                            onBlur={(value) => this.fetchMarginalTax(index, 'taxableIncome', value, year.taxYear)}
                            onValueChange={(value) => this.handleChange(index, 'taxableIncome', value)}
                          />
                        </td>
                        <td className="p-0" style={year?.createdOn && stateVal.isEdit === false ? { background: "rgba(0,0,0,0.1)" } : {}}>
                          <CurrencyInput
                            prefix="$"
                            allowNegativeValue={false}
                            disabled={year?.createdOn && stateVal.isEdit === false}
                            className="border-0"
                            value={year.totalTaxAmount}
                            name={`totalTaxAmount_${index}`}
                            onValueChange={(value) => this.handleChange(index, 'totalTaxAmount', value)}
                          />
                        </td>
                        <td className="p-0" style={{ background: "rgba(0,0,0,0.1)" }}>
                          <CurrencyInput
                            suffix="%"
                            allowNegativeValue={false}
                            disabled={true}
                            className="border-0"
                            value={year.marTaxRate}
                            name={`marTaxRate_${index}`}
                            onValueChange={(value) => this.handleChange(index, 'marTaxRate', value)}
                          />
                        </td>
                        <td className="p-0" style={{ background: "rgba(0,0,0,0.1)" }}>
                          <CurrencyInput
                            suffix="%"
                            allowNegativeValue={false}
                            disabled={true}
                            className="border-0"
                            value={year.effTaxRate}
                            name={`effTaxRate_${index}`}
                            onValueChange={(value) => this.handleChange(index, 'effTaxRate', value)}
                          />
                        </td>
                        <td className="p-0 w-25 text-center" style={year?.createdOn && stateVal.isEdit === false ? { background: "rgba(0,0,0,0.1)" } : {}}>
                          <div className="d-flex justify-content-center mt-2 mb-2">
                            {year?.createdOn ? (
                              <>

                                <div className="d-flex">
                                  {isNotValidNullUndefile(year?.taxFileId) ? <>
                                    {/* <div className="me-2 ms-2" style={{ position: 'relative', border: "1px solid #ced4da", }}> */}
                                    {/* <input type="text" className="" style={{ border: "none", minHeight: "-webkit-fill-available" }}
                                        readOnly value={`Tax Information ${this.state.fileName}`}
                                      /> */}
                                    <PdfViewer2 viewFileId={year?.taxFileId} />
                                    {stateVal?.isEdit == true ? <>
                                      <div className="me-2 ms-3" style={{ position: 'relative', border: "1px solid #ced4da", }}>
                                        <p className="me-1 ms-1" style={{
                                          position: 'absolute', top: '0', right: '0', borderRadius: "50%", cursor: "pointer"
                                        }} onClick={() => this.handleRemove(index)}>X</p> </div></> : <>
                                      {/* <PdfViewer2 viewFileId={year?.taxFileId} />  */}
                                      {/* // <img src="CrossSign.svg" className="btn btn-outline btn-sm" style={{ */}
                                      {/* //   position: 'absolute', top: '0', right: '0', borderRadius: "50%" */}
                                      {/* // }} onClick={() => this.handleRemove(index)} /> */}
                                    </>}

                                    {/* </div> */}

                                  </>
                                    :
                                    <>
                                      <div >
                                        <input type="file" accept=".pdf" style={{ display: displayInput ? 'none' : 'none', border: "none" }} onChange={(e) => this.handleFileChange(e, index)}
                                          ref={(ref) => (this.inputRefs[index] = ref)} />
                                        <p>
                                          <span className="">{fileNameShowInClickHere(null, year?.file?.name)}</span>
                                          <Button style={{outline:"1px solid #720c20", display: displayInput ? '' : '' }} className="theme-btns" onClick={() => this.inputRefs[index].click()} disabled={stateVal?.isEdit == false}>Upload</Button>
                                        </p>
                                      </div>
                                    </>}
                                  <div>
                                  </div>
                                </div>
                              </>


                            ) : (
                              <div key={index}>
                                <input type="file" accept=".pdf"
                                  style={{ display: this.state.inputVisibility[index] ? 'none' : 'none', border: "none" }}
                                  onChange={(e) => this.handleFileChange(e, index)}
                                  ref={(ref) => (this.inputRefs[index] = ref)}
                                />
                                <p>
                                  <span className=""> {fileNameShowInClickHere(null, year?.file?.name)}</span>
                                  <Button style={{ border: '1px solid red', outline:"1px solid #720c20", display: this.state.inputVisibility[index] ? '' : '' }}
                                    className="theme-btns ms-1" onClick={() => this.inputRefs[index].click()}>Upload</Button>
                                </p>
                              </div>
                            )}
                          </div>




                        </td>
                        <td className="p-0" style={year?.createdOn && stateVal.isEdit === false ? { background: "rgba(0,0,0,0.1)" } : {}}>
                          <div className="d-flex justify-content-center mt-2 mb-2">
                            <img src="fileRemove.svg" disabled={year?.createdOn && stateVal.isEdit === false} className="btn btn-outline btn-sm ms-2 me-2" style={{ borderRadius: "50%" }} onClick={() => this.handleRemoveYear(year)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Add button to add new tax year */}
                    {this.isCheckCurrPrevYearExists() &&
                      <tr>
                        <td colSpan="6">
                          <button onClick={this.handleAddYear} className="border-0 fw-bold rounded" style={{ color: "white", backgroundColor: "#720C20" }}>+</button>
                        </td>
                      </tr>}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              {this.state.taxYears.length > 0 && this.state.taxYears[0]?.createdOn ? (
                <div className="d-flex">

                  <div>
                    {(stateVal?.isEdit == true) ? <>
                      <Button style={{ backgroundColor: "#76272b", border: "none" }} className="theme-btn updateButtonTax" onClick={() => this.handleUpsertTax()} disabled={this.state.disable == true ? true : false}>
                        Update
                      </Button>
                    </> : <>
                      <Button style={{ backgroundColor: "#76272b", border: "none" }} className="theme-btn updateButtonTax"
                        onClick={() => this.setState({ isEdit: true })}>
                        EDIT
                      </Button>
                    </>}
                  </div>
                </div>

              ) : (
                <div className="d-flex"><Button style={{ backgroundColor: "#76272b", border: "none" }} className="theme-btn updateButtonTax" onClick={() => this.handleUpsertTax()} disabled={this.state.disable == true ? true : false}> Save</Button>

                </div>
              )}
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

export default connect(mapStateToProps, mapDispatchToProps)(TaxInformation);
