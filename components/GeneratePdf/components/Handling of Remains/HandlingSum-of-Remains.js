import { useEffect, useState } from "react";
import { legal } from "../../../control/Constant";
import Api from "../../helper/api";
import konsole from "../../../control/Konsole";
import CemetryQuestionpdf from "../../../BurialCremation/CemetryQuestionpdf";
import BurialCremationquestionpdf from "../../../BurialCremation/BurialCremationquestionpdf";
import { $AHelper } from "../../../control/AHelper";

const HandlingSumofRemains = (props) => {

    const api = new Api();

    const userId = (props.primaryUserId !== null && props.primaryUserId !== '') ? props?.primaryUserId : '';
    const spouseUserId = (props.spouseUserId !== null && props.spouseUserId !== '') ? props?.spouseUserId : '';

    const categoryId = "0";

    const topicId = "5";

    const subjectId = "0";
    
    const burialPlotOrNicheQuesId = "64";

   const establishmentOrCemeteryQuesId = "63";

   const funeralOrMemorialServiceQuesId = "62";

   const CrematedQuesId = "61";

    const [burialPlotOrNiche, setBurialPlotOrNiche] = useState();

    const [establishmentOrCemetery, setEstablishmentOrCemetery] = useState();

    const [funeralOrMemorialService, setFuneralOrMemorialService] = useState();

    const [Cremated, setCremated] = useState();

    const [CrematedSpouse, setCrematedSpouse] = useState();

    const [whatWithAshe, setwhatWithAshes] = useState();

    const [whatWithAshesSpouse, setwhatWithAshesSpouse] = useState();
    
    const [funeralOrMemorialServiceSpouse, setFuneralOrMemorialServiceSpouse] = useState();

    const [establishmentOrCemeterySpouse, setEstablishmentOrCemeterySpouse] = useState();

    const [burialPlotOrNicheSpouse, setBurialPlotOrNicheSpouse] = useState();
    let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))


    useEffect(() => {
       if(userId !== ''){
            api.GetUserSubject(userId, categoryId, topicId, subjectId)
                .then((res) => {
                    const legalRes = res.data.data.userSubjects;
                    konsole.log("legalRes", legalRes);
                    for (let i = 0; i < legalRes.length; i++) {
                        if (legalRes[i].questionId == burialPlotOrNicheQuesId) {
                            setBurialPlotOrNiche(legalRes[i].response)
                        }
                        if (legalRes[i].questionId == establishmentOrCemeteryQuesId) {
                            setEstablishmentOrCemetery(legalRes[i].response)
                        }
                        if (legalRes[i].questionId == funeralOrMemorialServiceQuesId) {
                            setFuneralOrMemorialService(legalRes[i].response)
                        }
                        if (legalRes[i].questionId == CrematedQuesId) {
                            setCremated(legalRes[i].response)
                        }
                    }
                }).catch(error => konsole.log("apiError9", error));
            
            api.GetUserSubject(userId, 0, 0, 156)
            .then((res) => {
                const result = res?.data?.data?.userSubjects?.[0]?.response || "";
                setwhatWithAshes(result);
            }).catch(err => konsole.log("rsvj", err))
       }
    }, [userId])




    useEffect(() => {
        if (spouseUserId !== '') {
            api.GetUserSubject(spouseUserId, categoryId, topicId, subjectId)
                .then((res) => {
                    const legalSpouseRes = res.data.data.userSubjects;
                    konsole.log("legalSpouseRes", legalSpouseRes);
                    for (let i = 0; i < legalSpouseRes.length; i++) {
                        if (legalSpouseRes[i].questionId == CrematedQuesId) {
                            setCrematedSpouse(legalSpouseRes[i].response)
                        }
                        if (legalSpouseRes[i].questionId == funeralOrMemorialServiceQuesId) {
                            setFuneralOrMemorialServiceSpouse(legalSpouseRes[i].response)
                        }
                        if (legalSpouseRes[i].questionId == establishmentOrCemeteryQuesId) {
                            setEstablishmentOrCemeterySpouse(legalSpouseRes[i].response)
                        }
                        if (legalSpouseRes[i].questionId == burialPlotOrNicheQuesId) {
                            setBurialPlotOrNicheSpouse(legalSpouseRes[i].response)
                        }
                    }

                }).catch(error => konsole.log("apiError10", error));

            api.GetUserSubject(spouseUserId, 0, 0, 156)
            .then((res) => {
                const result = res?.data?.data?.userSubjects?.[0]?.response || "";
                setwhatWithAshesSpouse(result);
            }).catch(err => konsole.log("rnsv", err))
        }
    }, [spouseUserId])
    konsole.log(burialPlotOrNicheSpouse ,"data")
    return ( 
        <div className="containe">
            <br></br>
            {/* <h1 className='h4 fw-bold generate-pdf-main-color title  '> Handling of Remains </h1> */}
            <div className=" d-flex justify-content-start" style={{borderBottom:"2px solid #E8E8E8", margin:""}}>
        <h1 className="health_Info_h1 pb-3">Handling of Remains </h1>
        </div>
            {(props?.refrencePage !="SummaryDoc") &&<>
            <p className='para-p1'>Please identify your choices for the handling of your remains
            <small className='ms-1'>(Use additional paper if necessary):</small></p>
            </>}

            <div className="d-flex justify-content-between pt-3">
                <div className="col">
                <div className="pe-3"  style={ spouseUserId ? {borderRight:"2px solid  #E8E8E8", margin:"0px 10px"} : {}}>
                <div className="d-flex gap-2 pb-3 pt-3" style={{borderBottom:"2px solid #E8E8E8"}}> <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
                 <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</h5></div>
                 {(Cremated || funeralOrMemorialService) ? <>
                 <div className="sumPhysician pt-3">
                 <p>Do you wish to be cremated?</p>
                 <h5>{Cremated}</h5>

                </div>
                <div className="sumPhysician pt-3">
                 <p>What do you want to do with the ashes?</p>
                 <h5>{whatWithAshe}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Do you wish to have a funeral/memorial service?</p>
                 <h5>{funeralOrMemorialService}</h5>
                </div>
                </> : <p>(Not provided)</p>}
              </div>
              </div>
              {spouseUserId && <div className="col pe-3">
                <div className="d-flex gap-2 pb-3 pt-3" style={{borderBottom:"2px solid #E8E8E8"}}> <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
                 <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</h5></div>
                 {(CrematedSpouse || funeralOrMemorialServiceSpouse) ? <>
                 <div className="sumPhysician pt-3">
                 <p>Do you wish to be cremated?</p>
                 <h5>{CrematedSpouse}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>What do you want to do with the ashes?</p>
                 <h5>{whatWithAshesSpouse}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Do you wish to have a funeral/memorial service?</p>
                 <h5>{funeralOrMemorialServiceSpouse}</h5>
                </div>
                </> : <p>(Not provided)</p>}
              </div>}

              </div>

              <ul className="pt-4 ps-3"><li className="head-2">Burial/Cremation Plan</li></ul>   

              <div className=" justify-content-between">
              <div className="col" >
                <div className="pe-3" style={ spouseUserId ? {borderRight:" ", margin:" "} : {}}>
              <div className="d-flex gap-2 pb-3 pt-1" style={{borderBottom:"2px solid #E8E8E8"}}> <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
              <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</h5></div>
              {burialPlotOrNiche ? <>
              <div className="sumPhysician pt-3" >
              <p>Do you have a burial plot or niche? {(props?.refrencePage !="SummaryDoc") &&<>    <small className='ms-1 text-danger generate-pdf-main-color'>If so, please provide the following information:</small></>}</p>
              <h5>{ burialPlotOrNiche}</h5>
              </div>
              <BurialCremationquestionpdf memberUserId={userId} />
              </> : <p>(Not provided)</p>}
              </div>

              </div>

              {spouseUserId && <div className="col pe-3">
              <div className="d-flex gap-2 pb-3 pt-3" style={{borderBottom:"2px solid #E8E8E8", margin:" "}}> <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
              <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</h5></div>
              {burialPlotOrNicheSpouse ? <>
              <div className="sumPhysician pt-3" >
              <p>Do you have a burial plot or niche?  {(props?.refrencePage !="SummaryDoc") &&<>    
              <small className='ms-1 text-danger generate-pdf-main-color'>If so, please provide the following information:</small></>}</p>
              <h5>{burialPlotOrNicheSpouse}</h5>
              </div>
              {spouseUserId != '' && <BurialCremationquestionpdf memberUserId={spouseUserId} />}
              </> : <p>(Not provided)</p>}

              </div>}

              </div>

                
              <ul className="pt-4 ps-3"><li className="head-2">Cemetery</li></ul>   

              <div className="d-flex justify-content-between">
                <div className="col">
                <div className="pe-3" style={ spouseUserId ? {borderRight:"2px solid  #E8E8E8", margin:"0px 10px"} : {}} >
                <div className="d-flex gap-2 pb-3 pt-3" style={{borderBottom:"2px solid #E8E8E8"}}> <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
                 <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</h5></div>
                 {establishmentOrCemetery ? <>
                 <div className="sumPhysician pt-3" >
                 <p>Have you made arrangements for handling of  remains with any funeral establishment or cemetery?</p>
                 <h5>{ establishmentOrCemetery}</h5>

                </div>
                <CemetryQuestionpdf memberUserId={userId} />
                </> : <p>(Not provided)</p>}
                </div>
              </div>

              {spouseUserId && <div className="col pe-3" >
                <div className="d-flex gap-2 pb-3 pt-3" style={{borderBottom:"2px solid #E8E8E8", margin:""}}> <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
                 <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</h5></div>
                 {establishmentOrCemeterySpouse ? <>
                 <div className="sumPhysician pt-3" >
                 <p>Have you made arrangements for handling of  remains with any funeral establishment or cemetery?</p>
                 <h5>{establishmentOrCemeterySpouse}</h5>
                </div>
                {spouseUserId != '' && <CemetryQuestionpdf memberUserId={spouseUserId} />}
                </> : <p>(Not provided)</p>}
              
              </div>}

              </div>


             
            {/* <div className="d-flex justify-content-between pt-4 pb-5">
              <div className="sumPhysician" style={{width:"109px"}}>
                <p>Main Phone</p>
                <h5>{}</h5>
              </div>
             
              <div className="sumPhysician" style={{width:"110px"}}>
                <p>Email</p>
                <h5>{}</h5>
              </div>
           
              <div style={{width:"170px"}}>
              </div>
            </div> */}
                {/* <table className='container-fluid '>
                <tr>
                    
                    <th className="col-3">Name of Company:</th>
                    <th colSpan='6' className="col-8"><input type='text' className='border-bottom border-dark w-100'/></th>
                    <th className="col-1"></th>
                </tr>
                <tr>
                    
                    <th className="col-3">Address:</th>
                    <th colSpan='3' className="col-8"><input type='text' className='border-bottom border-dark w-100'/></th>
                    <th className="col-1"></th>
                </tr>
                <tr>
                   
                    <th className="col-2"></th>
                    <th colSpan='3' className="col-8"><input type='text' className='border-bottom border-dark w-100'/></th>
                    <th className="col-1"></th>
                </tr>
                <tr>
                    
                    <th className="col-2">City:</th>
                    <th className="col-2"><input type='text' className='border-bottom border-dark  '/></th>
                    <th className="col-1">State:</th>
                    <th className="col-4"><input type='text' className='border-bottom border-dark  '/> </th>
                    <th className="col-1"></th>
                </tr>

              <tr>
                     
                    <th className="col-2">Zip Code:</th>
                    <th className="col-2"><input type='text' className='border-bottom border-dark  '/></th>
                    <th className="col-1">Email: </th>
                    <th className="col-4"> <input type='text' className='border-bottom border-dark  '/> </th>
                    <th className="col-1"></th>
                </tr>   
         
                <tr>
                     
                    <th className="col-2">Main Phone:</th>
                    <th className="col-4"><input type='text' className='border-bottom border-dark  '/></th>
                    <th colSpan='1' className="col-1">Plot Number:</th>
                    <th className="col-1"><input type='text' className='border-bottom border-dark p-num-w'/></th>
                </tr>
                </table> */}

                {/* <div className="d-flex justify-content-between">
                <div>
                 <div className="sumPhysician pt-3 ps-3" >
                 <p>These arrangements are to be followed without deviation.</p>
                 <h5>{ }</h5>
                </div>
                <div className="sumPhysician pt-3 ps-3" >
                 <p>These arrangements may be supplemented by my representative.</p>
                 <h5>{ }</h5>
                </div>
                
               
              </div>

              {spouseUserId && <div style={{borderLeft:"2px solid #E8E8E8", paddingLeft:"2px"}} >
              <div className="sumPhysician pt-3 ps-3" >
                 <p>These arrangements are to be followed without deviation.</p>
                 <h5>{ }</h5>
                </div>
                <div className="sumPhysician pt-3 ps-3" >
                 <p>These arrangements may be supplemented by my representative.</p>
                 <h5>{ }</h5>
                </div>
                
              
              </div>}

              </div> */}


            {/* <div className="pt-4 pb-4">
            <div className="sumPhysician" style={{width:"40%"}}>
                <p>What instructions do you wish to leave for your funeral and/or memorial service?</p>
                <h5>{}</h5>
              </div>
            </div> */}
        </div>
     );
}
 
export default HandlingSumofRemains;