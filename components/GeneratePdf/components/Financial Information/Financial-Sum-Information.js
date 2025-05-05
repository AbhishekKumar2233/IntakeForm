import FinancialSumAdvisor from "./Financial Advisor/Financial-Sum-Advisor";
import AccountantSum from "./Accountant/AccountantSum";
import AssetsSum from "./FinancialAssets/AssetsSum";
import LiabilitiesSum from "./Liabilities/LiabilitiesSum";
import MonthlySumIncome from "./Monthly-Income/MonthlySumIncome";
import TaxSumInformation from "./Tax-Information/Tax-Sum-Information";
import FutureExpectations from "./Future-Expectations/Future-Expectations";
import Api from "../../helper/api";
import konsole from "../../../control/Konsole";
import Transportationpdf from "../../../Transportationpdf";
import BookkeeperSum from "./Accountant/BookkeeperSum";
const FinancialSumInformation = (props) => {
  const api=new Api()
  const spouseUserId = props.memberId == sessionStorage.getItem('spouseUserId') ? sessionStorage.getItem("SessPrimaryUserId") : sessionStorage.getItem('spouseUserId');
  let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))

  return (
    <div className="content container-fluid">
     
       <div className=" d-flex justify-content-start pb-2" style={{borderBottom:"2px solid #E8E8E8"}}>
        <h1 className="health_Info_h1 pb-3">Financial Information</h1>
      </div>

      <div className="blackk">
      {/* {(props?.refrencePage !="SummaryDoc") && 
        <p className="p1 generate-pdf-main-color">
          Please remember to bring the following information with you to your
          appointment.
        </p>
      } */}

             {/* <div className="contain">
              <div className="d-flex pt-4">
                <div className="sumPhysician pb-3" style={{width:"50%"}}>
                  <p> Latest <mark>Tax Return</mark></p>
                  <h5>{""}</h5>
                  </div> 

                  <div className="sumPhysician pb-3" style={{width:"50%"}}>
                  <p><mark>Long-Term Care Policy</mark>(i.e., a complete copy of your policy, if you have one)</p>
                <h5>{""}</h5>
                  </div>
              </div>
            </div>

            <div className="contain">
              <div className="d-flex pt-4">
                <div className="sumPhysician pb-3" style={{width:"50%"}}>
                  <p> <mark>Deed(s)</mark> to real property</p>
                  <h5>{""}</h5>
                  </div> 

                  <div className="sumPhysician pb-3" style={{width:"50%"}}>
                  <p> <mark>Life Insurance Policy</mark>(i.e., a complete copy of your policy and latest statement with current values, if you have one)</p>
                <h5>{""}</h5>
                  </div>
              </div>
            </div>

            <div className="contain" style={{borderBottom:"2px solid #E8E8E8", margin:"0px 10px"}}>
              <div className="d-flex pt-4 pb-4">
                <div className="sumPhysician pb-3" style={{width:"50%"}}>
                  <p> {" "} Latest <mark>Financial Statement(s)</mark>: (e.g., Bank, Investment, Retirement accounts)</p>
                  <h5>{""}</h5>
                  </div> 
              </div>
            </div> */}

          {/* Financial Advisor */}
        <ul className="pt-3 ps-3"><li className="head-2">Financial Advisor</li></ul> 
        <FinancialSumAdvisor api={api} memberId={props.primaryUserId} userDetailOfPrimary={userDetailOfPrimary.memberName} />
        <FinancialSumAdvisor api={api} memberId={spouseUserId} userDetailOfPrimary={userDetailOfPrimary.spouseName}  />
         {/* Accountant */}
         <ul className="pt-3 ps-3"><li className="head-2">Accountant</li></ul> 
         <AccountantSum api={api} memberId={props.primaryUserId} refrencePage={props?.refrencePage} userDetailOfPrimary={userDetailOfPrimary.memberName} /> 
         <AccountantSum api={api} memberId={spouseUserId} refrencePage={props?.refrencePage} userDetailOfPrimary={userDetailOfPrimary.spouseName} /> 
          {/* Bookkeeper */}
         <ul className="pt-1 ps-3"><li className="head-2">Bookkeeper</li></ul> 
         <BookkeeperSum api={api} memberId={props.primaryUserId} refrencePage={props?.refrencePage} userDetailOfPrimary={userDetailOfPrimary.memberName} /> 
         <BookkeeperSum api={api} memberId={spouseUserId} refrencePage={props?.refrencePage} userDetailOfPrimary={userDetailOfPrimary.spouseName} /> 

         <AssetsSum api={api} memberId={props.primaryUserId} spouseId={props.spouseUserId} /> 
         <Transportationpdf api={api} memberId={props.primaryUserId} spouseId={props.spouseUserId} />
         <LiabilitiesSum api={api} memberId={props.primaryUserId} refrencePage={props?.refrencePage} />
         {/* <div className="pageBreakAfter"></div> */}
         <MonthlySumIncome memberId={props.primaryUserId} spouseId={props.spouseUserId}/> 
         <TaxSumInformation memberId={props.primaryUserId}/> 
        <FutureExpectations memberId={props.memberId} spouseId={props.spouseUserId}/>
      </div>
    </div>
  );
};

export default FinancialSumInformation;
