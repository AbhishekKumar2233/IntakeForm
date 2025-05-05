import React, { Component } from 'react'
import Select from 'react-select'
import { Button, Modal, Table,Card, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb} from "react-bootstrap";
import { $Service_Url } from './network/UrlPath';
import { $CommonServiceFn } from './network/Service';
import { SET_LOADER } from './Store/Actions/action';
import Router from "next/router";
import { connect } from 'react-redux';
import { Msg } from './control/Msg';
import konsole from './control/Konsole';
import { globalContext } from "../pages/_app";
import FiduciaryAssignmentForm from './FiduciaryAssignmentForm';
import Childdetails from './childdetails';
import AlertToaster from "./control/AlertToaster";

class FiduciaryAssignment extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      fiduciaryAssignmentSelectOptions: [],
      oldfiduciaryAssignmentSelectOptions:[],
      TrusteeSuccessor: [],
      AttorneyFinancesSuccessor: [],
      AttorneyHealthcareSuccessor: [],
      spouseUserId: "",
      otherfieldname:" ",
      databylegaldocid:null,
      userId: "",     
      sRankId: "",
      successorUserId: "",
      successorRelationId: "",
      isDocExecuted: "",
      docName: "",
      docPath: "",
      fiduAsgnmntTypeId:null,
      selecteduserLegalDocId:null,
      oldoneselecteduserLegalDocId:null,
      showEditChildpopup: false,
      EditProfieUserid: "",
      legalDocTypeId:null,
      showoldselect:false,
      legalfirstselect:null,
      selecteduserLegalDocIdfirst:null,
      finalarray:[],
      showoptions:false,
      hippaReleaseSaveButton:false,
      selectedLegalDocId:null,
      listOfSelectedHippaReleaseChecked:[]
    }; 
  }

 
  toasterAlert(text, type) {
    this.context.setdata({ open: true, text: text, type: type });
  }

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let spouseUserId = sessionStorage.getItem("spouseUserId") || "";
    this.setState({ userId: newuserid,spouseUserId: spouseUserId},)
  }
  handleShow = () => {
    this.setState({show: !this.state.show,});
    this.context.setPageTypeId(34)
    this.fetchPrimaryFid()
    // if(this.state?.spouseUserId!=="null"){this?.fetchSpouseFid()}
    this?.fetchSpouseFid()

  };

  funToGetListOfSelectedHippaReleaseChecked=(value)=>{
    // konsole.log("valueeee",value)
    const filterHippaFromList=value?.filter((item)=>{
      return item?.lDocTypeId==13
    })
    this.setState({listOfSelectedHippaReleaseChecked:filterHippaFromList})
  }

  fetchPrimaryFid = (userId) => {
    userId = userId || this.state.userId;
    const respose= $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFiduciaryAsgnmntData + userId, "", (response) => { 
       konsole.log("getfiddata", response?.data?.data?.fiduciaryAssignments);
        let checkFidDataList = response?.data?.data?.fiduciaryAssignments;
        let nulluserLegalDocId = checkFidDataList?.every((filterdata) => {
          return filterdata?.userLegalDocId == null;
        });
        let mixeduserLegalDocId = checkFidDataList?.some((filterdata) => {
          return filterdata?.userLegalDocId == null;
        });
        if(nulluserLegalDocId==false && mixeduserLegalDocId==false){
            this.getlegaldoctypelist(true,checkFidDataList); //number only
        }
        else{
            this.fetchFiduciaryAsgnmntType(checkFidDataList); // null or null and number mixeduserLegalDocId         
        }   
    });
  };
  
  fetchFiduciaryAsgnmntType = (checkFidDataList) => {
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFiduciaryAsgnmntType,
    "", (response) => {
      this.props.dispatchloader(true);
      if (response){
        this.props.dispatchloader(false);
        if(checkFidDataList.length>0){
          this.setState({...this.state,oldfiduciaryAssignmentSelectOptions: response?.data?.data,});
        }
        else{
          this.setState({oldfiduciaryAssignmentSelectOptions:[]});
          document.querySelector('#fidassigmentform').style.pointerEvents="none";
        }      
        this.getlegaldoctypelist(false,checkFidDataList);
      }     
    })
} 
 
  getlegaldoctypelist=(booleanTorF,checkFidDataList)=>{ 
      let userId = this.state.userId;
      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getLegalDocument + userId + "/0", "", (response) => {
      this.props.dispatchloader(true);
      if (response){
        const variablefiduciaryAssignmentSelectOptions = response?.data?.data?.legalDocuments;    
        // console.log("variablefiduciaryAssignmentSelectOptions",variablefiduciaryAssignmentSelectOptions)    
        this.exampleFunction(variablefiduciaryAssignmentSelectOptions,booleanTorF,checkFidDataList);       
      }
    });
  }


  exampleFunction = (options,booleanTorF,checkFidDataList) => {

        this.props.dispatchloader(false);

        let locat=options.filter((filtered)=>{
            return filtered.legalDocTypeId=="999999"
        })

        let checkForOtherButNot9=options.every((filtered)=>{
          return filtered.legalDocTypeId!=="999999" 
        })

        if(checkFidDataList.length>0 || options.length>0){

          this.setState({ showoptions:true})
          document.querySelector('#fidassigmentform').style.pointerEvents="auto";

        if(booleanTorF==false){
          if(checkForOtherButNot9==true && options?.length>0){
              this.setState({fiduciaryAssignmentSelectOptions: options, finalarray:[...options,...this.state.oldfiduciaryAssignmentSelectOptions],selecteduserLegalDocId:options[0]?.userLegalDocId,selectedLegalDocId:options?.[0]?.legalDocTypeId});  
              if(locat?.length>0){

                          let othersArrayData = [];
                          for (let j = 0; j < locat.length; j++) {
                            let jsonObj = {
                              userId: this.state.userId,
                              othersMapNatureId: locat[j].userLegalDocId,
                              isActive: true,
                              othersMapNature: ""
                            };

                            othersArrayData.push(jsonObj);
                          }

                          $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getOtherFromAPI, othersArrayData, (response, err) => {
                            this.props.dispatchloader(true);
                            if (response) {
                              let responsedata = response?.data?.data;
                              let othersName = responsedata[0]?.othersName || "Other";
                              let updatedOptions = [...options];
                              
                              for (let j = 0; j < locat.length; j++) {
                                let newlocat = locat[j];
                                newlocat.legalDocType = othersName;
                              }
                              
                              this.setState({
                                fiduciaryAssignmentSelectOptions: updatedOptions,
                                finalarray: [...updatedOptions, ...this.state.oldfiduciaryAssignmentSelectOptions],
                                selecteduserLegalDocId: updatedOptions[0]?.userLegalDocId
                              });
                              
                              this.props.dispatchloader(false);
                            }
                          });
       
              }
              else{
                this.setState({ fiduciaryAssignmentSelectOptions: updatedOptions, finalarray:[...options,...this.state.oldfiduciaryAssignmentSelectOptions],selecteduserLegalDocId:options?.[0]?.userLegalDocId,selectedLegalDocId:options[0]?.legalDocTypeId });                                                  
              }                                               
              }
           else{
                this.setState({fiduciaryAssignmentSelectOptions: options, finalarray:this.state.oldfiduciaryAssignmentSelectOptions,selecteduserLegalDocId:1});                                                        
              }      
            }
            else{
              if(locat.length==0){
                this.setState({ fiduciaryAssignmentSelectOptions: options, finalarray:options,selecteduserLegalDocId:options[0]?.userLegalDocId,selectedLegalDocId:options?.[0]?.legalDocTypeId });                                                    
              }
              else{

                let othersArrayData2 = [];
                for (let j = 0; j < locat.length; j++) {
                  let jsonObj = {
                    userId: this.state.userId,
                    othersMapNatureId: locat[j].userLegalDocId,
                    isActive: true,
                    othersMapNature: ""
                  };

                  othersArrayData2.push(jsonObj);
                }

                $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getOtherFromAPI, othersArrayData2, (response, err) => {
                  this.props.dispatchloader(true);
                  if (response) {
                    let responsedata = response?.data?.data;
                    let othersName = responsedata[0]?.othersName || "Other";
                    let updatedOptions = [...options];
                    
                    for (let j = 0; j < locat.length; j++) {
                      let newlocat = locat[j];
                      newlocat.legalDocType = othersName;
                    }
                      this.setState({ fiduciaryAssignmentSelectOptions: updatedOptions, finalarray:updatedOptions,selecteduserLegalDocId:updatedOptions?.[0]?.legalDocTypeId,selectedLegalDocId:updatedOptions?.[0]?.legalDocTypeId });  
                    
                    this.props.dispatchloader(false);
                  }
                });
          }  
      }
     
    }
    else{
      this.setState({ showoptions:false}) 
        konsole.log("data nai haii")
        document.querySelector('#fidassigmentform').style.pointerEvents="none";
        document.querySelector('#FidSelectOpt').focus()  
        }

  }


  
      fetchSpouseFid = (userId) => {
        userId = userId || this.state?.spouseUserId;
        $CommonServiceFn.InvokeCommonApi(
          "GET",
          $Service_Url.getFiduciaryAsgnmntData + userId,
          "",
          (response) => {
          this.props.dispatchloader(false);
            if (response) {
              konsole.log("responseresponse spouse",response?.data?.data);
            }
          }
        );
      };

      handleClose = () => {
        this.context.setPageTypeId(null)
        this.setState({show: !this.state.show});
      };

      handleDataReceived = (data) => {
        this.setState({showoldselect:data})
        return data  
      }
 
      handleEditChildPopupClose = () => {
        this.setState({showEditChildpopup: !this.state.showEditChildpopup});
        this.fetchFiduciaryList()
      }
      handleSaveDialog = (fetchFiduciaryList) => {
        this.fetchFiduciaryList = fetchFiduciaryList;
      }

      InvokeChildDetails = (userid, edittype) => {
        this.setState({
          showEditChildpopup: !this.state.showEditChildpopup,
          EditProfieUserid: userid + "|" + edittype,
        });
      };
      
      onSelectingDropdown=(e) =>
      {
        const selectedValue = e.target.value;
        konsole.log("selectedValue",selectedValue)
        const selectedOption = e.target.options[e.target.selectedIndex];                          
        const selectedData = JSON.parse(selectedOption.getAttribute('data-values'));
        // konsole.log("selectedOption",selectedData.value,selectedData.legalDocTypeId)
        if(selectedData.value==1 || selectedData.value==2 || selectedData.value==3){
          this.setState({ selecteduserLegalDocId: selectedData.value })
        }
        else{
          this.setState({ selecteduserLegalDocId: selectedData.userLegalDocId,selectedLegalDocId: selectedData.legalDocTypeId})
        }     
      }

      updateStateButtonStateForHippa = () => {
        this.setState({hippaReleaseSaveButton:false});
      }
    
  render() {
    let responsedata=this.state.fiduciaryAssignmentSelectOptions;
    let fiduciaryAssignmentSelectOptions = {};
    if (this.state.fiduAsgnmntTypeId !== "999999"){
      fiduciaryAssignmentSelectOptions = (this.state.fiduAsgnmntTypeId !== "") ? this.state.fiduciaryAssignmentSelectOptions[this.state.fiduAsgnmntTypeId - 1] : "";
    } 
    else{
      fiduciaryAssignmentSelectOptions = (this.state.agingAssetTypeId !== "") ? this.state.fiduciaryAssignmentSelectOptions[this.state.fiduciaryAssignmentSelectOptions.length - 1] : "";
    }
    // console.log("listOfSelectedHippaReleaseChecked",this.state.listOfSelectedHippaReleaseChecked)
    
    // console.log("ddsqerwasdasdz",this.state.selecteduserLegalDocId)
    return (
      <>
        {/* <style jsx global>{`
          
          .modal-open .modal-backdrop.show {
            opacity: 1;
          }
          .modal-dialog {
            max-width: 60.25rem;
            margin: 1.75rem auto;
          }
        `}</style> */}

        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            max-width: 52.25rem;
            margin: 1.75rem auto;
          }
        `}</style>

        <Card.Img variant="Top" className="" src="/icons/FIDUASSIGNMENT.svg" onClick={this.handleShow}  style={{width:"204px",height: "167px",}} />
        <Card.Body className="p-0 mt-2"  style={{width: "204px "}}>
          <a onClick={this.handleShow}>
            <div className="border  d-flex justify-content-between align-items-center p-2 p-2 ">
              <p className="ms-2">Fiduciary Assignment </p>
              <div className="border-start ">
                <img src="/icons/add-icon.svg" alt="Fiduciary Assigment" className='cursor-pointer px-2'/>
              </div>
            </div>
          </a>
        </Card.Body>

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          centered
          animation="false"
          id="fiduciaryAssignment"
          // className="w-100"
          backdrop="static"
          enforceFocus={false} 
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Fiduciary Assignment</Modal.Title>
          </Modal.Header>
          <Modal.Body className="" >
            <Container>
            <Row className='mb-3'>
              <Col md={9} lg={9} className='m-0 p-0'>
               <Col lg={9} className='w-100 p-0 m-0 mb-2' >
                        <select
                          id="FidSelectOpt"
                          className="form-select"
                          aria-label="Default select example"
                          onChange={(e) => {this.onSelectingDropdown(e)}}
                          >
                          {
                            (this.state.showoptions==true)?
                              <>                 
                                {
                                  this.state.finalarray.map((values, index) => {
                                    return (
                                    <option
                                      key={index}
                                      othersCategoryId={14}
                                      value={values.legalDocType}
                                      data-values={JSON.stringify(values)}
                                    >
                                      {values.legalDocType}{values.label}
                                    </option>
                                  )})}                                  
                               </>
                               :
                              <>
                                <option value="custom">No Legal Document Selected</option>
                              </> 
                          }
                        </select>
                      </Col>
              </Col>
              <Col  md={3} lg={3} className='m-0 p-0 d-flex justify-content-end'>
                <Button onClick={() =>this.InvokeChildDetails(this.state.userId,"Fiduciary/Beneficiary")} className="Add-more-fiduciary">
                  Add fiduciary
                </Button>
              </Col>
            </Row>
           
            
            {/* <Container> */}
            <Row className='mb-3'>
              <Col className='w-100 m-p p-0'>
                <p className="">
                  Please identify your choices of trusted individuals who will be your Personal Representative/Trustee/Agents.Your Personal Representative/Trustee/Agents will be identified in your legal documents.
                </p>
              </Col>
            </Row>

            <Row>
              <Col className='w-100 p-0 m-0'>
                <div id="fidassigmentform">
                  <FiduciaryAssignmentForm
                    key={this.state.selecteduserLegalDocId}
                    handleSaveData={this.handleSaveDialog}
                    hippaReleaseSaveButton={this.state?.hippaReleaseSaveButton}
                    selecteduserLegalDocId={this.state.selecteduserLegalDocId}
                    selectedLegalDocId={this.state?.selectedLegalDocId}
                    sendDataToParent={this.handleDataFromChild}
                    fiduAsgnmntTypeId={this.state.fiduAsgnmntTypeId}
                    close={this.handleClose}
                    legalDocTypeId={this.state.legalDocTypeId}
                    showoldselect={this.state.showoldselect}
                    passValueToOtherComponent={this.passValueToOtherComponent}
                    onDataReceived={this.handleDataReceived}
                    legalfirstselect={this.state.legalfirstselect}
                    getlegaldoctypelist={this.getlegaldoctypelist}
                    updateStateButtonStateForHippa={this.updateStateButtonStateForHippa}
                    funToGetListOfSelectedHippaReleaseChecked={this.funToGetListOfSelectedHippaReleaseChecked}
                  />
                </div>  
              </Col>
            </Row>
             
            {/* </Container> */}
            </Container>
          </Modal.Body>
          <Modal.Footer className="border-0">          
           {(this.state?.selectedLegalDocId == 13) && <Button className="theme-btn" onClick={()=>{this.setState({hippaReleaseSaveButton:true})}} style={{marginRight:"9px"}}>{(this.state?.listOfSelectedHippaReleaseChecked && this.state?.listOfSelectedHippaReleaseChecked?.length>0)?"Update":"Save"} </Button>} 
            <Button className="theme-btn" onClick={this.handleClose} style={{marginRight:"9px"}}> Close</Button>
          </Modal.Footer>
        </Modal>     
        {this.state.showEditChildpopup && (
            <Childdetails
              handleEditPopupClose={this.handleEditChildPopupClose}
              show={this.state.showEditChildpopup}
              UserID={this.state.EditProfieUserid}
              refrencePage='Fiduciary/Assignment'
              name={"Edit Profile"}
            />
          )}
          
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FiduciaryAssignment);