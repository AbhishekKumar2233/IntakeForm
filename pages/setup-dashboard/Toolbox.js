import React from 'react'
import SetupLayout from '../../component/Layout/SetupLayout';
import ToolboxInfo from '../../component/ToolBox/ToolboxInfo';
// import PersonalInformation from '../../component/Personal-Information/PersonalInformation';

const Toolbox = () => {
    return (

        <SetupLayout name='Personal Information' id='101'>
            <ToolboxInfo />
        </SetupLayout>
    )
}

export default Toolbox;
