import { useEffect, useState } from "react";
import { $AHelper } from "../../../control/AHelper";
import konsole from "../../../control/Konsole";
import OtherInfo from "../../../asssets/OtherInfo";

const CommProfSum = (props) => {
     const api = props.api

     konsole.log("apiapi",props.api)
     const userId=props.memberId
     const spouseUserId = props.memberId == sessionStorage.getItem('spouseUserId') ? sessionStorage.getItem("SessPrimaryUserId") : sessionStorage.getItem('spouseUserId');

     const [data, setData] = useState({
        fName: '',
        mName: '',
        lName: '',
        businessName: '',
     })
     const [contact, setContact] = useState({})
     const [address, setAddress] = useState({})
     const [sameAsSpouse, setSameAsSpouse] = useState(false)
     
  

     useEffect(() => {
          const profTypeId = props.proTypeId || "";
          if (userId !== "" && profTypeId != "") {
               api?.GetSearchProfessionals(userId, profTypeId, "", "", "", "", "").then((res) => {
                    if (res.data.data) {
                         setData(res.data.data[0])
                         konsole.log("reserror",res.data.data[0].professionalUserId)   
                         
                         if(spouseUserId && spouseUserId != "null") {
                              api.GetSearchProfessionals(spouseUserId, profTypeId, "", "", "", "", "").then((spouseProf) => {
                                   if(spouseProf?.data?.data) {
                                        const sameProf = spouseProf?.data?.data?.some(ele => ele.professionalUserId == res.data.data[0].professionalUserId);
                                        setSameAsSpouse(sameProf)
                                   }
                              }).catch((err1) => {})
                         }

                         api.GetContactByUserid(res.data.data[0].professionalUserId).then((res) => {
                              if (res) {
                                   setContact({ contact: res.data.data.contact })
                              }
                         }).catch((error) => {
                              konsole.log(error)
                         })

                         api.getAddressByUserId(res.data.data[0].professionalUserId).then((res) => {
                              if (res.data.data ) {
                                   setAddress({ data: res.data.data.addresses[0] })

                              }
                         }).catch((error) => {
                              konsole.log("reserror",error)
                         })
 
                    }
               }).catch((error) => {
                    konsole.log(error.response)
               })
          }
     }, [userId])


     konsole.log("addressaddress",address)

     return (
          <>
            {userId && (userId != "null") && <div className="contain">
                {/* {props.profName && <ul className="pt-2 ps-3"><li className="head-2">{props.profName}</li></ul> } */}
                <div className="d-flex gap-2 pb-3 mt-3"> <img className="mt-0 mb-1" style={{width:"13px"}} src="/images/healthSumImg1.svg"/>
              <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(props.userDetailOfPrimary)}</h5></div>
               {data?.professionalUserId ? <div className="row">
                    <div className=" d-flex justify-content-between">
                         <div className="sumPhysician" style={{width:"170px"}}>
                              <p>{props.profName}’s Full Name</p>
                              <h5>{$AHelper.capitalizeAllLetters(data?.fName + " " + data?.mName + " " + data?.lName)}</h5>
                         </div>
                         {props.proTypeId == '11' && <div className="sumPhysician" style={{width:"120px"}}>
                              <p>Speciality</p>
                              <h5><OtherInfo 
                                othersCategoryId={28} 
                                othersMapNatureId={data?.proCatId}  
                                FieldName={data?.proSubType}
                                userId={data?.professionalUserId} /></h5>
                         </div>}
                        { props.proTypeId != '11' ? ( <div className="sumPhysician" style={{width:"120px"}}>
                              <p>Business Name</p>
                              <h5>{$AHelper.capitalizeAllLetters(data?.businessName)}</h5> 
                         </div>): ""}
                          {props.proTypeId == '11' ? (  <div className="sumPhysician" style={{width:"130px"}}>
                              <p>WebsiteLink</p>
                              <h5 style={{wordBreak:"break-all"}}>{data?.websiteLink}</h5>
                         </div>): ""}
                         { props.proTypeId !== '11' ? ( <div className="sumPhysician" style={{width:"130px"}}>
                              <p>Business Type</p>
                              <h5>
                              <OtherInfo  
                              othersCategoryId={30}  
                              othersMapNatureId={data?.proUserId}  
                              FieldName={data?.businessType} 
                              userId={data?.professionalUserId} /></h5>
                         </div>): ""} 
                         
                    </div>
                    <div className="d-flex justify-content-between pt-3">
                   { props.proTypeId !== '11' ? ( <div className="sumPhysician" style={{width:"170px"}}>
                              <p>WebsiteLink</p>
                              <h5>{data?.websiteLink}</h5>
                         </div>):"" }
                    <div className="sumPhysician" style={{width:"120px"}}>
                              <p>Suite No</p>
                              <h5>{address?.data?.addressLine2}</h5>
                         </div>
                         <div className="sumPhysician" style={{width:"130px"}}>
                              <p>Address</p>
                              <h5>{address?.data?.addressLine1}</h5>
                         </div>

                    </div>
                    
                    <div className="d-flex justify-content-between pt-3">
                    <div className="sumPhysician" style={{width:"170px"}}>
                         <p>Street</p>
                         <h5>{address?.data?.addressLine1.substring(0, address?.data?.addressLine1?.indexOf(",")) || address?.data?.addressLine1 }</h5>
                         </div>     
                    <div className="sumPhysician" style={{width:"120px"}}>
                              <p for="city">City</p>
                              <h5>{address?.data?.city}</h5>
                         </div> 
                         <div className="sumPhysician" style={{width:"130px"}}>
                              <p for="state">State</p>
                              <h5>{address?.data?.state}</h5>
                         </div>
                        
                    </div>
                    <div className="d-flex justify-content-between pt-3">
                    <div className="sumPhysician" style={{width:"170px"}}>
                              <p for="zip-code">Zip Code</p>
                              <h5>{address?.data?.zipcode}</h5>
                         </div>    
                    <div className="sumPhysician" style={{width:"120px"}}>
                              <p for="county">County</p>
                              <h5>{address?.data?.county}</h5>
                              </div>
                              
                         <div className="sumPhysician" style={{width:"130px"}}>
                              <p for="county-refrence">County Reference</p>
                              <h5>{address?.data?.countyRef}</h5>
                         </div>
                    </div>
                    <div className="sumPhysician pt-3">
                              {spouseUserId && spouseUserId != "null" && <div className="sumPhysician">
                                   <p for="county-refrence">Same professional for spouse</p>
                                   <h5>{sameAsSpouse ? "Yes" : "No"}</h5>
                              </div>}
                         </div>
                    <div className="d-flex pt-3">
                         <div className="sumPhysician" style={{width:"48.7%"}}>
                              <p className="ms-0 m-2">Cell Number</p>
                              {contact?.contact?.mobiles?.map(mobileEle => {
                                   return <h5 className="ms-0 m-2">{ mobileEle?.mobileNo ? mobileEle?.mobileNo.slice(0,-10)+ " "
                                   + $AHelper.formatPhoneNumber(mobileEle?.mobileNo.slice(-10)) : null}</h5>
                              })}
                         </div>
                         <div className="sumPhysician" style={{width:"64.8%"}}>
                              <p className="m-2">Email</p>
                              {contact?.contact?.emails?.map(emailEle => {
                                   return <h5 className="m-2 text-break">{emailEle?.emailId}</h5>
                              })}
                         </div>
                    </div>
               </div> : <p>(Not provided)</p>}
            </div>}
          </>
     );
}

export default CommProfSum;