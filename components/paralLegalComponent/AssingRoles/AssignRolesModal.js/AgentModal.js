import React, { useEffect ,useContext} from 'react'
import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { connect } from 'react-redux';
import { $AHelper } from '../../../control/AHelper';
import konsole from '../../../control/Konsole';
import { $CommonServiceFn } from '../../../network/Service';
import { $Service_Url } from '../../../network/UrlPath';
import { SET_LOADER } from '../../../Store/Actions/action';
import { globalContext } from '../../../../pages/_app';

function AgentModal(props) {
    const showAgentModal = props.showAgentModal;
    const editTypeAgent = props.editTypeAgent;

    const {setdata}=useContext(globalContext)
    const selectedTypeOfAgent = props.selectedTypeOfAgent;
    const logUserId = sessionStorage.getItem("loggedUserId");
    const manageAgentModal = props.manageAgentModal;
    const setCustomAgentInfoObj = props.setCustomAgentInfoObj;
    const applicableRoleName = props.show
    const coAgentRank = props.coAgentRank;
    const customAgentInfoObj = props.customAgentInfoObj;
    const customSuccessorInfoObj = props.customSuccessorInfoObj;
    const [ saveAgentInfo, setSaveAgentInfo ] = useState({
        agentType: customAgentInfoObj.agentType,
        agent:JSON.parse(JSON.stringify(customAgentInfoObj.agent))
    })
    const [selectTypeOfAgent, changeSelectTypeOfAgent] = useState(customAgentInfoObj.agentType);
    const fiduciaryMemberList = props.fiduciaryMemberList;
    const [rerenderPage, setReRenderPage] = useState(false);
    const [showPrimaryError, setPrimaryError] = useState(false);
    const agentType = (customAgentInfoObj.agentType !== "") ? customAgentInfoObj.agentType : "";
    const agentsMap = ( customAgentInfoObj.agent.length > 0 ) ? customAgentInfoObj.agent : [];
    const [noOfCoAgent, setNoOfCoAgent] = useState(null);
    const [disableNoOfAgent, setDisableNoOfCoagent ] = useState(false);
    const showAssignRolesName = props.showAssignRolesName;
    const capitalEditType = editTypeAgent.charAt(0).toUpperCase() + editTypeAgent.slice(1);
    konsole.log("customAgentInfoObj in agent modal", fiduciaryMemberList, );


    useEffect(() => {
        if (editTypeAgent == "add" && customAgentInfoObj?.agentType == "co" && customAgentInfoObj.agent.length > 0 ) {
            const noOfClientCoagent = customAgentInfoObj.agent.length + 1;
            setNoOfCoAgent(noOfClientCoagent)
            const customAgentInfoObjLocal = saveAgentInfo;
            if(customAgentInfoObj.agent.length < coAgentRank.length){
                customAgentInfoObjLocal.agent = [...customAgentInfoObj.agent, $AHelper.agentReturnObj({ agentRankId: (parseInt(coAgentRank[customAgentInfoObj.agent.length].value)), upsertedBy: logUserId })]
                setSaveAgentInfo(customAgentInfoObjLocal);
                setDisableNoOfCoagent(true);
                setReRenderPage(!rerenderPage)
            }
            else{
                toasterAlert("Cannot add more agents please contact the support team.");
                manageAgentModal(showAgentModal)
            }
        }
        else if(editTypeAgent == "edit" && customAgentInfoObj.agentType == "co"){
            setDisableNoOfCoagent(true);
            setNoOfCoAgent(customAgentInfoObj.agent.length)
        }
    }, [editTypeAgent])


    return (
        <Modal show={showAgentModal} centered onHide={()=> manageAgentModal(showAgentModal)} backdrop="static">
        <Modal.Header closeButton closeVariant="white">
            <Modal.Title>{capitalEditType} {(saveAgentInfo.agentType == "sole") ? `Primary ${showAssignRolesName}`: `Co-${showAssignRolesName}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='d-flex justify-content-between'>
                <div>
                    <div className="form-check-inline ">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="typeOfAgent"
                            id='typeOfAgent'
                            value="sole"
                            onChange={handleChange}
                            checked={selectTypeOfAgent == "sole" ? true : false}
                        />
                        <label className="ms-3 fs-5">Sole</label>
                    </div>
                    <div className="form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name='typeOfAgent'
                            id='typeOfAgent'
                            value="co"
                            onChange={handleChange}
                            checked={selectTypeOfAgent == "co" ? true : false}
                        />

                        <label className="ms-3 fs-5">Co</label>
                    </div>
                </div>
            </div>

            {selectTypeOfAgent == "sole" && saveAgentInfo.agentType == "sole" ? (
                <div className="d-flex justify-content-start mt-4">
                    <p className="p-2 fs-5 "> Primary</p>
                    <div className="p-2 w-75 ">
                        <select className="w-100  border " style={{ color: "#751521" }} data-tag="1" name="primaryAgent" id="primaryAgent" value={(saveAgentInfo.agent.length > 0)? saveAgentInfo.agent[0].agentUserId: '' } onChange={handleChange}>
                            <option value="-1"> Select Primary {showAssignRolesName} </option>
                            {fiduciaryMemberList.length > 0 && fiduciaryMemberList.filter((agent, index) => {
                                let returnedValue = true;
                                if (customSuccessorInfoObj.length > 0) {
                                    for (let loop of customSuccessorInfoObj) {
                                        konsole.log("loop count", loop.agentUserId == agent.value, loop.agentUserId, agent.value)
                                        if (loop.agentUserId == agent.value) {
                                            returnedValue = false
                                        }
                                    }
                                }
                                return returnedValue;
                            }).map((fidList, index) => {
                                konsole.log("fidList", fidList);
                                return (
                                    <option className="text-secondary" value={fidList.value}>
                                        {$AHelper.capitalizeAllLetters(fidList.label)}-{fidList.relationWithUser}
                                    </option>
                                );
                            })}
                        </select>
                        
                        {
                        ((saveAgentInfo.agent.length === 0 || saveAgentInfo.agent.findIndex((agent) => (agent.agentRankId === props.primaryAgentRank[0].value && (agent.agentUserId === "" || agent.agentUserId === "-1"))) >= 0)&& showPrimaryError === true)? <p className='text-danger'>Please select the primary {showAssignRolesName}</p>
                        :
                            <></>
                        }
                    </div>
                </div>
            ) :
                (selectTypeOfAgent == "co" && saveAgentInfo.agentType == "co") ? (
                    <>
                        <div className=" d-flex justify-content-start ">
                            <label className="p-2 fs-5 my-2">No of Co-{showAssignRolesName}: </label>
                            <input
                                type="text"
                                placeholder=""
                                className="DynamicFields px-5 my-2 w-25 "
                                id='noOfCoAgent'
                                name='noOfCoAgent'
                                value={noOfCoAgent}
                                onChange={changeCoAgentNumber}
                                style={{ border: "1px solid #751521" }}
                                onKeyUp={handleChange}
                                disabled={disableNoOfAgent}
                            />
                        </div>
                        <div className="d-flex flex-sm-column">
                            {saveAgentInfo.agent.length > 0 && saveAgentInfo.agent.map((agent, index) => {
                                let filteredFiduciaryMemberList = fiduciaryMemberList.filter((agent, index) => {
                                    let returnedValue = true;
                                    if (customSuccessorInfoObj.length > 0) {
                                        for (let loop of customSuccessorInfoObj) {
                                            konsole.log("loop count", loop.agentUserId == agent.value, loop.agentUserId, agent.value)
                                            if (loop.agentUserId == agent.value) {
                                                returnedValue = false
                                            }
                                        }
                                    }
                                    return returnedValue;
                                    })
                                    {/* .filter((v) => {
                                    let query = true;
                                    if (generateQuery(v.value, index) !== "") {
                                        query = eval(generateQuery(v.value, index));
                                        konsole.log("query", query);
                                    }
                                    return query;
                                    }); */}
                                return (
                                    <>
                                        <div>
                                            <p className="p-2">Co-{showAssignRolesName} {index + 1} </p>

                                            <select
                                                className="w-75  border"
                                                name='selectedCoAgent'
                                                id='selectedCoAgent'
                                                value={agent.agentUserId}
                                                style={{ color: "#751521", width: "20px" }}
                                                onChange={(e)=> handleChange(e, index)}   
                                            >
                                                <option value="-1">Choose Co-{showAssignRolesName}</option>
                                                {filteredFiduciaryMemberList.map((ite, index) => {
                                                    return (
                                                        <option value={ite.value} key={index}>
                                                            {ite.label}-{ite.relationWithUser}{" "}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            {(agent?.error !== undefined && agent?.error !== null && agent?.error !== "")?
                                                <p className='text-danger'>{agent?.error}</p>
                                                :
                                                <></>
                                            }
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </>
                ) : <></>}
            <div className="d-flex justify-content-center text-center pt-3">
                    <Button className="theme-btn text-center" onClick={addAgent}>{capitalEditType} {(saveAgentInfo.agentType == "sole") ? `Primary ${showAssignRolesName}` : `Co-${showAssignRolesName}`}</Button>
            </div>
        </Modal.Body>
    </Modal>
    )


    
    function toasterAlert(text) {
        setdata({ open: true, text: text, type: "Warning" });
      }

    function addAgent() {
        const saveAgentInfoObj = saveAgentInfo;
        let primaryAgentRank = props.primaryAgentRank;
        if (saveAgentInfo.agentType == "sole" && (saveAgentInfo.agent.length === 0 || saveAgentInfo.agent.findIndex((agent) => (agent.agentRankId === primaryAgentRank[0].value && (agent.agentUserId === "" || agent.agentUserId === "-1"))) >= 0)){
            setPrimaryError(true);
            return;
        }else if (saveAgentInfo.agentType == "co"){
            const agentCheckIndex = saveAgentInfo.agent.findIndex((agent) => agent.agentUserId == "" || agent.agentUserId == "-1");
            konsole.log("indexOd check", saveAgentInfo.agent, agentCheckIndex);
            if (agentCheckIndex >= 0) {
                saveAgentInfo.agent[agentCheckIndex].error = `Please select Co-${showAssignRolesName} ${agentCheckIndex + 1}`;
                setSaveAgentInfo(saveAgentInfo);
                setReRenderPage(!rerenderPage);
                return;
            }
            else{
                const index = $AHelper.findRepeatingObjectIndex(saveAgentInfo.agent);
                if (index >= 0) {
                    saveAgentInfo.agent[index].error = `Co-${showAssignRolesName} is already assigned. Please choose another co-${showAssignRolesName.toLowerCase()}.`;
                    setSaveAgentInfo(saveAgentInfo);
                    setReRenderPage(!rerenderPage);
                    return;
                }
            }
        }

        setCustomAgentInfoObj(saveAgentInfoObj); 
        manageAgentModal(showAgentModal);
    }



    function changeCoAgentNumber (event){
        const saveAgentInfoObj = saveAgentInfo;
        saveAgentInfo.agent = [];
        setSaveAgentInfo(saveAgentInfoObj); 
        setNoOfCoAgent(Number(event.target.value));
        setReRenderPage(!rerenderPage);
    }

    function handleChange(event, index) {
        const eventId = event.target.id;
        const eventValue = event.target.value;
        const eventName = event.target.name;
        const saveAgentInfoObj = saveAgentInfo;
        // konsole.log("handlechange in agent modal", "eventdId", eventId, "eventValue", eventValue, "eventMame", eventName);
        switch (eventId) {
            case 'typeOfAgent':
                saveAgentInfoObj.agentType = eventValue;
                saveAgentInfoObj.agent = [];
                changeSelectTypeOfAgent(eventValue);
                setSaveAgentInfo(saveAgentInfoObj);
                break;
            case 'noOfCoAgent':
                {
                    const lengthAllowedCoagent = coAgentRank.length;
                    konsole.log("handlechange in agent modal", "eventdId", eventId, "eventValue", noOfCoAgent, "eventMame", eventName, "lengthAllowedCoagent", lengthAllowedCoagent);
                    if (noOfCoAgent > lengthAllowedCoagent) {
                        saveAgentInfoObj.agent = [];
                        setSaveAgentInfo(saveAgentInfoObj)
                        setNoOfCoAgent(Number(eventValue));
                        return toasterAlert("not allowed");
                    }
                    for (let loop = 0; loop < noOfCoAgent; loop++) {
                        saveAgentInfoObj.agent.push($AHelper.agentReturnObj({ agentRankId: Number(coAgentRank[loop].value)}))
                    }

                    konsole.log("saveIndofdsf", saveAgentInfo);
                    setSaveAgentInfo(saveAgentInfoObj)
                    setNoOfCoAgent(Number(eventValue));
                    setReRenderPage(!rerenderPage);
                    break;
                }
            case 'primaryAgent':
                {
                    let primaryAgentRank = props.primaryAgentRank;
                    if(eventValue !== "-1"){
                        let fiduciaryMemberListObj = fiduciaryMemberList.find((item) => item.value == eventValue);
                        let agentUserId = fiduciaryMemberListObj.value;
                        let agentUserRelation = fiduciaryMemberListObj.relationWithUser;
                        let agentUserName = fiduciaryMemberListObj.label;
                        const presavedPrimary = (saveAgentInfo.agent.length > 0) ? saveAgentInfo.agent[0] : {};
                        saveAgentInfoObj.agent = [
                            $AHelper.agentReturnObj({ ...presavedPrimary, agentUserId, agentUserName, agentRankId: primaryAgentRank[0].value, upsertedBy: logUserId, agentUserRelation })
                        ]  
                    }else{
                        let agentUserId = "-1";
                        let agentUserRelation = "";
                        let agentUserName = "";
                        const presavedPrimary = (saveAgentInfo.agent.length > 0) ? saveAgentInfo.agent[0] : {};
                        saveAgentInfoObj.agent = [
                            $AHelper.agentReturnObj({ ...presavedPrimary, agentUserId, agentUserName, agentRankId: primaryAgentRank[0].value, upsertedBy: logUserId, agentUserRelation })
                        ]
                    }
                    setSaveAgentInfo(saveAgentInfo)
                    setReRenderPage(!rerenderPage);  
                    
                }
                break;
            case 'selectedCoAgent':
                {
                    if(eventValue !== "-1"){
                        const fiduciaryMemberListObj = fiduciaryMemberList.find((item) => item.value == eventValue);
                        const agentUserId = fiduciaryMemberListObj.value;
                        const agentUserRelation = fiduciaryMemberListObj.relationWithUser;
                        const agentUserName = fiduciaryMemberListObj.label;
                        saveAgentInfoObj.agent[index].agentUserId = agentUserId;
                        saveAgentInfoObj.agent[index].agentUserRelation = agentUserRelation;
                        saveAgentInfoObj.agent[index].agentUserName = agentUserName;
                        saveAgentInfoObj.agent[index].error = "";
                    }
                    else{
                        let agentUserId = "-1";
                        let agentUserRelation = "";
                        let agentUserName = "";
                        saveAgentInfoObj.agent[index].agentUserId = agentUserId;
                        saveAgentInfoObj.agent[index].agentUserRelation = agentUserRelation;
                        saveAgentInfoObj.agent[index].agentUserName = agentUserName;
                        saveAgentInfoObj.agent[index].error = "";
                    }
                    setSaveAgentInfo(saveAgentInfo)
                    setReRenderPage(!rerenderPage);
                    break;
                }
            default:
                konsole.log("")
        }
    }

    function generateQuery(userId, index) {
        let value = "";
        const length = saveAgentInfo.agent.length;

        for (let i = 1; i <= length; i++) {
            if (saveAgentInfo.agent[i - 1].agentUserId !== null) {
                if (index !== i - 1) {
                    // if(fields[i].value !== null){
                    value += `"${userId}"!=="${saveAgentInfo.agent[i - 1].agentUserId}"`;
                    // }
                    konsole.log("avavav", i, length, length - 3);
                    if (i <= length) {
                        value += "&&";
                    } else {
                        value = value;
                    }
                }
            }
        }
        konsole.log("returndata", value.slice(0, -2));
        return value.slice(0, -2);
    };
}

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect("", mapDispatchToProps)(AgentModal);