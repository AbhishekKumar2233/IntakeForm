import { useEffect, useState } from "react";
import Api from "../../helper/api";
import konsole from "../../../control/Konsole";
import CommProfSum from "./commProfSum";

const HousingInformationSumComponent = ({ primaryUserId ,refrencePage,yourhouse1}) => {

  const api = new Api();

  const userId = primaryUserId;

  const categoryId = "0";

  const topicId = "4";

  const subjectId = "0";

  const eventuallyLiketoRetireQuesId = "20";

  const relativeFromThatPlaceQuesId = "21";

  const closestRelativeDisQuesId = "22";

  const familyMemberQuesId = "23";

  const movingToaCondominiumQuesId = "24";

  const movingToaLifestyleCommunityQuesId = "25";

  const movingToaRetirementCommunityQuesId = "26";

  const homeBuiltQuesId = "30";

  const homeSquareFootageQuesId = "31";

  const storiesDoesItHaveQuesId = "32";

  const splitLevelQuesId = "35";

  const maintainedYardSizeQuesId = "36";

  const getToTheFrontDoorQuesId = "37";

  const getToTheBackyardQuesId = "38";

  const houseFromTheGarageQuesId = "39";

  const doorWidthsQuesId = "40";

  const hallwayWidthsQuesId = "41";

  const floorIsTheLaundryQuesId = "33";

  const mainFloorQuesId = "34";

  const caregiverInYourHomeQuesId = "43";

  const liveInCaregiverQuesId = "42";

  const restOfYourLifeQuesId = "18";

  const onScaleId = '27';

  const [eventuallyLiketoRetire, setEventuallyLiketoRetire] = useState();

  const [onScale, setOnScale] = useState();

  const [relativeFromThatPlaceQues, setRelativeFromThatPlaceQues] = useState();

  const [closestRelativeDis, setclosestRelativeDis] = useState();

  const [familyMember, setfamilyMember] = useState();

  const [movingToaCondominium, setmovingToaCondominium] = useState();

  const [movingToaLifestyleCommunity, setmovingToaLifestyleCommunity] = useState();

  const [movingToaRetirementCommunity, setmovingToaRetirementCommunity] = useState();

  const [homeBuilt, setHomeBuilt] = useState();

  const [homeSquareFootage, setHomeSquareFootage] = useState();

  const [storiesDoesItHave, setstoriesDoesItHave] = useState();

  const [splitLevel, setSplitLevel] = useState();

  const [maintainedYardSize, setMaintainedYardSize] = useState();

  const [getToTheFrontDoor, setGetToTheFrontDoor] = useState();

  const [getToTheBackyard, setGetToTheBackyard] = useState();

  const [houseFromTheGarage, setHouseFromTheGarage] = useState();

  const [doorWidths, setDoorWidths] = useState();

  const [hallwayWidths, setHallwayWidths] = useState();

  const [floorIsTheLaundry, setFloorIsTheLaundry] = useState();

  const [mainFloor, setMainFloor] = useState();

  const [caregiverInYourHome, setCaregiverInYourHome] = useState();

  const [liveInCaregiver, setLiveInCaregiver] = useState();

  const [restOfYourLife, setRestOfYourLife] = useState();
  const spouseUserId = sessionStorage.getItem('spouseUserId');
  let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))
  

  useEffect(() => {
    api.GetUserSubject(userId, categoryId, topicId, subjectId)
      .then((res) => {
        const HousingRes = res.data.data.userSubjects;
        konsole.log("legalRes", HousingRes);
        for (let i = 0; i < HousingRes.length; i++) {
          if (HousingRes[i].questionId == eventuallyLiketoRetireQuesId) {
            setEventuallyLiketoRetire(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == relativeFromThatPlaceQuesId) {
            setRelativeFromThatPlaceQues(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == closestRelativeDisQuesId) {
            setclosestRelativeDis(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == familyMemberQuesId) {
            setfamilyMember(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == movingToaCondominiumQuesId) {
            setmovingToaCondominium(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == movingToaLifestyleCommunityQuesId) {
            setmovingToaLifestyleCommunity(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == movingToaRetirementCommunityQuesId) {
            setmovingToaRetirementCommunity(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == homeBuiltQuesId) {
            setHomeBuilt(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == homeSquareFootageQuesId) {
            setHomeSquareFootage(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == storiesDoesItHaveQuesId) {
            setstoriesDoesItHave(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == splitLevelQuesId) {
            setSplitLevel(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == maintainedYardSizeQuesId) {
            setMaintainedYardSize(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == getToTheFrontDoorQuesId) {
            setGetToTheFrontDoor(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == getToTheBackyardQuesId) {
            setGetToTheBackyard(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == houseFromTheGarageQuesId) {
            setHouseFromTheGarage(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == doorWidthsQuesId) {
            setDoorWidths(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == hallwayWidthsQuesId) {
            setHallwayWidths(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == floorIsTheLaundryQuesId) {
            setFloorIsTheLaundry(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == mainFloorQuesId) {
            setMainFloor(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == caregiverInYourHomeQuesId) {
            setCaregiverInYourHome(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == liveInCaregiverQuesId) {
            setLiveInCaregiver(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == restOfYourLifeQuesId) {
            setRestOfYourLife(HousingRes[i].response)
          }
          if (HousingRes[i].questionId == onScaleId) {
            setOnScale(HousingRes[i].response)
          }
        }

      })
      .catch(error => konsole.log("apiError1", error));
  }, [])
   
  konsole.log(onScale,"onScaleaa")


  return (
    <div className="container-fluid ">
      <div className=" d-flex justify-content-start pb-2" style={{borderBottom:"2px solid #E8E8E8", margin:"0px 10px"}}>
        <h1 className="health_Info_h1 pb-3">Housing Information</h1>
      </div>
      {(refrencePage !="SummaryDoc") && 
      <div>
        <p className="para-p1">
          Please tell us about your housing situation. You may need to take a
          few measurements, move around to review, or refer to a map. However,
          most of all, spend a few moments viewing your home objectively and
          honestly {"–"} through the lens of an older you.
        </p>
        <br />
      </div>
      }

      <div className="contain">
        <div className="d-flex pt-4">
             <div className="sumPhysician pb-3" style={{width:"50%"}}>
                <p>Is the house you are living in, the house you like to spend the rest of your life?</p>
                <h5>{restOfYourLife}</h5>
                  </div>
                  {yourhouse1 == "Yes" && 
                    <div className="sumPhysician pb-3" style={{width:"50%"}}>
                      <p>On a scale of 0 to 5, how likely is it that you will remain in your current home?</p>
                      <h5>{onScale}</h5>
                    </div> 
                  }
        </div>
      </div>

       <ul className="pt-2 ps-3"><li className="head-2">{"Realtor"}</li></ul>
      <CommProfSum api={api} memberId={primaryUserId} refrencePage={refrencePage}  profName={"Realtor"} proTypeId={'16'} userDetailOfPrimary={userDetailOfPrimary.memberName}  />  {/* realtor primary */}
      <CommProfSum api={api} memberId={spouseUserId}  refrencePage={refrencePage}  profName={"Realtor"} proTypeId={'16'} userDetailOfPrimary={userDetailOfPrimary.spouseName} />  {/*realtor spouse */}
       <ul className="pt-2 ps-3"><li className="head-2">{"Mortgage Broker"}</li></ul>
      <CommProfSum api={api} memberId={primaryUserId} refrencePage={refrencePage}  profName={"Mortgage Broker"} proTypeId={'17'} userDetailOfPrimary={userDetailOfPrimary.memberName} />  {/* mortage primary */}
      <CommProfSum api={api} memberId={spouseUserId}  refrencePage={refrencePage}  profName={"Mortgage Broker"} proTypeId={'17'} userDetailOfPrimary={userDetailOfPrimary.spouseName} />  { /*mortage spouse */}
      <ul className="pt-2 ps-3"><li className="head-2">{"Handyman"}</li></ul>
      <CommProfSum api={api} memberId={primaryUserId} refrencePage={refrencePage}  profName={"Handyman"} proTypeId={'4'} userDetailOfPrimary={userDetailOfPrimary.memberName}  />  {/* handyman primary */}
      <CommProfSum api={api} memberId={spouseUserId}  refrencePage={refrencePage}  profName={"Handyman"} proTypeId={'4'} userDetailOfPrimary={userDetailOfPrimary.spouseName} />  {/*handyman spouse */}

      <div className="contain">
      {yourhouse1 == "Yes" && 
        <div >
          <div >
          <ul className="pt-5 ps-3"><li className="head-2">Current Residence Characteristics</li></ul>
          </div>
          <div className="contain pt-2">
              <div className="d-flex justify-content-between">
            <div className="sumPhysician pb-3" style={{width:"46%"}} >
              <p>What year was your home built?</p>
              <h5>{homeBuilt}</h5>
              </div> 
              <div className="sumPhysician pb-3" style={{width:"54%"}} >
              <p>What is your home square footage?</p>
              <h5>{homeSquareFootage}</h5>
              </div> 
              </div>
            </div>
        
          <div className="contain">
          <div className="d-flex">
          <div className="sumPhysician pb-3" style={{width:"46%"}} >
              <p>How many stories does it have?</p>
              <h5>{storiesDoesItHave}</h5>
              </div> 
              <div className="sumPhysician pb-3" style={{width:"54%"}} >
              <p>Is it split level?</p>
              <h5>{splitLevel}</h5>
              </div> 
              </div>   
          </div>

          <div className="contain">
          <div className="d-flex">
          <div className="sumPhysician pb-3" style={{width:"44%"}}>
              <p>Is there a bedroom on the main floor{" "}
                {"(reachable without stairs)"}?</p>
              <h5>{mainFloor}</h5>
              </div> 
              <div className="sumPhysician pb-3 ps-3" style={{width:"54%"}}>
              <p>What floor is the laundry on?</p>
              <h5>{floorIsTheLaundry}</h5>
              </div> 
              </div>   
          </div>

          <div className="contain">
          <div className="d-flex">
          <div className="sumPhysician pb-3" style={{width:"46%"}}>
              <p>What is the (maintained) yard size?</p>
              <h5>{maintainedYardSize}</h5>
              </div> 
              <div className="sumPhysician pb-3" style={{width:"54%"}}>
              <p>How many steps do you have to climb to get to the front door</p>
              <h5>{getToTheFrontDoor}</h5>
              </div> 
              </div>   
          </div>
            
          <div className="contain">
          <div className="d-flex">
          <div className="sumPhysician pb-3" style={{width:"44%"}}>
              <p>How many steps do you have to navigate to get to the backyard?</p>
              <h5>{getToTheBackyard}</h5>
              </div> 
              <div className="sumPhysician pb-3 ps-3" style={{width:"56%"}}>
              <p>How many steps do you have to navigate to get in to the house from the garage (if house has a built-in garage)?</p>
              <h5>{houseFromTheGarage}</h5>
              </div> 
              </div>   
          </div>

          <div className="contain">
          <div className="d-flex">
          <div className="sumPhysician pb-3" style={{width:"46%"}}>
              <p>What are the door widths?</p>
              <h5>{doorWidths}</h5>
              </div> 
              <div className="sumPhysician pb-3" style={{width:"54%"}}>
              <p>What are the hallway widths?</p>
              <h5>{hallwayWidths}</h5>
              </div> 
              </div>   
          </div>
          </div>
      }
       

       {yourhouse1 == "Yes" && 
      <>
        <ul className="pt-5 ps-3"><li className="head-2">Caregiver Suitability</li></ul>
        <div className="contain">
        <div className="d-flex">
        <div className="sumPhysician pb-3" style={{width:"46%"}}>
            <p>Is your home suitable for a live-in caregiver?</p>
            <h5>{liveInCaregiver}</h5>
            </div> 
            <div className="sumPhysician pb-3" style={{width:"54%"}}>
            <p>Are you comfortable having a caregiver in your home?</p>
            <h5>{caregiverInYourHome}</h5>
            </div> 
            </div>   
        </div>
      </>       
       }

           <div>
         <ul className="pt-3 ps-3"><li className="head-2">Your Feelings About Retirement Housing Options</li></ul>
         </div>
          
         <div className="contain">
        <div className="d-flex">

          {yourhouse1 == "No" && 
             <div className="sumPhysician pb-3" style={{width:"46%"}}>
                <p>Where would you like to retire (city and state)?</p>
                <h5>{eventuallyLiketoRetire}</h5>
             </div>
          }
            <div className="sumPhysician pb-3" style={{width:"54%"}}>
            <p>Who would be the closet relative from that place?</p>
            <h5>{relativeFromThatPlaceQues}</h5>
            </div> 
            </div>   
        </div>   

        <div className="contain">
        <div className="d-flex">
        <div className="sumPhysician pb-3" style={{width:"46%"}}>
            <p>How many miles from the closest relative (who is available to help)?</p>
            <h5>{closestRelativeDis}</h5>
            </div> 
            <div className="sumPhysician pb-3" style={{width:"54%"}}>
            <p>Would you consider living with a child/family member?</p>
            <h5>{familyMember}</h5>
            </div> 
            </div>   
        </div>  

        <div className="contain">
        <div className="d-flex">
        <div className="sumPhysician pb-3" style={{width:"46%"}}>
            <p>Would you consider moving to a condominium?</p>
            <h5>{movingToaCondominium}</h5>
            </div> 
            <div className="sumPhysician pb-3" style={{width:"54%"}}>
            <p>Would you consider moving to a lifestyle community?</p>
            <h5>{movingToaLifestyleCommunity }</h5>
            </div> 
            </div>   
        </div>

        <div className="contain">
        <div className="d-flex">
        <div className="sumPhysician pb-3" style={{width:"50%"}}>
            <p>Would you consider moving to a retirement community?</p>
            <h5>{movingToaRetirementCommunity}</h5>
            </div> 
            </div>   
        </div>
      </div>
    </div>
  );
};

export default HousingInformationSumComponent;
