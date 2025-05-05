export const demo = true;


export const showContractPdf = false;


export const ABaseUrl = (demo) ? "https://aointakeuatapi.azurewebsites.net" : "https://aointakeapi.azurewebsites.net";

export const Contactlicence = (demo) ? "lic_2bc32cb8-1eaf-487f-81ad-fe920" : "lic_1cfd9d1c-7c35-4951-af0e-f912c";

export const logoutUrl = (demo) ? "https://aologinuat.agingoptions.com/" : "https://Unilogin.agingoptions.com/";

export const lpoLiteUrl = (demo) ? "https://lpoliteuat.agingoptions.com/" : "https://member.LPO.agingoptions.com/";

export const intakeBaseUrl = (demo) ? 'https://aointakeformuat.agingoptions.com/' : 'https://member.intake.agingoptions.com/';

export const AoPaymentUrl = (demo) ? 'https://aopaymentdev.agingoptions.com/' : "https://aopayment.azurewebsites.net/";
export const AoAgenturl = (demo) ? 'https://aoagentuat.agingoptions.com/' : 'https://agent.agingoptions.com/';

export const aorgLink = (demo) ? "https://aorg.nsplindia.co.in/" : "https://resourceguide.agingoptions.com/";
// export const aorgLink = (demo) ? "https://aoorguat.agingoptions.com/" : "https://resourceguide.agingoptions.com/";

export const aorgLinkWithoutSlash = (demo) ? "https://aoorguat.agingoptions.com" : "https://resourceguide.agingoptions.com";
export const lpoiceLink = (demo) ? "https://lpoiceuat.agingoptions.com/" : "https://lpoice.agingoptions.com/";


// export const AoAcaddemyUrl = (demo) ? "https://academy.nsplindia.co.in" : "https://agingoptionsacademy.com/"
export const AoAcaddemyUrl = (demo) ? "https://staging2.agingoptionsacademy.com/" : "https://agingoptionsacademy.com/"
export const AOAcademyIframUrl = (demo) ? "https://academyportal.nsplindia.co.in/" : "https://academyportal.nsplindia.co.in/";
export const AOAcademyIframUrlNew = (demo) ? "https://academyportal.nsplindia.co.in/wp-json/custom/v1/signin" : "https://academyportal.nsplindia.co.in/wp-json/custom/v1/signin";
export const EventBaseUrl =    (demo)?"https://eventuat.agingoptions.com/":"https://events.agingoptions.com/";
export const CounterBaseUrl =  (demo)?"https://aoeventcounteruat.agingoptions.com/": "https://Event.counter.agingoptions.com/";
export const CounterMobileBaseUrl = (demo)?"https://aoeventcountermobileuat.agingoptions.com/": "https://event.mcounter.agingoptions.com/";
export const AoAdminBaseUrl = (demo)?'https://Aoadminuat.agingoptions.com/': 'https://AOAdmin.agingoptions.com/';;
export const AoPartnerBaseUrl =     (demo)?"https://aopartneruat.agingoptions.com/": "https://partner.admin.agingoptions.com/";;
export const IntakeEntryBaseUrl =    (demo)?"https://intakeentryformuat.azurewebsites.net/": "https://intakeentryform.azurewebsites.net/";;
export const PortalSignOnUrl =  intakeBaseUrl;

export const rajivAttorneyUserId = "9e6ea069-3eff-429a-8ffd-6a082f1c72b3";


export const InvalidDateMsg = "Please Enter Valid Date";
export const fileLargeMsg = "File is too large, file size should be 100MB";

export const confirmationMsg = "Are you sure you want to LOGOUT?"
export const constantEmail = "@aoe.com";
export const constantText = "1234567890";


export const accessToParalegal = ["3", "13", "14", "15"];
export const accessToFileCabinet = ["3", "13", "14", "15", "9"];
export const accessToIntake = ["1", "10"];


export const regexForSpecialCharacter = /[!#$%^&*()+/\\?><,'":;=+]$/;
export const onlyAlpbet = /[0-9!#$%^&*()+/\\?><,'":;=+-]$/

export const health = { formLabelId: [102, 103, 104, 105, 106, 107, 108, 949, 109, 110, 111, 112, 113, 194, 195, 196, 1035, 1036,1038,1042] };

export const personalMedicalHistry = { formLabelId: [214, 215, 216, 217, 948, 1030, 1031, 1032] }
export const familyMedicalHistry =  { formLabelId: [1041] }

export const Housing = [318, 327];
export const deceasedOrIncapcitatedId = [2, 3]

export const retirementHousigOp = {
  formLabelId: [318, 320, 321, 322, 323, 324, 325, 326],
};


export const housingChar = [318, 320, 321, 322, 323, 324, 325, 326, 327, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343]

export const caregiver = [342, 343, 344]

export const realtorMoreInfo = [1010]

export const mortgageBrokerMoreInfo = [1011]

export const handymanMoreInfo = [1012]

export const legalCounselMoreInfo = [1015]

export const elderLawAttorneyMoreInfo = [1016]

export const taxBusinessSuccessionMoreInfo = [1017]

export const financialAdvisor = {
  formLabelId: [913, 565, 566, 567, 568, 569, 570, 571]
}

export const financialAdvisorMoreInfo = [994, 576, 577, 578, 579, 580, 581, 582, 1001];
export const deceasedIncapacititedQuestion = [1007, 1008]
export const referdByQuestion = [1009]
export const bloodTypeQuestion = [1014]
export const preferredContactMethod = [1037]
export const refereByOther = [1013]

export const accountant = {
  formLabelId: [672, 911, 912, 673]
}

export const monthlyIncome = {
  formLabelId: [914, 916, 918, 917, 919, 950, 1028, 1034,1245,1246]
}

export const accountantMoreinfo = [993, 683, 684, 685, 686];

// export const accountantMoreinfo = {
//   formLabelId: [{
//     id: 993
//   },{
//     id: 683
//   },
//   {
//     id: 684
//   },
//   {
//     id: 685
//   },
//   {
//     id: 686
//   },

//   ],
// };
export const Book = {
  formLabelId: [774, 909, 910, 775]
}


export const futureExpectation = {
  formLabelId: [887, 888, 920, 921, 922, 924]

};

export const legal = {
  formLabelId: [445, 446, 447, 448, 449, 450, 451],
};

export const livingWill = {
  formLabelId: [452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464],
};



export const personal = {
  formLabelId: [{
    id: 889
  },
  {
    id: 890
  },
  {
    id: 891
  },
  {
    id: 892
  },
  {
    id: 893
  },

  ],
};


export const burial = {
  formLabelId: [464],
};

export const CemeteryQ = {
  formLabelId: [463],
};

export const commonLivingWill = {
  // formLabelId: [ 464, 463, 461, 462, 952 ],
  formLabelId: [461, 462, 952],
};

export const hRemains = {
  formLabelId: [461, 462],
};

export const aGifts = {
  formLabelId: [459, 460],
};

export const otpMedium = {
  otpSendMedium: [{
    sms: 1
  }]
};

export const natureId = {
  addressNatureId: "ADDRESS_NATURE_ID",
  contactNatureId: "CONTACT_NATURE_ID",
  healthNatureId: "HEALTH_NATURE_ID",
  specialityNatureId: "SPECIALITY_NATURE_ID",
  nonRetirementNatureId: "NON_RETIREMENT_NATURE",
  retirementNatureId: "RETIREMENT_NATURE_ID",
  bussinessNatureId: "BUSSINESS_NATURE_ID",
  realEstateNatureId: "REALESTATE_NATURE_ID",
  lifeInsNatureId: "LIFEINSURANCE_NATURE_ID",
  longTermNatureId: "LONGTERM_NATURE_ID",
  liabilitiesNatureId: "LIABILITIES_NATURE_ID",
  veteranNatureId: "VETERAN_NATURE_ID",
  legalDocNatureId: "LEGALDOCUMENT_NATURE_ID",
}


export const imagePath = [
  "icons/personalInfoHeader.svg",
  "icons/legalHeader.svg",
  "icons/FamilyInfoHeader.svg",
  "icons/healthInfoHeader.svg",
  "icons/housingInfoHeader.svg",
  "icons/financialInfoHeader.svg",
]



export let configdata = {
  "USERACTIVATION": "USER_ACTIVATION",
  "FORGOTPASSWORD": "FORGOT_PASSWORD",
  "VERIFYCONTACT": "VERIFY_CONTACT",
  "OTPMEDIUMSMS": 1,
  "OTPMEDIUMWHATSAPP": 2,
  "OTPMEDIUMEMAIL": 3,
  "OTPMEDIUMBOTH": 4
}




export const illness = {
  formLabelId: [894, 895, 896, 897, 898, 925, 927, 995,]
}
export const mentalhealth = {
  formLabelId: [998, 999, 1000, 1002, 1003]
}

export const endOfLife = {
  formLabelId: [899, 900, 901, 902, 903, 904, 926, 928, 996,]
}

export const death = {
  formLabelId: [905, 906, 907, 908, 927, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 939, 940, 941, 942, 943, 944, 945, 946, 947, 997]
}
export const EnquiryRegistration = 1;

// new file cainet 
// export const operationType = ["Permission", "New Category", "Mapping For Subtenant", "Mapping New Category For Subtenant"]
export const operationForCabinet = ['Create New Cabinet', 'Mapping Cabinet']
export const operationForCategoryType = ['Create New Category', "Map All Folders In Category"]
export const folderOperationType = ['Create New Folder', 'Map All Folders', 'Map Specific Folders']
export const emergencyDocumentArr = [{ label: 'Yes', value: true }, { label: 'No', value: false }]
// export const cabinetFileCabinetId =(demo) ? [46]:[1]
export const cabinetFileCabinetId = [1]
export const categoryFileCabinet = [6]
// export const categoryFileCabinet =  (demo) ? [176] :[6]
// export const showCategeriesOnBulkUpload =(demo) ? [8, 5, 4, 3, 2, 176] :[8, 6, 5, 4, 3, 2]
export const showCategeriesOnBulkUpload = [8, 6, 5, 4, 3, 2]

export const lpoIntakeRoleId = [9, 10, 1]
// export const sortingFolderForCabinet=["Draft", "Archived", "Current","Fee Agreement & Other Forms"];
export const sortingFolderForCabinet = ["Life Point Law", "Life Plan", "Archived", "Draft", "Current"];
export const notEditableFolderForCabinet = ["Archived", "Draft", "Current", "Life Plan", "Estate planning documents"];
export const paralegalAttoryId = ["3", "13", "14", "15"];
export const specificFolderName = ['Life Plan', 'Estate planning documents', 'Current', 'Archived', 'Fee Agreement & Other Forms']
export const messageClientpermissions = "You don`t have the permission please contact the client for the permissions."
export const messageParalegalpermissions = 'You don`t have the permission please contact your Legal Team for the changes.'
export const messageAdminPermissions = "You don`t have the permission please contact your Administrator."
export const messageForPalaregalDrawerAccess = 'You do not have permission please contact the Client.'
// const containsValue = sortingFolderForCabinet.some((folder) => folder === valueToCheck);
// export const belongsToArr = [{ value: "098EB6EC-53AD-4C8F-90C8-0028E660CB61", label: "Lane  Lee" }, { value: "D21EDB93-5F84-45D3-B98E-8E7A5E12DC70", label: "Spouse  Leeaaaa", }]
// export const paralegalLoginId = '18793be4-2813-490d-b741-0035982ce0c9'



export const createCabinetObjJson = ({ cabinetId, cabinetName, cabinetDescription, cabinetOperation, isActive, createdBy, updatedBy, updatedOn, createdOn }) => {
  return {
    cabinetId: cabinetId ?? 0,
    cabinetName: cabinetName ?? null,
    cabinetDescription: cabinetDescription ?? null,
    cabinetOperation: cabinetOperation,
    isActive: isActive ?? true,
    createdBy: createdBy ?? null,
    updatedBy: updatedBy ?? null,
    updatedOn: updatedOn ?? null,
    createdOn: createdOn ?? null,
  }
}

export const createCategoryObjJson = ({ roleId, subtenantId, categoryCabinetId, fileCategoryId, fileCategoryType, categoryMappingId, fileCabinetOrder, isFileCabinet, categoryIsActive, description, categoryMapIsShared, categoryMapIsMandatory, categoryMapIsAdd, categoryMapIsDelete, categoryMapIsEdit, categoryMapIsActive, operation, createdBy, updatedBy, updatedOn, createdOn, }) => {
  return {
    "roleId": Number(roleId) ?? null,
    "subtenantId": Number(subtenantId) ?? null,
    "categoryCabinetId": Number(categoryCabinetId) ?? 0,
    "fileCategoryId": fileCategoryId ?? 0,
    "fileCategoryType": fileCategoryType ?? '',
    "categoryMappingId": categoryMappingId ?? 0,
    "fileCabinetOrder": fileCabinetOrder ?? 1,
    "isFileCabinet": isFileCabinet ?? true,
    "categoryIsActive": categoryIsActive ?? true,
    "categoryDescription": description ?? null,
    "categoryMapIsShared": categoryMapIsShared ?? true,
    "categoryMapIsMandatory": categoryMapIsMandatory ?? true,
    "categoryMapIsAdd": categoryMapIsAdd ?? true,
    "categoryMapIsDelete": categoryMapIsDelete ?? true,
    "categoryMapIsEdit": categoryMapIsEdit ?? true,
    "categoryMapIsActive": categoryMapIsActive ?? true,
    "operation": operation ?? null,
    "categoryCreatedBy": createdBy,
    "categoryUpdatedBy": updatedBy,
    "categoryCreatedOn": createdOn,
    "categoryUpdatedOn": updatedOn,
  }
}


export const createFolderObjJson = ({ folderRoleId, folderSubtenantId, folderCabinetId, folderFileCategoryId, folderId, parentFolderId, folderName, folderDescription, folderOperation, level, displayOrder, sharedRoleId, belongsTo, folderIsShared, folderIsMandatory, folderIsActive, createdBy, updatedBy, updatedOn, createdOn, isFile, }) => {
  return {
    "folderRoleId": Number(folderRoleId) ?? null,
    "folderSubtenantId": Number(folderSubtenantId) ?? null,
    "folderCabinetId": Number(folderCabinetId) ?? null,
    "folderFileCategoryId": Number(folderFileCategoryId) ?? null,
    "folderId": Number(folderId) ?? null,
    "parentFolderId": Number(parentFolderId) ?? 0,
    "folderName": folderName ?? null,
    "folderDescription": folderDescription ?? null,
    "folderOperation": folderOperation,
    "level": level ?? 1,
    "displayOrder": displayOrder ?? 1,
    "sharedRoleId": sharedRoleId ?? '',
    "belongsTo": belongsTo ?? null,
    "folderIsShared": folderIsShared ?? false,
    "folderIsMandatory": folderIsMandatory ?? false,
    "folderIsActive": folderIsActive ?? true,
    "isFile": isFile ?? false,
    "folderCreatedBy": createdBy,
    "folderUpdatedBy": updatedBy,
  };
};


export const createFileCabinetFileAdd = ({ primaryUserId, fileId, fileCategoryId, fileStatusId, fileTypeId, fileUploadedBy, cabinetId, isActive, isShared, isMandatory, isFolder, isCategory, folderId, belongsTo }) => {
  return {
    primaryUserId: primaryUserId ?? null,
    fileId: Number(fileId) ?? 0,
    fileCategoryId: Number(fileCategoryId) ?? 0,
    fileStatusId: Number(fileStatusId) ?? 0,
    fileTypeId: Number(fileTypeId) ?? 0,
    fileUploadedBy: fileUploadedBy ?? null,
    cabinetId: Number(cabinetId) ?? 0,
    isActive: isActive ?? true,
    isShared: isShared ?? false,
    isMandatory: isMandatory ?? false,
    isActive: isActive ?? true,
    isFolder: isActive ?? true,
    isCategory: isCategory ?? true,
    folderId: Number(folderId) ?? 0,
    belongsTo: belongsTo ?? null

  }
}

export const cretaeJsonForFilePermission = ({ sharedFileId, sharedUserId, primaryUserId, fileId, isActive, roleId, isAdd, isEdit, createdBy, isRead, isDelete, createdOn, updatedBy, updatedOn, belongsTo }) => {
  return {
    "sharedFileId": sharedFileId ?? 0,
    "sharedUserId": sharedUserId ?? null,
    "primaryUserId": primaryUserId ?? null,
    "fileId": fileId,
    "isActive": isActive ?? true,
    "createdBy": createdBy,
    "updatedBy": updatedBy,
    "belongsTo": belongsTo,
    "roleId": roleId,
    "isAdd": isAdd ?? false,
    "isEdit": isEdit ?? false,
    "isDelete": isDelete ?? false,
    "isRead": isRead ?? false
  }
}
export const cretaeJsonForFolderPermission = ({ fPermissionId, sharedUserId, subtenantId, primaryUserId, cabinetId, folderId, sharedRoleId, readFolder, editFolder, deleteFolder, createSubFolder, editSubFolder, fileUpload, deleteSubFolder, isActive, isShared, assignPermission, createdBy, createdOn, updatedBy, updatedOn }) => {
  return {
    "fPermissionId": fPermissionId ?? 0,
    "sharedUserId": sharedUserId ?? null,
    "primaryUserId": primaryUserId ?? null,
    "cabinetId": cabinetId ?? null,
    "folderId": folderId ?? null,
    "sharedRoleId": sharedRoleId ?? null,
    "subtenantId": subtenantId ?? null,
    "readFolder": readFolder ?? false,
    "editFolder": editFolder ?? false,
    "deleteFolder": deleteFolder ?? false,
    "createSubFolder": createSubFolder ?? false,
    "editSubFolder": editSubFolder ?? false,
    "deleteSubFolder": deleteSubFolder ?? false,
    "fileUpload": fileUpload ?? false,
    "isActive": isActive ?? true,
    "isShared": isShared ?? true,
    "assignPermission": assignPermission ?? true,
    "createdBy": createdBy ?? null,
    "updatedBy": updatedBy ?? null,
  }
}

export const createJsonForFolderMapping = ({ folderFileCategoryId, belongsTo, folderCreatedBy, folderOperation, folderSubtenantId, folderRoleId, folderCabinetId }) => {
  return {
    "folderFileCategoryId": folderFileCategoryId,
    "belongsTo": belongsTo ?? null,
    "folderCreatedBy": folderCreatedBy ?? null,
    "folderOperation": folderOperation ?? null,
    "folderSubtenantId": Number(folderSubtenantId),
    "folderRoleId": Number(folderRoleId),
    "folderCabinetId": Number(folderCabinetId)
  }

}
export const createJsonForFolderMapping2 = ({ folderFileCategoryId, belongsTo, folderCreatedBy, folderOperation, folderSubtenantId, folderRoleId, folderCabinetId, autoMapProfessionalFolderId }) => {
  return {
    "folderFileCategoryId": folderFileCategoryId,
    "belongsTo": belongsTo ?? null,
    "folderCreatedBy": folderCreatedBy ?? null,
    "folderOperation": folderOperation ?? null,
    "folderSubtenantId": Number(folderSubtenantId),
    "folderRoleId": Number(folderRoleId),
    "folderCabinetId": Number(folderCabinetId),
    // "autoMapProfessionalFolderId":'3730,3738,3739'
    "autoMapProfessionalFolderId": autoMapProfessionalFolderId
  }

}

export const createJsonUploadFileV2 = ({ FileId, UserId, File, UploadedBy, FileTypeId, FileCategoryId, FileStatusId, EmergencyDocument, DocumentLocation, UserFileName, DateFinalized, Description }) => {
  return {
    "FileId": FileId ?? 0,
    "UserId": UserId ?? '',
    "File": File ?? '',
    "UploadedBy": UploadedBy ?? '',
    "FileTypeId": FileTypeId ?? '',
    "FileCategoryId": FileCategoryId ?? '',
    "FileStatusId": FileStatusId ?? 2,
    "EmergencyDocument": EmergencyDocument ?? false,
    "DocumentLocation": DocumentLocation ?? '',
    "UserFileName": UserFileName ?? '',
    "DateFinalized": DateFinalized ?? '',
    "Description": Description ?? '',
  }
}

export const createSocialInviterJson = (memberUserId, loggenUserId, d, service, index) => {

  const { name, address, email, website, birthday, notes, id, screenname, phone } = d;
  const { first_name, last_name } = name;
  const { day, month, year } = birthday;

  const personDOb = (day !== null && day !== "" && month !== null && month !== "" && year !== null && year !== "") ? `${year}-${month}-${day}` : null;

  const mapEmailAddress = email.map((d, index) => {
    const contactTypeId = ((index + 1) <= 5) ? index + 1 : 999999;
    return {
      emailId: d, contactTypeId: contactTypeId, socialPersonId: 0
    }
  });

  const mapContactInfo = phone !== null && phone !== undefined && phone !== "" && phone.map((d, index) => {
    const contactTypeId = ((index + 1) <= 5) ? index + 1 : 999999;
    return {

      contactTypeId: contactTypeId,
      socialPersonId: 0,
      mobileNo: d
    }
  });


  const mapAddress = address != undefined && address != null && address != "" && address.map(({ formattedaddress, street, city, state, zip, country, county }, index) => {
    const addressTypeId = ((index + 1) <= 3) ? index + 1 : 999999;
    return {
      socialPersonId: 0,
      // socialPersonAddressId: 0,
      addLong: null,
      addLat: null,
      address1: formattedaddress,
      address2: null,
      address3: null,
      addressTypeId: addressTypeId,
      city: city,
      State: state,
      country: country,
      zipCode: zip,
      county: county
    }
  })





  return {
    socialPersonId: 0,
    PersonIndexCount: index,
    personFName: first_name,
    personLName: last_name,
    // personUserId: null,
    isActive: true,
    personFName: first_name ?? null,
    personLName: last_name ?? null,
    // personStatus: "NEW CONTACT",
    socialPersonTypeId: 5,
    personDOB: personDOb,
    // socialTypeId: 0,
    addressList: mapAddress == false || mapAddress == "" ? null : mapAddress,
    emailList: mapEmailAddress,
    // socialType: "ContactType",
    phoneList: service != "google" ? (mapContactInfo == false || mapContactInfo == "" ? null : mapContactInfo) : []
  }
}

export const mapSocialInviterJsonIntoArray = (service, memberUserId, loggenUserId, d) => {


  const arr = d.map((data, index) => createSocialInviterJson(memberUserId, loggenUserId, data, service, index));

  const json = {
    socialType: service,
    memberUserId: memberUserId,
    createdBy: loggenUserId,
    socialPersonList: arr,
    operation: "INSERT"

  }
  return json;
}

export const mapSocialInviterUpsertJsonIntoArray = (service, memberUserId, loggenUserId, d) => {

  const json = {
    socialType: service,
    memberUserId: memberUserId,
    updatedBy: loggenUserId,
    socialPersonList: d,
    operation: "UPDATE"
    // isActive: true
  }
  return json;
}


export const createSentEmailJsonForOccurrene = ({ emailType, emailTo, emailSubject, emailContent, emailTemplateId, emailMappingTablePKId, emailBcc, emailcc, createdBy }) => {
  return {
    emailType: emailType ?? null,
    emailTo: emailTo ?? null,
    emailSubject: emailSubject ?? null,
    emailContent: emailContent ?? null,
    emailTemplateId: emailTemplateId ?? null,
    emailStatusId: 1,
    emailMappingTable: "tblUsers",
    emailMappingTablePKId: emailMappingTablePKId ?? null,
    emailBcc: emailBcc ?? null,
    emailcc: emailcc ?? null,
    createdBy: createdBy ?? null
  };
}

export const createSentTextJsonForOccurrene = ({ smsType, textTo, textContent, smsTemplateId, smsMappingTablePKId, createdBy }) => {
  return {
    smsType: smsType ?? null,
    textTo: textTo ?? null,
    textContent: textContent ?? null,
    smsTemplateId: smsTemplateId ?? null,
    smsStatusId: 1,
    smsMappingTable: "tblUsers",
    smsMappingTablePKId: smsMappingTablePKId ?? null,
    createdBy: createdBy ?? null,
  }
}

export const uscurencyFormate = (value) => {
  if (value !== undefined && value !== null && value !== "") {
    if (typeof value === 'string') {
      return parseFloat(value).toLocaleString('en-US');
    } else if (typeof value === 'number') {
      return value.toLocaleString('en-US');
    } else {
      return 'Invalid input';
    }

  } else {
    return ""
  }

}
export const isUserUnder18 = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--; // Adjust age if birthday hasn't occurred yet this year
  }
  return age < 18;
}

export const isUserUnder16 = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--; // Adjust age if birthday hasn't occurred yet this year
  }
  // return age < 16;
  return age < 14;
}

export const isDateComplete = (dateString) => {
  // Check if the date string matches the format YYYY-MM-DD
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateString)) {
    return false; // Return false if the format is incorrect
  }

  // Create a Date object from the date string
  const date = new Date(dateString);

  // Extract year, month, and day from the date object
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month is zero-based, so add 1
  const day = date.getDate();

  // Check if all parts are present, valid, and complete
  return (
    !isNaN(year) && year >= 1000 && year <= 9999 && // Year should be between 1000 and 9999
    !isNaN(month) && month >= 1 && month <= 12 &&   // Month should be between 1 and 12
    !isNaN(day) && day >= 1 && day <= 31            // Day should be between 1 and 31
  );
}



// *********************_________________CE__IMPORT__DATA____________________*************************
// export const jsonObjCE = {
//   "memberCEId": 49,
//   "userName": "Carter Britanni",
//   "userEmail": "personalCEtest@mailinator.com",
//   "userGender": "Female",
//   "userPhoneNumber": "9847527623",
//   "userDOB": "1990-12-12T00:00:00",
//   "userRelationshipStatus": "Married",
//   "address": [
//     {
//       "addressTypeId": 1,
//       "personAddressCity": "New York",
//       "personAddressState": "New York",
//       "personAddressStreet": "462 1st Avenue",
//       "personAddressZipCode": "10016-9196"
//     },
//     {
//       "addressTypeId": 2,
//       "personAddressCity": "Burnaby",
//       "personAddressState": "British Columbia",
//       "personAddressStreet": "6461 Telford Avenue",
//       "personAddressZipCode": "V5H 0B7"
//     }
//   ],
//   "spouse": {
//     "personName": "Prmaa Britanni",
//     "personEmail": "",
//     "personGender": "Male",
//     "personPhoneNumber": "",
//     "personDOB": "1998-02-10T20:30:00",
//     "personRelationWithUser": "spouse",
//     "personRelationWithSpouse": "self",
//     "address": [
//       {
//         "addressTypeId": 1,
//         "personAddressCity": "New York",
//         "personAddressState": "New York",
//         "personAddressStreet": "462 1st Avenue",
//         "personAddressZipCode": "10016-9196"
//       },
//       {
//         "addressTypeId": 2,
//         "personAddressCity": "New York",
//         "personAddressState": "New York",
//         "personAddressStreet": "462 1st Avenue",
//         "personAddressZipCode": "10016-9196"
//       }
//     ]
//   },
//   "children": [
//     {
//       "personName": "Piper Britanni",
//       "personEmail": "Pepittest@mailinator.com",
//       "personGender": "Female",
//       "personPhoneNumber": "3454323455",
//       "personDOB": "2000-11-09T00:00:00",
//       "personRelationWithUser": "stepdaughter",
//       "personRelationWithSpouse": "daughter",
//       "address": [
//         {
//           "addressTypeId": 1,
//           "personAddressCity": "Houston",
//           "personAddressState": "Texas",
//           "personAddressStreet": "12230 Westheimer Road",
//           "personAddressZipCode": "77077"
//         },
//         {
//           "addressTypeId": 2,
//           "personAddressCity": "Houston",
//           "personAddressState": "Texas",
//           "personAddressStreet": "12230 Westheimer Road",
//           "personAddressZipCode": "77077"
//         }
//       ]
//     },
//     {
//       "personName": "Hdyh Dhh",
//       "personEmail": "",
//       "personGender": "Male",
//       "personPhoneNumber": "",
//       "personDOB": "1990-12-31T00:00:00",
//       "personRelationWithUser": "son",
//       "personRelationWithSpouse": "daughter",
//       "address": [
//         {
//           "addressTypeId": 1,
//           "personAddressCity": "New York",
//           "personAddressState": "New York",
//           "personAddressStreet": "462 1st Avenue",
//           "personAddressZipCode": "10016-9196"
//         },
//         {
//           "addressTypeId": 2,
//           "personAddressCity": "New York",
//           "personAddressState": "New York",
//           "personAddressStreet": "96th Street Library,  East 96th Street",
//           "personAddressZipCode": "10128-2626"
//         }
//       ]
//     }
//   ],
//   "nonFamily": [
//     {
//       "personName": "Ury Euyr",
//       "personEmail": "",
//       "personGender": "Male",
//       "personPhoneNumber": "",
//       "personDOB": "1990-02-22T00:00:00",
//       "personRelationWithUser": "father",
//       "personRelationWithSpouse": "father-in-law",
//       "address": [
//         {
//           "addressTypeId": 1,
//           "personAddressCity": "New York",
//           "personAddressState": "New York",
//           "personAddressStreet": "462 1st Avenue",
//           "personAddressZipCode": "10016-9196"
//         },
//         {
//           "addressTypeId": 2,
//           "personAddressCity": "Houston",
//           "personAddressState": "Texas",
//           "personAddressStreet": "#222 4625 Windfern Road",
//           "personAddressZipCode": "77041"
//         }
//       ]
//     }
//   ],
//   "fiduciaryAssignments": [
//     {
//       "legalDocId": 2,
//       "agentName": "Hdyh Dhh",
//       "sRankId": 1,
//       "userName": "Carter Britanni"
//     },
//     {
//       "legalDocId": 2,
//       "agentName": "Ury Euyr",
//       "sRankId": 2,
//       "userName": "Carter Britanni"
//     },
//     {
//       "legalDocId": 2,
//       "agentName": "Piper Britanni",
//       "sRankId": 3,
//       "userName": "Carter Britanni"
//     },
//     {
//       "legalDocId": 7,
//       "agentName": "Ury Euyr",
//       "sRankId": 1,
//       "userName": "Carter Britanni"
//     },
//     {
//       "legalDocId": 7,
//       "agentName": "Hdyh Dhh",
//       "sRankId": 2,
//       "userName": "Carter Britanni"
//     },
//     {
//       "legalDocId": 7,
//       "agentName": "Piper Britanni",
//       "sRankId": 3,
//       "userName": "Carter Britanni"
//     },
//     {
//       "legalDocId": 6,
//       "agentName": "Hdyh Dhh",
//       "sRankId": 1,
//       "userName": "Carter Britanni"
//     },
//     {
//       "legalDocId": 6,
//       "agentName": "Ury Euyr",
//       "sRankId": 2,
//       "userName": "Carter Britanni"
//     },
//     {
//       "legalDocId": 6,
//       "agentName": "Piper Britanni",
//       "sRankId": 3,
//       "userName": "Carter Britanni"
//     },
//     {
//       "legalDocId": 9,
//       "agentName": "Hdyh Dhh",
//       "sRankId": 1,
//       "userName": "Carter Britanni"
//     },
//     {
//       "legalDocId": 9,
//       "agentName": "Ury Euyr",
//       "sRankId": 2,
//       "userName": "Carter Britanni"
//     },
//     {
//       "legalDocId": 9,
//       "agentName": "Piper Britanni",
//       "sRankId": 3,
//       "userName": "Carter Britanni"
//     },
//     {
//       "legalDocId": 2,
//       "agentName": "Hdyh Dhh",
//       "sRankId": 1,
//       "userName": "Prmaa Britanni"
//     },
//     {
//       "legalDocId": 2,
//       "agentName": "Ury Euyr",
//       "sRankId": 2,
//       "userName": "Prmaa Britanni"
//     },
//     {
//       "legalDocId": 2,
//       "agentName": "Piper Britanni",
//       "sRankId": 3,
//       "userName": "Prmaa Britanni"
//     },
//     {
//       "legalDocId": 7,
//       "agentName": "Ury Euyr",
//       "sRankId": 1,
//       "userName": "Prmaa Britanni"
//     },
//     {
//       "legalDocId": 7,
//       "agentName": "Hdyh Dhh",
//       "sRankId": 2,
//       "userName": "Prmaa Britanni"
//     },
//     {
//       "legalDocId": 7,
//       "agentName": "Piper Britanni",
//       "sRankId": 3,
//       "userName": "Prmaa Britanni"
//     },
//     {
//       "legalDocId": 6,
//       "agentName": "Hdyh Dhh",
//       "sRankId": 1,
//       "userName": "Prmaa Britanni"
//     },
//     {
//       "legalDocId": 6,
//       "agentName": "Ury Euyr",
//       "sRankId": 2,
//       "userName": "Prmaa Britanni"
//     },
//     {
//       "legalDocId": 6,
//       "agentName": "Piper Britanni",
//       "sRankId": 3,
//       "userName": "Prmaa Britanni"
//     },
//     {
//       "legalDocId": 9,
//       "agentName": "Hdyh Dhh",
//       "sRankId": 1,
//       "userName": "Prmaa Britanni"
//     },
//     {
//       "legalDocId": 9,
//       "agentName": "Ury Euyr",
//       "sRankId": 2,
//       "userName": "Prmaa Britanni"
//     },
//     {
//       "legalDocId": 9,
//       "agentName": "Piper Britanni",
//       "sRankId": 3,
//       "userName": "Prmaa Britanni"
//     }
//   ],
//   "userAssets": [
//     {
//       "uaType": "Saving Account",
//       "uaName": "Uj",
//       "uaAccountNumber": "",
//       "uaOwner": "Carter BritanniPrmaa Britanni"
//     },
//     {
//       "uaType": "Roth IRA",
//       "uaName": "4434frf",
//       "uaAccountNumber": "",
//       "uaOwner": "Carter BritanniPrmaa Britanni"
//     },
//     {
//       "uaType": "Saving Account",
//       "uaName": "Rfrvv",
//       "uaAccountNumber": "",
//       "uaOwner": "Prmaa Britanni"
//     },
//     {
//       "uaType": "Roth IRA",
//       "uaName": "Dfrfr44",
//       "uaAccountNumber": "",
//       "uaOwner": "Carter Britanni"
//     },
//     {
//       "uaType": "Rental Property",
//       "uaName": "",
//       "uaAccountNumber": "",
//       "uaOwner": "Carter BritanniPrmaa Britanni"
//     },
//     {
//       "uaType": "CDs",
//       "uaName": "Hyy",
//       "uaAccountNumber": "",
//       "uaOwner": "Carter BritanniPrmaa Britanni"
//     },
//     {
//       "uaType": "Life Insurance",
//       "uaName": "Berkshire Hathaway Ins",
//       "uaAccountNumber": "4563345yf54",
//       "uaOwner": "Carter Britanni"
//     },
//     {
//       "uaType": "Life Insurance",
//       "uaName": "American Intl Group (AIG)",
//       "uaAccountNumber": "234t4r",
//       "uaOwner": "Prmaa Britanni"
//     },
//     {
//       "uaType": "Life Insurance",
//       "uaName": "Liberty Mutual Ins Cos",
//       "uaAccountNumber": "7646447677867",
//       "uaOwner": "Prmaa Britanni"
//     }
//   ]
// }

export const jsonObjCE = {
  "memberCEId": 75,
  "userName": "Carter Britanni",
  "userEmail": "test125aCLieant@mailinator.com",
  "userGender": "Female",
  "userPhoneNumber": "9847527623",
  "userDOB": "1925-02-22T00:00:00",
  "userRelationshipStatus": "Married",
  "allergies": "Caipo , Ninas , paisr",
  "address": [
    {
      "addressTypeId": 1,
      "personAddressCity": "New York",
      "personAddressState": "New York",
      "personAddressStreet": "462 1st Avenue",
      "personAddressZipCode": "10016-9196"
    },
    {
      "addressTypeId": 2,
      "personAddressCity": "Burnaby",
      "personAddressState": "",
      "personAddressStreet": "6461 Telford Avenue",
      "personAddressZipCode": "V5H 0B7"
    }
  ],
  "spouse": {
    "personName": "Prmaa Britanni",
    "personEmail": "",
    "personGender": "Male",
    "personPhoneNumber": "",
    "personDOB": "1998-02-10T15:00:00",
    "personRelationWithUser": "spouse",
    "personRelationWithSpouse": "self",
    "allergies": "Mirch , jira , cold water",
    "address": [
      {
        "addressTypeId": 1,
        "personAddressCity": "New York",
        "personAddressState": "New York",
        "personAddressStreet": "462 1st Avenue",
        "personAddressZipCode": "10016-9196"
      },
      {
        "addressTypeId": 2,
        "personAddressCity": "New York",
        "personAddressState": "New York",
        "personAddressStreet": "462 1st Avenue",
        "personAddressZipCode": "10016-9196"
      }
    ],
    "userLivingWills": [
      {
        "subjectId": 52,
        "question": "I want maximum treatment",
        "answer": "true",
        "responseId": 90
      },
      {
        "subjectId": 54,
        "question": "Cardiopulmonary Resuscitation (CPR)?",
        "answer": "true",
        "responseId": 94
      },
      {
        "subjectId": 55,
        "question": "Artificially provided hydration?",
        "answer": "false",
        "responseId": 97
      },
      {
        "subjectId": 56,
        "question": "Artificially provided nutrition?",
        "answer": "true",
        "responseId": 98
      },
      {
        "subjectId": 57,
        "question": "Antibiotic treatment for side conditions?",
        "answer": "false",
        "responseId": 101
      },
      {
        "subjectId": 58,
        "question": "Other heroic measures?",
        "answer": "true",
        "responseId": 102
      }
    ]
  },
  "children": [
    {
      "personName": "Nam Britanni",
      "personEmail": "",
      "personGender": "Male",
      "personPhoneNumber": "",
      "personDOB": "2000-11-11T00:00:00",
      "personRelationWithUser": "son",
      "personRelationWithSpouse": "son",
      "allergies": null,
      "address": [],
      "userLivingWills": [],
    },
    {
      "personName": "Qwqq Britanni",
      "personEmail": "",
      "personGender": "Male",
      "personPhoneNumber": "",
      "personDOB": "1990-12-22T00:00:00",
      "personRelationWithUser": "son",
      "personRelationWithSpouse": "son",
      "allergies": null,
      "address": [],
      "userLivingWills": []
    },
    {
      "personName": "Hdyh Dhh",
      "personEmail": "",
      "personGender": "Male",
      "personPhoneNumber": "",
      "personDOB": "1990-12-31T00:00:00",
      "personRelationWithUser": "son",
      "personRelationWithSpouse": "daughter",
      "allergies": null,
      "address": [
        {
          "addressTypeId": 1,
          "personAddressCity": "New York",
          "personAddressState": "New York",
          "personAddressStreet": "462 1st Avenue",
          "personAddressZipCode": "10016-9196"
        },
        {
          "addressTypeId": 2,
          "personAddressCity": "New York",
          "personAddressState": "New York",
          "personAddressStreet": "96th Street Library,  East 96th Street",
          "personAddressZipCode": "10128-2626"
        }
      ],
      "userLivingWills": []
    },
    {
      "personName": "Piper Britanni",
      "personEmail": "test125@mailinator.com",
      "personGender": "Female",
      "personPhoneNumber": "3454323455",
      "personDOB": "2000-11-09T00:00:00",
      "personRelationWithUser": "stepdaughter",
      "personRelationWithSpouse": "daughter",
      "allergies": null,
      "address": [
        {
          "addressTypeId": 1,
          "personAddressCity": "Houston",
          "personAddressState": "Texas",
          "personAddressStreet": "12230 Westheimer Road",
          "personAddressZipCode": "77077"
        },
        {
          "addressTypeId": 2,
          "personAddressCity": "Houston",
          "personAddressState": "Texas",
          "personAddressStreet": "12230 Westheimer Road",
          "personAddressZipCode": "77077"
        }
      ],
      "userLivingWills": []
    }
  ],
  "nonFamily": [
    {
      "personName": "Premni Britanni",
      "personEmail": "",
      "personGender": "Male",
      "personPhoneNumber": "",
      "personDOB": "1990-02-09T00:00:00",
      "personRelationWithUser": "grand-child",
      "personRelationWithSpouse": "grand-child",
      "allergies": null,
      "address": [],
      "userLivingWills": []
    },
    {
      "personName": "Bahani Britanni",
      "personEmail": "",
      "personGender": "Male",
      "personPhoneNumber": "",
      "personDOB": "2003-11-21T00:00:00",
      "personRelationWithUser": "grand-child",
      "personRelationWithSpouse": "grand-child",
      "allergies": null,
      "address": [],
      "userLivingWills": []
    },
    {
      "personName": "Ury Euyr",
      "personEmail": "",
      "personGender": "Male",
      "personPhoneNumber": "",
      "personDOB": "1990-02-22T00:00:00",
      "personRelationWithUser": "father",
      "personRelationWithSpouse": "father-in-law",
      "allergies": null,
      "address": [
        {
          "addressTypeId": 1,
          "personAddressCity": "New York",
          "personAddressState": "New York",
          "personAddressStreet": "462 1st Avenue",
          "personAddressZipCode": "10016-9196"
        },
        {
          "addressTypeId": 2,
          "personAddressCity": "Houston",
          "personAddressState": "Texas",
          "personAddressStreet": "#222 4625 Windfern Road",
          "personAddressZipCode": "77041"
        }
      ],
      "userLivingWills": []
    },
    {
      "personName": "Pani Britanni",
      "personEmail": "",
      "personGender": "Female",
      "personPhoneNumber": "",
      "personDOB": "1998-02-22T00:00:00",
      "personRelationWithUser": "daughter-in-law",
      "personRelationWithSpouse": "daughter-in-law",
      "allergies": null,
      "address": [],
      "userLivingWills": []
    }
  ],
  "fiduciaryAssignments": [
    {
      "legalDocId": 2,
      "agentName": "Hdyh Dhh",
      "sRankId": 1,
      "userName": "Carter Britanni"
    },
    {
      "legalDocId": 2,
      "agentName": "Ury Euyr",
      "sRankId": 2,
      "userName": "Carter Britanni"
    },
    {
      "legalDocId": 2,
      "agentName": "Piper Britanni",
      "sRankId": 3,
      "userName": "Carter Britanni"
    },
    {
      "legalDocId": 7,
      "agentName": "Ury Euyr",
      "sRankId": 1,
      "userName": "Carter Britanni"
    },
    {
      "legalDocId": 7,
      "agentName": "Hdyh Dhh",
      "sRankId": 2,
      "userName": "Carter Britanni"
    },
    {
      "legalDocId": 7,
      "agentName": "Piper Britanni",
      "sRankId": 3,
      "userName": "Carter Britanni"
    },
    {
      "legalDocId": 6,
      "agentName": "Hdyh Dhh",
      "sRankId": 1,
      "userName": "Carter Britanni"
    },
    {
      "legalDocId": 6,
      "agentName": "Ury Euyr",
      "sRankId": 2,
      "userName": "Carter Britanni"
    },
    {
      "legalDocId": 6,
      "agentName": "Piper Britanni",
      "sRankId": 3,
      "userName": "Carter Britanni"
    },
    {
      "legalDocId": 9,
      "agentName": "Hdyh Dhh",
      "sRankId": 1,
      "userName": "Carter Britanni"
    },
    {
      "legalDocId": 9,
      "agentName": "Ury Euyr",
      "sRankId": 2,
      "userName": "Carter Britanni"
    },
    {
      "legalDocId": 9,
      "agentName": "Piper Britanni",
      "sRankId": 3,
      "userName": "Carter Britanni"
    },
    {
      "legalDocId": 2,
      "agentName": "Hdyh Dhh",
      "sRankId": 1,
      "userName": "Prmaa Britanni"
    },
    {
      "legalDocId": 2,
      "agentName": "Ury Euyr",
      "sRankId": 2,
      "userName": "Prmaa Britanni"
    },
    {
      "legalDocId": 2,
      "agentName": "Piper Britanni",
      "sRankId": 3,
      "userName": "Prmaa Britanni"
    },
    {
      "legalDocId": 7,
      "agentName": "Ury Euyr",
      "sRankId": 1,
      "userName": "Prmaa Britanni"
    },
    {
      "legalDocId": 7,
      "agentName": "Hdyh Dhh",
      "sRankId": 2,
      "userName": "Prmaa Britanni"
    },
    {
      "legalDocId": 7,
      "agentName": "Piper Britanni",
      "sRankId": 3,
      "userName": "Prmaa Britanni"
    },
    {
      "legalDocId": 6,
      "agentName": "Hdyh Dhh",
      "sRankId": 1,
      "userName": "Prmaa Britanni"
    },
    {
      "legalDocId": 6,
      "agentName": "Ury Euyr",
      "sRankId": 2,
      "userName": "Prmaa Britanni"
    },
    {
      "legalDocId": 6,
      "agentName": "Piper Britanni",
      "sRankId": 3,
      "userName": "Prmaa Britanni"
    },
    {
      "legalDocId": 9,
      "agentName": "Hdyh Dhh",
      "sRankId": 1,
      "userName": "Prmaa Britanni"
    },
    {
      "legalDocId": 9,
      "agentName": "Ury Euyr",
      "sRankId": 2,
      "userName": "Prmaa Britanni"
    },
    {
      "legalDocId": 9,
      "agentName": "Piper Britanni",
      "sRankId": 3,
      "userName": "Prmaa Britanni"
    }
  ],
  "userAssets": [
    {
      "uaType": "Saving Account",
      "uaName": "Uj",
      "uaAccountNumber": "",
      "uaOwner": "Carter BritanniPrmaa Britanni"
    },
    {
      "uaType": "Roth IRA",
      "uaName": "4434frf",
      "uaAccountNumber": "",
      "uaOwner": "Carter BritanniPrmaa Britanni"
    },
    {
      "uaType": "Saving Account",
      "uaName": "Rfrvv",
      "uaAccountNumber": "",
      "uaOwner": "Prmaa Britanni"
    },
    {
      "uaType": "Roth IRA",
      "uaName": "Dfrfr44",
      "uaAccountNumber": "",
      "uaOwner": "Carter Britanni"
    },
    {
      "uaType": "Rental Property",
      "uaName": "",
      "uaAccountNumber": "",
      "uaOwner": "Carter BritanniPrmaa Britanni"
    },
    {
      "uaType": "CDs",
      "uaName": "Hyy",
      "uaAccountNumber": "",
      "uaOwner": "Carter BritanniPrmaa Britanni"
    },
    {
      "uaType": "Auto",
      "uaName": "23232",
      "uaAccountNumber": "",
      "uaOwner": "Carter Britanni"
    },
    {
      "uaType": "Life Insurance",
      "uaName": "Berkshire Hathaway Ins",
      "uaAccountNumber": "4563345yf54",
      "uaOwner": "Carter Britanni"
    },
    {
      "uaType": "Life Insurance",
      "uaName": "American Intl Group (AIG)",
      "uaAccountNumber": "234t4r",
      "uaOwner": "Prmaa Britanni"
    },
    {
      "uaType": "Life Insurance",
      "uaName": "Liberty Mutual Ins Cos",
      "uaAccountNumber": "7646447677867",
      "uaOwner": "Prmaa Britanni"
    }
  ],
  "userProfesstionals": [
    {
      "professionalName": "Prem  Test 01",
      "professionalCompanyName": "The future",
      "professionalEmail": "prof01@mailinator.com",
      "professionalPhone": "+12345654345",
      "professionalRole": "Financial Advisor",
      "professionalAddressLine": "232 Forsyth Street Southwest Atlanta Georgia 30303-3702 Fulton County",
      "professionalCity": "Atlanta",
      "professionalState": "Georgia",
      "professionalZipCode": "30303-3702"
    },
    {
      "professionalName": "Mohan  Noah 01",
      "professionalCompanyName": "Havi pvt",
      "professionalEmail": "prof02@mailinator.com",
      "professionalPhone": "+17866579087",
      "professionalRole": "Accountant",
      "professionalAddressLine": "123 William Street New York New York 10038-3804 New York County",
      "professionalCity": "New York",
      "professionalState": "New York",
      "professionalZipCode": "10038-3804"
    },
    {
      "professionalName": "AMit  Ohan",
      "professionalCompanyName": "THe mit way",
      "professionalEmail": "prof03@mailinator.com",
      "professionalPhone": "+13456787654",
      "professionalRole": "Bill Pay",
      "professionalAddressLine": "3234 Southeast 6th Avenue Fort Lauderdale Florida 33316 Broward County",
      "professionalCity": "Fort Lauderdale",
      "professionalState": "Florida",
      "professionalZipCode": "33316"
    },
    {
      "professionalName": "Migga  Moha",
      "professionalCompanyName": "The Cap Way",
      "professionalEmail": "prof04@mailinator.com",
      "professionalPhone": "+13456765434",
      "professionalRole": "Property Management",
      "professionalAddressLine": "530 1st Avenue New York New York 10016-6402 New York County",
      "professionalCity": "New York",
      "professionalState": "New York",
      "professionalZipCode": "10016-6402"
    },
    {
      "professionalName": "Mhana  Han",
      "professionalCompanyName": "Aging",
      "professionalEmail": "prof05@mailinator.com",
      "professionalPhone": "+13456775432",
      "professionalRole": "Geriatric Care Manager (GCM)",
      "professionalAddressLine": "2322 3rd Avenue New York New York 10035-1304 New York County",
      "professionalCity": "New York",
      "professionalState": "New York",
      "professionalZipCode": "10035-1304"
    },
    {
      "professionalName": "Mihan  Bai",
      "professionalCompanyName": "Te bay watc",
      "professionalEmail": "prof06@mailinator.com",
      "professionalPhone": "+13454346569",
      "professionalRole": "Auto Mechanic",
      "professionalAddressLine": "4565 Queen Mary Road,  Montreal Montréal Québec H3W 1W5 Montréal",
      "professionalCity": "Montréal",
      "professionalState": "Florida",
      "professionalZipCode": "H3W 1W5"
    }
  ],
  "userLivingWills": [
    {
      "subjectId": 52,
      "question": "I want maximum treatment",
      "answer": "true",
      "responseId": 90
    },
    {
      "subjectId": 54,
      "question": "Cardiopulmonary Resuscitation (CPR)?",
      "answer": "true",
      "responseId": 94
    },
    {
      "subjectId": 55,
      "question": "Artificially provided hydration?",
      "answer": "false",
      "responseId": 97
    },
    {
      "subjectId": 56,
      "question": "Artificially provided nutrition?",
      "answer": "true",
      "responseId": 98
    },
    {
      "subjectId": 57,
      "question": "Antibiotic treatment for side conditions?",
      "answer": "false",
      "responseId": 101
    },
    {
      "subjectId": 58,
      "question": "Other heroic measures?",
      "answer": "true",
      "responseId": 102
    }
  ]
}






// *********************_________________CE__IMPORT__DATA____________________*************************


export const createAddUserJsonObj = ({ subtenantId, signUpPlateform, createUserCredentials, createdBy, roleId, firstName, lastName, emailAddress, userName, countryCode, mobileNumber, password, packageCode, activateUser, autoConfirmEmail, autoConfirmMobile }) => {
  return {
    "subtenantId": subtenantId ?? 0,
    "signUpPlateform": signUpPlateform ?? 0,
    "createUserCredentials": createUserCredentials ?? true,
    "createdBy": createdBy ?? '',
    "user": {
      "roleId": roleId ?? 0,
      "firstName": firstName ?? null,
      "lastName": lastName ?? null,
      "emailAddress": emailAddress ?? null,
      "userName": emailAddress ?? null,
      "countryCode": countryCode ?? "+1",
      "mobileNumber": mobileNumber ?? null,
      "activateUser": activateUser ?? false,
      "autoConfirmEmail": autoConfirmEmail ?? false,
      "autoConfirmMobile": autoConfirmMobile ?? false
    }
  }
}

// update member By id -----------------------------------------
export const updateMemberJson = ({ subtenantId, fName, mName, lName, nickName, dob }) => {
  return {
    "memberRelationship": {
      "primaryUserId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "relationshipTypeId": 0,
      "isFiduciary": true,
      "isBeneficiary": true,
      "rltnTypeWithSpouseId": 0,
      "relativeUserId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "isEmergencyContact": true,
      "userRltnshipId": 0,
      "userMemberId": 0,
      "relationshipType": "string"
    }
  }
}

// Address add up user id 
export const addressJson = ({ address, userId, lattitude, longitude, addressLine2, addressLine3, zipcode, county, city, state, country, addressTypeId, countyRefId, createdBy }) => {
  const { personAddressStreet, personAddressCity, personAddressState, personAddressZipCode } = address
  const addressLine1 = personAddressStreet + " " + personAddressCity + " " + personAddressState + " " + personAddressZipCode

  return {
    "userId": userId ?? '',
    "address": {
      "lattitude": lattitude ?? null,
      "longitude": longitude ?? null,
      "addressLine1": addressLine1 ?? null,
      "addressLine2": addressLine2 ?? null,
      "addressLine3": addressLine3 ?? null,
      "zipcode": personAddressZipCode ?? null,
      "county": county ?? null,
      "city": personAddressCity ?? null,
      "state": personAddressState ?? personAddressCity,
      "country": personAddressCity ?? 'United States of America',
      "addressTypeId": addressTypeId ?? 0,
      "countyRefId": countyRefId ?? null,
      "createdBy": createdBy ?? null
    }
  }
}


export const addressForCeProffessional = ({ address, userId, lattitude, longitude, addressLine2, addressLine3, county, addressTypeId, countyRefId, createdBy }) => {
  const { professionalAddressLine, professionalCity, professionalState, professionalZipCode } = address


  return {
    "userId": userId ?? '',
    "address": {
      "lattitude": lattitude ?? null,
      "longitude": longitude ?? null,
      "addressLine1": professionalAddressLine ?? null,
      "addressLine2": addressLine2 ?? null,
      "addressLine3": addressLine3 ?? null,
      "zipcode": professionalZipCode ?? null,
      "county": county ?? null,
      "city": professionalCity ?? null,
      "state": professionalState ?? professionalCity,
      "country": professionalCity ?? 'United States of America',
      "addressTypeId": addressTypeId ?? 0,
      "countyRefId": countyRefId ?? null,
      "createdBy": createdBy ?? null
    }
  }
}


// @Add Chilkd JSON
export const contractExpressAddChildJson = ({
  subtenantId, fName, mName, lName, nickName, dob, isVeteran, isPrimaryMember, suffixId, citizenshipId, noOfChildren, genderId,
  maritalStatusId, birthPlace, fileId, primaryUserId, relationshipTypeId, isBeneficiary, isFiduciary, rltnTypeWithSpouseId, relativeUserId, isEmergencyContact, createdBy }) => {
  let json = {
    "subtenantId": subtenantId ?? 0,
    "fName": fName ?? null,
    "mName": mName ?? '',
    "lName": lName ?? null,
    "nickName": nickName ?? '',
    "dob": dob ?? null,
    "isVeteran": isVeteran ?? false,
    "isPrimaryMember": isPrimaryMember ?? false,
    "suffixId": suffixId ?? null,
    "citizenshipId": citizenshipId ?? 0,
    "noOfChildren": noOfChildren ?? 0,
    "genderId": genderId ?? 0,
    "maritalStatusId": maritalStatusId ?? null,
    "birthPlace": birthPlace ?? '',
    "fileId": fileId ?? 0,
    "memberRelationship": {
      "primaryUserId": primaryUserId ?? '',
      "relationshipTypeId": relationshipTypeId ?? 0,
      "isFiduciary": isFiduciary ?? false,
      "isBeneficiary": isBeneficiary ?? false,
      "rltnTypeWithSpouseId": rltnTypeWithSpouseId ?? null,
      "relativeUserId": relativeUserId ?? '',
      "isEmergencyContact": isEmergencyContact ?? false
    },
    "createdBy": createdBy || ''
  };

  return json;
}



export const jsonForLegalDoc = ({ legalDocTypeId, dateExecuted, userLegalDocId, upsertedBy }) => {
  return {
    legalDocTypeId: legalDocTypeId ?? 0,
    dateExecuted: dateExecuted ?? null,
    userLegalDocId: userLegalDocId ?? 0,
    upsertedBy: upsertedBy ?? null,
    isActive: true
  }
}

export const jsonForFiduciaryAssesmentadd = ({ fiduAsgnmntTypeId, sRankId, successorUserId, successorRelationId, isDocExecuted, docName, docPath, userLegalDocId, createdBy }) => {
  return {
    "fiduAsgnmntTypeId": fiduAsgnmntTypeId ?? null,
    "sRankId": sRankId ?? 0,
    "successorUserId": successorUserId ?? null,
    "successorRelationId": successorRelationId ?? 0,
    "isDocExecuted": isDocExecuted ?? true,
    "docName": docName ?? null,
    "docPath": docPath ?? null,
    "userLegalDocId": userLegalDocId ?? null,
    "createdBy": createdBy ?? null
  }
}



export const jsonForAddLifeIncCeData = ({ userId, policyTypeId, insuranceCompanyId, policyStartDate, policyExpiryDate, premiumId, cashValue, deathBenefits, additionalDetails, createdBy }) => {
  return {
    "userId": userId ?? "",
    "lifeInsurance": {
      "insuranceCompanyId": insuranceCompanyId ?? null,
      "policyTypeId": policyTypeId ?? "",
      "policyStartDate": policyStartDate ?? "",
      "policyExpiryDate": policyExpiryDate ?? "",
      "premiumId": premiumId ?? "",
      "cashValue": cashValue ?? "",
      "deathBenefits": deathBenefits ?? "",
      "additionalDetails": additionalDetails ?? "",
      "createdBy": createdBy ?? "",
      "isActive": true
    }
  }
}

export const jsonForAddUserAssetsRetireNonRetireNRealEstate = ({ primaryUserId, agingAssetCatId, agingAssetTypeId, createdBy, assetOwners, ownerUserName, nameOfInstitution }) => {
  return {
    "userId": primaryUserId,
    "asset": {
      "agingAssetCatId": agingAssetCatId ?? "",
      "agingAssetTypeId": agingAssetTypeId ?? "",
      "ownerTypeId": 1,
      "nameOfInstitution": nameOfInstitution ?? "",
      "balance": "",
      "createdBy": createdBy ?? "",
      "assetDocuments": [],
      "assetOwners": assetOwners ?? [],
      "assetBeneficiarys": [],
      "isRealPropertys": [],
      "isActive": true
    }
  }
}

export const createJsonForUpsertProfessionalUserMapping = ({ userId, isStatus, isGenAuth, upsertedBy, proCatId, proSerDescId, proTypeId, businessName, businessTypeId, proUserId }) => {
  return {
    "userId": userId ?? null,
    "isGenAuth": isGenAuth ?? false,
    "isStatus": isStatus ?? true,
    "isActive": true,
    "upsertedBy": upsertedBy ?? null,
    "proCategories": [
      {
        "proCatId": proCatId ?? 0,
        "proSerDescId": proSerDescId ?? null,
        "proTypeId": proTypeId ?? null
      }
    ],
    "businessName": businessName ?? null,
    "businessTypeId": businessTypeId ?? null,
    "websiteLink": "",
    "proUserId": proUserId ?? 0
  }
}

export const expensesPaidObj = [
  {
    question: "How are the expenses paid ?",
    options: [{ label: 'Manually', name: "Manually", value: "1" }, { label: "Auto Pay", name: "Auto Pay", value: "2" },{ label: "Pention", name: "Pention", value: "3" }]
  },
  {
    question: "Please specify the mode of payment",
    options: [{ label: 'Mail', name: "Mail", value: "11" }, { label: "In Person", name: "In Person", value: "12" }, { label: "Electronically", name: "Electronically", value: "13" }]
  }
];

export const longtermcarefund = [1209,1210,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220,1221,1222,1223,1224,1225,1226,1227,1228,1229,1233];

export const longtermcareprefrences = [1201,1202,1203,1204,1205,1206,1207,1208,1209,995,925];

