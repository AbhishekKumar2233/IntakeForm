import React, { useEffect, useMemo, useState, useContext } from 'react'
import { Button, Row, Col, Popover, Tooltip, OverlayTrigger, Container, Breadcrumb, Navbar } from 'react-bootstrap';
import konsole from '../components/control/Konsole';
import { $CommonServiceFn } from '../components/network/Service';
import Layout from '../components/layout'
import { mapSocialInviterJsonIntoArray, mapSocialInviterUpsertJsonIntoArray, Contactlicence } from '../components/control/Constant';
import { $Service_Url } from '../components/network/UrlPath';
import { SET_LOADER } from '../components/Store/Actions/action';
import { connect } from 'react-redux';
import Modal from "react-bootstrap/Modal";
import AlertToaster from "../components/control/AlertToaster";
import { globalContext } from "../pages/_app";
import AppleLogin from '../components/AppleLogin';
import WarningAlert from '../components/WarningAlert';


function import_contact(props) {

    const [importContactList, setImportContactList] = useState({});
    const [memberUserId, setMemberUserId] = useState("");
    const [loggedUserId, setLoggedUserId] = useState("");
    const [showContactList, manageShowContactList] = useState(false)
    const [tooltipText, setTooltipText] = useState("");
    const [searchText, setSearchText] = useState("");
    const [allContactJson, setAllContactJson] = useState({});
    const [SubtenantId, setSubtenantId] = useState(null)
    const [showpreviewmodal, setShowpreviewmodal] = useState(false)
    const [comChannelId, setComchannelId] = useState(null)
    const [emailtemp, setemailtemp] = useState("");
    const [texttemp, settexttemp] = useState();
    const [allUser, setallUser] = useState(null)
    const [emailTemplate, setEmailTemplate] = useState(null)
    const [textData, setText] = useState(null)
    const [occurenceData, setOccurenceData] = useState(null)
    const [birthDay, setBirthDay] = useState(null)
    const [selectInput, setselectInput] = useState(false)
    const { setNotifyMessageCount, isBool, setIsbool } = useContext(globalContext);
    const [usersNotified, setUsersNotified] = useState([])
    const [isChecked, setIsChecked] = useState(false)
    const [extraState, setExtraState] = useState(false)
    const [appleModal, setAppleModal] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false);
    const [loginError, setLoginError] = useState("")
    const [selectCategoryOption, setSelectCategoryOption] = useState(null)
    const [contatcLess, setContatcLess] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [msg, setMsg] = useState("")
    const context = useContext(globalContext);

    useEffect(() => {
        const memberUserId = sessionStorage.getItem("SessPrimaryUserId");
        const loggedUserId = sessionStorage.getItem("loggedUserId");
        const SubtenantId = sessionStorage.getItem("SubtenantId");
        const socialType = sessionStorage.getItem("service")
        let socialTypeId = socialType !== undefined ? (socialType == "apple" ? "3" : socialType == "outlook" ? "2" : "1")  : (undefined)
        setSubtenantId(SubtenantId)
        setMemberUserId(memberUserId);
        setLoggedUserId(loggedUserId);
        getContactByMemberUserId(memberUserId,socialTypeId)
        props.dispatchloader(true)
        getSocialPersonType()
    }, [])

    const handleButtonClick = () => {
        setShowTooltip(false);
        // Add your logic to handle the button click action here
    };

    const getContactByMemberUserId = (memberUserId, socialType) => {
        props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUpsertetContact + `?memberUserId=${memberUserId}&socialType=${socialType ? socialType : "1"}`, "", (response, error) => {
            if (response) {
                const responseAddressBook = response.data.data;
                
                sessionStorage.setItem("service", responseAddressBook?.socialType);
                let urlParams = new URLSearchParams(window.location.search);
                let code = urlParams.get('code');
                konsole.log("code", code);
                const session = sessionStorage.getItem("session");
                setImportContactList(responseAddressBook);
                setContatcLess(false)
                props.dispatchloader(false)
                if (code !== null && code !== "" && socialType !== "3") {
                    getTokenFromSession(session, code, responseAddressBook);
                } else {
                    manageShowContactList(true);
                }
            }
            else if (error) {
                setContatcLess(true)
                setAllContactJson({})
                setImportContactList({})
                manageShowContactList(false);
                props.dispatchloader(false)
                let urlParams = new URLSearchParams(window.location.search);
                let code = urlParams.get('code');
                konsole.log("code", code);
                const session = sessionStorage.getItem("session");
                if (code !== null && code !== "" && socialType != "3") {
                    getTokenFromSession(session, code, {});
                }
                // else{
                //     setAppleModal(true)
                // }
            }
        }
        );
    }
    const getSocialPersonType = () => {
        props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getSocialPersonType, "", (response, error) => {
            if (response) {
                setSelectCategoryOption(response?.data?.data)

            }
            else if (error) {

            }
        }
        );
    }
    const appleContact = (email, password) => {
        if (email != "" && password != "") {
            // setAppleID(email)
            // setApplePassword(password)
            getSesssionWithLicence("apple", email, password)
        }


    }
    function getSesssionWithLicence(services, email, password) {
        sessionStorage.setItem("service", services);
        props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonSocialInviterApi("GET", `https://api.socialinviter.com/api/v2/session?license=${Contactlicence}`, "", "", (response, error) => {
            if (response) {
                props.dispatchloader(false)
                konsole.log("license key session", response.data.data);
                const sessionKey = response.data.data.session;
                sessionStorage.setItem("session", sessionKey);
                if (email != "" && password != "" && services == "apple") {
                    getTokenFromSessionForApple(sessionKey, services, email, password);
                } else {
                    getAuthWithSession(sessionKey, services);
                }

            } else {
                // AlertToaster.error("Something went wrong");
                props.dispatchloader(false)
            }
        })
    }

    function getAuthWithSession(session, services) {
        props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonSocialInviterApi("GET", `https://api.socialinviter.com/api/v2/auth?service=${services}`, "", { session }, (response, error) => {
            if (response) {
                props.dispatchloader(false)
                const authUrl = response.data.data.authurl;
                // window.location.replace(authUrl+"&prompt=select_account");
                window.location.replace(`${authUrl}${services == "google" || services == "outlook" ? "&prompt=select_account" : ""}`);


            } else {
                props.dispatchloader(false)
                // AlertToaster.error("Something went wrong");
            }
        })
    }

    function getTokenFromSession(session, code, importContactList) {
        const servicee = sessionStorage.getItem("service");
        const body = { servicee, code }

        let form = new FormData();
        form.append("service", servicee);
        form.append("code", code);
        props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonSocialInviterApi("POST", `https://api.socialinviter.com/api/v2/accesstoken`, form, { session, "content-type": "application/x-www-form-urlencoded" }, (response, error) => {
            if (response) {
                props.dispatchloader(false)

                konsole.log("token through ", response.data.data);
                getContactByUserId(session, response.data.data, importContactList)
            }
            else if (error) {

                props.dispatchloader(false)
                konsole.log("token through ", error);
                const errorData = error.data.status;
                const { key, type } = errorData;
                if (type === "error" && key !== "invalid_session") {
                    // AlertToaster.error("Something went wrong");
                }
                // if (type === "error" && key === "access_token_fetch_error") {
                manageShowContactList(true);
                // }
            }
        })
    }
    function getTokenFromSessionForApple(session, importContactList, email, password) {
        const servicee = sessionStorage.getItem("service");
        const body = { servicee }
        let form = new FormData();
        form.append("service", servicee);
        form.append("email", email);
        form.append("password", password);
        props.dispatchloader(true)

        $CommonServiceFn.InvokeCommonSocialInviterApi("POST", `https://api.socialinviter.com/api/v2/accesstoken`, form, { session, "content-type": "application/x-www-form-urlencoded" }, (response, error) => {
            if (response) {
                props.dispatchloader(false)

                konsole.log("token through ", response.data.data);
                setLoginError("")
                getContactByUserId(session, response.data.data, importContactList)
            }
            else if (error) {

                props.dispatchloader(false)
                konsole.log("token through ", error);
                const errorData = error.data.status;
                const { key, type } = errorData;
                if (type === "error" && key === "invalid_login_credentials") {
                    // AlertToaster.error("Wrong Apple Id or Password");
                    setLoginError("Wrong Apple Id or Password")
                }
                manageShowContactList(true);
                // }
            }
        })
    }

    function getContactByUserId(session, { userid, service, token }, importContactList) {
        let form = new FormData();
        form.append("service", service);
        form.append("token", token);
        form.append("userid", userid);

        const memberUserId = sessionStorage.getItem("SessPrimaryUserId");
        const loggedUserId = sessionStorage.getItem("loggedUserId");
        props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonSocialInviterApi("POST", `https://api.socialinviter.com/api/v2/contacts`, form, { session, "content-type": "application/x-www-form-urlencoded" }, (response, error) => {
            if (response) {
                props.dispatchloader(false)
                setAppleModal(false)
                const addressbook = response.data.data.addressbook;

                let mappedAddressBook = mapSocialInviterJsonIntoArray(service, memberUserId, loggedUserId, addressbook);
           
                if (service == "apple" || service == "outlook") {
                    props.dispatchloader(true)
                    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUpsertetContact + `?memberUserId=${memberUserId}&socialType=${service == "apple" ? "3" : "2"}`, "", (response, error) => {
                        if (response) {
                            props.dispatchloader(false)
                            const responseAddressBook = response.data.data;
                            if (responseAddressBook?.socialPersonList !== undefined) {
                                const importContactListList = responseAddressBook?.socialPersonList !== undefined ? responseAddressBook.socialPersonList : [];
                       
                                if(importContactListList.length > 0){
                                    setShowModal(true)
                                    setMsg(`Only names that have been newly added to your ${service} account since the last import are shown here.`)
                                 }
                                const firstEmails = new Set();
                                importContactListList.forEach(item => { item.emailList.forEach(email => firstEmails.add(email.emailId)); });

                                // Filter out contacts from the second array that have emails in the first array
                                const filteredContacts = mappedAddressBook.socialPersonList.filter(item => { return !item.emailList.some(email => firstEmails.has(email.emailId)); });

                                mappedAddressBook.socialPersonList = filteredContacts;
                                setContatcLess(false)
                                setAllContactJson(mappedAddressBook);
                                manageShowContactList(false);

                            } else {
                                setContatcLess(false)
                                setAllContactJson(mappedAddressBook);
                                manageShowContactList(false);
                            }

                        }
                        else if (error) {
                            setContatcLess(false)
                            setAllContactJson(mappedAddressBook);
                            props.dispatchloader(false)



                        }
                    }
                    );


                } else {
                    if (importContactList?.socialPersonList !== undefined) {
                        const importContactListList = importContactList?.socialPersonList !== undefined ? importContactList.socialPersonList : [];
                        
                        if(importContactListList.length > 0){
                            setShowModal(true)
                            setMsg(`Only names that have been newly added to your google account since the last import are shown here.`)
                         }
                        const firstEmails = new Set();
                        importContactListList.forEach(item => { item.emailList.forEach(email => firstEmails.add(email.emailId)); });

                        // Filter out contacts from the second array that have emails in the first array
                        const filteredContacts = mappedAddressBook.socialPersonList.filter(item => { return !item.emailList.some(email => firstEmails.has(email.emailId)); });

                        mappedAddressBook.socialPersonList = filteredContacts;


                        // sessionStorage.removeItem("service");
                        // sessionStorage.removeItem("session");
                        //    1208870144912715
                        // setImportContactList(mappedAddressBook);
                        setContatcLess(false)
                        setAllContactJson(mappedAddressBook);
                        manageShowContactList(false);

                    } else {
                        setContatcLess(false)
                        setAllContactJson(mappedAddressBook);
                        manageShowContactList(false);
                    }
                }
            } else if (error) {
                // AlertToaster.error("Something went wrong");
            }
        })
    }

    function upsertContact(isEdit) {

        let services = sessionStorage.getItem("service")
        const memberUserId = sessionStorage.getItem("SessPrimaryUserId");
        let newJson = allContactJson.socialPersonList.filter((ele) => { return ele?.isChecked == true })

        if (newJson.length == 0) {
            if(allContactJson.operation === "INSERT"){
                AlertToaster.warn("Please choose at least one contact to Import");
            }else{
                AlertToaster.warn("Please choose at least one contact to Edit");
            }

          

        } else {
            if (allContactJson.operation === "INSERT" || isEdit == true) {
                allContactJson["socialPersonList"] = newJson
            }
            props.dispatchloader(true);
            $CommonServiceFn.InvokeCommonSocialInviterApi("POST", $Service_Url.upsertSocialPeopleContact, allContactJson, { 'Content-Type': 'application/json,application/json-patch+json' }, (response, error) => {
                if (response) {
                    props.dispatchloader(false);
                    if (services == "apple") {
                        getContactByMemberUserId(memberUserId, "3")
                    } else if (services == "outlook") {
                        getContactByMemberUserId(memberUserId, "2")
                    }
                    // sessionStorage.removeItem("service");
                    sessionStorage.removeItem("session");
                    const responseAddressBook = response.data.data;
                    setImportContactList(responseAddressBook);
                    setAllContactJson(structuredClone({}));
                    manageShowContactList(true);
                    setSearchText("");
                }
                else {
                    props.dispatchloader(false);
                }
            })
        }

    }


    const handleSelectChange = (e, index,isEdit) => {

        if(isEdit == true){
            const newArrr = structuredClone(allContactJson);
            const value = e.target.value;
            const lengthOfSelect = selectCategoryOption.length;
  
          if (value < 0 || value > lengthOfSelect - 1) {
              return;
          }
         for(let i= 0;i < newArrr.socialPersonList.length;i++){
                newArrr.socialPersonList[i].socialPersonTypeId = parseInt(value) + 1
             }
          setAllContactJson(newArrr);
        }else{
            const newArrr = structuredClone(allContactJson);
        const value = e.target.value;
        const lengthOfSelect = selectCategoryOption.length;

        if (value < 0 || value > lengthOfSelect - 1) {
            return;
        }
        const optionName = selectCategoryOption[value].label;
        newArrr.socialPersonList[index].socialPersonType = optionName;
        newArrr.socialPersonList[index].socialPersonTypeId = parseInt(value) + 1;

        setAllContactJson(newArrr);
        }
        
    }


    const showContactListFunc = () => {
        // setContatcLess(true)
        let services = sessionStorage.getItem("service")
        if (services == "apple" || services == "outlook") {
            let id = services == "apple" ? "3" : "2"
            getContactByMemberUserId(memberUserId, id)
            setAllContactJson([])
            // sessionStorage.removeItem("service");
            sessionStorage.removeItem("session");
        } else {
            // setContatcLess(true)
            setAllContactJson(structuredClone({}))
            manageShowContactList(true);
        }
        // sessionStorage.removeItem("service");
        sessionStorage.removeItem("session");

    }

    const slotCheckboxfun = (e, index, item, text) => {
        let { id, checked } = e.target
        const newArrr = structuredClone(allContactJson);
        let alluserlist = (importContactList?.socialPersonList == undefined) || (allContactJson?.socialPersonList !== undefined) ? newArrr?.socialPersonList : importContactList?.socialPersonList

        if (text == 'all') {
        setImportContactList(prevState => ({
                ...prevState,
                socialPersonList: alluserlist.map(item => (item.socialPersonTypeId == id ? { ...item, isChecked: checked } : item))
            }));
            setIsChecked(checked)
        //   }
        } else if (text == "allSelect") {
            if (importContactList?.socialPersonList == undefined || allContactJson?.socialPersonList !== undefined) {
                setAllContactJson(prevState => ({
                    ...prevState,
                    socialPersonList: alluserlist.map(item => ({ ...item, isChecked: checked }))
                }));
                setIsChecked(checked)

            } else {
                setImportContactList(prevState => ({
                    ...prevState,
                    socialPersonList: alluserlist.map(item => ({ ...item, isChecked: checked }))
                }));
                setIsChecked(checked)
            }


        } else {
            let socialPersonIdd = item.socialPersonId
            if (importContactList?.socialPersonList == undefined || allContactJson?.socialPersonList !== undefined) {
                setIsChecked(checked)
                setAllContactJson(prevState => ({
                    ...prevState,
                    socialPersonList: newArrr?.socialPersonList.map((item, indexx) => (index == indexx ? { ...item, isChecked: checked } : item))
                }));
            } else {
                setImportContactList(prevState => ({
                    ...prevState,
                    socialPersonList: alluserlist.map(item => (item.socialPersonId === socialPersonIdd ? { ...item, isChecked: checked } : item))
                }));
            }
            setExtraState(checked)

        }

    }


    const mapTableBasedOnCategoryId = (importContactLists, isEdit) => {
        // {alert(isEdit)}
        if (importContactLists?.length === 0) return (
            <div className='ps-3 pe-3 pb-2'>There is no new Contact to save
                <span className='ms-2 text-decoration-underline text-primary cursor-pointer' onClick={showContactListFunc}>
                    Please click here to view existing contact.
                </span>
            </div>
        )

        return (
            <>
                <div className='row mt-2 ms-auto ps-2'>
                    {(importContactList?.socialPersonList == undefined && isEdit == false) || (allContactJson?.socialPersonList !== undefined && isEdit == false) ?
                        <>
                            <div className=' col-1 mt-2 me-0' style={{ display: "contents" }}>

                                <input className='form-check-input cursor-hover me-1' checked={allContactJson?.socialPersonList != undefined && allContactJson?.socialPersonList.every(ele => ele?.isChecked)} type='checkbox' style={{}} onChange={(e) => slotCheckboxfun(e, "", "", "allSelect")} />
                               <h5 className="col-3 ms-0 mt-auto">{importContactLists == undefined ? "Select all contact" : "Select all"}</h5></div>
                        </> 
                        : ""}


                </div>
                <div>
                    {isEdit === true &&
                    <>
                        <div className='d-flex justify-content-between'>
                        <div className='d-flex mt-2 me-0'>
                           <input className='form-check-input cursor-hover me-1'style={{margin:"auto"}} checked={allContactJson?.socialPersonList.every(ele => ele?.isChecked)} type='checkbox' onChange={(e) => slotCheckboxfun(e, "", "", "allSelect")} />
                            <h5 className="ms-0 mt-auto mb-auto">{importContactList?.socialPersonList == undefined ? "Select all contact" : "Select all"}</h5>
                            <div style={{margin:"auto"}}>
                                <select className="ms-2"value={allContactJson?.socialPersonList[0].socialPersonTypeId-1} onChange={(e) => handleSelectChange(e,"",isEdit)}>
                                    <option value={-1} hidden selected>Select Category</option>
                                    {
                                        selectCategoryOption !== null && selectCategoryOption.map((d, index) => <option value={index}>{d.label}</option>)
                                    }
                                </select>
                        </div>
                        </div>
                        {/* <div>
                                <select className="" onChange={(e) => handleSelectChange(e, id)}>
                                    <option value={-1} hidden selected>Select Category</option>
                                    {
                                        selectCategoryOption !== null && selectCategoryOption.map((d, index) => <option value={index}>{d.label}</option>)
                                    }
                                </select>
                        </div> */}
                        
        
                         <div className='d-flex align-items-center justify-content-end mb-2 gap-2' >
                            <button className='theme-btn' onClick={()=>upsertContact(isEdit)} style={{ borderRadius: "10px" }}>
                                Save Contact
                            </button>

                            <button className='btn' style={{ color: "#720c20", borderColor: "#720c20" }} onClick={showContactListFunc}>
                                Cancel
                            </button>
                        </div>
                        </div>
                        </>
                    }
                    <div className='ps-2 pe-1 me-2 mt-2' style={{ overflowY: 'auto', height: `${importContactLists.length > 5 && isEdit !== true && importContactLists.every(item => item.socialPersonType === importContactLists[0].socialPersonType) == false ? '30vh' : importContactLists.length > 9 || isEdit === true ? "58vh" : 'auto'}`, border: '0' }}>

                        <table className='contactTable' style={{ marginBottom: "1rem" }} >

                            <tr style={{ backgroundColor: 'lightgray', fontWeight: '400', position: 'sticky', top: 0, zIndex: 0 }}>
                                {/* {(isEdit == false) || (importContactList.socialPersonList == undefined) || (allContactJson?.socialPersonList !== undefined && allContactJson.operation == "INSERT") ? <> */}
                                <th className=''></th>
                                {/* </> : ""} */}
                                <th>First Name</th>
                                <th>Last Name</th>
                                {/* <th>Date Of Birth</th> */}
                                <th>Email</th>
                                {/* <th>Address</th> */}
                                {/* <th>Status</th> */}
                                {/* {isEdit === true && <th>Category</th>} */}

                                {/* <th>Action</th> */}

                            </tr>
                            {importContactLists.map((ele, id) => {
                         
                                return (
                                    <tr key={id}>
                                        {/* {((isEdit == false) || (importContactList.socialPersonList == undefined) || (allContactJson?.socialPersonList !== undefined && allContactJson.operation == "INSERT") ? <> */}
                                            <td className='contactName'>
                                                {ele?.socialPersonId == isBool?.socialPersonId ? <img style={{ width: "20px", margin: "6px" }} src='images/Birthimage.svg'></img> : <input style={{ margin: "6px" }} className="form-check-input cursor-hover" id={ele?.socialPersonType} checked={ele?.isChecked ? ele?.isChecked : false} type='checkbox' onChange={(e) => slotCheckboxfun(e, id, ele, "single")} />}
                                            </td>
                                        {/* </> : "") */}


                                        {/* } */}
                                        <td className='contactName' style={{ width: "20%" }}>{ele?.personFName}</td>
                                        <td className='contactName' style={{ width: "20%" }}>{ele?.personLName}</td>
                                        {/* <td>{ele?.personDOB}</td> */}
                                        <td style={{ width: "40%" }}>{ele?.emailList.map((lt, index) => { return (<>{`${(index > 0) ? ", " : ""}${lt?.emailId}`}</>) })}</td>
                                        {/* <td className='formattedAddress'>{ele?.addressList.map((add) => { return (<>{add?.address1 == null ? "" : add?.address1 + ","}</>) })}</td> */}
                                        {/* <td className={`text-white bg-${ele?.personStatus !== undefined && ele?.personStatus != "New Contact" ? "success" : "warning"}`}>{ele?.personStatus !== undefined && ele?.personStatus != "New Contact" ? "Added" : ""}</td> */}
                                        {/* {isEdit === true &&
                                            <select className="selectIcon" onChange={(e) => handleSelectChange(e, id)} value={selectCategoryOption.findIndex((d) => (d.label === ele?.socialPersonType))}>
                                                <option value={-1} hidden selected>Select Category</option>
                                                {
                                                    selectCategoryOption !== null && selectCategoryOption.map((d, index) => <option value={index}>{d.label}</option>)
                                                }
                                            </select>
                                        } */}
                                    </tr>
                                );
                            })}

                        </table>
                    </div>
                </div>
            </>
        )
    }
    const mapPersonalCategory = (data) => {
        if (importContactList?.socialPersonList === undefined) return <></>
        // const filteredList = importContactList?.socialPersonList.filter((d) => (d.personStatus === nameOfStatus && (d.personFName?.includes(searchText) || d.personLName?.includes(searchText) || d.emailList.some(({ emailId }) => (emailId?.includes(searchText))))));
        const filteredList = importContactList?.socialPersonList.filter((d) => (d.socialPersonTypeId == data.value && (d.personFName?.includes(searchText) || d.personLName?.includes(searchText) || d.emailList.some(({ emailId }) => (emailId?.includes(searchText))))));
        
        if (filteredList.length === 0) return <></>
        return <>
            <div className='d-flex justify-content-between align-items-end pe-3 ps-2 pe-3 mt-3 mb-1' style={{ justifyContent: "space-between" }}>
                <div className='d-flex align-items-end'>
                    {importContactList?.socialPersonList.every(item => item.socialPersonTypeId == importContactList?.socialPersonList[0].socialPersonTypeId) == false &&
                        <input className='form-check-input cursor-hover me-2' type='checkbox' checked={filteredList.every((ele) => { return ele?.socialPersonTypeId == data.value && ele?.isChecked == true ? true : false })} id={data.value} style={{ width: "20px" }} onChange={(e) => slotCheckboxfun(e, "", "", "all")}
                        />
                    }
                    <h5 className=''>{data?.label}</h5>
                </div>
                <div className='d-flex align-items-end'>
                    {/* <p className='text-decoration-underline cursor-pointer me-3' style={{ color: "#720C20" }} onClick={() => handleSend()}>Delete</p> */}
                    <p className='text-decoration-underline cursor-pointer' style={{ color: "#720C20" }} onClick={() => handleCLick(filteredList)}>Edit</p>
                </div>
            </div>
            {mapTableBasedOnCategoryId(filteredList, false)}
        </>
    }


    const handleCLick = (filteredList) => {
        const arr = mapSocialInviterUpsertJsonIntoArray(importContactList?.socialType, memberUserId, loggedUserId, filteredList);
        setAllContactJson(arr);
        manageShowContactList(false);
    }
    // const handleInputChange = (e) => {
    //     let data = importContactList?.socialPersonList?.filter((ele) => {
    //         return ele?.socialPersonType == e
    //     })
    //     setallUser(data)
    //     getCommMediumPathfuc()


    // }
    useEffect(() => {
        const CurrentDate = new Date();
        const monthIndex = CurrentDate.getMonth();
        const day = CurrentDate.getDate()
        const month = monthIndex + 1;

        let dobUser = importContactList !== undefined && importContactList !== null && Object.entries(importContactList).length != 0 && importContactList?.socialPersonList.filter((ele) => {
            if (ele?.personDOB !== null && ele?.personDOB !== undefined && ele?.personDOB !== "") {
                let date = new Date(ele?.personDOB)
                const monthIndex = date.getMonth();
                const months = monthIndex + 1;
                const days = date.getDate()
                return months == month && day == days
            }
        })
        setNotifyMessageCount(dobUser)
    }, [importContactList])

    // const handleLabel = (e) => {
    //     let data = importContactList?.socialPersonList?.filter((ele) => {
    //         return ele?.socialPersonType == e
    //     })
    //     if (data?.length > 0) {
    //         return e
    //     } else {
    //         return ""
    //     }



    // }
    // const getCommMediumPathfuc = (allData) => {
    //     konsole.log("getCommMediumPathfuc")
    //     let dataobj = {
    //         occurrenceId: 32,
    //         isActive: true,
    //         subtenantId: SubtenantId,
    //     };
    //     props.dispatchloader(true);
    //     $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getCommMediumPath, dataobj, async (res, error) => {
    //         if (res) {
    //             props.dispatchloader(false);
    //             let data = res.data?.data[0];
    //             setOccurenceData(data)
    //             setShowpreviewmodal(true)
    //             setComchannelId(data.commChannelId)
    //             if (data.commChannelId == 2) {
    //                 getTextTemplateapifuc(data.applicableTextTempId, data.isActive, data.subtenantId, allData);
    //             } else if (data.commChannelId == 1) {
    //                 GetEmailTemplateapifuc(data.applicableEmailTempId, data.isActive, data.subtenantId, allData);
    //             } else if (data.commChannelId == 3) {
    //                 GetEmailTemplateapifuc(data.applicableEmailTempId, data.isActive, data.subtenantId, allData);
    //                 getTextTemplateapifuc(data.applicableTextTempId, data.isActive, data.subtenantId, allData);
    //             }
    //         } else {
    //             props.dispatchloader(false);
    //             settemptaleshow(false)
    //             if (error?.data === 'Not Found') {
    //                 // settemptaleshow(false)
    //             }
    //         }
    //     })
    // };
    // const getTextTemplateapifuc = (tempid, isactive, subid, allData) => {

    //     props.dispatchloader(true);
    //     $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getTextTemplate + "?" + "TextTemplateId" + "=" + tempid + "&" + "IsActive" + "=" + isactive + "&SubtenantId" + "=" + subid, '', async (res, err) => {
    //         props.dispatchloader(false);
    //         if (res) {
    //             konsole.log("GettextTemplateapiresponse", res);
    //             setText(res.data.data[0]);
    //             settexttemp(res.data.data[0].textTemplateContent);
    //         }
    //         else {
    //             props.dispatchloader(false);
    //         }
    //     });
    // };
    // const GetEmailTemplateapifuc = (tempid, isactive, subid, allData) => {
    //     props.dispatchloader(true);
    //     $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.GetEmailTemplate + "?" + "TemplateId" + "=" + tempid + "&" + "IsActive" + "=" + isactive + "&SubtenantId" + "=" + subid, '', async (res, err) => {
    //         props.dispatchloader(false);
    //         if (res) {
    //             konsole.log("GetEmailTemplateapi", res.data.data);
    //             setemailtemp(res.data.data[0].templateContent);
    //             setEmailTemplate(res.data.data[0])
    //         }
    //         else {
    //             konsole.log("GetEmailTemplateapi", err)
    //             props.dispatchloader(false);
    //         }
    //     });
    // };
    // const SendEmailCommPathFunc = (responsedata, allData, i, length) => {
    //     let TemplateContent = document?.getElementById('emailtemplate')?.innerHTML;
    //     let emailTos = allData?.emailList.filter((ele) => { return ele?.contactTypeId == 1 })
    //     TemplateContent = TemplateContent.replaceAll("@@SUBTENANTNAME", occurenceData?.subtenantName).replaceAll("@@USERNAME", allData?.personFName + " " + allData?.personLName);

    //     let dataObj = {
    //         emailType: responsedata.templateType,
    //         emailTo: emailTos[0]?.emailId,
    //         emailSubject: responsedata.emailSubject,
    //         emailContent: TemplateContent,
    //         emailFromDisplayName: occurenceData.commMediumRoles[0].fromRoleName,
    //         emailTemplateId: responsedata.templateId,
    //         emailStatusId: 1,
    //         emailMappingTable: "string",
    //         emailMappingTablePKId: "string",
    //         createdBy: loggedUserId,
    //     };
    //     props.dispatchloader(true);
    //     if (emailTos[0]?.emailId != undefined && emailTos[0]?.emailId != null && emailTos[0]?.emailId != "") {
    //         return $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.PostEmailCom, dataObj, async (response, error) => {
    //             if (response) {
    //                 konsole.log("SendEmailComm", response);
    //                 if (i == length) {
    //                     AlertToaster.success("Email sent successfully");
    //                     setIsbool(null)
    //                     setShowpreviewmodal(false);
    //                     props.dispatchloader(false);
    //                 }

    //             }
    //             else if (error) {
    //                 AlertToaster.error("Something went wrong please try again latter");
    //                 setShowpreviewmodal(false);
    //                 setIsbool(null)
    //                 props.dispatchloader(false);
    //             }
    //         });
    //     }
    // };
    // const postSendTextPathapifunc = (responsedata, allData, i, length) => {
    //     let TemplateContenttext = document?.getElementById('templateData1')?.innerHTML;

    //     let spouseMobileNo = allData?.phoneList.filter((ele) => { return ele?.contactTypeId == 1 })
    //     TemplateContenttext = TemplateContenttext.replaceAll("@@SUBTENANTNAME", occurenceData?.subtenantName).replaceAll("@@MEMBERNAME", isBool?.personFName + " " + isBool?.personLName);;
    //     TemplateContenttext = TemplateContenttext?.replaceAll("@@USERNAME", allData?.personFName + " " + allData?.personLName);
    //     let dataObj = {
    //         smsType: responsedata?.textTemplateType,
    //         textTo: spouseMobileNo[0]?.mobileNo,
    //         textContent: TemplateContenttext,
    //         smsTemplateId: responsedata?.textTemplateId,
    //         smsStatusId: 1,
    //         smsMappingTable: "string",
    //         smsMappingTablePKId: "string",
    //         createdBy: loggedUserId,
    //     };

    //     if (spouseMobileNo[0]?.mobileNo != undefined && spouseMobileNo[0]?.mobileNo != null && spouseMobileNo[0]?.mobileNo !== "") {
    //         props.dispatchloader(true);
    //         $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postSendTextPath, dataObj, async (response, error) => {

    //             if (response) {
    //                 konsole.log("postSendTextPath", response);
    //                 props.dispatchloader(false);
    //                 setShowpreviewmodal(false);
    //                 if (i == length) {
    //                     AlertToaster.success("Text sent successfully");
    //                     setIsbool(null)
    //                 }
    //             }
    //             else {
    //                 AlertToaster.error("Something went wrong please try again latter");
    //                 setShowpreviewmodal(false);
    //                 props.dispatchloader(false);
    //                 setIsbool(null)
    //             }
    //         });
    //     }

    // };
    // const sendTextEmails = (text) => {
    //     for (let i = 0; i < allUser.length; i++) {
    //         if (text == "Email") {
    //             SendEmailCommPathFunc(emailTemplate, allUser[i])
    //         } else if (text == "Text") {
    //             postSendTextPathapifunc(textData, allUser[i])
    //         } else {
    //             SendEmailCommPathFunc(emailTemplate, allUser[i], i, allUser.length - 1)
    //             postSendTextPathapifunc(textData, allUser[i], i, allUser.length - 1)
    //         }

    //     }
    // }

    const handleSend = () => {
        let data = importContactList?.socialPersonList.filter((ele) => { return ele?.isChecked == true && ele?.socialPersonId !== isBool?.socialPersonId })
        setallUser(data)
        if (data !== null && data !== undefined && data !== "" && data.length !== 0) {

            const memberUserId = sessionStorage.getItem("SessPrimaryUserId");
            const loggedUserId = sessionStorage.getItem("loggedUserId");
            let socialPersonIds = ""
            for (let i = 0; i < data.length; i++) {
                socialPersonIds += data[i].socialPersonId;
                if (i < data.length - 1) {
                    socialPersonIds += ",";
                }
            }
            handleDelete(socialPersonIds, memberUserId, loggedUserId)
            
        } else {
            AlertToaster.warn("Please choose at least one contact to delete.");
        }

    }
    const deleteContact = (SocialPersonId, MemberUserId, DeletedBy) => {
        let json = {
            "socialPersonIds":SocialPersonId,
            "memberUserId": MemberUserId,
            "deletedBy": DeletedBy
          }
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteImportedContact,json,(response) => {
                if (response) {
                props.dispatchloader(false);
                let services = sessionStorage.getItem("service")
                let socialType = services == "google" ? "1" : services == "apple" ? "3" : "2"
                getContactByMemberUserId(MemberUserId, socialType)
 


            } else {
             props.dispatchloader(false);

            }
        }
        );
       
    }
    const handleDelete = async (socialPersonIds, memberUserId, loggedUserId) => {
        let confirmQuestion = await context.confirm(true, "Are you sure you want to delete? once deleted it will be permanently removed.", "Confirmation");
        if (!confirmQuestion) return;
        deleteContact(socialPersonIds, memberUserId, loggedUserId)
       };

    return (
        <Layout name={"Import Contact"}>
            <div className='bg-white h-100 mt-2'>
                <div className='d-flex justify-content-between ps-2 pe-3'>
                    <div className='flex-grow-1'>
                        <p className='pe-3 pb-2'>
                            Import Contacts from existing mail providers like Google etc.
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Click here for import contact</Tooltip>} >
                                <span className='d-inline-block ms-2 cursor-pointer'>
                                    <button className='googleBtn'>
                                        <img src='images/gmailImage.png' style={{ height: "2rem", marginTop: "0px" }} onClick={() => getSesssionWithLicence("google")}></img>
                                    </button>
                                </span >
                            </OverlayTrigger>
                            {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Click here for import contact</Tooltip>} >
                                <span className='ms-2 cursor-pointer'>
                                    <button className='googleBtn' >
                                    <img src='images/newApple.png' style={{ height: "2rem", marginTop:"0px"}} onClick={() => setAppleModal(true)}></img>
                                    </button>
                                </span >
                            </OverlayTrigger> */}
                            <OverlayTrigger show={showTooltip} overlay={<Tooltip id="tooltip-disabeld">Click here for import contact</Tooltip>}>
                                <span className='d-inline-block ms-2 cursor-pointer'>
                                    <button className='googleBtn' onClick={handleButtonClick}>
                                        <img src='images/newApple.png' style={{ height: "2rem", marginTop: "0px" }} onClick={() => setAppleModal(true)} onMouseOver={() => { setShowTooltip(true) }} onMouseLeave={() => { setShowTooltip(false) }} />
                                    </button>
                                </span>
                            </OverlayTrigger>
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Click here for import contact</Tooltip>} >
                                <span className='d-inline-block ms-2 cursor-pointer'>
                                    <button className='googleBtn  outlookBtn'>
                                        <img src='Outlook2.svg' style={{ height: "2rem", marginTop: "0px" }} onClick={() => getSesssionWithLicence("outlook")}></img>
                                    </button>
                                </span >
                            </OverlayTrigger>


                            {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Click here for import contact</Tooltip>} >
                                <span className='ms-2 cursor-pointer'>
                                    <button className='googleBtn'>
                                    <img src='Yahoo2.svg' style={{ height: "2rem", marginTop:"0px"}} onClick={() => getSesssionWithLicence("outlook")}></img>
                                    </button>
                                </span >
                            </OverlayTrigger> */}
                            {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">Click here for import contact</Tooltip>} >
                                <span className='ms-2 cursor-pointer'>
                                    <button className='googleBtn'>
                                    <img src='Aoi.svg' style={{ height: "2rem", marginTop:"0px"}} onClick={() => getSesssionWithLicence("outlook")}></img>
                                    </button>
                                </span >
                            </OverlayTrigger> */}
                        </p>
                        {
                            showContactList === true && importContactList?.socialPersonList?.length != undefined && importContactList?.socialPersonList?.length !== null && importContactList?.socialPersonList?.length !== "" && importContactList?.socialPersonList?.length !== 0 &&
                            <div className='pe-3'>
                                <input type='search' className='border contactSearch' placeholder='Search by name or email' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                            </div>
                        }
                    </div>
                </div>
                {allContactJson?.socialPersonList !== undefined && mapTableBasedOnCategoryId(allContactJson.socialPersonList, true)}

                {

                    showContactList == true &&
                    <>
                        <div className='d-flex justify-content-between mt-2 ms-auto ps-2'>
                            {(contatcLess == false && allContactJson?.socialPersonList !== undefined)|| (importContactList?.socialPersonList !== undefined)  ?
                            <>
                                <div className='d-flex mt-2 me-0'>
                           
                                   <input className='form-check-input cursor-hover me-1' checked={importContactList?.socialPersonList !== undefined && importContactList?.socialPersonList.every(ele => ele?.isChecked)} type='checkbox' style={{}} onChange={(e) => slotCheckboxfun(e, "", "", "allSelect")} />
                                    <h5 className="ms-0 mt-auto">{importContactList?.socialPersonList == undefined ? "Select all contact" : "Select all"}</h5>
                                    </div>
                                   
                        
                            {showContactList === true && <>
                            {contatcLess == false && importContactList?.socialPersonList !== undefined ? <>
                                <div className='mt-2 me-0'><p className='text-decoration-underline cursor-pointer me-3' style={{ color: "#720C20" }} onClick={() => handleSend()}>Delete</p> </div>

                            </>
                            :""}
                            </>}
                            </>
                            : ""}


                        </div>
                        <div style={{overflowY:"auto", height:"27rem"}}>

                        {importContactList?.socialPersonList !== undefined && selectCategoryOption !== null && selectCategoryOption.map((ele) => {

                            return mapPersonalCategory(ele)
                        })}
                        </div>

                    </>
                }
                {contatcLess == true || allContactJson?.socialPersonList == undefined  && importContactList?.socialPersonList == undefined ? <>
                  <div><h4 style={{position:"absolute",top:"50%",left:"35%",color:"#720C20"}}>No contacts found please import contacts from above available options</h4></div>
                </>:""}
            </div>
            <Modal
                show={showpreviewmodal}
                size="lg"
                onHide={() => setShowpreviewmodal(false)}
                backdrop="static"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px" }}
            >
                <Modal.Header className="text-white" closeVariant="white" closeButton>
                    Preview Send {(comChannelId == 1) ? 'Email' : (comChannelId == 2) ? 'Text' : 'Email & Text'}
                </Modal.Header>
                <Modal.Body className="rounded">

                    <div style={{ minHeight: "60vh", maxHeight: "60vh", height: "100vh", overflowX: "none", overflowY: "scroll" }} className="border">
                        <div className="position-relative" >
                            {
                                (emailtemp !== null && emailtemp !== "" && emailtemp !== undefined) ?
                                    <>
                                        <h6 className="ps-4 ms-5 mt-3">Email Template</h6>{
                                            <div dangerouslySetInnerHTML={{ __html: emailtemp.replaceAll("@@SUBTENANTNAME", occurenceData?.subtenantName).replaceAll("@@MEMBERNAME", isBool?.personFName + " " + isBool?.personLName) }} id="emailtemplate" contentEditable="true" className="p-0 m-0" />

                                        }
                                        {/* <div dangerouslySetInnerHTML={{ __html: emailtemp}} id="emailtemplate" contentEditable ="true" className="p-0 m-0" /> */}
                                    </>
                                    : <></>
                            }
                            <div className="px-5 mb-2">
                                {
                                    (texttemp !== null && texttemp !== "" && texttemp !== undefined) ?
                                        <>
                                            <h6 className="mt-3">Text Template</h6>
                                            <div contentEditable="true" id="templateData1" className="border p-2" style={{ padding: "10px 0 30px 0" }}>
                                                {texttemp.replaceAll("@@MEMBERNAME", isBool?.personFName + " " + isBool?.personLName)}
                                            </div>
                                        </>
                                        : <></>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="d-grid place-items-center p-4 gap-2">
                        <button style={{ background: "#720c20", color: "white", outline: "none", borderRadius: "5px", border: "2px solid #720C20" }} className="p-1" onClick={() => sendTextEmails(comChannelId == 1 ? 'Email' : comChannelId == 2 ? 'Text' : 'Email & Text')}>
                            Send  {(comChannelId == 1) ? 'Email' : (comChannelId == 2) ? 'Text' : 'Email & Text'}
                        </button>
                        <button style={{ color: "#720c20", background: "white", border: "2px solid #720C20", borderRadius: "5px" }} className="p-1" onClick={() => setShowpreviewmodal(false)}> Cancel</button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={appleModal}
                size="md"
                onHide={() => setAppleModal(false)}
                backdrop="static"
                className="newModal"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "10px" }} >
                <Modal.Header className="text-white" closeVariant="white" closeButton>
                </Modal.Header>
                <Modal.Body className="rounded">
                    <AppleLogin getSesssionWithLicence={getSesssionWithLicence} appleContact={appleContact} loginError={loginError} />
                </Modal.Body>
            </Modal>
            <WarningAlert setShowModal={setShowModal}showModal={showModal}msg={msg}header="Note"/>



        </Layout>
    )

}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(import_contact);
