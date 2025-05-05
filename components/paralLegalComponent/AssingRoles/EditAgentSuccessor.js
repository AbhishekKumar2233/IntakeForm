import React, { useEffect,useContext } from 'react'
import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { connect } from 'react-redux';
import { $AHelper } from '../../control/AHelper';
import konsole from '../../control/Konsole';
import { $CommonServiceFn } from '../../network/Service';
import { $Service_Url } from '../../network/UrlPath';
import { SET_LOADER } from '../../Store/Actions/action';
import { globalContext } from '../../../pages/_app';

function EditAgentSuccessor(props) {
    const { setdata } = useContext(globalContext)
    const showEditSuccessorModal = props.showEditSuccessorModal;
    const logUserId = sessionStorage.getItem("loggedUserId");
    const manageEditSuccessorModal = props.manageEditSuccessorModal;
    const setCustomAgentInfoObj = props.setCustomAgentInfoObj;
    const coAgentRank = props.coAgentRank;
    const customAgentInfoObj = props.customAgentInfoObj;
    const customSuccessorInfoObj = props.customSuccessorInfoObj;
    const [saveAgentInfo, setSaveAgentInfo] = useState({
        agentType: customAgentInfoObj.agentType,
        agent: []
    })
    const [selectTypeOfAgent, changeSelectTypeOfAgent] = useState(customAgentInfoObj.agentType);
    const fiduciaryMemberList = props.fiduciaryMemberList;
    const [rerenderPage, setReRenderPage] = useState(false);
    const [showPrimaryError, setPrimaryError] = useState(false);
    const [noOfCoAgent, setNoOfCoAgent] = useState(null);
    const [noOfSuccessor, setNoOfSuccessor] = useState(null);
    const [disableNoOfAgent, setDisableNoOfCoagent] = useState(false);
    const showAssignRolesName = props.showAssignRolesName;
    konsole.log("customAgentInfoObj in agent modal", showEditSuccessorModal,);
    const setCustomSuccessorInfoObj = props.setCustomSuccessorInfoObj;
    const successorRank = props.successorRank;
    const [saveSuccessorInfo, setsaveSuccessorInfo] = useState([]);


    return (
        <Modal show={showEditSuccessorModal} centered onHide={() => manageEditSuccessorModal(showEditSuccessorModal,"close")} backdrop="static">
            <Modal.Header closeButton closeVariant="white">
                <Modal.Title>Update Agents</Modal.Title>
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
                            <select className="w-100  border " style={{ color: "#751521" }} data-tag="1" name="primaryAgent" id="primaryAgent" value={(saveAgentInfo.agent.length > 0) ? saveAgentInfo.agent[0].agentUserId : ''} onChange={handleChange}>
                                <option value="-1"> Select Primary {showAssignRolesName} </option>
                                {fiduciaryMemberList.length > 0 && fiduciaryMemberList
                                    // .filter((agent, index) => {
                                    //     let returnedValue = true;
                                    //     if (customSuccessorInfoObj.length > 0) {
                                    //         for (let loop of customSuccessorInfoObj) {
                                    //             konsole.log("loop count", loop.agentUserId == agent.value, loop.agentUserId, agent.value)
                                    //             if (loop.agentUserId == agent.value) {
                                    //                 returnedValue = false
                                    //             }
                                    //         }
                                    //     }
                                    //     return returnedValue;
                                    // })
                                .map((fidList, index) => {
                                    konsole.log("fidList", fidList);
                                    return (
                                        <option className="text-secondary" value={fidList.value}>
                                            {$AHelper.capitalizeAllLetters(fidList.label)}-{fidList.relationWithUser}
                                        </option>
                                    );
                                })}
                            </select>

                            {
                                ((saveAgentInfo.agent.length === 0 || saveAgentInfo.agent.findIndex((agent) => (agent.agentRankId === props.primaryAgentRank[0].value && (agent.agentUserId === "" || agent.agentUserId === "-1"))) >= 0) && showPrimaryError === true) ? <p className='text-danger'>Please select the primary {showAssignRolesName}</p>
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
                                />
                            </div>
                            <div className="d-flex flex-sm-column">
                                {saveAgentInfo.agent.length > 0 && saveAgentInfo.agent.map((agent, index) => {
                                    let filteredFiduciaryMemberList = fiduciaryMemberList.filter((agent, index) => {
                                        let returnedValue = true;
                                        if (customSuccessorInfoObj.length > 0) {
                                            for (let loop of saveSuccessorInfo) {
                                                konsole.log("loop count", loop.agentUserId == agent.value, loop.agentUserId, agent.value)
                                                if (loop.agentUserId == agent.value) {
                                                    returnedValue = false
                                                }
                                            }
                                        }
                                        return returnedValue;
                                    })
                                    // .filter((v) => {
                                    //     let query = true;
                                    //     if (generateQuery(v.value, index) !== "") {
                                    //         query = eval(generateQuery(v.value, index));
                                    //         konsole.log("query", query);
                                    //     }
                                    //     return query;
                                    // });
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
                                                    onChange={(e) => handleChange(e, index)}
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
                                                {(agent?.error !== undefined && agent?.error !== null && agent?.error !== "") ?
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
                <>
                    <div className=" d-flex justify-content-start ">
                        <label className="p-2 fs-5 my-2">No of Successor {showAssignRolesName}: </label>
                        <input
                            type="text"
                            placeholder=""
                            className="DynamicFields px-5 my-2 w-25 "
                            id='noOfSuccessor'
                            name='noOfSuccessor'
                            value={noOfSuccessor}
                            onChange={changeSuccessorNumber}
                            style={{ border: "1px solid #751521" }}
                            onKeyUp={handleChange}
                        />
                    </div>
                    <div className="d-flex flex-sm-column">
                        {saveSuccessorInfo.length > 0 && saveSuccessorInfo.map((agent, index) => {
                            let filteredFiduciaryMemberList = fiduciaryMemberList.filter((agent, index) => {
                                let returnedValue = true;
                                if (customAgentInfoObj.agent.length > 0) {
                                    for (let loop of saveAgentInfo.agent) {
                                        konsole.log("loop count", loop.agentUserId == agent.value, loop.agentUserId, agent.value)
                                        if (loop.agentUserId == agent.value) {
                                            returnedValue = false
                                        }
                                    }
                                }
                                return returnedValue;
                            })
                            // .filter((v) => {
                            //     let query = true;
                            //     if (generateQuery(v.value, index) !== "") {
                            //         query = eval(generateQuery(v.value, index));
                            //         konsole.log("query", query);
                            //     }
                            //     return query;
                            // });
                            return (
                                <>
                                    <div>
                                        <p className="p-2"> {ordinal_suffix_of(index + 1)} Successor</p>

                                        <select
                                            className="w-75  border"
                                            name='selectedSuccessor'
                                            id='selectedSuccessor'
                                            value={agent.agentUserId}
                                            style={{ color: "#751521", width: "20px" }}
                                            onChange={(e) => handleChange(e, index)}
                                        >
                                            <option value={-1} selected>Choose successor {showAssignRolesName}</option>
                                            {filteredFiduciaryMemberList.map((ite, index) => {
                                                return (
                                                    <option value={ite.value} key={index}>
                                                        {ite.label}-{ite.relationWithUser}{" "}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        {(agent?.error !== undefined && agent?.error !== null && agent?.error !== "") ?
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
                <div className="d-flex justify-content-center text-center pt-3">
                    <Button className="theme-btn  text-center" onClick={addAgent}>Update Agents</Button>
                </div>
            </Modal.Body>
        </Modal>
    )


    function toasterAlert(text) {
        setdata({ open: true, text: text, type: "Warning" });
      }

    function addAgent() {
        const saveAgentInfoObj = saveAgentInfo;
        const saveSuccessorInfoObj = saveSuccessorInfo;
        let primaryAgentRank = props.primaryAgentRank;
        if (saveAgentInfo.agentType == "sole" && (saveAgentInfo.agent.length === 0 || saveAgentInfo.agent.findIndex((agent) => (agent.agentRankId === primaryAgentRank[0].value && (agent.agentUserId === "" || agent.agentUserId === "-1"))) >= 0)) {
            setPrimaryError(true);
            return;
        } else if (saveAgentInfo.agentType == "co"){
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
        const successorIndex = saveSuccessorInfoObj.findIndex((agent) => agent.agentUserId == "" || agent.agentUserId == "-1");
        if (successorIndex >= 0) {
            saveSuccessorInfoObj[successorIndex].error = `Please select ${ordinal_suffix_of(successorIndex + 1)} Successor`;
            setsaveSuccessorInfo(saveSuccessorInfoObj);
            setReRenderPage(!rerenderPage);
            return;
        }
        else{
            const index = $AHelper.findRepeatingObjectIndex(saveSuccessorInfoObj);
            if(index >= 0){
                saveSuccessorInfoObj[index].error = `Successor ${showAssignRolesName} is already assigned. Please choose another successor ${showAssignRolesName.toLowerCase()}.`;
                setsaveSuccessorInfo(saveSuccessorInfoObj);
                setReRenderPage(!rerenderPage);
                return;
            }
        }

        setCustomSuccessorInfoObj(saveSuccessorInfoObj);
        setCustomAgentInfoObj(saveAgentInfoObj);
        manageEditSuccessorModal(showEditSuccessorModal);
        setReRenderPage(!rerenderPage)
    }


    



    function changeCoAgentNumber(event) {
        const saveAgentInfoObj = saveAgentInfo;
        saveAgentInfo.agent = [];
        setSaveAgentInfo(saveAgentInfoObj);
        setNoOfCoAgent(Number(event.target.value));
        setReRenderPage(!rerenderPage);
    }


    function changeSuccessorNumber(event) {
        let saveSuccessorInfoObj = saveSuccessorInfo;
        saveSuccessorInfoObj = [];
        setsaveSuccessorInfo(saveSuccessorInfoObj);
        setNoOfSuccessor(Number(event.target.value));
        setReRenderPage(!rerenderPage);
    }

    function handleChange(event, index) {
        const eventId = event.target.id;
        const eventValue = event.target.value;
        const eventName = event.target.name;
        const saveAgentInfoObj = saveAgentInfo;
        let saveSuccessorInfoObj = saveSuccessorInfo;
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
                        setNoOfCoAgent(0);
                        return toasterAlert("not allowed");
                    }
                    for (let loop = 0; loop < noOfCoAgent; loop++) {
                        saveAgentInfoObj.agent.push($AHelper.agentReturnObj({ agentRankId: Number(coAgentRank[loop].value) }))
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
                    if (eventValue !== "-1") {
                        let fiduciaryMemberListObj = fiduciaryMemberList.find((item) => item.value == eventValue);
                        let agentUserId = fiduciaryMemberListObj.value;
                        let agentUserRelation = fiduciaryMemberListObj.relationWithUser;
                        let agentUserName = fiduciaryMemberListObj.label;
                        const presavedPrimary = (saveAgentInfo.agent.length > 0) ? saveAgentInfo.agent[0] : {};
                        saveAgentInfoObj.agent = [
                            $AHelper.agentReturnObj({ ...presavedPrimary, agentUserId, agentUserName, agentRankId: primaryAgentRank[0].value, upsertedBy: logUserId, agentUserRelation })
                        ]
                    } else {
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
                    if (eventValue !== "-1") {
                        const fiduciaryMemberListObj = fiduciaryMemberList.find((item) => item.value == eventValue);
                        const agentUserId = fiduciaryMemberListObj.value;
                        const agentUserRelation = fiduciaryMemberListObj.relationWithUser;
                        const agentUserName = fiduciaryMemberListObj.label;
                        saveAgentInfoObj.agent[index].agentUserId = agentUserId;
                        saveAgentInfoObj.agent[index].agentUserRelation = agentUserRelation;
                        saveAgentInfoObj.agent[index].agentUserName = agentUserName;
                        saveAgentInfoObj.agent[index].error = "";
                    }
                    else {
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
            case 'noOfSuccessor':
                {
                    const lengthAllowedSuccessor = successorRank.length;
                    if (noOfSuccessor > lengthAllowedSuccessor) {
                        saveSuccessorInfoObj = [];
                        setsaveSuccessorInfo(saveSuccessorInfoObj)
                        setNoOfSuccessor(0);
                        setReRenderPage(!rerenderPage);
                        return toasterAlert("not allowed");
                    }
                    for (let loop = 0; loop < noOfSuccessor; loop++) {
                        saveSuccessorInfoObj.push($AHelper.agentReturnObj({ agentRankId: Number(successorRank[loop].value), upsertedBy: logUserId }))
                    }

                    konsole.log("saveIndofdsf", saveSuccessorInfo);
                    setsaveSuccessorInfo(saveSuccessorInfoObj)
                    setNoOfSuccessor(Number(eventValue));
                    setReRenderPage(!rerenderPage);
                    break;
                }
            case 'selectedSuccessor':
                {
                    konsole.log("eventValue sadasd", typeof (eventValue), eventValue !== -1);
                    if (eventValue !== "-1") {
                        const fiduciaryMemberListObj = fiduciaryMemberList.find((item) => item.value == eventValue);
                        const agentUserId = fiduciaryMemberListObj.value;
                        const agentUserRelation = fiduciaryMemberListObj.relationWithUser;
                        const agentUserName = fiduciaryMemberListObj.label;

                        saveSuccessorInfoObj[index].agentUserId = agentUserId;
                        saveSuccessorInfoObj[index].agentUserRelation = agentUserRelation;
                        saveSuccessorInfoObj[index].agentUserName = agentUserName;
                        saveSuccessorInfoObj[index].error = "";
                    }
                    else {
                        const agentUserId = "-1"
                        const agentUserRelation = "";
                        const agentUserName = "";

                        saveSuccessorInfoObj[index].agentUserId = agentUserId;
                        saveSuccessorInfoObj[index].agentUserRelation = agentUserRelation;
                        saveSuccessorInfoObj[index].agentUserName = agentUserName;
                        saveSuccessorInfoObj[index].error = "";
                    }
                    setsaveSuccessorInfo(saveSuccessorInfoObj)
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
    function ordinal_suffix_of(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st"
            // return <>{i}<sup>{"st"}</sup></>;
        }
        if (j == 2 && k != 12) {
            return i + "nd"
            // return <>{i}<sup>{"nd"}</sup></>;
        }
        if (j == 3 && k != 13) {
            return i + "rd"
            // return <>{i}<sup>{"rd"}</sup></>;
        }
        return i + "th"
        // return <>{i}<sup>{"th"}</sup></>;
    }
}




const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect("", mapDispatchToProps)(EditAgentSuccessor);