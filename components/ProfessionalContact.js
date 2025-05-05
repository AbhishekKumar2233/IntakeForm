import React, { useContext, useEffect, useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { $CommonServiceFn } from './network/Service';
import { $Service_Url } from './network/UrlPath';
import { Col, Form, Row } from 'react-bootstrap';
import PhoneInput from "react-phone-input-2";
import konsole from './control/Konsole';
import { globalContext } from '../pages/_app';
import { isNotValidNullUndefile } from './Reusable/ReusableCom';

function ProfessionalContact(props, ref) {

    const initialOBJ = ( oldState, _contactTypeId = 1 ) => {
        return { contactTypeId: _contactTypeId, emailId: "", mobileNo: "", commTypeId: 1, dialCode: "", contactId: "",  createdBy: loginUserId, updatedBy: loginUserId  }
    }

    konsole.log('propsvalue', props)
    const { setdata, confirm } = useContext(globalContext);
    const [userId, setUserId] = useState("");
    const loginUserId = sessionStorage.getItem("loggedUserId");
    const [mobileObj, setMobileObj] = useState(initialOBJ);
    const [emailObj, setEmailObj] = useState(initialOBJ);
    const [mobileList, setmobileList] = useState([]);
    const [emailList, setemailList] = useState([]);
    const [deletedContactIds, setdeletedContactIds] = useState([]);
    const [commTypeList, setCommTypeList] = useState([]);
    const [activityTypeId, setactivityTypeId] = useState('4')
    const [disableCountryGuessState, setdisableCountryGuessState] = useState(true);
    const [countryCode, setcountryCode] = useState("+1");
    const mobileRef = useRef(null)
    const emailRef = useRef(null)
    const mobileAddDisable = (mobileObj.contactTypeId == -1);
    const emailAddDisable = (emailObj.contactTypeId == -1);

    useImperativeHandle(ref, () => ({
        checkvalidation, saveContactinfo
    }))

    konsole.log("userIduserId", userId)
    useEffect(() => {
        setUserId(props?.userId)
        getcontactdeailswithOthger(props?.userId)
    }, [props.userId])

    useEffect(() => {
        getCommTypeList();
    }, []);

    const getcontactdeailswithOthger = (userId) => {
        konsole.log("USERIDUSERID", userId)
        if(!userId) return;
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getcontactdeailswithOther + userId, "", (response, error) => {
            if (response) {
                konsole.log("getcontactdeailswithOtherres", response)
                let contactdetails = response?.data?.data?.contact
                let emaillObjj = contactdetails?.emails
                let mobileObjj = contactdetails?.mobiles
                removeDuplicateAndSetState("mobile", mobileObjj);
                removeDuplicateAndSetState("email", emaillObjj);
                konsole.log("mobileObjemaillObj", emaillObjj, mobileObjj)
            } else {
                konsole.log("getcontactdeailswithOthererr", response)
            }
        })
    }

    const getCommTypeList = () => {
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getNumberType, "", (response, error) => {
            if (response) {
                konsole.log("commTypeId", response.data.data);
                setCommTypeList(response.data.data);
            }
            else { }
        });
    }

    const handleMobileChange = (key, value) => {
        setMobileObj((prev) => { return { ...prev, [key]: value } });
    }

    const handleEmailChange = (key, value) => {
        setEmailObj((prev) => { return { ...prev, [key]: value } });
    }

    const handleMobileObj = (event) => {
        const eventName = event.target.name;
        const eventValue = event.target.value;

        konsole.log("checkBox", eventName, eventValue);
        return setMobileObj((prev) => {
            konsole.log("checkbox 2", { ...prev, [eventName]: eventValue });
            return { ...prev, [eventName]: eventValue };
        });
    }

    const mapCommType = commTypeList.length > 0 && commTypeList.map((items, index) => {
        konsole.log(mobileObj.commTypeId === Number(items?.value), "checked CommType", mobileObj);
        return <Form.Check inline className="left-radio fs-6" type="radio" name="commTypeId" label={items?.label} value={items?.value}
            onChange={handleMobileObj} checked={parseInt(mobileObj.commTypeId) === parseInt(items?.value)} />;
    });

    const handleOnChange = (value, data, event, formattedValue) => {
        setdisableCountryGuessState(true);
        konsole.log("handleOnChange", value, value.slice(data.dialCode.length), data, formattedValue);
        setcountryCode(data.dialCode);
        setMobileObj((prev) => {
            return { ...prev, validateMobileNo: value.slice(data.dialCode.length), mobileNo: `+${value}`, dialCode: data.dialCode };
        });
    }


    konsole.log("mobileObjemailObj", mobileObj, emailObj)

    const checkvalidation = ( isInputEmpty ) => {
        if (!mobileList?.length && !emailList?.length) {
            toasterAlert("Please provide contact no. or email");
            return true;
        }
        return false;
    }

    const findSmalMisConTypeId = ( listOfObj ) => {
        return [1,2,3,4,5].find(numEle => listOfObj.some(objEle => objEle.contactTypeId == numEle) != true) || -1;
    }

    const removeDuplicateAndSetState = ( categoryType, contactList) => {
        let hashMap = {};
        contactList.forEach(el => hashMap[el.contactTypeId] = el);
        let finalContactList = Object.values(hashMap);
        konsole.log("bwvb", Object.values(hashMap))
        const newContactTypeId = findSmalMisConTypeId(finalContactList);

        if(categoryType == "mobile") {
            setMobileObj(() => initialOBJ({}, newContactTypeId));
            setmobileList(finalContactList)
        } else {
            setEmailObj(() => initialOBJ({}, newContactTypeId));
            setemailList(finalContactList)
        }
    }

    const handleAddContact = ( categoryType ) => {
        if(categoryType == "mobile") {
            if(!mobileObj?.mobileNo?.length || mobileObj?.mobileNo?.length < 5) {
                toasterAlert("Please enter contact no. to add");
                return
            }
            if(mobileList?.some(el => (el.mobileNo == mobileObj.mobileNo) && (el.contactTypeId != mobileObj.contactTypeId))) {
                toasterAlert("Duplicate contact no. not allowed");
                setMobileObj(oldState => ({...oldState, mobileNo: countryCode}))
                return
            }
            setmobileList(oldState => {
                let newMobileList = oldState;
                const indexOfEdited = newMobileList.findIndex(el => el.contactTypeId == mobileObj.contactTypeId);

                if(indexOfEdited != -1) {
                    newMobileList[indexOfEdited] = mobileObj;
                } else {
                    newMobileList.push(mobileObj);
                }

                const newContactTypeId = findSmalMisConTypeId(newMobileList);
                setMobileObj(() => initialOBJ({}, newContactTypeId));
                setdisableCountryGuessState(false)

                konsole.log("profCont_bsjvb", newContactTypeId)
                return newMobileList;
            })
        } else {
            if(isNotValidNullUndefile(emailObj?.emailId) != true) {
                toasterAlert("Please enter email address to add");
                return
            }
            if(emailList?.some(el => (el.emailId == emailObj.emailId) && (el.contactTypeId != emailObj.contactTypeId))) {
                toasterAlert("Duplicate Email Id is not allowed");
                setEmailObj(oldState => ({...oldState, emailId: ""}))
                return
            }
            setemailList(oldState => {
                const newEmailList = oldState;
                const indexOfEdited = newEmailList.findIndex(el => el.contactTypeId == emailObj.contactTypeId);

                if(indexOfEdited != -1) {
                    newEmailList[indexOfEdited] = emailObj;
                } else {
                    newEmailList.push(emailObj);
                }

                const newContactTypeId = findSmalMisConTypeId(newEmailList);
                setEmailObj(() => initialOBJ({}, newContactTypeId));
                
                konsole.log("profCont_bsjvb", newContactTypeId)
                return newEmailList;
            })
        }
    }

    const getFinalContact = ( type ) => {
        if(type == "mobile") {
            if(mobileObj?.mobileNo?.length < 5) return mobileList;

            let newMobileList = mobileList;
            const indexOfEdited = newMobileList.findIndex(el => el.contactTypeId == mobileObj.contactTypeId);

            if(indexOfEdited != -1) {
                newMobileList[indexOfEdited] = mobileObj;
            } else {
                newMobileList.push(mobileObj);
            }

            const newContactTypeId = findSmalMisConTypeId(newMobileList);
            setMobileObj(() => initialOBJ({}, newContactTypeId));
            setdisableCountryGuessState(false)

            konsole.log("profCont_bsjvb", newContactTypeId)
            return newMobileList;
        } else {
            if(isNotValidNullUndefile(emailObj?.emailId) != true) return emailList;

            let newEmailList = emailList;
            const indexOfEdited = newEmailList.findIndex(el => el.contactTypeId == emailObj.contactTypeId);

            if(indexOfEdited != -1) {
                newEmailList[indexOfEdited] = emailObj;
            } else {
                newEmailList.push(emailObj);
            }

            const newContactTypeId = findSmalMisConTypeId(newEmailList);
            setEmailObj(() => initialOBJ({}, newContactTypeId));
            
            konsole.log("profCont_bsjvb", newContactTypeId)
            return newEmailList;
        }
    }

    const onEditClick = async ( categoryType, editType, contactObj ) => {
        if(categoryType == "mobile") {
            if(editType == "edit") {
                setdisableCountryGuessState(false);
                setMobileObj(contactObj)
                konsole.log("sdbvhjbs", mobileRef)
                mobileRef.current.numberInputRef.focus();
            } else {
                let userRes = await confirm(true, "Are you sure? You want to delete this Contact.", "Confirmation");
                if(userRes == false) return 

                let newMobileList = mobileList.filter(el => el.contactTypeId != contactObj.contactTypeId);
                
                const newContactTypeId = findSmalMisConTypeId(newMobileList);
                setMobileObj(() => initialOBJ({}, newContactTypeId));
                
                setmobileList(newMobileList);
                if(contactObj?.contactId) setdeletedContactIds(oldState => [...oldState, contactObj.contactId])
            }
        } else {
            if(editType == "edit") {
                setdisableCountryGuessState(false);
                setEmailObj(contactObj)
                emailRef.current.focus()
            } else {
                let userRes = await confirm(true, "Are you sure? You want to delete this Contact.", "Confirmation");
                if(userRes == false) return 

                let newEmailList = emailList.filter(el => el.contactTypeId != contactObj.contactTypeId);
                
                const newContactTypeId = findSmalMisConTypeId(newEmailList);
                setEmailObj(() => initialOBJ({}, newContactTypeId));
                
                setemailList(newEmailList);
                if(contactObj?.contactId) setdeletedContactIds(oldState => [...oldState, contactObj.contactId])
            }
        }
    }

    async function saveContactinfo(userId) {
        konsole.log("esfhquevjb", userId, mobileList, emailList)
        if(!userId) return;

        const _mobileList = getFinalContact("mobile");
        const _emailList = getFinalContact("email");

        let mobiles2Post = _mobileList?.filter(el => el.contactId == "")
        let emails2Post = _emailList?.filter(el => el.contactId == "")
        let mobiles2Put = _mobileList?.filter(el => el.contactId != "")
        let emails2Put = _emailList?.filter(el => el.contactId != "")

        if(mobiles2Post?.length || emails2Post?.length) {
            let jsonobj = {
                "userId": userId,
                "activityTypeId": activityTypeId,
                "contact" : {}
            }
            if(mobiles2Post?.length) jsonobj["contact"]['mobiles'] = mobiles2Post;
            if(emails2Post?.length) jsonobj["contact"]['emails'] = emails2Post;

            apifuncall("POST", $Service_Url.postAddContactWithOther, jsonobj);
        }

        if(mobiles2Put?.length || emails2Put?.length) {
            mobiles2Put?.forEach(el => el["updatedBy"] = loginUserId)
            emails2Put?.forEach(el => el["updatedBy"] = loginUserId)
            let jsonobj = {
                "userId": userId,
                "activityTypeId": activityTypeId,
                "contact": {}
            }
            if(mobiles2Put?.length) jsonobj["contact"]['mobiles'] = mobiles2Put;
            if(emails2Put?.length) jsonobj["contact"]['emails'] = emails2Put;

            apifuncall("PUT", $Service_Url.updateContactWithOtherDetailsPath, jsonobj);
        }

        if(deletedContactIds?.length) {
            deletedContactIds.forEach(el => handleDelete(el));
        }
    }

    async function apifuncall(method, url, json) {
        konsole.log("apifuncalljson", method, url, json, JSON.stringify(json))
        return new Promise((resolve, reject) => {
            $CommonServiceFn.InvokeCommonApi(method, url, json, (res, err) => {
                if (res) {
                    konsole.log("apifuncallres", res)
                    resolve('response', res)
                } else {
                    konsole.log("apifuncallerr", err)
                    resolve('reject', err)
                }
            })

        })
    }

    const handleDelete = async ( contactId ) => {
        if(!contactId) return;
        const json = {
            "userId": userId,
            "contactId": contactId,
            "deletedBy": loginUserId
        }
        $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteContactPath, json, (response) => {
            konsole.log(response);
        });
    }

    konsole.log("mobileObjmobileObjmobileObj", mobileObj)

    return (
        <Row className='border p-2 rounded' >
            <Row>
                <Col className={props.fromModal == "proServiceProvider" ? "" : "fs-5 ms-2"} style={{fontSize: `19px`}}>
                    Contact Information
                </Col>
            </Row>
            <Row className='d-flex align-items-end '>
                <Col xs="12" sm="12" md="12" lg="6" className='p-0 phoneNum position-relative'>
                    {/* {mobileList.length == 5 && <div className='disabled-div position-absolute h-100 w-100'></div>} */}
                    <div className={`my-2 ms-3 ${mobileAddDisable ? "disabler" : ""}`}>  {mapCommType}</div>
                    <div className='d-flex align-items-center justify-content-between' style={{margin: '10px 0px'}}>
                        <Col xs={10} className='p-0 m-0'>
                            {/* <PhoneInput ref={mobileRef} className={`react-tel-input ${mobileAddDisable ? "disabler" : ""}`} regions={["america", "europe", "asia", "oceania", "africa"]} country="us" preferredCountries={["us"]} value={mobileObj.mobileNo || "+1"} onChange={handleOnChange} specialOptionLabel={"Other"} placeholder="" name="mobileNo" onBlur={() => validateContact("mobile")} countryCodeEditable={false} disableCountryGuess={disableCountryGuessState} /> */}
                            <PhoneInput 
                            ref={mobileRef} 
                            className={`react-tel-input ${mobileAddDisable ? "disabler" : ""}`} 
                            regions={["america", "europe", "asia", "oceania", "africa"]} 
                            country="us" 
                            preferredCountries={["us"]} 
                            value={mobileObj.mobileNo || "+1"} 
                            onChange={handleOnChange} 
                            specialOptionLabel={"Other"} 
                            placeholder="" 
                            name="mobileNo" 
                            onBlur={() => validateContact("mobile")} 
                            countryCodeEditable={false} 
                            disableCountryGuess={disableCountryGuessState} />
                        </Col>
                        <Col xs={2} className={`p-0 m-0 text-center ${mobileAddDisable ? "disabler" : ""}`}>
                            <img className='m-0 cursor-pointer ' type="submit" src='/icons/add-icon.svg' alt='add mobile number' title='Add Contact Number' onClick={() => handleAddContact("mobile")} />
                        </Col>
                    </div>
                </Col>
                <Col xs="12" sm="12" md="12" lg="6" className='p-0 phoneNum position-relative'>
                    <div className='d-flex align-items-center justify-content-between' style={{margin: '10px 0px'}}>
                        <Col xs={10} className={`p-0 m-0 ${emailAddDisable ? "disabler" : ""}`}>
                            <Form.Control ref={emailRef} value={emailObj.emailId} className='react-tel-input' style={{height: '30px'}} onChange={(e) => handleEmailChange("emailId", e.target.value)} name="emailId" type="email" placeholder='Email' onBlur={() => validateContact("email")} />
                        </Col>
                        <Col xs={2} className={`p-0 m-0 text-center ${emailAddDisable ? "disabler" : ""}`}>
                            <img className='m-0 cursor-pointer' src='/icons/add-icon.svg' alt='add email id' title='Add Email Id' onClick={() => handleAddContact("email", emailObj)} />
                        </Col>
                    </div>
                </Col>
            </Row>
            <Row className='d-flex align-items-start'>
                <Col xs="12" sm="12" md="12" lg="6"  className='p-0'>
                    {mobileList?.map((ele, index) => { return <div key={ele.mobileNo} className='d-flex justify-content-between '>
                        <div className='col-10 text-break newContactDiv2'>
                            {PhoneFormat(ele.mobileNo)[0]}
                        </div>
                        <div className='col cursor-pointer text-center d-flex justify-content-center align-items-center' onClick={() => onEditClick("mobile", "edit", ele)}><img className='m-0' src='/icons/blackEditIconProfessional.svg' alt='edit contact' title='Edit Contact Number' /></div>
                        {index != 0 && <div className='col-1 cursor-pointer text-center d-flex justify-content-center align-items-center' onClick={() => onEditClick("mobile", "delete", ele)}><img className='m-0' style={{width: '20px'}} src='/icons/deleteBlack.svg' alt='delete contact' title='Delete Contact Number'  /></div>}
                    </div>})}
                </Col>
                <Col xs="12" sm="12" md="12" lg="6" className='mt-0 p-0 '>
                    {emailList?.map((ele, index) => { return <div key={ele.emailId} className='d-flex justify-content-between '>
                        <div className='col-10 text-break newContactDiv2'>
                            {ele.emailId}
                        </div>
                        <div className='col cursor-pointer text-center d-flex justify-content-center align-items-center' onClick={() => onEditClick("email", "edit", ele)}><img className='m-0' src='/icons/blackEditIconProfessional.svg' alt='edit contact' title='Edit Email Id' /></div>
                        {index != 0 && <div className='col-1 cursor-pointer text-center d-flex justify-content-center align-items-center' onClick={() => onEditClick("email", "delete", ele)}><img className='m-0' style={{width: '20px'}} src='/icons/deleteBlack.svg' alt='delete contact' title='Delete Email Id' /></div>}
                    </div>})}
                </Col>
            </Row>
        </Row>
    );

    function validateContact(typeofSave) {
        let regexName = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        switch (typeofSave) {
            case "email":
                if (emailObj.emailId !== "" && !regexName.test(emailObj.emailId)) {
                    handleEmailChange("emailId", "");
                    toasterAlert("Enter the valid email address");
                    break;
                }
                else if(emailList?.some(el => (el.emailId == emailObj.emailId) && (el.contactTypeId != emailObj.contactTypeId))) {
                    toasterAlert("Duplicate Email Id is  not allowed");
                    setEmailObj(oldState => ({...oldState, emailId: ""}))
                }
                break;
                case "mobile": {
                if (mobileObj?.validateMobileNo !== "" && ((mobileObj?.validateMobileNo?.length < 10 && mobileObj?.dialCode!=254) || (mobileObj?.validateMobileNo?.length < 9 && mobileObj?.dialCode==254))) {
                    handleMobileChange("mobileNo", countryCode);
                    handleMobileChange("validateMobileNo", "");
                    toasterAlert("Enter the valid contact no.");
                }
                else if(mobileList?.some(el => (el?.mobileNo == mobileObj?.mobileNo) && (el?.contactTypeId != mobileObj?.contactTypeId))) {
                    toasterAlert("Duplicate contact no. not allowed");
                    setMobileObj(oldState => ({...oldState, mobileNo: countryCode}))
                }
                break;
            }
        }
    }

    function toasterAlert(text, type) {
        setdata({ open: true, text: text, type: "Warning" });
    }

    function contactSubmit() {
        // Your code for handling contact submission
    }
}


export default forwardRef(ProfessionalContact)

const  PhoneFormat = (value) => {
    if(value?.length < 10) return "Not Provided";
    // konsole.log("pjoneFormateData", value?.split(","));
    let phoneArray = value?.split(",");
    const newArr = [];
    for (let i = 0; i < phoneArray?.length; i++) {
        let phoneNumber = phoneArray[i]
        let cleaned = ("" + phoneNumber).replace(/\D/g, "");
        // console.log("cleanfdf",cleaned?.startsWith("254"))  
        if(cleaned?.startsWith("254")){
            let fornum = `+254 ${cleaned?.slice(3,6)+" "+cleaned?.slice(6,9)+" "+cleaned?.slice(9)}`;
            newArr.push(fornum);
          }
          else
          {
            let contactNumber=cleaned?.slice(-10)
            let match = contactNumber?.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                let fornum = `${phoneNumber.startsWith("+91")?"+91":"+1"} ${"(" + match[1] + ") " + match[2] + "-" + match[3]}`;
                newArr.push(fornum);
            }  
        }
    return newArr;
    }
}
