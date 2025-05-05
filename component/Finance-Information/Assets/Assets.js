import React, { useState } from 'react'
import { CustomHeaderTile } from '../../Custom/CustomHeaderTile'
import { $financeInfoSidebar } from '../../Helper/Constant'
import AddRetirementNonRetirement from './RetirementNonRetirement.js/AddRetirementNonRetirement';
import RetirementNonRetirement from './RetirementNonRetirement.js/RetirementNonRetirement';
import BusnessIntrestHome from './BusinessIntrests/BusnessIntrestHome';
import FutureExpections from './FutureExpections/FutureExpections';
import NewTransportation from './New-Transportation/NewTransportation';

import LongTermCareInsurancePolicyTable from '../LongTermCareInsurancePolicy/LongTermCareInsurancePolicyTable';
import LifeInsurance from './Life Insurance/LifeInsurance';
import { CustomHeaderTileForAssets } from '../../Custom/CustomHeaderTile';
import RealEsate from './RealEstate/RealEstate';
import RealEstate from './RealEstate/RealEstate';
const Assets = ( props ) => {
    // const [activeTab, setActiveTab] = useState(11);
    const activeTab = props?.activeSubTab;


    const handleActiveTab = (val) => {
        console.log("handleActiveTab", val);
        // setActiveTab(val)
        props?.handleActiveTabMain()
    }
    return (
        <>
        {/* <div className=''> */}
            {/* <CustomHeaderTileForAssets 
                header={$financeInfoSidebar[1]?.subMenus} 
                handleActiveTab={handleActiveTab} 
                activeTab={activeTab}
             /> */}
        {/* </div> */}
            {/* @@Non Retirement */}
            {activeTab == 11 && <>
                <RetirementNonRetirement key={'Non-Retirement'} type='Non-Retirement' handleActiveTab={handleActiveTab} />
            </>}
            {/* @@Non Retirement */}
            {/* @@Retirement */}
            {activeTab == 12 && <>
                <RetirementNonRetirement key={'Retirement'} type='Retirement' handleActiveTab={handleActiveTab} />
            </>}
            {/* @@Retirement */}
            {/* @@Real Estate*/}
            {activeTab == 13 && <>
                <RealEstate handleActiveTab={handleActiveTab} />
            </>}
            {/* @@Real Estate */}
            {/* @@Life Insurance */}
            {activeTab == 16 && <>
               <LifeInsurance handleActiveTab={handleActiveTab} />
            </>}
            {/* @@Life Insurance */}
            {/* @@Business Interests*/}
            {activeTab == 14 && <>
                <BusnessIntrestHome key={'Busness Intrests'} type='BusnessIntrests' handleActiveTab={handleActiveTab} />
            </>}
            {/* @@Business Interests */}
            {/* @@Long- term Care Insurance Policy */}
            {activeTab == 17 && <>
                <LongTermCareInsurancePolicyTable key={'Long Term Care Insurance Policy'} handleActiveTab={handleActiveTab}/>
            </>}
            {/* @@Long- term Care Insurance Policy */}
            {/* @@Future Expectations */}
            {activeTab == 18 && <>
                <FutureExpections activeTab={activeTab} handleActiveTab={handleActiveTab} />
            </>}
            {/* @@Future Expectations */}
            {/* @@Non Retirement */}
            {activeTab == 15 && <>
                <NewTransportation activeTab={activeTab} handleActiveTab={handleActiveTab}/>
                {/* <NewTransportation activeTab={activeTab} handleActiveTab={props.handleActiveTabMain}/> */}
            </>}
            {/* @@Transportation */}

        </>
    )
}

export default Assets
