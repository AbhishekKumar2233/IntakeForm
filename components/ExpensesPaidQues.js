import { memo, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { expensesPaidObj } from "./control/Constant";
import CurrencyInput from "react-currency-input-field";

function ExpensesPaidQuestion(props) {

  const [selectedOptions, setSelectedOptions] = useState({});
  useEffect(()=>{
    props?.getQuestionResponse(selectedOptions)
  },[selectedOptions])

  useEffect(()=>{
    if(props?.quesReponse==null){
      setSelectedOptions({})
    }else if(props?.quesReponse !=null && props?.quesReponse !==undefined && props?.quesReponse !=''){
            const obj = JSON?.parse(props?.quesReponse);
            // console.log("obj")
            setSelectedOptions(obj)
        }
  },[props?.quesReponse])

  const handleRadioChange = (questionIndex, value) => {
    // console.log("questionIndex",questionIndex,value)
    setSelectedOptions(prevState => {
      const newState = { ...prevState, [questionIndex]: value };
      if (questionIndex == "expensePaid" && value !== "2") {
        delete newState.bankname;
        delete newState.accountnumber;
      }
      if (value == "2") {
        delete newState.paymentMode;
      }
      return newState;
    });
  };

  const texAreaInputChange=(name,value)=>
  {
    // konsole.log("texAreaInputChange",value)
    if(name=="accountnumber"){
      if (/^[0-9]*$/.test(value)) {
        setSelectedOptions(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    }else{  
      setSelectedOptions(prevState => ({
        ...prevState,
        [name]: value
      })); 
    }  
  }

  // console.log("selectedOptions",selectedOptions?.accountnumber)
  return (
    <>
      <div className="mb-1 row">
        <div className="col-12" id="healthInsurance1">
          <div key={0}>
            <label>{expensesPaidObj?.[0]?.question}</label>
            <div className="d-flex justify-content-start align-items-end">
              {expensesPaidObj?.[0]?.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="me-4 pe-3 mb-0 d-flex align-items-center">
                  <Form.Check
                    className="chekspace d-flex align-items-center"
                    type="radio"
                    id={`checkbox-0-${optionIndex}`}
                    label={option?.name}
                    value={option?.value}
                    name="expensePaid"
                    onChange={() => handleRadioChange("expensePaid", option?.value)}
                    checked={selectedOptions?.expensePaid === option?.value}
                  />
                </div>
              ))}
            </div>
          </div>

          {selectedOptions && selectedOptions?.expensePaid === "1" && (
            <div className="mt-1" key={1}>
              <label>{expensesPaidObj?.[1]?.question}</label>
              <div className="d-flex justify-content-start align-items-end">
                {expensesPaidObj?.[1]?.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="me-4 pe-3 mb-0 d-flex align-items-center">
                    <Form.Check
                      className="chekspace d-flex align-items-center"
                      type="radio"
                      id={`checkbox-1-${optionIndex}`}
                      label={option?.name}
                      value={option?.value}
                      name="paymentMode"
                      onChange={() => handleRadioChange("paymentMode", option?.value)}
                      checked={selectedOptions?.paymentMode === option?.value}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedOptions && selectedOptions?.expensePaid === "2" && (
                <>
                <div className="mb-1 row">
                    <div className="col-3 d-flex align-items-center ">
                    <label>Enter the Bank Name</label>
                    </div>
                    <div className="col ">
                    <Form.Control 
                      type="text"
                      name="bankname"
                      onChange={(event) => {texAreaInputChange("bankname",event?.target?.value);}}
                      value={selectedOptions?.bankname || ""}
                      placeholder="Enter the Bank Name"
                      maxLength={50}
                    />    
                    </div>
                </div>
                <div className="mb-1 row">
                    <div className="col-3 d-flex align-items-center ">
                    <label>Enter the Account Number </label>
                    </div>
                    <div className="col ">
                      <Form.Control
                        value={selectedOptions?.accountnumber || ""}
                        onChange={(event) => texAreaInputChange("accountnumber",event?.target?.value)}
                        type="text"
                        name="accountnumber"
                        placeholder="Enter the Account Number"
                        maxLength={20}
                      />
                    </div>
                </div>
            </>
          )}
        </div>
        
      </div>
    </>
  );
}

export default memo(ExpensesPaidQuestion)
