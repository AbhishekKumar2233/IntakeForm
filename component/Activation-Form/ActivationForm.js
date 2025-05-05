import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import SetUpHeader from '../Layout/Header/SetUpHeader';
import { Col, Row } from 'react-bootstrap';
import { CustomInput, CustomMultipleSearchSelect, CustomRadio, CustomSelect, CustomTextarea } from '../Custom/CustomComponent';
import { $Service_Url } from '../../components/network/UrlPath';
import { globalContext } from '../../pages/_app';
import konsole from '../../components/control/Konsole';
import { $CommonServiceFn } from '../../components/network/Service';
import ContactRezex from '../Custom/Contact/ContactRezex';
import PersonalDetails from '../Personal-Information/PersonalDetails';
import { $JsonHelper } from '../Helper/$JsonHelper';
import ContactAndAddress from '../Custom/Contact/ContactAndAddress';
import { CustomButton } from '../Custom/CustomButton';
import Router from "next/router";
import { useLoader } from '../utils/utils'
import { getApiCall, postApiCall, deceaseSpouseRelationId, deceaseMemberStatusId, focusInputBox } from '../../components/Reusable/ReusableCom';
import { separateCountryCodeAndNumber } from '../Custom/Contact/ReusableAddressContact';
import CustomLoader from '../Custom/CustomLoader';
import { selectShowLoader } from '../Redux/Store/selectors';
import { useAppSelector } from '../Hooks/useRedux';
import { $AHelper } from '../Helper/$AHelper';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import { $ApiHelper } from '../Helper/$ApiHelper';
import UniversalAddress from '../Custom/Contact/UniversalAddress';

const $Msg_childDetails = {
    'childCcount': 'Are you sure you would like to add more child?',
}; 

const personalInfoObj = () => {
    return { birthPlace: '', citizenshipId: '187', createdBy: '', createdOn: '', dateOfDeath: '', dateOfWedding: '', dateofDivorce: '', dob: '', fName: '', fileId: '', genderId: '', isActive: '', isPrimaryMember: false, isVeteran: '', lName: '', mName: '', maritalStatusId: '', matNo: '', memberId: '', memberRelationship: '', memberStatusDesc: '', memberStatusId: '', nickName: '', noOfChildren: '', noOfDecease: '', primaryEmail: '', primaryPhone: '', signatureId: '', spouseUserId: '', spousefName: '', subtenantId: '', subtenantName: '', suffixId: '', updatedBy: '', updatedOn: '', userId: '', userPrice: '' };

}
const spouseInfoObj = () => {
return { citizenshipId: '187', createdBy: '', addressTypeId: '1'}
}

const newObjErr = () => ({ maritalStatusId: "", childCcount: "" });

const physicalAddressNeeded = "Please provide the client's physical address.";

const ActivationForm = () => {
    const personalDetailsRef = useRef(null);
    const spouseDetailsRef = useRef(null);
    const addressDetailsRef = useRef(null);
    const contactDetailsRef = useRef(null);
    const { loggedInMemberRoleId } = usePrimaryUserId();
    const showLoader = useAppSelector(selectShowLoader);
    const primaryUserId = sessionStorage.getItem("SessPrimaryUserId")
    const loggedInUser = sessionStorage.getItem("loggedUserId")
    const [maritalDetail, setMaritalDetail] = useState([])
    const [maritalStatusId, setMaritalStatusId] = useState('')
    const [planningInput, setplanningInput] = useState('')
    const [noOfChild, setNoOfChild] = useState('')
    // const [matNo, setMatNo] = useState('')
    const { newConfirm, setWarning } = useContext(globalContext);
    const [samePrimaryAddress, setSamePrimaryAddress] = useState(false)
    // const [attendSeminar, setattendSeminar] = useState('');
    const [formlabelQuestion, setFormlabelQuestion] = useState({});
    const [formlabelData, setFormlabelData] = useState({});
    const [selectedValue, setSelectedValue] = useState([]);
    const [hearAboutOther, sethearAboutOther] = useState("");
    const [personalInfo, setPersonalInfo] = useState({})
    const [spouseInfo, setSpouseInfo] = useState({})
    const [contactInfo, setContactInfo] = useState({})
    const [addressId, setAddressId] = useState({})
    const [errMsg, setErrMsg] = useState(newObjErr());
    const [personalDetails, setPersonalDetails] = useState({ ...personalInfoObj() })
    const [spouseDetailsObj, setSpouseDetailsObj] = useState({ ...spouseInfoObj() })

    const showMatterNo = (loggedInMemberRoleId == 1 || loggedInMemberRoleId == 9 || loggedInMemberRoleId == 10) ? false : true;

    const mergePersonalInfo = () => {
        const updatedPersonalDetails = { ...personalDetails };

        Object.keys(personalDetails).forEach((key) => {
            if (!personalDetails[key] && personalInfo[key]) {
                updatedPersonalDetails[key] = personalInfo[key];
            }
        });

        setPersonalDetails(updatedPersonalDetails);
    };

    useEffect(() => {
        if (Object.keys(personalInfo).length > 0) {
            mergePersonalInfo();
        }
    }, [personalInfo]);

    useEffect(() => {
        useLoader(true)
        fectchsubjectForFormLabelId()
        fetchMemberDetailsById()
        fetchApiData($Service_Url.getMaritalStatusPath, setMaritalDetail);
        fetchApiData(`${$Service_Url.getcontactdeailswithOther}${primaryUserId}`, setContactInfo);
        useLoader(false)
    }, [])

    useEffect(() => {
        if(contactInfo?.contact) {
            const _emailData = contactInfo?.contact?.emails?.[0]?.emailId;
            const _mobileData = separateCountryCodeAndNumber(contactInfo?.contact?.mobiles?.[0]?.mobileNo);
            contactDetailsRef?.current?.setContactValues({
                email: _emailData,
                mobileNumber: _mobileData?.number,
                countryCode: _mobileData?.countryCode ?? "+1",
            })
        }
    }, [contactInfo])

    const fetchApiData = (path, stateSetter) => {
        $CommonServiceFn.InvokeCommonApi('GET', path, '', (res, err) => {
            if (res) stateSetter(res?.data?.data);
        });
    };

    const fetchMemberDetailsById = () => {
        $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getFamilyMemberbyID + userId , "", (response, error) => {
            if (response) {
            konsole.log('getFamilyMemberbyIDPrimary', response)
            let responseData = response?.data?.data?.member
            setPersonalInfo(responseData);
            konsole.log(responseData,"hdahdshsdhshdshdshdshdshdsh")
            setSpouseDetailsObj(prev => ({ ...prev, ['lName']: responseData.lName }));
            setPersonalDetails({ ...personalDetails, ...responseData, updatedBy: loggedInId, citizenshipId: 187 })
                (responseData.maritalStatusId == 1 || responseData.maritalStatusId == 2) && fetchSpouseDetailsByIdSpouse(responseData?.spouseUserId);
            konsole.log('responseData', responseData)
            } else {
            konsole.log('getFamilyMemberbyID', error)
            }
        })
    }
    const fetchSpouseDetailsByIdSpouse = (userID) => {
        $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getFamilyMemberbyID + userID , "", (response, error) => {
            if (response) {
            konsole.log('getFamilyMemberbyIDSpouse', response)
            let responseData = response?.data?.data?.member
            setSpouseInfo(responseData);
            let { fName, mName, lName, dob, citizenshipId, genderId, dateOfDeath } = responseData
            spouseDetailsObj(prevSpouseInfo => ({
                ...prevSpouseInfo, fName: fName || '', mName: mName || '', lName: lName || '', dob: dob || '', Gender: genderId || '0', citizenshipId: citizenshipId || '187', dateOfDeath: dateOfDeath || ''
            }));
            konsole.log('responseData', responseData)
            } else {
            konsole.log('getFamilyMemberbyID', error)
            }
        })
    }
    
    const userId = primaryUserId;
    const fectchsubjectForFormLabelId = async () => {
        // const questionFormLabelId = [1009, 1039, 1040];
        const questionFormLabelId = [1009, 1040];

        useLoader(true);
        const formQuestion = await $ApiHelper.$getSujectQuestions(questionFormLabelId);
        const questionObj = formQuestion?.reduce((TempResult, curElement) => {
            if(curElement) TempResult["label" + curElement.formLabelId] = curElement;
            konsole.log("sdbkjv", TempResult, curElement);
            return TempResult;
        }, {});
        konsole.log("wbskjvbskj", questionObj);
        setFormlabelQuestion(questionObj);
        useLoader(false);
        
        konsole.log("bsdkjbk", formQuestion)
        if(formQuestion != 'err') {
            useLoader(true);
            let apiCalls = formQuestion.map(obj => {
                let url = $Service_Url.getSubjectResponse + userId + `/0/0/${obj?.question?.questionId}`;
                return getApiCall('GET', url).then(result => {
                    konsole.log("API call result", result);
                    if (result != 'err' && result?.userSubjects.length > 0) {
                        return result.userSubjects;
                    } else {
                        return null;
                    }
                }).catch(error => {
                    konsole.log("API call error:", error);
                    return null;
                });
            });

            Promise.all(apiCalls).then((results) => {
                konsole.log("resultsresults", results)
                let questionResponse = results?.filter(response => response !== null)?.flat(1);
                konsole.log("questionsInHelper", questionResponse, questionResponse?.filter(ele => ele.questionId == questionObj?.label1009?.question?.questionId)?.map(ele => ({[ele.responseId]: true})));
                setFormlabelData(questionResponse);
                setSelectedValue(questionResponse?.filter(ele => ele.questionId == questionObj?.label1009?.question?.questionId)?.reduce((tempRslt, ele) => ({...tempRslt, [ele.responseId]: true}), {}));
                sethearAboutOther(questionResponse?.find(ele => ele.questionId == questionObj?.label1009?.question?.questionId && ele.responseId == '419')?.response ?? "");
            }).catch((error) => {
                konsole.log(error);
            }).finally(() => useLoader(false));
        }
    }

    const updateContact = async () => {
        const contactObject = contactDetailsRef?.current?.getContactValues()
        if(contactObject?.mobileNumber?.length < 10) return false;

        const { contactTypeId, commTypeId, contactId } = contactInfo?.contact?.mobiles[0];
        const newJson = { contactTypeId, mobileNo: contactObject?.countryCode + contactObject?.mobileNumber, commTypeId, updatedBy: loggedInUser, contactId };
        const res = await saveContactDetails([newJson]);
        return res == "response" ? true : false;
    }

    async function saveContactDetails( mobileObject ) {
        const method = 'PUT';
        const url = $Service_Url.updateContactWithOtherDetailsPath;
        const jsonobj = {
          "userId": userId,
          "activityTypeId": '4',
          "contact": {
            'mobiles': mobileObject
          }
        };

        return new Promise((resolve, reject) => {
            useLoader(true)
          $CommonServiceFn.InvokeCommonApi(method, url, jsonobj, (res, err) => {
            useLoader(false)
            if (res) {
              konsole.log("apifuncallres", res);
              resolve('response');
            } else {
              konsole.log("apifuncallerr", err);
              resolve('reject');
            }
          });
        });
    }

    const validateFields = async () => {
        const personalDetailsValid = await personalDetailsRef?.current?.validatePersonalDetail();
        const spouseDetailsValid = (maritalStatusId == '1' || maritalStatusId == '2' || maritalStatusId == "4")
            ? await spouseDetailsRef?.current?.validatePersonalDetail() 
            : true;
        const isContactValid = contactDetailsRef?.current?.checkValidContact();
        const isNoAddressIssue = (samePrimaryAddress) ? addressDetailsRef.current?.isValidateAddress() : true;
        if(personalDetailsValid && spouseDetailsValid && isContactValid && (isNoAddressIssue != true)) setWarning("warning", physicalAddressNeeded)
        if(isContactValid != true) focusInputBox('activatonContact');
        return { personalDetailsValid, spouseDetailsValid, isContactValid, isNoAddressIssue}; 
    };
    
    const detailsContactFields = async () => {
        const contactSubmit = await updateContact();
        const contactHandleSubmit = await addressDetailsRef?.current?.handleSubmit(); 
    
        return contactHandleSubmit?.isActive;
    };
    
    const formSubmit = async () => {
        const { personalDetailsValid, spouseDetailsValid, isContactValid, isNoAddressIssue } = await validateFields();
        console.log(personalDetailsValid, spouseDetailsValid, "nxcxnxncxncxncxncxnc");

        if (!maritalStatusId || maritalStatusId == '') {
            setErrMsg((prevState) => ({
                ...prevState,
                maritalStatusId: 'Relationship status cannot be blank',
            }));
            focusInputBox('maritalStatusId')
            return;
        } else if (personalDetailsValid && spouseDetailsValid && isContactValid && isNoAddressIssue) {
            // return;
            const addressSaved = await detailsContactFields();
            konsole.log("eandvkjbsdjk", addressSaved);
            if(addressSaved != true) return;
            await upsertMetaData();
            // await fectchsubjectForFormLabelId();
            await updateMemberDetails("primary");
        }
    };

    konsole.log("dnbakjvbjd", Object.entries(selectedValue))
    
    const upsertMetaData = () => {
        let dataToUpsert = []
        // attendSeminar res
        // if(attendSeminar?.value) dataToUpsert?.push({
        //     responseId: attendSeminar?.value,
        //     subResponseData: attendSeminar?.label,
        //     subjectId: formlabelQuestion?.label1039?.question?.questionId,
        //     userId: userId,
        //     userSubjectDataId: 0
        // })

        // planning res
        dataToUpsert?.push({
            responseId: formlabelQuestion?.label1040?.question?.response?.[0]?.responseId,
            subResponseData: planningInput,
            subjectId: formlabelQuestion?.label1040?.question?.questionId,
            userId: userId,
            userSubjectDataId: 0
        })

        // heard about us
        const selectedHeard = Object.entries(selectedValue)?.filter(ele => ele[1] == true)?.map(ele => ele[0]);
        const prevUserSubjectMapIds = formlabelData?.filter(ele => ele?.questionId == formlabelQuestion?.label1009?.question?.questionId)?.map(ele => ({...ele, subResponseData: null}));
        const heardToUpsert = selectedHeard?.map((ele, indx) => {
            return {    
                responseId: Number(ele),
                subResponseData: formlabelQuestion?.label1009?.question?.response?.find(itm => itm?.responseId == ele)?.response,
                subjectId: formlabelQuestion?.label1009?.question?.questionId,
                userId: userId,
                userSubjectDataId: 0,
            }
        })
        if(heardToUpsert?.length) dataToUpsert?.push(...heardToUpsert);
        if(selectedValue?.['418'] == true) dataToUpsert.push({
            responseId: Number('419'),
            subResponseData: hearAboutOther,
            subjectId: formlabelQuestion?.label1009?.question?.questionId,
            userId: userId,
            userSubjectDataId: 0,
        })
        if(prevUserSubjectMapIds?.length) postApiCall("PUT", $Service_Url.putSubjectResponse, {userId: userId, userSubjects: prevUserSubjectMapIds});
    
        if (dataToUpsert?.length) {
            useLoader(true)
            postApiCall("POST", $Service_Url.postaddusersubjectdata, dataToUpsert);
            useLoader(false)
        }
    
        konsole.log("upsertData:", dataToUpsert, prevUserSubjectMapIds);
    };    

    const sessionStore = (responseData, spouseName) => {
        const userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
        const mName = responseData.mName !== null && responseData.mName !== "" ? " " + responseData.mName + " " : " ";
        userDetailOfPrimary.memberName = responseData.fName + mName + responseData.lName;
        userDetailOfPrimary.usermob = responseData.fName + ' ' + responseData.lName;
        userDetailOfPrimary.spouseName = spouseDetailsObj.fName
        konsole.log('userDetailOfPrimary', userDetailOfPrimary)
    
        sessionStorage.setItem("userDetailOfPrimary", JSON.stringify(userDetailOfPrimary));
        if (responseData?.spouseUserId !== '00000000-0000-0000-0000-000000000000') {
          sessionStorage.setItem("spouseUserId", responseData?.spouseUserId);
        }
        if(responseData?.maritalStatusId) {
          sessionStorage.setItem("maritalStatusId", responseData?.maritalStatusId);
        }
    }

    const handleResponse = (res, userType) => {
        const responseData = res?.data?.data?.member;

        if ((responseData?.maritalStatusId == '1' || responseData?.maritalStatusId == '2') && userType === "primary") {
            const _spouseUserId = responseData?.spouseUserId;    
            if (_spouseUserId && _spouseUserId !== '00000000-0000-0000-0000-000000000000') {
                getUserAddressDataById(responseData);
            }
        }
        sessionStore(responseData); 
        // validateFields(); 
        dashBoardRoute()
    };
    
    const updateMemberDetails = (userType) => {
            
        let initialRequestBody = {
            ...personalDetails,
            isPrimaryMember: personalDetails?.isPrimaryMember ?? false, // to handle null value
            noOfChildren: noOfChild,
            maritalStatusId: maritalStatusId
        };
        useLoader(true)
        $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUpdateMember, initialRequestBody, (res, error) => {
            useLoader(false)
            if (res) {
                handleResponse(res, userType);
                if (maritalStatusId == 1 || maritalStatusId == 2) {
                    const loginUserId = sessionStorage.getItem("loggedUserId");
                    const requestBodySpouse = {
                        userId: res?.data?.data?.member?.spouseUserId || null,
                        fName: spouseDetailsObj?.fName,
                        mName: spouseDetailsObj?.mName,
                        lName: spouseDetailsObj?.lName,
                        dob: spouseDetailsObj?.dob || '',
                        genderId: spouseDetailsObj?.genderId === 0 ? null : spouseDetailsObj?.genderId,
                        isPrimaryMember: false,
                        maritalStatusId: null,
                        citizenshipId: spouseDetailsObj?.citizenshipId,
                        memberRelationship: res?.data?.data?.member?.memberRelationship || null,
                        updatedBy: loginUserId,
                    };
                    let updatedRequestBodySpouse = { ...requestBodySpouse };
                    useLoader(true)
                    $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUpdateMember, updatedRequestBodySpouse, (res2, error2) => {
                        useLoader(false)
                        if (res2) {
                            setSpouseUserId(res2)
                            konsole.log("Spouse details updated", res2);
                        }
                    });
                } else if (maritalStatusId == 4) {
                    const loginUserId = sessionStorage.getItem("loggedUserId");
                    const requestBodyDec = {
                        subtenantId: String(res?.data?.data?.member?.subtenantId),
                        fName: spouseDetailsObj?.fName || '',
                        mName: spouseDetailsObj?.mName || '',
                        lName: spouseDetailsObj?.lName || '',
                        nickName: '',
                        memberStatusId: deceaseMemberStatusId || '',
                        maritalStatusId: null,
                        noOfChildren: "0",
                        dateOfDeath: spouseDetailsObj?.dateOfDeath || '',
                        memberRelationship: '',
                        genderId: spouseDetailsObj?.genderId === 0 ? null : spouseDetailsObj?.genderId,
                        suffixId: '',
                        dob: spouseDetailsObj?.dob || '',
                        citizenshipId: spouseDetailsObj?.citizenshipId || '',
                        birthPlace: '',
                        isPrimaryMember: false,
                        createdBy: loginUserId || '',
                    };
                
                    const memberRelationshipJson = {
                        primaryUserId: userId,
                        relationshipTypeId: deceaseSpouseRelationId,
                        rltnTypeWithSpouseId: '',
                        isFiduciary: false,
                        isBeneficiary: false,
                        relativeUserId: userId,
                        isEmergencyContact: false,
                    };
                    let updatedRequestBodyDec = {
                        ...requestBodyDec,
                        memberRelationship: memberRelationshipJson,
                    };
                    useLoader(true)
                    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postAddMember, updatedRequestBodyDec, (res2, error2) => {
                        useLoader(false)
                        if (res2) {
                            konsole.log("Deceased member details updated", res2);
                        }
                    });
                }
            }
        });
    };

    const dashBoardRoute = () => {
        sessionStorage.setItem('activateform', true)
        sessionStorage.setItem('isActivateform', true)
        Router.push({ pathname: './setup-dashboard', search: '?query=' + userId, state: {   userid: userId, }})
    }

    const getUserAddressDataById = (responseData) => {
        return new Promise(async (resolve, reject) => {
          if ($AHelper?.$isNotNullUndefine(userId)) {
            const _resultOf = await getApiCall('GET', $Service_Url.getAllAddress + userId, '')
            resolve(_resultOf)
            const primaryAddressDetails = _resultOf?.addresses?.filter((ele) => { return ele?.addressTypeId == 1 })
            const addressIdPrimary = primaryAddressDetails?.[0]?.addressId;
            konsole.log(addressIdPrimary,"asjdsjfsjndsjfsdjfdsjf")
            setAddressId(addressIdPrimary)
            handleRadioOcc(responseData, addressIdPrimary)
          } else {
            resolve('err')
          }
    
        })
    
      }
    const handleRadioOcc = async (responseData, addressIdPrimary) => {
        useLoader(true)
        const loginUserId = sessionStorage.getItem("loggedUserId");
        let postAddress = {
        userId: responseData.spouseUserId,
        sameAsUserId: userId,
        addressId: addressIdPrimary,
        isActive: samePrimaryAddress == true,
        createdBy: loginUserId,
        updatedBy: loginUserId,
        };
    
        let apiTYPE = samePrimaryAddress == true ? "POST" : "PUT";
        const _resultGetActivationLinkActivation = await postApiCall(apiTYPE, $Service_Url.postMemberAddress, postAddress);
    
        useLoader(false);
        if (_resultGetActivationLinkActivation == "err") {
        konsole.log(_resultGetActivationLinkActivation,"sdjsjdsjdsjdsjdsjdsjds")
        return;
        }
        // dashBoardRoute()
    }

    const handleSelect = (key, value) => {
        setMaritalStatusId(value);
    }   

    const handleChange = async (key, value) => {
        const parsedValue = parseInt(value, 10);
        
        if (parsedValue > 10 && noOfChild <= 10) {
            const confirmRes = await newConfirm(true, $Msg_childDetails.childCcount, "Confirmation", "Confirmation", 0)
            if(confirmRes == false) return;
        } else {
            setErrMsg((prev) => ({
                ...prev,
                childCcount: '',
            }));
        }
        konsole.log("dsbvjhd", value, noOfChild);
        setNoOfChild(value); 
    };

    // const handleChangeMatNo = (key, value) => {
    //     setMatNo(value)
    // }   
    
    const handleSelectMultiple = (key, value) => {
        konsole.log("dnvsnlvn", value);
        setSelectedValue(value);
    }

    konsole.log("dazbvkjb", selectedValue, formlabelData, formlabelData?.label1009?.response?.map(item => ({ label: item.response, value: item.response })));

    return (
        <>
        {showLoader && <CustomLoader />}
        <div id='ActivationForm'>
            <Col>
                <Row className='headerActivationForm'>
                    <SetUpHeader parentReference="ActivationForm" />
                </Row>
                <Row className='bodyActivationForm m-5 mb-0'>
                    <Col className='dataActivationForm'>
                        <Row>
                            <p className='heading'>
                                Welcome to The Life Plan Organizer!
                            </p>
                        </Row>
                        <Row>
                            <p className='subHeading'>
                                Please complete the below form:
                            </p>
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col className='activationScroll'>
                <Row className='formActivationForm m-5 mb-0 p-3'>
                    <Row className='dataMainHead'>
                        <Col className='dataMainHeadBorder px-0 pt-2 pb-4'>
                            <Row>
                                <p className='detailsHeading'>Personal Details</p>
                            </Row>
                            <Row>
                                <p className='detailsSubHeading'>
                                    Tell us a little bit about yourself
                                </p>
                            </Row>
                        </Col>
                    </Row>
                </Row>
                <Row className='formActivationForm mx-5 mb-0 px-3'>
                    <Row className='dataMainHead'>
                        <Col className='px-0 dataMainHeadBorder pt-2 pb-4'>
                            <Row className='useNewDesignSCSS'>
                                <Col xs={3}>
                                    <CustomSelect
                                        tabIndex={1}
                                        isPersonalMedical={true}
                                        id='maritalStatusId'
                                        label='Relationship Status*'
                                        placeholder='Select'
                                        options={maritalDetail}
                                        value={maritalStatusId}
                                        onChange={(e) => handleSelect('maritalStatusId', e?.value)}
                                    />
                                    {(!maritalStatusId || maritalStatusId == '') && (
                                        <><span className="err-msg-show">{errMsg.maritalStatusId}</span></>
                                    )}
                                </Col>
                                <>{konsole.log(maritalDetail,"jdjsjdsjdsd")}</>
                                <Col xs={3}>
                                    <CustomInput
                                        tabIndex={2}
                                        isPersonalMedical={true}
                                        allowNegativeValue={false}
                                        value={noOfChild}
                                        placeholder='Enter no of children'
                                        label='No of Children'
                                        onChange={(e) => handleChange('noOfChildren', e)}
                                    />
                                    {errMsg.childCcount && (
                                        <span className="err-msg-show">{errMsg.childCcount}</span> 
                                    )}
                                </Col>
                                <Col xs={6} className='contactDivMainActivation'>
                                    <ContactAndAddress
                                        isContactForm={true}
                                        refrencePage='activationForm'
                                        ref={contactDetailsRef}
                                        userId={userId}
                                        primaryUserId={userId}
                                        showType="contact"
                                        showOnlyForm={true}
                                        setPersonalDetails={setPersonalDetails}
                                        startTabIndex={3}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Row>
                <Row className='formActivationForm mx-5 mb-0 px-3'>
                    <Row className='dataMainHead'>
                        <Col className='px-0 dataMainHeadBorder pt-2 pb-4'>
                            <Row className='useNewDesignSCSS gap-3'>
                                <Col className='activationFormInformation'>
                                    <p className='mt-4 headingActivationFormAddress'>{`${personalInfo?.fName || ''} ${personalInfo?.mName || ''} ${personalInfo?.lName || ''}'s Information`.trim()}</p>
                                    <Row className='mt-4'>
                                        <PersonalDetails 
                                            userId={userId}
                                            isActivationForm={true}
                                            ref={personalDetailsRef}
                                            // type={"Personal"}
                                            refrencePage='activationForm'
                                            action='EDIT'
                                            dataInfo={personalDetails}
                                            setPersonalDetails={setPersonalDetails}
                                            startTabIndex={4 + 18}
                                        />
                                    </Row>
                                </Col>
                                <Col className='activationFormInformation'>
                                    <p className='mt-4 headingActivationFormAddress'>Address Information</p>
                                    <Row className='mt-4'>
                                    {/* <ContactAndAddress
                                        isActivationForm={true}
                                        refrencePage='activationForm'
                                        ref={addressDetailsRef}
                                        isMandotry={false}
                                        userId={userId}
                                        primaryUserId={userId}
                                        showType="address"
                                        showOnlyForm={true}
                                        setPersonalDetails={setPersonalDetails}
                                        startTabIndex={22 + 16}
                                    /> */}
                                    <UniversalAddress
                                     isActivationForm={true}
                                     refrencePage='activationForm'
                                     ref={addressDetailsRef}
                                     isMandotry={false}
                                     userId={userId}
                                     primaryUserId={userId}
                                     showType="address"
                                     showOnlyForm={true}
                                     setPersonalDetails={setPersonalDetails}
                                     startTabIndex={22 + 16}
                                    
                                    />
                                    </Row>
                                </Col>
                                {(maritalStatusId !== '3' && maritalStatusId !== '5' && maritalStatusId !== '') && (
                                <Col className='activationFormInformation'>
                                    <p className='mt-4 headingActivationFormAddress'> {`${maritalStatusId == '2' ? "Partner's" : "Spouse's"} Information`}</p>
                                    <Row className='mt-4'>
                                        <PersonalDetails 
                                            {...(maritalStatusId == '4' && { isWidowed: true })}
                                            isActivationForm={true}
                                            ref={spouseDetailsRef}
                                            refrencePage='activationForm'
                                            action='EDIT'
                                            userId={userId}
                                            type={maritalStatusId == '2' ? "Partner" : "Spouse"}
                                            isWidow = {maritalStatusId == '4'}
                                            dataInfo={spouseDetailsObj}
                                            setPersonalDetails={setSpouseDetailsObj}
                                            startTabIndex={22 + 16 + 18}
                                        />
                                    </Row>
                                    {maritalStatusId !== '4' && (
                                    <Row>
                                        <Col>
                                            <CustomRadio
                                                tabIndex={22 + 16 + 18 + 16 + 1}
                                                value={samePrimaryAddress}
                                                options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]}
                                                placeholder={`Does your ${maritalStatusId == 2 ? "partner" : "spouse"} live with you?`}
                                                onChange={(selectedItem) => {
                                                    if(selectedItem?.value == true && addressDetailsRef.current?.isValidateAddress() != true) return setWarning("warning", physicalAddressNeeded);
                                                    setSamePrimaryAddress(selectedItem?.value);
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    )}
                                </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Row>
                <Row className='formActivationForm mx-5 mb-0 px-3'>
                    <Row className='dataMainHead'>
                        <Col className='px-0 dataMainHeadBorder pt-2 pb-4'>
                            <Row className='useNewDesignSCSS gap-3 bottomDiv'>
                                {showMatterNo && (
                                <Col className='activationFormInformationBelow'>
                                    <CustomInput prefix=''
                                        tabIndex={22 + 16 + 18 + 16 + 1 + 1}
                                        isPersonalMedical={true}
                                        allowNegativeValue={false}
                                        value={personalDetails?.matNo} 
                                        placeholder='Enter matter no'
                                        label='Matter No.'
                                        // isSmall={true}
                                        onChange={(e) => setPersonalDetails(oldState => ({...oldState, 'matNo': e}))}
                                    />
                                </Col>
                                )}
                                <Col className='activationFormInformationBelow' xs={showMatterNo ? (maritalStatusId == 1 || maritalStatusId == 2 || maritalStatusId == 4) ? 8 : 6 : 12}>
                                    <CustomMultipleSearchSelect
                                        tabIndex={22 + 16 + 18 + 16 + 1 + 1 + 1 +1}
                                        isPersonalMedical={true}
                                        id='formlabelDataId'
                                        label={formlabelQuestion?.label1009?.question?.question}
                                        placeholder='Select'
                                        options={formlabelQuestion?.label1009?.question?.response?.map(item => ({ label: item.response, value: item.responseId }))?.sort((a, b) => (b?.label == 'Other') ? 1 : (a?.label == 'Other') ? -1 : 0)}
                                        selectedValues={selectedValue}
                                        onChange={(e) => handleSelectMultiple('formlabelDataId', e)}
                                        showOtherInput={true}
                                        otherInputValue={hearAboutOther}
                                        setOtherValue={(e) => sethearAboutOther(e)}
                                    />
                                </Col>
                                {konsole.log("sdbvjkbs", hearAboutOther)}
                                {/* <Col className='activationFormInformationBelow' >
                                    <CustomRadio
                                        value={attendSeminar?.value}
                                        options={
                                            formlabelQuestion?.label1039?.question?.response
                                                ?.filter(item => item.response !== null)
                                                ?.map(item => ({
                                                    label: item.response,
                                                    value: item.responseId,
                                                })) || []
                                        }
                                        placeholder={formlabelQuestion?.label1039?.question?.question}
                                        onChange={(selectedItem) => {
                                            setattendSeminar(selectedItem);
                                        }}
                                    />
                                </Col> */}
                            </Row>
                        </Col>
                    </Row>
                </Row>
                <Row className='formActivationForm mx-5 mb-0 px-3'>
                    <Row className='dataMainHead'>
                        <Col className='px-0 dataMainHeadBorder pt-2 pb-4'>
                            <Row className='useNewDesignSCSS'>
                                <Col xs={12} md={12} lg={12}>
                                    <CustomTextarea
                                        tabIndex={22 + 16 + 18 + 16 + 1  + 1 + 1 + 1 + 1 + 1}
                                        isPersonalMedical={true}
                                        value={planningInput}
                                        placeholder='Enter planning objective'
                                        label={formlabelQuestion?.label1040?.question?.question}
                                        onChange={setplanningInput}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Row>
                <Row className='formActivationForm mx-5 mb-0 px-3'>
                    <Row className='dataMainHead'>
                        <Col className='useNewDesignSCSS my-5 pt-4 pb-2'>
                            <CustomButton tabIndex={22 + 16 + 18 + 16 + 1  + 1 + 1 + 1 + 1 + 1 + 1 + 1 }  label={`Submit & Proceed`} onClick={formSubmit} />
                        </Col>
                    </Row>
                </Row>
            </Col>
        </div>
        </>
    )
}

export default ActivationForm;
