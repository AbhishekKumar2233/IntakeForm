import React, { useState, useEffect, useRef, useContext } from "react";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb,} from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import { SET_LOADER } from "./Store/Actions/action";
import { $Service_Url } from "./network/UrlPath";
import { $CommonServiceFn ,$postServiceFn } from "./network/Service";
import { $AHelper } from "./control/AHelper";
import { Msg } from "./control/Msg";
import konsole from "./control/Konsole";
import moment from "moment";
import { globalContext } from "../pages/_app";
import Other from "./asssets/Other";
import OtherInfo from "./asssets/OtherInfo";
import CurrencyInput from "react-currency-input-field";
import DatepickerComponent from "./DatepickerComponent";
import Address from "./address";
import RealEstateAddLenders from "./RealEstateAddLenders";
import AlertToaster from "./control/AlertToaster";
import PlaceOfBirth from "./PlaceOfBirth";
import DynamicAddressForm, { upsertUnmappingAddress } from "./DynamicAddressForm";
import TableEditAndViewForDecease from "./Deceased/TableEditAndViewForDecease";
import ExpensesPaidQuestion from "./ExpensesPaidQues";
import { isNotValidNullUndefile, isNullUndefine, removeDuplicate } from "./Reusable/ReusableCom";

const RealEstate = (props) => {
  const { data, setdata, confirmyes, setConfirmyes, handleCloseYes, confirm } =
    useContext(globalContext);

  const realPropertyRef = useRef();
  const ownerRef = useRef();
  //-------------------------------------------------------------------------------------------------------------------------------------------

  const [userId, setuserId] = useState("");
  konsole.log("userIduserId", userId);
  const [landerData, setlanderData] = useState()
  const [loggedUserId, setloggedUserId] = useState("");
  const [update, setupdate] = useState(false);
  const [pagerender, setpagerender] = useState(false);

  //---------------------------------------------------------------------------------------------------------------------------------------------
  const [PreConditionTypes, setPreConditionTypes] = useState([]);
  const [agingAssetTypeId, setagingAssetTypeId] = useState("");
  const [agingAssetTypeIdLast, setagingAssetTypeIdLast] = useState("");
  const [PreConditionTypesValue, setPreConditionTypesValue] = useState([]);
  const [userAgingAssetId, setuserAgingAssetId] = useState("");
  const [contactName, setContactname] = useState("");
  // const [outstandingBalance, setOutstandingbalance] = useState(null);
  // const [interestRate, setInterestrate] = useState(null);
  // const [loanNumber, setLoanNumber] = useState(null);

  const [showAddress, setshowAddress] = useState(false);

  const [purchasePrice, setpurchasePrice] = useState("");
  const [purchaseDate, setpurchaseDate] = useState("");
  konsole.log("purchaseDate", purchaseDate);

  const [OwnerTypes, setOwnerTypes] = useState([]);
  const [ownerTypeId, setownerTypeId] = useState("");
  const [ownerTypeIdValue, setownerTypeIdValue] = useState([]);
  const [assetOwenerss, setassetOwenerss] = useState([]);

  const [todayValue, settodayValue] = useState("");
  const [balance, setbalance] = useState("");
  const [agingAssetCatId, setagingAssetCatId] = useState("3");
  const [nameOfInstitution, setnameOfInstitution] = useState("");

  konsole.log("OwnerTypesOwnerTypes", OwnerTypes);

  const [addressId, setaddressId] = useState("");
  const [addressLabel, setaddressLabel] = useState("Address");
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");
  const [zipcode, setzipcode] = useState("");
  const [country, setcountry] = useState("");
  const [addressTypeId, setaddressTypeId] = useState("");
  const [userRealPropertyId, setuserRealPropertyId] = useState("");

  const [EditAddress, setEditAddress] = useState("");
  const [realstateaddress, setrealstateaddress] = useState(false);

  const [liabilities, setliabilities] = useState([]);
  const [liabilitiesjson, setliabilitiesjson] = useState([]);
  const [liabitiestypeId, setliabitiestypeId] = useState("");
  const [renderpage, setrederpage] = useState(false);

  const [showaddlenders, setshowaddlenders] = useState(false);
  const [addeditlenderType, setaddeditlenderType] = useState("");
  konsole.log("jsonforaddlenders", addeditlenderType, liabilitiesjson);
  const [UserAgingAssests, setUserAgingAssests] = useState([]);
  const [updateOwnerData, setupdateOwnerData] = useState([]);
  const[disable,setdisable]=useState(false)
  const [outstandingBalance, setOutstandingbalance] = useState(null);
  const [paymentAmount, setpaymentAmount] = useState(null)
  const [interestRate, setInterestrate] = useState(null);
  const [loanNumber, setLoanNumber] = useState(null);
  const [newAddres, setNewaddres] = useState([])
  const [addressData, setAddressdata] = useState("")
  const [getAddres, setgetAddres] = useState([])
  const[saveNupdate,setsaveNupdate]=useState(false)
  const addressdataRef = useRef(null)
  const[jointPercentageForPrimary,setJointPercentageForPrimary]=useState(0)
  const[jointPercentageForSpouse,setJointPercentageForSpouse]=useState(0)
  const[quesReponse,setQuesResponse]=useState(null)
  //--------------------------------------------------------------------------------------------------------------------------------------------

  //---------------------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
    let loggeduserId = sessionStorage.getItem("loggedUserId");
    setuserId(newuserid);
    setloggedUserId(loggeduserId);
    fetchownertypes(newuserid);
    fetchLiabilities();
    fetuseragingassets(newuserid);
  }, []);

  useEffect(() => {
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getPreconditionType + "3",
      "",
      (res, req) => {
        props.dispatchloader(false);
        if (res) {
          konsole.log("resres", res);
          setPreConditionTypes(res.data.data);
        } else {
          // konsole.log("err", err);
        }
      }
    );
  }, []);

  useEffect(() => {
    let data = PreConditionTypes.filter(
      (item) => item.value == agingAssetTypeId
    );
    setPreConditionTypesValue(data);
    if (agingAssetTypeId == "20" && update==false) {
      // fetchSavedAddress(userId);
      props.dispatchloader(false)
      konsole.log(userId,addressdataRef,"userIduserIduserIduserIduserId")
      props.dispatchloader(false)
    addressdataRef.current.getByUserId(userId)
    }
    else {
        // setaddressId("")
        // setaddressLabel("Address")
        // setAddressdata("")
        // addressdataRef.current.isEmpty()
        konsole.log(userId,addressdataRef,"userIduserIduserIduserIduserId")

        props.dispatchloader(false)

    }
  }, [agingAssetTypeId]);
  useEffect(() => {
    let data = OwnerTypes.filter(
      (item) => item.value.toLowerCase() == ownerTypeId.toLowerCase()
    );
    setownerTypeIdValue(data);
  }, [ownerTypeId]);
  //
  //---------------------------------------------------------------------------------------------------------------------------------------------

  const fetchSavedAddress = (userId) => {
    if(!isNotValidNullUndefile(userId))return;
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getAllAddress + userId, "", (response, err) => {
        props.dispatchloader(false);
        if (response) {
            let responseData = response.data.data
         
            setAddressdata(responseData.addresses[0]?.addressLine1)
            setNewaddres(responseData.addresses[0])
            setgetAddres(responseData.addresses)
        
          const addressResponseForUser = response.data.data.addresses;
          if (addressResponseForUser.length > 0) {
            const primaryAddress =
              addressResponseForUser.filter(
                (item) => item.addressTypeId == 1
              ) ?? [];
            if (primaryAddress.length > 0) {
              getResponseAddressId(primaryAddress[0]);
            }
          }
        } else {
          konsole.log("errerr", err);
        }
      }
    );
  };

  //---------------------------------------------------------------------------------------------------------------------------------------------

  const fetchownertypes = (userId) => {
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getFileBelongsToPath + `?ClientUserId=${userId}`,"",(res, err) => {
        props.dispatchloader(false);
        if (res) {
          konsole.log("res", res);
          const responseMap = res.data?.data?.map((item) => {
            return {
              value: item.fileBelongsTo, label: item.fileBelongsTo == "JOINT" ? "JOINT"  : $AHelper.capitalizeAllLetters(item.belongsToMemberName)};
          });
          setOwnerTypes(responseMap);
        } else {
          konsole.log("err", err);
        }
      }
    );
  };

  //---------------------------------------------------------------------------------------------------------------------------------------------
  const handleshowAddress = () => {
    setshowAddress(!showAddress);
  };
  const getResponseAddressId = (addressData) => {
    let addressline1 =
      addressData.addressLine1 +
      " " +
      addressData.addressLine2 +
      " " +
      addressData.addressLine3 +
      " " +
      addressData.city +
      " " +
      addressData.state +
      " " +
      addressData.country;
    setaddressId(addressData?.addressId);
    setaddressLabel(addressline1);
  };

  const InvokeEditAddress = () => {
    setEditAddress(EditAddress);
    setrealstateaddress(true);
    handleshowAddress();
  };
  //---------------------------------------------------------------------------------------------------------------------------------------------
  const liabilitycheckjson = (value, index) => {
    return {
      value: value,
      isActive: false,
      index: index,
      lenderuserid: "",
      lendername: "",
      userLiabilityId: "",
    };
  };
  

  const deptAgainstCheckbox = (e, index) => {
    setrederpage(!renderpage);
    let checked = e.target.checked;
    let checkid = e.target.id;
    liabilitiesjson[index].isActive = checked;
    
    if(!checked){
      setlanderData(liabilitiesjson[index])
    }
    setrederpage(!renderpage);
  };

  //---------------------------------------------------------------------------------------------------------------------------------------------
  const [addlendersIndex, setaddlendersIndex] = useState("");

  const Addlendersdetails = (index) => {
  //  setLoanNumber(null)
  //  setInterestrate(null)
  //  setOutstandingbalance(null)
    setaddlendersIndex(index);
    let lendersType =isNotValidNullUndefile(  liabilitiesjson[index].lenderuserid)? "Edit" : "Add";
    konsole.log("lendersType", lendersType);
    setaddeditlenderType(lendersType);
    konsole.log("addlendersIndex", index);
    setshowaddlenders(!showaddlenders);
  };

  const showrealEstateAddLenders = () => {
    setshowaddlenders(!showaddlenders);
  };
  //--------------------------------------------------POST API-------------------------------------------------------------------------------------------

  const validate = () => {
    let nameError = "";
    let newAddres = addressdataRef?.current?.state;
    konsole.log("nsfkjjks", agingAssetTypeId, newAddres)
    // debugger

    // console.log("aaaaaaaaderss",addressdataRef?.current?.state)
    // console.log("consitionsss",!newAddres , !newAddres?.addressLine1 , (!newAddres?.zipCode) , !newAddres?.city , !newAddres?.country , !newAddres?.state)
    if (isNotValidNullUndefile(addressdataRef?.current?.state?.addressLine1) && addressdataRef?.current?.validate(newAddres) == false) {
      // nameError = "Please enter the correct address.";
      return false;
    }
    if(isNotValidNullUndefile(addressdataRef?.current?.state?.addressLine1) == false && agingAssetTypeId == "20") {
      nameError = "Primary home address cannot be blank";
    }
    if (agingAssetTypeId == "") {
      nameError = "Description of Property cannot be blank";
    }
    if (ownerTypeId == "") {
      nameError = "Owner type cannot be blank";
    }
    // if(newAddres == null || newAddres == undefined || newAddres == ""){
    //   nameError = "Address cannot be blank";
    // }
    if(liabilitiesjson.some((e)=>e.isActive == true && (    e.lenderuserid == '' || e.lenderuserid == undefined || e.lenderuserid == null))){
      toasterShowMsg('Please add the debt related details against the property', "Warning");
        return false;
    }
    if (nameError) {
      toasterShowMsg(nameError, "Warning");
      return false;
    }
    return true;
  };
  const postAddAddressdata = async (Another)=>{
    validate() &&  postAddAddress(Another)
  }
  const postAddAddress =  (method) => {
      if(isNotValidNullUndefile(landerData)){
        deleteLander()
      }
    let addressIds = addressdataRef?.current?.state?.prevAddressId;
    // debugger
    if(agingAssetTypeId == "20") { // all primary home logic
      oldAddressAPIs(method, addressIds);
    } else { // other options logic
      setsaveNupdate(true) 
      props.dispatchloader(true);
      let { lattitude, longitude, addressLine1, addressLine2, state, county, countyRefId, zipCode, city, country, prevAddressId, loggedUserId } = addressdataRef?.current?.state;
      let addressJson = { addressTypeId: 1,  lattitude, longitude, addressLine1, addressLine2, state, county, countyRefId, zipCode, city, country, addressId: prevAddressId, loggedUserId }
      upsertUnmappingAddress((!addressIds || agingAssetTypeIdLast == "20") ? "POST" : "PUT", addressJson, userId)
      .then((res) => {
        if(res == "err") konsole.log('postaddressAdd', err);
        else handleAgingassetsubmit(res.data?.data?.addressId, method)
      })
      .catch((err) => konsole.log('postaddressAdd', err))
      .finally(() => props.dispatchloader(false))
    }
  }


  const oldAddressAPIs = (method, addressIds) => {
    if (addressIds == ''){
          setsaveNupdate(true) 
      let { lattitude, longitude, addressLine1, addressLine2, state, county, countyRefId, zipCode, city, country, prevAddressId, loggedUserId } = addressdataRef?.current?.state;
    let ZipCde=zipcode || newAddres.zip
    let jsonObj={ // object for save
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
    konsole.log('jsonObj',method,jsonObj,newAddres)
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi('POST',$Service_Url.postAddAddress,jsonObj,(res,err)=>{
      if(res){
        konsole.log('postaddressAdda',res)
        props.dispatchloader(false);
        addressIds = res.data?.data?.addresses[0].addressId
        handleAgingassetsubmit(addressIds,method)
      }else{
        konsole.log('postaddressAdd',err)
      }
    })
    }else{
      addressdataRef.current.upsertAddress(loggedUserId,addressTypeId || 1)
      if (!isNotValidNullUndefile(addressdataRef?.current?.state?.addressLine1)) {
        handleAgingassetsubmit(null,method)
      }else{
        handleAgingassetsubmit(addressIds,method)
      }
    }
  }


  const handleAgingassetsubmit = (addressId,Another) => {
  
    let purchaseDatedate;
   if ( purchaseDate !== "" && purchaseDate !== null && purchaseDate !== undefined) {
      purchaseDatedate = $AHelper.getFormattedDate(purchaseDate);
    } else {
      purchaseDatedate = purchaseDate;
    }
    let isRealPropertys = [];
    let isDebtAgainstProperty = liabilitiesjson.some((item) => item.isActive == true);
    let jsonobjRealProperty = {
      addressId:addressId,
      purchasePrice: purchasePrice,
      purchaseDate: purchaseDatedate,
      value: todayValue,
      isDebtAgainstProperty: isDebtAgainstProperty,
      userRealPropertyId: userRealPropertyId,
    };
    if (update == true) {
      jsonobjRealProperty["userRealPropertyId"] = userRealPropertyId;
    }
    isRealPropertys.push(jsonobjRealProperty);

    let assetOwners = [];

    if (update == true) {
      const assetOwn = OwnerTypes.filter((item) => item.value !== "JOINT");
      let assetOwnersdata = assetOwn.map((item) => {
        // konsole.log("itemitem323",item)
        return {
          ownerUserId: item.value,
          OwnerUserName: "OwnerUserName",
          isActive: true,
        };
      });
      let updatupdateOwnerData = updateOwnerData;
      // konsole.log("ownerTypeId34343",ownerTypeId,updateOwnerData)
// 
      if (ownerTypeId == "JOINT" || ownerTypeId == "Joint") {
        // konsole.log("updatupdateOwnerDataupdatupdateOwnerData",updatupdateOwnerData,assetOwnersdata)
        for (let i = 0; i < updatupdateOwnerData.length; i++) {
          for (let [index, item] of assetOwnersdata.entries()) {
            // console.log("sde4343ed",updatupdateOwnerData[i].ownerUserId.toLowerCase(),assetOwnersdata[index].ownerUserId.toLowerCase())
            if (
              updatupdateOwnerData[i].ownerUserId.toLowerCase() ==
              assetOwnersdata[index].ownerUserId.toLowerCase()
            ) {
              // console.log(" assetOwnersdata[index]", assetOwnersdata)
              assetOwnersdata[index]["agingAssetOwnerId"] =updatupdateOwnerData[i].agingAssetOwnerId;
              assetOwnersdata[index].OwnerUserName =updatupdateOwnerData[i].ownerUserName; 
            }
          }
        }
        assetOwners = assetOwnersdata.map((item)=>{
          let ownerspercentage=(((item.ownerUserId).toLowerCase())==userId)?jointPercentageForPrimary:jointPercentageForSpouse
            // console.log("item",item)
            return {...item,ownerPer:ownerspercentage}
        });
        // console.log("assetOwnersdata32424",assetOwners)
      } 
      
      else {
        if (
          updatupdateOwnerData.length == 1 &&
          updatupdateOwnerData[0].ownerUserId.toLowerCase() ==
            ownerTypeId.toLowerCase()
        ) {
          assetOwnersdata = updatupdateOwnerData;
        } else {
          for (let [index, item] of assetOwnersdata.entries()) {
            if (item.ownerUserId.toLowerCase() == ownerTypeId.toLowerCase()) {
              assetOwnersdata[index].isActive = true;
              if (updatupdateOwnerData.length !== 1) {
                assetOwnersdata[index]["agingAssetOwnerId"] =
                  updatupdateOwnerData[1].agingAssetOwnerId;
              }
            } else {
              assetOwnersdata[index].isActive = false;
              assetOwnersdata[index]["agingAssetOwnerId"] =
                updatupdateOwnerData[0].agingAssetOwnerId;
            }
          }
        }

        assetOwners = assetOwnersdata;
      }
    } else {
      if (ownerTypeId !== "JOINT") {
          assetOwners = [{ 
          ownerUserId: ownerTypeId,
         }];
      } else {
        const assetOwn = OwnerTypes.filter((item) => item.value !== "JOINT");
        // console.log("assetOwn",assetOwn)
        assetOwners = assetOwn.map((item) => {
          const itemId=(item.value).toLowerCase()
          let ownersPercentage=(userId==itemId)?jointPercentageForPrimary:jointPercentageForSpouse
          // console.log("itemprimrryy",(item.value).toLowerCase(),"----",userId)
          return { 
            ownerUserId: item.value,
            ownerPer:ownersPercentage,  
          };
        });
      }
    }

    let totalinuptdata = {
      userId: userId,
      asset: {
        agingAssetTypeId: agingAssetTypeId,
        ownerTypeId: 1, //REMOVE LATER
        nameOfInstitution: nameOfInstitution,
        agingAssetCatId: agingAssetCatId,
        balance: balance || 0,
        assetDocuments: [],
        assetBeneficiarys: [],
        isRealPropertys: isRealPropertys,
        assetOwners: assetOwners,
        isActive: true,
        quesReponse:quesReponse
      },
    };
    if (update == true) {
      totalinuptdata.asset["updatedBy"] = userId;
      // totalinuptdata.asset["assetOwners"] = assetOwenerss
      totalinuptdata.asset["userAgingAssetId"] = userAgingAssetId;
      totalinuptdata.asset["agingAssetCatId"] = agingAssetCatId;
      totalinuptdata.asset["maturityYear"] = 0;
    } else {
      totalinuptdata.asset["createdBy"] = loggedUserId;
      // totalinuptdata.asset["assetOwners"] = assetOwners
    }

    konsole.log("postUseragingAsset", JSON.stringify(totalinuptdata));
    konsole.log("jsontotalinuptdata", totalinuptdata);

    let method = "POST";
    let url = $Service_Url.postUseragingAsset;
    if (update == true) {
      method = "PUT";
      url = $Service_Url.putUpdateUserAgingAsset;
    }

  
      setdisable(true)
      props.dispatchloader(true);
    
      $CommonServiceFn.InvokeCommonApi(method,url,totalinuptdata,(response, err) => {
          props.dispatchloader(false);
          setdisable(false)
          if (response) {
            
             let userRealPropertyId =
              response.data.data?.isRealPropertys[0]?.userRealPropertyId;
            let assetResponse = response.data.data;
            if (agingAssetTypeId == "999999") {
              realPropertyRef.current.saveHandleOther(
                assetResponse.userAgingAssetId
              );
            }
            if (ownerTypeId == "999999") {
              ownerRef.current.saveHandleOther(assetResponse.userAgingAssetId);
            }

            let isDebtAgainstProperty = liabilitiesjson.some(
              (item) => item.isActive == true
            );
            let filterLiabilities = liabilitiesjson.filter(
              (item) =>
                item.isActive == true ||
                (item.userLiabilityId !== "" &&
                  item?.userLiabilityId !== undefined &&
                  item?.userLiabilityId !== null)
            );
            if (isDebtAgainstProperty == true) {
              for (let [index, item] of filterLiabilities.entries()) {
                let jsonobj = {
                  userRealPropertyId: userRealPropertyId,
                  value: item?.value,
                  lenderuserid: item?.lenderuserid,
                  lendername: item?.lendername,
                  interestRatePercent: item?.interestRatePercent,
                  loanNumber: item?.loanNumber,
                  outstandingBalance: item?.outstandingBalance,
                  paymentAmount: item?.paymentAmount,
                  filterLiabilities: filterLiabilities,
                  index: index,
                  userLiabilityId: item?.userLiabilityId,
                  isActive: item?.isActive,
                };
                konsole.log("jsonobjjsonobj ", jsonobj, filterLiabilities);
                postUserLiabilities(jsonobj,Another);
                setliabilitiesjson([])
                fetchLiabilities()
              }
            } else {
              if (update !== true) {
                AlertToaster.success("Data saved successfully");
                fetuseragingassets(userId)
                setsaveNupdate(false)
                // toasterShowMsg("Saved Successfully", "Success")
              } else {
                AlertToaster.success("Data updated successfully");
                fetuseragingassets(userId)
                // toasterShowMsg("Update Successfully", "Success")
              }
            }
            if(Another!='Another'){
              props?.handlerealproppopShow();
              addressdataRef.current.resetAddress()
              }else{
                addressdataRef.current.resetAddress()
              }
          } else {
    
            toasterShowMsg(Msg.ErrorMsg, "Warning");
            konsole.log("postUseragingAsseterr", err);
            setdisable(false)
            addressdataRef.current.resetAddress()
          }
        }
      );
    
      
    
    


  };

  const postUserLiabilities = (jsonobj,Another) => {
    props.dispatchloader(true);
    konsole.log("jsonobjjsonobj12", jsonobj);
    let liableinput = {
      liabilityTypeId: 6,
      liabilityId: jsonobj?.value,
      userRealPropertyId: jsonobj?.userRealPropertyId,
      nameofInstitutionOrLender: jsonobj?.lendername,
      lenderUserId: jsonobj?.lenderuserid,
      outstandingBalance :jsonobj?.outstandingBalance,
      paymentAmount :jsonobj?.paymentAmount,
      loanNumber : jsonobj?.loanNumber,
      interestRatePercent : jsonobj?.interestRatePercent,
      isActive: jsonobj.isActive,
      // "userLiabilityId":jsonobj?.userLiabilityId
    };
    var apiurl = $Service_Url.postAddLiability;
    var method = "POST";
    if (
      jsonobj?.userLiabilityId !== "" &&
      jsonobj?.userLiabilityId !== null &&
      jsonobj?.userLiabilityId !== undefined
    ) {
      liableinput["userLiabilityId"] = jsonobj?.userLiabilityId;
      liableinput["updatedBy"] = loggedUserId;
      apiurl = $Service_Url.putAddLiability;
      method = "PUT";
    } else {
      liableinput["createdBy"] = loggedUserId;
    }

    let totalinput = {
      userId: userId,
      liability: liableinput,
    };
    //------------------------------------------

    konsole.log("jaonobj2", JSON.stringify(totalinput));
    konsole.log("apiurl", apiurl, method);

    // ----------------------
    konsole.log(" postAddLiabilityres  ", JSON.stringify(totalinput));
       
    $CommonServiceFn.InvokeCommonApi(method, apiurl, totalinput, (res, err) => {
      props.dispatchloader(false);
      if (res) {
      //  setLoanNumber(null)
      //  setInterestrate(null)
      //  setOutstandingbalance(null)
        konsole.log("postAddLiabilityres", res);
        konsole.log(
          "jsonobjjosnnsnsn",
          jsonobj?.index,
          jsonobj.filterLiabilities.length
        );
        if (jsonobj?.index == jsonobj.filterLiabilities?.length - 1) {
          if (update !== true) {         
            AlertToaster.success("Data saved successfully");
            fetuseragingassets(userId)
            // toasterShowMsg("Saved Successfully", "Success");
          } else {
            AlertToaster.success("Data updated successfully");

            // toasterShowMsg("Update Successfully", "Success");
            fetuseragingassets(userId)
          }

          props.dispatchloader(false);
          if(Another!='Another'){
          // props?.handlerealproppopShow();
          }
        }
      } else {
        konsole.log("postAddLiability", err);
        if (err.data.staus == "404") {
          if (update !== true) {
            AlertToaster.success("Data saved successfully");
            fetuseragingassets(userId)
            // toasterShowMsg("Saved Successfully", "Success");
            // props?.handlerealproppopShow();
          } else {
            AlertToaster.success("Data updated successfully");
            fetuseragingassets(userId)
            // toasterShowMsg("Update Successfully", "Success");
            // props?.handlerealproppopShow();
          }
        }
        props.dispatchloader(false);
      }
    });
  };

  //---------------------------------------------------------------------------------------------------------------------------------------------

  const fetuseragingassets = (userid) => {
  
    konsole.log("realstates");
    props.dispatchloader(true);
    userid = userid;
    let address = [];
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getUserAgingAsset + userid,
      "",
      async (response) => {
        props.dispatchloader(false);
        if (response) {
       
          let array = response.data.data.filter(
            (v, j) => v.agingAssetCatId == "3"
          );
       
          for (let i = 0; i < array.length; i++) {
            konsole.log( "dddddDDRESSId", array, response.data.data.filter((v, j) => v.agingAssetCatId == "3"));

            console.log("isRealPropertysisRealPropertys",array[i],array[i].isRealPropertys)

            if(array[i].isRealPropertys.length>0){
              const addressResponse = await fetchAddreesswithAddressId(array[i].isRealPropertys[0]?.addressId);
              array[i].isRealPropertys[0].address = addressResponse;
            }
            setpagerender(!pagerender);
          }
          setpagerender(!pagerender);
          setUserAgingAssests(array);
          // setupdateOwnerData([]);
          // setupdate();
          setownerTypeId("");
          // setassetOwenerss([]);
          setagingAssetTypeId("");
          setagingAssetTypeIdLast("");
          // setagingAssetCatId("");
          // setaddressLabel("Address");
          setpurchasePrice("");
          settodayValue("");
          setpurchaseDate("");
          // setNewaddres('')
          setAddressdata('')
          setQuesResponse(null)
          // setaddressId("");
          // setEditAddress();
          // setaddressTypeId();
          // setcity();
          // setcountry();
          // setstate();
          // setzipcode();
          // setuserAgingAssetId("");
          // setuserRealPropertyId("");
        }
      }
    );
  };

  const fetchAddreesswithAddressId = (addressId) => {
    return new Promise((resolve, reject) => {
      if(!addressId) return resolve("null");
      props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi(
        "GET",
        $Service_Url.getAddressByaddressID + addressId,
        "",
        (response) => {
          props.dispatchloader(false);
          if (response) {
            konsole.log("address get from pai", response.data.data);
            resolve(response.data.data);
          } else {
            resolve("null");
          }
        }
      );
    });
  };

 
  //---------------------------------------------------------UPDATE-BTN-----------------------------------------------------------------------------------
  // const additionalVlaues =(data,index)=>{
  //  console.log("jhkusdyhgkssdgk",data,index)
  // setOutstandingbalance(data[index].outstandingBalance)
  // setInterestrate(data[index].interestRatePercent)
  // setLoanNumber(data[index].loanNumber)
  // }
  const updateRealEstate = (asset) => {
    konsole.log(asset,"assetassetassetassetasset")
    // setAddressdata(asset.isRealPropertys[0]?.address.addressLine1)
    // setNewaddres(asset.isRealPropertys[0]?.address)
    // setgetAddres(asset.isRealPropertys[0]?.address)
    addressdataRef.current.resetAddress()
    addressdataRef.current.fetchAddreesswithAddressId(asset.isRealPropertys[0]?.address.addressId)
    fetchLiabilities();
    
    // let ownerTypeIdd=
    let ownertypeid =
      asset.assetOwners.length == 2
        ? "Joint"
        : asset.assetOwners.length == 1
        ? asset.assetOwners[0].ownerUserId
        : "";
    let addresslineone = asset.isRealPropertys[0]?.address?.addressLine1;
    let purchaseDate =
      asset.isRealPropertys[0]?.purchaseDate !== null
       ? new Date(asset.isRealPropertys[0]?.purchaseDate)
       : null;

       asset.assetOwners.map((item)=>{
        if(item.ownerUserId==userId){
          setJointPercentageForPrimary(item.ownerPer)}
        else{
            setJointPercentageForSpouse(item.ownerPer)
        }
       })
    setupdateOwnerData(asset.assetOwners);
    setupdate(true);
    setownerTypeId(ownertypeid);
    setassetOwenerss(asset.assetOwners);
    setagingAssetTypeId(asset.agingAssetTypeId);
    setagingAssetTypeIdLast(asset?.agingAssetTypeId);
    setagingAssetCatId(agingAssetCatId);
    setaddressLabel(addresslineone);
    setpurchasePrice(asset.isRealPropertys[0]?.purchasePrice);
    settodayValue(asset.isRealPropertys[0]?.value);
    setpurchaseDate(purchaseDate);
    setaddressId(asset.isRealPropertys[0]?.address?.addressId);
    setEditAddress(asset.isRealPropertys[0]?.address);
    setaddressTypeId(asset.isRealPropertys[0]?.address?.addressTypeId);
    setcity(asset.isRealPropertys[0]?.address?.city);
    setcountry(asset.isRealPropertys[0]?.address?.country);
    setstate(asset.isRealPropertys[0]?.address?.state);
    setzipcode(asset.isRealPropertys[0]?.address?.zipcode);
    setuserAgingAssetId(asset.userAgingAssetId);
    setuserRealPropertyId(asset.isRealPropertys[0]?.userRealPropertyId);
    let userRealPropertyId = asset.isRealPropertys[0]?.userRealPropertyId;
    getLiabilitiesRealProperty(userRealPropertyId);
    setQuesResponse(asset.quesReponse)
  };

  const fetchLiabilities = () => {
   
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getLiabilities + 6,
      "",
      (res, err) => {
        props.dispatchloader(false);
        if (res) {
          konsole.log("res4354543", res);
          let Arrayforjson = [];
          for (let [index, value] of res.data?.data.entries()) {
            let data = liabilitycheckjson(value?.value, index);
            Arrayforjson.push(data);
          }
          setliabilities(res.data.data);
          setliabilitiesjson(Arrayforjson);
          // konsole.log("ArrayforjsonArrayforjson",Arrayforjson)
        } else {
          konsole.log("getLiabilitieserr", err);
        }
      }
    );
  };

  const getLiabilitiesRealProperty = (userRealPropertyId) => {
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getUserLiabilityByUserRealPropertyId +
        userId +
        `/${userRealPropertyId}`,
      "",
      (res, err) => {
        
        props.dispatchloader(false);
        if (res) {
          let response = res.data.data.liability;
          $CommonServiceFn.InvokeCommonApi(
            "GET",
            $Service_Url.getLiabilities + 6,
            "",
            (res, err) => {
              props.dispatchloader(false);
              if (res) {
                konsole.log("res4354543", res);
                let Arrayforjson = [];
                for (let [index, value] of res.data?.data.entries()) {
                  let data = liabilitycheckjson(value?.value, index);
                  Arrayforjson.push(data);
                }
                setliabilities(res.data.data);
                setliabilitiesjson(Arrayforjson);
                let liabilitiesjsondata = Arrayforjson;
                    for (let item of response) {
                      for (let item2 = 0; item2 < liabilitiesjsondata.length; item2++) {
                        if (item.liabilityId == liabilitiesjsondata[item2].value)
                        {
                          liabilitiesjsondata[item2].lenderuserid = item?.lenderUserId;
                          liabilitiesjsondata[item2].paymentAmount = item.paymentAmount;
                          liabilitiesjsondata[item2].outstandingBalance = item?.outstandingBalance;
                          liabilitiesjsondata[item2].interestRatePercent = item?.interestRatePercent;
                          liabilitiesjsondata[item2].loanNumber = item?.loanNumber;
                          liabilitiesjsondata[item2].lendername =item?.nameofInstitutionOrLender;
                          liabilitiesjsondata[item2].isActive = item?.isActive;
                          liabilitiesjsondata[item2].userLiabilityId = item?.userLiabilityId;  
                        }
                      }
                    }
                    setliabilitiesjson(liabilitiesjsondata);
                    konsole.log("getUserLiabilityByUserRealPropertyIdres",response, liabilitiesjsondata)
                    setrederpage(!renderpage);

              } else {
                konsole.log("getLiabilitieserr", err);
              }
            }
          );    
        } else {
          konsole.log("getUserLiabilityByUserRealPropertyIderr", err);
        }
      }
    );
  };
  //---------------------------------------------------------------------------------------------------------------------------------------------

  //---------------------------------------------------------------------------------------------------------------------------------------------

  const toasterShowMsg = (message, type) => {
    setdata({
      open: true,
      text: message,
      type: type,
    });
  };

  const deleteUserData =  async (assets) =>{
    const req = await confirm(true, "Are you sure? you want to delete", "Confirmation");
    if (!req) return;
    props.dispatchloader(true);

    konsole.log("assetsassets", assets);
    let jsonobj = {
      userId: userId,
      asset: {
        agingAssetCatId: assets.agingAssetCatId,
        agingAssetTypeId: assets.agingAssetTypeId,
        ownerTypeId: assets.ownerTypeId,
        maturityYear: assets.maturityYear,
        userAgingAssetId: assets.userAgingAssetId,
        updatedBy: loggedUserId,
        nameOfInstitution: assets?.nameOfInstitution,
        isActive: false,
        assetDocuments: [],
        assetOwners: assets.assetOwners,
        assetBeneficiarys: [],
        isRealPropertys: [],
      },
    };

    $CommonServiceFn.InvokeCommonApi(
      "PUT",
      $Service_Url.putUpdateUserAgingAsset,
      jsonobj,
      (res, err) => {
        props.dispatchloader(false);
        if (res) {
          konsole.log("resresDeleet", res);
          AlertToaster.success("Data Deleted Successfully");
          deleteUserLiability(assets?.isRealPropertys[0]?.userRealPropertyId,userId,loggedUserId)
          fetuseragingassets(userId);
        } else {
          konsole.log("errerre", err);
          setdisable(false)
        }
      }
    );
}

const deleteUserLiability = async (userLiabilityId,userid,loggedUserId) => {
  $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getUserLiabilityByUserRealPropertyId + userId +`/${userLiabilityId}`,"",(res, err) => {
      konsole.log(res,"resdatadataliabilities")
      res?.data?.data?.liability?.length > 0 && res?.data?.data?.liability?.map((liability)=>{
      if(liability.userLiabilityId != ""){
      props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteUserLiability + `?UserId=${userid}&UserLiabilityId=${liability?.userLiabilityId}&DeletedBy=${loggedUserId}`, "", (response, err) => {
      props.dispatchloader(false);
      if (response) {
          konsole.log("responseDeleteBuss", response)
      } else {
          konsole.log("deleteErrorr", err)
      }
      });
      }
    });
})
}
const deleteLander =()=>{
  $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteUserLiability + `?UserId=${userId}&UserLiabilityId=${landerData?.userLiabilityId}&DeletedBy=${loggedUserId}`, "", (response, err) => {
    // props.dispatchloader(false);
    if (response) {
        konsole.log("responseDeleteBuss", response)
    } else {
        konsole.log("deleteErrorr", err)
    }
    });

}

 const addressDetails = (attrvalue) => {
    setNewaddres(attrvalue)
    setAddressdata(attrvalue?.addressLine1)
  };

  const changeDescriptionOfProperty=(event)=>{
    addressdataRef?.current?.resetAddress()
    setagingAssetTypeId(event?.value)
    if(event?.value == "20") {
      props.dispatchloader(true)
      addressdataRef?.current?.getByUserId(userId)
      props.dispatchloader(false)
    }
  }

  const calculateSpousePercentage = (value, name) => {
    if (name === "primaryJoint") {
        setJointPercentageForPrimary(value);
        setJointPercentageForSpouse((isNaN(value) || value==0) ? 0 : 100 - value);
    } else {
        setJointPercentageForPrimary((isNaN(value) || value==0) ? 0 : 100 - value);
        setJointPercentageForSpouse(value);
    }
}

const getQuestionResponse=(value)=>{
  // konsole.log("vadsdsddlue",value)
  if(value){
    const jsonString = JSON.stringify(value);
    setQuesResponse(jsonString)
  }
}

  //---------------------------------------------------------------------------------------------------------------------------------------------
  return (
    <>
      <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            max-width: 57.25rem;
            margin: 1.75rem auto;
          }
        `}</style>

      <Modal
        show={props.show}
        size="lg"
        centered
        onHide={props.handlerealproppopShow}
        animation="false"
        backdrop="static"
        enforceFocus={false}
        
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Real Estate</Modal.Title>
        </Modal.Header>
        {(showaddlenders==true) ? 
        <>
          <RealEstateAddLenders
            handleClose={showrealEstateAddLenders}
            show={showaddlenders}
            type={addeditlenderType}
            index={addlendersIndex}
            liabilitiesjson={liabilitiesjson}
            
            
          />
          </> :""
}

        <Modal.Body className="">
          <div className="person-content">
            <Form.Group as={Row}>
              <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                <Select
                  className="w-100 p-0 custom-select"
                  options={PreConditionTypes}
                  onChange={changeDescriptionOfProperty}
                  value={PreConditionTypesValue}
                  placeholder={$AHelper.mandatory("Description of Property")}
                  isSearchable
                />
              </Col>

              {agingAssetTypeId == "999999" && (
                <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                  <Other
                    othersCategoryId={3}
                    userId={userId}
                    dropValue={agingAssetTypeId}
                    ref={realPropertyRef}
                    natureId={userAgingAssetId}
                  />
                </Col>
              )}
            </Form.Group>
            <Form.Group as={Row} className="mb-2">
              <Col xs="12" sm="12" md="12" lg="12">
                {/* <button
                  className="white-btn form-control"
                  onClick={() => InvokeEditAddress("")}
                >
                  {addressLabel}
                </button> */}
          
                <DynamicAddressForm
                 refrencePage='RealEstare' 
                 ref={addressdataRef} 
                 setLoader={props.dispatchloader} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="">
              <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                <CurrencyInput
                  prefix="$"
                  value={purchasePrice}
                  allowNegativeValue={false}
                  className="border"
                  onValueChange={(purchasePrice) =>
                    setpurchasePrice(purchasePrice)
                  }
                  name="purchasePrice"
                  placeholder="Purchase Price"
                  decimalScale="2"
                />
              </Col>
              <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                <DatepickerComponent
                  name="purchaseDate"
                  value={purchaseDate}
                  setValue={(value) => setpurchaseDate(value)}
                  placeholderText="Purchase Date"
                  maxDate={0}
                  minDate="100"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                <Select
                  className="w-100 p-0 custom-select"
                  onChange={(event) => { setownerTypeId(event.value) }}
                  options={OwnerTypes}
                  value={ownerTypeIdValue}
                  isSearchable
                  placeholder={$AHelper.mandatory("Owner")}
                />
              </Col>
              <Col xs="12" sm="12" md="6" lg="6">
                <CurrencyInput
                  prefix="$"
                  value={todayValue}
                  allowNegativeValue={false}
                  className="border"
                  onValueChange={(value) => settodayValue(value)}
                  name="value"
                  placeholder="Today's value"
                  decimalScale="2"
                />
              </Col>
            </Form.Group>

            {( ownerTypeId == "JOINT" ||  ownerTypeId == "Joint") &&
               <>
                <p>Joint Percentage for Primary</p>
                <CurrencyInput
                    suffix="%"
                    className="border w-50 currencyInputPlaceholder"
                    allowNegativeValue={false}
                    maxLength={2}
                    // name="Inflation Percentage"
                    name="Joint Primary Percentage"
                    value={!jointPercentageForPrimary ? 0 : jointPercentageForPrimary} 
                    onValueChange={(value)=>{ calculateSpousePercentage(value,"primaryJoint")}}
                    decimalSeparator="."
                    groupSeparator=""
                    disableGroupSeparators
                    placeholder="Joint percentage for primary"
                  />
                <p>Joint Percentage for Spouse</p>
                  <CurrencyInput
                    suffix="%"
                    maxLength={2}
                    className="border w-50 currencyInputPlaceholder"
                    allowNegativeValue={false}
                    name="Joint Spouse Percentage"
                    value={(!jointPercentageForSpouse ) ? 0 :jointPercentageForSpouse} 
                    onValueChange={(value)=>{ calculateSpousePercentage(value,"spouseJoint")}}
                    decimalSeparator="."
                    groupSeparator=""
                    disableGroupSeparators
                    placeholder="Joint percentage for Spouse"
                  />
             </>
            }             
            <Form.Group as={Row}>
              <Col xs="12" sm="12" md="6" lg="6">
                <Other
                  othersCategoryId={21}
                  userId={userId}
                  dropValue={ownerTypeId}
                  ref={ownerRef}
                  natureId={userAgingAssetId}
                />
              </Col>
            </Form.Group>

            <Col>
            <ExpensesPaidQuestion getQuestionResponse={getQuestionResponse}  quesReponse={quesReponse}/>
            </Col>

            {/*----------------------------------------------------------------------------------------------------------------------------------------------- */}
            <Row className="mt-2 mb-1">
              <p style={{fontWeight:"bold"}}>Debt against the Property</p>
            </Row>

            {liabilities.length > 0 &&
              liabilitiesjson.length > 0 &&
              liabilities.map((items, index) => {
                konsole.log("liabilitiesmap", items, index);
                return (
                  <>
                    <Row className="m-0 p-0" >
                      <Col
                         xs={12} sm={12} md={3}  lg={3}
                        className={`border ${
                          index == 0 ? " border-bottom-0" : index > 0 && index < liabilities.length - 1 ? " border-top-0 border-bottom-0 " : index == liabilities.length - 1 ? "border-top-0 " : ""
                        } `}
                      >
                        <Form.Group as={Row} className="p-1">
                          <Col className="" >
                            <Form.Check
                              className="left-radio"
                              label={items?.label}
                              type="checkbox"
                              id={items?.value}
                              name={items?.items}
                              onChange={(e) => deptAgainstCheckbox(e, index)}
                              checked={
                                liabilitiesjson[index].isActive == true ? true : false
                              }
                            />
                          </Col>
                          {/*
                                                <Col className="mt-2">
                                                    <Form.Control type="text" id={items?.value} />
                                                </Col>
                                                 */}
                        </Form.Group>
                      </Col>
                      <Col lg={5} sm={5} className=" ms-2 ">
                        {liabilitiesjson.length > 0 &&
                        liabilitiesjson[index].isActive == true ? (
                          <Col>
                            <Button
                              style={{
                                border: "none",
                                background: "white",
                                color: "#720C20",
                              }}
                              className="fw-bold"
                              onClick={() => Addlendersdetails(index)}
                            >
                              <u>
                                {liabilitiesjson[index].lenderuserid !== "" &&
                                liabilitiesjson[index].lenderuserid !== null &&
                                liabilitiesjson[index].lenderuserid !==
                                  undefined
                                  ? "Edit"
                                  : "Add"}
                              </u>
                            </Button>
                            {liabilitiesjson[index].lenderuserid !== "" &&
                            liabilitiesjson[index].lenderuserid !== null &&
                            liabilitiesjson[index].lenderuserid !== undefined
                              ? liabilitiesjson[index].lendername.toUpperCase()
                              : ""}
                          </Col>
                        ) : (
                          ""
                        )}
                      </Col>
                    </Row>
                  </>
                );
              })}
          </div>
          <div className="mt-3">
            
      {
        (saveNupdate==true)?
        <Button
        style={{backgroundColor:"#76272b", border:"none"}}
        className="theme-btn float-end"
        // onClick={() => postAddAddressdata()}
        disabled={disable == true ? true : false}
      >
        {update ? "Update" : "Save"}
      </Button>
        :
        <Button
        style={{backgroundColor:"#76272b", border:"none"}}
        className="theme-btn float-end mb-2"
        onClick={() => postAddAddressdata()}
        disabled={disable == true ? true : false}
      >
        {update ? "Update" : "Save"}
      </Button>

      }
      {update ? "":
      <Button
        style={{backgroundColor:"#76272b", border:"none"}}
        className="theme-btn float-end anotherBTn "
        onClick={() => postAddAddressdata('Another')}
        disabled={disable == true ? true : false}>
        Add Another
      </Button>
}
      <Button className='cancel-Button mt-md-0 mt-2' onClick={() => props.handlerealproppopShow()}>Cancel</Button>     
          </div>
        </Modal.Body>
        <Modal.Footer
          // className="border-0"
          style={{ maxHeight: "15vh", overflowY: "auto" }} 
        >
          <div className="table-responsive financialInformationTable">
          {UserAgingAssests.length !== 0 && (
            <Table bordered style={{ overflowY: "scroll" }} >
              <thead className="text-center align-middle">
                <tr>
                  <th>Description of Property</th>
                  <th>Address</th>
                  <th>Purchase Date</th>
                  <th>Purchase Price</th>
                  <th>Today's Value</th>
                  <th>Owner</th>
                  <th>Debt against the property</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {UserAgingAssests.length > 0 &&
                  UserAgingAssests.map((asset, i) => {
                    const assetOwners=removeDuplicate(asset?.assetOwners,'ownerUserId')
                    return (
                      <tr key={i}>
                        <td style={{wordBreak:"break-word"}}>
                          {/* {asset.assetTypeName} */}
                          <OtherInfo othersCategoryId={3} othersMapNatureId={asset.userAgingAssetId} FieldName={asset.assetTypeName} userId={userId}/>
                        </td>
                        <td className="text-center">{asset.isRealPropertys.length >0  && asset.isRealPropertys[0]?.address?.addressLine1 || "-"}</td>
                        <td className="text-center">
                          {asset.isRealPropertys.length >0  && asset.isRealPropertys[0]?.purchaseDate == null  ? "-" : $AHelper.getFormattedDate(  asset.isRealPropertys[0]?.purchaseDate   ) || "-"}
                        </td>
                        <td style={{wordBreak:"break-word", textAlign:'center'}}>
                          {asset && asset.isRealPropertys.length >0  && isNotValidNullUndefile((asset.isRealPropertys[0]?.purchasePrice)) ? $AHelper.IncludeDollars(asset.isRealPropertys[0]?.purchasePrice): "-"}
                        </td>
                        <td style={{wordBreak:"break-word", textAlign:"center"}}>
                          {asset  && asset.isRealPropertys.length >0  && isNotValidNullUndefile((asset.isRealPropertys[0]?.value)) ? $AHelper.IncludeDollars( asset.isRealPropertys[0]?.value): "-"}
                        </td>
                        <td className="text-center">
                          {$AHelper.capitalizeAllLetters(assetOwners.length == 2 ? "Joint" : assetOwners.length == 1 ? assetOwners[0].ownerUserName : "-")}
                        </td>
                        <td>
                          {asset.isRealPropertys.length>0 && asset.isRealPropertys[0].isDebtAgainstProperty == true ? "Yes" : "No"}
                        </td>
                        {/* <td className="d-flex justify-content-around align-items-center"><div className="d-flex gap-2">
                         <p style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => updateRealEstate(asset)}>Edit</p>
                         <span className="cursor-pointer" onClick={() => deleteUserData(asset)}><img src="/icons/deleteIcon.svg" className="h-75 p-0 m-0" alt="g4" /></span>
                         </div>
                        </td> */}
                        <td style={{verticalAlign:"middle"}}>
                        <TableEditAndViewForDecease
                                                    key={i}
                                                    forUpdateValue={asset}
                                                    type='primary'
                                                    actionType='Owner'
                                                    handleUpdateFun={updateRealEstate}
                                                    handleDeleteFun={deleteUserData}
                                                    refrencePage="Real Estate"
                                                    userId={userId}
                                                    memberUserId={assetOwners.length > 0 ? assetOwners[0].ownerUserId : ''}
                                                />
                                                </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RealEstate);
