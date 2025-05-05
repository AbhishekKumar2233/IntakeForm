import React, { useState } from 'react';
import konsole from '../../components/control/Konsole';
// import './Stepper.scss';

const Stepper = ({ currentStep, setCurrentStep, steps }) => {
  // const [currentStep, setCurrentStep] = useState(currentSteps - 1);

  const handleStepClick = (index) => {
    setCurrentStep(index + 1);
  };
  konsole.log(currentStep,"currentStep")

  return (
    <div className="stepper-container mt-4">
      <div className="stepper">
        {steps.map((step, index) => {
          const isActive = index <= currentStep - 1;
          const isCompleted = index < currentStep - 1;
          const isLastStep = index === steps.length - 1;
          return (
            <div
              key={index}
              className={`step ${isActive ? 'active' : ''}`}
            >
              <div className="step-circle">{(currentStep - 1 > index) ? <img className='mt-0 p-0' src="/New/icons/_Step icon base.png" /> : <span className="white-dot"></span>}</div>
              {!isLastStep && (
                <div className={`step-line${isCompleted ? '-active' : ''}`}></div>
              )}
              <div className={`step-title${isActive ? '-active' : ''}`}>{step}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
