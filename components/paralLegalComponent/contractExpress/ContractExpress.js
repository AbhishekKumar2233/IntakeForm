import React, { useEffect, useState } from 'react'
import { Form, NavItem } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { connect } from 'react-redux';
import { showContractPdf } from '../../control/Constant';
import konsole from '../../control/Konsole';
import { $CommonServiceFn, $getServiceFn } from '../../network/Service';
import { $Service_Url } from '../../network/UrlPath';
import { SET_LOADER } from '../../Store/Actions/action';
import { clientInfo, docList, getXMLObj, getJSONXML, jsonforArray, jsonObj, memberCount, Parameters, ParametersObj, getJSONXMLmultiValue } from './xml';
import { $AHelper } from '../../control/AHelper';
import { getApiCall, isNotValidNullUndefile } from '../../Reusable/ReusableCom';

const ContractExpress = (props) => {
    const [templateList, setTemplateList] = useState([]);
    const [docsExist, setDocExists] = useState(false);
    const [contactId, serContactId] = useState('');
    const templateReferenceName = 'Estate Planning v2';
    const [numPages, setNumPages] = useState(null);
    const [show, setShow] = useState(false);
    const [address, setAddress] = useState({});
    const [maritalStatusList, setmaritalStatusList] = useState([]);
    const [checkbox, setCheckBox] = useState(false);
    const [countPerson, setCountPerson] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [array, setArray] = useState([]);
    const [json, setJson] = useState({
        "Session": {
            "Variable": [],
            "Parameter": []
        }
    });

    useEffect(() => {
        if (props.client.memberId !== undefined) {
            // fetchSavedAddress(props.client.memberId);
            // getContractDetail();
            konsole.log("client", props.client);
            getContractByUserId(props.client.memberId)
        }

    }, [props.client]);


    const getContractByUserId = (userId) => {
        props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getUserContract + `/${userId}`, { templateName: templateReferenceName }, (response, error) => {
            konsole.log("contractByUserId", response)
            props.dispatchloader(false)
            if (response) {
                if (response.data.data.length > 0) {
                    setDocExists(true);
                    serContactId(response?.data?.data[0]?.contractId)
                    fetchMaritalStatusList();
                }
                else if (response.data.data.length == 0) {
                    fetchMaritalStatusList();
                }
            }
            else if (error) {
                
                fetchMaritalStatusList();
            }

        })
    }


    const fetchContraactTemplates = () => {
        props.dispatchloader(true);
        $CommonServiceFn.InvokeContractApi("GET", $Service_Url.getTemplates, "", (response, error) => {
            props.dispatchloader(false);
            if (response) {
                konsole.log("reponseContract", response);
                const fetchedTemplate = response.data.filter((value) => { return value.reference == templateReferenceName })[0]
                konsole.log("teemplate reference", templateReferenceName);
                if(isNotValidNullUndefile(contactId)){
                    updateContractDocument(fetchedTemplate.version);
                }else{

                    createContractDocument(fetchedTemplate.version);
                }
            }
            else if (error) {
                props.dispatchloader(false);
            }
        })
    }



    const fetchFamilyMembers = (userid, maritalStatusList) => {
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFamilybyParentID + userid,
            "", (response) => {
                props.dispatchloader(false);
                if (response) {

                    const { fName, mName, lName, } = response.data.data[0];
                    const fullName = [fName, mName, lName].filter(Boolean).join(' ');
                    const spouserUserId = null;
                    const spousefullName = null;

                    if (response.data.data[0].maritalStatusId == 1 || response.data.data[0].maritalStatusId == 2) {
                        spouserUserId = response.data.data[0].children[0].userId;
                        const { fName, mName, lName, } = response.data.data[0].children[0];
                        spousefullName = [fName, mName, lName].filter(Boolean).join(' ');

                    }



                    fetchSavedContactDetails("Person", response.data.data[0], maritalStatusList, response.data.data[0].userId, 'Self');
                    fetchFinancialDetails(response.data.data[0].userId, fullName, spouserUserId, spousefullName);
                    fetchUserAgentDetails(response.data.data[0].userId, fullName, spouserUserId, spousefullName);
                    //fetchFidAssginmentDetails(response.data.data[0].userId, fullName, spouserUserId, spousefullName);
                    subjectApiFamilyMedicalLivingWill(response.data.data[0].userId, fullName, spouserUserId, spousefullName);
                    fetchProfessionalData(response.data.data[0].userId, fullName, spouserUserId, spousefullName)

                    if (response.data.data[0].maritalStatusId == 1 || response.data.data[0].maritalStatusId == 2) {
                        const spouseMember = response.data.data[0].children;
                        const childMemberList = $AHelper.deceasedNIncapacititedFilterFun(spouseMember[0].children)
                        // const childMemberDetails =childMemberList.filter((response)=> {return response.isFiduciary == true || response.isBeneficiary == true});
                        fetchSavedContactDetails("Person", spouseMember[0], maritalStatusList, spouseMember[0].userId, "primaryMemberSpouse");
                        if (childMemberList.length > 0) {
                            json.Session.Variable = [...json.Session.Variable, memberCount("ChildCount", childMemberList.length)]
                            let i = 1;
                            for (let children of childMemberList) {                                
                                fetchSavedContactDetails("Person", children, maritalStatusList, children.userId, "primaryChildren");
                                if (children.maritalStatusId == 1 || children.maritalStatusId == 2) {                                    
                                    if (children.children.length > 0 && children?.children[0].isFiduciary == true) {                                       
                                        fetchSavedContactDetails("Person", children.children[0], maritalStatusList, children.children[0].userId, 'childrenSpouse');
                                    }

                                    if (children.children.length > 0 && children.children[0].children.length > 0) {
                                        for (let child of children.children[0].children) {
                                            if (child.isFiduciary == true) {
                                                fetchSavedContactDetails("Person", child, maritalStatusList, child.userId, "primaryGrandChild");
                                            }
                                        }
                                    }
                                }
                                else {
                                    if ($AHelper.deceasedNIncapacititedFilterFun(children.children).length > 0) {
                                        for (let child of $AHelper.deceasedNIncapacititedFilterFun(children.children)) {
                                            if (child.isFiduciary == true) {
                                                fetchSavedContactDetails("Person", child, maritalStatusList, child.userId, "primaryGrandChild");
                                            }
                                        }
                                    }
                                }
                                i++;
                            }
                        }
                    }
                    else {
                        const childMemberInfo = response.data.data[0].children;
                        if (childMemberInfo.length > 0) {
                            let i = 1;
                            for (let children of childMemberInfo) {
                                fetchSavedContactDetails("Person", children, maritalStatusList, children.userId, "primaryChildren");
                                if (children.maritalStatusId == 1 || children.maritalStatusId == 2) {
                                    if(children.children[0].length>0 && children.children[0].isFiduciary ==true)
                                    {
                                        fetchSavedContactDetails("Person", children.children[0], maritalStatusList, children.userId, "childrenSpouse");
                                    }
                                    if ($AHelper.deceasedNIncapacititedFilterFun(children.children).length > 0) {
                                        for (let child of $AHelper.deceasedNIncapacititedFilterFun(children.children[0].children)) {
                                            konsole.log("children ", child);
                                            if(child.isFiduciary==true)
                                            {
                                                fetchSavedContactDetails("Person", child, maritalStatusList, child.userId, "childrenGrandChild");
                                            }
                                        }
                                    }
                                }
                                else {
                                    for (let child of $AHelper.deceasedNIncapacititedFilterFun(children.children)) {
                                    if(child.isFiduciary==true)
                                    {
                                        fetchSavedContactDetails("Person", child, maritalStatusList, child.userId, "childrenGrandChild");
                                    }
                                }
                                }
                                i++;
                            }
                        }
                    }
                }
            })
    }


    const fetchMaritalStatusList = (userid, maritalStatusList) => {
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getMaritalStatusPath, "", (response) => {
            if (response) {
                props.dispatchloader(false);
                konsole.log("maritalstatus", response.data.data);
                setmaritalStatusList(response.data.data)
                fetchFamilyMembers(props.client.memberId, response.data.data);
                fetchFidMemberbyUserId(props.client.memberId, response.data.data);
            }
        }
        );
    };

    const fetchSavedContactDetails = (memberType, member, maritalStatusList, userid, memberRelationshipName) => {
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAllContactOtherPath + userid, "", (response) => {
            if (response) {
                props.dispatchloader(false);
                const contact = response.data.data.contact;
                props.dispatchloader(true);
                fetchSavedAddress(userid, (fetchedAddess) => {
                    props.dispatchloader(false);
                    konsole.log("fetchedAdress", fetchedAddess);
                    if (fetchedAddess) {
                        const physicalAddress = fetchedAddess.filter((address) => { return (address.addressTypeId == 1) })
                        const mailingAddress = fetchedAddess.filter((address) => { return (address.addressTypeId == 2) })
                        const contactMobile = contact.mobiles.map((contact, index) => {
                            if (contact.contactTypeId == 1) {
                                return { phone1: contact.mobileNo }
                            }
                            if (contact.contactTypeId == 2) {
                                return { phone2: contact.mobileNo }
                            }
                            if (contact.contactTypeId == 3) {
                                return { phone3: contact.mobileNo }
                            }
                        })
                        const contactEmail = contact.emails.map((contact, index) => {
                            if (contact.contactTypeId == 1) {
                                return { email: contact.emailId }
                            }
                        })
                        const contactMap = Object.assign({}, ...contactMobile, ...contactEmail);
                        setJsonForContract(memberType, member, maritalStatusList, contactMap, physicalAddress, mailingAddress, memberRelationshipName);
                    }
                    else {
                        const contactMobile = contact.mobiles.map((contact, index) => {
                            if (contact.contactTypeId == 1) {
                                return { phone1: contact.mobileNo }
                            }
                            if (contact.contactTypeId == 2) {
                                return { phone2: contact.mobileNo }
                            }
                            if (contact.contactTypeId == 3) {
                                return { phone3: contact.mobileNo }
                            }
                        })
                        const contactEmail = contact.emails.map((contact, index) => {
                            if (contact.contactTypeId == 1) {
                                return { email: contact.emailId }
                            }
                        })
                        const contactMap = Object.assign({}, ...contactMobile, ...contactEmail);
                        setJsonForContract(memberType, member, maritalStatusList, contactMap, [], [], memberRelationshipName);
                    }
                });
            }
        }
        );
    };
    const fetchProfessionalData = async (userId, clientName, spouserUserId, spousefullName) => {
        konsole.log("userIduserIduserIduserId", userId)
        props.dispatchloader(true);
        const _resultOfProfList = await getApiCall('GET', $Service_Url.getProfessionalsList + `?MemberUserId=${userId}&PrimaryUserId=${userId}`);
        konsole.log('_resultOfProfList', _resultOfProfList);
        props.dispatchloader(false);
        if (_resultOfProfList == 'err') return;
        konsole.log('_resultOfProfList', _resultOfProfList)
        if (_resultOfProfList.length > 0) {
            props.dispatchloader(true);
            json.Session.Variable = [...json.Session.Variable, getXMLObj('ClientProfessionalNum', _resultOfProfList.length)]
            _resultOfProfList?.forEach(async (item, ind) => {
                let index = ind + 1
                const { businessName, emaidIds, fName, lName, mName, mobileNumbers, proType, professionalUserId } = item;
                const fullName = fName + ' ' + mName + " " + lName;
                json.Session.Variable = [...json.Session.Variable, getJSONXML('CL Professional Name TE', fullName.toUpperCase(), index)]
                if (isNotValidNullUndefile(businessName)) {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('CL Professional Company Name TE', businessName, index)]
                }
                if (isNotValidNullUndefile(emaidIds)) {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('CL Professional Email TE', emaidIds, index)]
                }
                if (isNotValidNullUndefile(mobileNumbers)) {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('CL Professional Phone TE', mobileNumbers, index)]
                }
                if (isNotValidNullUndefile(businessName)) {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('CL Professional Role MC', makeProTypeFormat(proType), index)]
                }
                const _resultOfAddress = await getApiCall('GET', $Service_Url.getAllAddress + professionalUserId);
                konsole.log("_resultOfAddress", _resultOfAddress)
                const addresses = _resultOfAddress?.addresses;
                if (addresses?.length > 0) {
                    const { addressLine1, city, state, zipcode, county } = addresses[0];
                    const addressL1 = addressLine1 + ' ' + city + ' ' + state + ' ' + zipcode + ' ' + county;
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('CL Professional Address TE', addressL1, index)]
                    if (isNotValidNullUndefile(city)) {
                        json.Session.Variable = [...json.Session.Variable, getJSONXML('CL Professional City TE', city, index)]
                    }
                    if (isNotValidNullUndefile(state)) {
                        json.Session.Variable = [...json.Session.Variable, getJSONXML('CL Professional State MC', state, index)]
                    }
                    if (isNotValidNullUndefile(zipcode)) {
                        json.Session.Variable = [...json.Session.Variable, getJSONXML('CL Professional Zip Code TE', zipcode, index)]
                    }
                }
            });
            props.dispatchloader(false);
        }
    }

    const fetchSpouseLifeIns = (spouserUserId, UACount, clientLICount, spousefullName) => {
        if (spouserUserId !== null) {
            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getLifeInsByUserId + spouserUserId, "", (responsespouseLifeIns) => {
                props.dispatchloader(false);
                const spouseLifeIns = responsespouseLifeIns?.data?.data.lifeInsurances
                const spouseLICount = responsespouseLifeIns?.data?.data.lifeInsurances?.length ?? 0;
                const FICount = UACount + clientLICount + spouseLICount;
                json.Session.Variable = [...json.Session.Variable, getXMLObj('FIANum', FICount)]
                if (spouseLifeIns.length > 0) {
                    spouseLifeIns.forEach((element, index) => {

                        json.Session.Variable = [...json.Session.Variable, getJSONXML('FIAType', 'Life Insurance', index + 1 + UACount + clientLICount)]
                        json.Session.Variable = [...json.Session.Variable, getJSONXML('FIName', element.insuranceCompany, index + 1 + UACount + clientLICount)]
                        json.Session.Variable = [...json.Session.Variable, getJSONXML('FIAAccountNumber', element.additionalDetails, index + 1 + UACount + clientLICount)]
                        let newArr = []
                        newArr.push(spousefullName?.toUpperCase())
                        json.Session.Variable = [...json.Session.Variable, ...getJSONXMLmultiValue('FIAOwner', newArr, index + 1 + UACount + clientLICount)]

                    });
                }
            })
        }
        else {
            const FICount = UACount + clientLICount
            json.Session.Variable = [...json.Session.Variable, getXMLObj('FIANum', FICount)]
        }
    }

    const fetchFinancialDetails = (userid, clientName, spouserUserId, spousefullName) => {

        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserAgingAsset + userid, "", (responseUserAsset) => {
            props.dispatchloader(false);
            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getLifeInsByUserId + userid, "", (responseUserLifeIns) => {
                props.dispatchloader(false);
                const responseAsset = responseUserAsset?.data?.data;
                const responseLifeIns = responseUserLifeIns?.data?.data.lifeInsurances;
                const UACount = responseUserAsset?.data?.data?.length ?? 0;
                const clientLICount = responseUserLifeIns?.data?.data?.lifeInsurances?.length ?? 0;
                fetchSpouseLifeIns(spouserUserId, UACount, clientLICount, spousefullName)

                if (responseAsset.length > 0) {
                    responseAsset.forEach((element, index) => {

                        json.Session.Variable = [...json.Session.Variable, getJSONXML('FIAType', element.assetTypeName, index + 1)]
                        json.Session.Variable = [...json.Session.Variable, getJSONXML('FIName', element.nameOfInstitution, index + 1)]

                        if (element.assetOwners.length > 0) {
                            let newArr = []
                            element.assetOwners.forEach(ele => {
                                newArr.push(ele.ownerUserName?.toUpperCase())
                            })
                            if (newArr.length > 0) {
                                json.Session.Variable = [...json.Session.Variable, ...getJSONXMLmultiValue('FIAOwner', newArr, index + 1)]
                            }
                        }
                    });
                }
                if (responseLifeIns.length > 0) {
                    responseLifeIns.forEach((element, index) => {

                        json.Session.Variable = [...json.Session.Variable, getJSONXML('FIAType', 'Life Insurance', index + 1 + UACount)]
                        json.Session.Variable = [...json.Session.Variable, getJSONXML('FIName', element.insuranceCompany, index + 1 + UACount)]
                        json.Session.Variable = [...json.Session.Variable, getJSONXML('FIAAccountNumber', element.additionalDetails, index + 1 + UACount)]
                        let newArr = []
                        newArr.push(clientName.toUpperCase())
                        json.Session.Variable = [...json.Session.Variable, ...getJSONXMLmultiValue('FIAOwner', newArr, index + 1 + UACount)]

                    });
                }
            })
        })
    }

    const fetchFidAssginmentDetails = (userid, clientName, spouserUserId, spousefullName) => {
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFiduciaryAsgnmntData + userid, "", (responseUserFidAsgn) => {
            props.dispatchloader(false);

            const UserFidAsgn = responseUserFidAsgn?.data?.data?.fiduciaryAssignments;

            const willPriFidAsgn = UserFidAsgn.filter(ele => ele?.lDocTypeId == 2 && ele?.sRank == 1)
            const noOfWillPriFidAsgn = willPriFidAsgn.length;
            const willSuccFidAsgn = UserFidAsgn.filter(ele => ele?.lDocTypeId == 2 && ele?.sRank != 1)
            const noOfWillSuccFidAsgn = willSuccFidAsgn.length;
            const financePriFidAsgn = UserFidAsgn.filter(ele => ele?.lDocTypeId == 6 && ele?.sRank == 1)
            const noOfFinancePriFidAsgn = financePriFidAsgn.length;
            const financeSuccFidAsgn = UserFidAsgn.filter(ele => ele?.lDocTypeId == 6 && ele?.sRank != 1)
            const noOfFinanceSuccFidAsgn = financeSuccFidAsgn.length;
            const healthPriFidAsgn = UserFidAsgn.filter(ele => ele?.lDocTypeId == 7 && ele?.sRank == 1)
            const noOfHealthPriFidAsgn = healthPriFidAsgn.length;
            const healthSuccFidAsgn = UserFidAsgn.filter(ele => ele?.lDocTypeId == 7 && ele?.sRank != 1)
            const noOfHealthSuccFidAsgn = healthSuccFidAsgn.length;

            const hoRPriFidAsgn = UserFidAsgn.filter(ele => ele?.lDocTypeId == 9 && ele?.sRank == 1)
            const noOfhoRPriFidAsgn = hoRPriFidAsgn.length;
            const hoRSuccFidAsgn = UserFidAsgn.filter(ele => ele?.lDocTypeId == 9 && ele?.sRank != 1)
            const noOfhoRSuccFidAsgn = hoRSuccFidAsgn.length;

            if (isNotValidNullUndefile(spouserUserId)) {
                fetchSpouseFidAssginmentDetails(spouserUserId, spousefullName)
            }

            // json.Session.Variable = [...json.Session.Variable, getXMLObj('',noOfWillPriFidAsgn)]
            // json.Session.Variable = [...json.Session.Variable, getXMLObj('',noOfWillSuccFidAsgn)]
            if (willPriFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Will_PersRep_Initial_Count', noOfWillPriFidAsgn)]
                willPriFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('Will_PersRep_Initial', element.succesorName.toUpperCase(), index + 1)]
                });
            }
            if (willSuccFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Will_PersRep_Successor_Count', noOfWillSuccFidAsgn)]
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Will_PersRep_Successor_TF', true)]
                willSuccFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('Will_PersRep_Successor', element.succesorName.toUpperCase(), index + 1)]
                });
            }
            if (financePriFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('DPOA_InitialAgentsNum', noOfFinancePriFidAsgn)]
                financePriFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('DPOA CL Initial Agent Name MC', element.succesorName.toUpperCase(), index + 1)]
                });
            }
            if (financeSuccFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('DPOA_SuccAgentsNum', noOfFinanceSuccFidAsgn)]
                json.Session.Variable = [...json.Session.Variable, getXMLObj('DPOA CL Successor Agents Named TF', true)]
                financeSuccFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('DPOA CL Succ Agent Name MC', element.succesorName.toUpperCase(), index + 1)]
                });
            }
            if (healthPriFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA_InitialAgentsNum', noOfHealthPriFidAsgn)]
                healthPriFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('HCPOA CL Initial Agent Name MC', element.succesorName.toUpperCase(), index + 1)]
                });
            }
            if (healthSuccFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA_SuccAgentsNum', noOfHealthSuccFidAsgn)]
                json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA CL Successor Agents Named TF', true)]
                healthSuccFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('HCPOA CL Succ Agent Name MC', element.succesorName.toUpperCase(), index + 1)]
                });
            }
            if (hoRPriFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Remains_InitReprNum', noOfhoRPriFidAsgn)]
                hoRPriFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('REMAINS CL Initial Representative Name MC', element.succesorName.toUpperCase(), index + 1)]
                });
            }
            if (hoRSuccFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Remains_SuccReprNum', noOfhoRSuccFidAsgn)]
                hoRSuccFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('REMAINS CL Succ Representative Name MC', element.succesorName.toUpperCase(), index + 1)]
                });
            }
        })
    }
    const fetchSpouseFidAssginmentDetails = (spouserUserId, spousefullName) => {

        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFiduciaryAsgnmntData + spouserUserId, "", (responseSpouseFidAsgn) => {
            props.dispatchloader(false);

            const spouseFidAsgn = responseSpouseFidAsgn?.data?.data?.fiduciaryAssignments;
            const willPriFidAsgn = spouseFidAsgn.filter(ele => ele?.lDocTypeId == 2 && ele?.sRank == 1)
            const noOfWillPriFidAsgn = willPriFidAsgn.length;
            const willSuccFidAsgn = spouseFidAsgn.filter(ele => ele?.lDocTypeId == 2 && ele?.sRank != 1)
            const noOfWillSuccFidAsgn = willSuccFidAsgn.length;
            const financePriFidAsgn = spouseFidAsgn.filter(ele => ele?.lDocTypeId == 6 && ele?.sRank == 1)
            const noOfFinancePriFidAsgn = financePriFidAsgn.length;
            const financeSuccFidAsgn = spouseFidAsgn.filter(ele => ele?.lDocTypeId == 6 && ele?.sRank != 1)
            const noOfFinanceSuccFidAsgn = financeSuccFidAsgn.length;
            const healthPriFidAsgn = spouseFidAsgn.filter(ele => ele?.lDocTypeId == 7 && ele?.sRank == 1)
            const noOfHealthPriFidAsgn = healthPriFidAsgn.length;
            const healthSuccFidAsgn = spouseFidAsgn.filter(ele => ele?.lDocTypeId == 7 && ele?.sRank != 1)
            const noOfHealthSuccFidAsgn = healthSuccFidAsgn.length;

            const hoRPriFidAsgn = spouseFidAsgn.filter(ele => ele?.lDocTypeId == 9 && ele?.sRank == 1)
            const noOfhoRPriFidAsgn = hoRPriFidAsgn.length;
            const hoRSuccFidAsgn = spouseFidAsgn.filter(ele => ele?.lDocTypeId == 9 && ele?.sRank != 1)
            const noOfhoRSuccFidAsgn = hoRSuccFidAsgn.length;

            json.Session.Variable = [...json.Session.Variable, getXMLObj('', noOfWillPriFidAsgn)]
            json.Session.Variable = [...json.Session.Variable, getXMLObj('', noOfWillSuccFidAsgn)]
            if (willPriFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Will_SP_PersRep_Initial_Count', noOfWillPriFidAsgn)]
                willPriFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('Will_SP_PersRep_Initial', element.succesorName.toUpperCase(), index + 1)]
                });
            }
            if (willSuccFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Will_SP_PersRep_Successor_Count', noOfWillSuccFidAsgn)]
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Will_SP_PersRep_Successor_TF', true)]
                willSuccFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('Will_SP_PersRep_Successor', element.succesorName.toUpperCase(), index + 1)]
                });
            }
            if (financePriFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('DPOA_SP_InitialAgentsNum', noOfFinancePriFidAsgn)]
                financePriFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('DPOA SP Initial Agent Name MC', element.succesorName.toUpperCase(), index + 1)]
                });
            }
            if (financeSuccFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('DPOA_SP_SuccAgentsNum', noOfFinanceSuccFidAsgn)]
                json.Session.Variable = [...json.Session.Variable, getXMLObj('DPOA SP Successor Agents Named TF', true)]
                financeSuccFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('DPOA SP Succ Agent Name MC', element.succesorName.toUpperCase(), index + 1)]
                });
            }
            if (healthPriFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA_SP_InitialAgentsNum', noOfHealthPriFidAsgn)]
                healthPriFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('HCPOA SP Initial Agent Name MC', element.succesorName.toUpperCase(), index + 1)]
                });
            }
            if (healthSuccFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA_SP_SuccAgentsNum', noOfHealthSuccFidAsgn)]
                json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA SP Successor Agents Named TF', true)]
                healthSuccFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('HCPOA SP Succ Agent Name MC', element.succesorName.toUpperCase(), index + 1)]
                });
            }
            if (hoRPriFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Remains_SP_InitReprNum', noOfhoRPriFidAsgn)]
                hoRPriFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('REMAINS SP Initial Representative Name MC', element.succesorName.toUpperCase(), index + 1)]
                });
            }
            if (hoRSuccFidAsgn.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Remains_SP_SuccReprNum', noOfhoRSuccFidAsgn)]
                hoRSuccFidAsgn.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('REMAINS SP Succ Representative Name MC', element.succesorName.toUpperCase(), index + 1)]
                });
            }
        })
    }

    const fetchUserAgentDetails = (userid, clientName, spouserUserId, spousefullName) => {
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getUserAgent + `?IsActive=true&UserId=${userid}`, '', (responseUserAgent) => {
            props.dispatchloader(false);

            const UserAgent = responseUserAgent?.data?.data;
            //Last will and testament
            const willPriAgent = UserAgent?.filter(ele => ele?.legalDocId == 1 && ele?.testDocId == null && ele?.testSupportDocId == null  && ele?.agentRankId < 7).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfWillPriAgent = willPriAgent?.length;
            const willSuccAgent = UserAgent?.filter(ele => ele?.legalDocId == 1 && ele?.testDocId == null && ele?.testSupportDocId == null && ele?.agentRankId > 6).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfWillSuccAgent = willSuccAgent?.length;
            //Durable Power of Attorney for Finance
            const financePriAgent = UserAgent?.filter(ele => ele?.legalDocId == 6 && ele?.agentRankId < 7).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfFinancePriAgent = financePriAgent?.length;
            const financeSuccAgent = UserAgent?.filter(ele => ele?.legalDocId == 6 && ele?.agentRankId > 6).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfFinanceSuccAgent = financeSuccAgent?.length;
            //Durable Power of Attorney for Health
            const healthPriAgent = UserAgent?.filter(ele => ele?.legalDocId == 7 && ele?.agentRankId < 7).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfHealthPriAgent = healthPriAgent?.length;
            const healthSuccAgent = UserAgent?.filter(ele => ele?.legalDocId == 7 && ele?.agentRankId > 6).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfHealthSuccAgent = healthSuccAgent?.length;
            //Handling of Remains
            const hoRPriAgent = UserAgent?.filter(ele => ele?.legalDocId == 10 && ele?.agentRankId < 7).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfhoRPriAgent = hoRPriAgent?.length;
            const hoRSuccAgent = UserAgent?.filter(ele => ele?.legalDocId == 10 && ele?.agentRankId > 6).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfhoRSuccAgent = hoRSuccAgent?.length;

            //Safe Harbor trust
            const sHTPriAgent = UserAgent?.filter(ele => ele?.legalDocId == 1 && ele?.testDocId == 1  && ele?.agentRankId < 7).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfsHTPriAgent = sHTPriAgent?.length;
            const sHTSuccAgent = UserAgent?.filter(ele => ele?.legalDocId == 1 && ele?.testDocId == 1 && ele?.agentRankId > 6).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfsHTSuccAgent = sHTSuccAgent?.length;
            //Contingent Trust for minor's
            const cToMPriAgent = UserAgent?.filter(ele => ele?.legalDocId == 1 && ele?.testDocId == 4  && ele?.agentRankId < 7).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfcToMPriAgent = cToMPriAgent?.length;
            const cToMSuccAgent = UserAgent?.filter(ele => ele?.legalDocId == 1 && ele?.testDocId == 4 && ele?.agentRankId > 6).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfcToMSuccAgent = cToMSuccAgent?.length;            


            if (isNotValidNullUndefile(spouserUserId)) {
                fetchSpouseAgentDetails(spouserUserId, spousefullName)
            }

            if (willPriAgent?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Will_PersRep_Initial_Count', noOfWillPriAgent)]
                willPriAgent.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('Will_PersRep_Initial', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (willSuccAgent?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Will_PersRep_Successor_Count', noOfWillSuccAgent)]
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Will_PersRep_Successor_TF', true)]
                willSuccAgent.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('Will_PersRep_Successor', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (financePriAgent?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('DPOA_InitialAgentsNum', noOfFinancePriAgent)]
                financePriAgent.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('DPOA CL Initial Agent Name MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (financeSuccAgent?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('DPOA_SuccAgentsNum', noOfFinanceSuccAgent)]
                json.Session.Variable = [...json.Session.Variable, getXMLObj('DPOA CL Successor Agents Named TF', true)]
                financeSuccAgent.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('DPOA CL Succ Agent Name MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (healthPriAgent?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA_InitialAgentsNum', noOfHealthPriAgent)]
                healthPriAgent.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('HCPOA CL Initial Agent Name MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (healthSuccAgent?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA_SuccAgentsNum', noOfHealthSuccAgent)]
                json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA CL Successor Agents Named TF', true)]
                healthSuccAgent.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('HCPOA CL Succ Agent Name MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (hoRPriAgent?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Remains_InitReprNum', noOfhoRPriAgent)]
                hoRPriAgent.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('REMAINS CL Initial Representative Name MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (hoRSuccAgent?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Remains_SuccReprNum', noOfhoRSuccAgent)]
                hoRSuccAgent.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('REMAINS CL Succ Representative Name MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (sHTPriAgent?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('ClientSHT_InitialTrusteeNum', noOfsHTPriAgent)]
                sHTPriAgent.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('WILL/RT CL Initial SH Tr Trustee MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (sHTSuccAgent?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('ClientSHT_SuccessorTrusteeNum', noOfsHTSuccAgent)]
                sHTSuccAgent.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('WILL/RT CL Successor SH Tr Trustee MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (cToMPriAgent?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Cont_InitialTrusteeNum', noOfcToMPriAgent)]
                cToMPriAgent.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('WILL/RT CL Initial Cont Tr Trustee Name MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (cToMSuccAgent?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Cont_SuccessorTrusteeNum', noOfcToMSuccAgent)]
                cToMSuccAgent.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('WILL/RT CL Successor Cont Tr Trustee MC', element.fullName.toUpperCase(), index + 1)]
                });
            }                            
        })
    }
    const fetchSpouseAgentDetails = (spouserUserId, spousefullName) => {

        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getUserAgent + `?IsActive=true&UserId=${spouserUserId}`, '', (responseSpouseAgent) => {
            props.dispatchloader(false);

            const spouseAgent = responseSpouseAgent?.data?.data;
            //Last will and testament
            const willPriAgentSP = spouseAgent?.filter(ele => ele?.legalDocId == 1 && ele?.testDocId == null && ele?.testSupportDocId == null && ele?.agentRankId < 7).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfWillPriAgentSP = willPriAgentSP?.length;
            const willSuccAgentSP = spouseAgent?.filter(ele => ele?.legalDocId == 1 && ele?.testDocId == null && ele?.testSupportDocId == null && ele?.agentRankId > 6).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfWillSuccAgentSP = willSuccAgentSP?.length;
            //Durable Power of Attorney for Finance
            const financePriAgentSP = spouseAgent?.filter(ele => ele?.legalDocId == 6 && ele?.agentRankId < 7).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfFinancePriAgentSP = financePriAgentSP?.length;
            const financeSuccAgentSP = spouseAgent?.filter(ele => ele?.legalDocId == 6 && ele?.agentRankId > 6).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfFinanceSuccAgentSP = financeSuccAgentSP?.length;
            //Durable Power of Attorney for Health
            const healthPriAgentSP = spouseAgent?.filter(ele => ele?.legalDocId == 7 && ele?.agentRankId < 7).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfHealthPriAgentSP = healthPriAgentSP?.length;
            const healthSuccAgentSP = spouseAgent?.filter(ele => ele?.legalDocId == 7 && ele?.agentRankId > 6).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfHealthSuccAgentSP = healthSuccAgentSP?.length;
            //Handling of Remains
            const hoRPriAgentSP = spouseAgent?.filter(ele => ele?.legalDocId == 10 && ele?.agentRankId < 7).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfhoRPriAgentSP = hoRPriAgentSP?.length;
            const hoRSuccAgentSP = spouseAgent?.filter(ele => ele?.legalDocId == 10 && ele?.agentRankId > 6).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfhoRSuccAgentSP = hoRSuccAgentSP?.length;
            //Safe Harbor trust
            const sHTPriAgentSP = spouseAgent?.filter(ele => ele?.legalDocId == 1 && ele?.testDocId == 1  && ele?.agentRankId < 7).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfsHTPriAgentSP = sHTPriAgentSP?.length;
            const sHTSuccAgentSP = spouseAgent?.filter(ele => ele?.legalDocId == 1 && ele?.testDocId == 1 && ele?.agentRankId > 6).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfsHTSuccAgentSP = sHTSuccAgentSP?.length;
            //Contingent Trust for minor's
            const cToMPriAgentSP = spouseAgent?.filter(ele => ele?.legalDocId == 1 && ele?.testDocId == 4  && ele?.agentRankId < 7).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfcToMPriAgentSP = cToMPriAgentSP?.length;
            const cToMSuccAgentSP = spouseAgent?.filter(ele => ele?.legalDocId == 1 && ele?.testDocId == 4 && ele?.agentRankId > 6).sort((a, b) => a.agentRankId - b.agentRankId);
            const noOfcToMSuccAgentSP = cToMSuccAgentSP?.length;                        

            if (willPriAgentSP?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Will_SP_PersRep_Initial_Count', noOfWillPriAgentSP)]
                willPriAgentSP.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('Will_SP_PersRep_Initial', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (willSuccAgentSP?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Will_SP_PersRep_Successor_Count', noOfWillSuccAgentSP)]
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Will_SP_PersRep_Successor_TF', true)]
                willSuccAgentSP.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('Will_SP_PersRep_Successor', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (financePriAgentSP?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('DPOA_SP_InitialAgentsNum', noOfFinancePriAgentSP)]
                financePriAgentSP.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('DPOA SP Initial Agent Name MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (financeSuccAgentSP?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('DPOA_SP_SuccAgentsNum', noOfFinanceSuccAgentSP)]
                json.Session.Variable = [...json.Session.Variable, getXMLObj('DPOA SP Successor Agents Named TF', true)]
                financeSuccAgentSP.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('DPOA SP Succ Agent Name MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (healthPriAgentSP?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA_SP_InitialAgentsNum', noOfHealthPriAgentSP)]
                healthPriAgentSP.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('HCPOA SP Initial Agent Name MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (healthSuccAgentSP?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA_SP_SuccAgentsNum', noOfHealthSuccAgentSP)]
                json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA SP Successor Agents Named TF', true)]
                healthSuccAgentSP.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('HCPOA SP Succ Agent Name MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (hoRPriAgentSP?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Remains_SP_InitReprNum', noOfhoRPriAgentSP)]
                hoRPriAgentSP.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('REMAINS SP Initial Representative Name MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (hoRSuccAgentSP?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Remains_SP_SuccReprNum', noOfhoRSuccAgentSP)]
                hoRSuccAgentSP.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('REMAINS SP Succ Representative Name MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (sHTPriAgentSP?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('SpouseSHT_InitialTrusteeNum', noOfsHTPriAgentSP)]
                sHTPriAgentSP.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('WILL/RT SP Initial SH Tr Trustee MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (sHTSuccAgentSP?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('SpouseSHT_SuccessorTrusteeNum', noOfsHTSuccAgentSP)]
                sHTSuccAgentSP.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('WILL/RT SP Successor SH Tr Trustee MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (cToMPriAgentSP?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Cont_InitialTrusteeNumSP', noOfcToMPriAgentSP)]
                cToMPriAgentSP.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('WILL/RT SP Initial Cont Tr Trustee Name MC', element.fullName.toUpperCase(), index + 1)]
                });
            }
            if (cToMSuccAgentSP?.length > 0) {
                json.Session.Variable = [...json.Session.Variable, getXMLObj('Cont_SuccessorTrusteeNumSP', noOfcToMSuccAgentSP)]
                cToMSuccAgentSP.forEach((element, index) => {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('WILL/RT SP Successor SH Tr Trustee MC', element.fullName.toUpperCase(), index + 1)]
                });
            }            
        })
    }

    const subjectApiFamilyMedicalLivingWill = async (userId, clientName, spouserUserId, spousefullName) => {
        const _ruAllergicMedicationsSubId = '17';
        const _whichMedicationMedicationsSubId = '152';
        const _livingWillCPRSubId = '54';
        const _livingWillArtiHydrationSubId = '55';
        const _livingWillArtinutritionSubId = '56';
        const _livingWillheroicMeasuresSubId = '58';
        const _livingWillAntibioticSubId = '57';
        const _livingWillMaxTreatMentSubId = '52';
        // @Client Section-----------------------------
        {
            props.dispatchloader(true);
            const _resultPrimarySubjectData = await getUserSubjectDataFn(userId);
            konsole.log("_resultPrimarySubjectData", _resultPrimarySubjectData);
            const __ruAllergicMedicationsResult = filterBasedKeyValue(_resultPrimarySubjectData?.userSubjects, 'subjectId', _ruAllergicMedicationsSubId);
            const _whichMedicationMedicationsResult = filterBasedKeyValue(_resultPrimarySubjectData?.userSubjects, 'subjectId', _whichMedicationMedicationsSubId);
            const __whichMedicationsResultVal = (_whichMedicationMedicationsResult?.length > 0) ? _whichMedicationMedicationsResult[0].response : '';

            // family medical history------------------
            if (__ruAllergicMedicationsResult.length > 0) {
                const __ruAllergicMedicationsResultVal = __ruAllergicMedicationsResult[0].response == 'Yes' ? true : false;
                json.Session.Variable = [...json.Session.Variable, getXMLObj('ClientAllergiesNum', 1)]
                json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA MHAD CL Allergies TF', __ruAllergicMedicationsResultVal)]
                if (__ruAllergicMedicationsResultVal == true) {
                    json.Session.Variable = [...json.Session.Variable, getJSONXML('HCPOA MHAD CL Allergies TE', __whichMedicationsResultVal, 1)]
                }
            }
            //  living will details--------------------
            {
                const _livingWillCPRResult = filterBasedKeyValue(_resultPrimarySubjectData?.userSubjects, 'subjectId', _livingWillCPRSubId);
                const _livingWillArtiHydrationResult = filterBasedKeyValue(_resultPrimarySubjectData?.userSubjects, 'subjectId', _livingWillArtiHydrationSubId);
                const _livingWillArtinutritionResult = filterBasedKeyValue(_resultPrimarySubjectData?.userSubjects, 'subjectId', _livingWillArtinutritionSubId);
                const _livingWillheroicMeasuresResult = filterBasedKeyValue(_resultPrimarySubjectData?.userSubjects, 'subjectId', _livingWillheroicMeasuresSubId);
                const _livingWillAntibioticResult = filterBasedKeyValue(_resultPrimarySubjectData?.userSubjects, 'subjectId', _livingWillAntibioticSubId);
                const _livingWillMaxTreatMentResult = filterBasedKeyValue(_resultPrimarySubjectData?.userSubjects, 'subjectId', _livingWillMaxTreatMentSubId);
                konsole.log('_livingWillArtinutritionResult', _livingWillArtinutritionResult)
                if (_livingWillCPRResult.length > 0) {
                    const _livingWillCPRResultVal = _livingWillCPRResult[0].response == 'Do Want' ? true : false
                    json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA LW CL Cardiopulmonary Resuscitation TF', _livingWillCPRResultVal)]
                }
                if (_livingWillArtiHydrationResult.length > 0) {
                    const _livingWillArtiHydrationVal = _livingWillArtiHydrationResult[0].response == 'Do Want' ? true : false
                    json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA LW CL Artificial Hydration TF', _livingWillArtiHydrationVal)]
                }
                if (_livingWillArtinutritionResult.length > 0) {
                    const _livingWillArtinutritionVal = _livingWillArtinutritionResult[0].response == 'Do Want' ? true : false
                    json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA LW CL Artificial Nutrition TF', _livingWillArtinutritionVal)]
                }
                if (_livingWillheroicMeasuresResult.length > 0) {
                    const _livingWillheroicMeasuresVal = _livingWillheroicMeasuresResult[0].response == 'Do Want' ? true : false
                    json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA LW CL Heroic Measures TF', _livingWillheroicMeasuresVal)]
                }
                if (_livingWillAntibioticResult.length > 0) {
                    const _livingWillAntibioticVal = _livingWillAntibioticResult[0].response == 'Do Want' ? true : false
                    json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA LW CL Antibiotic Therapy TF', _livingWillAntibioticVal)]
                }
                if (_livingWillMaxTreatMentResult.length > 0) {
                    const _livingWillMaxTreatMentVal = _livingWillMaxTreatMentResult[0].response == 'Yes' ? true : false
                    json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA LW CL Prolong Life TF', _livingWillMaxTreatMentVal)]
                }
            }
            props.dispatchloader(false);
        }
        konsole.log("jsonjsonjsonjsonjson", json)
        // @Spouse Section-------------------------------------
        {
            if (isNotValidNullUndefile(spouserUserId)) {
                props.dispatchloader(true);
                const _resultSpouseSubjectData = await getUserSubjectDataFn(spouserUserId);
                const __ruAllergicMedicationsResult = filterBasedKeyValue(_resultSpouseSubjectData?.userSubjects, 'subjectId', _ruAllergicMedicationsSubId);
                const _whichMedicationMedicationsResult = filterBasedKeyValue(_resultSpouseSubjectData?.userSubjects, 'subjectId', _whichMedicationMedicationsSubId);
                const __whichMedicationsResultVal = (_whichMedicationMedicationsResult?.length > 0) ? _whichMedicationMedicationsResult[0].response : '';
                // family medical
                if (__ruAllergicMedicationsResult.length > 0) {
                    const __ruAllergicMedicationsResultVal = (__ruAllergicMedicationsResult[0].response == 'Yes') ? true : false;
                    json.Session.Variable = [...json.Session.Variable, getXMLObj('SpouseAllergiesNum', 1)]
                    json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA MHAD SP Allergies TF', __ruAllergicMedicationsResultVal)]
                    if (__ruAllergicMedicationsResultVal == true) {
                        json.Session.Variable = [...json.Session.Variable, getJSONXML('HCPOA MHAD SP Allergies TE', __whichMedicationsResultVal, 1)]
                    }
                }
                //  living will details--------------------
                {
                    const _livingWillCPRResult = filterBasedKeyValue(_resultSpouseSubjectData?.userSubjects, 'subjectId', _livingWillCPRSubId);
                    const _livingWillArtiHydrationResult = filterBasedKeyValue(_resultSpouseSubjectData?.userSubjects, 'subjectId', _livingWillArtiHydrationSubId);
                    const _livingWillArtinutritionResult = filterBasedKeyValue(_resultSpouseSubjectData?.userSubjects, 'subjectId', _livingWillArtinutritionSubId);
                    const _livingWillheroicMeasuresResult = filterBasedKeyValue(_resultSpouseSubjectData?.userSubjects, 'subjectId', _livingWillheroicMeasuresSubId);
                    const _livingWillAntibioticResult = filterBasedKeyValue(_resultSpouseSubjectData?.userSubjects, 'subjectId', _livingWillAntibioticSubId);
                    const _livingWillMaxTreatMentResult = filterBasedKeyValue(_resultSpouseSubjectData?.userSubjects, 'subjectId', _livingWillMaxTreatMentSubId);
                    konsole.log('_livingWillArtinutritionResult', _livingWillArtinutritionResult)
                    if (_livingWillCPRResult.length > 0) {
                        const _livingWillCPRResultVal = _livingWillCPRResult[0].response == 'Do Want' ? true : false
                        json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA LW SP Cardiopulmonary Resuscitation TF', _livingWillCPRResultVal)]
                    }
                    if (_livingWillArtiHydrationResult.length > 0) {
                        const _livingWillArtiHydrationVal = _livingWillArtiHydrationResult[0].response == 'Do Want' ? true : false
                        json.Session.Variable = [...json.Session.Variable, getXMLObj('"HCPOA LW SP Artificial Hydration TF', _livingWillArtiHydrationVal)]
                    }
                    if (_livingWillArtinutritionResult.length > 0) {
                        const _livingWillArtinutritionVal = _livingWillArtinutritionResult[0].response == 'Do Want' ? true : false
                        json.Session.Variable = [...json.Session.Variable, getXMLObj('"HCPOA LW SP Artificial Nutrition TF', _livingWillArtinutritionVal)]
                    }
                    if (_livingWillheroicMeasuresResult.length > 0) {
                        const _livingWillheroicMeasuresVal = _livingWillheroicMeasuresResult[0].response == 'Do Want' ? true : false
                        json.Session.Variable = [...json.Session.Variable, getXMLObj('"HCPOA LW SP Heroic Measures TF', _livingWillheroicMeasuresVal)]
                    }
                    if (_livingWillAntibioticResult.length > 0) {
                        const _livingWillAntibioticVal = _livingWillAntibioticResult[0].response == 'Do Want' ? true : false
                        json.Session.Variable = [...json.Session.Variable, getXMLObj('HCPOA LW SP Antibiotic Therapy TF', _livingWillAntibioticVal)]
                    }
                    if (_livingWillMaxTreatMentResult.length > 0) {
                        const _livingWillMaxTreatMentVal = _livingWillMaxTreatMentResult[0].response == 'Yes' ? true : false
                        json.Session.Variable = [...json.Session.Variable, getXMLObj('"HCPOA LW SP Prolong Life TF', _livingWillMaxTreatMentVal)]
                    }
                }
                props.dispatchloader(false);
            }
        }
    }
    const fetchFidMemberbyUserId = (userid, maritalStatusList) => {
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getNonFamilyMember + userid, "", (response) => {
            props.dispatchloader(false);
            const responseData = $AHelper.deceasedNIncapacititedFilterFun(response?.data?.data)
            if (response) {
                if (responseData?.length > 0) {
                    let i = 1;
                    const filteredResponse = responseData.filter((response) => { return response.isFiduciary == true || response.isBeneficiary == true });
                    const filteredResponseLength = filteredResponse.length;
                    for (let fidMember of filteredResponse) {
                        if (![3, 1, 50, 49, 48, 47, 44].includes(fidMember?.relationshipTypeId))
                            {
                             fetchSavedContactDetails("Person", fidMember, maritalStatusList, fidMember?.userId, 'personFiduciary');
                            }
                        i++;
                    }
                }
            }
        })
    }

    const setJsonForContract = (memberType, member, maritalStatusList, contactMap, physicalAddress = [], mailingAddress = [], memberRelationshipName) => {
        member.maritalStatus = (member.maritalStatusId !== undefined && member.maritalStatusId !== null) ? maritalStatusList.filter((marital) => { return marital.value == member.maritalStatusId })[0]?.label : "";
        member.addresSame = "false";
        member.memberRelationshipName = memberRelationshipName;
        member.fullName = [member.fName, member.mName, member.lName].filter(Boolean).join(' ');
        member.gender = (member.genderId !== null) ? (member.genderId == 1) ? "Male" : (member.genderId == 2) ? "Female" : '' : '';

        if (memberType == "Client") {

            if (physicalAddress[0]?.addressLine1 === mailingAddress[0]?.addressLine1) {
                member.addresSame = "true";
                konsole.log("same address", physicalAddress[0]?.addressLine1, member);
            }

            json.Session.Variable = [...json.Session.Variable, ...jsonObj(memberType, member, contactMap, physicalAddress[0], mailingAddress[0])]
        }
        if (memberType == "Spouse") {
            if (physicalAddress[0]?.addressLine1 === mailingAddress[0]?.addressLine1) {
                member.addresSame = "true";
            }
            json.Session.Variable = [...json.Session.Variable, ...jsonObj(memberType, member, contactMap, physicalAddress[0], mailingAddress[0])]
        }
        if (memberType == "Child") {
            if (physicalAddress[0]?.addressLine1 === mailingAddress[0]?.addressLine1) {
                member.addresSame = "true";
            }
            json.Session.Variable = [...json.Session.Variable, ...jsonObj(memberType, member, contactMap, physicalAddress[0], mailingAddress[0], i)]
        }
        if (memberType == "Person") {
            if (physicalAddress[0]?.addressLine1 === mailingAddress[0]?.addressLine1) {
                member.addresSame = "true";
            }
            else if (mailingAddress.length == 0) {
                member.addresSame = "true";
            }
            props.dispatchloader(true);
            $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getOccupationbyUserId + member.userId, "", (response, errorData) => {
                props.dispatchloader(false);
                if (response) {
                    konsole.log("occupation", response.data.data);
                    const occupationRes = response.data.data[0];
                    if ((occupationRes.isWorking == true)) {
                        member.personOccupation = occupationRes.occupationType;
                    }
                    array.push(jsonforArray(memberType, member, contactMap, physicalAddress[0], mailingAddress[0]));
                }
                else {

                    array.push(jsonforArray(memberType, member, contactMap, physicalAddress[0], mailingAddress[0]));
                }
            })
        }
        if (memberType == "ChildSpouse") {
            if (physicalAddress[0]?.addressLine1 === mailingAddress[0]?.addressLine1) {
                member.addresSame = "true";
            }
            json.Session.Variable = [...json.Session.Variable, ...jsonObj(memberType, member, contactMap, physicalAddress[0], mailingAddress[0], i)]
        }
    }

    const fetchSavedAddress = (userid, callback) => {
        userid = userid || this.state.userId;
        if(!isNotValidNullUndefile(userid)) return
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAllAddress + userid, "", (response, error) => {
            if (response) {
                props.dispatchloader(false);
                if (response.data.data.addresses.length > 0) {
                    konsole.log("fetched Address", response.data.data);
                    callback(response.data.data.addresses);
                }
                else {
                    // alert("No address found for this user.");
                    callback(null);
                }
            }
            else {
                callback(null)
            }
        });
    };

    const handleClick = () => {
        getContractDetail();
    }


    const createContractDocument = (templateVersion) => {
        const reArrangeArrayPrimary = [];
        const reArrangeArrayChild = [];
        const reArrangeArrayElse = [];
        if (array.length == 0) {
            alert("Please fill the intake form properly before generating a Contract Document");
            return
        }
        props.dispatchloader(true);
        for (let arrayMap of array) {
            props.dispatchloader(false);
            konsole.log("arrayMap file", arrayMap);
            if (arrayMap.member.memberRelationshipName == "Self") {
                reArrangeArrayPrimary.unshift(arrayMap);
            } else if (arrayMap.member.memberRelationshipName == "primaryMemberSpouse") {
                reArrangeArrayPrimary.push(arrayMap);
            }
            else if (arrayMap.member.memberRelationshipName == "primaryChildren") {
                reArrangeArrayChild.push(arrayMap);
            }
            else {
                reArrangeArrayElse.push(arrayMap);
            }
        }
        const reArrangeArray = reArrangeArrayPrimary.concat(reArrangeArrayChild, reArrangeArrayElse);
        konsole.log("array map rearranged array", reArrangeArray, reArrangeArrayPrimary, array);

        if (reArrangeArrayPrimary[0].member.maritalStatusId !== null && reArrangeArrayPrimary[0].member.maritalStatusId == 1) {
            json.Session.Variable = [...json.Session.Variable, ...docList('DocsList', 'Will', 'Living Will', 'Power of Attorney for Finances', 'Power of Attorney for Healthcare', 'HIPAA', 'Handling of Remains', 'Mental Health Advance Directive', 'Directive to Attorney', 'Beneficiary Designations Letter', 'What About Me', 'Conflict of Interest Waiver', 'Community Property Agreement', 'Revocation of Community Property Agreement')]
        }
        else {
            json.Session.Variable = [...json.Session.Variable, ...docList('DocsList', 'Will', 'Living Will', 'Power of Attorney for Finances', 'Power of Attorney for Healthcare', 'HIPAA', 'Handling of Remains', 'Mental Health Advance Directive', 'Directive to Attorney', 'Beneficiary Designations Letter', 'What About Me', 'Conflict of Interest Waiver')]
        }

        json.Session.Variable = [...json.Session.Variable, ...jsonObj("Client", reArrangeArray[0].member, reArrangeArray[0].contactMap, reArrangeArray[0].physicalAddress, reArrangeArray[0].mailingAddress, i)]
        let i = 1;
        for (let arrayMap of reArrangeArray) {
            props.dispatchloader(false);
            konsole.log("answer array", arrayMap);
            // if (arrayMap.member.isPrimaryMember == true) {
            json.Session.Variable = [...json.Session.Variable, ...jsonObj(arrayMap.memberType, arrayMap.member, arrayMap.contactMap, arrayMap.physicalAddress, arrayMap.mailingAddress, i)]
            // }
            i++;
        }
        json.Session.Variable = [...json.Session.Variable, memberCount("PersonCount", reArrangeArray.length)]
        konsole.log("answer array", reArrangeArray, JSON.stringify(json.Session.Variable));

        props.dispatchloader(true);
        $CommonServiceFn.InvokeContractApi("POST", $Service_Url.createContractDetailPath, { templateReferenceName: templateReferenceName },
            (response, error) => {
                props.dispatchloader(false);
                if (response) {
                    konsole.log("contract express", response);
                    const contractId = response.data.contractId;
                    const createdBy = response.data.createdBy;
                    const createdAt = response.data.createdAt;
                    const folderId = response.data.folderId;
                    const loggedUserId = sessionStorage.getItem("loggedUserId")

                    const addContractId = {
                        primaryUserId: props.client.memberId,
                        templateName: templateReferenceName,
                        folderId: folderId,
                        contractId: contractId,
                        templateVersion: templateVersion,
                        contractCreatedBy: createdBy,
                        contractCreatedAt: createdAt,
                        createdBy: loggedUserId
                    }
                    props.dispatchloader(true)
                    konsole.log("addusercontract", addContractId)
                    $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.addUserContractId, addContractId,
                        (response, error) => {
                            props.dispatchloader(false)
                            if (response) {
                                konsole.log("addusercontract", response)
                                postAnswerContract(contractId, templateReferenceName, templateVersion, json);
                            }
                            else if (error) {
                                props.dispatchloader(false)
                            }
                        })
                }
                else if (error) {
                    props.dispatchloader(false);
                }
            })
    }
    const updateContractDocument = (templateVersion) => {
        const reArrangeArrayPrimary = [];
        const reArrangeArrayChild = [];
        const reArrangeArrayElse = [];
        if (array.length == 0) {
            alert("Please fill the intake form properly before generating a Contract Document");
            return
        }
        props.dispatchloader(true);
        for (let arrayMap of array) {
            props.dispatchloader(false);
            konsole.log("arrayMap file", arrayMap);
            if (arrayMap.member.memberRelationshipName == "Self") {
                reArrangeArrayPrimary.unshift(arrayMap);
            } else if (arrayMap.member.memberRelationshipName == "primaryMemberSpouse") {
                reArrangeArrayPrimary.push(arrayMap);
            }
            else if (arrayMap.member.memberRelationshipName == "primaryChildren") {
                reArrangeArrayChild.push(arrayMap);
            }
            else {
                reArrangeArrayElse.push(arrayMap);
            }
        }
        const reArrangeArray = reArrangeArrayPrimary.concat(reArrangeArrayChild, reArrangeArrayElse);
        konsole.log("array map rearranged array", reArrangeArray, reArrangeArrayPrimary, array);

        if (reArrangeArrayPrimary[0].member.maritalStatusId !== null && reArrangeArrayPrimary[0].member.maritalStatusId == 1) {
            json.Session.Variable = [...json.Session.Variable, ...docList('DocsList', 'Will', 'Living Will', 'Power of Attorney for Finances', 'Power of Attorney for Healthcare', 'HIPAA', 'Handling of Remains', 'Mental Health Advance Directive', 'Directive to Attorney', 'Beneficiary Designations Letter', 'What About Me', 'Conflict of Interest Waiver', 'Community Property Agreement', 'Revocation of Community Property Agreement')]
        }
        else {
            json.Session.Variable = [...json.Session.Variable, ...docList('DocsList', 'Will', 'Living Will', 'Power of Attorney for Finances', 'Power of Attorney for Healthcare', 'HIPAA', 'Handling of Remains', 'Mental Health Advance Directive', 'Directive to Attorney', 'Beneficiary Designations Letter', 'What About Me', 'Conflict of Interest Waiver')]
        }

        json.Session.Variable = [...json.Session.Variable, ...jsonObj("Client", reArrangeArray[0].member, reArrangeArray[0].contactMap, reArrangeArray[0].physicalAddress, reArrangeArray[0].mailingAddress, i)]
        let i = 1;
        for (let arrayMap of reArrangeArray) {
            props.dispatchloader(false);
            konsole.log("answer array", arrayMap);
            // if (arrayMap.member.isPrimaryMember == true) {
            json.Session.Variable = [...json.Session.Variable, ...jsonObj(arrayMap.memberType, arrayMap.member, arrayMap.contactMap, arrayMap.physicalAddress, arrayMap.mailingAddress, i)]
            // }
            i++;
        }
        json.Session.Variable = [...json.Session.Variable, memberCount("PersonCount", reArrangeArray.length)]
        konsole.log("answer array", reArrangeArray, JSON.stringify(json.Session.Variable));

            postAnswerContract(contactId, templateReferenceName, templateVersion, json);
    }


    // const generateDocumentByContractId = (contractId) => {
    //     $CommonServiceFn.InvokeContractApi("GET", $Service_Url.getAsyncPath + `contracts/${contractId}/documents`, "", (response, error) => {
    //         if (response) {
    //             konsole.log("contract express", response);
    //             const documentId = response.data.documents[0].documentId;
    //             postAnswerContract(contractId, documentId);
    //         }
    //     })
    // }

    const postAnswerContract = (contractId, contractReference, templateVersion, json) => {
        json.Session.Parameter.push(...ParametersObj(contractId, contractReference, templateVersion))
        props.dispatchloader(true);
        $CommonServiceFn.InvokeContractApi("POST", $Service_Url.updateAnswerPath + `${contractId}`, json, (response, error) => {
            props.dispatchloader(false);
            if (response) {
                if (showContractPdf) {
                    getContractDetail(contractId)
                }
                setShowMessage(true);
            }

        })
    }
    konsole.log("JSON", json);

    const getContractDetail = (contractId) => {
        props.dispatchloader(true);
        $getServiceFn.getContractDetail(contractId, (res, err) => {
            if (res) {
                props.dispatchloader(false);
                konsole.log("contract Detail", res);
                const response = res.data.documents[0];
                getDocumentByContractId(response.contractId, response.documentId);
            }
            else {
                konsole.log("contract error", err);
            }
        })
    }


    const base64toBlob = (data) => {

        const bytes = window.atob(data);
        let length = bytes.length;
        let out = new Uint8Array(length);

        while (length--) {
            out[length] = bytes.charCodeAt(length);
        }

        return new Blob([out], { type: 'application/pdf' });
    };

    const getDocumentByContractId = (contractId, documentId) => {
        props.dispatchloader(true);
        $getServiceFn.getDocumentByContractId(contractId, documentId, (res, err) => {
            props.dispatchloader(false);
            if (res) {

                konsole.log("contract document", res);
                // let data = 'data:application/docx;base64,' + res;
                setTemplateList(res.data);
                setShow(true);
            }
            else {
                konsole.log("contract error", err);
            }
        })
    }

    const showDocxFile = (currentFile) => {
        if (currentFile.fileType == undefined) return <p> No file attached.</p>
        const blob = base64toBlob(currentFile.fileContent);
        const url = URL.createObjectURL(blob);

        // var link = document.createElement("a");
        // link.href = url;
        // link.download = currentFile.fileName;
        // link.click();

        return (
            <div className="">
                <iframe src={url} width="100%" height='600' target="_blank"></iframe>
            </div>
        );
    }

    konsole.log("member count", countPerson)
    return (<>

        <Modal show={props.showContract} size="lg" onHide={props.handleContract} onBackdropClick={props.handleContract} backdrop="static">
            <Modal.Header closeButton closeVariant="white">
                <p className='fs-4 text-white'>{props.client?.memberName} - Contract</p>
            </Modal.Header>
            <Modal.Body>
                <div style={{ height: '30vh', minHeight: '200px' }}>
                    {
                        (!show) ?
                            (!showMessage) ?
                                <div className='d-flex justify-content-center align-items-center h-100'>
                                    {
                                        (!docsExist) ?
                                            <div>
                                                <p className='text-center fs-4 mb-3'>Please click on the button below to generate the Contract Document</p>
                                                <div className='d-flex justify-content-center'>
                                                    <button className='theme-btn cursor-pointer' onClick={fetchContraactTemplates}>Create Document</button>
                                                </div>
                                            </div>
                                            :
                                            <div className='text-center fs-4 mb-3'>
                                                <p className='text-center fs-4 mb-3'>This document has already been generated.<br /> If you wish to modify or view the document,<br />please visit Contract Express.
                                                    <br />To update the current documents in Contract Express, please click 'Update' below.</p>
                                                <div className='d-flex justify-content-center'>
                                                    <button className='theme-btn cursor-pointer' onClick={fetchContraactTemplates}>Update Document</button>
                                                </div>
                                            </div>
                                    }
                                </div>
                                :
                                <div className='text-center fs-4 d-flex align-items-center justify-content-center h-100'>
                                    <p>Document has been Generated.<br /> If you want to modify or view the document,<br /> please visit Contract Express. </p>
                                </div>
                            :
                            showContractPdf && showDocxFile(templateList)
                    }
                </div>
            </Modal.Body>
        </Modal>
    </>
    )
}
async function getUserSubjectDataFn(userId) {
    const _resultSubjectResData = await getApiCall('GET', $Service_Url.getSubjectResponse + userId + `/0/0/0`, null);
    konsole.log("_resultSubjectResData", _resultSubjectResData)
    return _resultSubjectResData;
}
function filterBasedKeyValue(list, key, value) {
    return list.filter((item) => item[key] == value)
}
function makeProTypeFormat(protype) {
    switch (protype) {
        case "Financial Advisor":
            return "Financial Advisor";
        case "Accountant":
            return "Accountant";
        case "Bill Pay Service":
            return "Bill Pay";
        case "Property Manager":
            return "Property Management";
        case "Geriatric Care Manager":
            return "Geriatric Care Manager (GCM)";
        default:
            return protype;
    }
}



const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect('', mapDispatchToProps)(ContractExpress);
