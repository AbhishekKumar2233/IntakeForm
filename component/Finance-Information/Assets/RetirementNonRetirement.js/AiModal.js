import { Modal } from "react-bootstrap";
import { useEffect, useState,useContext } from "react";
import { isNotValidNullUndefile, postApiCall, _handOff_Msg, getApiCall2 } from "../../../../components/Reusable/ReusableCom"
import { $getServiceFn } from "../../../../components/network/Service";
import { globalContext } from "../../../../pages/_app"

export default function AiModal({showAiDoc, setShowAiDoc, aiDocuments, setAiDocuments,stopLoader,showTime,setShowTime,documentNameVersion,selectedDocument,setSelectedDocument,paralegal_client_name,pathName}){
    const [primaryDetail, setPrimaryDetail] = useState({});
    const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
    const sessionRoleId = (JSON.parse(sessionStorage.getItem("stateObj"))?.roleId);
    // console.log("AiModaltimings",showTime)
    const onClickingCloseButton=()=>{
        setShowAiDoc(false)
        setShowTime([]);
        if(pathName=="Paralegal_Screen"){
            setSelectedDocument([])
        }
    }
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }
    const getDocumentFolderDetails =(data)=>{
        // console.log("getDocumentFolderdata",data)
        return new Promise((resolve, reject) => {
          $getServiceFn.getDocumentFolder(data, (res, err) => {
            if (res) {            
                const response = res?.data;
                resolve(response)
            }
            else {
              resolve('err')
            }
          })      
        })
      }

    useEffect(() => {
        const storedData = sessionStorage.getItem("userDetailOfPrimary");
        if (storedData) {
            try {
                setPrimaryDetail(JSON.parse(storedData));
            } catch (err) {
//                console.error("Invalid JSON in sessionStorage for userDetailOfPrimary:", err);
                setPrimaryDetail({});
            }
        }
    }, []);

    const downloadButtonFun=async()=>{
            // console.log("downloadButtonFunaiDocuments",aiDocuments)
            // console.log("Aimodal ",documentNameVersion)
            if(documentNameVersion.client_name=="" || documentNameVersion.version==""){
                toasterAlert("warning", `Client's name or version not found`);
                return
            }
            const url=`client_name=${documentNameVersion.client_name}&version=${documentNameVersion.version}`
            //  const url="client_name=Shagun28-Princi&version=Shagun28-Princi_V1-0-0D2025%3A04%3A04T05%3A21%3A59"
            const getDocumentFolderData =  await getDocumentFolderDetails(url)  
            if (getDocumentFolderData !== "err") {
                const downloadLink = getDocumentFolderData.folder_link + "/download";
                // console.log("Download link:", downloadLink);
                const a = document.createElement("a");
                a.href = downloadLink;
                a.download = ""; // you can specify a filename if desired
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
            // console.log("getDocumentFolderData",getDocumentFolderData)
    }
    return(<>
    <Modal show={showAiDoc} centered animation="false">
        <div className=" w-100 d-flex justify-content-end">
            <div className="fs-3 me-3">
            {stopLoader == true ? <>
                <div className="d-flex">
                    <h5 className="m-auto">Document Generation in Progress...</h5>
                    <div className="mt-2 ms-1" style={{border: '4px solid #f3f3f3',borderTop: '4px solid #3498db',borderRadius: '50%',width: '30px',height: '30px',animation: 'spin 1s linear infinite', marginRight:"-5px"}} />
                </div>
                </>:
                <><img src="/icons/cross.png" alt=""style={{ cursor: "pointer" }} onClick={onClickingCloseButton}/></>
            }
            </div>
        </div>
        <Modal.Body className="pb-5 pt-4">
            <div className="MainSignUp">
                <div className=" InnerSignUp w-100">
                    <p className="text-center fs-4" style={{ color: "#720c20" }}><strong>Document Generation </strong></p>
                    {(sessionRoleId==13 || sessionRoleId==3)? <p className="fs-4 text-center primaryNameAiDocument"><strong>{paralegal_client_name || "Client"}</strong></p>:
                     <p className="fs-4 text-center primaryNameAiDocument"><strong>{(primaryDetail?.memberName) || "Client"}</strong></p>}            
                {isNotValidNullUndefile(aiDocuments) ? <>
                    <div className="">
                    {aiDocuments?.generated_document?.length > 0 && 
                    <div className="m-3">
                        <div className="d-flex justify-content-between">
                        <span style={{fontSize:"16px"}}>Completed</span> 
                        {(aiDocuments?.in_progress_documents?.length==0 && aiDocuments?.generated_document?.length!=0) && <button className='downloadButton' onClick={downloadButtonFun} >Download</button>}
                        </div>
                        <ul style={{listStyleType:"none",padding:"2px 13px 0px 0px"}}>
                        {aiDocuments?.generated_document?.map((ele) => {
                            return (
                            <>                               
                                <li className="d-inline-block AiDocumentList p-2 ">
                                <div className="w-100" style={{fontSize:"12px"}}>
                                {<>
                                    <a href={ele?.share_link} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center">  
                                        <img src="/New/icons/docx_icon.svg" alt="Docx Icon" className="m-2"/>  
                                        <span className="m-2">{ele?.file_name}</span>
                                    </a>
                                </>}
                                </div>
                                </li>
                                </>
                            );
                        })}
                          </ul>
                    </div>}
                    {aiDocuments?.in_progress_documents?.length > 0 &&
                    <div className="m-3">
                        <h4 style={{fontSize:"16px"}}>In-Process</h4>
                        {aiDocuments?.in_progress_documents?.map((ele) => {
                            return (
                            <>
                            <ul style={{listStyleType:"none"}}>
                                <li>
                                <span className="" style={{fontSize:"12px"}}>
                                {ele?.document_name} ------ {<a rel="noopener noreferrer">{ele?.progress_percentage}</a>}
                                </span> 
                                </li>
                            </ul>
                            </>
                            );
                        })}
                        </div>}
                    </div>  
                </>:""
                }

                {showTime?.length>0 && 
                    <div className="m-4 pt-3">
                    <h4 style={{fontSize:"16px"}} className="mb-2">Processing Time</h4>
                    {showTime?.map((ele) => {
                            return (<><span className=" m-4 p-2" style={{fontSize:"12px"}}>{ele}</span><br/></>);
                    })}
                </div>
                } 
                </div>
            </div>
        </Modal.Body>
        </Modal>
    </>)
}