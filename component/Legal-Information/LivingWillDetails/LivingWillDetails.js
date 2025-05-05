import React, { useEffect, useMemo, useState, useRef, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { $AHelper } from '../../Helper/$AHelper';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { useLoader } from '../../utils/utils';
import konsole from '../../../components/control/Konsole';
import { CustomButton2, CustomButton } from '../../Custom/CustomButton';
import { globalContext } from '../../../pages/_app';
import LivingWillInfo from './LivingWillInfo';
import { $LivingWillPlaceholder } from '../../Helper/$MsgHelper';
import { HeaderOfPrimarySouseName } from '../../Personal-Information/PersonalInformation';

const LivingWillDetails = (props) => {
    const { handleNextTab } = props;
    const { primaryUserId, primaryDetails, spouseUserId, primaryMemberFullName, spouseFullName, isPrimaryMemberMaritalStatus} = usePrimaryUserId();

    // Define Ref
    const { setWarning } = useContext(globalContext);
    const primaryLivingRef = useRef(null);
    const spouseLivingRef = useRef(null);
    const [activeTab, setActiveTab] = useState(1);
    const [activeBtn, setActiveBtn] = useState(1);

    const handleActiveTabButton = (val) => {
        setActiveBtn(val)
        setActiveTab(val);
    }

    const saveData = async (type) => {        
        let apiJson = [];
        await apiJson.push(primaryLivingRef.current.saveData());
        if (isPrimaryMemberMaritalStatus) {
            await apiJson.push(spouseLivingRef.current.saveData())
        }

        // if (primaryLivingRef.current) {
        //     useLoader(true)
        //     await primaryLivingRef.current.saveData();
        //     useLoader(false)
        // }

        // konsole.log("primaryLivingRef",primaryLivingRef.current,primaryLivingRef)
        // konsole.log("apiJsonapiJson",apiJson)
        useLoader(true);
        let _res = await Promise.all(apiJson);
        useLoader(false);
        konsole.log("_res_res", _res)
        toasterAlert("successfully", "Successfully saved data", `Your data have been saved successfully.`);

        $AHelper.$scroll2Top();
        if (type == 'next') {
            handleNextTab()
        }

    }
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

    // const nextLabel = `Next: ${(activeTab === 2 || isPrimaryMemberMaritalStatus == false) ? 'Organ donation details' : spouseFullName}`;
    const nextLabel = `Next: Organ donation details`;

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }

    return (
        <>
            <div id='organ-donation' className='organ-donation'>
                {/* <div className='d-flex justify-content-between mb-2'>
                    <span className='heading-of-sub-side-links'>Legal Information</span>
                    {isPrimaryMemberMaritalStatus && (
                        <div className="d-flex align-items-end justify-content-between divAligmentForPersonlaMedicalHostory mt-0">
                            <div className="btn-div addBorderToToggleButton">
                                <button className={`view-btn ${activeBtn === 1 ? "active selectedToglleBorder" : ""}`} onClick={() => handleActiveTabButton(1)}>{primaryMemberFullName}</button>
                                <button className={`view-btn ${activeBtn === 2 ? "active selectedToglleBorder" : ""}`} onClick={() => handleActiveTabButton(2)}>{spouseFullName}</button>
                            </div>
                        </div>
                    )}
                </div> */}
                <div>
                    <span className='heading-of-sub-side-links'>Legal Information</span>
                </div>
                <Row>
                    <Col xs={12} md={12} xl={3}>
                        <div className="heading-of-sub-side-links-2 mt-3"> {$LivingWillPlaceholder.content}</div>
                    </Col>
                    <Col xs={12} md={12} xl={9}>
                        <Row className='d-none d-md-flex mt-2'>
                             {isPrimaryMemberMaritalStatus &&
                  <HeaderOfPrimarySouseName displaySpouseContent={displaySpouseContent} mdxlUi={mdxlUi} isGap={true} />
                }
                        </Row>
                        <Row>
                            <div className="status-message-livingwill w-100">
                                <span className='content-status'>If you were diagnosed with terminal illness (no reasonable hope for living more than 6 months) <b>OR</b>  In a persistent vegetative state (comatose) <b>AND</b>  Your loved ones concurred that there is no reasonable hope of you getting better, then what instructions do you want to give your loved ones with regards to the use of artificial means of life support?</span>
                            </div>
                        </Row>
                        <Row className='d-flex gap-2 mt-3'>
                            <Col>
                                <LivingWillInfo startTabIndex={1} type='Primary' ref={primaryLivingRef} activeTab={'1'} userId={primaryUserId} key={primaryUserId} />
                            </Col>
                            {isPrimaryMemberMaritalStatus &&
                                <Col>
                                    <LivingWillInfo startTabIndex={2 + 7} type='Spouse' ref={spouseLivingRef} activeTab={'2'} userId={spouseUserId} key={spouseUserId} />
                                </Col>
                            }
                        </Row>
                    </Col>

                </Row>

                {/* <LivingWillInfo ref={livingRef} activeTab={activeTab} userId={activeTab == 1 ? primaryUserId : spouseUserId} key={activeTab == 1 ? primaryUserId : spouseUserId} /> */}
            </div>
            <Row style={{ marginTop: '24px' }} className='mb-3'>
                <div className='d-flex justify-content-between'>
                    <CustomButton2 tabIndex={2 + 7 + 7} label="Save & Continue later" onClick={() => saveData('later')} />
                    <div>
                        <CustomButton tabIndex={2 + 7 + 7 + 1}  label={nextLabel} onClick={() => saveData('next')} />
                    </div>
                </div>
            </Row>
        </>
    );
}

export default LivingWillDetails;
