import { Card } from "react-bootstrap";
import { $AHelper } from "../../control/AHelper";
import Col from "react-bootstrap";
import { memo } from "react";
import { isNotValidNullUndefile } from "../../Reusable/ReusableCom";
import konsole from "../../control/Konsole";

const _notAvailableMsg = 'Not available.'
const PersonCard = ({ item, type, addressTypeList }) => {

  let { userName, userEmail, userGender, userPhoneNumber, userDOB, userRelationshipStatus, personName, personEmail, personGender, personPhoneNumber, personDOB, personRelationWithUser, personRelationWithSpouse, address } = item;
  const isPrimary = type === 'Primary';

  console.log("addressTypeList", addressTypeList)
  {
    if (isPrimary) {
      personName = userName
      personEmail = userEmail
      personGender = userGender
      personPhoneNumber = userPhoneNumber
      personDOB = userDOB
    }
  }


  function validateAddress(address) {
    for (const key in address) {
      if (address[key] !== "") {
        return true;
      }
    }
    return false;
  }



  const returnAddress = (address, index) => {

    console.log("addressaz", address)
    const { personAddressStreet, personAddressCity, personAddressState, personAddressZipCode, addressTypeId } = address
    const memberAddress = personAddressStreet + " " + personAddressCity + " " + personAddressState + " " + personAddressZipCode;
    let cmpAddress = <span>{index !== 0 && <br />}<b>{addressTypeList?.find(item => item?.value == addressTypeId)?.label} Address:-</b> {" "}{memberAddress}</span>

    console.log("returnAddress", address)
    return cmpAddress
  }

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title><div style={{color:"black"}}>{personName}</div></Card.Title>
        {konsole.log(personEmail,personDOB,"personEmail")}
        <Card.Text>
          <strong>Email:</strong> {(isNotValidNullUndefile(personEmail) && personEmail != 'null') ? personEmail : _notAvailableMsg}<br />
          <strong>Gender:</strong>{(isNotValidNullUndefile(personGender) && personGender != 'null') ? personGender : _notAvailableMsg}<br />
          <strong>Phone Number:</strong>  {(isNotValidNullUndefile(personPhoneNumber) && personPhoneNumber != 'null') ? $AHelper.convertToUSFormat(personPhoneNumber,'1') : _notAvailableMsg}<br />
          <strong>Date of Birth:</strong> {(isNotValidNullUndefile(personDOB) && personDOB != 'null') ? $AHelper.getFormattedDate(personDOB) : _notAvailableMsg}<br />
          {!isPrimary && <>
            <strong>Relation with User:</strong> {personRelationWithUser}<br />
            <strong>Relation with Spouse:</strong> {personRelationWithSpouse}<br />
          </>}
          {isPrimary && (<>
            <strong>Marital Status:</strong> {userRelationshipStatus} <br />
          </>)}
          {address.length > 0 ? address?.map((item, index) => {
            return returnAddress(item, index)
          }) : <> <strong>Address:</strong> {_notAvailableMsg}</>}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default memo(PersonCard);