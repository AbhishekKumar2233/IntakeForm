import React, { useState, useEffect, memo } from 'react'
import konsole from './control/Konsole'
import { $CommonServiceFn } from './network/Service'
import { $Service_Url } from './network/UrlPath'
import { isNotValidNullUndefile } from './Reusable/ReusableCom'
import { $AHelper } from './control/AHelper'


const CommonAddressContactForLiabilities = ({ userId, name, changeitem }) => {

    const [address, setAddress] = useState([])
    const [mobile, setMobile] = useState([])
    const [emails, setEmails] = useState([])
    const [emailstrue, setemailstrue] = useState(false)
    const [contacttrue, setcontacttrue] = useState(false)


    useEffect(() => {
        console.log('contacttruecontacttrue',contacttrue,emailstrue)
        if (contacttrue == false && emailstrue == false) {
            fetchSavedAddress()
            fetchSavedContactDetails()

        }

    }, [userId, contacttrue, emailstrue])

    //-----------------------------------------------------------------------------------------------
    const fetchSavedAddress = () => {
        if(!isNotValidNullUndefile(userId))return;
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAllAddress + userId, "", (res, err) => {
            console.log('getAllAddressgetAllAddress',res)
            if (res && res?.data?.data?.addresses.length>0) {
                konsole.log("getAllAddress", res.data?.data?.addresses[0])
                setAddress(res.data?.data?.addresses[0])
                setcontacttrue(true)
            } else {
                konsole.log("getAllAddress", err)
            }
        }
        );
    };

    //-----------------------------------------------------------------------------------------------------
    const fetchSavedContactDetails = () => {
        if(!isNotValidNullUndefile(userId))return;
        $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getAllContactOtherPath + userId, "", (res, err) => {
                if (res) {
                    konsole.log("getAllContactOtherPath", res.data.data?.contact)
                    setMobile(res.data.data?.contact?.mobiles[0])
                    setEmails(res.data.data?.contact?.emails[0])
                    setemailstrue(true)
                } else {
                    konsole.log("getAllContactOtherPath", err)
                }
            }
        );
    };

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    konsole.log("address", address)
    konsole.log("mobile", mobile)
    konsole.log("emails", emails)
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    return (
        <td scope="row">
            <p>Name:- <b>{$AHelper.capitalizeAllLetters(name)}</b></p>
            <p>Email:- <b>{emails?.emailId}</b></p>
            {/* <p>Cell:- <b>{$AHelper.pincodeFormatInContact(mobile?.mobileNo) +" "+ $AHelper.formatPhoneNumber((mobile?.mobileNo?.slice(0, 4) == "+254")
             ? mobile?.mobileNo : mobile?.mobileNo?.slice(-10))}</b></p> */}
            <p>Cell:- <b>{ mobile?.mobileNo ? 
            `${$AHelper.newPhoneNumberFormat(mobile?.mobileNo)}` : "" }</b></p>
            <p>Address:- <b> {address?.addressLine1}</b></p>
        </td>
    )
}

export default memo(CommonAddressContactForLiabilities)
