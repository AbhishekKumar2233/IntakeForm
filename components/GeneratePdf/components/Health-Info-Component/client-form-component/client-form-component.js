import { useEffect, useState } from "react";
import Api from "../../../helper/api";
import konsole from '../../../../control/Konsole'
import { $AHelper } from "../../../../control/AHelper";

const ClientFormComponent = (props) => {
  const fullName =
    props.primaryCareMember.f_Name +
    " " +
    props.primaryCareMember.m_Name +
    " " +
    props.primaryCareMember.l_Name;
  const visitDuration = props.primaryCareMember.visit_Duration;
  const businessName = props.primaryCareMember.businessName;
  const websiteLink = props.primaryCareMember.websiteLink
  const is_GCM = props.primaryCareMember.is_GCM;
  konsole.log("notCErtified",is_GCM)
  const is_GCM_Certified = props.primaryCareMember.is_GCM_Certified
  konsole.log("Certified",is_GCM_Certified)
  const happy_With_Service = props.primaryCareMember.happy_With_Service;
  const docMemberUserId = props.primaryCareMember.docMemberUserId;
  const healthInsurence=props.healthInsurence

  const api = new Api();

  let [contact, setContact] = useState(null);
  let [address,setAddress] = useState(null);;

  useEffect(() => {
    api.getAddressByUserId(docMemberUserId).then((res) => {
      setAddress(res.data.data.addresses)
    }).catch(error => konsole.log("apiError20", error));
    api.GetContactByUserid(docMemberUserId).then((res) => {
      setContact(res.data.data.contact);
    }).catch(error => konsole.log("apiError21", error));
  }, []);

  return (
    <div className="contain ">
      <div className="contain pt-3 pb-2">
        <div className="row align-items-start">
          <div className="col-2">
            <label for="occupation">Physician Name: </label>
          </div>
          <div className="col-10">
            <input
              className="long-input-text"
              type="text"
              id="physician-name"
              value={$AHelper.capitalizeAllLetters(fullName)}
            ></input>
          </div>
        </div>
      </div>

      <div className="contain pt-3 pb-2">
        <div className="row align-items-start">
          <div className="col-3">
            <p>How many years have you seen this physician?</p>
          </div>

          <div className="col-2">
            <input type="text" id="txt-phy-years" value={visitDuration}></input>
          </div>

          <div className="col-3">
            <p>Are you happy with his/her care?</p>
          </div>

          <div className="col-2">
            <div className="">
              <input
                className="form-check-input"
                id="check-care-yes"
                checked={(typeof happy_With_Service == "boolean") && happy_With_Service}
                type="checkbox"
              />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col-2">
            <div className="">
              <input
                className="form-check-input"
                id="check-care-no"
                checked={(typeof happy_With_Service == "boolean") && !happy_With_Service}
                type="checkbox"
              />
              <label className="form-check-label">No</label>
            </div>
          </div>

          <div className="col-1"></div>
        </div>
      </div>

      <div className="contain paddTop">
        <div className="row align-items-start">
          <div className="col-2">
            <p>Is this physician a geriatrician?</p>
          </div>

          <div className="col-2">
            <div className="w20">
              <input
                className="form-check-input"
                id="check-pg-yes"
                checked={ (typeof is_GCM == "boolean") && is_GCM}
                type="checkbox"
              />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col-2">
            <div className="">
              <input
                className="form-check-input"
                id="check-pg-no"
                checked={ (typeof is_GCM == "boolean") && !is_GCM}
                type="checkbox"
              />
              <label className="form-check-label">No</label>
            </div>
          </div>
          {/* <div className="col-1"></div> */}
         {  (is_GCM == true) && <>
          <div className="col-2">
            <p>Is this physician a 'board certified' geriatrician?</p>
          </div>
          <div className="col-2">
            <div className="">
              <input
                className="form-check-input"
                id="check-gb-yes"
                type="checkbox"
                checked={ (typeof is_GCM_Certified == "boolean") &&  is_GCM_Certified}
              />
              <label className="form-check-label">Yes</label>
            </div>
          </div>
          <div className="col-2">
            <div className="">
              <input
                className="form-check-input"
                id="check-gb-no"
                type="checkbox"
                checked={(typeof is_GCM_Certified == "boolean") &&  !is_GCM_Certified}
              />
              <label className="form-check-label">No</label>
            </div>
          </div>
           <div className="col-1"></div></>}
         
        </div>
      </div>
      <div className="contain">
        <div className="row align-items-start">
          <div className="col-3 label-p1">
            <label for="occupation">Clinic or Medical Group Name: </label>
          </div>
          <div className="col-8">
            <input
            value={$AHelper.capitalizeAllLetters(businessName)}
              // className="long-input-text"
              type="text"
              id="group-name"
            ></input>
          </div>
        </div>
      </div>
      <div className="contain">
        <div className="row align-items-start">
          <div className="col-2 label-p1 pt-2">
            <label for="occupation">Website Link: </label>
          </div>
          <div className="col-4">
            <input
              className="long-input-text"
              value={websiteLink}
              type="text"
              id="group-name"
            ></input>
          </div>
        </div>
      </div>

      {
        address && address.length && <>
          <div className="contain">
        <div className="row align-items-start paddTop">
          <div className="col-2 label-p1 pt-2">
            <label for="occupation">Suit No:</label>
          </div>
          <div className="col-4">
            <input
              className="long-input-text"
              type="text"
              id="physican-address"
              value={address[0].addressLine2}
            ></input>
          </div>
        </div>
        <div className="row align-items-start paddTop pt-1">
          <div className="col-1 label-p1 pt-2">
            <label for="occupation">Address:</label>
          </div>
          <div className="col-11">
            <input
              type="text"
              id="physican-address"
              value={address[0].addressLine1}
            ></input>
          </div>
        </div>
      </div>

      <div className="container-address paddTop pt-2">
        <div className="row align-items-start">
          <div className="col-1 pt-2">
            <label for="city">City: </label>
          </div>
          <div className="col-3">
            <input type="text" id="physican-city" value={address[0].city}></input>
          </div>
          <div className="col-1 pt-2">
            <label for="state">State: </label>
          </div>
          <div className="col-3">
            <input type="text" id="physican-state" value={address[0].state}></input>
          </div>
          <div className="col-1">
            <label for="zip-code">Zip Code: </label>
          </div>
          <div className="col-2">
            {/* <input type="text" id="physican-zip-code" value={address[0].zipcode}></input> */}
            <p className="pt-2" style={{borderBottom:"1px solid #000", wordBreak:"break-all"}}>{address[0].zipcode}</p>
          </div>
          <div className="col-2">
            <label for="zip-code">County: </label>
          </div>
          <div className="col-3">
            {/* <input type="text" id="physican-zip-code" value={address[0].county}></input> */}
            <p className="pt-2" style={{borderBottom:"1px solid #000", wordBreak:"break-all"}}>{address[0].county}</p>
          </div>
          <div className="col-2">
            <label for="zip-code">County Refrence: </label>
          </div>
          <div className="col-4">
            <input type="text" id="physican-zip-code" value={address[0].countyRef}></input>
          </div>
        </div>
      </div>
        </>
      }

      {contact && contact.mobiles && (
        <div className="container-phone">
            <div className="row align-items-start">
              <div className="col-2 pt-2">
                <label>Cell Number: </label>
              </div>
              <div className="col-4">
                {contact?.mobiles?.map(mobileEle => {
                  return <input
                    className=""
                    type="text"
                    id="physican-phone-number"
                    value={$AHelper.newPhoneNumberFormat(mobileEle?.mobileNo)}
                    // {$AHelper.pincodeFormatInContact(mobileEle?.mobileNo) +" "+ $AHelper.formatPhoneNumber((mobileEle?.mobileNo?.slice(0, 4) == "+254") ? mobileEle?.mobileNo : mobileEle?.mobileNo?.slice(-10))}
                  ></input>
                })}
              </div>

              {contact && contact.emails && (
 <>
              <div className="col-1 pt-2">
                <label>Email: </label>
              </div>
              <div className="col-5">
                {contact?.emails?.map(emailEle => {
                  return <p className="otherFontSize pt-3" style={{borderBottom:"1px solid #000", wordBreak:"break-all"}}>{emailEle?.emailId}</p>
                })}
              </div>

              </>
)} 
            </div>
         
        </div>
      )}

      

       
      <hr className="fw-bold text-danger"></hr>
    </div>
  );
};

export default ClientFormComponent;
