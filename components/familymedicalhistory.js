import React, { Component } from 'react'
import { Button, Modal, Table, Form, Popover, OverlayTrigger, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb } from 'react-bootstrap';
import Select from 'react-select';
import { $AHelper } from "./control/AHelper";
import { connect } from 'react-redux';
import { SET_LOADER } from '../components/Store/Actions/action'
import { $Service_Url } from "../components/network/UrlPath";
import { $CommonServiceFn } from '../components/network/Service';
import konsole from './control/Konsole';
import { Msg } from './control/Msg';
import DescPopover from './popover/describePopover'
import AlertToaster from '../components/control/AlertToaster'
import { globalContext } from "../pages/_app"

export class familymedicalhistory extends Component {
  static contextType = globalContext
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      fatherLive: true,
      motherLive: true,
      showAlzFatherPopover: false,
      showAlzMotherPopover: false,
      showAlzSiblingPopover: false,
      showParkinsonMotherPopover: false,
      showParkinsonSiblingPopover: false,
      showParkinsonFatherPopover: false,
      logginInUser: sessionStorage.getItem("loggedUserId") || '',
      showPopover: false,
      medicalHistTypeId: 2,//Relative
      fRelationshipId: 9,
      mRelationshipId: 10,
      sRelationshipId: 11,
      fatherage: "",
      fatherageofDeath: "",
      fatherCauseofDeath: "",
      Motherage: "",
      disable:false,
      MotherageofDeath: "",
      MotherCauseofDeath: "",
      noOfLivingSibling: "",
      noOfDeceasedSibling: "",
      fatherMedicalHistId: "",
      motherMedicalHistId: "",
      siblingMedicalHistId: "",
      SiblingDiseaseMedicalHistId: "",
      illnessDuration: "",
      formallyDiagnosed: "",
      updateOrSave: false,
      symptomsSigns: "",

      remarks: "",

      FetchedFatherDiseases: [],
      FetchedMotherDiseases: [],
      FetchedSiblingDiseases: [],
    };
  }

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let logginInUser = sessionStorage.getItem("loggedUserId") || '';
    this.setState({
      userId: newuserid,
      logginInUser: logginInUser,
    });
    // this.FetchFamilyhistory();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.show != this.state.show) {
      if (this.state.show) {
        this.FetchFamilyhistory();
      }
    }
  }

  handleFatherPopover = (diseaseId) => {

    switch (diseaseId) {
      case 1:
        this.handleCloseIllnespop()
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
      case 2:
        this.handleCloseIllnespop()
        this.setState({
          showParkinsonFatherPopover: !this.state.showParkinsonFatherPopover,
        })
        break;
      // case 3:
      //   this.setState({
      //     showAlzFatherPopover: !this.state.showAlzFatherPopover,
      //   })
      // break;
      case 4:
        this.handleCloseIllnespop()
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
      case 5:
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
      case 6:
        this.handleCloseIllnespop()
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
      case 7:
        this.handleCloseIllnespop()
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
    }
  }
  handleMotherPopover = (diseaseId) => {
    switch (diseaseId) {
      case 1:
        this.handleCloseIllnespop()
        this.setState({
          showAlzMotherPopover: !this.state.showAlzMotherPopover,
        })
        break;
      case 2:
        this.handleCloseIllnespop()
        this.setState({
          showParkinsonMotherPopover: !this.state.showParkinsonMotherPopover,
        })
        break;
      case 3:
        this.handleCloseIllnespop()
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
      case 4:
        this.handleCloseIllnespop()
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
      case 5:
        this.handleCloseIllnespop()
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
      case 6:
        this.handleCloseIllnespop()
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
      case 7:
        this.handleCloseIllnespop()
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
    }
  }
  handleSiblingPopover = (diseaseId) => {

    switch (diseaseId) {
      case 1:
        this.setState({
          showAlzSiblingPopover: !this.state.showAlzSiblingPopover,
        })
        break;
      case 2:
        this.setState({
          showParkinsonSiblingPopover: !this.state.showParkinsonSiblingPopover,
        })
        break;
      case 3:
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
      case 4:
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
      case 5:
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
      case 6:
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
      case 7:
        this.setState({
          showAlzFatherPopover: !this.state.showAlzFatherPopover,
        })
        break;
    }
  }


  FetchFamilyhistory = () => {
    // alert("API Call");
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getuserfamilyHistory + this.props.UserDetail.userId + "/2",
      "", (response) => {
        // debugger
        if (response) {
          this.props.dispatchloader(false);
          // konsole.log("fetchmedicalHistorymedicalHistId",response.data.data.userMedHistory[0].medicalHistId);
          if (response.data.data.userMedHistory.length <= 0) {
            this.setState({
              updateOrSave: false
            })
            konsole.log(" not Having");

          } else if (response.data.data.userMedHistory.length > 0) {
            this.setState({
              updateOrSave: true
            })

          }
          konsole.log("fetchmedicalHistorymedicalHistId", response);
          // this.setState({
          //   medicalHistId: response.data.data.userMedHistory[0].medicalHistId,
          // })
          let responseData = response.data.data;
          let fatherDisease = [];
          let motherDisease = [];
          let siblingDisease = [];
          let siblingLiving = [];
          if (responseData.userMedHistory.length > 0) {
            fatherDisease = responseData.userMedHistory.filter((medHis) => {
              return medHis.relationshipId == 9
            });
            motherDisease = response.data.data.userMedHistory.filter((medHis) => {
              return medHis.relationshipId == 10
            });
            siblingDisease = response.data.data.userMedHistory.filter((medHis) => {
              return medHis.relationshipId == 11
            });


            let checkedFather = fatherDisease.length > 0 && fatherDisease.filter(v => v.diseaseId == null && v.disease == null && v.isSuffering == false);
            let checkedMother = motherDisease.length > 0 && motherDisease.filter(v => v.diseaseId == null && v.disease == null && v.isSuffering == false);
            let checkedSibling = siblingDisease.length > 0 ? siblingDisease.filter(v => v.noOfLivingSibling !== null && v.noOfDeceasedSibling == null) : [];
            let checkedSiblingDisease = siblingDisease.length > 0 ? siblingDisease.filter(v => v.noOfLivingSibling == null && v.noOfDeceasedSibling !== null) : [];

            konsole.log("checkeedfather", checkedSibling[0]?.medicalHistId);
            if (checkedFather.length > 0) {
              const fatherLive = checkedFather[0].isCurrentlyLiving == true ? true : false;
              const fatherMedicalHistId = checkedFather[0]?.medicalHistId
              let fatherage = ''
              let fatherageofDeath = ''
              let fatherCauseofDeath = ''
              if (fatherLive == true) {
                fatherage = checkedFather[0]?.age;
              }
              else if (fatherLive == false) {
                fatherageofDeath = checkedFather[0]?.age;
                fatherCauseofDeath = checkedFather[0]?.causeOfDeath;
              }
              konsole.log("checkeedfatherage", fatherage);


              this.setState({
                fatherLive: fatherLive,
                fatherage: fatherage || "",
                fatherageofDeath: fatherageofDeath || "",
                fatherCauseofDeath: fatherCauseofDeath,
                fatherMedicalHistId: fatherMedicalHistId
              })
            }

            if (checkedMother.length > 0) {
              const motherLive = checkedMother[0].isCurrentlyLiving == true ? true : false;
              const motherMedicalHistId = checkedMother[0]?.medicalHistId
              let motherage = ''
              let MotherageofDeath = ''
              let MotherCauseofDeath = ''
              if (motherLive == true) {
                motherage = checkedMother[0]?.age;
              } else if (motherLive == false) {
                MotherageofDeath = checkedMother[0]?.age;
                MotherCauseofDeath = checkedMother[0]?.causeOfDeath;
              }
              this.setState({
                motherLive: motherLive,
                Motherage: motherage || "",
                MotherageofDeath: MotherageofDeath || "",
                MotherCauseofDeath: MotherCauseofDeath,
                motherMedicalHistId: motherMedicalHistId
              })
            }

            konsole.log("checkedSibling", checkedSibling);
            if (checkedSibling.length !== 0) {
              const siblingMedicalHistId = checkedSibling[0]?.medicalHistId;
              this.setState({
                siblingMedicalHistId: siblingMedicalHistId
              })
              for (let checkedSiblingObj of checkedSibling) {
                checkedSibling
                if (checkedSiblingObj.isCurrentlyLiving == true) {
                  this.setState({
                    noOfLivingSibling: checkedSiblingObj?.noOfLivingSibling,
                  })
                }
                else if (checkedSiblingObj?.isCurrentlyLiving == false) {
                  // this.setState({
                  //   noOfDeceasedSibling: checkedSiblingObj.noOfDeceasedSibling,
                  // })
                }
              }
            }
            if (checkedSiblingDisease.length > 0) {
              this.setState({
                SiblingDiseaseMedicalHistId: checkedSiblingDisease[0]?.medicalHistId
              })
              if (checkedSiblingDisease[0]?.noOfDeceasedSibling !== null || checkedSiblingDisease[0]?.noOfDeceasedSibling !== undefined) {
                this.setState({
                  noOfDeceasedSibling: checkedSiblingDisease[0]?.noOfDeceasedSibling,
                })
              }
            }
          }
          konsole.log("fetchmedicalHistory", this.state.SiblingDiseaseMedicalHistId);

          this.setState({
            ...this.state,
            FetchedFatherDiseases: fatherDisease,
            FetchedMotherDiseases: motherDisease,
            FetchedSiblingDiseases: siblingDisease,
          });
        }
      })
  }

  handleClearDpc = () => {
    this.setState({
      motherLive: true,
      motherage: '',
      MotherageofDeath: '',
      MotherCauseofDeath: '',
      fatherLive: true,
      fatherage: '',
      fatherageofDeath: '',
      fatherCauseofDeath: '',
    })
  }

  SaveFamilyHistory = (typeBtn) => {
    this.setState({disable:true})
    let aryinputdata = [];
    //#region Father
    let inputdata = {};
    inputdata["relationshipId"] = this.state.fRelationshipId; // Father
    inputdata["isCurrentlyLiving"] = this.state.fatherLive ? true : 0;
    inputdata["relationship"] = "Father";
    if (this.state.fatherMedicalHistId !== undefined && this.state.fatherMedicalHistId !== null) {
      inputdata["medicalHistId"] = this.state.fatherMedicalHistId;
    }
    if (this.state.fatherLive) {
      inputdata["age"] = this.state.fatherage;
    } else {
      inputdata["age"] = this.state.fatherageofDeath;
      inputdata["causeOfDeath"] = this.state.fatherCauseofDeath;
    }
    aryinputdata.push(inputdata);
    //#endregion

    konsole.log("aryinputdata", aryinputdata)

    //#region Mother
    inputdata = {};
    inputdata["relationshipId"] = this.state.mRelationshipId; // Mother
    inputdata["isCurrentlyLiving"] = this.state.motherLive ? true : 0;
    inputdata["relationship"] = "Mother";
    if (this.state.motherMedicalHistId !== undefined && this.state.motherMedicalHistId !== null) {
      inputdata["medicalHistId"] = this.state.motherMedicalHistId;
    }
    if (this.state.motherLive) {
      inputdata["age"] = this.state.Motherage;
    } else {
      inputdata["age"] = this.state.MotherageofDeath;
      inputdata["causeOfDeath"] = this.state.MotherCauseofDeath;
    }
    // konsole.log("heurujkdhfew8",inputdata)
    aryinputdata.push(inputdata);
    //#endregion

    //#region Siblings
    if (this.state.noOfLivingSibling !== '') {
      let livsiblpcnt =
        this.state.noOfLivingSibling > 5 ? 5 : this.state.noOfLivingSibling;
      inputdata = {};
      inputdata["isCurrentlyLiving"] = true;
      inputdata["relationshipId"] = this.state.sRelationshipId; // Sibling
      inputdata['noOfLivingSibling'] = this.state.noOfLivingSibling;
      if (this.state.siblingMedicalHistId !== undefined && this.state.siblingMedicalHistId !== null) {
        inputdata["medicalHistId"] = this.state.siblingMedicalHistId;
      }
      aryinputdata.push(inputdata);
    }

    if (this.state.noOfDeceasedSibling !== '') {
      inputdata = {};
      inputdata["relationshipId"] = this.state.sRelationshipId;
      inputdata["isCurrentlyLiving"] = false;
      inputdata['noOfDeceasedSibling'] = this.state.noOfDeceasedSibling;
      if (this.state.SiblingDiseaseMedicalHistId !== undefined && this.state.SiblingDiseaseMedicalHistId !== null) {
        inputdata["medicalHistId"] = this.state.SiblingDiseaseMedicalHistId;
      }
      aryinputdata.push(inputdata);
    }
    //#endregion

    let bool = true
    this.InvokeSaveHistoryApi(aryinputdata, bool,typeBtn);
    this.handleClose()
  };

  InvokeSaveHistoryApi = (aryinputdata, bool,typeBtn) => {


    let inputdata = {};
    let reqcnt = 0;
    let rescnt = 0;
    let boolres;
        for (let lpcnt = 0; lpcnt < aryinputdata.length; lpcnt++) {
      reqcnt++;
      inputdata = aryinputdata[lpcnt];
      let method = "POST";
      let url = $Service_Url.postAddFamilyHistory;

      let finaldata = {
        medicalHistTypeId: this.state.medicalHistTypeId || 0,
        relationshipId: inputdata.relationshipId || null,
        isCurrentlyLiving: inputdata.isCurrentlyLiving || false,
        age: inputdata.age || 0,
        isSuffering: inputdata.isSuffering || false,
        // illnessDuration: inputdata.illnessDuration || 0,
        illnessDurationTime: inputdata.illnessDurationTime || 0,
        coMorbidityFormallyDiagnosed: inputdata.coMorbidityFormallyDiagnosed || "",
        coMorbidityId: inputdata.coMorbidityId || 0,
        formallyDiagnosed: inputdata.formallyDiagnosed || "",
        symptomsSigns: inputdata.symptomsSigns || "",
        causeOfDeath: inputdata.causeOfDeath || "",
        diseaseId: inputdata.diseaseId || 0,
        noOfLivingSibling: inputdata.noOfLivingSibling || null,
        noOfDeceasedSibling: inputdata.noOfDeceasedSibling || null,
              };

      // konsole.log('inputdata.illnessDuration',inputdata.illnessDuration)
      // let totalinput = {
      //   userId: this.props.UserDetail.userId,
      //   // createdBy: this.state.logginInUser,
      //   updatedBy: this.state.logginInUser,
      //   medicalHistId: lpcnt == 0 ? this.state.fatherMedicalHistId : lpcnt == 1 ? this.state.motherMedicalHistId : 
      //   lpcnt == 2? 4881 : this.state.siblingMedicalHistId,
      //   isActive: true,
      //   medHistory: finaldata,
      // };


      // konsole.log("totalinput", JSON.stringify(totalinput));


      let totalinput = {
        userId: this.props.UserDetail.userId,
        // createdBy: this.state.logginInUser,
        // updatedBy: this.state.logginInUser,
        // medicalHistId: lpcnt == 0 ? this.state.fatherMedicalHistId : lpcnt == 1 ? this.state.motherMedicalHistId : 
        // lpcnt == 2? this.state.siblingMedicalHistId : this.state.SiblingDiseaseMedicalHistId,
        isActive: true,
        medHistory: finaldata,
      };


      if (inputdata?.medicalHistId !== undefined && inputdata?.medicalHistId !== "" && inputdata?.medicalHistId !== null) {
        method = "PUT"
        url = $Service_Url.putUpdateFamilyHistory
        totalinput["updatedBy"] = this.state.logginInUser;
        totalinput["medicalHistId"] = inputdata?.medicalHistId;
      } else {
        totalinput["createdBy"] = this.state.logginInUser;

      }


      konsole.log("totalinputtrue", JSON.stringify(totalinput), "  ", "::Method::", method, "  ", "::URL::", url);
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi(method, url, totalinput, (response, error) => {
        rescnt++;
        
        if (response) {
          this.props.dispatchloader(false);
          konsole.log("PostData" + JSON.stringify(response));
          boolres = true;
        } else {
          this.props.dispatchloader(false);
          boolres = false;
          this.setState({ disable: false })
        }
        if (aryinputdata.length == rescnt) {
          if (boolres) {
            if(typeBtn=='saveUpdateBtn'){
              AlertToaster.success("Data Saved Successfully")
            }
            if (bool == true) {
              this.FetchFamilyhistory();
              // setTimeout(() => {
              //   window.location.reload();
              // }, 4000);
              this.setState({ disable: false })
            }


            // this.toasterAlert("Data Saved Successfully","Success")
            // alert("Saved Successfully");
            // AlertToaster.success("Family Medical History");
          } else {
            // alert(Msg.ErrorMsg);
            this.props.dispatchloader(false);
            konsole.log("urlurlurl", url, error)
            this.toasterAlert(Msg.ErrorMsg, "Warning")
          }
        }
      }
      );



    }
  };

  AssesthandleSelectedIllness = (relationshipId, diseaseid) => {




    let medtypeId;

    if (relationshipId == 9) {

      let filterdata = this.state.FetchedFatherDiseases.filter((e) => {
        return e.diseaseId == diseaseid && e.relationshipId == relationshipId
      })
      medtypeId = filterdata[0]?.medicalHistId
    } else if (relationshipId == 10) {

      let filterdata = this.state.FetchedMotherDiseases.filter((e) => {
        return e.diseaseId == diseaseid && e.relationshipId == relationshipId
      })
      medtypeId = filterdata[0]?.medicalHistId
    } else if (relationshipId == 11) {

      let filterdata = this.state.FetchedSiblingDiseases.filter((e) => {
        return e.diseaseId == diseaseid && e.relationshipId == relationshipId
      })
      medtypeId = filterdata[0]?.medicalHistId
    }





    konsole.log("filtereddata", medtypeId)

    // let MedicalHistoryIdValue  = this.state.FetchedFatherDiseases.filter(v => v.diseaseId == diseaseid && v.relationshipId == relationshipId )[0]?.medicalHistId



    // let MedicalHistoryIdValue = (this.state.FetchedFatherDiseases.relationshipId == relationshipId && this.state.FetchedFatherDiseases.diseaseId == diseaseid )?

    // this.state.FetchedFatherDiseases[0]?.medicalHistId : (this.state.FetchedMotherDiseases[0].relationshipId == relationshipId && this.state.FetchedMotherDiseases[0].diseaseId == diseaseid )? this.state.FetchedMotherDiseases[0]?.medicalHistId : this.state.FetchedSiblingDiseases[0]?.medicalHistId


    // if(relationshipId == 9){
    //  fatherMedHistoryId = (this.state.FetchedFatherDiseases.length > 0) ? this.state.FetchedFatherDiseases.filter(v => v.relationshipId == 9)[0]?.medicalHistId : null
    // } 



    // konsole.log("AssesthandleSelectedIllness",relationshipId)
    this.AssesthandleSelectedIllness1(relationshipId, diseaseid, medtypeId);

  }

  AssesthandleSelectedIllness1 = (relationshipId, diseaseid, medtypeId, eventChecked) => {
    // const medtypeId = e.target.getAttribute("data-id");

    konsole.log("eventChecked", eventChecked)

    konsole.log("dataId", medtypeId);
    let aryinputdata = [];
    let inputdata = {};
    inputdata["isSuffering"] = document.getElementById("disease_" + relationshipId + "_" + diseaseid).checked;
    inputdata["relationshipId"] = relationshipId;
    inputdata["isCurrentlyLiving"] = true;
    inputdata["relationship"] = (relationshipId == this.state.fRelationshipId) ? "Father" : relationshipId == (this.state.mRelationshipId) ? "Mother" : "Sibling";
    // inputdata["illnessDuration"] = this.state.illnessDuration || 0;
    inputdata["illnessDurationTime"] = this.state.illnessDuration || 0;
    inputdata["formallyDiagnosed"] = this.state.formallyDiagnosed || "";
    inputdata["symptomsSigns"] = this.state.symptomsSigns || "",
      inputdata["remarks"] = this.state.remarks || "";
    inputdata["diseaseId"] = diseaseid || "";

    if (medtypeId !== null && medtypeId !== undefined) {
      inputdata["medicalHistId"] = medtypeId;
    }

    aryinputdata.push(inputdata);
    this.handleCloseIllnespop();
    konsole.log("diseaseIddiseaseIddiseaseId", aryinputdata);

    this.InvokeSaveHistoryApi(aryinputdata);

    // konsole.log("eventChecked",eventChecked)

    if (eventChecked !== false) {

      (relationshipId == this.state.fRelationshipId && (diseaseid == 1 || diseaseid == 2))
        ? this.handleFatherPopover(diseaseid) :
        (relationshipId == this.state.mRelationshipId && (diseaseid == 1 || diseaseid == 2))
          ? this.handleMotherPopover(diseaseid) :
          (relationshipId == this.state.sRelationshipId && (diseaseid == 1 || diseaseid == 2)) ?
            this.handleSiblingPopover(diseaseid) :
            "";
    }

  };

  // ...........................................................................................................
  handleSelectedIllness =
    (relationshipId, diseaseid, e) => {
      const medtypeId = e.target.getAttribute("data-id");


      konsole.log("dataId", medtypeId);
      let aryinputdata = [];
      let inputdata = {};
      inputdata["isSuffering"] = document.getElementById("disease_" + relationshipId + "_" + diseaseid).checked;
      inputdata["relationshipId"] = relationshipId;
      inputdata["isCurrentlyLiving"] = true;
      inputdata["relationship"] = (relationshipId == this.state.fRelationshipId) ? "Father" : relationshipId == (this.state.mRelationshipId) ? "Mother" : "Sibling";
      // inputdata["illnessDuration"] = this.state.illnessDuration || 0;
      inputdata["illnessDurationTime"] = this.state.illnessDuration || 0;
      inputdata["formallyDiagnosed"] = this.state.formallyDiagnosed || "";
      inputdata["symptomsSigns"] = this.state.symptomsSigns || "",
        inputdata["remarks"] = this.state.remarks || "";
      inputdata["diseaseId"] = diseaseid || "";

      if (medtypeId !== null && medtypeId !== undefined) {
        inputdata["medicalHistId"] = medtypeId;
      }

      aryinputdata.push(inputdata);
      this.handleCloseIllnespop();
      konsole.log("diseaseId", aryinputdata);

      this.InvokeSaveHistoryApi(aryinputdata);


      (relationshipId == this.state.fRelationshipId && (diseaseid == 1 || diseaseid == 2))
        ? this.handleFatherPopover(diseaseid) :
        (relationshipId == this.state.mRelationshipId && (diseaseid == 1 || diseaseid == 2))
          ? this.handleMotherPopover(diseaseid) :
          (relationshipId == this.state.sRelationshipId && (diseaseid == 1 || diseaseid == 2)) ?
            this.handleSiblingPopover(diseaseid) :
            "";

    };

  toasterAlert(test, type) {
    this.context.setdata($AHelper.toasterValueFucntion(true, test, type));
  }
  handleCloseIllnespop = () => {
    this.setState({
      ...this.state,
      illnessDuration: "",
      formallyDiagnosed: "",
      symptomsSigns: "",
      remarks: "",
    });
    document.body.click();
  };

 
//   handleBlur = (event) => {
//     const eventId = event.target.id;
//     const eventValue = event.target.value;
//     const age = parseInt(eventValue);
  
//     if (age >= 18) { 
//       this.setState({
//         ...this.state,
//         [eventId]: eventValue, 
//       });
//     } else {
//       this.setState({
//         ...this.state,
//         [eventId]: '', 
//       });
//       this.toasterAlert("You cannot enter an age less than 18 years", "Warning");
//     } 
// };
handleBlur = (event) => {
  const eventId = event.target.id;
  const eventValue = event.target.value;
  const age = parseInt(eventValue);

  if (eventValue.trim() === '') { 
    this.setState({
      ...this.state,
      [eventId]: '', 
    });
  } else if (age >= 18) { 
    this.setState({
      ...this.state,
      [eventId]: eventValue, 
    });
  } else {
    this.setState({
      ...this.state,
      [eventId]: '', 
    });
    this.toasterAlert("You cannot enter an age less than 18 years", "Warning");
  } 
};


  
  handleChange = (event) => {

    const eventId = event.target.id;
    const eventValue = event.target.value;
    konsole.log("eventIdeventId", eventId);
    konsole.log("eventIdeventId", eventValue);

    // if (eventId == "illnessDuration" && eventValue.length > 0 
    // // && $AHelper.regexfornoandstring(eventValue)
    // ) {
    //   return;
    // }

    if(eventId == "illnessDuration")
    {
      this.setState({
        ...this.state,
        [eventId]: eventValue,
      });
    }
    if (eventId == "fatherage" || eventId == "fatherageofDeath" || eventId == "Motherage" || eventId == "MotherageofDeath" || eventId == "noOfDeceasedSibling" || eventId == "noOfLivingSibling" ) {

      if ($AHelper.isNumberRegex(eventValue))
      //  && eventValue <= 130) 
      {
        this.setState({
          ...this.state,
          [eventId]: eventValue,
        });
      } else {
        this.toasterAlert("please enter valid number", "Warning");
        return;
      }
      if (eventValue > 130) {
        this.setState({
          ...this.state,
          [eventId]: '',
        });
        this.toasterAlert("You can not enter age greater than 130 years", "Warning");

      } else {
        this.setState({
          ...this.state,
          [eventId]: eventValue,
        });
      }

      //  }
      // } else {
      //   // alert("please enter number only");
      //   // this.toasterAlert("please enter number only","Warning")
      // }
    }
    else if (eventId == "fatherCauseofDeath" || eventId == "MotherCauseofDeath" || eventId == "formallyDiagnosed" || eventId == "symptomsSigns" || eventId == "remarks") {
      this.setState({
        ...this.state,
        [eventId]: eventValue,
      });
    }
  };

  handleClose = () => {
    this.context.setPageTypeId(null)
    this.setState({
      show: !this.state.show,
      showAlzFatherPopover: false,
      showAlzMotherPopover: false,
      showAlzSiblingPopover: false,
      showParkinsonFatherPopover: false,
      showParkinsonMotherPopover: false,
      showParkinsonSiblingPopover: false

    });
    this.handleClearDpc();
    // this.FetchFamilyhistory();
  };

  handleShow = () => {
    this.context.setPageTypeId(4)
    this.setState({
      show: !this.state.show,
    });
  };

  fradioValue = (event) => {
    const radioName = event.target.name;
    const radioValue = event.target.value;
    konsole.log("eventID", event.target.id, event.target.name);
    konsole.log(event.target.value);
    if (radioName == "fatherLive" && radioValue == "Yes") {
      this.setState({ ...this.state, [radioName]: true });
    } else {
      this.setState({ ...this.state, [radioName]: false });
    }
  };

  mradioValue = (event) => {
    const radioName = event.target.name;
    const radioValue = event.target.value;
    konsole.log(event.target.name);
    if (radioName == "motherLive" && radioValue == "Yes") {
      this.setState({ ...this.state, [radioName]: true });
    } else {
      this.setState({ ...this.state, [radioName]: false });
    }
  };


  handleCheckbox = (event, RelationshipId, diseaseValue) => {
    // const medtypeId = event.target.getAttribute("data-id");




    const eventId = event.target.id;
    const eventValue = event.target.value;
    const eventChecked = event.target.checked;

    konsole.log("eventVallue", RelationshipId, diseaseValue, eventChecked)
    konsole.log("evetnid", eventId);
    if (eventId == "disease_9_1") {
      if (eventChecked) {
        // konsole.log("eventVallue", fRelationshipId, diseaseValue,eventChecked)
        this.setState({
          showAlzFatherPopover: true,
        })
      } else if (!eventChecked) {
        let medHistidData;
        let filterdata = this.state.FetchedFatherDiseases.filter((e) => {
          return e.diseaseId == diseaseValue && e.relationshipId == RelationshipId
        })
        medHistidData = filterdata[0]?.medicalHistId
        konsole.log("medHistidData", medHistidData)
        this.AssesthandleSelectedIllness1(RelationshipId, diseaseValue, medHistidData, false)
      }
    }
    else if (eventId == "disease_10_1") {
      if (eventChecked) {
        konsole.log("eventVallue", eventValue)
        this.setState({
          showAlzMotherPopover: true,
        })
      } else {
        let medHistidData;
        let filterdata = this.state.FetchedMotherDiseases.filter((e) => {
          return e.diseaseId == diseaseValue && e.relationshipId == RelationshipId
        })
        medHistidData = filterdata[0]?.medicalHistId
        konsole.log("medHistidData", medHistidData)
        this.AssesthandleSelectedIllness1(RelationshipId, diseaseValue, medHistidData, false)

      }
    }
    else if (eventId == "disease_11_1") {
      if (eventChecked) {
        konsole.log("eventVallue", eventValue)
        this.setState({
          showAlzSiblingPopover: true,
        })
      } else {
        let medHistidData;
        let filterdata = this.state.FetchedSiblingDiseases.filter((e) => {
          return e.diseaseId == diseaseValue && e.relationshipId == RelationshipId
        })
        medHistidData = filterdata[0]?.medicalHistId
        konsole.log("medHistidData", medHistidData)
        this.AssesthandleSelectedIllness1(RelationshipId, diseaseValue, medHistidData, false)
      }
    }
    else if (eventId == "disease_9_2") {
      if (eventChecked) {
        konsole.log("eventVallue", eventValue)
        this.setState({
          showParkinsonFatherPopover: true,
        })
      } else {
        let medHistidData;
        let filterdata = this.state.FetchedFatherDiseases.filter((e) => {
          return e.diseaseId == diseaseValue && e.relationshipId == RelationshipId
        })
        medHistidData = filterdata[0]?.medicalHistId
        konsole.log("medHistidData", medHistidData)
        this.AssesthandleSelectedIllness1(RelationshipId, diseaseValue, medHistidData, false)

      }
    } else if (eventId == "disease_10_2") {
      if (eventChecked) {
        konsole.log("eventVallue", eventValue)
        this.setState({
          showParkinsonMotherPopover: true,
        })
      } else {
        let medHistidData;
        let filterdata = this.state.FetchedMotherDiseases.filter((e) => {
          return e.diseaseId == diseaseValue && e.relationshipId == RelationshipId
        })
        medHistidData = filterdata[0]?.medicalHistId
        konsole.log("medHistidData", medHistidData)
        this.AssesthandleSelectedIllness1(RelationshipId, diseaseValue, medHistidData, false)

      }
    } else if (eventId == "disease_11_2") {
      if (eventChecked) {
        konsole.log("eventVallue", eventValue)
        this.setState({
          showParkinsonSiblingPopover: true,
        })
      } else {
        let medHistidData;
        let filterdata = this.state.FetchedSiblingDiseases.filter((e) => {
          return e.diseaseId == diseaseValue && e.relationshipId == RelationshipId
        })
        medHistidData = filterdata[0]?.medicalHistId
        konsole.log("medHistidData", medHistidData)
        this.AssesthandleSelectedIllness1(RelationshipId, diseaseValue, medHistidData, false)

      }
    }

  }

  toasterAlert(test, type) {
    this.context.setdata($AHelper.toasterValueFucntion(true, test, type))
  }

  render() {
    konsole.log("state at family", this.state.noOfDeceasedSibling, this.state.noOfLivingSibling);

    let medTypeId = (this.state.FetchedMotherDiseases.length > 0) ? this.state.FetchedMotherDiseases.filter(v => v.diseaseId == 3)[0]?.medicalHistId : null;
    const alzPopover = (relationshipId, diseaseId,) => (

      <Popover id="popover" className="center-popover">
        <Popover.Body placement='top'>
          <div className="d-flex justify-content-between align-items-center">
            <Form className="w-100">
              <Form.Group className="mb-3 w-100">
                <Form.Label>
                  How long did this person live with dementia?
                </Form.Label>
                <Form.Control type="text" value={this.state.illnessDuration} onChange={(event) => { this.handleChange(event); }} id="illnessDuration" name="illnessDuration" placeholder="(Optional)" />
              </Form.Group>
              <Form.Group className="mb-3 w-100">
                <Form.Label>Was the dementia formally diagnosed?</Form.Label>
                <Form.Control type="text" value={this.state.formallyDiagnosed} onChange={(event) => { this.handleChange(event); }} name="formallyDiagnosed" id="formallyDiagnosed" placeholder="(Optional)" />
              </Form.Group>
              <Form.Group className="mb-3 w-100">
                <Form.Label>What signs did person show?</Form.Label>
                <Form.Control type="text" value={this.state.symptomsSigns} id="symptomsSigns" onChange={(event) => this.handleChange(event)} name="symptomsSigns" placeholder="(Optional)" />
              </Form.Group>
            </Form>
          </div>
          <div className="d-flex justify-content-end align-items-center my-3">
            <div className="d-flex justify-content-between gap-3">
              <button className='cancel-Button me-3 familyMedicalHistCancelButton'
                //  onClick={() =>
                //   (relationshipId == this.state.fRelationshipId) ? this.handleFatherPopover(diseaseId) : (relationshipId == this.state.mRelationshipId) ? this.handleMotherPopover(diseaseId) : this.handleSiblingPopover(diseaseId)} className="light-btn me-3"
                onClick={() => this.AssesthandleSelectedIllness(relationshipId, diseaseId)}
              > Cancel </button>
              <Button onClick={() => this.AssesthandleSelectedIllness(relationshipId, diseaseId)} className="theme-btn">
                Save
              </Button>
            </div>
          </div>
        </Popover.Body>
      </Popover>
    );

    const parkinson = (relationshipId, diseaseId) => (
      <Popover id="popover-basic" className="w-100 center-popover">
        <Popover.Body>
          <div className="d-flex justify-content-between align-items-center">
            <Form className="w-100">
              <Form.Group className="mb-3 w-100">
                <Form.Label>How long did they live with illness?</Form.Label>
                <Form.Control
                  // type="number"
                  value={this.state.illnessDuration}
                  onChange={(event) => { this.handleChange(event) }}
                  name="illnessDuration"
                  placeholder="(Optional)"
                  id="illnessDuration"
                />
              </Form.Group>
              <Form.Group className="mb-3 w-100">
                <Form.Label>
                  Did person have Parkinsons related dementia in their lives?
                </Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.remarks}
                  onChange={this.handleChange}
                  name="remarks"
                  id="remarks"
                  placeholder="(Optional)"
                />
              </Form.Group>
            </Form>
          </div>
          <div className="d-flex justify-content-end align-items-center my-3">
            <div className="d-flex justify-content-between">
              <button
                // onClick={() =>
                //   (relationshipId == this.state.fRelationshipId) ? this.handleFatherPopover(diseaseId) : (relationshipId == this.state.mRelationshipId) ? this.handleMotherPopover(diseaseId) : this.handleSiblingPopover(diseaseId)} 
                onClick={() => this.AssesthandleSelectedIllness(relationshipId, 2)}
                className="cancel-Button me-3 familyMedicalHistCancelButton"> Cancel </button>
              <Button
                onClick={() => this.AssesthandleSelectedIllness(relationshipId, 2)}
                className="theme-btn"
              >
                Save
              </Button>
            </div>
          </div>
        </Popover.Body>
      </Popover>
    );


    const medsr = (this.state.FetchedMotherDiseases.length > 0) ? this.state.FetchedMotherDiseases.filter(v => v.diseaseId == 3) : null
    konsole.log("sdfs", medsr);


    const fRelationshipId = this.state.fRelationshipId;
    const mRelationshipId = this.state.mRelationshipId;
    const sRelationshipId = this.state.sRelationshipId;

    const fatherdiseaseId = "disease_" + fRelationshipId + "_";
    const motherdiseaseId = "disease_" + mRelationshipId + "_";
    const siblingdiseaseId = "disease_" + sRelationshipId + "_";
    konsole.log("fatherDisease", this.state.FetchedFatherDiseases);
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
          .popover.show {
            position: absolute;
            inset: 0px auto auto 0px;
            transform: translate(707px, 380px);
          }
        `}</style>
        <a onClick={this.handleShow}>
          <img src="/icons/add-icon.svg" alt="Health Insurance" />
        </a>

        <Modal size="lg" show={this.state.show} centered onHide={this.handleClose} animation="false" id="familyHistory" enforceFocus={false} backdrop="static">
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Family Medical History </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {(this.state.showAlzFatherPopover ||
              this.state.showAlzMotherPopover ||
              this.state.showAlzSiblingPopover ||
              this.state.showParkinsonSiblingPopover ||
              this.state.showParkinsonFatherPopover ||
              this.state.showParkinsonFatherPopover || 
              this.state.showParkinsonMotherPopover
            
            ) && <div className="overlay_OverlayTrigger"></div>}

            <Row className="mt-2">
              <Col xs="12" sm="12" md="4" lg="4" className="d-flex align-items-center mb-3" id="familyHistory1">
                <div className="float-container">
                  <label className="fixed-float-label">
                    Is your father currently living ?
                  </label>
                  <div className="d-flex justify-content-center align-items-center my-3" >
                    <div key="checkbox843" className="me-4 pe-3 mb-0 d-flex align-items-center">
                      <Form.Check className="chekspace d-flex align-items-center" type="radio" name="fatherLive" id="fatherLive" label="Yes" defaultValue="Yes" onChange={(event) => this.fradioValue(event)}
                        defaultChecked={
                          this.state.fatherLive
                        }
                        key={"fatherLive" + this.state.fatherLive}
                      />
                    </div>
                    <div key="checkbox8343" className="me-4 pe-3 mb-0 d-flex align-items-center">
                      <Form.Check className="chekspace d-flex align-items-center" type="radio" name="fatherLive" checked={!this.state.fatherLive} id="fatherLive" label="No" defaultValue="No" onChange={(event) => this.fradioValue(event)}
                        defaultChecked={
                          !this.state.fatherLive
                        }
                        key={"fatherLive" + this.state.fatherLive}
                      />
                    </div>
                  </div>
                  {this.state.fatherLive ? (
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Control type="text" autoComplete="off" placeholder="Father's current age" value={this.state.fatherage} id="fatherage" onChange={(event) => { this.handleChange(event); }} onBlur={(event) => { this.handleBlur(event); }}  name="fatherage" maxLength={3} />
                      </Form.Group>
                    </Form>
                  ) : (
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Control type="text" autoComplete="off" id="fatherageofDeath" value={this.state.fatherageofDeath} onChange={(event) => { this.handleChange(event); }} onBlur={(event) => { this.handleBlur(event); }}  name="fatherageofDeath" placeholder="Age At Passing" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Control type="text" autoComplete="off" value={this.state.fatherCauseofDeath} onChange={(event) => this.handleChange(event)} name="fatherCauseofDeath" id="fatherCauseofDeath" placeholder="Reason For Passing" />
                      </Form.Group>


                    </Form>
                  )}
                </div>
              </Col>
              <Col xs="12" sm="12" md="4" lg="4" className="d-flex align-items-center ps-0 mb-3" id="familyHistory2">
                <div className="float-container">
                  <label className="fixed-float-label">
                    Is your mother currently living ?
                  </label>
                  <div className="d-flex justify-content-center align-items-center my-3">
                    <div key="checkbox8765" className="me-4 pe-3 mb-0 d-flex align-items-center">
                      <Form.Check className="chekspace d-flex align-items-center" type="radio" name="motherLive" label="Yes" defaultValue="Yes" onChange={(event) => this.mradioValue(event)} defaultChecked={
                        this.state.motherLive
                      } key={"motherLive" + this.state.motherLive} />
                    </div>
                    <div key="checkbox84456456" className="me-4 pe-3 mb-0 d-flex align-items-center">
                      <Form.Check className="chekspace d-flex align-items-center" type="radio" name="motherLive" checked={!this.state.motherLive} label="No" defaultValue="No" onChange={(event) => this.mradioValue(event)} defaultChecked={
                        !this.state.motherLive
                      } key={"motherLive" + this.state.motherLive} />
                    </div>
                  </div>
                  {this.state.motherLive ? (
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Control type="text" autoComplete="off" placeholder="Mother's current age" value={this.state.Motherage} onChange={(event) => { this.handleChange(event) }} onBlur={(event) => { this.handleBlur(event); }}  name="Motherage" id="Motherage" maxLength={3} />
                      </Form.Group>
                    </Form>
                  ) : (
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Control type="text" autoComplete="off" value={this.state.MotherageofDeath} onChange={(event) => {
                          this.handleChange(event);}} onBlur={(event) => { this.handleBlur(event); }} name="MotherageofDeath" id="MotherageofDeath" placeholder="Age At Passing" maxLength={3} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Control type="text" autoComplete="off" value={this.state.MotherCauseofDeath} onChange={(event) => this.handleChange(event)}  name="MotherCauseofDeath" id="MotherCauseofDeath" placeholder="Reason For Passing" />
                      </Form.Group>
                    </Form>
                  )}
                </div>
              </Col>
              <Col xs="12" sm="12" md="4" lg="4" className="d-flex align-items-center ps-0 mb-3">
                <div className="float-container">
                  <label className="fixed-float-label" id="familyHistory3">
                    Number of living siblings :
                  </label>
                  <Form>
                    <Form.Group className="my-3">
                      <Form.Control type="text" autoComplete="off" value={this.state.noOfLivingSibling} onChange={(event) => { this.handleChange(event); }} name="noOfLivingSibling" id="noOfLivingSibling" maxLength={2} />
                    </Form.Group>
                    <Form.Group className="mb-3" id="familyHistory4">
                      <Form.Label>Number of deceased siblings :</Form.Label>
                      <Form.Control type="text" autoComplete="off" value={this.state.noOfDeceasedSibling} onChange={(event) => { this.handleChange(event); }} name="noOfDeceasedSibling" id="noOfDeceasedSibling" maxLength={2} />
                    </Form.Group>
                  </Form>
                </div>
              </Col>
            </Row>

            <Row className="m-0 mb-3 mt-3">
              <Col xs="12" sm="12" lg="12" className="d-flex align-items-center ps-0">
                <h5>Family Medical History :</h5>
              </Col>
            </Row>
            <Row className="m-0 mb-3">
              <Col xs lg="8" className="ps-0 me-5">
                <div className="selecting-box d-flex align-items-center">
                  <div className="list-box"></div>
                  <div className="check-list">Father</div>
                  <div className="check-list">Mother</div>
                  <div className="check-list">Siblings</div>
                </div>
                <div
                  className="selecting-box d-flex align-items-center"
                  id="familyHistory10"
                >
                  <div className="list-box">Blood Pressure Issues</div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedFatherDiseases.length > 0) ? this.state.FetchedFatherDiseases.filter(v => v.diseaseId == 6)[0]?.medicalHistId : null}
                        id={fatherdiseaseId + 6}
                        onChange={(e) => this.handleSelectedIllness(fRelationshipId, 6, e)}
                        defaultChecked={this.state.FetchedFatherDiseases.length > 0 && this.state.FetchedFatherDiseases.some(v => v.diseaseId == 6 && v.isSuffering == true)}
                        key={"bp1" + this.state.FetchedFatherDiseases.length}
                      />
                    </div>
                  </div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedMotherDiseases.length > 0) ? this.state.FetchedMotherDiseases.filter(v => v.diseaseId == 6)[0]?.medicalHistId : null}
                        id={motherdiseaseId + 6}
                        onChange={(e) => this.handleSelectedIllness(mRelationshipId, 6, e)}
                        defaultChecked={this.state.FetchedMotherDiseases.length > 0 && this.state.FetchedMotherDiseases.some(v => v.diseaseId == 6 && v.isSuffering == true)}
                        key={"bp2" + this.state.FetchedMotherDiseases.length}
                      />
                    </div>
                  </div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedSiblingDiseases.length > 0) ? this.state.FetchedSiblingDiseases.filter(v => v.diseaseId == 6)[0]?.medicalHistId : null}
                        id={siblingdiseaseId + 6}
                        onChange={(e) => this.handleSelectedIllness(sRelationshipId, 6, e)}
                        defaultChecked={this.state.FetchedSiblingDiseases.length > 0 && this.state.FetchedSiblingDiseases.some(v => v.diseaseId == 6 && v.isSuffering == true)}
                        key={"bp3" + this.state.FetchedSiblingDiseases.length}
                      />
                    </div>
                  </div>
                </div>
                <div className="selecting-box d-flex align-items-center" id="familyHistory5">
                  <div className="list-box d-md-none">Dementia / Alzheimer’s</div>
                  <div className="list-box d-none d-sm-block">Dementia/Alzheimer’s</div>
                  <div className="check-list ">
                    <OverlayTrigger
                      trigger="click"
                      placement="top-start"
                      shouldUpdatePosition={true}
                      show={this.state.showAlzFatherPopover}
                      overlay={() => alzPopover(fRelationshipId, 1)}

                    >
                      <div key="inline-checkbox" className="rn-checkbox ">
                        <Form.Check
                          inline
                          label=""
                          name="group1"
                          type="checkbox"
                          id={fatherdiseaseId + 1}
                          defaultChecked={this.state.FetchedFatherDiseases.length > 0 && this.state.FetchedFatherDiseases.some(v => v.diseaseId == 1 && v.isSuffering == true)}
                          onChange={(event) => this.handleCheckbox(event, fRelationshipId, 1)}
                          key={"da1" + this.state.FetchedFatherDiseases.length}
                        />
                      </div>
                    </OverlayTrigger>
                  </div>
                  <div className="check-list">
                    {" "}
                    <OverlayTrigger
                      trigger="click"
                      placement="right"
                      overlay={() => alzPopover(mRelationshipId, 1)}
                      show={this.state.showAlzMotherPopover}
                    >
                      <div key="inline-checkbox" className="rn-checkbox">
                        <Form.Check
                          inline
                          label=""
                          name="group1"
                          type="checkbox"
                          id={motherdiseaseId + 1}
                          defaultChecked={this.state.FetchedMotherDiseases.length > 0 && this.state.FetchedMotherDiseases.some(v => v.diseaseId == 1 && v.isSuffering == true)}
                          key={"da2" + this.state.FetchedMotherDiseases.length}
                          onChange={(event) => this.handleCheckbox(event, mRelationshipId, 1)}
                        />
                      </div>
                    </OverlayTrigger>{" "}
                  </div>
                  <div className="check-list">
                    {" "}
                    <OverlayTrigger
                      placement="right"
                      trigger="click"
                      rootClose={true}
                      overlay={() => alzPopover(sRelationshipId, 1)}
                      show={this.state.showAlzSiblingPopover}
                    >
                      <div key="inline-checkbox" className="rn-checkbox">
                        <Form.Check
                          inline
                          label=""
                          name="group1"
                          type="checkbox"
                          id={siblingdiseaseId + 1}
                          defaultChecked={this.state.FetchedSiblingDiseases.length > 0 && this.state.FetchedSiblingDiseases.some(v => v.diseaseId == 1 && v.isSuffering == true)}
                          key={"da3" + this.state.FetchedSiblingDiseases.length}
                          onChange={(event) => this.handleCheckbox(event, sRelationshipId, 1)}
                        />
                      </div>
                    </OverlayTrigger>{" "}
                  </div>
                </div> 
                <div
                  className="selecting-box d-flex align-items-center"
                  id="familyHistory9"
                >
                  <div className="list-box">Diabetes</div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedFatherDiseases.length > 0) ? this.state.FetchedFatherDiseases.filter(v => v.diseaseId == 5)[0]?.medicalHistId : null}
                        id={fatherdiseaseId + 5}
                        onChange={(e) => this.handleSelectedIllness(fRelationshipId, 5, e)}
                        defaultChecked={this.state.FetchedFatherDiseases.length > 0 && this.state.FetchedFatherDiseases.some(v => v.diseaseId == 5 && v.isSuffering == true)}
                        key={"dia1" + this.state.FetchedFatherDiseases.length}
                      />
                    </div>
                  </div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedMotherDiseases.length > 0) ? this.state.FetchedMotherDiseases.filter(v => v.diseaseId == 5)[0]?.medicalHistId : null}
                        id={motherdiseaseId + 5}
                        onChange={(e) => this.handleSelectedIllness(mRelationshipId, 5, e)}
                        defaultChecked={this.state.FetchedMotherDiseases.length > 0 && this.state.FetchedMotherDiseases.some(v => v.diseaseId == 5 && v.isSuffering == true)}
                        key={"dia2" + this.state.FetchedMotherDiseases.length}
                        // && v.medicalHistId !== 5282
                      />
                    </div>
                  </div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedSiblingDiseases.length > 0) ? this.state.FetchedSiblingDiseases.filter(v => v.diseaseId == 5)[0]?.medicalHistId : null}
                        id={siblingdiseaseId + 5}
                        onChange={(e) => this.handleSelectedIllness(sRelationshipId, 5, e)}
                        defaultChecked={this.state.FetchedSiblingDiseases.length > 0 && this.state.FetchedSiblingDiseases.some(v => v.diseaseId == 5 && v.isSuffering == true)}
                        key={"dia3" + this.state.FetchedSiblingDiseases.length}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="selecting-box d-flex align-items-center"
                  id="familyHistory11"
                >
                  <div className="list-box">Elevated Cholesterol</div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedFatherDiseases.length > 0) ? this.state.FetchedFatherDiseases.filter(v => v.diseaseId == 7)[0]?.medicalHistId : null}
                        id={fatherdiseaseId + 7}
                        onChange={(e) => this.handleSelectedIllness(fRelationshipId, 7, e)}
                        defaultChecked={this.state.FetchedFatherDiseases.length > 0 && this.state.FetchedFatherDiseases.some(v => v.diseaseId == 7 && v.isSuffering == true)}
                        key={"ec1" + this.state.FetchedFatherDiseases.length}
                      />
                    </div>
                  </div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedMotherDiseases.length > 0) ? this.state.FetchedMotherDiseases.filter(v => v.diseaseId == 7)[0]?.medicalHistId : null}
                        id={motherdiseaseId + 7}
                        onChange={(e) => this.handleSelectedIllness(mRelationshipId, 7, e)}
                        defaultChecked={this.state.FetchedMotherDiseases.length > 0 && this.state.FetchedMotherDiseases.some(v => v.diseaseId == 7 && v.isSuffering == true)}
                        key={"ec2" + this.state.FetchedMotherDiseases.length}
                      />
                    </div>
                  </div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedSiblingDiseases.length > 0) ? this.state.FetchedSiblingDiseases.filter(v => v.diseaseId == 7)[0]?.medicalHistId : null}
                        id={siblingdiseaseId + 7}
                        onChange={(e) => this.handleSelectedIllness(sRelationshipId, 7, e)}
                        defaultChecked={this.state.FetchedSiblingDiseases.length > 0 && this.state.FetchedSiblingDiseases.some(v => v.diseaseId == 7 && v.isSuffering == true)}
                        key={"ec3" + this.state.FetchedSiblingDiseases.length}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="selecting-box d-flex align-items-center"
                  id="familyHistory12"
                >
                  <div className="list-box">Glaucoma</div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedFatherDiseases.length > 0) ? this.state.FetchedFatherDiseases.filter(v => v.diseaseId == 8)[0]?.medicalHistId : null}
                        id={fatherdiseaseId + 8}
                        onChange={(e) => this.handleSelectedIllness(fRelationshipId, 8, e)}
                        defaultChecked={this.state.FetchedFatherDiseases.length > 0 && this.state.FetchedFatherDiseases.some(v => v.diseaseId == 8 && v.isSuffering == true)}
                        key={"gl1" + this.state.FetchedFatherDiseases.length}
                      />
                    </div>
                  </div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedMotherDiseases.length > 0) ? this.state.FetchedMotherDiseases.filter(v => v.diseaseId == 8)[0]?.medicalHistId : null}
                        id={motherdiseaseId + 8}
                        onChange={(e) => this.handleSelectedIllness(mRelationshipId, 8, e)}
                        defaultChecked={this.state.FetchedMotherDiseases.length > 0 && this.state.FetchedMotherDiseases.some(v => v.diseaseId == 8 && v.isSuffering == true)}
                        key={"gl2" + this.state.FetchedMotherDiseases.length}
                      />
                    </div>
                  </div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check inline label="" name="group1" type="checkbox"
                        data-id={(this.state.FetchedSiblingDiseases.length > 0) ? this.state.FetchedSiblingDiseases.filter(v => v.diseaseId == 8)[0]?.medicalHistId : null}
                        id={siblingdiseaseId + 8}
                        defaultChecked={this.state.FetchedSiblingDiseases.length > 0 && this.state.FetchedSiblingDiseases.some(v => v.diseaseId == 8 && v.isSuffering == true)} onChange={(e) => this.handleSelectedIllness(sRelationshipId, 8, e)} 
                        key={"gl3" + this.state.FetchedSiblingDiseases.length}
                        />
                    </div>
                  </div>
                </div>
                  <div
                  className="selecting-box d-flex align-items-center"
                  id="familyHistory7"
                >
                  <div className="list-box">Heart Disease</div>
                  <div className="check-list">
                    {/* <OverlayTrigger trigger="click" placement="right" rootClose={true} 
                    overlay={() => popover(fRelationshipId, 3)}
                    onChange = {(event) => this.handleCheckbox(event)}
                    > */}
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check inline label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedFatherDiseases.length > 0) ? this.state.FetchedFatherDiseases.filter(v => v.diseaseId == 3)[0]?.medicalHistId : null}
                        id={fatherdiseaseId + 3}
                        onChange={(e) => this.handleSelectedIllness(fRelationshipId, 3, e)}
                        defaultChecked={this.state.FetchedFatherDiseases.length > 0 && this.state.FetchedFatherDiseases.some(v => v.diseaseId == 3 && v.isSuffering == true)}
                        key={"hd1" + this.state.FetchedFatherDiseases.length}
                      />
                    </div>
                  </div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedMotherDiseases.length > 0) ? this.state.FetchedMotherDiseases.filter(v => v.diseaseId == 3)[0]?.medicalHistId : null}
                        id={motherdiseaseId + 3}
                        onChange={(e) => this.handleSelectedIllness(mRelationshipId, 3, e)}
                        defaultChecked={this.state.FetchedMotherDiseases.length > 0 && this.state.FetchedMotherDiseases.some(v => v.diseaseId == 3 && v.isSuffering == true)}
                        key={"hd2" + this.state.FetchedMotherDiseases.length}
                      />
                    </div>
                  </div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedSiblingDiseases.length > 0) ? this.state.FetchedSiblingDiseases.filter(v => v.diseaseId == 3)[0]?.medicalHistId : null}
                        id={siblingdiseaseId + 3}
                        onChange={(e) => this.handleSelectedIllness(sRelationshipId, 3, e)}
                        defaultChecked={this.state.FetchedSiblingDiseases.length > 0 && this.state.FetchedSiblingDiseases.some(v => v.diseaseId == 3 && v.isSuffering == true)}
                        key={"hd3" + this.state.FetchedSiblingDiseases.length}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="selecting-box d-flex align-items-center"
                  id="familyHistory6"
                >
                  <div className="list-box">Parkinson’s</div>
                  <div className="check-list">
                    {" "}
                    <OverlayTrigger
                      trigger="click"
                      placement="right"
                      rootClose={true}
                      overlay={() => parkinson(fRelationshipId, 2)}
                      show={this.state.showParkinsonFatherPopover}>
                      <div key="inline-checkbox" className="rn-checkbox">
                        <Form.Check
                          inline
                          label=""
                          name="group1"
                          type="checkbox"
                          id={fatherdiseaseId + 2}
                          defaultChecked={this.state.FetchedFatherDiseases.length > 0 && this.state.FetchedFatherDiseases.some(v => v.diseaseId == 2 && v.isSuffering == true)}
                          onChange={(event) => this.handleCheckbox(event, fRelationshipId, 2)}
                          key={"prk1" + this.state.FetchedFatherDiseases.length}
                        />
                      </div>
                    </OverlayTrigger>
                  </div>
                  <div className="check-list">
                    {" "}
                    <OverlayTrigger
                      trigger="click"
                      placement="right"
                      rootClose={true}
                      show={this.state.showParkinsonMotherPopover}
                      overlay={() => parkinson(mRelationshipId, 2)}
                    >
                      <div key="inline-checkbox" className="rn-checkbox">
                        <Form.Check
                          inline
                          label=""
                          name="group1"
                          type="checkbox"
                          id={motherdiseaseId + 2}
                          defaultChecked={this.state.FetchedMotherDiseases.length > 0 && this.state.FetchedMotherDiseases.some(v => v.diseaseId == 2 && v.isSuffering == true)}
                          onChange={(event) => this.handleCheckbox(event, mRelationshipId, 2)}
                          key={"prk2" + this.state.FetchedMotherDiseases.length}
                        />
                      </div>
                    </OverlayTrigger>
                  </div>
                  <div className="check-list">
                    <OverlayTrigger
                      trigger="click"
                      rootClose={true}
                      overlay={() => parkinson(sRelationshipId, 2)}
                      show={this.state.showParkinsonSiblingPopover}
                    >
                      <div key="inline-checkbox" className="rn-checkbox">
                        <Form.Check inline label="" name="group1" type="checkbox" id={siblingdiseaseId + 2} defaultChecked={this.state.FetchedSiblingDiseases.length > 0 && this.state.FetchedSiblingDiseases.some(v => v.diseaseId == 2 && v.isSuffering == true)} onChange={(event) => this.handleCheckbox(event, sRelationshipId, 2)}
                          key={"prk3" + this.state.FetchedSiblingDiseases.length}
                          />
                      </div>
                    </OverlayTrigger>{" "}
                  </div>
                </div>
                <div
                  className="selecting-box d-flex align-items-center"
                  id="familyHistory8"
                >
                  <div className="list-box">Stroke</div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedFatherDiseases.length > 0) ? this.state.FetchedFatherDiseases.filter(v => v.diseaseId == 4)[0]?.medicalHistId : null}
                        id={fatherdiseaseId + 4}
                        onChange={(e) => this.handleSelectedIllness(fRelationshipId, 4, e)}
                        defaultChecked={this.state.FetchedFatherDiseases.length > 0 && this.state.FetchedFatherDiseases.some(v => v.diseaseId == 4 && v.isSuffering == true)}
                        key={"strk1" + this.state.FetchedFatherDiseases.length}
                        />
                    </div>
                  </div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedMotherDiseases.length > 0) ? this.state.FetchedMotherDiseases.filter(v => v.diseaseId == 4)[0]?.medicalHistId : null}
                        id={motherdiseaseId + 4}
                        onChange={(e) => this.handleSelectedIllness(mRelationshipId, 4, e)}
                        defaultChecked={this.state.FetchedMotherDiseases.length > 0 && this.state.FetchedMotherDiseases.some(v => v.diseaseId == 4 && v.isSuffering == true)}
                        key={"strk2" + this.state.FetchedMotherDiseases.length}
                      />
                    </div>
                  </div>
                  <div className="check-list">
                    <div key="inline-checkbox" className="rn-checkbox">
                      <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        data-id={(this.state.FetchedSiblingDiseases.length > 0) ? this.state.FetchedSiblingDiseases.filter(v => v.diseaseId == 4)[0]?.medicalHistId : null}
                        id={siblingdiseaseId + 4}
                        onChange={(e) => this.handleSelectedIllness(sRelationshipId, 4, e)}
                        defaultChecked={this.state.FetchedSiblingDiseases.length > 0 && this.state.FetchedSiblingDiseases.some(v => v.diseaseId == 4 && v.isSuffering == true)}
                        key={"strk3" + this.state.FetchedSiblingDiseases.length}
                      />
                    </div>
                  </div>
                </div>
               
              </Col>
            </Row>
            <div className='d-flex justify-content-end'>
              <Button onClick={()=>this.SaveFamilyHistory('saveUpdateBtn')} className="theme-btn" style={{ backgroundColor: "#76272b" }}
                disabled={this.state.disable == true ? true : false}>
                {
                  this.state.updateOrSave == false ? "Save" : "Update"
                }
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
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(familymedicalhistory);