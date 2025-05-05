import { useEffect, useState } from "react";
import { $AHelper } from "../../../../control/AHelper";
import konsole from "../../../../control/Konsole";
import MonthlySumExpenses from "./currentExpenses/MonthlySumExpenses";
import NonMonthlySumExpenses from "./currentExpenses/NonMonthlySumExpenses";
import { uscurencyFormate } from "../../../../control/Constant";
import OtherInfo from "../../../../asssets/OtherInfo";
import { isNotValidNullUndefile } from "../../../../Reusable/ReusableCom";

const LiabilitiesSum = (props) => {
  let api = props.api;
  const [userLiability, setUserLiability] = useState();
  const[totalPaymentAmount,setTotalPaymentAmount]=useState(0)
  const[totalOutstandingBalance,setTotalOutstandingBalance]=useState(0)
  const memberId = (props.memberId !== undefined && props.memberId !== '') ? props.memberId : '';
  useEffect(() => {
    if(memberId !== ''){
      api.GetUserLiability(memberId, 0).then((res) => {
        const liabilitiesData=res.data.data.liability;
        const totalPaymentAmount=getTotalBalance(liabilitiesData,"paymentAmount")
        const totalOutstandingBalance=getTotalBalance(liabilitiesData,"outstandingBalance")
        setTotalPaymentAmount(totalPaymentAmount)
        setTotalOutstandingBalance(totalOutstandingBalance)
        setUserLiability(liabilitiesData);
      })
      .catch(error => {
        konsole.log("error",error);
      });
    }
  },[memberId]);


  function getTotalBalance(response,key)
  {
    const sum = response.reduce((accumulator, currentValue) => 
      accumulator + (parseFloat(currentValue[key]) || 0), 0);
    return sum;
  }
  

  return (
    <div className="financialInformationTable">
      {/* <p className="Heading mt-5 mb-1 generate-pdf-main-color">Liabilities:</p> */}
      <ul className="pt-4 ps-3"><li className="head-2">Liabilities</li></ul> 
      <p className="p3 generate-pdf-main-color">
        Mortgages, Notes to Banks, Notes to Others, Loans on Insurance, Other:
      </p>
      <table className="text-center">
        <tr>
          <th className="col-3 thd">Description</th>
          <th className="col-3 thd">Name of Lender</th>
          <th className="col-2 thd">Payoff Date</th>
          <th className="col-2 thd">Outstanding Balance</th>
          <th className="col-2 thd">Monthly Payment Amount</th>
        </tr>
        <tbody>
          {userLiability && userLiability.map((liability, index) => {
            // console.log("userLiabilityuserLiabilitsasassay",userLiability)
            return (
              <tr key={index}>
                <td className="tdd"> <OtherInfo othersCategoryId={15}  userId={memberId} othersMapNatureId={liability?.userLiabilityId}  FieldName={liability?.liabilityType}/>  </td> 
                <td className="tdd"> {$AHelper.capitalizeAllLetters(liability.nameofInstitutionOrLender) || "-"} </td>
                <td className="tdd">{liability.payOffDate !== null ? $AHelper.getFormattedDate(liability.payOffDate) : "-"}</td>
                <td className="tdd">{isNotValidNullUndefile(liability.outstandingBalance) ? $AHelper.IncludeDollars(liability.outstandingBalance): "-"}</td>
                <td className="tdd">{isNotValidNullUndefile(liability.paymentAmount) ? $AHelper.IncludeDollars(liability.paymentAmount) : "-"}</td>
              </tr>
            );
          })}
        </tbody>
        <tr>
          <td className="border-0" colSpan="2"></td>
          <td className="text-center fw-bold p-1 tdd">TOTAL</td>
          <td className="fw-bold tdd">
            $ {uscurencyFormate(totalOutstandingBalance)}
          </td>
          <td className="fw-bold tdd">
            $ {uscurencyFormate(totalPaymentAmount)}
          </td>
        </tr>
      </table>
      <p className="p3 mt-5 generate-pdf-main-color">
        <u>Current Expenses:</u>
        <ul className="pt-3 ps-3"><li style={{fontSize:"13px"}}>Monthly Expenses</li></ul> 
      </p>
      {(props?.refrencePage !=="SummaryDoc") && 
      <p>
        Please summarize your current <u className="fw-bold">monthly</u>{" "}
        expenses, including expenses you may incur only once a year, or
        occasionally (e.g., property taxes, prescription drug costs, etc.). Feel
        free to use additional paper as necessary.
      </p>}
      <div className="contain">
      
        <div className="row">
          <div>
          <MonthlySumExpenses memberId={memberId} refrencePage={props?.refrencePage}></MonthlySumExpenses>
          </div>
          
          <div className="col-6">
          <ul className="pt-3 ps-3"><li className="generate-pdf-main-color" style={{fontSize:"13px",fontWeight:"600",}}>Non-Monthly Expenses</li></ul> 
            <NonMonthlySumExpenses memberId={memberId}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiabilitiesSum;
