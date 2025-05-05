import konsole from "../../../../control/Konsole";
import { $AHelper } from "../../../../control/AHelper";
import HIPClientSum from "./Health-Insurence-Plan-Client-Component/HIPClientSum";

const HealthInsurencePlanSumComponent = (props) => {
  const healthInsurence=props.healthInsurence?.data?.data
  const secondhealthInsurance=props.secondhealthInsurance?.data?.data
  konsole.log("YTYTYTYTYT",props)
  const sameForSpouse = secondhealthInsurance?.some(ele => ele.userInsuranceId == healthInsurence?.[0]?.userInsuranceId) || false;

  let userDetailOfPrimary=props.userDetailOfPrimary


  return (
    <div className="contain">
      <div>
      <ul className="pt-3 ps-3"><li className="head-2">Health Insurance Plan</li></ul>
      </div>

      <div className="contain">
        <div>
          <div>
            <div className="d-flex ps-3 gap-2 pb-2 pt-3">
             <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
             <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary?.memberName)}</h5>
            </div>
           
            {healthInsurence ? <HIPClientSum healthInsurence={healthInsurence} sameForSpouse={sameForSpouse} userNo={1} ></HIPClientSum> : <p className="mx-3"> (Not provided) </p>}
          </div>
          {userDetailOfPrimary.spouseName && <><div>
          <div className="d-flex gap-2 ps-3 pb-2 pt-3">
             <img className="mt-0 mb-1" style={{width:"14px"}} src="/images/healthSumImg1.svg"/>
             <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(userDetailOfPrimary?.spouseName)}</h5>
            </div>
            
            {secondhealthInsurance ? <HIPClientSum healthInsurence={secondhealthInsurance} sameForSpouse={undefined} userNo={2} > </HIPClientSum> : <p className="mx-3"> (Not provided) </p>}
          </div>
          </>}
        </div>
      </div>
    </div>
  );
};

export default HealthInsurencePlanSumComponent;
