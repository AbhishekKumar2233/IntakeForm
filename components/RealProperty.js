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
import Select from "react-select";
import DatePicker from "react-datepicker";

import { connect } from 'react-redux';

import { SET_LOADER } from '../components/Store/Actions/action'
import { $Service_Url } from "../components/network/UrlPath";
import { $CommonServiceFn } from '../components/network/Service';
import Address, { address } from "./address";
import { $AHelper } from "./control/AHelper";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import moment from "moment";
import Other from "./asssets/Other";
import CurrencyInput from "react-currency-input-field";
import {globalContext} from "../pages/_app"
import DatepickerComponent from "./DatepickerComponent";
import { isNotValidNullUndefile } from "./Reusable/ReusableCom";

export class RealProperty extends Component {
  static contextType = globalContext
  constructor(props, context) {
    super(props, context);
    this.state = {
      realstateaddress:false,
      userId: "",
      PreConditionTypes: [],
      UserAgingAssests: [],
      allAddressFetch: [],
      OwnerTypes: [],
      showAddress: false,
      addressLabel: "Address",
      addressTypeId: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      agingAssetCatId: "3",
      agingAssetTypeId: "",
      ownerTypeId: "",
      nameOfInstitution: "",
      balance: "",
      loggeduserId: "",
      addressId: "",
      purchasePrice: "",
      purchaseDate: "",
      value: "",
      ownerUserName: "",
      getIndexTable: "",
      getAddressData: "",
      getdata: [],
      isDebtAgainstProperty: true,
      userAgingAssetId: "",
      userRealPropertyId: "",
      EditAddres: "",
      addTrue: false
    };

    this.realPropertyRef = React.createRef();
    this.ownerRef = React.createRef();
  }
  handleshowAddress = () => {
    this.setState({
      showAddress: !this.state.showAddress
    })

  }
  handleInputChange = (event) => {
    event.preventDefault();
    let attrname = event.target.name;
    let attrvalue = event.target.value;

    this.setState({
      ...this.state,
      [attrname]: attrvalue
    })
  }

  getResponseAddressId = (addressData) => {
    this.setState({
      addressId: addressData.addressId,
      addressLabel: addressData.addressLine1 + " " + addressData.addressLine2 + " " + addressData.addressLine3 + " " + addressData.city + " " + addressData.state + " " + addressData.country
    })
  }

  componentDidMount() {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let loggeduserId = sessionStorage.getItem("loggedUserId")
    let primaryUserId = sessionStorage.getItem("SessPrimaryUserId");
    this.setState({
      userId: newuserid,
      loggeduserId: loggeduserId,

    })
    this.fetpreconditontypes();
    this.fetuseragingassets(newuserid);
    this.fetchownertypes(newuserid);
  }



  fetchownertypes = (userId) => {

    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getFileBelongsToPath +
      `?ClientUserId=${userId}`,
      "",
      (response, err) => {
        this.props.dispatchloader(false);
        if (response) {
          const responseMap = response.data.data.map(item => {
            return {
              value: item.fileBelongsTo,
              label: (item.fileBelongsTo == "JOINT") ? "Joint" : item.belongsToMemberName
            }
          })
          this.setState({
            ...this.state,
            OwnerTypes: responseMap,
          });
        } else err;
      }
    );
  }
  fetpreconditontypes = () => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getPreconditionType + "3",
      "", (response) => {
        if (response) {
          this.props.dispatchloader(false);
          this.setState({
            ...this.state,
            PreConditionTypes: response.data.data,
          });
        }
      })
  }

  // sumit


  updateRealEstate = (asset) => {
    konsole.log("sadasd", asset);
    this.setState({
      getIndexTable: "1",
      ownerTypeId: (asset.assetOwners.length == 2) ? "Joint" : (asset.assetOwners.length == 1) ? asset.assetOwners[0].ownerUserId : "" ,
      assetOwners: asset.assetOwners,
      agingAssetTypeId: asset.agingAssetTypeId,
      addressLabel: asset.isRealPropertys[0]?.address?.addressLine1,
      purchasePrice: asset.isRealPropertys[0]?.purchasePrice,
      value: asset.isRealPropertys[0]?.value,
      purchaseDate: asset.isRealPropertys[0]?.purchaseDate !== null ? new Date(asset.isRealPropertys[0]?.purchaseDate) : null,
      addressId: asset.isRealPropertys[0]?.address?.addressId,
      EditAddres: asset.isRealPropertys[0]?.address,
      addressTypeId: asset.isRealPropertys[0]?.address?.addressTypeId,
      city: asset.isRealPropertys[0]?.address?.city,
      state: asset.isRealPropertys[0]?.address?.state,
      zipcode: asset.isRealPropertys[0]?.address?.zipcode,
      country: asset.isRealPropertys[0]?.address?.country,
      userAgingAssetId: asset.userAgingAssetId,
      userRealPropertyId: asset.isRealPropertys[0]?.userRealPropertyId,
      addTrue: true
    });
  };


  RealEstateUpdate = () => {
    let inputdata = JSON.parse(JSON.stringify(this.state));
    let purchaseDate;
    if(inputdata.purchaseDate !=="" && inputdata.purchaseDate !== null && inputdata.purchaseDate !== undefined){
      purchaseDate = $AHelper.getFormattedDate(inputdata.purchaseDate)
    }else{
      purchaseDate=inputdata.purchaseDate
    }

    let isRealPropertys = []
    isRealPropertys.push(
      {
        "addressId": inputdata.addressId,
        "purchasePrice": inputdata.purchasePrice,
        "purchaseDate": purchaseDate,
        "value": inputdata.value,
        "isDebtAgainstProperty": inputdata.isDebtAgainstProperty,
        "userRealPropertyId": this.state.userRealPropertyId
      })


    let assetOwners = [];
    if (this.state.ownerTypeId !== "JOINT") {
      assetOwners = [{ ownerUserId: this.state.ownerTypeId }]
    } else {
      const assetOwn = this.state.OwnerTypes.filter((item) => item.value !== "JOINT");

      assetOwners = assetOwn.map((item) => {
        return { ownerUserId: item.value }
      });
    }

    let totalinuptdata = {
      userId: this.state.userId,
      asset: {
        agingAssetCatId: inputdata.agingAssetCatId,
        agingAssetTypeId: inputdata.agingAssetTypeId,
        ownerTypeId: 1, //need to remove here,
        nameOfInstitution: inputdata.nameOfInstitution,
        balance: inputdata.balance || 0,

        maturityYear: 0,
        userAgingAssetId: this.state.userAgingAssetId,
        updatedBy: this.state.userId,
        isActive: true,
        assetDocuments: [],
        assetOwners: this.state.assetOwners,
        assetBeneficiarys: [],
        isRealPropertys: isRealPropertys
      }
    }

    if (this.validate()) {
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUpdateUserAgingAsset, // + "?userId=" + this.state.userId
        totalinuptdata, (response) => {
          this.props.dispatchloader(false);
          // konsole.log("Success res at Property" + JSON.stringify(response));
          if (response) {
            // alert("Update Successfully");
            this.toasterAlert("Update Successfully","Success")
            let assetResponse = response.data.data;
            if (this.state.agingAssetTypeId == "999999") {
              this.realPropertyRef.current.saveHandleOther(assetResponse.userAgingAssetId)
            }
            if (this.state.ownerTypeId == "999999") {
              this.ownerRef.current.saveHandleOther(assetResponse.userAgingAssetId)
            }
            this.props.handlerealproppopShow();
          } else {
            // alert("Error",Msg.ErrorMsg);
            konsole.log("Err")
          }
        })
    }
  }


  // sumit


  fetuseragingassets = (userid) => {
    userid = userid || this.state.userId;
    let address = []
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserAgingAsset + userid,
      "", (response) => {
        if (response) {
          konsole.log("realstates", response.data.data);
          let array = response.data.data.filter((v, j) => v.agingAssetCatId == "3");

          for (let i = 0; i < response.data.data.filter((v, j) => v.agingAssetCatId == "3").length; i++) {
            // konsole.log("dddddDDRESSId", response.data.data.filter((v, j) => v.agingAssetCatId == "3"))
            address.push(array[i].isRealPropertys[0].addressId);

            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAddressByaddressID + address[i],
              "", (response) => {
                if (response) {
                  konsole.log("sumitkumar", response.data.data)
                  this.props.dispatchloader(false);

                  array[i].isRealPropertys[0].address = response.data.data;
                  this.setState({
                    ...this.state,
                    UserAgingAssests: array,

                  });

                }
                else {
                  this.setState({
                    ...this.state,
                    UserAgingAssests: array,

                  });
                }
              })
          }
         
          this.props.dispatchloader(false);
        }
      })
  }


  fetchSavedAddress = (userId) => {
  if(!isNotValidNullUndefile(userId))return;
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAllAddress + userId,
      "", (response) => {
        this.props.dispatchloader(false);
        // konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          // update a state here
          // debugger
          const addressResponseForUser = response.data.data.addresses;
          if(addressResponseForUser.length > 0){
            // debugger
            const primaryAddress = addressResponseForUser.filter((item) => item.addressTypeId == 1) ?? [];
            if(primaryAddress.length > 0){
              // debugger
              this.getResponseAddressId(primaryAddress[0]);
            }
          }
        }
      })
  }

  validate = () => {

    let nameError = "";

    // if (this.state.purchaseDate == "") {
    //   nameError = "Please enter the purchase date";
    // }
    // if(this.state.purchasePrice == ""){
    //   nameError = "Please enter the purchase price";
    // }
    if (this.state.agingAssetTypeId == "") {
      nameError = "Description of Property cannot be blank";
    }if(this.state.ownerTypeId==""){
      nameError="Owner type cannot be blank"
    }
    // if (this.state.value == "") {
    //   nameError = "Today's Value cannot be blank";
    // }
    // if (this.state.addressId == "") {
    //   nameError = "Please enter address here";
    // }
    if (nameError) {
      // alert(nameError);
      this.toasterAlert(nameError,"Warning")
      return false;
    }
    return true;
  }


  handleAgingassetsubmit = () => {
    let inputdata = JSON.parse(JSON.stringify(this.state));

    let purchaseDate;
    if(inputdata.purchaseDate !=="" && inputdata.purchaseDate !== null && inputdata.purchaseDate !== undefined){
      purchaseDate = $AHelper.getFormattedDate(inputdata.purchaseDate)
    }else{
      purchaseDate=inputdata.purchaseDate
    }

    // konsole.log("purchasedatpurchasedat",purchaseDate)
    let isRealPropertys = []
    isRealPropertys.push(
      {
        "addressId": inputdata.addressId,
        "purchasePrice": inputdata.purchasePrice,
        "purchaseDate": purchaseDate,
        "value": inputdata.value,
        "isDebtAgainstProperty": inputdata.isDebtAgainstProperty

      })


    let assetOwners = [];
    if (this.state.ownerTypeId !== "JOINT") {
      assetOwners = [{ ownerUserId: this.state.ownerTypeId }]
    } else {
      const assetOwn = this.state.OwnerTypes.filter((item) => item.value !== "JOINT");

      assetOwners = assetOwn.map((item) => {
        return { ownerUserId: item.value }
      });
    }

    let totalinuptdata = {
      userId: this.state.userId,
      asset: {
        agingAssetCatId: inputdata.agingAssetCatId,
        agingAssetTypeId: inputdata.agingAssetTypeId,
        ownerTypeId: 1,//REMOVE LATER
        nameOfInstitution: inputdata.nameOfInstitution,
        balance: inputdata.balance || 0,
        createdBy: this.state.loggeduserId,
        assetDocuments: [],
        assetOwners: assetOwners,
        assetBeneficiarys: [],
        isRealPropertys: isRealPropertys
      }
    }

    konsole.log("Success res at RealProperty", totalinuptdata)

    if (this.validate()) {
      this.props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postUseragingAsset, // + "?userId=" + this.state.userId
        totalinuptdata, (response) => {
          this.props.dispatchloader(false);
          konsole.log("Success res at RealProperty" + JSON.stringify(response));
          if (response) {

            // alert("Saved Successfully");
            this.toasterAlert("Saved Successfully","Success")
            let assetResponse = response.data.data;

            if (this.state.agingAssetTypeId == "999999") {
              this.realPropertyRef.current.saveHandleOther(assetResponse.userAgingAssetId)
            }
            if (this.state.ownerTypeId == "999999") {
              this.ownerRef.current.saveHandleOther(assetResponse.userAgingAssetId)
            }
            this.props.handlerealproppopShow();
          } else {
            // alert("sdasdasdasdas", Msg.ErrorMsg);
            this.toasterAlert( Msg.ErrorMsg,"Warning")
          }
        })
    }    
}

  handleAsesstTypeOptions = (event) => {
    this.setState({
      agingAssetTypeId: event.value
    })
    if(event.value == "20"){
      this.fetchSavedAddress(this.state.userId);
    }
    else{
      this.setState({
        addressId: "",
        addressLabel: "Address"
      })
    }
  }




  InvokeEditAddress = () => {

    this.setState({
      EditAddress: this.state.EditAddres,
      realstateaddress:true
    })
    this.handleshowAddress();
  }
  toasterAlert(test,type) {
    this.context.setdata($AHelper.toasterValueFucntion(true,test,type))
  }
  render() {
    
    konsole.log("ownerTYejkhtkerh", this.state.ownerTypeId, typeof (this.state.ownerTypeId));
    let agingAssetType = {};
    let ownerTypeId = (this.state.ownerTypeId !== undefined && this.state.ownerTypeId !== "" && this.state.ownerTypeId !== null) ? this.state.OwnerTypes?.filter((item) => item.value?.toLowerCase() === this.state.ownerTypeId?.toLowerCase()) : "";

    konsole.log("ewrqeqer", this.state);

    if (parseInt(this.state.agingAssetTypeId) !== 999999) {
      agingAssetType = (this.state.agingAssetTypeId !== "") ? this.state.PreConditionTypes[this.state.agingAssetTypeId - 20] : "";
    } else {
      agingAssetType = (this.state.agingAssetTypeId !== "") ? this.state.PreConditionTypes.filter((pre) => { return parseInt(pre.value) == this.state.agingAssetTypeId }) : "";
    }
    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0;
          }
        `}</style>


        <Modal
          show={this.props.show}
          size="lg"
          centered
          onHide={this.props.handlerealproppopShow}
          animation="false"
          backdrop="static"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Real Estate</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-5 pt-4">
            <div className="person-content">
              <Form.Group as={Row} className="mb-3">
                <Col xs sm="6" lg="5">
                  <Select
                    className="w-100 p-0 custom-select"

                    options={this.state.PreConditionTypes}
                    placeholder={$AHelper.mandatory("Description of Property")}
                    onChange={(event) => {this.handleAsesstTypeOptions(event)}}
                    value={agingAssetType}
                    isSearchable
                  />
                </Col>
                {
                  this.state.agingAssetTypeId == "999999" &&
                  <Col xs sm="6" lg="5" className="mb-3">
                      <Other othersCategoryId={3} userId={this.state.userId} dropValue={this.state.agingAssetTypeId} ref={this.realPropertyRef} natureId={this.state.userAgingAssetId} />
                  </Col>
                }
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Col xs sm="6" lg="10">
                  {/* <Form.Control
                    type="text"
                    value={this.state.addressId} onChange={this.handleInputChange} name="addressId"
                    placeholder="Address"
                  /> */}
                  <button className="white-btn form-control" onClick={() => this.InvokeEditAddress("")}>{this.state.addressLabel}</button>
                  <Address
                    userid={this.state.userId}
                    showAddress={this.state.showAddress}
                    handleshowAddress={this.handleshowAddress}
                    getResponseAddressId={this.getResponseAddressId}
                    updateAddressData={this.state.addressLabel}
                    addressTypeId={this.state.addressTypeId}
                    city={this.state.city}
                    country={this.state.country}
                    zipcode={this.state.zipcode}
                    state={this.state.state}
                    addressId={this.state.addressId}
                    EditAddress={this.state.EditAddress}
                    realstateaddress={this.state.realstateaddress}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Col xs sm="6" lg="5">
                  <CurrencyInput prefix='$' value={this.state.purchasePrice} allowNegativeValue={false} className='border' onValueChange={(purchasePrice) => this.setState({ purchasePrice: purchasePrice })} name="purchasePrice" placeholder="Purchase Price" decimalScale="2" />
                </Col>
                <Col xs sm="6" lg="5">
                  <DatepickerComponent name="purchaseDate" value={this.state.purchaseDate} setValue={(value) => this.setState({ purchaseDate: value })} placeholderText="Purchase Date" maxDate={0} minDate="100" />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Col xs sm="6" lg="5">
                  <Select className="w-100 p-0 custom-select"
                    onChange={(event) => this.setState({ ownerTypeId: event.value })}
                    options={this.state.OwnerTypes} value={ownerTypeId} isSearchable placeholder=
                    {$AHelper.mandatory("Owner")} />
                </Col>
                <Col xs sm="6" lg="5">
                  <CurrencyInput prefix='$'
                    value={this.state.value} allowNegativeValue={false} className='border' onValueChange={(value) => this.setState({ value: value })} name="value" placeholder="Today's value" decimalScale="2"/>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Col xs sm="6" lg="5">
                  <Other othersCategoryId={21} userId={this.state.userId} dropValue={this.state.ownerTypeId} ref={this.ownerRef} natureId={this.state.userAgingAssetId} />
                </Col>
              </Form.Group>
              <Row className="mt-4">
                <p>Debt against the Property</p>
              </Row>
              <Row className="">
                <Col lg={5} className="border py-4 ms-2 ">
                  <Form.Group as={Row} className="mb-2">
                    <Col>
                      <Form.Check
                        className="left-radio"
                        label="Mortgage"
                        type="checkbox"
                        id="checkbox1"
                        name="Mortgage"
                      />
                    </Col>
                    <Col>
                      <Form.Control type="text" />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-2">
                    <Col>
                      <Form.Check
                        className="left-radio"
                        label="2nd Mortgage"
                        type="checkbox"
                        id="checkbox1"
                        name="2nd Mortgage"
                      />
                    </Col>
                    <Col>
                      <Form.Control type="text" />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-2">
                    <Col>
                      <Form.Check
                        className="left-radio"
                        label="Line of Credit"
                        type="checkbox"
                        id="checkbox1"
                        name="loc"
                      />
                    </Col>
                    <Col>
                      <Form.Control type="text" />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-2">
                    <Col>
                      <Form.Check
                        className="left-radio"
                        label="Other"
                        type="checkbox"
                        id="checkbox1"
                        name="other"
                      />
                    </Col>
                    <Col>
                      <Form.Control type="text" />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            {this.state.getIndexTable == "1" ?
              <div>
                <Button className="theme-btn" onClick={this.RealEstateUpdate}>
                  Update
                </Button>
              </div>
              :
              <Button className="theme-btn" onClick={this.handleAgingassetsubmit}>
                Save
              </Button>
            }

            {
              this.state.UserAgingAssests.length !== 0 &&
              <Table bordered style={{ overflowY: "scroll" }}>
                <thead className="text-center align-middle">
                  <tr>
                    <td>Description of Property</td>
                    <td>Address</td>
                    <td>Purchase Date</td>
                    <td>Purchase Price</td>
                    <td>Today's Value</td>
                    <td>Owner</td>
                    <td>Debt against the property</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.UserAgingAssests.length > 0 && this.state.UserAgingAssests.map((asset, i) => {
                      let AddressData = asset.isRealPropertys[0]?.address
                      return (
                        <tr key={i} >
                          <td>{asset.assetTypeName}</td>
                          <td>{asset.isRealPropertys[0]?.address?.addressLine1}</td>
                          <td>{asset.isRealPropertys[0]?.purchaseDate == null ? " " : $AHelper.getFormattedDate(asset.isRealPropertys[0]?.purchaseDate) || "-"}</td>
                          <td>{asset && asset.isRealPropertys != undefined ? $AHelper.IncludeDollars(asset.isRealPropertys[0]?.purchasePrice) : "-"}</td>
                          <td>{asset && asset.isRealPropertys != undefined ? $AHelper.IncludeDollars(asset.isRealPropertys[0]?.value) : "-"}</td>
                          <td>{(asset.assetOwners.length == 2) ? "Joint" : (asset.assetOwners.length == 1) ? asset.assetOwners[0].ownerUserName : "-"}</td>
                          <td>{asset.isRealPropertys[0].isDebtAgainstProperty == true ? "True" : "False"}</td>
                          <td><p style={{textDecoration:"underline", cursor:"pointer"}}onClick={() => this.updateRealEstate(asset)}>Edit</p></td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </Table>
            }
          </Modal.Footer>
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

export default connect(mapStateToProps, mapDispatchToProps)(RealProperty);