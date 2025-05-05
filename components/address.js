import React, { Component, useContext } from "react";
import { createPortal } from "react-dom";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, ToastContainer,} from "react-bootstrap";
import Select from "react-select";
import konsole from "./control/Konsole";
import { $getServiceFn, $CommonServiceFn, $postServiceFn,} from "./network/Service";
import { GET_Auth_TOKEN, GET_USER_DETAILS, SET_LOADER,} from "../components/Store/Actions/action";
import { $Service_Url } from "../components/network/UrlPath";
import { Msg } from "./control/Msg";
import { natureId, onlyAlpbet, regexForSpecialCharacter,} from "./control/Constant";
import { $AHelper, initMapScript } from "./control/AHelper";
import Other from "./asssets/Other";
import { connect } from "react-redux";
import TosterComponent from "./TosterComponent";
import { Portal } from "./Portal";
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";
import { isNotValidNullUndefile } from "./Reusable/ReusableCom";

export class address extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      addresstype: [],
      countryList: [],
      stateList: [],
      counter: 0,
      disabledField: false,
      userId: this.props.userid,
      loggedUserId: sessionStorage.getItem("loggedUserId"),
      lattitude: "",
      longitude: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      zipcode: "",
      country: "",
      city: "",
      state: "",
      othersId: "",
      addressId: "",
      addressTypeId: -1,
      activityTypeId: 3,
      county: "",
      countyRef: [],
      countyRefId: null,
      addresstypeOther: "",
      disabledField: true,
      showClearButton: false,
      natureId: "",
      primaryUserId: "",
      loginUserDetail: {},
      allAddress: [],
      is_checked: false,
      streetAddress: "",
    };
    this.searchInput = React.createRef();
    this.addressRef = React.createRef();
  }

  componentDidMount() {
    let newuserid = this.props.userid || "";
    let loggedUserId = sessionStorage.getItem("loggedUserId");
    let loginUserDetail = sessionStorage.getItem("userDetailOfPrimary");
    let primaryUserId = sessionStorage.getItem("SessPrimaryUserId");

    this.setState({
      userId: newuserid,
      loggedUserId: loggedUserId,
      primaryUserId: primaryUserId,
      loginUserDetail: JSON.parse(loginUserDetail),
    });
    this.fetchCountyRefs();
    this.fetchAddressType();
    let EditAddress = this.props.EditAddress || "";
    this.populateAddress(EditAddress);
    // this.fetchmemberbyID(this.state.primaryUserId);
    this.fetchAllAddress(primaryUserId);
  }

  componentDidUpdate(prevProps, prevState) {
    const EditAddress = this.props.EditAddress;

    if (prevProps.userid !== this.props.userid) {
      this.setState({
        userId: this.props.userid,
      });
    }
    if (prevProps.EditAddress !== this.props.EditAddress) {
      this.populateAddress(EditAddress);
    }
    if (prevProps.EditAddress !== this.props.EditAddress) {
      this.populateAddress(EditAddress);
    }
  }

  populateAddress = (EditAddress) => {
    konsole.log("physical address", EditAddress);
    konsole.log("physical address1111", EditAddress,this.props.savedAddress);
    // const editAddressType = this.props.savedAddress.filter(item => item.addressTypeId == EditAddress?.addressTypeId)
    // konsole.log("editAddressType",editAddressType,this.props.savedAddress,editAddressType[0]?.addressTypeId)
    // this.state.addressTypeId = editAddressType[0]?.addressTypeId

    if (EditAddress) {
      this.setState({
        addressLine1: EditAddress ? EditAddress.addressLine1 : "",
        addressLine2: EditAddress ? EditAddress.addressLine2 : "",
        addressLine3: "",
        // streetAddress: EditAddress  ? EditAddress?.addressLine1?.substring(  0,  EditAddress.addressLine1.indexOf(",")): "",
        streetAddress: EditAddress  ? EditAddress?.addressLine1 : "",
        zipcode: EditAddress ? EditAddress.zipcode : "",
        country: EditAddress ? EditAddress.country : "",
        city: EditAddress ? EditAddress.city : "",
        county: EditAddress ? EditAddress.county : "",
        countyRefId: EditAddress ? EditAddress.countyRefId : null,
        state: EditAddress ? EditAddress.state : "",
        addressTypeId: EditAddress ? EditAddress.addressTypeId : "",
        // addressTypeId: editAddressType.length > 0 ? editAddressType[0]?.addressTypeId : "",
        showClearButton: true,
        natureId: EditAddress ? EditAddress.addressId : "",
      });
    }
    konsole.log("editAddress", EditAddress, this.state);
  };

  fetchCountyRefs = () => {
    $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getCountyRef, "", (res, err) => {
        if (res?.data?.data?.length > 0) {
          konsole.log("resres", res);
          this.setState({countyRef: res.data.data});
        } else {
          this.setState({countyRef: []});
        }
      }
    );
  }

  fetchAllAddress = (userId) => {
    if(!isNotValidNullUndefile(userId))return;
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getAllAddress + userId, "", (response) => {
        konsole.log("responseaddress", response);
        this.props.dispatchloader(false);
        // konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          let addressResponse = response.data.data;
          this.setState({
            ...this.state,
            allAddress: response.data.data.addresses,
          });
          if (this.props.EditAddress !== "") {
            let physicalAddress = addressResponse.filter(
              (val) => val.addressTypeId == 1
            )[0];
            konsole.log("populate", physicalAddress);
            konsole.log("editaddress", this.props.EditAddress);
            if (
              this.props.EditAddress.addressLine1 ==
              physicalAddress.addressLine1
            ) {
              this.setState({
                ...this.state,
                is_checked: true,
              });
            }
          }
        }
      }
    );
  };

  handleChecked = () => {
    if (this.state.is_checked == true) {
      this.resetState();
    }
  };

  handleCheckBox = () => {
    let physicalAddress = this.state.allAddress.filter(
      (val) => val.addressTypeId == 1
    )[0];
    konsole.log(physicalAddress);

    this.setState({ is_checked: !this.state.is_checked });
    this.populateAddress(physicalAddress);

    if (this.state.is_checked == true) {
      this.resetState();
    }
  };

  extractAddress = (place) => {
    konsole.log("place1121",place)
    const address = {
      city: "",
      state: "",
      zip: "",
      county: "",
      country: "",
      plain() {
        const city = this.city ? this.city + ", " : "";
        const zip = this.zip ? this.zip + ", " : "";
        const county = this.county ? this.county + "," : "";
        const state = this.state ? this.state + ", " : "";
        return city + zip + state + this.country;
      },
    };

    if (!Array.isArray(place?.address_components)) {
      return address;
    }
    let postalCodeSuffix = "";
    let unWanted = ['USA', 'UK'];
    place.address_components.forEach((component) => {
      const types = component.types;
      const value = component.long_name;
      if (types.includes("locality")) {
        address.city = value;
        unWanted.push(component.long_name, component.short_name);
      }
      if (types.includes("administrative_area_level_1")) {
        address.state = value;
        unWanted.push(component.long_name, component.short_name);
      }
      if (types.includes("administrative_area_level_2")) {
        if(value.includes("County") || value.includes("county")){
          let removedCountyFromValue=value.replace(/County|county/g,"")
          address.county = removedCountyFromValue;
        }
        else{address.county = value;}
        unWanted.push(component.long_name, component.short_name);
      }
      if (types.includes("postal_code")) {
        address.zip = value;
        unWanted.push(component.long_name, component.short_name);
      }
      if (types.includes("country")) {
        address.country = value;
        unWanted.push(component.long_name, component.short_name);
      }
      if (types.includes("county")) {
        address.country = value;
        unWanted.push(component.long_name, component.short_name);
      }
      if(types?.includes("postal_code_suffix")) {
        postalCodeSuffix = value;
        unWanted.push(component.long_name, component.short_name);
      }
    });
    
    if(postalCodeSuffix) address.zip += '-' + postalCodeSuffix;
    unWanted.push(address.zip);

    address.unWanted = unWanted;
    return address;
  };

  // do something on address change
  onChangeAddress = (autocomplete) => {
    // debugger
    const place = autocomplete.getPlace();
    const lat = place?.geometry?.location?.lat();
    const long = place?.geometry?.location?.lng();
    this.setState({
      longitude: long,
      lattitude: lat,
    });
    this.setAddress(this.extractAddress(place));
  };
  setAddress = (address) => {
    address = this.formateAddressLine1(address);
    this.setState({
      //...this.state,
      city: address.city,
      county: address.county,
      state: address.state,
      zipcode: address.zip,
      country: address.country,
      // addressLine2: "",
      // countyRefId: null,
    });
    this.setState({
      // streetAddress: this.searchInput?.current?.value.substring(
      //   0,
      //   this.searchInput?.current?.value.indexOf(",")
      // ),
      streetAddress: this.searchInput?.current?.value
    });
  };
  formateAddressLine1 = (address) => {
    if(!address || !this.searchInput?.current?.value || !address.unWanted?.length) return address;

    const curAddressLine1 = this.searchInput?.current?.value;
    const firstCommaIndex = curAddressLine1.indexOf(',');
    if(firstCommaIndex == -1) {
      address.unWanted = undefined;
      return address;
    }

    konsole.log("address.unWanted", address.unWanted)

    let secondPartString = " " + curAddressLine1?.slice(firstCommaIndex) + " ";

    for(let i = 0; i < address.unWanted.length; i++) {
      const searchWord = new RegExp(`( |,)(${address.unWanted[i]})( |,)`, "g");
      secondPartString = secondPartString?.replace(searchWord, " ");
      // konsole.log('curAddressLine1\n' , "1st part:", curAddressLine1.slice(0, firstCommaIndex), "\nsecond part:", secondPartString, "\nregex:", searchWord);
    }

    let finalSecondPart = "";
    let lastChar = "";
    for(let i = 0; i < secondPartString.length; i++) {
      const curChar = secondPartString[i];
      if(curChar == " " || curChar == ",") {
        if(finalSecondPart.length == 0) continue;
        if(lastChar != " " && (lastChar != "," || curChar == " ")) finalSecondPart += curChar;
      } else {
        finalSecondPart += curChar;
      }
      // konsole.log("adbvh", finalSecondPart , "lastChar:(", lastChar, ")curChar:(", curChar, ")");
      lastChar = curChar;
    }

    if(finalSecondPart.length) {
      const lastIndexOfCom = finalSecondPart.lastIndexOf(",");
      if(finalSecondPart.length - lastIndexOfCom <= 2) finalSecondPart = finalSecondPart.slice(0, lastIndexOfCom);
      this.searchInput.current.value = curAddressLine1.slice(0, firstCommaIndex) + ", " + finalSecondPart;
    }
    else this.searchInput.current.value = curAddressLine1.slice(0, firstCommaIndex);
 
    address.unWanted = undefined;
    return address;
  }
  initAutoComplete = () => {
    if (!this.searchInput.current) return;
    const autocomplete = new window.google.maps.places.Autocomplete(
      this.searchInput.current
    );
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.addListener("place_changed", () =>
      this.onChangeAddress(autocomplete)
    );
  };

  fetchAddressType = () => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getAddressTypePath,
      this.state,
      (response) => {
        // konsole.log("Success res" + JSON.stringify(response));
        if (response) {
          this.setState({
            ...this.state,
            addresstype: response.data.data,
          });
          // konsole.log("addressType response", response.data.data);
        }
      }
    );
  };

  chooseCountry = (event) => {
    const countryId = event.value;
    this.setState({ country: countryId });
    this.fetchStateList(countryId);
  };

  handleAddressSubmit = () => {
    if (this.validateAddress(this.state) && this.checkAddressExist()) {
      this.setState({ counter: this.state.counter + 1 });

      if (this.state.counter == 0) {
        let inputdata = JSON.parse(JSON.stringify(this.state));
        delete inputdata["addresstype"];
        delete inputdata["countryList"];
        delete inputdata["stateList"];
        delete inputdata["show"];
        delete inputdata["allAddress"];
        delete inputdata["loginUserDetail"];
        delete inputdata["countyRef"];

        // inputdata["addressLine1"] = this.searchInput.current.value;
        inputdata["addressLine1"] = this.state.streetAddress;
        let EditAddressId = this.props.EditAddress
          ? this.props.EditAddress.addressId
          : "";

        if (EditAddressId != null && EditAddressId != "") {
          inputdata["addressId"] = EditAddressId;
          inputdata["updatedBy"] = this.state.loggedUserId;
        } else {
          inputdata["createdBy"] = this.state.loggedUserId;
          inputdata["addressLine2"] = this.state.addressLine2;
          inputdata["lattitude"] = this.state.lattitude;
          inputdata["longitude"] = this.state.longitude;
        }

        if (this.props.realstateaddress == true) {
          let josnobjdata = {
            lattitude: inputdata.lattitude,
            longitude: inputdata.longitude,
            addressLine1: inputdata.addressLine1,
            addressLine2: inputdata.addressLine2,
            addressLine3: inputdata.addressLine3,
            zipcode: inputdata.zipcode,
            county: inputdata.county,
            countyRefId: inputdata.countyRefId,
            city: inputdata.city,
            state: inputdata.state,
            country: inputdata.country,
            addressTypeId: inputdata.addressTypeId,
            createdBy: inputdata.createdBy,
          };
          if (EditAddressId != null && EditAddressId != "") {
            josnobjdata["addressId"] = EditAddressId;
            josnobjdata["updatedBy"] = this.state.loggedUserId;
            josnobjdata["isActive"] = true;
          } else {
            josnobjdata["createdBy"] = this.state.loggedUserId;
          }

          this.realstatefun(josnobjdata, EditAddressId);
        } 
        else {
          let postData = {
            userId: this.state.userId,
            address: inputdata,
          };
          this.withoutrealstatefun(postData, EditAddressId);
        }
      } else {
        //("counter  grester than 0")
      }
    } else {
      //(this.state.counter)
      this.setState({ counter: 0 });
    }
  };

  realstatefun = (postData, EditAddressId) => {
    let verbtype =
      EditAddressId != null && EditAddressId != "" ? "PUT" : "POST";
    let addressurl =
      verbtype == "PUT"
        ? $Service_Url.updateaddressadd
        : $Service_Url.postaddressAdd;
    // let verbtype="POST";
    // let addressurl=$Service_Url.postaddressAdd;
    konsole.log("addressLine2addressLine2", postData);
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      verbtype,
      addressurl,
      postData,
      (response, error) => {
        this.props.dispatchloader(false);
        // konsole.log("Success res" + JSON.stringify(response));
        
        konsole.log("responseresponse", response);
        if (response) {
          verbtype == "POST"
            ? AlertToaster.success("Address saved successfully")
            : AlertToaster.success("Address updated successfully");
          // verbtype == "POST" ? alert("Address  Saved Successfuly") : alert("Address Updated Successfuly")
          let addressResponse = response.data.data;
          konsole.log("response of address", addressResponse);
          if (this.state.addressTypeId == "999999") {
            this.addressRef.current.saveHandleOther(addressResponse.addressId);
            
          }
          if (this.props.fetchSavedAddress) {
            this.props.fetchSavedAddress(this.state.userId);
          }
          if (this.props.getResponseAddressId) {
            this.props.getResponseAddressId(addressResponse);
          }

          this.handleClose();
        } else {
          konsole.log("errorerror", error);
          // alert(Msg.addressMsg);
        }
      }
    );
  };

  withoutrealstatefun = (postData, EditAddressId) => {
    konsole.log("postDatapostData121", postData,EditAddressId);
    let verbtype =
      EditAddressId != null && EditAddressId != "" ? "PUT" : "POST";
    let addressurl = verbtype == "PUT" ? $Service_Url.putupdateAddress : $Service_Url.postAddAddress;
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi( verbtype, addressurl, postData, (response) => {
      this.props.dispatchloader(false);
        konsole.log("Success res" + JSON.stringify(response));
        
        if (response) {
          verbtype == "POST" ? AlertToaster.success("Address saved successfully") : AlertToaster.success("Address updated successfully");
          // verbtype == "POST" ? alert("Address  Saved Successfuly") : alert("Address Updated Successfuly")
          let addressResponse = response.data.data.addresses[0];
          konsole.log("response of address", response);
          if (this.state.addressTypeId == "999999") {
            this.addressRef.current.saveHandleOther(addressResponse.addressId);
          }
          if (this.props.fetchSavedAddress) {
            this.props.fetchSavedAddress(this.state.userId);
          }
          if (this.props.getResponseAddressId) {
            this.props.getResponseAddressId(addressResponse);
          }
          this.handleClose();
        }  else  {
          this.toasterAlert(Msg.addressMsg);
          this.setState({ counter:0 });
        }  
      }
    );
  };

  handleInputChange = (event) => {
    event.preventDefault();
    let attrname = event.target.name;
    let attrvalue = event.target.value;
    konsole.log("eventevemntes", attrname, attrvalue);
    if (attrname == "zipcode") {
      if (/^[0-9]*$/.test(attrvalue)) {
        this.setState({
          ...this.state,
          [attrname]: attrvalue,
          longitude: "",
          lattitude: "",
        });
      } else {
        this.setState({
          ...this.state,
          [attrname]: "",
        });
      }
    } else if (attrname == "addressLine2") {
      this.setState({
        ...this.state,
        [attrname]: attrvalue,
      });
    } else if (attrname == "streetAddress") {
      this.setState({
        ...this.state,
        [attrname]: attrvalue,
      });
    } else if (!onlyAlpbet.test(attrvalue)) {
      this.setState({
        ...this.state,
        [attrname]: attrvalue,
        longitude: "",
        lattitude: "",
      });
    } else {
      this.setState({
        ...this.state,
        [attrname]: "",
      });
    }
  };

  resetState = () => {
    this.searchInput.current.value = "";
    this.setState({
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      streetAddress: "",
      zipcode: "",
      country: "",
      city: "",
      state: "",
      county: "",
      countyRefId: null,
      showClearButton: false,
    });
  };

  handleClearField = () => {
    this.searchInput.current.value = "";
    this.resetState();
    this.setState({
      is_checked: !this.state.is_checked,
    });
  };

  handleshowCLearButton = () => {
    initMapScript().then(() => this.initAutoComplete());
    let showClearButton = false;
    if (this.searchInput.current.value !== "") {
      if (this.searchInput.current.value > 0) {
        showClearButton = true;
      }
    }
    this.setState({
      showClearButton: showClearButton,
    });

    konsole.log("showclear", showClearButton);
  };

  handleClose = () => {
    this.props.handleshowAddress();
  };

  validateAddress = (state) => {

    konsole.log("state", state);
    if (
      state.zipcode == "" ||
      state.counrty == "" ||
      state.city == "" ||
      state.state == "" || 
      this.searchInput?.current?.value == ""
    ) {
      // alert(Msg.msg03);
      this.toasterAlert(Msg.msg03);
    
      return false;
    }
    else if(this.state.addressTypeId == undefined || this.state.addressTypeId == null || this.state.addressTypeId == -1){
      this.toasterAlert(Msg.addressMsg);
      return false;
    }
    return true;
  };

  checkAddressExist = () => {

    if (this.props.savedAddress && this.props.savedAddress.length > 0) {
      let savedAddress = this.props.savedAddress;
      if ( this.props.EditAddress !== undefined && this.props.EditAddress !== "" && this.props.EditAddress !== null) {
        savedAddress = savedAddress?.filter(
          (items) => items?.addressTypeId !== this.props?.EditAddress?.addressTypeId);
      }
      konsole.log("this.props.EditAddress", this.props.EditAddress);
      konsole.log("savedAddresssavedAddress", savedAddress);
      if (parseInt(this.state.addressTypeId) !== 999999) {
        if (
          savedAddress.some((saved) => {
            return saved.addressTypeId == this.state.addressTypeId;
          })
        ) {
          const addressTypeName = this.state.addressTypeId == "1"  ? "Physical"  : this.state.addressTypeId == "2"  ? "Mailing"  : "";
          // alert(`${addressTypeName} Address already exist`);
          this.toasterAlert(`${addressTypeName} Address already exist`);
          this.resetState();
          return false;
        }
      }
    }
    return true; //if address type does not exist
  };

  toasterAlert(test) {
    konsole.log(this.context.setdata($AHelper.toasterValueFucntion(true, test, "Warning")),
      this.context, test, "thiscontext"
    );
  }

  getDifferenceAddress = (array1, array2) => {
    return array2?.filter((object1) => {
      if(object1.value == "999999") return true
      return !array1?.some((object2) => {
        return object1?.value == object2?.addressTypeId;
      });
    });
  };
  handleSelectAddressChoose=(e)=>{
    this.setState({ addressTypeId: e.target.value })
    konsole.log('addressType',e.target.value)
  }


  render() {
    konsole.log("EditAddressIdEditAddressId", this.props.savedAddress);
    konsole.log("CITY", this.state.addressId);
    konsole.log("jjj", this.verbtype, this.searchInput.current?.value,this.props.ageValidation);

    const EditAddressId = this.props.EditAddress
      ? this.props.EditAddress.addressId
      : "";
    const spouseUserId = sessionStorage.getItem("spouseUserId");

    const addressType = this.state.addresstype
    const savedAddress = this.props.savedAddress


     if(savedAddress?.length > 0){
      konsole.log("EditAddressEditAddress",this.props.EditAddress,savedAddress,addressType)
      let addressData = this.getDifferenceAddress(savedAddress, addressType);
        this.state.addresstype = addressData

        if(this.props.EditAddress !== undefined && this.props.EditAddress !== null && this.props.EditAddress !== ""){ 
          if(this.props.EditAddress?.addressTypeId !== 999999){
          let data = {
            value : String(this.props.EditAddress?.addressTypeId),
            label : this.props.EditAddress?.addressType
          }
          this.state.addresstype.unshift(data)
          }
        }
      }

    const showOrHideSuiteNoField=(this.state.addressTypeId == 1 ||  this.state.addressTypeId == 3)? false :true;

  
    return (
      <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            z-index: 2;
            opacity: 0.7;
          }
        `}</style>
        {/* <a onClick={this.handleShow}>
              <img
                className="ms-3"
                src="/icons/add-icon.svg"
                alt="Add Address"
              />
            </a> */}

        <Modal size="md" show={this.props.showAddress}enforceFocus={false} centered onHide={this.handleClose} animation="false" backdrop="static" >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Address</Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            <Row className="mb-3" >
              <Col xs="12" sm="12" lg="12" className="d-flex align-items-center">
                <Form.Select
                  // onChange={(event) => this.setState({ addressTypeId: event.target.value })}
                  onChange={(e)=>this.handleSelectAddressChoose(e)}
                  value={this.state.addressTypeId}
                  className="w-100 custom-select"
                >
                  {/* onChange={(event) => this.showValue(event)} */}
                  <option value="-1" disabled selected hidden> Choose address type</option>
                  {this.state.addresstype.map((address, index) => {
                    konsole.log("addressaddressaddress",this.state.addressTypeId);
                    return (
                      <option key={index} value={address.value}>
                        {address.label}
                      </option>
                    );
                  })}
                </Form.Select>
              </Col>
              {/* {
                (this.state.userId == spouseUserId && this.state.addressTypeId == '1') &&
                <Col>
                  <Form.Check
                    className="chekspace"
                    type="checkbox"
                    checked={this.state.is_checked}
                    onChange={this.handleCheckBox}
                    name="livein"
                    label={`Same as ${this.state.loginUserDetail.memberName} address`}
                  />
                </Col>
              } */}
              {this.state.addressTypeId == "999999" && (
                <Col sm="12" lg="12" className="mt-3">
                  <Other
                    othersCategoryId={2}
                    userId={this.state.userId}
                    dropValue={this.state.addressTypeId}
                    ref={this.addressRef}
                    natureId={this.state.natureId}
                  />
                </Col>
              )}
            </Row>
            {/* {(showOrHideSuiteNoField) &&  */}
            <Row className="mb-3">
              <Col xs md="6" className="d-flex align-items-center">
                <Form.Control
                  type="text"
                  onChange={this.handleInputChange}
                  name="addressLine2"
                  value={this.state.addressLine2}
                  autoComplete="nope"
                  placeholder={this.state.addressTypeId == 1 ||  this.state.addressTypeId == 3 ? "Apartment No" : "Suite"}
                  />
              </Col>
            </Row>
            {/* } */}
            <Row className="mb-3 m-0 p-0">
              <Col  md="12"  className="d-flex align-items-center border bg-grayColor position-relative rounded">
                <Form.Control
                  type="text"
                  className="border-0 outline-0 bg-grayColor"
                  ref={this.searchInput}
                  onChange={this.handleshowCLearButton}
                  defaultValue={this.state.addressLine1}
                  placeholder="Please Enter your full address..."
                />
                {this.state.showClearButton && (
                  <div className=" end-0 me-2 cursor-pointer  border-start border-dark p-1" onClick={this.handleClearField}> Clear</div>
                )}
                {/* <a><img className="ms-3" src="/icons/map-icon.svg" alt="map" /></a> */}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs="12" md="6" className="d-flex align-items-center mb-3">
                <Form.Control
                  value={this.state.streetAddress}
                  onChange={this.handleInputChange}
                  name="streetAddress"
                  type="text"
                  placeholder="Street Address"
                  autoComplete="nope"
                  // disabled={this.state.disabledField}
                />
              </Col>
            {/* </Row>
            <Row className="mb-3"> */}
              <Col xs="12" md="6" className="d-flex align-items-center mb-3">
                <Form.Control
                  value={this.state.city}
                  onChange={this.handleInputChange}
                  name="city"
                  type="text"
                  autoComplete="nope"
                  placeholder="City"
                  // disabled={this.state.disabledField}
                />
              </Col>
              {/* </Row>
              <Row className="mb-3"> */}
              <Col xs="12" md="6" className="d-flex align-items-center mb-3">
                {/* <Select
                  className="w-100 custom-select"
                  options={this.state.stateList}
                  placeholder="State"
                  onChange={(event) =>
                    this.setState({ state: event.value })
                  }
                />                */}

                <Form.Control
                  value={this.state.state}
                  onChange={this.handleInputChange}
                  name="state"
                  type="text"
                  placeholder="State"
                  autoComplete="nope"
                  // disabled={this.state.disabledField}
                />
              </Col>
              <Col xs="12" md="6" className="d-flex align-items-center mb-3">
                <Form.Control
                  value={this.state.zipcode}
                  onChange={this.handleInputChange}
                  name="zipcode"
                  type="text"
                  autoComplete="nope"
                  placeholder="Postal/Zip Code"
                  maxLength={10}
                  // disabled={this.state.disabledField}
                />
              </Col>
              {/* </Row> */}
            {/* <Row className="m-0 mb-3">
              <Col xs md="11" className="d-flex align-items-center px-0">
                <Form.Control
                  type="text"
                  onChange={this.handleInputChange}
                  name="addressLine2"
                  value={this.state.addressLine2}
                  placeholder="Address 2"
                />
              </Col>
            </Row> */}
          
            {/* <Row className="mb-3"> */}
            <Col xs="12" md={`${showOrHideSuiteNoField==true?'6':'6'}`} className="d-flex align-items-center mb-3">
                <Form.Control
                  type="text"
                  value={this.state.county}
                  onChange={this.handleInputChange}
                  name="county"
                  autoComplete="nope"
                  placeholder="County"
                />
              </Col>
              <Col xs="12" md="6" className="d-flex align-items-center mb-3">
                 <Form.Select
                   onChange={e => this.setState({countyRefId: e.target.value}) }
                   value={this.state.countyRefId}
                   className="w-100 custom-select"
                 >
                  <option value="-1" disabled selected hidden>County reference</option>
                  {this.state.countyRef.map((county, index) => {
                    // konsole.log("countyRefaddressaddressaddress",this.state.countyRef);
                    return (
                      <option key={index} value={county.value}>
                        {county.label}
                      </option>
                    );
                  })}
                </Form.Select>
                {/* <Select
                  className="w-100 custom-select"
                  options={this.state.countryList}
                  placeholder="Country"
                  onChange={(event) => this.chooseCountry(event)}
                /> */}
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button className="theme-btn" onClick={this.handleAddressSubmit}>
                {EditAddressId != undefined && EditAddressId != ""  ? "Update"  : "Save"}
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
  dispatchUserDetail: (userDetails) =>
    dispatch({ type: GET_USER_DETAILS, payload: userDetails }),
  dispatchAuthId: (authId) =>
    dispatch({ type: GET_Auth_TOKEN, payload: authId }),
});

export default connect(mapStateToProps, mapDispatchToProps)(address);
