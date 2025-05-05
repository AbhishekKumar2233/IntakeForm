import React, { useEffect, useState } from "react";
import Layout from "../layout";
import { Col, Form, Row, Table, Container } from "react-bootstrap";
import konsole from "../control/Konsole";
import { $CommonServiceFn } from "../network/Service";
import { $Service_Url } from "../network/UrlPath";
import AgentsTable from "./Agents/AgentTable";
import LegalTable from "./Agents/LegalTable"
import { SET_LOADER } from "../Store/Actions/action";
import { connect } from "react-redux";
import { $AHelper } from "../control/AHelper";

const Agent =(props)=>{
    const [listofuserid,setlistofuserid] = useState('primary')
    const [primaryuserId,setprimaryuserId] =useState('')
    const [spouseuserId,setspouseuserId] = useState('')
    const [userDetailOfPrimary,setuserDetailOfPrimary] =useState({})
    const[assignOptionsList,setAssignOptionsList] =useState([])
    const [RenderValue, setRenderValue] = useState(true);
    const [inputFilter, setInputFilter] = useState("");
    
    useEffect(()=>{
        let primaryuserid = sessionStorage.getItem("SessPrimaryUserId");
        setprimaryuserId(primaryuserid)
        let spouseuserid = sessionStorage.getItem("spouseUserId");
        setspouseuserId(spouseuserid)
        let userDetailofPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
        setuserDetailOfPrimary(userDetailofPrimary)
        setAssignOptionsList([])
        if(listofuserid == "primary"){
          AgentList(primaryuserid)
        }else{
          AgentList(spouseuserid)
        }
    },[listofuserid])

    const AgentList = (primaryuserID) => {
      props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserAgentListPath+"?userId="+primaryuserID+"&isActive="+true,"", (response,error) => {
          
          konsole.log("working3")
          if (response) {
            konsole.log("working")
            konsole.log(response, "agentresponse");
            const resposnseDatass = response.data.data.filter(d => d.agentUserId !== null );    
            konsole.log(resposnseDatass,"resposnseDatass")
            const responseData = resposnseDatass.map((userAgent) => {
              return {
                fullName: userAgent.fullName,
                relationWithMember: userAgent.relationWithMember,
                // legalDocName:
                //   userAgent.testSupportDocName == null &&
                //   userAgent.testDocId == null
                //     ? userAgent.legalDocName + " & " + userAgent.agentRole
                //     : userAgent.testDocId == null
                //     ? userAgent.testSupportDocName + " & " + userAgent.agentRole
                //     : userAgent.testSupportDocName == null
                //     ? userAgent.testDocName + " & " + userAgent.agentRole
                //     : "",
                    legalDocName:
                    userAgent.testSupportDocName == null &&
                    userAgent.testDocId == null ? userAgent.legalDocName  : userAgent.testDocId == null
                                                ? userAgent.testSupportDocName : userAgent.testSupportDocName == null
                                                ? userAgent.testDocName : "",
                agentRank: userAgent.agentRank,
                agentDOB:userAgent.agentDOB,
                agentAcceptanceStatus: userAgent.agentAcceptanceStatus,
                agentRole: userAgent.agentRole,
                isUserActive: userAgent.isUserActive,
                agentEmailId: userAgent.agentEmailId,
                agentMobileNo: userAgent.agentMobileNo,
                agentUserId: userAgent.agentUserId,
                agentRankId: userAgent.agentRankId,
                statusName: userAgent.statusName,
                relationWithSpouse:userAgent.relationWithSpouse,
                legalDocId:userAgent.legalDocId,
                memberStatusId:userAgent.memberStatusId

              };
            });
            konsole.log("response my agent", responseData);
            setAssignOptionsList(responseData);
            props.dispatchloader(false);
          }else{
            konsole.log("working2")
            props.dispatchloader(false)
            konsole.log(error,"error")
          }
        }
        );
      };

      var filterdata = assignOptionsList.filter((item) => {
        return (
          item?.fullName?.toLowerCase()?.includes(inputFilter?.toLocaleLowerCase()) +
          item?.legalDocName?.toLowerCase()?.includes(inputFilter?.toLocaleLowerCase())
        );
      });
      var filterdatalegal = assignOptionsList.filter((item) => {
        return (
          item?.legalDocName
            ?.toLowerCase()
            ?.includes(inputFilter?.toLocaleLowerCase()) +
          item?.fullName?.toLowerCase()?.includes(inputFilter?.toLocaleLowerCase())
        );
      });
      
    return(
       <div>
        <div className=" d-flex flex-wrap  align-items-center bg-white pt-3 pb-0"> View by : {" "}
          <div className="d-flex mx-2">
            <div class="form-check d-flex align-items-center justify-content-between">
              <Form.Check class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onChange={() => setlistofuserid("primary")} defaultChecked></Form.Check>
              <label class="form-check-label ps-1 pt-1 agent_Label " for="flexRadioDefault1" >   {$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}{" "} </label>
            </div>
            {(spouseuserId !== undefined && spouseuserId !== "null") &&
              <div class="form-check d-flex ms-2  align-items-center justify-content-between">
                <Form.Check class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={() => setlistofuserid("spouse")} ></Form.Check>
                <label class="form-check-label ps-1 pt-1 agent_Label" for="flexRadioDefault2" >   {$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName) ? $AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName) : userDetailOfPrimary.memberName + "- Spouse"} </label>
              </div>
            }
            {(spouseuserId !== undefined && spouseuserId !== null && spouseuserId !== '')}
          </div>
          {" | "}
          <div className="d-flex ms-2">
            <div class="form-check d-flex align-items-center justify-content-between">
              <Form.Check class="form-check-input" type="radio" name="RadioDefault" id="RadioDefault1" onChange={() => setRenderValue(true)} defaultChecked></Form.Check>
              <label class="form-check-label ps-1 pt-1 agent_Label " for="flexRadioDefault1" >Agent</label>
            </div>

            <div class="form-check d-flex ms-2  align-items-center justify-content-between">
              <Form.Check class="form-check-input" type="radio" name="RadioDefault" id="sRadioDefault2" onChange={() => setRenderValue(false)} ></Form.Check>
              <label class="form-check-label ps-1 pt-1 agent_Label " for="flexRadioDefault2" >Legal Document</label>
            </div>

            {(spouseuserId !== undefined && spouseuserId !== null && spouseuserId !== '')}
          </div>
        </div>
        <Row className="" style={{ backgroundColor: "white" }}>
          <Col>
          <div className="d-flex searchAgents">
            <input
              className="border"
              placeholder={`${RenderValue !== true ? "Search for Legal Document" : "Search for  Agents"}`}
              // onSearch={onSearch}
              style={{
                marginTop: 15,
                borderRadius: "3px 0px 0px 3px",
                // paddingLeft:'2rem'
              }}
              onChange={(e) => {
                setInputFilter(e.target.value);
              }}
            />
            <button className="" style={{ marginTop: 15, background: "#720c20", color: "#ffffff", border: "none", borderRadius: "0px 3px 3px 0px" }}><svg viewBox="64 64 896 896" focusable="false" data-icon="search" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path></svg></button>
          </div>
          </Col>
        </Row>
        {/* <Container fluid className="info-details mt-1"> */}
              
              {RenderValue == false ? (
                  <LegalTable dataSource={filterdata} RenderValue={RenderValue} />
                ) : (
                  <AgentsTable dataSource={filterdatalegal} Rendermember={listofuserid}
                  />
                )}
                {/* </Container> */}
       </div>
    )
}


const mapStateToProps = (state) => ({...state})
const mapDispatchToProps = (dispatch)=>({
  dispatchloader:(loader)=>dispatch({type: SET_LOADER,payload:loader})
})

export default connect(mapStateToProps,mapDispatchToProps)(Agent);