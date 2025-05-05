import React, { useEffect, useState ,useContext, memo, useRef} from "react";
import konsole from "../control/Konsole";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { $CommonServiceFn } from "../network/Service";
import { $AHelper } from '../control/AHelper'
import { $Service_Url } from "../network/UrlPath";
import PlaceOfBirth from "../PlaceOfBirth";
import { SET_LOADER } from "../Store/Actions/action";
import ContactListComponent from "../ContactListComponent";
import { globalContext } from "../../pages/_app";
import { connect } from "react-redux";
import AlertToaster from "../control/AlertToaster";
import ProfessionalContact from "../ProfessionalContact";
import ProfessSearch from "../professSearch";
import DynamicAddressForm from "../DynamicAddressForm";
import Other from "../asssets/Other";
import Select from "react-select";
import { isNotValidNullUndefile, isUrlValid, removeSpaceAtStart } from "../Reusable/ReusableCom";

function AddnewProfessmembermodal({
  showaddprofessmodal,
  setshowaddprofessmodal,
  professionaltype,
  memberUserId,
  setAddnewprofessmodaldata,
  proType,
  proSerDescType,
  toUpdate,
  getProfessionalByUser,
  userData,
  checkSameProff,
  checkProffsameOrNot,
  dispatchloader
}) {
  konsole.log(professionaltype, "showaddprofessmodalshowaddprofessmodal");
  //   const [form] = Form.useForm();
  const [professtype, setProfesstype] = useState([]);
  const { setdata } = useContext(globalContext)
  const [editmember, setEditmember] = useState()
  //   const loggedUser =commonLib.getObjFromStorage("userLoggedInDetail")?.loggedUserId;
  //   const primaryUser = commonLib.getObjFromStorage( "userPrimaryInDetail");
  const primaryUserId = memberUserId;
  const [professionalUserId, setprofessionalUserId] = useState()
  const [subtenantId, setsubtenantId] = useState(0)
  const [options,setOptions] = useState([
    {
      label: "Email",
      value: 1,
    },
    {
      label: "Text",
      value: 2,
    },
  ])
  const[sameprofess,setSameprofess] = useState(false)
  const[primaryuserid,setprimaryuserid] = useState('')
  const [maritalStatusId, setmaritalStatusId] = useState('')
  const[spouseuserid,setspouseuserid] = useState('')
  const[fname,setFname]=useState('')
  const[mname,setMname]=useState('')
  const[lname,setLname]=useState('')
  const [userId, setuserId] = useState("");
  const [addressdata,setAddressdata] = useState('')
  const [getAddress,setgetAddress] = useState([])
  // const[newAddress,setnewAddress] = useState('')
  const [newAddres, setNewaddres] = useState([])
  const [prevAddressId, setprevAddressId] = useState([])
  const [suite, setsuite] = useState("")
  const [websiteLink, setwebsiteLink] = useState("")
  const [clinicname, setclinicname] = useState("")
  const [clinicnameTypeId, setclinicnameTypeId] = useState("")
  const [clinicnameTypes, setclinicnameTypes] = useState([])
  const [disalebtn,setDisablebtn] = useState(false)
  const professionalcontact = useRef('');
  const professionalAddressRef = useRef('');
  const businessOther = useRef('');
  const [loggedUserId, setloggedUserId] = useState("");

  useEffect(() => {
    fetchBussinessType();
  },[])

  useEffect(() => {
    let maritalStatusId = sessionStorage.getItem("maritalStatusId")
    let primaryuserid = sessionStorage.getItem('SessPrimaryUserId')
    let spouseuserid = sessionStorage.getItem('spouseUserId')
    let subtenantid = sessionStorage.getItem('SubtenantId')
    setsubtenantId(subtenantid)
    setprimaryuserid(primaryuserid)
    setmaritalStatusId(maritalStatusId)
    setuserId(primaryuserid);
    setspouseuserid(spouseuserid)

    konsole.log("vsdhs", userData)
    if(userData != undefined && userData != null && userData != "" && Object.keys(userData).length != 0){
      getProfessionalSecDescfunc('')
      getProfessionalTypeapifunc('');
      if(userData?.addresses?.length > 0){
      setAddressdata(userData?.addresses[0]?.addressLine1)
      }
      setFname(userData?.fName)
      setMname(userData?.mName)
      setLname(userData?.lName)
      if(userData?.professionalUserId){
      setprofessionalUserId(userData?.professionalUserId)
      // fetchSavedAddress(userData?.professionalUserId)
      professionalAddressRef?.current?.getByUserId(userData?.professionalUserId)
      fetchSavedContactDetails(userData?.professionalUserId)
      setclinicname(userData?.businessName)
      setclinicnameTypeId(userData?.businessTypeId)
      setwebsiteLink(userData?.websiteLink)
      }else{
        setEditmember(userData)
        setprofessionalUserId(userData?.userId)
        // fetchSavedAddress(userData?.userId)
        professionalAddressRef?.current?.getByUserId(userData?.userId)
        fetchSavedContactDetails(userData?.userId)
      }
       }
       else{
        getProfessionalSecDescfunc('')
        getProfessionalTypeapifunc('');
        setAddressdata('')
        setFname('')
        setMname('')
        setLname('')
        addmemberfunc(subtenantid)
       }
 
    setDisablebtn(false)
    setSameprofess(checkSameProff == true)
  },[userData, showaddprofessmodal,setshowaddprofessmodal,professionaltype,memberUserId,setAddnewprofessmodaldata, checkSameProff]);

  const getProfessionalSecDescfunc = () => {
  $CommonServiceFn.InvokeCommonApi('GET',$Service_Url.getProfessionalSecDesc,"",((response,error) => {
    dispatchloader(true)
      if(response)
      {konsole.log(response, "getProfessionalSecDescresponse");
      dispatchloader(false);    
      setOptions(response.data.data)   
    }
      else{
        dispatchloader(false)
        konsole.log(error,"error")
      }
    }))
  }


  const getProfessionalTypeapifunc = () => {
    $CommonServiceFn.InvokeCommonApi("Get",$Service_Url.getProfesType,"",((response,error) => {
        dispatchloader(true)
        if(response){
        dispatchloader(false)
        konsole.log(response, "response87");
        setProfesstype(response.data.data);
        if(professionaltype !== ""){
          let professfilter = response.data.data.filter((e) => {
            return e.value == professionaltype
          });
          setProfesstype(professfilter);
        } else {
          setProfesstype(response.data.data);
        }}else{
            dispatchloader(false)
            konsole.log(error,"error")
      }
    }))
  }

  const addmemberfunc = (subtenantId) => {
    let dataobj = {
      subtenantId: subtenantId,
      fName: "fname",
      mName: "mName",
      lName: "lName",
      isPrimaryMember: false,
      memberRelationship: null,
      createdBy: memberUserId,
    };

    $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.postAddMember,dataobj,((response,error)=>{
      dispatchloader(true)
      if(response){
        dispatchloader(false)
            konsole.log(response,"responseaddmember")
        setEditmember(response.data.data.member)
        setprofessionalUserId(response.data.data.member.userId)
        // fetchSavedAddress(response.data.data.member.userId)
        professionalAddressRef?.current?.getByUserId(response.data.data.member.userId)
        fetchSavedContactDetails(response.data.data.member.userId)
        }else{
          dispatchloader(false)
            konsole.log(error,"error")
      }
    }))
  };



  // const fetchSavedAddress = (userid) => {
  //   // this.props.//dispatchloader(true);
  //   userid = userid || this.state.userId;
   
  //   $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getAllAddress + userid,"",(response) => {
  //     dispatchloader(true)
  //       if (response) {
  //         dispatchloader(false)
  //           //  this.props.dispatchloader(false);
  //            konsole.log("responseofsavedaddress",response.data)
  //            setAddressdata( response.data.data.addresses[0]?.addressLine1)
  //            setgetAddress( response.data.data.addresses)
  //            setNewaddres( response.data.data.addresses[0])
  //            setprevAddressId(response.data.data.addresses[0]?.addressId)
  //            setsuite(response.data.data.addresses[0]?.addressLine2 || "")
            
  //       } else {
  //         dispatchloader(false)
  //       //   this.toasterAlert(Msg.ErrorMsg, "Warning");
  //     }
  //   }
  //   );
  // };

  const fetchSavedContactDetails = (userid) => {
    // this.props.//dispatchloader(true);
    userid = userid || this.state.userId;
    
    if(!isNotValidNullUndefile(userid))return;
    $CommonServiceFn.InvokeCommonApi(  "GET",  $Service_Url.getAllContactOtherPath + userid,  "",  (response) => {
      dispatchloader(true)
        if (response) {
          dispatchloader(false)
          //  this.props.dispatchloader(false);
          this.setState({
            ...this.state,
            allContactDetails: response.data.data.contact,
          });
          
          // konsole.log("responseatsav", response);
        } else {
          dispatchloader(false)
        //   this.toasterAlert(Msg.ErrorMsg, "Warning");
      }
    }
    );
  };



  const addressDetails=(value)=>{
    konsole.log(value,"addressvalue")
    setAddressdata(value?.addressLine1 || "")
    setNewaddres(value || [])
  }

  const contactdetails =(value)=>{
    konsole.log(value,"contactvalue")
  }

  const onFinish = async () => {
    // ================= Don't remove these comments ========================
    // if(fname == '' || lname == ''){
      // toasterAlert(`Please enter ${(fname == '')? "first name":"last name"} field.`) 
    if(isNotValidNullUndefile(fname) == false){
      toasterAlert(`Please enter first name field.`) 
      return
    }
    if(validateWebLink(websiteLink, true) != true) return;
    // else if(professionalcontact?.current?.checkvalidation(true)) return;
    // if (professionalAddressRef?.current?.isEmpty()) {
    //   toasterAlert("Address cannot be blank", "Warning")
    //   return;
    // }
    // =====================================================================

    await putprofessusername(professionalUserId);

    setDisablebtn(true)

    // below handling "same as spouse value only"
    if (userData && userData?.professionalUserId) { // this runs when updating old prof.

      let dataobj = {
        userId:userData?.professionalUserId,
        isGenAuth: true,
        isStatus: true,
        isActive: true,
        upsertedBy: sessionStorage.getItem("loggedUserId") || memberUserId,
        proCategories: [
          {
            proCatId: userData?.proCatId,
            proSerDescId: proSerDescType,
            proTypeId: professionaltype,
          }
        ]
      }
      
      postaddProfessionalUserMapping(dataobj, true)
      if(checkSameProff == true && sameprofess == false) {
        checkProffsameOrNot(true)
      }
    } else { // this runs when newly adding prof
      let dataobj = {
        userId: editmember.userId,
        isGenAuth: true,
        isStatus: true,
        isActive: true,
        upsertedBy: sessionStorage.getItem("loggedUserId") || memberUserId,
        proCategories: [
          {
            proCatId: userData?.proCatId || 0,
            proSerDescId: proSerDescType,
            proTypeId: professionaltype,
          }
        ]
      }
      konsole.log("jsonsosos",JSON.stringify(dataobj))
      postaddProfessionalUserMapping(dataobj);
    }
  };

  const postaddProfessionalUserMapping = (dataobj, callgetProfAPI) => {
    dataobj.businessName = clinicname; // adding clinic name
    dataobj.businessTypeId = clinicnameTypeId; // adding clinic type
    dataobj.websiteLink = websiteLink; // adding website link

    if(userData?.proUserId) dataobj.proUserId = userData?.proUserId;

    dispatchloader(true)
  $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.postProfessionalUserMapping,dataobj,((response,error) => {
    if(response){
      dispatchloader(false)
        konsole.log(response,response.data.data[0].userId, "postProfessionalUserMappingresponse");
        // let dataobj = {
        //   createdBy: memberUserId,
        //   professionalUser: {
        //     proTypeId: response.data.data.proSerDescId,
        //     proUserId: response.data.data.proUserId,
        //   },
        //   userId: response.data.data.createdBy,
        // };
        // putprofessusername(response.data.data[0].userId)
        // if(sameprofess==true){
        //   if(response.data.data[0].createdBy == memberUserId){
        //     setAddnewprofessmodaldata({...response.data.data[0],createdBy: dataobj.upsertedBy})
        //   }
        //   if(response.data.data[0].createdBy == spouseuserid){
        //     setAddnewprofessmodaldata(response.data.data[0])
        //   }
        // }else{
        //   setAddnewprofessmodaldata(response.data.data[0])
        // }
        if(clinicnameTypeId == "999999") businessOther?.current?.saveHandleOther(response.data.data[0]?.proUserId);
        if(callgetProfAPI == true) getProfessionalByUser();
        setshowaddprofessmodal(false);
        
        if(toUpdate != true) setAddnewprofessmodaldata({...response.data.data[0], createdBy: memberUserId})
        if(checkSameProff != true && sameprofess == true) {
          setAddnewprofessmodaldata({...response.data.data[0], createdBy: memberUserId != primaryUserId ? primaryUserId : spouseuserid})
        }
      } else {
        dispatchloader(false)
        konsole.log(error, "error")
      }
    }))
  }

  // const addAddress = () => {
  //   if(!newAddres) return;
  //   let { lattitude, longitude, addressLine1,state, county,zipcode, city, country, addressTypeId } = newAddres;
  //   let ZipCde=zipcode || newAddres.zip;
  //   let jsonObj= {
  //     "userId":professionalUserId,
  //     "address": {
  //       "lattitude": lattitude|| " ",
  //       "longitude": longitude || " ",
  //       "addressLine1": addressLine1 || " ",
  //       "addressLine2": suite,
  //       "zipcode":(ZipCde !==undefined && ZipCde !==null )?ZipCde:'',
  //       "county": county || '',
  //       "city": city || " ",
  //       "state": state || " ",
  //       "country": country || " ",
  //       "addressTypeId":addressTypeId || 1 ,
  //       'createdBy':sessionStorage.getItem("loggedUserId")
  //     }
  //   }
  //   konsole.log('jsonObj343434344',jsonObj,newAddres)
  //   $CommonServiceFn.InvokeCommonApi('POST',$Service_Url.postAddAddress,jsonObj,(res,err)=>{
  //     dispatchloader(true)
  //     if(res){
        
  //       konsole.log('postaddressAdda',res)
  //       setDisablebtn(false)
  //       dispatchloader(false)
  //     }else{
  //       dispatchloader(false)
  //       konsole.log('postaddressAdd',err)
  //     }
  //   })
  
  // }

  // const updateAddress = () => {
  //   if(!newAddres) return;
  //   let { lattitude, longitude, addressLine1,state, county,zipcode, city, country, addressTypeId } = newAddres;
  //   let ZipCde=zipcode || newAddres.zip;
  //   let jsonObj= {
  //     "userId":professionalUserId,
  //     "address": {
  //       "lattitude": lattitude|| " ",
  //       "longitude": longitude || " ",
  //       "addressLine1": addressLine1 || " ",
  //       "addressLine2": suite,
  //       "zipcode":(ZipCde !==undefined && ZipCde !==null )?ZipCde:'',
  //       "county": county || '',
  //       "city": city || " ",
  //       "state": state || " ",
  //       "country": country || " ",
  //       "addressTypeId":addressTypeId || 1 ,
  //       "addressId": prevAddressId,
  //       "updatedBy": sessionStorage.getItem("loggedUserId"),
  //       "isActive": true
  //     }
  //   }
  //   konsole.log('jsonObj343434344',jsonObj,newAddres)
  //   $CommonServiceFn.InvokeCommonApi('PUT',$Service_Url.putupdateAddress,jsonObj,(res,err)=>{
  //     dispatchloader(true)
  //     if(res){
        
  //       konsole.log('postaddressAdda',res)
  //       setDisablebtn(false)
  //       dispatchloader(false)
  //     }else{
  //       dispatchloader(false)
  //       konsole.log('postaddressAdd',err)
  //     }
  //   })
  
  // }

  const fetchBussinessType = () => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getBusinessType,
      "",
      (response) => {
        if (response) {
          setclinicnameTypes(response.data.data)
        }
      }
    );
  };

  const handleBusinessTypeChange = (value) => {
    if(value != "999999" && clinicnameTypeId == "999999") {
      businessOther?.current?.setState({othersName: ""});
      setTimeout(() => {
        businessOther?.current?.saveHandleOther(userData?.proUserId || 0);
        setclinicnameTypeId(value)
      }, [100])
    } else {
      setclinicnameTypeId(value)
    }
  }
  
  const postprofessionalapifunc = (dataobj) => {
  $CommonServiceFn.InvokeCommonApi("POST",$Service_Url.postaddprofessionluser,dataobj,((resposnse,error) => {
    if(resposnse){
        konsole.log(resposnse, "resposnse1");
        putprofessusername(resposnse.data.data.professionalUser[0].professionalUserId);
        // setprofessionalUserId(resposnse.data.data.professionalUser[0].professionalUserId)
        
        if(sameprofess==true){
          if(resposnse.data.data.userId == memberUserId){

            setAddnewprofessmodaldata(resposnse.data.data.professionalUser[0])
          }
        }else{
          setAddnewprofessmodaldata(resposnse.data.data.professionalUser[0])
        }
      } else {
        konsole.log(error, "error")
      }
    }))

  };

  /**
   * Handles name, address, contact changes
   * @param {string} professionalUserId 
   */
  const putprofessusername = (professionalUserId) => {
    dispatchloader(true)
    return new Promise((resolve, reject) => {
      let dataobj = {
        fName:fname,
        mName:mname,
        lName:lname,
        birthPlace: null,
        citizenshipId: null,
        dob: null,
        genderId: null,
        isPrimaryMember: false,
        isVeteran: false,
        maritalStatusId: null,
        memberRelationshipVM: null,
        nickName: null,
        noOfChildren: null,
        suffixId: null,
        subtenantId: subtenantId,
        updatedBy: memberUserId,
        userId: professionalUserId,
      };
      $CommonServiceFn.InvokeCommonApi("PUT",$Service_Url.putUpdateMember,dataobj,((resposnse,error) => {
        // dispatchloader(true)
        if(resposnse){
          // dispatchloader(false)
          // props.dispatchloader(false)
          konsole.log(resposnse, "response2");
          // setshowaddprofessmodal(false)
          // AlertToaster.success("Data saved successfully")

          // setDisablebtn(false)
          // if(toUpdate == true && prevAddressId) {
          //   updateAddress() 
          // } else {
          //   addAddress()
          // }   
          professionalAddressRef?.current?.upsertAddress(professionalUserId, 1)
          professionalcontact?.current?.saveContactinfo(professionalUserId)
          AlertToaster.success(`Professional ${toUpdate == true ? "updated" : "saved"} successfully`)
        } else {
          // dispatchloader(false)
          // props.dispatchloader(false)
          konsole.log(error, "error");
        }
        dispatchloader(false);
        resolve();
      }))
    })
  }

  const upsertProfessionalUserMappingfunc = () => {
    let dataObj = [
      {
        "proSerDescId": 0,
        "isGenAuth": true,
        "isStatus": true,
        "profileURLId": 0,
        "websiteLink": "string",
        "certificationTypeId": 0,
        "certificationDate": "2023-05-12T11:20:36.982Z",
        "proUserId": 0,
        "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "isActive": true,
        "upsertedBy": "string"
      }
    ]
    let upsertProfessionalUserMappingparams = Services.upsertProfessionalUserMapping(dataObj)
    upsertProfessionalUserMappingparams.then((resposnse)=>{
      konsole.log(resposnse,"response")
    }).then((error)=>{
      konsole.log(error,"error")
    })
  }
  //confirm  warning ---------------------------------------------------------------------
  function toasterAlert(text) {
    setdata({ open: true, text: text, type: "Warning" });
  }

  const validateWebLink = ( websiteLink, isOnSave ) => {
    if(!websiteLink) return true;
    if(isUrlValid(websiteLink) == false) {
      if(isOnSave != true) {
        toasterAlert(`Please enter valid website link`);
        setwebsiteLink("");
      } else {
        toasterAlert(`Please enter valid website link`);
        // setwebsiteLink("");
      }
      return false;
    }
    return true;
  }

  return (
    // <Modal
    //   backdrop="static"
    //   show={showaddprofessmodal}
    //   // className="my-modal-class"
    //   destroyOnClose
    //   onHide={() => {
    //     setshowaddprofessmodal(false);
    //   }}
    //   size="lg"
    // >
    //   <Modal.Header style={{ color: "white" }}>\

    <>
    {/* <div className="ms-4">
      Add New Professional
    </div> */}
        {/* </Modal.Header>
       <Modal.Body>
         */}
        <Row>
          <Col lg="12" className="" >
            <Row>
              <Col lg="12">
                <div>
                  <h5>{professtype?.find(item => item.value == professionaltype)?.label ?? ""}</h5>
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm="6" lg="4" >
                <input size="" name="fName"value={fname} className="border rounded mb-2" onChange={(e) => (e.target.value = removeSpaceAtStart(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)), setFname(e.target.value))} placeholder={"First Name*"}
                />
              </Col>

              {/* <Col lg="4" >
                <input size="" name="Middle Name"value={mname} className="border rounded" placeholder="Middle Name" onChange={(e) => (e.target.value = removeSpaceAtStart(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)), setMname(e.target.value))}
                />
              </Col> */}
              <Col sm="6" lg="4" >
                <input className="border rounded mb-2"value={lname} size="" name="Lastname" placeholder={"Last Name"} onChange={(e) => (e.target.value = removeSpaceAtStart(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)), setLname(e.target.value))}
                />
              </Col>

            </Row>
            <Row className="">
              <Col sm="6" lg="4">
                <Form.Control
                  className="mb-2"
                  value={clinicname}
                  placeholder={proSerDescType == 1 ? "Clinic name" : "Business name"}
                  id="clinicname"
                  onChange={(e) => {
                    setclinicname($AHelper.capitalizeAllLetters(e.target.value))
                  }}
                  type="text"
                />
              </Col>
              {proSerDescType != 1 && 
              <>
              <Col sm="6" lg="4">
                <Select
                  className="w-100 p-0 custom-select border rounded mb-2"
                  options={clinicnameTypes}
                  name="businessTypeId"
                  onChange={e => handleBusinessTypeChange(e.value)}
                  value={clinicnameTypes?.filter(ele => ele.value == clinicnameTypeId)}
                  placeholder="Business Type"
                />
              </Col>
              {clinicnameTypeId == "999999" && <Col sm="6" lg="4" >
                <Other
                  othersCategoryId={30}
                  userId={professionalUserId}
                  dropValue="999999"
                  ref={businessOther}
                  natureId={userData?.proUserId}
                />
              </Col>}
              </>}
              <Col sm="6" lg="4">
                <Form.Control
                  value={websiteLink}
                  className="mb-2"
                  placeholder="Website link"
                  id="websiteLink"
                  onChange={(event) => {
                    setwebsiteLink(event.target.value)
                  }}
                  onBlur={(e) => validateWebLink(e.target.value)}
                  type="text"
                />
              </Col>
            </Row>
            <Row className="mt-3 px-3">
              <Col xs sm="12" lg="12" className='border p-2 rounded'>
                <div style={{fontSize: "1.25rem", margin: "0 10px"}}>
                  Address
                </div>
                <DynamicAddressForm ref={professionalAddressRef} setLoader={dispatchloader}/>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg="12" className="" >
                <div >
                <ProfessionalContact userId={professionalUserId} ref={professionalcontact} />
                </div>
              </Col>
            </Row>
            {((memberUserId == primaryuserid) && spouseuserid !== "null") && 
              <Row className="mt-3">
                <Col lg="12">
                <Form.Check type="checkbox" label={`Same professional for ${maritalStatusId ==2 ? "partner" :"spouse"}`} className="checkbox-with-space d-flex align-items-center" onChange={(e) => { setSameprofess(e.target.checked) }} checked={sameprofess}></Form.Check>
                </Col>
              </Row>
            }

            <Row className="mt-3">
              <Col lg="12" className="d-flex justify-content-between align-item-center ">
             
              {/* <PlaceOfBirth placeholder={"Address"} addressData={addressdata} addressDetails={addressDetails} /> */}
              {/* <div>
                  <button
                    className="Cancel-Button1"
                    onClick={() => {
                      setshowaddprofessmodal(false)
                    }}
                  >
                    Cancel
                  </button>
              </div> */}
                <div>
                  <button
                    onClick={() => onFinish()}
                    className="Save-Button"
                    disabled={disalebtn == true ? true : false}
                  >
                    {toUpdate == true ? "Update" : "Save"}
                  </button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        </>
    //   </Modal.Body>
    // </Modal>
  );
}
const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps,mapDispatchToProps)(AddnewProfessmembermodal)