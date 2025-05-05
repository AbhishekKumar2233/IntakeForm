import React from 'react'
import SetupLayout from '../../component/Layout/SetupLayout'
import FinanceInformation from '../../component/Finance-Information/FinanceInformation'
const Finance = () => {

  // useEffect(()=>{
  //   let loggedUserRoleId = JSON.parse(sessionStorage.getItem('userLoggedInDetail'))?.roleId
  // if(($AHelper?.$haveAccessToParalegal(loggedUserRoleId))){
  //   window.location.replace('/setup-dashboard/Family')
  // }
  // },[])

  return (
    <SetupLayout name='Finance' id='5'>
      <FinanceInformation />
    </SetupLayout>
  )
}

export default Finance
