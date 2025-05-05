import React, { useState } from 'react'
import { Card, Container, Form } from 'react-bootstrap';
import { $AHelper } from '../control/AHelper';
import konsole from '../control/Konsole';
import AddDeceasedIncapacitited from './AddDeceasedIncapacitited';

const DeceasedList = ({ deceasedList, handleEditFun,handleDeleteFun }) => {
    const [showScreen, setShowScreen] = useState(false)


    // $Service_Url.deletememberchild + userIdd + "/" + memberIdd + "/" + deletedBy + "/" + memberRelationshipId + "/" + IsDeleteDescendant, '',
    const dotIterate = (length) => {
        let dot = "";
        let i = 1;
        while (i <= length) {
            dot += ".";
            i++;
        }
        return <p className="fs-1">{dot}</p>;
    }
    const returnNamewithoutdas = (value) => {
        if (value.includes("-")) {
            let valuedata = value.split("-");
            valuedata.shift();
            return valuedata.join();
        } else {
            return value;
        }
    };
    const mapDeceasedIncapacitedList = (item, index) => {
        konsole.log('itemitemitemitemitem', item)
        const { relationshipName, dob, fName, lName, dateOfDeath, dateOfWedding, isFiduciary, isBeneficiary } = item;

        return (
            <> <div className={"m-0 pb-2 pt-2 cardSize d-flex align-items-center"} >
                {dotIterate(3)}
                <div className="d-flex align-items-between flex-column justify-content-between  member-card p-2 m-0" style={{ height: '12rem' }}>
                    <div className="row mb-2 w-100">
                        <div className="flex-shrink-0 col-4 p-0 ps-3">
                            <img src="/icons/ProfilebrandColor2.svg" className="w-75" style={{ marginTop: "3px" }} alt="user" />
                        </div>
                        <div className=" editpr-file col-8 p-0 position-relative">
                            <div className="position-absolute top-0 end-0">
                                <span className="text-primary" style={{ textDecoration: "underline", cursor: 'pointer' }} onClick={()=>handleDeleteFun(item)} >
                                    <img src="/icons/deleteIcon.svg" alt="deleteicon" />
                                </span>
                            </div>
                            {(relationshipName) &&
                                <div className="d-flex justify-content-start align-items-start ">
                                    <p className="relationBold">{relationshipName.split(" ").slice(1)}</p>
                                </div>
                            }
                            <div className="d-flex justify-content-between ">
                                <p className="relationBold me-2 text-truncate" > {returnNamewithoutdas(fName)} {" " + lName} </p>
                            </div>
                        </div>
                    </div>
                    {(dob) && <div className="d-flex justify-content-start align-items-start">
                        <p> <span className='fw-bold'>DOB : </span>{" "} {$AHelper.dateFomratShow(dob)}</p>
                    </div>}
                    {(dateOfDeath) && <div className="d-flex justify-content-start align-items-start">
                        <p> <span className='fw-bold'>DOD : </span>{" "} {$AHelper.dateFomratShow(dateOfDeath)}</p>
                    </div>}
                    {/* <div className='d-flex justify-content-start align-item-start'>
                        <Form.Check className="form-check-smoke" type="checkbox" id="checkbox1" label="Fiduciary" checked={isFiduciary} disabled />
                        <Form.Check className="form-check-smoke ms-4" type="checkbox" id="checkbox1" label="Beneficiary" checked={isBeneficiary} disabled />
                    </div> */}
                    <a className="text-primary text-end" style={{ textDecoration: "underline" }} onClick={() => handleEditFun(item)}>Edit</a>
                </div>
            </div>
            </>
        )
    }

    return (
        <>
            <div className="bg-white min-vh-50" id="DeceasedListId">
                <Container className='info-details'>
                    <div className="person-content dotvertical p-0 ">
                        {(deceasedList.length > 0) ?
                            <div className='d-flex justify-content-start' style={{ overflowX: 'auto' }}>
                                {deceasedList.map((item, index) => {
                                    return mapDeceasedIncapacitedList(item, index)
                                })}
                            </div>
                            : null}
                    </div>
                </Container>
            </div>
        </>

    )
}

export default DeceasedList