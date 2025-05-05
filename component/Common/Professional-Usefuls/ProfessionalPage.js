import { Col, Row } from "react-bootstrap";
import ProfessionalHandler from "./ProfessionalHandler";
import { useSelector } from "react-redux";
import { selectHideCustomeSubSideBar } from "../../Redux/Store/selectors";
import { profConstants } from "../../Helper/Constant";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";
import { $AHelper } from "../../Helper/$AHelper";
import { useEffect } from "react";
import { clearSessionActiveTabData } from "../../Hooks/usePersistActiveTab";

const ProfessionalPage = () => {
    const { roleUserId } = usePrimaryUserId();
    const HideCustomeSubSideBarState = useSelector(selectHideCustomeSubSideBar);

    useEffect(() => {
        clearSessionActiveTabData()
    }, [])

    const handleNextTab = () => {
        roleUserId != 9 ? 
            $AHelper.$newDashboardRoute()
        : 
            $AHelper.$dashboardNextRoute('Agent')
    }

    return (
        <>
        <Row className="professional-information-container ">
            <Col xs md={12} xl className='professional-body Scroll2Top' style={{marginLeft: 'auto'}} >
                {HideCustomeSubSideBarState == true ? "" : <span className='heading-of-sub-side-links'>My service provider</span>}

                <ProfessionalHandler
                    profConstants={{...profConstants.myProfessional,  nxtBtnName: roleUserId != 9 ? 'Home' : profConstants.myProfessional.nxtBtnName }}
                    handleActiveTabMain={handleNextTab}
                />
            </Col>
        </Row>
        </>
    )
}

export default ProfessionalPage;