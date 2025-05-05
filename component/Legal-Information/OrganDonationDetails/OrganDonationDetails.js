import React, { useEffect, useMemo, useState, useRef, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { $AHelper } from '../../Helper/$AHelper';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { useLoader } from '../../utils/utils';
import konsole from '../../../components/control/Konsole';
import { CustomButton2, CustomButton } from '../../Custom/CustomButton';
import OrganDonation from './OrganDonation';
import { globalContext } from '../../../pages/_app';
import { $OrganDonationPlaceholder } from '../../Helper/$MsgHelper';
import { HeaderOfPrimarySouseName } from '../../Personal-Information/PersonalInformation';

const OrganDonationDetails = (props) => {
    const { handleNextTab } = props
    const { primaryUserId, primaryDetails, spouseUserId, primaryMemberFullName, spouseFullName, isPrimaryMemberMaritalStatus} = usePrimaryUserId();
    const { setWarning } = useContext(globalContext);
    // define Ref
    const primaryOrganRef = useRef(null);
    const spouseOrganRef = useRef(null);
    const [activeTab, setActiveTab] = useState(1);
    const [activeBtn, setActiveBtn] = useState(1);

    const handleActiveTabButton = (val) => {
        setActiveBtn(val)
        setActiveTab(val)
    }

    const saveData = async (type) => {
        useLoader(true);
        let apiJson = [];
        await apiJson.push(primaryOrganRef?.current.saveData());
        if (isPrimaryMemberMaritalStatus) {
            await apiJson.push(spouseOrganRef?.current.saveData())
        }
        let _res = await Promise.all(apiJson);
        konsole.log('_res', type, _res)
        useLoader(false);
        toasterAlert("successfully", "Successfully saved data", `Your data have been saved successfully`);
        if (type == 'next') {
            // handleActiveTabButton(2);
            handleNextTab();
        }
    }
    const nextLabel = useMemo(() => {
        // let label = `Next: ${spouseFullName}`
        // if (activeTab == 2 || isPrimaryMemberMaritalStatus == false) {
        // }
        let label = 'Next: Burial cremation plan'
        return label;
    }, [activeTab, spouseFullName])

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }
    // konsole-------------
    konsole.log('activeTabactiveTab', activeTab)

    const mdxlUi = useMemo(() => {
        return {
            md: spouseUserId ? 6 : 10,
            xl: spouseUserId ? (primaryDetails?.maritalStatusId == 3 ? 12 : 6) : 10,
        };
        }, [spouseUserId, primaryDetails?.maritalStatusId]);
    
        const displaySpouseContent = useMemo(() => {
          let value = ((isPrimaryMemberMaritalStatus == true) || 
        ($AHelper.$isNotNullUndefine(spouseUserId)) && primaryDetails?.maritalStatusId == 4) ? true : false;
        return value;
        }, [isPrimaryMemberMaritalStatus, spouseUserId])

    return (
        <>
            <div id='organ-donation' className='organ-donation'>
                {/* updated code */}
                <div>
                    <span className='heading-of-sub-side-links'>Legal Information</span>
                </div>
                <Row>
                    <Col xs={12} md={12} xl={3}>
                        <div className="heading-of-sub-side-links-2 mt-3"> {$OrganDonationPlaceholder.content}</div>
                    </Col>
                    <Col xs={12} md={12} xl={9}>
                        <Row className='d-none d-md-flex mt-2'>
                            {isPrimaryMemberMaritalStatus &&
                                <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi} isGap={true} />
                            }
                        </Row>
                        <Row className='d-flex gap-2 mt-3'>
                            <Col>
                                <OrganDonation
                                    startTabIndex={1}
                                    key='Primary'
                                    ref={primaryOrganRef}
                                    activeTab={'1'}
                                    userId={activeTab == 1 ? primaryUserId : spouseUserId}
                                />
                            </Col>
                            {(isPrimaryMemberMaritalStatus) &&
                                <Col>
                                    <OrganDonation
                                        startTabIndex={2 + 2}
                                        key='Spouse'
                                        ref={spouseOrganRef}
                                        activeTab={'2'}
                                        userId={spouseUserId}
                                    />
                                </Col>
                            }
                        </Row>
                    </Col>
                </Row>
                {/* updated code */}
            </div>
            <Row style={{ marginTop: '24px' }} className='mb-3'>
                <div className='d-flex justify-content-between'>
                    <CustomButton2 tabIndex={2 + 2 + 2} label="Save & Continue later" onClick={() => saveData('later')} />
                    <div>
                        <CustomButton tabIndex={2 + 2 + 2+ 1}  label={nextLabel} onClick={() => saveData('next')} />
                    </div>
                </div>
            </Row>
        </>
    )
}

export default OrganDonationDetails
