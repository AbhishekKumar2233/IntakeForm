import React, { useRef, useContext, useState } from 'react'
import { $AHelper } from '../../Helper/$AHelper';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { postApiCall } from '../../../components/Reusable/ReusableCom';
import { useLoader } from '../../utils/utils';
import konsole from '../../../components/control/Konsole';
import { globalContext } from '../../../pages/_app';
import { $Service_Url } from '../../../components/network/UrlPath';
import UploadedFileView from '../../Common/File/UploadedFileView';
const UploadLegalDoc = ({ legalDocTypeId, docFileId, docName, updateFilewithKeyValue, userLegalDocId,indexes}) => {
    const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
    const { primaryUserId, loggedInUserId } = usePrimaryUserId();

    const [viewFileInfo, setViewFileInfo] = useState('')

    let FileCategoryId = 6;
    let FileTypeId = 2;
    let FileStatusId = 2;
    const inputFileRef = useRef(null);

    async function handleFileChange(e) {
        const files = e.target.files;
        if (files.length > 0 && $AHelper.$isNotNullUndefine(legalDocTypeId)) {
            let typeOfFile = files[0].type;
            let typeOfSize = files[0].size;
            if (typeOfFile !== "application/pdf") {
                toasterAlert("warning", "Warning", 'Only pdf format allowed');
                return;
            }
            if ($AHelper.$fileUploadMaxSize(typeOfSize)) {
                toasterAlert("warning", "Warning", 'File is too large, file size should be 100MB"');
                return;
            }
            const confirmRes = await newConfirm(true, `Are you sure you want to upload this file? `, "Permission", "Confirmation", 3);
            console.log("confirmRes", confirmRes)
            if (confirmRes == true) {
                useLoader(true)
                const jsonObj = $JsonHelper.createUploadUserDocument({ File: files[0], UploadedBy: loggedInUserId, UserFileName: files[0].name, UserId: primaryUserId, FileCategoryId, FileTypeId, FileStatusId, UserFileName: docName, });
                console.log("jsonObj", jsonObj)
                const formDataJson = $AHelper.$appendFormData(jsonObj);
                konsole.log("formDataJson", formDataJson)
                const _resultOf = await postApiCall('POST', $Service_Url.postUploadUserDocumentVersion2, formDataJson)
                useLoader(false);
                if (_resultOf != 'err') {
                    const responseData = _resultOf?.data?.data;
                    updateFilewithKeyValue({ fileURL: responseData?.fileURL, legalDocTypeId: legalDocTypeId, fileId: responseData?.fileId, userLegalDocId,indexes:indexes })

                }
                konsole.log("_resultOfUploadUserDocumnt", _resultOf);
                console.log("jsonObj", jsonObj)
                inputFileRef.current.value = "";
            } else {
                inputFileRef.current.value = "";
            }
            // setFileInformation([returnFileObj({ file: files[0], name: files[0].name, size: $AHelper.$fileSizeConvertInKb(typeOfSize) })])
        }

        konsole.log("filesfiles", files)
    }


    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    };

    const hadleFileUploadChange=()=>{
        if($AHelper.$isNotNullUndefine(legalDocTypeId)){
            inputFileRef.current.click()
        }else{
            toasterAlert("warning", "Warning", `Please select document type`);
        }
       

    }
    const handleViewFileInfo = (val) => {
        setViewFileInfo(val)
    }

    return (
        <>
            <input type="file"  className="d-none" ref={inputFileRef} onChange={handleFileChange} />
            <>
                {(docFileId != 0 && $AHelper.$isNotNullUndefine(docFileId)) &&
                    <img src="/New/icons/file-eye-view.svg" alt="View Icon" className="icon cursor-pointer p-2" onClick={() => handleViewFileInfo(docFileId)} />
                }

                <img src="/icons/LegalDocUpload.svg" alt="Edit Icon" className="icon cursor-pointer p-2" onClick={() => hadleFileUploadChange()} />

            </>

            {$AHelper.$isNotNullUndefine(viewFileInfo) &&
                <UploadedFileView
                    refrencePage='UploadLegalDoc'
                    isOpen={true}
                    fileId={viewFileInfo}
                    handleViewFileInfo={handleViewFileInfo}
                    fileDetails={{ name: docName }}

                />
            }

        </>
    )
}

export default UploadLegalDoc
