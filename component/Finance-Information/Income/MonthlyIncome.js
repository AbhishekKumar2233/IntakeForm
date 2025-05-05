import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { Row, Col, Accordion, Table, Form } from 'react-bootstrap';
import konsole from '../../../components/control/Konsole';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { selectApi, selectMonthlyIncome, selectPersonal } from '../../Redux/Store/selectors';
import { fetchIncomeTypes, fetchUserMonthlyIncome, fetchSpouseMonthlyIncome, fetchSubjectForFormLabelIdAnswer, fetchSubjectForFormLabelId, setprimaryUserMonthlyIncome, setSpouseUserMonthlyIncome } from '../../Redux/Reducers/incomeSlice';
import { fetchOccupationData } from '../../Redux/Reducers/apiSlice';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { useLoader } from '../../utils/utils';
import { monthlyIncome } from '../../../components/control/Constant';
import { globalContext } from '../../../pages/_app';
import { CustomCurrencyInput, CustomInput, CustomPercentageInput, CustomRadio, CustomTextarea } from '../../Custom/CustomComponent';
import { focusInputBox, isNotValidNullUndefile, isNullUndefine, postApiCall } from '../../../components/Reusable/ReusableCom';
import { $AHelper } from '../../Helper/$AHelper';
import { $Service_Url } from '../../../components/network/UrlPath';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { $ApiHelper } from '../../Helper/$ApiHelper';
import { CustomeSubTitleWithEyeIcon } from '../../Custom/CustomHeaderTile';

const MonthlyIncome = forwardRef((props, ref) => {
    const { primaryUserId, spouseUserId, loggedInUserId, primaryMemberFullName, spouseFullName,isPrimaryMemberMaritalStatus,_spousePartner } = usePrimaryUserId();
    const [mergedIncomes, setMergedIncomes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [occupationData, setOccupationData] = useState({ primary: null, spouse: null });
    const [otherRowsData, setOtherRowsData] = useState([$JsonHelper.$mothlyIcomeOtherObje()]);
    const [income, setIncome] = useState({
        primaryNetIncome: {},
        spouseNetIncome: {},
        currencyIncome: 'USD',
        saving: '0.00',
        currencySaving: 'USD',
        pensionPercentage: '0.00',
        anticipatedIncome: '0.00',
        anticipatedCurrency: 'USD',
    });
   
    konsole.log(otherRowsData, "otherRowsData")
    const [questions, setQuestions] = useState([]);
    const startingTabIndex = props?.startTabIndex ?? 0;

    const dispatch = useAppDispatch();
    const { incomeTypes, subjectForFormLabelId, primaryUserMonthlyIncome, SpouseUserMonthlyIncome } = useAppSelector(selectMonthlyIncome);
    const { occcupationSavedData } = useAppSelector(selectApi);
    const personalReducer = useAppSelector(selectPersonal);
    const [isUpdating, setIsUpdating] = useState(false);
    const { spouseDetails } = personalReducer;
    const { setWarning , newConfirm } = useContext(globalContext)
    const isPrimaryWorkingVisible = occupationData?.primary?.isWorking == null || occupationData?.primary?.isWorking == true;
    const isSpouseWorkingVisible = (occupationData?.spouse?.isWorking == true || occupationData?.spouse?.isWorking == null) && (isPrimaryMemberMaritalStatus);
    const isPrimaryRetirementVisible = (occupationData?.primary?.isWorking == true || occupationData?.primary?.isWorking == false || occupationData?.primary?.isWorking == null);
    const isSpouseRetirementVisible = (occupationData?.spouse?.isWorking == true || occupationData?.spouse?.isWorking == false || occupationData?.spouse?.isWorking == null) && (isPrimaryMemberMaritalStatus);

    useEffect(() => {
        if(primaryUserId && isNotValidNullUndefile(isPrimaryMemberMaritalStatus) && (isPrimaryMemberMaritalStatus == false || isNotValidNullUndefile(spouseUserId))) {
            if (incomeTypes?.length > 0) {
                fetchData();
            } else {
                dispatch(fetchIncomeTypes());
            }
        } 
    }, [ incomeTypes, primaryUserId, isPrimaryMemberMaritalStatus]);

    useImperativeHandle(ref, () => ({
        fetchData,
        handleUpdateClick,
    }));

    const fetchData = async ( forceFetch ) => {
        useLoader(true);
        await fetchFormLabelIdQuestion(forceFetch);
        await fetchAndSetIncomes(forceFetch);
        await fetchOccupation();
        useLoader(false);
        // await fetchFormLabelIdAnswer();
    };

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    };

    const validateIncomeDetails = () => {
        const errorInputIndex = otherRowsData?.findIndex(ele => !ele?.othersName && (Number(ele?.incomePrimary) || Number(ele?.incomeRetirementPrimary) || Number(ele?.incomeSpouse) || Number(ele?.incomeRetirementSpouse)));
        if(errorInputIndex != -1) { 
            toasterAlert('warning', 'Warning', "Please fill the income source details!");
            focusInputBox('otherRowsData' + errorInputIndex)
        }
        return errorInputIndex == -1;
    }

    const handleUpdateClick = async () => {
        if(validateIncomeDetails() != true) return false;
        useLoader(true);
        const createUserIncomeObjList = (isSpouse) => {
            return mergedIncomes.map(income => ({
                isActive: income?.isActive,
                userIncomeId: isSpouse ? income?.userIncomeIDSpouse : income?.userIncomeIDPrimary,
                incomeTypeId: income?.incomeTypeId,
                grossAmt: isSpouse ? income?.incomeSpouse : income?.incomePrimary,
                retProjAmt: ((!isPrimaryWorkingVisible && !isSpouse) || (!isSpouseWorkingVisible && isSpouse)) ? "0.00" : isSpouse ? income?.incomeRetirementSpouse : income?.incomeRetirementPrimary,
            }));
        };

        const upsertUserIncomeFunc = async (userId, isSpouse) => {
            const totalInput = {
                userIncome: createUserIncomeObjList(isSpouse),
                userId: userId,
                upsertedBy: loggedInUserId,
            };

            await postApiCall('POST', $Service_Url.upsertUserIncome, totalInput);
        };

        const upsertUserSubjectData = async (userId, userSubjects) => {
            try {
                // Filter out deselected subjects
                const filterDeselectedSubjects = userSubjects.filter(ele => (ele.userSubjectDataId !== "" && ele.subResponseData === undefined));
                const getUerSubjectIdsDeselected = filterDeselectedSubjects.map(data => ({ userSubjectDataId: data.userSubjectDataId }));
                
                // Check if there are any deselected subjects and delete them
                if (getUerSubjectIdsDeselected.length > 0) {
                    const deleteUrl = `${$Service_Url.deleteSubjectUser}?UserId=${userId}`;
                    await postApiCall("DELETE", deleteUrl, getUerSubjectIdsDeselected);
                }

                // Iterate through userSubjects to check conditions for subjectIds 119 and 122
                userSubjects.forEach(subject => {
                    // If subjectId 119 has subResponseData "No", set subResponseData of subjectId 122 to 0
                    if (subject.subjectId === 119 && subject.subResponseData === "No") {
                        const subject122 = userSubjects.find(s => s.subjectId === 122);
                        if (subject122) {
                            subject122.subResponseData = "";
                        }
                    }

                    // If subjectId 121 has subResponseData "No", set subResponseData of subjectId 232 to 0 and subjectId 238 to blank
                    if (subject.subjectId === 121 && subject.subResponseData === "No") {
                        const subject232 = userSubjects.find(s => s.subjectId === 232);
                        if (subject232) {
                            subject232.subResponseData = "";
                        }

                        const subject238 = userSubjects.find(s => s.subjectId === 238);
                        if (subject238) {
                            subject238.subResponseData = ""; 
                        }
                    }
                });

                // Prepare data to update and save
                let updateSubResponseData = {
                    userId: userId,
                    userSubjects: userSubjects?.filter(ele => isNotValidNullUndefile(ele.userSubjectDataId))
                };

                let saveSubResponseData = userSubjects?.filter(ele => !isNotValidNullUndefile(ele.userSubjectDataId) && isNotValidNullUndefile(ele.subResponseData))?.map(ele => ({
                    ...ele,
                    userId: userId,
                }));

                // Log the data for debugging
                konsole.log("updateSubResponseData", updateSubResponseData);

                // Perform upsert operations
                if (updateSubResponseData?.userSubjects?.length) await upsertSubjectData(true, updateSubResponseData);
                if (saveSubResponseData?.length) await upsertSubjectData(false, saveSubResponseData);
            } catch (error) {
                konsole.error("Error in upserting user subject data:", error);
            }
        };

        let updateSuccess = true;

        await upsertOtherIncomeDatas();

        if (primaryUserId) {
            const primaryUpdateSuccess = await upsertUserIncomeFunc(primaryUserId, false);
            if (!primaryUpdateSuccess) {
                updateSuccess = false;
            }
        }

        if (isPrimaryMemberMaritalStatus) {
            const spouseUpdateSuccess = await upsertUserIncomeFunc(spouseUserId, true);
            if (!spouseUpdateSuccess) {
                updateSuccess = false;
            }
        }

        const primarySubjectData = Object.values(income?.primaryNetIncome);
        if (primaryUserId && primarySubjectData?.length) {
            const primaryResponseSuccess = await upsertUserSubjectData(primaryUserId, primarySubjectData);
            if (!primaryResponseSuccess) {
                updateSuccess = false;
            }
        }

        const spouseSubjectData = Object.values(income?.spouseNetIncome);
        if (isPrimaryMemberMaritalStatus && spouseSubjectData?.length) {
            const spouseResponseSuccess = await upsertUserSubjectData(spouseUserId, spouseSubjectData);
            if (!spouseResponseSuccess) {
                updateSuccess = false;
            }
        }
        useLoader(false);
        const action = isUpdating ? 'Updated' : 'Saved';
        const statusMessage = isUpdating ? 'Data has been updated successfully.' : 'Data has been saved successfully.';
        // toasterAlert('successfully', `${action} successfully`, statusMessage);
        fetchData(true);
        return true;
    };

    konsole.log("asbvdb", income?.primaryNetIncome, income?.spouseNetIncome);

    const upsertSubjectData = async (toUpdate, payLoad) => {
        const method = toUpdate == true ? "PUT" : "POST";
        const url = toUpdate == true ? $Service_Url.putSubjectResponse : $Service_Url.postaddusersubjectdata;

        await postApiCall(method, url, payLoad);
    }

    const fetchOccupation = async () => {
        try {
            useLoader(true);
            if (!occcupationSavedData?.length || !Object.keys(occcupationSavedData)?.length) {
                const fetchPromises = [
                    dispatch(fetchOccupationData({ userId: primaryUserId }))
                ];

                
                if (isPrimaryMemberMaritalStatus) {
                    fetchPromises.push(dispatch(fetchOccupationData({ userId: spouseUserId })));
                }

                const [primaryOccupationResponse, spouseOccupationResponse] = await Promise.all(fetchPromises);

                const primaryOccupationData = primaryOccupationResponse?.payload?.[0];
                const spouseOccupationData = spouseUserId ? spouseOccupationResponse?.payload?.[0] : null;

                setOccupationData({ primary: primaryOccupationData, spouse: spouseOccupationData });
            } else {
                const primaryOccupationData = occcupationSavedData.primary;
                const spouseOccupationData = spouseUserId ? occcupationSavedData.spouse : null;

                setOccupationData({ primary: primaryOccupationData, spouse: spouseOccupationData });
            }

        } catch (error) {
            // console.error('Error fetching occupation data:', error);
        } finally {
            useLoader(false);
        }
    }

    konsole.log("occupationData", occupationData)

    const fetchFormLabelIdQuestion = async ( forceFetch ) => {
        try {
            useLoader(true);
            let FormLabelIdQuestion;

            if (!subjectForFormLabelId?.length || forceFetch) {
                FormLabelIdQuestion = await dispatch(fetchSubjectForFormLabelId(monthlyIncome.formLabelId));
            } else {
                FormLabelIdQuestion = subjectForFormLabelId;
            }
            const questionsData = FormLabelIdQuestion && FormLabelIdQuestion.length > 0
            ? FormLabelIdQuestion
            : FormLabelIdQuestion.payload;
 
            const questions = questionsData.map(item => ({
                questionId: item.question.questionId,
                question: item.question.question,
                formId: item.formLabelId,
                subjectId: item.subjectId,
                responses: item.question.response
            }))?.reduce((tempRslt, curRslt) => {
                tempRslt["label" + curRslt?.formId] = curRslt;
                return tempRslt;
            }, {});

            konsole.log(questions, "qshahshshash")
            setQuestions(questions);

            if (isPrimaryMemberMaritalStatus) {
                await fetchFormLabelIdAnswer(questions, spouseUserId, 'spouseNetIncome');
            }
            await fetchFormLabelIdAnswer(questions, primaryUserId, 'primaryNetIncome');
        } catch (error) {
            // console.error('Error fetching form label IDs:', error);
        } finally {
            useLoader(false);
        }
    };

    const fetchFormLabelIdAnswer = async (formData, userID, incomeType) => {
        useLoader(true);

        try {
            // const subjectIds = Object.values(formData).map(item => item.subjectId);
            // const results = await Promise.all(
            //     subjectIds.map(id => dispatch(fetchSubjectForFormLabelIdAnswer({ userId: userID, subjectId: id })))
            // );
            // konsole.log("results00",results)

            // const formattedUserSubjects = results.flatMap(result =>
            //     result.payload && result.payload.length > 0
            //         ? result.payload.map(netIncomeData => ({
            //             userSubjectDataId: netIncomeData.userSubjectDataId,
            //             subjectId: netIncomeData.subjectId,
            //             responseId: netIncomeData.responseId,
            //             subResponseData: netIncomeData.response || " ",
            //             userId: result.payload.userId,
            //         }))
            //         : []
            // )?.reduce((tempRslt, curRslt) => {
            //     tempRslt[curRslt?.subjectId] = curRslt;
            //     return tempRslt;
            // }, {});

            konsole.log("qshahshshash11",formData, userID, incomeType)
            const results = await $ApiHelper.$getSubjectResponseWithQuestionsWithTopicId({ questions: formData, memberId: userID, topicId: 12 });

            const formattedUserSubjects = results.userSubjects.reduce((tempRslt, result) => {
                tempRslt[result.subjectId] = {
                    userSubjectDataId: result.userSubjectDataId,
                    subjectId: result.subjectId,
                    responseId: result.responseId,
                    subResponseData: result.response || " ",
                    userId: results.userId,
                };
                return tempRslt;
            }, {});
            

            konsole.log("asbhkas", income, formattedUserSubjects)

            setIncome(prevIncome => ({
                ...prevIncome,
                [incomeType]: formattedUserSubjects
            }));


            if (incomeType === 'primaryNetIncome') {
                setIncome(prevIncome => ({
                    ...prevIncome,
                    primaryNetIncome: formattedUserSubjects
                }));
            } else if (incomeType === 'spouseNetIncome') {
                setIncome(prevIncome => ({
                    ...prevIncome,
                    spouseNetIncome: formattedUserSubjects
                }));
            }

        } catch (error) {
            // console.error("Error fetching form label IDs", error);
        } finally {
            useLoader(false);
        }
    };

    const fetchAndSetIncomes = async ( forceFetch ) => {
        try {
            useLoader(true);

            let resPrimary = primaryUserMonthlyIncome;
            let resSpouse = SpouseUserMonthlyIncome;

            if (!primaryUserMonthlyIncome?.length || forceFetch) {
                const primaryResult = await dispatch(fetchUserMonthlyIncome({ userId: primaryUserId }));
                resPrimary = primaryResult.payload;
            }

            if (isPrimaryMemberMaritalStatus && (!SpouseUserMonthlyIncome?.length || forceFetch)) {
                const spouseResult = await dispatch(fetchSpouseMonthlyIncome({ userId: spouseUserId }));
                resSpouse = spouseResult.payload;
            } else if (!isPrimaryMemberMaritalStatus) {
                resSpouse = [];
            }

            if ((resPrimary?.length > 0) || (resSpouse?.length > 0)) {
                setIsUpdating(true);
            }
            
            const primaryOtherIncomes = resPrimary?.filter(ele => ele?.incomeTypeId == 999999);
            const spouseOtherIncomes = resSpouse?.filter(ele => ele?.incomeTypeId == 999999);
            getAndMapOtherIncomes(primaryOtherIncomes, spouseOtherIncomes);

            const incomeTypesWithoutOther = incomeTypes?.filter(ele => ele?.value != 999999);

            const primaryIncomes = incomeTypesWithoutOther.map(ele => {
                const incomeData = resPrimary?.find(ele2 => ele2.incomeTypeId == ele.value)
                return {
                    incomeTypes: incomeData?.incomeType ?? ele?.label,
                    incomeTypeId: incomeData?.incomeTypeId ?? ele?.value,
                    incomePrimary: incomeData?.grossAmt ? incomeData?.grossAmt.toFixed(2) : '0.00',
                    incomeRetirementPrimary: incomeData?.retProjAmt ? incomeData?.retProjAmt.toFixed(2) : '0.00',
                    isActive: incomeData?.isActive ?? true,
                    userIncomeIDPrimary: incomeData?.userIncomeId ?? undefined,
                }
            })


            const spouseIncomes = incomeTypesWithoutOther.map(ele => {
                const incomeData2 = resSpouse?.find(ele2 => ele2.incomeTypeId == ele.value);
                return {
                    incomeTypes: incomeData2?.incomeType ?? ele?.label,
                    incomeTypeId: incomeData2?.incomeTypeId ?? ele?.value,
                    incomeSpouse: incomeData2?.grossAmt ? incomeData2?.grossAmt.toFixed(2) : '0.00',
                    incomeRetirementSpouse: incomeData2?.retProjAmt ? incomeData2?.retProjAmt.toFixed(2) : '0.00',
                    isActive: incomeData2?.isActive ?? true,
                    userIncomeIDSpouse: incomeData2?.userIncomeId ?? undefined,
                };
            });

            const mergedIncomes = primaryIncomes.map((primaryIncome, index) => ({
                ...primaryIncome,
                ...spouseIncomes[index],
            }));

            setMergedIncomes(mergedIncomes);
            konsole.log(mergedIncomes, "djsjdsdjsjdsdj")
        } catch (error) {
            // console.error(`Error fetching income data:`, error);
        } finally {
            useLoader(false);
        }
    };

    const getAndMapOtherIncomes = async( primaryOtherIncomes, spouseOtherIncomes ) => {


        // setOtherRowsData(finalOtherRowState);
        const getOtherPayload = isPrimaryMemberMaritalStatus ? [
            ...primaryOtherIncomes?.map(ele => ({isActive: true, othersMapNatureId: String(ele?.userIncomeId), othersMapNature: '', userId: primaryUserId})),
            ...spouseOtherIncomes?.map(ele => ({isActive: true, othersMapNatureId: String(ele?.userIncomeId), othersMapNature: '', userId: spouseUserId}))
        ] : primaryOtherIncomes?.map(ele => ({isActive: true, othersMapNatureId: String(ele?.userIncomeId), othersMapNature: '', userId: primaryUserId}));

        konsole.log("dakjbvkj-getOtherPayload", getOtherPayload);

        if(!getOtherPayload?.length) return; 
        useLoader(true);
        const getOtherRes = await postApiCall("POST", $Service_Url.getOtherFromAPI, getOtherPayload);
        konsole.log("dakjbvkj-getOtherRes", getOtherRes);
        useLoader(false);
        if(getOtherRes == "err" || (!getOtherRes?.data?.data?.length)) {
            if(primaryOtherIncomes?.length == 1) {
                const otherObject = [{
                    ...$JsonHelper.$mothlyIcomeOtherObje(), 

                    incomeSpouse: spouseOtherIncomes?.[0]?.grossAmt ? spouseOtherIncomes?.[0]?.grossAmt.toFixed(2) : '0.00',
                    incomeRetirementSpouse: spouseOtherIncomes?.[0]?.retProjAmt ? spouseOtherIncomes?.[0]?.retProjAmt.toFixed(2) : '0.00',
                    userIncomeIDSpouse: spouseOtherIncomes?.[0]?.userIncomeId,
                    
                    incomePrimary: primaryOtherIncomes[0]?.grossAmt ? primaryOtherIncomes[0]?.grossAmt.toFixed(2) : '0.00',
                    incomeRetirementPrimary: primaryOtherIncomes[0]?.retProjAmt ? primaryOtherIncomes[0]?.retProjAmt.toFixed(2) : '0.00',
                    userIncomeIDPrimary:  primaryOtherIncomes[0]?.userIncomeId,
                }]
                setOtherRowsData(otherObject);
            }
            return;
        }

        const getOtherResArr = getOtherRes?.data?.data;
        const matchingOtherNames = {};
        for(let i in getOtherResArr) {
            const currentObject = getOtherResArr[i];
            const isPrimaryData = currentObject.userId == primaryUserId;
            matchingOtherNames[currentObject.othersName] = {
                ...matchingOtherNames[currentObject.othersName],
                othersName: currentObject.othersName,
                // othersId: currentObject.othersId,
                [isPrimaryData ? 'othersIdPrimary' : 'othersIdSpouse']: currentObject.othersId,
                [isPrimaryData ? 'othersMapNatureIdPrimary' : 'othersMapNatureIdSpouse']: currentObject.othersMapNatureId,
            }
        }
        konsole.log("dakjbvkj-matchingOtherNames", Object.values(matchingOtherNames));

        const mappedOtherArr = Object.values(matchingOtherNames);
        const userIcomeOtherMap = {};
        for(let i in mappedOtherArr) {
            const primaryUserIcomeData = primaryOtherIncomes?.find(ele => ele.userIncomeId == mappedOtherArr[i]?.othersMapNatureIdPrimary);
            mappedOtherArr[i] = {
                ...mappedOtherArr[i],
                incomePrimary: primaryUserIcomeData?.grossAmt ? primaryUserIcomeData?.grossAmt.toFixed(2) : '0.00',
                incomeRetirementPrimary: primaryUserIcomeData?.retProjAmt ? primaryUserIcomeData?.retProjAmt.toFixed(2) : '0.00',
                userIncomeIDPrimary:  primaryUserIcomeData?.userIncomeId,
                incomeTypes: 'Other',
                incomeTypeId: 999999,
                isActive: true,
            }
        }
        for(let i in mappedOtherArr) {
            const spouseUserIcomeData = spouseOtherIncomes?.find(ele => ele.userIncomeId == mappedOtherArr[i]?.othersMapNatureIdSpouse);
            mappedOtherArr[i] = {
                ...mappedOtherArr[i],
                incomeSpouse: spouseUserIcomeData?.grossAmt ? spouseUserIcomeData?.grossAmt.toFixed(2) : '0.00',
                incomeRetirementSpouse: spouseUserIcomeData?.retProjAmt ? spouseUserIcomeData?.retProjAmt.toFixed(2) : '0.00',
                userIncomeIDSpouse:  spouseUserIcomeData?.userIncomeId,
            }
        }

        const findIndexofother = mappedOtherArr?.findIndex(ele => ele.othersName == "Other");
        [mappedOtherArr[findIndexofother], mappedOtherArr[0]] = [mappedOtherArr[0], mappedOtherArr[findIndexofother]]

        konsole.log("dakjbvkj-mappedOtherArr", mappedOtherArr, findIndexofother)
        setOtherRowsData(mappedOtherArr);
    }

    const upsertOtherIncomeDatas = async () => {
        const onlyNeededArr = otherRowsData?.filter(ele => (!ele?.othersName && !ele?.userIncomeIDPrimary && !Number(ele?.incomePrimary) && !Number(ele?.incomeRetirementPrimary) && !Number(ele?.incomeSpouse) && !Number(ele?.incomeRetirementSpouse)) ? false : true)
        const primaryUpsertArr = onlyNeededArr;
        // const primaryUpsertArr = otherRowsData?.filter(ele => (!ele?.othersName && !Number(ele?.incomePrimary) && !Number(ele?.incomeRetirementPrimary)) ? false : true);
        const spouseUpsertArr = isPrimaryMemberMaritalStatus ? onlyNeededArr : [];
        // const spouseUpsertArr = isPrimaryMemberMaritalStatus ? otherRowsData?.filter(ele => (!ele?.othersName && !Number(ele?.incomeSpouse) && !Number(ele?.incomeRetirementSpouse)) ? false : true) : [];

        const primaryUpsertPayload = {
            userIncome: primaryUpsertArr?.map(element => ({
                isActive: true,
                userIncomeId: element?.userIncomeIDPrimary,
                incomeTypeId: element?.incomeTypeId,
                grossAmt: element?.incomePrimary,
                retProjAmt: !isPrimaryWorkingVisible ? "0.00" : element?.incomeRetirementPrimary,
                othersId: element?.othersIdPrimary,
                othersName: element?.othersName
            })),
            userId: primaryUserId,
            upsertedBy: loggedInUserId,
        }
        
        const spouseUpsertPayload = {
            userIncome: spouseUpsertArr?.map(element => ({
                isActive: true,
                userIncomeId: element?.userIncomeIDSpouse,
                incomeTypeId: element?.incomeTypeId,
                grossAmt: element?.incomeSpouse,
                retProjAmt: !isSpouseWorkingVisible ? "0.00" : element?.incomeRetirementSpouse,
                othersId: element?.othersIdSpouse,
                othersName: element?.othersName
            })),
            userId: spouseUserId,
            upsertedBy: loggedInUserId,
        }

        postApiCall('POST', $Service_Url.upsertUserIncome, primaryUpsertPayload)
        .then(res => {
            if(res == "err") return;
            konsole.log("sdzfds", res?.data, primaryUpsertPayload);
            for(let i = 0; i < primaryUpsertPayload?.userIncome?.length; i++) primaryUpsertPayload.userIncome[i].userIncomeId = res?.data?.data?.userIncomes[i]?.userIncomeId;
            upsertOtherMapping(primaryUpsertPayload?.userIncome, primaryUserId);
        })
        
        if(isPrimaryMemberMaritalStatus) {
            postApiCall('POST', $Service_Url.upsertUserIncome, spouseUpsertPayload)
            .then(res => {
                if(res == "err") return;
                konsole.log("sdzfds_spouse", res?.data, spouseUpsertPayload);
                for(let i = 0; i < spouseUpsertPayload?.userIncome?.length; i++) spouseUpsertPayload.userIncome[i].userIncomeId = res?.data?.data?.userIncomes[i]?.userIncomeId;
                upsertOtherMapping(spouseUpsertPayload?.userIncome, spouseUserId);
            })
        }

    }

    const upsertOtherMapping = ( arrayToSave, userId ) => {
        const dataToSave = arrayToSave?.filter(ele => isNullUndefine(ele?.othersId))
        const dataToUpdate = arrayToSave?.filter(ele => isNotValidNullUndefile(ele?.othersId))
        konsole.log('dakjbvkj-dataUpsertOther', dataToSave, dataToUpdate);

        if(dataToUpdate?.length) {
            const payload = dataToUpdate?.map(ele => ({
                updatedBy: loggedInUserId,
                isActive: true,
                othersCategoryId: 11,
                othersName: ele?.othersName,
                othersId: ele?.othersId,
            }))

            postApiCall("PUT", $Service_Url.updateOtherPath, payload);
        }

        if(dataToSave?.length) {
            const payload = dataToSave?.map(ele => ({
                createdBy: loggedInUserId,
                isActive: true,
                othersCategoryId: 11,
                othersName: ele?.othersName,
            }))

            postApiCall("POST", $Service_Url.addOtherPath, payload).then(res => {
                if(res == "err") return;
                const respArr = res?.data?.data;

                const payload2 = respArr?.map((ele, i)=> ({
                    createdBy: loggedInUserId,
                    isActive: true,
                    othersCategoryId: 11,
                    othersId: ele?.othersId,
                    othersMapNatureId: dataToSave[i]?.userIncomeId,
                    othersMapNatureType: "",
                    remarks: "",
                    userId: userId,
                }))

                postApiCall("POST", $Service_Url.mapOtherwithFormPath, payload2);
            })
        }
    }

    const addNewOtherRow = () => {
        setOtherRowsData(old => [
            ...old, 
            {
                ...$JsonHelper.$mothlyIcomeOtherObje(),
                othersName: "",
                KeyId: new Date(),
            }
        ]);
    }

    const ChechForDuplicateName = (name, index) => {
        const foundDupli = incomeTypes?.some(ele => ele.label?.trim()?.toLowerCase() == name?.trim()?.toLowerCase()) || otherRowsData?.find((ele, i) => i != index && ele?.othersName && ele?.othersName?.trim()?.toLowerCase() == name?.trim()?.toLowerCase());
        if(foundDupli) {
            setOtherRowsData(otherRowsData?.map((ele, i) => i == index ? ({...ele, othersName: ''}) : ele));
            konsole.log("bdskjb", otherRowsData?.map((ele, i) => i == index ? ({...ele, othersName: ''}) : ele))
            toasterAlert('warning', 'Warning', "Income source details already exist!");
        }
        konsole.log("dakjbvkj-foundDupli", name, index, foundDupli); 
        setIsEditing(false); 
    }

    const deleteOtherRow = async ( otherRowObject, index ) => {
        const confirmRes = await newConfirm(true, `Are you sure you want to delete this Income details? This action cannot be undone.`, "Confirmation", `Delete Income Details`, 2);
        if(!confirmRes) return;
        if(otherRowObject?.userIncomeIDPrimary) {
            let deletePayload = {
                userIncome: [{
                    isActive: false,
                    userIncomeId: otherRowObject?.userIncomeIDPrimary,
                    incomeTypeId: otherRowObject?.incomeTypeId,
                    grossAmt: otherRowObject?.incomePrimary,
                    retProjAmt: otherRowObject?.incomeRetirementPrimary
                }],
                userId: primaryUserId,
                upsertedBy: loggedInUserId,
            }
            await postApiCall('POST', $Service_Url.upsertUserIncome, deletePayload);
            if(isPrimaryMemberMaritalStatus) {
                deletePayload = {
                    userIncome: [{
                        isActive: false,
                        userIncomeId: otherRowObject?.userIncomeIDSpouse,
                        incomeTypeId: otherRowObject?.incomeTypeId,
                        grossAmt: otherRowObject?.incomeSpouse,
                        retProjAmt: otherRowObject?.incomeRetirementSpouse,
                    }],
                    userId: spouseUserId,
                    upsertedBy: loggedInUserId,
                }
                await postApiCall('POST', $Service_Url.upsertUserIncome, {...deletePayload, userId: spouseUserId});
            }
        }
        setOtherRowsData(old => old?.filter((ele, i) => i != index));
        dispatch(setprimaryUserMonthlyIncome(primaryUserMonthlyIncome?.filter(ele => ele?.userIncomeId != otherRowObject?.userIncomeIDPrimary)))
        if(isPrimaryMemberMaritalStatus) dispatch(setSpouseUserMonthlyIncome(SpouseUserMonthlyIncome?.filter(ele => ele?.userIncomeId != otherRowObject?.userIncomeIDSpouse)))
        toasterAlert('successfully', 'Deleted successfully', 'Income details has been deleted successfully');
        konsole.log("dakjbvkj-deleteRow", otherRowObject, confirmRes);
    }

    const changeOtherData = (i, paramName, paraValue) => {
        const newOtherState = otherRowsData?.map((ele, j) => i == j ? ({...ele, [paramName]: paraValue}) : ele);
        setOtherRowsData(newOtherState);
    }

    const handleIncomeInput = (value, typeIndex, isSpouse) => {
        // const numericValue = value?.replace(/[^0-9,]/g, '');
        const numericValue = value;

        handleIncomeChange(numericValue, typeIndex, isSpouse);
    };

    const handleIncomeChange = (value, typeIndex, isSpouse) => {
        konsole.log("adsfdf", value, Number(value))
        setMergedIncomes(prevIncomes =>
            prevIncomes.map((income, index) =>
                index === typeIndex ? {
                    ...income,
                    [isSpouse ? 'incomeSpouse' : 'incomePrimary']: value
                } : income
            )
        );
    };

    const handleIncomeRetirementChangeInput = (value, typeIndex, isSpouse) => {
        // const numericValue = value?.replace(/[^0-9,]/g, '');
        const numericValue = value;

        handleIncomeRetirementChange(numericValue, typeIndex, isSpouse);
    };

    const handleIncomeRetirementChange = (value, typeIndex, isSpouse) => {
        setMergedIncomes(prevIncomes =>
            prevIncomes.map((income, index) =>
                index === typeIndex ? {
                    ...income,
                    [isSpouse ? `incomeRetirementSpouse` : `incomeRetirementPrimary`]: value
                } : income
            )
        );
    };

    const formatIncome = (value) => {
        if (value === undefined || value === null || value?.trim() === '') {
            return '0.00';
        }

        value = value?.replace(/^0+(?!\.|$)/, '');

        const [integerPart, decimalPart] = value.split('.');
        if (!decimalPart) {
            return `${integerPart || '0'}.00`;
        }
        if (decimalPart?.length === 1) {
            return `${integerPart || '0'}.${decimalPart}0`;
        }
        return `${integerPart || '0'}.${decimalPart}`;
    };

    const calculateTotalIncome = (key) => {
        konsole.log(key, "sdjsjdsdjsdjsd")
        const total = [...mergedIncomes, ...otherRowsData]?.reduce((accumulator, current) => {
            const value = parseFloat(current[key]) || 0;
            return accumulator + value;
        }, 0);
        return total.toFixed(2);
    };

    const handleRadioChange = (subjectId, response, responseId) => {
        setIncome(prevIncome => ({
            ...prevIncome,
            primaryNetIncome: {
                ...prevIncome.primaryNetIncome,
                [subjectId]: {
                    subjectId: subjectId,
                    subResponseData: response,
                    responseId: responseId,
                    userSubjectDataId: prevIncome?.primaryNetIncome?.[subjectId]?.userSubjectDataId,
                }
            }
        }));
    };

    konsole.log("sabsa", income)

    const handleIncomeChangeSubject = (field, subjectId, responseE, responseId) => {
        setIncome(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [subjectId]: {
                    subjectId: subjectId,
                    subResponseData: responseE,
                    responseId: responseId,
                    userSubjectDataId: prev?.[field]?.[subjectId]?.userSubjectDataId,
                }
            }
        }));
    };

    const handleIncomeBlurSubject = (field, subjectId) => {
        setIncome(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [subjectId]: {
                    ...prev[field][subjectId],
                    subResponseData: formatIncome(prev[field][subjectId]?.subResponseData)
                }
            }
        }));
    }; 

    const handlePensionPercentageChange = (field, subjectId, responseE, responseId) => {
        const value = responseE;
        if (!isNaN(value) && value <= 100) {
            setIncome(prev => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [subjectId]: {
                        subjectId: subjectId,
                        subResponseData: responseE,
                        responseId: responseId,
                        userSubjectDataId: prev?.[field]?.[subjectId]?.userSubjectDataId,
                    }
                }
            }));
        }
    };

    const handleCommentsChange = (field, subjectId, responseE, responseId) => {
        setIncome(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [subjectId]: {
                    subjectId: subjectId,
                    subResponseData: responseE,
                    responseId: responseId,
                    userSubjectDataId: prev?.[field]?.[subjectId]?.userSubjectDataId,
                }
            }
        }));
    };

    function hideLastName(fullName) {
        return fullName?.split(" ")[0] || "";
    }

    const primaryFirstName = hideLastName(primaryMemberFullName);
    const spouseFirstName = hideLastName(spouseFullName);

    // const isPrimaryWorkingVisible = occupationData?.primary?.isWorking == null || occupationData?.primary?.isWorking == true;
    // konsole.log(occupationData?.primary?.isWorking,"occupationData")
    // const isSpouseWorkingVisible = (occupationData?.spouse?.isWorking == true || occupationData?.spouse?.isWorking == null) && (isPrimaryMemberMaritalStatus);
    // const isPrimaryRetirementVisible = (occupationData?.primary?.isWorking == true || occupationData?.primary?.isWorking == false || occupationData?.primary?.isWorking == null);
    // const isSpouseRetirementVisible = (occupationData?.spouse?.isWorking == true || occupationData?.spouse?.isWorking == false || occupationData?.spouse?.isWorking == null) && (isPrimaryMemberMaritalStatus);

    return (
        <div id='monthlyIncome'>
            <CustomeSubTitleWithEyeIcon title={'Monthly Income'} sideContent={props?.isSideContent} />
            <div className='withDescription' style={{marginTop: '8px'}}>
                <Row className='d-flex justify-content-between'>
                    {/* {props.isSideContent && (
                    <Col className='monthlyIncomeDescription' md={12} xl={3}>
                        <p className='monthlyIncomeDescriptionPara'>
                            This is a placeholder for future content. It will be updated with detailed
                            information and relevant instructions pertaining to this specific aspect of the
                            portal. Please check back soon for the complete and finalized information.
                        </p>
                    </Col>
                    )} */}
                    <Col className='monthlyIncomeTable'>
                        <div className='monthlyIncomeTable-table mb-4' style={{borderRadius: '10px'}}>
                            <div className='table-responsive'>
                                {/* <div className='header-box'>
                                    <div className='d-flex align-items-center'>
                                        <p className='prof-t1'>Projected Monthly Income</p>
                                    </div>
                                </div> */}
                                <div className='table-container' style={{borderRadius:"10px"}}>
                                    <Table className='custom-table mb-0'>
                                        <thead className='table-header' style={{borderRadius:"10px"}}>
                                            <tr className='heading'>
                                                <th title='Type of Income' className='' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Type of Income</th>
                                                {(isPrimaryWorkingVisible || isPrimaryRetirementVisible) && (<th title={`${primaryFirstName} Current`} className='ps-4' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'pre-wrap' }}>{`${primaryFirstName} \nCurrent`}</th>)}
                                                {isPrimaryWorkingVisible && (<th title={`${primaryFirstName} Projected Retirement`} className='ps-4' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'pre-wrap' }}>{`${primaryFirstName} \nProjected Retirement`}</th>)}
                                                {(isSpouseWorkingVisible || isSpouseRetirementVisible) && (<th title={`${spouseFirstName} Current`} className='ps-4' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'pre-wrap' }}>{`${spouseFirstName} \nCurrent`}</th>)}
                                                {isSpouseWorkingVisible && (<th title={`${spouseFirstName} Projected Retirement`} className='ps-4' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'pre-wrap' }}>{`${spouseFirstName} \nProjected Retirement`}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody className='monthlyIncomeTableBody'>
                                            {mergedIncomes && mergedIncomes.map((input, typeIndex) => (
                                                <tr className='mainIncomeType' key={typeIndex}>
                                                    <td title={`${incomeTypes[typeIndex]?.label?.trim()}`} className='' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {incomeTypes[typeIndex]?.label?.trim()}
                                                    </td>
                                                    {(isPrimaryWorkingVisible || isPrimaryRetirementVisible) && (
                                                        <td className='ps-4 py-0' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            <div className='d-flex align-items-center'>
                                                                <div className='input-group border' title={input?.incomePrimary}>
                                                                    <CustomCurrencyInput prefix="$" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                                        tabIndex={startingTabIndex + 1}
                                                                        style={{width: '100%'}}
                                                                        value={input?.incomePrimary}
                                                                        onChange={(e) => handleIncomeInput(e, typeIndex, false)}
                                                                        onBlur={() => handleIncomeChange(formatIncome(input?.incomePrimary), typeIndex, false)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    )}
                                                    {isPrimaryWorkingVisible && (
                                                        <td className='ps-4 py-0' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            <div className='d-flex align-items-center'>
                                                                <div className='input-group border' title={input?.incomeRetirementPrimary}>
                                                                    <CustomCurrencyInput prefix="$" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                                        style={{width: '100%'}}
                                                                        tabIndex={startingTabIndex + 2}
                                                                        value={input?.incomeRetirementPrimary}
                                                                        onChange={(e) => handleIncomeRetirementChangeInput(e, typeIndex, false)}
                                                                        onBlur={() => handleIncomeRetirementChange(formatIncome(input?.incomeRetirementPrimary), typeIndex, false)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    )}
                                                    {(isSpouseWorkingVisible || isSpouseRetirementVisible) && (
                                                        <td className='ps-4 py-0' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            <div className='d-flex align-items-center'>
                                                                <div className='input-group border' title={input?.incomeSpouse}>
                                                                    <CustomCurrencyInput prefix="$" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                                        style={{width: '100%'}}
                                                                        tabIndex={startingTabIndex + 3}
                                                                        value={input?.incomeSpouse}
                                                                        onChange={(e) => handleIncomeInput(e, typeIndex, true)}
                                                                        onBlur={() => handleIncomeChange(formatIncome(input?.incomeSpouse), typeIndex, true)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    )}
                                                    {isSpouseWorkingVisible && (
                                                        <td className='ps-4 py-0' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            <div className='d-flex align-items-center'>
                                                                <div className='input-group border' title={input?.incomeRetirementSpouse}>
                                                                    <CustomCurrencyInput prefix="$" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                                        style={{width: '100%'}}
                                                                        tabIndex={startingTabIndex + 4}
                                                                        value={input?.incomeRetirementSpouse}
                                                                        onChange={(e) => handleIncomeRetirementChangeInput(e, typeIndex, true)}
                                                                        onBlur={() => handleIncomeRetirementChange(formatIncome(input?.incomeRetirementSpouse), typeIndex, true)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                            {incomeTypes?.length > 0 && otherRowsData?.map((otherEle, i) => {
                                                const isDeleteAble = otherEle?.othersName?.trim() == "Other" && i == 0 ? false : true;
                                                return (
                                                    <tr id={'otherRowsData' + i} className='mainIncomeType' key={otherEle?.userIncomeIDPrimary || otherEle?.KeyId}>
                                                        <td title={`${otherEle?.othersName}`} className={`otherinputCol ${isDeleteAble && 'py-0'}`} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {isDeleteAble ? <CustomInput 
                                                                tabIndex={startingTabIndex + 5}
                                                                isPersonalMedical={true}
                                                                id="monthlyIncome"
                                                                placeholder={"Enter Income Type"}
                                                                value={otherEle?.othersName}
                                                                onChange={(val) => changeOtherData(i, 'othersName', val)}
                                                                onBlur={() => ChechForDuplicateName(otherEle?.othersName, i)}
                                                            />
                                                            : otherEle?.othersName }
                                                        </td>
                                                        {(isPrimaryWorkingVisible || isPrimaryRetirementVisible) && (
                                                            <td className='ps-4 py-0' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                <div className='d-flex align-items-center'>
                                                                    <div className='input-group border' title={otherEle?.incomePrimary}>
                                                                        <CustomCurrencyInput prefix="$" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                                            tabIndex={startingTabIndex + 6}
                                                                            style={{width: '100%'}}
                                                                            value={otherEle?.incomePrimary}
                                                                            onChange={(val) => changeOtherData(i, 'incomePrimary', val)}
                                                                            // onBlur={() => handleIncomeChange(formatIncome(input?.incomePrimary), typeIndex, false)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        )}
                                                        {isPrimaryWorkingVisible && (
                                                            <td className='ps-4 py-0' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                <div className='d-flex align-items-center'>
                                                                    <div className='input-group border' title={otherEle?.incomeRetirementPrimary} style={{gap: '10px'}}>
                                                                        <CustomCurrencyInput prefix="$" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                                            style={{width: '100%'}}
                                                                            tabIndex={startingTabIndex + 7}
                                                                            value={otherEle?.incomeRetirementPrimary}
                                                                            onChange={(val) => changeOtherData(i, 'incomeRetirementPrimary', val)}
                                                                            // onBlur={() => handleIncomeRetirementChange(formatIncome(input?.incomeRetirementPrimary), typeIndex, false)}
                                                                        />
                                                                        {(isSpouseWorkingVisible || isSpouseRetirementVisible) != true && isDeleteAble && <img src='/New/icons/delete-Icon.svg' className='cursor-pointer align-self-center m-0' alt='Delete' title='Delete' onClick={() => deleteOtherRow(otherEle, i)} />}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        )}
                                                        {(isSpouseWorkingVisible || isSpouseRetirementVisible) && (
                                                            <td className='ps-4 py-0' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                <div className='d-flex align-items-center'>
                                                                    <div className='input-group border' title={otherEle?.incomeSpouse}>
                                                                        <CustomCurrencyInput prefix="$" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                                            style={{width: '100%'}}
                                                                            tabIndex={startingTabIndex + 8}
                                                                            value={otherEle?.incomeSpouse}
                                                                            onChange={(val) => changeOtherData(i, 'incomeSpouse', val)}
                                                                            // onBlur={() => handleIncomeChange(formatIncome(input?.incomeSpouse), typeIndex, true)}
                                                                        />
                                                                        {isSpouseWorkingVisible != true && isDeleteAble && <img src='/New/icons/delete-Icon.svg' className='cursor-pointer align-self-center m-0' alt='Delete' title='Delete' onClick={() => deleteOtherRow(otherEle, i)} />}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        )}
                                                        {isSpouseWorkingVisible && (
                                                            <td className='ps-4 py-0' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                <div className='d-flex align-items-center'>
                                                                    <div className='input-group border' title={otherEle?.incomeRetirementSpouse} style={{gap: '10px'}}>
                                                                        <CustomCurrencyInput prefix="$" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                                            style={{width: '100%'}}
                                                                            tabIndex={startingTabIndex + 9}
                                                                            value={otherEle?.incomeRetirementSpouse}
                                                                            onChange={(val) => changeOtherData(i, 'incomeRetirementSpouse', val)}
                                                                            // onBlur={() => handleIncomeRetirementChange(formatIncome(input?.incomeRetirementSpouse), typeIndex, true)}
                                                                        />
                                                                        {isDeleteAble && <img src='/New/icons/delete-Icon.svg' className='cursor-pointer align-self-center m-0' alt='Delete' title='Delete' onClick={() => deleteOtherRow(otherEle, i)} />}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        )}
                                                    </tr>
                                                )}
                                            )}
                                            {incomeTypes?.length > 0 && <tr className='mainIncomeType'>
                                                <td>
                                                    <div className='AddNewButton text-center align-items-center' onClick={addNewOtherRow}>
                                                        <span style={{fontSize: '20px'}}>+</span> Add New Income Type
                                                    </div>
                                                </td>
                                            </tr>}
                                            <div className='table-Total-body'>
                                                <tr className='headingBottom'>
                                                    <td className='py-0' style={{ overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '16px', fontWeight: '600' }}>Total</td>
                                                    {['incomePrimary','incomeRetirementPrimary', 'incomeSpouse', 'incomeRetirementSpouse'].map((key, index) => {
                                                        const shouldRenderCell = (
                                                            (key === 'incomePrimary' && (isPrimaryWorkingVisible || isPrimaryRetirementVisible)) ||
                                                            (key === 'incomeRetirementPrimary' && isPrimaryWorkingVisible) ||
                                                            (key === 'incomeSpouse' && spouseDetails && (isSpouseWorkingVisible || isSpouseRetirementVisible)) ||
                                                            (key === 'incomeRetirementSpouse' && spouseDetails && isSpouseWorkingVisible)
                                                        );
                                                        return shouldRenderCell ? (
                                                            <td key={index} className='ps-4 py-0' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                <div className='d-flex align-items-center' title={calculateTotalIncome(key)}>
                                                                    <div className='input-group border'>
                                                                        <CustomCurrencyInput  tabIndex={startingTabIndex + 10} style={{width: '100%'}} prefix="$" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                                            value={calculateTotalIncome(key)}
                                                                            onChange={() => {}}
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        ) : null;
                                                    })}
                                                </tr>
                                            </div>
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                        <div className='mt-4 monthlyIncomeQuestionair'>
                            <Col >
                               {$AHelper.$isNullUndefine(questions?.label950?.question) ? "" : <Row className='mx-1 questionair'>
                                    <Col className='p-0'>
                                        {`${questions?.label950?.question} (Primary Member)`}
                                    </Col>
                                </Row>}
                                <Row>
                                    <div className='d-flex align-items-center'>
                                        <div className='input-group border mb-2'>
                                            <CustomCurrencyInput  tabIndex={startingTabIndex + 11} prefix="$" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                value={income?.primaryNetIncome[questions?.label950?.questionId]?.subResponseData ?? '0.00'}
                                                onChange={(e) => handleIncomeChangeSubject('primaryNetIncome', questions?.label950?.questionId, e, questions?.label950?.responses?.[0]?.responseId)}
                                                onBlur={() => handleIncomeBlurSubject('primaryNetIncome', questions?.label950?.questionId)}
                                            />
                                        </div>
                                    </div>
                                </Row>
                                {isPrimaryMemberMaritalStatus && (
                                    <>
                                       {$AHelper.$isNullUndefine(questions?.label950?.question)? "" : <Row className='mx-1 questionair'>
                                            <Col className='p-0'>
                                                {`${questions?.label950?.question} (${$AHelper.$capitalizeFirstLetter(_spousePartner)})`}
                                            </Col>
                                        </Row>}
                                        <Row>
                                            <div className='d-flex align-items-center'>
                                                <div className='input-group border mb-2'>
                                                    <CustomCurrencyInput  tabIndex={startingTabIndex + 12} prefix="$" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                        value={income?.spouseNetIncome[questions?.label950?.questionId]?.subResponseData ?? '0.00'}
                                                        onChange={(e) => handleIncomeChangeSubject('spouseNetIncome', questions?.label950?.questionId, e, questions?.label950?.responses?.[0]?.responseId)}
                                                        onBlur={() => handleIncomeBlurSubject('spouseNetIncome', questions?.label950?.questionId)}
                                                    />
                                                </div>
                                            </div>
                                        </Row>
                                    </>
                                )}
                            </Col>
                            <Col>
                                <Row className='mx-1 questionair'>
                                    <Col className='p-0'>
                                        {questions?.label914?.question}
                                    </Col>
                                </Row>
                                <Row>
                                    <div className='d-flex align-items-center'>
                                        <div className='input-group border'>
                                            <CustomCurrencyInput  tabIndex={startingTabIndex + 13} prefix="$" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                value={income?.primaryNetIncome[questions?.label914?.questionId]?.subResponseData ?? '0.00'}
                                                onChange={(e) => handleIncomeChangeSubject('primaryNetIncome', questions?.label914?.questionId, e, questions?.label914?.responses?.[0]?.responseId)}
                                                onBlur={() => handleIncomeBlurSubject('primaryNetIncome', questions?.label914?.questionId)}
                                            />
                                        </div>
                                    </div>
                                </Row>
                            </Col>

                                <Col>
                                <Row className='mx-1 questionair'>
                                    <CustomRadio
                                        tabIndex={startingTabIndex + 14}
                                        className='p-0'
                                        placeholder={
                                            _spousePartner === 'partner'
                                                ? questions?.label1245?.question?.replace(/spouse/i, 'partner').replace(/spouse/i, 'partner')
                                                : questions?.label1245?.question
                                        }
                                        options={questions?.label1245?.responses?.map(ele => ({ value: ele?.responseId, label: ele?.response }))}
                                        value={income?.primaryNetIncome[questions?.label1245?.questionId]?.responseId}
                                        onChange={(ele) => handleRadioChange(questions?.label1245?.questionId, ele?.label, ele?.value)}
                                    />
                                </Row>
                                {income?.primaryNetIncome[questions?.label1245?.questionId]?.subResponseData === 'Yes' &&
                                    <Col className='mb-2 mt-2'>
                                        <Row className='mx-1 questionair'>
                                            <Col className='p-0'>
                                                {questions?.label1246?.question}
                                            </Col>
                                        </Row>

                                        <Row>
                                            <div className='d-flex align-items-center'>
                                                <div className='input-group border'>
                                                    <CustomCurrencyInput tabIndex={startingTabIndex + 13} prefix="$" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                        value={income?.primaryNetIncome[questions?.label1246?.questionId]?.subResponseData ?? '0.00'}
                                                        onChange={(e) => handleIncomeChangeSubject('primaryNetIncome', questions?.label1246?.questionId, e, questions?.label1246?.responses?.[0]?.responseId)}
                                                        onBlur={() => handleIncomeBlurSubject('primaryNetIncome', questions?.label1246?.questionId)}
                                                    />
                                                </div>
                                            </div>
                                        </Row>
                                    </Col>


                                }
                            </Col>                       

                                {isPrimaryMemberMaritalStatus && income?.primaryNetIncome[questions?.label1245?.questionId]?.subResponseData === 'Yes'  && <Col>
                                <Row className='mx-1 questionair'>
                                    <CustomRadio
                                         tabIndex={startingTabIndex + 14}
                                        className='p-0'
                                        placeholder={
                                            _spousePartner === 'partner' 
                                              ? questions?.label916?.question?.replace(/spouse/i, 'partner').replace(/spouse/i, 'partner')
                                              : questions?.label916?.question
                                          }
                                        options={questions?.label916?.responses?.map(ele => ({ value: ele?.responseId, label: ele?.response }))}
                                        value={income?.primaryNetIncome[questions?.label916?.questionId]?.responseId}
                                        onChange={(ele) => handleRadioChange(questions?.label916?.questionId, ele?.label, ele?.value)}
                                    />
                                </Row>
                                {(income?.primaryNetIncome[questions?.label916?.questionId]?.subResponseData === 'Yes' || income?.primaryNetIncome[questions?.label916?.questionId]?.subResponseData === "string" )&& (
                                    <div className='my-3 mx-3'>
                                        <Row style={{ backgroundColor: '#F8F8F8F8', borderRadius: '8px', padding:"8px 0px" }}>
                                            <p className='questionair'>Pension percentage</p>
                                            <div className='d-flex align-items-center'>
                                                <div className='input-group border'>
                                                    <CustomPercentageInput  tabIndex={startingTabIndex + 15} prefix="%" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                        value={income?.primaryNetIncome[questions?.label919?.questionId]?.subResponseData}
                                                        onChange={(e) => handlePensionPercentageChange('primaryNetIncome', questions?.label919?.questionId, e, questions?.label919?.responses?.[0]?.responseId)}
                                                    />
                                                </div>
                                            </div>
                                        </Row>
                                    </div>
                                )}
                            </Col>}
                            <Col>
                                <Row className='mx-1 questionair'>
                                    <CustomRadio
                                         tabIndex={startingTabIndex + 16}
                                        placeholder={questions?.label918?.question}
                                        options={questions?.label918?.responses?.map(ele => ({ value: ele?.responseId, label: ele?.response }))}
                                        value={income?.primaryNetIncome[questions?.label918?.questionId]?.responseId}
                                        onChange={(ele) => handleRadioChange(questions?.label918?.questionId, ele?.label, ele?.value)}
                                    />
                                </Row>
                                {income?.primaryNetIncome[questions?.label918?.questionId]?.subResponseData === 'Yes' && (
                                    <div className='my-3 mx-3'>
                                        <Row style={{ backgroundColor: '#F8F8F8F8', borderRadius: '8px', padding:"8px" }}>
                                            <p className='questionair'>Anticipated Amount</p>
                                            <div className='d-flex align-items-center'>
                                                <div className='input-group border ps-0'>
                                                    <CustomCurrencyInput  tabIndex={startingTabIndex + 17} prefix="$" allowNegativeValue={false} className="form-control border-0 rounded-0 px-0"
                                                        value={income?.primaryNetIncome[questions?.label1028?.questionId]?.subResponseData ?? '0.00'}
                                                        onChange={(e) => handleIncomeChangeSubject('primaryNetIncome', questions?.label1028?.questionId, e, questions?.label1028?.responses?.[0]?.responseId)}
                                                        onBlur={() => handleIncomeBlurSubject('primaryNetIncome', questions?.label1028?.questionId)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='py-2' style={{ backgroundColor: '#F8F8F8F8', borderRadius: '8px' }}>
                                                <CustomTextarea  label="" tabIndex={startingTabIndex + 18} name="AnticipationComment" type="text"
                                                    className='form-control textareaField'
                                                    value={income?.primaryNetIncome[questions?.label1034?.questionId]?.subResponseData ?? ''}
                                                    onChange={(e) => handleCommentsChange('primaryNetIncome', questions?.label1034?.questionId, e, questions?.label1034?.responses?.[0]?.responseId)}
                                                    placeholder='Comments'
                                                />
                                            </div>
                                        </Row>
                                    </div>
                                )}
                            </Col>
                        </div>
                    </Col>
                    {/* <Row className="d-flex justify-content-end">
                        <button className="me-4 styled-button" onClick={handleUpdateClick}> {isUpdating ? 'Update' : 'Save'}</button>
                    </Row> */}
                </Row>
            </div>
        </div>
    );
});

export default MonthlyIncome;