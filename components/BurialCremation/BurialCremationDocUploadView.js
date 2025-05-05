import React, { useState, useEffect, useRef, useContext } from 'react'
import { globalContext } from '../../pages/_app';
import { connect } from 'react-redux';
import konsole from '../control/Konsole';
import { $postServiceFn } from '../network/Service';
import { getApiCall, isNotValidNullUndefile, postApiCall } from '../Reusable/ReusableCom';
import { $Service_Url } from '../network/UrlPath';
import { SET_LOADER } from '../Store/Actions/action';
import AlertToaster from '../control/AlertToaster';
import PdfViewer2 from '../PdfViwer/PdfViewer2';

const BurialCremationDocUploadView = ({ dispatchloader, fileTypeId, fileStatusId, fileCategoryId }) => {
    const { setdata } = useContext(globalContext)
    const context = useContext(globalContext)
    const inputFileRef = useRef(null);

    // ****************************_________________*****************************
    const primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
    const loggedInUserId = sessionStorage.getItem('loggedUserId')
    const [fileId, setFileId] = useState(null)


    konsole.log('openFileInfoopenFileInfo', fileId)

    // ****************************_________________*****************************

    useEffect(() => {
        getDocument(primaryMemberUserId)
    }, [primaryMemberUserId])

    const getDocument = async (primaryMemberUserId) => {
        if (!isNotValidNullUndefile(primaryMemberUserId)) return;
        const jsonObj = {
            "userId": primaryMemberUserId,
            "fileCabinetId": fileCategoryId,
            "fileTypeId": fileTypeId
        }
        dispatchloader(true)
        const result = await postApiCall("POST", $Service_Url.postFileDocumentCabinetById, jsonObj);
        konsole.log('result of get file ', result)
        dispatchloader(false)
        if (result != 'err') {
            const responseData = result?.data?.data?.cabinetFiles
            if (responseData.length > 0 && responseData[0].fileTypes.length > 0 && responseData[0].fileTypes[0].currentFiles.length > 0) {
                setFileId(responseData[0].fileTypes[0].currentFiles[0].fileId)
            }
        }
        konsole.log('resultresult', result)

    }




    const fileuploadhandlechange = async (e) => {
        let selectFiles = e.target.files
        console.log("selectFiles", selectFiles)
        if (selectFiles.length > 0) {
            let { size, type } = selectFiles[0]
            konsole.log("selectFilesselectFiles", selectFiles, size, type)
            if (type !== "application/pdf") {
                toasterAlert("Only pdf format allowed");
                inputFileRef.current.value = ""
                return;
            }
            if (size > 105906176) {
                toasterAlert("File is too large, file size should be 100MB")
                inputFileRef.current.value = ""
                return;
            }
        }

        const ques = await context.confirm(true, 'Are you sure you want to upload this file?', 'Confirmation');

        console.log("quesquesques",ques,selectFiles[0]);
        if(ques==false){
            inputFileRef.current.value = "";
            return;
        }
        handleFileUpload(selectFiles[0])
       
    }

    // permission

    const handleFileUpload = (fileobj) => {
        dispatchloader(true)
        $postServiceFn.postFileUpload(fileobj, primaryMemberUserId, loggedInUserId, fileTypeId, fileCategoryId, fileStatusId, (res, err) => {
            dispatchloader(false)
            if (res) {
                getDocument(primaryMemberUserId)
                konsole.log('postFileUploadres', res)
                const fileAddUpdateMsg = `Document ${fileId ? 'updated' : 'uploaded'} successfully.`
                AlertToaster.success(fileAddUpdateMsg)
            } else {
                konsole.log('postFileUploaderr', err)
            }
        })
    }
    function toasterAlert(text) {
        setdata({ open: true, text: text, type: "Warning" });
    }
    return (
        <>
            {/* <div className={`d-flex flex-row ${(!isNotValidNullUndefile(fileId) ? "mb-3" : "")}`} > */}
            <div className='d-flex flex-row ' >
                <button className="btn" style={{ color: "#720c20", borderColor: "#720c20" }}
                    onClick={() => inputFileRef.current.click()}
                >  Click to Browse and  {(fileId) ? 'Update':'Upload'} Document</button>
                <input type="file" className="d-none"  accept=".pdf" 
                    ref={inputFileRef}
                    onChange={(e)=>fileuploadhandlechange(e)}
                />
                {(fileId) &&
                    <PdfViewer2 viewFileId={fileId} />
                }
            </div>
        </>
    )
}


const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps, mapDispatchToProps)(BurialCremationDocUploadView);