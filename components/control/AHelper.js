import moment from 'moment';
import { logoutUrl } from './Constant';
import konsole from './Konsole';

let $AHelper = {

  getObjFromStorage: function (key) {
    return JSON.parse(sessionStorage.getItem(key));
  },

  withSliceValue: (value, index) => {
    return value?.slice(index)
  },
  capitalizeFirstLetter: function (string) {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
  },

  // capitalizeAllLetters: function (string) {
  //   return string?.toUpperCase();
  // },

  capitalizeAllLetters: function (string) {
    if (typeof string !== 'string') return string;
    return string.toUpperCase();
  },

  calculate_age: (dob1) => {
    let today = new Date();
    if (dob1 == null) {
      return 0;
    }
    let birthOfDate = dob1.split("T")[0];
    let birthDate = new Date(birthOfDate);
    let age_now = today.getFullYear() - birthDate.getFullYear();

    return age_now;
  },
  dateFomratShow: (dob) => {
    const dateObject = new Date(dob);
    const day = ('0' + dateObject.getDate()).slice(-2);
    const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
    const year = dateObject.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate
  },
  getSubjectData: (subjectId, responseId, memberUserId, userSubjectDataId) => {
    return {
      userId: memberUserId,
      userSubjectDataId: userSubjectDataId || 0,
      subjectId: subjectId,
      responseId: responseId,
    }
  },

  checkIFMinor: (dob) => {
    if (dob == null || dob == "") {
      return 0;
    }
    let dateOfBirth = new Date(dob);
    let month_diff = Date.now() - dateOfBirth.getTime();
    let age_dt = new Date(month_diff);
    var year = age_dt.getUTCFullYear();
    return (year - 1970);
  },

  checkIfMinorForMarriage: (dob, dom) => {
    if ((dob == null || dob == "") && (dom == "" || dom == null)) {
      return 0;
    }
    const d1 = new Date(dob);
    const d2 = new Date(dom);
    const timeDiff = Math.abs(d1.getTime() - d2.getTime());
    const ageDifference = Math.floor(timeDiff / (1000 * 3600 * 24 * 365.25));
    return ageDifference;
  },

  isUnder14Years: (dob) => {
    const currentDate = new Date();
    const birthDate = new Date(dob);

    // Calculate age difference in years, months and days
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();

    // Adjust age difference if birth month is after current month or birth day is after current day
    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }

    if (days < 0) {
      months--;
      const lastMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
      const daysInLastMonth = new Date(currentDate.getFullYear(), lastMonth + 1, 0).getDate();
      days += daysInLastMonth;
    }

    // Format the age difference as an object with years, months and days properties
    return { years, months, days };
  },
  getFormattedDate: function (value) {
    return moment(value).format('MM-DD-YYYY')
  },
  getFormattedDateForCE: function (value) {
    return moment(value).format('MM/DD/YYYY');
  },
  changeDobTostring: function (dob) {
    const date = new Date(dob);
    const dateInIso = date.toISOString();

    return dateInIso;
  },
  objectvalidation: function (obj) {

    if (obj == undefined || obj == null || obj == "" || Object.keys(obj).length == 0) {
      return false
    } else {
      return true
    }
  },
  mobilenoconverttousformat: function (phoneNumberString) {

    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;

  },
  convertToUSFormat: (mobileNumber, countryCode) => {
    const digitsOnly = mobileNumber?.replace(/\D/g, '');
    const formattedNumber = digitsOnly?.replace(/(\d{3})(\d{3})(\d{4})/, `+${countryCode} ($1) $2-$3`);
    return formattedNumber;
  },
  getDateFromString: function (dob) {
    if (dob == null) {
      return "";
    }
    let birthOfDate = dob.split("T")[0];
    return birthOfDate;
  },
  isNumberRegex: function (value) {
    let regex = /^[0-9]*$/;
    return regex.test(value);
  },
  isNumberAndSpaceRegex: function (value) {
    let regex = /^[\d\s]{0,19}$/;
    return regex.test(value);
  },
  isValidExpirationDate: function (date) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
    return regex.test(date);
  },
  isNumberAndSlash: function (date) {
    const regex = /^[0-9\/]*$/; // MM/YY format
    return regex.test(date);
  },
  checkForNumberOnly: function (value) {
    return value === '' || !isNaN(Number(value));
  },
  isPositiveNumber: ( value ) => {
    return Number(value) && (Number(value) != 0) ? true : false;
  },
  isNumberRegexformedical: function (value) {
    // let regex = /[0-9].*$/;
    let regex = /^[0-9]{0,2}(\.[0-9]{0,2})?$/;
    return regex.test(value);
  },
  isAlphabetRegex: function (value) {
    let regex = /^[a-zA-Z-,0-9 ]+$/;
    return regex.test(value);
  },
  isAlphabetRegex2: function (value) {
    let regex = /^[a-zA-Z-,0-9,& ]+$/;
    return regex.test(value);
  },
  isNotallowspecialRegex: function (value) {
    let regex = /^[A-Za-z0-9 ]+$/;
    return regex.test(value);
  },
  isAlphabetRegexWithSpaceAndDot: function (value) {
    let regex = /^[a-z A-Z\. ]+$/;
    return regex.test(value);
  },
  isAlphabetRegexWithSpace: function (value) {
    let regex = /^[a-zA-Z ]*$/;
    return regex.test(value);
  },
  isAlphabetRegexWithSpaceCommaAndDot: function (value) {
    let regex = /^[a-zA-Z-,0-9 ]*$/;
    return regex.test(value);
  },
  isRegexForAll: function (value) {
    let regex = /^[[a-zA-Z0-9 $&+,:;=?@#|'<>.^*()%!-]*/;
    return regex.test(value);
  },
  isEmailRegEx: function (value) {
    let regex = /^[\d\-\@\_A-Aa-z\.]+$/;
    return regex.test(value);
  },
  regexfornoandstring: function (value) {
    let regex = /^[A-Z a-z 0-9]+$/
    return !regex.test(value);

  },
  isValidExpiry: ( expiryDate, comparisonDate = new Date(),  afterNoOfDays = 0 ) => {
    konsole.log("isValidExpiry expiryDate ", expiryDate, " comparisonDate ", comparisonDate);
    if(!expiryDate) return false;

    let [ month, year ] = expiryDate?.split('/');
    month = Number(month);
    year = (year?.length == 4) ? (year) : (year?.length == 2) ? ("20" + year) : ""; 
    year = Number(year);
    
    konsole.log("isValidExpiry ", month, " / ", year);

    if(!month || !year || isNaN(month) || isNaN(year)) return false;

    const _actualExpiryDate = new Date(year, month, 0);
    const _comparisonDate = $AHelper.parseDateSafely(comparisonDate?.toISOString?.() || comparisonDate)
    const _actualComparisonDate = new Date(
        _comparisonDate.getFullYear(),
        _comparisonDate.getMonth(), 
        _comparisonDate.getDate() + afterNoOfDays
    );
    
    konsole.log("isValidExpiry tabConsole", _actualExpiryDate , _comparisonDate, _actualComparisonDate);
    
    return _actualExpiryDate >= _actualComparisonDate;
  },
  handleRawDate: function (ev) {
    if (ev.type === "change") {
      let [month, date] = ev.target.value.split(/\-/);
      if (ev.nativeEvent.data && !/^[\d\-]+$/.test(ev.nativeEvent.data) || ev.target.value.length > 10 ||
        (ev.target.value.length === 3 && ev.target.value.indexOf('-') === -1) ||
        (ev.target.value.length === 6 && ev.target.value.match(/\-/g).length !== 2)) {
        ev.preventDefault();
      }
      if (parseInt(month) > 12 || (date && parseInt(date) > 31)) {
        ev.target.value = ev.target.value.substr(0, ev.target.value.length - 1) + '-';
      }
      if ((/^\d+$/.test(ev.target.value) && ev.target.value.length === 2) ||
        (ev.target.value.length === 5 && ev.target.value.match(/[0-9]/g).length === 4 && ev.target.value.match(/\-/g).length === 1)) {
        ev.target.value = ev.target.value + '-';
      }
    }
  },
  relationshipListsortingByString: function (arrData) {
    return arrData?.sort((a, b) => {
      if (a?.label < b?.label) return -1;
      if (a?.label > b?.label) return 1;
      return 0;
    })
  },

  fileuploadsizetest: function (size) {
    if (size > 105906176) {
      return true;
    } else {
      return false;
    }
  },
  typeCasteToString: function (val) {
    let string = val?.toString()
    return string;
  },
  getQueryParameters: function (urlQuery, name) {
    return new URLSearchParams(urlQuery).get(name);
  },

  formatPhoneNumber: function (str) {
    let cleaned = ("" + str).replace(/\D/g, "");
    // konsole.log("dsdasdsds",str,cleaned?.startsWith("+254"),cleaned)
    if (cleaned?.startsWith("254")) {
      return ` ${cleaned?.slice(3, 6) + " " + cleaned?.slice(6, 9) + " " + cleaned?.slice(9, 12)}`
    }
    else {
      let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
      }
      return null;
    }
  },
  newPhoneNumberFormat: function (mobileNumber) {
    const contactNumber = mobileNumber;
    function formatPhoneNumber(str) {
      let cleaned = ("" + str).replace(/\D/g, "");
      // konsole.log("dsdasdsds",str,cleaned?.startsWith("+254"),cleaned)
      if (cleaned?.startsWith("254")) {
        return ` ${cleaned?.slice(3, 6) + " " + cleaned?.slice(6, 9) + " " + cleaned?.slice(9)}`
      }
      else {
        let contactNumber = cleaned?.slice(-10)
        let match = contactNumber?.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          return "(" + match[1] + ") " + match[2] + "-" + match[3];
        }
        return null;
      }
    }
    // konsole.log("mobileNumbermobileNumber",mobileNumber)
    if (contactNumber) {
      if (contactNumber?.slice(0, 3) == +91) {
        return contactNumber?.slice(0, 3) + formatPhoneNumber(contactNumber)
      }
      else if (contactNumber?.slice(0, 4) == +254) {
        return contactNumber?.slice(0, 4) + formatPhoneNumber(contactNumber)
      }
      else {
        return contactNumber?.slice(0, 2) + formatPhoneNumber(contactNumber)
      }
    }
    else {
      return ""
    }
  },
  phoneNumberFormatInContact: function (mobileNumber) {
    const contactNumber = mobileNumber
    if (contactNumber) {
      if (contactNumber?.slice(0, 4) == +254) {
        // konsole.log("formatPhoneNumber(contactNumber)",formatPhoneNumber(contactNumber))
        return formatPhoneNumber(contactNumber)
      } else {
        return formatPhoneNumber(contactNumber?.slice(-10))
      }
    }
    else {
      return ""
    }
  },
  formatPhoneNumber2: function (str) {
    // Filter only numbers from the input
    let cleaned = ("" + str).replace(/\D/g, "");

    // Check if the input is of correct length
    if (cleaned.length === 10) {
      // If the input is exactly 10 digits, format it as (XXX) XXX-XXXX
      let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
      }
    }

    // If the input is not exactly 10 digits, return the input itself
    return str;
  },
  convertToSingleFormat(phoneNumber) {
    // Remove non-digit characters from the phone number
    var cleaned = phoneNumber.replace(/\D/g, '');

    // Format the phone number into a single string
    var formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1$2$3');

    return formatted;
  },
  mandatory: (str) => {
    return `${str}*`
  },
  mandatoryAsteriskAtStart: (str) => {
    return `${str}*`
  },
  IncludeDollars: function (balance) {
    return `$${Number(balance)?.toLocaleString("en-US", { style: "decimal", minimumFractionDigits: 2 })}`;
  },
  unAuthurizeAccess: () => {
    window.location.replace(`${logoutUrl}Account/Signin?expired=true`)
  },
  toasterValueFucntion: (open, text, type) => {
    return { open: open, text: text, type: type, }
  },
  deceasedNIncapacititedFilterFun: (data) => {
    // let filterData = data?.length > 0 ? data?.filter(({ memberStatusId }) => memberStatusId != 2 && memberStatusId != 3) : []
    return data;
  },
  baseurl64: () => {
    let data = 'data:application/pdf;base64,JVBERi0xLjMNCiXi48/TDQoNCjEgMCBvYmoNCjw8DQovVHlwZSAvQ2F0YWxvZw0KL091dGxpbmVzIDIgMCBSDQovUGFnZXMgMyAwIFINCj4+DQplbmRvYmoNCg0KMiAwIG9iag0KPDwNCi9UeXBlIC9PdXRsaW5lcw0KL0NvdW50IDANCj4+DQplbmRvYmoNCg0KMyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0NvdW50IDINCi9LaWRzIFsgNCAwIFIgNiAwIFIgXSANCj4+DQplbmRvYmoNCg0KNCAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDMgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDkgMCBSIA0KPj4NCi9Qcm9jU2V0IDggMCBSDQo+Pg0KL01lZGlhQm94IFswIDAgNjEyLjAwMDAgNzkyLjAwMDBdDQovQ29udGVudHMgNSAwIFINCj4+DQplbmRvYmoNCg0KNSAwIG9iag0KPDwgL0xlbmd0aCAxMDc0ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBBIFNpbXBsZSBQREYgRmlsZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIFRoaXMgaXMgYSBzbWFsbCBkZW1vbnN0cmF0aW9uIC5wZGYgZmlsZSAtICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjY0LjcwNDAgVGQNCigganVzdCBmb3IgdXNlIGluIHRoZSBWaXJ0dWFsIE1lY2hhbmljcyB0dXRvcmlhbHMuIE1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NTIuNzUyMCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDYyOC44NDgwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjE2Ljg5NjAgVGQNCiggdGV4dC4gQW5kIG1vcmUgdGV4dC4gQm9yaW5nLCB6enp6ei4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjA0Ljk0NDAgVGQNCiggbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDU5Mi45OTIwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNTY5LjA4ODAgVGQNCiggQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA1NTcuMTM2MCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBFdmVuIG1vcmUuIENvbnRpbnVlZCBvbiBwYWdlIDIgLi4uKSBUag0KRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQoNCjYgMCBvYmoNCjw8DQovVHlwZSAvUGFnZQ0KL1BhcmVudCAzIDAgUg0KL1Jlc291cmNlcyA8PA0KL0ZvbnQgPDwNCi9GMSA5IDAgUiANCj4+DQovUHJvY1NldCA4IDAgUg0KPj4NCi9NZWRpYUJveCBbMCAwIDYxMi4wMDAwIDc5Mi4wMDAwXQ0KL0NvbnRlbnRzIDcgMCBSDQo+Pg0KZW5kb2JqDQoNCjcgMCBvYmoNCjw8IC9MZW5ndGggNjc2ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBTaW1wbGUgUERGIEZpbGUgMiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIC4uLmNvbnRpbnVlZCBmcm9tIHBhZ2UgMS4gWWV0IG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NzYuNjU2MCBUZA0KKCBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY2NC43MDQwIFRkDQooIHRleHQuIE9oLCBob3cgYm9yaW5nIHR5cGluZyB0aGlzIHN0dWZmLiBCdXQgbm90IGFzIGJvcmluZyBhcyB3YXRjaGluZyApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY1Mi43NTIwIFRkDQooIHBhaW50IGRyeS4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NDAuODAwMCBUZA0KKCBCb3JpbmcuICBNb3JlLCBhIGxpdHRsZSBtb3JlIHRleHQuIFRoZSBlbmQsIGFuZCBqdXN0IGFzIHdlbGwuICkgVGoNCkVUDQplbmRzdHJlYW0NCmVuZG9iag0KDQo4IDAgb2JqDQpbL1BERiAvVGV4dF0NCmVuZG9iag0KDQo5IDAgb2JqDQo8PA0KL1R5cGUgL0ZvbnQNCi9TdWJ0eXBlIC9UeXBlMQ0KL05hbWUgL0YxDQovQmFzZUZvbnQgL0hlbHZldGljYQ0KL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcNCj4+DQplbmRvYmoNCg0KMTAgMCBvYmoNCjw8DQovQ3JlYXRvciAoUmF2ZSBcKGh0dHA6Ly93d3cubmV2cm9uYS5jb20vcmF2ZVwpKQ0KL1Byb2R1Y2VyIChOZXZyb25hIERlc2lnbnMpDQovQ3JlYXRpb25EYXRlIChEOjIwMDYwMzAxMDcyODI2KQ0KPj4NCmVuZG9iag0KDQp4cmVmDQowIDExDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDAwMTkgMDAwMDAgbg0KMDAwMDAwMDA5MyAwMDAwMCBuDQowMDAwMDAwMTQ3IDAwMDAwIG4NCjAwMDAwMDAyMjIgMDAwMDAgbg0KMDAwMDAwMDM5MCAwMDAwMCBuDQowMDAwMDAxNTIyIDAwMDAwIG4NCjAwMDAwMDE2OTAgMDAwMDAgbg0KMDAwMDAwMjQyMyAwMDAwMCBuDQowMDAwMDAyNDU2IDAwMDAwIG4NCjAwMDAwMDI1NzQgMDAwMDAgbg0KDQp0cmFpbGVyDQo8PA0KL1NpemUgMTENCi9Sb290IDEgMCBSDQovSW5mbyAxMCAwIFINCj4+DQoNCnN0YXJ0eHJlZg0KMjcxNA0KJSVFT0YNCg=='
    return data
  },
  agentReturnObj: ({ agentId, agentUserName, agentUserId, memberUserId, agentRoleId, agentRankId, fileId, legalDocId, testDocId, testSupportDocId, upsertedBy, agentUserRelation, isJoin }) => {
    return {
      agentId: agentId ?? 0,
      agentUserId: agentUserId ?? "",
      agentUserName: agentUserName,
      memberUserId: memberUserId ?? "",
      agentRoleId: agentRoleId,
      agentRankId: agentRankId ?? null,
      agentAcceptanceStatus: false,
      agentActiveStatus: true,
      fileId: fileId ?? null,
      legalDocId: legalDocId,
      isJoin: isJoin ?? false,
      testDocId: testDocId ?? null,
      testSupportDocId: testSupportDocId ?? null,
      upsertedBy: upsertedBy,
      statusId: 1,
      agentUserRelation: agentUserRelation
    }
  },
  findRepeatingObjectIndex: (arr) => {
    const hashTable = {};
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      if (hashTable[obj.agentUserId] !== undefined) {
        return i; // return index of repeating object
      }
      hashTable[obj.agentUserId] = i;
    }
    return -1;
  },
  getDateDiff: ( _date1, _date2 ) => {
    const Date1 = new Date(_date1), Date2 = new Date(_date2);
    const oneDayMilliSec = 24 * 60 * 60 * 1000;
    Date1.setHours(0, 0, 0, 0);
    Date2.setHours(0, 0, 0, 0);
    const diff = Math.ceil((Date1.getTime() - Date2.getTime()) / oneDayMilliSec);

    return diff;
  },
  parseDateSafely: (dateStr) => {
    if (!dateStr) return null;
    const normalizedDateStr = dateStr?.includes("T") ? dateStr : `${dateStr}T00:00:00Z`;

    const date = new Date(normalizedDateStr);
    if (isNaN(date.getTime())) {
        const parts = dateStr.split(/[-/]/);
        if (parts.length === 3) {
            const [part1, part2, part3] = parts.map((p) => p.padStart(2, '0'));
            const isoDate = `${part3}-${part1}-${part2}T00:00:00Z`;
            const safariSafeDate = new Date(isoDate);
            if (!isNaN(safariSafeDate.getTime())) return safariSafeDate;
        }
        return null;
    }
    return date;
  },
  getSubjectData: (subjectId, responseId, memberUserId, userSubjectDataId) => {
    return {
      userId: memberUserId,
      userSubjectDataId: userSubjectDataId || 0,
      subjectId: subjectId,
      responseId: responseId,
    }
  },
  setCookie: (name, value, minutes) => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + minutes * 60 * 1000); // Convert minutes to milliseconds
    document.cookie = `${name}=${value};expires=${expirationDate.toUTCString()};path=/`;
  },
  getCookie: (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null; // Return null if the cookie is not found
  },
  getLastCharacter: (str, n) => {
    const newString = str.substring(str.length - n);
    return newString;
  },

  sortCountryfromArray: (array) => {
    return [...array].sort((a, b) => {
      const order = ['+1-(+1) USA','+254-(+254) KE','+91-(+91) IN'];

        const getFullValue = (item) => `${item.value}-${item.label}`;

        const aFullValue = getFullValue(a);
        const bFullValue = getFullValue(b);

        const aIndex = order.indexOf(aFullValue);
        const bIndex = order.indexOf(bFullValue);

        if (aIndex !== -1 || bIndex !== -1) {
            return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
        }

    });
  }
}

const mapApi = "https://maps.googleapis.com/maps/api/js";
export const DEFAULT_SUBTENANTID_FOR_OCCURRENCE = 2


function loadAsyncScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    Object.assign(script, {
      type: "text/javascript",
      async: true,
      src
    })
    script.addEventListener("load", () => resolve(script));
    document.head.appendChild(script);
  })
}

const initMapScript = () => {
  if (window.google) {
    return Promise.resolve();
  }
  const src = `${mapApi}?key=${'AIzaSyBaUn22pwovCzOxH7Uthivbd8_ScMkaEAI'}&libraries=places&v=weekly`;
  return loadAsyncScript(src);
}

export { $AHelper, initMapScript };