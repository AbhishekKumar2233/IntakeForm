import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import ModalHeader from "../ModalHeader";
import { isNotValidNullUndefile } from "../../Reusable/ReusableCom";


const Stepcomplete = ({showModal,setShowstepmodal}) =>{
    const userData = showModal?.data;
    const [allSteps,setAllsteps] = useState([1,2,3,4,5,6,7,8])

    const verticalScroll ={
        maxWeight:"500px",
        overflowX:"auto"
    }
    
    console.log(userData,"userData")
    return(
        <div>
            <Modal size="lg" show={showModal?.show} style={{borderRadius:"50px"}} dialogClassName="rounded-modal">
                <Modal.Header style={{background:"white"}}>
                    <div className="w-100 d-flex justify-content-between p-2">
                        <div className="w-80 d-flex align-items-center">
                            <div>
                            <p className="fs-5">{userData?.memberName} {isNotValidNullUndefile(userData?.spouseName) && `& ${userData?.spouseName}`} <span className="mx-1 px-2 py-1 paralegal-button-active fs-6">{userData?.userRoles[0]?.roleId == 9 ? "LPO" :"Intake"}</span></p>
                            {(userData.isUserActive == true) ? <p className='paralegal-button-inactive py-1 align-items-center'><span className='green-dot mx-1'></span>Client Activated</p> :<p className="d-flex align-items-center mx-1" style={{color:"#c5221f"}}><span className='red-dot mx-1'></span>Client Inactive</p>}
                            </div> 
                        </div>
                        <div className="w-20 d-flex justify-content-end">
                        <button onClick={()=>{setShowstepmodal({show:false,data:null})}} style={{width:'25px',height:'25px',border:'none',background:'none'}}>
                            X
                        </button>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-12 d-flex gap-3" style={verticalScroll} >
                        {allSteps.map((step)=>(
                            <div className="col-4" style={{height:"400px",background:"#F5F5F9",borderRadius:"15px"}}>
                                <p className="m-2 my-3"><span className="circle-design mx-2">{step}</span> Step {step}</p>
                                <hr/>
                                <p className="ps-3">Current status</p>
                                <div>
                                    
                                    <p></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>

            </Modal>
        </div>
    )
}

export default Stepcomplete;
