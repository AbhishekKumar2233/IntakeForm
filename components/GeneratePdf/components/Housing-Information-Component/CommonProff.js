import { useEffect, useState } from "react";
import { $AHelper } from "../../../control/AHelper";
import konsole from "../../../control/Konsole";
import OtherInfo from "../../../asssets/OtherInfo";
const CommProff = (props) => {
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
            { userId && (userId != "null") && <div className="contain">
                {/* <p className="Heading mt-3 mb-3 generate-pdf-main-color fs-6">{props.profName}</p> */}
                <h5 className="Heading mt-3 mb-3 generate-pdf-main-color fs-6">{$AHelper.capitalizeAllLetters(props.userDetailOfPrimary)}</h5>
               {data?.professionalUserId ? <div className="row">
                   
                         <div className="d-flex pb-2">
                              <div className="col-2">
                              <label className="pt-2">{props.profName}’s Full Name:</label>
                              </div>
                              <div className="col-9 ps-3">
                              <input type="text" value={$AHelper.capitalizeAllLetters(data?.fName + " " + data?.mName + " " + data?.lName)}></input>
                         </div>
                         </div>
                         { props.proTypeId == "11" && <div className="d-flex"> <div className="m-0 col-2">
                              <label className="pt-2">Speciality:</label>
                              </div>
                              <div className="pt-2">
                              <p style={{borderBottom:"1px solid #000"}} className="long-input otherFontSize">
                              <OtherInfo 
                                othersCategoryId={28} 
                                othersMapNatureId={data?.proCatId}  
                                FieldName={data?.proSubType}
                                userId={data?.professionalUserId} /></p>
                         </div> </div>}

                        { props.proTypeId != '11' ? ( <div className="d-flex">
                         <div className="m-0 col-2">
                              <label className="pt-3">Business Name:</label>
                              </div>
                              <div className="col-10">
                              <input type="text" value={$AHelper.capitalizeAllLetters(data?.businessName)}></input>
                         </div>
                         </div>) :""}
                        
                         { props.proTypeId !== '11' ? (  <>
                         <div className="col-2">
                              <label className="pt-3">Business Type:</label>
                              </div>
                              <div className="col-10 ps-0 pt-3">
                              <p className="otherFontSize pt-3" style={{borderBottom:"1px solid #000"}}>
                              <OtherInfo  
                              othersCategoryId={30}  
                              othersMapNatureId={data?.proUserId}  
                              FieldName={data?.businessType} 
                              userId={data?.professionalUserId} /></p>
                         </div></>):""}
                         { props.proTypeId !== '11' ? (  <>
                         <div className="d-flex">
                         <div className="col-2 pt-2">
                              <label className="pt-2">Website Link</label>
                              </div>
                              <div className="col-10 ps-0 pt-2 otherFontSize ">
                              <input type="text" value={data?.websiteLink}></input>
                         </div></div></>):""}
                         
                         { props. proTypeId == 11 &&  <div className="d-flex pt-2">
                       <div className="">
                         <label className="pt-3">Clinic Name</label>
                         </div>
                         <div className="col-4 ps-3">
                         {/* <input type="text" value= {$AHelper.capitalizeAllLetters(data?.businessName)}></input> */}
                         <p className="pt-3  otherFontSize" style={{borderBottom:"1px solid #000", wordBreak:"break-all"}}>{$AHelper.capitalizeAllLetters(data?.businessName)}</p>
                         </div>
                         <div className="ps-3">
                              <label className="pt-3">Website Link</label>
                              </div>
                              <div className="col-5 pt-1" >
                              {/* <input type="text" value={data?.websiteLink} ></input> */}
                              <p className="pt-2 ms-2 otherFontSize" style={{borderBottom:"1px solid #000", wordBreak:"break-all"}}>{data?.websiteLink}</p>
                         </div>
                         </div>}

                         <div className="d-flex pt-2">
                         <div className="">
                         <label className="pt-3">Suite No</label>
                         </div>
                         <div className="col-2 ps-3">
                         <input type="text" value= {address?.data?.addressLine2}></input>
                         </div>
                         <div className="ps-3">
                              <label className="pt-3">Address</label>
                              </div>
                              <div className="col-8 pt-3" >
                              <p className="mb-0 m-2 mt-0 otherFontSize" type="text" style={{borderBottom:"1px solid #000"}}>{address?.data?.addressLine1}</p>
                         </div>
                         </div>
                         <div className="d-flex pt-4">
                              <div className="">
                              <label className="pt-2">Street</label>
                              </div>
                              <div className="col-5 ps-3">
                              <input type="text" value={address?.data?.addressLine1.substring(0, address?.data?.addressLine1?.indexOf(",")) || address?.data?.addressLine1 }></input>
                         </div>
                        
                         <div className="ps-5 m-0">
                              <label className="pt-2">City</label>
                              </div>
                              <div className="col-3 ps-3">
                              <input type="text" value={address?.data?.city}></input>
                         </div>
                         </div>

                         <div className="d-flex pt-3">
                         <div className="">
                         <label className="pt-2">State</label>
                         </div>
                         <div className="col-3 ps-3">
                         <input type="text" value= {address?.data?.state}></input>
                         </div>
                         <div className="ps-4">
                              <label className="pt-2">Zip Code</label>
                              </div>
                              <div className="col-2 ps-2">
                              <input type="text" value={address?.data?.zipcode}></input>
                         </div>
                         <div className="ps-4">
                              <label className="pt-2">County</label>
                              </div>
                              <div className="col-4 ps-3">
                              {/* <input type="text" value={address?.data?.county}></input> */}
                              <p className="pt-2" style={{borderBottom:"1px solid #000", wordBreak:"break-all"}}>{address?.data?.county}</p>
                         </div>
                         </div>
                          
                         <div className="d-flex pt-3">
                              <div className="">
                              <label className="pt-2">County Reference</label>
                              </div>
                              <div className="col-3 ps-2">
                              <input type="text" value={address?.data?.countyRef}></input>
                         </div>
                        
                         <div className="ps-4">
                              <label className="pt-2">Same professional for spouse</label>
                              </div>
                              <div className="col-3 ps-2">
                              <input type="text" value={sameAsSpouse ? "Yes" : "No"}></input>
                         </div>
                         </div>
                         <div className="d-flex pt-3">
                              <div className="">
                              <label className="pt-2">Cell Number</label>
                              </div>
                              <div className="col-3 ps-2">
                                   {contact?.contact?.mobiles?.map(mobileEle => {
                                        return <input type="text" 
                                        value={$AHelper.newPhoneNumberFormat(mobileEle?.mobileNo)}
                                        // {$AHelper.pincodeFormatInContact(mobileEle?.mobileNo) +" "+ $AHelper.formatPhoneNumber((mobileEle?.mobileNo?.slice(0, 4) == "+254") ? mobileEle?.mobileNo : mobileEle?.mobileNo?.slice(-10))}
                                        ></input>
                                   })}
                         </div>
                        
                         <div className=" col-1 ps-4 m-0">
                              <label className="pt-2">Email</label>
                              </div>
                              <div className="col-5 ps-3">
                                   {contact?.contact?.emails?.map(emailEle => {
                                        return <p className="otherFontSize pt-2" style={{borderBottom:"1px solid #000", wordBreak:"break-all"}} >{emailEle?.emailId}</p>
                                   })}
                         </div>
                         </div>
               </div> : <p>(Not provided)</p>}
            </div>}
            </>
     );
}

export default CommProff;