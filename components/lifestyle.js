import React, { Component } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, Popover, OverlayTrigger } from "react-bootstrap";
import Select from "react-select";
import { $CommonServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import { health } from "./control/Constant";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import { $AHelper } from "../components/control/AHelper";
import AlertToaster from "./control/AlertToaster";
import { globalContext } from "../pages/_app";

export class lifestyle extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props);
    this.state = this.getInitialState
  }
  getInitialState = {
      show: false,
      habit1: false,
      alcohol1: false,
      formlabelData: {},
      updateCaregiverSuitabilty: false,
      naturalHabitIdSave: "",
      duplicateDNaturalHabitIdSave:"",
      weekExerciseValue: "",
      isSmoke:'',
      isEverSmoked:'',
      updateOrSave: false,

      healthy: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      habit: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      long: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      checkup: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      worry: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      worryHealth: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      socially: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      purpose: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      quitSmoke: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      exerciseDescribe: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      drug: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      smoke: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      everSmoke: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      alcohol: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      drinks: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      beer: [],
      naturalHabitId: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
      weekExerciseId: {
        userId: "",
        userSubjectDataId: 0,
        subjectId: 0,
        subResponseData: "string",
        responseId: 0,
      },
    };
  handleClose = () => {
    // this.getsubjectForFormLabelId(this.props.UserDetail.userId)
    konsole.log("sjow");
    this.context.setPageTypeId(null)
    this.setState({
      show: false,
      beer: [],
      naturalHabitIdSave:this.state.duplicateDNaturalHabitIdSave,
    });  
    this.setState(this.getInitialState)
  };

  handleShow = () => {
    konsole.log("sjow open");
    this.context.setPageTypeId(6)
    this.setState({
      show: true,
      updateOrSave: false,
    });

    // if(Object.keys(this.state.formlabelData).length === 0) {
    // }
    this.getsubjectForFormLabelId(this.props.UserDetail.userId)
  };

  JSONObj = ( userId, userSubjectDataId, responseId, responseValue, subjectId) => {
    return {
      userId: userId,
      userSubjectDataId: userSubjectDataId == null ? 0 : userSubjectDataId,
      responseId: responseId,
      subResponseData: responseValue,
      subjectId: subjectId,
    };
  };

  handleChange = (e) => {
    
    konsole.log("eventNameeventNameeventName",e);
    const eventId = e.target.id;
    const eventValue = e.target.value;
    const eventKey = e.target.key;
    const eventName = e.target.name;
    konsole.log("eventNameeventNameeventName",eventName,eventId,eventValue);
    konsole.log("inputCLons", eventKey, e);

    if (eventName == "habit" && eventValue == "Regularly exercise") {
        const exerciseDescribe = document.querySelector(`input[name="exerciseDescribe"]`);
        exerciseDescribe.value = "";
        konsole.log(exerciseDescribe, "sdhfjksdhkfjsdhf");
      // konsole.log(eventName,eventId,eventValue);
      this.setState({
        ...this.state,
        habit1: true,
        habit: {
          userId: "",
          userSubjectDataId: this.state.formlabelData.label103 ? this.state.formlabelData.label103.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label103 &&  this.state.formlabelData.label103.questionId,
        },
      });
    } else if (eventName == "habit" && eventValue !== "Regularly exercise") {
      // konsole.log(eventName,eventId,eventValue, "else");
      const exerciseDescribe = document.querySelector(`input[name="exerciseDescribe"]`);
      exerciseDescribe.value = "";
      this.setState({
        ...this.state,
        habit1: false,
        habit: {
          userId: "",
          userSubjectDataId: this.state.formlabelData.label103 ? this.state.formlabelData.label103.userSubjectDataId  : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label103 &&  this.state.formlabelData.label103.questionId,
        },
      });
    } else if (eventName == "healthy") {
      this.setState({
        ...this.state,
        healthy: {
          userSubjectDataId: this.state.formlabelData.label102 ? this.state.formlabelData.label102.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:  this.state.formlabelData.label102 &&  this.state.formlabelData.label102.questionId,
        },
      });
    } else if (eventName == "exerciseDescribe") {
      this.setState({
        ...this.state,
        exerciseDescribe: {
          userSubjectDataId: this.state.formlabelData.label196 ? this.state.formlabelData.label196.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label196 &&  this.state.formlabelData.label196.questionId,
        },
      });
    } else if (eventName == "long") {
      this.setState({
        ...this.state,
        long: {
          userSubjectDataId: this.state.formlabelData.label105  ? this.state.formlabelData.label105.userSubjectDataId  : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label105 &&
            this.state.formlabelData.label105.questionId,
        },
      });
    } else if (eventName == "checkup") {
      this.setState({
        ...this.state,
        checkup: {
          userSubjectDataId: this.state.formlabelData.label107
            ? this.state.formlabelData.label107.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label107 &&
            this.state.formlabelData.label107.questionId,
        },
      });
    } else if (eventName == "worry" && eventValue == "Yes") {
      this.setState({
        ...this.state,
        worryAboutHealth: true,
        worry: {
          userSubjectDataId: this.state.formlabelData.label108
            ? this.state.formlabelData.label108.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label108 &&
            this.state.formlabelData.label108.questionId,
        },
      });
    } else if (eventName == "worry" && eventValue == "No") {
      this.setState({
        ...this.state,
        worryAboutHealth: false,
        worry: {
          userSubjectDataId: this.state.formlabelData.label108
            ? this.state.formlabelData.label108.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label108 &&
            this.state.formlabelData.label108.questionId,
        },
      });
    } else if (eventName == "socially") {
      this.setState({
        ...this.state,
        socially: {
          userSubjectDataId: this.state.formlabelData.label109
            ? this.state.formlabelData.label109.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label109 &&
            this.state.formlabelData.label109.questionId,
        },
      });
    } else if (eventName == "worryHealth") {
      this.setState({
        ...this.state,
        worryHealth: {
          userSubjectDataId: this.state.formlabelData.label949
            ? this.state.formlabelData.label949.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label949 &&
            this.state.formlabelData.label949.questionId,
        },
      });
    } else if (eventName == "purpose") {
      this.setState({
        ...this.state,
        purpose: {
          userSubjectDataId: this.state.formlabelData.label110 ? this.state.formlabelData.label110.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label110 && this.state.formlabelData.label110.questionId,
        },
      });
    }else if (eventName == "quitSmoke") {
      this.setState({
        ...this.state,
        quitSmoke: {
          userSubjectDataId: this.state.formlabelData.label1036? this.state.formlabelData.label1036.userSubjectDataId: 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label1036 && this.state.formlabelData.label1036.questionId,
        },
      });
    } 
     else if (eventName == "drug") {
      this.setState({
        ...this.state,
        drug: {
          userSubjectDataId: this.state.formlabelData.label111
            ? this.state.formlabelData.label111.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label111 &&
            this.state.formlabelData.label111.questionId,
        },
      });
    } else if (eventName == "smoke") {

      console.log("handleChange",eventValue)
      this.setState({
        ...this.state,
        smoke: {
          userSubjectDataId: this.state.formlabelData.label112
            ? this.state.formlabelData.label112.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label112 &&
            this.state.formlabelData.label112.questionId,
        },
        isSmoke:eventValue
      });
    } else if (eventName == "everSmoke") {

      this.setState({
        ...this.state,
        everSmoke: {
          userSubjectDataId: this.state.formlabelData.label1035 ? this.state.formlabelData.label1035.userSubjectDataId : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId: this.state.formlabelData.label1035 && this.state.formlabelData.label1035.questionId,
        },
        isEverSmoked:eventValue
      });
    } else if (eventName == "alcohol" && eventValue == "Yes") {
      this.setState({
        ...this.state,
        alcohol1: true,
        alcohol: {
          userSubjectDataId: this.state.formlabelData.label113
            ? this.state.formlabelData.label113.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label113 &&
            this.state.formlabelData.label113.questionId,
        },
      });
    } else if (eventName == "alcohol" && eventValue !== "Yes") {
      this.setState({
        ...this.state,
        alcohol1: false,
        alcohol: {
          userSubjectDataId: this.state.formlabelData.label113
            ? this.state.formlabelData.label113.userSubjectDataId
            : 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label113 &&
            this.state.formlabelData.label113.questionId,
        },
      });
    } else if (eventName == "beer") {
      const userSubjectDataId = e.target.getAttribute("userSubjectDataId");
      const indexOfbeer = e.target.getAttribute("indexOfBeer");
      const eventChecked = e.target.checked;
      const questionId = this.state.formlabelData.label195? this.state.formlabelData?.label195?.questionId: null;
      let labelResponseList=this.state.formlabelData.label195;
      konsole.log("questionIdquestionId",questionId, eventValue,eventChecked,"eventId", eventId, userSubjectDataId)
      konsole.log("questionresponse",eventValue,userSubjectDataId,questionId,eventChecked,userSubjectDataId !== undefined &&  userSubjectDataId !== "" &&  eventValue);
      let beerRelatedObj = this.state.beer;

      let beerRelatedObjFilter = this.state.beer.filter((filt) => filt.responseId !== eventId);
      if (userSubjectDataId !== undefined && userSubjectDataId !== "" &&userSubjectDataId == null && eventValue && eventChecked) {
        beerRelatedObj = [ ...beerRelatedObjFilter, this.JSONObj( this.state.userId, userSubjectDataId, eventId, eventValue, questionId ),];

      } else if ( userSubjectDataId !== undefined && userSubjectDataId !== "" && userSubjectDataId !== null && eventValue && eventChecked == true) {

        beerRelatedObj = [ ...beerRelatedObjFilter, this.JSONObj( this.state.userId, userSubjectDataId, eventId, eventValue, questionId ), ];

      } else if (userSubjectDataId !== undefined && userSubjectDataId !== "" && userSubjectDataId !== null && eventValue && eventChecked == false ) {

        beerRelatedObj = [ ...beerRelatedObjFilter, this.JSONObj( this.state.userId, userSubjectDataId, eventId, null, questionId )];

      } else if ( userSubjectDataId !== undefined && userSubjectDataId !== "" && userSubjectDataId == null && eventValue && eventChecked == false) {

        beerRelatedObj = this.state.beer.filter((filt) => filt.responseId !== eventId);

      } 
      konsole.log("beerRelatedObjbeerRelatedObj",beerRelatedObj)
      
      if(indexOfbeer >=0){
        labelResponseList.response[indexOfbeer].checked = eventChecked
      }

      this.setState({
        ...this.state,
        beer: beerRelatedObj,
        formlabelData: {...this.state.formlabelData, labelResponseList}
      });
    } else if (eventName == "drinks") {
      this.setState({
        ...this.state,
        drinks: {
          userSubjectDataId:
            this.state.formlabelData?.label194?.userSubjectDataId ?? 0,
          responseId: eventId,
          subResponseData: eventValue,
          subjectId:
            this.state.formlabelData.label194 &&
            this.state.formlabelData.label194.questionId,
        },
      });
    } else if (eventName == "naturalHabitId") {
      let natureId = this.state.formlabelData.label106.response.filter((fil, index) => {  return fil.responseId == eventValue; })[0];
      konsole.log("inputCLonsnatural", natureId, eventValue);
      this.setState({
        ...this.state,
        naturalHabitIdSave: natureId?.responseId ?? null,
        naturalHabitId: {
          userSubjectDataId: this.state.formlabelData?.label106? this.state.formlabelData.label106.userSubjectDataId: 0,
          responseId: natureId?.responseId ?? null,
          // subResponseData: eventValue,
          subjectId:this.state.formlabelData.label106 && this.state.formlabelData?.label106?.questionId,
        },
      });
    } else if (eventName == "weekExerciseId") {
      let weekId = this.state.formlabelData.label104.response.filter(
        (fil, index) => {
          return fil.responseId == eventValue;
        }
      )[0];
      konsole.log("inputCLonWeekid", weekId, eventValue);
      this.setState({
        ...this.state,
        weekExerciseValue: weekId?.responseId ?? null,
        weekExerciseId: {
          userSubjectDataId: this.state.formlabelData.label104 ? this.state.formlabelData.label104.userSubjectDataId : 0,
          responseId: weekId?.responseId ?? null,
          subjectId: this.state.formlabelData.label104 && this.state.formlabelData.label104.questionId,
        },
      });
    }
  };
  componentDidMount() {
    this.setState(
      {
        userId: this.props.UserDetail.userId,
      },
      // () => {
      //   this.getsubjectForFormLabelId(this.props.UserDetail.userId);
      // }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.UserDetail.userId !== this.props.UserDetail.userId) {
      this.setState({
        userId: this.props.UserDetail.userId,
      });
    }
  }

  getsubjectForFormLabelId = (newuserid) => {
    let formlabelData = {};
    this.props.dispatchloader(true);
    health.formLabelId;
    $CommonServiceFn.InvokeCommonApi( "POST", $Service_Url.getsubjectForFormLabelId, health.formLabelId, (response) => {
        if (response) {
          konsole.log("sujectName", JSON.stringify(response.data.data));
          this.props.dispatchloader(false);
          const responseData = response.data.data;

          for (let resObj of responseData) {
            let label = "label" + resObj.formLabelId;
            formlabelData[label] = resObj.question;
            konsole.log("formatLabelData", formlabelData);
            this.props.dispatchloader(true);
            $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getSubjectResponse + newuserid + `/0/0/${formlabelData[label].questionId}`, "", (response) => {
                if (response) {
                  this.props.dispatchloader(false);
                  if ( response.data.data.userSubjects.length !== 0 && response.data.data.userSubjects.length == 1 ) {
                    this.setState({updateCaregiverSuitabilty: true});
                    let responseData = response.data.data.userSubjects[0];
                    if(responseData.response || responseData.responseId) this.setState({updateOrSave: true})
                    konsole.log("responseData", responseData.questionId);
                    this.props.dispatchloader(true);
                    for ( let i = 0; i < formlabelData[label].response.length; i++ ) {
                      if (formlabelData[label].response[i].responseId ===responseData.responseId ) {
                        if (responseData.responseNature == "Radio") {
                          formlabelData[label].response[i]["checked"] = true;
                          formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                          if ( resObj.formLabelId == 103 && responseData.response == "Regularly exercise" ) {
                            this.setState({
                              habit1: true,
                            });
                          }
                          if  ( resObj.formLabelId == 113 &&responseData.response == "Yes" ) {
                            this.setState({
                              alcohol1: true,
                            });
                          }
                          if ( resObj.formLabelId == 108 && responseData.response == "Yes" ) {
                            this.setState({
                              worryAboutHealth: true,
                            });
                          }
                          if ( resObj.formLabelId == 112 ) {
                            this.setState({
                              isSmoke:responseData.response
                            });
                          }
                          if ( resObj.formLabelId == 1035 ) {
                            this.setState({
                              isEverSmoked:responseData.response
                            });
                          }
                        }
                        if (responseData.responseNature == "Text") {
                          formlabelData[label].response[i]["response"] =responseData.response;
                          formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        }
                        if (responseData.responseNature == "DropDown") {
                          if (resObj.formLabelId == 106) {
                            this.setState({
                              naturalHabitIdSave: responseData.responseId,
                            });
                          }
                          if (resObj.formLabelId == 104) {
                            this.setState({
                              weekExerciseValue: responseData.responseId,
                            });
                          }
                          formlabelData[label]["userSubjectDataId"] = responseData.userSubjectDataId;
                        }
                        if (responseData.responseNature == "CheckBox") {
                          formlabelData[label].response[i]["userSubjectDataId"] = responseData.userSubjectDataId;
                          formlabelData[label].response[i]["checked"] = true;
                        }
                      }
                      if (i === formlabelData[label].response.length - 1) {
                        this.props.dispatchloader(false);
                      }
                    }
                  }

                  konsole.log("file watch", formlabelData[label].questionId,response.data.data.userSubjects);
                  if ( response.data.data.userSubjects.length !== 0 && response.data.data.userSubjects.length > 1 ) {
                    let responseData = response.data.data.userSubjects;
                    konsole.log("dfhgdhfgjdfhjghdfjghdfjghdfjhgquestionId response 95", responseData);
                    // this.props.dispatchloader(true);
                    for ( let i = 0; i < formlabelData[label].response.length; i++ ) {
                      this.props.dispatchloader(true);
                      for (let j = 0; j < responseData.length; j++) {
                        this.props.dispatchloader(false);
                        if ( formlabelData[label].response[i].responseId === responseData[j].responseId ) {
                          if ( responseData[j].responseNature == "CheckBox" && responseData[j].response !== null ) {
                            formlabelData[label].response[i][ "userSubjectDataId"] = responseData[j].userSubjectDataId;
                            formlabelData[label].response[i]["checked"] = true;

                          } else if ( responseData[j].responseNature == "CheckBox" ) {
                            formlabelData[label].response[i]["checked"] = false;
                            formlabelData[label].response[i]["userSubjectDataId"] = responseData[j].userSubjectDataId;
                          }                          
                        }
                      }
                    }
                    this.setState({
                      formlabelData: formlabelData,
                    });
                  }
                  this.props.dispatchloader(false);
                }
              }
            );
          }
          // this.setState({
          //   formlabelData: formlabelData,
          // });
        } else {
          // alert();
          // Msg.ErrorMsg
          this.setState({disable:false})
        }
      }
    );
    this.setState({
      formlabelData: formlabelData,
    });
  };

  handlesecondChange = (event) => {
    const eventId = event.target.id;
    const eventValue = event.target.value;
    const eventName = event.target.name;

    konsole.log("event", eventId, eventValue);
    if (eventId == "exceriseDescribe") {
      // let nameValue = $AHelper.capitalizeFirstLetter(eventValue);
      if ($AHelper.isNotallowspecialRegex(eventValue)) {
        this.setState({
          ...this.state,
          [eventId]: eventValue,
        });
      } else {
        this.setState({
          ...this.state,
          [eventId]: eventValue.slice(0, eventValue.length - 1),
          // [eventId]:eventValue.length >= 1 ? eventValue.slice(0, eventValue.length-1): eventValue == null,
        });
      }
    } else {
      this.setState({
        [eventId]: eventValue,
      });
    }
  };

 

  handleUpdateSubmit = async () => {
    this.setState({disable:true})
    let habit = {
      userSubjectDataId: this.state.habit.userSubjectDataId,
      subjectId: this.state.habit.subjectId,
      subResponseData: this.state.habit.subResponseData,
      responseId: this.state.habit.responseId,
    };

    let healthy = {
      userSubjectDataId: this.state.healthy.userSubjectDataId,
      subjectId: this.state.healthy.subjectId,
      subResponseData: this.state.healthy.subResponseData,
      responseId: this.state.healthy.responseId,
    };

    let long = {
      userSubjectDataId: this.state.long.userSubjectDataId,
      subjectId: this.state.long.subjectId,
      subResponseData: this.state.long.subResponseData,
      responseId: this.state.long.responseId,
    };

    let checkup = {
      userSubjectDataId: this.state.checkup.userSubjectDataId,
      subjectId: this.state.checkup.subjectId,
      subResponseData: this.state.checkup.subResponseData,
      responseId: this.state.checkup.responseId,
    };
    let worry = {
      userSubjectDataId: this.state.worry.userSubjectDataId,
      subjectId: this.state.worry.subjectId,
      subResponseData: this.state.worry.subResponseData,
      responseId: this.state.worry.responseId,
    };

    let socially = {
      userSubjectDataId: this.state.socially.userSubjectDataId,
      subjectId: this.state.socially.subjectId,
      subResponseData: this.state.socially.subResponseData,
      responseId: this.state.socially.responseId,
    };

    let worryHealth = {
      userSubjectDataId: this.state.worryHealth.userSubjectDataId,
      subjectId: this.state.worryHealth.subjectId,
      subResponseData: this.state.worryHealth.subResponseData,
      responseId: this.state.worryHealth.responseId,
    };

    let purpose = {
      userSubjectDataId: this.state.purpose.userSubjectDataId,
      subjectId: this.state.purpose.subjectId,
      subResponseData: this.state.purpose.subResponseData,
      responseId: this.state.purpose.responseId,
    };
    let quitSmoke = {
      userSubjectDataId: this.state.quitSmoke.userSubjectDataId,
      subjectId: this.state.quitSmoke.subjectId,
      subResponseData:(this.state.isEverSmoked=='Yes' && this.state.isSmoke=='No')? this.state.quitSmoke.subResponseData:'',
      responseId: this.state.quitSmoke.responseId,
    };

    let drug = {
      userSubjectDataId: this.state.drug.userSubjectDataId,
      subjectId: this.state.drug.subjectId,
      subResponseData: this.state.drug.subResponseData,
      responseId: this.state.drug.responseId,
    };

    let smoke = {
      userSubjectDataId: this.state.smoke.userSubjectDataId,
      subjectId: this.state.smoke.subjectId,
      subResponseData: this.state.smoke.subResponseData,
      responseId: this.state.smoke.responseId,
    };

    let everSmoke = {
      userSubjectDataId: this.state.everSmoke.userSubjectDataId,
      subjectId: this.state.everSmoke.subjectId,
      subResponseData: this.state.everSmoke.subResponseData,
      responseId: this.state.everSmoke.responseId,
    };

    let alcohol = {
      userSubjectDataId: this.state.alcohol.userSubjectDataId,
      subjectId: this.state.alcohol.subjectId,
      subResponseData: this.state.alcohol.subResponseData,
      responseId: this.state.alcohol.responseId,
    };
    let drinks = {
      userSubjectDataId: this.state.drinks.userSubjectDataId,
      subjectId: this.state.drinks.subjectId,
      subResponseData: this.state.drinks.subResponseData,
      responseId: this.state.drinks.responseId,
    };
    let naturalHabitId = {
      userSubjectDataId: this.state.naturalHabitId.userSubjectDataId,
      subjectId: this.state.naturalHabitId.subjectId,
      subResponseData: this.state.naturalHabitId.subResponseData,
      responseId: this.state.naturalHabitId.responseId,
    };

    let weekExerciseId = {
      userSubjectDataId: this.state.weekExerciseId.userSubjectDataId,
      subjectId: this.state.weekExerciseId.subjectId,
      subResponseData: this.state.weekExerciseId.subResponseData,
      responseId: this.state.weekExerciseId.responseId,
    };

    let exerciseDescribe = {
      userSubjectDataId: this.state.exerciseDescribe.userSubjectDataId,
      subjectId: this.state.exerciseDescribe.subjectId,
      subResponseData: this.state.exerciseDescribe.subResponseData,
      responseId: this.state.exerciseDescribe.responseId,
      userId: this.state.userId,
    };

    let totinptary = [];
    let beerArray = this.state.beer;
    konsole.log("beerArraybeerArray",beerArray.length,beerArray)

    if ( habit.subjectId !== 0 && habit.subResponseData !== "" && habit.responseId !== 0) {
      totinptary.push(habit);
    }
    if ( healthy.subjectId !== 0 && healthy.subResponseData !== "" && healthy.responseId !== 0) {
      totinptary.push(healthy);
    }

    if (checkup.subjectId !== 0 && checkup.subResponseData !== "" && checkup.responseId !== 0 ) {
      totinptary.push(checkup);
    }
    if ( naturalHabitId.subjectId !== 0 && naturalHabitId.subResponseData !== "" && naturalHabitId.responseId !== 0 && naturalHabitId.responseId !==null)  {
      totinptary.push(naturalHabitId);
    }

    if (weekExerciseId.subjectId !== 0 && weekExerciseId.subResponseData !== "" && weekExerciseId.responseId !== 0 && weekExerciseId.responseId !==null) {
      totinptary.push(weekExerciseId);
    }

    if (exerciseDescribe.subjectId !== 0 &&  exerciseDescribe.responseId !== 0) {
      totinptary.push(exerciseDescribe);
    }

    if (worry.subjectId !== 0 &&worry.subResponseData !== "" &&worry.responseId !== 0  ) {
      totinptary.push(worry);
    }

    if ( worryHealth.subjectId !== 0 && worryHealth.responseId !== 0) {
      totinptary.push(worryHealth);
    }

    if ( socially.subjectId !== 0 && socially.responseId !== 0) {
      totinptary.push(socially);
    }
    if ( purpose.subjectId !== 0 && purpose.responseId !== 0) {
      totinptary.push(purpose);
    }
    if ( quitSmoke.subjectId !== 0 && quitSmoke.responseId !== 0) {
      totinptary.push(quitSmoke);
    }

    if (drug.subjectId !== 0 && drug.subResponseData !== "" && drug.responseId !== 0) {
      totinptary.push(drug);
    }
    if (smoke.subjectId !== 0 &&smoke.subResponseData !== "" &&smoke.responseId !== 0) {
      totinptary.push(smoke);
    }
    if (everSmoke.subjectId !== 0 && everSmoke.subResponseData !== "" &&everSmoke.responseId !== 0) {
      totinptary.push(everSmoke);
    }
    if (alcohol.subjectId !== 0 && alcohol.subResponseData !== "" &&alcohol.responseId !== 0) {
      totinptary.push(alcohol);
    }
    if ( drinks.subjectId !== 0  && drinks.responseId !== 0) {
     totinptary.push(drinks);
    }
    if (this.state.habit1 == true) {
      if ( long.subjectId !== 0 && long.responseId !== 0) {
        totinptary.push(long);
      }
    }

    let inputData = {
      userId: this.state.userId,
      userSubjects: totinptary,
    };
    konsole.log("inputinfoinputinfo",inputData,beerArray.length,beerArray)
    

    const responses = await new Promise((resolve, reject) => {
      // this.state.disable=true
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("PUT",$Service_Url.putSubjectResponse,inputData,(response) => {
          this.setState({disable : false})
          this.props.dispatchloader(false);
          konsole.log("Success resP" + JSON.stringify(response));
          if (response) {   
            // this.state.disable=false
            if (beerArray.length == 0) {
              // this.getsubjectForFormLabelId(this.state.userId);
              AlertToaster.success(`Data ${this.state.updateOrSave ? "updated" : "saved"} successfully`);
              this.handleClose();
              
            } else {
              resolve("updatedSuccessFul");
            }
          }else{
            // konsole.log("errorerrorerror",error)
            this.setState({disable:false})
          }
        }
      );
    });
    konsole.log("responsesresponsesresponses",responses,beerArray)
    this.setState({
      disable:false
    })
    konsole.log("rresponses", responses);
    if (responses == "updatedSuccessFul" && alcohol?.responseId !== "26") {
      const responseded = await this.handleAlcoholSelection( inputData.userSubjects.length, beerArray);
      this.setState({ show : false })
    }
    else{
      // this.getsubjectForFormLabelId(this.state.userId);
      this.handleClose();
    }
  };

  handleAlcoholSelection = async (arrayLength, beerArray, alcohol) => {
    konsole.log("callapicallapi")
    // return;
    return new Promise((resolve, reject) => {
      const updatedJson = beerArray.filter( (beer) =>   beer.userSubjectDataId !== 0 &&   beer.userSubjectDataId !== null &&   beer.userSubjectDataId !== "" &&   beer.userSubjectDataId !== undefined);
      konsole.log("updatedJsonupdatedJson",updatedJson)

      this.setState({disable:true})

      const postJson = beerArray.filter((beer) => {  return (  beer?.userSubjectDataId == 0 ||  beer?.userSubjectDataId == undefined ||  beer?.userSubjectDataId == "" );
      });
      konsole.log( "sjow updatedJson", updatedJson, "postJSON", postJson, "beerArray", beerArray, arrayLength, updatedJson.length, postJson.length);

      konsole.log("postJsonpostJsonpostJson",postJson)
      if (postJson.length > 0) {
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi(
          "POST",
          $Service_Url.postaddusersubjectdata,
          postJson,
          (response) => {
            this.setState({disable:false})
            this.props.dispatchloader(false);
            konsole.log("Success res" + JSON.stringify(response));
            if (response) {
              if (postJson.length > 0 && updatedJson.length == 0) {
                konsole.log("sjow close");
                // this.handleClose();
                // this.getsubjectForFormLabelId(this.state.userId);
                AlertToaster.success("Data saved successfully");
              } else {
                resolve("POSTCOMPLETE");
                
              }
            } else {
              resolve("POSTERROR");
              this.setState({disable:false})
            }
          }
        );
      }
      this.setState({ disable:false})
      if (updatedJson.length > 0) {
        let inputCLons = {
          userId: this.state.userId,
          userSubjects: updatedJson,
        };
        this.props.dispatchloader(true);

        konsole.log("inputCLonsinputCLonsinputCLons",inputCLons)
        $CommonServiceFn.InvokeCommonApi("PUT",$Service_Url.putSubjectResponse,inputCLons,(response) => {
            this.props.dispatchloader(false);
            konsole.log("Success resP" + JSON.stringify(response));
            if (response) {
              if (updatedJson.length > 0 && postJson.length == 0) {
                konsole.log("sjow close");
                // this.getsubjectForFormLabelId(this.state.userId);
                // this.handleClose();
                // AlertToaster.success("Saved Successfully")
                // this.toasterAlert("Saved Successfully", "Success");
                AlertToaster.success("Data saved successfully");
              } else {
                // resolve("PUTCOMPLETE")
              }
              // this.getsubjectForFormLabelId(this.state.userId);
            } else {
              if (arrayLength == 0 && updatedJson.length > 0 &&postJson.length == 0) {
                this.handleClose();
              }
            }
          }
        );
      }
      if (postJson.length === 0 && updatedJson.length === 0) {
        resolve("POSTLENGTHZERO");
      }else{
        resolve("POSTLENGTHZERO");
      }
    });

    this.setState({ disable:false})
  };

  toasterAlert(test, type) {
    this.context.setdata($AHelper.toasterValueFucntion(true, test, type));
  }

 


  render() {
    konsole.log("isSmokeisSmoke",this.state.isSmoke)
    konsole.log("formlabelDatalabel195",this.state.formlabelData ,this.state.formlabelData.label1035 )
    konsole.log("subject api sresponse", this.state.beer);
    konsole.log("userSubjectDataId542", this.state.worryHealth);
    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            max-width: 56.25rem;
            margin: 1.75rem auto;
          }
        `}</style>
        <a onClick={this.handleShow}>
          <img src="/icons/add-icon.svg" alt="Health Insurance" />
        </a>

        <Modal
          size="lg"
          show={this.state.show == true ? true : false}
          centered
          onHide={this.handleClose}
          animation="false"
          id="lifestyle"
          backdrop="static"
          enforceFocus={false}
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>
              Lifestyle
              {/* {this.props.UserDetail.fName +
                " " +
                this.props.UserDetail.lName}{" "} */}
              {" - "}
              {this.props.UserDetail.fName +
                " " +
                (this.props.UserDetail.mName !== null
                  ? this.props.UserDetail.mName
                  : "") +
                " " +
                this.props.UserDetail.lName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="m-0 mb-3">
              <Col
                xs
                sm="12"
                lg="12"
                className="border pt-2 pb-2 mb-3"
                id="lifestyle1"
              >
                <label className="">
                  {this.state.formlabelData.label102 &&
                    this.state.formlabelData.label102.question}
                </label>
                <div className="d-flex justify-content-start align-items-center">

                  {this.state.formlabelData.label102 &&
                    this.state.formlabelData.label102.response.map(
                      (response, index) => {
                        return (
                          <>
                            <div
                              key={index}
                              className="me-4 pe-3 mb-0 d-flex align-items-center"
                            >
                              <Form.Check
                                className="chekspace"
                                type="radio"
                                id={response.responseId}
                                label={response.response}
                                defaultValue={response.response}
                                name="healthy"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                defaultChecked={response.checked}
                              />
                            </div>
                          </>
                        );
                      }
                    )}














                </div>
              </Col>
              <Col
                xs
                sm="12"
                lg="12"
                className="border mb-3 pt-2 pb-2 d-flex justify-content-start align-items-center "
                // style={{border:"1px solid red"}}
              >
                <Row className="w-100">
                  <Col xs sm="12" lg="12" className="d-flex ">
                    <div className="mb-3 w-100">
                      <label className="" id="lifestyle2">
                        {this.state.formlabelData.label103 &&
                          this.state.formlabelData.label103.question}
                      </label>
                      <div className="d-flex justify-content-start align-items-center w-100">
                        <div key="checkbox8" className="pe-3 mb-2 d-flex flex-wrap ">
                          {this.state.formlabelData.label103 &&
                            this.state.formlabelData.label103.response.map(
                              (response) => {
                                return (
                                  <>
                                    <Form.Check
                                      className="chekspace d-flex align-items-center me-4"
                                      type="radio"
                                      id={response.responseId}
                                      name="habit"
                                      defaultValue={response.response}
                                      label={response.response}
                                      onChange={(e) => {
                                        this.handleChange(e);
                                      }}
                                      defaultChecked={response.checked}
                                    />
                                  </>
                                );
                              }
                            )}
                        </div>
                      </div>
                      {this.state.habit1 ? (
                        <div
                          key="checkbox8"
                          className=" mb-0 d-flex flex-column w-50"
                          id="lifestyle3"

                        >
                          <label className="">
                            {this.state.formlabelData.label104 && this.state.formlabelData.label104.question}
                          </label>
                          <select
                            className="custom-select"
                            name="weekExerciseId"
                            value={this.state.weekExerciseValue}
                            onChange={(event) => this.handleChange(event)}
                            isSearchable={false}
                            style={{width:"97%"}}
                          >
                            <option></option>
                            {this.state.formlabelData.label104 &&
                              this.state.formlabelData.label104.response.map(
                                (opt, index) => {
                                  konsole.log("Optlanel104", opt);
                                  return (
                                    <option
                                      key={opt.responseId}
                                      value={opt.responseId}
                                      selected={opt.selected}
                                    >
                                      {opt.response}
                                    </option>
                                  );
                                }
                              )}
                          </select>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </Col>
                  <Col className="col-6" xs="12" sm="12" lg="4" id="lifestyle4">
                    {this.state.formlabelData.label196 &&
                      this.state.formlabelData.label196.response.map(
                        (response) => {
                          return (
                            <>
                              <Form.Control
                                required
                                type="text"
                                name="exerciseDescribe"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                                className="w-100 mb-2"
                                id={response.responseId}
                                defaultValue={response.response}
                                placeholder="Describe"
                              />
                            </>
                          );
                        }
                      )}
                    {this.state.habit1 ? (
                      <div key="checkbox8">
                        <label className="">
                          {this.state.formlabelData.label105 &&
                            this.state.formlabelData.label105.question}
                        </label>
                        {this.state.formlabelData.label105 &&
                          this.state.formlabelData.label105.response.map(
                            (response) => {
                              return (
                                <>
                                  <Form.Control
                                    required
                                    type="text"
                                    name="long"
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                    className="w-100"
                                    id={response.responseId}
                                    defaultValue={response.response}
                                  />
                                </>
                              );
                            }
                          )}
                      </div>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
              </Col>
              <Col xs="12" sm="12" lg="12" className="border pt-2 pb-2 mb-3">
                <div className="d-flex justify-content-start align-items-start">
                  <h6 className=" p-0 fw-bold">Tell us about your Nutrition habits</h6>
                </div>
                <label className=" ">
                  (Things like portion control, less sugar, water intake, avoid
                  sugar drinks, less red meat, vegetables and fruits, etc.)
                </label>
                <div
                  className="d-flex justify-content-start flex-column align-items-start mt-3"
                  id="lifestyle5"
                >
                  <label className="">
                    {this.state.formlabelData.label106 &&
                      this.state.formlabelData.label106.question}
                  </label>
                  <Col xs="12" sm="12" lg="4">
                  <select
                    className="custom-select mt-1 natureHabit"
                    name="naturalHabitId"
                    value={this.state.naturalHabitIdSave}
                    onChange={(event) => this.handleChange(event)}
                  >
                    <option></option>
                    {this.state.formlabelData.label106 &&
                      this.state.formlabelData.label106.response.map(
                        (opt, index) => {
                          konsole.log("Opt", opt);
                          return (
                            <option
                              key={opt.responseId}
                              value={opt.responseId}
                              selected={opt.selected}
                            >
                              {opt.response}
                            </option>
                          );
                        }
                      )}
                  </select>
                  </Col>
                </div>
                <div
                  className="d-flex justify-content-start flex-column align-items-start mt-3"
                  id="lifestyle6"
                >
                  <label className="">
                    {this.state.formlabelData.label107 &&
                      this.state.formlabelData.label107.question}
                  </label>
                  <div className="d-flex justify-content-around">
                    {this.state.formlabelData.label107 &&
                      this.state.formlabelData.label107.response.map(
                        (response, index) => {
                          return (
                            <>
                              <div
                                key={index}
                                className="me-4 pe-3 mb-0 d-flex align-items-center"
                              >
                                <Form.Check
                                  className="chekspace"
                                  type="radio"
                                  id={response.responseId}
                                  label={response.response}
                                  defaultValue={response.response}
                                  name="checkup"
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </div>
                            </>
                          );
                        }
                      )}
                  </div>
                </div>
                <div
                  className="d-flex justify-content-start flex-column align-items-start mt-3"
                  id="lifestyle7"
                >
                  <label className="">
                    {" "}
                    {this.state.formlabelData.label108 &&
                      this.state.formlabelData.label108.question}{" "}
                  </label>
                  <div className="d-flex justify-content-start align-items-center">
                    {this.state.formlabelData.label108 &&
                      this.state.formlabelData.label108.response.map(
                        (response) => {
                          return (
                            <>
                              <div className="d-flex justify-content-center align-items-center">
                                {response.response == "Yes" ? (
                                  <div
                                    key="checkbox8"
                                    className="me-4 pe-3 mb-0 d-flex justify-content-center align-items-center"
                                  >
                                    <Form.Check
                                      className="chekspace"
                                      type="radio"
                                      id={response.responseId}
                                      label={response.response}
                                      defaultValue={response.response}
                                      name="worry"
                                      onChange={(e) => {
                                        this.handleChange(e);
                                      }}
                                      defaultChecked={response.checked}
                                    />
                                  </div>
                                ) : (
                                  <div
                                    key="checkbox8"
                                    className="me-4 pe-3 mb-0 d-flex justify-content-center align-items-center"
                                  >
                                    <Form.Check
                                      className="chekspace"
                                      type="radio"
                                      id={response.responseId}
                                      label={response.response}
                                      defaultValue={response.response}
                                      name="worry"
                                      onChange={(e) => {
                                        this.handleChange(e);
                                      }}
                                      defaultChecked={response.checked}
                                    />
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        }
                      )}
                  </div>
                </div>
                {this.state.worryAboutHealth == true && (
                  <div>
                    <div
                      className="d-flex justify-content-start flex-column align-items-start mt-3"
                      id="lifestyle8"
                    >
                      <label className="mb-2">
                        {this.state.formlabelData.label949 &&
                          this.state.formlabelData.label949.question}
                      </label>
                      {this.state.formlabelData.label949 &&
                        this.state.formlabelData.label949.response.map(
                          (response) => {
                            // konsole.log("respisss",response)
                            return (
                              <>
                                <Form.Control
                                  type="text"
                                  name="worryHealth"
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  className="w-100"
                                  id={response.responseId}
                                  defaultValue={response.response}
                                />
                              </>
                            );
                          }
                        )}
                    </div>
                  </div>
                )}
              </Col>



              
              <Col xs="12" sm="12" lg="12" className="border pb-2 pt-2">
                <div className="d-flex justify-content-start align-items-start">
                  <h6 className="p-0 fw-bold">
                    Tell us about your social habits
                  </h6>
                </div>
                <div
                  className="d-flex justify-content-start flex-column align-items-start mt-3"
                  id="lifestyle8"
                >
                  <label className="mb-2">
                    {this.state.formlabelData.label109 &&
                      this.state.formlabelData.label109.question}
                  </label>
                  {this.state.formlabelData.label109 &&
                    this.state.formlabelData.label109.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Control
                              type="text"
                              name="socially"
                              onChange={(e) => {
                                this.handleChange(e);
                              }}
                              className="w-100"
                              id={response.responseId}
                              defaultValue={response.response}
                            />
                          </>
                        );
                      }
                    )}
                </div>
                <div
                  className="d-flex justify-content-start flex-column align-items-start mt-3"
                  id="lifestyle9"
                >
                  <label className="mb-2">
                    {this.state.formlabelData.label110 &&
                      this.state.formlabelData.label110.question}
                  </label>
                  {this.state.formlabelData.label110 &&
                    this.state.formlabelData.label110.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Control
                              type="text"
                              name="purpose"
                              onChange={(e) => {
                                this.handleChange(e);
                              }}
                              className="w-100"
                              id={response.responseId}
                              defaultValue={response.response}
                            />
                          </>
                        );
                      }
                    )}
                </div>
              </Col>
            </Row>

            <div className="border ps-3 pb-2 pt-2">
              <Row className="m-0 mb-2">
                <Col xs sm="8" lg="7" className="ps-0 pb-0" id="lifestyle10">
                  <label className="">
                    {" "}
                    {this.state.formlabelData.label111 &&
                      this.state.formlabelData.label111.question}{" "}
                  </label>
                  <div className="d-flex justify-content-start align-items-center">
                    {this.state.formlabelData.label111 &&
                      this.state.formlabelData.label111.response.map(
                        (response) => {
                          return (
                            <>
                              {response.response == "Yes" ? (
                                <>
                                  <div
                                    key="checkbox8"
                                    className="me-4 pe-3 mb-0 d-flex align-items-center"
                                  >
                                    <Form.Check
                                      className="chekspace"
                                      type="radio"
                                      id={response.responseId}
                                      defaultValue={response.response}
                                      label={response.response}
                                      name="drug"
                                      onChange={(e) => {
                                        this.handleChange(e);
                                      }}
                                      defaultChecked={response.checked}
                                    />
                                  </div>
                                </>
                              ) : (
                                <div
                                  key="checkbox8"
                                  className="me-4 pe-3 mb-0 d-flex  align-items-center"
                                >
                                  <Form.Check
                                    className="chekspace"
                                    type="radio"
                                    id={response.responseId}
                                    label={response.response}
                                    defaultValue={response.response}
                                    name="drug"
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                    defaultChecked={response.checked}
                                  />
                                </div>
                              )}
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Row>
              <Row className="m-0 mb-2">
                <Col
                  xs
                  sm="6"
                  lg="6"
                  className="ps-0 pb-0 pt-0"
                  id="lifestyle11"
                >
                  <label className="">
                    {" "}
                    {this.state.formlabelData.label112 &&
                      this.state.formlabelData.label112.question}{" "}
                  </label>
                  <div className="d-flex">
                    {this.state.formlabelData.label112 &&
                      this.state.formlabelData.label112.response.map(
                        (response) => {
                          return (
                            <>
                              <div className="d-flex justify-content-center align-items-center">
                                <div
                                  key="checkbox8"
                                  className="me-4 pe-3 mb-0 d-flex align-items-center"
                                >
                                  <Form.Check
                                    className="chekspace "
                                    type="radio"
                                    id={response.responseId}
                                    name="smoke"
                                    defaultValue={response.response}
                                    label={response.response}
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                    defaultChecked={response.checked}
                                  />
                                </div>
                              </div>
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Row>

              {(this.state.isSmoke=='No') && <>  
              <Row className="m-0 mb-2">
                <Col xs sm="6" lg="6" className="ps-0 pb-0 pt-0" id="lifestyle11">
                  <label className="">
                    {" "}
                    {this.state.formlabelData.label1035 &&
                      this.state.formlabelData.label1035.question}{" "}
                      {console.log("label1035label1035",this.state.formlabelData.label1035)}
                  </label>
                  <div className="d-flex">
                    {this.state.formlabelData.label1035 &&
                      this.state.formlabelData.label1035.response.map(
                        (response,index) => {
                          console.log("indexresponse",response)
                          return (
                            <>
                              <div key={index} className="d-flex justify-content-center align-items-center">
                                <div key="checkbox8" className="me-4 pe-3 mb-0 d-flex align-items-center">
                                  <Form.Check
                                    className="chekspace "
                                    type="radio"
                                    id={response.responseId}
                                    name="everSmoke"
                                    defaultValue={response.response}
                                    label={response.response}
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                    defaultChecked={response.checked}
                                  />
                                </div>
                              </div>
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
              </Row>
              {(this.state.isEverSmoked=='Yes') && <>
              
              <Row className="m-0 mb-2">
                <Col xs sm="6" lg="6" className="ps-0 pb-0 pt-0" id="lifestyle11">
                  <label className="">
                    {" "}
                    {this.state.formlabelData.label1036 &&
                      this.state.formlabelData.label1036.question}{" "}
                      {console.log("label1035label1035",this.state.formlabelData.label1036)}
                  </label>
                  <div className="d-flex">
                  {this.state.formlabelData.label1036 &&
                    this.state.formlabelData.label1036.response.map(
                      (response) => {
                        return (
                          <>
                            <Form.Control
                              type="text"
                              name="quitSmoke"
                              onChange={(e) => {
                                this.handleChange(e);
                              }}
                              className="w-100"
                              id={response.responseId}
                              defaultValue={response.response}
                            />
                          </>
                        );
                      }
                    )}
                  </div>
                </Col>
              </Row>
              </>}
              </>}
           
              <Row xs sm="8" lg="7" className="mt-2" id="lifestyle11">
                <Col>
                  <label className="">
                    {" "}
                    {this.state.formlabelData.label113 &&
                      this.state.formlabelData.label113.question}{" "}
                  </label>

                  <div className="d-flex justify-content-start align-items-center">
                    {this.state.formlabelData.label113 &&
                      this.state.formlabelData.label113.response.map(
                        (response) => {
                          return (
                            <>
                              <div
                                key="checkbox8"
                                className="me-4 pe-3 mb-0 d-flex align-items-center"
                              >
                                <Form.Check
                                  className="chekspace"
                                  type="radio"
                                  id={response.responseId}
                                  label={response.response}
                                  defaultValue={response.response}
                                  name="alcohol"
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                  defaultChecked={response.checked}
                                />
                              </div>
                            </>
                          );
                        }
                      )}
                  </div>
                </Col>
                {this.state.alcohol1 ? (
                  <>
                    <Row
                      xs
                      sm="8"
                      lg="7"
                      className="mt-2"
                      id="lifestyle11"
                    >
                      <Col>
                        <label className="">
                          {" "}
                          {this.state.formlabelData.label194 &&
                            this.state.formlabelData.label194.question}{" "}
                        </label>

                        <div className="d-flex justify-content-start align-items-center mt-2">
                          {this.state.formlabelData.label194 &&
                            this.state.formlabelData.label194.response.map(
                              (response) => {
                                return (
                                  <>
                                    <div
                                      key="checkbox8"
                                      className="me-4 pe-3 mb-0 d-flex align-items-center"
                                    >
                                      <Form.Control
                                        type="text"
                                        name="drinks"
                                        className="w-100"
                                        onChange={(e) => {
                                          this.handleChange(e);
                                        }}
                                        id={response.responseId}
                                        defaultValue={response.response}
                                      />
                                    </div>
                                  </>
                                );
                              }
                            )}
                        </div>
                      </Col>
                    </Row>

                    <Row xs sm="8" lg="7" className="mt-2" id="lifestyle11">
                      <Col>
                        <label className="">
                          {" "}
                          {this.state.formlabelData.label195 &&
                            this.state.formlabelData.label195.question}{" "}
                        </label>
                        <div className="d-flex flex-wrap justify-content-start align-items-center">
                          {this.state.formlabelData.label195 &&
                            this.state.formlabelData.label195.response.map(
                              (response,index) => {
                                konsole.log("responseresponseaa",response)
                                return (
                                  <>
                                    <div  key="checkbox8"  className="me-4 pe-3 b mb-0 d-flex align-items-center" >
                                      <Form.Check
                                        className="d-flex align-items-center mr-3 gap-2"
                                        label={response.response}
                                        name="beer"
                                        type="checkbox"
                                        id={response.responseId}
                                        userSubjectDataId={response?.userSubjectDataId}
                                        indexOfBeer={index}
                                        value={response.response}
                                        onChange={(e)=>this.handleChange(e)}
                                        checked={response.checked}
                                      />
                                    </div>
                                  </>
                                );
                              }
                            )}
                        </div>
                      </Col>
                    </Row>
                  </>
                ) : (
                  ""
                )}
              </Row>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <Button
                style={{ backgroundColor: "#76272b", border: "none" }}
                className="theme-btn" onClick={this.handleUpdateSubmit}
                disabled={this.state.disable == true ? true : false}
              >
                {this.state.updateOrSave == false ? "Save" : "Update"}
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

export default connect(mapStateToProps, mapDispatchToProps)(lifestyle);