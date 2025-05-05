import FinancialAdvisor from "./Financial Advisor/Financial-Advisor";
import Accountant from "./Accountant/Accountant";
import Assets from "./FinancialAssets/Assets";
import Liabilities from "./Liabilities/Liabilities";
import MonthlyIncome from "./Monthly-Income/Monthly-Income";
import TaxInformation from "./Tax-Information/Tax-Information";
import FutureExpectations from "./Future-Expectations/Future-Expectations";
import Api from "../../helper/api";
import konsole from "../../../control/Konsole";
import Transportationpdf from "../../../Transportationpdf";
import FutureExpectationspdf from "../../../FutureExpectationspdf";
import Bookkeeper from "./Accountant/Bookkeeper";
const title = "Financial Information";
const FinancialInformation = (props) => {
  const api=new Api()

  const spouseUserId = props.memberId == sessionStorage.getItem('spouseUserId') ? sessionStorage.getItem("SessPrimaryUserId") : sessionStorage.getItem('spouseUserId');
  let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))
  
  return (
    <div className="content container-fluid  ">
      <h1 className="h4 fw-bold generate-pdf-main-color title ">{title}</h1>

      <div className="blackk">
      {(props?.refrencePage !="SummaryDoc") && 
        <p className="p1 generate-pdf-main-color">
          Please remember to bring the following information with you to your
          appointment.
        </p>
      }

        <div className="coltainer pb-2">
          <div className="row">
            <div className="col-1 w10">
              <input type="checkbox" value="" id="fi-tr" />
            </div>
            <div className="col-11">
              Latest <mark>Tax Return</mark>
            </div>
          </div>
          <div className="row">
            <div className="col-1 w10">
              <input type="checkbox" value="" id="fi-ltcp" />
            </div>
            <div className="col-11 ">
              <mark>Long-Term Care Policy</mark>(i.e., a complete copy of your
              policy, if you have one)
            </div>
          </div>
          <div className="row paddTop">
            <div className="col-1 w10">
              <input type="checkbox" value="" id="fi-lip" />
            </div>
            <div className="col-11 ">
              <mark>Life Insurance Policy</mark>(i.e., a complete copy of your
              policy and latest statement with current values, if you have one)
            </div>
          </div>
          <div className="row paddTop">
            <div className="col-1 w10">
              <input type="checkbox" value="" id="fi-fs" />
            </div>
            <div className="col-11">
              {" "}
              Latest <mark>Financial Statement(s)</mark>: (e.g., Bank,
              Investment, Retirement accounts)
            </div>
          </div>
          <div className="row ">
            <div className="col-1 w10">
              <input type="checkbox" value="" id="fi-d" /> 
            </div>
            <div className="col-11">
              <mark>Deed(s)</mark> to real property
            </div>
          </div>
        </div>

          {/* Financial Adviser */}
        <p className="Heading generate-pdf-main-color">Financial Advisor</p>
        <FinancialAdvisor api={api} memberId={props.primaryUserId} userDetailOfPrimary={userDetailOfPrimary.memberName} />
        <FinancialAdvisor api={api} memberId={spouseUserId} userDetailOfPrimary={userDetailOfPrimary.spouseName}  />
          
         {/* Accountant  */}
        <p className='Heading generate-pdf-main-color'>Accountant</p>
         <Accountant api={api} memberId={props.primaryUserId} refrencePage={props?.refrencePage} userDetailOfPrimary={userDetailOfPrimary.memberName} /> 
         <Accountant api={api} memberId={spouseUserId} refrencePage={props?.refrencePage} userDetailOfPrimary={userDetailOfPrimary.spouseName} /> 
          
          {/* BookKeeper */}
         <p className='Heading generate-pdf-main-color'>Bookkeeper</p>
         <Bookkeeper api={api} memberId={props.primaryUserId}  userDetailOfPrimary={userDetailOfPrimary.memberName}/>
         <Bookkeeper api={api} memberId={spouseUserId}  userDetailOfPrimary={userDetailOfPrimary.spouseName}/>

         <Assets api={api} memberId={props.primaryUserId} spouseId={props.spouseUserId} /> 
         <Transportationpdf api={api} memberId={props.primaryUserId} spouseId={props.spouseUserId} />
         <FutureExpectationspdf memberId={props.primaryUserId} spouseId={props.spouseUserId} />
         <Liabilities api={api} memberId={props.primaryUserId} refrencePage={props?.refrencePage} />
         {/* <div className="pageBreakAfter"></div> */}
         <MonthlyIncome memberId={props.primaryUserId} spouseId={props.spouseUserId}/> 
         <TaxInformation memberId={props.primaryUserId}/> 
      </div>
    </div>
  );
};

export default FinancialInformation;
