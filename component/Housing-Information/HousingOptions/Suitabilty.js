import React from "react";
import { CustomInput, CustomRadio, CustomRadioAndCheckBox } from "../../Custom/CustomComponent";
import { Button, Col, Row } from "react-bootstrap";
import konsole from "../../../components/control/Konsole";
import { isNotValidNullUndefile, postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";


const Suitabilty = ({ formlabelData, setFormlabelData, updateCaregiverSuitability, isSideContent, startTabIndex }) => {

    const startingTabIndex = startTabIndex ?? 0;




    const handleChange = (e, item, labelNo) => {
        const eventId = item?.responseId;
        const eventValue = item?.response;
        konsole.log("ResponseResponse", eventValue, eventId)

        let updatedResponses = formlabelData[labelNo].response?.map((ele) => ({
            ...ele,
            checked: ele.responseId == eventId ? true : false
        })) || [];
        setFormlabelData(prevState => ({
            ...prevState,
            [labelNo]: {
                ...prevState[labelNo],
                response: updatedResponses
            }
        }));
    };

    // const handleInputChange = (val, labelNo) => {
    //     konsole.log("dataResponseResponse", formlabelData[labelNo]);
    //     let updatedResponses = formlabelData[labelNo].response?.map((ele) => ({
    //         ...ele,
    //         response: val
    //     }))
    //     setFormlabelData(prevState => ({
    //         ...prevState,
    //         [labelNo]: {
    //             ...prevState[labelNo],
    //             response: updatedResponses
    //         }
    //     }));
    // }


    return (

        <>
            <Row className="d-flex justify-content-start">
                <Col xs={12} md={12} xl={3}><p className="heading-of-sub-side-links-3">{isSideContent}</p></Col>
                <Col className="mt-1" xs={12} md={12} xl={9}>
                    <Row className="spacingBottom" >
                        <div className="careGiver">
                            <h3>{formlabelData.label343?.question}</h3>
                        </div>
                        <Col xs={12} md={12} className="mt-1 ms-2  ps-1">
                            {formlabelData?.label343?.question &&
                                <>
                                    <CustomRadioAndCheckBox
                                        tabIndex={startingTabIndex + 1}
                                        name="comfirtable"
                                        type="checkbox"
                                        value={formlabelData?.label343?.response?.filter((ele) => ele?.checked)}
                                        options={formlabelData.label343?.response.map((ele) => ele)}
                                        onChange={(e, item, index) => handleChange(e, item, 'label343')}
                                    />
                                </>}
                        </Col>
                    </Row>

                    <Row className="spacingBottom">
                        <div className="careGiver">
                            <h3>{formlabelData?.label342?.question}</h3>
                        </div>
                        {konsole.log(formlabelData, "datadatadatadatadata")}
                        <Col xs={12} md={12} className="mt-1 ms-2  ps-1">
                            {formlabelData?.label342?.question &&
                                <>
                                    <CustomRadioAndCheckBox
                                        tabIndex={startingTabIndex + 2}
                                        name="caregiver"
                                        type="checkbox"
                                        value={formlabelData?.label342?.response?.filter((ele) => ele?.checked)}
                                        options={formlabelData.label342?.response.map((ele) => ele)}
                                        onChange={(e, item, index) => handleChange(e, item, 'label342')}
                                    />
                                </>
                            }
                        </Col>
                    </Row>

                  

                </Col>
            </Row>
        </>
    )
}
export default Suitabilty;