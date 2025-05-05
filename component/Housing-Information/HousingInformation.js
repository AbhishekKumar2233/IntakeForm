import React, { useState, useCallback} from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { CustomSubSideBarLinks } from '../Custom/CustomHeaderTile'
import { $housingInfoSidebar, profConstants } from '../Helper/Constant'
import HousingOption from './HousingOptions/HousingOptions'
import ProfessionalHandler from '../Common/Professional-Usefuls/ProfessionalHandler'
import { useSelector } from 'react-redux'
import { $AHelper } from '../Helper/$AHelper'
import { $dashboardLinks } from "../Helper/Constant";
import { selectHideCustomeSubSideBar, selectPersonal } from '../Redux/Store/selectors'
import usePersistActiveTab from '../Hooks/usePersistActiveTab'
import { useAppSelector } from '../Hooks/useRedux'
import usePrimaryUserId from '../Hooks/usePrimaryUserId'
import { demo } from '../../components/control/Constant'

const HousingInformation = () => {
    // const [activeTab, setActiveTab] = useState(1)
    // const [activeSubTab, setActiveSubTab] = useState('');
    const [{ activeTab, activeSubTab }, setActiveTabData] = usePersistActiveTab("Housing", 1, '');
    const HideCustomeSubSideBarState = useSelector(selectHideCustomeSubSideBar);
    const { loggedInUserId } = usePrimaryUserId();
         const personalReducer = useAppSelector(selectPersonal);
         const {handleOffData} = personalReducer;
        
       const getSessionUserActiveData = () => {
           if (typeof window !== "undefined") {
               const data = sessionStorage.getItem("isUserActive");
               return data ? JSON.parse(data) : null;
           }
           return null;
          };

           const storedData = getSessionUserActiveData();

    const handleActiveTab = useCallback((item, subItem) => {
        let value = item?.id ? item?.id : item
        let subValue = subItem?.id ? subItem?.id : subItem
        // setActiveTab(value)
        // setActiveSubTab(subValue)
        setActiveTabData(value, subValue)
    }, [activeTab])

    const handleNextTab = () => {
        if(activeTab == 2 && activeSubTab == 4) {
            const shouldGoToRoute5 = (storedData == true || handleOffData == false) &&
            !((demo == false && loggedInUserId == "9e6ea069-3eff-429a-8ffd-6a082f1c72b3") ||
            (demo == true && ["7f1e7602-f6e5-4719-9311-f8bd1d1e4fc3", "305bf342-40f2-4ae3-a8c0-4ac8c3754279"]?.includes(loggedInUserId)));   
            if (shouldGoToRoute5) {
                $AHelper.$dashboardNextRoute($dashboardLinks[5]?.route);
            } else {
                $AHelper.$dashboardNextRoute($dashboardLinks[4]?.route);
            }
            return; 
        }
    
        if($housingInfoSidebar[activeTab - 1]?.subCategory?.some(ele => ele?.id == activeSubTab + 1)) {
            setActiveTabData(activeTab, activeSubTab + 1); // setActiveSubTab(activeSubTab + 1);
        } else {
            const subCats = $housingInfoSidebar[activeTab + 1 - 1]?.subCategory;
            handleActiveTab(activeTab + 1, subCats?.[0]?.id);
        }
    }
    return (
        <>
            {/* <Container className="mt-4 housing-information-container"> */}
                <Row className="housing-information-container">
                    {/* {HideCustomeSubSideBarState == true ? "" :  */}
                    {/* <CustomSubSideBarLinks
                        options={$housingInfoSidebar}
                        refrencepage={'HousingInformation'}
                        activeTab={activeTab}
                        activeSubTab={activeSubTab}
                        onClick={handleActiveTab}
                    /> */}
                    <Col md={2} lg={2} xl={2} className='p-0'>
                        <CustomSubSideBarLinks
                            options={$housingInfoSidebar}
                            refrencepage={'HousingInformation'}
                            activeTab={activeTab}
                            activeSubTab={activeSubTab}
                            onClick={handleActiveTab}
                        />
                    </Col>
                    {/* } */}
                    {/* <Col className='housing-body'> */}
                    <Col className='housing-body Scroll2Top' xl={10} lg={10} md={10}>
                        {(activeTab != 1) && <> {HideCustomeSubSideBarState == true ? "" : <span className='heading-of-sub-side-links'>Housing information</span>}</>}


                        {/* @@ Realtor */}
                        {activeTab == 2 && activeSubTab == 1 &&
                            <>
                                <ProfessionalHandler 
                                    profConstants={profConstants.realtor}
                                    handleActiveTabMain={handleNextTab}
                                />

                            </>}
                        {/* @@ Realtor */}
                        {/* @@ Mortgage Broker */}
                        {activeTab == 2 && activeSubTab == 2 &&
                            <>
                                <ProfessionalHandler 
                                    profConstants={profConstants.mortgageBrokers}
                                    handleActiveTabMain={handleNextTab}
                                />

                            </>}
                        {/* @@ Mortgage Broker */}
                        {/* @@ Handyman */}
                        {activeTab == 2 && activeSubTab == 3 &&
                            <>
                                <ProfessionalHandler 
                                    profConstants={profConstants.handymanServices}
                                    handleActiveTabMain={handleNextTab}
                                />

                            </>}
                        {/* @@ Handyman */}
                        {/* @@ Landscaper */}
                        {activeTab == 2 && activeSubTab == 4 &&
                            <>
                                <ProfessionalHandler 
                                    // profConstants={{...profConstants.landscaper, ...(storedData == true ? { nxtBtnName: "Legal" } : {}) }}
                                    profConstants={{...profConstants.landscaper, ...((handleOffData == false || storedData == true) && 
                                    !((demo == false && loggedInUserId == "9e6ea069-3eff-429a-8ffd-6a082f1c72b3") ||
                                    (demo == true && ["7f1e7602-f6e5-4719-9311-f8bd1d1e4fc3", "305bf342-40f2-4ae3-a8c0-4ac8c3754279"]?.includes(loggedInUserId)))
                                    ? { nxtBtnName: "Legal" } : {})}}
                                    handleActiveTabMain={handleNextTab}
                                />

                            </>}
                        {/* @@ Landscaper */}
                        {/* @@ Housing Options */}
                        {activeTab == 1 &&
                            <>
                               <HousingOption setActiveTabData={setActiveTabData} />

                            </>}
                        {/* @@ Housing Options */}

                    </Col>
                </Row>
            {/* </Container> */}
        </>
    )
}

export default HousingInformation;
