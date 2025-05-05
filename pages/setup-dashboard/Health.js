import React, { useEffect, useState } from 'react'
import SetupLayout from '../../component/Layout/SetupLayout'
import HealthInformation from '../../component/Health-Information/HealthInformation'
import HealthStartingModal from '../HealthStartingModal'
import { paralegalAttoryId } from '../../components/control/Constant'
import usePrimaryUserId from '../../component/Hooks/usePrimaryUserId';
import konsole from '../../components/control/Konsole'
const Health = () => {
    const [showHeathStartingModal, setShowHeathStartingModal] = useState(true);
    const {loggedInMemberRoleId}=usePrimaryUserId()
    const functionForDicModal=(value)=>{
      konsole.log("valueofHealth",value)
    setShowHeathStartingModal(value)
    }
    
  return (
    <>
     <SetupLayout name="Health" id='3'>
       <HealthInformation startLoadingPage={showHeathStartingModal === false || paralegalAttoryId.includes(loggedInMemberRoleId)} />
     </SetupLayout>
     {(showHeathStartingModal && !paralegalAttoryId.includes(loggedInMemberRoleId))? 
     <HealthStartingModal functionForDicModal={functionForDicModal}/>
     : <></>} 
    </>
    
    
  )
}

export default Health
