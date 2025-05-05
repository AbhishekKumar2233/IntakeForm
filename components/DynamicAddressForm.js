import React, { Component } from "react";
import { globalContext } from "../pages/_app";
import { $CommonServiceFn } from "./network/Service";
import { $AHelper, initMapScript } from './control/AHelper'
import { $Service_Url } from "./network/UrlPath";
import { SET_LOADER } from "./Store/Actions/action";
import { connect } from "react-redux";
import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import konsole from "./control/Konsole";
import { isNotValidNullUndefile, postApiCall } from "./Reusable/ReusableCom";


class DynamicAddressForm extends Component {
    static contextType = globalContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            // Address API field
            prevAddressId: "",
            addressLine1: "",
            addressLine2: "",
            addressLine3: "",
            zipCode: "",
            county: "",
            city: "",
            state: "",
            country: "",
            countyRefId: null,

            // form used states
            countyRef: [],
            loggedUserId: sessionStorage.getItem("loggedUserId") || "",
        };
        this.searchInput = React.createRef();
    }

    componentDidMount() {
        initMapScript().then(() => this.initAutoComplete());
        this.getCountyRef()
    }

    getCountyRef = () => {
        $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getCountyRef, "", (res, err) => {
                if (res) {
                    konsole.log("resres", res);
                    this.setState({countyRef: res?.data?.data});
                } else {
                    this.setState({countyRef: []});
                }
            }
        );
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
    // formateAddressLine1 = (address) => {
    //     if(!address || !address.addressLine1 || !address.unWanted?.length) return address;
    
    //     const splitedAddressLine1 = address.addressLine1.split(', ');
    
    //     let finalAddressLine1 = '';
    //     splitedAddressLine1.forEach((word) => {
    //         if(!address.unWanted.includes(word)) finalAddressLine1 += word + ', ';
    //     })
    
    //     if(finalAddressLine1) address.addressLine1 = finalAddressLine1.slice(0, -2);
    //     address.unWanted = undefined;

    //     return address
    // }
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
    
      // do something on address change
    onChangeAddress = (autocomplete) => {
        const place = autocomplete.getPlace();
        const lat = place?.geometry?.location?.lat();
        const long = place?.geometry?.location?.lng();
        if(lat == undefined|| long == undefined) return;
        this.setAddress(this.extractAddress(place), lat, long);
    };

    handleEmptyAddress = (event) => {
        if(event.target.value == "") {
          this.resetAddress();
          this.setState({
                addressLine2: "",
                countyRefId: null,
            })
        }
    }
    
    setAddress = (address, lat, long) => {
        konsole.log("setaddress", address, this.searchInput?.current?.value);
    
        // removing city, state, country and zipcode form addressline 1
        address = this.formateAddressLine1(address);

        address["addressLine1"] = this.searchInput?.current?.value;
        address["addressLine3"] = this.searchInput?.current?.value;
        address["longitude"] = long;
        address["lattitude"] = lat;

        if(this.validate(address)) this.setState({
            ...address,
            zipCode: address.zip,
        })
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

    getByUserId = ( userId ) => {
        // if(!userId) return;
        if(!isNotValidNullUndefile(userId))return;
      
        // alert(userId);
        // this.props.setLoader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAllAddress + userId, "", (response) => {
            // this.props.setLoader(false);
            if (response?.data?.data?.addresses?.length > 0) {7
                konsole.log("addressResp",response.data)
                const getAddress = response.data.data.addresses[0]
                this.setState({
                    prevAddressId: getAddress?.addressId || "",
                    addressLine1: getAddress?.addressLine1 || "",
                    addressLine2: getAddress?.addressLine2 || "",
                    addressLine3: getAddress?.addressLine1 || "",
                    zipCode: getAddress?.zipcode || getAddress?.zip || "",
                    county: getAddress?.county || "",
                    city: getAddress?.city || "",
                    state: getAddress?.state || "",
                    country: getAddress?.country || "",
                    countyRefId: getAddress?.countyRefId || null,
                    lattitude: getAddress?.lattitude || "",
                    longitude: getAddress?.longitude || "",
                })
                this.searchInput.current.value = getAddress.addressLine1 || "";
            } else {
                this.resetAddress();
                this.setState({
                    addressLine2: "",
                    countyRefId: null,
                    prevAddressId:''
                })
                konsole.log("addressError",response)
            }
        });
    }

    upsertAddress = ( userId, addressTypeId, forcePost ) => {
        if(!userId) return;
        
        let { lattitude, longitude, addressLine1, addressLine2, state, county, countyRefId, zipCode, city, country, prevAddressId, loggedUserId } = this.state;

        if (!addressLine1){
        this.deleteAddress(userId,prevAddressId)
        return ;
        }
  
        let method = prevAddressId != "" ? 'PUT' : 'POST';
        if(forcePost == true) method = 'POST';

        if(method == 'POST' && !addressLine1) return;
        
        let apiURL = method == "POST" ? $Service_Url.postAddAddress : $Service_Url.putupdateAddress;
  
        let jsonObj = method == "PUT" ? 
        { // object for update
            "userId": userId,
            "address": {
                "lattitude": lattitude|| "",
                "longitude": longitude || "",
                "addressLine1": addressLine1 || "",
                "addressLine2": addressLine2 || "",
                "zipcode": zipCode || '',
                "county": county || '',
                "countyRefId": countyRefId || null,
                "city": city || "",
                "state": state || "",
                "country": country || "",
                "addressTypeId": addressTypeId || 1 ,
                "addressId": prevAddressId,
                "updatedBy": loggedUserId,
                "isActive": true
            }
        } : { // object for save
            "userId": userId,
            "address": {
                "lattitude": lattitude || "",
                "longitude": longitude || "",
                "addressLine1": addressLine1 || "",
                "addressLine2": addressLine2,
                "zipcode": zipCode || '',
                "county": county || '',
                "countyRefId": countyRefId || null,
                "city": city || "",
                "state": state || "",
                "country": country || "",
                "addressTypeId": addressTypeId || 1 ,
                'createdBy': loggedUserId
            }
        }
        konsole.log('jsonObj343434344',jsonObj, this.state)
  
        // this.props.setLoader(true);
        $CommonServiceFn.InvokeCommonApi(method , apiURL, jsonObj, (response, error)=>{
            if(response){
                konsole.log('postaddressAdda',response?.data?.data?.addresses?.[0]?.addressId,response)
                // this.setState({
                //     prevAddressId:''
                // })
                // this.resetAddress()
            }else{
                konsole.log('postaddressAdd',error)
            }
            // this.props.setLoader(false);
        })
    }

    deleteAddress = (userId,addressId) => {
        const deleteApi = postApiCall('DELETE',`${$Service_Url.deleteAddress+userId}/${addressId}/${userId}`,'')
        konsole.log(deleteApi,"deleteApi")
    }

    handleInputChange = (event) => {
        event?.preventDefault();
        let attrname = event.target.name;
        let attrvalue = event.target.value;

        konsole.log("eventevemntes", attrname, attrvalue);
        
        if (attrname == "zipCode") {
            if (/^[0-9]*$/.test(attrvalue)) 
                this.setState({ 
                    ...this.state, 
                    [attrname]: attrvalue
                });
        } else {
            this.setState({
                ...this.state,
                [attrname]: attrvalue,
            });
        }
    }

    validate = (newAddres) => {
        if (!newAddres || !newAddres?.zipCode && !newAddres?.zip || !newAddres?.city || !newAddres?.country || !newAddres?.state) {
            var errorText = !newAddres?.zipCode && !newAddres?.zip && 'zip code' || !newAddres?.city && 'city' || !newAddres?.country && 'country' || !newAddres?.state && 'state'
            this.context.setdata({ open: true, text: `Please search address using ${errorText}/exact address`, type: "Warning" });
            // this.resetAddress();
            return false;
        }
        return true;
    }

    isEmpty = () => {
        return (this.state.addressLine1?.length > 1) == false;
    }

    resetAddress = () => {
        this.searchInput.current.value = ""
        this.setState({
          addressLine1: "",
        //   addressLine2: "",
          addressLine3: "",
          city: "",
          state: "",
          zipCode: "",
          zip: "",
          county: "",
          country: "",
        //   countyRefId: null,
        //   prevAddressId:''
    })
    }

    fetchAddreesswithAddressId = (addressId) => {
        if(!addressId) {
            this.resetAddress();
            this.setState({
                addressLine2: "",
                countyRefId: null,
                prevAddressId:''
            });
            return;
        }
          $CommonServiceFn.InvokeCommonApi(
            "GET",
            $Service_Url.getAddressByaddressID + addressId,
            "",
            (response) => {
              if (response) {
                konsole.log("addressId get from api", response?.data?.data);
                let getAddress = response?.data?.data
                this.setState({
                    prevAddressId: getAddress?.addressId || "",
                    addressLine1: getAddress?.addressLine1 || "",
                    addressLine2: getAddress?.addressLine2 || "",
                    addressLine3: getAddress?.addressLine1 || "",
                    zipCode: getAddress?.zipcode || getAddress?.zip || "",
                    county: getAddress?.county || "",
                    city: getAddress?.city || "",
                    state: getAddress?.state || "",
                    country: getAddress?.country || "",
                    countyRefId: getAddress?.countyRefId || null,
                    lattitude: getAddress?.lattitude || "",
                    longitude: getAddress?.longitude || "",
                })
                this.searchInput.current.value = getAddress.addressLine1 || "";

            }else{
                this.resetAddress()
                this.setState({
                    addressLine2: "",
                    countyRefId: null,
                    prevAddressId:''
                })
            }
            }
          );
      };

    render() {      
        return (      
            <>
            <Row className="">
                <Col className="d-flex align-items-center mt-2">
                    <Form.Control  type="text" ref={this.searchInput} className="" placeholder={`Address`} onChange={this.handleEmptyAddress}/>
                </Col>
            </Row>
            <Row className="mb-0">
                <Col xs="12" sm="6" lg="4" className="d-flex align-items-center mt-2">
                    <Form.Control  autoComplete="nope" value={this.state.addressLine2} onChange={this.handleInputChange} name="addressLine2" type="text" placeholder="Suite no."/>
                </Col>
            </Row>
            <Row className="mt-2">
                <Col xs="12" sm="6" lg="4" className="d-flex align-items-center mb-2">
                    <Form.Control  autoComplete="nope" value={this.state.addressLine3} onChange={this.handleInputChange} name="addressLine3" type="text" placeholder="Street" />
                </Col>
                <Col xs="12" sm="6" lg="4" className="d-flex align-items-center mb-2" >
                    <Form.Control  autoComplete="nope" value={this.state.city} onChange={this.handleInputChange} name="city" type="text" placeholder="City"  />
                </Col>
                <Col xs="12" sm="6" lg="4" className="d-flex align-items-center mb-2"  >
                    <Form.Control  autoComplete="nope" value={this.state.state} onChange={this.handleInputChange} name="state" type="text" placeholder="State"  />
                </Col>
                <Col xs="12" sm="6" lg="4" className="d-flex align-items-center mb-2" >
                    <Form.Control  autoComplete="nope" value={this.state.zipCode} onChange={this.handleInputChange} name="zipCode" type="text" placeholder="Postal/Zip Code" maxLength={10} />
                </Col>
                <Col xs="12" sm="6" lg="4" className="d-flex align-items-center mb-2" >
                    <Form.Control  autoComplete="nope" type="text" value={this.state.county} onChange={this.handleInputChange} name="county" placeholder="County"  />
                </Col>
                <Col xs="12" sm="6" lg="4" className="d-flex align-items-center mb-2" >
                    <Select
                        className="w-100 p-0 custom-select"
                        options={this.state.countyRef}
                        name="countyRefId"
                        onChange={e => this.setState({countyRefId: e.value}) }
                        value={this.state.countyRef?.filter(ele => ele.value == this.state.countyRefId)}
                        placeholder="County reference"
                    />
                </Col>
            </Row>
            </>
        )
    }
}

export default DynamicAddressForm;

// Address added through this API will not be mapped with the user 
export const upsertUnmappingAddress = (method, addressJson, userId) => {
    return new Promise((resolve, reject) => {
        // debugger
    // new address urls updateaddressadd, postaddressAdd
    let APIUrl = '';
    let finalAddressJson = {};
    const loggedInUserId = sessionStorage.getItem("loggedUserId") || "";

    // URL finalizing
    if(method == "DELETE" && addressJson?.addressId) {
        APIUrl = $Service_Url.deleteaddressadd + `/${addressJson.addressId}/${loggedInUserId}`;
    } else if(method == "PUT") {
        APIUrl = $Service_Url.updateaddressadd;
    } else if(method == "POST") {
        APIUrl = $Service_Url.postaddressAdd;
    } else {
        // no use of call
        return resolve("err");
    }

    // Json finalizing
    try {
        // let { lattitude, longitude, addressLine1, addressLine2, addressLine3, zipcode, county, city, state, country, addressTypeId, countyRefId } = addressJson;
        finalAddressJson = addressJson;
        if(method == "POST") {
            finalAddressJson["createdBy"] = loggedInUserId
        } else if(method == "PUT") {
            finalAddressJson["updatedBy"] = loggedInUserId
            finalAddressJson["addressId"] = addressJson.addressId;
            finalAddressJson["isActive"] = true;
        } 
    } catch (error) {
        konsole.log('error_upsertUnmappingAddress', err)
        return resolve("err");
    }

    $CommonServiceFn.InvokeCommonApi(method , APIUrl, finalAddressJson, (response, error)=>{
        if(response) return resolve(response);

        konsole.log('error_upsertUnmappingAddress', err)
        return resolve("err")
    })

    })
}