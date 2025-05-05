import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, } from "react-bootstrap";
import Select from "react-select";
import CurrencyInput from "react-currency-input-field";
import { connect } from "react-redux";
import { monthlyIncome } from "./control/Constant";
import { SET_LOADER } from "../components/Store/Actions/action";
import { $Service_Url } from "../components/network/UrlPath";
import { $CommonServiceFn } from "../components/network/Service";
import konsole from "./control/Konsole";
import { Msg } from "./control/Msg";
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";
import { uscurencyFormate } from "./control/Constant";
import { $AHelper } from "./control/AHelper";
import { setprimaryUserMonthlyIncome, setSpouseUserMonthlyIncome } from "../component/Redux/Reducers/incomeSlice";

export class MonthlyIncome extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      userId: "",
      currency: "",
      spousePensionShow: false,
      spouseUserId: "",
      loggedInUser: "",
      percentageValue: 0,
      formlabelData: {},
      savingIncome: 0,
      value1: "",
      IncomeTypes: [],
      netIncomeForSpouse: 0,
      spouseuserSubjectData: {},
      IncomeDetailsprimary: [],
      IncomeDetailsspouse: [],
      spouseSubjectDataIdFornetIncome: 0,
      totgrossamntprimary: 0,
      totrefprojamtprimary: 0,

      totgrossamntspouse: 0,
      totrefprojamtspouse: 0,
      memberspouseDetails: "",
      isWorkingPrimaryCheck: null,
      isWorkingSpouseCheck: null,

      isUpdating: false,

      savingIncome: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      netIncome: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      spousePension: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      incomeChange: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      AnticipationComment: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },

      spouseNetIncome:
      {
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "",
        responseId: 0,
        userId: ""
      },
      anticipatedIncome: ''

    };
  }

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let spouseDetailUserId = sessionStorage.getItem("spouseUserId") || "";
    let loggedInUser = sessionStorage.getItem("loggedUserId") || "";
    let memberspouseDetails = JSON.parse(sessionStorage.getItem("userDetailOfPrimary")) || "";

    konsole.log("spuseanduserName", memberspouseDetails);

    this.setState({
      userId: newuserid,
      spouseUserId: spouseDetailUserId,
      memberspouseDetails: memberspouseDetails,
      loggedInUser: loggedInUser,
    });

    this.fetchincometypes();
    this.getsubjectForFormLabelId(newuserid);
    this.getNetIncomeForSpouse(spouseDetailUserId);
    this.getOccupationbyUserIdForPrimary(newuserid)
    if (spouseDetailUserId !== "null") {
      this.getOccupationbyUserIdForSpouse(spouseDetailUserId)
    }
  }


  getOccupationbyUserIdForPrimary = (userId) => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getOccupationbyUserId + userId, "", (response, error) => {
      this.props.dispatchloader(true);
      if (response) {

        konsole.log("res of occupation", response);
        let responseData = response?.data.data
        konsole.log('responseData', responseData)
        if (responseData?.length > 0) {
          konsole.log('responseData', responseData)
          if (userId == responseData[0].userId) {
            this.setState({ isWorkingPrimaryCheck: responseData[0].isWorking })
            this.props.dispatchloader(false);
          }
        }
      } else {
        konsole.log('error of  occupation', error)
      }
    })
  }


  getOccupationbyUserIdForSpouse = (userId) => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getOccupationbyUserId + userId, "", (response, error) => {
      this.props.dispatchloader(true);
      if (response) {
        konsole.log("res of occupation", response);
        let responseData = response?.data.data
        konsole.log('responseData', responseData)
        if (responseData?.length > 0) {
          konsole.log('responseData', responseData)
          if (userId == responseData[0].userId) {
            this.setState({ isWorkingSpouseCheck: responseData[0].isWorking, })
            this.props.dispatchloader(false);
          }
        }
      } else {
        konsole.log('error of  occupation', error)
      }
    })
  }

  fetchincometypes = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getincometypes, "", (response) => {
      // debugger
      this.props.dispatchloader(false);
      if (response) {
        this.setState({
          ...this.state,
          IncomeTypes: response.data.data,
        });

        let tempincdetstate = [];
        let tempincdetstateSpouse = [];
        for (let inctype = 0; inctype < response.data.data.length; inctype++) {
          tempincdetstate.push({
            incomeTypeId: response.data.data[inctype].value,
            grossAmt1: 0,
            retProjAmt1: 0,
          });

          tempincdetstateSpouse.push({
            incomeTypeId: response.data.data[inctype].value,
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
        if (incomeDataObj?.length) this.setState({ isUpdating: true });
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

  handleClose = () => {
    this.setState({
      show: !this.state.show,
    });
    konsole.log("this.state", this.state.show);
  };

  handleShow = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  handleDynmaicPrimaryInputchange = (value, name, index) => {
    event.preventDefault();
    // debugger
    let tempincomedet = this.state.IncomeDetailsprimary;
    tempincomedet[index][name] = value;
    konsole.log("tempincomedet", tempincomedet);

    this.setState({
      ...this.state,
      IncomeDetailsprimary: tempincomedet,
    });

    let temptotgross = 0;
    let temptotrefpro = 0;
    for (let teminc = 0; teminc < tempincomedet.length; teminc++) {
      temptotgross += Number(tempincomedet[teminc].grossAmt1) || 0;
      temptotrefpro += Number(tempincomedet[teminc].retProjAmt1) || 0;
    }

    this.setState({
      ...this.state,
      totgrossamntprimary: temptotgross,
      totrefprojamtprimary: temptotrefpro,
    });
  };

  handleDynmaicSpouseInputchange = (value, name, index) => {
    konsole.log("VALUEE", value);
    event.preventDefault();
    // debugger
    let tempincomedet = this.state.IncomeDetailsspouse;
    tempincomedet[index][name] = value;
    konsole.log("incomedet", tempincomedet);

    this.setState({
      ...this.state,
      IncomeDetailsspouse: tempincomedet,
    });

    let temptotgross = 0;
    let temptotrefpro = 0;
    for (let teminc = 0; teminc < tempincomedet.length; teminc++) {
      temptotgross += Number(tempincomedet[teminc].grossAmt2) || 0;
      temptotrefpro += Number(tempincomedet[teminc].retProjAmt2) || 0;
    }

    this.setState({
      ...this.state,
      totgrossamntspouse: temptotgross,
      totrefprojamtspouse: temptotrefpro,
    });
  };



  getsubjectForFormLabelId = (newuserid) => {
    konsole.log("newUswerId", newuserid);
    let formlabelData = {};
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, monthlyIncome.formLabelId, (response) => {
      this.props.dispatchloader(true)
      if (response) {
        this.props.dispatchloader(false)
        const resSubData = response.data.data;
        for (let resObj of resSubData) {
          let label = "label" + resObj.formLabelId;
          formlabelData[label] = resObj.question;
          $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, "", (response) => {
            this.props.dispatchloader(true)
            if (response) {
              this.props.dispatchloader(false)
              if (response.data.data.userSubjects.length !== 0) {
                konsole.log("formlebleotherresponse", response.data.data.userSubjects[0]);
                let responseData = response.data.data.userSubjects[0];
                // this.props.dispatchloader(true);
                for (let i = 0; i < formlabelData[label].response.length; i++) {
                  if (formlabelData[label].response[i].responseId === responseData.responseId) {
                    this.props.dispatchloader(false);
                    if (responseData.responseNature == "Radio") {
                      formlabelData[label].response[i]["checked"] = true;
                      formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                      if (resObj.formLabelId == 916 && responseData.responseId == 241) {
                        this.setState({
                          spousePension: {
                            ...this.state.spousePension,
                            responseId: responseData.responseId,
                            userSubjectDataId: responseData.userSubjectDataId,
                            subjectId: formlabelData[label].questionId,
                          },
                        });
                      }
                      konsole.log(responseData, resObj, responseData.responseId, responseData.questionId, 'responseDataresponseDataresponseDataresponseData')

                      if (responseData.questionId == 121) {
                        this.setState({
                          incomeChange: {
                            ...this.state.incomeChange,
                            responseId: responseData.responseId
                          }
                        })
                      }
                    }
                    else if (responseData.responseNature == "Text") {
                      formlabelData[label].response[i]["response"] = responseData.response;
                      formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                      if (responseData.questionId === 122) {
                        this.setState({ currency: responseData.response })
                      }
                      if (responseData.questionId === 232) {
                        this.setState({ anticipatedIncome: responseData.response })
                      }
                    }
                    else if (responseData.responseNature == "DropDown") {
                      formlabelData[label].response[i]["selected"] = true;
                      formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                      if (resObj.formLabelId == 917) {
                        this.setState({
                          percentageValue: responseData.responseId,
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
        this.toasterAlert(Msg.ErrorMsg, "Warning");
      }
    }
    );
    this.setState({
      formlabelData: formlabelData,
    });
  };

  handleChangeForCurrencyInp = (event, id) => {
    konsole.log("eventevent", event, id);
    const eventValue = event;
    const eventId = id;
    konsole.log("Eventssss", eventId, eventValue);
    this.setState(
      {
        ...this.state,
        formlabelData: {
          ...this.state.formlabelData,
          label914: {
            ...this.state.formlabelData.label914,
            response: [{
              ...this.state.formlabelData.label914.response[0],
              response: eventValue,
            },],
          },
        },
        savingIncome: {
          userId: "",
          userSubjectDataId: this.state.formlabelData.label914 ? this.state.formlabelData.label914.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label914 && this.state.formlabelData.label914.questionId,
        },
      }, () => { konsole.log("state changed", this.state.savingIncome); }
    );
  };

  getNetIncomeForSpouse = (spouseId) => {

    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + spouseId + `/0/0/154`, "", (response) => {
      this.props.dispatchloader(true)
      if (response) {
        this.props.dispatchloader(false);
        // konsole.log("reposetytyeee",response?.data?.data,this.state.formlabelData);
        const spouseNetIncome = response?.data?.data?.userSubjects;
        const spouseNetIncomeLength = spouseNetIncome?.length;
        // konsole.log("spouseNetIncofererere",spouseNetIncome,response?.data?.data)
        if (spouseNetIncomeLength > 0) {
          this.setState(
            {
              netIncomeForSpouse: spouseNetIncome[0].response,
              spouseuserSubjectData: spouseNetIncome,
              spouseSubjectDataIdFornetIncome: spouseNetIncome[0].userSubjectDataId,
              spouseNetIncome: {
                userSubjectDataId: spouseNetIncome[0].userSubjectDataId,
                subjectId: spouseNetIncome[0].subjectId,
                subResponseData: spouseNetIncome[0].response || " ",
                responseId: spouseNetIncome[0].responseId,
                userId: spouseId,
              }
            })
        }

      }
    })
  }


  handleChangeForCurrencyInpmm = (event, id) => {
    konsole.log("eventevent", event, id);
    const eventValue = event;
    const eventId = id;
    konsole.log("Eventssss", eventId, eventValue);

    this.setState(
      {
        ...this.state,
        formlabelData: {
          ...this.state.formlabelData,
          label950: {
            ...this.state.formlabelData.label950,
            response: [{ ...this.state.formlabelData.label950.response[0], response: eventValue, },],
          },
        },
        netIncome: {
          userId: "",
          userSubjectDataId: this.state.formlabelData.label950 ? this.state.formlabelData.label950.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label950 && this.state.formlabelData.label950.questionId,
        },

      }, () => { ; konsole.log("state changed", this.state.savingIncome); }
    );

  };

  handleChangeForSpouseCurrencyInpmm = (event) => {
    konsole.log("eventeven2t", event, this.state.formlabelData.label950);
    let eventValue = event;
    this.setState(
      {
        spouseNetIncome: {
          userSubjectDataId: this.state.spouseSubjectDataIdFornetIncome,
          subjectId: this.state.formlabelData.label950.questionId,
          subResponseData: eventValue,
          responseId: this.state.formlabelData.label950.response[0].responseId,
          userId: this.state.spouseUserId,
        }
      })
  };

  handleOptionChange = (selectedOption) => {
    if (selectedOption) {
      const currencyValue = selectedOption.label === 'Other' ? '' : selectedOption.label.replace('%', '');
      this.setState({
        percentageValue: selectedOption.value,
        currency: currencyValue
      });
    } else {
      this.setState({
        percentageValue: 0,
        currency: ''
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.spousePension !== this.state.spousePension) {
      console.log("Updated spousePension:", this.state.spousePension);
    }
  }

  handleChange = (event) => {
    const eventName = event.target.name;
    const eventValue = event.target.value;
    const eventId = event.target.id;
    konsole.log("events", eventId, eventName, eventValue);
    if (eventName === "spousePension") {
      this.setState({
        spousePensionShow: eventValue === "Yes",
        spousePension: {
          userId: "",
          userSubjectDataId: this.state.formlabelData?.label916?.userSubjectDataId || 0,
          responseId: eventId,
          response: eventValue,
          subjectId: this.state.formlabelData?.label916?.questionId || 0,
        },
      });
      konsole.log(this.state.formlabelData?.label916, "axjjjsadsjdsjdsjdsjd")
    } else if (eventName == "incomeChange") {
      this.setState({
        ...this.state,
        incomeChange: {
          userId: "",
          userSubjectDataId: this.state.formlabelData.label918 ? this.state.formlabelData.label918.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label918 && this.state.formlabelData.label918.questionId,
        },
      });
    } else if (eventName == "AnticipationComment") {
      this.setState(
        {
          ...this.state,
          formlabelData: {
            ...this.state.formlabelData,
            label1034: {
              ...this.state.formlabelData.label1034,
              response: [{ ...this.state.formlabelData.label1034.response[0], response: eventValue, },],
            },
          },
          AnticipationComment: {
            userId: "",
            userSubjectDataId: this.state.formlabelData.label1034 ? this.state.formlabelData.label1034.userSubjectDataId : 0,
            responseId: eventId,
            subResponseData: eventValue,
            subjectId: this.state.formlabelData.label1034 && this.state.formlabelData.label1034.questionId,
          },

        }
      );


    }
  };

  radioValue = (event) => {
    const radioName = event.target.name;
    const radioValue = event.target.value;
    if (radioName == "spousePension" && radioValue == "Yes") {
      this.setState({ ...this.state, [radioName]: true });
    } else {
      this.setState({ ...this.state, [radioName]: false, percentageValue: "" });
    }
  };


  handleSaveIncome = () => {
    let reqcnt = 0;
    let rescnt = 0;
    let boolres = true;

    let putSpousenetIncome =
    {
      userId: this.state.spouseUserId,
      userSubjects: [
        {
          userSubjectDataId: this.state.spouseNetIncome.userSubjectDataId,
          subjectId: this.state.spouseNetIncome.subjectId,
          subResponseData: this.state.spouseNetIncome.subResponseData,
          responseId: this.state.spouseNetIncome.responseId,
        }

      ]
    }

    if (this.state.spouseUserId != null && this.state.spouseUserId != undefined && this.state.spouseUserId != "" && this.state.spouseUserId != 'null')
    // if (this.state.spouseUserId !=null && this.state.spouseUserId != undefined && this.state.spouseUserId!="")
    {
      $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putusersubjectdata, putSpousenetIncome, ((response, error) => {
        if (response) {
          // konsole.log(response,"response put")
        }
      }))

    }

    let userIncomeObjList = [];
    for (let lpcnt = 0; lpcnt < this.state.IncomeDetailsprimary.length; lpcnt++) {
      // reqcnt++;
      // let totalinput = {
      //   userId: this.state.userId,
      userIncomeObjList.push({
        incomeTypeId: this.state.IncomeDetailsprimary[lpcnt].incomeTypeId,
        grossAmt: this.state.IncomeDetailsprimary[lpcnt].grossAmt1,
        retProjAmt: this.state.IncomeDetailsprimary[lpcnt].retProjAmt1,
        userIncomeId: this.state.IncomeDetailsprimary[lpcnt].userIncomeId,
        isActive: true,
      })

    }

    const totalInput = {
      userIncome: userIncomeObjList,
      userId: this.state.userId,
      upsertedBy: this.state.loggedInUser
    }
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.upsertUserIncome, totalInput, (response) => {
      this.props.dispatchloader(false);
      konsole.log("Success res" + JSON.stringify(response));

      if (response) {
        AlertToaster.success(`Data ${this.state.isUpdating ? 'updated' : 'saved'} successfully`);
        this.fetchincometypes();
      } else {
        this.toasterAlert(Msg.ErrorMsg, "Warning");
      }
    }
    );

    if (this.state.spouseUserId !== "null") {
      let userIncomeOBJList4Spouse = [];
      for (let lpcnt = 0; lpcnt < this.state.IncomeDetailsspouse.length; lpcnt++) {
        userIncomeOBJList4Spouse.push({
          incomeTypeId: this.state.IncomeDetailsspouse[lpcnt].incomeTypeId,
          grossAmt: this.state.IncomeDetailsspouse[lpcnt].grossAmt2,
          retProjAmt: this.state.IncomeDetailsspouse[lpcnt].retProjAmt2,
          userIncomeId: this.state.IncomeDetailsspouse[lpcnt].userIncomeId,
          isActive: true,
        })
      }

      const totalInputSpouse = {
        userIncome: userIncomeOBJList4Spouse,
        userId: this.state.spouseUserId,
        upsertedBy: this.state.loggedInUser
      }
      $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.upsertUserIncome, totalInputSpouse, (response) => {
        this.props.dispatchloader(false);
        konsole.log("Success res" + JSON.stringify(response));

        if (response) {
          konsole.log("res_totalInputSpouse", response);
        } else {
          this.toasterAlert(Msg.ErrorMsg, "Warning");
        }
      }
      );
    }
    this.props.handlemonthIncomePopShow();
    this.handleUpdateSubmit();
    this.props.reduxDispatch()
  };

  handleSubjectSubmit = () => {
    let savingIncome = {
      userSubjectDataId: this.state.savingIncome.userSubjectDataId,
      subjectId: this.state.savingIncome.subjectId,
      subResponseData: this.state.savingIncome.subResponseData,
      responseId: this.state.savingIncome.responseId,
      userId: this.state.userId,
    };
    let netIncome = {
      userSubjectDataId: this.state.netIncome.userSubjectDataId,
      subjectId: this.state.netIncome.subjectId,
      subResponseData: this.state.netIncome.subResponseData,
      responseId: this.state.netIncome.responseId,
      userId: this.state.userId,
    };
    let spousePension = {
      userSubjectDataId: this.state.spousePension.userSubjectDataId,
      subjectId: this.state.spousePension.subjectId,
      subResponseData: this.state.spousePension.subResponseData,
      responseId: this.state.spousePension.responseId,
      userId: this.state.userId,
    };

    let incomeChange = {
      userSubjectDataId: this.state.incomeChange.userSubjectDataId,
      subjectId: this.state.incomeChange.subjectId,
      subResponseData: this.state.incomeChange.subResponseData,
      responseId: this.state.incomeChange.responseId,
      userId: this.state.userId,
    };
    let AnticipationComment = {
      userSubjectDataId: this.state.AnticipationComment.userSubjectDataId,
      subjectId: this.state.AnticipationComment.subjectId,
      subResponseData: this.state.AnticipationComment.subResponseData,
      responseId: this.state.AnticipationComment.responseId,
      userId: this.state.userId,
    };

    let percentageValue = {
      userSubjectDataId: this.state.formlabelData?.label917?.userSubjectDataId,
      subjectId: this.state.formlabelData?.label917?.questionId,
      responseId: this.state.percentageValue,
      userId: this.state.userId,
    };

    let currency = {
      userSubjectDataId: this.state.formlabelData?.label919?.userSubjectDataId,
      subjectId: this.state.formlabelData?.label919?.questionId,
      responseId: this.state.formlabelData?.label919?.response[0].responseId,
      subResponseData: this.state.currency,
      userId: this.state.userId,
    };



    let anticipatedIncome = {
      userSubjectDataId: this.state.formlabelData?.label1028?.userSubjectDataId,
      subjectId: this.state.formlabelData?.label1028?.questionId,
      responseId: this.state.formlabelData?.label1028?.response[0].responseId,
      subResponseData: this.state.anticipatedIncome,
      userId: this.state.userId,
    };

    let totinptary = [];
    if (savingIncome.subjectId !== 0 && savingIncome.subResponseData !== "" && savingIncome.responseId !== 0) {
      totinptary.push(savingIncome);
    }
    if (netIncome.subjectId !== 0 && netIncome.subResponseData !== "" && netIncome.responseId !== 0) {
      totinptary.push(netIncome);
    }
    if (spousePension.subjectId !== 0 && spousePension.subResponseData !== "" && spousePension.responseId !== 0) {
      totinptary.push(spousePension);
    }
    if (incomeChange.subjectId !== 0 && incomeChange.subResponseData !== "" && incomeChange.responseId !== 0) {
      totinptary.push(incomeChange);
    }
    if (AnticipationComment.subjectId !== 0 && AnticipationComment.subResponseData !== "" && AnticipationComment.responseId !== 0) {
      totinptary.push(AnticipationComment);
    }
    if (percentageValue.subjectId !== 0 && percentageValue.responseId !== 0 && this.state.spousePension.responseId == 241) {
      totinptary.push(percentageValue);
    }
    if (currency.subjectId !== 0 && currency.responseId !== 0 && this.state.spousePension.responseId == 241) {
      totinptary.push(currency);
    }

    if (this.state.incomeChange.responseId == 247 && anticipatedIncome.subjectId !== 0 && anticipatedIncome.responseId !== 0) {

      totinptary.push(anticipatedIncome)
    }

    konsole.log("inputCLonssss", totinptary);
    this.props.dispatchloader(true);
    // $CommonServiceFn.InvokeCommonApi(
    //   "POST",
    //   $Service_Url.postaddusersubjectdata, // + "?userId=" + this.state.userId
    //   totinptary,
    //   (response) => {
    //     this.props.dispatchloader(false);
    //     konsole.log("Success res33",response);
    //     if (response) {
    //       this.getsubjectForFormLabelId(this.state.userId);
    //       // alert("Saved Successfully");
    //     } else {
    //       // alert(Msg.ErrorMsg);
    //     }
    //     this.handleUpdateSubmit()
    //   }
    // );
  };

  hideLastName(memberspouseDetails) {
    konsole.log("memberspouseDetails", memberspouseDetails);
    // konsole.log(this.hideLastName(memberspouseDetails));
    return memberspouseDetails?.split(" ")[0] || "";
  }

  handleUpdateSubmit = () => {
    let savingIncome = {
      userSubjectDataId: this.state.savingIncome.userSubjectDataId,
      subjectId: this.state.savingIncome.subjectId,
      subResponseData: this.state.savingIncome.subResponseData,
      responseId: this.state.savingIncome.responseId,
      userId: this.state.userId,
    };

    let netIncome = {
      userSubjectDataId: this.state.netIncome.userSubjectDataId,
      subjectId: this.state.netIncome.subjectId,
      subResponseData: this.state.netIncome.subResponseData,
      responseId: this.state.netIncome.responseId,
      userId: this.state.userId,
    };

    let spousePension = {
      userSubjectDataId: this.state.spousePension.userSubjectDataId,
      subjectId: this.state.spousePension.subjectId,
      subResponseData: this.state.spousePension.subResponseData,
      responseId: this.state.spousePension.responseId,
      userId: this.state.userId,
    };

    konsole.log(this.state.spousePension, "asjjasdjsjdsjdsjdssjdsj")

    let incomeChange = {
      userSubjectDataId: this.state.incomeChange.userSubjectDataId,
      subjectId: this.state.incomeChange.subjectId,
      subResponseData: this.state.incomeChange.subResponseData,
      responseId: this.state.incomeChange.responseId,
      userId: this.state.userId,
    };

    let AnticipationComment = {
      userSubjectDataId: this.state.AnticipationComment.userSubjectDataId,
      subjectId: this.state.AnticipationComment.subjectId,
      subResponseData: this.state.AnticipationComment.subResponseData,
      responseId: this.state.AnticipationComment.responseId,
      userId: this.state.userId,
    };

    let percentageValue = {
      userSubjectDataId: this.state.formlabelData?.label917?.userSubjectDataId,
      subjectId: this.state.formlabelData?.label917?.questionId,
      responseId: this.state.percentageValue,
      userId: this.state.userId,
    };

    let currency = {
      userSubjectDataId: this.state.formlabelData?.label919?.userSubjectDataId,
      subjectId: this.state.formlabelData?.label919?.questionId,
      subResponseData: this.state.currency,
      userId: this.state.userId,
      responseId: this.state.formlabelData?.label919?.response[0].responseId,
    };

    let anticipatedIncome = {
      userSubjectDataId: this.state.formlabelData?.label1028?.userSubjectDataId,
      subjectId: this.state.formlabelData?.label1028?.questionId,
      responseId: this.state.formlabelData?.label1028?.response[0].responseId,
      subResponseData: this.state.anticipatedIncome,
      userId: this.state.userId,
    };

    konsole.log("income Change in api", savingIncome, incomeChange.userSubjectDataId, spousePension);
    let totinptary = [];
    if (savingIncome.subjectId !== 0 && savingIncome.subResponseData !== "" && savingIncome.responseId !== 0) {
      totinptary.push(savingIncome);
    }
    if (netIncome.subjectId !== 0 && netIncome.subResponseData !== "" && netIncome.responseId !== 0) {
      totinptary.push(netIncome);
    }
    if (spousePension.subjectId !== 0 && spousePension.responseId !== 0) {
      totinptary.push(spousePension);
    }
    if (incomeChange.subjectId !== 0 && incomeChange.responseId !== 0) {
      totinptary.push(incomeChange);
    }
    if (AnticipationComment.subjectId !== 0 && AnticipationComment.responseId !== 0) {
      totinptary.push(AnticipationComment);
    }
    if (percentageValue.subjectId !== 0 && percentageValue.responseId !== 0 && this.state.spousePension.responseId == 241) {
      totinptary.push(percentageValue);
    }
    if (currency.subjectId !== 0 && currency.subResponseData !== 0 && this.state.spousePension.responseId == 241) {
      totinptary.push(currency);
    }
    if (this.state.incomeChange.responseId == 247 && anticipatedIncome.subjectId !== 0 && anticipatedIncome.responseId !== 0) {
      totinptary.push(anticipatedIncome)
    }

    let inputData = {
      userId: this.state.userId,
      userSubjects: totinptary,
    };

    konsole.log("totinptary", totinptary);
    konsole.log("inputdataUU inputCLonssss", JSON.stringify(inputData));
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putSubjectResponse, inputData, (response) => {
      this.props.dispatchloader(false);
      konsole.log("Success res1212" + JSON.parse(response));
      if (response) {
        // AlertToaster.success("Data updated successfully");
        this.props.handlemonthIncomePopShow();
        this.getsubjectForFormLabelId(this.state.userId);
      } else {
        // alert(Msg.ErrorMsg);
        this.props.handlemonthIncomePopShow();
      }
    }
    );
  };
  maxlength = (e) => {
    konsole.log("dgfdgfdg", e);
    if (e == null || e <= 100) {
      // return e;
      this.setState({ currency: e });
      return e;
    } else {
      // this.setState({currency:''})
      // return  alert("% not be more than 100")
    }
  };

  handleCurrencyInputChange = (value) => {
    if (value === '' || value == null) {
      this.setState({
        currency: '',
        percentageValue: 0
      });
    } else if (value <= 100) {
      const percentageOptions = this.state.formlabelData?.label917?.response?.map((map) => {
        return { value: map.responseId, label: map.response };
      }) || [];
      this.setState({ currency: value }, () => {
        if (Array.isArray(percentageOptions)) {
          const matchingOption = percentageOptions?.find(option => option.label === `${this.state?.currency}%`);
          if (matchingOption) {
            this.setState({
              percentageValue: matchingOption?.value
            });
          } else {
            const otherId = percentageOptions?.find(option => option.label === `Other`)?.value;
            this.setState({
              percentageValue: otherId
            });
          }
        } else {
          this.setState({
            percentageValue: 0
          });
        }
      });
    }
  };

  maxlengthValue = (e) => {
    this.setState({ anticipatedIncome: e });
  };

  toasterAlert(text, type) {
    this.context.setdata({ open: true, text: text, type: type });
  }

  render() {
    // const percentageOptions = [
    //     { value: "Percentage Value", label: "Percentage Value" },
    //     { value: "100%", label: "100%" },
    //     { value: "75%", label: "75%" },
    //     { value: "50%", label: "50%" },
    //     { value: "Other", label: "Other" },
    // ]
    konsole.log('isWorkingPrimaryCheckisWorkingPrimaryCheck', this.state.isWorkingPrimaryCheck, this.state.isWorkingSpouseCheck)

    const percentageOptions = this.state.formlabelData?.label917?.response?.map((map) => {
      return { value: map.responseId, label: map.response };
    }) || [];

    const getSelectedOption = () => {
      if (this.state.currency === '' || this.state.currency === '0') {
        return null;
      }

      const formattedCurrency = `${this.state.currency}%`;
      const matchingOption = percentageOptions.find(option => option.label === formattedCurrency);

      return matchingOption || percentageOptions.find(option => option.label === 'Other');
    };

    const percentageValueObj = (this.state.currency === '' || this.state.currency === '0')
      ? null
      : (this.state.percentageValue !== 0 && percentageOptions.length > 0
        ? percentageOptions.find(filt => filt.value === this.state.percentageValue)
        : getSelectedOption());

    konsole.log("incomePrimary", this.state);
    // let netIncome = {
    //   userSubjectDataId: this.state.netIncome.userSubjectDataId,
    //   subjectId: this.state.netIncome.subjectId,
    //   subResponseData: this.state.netIncome.subResponseData,
    //   responseId: this.state.netIncome.responseId,
    //   userId: this.state.userId,
    // };
    konsole.log("dsdsdsdsd", this.state.spouseNetIncome)
    // konsole.log("spouseNetIncome",this?.state?.formlabelData)
    return (
      <>
        <style jsx global>{` .modal-open .modal-backdrop.show {opacity: 0;} `}</style>
        <Modal show={this.props.show} size="lg" enforceFocus={false} centered onHide={this.props.handlemonthIncomePopShow} animation="false" backdrop="static" id="monthlyIncomeId">
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Monthly Income </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="person-content">
              <Container className="mb-3 mnthlyIncmTble">
                <div className="table-responsive">
                  <Table bordered >
                    <thead className="text-center">
                      {/* {(((this.state.isWorkingPrimaryCheck == true || this.state.isWorkingSpouseCheck == true) || (this.state.isWorkingPrimaryCheck == null || this.state.isWorkingSpouseCheck == null) && this.state.spouseUserId !== "null")) &&
                          <tr className="border-0">
                            {((this.state.isWorkingPrimaryCheck == true || this.state.isWorkingPrimaryCheck == null) && (this.state.isWorkingSpouseCheck == true || this.state.isWorkingSpouseCheck == null)) !== true && <th className="border-0"></th>}
                            {((this.state.isWorkingSpouseCheck == true && this.state.isWorkingPrimaryCheck == true) || (this.state.isWorkingSpouseCheck == null && this.state.isWorkingPrimaryCheck == true) || (this.state.isWorkingPrimaryCheck == null)) && (
                              <th className="border-0"></th>
                            )}
                            {(this.state.spouseUserId !== "null" && ((this.state.isWorkingSpouseCheck == true && this.state.isWorkingPrimaryCheck == null) || this.state.isWorkingSpouseCheck == null)) && <th className="border-0"></th>}
                            {(((this.state.isWorkingPrimaryCheck == true && this.state.isWorkingSpouseCheck == true) || (this.state.isWorkingPrimaryCheck == false && this.state.isWorkingSpouseCheck == false) || (this.state.isWorkingPrimaryCheck == null && this.state.isWorkingSpouseCheck == null)) && this.state.spouseUserId !== "null") && <th className="border-0"></th>}
                            <th colSpan={2} className="border text-dark bg-grey" style={{ backgroundColor: "#DCDCDC" }}>Projected Retirement Income</th>
                          </tr>
                        } */}
                      <tr className="border-0">
                        <th className="border-0" style={{ width: "35%" }}></th>
                        {(this.state.isWorkingPrimaryCheck == true || this.state.isWorkingPrimaryCheck == null) &&
                          <th className="border "> {this.hideLastName($AHelper.capitalizeAllLetters(this.state.memberspouseDetails?.memberName))} <br />{this.state.spouseUserId !== "null" && '(Primary)'}</th>}


                        {((this.state.isWorkingSpouseCheck == true || this.state.isWorkingSpouseCheck == null) && this.state.spouseUserId !== "null") && (
                          <th className="border ">{this.hideLastName($AHelper.capitalizeAllLetters(this.state.memberspouseDetails?.spouseName))}<br />(Spouse)</th>
                        )}
                        
                          <th className="border"> {this.hideLastName($AHelper.capitalizeAllLetters(this.state.memberspouseDetails?.memberName))} <br /> Projected Retirement</th>
                        
                        {(this.state.spouseUserId !== "null") && (
                          <th className="border "> {this.hideLastName($AHelper.capitalizeAllLetters(this.state.memberspouseDetails?.spouseName))} <br /> Projected Retirement</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.IncomeTypes.length > 0 &&
                        this.state.IncomeTypes.map((incometype, index) => {
                          let priamryIncomeGrossAmt = this.state.IncomeDetailsprimary.length > 0 && this.state.IncomeDetailsprimary[index].grossAmt1;
                          let priamryIncomeRetAmt = this.state.IncomeDetailsprimary.length > 0 && this.state.IncomeDetailsprimary[index].retProjAmt1;
                          let spouseIncomeGrossAmt = this.state.IncomeDetailsspouse.length > 0 && this.state.IncomeDetailsspouse[index].grossAmt2;
                          let spouseIncomeRetAmt = this.state.IncomeDetailsspouse.length > 0 && this.state.IncomeDetailsspouse[index].retProjAmt2;

                          console.log("IncomeDetailsspouse", spouseIncomeRetAmt, this.state.IncomeDetailsspouse)

                          return (
                            <tr>
                              <td>{incometype.label}</td>
                              {(this.state.isWorkingPrimaryCheck == true || this.state.isWorkingPrimaryCheck == null) &&
                                <td className="p-0">
                                  <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" name="grossAmt1"
                                    onValueChange={(value, name) => { this.handleDynmaicPrimaryInputchange(value, name, index); }}
                                    value={priamryIncomeGrossAmt}
                                  />
                                </td>}

                              {console.log('isWorkingSpouseCheckisWorkingSpouseCheck', this.state.isWorkingSpouseCheck)}
                              {((this.state.isWorkingSpouseCheck == true || this.state.isWorkingSpouseCheck == null) && this.state.spouseUserId !== "null") && (
                                <td className="p-0">
                                   <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" name="grossAmt2"
                                    onValueChange={(value, name) => {
                                      this.handleDynmaicSpouseInputchange(value, name, index);
                                    }}
                                    value={spouseIncomeGrossAmt}
                                  />
                                </td>
                              )}

                              <td className="p-0">
                                 <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" name="retProjAmt1"
                                  onValueChange={(value, name) => { this.handleDynmaicPrimaryInputchange(value, name, index); }}
                                  value={priamryIncomeRetAmt}
                                />
                              </td>

                              {(this.state.spouseUserId !== "null") && (
                                <td className="p-0">
                                    <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" name="retProjAmt2"
                                    onValueChange={(value, name) => { this.handleDynmaicSpouseInputchange(value, name, index); }}
                                    value={spouseIncomeRetAmt}
                                  />
                                </td>
                              )}
                            </tr>
                          );
                        })}

                      <tr>
                        <td className="text-start">TOTAL:</td>
                        {(this.state.isWorkingPrimaryCheck == true || this.state.isWorkingPrimaryCheck == null) &&
                          <td>
                             <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" value={this.state.totgrossamntprimary} disabled />
                          </td>}

                        {((this.state.isWorkingSpouseCheck == true || this.state.isWorkingSpouseCheck == null) && this.state.spouseUserId !== "null") && (
                          <td>
                             <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" value={this.state.totgrossamntspouse} disabled />
                          </td>
                        )}
                        <td>
                           <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" value={this.state.totrefprojamtprimary} disabled />
                        </td>

                        {(this.state.spouseUserId !== "null") && (
                          <td>
                            <CurrencyInput prefix="$" allowNegativeValue={false} className="border-0" value={this.state.totrefprojamtspouse} disabled />
                          </td>
                        )}


                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Container>
              <Container>
                <Form.Group as={Row} className="">
                  {(this.state.formlabelData.label950) && (
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
                              {this.state.formlabelData.label950.response.map(
                                (response) => {
                                  konsole.log("ccxcxccx", response, this.state.formlabelData)
                                  return (
                                    <>
                                      <div className="styleCurrentNetIncome">  {$AHelper.capitalizeAllLetters(this.state.memberspouseDetails?.memberName)}</div>
                                      <CurrencyInput
                                        prefix="$"
                                        allowNegativeValue={false}
                                        className="border-1 border-secondary p-0"
                                        id={response.responseId}
                                        value={response.response}
                                        name="netIncome"
                                        onValueChange={(event) => this.handleChangeForCurrencyInpmm(event, response.responseId)}
                                      />
                                    </>


                                  );
                                }
                              )}
                            </div>

                          </div>
                          <div className="col-4">
                            {(this.state.spouseUserId !== "null") && (
                              <>
                                <div className="styleCurrentNetIncome">{$AHelper.capitalizeAllLetters(this.state.memberspouseDetails?.spouseName)}</div>
                                <div>
                                  <CurrencyInput
                                    prefix="$"
                                    allowNegativeValue={false}
                                    className="border-1 border-secondary p-0"
                                    value={this?.state?.spouseNetIncome?.subResponseData}
                                    onValueChange={(event) => this.handleChangeForSpouseCurrencyInpmm(event)}
                                  />
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
                                <CurrencyInput prefix="$" allowNegativeValue={false} className="border-1 border-secondary" id={response.responseId}
                                  value={response.response} name="savingIncome"
                                  onValueChange={(event) => this.handleChangeForCurrencyInp(event, response.responseId)}
                                />
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
                                      value={response.responseId}
                                      onChange={(event) => this.handleChange(event)}
                                    />
                                  </div>
                                );
                              }
                            )}
                          {/* <div>
                                                 <Form.Check className="left-radio" label="No" name="spousePension" type="radio" id="inline-radio-2" defaultValue="No" onChange={(event) => this.radioValue(event)} />
                                             </div> */}
                        </div>
                      </div>
                    </Col>

                    {this.state.spousePension.responseId == 241 ? (
                      <Col xs sm="4" lg="3">
                        <Select className="custom-select" options={percentageOptions} value={percentageValueObj} name="percentageValue"
                          onChange={this.handleOptionChange} isSearchable={false}
                        />
                      </Col>
                    ) : ("")}

                    {this.state.spousePension.responseId == 241 ? (
                      <Col xs sm="4" lg="3">
                        <CurrencyInput suffix="%" allowNegativeValue={false} value={this.state.currency}
                          onValueChange={e => this.handleCurrencyInputChange(e)}
                          name="PercentCurrency" className="border-1 border-secondary"
                        />
                      </Col>
                    ) : ("")}
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
                                    id={response.responseId} defaultValue={response.response} defaultChecked={response.checked}
                                    onChange={(event) => this.handleChange(event)}
                                  />
                                </div>
                              );
                            }
                          )}
                      </div>
                    </div>
                  </Col>

                </Form.Group>
                {(this.state.incomeChange.responseId == 247) &&

                  <Form.Group>
                    <div className="row w-100">
                      <div className="col-4">
                        <div className="styleCurrentNetIncome"> Anticipated Income</div>

                        <div>
                          <CurrencyInput
                            prefix="$"
                            allowNegativeValue={false}
                            className="border-1 border-secondary p-0"
                            value={isNaN(this.state.anticipatedIncome) ? null : this.state.anticipatedIncome}
                            name="anticipatedIncome"
                            onValueChange={(event) => this.maxlengthValue(event)}
                          />
                        </div>
                      </div>
                      <div className="col-7" style={{ marginTop: '9px' }}>
                        {/* <div className="styleCurrentNetIncome">
                          {" "}{this.state.formlabelData.label1034 && this.state.formlabelData.label1034.question}{" "}
                        </div> */}

                        {this.state.formlabelData.label1034 &&
                          this.state.formlabelData.label1034.response.map(
                            (response) => {
                              return (
                                <Form.Control label={response.response} name="AnticipationComment" type="text"
                                  id={response.responseId}
                                  value={response.response}
                                  placeholder="Comment"
                                  onChange={(event) => this.handleChange(event)}
                                />
                              );
                            }
                          )}
                      </div>
                    </div>
                  </Form.Group>
                }

                {/* {this.state.incomeChange.responseId == 247 ? (
                  <Col xs sm="4" lg="3">
                    <input value={this.state.anticipatedIncome}
                      onChange={(e) => this.maxlengthValue(e.target.value)} name="anticipatedIncome" className="border-1 border-secondary"
                    />
                  </Col>
                ) : ("")} */}

                {/* {this.state.incomeChange.responseId == 247 ? (
                  <Form.Group as={Row} className="">
                    <Col xs sm="12" lg="12" className="d-flex align-items-start flex-column" id="monthlyIncomeId1">
                      <div className="">
                        <label className="">
                          {" "}{this.state.formlabelData.label1034 && this.state.formlabelData.label1034.question}{" "}
                        </label>
                      </div>
                      <div className="d-flex align-items-center">
                        {this.state.formlabelData.label1034 &&
                          this.state.formlabelData.label1034.response.map(
                            (response) => {
                              return (
                                <div className="mb-2">
                                  <Form.Control label={response.response} name="AnticipationComment" type="text"
                                    id={response.responseId}
                                    value={response.response}
                                    onChange={(event) => this.handleChange(event)}
                                  />

                                </div>
                              );
                            }
                          )}
                      </div>
                    </Col>
                  </Form.Group>
                ) : ("")} */}
              </Container>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button style={{ backgroundColor: "#76272b", border: "none" }} className="theme-btn" onClick={this.handleSaveIncome}> Save</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
  reduxDispatch: () => {
    dispatch(setprimaryUserMonthlyIncome(''));
    dispatch(setSpouseUserMonthlyIncome(''));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyIncome);
