import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import AlertToaster from '../../control/AlertToaster';
import konsole from '../../control/Konsole';
import { $CommonServiceFn, $postServiceFn, Services } from '../../network/Service';
import { fileLargeMsg, sortingFolderForCabinet, categoryFileCabinet, cabinetFileCabinetId, cretaeJsonForFilePermission, cretaeJsonForFolderPermission, createJsonForFolderMapping2, operationForCategoryType, specificFolderName } from '../../control/Constant';
import { $Service_Url } from '../../network/UrlPath';
import SendAgentInviteLink from '../../SendAgentInviteLink';
import { SET_LOADER } from '../../Store/Actions/action';
import AssignAgents from './AssignAgents';
import ListLegalDocuments from './listLegalDocuments';
import SelectedLegalDocs from './SelectedLegalDocs';
import WrapperAddNewFid from '../../WrapperAddNewFid';
import { $AHelper } from '../../control/AHelper';
import { isNotValidNullUndefile } from '../../Reusable/ReusableCom';

let callBackApi;
function AssignRoleContainer(props) {
    const memberUserId = props.userId;
    const [legalDocuments, setLegalDocuments] = useState([]);
    const [selectedLegalDocsObj, setSelectedLegalDocsObj] = useState({});
    const [reRenderPage, setReRenderPage] = useState(false);
    const [showInviteModal, handleInviteModal] = useState(false);
    const [userAgentArray, setUserAgentArray] = useState([]);
    const [userAgentArrayForSpouse, setUserAgentArraySpouse] = useState([]);
    const [uniqueUserAgentArray, setUniqueUserAgentArray] = useState([]);
    const primaryUserId = sessionStorage.getItem("SessPrimaryUserId");
    const spouseUserId = sessionStorage.getItem("spouseUserId");
    const stateObj = $AHelper.getObjFromStorage("stateObj");
    konsole.log("selectedLegalDocsObjselectedLegalDocsObj",selectedLegalDocsObj,userAgentArrayForSpouse)

    useEffect(() => {
      legalDocumentList();
      return () => {

      }
    }, [memberUserId]);


    useEffect(()=>{
        apiCallGetFolderDetails()
    },[])
    
    function callFiduciaryListFromChild (fiduciaryList){
        callBackApi = fiduciaryList
    }


    function callbackApiFunc (){
        if(callBackApi){
            callBackApi();
        }
    }

        //  api for mapping folder for filecabinet-----------------------------------------------------------------------------------------------------------------------------------

    // setLegalCategoryLifePlanFolderId
    // Estate planning documents
    const [legalCategoryEstatePlanningFolderId, setLegalCategoryEstatePlanningFolderId] = useState([])
    const [manageCreate, setManageCreate] = useState({ createdBy: stateObj.userId, createdOn: new Date().toISOString() })
    // const currentFolderId = legalCategoryEstatePlanningFolderId?.filter((item) => item.folderName == "Current")
    const [fileFolderId, setFileFolderId] = useState('')
    const [files, setFiles] = useState([])
    const [folderIdOfEstatePlainingCurrent, setFolderIdOfEstatePlainingCurrent] = useState('')

    konsole.log('fileFolderIdfileFolderIdfileFolderId', folderIdOfEstatePlainingCurrent)

    const apiCallGetFolderDetails = () => {
        let belongsTo = sessionStorage.getItem('SessPrimaryUserId')
        props.dispatchloader(true)
        Services.getFileCabinetFolderDetails({ belongsTo }).then((res) => {
            konsole.log('res of get folder', res)
            props.dispatchloader(false)
            // let responseFolder = res?.data?.data.filter((item) => item.belongsTo == belongsTo && item?.folderFileCategoryId == categoryFileCabinet[0] && item.folderCabinetId == [0])
            let responseFolder = res?.data?.data?.filter((item) => item?.belongsTo == belongsTo && item?.folderFileCategoryId == categoryFileCabinet[0] && item.folderCabinetId == cabinetFileCabinetId[0])
            let myArray = createNestedArray(responseFolder)
            konsole.log('responseFolderresponseFolder', responseFolder)
            
            if (responseFolder.length == 0) {
                upsertFolderCabinetMapping()
            } else {
                let EstatePlanning = responseFolder?.filter((item) => item?.folderName == specificFolderName[1])
                let currentFolderId = responseFolder?.filter(({ folderName, parentFolderId, folderId }) => parentFolderId == EstatePlanning[0].folderId  && folderName==specificFolderName[2])
                konsole.log('currentArchievecurrentArchievecurrentArchievecurrentArchieve',currentFolderId)
                if(currentFolderId.length>0){
                    setFolderIdOfEstatePlainingCurrent(currentFolderId[0]?.folderId)
                }
                setLegalCategoryEstatePlanningFolderId(myArray)
            }
            konsole.log('responseFolder', responseFolder)
        }).catch((err) => {
            konsole.log('err in fatching folder details', err?.response)
            props.dispatchloader(false)
            if (err?.response?.data?.statusCode == 404) {
                upsertFolderCabinetMapping()
            }
        })

    }

    function createNestedArray(folders) {
        konsole.log('folders', folders)
        const nestedArray = [];

        function buildNestedArray(parentId, level) {
            const folder = folders.filter(folder => folder.parentFolderId === parentId);
            if (folder.length === 0) {
                return [];
            }

            const nestedChildren = folder.map(child => {
                return {
                    ...child,
                    folder: buildNestedArray(child.folderId, level + 1)
                };
            });

            return nestedChildren;
        }

        nestedArray.push(...buildNestedArray(0, 1));

        return nestedArray;
    }
    const upsertFolderCabinetMapping = async () => {
        konsole.log('postJson', postJson)
        let folderCreatedBy = sessionStorage.getItem('loggedUserId')
        let folderSubtenantId = sessionStorage.getItem('SubtenantId')
        let folderRoleId = JSON.parse(sessionStorage.getItem('stateObj')).roleId
        konsole.log('folderRoleIdfolderRoleId', folderRoleId)
        let folderCabinetId = cabinetFileCabinetId[0]
        let folderFileCategoryId = categoryFileCabinet[0]
        let belongsTo = sessionStorage.getItem('SessPrimaryUserId')

        let postJson = createJsonForFolderMapping2({ folderFileCategoryId, belongsTo, folderCreatedBy, folderOperation: operationForCategoryType[1], folderSubtenantId, folderRoleId, folderCabinetId, autoMapProfessionalFolderId: categoryFileCabinet[0] })
        konsole.log('postJsonpostJson', postJson, JSON.stringify(postJson))
        // return;
        props.dispatchloader(true)
        Services.upsertCabinetFolder([postJson]).then(async (response) => {
            props.dispatchloader(false)
            konsole.log('response of adding updating and deleting folder', response)
            let responseFolder = response?.data?.data?.filter((item) => item?.belongsTo == belongsTo && item?.folderFileCategoryId == categoryFileCabinet[0] && item.folderCabinetId == cabinetFileCabinetId[0])
            konsole.log('newArraynewArraynewArraynewArraynewArraynewArray', responseFolder)
            let EstatePlanning = responseFolder?.filter((item) => item?.folderName == specificFolderName[1])
            let currentFolderId = responseFolder?.filter(({ folderName, parentFolderId, folderId }) => parentFolderId == EstatePlanning[0].folderId  && folderName==specificFolderName[2])
            konsole.log('currentArchievecurrentArchievecurrentArchievecurrentArchieve',currentFolderId)
            if(currentFolderId.length>0){
                setFolderIdOfEstatePlainingCurrent(currentFolderId[0]?.folderId)
            }
           
            let myArray = createNestedArray(responseFolder)
            setLegalCategoryEstatePlanningFolderId(myArray)
            //  break code of folder permissions---------------------------------------
            // return;
            let result = await apiCallGetUserListByRoleId()
            if (result !== 'err') {
                let primaryMemberUserId = belongsTo
                let myPermissionJson = []
                for (let i = 0; i < responseFolder.length; i++) {
                    for (let j = 0; j < result.length; j++) {
                        let newArray = cretaeJsonForFolderPermission({
                            ...manageCreate, editFolder: true, deleteFolder: true, readFolder: true, createSubFolder: true, editSubFolder: true, deleteSubFolder: true, fileUpload: true,
                            subtenantId:folderSubtenantId, sharedRoleId: stateObj.roleId, sharedUserId: result[j].userId,
                            primaryUserId: primaryMemberUserId, isActive: true, cabinetId: cabinetFileCabinetId[0], folderId: responseFolder[i].folderId
                        });
                        myPermissionJson.push(newArray)
                    }
                }
                konsole.log('myPermissionJsonmyPermissionJson', myPermissionJson, JSON.stringify(myPermissionJson))

                callPermissionsApi(myPermissionJson)
            }

            props.dispatchloader(false)
        }).catch((err) => {
            props.dispatchloader(false)
            konsole.log('err of adding updating and deleting folder ', err, err?.response)
        })
    }


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

    const callPermissionsApi = (newArr) => {
        props.dispatchloader(true)
        konsole.log('callPermissionsApi', newArr, JSON.stringify(newArr))
        Services.upsertCabinetFolderPermissions(newArr).then((res) => {
            props.dispatchloader(false)
            konsole.log('res of folder permissions', res)
        }).catch((err) => {
            props.dispatchloader(false)
            konsole.log(' err in folder permissions', err)
        })
    }
    const filtTypeEnum = [
        { legalDocId: 1, value: 20, label: "Last Will and Testament" },
        { legalDocId: 2, value: 21, label: "Revocable Living Trust" },
        { legalDocId: 3, value: 26, label: "Pour-Over Will" },
        { legalDocId: 4, value: 38, label: "Stand-Alone Safe Harbor Trust" },
        { legalDocId: 6, value: 39, label: "Durable Power of Attorney for Finances" },
        { legalDocId: 7, value: 40, label: "Durable Power of Attorney for Healthcare" },
        { legalDocId: 8,  value: 42, label: "Limited Power of Attorney" },
        { legalDocId: 10, value: 48, label: "Handling of Remains"},
        { legalDocId: 11, value: 49, label: "HIPAA Release" },
        { legalDocId: 12, value: 52, label: "In Case of Emergency Cards"},
        { legalDocId: 999999,  value: 999999, label: "Others"},
        { legalDocId: 15, value: 36,label: "Community Property Agreement" },
        { legalDocId: 16, value: 37, label: "Revocation of Community Property Agreement" },
        { legalDocId: 17, value: 41, label: "Directive to Attorney" },
    ]
    

    konsole.log("spouse Array json", userAgentArrayForSpouse)
  return (
    <>
        {
            (showInviteModal === true) ?
                <SendAgentInviteLink showInviteModal={showInviteModal} handleInviteModal={handleInviteModal} uniqueUserAgentArray={uniqueUserAgentArray} />
                : <></>
        }

            <div className='d-flex justify-content-end me-3 gap-2'>
                <WrapperAddNewFid memberUserId={memberUserId} callbackApi={callbackApiFunc} refrencepage='Fiduciary/AssignRoleContainer' text={"Fiduciary/Beneficiary"} addedText={"fiduciary"}/>
                {
                    (userAgentArray.length > 0)?
                      <Button onClick={handleSendInvitePopup} className="Add-more-fiduciary" > Send Invite  </Button>
                    :
                    <></>
                }
            </div>
          <Row className='px-3 h-100'>
              <Col xs sm="6" lg="3" className='border-end p-3'>
                  <h5>Check Applicable Legal Documents</h5>
                  {
                      legalDocuments.length > 0 && legalDocuments.map((legalDoc, index) => {
                          return (
                              <div className='m-0 p-0' key={index} style={memberUserId == "Joint" ? {pointerEvents: "none",opacity: 0.5} : {}}>
                                  <ListLegalDocuments legalDocs={legalDoc} index={index} handleChange={handleChange} handleClick={handleClick} />
                              </div>
                          )
                      })
                  }
              </Col>
              <Col xs sm="6" lg="3" className='border-end p-3'>
                  {/* {selectedLegalDocsObj?.agents?.length > 0 && <h5>Selected Legal Documents</h5>} */}
                  <h5>Selected Legal Documents</h5>
                  {
                      legalDocuments.length > 0 && legalDocuments.map((legalDoc, index) => {
                          return (
                              <div className='m-0 p-0' key={index}>
                                  <SelectedLegalDocs legalDocs={legalDoc} index={index} selectedLegalDocObj={selectedLegalDocsObj} handleLegalDocClick={handleLegalDocClick} memberUserId={memberUserId} />
                              </div>
                          )
                      })
                  }
              </Col>
              {
                Object.keys(selectedLegalDocsObj).length > 0 ?
                    <Col xs sm="12" lg="6" className=''>
                          <AssignAgents selectedLegalDocsObj={selectedLegalDocsObj} memberUserId={memberUserId} legalDocumentList={legalDocumentList} legalDocuments={legalDocuments} userAgentArray={userAgentArray} callFiduciaryListFromChild={callFiduciaryListFromChild} userAgentArrayForSpouse={userAgentArrayForSpouse} folderIdOfEstatePlainingCurrent={folderIdOfEstatePlainingCurrent} />
                    </Col>
                    :
                    <></>
              }
          </Row>
    </>
  )

     function legalDocumentList() {
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getLegalDocuments, "", async(response,error) => {
            props.dispatchloader(false);
                if (response) {
                    konsole.log("DocumentList", response.data.data);
                    const legalDocumentsMapped = response.data.data.map(legalDoc => { 
                        // const legalDocumentFileIndex = filtTypeEnum.findIndex((data) => legalDoc.legalDocId === data.legalDocId);
                        return { showSubLegalDocument: false, checked: false, ...legalDoc};
                    });

                    for (const [index, loop] of legalDocumentsMapped.entries()){
                        if (legalDocumentsMapped[index].testamentaryDocs.length > 0) {
                            const responseTestamentaryDocsMapped = legalDocumentsMapped[index].testamentaryDocs.map((testamentaryDocs) => {
                                return { testamentaryDocsChecked: false, ...testamentaryDocs }
                            })
                            legalDocumentsMapped[index].testamentaryDocs = responseTestamentaryDocsMapped;
                        }
                        if (legalDocumentsMapped[index].testamentarySupportDocs.length > 0) {
                            const responseTestamentarySupportDocsMapped = legalDocumentsMapped[index].testamentarySupportDocs.map((testamentarySupportDocs) => {
                                return { testamentarySupportDocsChecked: false, ...testamentarySupportDocs }
                            })
                            legalDocumentsMapped[index].testamentarySupportDocs = responseTestamentarySupportDocsMapped;
                        }
                    }

                    konsole.log("responseDataApiLoop", JSON.stringify(legalDocumentsMapped));
                    setLegalDocuments(legalDocumentsMapped);
                    setSelectedLegalDocsObj({})
                    if(memberUserId == "Joint"){
                        getUserAgent(primaryUserId, legalDocumentsMapped, true);
                        getUserAgent(spouseUserId, legalDocumentsMapped, false);
                    }
                    else{
                        getUserAgent(memberUserId, legalDocumentsMapped, true);
                        getUserAgent(spouseUserId, legalDocumentsMapped, false);
                    }
                }
                else{
                    props.dispatchloader(false);
                }
            }
        );
    };

    function handleChange(event, index, testamentaryDocsIndex) {


        if (isNotValidNullUndefile(legalDocuments) && legalDocuments.length > 0 && (index === 0 || index === 1)) {
            let isReturns = true;
            if (index === 0 && legalDocuments.length > 1) {
                const isReturns1 = legalDocuments[1]?.testamentaryDocs?.some(item => item?.testamentaryDocsChecked === true) || false;
                const isReturns2 = legalDocuments[1]?.testamentarySupportDocs?.some(item => item?.testamentarySupportDocsChecked === true) || false;
                isReturns = isReturns1 || isReturns2;
            } else if (index === 1 && legalDocuments.length > 0) {
                isReturns = legalDocuments[0]?.testamentaryDocs?.some(val => val?.testamentaryDocsChecked === true) || false;
            }
            if (isReturns == true) {
                AlertToaster.warn('A Will and a Revocable Trust cannot be created together.')
                return;
            }
        }

        const eventId = event.target.id;
        const eventValue = event.target.value;
        const eventChecked = event.target.checked;
        const eventName = event.target.name;
        const eventIndex = index;
        const legalDocumentsObj = legalDocuments;
        switch (eventId) {
            case 'selectedLegalDoc':
                const selectedLegalDocByIndex = legalDocumentsObj[eventIndex]
                if (selectedLegalDocByIndex.applicableRoleId !== 0 && selectedLegalDocByIndex.applicableRoleId !== null){
                    legalDocumentsObj[eventIndex].checked = eventChecked;
                    legalDocumentsObj[eventIndex].showSubLegalDocument = eventChecked;
                    konsole.log("selectedMember", eventName, eventValue, eventIndex, legalDocumentsObj, eventChecked);
                    setLegalDocuments(legalDocumentsObj);
                    setReRenderPage(!reRenderPage);
                }
                else{
                    AlertToaster.info("Agents to be decided.");
                }
                break;
            case 'testamentaryDocs':
                legalDocumentsObj[eventIndex].testamentaryDocs[testamentaryDocsIndex].testamentaryDocsChecked = eventChecked;
                konsole.log("selectedMember", eventName, eventValue, eventIndex, legalDocumentsObj, eventChecked);
                setLegalDocuments(legalDocumentsObj);
                setReRenderPage(!reRenderPage);
                break;
            case 'testamentarySupportDocs':
                legalDocumentsObj[eventIndex].testamentarySupportDocs[testamentaryDocsIndex].testamentarySupportDocsChecked = eventChecked;
                setLegalDocuments(legalDocumentsObj);
                setReRenderPage(!reRenderPage);
                break;
            default:
                konsole.log("")
        }
        let checkLegalDocuments = legalDocuments.filter(item => item.checked || (item.showSubLegalDocument && (item.testamentaryDocs?.some(det => det.testamentaryDocsChecked) || item.testamentarySupportDocs?.some(det => det.testamentarySupportDocsChecked))));
     if(checkLegalDocuments?.length == 1){
         const checkSelectedLegalDocIndex = legalDocuments.findIndex(item => item.legalDocId == checkLegalDocuments[0]?.legalDocId)
         const checkSelectedTestDocLegalDocIndex = checkLegalDocuments[0]?.testamentaryDocs?.findIndex(item => item.testamentaryDocsChecked == true && checkLegalDocuments[0]?.checked == false)
         const checkSelectedTestSupportLegalDocIndex = checkLegalDocuments[0]?.testamentarySupportDocs?.findIndex(item => item.testamentarySupportDocsChecked == true && checkLegalDocuments[0]?.checked == false);
         const selectedLegalDocumentType = checkSelectedTestDocLegalDocIndex > -1 ? "testamentaryDocs" :checkSelectedTestSupportLegalDocIndex > -1 ? "testamentarySupportDocs" : "legalDocs";
         const testamentarySupportDocIndex = selectedLegalDocumentType == "testamentarySupportDocs" ? checkSelectedTestSupportLegalDocIndex : selectedLegalDocumentType == "testamentaryDocs" ? -1 : undefined;

        handleLegalDocClick("selectedLegalDocument", checkSelectedLegalDocIndex, checkSelectedTestDocLegalDocIndex, testamentarySupportDocIndex, selectedLegalDocumentType)
     }
    }

    function handleClick(event, index, showSubLegalDocument) {
        if (isNotValidNullUndefile(legalDocuments) && legalDocuments.length > 0 && (index === 0 || index === 1)) {
            let isReturns = true;
            if (index === 0 && legalDocuments.length > 1) {
                const isReturns1 = legalDocuments[1]?.testamentaryDocs?.some(item => item?.testamentaryDocsChecked === true) || false;
                const isReturns2 = legalDocuments[1]?.testamentarySupportDocs?.some(item => item?.testamentarySupportDocsChecked === true) || false;
                isReturns = isReturns1 || isReturns2;
            } else if (index === 1 && legalDocuments.length > 0) {
                isReturns = legalDocuments[0]?.testamentaryDocs?.some(val => val?.testamentaryDocsChecked === true) || false;
            }
            if (isReturns == true) {
                AlertToaster.warn('A Will and a Revocable Trust cannot be created together.')
                return;
            }
        }
        const eventName = event.target.name;
        const eventIndex = index;
        switch (eventName) {
            case 'showSubLegalDocument':
                const legalDocumentsObj = legalDocuments;
                legalDocumentsObj[eventIndex].showSubLegalDocument = !showSubLegalDocument;
                setLegalDocuments(legalDocumentsObj);
                setReRenderPage(!reRenderPage);
                break;

            case 'selectAllTestamentoryDocs':
                for (let [index, testaDocument] of legalDocuments[eventIndex].testamentaryDocs.entries()){
                    legalDocuments[eventIndex].testamentaryDocs[index].testamentaryDocsChecked = true
                }
                setLegalDocuments(legalDocuments);
                setReRenderPage(!reRenderPage);
            break;
            case 'unSelectAllTestamentoryDocs':
                for (let [index, testaDocument] of legalDocuments[eventIndex].testamentaryDocs.entries()){
                    legalDocuments[eventIndex].testamentaryDocs[index].testamentaryDocsChecked = false
                }
                setLegalDocuments(legalDocuments);
                setReRenderPage(!reRenderPage);
                break;
            case 'selectAllTestamentorSupportyDocs':
                for (let [index, testaDocument] of legalDocuments[eventIndex].testamentarySupportDocs.entries()) {
                    legalDocuments[eventIndex].testamentarySupportDocs[index].testamentarySupportDocsChecked = true
                }
                setLegalDocuments(legalDocuments);
                setReRenderPage(!reRenderPage);
                break;
            case 'unSelectAllTestamentorSupportyDocs':
                for (let [index, testaDocument] of legalDocuments[eventIndex].testamentarySupportDocs.entries()) {
                    legalDocuments[eventIndex].testamentarySupportDocs[index].testamentarySupportDocsChecked = false
                }
                setLegalDocuments(legalDocuments);
                setReRenderPage(!reRenderPage);
                break;
            default:
                konsole.log("unSelectAllTestamentorSupportyDocs")
        }
    }

    function handleLegalDocClick(event, index, testDocIndex, testSupportDocsIndex, selectedLegalDocumentType) {
        const eventId = event?.target?.id ?? event;
        const legalDocIndex = index;
        konsole.log("supportDocsNameShow", index, "testDoc", testDocIndex, "testsupport", testSupportDocsIndex);
        switch (eventId) {
            case 'selectedLegalDocument':
                let selectedLegalDocObj = {};
                if (testDocIndex >= 0 && testSupportDocsIndex === -1){
                    legalDocuments[legalDocIndex].testamentaryDocs[testDocIndex].selectedLegalDocumentType = selectedLegalDocumentType
                    selectedLegalDocObj = legalDocuments[legalDocIndex].testamentaryDocs[testDocIndex];
                }
                else if (testDocIndex === -1 && (testSupportDocsIndex !== undefined && testSupportDocsIndex >= 0)){
                    legalDocuments[legalDocIndex].testamentarySupportDocs[testSupportDocsIndex].selectedLegalDocumentType = selectedLegalDocumentType;
                    selectedLegalDocObj = legalDocuments[legalDocIndex].testamentarySupportDocs[testSupportDocsIndex];
                }
                else {
                    legalDocuments[legalDocIndex].selectedLegalDocumentType = selectedLegalDocumentType;
                    selectedLegalDocObj = legalDocuments[legalDocIndex];
                }
                konsole.log("seselectedLegalDocumentl", eventId, legalDocIndex, testDocIndex, legalDocuments,selectedLegalDocObj);
                setSelectedLegalDocsObj(selectedLegalDocObj);
                break;
            default:
                konsole.log("")
        }
    }


    function getUserAgent(userId, legalDocumentsMapped, match) {
        props.dispatchloader(true);
        konsole.log("userIdAssign",userId)
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserAgent + `?IsActive=true&UserId=${userId}`, "", (response, error) => {
            konsole.log("response1213",response)
            if (userId.toLowerCase() === primaryUserId.toLowerCase()) {
                mapLegalDocumentWithAgent(userId, legalDocumentsMapped, response)
            } else if (userId.toLowerCase() === spouseUserId.toLowerCase()) {
                if(match === true){
                        mapLegalDocumentWithAgent(userId, legalDocumentsMapped, response)
                }
                else if(match == false){
                    if(response){
                        setUserAgentArraySpouse(response.data.data);
                        props.dispatchloader(false);
                    }
                    else{
                        setUserAgentArraySpouse([]);
                        props.dispatchloader(false);
                    }
                }
            }
        }
        );
    };

    function mapLegalDocumentWithAgent (userId, legalDocumentsMapped, response) {
        if (response) {
            props.dispatchloader(false);
            konsole.log("userAgentDataGET", JSON.parse(JSON.stringify(response.data.data)),response.data.data);
            if (response.data.data.length > 0) {
                const mappedUserAgent = response.data.data.map(data => data);
                let responseLegal = response.data.data;
                setUserAgentArray(mappedUserAgent);
                konsole.log("mappedUserAgent1212",mappedUserAgent,JSON.parse(JSON.stringify(responseLegal)),legalDocumentsMapped)
                let selectedLegalDocObj = {};
                for (let [index, agentLegal] of legalDocumentsMapped.entries()) {
                    const legalDocObj = legalDocumentsMapped[index];
                    const testDocId = (legalDocObj?.testDocId == undefined) ? null : legalDocObj.testDocId
                    const testSupportDocId = (legalDocObj?.testSupportDocId == undefined) ? null : legalDocObj.testSupportDocId

                    const primaryUserIdExists = JSON.parse(JSON.stringify(responseLegal)).some(item => item.agentUserId === primaryUserId && ((item.legalDocId == legalDocObj.legalDocId) || (item?.testDocId === testDocId) || (item?.testSupportDocId === testSupportDocId)) && item.isJoin === true);
                    const spouseUserIdExists = JSON.parse(JSON.stringify(responseLegal)).some(item => item.agentUserId === spouseUserId && ((item.legalDocId == legalDocObj.legalDocId) || (item?.testDocId === testDocId) || (item?.testSupportDocId === testSupportDocId)) && item.isJoin === true);
                    const checkAgentsPriAndSpou = primaryUserIdExists && spouseUserIdExists;
                    
                    const { filteredArray, responseLegalArray } = filterAgentUserArray(responseLegal, legalDocObj.legalDocId, testDocId, testSupportDocId);
                    let filterTheArray = responseLegalArray;


                    konsole.log("legalOCids",legalDocumentsMapped,JSON.parse(JSON.stringify(responseLegal)), legalDocObj,filteredArray, responseLegalArray,checkAgentsPriAndSpou,primaryUserIdExists,spouseUserIdExists);

                    legalDocumentsMapped[index].agents = (memberUserId == "Joint" && checkAgentsPriAndSpou !== true) ? [] : filteredArray
                    // legalDocumentsMapped[index].agents = filteredArray
                    
                    
                    if (filteredArray.length > 0) {
                        // legalDocumentsMapped[index].showSubLegalDocument = true;
                        legalDocumentsMapped[index].checked = (memberUserId == "Joint" && checkAgentsPriAndSpou !== true) ? false : true;
                        konsole.log("selectedLegalDocObj121344",Object.entries(selectedLegalDocObj))
                        if (Object.entries(selectedLegalDocObj).length == 0) {
                            const legaldoc = legalDocumentsMapped[index];
                            legaldoc.selectedLegalDocumentType = "legalDocs"
                            selectedLegalDocObj = legaldoc;
                        }
                    }
                    const testamentaryDocsObj = (memberUserId == "Joint" && checkAgentsPriAndSpou !== true) ? [] : legalDocObj.testamentaryDocs;
                    // const testamentaryDocsObj = legalDocObj.testamentaryDocs;
                    konsole.log("testamentaryDocsObj111",testamentaryDocsObj)
                    if (testamentaryDocsObj.length > 0) {
                        for (let [indextest, agentLegal] of testamentaryDocsObj.entries()) {
                            const testamentaryDocsObjMap = testamentaryDocsObj[indextest];
                            const { filteredArray, responseLegalArray } = filterAgentUserArray(filterTheArray, testamentaryDocsObjMap.legalDocId, (testamentaryDocsObjMap?.testDocId == undefined) ? null : testamentaryDocsObjMap.testDocId, (testamentaryDocsObjMap?.testSupportDocId == undefined) ? null : testamentaryDocsObjMap.testSupportDocId);
                            legalDocumentsMapped[index].testamentaryDocs[indextest].agents = filteredArray;
                            if (filteredArray.length > 0) {
                                legalDocumentsMapped[index].testamentaryDocs[indextest].testamentaryDocsChecked = true;
                                legalDocumentsMapped[index].showTestamentoryDocuments = true;
                                if (Object.entries(selectedLegalDocObj).length == 0) {
                                    const legaldoc = legalDocumentsMapped[index].testamentaryDocs[indextest];
                                    legaldoc.selectedLegalDocumentType = "testamentaryDocs"
                                    selectedLegalDocObj = legaldoc;
                                }
                            }
                            filterTheArray = responseLegalArray;
                        }
                    }

                    // const testamentarySupportDocsObj = legalDocObj.testamentarySupportDocs;
                    const testamentarySupportDocsObj = (memberUserId == "Joint" && checkAgentsPriAndSpou !== true) ? [] :  legalDocObj.testamentarySupportDocs;
                    konsole.log("paralegal assingroles", testamentarySupportDocsObj, filterTheArray);
                    if (testamentarySupportDocsObj.length > 0) {
                        for (let [indextest, agentLegal] of testamentarySupportDocsObj.entries()) {
                            const testamentarySupportDocsObjMap = testamentarySupportDocsObj[indextest];
                            const { filteredArray, responseLegalArray } = filterAgentUserArray(filterTheArray, testamentarySupportDocsObjMap.legalDocId, (testamentarySupportDocsObjMap?.testDocId == undefined) ? null : testamentarySupportDocsObjMap.testDocId, (testamentarySupportDocsObjMap?.testSupportDocId == undefined) ? null : testamentarySupportDocsObjMap.testSupportDocId);
                            legalDocumentsMapped[index].testamentarySupportDocs[indextest].agents = filteredArray;
                            if (filteredArray.length > 0) {
                                legalDocumentsMapped[index].showTestamentoryDocumentsSupport = true;
                                legalDocumentsMapped[index].testamentarySupportDocs[indextest].testamentarySupportDocsChecked = true;
                                if (Object.entries(selectedLegalDocObj).length == 0) {
                                    const legaldoc = legalDocumentsMapped[index].testamentarySupportDocs[indextest];;
                                    legaldoc.selectedLegalDocumentType = "testamentarySupportDocs"
                                    selectedLegalDocObj = legaldoc;
                                }
                            }
                            filterTheArray = responseLegalArray;
                        }
                    }
                    // konsole.log("legalDocys", legalDocumentsMapped);
                }
                konsole.log("selrewrlwejrkhwkghadsjkfgha", selectedLegalDocObj,primaryUserId);
               
                    setSelectedLegalDocsObj(selectedLegalDocObj)

            }
            konsole.log("legalDocumentsMapped",legalDocumentsMapped,legalDocuments)
            setLegalDocuments(legalDocumentsMapped);
            setReRenderPage(!reRenderPage);
        }
        else {
            props.dispatchloader(false);
            setUserAgentArray([]);
        }
    }

    function handleSendInvitePopup () {
        const uniqueArr = getUniqueArrayFromAgentUsr(userAgentArray);
        setUniqueUserAgentArray(uniqueArr);
        handleInviteModal(true);
    }
}




function filterAgentUserArray(responseLegalArray, legalDocId, testDocId, testSupportDocId){
    let filteredArray = responseLegalArray.filter(function (obj) {
        return (obj.legalDocId == legalDocId && (obj?.testDocId === testDocId) && (obj?.testSupportDocId === testSupportDocId));
    });
    konsole.log("filertere", legalDocId, testDocId, responseLegalArray, filteredArray);
    
    // delete data
    while (responseLegalArray.findIndex(function (obj) {
        return (obj.legalDocId === legalDocId && (obj?.testDocId == testDocId) && (obj?.testSupportDocId === testSupportDocId));
    }) !== -1) {
        responseLegalArray.splice(responseLegalArray.findIndex(function (obj) {
            return (obj.legalDocId === legalDocId && (obj?.testDocId == testDocId) && (obj?.testSupportDocId === testSupportDocId));
        }), 1);
    }

    return { filteredArray, responseLegalArray };
}


function getUniqueArrayFromAgentUsr (userAgentArray){
    const userAgentArrayFiltered = userAgentArray.filter(d => d.agentUserId !== null);
    const uniqueArr = [...new Set(userAgentArrayFiltered.map(item => item.agentUserId))].map(name => {
        return { ...userAgentArrayFiltered.find(item => item.agentUserId === name), checked: true };
    });

    return uniqueArr;
}


const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect("", mapDispatchToProps)(AssignRoleContainer);