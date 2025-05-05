import React, { useCallback, useEffect, useState, useRef, useContext } from 'react';
import { CustomAccordion, CustomAccordionEye } from '../../Custom/CustomAccordion';
import konsole from '../../../components/control/Konsole';
import MonthlyIncome from './MonthlyIncome';
import TaxInformation from './TaxInformation';
import { Row, Col } from 'react-bootstrap';
import { CustomButton, CustomButton2 } from '../../Custom/CustomButton';
import { $AHelper } from '../../Helper/$AHelper';
import { globalContext } from '../../../pages/_app';
import { useLoader } from '../../utils/utils';
import CurrentExpenses from '../Current-Expenses/CurrentExpenses';


export const isContentTaxInformation = `Provide your tax-related information to assist in your life planning. This information will help in assessing your financial health and planning your future more effectively`

const allkeys = ["0", "1"]
const Income = (props) => {
  const [error, setError] = useState('false');
  const [activeKeys, setActiveKeys] = useState(allkeys);
  const [stateButton, stateButtonButton] = useState(true);
  const taxInformation = useRef(null);
  const monthlyIncome = useRef(null);
  const { setWarning } = useContext(globalContext);

  const UpsertUserExpense = async (type) => {
    // useLoader(true);
    const monthlyUpsert = await monthlyIncome?.current?.handleUpdateClick();
    if(monthlyUpsert == false) return true; 
    // const _monthlyIncome = await monthlyIncome.current.fetchData();
    // konsole.log("_monthlyIncome", _monthlyIncome)
    // const _taxInformation = await taxInformation.current.getTaxList();
    // konsole.log("_taxInformation", _taxInformation);
    // if (_taxInformation === 'err') {
    //   handleActiveKeys(allkeys)
    // } else {
    // }
    // useLoader(false);
    if (type === 'next') {
      toasterAlert("successfully", "Successfully saved data", `Your data have been saved successfully`);
      props.handleActiveTabMain(7)
    }

  }
  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  }

  const handleErrorChange = (val) => {
    setError(true);
    konsole.log("Error changed", val);
  };

  const showButtons = (condition) => {
    stateButtonButton(condition);
  };

  // const handleActiveKeys = (val) => {
  //   setActiveKeys(val)
  // }

  const handleNext = (type) => {
    if (type === 'next') {
      if (taxInformation.current) {
        taxInformation?.current?.handledata();
      }
      // toasterAlert("successfully", "Successfully saved data", `${props?.activeTab == 1 ? `Monthly Income` : `Tax Information`} data saved successfully.`);
      toasterAlert("successfully", "Successfully saved data", `Your data have been saved successfully`);
      props.handleActiveTabMain(7)
    }
  };

  const isSideContent = 'Please enter your estimated monthly income here. This information helps us provide personalized financial insights and recommendations.';
  const isSideContentTax = 'Provide your tax-related information to assist in your life planning. This information will help in assessing your financial health and planning your future more effectively.';

  return (
    <div>
        <>
          <span className='heading-text mt-4'><p className='mt-3'>Financial Information</p></span>

          {props.activeTab == 1 && <MonthlyIncome startTabIndex={1} ref={monthlyIncome} isSideContent={isSideContent} />}
          {props.activeTab == 2 && <TaxInformation startTabIndex={2 + 18} ref={taxInformation} showButton={showButtons} handleNextTab={handleNext} isSideContent={isContentTaxInformation} UpsertUserExpense={UpsertUserExpense} next={props.handleActiveTabMain} />}

          {stateButton && (
          <Row style={{ marginTop: '24px' }} className='mb-3'>
            <div className='d-flex justify-content-between'>
              <div></div>
              {/* <CustomButton2 label="Save & Continue later" onClick={() => UpsertUserExpense('save')} /> */}
              {props?.activeTab == 1 && <CustomButton tabIndex={2 + 18 + 11} label={`Save & Proceed to ${props?.activeTab == 1 ? 'Current Expenses' : 'Financial Professionals'}`} onClick={() => UpsertUserExpense('next')} />}</div>
          </Row>
          )}
        </>
    </div>
  )
}

export default Income