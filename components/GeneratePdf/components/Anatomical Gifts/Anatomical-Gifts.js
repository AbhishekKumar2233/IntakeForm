
import { useEffect, useState,Grid } from "react";
import Api from "../../helper/api";
import konsole from "../../../control/Konsole";
import { $AHelper } from "../../../control/AHelper";


const AnatomicalGifts = (props) => {

    const api = new Api();

    const userId = (props.primaryUserId !== null && props.primaryUserId !== '') ? props?.primaryUserId : '';
    const spouseUserId = (props.spouseUserId !== null && props.spouseUserId !== '') ? props?.spouseUserId : '';

    const categoryId = "0";

    const topicId = "5";

    const subjectId = "0";

    const organDonorQuesId = "59";

    const bodyForScientificResearchQuesId = "60";

    const [organDonor, setOrganDonor] = useState();

    const [organDonorSpouse, setOrganDonorSpouse] = useState();

    const [bodyForScientificResearch, setBodyForScientificResearch] = useState();

    const [bodyForScientificResearchSpouse, setBodyForScientificResearchSpouse] = useState();
   
    let userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))
    useEffect(() => {
        if(userId !== ''){
            api.GetUserSubject(userId, categoryId, topicId, subjectId)
                .then((res) => {
                    const legalRes = res.data.data.userSubjects;
                    
                    for (let i = 0; i < legalRes.length; i++) {
                        if (legalRes[i].questionId == organDonorQuesId) {
                            setOrganDonor(legalRes[i].response)
                        }
                        if (legalRes[i].questionId == bodyForScientificResearchQuesId) {
                            setBodyForScientificResearch(legalRes[i].response)
                        }

                    }

                }).catch(error => konsole.log("apiError7", error));
        }
    }, [userId])

    useEffect(()=>{
        if(spouseUserId !== ''){
            api.GetUserSubject(spouseUserId, categoryId, topicId, subjectId)
                .then((res) => {
                    const legalSpouseRes = res.data.data.userSubjects;
                    
                    for (let i = 0; i < legalSpouseRes.length; i++) {
                        if (legalSpouseRes[i].questionId == organDonorQuesId) {
                            setOrganDonorSpouse(legalSpouseRes[i].response)
                        }
                        if (legalSpouseRes[i].questionId == bodyForScientificResearchQuesId) {
                            setBodyForScientificResearchSpouse(legalSpouseRes[i].response)
                        }

                    }
                }).catch(error => konsole.log("apiError8", error));
        }
    },[spouseUserId])

    return ( 
        <div className="container-fluid">
        <br></br>
        <h1 className="h4 fw-bold generate-pdf-main-color title">Anatomical Gifts</h1>
        <>           
          
          
          
        <table className='table-container  w-100 '>
                <tr className="">
                    
                    <th className="col-1 "></th>
                    <th colSpan='2' className=" col-2  pb-2 ">
                        <u className="clientheading  m-5">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</u>
                    </th>
                    <th colSpan='2' className=" col-2 text-center pb-2 ">
                        <u className="clientheading m-5">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</u>
                    </th>
                    {/* <th className="col-2 border"></th> */}
                </tr>
                <tr>
                    
                    <th className="col-3 p-0 m-0">Do you wish to be an organ donor?</th>
                    <th className="col-2  "><input type='checkbox' className="form-check-input " checked={organDonor == "Yes"}/><span className="" >Yes</span></th>
                    <th className="col-2 p-0 m-0 "><input type='checkbox'  className="form-check-input"checked={organDonor == "No"}/><span className=""  >No</span></th>
                    <th className="col-2 p-0 m-0 "><input type='checkbox'  className="form-check-input" checked={organDonorSpouse == "Yes"}/><span className=""  >Yes</span></th>
                    <th className="col-2 p-0 m-0 "><input type='checkbox'  className="form-check-input" checked={organDonorSpouse == "No"}/><span className=""  >No</span></th>
                </tr>
                <tr>
                    
                    <th className="col-3">Do you wish to donate your body for scientific research?</th>
                    <th className="col-2 "><input type='checkbox'  className="form-check-input" checked={bodyForScientificResearch == "Yes"}/><span className="psLeft"  >Yes</span></th>
                    <th className="col-2 "><input type='checkbox'  className="form-check-input" checked={bodyForScientificResearch == "No"}/><span className="psLeft"  >No</span></th>
                    <th className="col-2 "><input type='checkbox'  className="form-check-input" checked={bodyForScientificResearchSpouse == "Yes"}/><span className="psLeft" >Yes</span></th>
                    <th className="col-2 "><input type='checkbox'  className="form-check-input" checked={bodyForScientificResearchSpouse == "No"}/><span className="psLeft">No</span></th>
                </tr>
            </table>
            </>
        </div>
     );
}
 
export default AnatomicalGifts;