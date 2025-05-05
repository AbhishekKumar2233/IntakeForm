import React, { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import { Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import konsole from '../../components/control/Konsole';
import { $AHelper } from '../Helper/$AHelper';
import { $Msg_InviteSpouse } from '../Helper/$MsgHelper';
import { useAppDispatch, useAppSelector } from '../Hooks/useRedux';
import { selectOccurrance } from '../Redux/Store/selectors';
import { $ApiHelper } from '../Helper/$ApiHelper';
import { updateOccurranceDetails } from '../Redux/Reducers/occurranceSlice';
import { useLoader } from '../utils/utils';
import { occurranceDetailsId } from '../Helper/Constant';
import { getApiCall, getApiCall2, postApiCall, postApiCall2 } from '../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../components/network/UrlPath';
import CustomModal from '../Custom/CustomModal';
import { logoutUrl } from '../../components/control/Constant';
import { $JsonHelper } from '../Helper/$JsonHelper';
import { globalContext } from '../../pages/_app';
import { setIsJointAccount, updateShowInvite } from '../Redux/Reducers/personalSlice';
import { selectPersonal } from '../Redux/Store/selectors';
const InviteSpouse = (props) => {
    const { emailAddress, mobileNo } = props;

    const { setConfirmation, confirm, setWarning } = useContext(globalContext)
    const personalReducer = useAppSelector(selectPersonal);
    const { primaryDetails, spouseDetails, subtenantId, spouseUserId, primaryUserId, loggedInUserId, primaryMemberFullName, spouseFullName,_spousePartner } = usePrimaryUserId();
    konsole.log("spouseDetails", spouseDetails,primaryDetails);
    const dispatch = useAppDispatch();
    const occurrenceApiData = useAppSelector(selectOccurrance);
    const { occurranceDetails } = occurrenceApiData;
    konsole.log("spouseDetails", spouseDetails);
    const [checkJointCondition, setCheckJointCondition] = useState(1);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [linkedAccountDetails, setLinkedAccountDetails] = useState('')
    const [subtenantName,setSubtenantName]=useState('')

    
    konsole.log("checkJointCondition", checkJointCondition)
    
    
    // define useEffet
    useEffect(() => {
        const subtenantName = sessionStorage.getItem("subtenantName");
        setSubtenantName(subtenantName)
        if(personalReducer?.isJointAccount==false){
            fetchSavedData();
        }
    }, [spouseUserId,personalReducer.isJointAccount])

    const fetchSavedData =() => {
        if (!$AHelper.$isNotNullUndefine(spouseUserId)) return;
        const _resultOfSpouse = props?.spouseEmailActiveData;  
        if (_resultOfSpouse?.length > 0) {
            let responseData = _resultOfSpouse[0]
            const jointAccountUserId = responseData?.jointAccountUserId;
            const isActive = responseData?.isActive;
            if (isActive == true && jointAccountUserId == primaryUserId) {
                dispatch(updateShowInvite(true))
                setCheckJointCondition(2)
                handleIsJointAccount(true)
            } else if (isActive == true && jointAccountUserId !== primaryUserId) {
                setCheckJointCondition(3)
                handleIsJointAccount(false)
            } else {
                setCheckJointCondition(1)
                handleIsJointAccount(false)
            }

        } else {
            handleIsJointAccount(false)
        }
    }

    const handleIsJointAccount = (val) => {
        console.log("handleIsJointAccount",val)
        dispatch(setIsJointAccount(val))
    }


    // @@ Email & Text Template 
    const emailTextTemp = useMemo(() => {
        let emailTemp = ''
        let textTemp = ''
        let commPath = ''
        const spouseJointAcc = occurranceDetails[occurranceDetailsId?.spouseJointAccount];
        konsole.log("spouseJointAcc", occurranceDetails, spouseJointAcc);

        if (spouseJointAcc) {
            if (spouseJointAcc.emailTemp?.length > 0) {
                emailTemp = spouseJointAcc.emailTemp[0]
            }
            if (spouseJointAcc.textTemp?.length) {
                textTemp = spouseJointAcc.textTemp[0]
            }
            if (spouseJointAcc.commPath) {
                commPath = spouseJointAcc?.commPath
            }
        }

        return { emailTemp, textTemp, commPath }
    }, [occurranceDetails])



    // Send Invite function
    const sentInvite = async () => {


        konsole.log("emailAddress",emailAddress)
        if (!$AHelper.$isNotNullUndefine(emailAddress)) {
            const _email404 = `Please provide the primary email of ${primaryDetails?.maritalStatusId === 2 ? "partner" : "spouse"}.`;
            toasterAlert("warning", "Warning", _email404);
            return;
        }

        useLoader(true)
        // @Occurrance Data Update---------------
        let updatedOccDetail = occurranceDetails;
        if (!$AHelper.$isNotNullUndefine(updatedOccDetail[occurranceDetailsId?.spouseJointAccount])) {
            useLoader(true);
            const obj = { occurrenceId: occurranceDetailsId?.spouseJointAccount, subtenantId: subtenantId }
            let _resultOfOcc22 = await $ApiHelper.$getOccurrance(obj);
            useLoader(false);
            konsole.log("_resultOfOcc22", _resultOfOcc22);
            if (_resultOfOcc22 == 'err404') {
                alert($Msg_InviteSpouse?._emailTemplate404);
                return;
            }

            if (!updatedOccDetail || !Object.isExtensible(updatedOccDetail)) {
                updatedOccDetail = { ...occurranceDetails }; // Create a new extensible object
            }

            updatedOccDetail[occurranceDetailsId?.spouseJointAccount] = _resultOfOcc22;

            konsole.log("updatedOccDetail", updatedOccDetail);

            dispatch(updateOccurranceDetails(updatedOccDetail));

        }
        // @Occurrance Data Update---------------
        konsole.log("updatedOccDetail", updatedOccDetail);
        useLoader(false)
        // Add the functionality to send the invite here
        if (!$AHelper.$isNotNullUndefine(updatedOccDetail[occurranceDetailsId?.spouseJointAccount])) {
            toasterAlert("warning", "Warning", "The email template is not available Please contact the administrator to send an invite.");
        } else {
            getJointAccountLink()
        }
    };


    const getJointAccountLink = async () => {
        const jsonObj = {
            primaryUserId: primaryUserId,
            secondaryUserId: spouseUserId,
            roleId: sessionStorage.getItem("roleUserId"),
            isJointAccount: true,
            subtenantId: subtenantId,
            signUpPlatform: 11,
            isActive: false,
            createdBy: loggedInUserId
        }
        useLoader(true)
        const _resultOfJointAccount = await postApiCall2('POST', $Service_Url.getJointAccountLink, jsonObj);
        useLoader(false)
        konsole.log("_resultOfJointAccount", _resultOfJointAccount);
        // @@ Response
        if (_resultOfJointAccount.result == 200) {
            const responseData = _resultOfJointAccount?.response?.data?.data;
            setLinkedAccountDetails(responseData)
            konsole.log("responseData", responseData);
            if (!$AHelper.$isNotNullUndefine(responseData?.activationLink)) {
                toasterAlert("warning", "Warning", "The sent invite link is under maintenance. please try again after sometime. ");
                // alert(`The sent invite link is under maintenance. please try after sometime, if still issue persist, please use the feedback button to share the error details.`);
                return;
            }
            handleOpenModal(true);

        } else {
            // @@ Error Handling
            setLinkedAccountDetails('')
            const errRes = _resultOfJointAccount?.response;
            konsole.log("errReserrRes", errRes)
            if (errRes.data?.errorFlag === "USER_ALREADY_ACTIVATED") {
                toasterAlert("warning", "Warning", "Spouse/Partner has already activated the account.");
            } else if (errRes.data?.errorFlag === "EMAIL_NOT_AVAILABLE") {
                toasterAlert("warning", "Warning", 'Spouse/partner email is not available');
            } else if (errRes.data?.errorFlag === "USER_ALREADY_ASSOCIATED_WITH_US") {
                toasterAlert("warning", "Warning", errRes.data?.messages[0]);
            }

        }
    }


    const replaceTempValue = useCallback((emailtemp) => {
        let TemplateContent = emailtemp;
        TemplateContent = TemplateContent?.replace("@@USERNAME", primaryMemberFullName);
        TemplateContent = TemplateContent?.replace("@@SPOUSENAME", spouseFullName);
        TemplateContent = TemplateContent?.replace("@@UNIQUELINK", `${logoutUrl}account/Signin?subtenantId=${subtenantId}`);
        TemplateContent = TemplateContent?.replace("@@SUBTENANTNAME", subtenantName);
        TemplateContent = TemplateContent?.replace("@@ACCPETLINK", 'CLICK HERE');

        return TemplateContent;
    }, [])


    const replaceTemplateForEmail = (type) => {

        let TemplateContent = emailTextTemp?.emailTemp?.templateContent;
        if (type == 'mobile') {
            TemplateContent = emailTextTemp?.textTemp?.textTemplateContent;
        }
        TemplateContent = TemplateContent?.replace("@@USERNAME", primaryMemberFullName);
        TemplateContent = TemplateContent?.replace("@@SPOUSENAME", spouseFullName);
        TemplateContent = TemplateContent?.replace("@@ACCPETLINK", linkedAccountDetails?.activationLink);
        TemplateContent = TemplateContent?.replace("@@UNIQUELINK", `${logoutUrl}account/Signin?subtenantId=${subtenantId}`);
        TemplateContent = TemplateContent?.replace("@@SUBTENANTNAME", subtenantName);

        return TemplateContent;
    }

    const sentEmailText = async () => {

        konsole.log("textlinkedAccountDetails", linkedAccountDetails);


        let isEmail = false;
        let isMobile = false;
        let emailJson = ''
        let textJson = ''

        // @@ Email block
        if (emailAddress) {
            isEmail = true
            const { templateType, emailSubject, templateId } = emailTextTemp?.emailTemp;
            const data = emailTextTemp?.commPath;
            konsole.log("textTempDone,data", data[0].commMediumRoles);

            emailJson = $JsonHelper.sendEmailWithCCnBcc({
                emailType: templateType,
                emailSubject,
                emailContent: replaceTemplateForEmail('email'),
                emailFromDisplayName: emailTextTemp?.commPath[0].commMediumRoles[0].fromRoleName,
                emailTemplateId: templateId,
                emailStatusId: 1,
                emailMappingTable: primaryUserId,
                emailMappingTablePKId: primaryUserId,
                createdBy: loggedInUserId,
                emailTo: emailAddress
            })
        }

        // @@ Mobile block
        if (mobileNo) {
            isMobile = true
            const { textTemplateType, textTemplateId } = emailTextTemp?.textTemp;
            textJson = $JsonHelper.sendTextNo({
                smsType: textTemplateType,
                textTo: mobileNo,
                textContent: replaceTemplateForEmail('mobile'),
                smsTemplateId: textTemplateId,
                smsStatusId: 1,
                smsMappingTable: primaryUserId,
                smsMappingTablePKId: primaryUserId,
                createdBy: loggedInUserId
            })
        }

        const jsonObj = {
            // isMobile
            isEmail,
            isMobile,
            emailJson: emailJson,
            mobileJson: textJson,
        }
        useLoader(true);
        const result = await $ApiHelper.$sentMail(jsonObj);
        useLoader(false);
        konsole.log("sendMail", result);
        handleOpenModal(false)
        toasterAlert("successfully", "Successfully", "Invitation sent successfully");
        // handleIsJointAccount(true)


    }



    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default keypress behavior for Tab and Enter keys
        }
    }

    const handleOpenModal = (val) => {
        setIsOpenModal(val)
    }

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }


    // Console logging for debugging
    konsole.log("emailAddress", emailAddress);
    konsole.log("occurranceDetails", occurranceDetails);
    konsole.log("primaryDetails", primaryDetails);
    konsole.log("isOpenModal", isOpenModal, emailTextTemp);
    konsole.log("linkedAccountDetails", linkedAccountDetails);

    return (
        <>
            {(checkJointCondition == 2) ?
               '' :
                <div className="invite-spouse  mb-2 mx-1" id="invite-spouse">
                    <Row className="mb-4">
                        <Col>
                            <Form.Group controlId="formInviteSpouse">
                                <Form.Label className="formInviteSpouse-label">
                                    Invite {_spousePartner} to setup access to portal.
                                </Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        value={emailAddress}
                                        type="email"
                                        disabled
                                        placeholder={`${$AHelper.$capitalizeFirstLetter(_spousePartner)} email address is not available`}
                                    />
                                    <Button className="send-invite-button" onClick={sentInvite}>
                                        <img
                                            src="/New/icons/sent-invite-icon.svg"
                                            alt="User Icon"
                                            className="icon mb-1"
                                        />
                                        Send Invite
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>
                </div>
            }
            <CustomModal
                open={isOpenModal}
                handleOpenModal={handleOpenModal}
                header={'Preview Invite Template'}
                size='lg'
                backClick={() => handleOpenModal(false)}
                refrencePage='InviteSpouse'
                sentBtnClick={sentEmailText}

            >
                <div style={{ minHeight: "50vh", maxHeight: "60vh", height: "100vh", overflowX: "none", overflowY: "scroll" }} className="">
                    <div className="position-relative" style={{ pointerEvents: "none" }} onKeyDown={handleKeyDown}>
                        <div>
                            <div dangerouslySetInnerHTML={{ __html: replaceTempValue(emailTextTemp?.emailTemp?.templateContent) }} id="emailtemplate" contentEditable="false" className="p-0 m-0" />
                        </div>
                        <div className='mt-0 m-5'>
                            <div dangerouslySetInnerHTML={{ __html: replaceTempValue(emailTextTemp?.textTemp?.textTemplateContent) }} id="emailtemplate" contentEditable="false" className="p-0 m-0" />
                        </div>
                    </div>
                </div>



            </CustomModal>

        </>
    );
};





export default InviteSpouse;
