import { Col, Form } from "react-bootstrap"
import { $CommonServiceFn } from "../network/Service"
import konsole from "../control/Konsole"
import { Services } from "../network/Service";
import { $Service_Url } from "../network/UrlPath";
import { addYears, addMonths, addWeeks, isAfter, parseISO } from 'date-fns';

{/*   ----***--------***----  ----***--------***---- */ }

export const deceaseSpouseRelationId = 51
export const livingMemberStatusId = 1
export const deceaseMemberStatusId = 2
export const specialNeedMemberStatusId = 3

export const _fileRemarksOccurrenceId = 35; // Remarks (occurrences)
export const _amaDocOccurrenceId = 28;

export const _handOff_Msg = {
  _confirmationMsgForHandOff: "Are you sure that you would like to handoff the account to the client? Once the handoff is completed, client's health, housing and finance cannot be accessed by the legal staff.",
  _intakeMember_InActive: "An inactive and intake user can't be handed off.",
  _intakeMember_Active: "An intake user can't be handed off.",
  _lpoMember_InActive: "An inactive user can't be handed off.",
  _isHandOff: "Action not allowed, Please contact the Administrator.",
  _isHandOffRoleChange: "Permission Denied, Role for Hand Off Account cannot be changed.",
  _handOff_save: "Hand off Completed successfully.",
  _deleteConfirmation: "Are you sure that you would like to delete this client account",
}

export const _$MSG = {
  _clientTextPermission: 'The client does not allow sending text SMS permissions.'
}




{/*   ----***--------***---- Input Box Component ----***--------***---- */ }

export const InputCom = ({ xs = 12, sm = 12, md = 4, lg = 4, label, id, placeholder, name, type, value = '', onChange, disable, onBlur }) => {
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} className="mb-2">
      {/* <Form.Label className="mb-1">{label}</Form.Label> */}
      <Form.Control type={type} id={id} placeholder={placeholder} name={name} value={value} onBlur={onBlur} onChange={onChange} className='custom-input' disabled={disable} />
    </Col>
  )
}

{/*   ----***--------***---- Select Component ----***--------***---- */ }

export const SelectCom = ({ sm = 4, lg = 4, xs = 12, md = 4, label, id, isLabel, disabled = false, placeholder, options, value = '', onChange }) => {
  return (
    <Col sm={sm} lg={lg} xs={xs} md={md} className="mb-2">
      {(isLabel) && isLabel}
      <Form.Select aria-label="Default select example" disabled={disabled} id={id} value={value} onChange={onChange} className='custom-input'>
        <option value="" disabled selected hidden>{placeholder}</option>
        {options?.map((item, index) => (<option key={index} value={item.value}>  {item.label} </option>))}
      </Form.Select>
    </Col>
  )
}


{/*   ----***--------***---- get api call with async ----***--------***---- */ }

export const getApiCall = (method, url, setState) => {
  return new Promise((resolve, reject) => {
    $CommonServiceFn.InvokeCommonApi(method, url, '', (res, err) => {
      if (res) {
        konsole.log('res of fetching', url, res, 'data');
        if (setState) {
          setState(res?.data?.data);
        }
        resolve(res?.data?.data);
      } else {
        konsole.log('res in fetching', url, err);
        if (setState) {
          setState([]);
        }
        resolve('err');
      }
    });
  });
}
export const getApiCall2 = (method, url) => {
  return new Promise((resolve, reject) => {
    $CommonServiceFn.InvokeCommonApi(method, url, '', (res, err) => {
      if (res) {
        konsole.log('res of fetching', url, res, 'data');
        resolve(res);
      } else {
        konsole.log('res in fetching', url, err);
        resolve('err');
      }
    });
  });
}

{/*   ----***--------***---- post api call with async ----***--------***---- */ }

export const postApiCall = (method, url, jsonObj) => {
  return new Promise((resolve, reject) => {
    $CommonServiceFn.InvokeCommonApi(method, url, jsonObj, (res, err) => {
      if (res) {
        konsole.log('res of saving', url, res);
        resolve(res)
      } else {
        konsole.log('res in saving', url, err);
        resolve('err')
      }
    })
  })
}
export const postApiCallNew = (method, url, jsonObj) => {
  return new Promise((resolve, reject) => {
    $CommonServiceFn.InvokeCommonApi(method, url, jsonObj, (res, err) => {
      if (res) {
        konsole.log('res of saving', url, res);
        let response ={
          isError : "false",
          resPonse:res
        }
        resolve(response)
      } else {
        konsole.log('res in saving', url, err);
        let response ={
          isError : "true",
          resPonse:err
        }
        resolve(response)
      }
    })
  })
}


export const postApiCall2 = (method, url, jsonObj) => {
  return new Promise((resolve, reject) => {
    $CommonServiceFn.InvokeCommonApi(method, url, jsonObj, (res, err) => {
      if (res) {
        konsole.log('res of saving', url, res);
        const obj = {
          "result": "200",
          "response": res
        }
        resolve(obj);
      } else {
        konsole.log('res in saving', url, err);
        const obj = {
          "result": "400",
          "response": err
        }
        resolve(obj)
      }
    })
  })
}


export const postUploadUserDocumant = (jsonObj) => {
  return new Promise((resolve, reject) => {
    Services.postUploadUserDocumantV2({ ...jsonObj }).then((response) => {
      konsole.log('responseresponse', response)
      resolve(response.data.data);
    }).catch((err) => {
      konsole.log('err', err)
      resolve('err')
    })
  });
}



{/*   ----***--------***---- get SMS Notification api call with async ----***--------***---- */ }
export const getSMSNotificationPermissions = (primaryMemberUserId, setState) => {
  console.log("primaryMemberUserId", primaryMemberUserId);
  const questionId = 230
  const URL = $Service_Url.getSubjectResponse + primaryMemberUserId + `/0/0/${questionId}`;
  return new Promise((resolve, reject) => {
    $CommonServiceFn.InvokeCommonApi('GET', URL, '', (res, err) => {
      if (res) {
        console.log('Response of fetching', URL, res, 'data');
        const userSubjectsData = res.data?.data?.userSubjects;
        console.log("responseData", userSubjectsData)
        if (userSubjectsData?.length > 0 && userSubjectsData[0].response == 'true') {
          setState(true);
          resolve(true);
        } else {
          setState(false);
          resolve(false);
        }
      } else {
        console.log('Error in fetching', URL, err);
        setState(false)
        resolve(false); // Reject with error object
      }
    });
  });
}


{/*   ----***--------***---- null || undefined ||'' ----***--------***---- */ }

export const isValidateNullUndefine = (value) => {
  if (value == 0 || value == undefined || value == null || value == '') {
    return true;
  }
  return false
}


{/*   ----***--------***---- null & undefine && ""----***--------***---- */ }

export const isNotValidNullUndefile = (value) => {
  if (value !== undefined && value !== null && value !== '') {
    return true;
  }
  return false
}

export const isNullUndefine = (value) => {
  if (value == undefined || value == null || value == '') {
    return true;
  }
  return false
}


//Remove Duplicate value

export const removeDuplicate = (myArr, id) => {
  return myArr?.filter((obj, index, array) => array.findIndex(item => item[id] === obj[id]) === index);
}

// ***************LEGAL __INFO_Burial /Cremation Msg--------------------------------


//  in file cabinet folder struce based on parent id
export const createNestedArray = (folders) => {
  konsole.log('folders', folders)
  const nestedArray = [];

  function buildNestedArray(parentId, level) {
    const folder = folders?.filter(folder => folder?.parentFolderId === parentId);
    if (folder?.length === 0) { return []; }

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




export function fileNameShowInClickHere(fileObj, selectfileName) {
  if (isNotValidNullUndefile(fileObj)) {
    return fileObj.name && fileObj.name.length > 22 ? fileObj.name.slice(0, 22) + "..." : fileObj.name;
  } else {
    return selectfileName && selectfileName.length > 25 ? selectfileName.slice(0, 25) + "..." : selectfileName;
  }
}

export function isUrlValid(userInput) {
  const testurl = userInput?.toLowerCase();
  if (!testurl) return false;

  if (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(testurl)) {
    return true;
  } else {
    return false;
  }
}

export const getOtherFieldsName = async ({ userId, othersMapNatureId, isActive, othersMapNature, othersCategoryId }) => {

  return new Promise(async (resolve, reject) => {
    const jsonObj = [{ userId, othersMapNatureId, isActive, othersMapNature }]
    const _resultOfOtherInfo = await postApiCall('POST', $Service_Url.getOtherFromAPI, jsonObj);
    let otherFile = 'Other'
    if (_resultOfOtherInfo != 'err') {
      const responseData = _resultOfOtherInfo?.data?.data;
      let otherObj = responseData?.filter(otherRes => { return otherRes?.othersCategoryId == othersCategoryId });
      let otherFileName = otherObj?.length > 0 ? otherObj[0].othersName : "";
      otherFile = otherFileName;
      if (isNullUndefine(otherFile)) {
        otherFile = 'Other'
      }
    }
    resolve(otherFile)
    return otherFile;
  })
}

export const getOtherFieldsDetails = async ({ userId, othersMapNatureId, isActive, othersMapNature, othersCategoryId }) => {

  return new Promise(async (resolve, reject) => {
    const jsonObj = [{ userId, othersMapNatureId, isActive, othersMapNature }]
    const _resultOfOtherInfo = await postApiCall('POST', $Service_Url.getOtherFromAPI, jsonObj);
    console.log("_resultOfOtherInfo",_resultOfOtherInfo)
    let otherFile = 'Other'
    if (_resultOfOtherInfo != 'err') {
      const responseData = _resultOfOtherInfo?.data?.data;
      let otherObj = responseData?.filter(otherRes => { return otherRes?.othersCategoryId == othersCategoryId });
      let otherFileName = otherObj?.length > 0 ? otherObj[0] : "";
      otherFile = otherFileName;
      // if (isNullUndefine(otherFile)) {
      //   otherFile = 'Other'
      // }
    }
    resolve(otherFile)
    return otherFile;
  })
}

export const focusInputBox = async (id, isModal) => {
  konsole.log("focusing_on #" + id);
  if (document) {
    if(isModal) {
      document.getElementById(id)?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    const ele = await waitForElm('#' + id);
    setTimeout(() => {
      ele?.scrollIntoView({ block: "center", behavior: "smooth" });
      // ele?.focus(); // Currently disabled auto focus
    }, [500])
  }
}

export const waitForElm = (selector) => {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// ============================ AMA/Fee Recurring ============================================
export const recurringErrorHandled = async ( jsonBody, callNo = 1 ) => {
  // return "err"
  let resp = await postApiCallNew('POST', $Service_Url.post_CreateUserRecurringSubscription, jsonBody);
  konsole.log("recurringErrorHandled - call no.: " + callNo + " and response", resp);
  if(resp?.isError == "true" && resp?.resPonse?.status == 404 && callNo < 5) {
    resp = await recurringErrorHandled(jsonBody, callNo + 1);
  }
  return callNo == 1 ? (resp?.isError == "true" ? "err" : resp?.resPonse) : (resp);
}

export const removeSpaceAtStart = (value) => {
  if (typeof value != "string") return value;
  return value?.replace(/^\s+/g, '');
}

// ============================ Next Installment Date ============================================
export const getNextInstallmentDate = (validityFrom, frequency, totalInstallments) => {
  if (!validityFrom || !frequency || !totalInstallments) return null;

  const startDate = parseISO(validityFrom);
  const today = new Date();
  let nextDate = startDate;

  for (let i = 0; i < totalInstallments; i++) {
    if (frequency === 'Yearly') nextDate = addYears(startDate, i);
    else if (frequency === 'Monthly') nextDate = addMonths(startDate, i);
    else if (frequency === 'Weekly') nextDate = addWeeks(startDate, i);
    else return null;

    if (isAfter(nextDate, today)) return nextDate;
  }

  return null;
};