import { useState } from "react";
import { useEffect } from "react";
import konsole from "../../../../control/Konsole";
import Api from "../../../helper/api";
import { getApiCall } from "../../../../Reusable/ReusableCom";
import { $Service_Url } from "../../../../network/UrlPath";
import useUserIdHook from "../../../../Reusable/useUserIdHook";

const AddtionalPhysicanComponent = (props) => {
  const [data, setData] = useState([]);
  const { _primaryMemberUserId } = useUserIdHook();

  // const [ specialityType, setSpecialityType] = useState([]);
  // useEffect(()=>{
    let api = new Api();

  //   api.getSpecialityType().then((res)=>{
  //     if(res){
  //       setSpecialityType(res.data.data)
  //     }
  //   }).catch((error)=>{
  //     konsole.log("error",error)
  //   })
  // },[])
    
  useEffect(() => {
    if(props.memberUserId && props.memberUserId != "") {
      getApiCall("GET", $Service_Url.getSearchProfessional + `?MemberUserId=${props.memberUserId}&ProTypeId=11&primaryUserId=${_primaryMemberUserId}`, setData)
    }
  },[props.memberUserId])
  
  const addtionalPhysicanDetails = props.addtionalPhysicanDetails ?? [];
  konsole.log("additonal ph", addtionalPhysicanDetails);
  return (
    <div className="container-fluid  p-0 m-0">
      <div className="container-fluid">
        <span className="h3 border-bottom border-danger fs-3" style={{color: '#720c20'}}  >
          Specialists
        </span>
      </div>

      <div className="container-fluid ">
        <p className="text-start lead fw-bold pt-2" style={{color: '#720c20'}}>
          Please provide the names and specialties of any additional healthcare
          providers. Use additional paper as necessary.
        </p>
      </div>

      
        {/* // addtionalPhysicanDetails.length > 0 && addtionalPhysicanDetails.map((v, index) => {
        //   const mName = (v.m_Name !== null && v.m_Name !== '') ? " " +v.m_Name + " ": " ";
        //   const name = v.f_Name + mName + v.l_Name;
        //   konsole.log("asdfghjkl", specialityType.filter((type) => {return(type.value == v.speciality_Id)}), v.speciality_Id);
        //   const specialties = specialityType.filter((type) => {return(type.value == v.speciality_Id)})[0]?.label; */}
        {data && data.map(ele => {
          return(
            <div className="container-fluid pt-2 ">
              <div className="row">
                <div className="col-2">
                  <label for="provider-name-1">Provider Name: </label>
                </div>

                <div className="col-4">
                  <input type="text" id="provider-name-1" value={ele.fName + " " + ele.lName}></input>
                </div>

                <div className="col-2">
                  <label for="specialty-1:">Speciality: </label>
                </div>
                <div className="col-4">
                  <input type="text" id="specialty-1" value={ele.proSubType} ></input>
                </div>
              </div>
            </div>
          )
        })}
    </div>
    
      
  )}


export default AddtionalPhysicanComponent;
