// src/AnimatedNumber.js
import React, { useEffect, useState } from 'react';
// import './AnimatedNumber.css';

const AnimatedNumber = ({ value }) => {
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    if (value !== prevValue) {
      setPrevValue(value);
    }
  }, [value, prevValue]);

  const numberString = value.toString();
  const prevNumberString = prevValue.toString();

  const lengthDifference = numberString.length - prevNumberString.length;
  const firstPart = lengthDifference > 0 ? numberString.slice(0, lengthDifference) : numberString.slice(0, -1);
  const lastPart = numberString.slice(-1);

  return (
    <div className="number-container h-100" >
      <span className="static-number">{firstPart}</span>
      <span key={lastPart} className="animated-number" >{lastPart}</span>
    </div>
  );
};

export default AnimatedNumber;
