import React from 'react'
// import SetupLayout from '../../component/Layout/SetupLayout';
import dynamic from 'next/dynamic';

const PersonalInformation = dynamic(() => import('../../component/Personal-Information/PersonalInformation'), { 
  ssr: false,
  // loading: () => <p className='p-5'>Personal Information Loading...</p>,
});
const SetupLayout = dynamic(() => import('../../component/Layout/SetupLayout'), { ssr: false });

const PersonalInfo = () => {
  return (

      <SetupLayout name='Personal Information' id='1'>
        <PersonalInformation />
      </SetupLayout>
  )
}

export default PersonalInfo;
