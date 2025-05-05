import { useEffect, useState } from "react";
import { legal } from "../../../control/Constant";
import Api from "../../helper/api";
import konsole from "../../../control/Konsole";
import CemetryGenQuestionPdf from "../../../BurialCremation/CemetryGenQuestionPdf";
import BurialCremationGenQuestionPdf from "../../../BurialCremation/BurialCremationGenQuestionPdf";
import { $AHelper } from "../../../control/AHelper";

const HandlingofRemains = (props) => {

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
    let userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))


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
        // konsole.log(burialPlotOrNicheSpouse ,"data")
    return ( 
        <div className="container-fluid ">
            <br></br>
            <h1 className='h4 fw-bold generate-pdf-main-color title  '> Handling of Remains </h1>
            {(props?.refrencePage !="SummaryDoc") &&<>
            <p className='para-p1'>Please identify your choices for the handling of your remains
            <small className='ms-1'>(Use additional paper if necessary):</small></p>
            </>}
            <table className="container-fluid ">
                <tr>
                    
                    <th className="col-5 "></th>
                    <th colSpan='2' className=" col-2 text-center pb-2">
                        <u className="clientheading">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</u>
                    </th>
                    <th colSpan='2' className=" col-2 text-center pb-2">
                        <u className="clientheading">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</u>
                    </th>
                    <th className="col-2"></th>
                </tr>
                <tr>
                    
                    <th className="col-7">Do you wish to be cremated?</th>
                    <th className="col-1 "><input type='checkbox' className="form-check-input" checked={Cremated == "Yes"}/><span className="psLeft">Yes</span></th>
                    <th className="col-1 "><input type='checkbox' className="form-check-input" checked={Cremated == "No"}/><span className="psLeft" >No</span></th>
                    <th className="col-1 "><input type='checkbox' className="form-check-input"checked={CrematedSpouse == "Yes"}/><span className="psLeft" >Yes</span></th>
                    <th className="col-1 "><input type='checkbox'  className="form-check-input" checked={CrematedSpouse == "No"}/><span className="psLeft" >No</span></th>
                    <th className="col-1"></th>
                </tr>
                <tr>
                    
                    <th className="col-7">What do you want to do with the ashes?</th>
                    <th colSpan='2' className="col-1 "><input type='text'className='border-bottom border-dark' value ={whatWithAshe}/></th> 
                    <th colSpan='2' className="col-1 "><input type='text' className='border-bottom border-dark' value ={whatWithAshesSpouse}/></th>
                </tr>
                {/* <tr>
                    <th colSpan='7' className='text-center'><input type='text' className='border-bottom border-dark w-75'/></th>
                </tr>
                <tr>
                    <th colSpan='7' className='text-center'><input type='text' className='border-bottom border-dark w-75'/></th>
                </tr>
                <tr>
                    <th colSpan='7' className='text-center'><input type='text' className='border-bottom border-dark w-75'/></th>
                </tr> */}
                <tr className="paddTop">
                    
                    <th className="col-5">Do you wish to have a funeral/memorial service?</th>
                    <th className="col-1 "><input type='checkbox' className="form-check-input" checked={funeralOrMemorialService == "Yes"}/><span className="psLeft">Yes</span></th>
                    <th className="col-1 "><input type='checkbox' className="form-check-input"  checked={funeralOrMemorialService == "No"}/><span className="psLeft" >No</span></th>
                    <th className="col-1 "><input type='checkbox' className="form-check-input" checked={funeralOrMemorialServiceSpouse == "Yes"}/><span className="psLeft" >Yes</span></th>
                    <th className="col-1 "><input type='checkbox' className="form-check-input" checked={funeralOrMemorialServiceSpouse == "No"}/><span className="psLeft" >No</span></th>
                    <th className="col-2"></th>
                </tr>
            </table><br/>
            
             <h1 className="h4 fw-bold generate-pdf-main-color title pt-2">Burial/Cremation Plan</h1>
                <div>
              <div className="col">
                <div className="pe-3">
              <div className="d-flex gap-2 pt-3">
              <h5 className="clientheading fs-6">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</h5></div>
              {burialPlotOrNiche ? <>
              <div className="d-flex">
                    <div className="col-4 pt-3">
                 <label>Do you have a burial plot or niche?</label>
                 </div>
                 <div className="col-7">
                 <input type="text" value={burialPlotOrNiche}></input>
                </div>
              </div>
              <BurialCremationGenQuestionPdf memberUserId={userId} />
              </> : <p>(Not provided)</p>}
              </div>

              </div>
              {spouseUserId && <div className="col pe-3">
              <div className="d-flex gap-2  pt-3"> 
              <h5 className="clientheading fs-6">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</h5></div>
              {burialPlotOrNicheSpouse ? <>
              <div className="d-flex">
                    <div className="col-4 pt-3">
                 <label>Do you have a burial plot or niche?</label>
                 </div>
                 <div className="col-7">
                 <input type="text" value={burialPlotOrNicheSpouse}></input>
                </div>
              </div>
              {spouseUserId != '' && <BurialCremationGenQuestionPdf memberUserId={spouseUserId} />}
              </> : <p>(Not provided)</p>}

              </div>}
              </div>
               <h1 className="h4 fw-bold generate-pdf-main-color title pt-4">Cemetery</h1>
               <div className="">
                <div className="col">
                <div >
                <h5 className="clientheading fs-6 pt-3">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</h5>
                 {establishmentOrCemetery ? <>
                 <div className="d-flex">
                    <div className="col-10 pt-3">
                 <label>Have you made arrangements for handling of  remains with any funeral establishment or cemetery?</label>
                 </div>
                 <div className="col-2">
                 <input type="text" value={establishmentOrCemetery}></input>
                </div>
                </div>
                <CemetryGenQuestionPdf memberUserId={userId} />
                </> : <p>(Not provided)</p>}
                </div>
              </div>

              {spouseUserId && <div className="col">
                 <h5 className="clientheading pt-3 fs-6">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</h5>
                 {establishmentOrCemeterySpouse ? <>
                 <div className="d-flex">
                 <div className=" col-10 pt-3">
                 <label>Have you made arrangements for handling of  remains with any funeral establishment or cemetery?</label>
                 </div>
                 <div className="col-2">
                 <input type="text" value={establishmentOrCemeterySpouse}></input>
                </div>
                </div>
                {spouseUserId != '' && <CemetryGenQuestionPdf memberUserId={spouseUserId} />}
                </> : <p>(Not provided)</p>}
              
              </div>}

              </div>
        </div>
     );
}
 
export default HandlingofRemains;