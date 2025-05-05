import React, { useEffect, useState, useContext } from "react"
import { createPortal } from "react-dom"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import TosterComponent from '../components/TosterComponent';
import { globalContext } from "../../pages/_app";

export function ConfirmationToaster({ btnType, open, text, type, tittle, onConfirm, confirm, onCancel, closeConfirm }) {
    const { data, settoasterData, confirmyes, setConfirmyes, handleCloseYes } = useContext(globalContext);
    const [mounted, setMounted] = useState(open)

    console.log("btnTypebtnType", btnType)
    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    useEffect(() => {
        if (open) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [open]);

    function handleClose() {
        setMounted(false)
        onCancel()
        settoasterData({
            open: false,
            text: "",
            type: "",
            tittle: "",
            btnType: 0,
        })
        setConfirmyes(false)

    }
    if (type === "Warning" && btnType != 0) {
        setTimeout(() => {
            handleClose()
        }, 5000)
    }

    const getClassConfirmation = (type) => {
        switch (type) {
            case "Confirmation": return "toaster_P";
            default: return "";
        }
    }

    const imgUrlPhysician = (type) => {
        if (type === "Confirmation") {
            return '/icons/deleteIconP.svg';
        } else if (type == 'Permission') {
            return  '/New/icons/permission.svg';;
        } else {
            return ''
        }
    };

    return (
        <>
            {open && (
                <div id="blurBackground">
                    <div className={`toaster_P ${getClassConfirmation(type)}`}>
                        <div className="toaster-header_P">
                          {imgUrlPhysician(type) &&  <img style={{ marginLeft: "153px" }} src={imgUrlPhysician(type)} alt="Trash Icon" /> }
                            <span className="closePhysician" onClick={() => handleClose()}>&times;</span>
                        </div>
                        <div className="toaster-body">
                            {/* <h3>{type}</h3> */}
                            <h3>{tittle}</h3>
                            <p>{text}</p>
                            <div className="d-flex mt-3">
                                <button className="cancel-btn" onClick={onCancel}>{(btnType == 0) ? "NO" : (btnType == 1) ? "Child and Child's Family tree" : "Cancel"}</button>
                                <button className="delete-btn" onClick={onConfirm}>{(btnType == 0) ? "YES" : (btnType == 1) ? "Only Child" :(btnType==3)?'Confirm': "Delete"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>)
}
