
import React, { useEffect, useState, useRef, useContext, useImperativeHandle, forwardRef } from 'react';
import { Button, Modal, Row, Col, Container, Card } from 'react-bootstrap';
import { addressJson, contractExpressAddChildJson, jsonObjCE, jsonForLegalDoc, jsonForFiduciaryAssesmentadd, jsonForAddUserAssetsRetireNonRetireNRealEstate, jsonForAddLifeIncCeData, professionalProDecsIdListObj, professionalproTypeListObj, createJsonForUpsertProfessionalUserMapping, addressForCeProffessional } from '../../control/Constant';
import konsole from '../../control/Konsole';
import PersonCard from './PersonCard';
import { connect } from 'react-redux';
import { SET_LOADER } from '../../Store/Actions/action';
import { globalContext } from '../../../pages/_app';
import { createAddUserJsonObj } from '../../control/Constant';
import { getApiCall, isNotValidNullUndefile, postApiCall } from '../../Reusable/ReusableCom';
import { $Service_Url } from '../../network/UrlPath';
import AlertToaster from '../../control/AlertToaster';
import NotFound from './Not-Found';
import useUserIdHook from '../../Reusable/useUserIdHook';
import { $postServiceFn, $getServiceFn } from '../../network/Service';
import FiduciaryAssignmentLegalDocCe from './FiduciaryAssignmentLegalDocCe';
import UserAssetsLifeIns from './UserAssetsLifeIns';
import LivingWillDetailsCe from './LivingWillDetailsCe';
import ProfessionaDetailsCe from './ProfessionaDetailsCe';
import { $AHelper } from '../../control/AHelper';

const userAssestesFilterKey = ['Life Insurance']

const ListContractExpressData = ({ dispatchloader, showContractExpressList, handleContractExpressList, ceImportedData, handleIsImportXml, handleShowListOfCeData, genderRelationAdresstypeList, assetRetireNonRetileRealEstateTypeList, CalLength, professTypeDetails }, ref) => {
  const { setdata } = useContext(globalContext);
  const { genderTypeList, relationshipTypeList, addressTypeList } = genderRelationAdresstypeList
  const { _loggedInUserId, _subtenantId } = useUserIdHook();
  const jsonObj = ceImportedData;
  const [merialList,setMerialList] = useState([])
  // const jsonObj = jsonObjCE;
  // konsole.log("jsonObjjsonObjjsonObj", JSON.stringify(jsonObj))
  // const userAssets = jsonObj?.userAssets;

  // const userProfesstionals = jsonObj.userProfesstionals;
  // const userLivingWills = jsonObj.userLivingWills;
  useEffect(()=>{
    let getmerital = getApiCall('GET',$Service_Url.getMaritalStatusPath,setMerialList)
    konsole.log(getmerital,merialList,"getmerital")
  },[])

  // konsole---------------------------------
  konsole.log('jsonObjjsonObjjsonObj', jsonObj, _subtenantId);
  // konsole.log("userAssetsuserAssets", userAssets)
  // konsole.log("userProfesstionalsuserProfesstionals", userProfesstionals)
  // konsole.log("userLivingWillsuserLivingWills", userLivingWills)
  konsole.log(merialList,"merialList")
  // konsole---------------------------------
  // @State----------------------------------------------------------------------------------
  useImperativeHandle(ref, () => ({
    handleSaveData
  }))


  // @Function Import Data ----------------------------------
  const handleSaveData = async (jsonObj, closeModal, funcall) => {

    let _primarySpouseChildNonFamilyDetails = []
    let _primaryMemberName = '';
    let _spouseName = '';
    let _primaryMemberUserId = '';
    let _spouseMemberUserId = '';
    let _prumaryMemberMemberId = ''


    {
      // @Client ADD -----------------------------------------

      let { userName, userEmail, memberCEId, userGender, userPhoneNumber, userDOB, userRelationshipStatus, address, spouse, fiduciaryAssignments, userAssets, userLivingWills, allergies, userProfesstionals } = jsonObj;
      const { fName, mName, lName } = _returnfNameMnameNLname(userName)
      // const emailAddress = 'a10@mailinator.com'
      const emailAddress = userEmail;
      // userEmail = 'testcexmlmail@mailinator.com'
      let userContact = userPhoneNumber != '' ? `${$AHelper.convertToSingleFormat(userPhoneNumber)}` : '1111111111'
      const _addUserJson = createAddUserJsonObj({ createdBy: _loggedInUserId, subtenantId: _subtenantId, signUpPlateform: 6, roleId: 10, firstName: fName, lastName: mName + lName, emailAddress: userEmail, mobileNumber: userContact  })
      konsole.log('_addUserJson', _addUserJson)
      dispatchloader(true)
      const resultAddUser = await postApiCall('POST', $Service_Url.postAddUser, _addUserJson);
      konsole.log('resultAddUser', resultAddUser);
      if (resultAddUser !== 'err') {
        let _primaryResounseDetails = resultAddUser?.data?.data;
        _primaryResounseDetails['fullname'] = userName
        _primarySpouseChildNonFamilyDetails.push(_primaryResounseDetails)
        const primaryUserId = _primaryResounseDetails?.userId;
        _primaryMemberName = userName;
        _primaryMemberUserId = _primaryResounseDetails?.userId;
        _prumaryMemberMemberId = _primaryResounseDetails?.id;
        const _jsonUpdateMemberCe = {
          "memberCEId": memberCEId,
          "memberUserId": primaryUserId,
          "memberEmailAddress": userEmail,
          "isImported": true
        }
        const _resultCEXMLmemberPost = await postApiCall('POST', $Service_Url.postCEXMLMemberData, _jsonUpdateMemberCe);
        konsole.log("_resultCEXMLmemberPost", _resultCEXMLmemberPost);
        konsole.log(merialList?.filter((e)=>{return e.label == jsonObj?.userRelationshipStatus}),"merialListmerialList")
        const meritalStatus = merialList?.filter((e)=>{return e?.label == jsonObj?.userRelationshipStatus})[0]?.value
        const genderId = returnGenderNRelationId(genderTypeList, userGender)
        const resultMember = await getApiCall("GET", $Service_Url.getFamilyMemberbyID + primaryUserId)
        const jsonForUpdateClient = { ...resultMember?.member, updatedBy: _loggedInUserId, fName: fName, mName: mName, lName: lName, maritalStatusId: meritalStatus, genderId: genderId, dob: userDOB }
        konsole.log("jsonForUpdateClient", jsonForUpdateClient);
        const updateCliebtResult = await postApiCall('PUT', $Service_Url.putUpdateMember, jsonForUpdateClient)
        konsole.log('updateCliebtResult', updateCliebtResult)
        const responseClientData = updateCliebtResult?.data?.data?.member;
        konsole.log('jsonForUpdateClient', jsonForUpdateClient, responseClientData, updateCliebtResult)

        // @if Fiduciary Primary Member------

        const isFiduciaryVal = returnIsFiduciaryVal(fiduciaryAssignments, userName);
        if (isFiduciaryVal) {
          let jsonMemberRelation = {
            "primaryUserId": responseClientData?.spouseUserId,
            "relationshipTypeId": 1,
            "isFiduciary": true,
            "isBeneficiary": false,
            "relativeUserId": responseClientData?.spouseUserId,
          }
          let url = $Service_Url.postMemberRelationship + `?RelativeMemberID=${responseClientData?.memberId}`
          let _resultOfRelationship = await $postServiceFn.memberRelationshipAddPut('POST', url, jsonMemberRelation);
          konsole.log("jsonMemberRelation", jsonMemberRelation, _resultOfRelationship)
          // @if Fiduciary Primary Member--------
        }
        if (address?.length > 0) {
          for (let i = 0; i < address?.length; i++) {
            const _resultAddressJson = addressJson({ address: address[i], userId: primaryUserId, addressTypeId: address[i].addressTypeId, createdBy: _loggedInUserId, })
            konsole.log('_resultAddressJson', _resultAddressJson)
            const _resultSaveAddress = await postApiCall('POST', $Service_Url.postAddAddress, _resultAddressJson);
            konsole.log('_resultSaveAddress', _resultSaveAddress);
          }
        }
        // @Allergy------
        if (isNotValidNullUndefile(allergies)) {
          await saveAllergiesData(allergies, primaryUserId)
        }
        // @Client ADD -----------------------------------------
        // return;
        // @Spouse SPOUSE --------------------------------------

        if (responseClientData?.maritalStatusId == 1) {
          const { personName, personEmail, personGender, personPhoneNumber, personDOB, personRelationWithUser, personRelationWithSpouse, address } = spouse;
          const { fName, mName, lName } = _returnfNameMnameNLname(personName)

          let jsonObj = {
            userId: responseClientData?.spouseUserId, fName: fName, mName: mName, lName: lName,
            genderId: returnGenderNRelationId(genderTypeList, personGender), isPrimaryMember: false, maritalStatusId: null,citizenshipId:'187',
            memberRelationship: responseClientData?.memberRelationship,
            updatedBy: _loggedInUserId, dob: personDOB
          }

          const spouseJson = jsonObj
          const _spouseResult = await postApiCall('PUT', $Service_Url.putUpdateMember, spouseJson)
          konsole.log('saveSpouseInfosaveSpouseInfo', _spouseResult, spouse);
          let _spouseResultMember = _spouseResult?.data?.data?.member;
          konsole.log("_spouseResultMember", _spouseResultMember)
          _spouseResultMember['fullname'] = personName;
          _primarySpouseChildNonFamilyDetails.push(_spouseResultMember);
          _spouseName = personName;
          _spouseMemberUserId = _spouseResultMember?.userId;

          // spouse make fiduciary-------------------------------------
          if (returnIsFiduciaryVal(fiduciaryAssignments, personName)) {

            let jsonObjSpouseFiduciary = _spouseResultMember;
            jsonObjSpouseFiduciary['memberRelationship']['isFiduciary'] = true;
            konsole.log("jsonObjSpouseFiduciary", jsonObjSpouseFiduciary)
            const _spouseResultUpdateFiduciart = await postApiCall('PUT', $Service_Url.putUpdateMember, jsonObjSpouseFiduciary);
            konsole.log("_spouseResultUpdateFiduciart", _spouseResultUpdateFiduciart)
          }
          // spouse make fiduciary-------------------------------------

          if (spouse?.address?.length > 0) {
            for (let i = 0; i < spouse?.address?.length; i++) {
              const _resultAddressJson = addressJson({ address: address[i], userId: responseClientData?.spouseUserId, addressTypeId: address[i].addressTypeId, createdBy: _loggedInUserId, })
              konsole.log('_resultAddressJson', _resultAddressJson)
              const _resultSaveAddress = await postApiCall('POST', $Service_Url.postAddAddress, _resultAddressJson);
              konsole.log('_resultSaveAddress', _resultSaveAddress)
            }
          }
          if (personPhoneNumber || personEmail) {
            const _contactJson = emailsOrmobilesjson(responseClientData?.spouseUserId, personPhoneNumber, personEmail, _loggedInUserId, 'spouse');
            konsole.log('_contactJson', _contactJson)
            const _contactSpouseResult = await postApiCall('POST', $Service_Url.postAddContactWithOther, _contactJson)
            konsole.log('_contactSpouseResult', _contactSpouseResult)
          }
          if (spouse?.userLivingWills.length > 0) {
            await saveUserLivingWillData(spouse?.userLivingWills, responseClientData?.spouseUserId);
          }
          if (isNotValidNullUndefile(spouse?.allergies)) {
            await saveAllergiesData(spouse?.allergies, responseClientData?.spouseUserId)
          }
        }
        // return;
        // @Spouse ADD -----------------------------------------
        // @Children ADD ---------------------------------------

        if (jsonObj?.children?.length > 0) {
          konsole.log("jsonObjchildren", jsonObj?.children)
          for (let children of jsonObj.children) {
            const { personDOB, personEmail, personGender, personName, personPhoneNumber, personRelationWithSpouse, personRelationWithUser, address } = children
            const { fName, mName, lName } = _returnfNameMnameNLname(personName)
            const genderId = returnGenderNRelationId(genderTypeList, personGender);
            const relationshipTypeId = returnGenderNRelationId(relationshipTypeList, personRelationWithUser) != 0 ? returnGenderNRelationId(relationshipTypeList, personRelationWithUser) : 'null'
            const rltnTypeWithSpouseId = returnGenderNRelationId(relationshipTypeList, personRelationWithSpouse) == 0 ? 'null' : returnGenderNRelationId(relationshipTypeList, personRelationWithSpouse) 
            const createChildJson = contractExpressAddChildJson({ subtenantId: _subtenantId, fName, mName, lName, dob: personDOB, isFiduciary: returnIsFiduciaryVal(fiduciaryAssignments, personName), genderId, primaryUserId: primaryUserId, relationshipTypeId, rltnTypeWithSpouseId, relativeUserId: primaryUserId, createdBy: _loggedInUserId });
            konsole.log('createChildJson',createChildJson,rltnTypeWithSpouseId,returnGenderNRelationId(relationshipTypeList, personRelationWithSpouse))
            const _resultOfChildAdd = await postApiCall('POST', $Service_Url.postAddMember, createChildJson)
            if (_resultOfChildAdd != 'err') {
              let _childResData = _resultOfChildAdd?.data?.data?.member;
              _childResData['fullname'] = personName
              _primarySpouseChildNonFamilyDetails.push(_childResData);
              const childUserId = _childResData?.userId;
              konsole.log('_resultOfChildAdd', childUserId, _resultOfChildAdd)

              if (personEmail || personPhoneNumber) {
                const _contactJson = emailsOrmobilesjson(childUserId, personPhoneNumber, personEmail, _loggedInUserId, 'child');
                konsole.log('_contactJson', _contactJson)
                const _contactChildResult = await postApiCall('POST', $Service_Url.postAddContactWithOther, _contactJson)
                konsole.log('_contactChildResult', _contactChildResult)
              }

              if (address?.length > 0) {
                konsole.log('address', address);
                for (let i = 0; i < address?.length; i++) {
                  const _resultAddressJson = addressJson({ address: address[i], userId: childUserId, addressTypeId: address[i].addressTypeId, createdBy: _loggedInUserId, })
                  konsole.log('_resultAddressJson', _resultAddressJson)
                  const _resultSaveAddress = await postApiCall('POST', $Service_Url.postAddAddress, _resultAddressJson);
                  konsole.log('_resultSaveAddress', _resultSaveAddress)
                }
              }
            }
          }
          let relativeUserId = primaryUserId;
          let IsChildUserId = false;
          await $getServiceFn.updateChildDetails(relativeUserId, IsChildUserId)
        }
        // @Children ADD ----------------------------------------
        // @nonFamily ADD ----------------------------------------
        if (jsonObj?.nonFamily?.length > 0) {
          konsole.log("jsonObjchildren", jsonObj?.children)
          for (let children of jsonObj?.nonFamily) {
            const { personDOB, personEmail, personGender, personName, personPhoneNumber, personRelationWithSpouse, personRelationWithUser, address } = children
            const { fName, mName, lName } = _returnfNameMnameNLname(personName)
            const genderId = returnGenderNRelationId(genderTypeList, personGender);
            const relationshipTypeId = returnGenderNRelationId(relationshipTypeList, personRelationWithUser) != 0 ? returnGenderNRelationId(relationshipTypeList, personRelationWithUser)  : null 
            const rltnTypeWithSpouseId = returnGenderNRelationId(relationshipTypeList, personRelationWithSpouse) != 0 ? returnGenderNRelationId(relationshipTypeList, personRelationWithSpouse)  : null
            const createChildJson = contractExpressAddChildJson({ subtenantId: _subtenantId, fName, mName, lName, dob: personDOB, isFiduciary: returnIsFiduciaryVal(fiduciaryAssignments, personName), genderId, primaryUserId: primaryUserId, relationshipTypeId, rltnTypeWithSpouseId, relativeUserId: primaryUserId, createdBy: _loggedInUserId });
            konsole.log('createChildJson', createChildJson)
            const _resultOfChildAdd = await postApiCall('POST', $Service_Url.postAddMember, createChildJson)
            if (_resultOfChildAdd != 'err') {
              let _nonFamilyRes = _resultOfChildAdd?.data?.data?.member;
              _nonFamilyRes['fullname'] = personName
              _primarySpouseChildNonFamilyDetails.push(_nonFamilyRes)
              const childUserId = _nonFamilyRes?.userId;
              konsole.log('_resultOfChildAdd', childUserId, _resultOfChildAdd);


              if (personEmail || personPhoneNumber) {
                const _contactJson = emailsOrmobilesjson(childUserId, personPhoneNumber, personEmail, _loggedInUserId, 'non-Family');
                konsole.log('_contactJson', _contactJson)
                const _contactChildResult = await postApiCall('POST', $Service_Url.postAddContactWithOther, _contactJson)
                konsole.log('_contactChildResult', _contactChildResult)
              }

              if (address) {
                for (let i = 0; i < address?.length; i++) {
                  konsole.log('address', address)
                  const _resultAddressJson = addressJson({ address: address[i], userId: childUserId, addressTypeId: address[i].addressTypeId, createdBy: _loggedInUserId, })
                  konsole.log('_resultAddressJson', _resultAddressJson)
                  const _resultSaveAddress = await postApiCall('POST', $Service_Url.postAddAddress, _resultAddressJson);
                  konsole.log('_resultSaveAddress', _resultSaveAddress)
                }
              }
            }
          }
        }
        // @nonFamily ADD ----------------------------------------
        // @Fiduciary assigments  ADD----------------------------------------
        if (jsonObj?.fiduciaryAssignments?.length > 0) {
          const _fiduciaryAssignmentsData = jsonObj?.fiduciaryAssignments;
          konsole.log("_fiduciaryAssignmentsData", _fiduciaryAssignmentsData)
          const _legaDocWithUniqueId = returnLegalocJson(_fiduciaryAssignmentsData, _loggedInUserId);
          konsole.log("_legaDocWithUniqueId", _legaDocWithUniqueId);
          const jsonObjLegalDoc = {
            userId: primaryUserId,
            legalDocuments: _legaDocWithUniqueId
          }

          konsole.log("jsonObjLegalDoc", jsonObjLegalDoc);
          const _resultSaveLegalDoc = await postApiCall("POST", $Service_Url.postLegalDocument, jsonObjLegalDoc);
          konsole.log("_resultOfLegalDoc", _resultSaveLegalDoc);
          if (_resultSaveLegalDoc == 'err') return;
          const _resLegalDocData = _resultSaveLegalDoc?.data?.data?.legalDocuments;
          const { spouseJson, primaryJson } = returnFiduciaryAssesmentJson(_fiduciaryAssignmentsData, _legaDocWithUniqueId, _primarySpouseChildNonFamilyDetails, _resLegalDocData, _primaryMemberName, _spouseName, _loggedInUserId);
          konsole.log("jsonObjForFIduciary", spouseJson, primaryJson);

          const jsonObjForFiduciary = [
            {
              "userId": _primaryMemberUserId,
              "fiduciaryAssignments": primaryJson,
            },
            {
              "userId": _spouseMemberUserId,
              "fiduciaryAssignments": spouseJson,
            }
          ]
          konsole.log("jsonObjForFiduciary", jsonObjForFiduciary);
          const _resultofSaveFiduciaryAssignment = await postApiCall('POST', $Service_Url.postFiduciaryAsmgentData, jsonObjForFiduciary);
          konsole.log("_resultofSaveFiduciaryAssignment", _resultofSaveFiduciaryAssignment)

        }
        // @Fiduciary assigments  ADD ----------------------------------------
        // @userAssets Like Life insurace etc.  ADD ----------------------------------------

        const primaryMemberDetails = {
          primaryUserId: _primaryMemberUserId,
          primaryMemberName: _primaryMemberName,
          spouseUserId: _spouseMemberUserId,
          spouseName: _spouseName
        }

        dispatchloader(true)
        if (userAssets?.length > 0) {
          await saveUserAssetsData(userAssets, primaryMemberDetails)
        }
        if (userLivingWills.length > 0) {
          await saveUserLivingWillData(userLivingWills, _primaryMemberUserId);
        }
        if (userProfesstionals.length > 0) {
          await saveProfessionalData(userProfesstionals, _primaryMemberUserId, _prumaryMemberMemberId);
        }

        dispatchloader(false)
        // @userAssets Like Life insurace etc.  ADD ----------------------------------------
        AlertToaster.success('Data imported successfully.')
        if (closeModal) {
          handleIsImportXml(false);
        } else if (funcall != 'funcall') {
          handleShowListOfCeData(false, userEmail);
        }
      }
      dispatchloader(false)
    }
  }

  // @Function for save userAssets Data---------------

  const saveUserAssetsData = async (userAssets, primaryMemberDetails) => {
    konsole.log("userAssetsuserAssets", userAssets)
    const { primaryUserId, primaryMemberName, spouseUserId, spouseName } = primaryMemberDetails;
    let { retireAssetTypeList, nonRetireAssetTypeList, realEstateTypeList, insProviderList } = assetRetireNonRetileRealEstateTypeList;

    return new Promise(async (resolve, reject) => {
      // @block for saving life insurance data----------------------------
      const lifeInsuranceData = userAssets.filter(item => item?.uaType == userAssestesFilterKey[0])
      konsole.log("lifeInsuranceData", lifeInsuranceData.length);

      if (lifeInsuranceData.length > 0) {
        konsole.log("lifeInsuranceData", lifeInsuranceData);
        for (let item of lifeInsuranceData) {
          konsole.log('labellabel', item);
          const userId = (item?.uaOwner === primaryMemberName) ? primaryUserId : (item?.uaOwner === spouseName) ? spouseUserId : primaryUserId;
          const insCmpId = returnFindValueForuserAssets(insProviderList, item.uaName);
          konsole.log("insCmpId", insCmpId, insProviderList, item.uaType)
          const insuranceCompanyId = isNotValidNullUndefile(insCmpId) ? insCmpId : '999999';
          const newJson = jsonForAddLifeIncCeData({ userId, createdBy: _loggedInUserId, insuranceCompanyId, additionalDetails: item?.uaAccountNumber });
          konsole.log("lifeInsJson", newJson);
          const _resultSaveLifeIns = await postApiCall('POST', $Service_Url.postaddLifeInsurance, newJson);
          konsole.log("_resultSaveLifeIns", _resultSaveLifeIns)
        }
      }
      // @block for saving user assets data----------------------------
      const _retireNonRetireNRealEstateData = userAssets.filter(item => item?.uaType != userAssestesFilterKey[0])
      konsole.log("_retireNonRetireNRealEstateData", _retireNonRetireNRealEstateData);

      if (_retireNonRetireNRealEstateData.length > 0) {
        konsole.log("assetRetireNonRetileRealEstateTypeList", assetRetireNonRetileRealEstateTypeList)

        for (let item of _retireNonRetireNRealEstateData) {
          let agingAssetCatId = 1;
          let agingAssetTypeId = returnFindValueForuserAssets(nonRetireAssetTypeList, item.uaType);
          if (!isNotValidNullUndefile(agingAssetTypeId)) {
            agingAssetTypeId = returnFindValueForuserAssets(retireAssetTypeList, item.uaType);
            agingAssetCatId = 2;
          }
          if (!isNotValidNullUndefile(agingAssetTypeId)) {
            agingAssetTypeId = returnFindValueForuserAssets(realEstateTypeList, item.uaType);
            agingAssetCatId = 3;
          }
          if (!isNotValidNullUndefile(agingAssetTypeId)) {
            agingAssetTypeId = '999999'
          }
          konsole.log("agingAssetTypeIdagingAssetTypeId", agingAssetTypeId)
          let assetOwners = []
          if (item?.uaOwner == spouseName) {
            assetOwners = [{ "ownerUserId": spouseUserId }]
          } else if (item?.uaOwner != spouseName && item?.uaOwner != primaryMemberName) {
            assetOwners = [{ "ownerUserId": spouseUserId }, { "ownerUserId": primaryUserId }]
          } else {
            assetOwners = [{ "ownerUserId": primaryUserId }]
          }
          const newJson = jsonForAddUserAssetsRetireNonRetireNRealEstate({ primaryUserId: primaryUserId, agingAssetCatId, agingAssetTypeId, createdBy: _loggedInUserId, assetOwners: assetOwners, nameOfInstitution: item.uaName });
          konsole.log("userAssetsJson", newJson)
          const _resultSaveUserAssets = await postApiCall('POST', $Service_Url.postUseragingAsset, newJson);
          konsole.log("_resultSaveUserAssets", _resultSaveUserAssets)
        }
      }
      // @block for saving userassets data----------------------------
      resolve('resolve')
    })
  }
  const metaDatafunJson = (userSubjectDataId, eventValue, eventId, subjectId) => {
    return { userSubjectDataId: userSubjectDataId, subjectId: subjectId, subResponseData: eventValue, responseId: eventId }
  }
  // @Function for save user Living Will Data---------------
  const saveUserLivingWillData = async (userLivingWills, userId) => {
    konsole.log("userAssetsuserAssets", userLivingWills)
    return new Promise(async (resolve, reject) => {
      konsole.log("userLivingWills", userLivingWills);
      const userSubjectsData = userLivingWills.map(item => metaDatafunJson(0, item?.answer, item?.responseId, item?.subjectId));
      const subject52Exists = userSubjectsData.some(item => item.subjectId === 52);
      if (subject52Exists) {
        const response90Exists = userSubjectsData.some(item => item.responseId === 90);
        const responseId = response90Exists ? 93 : 92;
        const answer = response90Exists ? 'No' : 'Yes';
        userSubjectsData.push(metaDatafunJson(0, answer, responseId, 53));
      }
      let jsonobj = { "userId": userId, "userSubjects": userSubjectsData }
      konsole.log("jsonobj", jsonobj)
      const resultSaveSubject = await postApiCall('PUT', $Service_Url.putusersubjectdata, jsonobj);
      konsole.log("resultSaveSubject", resultSaveSubject)
      resolve('resolve')
    })
  }

  // @Function for save Allergy Data-------------------------
  const saveAllergiesData = async (allergiData, userId) => {
    return new Promise(async (resolve, reject) => {
      let userSubjectsData = [metaDatafunJson(0, 'Yes', 34, 17), metaDatafunJson(0, allergiData, 283, 152)]
      let jsonobj = { "userId": userId, "userSubjects": userSubjectsData }
      konsole.log("jsonobj", jsonobj)
      const resultSaveSubject = await postApiCall('PUT', $Service_Url.putusersubjectdata, jsonobj);
      konsole.log("resultSaveSubject", resultSaveSubject)
      resolve('resolve')
    })
  }

  // @Function for save Professional Data-------------------------

  const saveProfessionalData = async (userProfesstionals, userId, userProId) => {

    return new Promise(async (resolve, reject) => {
      konsole.log("userProfesstionals", userProfesstionals);
      // const myProfe = [userProfesstionals[0]]
      for (let item of userProfesstionals) {
        const { professionalName, professionalRole, professionalEmail, professionalPhone, professionalAddressLine, professionalCompanyName } = item;
        const { fName, mName, lName } = _returnfNameMnameNLname(professionalName);
        const jsonObjAddMember = { "subtenantId": _subtenantId, "fName": fName+" "+mName, "mName": '', "lName": lName, "isPrimary": false, "memberRelationship": null, "createdBy": _loggedInUserId }
        konsole.log("jsonObjAddMember", jsonObjAddMember);
        const _resultOfAddMember = await postApiCall('POST', $Service_Url.postAddMember, jsonObjAddMember);
        if (_resultOfAddMember == 'err') {
          resolve('err');
        }
        let _resultOfAddmember = _resultOfAddMember?.data?.data?.member;
        let _profUserId = _resultOfAddmember.userId;
        const { _proTypeId, _proSerDescId } = retutnProfTypeNDescid(professTypeDetails, professionalRole)

        konsole.log("_proSerDescI_proSerDescId_proSerDescIdd", _proSerDescId, _proTypeId, professionalRole)
        const jsonProfUserMapping = createJsonForUpsertProfessionalUserMapping({ userId: _profUserId, upsertedBy: _loggedInUserId, proSerDescId: _proSerDescId, proTypeId: _proTypeId, businessName: professionalCompanyName });
        konsole.log("jsonProfUserMapping", jsonProfUserMapping);
        const _resultOfUpsertProfessionalUserMapping = await postApiCall('POST', $Service_Url.postProfessionalUserMapping, jsonProfUserMapping);
        konsole.log("_resultOfUpsertProfessionalUserMapping", _resultOfUpsertProfessionalUserMapping);
        if (_resultOfUpsertProfessionalUserMapping != 'err') {
          const responseData = _resultOfUpsertProfessionalUserMapping.data.data;
          const jsonUpsertProfessionalUser = [{
            // "userProId": userProId,
            "userProId": 0,
            "proUserId": responseData[0].proUserId,
            "proCatId": responseData[0].proCategories[0].proCatId,
            "userId": userId,
            "lpoStatus": false,
            "isActive": true,
            "upsertedBy": _loggedInUserId
          }]
          const _resultOfUpsertProfUser = await postApiCall('POST', $Service_Url.postProfessionalUser, jsonUpsertProfessionalUser);
          konsole.log("_resultOfUpsertProfUser_resultOfUpsertProfUser", _resultOfUpsertProfUser);
        }
        if (professionalPhone || professionalEmail) {
          const _contactJson = emailsOrmobilesjson(_profUserId, professionalPhone, professionalEmail, _loggedInUserId, 'Prof');
          konsole.log('_contactJson', professionalPhone,_contactJson)
          const _contactSpouseResult = await postApiCall('POST', $Service_Url.postAddContactWithOther, _contactJson)
          konsole.log('_contactSpouseResult', _contactSpouseResult)
        }
        if (isNotValidNullUndefile(professionalAddressLine)) {
          const _resultAddressJson = addressForCeProffessional({ address: item, userId: _profUserId, addressTypeId: 1, createdBy: _loggedInUserId })
          konsole.log('_resultAddressJson', _resultAddressJson)
          const _resultSaveAddress = await postApiCall('POST', $Service_Url.postAddAddress, _resultAddressJson);
          konsole.log('_resultSaveAddress', _resultSaveAddress);
        }
      }
      resolve('resolve')
    })
  }
  // @Toaster Warning -----------------------------------------
  function toasterAlert(text) {
    setdata({ open: true, text: text, type: "Warning" });
  }

  konsole.log("jsonObaaaaj", jsonObj)
  return (
    <>
      <style jsx global>{`
        .modal-open .modal-backdrop.show {
          opacity: 0.5 !important;
        }
      `}</style>
      <Modal show={showContractExpressList} onHide={() => handleContractExpressList(false)} backdrop="static" size='lg' animation="false" variant="white" className="importXML">
        <Modal.Header closeButton style={{ border: "none" }} closeVariant="white" >
          <Modal.Title>Contract Express Client Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {jsonObj ? <>
            <Container>
              <Row>

                <p className='fw-bold'>Personal Info</p>
                {/* @Primary */}
                <Col md={6} className='mt-2 mb-2'>
                  <PersonCard item={jsonObj} type='Primary' addressTypeList={addressTypeList} />
                </Col>

                {/* @Spouse  */}
                {jsonObj?.spouse &&
                  <Col md={6} className='mt-2 mb-2'>
                    <PersonCard item={jsonObj?.spouse} type='Spouse' addressTypeList={addressTypeList} />
                  </Col>}
              </Row>  <hr />
              {/* @Child */}
              <Row>
                <p className='fw-bold'>Family</p>
                {jsonObj?.children?.length > 0 ? jsonObj?.children.map((item, index) => {
                  return <>
                    <Col key={index} md={6} className='mt-2 mb-2'>
                      <PersonCard item={item} type='Child' addressTypeList={addressTypeList} />
                    </Col>
                  </>
                }) :
                  <> <NotFound key="family" addressTypeList={addressTypeList} /></>
                }
              </Row>
              <hr />
              {/* @Non-Family */}
              <Row>
                <p className='fw-bold'>Extended Family / Friends</p>
                {jsonObj?.nonFamily?.length > 0 ? jsonObj?.nonFamily.map((item, index) => {
                  return <>
                    <Col md={6} key={index} className='mt-2 mb-2'>
                      <PersonCard item={item} type='Non-Family' addressTypeList={addressTypeList} />
                    </Col>
                  </>
                }) : <> <NotFound key="friends" /></>}
              </Row>

              {jsonObj?.fiduciaryAssignments?.length > 0 &&
                <> <hr />
                  <FiduciaryAssignmentLegalDocCe jsonObj={jsonObj} list={jsonObj.fiduciaryAssignments} returnLegalocJson={returnLegalocJson} />
                </>
              }

              {jsonObj?.userAssets?.length > 0 && <><hr />
                <UserAssetsLifeIns jsonObj={jsonObj} assetRetireNonRetileRealEstateTypeList={assetRetireNonRetileRealEstateTypeList} />
              </>}

              <LivingWillDetailsCe jsonObj={jsonObj} />
              <ProfessionaDetailsCe professionalsList={jsonObj?.userProfesstionals} />

            </Container>
          </> : <Container className='text-center'>Something went wrong. Please try again after some time.</Container>}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <div className="w-100 d-flex justify-content-between">
            <button className="theme-btn mt-2" onClick={() => handleContractExpressList(false)}>Cancel</button>
            {jsonObj &&
              <button className="theme-btn mt-2" onClick={() => handleSaveData(jsonObj, CalLength.length == 1)}>Import Data</button>}
          </div>

        </Modal.Footer>
      </Modal>
    </>
  )
}
// @Function for check isFiduciary value

function returnIsFiduciaryVal(fiduciaryAssignments, value) {
  let isFiduciary = false;
  if (fiduciaryAssignments?.length < 0) {
    isFiduciary = false;
  } else {
    isFiduciary = fiduciaryAssignments?.some(item => item?.agentName == value)
  }
  return isFiduciary;
}

// @Function for create Fiduciary Assesment json
function returnFiduciaryAssesmentJson(fiduciaryAssignments, _legaDocWithUniqueId, _primarySpouseChildNonFamilyDetails, legalDocSavedData, primaryMemberName, spouseName, _loggedInUserId) {
  const jsonObj = fiduciaryAssignments?.map((item) => {
    const filterAgentData = _primarySpouseChildNonFamilyDetails?.find(i => i?.fullname === item?.agentName);
    konsole.log("filterAgentData", filterAgentData);
    const memberRelationship = filterAgentData?.memberRelationship;
    const successorId = filterAgentData?.userId;
    let relationId = 1;
    if (isNotValidNullUndefile(memberRelationship)) {
      relationId = (item?.userName == primaryMemberName) ? memberRelationship?.relationshipTypeId
        : (item?.userName == spouseName && isNotValidNullUndefile(memberRelationship?.rltnTypeWithSpouseId))
          ? memberRelationship?.rltnTypeWithSpouseId : memberRelationship?.relationshipTypeId;
    }
    konsole.log("successorIdsuccessorId", successorId, item?.agentName, _primarySpouseChildNonFamilyDetails);
    const userLegalDocId = legalDocSavedData?.find((i) => i?.legalDocTypeId == item?.legalDocId)?.userLegalDocId;
    const createJson = jsonForFiduciaryAssesmentadd({ sRankId: item.sRankId, successorUserId: successorId, userLegalDocId: userLegalDocId, successorRelationId: relationId, createdBy: _loggedInUserId });
    konsole.log("createJson", createJson);
    return { ...item, ...createJson };
  });

  konsole.log("jsonObjazs", jsonObj);
  const spouseJson = jsonObj?.filter((item) => item?.userName == spouseName) || [];
  const primaryJson = jsonObj?.filter((item) => item?.userName == primaryMemberName) || [];
  konsole.log("spouseJsonas", spouseJson, primaryJson, jsonObj, primaryMemberName, spouseName);
  return { spouseJson, primaryJson };
}


// @Function Return Email and Mobile Json -----------------
function emailsOrmobilesjson(userId, mobileNo, emailId, _loggedInUserId, type) {
  let mobileNumber = (type == 'Prof') ? `+1${$AHelper.convertToSingleFormat(mobileNo?.length >= 10 ? mobileNo?.slice(-10) : mobileNo)}` : `+1${$AHelper.convertToSingleFormat(mobileNo)}`
  let newJson = { contactTypeId: 1, mobileNo: mobileNumber, commTypeId: 1, emailId: emailId, createdBy: _loggedInUserId };
  const contactJson = {
    userId: userId,
    activityTypeId: '4',
    contact: {
      // mobiles: [],
      // emails: []
    }
  }
  if (mobileNo) {
    contactJson.contact['mobiles'] = [newJson]
  }
  if (emailId) {
    contactJson.contact['emails'] = [newJson]
  }
  return contactJson
}

// @Function for create legal doc json
function returnLegalocJson(fiduciaryAssignments, _loggedInUserId) {
  konsole.log("fiduciaryAssignments", fiduciaryAssignments);
  const uniqueData = Array.from(
    new Set(fiduciaryAssignments?.map(item => JSON.stringify(jsonForLegalDoc({ legalDocTypeId: item?.legalDocId, upsertedBy: _loggedInUserId }))))
  ).map(jsonString => JSON.parse(jsonString));
  konsole.log("uniqueData", uniqueData)
  return uniqueData;
}
// @Function return First ,Middle and Last Name -----------
function _returnfNameMnameNLname(userName) {
  const primaryUserNameSplit = userName?.split(' ');
  const [fName, mName, lName] = (primaryUserNameSplit?.length >= 3) ? [primaryUserNameSplit[0], primaryUserNameSplit?.slice(1,-1)?.join(' '), primaryUserNameSplit[primaryUserNameSplit?.length -1]] : (primaryUserNameSplit?.length == 2) ? [primaryUserNameSplit[0], '', primaryUserNameSplit[1]] : [userName, '', ''];
  return { fName, mName, lName }
}

function returnGenderNRelationId(list, label) {
  return list.find(item => item.label?.toLowerCase() == label?.toLowerCase())?.value || null;
}

function retutnProfTypeNDescid(professTypeDetails, professionalRole) {
  const { healthProfesTypeList, housingProfesTypeList, financeProfesTypeList, legalProfesTypeList, otherProfesTypeList } = professTypeDetails;
  const _professionalRole = makeProTypeFormat(professionalRole)
  let _proTypeId = returnFindValueForuserAssets(healthProfesTypeList, _professionalRole);
  let _proSerDescId = 1;

  if (!isNotValidNullUndefile(_proTypeId)) {
    _proTypeId = returnFindValueForuserAssets(housingProfesTypeList, _professionalRole);
    _proSerDescId = 2;
  }
  if (!isNotValidNullUndefile(_proTypeId)) {
    _proTypeId = returnFindValueForuserAssets(financeProfesTypeList, _professionalRole);
    _proSerDescId = 3;
  }
  if (!isNotValidNullUndefile(_proTypeId)) {
    _proTypeId = returnFindValueForuserAssets(legalProfesTypeList, _professionalRole);
    _proSerDescId = 4;
  }
  if (!isNotValidNullUndefile(_proTypeId)) {
    _proTypeId = returnFindValueForuserAssets(otherProfesTypeList, _professionalRole);
    _proSerDescId = 5;
  }
  if (!isNotValidNullUndefile(_proTypeId)) {
    _proTypeId = 999999
    _proSerDescId = 5;
  }
  return { _proTypeId, _proSerDescId }
}
// @Function userAssets return find value
function returnFindValueForuserAssets(list, value) {
  return list.find(item => item?.label == value)?.value;
}
function makeProTypeFormat(protype) {
  switch (protype) {
    case "Financial Advisor":
      return "Financial Advisor";
    case "Accountant":
      return "Accountant";
    case "Bill Pay":
      return "Bill Pay Service";
    case "Property Management":
      return "Property Manager";
    case "Geriatric Care Manager (GCM)":
      return "Geriatric Care Manager";
    default:
      return protype;
  }
}

export default forwardRef(ListContractExpressData);
