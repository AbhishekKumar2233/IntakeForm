import React, { useState, useCallback,useContext ,useEffect} from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { globalContext } from '../../pages/_app'
import { CustomSubSideBarLinks } from '../Custom/CustomHeaderTile'
import { $financeInfoSidebar, profConstants } from '../Helper/Constant'
import Assets from './Assets/Assets'
import { $AHelper } from '../Helper/$AHelper'
import { $dashboardLinks } from '../Helper/Constant'
import TaxInformation from './Income/TaxInformation'
import CurrentExpenses from './Current-Expenses/CurrentExpenses'
import ProfessionalHandler from '../Common/Professional-Usefuls/ProfessionalHandler'
import { useSelector } from 'react-redux'
import { selectHideCustomeSubSideBar } from '../Redux/Store/selectors'
import LiblitiesHome from './Liblities/LiblitiesHome'
import Income from './Income/Income'
import { CustomAccordion, CustomAccordionBody } from '../Custom/CustomAccordion'
import usePersistActiveTab from '../Hooks/usePersistActiveTab'


const FinanceInformation = () => {
    // const [activeTab, setActiveTab] = useState(1);
    const {setPageTypeId} = useContext(globalContext);
    // const [activeSubTab, setActiveSubTab] = useState('');
    const [{ activeTab, activeSubTab }, setActiveTabData] = usePersistActiveTab("Finance", 1, 11);
    const HideCustomeSubSideBarState = useSelector(selectHideCustomeSubSideBar);

    const handleActiveTab = useCallback((item, subItem) => {
        let value = item?.id ? item?.id : item
        let subValue = subItem?.id ? subItem?.id : subItem
        // setActiveTab(value)
        // setActiveSubTab(subValue)
        setActiveTabData(value, subValue)
        if (value === 1) {
            const subValueMapping = {
              11: 15, 12: 16, 13: 17, 14: 19, 
              15: 22, 16: 18, 17: 20, 18: 21
            };
            if (subValue in subValueMapping) {
              setPageTypeId(subValueMapping[subValue]);
            }
          } else {
            const valueMapping = {
              3: 24, 5: 25, 4: 26, 2: 23
            };
            if (value in valueMapping) {
              setPageTypeId(valueMapping[value]);
            }
          }        
        
    }, [activeTab])

    const handleNextTab = () => {
        if(activeTab == 6 && activeSubTab == 3){
            $AHelper.$dashboardNextRoute($dashboardLinks[5].route)
        }else{
            if($financeInfoSidebar[activeTab - 1]?.subCategory?.some(ele => ele?.id == activeSubTab + 1)) setActiveTabData(activeTab, activeSubTab + 1); // setActiveSubTab(activeSubTab + 1);
            else {
                const subCats = $financeInfoSidebar[activeTab + 1 - 1]?.subCategory;
                handleActiveTab(activeTab + 1, subCats?.[0]?.id);
            }
        }
       
    }


    return (
        <>
            {/* <div className="mt-4 finance-information-container mb-4"> */}
            <Row className='finance-information-container '>
            <Col md={2}>
                {/* {HideCustomeSubSideBarState == true ? "" :  */}
                <CustomSubSideBarLinks
                    options={$financeInfoSidebar}
                    refrencepage={'HousingInformation'}
                    activeTab={activeTab}
                    activeSubTab={activeSubTab}
                    onClick={handleActiveTab}
                />
                {/* } */}
                </Col>
                <Col className='finance-body d-flex flex-column Scroll2Top' md={10} xl={10}  >
                    
                        {(activeTab == 1 || activeTab == 2 || activeTab == 6) ? <span className='heading-of-sub-side-links'> Financial information</span> : "" }
                    

                    {/* @@ Financial Advisor */}
                    {activeTab == 6 && activeSubTab == 1 &&
                        <>
                            <ProfessionalHandler
                                profConstants={profConstants.financialAdvisors}
                                handleActiveTabMain={handleNextTab}
                            />
                        </>}
                    {/* @@ Financial Advisor */}
                    {/* @@ Accountant */}
                    {activeTab == 6 && activeSubTab == 2 &&
                        <>
                            <ProfessionalHandler
                                profConstants={profConstants.accountants}
                                handleActiveTabMain={handleNextTab}
                            />
                        </>}
                    {/* @@ Accountant */}
                    {/* @@ Bookeeper */}
                    {activeTab == 6 && activeSubTab == 3 &&
                        <>
                            <ProfessionalHandler
                                profConstants={profConstants.bookkeepers}
                                handleActiveTabMain={handleNextTab}
                            />
                        </>}
                    {/* @@ Bookeeper */}
                    {/* @@ Assets */}
                    {activeTab == 1 &&
                        <>
                            <Assets handleActiveTabMain={handleNextTab} activeSubTab={activeSubTab} />

                        </>}
                    {/* @@ Assets */}
                    {/* @@ Liabilities */}

                    {activeTab == 2 &&
                        <>
                            <LiblitiesHome handleNextTab={handleNextTab} />

                        </>}
                    {/* @@ Liabilities */}
                    {/* @@ Monthly Income */}

                    {(activeTab == 3 || activeTab == 5) &&
                        <>
                            <Income 
                                handleActiveTabMain={handleNextTab}
                                activeTab={activeTab == 3 ? 1 : 2}
                                // setActiveTab={setActiveTab}
                            />
                        </>}
                    {/* @@ Monthly Income */}
                    {/* @@ Current Expenses */}

                    {activeTab == 4 &&
                        <>

                            <CurrentExpenses handleNextTab={handleNextTab} />

                        </>}
                    {/* @@ Current Expenses */}


                </Col>
            </Row>
            {/* </div> */}
        </>
    )
}

export default FinanceInformation