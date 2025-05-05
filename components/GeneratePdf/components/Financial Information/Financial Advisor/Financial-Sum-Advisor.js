import { useEffect, useState } from "react";
import { $AHelper } from "../../../../control/AHelper";
import konsole from "../../../../control/Konsole";
import OtherInfo from "../../../../asssets/OtherInfo";
import { Api } from './../../../helper/api'
import { isNotValidNullUndefile } from "../../../../Reusable/ReusableCom";

const FinancialSumAdvisor = (props) => {
  const api = props.api

  const userId = (props.memberId !== undefined && props.memberId !== '') ? props.memberId : '';
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
  // const [companyname, setCompanyName] = useState('')
  const [longusedadvisor, setlongusedadvisor] = useState('')
  const [sameAsSpouse, setSameAsSpouse] = useState(false)
  konsole.log("longusedadvisor", longusedadvisor)


  useEffect(() => {
    if (userId !== "") {

      api.GetSearchProfessionals(userId, 1, "", "", "", "", "").then((res) => {
        if (res.data.data) {
          setData(res.data.data[0])
          konsole.log("resdata", res)

          if(spouseUserId && spouseUserId != "null") {
            api.GetSearchProfessionals(spouseUserId, 1, "", "", "", "", "").then((spouseProf) => {
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
            if (res.data.data) {
              konsole.log("addressaddressRes", res)
              setAddress({ data: res.data.data.addresses[0] })
            }
          }).catch((error) => {
            konsole.log("addressaddressErr", error)
          })

          api.GetUserSubject(res.data.data[0].professionalUserId, 0, 6, 0).then((res) => {
            if (res) {
              konsole.log("tqeu", res)
              setMetaData(res.data.data.userSubjects)

              konsole.log("responseresres", res)
              // setCompanyName(res.data.data.userSubjects[0])
              setlongusedadvisor(res.data.data.userSubjects[0]?.response)

            }
          }).catch(error => konsole.log("apiError11", error));

        }
      }).catch((error) => {
        konsole.log("##########", error?.response)

      })
    //  konsole.log( metaData.some(v => v.questionId == 68 && v.response == "Yes"),"asasasa")

    }
  }, [userId])



  return (
    <>
    { userId && (userId != "null") &&     <div className="contain">    
         <div className="d-flex gap-2 pb-3 mt-3"> <img className="mt-0 mb-1" style={{width:"13px"}} src="/images/healthSumImg1.svg"/>
              <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(props.userDetailOfPrimary)}</h5></div>
       
      {data?.professionalUserId ? <div className="div-financial-addvisor">

      <div className=" d-flex justify-content-between pt-2">
          <div className="sumPhysician" style={{width:"170px"}}>
            <p> Advisor's Full Name</p>
            <h5>{$AHelper.capitalizeAllLetters(data?.fName + " " + data?.mName + " " + data?.lName)}</h5>
          </div>
          <div className="sumPhysician" style={{width:"120px"}}>
          <p>Company</p>
          <h5>{$AHelper.capitalizeAllLetters(data?.businessName)}</h5>
          </div>
          <div className="sumPhysician" style={{width:"130px"}}>
          <p>Business Type</p>
          <h5><OtherInfo  othersCategoryId={30}  othersMapNatureId={data?.proUserId}  FieldName={data?.businessType} userId={data?.professionalUserId}/></h5>
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
            <h5>{address?.data?.addressLine1.substring(0, address?.data?.addressLine1?.indexOf(",")) ||address?.data?.addressLine1b}</h5>
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
                  return <h5 className="ms-0 m-2">{mobileEle?.mobileNo ? 
                    <> {$AHelper.newPhoneNumberFormat(mobileEle?.mobileNo) }
                     {/* {$AHelper.pincodeFormatInContact(mobileEle?.mobileNo) +" "+ $AHelper.formatPhoneNumber((mobileEle?.mobileNo?.slice(0, 4) == "+254") ? mobileEle?.mobileNo : mobileEle?.mobileNo?.slice(-10))}  */}
                    </>
                   : null}</h5>
                })}
                </div>
            
              <div className="sumPhysician" style={{width:"64.8%"}}>
                <p className="m-2">Email</p>
                {contact?.contact?.emails?.map(emailEle => {
                  return <h5 className="m-2 text-break">{emailEle?.emailId} </h5>
                })}
              </div>
           
              </div>
            
            <div className="d-flex justify-content-between pt-4 ">
              {spouseUserId && spouseUserId != "null" && <div className="sumPhysician" style={{width:"48.7%"}}>
                <p for="county-refrence">Does your spouse use the same Financial Advisor?</p>
                <h5>{sameAsSpouse ? "Yes" : "No"}</h5>
              </div>}
              <div className="sumPhysician" style={{width:"51.3%"}}>
                <p>How long have you used this advisor?</p>
                <h5 min ="0" max="99">{metaData?.find((v)=>v.questionId == 65)?.response}</h5>
              </div>
            </div>

                <div className="contain">
              <div className="d-flex pt-3">
                {/* <div className="sumPhysician pb-3" style={{width:"50%"}}>
                  <p>Are you happy with this financial advisor?</p>
                  {metaData.length > 0  && 
                 <h5>{metaData?.some(v => v?.questionId == 3 && v?.response == "Yes")?'Yes':'No'}</h5>
                 }
                  </div>  */}

                  <div className="sumPhysician pb-3" style={{width:"48.7%"}}>
                  <p>Are you comfortable with your current Financial Advisor?</p>
                  {metaData.length > 0  && 
                 <h5>{metaData?.find(v => v?.questionId == 66 && isNotValidNullUndefile(v?.response) == true)?.response ?? ""}</h5>
                 }
                  </div>
                  <div className="sumPhysician pb-3" style={{width:"51.3%"}}>
                  <p>Do you worry about the adequacy of your assets?</p>
                 {metaData.length > 0  && 
                 <h5>{metaData?.find(v => v?.questionId == 67 && isNotValidNullUndefile(v?.response) == true)?.response ?? ""}</h5>
                 }
                  </div> 
              </div>
            </div>

            <div className="contain">
              <div className="d-flex pt-2">
                  <div className="sumPhysician pb-3" style={{width:"48%"}}>
                  <p>Do you consider your financial planner to be anything more than an investment advisor?</p>
                 {metaData.length > 0  && 
                 <h5>{metaData?.find(v => v?.questionId == 68 && isNotValidNullUndefile(v?.response) == true)?.response ?? ""}</h5>
                 } 
            </div>
            <div className="sumPhysician pb-3 ps-1" style={{width:"51.7%"}}>
                  <p>Will there be a continuity of services if this advisor retires, becomes disabled, or dies?</p>
                  {metaData.length >0  && 
                 <h5>{metaData?.find(v => v?.questionId == 69 && isNotValidNullUndefile(v?.response) == true)?.response ?? ""}</h5>
                 }
                  </div> 
              </div>
            </div>
 
        <div className="contain">
              <div className="d-flex pt-2">
                  <div className="sumPhysician pb-3" style={{width:"48.7%"}}>
                  <p>Are you open to as second opinion?</p>
                  {metaData.length >0  && 
                 <h5>{metaData?.find(v => v?.questionId == 70 && isNotValidNullUndefile(v?.response) == true)?.response ?? ""}</h5>
                 }
                  </div>
                  <div className="sumPhysician pb-3" style={{width:"51.3%"}}>
                  <p>Do you understand your investment costs?</p>
                  {metaData.length >0  && 
                 <h5>{metaData?.find(v => v?.questionId == 71 && isNotValidNullUndefile(v?.response) == true)?.response ?? ""}</h5>
                 }
                  </div> 
              </div>
            </div>

               {/* <div className="contain">
              <div className="d-flex pt-4">
                <div className="sumPhysician pb-3" style={{width:"50%"}}>
                  <p>Do you understand the cost of investment?</p>
                  {metaData.length >0  && 
                 <h5>{metaData?.some(v => v?.questionId == 71 && v?.response == "Yes")?'Yes':'No'}</h5>
                 }
                  </div>  */}

                  {/* <div className="sumPhysician pb-3" style={{width:"50%"}}>
                  <p>What services does your financial advisor provide to you besides investment advice? </p>
                <h5>{""}</h5>
                  </div> */}
              {/* </div>
            </div> */}
        <br />
      </div>: <p>(Not provided)</p>}
    </div>}
    </>
  );
};

export default FinancialSumAdvisor;
