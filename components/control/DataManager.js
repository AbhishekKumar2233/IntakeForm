// // import cryptoJs from "crypto-js";
// import konsole from "./Konsole";




// const appState = 'appState';
// const AuthToken = 'AuthToken';
// const loggedUserId = 'loggedUserId';
// const userLoggedInDetail = 'userLoggedInDetail';
// const userDetailOfPrimary = 'userDetailOfPrimary';
// const spouseUserId = 'spouseUserId';
// const roleUserId = 'roleUserId';
// const SessPrimaryUserId = 'SessPrimaryUserId'



// const getLocalStorage = (key) => {
//     return localStorage.getItem(key);
// }

// const setLocalStorage = (key, value) => {
//     localStorage.setItem(key, value);
// }

// const setEncryptId = (value) => {
//     setLocalStorage("ID", value);
//     konsole.decor("data Manager set");
// }

// const getEncryptData = (key) => {
//     if (key == null || key == "") {
//         return;
//     }
//     let appState = getLocalStorage("ID");
//     let addDecryptKey = key + appState;
//     let decryptkey = window.btoa(addDecryptKey);
//     let localValue = getLocalStorage(decryptkey);
//     let decrypt = cryptoJs.AES.decrypt(localValue, appState);
//     let decryptedData = JSON.parse(decrypt.toString(cryptoJs.enc.Utf8));
//     return decryptedData;

// }


// const setEncryptData = (key, value) => {

//     let appState = getLocalStorage("ID");
//     let addEncryptKey = key + appState;
//     let encryptKey = window.btoa(addEncryptKey);
//     let encryptValue = cryptoJs.AES.encrypt(JSON.stringify(value), appState).toString();
//     konsole.decor("data Manager set");
//     setLocalStorage(encryptKey, encryptValue);
// }

// const DataManager = {
//     getEncryptData,
//     setEncryptData,
//     setEncryptId,

// }

// export default DataManager
