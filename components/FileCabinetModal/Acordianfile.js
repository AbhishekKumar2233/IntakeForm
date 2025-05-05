import React from 'react';

import Accordion from 'react-bootstrap/Accordion';
import { Breadcrumb, Col, Row } from 'react-bootstrap';
import konsole from '../control/Konsole';
import { useEffect,useState } from 'react';
import { $CommonServiceFn, $getServiceFn } from "../network/Service";
import { $Service_Url } from "../network/UrlPath";
import BulkUpload from '../FileCabinet/BulkUpload';

const Acordianfile = (props) => {
  const [spouseFiles, setSpouseFiles] = useState([])
  const [clientFiles, setClientFiles] = useState([])
  const [showDragNDrop, setDragNDrop] = useState(false);
  const [clientData,setClientData] = useState({})
  const [ uploadFromFileCabinet, setUploadFromFileCabinet] = useState(false)
  const [fromAccordain, setfromAccordain] = useState("")

    const data = props.pdfdata;
    konsole.log("datata",data)
    useEffect(()=>{
      seperateSpouse()
    const memberId = sessionStorage.getItem('SessPrimaryUserId') 
    const client = {
      memberId : memberId,
    }
    setClientData(client)

    },[data])

    const seperateSpouse = async() =>{
      let filterClientFile = data.filter((item)=>{
        return item.belongsToRelationShipName != "Spouse"
      })
      konsole.log("filterClientFile",filterClientFile)
      for(let [index,item] of filterClientFile.entries()){
        let jsonobj=[{"userId":item?.primaryUserId,
                  "othersMapNatureId":item.fileId,
                  "isActive": true,
                  othersMapNature: ""
              }
        ]
        if(item.fileTypeId=='999999'){
          konsole.log("itemitemitem",jsonobj,item)
          const otherfilename = await fetchothermapname(jsonobj)
          filterClientFile[index].fileTypeName=otherfilename
        }

      }
      setClientFiles(filterClientFile)
      
      let filterSpouseFile = data.filter((item)=>{
        return item.belongsToRelationShipName == "Spouse"
      })
      setSpouseFiles(filterSpouseFile)
    }

    const handleUpload = (data) => {
      // alert("upload")
      konsole.log("dadtatdatd",data)
      setfromAccordain(data)
      setDragNDrop(!showDragNDrop);
      setUploadFromFileCabinet(true)
    };
    const handleDragNDrop = (client) => {
      konsole.log("clientsclients",client)
      // setClient(client);
      handleUpload();
      setUploadFromFileCabinet(false)
    };

    
    const fetchothermapname = (jsonobj) => {
konsole.log("responseresponseresponseresponse",JSON.stringify(jsonobj))
      return new Promise((resolve, reject) => {
          $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getOtherFromAPI,jsonobj,
               (response) => {
                  if (response) {
                  konsole.log("responseresponseresponseresponse",response)
                  let otherFileName=(response?.data?.data?.length !=0)?response?.data?.data[0]?.othersName:'Others'
                      resolve(otherFileName)
                  }else{
                    resolve('Others')
                  }
              })
      })
  }
  konsole.log("clientData",uploadFromFileCabinet,fromAccordain)

    return (
      <>
        <div>
          {clientFiles != [] && clientFiles !== undefined && clientFiles != "" && clientFiles.length != 0 ? (
            <Row className="ms-2d-flex justify-content-start ">
              <Col>
                <Accordion defaultActiveKey="0">
                  <Accordion.Item
                    eventKey="0"
                    className="AcodiItem"
                    style={{ border: "none" }}
                  >
                    <Accordion.Header>
                    <div style={{ fontWeight: 600, fontSize: "17px" }}>
                    {clientFiles[0].belongsToMemberName}
                  </div>
                      <div style={{ width: "70%" }} className="px-1">
                        <hr className="w-100" />
                      </div>
                    </Accordion.Header>
                    <Accordion.Body  className="d-flex m-0 p-0 mt-1 mb-0 me-5 customScroll Card-Col vertical-scroll" 
                    style={{overflow:"scroll",overflowY:"auto"}}>
                      <div className='d-flex justify-content-center align-items-center'> 
                      {props.folderType !== "3" ? 
                      <div className='cursor-pointer ms-3' style={{border: "2px solid #EBEDEF",borderRadius: "3px",padding:"5px",marginBottom: "auto",marginTop: "13px"}}>
                          <img className='ms-3 me-3' src="/icons/add-icon.svg" alt="" onClick={()=>handleUpload("fromAccordian")} />
                          <div className='text-center'>Add File</div>
                          </div>
                          : <></>}
                      </div>
                      {clientFiles.map((filemap) => (
                        <div
                          className="d-flex justify-content-center align-items-center flex-column mx-2 mb-2 "
                          onClick={() => props.handleClose(filemap)} 
                        >
                          <div className="img-Div" style={{ width: "50px" }}>
                            <img
                              src="images/file-folder.png"
                              className="img-fluid"
                            />
                          </div>
                          <div className=" " style={{ height: "36px" }}>
                            <h6
                              className=" text-center mt-1 fw-bold  "
                              style={{ fontSize: 10 }}
                            >
                              {filemap.fileTypeName} 
                              {/* - {filemap.fileStatusName} */}
                            </h6>
                          </div>
                        </div>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
          ) : <></>}
          {spouseFiles != [] && spouseFiles !== undefined && spouseFiles != "" && spouseFiles.length != 0 ? 
          <Row className="ms-2d-flex justify-content-start mt-3">
              <Col>
                <Accordion defaultActiveKey="0">
                  <Accordion.Item
                    eventKey="0"
                    className="AcodiItem"
                    style={{ border: "none" }}
                  >
                    <Accordion.Header>
                    <div style={{ fontWeight: 600, fontSize: "17px" }}>
                    {(spouseFiles?.length > 0) && spouseFiles[0]?.belongsToMemberName}
                  </div>
                      <div style={{ width: "70%" }} className="px-1">
                        <hr className="w-100" />
                      </div>
                    </Accordion.Header>
                    <Accordion.Body  className="d-flex m-0 p-0 mt-1 mb-0 me-5 customScroll Card-Col vertical-scroll" 
                    style={{overflow:"scroll",overflowY:"auto"}}>
                      <div className="d-flex justify-content-center align-items-center">
                      {props.folderType !== "3" ? 
                      <div className='cursor-pointer ms-3' style={{border: "2px solid #EBEDEF",borderRadius: "3px",padding:"5px",marginBottom: "auto",marginTop: "13px"}}>
                        <img className='ms-3 me-3' src="/icons/add-icon.svg" alt="" onClick={()=>handleUpload("fromAccordian")} />
                        <div className='text-center'>Add File</div>
                        </div>
                        : <></>}
                      {spouseFiles?.map((filemap) => (
                        <div
                          className="d-flex justify-content-center align-items-center flex-column mx-2 mb-2 "
                          onClick={() => props.handleClose(filemap)} 
                        >
                          <div className="img-Div" style={{ width: "50px" }}>
                            <img
                              src="images/file-folder.png"
                              className="img-fluid"
                            />
                          </div>
                          <div className=" " style={{ height: "36px" }}>
                            <h6
                              className=" text-center mt-1 fw-bold  "
                              style={{ fontSize: 10 }}
                            >
                              {filemap.fileTypeName} 
                              {/* - {filemap.fileStatusName} */}
                            </h6>
                          </div>
                        </div>
                      ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>: ""}
            {(props.folderType == "3"  && clientFiles.length == 0 && spouseFiles.length == 0) ? 
            <p className="text-center mt-1">No Files Available</p>
             : (clientFiles.length == 0 && spouseFiles.length == 0) ? 
            <div className="d-flex justify-content-center align-items-center" >
              <div>
               <div>
              <p className="text-center mt-1">No Files Available</p>
              </div>
              <div>Click to Browse and Upload <span className='ms-2 fs-5'> {'\u2192'}</span></div>
              </div>
             <div>
             <img
               className=""
               style={{ height: "42px",cursor:"pointer"}}
               src="icons/fileUpload.svg"
               onClick={()=>handleUpload("fromAccordian")}
             />
             </div>
            
             </div>
             : <></>}
        </div>
        {konsole.log("bulkUploadBulkUpload",props.text)}
        {showDragNDrop && (
        <BulkUpload
          showDragNDrop={showDragNDrop}
          handleDragNDrop={handleDragNDrop}
          client={clientData}
          uploadFromFileCabinet = {uploadFromFileCabinet}
          text={props.text}
          fromAccordian = {fromAccordain}
          filecabinetdocumentfunc = {props.filecabinetdocumentfunc}
          folderType = {props.folderType}
          setDocumentShow = {props.setDocumentShow}
        />
      )}
        </>
      );
}

export default Acordianfile