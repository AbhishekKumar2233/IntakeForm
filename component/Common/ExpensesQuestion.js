import React, { useMemo, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { expensesPaidObj } from '../../components/control/Constant';
import { CustomInput, CustomNumInput, CustomRadio } from '../Custom/CustomComponent';
import konsole from '../../components/control/Konsole';
import { $AHelper } from '../Helper/$AHelper';

const ExpensesQuestion = ({ value, setStateInsDetail, refrencePage, isHealthpage, isAddRetirepage, startTabIndex }) => {
    const [selectedOptions, setSelectedOptions] = useState({});
    const startingTabIndex = startTabIndex ?? 0;

    // console.log("valuevaluevaluevaluesb",value)
    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(value)) {
            const obj = JSON?.parse(value);
            setSelectedOptions(obj);
        } else {
            setSelectedOptions({});
        }
    }, [value]);



    // @@ Radio Change
    const handleRadioChange = (questionIndex, val) => {
        setSelectedOptions((prevState) => {
            const newState = { ...prevState, [questionIndex]: val };

            if (questionIndex === "expensePaid" && val !== "2") {
                delete newState.bankname;
                delete newState.accountnumber;
            }

            if (val === "2") {
                delete newState.paymentMode;
            }
            

            setStateInsDetail('quesReponse', JSON.stringify(newState));
            return newState;
        });
    };

    // @@Text Value
    const texAreaInputChange = (name, value) => {
        konsole.log("texAreaInputChange", value, "name", name)
        setSelectedOptions((prev) => {
            let prevVal = { ...prev }; // Create a copy of prev to ensure it is defined
            prevVal[name] = value ?? '';
            setStateInsDetail('quesReponse', JSON.stringify(prevVal));
            return prevVal; // Return the updated state
        });
    }


    // const selectedValue = useMemo(() => JSON.parse(value), [value]);
    const selectedValue=useMemo(()=>{
        if ($AHelper.$isNotNullUndefine(value)) {
          return JSON?.parse(value);
        }
        return ''
    },[value])

    konsole.log("selectedValue", selectedValue,expensesPaidObj[0].options);
    konsole.log("selectedOptions", selectedOptions);

    return (
        <>
            <Row className=' ms-1 spacingBottom'>
                <CustomRadio
                    tabIndex={startingTabIndex + 1}
                    name='isExpenses'
                     placeholder={<strong>{expensesPaidObj?.[0]?.question}</strong>}
                    options={expensesPaidObj[0].options}
                    onChange={(e) => handleRadioChange("expensePaid", e?.value)}
                    value={selectedValue?.expensePaid}
                />
            </Row>

            {selectedValue && selectedValue?.expensePaid == 1 && (
                <Row className='ms-1 '>
                    <CustomRadio
                       tabIndex={startingTabIndex + 2}
                        name='isPaymentMode'
                        placeholder={expensesPaidObj?.[1]?.question}
                        options={expensesPaidObj[1].options}
                        onChange={(e) => handleRadioChange("paymentMode", e?.value)}
                        value={selectedValue?.paymentMode}
                    />
                </Row>
            )}

            {selectedValue && selectedValue?.expensePaid == 2 && (
                <Row className={`${(refrencePage === 'Business' || refrencePage === 'realEstate' || refrencePage === "transportation" || isHealthpage || isAddRetirepage) ? 'gapNone' : refrencePage === 'Lifeinsurance' || refrencePage === "Policy" ? 'gapProfessionalNoneReal' : ''} mb-4 ms-2`}>
                    <Col xs={12} md={6} lg={isHealthpage ? 5 : selectedValue && selectedValue?.expensePaid == 2 ? 5 : (refrencePage === 'Business' || refrencePage === 'Policy' ? 5 : 6)} className='ps-1'>
                        <CustomInput
                           tabIndex={startingTabIndex + 3}
                            isError=''
                            name="bankname"
                            label="Enter the Bank Name"
                            placeholder="Enter the Bank Name"
                            id='bankname'
                            onChange={(val) => texAreaInputChange('bankname', val)}
                            value={selectedValue?.bankname || ''}
                        />
                        {konsole.log(refrencePage,"sfdjfjfjdfdjfdjfdf")}
                    </Col>
                    <Col xs={12} md={6} lg={isHealthpage ? 5 : selectedValue && selectedValue?.expensePaid == 2 ? 5 : (refrencePage === 'Business' || refrencePage === 'Policy' ? 5 : 6)} className=''>
                        <CustomNumInput
                            tabIndex={startingTabIndex + 4}
                            isError=''
                            name="accountnumber"
                            label="Enter the Account Number"
                            placeholder="Enter the Account Number"
                            id='accountnumber'
                            onChange={(val) => texAreaInputChange('accountnumber', val)}
                            value={selectedValue?.accountnumber || ''}
                            maxLength={20}
                        />
                    </Col>
                </Row>
            )}
        </>
    );
};

export default ExpensesQuestion;
