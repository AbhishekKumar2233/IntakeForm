import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Button, Form, Row, Col, Table, Card, Container } from "react-bootstrap";
import NotFound from './Not-Found';
import { isNotValidNullUndefile } from '../../Reusable/ReusableCom';
import konsole from '../../control/Konsole';

const LivingWillDetailsCe = ({ jsonObj }) => {
    const { userName, spouse, userLivingWills, allergies } = jsonObj;
    konsole.log(spouse?.allergies, "spouse?.allergies")
    const primaryAllergies = isNotValidNullUndefile(allergies) ? true : false;
    const spouseAllergies = isNotValidNullUndefile(spouse?.allergies) ? true : false;
    console.log("userLivingWills", userLivingWills)
    return (
        <>
            <hr />
            <p className='fw-bold'>Living Will Details</p>
            {userLivingWills?.length > 0 ?
                <div className='border rounded p-2'>

                    <b>
                        <DisplayLivingWillData question='' Ans1={userName} Ans2={spouse?.personName} spouseDetails={spouse} />
                    </b>

                    <div className='m'>
                        {userLivingWills?.map((item, index) => {
                            const spouseAnswer = spouse?.userLivingWills.find(i => i.subjectId === item.subjectId)?.answer;

                            const answerOptions = (item.subjectId == 52) ? 'Yes' : 'Do Want';
                            const answerOptions2 = (item.subjectId == 52) ? 'No' : "Don't Want";
                            let ans1 = (item?.answer == 'true' || item?.answer == 'True') ? answerOptions : (item.answer == 'false' || item.answer == 'False') ? answerOptions2 : '-';
                            let ans2 = (spouseAnswer == 'true' || item?.answer == 'True') ? answerOptions : (spouseAnswer == 'false' || item.answer == 'False') ? answerOptions2 : '-';

                            return (
                                <React.Fragment key={index}>
                                    <DisplayLivingWillData question={item.question} Ans1={ans1} Ans2={ans2} spouseDetails={spouse} />
                                    {item.subjectId === 52 &&
                                        <DisplayLivingWillData
                                            question={'I want life support withdrawn'}
                                            Ans1={ans2 === 'Yes' ? 'No' : ans2 === 'No' ? 'Yes' : '-'}
                                            Ans2={ans1 === 'Yes' ? 'No' : ans1 === 'No' ? 'Yes' : '-'}
                                            spouseDetails={spouse}
                                        />
                                    }
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
                : <span className='mt-4'><NotFound /></span>}

            <><hr />
                <p className='fw-bold'>Allergies Details</p>

                {(primaryAllergies == true || spouseAllergies == true) ? <>
                    <div className='border rounded p-2'>
                        <b>
                            <DisplayLivingWillData question='' Ans1={userName} Ans2={spouse?.personName} spouseDetails={spouse} />
                        </b>


                        <div className='m'>
                            <DisplayLivingWillData question='Are you allergic to any medications?' Ans1={primaryAllergies ? 'Yes' : '-'} Ans2={spouseAllergies ? 'Yes' : '-'} spouseDetails={spouse} />
                            <DisplayLivingWillData question='Which medications?' Ans1={primaryAllergies ? allergies : '-'} Ans2={spouseAllergies ? spouse?.allergies : '-'} spouseDetails={spouse} />
                        </div>

                    </div></>
                    : <span className='mt-4'><NotFound /></span>}
            </>
        </>


    );
};



const DisplayLivingWillData = ({ question, Ans1, Ans2, spouseDetails }) => {
    return <>
        <Row>
            <Col md={6} className=''>{question}</Col>
            <Col md={6} className=''>
                <Row>
                    <Col md={6} className='mt-1 mb-1 text-center'> {Ans1} </Col>
                    {spouseDetails?.userLivingWills?.length > 0 &&
                        <Col md={6} className='mt-1 mb-1 text-center'>{Ans2}</Col>
                    }
                </Row>
            </Col>
        </Row></>
}
export default LivingWillDetailsCe;
