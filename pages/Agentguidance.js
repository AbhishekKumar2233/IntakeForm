import React, { useEffect, useState,useContext } from 'react';
import Layout from '../components/layout';
import { Breadcrumb, Row, Col } from 'react-bootstrap';
import Modal from "react-bootstrap/Modal";
import Router from "next/router";
import SetGuidancehealth from '../components/Agentsetguidance/SetGuidancehealth.js';
import Agent from '../components/Agentsetguidance/Agent';
import Financeguidance from '../components/Agentsetguidance/Financeguidance';
import withAuth from "../components/WithPermisson/withPermisson";
import { globalContext } from './_app.js';
import { accessToFileCabinet } from "../components/control/Constant";

const Agentguidence = () => {

  //define Agents
  const [agents, setAgents] = useState(true);
  const {setPageCategoryId,setPageTypeId,pageTypeId,setPageSubTypeId} = useContext(globalContext)
  const [openguidancemodal, setopenguidancemodal] = useState(false)
  const [guidanceopenpart, setGuidanceOpenPart] = useState('')
  //---------session storage info-----------------------------------
  //   const memberdetails = commonLib.getObjFromStorage("userPrimaryInDetail");

  //functions for handle state  ----------------------------------------------------------------------------------------------

  const handleAgentGuidancebtn = (type) => {
    if(pageTypeId !== 39){
      setPageTypeId(39)
    }
    
  
    setGuidanceOpenPart('')
    setAgents(type)
  }
  const handleOpenguidance = (type) => {
    setGuidanceOpenPart(type)
    setopenguidancemodal(false)
  }

  useEffect(() => {
    setPageTypeId(38)
    const lastPath = sessionStorage.getItem("lastPath");
    if(lastPath?.length) {
      handleAgentGuidancebtn(false);
      setopenguidancemodal(false);
      if(lastPath.includes("health")) {
        setGuidanceOpenPart("Health");
      } else if(lastPath.includes("finance")) {
        setGuidanceOpenPart("Finance");
      }
    }
  }, [])
  const closeModal =()=>{
     setPageTypeId(38) 
    setopenguidancemodal(false); 
    handleAgentGuidancebtn(true); 
  }
  const BcackForWordState =()=>{
    handleAgentGuidancebtn(false)
    setopenguidancemodal(true)
    setPageSubTypeId(null)
  }



  return (
    <>
      <Layout name={'Agent / Guidance'}> 
        <Row className='pt-md-0 pt-2'>
          <Col xs md="9">
            <Breadcrumb>
            
              <Breadcrumb.Item href="#" onClick={() => { Router.push("./dashboard");setPageSubTypeId(null);setPageTypeId(null);setPageCategoryId(null)}} className='ms-1'>Home</Breadcrumb.Item>
              <Breadcrumb.Item className='d-flex'>
                
              <div href="#" style={{ listStyle: 'none' }}  onClick={() => BcackForWordState()}>
              {agents ? 'Agent' : 'Guidance'}{(guidanceopenpart !== '') && ` > ${guidanceopenpart}`}
              </div>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>


        {(guidanceopenpart == '') &&
          <div style={{ display: 'flex' }}>
            <button 
              className={`${agents ? 'borderOnClick border rounded-top border-bottom' : "bg-none  rounded-top border shadow-lg"} d-flex justify-content-center align-items-center gap-2 fw-bold bg-white`} 
              // className={`${agents ? 'borderOnClick  border rounded-top border-bottom ' : ' bg-none  rounded-top border-1 shadow-lg'}  border border-light-subtle  fw-bold   rounded bg-white d-flex gap-2`}
              onClick={() => handleAgentGuidancebtn(true)}
            >
              {/* <Breadcrumb.Item href="#" style={{ listStyle: 'none' }} className='bg-white'> */}
              <div  className='d-flex justify-content-center align-items-center'>
                {agents ? (<><img className=" user-select-auto m-0 p-0"  src="/icons/familyred.png" alt="Set Guidance" />{' '}</>
                ) : (<> <img className="user-select-auto m-0 p-0"  src="/icons/familyNew.png" alt="Set Guidance" /></>)}
              </div>
              <div className='d-flex justify-content-center align-items-center'>
                Agents
                </div>
              {/* </Breadcrumb.Item> */}
            </button>

            <button className="ms-2 border-0   "
              style={
                !agents ? { marginTop: '0', backgroundColor: '#fff', borderRadius: '5px', borderEndEndRadius: '0', borderEndStartRadius: '0', marginBottom: '0', } : { marginTop: '0', backgroundColor: 'transparent' }
              }
              onClick={() => { handleAgentGuidancebtn(false), setopenguidancemodal(true) }}
            >
              <button className={`${!agents ? 'borderOnClick  border-0  mt-0   border-bottom-0 bg-white' : 'mb-2 bg-white  pb-1  border-0'}  fw-bold rounded d-flex  gap-1`} >
               <div>
                {!agents ? (<>  <img className=" user-select-auto"  src="/icons/Group.png" alt="Set Guidance" />{' '} </>
                ) : (<><img className=" me-1  user-select-auto"  src="/icons/business-teamTwo.png" alt="Set Guidance" /></>
                )}
                </div>
                <div className=' mt-2'>
                Set Guidance
                </div>
              </button>
            </button>
          </div>}


        <div style={{ backgroundColor: 'white' }} >
          {(agents == true) ? <>
            {/* Agent Content --------------------------------------------------------------------------------------------- */}
             <Agent />
          </> : <>
            {/* Set Guidance Content----------------------------------------------------------------------------------- */}
            <Modal className="modalsetguidance" show={openguidancemodal}enforceFocus={false} size="lg" centered={true} onHide={() => closeModal()}  >
              <Modal.Header className="modal-header-color">
                <div className="d-flex w-100 justify-content-between  p-0">
                  <span className="center-item-header">Select an option below</span>
                  <button className="btncloseagentmodal" onClick={() => closeModal()}>X</button>
                </div>
              </Modal.Header>
              <Modal.Body style={{ margin: "0px auto", width: "80%" }}>
                <div className="d-flex justify-content-center align-items-center healthFiannaceBox">
                  <div className="setGuidance-modal-div" onClick={() => { setGuidanceOpenPart("Health"), setopenguidancemodal(false) }}>
                    <img src="/images/Health.svg" className="setGuidance-modal-img" />
                    <h4 className="mt-2 setGuidance-modal-btn-name">Health</h4>
                  </div>
                  <div
                    className="setGuidance-modal-div" onClick={() => { setGuidanceOpenPart("Finance"), setopenguidancemodal(false),setPageSubTypeId(5)}}  >
                    <img src="/images/Finance.svg" className="setGuidance-modal-img" />
                    <h4 className="mt-2 setGuidance-modal-btn-name">Finance</h4>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </>}

          <>
            {(openguidancemodal == false && guidanceopenpart == 'Health') ? <>
              <SetGuidancehealth />
            </> : (openguidancemodal == false && guidanceopenpart == 'Finance') ? <>
            <Financeguidance />
            </> : ''}
          </>
        </div>
      </Layout>
    </>
  );
};

// export default Agentguidence;
export default withAuth(Agentguidence,accessToFileCabinet);
