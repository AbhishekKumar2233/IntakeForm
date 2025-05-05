import Accountsetting from "../../component/Account-Settings/Accountsetting.js";
import SetupLayout from "../../component/Layout/SetupLayout.js";
import React from 'react'

const AccountSettings = () => {
    return (
        <SetupLayout name="Edit Profile" id='999'>
            <Accountsetting />
        </SetupLayout>
    )
}

export default AccountSettings
