import React, { useState, useEffect, useImperativeHandle, forwardRef, useContext } from 'react';
import { Form, Col, Table, Row, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { updateUserNonMonthlyExpenseList, updatePaymentMethod, putUserExpense } from '../../Redux/Reducers/financeSlice';
import { CustomCurrencyInput, CustomInput, CustomSelect } from '../../Custom/CustomComponent';
import { focusInputBox, getApiCall, isNotValidNullUndefile, postApiCall } from '../../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../../components/network/UrlPath';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { selectorFinance } from '../../Redux/Store/selectors';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { useLoader } from '../../utils/utils';
import konsole from '../../../components/control/Konsole';
import { $AHelper } from '../../Helper/$AHelper';
import { globalContext } from '../../../pages/_app';

const NonMonthlyExpenses = forwardRef((props, ref) => {
   const {isSideContent, errMsg, setErrMsg}= props;
  const { primaryUserId, loggedInUserId } = usePrimaryUserId();
  const dispatch = useAppDispatch();
  const financeSelector = useAppSelector(selectorFinance);
  const { userNonMonthlyExpenseList, paymentMethod, putUserNonMonthlyExpenseList } = financeSelector;
  const tableHeader = ['Description', 'Amount', 'Payment method'];
  const { newConfirm, setWarning } = useContext(globalContext)
  const startingTabIndex = props?.startTabIndex ?? 0;

  const [newRow, setNewRow] = useState($JsonHelper.createJsonForNonExpense());

  konsole.log(konsole.log(putUserNonMonthlyExpenseList, "putUserNonMonthlyExpenseList"))

  useEffect(() => {
    if(isNotValidNullUndefile(primaryUserId)) {
    getPaymentMethod();
    getNonMonthlyExpenses();
    }
  }, [primaryUserId]);

  useImperativeHandle(ref, () => ({
    upsertNonMonthlyExpenses,
    validate,
    handleErrorExists: (val) => {
      props.onErrorChanged(val);
    },
  }));

  const getNonMonthlyExpenses = async () => {
    useLoader(true)
    const response = await getApiCall('GET', `${$Service_Url.getUserMonthlyExpensesPath}${primaryUserId}`, '');
    useLoader(false)
    konsole.log("getUserNonMonthlyExpense", response);
    if (response !== 'err') {
      dispatch(updateUserNonMonthlyExpenseList(
        response?.filter(x => x.expenseFreqId === 5)
            .map(item => ({
                ...item,
                expenseAmt: $AHelper.$forIncomewithDecimal(item?.expenseAmt)
            }))
    ));
    
    }
  };

  const getPaymentMethod = async () => {
    if(paymentMethod.length >0) return;
    useLoader(true)
    const response = await getApiCall('GET', $Service_Url.getPaymentMethod, '');
    useLoader(false)
    if (response !== 'err') {
      dispatch(updatePaymentMethod(response));
    }
  };

  const handlePaymentMethodSelect = (key, selectedValue, index, isError) => {
    konsole.log("selectedValue", selectedValue, isError);
    if (index !== undefined) {
      const updatedList = userNonMonthlyExpenseList.map((item, i) =>
        i === index ? {
          ...item,
          [key]: selectedValue,
          isError: isError ?? false,
          isChanged: true,
        } : item
      );
      konsole.log("updatedListChange", updatedList);
      dispatch(updateUserNonMonthlyExpenseList(updatedList));
    }
    else {
      setNewRow({ ...newRow, [key]: selectedValue, isError: false });
      konsole.log("NewHandleNewRow", newRow);
    }
  };

  const handleAddRow = async () => {
    const isValid = validate(true);
    konsole.log(isValid, "isValidisValidisValidisValid")
    if (isValid) {
      const updatedList = [...userNonMonthlyExpenseList, { ...newRow, isActive: true }];
      await upsertNonMonthlyExpenses(updatedList);
      setNewRow($JsonHelper.createJsonForNonExpense());
      toasterAlert("successfully", "Successfully saved data", `Your data have been saved successfully`);
    }
  };

  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);

  }

  const handleRemoveRow = (index) => {
    return async () => {
      const updatedList = userNonMonthlyExpenseList.map((ele, i) => (i == index) ? ({ ...ele, isActive: false }) : ele);
      const confirmRes = await newConfirm(true, `Are you sure you want to delete this Expense? This action cannot be undone.`, "Confirmation", `Delete Expense`, 2);
      if (!confirmRes) return;
      konsole.log(updatedList, "updatedList")
      useLoader(true);
      await upsertNonMonthlyExpenses(updatedList, true);
      toasterAlert("deletedSuccessfully", `Expense has been deleted successfully`);
      useLoader(false);
      konsole.log(updatedList, "updatedList")
    };
  };

  const handleBlurMethod = (key, obj, index) => {
    const errors = { expense: '' };
    let occurrence = userNonMonthlyExpenseList.reduce((count, item) => {
      if (item.expense === obj.expense) {
        return count + 1;
      }
      return count;
    }, 0);

    let isError = occurrence > 1 ? 'Expense name should be unique.' : false;
    konsole.log("occurrence", occurrence);
    errors.expense = isError ? "Expense name should be unique." : '';

    if (isError != false) {
      handlePaymentMethodSelect(key, '', index, isError);
      if (ref.current && typeof ref.current.handleErrorExists === 'function') {
        ref.current.handleErrorExists(true);
      }
    }
  };

  const validate = (isHandleAddRow = false) => {
    const errors = { expense: '', expenseAmt: '' };
    let isValid = true;

    let uniqueLabels = [];
    const newUserNonMonthlyExpenseList = userNonMonthlyExpenseList?.map((ele, index) => {
      const isEmpty = $AHelper.$isNullUndefine(ele.expense);
      const isDuplicate = uniqueLabels.includes(ele.expense);
      if(!isDuplicate) uniqueLabels?.push(ele.expense);
      if(isEmpty || isDuplicate) {
        isValid = false;
        focusInputBox("expenseLabel" + index);
      }
      return isEmpty ? ({ ...ele, isError: "Expense description field should not be empty." }) : isDuplicate ? ({ ...ele, isError: "Expense name already exists." }) : (ele);
    });

    dispatch(updateUserNonMonthlyExpenseList(newUserNonMonthlyExpenseList));

    const rawExpense = newRow.expense;
    const hasLeadingSpace = typeof rawExpense === 'string' && rawExpense.startsWith(' ');
    const trimmedExpense = rawExpense?.trim();
    if (isHandleAddRow && $AHelper.$isNullUndefine(rawExpense)) {
      errors.expense = "Expense description field should not be empty.";
      isValid = false;
    }
    if (hasLeadingSpace) {
      errors.expense = "Expense name should not start with a space.";
      isValid = false;
    }
    if (userNonMonthlyExpenseList.some(x => x.expense?.trim() === trimmedExpense)) {
      errors.expense = "Expense name already exists.";
      isValid = false;
    }
    if (!$AHelper.$isNullUndefine(newRow.expenseAmt) && $AHelper.$isNullUndefine(rawExpense)) {
      errors.expense = "Please enter the expenses name.";
      isValid = false;
    }
       if(isNotValidNullUndefile(errors?.expense)){
        setWarning("warning", errors.expense);
       }     
    setErrMsg(prevErrors => ({ ...prevErrors, ...errors }));
    setNewRow({ ...newRow, isError: !isValid });

    if (!isValid && ref.current && typeof ref.current.handleErrorExists === 'function') {
      ref.current.handleErrorExists(true);
    }

    return isValid;
  };


  const validateList = async (list) => {

    return new Promise((resolve, reject) => {
      let isErrorFind = false;

      const updatedListArr = list?.map((item) => {
        let isError = $AHelper.$isNotNullUndefine(item.expense) ? false : 'Expense field should not be empty';
        konsole.log("isErrorisError", isError);
        isErrorFind = isErrorFind == false ? isError : isErrorFind;
        return {
          ...item,
          isError: isError
        }
      })
      konsole.log("updatedListArr", updatedListArr)
      if (isErrorFind !== false) {
        dispatch(updateUserNonMonthlyExpenseList(updatedListArr));
      }

      resolve(isErrorFind)
      return isErrorFind;
    })

  };

  const upsertNonMonthlyExpenses = async (_updatedList, isDeleteOperation = false) => {
    return new Promise(async (resolve, reject) => {
      if (isDeleteOperation) {
        konsole.log("Skipping validation for delete operation");
      } else {
        const isValid = validate();
        konsole.log(isValid, "isValid validation result");

        if (!isValid) {
          if (ref.current && typeof ref.current.handleErrorExists === 'function') {
            ref.current.handleErrorExists(true);
          }
          resolve('err');
          return;
        }
      }
      const updatedList = [...(_updatedList ?? userNonMonthlyExpenseList)];
      konsole.log(updatedList, "updatedList")
      const listValidationResult = await validateList(updatedList);

      if (listValidationResult !== false) {
        useLoader(false);
        if (ref.current && typeof ref.current.handleErrorExists === 'function') {
          ref.current.handleErrorExists(true);
        }
        resolve('err');
        return;
      }

      if ($AHelper.$isNotNullUndefine(newRow.expense) && $AHelper.$isNotNullUndefine(newRow.expenseAmt)) {
        if (!updatedList.some(item => item.expense === newRow.expense && item.expenseAmt === newRow.expenseAmt)) {
          updatedList.push(newRow);
        }
        setNewRow($JsonHelper.createJsonForNonExpense());
      }

      updatedList?.forEach((item, index) => {
        console.log(`Item ${index}:`, item);
        console.log(`isChanged:`, item.isChanged);
      });

      const postNonExpense = updatedList
        ?.map(item => ({
          expenseName: item.expense,
          expenseId: item.expenseId,
          expenseFrequencyId: item.expenseFreqId
        }));

        if(postNonExpense.length==0){
          resolve('no-data');
          return;
        }
      useLoader(true);
      try {
        const result = await postApiCall('POST', $Service_Url.upsertNonMonthlyExpenses, postNonExpense);
        const responseData = result?.data?.data;

        if (!responseData) {
          useLoader(false);
          resolve('err');
          return;
        }

        const postNonExpenseData = {
          userId: primaryUserId,
          upsertedBy: loggedInUserId,
          upsertUserExpense: updatedList.map(item => {
            let expensesId = item.expenseId;
            if (item.expenseId === 0) {
              const matchedExpense = responseData.find(i => i.expenseName === item.expense);
              expensesId = matchedExpense ? matchedExpense.expenseId : item.expenseId;
            }

            return {
              expenseId: expensesId ?? 0,
              expenseAmt: item.expenseAmt,
              expenseFreqId: item.expenseFreqId,
              userExpenseId: item.userExpenseId,
              paymentMethodId: item.paymentMethodId,
              isActive: item.isActive
            };
          })
        };

        const res = await postApiCall('POST', $Service_Url.upsertMonthlyExpenses, postNonExpenseData);
        if (res === 'err') {
          resolve('err2');
        } else {
          getNonMonthlyExpenses();
          resolve(res);
        }
      } catch (error) {
        useLoader(false);
        console.error('API error:', error);
        resolve('err2');
      }
    });
  };

  const sortedPaymentMethod = [...paymentMethod].sort((a, b) => {
    if (/^(other)$/i.test(a.label)) return -1;
    if (/^(other)$/i.test(b.label)) return 1;
    return 0;
  });

  return (
    <div id='nonMonthlyExpenses-monthlyExpenses'>
      <Row>
        <Col xs={12} md={12} xl={3}>
          <div className="heading-of-sub-side-links-3">{isSideContent}</div>
        </Col>
        <Col xs={12} md={12} xl={9}>
          <div id="information-table" className="mt-4 information-table table-responsive overflow-visible">
            <div className='border-top-0' style={{border:'25px !important'}}>
              <Table className="custom-table">
                <thead className="sticky-header">
                  <tr>
                    {tableHeader.map((item, index) => (
                      <th style={{ fontWeight: 'bold', borderRadius: index == 0 ? '12px 0 0 0' : index == 2 ? '0 12px 0 0' : '' }} key={index}>{item}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className='table-body-tr'>
                  {userNonMonthlyExpenseList.map((item, index, indexOfEle) => item?.isActive && (
                    <tr key={index}>
                      <td id={'expenseLabel' + index} >
                        <CustomInput tabIndex={startingTabIndex + indexOfEle} notCapital={true} isPersonalMedical={true}refrencePage="NonMonthlyExpenses" label="" isError={item.isError != false ? item.isError : ''} placeholder="Please type here..." 
                        id='expense' value={item?.expense} onBlur={(e) => handleBlurMethod('expense', item, index)} onChange={(e) => handlePaymentMethodSelect('expense', e, index)} />
                      </td>
                      <td>
                        <CustomCurrencyInput tabIndex={startingTabIndex + indexOfEle} name='expenseAmt' isError={''} label='' id='expenseAmt' value={item?.expenseAmt} onChange={(e) => handlePaymentMethodSelect('expenseAmt', e, index)} />
                      </td>
                      <td className={(userNonMonthlyExpenseList?.length > 3 &&   userNonMonthlyExpenseList?.length - 3 < index) ? 'legal-drop' : ''}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <CustomSelect tabIndex={startingTabIndex + indexOfEle} isNonMonthlyExpense={true}  isError='' label='' value={item?.paymentMethodId} id={item?.paymentMethodId}
                            options={paymentMethod} placeholder='Select'
                            onChange={(e) => handlePaymentMethodSelect('paymentMethodId', e.value, index)} />
                          <div>
                            <Button onClick={handleRemoveRow(index)} className="remove-button" style={{ marginLeft: '20px', padding: '10px' }}></Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{position:'relative'}}>
                      <CustomInput tabIndex={startingTabIndex + 4} notCapital={true}refrencePage="NonMonthlyExpenses" label="" isError={newRow.isError ? errMsg.expense : ''} placeholder="Please type here..." id='expenseLast'
                        value={newRow?.expense} onChange={(val) => handlePaymentMethodSelect('expense', val)} />
                    </td>
                    <td style={{position:'relative'}}>
                      <CustomCurrencyInput tabIndex={startingTabIndex + 5} refrencePage="NonMonthlyExpenses" name='expenseAmt' isError={newRow.isError ? errMsg.expenseAmt : ''} label='' id='expenseAmt' value={newRow.expenseAmt}
                        onChange={(e) => handlePaymentMethodSelect('expenseAmt', e)}
                      />
                    </td>
                    <td style={{position:'relative'}}  className={ ( userNonMonthlyExpenseList?.length > 3 && userNonMonthlyExpenseList?.length - 3 ) < userNonMonthlyExpenseList.length   ? 'legal-drop' : ''}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <CustomSelect tabIndex={startingTabIndex + 6} isNonMonthlyExpense={true}  isError='' label='' value={newRow.paymentMethodId} id='newpaymentMethodId' options={sortedPaymentMethod}
                          placeholder='Select' onChange={(e) => handlePaymentMethodSelect('paymentMethodId', e.value)}
                        />
                        <div>
                          <Button  onClick={handleAddRow} className="circle-button" style={{ marginLeft: '20px', padding: '10px' }}></Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
});

export default React.memo(NonMonthlyExpenses);
