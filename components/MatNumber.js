import React, { useEffect, useState, useContext } from 'react';
import {Form,Col} from "react-bootstrap";


const MatNumber = ({matNumber,setMatNo,xs,sm,lg}) => {
   const handleChange =(e)=>{
    setMatNo(e.target.value) }

  return (
    <>
    <div>
      <label className='mb-1'>Matter No.</label>  
      <Col xs={xs} sm={sm} lg={lg} className="mb-2 mb-md-0">
    <Form.Control type="text" value={matNumber} placeholder="Enter Your Matter No." id="mat" onChange={(event) => handleChange(event)}/>
     </Col>
    </div>
    </>
  )
}

export default MatNumber



