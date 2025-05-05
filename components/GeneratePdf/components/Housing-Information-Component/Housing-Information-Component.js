import { useEffect, useState } from "react";
import Api from "../../helper/api";
import konsole from "../../../control/Konsole";
import CommProff from "./CommonProff";

const HousingInformationComponent = ({ primaryUserId ,refrencePage}) => {

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



  return (
    <div className="container-fluid ">
      <div className=" d-flex justify-content-center title">
        <h1 class="h4 fw-bold generate-pdf-main-color">Housing Information</h1>
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

      <div className="container-fluid">
        <div className="row">
          <div className="col">
          Is the house you are living in, the house you like to spend the rest of your life?
          </div>
          <div className="col">
            <div className="row ">
              <div className="col-4">


                {/* <div> */}
                <label className="p-2 pt-0 ">Yes</label>
                <input className="form-check-input " type="checkbox" checked={restOfYourLife == "Yes"} />
                  

                {/* </div> */}



              </div>


              <div className="col-4">
                <div>
                <label className="p-2 pt-0 ">No</label>
                  <input className="form-check-input" type="checkbox" checked={restOfYourLife == "No"} />
                  
                </div>
              </div>


              {/* <div className="col-2"></div> */}


            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            On a scale of 0 to 5, how likely is it that you will remain in your
            current home?
          </div>
          <div className="col p-0 m-0">
            <div>
              <label className="p-2 pt-0 ">1</label>
              <input className="form-check-input" type="checkbox" checked={onScale == '1'} />

            </div>
          </div>
          <div className="col p-0 m-0">
            <div>
              <label className="p-2 pt-0 ">2</label>
              <input className="form-check-input" type="checkbox" checked={onScale == '2'} />

            </div>
          </div>
          <div className="col p-0 m-0">
            <div>
              <label className="p-2 pt-0 ">3</label>
              <input className="form-check-input" type="checkbox" checked={onScale == '3'} />

            </div>
          </div>
          <div className="col p-0 m-0">
            <div>
              <label className="p-2 pt-0 ">4</label>
              <input className="form-check-input" type="checkbox" checked={onScale == '4'} />

            </div>
          </div>
          <div className="col p-0 m-0">
            <div>
              <label className="p-2 pt-0 ">5</label>
              <input className="form-check-input" type="checkbox" checked={onScale == '5'} />

            </div>
          </div>
        </div>
        <p>
          If you answered <b>no</b>, please skip to{" "}
          <b>Retirement Housing Options.</b>
        </p>
      </div>
      
      <p className="Heading mt-3 mb-3 generate-pdf-main-color fs-5">{"Realtor"}</p>
      <CommProff api={api} memberId={primaryUserId} refrencePage={refrencePage}  profName={"Realtor"} proTypeId={'16'} userDetailOfPrimary={userDetailOfPrimary.memberName}  />  {/* realtor primary */}
      <CommProff api={api} memberId={spouseUserId}  refrencePage={refrencePage}  profName={"Realtor"} proTypeId={'16'} userDetailOfPrimary={userDetailOfPrimary.spouseName} />  {/*realtor spouse */}
      <p className="Heading mt-3 mb-3 generate-pdf-main-color fs-5">{"Mortgage Broker"}</p>
      <CommProff api={api} memberId={primaryUserId} refrencePage={refrencePage}  profName={"Mortgage Broker"} proTypeId={'17'}  userDetailOfPrimary={userDetailOfPrimary.memberName} />  {/* mortage primary */}
      <CommProff api={api} memberId={spouseUserId}  refrencePage={refrencePage}  profName={"Mortgage Broker"} proTypeId={'17'} userDetailOfPrimary={userDetailOfPrimary.spouseName} />  { /*mortage spouse */}
      <p className="Heading mt-3 mb-3 generate-pdf-main-color fs-5">{"Handyman"}</p>
      <CommProff api={api} memberId={primaryUserId} refrencePage={refrencePage}  profName={"Handyman"} proTypeId={'4'} userDetailOfPrimary={userDetailOfPrimary.memberName}  />  {/* handyman primary */}
      <CommProff api={api} memberId={spouseUserId}  refrencePage={refrencePage}  profName={"Handyman"} proTypeId={'4'} userDetailOfPrimary={userDetailOfPrimary.spouseName} />  {/*handyman spouse */}
        <div className="container-fluid pt-3">
        <span className="border-bottom-thin generate-pdf-main-color fs-5">
          Current Residence Characteristics
        </span>
        <div className="row pt-2">
          <div className="col">
            <p>What year was your home built?</p>
          </div>
          <div className="col">
            <input value={homeBuilt}></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p>What is your home square footage?</p>
          </div>
          <div className="col">
            <input value={homeSquareFootage}></input>
          </div>
        </div>

        <div className="row mt-2 paddTop">
          <div className="col-4">
            <p>How many stories does it have?</p>
          </div>
          <div className="col">
            <div className="row">
              <div className="col-2 m-0 p-0"> 
                <div>
                  <label className="p-2 pt-0 ">1</label>
                  <input className="form-check-input" type="checkbox" checked={storiesDoesItHave == "1"} /> 

                </div>
              </div>
              <div className="col-2 m-0 p-0">
                <div>
                  <label className="p-2 pt-0 ">2</label>
                  <input className="form-check-input" type="checkbox" checked={storiesDoesItHave == "2"} />

                </div>
              </div>
              <div className="col-2 m-0 p-0">
                <div>
                  <label className="p-2 pt-0 ">3</label>
                  <input className="form-check-input" type="checkbox" checked={storiesDoesItHave == "3"} />

                </div>
              </div>
              <div className="col-2 m-0 p-0">
                <div>
                  <label className="p-2 pt-0 ">4</label>
                  <input className="form-check-input" type="checkbox" checked={storiesDoesItHave == "4"} />

                </div>
              </div>
              <div className="col-3 m-0 p-0">
                  <label className="p-2 pt-0 ">More</label>
                  <input className="form-check-input" type="checkbox" checked={storiesDoesItHave == "More"} />
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col">Is it split level?</div>
          <div className="col">
            <div className="row">
            <div className="col-4">
                <div>
                <label className="p-2 pt-0 ">Yes</label>
                  <input className="form-check-input" type="checkbox" checked={splitLevel == "Yes"} />
                 
                </div>
              </div>
              <div className="col-4">
                <div>
                <label className="p-2 pt-0 ">No</label>
                  <input className="form-check-input" type="checkbox" checked={splitLevel == "No"} />
                 
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p>
              Is there a bedroom on the main floor{" "}
              {"(reachable without stairs)"}?
            </p>
          </div>
          <div className="col">
            <input value={mainFloor}></input>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p>What floor is the laundry on?</p>
          </div>
          <div className="col">
            <input value={floorIsTheLaundry}></input>
          </div>
        </div>

        <div className="row paddTop">
          <div className="col">
            <p>What is the (maintained) yard size?</p>
          </div>
          <div className="col">
            <input value={maintainedYardSize}></input>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p>How many steps do you have to climb to get to the front door</p>
          </div>
          <div className="col">
            <input value={getToTheFrontDoor}></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p>How many steps do you have to navigate to get to the backyard?</p>
          </div>
          <div className="col">
            <input value={getToTheBackyard}></input>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p>How many stairs to enter the garage?</p>
          </div>
          <div className="col">
            <input value={houseFromTheGarage}></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p>What are the door widths?</p>
          </div>
          <div className="col">
            <input value={doorWidths}></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p>What are the hallway widths?</p>
          </div>
          <div className="col">
            <input value={hallwayWidths}></input>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col">
            <p>Is your home suitable for a live-in caregiver?</p>
          </div>
          <div className="col">
            <div className="row mt-2">
            <div className="col-4">
                <div>
                <label className="p-2 pt-0 ">Yes</label>
                  <input className="form-check-input" type="checkbox" checked={liveInCaregiver == "Yes"} />
                  
                </div>
              </div>
              <div className="col-4">
                <div>
                <label className="p-2 pt-0 ">No</label>
                  <input className="form-check-input" type="checkbox" checked={liveInCaregiver == "No"} />
                 
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-2 paddTop">
          <div className="col">
            <p className="">Are you comfortable having a caregiver in your home?</p>
          </div>
          <div className="col">
            <div className="row">
            <div className="col-4">
                <div>
                <label className="p-2 pt-0 ">Yes</label>
                  <input className="form-check-input" type="checkbox" checked={caregiverInYourHome == "Yes"} />
                  
                </div>
              </div>
              <div className="col-4">
                <div>
                <label className="p-2 pt-0 ">No</label>
                  <input className="form-check-input" type="checkbox" checked={caregiverInYourHome == "No"} />
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        <span className="generate-pdf-main-color border-bottom-thin fs-5">
          Your Feelings About Retirement Housing Options
        </span>

        <div className="row pt-1">
          <div className="col">
            <p>Where would you eventually like to retire (city and state)?</p>
          </div>
          <div className="col">
            <input value={eventuallyLiketoRetire}></input>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p>
              Who would be the closet relative from that place?
            </p>
          </div>
          <div className="col">
            <input value={relativeFromThatPlaceQues}></input>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p>
            How many miles from the closest relative (who is available to help)?
            </p>
          </div>
          <div className="col">
            <input value={closestRelativeDis} ></input>
          </div>
        </div>

        <div className="row paddTop">
          <div className="col-4">
            <p>Would you consider living with a child/family member?</p>
          </div>
          <div className="col">
            <div className="row mt-2">
              <div className="col-3">
                <div>
                <label className="p-2 pt-0 ">Yes</label>
                  <input className="form-check-input" type="checkbox" checked={familyMember == "Yes"} />
                 
                </div>
              </div>
              <div className="col-3">
                <div>
                <label className="p-2 pt-0 ">No</label>
                  <input className="form-check-input" type="checkbox" checked={familyMember == "No"} />
                 
                </div>
              </div>
              <div className="col-4">
                <div>
                <label className="p-2 pt-0 ">Not Sure</label>
                  <input className="form-check-input" type="checkbox" checked={familyMember == "Not Sure"} />
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row paddTop">
          <div className="col-4">
            <p>Would you consider moving to a condominium?</p>
          </div>
          <div className="col">
            <div className="row">
            <div className="col-3">
                <div>
                <label className="p-2 pt-0 ">Yes</label>
                  <input className="form-check-input" type="checkbox" checked={movingToaCondominium == "Yes"} />
                 
                </div>
              </div>
              <div className="col-3">
                <div>
                <label className="p-2 pt-0 ">No</label>
                  <input className="form-check-input" type="checkbox" checked={movingToaCondominium == "No"} />
                
                </div>
              </div>
              <div className="col-4">
                {/* <div> */}
                <label className="p-2 pt-0 ">Not Sure</label>
                  <input className="form-check-input" type="checkbox" checked={movingToaCondominium == "Not Sure"} />
                
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-4">
            <p>Would you consider moving to a lifestyle community?</p>
          </div>
          <div className="col">
            <div className="row mt-2">
            <div className="col-3">
                <div>
                <label className="p-2 pt-0 ">Yes</label>
                  <input className="form-check-input" type="checkbox" checked={movingToaLifestyleCommunity == "Yes"} />
                
                </div>
              </div>
              <div className="col-3">
                <div>
                <label className="p-2 pt-0 ">No</label>
                  <input className="form-check-input" type="checkbox" checked={movingToaLifestyleCommunity == "No"} />
                  
                </div>
              </div>
              <div className="col-4">
                <div>
                <label className="p-2 pt-0 ">Not Sure</label>
                  <input className="form-check-input" type="checkbox" checked={movingToaLifestyleCommunity == "Not Sure"} />
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row paddTop">
          <div className="col-4">
            <p>Would you consider moving to a retirement community?</p>
          </div>
          <div className="col">
            <div className="row">
            <div className="col-3">
                <div>
                <label className="p-2 pt-0 ">Yes</label>
                  <input className="form-check-input" type="checkbox" checked={movingToaRetirementCommunity == "Yes"} />
                  
                </div>
              </div>
              <div className="col-3">
                <div>
                <label className="p-2 pt-0 ">No</label>
                  <input className="form-check-input" type="checkbox" checked={movingToaRetirementCommunity == "No"} />
                 
                </div>
              </div>
              <div className="col-4">
                <div>
                <label className="p-2 pt-0 ">Not Sure</label>
                  <input className="form-check-input" type="checkbox" checked={movingToaRetirementCommunity == "Not Sure"} />
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="fw-bold text-danger"></hr>
    </div>
  );
};

export default HousingInformationComponent;
