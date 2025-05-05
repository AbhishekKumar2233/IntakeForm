 import React, { useEffect, useState } from 'react'
import SetupLayout from '../../component/Layout/SetupLayout';
import EmergencyInformation from '../../component/Emergency/Emergency-Information';
import HealthStartingModal from '../HealthStartingModal';
import { paralegalAttoryId } from '../../components/control/Constant';
import usePrimaryUserId from '../../component/Hooks/usePrimaryUserId';

const Emergency = () => {
  const [showHeathStartingModal, setShowHeathStartingModal] = useState(true);
  const {loggedInMemberRoleId}=usePrimaryUserId();
  const functionForDicModal=(value)=>{
    setShowHeathStartingModal(value)
  }
    return (
      <>
       <SetupLayout name='Emergency' id='9'>
          <EmergencyInformation />
       </SetupLayout>
        {(showHeathStartingModal && !paralegalAttoryId.includes(loggedInMemberRoleId))? 
            <HealthStartingModal functionForDicModal={functionForDicModal}/>
            : <></>} 
      </>
     
    )
  }
  
  export default Emergency