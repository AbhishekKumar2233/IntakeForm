import React, { useEffect, useState ,useContext, memo, useRef} from "react";
import konsole from "./control/Konsole";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { $CommonServiceFn } from "./network/Service";
import { $AHelper } from './control/AHelper'
import { $Service_Url } from "./network/UrlPath";
import PlaceOfBirth from "./PlaceOfBirth";
import { SET_LOADER } from "./Store/Actions/action";
import { connect } from "react-redux";
import ProfessionalContact from "./ProfessionalContact";
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";
import DynamicAddressForm from "./DynamicAddressForm";
import Select from "react-select";
import Other from "./asssets/Other";
import { isNotValidNullUndefile, isUrlValid, removeSpaceAtStart } from "./Reusable/ReusableCom";

function DynamicProfessForm (props) {
    // states related to User
    const [primaryUserId,setprimaryUserId] = useState('')
    const [spouseUserId,setspouseUserId] = useState('')
    const [loggedUserId, setloggedUserId] = useState("");
    const [currentUserId, setcurrentUserId] = useState("");
    const [maritalStatusId, setmaritalStatusId] = useState('')
    const subtenantId = sessionStorage.getItem("SubtenantId")
    const[disable,setdisable]=useState(false)
    
    // states related to professional
    const [professionalUserId, setprofessionalUserId] = useState("");
    const [profMemberObj, setprofMemberObj] = useState({
      fName: "",
      mName: "",
      lName: "",
      businessName: ""
    });
    const [prevAddressId, setprevAddressId] = useState("");
    const [websiteLink, setwebsiteLink] = useState("");
    const professionalcontact = useRef("");
    const professionalAddress = useRef("");
    const businessOther = useRef("");
    const [sameForSpouse,setsameForSpouse] = useState(false);
    const [businessTypes,setBusinessTypes] = useState([]);
    const [businessTypeId,setbusinessTypeId] = useState("");

    // toaster setups
    const { setdata } = useContext(globalContext)
    const toasterAlert = (text) => {
      setdata({ open: true, text: text, type: "Warning" });
    }

    // for initial render only 
    useEffect(() => {
      let _maritalStatusId = sessionStorage.getItem("maritalStatusId")
      let _primaryUserId = sessionStorage.getItem('SessPrimaryUserId')
      let _spouseUserId = sessionStorage.getItem('spouseUserId')
      let _loggedUserId = sessionStorage.getItem('loggedUserId')

      fetchBussinessType();
      setmaritalStatusId(_maritalStatusId);
      setprimaryUserId(_primaryUserId);
      setspouseUserId(_spouseUserId);
      setloggedUserId(_loggedUserId);
      setcurrentUserId(props.activeUser == "2" ? _spouseUserId : _primaryUserId);
    }, [])

    // for props changes
    useEffect(() => {
      konsole.log("fsnvsb", props);

      const _professionalUserId = props.profData.professionalUserId || props.profData.userId;
      if(_professionalUserId != professionalUserId) {
        setprofessionalUserId(_professionalUserId);
        setprofMemberObj({
          fName: props.profData.fName || "",
          mName: props.profData.mName || "",
          lName: props.profData.lName || "",
          businessName: props.profData.businessName || "",
        })
        setbusinessTypeId(props.profData.businessTypeId || "")
        setwebsiteLink(props.profData.websiteLink || "")
        // fetchProfAddress(_professionalUserId);
        professionalAddress.current.getByUserId(_professionalUserId);
      }

      if(props.isSameForSpouse != sameForSpouse) {
        setsameForSpouse(props.isSameForSpouse == true);
      }
    }, [props]);

    // related to loader -----------
    let loaderCount = 0;
    const setLoader = ( state ) => {
      if(state == true) {
        if(loaderCount == 0) props.dispatchloader(true);
        loaderCount++;
      }
      else {
        if(loaderCount == 1) props.dispatchloader(false);
        loaderCount--;
      }
    }    

    const fetchBussinessType = () => {
      $CommonServiceFn.InvokeCommonApi(
        "GET",
        $Service_Url.getBusinessType,
        "",
        (response) => {
          if (response) {
            setBusinessTypes(response?.data?.data)
          }
        }
      );
    };

    const handleBusinessTypeChange = (value) => {
      if(value != "999999" && businessTypeId == "999999") {
        businessOther?.current?.setState({othersName: ""});
        setTimeout(() => {
          businessOther?.current?.saveHandleOther(props.profData?.proUserId);
          setbusinessTypeId(value);
        }, [100])
      } else {
        setbusinessTypeId(value);
      }
    }

    const handleChange = (e) => {
      const stateName = e.target.name;
      let stateValue = e.target.value;

      konsole.log(stateName, "sdvbsbv", stateValue)

      if(["fName", "mName", "lName", "businessName"].includes(stateName)) {
        stateValue = removeSpaceAtStart(stateValue);
        setprofMemberObj({...profMemberObj, [stateName]: $AHelper.capitalizeFirstLetter(stateValue)});
      } else if(stateName == "websiteLink") {
        setwebsiteLink(stateValue);
      }
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

    const onSubmit = async () => {
      // validation 
    // ================= Don't remove these comments ========================
      // if(profMemberObj.fName == '' || profMemberObj.lName == ''){
        // toasterAlert(`Please enter ${(profMemberObj.fName == '')? "first name" : "last name"} field.`) 
      if(isNotValidNullUndefile(profMemberObj.fName) == false){
        toasterAlert(`Please enter first name field.`) 
        return
      }
      // else if(professionalcontact?.current?.checkvalidation(true)) return;
      // if(professionalAddress?.current?.isEmpty()) {
      //   toasterAlert("Address cannot be blank");
      //   return
      // } 
      if(disable == true)
      {
        return
      }else{
      setdisable(true)
      if(validateWebLink(websiteLink, true) != true) return;

    // =====================================================================
     
      professionalcontact?.current?.saveContactinfo(professionalUserId)
      professionalAddress?.current?.upsertAddress(professionalUserId, 1)
      updateProfUsername();

      mapToProfessional();
      if(props.isSameForSpouse == true && sameForSpouse == false) props.changeSameForSpouse(true);
      }
    }

    const updateProfUsername = () => {
      setLoader(true);
      let dataobj = {
        fName: $AHelper.capitalizeAllLetters(profMemberObj.fName),
        mName: $AHelper.capitalizeAllLetters(profMemberObj.mName),
        lName: $AHelper.capitalizeAllLetters(profMemberObj.lName),
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
        updatedBy: loggedUserId,
        userId: professionalUserId,
      };
      $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUpdateMember, dataobj, (resposnse, error) => {
        if(resposnse){
          konsole.log(resposnse, "responseupdateProfUsername");
        } else {
          konsole.log(error, "errorupdateProfUsername");
        }
        setLoader(false);
      })
    }

    const mapToProfessional = () => {
      let dataobj = {
        userId: professionalUserId,
        isGenAuth: false,
        isStatus: true,
        isActive: true,
        upsertedBy: loggedUserId,
        proCategories: [
          {
            proCatId: props.profData?.proCatId || 0,
            proSerDescId: props.proSerDescTd,
            proTypeId: props.proTypeTd,
          }
        ],
        businessName: $AHelper.capitalizeAllLetters(profMemberObj.businessName),
        businessTypeId: businessTypeId,
        websiteLink: websiteLink,
        proUserId: props.profData?.proUserId || 0,
      }

      setLoader(true);
      setdisable(true)
      $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postProfessionalUserMapping, dataobj, (response,error) => {
        if(response?.data?.data?.length > 0) {
          konsole.log(response, "mapToProfessResponse");

          if(businessTypeId == "999999") businessOther?.current?.saveHandleOther(response.data.data[0]?.proUserId);

          if(props.toUpdate != true) {
            mapProfToUser(response.data.data[0], currentUserId);
          } else {
            returnToParent();
          }
          if(props.isSameForSpouse != true && sameForSpouse == true) {
            mapProfToUser(response.data.data[0], currentUserId == primaryUserId ? spouseUserId : primaryUserId);
          }
        } else {
          konsole.log(error, "mapToProfessError");
        }
        setLoader(false);
      });
    }

    const mapProfToUser = ( dataObject, userId ) => {
      const dataObj = [
        {
          "userProId": 0,
          "proUserId": dataObject.proUserId,
          "proCatId": dataObject.proCategories[0]?.proCatId,
          "userId": userId,
          "lpoStatus": false,
          "upsertedBy": loggedUserId,
          "isActive": true,
        }
      ]

      setLoader(true);
      $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postProfessionalUser, dataObj, (response, error) => {
        if (response) {
          konsole.log('mapPrfToUsrResponse', response)
          if(userId == currentUserId) returnToParent();
        } else {
          konsole.log('mapPrToUsrError', error)
        }
        setLoader(false)
      })
    }

    const returnToParent = () => {
      AlertToaster.success(`${props.proTypeName && (typeof props.proTypeName === 'string') ? props.proTypeName : ""} ${props.toUpdate == true ? "updated" : "saved"} successfully`);
      props.CallSearchApi(currentUserId, primaryUserId);
      setdisable(false)
      props.handleClose();
    }

    return (
      <>
      <Row className="mt-3">
        <Col sm="6" lg="4" >
          <input size="" name="fName" value={profMemberObj.fName} className="border rounded mb-2 upperCasing" placeholder="First Name*" onChange={handleChange}/>
        </Col>
        {/* <Col sm="6" lg="4" >
          <input size="" name="mName" value={profMemberObj.mName} className="border rounded mb-2" placeholder="Middle Name" onChange={handleChange}/>
        </Col> */}
        <Col sm="6" lg="4" >
          <input size="" name="lName" value={profMemberObj.lName} className="border rounded mb-2 upperCasing" placeholder="Last Name" onChange={handleChange}/>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col sm="6" lg="4" >
          <input size="" name="businessName" value={profMemberObj.businessName} className="border rounded mb-2 upperCasing" placeholder="Business name" onChange={handleChange}/>
        </Col>
        <Col sm="6" lg="4" >
          <Select
            className="w-100 p-0 custom-select border rounded mb-2"
            options={businessTypes}
            name="businessTypeId"
            onChange={e => handleBusinessTypeChange(e.value)}
            value={businessTypes?.filter(ele => ele.value == businessTypeId)}
            placeholder="Business Type"
          />
        </Col>
        {businessTypeId == "999999" && <Col sm="6" lg="4" >
          <Other
            othersCategoryId={30}
            userId={professionalUserId}
            dropValue="999999"
            ref={businessOther}
            natureId={props.profData?.proUserId}
          />
        </Col>}
        <Col sm="6" lg="4" >
          <input size="" name="websiteLink" value={websiteLink} className="border rounded mb-2" placeholder="Website link" onChange={handleChange} onBlur={(e) => validateWebLink(e.target.value)}/>
        </Col>
      </Row>
      <Row className="mt-3 px-3">
        <Col xs sm="12" lg="12" className='border p-2 rounded'>
          <div style={{fontSize: "1.25rem", margin: "0 10px"}}>
              Address
          </div>
          <DynamicAddressForm ref={professionalAddress} setLoader={props.dispatchloader}/>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col lg="12" className="" >
          <div >
            <ProfessionalContact userId={professionalUserId} ref={professionalcontact} />
          </div>
        </Col>
      </Row>
      {(spouseUserId && (typeof spouseUserId == "string") && (spouseUserId != "null")) && <Row className="mt-3">
        <Col lg="12">
          <Form.Check type="checkbox" label={`Same professional for ${maritalStatusId ==2 ? "partner" :"spouse"}`} className="checkbox-with-space d-flex align-items-center" onChange={(e) => { setsameForSpouse(e.target.checked) }} checked={sameForSpouse}></Form.Check>
        </Col>
      </Row>}
      <Row className="mt-5">
        <Col lg="12" className="d-flex justify-content-between align-item-center ">
            <div>
              <button onClick={() => onSubmit()} className="Save-Button"  disabled={disable}>
                {props.toUpdate == true ? "Update" : "Save"}
              </button>
            </div>
        </Col>
      </Row>
      </>
    )
}

const SimpleProfMoreInfo = (props) => {
  const [subjectId, setsubjectId] = useState(0);
  const [responseId, setresponseId] = useState(0);
  const [userSubjectDataId, setuserSubjectDataId] = useState(0);
  const [userId, setUserId] = useState(sessionStorage.getItem("SessPrimaryUserId") || "");
  const [isMoreInfoChecked, setisMoreInfoChecked] = useState(false);
  const [disableCall, setdisableCall] = useState(false);

  useEffect(() => {
    resetState();
    fetchLabelData(props.formLabels)
    
    if(props.professionalCount > 0 && isMoreInfoChecked == true) {
      changeMoreInfoCheckTo(false);
    }
  }, [])

  useEffect(() => {
    if((props.professionalCount > 0 || props.forceUncheck == true) && isMoreInfoChecked == true) {
      changeMoreInfoCheckTo(false);
    }
  }, [isMoreInfoChecked, props.professionalCount, props.forceUncheck])

  const resetState = () => {
    setisMoreInfoChecked(false);
    setuserSubjectDataId(0);
    setresponseId(0);
    setsubjectId(0);
  }

  const changeMoreInfoCheckTo = (toState) => {
    if(disableCall) return;
    setdisableCall(true);

    let method, dataObj;

    if(userSubjectDataId == 0) {
      method = "POST";
      dataObj = [
        {
          "userSubjectDataId": userSubjectDataId,
          "subjectId": subjectId,
          "subResponseData": toState == true? "true" : "false",
          "responseId": responseId,
          "userId": userId
        }
      ]
    } else {
      method = "PUT";
      dataObj = {
        "userId": userId,
        "userSubjects": [
          {
            "userSubjectDataId": userSubjectDataId,
            "subjectId": subjectId,
            "subResponseData": toState == true ? "true" : "false",
            "responseId": responseId
          }
        ]
      }
    }

    setisMoreInfoChecked(toState);
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(method, method == "POST" ? $Service_Url.postaddusersubjectdata : $Service_Url.putSubjectResponse, dataObj, (res) => {
      setdisableCall(false);
      fetchLabelData(props.formLabels);
    })
  }

  const fetchLabelData = (formLabels) => {
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getsubjectForFormLabelId, formLabels, (response) => {
      if(response?.data?.data?.length) {
        konsole.log("dbshvbhjs", formLabels, response.data.data)
        const _subjectId = response.data.data[0]?.subjectId || 0;
        const _responseId = response.data.data[0]?.question?.response[0]?.responseId || 0;
        setsubjectId(_subjectId);
        setresponseId(_responseId)

        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSubjectResponse + userId + `/0/0/${_subjectId}`, "", (response) => {
          if (response?.data?.data?.userSubjects?.length) {
            setuserSubjectDataId(response.data.data.userSubjects[0].userSubjectDataId || 0);
            setisMoreInfoChecked(response.data.data.userSubjects[0].response == "true" ? true : false);
          }
          props.dispatchloader(false);
        })
      } else {
        props.dispatchloader(false);
      }
    })
  }

  return (<Form.Check className="ms-2" type="checkbox" name="" onChange={e => changeMoreInfoCheckTo(e.target.checked)} checked={isMoreInfoChecked} disabled={props.professionalCount > 0 ? true : false}/>)
}

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps,mapDispatchToProps)(DynamicProfessForm);
export const SimpleProfMoreInfoConnected = connect(mapStateToProps, mapDispatchToProps)(SimpleProfMoreInfo);