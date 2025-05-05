import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Primaryagentmodel from "../../../components/Primaryagentmodel";
import Successormodal from "../../../components/Successormodal";
import AlertToaster from "../../../components/control/AlertToaster";

import {
  $CommonServiceFn,
  $postServiceFn,
  $getServiceFn,
} from "../../../components/network/Service";
import konsole from "../../../components/control/Konsole";
import { $Service_Url } from "../../../components/network/UrlPath";
import { $AHelper } from "../../../components/control/AHelper";
// import "../styles/Assign.css"

const Assignselectshow = (props) => {
  let setsubmitData = false;
  const [showagentmodel, setshowagentmodel] = useState(false);
  const [showsuccessormodal, setshowsuccessormodal] = useState(false);
  const [checked, setChecked] = useState([
    "/app/Http/Controllers/WelcomeController.js",
    "/app/Http/routes.js",
    "/public/assets/style.css",
    "/public/index.html",
    "/.gitignore",
  ]);

  const [legalDocCheck, setLegalDocCheck] = useState();
  const [replicateListChecked, setReplicateListChecked] = useState([]);
  const [treeInsideTree, setTreeInsideTree] = useState(false);
  const [treeCondition, setTreeCondition] = useState(false);
  const [listArray, setListArray] = useState([]);
  const [sideTreeFunctionality, setSideTreeFunctionality] = useState([]);
  const [sideTreeFunctionality1, setSideTreeFunctionality1] = useState([]);
  const [sideTreeFunctionality2, setSideTreeFunctionality2] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [getUserAgent, setgetUserAgent] = useState([]);
  const [newGetUserAgent, setNewGetUserAgent] = useState([]);
  const [getSuccessorData, setGetSuccessorData] = useState([]);
  const [newGetSuccessorData, setNewGetSuccessorData] = useState([]);
  const [getPrimaryAgentData, setGetPrimaryAgentData] = useState([]);
  const [getSuccessorApiData, setGetSuccessorApiData] = useState([]);
  const [fileObject, setfileObject] = useState({});
  const [updatePage, setUpdatePAge] = useState(false);
  // const [Select, setSelect] = useState(false);
  const [logginUserId, setlogginUserId] = useState("");
  const [supportDoc, setsupportDoc] = useState([]);
  const [ownershipName, setownershipName] = useState("");
  const [getFilterDataFromPrimaryAgent, setGetFilterDataFromPrimaryAgent] =
    useState([]);
  const [ownerChecked, setownerChecked] = useState(false);
  const [RoleName, setRoleName] = useState([]);
  const [testDocName, settestDocName] = useState([]);
  const [hideAndShow, setHideAndShow] = useState("");
  const [sideFunction, setSideFunction] = useState([]);
  const [sideFunction1, setSideFunction1] = useState([]);
  const [documentList, setdocumentList] = useState([]);
  const [DocumentId, setDocumentId] = useState("");
  const [selectlabelname, setSelectLabelName] = useState([]);
  const [selectlabelChecked, setSelectLabelChecked] = useState([]);
  const [legalDocOwnershipName, setlegalDocOwnerShipName] = useState("");
  const [checkedDocName, setCheckedDocName] = useState(false);
  const [RoleID, setRoleId] = useState("");
  const [fileId, setfileId] = useState("");
  const [testDocId, settestDocId] = useState("");
  const [testSupportDocId, settestSupportDocId] = useState("");
  const [userIdData, setUserIdData] = useState("");
  const [replicate, setReplicate] = useState();
  const [treeValue, setTreeValue] = useState(false);
  const [jsonOpreator, setJsonOpreator] = useState("");
  const [getapiresponseData, setgetapiresponseData] = useState([]);
  const [legalDocNameData, setLegalDocNameData] = useState("");
  const [filterDataListValue, setFilterDataListValue] = useState([]);
  const [successorRuplicate, setSuccessorRuplicate] = useState();
  const [docuDropdown, setDocuDropdown] = useState(false);
  const [imgConditionData, setImgConditionData] = useState(false);
  const [treeData, setTreeData] = useState(false);
  const [treeData1, setTreeData1] = useState(false);
  const [treeFunc, setTreeFunc] = useState({
    legalDocId: "",
    legalDocName: "",
    applicableRoleName: "",
  });
  const [primaryFilterData, setPrimaryFilterData] = useState([]);

  const [mergeData, setmergeData] = useState([]);

  const [solo, setsolo] = useState("");
  const [UserId, setUserId] = useState("");
  const [removeData, setremoveData] = useState({
    checked: true,
    testDocId: "",
  });

  const handleShowAgent = () => {
    setshowagentmodel(!showagentmodel);
  };
  const handleShowSuccessor = () => {
    setshowsuccessormodal(!showsuccessormodal);
  };

  useEffect(() => {
    if (getSuccessorApiData.length > 0 || getPrimaryAgentData.length > 0) {
      StorageData();
    }
  }, [getPrimaryAgentData, getSuccessorApiData]);

  useEffect(() => {
    const userId = sessionStorage.getItem("SessPrimaryUserId");
    const spouseUserId = sessionStorage.getItem("spouseUserId");
    setUserIdData(userId);
    saveCoAgent(userId);
    document.getElementById("DisplayBlock").style.display = "none";
    setHideAndShow("80vh");
  }, []);

  useEffect(() => {
    const userId = sessionStorage.getItem("SessPrimaryUserId");
    const loggedUserId = sessionStorage.getItem("loggedUserId");
    setUserId(userId);
    setlogginUserId(loggedUserId);
    if (legalDocCheck == true) {
      legalDocumentTree();
    }
    legalDocumentList();
    konsole.log("check", checkedDocName);
  }, [DocumentId]);

  const selectFileUpload = (e, index, data) => {
    konsole.log("IndeXaaaasasasas", index);
    if(data.testDocId !== "" && data.testDocId !== null && data.testDocId !== undefined){
      
      document.getElementById(`fileUploadLifeId${index}`).click();
    }else{
      document.getElementById(`UploadFilesData`).click();

    }
  };

  const checkFiles = (e) =>{
    konsole.log("kokokokokokokoko",e.target.files[0])

    $postServiceFn.postFileUpload(
      e.target.files[0],
      UserId,
      logginUserId,
      2,
      6,
      1,
      (response, errorData) => {
        if (response) {
         
          konsole.log("responseSingle", response);
          let responseFileId = response.data.data.fileId;
          konsole.log("fileIDSingle", responseFileId);
          userFileCabinetAPIFunc(responseFileId, e.target.files[0]?.name)
          setfileId(responseFileId);
          let responsedocName = response.data.data.fileName;
          konsole.log("fileNameSingle", responsedocName);
          let responsedocPath = response.data.data.fileURL;
          konsole.log("filePath", responsedocPath);
          // handleFilesubmit(responseFileId, responsedocName, responsedocPath);
        } else if (errorData) {
          konsole.log("errr", errorData);
        }
      }
    );



  }

  const handleFileSelection = (e, index) => {
    const listOfArray = listArray;
    konsole.log("abababFIleName", e.target.files[0]);
    if (e.target.files.length == 0) {
      setfileObject(null);
      return;
    }
    let typeOfFile = e.target.files[0].type;
    konsole.log("fileType", typeOfFile);
    if (typeOfFile !== "application/pdf") {
      alert("only pdf format allowed");
      return;
    }
    konsole.log("fileee", e.target.files[0]);
    listOfArray[index]["fileObj"] = e.target.files[0];
  
    setListArray(listOfArray);
    setUpdatePAge(true);
    setfileObject(e.target.files[0]);
    handleFileUpload(index);
  };

  const handleFileUpload = (index) => {
    for (let i = index; i < listArray.length; i++) {
      if (
        listArray[i]?.fileObj !== null &&
        listArray[i]?.fileObj !== undefined &&
        listArray[i]?.fileObj !== ""
      ) {
        konsole.log(
          "objecte",
          listArray[i].fileObj,
          Object.keys(listArray[i]?.fileObj).length
        );
        $postServiceFn.postFileUpload(
          listArray[i].fileObj,
          UserId,
          logginUserId,
          2,
          6,
          1,
          (response, errorData) => {
            konsole.log("fileDataName", listArray[i].fileObj.name);
            if (response) {
              // AlertToaster.success(`${listArray[i].fileObj.name} Uploaded`);

              // alert("File uploaded")
              konsole.log("responseFileUpload", response);
              let responseFileId = response.data.data.fileId;
              konsole.log("fileId", responseFileId);
              userFileCabinetAPIFunc(responseFileId, listArray[i].fileObj.name)
              setfileId(responseFileId);
              let responsedocName = response.data.data.fileName;
              konsole.log("fileName", responsedocName);
              let responsedocPath = response.data.data.fileURL;
              konsole.log("filePath", responsedocPath);
              // handleFilesubmit(responseFileId, responsedocName, responsedocPath);
            } else if (errorData) {
              konsole.log("errr", errorData);
            }
          }
        );
      } else {
        // handleFilesubmit(null);
      }
    }
  };

  const handleClick = (event, mapData, index) => {
    konsole.log(event.target);
    console.log("indexDataindex:",mapData);
    selectFileUpload(event, index , mapData);
  };
  // konsole.log("listArray", listArray);

  const onSelectUploadFile = (e, listData, docItemList, index) => {
    setEditIconShowAndHide("noData")
    let legalDataName = e.target.getAttribute("data_Name");
    setLegalDocNameData(legalDataName);
    // konsole.log("legalDataName", legalDataName);
    const checked = e.target.checked;
    const roleName = e.target.value;
    const roleId = e.target.id;
    const testDocName = e.target.name;
    konsole.log(
      // "testDocName::",
      // testDocName,
      // "roleName::",
      // roleName,
      "roleId::",
      roleId,
      // "checked::",
      // checked,
      // "index::",
      // index,
      "listDatalistData",
      listData,
      "docItemListdocItemList",
      docItemList
    );
    setRoleId(roleId);
    // setTreeCondition(true);
    let filterForId = listArray.filter((idValue) => {
      return testDocName == idValue.testDocName;
    });

    let filterTestDocId = filterForId[0].testDocId;
    konsole.log("checked", listArray[index].checked, index, filterTestDocId);
    konsole.log("roleIdroleId", filterForId);
    settestDocId(filterForId[0].testDocId);
    setRoleName(roleName);
    settestDocName(testDocName);

    let arrayDataApi = [];
    let listFileUploaded = [];
    let replicateArray = [];

    if (checked == true) {
      listArray[index].replicateStatus = checked;
      listArray[index]["correctChecked"] = checked;
      let DataFunctionSide = {
        testDocName: testDocName,
        legalDataName: legalDataName,
        filterTestDocIdRes: filterTestDocId,
        agentRoleId: filterForId[0].applicableRoleId,
      };
      arrayDataApi.push(DataFunctionSide);
      setSideFunction([...sideFunction, arrayDataApi].flat(1));
      setSideFunction1([...sideFunction1, arrayDataApi].flat(1));

      let replicateArrayData = {
        testDocId: listData.testDocId,
        testDocName: listData.testDocName,
        legalDocName: listData.legalDocName,
      };
      replicateArray.push(replicateArrayData);

      setremoveData({
        checked: checked,
        testDocId: filterForId[0].testDocId,
      });

      setReplicateListChecked(
        [...replicateListChecked, replicateArray].flat(1)
      );
    

      let filterDataListArray = getapiresponseData.filter((listArrayValue) => {
        return (
          listArrayValue.testDocId == listData.testDocId &&
          listArrayValue.legalDocName == listData.legalDocName &&
          listArrayValue.testDocName == listData.testDocName
        );
      });
      listFileUploaded.push(filterDataListArray);
      listArray[index].fileId = filterDataListArray[0];

      setFilterDataListValue(
        [...filterDataListValue, listFileUploaded].flat(1)
      );
    } else if (checked == false) {
      let filterReplicateData = replicateListChecked.splice(
        replicateListChecked.findIndex(
          (x) =>
            x.testDocId == listData.testDocId &&
            x.testDocName == listData.testDocName
        ),
        1
      );

      if (agentReplicate == false && replicateStatus == false) {
        let removeDataFrom = sideFunction1.splice(
          sideFunction1.findIndex((a) => a.testDocName == testDocName),
          1
        );
      }

      sideFilterData(testDocName);
      listArray[index].replicateStatus = checked;
      listArray[index]["correctChecked"] = checked;

      setremoveData({
        checked: checked,
        testDocId: filterForId[0].testDocId,
      });
      konsole.log("not print");
    }

    let getapiresponseDatafilterdata = [];
    let getapiresponseWillDatafilterdata = [];
    let primarydata = [];
    let primaryWilldata = [];
    let successorWilldata = [];
    let successordata = [];
    if (getapiresponseData.length > 0) {
      getapiresponseDatafilterdata = getapiresponseData.filter((items) => {
        return (
          items.legalDocName == legalDataName &&
          items.testDocId == filterTestDocId
        );
      });
      primarydata = getapiresponseDatafilterdata
        .filter((v) => {
          return v.agentRankId <= 6;
        })
        .sort((a, b) => {
          return a.agentRankId - b.agentRankId;
        });
      successordata = getapiresponseDatafilterdata
        .filter((v) => {
          return v.agentRankId >= 7;
        })
        .sort((a, b) => {
          return a.agentRankId - b.agentRankId;
        });

      // ...................................................................................

      konsole.log("docItemListdocItemList", docItemList);

      getapiresponseWillDatafilterdata = getapiresponseData.filter((items) => {
        return (
          items.legalDocName == docItemList?.legalDocName &&
          items.legalDocId == docItemList?.legalDocId &&
          items.agentRole == docItemList?.applicableRoleName
        );
      });
      primaryWilldata = getapiresponseWillDatafilterdata
        .filter((v) => {
          return v.agentRankId <= 6;
        })
        .sort((a, b) => {
          return a.agentRankId - b.agentRankId;
        });
      successorWilldata = getapiresponseWillDatafilterdata
        .filter((v) => {
          return v.agentRankId >= 7;
        })
        .sort((a, b) => {
          return a.agentRankId - b.agentRankId;
        });

      // ...................................................................................
    }

    if (checked == true) {
      if (agentReplicate == true) {
        setgetUserAgent(newGetUserAgent);
        setGetSuccessorData(newGetSuccessorData);
      } else if (replicateStatus == true) {
        setGetSuccessorData(newGetSuccessorData);
        setgetUserAgent(primarydata);
      } else {
        setgetUserAgent(primarydata);
        setGetSuccessorData(successordata);
      }
    } else if (checked == false) {
      if (agentReplicate == true) {
        setgetUserAgent(primaryWilldata);
        setGetSuccessorData(successorWilldata);
        settestDocName(filterForId[0]?.legalDocName);
      } else if (replicateStatus == true) {
        setgetUserAgent(primaryWilldata);
        setGetSuccessorData(successorWilldata);
        settestDocName(filterForId[0]?.legalDocName);
      } else {
        setgetUserAgent(primaryWilldata);
        setGetSuccessorData(successorWilldata);
        settestDocName(filterForId[0]?.legalDocName);
      }
      if(primaryWilldata.length != 0 && successorWilldata.length != 0){
        setEditIconShowAndHide("BothData")
      }else if(primaryWilldata.length != 0 && successorWilldata.length == 0){
        setEditIconShowAndHide("PrimaryData")
      }else if(primaryWilldata.length == 0 && successorWilldata.length != 0){
        setEditIconShowAndHide("SuccessorData")
      }else{
        setEditIconShowAndHide("noData")
      }

      
    }
    
  };

  const sideFilterData = (sideFilterData) => {
    let newIndexNumber = sideFunction.splice(
      sideFunction.findIndex((a) => a.testDocName == sideFilterData),
      1
    );
    // konsole.log("testDocNamedssadasdas", sideFunction);
  };

  const legalDocumentTree = () => {
    let completeArrayRes = [];
    let completeSupportDoc = [];

    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getLegalDocumentTree + DocumentId,
      "",
      (response) => {
        if (response) {
          konsole.log(
            "responseDataApiLoop",
            response.data.data
          );
          // konsole.log(
          //   "responseDataApiLoop",
          //   response.data.data.testamentaryDocs
          // );

          let responseData = response.data.data.testamentaryDocs;
          konsole.log("loopData", responseData.length);
          let treeObjArray = [];
          let treeObj;
          let len = responseData.length;
          completeArrayRes.push(responseData);
          completeSupportDoc.push(response.data.data.testamentarySupportDocs);
          let flatCompleteArrayRes = completeArrayRes.flat(1);
          setListArray([...listArray, completeArrayRes.flat(1)].flat(1));
          let filterDataValue;

          loop1: for (let i = 0; i < len; i++) {
            filterDataValue = getapiresponseData.filter((xValue) => {
              return (
                xValue.legalDocName == responseData[i].legalDocName &&
                xValue.legalDocId == responseData[i].legalDocId &&
                xValue.testDocId == responseData[i].testDocId &&
                xValue.testDocName == responseData[i].testDocName
              );
            });

            responseData[i].checkedStatus =
              filterDataValue[0]?.agentActiveStatus;
            if (filterDataValue[0]?.agentActiveStatus == true) {
              treeObj = {
                filterTestDocIdRes: filterDataValue[0]?.testDocId,
                legalDataName: filterDataValue[0]?.legalDocName,
                testDocName: filterDataValue[0]?.testDocName,
                agentRoleId: filterDataValue[0].agentRoleId,
              };
              treeObjArray.push(treeObj);
            }
            setSideFunction([...sideFunction, treeObjArray].flat(1));
            setSideFunction1([...sideFunction1, treeObjArray].flat(1));

            konsole.log(
              "filterDataValuefilterDataValue",
              filterDataValue,
              "len::",
              len,
              "only i::",
              i
            );

            konsole.log("responseDataresponseData", responseData);
      }
          konsole.log("treeObjtreeObj", treeObj);
          setsupportDoc([...supportDoc, completeSupportDoc.flat(1)].flat(1));
        }
      }
    );
  };

  konsole.log("supportDocsupportDoc",supportDoc)
  const ownerShipId = (e) => {
    let ownerShipName = e.target.value;
    let supportDocId = e.target.id;

    konsole.log("ownerShipId", ownerShipName, supportDocId);
    settestSupportDocId(supportDocId);
    setownershipName(ownerShipName);
    setownerChecked(!ownerChecked);
  };

  const legalDocId = (e, index, item) => {
    documentList[index].checked = e.target.checked;
    // konsole.log("DocumentId", e.target.id);
    let eventId = e.target.id;
    let eventChecked = e.target.checked;
    konsole.log(
      "NameDocumentId",
      e.target.id,
      "index::",
      index,
      "Checked::",
      e.target.checked,
      "itemitem::",
      item
    );

    setLegalDocCheck(eventChecked);

    let filterDatagetapiresponseData = getapiresponseData.filter(
      (datagetapiresponseData) => {
        return (
          datagetapiresponseData.agentRole == item.applicableRoleName &&
          datagetapiresponseData.legalDocName == item.legalDocName &&
          datagetapiresponseData.legalDocId == item.legalDocId
        );
      }
    );

    konsole.log(
      "filterDatagetapiresponseData",
      filterDatagetapiresponseData[0]?.agentActiveStatus
    );

    let filterdata = documentList.filter((value) => {
      return value.legalDocId == e.target.id;
    });
    let eventName = filterdata[0]?.legalDocName;
    konsole.log("filterdataselectlabelnamesideFunction", filterdata);

    let dataDocumnet = [];

    let arrayFilterData = [];

    let filterlableNameData = {
      legalDocName: filterdata[0]?.legalDocName,
      legalDocId: filterdata[0]?.legalDocId,
    };

    if (eventChecked == false) {
      let filterLegalDoc = listArray.filter((item) => {
        return item.legalDocId == eventId;
      });
      konsole.log("filterLegalDoc", filterLegalDoc);
      setListArray(filterLegalDoc);

      let filterSupportData = supportDoc.filter((items) => {
        return items.legalDocId == eventId;
      });
      setsupportDoc(filterSupportData);
    }

    if (eventId == index + 1 && eventChecked == false) {
      let filterDataDocument = selectlabelChecked.splice(
        selectlabelChecked.findIndex(
          (x) => x.legalDocId == eventId && x.legalDocName == eventName
        ),
        1
      );

      let newIndexNumber = selectlabelname.splice(
        selectlabelname.findIndex((a) => a.legalDocName == eventName),
        1
      );
    } else {
      arrayFilterData.push(filterlableNameData);
      setSelectLabelName([...selectlabelname, arrayFilterData].flat(1));

      let dataDocumentObj = {
        applicableRoleId: filterdata[0]?.applicableRoleId,
        applicableRoleName: filterdata[0]?.applicableRoleName,
        legalDocId: filterdata[0]?.legalDocId,
        legalDocName: filterdata[0]?.legalDocName,
        ownerShipId: filterdata[0]?.ownershipId,
        ownershipName: filterdata[0]?.ownershipName,
        statusChecked: filterDatagetapiresponseData[0]?.agentActiveStatus
          ? true
          : false,
      };

      dataDocumnet.push(dataDocumentObj);
      konsole.log("dataDocumentObj.checked", dataDocumentObj.checked);
      setModalIdToOpen(dataDocumentObj?.statusChecked);

      setSelectLabelChecked([...selectlabelChecked, dataDocumnet].flat(1));
      setlegalDocOwnerShipName(filterdata[0]?.ownershipName);
      // setDocumentId([...DocumentId, e.target.id]);
      setDocumentId(e.target.id);
      setCheckedDocName(true);
    }
  };

  const legalDocumentList = () => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getLegalDocuments,
      $getServiceFn,
      (response) => {
        if (response) {
          konsole.log("DocumentList", response.data.data);
          setdocumentList(response.data.data);
        }
      }
    );
  };
  konsole.log(
    "DocProps",
    DocumentId,
    selectlabelname,
    legalDocOwnershipName,
    checkedDocName,
    "DocProps::",
    RoleID,
    fileId
  );
  konsole.log("getSuccessorApiData", getSuccessorApiData);

  const runUpsertedApi = () => {
    let arr3 = [];

    konsole.log("mergeData", mergeData);

    let MergeDataValue = mergeData.flat(1);
    konsole.log("flattenArrayTreeData", MergeDataValue);
    let MergeApiDataArray1 = [];
    if (removeData.checked == false) {
      MergeApiDataArray1 = MergeDataValue.filter((v) => {
        konsole.log("vvvvv", v);
        return v.testDocId !== removeData.testDocId;
      });
    }

    konsole.log("replicateListChecked", replicateListChecked);

    let ArrayofTenTimes = [];
    if (successorRuplicate == true || replicate == true) {
      let spouseUserId = sessionStorage.getItem("spouseUserId");
      for (let i = 0; i < MergeDataValue.length; i++) {
        MergeDataValue[i].memberUserId = spouseUserId;

        ArrayofTenTimes.push(MergeDataValue[i]);

        konsole.log("spouseUserIdspouseUserId", MergeDataValue[i]);
      }
    }
    konsole.log("spouseUserIdspouseUserId", ArrayofTenTimes);
    konsole.log("ArrayofTenTimes", ArrayofTenTimes);

    let ArrayofTenTimes1 = ArrayofTenTimes.flat(1);
    konsole.log("ArrayofTenTimes1", ArrayofTenTimes1);

    // ..........................................................................................................................

    if (replicateStatus == true) {
      const fun = (replicateSuccessorData, dataToReplicate) => {
        return {
          agentAcceptanceStatus: dataToReplicate.agentAcceptanceStatus,
          agentActiveStatus: dataToReplicate.agentActiveStatus,
          agentId: dataToReplicate.agentId,
          agentRankId: dataToReplicate.agentRankId,
          agentRoleId: replicateSuccessorData.agentRoleId,
          agentUserId: dataToReplicate.agentUserId,
          fileId: dataToReplicate.fileId,
          legalDocId: dataToReplicate.legalDocId,
          memberUserId: dataToReplicate.memberUserId,
          testDocId: replicateSuccessorData?.filterTestDocIdRes,
          testSupportDocId: dataToReplicate.testSupportDocId,
          upsertedBy: dataToReplicate.upsertedBy,
        };
      };

      // let arr3 = [];
      for (let i = 0; i < getSuccessorApiData.length; i++) {
        for (let j = 0; j < sideFunction.length; j++) {
          MergeDataValue.push(fun(sideFunction[j], getSuccessorApiData[i]));
        }
      }
    }

    // if (agentReplicate == true) {
    //   const fun = (replicateSuccessorData, dataToReplicate) => {
    //     return {
    //       agentAcceptanceStatus: dataToReplicate.agentAcceptanceStatus,
    //       agentActiveStatus: dataToReplicate.agentActiveStatus,
    //       agentId: dataToReplicate.agentId,
    //       agentRankId: dataToReplicate.agentRankId,
    //       agentRoleId: replicateSuccessorData.agentRoleId,
    //       agentUserId: dataToReplicate.agentUserId,
    //       fileId: dataToReplicate.fileId,
    //       legalDocId: dataToReplicate.legalDocId,
    //       memberUserId: dataToReplicate.memberUserId,
    //       testDocId: replicateSuccessorData.filterTestDocIdRes,
    //       testSupportDocId: dataToReplicate.testSupportDocId,
    //       upsertedBy: dataToReplicate.upsertedBy,
    //     };
    //   };

    //   for (let i = 0; i < MergeDataValue.length; i++) {
    //     for (let j = 0; j < sideFunction.length; j++) {
    //       arr3.push(fun(sideFunction[j], MergeDataValue[i]));
    //     }
    //   }

    //   if (
    //     MergeDataValue[0].testDocId == "" ||
    //     MergeDataValue[0].testDocId == null ||
    //     MergeDataValue[0].testDocId == undefined
    //   ) {
    //     arr3 = [...arr3, ...MergeDataValue];
    //     konsole.log("arr3datadatadataarr3", arr3);
    //   }
    // }

    // ..........................................................................................................................

    let sendArrayDataToAPI = [];

    if (replicateStatus == true) {
      let NewArr = MergeDataValue.filter((v,i,a)=>a.findIndex(v2=>((v2.agentRoleId==v.agentRoleId && v2.agentRankId==v.agentRankId && v2.testDocId==v.testDocId)))==i)
      sendArrayDataToAPI = NewArr;
      konsole.log("sendArrayDataToAPIS", sendArrayDataToAPI);
    } else if (agentReplicate == true) {
      sendArrayDataToAPI = arr3;
      konsole.log("sendArrayDataToAPIR", sendArrayDataToAPI);
    } else {
      sendArrayDataToAPI = MergeDataValue;
    }
    konsole.log("sendArrayDataToAPIM", sendArrayDataToAPI);
    konsole.log("sendArrayDataToAPIM", JSON.stringify(sendArrayDataToAPI));


    $CommonServiceFn.InvokeCommonApi(
      "POST",
      $Service_Url.postAgentUpsert,
      sendArrayDataToAPI,
      (response) => {
        konsole.log("upserttPOSTData", response);
        if (response) {
          AlertToaster.success("Data Uploaded Successfully");
          saveCoAgent(userIdData);
          setfileId("")
        }
      }
    );

  };
  const StorageData = () => {
    let MergeTreeArray = [];

    if (jsonOpreator == "PrimaryData") {
      MergeTreeArray.push(getPrimaryAgentData);
    } else if (jsonOpreator == "SuccessorData") {
      MergeTreeArray.push(getSuccessorApiData);
    }
    let flattenArrayTreeData = MergeTreeArray.flat(1);
    setmergeData([...mergeData, flattenArrayTreeData]);
  };
 const saveCoAgent = (userId) => {
    konsole.log("useIdddd", userIdData);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getUserAgent + `?IsActive=true&UserId=${userId}`,
      $getServiceFn,
      (response) => {
        if (response) {
          setmergeData([]);
          konsole.log("userAgentDataGET", response.data.data);
          setgetapiresponseData(response.data.data);
          let responseData = response.data.data;
          let responseTestDoc_1Data = responseData.filter(
            (v) => v.agentId == 1170
          );
          let responseTestDoc_2Data = responseData.filter(
            (v) => v.testDocId == 2
          );
          konsole.log("responseTestDoc_1Data", responseTestDoc_1Data);
          setSideTreeFunctionality(responseData);

        }      }
    );

  };

  const testDocIdData = (details) => {
    konsole.log("testDocIdDataarrayDataApi", details);
    setSideFunction(details);
  };

  const [replicateStatus, setReplicateStatus] = useState(false);

  const ReplicateSuccessors = (e) => {
    setReplicateStatus(!replicateStatus);

    // setSideFunction([])
    if (e.target.checked == true) {
      let arrayDataApi = [];

      for (let i = 0; i < listArray.length; i++) {
        listArray[i]["replicateStatus"] = e.target.checked;

        let DataFunctionSide = {
          testDocName: listArray[i].testDocName,
          legalDataName: listArray[i].legalDocName,
          filterTestDocIdRes: listArray[i].testDocId,
          agentRoleId: listArray[i].applicableRoleId,
        };
        arrayDataApi.push(DataFunctionSide);
        testDocIdData(arrayDataApi);
      }
      konsole.log("ReplicateSuccessors", e.target.checked);
    } else {
      setSideFunction(sideFunction1);
      for (let i = 0; i < listArray.length; i++) {
        listArray[i]["replicateStatus"] = e.target.checked;
      }
    }
  };

  konsole.log("replicateStatus", replicateStatus);
  const [agentReplicate, setAgentReplicate] = useState(false);

  const ReplicateAgent = (e) => {
    let eventName = e.target.value;
    let eventChecked = e.target.checked;
    setAgentReplicate(!agentReplicate);
    konsole.log("eventChecked", eventChecked);

    let arrayDataApi = [];
    if (eventChecked == true) {
      for (let i = 0; i < listArray.length; i++) {
        listArray[i]["replicateStatus"] = e.target.checked;

        let DataFunctionSide = {
          testDocName: listArray[i].testDocName,
          legalDataName: listArray[i].legalDocName,
          filterTestDocIdRes: listArray[i].testDocId,
          agentRoleId: listArray[i].applicableRoleId,
        };
        arrayDataApi.push(DataFunctionSide);

        testDocIdData(arrayDataApi);
      }
    } else {
      setSideFunction(sideFunction1);
      for (let i = 0; i < listArray.length; i++) {
        listArray[i]["replicateStatus"] = e.target.checked;
      }
    }
  };
  konsole.log("PrimaryReplicate::", agentReplicate);
  const treeFunction = (e, treeDataDetails) => {
    let apiDataFilter = [];
    konsole.log("treeDatatreeData", treeDataDetails);
    setTreeFunc({
      legalDocId: treeDataDetails.legalDocId,
      legalDocName: treeDataDetails.legalDocName,
      applicableRoleName: treeDataDetails.applicableRoleName,
    });
    setTreeData(!treeData);
    setTreeData1(!treeData1);
    apiDataFilter = getapiresponseData.filter((x) => {
      return (
        x.agentRole == treeDataDetails.applicableRoleName &&
        x.legalDocId == treeDataDetails.legalDocId &&
        x.agentRole == treeDataDetails.applicableRoleName &&
        x.legalDocName == treeDataDetails.legalDocName &&
        x.testDocName == null &&
        x.testDocId == null
      );
    });

    konsole.log("apiDataFilterapiDataFilterapiDataFilter",apiDataFilter)
    setSideTreeFunctionality2(apiDataFilter);
  };
  const [treeFunctionData, setTreeFunctionData] = useState(false);
  const [details, setDetails] = useState({
    indexNo: "",
    DataName: "",
    legalDataNameData: "",
  });
  const [imgTress, setImgTree] = useState("../images/Group 1568.png ");
  const [indexvalue, setIndexvalue] = useState();

  const imgClickDataShow = (e, index, v) => {
    // setImgConditionData(!imgConditionData);
    konsole.log(
      "Target::",
      e.target.click,
      "IndexNumber::",
      index,
      "TreeData::",
      v
    );

    setDetails({
      indexNo: index,
      DataName: v?.testDocName,
      legalDataNameData: v?.legalDataName,
    });

    let filterSideTreeData = sideTreeFunctionality
      .filter((items) => {
        return (
          items.testDocName == v.testDocName &&
          items.legalDocName == v.legalDataName
        );
      })
      .sort((a, b) => {
        return a.agentRankId - b.agentRankId;
      });
    konsole.log("filterSideTreeData", filterSideTreeData);
    setSideTreeFunctionality1(filterSideTreeData);
    if (indexvalue !== index) {
      setIndexvalue(index);
      setTreeFunctionData(true);
      setImgConditionData(true);
    } else if (indexvalue == index) {
      setTreeFunctionData(!treeFunctionData);
      setImgConditionData(!imgConditionData);
    }
  };

  const documentDropDown = () => {
    setDocuDropdown(!docuDropdown);
    if(docuDropdown == false){
      setUpAndDownArrowImg("/images/UpArrow.png")
    }else{
      setUpAndDownArrowImg("/images/downArrow.png")
    }
    if (docuDropdown == false) {
      document.getElementById("DisplayBlock").style.display = "none";
      setHideAndShow("80vh");
    } else if (selectlabelname.length > 0 && docuDropdown == true) {
      let fiterData = getapiresponseData.filter((x) => {
        return (
          x.agentRole == selectlabelChecked[0].applicableRoleName &&
          x.legalDocName == selectlabelChecked[0].legalDocName &&
          x.legalDocId == selectlabelChecked[0].legalDocId &&
          x.testDocId == null
        );
      });
      konsole.log("fiterDatafiterData", fiterData);
      let primarydata = [];
      let successordata = [];

      primarydata = fiterData
        .filter((v) => {
          return v.agentRankId <= 6;
        })
        .sort((a, b) => {
          return a.agentRankId - b.agentRankId;
        });
      successordata = fiterData
        .filter((v) => {
          return v.agentRankId >= 7;
        })
        .sort((a, b) => {
          return a.agentRankId - b.agentRankId;
        });
      konsole.log("primarydataprimarydata", primarydata);
      konsole.log("successordatasuccessordata", successordata);
      settestDocName(primarydata[0]?.legalDocName)
      // setRoleName(primarydata[0]?.agentRole)
      setgetUserAgent(primarydata);
      setGetSuccessorData(successordata);
      setHideAndShow("100%");
      if(primarydata.length != 0 && successordata.length != 0){
        setEditIconShowAndHide("BothData")
      }else if(primarydata.length != 0 && successordata.length == 0){
        setEditIconShowAndHide("PrimaryData")
      }else if(primarydata.length == 0 && successordata.length != 0){
        setEditIconShowAndHide("SuccessorData")
      }else{
        setEditIconShowAndHide("noData")
      }
      // legalDocumentTree();

      document.getElementById("DisplayBlock").style.display = "block";
    }
  };

  konsole.log("selectlabelnamesideFunction", selectlabelname);

  const [collectFileUpload, setCollectFileUpload] = useState([]);
  const [modalIdToOpen, setModalIdToOpen] = useState("");

  const documentCheckFunction = (e, index, docItemList) => {
    let apiDataFilter = [];
    let userAgentDataHold = [];
    let userAgentDataHold1 = [];
    let collectDataFileUpload = [];

    selectlabelChecked[index].checked = e.target.checked;
    konsole.log("indexDataDocuindex", docItemList.applicableRoleId);
    setModalIdToOpen(docItemList.checked);
    let replicateArrayData = [];
    if (e.target.checked == true) {
      let replicateList = {
        legalDocId: docItemList.legalDocId,
        legalDocName: docItemList.legalDocName,
      };
      replicateArrayData.push(replicateList);
      setReplicateListChecked(
        [...replicateListChecked, replicateArrayData].flat(1)
      );
      konsole.log("documentCheckFunction", e.target.checked);
      let filterDataOfDocument = documentList.filter((v) => {
        return v.legalDocName == e.target.value;
      });
      konsole.log("filterDataOfDocument", filterDataOfDocument);
      konsole.log(
        "filterDataOfDocument",
        filterDataOfDocument[0].applicableRoleId
      );
      setRoleId(filterDataOfDocument[0].applicableRoleId);
      apiDataFilter = getapiresponseData.filter((x) => {
        return (
          x.agentRole == filterDataOfDocument[0].applicableRoleName &&
          x.legalDocId == filterDataOfDocument[0].legalDocId &&
          x.legalDocName == filterDataOfDocument[0].legalDocName
        );
      });
      collectDataFileUpload.push(apiDataFilter[0]);
      selectlabelChecked[index].fileId = apiDataFilter[0];
      setCollectFileUpload(
        [...collectFileUpload, collectDataFileUpload].flat(1)
      );
      konsole.log("apiDataFilter", apiDataFilter[0]?.fileId);
      userAgentDataHold = apiDataFilter
        .filter((data) => {
          return (
            data.agentRankId <= 6 &&
            data.legalDocName == filterDataOfDocument[0].legalDocName
          );
        })
        .sort((a, b) => {
          return a.agentRankId - b.agentRankId;
        });
      konsole.log("apiDataFilterA", userAgentDataHold);
      userAgentDataHold1 = apiDataFilter
        .filter((dataS) => {
          return (
            dataS.agentRankId >= 7 &&
            dataS.legalDocName == filterDataOfDocument[0].legalDocName
          );
        })
        .sort((a, b) => {
          return a.agentRankId - b.agentRankId;
        });
      konsole.log("apiDataFilterS", userAgentDataHold1);
      setgetUserAgent(userAgentDataHold);
      setGetSuccessorData(userAgentDataHold1);
      let TreeDataFilter = sideTreeFunctionality
        .filter((q) => {
          return q.agentRole == filterDataOfDocument[0].applicableRoleName;
        })
        .sort((a, b) => {
          return a.agentRankId - b.agentRankId;
        });
      konsole.log("TreeDataFilter", TreeDataFilter);
    } else {
      let filterReplicateData = replicateListChecked.splice(
        replicateListChecked.findIndex(
          (x) =>
            x.legalDocId == docItemList.legalDocId &&
            x.legalDocName == docItemList.legalDocName
        ),
        1
      );
      setgetUserAgent([]);
      setGetSuccessorData([]);
    }
  };
  const listArrayFunction = (name) => {
    return listArray.filter((dataName) => dataName.legalDocName == name);
  };
  // .................................................................................................................................

 
  // .................................................................................................................................

  const WillPersonal = (e, dataNameDetails) => {
    setTreeInsideTree(!treeInsideTree);
    konsole.log("WillPersonal", dataNameDetails);
  };

  const sideFunctionData = (legalname) => {
    return sideFunction.filter((x) => x.legalDataName == legalname);
  };


  const [editIconShowAndHide, setEditIconShowAndHide] = useState("")

  const listArrayName = (e, listArrayData) => {
    let legalDataName = e.target.getAttribute("data_Name");
    konsole.log("listArrayDatalistArrayData", listArrayData);
    settestDocId(listArrayData.testDocId);
    konsole.log(
      "eeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      e.target.name,
      "legalDataName::",
      legalDataName
    );
    settestDocName(listArrayData?.testDocName);
    setRoleId(listArrayData?.applicableRoleId)
    let getapiresponseDatafilterdata = [];
    let primarydata = [];
    let successordata = [];
    if (getapiresponseData.length > 0) {
      getapiresponseDatafilterdata = getapiresponseData.filter((items) => {
        return (
          items.legalDocId == listArrayData.legalDocId &&
          items.testDocId == listArrayData.testDocId
        );
      });
      primarydata = getapiresponseDatafilterdata
        .filter((v) => {
          return v.agentRankId <= 6;
        })
        .sort((a, b) => {
          return a.agentRankId - b.agentRankId;
        });
      successordata = getapiresponseDatafilterdata
        .filter((v) => {
          return v.agentRankId >= 7;
        })
        .sort((a, b) => {
          return a.agentRankId - b.agentRankId;
        });
    }

    // ...............................................................................................................
   if (agentReplicate == true) {
      setgetUserAgent(newGetUserAgent);
      setGetSuccessorData(newGetSuccessorData);
    } else if (replicateStatus == true) {
      setGetSuccessorData(newGetSuccessorData);
      setgetUserAgent(primarydata);
    } else {
      setgetUserAgent(primarydata);
      setGetSuccessorData(successordata);
      konsole.log("setgetUserAgent(primarydata);", primarydata.length)
      konsole.log("setGetSuccessorData(successordata);", successordata.length)

      if(primarydata.length != 0 && successordata.length != 0){
        setEditIconShowAndHide("BothData")
      }else if(primarydata.length != 0 && successordata.length == 0){
        setEditIconShowAndHide("PrimaryData")
      }else if(primarydata.length == 0 && successordata.length != 0){
        setEditIconShowAndHide("SuccessorData")
      }else{
        setEditIconShowAndHide("noData")
      }
    }
    // ...............................................................................................................
  };

  konsole.log("editIconShowAndHideeditIconShowAndHide",editIconShowAndHide)

  const EditFunctionality = (name) => {
    if(name == "agent"){

      setshowagentmodel(true);
      if (getUserAgent.length > 1) {
        setsolo("co");
      } else {
        setsolo("solo");
      }
    }else if(name == "successors"){
      setshowsuccessormodal(true);
    }
  };

  const OpenPrimaryModal = (value) => {
    if (
      modalIdToOpen == null ||
      modalIdToOpen == undefined ||
      modalIdToOpen == "" ||
      modalIdToOpen == false
    ) {
      AlertToaster.error("Please Select Document");
    } else {
      if (value == "Primary") {
        setsolo("solo");
        setshowagentmodel(true);
      } else {
        setshowsuccessormodal(true);
      }
    }
  };

  konsole.log("modalIdToOpenmodalIdToOpen", modalIdToOpen);
  konsole.log("getSuccessorDatagetSuccessorData", getSuccessorData);
  konsole.log("replicateListCheckedreplicateListChecked", replicateListChecked);
  konsole.log("documentListdocumentList", documentList);
  konsole.log("selectlabelCheckedselectlabelChecked", selectlabelChecked);
  konsole.log("sideTreeFunctionalitysideTreeFunctionality",sideTreeFunctionality);
  konsole.log("primaryFilterDataprimaryFilterData", primaryFilterData);
  konsole.log("sideTreeFunctionalitysideTreeFunctionality",sideTreeFunctionality);
  konsole.log("getapiresponseDatagetapiresponseData", getapiresponseData);
  konsole.log("RoleIDRoleIDRoleID", RoleID);
  konsole.log("listArraylistArray", listArray);
  konsole.log("modalIdToOpenmodalIdToOpen", modalIdToOpen);
  konsole.log("sideFunctionsideFunction", sideFunction);
  konsole.log("sideFunction1sideFunction1", sideFunction1);
  konsole.log("legalDocNameDatalegalDocNameData", legalDocNameData);
  konsole.log("getSuccessorApiDatagetSuccessorApiData", getSuccessorApiData);
  // konsole.log("getSuccessorDatagetSuccessorData", getSuccessorData);
  konsole.log("newGetSuccessorDatanewGetSuccessorData", newGetSuccessorData);
  konsole.log("newGetUserAgentnewGetUserAgent", newGetUserAgent);
  konsole.log("DocumentIdDocumentId", DocumentId);
  konsole.log("getPrimaryAgentDatagetPrimaryAgentData",JSON.stringify(getPrimaryAgentData));
  konsole.log("sideTreeFunctionality1sideTreeFunctionality1",sideTreeFunctionality1);
  konsole.log("sideTreeFunctionality2sideTreeFunctionality2",sideTreeFunctionality2);

  // ................................................ Kartik Saxena................................................

  // ................................................ Kartik Saxena................................................


const AgentRoleIdNotDefine = (roleIdData) =>{
if(roleIdData?.applicableRoleId == 0){

  AlertToaster.info("Agent to be Decided");
}
}


const [upAndDownArrowImg, setUpAndDownArrowImg] = useState("/images/downArrow.png")
const [singleOption1, setsingleOption1] = useState(false)
const [singleOption2, setsingleOption2] = useState(false)

const radioSingleJointStatus = (e) =>{
  konsole.log("radioSingleJointStatus",e.target.value)
  konsole.log("radioSingleJointStatus",e.target.checked)
  let value = e.target.value
  if(value == "option2"){
    setsingleOption2(e.target.checked)
    if(singleOption2 == true){
     setsingleOption2(!singleOption2)
    }else{
      setsingleOption1(false)
    }
  }else if(value == "option1"){
    setsingleOption1(e.target.checked)
    if(singleOption1 == true){
      setsingleOption1(!singleOption1)
    }else{
      setsingleOption2(false)
    }
  }
}


const userFileCabinetAPIFunc = (fileId, fileName) =>{
  let primaryUserId = sessionStorage.getItem('SessPrimaryUserId')
  let loggedUserId = sessionStorage.getItem('loggedUserId')

  let fileObj = {
    "primaryUserId": primaryUserId,
    "fileId": fileId,
    "fileCategoryId": 6,
    "fileStatusId": 1,
    "fileTypeId": 2,
    "fileUploadedBy": loggedUserId,
    "belongsTo": [
      {
        "fileBelongsTo": loggedUserId
      }
    ]
  }
konsole.log("userFileCabinetAPIFunc1", JSON.stringify(fileObj))

  $CommonServiceFn.InvokeCommonApi(
    "POST",
    $Service_Url.postAddFileCabinet,
    fileObj,
    (response) => {
      konsole.log("userFileCabinetAPIFunc", response);
      if (response) {
        AlertToaster.success(`${fileName} Uploaded Successfully`);
      }
    }
  );
}
  return (
    <>
<div 
//  style={{height:"80vh",backgroundColor:"white",overflow: "hidden scroll"}}
style={{
          position: "fixed",
          // top: "90px",
          height: "80vh",
          backgroundColor: "white",
          overflow: " hidden scroll"
}}
 >
    <input 
    className="d-none"  
    id="UploadFilesData"
    type="file"
    onChange={checkFiles}
    />
      <div
        className="container-fluid bg-white m-0 p-0 "
        style={{ width:"100vw"}}
      >
        <div className="d-flex justify-content-start pt-3">
          <p className="ms-4 fs-4 ps-2"> Select Applicable Legal Documents </p>
          <div
            className="ps-2 w-25  h-100 ms-3"
            style={{ border: "1px solid #76272b" }}
          >
            <div className="d-flex justify-content-between" onClick={documentDropDown}>
            <div
            style={{ border: "none" }}
            className="fs-4 "
            >Applicable Legal Docs
            </div>
            <div  style={{cursor: "pointer"}} >
              <img src={upAndDownArrowImg} alt="Error"   />
            </div>
            </div>
            {docuDropdown == true ? (
              documentList.map((item, index) => {
                konsole.log("itemDocumentListapplicableRoleId", item.applicableRoleId);
                return (
                  <>
                    <div className="d-flex">
                      <div>
                        <input
                          type="checkbox"
                          defaultChecked={
                            selectlabelChecked.some(
                              (x) =>
                                x.legalDocId == item.legalDocId &&
                                x.legalDocName == item.legalDocName
                            )
                              ? true
                              : false
                          }
                          disabled={item.applicableRoleId == 0}
                          id={item.legalDocId}
                          onChange={(e) => legalDocId(e, index, item)}
                        />
                      </div>
                      <div>
                        <p className="fs-5 ms-2" onClick={()=>AgentRoleIdNotDefine(item)} value={item.legalDocId}>
                          {item.legalDocName} {item?.ownershipId != 1 && `(${item.ownershipName})`}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="" id="DisplayBlock" 
      style={{backgroundColor:"white",width:"100vw"}}>
       
        <div className="row h-100  AssignselectshowRow pt-4">
        <hr  className=""/>
          {checkedDocName == true ? (
            <div className="col-md-3 mt-4  ">
              {selectlabelChecked.map((docItemList, index) => {
                konsole.log("docItemList.checked", docItemList.checked);
                return (
                  <>
                    <div className=" ms-3 ">
                      <input
                        className="form-check-input "
                        type="checkbox"
                        name="exampleRadios"
                        disabled={docItemList.statusChecked}
                        defaultChecked={docItemList.statusChecked}
                        onChange={(e) =>
                          documentCheckFunction(e, index, docItemList)
                        }
                        value={docItemList.legalDocName}
                        id={docItemList.legalDocId}
                      />
                      <label
                        className="ms-3 fs-5"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => listArrayName(e, docItemList, index)}
                      >
                        {docItemList.legalDocName}{" "}
                      </label>

                      <div className="ms-4 d-flex">
                        {
                          supportDoc[0]?.ownershipName !== null && supportDoc[0]?.ownershipName !== undefined && supportDoc[0]?.ownershipName !== "" &&
                          <>
                        <input
                          className="form-check-input "
                          type="radio"
                          name="exampleRadios"
                          value="option1"
                          onClick={radioSingleJointStatus}
                          checked={singleOption1}
                          defaultValue={singleOption1}
                        />
                        <label className="ms-2 fs-5">
                          {supportDoc[0]?.ownershipName}
                        </label>
                          </>
                        }
                        <span className="ms-1">
                          {docItemList?.checked == true && (
                            <img
                            src="/images/uploadFile.png"
                            alt=""
                            style={{ height: "20px", cursor: "pointer" }}
                              onClick={(event) =>
                                handleClick(event, docItemList, index)
                              }
                            />
                          )}
                        </span>
                        <span>
                          {docItemList?.checked == true &&
                          docItemList?.fileId?.fileId !== null &&
                          docItemList?.fileId?.fileId !== undefined &&
                          docItemList?.fileId?.fileId !== "" ? (
                            <p className="fs-5 text-primary">
                              updated on{" "}
                              {$AHelper.getFormattedDate(
                                docItemList?.fileId?.createdOn
                              )}
                            </p>
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                      {/* ............................................................................... */}
                <div className="d-flex ms-2">
                        <ul className="ulll">
                          {listArrayFunction(docItemList.legalDocName).map(
                            (list, index) => {
                              konsole.log("IndExLength", list);
                              return (
                                <li className="d-flex liii">
                                  <img
                                    className="treeimg"
                                    src="/images/tree.png"
                                  ></img>
                                  <div class="form-check pt-3 ms-3 d-flex">
                                    <input
                                      class="form-check-input "
                                      type="checkbox"
                                      disabled={list.checkedStatus}
                                      checked={
                                        list?.checkedStatus ||
                                        list?.replicateStatus ||
                                        list?.correctChecked
                                      }
                                      value={list.applicableRoleName}
                                      id={list.applicableRoleId}
                                      name={list.testDocName}
                                      data_Name={list.legalDocName}
                                      onChange={(e) =>
                                        onSelectUploadFile(
                                          e,
                                          list,
                                          docItemList,
                                          index
                                        )
                                      }
                                      index={index}
                                    />
                                    <label
                                      class="form-check-label mt-1 ms-1 d-flex"
                                      for="flexCheckDefault"
                                      id={list.applicableRoleId}
                                      name={list.testDocName}
                                      data_Name={list.legalDocName}
                                      onClick={(e) => listArrayName(e, list)}
                                      style={{ cursor: "pointer" }}
                                    >
                                      {list.testDocName}
                                      <span className="mt-0 ms-2 text-danger">
                                      </span>
                                      {list?.checkedStatus == true ||
                                        (list?.correctChecked == true && (
                                          <img
                                            src="/images/uploadFile.png"
                                            alt=""
                                            style={{ height: "20px" }}
                                            onClick={(event) =>
                                              handleClick(event, list, index)
                                            }
                                          />
                                        ))}

                                      {list?.checked == true &&
                                        list?.fileId?.fileId !== null &&
                                        list?.fileId?.fileId !== undefined &&
                                        list?.fileId?.fileId !== "" && (
                                          <p className="text-primary">
                                            updated on
                                            {$AHelper.getFormattedDate(
                                              list?.fileId?.createdOn
                                            )}
                                          </p>
                                        )}
                                    </label>
                                </div>
                                  <input
                                    className="d-none"
                                    type="file"
                                    accept="application/pdf"
                                    id={`fileUploadLifeId${index}`}
                                    onChange={(e) =>
                                      handleFileSelection(e, index)
                                    }
                                  />
                                </li>
                              );
                            }
                          )}
                        </ul>
                        <div className="clickable-labels-info">
                        </div>
                      </div>

                      {/* ............................................................................... */}
                    </div>
                  </>
                );
              })}

{
  supportDoc[1]?.ownershipName !== null && supportDoc[1]?.ownershipName !== undefined && supportDoc[1]?.ownershipName !== "" &&

<div className="ms-3">

<input
  className="form-check-input "
  type="radio"
  name="exampleRadios"
  value="option2"
  onClick={radioSingleJointStatus}
  defaultChecked={singleOption2}
  checked={singleOption2}
/>
<label className="ms-3 fs-5">
  {supportDoc[1]?.ownershipName}
</label>
  </div>
}
              <div className="mt-4">
                {supportDoc.map((docName) => {
                  return (
                    <div className="form-check-inline ms-4 mt-3">
                      <input
                        className="form-check-input "
                        type="checkbox"
                        name="exampleRadios"
                        id={docName.testSupportDocId}
                        value={docName.ownershipName}
                        onChange={ownerShipId}
                      />
                      <label className="ms-3 ">
                        {docName.testSupportDocName}
                      </label>
                    </div>
                  );
                })}
                {ownerChecked ? (
                  <div className="form-check-inline ms-4 mt-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="exampleRadios"
                      value="option1"
                    />

                    <label className="ms-3">{ownershipName}</label>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="col-md-6" style={{borderLeft:"1px solid #CCCCCC",borderRight:"1px solid #CCCCCC"}}>
            <div
              className="row ms-3 border-bottom m-0 pb-2"
              style={{ color: "#751521" }}
            >
              <p className="fs-4">{testDocName}</p>
              <p className="fs-5">{RoleName}</p>
            </div>
            {getapiresponseData.length > 0 && (editIconShowAndHide == "BothData" || editIconShowAndHide == "PrimaryData" ) && (
              <div className="w-100" style={{ position: "relative" }} >
                <button className="AssignEditBtn border-0 mt-3 fs-6 p-2" onClick={()=>EditFunctionality("agent")}>
                  Add/Edit
                </button>
              </div>
            )}
            <div className="row ms-0 border-bottom pb-4 m-0 d-flex">
              <p className="fs-4">Primary Agent</p>
              {getUserAgent.map((agents, index) => {

                konsole.log("getUserAgentDatadata", agents);
                return (
                  <div className="card  w-25 p-0 ms-0 mt-3">
                    <div
                      className="card-header"
                      style={{ backgroundColor: "#751521", color: "white" }}
                    >
                      {agents?.agentRankId == 1 ? "Primary" : `Co-agent ${agents?.agentRankId - 1}`}
                    </div>
                    <div className="card-body">
                      <h5 className="card-title text-center fw-bold">
                        {agents.fullName}-{agents.relationWithMember}
                      </h5>
                      <p className="card-text text-center fs-5 w-100">
                      </p>
                    </div>
                  </div>
                );
              })}
                {
                  (editIconShowAndHide == "noData" || editIconShowAndHide == "SuccessorData") &&
              <div className="card  w-25 p-0 mt-3">
                <div
                  className="card-header"
                  style={{ backgroundColor: "#751521", color: "white" }}
                >
                  {getUserAgent.length <= 0 ? "Primary " : "Co-agent"}
                </div>
                <div className="card-body">
                  <h5
                    className="card-title text-center fw-bold"
                  >
                    <img
                      src="../images/Add.png"
                      alt="Profile"
                      style={{ cursor: "pointer" }}
                      onClick={() => OpenPrimaryModal("Primary")}
                    ></img>
                  </h5>
                  <p className="card-text text-center fs-5 w-100">
                    {getUserAgent.length > 0
                      ? "Add Co-agent"
                      : "Add Primary Agent"}
                  </p>
                </div>
              </div>
                    }
            </div>

            {getapiresponseData.length > 0 && (editIconShowAndHide == "BothData" || editIconShowAndHide == "SuccessorData" ) && (
              <div className="" style={{ position: "relative" }}>
                <button className="AssignEditBtn border-0 mt-3 p-2 fs-6 " onClick={()=>EditFunctionality("successors")}>
                  Add/Edit
                </button>
              </div>
            )}

            <div className="row ms-0 border-bottom pb-2 m-0">
              <p className="fs-4">Successors</p>
              {/* .............................................. */}
              {getSuccessorData.map((items, index) => {
                return (

                  <div className="card ms-0 ms-2 mt-4  w-25 p-0">

                    <div
                      className="card-header"
                      style={{ backgroundColor: "#751521", color: "white" }}
                    >
                      {index + 1} Successor
                    </div>
                    <div className="card-body ms-2">
                      <p className="card-text text-center fs-5 w-100 fw-bold">
                        {items.fullName}-{items.relationWithMember}
                      </p>
                    </div>
                  </div>
                );
              })}
              {/* .............................................. */}
              {
                  (editIconShowAndHide == "noData" || editIconShowAndHide == "PrimaryData") &&
              <div className="card d-flex  ms-2 mt-2 w-25 p-0">
                <div
                  className="card-header"
                  style={{ backgroundColor: "#751521", color: "white" }}
                >
                  Add Successor
                </div>
                <div className="card-body">
                  <h5
                    className="card-title text-center fw-bold"
                    onClick={() => OpenPrimaryModal("Successor")}
                  >
                    <img
                      src="../images/Add.png"
                      alt="Profile"
                      style={{ cursor: "pointer" }}
                    ></img>
                  </h5>
                  <p className="card-text text-center fs-4 w-100">
                    Add Successor
                  </p>
                </div>
              </div>
} 

              {
                selectlabelChecked.some((data)=> data.legalDocId == 1 || data.legalDocId == 2) &&

              <div className="d-flex flex-row-reverse">
                <label className="ms-2 fs-5 ">Replicate these successors</label>
                <input
                  className="form-check-input "
                  type="checkbox"
                  name="exampleRadios"
                  value="Successor"
                  onChange={ReplicateSuccessors}
                  />
              </div>
                }
            </div>
            {/* ............................ */}
            <div className="row   ">
              <div className="d-flex justify-content-between">
              {
                selectlabelChecked.some((data)=> data.legalDocId == 1 || data.legalDocId == 2) &&
                <div className=" ">
                </div>
              }
                <div className="mt-3" onClick={runUpsertedApi}>
                  <a
                    className="btn text-center w-100"
                    style={{
                      backgroundColor: "#751521",
                      color: "white",
                      fontSize: "1.2em",
                      borderRadius: "5px",
                    }}
                  >
                    Save
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-5">
            {selectlabelChecked.map((dataName) => {
              // konsole.log("selectlabelnamedataName",dataName)
              return (
                <>
                  <div
                    className="d-flex ms-2 mt-0"
                    onClick={(e) => treeFunction(e, dataName)}
                    // style={{ border: "1px solid red" }}
                  >
                    {treeData == true &&
                    treeFunc?.legalDocId == dataName?.legalDocId ? (
                      <img src="../images/Group 1567.png" alt="Profile"></img>
                    ) : (
                      <img src="../images/Group 1568.png" alt="Profile"></img>
                    )}
                    <p className="ms-2 fs-5">{dataName.legalDocName}</p>
                  </div>
                  <div onClick={(e) => WillPersonal(e, dataName)}
                >
                    {treeData1 == true &&
                      treeFunc.applicableRoleName ==
                        dataName.applicableRoleName &&
                      treeFunc.legalDocId == dataName.legalDocId && (
                        <div style={{ display: "flex" }}>
                          <span className="ms-4 mt-0">
                            {treeInsideTree == true ? (
                              <img
                                src="../images/Group 1567.png"
                                alt="Profile"
                                className="ms-4 mt-2"
                              ></img>
                            ) : (
                              <img
                                src="../images/Group 1568.png"
                                alt="Profile"
                                className="ms-4 mt-2"
                              ></img>
                            )}
                          </span>
                          <span>
                            <p className="fs-5 ms-1">
                              {dataName?.applicableRoleName}
                            </p>
                            {sideTreeFunctionality2.length > 0 &&
                              treeFunc.legalDocId == dataName.legalDocId &&
                              treeInsideTree == true &&
                              sideTreeFunctionality2.map((dataSide) => {
                                return (
                                  <>
                                    <p className="fs-5 ms-3 mt-0">
                                      {dataSide.fullName}-
                                      {dataSide.relationWithMember} (
                                      {dataSide.agentRank})
                                    </p>
                                  </>
                                );
                              })}
                          </span>
                        </div>
                      )}
                  </div>
                  {sideFunction.length > 0 ? (
                    // <span className="fs-4 ms-5 mt-2 ">
                    <div className="mt-2 ms-3" style={{ marginLeft: "100px" }}>
                      {sideFunctionData(dataName.legalDocName).map(
                        (v, index) => {
                          // konsole.log("sideFunctionsideFunction", sideFunction);
                          return (
                            <>
                              <div
                                className="d-flex mt-0"
                                onClick={(e) => imgClickDataShow(e, index, v)}
                                // style={{ border: "1px solid red" }}
                              >
                                {imgConditionData == true &&
                                details.indexNo == index &&
                                details.legalDataNameData == v.legalDataName &&
                                details.DataName == v.testDocName ? (
                                  <div className="mt-2 ms-2 ">
                                    <img
                                      src="../images/Group 1567.png"
                                      className="ms-2 mb-0"
                                      alt="Profile"
                                    />
                                  </div>
                                ) : (
                                  <div className="ms-2 mt-2 mb-0">
                                    <img
                                      src="../images/Group 1568.png"
                                      className="mb-0 ms-2"
                                      alt="Profile"
                                    />
                                  </div>
                                )}

                                <div>
                                  <p
                                    className="fs-5 mt-2 ms-2"
                                    value={v.testDocName}
                                  >
                                    {v.testDocName}
                                  </p>

                                  {
                                    // details.indexNo == index &&
                                    details.DataName == v.testDocName &&
                                      details.legalDataNameData ==
                                        v.legalDataName &&
                                      treeFunctionData == true &&
                                      sideTreeFunctionality1.map((items) => {
                                        return (
                                          <>
                                            <p className="fs-5 ms-2 mt-2">
                                              {items.fullName}-
                                              {items.relationWithMember} (
                                              {items.agentRank})
                                            </p>
                                          </>
                                        );
                                      })
                                  }
                                </div>
                              </div>
                            </>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </>
              );
            })}
           </div>
        </div>
        <hr />
        <div className="pb-4">
          <img src="../images/AO-Logo-Only2.png" alt="Profile"></img>
        </div>
        <div>
          {showagentmodel ? (
            <Primaryagentmodel
              setPrimaryFilterData={setPrimaryFilterData}
              show={showagentmodel}
              handleShowAgent={handleShowAgent}
              postRoleId={RoleID}
              setRoleId={setRoleId}
              postfileId={fileId}
              setfileId={setfileId}
              postLegalDocId={DocumentId}
              posttestDocId={testDocId}
              selectedSolo={solo}
              postTestSupportDocId={testSupportDocId}
              setJsonOpreator={setJsonOpreator}
              saveUserAgent={saveCoAgent}
              setFilterData={setFilterData}
              saveAgentCard={setgetUserAgent}
              getUserAgent={getUserAgent}
              setNewGetUserAgent={setNewGetUserAgent}
              // newGetUserAgent={newGetUserAgent}
              setGetPrimaryAgentData={setGetPrimaryAgentData}
              setGetFilterDataFromPrimaryAgent={
                setGetFilterDataFromPrimaryAgent
              }
            />
          ) : null}
          {showsuccessormodal ? (
            <Successormodal
              show={showsuccessormodal}
              handleShowSuccessor={handleShowSuccessor}
              postRoleId={RoleID}
              setRoleId={setRoleId}
              postfileId={fileId}
              setfileId={setfileId}
              postLegalDocId={DocumentId}
              posttestDocId={testDocId}
              postTestSupportDocId={testSupportDocId}
              setJsonOpreator={setJsonOpreator}
              getSuccessorData={getSuccessorData}
              setNewGetSuccessorData={setNewGetSuccessorData}
              filterData={filterData}
              setGetSuccessorData={setGetSuccessorData}
              setGetSuccessorApiData={setGetSuccessorApiData}
              getFilterDataFromPrimaryAgent={getFilterDataFromPrimaryAgent}
            />
          ) : null}
        </div>
      </div>
      </div> </>
  );
};
export default Assignselectshow;
