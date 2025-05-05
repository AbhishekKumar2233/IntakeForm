import React from 'react'
import { $AHelper } from '../../components/control/AHelper';
import Carousel from 'react-bootstrap/Carousel';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
export const CustomHeaderTile = (props) => {
    const { children, header, handleActiveTab, activeTab } = props;
    return (
        <div className='custom-header-with-heading' id='custom-header-with-heading'>
            {children}
            {header?.length > 0 &&
                <>
                  <div id='custom-header-tileNew' className='custom-header-tileNew '>
                        {header.map((item, index) => (
                            <div key={index} className={`${activeTab == item.value ? 'active-tab-nav' : ""} tab-nav`} onClick={() => handleActiveTab(item.value)}>
                                {item.label}
                            </div>
                        ))}
                    </div>
                </>   
            }
        </div>
    )
}
export const CustomHeaderTileForAssets = (props) => {
    const { children, header, handleActiveTab, activeTab } = props;
    const assetsNamesArray = [];

    for (let i = 0; i < header.length; i += 3) {
        assetsNamesArray.push(header.slice(i, i + 3));
    }

    // Check if targetDiv exists and has at least 3 children, and if activeTab is either 14 or 17
    // const targetDiv = document.getElementById("financeCarousel");
    // if (targetDiv && targetDiv.children.length > 2 && (activeTab === 14 || activeTab === 17)) {
    //     targetDiv.children[2].click();
    // }

    return (
        <>
            <Carousel className='financeCarousel mt-4' id="financeCarousel" interval={null} indicators={false}>
                {assetsNamesArray?.map((items, index) => (
                    <Carousel.Item key={index}>
                        <div className='custom-header-with-headingCarousel' id='custom-header-with-headingAssets'>
                            {items?.length > 0 && (
                                <Row className='' style={{ padding: '0px 10px' }} >
                                    <div className='custom-header-tile  '>
                                        {items?.map((item, idx) => (
                                            <div key={idx} className={`col-4 tab-nav ${activeTab === item.value ? 'active-tab-nav' : ''}`} onClick={() => handleActiveTab(item.value)}>
                                                {item.label}
                                            </div>
                                        ))}
                                    </div>
                                </Row>
                            )}
                        </div>
                    </Carousel.Item>
                ))}

            </Carousel>
        </>
    )
}


export const CustomAddChildProgressBar = ({ children, totalSteps, currentStep }) => {
    // const totalSteps = 4;
    const currentStepVal = parseInt(currentStep);
    const progressWidth = (currentStepVal / totalSteps) * 100;

    const progressBarStyle = {
        height: '8px',
        width: '100%',
        backgroundColor: 'lightgray',
        position: 'relative',
        borderRadius: '4px'
    };

    const progressStyle = {
        height: '8px',
        width: `${progressWidth}%`,
        backgroundColor: '#440814',
        borderRadius: '4px'
    };



    return <>
        <div className='custom-header-progress-bar' id='custom-header-progress-bar'>

            {children}
            <div style={progressBarStyle} className='custom-header-progress-line'>
                <div style={progressStyle}></div>
            </div>

        </div>
    </>
}




export const CustomSubSideBarLinks = ({ options, refrencepage, activeTab, activeSubTab, onClick }) => {

    return <>

        {/* <Col className='CustomSubSideBarLinks-sidebar-col maxFullWidth'> */}
        <Col className='CustomSubSideBarLinks-sidebar-col maxFullWidth' style={{ position: "sticky", top: "0px", zIndex: "10"}}>
            <div id="CustomSubSideBarLinks-sidebar" className='CustomSubSideBarLinks-sidebar customLeftBorder'>

                {options.map((item, index) => {

                    let activeTabMatch = (refrencepage == 'FamilyInformation') ? item.value : item.id;
                    let isSelected = activeTab == activeTabMatch || item?.subCategory?.some(subIem => subIem.id == activeSubTab);
                    return <>
                        <div className={`${isSelected ? 'active-nav-item-div' : ''} nav-item-div d-flex flex-column`}
                            key={index} >
                            <div style={{textAlign: 'left', width:'100%', display: item?.label == "Add Extended Family / Friends" || item?.label == "Personal Medical History" || item?.label == "Medication & Supplements"
                            || item?.label == "Financial Professionals" || item?.label == "Previous Legal Documents" || item?.label == "Organ Donation Details" ? "flex" : "block"}}>
                            {/* <div style={{textAlign: 'left', width:'100%', display:"flex"}}> */}
                           { isSelected? <img className='mt-0' src='/New/newIcons/newDashboardlineActive.svg' style={{height:"30px"}}/> : <img className='mt-0'  src='/New/newIcons/newDashboardline2.svg' style={{height:"30px"}}/>}
                                <span className='cursor-pointer ps-1' onClick={() => isSelected != true && onClick(item, item?.subCategory?.[0]?.id)}>{item?.label}</span>
                            </div>
                            {item?.subCategory && isSelected && <div style={{width: '100%', marginLeft:"45px"}}>
                                {item?.subCategory?.map((subItem, index) => {
                                    
                                    return <>
                                        <div className={`${activeSubTab == subItem?.id ? 'active-nav-item-div active-nav-item-div2' : ''} nav-item-div justify-content-start`}
                                            key={index}>
                                            { activeSubTab == subItem?.id  ? <img src='/New/newIcons/newDashboardlineActive.svg' style={{height:"30px"}}/> : <img src='/New/newIcons/newDashboardline2.svg' style={{height:"30px"}}/>}
                                            <span className='cursor-pointer' onClick={() => onClick(item, subItem)}>{subItem?.label}</span>
                                        </div>
                                    </>
                                    }
                                )}
                            </div>}
                        </div>
                    </>
                })}

            </div>
        </Col>
    </>
}

export const CustomeSubTitleWithEyeIcon = ({title, sideContent}) => {
    return (
        <p className='customSubTitle'>{title}<OverlayTrigger className="ms-3 numnumnum" placement="bottom" overlay={<Tooltip id='CustomAccordianEye'>{sideContent}</Tooltip>}>
            <img src="/New/icons/iIconInfo.svg" width="15px" height="auto" className="p-0 m-0 mx-2" alt="Information" /></OverlayTrigger>
        </p>
    )
}