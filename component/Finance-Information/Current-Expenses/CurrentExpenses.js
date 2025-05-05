import React, { useCallback, useEffect, useState, useRef, useContext } from 'react';
import { CustomAccordion, CustomAccordionBody } from '../../Custom/CustomAccordion';
import konsole from '../../../components/control/Konsole';
import MonthlyExpenses from './MonthlyExpenses';
import NonMonthlyExpenses from './Non-MonthlyExpenses';
import { Row, Col } from 'react-bootstrap';
import { CustomButton, CustomButton2 } from '../../Custom/CustomButton';
import { $AHelper } from '../../Helper/$AHelper';
import { $dashboardLinks } from '../../Helper/Constant';
import { globalContext } from '../../../pages/_app';
import { useLoader } from '../../utils/utils';

export const isContentMonthlyExpense = `Provide details about your monthly expenses. This will help track your budget and manage your finances efficiently.`
export const isContentNonMonthlyExpense = `Please enter your non-monthly expenses here. Include costs that do not occur on a regular monthly basis.`

const allkeys = ["0", "1"]
const CurrentExpenses = ({handleNextTab}) => {
  const [currentStep, setcurrentStep] = useState(0);
  const [error, setError] = useState('false');
  const [errMsg, setErrMsg] = useState({});
  const [activeKeys, setActiveKeys] = useState(["0"]);

  const nonMonthlyExpenses = useRef(null);
  const monthlyExpenses = useRef(null);
  // define Ref
  const { setWarning } = useContext(globalContext);

  const checkIfAllFieldsAreBlank = async () => {
    const _validateNonMonthly = await nonMonthlyExpenses?.current?.validate();
    const _validateOtherRow = await monthlyExpenses?.current?.validateOtherRow();
    
    return _validateOtherRow && _validateNonMonthly;
  };

  const UpsertUserExpense = async (type) => {
    const isAllFieldsValid = await checkIfAllFieldsAreBlank();
  
    if (!isAllFieldsValid) {      
      return;
    }
    const _monthlyExpenses = await monthlyExpenses.current.upsertMonthlyExpenses();
    konsole.log("_monthlyExpenses", _monthlyExpenses)
    if(_monthlyExpenses == false) return;
    const _nonMonthlyExpenses = await nonMonthlyExpenses.current.upsertNonMonthlyExpenses();
    konsole.log("_nonMonthlyExpenses", _nonMonthlyExpenses);
    // if (_monthlyExpenses === 'err' || _nonMonthlyExpenses === 'err') {
    if (_nonMonthlyExpenses === 'err') {
      handleActiveKeys(allkeys)
    } else {
      toasterAlert("successfully", "Successfully saved data", `Your data have been saved successfully`);
    }
    useLoader(false);
    // if (type === 'next' && !(_monthlyExpenses === 'err' || _nonMonthlyExpenses === 'err')) {
    if (type == 'next') {
      // $AHelper.$dashboardNextRoute($dashboardLinks[5].route);
      handleNextTab()
    } else {

    }
    $AHelper.$scroll2Top()
  }
  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  }

  const handleErrorChange = (val) => {
    setError(true);
    konsole.log("Error changed", val);
  };


  const handleAccordionClick = () => {
    setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
};

const handleAccordionBodyClick = (key) => {
    setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
};


  return (
    <div className='current-Expense'>
      <CustomAccordion
        isExpendAllbtn={true}
        handleActiveKeys={handleAccordionClick}
        activeKeys={activeKeys}
        allkeys={allkeys}
        activekey={activeKeys}
        header={<span className='heading-text mt-4'><p className='mt-3'>Financial Information</p></span>}
      >
        <p className="pt-3 heading-of-sub-side-links-2">Please summarize your currently monthly expenses, including expenses you may incur only once a year or occasionally(eg, property taxes, prescription drug costs, etc)</p>

        <CustomAccordionBody name={"Monthly Expenses"} eventkey={'0'} setActiveKeys={() => handleAccordionBodyClick('0')}>
          <MonthlyExpenses startTabIndex={1}  ref={monthlyExpenses} errMsg={errMsg} setErrMsg={setErrMsg} isSideContent={isContentMonthlyExpense} />
        </CustomAccordionBody>

        <CustomAccordionBody name={"Non Monthly Expenses"} eventkey={'1'} setActiveKeys={() => handleAccordionBodyClick('1')}>
          <NonMonthlyExpenses startTabIndex={2 + 5} ref={nonMonthlyExpenses}  errMsg={errMsg} setErrMsg={setErrMsg} onErrorChanged={handleErrorChange} isSideContent={isContentNonMonthlyExpense} />
        </CustomAccordionBody>
      </CustomAccordion>

      <Row style={{ marginTop: '24px' }} className='mb-3'>
        <div className='d-flex justify-content-between'>
          <CustomButton2 tabIndex={2 + 5 + 6} label="Save & Continue later" onClick={() => UpsertUserExpense('save')} />

          <CustomButton tabIndex={2 + 5 + 6 + 1} label='Save & Proceed to Tax Information' onClick={() => UpsertUserExpense('next')} />
        </div>

      </Row>
    </div>
  )
}

export default CurrentExpenses
