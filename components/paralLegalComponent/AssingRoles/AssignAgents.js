import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import AlertToaster from '../../control/AlertToaster';
import konsole from '../../control/Konsole';
import { fileLargeMsg, sortingFolderForCabinet, categoryFileCabinet, cabinetFileCabinetId, cretaeJsonForFilePermission, cretaeJsonForFolderPermission, createJsonForFolderMapping2, operationForCategoryType, specificFolderName, createFileCabinetFileAdd } from '../../control/Constant';
import { $CommonServiceFn, $postServiceFn, Services } from '../../network/Service';
import { $Service_Url } from '../../network/UrlPath';
import { SET_LOADER } from '../../Store/Actions/action';
import AgentModal from './AssignRolesModal.js/AgentModal';
import SuccessorModal from './AssignRolesModal.js/SuccessorModal';
import { $AHelper } from '../../control/AHelper';
import { globalContext } from "../../../pages/_app";
import PdfViewer2 from '../../PdfViwer/PdfViewer2';
import EditAgentSuccessor from './EditAgentSuccessor';
import AssignAgentDecease from '../../Deceased/AssignAgentDecease';
import { isNotValidNullUndefile } from '../../Reusable/ReusableCom';

function AssignAgents(props) {
    const inputRef = React.useRef(null);
    const stateObj = $AHelper.getObjFromStorage("stateObj");
    const subtenantId = sessionStorage.getItem('SubtenantId')
    const maritalStatusId = sessionStorage.getItem('maritalStatusId')
    let primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
    const context = useContext(globalContext);
    const agentTypesList = { allAgentsId: 1, successorId: 2 };
    const containerBoxSize = { minHeight: '6rem', heigh: 'fit-content' };
    const selectedDocumentType = { legalDocs: "legalDocs", testamentaryDocs: "testamentaryDocs", testamentarySupportDocs: "testamentarySupportDocs" };
    const fileCabinetTypeId = 6;
    //legal
    // const fileCabinetTypeId = categoryFileCabinet[0];

    const fileStatusId = 2;
    const folderIdOfEstatePlainingCurrent = props.folderIdOfEstatePlainingCurrent
    konsole.log('folderIdOfEstatePlainingCurrentfolderIdOfEstatePlainingCurrent', props, folderIdOfEstatePlainingCurrent)
    const memberUserId = props.memberUserId;
    const selectedLegalDocsObj = props.selectedLegalDocsObj;
    const isChecked = selectedLegalDocsObj?.checked;
    const userAgentArray = props.userAgentArray;
    const fetchLegalDocumentList = props.legalDocumentList;
    const legalDocuments = props.legalDocuments;
    const legalDocId = selectedLegalDocsObj.legalDocId;
    const applicableRoleId = selectedLegalDocsObj.applicableRoleId;
    const applicableRoleName = selectedLegalDocsObj.applicableRoleName;
    const legalDocIndex = props.index;
    const testamentaryDocs = selectedLegalDocsObj.testamentaryDocs;
    const fileTypeId = selectedLegalDocsObj.fileTypeId;
    const userAgentArrayForSpouse = props.userAgentArrayForSpouse;
    const jointAgents = selectedLegalDocsObj.agents

    konsole.log("selfDucment", userAgentArrayForSpouse, selectedLegalDocsObj, jointAgents)
    const selectedTestamentoryDocsList = [];
    const selectedTestamentorySupportDocsList = [];


    for (let legalDoc of legalDocuments) {
        for (let testamentaryDocs of legalDoc.testamentaryDocs) {
            if (testamentaryDocs.testamentaryDocsChecked === true) {
                selectedTestamentoryDocsList.push(testamentaryDocs);
            }
        }
    };

    for (let legalDoc of legalDocuments) {
        for (let testamentarySupportDocs of legalDoc.testamentarySupportDocs) {
            if (testamentarySupportDocs.testamentarySupportDocsChecked === true) {
                selectedTestamentorySupportDocsList.push(testamentarySupportDocs);
            }
        }
    };
    const isHipaaAndDoa = (selectedLegalDocsObj?.legalDocId !== 11 && selectedLegalDocsObj?.legalDocId !== 17);
    const selectedTestamentoryDocs = (selectedTestamentoryDocsList !== undefined && selectedTestamentoryDocsList.length > 0) ? true : false;
    const selectedTestamentorySupportDocs = (selectedTestamentoryDocsList !== undefined && selectedTestamentorySupportDocsList.length > 0) ? true : false;
    const selectedLegalDocumentForCheckingLength = legalDocuments.filter((data) => data.checked === true);
    const selectedLegalDocumentsChecked = (selectedLegalDocumentForCheckingLength.length > 1) ? true : false;
    const showLegalName = (selectedLegalDocsObj.testDocId !== undefined && selectedLegalDocsObj.testDocId !== null) ? selectedLegalDocsObj.testDocName : (selectedLegalDocsObj.testSupportDocId !== undefined && selectedLegalDocsObj.testSupportDocId !== null) ? selectedLegalDocsObj.testSupportDocName : selectedLegalDocsObj.legalDocName;
    const showAssignRolesName = ((applicableRoleId !== undefined && applicableRoleId !== null) && isHipaaAndDoa == true) ? applicableRoleName : "";

    //local storage
    const logUserId = sessionStorage.getItem("loggedUserId");
    const primaryUserId = sessionStorage.getItem("SessPrimaryUserId");
    const spouseUserId = sessionStorage.getItem("spouseUserId");

    // states
    const [fiduciaryMemberList, setFiduciaryMemberList] = useState([]);
    const [filteredFiduciaryMemberList, setFilteredFiduciaryMemberList] = useState([]);

    const [showEditSuccessorModal, setShowEditSuccessorModal] = useState(false);
    const [showAgentModal, setShowAgentModal] = useState(false);
    const [editTypeAgent, setEditTypeAgent] = useState("add");
    const [editTypeSuccessor, setEditTypeSuccessor] = useState("add");
    const [showSuccessorModal, setShowSuccessorModal] = useState(false);
    const [selectedTypeOfAgent, setSelectedTypeOfAgent] = useState("sole");
    const [primaryAgentRank, setPrimaryAgentRank] = useState([]);
    const [coAgentRank, setCoAgentRank] = useState([]);
    const [successorRank, setSuccessorRank] = useState([]);
    const [customAgentInfoObj, setCustomAgentInfoObj] = useState({ agentType: "sole", agent: [] });
    const [customSuccessorInfoObj, setCustomSuccessorInfoObj] = useState([]);
    const [customFiduciaryList, setCustomFiduciaryList] = useState([]);
    const [reRenderPage, setReRenderPage] = useState(false);
    const [showAssignAgentScreen, setShowAssignAgentScreen] = useState(true);
    const [selectAgentTypeForReplicate, setSelectAgentTypeForReplicate] = useState(1);
    const [alltestamentaryDocsPrimary, setAlltestamentaryDocsPrimary] = useState(false);
    const [alltestamentaryDocsSupportPrimary, setAlltestamentaryDocsSupportPrimary] = useState(false);
    const [allSelectedDocsPrimary, setAllSelectedDocsPrimary] = useState(false);
    const [allSelectedDocsPrimaryList, setAllSelectedDocsPrimaryList] = useState([]);
    const [allDocumentReplcateForSpouse, setAllDocumentReplcateForSpouse] = useState(false);
    const [uploadfile, setUploadfile] = useState({});
    const [docFor, setDocFor] = useState("")
    const [manageCreate, setManageCreate] = useState({ createdBy: stateObj?.userId, createdOn: new Date().toISOString() })
    const [primaryIsfidOfSpouse, setprimaryIsfidOfSpouse] = useState(null)
    const [saveDisable, setSaveDisable] = useState(false);
    const [isEditReset, setIsEditReset] = useState(false)


    const [openUploadFileModal, setOpenUploadFileModal] = useState(false)

    konsole.log("selectedLegalDoc uploadfiless",
        // JSON.stringify(selectedLegalDocsObj)
        // allSelectedDocsPrimaryList
        uploadfile
        ,
        customAgentInfoObj
        // allSelectedDocsPrimary, selectedLegalDocumentForCheckingLength.length
    );

    useEffect(() => {
        checkSpouseFiduciary();
        getAgentRankList();
        props.callFiduciaryListFromChild(async () => await fiduciaryList());
        return () => {

        }
    }, [])

    useEffect(() => {
        if (allSelectedDocsPrimary === true && selectedLegalDocumentForCheckingLength.length > 1) {
            const change = JSON.parse(JSON.stringify(selectedLegalDocumentForCheckingLength));
            const filter = change.filter(({ legalDocId }, index) => (legalDocId !== 11 && legalDocId !== 17));
            setAllSelectedDocsPrimaryList(filter)

        } else {
            setAllSelectedDocsPrimaryList([]);
        }
        return () => {

        }
    }, [allSelectedDocsPrimary, selectedLegalDocumentForCheckingLength.length])

    useEffect(() => {
        fiduciaryList();
    }, [memberUserId, selectedLegalDocsObj?.legalDocId, selectedLegalDocsObj?.testDocId, selectedLegalDocsObj?.testSupportDocId])


    useEffect(() => {
        konsole.log("asdasdasd", fiduciaryMemberList);
        apiCallGetSharedFileStatus()
        if (isHipaaAndDoa) {
            setShowAssignAgentScreen(true);
            setCustomFiduciaryList([]);
            getUpsertedUserAgentNdMapp();
        }
        else {
            setShowAssignAgentScreen(false);
        }
    }, [primaryAgentRank, coAgentRank, successorRank, selectedLegalDocsObj?.legalDocId, selectedLegalDocsObj?.testDocId, selectedLegalDocsObj?.testSupportDocId])


    useEffect(() => {
        if (showAssignAgentScreen === true) return;

        const array = [];


        if (selectedLegalDocsObj?.agents !== undefined && selectedLegalDocsObj.agents.length > 0) {
            const selectedAgents = selectedLegalDocsObj.agents;
            const fileIndex = selectedAgents.findIndex((data) => data.fileId !== null);
            if (fileIndex >= 0) {
                const fileId = selectedAgents[fileIndex].fileId;
                getBinaryFilesFromUpload(fileId);
            }
            else {
                setUploadfile({});
            }
        }
        for (let fiduciary of fiduciaryMemberList) {
            let agentUserId = fiduciary.value;
            let agentUserRelation = fiduciary.relationWithUser;
            let agentUserName = fiduciary.label;
            if (selectedLegalDocsObj?.agents !== undefined && selectedLegalDocsObj.agents.length > 0) {
                const selectedAgents = selectedLegalDocsObj.agents;
                const agentObjIndex = selectedAgents.findIndex((data) => data.agentUserId !== null && data.agentUserId.toLowerCase() === fiduciary.value);
                if (agentObjIndex >= 0) {
                    array.push({ ...selectedAgents[agentObjIndex], agentUserName, upsertedBy: logUserId, agentUserRelation, checked: true });
                }
                else {
                    array.push({ ...$AHelper.agentReturnObj({ agentUserId, agentUserName, upsertedBy: logUserId, agentUserRelation }), checked: false })
                }
            }
            else {
                array.push({ ...$AHelper.agentReturnObj({ agentUserId, agentUserName, upsertedBy: logUserId, agentUserRelation }), checked: false })
                setUploadfile({})
            }
        }
        setCustomFiduciaryList(array);
    }, [showAssignAgentScreen, fiduciaryMemberList.length, memberUserId, selectedLegalDocsObj?.legalDocId, selectedLegalDocsObj?.testDocId, selectedLegalDocsObj?.testSupportDocId])

    useEffect(() => {
        konsole.log("jointAgents", jointAgents)
        if (selectedLegalDocsObj.ownershipId !== undefined && selectedLegalDocsObj.ownershipId !== null && selectedLegalDocsObj.ownershipId !== "") {
            if (selectedLegalDocsObj.ownershipId == 1) {
                setDocFor("Single")
            }
            else if (selectedLegalDocsObj.ownershipId == 2) {
                setDocFor("Joint")
            }
            else if (selectedLegalDocsObj.ownershipId == 3 && (maritalStatusId != 1 || maritalStatusId != 2)) {
                setDocFor("Single")
            }
            else {
                setDocFor("")
            }
        }


        if (jointAgents?.length > 0 && jointAgents !== undefined) {
            for (const s of jointAgents) {
                if ((s.legalDocId == selectedLegalDocsObj.legalDocId) && s.isJoin == true) {
                    setDocFor("Joint")
                }
                else if ((s.legalDocId == selectedLegalDocsObj.legalDocId) && s.isJoin == false) {
                    setDocFor("Single")
                }
            }
        }
    }, [selectedLegalDocsObj?.legalDocId, selectedLegalDocsObj.ownershipId])

    const checkSpouseFiduciary = () => {
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFiduciaryList + spouseUserId, "", (response, error) => {
            if (response) {
                const responseData = response.data.data
                const primaryIsfid = responseData.some(item => item.relationWithUser == "Spouse")
                setprimaryIsfidOfSpouse(primaryIsfid)
                konsole.log("spouseFiduciaryResponse", responseData, primaryIsfid)
            } else {
                konsole.log("spouseFiduciaryError", error)
            }
        })
    }


    const onButtonClickUploadFile = () => {
        // setOpenUploadFileModal(true)
        inputRef.current.click();
    }


    //  code for shared  file List -----------------------------------------------------------\
    const [sharedFileList, setSharedFileList] = useState([])
    const [allSharedFileList, setAllSharedFileList] = useState([])
    konsole.log('sharedFileListsharedFileList', sharedFileList)

    async function apiCallGetSharedFileStatus() {
        return new Promise((resolve, reject) => {
            props.dispatchloader(true)
            Services.getSharedFileStatus({ primaryMemberUserId: primaryUserId }).then((res) => {
                props.dispatchloader(false)
                setSaveDisable(false);
                konsole.log('res of ger shared file status', res)
                let responseData = res?.data?.data
                let agentArray = selectedLegalDocsObj?.agents
                konsole.log('agentArrayagentArray', agentArray, responseData)
                if (agentArray?.length == 0 || responseData?.length == 0) return;
                let filterFile = responseData.length > 0 && responseData?.filter(response => agentArray.some(agent => agent?.fileId == response?.fileId && agent?.memberUserId == response?.belongsTo  && response.isRead == true));
                konsole.log('arrOfSharedFilearrOfSharedFile', filterFile)
                setSharedFileList(filterFile)
                setAllSharedFileList(responseData)
                resolve('resolve')
            }).catch((err) => {
                props.dispatchloader(false)
                konsole.log(' err in get shared file status', err)
                resolve('err')
            })
        })
    }


    //  code for shared  file List -----------------------------------------------------------




    const apiCallGetUserListByRoleId = () => {
        const subtenantId = sessionStorage.getItem("SubtenantId");
        const stateObj = $AHelper.getObjFromStorage("stateObj");
        let josnObj = {
            "subtenantId": subtenantId, "isActive": true,
            // "roleId": stateObj.roleId 
            "userType": "LEGAL"

        }
        props.dispatchloader(true)

        return new Promise((resolve, reject) => {
            Services.getUserListByRoleId(josnObj).then((res) => {
                props.dispatchloader(false)
                konsole.log('res of getting paralegal list', res)
                let responseData = res?.data?.data;
                resolve(responseData)
            }).catch((err) => {
                props.dispatchloader(false)
                konsole.log('err in getting palarelgal', err)
                resolve('err')
            })
        })

    }

    const singleRadio = () => {
        return (
            <Form.Check
                inline
                className='d-flex gap-2 align-items-center'
                label={"Single"}
                name="selectSingleOrJoint"
                type="radio"
                value="Single"
                // id="selectAgentTypeForReplicate"
                onChange={(e) => setDocFor(e.target.value)}
                checked={docFor == "Single" ? true : false}
            />
        )
    }

    const jointRadio = () => {
        return (
            <Form.Check
                inline
                label={"Joint"}
                className='d-flex gap-2 align-items-center'
                name="selectSingleOrJoint"
                type="radio"
                value="Joint"
                // id="selectAgentTypeForReplicate"
                onChange={(e) => setDocFor(e.target.value)}
                checked={docFor == "Joint" ? true : false}
            />
        )
    }




    konsole.log("customsafhdjshgfasjkfg", customAgentInfoObj, customSuccessorInfoObj);
    return (
        <>
            {
                (showEditSuccessorModal === true) ?
                    <EditAgentSuccessor
                        showAssignRolesName={showAssignRolesName}
                        fiduciaryMemberList={fiduciaryMemberList}
                        primaryAgentRank={primaryAgentRank}
                        coAgentRank={coAgentRank}
                        setSelectedTypeOfAgent={setSelectedTypeOfAgent}
                        selectedTypeOfAgent={selectedTypeOfAgent}
                        showEditSuccessorModal={showEditSuccessorModal}
                        manageEditSuccessorModal={manageEditSuccessorModal}
                        customSuccessorInfoObj={customSuccessorInfoObj}
                        customAgentInfoObj={customAgentInfoObj}
                        setCustomAgentInfoObj={setCustomAgentInfoObj}
                        successorRank={successorRank}
                        setCustomSuccessorInfoObj={setCustomSuccessorInfoObj}
                    />
                    : <></>
            }
            {
                (showAgentModal == true) ?
                    <>
                        <AgentModal
                            editTypeAgent={editTypeAgent}
                            showAssignRolesName={showAssignRolesName}
                            fiduciaryMemberList={fiduciaryMemberList}
                            // fiduciaryMemberList={ (selectedLegalDocsObj.testDocId === 1 || selectedLegalDocsObj.testDocId === 4)?
                            //             fiduciaryMemberList.filter(data => data.relationWithUser !== "Spouse") : 
                            //             fiduciaryMemberList}
                            primaryAgentRank={primaryAgentRank}
                            coAgentRank={coAgentRank}
                            setSelectedTypeOfAgent={setSelectedTypeOfAgent}
                            selectedTypeOfAgent={selectedTypeOfAgent}
                            showAgentModal={showAgentModal}
                            manageAgentModal={manageAgentModal}
                            customSuccessorInfoObj={customSuccessorInfoObj}
                            customAgentInfoObj={customAgentInfoObj}
                            setCustomAgentInfoObj={setCustomAgentInfoObj}
                        />
                    </>
                    :
                    <></>
            }
            {
                (showSuccessorModal == true) ?
                    <>
                        <SuccessorModal
                            showAssignRolesName={showAssignRolesName}
                            customAgentInfoObj={customAgentInfoObj}
                            editTypeSuccessor={editTypeSuccessor}
                            fiduciaryMemberList={fiduciaryMemberList}
                            successorRank={successorRank}
                            showSuccessorModal={showSuccessorModal}
                            manageSuccessorModal={manageSuccessorModal}
                            customSuccessorInfoObj={customSuccessorInfoObj}
                            setCustomSuccessorInfoObj={setCustomSuccessorInfoObj}
                        />
                    </>
                    :
                    <></>
            }

            <Row className="border-bottom pt-3 p-2">
                <div className='d-flex justify-content-between'>
                    {(memberUserId == "Joint" && jointAgents?.length == 0) ?
                        <></> :
                        <div>
                            {isChecked == true && <h5 className='mb-2'><span className='selecteTextColor'>{showLegalName}</span></h5>}
                            <h5 className='selecteTextColor'>{showAssignRolesName}</h5>

                        </div>}
                    <div className='d-flex gap-3'>
                        {
                            ((fileTypeId !== null && fileTypeId !== 0) && selectedLegalDocsObj?.testDocId === undefined) ?
                                (Object.keys(uploadfile).length == 0) ? <>
                                    {(openUploadFileModal == false && memberUserId !== "Joint") &&
                                        <button className='btn' style={{ color: "#720c20", borderColor: "#720c20" }} onClick={onButtonClickUploadFile}>
                                            Click to Browse and Upload
                                        </button>}</>

                                    :
                                    <>
                                        <div className='d-flex flex-column'>
                                            <p className=''>{(uploadfile?.fileName !== undefined && uploadfile.fileName !== null) ? showLegalName + ".pdf" : ""}</p>
                                            <div className='d-flex gap-2'>
                                                {konsole.log("uploadfile12345", uploadfile)}
                                                {uploadfile?.fileInfo !== undefined && <PdfViewer2 uploadFileData={uploadfile} />}
                                                {memberUserId !== "Joint" && <button type="button" className="btn btn-secondary" style={{ marginLeft: "10px" }} onClick={onButtonClickUploadFile}>Edit</button>}
                                            </div>
                                        </div>
                                    </>
                                :
                                <></>
                        }
                        <input type="file" className="d-none" ref={inputRef} onChange={handleChange} />
                        {
                            ((customAgentInfoObj.agent.length > 0 || customSuccessorInfoObj.length > 0) && isHipaaAndDoa === true && memberUserId !== "Joint") && <Button onClick={() => manageEditSuccessorModal(showEditSuccessorModal)} className="Add-more-fiduciary" > Edit and Reset Agent  </Button>
                        }

                    </div>

                </div>

            </Row>


            {
                (showAssignAgentScreen === true) ?
                    <>
                        {(memberUserId == "Joint" && jointAgents?.length == 0) ?
                            <></> :
                            <div>
                                <Row className="border-bottom p-3">
                                    <h5 className=''>Primary {applicableRoleName}</h5>
                                    {
                                        (customAgentInfoObj.agentType == "sole") ?
                                            mapSoloAgentHere(applicableRoleName)
                                            :
                                            (customAgentInfoObj.agentType == "co") ?
                                                mapCoAgentHere(applicableRoleName)
                                                : <></>
                                    }
                                </Row>
                                <Row className="p-3">
                                    <h5 className=''>Successor {applicableRoleName}</h5>
                                    {
                                        mapSuccessorHere(applicableRoleName)
                                    }
                                </Row>

                                {(memberUserId === primaryUserId) &&
                                    <Row className='p-3 border-top' style={memberUserId == "Joint" ? { pointerEvents: "none", opacity: 0.6 } : {}}>
                                        <h5>{`${selectedLegalDocsObj.ownershipId == 3 ? "Choose owner type" : ""}`}</h5>
                                        <div className="d-flex mb-3">
                                            {/* {selectedLegalDocsObj.ownershipId === 1 && <>{singleRadio()}</>}
                                            {selectedLegalDocsObj.ownershipId === 2 && <>{jointRadio()}</>} */}
                                            {(selectedLegalDocsObj.ownershipId === 3 && (maritalStatusId == 1 || maritalStatusId == 2)) ? (
                                                <>
                                                    {singleRadio()}
                                                    {jointRadio()}
                                                </>
                                            ) : (
                                                <>
                                                    {singleRadio()}
                                                </>
                                            )}
                                        </div>
                                    </Row>}
                            </div>
                        }
                        {
                            selectedLegalDocsObj?.testDocId === undefined && (selectedLegalDocsObj?.testSupportDocId === undefined) && (selectedLegalDocumentsChecked === true || selectedTestamentoryDocs === true || selectedTestamentorySupportDocs === true) &&
                            <Row className='border-top p-0' style={memberUserId == "Joint" ? { pointerEvents: "none", opacity: 0.6 } : {}}>
                                <Row className='p-3'>
                                    <h5>Choose agents for replicate</h5>
                                    <div className="d-flex  mb-3">
                                        <Form.Check
                                            inline
                                            className='d-flex gap-2 align-items-center'
                                            label={"All " + showAssignRolesName}
                                            name="selectAgentTypeForReplicate"
                                            type="radio"
                                            id="selectAgentTypeForReplicate"
                                            onChange={() => setSelectAgentTypeForReplicate(agentTypesList["allAgentsId"])}
                                            checked={agentTypesList["allAgentsId"] === selectAgentTypeForReplicate}
                                        />
                                        <Form.Check
                                            inline
                                            label={"Only Successor " + showAssignRolesName}
                                            className='d-flex gap-2 align-items-center'
                                            name="selectAgentTypeForReplicate"
                                            type="radio"
                                            id="selectAgentTypeForReplicate"
                                            onChange={() => setSelectAgentTypeForReplicate(agentTypesList["successorId"])}
                                            checked={agentTypesList["successorId"] === selectAgentTypeForReplicate}
                                        />
                                    </div>
                                </Row>
                                <div className='d-flex border-top p-3'>
                                    <Row className='p-3 pt-0'>
                                        <h5>Replicate these agent for</h5>
                                        {
                                            selectedTestamentoryDocs === true ?
                                                <Col xs md="12" className="" >
                                                    <div className="form-check pt-1 d-flex">
                                                        <label className="form-check-label mt-1 ms-1 d-flex align-items-center " id="alltestamentaryDocsPrimary" name="alltestamentaryDocsPrimary">
                                                            <input
                                                                className="form-check-input me-2 "
                                                                type="checkbox"
                                                                id='alltestamentaryDocsPrimary'
                                                                name="alltestamentaryDocsPrimary"
                                                                onChange={(e) => handleCheckBoxChange(e)}
                                                                checked={alltestamentaryDocsPrimary}
                                                            />
                                                            All Testamentary Docs
                                                        </label>
                                                    </div>
                                                </Col>
                                                : <></>
                                        }
                                        {
                                            selectedTestamentorySupportDocs === true ?
                                                <Col xs md="12" className="" >
                                                    <div className="form-check pt-1 d-flex">
                                                        <label className="form-check-label mt-1 ms-1 d-flex align-items-center " id="alltestamentaryDocsSupportPrimary" name="alltestamentaryDocsSupportPrimary">
                                                            <input
                                                                className="form-check-input me-2 "
                                                                type="checkbox"
                                                                id='alltestamentaryDocsSupportPrimary'
                                                                name="alltestamentaryDocsSupportPrimary"
                                                                onChange={(e) => handleCheckBoxChange(e)}
                                                                checked={alltestamentaryDocsSupportPrimary}
                                                            />
                                                            All Ancillary Documents
                                                        </label>
                                                    </div>
                                                </Col>
                                                : <></>
                                        }
                                        {
                                            selectedLegalDocumentsChecked == true ?
                                                <Col xs md="12" className="" >
                                                    <div className="form-check pt-1">
                                                        <label className="form-check-label mt-1 ms-1 d-flex align-items-center " id="allSelectedDocument" name="allSelectedDocument">
                                                            <input
                                                                className="form-check-input me-2 "
                                                                type="checkbox"
                                                                id='allSelectedDocsPrimary'
                                                                name="allSelectedDocsPrimary"
                                                                onChange={(e) => handleCheckBoxChange(e)}
                                                                checked={allSelectedDocsPrimary}
                                                            />
                                                            All Selected Legal Docs
                                                        </label>
                                                    </div>
                                                    {
                                                        (allSelectedDocsPrimary === true) &&
                                                        <div className="form-check pt-1 ms-5">
                                                            {
                                                                allSelectedDocsPrimaryList.map((d, index) => {
                                                                    konsole.log("allSelectedDocsPrimaryList d", d);
                                                                    return (
                                                                        <label className="form-check-label mt-1 ms-1 d-flex align-items-center " id="allSelectedDocument" name="allSelectedDocsPrimaryList" key={allSelectedDocsPrimaryList + index}>
                                                                            <input
                                                                                className="form-check-input me-2 "
                                                                                type="checkbox"
                                                                                id='allSelectedDocsPrimaryList'
                                                                                name="allSelectedDocsPrimaryList"
                                                                                onChange={(e) => handleCheckBoxChange(e, index)}
                                                                                checked={d.checked}
                                                                            />
                                                                            {d.legalDocName}
                                                                        </label>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    }
                                                </Col>
                                                : <></>
                                        }

                                    </Row>
                                    {/* userAgentArray.length === 0 && */}
                                    {
                                        memberUserId === primaryUserId && spouseUserId !== "null" ?
                                            <Row className='p-3 pt-0'>
                                                <h5>Replicate these agent for Spouse</h5>
                                                {
                                                    <Col xs md="12" className="" >
                                                        <div className="form-check pt-1 d-flex">
                                                            <label className="form-check-label mt-1 ms-1 d-flex align-items-center " id="alltestamentaryDocsSupportSpouse" name="alltestamentaryDocsSupportSpouse">
                                                                <input
                                                                    className="form-check-input me-2 "
                                                                    type="checkbox"
                                                                    id='allDocumentReplcateForSpouse'
                                                                    name="allDocumentReplcateForSpouse"
                                                                    onChange={(e) => handleCheckBoxChange(e)}
                                                                    checked={allDocumentReplcateForSpouse}
                                                                />
                                                                Replicate primary document
                                                            </label>
                                                        </div>
                                                    </Col>
                                                }

                                            </Row>
                                            : <></>
                                    }
                                </div>
                            </Row>
                        }
                    </>
                    :
                   
                    (showAssignAgentScreen === false && isChecked == true) &&
                    <>
                        <Row className='ps-5 pt-5 mb-2'><h5 className='p-0'>People who have access to your {selectedLegalDocsObj.legalDocName} documents.</h5></Row>
                        <Row className='p-5 pt-1'>
                            {
                                customFiduciaryList.length > 0 && customFiduciaryList.map((fiduciary, index) => {
                                    return <Form.Check type='checkbox' id='customFiduciaryList' name='customFiduciaryList' className='d-flex gap-3 align-items-center' key={Math.random() * 10} label={fiduciary.agentUserName} onClick={(e) => handleCheckBoxChange(e, index)} checked={fiduciary.checked} />
                                })
                            }
                        </Row>
                    </>
            }
            {memberUserId !== "Joint" && <Row className="m-0 my-3">
                <Col xs md="12" className="d-flex align-items-center justify-content-end ps-0" >
                    <button className="theme-btn rounded" disabled={saveDisable} onClick={upsertAgentWithUser}> Save </button>
                </Col>
            </Row>}
        </>
    )

    function handleCheckBoxChange(e, index) {
        const event = e.target;
        const eventId = event.id;
        const eventName = event.name;
        const eventValue = event.value;
        const eventChecked = event.checked;
        if (eventName == "alltestamentaryDocsPrimary") {
            setAlltestamentaryDocsPrimary(eventChecked)
        }
        else if (eventName == "allSelectedDocsPrimary") {
            setAllSelectedDocsPrimary(eventChecked)
        }
        else if (eventName == "allSelectedDocsPrimaryList") {
            const allSelectedDocsPrimaryListObj = allSelectedDocsPrimaryList;
            allSelectedDocsPrimaryListObj[index].checked = eventChecked;
            setAllSelectedDocsPrimaryList(allSelectedDocsPrimaryListObj);
            setReRenderPage(!reRenderPage);
        }
        else if (eventName == "alltestamentaryDocsSupportPrimary") {
            setAlltestamentaryDocsSupportPrimary(eventChecked)
        }
        else if (eventName == "allDocumentReplcateForSpouse") {
            setAllDocumentReplcateForSpouse(eventChecked)
        }
        else if (eventName == "customFiduciaryList") {
            customFiduciaryList[index].checked = eventChecked
            setCustomFiduciaryList(customFiduciaryList);
            setReRenderPage(!reRenderPage);
        }
    }


    async function handleChange(e) {
        if (e.target.files.length > 0) {
            let typeOfFile = e.target.files[0].type;
            let fileofsize = e.target.files[0].size;


            konsole.log("typeOfFile", fileofsize, typeOfFile)
            if (typeOfFile !== "application/pdf") {
                toasterAlert("only pdf format allowed", "Warning")
                return;
            }
            if ($AHelper.fileuploadsizetest(fileofsize)) {
                toasterAlert(fileLargeMsg, "Warning");
                return;
            }
            const question = await context.confirm(true, "Are you sure? you want to upload this file.", "Confirmation");
            if (!!question) {
                handleFileUpload(e.target.files[0]);
            }
        }
    };


    async function saveUploadFile() {
        if (files == undefined || files == null || files == '') {
            toasterAlert('Please select file.', "Warning");
            return;
        }
        if (fileFolderId == undefined || fileFolderId == null || fileFolderId == '' || fileFolderId == 0) {
            toasterAlert('Please select folder.', "Warning");
            return;
        }

        konsole.log('filesfilesfilesaaaa', files)
        const question = await context.confirm(true, "Are you sure? you want to upload this file", "Confirmation");

        if (!!question) {
            handleFileUpload(files);
        }
    }

    function handleFileUpload(fileobj) {
        konsole.log('fileobjfileobjfileobj', fileobj)
        const jsonObj = {
            FileId: 0,
            UserId: primaryUserId,
            File: fileobj,
            UploadedBy: logUserId,
            FileTypeId: fileTypeId,
            FileCategoryId: fileCabinetTypeId,
            FileStatusId: fileStatusId,
            EmergencyDocument: false,
            DocumentLocation: '',
            UserFileName: fileobj?.name,
            Description: ''
        }
        konsole.log('jsonObjjsonObjjsonObj', jsonObj)
        props.dispatchloader(true)
        Services.postUploadUserDocumantV2({ ...jsonObj }).then((res) => {
            props.dispatchloader(false)
            konsole.log(" response data ss  ", res)
            setUploadfile(res.data.data)
            mappingFileWithCabinet(res.data.data)
        })
    }


    function mappingFileWithCabinet(responseData) {
        let { fileCategoryId, fileId, fileStatusId, fileTypeId } = responseData
        let belongsTo = [{ "fileBelongsTo": memberUserId }]

        let postJson = createFileCabinetFileAdd({ cabinetId: cabinetFileCabinetId[0], belongsTo, fileUploadedBy: logUserId, fileCategoryId, folderId: Number(folderIdOfEstatePlainingCurrent), fileId, fileStatusId: 2, fileTypeId, primaryUserId: primaryUserId, isShared: true, isActive: true, isMandatory: true, isFolder: false, isCategory: false, })
        konsole.log('postJsonpostJson', postJson)
        props.dispatchloader(true)
        Services.addUserFileCabinet(postJson).then((res) => {
            props.dispatchloader(false)
            konsole.log('addUserFileCabinet', res)
            setOpenUploadFileModal(false)
            callFilePermissionsApi(belongsTo, fileId)
        }).catch((err) => {
            props?.dispatchloader(false)
            konsole.log('err in file ading in cabiner', err, err?.response)
        })


    }
    async function callFilePermissionsApi(belongsToArr, fileId) {
        let result = await apiCallGetUserListByRoleId()
        if (result !== 'err') {
            let primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
            let permissionArr = []
            for (let j = 0; j < result.length; j++) {
                const newObj = cretaeJsonForFilePermission({ fileId: fileId, belongsTo: belongsToArr[0].fileBelongsTo, primaryUserId: primaryMemberUserId, sharedUserId: result[j].userId, isActive: true, isDelete: false, isEdit: false, isRead: true, ...manageCreate })
                permissionArr.push(newObj)
            }
            // const newObj = cretaeJsonForFilePermission({ primaryUserId: primaryMemberUserId, sharedUserId: paralegalList[i].userId, isActive: true, roleId:paralegalList[i].roleId, isDelete: true, isEdit: true, isRead: true, ...manageCreate })

            konsole.log('permissionArrpermissionArr', permissionArr)
            Services.upsertShareFileStatus(permissionArr).then((res) => {
                konsole.log('res of upser file share', res)
                setOpenUploadFileModal(false)
            }).catch((err) => {
                dispatchloader(false)
                setOpenUploadFileModal(false)
                konsole.log('err in upsert sharefile', err)
            })
        }


    }
    function getAgentRankList() {
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAgentRankList, "", (response) => {
            if (response) {
                konsole.log("getAgentRankList", response.data.data);
                const agentRank = response.data.data;
                const primaryAgentRank = agentRank[0];
                const coAgentRank = agentRank.filter((rank) => rank.label.toLowerCase().includes("agent"));
                const successorRank = agentRank.filter((rank) => rank.label.toLowerCase().includes("successor"));
                konsole.log("coAgent response", successorRank, "successor Rank", successorRank, "primaryAgentRank", primaryAgentRank);
                setPrimaryAgentRank([primaryAgentRank])
                setCoAgentRank(coAgentRank);
                setSuccessorRank(successorRank);
            }
        }
        );
    };

    function manageAgentModalType(showAgentModalValue, editType) {
        setEditTypeAgent(editType);
        manageAgentModal(showAgentModalValue);
    }

    function manageSuccessorModalType(showSuccessorModalValue, editType) {
        setEditTypeSuccessor(editType);
        manageSuccessorModal(showSuccessorModalValue);
    }

    function manageAgentModal(showAgentModalValue) {
        setShowAgentModal(!showAgentModalValue);
    }

    function manageEditSuccessorModal(showEditSuccessorModal,type) {
        if(type == 'close'){
            setIsEditReset(false)
        }else{
            setIsEditReset(true)
        }
        setShowEditSuccessorModal(!showEditSuccessorModal);
    }

    function manageSuccessorModal(showSuccessorModalValue) {
        setShowSuccessorModal(!showSuccessorModalValue);
    }


    function fiduciaryList() {
        const userId = sessionStorage.getItem("SessPrimaryUserId");
        const primaryUserDetail = $AHelper.getObjFromStorage("userDetailOfPrimary");
        const spouseUserId = sessionStorage.getItem("spouseUserId");
        const loggedUserId = sessionStorage.getItem("loggedUserId");
        props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFiduciaryList + userId, "", async (response) => {
            props.dispatchloader(false)
            if (response) {
                let responseData = $AHelper.deceasedNIncapacititedFilterFun(response.data.data)
                konsole.log("fiduciaryList response of fiduciary list", responseData, response.data.data);
                if (memberUserId.toLowerCase() == spouseUserId.toLowerCase()) {
                    let filterFiduciaryList = responseData.filter(data => data.relationWithUser !== "Spouse");
                    let filteredMapArray = filterFiduciaryList.map(data => {
                        const relationWithMember = (data.relationWithSpouse !== null) ? data.relationWithSpouse : data.relationWithUser;
                        return { ...data, relationWithUser: relationWithMember }
                    });

                    if (selectedLegalDocsObj.legalDocId === 2) {
                        filteredMapArray.unshift({ value: spouseUserId, label: primaryUserDetail?.spouseName, relationWithUser: "Self", relationWithSpouse: null });
                    }

                    let url = `${$Service_Url.postMemberRelationship}/${spouseUserId}?primaryUserId=${spouseUserId}`;
                    let method = "GET";
                    let results = await $postServiceFn.memberRelationshipAddPut(method, url);

                    konsole.log("results1212",results)

                    if (results?.data?.data?.isFiduciary !== undefined && results?.data?.data?.isFiduciary == true) {
                        filteredMapArray.unshift({ value: userId, label: primaryUserDetail?.memberName, relationWithUser: "Spouse" });
                    }
                    konsole.log(" resultsresultsaaresultsresultsaa", filteredMapArray);
                    // konsole.log('resultsresultsaa', results, results?.data?.data?.isFiduciary)
                
                    let filteredData = filteredMapArray;
                    if ([1, 4, 14].includes(selectedLegalDocsObj?.testDocId)) {
                        filteredData =  filteredMapArray.length > 0 && filteredMapArray.filter(
                            item => item.value !== spouseUserId && item.value !== primaryUserId
                        );
                    }
                    setFiduciaryMemberList(filteredData);
                }
                else {
                    if (selectedLegalDocsObj.legalDocId === 2) {
                        responseData.unshift({ value: userId, label: primaryUserDetail?.memberName, relationWithUser: "Self" });
                    }

                    let filteredData = responseData;
                    if ([1, 4, 14].includes(selectedLegalDocsObj?.testDocId)) {
                        filteredData = responseData.length > 0 && responseData.filter(
                            item => item.value !== spouseUserId && item.value !== primaryUserId
                        );
                    }
                    setFiduciaryMemberList(filteredData)
                }
                setReRenderPage(!reRenderPage)
            }
        }
        );
    };

    function mapSoloAgentHere(pageName) {
        return (
            <>

                {
                    (customAgentInfoObj.agent.length > 0) ?
                        customAgentInfoObj.agent.map((agent, index) => {
                            return (
                                <>
                                    <div className="card ms-0  mt-4  w-50 p-0" key={index}>
                                        <div className="card-header d-flex justify-content-between" style={{ backgroundColor: "#751521", color: "white" }} >
                                            <span>Primary {pageName}</span>
                                            <AssignAgentDecease key={index} memberUserId={agent.agentUserId} />
                                            {/* <span className='cursor-pointer' onClick={() => manageAgentModalType(showAgentModal, "edit")} style={{ textDecoration: "underline" }}>Edit</span> */}
                                        </div>
                                        <div className="card-body  text-center" style={containerBoxSize}>
                                            <p className="card-text fs-5 w-100 fw-bold">
                                                {agent.agentUserName}
                                            </p>
                                            {/* <p className="card-text fs-5 w-100 fw-bold">
                                                {agent.agentUserRelation}
                                            </p> */}
                                        </div>
                                    </div>
                                </>
                            )
                        })
                        :
                        <>
                            <div className="card ms-0  mt-4  w-50 p-0" onClick={() => manageAgentModalType(showAgentModal, "add")} style={memberUserId == "Joint" ? { pointerEvents: "none", opacity: 0.5 } : {}}>
                                <div className="card-header" style={{ backgroundColor: "#751521", color: "white" }}> Primary {pageName}</div>
                                <div className="card-body  text-center" style={containerBoxSize}>
                                    <img src="/images/Add.png" className='m-0 cursor-pointer' alt="Profile" />
                                    <p className="card-text text-center fs-5 mt-2 w-100 fw-bold col-12 text-truncate">
                                        {/* {items.fullName}-{items.relationWithMember} */}
                                        Add {pageName}
                                    </p>
                                </div>
                            </div>
                        </>
                }

            </>
        )
    }

    function mapCoAgentHere(pageName) {
        return (
            <>
                {
                    (customAgentInfoObj.agent.length > 0) ?
                        <>
                            {
                                customAgentInfoObj.agent.map((agent, index) => {
                                    return (
                                        <>
                                            <div className="card ms-0  mt-4 w-50 p-0" key={index}>
                                                <div className="card-header d-flex justify-content-between" style={{ backgroundColor: "#751521", color: "white" }} >
                                                    <span>Co {pageName} {index + 1}</span>
                                                    <AssignAgentDecease key={index} memberUserId={agent.agentUserId} />
                                                    {/* <span className='cursor-pointer' onClick={() => manageAgentModalType(showAgentModal, "edit")} style={{ textDecoration: "underline" }}>Edit</span> */}
                                                </div>
                                                <div className="card-body  text-center" style={containerBoxSize}>
                                                    <p className="card-text fs-5 w-100 fw-bold">
                                                        {agent.agentUserName}
                                                    </p>
                                                    {/* <p className="card-text fs-5 w-100 fw-bold">
                                                        {agent.agentUserRelation}
                                                    </p> */}
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            }
                            <div className="card ms-0  mt-4  w-50 p-0" onClick={() => manageAgentModalType(showAgentModal, "add")} style={memberUserId == "Joint" ? { pointerEvents: "none", opacity: 0.5 } : {}}>
                                <div className="card-header" style={{ backgroundColor: "#751521", color: "white" }}>Co-{pageName}</div>
                                <div className="card-body  text-center" style={containerBoxSize}>
                                    <img src="/images/Add.png" className='m-0 cursor-pointer' alt="Profile" />
                                    <p className="card-text text-center fs-5 mt-2 w-100 fw-bold col-12 text-truncate">
                                        {/* {items.fullName}-{items.relationWithMember} */}
                                        Add Co {pageName}
                                    </p>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className="card ms-0  mt-4  w-50 p-0" onClick={() => manageAgentModalType(showAgentModal, "add")} style={memberUserId == "Joint" ? { pointerEvents: "none", opacity: 0.5 } : {}}>
                                <div className="card-header" style={{ backgroundColor: "#751521", color: "white" }}> Co-{pageName}</div>
                                <div className="card-body  text-center" style={containerBoxSize}>
                                    <img src="/images/Add.png" className='m-0 cursor-pointer' alt="Profile" />
                                    <p className="card-text text-center fs-5 mt-2 w-100 fw-bold col-12 text-truncate">
                                        {/* {items.fullName}-{items.relationWithMember} */}
                                        Add Co {pageName}
                                    </p>
                                </div>
                            </div>
                        </>
                }
            </>
        )
    }


    function mapSuccessorHere(pageName) {
        return (
            <>
                {
                    (customSuccessorInfoObj.length > 0) ?
                        <>
                            {
                                customSuccessorInfoObj.map((agent, index) => {
                                    return (
                                        <>
                                            <div className="card ms-0  mt-4  w-50 p-0 " key={index}>
                                                <div className="card-header d-flex justify-content-between" style={{ backgroundColor: "#751521", color: "white" }} >
                                                    <span>{ordinal_suffix_of(index + 1)} Successor {pageName} </span>
                                                    <AssignAgentDecease key={index} memberUserId={agent.agentUserId} />
                                                    {/* <span className='cursor-pointer' onClick={() => manageSuccessorModalType(showSuccessorModal, "edit")} style={{textDecoration: "underline"}}>Edit</span> */}
                                                </div>
                                                <div className="card-body  text-center" style={containerBoxSize}>
                                                    <p className="card-text fs-5 w-100 fw-bold">
                                                        {agent.agentUserName}
                                                    </p>
                                                    {/* <p className="card-text fs-5 w-100 fw-bold">
                                                        {agent.agentUserRelation}
                                                    </p> */}
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            }
                            <div className="card ms-0  mt-4  w-50 p-0" onClick={() => manageSuccessorModalType(showSuccessorModal, "add")} style={memberUserId == "Joint" ? { pointerEvents: "none", opacity: 0.5 } : {}}>
                                <div className="card-header" style={{ backgroundColor: "#751521", color: "white" }}>Successor {pageName}</div>
                                <div className="card-body  text-center" style={containerBoxSize}>
                                    <img src="/images/Add.png" className='m-0 cursor-pointer' alt="Profile" />
                                    <p className="card-text text-center fs-5 mt-2 w-100 fw-bold col-12 text-truncate">
                                        {/* {items.fullName}-{items.relationWithMember} */}
                                        Add Successor {pageName}
                                    </p>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className="card ms-0  mt-4  w-50 p-0" onClick={() => manageSuccessorModalType(showSuccessorModal, "add")} style={memberUserId == "Joint" ? { pointerEvents: "none", opacity: 0.5 } : {}}>
                                <div className="card-header" style={{ backgroundColor: "#751521", color: "white" }}> Successor {pageName}</div>
                                <div className="card-body  text-center" style={containerBoxSize}>
                                    <img src="/images/Add.png" className='m-0' alt="Profile" style={{ cursor: "pointer" }} />
                                    <p className="card-text text-center fs-5 mt-2 w-100 fw-bold col-12 text-truncate">
                                        {/* {items.fullName}-{items.relationWithMember} */}
                                        Add Successor {pageName}
                                    </p>
                                </div>
                            </div>
                        </>
                }
            </>
        )
    }



    function toasterAlert(test) {
        context.setdata($AHelper.toasterValueFucntion(true, test, "Warning"))
    }


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


    function agentmapping({ testDocId, legalDocId, applicableRoleId, testSupportDocId }, customAgentObj, memberUserId, logUserId, fileId = null, isJoin) {
        return { ...customAgentObj, testDocId: testDocId ?? null, testSupportDocId: testSupportDocId ?? null, legalDocId: legalDocId, agentRoleId: applicableRoleId, memberUserId: memberUserId, upsertedBy: logUserId, fileId: fileId, isJoin }

    }

    async function upsertAgentWithUser() {
        setSaveDisable(true);
        const selectedLegalDocs = selectedLegalDocsObj;
        konsole.log("selectedLegalDocsselectedLegalDocs0", selectedLegalDocs)

        let alltestamentaryDocsPrimaryy = alltestamentaryDocsPrimary;
        let allSelectedDocsPrimaryy = allSelectedDocsPrimary;
        let alltestamentaryDocsSupportPrimaryy = alltestamentaryDocsSupportPrimary;
        let isSelfJsonCustom = false;
        let isSelfJsonSuccess = false;
        let documentForSingleOrJoint = docFor == "Joint" ? true : false

        if (selectedLegalDocs.legalDocId === 2 && selectedLegalDocs?.testDocId === undefined && selectedLegalDocs?.testSupportDocId === undefined && (alltestamentaryDocsPrimaryy == true || allSelectedDocsPrimaryy === true || alltestamentaryDocsSupportPrimaryy === true)) {

            isSelfJsonCustom = customAgentInfoObj.agent.some(({ agentUserId, agentUserRelation }, index) => (agentUserId === memberUserId && agentUserRelation === "Self"));
            isSelfJsonSuccess = customSuccessorInfoObj.some(({ agentUserId, agentUserRelation }, index) => (agentUserId === memberUserId && agentUserRelation === "Self"));
            const isAnyOtherTestamentoryDocumentCheck = selectedTestamentoryDocsList.some((d) => (d.legalDocId !== 2));
            const isAnyOtherTestamentorySupportDocumentCheck = selectedTestamentorySupportDocsList.some((d) => (d.legalDocId !== 2));
            konsole.log("isSelfJson", isSelfJsonCustom, isSelfJsonSuccess, isAnyOtherTestamentoryDocumentCheck, isAnyOtherTestamentorySupportDocumentCheck, selectedLegalDocumentsChecked, customAgentInfoObj.agent, customSuccessorInfoObj);

            if ((isSelfJsonCustom === true || isSelfJsonSuccess === true) && (isAnyOtherTestamentoryDocumentCheck === true || isAnyOtherTestamentorySupportDocumentCheck === true || selectedLegalDocumentsChecked === true)) {
                const consent = await context.confirm(true, "Client has chosen himself/herself as an agent which cannot be replicated to other documents, please confirm to proceed further.", "Confirmation");

                if (consent !== true) {
                    setSaveDisable(false);
                    return;
                }

                allSelectedDocsPrimaryy = false;
                alltestamentaryDocsPrimaryy = false;
                alltestamentaryDocsSupportPrimaryy = false;

            }
            else if (isSelfJsonCustom === true || isSelfJsonSuccess === true) {
                allSelectedDocsPrimaryy = false;
                alltestamentaryDocsPrimaryy = false;
                alltestamentaryDocsSupportPrimaryy = false;
            }
        }

        let agentSaveObj = [];
        let agentSaveSpouseObj = [];
        let deleteAgents = [];
        const legalDocId = legalDocId;

        konsole.log(" alltestamentaryDocsPrimary", alltestamentaryDocsPrimaryy, " allSelectedDocsPrimary ", allSelectedDocsPrimaryy, " alltestamentaryDocsSupportPrimary", alltestamentaryDocsSupportPrimaryy)

        if (alltestamentaryDocsPrimaryy === false && allSelectedDocsPrimaryy === false && alltestamentaryDocsSupportPrimaryy === false) {
            const fileId = (uploadfile?.fileId !== undefined) ? uploadfile.fileId : null;
            let deleteReplicateAgent = [];
            konsole.log("fileIdasdasdasdsa", fileId);
            if (isHipaaAndDoa) {
                for (let agentObj of customAgentInfoObj.agent) {
                    agentSaveObj.push(agentmapping(selectedLegalDocs, agentObj, memberUserId, logUserId, fileId, documentForSingleOrJoint));
                    konsole.log("selectedLegalDocsselectedLegalDocs1", customAgentInfoObj.agent, agentmapping(selectedLegalDocs, agentObj, memberUserId, logUserId, fileId, documentForSingleOrJoint))
                }
                for (let successorObj of customSuccessorInfoObj) {
                    agentSaveObj.push(agentmapping(selectedLegalDocs, successorObj, memberUserId, logUserId, fileId, documentForSingleOrJoint));
                    konsole.log("d", customSuccessorInfoObj, agentmapping(selectedLegalDocs, successorObj, memberUserId, logUserId, fileId, documentForSingleOrJoint))
                }
            }
            else {
                for (let fiduciaryObj of customFiduciaryList) {
                    if (fiduciaryObj.checked === false) continue;
                    agentSaveObj.push(agentmapping(selectedLegalDocs, fiduciaryObj, memberUserId, logUserId, fileId, documentForSingleOrJoint));
                }
                const everyFidFalse = customFiduciaryList.every(d => d.checked === false);
                if (everyFidFalse === true) {
                    agentSaveObj.push($AHelper.agentReturnObj({ ...selectedLegalDocs, memberUserId, upsertedBy: logUserId, agentRoleId: selectedLegalDocs.applicableRoleId, fileId, documentForSingleOrJoint }))
                }

            }

            if (selectedLegalDocsObj?.agents !== undefined && selectedLegalDocsObj?.agents.length > 0) {
                const selectedAgents = selectedLegalDocsObj?.agents;
                const filteredArray = selectedAgents.filter(item1 => !agentSaveObj.find(ag => item1.agentId === ag.agentId));
                for (let fol of filteredArray) {
                    deleteReplicateAgent.push({ ...agentmapping(selectedLegalDocs, fol, memberUserId, logUserId), agentActiveStatus: false, fileId: fol?.fileId });
                    konsole.log("selectedLegalDocsselectedLegalDocs4", { ...agentmapping(selectedLegalDocs, fol, memberUserId, logUserId), agentActiveStatus: false })
                }
            }

            if ((isSelfJsonCustom === true || isSelfJsonSuccess === true) && (alltestamentaryDocsPrimary === true || alltestamentaryDocsSupportPrimary === true)) {
                const testamentaryDocs = selectedLegalDocs.testamentaryDocs;
                const testamentarySupportDocs = selectedLegalDocs.testamentarySupportDocs;

                if (testamentaryDocs.length > 0 && alltestamentaryDocsPrimary === true) {
                    for (let testDoc of testamentaryDocs) {

                        if (testDoc.testamentaryDocsChecked === true) {
                            agentSaveObj.push(...mapUpsertAgent(testDoc));
                        }

                        if (testDoc?.agents !== undefined && testDoc?.agents.length > 0) {
                            const selectedAgents = testDoc?.agents;
                            const filteredArray = selectedAgents.filter(item1 => !agentSaveObj.find(ag => item1.agentId === ag.agentId));
                            for (let fol of filteredArray) {
                                deleteReplicateAgent.push({ ...agentmapping(selectedLegalDocs, fol, memberUserId, logUserId), agentActiveStatus: false, fileId: fol?.fileId });
                                konsole.log("selectedLegalDocsselectedLegalDocs4", { ...agentmapping(selectedLegalDocs, fol, memberUserId, logUserId), agentActiveStatus: false })
                            }
                        }
                    }
                }

                if (testamentarySupportDocs.length > 0 && alltestamentaryDocsSupportPrimary === true) {
                    for (let testDoc of testamentarySupportDocs) {

                        if (testDoc.testamentarySupportDocsChecked === true) {
                            agentSaveObj.push(...mapUpsertAgent(testDoc));
                        }

                        if (testDoc?.agents !== undefined && testDoc?.agents.length > 0) {
                            const selectedAgents = testDoc?.agents;
                            const filteredArray = selectedAgents.filter(item1 => !agentSaveObj.find(ag => item1.agentId === ag.agentId));
                            for (let fol of filteredArray) {
                                deleteReplicateAgent.push({ ...agentmapping(selectedLegalDocs, fol, memberUserId, logUserId), agentActiveStatus: false, fileId: fol?.fileId });
                                konsole.log("selectedLegalDocsselectedLegalDocs4", { ...agentmapping(selectedLegalDocs, fol, memberUserId, logUserId), agentActiveStatus: false })
                            }
                        }

                    }
                }

                konsole.log("filteredForRevocableTrustfilteredForRevocableTrustfilteredForRevocableTrustfilteredForRevocableTrust", agentSaveObj);
                if (allDocumentReplcateForSpouse === true) {
                    let agentForSpouse = [];
                    let deleteAgentsSpouse = [];

                    const filteredForRevocableTrust = userAgentArrayForSpouse.filter(({ legalDocId }) => (legalDocId === 2));

                    for (let agent of filteredForRevocableTrust) {
                        deleteAgentsSpouse.push({ ...$AHelper.agentReturnObj(agent), upsertedBy: logUserId, agentActiveStatus: false });
                    }

                    for (let agent of agentSaveObj) {
                        const agentObj = JSON.parse(JSON.stringify(agent));
                        if (agent.agentUserId.toLowerCase() === spouseUserId.toLowerCase()) {
                            agentObj.agentUserId = primaryUserId;
                        } else if (agent.agentUserId.toLowerCase() === primaryUserId.toLowerCase()) {
                            agentObj.agentUserId = spouseUserId;
                        }
                        agentObj.memberUserId = spouseUserId;
                        agentObj.agentId = 0;
                        

                        if (!((agentObj?.agentUserId === spouseUserId || agentObj?.agentUserId === primaryUserId) && [1,4,14].includes(agentObj?.testDocId))) {
                            agentForSpouse.push(agentObj);
                        }
                       
                    }                
                   
                    agentSaveSpouseObj.push(...agentForSpouse, ...deleteAgentsSpouse);
                }
            }

            if (deleteReplicateAgent.length > 0) {
                agentSaveObj.push(...deleteReplicateAgent);
                let sharedFileForDelete = sharedFileList?.filter(shareFile => deleteReplicateAgent.some(deleteAgent => deleteAgent.fileId == shareFile.fileId && shareFile.sharedUserId == deleteAgent.agentUserId))
                konsole.log("sharedFileForDelete", sharedFileForDelete)
                if (sharedFileForDelete?.length > 0) {
                    let newArr = sharedFileForDelete.map((obj) => (cretaeJsonForFilePermission({ ...obj, 'updatedBy': stateObj.userId, 'isAdd': false, 'isEdit': false, 'isRead': false, 'isDelete': false })))
                    props.dispatchloader(true);
                    let result = await filepermissionsfun(newArr)
                    props.dispatchloader(false);
                    konsole.log('sharedFileForDeletesharedFileForDelete', result, newArr)
                }

                konsole.log('deleteReplicateAgentdeleteReplicateAgent', deleteReplicateAgent)
            }

            for (let legalDocs of legalDocuments) {
                const testamentaryDocs = legalDocs.testamentaryDocs;
                const testamentarySupportDocs = legalDocs.testamentarySupportDocs;
                if (testamentaryDocs.length > 0) {
                    for (let testDoc of testamentaryDocs) {
                        if (testDoc.testamentaryDocsChecked === false && testDoc?.agents?.length > 0) {
                            for (let agentObj of testDoc.agents) {
                                deleteAgents.push({ ...agentmapping(selectedLegalDocs, agentObj, memberUserId, logUserId), agentActiveStatus: false });
                                konsole.log("selectedLegalDocsselectedLegalDocs5", testDoc.agents, { ...agentmapping(selectedLegalDocs, agentObj, memberUserId, logUserId), agentActiveStatus: false })
                            }
                        }
                    }
                }
                if (testamentarySupportDocs.length > 0) {
                    for (let testDoc of testamentarySupportDocs) {
                        if (testDoc.testamentarySupportDocsChecked === false && testDoc?.agents?.length > 0) {
                            for (let agentObj of testDoc.agents) {
                                deleteAgents.push({ ...agentmapping(selectedLegalDocs, agentObj, memberUserId, logUserId), agentActiveStatus: false });
                                konsole.log("selectedLegalDocsselectedLegalDocs6", { ...agentmapping(selectedLegalDocs, agentObj, memberUserId, logUserId), agentActiveStatus: false })

                            }
                        }
                    }
                }
                if (legalDocs.checked === false && legalDocs?.agents?.length > 0) {
                    for (let agentObj of legalDocs.agents) {
                        konsole.log('agentObjagentObj', agentObj)
                        deleteAgents.push({ ...agentmapping(selectedLegalDocs, agentObj, memberUserId, logUserId, agentObj.fileId), agentActiveStatus: false });
                        konsole.log("selectedLegalDocsselectedLegalDocs7", { ...agentmapping(selectedLegalDocs, agentObj, memberUserId, logUserId), agentActiveStatus: false })
                    }
                }
            }

            if (deleteAgents.length > 0) {
                let confirmQuestion = await context.confirm(true, "Are you sure? You want to delete the unselected legal document agents.", "Confirmation");
                if (!!confirmQuestion) {
                    agentSaveObj.push(...deleteAgents);

                    let sharedFileForDelete = allSharedFileList?.filter(shareFile => deleteAgents.some(deleteAgent => deleteAgent.fileId == shareFile.fileId && shareFile.sharedUserId == deleteAgent.agentUserId))
                    konsole.log("sharedFileForDelete", sharedFileForDelete)
                    if (sharedFileForDelete.length > 0) {
                        let newArr = sharedFileForDelete.map((obj) => (cretaeJsonForFilePermission({ ...obj, 'updatedBy': stateObj.userId, 'isAdd': false, 'isEdit': false, 'isRead': false, 'isDelete': false })))
                        props.dispatchloader(true)
                        let result = await filepermissionsfun(newArr)
                        props.dispatchloader(false)
                        konsole.log('sharedFileForDeletesharedFileForDelete', result, newArr)
                    }
                }
                else {
                    setSaveDisable(false);
                    return;
                }
            }
        }
        if (alltestamentaryDocsPrimaryy == true || allSelectedDocsPrimaryy === true || alltestamentaryDocsSupportPrimaryy === true) {
            // ADDD CAlling
            const fileId = (uploadfile?.fileId !== undefined) ? uploadfile.fileId : null;
            for (let agentObj of customAgentInfoObj.agent) {
                agentSaveObj.push({ ...agentmapping(selectedLegalDocs, agentObj, memberUserId, logUserId,fileId,documentForSingleOrJoint),agentId:0});

            }
            for (let successorObj of customSuccessorInfoObj) {
                agentSaveObj.push({ ...agentmapping(selectedLegalDocs, successorObj, memberUserId, logUserId, fileId,  documentForSingleOrJoint), agentId: 0});

            }

            agentSaveObj.push(...conditionCheckingForReplicate(), ...selectedTestamentaryMappedDocuments(), ...selectedTestamentarySupportMappedDocuments());
            if (allDocumentReplcateForSpouse === true) {
                konsole.log("customobj", customAgentInfoObj, customSuccessorInfoObj, agentSaveObj);
                let agentForSpouse = [];
                let deleteAgentsSpouse = [];

                const checkPrimaryIsSpouseFid = primaryIsfidOfSpouse == false ? agentSaveObj.filter(item => item.agentUserRelation !== 'Spouse') : agentSaveObj;
                
                function processAgents(docs,isChecked) {
                    for (let doc of docs) {
                        if (doc?.agents?.length > 0 && doc[isChecked] === false) {
                            filterAndPush(doc);
                        }
                    }
                }                
                function filterAndPush(doc) {
                    const { testDocId, testSupportDocId, legalDocId } = doc;
                    const filteredData = userAgentArrayForSpouse.length > 0 && userAgentArrayForSpouse.filter(
                        (ele) => ele?.testDocId == testDocId && ele?.testSupportDocId == testSupportDocId && ele?.legalDocId == legalDocId
                    );
                    for (let newData of filteredData) {
                        deleteAgentsSpouse.push({ ...newData, agentActiveStatus: false,UpsertedBy:logUserId });
                    }
                }
                for (let legalDocs of legalDocuments) {
                    processAgents([legalDocs],'checked'); // Process top-level agents
                    processAgents(legalDocs.testamentaryDocs ?? [],'testamentaryDocsChecked'); // Process testamentaryDocs
                    processAgents(legalDocs.testamentarySupportDocs ?? [],'testamentarySupportDocsChecked'); // Process testamentarySupportDocs
                }
                for (let agent of checkPrimaryIsSpouseFid) {
                        const agentObj = JSON.parse(JSON.stringify(agent));
                        if (agent.agentUserId.toLowerCase() === spouseUserId.toLowerCase()) {
                            agentObj.agentUserId = primaryUserId;
                        }
                        
                        agentObj.memberUserId = spouseUserId;
                        agentObj.agentId = 0;
                        
                        
                        if (!((agentObj?.agentUserId === spouseUserId || agentObj?.agentUserId === primaryUserId) && [1,4,14].includes(agentObj?.testDocId))) {
                            agentForSpouse.push(agentObj);
                        }                  
                }
                agentSaveSpouseObj.push(...agentForSpouse, ...deleteAgentsSpouse);
                }
                
              
                if (selectedLegalDocsObj?.agents !== undefined && selectedLegalDocsObj?.agents.length > 0) {
                    const selectedAgents = selectedLegalDocsObj?.agents;
                    const filteredArray = selectedAgents.filter(item1 => !agentSaveObj.find(ag => item1.agentId === ag.agentId));
                  
                    for (let fol of filteredArray) {
                        agentSaveObj.push({ ...agentmapping(selectedLegalDocs, fol, memberUserId, logUserId), agentActiveStatus: false, documentForSingleOrJoint });
                    }
                }
               

            if (allSelectedDocsPrimary === true) {
                for (let legalDocs of legalDocuments) {
                    if ((selectedLegalDocs.selectedLegalDocumentType === selectedDocumentType["legalDocs"] && legalDocs.legalDocId === selectedLegalDocs.legalDocId) || legalDocs.legalDocId === 11 || legalDocs.legalDocId === 17) continue;
                    if (legalDocs.checked === false && legalDocs?.agents !== undefined && legalDocs?.agents?.length > 0) {                       
                        for (let agentObj of legalDocs.agents) {
                            // deleteAgents.push({ ...agentmapping(selectedLegalDocs, agentObj, memberUserId, logUserId), agentActiveStatus: false, documentForSingleOrJoint });
                        }                       
                    }
                }
            }


            if (alltestamentaryDocsPrimary === true) {
                for (let legalDocs of legalDocuments) {
                    const testamentaryDocs = legalDocs.testamentaryDocs;
                    if (testamentaryDocs.length > 0 && legalDocs?.checked == true) {
                        for (let testDoc of testamentaryDocs) {
                            if (selectedLegalDocs.selectedLegalDocumentType === selectedDocumentType["testamentaryDocs"] && testDoc.testDocId === selectedLegalDocs.testDocId) continue;
                            if (testDoc.testamentaryDocsChecked === false && testDoc?.agents !== undefined && testDoc?.agents?.length > 0) {
                             
                                for (let agentObj of testDoc.agents) {
                                    deleteAgents.push({ ...agentmapping(selectedLegalDocs, agentObj, memberUserId, logUserId), agentActiveStatus: false });
                                }
                                
                            }
                        }
                    }
                    if(legalDocs?.checked == false && legalDocs?.agents?.length > 0){
                        for (let agentObj of legalDocs.agents) {
                            deleteAgents.push({ ...agentmapping(selectedLegalDocs, agentObj, memberUserId, logUserId), agentActiveStatus: false });
                        }
                      }
                }
            }
            if (alltestamentaryDocsSupportPrimary === true) {
                for (let legalDocs of legalDocuments) {
                    const testamentarySupportDocs = legalDocs.testamentarySupportDocs;
                    if (testamentarySupportDocs?.length > 0) {
                        for (let testDoc of testamentarySupportDocs) {
                            if (selectedLegalDocs.selectedLegalDocumentType === selectedDocumentType["testamentarySupportDocs"] && testDocSupport.testSupportDocId === selectedLegalDocs.testSupportDocId) continue;
                            if (testDoc.testamentarySupportDocsChecked === false && testDoc.agents !== undefined && testDoc?.agents?.length > 0) {
                                for (let agentObj of testDoc.agents) {
                                    deleteAgents.push({ ...agentmapping(selectedLegalDocs, agentObj, memberUserId, logUserId), agentActiveStatus: false });
                                }
                            }
                        }
                    }
                }
            }
            if (deleteAgents.length > 0) {
                // Add Calling
                let confirmQuestion = await context.confirm(true, "Are you sure? You want to delete the unselected legal document agents.", "Confirmation");
                if (!!confirmQuestion) {
                    agentSaveObj.push(...deleteAgents);
                }
            }
            if (userAgentArray.length > 0) {
                // Add Calling

                const consent = await context.confirm(true, "Changes done will be reflected across all selected documents. Please provide confirmation to proceed.", "Confirmation");

                if (consent !== true) {
                    setSaveDisable(false);
                    return;
                }
            }

        }
        // return;

        if (agentSaveSpouseObj.length > 0) {
            agentSaveObj.push(...agentSaveSpouseObj);
        }

        for (const val of agentSaveObj) {
            if (val.isJoin == undefined) {
                val.isJoin = false
            }
        }

        // **********************************_______________PERMISSION DENIED BLOCk_______________**********************************************
        {
            let arrayeOfSelectedAgentForFile = []
            const fileId = (uploadfile?.fileId !== undefined) ? uploadfile.fileId : null;
            
            if (isHipaaAndDoa == false) {
                for (let fiduciaryObj of customFiduciaryList) {
                    konsole.log('customFiduciaryListcustomFiduciaryList',customFiduciaryList)
                    arrayeOfSelectedAgentForFile.push(agentmapping(selectedLegalDocs, fiduciaryObj, memberUserId, logUserId, fileId, documentForSingleOrJoint));
                }
            }else{
                for (let agentObj of customAgentInfoObj.agent) {
                    konsole.log("documentForSingleOrJointloop", documentForSingleOrJoint)
                    arrayeOfSelectedAgentForFile.push(agentmapping(selectedLegalDocs, agentObj, memberUserId, logUserId, fileId, documentForSingleOrJoint));
                }
                for (let successorObj of customSuccessorInfoObj) {
                    konsole.log("documentForSingleOrJointloop2", documentForSingleOrJoint)
                    arrayeOfSelectedAgentForFile.push(agentmapping(selectedLegalDocs, successorObj, memberUserId, logUserId, fileId, documentForSingleOrJoint));
                }
            }
            const arrayeOfSelectedAgentForFiles=arrayeOfSelectedAgentForFile?.filter((item)=>item.agentId !=0)
            konsole.log('arrayeOfSelectedAgentForFilearrayeOfSelectedAgentForFile', sharedFileList, arrayeOfSelectedAgentForFile,arrayeOfSelectedAgentForFiles)
            if (arrayeOfSelectedAgentForFiles.length > 0 && sharedFileList?.length > 0) {
                let arrOfPermissionsDenied = []
                for (let i = 0; i < arrayeOfSelectedAgentForFiles?.length; i++) {
                    for (let j = 0; j < sharedFileList?.length; j++) {
                        if (arrayeOfSelectedAgentForFiles[i].fileId != sharedFileList[j].fileId && arrayeOfSelectedAgentForFiles[i].agentUserId == sharedFileList[j].sharedUserId) {
                            let newArr = cretaeJsonForFilePermission({ ...sharedFileList[j], 'updatedBy': stateObj.userId, 'isAdd': false, 'isEdit': false, 'isRead': false, 'isDelete': false })
                            arrOfPermissionsDenied.push(newArr)
                        }
                    }
                }
                konsole.log('arrOfPermissionsDeniedarrOfPermissionsDenied', arrOfPermissionsDenied)

              
                if (arrOfPermissionsDenied?.length > 0 && deleteAgents?.length==0) {
                    konsole.log("arrOfPermissionsDenied", arrOfPermissionsDenied)
                    props.dispatchloader(true);
                    let result = await filepermissionsfun(arrOfPermissionsDenied)
                    props.dispatchloader(false);
                    konsole.log('resultresult', result)
                }
            }
        }
        // **********************************_______________PERMISSION DENIED BLOCK_______________**********************************************

        // *********************************_______________FILE PERMISSIONS BLOCK__________________*************************************

        {
            konsole.log('agentSaveObjagentSaveObj', agentSaveObj)
            konsole.log('agentSaveObjagentSaveObj', sharedFileList)
            konsole.log('sharefilelist')
            let _agentObjForPermission = agentSaveObj?.filter((item) => isNotValidNullUndefile(item?.fileId) && isNotValidNullUndefile(item?.agentUserId) && item?.agentActiveStatus == true)
            konsole.log('_agentObjForPermission', _agentObjForPermission)
            const filePermissionsArr = []
            for (let i = 0; i < _agentObjForPermission?.length; i++) {
                const { agentId, fileId, memberUserId, agentUserId } = _agentObjForPermission[i]
                if (agentId == 0) {
                    let newArr = cretaeJsonForFilePermission({ fileId: fileId, belongsTo: memberUserId, primaryUserId: primaryMemberUserId, roleId: 5, sharedUserId: agentUserId, isActive: true, isDelete: false, isEdit: false, isRead: true, ...manageCreate });
                    filePermissionsArr.push(newArr)
                } else if (agentId != 0 && !sharedFileList?.some((item) => item?.fileId == fileId && agentUserId == item?.sharedUserId)) {
                    let newArr = cretaeJsonForFilePermission({ fileId: fileId, belongsTo: memberUserId, primaryUserId: primaryMemberUserId, roleId: 5, sharedUserId: agentUserId, isActive: true, isDelete: false, isEdit: false, isRead: true, ...manageCreate });
                    filePermissionsArr.push(newArr)
                }
            }
            konsole.log("filePermissionsArr",filePermissionsArr)
            konsole.log('deleteagentaz',deleteAgents)
            if (filePermissionsArr?.length > 0) {
                props.dispatchloader(true);
                let result = await filepermissionsfun(filePermissionsArr)
                props.dispatchloader(false);
                konsole.log('filePermissionsArrfilePermissionsArr', filePermissionsArr)
            }
        }
        // return;

        // *********************************_______________FILE PERMISSIONS BLOCK__________________*************************************

        // changes for file update in agent and cabinet------------------------------------------------------------------------------------------
        const filteredData = agentSaveObj.length > 0 && agentSaveObj.filter(ele =>!((ele?.agentUserId == spouseUserId || ele?.agentUserId == primaryUserId) &&
                [1, 4, 14].includes(ele?.testDocId) && ele?.agentId == 0 ));
              
            
          const extractAgents = (documents) =>
                    documents.flatMap(doc => [
                        ...(doc.agents || []),
                        ...(doc.testamentaryDocs?.flatMap(testDoc => testDoc.agents || []) ?? []),
                        ...(doc.testamentarySupportDocs?.flatMap(supportDoc => supportDoc.agents || []) ?? [])
                    ]);
                    
                    const allAgents = extractAgents(legalDocuments);
                    const allAgentsData = [...allAgents, ...userAgentArrayForSpouse];
                    const apiJson = alltestamentaryDocsPrimary == true || isEditReset == false ? mattechedData(filteredData?.filter((ele)=>(ele?.agentId == 0)),allAgentsData) : removeDuplicateEntry(filteredData) 
                   
                    props.dispatchloader(true);
     
 
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postAgentUpsert, apiJson, async (response, error) => {
            konsole.log("upserttPOSTData", response);
            if (response) {
                let responseData = response?.data?.data
                props.dispatchloader(false);
                fetchLegalDocumentList();
                apiCallGetSharedFileStatus();
                AlertToaster.success("Saved successfully.");
            }
            else {
                konsole.log("error upsert agent", error);
                props.dispatchloader(false);
                setSaveDisable(false);
            }
        });
    }

    function filepermissionsfun(newObj) {
        return new Promise((resolve, reject) => {
            Services.upsertShareFileStatus(newObj).then((res) => {
                konsole.log('res of upser file share', res)
                props.dispatchloader(false);
                resolve('res')
            }).catch((err) => {
                props.dispatchloader(false);
                konsole.log('err in upsert sharefile', err)
                resolve('err')
            })
        })


    }
    function mattechedData(dsa,allAgentsData){
        const commonEntries = isNotValidNullUndefile(dsa) && dsa != false && dsa?.map(aItem => {
            const matchingB = allAgentsData?.find(bItem => 
                aItem.agentUserId == bItem.agentUserId &&
                aItem.agentRankId == bItem.agentRankId &&
                aItem.legalDocId == bItem.legalDocId &&
                aItem.testDocId == bItem.testDocId &&
                aItem.testSupportDocId == bItem.testSupportDocId &&
                aItem.memberUserId == bItem.memberUserId
            );
        
            if (matchingB && aItem.agentId == 0) {
                aItem.statusId = matchingB.statusId;
                aItem.agentId = matchingB.agentId;
            }
        
            return aItem;
        });
        
        // Find unmatched items and update `agentActiveStatus`
        const unmatchedEntries = allAgentsData.filter(aItem => {
            const isMatched = isNotValidNullUndefile(dsa) && dsa != false && dsa.some(bItem => 
                aItem.agentUserId == bItem.agentUserId &&
                aItem.agentRankId == bItem.agentRankId &&
                aItem.legalDocId == bItem.legalDocId &&
                aItem.testDocId == bItem.testDocId &&
                aItem.testSupportDocId == bItem.testSupportDocId &&
                aItem.memberUserId == bItem.memberUserId
            );        
            if (!isMatched) {
                aItem.agentActiveStatus = false;
                aItem.UpsertedBy  = logUserId;
            }        
            return !isMatched;
        });
        
        const result = removeDupliCate(commonEntries)
        return [...(Array.isArray(result) ? result : []),...(Array.isArray(unmatchedEntries) ? unmatchedEntries : [])];
            

    }
    function removeDupliCate(commonEntries){
        const seen = new Map();
        const result = isNotValidNullUndefile(commonEntries) && commonEntries != false && commonEntries?.filter(item => {
            if (item.agentId === 0) return true;        
            const existing = seen.get(item.agentId);        
            if (!existing) {
              seen.set(item.agentId, item);
              return true;
            }        
            // If existing is inactive and current is active, replace it
            if (existing.agentActiveStatus === false && item.agentActiveStatus === true) {
              seen.set(item.agentId, item);
              return true;
            }        
            return false;
          });

          return result

    }
    function removeDuplicateEntry(commonEntries) {
        return Object.values(
          commonEntries.reduce((acc, item) => {
            const key = `${item.agentUserId}_${item.agentRankId}_${item.legalDocId}_${item.testDocId}_${item.testSupportDocId}_${item.memberUserId}`;
      
            if (!acc[key]) {
              acc[key] = item;
            } else {
              const existing = acc[key]; if (existing.agentId === 0 && item.agentId !== 0) {
                existing.agentId = item.agentId;
              }
            }
      
            return acc;
          }, {})
        );
      }
      


    function mapUpsertAgent(documentObj, fileId) {
        let agentSaveObj = [];
        if (selectAgentTypeForReplicate === agentTypesList["allAgentsId"]) {
            for (let agentObj of customAgentInfoObj.agent) {
                agentSaveObj.push({ ...agentmapping(documentObj, agentObj, memberUserId, logUserId, fileId), agentId: 0 });
            }
            for (let successorObj of customSuccessorInfoObj) {
                agentSaveObj.push({ ...agentmapping(documentObj, successorObj, memberUserId, logUserId, fileId), agentId: 0 });
            }
        } else if (selectAgentTypeForReplicate === agentTypesList["successorId"]) {
            for (let successorObj of customSuccessorInfoObj) {
                agentSaveObj.push({ ...agentmapping(documentObj, successorObj, memberUserId, logUserId, fileId), agentId: 0 });
            }
        }

        return agentSaveObj
    }

    function selectedTestamentaryMappedDocuments() {
        const selectedLegalDocs = selectedLegalDocsObj;
        let agentSaveObj = [];
        let testamentaryDocsNotAvailable = [];
        if (alltestamentaryDocsPrimary == false) return [];




        for (let legalDocs of legalDocuments) {
            const testamentaryDocs = legalDocs.testamentaryDocs;
            if (testamentaryDocs.length > 0) {
                for (let testDoc of testamentaryDocs) {

                    if (testDoc.testamentaryDocsChecked === true && (testDoc.testDocId === 1 || testDoc.testDocId === 4)) testamentaryDocsNotAvailable.push(testDoc);

                    if (testDoc.testamentaryDocsChecked === false || selectedLegalDocs.selectedLegalDocumentType === selectedDocumentType["testamentaryDocs"] && testDoc.testDocId === selectedLegalDocs.testDocId) continue;

                    agentSaveObj.push(...mapUpsertAgent(testDoc));
                }
            }
        }

        if (testamentaryDocsNotAvailable.length > 0) {
            toasterAlert("This replication impacts Safe Harbor Trust and Contingent Trust for Minor`s where the Spouse should not be the Trustee please make the changes manually.")
        }
        return agentSaveObj;
    }


    function selectedTestamentarySupportMappedDocuments() {
        const selectedLegalDocs = selectedLegalDocsObj;
        let agentSaveObj = [];
        if (alltestamentaryDocsSupportPrimary === false) return [];


        for (let legalDocs of legalDocuments) {
            const testamentarySupportDocs = legalDocs.testamentarySupportDocs;
            if (testamentarySupportDocs.length > 0) {
                konsole.log("supportedDocuments", testamentarySupportDocs);
                for (let testDocSupport of testamentarySupportDocs) {
                    if (testDocSupport.testamentarySupportDocsChecked === false || selectedLegalDocs.selectedLegalDocumentType === selectedDocumentType["testamentarySupportDocs"] && testDocSupport.testSupportDocId === selectedLegalDocs.testSupportDocId) continue;

                    agentSaveObj.push(...mapUpsertAgent(testDocSupport));
                }
            }
        }

        return agentSaveObj;
    }

    function conditionCheckingForReplicate() {
        const selectedLegalDocs = selectedLegalDocsObj;
        let agentSaveObj = [];


        if (allSelectedDocsPrimary === false) return [];

        for (let [i, legalDocs] of allSelectedDocsPrimaryList.entries()) {
            if (legalDocs.checked === false || (selectedLegalDocs.selectedLegalDocumentType === selectedDocumentType["legalDocs"] && legalDocs.legalDocId === selectedLegalDocs.legalDocId)) continue;

            if (legalDocs.checked === true && (legalDocs.legalDocId === 11 || legalDocs.legalDocId === 17)) {
                if (legalDocs?.agents === undefined || legalDocs?.agents?.length === 0) {
                    agentSaveObj.push($AHelper.agentReturnObj({ ...legalDocs, memberUserId, upsertedBy: logUserId, agentRoleId: legalDocs.applicableRoleId }))
                }
                continue;
            }
            agentSaveObj.push(...mapUpsertAgent(legalDocs));
        }

        return agentSaveObj
    }



    function revertCustomAgentObj() {
        konsole.log("indexOfAgnet revertback");
        const localCustomAgentInfoObj = customAgentInfoObj;
        localCustomAgentInfoObj.agentType = "sole";
        localCustomAgentInfoObj.agent = [];
        setCustomAgentInfoObj(localCustomAgentInfoObj);
        setCustomSuccessorInfoObj([]);
        setReRenderPage(!reRenderPage)
    }

    function getBinaryFilesFromUpload(fileId) {
        props.dispatchloader(true);
        const userId = memberUserId == "Joint" ? primaryUserId : memberUserId
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.postDownloadUserDocument + `/${userId}/${fileId}/${fileTypeId}/${fileCabinetTypeId}/${logUserId}`, '', (response, error) => {
            if (response) {
                props.dispatchloader(false);
                let fileDocObj = response.data.data;
                fileDocObj["fileId"] = fileId;
                setUploadfile(fileDocObj);
                konsole.log("response at assign agent", fileDocObj);
            }
            else if (error) {
                props.dispatchloader(false);
            }
        })
    }

    function getDocumentByFileCabinetCategoryId() {
        const postData = {
            userId: memberUserId,
            fileCabinetId: fileCabinetTypeId,
            fileTypeId: fileTypeId
        }
        konsole.log("fileDocObj", postData);
        getDocumentByFileCabinetCategoryId2()
        return;
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postFileDocumentCabinetById, postData, (response, error, final) => {
            if (response) {
                props.dispatchloader(false);
                let fileDocObj = response.data.data;
                if (fileDocObj.cabinetFiles.length > 0) {
                    const fileTypesList = fileDocObj.cabinetFiles[0].fileTypes;
                    if (fileTypesList.length > 0) {
                        const currentFiles = fileTypesList[0].currentFiles;
                        if (currentFiles.length > 0) {
                            const currentFile = fileTypesList[0].currentFiles[0];
                            const fileId = currentFile.fileId
                            getBinaryFilesFromUpload(fileId);

                        } else {
                            setUploadfile({});
                        }
                    } else {
                        setUploadfile({});
                    }
                }
                else {
                    setUploadfile({});
                }
            }
            else if (error) {
                props.dispatchloader(false);
                setUploadfile({});
            }
        })
    }

    function getDocumentByFileCabinetCategoryId2() {
        let primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
        konsole.log('currentfolderIdcurrentfolderIdcurrentfolderId', folderIdOfEstatePlainingCurrent)
        const postData = {
            userId: memberUserId,
            fileCabinetId: fileCabinetTypeId,
            fileTypeId: fileTypeId
        }
        konsole.log('postDatapostDatapostData', postData)

        props.dispatchloader(true)
        Services.getFileFromCabinet(primaryMemberUserId).then((res) => {
            konsole.log('res of ger shared file status', res)
            let responseDataBasedOnMemnerUserId = res?.data?.data?.filter(({ fileBelongsTo, fileTypeId, fileStatusId, folderId }) => fileBelongsTo == memberUserId && fileTypeId == postData?.fileTypeId && fileStatusId == 2 && folderId == folderIdOfEstatePlainingCurrent)
            konsole.log('responseDataBasedOnMemnerUserId', responseDataBasedOnMemnerUserId)
            if (responseDataBasedOnMemnerUserId.length > 0) {
                getBinaryFilesFromUpload(responseDataBasedOnMemnerUserId[0].fileId);
            } else {
                setUploadfile({});
            }
            props.dispatchloader(false)
        }).catch((err) => {
            props.dispatchloader(false)
            setUploadfile({});
            konsole.log(' err in get shared file status', err)
        })


    }

    function getUpsertedUserAgentNdMapp() {
        if (primaryAgentRank.length > 0 && coAgentRank.length > 0 && successorRank.length > 0) {
            konsole.log("testing 1");
            if (selectedLegalDocsObj?.agents !== undefined && selectedLegalDocsObj.agents.length > 0) {
                konsole.log("testing 2");
                const selectedAgents = selectedLegalDocsObj.agents;
                const nonNullFileIdAgent = selectedAgents.findIndex(agent => !!agent.fileId);
                konsole.log("nonNullFileIdAgent1234", nonNullFileIdAgent)
                if (nonNullFileIdAgent >= 0) {
                    const fileId = selectedAgents[nonNullFileIdAgent].fileId;
                    // apiCallGetSharedFileStatus()
                    getBinaryFilesFromUpload(fileId);
                }
                else {
                    setUploadfile({})
                    setSharedFileList([])
                }
                konsole.log("nonNullName", nonNullFileIdAgent, selectedAgents);
                const indexOfPrimaryAgent = selectedAgents.findIndex((agent) => parseInt(agent.agentRankId) === parseInt(primaryAgentRank[0].value));
                const indexOfCoAgent = selectedAgents.findIndex((agent) => parseInt(agent.agentRankId) === parseInt(coAgentRank[0].value));
                const indexOfSuccessor = selectedAgents.findIndex((agent) => parseInt(agent.agentRankId) === parseInt(successorRank[0].value));
                konsole.log("indexofAgent", indexOfPrimaryAgent, "indexOfCoagent", indexOfCoAgent, "indexOfSuccessor", indexOfSuccessor);
                if (indexOfPrimaryAgent >= 0) {
                    const primaryAgent = selectedAgents[indexOfPrimaryAgent];
                    const localCustomAgentInfoObj = { agentType: "", agent: [] };
                    localCustomAgentInfoObj.agentType = "sole";
                    localCustomAgentInfoObj.agent = [];
                    if (memberUserId.toLowerCase() == spouseUserId.toLowerCase()) {
                        const relationWithMember = primaryAgent.agentUserId === primaryUserId ? "Spouse" : (primaryAgent.relationWithSpouse !== null) ? primaryAgent.relationWithSpouse : primaryAgent.relationWithMember;
                        localCustomAgentInfoObj.agent.push($AHelper.agentReturnObj({ ...primaryAgent, agentUserName: primaryAgent.fullName, agentUserRelation: relationWithMember }));
                    } else if (memberUserId.toLowerCase() == primaryUserId.toLowerCase()) {
                        const relationWithMember = primaryAgent.agentUserId === primaryUserId ? "Self" : (primaryAgent.relationWithSpouse !== null) ? primaryAgent.relationWithSpouse : primaryAgent.relationWithMember;
                        localCustomAgentInfoObj.agent.push($AHelper.agentReturnObj({ ...primaryAgent, agentUserName: primaryAgent.fullName, agentUserRelation: relationWithMember }));
                    }
                    else {
                        localCustomAgentInfoObj.agent.push($AHelper.agentReturnObj({ ...primaryAgent, agentUserName: primaryAgent.fullName, agentUserRelation: primaryAgent.relationWithMember }));
                    }
                    setCustomAgentInfoObj(localCustomAgentInfoObj);
                    konsole.log("indexofAgent inside", indexOfPrimaryAgent, localCustomAgentInfoObj);
                }
                else if (indexOfCoAgent >= 0) {
                    konsole.log("indexOfCoagent COAgent", coAgentRank, selectedAgents[indexOfCoAgent]);
                    const localCustomAgentInfoObj = { agentType: "", agent: [] };
                    localCustomAgentInfoObj.agentType = "co";
                    localCustomAgentInfoObj.agent = [];
                    const selectedCoAgent = selectedAgents.sort((a, b) => a.agentRankId - b.agentRankId);
                    konsole.log("agent sorted", selectedCoAgent);
                    for (let i = 0; i < selectedAgents.length; i++) {
                        for (let j = 0; j < coAgentRank.length; j++) {
                            if (parseInt(selectedCoAgent[i].agentRankId) === parseInt(coAgentRank[j].value)) {

                                if (memberUserId.toLowerCase() == spouseUserId.toLowerCase()) {

                                    let relationWithMember = selectedCoAgent[i].agentUserId === primaryUserId ? "Spouse" : (selectedCoAgent[i].relationWithSpouse !== null) ? selectedCoAgent[i].relationWithSpouse : selectedCoAgent[i].relationWithMember;
                                    localCustomAgentInfoObj.agent.push($AHelper.agentReturnObj({ ...selectedCoAgent[i], agentUserName: selectedCoAgent[i].fullName, agentUserRelation: relationWithMember }));
                                }
                                else if (memberUserId.toLowerCase() == primaryUserId.toLowerCase()) {
                                    let relationWithMember = selectedCoAgent[i].agentUserId === primaryUserId ? "Self" : (selectedCoAgent[i].relationWithSpouse !== null) ? selectedCoAgent[i].relationWithSpouse : selectedCoAgent[i].relationWithMember;
                                    localCustomAgentInfoObj.agent.push($AHelper.agentReturnObj({ ...selectedCoAgent[i], agentUserName: selectedCoAgent[i].fullName, agentUserRelation: relationWithMember }));
                                }
                                else {
                                    localCustomAgentInfoObj.agent.push($AHelper.agentReturnObj({ ...selectedCoAgent[i], agentUserName: selectedCoAgent[i].fullName, agentUserRelation: selectedCoAgent[i].relationWithMember }));
                                }
                            }
                        }
                    }
                    setCustomAgentInfoObj(localCustomAgentInfoObj);
                    setReRenderPage(!reRenderPage)
                }
                else {
                    const localCustomAgentInfoObj = { agentType: "sole", agent: [] };
                    setCustomAgentInfoObj(localCustomAgentInfoObj);
                    setReRenderPage(!reRenderPage)
                }

                if (indexOfSuccessor >= 0) {
                    konsole.log("indexOfCoagent COAgent", coAgentRank, selectedAgents);
                    const filteredArray = [];
                    const selectedSuccessor = selectedAgents.sort((a, b) => a.agentRankId - b.agentRankId);
                    for (let i = 0; i < selectedAgents.length; i++) {
                        for (let j = 0; j < successorRank.length; j++) {
                            if (parseInt(selectedSuccessor[i].agentRankId) === parseInt(successorRank[j].value)) {
                                if (memberUserId.toLowerCase() == spouseUserId.toLowerCase()) {
                                    const relationWithMember = selectedSuccessor[i].agentUserId === primaryUserId ? "Spouse" : (selectedSuccessor[i].relationWithSpouse !== null) ? selectedSuccessor[i].relationWithSpouse : selectedSuccessor[i].relationWithMember;
                                    filteredArray.push($AHelper.agentReturnObj({ ...selectedSuccessor[i], agentUserName: selectedSuccessor[i].fullName, agentUserRelation: relationWithMember }));
                                }
                                else if (memberUserId.toLowerCase() == primaryUserId.toLowerCase()) {
                                    const relationWithMember = selectedSuccessor[i].agentUserId === primaryUserId ? "Spouse" : (selectedSuccessor[i].relationWithSpouse !== null) ? selectedSuccessor[i].relationWithSpouse : selectedSuccessor[i].relationWithMember;
                                    filteredArray.push($AHelper.agentReturnObj({ ...selectedSuccessor[i], agentUserName: selectedSuccessor[i].fullName, agentUserRelation: relationWithMember }));
                                }
                                else {
                                    filteredArray.push($AHelper.agentReturnObj({ ...selectedSuccessor[i], agentUserName: selectedSuccessor[i].fullName, agentUserRelation: selectedSuccessor[i].relationWithMember }));
                                }
                            }
                        }
                    }
                    konsole.log("selected agent successor", filteredArray);
                    setCustomSuccessorInfoObj(filteredArray);
                }
                else {
                    setCustomSuccessorInfoObj([]);
                    setReRenderPage(!reRenderPage);
                }
                // if()
            } else {
                revertCustomAgentObj();
                getDocumentByFileCabinetCategoryId();
                setSharedFileList([])
            }
        }
    }
}


const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect("", mapDispatchToProps)(AssignAgents);