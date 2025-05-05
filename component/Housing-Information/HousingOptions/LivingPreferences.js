import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { CustomInput, CustomRadioAndCheckBox, CustomSelect } from "../../Custom/CustomComponent";
import konsole from "../../../components/control/Konsole";
import { useSelector } from "react-redux";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";
import { getApiCall, isNotValidNullUndefile, isNullUndefine, postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import { retirementHousigOp } from "../../../components/control/Constant";
import { $AHelper } from "../../Helper/$AHelper";



const LivingPreferences = ({ formlabelData, setFormlabelData, isSideContent, familyMemberList, startTabIndex }) => {

    const startingTabIndex = startTabIndex ?? 0;





    const handleChange = (e, item, labelNo) => {
        const eventId = labelNo == 'label327' ? item.value : item?.responseId;
        const eventValue = labelNo == 'label327' ? item.label : item?.response;
        konsole.log("anfaj", labelNo, item, eventValue, eventId);

        let updatedResponses =
            formlabelData[labelNo].response?.map((ele) => ({
                ...ele,
                checked: ele.responseId === eventId ? true : false
            })) || [];

        if(labelNo == 'label318') {
            return setFormlabelData((prevState) => ({
                ...prevState,
                [labelNo]: {
                    ...prevState[labelNo],
                    response: updatedResponses,
                },
                ['label327']: {
                    ...prevState['label327'],
                    response: formlabelData['label327'].response?.map(ele => ({
                        ...ele,
                        checked: false
                    })),
                }
            }));
        }
        setFormlabelData((prevState) => ({
            ...prevState,
            [labelNo]: {
                ...prevState[labelNo],
                response: updatedResponses,
            },
        }));
    };

    const handleChange1 = (val, labelNo) => {
        konsole.log("dataResponse", formlabelData[labelNo]);
        let updatedResponses = formlabelData[labelNo].response?.map((ele) => ({
            ...ele,
            response: val,
        }));
        setFormlabelData((prevState) => ({
            ...prevState,
            [labelNo]: {
                ...prevState[labelNo],
                response: updatedResponses,
            },
        }));
    };


    konsole.log(formlabelData, "formlabelData");


    return (
        <>
            <Row className="d-flex justify-content-start">
                <Col xs={12} md={12} xl={3}>
                    <p className="heading-of-sub-side-links-3">{isSideContent}</p>
                </Col>
                <Col className="mt-2" xs={12} md={12} xl={9}>
                    <Row className="spacingBottom">
                        <div className="careGiver">
                            <h3>{formlabelData?.label318?.question}</h3>
                        </div>
                        <Col xs={12} md={12} className="mt-1 ms-2 ps-0">
                            {formlabelData?.label318?.question && (
                                <CustomRadioAndCheckBox
                                   tabIndex={startingTabIndex + 1}
                                    type="checkbox"
                                    name="member"
                                    value={formlabelData.label318?.response?.filter(
                                        (ele) => ele?.checked
                                    )}
                                    options={formlabelData.label318?.response.map((ele) => ele)}
                                    onChange={(e, item, index) =>
                                        handleChange(e, item, "label318")
                                    }
                                />
                            )}
                        </Col>
                    </Row>
                   {formlabelData.label318?.response?.filter((ele) => ele?.checked)[0]?.response != "Not Sure" && <>
                    {formlabelData.label318?.response?.filter((ele) => ele?.checked)[0]?.response == "Yes" || formlabelData.label318?.response?.filter((ele) => ele?.checked)[0]?.response == "Not Sure" ? (
                        <Row className="spacingBottom">
                            <Col xs={12} md={9}>
                            {isNotValidNullUndefile(formlabelData.label327) && (
                            <div className="custom-input-field" id={'label-' + formlabelData.label327?.id}>
                                <p>{formlabelData?.label327?.question}</p>
                                <Col xs={12} md={6} lg={7} >
                                    <CustomSelect
                                        tabIndex={startingTabIndex + 2}
                                        options={formlabelData?.label327?.response?.map((item) => { return { 'label': item?.response, value: item?.responseId } })}
                                        placeholder="Select number"
                                        id="ownhome"
                                        value={formlabelData?.label327?.response?.filter((item) => item.checked == true)[0]?.responseId}
                                        onChange={(val) => handleChange(val, val, 'label327')}
                                    />
                                </Col>
                            </div>
                            )}
                            </Col>
                        </Row>
                    ) : ""}

                    {formlabelData.label318?.response?.filter((ele) => ele?.checked)[0]?.response == "No" ? (
                        <Row className="spacingBottom">
                            <Col xs={12} md={9}>
                                {isNotValidNullUndefile(formlabelData.label320) &&
                                    Array.isArray(formlabelData?.label320?.response) &&
                                    formlabelData?.label320?.response?.length > 0 &&
                                    formlabelData.label320.response?.map((response) => (
                                <div className="custom-input-field" id={'label-' + formlabelData.label320?.id}>
                                    <p>{formlabelData?.label320?.question}</p>
                                    <Col xs={12} md={6} lg={7} >
                                        <CustomInput
                                            notCapital={true}
                                            tabIndex={startingTabIndex + 3}
                                            key={response.responseId}
                                            placeholder="Enter name"
                                            onChange={(val) => handleChange1(val, "label320")}
                                            id={response.responseId}
                                            value={response?.response}
                                        />
                                    </Col>
                                </div>
                                ))}
                            </Col>
                        </Row>
                    ) : ""}

                    <Row className="spacingBottom">
                        <Col xs={12} md={9}>
                        {isNotValidNullUndefile(formlabelData.label321) &&
                                Array.isArray(formlabelData?.label321?.response) &&
                                formlabelData?.label321?.response?.length > 0 &&
                                formlabelData.label321.response?.map((response) => (
                                <div className="custom-input-field" key={response.responseId}>
                                    <p>{formlabelData?.label321?.question}</p>
                                    <Col xs={12} md={7}>
                                    <>
                                    {($AHelper.$isAnyIdOrNot(formlabelData?.label321?.response[0]?.response) || isNullUndefine(formlabelData?.label321?.response[0]?.response)) ?
                                   <CustomSelect
                                       tabIndex={startingTabIndex + 4}
                                       options={familyMemberList?.map((item) => { return { 'label': `${item?.fName} ${item?.lName}`, value: item?.userId } })}
                                       placeholder="Select name"
                                       id="closestRelative"
                                       value={formlabelData?.label321?.response[0]?.response}
                                       onChange={(val) => handleChange1(val?.value, 'label321')}
                                   /> :
                                    <CustomInput
                                        notCapital={true}
                                        tabIndex={startingTabIndex + 5}
                                        placeholder="Enter name "
                                        onChange={(val) => handleChange1(val, "label321")}
                                        id={response.responseId}
                                        value={response?.response}
                                    />}
                                    </>
                                    </Col>
                                </div>
                            ))}
                        </Col>
                    </Row>
                    <Row className="spacingBottom">
                        <Col xs={12} md={9}>
                            {isNotValidNullUndefile(formlabelData.label322) &&
                                Array.isArray(formlabelData?.label322?.response) &&
                                formlabelData?.label322?.response?.length > 0 &&
                                formlabelData.label322.response.map((response) => (
                                <div className="custom-input-field" key={response.responseId}>
                                    <p>{formlabelData?.label322?.question}</p>
                                <Col xs={12} md={7}>
                                    <CustomInput
                                        notCapital={true}
                                        tabIndex={startingTabIndex + 6}
                                        key={response.responseId}
                                        placeholder="Enter name of who is available to help"
                                        id={response.responseId}
                                        value={response?.response}
                                        onChange={(val) => handleChange1(val, "label322")}
                                    />
                                </Col>
                                </div>
                            ))}
                        </Col>
                    </Row>
                    <Row className="spacingBottom">
                        <div className="careGiver">
                            <h3>{formlabelData.label323?.question}</h3>
                        </div>
                        <Col xs={12} md={9} className="ms-2 ps-1">
                            {formlabelData.label323 && (
                                <CustomRadioAndCheckBox
                                    tabIndex={startingTabIndex + 7}
                                    type="checkbox"
                                    value={formlabelData?.label323?.response?.filter(
                                        (ele) => ele?.checked
                                    )}
                                    options={formlabelData.label323?.response.map((ele) => ele)}
                                    onChange={(e, item, index) =>
                                        handleChange(e, item, "label323")
                                    }
                                />
                            )}
                        </Col>
                    </Row>
                    <Row className="spacingBottom">
                        <div className="careGiver">
                            <h3>{formlabelData.label324?.question}</h3>
                        </div>
                        <Col xs={12} md={9} className="ms-2 ps-1">
                            {formlabelData.label324 && (
                                <CustomRadioAndCheckBox
                                    tabIndex={startingTabIndex + 8}
                                    name="condominium"
                                    type="checkbox"
                                    value={formlabelData.label324?.response?.filter(
                                        (ele) => ele?.checked
                                    )}
                                    options={formlabelData.label324?.response.map((ele) => ele)}
                                    onChange={(e, item, index) =>
                                        handleChange(e, item, "label324")
                                    }
                                />
                            )}
                        </Col>
                    </Row>
                    <Row className="spacingBottom">
                        <div className="careGiver">
                            <h3>{formlabelData.label325?.question}</h3>
                        </div>
                        <Col xs={12} md={9} className="ms-2  ps-1">
                            {formlabelData.label325 && (
                                <CustomRadioAndCheckBox
                                    tabIndex={startingTabIndex + 9}
                                    name="lifestyle"
                                    type="checkbox"
                                    value={formlabelData.label325?.response?.filter(
                                        (ele) => ele?.checked
                                    )}
                                    options={formlabelData.label325?.response.map((ele) => ele)}
                                    onChange={(e, item, index) =>
                                        handleChange(e, item, "label325")
                                    }
                                />
                            )}
                        </Col>
                    </Row>
                    <Row className="spacingBottom">
                        <div className="careGiver">
                            <h3>{formlabelData.label326?.question}</h3>
                        </div>
                        <Col xs={12} md={9} className="ms-2  ps-1">
                            {formlabelData.label326 && (
                                <CustomRadioAndCheckBox
                                    tabIndex={startingTabIndex + 10}
                                    name="retirement"
                                    type="checkbox"
                                    value={formlabelData.label326?.response?.filter(
                                        (ele) => ele?.checked
                                    )}
                                    options={formlabelData.label326?.response.map((ele) => ele)}
                                    onChange={(e, item, index) =>
                                        handleChange(e, item, "label326")
                                    }
                                />
                            )}
                        </Col>

                    </Row>
                    </>}
                </Col>
            </Row>
        </>
    );
};

export default LivingPreferences;
