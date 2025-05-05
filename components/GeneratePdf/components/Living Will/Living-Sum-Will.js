
import { useEffect, useState } from "react";
import Api from "../../helper/api";
import konsole from "../../../control/Konsole";
import { $AHelper } from "../../../control/AHelper";

const LivingSumWill = (props) => {
    const api = new Api();

    const userId = (props.primaryUserId !== null && props.primaryUserId !== '') ? props?.primaryUserId : '';
    const spouseUerId = (props.spouseUserId !== null && props.spouseUserId !== '') ? props?.spouseUserId : '';

    const categoryId = "0";

    const topicId = "5";

    const subjectId = "0";

    const maximumTreatmentQuesId = "52";

    const lifeSupportQuesID = "53";

    const cardiopulmonaryResuscitationQuesId = "54";

    const artificiallyProvidedHydrationQuesId = "55";

    const artificiallyProvidedNutritionQuesId = "56";

    const antibioticTreatmentQuesId = "57" ;

    const otherHeroicMeasuresQuesId = "58";

    const [maximumTreatment, setMaximumTreatment] = useState();

    const [maximumTreatmentSpouse, setMaximumTreatmentSpouse] = useState();

    const [lifeSupport, setLifeSupport] = useState();

    const [lifeSupportSpouse, setLifeSupportSpouse] = useState();

    const [cardiopulmonaryResuscitation, setCardiopulmonaryResuscitation] = useState();

    const [cardiopulmonaryResuscitationSpouse, setCardiopulmonaryResuscitationSpouse] = useState();

    const [artificiallyProvidedHydration, setArtificiallyProvidedHydration] = useState();

    const [artificiallyProvidedHydrationSpouse, setArtificiallyProvidedHydrationSpouse] = useState();

    const [antibioticTreatment, setantibioticTreatment] = useState();

    const [antibioticTreatmentSpouse, setantibioticTreatmentSpouse] = useState();

    const [otherHeroicMeasures, setOtherHeroicMeasures] = useState();

    const [otherHeroicMeasuresSpouse, setOtherHeroicMeasuresSpouse] = useState();

    const [artificiallyProvidedNutrition, setArtificiallyProvidedNutrition] = useState();

    const [artificiallyProvidedNutritionSpouse, setArtificiallyProvidedNutritionSpouse] = useState();
    let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))

    useEffect(() => {
        if(userId !== ''){
            api.GetUserSubject(userId, categoryId, topicId, subjectId)
                .then((res) => {
                    const legalRes = res.data.data.userSubjects;
                    konsole.log("legalRes", legalRes);
                    for (let i = 0; i < legalRes.length; i++) {
                        if (legalRes[i].questionId == maximumTreatmentQuesId) {
                            setMaximumTreatment(legalRes[i].response)
                        }
                        if (legalRes[i].questionId == lifeSupportQuesID) {
                            setLifeSupport(legalRes[i].response)
                        }
                        if (legalRes[i].questionId == cardiopulmonaryResuscitationQuesId) {
                            setCardiopulmonaryResuscitation(legalRes[i].response)
                            konsole.log("cardio", legalRes[i].response);
                        }
                        if (legalRes[i].questionId == artificiallyProvidedHydrationQuesId) {
                            setArtificiallyProvidedHydration(legalRes[i].response)
                        }
                        if (legalRes[i].questionId == antibioticTreatmentQuesId) {
                            setantibioticTreatment(legalRes[i].response)
                        }
                        if (legalRes[i].questionId == otherHeroicMeasuresQuesId) {
                            setOtherHeroicMeasures(legalRes[i].response)
                        }
                        if (legalRes[i].questionId == artificiallyProvidedNutritionQuesId) {
                            setArtificiallyProvidedNutrition(legalRes[i].response)
                        }

                    }
                }).catch(error => konsole.log("apiError5", error));
        }
    }, [userId])

    useEffect(()=>{
        if(spouseUerId !== ''){
            api.GetUserSubject(spouseUerId, categoryId, topicId, subjectId)
                .then((res) => {
                    const legalSpouseRes = res.data.data.userSubjects;
                    konsole.log("legalSpouseRes", legalSpouseRes);
                    for (let i = 0; i < legalSpouseRes.length; i++) {
                        if (legalSpouseRes[i].questionId == maximumTreatmentQuesId) {
                            setMaximumTreatmentSpouse(legalSpouseRes[i].response)
                        }
                        if (legalSpouseRes[i].questionId == lifeSupportQuesID) {
                            setLifeSupportSpouse(legalSpouseRes[i].response)
                        }
                        if (legalSpouseRes[i].questionId == cardiopulmonaryResuscitationQuesId) {
                            setCardiopulmonaryResuscitationSpouse(legalSpouseRes[i].response)

                        }
                        if (legalSpouseRes[i].questionId == artificiallyProvidedHydrationQuesId) {
                            setArtificiallyProvidedHydrationSpouse(legalSpouseRes[i].response)
                        }
                        if (legalSpouseRes[i].questionId == antibioticTreatmentQuesId) {
                            setantibioticTreatmentSpouse(legalSpouseRes[i].response)
                        }
                        if (legalSpouseRes[i].questionId == otherHeroicMeasuresQuesId) {
                            setOtherHeroicMeasuresSpouse(legalSpouseRes[i].response)
                        }
                        if (legalSpouseRes[i].questionId == artificiallyProvidedNutritionQuesId) {
                            setArtificiallyProvidedNutritionSpouse(legalSpouseRes[i].response)
                        }
                    }

                }).catch(error => konsole.log("apiError6", error));
        }
    },[spouseUerId])
    konsole.log(cardiopulmonaryResuscitation, "asaaaaaaaa")

    return ( 
        <div className="row container-fluid mt-5">
            {/* <h1 className='h4 fw-bold generate-pdf-main-color title'>Living Will Details</h1> */}
            <div className=" d-flex justify-content-start" style={{borderBottom:"2px solid #E8E8E8"}}>
        <h1 className="health_Info_h1 pb-3">Living Will Details</h1>
        </div>

            {(props?.refrencePage !="SummaryDoc") &&<>
            <p className='  text-center para-p1'>If you were diagnosed with a terminal illness<br/>
            (no reasonable hope of living more than 6 months)<br/>
            and unable to communicate<br/>
            <u>OR</u><br/>
            <span>in a persistent vegetative state (comatose)</span><br/>
            <u>AND</u><br/>
            <span>Your loved ones concurred that there is no reasonable hope of you getting better.</span><br/>
            <span>What instructions do you want to give to your loved ones with regards to the use of artificial means of life support?</span><br/>
            </p>
            <hr></hr>
            <p className='p2 generate-pdf-main-color'>Please identify your choices for your Living Will:</p>
            </>}

                 <div className="d-flex justify-content-between pt-3">
                <div className="col">
                <div  className="pe-3" style={ spouseUerId ? { borderRight:"2px solid  #E8E8E8", margin:"0px 10px"}: {} }>
                <div className="d-flex gap-2 pb-3 pt-3" style={{borderBottom:"2px solid #E8E8E8"}}> <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
                 <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</h5></div>
                 {(maximumTreatment || lifeSupport || cardiopulmonaryResuscitation || artificiallyProvidedHydration || artificiallyProvidedNutrition || antibioticTreatment || otherHeroicMeasures) ? <>
                 <div className="sumPhysician pt-3">
                 <p>I want maximum treatment.</p>
                 <h5>{maximumTreatment}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>I want life support withdrawn.</p>
                 <h5>{lifeSupport}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Cardiopulmonary Resuscitation (CPR)?</p>
                 <h5>{cardiopulmonaryResuscitation}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Artificially provided hydration?</p>
                 <h5>{artificiallyProvidedHydration}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Artificially provided nutrition?</p>
                 <h5>{artificiallyProvidedNutrition}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Antibiotic treatment for side conditions?</p>
                 <h5>{antibioticTreatment}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Other heroic measures?</p>
                 <h5>{otherHeroicMeasures}</h5>
                </div>
                </> : <p>(Not provided)</p>}
              </div>
              </div>
              {spouseUerId && <div className="col">
                <div className="d-flex gap-2 pb-3 pt-3" style={{borderBottom:"2px solid #E8E8E8"}}> <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
                 <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</h5></div>
                 {(maximumTreatmentSpouse || lifeSupportSpouse || cardiopulmonaryResuscitationSpouse || artificiallyProvidedHydrationSpouse || artificiallyProvidedNutritionSpouse || antibioticTreatmentSpouse || otherHeroicMeasuresSpouse) ? <>
                 <div className="sumPhysician pt-3">
                 <p>I want maximum treatment.</p>
                 <h5>{maximumTreatmentSpouse}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>I want life support withdrawn.</p>
                 <h5>{lifeSupportSpouse}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Cardiopulmonary Resuscitation (CPR)?</p>
                 <h5>{cardiopulmonaryResuscitationSpouse}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Artificially provided hydration?</p>
                 <h5>{artificiallyProvidedHydrationSpouse}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Artificially provided nutrition?</p>
                 <h5>{artificiallyProvidedNutritionSpouse}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Antibiotic treatment for side conditions?</p>
                 <h5>{antibioticTreatmentSpouse}</h5>
                </div>
                <div className="sumPhysician pt-3">
                 <p>Other heroic measures?</p>
                 <h5>{otherHeroicMeasuresSpouse}</h5>
                </div>
                </>: <p>(Not provided)</p>}
              </div>}

              </div>


{/* ------------------------------------------- */}

                {/* <table className="FilterableTable">
                <tr>
                    <th ></th>
                    <th colSpan='2' className=" text-center pb-2">
                        <u className="p3">{userDetailOfPrimary?.memberName}</u>
                    </th>
                    <th colSpan='2' className="  text-center pb-2">
                        <u className="p3">{userDetailOfPrimary?.spouseName}</u>
                    </th>
                </tr>
               
                <tr>
                    
                    <th className="col-4">I want <span className='fw-bold fsMinimum'>MAXIMUM TREATMENT:</span></th>
                    <th className="col-2 "><span  ><input type='checkbox' className="form-check-input" checked={maximumTreatment == "Yes"}/>Yes</span></th>
                    <th className="col-2 "><input type='checkbox' className="form-check-input" checked={maximumTreatment == "No"} /><span className="">No</span></th>
                    <th className="col-2"><input type='checkbox' className="form-check-input" checked={maximumTreatmentSpouse == "Yes"}/><span className="">Yes</span></th>
                    <th className="col-2"><input type='checkbox' className="form-check-input" checked={maximumTreatmentSpouse == "No"}/><span className="">No</span></th>
                  
                </tr>
                <tr>
                  
                    <th className="col-4">I want <span className='fw-bold fsMinimum'>LIFE SUPPORT WITHDRAWN:</span></th>
                    <th className="col-2 "><input type='checkbox' className="form-check-input" checked={lifeSupport == "Yes"}/><span className="">Yes</span></th>
                    <th className="col-2 "><input type='checkbox' className="form-check-input" checked={lifeSupport == "No"} /><span className="">No</span></th>
                    <th className="col-2 "><input type='checkbox' className="form-check-input" checked={lifeSupportSpouse == "Yes"}/><span className="">Yes</span></th>
                    <th className="col-2 "><input type='checkbox' className="form-check-input" checked={lifeSupportSpouse == "No"}/><span className="">No</span></th>
                    
                </tr><br/> */}
                {/* <tr>
                    
                    <th className="col-6 fw-bold "><small>Do you want the following treatments:</small></th>
                    <th className="col-2 "></th>
                    <th className="col-2 "></th>
                    <th className="col-2"></th>
                </tr> */}
                {/* <tr className="fsMinimum">
                   
                    <th className="col-3">Cardiopulmonary Resuscitation (CPR)?</th>
                    <th className="col-2 "><input type='checkbox' className="form-check-input" checked={cardiopulmonaryResuscitation=="Do Want"}/><span className="">Do Want</span></th>
                    <th className="col-2 "><input type='checkbox' className="form-check-input" checked={cardiopulmonaryResuscitation=="Don't Want"}/><span className="">Don't Want</span></th>
                    <th className="col-2 "><input type='checkbox'className="form-check-input" checked={cardiopulmonaryResuscitationSpouse=="Do Want"}/><span className="">Do Want</span></th>
                    <th className="col-2 "><input type='checkbox' className="form-check-input" checked={cardiopulmonaryResuscitationSpouse=="Don't Want"}/><span className="">Don't Want</span></th>
                   
                </tr>
                <tr className="fsMinimum">
                   
                    <th className="col-4">Artificially provided hydration?</th>
                    <th className="col-2 "><input type='checkbox' className="form-check-input" checked={artificiallyProvidedHydration=="Do Want"}/><span className="">Do Want</span></th>
                    <th className="col-2 "><input type='checkbox' className="form-check-input" checked={artificiallyProvidedHydration=="Don't Want"}/><span className="">Don't Want</span></th>
                    <th className="col-2 "><input type='checkbox' className="form-check-input"checked={artificiallyProvidedHydrationSpouse=="Do Want"}/><span className="">Do Want</span></th>
                    <th className="col-2 "><input type='checkbox'  className="form-check-input" checked={artificiallyProvidedHydrationSpouse=="Don't Want"}/><span className="">Don't Want</span></th>
                  
                </tr>
                <tr className="fsMinimum">
                    
                    <th className="col-4">Artificially provided nutrition?</th>
                    <th className="col-2 "><input type='checkbox'className="form-check-input"checked={artificiallyProvidedNutrition=="Do Want"}/><span className="">Do Want</span></th>
                    <th className="col-2 "><input type='checkbox'className="form-check-input"checked={artificiallyProvidedNutrition=="Don't Want"}/><span className="">Don't Want</span></th>
                    <th className="col-2 "><input type='checkbox'className="form-check-input" checked={artificiallyProvidedNutritionSpouse=="Do Want"}/><span className="">Do Want</span></th>
                    <th className="col-2 "><input type='checkbox'className="form-check-input" checked={artificiallyProvidedNutritionSpouse=="Don't Want"}/><span className="">Don't Want</span></th>
                    
                </tr>
                <tr className="fsMinimum">
                   
                    <th className="col-4">Antibiotic treatment for side conditions?</th>
                    <th className="col-2 "><input type='checkbox'className="form-check-input" checked={antibioticTreatment=="Do Want"}/><span className="">Do Want</span></th>
                    <th className="col-2 "><input type='checkbox'className="form-check-input" checked={antibioticTreatment=="Don't Want"}/><span className="">Don't Want</span></th>
                    <th className="col-2 "><input type='checkbox'className="form-check-input" checked={antibioticTreatmentSpouse=="Do Want"}/><span className="">Do Want</span></th>
                    <th className="col-2 "><input type='checkbox'className="form-check-input" checked={antibioticTreatmentSpouse=="Don't Want"}/><span className="">Don't Want</span></th>
                   
                </tr>
                <tr className="fsMinimum">
                   
                    <th className="col-4">Other heroic measures?</th>
                    <th className="col-2 "><input type='checkbox'className="form-check-input" checked={otherHeroicMeasures=="Do Want"} /><span className="">Do Want</span></th>
                    <th className="col-2 "><input type='checkbox'className="form-check-input" checked={otherHeroicMeasures=="Don't Want"}/><span className="">Don't Want</span></th>
                    <th className="col-2 "><input type='checkbox'className="form-check-input" checked={otherHeroicMeasuresSpouse=="Do Want"}/><span className="">Do Want</span></th>
                    <th className="col-2 "><input type='checkbox'className="form-check-input" checked={otherHeroicMeasuresSpouse=="Don't Want"}/><span className="">Don't Want</span></th>
                   
                </tr>
            </table> */}
            {/*================================starting  new way======================================  */}
           
        </div>
     );
}
 
export default LivingSumWill;