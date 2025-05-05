import { useEffect, useState } from "react";
import { $AHelper } from "../../../../control/AHelper";
import konsole from "../../../../control/Konsole";
import OtherInfo from "../../../../asssets/OtherInfo";
const Bookkeeper = (props) => {
     const api = props.api

     konsole.log("apiapi",props.api)
     const userId=props.memberId
     const spouseUserId = props.memberId == sessionStorage.getItem('spouseUserId') ? sessionStorage.getItem("SessPrimaryUserId") : sessionStorage.getItem('spouseUserId');

     const [data, setData] = useState({
          fName: '',
          mName: '',
          lName: '',
     })
     const [contact, setContact] = useState({})
     const [address, setAddress] = useState({})
     const [metaData, setMetaData] = useState([])
     // const [companyname, setcompanyName] = useState()
     const[rerender,setRerender]=useState()

     const[happy,sethappy]=useState('')
     const[ disabledordie   ,setdisabledOrDie]=useState('')
     const [usedbookkeeper, setusedbookkeeper] = useState('')
     const [sameAsSpouse, setSameAsSpouse] = useState(false)
     
  

     useEffect(() => {
        if (userId !== "") {
             api.GetSearchProfessionals(userId, 12, "", "", "", "", "").then((res) => {
                  if (res.data.data) {
                       setData(res.data.data[0])
                       konsole.log("reserror",res.data.data[0].professionalUserId)
                       setRerender("rerender")

                       if(spouseUserId && spouseUserId != "null") {
                            api.GetSearchProfessionals(spouseUserId, 12, "", "", "", "", "").then((spouseProf) => {
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
                       api.GetUserSubject(res.data.data[0].professionalUserId, 0, 8, 0).then((res) => {
                            konsole.log("userIduser",userId)
                            if (res) {
                                 konsole.log("sdvzvhghvj", res)
                                 
                                 const responseData=res?.data?.data?.userSubjects;
                                 setMetaData(responseData)
                                 if(responseData?.length>0){
                                      const _happyRes=responseData?.filter(item=>item?.questionId==74);
                                      const _disableDie=responseData?.filter(item=>item?.questionId==75);
                                      const _userBookeeper=responseData?.filter(item=>item?.questionId==113);
                                      
                                      if(_happyRes?.length>0) sethappy(_happyRes[0]?.response) ;
                                      if(_disableDie?.length>0) setdisabledOrDie(_disableDie[0]?.response) ;
                                      if(_userBookeeper?.length>0) setusedbookkeeper(_userBookeeper[0]?.response) ;
                                      
                                 }
                            }
                       }
                       ).catch(error => konsole.log("apiError12", error));
                     
                  }
             }).catch((error) => {
                  konsole.log(error.response)
             })
        }
   }, [userId])


     konsole.log("addressaddress",address)

     return (
          <>
          { userId && (userId != "null") &&   <div className="content">
              <h5 className="Heading mt-3 mb-3 generate-pdf-main-color fs-6">{$AHelper.capitalizeAllLetters(props.userDetailOfPrimary)}</h5>
              {data?.professionalUserId ?  <div>

               <div className="row">
               <div className="row mb-2">
             
          <div className="row">

          <div className="col-2 pt-2"><label>Bookkeeper’s Full Name: </label></div>

          <div className="col-10"><input type="text"   id='fi-a-name' value={$AHelper.capitalizeAllLetters(data?.fName + " " + data?.mName + " " + data?.lName)} /></div>
       </div>    
         
     
          <div className="row">    
     <div className="col-2 pt-2"><label >Business Name: </label></div>

     <div className="col-10"> <input type="text"   id='fi-a-company' value={$AHelper.capitalizeAllLetters(data?.businessName)} /></div>
     </div>
     </div>
     <div className="row pt-1">
          <div className="col-2 ">
            <label>
              Business Type:{" "}
            </label>
          </div>
          <div className="col-10 pt-2">
          <p style={{borderBottom:"1px solid #000"}} className="otherFontSize" ><OtherInfo  othersCategoryId={30}  othersMapNatureId={data?.proUserId}  FieldName={data?.businessType} userId={data?.professionalUserId} /></p>
          </div>
        </div>
        <div className="row pt-2">
          <div className="col-2 pt-2">
            <label>
              Website Link:{" "}
            </label>
          </div>
          <div className="col-10 pt-2">
          <input type="text" value={data?.websiteLink}></input>
          </div>
        </div>

     <div className="row mb-2 pt-2">
     <div className="col-4">
          <div className="row">
            <div className="col-3">   <label>Suit No: </label></div>
            <div className="col-9"> <input type="text"  id='fi-a-address' value={address?.data?.addressLine2} /></div>
            </div>
            </div>
            <div className="col-8">
          <div className="row">

            <div className="col-2"> <label className="pt-2">Address: </label></div>
            <div className="col-10"><p className="mb-0 m-2 mt-0 otherFontSize" type="text" style={{borderBottom:"1px solid #000"}}>{address?.data?.addressLine1}</p></div>  
            </div> 
            </div> 
            </div> 

             <div className="row mb-2">
            <div className="col-4">
          <div className="row">
            <div className="col-3">  <label>City: </label> </div>
            <div className="col-9"> <input type="text"   id='fi-a-city' value={address?.data?.city} /></div>
            </div>
            </div>

            <div className="col-8">
          <div className="row">
  <       div className="col-2"><label>State: </label> </div>
         <div className="col-10"> <input type="text"   id='fi-a-state' value={address?.data?.state} /></div>
         </div>
           </div>
           </div>


     <div className="row mb-2">
     <div className="col-4">
          <div className="row">

     <div className="col-3">   <label>County: </label></div>
     <div className="col-9"> <input type="text"   id='fi-a-county' value={address?.data?.county} /></div>
     </div>
     </div>
     <div className="col-8">
          <div className="row">
         <div className="col-3">   <label>County Refrence: </label></div>
         <div className="col-9"> <input type="text"   id='fi-a-zipcode' value={address?.data?.countyRef} /></div>
         </div>
          </div>
               </div>

               <div className="row mb-2">
          <div className="col-4">
          <div className="row">
               <div className="col-3">   <label>Zip Code: </label></div>
            <div className="col-9"> <input type="text"   id='fi-a-zipcode' value={address?.data?.zipcode} /></div>
            </div>
           </div>
         <div className="col-8">
          <div className="row">
           <div className="col-3">   <label>Cell Number (s): </label></div>
           <div className="col-9">{contact?.contact?.mobiles?.map(mobileEle => <input type="text"   
          value={$AHelper.newPhoneNumberFormat(mobileEle?.mobileNo) }
          // {$AHelper.pincodeFormatInContact(mobileEle?.mobileNo) +" "+ $AHelper.formatPhoneNumber((mobileEle?.mobileNo?.slice(0, 4) == "+254") ? mobileEle?.mobileNo : mobileEle?.mobileNo?.slice(-10))}
          />)}</div> </div>
          </div>
               </div>
                           
          <div className="row mb-2">
             <div className="row">
          <div className="col-1 pt-2 ">
            <label> Email:</label></div>
          <div className="col-7">
            {contact?.contact?.emails?.map(emailEle => <input type="text" value={emailEle?.emailId} />)}
          </div>
        </div>
        {spouseUserId && spouseUserId != "null" &&  <div className="row">
         <div className="col-12"><p>&nbsp;</p></div>
         <div className="col-6">  <label>Does your spouse use the same Bookkeeper?</label> </div>
         <div className="col-6"> <input type="checkbox" checked={sameAsSpouse} className="form-check-input m-4 mt-0"   id='fi-a-line2-y' /><span>Yes</span>  <input type="checkbox" checked={!sameAsSpouse}  className="form-check-input m-4 mt-0"  id='fi-a-line2-n' /><span>No</span></div>
         </div>}
           <div className="col-8">
          <div className="row">
        <div className="col-7">  <label>How long have you used this bookkeeper?</label> </div>
        <div className="col-5"> <input type="text" value={usedbookkeeper}  id='fi-a-line1' /></div>
        </div>
        </div>
     </div>
               
         <div className="row">
         <div className="col-12"><p>&nbsp;</p></div>
         <div className="col-6">  <label>Are you happy with this Bookkeeper?</label> </div>
         <div className="col-6"> <input type="checkbox" checked={(happy=="Yes")?true:""} className="form-check-input m-4 mt-0"   id='fi-a-line2-y' /><span>Yes</span>  <input type="checkbox" checked={(happy=="No")?true:""}  className="form-check-input m-4 mt-0"  id='fi-a-line2-n' /><span>No</span></div>
 
         <div className="col-6">   <label>Will there be a continuity of services if this Bookkeeper retires, becomes disabled, or dies?</label></div>
         <div className="col-6"> <input type="checkbox"   className="form-check-input m-4 mt-0"  id='fi-a-line3-y' checked={(disabledordie=="Yes")?true:""} /><span>Yes</span><input type="checkbox" className="form-check-input m-4 mt-0" id='fi-a-line3-n' checked={(disabledordie=="No")?true:""}  /><span>No</span></div>
         </div>
         </div>


       </div> : <p>(Not provided)</p>}
         <br />   
       </div>}
       </>
     );
}

export default Bookkeeper;