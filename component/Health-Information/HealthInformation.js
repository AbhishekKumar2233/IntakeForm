import React, { useCallback, useEffect, useState,useContext, useRef } from 'react';
import { Form, Row, Col, Button, Container } from 'react-bootstrap';
import konsole from '../../components/control/Konsole';
import { $healthInfoSidebar } from '../Helper/Constant';
import { CustomSubSideBarLinks } from '../Custom/CustomHeaderTile';
import FamilyMedicalInformation from './Family-Medical/FamilyMedicalInformation';
import HealthInsurance from './Health-Insurance/HealthInsurance';
import PersonalMedicalHistory from './Personal-Medical/PersonalMedicalHistory';
import PrimaryCarePhysician from './Health-Professionals/PrimaryCarePhysician';
import Specialist from './Health-Professionals/Specialist';
import { useSelector } from 'react-redux';
import { $AHelper } from '../Helper/$AHelper';
import { globalContext } from '../../pages/_app';
import { selectHideCustomeSubSideBar } from '../Redux/Store/selectors';
import LifeStyle from './LifeStyle/LifeStyle';
import PrimaryAndSpouseLifeStyle from './LifeStyle/PrimaryAndSpouseLifeStyle';
import { setHideCustomeSubSideBarState } from '../utils/utils';
import { useRouter } from 'next/router';
import usePersistActiveTab from '../Hooks/usePersistActiveTab';


const HealthInformation = ({ startLoadingPage }) => {

    // const [activeTab, setActiveTab] = useState(1)
    const {setPageTypeId} = useContext(globalContext)
    // const [activeSubTab, setActiveSubTab] = useState('');
    const [{ activeTab, activeSubTab }, setActiveTabData] = usePersistActiveTab("Health", 1, '');
    const HideCustomeSubSideBarState = useSelector(selectHideCustomeSubSideBar);

    const handleActiveTab = useCallback((item, subItem) => {
        let value = item?.id ? item?.id : item
        let subValue = subItem?.id ? subItem?.id : subItem
        // setActiveTab(value)
        // setActiveSubTab(subValue)
        setActiveTabData(value, subValue);
        const valueMapping = {1: 5,2: 7,3: 4,4: 6,5: 1,};          
          if (value in valueMapping) {
            setPageTypeId(valueMapping[value]);
          }
    }, [activeTab])

    const handleNextTab = () => {
        if(activeTab == 6){
            $AHelper.$dashboardNextRoute("Housing")
        }else{
            if($healthInfoSidebar[activeTab - 1]?.subCategory?.some(ele => ele?.id == activeSubTab + 1)) setActiveTabData(activeTab, activeSubTab + 1); // setActiveSubTab(activeSubTab + 1);
            else {
                const subCats = $healthInfoSidebar[activeTab + 1 - 1]?.subCategory;
                handleActiveTab(activeTab + 1, subCats?.[0]?.id);
            }
        }
    }
     
    useEffect(()=>{
        setHideCustomeSubSideBarState(false)
    },[])
    return (
            <Row className="health-information-container ">
               
                {/* {HideCustomeSubSideBarState == true ? "" :  */}
                 <Col className='p-0' xs={2} md={2} lg={2} xl={2} ><CustomSubSideBarLinks
                    options={$healthInfoSidebar}
                    refrencepage={'HealthInformation'}
                    activeTab={activeTab}
                    activeSubTab={activeSubTab}
                    onClick={handleActiveTab}
                />
                </Col>
           
                {startLoadingPage && <Col md={10} lg={10} xl={10}  className='health-body Scroll2Top'>

                 {/* <Row>
                    <Col></Col>
                    <Col></Col>
                 </Row> */}
                    {((activeTab == 4 && activeSubTab == 1) || HideCustomeSubSideBarState == true) ? "" : <span className='heading-of-sub-side-links'>Health Information</span>}

                    {(activeTab == 1 || activeTab == 6) && <PersonalMedicalHistory handleActiveTabMain={handleNextTab} activeTab={activeTab} />                        
                    }
                      {activeTab == 3 &&
                       <div>
                        <FamilyMedicalInformation handleActiveTabMain={handleNextTab} />
                      </div>
                       
                    }
                    {activeTab == 2 &&
                        <PrimaryAndSpouseLifeStyle activeTab={activeTab} handleActiveTabMain={handleNextTab}   />
                    }
                      {activeTab == 5 &&
                        <HealthInsurance handleActiveTabMain={handleNextTab} />
                    }
                    {activeTab == 4 && activeSubTab == 1 &&
                        <PrimaryCarePhysician handleActiveTabMain={handleNextTab} />
                    }
                    {activeTab == 4 && activeSubTab == 2 &&
                        <Specialist handleActiveTabMain={handleNextTab} />
                    }
                </Col>}
            </Row>
        // </Container>
    );
};

export default HealthInformation;