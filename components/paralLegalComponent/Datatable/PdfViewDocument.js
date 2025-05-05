import React, { useState } from 'react'
import { Button, Modal, Row, Col } from 'react-bootstrap';
import { $CommonServiceFn, $postServiceFn } from "../../../components/network/Service";
import { $Service_Url } from "../../../components/network/UrlPath";
import konsole from '../../control/Konsole';
import { SET_LOADER } from "../../../components/Store/Actions/action";
import { connect } from "react-redux";
import AlertToaster from '../../control/AlertToaster';

const PdfViewDocument = (props) => {
    const [fileBase64, setfileBase64] = useState()
    konsole.log("viewFileIdviewFileIdprops", props?.viewFileId)

    const viewPdfFile = () => {
        props.dispatchloader(true)
        konsole.log("viewFileIdviewFileId", props?.viewFileId)
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getfileUploadDocuments + props?.viewFileId + "/1", "", (response, err) => {
            props.dispatchloader(false)
            if (response) {
                konsole.log("viewFileIdviewFileId", response)
                let fileDocObj = response.data.data;
                let filebyteArraydata = fileDocObj?.fileDocObj?.fileInfo?.fileDataToByteArray;
                let data = 'data:application/pdf;base64,' + fileDocObj?.fileInfo?.fileDataToByteArray;
                let fileName = `${props.primaryName} ${
                    props?.isfeeAgreement ? "Non-Crisis Fee Agreement" : "Annual Maintenance Agreement"
                  }.pdf`;                  
                setfileBase64(data)
                //---
                downloadPDF(data, fileName)
                //---

            } else {
                konsole.log("errr", err)
            }
        })
    }


    const downloadPDF = (fileByteArray, file) => {
        try {
            // Remove the data URL prefix if it exists
            const base64Data = fileByteArray.replace(/^data:application\/pdf;base64,/, '');
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const linkSource = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            const fileName = file;
   
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink); // Append the link to the body
            downloadLink.click();
            document.body.removeChild(downloadLink); // Remove the link after clicking
            URL.revokeObjectURL(linkSource); // Clean up the object URL
            AlertToaster.success("Document downloaded successfully.");
        } catch (error) {
            AlertToaster.error("An error occurred while downloading the document.");
            konsole.error("Error downloading PDF:", error);
        }
    }
    return (
        <>
        {props?.buttonName == "DownloadAMAFromPlansSetting" ? 
        <div className='d-flex justify-content-center align-items-center p-q downloadAMABtn cursor-pointer' onClick={() => viewPdfFile()}>
        <div><img src='./images/DownloadIcon.svg'/></div>
        <div style={{color:"#606060",fontSize:"14px",fontWeight:"600"}} className='mt-1 ms-1'>Download AMA</div>
       </div> : 
     <Button className="theme-btn" onClick={() => viewPdfFile()}>{(props?.buttonName !== undefined)? props?.buttonName : "View"} Document </Button>}
    </>
    )
}

// export default PdfViewDocument
const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader })
});

export default connect(mapStateToProps, mapDispatchToProps)(PdfViewDocument)