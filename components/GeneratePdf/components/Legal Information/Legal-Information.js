import {LegalDoc} from './LegalDoc'
import { useEffect, useState } from "react";
import Api from "../../helper/api";
import konsole from '../../../control/Konsole';
import CommProff from '../Housing-Information-Component/CommonProff';
import FiduciarySum from './Legal-Sum-Fiduciary'

const LegalInformation = ({primaryUserId,refrencePage}) => {

    const title = 'Legal Information';

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
            <h1 className='title h4 fw-bold generate-pdf-main-color '>{title}</h1>
            {(refrencePage !="SummaryDoc") && <>
            <p className=' para-p1'>Please provide us with copies of any applicable existing Legal Estate Planning and Trust documents at your meeting.</p>
            <p className=' para-p1'>When were the following legal documents created?</p>
            </>}

             {/* Elder Law Attorney */}
            <p className="Heading mt-3 mb-3 generate-pdf-main-color fs-5">{"Elder Law Attorney"}</p> 
            <CommProff api={api} memberId={primaryUserId} refrencePage={refrencePage} profName={"Elder Law Attorney"} proTypeId={'13'} userDetailOfPrimary={userDetailOfPrimary.memberName}/>
            <CommProff api={api} memberId={spouseUserId} refrencePage={refrencePage} profName={"Elder Law Attorney"} proTypeId={'13'}  userDetailOfPrimary={userDetailOfPrimary.spouseName}/>
            {/* Family Law  */}
            <p className="Heading mt-3 mb-3 generate-pdf-main-color fs-5">{"Family Law "}</p> 
            <CommProff api={api} memberId={primaryUserId} refrencePage={refrencePage} profName={"Family Law "} proTypeId={'45'} userDetailOfPrimary={userDetailOfPrimary.memberName} />  
            <CommProff api={api} memberId={spouseUserId} refrencePage={refrencePage} profName={"Family Law "} proTypeId={'45'}  userDetailOfPrimary={userDetailOfPrimary.spouseName}/>
             {/* Tax & Business Succession */}
            <p className="Heading mt-3 mb-3 generate-pdf-main-color fs-5">{"Tax & Business Succession"}</p>
            <CommProff api={api} memberId={primaryUserId} refrencePage={refrencePage} profName={"Tax & Business Succession"} proTypeId={'46'} userDetailOfPrimary={userDetailOfPrimary.memberName}/>
            <CommProff api={api} memberId={primaryUserId} refrencePage={refrencePage} profName={"Tax & Business Succession"} proTypeId={'46'} userDetailOfPrimary={userDetailOfPrimary.spouseName} /> 
             
            <p className="Heading mt-4  generate-pdf-main-color fs-5">{"Fiduciary / Beneficairy"}</p>
            <FiduciarySum />
            <p className="Heading mt-4  generate-pdf-main-color fs-5">{"Legal Documents"}</p>
            <LegalDoc memberId={userId}></LegalDoc>
            {/* <table className="container border-0">
                <tr>
                    <th className='col-4'></th>
                    <th className='col-2'><p className='p3 text-center text-danger'>Date Executed</p></th>
                    <th className='col-6'></th>
                </tr>
                <tr>
                    <th className=''>Last Will and Testament:</th>
                    <th className=''><input type="text" className="w-100 border-bottom border-dark border-1" /></th>
                </tr>
                <tr>
                    <th className=''>Community Property Agreement:</th>
                    <th className=''><input type="text" className="w-100 border-bottom border-dark border-1" /></th>
                </tr>
                <tr>
                    <th className=''>Pre/Post-Nuptial Agreement:</th>
                    <th className=''><input type="text" className="w-100 border-bottom border-dark border-1" /></th>
                </tr>
                <tr>
                    <th className=''>Durable Power of Attorney:</th>
                    <th className=''><input type="text" className="w-100 border-bottom border-dark border-1" /></th>
                </tr>
                <tr>
                    <th className=''>Living Will/Healthcare Proxy:</th>
                    <th className=''><input type="text" className="w-100 border-bottom border-dark border-1" /></th>
                </tr>
                <tr>
                    <th className=''>Revocable or Irrevocable Trust:</th>
                    <th className=''><input type="text" className="w-100 border-bottom border-dark border-1" /></th>
                </tr>
                <tr>
                    <th className=''>Deed for Residence (if trust exists or is desired):</th>
                    <th className=''><input type="text" className="w-100 border-bottom border-dark border-1" /></th>
                </tr>
                <tr>
                    <th className=''>Funeral or Burial Plan:</th>
                    <th className=''><input type="text" className="w-100 border-bottom border-dark border-1" /></th>
                </tr>
            </table> */}
            
            <p className='fw-bold mt-4'>What is the location of your important papers?
                <input type='text' className='border-bottom border-dark ms-1 w-50' /></p>
            <span className='mt-3'>I am the legally appointed guardian of:
                <input type='text' className='border-bottom border-dark ms-5 w-50' value={guardianData} /></span><br />
                <div className='row mt-2'>
                <div className='col-4'>I have been appointed agent under a Power of Attorney:</div>
                <div className='col-2'><input class="form-check-input" type="checkbox" value=""   checked={agentPowerOfAttorney =="Yes"}/>
                <label class="form-check-label">Yes</label></div>
                <div className='col-2'><input class="form-check-input" type="checkbox" value="" checked={agentPowerOfAttorney == "No"}/>
                <label class="form-check-label">No</label></div>
             <div className='col-5'></div>
            </div>
            {/* <span>I have been appointed agent under a Power of Attorney:
                <input type='checkbox'  checked={agentPowerOfAttorney =="Yes"}/><span className=''>Yes</span>
                <input type='checkbox'  checked={agentPowerOfAttorney == "No"}/><span className='ms-1'>No</span></span><br /> */}

                <div className='row mt-2'>
                    <div className='col-4'>I am serving as executor or administrator of an estate:</div>
                    <div className='col-2'><input class="form-check-input" type="checkbox" value=""  checked={adminstratorOfEstate == "Yes"}/>
                   <label class="form-check-label">Yes</label></div>
                    <div className='col-2'><input class="form-check-input" type="checkbox" value=""  checked={adminstratorOfEstate == "No"}/>
                   <label class="form-check-label" for="flexCheckDefault">No</label> </div>
                    <div className='col-5'></div>
                </div>
                <div className='row mt-2 paddTop'>
                    <div className=' col-4'> I am involved in a lawsuit:</div>
                    <div className=' col-2'><input class="form-check-input" type="checkbox" value="" checked={involvedInLawsuit == "Yes"}/>
                   <label class="form-check-label" >Yes</label></div>
                    <div className=' col-2'><input class="form-check-input" type="checkbox" value="" checked={involvedInLawsuit == "No"}/>
                  <label class="form-check-label" >No</label></div>
                    <div className=' col-5'></div>
                </div>
                <div className='row mt-2 paddTop'>
                    <div className=' col-4'>I have lived in a separate property state:</div>
                    <div className=' col-2'><input class="form-check-input" type="checkbox" value=""  checked={separatePropertyEstate == "Yes"}/>
                     <label class="form-check-label" for="flexCheckDefault">Yes</label></div>
                    <div className=' col-2'><input class="form-check-input" type="checkbox" value="" checked={separatePropertyEstate == "No"}/>
                      <label class="form-check-label">No</label></div>
                    <div className=' col-5'></div>
                </div>

            {/* <span>I am serving as executor or administrator of an estate:
                <input type='checkbox'  checked={adminstratorOfEstate == "Yes"}/><span className='ms-1'>Yes</span>
                <input type='checkbox'  checked={adminstratorOfEstate == "No"}/><span className='ms-1'>No</span></span><br /> */}
            {/* <span>I am involved in a lawsuit:
                <input type='checkbox'  checked={involvedInLawsuit == "Yes"} /><span className='ms-1'>Yes</span>
                <input type='checkbox'  checked={involvedInLawsuit == "No"}  /><span className='ms-1'>No</span></span><br /> */}
            {/* <span>I have lived in a separate property state:
                <input type='checkbox'  checked={separatePropertyEstate == "Yes"} /><span className='ms-1'>Yes</span>
                <input type='checkbox'  checked={separatePropertyEstate == "No"} /><span className='ms-1'>No</span></span><br /> */}
            <small className='text-mdnry'>(any state except: Arizona, California, Idaho, Louisiana, Nevada, New Mexico, Texas, Washington, Wisconsin)</small><br /><br />
            <span className=''>Who do you want to inherit your assets?
                <input type='text' className='border-bottom border-dark ms-5 w-50' value={inheritYourAsset}/></span><br />
            <span className=''>Do you have any special needs beneficiaries?
                <input type='text' className='border-bottom border-dark ms-3 w-50'  value={specialNeedBeneficary} /></span><br />



        </div>
    );
}

export default LegalInformation;


















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