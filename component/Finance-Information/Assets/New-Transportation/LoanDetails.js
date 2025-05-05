import React from "react";
import { Col, Row } from "react-bootstrap";
import { CustomCurrencyInput, CustomInput, CustomInterestInput , CustomPercentageInput} from "../../../Custom/CustomComponent";
import CustomCalendar from "../../../Custom/CustomCalendar";
import konsole from "../../../../components/control/Konsole";

const LoanDetails = ({liabilityloan, setLiabilityloan, isSideContent, startTabIndex}) => {

    const startingTabIndex = startTabIndex ?? 0;  


    const handleLiablityloanObj = (key, value) => {
        setLiabilityloan(prev => ({
            ...prev,
            [key]: value,
        }));
    }

    konsole.log(liabilityloan,"liabilityloanliabilityloan")

    return (

        <>
            <Row>
                <Col md={12} xl={3}>
                    <p className="heading-of-sub-side-links-3">{isSideContent}</p>
                </Col>
                <Col className="spacingBottom" xs={12} md={6} lg={4}>
                    <CustomInput
                       tabIndex={startingTabIndex + 1}
                        // isError={errMsg.fNameErr}
                        label="Name of company*"
                        placeholder="Enter name"
                        id='nameofInstitutionOrLender'
                        value={liabilityloan?.nameofInstitutionOrLender}
                    onChange={(val) => handleLiablityloanObj("nameofInstitutionOrLender", val)}
                    />
                </Col>
            </Row>

            <Row className="spacingBottom">
                <Col md={12} xl={3}>
                </Col>

                <Col xs={12} md={6} lg={4}>
                    <CustomPercentageInput
                        tabIndex={startingTabIndex + 2}
                        // isError={errMsg.fNameErr}
                        label="Interest rate"
                        placeholder="Enter name"
                        id='interestRate'
                        value={liabilityloan?.interestRatePercent}
                    onChange={(val) => handleLiablityloanObj("interestRatePercent", val)}
                    />
                </Col>
            </Row>
            <Row className="spacingBottom">
                <Col md={12} xl={3}>
                </Col>

                <Col xs={12} md={6} lg={4}>
                    <CustomCurrencyInput
                        tabIndex={startingTabIndex + 3}
                        isError=''
                        name='paymentAmount'
                        placeholder="0.00"
                        label='Monthly  amount'
                        value={liabilityloan?.paymentAmount}
                        id='monthlyAmount'
                    onChange={(val) => handleLiablityloanObj('paymentAmount', val)} 

                    />
                </Col>
            </Row>
            <Row className="spacingBottom">
                <Col md={12} xl={3}>
                </Col>

                <Col xs={12} md={6} lg={4}>
                    <CustomCurrencyInput
                        tabIndex={startingTabIndex + 4}
                        isError=''
                        name='outstandingBalance'
                        label='Outstanding balance'
                        placeholder="0.00"
                        value={liabilityloan?.outstandingBalance}
                        id='outstandingBalance'
                    onChange={(val) => handleLiablityloanObj('outstandingBalance', val)} 

                    />
                </Col>
            </Row>

            <Row className="spacingBottom">
                <Col md={12} xl={3}>
                </Col>

                <Col xs={12} md={6} lg={4}>
                    <CustomCalendar
                        tabIndex={startingTabIndex + 5}
                        label={'Pay off date'}
                        isError=''
                        placeholder="mm/dd/yyyy"
                        name='payOffDate'
                        id='payoffdate'
                        value={liabilityloan?.payOffDate}
                        allowFutureDate={true}
                    onChange={(val) => handleLiablityloanObj('payOffDate', val)} 

                    />
                </Col>
            </Row>

            <Row className="spacingBottom">
                <Col md={12} xl={3}>
                </Col>

                <Col xs={12} md={6} lg={4}>
                    <CustomInput
                        tabIndex={startingTabIndex + 6}
                        notCapital={true}
                        // isError={errMsg.fNameErr}
                        label="Loan number"
                        placeholder="Enter"
                        id='loanNumber'
                        value={liabilityloan?.loanNumber}
                    onChange={(val) => handleLiablityloanObj("loanNumber", val)}
                    />
                </Col>
            </Row>
        </>
    )
}
export default LoanDetails;