import React, { useEffect, useState, useContext } from "react"
import { createPortal } from "react-dom"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import TosterComponent from '../components/TosterComponent';
import { globalContext } from "../pages/_app"
// import konsole from "./control/Konsole";

export function Portal({ btnType, open, text, type, onConfirm, confirm, onCancel, closeConfirm }) {
   const { data, setdata, confirmyes, setConfirmyes, handleCloseYes, onCustomResp } = useContext(globalContext);
   const [mounted, setMounted] = useState(open)

   // console.log("btnTypebtnType", btnType)
   useEffect(() => {
      setMounted(true)
      return () => setMounted(false)
   }, [])

   function handleClose() {
      setMounted(false)
      setdata({
         open: false,
         text: "",
         type: "",
         btnType: 0,
      })
      setConfirmyes(false)

   }
   if (type === "Warning" && btnType != 0 && btnType != "custom") {
      setTimeout(() => {
         handleClose()
      }, 5000)
   }
   return open
      ? createPortal(<h1 >
         <Modal show={open}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px", zIndex: "" }}
            backdrop="static"
         >
            <Modal.Body className='mt-0 ms-0 zindex' style={{ borderRadius: "10px" }}>
               <Modal.Title closeButton id="contained-modal-title-vcenter" className='border-0 d-flex justify-content-between'>
                  <div className="w-100">
                     {type === "Confirmation" ? <img src="\images\confirm.png" width="30px" /> : type === "Success" ? <img src="\images\success2.png" width="30px" /> : type === "Warning" ? <img src="\images\warning.png" width="30px" /> : null} <span  className="ms-2 fw-bold fs-4 mt-5">{type}</span>
                     {/* <h4 className='ms-2 mt-2'><b>{type}</b></h4> */}
                  </div>
                  <button type="button" className="btn-close bt" aria-label="Close" onClick={() => btnType === "custom" ? onCustomResp(false) : handleClose()}></button>
               </Modal.Title>



               <p className='ms-5 mt-2 mb-2' style={{ fontSize: "16px" }}>
                  {text}
               </p>

               {type === "Warning" || type === "Success" ? <Button className='config-button  w-40 pt-1 text-center ms-2'
                  onClick={closeConfirm}
                  style={{ backgroundColor: "#720C20", border: "2px solid #720C20", float: "right", textAlign: "center", width: "60px" }}>OK</Button> :
                  <>
                     {(btnType == 0) ? <>
                        <Button className='config-button w-40  text-center ms-2' onClick={onCancel} style={{ border: "1px solid #720C20", backgroundColor: "white", color: "#720C20", float: "right",padding:"6px 16px",borderRadius:"3px" }}>NO</Button>
                        <Button className='config-button  w-40  text-center ' onClick={onConfirm} style={{ backgroundColor: "#720C20", border: "1px solid #720C20", float: "right", textAlign: "center",padding:"6px 13px",borderRadius:"3px"}}>YES</Button>
                     </> : (btnType === "custom") ? <>
                        {data?.btnOptions?.map(ele => {
                           return (ele?.value === true) ? 
                              <Button className='config-button  w-40 text-center mt-3' onClick={() => onCustomResp(ele?.value)} style={{ backgroundColor: "#720C20", border: "2px solid #720C20", float: "right", textAlign: "center",}}>{ele?.label}</Button>
                              :
                              <Button className='config-button w-40 text-center ms-2 mt-3' onClick={() => onCustomResp(ele?.value)} style={{ border: "2px solid #720C20", backgroundColor: "white", color: "#720C20", float: "right", }}>{ele?.label}</Button>
                        })}
                     </> : <>
                        <Button className='config-button w-40 pt-1 text-center ms-2' onClick={onCancel} style={{ border: "2px solid #720C20", backgroundColor: "white", color: "#720C20", float: "right", width: "200px" }}> Child and Child's Family tree </Button>
                        <Button className='config-button  w-40 pt-1 text-center ' onClick={onConfirm} style={{ backgroundColor: "#720C20", border: "2px solid #720C20", float: "right", textAlign: "center", width: "150px" }}>Only Child </Button>
                     </>}
                  </>}

            </Modal.Body>
         </Modal>
      </h1>,
         document.querySelector("#myportal"))
      : null
}



