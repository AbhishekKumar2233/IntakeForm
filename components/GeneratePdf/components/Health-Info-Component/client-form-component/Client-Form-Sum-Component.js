import { useEffect, useState } from "react";
import Api from "../../../helper/api";
import konsole from '../../../../control/Konsole'
import { $AHelper } from "../../../../control/AHelper";

const ClientFormSumComponent = (props) => {
  const fullName =
    props.primaryCareMember.f_Name +
    " " +
    props.primaryCareMember.m_Name +
    " " +
    props.primaryCareMember.l_Name;
  const clinicName = props.primaryCareMember?.businessName || "";
  const visitDuration = props.primaryCareMember.visit_Duration;
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
    <div className="contain mx-3">
      <div className="contain pt-3 pb-2">
        <div className="d-flex justify-content-between">
          <div className="sumPhysician">
            <p>Physician Name: </p>
            <h5>{$AHelper.capitalizeAllLetters(fullName)}</h5>
          </div>
          <div className="sumPhysician">
            <p>Are you happy with his/her care?</p>
            <h5>{(typeof happy_With_Service == "boolean") && (happy_With_Service == true ? 'Yes' : 'No')}</h5>
          </div>
          <div className="sumPhysician">
            <p>Is this physician a geriatrician?</p>
            <h5>{ (typeof is_GCM == "boolean") && (is_GCM == true ? 'Yes' : 'No')}</h5>
          </div>  
        </div>

        <div className=" d-flex pt-3" style={{gap:"38px"}}>
        {  (is_GCM == true) && <div className="sumPhysician" style={{width:'150px'}}>
            <p>Is this physician a 'board certified' geriatrician?</p>
            <h5>{ (typeof is_GCM_Certified == "boolean") && (is_GCM_Certified == true ? 'Yes' : 'No')}</h5>
         </div> }
         <div className="sumPhysician" style={{width:'295px'}}>
            <p>For how many years have you seen this physician?</p>
            <h5>{visitDuration}</h5>
         </div>
        </div>
      </div>
                 
      <div className="contain">
          <div className="medicalGroup pt-4">
            <h3>Clinic or Medical Group:</h3>
          </div>
          
          { address && address.length && <>
          <div className=" d-flex justify-content-between pt-3">
          <div className="sumPhysician" style={{width:"120px"}}>
            <p>Clinic Name</p>
            <h5>{$AHelper.capitalizeAllLetters(clinicName)}</h5>
          </div>
          <div className="sumPhysician" style={{width:"60px"}}>
          <p>WebsiteLink</p>
          <h5>{websiteLink}</h5>
          </div>
          <div className="sumPhysician" style={{width:"130px"}}>
          <p>Suite No</p>
          <h5>{address[0].addressLine2}</h5>
          </div>
          </div>
          <div className="d-flex justify-content-between pt-3">
          <div className="sumPhysician" style={{width:"120px"}}>
          <p>Address</p>
          <h5>{address[0].addressLine1}</h5>
          </div>
          <div className="sumPhysician" style={{width:"60px"}}>
          <p>Street</p>
          <h5>{address[0].addressLine1?.substring(0, address[0].addressLine1?.indexOf(",")) || address[0].addressLine1}</h5>
          </div>
            <div className="sumPhysician" style={{width:"130px"}}>
            <p for="city">City</p>
            <h5>{address[0].city}</h5>
            </div>
            </div>
            <div className="d-flex justify-content-between pt-3">
            <div className="sumPhysician" style={{width:"120px"}}>
            <p for="state">State</p>
            <h5>{address[0].state}</h5>
            </div>
              <div className="sumPhysician" style={{width:"60px"}}>
            <p for="zip-code">Zip Code</p>
            <h5>{address[0].zipcode}</h5>
            </div>
            <div className="sumPhysician" style={{width:"130px"}}>
            <p for="county">County</p>
            <h5>{address[0].county}</h5>
            </div>
            </div>
            <div className="sumPhysician pt-3" style={{width:"130px"}}>
            <p for="county-refrence">County Reference</p>
            <h5>{address[0].countyRef}</h5>
            </div>
    
            
            </>}
      </div>

      {contact && contact.mobiles && (
        <div className="">
            <div className="d-flex justify-content-between pt-4 pb-5">
              <div className="sumPhysician" style={{width:"50%"}}>
                <p className="ms-0 m-2">Cell Number</p>
                {contact?.mobiles?.map(mobileEle => {
                  return <h5 className="ms-0 m-2" style={{minWidth:"100px"}}>{ mobileEle?.mobileNo && mobileEle?.mobileNo.slice(0,-10)+ " " + $AHelper.formatPhoneNumber(mobileEle?.mobileNo.slice(-10))}</h5>
                })}
              </div>
             
              {contact && contact.emails && (
               <>
              <div className="sumPhysician" style={{width:"55%"}}>
                <p className="m-2">Email</p>
                {contact?.emails?.map(emailEle => {
                  return <h5 className="text-break m-2" style={{minWidth: "100px"}}>{emailEle?.emailId}</h5>
                })}
              </div>
              </>)}
              <div style={{width:"50px"}}>
              </div>
            </div>
         
        </div>
      )} 
    </div>
  );
};

export default ClientFormSumComponent;