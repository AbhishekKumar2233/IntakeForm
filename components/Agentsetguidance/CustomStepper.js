import React, { useState } from "react";

const CustomStepper = ({setStepperNo,stepperNo}) => {
  // const [activeStep, setActiveStep] = useState(0);
 let activeStep=stepperNo

  const steps = [
    {text:'Immediate Actions',imgRed:"Immediateactionred.svg",imgWhite:"Immediateactionwhite.svg"}, {text:'Notify',imgRed:"Notifyred.svg",imgWhite:"Notifywhite.svg"}, {text:'Special Instructions',imgRed:"Specialinstructionsred.svg",imgWhite:"Specialinstructionswhite.svg"},{text:'Agent Guidance',imgRed:"Agent'sguidancered.svg",imgWhite:"Agent'sguidancewhite.svg"}
  ];

  const handleClick = (step) => {
    setStepperNo(step)
  };

  return (
    <div className="container-old agentIllness">
    <div className="custom-stepper-old d-flex flex-wrap">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <div className={`line-old ${activeStep >= index ? "lineColor-old" : ""}`} />
          )}
          <div className="stepper-container-old">
            <div className={`steps-old ${ activeStep === index ? "active" : activeStep > index ? "darkColor" : ""}`}
              onClick={() => handleClick(index)}
            >
              { (activeStep <= index) && activeStep === index  ? <img style={{height:"18px",width:"18px",marginTop:"0px"}} src={step?.imgWhite}></img>:activeStep > index ? "" : <img style={{height:"18px",width:"18px",marginTop:"0px"}} src={step?.imgRed}></img>}
            </div>
            <div className="fs_Agent">
          {step?.text}
          </div>
          </div>
        </React.Fragment>
      ))}
    </div>
    </div>
  );
};

export default CustomStepper;
