
import FormPersonalInfo from "./form-personal-info/form-personal-info";

import Api from "../../helper/api";
import { useEffect, useState } from "react";
import konsole from "../../../control/Konsole";


const PersonalInformation = ({ primaryUserId, spouseUserId,dispatchloader }) => {

  const [memberData, setMemberData] = useState()
  const [memberAddress, setMemberAddress] = useState()
  const [spouseData, setSpouseData] = useState()
  const [spoudeAddress, setSpouseAddress] = useState()
  const userId = (primaryUserId !== undefined && primaryUserId !== '') ? primaryUserId : '';
  const spouseUsrId = (spouseUserId !== undefined && spouseUserId !== '') ? spouseUserId : '';
  const [married, Marriage_Like_Relationship, single, Widowed, Divorced] = [1, 2, 3, 4, 5]
  const [memberContact, setMemberContact] = useState()
  const [spouseContact, setSpouseContact] = useState()
  const [spouseOccupation, setSpouseOccupation] = useState()
  const [memberOccupation, setMemberOccupation] = useState()
  const [userOccupation, setUserOccupation] = useState()
  const [veteran, setVeteran] = useState([]);
  const [veteranSpouse, setSpouseVeteran] = useState([]);
  const [UserRetirementAge, setUserRetirementAge] = useState()
  const [spouseRetirementAge, setSpouseRetirementAge] = useState()


  const api = new Api();

  useEffect(() => {
    if (userId !== '') {
      api.GetOccupationByUserId(userId)
      .then((res) => {
          konsole.log("resis",res)
          setUserOccupation(res.data.data[0].occupationType)
          setUserRetirementAge(res.data.data[0].ageOfRetirement)
        }).catch(error => {
          konsole.log('error', error.response);
        })

      api.GetContactByUserid(userId)
        .then((res) => {
          setMemberContact(res.data.data)
          konsole.log("my", res.data.data)
        }).catch(error => {
          konsole.log('error', error.response);
        })

      api.getAddressByUserId(userId)
        .then((res) => {
          setMemberAddress(res.data.data.addresses?.find(ele => ele.addressTypeId == '1'))
        })
        .catch((err) => konsole.log(err.response));

      api.getMember(userId)
        .then((response) => {
          setMemberData(response.data.data.member)
          konsole.log("71", response.data.data.member)
        })
        .catch((err) => konsole.log(err.response));

      api.GetVeteranByUserId(userId)
        .then((response) => {
          konsole.log("veteran personal", response.data.data);
          setVeteran(response.data.data);
        })
        .catch((err) => konsole.log(err.response));
    }
  }, [userId]);

  useEffect(() => {
    if (spouseUsrId !== '') {
      api.GetOccupationByUserId(spouseUsrId)
        .then((res) => {
          konsole.log("resisSS",res)
          setSpouseRetirementAge(res.data.data[0].ageOfRetirement)
          setSpouseOccupation(res.data.data[0].occupationType)
        }).catch(error => {
          konsole.log('error', error.response);
        })

      api.GetContactByUserid(spouseUsrId)
        .then((res) => {
          setSpouseContact(res.data.data)
          konsole.log("spouse", res.data.data)
        }).catch(error => konsole.log("apiError3", error));

      api.getMember(spouseUsrId)
        .then((res) => {
          setSpouseData(res.data.data.member)
        }).catch(error => {
          konsole.log('error', error.response);
        })
        
        api.getAddressByUserId(spouseUsrId)
        .then((res) => {

          setSpouseAddress(res.data.data.addresses?.find(ele => ele.addressTypeId == '1'))
        }).catch(error => {
          konsole.log('error', error.response);
        })

      api.GetVeteranByUserId(spouseUsrId)
        .then((response) => {
          setSpouseVeteran(response.data.data);
        })
        .catch((err) => konsole.log(err.response));
    }

    // setPersonalFormData({'memberData':memberData,'memberAddress':memberAddress,'spouseData':spouseData,'spoudeAddress':spoudeAddress})
  }, [spouseUsrId]);

  konsole.log("veteran suerr", veteran);

  return (
    <div className="container-fluid personal_info-Main">
      <div className="head generate-pdf-main-color">
        <h3 className="pinfopara"> Personal Information </h3>
      </div>
      {/* <div className="container m-0 p-0"> */}
        <div className="row relationship-status p-0 m-0">
          <b className="col lbl-relationship-status generate-pdf-main-color p-0 pinfopara">Relationship Status:</b>
          <div className="col p-0 m-0">
            <input type="checkbox" class="form-check-input" id="check-married" checked={memberData?.maritalStatusId === 1} />
            <label class="form-check-label">Married</label>
          </div>
          <div className="col p-0 m-0">
            <input type="checkbox" class="form-check-input" id="check-married" checked={memberData?.maritalStatusId === 2} />
            <label class="form-check-label">Living Together</label>
          </div>
          <div className="col p-0 m-0">
            <input type="checkbox" class="form-check-input" id="check-widowed" checked={memberData?.maritalStatusId === 4} />
            <label class="form-check-label" style={{whiteSpace:"break-spaces"}}>Widowed</label>
          </div>
          <div className="col p-0 m-0">
            <input type="checkbox" class="form-check-input" id="check-never-married" checked={memberData?.maritalStatusId === 3} />
            <label class="form-check-label">Single</label>
          </div>
          <div className="col p-0 m-0">
            <input type="checkbox" class="form-check-input" id="check-divorced" checked={memberData?.maritalStatusId === 5} />
            <label class="form-check-label"> Divorced</label>
          </div>
        </div>
      {/* </div> */}
      <div id="form-personal-info">

        <FormPersonalInfo userId={userId} refrencePage='Primary' userOccupation={userOccupation} UserRetirementAge={UserRetirementAge} hidden={true} contact={memberContact} memberData={memberData} memberAddress={memberAddress} veteran={veteran} dispatchloader = {dispatchloader}></FormPersonalInfo>

        <hr className="text-danger"></hr>
        {/* <div className="pageBreakbefore"></div> */}
        <div className="pt-5"></div>
   
        {spouseUsrId && (
          <h4 className="generate-pdf-main-color ifmarriedsize">
            If married please provide The following information
          </h4>
        )}

        {spouseUsrId && <FormPersonalInfo userId={spouseUsrId} refrencePage='Spouse' userOccupation={spouseOccupation} hidden={spouseUsrId} UserRetirementAge = {spouseRetirementAge} contact={spouseContact} memberData={spouseData} memberAddress={spoudeAddress} veteran={veteranSpouse} dispatchloader = {dispatchloader}></FormPersonalInfo>}
        <hr className="text-danger"></hr>
      </div>

      {/* <div className=".container">
        <span className="text-danger border-bottom border-danger fs-3">
          Marriage
        </span>
        <div className=".container">
          <label for="present-merrage">
            Date of Present Marriage if Applicable:{" "}
          </label>
          <input type="text" id="txt-present-merrage"></input>
        </div>

        <div className=".container">
          <label for="address-present-merrage">
            City, Country ,State of Marriage:{" "}
          </label>
          <input type="text" id="txt-address-present-merrage"></input>
        </div>

        <div className=".container">
          <div className="row align-items-start">
            <div class="col-4">
              <label>Have you or your spouse been married previously?</label>
            </div>
            <div className="col-1">
              <li>
                <input
                  type="checkbox"
                  id="check-spouse-yes"
                  className="form-check-input"
                />
                <label>YES</label>
              </li>
            </div>
            <div className="col-1">
              <li style={{    width: "min-content"}}>
                <input
                  type="checkbox"
                  id="check-spouse-no"
                  className="form-check-input"
                />
                <label>NO</label>
              </li>
            </div>
          </div>
        </div>
        <div className=".container">
          <div class="row align-items-start">
            <div className="col-4">
              <label>
                Do you and your spouse have a prenuptial or postnuptial
                agreement?
              </label>
            </div>
            <div className="col-1">
              <li>
                <input
                  type="checkbox"
                  id="check-aggrement-spouse-yes"
                  className="form-check-input"
                />
                <label>YES</label>
              </li>
            </div>
            <div className="col-1">
              <li style={{    width: "min-content"}}>
                <input
                  type="checkbox"
                  id="check-aggrement-spouse-no"
                  className="form-check-input"
                />
                <label>NO</label>
              </li>
            </div>
          </div>
        </div>

        <div className=".container">
          <label>If yes, what date was the agreement signed?: </label>
          <input type="text" id="txt-aggrement-signed" ></input>
        </div>
      </div> */}
    </div>
  );
};

export default PersonalInformation;
