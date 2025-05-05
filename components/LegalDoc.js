import React, { Component } from "react";
import { Modal, Button, Form, Row, Col, Table, Card, Container } from "react-bootstrap";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { $Service_Url } from "../components/network/UrlPath";
import Select from "react-select";
import { $AHelper } from "./control/AHelper";
import DatePicker from "react-datepicker";
import { $CommonServiceFn } from "../components/network/Service";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import moment from "moment";
import Other from "./asssets/Other";
import { globalContext } from "../pages/_app";
import DatepickerComponent from "./DatepickerComponent";
import OtherInfo from "./asssets/OtherInfo";
import AlertToaster from "./control/AlertToaster";
// import { transform } from 'html2canvas/dist/types/css/property-descriptors/transform';

class LegalDoc extends Component {
  static contextType = globalContext;
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.primaryUserId,
      showLegalDoc: false,
      logginUserId: sessionStorage.getItem("loggedUserId"),
      legalDocType: [],
      legalDocument: [],
      legalDocTypeId: 0,
      dateExecuted: "",
      docName: "",
      disable: false,
      docPath: "",
      natureId: "",
      serarrow: "rotate(180deg)",
      upAndDownArrowImg: "/images/UpArrow.png",
      selectedLegalDocs: [],
      documentDropDown: false,
      deleteData: "",
      count:0
    };
    this.legalDocRef = React.createRef();
  }

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    this.setState(
      {
        userId: newuserid,
      },
      () => {
        this.fetchLegalTypes();
      }
    );

    // document.getElementById("DisplayBlock").style.display = "none";
    this.setHideAndShow("80vh");
  }
  componentDidUpdate()
  {

    // this.fetchLegalTypes()
  }

  setHideAndShow = (height) => {
    this.setState({
      hideAndShow: height,
    });
  };

  setUpAndDownArrowImg = (height) => {
    this.setState({
      upAndDownArrowImg: height,
    });
  };

  toggleDropDown = (documentDropDown) => {
    this.setState({
      documentDropDown: !documentDropDown,
    });
    if (documentDropDown == false) {
      this.setUpAndDownArrowImg("/images/UpArrow.png");
      this.setHideAndShow("80vh");
      // document.getElementById("DisplayBlock").style.display = "none"
    } else {
      this.setUpAndDownArrowImg("/images/downArrow.png");
      this.setHideAndShow("100%");
    }
    // document.getElementById("DisplayBlock").style.display = "block"
  };

  handleShow = () => {
    this.setState({
      showLegalDoc: !this.state.showLegalDoc,
    });
    this.clearState();
  };

  fetchLegalTypes = () => {
 
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getLegalType,
      "",
      (response) => {
        this.props.dispatchloader(false);
        if (response) {
         console.log("fwrfggterg",response.data.data)
          const map = response.data.data.map((item) => {
            return {
              legalDocTypeId: item.value,
              legalDoc: item.label,
              checked: undefined,
              selectedDate: "",
              userLegalDocId: 0,
              editType: "POST",
            };
          });
          console.log("dsdsds",map)

          this.setState(
            {
              ...this.state,
              legalDocType: response.data.data,
              selectedLegalDocs: map,
            },

            () => {
              this.fetchLegalDocument( this.state.userId,
              this.state.legalDocType
              );
            }
          );
          console.log("setlegalDocTypeold",response.data.data,"map",map) 
        }
      }
    );
  };

  fetchLegalDocument = (newuserid, map) => {
    let userId = newuserid || this.state.userId;
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getLegalDocument + userId + "/0",
      "",
      (response) => {
        if (response) {
          this.props.dispatchloader(false);
          const responseLegalDoc = response.data.data.legalDocuments;
          konsole.log("response.data.data.legalDocuments",response.data.data.legalDocuments)
          for (let i = 0; i < map.length; i++) {
            konsole.log("mapper", responseLegalDoc, map);
            for (let j = 0; j < responseLegalDoc.length; j++) {

              if (map[i].value == responseLegalDoc[j].legalDocTypeId) {

                if(map[i].value=="999999")
                {
                  map[i]["disable"] = false;
                  
                }
                else
                {
                  map[i]["disable"] = true;
                }
                
               
              }
             
            }
          }

          konsole.log("show legal document", map,responseLegalDoc);
          this.setState({
            ...this.state,
            legalDocument: responseLegalDoc,
            legalDocType: map,
          });
          // legalDocType: response.data.data,
          // selectedLegalDocs: map,
        }
      }
    );
  };

  validate = (date) => {
    let nameError = "";
    if (date == "") {
      nameError = "Please enter the Document date executed ";
    }

    if (nameError) {
      this.toasterAlert(nameError, "Warning");
      return true;
    }
    return false;
  };

  postJson = async () => {

    const selectedLegalDocs = this.state.selectedLegalDocs.filter((item) => item.checked == true);
    if (selectedLegalDocs.length == 0) {
      this.toasterAlert("Please Select Legal Document", "Warning");
      return;
    }

    console.log("sadasdsa",selectedLegalDocs)
  
    for (let json of selectedLegalDocs) {
      // if (this.validate(json.selectedDate)) {
      //   return;
      // }
    }
    for (let [index, json] of selectedLegalDocs.entries()) {
      json.upsertedBy = this.state.logginUserId;
      json.isActive = 1;
      json.dateExecuted =
        json.selectedDate !== ""
          ? $AHelper.getFormattedDate(json?.selectedDate)
          : null;
      delete json.selectedDate;
    }

    konsole.log("selectedLegalDocs", selectedLegalDocs);
    
    await this.postLegalDoc(selectedLegalDocs);

    this.fetchLegalDocument(this.state.userId, this.state.legalDocType);
   
    this.fetchLegalTypes();
    this.toggleDropDown(true)
    // this.props.handleClose();
     
  };

 
  postLegalDoc = async (json) => {
    return new Promise((resolve, reject) => {
       
      let postlegalData = {
        userId: this.state.userId,
        legalDocuments: json,
      };
      this.state.disable = true
      this.props.dispatchloader(true);
      // console.log("postlegalData", JSON.stringify(postlegalData))
      $CommonServiceFn.InvokeCommonApi(
        "POST",
        $Service_Url.postLegalDocument,
        postlegalData,
        (response) => {
          this.props.dispatchloader(false);
          if (response) {
            konsole.log("legaldocrsponseofpost",response.data.data.legalDocuments)
            this.state.disable = false

            let responseLegalDoc = response.data.data.legalDocuments.filter(
              (data) => parseInt(data.legalDocTypeId) == 999999
            );
            
            konsole.log("Success res1" + JSON.stringify(response));
            konsole.log("Success res2", response);
            this.state.deleteData == "delete"
              ? AlertToaster.success("Legal documents deleted successfully")
              : this.state.deleteData == "update"
                ? AlertToaster.success("Legal documents updated successfully")
                : AlertToaster.success("Legal documents saved successfully");

            // alert("Information updated successfully");
            resolve("done");
            
            this.state.deleteData = "";
            if (responseLegalDoc.length > 0) {
              this.legalDocRef.current.saveHandleOther(
                responseLegalDoc[0].userLegalDocId
              );
            }
          } else {
            reject("error");
            this.toasterAlert(Msg.ErrorMsg, "Warning");
            this.setState({disable:false})
          }
        }
      );
    });
  };

  clearState = () => {
    this.setState({
      legalDocTypeId: "",
      dateExecuted: "",
    });
  };
  updateLegalDoc = (legal) => {
    // console.log("legallegal", legal)
    // let dateExecuted =
    // console.log("dateExecuted", legal)
    const selectedLegalDocsObj = this.state.selectedLegalDocs;

    for (let i = 0; i < selectedLegalDocsObj.length; i++) {
      // konsole.log("mapper", responseLegalDoc, map);
      if (selectedLegalDocsObj[i].legalDocTypeId == legal.legalDocTypeId) {
        selectedLegalDocsObj[i]["checked"] = true;
        selectedLegalDocsObj[i]["userLegalDocId"] = legal.userLegalDocId;
        selectedLegalDocsObj[i]["selectedDate"] =
          legal.dateExecuted !== null
            ? moment(legal.dateExecuted).toDate()
            : "";
        selectedLegalDocsObj[i]["editType"] = "PUT";
        this.state.deleteData = "update";
      }
      // for (let j = 0; j < legal.length; j++) {
      // }
    }
    konsole.log("userLinked", selectedLegalDocsObj);
    this.setState({
      selectedLegalDocs: selectedLegalDocsObj,
    });
  };
  toasterAlert(text, type) {
    this.context.setdata({ open: true, text: text, type: type });
  }

  deleteLegalDocuments = async (json) => {
   
    const ques = await this.context.confirm(true,"Are you sure you want to delete this file.","Confirmation");
    // return;
    if (ques) {
    json.upsertedBy = this.state.logginUserId;
    json.isActive = 0;
    json.dateExecuted =
    json.selectedDate !== ""? $AHelper.getFormattedDate(json.selectedDate): null;
    delete json.selectedDate;
      // this.state.disable=false
    this.state.deleteData = "delete";
    await this.postLegalDoc([json]);
    // konsole.log("resultresultresult",result)
    konsole.log("this.state.userId, this.state.legalDocType",this.state.userId, this.state.legalDocType)
    this.fetchLegalDocument(this.state.userId, this.state.legalDocType);

    this.fetchLegalTypes()
      
    konsole.log("resultresultresulta2")
      
    //  if(json?.legalDocTypeId==999999)
    //  {
    //   this.props.handleClose();
    //  }
      
    }
       
    
     
  };

  selectMultipleOptions = (e, index, item) => {
    const checked = e.target.checked;
    const selectedLegalDocs = this.state.selectedLegalDocs;
    if (index >= 0) {
      selectedLegalDocs[index].checked = checked;
    }
    this.setState({
      selectedLegalDocs: selectedLegalDocs,
    });
  };

  setChooseDateSelected = (value, index, data) => {
    const selectedLegalDocs = this.state.selectedLegalDocs;

    if (index >= 0){
      selectedLegalDocs.map((e)=>{
        if(parseInt(data.legalDocTypeId) <= parseInt(e.legalDocTypeId)){
        e.selectedDate = value
        }
      })
    }else {
      selectedLegalDocs[index].selectedDate = value;
    }

    this.setState({
      selectedLegalDocs: selectedLegalDocs,
    });
  };

  removeFile = (index) => {
    konsole.log("indexdxdx",index)
    const selectedLegalDocs = this.state.selectedLegalDocs;
    if (index >= 0) {
      
      konsole.log("selectedLegalDocs", selectedLegalDocs)
      selectedLegalDocs[index].checked = false;
    }

    this.setState({
      selectedLegalDocs: selectedLegalDocs,
      
    });
  };

  render() {
    let legalTypeObj = {};

    if ($AHelper.typeCasteToString(this.state.legalDocTypeId) !== "999999") {
      legalTypeObj =
        this.state.legalDocTypeId !== "" && this.state.legalDocTypeId !== 0
          ? this.state.legalDocType[this.state.legalDocTypeId - 1]
          : "";
    } else {
      legalTypeObj =
        this.state.legalDocTypeId !== ""
          ? this.state.legalDocType[this.state.legalDocType.length - 1]
          : "";
    }

  //   legalDocument: responseLegalDoc,
  //   legalDocType: map,
  // });
console.log("dsdsdd_legalDocument",this.state.legalDocument,"legaldoctype",this.state.legalDocType,"selected",this.state.selectedLegalDocs)
    return (
      <>
        {/* <style jsx global>
          {`
            .modal-open .modal-backdrop.show {
              opacity: 0;
            }
            .modal-dialog {
              max-width: 52.25 rem !important;
              margin: 1.75 rem auto !important;
            }
          `}
        </style> */}
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            max-width: 52.25rem;
            margin: 1.75rem auto;
          }
        `}</style>


        <Modal
          show={this.props.show}
          size="lg"
          centered
          onHide={this.props.handleClose}
          animation="false"
          backdrop="static"
          enforceFocus={false} 
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Legal Documents</Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            <Container>
            <Form.Group  className="">
              <Row className="w-100">
              <Col lg={7} className="m-0 p-0" >
                <div className="container-fluid bg-white m-0 p-0 ">
                  <div className="d-flex justify-content-start">
                    <div className="p-1 w-100 h-100  border">
                      <div
                          className="d-flex justify-content-between align-items-center"
                         onClick={() =>
                          this.toggleDropDown(this.state.documentDropDown)
                        }
                      >
                          <div className="fs-4 d-flex justify-content-between align-items-center ps-2">
                          Select Legal Documents
                        </div>
                        <div style={{ cursor: "pointer"}} className="d-flex justify-content-center align-items-center">
                          <img
                            src={this.state.upAndDownArrowImg}
                            alt="Error"
                            className="m-0 p-0"
                            style={{ transform: this.state.serarrow }}
                            onClick={() => {
                              this.setState({ serarrow: "rotate(0deg)" });
                            }}
                          />
                        </div>
                      </div>
                      {this.state.documentDropDown == true ? (
                        this.state.legalDocType.map((item, index) => {
                           return (
                            <>
                              <div className="d-flex ps-2">
                                <div>
                                  {/* <input
                                    type="checkbox"
                                    defaultChecked={
                                      this.state.selectedLegalDocs.some(
                                        (x) =>
                                          x.legalDocTypeId == item.value &&
                                          x.checked == true
                                      )
                                        ? true
                                        : false
                                    }
                                   
                                    id={item.legalDocTypeId}
                                    onChange={(e) =>
                                      this.selectMultipleOptions(e, index, item)
                                    }
                                    disabled={item?.disable == true}
                                  /> */}

                                  <input
                                    type="checkbox"
                                    checked={ this.state.selectedLegalDocs.some((x) => x.legalDocTypeId === item.value && x.checked === true) ||item?.disable==true }
                                    id={item.legalDocTypeId}
                                    onChange={(e) =>this.selectMultipleOptions(e, index, item)}
                                    disabled={item?.disable === true}
                                  />

                                </div>
                                <div>
                                  <p
                                    className={`fs-5 ${item?.disable == true ? "text-muted" : " "
                                      } ms-2`}
                                  >
                                    {item.label}
                                  </p>
                                </div>
                              </div>
                            </>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
              </Row>

            </Form.Group>

            <Row className="" style={{marginTop:"20px"}}>
              <Col>
              {/* <div className="Container"> */}
                {this.state.selectedLegalDocs.length > 0 &&
                  this.state.selectedLegalDocs.map((item, index) => {
                    konsole.log("itemsshow", item);
                    return (
                      <>
                        {item.checked == true ? (
                          <Row className="border d-flex align-items-center justify-content-between mb-2">
                            <Col className="p-1">

                            <div className="row justify-content-between ps-2">
                            {item.legalDocTypeId !== "999999" && (
                            <p className="">{item.legalDoc}</p>
                            )}
                            {item.legalDocTypeId == "999999" && (
                              <>
                              <div className="col-2 d-flex justify-content-center align-items-center">
                                <p className="">{item.legalDoc}</p>
                            </div>
                              <div className="col-10">
                                <div>
                                  <Other
                                    othersCategoryId={14}
                                    userId={this.state.userId}
                                    dropValue={item.legalDocTypeId}
                                    ref={this.legalDocRef}
                                    natureId={item.userLegalDocId}
                                  />
                                </div>
                                </div>
                              </>
                           
                              )}
                            

                            </div>
                            
                             
                            </Col>

                            <Col xs sm="6" lg="5">
                              <DatepickerComponent
                                name="dateExecuted"
                                value={
                                  this.state.selectedLegalDocs[index]
                                    .selectedDate
                                }
                                setValue={(value) =>
                                  this.setChooseDateSelected(value, index, item)
                                }
                                placeholderText="Date Executed"
                                maxDate={0}
                                minDate="100"
                              />
                            </Col>

                            <Col xs sm="1" lg="1" className="d-flex justify-content-end align-items-center">
                              <div className="pb-2">

                                <img 
                                // src="/images/legalCross.svg"
                                src="/icons/deleteIcon.svg"
                                 className="cursor-pointer" style={{width:"15px"}} onClick={() => this.removeFile(index)} />
                              </div>
                              
                            </Col>
                          </Row>
                        ) : (
                          <></>
                        )}
                      </>
                    );
                  })}
              {/* </div> */}
              </Col>
            </Row>

            {/* {this.state.legalDocument && <div className='d-flex justify-content-end'><button className='theme-btn' onClick={()=>this.updateLegalDoc(this.state.legalDocument)}>Edit All</button></div>} */}
            <Row className="" >
              <Col className="m-0 p-0">
              <div>
                <Button
                style={{backgroundColor:"#76272b", border:"none"}}
                className="theme-btn" onClick={this.postJson}
                   disabled={this.state.disable == true ? true : false}
                >
                  {(this.state.deleteData == "update" ? "Update" : "Save")}
                </Button>
              </div>
              </Col>
            </Row>

            <Form.Group as={Row} style={{marginTop:"20px",overflowY:"auto", height:"10rem"}}>
              <Col lg="12" className="m-0 p-0 financialInformationTable">
              {this.state.legalDocument.length > 0 && (
                <Table bordered className="m-0 p-0 table-responsive ">
                  <thead>
                    <tr>
                      <th>Documents</th>
                      <th>Date Executed</th>
                      <th></th>

                    </tr>
                  </thead>

                  <tbody className="my-4">
                    {this.state.legalDocument &&
                      this.state.legalDocument.map((l, index) => {
                        // console.log("ddddd", l.dateExecuted)
                        return (
                          <tr key={index}>
                            <td style={{wordBreak:"break-word"}}>
                              {/* {l.legalDocType} */}
                              <OtherInfo
                                key={l?.userLegalDocId}
                                othersCategoryId={14}
                                othersMapNatureId={l?.userLegalDocId}
                                FieldName={l.legalDocType}
                                userId={this.state.userId}

                              />
                            </td>

                            <td>
                              {l.dateExecuted !== null &&
                                $AHelper.getFormattedDate(l.dateExecuted)}
                            </td>
                            <td style={{verticalAlign:"middle"}}>
                              {/* <span style={{ textDecoration: "underline", cursor: "pointer", }} onClick={() => this.updateLegalDoc(l)}> Edit </span>
                              <span className="cursor-pointer legalDeleteImg" onClick={() => {this.deleteLegalDocuments(l)}}>
                                <img src="/icons/deleteIcon.svg" className="w-75 mb-2" alt="g4" />
                              </span> */}
                               <div className="d-flex justify-content-center gap-2">
                                            <div className=' d-flex flex-column align-items-center' onClick={() => this.updateLegalDoc(l)}>
                                                <img className="cursor-pointer mt-0" src="/icons/EditIcon.png" alt=" Mortgages" style={{ width: "20px"}}/>
                                                {/* <span className='fw-bold mt-1' style={{ color: "#720C20", cursor: "pointer"}}>Edit</span> */}
                                            </div>
                                            <div>
                                                <span  style={{borderLeft:"2px solid #e6e6e6", paddingLeft:"5px", height:"40px", marginTop:"5px"}} className="cursor-pointer mt-1" onClick={() => {this.deleteLegalDocuments(l)}}>
                                                    <img src="/icons/deleteIcon.svg" className="mt-0" alt="g4" style={{ width: "20px" }}/>
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
            </Form.Group>
            </Container>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({
      type: SET_LOADER,
      payload: loader,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LegalDoc);
