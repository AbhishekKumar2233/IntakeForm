import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { CustomFootInput, CustomInput, CustomNumInput, CustomRadio, CustomRadioAndCheckBox, CustomSelect } from "../../Custom/CustomComponent";
import konsole from "../../../components/control/Konsole";
import { getApiCall, isNotValidNullUndefile, postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";


const CurrentResidence = ({ formlabelData, setFormlabelData, isSideContent, startTabIndex }) => {

  const startingTabIndex = startTabIndex ?? 0;



  const handleChange = (e, item, labelNo) => {
    const eventId = labelNo == 'label332' ? item.value : item?.responseId;
    const eventValue = labelNo == 'label332' ? item.label : item?.response;
    konsole.log("anfajData", labelNo, item, eventValue, eventId)

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

  const handleInputChange = (val, labelNo) => {
    konsole.log("inputResponse", formlabelData[labelNo]);
    let updatedResponses = formlabelData[labelNo].response?.map((ele) => ({
      ...ele,
      response: val
    }))
    setFormlabelData(prevState => ({
      ...prevState,
      [labelNo]: {
        ...prevState[labelNo],
        response: updatedResponses
      }
    }));
  }


  konsole.log(formlabelData, "dataformLableData");



  konsole.log(formlabelData.label330 != undefined, formlabelData.label330 != undefined &&
    formlabelData?.label330?.question, "dataformLableData", formlabelData)


  return (

    <>
      <Row className="d-flex justify-content-start">
        <Col xs={12} md={12} xl={3}><p className="heading-of-sub-side-links-3">{isSideContent}</p></Col>
        <Col className="" xs={12} md={12} xl={9}>
          <Row className="spacingBottom gapNoneCurrentResidance">
            <Col xs={12} md={6} lg={5}>
              {isNotValidNullUndefile(formlabelData.label330) &&
                Array.isArray(formlabelData?.label330?.response) &&
                formlabelData?.label330?.response?.length > 0 &&
                formlabelData?.label330?.response?.map((response) => {
                  return (
                    <CustomNumInput
                      tabIndex={startingTabIndex + 1}
                      key={response.responseId}
                      label={formlabelData?.label330?.question}
                      placeholder="Enter year"
                      id={response.responseId}
                      value={response?.response}
                      onChange={(val) => handleInputChange(val, 'label330')}
                    />
                  );
                })}
            </Col>


            <Col xs={12} md={6} lg={5}>
              {isNotValidNullUndefile(formlabelData.label336) &&
                Array.isArray(formlabelData?.label336?.response) &&
                formlabelData?.label336?.response?.length > 0 &&
                formlabelData?.label336?.response?.map(
                  (response) => {
                    return (
                      <>
                        <CustomInput
                          tabIndex={startingTabIndex + 2}
                          notCapital={true}
                          key={response.responseId}
                          label={formlabelData?.label336?.question}
                          placeholder="Enter number"
                          id={response.responseId}
                          value={response?.response}
                          onChange={(val) => handleInputChange(val, 'label336')}
                        />
                      </>
                    )
                  }
                )}
            </Col>
          </Row>
          <Row className="spacingBottom gapNoneCurrentResidance">
            <Col xs={12} md={6} lg={5}>
              {isNotValidNullUndefile(formlabelData.label331) &&
                Array.isArray(formlabelData?.label331?.response) &&
                formlabelData?.label331?.response?.length > 0 &&
                formlabelData?.label331?.response?.map(
                  (response) => {
                    return (
                      <>
                        <CustomFootInput
                          tabIndex={startingTabIndex + 3}
                          notCapital={true}
                          key={response.responseId}
                          label={formlabelData?.label331?.question}
                          placeholder="Enter number"
                          id={response.responseId}
                          value={response?.response}
                          onChange={(val) => handleInputChange(val, 'label331')}
                        />
                      </>
                    )
                  }
                )}
            </Col>
            <Col xs={12} md={6} lg={5}>
              {isNotValidNullUndefile(formlabelData.label340) &&
                Array.isArray(formlabelData.label340.response) &&
                formlabelData.label340.response.length > 0 &&
                formlabelData.label340.response?.map(
                  (response) => {
                    return (
                      <>
                        <CustomFootInput
                          tabIndex={startingTabIndex + 4}
                          notCapital={true}
                          key={response.responseId}
                          label={formlabelData?.label340?.question}
                          placeholder="Enter number"
                          id={response.responseId}
                          value={response?.response}
                          onChange={(val) => handleInputChange(val, 'label340')}
                        />
                      </>
                    )
                  }
                )}
            </Col>
          </Row>
          <Row className="spacingBottom gapNoneCurrentResidance">
            <Col xs={12} md={6} lg={5}>
              {isNotValidNullUndefile(formlabelData.label332) && (
                <CustomSelect
                  tabIndex={startingTabIndex + 5}
                  label={formlabelData?.label332?.question}
                  options={formlabelData?.label332?.response?.map((item) => { return { 'label': item?.response, value: item?.responseId } })}
                  placeholder="Select number"
                  id="stories"
                  value={formlabelData?.label332?.response.filter((item) => item.checked == true)[0]?.responseId}
                  onChange={(val) => handleChange(val, val, 'label332')}
                />
              )}
            </Col>
            <Col xs={12} md={6} lg={5}>
              {isNotValidNullUndefile(formlabelData.label341) &&
                Array.isArray(formlabelData?.label341?.response) &&
                formlabelData?.label341?.response?.length > 0 &&
                formlabelData?.label341?.response?.map(
                  (response) => {
                    return (
                      <>
                        <CustomFootInput
                          tabIndex={startingTabIndex + 6}
                          notCapital={true}
                          key={response.responseId}
                          label={formlabelData?.label341?.question}
                          placeholder="Enter number"
                          id={response.responseId}
                          value={response?.response}
                          onChange={(val) => handleInputChange(val, 'label341')}
                        />
                      </>
                    )
                  }
                )}
            </Col>
          </Row>
          <Row className="spacingBottom gapNoneCurrentResidance">
            <Col xs={12} md={6} lg={5} className="">
              {isNotValidNullUndefile(formlabelData.label337) &&
                Array.isArray(formlabelData?.label337?.response) &&
                formlabelData?.label337?.response?.length > 0 &&
                formlabelData?.label337.response?.map(
                  (response) => {
                    return (
                      <>
                        <CustomInput
                          tabIndex={startingTabIndex + 7}
                          notCapital={true}
                          key={response.responseId}
                          label={formlabelData.label337?.question}
                          placeholder="Enter number"
                          onChange={(val) => handleInputChange(val, 'label337')}
                          id={response.responseId}
                          value={response?.response}
                        />
                      </>
                    )
                  }
                )}
            </Col>
            <Col xs={12} md={6} lg={5}>
              {isNotValidNullUndefile(formlabelData.label338) &&
                Array.isArray(formlabelData?.label338?.response) &&
                formlabelData?.label338?.response?.length > 0 &&
                formlabelData?.label338.response.map(
                  (response) => {
                    return (
                      <>
                        <CustomInput
                          tabIndex={startingTabIndex + 8}
                          notCapital={true}
                          key={response.responseId}
                          label={formlabelData?.label338?.question}
                          placeholder="Enter number"
                          onChange={(val) => handleInputChange(val, 'label338')}
                          id={response.responseId}
                          value={response?.response}
                        />
                      </>
                    )
                  }
                )}
            </Col>
          </Row>
          <Row className="spacingBottom gapNoneCurrentResidance">
            <Col xs={12} md={6} lg={5}>
              {isNotValidNullUndefile(formlabelData.label339) &&
                Array.isArray(formlabelData?.label339?.response) &&
                formlabelData?.label339?.response?.length > 0 &&
                formlabelData?.label339.response?.map(
                  (response) => {
                    return (
                      <>
                        <CustomInput
                          tabIndex={startingTabIndex + 9}
                          notCapital={true}
                          key={response.responseId}
                          label={formlabelData?.label339?.question}
                          placeholder="Enter number"
                          onChange={(val) => handleInputChange(val, 'label339')}
                          id={response.responseId}
                          value={response?.response}
                        />
                      </>
                    )
                  }
                )}
            </Col>
          </Row>

          <Row className="spacingBottom gapNoneCurrentResidance">
            <Col xs={12} md={8} className="">
              {formlabelData.label335?.question &&
                <>
                  <CustomRadioAndCheckBox
                    tabIndex={startingTabIndex + 10}
                    placeholder={formlabelData.label335?.question}
                    type="checkbox"
                    name="splitlevel"
                    value={formlabelData.label335?.response?.filter((ele) => ele?.checked)}
                    options={formlabelData.label335?.response.map((ele) => ele)}
                    onChange={(e, item, index) => handleChange(e, item, 'label335')}
                  />
                </>
              }
            </Col>
          </Row>
          {(formlabelData?.label332?.response.filter((item) => item.checked == true)[0]?.responseId != 58 &&
            formlabelData?.label332?.response.filter((item) => item.checked == true)[0]?.responseId != undefined) ? (
            <>
              <Row className="spacingBottom gapNoneCurrentResidance">
                <Col xs={12} md={6} lg={5}>
                  {isNotValidNullUndefile(formlabelData?.label334) &&
                    Array.isArray(formlabelData?.label334?.response) &&
                    formlabelData?.label334?.response?.length > 0 &&
                    formlabelData?.label334?.response?.map((response) => (
                      <CustomInput
                        tabIndex={startingTabIndex + 11}
                        notCapital={true}
                        key={response.responseId}
                        label={formlabelData?.label334?.question}
                        placeholder="Enter Details"
                        id={response.responseId}
                        value={response?.response}
                        onChange={(val) => handleInputChange(val, 'label334')}
                      />
                    ))}
                </Col>
                <Col xs={12} md={6} lg={5} className="laundary" >
                  {isNotValidNullUndefile(formlabelData?.label333) &&
                    Array.isArray(formlabelData?.label333?.response) &&
                    formlabelData?.label333?.response?.length > 0 &&
                    formlabelData?.label333.response.map((response) => (
                      <CustomInput
                        tabIndex={startingTabIndex + 12}
                        notCapital={true}
                        key={response.responseId}
                        label={formlabelData?.label333?.question}
                        placeholder="Enter number"
                        id={response.responseId}
                        value={response?.response}
                        onChange={(val) => handleInputChange(val, 'label333')}
                      />
                    ))}
                </Col>
              </Row>
            </>
          ) : null}

        </Col>
      </Row>
    </>
  );
};

export default CurrentResidence;
