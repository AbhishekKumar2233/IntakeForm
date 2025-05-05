import React from "react";
import { Col, Row } from "react-bootstrap";
import { CustomCurrencyInput, CustomInput, CustomRadio, CustomSelect } from "../../../Custom/CustomComponent";
import CustomCalendar from "../../../Custom/CustomCalendar";
import { isNotValidNullUndefile } from "../../../../components/Reusable/ReusableCom";
import { $AHelper } from "../../../Helper/$AHelper";
import konsole from "../../../../components/control/Konsole";
import { OwnerDropDown } from "../../../Common/OwnerDropDown";

const radioValuesOwn = [{ label: "Owned", value: false }, { label: "Leased", value: true }];
const radioValuesOcc = [{ label: "Yes", value: true }, { label: "No", value: false }];

const OwnershipInfomation = ({ ownerTypesList, setAssetInfo, assetInfo, isRealPropertyObj, setIsRealPropertyObj, liabilityInfo, setLiabilityInfo, loanSelection, setLoanSelection, isSideContent, startTabIndex }) => {

    const startingTabIndex = startTabIndex ?? 0;  



    const handleSelectOwner = (val) => {
        console.log(val, "handleSelectOwner")
        setAssetInfo(prev => ({ ...prev, ['assetOwners']: val }))
    }

    const handleRadioOnchange = (key, value) => {
        // console.log("datavalue",key, value,value?.value == true)
        // if(value==null){return}
        setIsRealPropertyObj(prev => ({
            ...prev,
            [key]: value?.value
        }))
        if(key == "isDebtAgainstProperty"){
            setLoanSelection(null)
        }

        if (key == 'loanSelection') {
            setLoanSelection(value?.value)
        }
    };
    const handleLiablityObj = (key, value) => {
        setLiabilityInfo(prev => ({
            ...prev,
            [key]: value
        }));
    }
    konsole.log(liabilityInfo, "liabilityloandata")
    konsole.log("isRealPropertyObj",isRealPropertyObj)
    konsole.log("loanSelectionloanSelection",loanSelection)
    return (

        <>
            <Row>
                <Col md={12} xl={3} className="mt-3">
                    <p className="heading-of-sub-side-links-3">{isSideContent}</p>
                </Col>
                <Col xs={12} md={6} lg={4} className="mt-3 spacingBottom">
                    <OwnerDropDown startTabIndex={startTabIndex + 1} assetOwners={assetInfo?.assetOwners}
                        savedAssetOwners={assetInfo?.assetOwners}
                        handleSelectOwner={handleSelectOwner}
                        isInfoAdd={assetInfo?.assetOwners.length == 0} />
                </Col>
            </Row>
            <Row className="spacingBottom">
                <Col md={12} xl={3}>

                </Col>
                <Col xs={12} md={6} lg={4}>
                    {/* {console.log("radioValuesOwnradioValuesOwn",isRealPropertyObj)} */}
                    <CustomRadio
                        tabIndex={startingTabIndex + 2}
                        placeholder={<span style={{ fontWeight: 'bold' }}>Is the transport assets :</span>}
                        options={radioValuesOwn}
                        value={isRealPropertyObj?.isDebtAgainstProperty}
                        onChange={(val) => handleRadioOnchange('isDebtAgainstProperty', val)}
                    />

                </Col>
            </Row>
            {isRealPropertyObj?.isDebtAgainstProperty == false ? (
                <>
                    <Row className="mb-3 mt-0">
                        <Col md={12} xl={3}>

                        </Col>
                        <Col xs={12} md={6} lg={4}>
                            <CustomRadio
                                tabIndex={startingTabIndex + 3}
                                placeholder={<span style={{ fontWeight: 'bold' }}>Is there a loan against this transport?</span>}
                                options={radioValuesOcc}
                                value={loanSelection}
                                onChange={(val) => handleRadioOnchange('loanSelection', val)}
                            />

                        </Col>
                    </Row>
                </>
            ) : ""}
            {isRealPropertyObj?.isDebtAgainstProperty == true ? (
                <>
                    <Row>
                        <Col md={12} xl={3}></Col>
                        <Col xs={12} md={12} lg={9}>
                            <Row className="mt-3">
                                <Col lg={6} md={12}>
                                    <CustomInput
                                        tabIndex={startingTabIndex + 4}
                                        label="Name of company*"
                                        placeholder="Enter Company Name"
                                        value={liabilityInfo?.nameofInstitutionOrLender}
                                        id="nameofInstitutionOrLender"
                                        onChange={(val) => handleLiablityObj('nameofInstitutionOrLender', val)}
                                    />
                                </Col>
                                <Col lg={6} md={12}>
                                    <CustomCurrencyInput
                                        tabIndex={startingTabIndex + 5}
                                        label="Monthly Amount"
                                        placeholder="Monthly Amount"
                                        id='paymentAmount'
                                        value={liabilityInfo?.paymentAmount}
                                        onChange={(val) => handleLiablityObj('paymentAmount', val)}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={12} xl={3}></Col>
                        <Col xs={12} md={12} lg={9}>
                            <Row className="mt-2">
                                <Col lg={6} md={12}>
                                    <CustomCurrencyInput
                                        tabIndex={startingTabIndex + 6}
                                        isError=''
                                        name='outstandingBalance'
                                        label='Outstanding balance'
                                        placeholder="0.00"
                                        value={liabilityInfo?.outstandingBalance}
                                        id='outstandingBalance'
                                        onChange={(val) => handleLiablityObj('outstandingBalance', val)}
                                    />
                                </Col>
                                <Col lg={6} md={12} className="mt-1">
                                    <CustomCalendar
                                        tabIndex={startingTabIndex + 7}
                                        label='Pay off date'
                                        isError=''
                                        placeholder="mm/dd/yyyy"
                                        name='payOffDate'
                                        id='payOffDate'
                                        value={liabilityInfo?.payOffDate}
                                        allowFutureDate={true}
                                        onChange={(val) => handleLiablityObj('payOffDate', val)}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>
            ) : ""}

        </>
    )
}

export default OwnershipInfomation;