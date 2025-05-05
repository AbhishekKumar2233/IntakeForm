import Accordion from 'react-bootstrap/Accordion';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import React, { useMemo } from 'react';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import { CustomHeaderTile } from './CustomHeaderTile';
import { CustomeSubTitleWithEyeIcon } from './CustomHeaderTile';
import { $AHelper } from '../Helper/$AHelper';

export const CustomAccordion = React.memo((props) => {
  const { activeKeys, allkeys, isExpendAllbtn, children, activekey } = props;
  const {primaryDetails} = usePrimaryUserId()

  // @@ Expend All 
  const handleToggleAll = () => {
    let value = activeKeys.length == allkeys.length ? [] : allkeys
    props?.handleActiveKeys(value);
  };

  const imgUrl = useMemo(() => {
    const imgUrl = activeKeys?.length != allkeys?.length ? '/New/icons/acordianExpend2.svg' : '/New/icons/expendAllAcordian.svg'
    return imgUrl;
  }, [activeKeys, allkeys])
  return (
    <>

      {(props?.refrencePage == 'PersonalInformation') ? <>

        <Row>
          <div className='col-7'>
            <span className='d-flex'> <h1 className='heading-of-sub-side-links'>Personal Information</h1> 
            {/* {(props?.isJointAccount == true && (primaryDetails?.maritalStatusId == 1 || primaryDetails?.maritalStatusId == 2)) &&   <div class="linkedAccountButton">
              <p key={'account linked'}>LINKED ACCOUNT</p>
            </div>} */}
            </span>
            <p className='heading-of-sub-side-links-2'>View and edit your personal information here.</p>
          </div>
          <div className='col-4 d-flex justify-content-end'>
            <CustomHeaderTile {...props?.obj}> </CustomHeaderTile>
          </div>
          <div className='col-1 d-flex justify-content-end align-items-start'>
            <img style={{ cursor: 'pointer' }} className="allAccordionCloseButton" onClick={handleToggleAll} src={imgUrl} alt='accordion' />
          </div>
        </Row>
      </> : (isExpendAllbtn == true) ? <>

        <Row className='heading'>
          <Col>
            {props?.header}
          </Col>
          <Col className="d-flex justify-content-end mt-1">
            <img style={{ cursor: 'pointer', zIndex:"1" }} className='allAccordionCloseButton' onClick={handleToggleAll} src={imgUrl} alt='accordion' />
          </Col>
        </Row>
      </> : ""}

      <Accordion activeKey={activekey} className="custom-accordion mt-1 mt-1">
        {children}
      </Accordion>
    </>
  );
});

export const CustomAccordionBody = React.memo((props) => {
  const { children, name, eventkey, isSideContent } = props;

  const handleToggle = (key) => {
    props?.setActiveKeys(prevActiveKeys =>
      prevActiveKeys.includes(key)
        ? prevActiveKeys.filter(activeKey => activeKey !== key)
        : [...prevActiveKeys, key]
    );

    $AHelper.$scrollToElement(".allAccordionCloseButton", 100);

    if (props?.onClick) {
      props.onClick(key)
    }
  };

  return (
    <div id='Custom-Accordian' className='Custom-Accordian mt-1'>
      <Accordion.Item eventKey={eventkey}>
        <Accordion.Header onClick={() => handleToggle(eventkey)}>{name}
          {props?.isHeader == true && <>
            <CustomeSubTitleWithEyeIcon title={''} sideContent={props?.header} />
          </>}
        </Accordion.Header>
        <Accordion.Body>
          {children}
        </Accordion.Body>
      </Accordion.Item>

    </div>
  );
});


export const CustomAccordionEye = React.memo((props) => {
  const { children, name, eventkey, isSideContent } = props;

  const handleToggle = (key) => {
    props?.setActiveKeys(prevActiveKeys =>
      prevActiveKeys.includes(key)
        ? prevActiveKeys.filter(activeKey => activeKey !== key)
        : [...prevActiveKeys, key]
    );

    if (props?.onClick) {
      props.onClick(key)
    }
  };

  return (
    <div id='Custom-Accordian' className='Custom-Accordian mt-1'>
      <Accordion.Item eventKey={eventkey}>
        <Accordion.Header onClick={() => handleToggle(eventkey)}>{name}
          {isSideContent && <OverlayTrigger className="ms-3 numnumnum" placement="bottom" overlay={<Tooltip id='CustomAccordianEye'>{isSideContent}</Tooltip>}>
            <img src="/New/icons/iIconInfo.svg" width="15px" height="auto" className="p-0 mt-1" alt="Information" /></OverlayTrigger>}
        </Accordion.Header>
        <Accordion.Body>
          {children}
        </Accordion.Body>
      </Accordion.Item>

    </div>
  );
});
