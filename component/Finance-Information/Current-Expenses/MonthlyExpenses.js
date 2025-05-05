import React, { useCallback, useEffect, useState,useImperativeHandle,forwardRef, useRef, useContext } from 'react';
import { Form, Col,Table, Row, Alert, Button } from 'react-bootstrap';
import { useAppDispatch,useAppSelector } from '../../Hooks/useRedux';
import { updateExpenseTypesList,updateUserExpenseList,updatePaymentMethod } from '../../Redux/Reducers/financeSlice';
import { selectorFinance } from '../../Redux/Store/selectors';
const tableHeader = ['Type of Expense','Amount','Payment method']
import { $Service_Url } from '../../../components/network/UrlPath';
import { focusInputBox, getApiCall, isNotValidNullUndefile, isNullUndefine, postApiCall } from '../../../components/Reusable/ReusableCom';
import { CustomCurrencyInput,CustomInputSearch,CustomSelect, CustomSelectValue } from '../../Custom/CustomComponent';
import konsole from '../../../components/control/Konsole';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { useLoader } from '../../utils/utils';
import { $AHelper } from '../../Helper/$AHelper';
import Other from '../../../components/asssets/Other';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { globalContext } from '../../../pages/_app';


const MonthlyExpenses = forwardRef(( props,ref,) => { 
    const {isSideContent, error, setErrMsg, errMsg}= props 
    const dispatch = useAppDispatch();
    const financeSelector = useAppSelector(selectorFinance);
    const {expenseTypesList,userExpenseList,paymentMethod} = financeSelector;
    const [getExpenseType, setgetExpenseType] = useState('');
    const { primaryUserId, loggedInUserId } = usePrimaryUserId();
    const otherRef = useRef(null);
    const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
    const startingTabIndex = props.startTabIndex ?? 0;

    useEffect(() => {
      if(isNotValidNullUndefile(primaryUserId)) {
      getPaymentMethod();
      if(expenseTypesList?.length == 0){
        getexpensetypesbyFreq();
      } else if(expenseTypesList?.length > 0 && userExpenseList?.length == 0 ) {
        getUserMonthlyExpenses(expenseTypesList);
      } else {
        getUserMonthlyExpenses(expenseTypesList);
      }
      }
    },[expenseTypesList, primaryUserId]);

    useImperativeHandle(ref, () => ({
      upsertMonthlyExpenses,
      validateOtherRow
    }));

    const upsertMonthlyExpenses = useCallback(async () => {
      const isValidOtherInputs = validateOtherRow();
      if(isValidOtherInputs != true) return false;      
      let userExpenseListFilter = userExpenseList;
      if(otherRef.current?.state?.othersName == ''){
        userExpenseListFilter = userExpenseListFilter.filter((e)=>{return e.expenseId != 999999})
      }
      useLoader(true)   
      return new Promise(async(resolve,reject)=>{
        let upsertMonthlyExpenseData = {
          userId: primaryUserId,
          upsertedBy: loggedInUserId,
          upsertUserExpense: userExpenseListFilter
        }
        // console.log("upsertMonthlyExpenseData",upsertMonthlyExpenseData)
    
        const res = await postApiCall('POST', $Service_Url.upsertMonthlyExpenses, upsertMonthlyExpenseData);
        useLoader(false);
        if (res == 'err') {
          resolve('err')
        }
        if(res != 'err'){
          let otherApicondition = res?.data?.data?.filter((e)=>{return e.expenseId == '999999' && e.userExpenseId != 0})
          konsole.log("gasjg", otherApicondition, otherRef)
          if(otherApicondition?.length > 1){
            const otherStartIndex = expenseTypesList?.length;
            // otherApicondition.map(async (e, index) => { 
            //   konsole.log("gasjg-index", e, otherRef.current?.[otherStartIndex + index]?.state?.othersName)
            //   if(index == 0 || otherRef.current?.[otherStartIndex + index - 1]?.state?.othersName == ""){
            //     return;
            //   }else if(e?.userExpenseId){
            //     await otherRef.current?.[otherStartIndex + index - 1]?.saveHandleOther(e?.userExpenseId)
            //   }
            // })
            for (let index = 0; index < otherApicondition.length; index++) {
              const e = otherApicondition[index];
              konsole.log("gasjg-index", e, otherRef.current?.[otherStartIndex + index]?.state?.othersName);
              if (index === 0 || otherRef.current?.[otherStartIndex + index - 1]?.state?.othersName === "") {
                continue;
              } else if (e?.userExpenseId) {
                await otherRef.current?.[otherStartIndex + index - 1]?.saveHandleOther(e?.userExpenseId);
              }
            }
            
          }
        }
        // console.log("postNonExpenseDataResult", otherStartIndex);
        getUserMonthlyExpenses(expenseTypesList);
        resolve(res)
      })

  })

  const getexpensetypesbyFreq = async() => {  
      useLoader(true)        
        const getExpenseType =await getApiCall('GET',$Service_Url.getexpensetypesbyFreqId+ "/4",'')
        useLoader(false) 
        if(getExpenseType !='err'){
            dispatch(updateExpenseTypesList(getExpenseType));
        }
        setgetExpenseType(getExpenseType)
    }
    const getPaymentMethod = async() => { 
      if(paymentMethod?.length  != 0 ) return;   
        useLoader(true)  ; 
        const resultOf =await getApiCall('GET',$Service_Url.getPaymentMethod,'')
        useLoader(false)   
        if(resultOf !='err'){
          dispatch(updatePaymentMethod(resultOf));
        }   
    }
    const getUserMonthlyExpenses = async(expenseTypesList) => {   
      useLoader(true)      
      const resultOf =await getApiCall('GET',$Service_Url.getUserMonthlyExpensesPath+ primaryUserId,'')
      useLoader(false) 
      if(getExpenseType !='err'){
          let userExpenseArray = [];
 
          expenseTypesList.forEach(i => {
            let merged = false;
            resultOf.forEach(j => {
              if (i.value == j.expenseId) {
                userExpenseArray.push({ ...i,...j,expenseType: i.type,expenseAmt:$AHelper.$forIncomewithDecimal(j?.expenseAmt)});
                merged = true;
              }
            });
            if (!merged) {
              userExpenseArray.push({
                ...i,
                expenseId: parseInt(i.value),
                expenseAmt: 0,
                expenseFreqId: 4,
                paymentMethodId: null,
                userExpenseId: 0,
                isActive: true,
                expenseType: i.type
              });
            }
          });
          konsole.log(userExpenseArray,"Dfdfdkfdkfkddkdkfdfkd")
          dispatch(updateUserExpenseList(userExpenseArray));
      }
  }

  const handlePaymentMethodSelect = (selectedValue, index,key) => {
    const updatedList = userExpenseList.map((item, i) =>
      i === index ? {
          ...item,
          [key]: selectedValue
        } : item
    );
    dispatch(updateUserExpenseList(updatedList))
  };

  // const getMostFrequentPaymentMethod = (expenses) => {
  //   const frequency = {};

  //   expenses.forEach(item => {
  //       if (item.paymentMethodId) {
  //           frequency[item.paymentMethodId] = (frequency[item.paymentMethodId] || 0) + 1;
  //       }
  //   });

  //   let maxCount = 0;
  //   let mostFrequentMethodId = null;

  //   for (const methodId in frequency) {
  //       if (frequency[methodId] > maxCount) {
  //           maxCount = frequency[methodId];
  //           mostFrequentMethodId = methodId;
  //       }
  //   }

  //   return mostFrequentMethodId;
  // };

  // const mostFrequentPaymentMethod = getMostFrequentPaymentMethod(userExpenseList);
  
  const calculateTotalExpenseAmt = () => {
    const data = userExpenseList.reduce((total, item) => total + (Number(item?.expenseAmt) || 0), 0)
    .toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
      return data.toString().replace(/,/g, '')
    };

  konsole.log("otherRef_current", otherRef.current, userExpenseList, errMsg)

  const validateOtherRow = () => {
    const allKeys = Object.keys(otherRef.current ?? {});
    let reservedLabel = expenseTypesList?.map(ele => ele?.label);
    let oldErrorMsg = errMsg;
    let isAnyError = false;

    for(let i = 0; i < allKeys?.length; i++ ) {
      const otherRefIndex = allKeys[i];
      if(otherRefIndex == 15 || isNullUndefine(otherRef.current[otherRefIndex])) continue;
      
      let eleError = "";
      const rawOtherLabel = otherRef.current[otherRefIndex]?.state?.othersName ?? "";
      const trimmedLabel = rawOtherLabel.trim();
      const hasLeadingSpace = rawOtherLabel.startsWith(" ");
      const expenseAmt = userExpenseList?.[otherRefIndex]?.expenseAmt;
      if(expenseAmt?.length && expenseAmt != "0.00" && !trimmedLabel?.length) eleError = "Please enter the expenses type.";
      else if (hasLeadingSpace) { eleError = "Expense type should not start with a space."; }
      else if(reservedLabel?.includes(trimmedLabel)) eleError = "Expense Type already exists.";
      else if(isNotValidNullUndefile(userExpenseList?.[otherRefIndex]) && !trimmedLabel?.length) eleError = "Expense type field should not be empty.";
      else reservedLabel?.push(trimmedLabel);
      if(isNotValidNullUndefile(eleError)){
        setWarning("warning", eleError);
      }     
      oldErrorMsg = {
        ...oldErrorMsg,
        [otherRefIndex]: { expenseName: eleError },
      }

      if(eleError?.length) {
        // alert(eleError)
        if(isAnyError == false) focusInputBox(otherRefIndex + "other", true);
        isAnyError = true;
      }
    }

    setErrMsg(oldErrorMsg);
    return isAnyError === false;
  }

  const otherOnChange = (index, myError) => {
    if(!myError?.length) return;
    setErrMsg(prevState => ({
      ...prevState,
      [index]: { expenseName: "" }
    }))
  }

  const addOtherObj = () => {
    const isValid = validateOtherRow();
    const lastIndex = userExpenseList?.length  - 1;
    
    if (otherRef?.current == null || lastIndex === 15 || isValid) {
      dispatch(updateUserExpenseList([...userExpenseList, {...$JsonHelper.monthlyExpensesJson(),otherName:'',keyId:new Date()}]))
    }
  }

  const deleteOther = async (item, index) => {
    // let userExpenseListfilter = userExpenseList.map((e)=> {return (e?.userExpenseId == item?.userExpenseId) ? {...e,isActive:false} : e})
    // konsole.log(userExpenseListfilter,"userExpenseListfilter")
    // dispatch(updateUserExpenseList(userExpenseListfilter))
    konsole.log("sdsafsa", item, index, userExpenseList);
    let confirmMessage = await newConfirm(true, `Are you sure you want to delete this expense ?`,"Confirmation","Delete Expenses");
    if(!confirmMessage) return;
    
    if(item?.userExpenseId != 0) {
    let upsertMonthlyExpenseData = {
      userId: primaryUserId,
      upsertedBy: loggedInUserId,
      upsertUserExpense: [{...item,isActive:false}]
    }
    useLoader(true)
    const res = await postApiCall('POST', $Service_Url.upsertMonthlyExpenses, upsertMonthlyExpenseData);
    useLoader(false)
    konsole.log(res,'resresresres')
    if(res != 'err'){
      getUserMonthlyExpenses(expenseTypesList)
    } else {
      return;
    }
    }

    let userExpenseListfilter = userExpenseList.filter((e, i)=> (i != index));
    dispatch(updateUserExpenseList(userExpenseListfilter));
    setWarning("deletedSuccessfully", `Your data has been deleted successfully`);
  }

  const sortedPaymentMethod = [...paymentMethod].sort((a, b) => {
    if (/^(other)$/i.test(a.label)) return -1;
    if (/^(other)$/i.test(b.label)) return 1;
    return 0;
  });

    return (
    
    <div id='nonMonthlyExpenses-monthlyExpenses'>
        <Row>
          <Col >
            <div className="heading-of-sub-side-links-3">{isSideContent}</div>
          </Col>
          <Col xl={9}>
          <div id="information-table" className="mt-4 information-table table-responsive">

            <div className='table-responsive fmlyTableScroll border-top-0'>
              <Table className="custom-table">
                <thead className="sticky-header">
                  <tr>
                    {tableHeader.map((item, index) => (
                      <th style={{ fontWeight: 'bold' }} key={index}>{item}</th>
                    ))}
                  </tr>
                </thead>

                {userExpenseList?.length > 0 ? (
                  <tbody className='table-body-tr monthlyexpenseTableBody'>
                    {userExpenseList.map((item, index, indexOfEle) => { 
                      return item.isActive == true && (
                        <tr key={item?.userExpenseId || item?.keyId}>
                            <td >{item?.value == '999999' && index !== 15 ? (<Other id={index+"other"} isError={errMsg[index]?.expenseName} tabIndex={startingTabIndex + indexOfEle} isMonthlylyExpenses = {true} noLabel={true} othersCategoryId={39} userId={primaryUserId} dropValue={item?.value} natureId={item?.userExpenseId} refrencePage='MonthlyExpenses' ref={(_ref) => {
                              (otherRef.current == null) ? otherRef.current = { [index]: _ref } : otherRef.current[index] = _ref;
                            }} isNewOther={true} onBlur={validateOtherRow} hanldeApiCall={() => otherOnChange(index, errMsg[index]?.expenseName)}  /> ) : ( <p>{item?.label}</p>)}</td>
                            <td>
                              <CustomCurrencyInput
                                tabIndex={startingTabIndex + indexOfEle}
                                name='expenseAmt'
                                isError=''
                                label='' 
                                id='expenseAmt'
                                value= {item?.expenseAmt}                                
                                onChange={(val) => handlePaymentMethodSelect(val, index,'expenseAmt')}
                                /></td>
                             <td className={userExpenseList?.length - 3 < index  ? 'legal-drop' : ''}>
                              <div className="d-flex justify-content-between gap-2">
                                <CustomSelect
                                  tabIndex={startingTabIndex + indexOfEle}
                                 isError=''
                                 label=''
                                 value={item?.paymentMethodId}
                                 id={item?.paymentMethodId}
                                 options={sortedPaymentMethod}
                                 placeholder='Select'
                                 onChange={(val) => handlePaymentMethodSelect(parseInt(val.value), index,'paymentMethodId')} />
                                 {item?.value == '999999' && index !== 15 && <img src='/New/icons/delete-Icon.svg' className='cursor-pointer align-self-center m-0' alt='Delete' title='Delete' onClick={()=> deleteOther(item, index)} />}
                                 </div>
                            </td> 
                        </tr>
                      );
                    })}
                    <tr><td colSpan="4" className="w-100"><div tabIndex={startingTabIndex + 4} className='text-center align-items-center cursor-pointer py-3' style={{border:'2px dashed #AEAEAE',borderRadius: '12px 8px 10px 10px',color: '#464646',cursor: 'pointer'}} onClick={()=>{addOtherObj()}}>
                    <span style={{fontSize: '20px'}}>+</span> Add New Expenses
                    </div></td></tr>
                    <tr>
                      <td><strong>Total</strong></td>
                      <td className='totalExpenseAmtNoDrop'>
                        <CustomCurrencyInput
                          tabIndex={startingTabIndex + 5}
                          name='totalExpenseAmt'
                          isError=''
                          label='' 
                          id='totalExpenseAmt'
                          value={calculateTotalExpenseAmt()}       
                          onChange={() => {}}                          
                          readOnly
                          disabled={true}
                        />
                      </td>
                      <td>
                      {/* <CustomSelectValue
                        id = 'custom-select-field-monthly-total'
                        value={mostFrequentPaymentMethod}
                        options={paymentMethod}
                        placeholder='Select'
                      /> */}
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={tableHeader.length}>
                        <div className="text-center no-data-found">No Data Found</div>
                      </td>
                    </tr>
                  </tbody>
                )
                }
              </Table>
            </div>
          </div>
          </Col>
          </Row>
    </div>
  )
});

export default MonthlyExpenses;
