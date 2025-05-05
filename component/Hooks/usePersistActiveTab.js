import { useEffect, useState } from "react";
import konsole from "../../components/control/Konsole";
import { $AHelper } from "../Helper/$AHelper";

const sessionKeyName = "activeTabData";

const usePersistActiveTab = ( pageName, initialActiveTab, initialActiveSubTab ) => {
    const defaultState = {
        pageName: pageName,
        activeTab: initialActiveTab,
        activeSubTab: initialActiveSubTab,
    }
    const [activeTabData, setactiveTabData] = useState(defaultState)

    useEffect(() => {
        initialSetting();
    }, [])
    
    function initialSetting () {
        let persitedState = defaultState;
        const ssActiveTabData = JSON.parse(sessionStorage.getItem(sessionKeyName) ?? '{}');
        if(ssActiveTabData?.pageName == pageName) {
            persitedState = {
                pageName: ssActiveTabData?.pageName,
                activeTab: ssActiveTabData?.activeTab,
                activeSubTab: ssActiveTabData?.activeSubTab,
            }
        }
        setSessionActiveTabData(persitedState?.activeTab, persitedState?.activeSubTab);
    }

    const setSessionActiveTabData = ( activeTab, activeSubTab ) => {
        konsole.log("shshdkjhajkhkjhf", activeTab, activeSubTab);
        const _activeTabData = {
            pageName,
            activeTab,
            activeSubTab
        }

        setactiveTabData(_activeTabData);
        sessionStorage.setItem(sessionKeyName, JSON.stringify(_activeTabData));
        $AHelper.$scroll2Top()
    }

    return [activeTabData, setSessionActiveTabData];
}

export const clearSessionActiveTabData = () => sessionStorage.removeItem(sessionKeyName);

export default usePersistActiveTab;