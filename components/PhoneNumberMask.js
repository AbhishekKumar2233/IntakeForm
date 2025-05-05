import React, { useState, useEffect, useRef } from "react";

const PhoneNumberMask = (props) => {
  const inputCard = useRef();

  const handleChange = () => {
    const cardValue = inputCard.current.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    console.log(cardValue, cardValue[2]);
    inputCard.current.value = !cardValue[2]
      ? cardValue[1]
      : `(${cardValue[1]}) ${cardValue[2]}${`${
          cardValue[3] ? `-${cardValue[3]}` : ""
        }`}${`${cardValue[4] ? `-${cardValue[4]}` : ""}`}`;
    const numbers = inputCard.current.value.replace(/(\D)/g, "");
    props.setValue("phoneNo",numbers);
    // props.setError("phoneNo",{type: "error"})
    props.setClearError('phoneNo');
  };

  useEffect(() => {    
    handleChange()
    props.setError('phoneNo',{type:'error',message:'Cell no is required'})
  }, []);

  return (
    <>
      {/* <input
      className="form-control bg-light fs-6"
      
      id="phoneNumber"
        placeholder="Phone No"
        type="text"
        // ref={inputCard}
        onChange={handleChange}        
      /> */}

      <input
        type="text"
        ref={inputCard}
        onChange={handleChange}
        className="form-control bg-white p-2 fs-5"
        id="phoneNumber"
        placeholder='Enter Cell Number'
      />
    </>
  );
};

export default PhoneNumberMask;