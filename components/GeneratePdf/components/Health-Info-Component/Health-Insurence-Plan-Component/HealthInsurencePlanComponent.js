import konsole from "../../../../control/Konsole";
import { $AHelper } from "../../../../control/AHelper";
import HIPClientComponent from "./Health-Insurence-Plan-Client-Component/HIPClientComponent";

const HealthInsurencePlanComponent = (props) => {
  const healthInsurence=props.healthInsurence?.data?.data
  const secondhealthInsurance=props.secondhealthInsurance?.data?.data
  let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))
  konsole.log("YTYTYTYTYT",props)
  const sameForSpouse = secondhealthInsurance?.some(ele => ele.userInsuranceId == healthInsurence?.[0]?.userInsuranceId) || false;


  return (
    <div className="contain pt-2">
      <div className="contain paddTop">
        <span className="border-bottom-thin h3 generate-pdf-main-color fs-3">
          Health Insurance Plan
        </span>
      </div>

      <div className="contain">
        <p className="para-p1">
          Please remember to bring a{" "}
          <mark bg-warning text-dark>
            copy of your insurance cards and coverage
          </mark>
          paperwork.
        </p>
      </div>

      <div className="contain">
        <div className="row">
          <div className="col">
            <div className="contain">
              <span className=" clientheading ">
                {$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}
              </span>
            </div>
            {healthInsurence && <HIPClientComponent healthInsurence={healthInsurence} sameForSpouse={sameForSpouse} userNo={1}></HIPClientComponent>}
          </div>
          <div className="col">
            <div className="contain">
              <span className="  clientheading">
                {$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}
              </span>
            </div>
            
            {secondhealthInsurance && <HIPClientComponent healthInsurence={secondhealthInsurance} sameForSpouse={undefined} userNo={2}></HIPClientComponent>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthInsurencePlanComponent;
