import React, { useState, useCallback, useEffect,useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { globalContext } from '../../pages/_app';
import { $legalInfoSidebar, profConstants } from '../Helper/Constant';
import { CustomSubSideBarLinks } from '../Custom/CustomHeaderTile';
import OrganDonationDetails from './OrganDonationDetails/OrganDonationDetails';
import ProfessionalHandler from '../Common/Professional-Usefuls/ProfessionalHandler';
import { useSelector } from 'react-redux';
import { selectHideCustomeSubSideBar } from '../Redux/Store/selectors';
import LivingWillDetails from './LivingWillDetails/LivingWillDetails';
import FiduciaryBeneficiaryDetails from './FiduciaryBeneficiary/FiduciaryBeneficiaryDetails';
import BurialHorCemetry from './BurialHorCemetry/BurialHorCemetry';
import { $AHelper } from '../Helper/$AHelper';
import LegalDocument from './LegalDocument/LegalDocument';
import usePersistActiveTab from '../Hooks/usePersistActiveTab';
import BeneficiaryLetterModal from "./BeneficiaryLetterModal"
import { paralegalAttoryId ,demo } from '../../components/control/Constant';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';


const tblHeader = ['Insurance Company', 'Policy No', 'Type of Policy', 'Policy Start', 'Policy Expire', 'Premium Frequency', 'Premium Amount', 'Death Benefits', 'Beneficiary']

const LegalInformation = () => {
  // const [activeTab, setActiveTab] = useState(1);
  const {setPageTypeId} = useContext(globalContext);
  const { loggedInMemberRoleId } = usePrimaryUserId();
  const finaLegalInfoSidebar = ((paralegalAttoryId.includes(loggedInMemberRoleId) &&  demo==false) || demo==true) ? $legalInfoSidebar : $legalInfoSidebar?.filter(ele => (ele.id != '7'));
  // const [activeSubTab, setActiveSubTab] = useState($legalInfoSidebar[0]?.subCategory?.[0]?.id);
  const [{ activeTab, activeSubTab }, setActiveTabData] = usePersistActiveTab("Legal", 1, finaLegalInfoSidebar[0]?.subCategory?.[0]?.id);
  const [colSizeSidebar, setColSizeSidebar] = useState(2); 
  const [colSizeBody, setColSizeBody] = useState(10); 
  const HideCustomeSubSideBarState = useSelector(selectHideCustomeSubSideBar);

  const handleActiveTab = useCallback((item, subItem) => {
    let value = item?.id ? item?.id : item
    let subValue = subItem?.id ? subItem?.id : subItem
    // setActiveTab(value)
    // setActiveSubTab(subValue)
    setActiveTabData(value, subValue);
    const valueMapping = {4: 36,1: 33,2: 32,3: 35,5: 37};    
    setPageTypeId(valueMapping[value] ?? null);    
  }, [activeTab])
  const handleNextTab = (item) => {
    if(activeTab == 6 && activeSubTab == 3) {
      $AHelper.$dashboardNextRoute('Professional')
    } else {
      
      if(finaLegalInfoSidebar[activeTab - 1]?.subCategory?.some(ele => ele?.id == activeSubTab + 1)) setActiveTabData(activeTab, activeSubTab + 1); // setActiveSubTab(activeSubTab + 1);
      else {
        const subCats = finaLegalInfoSidebar[activeTab + 1 - 1]?.subCategory;
        handleActiveTab(activeTab + 1, subCats?.[0]?.id);
      }
    }
  };


  useEffect(() => {
    const updateColSizes = () => {
      if (window.innerWidth <= 1033) {
        setColSizeSidebar(3);
        setColSizeBody(9);
      } else if (window.innerWidth >= 1024) {
        setColSizeSidebar(2);
        setColSizeBody(10);
      }
    };

    updateColSizes();
    window.addEventListener('resize', updateColSizes);

    return () => {
      window.removeEventListener('resize', updateColSizes)
      setPageTypeId()
    }
  }, []);

  return (
    <>
      <div className="legal-information-container">
        <Row>
        <Col md={colSizeSidebar}>
          {/* {HideCustomeSubSideBarState == true ? "" :  */}
          <CustomSubSideBarLinks
            options={finaLegalInfoSidebar}
            refrencepage={'Legalinformation'}
            activeTab={activeTab}
            activeSubTab={activeSubTab}
            onClick={handleActiveTab}
          />
          {/* } */}
          </Col>
          <Col className='legal-body Scroll2Top' md={colSizeBody}  xl={10} >
            {(activeTab != 5 && activeTab != 2 && activeTab != 3 && activeTab != 4) && <>
              {HideCustomeSubSideBarState == true ? "" : <span className='heading-of-sub-side-links'> Legal information</span>}
            </>}
            {activeTab == 6 && activeSubTab == 1 &&
              <>
                <ProfessionalHandler
                  profConstants={profConstants.elderLawAttorney}
                  handleActiveTabMain={handleNextTab}
                />

              </>
            }

            {activeTab == 6 && activeSubTab == 2 &&
              <>
                <ProfessionalHandler
                  profConstants={profConstants.familyLawyer}
                  handleActiveTabMain={handleNextTab}
                />
              </>
            }

            {activeTab == 6 && activeSubTab == 3 &&
              <>
                <ProfessionalHandler
                  profConstants={profConstants.taxBusinessSuccession}
                  handleActiveTabMain={handleNextTab}
                />
              </>
            }

            {activeTab == 2 &&
              <>
                <FiduciaryBeneficiaryDetails handleNextTab={handleNextTab} />
              </>
            }

            {activeTab == 1 &&
              <>
                <LegalDocument handleNextTab={handleNextTab} />

              </>
            }

            {/* {activeTab == 6 &&
              <>
                @@ Fiduciary Assignment
              </>
            } */}

            {activeTab == 3 &&
              <>
                <LivingWillDetails handleNextTab={handleNextTab} />
              </>
            }

            {activeTab == 4 &&
              <>
                <OrganDonationDetails handleNextTab={handleNextTab} />
              </>
            }

            {activeTab == 5 &&
              <>
                <BurialHorCemetry handleNextTab={handleNextTab} />
              </>
            }
            {activeTab == 7 &&
              <>
                <BeneficiaryLetterModal handleActiveTab={handleActiveTab} activeTab={activeTab} setActiveTabData={setActiveTabData}/>
              </>
            }



          </Col>
        </Row>
      </div>

    </>
  )
}

export default LegalInformation;
