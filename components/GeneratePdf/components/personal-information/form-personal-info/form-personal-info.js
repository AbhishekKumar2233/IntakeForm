import { useEffect, useState } from "react";
import { $AHelper } from "../../../../control/AHelper";
import konsole from "../../../../control/Konsole";
import { getApiCall, isNotValidNullUndefile } from "../../../../Reusable/ReusableCom";
import { Form, Col,Row } from "react-bootstrap";
import { livingMemberStatusId,deceaseMemberStatusId } from "../../../../Reusable/ReusableCom";
// import { $CommonServiceFn } from "../../../../network/Service";
import { $Service_Url } from "../../../../network/UrlPath";
import AlsoKnownAs from "../../../../AlsoKnownAs";

const FormPersonalInfo = (props) => {
  konsole.log("4", props.contact);

  const isFiduciary = props?.memberData?.memberRelationship?.isFiduciary;
  const isBeneficiary = props?.memberData?.memberRelationship?.isBeneficiary;
  const memberStatusId = props?.memberData?.memberStatusId ?? livingMemberStatusId;
  const emergencyContact = props?.memberData?.memberRelationship?.isEmergencyContact


  const [suffixList, setsuffixList] = useState([]);
  const [genderList, setgenderList] = useState([]);


  // const genderId = props?.memberData?.genderId;
  // const suffixId = props?.memberData?.suffixId;
  
  let maritalStatusId = sessionStorage.getItem("maritalStatusId");
  let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))

  useEffect(()=>{
    fetchApiCall()
  },[])

  const [
    primaryContactTypeId,
    secondaryContactTypeId,
    workContactTypeId,
    homeContactTypeId,
  ] = [1, 2, 3, 4];

  const emails = props.contact?.contact.emails;
  const mobiles = props.contact?.contact.mobiles;
  const usrOccupation = props?.userOccupation;
  const UserRetirementAge = props?.UserRetirementAge;

  const veteran = props.veteran ?? {};

  const Occupation =
    usrOccupation !== null && usrOccupation !== undefined ? usrOccupation : "";
  const ageOfRetirement =
    UserRetirementAge !== null && UserRetirementAge !== undefined
      ? UserRetirementAge
      : "";

  const primaryEmail =
    getContact(emails, primaryContactTypeId) != null
      ? getContact(emails, primaryContactTypeId)
      : "Not Available";
  const primaryMobile =
    getContact(mobiles, primaryContactTypeId) != null
      ? getContact(mobiles, primaryContactTypeId)
      : "Not Available";

  const homeMobile =
    getContact(mobiles, homeContactTypeId) != null
      ? getContact(mobiles, homeContactTypeId)
      : "Not Available";
  const workMobile =
    getContact(mobiles, workContactTypeId) != null
      ? getContact(mobiles, workContactTypeId)
      : "Not Available";

  const [data, setData] = useState();

  useEffect(() => {
    if (props.memberAddress !== undefined && props.memberAddress !== null) {
      holdData(props.memberAddress);
    }
  }, [props.memberAddress]);
  let data1;

  const holdData = (memberAddressData) => {
    konsole.log("memberAddressDatamemberAddressData", memberAddressData);
    data1 = memberAddressData;
    setData(memberAddressData);
  };

  konsole.log("DatamemberAddressData", data1);

  const fName = props.memberData !== undefined ? props.memberData.fName : "";
  const lName = props.memberData !== undefined ? props.memberData.lName : "";
  const mName =
    props.memberData !== undefined && props.memberData.mName !== null
      ? props.memberData?.mName
      : "";
  const fullName = fName + " " + mName + " " + lName;
  const dob =
    props.memberData?.dob !== undefined && props.memberData?.dob !== null
      ? $AHelper.getFormattedDate(
          props.memberData.dob?.slice(0, props.memberData.dob.indexOf("T"))
        )
      : "";

      const dateOfWedding =
    props.memberData?.dateOfWedding !== undefined && props.memberData?.dateOfWedding !== null
      ? $AHelper.getFormattedDate(
          props.memberData.dateOfWedding?.slice(0, props.memberData.dateOfWedding.indexOf("T"))
        )
      : "";
  
  const birthPlace =
    props.memberData !== undefined ? props.memberData.birthPlace : "";
  const isVeteran =
    props.memberData !== undefined ? props.memberData.isVeteran : false;
  const memberRelationship =
    props.memberData !== undefined ? props.memberData.memberRelationship : "";
  const nickName =
    props.memberData !== undefined ? props.memberData.nickName : "";
  const noOfChildren =
    props.memberData !== undefined ? props.memberData.noOfChildren : 0;

  const addressLine1 = props.memberAddress !== undefined ? props.memberAddress.addressLine1 : "";
  let adrs1 = addressLine1.split(" ");
  const addressLine2 = props.memberAddress !== undefined ? props.memberAddress.addressLine2 : "";
  const addressLine3 =
    props.memberAddress !== undefined ? props.memberAddress.addressLine3 : "";
  const city =
    props.memberAddress !== undefined ? props.memberAddress.city : "";
  const country =
    props.memberAddress !== undefined ? props.memberAddress.country : "";
  const county =
    props.memberAddress !== undefined ? props.memberAddress.county : "";
  const state =
    props.memberAddress !== undefined ? props.memberAddress.state : "";
  const zipcode =
    props.memberAddress !== undefined ? props.memberAddress.zipcode : "";
  const lattitude =
    props.memberAddress !== undefined ? props.memberAddress.lattitude : "";
  const longitude =
    props.memberAddress !== undefined ? props.memberAddress.longitude : "";
  const [isUsCitizen, setIsUsCitizen] = useState();

  function getContact(arr, contactTypeId) {
    if (arr === undefined || arr === null) {
      return null;
    }
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].contactTypeId === contactTypeId) {
        return arr[i];
      }
    }
    return null;
  }
  const fetchApiCall = async () => {
        const _resultSuffix = await getApiCall("GET", $Service_Url.getNameSuffixPath,setsuffixList);
         const _resultgender = await  getApiCall('GET',$Service_Url.getGenderListPath,setgenderList)

        konsole.log("_resultSuffix",_resultSuffix,_resultgender)
  };   

  konsole.log("addressLine2", addressLine2);
  konsole.log("addressssss", addressLine1);
  konsole.log("veteran Suer", veteran);
  return (
    <div className="forPersonalInfoMain">
      {/* className="full-name"  id="i-full-name"*/}
      {/* <div className="row ">
        <div className="col"> */}
          <div className="row  m-0 p-1 mt-3">
            <div className="col-3 m-0 p-0 fullname  ">
              <label for="i-full-name" className="pt-1">Full name:</label>
            </div>
            <div className="col  m-0 p-0">
              <input type="text" className="fullnamecss  p-0 " value={$AHelper.capitalizeAllLetters(fullName)} />
            </div>
          </div>
        {/* </div>
      </div> */}
      {/*className='prev-name-and-dob' 
           className='div-prev-name',className='div-dob ,id="dob",id="prev-name"
           class="previous"*/}
      <div className="row p-1">
        <div className="col mt-2">
          <div className="row m-0 p-0">
            <div className="col-4 p-0 m-0">
              <label for="prev-name" className="pt-1">Nickname:</label>
            </div>
            <div className="col p-0 m-0">
              <input
                type="text"
                class="previous p-0"
                id="prev-name"
                value={$AHelper.capitalizeAllLetters(nickName)}
              ></input>
            </div>
          </div>
        </div>
        <div className="col pt-2">
          <div className="row ">
            <div className="col-3 p-0 m-0 ">
              <label for="dob" className="pt-1 ">Date of Birth:</label>
            </div>
            <div className="col pt-0 ">
              {/* <input type="text" id="dob" value={$AHelper.getFormattedDate(dob)} ></input> */}
              <input type="text" id="dob" className="p-0 " value={dob}></input>
            </div>
          </div>
        </div>
      </div>
      <div className="row p-1">
        {(props?.refrencePage == 'Primary') && <>
         { (maritalStatusId == 2 || maritalStatusId == 3) ? "" : <>
        <div className="col mt-2">
          <div className="row m-0 p-0">
            <div className="col-4 p-0 m-0">
              <label for="prev-name" className="pt-1 ">Date of Marriage:</label>
            </div>
            <div className="col p-0 m-0">
              <input type="text" class="previous p-0" id="prev-name" value={dateOfWedding}></input>
            </div>
          </div>
        </div></>}
        </>}
        <div className="col pt-2">
        {(props?.refrencePage == 'Primary') && <> 
            {(maritalStatusId == 1 || maritalStatusId == 2) && <>
                    <Form.Group as={Row} className="m-0 p-0">
                      { maritalStatusId == 2 ? (
                      <Col lg="12" className="m-0 p-0 mb-3 d-flex flex-wrap gap-4 align-items-center">
                        <div>
                          <Form.Check className="form-check-smoke" type="checkbox" id="isFiduciary" label={`${maritalStatusId == 2 ? "Fiduciary for Partner" : "Fiduciary for spouse"}`} checked={isFiduciary}/>
                        </div>
                        <div>
                          <Form.Check className="form-check-smoke" type="checkbox" id="isBeneficiary" label={`${maritalStatusId == 2 ? "Beneficiary of Partner" :"Beneficiary of spouse"}`} checked={isBeneficiary}/>
                        </div>
                      </Col>
                      ) :(
                        <Col lg="12" className="m-0 p-0 mb-3 d-flex flex-wrap gap-4 align-items-center w-100">
                        <div>
                          <Form.Check className="form-check-smoke" type="checkbox" id="isFiduciary" label="Fiduciary for Spouse" checked={isFiduciary}/>
                        </div>
                        <div>
                          <Form.Check className="form-check-smoke" type="checkbox" id="isBeneficiary" label="Beneficiary of Spouse" checked={isBeneficiary}/>
                        </div>
                      </Col>
                          )}
                    </Form.Group>
                  </> }
                  </> }
                  </div>
               </div>
              <div className="col pt-1">
                  {(props?.refrencePage == 'Spouse') && <> 
                    {(maritalStatusId == 1 || maritalStatusId == 2) && <>
                  <Form.Group as={Row} className="m-0 p-0 ">
                  <Col lg="12" className="m-0 p-0 mb-2 d-flex flex-wrap gap-4 align-items-center w-100"> 
                    <div>
                    {(memberStatusId == livingMemberStatusId) && <>
                    <Form.Check
                    className="form-check-smoke"
                    type="checkbox"
                    id="isFiduciary"
                    label={`${`Fiduciary for ${userDetailOfPrimary.memberName}`}`}
                    checked={isFiduciary}
                  /> 
                     </>}
                  </div>
                  {(memberStatusId != deceaseMemberStatusId) && <>
                    <div>
                    <Form.Check
                    className="form-check-smoke "
                    type="checkbox"
                    id="isBeneficiary"
                    label={`${`Beneficiary of ${userDetailOfPrimary.memberName}`}`}
                    checked={isBeneficiary}
                  />
                   </div>
                   </>}
                  </Col>                 
                </Form.Group> 
                </> }
                  </> }      
                </div>

        <div className="row m-0 pb-2 pt-1">
            <div className="col-2 p-0 m-0">
              <label for="prev-name" className="pt-1 ">Also Known As:</label>
            </div>
            <div className="col-4 p-0 m-0">
            <AlsoKnownAs setLoader = {props.dispatchloader} userId={props.userId} valueforPDF={true}/>
            </div>
                </div>
                <div className="mt-1 d-flex gap-4 mt-2" >
                  <label >Make this as an emergency contact ?</label>
                 <div>
                <Form.Check type="checkbox" className="left-radio" name="emergency" inline label="Yes" checked={emergencyContact} />
                <Form.Check type="checkbox" className="left-radio" name="emergency" inline label="No" checked={!emergencyContact} />
                </div>
             
              
              <div className="row ">
               <div className="col-3 p-0 m-0 ">
              <label for="dob" className="pt-1 ">Prefix/Suffix:</label>
              </div>
            <div className="col-8 pt-0 ps-5 " id="suffixId">
           <input type="text" value={suffixList?.find(item => item.value == props?.memberData?.suffixId)?.label}/>
            </div>
                </div>
               
                  </div>
              <div className="col-6 pt-2 pb-2">
             <div className="row">
            <div className="col-4  ">
              <label for="occupation-name" className="pt-1">Gender: </label>
            </div>
            <div className="col-8 pt-0" id="genderId">
           <input type="text" value={genderList?.find(item => item.value == props?.memberData?.genderId)?.label} />   
            </div>
          </div>
        </div> 

       
      {/*className='occupation-pob'  className='div-occupation' id="occupation-name" className='div-pob'*/}

      <div className="row p-1">
        <div className="col-6 pt-2">
          <div className="row">
            <div className="col-4  ">
              <label for="occupation-name" className="pt-1">Occupation: </label>
            </div>
            <div className="col-8 pt-0">
              <input
                type="text"
                className="p-0"
                id="occupation-name"
                value={Occupation}
              ></input>
            </div>
          </div>
        </div>

        <div className="col-6 p-1 pt-2">
          <div className="row">
            <div className="col-7">
              <label for="ageOfRetirement" className=" pt-1">
                At what age do you anticipate retiring?
              </label>
            </div>
            <div className="col pt-0">
              <input
                type="text"
                className="p-0"
                id="ageOfRetirement"
                value={ageOfRetirement}
              ></input>
            </div>
          </div>
        </div>

        <div className="col-6 ">
          <div className="row pt-3 ">
            <div className="col-4 ">
              <label for="pob" className="pt-1 ">Place Of Birth:</label>
            </div>
            <div className="col  p-0 pt-1 ">
            <p  className="mb-0 otherFontSize "type="text"style={{borderBottom: birthPlace == undefined || birthPlace == null || birthPlace == "" ? "none" : "1px solid #000"}}>{birthPlace}</p>
              {birthPlace == undefined || birthPlace == null || birthPlace == "" ?<input className="mt-0"type="text"></input>:""}
              
            </div>
          </div>
        </div>
        <div className="col-6 p-1 pt-2">
          <div className="row">
            <div className="col-4 pt-2">
              <label for="homePhone">Home Phone:</label>
            </div>
            <div className="col-8">
              <input
                type="text"
                id="homePhone"
                // value={$AHelper.pincodeFormatInContact(homeMobile?.mobileNo) +" "+ $AHelper.formatPhoneNumber((homeMobile?.mobileNo?.slice(0, 4) == "+254") ? homeMobile?.mobileNo : homeMobile?.mobileNo?.slice(-10))}
                value={$AHelper.newPhoneNumberFormat(homeMobile?.mobileNo)}
              // value={($AHelper.pincodeFormatInContact(homeMobile?.mobileNo) && homeMobile?.mobileNo) ? 
              //     ($AHelper.pincodeFormatInContact(homeMobile?.mobileNo) + " " + 
              //         $AHelper.formatPhoneNumber((homeMobile?.mobileNo?.slice(0, 4) == "+254") ? homeMobile?.mobileNo : homeMobile?.mobileNo?.slice(-10))) 
              //     : " "}
              
              ></input>
            </div>
          </div>
        </div>
      </div>

      {/* className='address-homePhone' className='div-address' className='div-homePhone' id="homePhone" */}
      <div className="row p-1">
        <div className="col">
          <div className="row">
            <div className="col-2 pt-2 ">
              <label for="address">{props.memberAddress?.addressTypeId == 1 || props.memberAddress?.addressTypeId == 3 ? "Apartment No:":"Suit No:" }</label>
            </div>
            <div className="col-10  pt-2 " >
            <p  className="Birtpl"type="text"style={{borderBottom : addressLine2 == undefined || addressLine2 == null || addressLine2 == "" ? "1px solid #000" : "1px solid #000",marginTop: addressLine2 == undefined || addressLine2 == null || addressLine2== "" ? "16px":""}} >{addressLine2}</p>
          
            </div>
          </div>
        </div>
        
      </div>
      <div className="row p-1">
        <div className="col">
          <div className="row">
            <div className="col-2 pt-2 ">
              <label for="address">Address:</label>
            </div>
            <div className="col-10  pt-2 " >
            <p  className="Birtpl" type="text"style={{borderBottom : adrs1 == undefined || adrs1 == null || adrs1== "" ? "1px solid #000" : "1px solid #000",marginTop: adrs1 == undefined || adrs1 == null || adrs1== "" ? "16px":""}} >{adrs1.splice(0, 16).join(" ")}</p>
          
            </div>
          </div>
        </div>
        
      </div>

      {/* className='div-cellPhone' className='div-addressLine2' */}

      <div className="row p-1">
        {/* <div className="col">
          <div className="row">
            <div className="col-3 pt-2">
              <label for="address"> </label>
            </div>
            <div className="col-9">
              {/* <input type="text" id="address-line-2"></input> */}
            {/* </div>
          </div>
        </div> */}
        <div className="col-6">
          <div className="row pt-2">
            <div className="col-4 pt-2  ">
              <label for="homePhone" className="p-0 ">Cell Phone:</label>
            </div>
            <div className="col p-0 pt-2">
              <input
                type="text"
                id="cellPhone"
                className="p-0"
                value={$AHelper.newPhoneNumberFormat(primaryMobile?.mobileNo)}
                // value={($AHelper.pincodeFormatInContact(primaryMobile?.mobileNo) && primaryMobile?.mobileNo) ? $AHelper.pincodeFormatInContact(primaryMobile?.mobileNo)
                //  +" "+ $AHelper.formatPhoneNumber((primaryMobile?.mobileNo?.slice(0, 4) == "+254") ? primaryMobile?.mobileNo : primaryMobile?.mobileNo?.slice(-10)):""}
                // value={ primaryMobile.mobileNo? primaryMobile.mobileNo?.slice(0, -10) +" " +$AHelper.formatPhoneNumber(primaryMobile.mobileNo?.slice(-10)): null}
              ></input>
            </div>
          </div>
        </div>
         <div className="col-6 pt-1">
          <div className="row">
            <div className="col-2 pt-3">
              <label for="email">Email:</label>
            </div>
            <div className="col pt-2">
              <input
                type="email"
                id="email"
                className="p-0"
                value={primaryEmail.emailId}
              ></input>
            </div>
          </div>
        </div>
      </div>

      <div className="row p-1">
        <div className="col-6 ">
          <div className="row  ">
           
            <div className="col-4 pt-2  ">
              <label for="State" className="">State:</label>
            </div>
            <div className="col pt-1  p-0 pt-2">
              <input type="text" id="state" className=" p-0"  value={state}></input>
            </div>
            
          </div>
        </div>
        <div className="col-6">
          <div className="row">
            <div className="col-2 pt-2">
                <label  for="homePhone">City:</label>
              </div>

              <div className="col">
                <input type="text" id="city" value={city}></input>
              </div>
          </div>
          
        </div>
        </div>

      <div className="row workPhoneCls">
          <div className="col-6">
              <div className="row">
                <div className="col-4 pt-2">
                  <label for="homePhone">Work Phone:</label>
                </div>
                <div className="col p-0">
                  <input
                    type="text"
                    id="workPhone"
                    value={$AHelper.newPhoneNumberFormat(workMobile?.mobileNo)}
                    // value={workMobile.mobileNo ? workMobile.mobileNo?.slice(0, -10) + " " +$AHelper.formatPhoneNumber(workMobile?.mobileNo?.slice(-10)): null}
                    // value={($AHelper.pincodeFormatInContact(workMobile?.mobileNo) && workMobile?.mobileNo) ?
                    //    $AHelper.pincodeFormatInContact(workMobile?.mobileNo)+ " " + $AHelper.formatPhoneNumber((workMobile?.mobileNo?.slice(0, 4) === "+254") ? workMobile?.mobileNo : workMobile?.mobileNo?.slice(-10)):""}
                  ></input>
                </div>
              </div>
            </div>
            <div className="col-6">
                    <div className="row">
                        <div className="col-2 pt-2">
                          <label className="pt-1 pr-1 zip" for="zip">
                            Zip Code:
                          </label>
                        </div>
                        <div className="col">
                          <input type="text" id="zip" value={zipcode}></input>
                        </div>
                    </div>
            </div>       
      </div>
      <div className="row workPhoneCls">
          <div className="col-6">
              <div className="row">
                <div className="col-4 pt-2">
                  <label for="homePhone">County:</label>
                </div>
                <div className="col p-0">
                  <input
                    type="text"
                    id="workPhone"
                    value={isNotValidNullUndefile(props.memberAddress) ? props.memberAddress?.county : ""}></input>
                </div>
              </div>
            </div>
            <div className="col-6">
                    <div className="row">
                        <div className="col-2 pt-2">
                          <label className="pt-1 pr-1 zip" for="zip">
                            County Refrence:
                          </label>
                        </div>
                        <div className="col">
                          <input type="text" id="zip" value={isNotValidNullUndefile(props.memberAddress) ? props.memberAddress?.countyRef : ""}></input>
                        </div>
                    </div>
            </div>       
      </div>
       
        
      

      {/*  className='div-address-workPhone' className='div-extra-address' className='div-city' id="city" className='div-state'
                className='div-zip' className='div-workPhone'
             */}

      {/* className='div-country-email'  className='div-country' className='div-email'*/}

      <div className="row  " >
          <div className="row mb-4">
            <div className="col-2 pt-2">
              <label for="homePhone">Country:</label>
            </div>

            <div className="col-10 ">
              <input type="text" id="country" className="" value={country}></input>
            </div>
        </div>
        <hr />
      </div>

    

      <div className="container-fluid " >
        <div className="row">
          <div className="col-3 p-1 ">
          <label for="">US Citizen:</label> 
            </div>
          <div className="col-2">
            {" "}
            <input
              type="checkbox"
              id="ckeck-yes-us p-1"
              class="form-check-input"
              checked={country == "United States"}
            />
            <label class=" col-1 form-check-label" for="ckeck-yes-us">
              Yes
            </label>
          </div>
          <div className="col-2" >
            <input
              type="checkbox"
              id="ckeck-no-us"
              class="form-check-input"
              checked={country !== "United States"}
            />
            <label class="col-1 form-check-label" for="ckeck-no-us">
              No
            </label>
          </div>
          <div className="col-8" ></div>
        </div>
        {/* <div className='row div-us-citizen'>
           
              <label className='col-3 lbl-us-citizen'>US Citizen:</label>
             <div className='col'><input type="checkbox" id="ckeck-yes-us" class="us-citizen" checked={country == "United States"}/>
             <label>YES</label></div>
                 <li><input type="checkbox" id="ckeck-no-us" class="us-citizen" checked={country !== "United States"}/>No</li>
           </div> */}
      </div>

     
      <div className="container-fluid" >
        <div className="row paddTop">
          <div className="col-3 p-1">
          <label for="">Are you a U.S. Veteran?</label>  
            </div>
          <div className="col-2">
            <input
              type="checkbox"
              id="ckeck-yes-vet"
              class="form-check-input"
              checked={isVeteran}
            />
            <label class="col-1 form-check-label" for="ckeck-yes-vet">
              Yes
            </label>
          </div>
          <div className="col-2">
            <input
              type="checkbox"
              id="ckeck-no-vet"
              class="form-check-input"
              checked={!isVeteran}
            />
            <label class=" col-1 form-check-label" for="ckeck-no-vet">
              No
            </label>
          </div>
          <div className="col-8"></div>
        </div>
        {/* <label className='lbl-vetrian'>Are you a U.S. Veteran?</label>
                  
                  <li><input type="checkbox" id="ckeck-yes-vet" class="vetrian"  checked={isVeteran}/>Yes</li>
                  <li><input type="checkbox" id="ckeck-no-vet" class="vetrian" checked={!isVeteran}/>No</li>
               */}
        {isVeteran && (
          <div className="row">
            <div className="col-3 p-1"> <label for="">Honorably discharged?</label></div>
            <div className=" col-2">
              <input
                type="checkbox"
                id="ckeck-yes-d"
                class="form-check-input"
                checked={
                  veteran?.dischargeTypeId !== "0" ||
                  veteran?.dischargeTypeId !== null
                }
              />
              <label class="col-1 form-check-label" for="ckeck-yes-d">
                Yes
              </label>
            </div>
            <div className="col-2">
              {" "}
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="ckeck-no-d"
              />
              <label class=" col-1form-check-label" for="ckeck-no-d">
                Default
              </label>
            </div>

            <div className="col-7"></div>
            {/* <input type="checkbox" id="ckeck-yes-d" class="discharge" checked={(veteran?.dischargeTypeId !== "0" || veteran?.dischargeTypeId !== null)}/>Yes */}

            {/* <li>
                            <input type="checkbox" id="ckeck-no-d" class="discharge" />No
                        </li> */}
          </div>
        )}
      </div>

      {isVeteran && (
        <>
          {/* className='div-doe-discharge' */}

          {/* <div className="row p-1">
            <div className="col">
              <div className="row">
                <div className="col-4 mt-2">
                <label for=""> If yes, what was your date of entry?</label>
                </div>

                <div className="col me-5">
                  {" "}
                  <input type="text" id="doe"></input>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div className="row p-1">
            <div className="col">
              <div className="row"> */}
                {/* <div className='col-6'>
                                        <label for="doe" >If yes, what was your date of entry?</label>
                                    </div>
                                    <div className='col-6'>  <input type="text" id="doe" ></input></div> */}
                {/* <div className="col-4 mt-2"> <label for="">Date of Discharge:</label></div>

                <div className="col mb-3 me-5">
                  <input type="text" id="discharge"></input>
                </div>
              </div>
            </div>
          </div> */}
          {/* 
          <div className='div-serve'>
               <b className='lbl-serve'>If yes, which war did you serve in?</b>
                  <li><input type="checkbox" id="check-WW2" checked={veteran?.wartimePeriod == '2'}/>WWII</li>
                  <li><input type="checkbox" id="check-korean-conflict" checked={veteran?.wartimePeriod == '3'}/>Korean Conflict</li>
                  <li><input type="checkbox" id="check-vitenam" checked={veteran?.wartimePeriod == '4'} />Vitenam</li>
                  <li><input type="checkbox" id="check-gulf-war"checked={veteran?.wartimePeriod == '6'}/>Gulf War</li>
           </div> */}

          <div className="container-fluid">
            <div className="row">
              <div className="col-3 p-0">
              <label for=""> If yes, which war did you serve in?</label>
              </div>
              <div className="col">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="check-WW2"
                  checked={veteran?.wartimePeriod == "2"}
                />
                <label class="form-check-label" for="check-WW2">
                  WWII
                </label>
              </div>
              <div className="col-3">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="check-korean-conflict"
                  checked={veteran?.wartimePeriod == "3"}
                />
                <label class="form-check-label" for="check-korean-conflict">
                  Korean Conflict
                </label>
              </div>
              <div className="col">
                <input
                  type="checkbox"
                  id="check-vitenam"
                  class="form-check-input"
                  checked={veteran?.wartimePeriod == "4"}
                />
                <label class="form-check-label" for="check-vitenam">
                  Vitenam
                </label>
              </div>
              <div className="col">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="check-gulf-war"
                  checked={veteran?.wartimePeriod == "6"}
                />
                <label class="form-check-label" for="check-gulf-war">
                  Gulf War
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FormPersonalInfo;
