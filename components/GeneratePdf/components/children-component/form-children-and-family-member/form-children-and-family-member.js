import { useEffect, useState, useSyncExternalStore } from "react";
import utils from '../../../helper/utilFunctions'
import { $AHelper } from "../../../../control/AHelper";
import konsole from "../../../../control/Konsole";
import { Form } from "react-bootstrap";
import { livingMemberStatusId, deceaseMemberStatusId } from "../../../../Reusable/ReusableCom"



const ChildrenAndFamilyMember = (props) => {
  const api = props.api;


  let calcAge = (dateString) => {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  }

  //-----------------------------------------------------------------------------------------------------------------------

  //data from GetFamilyMembersByUserId function of api.js
  const [spouse, setSpouse] = useState(props.spouse)
  const dob = (props.familyMembers?.dob !== undefined && props.familyMembers?.dob !== null) ? $AHelper.getFormattedDate(props.familyMembers.dob?.slice(0, props.familyMembers.dob.indexOf('T'))) : "";
  const age = calcAge(dob)
  const [fName, setfName] = useState(props.familyMembers.fName);
  const [lName, setLName] = useState(props.familyMembers.lName);
  const [mName, setMName] = useState((props.familyMembers.mName !== null) ? props.familyMembers.mName : "");
  const [maritalStatusId, setMaritalStatusId] = useState(
    props.familyMembers.maritalStatusId
  );
  const [memberId, setMemberId] = useState(props.familyMembers.memberId);
  const [nickName, setNickName] = useState(props.familyMembers.nickName);
  const [noOfChildren, setnoNfChildren] = useState(
    props.familyMembers.noOfChildren
  );
  const [primaryUserId, setPrimaryUserId] = useState(
    props.familyMembers.primaryUserId
  );
  const [relationshipName, setRelationshipName] = useState(
    props.familyMembers.relationshipName
  );
  const [relationshipTypeId, setRelationshipTypeId] = useState(
    props.familyMembers.relationshipTypeId
  );
  const [relativeUserId, setRelativeUserId] = useState(
    props.familyMembers.relativeUserId
  );
  const [suffixId, setSuffixId] = useState(props.familyMembers.suffixId);
  const [userId, setUserId] = useState(props.familyMembers.userId);
  const [childSpouseuserId, setchildSpouseUserId] = useState(props.familyMembers?.children.length > 0 ? props.familyMembers?.children[0]?.userId : "");

  //-------------------------------------------------------------------------------------------------------------------//



  const [childSpouseAddress, setchildSpouseAddress] = useState([])
  const [childSpouseContact, setchildSpouseContact] = useState([])

  // konsole.log(childSpouseContact,childSpouseuserId,"asasaschildSpouseContact")

  //-------------Data from GetContactByUserid()-----------------
  const [address, setAddress] = useState([]);
  const [contact, setContacts] = useState([]);
  const [addressSpouse, setAddressSpouse] = useState([]);
  const [contactSpouse, setContactsSpouse] = useState([]);

  //--------------------------------------------------------------
  const spouseInfoObj = (props.familyMembers != undefined && props.familyMembers != null) ? props.familyMembers : "";
  const spouseInfo = (spouseInfoObj.children !== undefined && spouseInfoObj.children.length !== 0 && (spouseInfoObj.maritalStatusId == 1 || spouseInfoObj.maritalStatusId == 2) && (spouseInfoObj.children[0]?.relationshipName == "In-law" || spouseInfoObj.children[0]?.relationshipName == "Daughter-in-law" || spouseInfoObj.children[0]?.relationshipName == 'Step Daughter-in-law' || spouseInfoObj.children[0]?.relationshipName == 'Son-in-law' || spouseInfoObj.children[0]?.relationshipName  == 'Step Son-in-law')) ? spouseInfoObj.children : [];
  const Grandchildrens = (spouseInfo.length > 0 && spouseInfo[0]?.children !== undefined) ? spouseInfo[0]?.children : spouseInfoObj.children;
  const spouseDob = (spouseInfo?.dob != null) ? spouseInfo?.dob.slice(0, spouseInfo.dob.indexOf("T")) : ""
  const spouseAge = (spouseDob != null) ? calcAge(spouseDob) : ""
  const oursChild = (props?.spouse?.maritalStatusId == 1 || props?.spouse?.maritalStatusId == 2) ? true : false;
  const hisChild = ((props?.spouse?.maritalStatusId == 3 || props?.spouse?.maritalStatusId == 4 || props?.spouse?.maritalStatusId == 5) && props?.spouse?.genderId == 1) ? true : false;
  const hersChild = ((props?.spouse?.maritalStatusId == 3 || props?.spouse?.maritalStatusId == 4 || props?.spouse?.maritalStatusId == 5) && props?.spouse?.genderId == 2) ? true : false;
  const emergencyContactChild = props.familyMembers?.isEmergencyContact
  const memberStatusId = props.familyMembers?.children.length > 0 ? props.familyMembers?.memberStatusId : livingMemberStatusId;

  konsole.log("spouseuserspouseuser", (spouseInfo.length > 0 && spouseInfo[0]?.children !== undefined), spouseInfoObj, spouseInfo);
  konsole.log("props.familyMembers", props.familyMembers);

  useEffect(() => {
    getAddressandContact(userId)
    getAddressandContact(spouseInfo[0]?.userId)
  }, []);

  useEffect(() => {
    api.GetAddressByUserId(Grandchildrens[0]?.userId).then((res) => {
      konsole.log("address Id", res.data.data);
      setchildSpouseAddress(res.data.data.addresses);

    }).catch(error => konsole.log("apiError18", error));
    api.GetContactByUserid(Grandchildrens[0]?.userId).then((res) => {
      setchildSpouseContact(res.data.data.contact)
    }).catch(error => konsole.log("apiError19", error));
  }, [Grandchildrens[0]?.userId])

  const getAddressandContact = (userid) =>{
    api.GetAddressByUserId(userid).then((res) => {
      konsole.log("address Id", res.data.data);
      if(userid == userId){
      setAddress(res.data.data.addresses);
      }
      if(userid == spouseInfo[0]?.userId){
        setAddressSpouse(res.data.data.addresses)
      }
    }).catch(error => konsole.log("apiError18", error));
    api.GetContactByUserid(userid).then((res) => {
      if(userid == userId){
      setContacts(res.data.data.contact)
      }

      if(userid == spouseInfo[0]?.userId){
        setContactsSpouse(res.data.data.contact)
      }
    }).catch(error => konsole.log("apiError19", error));
  }


  konsole.log(Grandchildrens, "GrandchildrensspouseInfo", spouseInfo, (spouseInfo.length > 0 && spouseInfo[0]?.children !== undefined), spouseInfoObj.children)

  const spouseDetail = (spouse) => {
    return (
      <div className="container-fluid">
        <div className="container-fluid">
          <div className="row align-items-start">
            <div className="col-2">
              <label for="email">Spouse Full Name: </label>
            </div>
            <div className="col-4">
              <input className="long-input" type="text" id="txt-s-fname" value={$AHelper.capitalizeAllLetters(spouse?.fName + " " + spouse?.mName + " " + spouse?.lName)}></input>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row align-items-start">
            <div className="col-2">
              <label for="dob">Spouse DOB: </label>
            </div>
            <div className="col-4">
              <input
                type="text"
                id="s-dob"
                value={spouseDob}
              ></input>
            </div>
            <div className="col-2">
              <label for="age">Current Age: </label>
            </div>
            <div className="col-4">
              <input type="text" id="s-age" value={spouseAge}></input>
            </div>
          </div>
        </div>
      </div>
    )
  }



  return (address && spouse &&
    contact && (
      <div className="wraperfrm pt-3 pb-2">

        <div className="row mt-2">

          <div className="col-3">
            <label for="fName">Child’s Full Name:</label>
          </div>

          <div className="col-9">
            <label for="fName">    <input
              className="long-input otherFontSize"
              type="text"
              id="fNameId"
              value={$AHelper.capitalizeAllLetters(fName + " " + mName + " " + lName)}
            ></input></label>
          </div>



        </div>

        <div className="contain paddTop p-0 m-0">
          <div className="row mt-2 p-0 m-0">
            <div className="col-2 p-0 m-0">
              <div className="form-check">
                <input className="form-check-input" id="ours" type="checkbox" checked={oursChild} />
                <label className="form-check-label">Ours</label>
              </div>
            </div>
            <div className="col-2 p-0 m-0">
              <div className="form-check">
                <input className="form-check-input" id="his" type="checkbox" checked={hisChild} />
                <label className="form-check-label">His</label>
              </div>
            </div>
            <div className="col-2 p-0 m-0">
              <div className="form-check">
                <input className="form-check-input" id="hers" type="checkbox" checked={hersChild} />
                <label className="form-check-label">Hers</label>
              </div>
            </div>
            <div className="col-2 p-0 m-0">
              <div className="form-check">
                <input
                  className="form-check-input"
                  id="deceased"
                  type="checkbox"
                  checked={spouseInfoObj.memberStatusId == 1}
                />
                <label className="form-check-label">Living</label>
              </div>
            </div>
            <div className="col-2 p-0 m-0">
              <div className="form-check">
                <input
                  className="form-check-input"
                  id="deceased"
                  type="checkbox"
                  checked={spouseInfoObj.memberStatusId == 2}
                />
                <label className="form-check-label">Deceased</label>
              </div>
            </div>
            <div className="col-2 p-0 m-0">
              <div className="form-check">
                <input
                  className="form-check-input"
                  id="special-needs"
                  type="checkbox"
                  checked={spouseInfoObj.memberStatusId == 3}
                />
                <label className="form-check-label specialNeedsCls">Speical Needs</label>
              </div>
            </div>
            <div className="d-flex gap-3 pt-2">
            <div className="col-7 pt-2">
            <div className="d-flex gap-4">
                {(memberStatusId == livingMemberStatusId) && <>
                  <div>
                    <label className="emrgncy_h2 d-flex">Make this as an emergency contact ?</label>
                  </div>
                  <div>
                    {/* {konsole.log(emergencyContact,"emergencyContact")} */}
                    <Form.Check type="checkbox" className="left-radio" name="emergency" inline label="Yes" checked={emergencyContactChild} />
                    <Form.Check type="checkbox" className="left-radio" name="emergency" inline label="No" checked={!emergencyContactChild} />
                  </div>
                  <br />
                </>}
              </div>
              </div>
               <div className="col-5">
                  <div className="d-flex gap-5 pt-2">
                    {<>
                      <div key="isFiduciary" className="m-0 mb-3">
                        <Form.Check
                          className="form-check-smoke"
                          type="checkbox"
                          id="isFiduciary"
                          label="Fiduciary"
                          checked={props.familyMembers.isFiduciary}

                        />
                      </div>
                    </>}
                    {<>
                      <div key="isBeneficiary">
                        <Form.Check
                          className="form-check-smoke "
                          type="checkbox"
                          id="isBeneficiary"
                          label="Beneficiary"
                          checked={props.familyMembers.isBeneficiary}
                        />
                      </div>
                    </>}
                  </div>
                </div> 
              </div>
          </div>
        </div>
        <div className=".container-fluid mt-2 paddTop">
          <div class="row align-items-start">
            <div class="col-6">
              <label className="content-heading">
                Does this child require help or protection in managing money or
                property?
              </label>
            </div>
            <div class="col-3  ">
              <div className="form-check">
                <input
                  className="form-check-input"
                  id="check-prop-yes"
                  type="checkbox"
                />
                <label className="form-check-label">Yes</label>
              </div>
            </div>

            <div class="col-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  id="check-prop-no"
                  type="checkbox"
                />
                <label className="form-check-label">No</label>
              </div>
            </div>
          </div>
        </div>
        <div className="contain label-p1">
          <div className="row align-items-start">
            <div className="col-2 label-p1">
              <label for="occupation">Occupation: </label>
            </div>
            <div className="col-10 ">
              <input
                className="long-input-text"
                type="text"
                id="occupation"
              ></input>
            </div>
          </div>
        </div>

        {address &&
          address.map((item) => {
            return (
              item.addressTypeId === 1 && (
                <div>
                  <div className="contain paddTop">
                    <div className="row align-items-start">
                      <div className="col-2">
                        <label for="address">Apartment No:</label>
                      </div>
                      <div className="col-6">
                        <input className="long-input-text" type="text" id="address" value={item.addressLine2}></input>
                      </div>
                    </div>
                    <div className="row align-items-start">
                      <div className="col-2">
                        <label for="address">
                          Address:
                        </label>
                      </div>
                      <div className="col-6">
                        <input className="long-input-text" type="text" id="address" value={item.addressLine1}></input>
                      </div>
                    </div>
                  </div>
                  <div className="container-fluid p-0">
                    <div className="row align-items-start pt-2">
                      <div className="col-1 pt-2">
                        <label for="city">City: </label>
                      </div>
                      <div className="col-3">
                        <input type="text" id="city" value={item.city}></input>
                      </div>
                      <div className="col-1 pt-2">
                        <label for="state">State: </label>
                      </div>
                      <div className="col-3">
                        <input
                          type="text"
                          id="state"
                          value={item.state}
                        ></input>
                      </div>
                      <div className="col-1"><label for="zip-code">Zip Code: </label></div>
                      <div className="col-3"><input type="text" id="zip-code" value={item.zipcode}></input></div>
                      <div className="col-1 pt-2"><label for="zip-code">County: </label></div>
                      <div className="col-3"><input type="text" id="zip-code" value={item.county}></input></div>
                      <div className="col-2 pt-2"><label for="zip-code">County Refrence: </label></div>
                      <div className="col-3"><input type="text" id="zip-code" value={item.countyRef}></input></div>
                    </div>
                  </div>
                </div>
              )
            );
          })}

        {contact.emails &&
          contact.emails.map((item) => {
            return (
              item.contactTypeId === 1 && (
                <div className="contain">
                  <div className="row align-items-start">
                    <div className="col-1">
                      <label for="email">Email: </label>
                    </div>
                    <div className="col-6">
                      <input
                        className="long-input-text"
                        type="text"
                        id="email"
                        value={item.emailId}
                      ></input>
                    </div>
                  </div>
                </div>
              )
            );
          })}

        <div className="contain mt-2">
          {contact.mobiles &&
            contact.mobiles.map((item) => {
              return (
                item.contactTypeId === 1 && (
                  <div className="row align-items-start paddTop">
                    <div className="col-2 pt-2">
                      <label for="mobile-phone">Mobile Phone: </label>
                    </div>
                    <div className="col-4">
                      <input
                        type="text"
                        id="mobile-phone"
                        value={$AHelper.newPhoneNumberFormat(item?.mobileNo)}
                        // value={$AHelper.pincodeFormatInContact(item?.mobileNo) +" "+ $AHelper.formatPhoneNumber((item?.mobileNo?.slice(0, 4) == "+254") ? item?.mobileNo : item?.mobileNo?.slice(-10))}
                      ></input>
                    </div>

                    <div className="col-1">
                      <label for="alternate-phone">Alternate Phone: </label>
                    </div>
                    <div className="col-4">
                      <input type="text" id="alternate-phone"></input>
                    </div>
                  </div>
                )
              );
            })}
        </div>

        <div className="contain pb-2">
          <div className="row align-items-start paddTop">
            <div className="col-2  label-p1 pt-2">
              <label for="dob">Date of Birth: </label>
            </div>
            <div className="col-4">
              <input type="text" id="dob" value={dob}></input>
            </div>
            <div className="col-2 pt-2">
              <label for="age">Current Age: </label>
            </div>
            <div className="col-3">
              <input type="text" id="age" value={age || " "} ></input>
            </div>
          </div>
        </div>
        {spouseInfo.length > 0 &&
          <><hr className="fw-bold text-danger"></hr>
            <div className="contain">
              <div className="row align-items-start">
                <div className="col-2  label-p1">
                  <label for="name">Spouse Full Name : </label>
                </div>
                <div className="col-4">
                  <input className="long-input" type="text" id="txt-s-fname" value={$AHelper.capitalizeAllLetters(spouseInfo[0]?.fName + " " + (spouseInfo[0]?.mName != null ? spouseInfo[0]?.mName : '') + " " + spouseInfo[0]?.lName)}></input>

                </div>
                <div className="col-2">
                  <label for="dob">Spouse DOB: </label>
                </div>
                <div className="col-3">
                  <input type="text" id="s-dob" value={spouseInfo[0]?.dob != null ? $AHelper.getFormattedDate(spouseInfo[0]?.dob) : ''}></input>
                </div>
              </div>
            </div>
            <div>
              <div className="d-flex justify-content-between  pt-3">
                <div className="col-3">
                  <div className="d-flex gap-3">
                    {<>
                      <div key="isFiduciary" className="m-0 mb-3">
                        <Form.Check
                          className="form-check-smoke"
                          type="checkbox"
                          id="isFiduciary"
                          label="Fiduciary"
                          checked={spouseInfo[0]?.isFiduciary}

                        />
                      </div>
                    </>}
                    {<>
                      <div key="isBeneficiary">
                        <Form.Check
                          className="form-check-smoke "
                          type="checkbox"
                          id="isBeneficiary"
                          label="Beneficiary"
                          checked={spouseInfo[0]?.isBeneficiary}
                        />
                      </div>
                    </>}
                  </div>
                </div>
                <div className="col-6 pt-1">
                  <div className="d-flex gap-4">
                    {<>
                      <div>
                        <label className="emrgncy_h2 d-flex">Make this as an emergency contact?</label>
                      </div>
                      <div>
                        <Form.Check type="checkbox" className="left-radio" name="emergency" inline label="Yes" checked={spouseInfo[0]?.isEmergencyContact} />
                        <Form.Check type="checkbox" className="left-radio" name="emergency" inline label="No" checked={!spouseInfo[0]?.isEmergencyContact} />
                      </div>
                    </>}
                  </div></div>
              </div>
              {addressSpouse && addressSpouse.map((item) => {
                return (
                  <div>
                    <div className="contain">
                      <div className="row align-items-start">
                        <div className="col-2 pt-2">
                          <label>Appartment No: </label>
                        </div>
                        <div className="col-9">
                          <input type="text" value={item.addressLine2}></input>
                        </div>
                      </div>
                      <div className="row pt-2">
                        <div className="col-1 pt-2">
                          <label for="address">Address:</label>
                        </div>
                        <div className="col-11">
                          <input className="" type="text" id="address" value={item.addressLine1}></input>
                        </div>
                      </div>
                    </div>

                    <div className="container-fluid pt-2 p-0">
                      <div className="row align-items-start">
                        <div className="col-1 pt-2">
                          <label for="city">City: </label>
                        </div>
                        <div className="col-3">
                          <input type="text" id="city" value={item.city}></input>
                        </div>
                        <div className="col-1 pt-2">
                          <label for="state">State: </label>
                        </div>
                        <div className="col-3">
                          <input type="text" id="state" value={item.state}></input>
                        </div>
                        <div className="col-1 pt-2">
                          <label for="zip-code">Zip Code: </label></div>
                        <div className="col-3">
                          <input type="text" id="zip-code" value={item.zipcode}></input></div>
                        <div className="col-1 pt-2">
                          <label for="zip-code">County: </label></div>
                        <div className="col-3">
                          <input type="text" id="zip-code" value={item.county}></input></div>
                        <div className="col-2 pt-2">
                          <label for="zip-code">County Refrence: </label></div>
                        <div className="col-3">
                          <input type="text" id="zip-code" value={item.countyRef}></input></div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className="d-flex gap-2 pt-2">
                <div className="col-6">
                  {contactSpouse?.emails &&
                    contactSpouse?.emails.map((item) => {
                      return (
                        item.contactTypeId === 1 && (
                          <div className="contain">
                            <div className="row align-items-start">
                              <div className="col-2 pt-2">
                                <label for="email">Email: </label>
                              </div>
                              <div className="col-8">
                                <p className="pt-3 otherFontSize" style={{ borderBottom: "1px solid #000", wordBreak: "break-all" }} type="text" id="email" >{item.emailId}</p>
                              </div>
                            </div>
                          </div>
                        )
                      );
                    })}
                </div>
                <div className="col-6">
                  {contactSpouse?.mobiles &&
                    contactSpouse?.mobiles.map((item) => {
                      return (
                        item.contactTypeId === 1 && (
                          <div className="contain">
                            <div className="row align-items-start">
                              <div className="col-4 pt-2">
                                <label for="mobile-phone">Mobile Phone: </label>
                              </div>
                              <div className="col-6">
                                <input
                                  type="text"
                                  id="mobile-phone"
                                  value={$AHelper.newPhoneNumberFormat(item?.mobileNo)}
                                  // value={$AHelper.pincodeFormatInContact(item?.mobileNo) +" "+ $AHelper.formatPhoneNumber((item?.mobileNo?.slice(0, 4) == "+254") ? item?.mobileNo : item?.mobileNo?.slice(-10))}
                                ></input>
                              </div>
                            </div>
                          </div>
                        )
                      );
                    })}
                </div>
              </div>
            </div>
            {/* <div className="contain">
          <div className="row align-items-start">
            <div className="col-2  label-p1">
            <label for="age">Current Age3: </label>
            </div>
            <div className="col-4">
            <input type="text" id="s-age" value={spouseAge}></input>
            </div>
          
          </div>
        </div> */}
          </>
        }
   
        {Grandchildrens?.length > 0 &&<>
          <hr className="fw-bold text-danger"></hr>
        <div className="contain pb-2">
          <div className="row align-items-start paddTop">
            <div className="col-2  label-p1 pt-2">
              <label for="fNameAges" >Grand Child Full Name: </label>
            </div>
            <div className="col-4">
              {Grandchildrens.length > 0 && <div ><p className="pt-3 otherFontSize" style={{ borderBottom: "1px solid #000", wordBreak: "break-all" }}>{$AHelper.capitalizeAllLetters(Grandchildrens[0]?.fName + " "+  ((Grandchildrens[0]?.mName !== null) ? Grandchildrens[0]?.mName + ' ' : ' ')  + Grandchildrens[0]?.lName)}</p></div>}
            </div>
            {Grandchildrens.length > 0 && <>
              <div className="col-2 pt-2">
                <label for="age">Date of Birth: </label>
              </div>
              <div className="col-3">
                <input type="text" id="dob" value={Grandchildrens[0]?.dob != null ? $AHelper.dateFomratShow(Grandchildrens[0]?.dob) : ''} readOnly />
              </div>
            </>}
          </div>
        </div>
        <div>
          <div className="d-flex justify-content-between  pt-3">
            <div className="col-3">
              <div className="d-flex gap-3"> {(Grandchildrens[0]?.memberStatusId != deceaseMemberStatusId) && <>
                <div key="isFiduciary" className="m-0 mb-3">
                  <Form.Check
                    className="form-check-smoke"
                    type="checkbox"
                    id="isFiduciary"
                    label="Fiduciary"
                    checked={Grandchildrens[0]?.isFiduciary}

                  />
                </div>
              </>} {(Grandchildrens[0]?.memberStatusId != deceaseMemberStatusId) && <>
                <div key="isBeneficiary">
                  <Form.Check
                    className="form-check-smoke "
                    type="checkbox"
                    id="isBeneficiary"
                    label="Beneficiary"
                    checked={Grandchildrens[0]?.isBeneficiary}
                  />
                </div>
              </>}
              </div>
            </div>
            <div className="col-6 pt-1">
              <div className="d-flex gap-4">
                {(Grandchildrens[0]?.memberStatusId != deceaseMemberStatusId) && <>
                  <div>
                    <label className="emrgncy_h2 d-flex">Make this as an emergency contact?</label>
                  </div>
                  <div>
                    <Form.Check type="checkbox" className="left-radio" name="emergency" inline label="Yes" checked={Grandchildrens[0]?.emergencyContact} />
                    <Form.Check type="checkbox" className="left-radio" name="emergency" inline label="No" checked={!Grandchildrens[0]?.emergencyContact} />
                  </div>
                </>}
              </div></div>
          </div>

          {childSpouseAddress &&
            childSpouseAddress.map((item) => {
              return (
                <div>
                  <div className="contain">
                    <div className="row align-items-start">
                      <div className="col-2 pt-2">
                        <label>Appartment No: </label>
                      </div>
                      <div className="col-9">
                        <input type="text" value={item.addressLine2}></input>
                      </div>
                    </div>
                    <div className="row pt-2">
                      <div className="col-1 pt-2">
                        <label for="address">Address:</label>
                      </div>
                      <div className="col-11">
                        <input className="" type="text" id="address" value={item.addressLine1}></input>
                      </div>
                    </div>
                  </div>

                  <div className="container-fluid pt-2 p-0">
                    <div className="row align-items-start">
                      <div className="col-1 pt-2">
                        <label for="city">City: </label>
                      </div>
                      <div className="col-3">
                        <input type="text" id="city" value={item.city}></input>
                      </div>
                      <div className="col-1 pt-2">
                        <label for="state">State: </label>
                      </div>
                      <div className="col-3">
                        <input type="text" id="state" value={item.state}></input>
                      </div>
                      <div className="col-1 pt-2">
                        <label for="zip-code">Zip Code: </label></div>
                      <div className="col-3">
                        <input type="text" id="zip-code" value={item.zipcode}></input></div>
                      <div className="col-1 pt-2">
                        <label for="zip-code">County: </label></div>
                      <div className="col-3">
                        <input type="text" id="zip-code" value={item.county}></input></div>
                      <div className="col-2 pt-2">
                        <label for="zip-code">County Refrence: </label></div>
                      <div className="col-3">
                        <input type="text" id="zip-code" value={item.countyRef}></input></div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>

        <div className="d-flex gap-2 pt-2">
          <div className="col-6">
            {childSpouseContact?.emails &&
              childSpouseContact?.emails.map((item) => {
                return (
                  item.contactTypeId === 1 && (
                    <div className="contain">
                      <div className="row align-items-start">
                        <div className="col-2 pt-2">
                          <label for="email">Email: </label>
                        </div>
                        <div className="col-8">
                          <p className="pt-3 otherFontSize" style={{ borderBottom: "1px solid #000", wordBreak: "break-all" }} type="text" id="email" >{item.emailId}</p>
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
          </div>
          <div className="col-6">
            {childSpouseContact?.mobiles &&
              childSpouseContact?.mobiles.map((item) => {
                return (
                  item.contactTypeId === 1 && (
                    <div className="contain">
                      <div className="row align-items-start">
                        <div className="col-4 pt-2">
                          <label for="mobile-phone">Mobile Phone: </label>
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            id="mobile-phone"
                            value={$AHelper.newPhoneNumberFormat(item?.mobileNo)}
                            // value={$AHelper.pincodeFormatInContact(item?.mobileNo) +" "+ $AHelper.formatPhoneNumber((item?.mobileNo?.slice(0, 4) === "+254") ? item?.mobileNo : item?.mobileNo?.slice(-10))}
                          ></input>
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
          </div>
        </div>
        </>}

        <hr className="fw-bold text-danger"></hr>
      </div>
    )
  );
};

export default ChildrenAndFamilyMember;
