import React, { useEffect, useState } from 'react';
import useUserIdHook from '../Reusable/useUserIdHook';
import { getApiCall, postApiCall, createNestedArray } from '../Reusable/ReusableCom';
import { $Service_Url, Api_Url } from '../network/UrlPath';
import konsole from '../control/Konsole';
import { categoryFileCabinet, cabinetFileCabinetId, createJsonForFolderMapping2, operationForCategoryType } from '../control/Constant';
const withFileCabinetParalegalPermissions = (WrappedComponent, refrencePage) => {
    return (props) => {
        konsole.log("withFileCabinetProps", props)
        const { _subtenantId, _loggedInUserId, _loggedInRoleId } = useUserIdHook();

        const [legalCategoryLifePlanFolderId, setLegalCategoryLifePlanFolderId] = useState([])
        const [allFolderList, setAllFolderList] = useState([])

        // konsole State--------------------------------------
        konsole.log("legalCategoryLifePlanFolderIda", legalCategoryLifePlanFolderId);
        konsole.log("allFolderLista", allFolderList);
        // konsole State--------------------------------------

        useEffect(() => {
            if (refrencePage == 'bulkupload' || refrencePage== 'AnnualAgreementModal' || refrencePage == 'NonCrisisFeeAgreement') {
                let belongsToMemberId = props?.client?.memberId || props?.clientData?.memberId || props?.clientData?.memberUserId;
                console.log("belongsToMemberId",belongsToMemberId,props)
                apiCallGetFolderDetails(belongsToMemberId)
            }
        }, [])




        const apiCallGetFolderDetails = async (belongsToMemberId) => {

            const jsonObj = { belongsTo: belongsToMemberId }
            konsole.log("jsonObj", jsonObj);
            props.dispatchloader(true); 
            const _resultOfFileFolder = await postApiCall("POST", $Service_Url.getFileCabinetFolderDetails, jsonObj);
            props.dispatchloader(false);
            console.log("_resultOfFileFolder", _resultOfFileFolder)
            if (_resultOfFileFolder !== 'err') {
                let _responseFolder = _resultOfFileFolder?.data?.data.filter((item) => item.belongsTo == belongsToMemberId && item?.folderFileCategoryId == categoryFileCabinet[0] && item.folderCabinetId == cabinetFileCabinetId[0])
                konsole.log('_responseFolder', _responseFolder);
                if (_responseFolder?.length == 0) {
                    upsertFolderCabinetMapping(belongsToMemberId)
                } else {
                    setAllFolderList(_responseFolder)
                    let _myArray = createNestedArray(_responseFolder);
                    console.log("_myArray", _myArray)
                    setLegalCategoryLifePlanFolderId(_myArray)
                }
            } else {
                upsertFolderCabinetMapping(belongsToMemberId)
            }

        }

        const upsertFolderCabinetMapping = async (belongsToMemberId) => {
            let belongsTo = belongsToMemberId

            let _upsertFolderJson = createJsonForFolderMapping2({
                folderFileCategoryId: categoryFileCabinet[0],
                belongsTo,
                folderCreatedBy: _loggedInUserId,
                folderOperation: operationForCategoryType[1],
                folderSubtenantId: _subtenantId,
                folderRoleId: (refrencePage == 'AnnualAgreementModal' && ['10', '1'].includes(String(_loggedInRoleId))) ? 3 : _loggedInRoleId,
                folderCabinetId: cabinetFileCabinetId[0],
                autoMapProfessionalFolderId: categoryFileCabinet[0]
            })

            konsole.log("_upsertFolderJson", _upsertFolderJson)
            props.dispatchloader(true);
            const _resultUpsertFolderMapping = await postApiCall("POST", $Service_Url.upsertCabinetFolder, [_upsertFolderJson])
            props.dispatchloader(false);
            konsole.log("_resultUpsertFolderMapping", _resultUpsertFolderMapping)
            if (_resultUpsertFolderMapping == 'err') return;
            let _responseFolder = _resultUpsertFolderMapping?.data?.data.filter((item) => item.belongsTo == belongsTo && item?.folderFileCategoryId == categoryFileCabinet[0] && item.folderCabinetId == cabinetFileCabinetId[0])
            konsole.log('_responseFolder', _responseFolder);
            setAllFolderList(_responseFolder)
            let _myArray = createNestedArray(_responseFolder);
            setLegalCategoryLifePlanFolderId(_myArray)



        }

        return <WrappedComponent
            {...props}
            allFolderList={allFolderList}
            legalCategoryLifePlanFolderId={legalCategoryLifePlanFolderId}
            apiCallGetFolderDetails={apiCallGetFolderDetails}

        />
    }
}

export default withFileCabinetParalegalPermissions
