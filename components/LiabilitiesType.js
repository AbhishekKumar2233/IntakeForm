import React, { useState, useRef, useContext } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from "react-datepicker";

import { connect } from 'react-redux';

import { SET_LOADER } from './Store/Actions/action'
import { $Service_Url } from "./network/UrlPath";
import { $CommonServiceFn } from './network/Service';
import { $AHelper } from './control/AHelper';
import CurrencyInput from 'react-currency-input-field';
import { Msg } from './control/Msg';
import konsole from './control/Konsole';
import moment from 'moment';
import Other from './asssets/Other';
import { globalContext } from "../pages/_app";
import DatepickerComponent from './DatepickerComponent';
import { useEffect } from 'react';
import ContactListComponent from './ContactListComponent';
import AddressListComponent from './addressListComponent';
import CommonAddressContactForLiabilities from './CommonAddressContactForLiabilities';
import OtherInfo from './asssets/OtherInfo';
import AlertToaster from './control/AlertToaster';
import { getApiCall, isNotValidNullUndefile, postApiCall } from './Reusable/ReusableCom';

const leaseNtransportId = [6, 7]
const LiabilitiesType = (props) => {
    const { data, setdata, confirmyes, setConfirmyes, handleCloseYes ,confirm} = useContext(globalContext);
    //-------------------------------------------
    const liabilityRef = useRef();
    const addressaddref = useRef()
    const contactRef = useRef()
    //----------------------------------------------------------------------------------------------------------------------------------------------------------
    const [userId, setuserId] = useState('')
    const [loggedUserId, setloggedUserId] = useState('')
    const [subtenantId, setsubtenantId] = useState('')
    const [aditionalleaderdetails, setaditionalleaderdetails] = useState(false)
    const [update, setupdate] = useState(false)

    //-------------------------------------------------------------------------------------------------------------------------
    const [liabilityTypes, setLiabilityTypes] = useState([])
    const [UserLiabilities, setUserLiabilities] = useState([])
    //----------------------------------------------------------------------------------------------------------------------------------------------------------

    const [liabilityTypeId, setLiabilityTypeId] = useState('')
    const [showvalueliability, setShowValueLiabilities] = useState([])
    const [natureId, setnatureId] = useState('')
    const [nameofLender, setnameofLender] = useState('')
    const [payOffDate, setpayOffDate] = useState('')
    const [outstandingBalance, setoutstandingBalance] = useState('')
    const [paymentAmount, setpaymentAmount] = useState('')
    const [userRealPropertyId, setuserRealPropertyId] = useState('')
    const [description, setdescription] = useState('')
    const [debtAmount, setdebtAmount] = useState('')
    const [lenderUserId, setLenderUserId] = useState('')
    const [disable, setdisable] = useState(false)
    const [liabilityType, setLiabilityType] = useState('')
    const [liabilitiesTypeIdforRealNTrans, setLiabilitiesTypeIdforRealNTrans] = useState('')
    const [leaseNRealEstatelist, setLeaseNRealEstateList] = useState([])
    const [leaseNRealEstaeliabilitiesId, setLeaseNRealEstaeliabilitiesId] = useState()
    const [transportation,setTransportation]=useState({})
    const [liabilityTypeIdForCancel,setLiabilityTypeIdForCancel]=useState(null)
    console.log('leaseNRealEstatelist', leaseNRealEstatelist)

    konsole.log("showvalueliability", showvalueliability)
    konsole.log('liabilitiesTypeIdforRealNTrans', liabilitiesTypeIdforRealNTrans)
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
        let loggedUserId = sessionStorage.getItem("loggedUserId") || "";
        let subtenantId = sessionStorage.getItem("SubtenantId") || "";
        setloggedUserId(loggedUserId)
        setuserId(newuserid)
        setsubtenantId(subtenantId)

        fetchliabilitytypes()
        fetchliabilityUsertypes(newuserid);

    }, [])




    const toasterShowMsg = (message, type) => {
        setdata({
            open: true,
            text: message,
            type: type,
        })
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------



    const fetchliabilitytypes = () => {
        props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getLiabilityTypes,
            "", (res, err) => {
                props.dispatchloader(false)
                if (res) {
                    konsole.log("getLiabilityTypes", res)
                    let responseData = res.data.data?.filter((item) => item.value != '6' && item?.value != '7')
                    setLiabilityTypes(responseData)
                } else {
                    konsole.log("getLiabilityTypes", err)
                }
            })
    }

    const fetchLiabilityId = async (liabilitiID) => {
        const result = await getApiCall('GET', $Service_Url.getLiabilities + liabilitiID, setLeaseNRealEstateList)
    }


    //-------------------------------------------------------------------------------------------------------------


    const fetchliabilityUsertypes = (userid) => {
        konsole.log("useruseridid", userid, $Service_Url.getLiabilityUserTypes + userid + "/0")
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getLiabilityUserTypes + userid + "/0", "", (res, err) => {
            // konsole.log(JSON.stringify(response));
            props.dispatchloader(false);
            if (res) {
                konsole.log("getLiabilityUserTypes", res)
                setUserLiabilities(res?.data?.data?.liability)

            } else {
                konsole.log("getLiabilityUserTypes", err)
                if (err.data?.status == 404) {
                    setUserLiabilities([])
                }
            }

        })
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------



    const validate = () => {
        let nameError = ""
        if (liabilityTypeId == 0) {
            nameError = "Type of Liability cannot be Blank"
            setdisable(false)
        }
        if (nameError) {
            // alert(nameError);
            // alert(nameError)
            toasterShowMsg(nameError, "Warning")
            return false;
        }
        return true;
    }


    const saveBtnFun = (type) => {
        setdisable(true)
        if (validate()) {
            addmemberfun(type)
        }
    }
    const addmemberfun = (type) => {
        konsole.log("NameoflenderNameoflender", type)
        props.dispatchloader(true)
        let jsonobj = {
            "subtenantId": subtenantId,
            "fName": null,
            "lName": null,
            "isPrimaryMember": false,

        }
        //------------------------------------------------------------------
        let ApiUrl = $Service_Url.postAddMember
        let method = "POST"

        console.log("lenderUserIdlenderUserId", lenderUserId)
        if (update == false && lenderUserId == '') {

            ApiUrl = $Service_Url.postAddMember
            jsonobj["createdBy"] = loggedUserId
            method = "POST"

        } else {
            jsonobj["updatedBy"] = loggedUserId
            jsonobj["userId"] = lenderUserId
            ApiUrl = $Service_Url.putUpdateMember
            method = "PUT"
        }
        //------------------------------------------------------------------------
        let nameofLendersplit = nameofLender.split(' ')
        if (nameofLendersplit.length == 1) {
            jsonobj['fName'] = nameofLendersplit[0]
            jsonobj['lName'] = null
        } else if (nameofLendersplit.length > 1) {
            let lastName = nameofLendersplit.splice(nameofLendersplit.length - 1, 1).join('')
            jsonobj['fName'] = nameofLendersplit.join(' ')
            jsonobj['lName'] = lastName
        }


        konsole.log("JSONJSON", jsonobj)
        // setdisable(true)

        $CommonServiceFn.InvokeCommonApi(method, ApiUrl, jsonobj, (res, err) => {

            props.dispatchloader(true)
            if (res) {
                // setdisable(false)
                konsole.log("postAddMember", res)
                let userId = res.data?.data?.member?.userId
                setLenderUserId(userId)
                postUserLiabilities(userId, type, method)
                konsole.log("postAddMemberr", res)
                addressaddref.current.setUserIdOnly(userId)
                props.dispatchloader(false)

            } else {
                konsole.log('postAddMember', err)
                setdisable(false)
            }
        })

    }

    const postUserLiabilities = (lenderUserId, type, method) => {
        props.dispatchloader(true)
        let PayOffDate = null;
        if (payOffDate !== '' && payOffDate !== null && payOffDate !== undefined) {
            PayOffDate = $AHelper.getFormattedDate(payOffDate)
        }
        const eventValueforlender = nameofLender?.charAt(0).toUpperCase() + nameofLender.slice(1);

        let liableinput = {
            // "liabilityTypeId": liabilityTypeId,
            "userLiabilityId": natureId,
            "userRealPropertyId": userRealPropertyId,
            "description": description,
            "nameofInstitutionOrLender": eventValueforlender,
            "debtAmount": debtAmount,
            "outstandingBalance": outstandingBalance,
            // "payOffDate": PayOffDate,
            "interestRateTypeId": 0,
            "interestRatePercent": 0,
            "extraPaymentMode": "string",
            "paymentFrequencyId": 0,
            "paymentAmount": paymentAmount,
            "liabilityDocs": null,
            "lenderUserId": lenderUserId,
            "isActive": true
        }
        if (leaseNtransportId.includes(Number(liabilityTypeId))) {
            liableinput['liabilityId'] = leaseNRealEstaeliabilitiesId;
            liableinput['liabilityTypeId'] = liabilityTypeId
        } else {
            liableinput["liabilityTypeId"] = liabilityTypeId
        }

        if (payOffDate !== null) {
            liableinput["payOffDate"] = PayOffDate
        }
        if (method == 'PUT') {
            liableinput["updatedBy"] = loggedUserId
        }
        else {
            liableinput["createdBy"] = loggedUserId

        }
        if(liableinput?.liabilityId==5){
            liableinput["interestRatePercent"] = transportation?.interestRatePercent
            liableinput["loanNumber"] = transportation?.loanNumber

            liableinput["lenderUserId"] = transportation?.lenderUserId

        }
        let totalinput = {
            userId: userId,
            liability: liableinput
        }
        //------------------------------------------
        var apiurl = $Service_Url.postAddLiability
        var method = method
        if (method == 'PUT') {
            apiurl = $Service_Url.putAddLiability
        }
        // console.log("methodmethod",method)
        konsole.log("jaonobj2", JSON.stringify(totalinput))
        konsole.log("apiurl", apiurl, method)

        // ----------------------
        $CommonServiceFn.InvokeCommonApi(method, apiurl, totalinput, (res, err) => {
            props.dispatchloader(false)

            if (res) {
                setdisable(false)
                konsole.log("postAddLiability", res)
                let liabilityResponse = res.data.data.liability[0].userLiabilityId;
                let e = res.data.data.liability[0];
                let payOffDate = (e.payOffDate !== null && e.payOffDate !== undefined && e.payOffDate !== "Invalid Date") ? moment(e.payOffDate).toDate() : ""
                setLiabilityTypeId(e?.liabilityTypeId)
                setLenderUserId(e?.lenderUserId)
                setnameofLender(e?.nameofInstitutionOrLender)
                setpayOffDate(payOffDate)
                setoutstandingBalance(e?.outstandingBalance)
                setpaymentAmount(e?.paymentAmount)
                setnatureId(e?.userLiabilityId)
                setLiabilityTypeIdForCancel(liabilityResponse);
                if (liabilityTypeId == "999999") {
                    liabilityRef.current.saveHandleOther(liabilityResponse);
                }
                // console.log("typetype",type)
                if (type !== 'save') {
                    if (type == 'address') {
                        addressaddref.current.setUserId(lenderUserId);
                    } else if (type == 'contact') {
                        contactRef.current.setUserId(lenderUserId);
                    }
                } else {
                    fetchliabilityUsertypes(userId)
                    clealAll()
                    update !== true ?
                        AlertToaster.success("Liability saved successfully")  :  AlertToaster.success("Liability update successfully")
                    props.handleLiablitypopShow()

                    // let messgae = (update !== true) ? "Liability Saved Successfully" : "Liability Update Successfully"
                    // toasterShowMsg(messgae, "Success")
                }

            } else {
                konsole.log("postAddLiability", err)
                setdisable(false)
            }
        })

    }
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------------


    useEffect(() => {
        konsole.log("liabilityTypes", liabilityTypes, liabilityTypeId)
        let data = liabilityTypes.filter((item) => item.value == liabilityTypeId)
        setShowValueLiabilities(data)
    }, [liabilityTypeId])

        const editBtn = (e) => {
            if(e?.liabilityId==5){
                setTransportation(e)
            }

        setLiabilitiesTypeIdforRealNTrans(e.liabilityTypeId)
        konsole.log("editbtne", e)
        setuserRealPropertyId(e?.userRealPropertyId)
        let payOffDate = (e.payOffDate !== null && e.payOffDate !== undefined && e.payOffDate !== "Invalid Date") ? moment(e.payOffDate).toDate() : ""
        if (leaseNtransportId.includes(Number(e.liabilityTypeId))) {
            fetchLiabilityId(e?.liabilityTypeId)
            setLeaseNRealEstaeliabilitiesId(e?.liabilityId)
        }
        setLiabilityTypeId(e?.liabilityTypeId)

        setLenderUserId(e?.lenderUserId)
        setnameofLender(e?.nameofInstitutionOrLender)
        setpayOffDate(payOffDate)
        setoutstandingBalance(e?.outstandingBalance),
            setpaymentAmount(e?.paymentAmount),
            setnatureId(e?.userLiabilityId),
            setaditionalleaderdetails(true)
        setupdate(true)
        setLiabilityType(e?.liabilityType)


    }


    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
    const clealAll = () => {

        setLiabilityTypeId('')
        setnatureId('')
        setnatureId('')
        setpayOffDate('')
        setoutstandingBalance('')
        setpaymentAmount('')
        setupdate(false)
        setnameofLender('')
        setLenderUserId('')
        setaditionalleaderdetails(false)
        setLiabilityType('')
        setLiabilitiesTypeIdforRealNTrans('')

    }

    //------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const deleteUserData = async (data, userid, loggedUserId) => {
        const req = await confirm(true, "Are you sure? you want to delete", "Confirmation");
        if (!req) return;
        konsole.log("datataDelete", data, `?UserId=${userid}&UserLiabilityId=${data.userLiabilityId}&DeletedBy=${loggedUserId}`)
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("DELETE", $Service_Url.deleteUserLiability + `?UserId=${userid}&UserLiabilityId=${data?.userLiabilityId}&DeletedBy=${loggedUserId}`, "", (response, err) => {
            props.dispatchloader(false);
            if (response) {
                konsole.log("responseDeleteBuss", response)
                AlertToaster.success("Data Deleted Successfully");

                clealAll()
                fetchliabilityUsertypes(userId)
            } else {
                konsole.log("deleteErrorr", err)
            }
        });
    }

    console.log("liabilityTypeIdForCancel",liabilityTypeIdForCancel)
    const onHideFunction=async()=>{
        if(isNotValidNullUndefile(liabilityTypeIdForCancel) && update==false){
            props.dispatchloader(true);
            let _resultOfDelete=await postApiCall('DELETE', $Service_Url.deleteUserLiability + `?UserId=${userId}&UserLiabilityId=${liabilityTypeIdForCancel}&DeletedBy=${loggedUserId}`);
            konsole.log("_resultOfDelete",_resultOfDelete);
            props.dispatchloader(false);
        }
        props.handleLiablitypopShow()
    }

    const hideForTransportation = () => {
        let isHide = (liabilitiesTypeIdforRealNTrans == leaseNtransportId[1]) ? false : true
        return isHide;
    }

    const handleSaveUpdate = () => {
        if (!hideForTransportation()) {
                postUserLiabilities(null,'save','PUT')
        } else if ((isNotValidNullUndefile(lenderUserId) && update == false)) {
            postUserLiabilities(lenderUserId, "save", "PUT");
            // {(update !== true) ? 
            //     AlertToaster.success("Liability saved successfully")
            //     :AlertToaster.success("Liability update successfully");
            // }
            // props.handleLiablitypopShow()
        } else {
            saveBtnFun("save")
        }

        // onClick={() => { (isNotValidNullUndefile(lenderUserId) && update == false) ? props.handleLiablitypopShow() : saveBtnFun("save") }}
    }


 
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
    konsole.log("nameofLender", nameofLender.split(' '))
    konsole.log("liabilityTypeId", liabilityTypeId)
    konsole.log("liabilityTypes", liabilityTypes)
    konsole.log("lenderUserId", lenderUserId)
    konsole.log("khkjhkjhkhkj", UserLiabilities)
    konsole.log('leaseNRealEstatelist', leaseNRealEstatelist)

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------

    return (
        <>

            <Modal show={props.show} size="lg"enforceFocus={false} centered onHide={onHideFunction} animation="false" backdrop="static">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Types of Liabilities</Modal.Title>
                </Modal.Header>
                <Modal.Body className="">
                    <div className='person-content'>
                        <Row className="mb-2">
                            <h5 className='fw-bold'>Mortgages, Notes to Banks, Notes to Other, Loans on Insurance, Other:</h5>
                        </Row>
                        <Form.Group as={Row}>
                            <Col xs="12" sm="12" md="6" lg="6" className='mb-2'>
                                <Select className="custom-select "
                                    onChange={(event) => setLiabilityTypeId(event.value)}
                                    options={(liabilityTypes.length !== 0) ? liabilityTypes : []}
                                    maxMenuHeight={150}
                                    value={(liabilityTypeId == 7) ? { value: "", label: "Transportation" } : (liabilityTypeId == 6) ? { value: "", label: "Real Estate" } : showvalueliability}
                                    placeholder={$AHelper.mandatory("Types of Liabilities")}
                                    isSearchable
                                    isDisabled={leaseNtransportId.includes(Number(liabilityTypeId))}
                                />
                            </Col>
                            {
                                liabilityTypeId == "999999" &&
                            <Col xs="12" sm="12" md="6" lg="6" className=''>
                                    <Other othersCategoryId={15} userId={userId} dropValue={liabilityTypeId} natureId={natureId} ref={liabilityRef} />
                                </Col>
                            }
                           
                        </Form.Group>
                        <Form.Group as={Row}>
                        <Col xs="12" sm="12" md="6" lg="6" className='mb-2'>
                                {leaseNtransportId.includes(Number(liabilityTypeId)) && <>
                                    <Select className="w-100 p-0 custom-select"
                                        options={(leaseNRealEstatelist.length > 0) ? leaseNRealEstatelist : []}
                                        value={leaseNRealEstatelist.find((item) => item.value == leaseNRealEstaeliabilitiesId)}
                                        placeholder={$AHelper.mandatory("Types of Liabilities")}
                                        isDisabled />
                                </>}
                            </Col>

                        </Form.Group>
                        <Form.Group as={Row} className="">
                            <Col xs="12" sm="12" md="6" lg="6" className='mb-2'>
                                <div className="nameoflendercasing-wrapper">
                                    <Form.Control
                                        type="text"
                                        value={nameofLender}
                                        onChange={(e) => setnameofLender(e.target.value)}
                                        name="nameofLender"
                                        placeholder="Name of Lender"
                                        className='w-100 d-block upperCasing'
                                    />
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="6" lg="6" className='mb-2'>
                                <DatepickerComponent name="payOffDate" placeholderText='PayOff Date' value={payOffDate} setValue={(value) => setpayOffDate(value)} minDate="100" future="show" maxDate={100} />
                            </Col>

                        </Form.Group>
                        <Form.Group as={Row} className="">
                            <Col xs="12" sm="12" md="6" lg="6" className='mb-2'>
                                <CurrencyInput prefix="$" allowNegativeValue={false} value={outstandingBalance} onValueChange={(value) => setoutstandingBalance(value)} className="border" placeholder='Outstanding Balance' name="outstandingBalance" decimalScale="2" />
                            </Col>
                            <Col xs="12" sm="12" md="6" lg="6" className='mb-2'>
                                <CurrencyInput prefix="$" allowNegativeValue={false} value={paymentAmount} onValueChange={(value) => setpaymentAmount(value)} className="border" placeholder='Monthly Amount' name="Monthly Amount" odecimalScale="2" />
                            </Col>
                        </Form.Group>

                    </div>
                    {/* liabilitiesTypeIdforRealNTrans */}
                    {hideForTransportation() && <>
                        <Form.Group as={Row} className="">
                            <Col xs="12" sm="12" md="6" lg="6" className='mb-2'>
                                <Button className='cancel-Button' style={{ background: "white", color: "#720C20", fontSize: "13px" }} onClick={() => setaditionalleaderdetails(!aditionalleaderdetails)}>Additional Lender details </Button> </Col>
                        </Form.Group>
                        </>}

                        { ((isNotValidNullUndefile(lenderUserId) && leaseNtransportId.includes(Number(liabilityTypeId))) ? aditionalleaderdetails : (aditionalleaderdetails && hideForTransportation())) &&

                            <Form.Group as={Row}>
                                <div>
                                    <AddressListComponent userId={lenderUserId} ref={addressaddref}
                                        invokepostmember={saveBtnFun} editType="liabilities" key={lenderUserId} />
                                </div>
                                <div>
                                    { isNotValidNullUndefile(lenderUserId) ?
                                        <ContactListComponent userId={lenderUserId} ref={contactRef} key={lenderUserId} />
                                        :
                                        <Row className="m-0 mb-4">
                                            <Col xs md="6" className="d-flex align-items-center ps-0 ">
                                                <button
                                                    className="white-btn" onClick={() => saveBtnFun('contact')}>Contact Information</button>

                                            </Col>
                                        </Row>}

                                </div>
                            </Form.Group>

                        }
                    


                    <Button className="theme-btn float-end mb-2" style={{ backgroundColor: "#76272b", border: "none" }}

                        onClick={() => handleSaveUpdate()}
                        disabled={disable == true ? true : false}
                    >{(update == true) ? "Update" : "Save"}
                    </Button>

                    <Button className='cancel-Button' onClick={() =>onHideFunction()} >Cancel</Button>


                </Modal.Body>
                <Modal.Footer className="border-0 mb-3 d-block" style={{ maxHeight: "20vh", overflowY: "scroll" }}>
                    <div className='table-responsive'>

                        <table className="table table-bordered"  >

                            {(UserLiabilities.length > 0) && UserLiabilities.map((item, index) => {
                                konsole.log('itemitemitemitemitem',item)

                                return <tbody > <tr style={{ border: "3px solid #dcdadb" }} className="mb-5">
                                    <td scope="row" style={{ border: "3px solid #dcdadb" }}>
                                        <p style={{ wordBreak: "break-word" }}><b>
                                            <OtherInfo othersCategoryId={15} othersMapNatureId={item?.userLiabilityId} FieldName={item?.liabilityType} userId={userId} />

                                        </b></p>
                                        <p>Payoff Date:- <b>{item.payOffDate !== null ? $AHelper.getFormattedDate(item.payOffDate) : ""}</b></p>
                                        <p>Outstanding Bal:- <b>{item?.outstandingBalance !== null && item?.outstandingBalance !== undefined && item?.outstandingBalance !== "" ? $AHelper.IncludeDollars(item?.outstandingBalance) : ""}</b></p>
                                        <p>Monthly Amt:- <b>{item.paymentAmount !== null && item.paymentAmount !== undefined && item.paymentAmount !== "" ? $AHelper.IncludeDollars(item.paymentAmount) : ""}</b></p>
                                    </td>

                                    {(item?.lenderUserId ||leaseNtransportId.includes(Number(item.liabilityTypeId))) &&
                                        <CommonAddressContactForLiabilities userId={item?.lenderUserId} name={item?.nameofInstitutionOrLender} />
                                    }
                                    <td scope="row" style={{ verticalAlign: "middle", border: "3px solid #dcdadb" }} >
                                        <div className="d-flex gap-2">
                                            <div className=' d-flex flex-column align-items-center' onClick={() => editBtn(item)}>
                                                <img className="cursor-pointer mt-0" src="/icons/EditIcon.png" alt=" Mortgages" style={{width:"20px"}} />
                                                {/* <span className='fw-bold mt-1' style={{ color: "#720C20", cursor: "pointer" }}>Edit</span> */}
                                            </div>
                                            <div>
                                                <span style={{borderLeft:"2px solid #e6e6e6", paddingLeft:"5px", height:"40px", marginTop:"5px"}} className="cursor-pointer mt-1" onClick={() => deleteUserData(item, userId, loggedUserId)}>
                                                    <img src="/icons/deleteIcon.svg" className="mt-0" alt="g4" style={{width:"20px"}} />
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>


                            })}

                        </table>
                    </div>
                </Modal.Footer>


            </Modal>
        </>
    )
}


const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LiabilitiesType);