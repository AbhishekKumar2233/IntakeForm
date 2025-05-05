import FiduciaryAssignmentForm from './Fiduciary Assignment Form/FiduciaryAssignmentForm';
const title='Fiduciary Assignment'
const FiduciaryAssignment = ({ primaryUserId, spouseUserId ,refrencePage }) => {

    const userId = (primaryUserId !== undefined && primaryUserId !== '') ? primaryUserId : '';
    const spouseUsrId = (spouseUserId !== undefined && spouseUserId !== '') ? spouseUserId : '';

    return (
        <div className="container-fluid mt-5">
            <h1 className='h4 fw-bold generate-pdf-main-color title '>{title}</h1>


            
            <p className='Heading mt-5 mb-1 text-danger generate-pdf-main-color'>Personal Representative/Trustee</p>
             {(refrencePage !="SummaryDoc") &&<>
            <p className=' para-p1'>Please identify your choices of trusted individuals who will be your Personal Representatives/Trustee:<br/>
            <span className='  para-p1'>Your personal representative will be identified in your legal documents & may be: executor of your Will, administrator of your estate, and/or trustee of any Trusts created within your Last Will and Testament.</span>
            </p>
            </> }


            <div className='row'>
                <FiduciaryAssignmentForm clientName="Client-#1" primaryUserId={userId} spouseUserId="" fiduAsgnmntTypeId="1"/>
                <FiduciaryAssignmentForm clientName="Client-#2" primaryUserId="" spouseUserId={spouseUsrId} fiduAsgnmntTypeId="1"/>
            </div>
            <div> 
                <p className='Heading mt-5 mb-1 text-danger generate-pdf-main-color'>Durable Power of Attorney for Finances</p>
                {(refrencePage !="SummaryDoc") &&<>
            <p className='para-p1'>Please identify your choices of trusted individuals who will be your Agent Under Durable Power of Attorney for Finances:<br/>
            <span className='para-p1'>Your Durable Power of Attorney for Finances gives your choice of individual (agent) legal authority to manage your finances on your behalf.</span>
            </p></>}
           
            </div>
            <div className='row'>
                <FiduciaryAssignmentForm clientName="Client-#1" primaryUserId={primaryUserId} spouseUserId="" fiduAsgnmntTypeId="2"/>
                <FiduciaryAssignmentForm clientName="Client-#2" primaryUserId="" spouseUserId={spouseUserId} fiduAsgnmntTypeId="2"/>
            
            </div>
<div className='container-fluid'> 
<div className='durable'>

                    <p className='Heading mt-5 mb-1 text-danger generate-pdf-main-color'>Durable Power of Attorney for Healthcare</p> 
                    {(refrencePage !="SummaryDoc") &&<>
            <p className='para-p1'>Please identify your choices for Agent Under Durable Power of Attorney for Healthcare:<br/>
            <span className='para-p1'>Your Durable Power of Attorney for Healthcare gives your choice of individual (agent) legal authority to make necessary decisions on your behalf concerning healthcare.</span>
            </p></>}
           
            <div className=' d-flex'>
                <FiduciaryAssignmentForm clientName="Client-#1" primaryUserId={primaryUserId} spouseUserId="" fiduAsgnmntTypeId="3"/>
                <FiduciaryAssignmentForm clientName="Client-#2" primaryUserId="" spouseUserId={spouseUserId} fiduAsgnmntTypeId="3"/>


              </div>   

           </div>
           </div>
            


        </div>
    );
}
 
export default FiduciaryAssignment;