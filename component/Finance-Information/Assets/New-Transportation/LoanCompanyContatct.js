import React, { useRef, useState } from "react";
import ContactAndAddress from "../../../Custom/Contact/ContactAndAddress";
import usePrimaryUserId from "../../../Hooks/usePrimaryUserId";

export const isContent = 'This is a placeholder for future content. It will be updated with detailed information and relevant instructions pertaining to this specific aspect of the portal. Please check back soon for the complete and finalized information.';

const LoanCompanyContact = () => {

  const { primaryUserId, spouseUserId, loggedInUserId, spouseFullName, primaryMemberFullName } = usePrimaryUserId();
  const [activeTab, setActiveTab] = useState('Personal');
 
  const contactDetailsRef = useRef(null);

  return (
    <>
      <ContactAndAddress
        refrencePage='LoanCompanyContact'
        ref={contactDetailsRef}
        userId={activeTab == 'Personal' ? primaryUserId : spouseUserId}
        type={activeTab}
        isSideContent={isContent}
        isMandotry={false}
        // setPersonalDetails={activeTab == 'Personal' ? setPersonalDetails : setSpouseDetailsObj}
        // dataInfo={activeTab == 'Personal' ? personalDetails : spouseDetailsObj}
        // showType="both"

      />
    </>
  )
}
export default LoanCompanyContact;