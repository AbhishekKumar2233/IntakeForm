import { Col, Form, Modal, Row, Table } from "react-bootstrap";
import { connect } from "react-redux";
import React, { useEffect, useRef, useState } from "react";

import { $AHelper } from "../control/AHelper";
import { $CommonServiceFn, $postServiceFn } from "../network/Service";
import { $Service_Url } from "../network/UrlPath";
import { createJsonUploadFileV2, fileLargeMsg, logoutUrl } from "../control/Constant";
import { SET_LOADER } from "../Store/Actions/action";
import AlertToaster from "../control/AlertToaster";
import konsole from "../control/Konsole";
import Other from '../asssets/Other'
import { Services } from "../network/Service";
import { createJsonForFolderMapping, sortingFolderForCabinet, cabinetFileCabinetId, createJsonForFolderMapping2, folderOperationType, categoryFileCabinet, showCategeriesOnBulkUpload, cretaeJsonForFolderPermission, operationForCategoryType, cretaeJsonForFilePermission, specificFolderName } from "../control/Constant";
import { isNotValidNullUndefile, isValidateNullUndefine,_$MSG, getSMSNotificationPermissions,postApiCall, postUploadUserDocumant } from "../Reusable/ReusableCom";
import DatepickerComponent from "../DatepickerComponent";
import withFileCabinetParalegalPermissions from "../HOC/withFileCabinetParalegalPermissions";

const BulkUpload = (props) => {

  const legalCategoryLifePlanFolderId = props?.legalCategoryLifePlanFolderId;
  const allFolderList = props?.allFolderList
  // console.log("legalCategoryLifePlanFolderId", props);
  // drag state
  let filetypeRef = useRef(null)
  const stateObj = $AHelper.getObjFromStorage("stateObj");
  const [dragActive, setDragActive] = React.useState(false);
  const [legalDocList, setLegalDocList] = React.useState([]);
  const [savedDocument, setSavedDocument] = React.useState([]);
  const [belongTo, setBelongTo] = React.useState([]);
  const [loginUserId, setLoginUserId] = useState("");
  const [fileTypeList, setFileTypeList] = useState([]);
  const [fileType, setFileType] = useState(-1);
  const [filelifeplan, setFileLifePlan] = useState();
  const [updateState, setUpdateState] = useState(true);
  const [fileCabinetTypeList, setFileCabinetTypeList] = useState([]);
  const [fileCabinetType, setFileCabinetType] = useState(-1);
  const [show, setShow] = useState(false);
  const [Filestatus, setFilestatus] = useState("");
  const [belongsToMember, setbelongsToMember] = useState([]);
  const [showfilecabinetmsg, setshowfilecabinetmsg] = useState(false);
  const [fileCabinetTypeValue, setFileCabinetTypeValue] = useState([])
  const [legalTeamList, setLegalTeamList] = useState([])

  const [fileCabinetTypeObj, setfileCabinetTypeObjValue] = useState('')
  const [subtenantId, setsubtenantId] = useState('')
  const [dateExecution, setDateExecution] = useState('')



  // EMAIL PREVIEW OCCURANCE----------------------------------------------------------------------------------------------------------------------------------------------------------------------

  const [occuranceId, setoccuranceId] = useState(28)
  const [comChannelId, setcomChanelId] = useState(0)
  const [commmediumdata, setcommmediumdata] = useState('');
  const [temptaleshow, settemptaleshow] = useState(false)

  const [texttemp, settexttemp] = useState();
  const [texttempdata, settexttempdata] = useState();
  const [emailtemp, setemailtemp] = useState();
  const [emailtempdata, setemailtempdata] = useState();
  const [showpreviewmodal, setshowpreviewmodal] = useState(false)
  const [cabinetName, setcabinetName] = useState('')
  const [fileTypeInfoforEmail, setfileTypeInfoforEmail] = useState([])
  const [primaryUserId, setPrimaryUserId] = useState("")
  // const [legalCategoryLifePlanFolderId, setLegalCategoryLifePlanFolderId] = useState([])
  // const [allFolderList, setAllFolderList] = useState([])
  const [manageCreate, setManageCreate] = useState({ createdBy: stateObj.userId, createdOn: new Date().toISOString() })


  // konsole State-------------
  konsole.log("legalCategoryLifePlanFolderId",legalCategoryLifePlanFolderId);
  konsole.log("allFolderList",allFolderList);
  // console.log("propsprops",props)
  // konsole State-------------



  // konsole.log('legalCategoryLifePlanFolderIdlegalCategoryLifePlanFolderId', legalCategoryLifePlanFolderId)
  // const assesMentFolderId = legalCategoryLifePlanFolderId?.filter((item) => item.folderName == "Assessment")
  // const roadMapFolderId = legalCategoryLifePlanFolderId?.filter((item) => item.folderName == "Road Map")
  // const lifePlanFolderId = legalCategoryLifePlanFolderId?.filter((item) => item.folderName == "Life Plan")
  // const currentFolderId = legalCategoryLifePlanFolderId?.filter((item) => item.folderName == "Current")
  // konsole.log('currentFolderIdcurrentFolderIdcurrentFolderId', currentFolderId)
  // konsole.log('legalCategoryLifePlanFolderId', legalCategoryLifePlanFolderId)


  useEffect(() => {
    const subtenantId = sessionStorage.getItem("SubtenantId")
    const primaryUserId = sessionStorage.getItem("SessPrimaryUserId")
    setPrimaryUserId(primaryUserId)
    getCommMediumPathfuc(subtenantId);
    // apiCallPermissionsJosn()
  }, [])



  //  MAPPING CATEGORY _______________________________________________________________________________________________________________________________________________
  useEffect(() => {
    // upsertFolderCabinetMapping()
    // apiCallGetUserListByRoleId()
    apiParalegalCallGetUserListByUserId()
    konsole.log('propsprops', props?.client?.memberId)
  }, [])

  
  const [isClientPermissions, setIsClientPermissions] = useState(false);

  console.log("isClientPermissions",isClientPermissions)
  useEffect(() => {
    fetchData(props?.client?.memberId);
    konsole.log('propsprops', props?.client?.memberId)
  }, [props?.client?.memberId])

  const fetchData=async(primaryId)=>{
    if(!isNotValidNullUndefile(primaryId))return;
    await getSMSNotificationPermissions(primaryId, setIsClientPermissions);
  }



  const apiParalegalCallGetUserListByUserId = async () => {
    const result = await apiCallGetUserListByRoleId();
    setLegalTeamList(result)
  }

  const apiCallGetUserListByRoleId = () => {
    const subtenantId = sessionStorage.getItem("SubtenantId");
    const stateObj = $AHelper.getObjFromStorage("stateObj");
    let josnObj = {
      "subtenantId": subtenantId, "isActive": true,
      //  "roleId": stateObj.roleId
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
    konsole.log('callPermissionsApi', newArr, JSON.stringify(callPermissionsApi))
    Services.upsertCabinetFolderPermissions(newArr).then((res) => {
      props.dispatchloader(false)
      konsole.log('res of folder permissions', res)
    }).catch((err) => {
      props.dispatchloader(false)
      konsole.log(' err in folder permissions', err)
    })
  }


  //  MAPPING CATEGORY _______________________________________________________________________________________________________________________________________________
  // EMAIL PREVIEW OCCURANCE----------- FUNCTIONS------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  const getCommMediumPathfuc = (subtenantId) => {
    let dataObj = {
      occurrenceId: occuranceId,
      isActive: true,
      subtenantId: subtenantId,
    }
    props.dispatchloader(true);
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getCommMediumPath, dataObj, async (res, error) => {
      props.dispatchloader(false);
      if (res) {
        let data = res.data?.data[0];
        konsole.log("getCommMediumPath", res.data.data);
        settemptaleshow(true)
        setcommmediumdata(data);
        setcomChanelId(data.commChannelId)
        if (data.commChannelId == 2) {
          getTextTemplateapifuc(data.applicableTextTempId, data.isActive, data.subtenantId);
        } else if (data.commChannelId == 1) {
          GetEmailTemplateapifuc(data.applicableEmailTempId, data.isActive, data.subtenantId);
        } else if (data.commChannelId == 3) {
          GetEmailTemplateapifuc(data.applicableEmailTempId, data.isActive, data.subtenantId);
          getTextTemplateapifuc(data.applicableTextTempId, data.isActive, data.subtenantId);
        }
      }
      else {
        settemptaleshow(false)
        if (error?.data === 'Not Found') {
          settemptaleshow(false)
        }

        props.dispatchloader(false);
      }
    });
  }

  const GetEmailTemplateapifuc = (tempid, isactive, subid) => {
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.GetEmailTemplate + "?" + "TemplateId" + "=" + tempid + "&" + "IsActive" + "=" + isactive + "&SubtenantId" + "=" + subid, '', async (res, err) => {
      props.dispatchloader(false);
      if (res) {
        konsole.log("GetEmailTemplateapi", res.data.data);
        setemailtempdata(res.data.data[0]);
        setemailtemp(res.data.data[0].templateContent);
      }
      else {
        konsole.log("GetEmailTemplateapi", err)
        props.dispatchloader(false);
      }
    });
  };


  const getTextTemplateapifuc = (tempid, isactive, subid) => {
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getTextTemplate + "?" + "TextTemplateId" + "=" + tempid + "&" + "IsActive" + "=" + isactive + "&SubtenantId" + "=" + subid, '', async (res, err) => {
      props.dispatchloader(false);
      if (res) {
        konsole.log("GettextTemplateapiresponse", res);
        settexttempdata(res.data.data[0]);
        settexttemp(res.data.data[0].textTemplateContent);
      }
      else {
        props.dispatchloader(false);
      }
    });
  };


  const sendTextEmail = () => {
    let userDetailOfPrimary = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'))
    comChannelId == 3 || comChannelId == 1 ? SendEmailCommPathFunc(userDetailOfPrimary) : comChannelId == 2 ? postSendTextPathapifunc(userDetailOfPrimary) : null;

  }

  const postSendTextPathapifunc = (userDetailOfPrimary) => {
    if(isClientPermissions != true){
      AlertToaster.success("Sent Successfully");
      cancelModalClose();
      return;
    }

    let loggedUserId = sessionStorage.getItem('loggedUserId')
    // let testTo = props.client?.primaryPhoneNumber
    let textTo = props?.client?.primaryPhoneNumber || userDetailOfPrimary?.userMob
    let tempolateInfo = templatereplace(texttemp)
    konsole.log("testToUSDJSDJ", userDetailOfPrimary?.userMob)
    let dataObj = {
      smsType: texttempdata.textTemplateType,
      textTo: textTo,
      textContent: tempolateInfo,
      smsTemplateId: texttempdata.textTemplateId,
      smsStatusId: 1,
      smsMappingTable: "tblUsers",
      smsMappingTablePKId: primaryUserId,
      createdBy: loggedUserId,
    };

    konsole.log('postSendTextPathJson', JSON.stringify(dataObj))
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postSendTextPath, dataObj, async (response, error) => {
      props.dispatchloader(false);
      if (response) {
        konsole.log("postSendTextPath", response);
        AlertToaster.success("Sent Successfully");

        cancelModalClose()
      }
      else {
        props.dispatchloader(false);
        konsole.log("errorText", error)
        cancelModalClose()
      }
    });
  }



  const SendEmailCommPathFunc = (userDetailOfPrimary) => {
    let templateinfo = templatereplace(emailtemp)
    let userLoggedInDetail = JSON.parse(sessionStorage.getItem('userLoggedInDetail'))
    let loggedUserId = sessionStorage.getItem('loggedUserId')

    let emailTo = props?.client?.primaryEmailAddress || userDetailOfPrimary?.primaryEmailId
    konsole.log('emailToemailTo', emailTo)
    let dataObj = {
      "emailType": emailtempdata.templateType,
      "emailTo": emailTo,
      "emailSubject": emailtempdata.emailSubject,
      "emailContent": templateinfo,
      "emailTemplateId": emailtempdata.templateId,
      "emailStatusId": 1,
      "emailMappingTable": "tblUsers",
      "emailMappingTablePKId": primaryUserId,
      "createdBy": loggedUserId,
      "emailcc": userLoggedInDetail?.primaryEmailId
    }
    konsole.log('dataObjdataObj', dataObj)
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('POST', $Service_Url.sendPostEmailCC, dataObj, (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('sendPostEmailCC', res, comChannelId)
        comChannelId == 1 ? cancelModalClose() : comChannelId == 3 ? postSendTextPathapifunc(userDetailOfPrimary) : AlertToaster.success("Sent Successfully");
      }
      else {
        konsole.log('sendPostEmailCC', err)
        cancelModalClose()
      }
    })
  }

  konsole.log('fileCabinetTypeListfileCabinetTypeList', fileCabinetTypeList, fileCabinetTypeList.find(item => item.value == filelifeplan))

  const templatereplace = (temp) => {
    let cabinetName = fileCabinetTypeList.find(item => item.value == (filelifeplan || fileCabinetTypeValue[0]?.value))
    const documentsName = fileTypeList.filter(obj => fileTypeInfoforEmail?.includes(obj?.value))?.map(obj => obj?.label);
    konsole.log('documentsNamedocumentsName', documentsName, fileTypeInfoforEmail)

    let TemplateContent = temp
    let memberUserName = props?.client?.memberName
    let userLoggedInDetail = JSON.parse(sessionStorage.getItem('userLoggedInDetail'))
    let subtenantName = sessionStorage.getItem('subtenantName')
    let universallink = `${logoutUrl}account/Signin?subtenantId=${subtenantId}`
    konsole.log('userLoggedInDetail', userLoggedInDetail)
    TemplateContent = TemplateContent.replace("@@USERNAME", memberUserName)
    TemplateContent = TemplateContent.replace("@@LEGALPERSONNAME", userLoggedInDetail?.memberName)
    TemplateContent = TemplateContent.replace("@@LEGALPERSONNAME", userLoggedInDetail?.memberName)
    // TemplateContent = TemplateContent.replace("@@DOCUMENTS", documentsName.join(','))
    TemplateContent = TemplateContent.replace("@@CABINETNAME", cabinetName?.label)
    TemplateContent = TemplateContent.replace("@@SUBTENANTNAME", subtenantName)
    TemplateContent = TemplateContent.replace("@@PARALEGALEMAIL", userLoggedInDetail?.primaryEmailId)
    TemplateContent = TemplateContent.replace("@@UNIVERSALLINK", universallink)
    TemplateContent = TemplateContent.replace("@@UNIVERSALLINK", universallink)
    konsole.log('TemplateContentTemplateContent', TemplateContent)
    return TemplateContent;
  }

  const cancelModalClose = () => {
    if (props.uploadFromFileCabinet !== true) {
      // window.location.reload()
      props.callapidata()
      props.handleUpload()
    } else {
      setshowpreviewmodal(false)
      props.handleDragNDrop()
      props?.filecabinetdocumentfunc(props.folderType)
    }
  }

  // EMAIL PREVIEW OCCURANCE----------- FUNCTIONS------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



  konsole.log("fileCabinetTypeObjfileCabinetTypeObj", fileCabinetTypeObj, props.fromAccordian, fileCabinetTypeList, fileCabinetTypeValue)

  // ref
  const inputRef = React.useRef(null);

  useEffect(() => {
    // getLegalDocumentList();
    // fetchBelongTOInfo();
  }, []);

  const fetchBelongTOInfo = () => {
    const getMemberInfo = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
    const getMemberId = sessionStorage.getItem("SessPrimaryUserId");
    const getSpouseId = sessionStorage.getItem("spouseUserId");
    let belongObj = [];
    if (getMemberInfo.memberName !== null) {
      belongObj.push({ userId: getMemberId, memberName: getMemberInfo.memberName, });
    }
    if (getMemberInfo.spouseName !== null) {
      belongObj.push({ userId: getSpouseId, memberName: getMemberInfo.spouseName, });
      belongObj.push({ userId: 3, memberName: "Joint" });
    }
    setBelongTo(belongObj);
  };
  // const getLegalDocumentList = () => {
  //     $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getLegalDocumentAssignRoles,
  //         "", (response) => {
  //             konsole.log("legalDoc", response);
  //             setLegalDocList(response.data.data)
  //         })
  // };

  useEffect(() => {
    let loginUserId = sessionStorage.getItem("loggedUserId");
    let subtenantId = sessionStorage.getItem("SubtenantId");
    konsole.log("setsubtenantIdsetsubtenantId", subtenantId)
    setLoginUserId(loginUserId);
    setsubtenantId(subtenantId)
    fetchFileCabinetType(subtenantId);
    FileBelongsTo();
  }, []);
  konsole.log("textfilter", props.text, fileCabinetTypeList)

  const filToSetFileCabinetType = (array) => {
    konsole.log("arrayaa", array, props.text.value)
    let filFileCabinetType = array?.filter(item => item.value == props.text.value)
    setFileCabinetTypeValue(filFileCabinetType)
    setFileCabinetType(filFileCabinetType[0]?.value)
    // konsole.log("filFileCabinetType",array,filFileCabinetType)
  }

  const fetchFileCabinetType = async (subtenantId) => {
    konsole.log("1");
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFileCabinetType, "", (response) => {
      if (response) {
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFileStatus, "", (response) => {
          if (response) {
            konsole.log("responseresresponseres", response);
            let fileuploadstatus = response?.data?.data?.filter((v) => v.value !== "3");
            if (props.fromAccordian == "fromAccordian") {
              let filterToAddFileFromCabinet = response?.data?.data?.filter((v) => v.value == props.folderType);
              setFilestatus(filterToAddFileFromCabinet);
            }
            else {
              setFilestatus(fileuploadstatus);
            }
          }
        }
        );
        const fileCabinetTypeObj = [];
        let responseData = response?.data?.data?.filter(item => showCategeriesOnBulkUpload.includes(Number(item.value)));

        if (subtenantId == 2 || subtenantId == 742) {
          // konsole.log("fileCabinetTypeObjfileCabinetTypeObj",subtenantId,fileCabinetTypeObj)
          fileCabinetTypeObj = responseData
        }
        else {
          fileCabinetTypeObj = responseData.filter(item => item.value !== '8')
        }
        konsole.log("fileCabinetTypeObjfileCabinetTypeObj12121", subtenantId, fileCabinetTypeObj[0].value)

        fileCabinetTypeObj = fileCabinetTypeObj?.filter(ele => ele.value == '6')
        setFileCabinetTypeList(fileCabinetTypeObj);
        if (props.fromAccordian == "fromAccordian") {
          filToSetFileCabinetType(fileCabinetTypeObj)
          fetchFileType(props.text.value)
        } else {
          setfileCabinetTypeObjValue(fileCabinetTypeObj[0].value)
          let value = { target: { value: categoryFileCabinet[0], name: 'fileCabinetType' } }
          handleValueChange(value)
          // fetchFileType(fileCabinetTypeObj[0].value);
        }
      }
    }
    );
  };
  const FileBelongsTo = () => {
    konsole.log("bulkMemberId", props.client?.memberId);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFileBelongsToPath + `?ClientUserId=${props.client?.memberId}`, "", (response, err) => {
      if (response) {
        konsole.log("responseres", response);
        setbelongsToMember(response.data.data);
      } else err;
      konsole.log("erororor", err);
    }
    );
  };

  const fetchFileType = (fileCabinetTypeObjValue) => {
    konsole.log("fileCabinetTypeObjValue", fileCabinetTypeObjValue, fileType);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFileType + fileCabinetTypeObjValue, "", (response) => {
      if (response) {
        konsole.log("1", response)
        let responseData = response.data.data
        konsole.log("1", responseData)
        let sortData = $AHelper.relationshipListsortingByString(responseData)
        setFileTypeList(sortData)
        konsole.log("sortData", sortData)
      }
    }
    );
  };
  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  konsole.log("savedDocument111", savedDocument)
  // (fileCabinetTypeObj !== undefined && fileCabinetTypeObj == 8) ? 7 :

  //  this function for detect Upload document name  and auti set----------------------------------
  // const returnDocumentTypeBasedOnSelectedFileName = (fileName) => {
  //   konsole.log('fileTypeList', fileName, fileTypeList)
  //   const selectedfileName = fileName?.toLowerCase()
  //   const filetypeIdFilter = fileTypeList?.find(({ label }) => label.toLowerCase() == selectedfileName.toLowerCase())?.value;
  //   konsole.log('filetypeIdFilter', filetypeIdFilter)
  //   const fileTypeId = (filetypeIdFilter !== undefined && filetypeIdFilter !== null && filetypeIdFilter !== '') ? filetypeIdFilter : null;
  //   konsole.log('fileTypeId', fileTypeId)
  //   return {fileTypeId};
  // }





  const returnParentFolderId = (fileTypeId) => {
    konsole.log('fileTypeIdfileTypeId', fileTypeId);
    const lifePlanFolderId = allFolderList.find(({ folderName }) => folderName === 'Life Plan')?.folderId;
    const feeagreementOtherFormId = allFolderList.find(({ folderName }) => folderName === 'Fee Agreement & Other Forms')?.folderId;
    const estatePlanningDocumentsId = allFolderList.find(({ folderName }) => folderName === 'Estate planning documents')?.folderId;
    konsole.log('filterLifePlanFolderId', estatePlanningDocumentsId, feeagreementOtherFormId, lifePlanFolderId);
    const lifePlanFolder = [8, 7];
    const feeAgreeMentOtherForms = [59]
    let folderId = '';
    let subFolderList = []
    let subFolderForCurrentId = ""
    switch (true) {
      case lifePlanFolder.includes(Number(fileTypeId)):
        folderId = lifePlanFolderId;
        break;
      case feeAgreeMentOtherForms.includes(Number(fileTypeId)):
        folderId = feeagreementOtherFormId
        break;
      default:
        folderId = estatePlanningDocumentsId
    }
    konsole.log('folderIdfolderIdfolderId', folderId);
    if (folderId) {
      subFolderList = allFolderList?.filter(({ parentFolderId, folderName }) => parentFolderId == folderId && folderName != 'Archived')
      subFolderForCurrentId = subFolderList?.length > 0 ? subFolderList?.find(({ parentFolderId, folderName }) => folderName.toLowerCase() == 'current')?.folderId : ""
      konsole.log("subFolderList1212", subFolderList, subFolderForCurrentId)
    }
    return { folderId, subFolderList, subFolderForCurrentId };
  };

  const returnBelongsTo = (memberbelongs) => {
    const belongsToWithAnd = /(and|&)/i.test(memberbelongs)
    const memberbelongsWithoutSpace = belongsToWithAnd ? memberbelongs.split(/\s+(?:and|&|)\s+/i)[0] : memberbelongs;

    let belongsToMemberId = '';
    belongsToMemberId = belongsToMember.find(({ belongsToMemberName }) => {
      const firstNameInArray = (name) => (name ? name.split(' ')[0] : '');

      const formattedName = isValidateNullUndefine(belongsToMemberName)
        ? firstNameInArray(belongsToMemberName).replace(/\s/g, '')
        : firstNameInArray(belongsToMemberName);

      const targetFirstName = firstNameInArray(memberbelongsWithoutSpace);

      return formattedName?.toLowerCase() === targetFirstName?.toLowerCase();
    })?.fileBelongsTo;
    konsole.log('belongsToMemberId:', belongsToMemberId);

    belongsToMemberId = (isValidateNullUndefine(belongsToMemberId) && memberbelongs.toLowerCase().includes('joint')) ? 'JOINT' : belongsToMemberId
    konsole.log('belongsToMemberIdbelongsToMemberId', belongsToMemberId)
    return belongsToMemberId == undefined ? null : (belongsToWithAnd == true ? "JOINT" : belongsToMemberId)
  }
  const returnFileNameNFileTypeNBelongsTo = (file) => {

    let fileName = file?.name?.slice(0, file?.name?.length - 4);
    const fullNameOfFile = file?.name?.slice(0, file?.name?.length - 4);

    const checkBothForAndParanthesis = /(for.*\(|\(.*for.*)/i.test(fileName) // To check (For and ()) both in document format
    const checkHyfenFormatDoc = checkBothForAndParanthesis == true ? false : /-|for/i.test(fileName);  // To check ( - || for || For) after document name
    const check2Fors = fileName.match(/\bfor\b/gi);  // check no. of "For" on Doc and client name like (Durable Power of Attorney for Finances for client name)
    const hasForAndHyphen = /for/i.test(fileName) && /-/i.test(fileName); // Check that document and client name have both "For" and "-"
    const have2For = fileName.match(/^(.*?for.*?)for(.*?)$/i) // return array after splitting if the Document name have 2 "for"
    const haveForOrHyfen = fileName.match(/(.+?)\s*(?:-\s*|for\s*)(.+)/i)  // return array after splitting if the Document name have any one "For" or "-"
    const haveBothForAndHyfen = fileName.match(/^(.*?for.*?)\s*-\s*(.*?)$/i)  // return array after splitting if the Document name have both "For" and "-"
    const fileNMember = fullNameOfFile.match(/(\w+)\s*\(([^)]+)\)/); // Check paranthesis in document format
    const beforeParenthesis = fileName.split('(')[0].trim();  // Split document and client name before and after paranthesis
    const fileSecondPara = fileName.match(/\(([^)]+)\)/)
    const insideParentheses = fileSecondPara?.length > 1 ? fileSecondPara[1] : '';
    const hyfenFormatDoc = check2Fors?.length == 2 ? have2For : hasForAndHyphen ? haveBothForAndHyfen : checkHyfenFormatDoc ? haveForOrHyfen : fileSecondPara || null;
    const beforeHyfen = hyfenFormatDoc ? hyfenFormatDoc[1]?.trim() : null;
    const afterHyfen = hyfenFormatDoc ? hyfenFormatDoc[2]?.trim() : null;

    const belongsToType = null;
    const documentType = checkHyfenFormatDoc == true ? hyfenFormatDoc : fileNMember
    if (documentType) {
      fileName = checkHyfenFormatDoc == true ? beforeHyfen : beforeParenthesis
      const docBelongsTo = checkHyfenFormatDoc == true ? afterHyfen : insideParentheses
      belongsToType = returnBelongsTo(docBelongsTo)

    }
    const selectedfileName = fileName?.toLowerCase()
    const filetypeIdFilter = fileTypeList?.find((item) => {
      const aliases = item?.labelAlias?.split(',') || [];
      const labelMatch = item?.label && item.label.toLowerCase() === selectedfileName.toLowerCase();
      const aliasMatch = aliases.some(alias => alias.trim().toLowerCase() === selectedfileName.toLowerCase());

      return labelMatch || aliasMatch;
    })?.value;


    konsole.log('filetypeIdFilter', filetypeIdFilter, selectedfileName, fileTypeList)
    const fileTypeId = (filetypeIdFilter !== undefined && filetypeIdFilter !== null && filetypeIdFilter !== '') ? filetypeIdFilter : null;
    konsole.log('fileTypeId', fileTypeId)
    return { fileTypeId, fileName, belongsToType };

  }
  //  this function for detect Upload document name  and autoset----------------------------------

  const documentObj = (file) => {
    konsole.log("filefilefilefilefilefile", file)


    const { fileTypeId, fileName, belongsToType } = returnFileNameNFileTypeNBelongsTo(file)
    const { folderId, subFolderList, subFolderForCurrentId } = returnParentFolderId(fileTypeId)
    konsole.log('fileTypeIdfileTypeId', folderId, fileTypeId, fileName, belongsToType)

    let sizeerror = file.size < 105906176 ? false : true
    konsole.log('sizeerror', sizeerror)
    return {
      document: file,
      fileCabinetType: fileCabinetType,
      fileType: fileTypeId,
      error: "",
      fileStatusId: 2,
      sizeerror: sizeerror,
      fileFolderId: subFolderForCurrentId,
      parentFolderIdForSelection: folderId ?? '',
      subFolderList: subFolderList ?? [],
      fileBelongsTo: belongsToType,
      dateExecution: ''
    };
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    let filesPath = [];
    filesPath.push(...savedDocument);
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      konsole.log("drag Files", e.dataTransfer.files);
      for (const file of e.dataTransfer.files) {
        let typeOfFile = file.type;
        if (typeOfFile !== "application/pdf") {
          AlertToaster.error("Only Pdf format is allowed.");
          setUpdateState(!updateState);
          return;
        }
        konsole.log("files", documentObj);
        filesPath.push(documentObj(file));
      }
      konsole.log("filesPathfilesPath1212", filesPath)
      setSavedDocument(filesPath);
    }
  };

  // triggers when file is selected with click
  konsole.log("savedDocumenta", savedDocument)
  const handleChange = function (e) {
    let filesPath = [];
    filesPath.push(...savedDocument);
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      for (const file of e.target.files) {
        let typeOfFile = file.type;
        if (typeOfFile !== "application/pdf") {
          AlertToaster.error("Only Pdf format is allowed.");
          setUpdateState(!updateState);
          return;
        }
        konsole.log('filesPathfilesPath', file.name, filesPath)
        konsole.log("files", documentObj);
        filesPath.push(documentObj(file));
      }
      konsole.log("drag Files", documentObj);
      setSavedDocument(filesPath);
    }
    inputRef.current.value=''
  };

  konsole.log('savedDocumentsavedDocumeaaaant', savedDocument)

  const handleValueChange = (event) => {
    const eventName = event.target.name;
    setcabinetName(eventName)
    konsole.log("eventName", eventName, event.target.value);
    setFileLifePlan(event.target.value);
    setFileCabinetTypeValue(event.target.value)
    switch (eventName) {
      case "fileType":
        setFileType(event.target.value);
        break;
      case "fileCabinetType":
        konsole.log("eventValuee", event.target.value)
        setFileCabinetType(event.target.value);
        setFileType(-1);
        setSavedDocument([]);
        fetchFileType(event.target.value);
        setfileCabinetTypeObjValue(event.target.value)
        // setFileCabinetTypeValue(event.target.value)
        break;
    }
  };


  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleImageSubmit = async(event) => {
    //  this loop for check validation for all array of object-----------------------------------------------

    for (let s of savedDocument) {
      konsole.log("ssssss", s);
      let eventId = event.target.id;
      if (s.sizeerror == true) {
        s.error = "Request entry to large.";
        setUpdateState(!updateState);
        return;
      }
      if (s.fileBelongsTo == null || s.fileBelongsTo == -1) {
        s.errorBelongs = "Choose File Belongs To";
        setUpdateState(!updateState);
        return;
      }

      if (s.fileCabinetType == categoryFileCabinet[0]) {
        if (s?.parentFolderIdForSelection == "" || s?.parentFolderIdForSelection == null || s?.parentFolderIdForSelection == -1) {
          s.errorParentFolderIdForSelection = "Choose file Folder";
          setUpdateState(!updateState);
          return;
        }
        if (s.fileType == null || s.fileType == -1) {
          s.errorFileType = "Choose Document Type";
          setUpdateState(!updateState);
          return;
        }
        if (s?.fileFolderId == "" || s?.fileFolderId == null || s?.fileFolderId == -1) {
          s.errorfolderId = "Choose doc status";
          setUpdateState(!updateState);
          return;
        }
      }
      if (s.fileType == null || s.fileType == -1) {
        s.errorFileType = "Choose Document Type";
        setUpdateState(!updateState);
        return;
      }
      if (s.fileStatusId == null || s.fileStatusId == -1) {
        s.error = "Choose doc Status";
        setUpdateState(!updateState);
        return;
      }
      konsole.log('handleImageSubmithandleImageSubmit', savedDocument)
    }

    //  this loop for check validation for all array of object-----------------------------------------------
    for (const  [index, s] of savedDocument.entries()) {
      const isTrue=index==savedDocument.length-1;
      setfileTypeInfoforEmail(prevArray => [...prevArray, s.fileType]);
      konsole.log('sloopiterate', s)
      const { fileType, fileCabinetType, fileStatusId, document, name, dateExecution } = s
      //  @Upload File V2 API JSON
      const jsonObj = createJsonUploadFileV2({ UserId: props.client.memberId, File: s.document, UploadedBy: loginUserId, FileTypeId: fileType, FileCategoryId: fileCabinetType, FileStatusId: fileStatusId, UserFileName: document?.name || name, DateFinalized: dateExecution });

      props.dispatchloader(true);
      const resultPostUpload=await postUploadUserDocumant(jsonObj);
      konsole.log('resultPOstUploadresultPOstUpload',resultPostUpload)
      if(resultPostUpload=='err'){
        props.dispatchloader(false);
        props.handleDragNDrop();
      }else{
        const fileId=resultPostUpload.fileId
        if(fileType=='999999'){
          filetypeRef.current.saveHandleOther(fileId);
        }
        const resultaddFile=await postAddFileUpload(fileId,s,isTrue);
      }
    }
  };


  konsole.log('setfileTypeInfoforEmail', fileTypeInfoforEmail)
  const postAddFileUpload = async (fileId, savedDocument,isTrue) => {

    let fileBelongsTo = [];
    if (savedDocument.fileBelongsTo == "JOINT") {
      const fileBelongToUser = belongsToMember.filter((data) => { return (data.fileBelongsTo !== "JOINT") })
      fileBelongsTo = fileBelongToUser.map(data => { return { fileBelongsTo: data.fileBelongsTo}})
    }
    else {
      fileBelongsTo = [{ fileBelongsTo: savedDocument.fileBelongsTo }]
    }

    konsole.log("josnjosnsavedDocument", JSON.stringify(savedDocument), fileBelongsTo, belongsToMember);
    let formdata = {
      primaryUserId: props?.client?.memberId,
      fileId: fileId,
      fileCategoryId: savedDocument?.fileCabinetType,
      fileStatusId: (props.folderType == "3" && props.fromAccordian == "fromAccordian") ? "2" : props.folderType || savedDocument?.fileStatusId,
      fileTypeId: savedDocument?.fileType,
      fileUploadedBy: loginUserId,
      belongsTo: fileBelongsTo
    };

    konsole.log('josnjosnsavedDocumentjosnjosnsavedDocument', formdata.fileCategoryId, categoryFileCabinet[0])
    if (formdata.fileCategoryId == categoryFileCabinet[0]) {
      formdata['isShared'] = true
      formdata['isActive'] = true
      formdata['isMandatory'] = true
      formdata['isFolder'] = true
      formdata['isCategory'] = false
      konsole.log('josnjosnsavedDocumentjosnjosnsavedDocumentaa', formdata)
      formdata['cabinetId'] = cabinetFileCabinetId[0]
      formdata['folderId'] = savedDocument?.fileFolderId;

    }


    konsole.log("formdata", formdata);
    konsole.log("formdata",JSON.stringify(formdata));
    props.dispatchloader(true);
    const resultAddFile = await postApiCall('POST', $Service_Url.postAddFileCabinet2, formdata);
    konsole.log('resultAddFile', resultAddFile);
    (resultAddFile == 'err') ? props.dispatchloader(false) : '';
    await callFilePermissionsApi(formdata.belongsTo, fileId);
    if(isTrue==true){
      // AlertToaster.success("File Uploaded Successfully");
      props.dispatchloader(false);
      setshowfilecabinetmsg(true);
    }else{
      props.dispatchloader(true);
    }
  }


  const callFilePermissionsApi = async (belongsToArr, fileId) => {
    props.dispatchloader(true)
    // let result = await apiCallGetUserListByRoleId()
    let result = legalTeamList
    if (result !== 'err') {
      let primaryMemberUserId = props?.client?.memberId
      let permissionArr = []
      for (let j = 0; j < result?.length; j++) {
        const newObj = cretaeJsonForFilePermission({ fileId: fileId, belongsTo: belongsToArr[0].fileBelongsTo, primaryUserId: primaryMemberUserId, sharedUserId: result[j].userId, isActive: true, isDelete: false, isEdit: false, isRead: true, ...manageCreate })
        permissionArr.push(newObj)
      }
      props.dispatchloader(true)
      konsole.log('permissionArrpermissionArr', permissionArr)
      return new Promise((resolve,reject)=>{
        Services.upsertShareFileStatus(permissionArr).then((res) => {
          konsole.log('res of upser file share', res)
          // props.dispatchloader(false);
          resolve('resolve');
        }).catch((err) => {
          // props.dispatchloader(false)
          resolve('err');
          konsole.log('err in upsert sharefile', err)
        })
      })

    }


  }

  useEffect(() => {
    if (showfilecabinetmsg !== false) {
      AlertToaster.success("File Uploaded Successfully");
      setshowpreviewmodal(true)
      if (props.uploadFromFileCabinet !== true) {
        //   setshowpreviewmodal(true)
        //   props.callapidata()
      }
      // else{
      //   props.handleDragNDrop()
      // }
    }
  }, [showfilecabinetmsg]);

  const deleteSelectedData = (index) => {
    const filterData = savedDocument.filter((data, ind) => {
      return ind !== index;
    });
    setSavedDocument(filterData);
  };

  const handlefileTypeSelection = (e, index) => {
    savedDocument[index].fileType = e.target.value;
    konsole.log("etargetvalue", e.target.value)
    savedDocument[index].errorFileType = "";
    setUpdateState(!updateState);
  };

  const handlefileStatusSelection = (e, index) => {
    konsole.log("aaaaaaaaaaaaaaaaaaaaaa", e.target.value)
    savedDocument[index].fileStatusId = e.target.value;
    savedDocument[index].error = "";
    setUpdateState(!updateState);
  };

  const handleBelongsToSelection = (e, index) => {
    konsole.log("fileBelongsToevent", index, e.target.value, "", index);
    if (index == 0) {
      for (let [index, item] of savedDocument.entries()) {
        savedDocument[index].fileBelongsTo = e.target.value;
        savedDocument[index].errorBelongs = "";
        setUpdateState(!updateState);
      }
    } else {
      savedDocument[index].fileBelongsTo = e.target.value;
      savedDocument[index].errorBelongs = "";
      setUpdateState(!updateState);
    }
    // savedDocument[index].fileBelongsTo = e.target.value;
    // savedDocument[index].error = "";
    // setUpdateState(!updateState);
  };
  const handleDateExecution = (e, index) => {
    konsole.log(e, "eeeeeeeeeeeeeee")
    savedDocument[index].dateExecution = e
    if (index == 0) {
      savedDocument.map((el, indexx) => {
        savedDocument[indexx].dateExecution = e
      })
    }
    setUpdateState(!updateState);

  }
  const handleFolderSelection = (e, index) => {
    savedDocument[index].fileFolderId = e.target.value;
    konsole.log("etargetvalue", e.target.value)
    savedDocument[index].errorfolderId = "";
    let fileStatus = 2

    const findFolderName = allFolderList?.find(({ folderId }) => folderId == e.target.value)
    if (findFolderName?.length > 0) {
      fileStatus = findFolderName[0].folderName == 'Draft' ? 1 : 2
    }
    konsole.log(findFolderName?.folderName == 'Draft', findFolderName, "findFolderName")
    savedDocument[index].fileStatusId = fileStatus
    // if (index == 0) {
    savedDocument.map((el, indexx) => {
      if (index == 0) {
        savedDocument[indexx].fileFolderId = savedDocument[0].fileFolderId
        if (findFolderName?.folderName == 'Draft') {
          savedDocument[indexx].dateExecution = ''
        }
      }
      if (index < indexx && findFolderName?.folderName == 'Draft') {
        savedDocument[indexx].fileFolderId = findFolderName?.folderId
        savedDocument[indexx].dateExecution = ''
      }
    })
    // }
    if (findFolderName?.folderName == 'Draft') {
      savedDocument[index].dateExecution = ''
    }
    savedDocument[index].error = "";
    setUpdateState(!updateState);
  }
  const handleParentFolderSelection = (e, index) => {
    let selectParentFolderId = e.target.value
    savedDocument[index].parentFolderIdForSelection = selectParentFolderId;
    savedDocument[index].fileFolderId = '';
    // savedDocument[index].fileStatusId = '';
    savedDocument[index].errorParentFolderIdForSelection = "";
    const subFolderList = allFolderList.filter(({ parentFolderId, folderName }) => parentFolderId == selectParentFolderId && folderName != 'Archived')
    konsole.log('subFolderListsubFolderListsubFolderList', subFolderList)
    savedDocument[index].subFolderList = subFolderList
    setUpdateState(!updateState);

  }
  konsole.log("document saved", Filestatus, savedDocument);

  const FilestatusIdfilter = () => {
    let arr = Filestatus
    if (filelifeplan == 8 && Filestatus?.length > 0) {
      arr = Filestatus.filter((v) => v.value !== "1");
    }
    return arr;
  };


  const filterdataforidsix = () => {
    let datafilter;
    if (filelifeplan && filelifeplan !== '6') {
      datafilter = (FilestatusIdfilter()?.length > 0) && FilestatusIdfilter()?.filter((v) => v.value !== "4");
    } else {
      datafilter = FilestatusIdfilter()
    }
    return datafilter;

  }
  konsole.log("FilestatusIdfilter", filelifeplan, FilestatusIdfilter(), filterdataforidsix());


  konsole.log("FilestatusFilestatus", Filestatus)

  const functionchecselect = (index, document, item) => {
    // if (savedDocument[index].fileBelongsTo == item.fileBelongsTo) {
    //   return true
    // }
    if (isValidateNullUndefine(document.fileBelongsTo)) return;
    konsole.log('functionchecselect', document.fileBelongsTo, item.fileBelongsTo)
    if (document.fileBelongsTo.toLowerCase() == item.fileBelongsTo.toLowerCase()) {
      return true
    }
  }


  const renderOptions = (options, level = 0) => {
    const margin = `${level * 20}px`;
    let spaces = Array(level).fill("\u00A0").join("");

    return options?.sort((a, b) => a.folderName.localeCompare(b.folderName))?.sort((a, b) => {
      const labels = sortingFolderForCabinet
      const aIndex = labels.indexOf(a.folderName);
      const bIndex = labels.indexOf(b.folderName);
      return bIndex - aIndex;
    })?.map((option, index) => (
      <>
        <option style={{ marginLeft: margin }} value={option.folderId}>
          {spaces} {option.folderName}
        </option>
        {option?.folder && option?.folder?.length > 0 && (
          renderOptions(option?.folder, level + 5)
        )}
      </>
    ));
  };



  konsole.log("fileCabinetTypeValuefileCabinetTypeValue", props.fromAccordian, fileCabinetTypeValue)
  konsole.log("savedDocumentsavedDocument", fileTypeList, fileCabinetTypeList)
  konsole.log('propspropsaa', props)
  konsole.log('fileCabinetTypeValue[0].value', fileCabinetTypeValue[0]?.value)
  konsole.log('fileCabinetTypefileTypeListlength ', fileCabinetType, fileTypeList?.length, fileTypeList)
  konsole.log('fileCabinetTypeListfileCabinetTypeListfileCabinetTypeList', JSON.stringify(fileCabinetTypeList))

  return (
    <>
      <style jsx global>{`
       .modal-open .modal-backdrop.show {
          opacity: 0;
        }
        `}</style>
      <Modal show={props.showDragNDrop} size="lg" onHide={props.handleDragNDrop} backdrop="static" animation="false">
        <Modal.Header className="text-white" closeVariant="white" closeButton>
          Bulk Upload
        </Modal.Header>
        <Modal.Body className="">
          <div className="d-flex justify-content-center align-items-center flex-column pb-5 pt-4">
            <Row className="d-flex align-items-center w-100">
              <Col xs={12}>
                <p className="me-2 fw-bold">Please Choose the File Cabinet: </p>
                <Form.Select name="fileCabinetType" onChange={handleValueChange} value={(fileCabinetTypeValue?.length !== 0 && props.fromAccordian == "fromAccordian") ? fileCabinetTypeValue[0].value : fileCabinetType}>
                  <option value="-1" selected disabled hidden>
                    Choose File Cabinet Type
                  </option>
                  {fileCabinetTypeList?.length > 0 &&
                    fileCabinetTypeList.map((val, index) => {
                      return (<option key={index} value={val.value} id={val.label}> {val.label}</option>);
                    })}
                </Form.Select>
              </Col>
            </Row>
            {fileCabinetType !== -1 && fileTypeList?.length > 0 && (
              <div className="drag my-4">
                <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                  <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
                  <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : ""}>
                    <div>
                      <p>Drag and drop your file here or</p>
                      <button className="upload-button" onClick={onButtonClick}> Upload a file</button>
                    </div>
                  </label>
                  {dragActive && (
                    <div
                      id="drag-file-element"
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    ></div>
                  )}
                </form>
              </div>
            )}
            <div className="bg-light  w-100">
              <div>
                {savedDocument?.length > 0 && (
                  <Table>
                    <thead>
                      <tr>
                        <td className="text-center w-20 fw-bold"> Document Name </td>
                        <td className="text-center w-20 fw-bold" style={{width:'140px'}}> Date of Sign Off </td>
                        <td className="text-center w-20 fw-bold">Belongs To</td>
                        {fileCabinetType == categoryFileCabinet[0] && <td className="text-center w-20 fw-bold"> Folder </td>}
                        <td className="text-center w-20 fw-bold"> Legal Document Type </td>
                        <td className="text-center w-20 fw-bold"> Doc Status </td>

                      </tr>
                    </thead>
                    <tbody>
                      {savedDocument?.length > 0 &&
                        savedDocument.map((document, index) => {
                          let documentPdfName = document.document?.name.slice(0, document.document?.name?.length - 4)
                          const { fileTypeId, fileName, belongsToType } = returnFileNameNFileTypeNBelongsTo(document.document)
                          documentPdfName = fileName;
                          konsole.log("documentdocumentname", document)
                          return (
                            <tr key={index}>
                              <td className="text-center"> {document.document?.name} <br /><span className="text-danger"> {document?.sizeerror == true ? fileLargeMsg : ""}</span></td>

                              <td><DatepickerComponent value={document.dateExecution} setValue={(e) => { handleDateExecution(e, index) }} placeholderText="Date of Sign Off" maxDate="0" minDate="100" /></td>
                              <td> <select onChange={(e) => handleBelongsToSelection(e, index)}>
                                <option value={-1} disabled selected hidden>  Belongs To </option>
                                {belongsToMember?.length > 0 &&
                                  belongsToMember.map((doc, indexx) => {
                                    return (
                                      <option key={indexx} value={doc.fileBelongsTo}
                                        //  selected={savedDocument?.length > 0 && (doc.fileBelongsTo == savedDocument[index].fileBelongsTo) && functionchecselect(index, doc)}
                                        selected={functionchecselect(index, document, doc)}
                                      >
                                        {/* {doc.memberType}({doc.belongsToMemberName}) */}
                                        {`${doc.memberType.toLowerCase() == "joint" ? doc.memberType : ""}`}{doc.belongsToMemberName}
                                      </option>
                                    );
                                  })}
                              </select>
                                <p className="text-danger"> {document?.errorBelongs !== "" ? document?.errorBelongs : ""}</p>
                              </td>
                              {fileCabinetType == categoryFileCabinet[0] &&
                                <td>
                                  <select onChange={(e) => handleParentFolderSelection(e, index)}>
                                    <option value='-1'>Select Folder</option>
                                    {legalCategoryLifePlanFolderId?.length > 0 && legalCategoryLifePlanFolderId.map((item, index) => (
                                      <optgroup label={item.folderName} key={index}>
                                        {!item.folder ? (
                                          <option value={item.folderId}>{item.folderName}</option>
                                        ) : (
                                          item.folder.map((submenuItem, subIndex) => (
                                            <option value={submenuItem.folderId} key={subIndex} selected={document.parentFolderIdForSelection == submenuItem.folderId}>
                                              {submenuItem.folderName}
                                            </option>
                                          ))
                                        )}
                                      </optgroup>
                                    ))}
                                  </select>
                                  {/* {legalCategoryLifePlanFolderId.length > 0 &&
                                  <select onChange={(e) => handleFolderSelection(e, index)}>
                                    <option value='-1'>Select Folder</option>
                                    {renderOptions(legalCategoryLifePlanFolderId)}
                                  </select>
                                  } */}
                                  <p className="text-danger"> {document?.errorParentFolderIdForSelection !== "" ? document?.errorParentFolderIdForSelection : ""}</p>

                                </td>}
                              <td> <select onChange={(e) => handlefileTypeSelection(e, index)} >
                                <option value={-1} selected disabled hidden> Document Type</option>
                                {fileTypeList?.length > 0 &&
                                  fileTypeList.map((doc, index) => {
                                    const labelAliases = (doc.labelAlias || '').split(',').map(alias => alias.trim().toLowerCase());
                                    const isSelected = (fileCabinetTypeObj !== undefined && ((doc.label && doc.label.toLowerCase() === documentPdfName.toLowerCase()) || labelAliases.includes(documentPdfName.toLowerCase())));
                                    return (
                                      <option key={index} value={doc.value}
                                        //  selected={(fileCabinetTypeObj !== undefined && fileCabinetTypeObj == 8) && doc.label == documentPdfName}
                                        selected={isSelected}

                                      >
                                        {doc.label}
                                      </option>

                                    );
                                  })}

                              </select>
                                {(savedDocument[index].fileType == '999999') ?
                                  <Other othersCategoryId={31} userId={props?.client?.memberId} dropValue={savedDocument[index].fileType} ref={filetypeRef} />
                                  : null}
                                <p className="text-danger">
                                  {document?.errorFileType !== "" ? document?.errorFileType : ""}
                                </p>
                              </td>
                              <td>
                                {/* <select value={document.fileStatusId} onChange={(e) => handlefileStatusSelection(e, index)}>
                                  {savedDocument?.length > 0 &&
                                    filterdataforidsix() !== undefined && filterdataforidsix()?.map((doc, index) => {
                                      return (
                                        <option key={index} value={doc.value} >
                                          {doc.label}
                                        </option>
                                      );
                                    })}
                                </select> */}
                                <select onChange={(e) => handleFolderSelection(e, index)}>
                                  <option value='-1'>Select Doc Status</option>
                                  {document?.subFolderList?.length > 0 &&
                                    document?.subFolderList.map((item, i) => {
                                      return (
                                        <option key={index} value={item.folderId} selected={item.folderId == document.fileFolderId}>
                                          {item.folderName}
                                        </option>
                                      );
                                    })
                                  }
                                </select>
                                <p className="text-danger"> {document?.errorfolderId !== "" ? document?.errorfolderId : ""}</p>

                              </td>

                              <td className="bg-dark">
                                <img src="/icons/BinIcon.svg" className="cursor-pointer" alt="bin" onClick={() => deleteSelectedData(index)} />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                )}
              </div>
            </div>
            <div className="mt-2">
              {savedDocument?.length > 0 && (
                <button type="submit" onClick={handleImageSubmit} className="theme-btn">
                  Upload
                </button>
              )}
            </div>
          </div>

          <>
            {/*_______________________________----------------------------- EMAIL PREVIW MODAL _______________________________----------------------------- */}
            {/*_______________________________----------------------------- EMAIL PREVIW MODAL _______________________________----------------------------- */}
            {/*_______________________________----------------------------- EMAIL PREVIW MODAL _______________________________----------------------------- */}
            <Modal
              show={showpreviewmodal}
              //  show={true}
              size="lg"
              onHide={() => cancelModalClose()}
              backdrop="static"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px" }}
            >
              <Modal.Header className="text-white" closeVariant="white" closeButton>
                Preview Send {(comChannelId == 1) ? 'Email' : (comChannelId == 2) ? 'Text' : 'Email & Text'}
              </Modal.Header>
              <Modal.Body className="rounded">

                <div style={{ minHeight: "60vh", maxHeight: "60vh", height: "100vh", overflowX: "none", overflowY: "scroll" }} className="border">
                  <div className="position-relative" style={{ pointerEvents: "none" }} >
                    {(isNotValidNullUndefile(emailtemp)) ?
                        <>
                          <h6 className="ps-4 ms-5 mt-3">Email Template</h6>
                          <div dangerouslySetInnerHTML={{ __html: templatereplace(emailtemp) }} id="emailtemplate" contentEditable="false" className="p-0 m-0" />
                        </>
                        : <></>
                    }
                    <div className="px-5 mb-2">
                      {(isNotValidNullUndefile(texttemp)) ?
                          <>
                            <h6 className="mt-3">Text Template</h6>
                            {(isClientPermissions==true)?
                            <div contentEditable="false" id="templateData1" className="border p-2" style={{ padding: "10px 0 30px 0" }}>
                              {templatereplace(texttemp)}
                            </div>:<> <span className='ms-5 mt-2'>{_$MSG._clientTextPermission}</span></>}
                          </>
                          : <></>
                      }
                    </div>
                  </div>
                </div>
                <div className="d-grid place-items-center p-4 gap-2">
                  <button style={{ background: "#720c20", color: "white", outline: "none", borderRadius: "5px", border: "2px solid #720C20" }} className="p-1" onClick={() => sendTextEmail()}>
                    Send  {(comChannelId == 1) ? 'Email' : (comChannelId == 2) ? 'Text' : 'Email & Text'}
                  </button>
                  <button style={{ color: "#720c20", background: "white", border: "2px solid #720C20", borderRadius: "5px" }} className="p-1" onClick={() => cancelModalClose()}> Cancel</button>
                </div>
              </Modal.Body>
            </Modal>

          </>
        </Modal.Body>
      </Modal>
    </>

  );
};


// const mapDispatchToProps = (dispatch) => ({
//   dispatchloader: (loader) =>
//     dispatch({ type: SET_LOADER, payload: loader,}),
// });

// export default connect("", mapDispatchToProps)(BulkUpload);
export default withFileCabinetParalegalPermissions(BulkUpload, 'bulkupload');
