import Router from "next/router";
import moment from "moment/moment";
import konsole from "../../components/control/Konsole";
import { deceaseMemberStatusId, isNotValidNullUndefile } from "../../components/Reusable/ReusableCom";
import { disableInLawDelete, fakeNameList, vowels } from "./Constant";
import { accessToIntake, accessToParalegal } from "../../components/control/Constant";
import { fetchUniversalAddress } from "../Redux/Reducers/apiSlice";
import { useLoader } from "../utils/utils";


export const $AHelper = {
    // @@ for Dashboard Next Route
    $dashboardNextRoute: (route) => {
        Router.push(`/setup-dashboard/${route}`)
    },
    $newDashboardRoute: () => {
        Router.push(`/setup-dashboard`)
    },
    $isLpoMember: (roleId) => {
        // if(roleId==9){}
        return roleId == 9
    },
    $haveAccessToParalegal: (roleId) => {
        return accessToParalegal.some(item => item == roleId)
    },
    $haveAccessToIntake: (roleId) => {
        return accessToIntake.some(item => item == roleId)
    },
    $formatPhoneNumber2: function (str) {
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

    $formatNumberToUS: (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    },
    $needDisableInLawDelete: ( userJson, primaryUserId ) => {
        const relationshipTypeId = (userJson?.relationshipTypeId ?? userJson?.relationship_Type_Id) + "";
        const relativeUserId = userJson?.relativeUserId;

        return relativeUserId != primaryUserId && disableInLawDelete?.some(ele => ele.value == relationshipTypeId);
    },
    $forIncomewithDecimal:(value, defaultValue) => {
        // Check for undefined, null, or empty string
        if (value === undefined || value === null) {
            return defaultValue === undefined ? '0.00' : defaultValue;
        }
    
        // Convert value to a string
        value = String(value);
    
        // Trim whitespace and remove leading zeros
        value = value.trim().replace(/^0+(?!\.|$)/, '');
    
        // Split the value into integer and decimal parts
        const [integerPart, decimalPart] = value.split('.');
    
        // Handle cases with no decimal part
        if (!decimalPart) {
            return `${integerPart || '0'}.00`;
        }
    
        // Handle cases with one decimal digit
        if (decimalPart.length === 1) {
            return `${integerPart || '0'}.${decimalPart}0`;
        }
    
        // Return formatted value, limiting to two decimal places
        return `${integerPart || '0'}.${decimalPart.slice(0, 2)}`;
    },
    
    $oldDashboardRoute: () => {
        Router.push(`/dashboard`)
    },
    $ListsortingByString: function (arrData) {
        return arrData?.sort((a, b) => {
            if (a?.label < b?.label) return -1;
            if (a?.label > b?.label) return 1;
            return 0;
        })
    },
    $convertObjectToQueryString:(obj)=>{
        return Object.keys(obj)
            .map(key => `${key}=${encodeURIComponent(obj[key])}`)
            .join('&&');
    }
    ,
    $relationshipListsortingByString: (arrData) => {
        return arrData?.sort((a, b) => {
            if (a?.label < b?.label) return -1;
            if (a?.label > b?.label) return 1;
            return 0;
        })
    },
    $isUrlValid: (val) => {
        let testUrl = val;
        if (userInput) {
            testUrl = val.toLowerCase();
        }
        if (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(testUrl)) {
            return true;
        }
        return false
    },
    $isCheckNoDeceased: (val) => {
        if (val != deceaseMemberStatusId) {
            return true;
        }
        return false;
    },
    $isNotNullUndefine: (val) => {
        if (val !== undefined && val !== null && val !== '') {
            return true;
        }
        return false;
    },

    $isNullUndefine: (value) => {
        if (value === undefined || value === null || value === '' || value === 0) {
            return true;
        }
        return false
    },
    $objectvalidation: function (obj) {

        if (obj == undefined || obj == null || obj == "" || Object.keys(obj).length == 0) {
            return false
        } else {
            return true
        }
    },

    $isUpperCase: (val) => {
        if ($AHelper.$isNotNullUndefine(val) && !$AHelper.$isNumberRegex(val)) {
            return typeof val == 'string' ? val?.toUpperCase() : val;
        }
        return val;
    },
    $formatPhoneNumber2: function (str) {
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

    $loadAsyncScript: (src) => {
        // alert("jhghjgjhghjg")
        return new Promise((resolve) => {
            const script = document.createElement('script');
            Object.assign(script, {
                type: "text/javascript",
                async: true,
                src
            });
            script.addEventListener("load", () => resolve(script));
            document.head.appendChild(script);
        });
    },
    $initMapScript: () => {
        if (window.google) {
            return Promise.resolve();
        }
        const src = `https://maps.googleapis.com/maps/api/js?key=${'AIzaSyBaUn22pwovCzOxH7Uthivbd8_ScMkaEAI'}&libraries=places&v=weekly`;

        return $AHelper.$loadAsyncScript(src);
    },
    $formatNumber: (mobileNumber) => {
        const digitsOnly = mobileNumber?.replace(/\D/g, ''); // Remove all non-numeric characters
        let countryCode;
        let formattedNumber;

        if (digitsOnly?.startsWith('1')) {
            countryCode = '1';
            formattedNumber = digitsOnly.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+1 ($2) $3-$4');
            // Regex captures the country code (1), area code (3 digits), exchange code (3 digits), and subscriber number (4 digits)
            // Replacement pattern formats it as +1 (###) ###-####
        } else if (digitsOnly?.startsWith('91')) {
            countryCode = '91';
            formattedNumber = digitsOnly.replace(/(\d{2})(\d{5})(\d{5})/, '+$1-$2-$3');
            // Regex captures the country code (91), regional code (5 digits), and subscriber number (5 digits)
            // Replacement pattern formats it as +91-#####-#####
        } else{
            // countryCode = '254';
            formattedNumber = digitsOnly?.replace(/(\d{3})(\d{5})(\d{5})/, '+$1-$2-$3');
            // Regex captures the country code (91), regional code (5 digits), and subscriber number (5 digits)
            // Replacement pattern formats it as +91-#####-#####
        }

        return formattedNumber;
    },


    $isMarried: (val) => {
        if (val == 1 || val == 2) {
            return true;
        }
        return false
    },
    $isNumberRegex: (value) => {
        let regex = /^[0-9]*$/;
        return regex.test(value);
    },
    $isNumberWithCommas: (value) => {
        let regex = /^\d{1,3}(?:,\d{3})*$/;
        return regex.test(value);
    },
    $isNumberRegexWithDecimalUnder100: function (value) {
        // let regex = /[0-9].*$/;
        let regex = /^[0-9]{0,2}(\.[0-9]{0,2})?$/;
        return regex.test(value);
    },
    $isNumberRegexWithDecimal: function (value) {
        // let regex = /[0-9].*$/;
        let regex = /^[0-9]*(\.[0-9]{0,2})?$/;
        return regex.test(value);
    },
    $isValidateField: (field, key, msg, setState) => {
        if ($AHelper.$isNullUndefine(field)) {
            setState(prev => ({ ...prev, [key]: msg }));
            return false;
        } else {
            if (key == 'relationshipTypeId' && field == 1) {
                setState(prev => ({ ...prev, [key]: msg }));
                return false
            }
            setState(prev => ({ ...prev, [key]: '' }));
        }
        return true;
    },
    // checkIfMinorForMarriage: (dob, dom) => {
    //     if ((dob == null || dob == "") && (dom == "" || dom == null)) {
    //         return 0;
    //     }
    //     const d1 = new Date(dob);
    //     const d2 = new Date(dom);
    //     const timeDiff = Math.abs(d1.getTime() - d2.getTime());
    //     const ageDifference = Math.floor(timeDiff / (1000 * 3600 * 24 * 365.25));
    //     console.log("lhgkdhfdlksfhkdls",ageDifference,d1,d2)
    //     return ageDifference;
    // },
    checkIfMinorForMarriage: (dob, dom) => {
        if (!dob || !dom) return 0;
    
        const birthDate = new Date(dob);
        const marriageDate = new Date(dom);
    
        let age = marriageDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = marriageDate.getMonth() - birthDate.getMonth();
    
        // Adjust age if the birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && marriageDate.getDate() < birthDate.getDate())) {
            age--;
        } 
        return age;
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
    $getAge: (dob, dod) => {
        const birthDate = new Date(dob);
        const today = dod ? new Date(dod) : new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        console.log("age", age)
        return age;
    },
    $capitalizeAllLetters: function (string) {
        if (typeof string !== 'string') return string;
        return string.toUpperCase();
    },
    $capitalizeFirstLetter: function (string) {
         // return string ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : '';
         return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
    },
    capitalizeFirstLetterEachWord: function (string) { 
        if (typeof string !== 'string') return string;
        return string ? string?.split(' ')?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(' '): '';
    },    
    capitalizeFirstLetterFirstWord: function (string) { 
        if (typeof string !== 'string') {
            return string ; 
        }
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    capitalizeFirstLetter(input) {
        if (typeof input !== "string" || !input.trim()) {
          return ""; // Return an empty string for invalid input
        }
        
        const trimmedInput = input.trim();
        return trimmedInput.charAt(0).toUpperCase() + trimmedInput.slice(1).toLowerCase();
    },
    $scrollToElement: function(selector, delay = 100) {
        setTimeout(() => {
            document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, delay);
    },
    $IncludeDollars: function (balance) {
        return `$${Number(balance)?.toLocaleString("en-US", { style: "decimal", minimumFractionDigits: 2 })}`;
    },
    $fileUploadMaxSize: function (size) {
        if (size > 105906176) {
            return true;
        } else {
            return false;
        }
    },
    $fileSizeConvertInKb: function (bytes) {
        const kilobytes = bytes / 1024;
        return kilobytes?.toFixed(2);
    },
    $appendFormData: function (objData) {
        const formData = new FormData();
        for (const key in objData) {
            if (objData.hasOwnProperty(key) && $AHelper.$isNotNullUndefine(objData[key])) {
                formData.append(key, objData[key]);
            }
        }
        return formData;

    },
    $startsWithVowel: function (stringValue) {
        return vowels?.includes(stringValue?.[0]?.toLowerCase());
    },
    $RemoveFakeNames: function ( value, realName, replaceSpecificList ) {
        const fakeNames = replaceSpecificList ?? fakeNameList;
        const regexStr = RegExp(fakeNameList.join('|'), 'gi');

        return value?.replace(regexStr, realName);
    },
    $getFormattedDate: function (value) {
        return moment(value).format('MM-DD-YYYY')
    },
    $getYearFromDate: ( dateStr ) => {
        if($AHelper.$isNullUndefine(dateStr)) return null;
        const newDate = new Date(dateStr);
        // konsole.log("dsvnjkn-get", newDate, "|", dateStr, "|", newDate.getFullYear());
        return newDate.getFullYear();
    },
    $getDateFromYear: ( year ) => {
        if($AHelper.$isNullUndefine(year)) return "";
        return "01-01-" + year;
    },
    $isUrlValid: function (userInput) {
        const testurl = userInput?.toLowerCase();
        if (!testurl) return false;

        if (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(testurl)) {
            return true;
        } else {
            return false;
        }
    },
    $scroll2Top: function () {
        document.getElementsByClassName('Scroll2Top')?.[0]?.scrollIntoView({ behavior: 'smooth' });
    },
    IncludeDollars: function (balance) {
        return `$${Number(balance)?.toLocaleString("en-US", { style: "decimal", minimumFractionDigits: 2 })}`;
    },
    $calculate_age: (dob1) => {
        if (!dob1) return 0;
    
        let birthDate = new Date(dob1);
        let today = new Date();
    
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
    
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    
        return age;
    },
    // $sortOtherfromArray: (array) => {
    //     let sortedArray = array?.length > 0 ? [...array] : [];
    //     sortedArray.sort((a, b) => {
    //         if(a.value == '999999') return -1;
    //         if(b.value == '999999') return 1;
    //     })
    //     // console.log(sortedArray,"sortedArray")
    //     return sortedArray;
    // },

    $sortOtherfromArray: (array) => {
        let sortedArray = array?.length > 0 ? [...array] : [];
        sortedArray.sort((a, b) => {
            // First prioritize value '999999'
            if (a.value === '999999') return -1;
            if (b.value === '999999') return 1;
    
            // Then prioritize 'Other' label (case-insensitive)
            if (/^(other)$/i.test(a.label)) return -1;
            if (/^(other)$/i.test(b.label)) return 1;
    
            return 0;
        });
        return sortedArray;
    },
    
    $sortCountryfromArray: (array) => {
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
    },
      $isAnyIdOrNot : (value) => {
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidPattern.test(value);
    },
    $isNumberAndSpaceRegex: function (value) {
        let regex = /^[\d\s]{0,19}$/;
        return regex.test(value);
    },
    $isNumberAndSlash: function (date) {
        const regex = /^[0-9\/]*$/; // MM/YY format
        return regex.test(date);
    },
    $expiryDateValidationInput: (data) => {
        let value = data?.replace(/\D/g, ''); // Remove non-digit characters
      
        // Ensure month is between 01 and 12
        value = value?.replace(/^(\d{2})/, (match, month) => {
          if (parseInt(month) < 1 || parseInt(month) > 12) {
            return '0';
          }
          return month;
        });
      
        // Add slash after the second digit of the month
        value = value?.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
      
        // Remove slash if the last character being deleted is a slash
        value = value?.replace(/\/$/, '');
      
        // Truncate year to 2 digits
        value = value?.replace(/(\d{4})\d*/, '$1');
      
        return value; // Return the updated input value
    },
    $validateExpirationDate: (date) => {
        // Check if the date matches the mm/yy format
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!regex.test(date)) {
          return false;
        }
    
        // Check if the date is in the future
        const [month, year] = date?.split('/');
        const expirationDate = new Date(`20${year}`, month);
        const currentDate = new Date();
    
        return expirationDate > currentDate;
    },
    $formatCreditCardNumber: (value) => {
        const digitsOnly = value?.replace(/\D/g, '');
        const formattedValue = digitsOnly?.replace(/(\d{4}(?=\d))/g, '$1 ');
        return formattedValue;
    },
    $getFirstAndLastName: ( fullName ) => {
        if(!fullName) return "";
        
        fullName = fullName?.trim();
        const lastSpaceIndex = fullName?.lastIndexOf(" ");

        if(lastSpaceIndex == -1) return { firstName: fullName, lastName: fullName }

        const firstName = fullName?.substring(0, lastSpaceIndex).trim();
        const lastName = fullName?.substring(lastSpaceIndex + 1).trim();

        return { firstName, lastName };
    },
    $getCardCompany: ( cardNumber ) => {
        let cardType;
        let imgPath;
        let unformattedNum = cardNumber?.replaceAll(" ", "");

        if (/^4/.test(unformattedNum)) {
            cardType = 'Visa';
            imgPath = '/New/newIcons/card.png';
        } else if (/^5[1-5]/.test(unformattedNum)) {
            cardType = 'Mastercard';
            imgPath = '/New/newIcons/card.png';
        } else if (/^3[47]/.test(unformattedNum)) {
            cardType = 'Amex';
            imgPath = '/New/newIcons/card.png';
        } else if (/^(6011|65|64[4-9])/.test(unformattedNum)) {
            cardType = 'Discover';
            imgPath = '/New/newIcons/card.png';
        } else if (/^35/.test(unformattedNum)) {
            cardType = 'JCB';
            imgPath = '/New/newIcons/card.png';
        } else if (/^(30[0-5]|36|38)/.test(unformattedNum)) {
            cardType = 'Diners';
            imgPath = '/New/newIcons/card.png';
        } else {
            cardType = 'Card';
            imgPath = '/New/newIcons/card.png';
        }

        return { cardType, imgPath};
    },
    $getDateFormatted: ( dateNTime ) => {
        const _dateNTime = new Date(dateNTime)
        const month = _dateNTime.toLocaleString('default', { month: 'long' });
        const date = _dateNTime.getDate();
        const year = _dateNTime.getFullYear();

        return `${month} ${date}, ${year}`;
    },
    $isNumber: ( _value ) => {
        const toNumber = Number( _value );
        return (isNaN(toNumber) == false) && (toNumber != 0); 
    },
    $isNotallowspecialRegex: function (value) {
        let regex = /^[A-Za-z0-9 ]+$/;
        return regex.test(value);
    },
    $getFormattedDateForCE: function (value) {
        return moment(value).format('MM/DD/YYYY');
    },
    $getLastCharacter: (str, n) => {
        const newString = str.substring(str.length - n);
        return newString;
      },
    $getQueryParameters: function (urlQuery, name) {
        return new URLSearchParams(urlQuery).get(name);
    },
    $checkPasswordCriteria: ( passwordValue, setErrorState ) => {
        const islen8 = passwordValue?.length >= 8;
        const isUpperChar = /[A-Z]/.test(passwordValue);
        const isLowerChar = /[a-z]/.test(passwordValue);
        const isNum = /\d/.test(passwordValue);
        const isSpecialChar = /[!@#$%^&*()\[\]_\-+={}<>:;",.?~'`|\\\/]/.test(passwordValue);
        setErrorState({ islen8, isUpperChar, isalphaNum: ((isUpperChar || isLowerChar) && isNum), isSpecialChar });
    },









    //////////////////////////// address functions/////////////////////////////////
    $formateAddressLine1:(address,searchInput) => {
        if (!address || !searchInput?.current?.value || !address.unWanted?.length) return address;
    
        const curAddressLine1 = searchInput?.current?.value;
        const firstCommaIndex = curAddressLine1.indexOf(',');
        if (firstCommaIndex == -1) {
          address.unWanted = undefined;
          return address;
        }
    
        let secondPartString = " " + curAddressLine1?.slice(firstCommaIndex) + " ";
    
        for (let i = 0; i < address.unWanted.length; i++) {
          const searchWord = new RegExp(`( |,)(${address.unWanted[i]})( |,)`, "g");
          secondPartString = secondPartString?.replace(searchWord, " ");
        }
    
        let finalSecondPart = "";
        let lastChar = "";
        for (let i = 0; i < secondPartString.length; i++) {
          const curChar = secondPartString[i];
          if (curChar == " " || curChar == ",") {
            if (finalSecondPart.length == 0) continue;
            if (lastChar != " " && (lastChar != "," || curChar == " ")) finalSecondPart += curChar;
          } else {
            finalSecondPart += curChar;
          }
          lastChar = curChar;
        }
        if (finalSecondPart.length) {
          const lastIndexOfCom = finalSecondPart.lastIndexOf(",");
          if (finalSecondPart.length - lastIndexOfCom <= 2) finalSecondPart = finalSecondPart.slice(0, lastIndexOfCom);
          searchInput.current.value = finalSecondPart;
          address.addressLine1 = curAddressLine1.slice(0, firstCommaIndex) + ", " + finalSecondPart
        }
        else {
          searchInput.current.value = curAddressLine1
          address.addressLine1 = curAddressLine1.slice(0, firstCommaIndex)
        };
    
    
        address.unWanted = undefined;
        return address;
    },
    $createDynamicAddress : (addressTemplate) => {
        if (!isNotValidNullUndefile(addressTemplate)) return;
         const address = Object.keys(addressTemplate).reduce((acc, key) => {
          acc[key] = "";
          return acc;
        }, {});
    
        address.plain = function () {
          return Object.values(this)
            .filter(val => typeof val === "string" && val.trim() !== "")
            .join(", ");
        };
    
        return address;
    },
    $extractFields : (universaladdressFormates) => {
        if (Array.isArray(universaladdressFormates) && universaladdressFormates.length > 0) {
          return Object.entries(universaladdressFormates[0])
            .filter(([_, value]) => value && value.includes("{") && value.match(/\{\d+\}/)) // Only include fields with non-empty placeholders
            .map(([key, value]) => {
              const match = value.match(/(.*?)\s*\{(\d+)\}/); // Extract label & order
              return match
                ? { key, label: match[1], order: +match[2] }
                : { key, label: value, order: 99 };
            })
            .sort((a, b) => a.order - b.order); // Sort by order number
        }
        return []; // Return an empty array if the input is invalid
    },

    $initAutoComplete : (searchInput,setFormData,universaladdressFormate,dispatch) => {
        if (!searchInput.current.value) return;
        const autocomplete = new window.google.maps.places.Autocomplete(
          searchInput.current
        );
         
        let localDispatch = dispatch;
        if (!localDispatch && typeof useDispatch === "function") {
          localDispatch = useDispatch(); // Only works inside a React component
        }
        if (!localDispatch) return; // If dispatch is still missing, exit early
    




        autocomplete.setFields(["address_component", "geometry"]);
        autocomplete.addListener("place_changed", () =>
          $AHelper.$onChangeAddress(autocomplete,searchInput,setFormData,universaladdressFormate,localDispatch)
          
    
        );
    },
    $onChangeAddress : (autocomplete,searchInput,setFormData,universaladdressFormate,dispatch) => {
     
        const place = autocomplete.getPlace();
        const lat = place?.geometry?.location?.lat();
        const long = place?.geometry?.location?.lng();  
        const addFormate = universaladdressFormate
        $AHelper.$setAddress($AHelper.$extractAddress(place,addFormate),lat,long,searchInput,setFormData,dispatch);
    },
    $setAddress : async (address,lat,long,searchInput,setFormData,dispatch) => {
        // address = formateAddressLine1(address);
        address = $AHelper.$formateAddressLine1(address,searchInput);
        useLoader(true)
        if (!$AHelper.$isNotNullUndefine(address?.country)) {
          useLoader(false)
          return
        }
        const newData = await dispatch(fetchUniversalAddress(address?.country))
        useLoader(false)
        const initialFormData = Object.fromEntries($AHelper.$extractFields(newData?.payload).map(({ key }) => [key, ""]));
        setFormData(initialFormData);
        const updatedFormData = { ...initialFormData };
        Object.keys(updatedFormData).forEach(key => {
          if (address[key]) {
            updatedFormData[key] = address[key];  // Assign value from json2 if exists
          } else if (key === "zipcode" && address["zip"]) {
            updatedFormData[key] = address["zip"];  // Handle 'zip' -> 'zipcode' mapping
          }
        });
        updatedFormData["longitude"] = long
        updatedFormData["lattitude"] = lat
        setFormData(updatedFormData);
    
        if (address.state == 'New York' || address.state == 'Alaska') {
    
    
          //   setCountyRefrence(1)
        } else if (address.state == 'Louisiana') {
          //   setCountyRefrence(3)
        } else {
          //   setCountyRefrence(2)
        }
    
    
    },
    $extractAddress : (place,addFormate) => {
        if (!place.address_components) return {};
    
        if (addFormate.length < 0 && !$AHelper.$isNotNullUndefine(addFormate[0])) {
          return;
        }
        // const addressData = createDynamicAddress(universaladdressFormate[0])
        const addressData = $AHelper.$createDynamicAddress(addFormate[0])
        let postalCodeSuffix = "";
        let unWanted = ['USA', 'UK'];
        // Iterate through the address components and dynamically map them to fields
        place.address_components.forEach((component) => {
          const componentTypes = component.types;
          console.log("templates",component,addressData)
          componentTypes.forEach((type) => {
            switch (type) {
              case "street_number":
                (addressData || {}).street = component.long_name;
                unWanted.push(component.long_name, component.short_name);
                break;
              case "route":
                (addressData || {}).route = component.long_name;
                unWanted.push(component.long_name, component.short_name);
                break;
              case "locality":
                (addressData || {}).city = component.long_name;
                unWanted.push(component.long_name, component.short_name);
                break;
              case "administrative_area_level_1":
                // Check if it's a city or state based on context
                if (component.long_name.includes("City")) {
                    (addressData || {}).city = component.long_name; // Taiwan cities like 'Taichung City'
                  unWanted.push(component.long_name, component.short_name);
                } else {
                    (addressData || {}).state = component.long_name; // Else, treat it as state
                    (addressData || {}).province = component.long_name; 
                    (addressData || {}).region = component.long_name;
                  unWanted.push(component.long_name, component.short_name);
                }
                break;
              case "administrative_area_level_2":
                (addressData || {}).district = component.long_name;
                unWanted.push(component.long_name, component.short_name);
                break;
              case "country":
                (addressData || {}).country = component.long_name;
                unWanted.push(component.long_name, component.short_name);
                break;
              case "postal_code":
                (addressData || {}).zip = component.long_name;
                unWanted.push(component.long_name, component.short_name);
                break;
              case "sublocality_level_1":
                (addressData || {}).county = component.long_name;
                unWanted.push(component.long_name, component.short_name);
                break;
              case "political":
                (addressData || {}).political = component.long_name;
                unWanted.push(component.long_name, component.short_name);
                break;
              case "administrative_area_level_3":
                // addressData.addressLine2 = component.long_name;
                // unWanted.push(component.long_name, component.short_name);
                break;
              case 'sublocality':
                (addressData || {}).addressLine3 = component.long_name;
                break;
              case 'postal_code_suffix':
                postalCodeSuffix = component.long_name;
                unWanted.push(component.long_name, component.short_name);
                break;
              default:
                break;
            }
          });
        });
    
    
        if (postalCodeSuffix) addressData.zip += '-' + postalCodeSuffix;
        unWanted.push(addressData.zip);
        (addressData || {}).unWanted = unWanted;
        
        return addressData; // Return dynamically populated address object
    },
 
    $extractMandatoryFields: (data) => {
        return Object.entries(data)
            .filter(([key, value]) => typeof value === 'string' && value.includes("[*]"))
            .map(([key, value]) => ({
                key,
                value: value.replace(/\{\d+\}\[\*\]/g, "").trim() // Removes {1}[*] and similar placeholders
            }));
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







}

