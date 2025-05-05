import React, { useContext, useEffect, useRef, useState } from "react";
import IllnessImmedicateActions from "./IllnessImmedicateActions";
import MentalHealthImmediacteActions from "./MentalHealthImmedicateActions";
import EolimmediateActions from "./EolilmmediateActions";
import DeathImmediateActions from "./DeathImmediateActions";
import AdditionalInformations from "./AdditionalInformations";
import HealthAlerts from "./HealthAlerts";
import Longtermcareprefrences from "./Longtermcareprefrences";
import LongTermCareFund from "./LongTermFund";
import { CustomAccordion, CustomAccordionBody } from "../../Custom/CustomAccordion";
import { Row } from "react-bootstrap";
import { CustomButton, CustomButton2 } from "../../Custom/CustomButton";
import  BurialHorCemetry  from '../../Legal-Information/BurialHorCemetry/BurialHorCemetry';
import { globalContext } from "../../../pages/_app";

const HealthMain = ({section,step,userId,setSection,setStep,setActiveModule,healthguidanceArray}) => {
    const allkeys = ["0", "1", "2"]
    const [activeKeys, setActiveKeys] = useState("0");
    const longtermcareprefrenceRef = useRef(null)
    const mentalhealthRef = useRef(null)
    const endoflifeRef = useRef(null)
    const deathRef = useRef(null)
    const healthAlertRef = useRef(null)
    const additionalInforRef = useRef(null)
    const { setWarning } = useContext(globalContext)

    useEffect(()=>{
        setActiveKeys('0')
    },[section])


    useEffect(()=>{
        setActiveKeys((step - 1).toString())
        console.log((step - 1).toString(),"steptoString")
    },[step])
    

    const handleAccordionClick = () => {
        setActiveKeys(prevKeys => (prevKeys?.length == 0 ? allkeys : []));
    };

    const handleAccordionBodyClick = (key) => {
        setActiveKeys(prevKeys => (prevKeys?.includes(key) ? [] : [key]));
    };

    const submitData = async (type) => {

        if(section == 1){
            await longtermcareprefrenceRef?.current?.postUseragentfunc()
        }else if(section == 2){
            await mentalhealthRef?.current?.submitData()
        }else if(section == 3){
            await endoflifeRef?.current?.submitData()
        }else{
            let _result = await deathRef?.current?.saveData()
            if(_result == false){
                setWarning('warning','Please enter the valid details.')
                return;
            }
        }

        await healthAlertRef?.current?.submitData()
        await additionalInforRef?.current?.SubmitData('')

        if(section != 4){
            await setWarning("successfully", "Successfully saved data", `Your data have been saved successfully.`);
        }
        
        if(type == 'next'){
            if(section == 4){
                setActiveModule(2)
                return;
            }
            setSection(section + 1)
            setStep(1)
        }
        
    }

    return(
        <div className="health-main pt-0" >
        
        <CustomAccordion isExpendAllbtn={true} activekey={activeKeys} handleActiveKeys={handleAccordionClick} activeKeys={1} allkeys={activeKeys} >
        {section > 0 && <CustomAccordionBody eventkey='0' name={section == 1 ? healthguidanceArray[section - 1]?.name +" - " +"Care Preferences" : healthguidanceArray[section - 1]?.name +" - " + "Immediate Actions"} setActiveKeys={() => handleAccordionBodyClick('0')}>
            {section == 1 && <Longtermcareprefrences userId={userId} setStep={setStep} setActiveModule={setActiveModule} setSection={setSection} ref={longtermcareprefrenceRef} />}
            {section == 2 && <MentalHealthImmediacteActions userId={userId} setSection={setSection} setStep={setStep} ref={mentalhealthRef} />}
            {section == 3 && <EolimmediateActions userId={userId} setSection={setSection} setStep={setStep} ref={endoflifeRef} />}
            {/* {section == 4 &&  <DeathImmediateActions userId={userId} setSection={setSection} setStep={setStep} ref={deathRef} />} */}
            {section == 4 && <BurialHorCemetry referencePage="agentdeathinfopage" userId={userId} ref={deathRef} /> }
            <br /></CustomAccordionBody>}
            
            {section == 1 && <CustomAccordionBody eventkey='1' name={healthguidanceArray[section - 1]?.name +" - " + "Care Funding"} setActiveKeys={() => handleAccordionBodyClick('1')}>
            <LongTermCareFund userId={userId} setSection={setSection} setStep={setStep} section={section} step={step} />
            <br/>
            </CustomAccordionBody>}
            <CustomAccordionBody eventkey='2' name={ healthguidanceArray[section - 1]?.name +" - " + `Alerts`} setActiveKeys={() => handleAccordionBodyClick('2')}>
            {<HealthAlerts userId={userId} setSection={setSection} setStep={setStep} section={section} step={step} ref={healthAlertRef} />}
            <br/>
            </CustomAccordionBody>
            <CustomAccordionBody eventkey='3' name={ healthguidanceArray[section - 1]?.name +" - " + "Additional Information"} setActiveKeys={() => handleAccordionBodyClick('3')}>
            {<AdditionalInformations userId={userId} setSection={setSection} setStep={setStep} section={section} setActiveModule={setActiveModule} ref={additionalInforRef} />}
            <br/>
            </CustomAccordionBody>
            </CustomAccordion>

            <div className="d-flex justify-content-between mt-3">
                <CustomButton2 label="Save and Continue later" onClick={()=> submitData()} />
                <CustomButton label={section == 4 ? 'Next: Finance' : `Next: ${healthguidanceArray[section]?.name}`} onClick={()=>{submitData('next')}} />
            </div>
        </div>
    )
}
export default HealthMain;