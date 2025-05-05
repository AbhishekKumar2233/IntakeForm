import {LegalDoc} from './LegalDoc'
import { useEffect, useState } from "react";
import Api from "../../helper/api";
import konsole from '../../../control/Konsole';
import CommProfSum from '../Housing-Information-Component/commProfSum';
import FiduciarySum from './Legal-Sum-Fiduciary'

const LegalSumInformation = ({primaryUserId,refrencePage}) => {

    // const title = 'Legal Information';

    const api = new Api();

    const userId = (primaryUserId !== undefined && primaryUserId !== null && primaryUserId !== '')?primaryUserId: ''

    const categoryId = "0";

    const topicId = "5";

    const subjectId = "0";

    const legalGuardianQuestionId = "45";

    const PowerOfAttorneyQuestionId = "46";

    const AdministartorOfAnEstateQuestionId = "47";

    const InvolvedInLawsuitQuestionId = "48";

    const separatePropertyStateQuestionId = "49";

    const inheritYourAssestsQuestionId = "50";

    const specialNeedBeneficaryQuestionId = "51";


    const [guardianData, setGuardianData] = useState();

    const [agentPowerOfAttorney, setAgentPowerOfAttorney] = useState();

    const [adminstratorOfEstate, setAdminstratorOfEstate] = useState();

    const [involvedInLawsuit, setInvolvedInLawsuit] = useState();

    const [separatePropertyEstate, setSeparatePropertyEstate] = useState();

    const [inheritYourAsset, setInheritYourAsset] = useState();

    const [specialNeedBeneficary, setSpecialNeedBeneficary] = useState();
    
    const spouseUserId = sessionStorage.getItem('spouseUserId');
    let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))
    


    useEffect(() => {
        konsole.log("getSubject at legal", userId)
        api.GetUserSubject(userId, categoryId, topicId, subjectId)
            .then((res) => {
                const legalRes = res.data.data.userSubjects;
                konsole.log("legalRes",legalRes);
                for(let i= 0;i<legalRes.length;i++){
                    if(legalRes[i].questionId == legalGuardianQuestionId){
                        setGuardianData(legalRes[i].response)
                    }
                    if(legalRes[i].questionId == PowerOfAttorneyQuestionId){
                        setAgentPowerOfAttorney(legalRes[i].response)
                    }
                    if(legalRes[i].questionId == AdministartorOfAnEstateQuestionId){
                        setAdminstratorOfEstate(legalRes[i].response)
                    }
                    if(legalRes[i].questionId == InvolvedInLawsuitQuestionId){
                        setInvolvedInLawsuit(legalRes[i].response)
                    }
                    if(legalRes[i].questionId == separatePropertyStateQuestionId){
                        setSeparatePropertyEstate(legalRes[i].response)
                    }
                    if(legalRes[i].questionId == inheritYourAssestsQuestionId){
                        setInheritYourAsset(legalRes[i].response)
                    }
                    if(legalRes[i].questionId == specialNeedBeneficaryQuestionId){
                        setSpecialNeedBeneficary(legalRes[i].response)
                    }
                  
                }

            }).catch(error => konsole.log("apiError4", error));
    }, [userId])

    return (
        <div className='container-fluid '>
            {/* <h1 className='title h4 fw-bold generate-pdf-main-color '>{title}</h1> */}
            <div className=" d-flex justify-content-start" style={{borderBottom:"2px solid #E8E8E8", margin:""}}>
        <h1 className="health_Info_h1 pb-3">Legal Information</h1>
        </div>

            {(refrencePage !="SummaryDoc") && <>
            <p className=' para-p1'>Please provide us with copies of any applicable existing Legal Estate Planning and Trust documents at your meeting.</p>
            <p className=' para-p1'>When were the following legal documents created?</p>
            </>}

       
             {/* Elder Law Attorney */}
            <ul className="pt-3 ps-3"><li className="head-2">{"Elder Law Attorney"}</li></ul> 
            <CommProfSum api={api} memberId={primaryUserId} refrencePage={refrencePage} profName={"Elder Law Attorney"} proTypeId={'13'} userDetailOfPrimary={userDetailOfPrimary.memberName}  />  
            <CommProfSum api={api} memberId={spouseUserId} refrencePage={refrencePage} profName={"Elder Law Attorney"} proTypeId={'13'}  userDetailOfPrimary={userDetailOfPrimary.spouseName}/>
            
            {/* Family Law  */}
            <ul className="pt-3 ps-3"><li className="head-2">{"Family Law "}</li></ul> 
            <CommProfSum api={api} memberId={primaryUserId} refrencePage={refrencePage} profName={"Family Law "} proTypeId={'45'} userDetailOfPrimary={userDetailOfPrimary.memberName} />  
            <CommProfSum api={api} memberId={spouseUserId} refrencePage={refrencePage} profName={"Family Law "} proTypeId={'45'}  userDetailOfPrimary={userDetailOfPrimary.spouseName}/> 

             {/* Tax & Business Succession */}
            <ul className="pt-3 ps-3"><li className="head-2">{"Tax & Business Succession"}</li></ul>
            <CommProfSum api={api} memberId={primaryUserId} refrencePage={refrencePage} profName={"Tax & Business Succession"} proTypeId={'46'} userDetailOfPrimary={userDetailOfPrimary.memberName}   />  
            <CommProfSum api={api} memberId={spouseUserId} refrencePage={refrencePage} profName={"Tax & Business Succession"} proTypeId={'46'} userDetailOfPrimary={userDetailOfPrimary.spouseName} />  
            
            <div className="mt-5 d-flex justify-content-start pb-1" style={{borderBottom:"2px solid #E8E8E8", margin:""}}>
                <h1 className="health_Info_h1 pb-3">Feduciary /Beneficiary</h1>
            </div>
             <FiduciarySum />
            <div className="mt-5 d-flex justify-content-start pb-1" style={{borderBottom:"2px solid #E8E8E8", margin:""}}>
                <h1 className="health_Info_h1 pb-3">Legal Documents</h1>
            </div>
            <LegalDoc memberId={userId}></LegalDoc>
            
        </div>
    );
}

export default LegalSumInformation;


















// import {LegalDoc} from './LegalDoc'
// const title='Legal Information';
// const LegalInformation = () => {
//     return ( 
//         <div className='container-fluid '>
//             <h2 className='title text-danger'>{title}</h2>
//             <p className='p1 text-danger'>Please provide us with copies of any applicable existing Legal Estate Planning and Trust documents at your meeting.</p>
//             <p className='p1 text-danger'>When were the following legal documents created?</p>

//             <LegalDoc></LegalDoc>

//             <div className="container">
//                 <div className="row">
//                     <div className="col-5"><p className='fw-bold mt-4'>What is the location of your important papers?</p></div>
//                     <div className="col-7"><input type='text' className='border-bottom border-dark ms-1 w-50'/></div>
//                 </div>
//                 <div className="row">
//                     <div className="col-5"><p className='fw-bold mt-4'>What is the location of your important papers?</p></div>
//                     <div className="col-7"><input type='text' className='border-bottom border-dark ms-1 w-50'/></div>
//                 </div>
//                 <div className="row">
//                      <div className="col-5"><p className='fw-bold mt-4'>I am the legally appointed guardian of:</p></div>
//                      <div className="col-7"><input type='text' className='border-bottom border-dark ms-1 w-50'/></div>
//                 </div>

//                 <div className="row">
//                     <div className="col-8"><p className='fw-bold mt-4'>I have been appointed agent under a Power of Attorney:</p></div>
//                     <div className="col-2"><input type='checkbox' className='li-chkbx-y1'/><span className='ms-1'>Yes</span></div>
//                     <div className="col-2">NO</div>
//                 </div>
//                 <div className="row"></div>
//             </div>
//             <span>I have been appointed agent under a Power of Attorney:
//             <input type='checkbox' className='li-chkbx-y1'/><span className='ms-1'>Yes</span>
//             <input type='checkbox' className='ms-4'/><span className='ms-1'>No</span></span><br/>
//             <span>I am serving as executor or administrator of an estate:
//             <input type='checkbox' className='li-chkbx-y2'/><span className='ms-1'>Yes</span>
//             <input type='checkbox' className='ms-4'/><span className='ms-1'>No</span></span><br/>
//             <span>I am involved in a lawsuit:
//             <input type='checkbox' className='li-chkbx-y3'/><span className='ms-1'>Yes</span>
//             <input type='checkbox' className='ms-4'/><span className='ms-1'>No</span></span><br/>
//             <span>I have lived in a separate property state:
//             <input type='checkbox' className='li-chkbx-y4'/><span className='ms-1'>Yes</span>
//             <input type='checkbox' className='ms-4'/><span className='ms-1'>No</span></span><br/>
//             <small className='text-mdnry'>(any state except: Arizona, California, Idaho, Louisiana, Nevada, New Mexico, Texas, Washington, Wisconsin)</small><br/><br/>
//             <span className=''>Who do you want to inherit your assets?
//             <input type='text' className='border-bottom border-dark ms-5 w-50'/></span><br/>
//             <span className=''>Do you have any special needs beneficiaries?
//             <input type='text' className='border-bottom border-dark ms-3 w-50'/></span><br/>



//         </div>
//      );
// }
 
// export default LegalInformation;