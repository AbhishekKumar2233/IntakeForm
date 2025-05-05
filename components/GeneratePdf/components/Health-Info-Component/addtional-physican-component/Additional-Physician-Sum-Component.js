import { useState } from "react";
import { useEffect } from "react";
import konsole from "../../../../control/Konsole";
import Api from "../../../helper/api";
import { getApiCall } from "../../../../Reusable/ReusableCom";
import { $Service_Url } from "../../../../network/UrlPath";
import useUserIdHook from "../../../../Reusable/useUserIdHook";

const AddtionalPhysicanSumComponent = (props) => {
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

  //   konsole.log("nersdkjgb", props)
  // },[])


  useEffect(() => {
    if(props.memberUserId && props.memberUserId != "") {
      getApiCall("GET", $Service_Url.getSearchProfessional + `?MemberUserId=${props.memberUserId}&ProTypeId=11&primaryUserId=${_primaryMemberUserId}`, setData)
    }
  },[props.memberUserId])

  

  const addtionalPhysicanDetails = props.addtionalPhysicanDetails ?? [];
  konsole.log("additonal ph", addtionalPhysicanDetails);
  return (
    <div className="containe mx-3 ps-0 pt-3">
      {/* <div className=" d-flex justify-content-start pb-2" style={{borderBottom:"2px solid #E8E8E8", margin:"0px 10px"}}>
        <h1 className="health_Info_h1 pb-3">Additional Physician</h1>
      </div> */}
     

      <div className="contain">
        <h6 className="text-start lead fw-bold pt-2" style={{color: '#720c20', fontSize:'13px'}}>
          Please provide the names and specialties of any additional healthcare
          providers. Use additional paper as necessary.
        </h6>
      </div>

      {/* {
        addtionalPhysicanDetails.length > 0 && addtionalPhysicanDetails.map((v, index) => {
          const mName = (v.m_Name !== null && v.m_Name !== '') ? " " +v.m_Name + " ": " ";
          const name = v.f_Name + mName + v.l_Name;
          konsole.log("asdfghjkl", specialityType.filter((type) => {return(type.value == v.speciality_Id)}), v.speciality_Id);
          const specialties = specialityType.filter((type) => {return(type.value == v.speciality_Id)})[0]?.label;
          return(
            <div className="contain">
              <div className="d-flex pt-4">
                <div className="sumPhysician pb-3" style={{width:"50%"}}>
                  <p>Provider Name</p>
                <h5>{name}</h5>
                  </div> 

                  <div className="sumPhysician pb-3" style={{width:"50%"}}>
                  <p>Specialty</p>
                <h5>{specialties}</h5>
                  </div>
              </div>
            </div>
          )
        })
      } */}
      {data && data.map(ele => {
        return (
          <div className="contain">
            <div className="d-flex pt-3">
              <div className="sumPhysician pb-2" style={{width:"45%"}}>
                <p>Provider Name</p>
                <h5>{ele.fName + " " + ele.lName}</h5>
              </div> 

              <div className="sumPhysician pb-2" style={{width:"56%"}}>
                <p>Speciality</p>
                <h5>{ele.proSubType}</h5>
              </div>
            </div>
          </div>
        )
      })}
    </div>
      
  );
};

export default AddtionalPhysicanSumComponent;
