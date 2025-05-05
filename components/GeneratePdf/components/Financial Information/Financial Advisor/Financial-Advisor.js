import { useEffect, useState } from "react";
import { $AHelper } from "../../../../control/AHelper";
import konsole from "../../../../control/Konsole";
import { Api } from './../../../helper/api'
import OtherInfo from "../../../../asssets/OtherInfo";

const FinancialAdvisor = (props) => {
  const api = props.api

  const userId = (props.memberId !== undefined && props.memberId !== '') ? props.memberId : '';
  const spouseUserId = props.memberId == sessionStorage.getItem('spouseUserId') ? sessionStorage.getItem("SessPrimaryUserId") : sessionStorage.getItem('spouseUserId');


  const [data, setData] = useState({
    fName: '',
    mName: '',
    lName: '',
  })
  const [contact, setContact] = useState({})
  const [address, setAddress] = useState({})
  const [metaData, setMetaData] = useState([])
  const [sameAsSpouse, setSameAsSpouse] = useState(false)
  // const [companyname, setCompanyName] = useState('')
  const [longusedadvisor, setlongusedadvisor] = useState('')
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


    }
  }, [userId])



  return (
    <>
      { userId && (userId != "null") &&  <div className="content">

      <h5 className="Heading mt-3 mb-3 generate-pdf-main-color fs-6">{$AHelper.capitalizeAllLetters(props.userDetailOfPrimary)}</h5>

      {data?.professionalUserId ? <div className="div-financial-addvisor">

        <div className="row">
          <div className="col-2 pt-2">
            <label>
              Advisor's Full Name:{" "}
            </label>
          </div>
          <div className="col-10">
            <input type="text" value={$AHelper.capitalizeAllLetters(data?.fName + " " + data?.mName + " " + data?.lName)} />
          </div>
        </div>

        <div className="row">
          <div className="col-2 pt-2">
            <label>
              Business Name:{" "}
            </label>
          </div>
          <div className="col-10">
            <input type="text" value={$AHelper.capitalizeAllLetters(data?.businessName)} />
          </div>
        </div>
        <div className="row pt-2">
          <div className="col-2 pt-2">
            <label>
              Business Type:{" "}
            </label>
          </div>
          <div className="col-10 pt-2">
          <p style={{borderBottom:"1px solid #000"}} className="otherFontSize"><OtherInfo  othersCategoryId={30}  othersMapNatureId={data?.proUserId}  FieldName={data?.businessType} userId={data?.professionalUserId} /></p>
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

        <div className="row p-1 pt-2">
          <div className="col-3">
            <div className="row">
              <div className="col-2 p-2"><label>Suit No:</label></div>
              <div className="col-10"><input type="text" value={address?.data?.addressLine2} /></div>

            </div>
        
        
        </div>
          <div className="col-8">
              <div className="row">
              <div className="col-2 pt-2"><label>Address:</label></div>
              <div className="col-10 pt-2">
               <p className="mb-0 m-2 mt-0 otherFontSize" type="text" style={{borderBottom:"1px solid #000"}}>{address?.data?.addressLine1}</p>
               </div>
            </div>
        
        </div>
        </div>

        <div className="row p-1">
          <div className="col">
            <div className="row">
              <div className="col-2 p-2"><label>City</label></div>
              <div className="col-10"><input type="text" value={address?.data?.city} /></div>
            </div>
          </div>
          <div className="col">
            <div className="row">
              <div className="col-3 p-2">
                <label>State</label>
              </div>
              <div className="col-9">
                <input type="text" value={address?.data?.state} />
              </div>

            </div>
          </div>
        </div>

     
        <div className="row p-1">
          <div className="col-6">
            <div className="row">
              <div className="col-3 p-2"><label>Zip Code:</label></div>
              <div className="col-9"><input type="text" value={address?.data?.zipcode} /></div>
            </div>
            
           
          </div>
          <div className="col-6">
            <div className="row">
              <div className="col-3 p-2"><label>County:</label></div>
              <div className="col-9"><input type="text" value={address?.data?.county} /></div>
            </div>
            
           
          </div>
          </div>
          <div className="row p-1">
          
          <div className="col">
            <div className="row">
              <div className="col-3 p-2">
                <label>County Refrence</label>
              </div>
              <div className="col-9">
                <input type="text" value={address?.data?.countyRef} />
              </div>

            </div>
          </div>
          <div className="col">
            <div className="row">
              <div className="col-3 p-2">
                <label>Cell Number (s):{" "}</label>
              </div>
              <div className="col-9">
                {contact?.contact?.mobiles?.map(mobileEle => {
                  return <input type="text" 
                  value={$AHelper.newPhoneNumberFormat(mobileEle?.mobileNo) }
                  // {$AHelper.pincodeFormatInContact(mobileEle?.mobileNo) +" "+ $AHelper.formatPhoneNumber((mobileEle?.mobileNo?.slice(0, 4) == "+254") ? mobileEle?.mobileNo : mobileEle?.mobileNo?.slice(-10))}
                   />
                
                })}
              </div>

            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-1 pt-2 ">
            <label>
              Email:
            </label>
          </div>
          <div className="col-7">
            {contact?.contact?.emails?.map(emailEle => <input type="text" value={emailEle?.emailId} />)}
          </div>
        </div>

        {spouseUserId && spouseUserId != "null" && <div className="row">
<div className="col-12"><p>&nbsp;</p></div>
 <div className="col-6">  <label> Does your spouse use the same Financial Advisor?</label> </div>
 {konsole.log(sameAsSpouse,"sameAsSpouse")}
<div className="col-6"> <input type="checkbox" checked={sameAsSpouse} className="form-check-input m-4 mt-0"   id='fi-a-line2-y' /><span>Yes</span>  <input type="checkbox" checked={!sameAsSpouse}  className="form-check-input m-4 mt-0"  id='fi-a-line2-n' /><span>No</span>
</div>
 
</div>}

        <div className="row">
          <div className="col-4 pt-2">
            <label>
              How long have you used this advisor?
            </label>
          </div>
          <div className="col-6">
            <input type="text" value={metaData?.find((v)=>v.questionId == 65)?.response} min="0" max="99"/>
          </div>
        </div>

        {/* <div className="row mt-3 paddTop">
          <div className="col-4" >Are you happy with this financial advisor?</div>
          <div className="col-8">
            <input type="checkbox" id="fi-fa-line2-y" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 3 && v.response == "Yes")} />
            <span className="   ">Yes</span>
            <input type="checkbox" id="fi-fa-line2-n  " className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 3 && v.response == "No")} />
            <span className="  ">No</span>
          </div>
        </div> */}



        <div className="row mt-3">
          <div className="col-4" >Are you comfortable with your current Financial Advisor?</div>
          <div className="col-8">
            <input type="checkbox" id="fi-fa-line3-y" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 66 && v.response == "Yes")} /><span>Yes</span>
            <input type="checkbox" id="fi-fa-line3-n" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 66 && v.response == "No")} /><span>No</span>
            <input type="checkbox" id="fi-fa-line3-n" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 66 && v.response == "Unsure")} /><span>Unsure</span>
          </div>
        </div>



        <div className="row mt-3">
          <div className="col-4" >Do you worry about the adequacy of your assets?</div>
          <div className="col-8">
            <input type="checkbox" id="fi-fa-line4-y" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 67 && v.response == "Yes")} /><span>Yes</span>
            <input type="checkbox" id="fi-fa-line4-n" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 67 && v.response == "No")} /><span>No</span>
            <input type="checkbox" id="fi-fa-line4-n" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 67 && v.response == "Unsure")} /><span>Unsure</span>
          </div>
        </div>





        <div className="row mt-3 paddTop">
          <div className="col-4" >Do you consider your financial planner to be anything more than an
            investment advisor?</div>
          <div className="col-8">
            <input type="checkbox" id="fi-fa-line5-y" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 68 && v.response == "Yes")} /><span>Yes</span>
            <input type="checkbox" id="fi-fa-line5-n" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 68 && v.response == "No")} /><span>No</span>
            <input type="checkbox" id="fi-fa-line5-n" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 68 && v.response == "Unsure")} /><span>Unsure</span>
          </div>
        </div>


        <div className="row mt-3">
          <div className="col-4" >Will there be a continuity of services if this advisor retires,
            becomes disabled, or dies?</div>
          <div className="col-8">
            <input type="checkbox" id="fi-fa-line6-y" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 69 && v.response == "Yes")} /><span>Yes</span>
            <input type="checkbox" id="fi-fa-line6-n" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 69 && v.response == "No")}></input><span>No</span>
            <input type="checkbox" id="fi-fa-line6-n" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 69 && v.response == "Unsure")}></input><span>Unsure</span>
          </div>
        </div>



        <div className="row mt-3">
          <div className="col-4" >Are you open to as second opinion?</div>
          <div className="col-8">
            <input type="checkbox" id="fi-fa-line7-y" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 70 && v.response == "Yes")} /><span>Yes</span>
            <input type="checkbox" id="fi-fa-line7-n" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 70 && v.response == "No")} /><span>No</span>
            <input type="checkbox" id="fi-fa-line7-n" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 70 && v.response == "Unsure")} /><span>Unsure</span>
          </div>
        </div>




        <div className="row mt-3 n paddTop">
          <div className="col-4" >Do you understand your investment costs?</div>
          <div className="col-8">
            <input type="checkbox" id="fi-fa-line8-y" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 71 && v.response == "Yes")} /><span>Yes</span>
            <input type="checkbox" id="fi-fa-line8-n" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 71 && v.response == "No")} /><span>No</span>
            <input type="checkbox" id="fi-fa-line8-n" className="form-check-input m-4 mt-0" checked={metaData.length > 0 && metaData.some(v => v.questionId == 71 && v.response == "Unsure")} /><span>Unsure</span>
          </div>
        </div>

        {/* <div className="section paddTop ">
          <div className="row">
            <div className="col-4  "> What services does your financial advisor provide to you besides investment advice? </div>

            <div className="col-8"> <input type="text" className="tbordernotop" id="fi-fa-line9" /> <input type="text" className="tbordernotop" id="fi-fa-line9" />
              <input type="text" className="tbordernotop " id="fi-fa-line10" /> </div>


          </div>
        </div> */}


        <div className="row">
          <div className="col-4" > </div>
          <div className="col-6">   </div>

          <div className="col-2" >   </div>

        </div>

        <br />
      </div> : <p>(Not provided)</p>}
    </div>}
    </>
  );
};

export default FinancialAdvisor;
