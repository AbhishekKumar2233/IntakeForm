import React, { useEffect, useMemo, useState, useContext, useRef } from 'react'
import { Table, Row, Col } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { selectorLegal } from '../../Redux/Store/selectors';
import { getApiCall, postApiCall } from '../../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../../components/network/UrlPath';
import { updateLegalDocumentList, updateUserLegalDocumentList, setPlanType, setSelectedDocType, setShowNewButton, setHasLegalPlanning, setMetaData, setMetaDataForm } from '../../Redux/Reducers/legalSlice';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { $AHelper } from '../../Helper/$AHelper';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import konsole from '../../../components/control/Konsole';
import CustomCalendar from '../../Custom/CustomCalendar';
import { CustomButton, CustomButton2 } from '../../Custom/CustomButton';
import { globalContext } from '../../../pages/_app';
import { useLoader } from '../../utils/utils';
import UploadDoc from './UploadLegalDoc';
import { getOtherFieldsName, getOtherFieldsDetails } from '../../../components/Reusable/ReusableCom';
import { CustomInput, CustomRadio, CustomSelect } from '../../Custom/CustomComponent';
import { $CommonServiceFn } from '../../../components/network/Service';

const LegalDocument = (props) => {
    const { handleNextTab } = props;
    const [initlState, setInitlState] = useState([])
    const { primaryUserId, loggedInUserId } = usePrimaryUserId()
    const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
    const dispatch = useAppDispatch()
    const apiLegalData = useAppSelector(selectorLegal);
    const { legalDocumentList, userLegalDocumentList, planType, selectedDocType, showNewButton, hasLegalPlanning, metaData, metaDataForm } = apiLegalData
    const [isApiCall, setIsAPiCall] = useState(false)
    const willBasedIds = [2, 8, 9, 14, 10, 11, 3];
    const trustBasedIds = [6, 4, 14, 7, 3, 13, 18];
    const previousPlanTypeRef = useRef();
    const [prevState, setPrevState] = useState(null)
    const [isDeleted, setIsDeleted] = useState(false);
    const [userLegalDocWithOther, setUserLegalDocWithOther] = useState([]);
    const [otherValue, setOtherValue] = useState([]);
    const [isYesSelect, setIsYesSelect] = useState(false);
    const [isUserSelect, setisUserSelect] = useState(false);
    const currentDocIds = planType === "will" ? willBasedIds : trustBasedIds;
    konsole.log(prevState,"sdnsdjsdsjdjsdjsdsjdsj", planType, metaData, metaDataForm)

    const filteredUserLegalDocs = userLegalDocumentList.filter(item => {
        const legalDocTypeId = Number(item.legalDocTypeId);
        return currentDocIds.includes(legalDocTypeId);
    });

    const isPlanChanged = planType !== previousPlanTypeRef.current;
    const isWillTrust = planType !== prevState;

    useEffect(() => {
        previousPlanTypeRef.current = planType;
    }, [planType]);

    useEffect(() => {
        previousPlanTypeRef.current = planType;
        if (metaData && metaData.length > 0) {
            if (metaData[0]?.responseData) {
                const initialValue = metaData[0]?.responseData === "Yes" ? "Yes" : ((metaData[0]?.responseData === "No" || metaData[0]?.responseData == null) ? "No" : null);
                handleHasLegalPlanningChange(initialValue);
            } else if (metaData[0] == undefined || metaData[1] == undefined) {
                handleHasLegalPlanningChange(null);
            } else {
                handleHasLegalPlanningChange("No");
            }
            if (metaData[1]?.responseData) {
                const responseData = metaData[1]?.responseData.toLowerCase();
                const initialPlanType = 
                    responseData === "yes" ? "will" :
                    responseData === "no" ? "trust" :
                    (responseData === "will" || responseData === "trust") ? responseData : null;
                handlePlanTypeChange(initialPlanType);
                setPrevState(initialPlanType)
            } else if (metaData[1] == undefined) {
                handlePlanTypeChange(null);
            }
        } else {
            konsole.log('metaData is empty or unavailable');
        }
    }, [metaData, previousPlanTypeRef]);

    const fetchSubjectResponse = async (primaryUserId) => {
        const categoryid = 4;
        const topicId = 5;
        const subjectIds = [405, 406];
        const userID = primaryUserId;
        useLoader(true);
        const promises = subjectIds.map(subjectId =>
            getApiCall('GET', `${$Service_Url.getSubjectResponse}/${userID}/${categoryid}/${topicId}/${subjectId}`, null)
        );
        useLoader(false);
    
        const results = await Promise.all(promises);
        const userSubjects = results?.map(result => result?.userSubjects[0]);
        handleMetaDataChange(userSubjects);
    };

    const fetchFormLabelData = async () => {
        const legalPlansQuestions = [1196, 1197];
        useLoader(true);
        const response = await postApiCall('POST', $Service_Url.getsubjectForFormLabelId, legalPlansQuestions);
        useLoader(false);
        if (response && response?.data?.data) {
            const processedData = response.data.data.map(item => ({
                question: item?.question?.question || '',
                response: item?.question?.response || [],
            }));
            handleMetaDataFormChange(processedData);
        }
    };
      
    const handleDataFetch = async ( userChanges ) => {
        if ($AHelper.$isNotNullUndefine(primaryUserId)) {
            if (userLegalDocumentList.length === 0 || userLegalDocWithOther.length === 0) {
                fetchData();
            }

            if(userChanges == true) return;

            await fetchSubjectResponse(primaryUserId);

            fetchFormLabelData();
        }
    }

    useEffect(() => {
        handleDataFetch();
    }, [primaryUserId]);

    // @@ api fetch saved data
    const fetchData = async () => {
        let legalDocument = legalDocumentList;
        let userLegalDoc = userLegalDocumentList
        useLoader(true);

        // @@ user save doocument data api
        const callApi = [await getApiCall('GET', `${$Service_Url.getLegalDocument}${primaryUserId}/0`)]
        if (legalDocument.length == 0) {
            // @@ user doocument master data api
            callApi.push(await getApiCall('GET', $Service_Url.getLegalType))
        }
        const _resultOfCallAPi = await Promise.all(callApi);
        useLoader(false);
        if (_resultOfCallAPi.length == 2) {
            legalDocument = _resultOfCallAPi[1]
            dispatch(updateLegalDocumentList(_resultOfCallAPi[1]))
        }

        if (_resultOfCallAPi.length > 0) {
            konsole.log("_resultOfCallAPi", _resultOfCallAPi)
            userLegalDoc = _resultOfCallAPi[0]?.legalDocuments;
        }
        // @@ other & without other information
        let userLegalDocWithoutOther = userLegalDoc?.filter((item) => item.legalDocTypeId != 999999)
        let userLegalDocWithOther = userLegalDoc?.filter((item) => item.legalDocTypeId == 999999);
        if (userLegalDocWithOther?.length > 0) {
            setUserLegalDocWithOther([...userLegalDocWithoutOther, ...userLegalDocWithOther]);
        } else {
            setUserLegalDocWithOther([...userLegalDocWithoutOther]);
        }
        // @@ if for legal and userlegal document both are existd
        if (userLegalDoc.length > 0 && legalDocument.length > 0) {
            const result = legalDocument.map((item) => {
                konsole.log("aaaitem", item.value, userLegalDoc)
                const findValue = userLegalDocWithoutOther.find((i) => i.legalDocTypeId == item.value);
                konsole.log("findValue", findValue)
                const json = findValue
                    ? $JsonHelper.$UserLegalDocJson({ ...findValue, upsertedBy: loggedInUserId, docName: findValue?.legalDocType })
                    : $JsonHelper.$UserLegalDocJson({ ...item, legalDocTypeId: item.value, upsertedBy: loggedInUserId, docName: item.label, });
                konsole.log("jsonjson", json)
                return { ...json };
            });
            let newArrayOfResult = result
            // @@ id user save other document 
            if (userLegalDocWithOther.length > 0) {
                const userLegalOtherDoc = userLegalDocWithOther.map(async (item) => {
                    konsole.log("item", item)
                    // @@ this is for getting other details with the help of other api
                    let legaldocName = item.legalDocType;
                    let otherLabel = item.legalDocType;
                    let othersDetails = ''
                    if (item.legalDocTypeId == 999999) {
                        const obj = { userId: primaryUserId, othersCategoryId: 14, othersMapNatureId: item?.userLegalDocId, isActive: true, othersMapNature: '' };
                        let otherDetails = await getOtherFieldsDetails(obj); // Await the async call;
                        otherLabel = otherDetails?.othersName;
                        othersDetails = otherDetails;
                        konsole.log("otherDetails", otherDetails);
                    }
                    return { 'othersDetails': othersDetails, 'otherLabel': otherLabel, ...$JsonHelper.$UserLegalDocJson({ ...item, legalDocTypeId: item.legalDocTypeId, docName: legaldocName, upsertedBy: loggedInUserId }) };
                });
                useLoader(true)
                const otherValRes = await Promise.all(userLegalOtherDoc);
                useLoader(false)
                konsole.log("otherValRes", otherValRes)
                setOtherValue(otherValRes)
                newArrayOfResult = [...result, ...otherValRes]
                konsole.log("userLegalOtherDoc", newArrayOfResult, userLegalDocWithOther, userLegalOtherDoc)
            }
            dispatchUserLegalDoc(newArrayOfResult)
        } else {
            // @@ ELse part for if user comes for the first time save data
            const doc = legalDocument.map((item) => {
                konsole.log("item", item)
                return { ...item, ...$JsonHelper.$UserLegalDocJson({ legalDocTypeId: item.value, docName: item.label, upsertedBy: loggedInUserId }) };
            });
            dispatchUserLegalDoc(doc)
        }
        konsole.log("userLegalDocWithoutOther", userLegalDocWithOther, userLegalDocWithoutOther)
    }
   
    // @@ funciton for add new other document
    const saveNewOtherDocument = async (array) => {
        return new Promise(async (resolve, reject) => {
            let addOtherFilter = array;
            let jsonObj = {
                'userId': primaryUserId,
                'legalDocuments': array
            }
            // @@ first time other value map
            const _resSave = await postApiCall('POST', $Service_Url.postLegalDocument, jsonObj);
            if (_resSave != 'err') {
                const responseDataOfLegalDocument = _resSave.data.data.legalDocuments;

                if (addOtherFilter?.length) {
                    const payload = addOtherFilter?.map(ele => ({
                        createdBy: loggedInUserId,
                        isActive: true,
                        othersCategoryId: 14,
                        othersName: ele?.otherLabel ?? '',
                    }))
                    await postApiCall("POST", $Service_Url.addOtherPath, payload).then(res => {
                        if (res == "err") {
                            useLoader(false)
                            return;
                        }
                        const respArr = res?.data?.data;
                        const payload2 = respArr?.map((ele, i) => ({
                            createdBy: loggedInUserId,
                            isActive: true,
                            othersCategoryId: 14,
                            othersId: ele?.othersId,
                            othersMapNatureId: responseDataOfLegalDocument[i]?.userLegalDocId,
                            othersMapNatureType: "",
                            remarks: "",
                            userId: primaryUserId,
                        }))

                        postApiCall("POST", $Service_Url.mapOtherwithFormPath, payload2);
                        setInitlState()
                        fetchData()
                        useLoader(false)
                    }).finally(() => resolve())
                }
            } else {
                resolve('resolve')
                useLoader(false)
            }
        })
    }

    // @@ function for update document
    const saveNUpdate = async (filterArrayWithoutNewAddOther, type) => {
        return new Promise(async (resolve, reject) => {
            if (!filterArrayWithoutNewAddOther || filterArrayWithoutNewAddOther.length === 0) {
                konsole.log("No valid data provided. Skipping API call.");
                if (type == 'next') {
                    handleNextTab();
                }
                return resolve("resolve");
            }
            let jsonObj = {
                'userId': primaryUserId,
                'legalDocuments': filterArrayWithoutNewAddOther
            }
            konsole.log("jsonObj", jsonObj);
            const _resSave = await postApiCall('POST', $Service_Url.postLegalDocument, jsonObj)
            handleShowNewButton(false)
            setInitlState()
            konsole.log("_resSave", _resSave);
            if (_resSave != 'err') {
                const responseDataOfLegalDocument = _resSave.data.data.legalDocuments;
                const updateOtherFilter = filterArrayWithoutNewAddOther.filter(item => item.legalDocTypeId == 999999);
                // @@ update Other Values 
                if (updateOtherFilter.length > 0) {
                    konsole.log("updateOtherFilter", updateOtherFilter)
                    const resultOfNonOtherValue = updateOtherFilter.map(async (item, index) => {
                        const jsonObj = [{ "othersId": item?.othersDetails?.othersId, "createdBy": null, "createdDate": null, "updatedBy": loggedInUserId, "updatedDate": null, "othersName": item.otherLabel, "othersCategoryId": 14, "isActive": true }]
                        return await postApiCall('PUT', $Service_Url.updateOtherPath, jsonObj);
                    })
                    const res = await Promise.all(resultOfNonOtherValue);
                    resolve('resolve')
                } else {
                    resolve('resolve')
                }
            } else {
                resolve('resolve')
            }
        })
    }
    const isNullUndefined = (data) => {
        return $AHelper.$isNotNullUndefine(data)
    }

    const handleSave = async (type) => {
        let json;
        const userSubjects = [];
    
        const processUserSubjectData = (responseData, metaDataFormIndex) => {
            let responseUserSubjectDataId = null;

            if (metaData && metaData[metaDataFormIndex]) {
                responseUserSubjectDataId = metaData[metaDataFormIndex].userSubjectDataId;
            }
    
            let responseId = null;
            metaDataForm[metaDataFormIndex]?.response.forEach((item) => {
                if (item.response === responseData) {
                    responseId = item.responseId;
                }
            });

            let subjectId = null;
            if (metaDataFormIndex === 0) {
                subjectId = 405;
            } else if (metaDataFormIndex === 1) {
                subjectId = 406;
            }

            if (!responseData && metaDataFormIndex === 0) {
                responseData = isYesSelected ? "Yes" : "No";
                responseId = responseData === "Yes" ? 765 : 766;
                subjectId = 405;
            } else if (responseData && metaDataFormIndex === 1) {
                subjectId = 406;
            }
    
            return {
                userSubjectDataId: responseUserSubjectDataId || 0,
                subjectId,
                response: responseData,
                subResponseData:responseData,
                responseData,
                responseId
            };
        };
    
        if (!isYesSelected) {
            let filterArray = [...(Array.isArray(userlegaldoc) ? userlegaldoc : []), ...(Array.isArray(initlState) ? initlState : [])];
        
            filterArray = filterArray.filter(item => item.isActive === true || item.isChange === true);
        
            const deletedDocs = filterArray.map(item => ({
                ...item,
                isActive: false
            }));
        
            try {
            const deleteResponse = await saveNUpdate(deletedDocs, type);
            userSubjects.push(processUserSubjectData(hasLegalPlanning, 0, planType));
        
                if (deleteResponse == 'resolve') {
                    dispatch(updateUserLegalDocumentList([]));
                    if (metaData[1] && metaData[1].userSubjectDataId) {
                        konsole.log("No previous data found. Skipping API call.");
                        const arrayToDelete = [
                            {
                                userSubjectDataId: metaData[1].userSubjectDataId,
                                deletedBy: loggedInUserId,
                            },
                        ];
                        useLoader(true)
                        const secondApiResponse = await postApiCall( "DELETE", `${$Service_Url.deleteSubjectUser}?UserId=${primaryUserId}`,arrayToDelete );
                        if (secondApiResponse !== "err") {
                            konsole.log("sucessfullRes")
                        } else {
                            konsole.log("Something went wrong")
                        }
                        useLoader(false)
                    }                    
                
                    if (true) {        
                        let responseUserSubjectDataId = null;

                        if (metaData && metaData[1]) {
                            responseUserSubjectDataId = metaData[1].userSubjectDataId;
                        }
                        const responseData = planType;
                        // const responseId = responseData === 766;
        
                        userSubjects.push({
                            subResponseData: responseData,
                            userSubjectDataId: responseUserSubjectDataId || 0,
                            subjectId: 405,
                            response: responseData,
                            responseData: responseData,
                        });

                        const filteredUserSubjects = userSubjects.filter((_, index) => index === 0);

                        const json = {
                            userId: primaryUserId,
                            userSubjects: filteredUserSubjects,
                        };
                        useLoader(true)
                        const _resultPutSubjectData = await postApiCall("PUT", $Service_Url.putSubjectResponse, json);
                        useLoader(false)
        
                        if (_resultPutSubjectData !== "err") {
                            handleDataFetch();
                            toasterAlert("successfully", "Successfully saved data", `Your data have been saved successfully.`);
                        } else {
                            konsole.log("Something went wrong")
                        }
                    } else {
                        konsole.log("Something went wrong")
                    }
                } else {
                    konsole.log("Something went wrong")
                }
            } catch (error) {
                konsole.error("Error:", error);
            }
        } else {
            if (Array.isArray(metaData) && metaData.some(item => item !== undefined)) {
                userSubjects.push(processUserSubjectData(hasLegalPlanning, 0, planType));
        
                const selectedResponse = planType ? (planType === "will" ? "Will" : "Trust") : hasLegalPlanning;
        
                if (planType !== null) {
                    userSubjects.push(processUserSubjectData(selectedResponse, 1, planType));
                }
        
                json = {
                    userId: primaryUserId,
                    userSubjects
                };
        
                const _resultPutSubjectData = await postApiCall("PUT", $Service_Url.putSubjectResponse, json);
                if (_resultPutSubjectData !== "err") {
                    handleDataFetch();
                }
            } else {
                userSubjects.push(processUserSubjectData(hasLegalPlanning, 0, planType));
        
                const selectedResponse = planType ? (planType === "will" ? "Will" : "Trust") : hasLegalPlanning;
                userSubjects.push(processUserSubjectData(selectedResponse, 1, planType));
            
                json = userSubjects.map(subject => ({
                    ...subject,
                    userId: primaryUserId
                }));    
        
                const _resultPostSubjectData = await postApiCall("POST", $Service_Url.postaddusersubjectdata, json);
                if (_resultPostSubjectData !== "err") {
                    handleDataFetch();
                }
            }  
        }        
        let combinedArray = [...(userlegaldoc || []), ...(initlState || [])];
        konsole.log("dggjh-1", combinedArray)
        let isValidate = false;
        combinedArray.map((ele) => {
            if (!isNullUndefined(ele?.legalDocTypeId) && !isNullUndefined(ele?.dateExecuted) && !isNullUndefined(ele?.docFileId)) {
                combinedArray = combinedArray.filter((ele) => $AHelper.$isNotNullUndefine(ele?.legalDocTypeId));
            } else if ((!isNullUndefined(ele?.legalDocTypeId)) && (isNullUndefined(ele?.dateExecuted) || isNullUndefined(ele?.docFileId)) && isValidate == false) {
                isValidate = true;
            }
        })
        konsole.log("dggjh-2", combinedArray, isValidate, isApiCall);

       
    
        if (isApiCall == true && isValidate == false) {
            let filterArray = combinedArray.filter((item) => ((item?.isActive === true && item?.isChange === true)
                || (item?.userLegalDocId !== 0 && $AHelper.$isNotNullUndefine(item?.userLegalDocId) && item?.isChange === true)));

                konsole.log("dggjh-3", filterArray);
            konsole.log("sdbvkjbdskj", filterArray);
            const filterArrayWithoutNewAddOther = filterArray.filter(item => ((item.legalDocTypeId == 999999 && item.userLegalDocId != 0) || item.legalDocTypeId != 999999));
            const filterArrayWithtNewAddOther = filterArray.filter(item => item.legalDocTypeId == 999999 && item.userLegalDocId == 0);
            konsole.log("filterArrayWithoutNewAddOther", filterArrayWithoutNewAddOther, filterArrayWithtNewAddOther);
            konsole.log("dggjh-4", filterArrayWithoutNewAddOther, filterArrayWithtNewAddOther);
            useLoader(true)
            let promises = []
            konsole.log("filterArrayWithtNewAddOther", filterArrayWithtNewAddOther, filterArrayWithoutNewAddOther, userlegaldoc)
            if (filterArrayWithtNewAddOther.length > 0) {
                let promise = saveNewOtherDocument(filterArrayWithtNewAddOther);
                promises.push(promise)
            }
            if (filterArrayWithoutNewAddOther.length > 0) {
                let primise2 = saveNUpdate(filterArrayWithoutNewAddOther, type)
                promises.push(primise2)
            }
            konsole.log("ebkdak-1")
            if (promises.length > 0) {
                try {
                    let results = await Promise.all(promises);
                    konsole.log('results', results);
                    fetchData()
                } catch (errAllPromise) {
                    konsole.log('results', errAllPromise);
                }
            } else {
                konsole.log("No promises to resolve.");
            }

            useLoader(false);
            if (type == 'next') {
                handleNextTab();
            }
        }
        if (isYesSelected) {
            if (isValidate == false) {
                toasterAlert("successfully", "Successfully saved data", `Your data have been saved successfully.`);
            } else {
                toasterAlert("warning", "Warning", `Please select document type`);
                return;
            }
        }
        konsole.log(type,"cjxcjxcjxcxjcxjcxcjxcjxcxj")
        $AHelper.$scroll2Top();
        if (type == 'next') {
            handleNextTab();
        }
    }

    konsole.log("sdbvkjbdskj-outer", )
    // @@ isActive false
    const deleteData = async (item, index) => {
        let obj = { ...item };
    
        // Retain isActive and isChange properties
        obj['isActive'] = false;
        obj['isChange'] = true;
    
        // If you need to clear the dateExecuted and docFileId like in the second function
        obj['dateExecuted'] = null;
        obj['docPath'] = null;
        obj['docFileId'] = null;
    
        let newArr = [...sortedNewOtherShowInLastArr];
        newArr[index] = obj;
    
        // Confirm before proceeding with deletion
        const confirmRes = await newConfirm(
            true,
            `Are you sure you want to delete this document? This action cannot be undone.`,
            "Confirmation",
            "Legal Document",
            2
        );
    
        if (confirmRes) {
            const arrayForDelete = newArr.filter((i) => {
                if (!(item.userLegalDocId == 0 && i.legalDocTypeId == item.legalDocTypeId)) {
                    return { ...item };
                }
            });
            const _forDeleteArray = arrayForDelete.filter(item => (((item.legalDocTypeId == 999999 && item.userLegalDocId != 0) || item.legalDocTypeId != 999999) && item.isChange == true))?.map(ele => ({...ele, UpsertedBy: loggedInUserId}));
            konsole.log(_forDeleteArray,"dhshdshdsjdsdjsdjsdsj")
            const _forAddNewOtherArray = arrayForDelete.filter((i) => i.legalDocTypeId == 999999 && i.userLegalDocId == 0 && i.isActive == true);
    
            let promises = [];
            if (_forAddNewOtherArray.length > 0) {
                let promise = saveNewOtherDocument(_forAddNewOtherArray);
                promises.push(promise);
            }
    
            if (_forDeleteArray.length > 0) {
                let primise2 = saveNUpdate(_forDeleteArray);
                promises.push(primise2);
            }
    
            if (promises.length > 0) {
                useLoader(true);
                let results = await Promise.all(promises);
                konsole.log('results', results);
                useLoader(false);
                toasterAlert("deletedSuccessfully", `Document has been deleted successfully.`);
                fetchData();
            } else {
                toasterAlert("deletedSuccessfully", `Document has been deleted successfully.`);
                konsole.log("No promises to resolve.");
                fetchData();
            }
    
            useLoader(false);
        }
    };
    
    
    // @@ update dispatch
    const dispatchUserLegalDoc = (doc) => {
        konsole.log("docdoc", doc)
        dispatch(updateUserLegalDocumentList(doc))
    }

    const handlePlanTypeChange = (type) => {
        dispatch(setPlanType(type));
    };
    
    const handleDocTypeChange = (type) => {
        dispatch(setSelectedDocType(type));
    };
    
    const handleShowNewButton = (value) => {
        dispatch(setShowNewButton(value));
    };
    
    const handleHasLegalPlanningChange = (value) => {
        dispatch(setHasLegalPlanning(value));
    };
    
    const handleMetaDataChange = (data) => {
        dispatch(setMetaData(data));
    };
    
    const handleMetaDataFormChange = (data) => {
        dispatch(setMetaDataForm(data));
    };

    // @@ update checkbox
    const handleCheckBox = (e, index) => {
        let value = e.target.checked;
        konsole.log('checkValue', value)
        updatewithKeyValue('isActive', value, index)
    }
    // @@ update dispatch
    const updatewithKeyValue = (key, value, index) => {
        setIsAPiCall(true)
        konsole.log('key,value,index', key, value, index)
        let newArray = [...userLegalDocumentList];
        konsole.log("userLegalDocumentListnew", userLegalDocumentList, newArray)
        newArray[index] = { ...newArray[index], [key]: value, 'isChange': true, 'isActive': true };
        konsole.log("newArrayupdatewithKeyValue", newArray);
        dispatchUserLegalDoc(newArray)
    }
    // @@ update dispatch file id
    const updateFilewithKeyValue = (obj) => {
        const { fileId, legalDocTypeId, fileURL, userLegalDocId } = obj;
        setIsAPiCall(true)
        let findIndex = userLegalDocumentList?.findIndex(i => i.legalDocTypeId == legalDocTypeId && i.userLegalDocId == userLegalDocId);
        konsole.log("findIndex", findIndex)
        let newArray = [...userLegalDocumentList];
        newArray[findIndex] = { ...newArray[findIndex], docFileId: fileId, docPath: fileURL, 'isChange': true, isActive: true };
        konsole.log("newArrayFindIndex", findIndex, newArray, newArray[findIndex]);
        dispatchUserLegalDoc(newArray)
    }
    // @@ update dispatch file id for new
    const updateFilewithKeyValueNew = (obj) => {
        const { fileId, legalDocTypeId, fileURL, userLegalDocId, indexes } = obj;
        setIsAPiCall(true)
        let findIndex = initlState?.findIndex((i, index) => i.legalDocTypeId == legalDocTypeId && index == indexes);
        let newArray = [...initlState];
        newArray[findIndex] = { ...newArray[findIndex], docFileId: fileId, docPath: fileURL, 'isChange': true };
        setInitlState(newArray)
    }
    // @@ update dispatch date

    // @@ onchange for date
    const handleChangeDate = (key, e, item, index) => {
        let value = e;

        const today = new Date();
        const selectedDate = new Date(value);

        if (selectedDate > today) {
            toasterAlert("warning", "Warning", 'Please enter the valid date.');
            updateSingleWithKey(key, '', item);
            return;
        }
    
        if (key === 'dateExecuted' && index === 0) {
            let updatedSortedArray = sortedNewOtherShowInLastArr?.map((doc) => {
                if (doc.docName?.trim() !== '') {
                    return {
                        ...doc,
                        dateExecuted: value,
                        isChange: true,
                        isActive: true,
                    };
                }
                return doc;
            });
    
            let updatedInitlState = initlState?.map((doc) => {
                if (doc.docName?.trim() !== '') {
                    return {
                        ...doc,
                        dateExecuted: value,
                        isChange: true,
                        isActive: true,
                    };
                }
                return doc;
            });
    
            if (initlState?.length > 0) {
                dispatchUserLegalDoc(updatedSortedArray);
                setInitlState(updatedInitlState);
                setIsAPiCall(true);
            } else {
                let updatedArray = userLegalDocumentList.map((doc, idx) => {
                    if ([...willBasedIds, ...trustBasedIds].includes(Number(doc?.legalDocTypeId)) != true) return doc;
                    const match = sortedNewOtherShowInLastArr.some(sortedDoc => sortedDoc.legalDocTypeId === doc.legalDocTypeId);
                    if (match) {
                        return { ...doc, 'dateExecuted': value, isChange: true, isActive: true };
                    }
                    return doc;
                });

                konsole.log("updatedArray", updatedArray, initlState);
                dispatchUserLegalDoc(updatedArray);
                setIsAPiCall(true)
            }
        } else {
            updateSingleWithKey(key, e, item);
        }
    };
    
    // @@ onchange for date for new index
    const handleChangeDateForNewIndex = (key, e, item, index) => {
        let value = e
        let exestingData = [...initlState]
        exestingData[index][key] = value;
        setInitlState(exestingData)
    }

    // @@ update single value;
    function updateSingleWithKey(key, e, item,) {
        let value = e
        let findIndex = userLegalDocumentList?.findIndex(i => i.legalDocTypeId == item.legalDocTypeId && i.userLegalDocId == item.userLegalDocId);
        konsole.log("findIndex", findIndex)
        updatewithKeyValue(key, value, findIndex)
    }

    // @@ display selected checkbox inpout with value
    const selectedUserLegalDocData = useMemo(() => {
        if (isDeleted) {
            return initlState;
        }
    
        const filteredDocs = userLegalDocumentList.filter((item) => {
            const isInCurrentDocIds = currentDocIds.includes(item.legalDocTypeId) || ((planType == "will" ? trustBasedIds : willBasedIds)?.includes(item.legalDocTypeId) != true && item?.userLegalDocId);
            return isInCurrentDocIds;
        });
    
        // Include "Without Other" documents if available
        // if (userLegalDocWithOther?.length > 0) {
        //     return [...filteredDocs, ...userLegalDocWithOther];
        // }
            
        return filteredDocs;
    }, [userLegalDocumentList, currentDocIds, userLegalDocWithOther, initlState, isDeleted]); 

    useEffect(() => {
        if (selectedUserLegalDocData?.length > 0 && isUserSelect == false) {
            handleHasLegalPlanningChange("Yes");
        }
    }, [selectedUserLegalDocData, isUserSelect]);

    // @@ for display checkbor without saved other  information
    const userlegaldoc2 = useMemo(() => {
        let newArray = [...userLegalDocumentList]
        let legalDocArray = newArray.filter((item) => !(item.userLegalDocId != 0 && item.legalDocTypeId == 999999))
        return legalDocArray;
    }, [userLegalDocumentList])

    // @@ for display checkbox user legal doc

    ///////@@ filtered remaming data /////////////////////////
    const userlegaldocRemaingData = useMemo(() => {
        let newArray = [...userLegalDocumentList];
        const exextingFilteredData = newArray.filter((ele) => ele?.isActive === true);
        const initlStateIds = exextingFilteredData.map((ele1) => ele1?.legalDocTypeId);
        const others = legalDocumentList.filter(item => 
            !currentDocIds.includes(item.value) &&
            !initlStateIds.includes(Number(item?.value.trim())) &&
            item.value !== "999999" &&
            !willBasedIds.includes(Number(item.value)) &&
            !trustBasedIds.includes(Number(item.value))
        );
        const otherItem = legalDocumentList.find(item => item.value === '999999');
        if (otherItem) {
            others.push(otherItem);
        }
        return others;
    }, [userLegalDocumentList, currentDocIds, legalDocumentList, willBasedIds, trustBasedIds]);

    konsole.log("userLegalDocumentListuseMemo", userLegalDocumentList)
    const userlegaldoc = useMemo(() => {
        return userLegalDocumentList;
    }, [userLegalDocumentList, userlegaldoc2, selectedUserLegalDocData])

    konsole.log("Updateuserlegaldocuserlegaldoc", userlegaldoc, initlState, selectedUserLegalDocData)

    // @@ array sort new other show in the last
    const sortedNewOtherShowInLastArr = useMemo(() => {
        const customOrder = currentDocIds;
        
        // Separate the items that are in the customOrder
        let updatedArray = selectedUserLegalDocData && selectedUserLegalDocData.length > 0
        ? selectedUserLegalDocData.map(item => ({
            ...item,
            legalDocTypeId: Number(item.legalDocTypeId),
            otherDetails: otherValue.find(other => other.userLegalDocId === item.userLegalDocId)?.othersDetails || null,
            otherLabel: otherValue.find(other => other.userLegalDocId === item.userLegalDocId)?.otherLabel || null
        }))
        : [];

        konsole.log(updatedArray,"updatedArray")
    
        const isDateExecutedFound = updatedArray.some(item => item.dateExecuted);
        
        if (updatedArray.length === 0 && planType) {        
            const filteredDocsMain = userLegalDocumentList.filter(item =>
                currentDocIds.includes(Number(item.legalDocTypeId))
            );        
            return [...filteredDocsMain];
        } else if (updatedArray.length > 0 && !isDateExecutedFound) {
            // Combine filteredUserLegalDocs and updatedArray if selectedUserLegalDocData exists
            const combinedArray = [...filteredUserLegalDocs, ...updatedArray];
            
            // Remove duplicates based on legalDocTypeId or any unique identifier
            const uniqueCombinedArray = Array.from(
                new Map(
                    combinedArray.map(item => 
                        item.legalDocTypeId === 999999 
                            ? [Symbol(), item] // handle special case
                            : [item.legalDocTypeId, item]
                    )
                ).values()
            );
            
            // Separate the items that are in the customOrder
            const orderedItems = uniqueCombinedArray.filter(item => customOrder.includes(item.legalDocTypeId));
            const remainingItems = uniqueCombinedArray.filter(item => !customOrder.includes(item.legalDocTypeId));
            
            // Sort the ordered items according to the customOrder array
            orderedItems.sort((a, b) => customOrder.indexOf(a.legalDocTypeId) - customOrder.indexOf(b.legalDocTypeId));
            remainingItems.sort((a, b) => (a.userLegalDocId) - (b.userLegalDocId));
            
            // Concatenate the ordered items with the remaining items
            konsole.log(orderedItems, remainingItems,"jdsjsdsjdsjdsjdsjds")
            if (isDeleted) {
                return [...orderedItems];
            } else {
                return [...orderedItems, ...remainingItems];
            }
        } else if (updatedArray.length > 0 && isDateExecutedFound) {

            const filteredData = selectedUserLegalDocData.filter((doc) => {
                if (planType === 'will') {
                    return !trustBasedIds.includes(doc.legalDocTypeId);
                }
                if (planType === 'trust') {
                    return !willBasedIds.includes(doc.legalDocTypeId);
                }
                return true;
            });
            
            // const combinedArray = (() => {
            //     if (isDeleted) {
            //         if (!isPlanChanged) {
            //             return [...updatedArray];
            //         }
            //         return isPlanChanged
            //             ? [...filteredUserLegalDocs, ...updatedArray]
            //             : updatedArray.length < 7
            //                 ? [...filteredUserLegalDocs]
            //                 : [...updatedArray];
            //     } else {
            //        konsole.log(selectedUserLegalDocData, "sfkdkfdkfdfkdfkdkfdkfdkfk",filteredData,filteredUserLegalDocs, isWillTrust, planType)
            //         if (userLegalDocWithOther.length > 0 && !isWillTrust) {
            //             return [...updatedArray, ...filteredUserLegalDocs];
            //         }
            //         return isPlanChanged
            //             ? [...filteredUserLegalDocs, ...updatedArray]
            //             : updatedArray.length < 7
            //                 ? [...filteredUserLegalDocs, ...filteredData] 
            //                 : [...filteredUserLegalDocs, ...filteredData];
            //     }
            // })();  
            const combinedArray = (() => {
                if (planType === null) {
                    return [...updatedArray];
                }
            
                if (isDeleted) {
                    if (!isPlanChanged) {
                        return [...updatedArray];
                    }
                    return isPlanChanged
                        ? [...filteredUserLegalDocs, ...updatedArray]
                        : updatedArray.length < 7
                            ? [...filteredUserLegalDocs]
                            : [...updatedArray];
                } else {
                   konsole.log(selectedUserLegalDocData, "sfkdkfdkfdfkdfkdkfdkfdkfk",filteredData, isWillTrust, planType)
                    if (userLegalDocWithOther.length > 0 && !isWillTrust) {
                        return [...updatedArray, ...filteredUserLegalDocs];
                    }
                    return isPlanChanged
                        ? [...filteredUserLegalDocs, ...updatedArray]
                        : updatedArray.length < 7
                            ? [...filteredUserLegalDocs, ...filteredData] 
                            : [...filteredUserLegalDocs, ...filteredData];
                }
            })();   
            konsole.log(combinedArray,"sdsdskdsdksdksdksdksskdsdk")         
            
            const uniqueCombinedArray = Array.from(
                new Map(
                    combinedArray.reduce((acc, item) => {
                        if (item.legalDocTypeId === 999999) {
                            acc.push([Symbol(), item]);
                        } else {
                            const existingItem = acc.find(([key]) => key === item.legalDocTypeId);
            
                            if (existingItem) {
                                const [existingValue] = existingItem;
                                const currentHasFileDetails = item.docFileId && item.docPath;
                                const existingHasFileDetails = existingValue.docFileId && existingValue.docPath;
            
                                if (currentHasFileDetails && !existingHasFileDetails) {
                                    existingItem[1] = item;
                                }
                            } else {
                                acc.push([item.legalDocTypeId, item]);
                            }
                        }
                        return acc;
                    }, [])
                ).values()
            );            
                        
            // Separate items by customOrder and remaining
            const orderedItems = uniqueCombinedArray.filter(item => customOrder.includes(item.legalDocTypeId));
            const remainingItems = uniqueCombinedArray.filter(item => !customOrder.includes(item.legalDocTypeId));
            
            let filteredRemainingItems = remainingItems;
            if (isPlanChanged) {
                filteredRemainingItems = remainingItems.filter(
                    remainingItem => !orderedItems.some(
                        orderedItem => orderedItem.legalDocTypeId === remainingItem.legalDocTypeId
                    )
                );
            }
    
            // Sort and merge arrays
            orderedItems.sort((a, b) => customOrder.indexOf(a.legalDocTypeId) - customOrder.indexOf(b.legalDocTypeId));
            filteredRemainingItems.sort((a, b) => (a.userLegalDocId) - (b.userLegalDocId));

            // Concatenate the ordered items with the filtered remaining items (which are unsorted)
            konsole.log(orderedItems, filteredRemainingItems,"DFdfdfkdfkdfdkdkdkdfkdfdkf")
            return [...orderedItems, ...filteredRemainingItems];
        } else {
            // When updatedArray is empty, use only filteredUserLegalDocs
            const orderedItems = filteredUserLegalDocs.filter(item => customOrder.includes(item.legalDocTypeId));
            const remainingItems = filteredUserLegalDocs.filter(item => !customOrder.includes(item.legalDocTypeId));
            
            // Sort the items as before
            orderedItems.sort((a, b) => customOrder.indexOf(a.legalDocTypeId) - customOrder.indexOf(b.legalDocTypeId));
            remainingItems.sort((a, b) => (a.userLegalDocId) - (b.userLegalDocId));
            konsole.log(orderedItems, remainingItems,"kdsjsdsjdsjdsjdsjds")
            return [...orderedItems, ...remainingItems];
        }
    }, [selectedUserLegalDocData, userLegalDocumentList, currentDocIds, planType, willBasedIds, trustBasedIds, isDeleted]);
    konsole.log(selectedUserLegalDocData, sortedNewOtherShowInLastArr,"sdjsdksdksdskdskdsk")
    
    // @@ toaster
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }
    const handleSelectChange = (e, index) => {
        setIsAPiCall(true)
        handleDocTypeChange(e?.value)
        // let exestingIndex = [...initlState]
        // exestingIndex[index].legalDocTypeId = e?.value
        // exestingIndex[index].docName = e?.label
        // exestingIndex[index].isActive = true
        // exestingIndex[index]['isChange']  = true
        // setInitlState(exestingIndex)

        setInitlState(prevState =>
            prevState.map((item, idx) =>
                idx === index
                    ? {
                        ...item,
                        legalDocTypeId: e?.value,
                        docName: e?.label,
                        isActive: true,
                        isChange: true
                    }
                    : item
            )
        );

    }

    const handelCreateNewIndex = () => {
        handleShowNewButton(true)
        setInitlState(prevInitialState => [
            ...(prevInitialState || []),
            { legalDocTypeId: "", dateExecuted: null, docName: "", docPath: null, docFileId: null, userLegalDocId: 0, upsertedBy: loggedInUserId, isActive: "", }
        ]);

    }
    const filterDocType = (data, item) => {
        const filtereds = data?.filter((ele1) => !initlState.some((ele) => ele?.legalDocTypeId == ele1.value && ele1.value != "999999" && ele1.value != item?.legalDocTypeId));
        const newFilteredData = filtereds.filter((ele)=>!currentDocIds.includes(ele.value))
        return newFilteredData;
    };
    const deleteDataNew = async (item, indexes) => {
        const filteredData = initlState?.filter((ele, index) => index != indexes)
        const confirmRes = await newConfirm(true, `Are you sure you want to delete this document.? This action cannot be undone.`, "Confirmation", "Legal Document", 2);
        if (confirmRes == true) {
            setInitlState(filteredData)
        }

    }

    const handleChangeLegal = async(value, key) => {
        setisUserSelect(true);
        if (key === "hasLegalPlanning") {
            const mappedValue = value ? "Yes" : "No";
            handleHasLegalPlanningChange(mappedValue);
            if (mappedValue === "No") {
                if (selectedUserLegalDocData?.length > 0) {
                    const confirmMessages =
                    "Are you sure to proceed with the action, as it may cause changes to uploded documents?";
                    
                    const confirmRes = await newConfirm(true, confirmMessages, "Confirmation", "Legal Document", 2);
    
                    if (confirmRes) {
                        handlePlanTypeChange(null);
                        setInitlState([]);
                    } else {
                        setIsYesSelect(true);
                        handleHasLegalPlanningChange("Yes");
                    }
                } else {
                    handlePlanTypeChange(null);
                    setInitlState([]);
                }
            } else {
                handleDataFetch( true );
            }
        }
    };
    
    const handleChangePlan = async(value, key) => {
        if (key === "planType") {
            const mappedValue = value === "willBased" ? "will" : value === "trustBased" ? "trust" : null;
            konsole.log(selectedUserLegalDocData,sortedNewOtherShowInLastArr,"dfdjfdjfdjfdfjdfjdfdjfdj")
            if (selectedUserLegalDocData?.length > 0 || (selectedUserLegalDocData?.length === 0 && sortedNewOtherShowInLastArr?.length > 0 && !metaData.some(item => item === undefined))) {
                const conflictIds =
                    mappedValue === "will"
                        ? trustBasedIds.filter((id) => sortedNewOtherShowInLastArr.some((item) => parseInt(item.legalDocTypeId) === id))
                        : willBasedIds.filter((id) => sortedNewOtherShowInLastArr.some((item) => parseInt(item.legalDocTypeId) === id));
                        konsole.log(conflictIds,"dfdkfdkfdkfdfkdf")
    
                if (conflictIds.length > 0) {
                    if (selectedUserLegalDocData?.length > 0) {
                        const confirmMessage =
                            mappedValue === "will"
                                ? "You have a previously Trust-based saved document list. Would you like to remove it?"
                                : "You have a previously Will-based saved document list. Would you like to remove it?";
        
                        const confirmRes = await newConfirm(true, confirmMessage, "Confirmation", "Legal Document", 2);
        
                        if (confirmRes) {
                        handlePlanTypeChange(mappedValue);
                        setInitlState([]);
                        deleteUnwanterDoc(mappedValue);
                        fetchData();
                        } else {
                            return
                        }
                    } else {
                        setInitlState([]);
                        handlePlanTypeChange(mappedValue);
                    }
                } else{
                    return
                }
            } else {
                handlePlanTypeChange(mappedValue);
                setInitlState([]);
            }
        }
    };

    const deleteUnwanterDoc = async( mappedValue ) => {
        let removableId = mappedValue == "will" ? trustBasedIds : willBasedIds;
        const selectedIds = mappedValue == "will" ? willBasedIds : trustBasedIds;
        removableId = removableId?.filter(ele => selectedIds?.includes(ele) != true)
        const deleteArra = userLegalDocumentList?.filter(ele => removableId?.includes(ele?.legalDocTypeId))?.map(ele => ({...ele, isActive: false}));
        const result = await saveNUpdate(deleteArra);
        if (result === 'resolve') {
            toasterAlert("deletedSuccessfully", `Document has been deleted successfully.`);
        } else {
            toasterAlert("warning", "Warning", "Something went wrong.");
        }
    }

    const isYesSelected = (() => {
        if (hasLegalPlanning === "Yes") {
            return true;
        }
        if (hasLegalPlanning === "No") {
            return false;
        }
        if (selectedUserLegalDocData.length > 0) {
            return true;
        }
        return null;
    })();  

    useEffect(() => {
        if (isYesSelected && !planType && metaData && metaData[1]?.responseData) {
            handlePlanTypeChange(metaData[1]?.responseData.toLowerCase());
        }
    }, [isYesSelected, metaData]);

    return (
        <>
            <div>
                <p className='heading-of-sub-side-links-2 pt-2'>Please upload your previous legal documents..</p>
                <div id='monthlyIncome' className='pb-0'>
                    <div className='withDescription'>
                    <Row className='d-flex justify-content-between'>
                        <Col className={`monthlyIncomeTable ${hasLegalPlanning === "Yes" ? 'pb-1' : ''}`}>
                            <CustomRadio
                                tabIndex={1}
                                value={isYesSelected}
                                options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]}
                                placeholder={metaData && metaData.length > 0 && metaData[0]?.formLabelId === 1196 
                                    ? metaData[0]?.question 
                                    : (metaDataForm && metaDataForm.length > 0 ? metaDataForm[0]?.question : '')}                                
                                onChange={(item) => {
                                    if (item) {
                                        setIsYesSelect(item.value);
                                        handleChangeLegal(item?.value, 'hasLegalPlanning');
                                    }
                                }}
                            />
                        </Col>
                    </Row>
                    {(isYesSelected) && (
                        <Row className='d-flex justify-content-between'>
                            <Col className='monthlyIncomeTable pb-2'>
                                <CustomRadio
                                   tabIndex={2}
                                    value={planType === "will" ? "willBased" : planType === "trust" ? "trustBased" : metaData && metaData[1]?.responseData ? metaData[1]?.responseData.toLowerCase() : null}
                                    options={[{ label: 'Will', value: 'willBased' }, { label: 'Trust', value: 'trustBased' }]}
                                    placeholder={
                                        (metaData && metaData.length > 1 && metaData[1]?.formLabelId === 1197 
                                            ? metaData[1]?.question 
                                            : (metaDataForm && metaDataForm.length > 1 ? metaDataForm[1]?.question : ''))
                                        }                                    
                                    onChange={(item) => {
                                        if (item) {
                                            setPrevState(planType)
                                            setPlanType(item?.value);
                                            handleChangePlan(item?.value, 'planType');
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                        )}
                        {(isYesSelected && (
                            (selectedUserLegalDocData.length === 0 && (planType === "will" || planType === "trust")) ||
                            ((metaData && metaData.length > 0 && metaData[0]?.responseData === "Yes") && planType == null && selectedUserLegalDocData.length > 0) ||
                            ((metaData && metaData.length > 0 && metaData[0]?.responseData === "Yes") && (planType === "will" || planType === "trust" || planType === undefined) && selectedUserLegalDocData.length === 0) ||
                            ((metaData && metaData.length > 0 && metaData[0]?.responseData === "Yes") && (planType === "will" || planType === "trust" || planType === undefined) && selectedUserLegalDocData.length > 0) ||
                            (selectedUserLegalDocData.length > 0)
                        )) ? (
                        <Row className='d-flex mt-4 justify-content-between'>
                            <Col className='monthlyIncomeTable'>
                                <div className='monthlyIncomeTable-table mb-4'>
                                    <div className='table-responsive'>

                                        <div className='table-container'>
                                            <Table className='custom-table mb-0'>

                                                <thead className='table-header' style={{ borderRadius: "10px" }}>
                                                    <tr className='heading'>
                                                        {['Document',  'Date executed(MM/DD/YYYY)', 'View/Upload/Delete'].map((item, index) => (
                                                            <th key={index} className={`customHeadingForTable ${item == 'View/Upload/Delete' ? 'text-end'  : ''}`} style={item === 'Document' ? { width: '38%' } : {}}>
                                                                <p>{item}</p>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>

                                                <tbody className='monthlyIncomeTableBody'>
                                                    {sortedNewOtherShowInLastArr && sortedNewOtherShowInLastArr.map((item, index) => (

                                                        <tr className='mainIncomeType' key={index}>
                                                            <td style={{width:"38%"}}>
                                                                <p className='' style={{ marginTop: '4px', fontWeight: 500, color: '#222222' }}>
                                                                    {(item?.legalDocTypeId == 999999) ? (
                                                                        <div style={{ display: 'flex', alignItems: 'center' }} className='custom-input-field-document-other'>
                                                                            {konsole.log("jasghdgaj", item)}
                                                                            <span className='ms-2' >{item.docName || item?.legalDocType}</span>
                                                                            <input
                                                                                key={index + item?.otherLabel}
                                                                                placeholder="Other Description"
                                                                                id='otherLabel'
                                                                                defaultValue={$AHelper.$isNotNullUndefine(item?.otherLabel) ? $AHelper.capitalizeFirstLetterEachWord(item?.otherLabel) : ''}
                                                                                style={{ marginLeft: '10px' }} // Optional: add some space between the text and the input
                                                                                onChange={(val) => handleChangeDate('otherLabel', val.target.value, item, index)}
                                                                            />
                                                                        </div>
                                                                    ) : item.docName ? item.docName : item.legalDocType}
                                                                </p>  </td>
                                                            <td className={sortedNewOtherShowInLastArr?.length - 3 < index  ? 'open-down' : ''}>
                                                                <CustomCalendar tabIndex={3} type = 'dateOfBirth' label={''} isError='' name='dateExecuted' id='dateExecuted' placeholder="mm/dd/yyyy" value={item.dateExecuted} onChange={(val) => handleChangeDate('dateExecuted', val, item, index)} />
                                                            </td>
                                                            <td className='w-20'>
                                                                <div className=" d-flex justify-content-end">
                                                                <UploadDoc  key={`${index}-${item.fileId}`} indexes={index} {...item} updateFilewithKeyValue={updateFilewithKeyValue} />
                                                                <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer p-2" onClick={() => deleteData(item, index)} />
                                                                </div>
                                                            </td>


                                                        </tr>
                                                    ))}
                                                    {showNewButton == true &&
                                                        <>
                                                            {initlState && initlState.map((item, index) => (
                                                                
                                                                <tr className='mainIncomeType' key={index}>

                                                                    <td style={{width:"38%"}}>
                                                                        <p style={{ marginTop: '4px', fontWeight: 500, color: '#222222' }}>
                                                                            {(item?.legalDocTypeId == 999999) ? (
                                                                                <div style={{ display: 'flex', alignItems: 'center' }} className='custom-input-field-document-other'>
                                                                                    <span className='ms-2' >Other</span>
                                                                                    <input
                                                                                       tabIndex={4}
                                                                                        key={index}
                                                                                        placeholder="Other Description"
                                                                                        id='otherLabel'
                                                                                        value={$AHelper.$isNotNullUndefine(item?.otherLabel) ? (item?.otherLabel) : ''}
                                                                                        style={{ marginLeft: '10px' }} // Optional: add some space between the text and the input
                                                                                        onChange={(val) => handleChangeDateForNewIndex('otherLabel', val.target.value, item, index)}
                                                                                    />
                                                                                </div>
                                                                            ) :
                                                                                <>
                                                                                    <CustomSelect tabIndex={5} isError='' label="" placeholder='Select'
                                                                                        value={item?.legalDocTypeId}
                                                                                        onChange={(e) => handleSelectChange(e, index)}
                                                                                        options={filterDocType(userlegaldocRemaingData, item)} />
                                                                                </>
                                                                            }
                                                                        </p>  </td>
                                                                    <td className='30'>
                                                                        <CustomCalendar tabIndex={6} type = 'dateOfBirth' label={''} isError='' name='dateExecuted' id='dateExecuted' placeholder="mm/dd/yyyy" value={item.dateExecuted} onChange={(val) => handleChangeDateForNewIndex('dateExecuted', val, item, index)} />
                                                                    </td>
                                                                    <td className='20'>
                                                                        <div className=" d-flex justify-content-end">
                                                                            <UploadDoc key={index} indexes={index} {...item} updateFilewithKeyValue={updateFilewithKeyValueNew} />
                                                                            <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer p-2" onClick={() => deleteDataNew(item, index)} />
                                                                        </div>
                                                                    </td>


                                                                </tr>
                                                            ))}
                                                        </>}

                                                    <>
                                                        <tr className='mainIncomeType'>
                                                            <td>
                                                                <div tabIndex={7} className='AddNewButton text-center align-items-center' onClick={() => handelCreateNewIndex()}>
                                                                    <span style={{ fontSize: '20px' }}>+</span> Add New Document Type
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </>
                                                    {/* } */}



                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>

                            </Col>

                        </Row>) : null}
                    </div>
                </div>
                <Row style={{ marginTop: '24px' }} className='mb-3'>
                    <div className='d-flex justify-content-between'>
                        <CustomButton2 tabIndex={8}  label="Save & Continue later" onClick={() => handleSave('later')} />
                        <div>
                            <CustomButton tabIndex={9}  label={'Next : Fiduciary/Beneficiary'} onClick={() => handleSave('next')} />
                        </div>
                    </div>
                </Row>
            </div>
        </>
    )
}

export default LegalDocument
