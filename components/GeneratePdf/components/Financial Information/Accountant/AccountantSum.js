import { useEffect, useState } from "react";
import { $AHelper } from "../../../../control/AHelper";
import konsole from "../../../../control/Konsole";
import OtherInfo from "../../../../asssets/OtherInfo";
const AccountantSum = (props) => {
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
     const [metaData, setMetaData] = useState([])
     // const [companyname, setcompanyName] = useState()
     const[rerender,setRerender]=useState()

     const[happy,sethappy]=useState('')
     const[ disabledordie   ,setdisabledOrDie]=useState('')
     const [usedaccountant, setusedaccountant] = useState('')
     const [sameAsSpouse, setSameAsSpouse] = useState(false)
     
  

     useEffect(() => {
          if (userId !== "") {
               api.GetSearchProfessionals(userId, 3, "", "", "", "", "").then((res) => {
                    if (res.data.data) {
                         setData(res.data.data[0])
                         konsole.log("reserror",res.data.data[0].professionalUserId)
                         setRerender("rerender")

                         if(spouseUserId && spouseUserId != "null") {
                              api.GetSearchProfessionals(spouseUserId, 3, "", "", "", "", "").then((spouseProf) => {
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
                         api.GetUserSubject(res.data.data[0].professionalUserId, 0, 7, 0).then((res) => {
                              konsole.log("userIduser",userId)
                              if (res) {
                                   konsole.log("sdvzhvj", res)
                                   setMetaData(res.data.data.userSubjects)
                                   // setcompanyName(res.data.data.userSubjects[0])
                                   sethappy(res.data.data?.userSubjects[0]?.response)
                                   setdisabledOrDie(res.data.data?.userSubjects[1]?.response)
                                   setusedaccountant(res.data.data?.userSubjects[2]?.response)

                              }
                         }).catch(error => konsole.log("apiError12", error));
                       
                    }
               }).catch((error) => {
                    konsole.log(error.response)
               })
          }
     }, [userId])


     konsole.log("addressaddress",address)
     return (
          <>
           { userId && (userId != "null") &&  <div className=" contain">
               <div className="d-flex gap-2 pb-3 mt-3"> <img className="mt-0 mb-1" style={{width:"13px"}} src="/images/healthSumImg1.svg"/>
              <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(props.userDetailOfPrimary)}</h5></div>
               {data?.professionalUserId ? <div className="row">
                  

          <div className=" d-flex justify-content-between pt-2">
               <div className="sumPhysician" style={{width:"170px"}}>
               <p>Accountant’s Full Name</p>
               <h5>{$AHelper.capitalizeAllLetters(data?.fName + " " + data?.mName + " " + data?.lName)}</h5>
               </div>
               <div className="sumPhysician" style={{width:"120px"}}>
               <p>Company</p>
               <h5>{$AHelper.capitalizeAllLetters(data?.businessName)}</h5>
               </div>
               <div className="sumPhysician" style={{width:"130px"}}>
               <p>Business Type</p>
              <h5> <OtherInfo  othersCategoryId={30}  othersMapNatureId={data?.proUserId}  FieldName={data?.businessType} userId={data?.professionalUserId} /></h5>
               </div>
          </div>    

          <div className="d-flex justify-content-between pt-3">
          <div className="sumPhysician" style={{width:"170px"}}>
              <p>WebsiteLink</p>
              <h5>{data?.websiteLink}</h5>
            </div>
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

            <div className="d-flex justify-content-between pt-3 ">
            <div className="sumPhysician" style={{width:"48.7%"}}>
                <p className="ms-0 m-2">Cell Number</p>
                {contact?.contact?.mobiles?.map(mobileEle => {
                    return <h5 className="ms-0 m-2">{ mobileEle?.mobileNo ? 
                    <>
                    {$AHelper.newPhoneNumberFormat(mobileEle?.mobileNo)}
                         {/* {$AHelper.pincodeFormatInContact(mobileEle?.mobileNo) +" "+ $AHelper.formatPhoneNumber((mobileEle?.mobileNo?.slice(0, 4) == "+254") ? mobileEle?.mobileNo : mobileEle?.mobileNo?.slice(-10))}  */}
                    </>
                     : null}</h5>
                })}
                </div>
                <div className="sumPhysician" style={{width:"64%"}}>
                    <p className="m-2">Email</p>
                    {contact?.contact?.emails?.map(emailEle => {
                         return <h5 className="m-2" style={{wordBreak:"break-word"}}>{emailEle?.emailId}</h5>
                    })}
               </div>
            </div>
                
              <div className="d-flex pt-3">
               {spouseUserId && spouseUserId != "null" && <div className="sumPhysician" style={{width:"48.7%"}}>
                    <p for="county-refrence">Does your spouse use the same Accountant?</p>
                    <h5>{sameAsSpouse ? "Yes" : "No"}</h5>
               </div>}
              <div className="sumPhysician" style={{width:"61.3%"}}>
                <p>How long have you used this Accountant?</p>
                <h5 min ="0" max="99">{metaData?.find((v)=>v.questionId == 115)?.response}</h5>
              </div>
              </div>
              <div className="d-flex pt-5">
              <div className="sumPhysician" style={{width:"48.7%"}}>
                <p>Are you happy with this Accountant?</p>
                <h5>{happy}</h5>
              </div>
              <div className="sumPhysician" style={{width:"61.3%"}}>
                <p>Will there be a continuity of services if this Accountant retires, becomes disabled, or dies?</p>
                <h5>{disabledordie}</h5>
              </div>
              </div>

        {/* <div className="row">
        <div className="col-12"><p>&nbsp;</p></div>
        <div className="col-6">  <label>Are you happy with this accountant?</label> </div>
        <div className="col-6"> <input type="checkbox" checked={(happy=="Yes")?true:""} className="form-check-input m-4 mt-0"   id='fi-a-line2-y' /><span>Yes</span>  <input type="checkbox" checked={(happy=="No")?true:""}
          className="form-check-input m-4 mt-0"  id='fi-a-line2-n' /><span>No</span> </div>
 
        <div className="col-6">   <label>Will there be a continuity of services if this accountant retires, becomes disabled, or dies?</label></div>
        <div className="col-6"> <input type="checkbox"   className="form-check-input m-4 mt-0"  id='fi-a-line3-y' checked={(disabledordie=="Yes")?true:""} /><span>Yes</span><input type="checkbox"
         className="form-check-input m-4 mt-0" id='fi-a-line3-n' checked={(disabledordie=="No")?true:""}  /><span>No</span></div>
        </div> */}

         </div> : <p>(Not provided)</p>}
        <br /> {(props?.refrencePage !="SummaryDoc") && 
               <p className='p1 generate-pdf-main-color'>Please provide the following financial information.  This information allows us to better determine which legal devices will best meet your retirement planning needs.</p>}
          </div>}
          </>
     );
}

export default AccountantSum;