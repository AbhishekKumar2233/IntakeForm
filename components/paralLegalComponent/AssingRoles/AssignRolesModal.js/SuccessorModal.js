import React, { useEffect,useContext } from 'react'
import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { connect } from 'react-redux';
import { $AHelper } from '../../../control/AHelper';
import konsole from '../../../control/Konsole';
import { $CommonServiceFn } from '../../../network/Service';
import { $Service_Url } from '../../../network/UrlPath';
import { SET_LOADER } from '../../../Store/Actions/action';
import { globalContext } from '../../../../pages/_app';

function SuccessorModal(props) {
  const showSuccessorModal = props.showSuccessorModal;
  const customAgentInfoObj = props.customAgentInfoObj;
  const {setdata}=useContext(globalContext)
  const logUserId = sessionStorage.getItem("loggedUserId");
  const editTypeSuccessor = props.editTypeSuccessor;
  const manageSuccessorModal = props.manageSuccessorModal;
  const setCustomSuccessorInfoObj = props.setCustomSuccessorInfoObj;
  const successorRank = props.successorRank;
  const customSuccessorInfoObj = props.customSuccessorInfoObj;
  const [saveSuccessorInfo, setsaveSuccessorInfo] = useState([]);
  const fiduciaryMemberList = props.fiduciaryMemberList;
  const [noOfCoAgent, setNoOfCoAgent] = useState(null);
  const [rerenderPage, setReRenderPage] = useState(false);
  const [disableNoOfSuccessor, setDisableNoOfSuccessor] = useState(false);
  const showAssignRolesName = props.showAssignRolesName;
  const capitalEditType = editTypeSuccessor.charAt(0).toUpperCase() + editTypeSuccessor.slice(1);

  useEffect(()=>{
    konsole.log("successorRank", successorRank);
    if (editTypeSuccessor == "add" && customSuccessorInfoObj.length > 0) {
      if(customSuccessorInfoObj.length < successorRank.length){
        setNoOfCoAgent(customSuccessorInfoObj.length + 1);
        setsaveSuccessorInfo([...customSuccessorInfoObj, $AHelper.agentReturnObj({ agentRankId: (parseInt(successorRank[customSuccessorInfoObj.length].value)), upsertedBy: logUserId })]);
        setDisableNoOfSuccessor(true);
        setReRenderPage(!rerenderPage)
      }
      else {
        toasterAlert("Cannot add more successor please contact the support team.");
        manageSuccessorModal(showSuccessorModal)
      }
    }
    else if(editTypeSuccessor == "edit"){
      setNoOfCoAgent(customSuccessorInfoObj.length);
      setsaveSuccessorInfo(JSON.parse(JSON.stringify(customSuccessorInfoObj)));
      setReRenderPage(!rerenderPage)
      setDisableNoOfSuccessor(true);
    }
  },[editTypeSuccessor])

  return (
    <Modal show={showSuccessorModal} centered onHide={() => manageSuccessorModal(showSuccessorModal)} backdrop="static">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>{capitalEditType} Successor {showAssignRolesName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <div className=" d-flex justify-content-start ">
            <label className="p-2 fs-5 my-2">No of Successor {showAssignRolesName}: </label>
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
              disabled={disableNoOfSuccessor}
            />
          </div>
          <div className="d-flex flex-sm-column">
            {saveSuccessorInfo.length > 0 && saveSuccessorInfo.map((agent, index) => {
              let filteredFiduciaryMemberList = fiduciaryMemberList.filter((agent, index) => {
                let returnedValue = true;
                if(customAgentInfoObj.agent.length > 0){
                  for (let loop of customAgentInfoObj.agent) {
                    konsole.log("loop count", loop.agentUserId == agent.value, loop.agentUserId, agent.value)
                    if (loop.agentUserId == agent.value) {
                      returnedValue = false
                    }
                  }
                }
                return returnedValue;
              })
              // .filter((v) => {
              //   let query = true;
              //   if (generateQuery(v.value, index) !== "") {
              //     query = eval(generateQuery(v.value, index));
              //     konsole.log("query", query);
              //   }
              //   return query;
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
        <div className="d-flex justify-content-center text-center mt-2">
          <Button className="theme-btn  text-center" onClick={addAgent}>{capitalEditType} Successor {showAssignRolesName}</Button>
        </div>
      </Modal.Body>
    </Modal>
  )


  function toasterAlert(text) {
    setdata({ open: true, text: text, type: "Warning" });
  }

  function addAgent() {
    const saveSuccessorInfoObj = saveSuccessorInfo;

    const successorIndex = saveSuccessorInfoObj.findIndex((agent) => agent.agentUserId == "" || agent.agentUserId == "-1");
    if (successorIndex >= 0) {
      saveSuccessorInfoObj[successorIndex].error = `Please select ${ordinal_suffix_of(successorIndex + 1)} Successor`;
      setsaveSuccessorInfo(saveSuccessorInfoObj);
      setReRenderPage(!rerenderPage);
      return;
    }
    else {
      const index = $AHelper.findRepeatingObjectIndex(saveSuccessorInfoObj);
      if (index >= 0) {
        saveSuccessorInfoObj[index].error = `Successor ${showAssignRolesName} is already assigned. Please choose another successor ${showAssignRolesName.toLowerCase()}.`;
        setsaveSuccessorInfo(saveSuccessorInfoObj);
        setReRenderPage(!rerenderPage);
        return;
      }
    }

    setCustomSuccessorInfoObj(saveSuccessorInfoObj);
    manageSuccessorModal(showSuccessorModal);
  }



  function changeCoAgentNumber(event) {
    let saveSuccessorInfoObj = saveSuccessorInfo;
    saveSuccessorInfoObj = [];
    if ($AHelper.isNumberRegex(event.target.value)) {
      setNoOfCoAgent(Number(event.target.value));
    }
    else{
      setNoOfCoAgent(Number(0));
    }
    setsaveSuccessorInfo(saveSuccessorInfoObj);
    setReRenderPage(!rerenderPage);
  }

  function handleChange(event, index) {
    const eventId = event.target.id;
    const eventValue = event.target.value;
    const eventName = event.target.name;
    let saveSuccessorInfoObj = saveSuccessorInfo;
    // konsole.log("handlechange in agent modal", "eventdId", eventId, "eventValue", eventValue, "eventMame", eventName);
    switch (eventId) {
      case 'noOfCoAgent':
        {
          const lengthAllowedSuccessor = successorRank.length;
          if (noOfCoAgent > lengthAllowedSuccessor) {
            saveSuccessorInfoObj = [];
            setsaveSuccessorInfo(saveSuccessorInfoObj)
            setNoOfCoAgent(0);
            setReRenderPage(!rerenderPage);
            return toasterAlert("not allowed");
          }
          for (let loop = 0; loop < noOfCoAgent; loop++) {
            if(event.target.value > saveSuccessorInfo?.length){
            saveSuccessorInfoObj.push($AHelper.agentReturnObj({ agentRankId: Number(successorRank[loop].value), upsertedBy: logUserId }))
            }
          }

          konsole.log("saveIndofdsf", saveSuccessorInfo);

          if ($AHelper.isNumberRegex(event.target.value)) {
            setNoOfCoAgent(Number(eventValue));
          }
          else{
            setNoOfCoAgent(Number(0));
          }
          setsaveSuccessorInfo(saveSuccessorInfoObj)
          setReRenderPage(!rerenderPage);
          break;
        }
      case 'selectedSuccessor':
        {
          konsole.log("eventValue sadasd", typeof(eventValue), eventValue !== -1);
          if(eventValue !== "-1"){
            const fiduciaryMemberListObj = fiduciaryMemberList.find((item) => item.value == eventValue);
            const agentUserId = fiduciaryMemberListObj.value;
            const agentUserRelation = fiduciaryMemberListObj.relationWithUser;
            const agentUserName = fiduciaryMemberListObj.label;

            saveSuccessorInfoObj[index].agentUserId = agentUserId;
            saveSuccessorInfoObj[index].agentUserRelation = agentUserRelation;
            saveSuccessorInfoObj[index].agentUserName = agentUserName;
            saveSuccessorInfoObj[index].error = "";
          }
          else{
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
    const length = saveSuccessorInfo.length;

    for (let i = 1; i <= length; i++) {
      if (saveSuccessorInfo[i - 1].agentUserId !== null) {
        if (index !== i - 1) {
          // if(fields[i].value !== null){
          value += `"${userId}"!=="${saveSuccessorInfo[i - 1].agentUserId}"`;
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
      return  i + "st"
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

export default connect("", mapDispatchToProps)(SuccessorModal);