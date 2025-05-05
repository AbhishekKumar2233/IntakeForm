// import FiduciaryAssignmentForm from './Fiduciary Assignment Form/FiduciaryAssignmentForm';
import FiduciarySumAssignmentForm from "./Fiduciary Assignment Form/FiduciarySumAssignmentForm";
// const title='Fiduciary Assignment'
const FiduciarySumAssignment = ({ primaryUserId, spouseUserId ,refrencePage }) => {

    let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))

    const userId = (primaryUserId !== undefined && primaryUserId !== '') ? primaryUserId : '';
    const spouseUsrId = (spouseUserId !== undefined && spouseUserId !== '') ? spouseUserId : '';

    return (
        <div className="container-fluid">
            {/* <h1 className='h4 fw-bold generate-pdf-main-color title '>{title}</h1> */}
            <div className=" d-flex justify-content-start" style={{borderBottom:"2px solid #E8E8E8", margin:"0px 10px"}}>
        <h1 className="health_Info_h1 pb-3">Fiduciary Assignment</h1>
        </div>


            
            {/* <p className='Heading mt-3 mb-1 text-danger generate-pdf-main-color'>Personal Representative/Trustee</p> */}
            <ul className="pt-3 ps-3"><li className="head-2">Personal Representative/Trustee</li></ul> 
             {(refrencePage !="SummaryDoc") &&<>a
            <p className=' para-p1'>Please identify your choices of trusted individuals who will be your Personal Representatives/Trustee:<br/>
            <span className='  para-p1'>Your personal representative will be identified in your legal documents & may be: executor of your Will, administrator of your estate, and/or trustee of any Trusts created within your Last Will and Testament.</span>
            </p>
            </> }


            <div className='row'>
                <FiduciarySumAssignmentForm clientName={userDetailOfPrimary.memberName} primaryUserId={userId} spouseUserId="" fiduAsgnmntTypeId="1"/>
                <FiduciarySumAssignmentForm clientName={userDetailOfPrimary.spouseName} primaryUserId="" spouseUserId={spouseUsrId} fiduAsgnmntTypeId="1"/>
            </div>
            <div> 
                {/* <p className='Heading mt-5 mb-1 text-danger generate-pdf-main-color'>Durable Power of Attorney for Finances</p> */}
                <ul className="pt-3 ps-3"><li className="head-2">Durable Power of Attorney for Finances</li></ul> 
                {(refrencePage !="SummaryDoc") &&<>
            <p className='para-p1'>Please identify your choices of trusted individuals who will be your Agent Under Durable Power of Attorney for Finances:<br/>
            <span className='para-p1'>Your Durable Power of Attorney for Finances gives your choice of individual (agent) legal authority to manage your finances on your behalf.</span>
            </p></>}
           
            </div>
            <div className='row'>
                <FiduciarySumAssignmentForm clientName={userDetailOfPrimary.memberName} primaryUserId={primaryUserId} spouseUserId="" fiduAsgnmntTypeId="2"/>
                <FiduciarySumAssignmentForm clientName={userDetailOfPrimary.spouseName} primaryUserId="" spouseUserId={spouseUserId} fiduAsgnmntTypeId="2"/>
            
            </div>
<div className='container-fluid'> 
<div className='durable'>

                    {/* <p className='Heading mt-5 mb-1 text-danger generate-pdf-main-color'>Durable Power of Attorney for Healthcare</p>  */}
                    <ul className="pt-3 ps-3"><li className="head-2">Durable Power of Attorney for Healthcare</li></ul> 
                    {(refrencePage !="SummaryDoc") &&<>
            <p className='para-p1'>Please identify your choices for Agent Under Durable Power of Attorney for Healthcare:<br/>
            <span className='para-p1'>Your Durable Power of Attorney for Healthcare gives your choice of individual (agent) legal authority to make necessary decisions on your behalf concerning healthcare.</span>
            </p></>}
           
            <div className=' d-flex'>
                <FiduciarySumAssignmentForm clientName={userDetailOfPrimary.memberName} primaryUserId={primaryUserId} spouseUserId="" fiduAsgnmntTypeId="3"/>
                <FiduciarySumAssignmentForm clientName={userDetailOfPrimary.spouseName} primaryUserId="" spouseUserId={spouseUserId} fiduAsgnmntTypeId="3"/>


              </div>   

           </div>
           </div>
            


        </div>
    );
}
 
export default FiduciarySumAssignment;