import React, { useEffect, useState, useContext } from "react";
import { Form, Row } from "react-bootstrap";
import { $CommonServiceFn } from "../network/Service";
import { $Service_Url } from "../network/UrlPath";
import konsole from "../control/Konsole";
import { connect } from "react-redux";
import { SET_LOADER } from "../Store/Actions/action";
import { globalContext } from "../../pages/_app";
import Addnewprofessionalmodal from "./Addnewprofessionalmodal";
import AlertToaster from "../control/AlertToaster";
import ProfessSearch from "../professSearch";
import NewProServiceProvider from "../NewProServiceProvider";
import { $AHelper } from "../control/AHelper";

const Financeguidance = (props) =>{
  const { setdata } = useContext(globalContext)
  const context = useContext(globalContext)
    const [listofuserid,setlistofuserid] = useState('primary')
    const[userDetailOfPrimary,setuserDetailOfPrimary] = useState({})
    const [primaryuserId,setprimaryuserId] =useState('')
    const [spouseuserId,setspouseuserId] = useState('')
  const [selectProprtyMang, setSelectProprtyMang] = useState('');
  const [selectProprtyMangIndex, setSelectProprtyMangIndex] = useState(0);
  const [selectBillService, setSelectBillService] = useState('');
  const [selectBillServiceIndex, setSelectBillServiceIndex] = useState(0);
  const [selectAcoount, setSelectAccount] = useState('');
  const [selectAcoountIndex, setSelectAccountIndex] = useState(0);
  const [selectBookKeeper, setSelectBookKeeper] = useState('');
  const [selectBookKeeperIndex, setSelectBookKeeperIndex] = useState(0);
  const [selectFinceAdvicer, setSelectFinceAdvicer] = useState('');
  const [selectFinceAdvicerIndex, setSelectFinceAdvicerIndex] = useState(0);
  const [selectHandymanServce, setSelectHandymanServce] = useState('');
  const [selectHandymanServceIndex, setSelectHandymanServceIndex] = useState(0);
  const [professionalUser, setProfessionalUser] = useState([]);
  const [professionalUserAccountant, setProfessionalUserAccountant] = useState([]);
  const [professionalUserBookKeeper, setProfessionalUserBookKeeper] = useState([]);
  const [professionalUserFinceAdvicer, setProfessionalUserFinceAdvicer] = useState([]);
  const [professionalUserProprtyMang, setProfessionalUserProprtyMang] = useState([]);
  const [professionalUserHandymanServce, setProfessionalUserHandymanServce] = useState([]);
  const [showaddprofessmodal, setshowaddprofessmodal] = useState(sessionStorage.getItem("openModalHash") ? true : false);
  const [professionaltype, setprofessionaltype] = useState(sessionStorage.getItem("openModal4SetGuidanceProType") || '');
  const [Addnewprofessmodaldata,setAddnewprofessmodaldata] = useState([])

    useEffect(() => {
      const lastPath = sessionStorage.getItem("lastPath");
      sessionStorage.setItem("openModal4SetGuidanceProType", "");
      if(lastPath?.length) {
        if(lastPath?.includes("2")) {
          setlistofuserid("spouse")
          if(listofuserid == "spouse") sessionStorage.removeItem("lastPath");
        } else {
          sessionStorage.removeItem("lastPath");
        }
      }
    }, [])

    useEffect(()=>{
    let userDetailofPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
    setuserDetailOfPrimary(userDetailofPrimary)
    let primaryuserid = sessionStorage.getItem("SessPrimaryUserId");
    setprimaryuserId(primaryuserid)
    let spouseuserid = sessionStorage.getItem("spouseUserId");
    setspouseuserId(spouseuserid)
        if(listofuserid == 'primary'){
      getProfessionalByUser(primaryuserid)
        }else{
      getProfessionalByUser(spouseuserid)
    }

    // setSelectBillService([])
    // setSelectAccount([])
    // setSelectBillService([])
    // setSelectBookKeeper([])
    // setSelectFinceAdvicer([])
    // setSelectHandymanServce([])
    // setSelectProprtyMang([])
    // setSelectHandymanServce("Select a Handyman")
    },[listofuserid,showaddprofessmodal])

    useEffect(()=>{
      let userids = ( listofuserid == 'primary' ) ? primaryuserId : spouseuserId
      if (Addnewprofessmodaldata != null) {
        var dataaddprofessdata = Addnewprofessmodaldata?.proCategories?.map((e)=>{
          return    {
            "userProId": Addnewprofessmodaldata.userProId,
            "proUserId": Addnewprofessmodaldata.proUserId,
            "proCatId": e.proCatId,
            "userId": Addnewprofessmodaldata.createdBy,
            "lpoStatus": true,
            "isActive":true,
            "upsertedBy": primaryuserId
          }
        })
      }
      konsole.log("rieuiuiuo", Addnewprofessmodaldata,dataaddprofessdata)
      $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postProfessionalUser, dataaddprofessdata, (res, err) => {
        if (res) {
          konsole.log('updateprofessionluser', res)
          setshowaddprofessmodal(false)
        } else {
          konsole.log('updateprofessionluser', err)
        }
        getProfessionalByUser(userids)
      })
    },[Addnewprofessmodaldata])

    const getProfessionalByUser = (userid) => {
      if(!userid) userid = ( listofuserid == 'primary' ) ? primaryuserId : spouseuserId;
      props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonApi("GET",$Service_Url.getSearchProfessional +'?MemberUserId='+ userid, "",((res,err)=>{
        if(res){
        props.dispatchloader(false)
        let filterdata = res.data.data.filter((items) => {
          return items.proTypeId == 2;
        });
        let filterbillpay = filterdata.findIndex((e) => {
          return e.lpoStatus == true;
        });

        const aIndex =  (filterbillpay >= 0)? filterbillpay : ""
        
        setSelectBillService(aIndex);
        let filterdataAccountant = res.data.data.filter(
          (items) => {
            return items.proTypeId == 3;
          }
        );
        let dataAccountant = filterdataAccountant.findIndex((e) => {
          return e.lpoStatus == true;
        });
        const aIndex2 =  (dataAccountant >= 0) ? dataAccountant : ""
        konsole.log(dataAccountant,aIndex2,"datagetfilter:222222");
        setSelectAccount(aIndex2);
        let filterdataBookKeper = res.data.data.filter(
          (items) => {
            return items.proTypeId === 12;
          }
        );
        let dataBookKeper = filterdataBookKeper.findIndex((e) => {
          return e.lpoStatus == true;
        });
        const aIndex3 =  (dataBookKeper >= 0)? dataBookKeper : ""
        konsole.log(dataBookKeper, "datagetfilter3");
        setSelectBookKeeper(aIndex3);
        let filterdataFinceAdvicer = res.data.data.filter(
          (items) => {
            return items.proTypeId === 1;
          }
        );
        let FinceAdvicer = filterdataFinceAdvicer.findIndex((e) => {
          return e.lpoStatus == true;
        });
        const aIndex4 =  (FinceAdvicer >= 0)? FinceAdvicer : ""
        konsole.log(FinceAdvicer, "datagetfilter4");
        setSelectFinceAdvicer(aIndex4);
        let filterdataPropertyMang = res.data.data.filter(
          (items) => {
            return items.proTypeId === 14;
          }
        );
        let PropertyMang = filterdataPropertyMang.findIndex((e) => {
          return e.lpoStatus == true;
        });
        const aIndex5 =  (PropertyMang >= 0)? PropertyMang : ""
        konsole.log(PropertyMang, "datagetfilter5");
        setSelectProprtyMang(aIndex5);
        let filterdataHandyman = res.data.data.filter(
          (items) => {
            return items.proTypeId === 4;
          }
        );
        let dataHandyman = filterdataHandyman.findIndex((e) => {
          return e.lpoStatus == true;
        });
        
        const aIndex6 =  (dataHandyman >= 0)? dataHandyman : ""
        konsole.log(dataHandyman, "datagetfilter6");
        setSelectHandymanServce(aIndex6);

        konsole.log("filterdataljljlj;j;", filterdata);
        setProfessionalUser(filterdata);
        setProfessionalUserAccountant(filterdataAccountant);
        setProfessionalUserBookKeeper(filterdataBookKeper);
        setProfessionalUserFinceAdvicer(filterdataFinceAdvicer);
        setProfessionalUserProprtyMang(filterdataPropertyMang);
        setProfessionalUserHandymanServce(filterdataHandyman);
        let selectedGCM = res.data.data.professionalUser.filter((items) => {
          return items.lpoStatus === true;
        });
        setGetselectedGCM(selectedGCM);

        }else{
            konsole.log(err,"errorueiruero")
        props.dispatchloader(false)
      }
    }))
  };

  const onChangeSelect = (el) => {
    setSelectBillService(el.target.value);
    setSelectBillServiceIndex(el.target.value);
  };

  konsole.log("selectKeyselectKey", selectBillService);

  const onChangeSelectAccountant = (e) => {
    konsole.log("selectedvalue", e.target.value);
    setSelectAccount(e.target.value);
    setSelectAccountIndex(e.target.value);
  };

  const onChangeSelectBookKeeper = (e) => {
    konsole.log("selectedvalue", e.target.value);
    setSelectBookKeeper(e.target.value);
    setSelectBookKeeperIndex(e.target.value)
  };

  const onChangeSelectFinceAdvicer = (e) => {
    konsole.log("selectedvalue", e.target.value);
    setSelectFinceAdvicer(e.target.value);
    setSelectFinceAdvicerIndex(e.target.value);
  };

  const onChangeSelectProprtyMang = (e) => {
    konsole.log("selectedvalue", e.target.value);
    setSelectProprtyMang(e.target.value);
    setSelectProprtyMangIndex(e.target.value);
  };

  const onChangeSelectHandymanServce = (e) => {
    konsole.log("selectedvalue", e.target.value);
    setSelectHandymanServce(e.target.value);
    setSelectHandymanServceIndex(e.target.value);
  };

    const postdata = () =>{
    let loggeduserid = sessionStorage.getItem("loggedUserId")
    let memberid = listofuserid == 'primary' ? primaryuserId : spouseuserId
       konsole.log(memberid,"memberidmemberidmemberidmemberid")
        props.dispatchloader(true)
        if (selectBillService != undefined || selectBillService != "") {

          const dataObj = [
            {
             "userProId": professionalUser[selectBillService]?.userProId,
             "proUserId": professionalUser[selectBillService]?.proUserId,
             "proCatId": professionalUser[selectBillService]?.proCatId,
             "userId": memberid,
             "lpoStatus": true,
             "upsertedBy": loggeduserid,
             "isActive": true,
           }
         ]
          konsole.log(selectBillService,"selectBillService")
          $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postProfessionalUser,dataObj,((res,err)=>{
          if(res){
            konsole.log(res,"resirueiur")
          props.dispatchloader(false)
          }else{
            konsole.log(err,"error")
          props.dispatchloader(false)
        }
      })
      )
    }

    if (selectBookKeeper != undefined || selectBookKeeper != "") {
      const dataObj = [
        {
         "userProId": professionalUserBookKeeper[selectBookKeeperIndex]?.userProId,
         "proUserId": professionalUserBookKeeper[selectBookKeeperIndex]?.proUserId,
         "proCatId": professionalUserBookKeeper[selectBookKeeperIndex]?.proCatId,
         "userId": memberid,
         "lpoStatus": true,
         "upsertedBy": loggeduserid,
         "isActive": true,
       }
     ]
          $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postProfessionalUser,dataObj,((res,err)=>{
          if(res){
          props.dispatchloader(false)
            konsole.log(res,"resirueiur")
          }else{
            konsole.log(err,"error");
          props.dispatchloader(false)
        }
      }))
        if (selectFinceAdvicer != undefined || selectFinceAdvicer != "") {
          const dataObj = [
            {
             "userProId": professionalUserFinceAdvicer[selectFinceAdvicer]?.userProId,
             "proUserId": professionalUserFinceAdvicer[selectFinceAdvicer]?.proUserId,
             "proCatId": professionalUserFinceAdvicer[selectFinceAdvicer]?.proCatId,
             "userId": memberid,
             "lpoStatus": true,
             "upsertedBy": loggeduserid,
             "isActive": true,
           }
         ]
          $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postProfessionalUser,dataObj,((res,err)=>{
          if(res){
            props.dispatchloader(false)
            konsole.log(res,"resirueiur")
          }else{
            konsole.log(err,"error")
            props.dispatchloader(false)
          }
          })
          )
        }
        if (selectHandymanServce != undefined || selectHandymanServce != "") {

          const dataObj = [
            {
             "userProId": professionalUserHandymanServce[selectHandymanServce]?.userProId,
             "proUserId": professionalUserHandymanServce[selectHandymanServce]?.proUserId,
             "proCatId": professionalUserHandymanServce[selectHandymanServce]?.proCatId,
             "userId": memberid,
             "lpoStatus": true,
             "upsertedBy": loggeduserid,
             "isActive": true,
           }
         ]
          $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postProfessionalUser,dataObj,((res,err)=>{
          if(res){
            props.dispatchloader(false)
            konsole.log(res,"resirueiur")
          }else{
            konsole.log(err,"error")
            props.dispatchloader(false)
          }
          })
          )
        }
        if (selectProprtyMang != undefined || selectProprtyMang != "") {

          const dataObj = [
            {
             "userProId": professionalUserProprtyMang[selectProprtyMang]?.userProId,
             "proUserId": professionalUserProprtyMang[selectProprtyMang]?.proUserId,
             "proCatId": professionalUserProprtyMang[selectProprtyMang]?.proCatId,
             "userId": memberid,
             "lpoStatus": true,
             "upsertedBy": loggeduserid,
             "isActive": true,
           }
         ]
          $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postProfessionalUser,dataObj,((res,err)=>{
          if(res){
            props.dispatchloader(false)
            konsole.log(res,"resirueiur")
          }else{
            konsole.log(err,"error")
            props.dispatchloader(false)
          }
          })
          )
        }
        if (selectAcoount != undefined || selectAcoount != "") {
          konsole.log(selectAcoount,professionalUser,"selectAcoount")
        const dataObj = [
            {
             "userProId": professionalUserAccountant[selectAcoount]?.userProId,
             "proUserId": professionalUserAccountant[selectAcoount]?.proUserId,
             "proCatId": professionalUserAccountant[selectAcoount]?.proCatId,
             "userId": memberid,
             "lpoStatus": true,
             "upsertedBy": loggeduserid,
             "isActive": true,
           }
         ]
          $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.postProfessionalUser,dataObj,((res,err)=>{
          if(res){
            props.dispatchloader(false)
            konsole.log(res,"resirueiur")
          }else{
            konsole.log(err,"error")
            props.dispatchloader(false)
          }
          })
          )
        }
        // toasterAlert("Data saved successfully","Success");
      }
      AlertToaster.success("Data saved successfully")
  }
  
  function toasterAlert(text, type) {
    setdata({ open: true, text: text, type: type ? type : "Warning" });
  }

  const addprofessfuncclick = (type) => {
    konsole.log(type, "typetypetypetypetype");

    setprofessionaltype(type)
    setshowaddprofessmodal(true);
  };

return(
    // <>   {showaddprofessmodal == true && <ProfessSearch pshow= {showaddprofessmodal} setshowaddprofessmodal={setshowaddprofessmodal} protypeTd={professionaltype} memberUserId={listofuserid == "primary" ? primaryuserId:spouseuserId} setAddnewprofessmodaldata={setAddnewprofessmodaldata} showForm={2} activeUser={listofuserid == "primary" ? "1":"2"}/>}
    <>   {showaddprofessmodal == true && 
      <NewProServiceProvider 
        uniqueKey={"financeguidance" + (professionaltype == 4 ? "2" : "3") + professionaltype}
        pshow= {showaddprofessmodal} 
        setshowaddprofessmodal={setshowaddprofessmodal} 
        hideFilters={true}
        proSerDescTd={professionaltype == 4 ? "2" : "3"}
        protypeTd={professionaltype} 
        // memberUserId={listofuserid == "primary" ? primaryuserId:spouseuserId} 
        setAddnewprofessmodaldata={setAddnewprofessmodaldata} 
        showForm={2} 
        activeUser={listofuserid == "primary" ? "1":"2"}
        getProfessionalByUser={getProfessionalByUser}
        currentPath="setGuidance>finance"
      />}
      <div className=" d-flex p-2  mx-1 align-items-center" style={{ backgroundColor: "#ffffff" }}> View by: {" "}
        <div className="d-flex mx-1">
          <div class="form-check d-flex align-items-center justify-content-between">
                  <Form.Check class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked={listofuserid == "primary"} onChange={() =>  setlistofuserid("primary")} defaultChecked></Form.Check>
            <label class="form-check-label ps-1 pt-1 " for="flexRadioDefault1" >   {userDetailOfPrimary.memberName}{" "} </label>
          </div>
          {(spouseuserId !== undefined && spouseuserId !== "null") &&
            <div class="form-check d-flex ms-2  align-items-center justify-content-between">
              <Form.Check class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked={listofuserid == "spouse"} onChange={() => setlistofuserid("spouse")} ></Form.Check>
                    <label class="form-check-label ps-1 pt-1" for="flexRadioDefault2" >   {(userDetailOfPrimary.spouseName) ? userDetailOfPrimary.spouseName :  userDetailOfPrimary.memberName +"- Spouse" } </label>
            </div>
          }
          {(spouseuserId !== undefined && spouseuserId !== null && spouseuserId !== '')}
        </div>
      </div>
      <Row className="p-3">
        <div>
          <h6 className="mb-1">Choose a professional who would be paying your bills</h6>

          <div className="select-Div d-flex">
            <select className="m-0 ps-1 mb-1 border addSetProff" placeholder="Select a Bill Pay Service" optionFilterProp="children" style={{   height: "40px",   border: "1px solid black", }} onChange={onChangeSelect} value={selectBillService}
            >
             <option value="" disabled  hidden  >Select a Bill Pay Service</option>
              {professionalUser.map((data, key) => (
                <option value={key}>
                  { $AHelper.capitalizeAllLetters(data.fName+" "+data.mName+" "+data.lName)}
                </option>
              ))}
            </select>
                <button className="addnewproffbtn" onClick={()=>addprofessfuncclick('2')}> + </button>
          </div>
        </div>
        <div className="mt-2">
          <h6 className="mb-1">Choose a professional who would be filing your taxes</h6>
          <div className="select-Div d-flex">
            <select className="m-0 ps-1 border addSetProff" placeholder="Select an Accountant" optionFilterProp="children" style={{ height: "40px",   border: "black", }} onChange={onChangeSelectAccountant} value={selectAcoount}
            >
             <option value="" disabled  hidden >Select an Accountant</option>
              {professionalUserAccountant.map((data, key) => (
                <option value={key}>
                  {$AHelper.capitalizeAllLetters(data.fName+" "+data.mName+" "+data.lName)}
                </option>
              ))}
            </select>
                <button className="addnewproffbtn" onClick={()=>addprofessfuncclick('3')}> + </button>
          </div>
        </div>
        <div className="mt-2">
          <h6 className="mb-1">
            Choose the professionals below who will be managing your investments</h6>
          <div className="select-Div d-flex">
            <select placeholder="Select a Bookkeeper" className="m-0 ps-1 border addSetProff" optionFilterProp="children" style={{   height: "40px",   border: "black", }} onChange={onChangeSelectBookKeeper} value={selectBookKeeper}
            >
             <option value="" disabled  hidden >Select a Bookkeeper</option>
              {professionalUserBookKeeper.map((data, key) => (
                <option value={key}>
                  {$AHelper.capitalizeAllLetters(data.fName+" "+data.mName+" "+data.lName)}
                </option>
              ))}
            </select>

                <button className="addnewproffbtn" onClick={()=>addprofessfuncclick('12')}> + </button>

          </div>
        </div>
        <div className="mt-2">
          <div className="select-Div d-flex">
            <select className="m-0 ps-1 border addSetProff" placeholder="Select a Financial Advisor" optionFilterProp="children" style={{  height: "40px",   border: "black", }} onChange={onChangeSelectFinceAdvicer} value={selectFinceAdvicer}
            >
             <option value="" disabled  hidden >Select a Financial Advisor</option>
              {professionalUserFinceAdvicer.map((data, key) => (
                <option value={key}>
                 {$AHelper.capitalizeAllLetters(data.fName+" "+data.mName+" "+data.lName)}
                </option>
              ))}
            </select>
                <button className="addnewproffbtn" onClick={()=>addprofessfuncclick('1')}> + </button>
          </div>
        </div>
        <div className="mt-2">
          <h6 className="mb-1">
            Choose the professionals below who will be managing your Real
            Property
          </h6>

          <div className="select-Div d-flex">
            <select className="m-0 ps-1 border addSetProff"placeholder="Select a Property Manager"optionFilterProp="children"style={{ height: "40px",  border: "black", }}onChange={onChangeSelectProprtyMang}value={selectProprtyMang}
            >
             <option value="" disabled  hidden >Select a Property Manager</option>
              {professionalUserProprtyMang.map((data, key) => (
                <option value={key}>
                 {$AHelper.capitalizeAllLetters(data.fName+" "+data.mName+" "+data.lName)}
                </option>
              ))}
            </select>
                <button className="addnewproffbtn" onClick={()=>addprofessfuncclick('14')}> + </button>
          </div>
        </div>
        <div className="mt-2">
          <div className="select-Div d-flex">
            <select  className="m-0 ps-1 border addSetProff"  placeholder="Select a Handyman"  optionFilterProp="children"  style={{    height: "40px",    border: "black",  }}  onChange={onChangeSelectHandymanServce}  value={selectHandymanServce}
            >
             <option value="" disabled  hidden >Select a Handyman</option>
              {professionalUserHandymanServce.map((data, key) => (
                <option value={key}>
                  {$AHelper.capitalizeAllLetters(data.fName+" "+data.mName+" "+data.lName)}
                </option>
              ))}
            </select>
                <button className="addnewproffbtn" onClick={()=>addprofessfuncclick('4')}> + </button>
          </div>
        </div>
        <div className="Sava-Button-Div mt-3">
              <button className="Save-Button" onClick={()=>postdata()}>
            Save
          </button>
        </div>
      </Row>
    </>
  );
}
const mapStateToProps = (state) => ({...state})
const mapDispatchToProps = (dispatch)=>({
  dispatchloader:(loader)=>dispatch({type: SET_LOADER,payload:loader})
})

export default connect(mapStateToProps,mapDispatchToProps) (Financeguidance);

