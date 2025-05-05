import React, { Component } from "react";
import { $CommonServiceFn } from "./network/Service";
import { Col, Form, Row } from "react-bootstrap";
import { $Service_Url } from "../components/network/UrlPath";
import konsole from "./control/Konsole";
import { $AHelper, initMapScript } from "./control/AHelper";
import { onlyAlpbet } from "./control/Constant";
import { globalContext } from "../pages/_app";
import { CustomInput } from "../component/Custom/CustomComponent";

export class PlaceOfBirth extends Component {
  static contextType = globalContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      userId: this.props.userid,
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      city: "",
      state: "",
      zipCode: "",
      county: "",
      country: "",
      disabledField: false,
      businessName: this.props.businessName,
    };
    this.searchInput = React.createRef();
  }

  componentDidUpdate(prevProps) {
  
    konsole.log("dbpropinpob", this.searchInput.current.value , "&&", prevProps, "&&", this.props?.placeholder, this.props.addressData?.addressLine1, this.props?.addressData , this.props?.birthPlace,"&&", this.state?.addressLine1)
    // if(prevProps?.birthPlace !== this.props?.birthPlace) this.setState({addressLine1: this.props?.birthPlace});

    const EditAddress = this.props.addressData;
    if (EditAddress!=="" && EditAddress !== prevProps.addressData) {
      // konsole.log("EditAddressEditAddressEditAddress",EditAddress)
      let addressValue = this.props?.placeholder == true ? this.props.addressData?.addressLine1 : this.props?.placeholder == "Address" ? this.props.addressData : this.props.birthPlace;
      this.searchInput.current.value = addressValue != undefined ? addressValue : "";
      this.setState({
        // addressLine1: this.props?.placeholder == true ? this.props.addressData?.addressLine1 : this.props?.placeholder == "Address" ? this.props.addressData : this.props.birthPlace ,
        addressLine3: EditAddress ? EditAddress?.addressLine1?.substring(0,EditAddress.addressLine1.indexOf(",")): "",
        city: EditAddress ? EditAddress.city : "",
        addressLine2: EditAddress ? EditAddress.addressLine2 : "",
        state: EditAddress ? EditAddress.state : "",
        zipCode: EditAddress ? EditAddress.zipcode : "",
        county: EditAddress ? EditAddress.county : "",
        country: EditAddress ? EditAddress.country : "",
        disabledField: EditAddress ? true : false,
        businessName: this.props.businessName,
      });
    }
  }

  extractAddress = (place) => {
    const address = {
      city: "",
      state: "",
      zip: "",
      country: "",
      county: "",
      unWanted: [],

      plain() {
        const city = this.city ? this.city + ", " : "";
        const zip = this.zip ? this.zip + ", " : "";
        const state = this.state ? this.state + ", " : "";
        const county = this.county ? this.county + ", " : "";
        return city + zip + state + this.country + county;
      },
    };

    if (!Array.isArray(place?.address_components)) {
      return address;
    }
    let postalCodeSuffix = "";
    let unWanted = ['USA', 'UK'];
    place.address_components.forEach((component) => {
      const value = component.long_name;
      const types = component.types;

      if (types.includes("locality")) {
        address.city = value;
        unWanted.push(component.long_name, component.short_name);
      }
      
      if (types.includes("administrative_area_level_1")) {
        address.state = value;
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
      if (types.includes("administrative_area_level_2")) {
        address.county = value;
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

  // used for removing zipcode, country, state, and city from ending of address.addressline1
  formateAddressLine1 = (address) => {
    if(!address || !address.addressLine1 || !address.unWanted?.length) return address;

    const splitedAddressLine1 = address.addressLine1.split(', ');
    // konsole.log('splitedAddressLine1' , splitedAddressLine1, address.unWanted);

    let finalAddressLine1 = '';
    splitedAddressLine1.forEach((word) => {
      // konsole.log('splitedAddressLine1CMP', word, address.unWanted.includes(word))
      if(!address.unWanted.includes(word)) finalAddressLine1 += word + ', ';
    })
    // konsole.log("splitedAddressLine1fin", finalAddressLine1.slice(0, -2));

    if(finalAddressLine1) address.addressLine1 = finalAddressLine1.slice(0);
    address.unWanted = undefined;
    return address
  }

  // do something on address change
  onChangeAddress = (autocomplete) => {
    // debugger
    const place = autocomplete.getPlace();
    const lat = place?.geometry?.location?.lat();
    const long = place?.geometry?.location?.lng();
    if(lat == undefined|| long == undefined) return;
    this.setAddress(this.extractAddress(place), lat, long);
  };

  setAddress = (address, lat, long) => {
    konsole.log("setaddress", address, this.searchInput?.current?.value);
    
    // this.setState({
    //         addressLine3: this.searchInput?.current?.value.substring(0,this.searchInput?.current?.value.indexOf(",")),
    //   city: address.city,
    //   state: address.state,
    //   zipCode: address.zip,
    //   county: address.county,
    //   country: address.country,
    //   disabledField: true,
    // });
    // let birthPlace = address.city + " " + address.state +  ", " + address.country + ", " + lat + ", " + long;
    let birthPlace = this.searchInput?.current?.value + (address?.zip ?  ", " + address?.zip : "");
    if (
      this?.props?.placeholder == true ||
      this?.props?.placeholder == "Address"
    ) {
      address["addressLine1"] = this.searchInput?.current?.value;
      address["longitude"] = long;
      address["lattitude"] = lat;

      // removing city, state, country and zipcode form addressline 1
      // address = this.formateAddressLine1(address);
      if(this.validate(address)) this?.props?.addressDetails(address);
      else this?.props?.addressDetails({});
    } else {
      this.props.handlePlaceBirth(birthPlace);
    }
    // this.setState({
    //   //...this.state,
    //   city: address.city,
    //   state: address.state,
    //   zipcode: address.zip,
    //   country: address.country
    // })
    this.setState({
      addressLine3: this.searchInput?.current?.value.substring(0,this.searchInput?.current?.value.indexOf(",")),
      zipCode: address.zip,
      disabledField: true,
    });
  };

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

  componentDidMount() {
    initMapScript().then(() => this.initAutoComplete());
  }

  fetchCountryList = () => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getCountryListPath,
      "",
      (response) => {
        if (response) {
          this.setState({
            ...this.state,
            countryList: response.data.data,
          });
        }
      }
    );
  };
  handleInputChange = (event) => {
    event.preventDefault();
    let attrname = event.target.name;
    let attrvalue = event.target.value;
    konsole.log("eventevemntes", attrname, attrvalue);
    if (attrname == "zipCode") {
      if (/^[0-9]*$/.test(attrvalue)) {
        this.setState({
          ...this.state,
          [attrname]: attrvalue,
          // longitude: "",
          // lattitude: "",
        });
      } else {
        this.setState({
          ...this.state,
          [attrname]: "",
        });
      }
    } else if (attrname == "addressLine3") {
      this.setState({
        ...this.state,
        [attrname]: attrvalue,
      });
    } else if (attrname == "addressLine2") {
       this.props.addressLine(attrvalue)
       this.setState({
        ...this.state,
        addressLine2: attrvalue,
      });
    
    } else if (!onlyAlpbet.test(attrvalue)) {
      this.setState({
        ...this.state,
        [attrname]: attrvalue,
        // longitude: "",
        // lattitude: "",
      });
    } else {
      this.setState({
        ...this.state,
        [attrname]: "",
      });
    }
  };

  handleBusinessNameChange = (event) => {
    const _businessName = $AHelper.capitalizeFirstLetter(event.target.value);
    this.props.handlebusinessNameChange(_businessName);
    this.setState({businessName: _businessName});
  }

  handleEmptyAddress = (event) => {
    konsole.log("dbHandle", event.target.value)
    if(event.target.value == "") {
      this.resetAddress();
      if(this?.props?.placeholder == true || this?.props?.placeholder == "Address") this.props?.addressDetails(undefined);
      else this.props.handlePlaceBirth("");
    }
  }

  resetAddress = () => {
    this.searchInput.current.value = ""
    this.setState({
      addressLine2: "",
      addressLine3: "",
      city: "",
      state: "",
      zipCode: "",
      county: "",
      country: "",
    })
  }

  validate = (newAddres) => {
    if (!newAddres || !newAddres?.addressLine1 || !newAddres?.zipcode && !newAddres?.zip || !newAddres?.city || !newAddres?.country || !newAddres?.state) {
      this.context.setdata({ open: true, text: "Please search address using ZIP code/exact address", type: "Warning" });
      this.resetAddress();
      return false;
    }
    return true;
  }

  render() {
    konsole.log("propspropspropsprops", this.props);
    return (
      // <>
      // {!this.props?.placeholder ? <label>Place of Birth</label> : <></>}
      // <Form.Control type="text" className = "" ref={this.searchInput}
      // defaultValue = {(this.props?.placeholder == true) ? this.props.addressData?.addressLine1 : this.props.birthPlace}
      // // defaultValue='NMitin'
      //  placeholder={this.props?.placeholder == true ? "Address*" :this.props?.placeholder=="Address"?"Address": "Place Of Birth.." } />
      // </>

      <>
        {this.props?.isNewDesgin == true ? <>
          <div id='custom-input-field' className="custom-input-field">
          <p>{"Address"}</p>
          <input label="Address" type='text' className='mb-1' placeholder="Street address or P.O Box"
           id='addressLine1' ref={this.searchInput} defaultValue={this.props.addressData} onChange={(e) => this.handleEmptyAddress(e)} />
                        
                        </div>

        </>:<>
        {!this.props?.placeholder ? <label>Place of Birth</label> : <></>}
        <Form.Control type="text"  ref={this.searchInput} 
        defaultValue={this.props?.placeholder == true ? this.props.addressData?.addressLine1 : this.props?.placeholder == "Address" ? this.props.addressData : this.props.birthPlace}
     
         placeholder={this.props?.placeholder == true  ? "Address*"  : this.props?.placeholder == "Address"  ? "Address"  : "Place Of Birth.."}
         onChange={this.handleEmptyAddress}
         />        
        </>}
       

        {this.props.protypeTd == "" && (
          <div className="mt-2">
            <Row className="mb-2">
              <Col xs="12" sm="12" lg="4" className="d-flex align-items-center ">
                <Form.Control value={this.state.addressLine3} onChange={this.handleInputChange} name="addressLine3" type="text" placeholder="Street"disabled={this.state.disabledField} />
              </Col>
              <Col xs="12" sm="12" lg="4"className="d-flex align-items-center ">
                <Form.Control value={this.state.businessName} onChange={this.handleBusinessNameChange} name="business" type="text" placeholder="Business name"/>
              </Col>
              <Col xs="12" sm="12" lg="4" className="d-flex align-items-center ">
                <Form.Control value={this.state.addressLine2} onChange={this.handleInputChange} name="addressLine2" type="text" placeholder="Suite no."/>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs="12" sm="12" lg="4" className="d-flex align-items-center" >
                <Form.Control value={this.state.city} onChange={this.handleInputChange} name="city" type="text" placeholder="City" disabled={this.state.disabledField} />
              </Col>
              <Col xs="12" sm="12" lg="4" className="d-flex align-items-center margintop-clas"  >
                <Form.Control value={this.state.state} onChange={this.handleInputChange} name="state" type="text" placeholder="State" disabled={this.state.disabledField} />
              </Col>
              <Col xs="12" sm="12" lg="4" className="d-flex align-items-center margintop-clas" >
                <Form.Control value={this.state.zipCode} onChange={this.handleInputChange} name="zipCode" type="text" placeholder="Postal/Zip Code" disabled={this.state.disabledField} />
              </Col>
            </Row>
            <Row className="">
              <Col xs="12" sm="12" lg="4" className="d-flex align-items-center mb-2" >
                <Form.Control type="text" value={this.state.county !== null ? this.state.county : ""} onChange={this.handleInputChange} name="county"
                // defaultValue={this.state.addressLine2} 
                placeholder="County" disabled={this.state.disabledField} />
              </Col>
              <Col xs="12" sm="12" lg="4" className="d-flex align-items-center mb-1" >
                <Form.Control value={this.state.country} onChange={this.handleInputChange} name="country" type="text" placeholder="Country" disabled={this.state.disabledField} />
              </Col>
            </Row>
          </div>
        )}
      </>
    );
  }
}

export default PlaceOfBirth;
