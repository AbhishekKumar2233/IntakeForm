import React, { useState } from 'react'
import SetupLayout from '../../component/Layout/SetupLayout';
import Agentguidance from '../../component/Agent/Agentguidance';
import AgentTable from '../../component/Agent/AgentTable';
import { demo } from '../../components/control/Constant';


const Agent = () => {
    const [agentActivetab,setAgentactivetab] = useState(1);
  
  return (
    <>
    <SetupLayout name='Agent' id='8' agentActivetab={agentActivetab} setAgentactivetab={setAgentactivetab}>
      <Agentguidance agentActivetab={agentActivetab} setAgentactivetab={setAgentactivetab} />
      {/* <div className='mt-0'><AgentTable /></div>} */}
    </SetupLayout>
    </>
  )
}

export default Agent;
