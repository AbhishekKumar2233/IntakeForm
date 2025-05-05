import React, { useEffect, useMemo, useState } from "react";
import usePrimaryUserId from "../Hooks/usePrimaryUserId";
import AgentTable from "./AgentTable";
import { useAppDispatch, useAppSelector } from "../Hooks/useRedux";
import { selectorAgent, selectorFinance } from "../Redux/Store/selectors";
import { fetchAgent } from "../Redux/Reducers/agentSlice";
import { useDispatch } from "react-redux";
import { isNotValidNullUndefile } from "../../components/Reusable/ReusableCom";
import { $AHelper } from "../Helper/$AHelper";
import { $dashboardLinks, $setGuidanceLinks } from "../Helper/Constant";
import HealthLayout from "./HealthLayout";
import { CustomButton } from "../Custom/CustomButton";
import { demo } from "../../components/control/Constant";
import { clearSessionActiveTabData } from "../Hooks/usePersistActiveTab";



const Agentguidance = ({id,agentActivetab,setAgentactivetab}) => {
    const { primaryUserId, spouseUserId, loggedInUserId, spouseFirstName, primaryMemberFirstName,isPrimaryMemberMaritalStatus } = usePrimaryUserId();
    const [activeTab, setActiveTab] = useState(1);
    const agentApiData = useAppSelector(selectorAgent);
    const {agentList} = agentApiData;
    const dispatch = useAppDispatch();
    const userId = useMemo(() => (activeTab == 1 ? primaryUserId : spouseUserId), [activeTab, primaryUserId, spouseUserId]);
    // const [agentActivetab,setAgentactivetab] = useState(1)
    const sidebarArray = [{id:1,name:'Illness'},{id:2,name:'Mental Health'},{id:3,name:'End of Life'},{id:4,name:'Death'}]

    console.log(agentList,"agentList")

    useEffect(()=>{
      clearSessionActiveTabData();
      if(isNotValidNullUndefile(userId)){
      dispatch(fetchAgent({userId:userId}))
      }
    },[userId])

    const handleActiveTabButton = (val, next) => {
        setActiveTab(val);
        // setSearchValue('')
        if (next) {
          handleActiveTabMain(2)
        }
      }

      console.log(agentList,"agentListagentListagentListagentListagentList",primaryUserId)
      

    return(
        <div className="agent-aguidance mx-3">
        <div className="mt-1 agentGuide d-flex justify-content-between gap-3 align-items-center">
          <div>
            <h2 className="fw-bold" style={{fontSize:'24px',color:'#170307'}}>Agent Guidance</h2>
            </div>
          {isPrimaryMemberMaritalStatus && <div>
            <div className="btn-div addBorderToToggleButton">
              <button className={`view-btn ${activeTab == "1" ? "active selectedToglleBorder" : ""}`} onClick={() => handleActiveTabButton(1)}>{primaryMemberFirstName && <>{primaryMemberFirstName}</>}</button>
              {(isPrimaryMemberMaritalStatus) && <button className={`view-btn ${activeTab == "2" ? "active selectedToglleBorder" : ""}`} onClick={() => handleActiveTabButton(2)}>{spouseFirstName && <> {spouseFirstName}</>}</button>}
            </div>
          </div>}
        </div>
        {/* { demo == true && <div>
        <div className="mx-0 d-flex gap-2 my-2" style={{color:'#5E5E5E',fontSize:'14px'}}><button className="border-0 bg-transparent p-0" style={{color:'#5E5E5E'}} onClick={()=>{$AHelper.$dashboardNextRoute('/')}}>Setup</button>{`>`}<span className="fw-bold" style={{color:'#720c20'}}> Agent/Guidance</span></div>
        <hr/>
        <div className='d-flex flex-wrap col-12 mx-1 my-0'>
                {$setGuidanceLinks.map((item, index) => (
                    <div className="col-xl-2 col-md-6 col-lg-2 col-6" style={{ display: "flex" }}>
                        <div
                            key={index}
                            className={`${item.id == agentActivetab ? "active-card" : ""} card-dashboard`}
                            onClick={() => setAgentactivetab(item.id)}
                        >
                            <div className="card-content">
                            <div className="top-side">
                                    <img src={`/New/icons/${item.route}${item.id == agentActivetab ? "-active" : ""}.svg`} alt="User Icon" className="icon" />
                                </div>
                                <div className="bottom-side">
                                    <h3>{item.label}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>} */}
        {/* {demo == true && <>{agentActivetab == 1 ? <div className="introductionpage w-100">
          <h2>Introduction</h2>
          <hr/>
          <p>Welcome to the Agent Guidance setup. This is your opportunity to ensure that your care and important life decisions are handled, exactly the way you wish, without burdening your family with difficult decisions or risking your financial security.
            <br/><div className="mt-10">By taking these steps now, you’re preparing better for your future and also giving peace of mind to yourself and those who care about you, knowing that your wishes will always be honoured.</div></p>

            <div className="d-flex justify-content-end mt-10 fs-14">
              <CustomButton label="Understood & proceed to Health and care preferences" onClick={()=>setAgentactivetab(2)} />
            </div>
        </div> : */}
        {demo == true && <>{agentActivetab == 4 ? <AgentTable agentData={agentList} activeTab={activeTab} setActiveTab={setActiveTab}  /> : agentActivetab == 1 ? <HealthLayout userId={userId} setActiveModule={setAgentactivetab} /> : <p className="introductionpage fs-4 fw-bold">Coming Soon</p>}</>}
        {demo == false && <>
        {/* <h4>Table of Agent / Legal document</h4>  */}
        <AgentTable agentData={agentList} activeTab={activeTab} setActiveTab={setActiveTab} /> </>}
        </div>
    )
}

export default Agentguidance;