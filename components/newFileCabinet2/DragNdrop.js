import React, { useEffect, useState } from "react";
import AlertToaster from '../control/AlertToaster';
// import "./drag-drop.css";

const DragNdrop = ({
  onFilesSelected,
  width,
  height,
  handleChangeCabinet,
  actionType,
  filesProp
}) => {
  const [files, setFiles] = useState([]);

  const documentObj = (file) => {
    
    // console.log("filefilefilefilefilefile",file?.[0])
    return {
      document: file,
      checked:true
    };
  };
  const handleFileChange = (event) => {
    const selectedFiles = event?.target?.files;
    // console.log("selectedFiles",selectedFiles)
    // console.log("eventeweww",event)
    let newArrayofFiles=[];
    if(selectedFiles?.length>20 ){
      AlertToaster.error("Maximum 20 files are allowed."); 
      return;
    }
    // console.log("filesewewe",files,files?.length)
    if(files?.length>19 ){
      AlertToaster.error("Maximum 20 files are allowed."); 
      return;
    }
    // newArrayofFiles.push(documentObj(selectedFiles))
    if (selectedFiles && selectedFiles[0]) {
      // console.log("selectedFiles3232",selectedFiles)
      for (const file of selectedFiles) {
        // console.log("selectedFiles32dsdsds32",file)
        let typeOfFile = file?.type;
        let typeOfSize = file?.size;
        if (typeOfFile !== "application/pdf") {
          AlertToaster.error("Only Pdf format is allowed.");
          return;
        }
        if(typeOfSize > 105906176){
            const message=`${file?.name} size greater then 100mb`
            AlertToaster.error(message)
          }else{
            newArrayofFiles.push(documentObj(file))
          }
        // if(returnFileSize>20MB)
        // console.log('filesPathfilesPath', file.name,)
        
      }
      // console.log("drag Files", newArrayofFiles);

      // setSavedDocument(filesPath);
    }
    // console.log("newArrayofFiles",newArrayofFiles,selectedFiles)
      setFiles((prevFiles) => [...prevFiles, ...newArrayofFiles]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event?.dataTransfer?.files;
    // console.log("droppedFiles",droppedFiles)
    // console.log("eventeweww",event)
    let newArrayofFiles=[];
    if(droppedFiles?.length>20 ){
      AlertToaster.error("Maximum 20 files are allowed."); 
      return;
    }
    // console.log("filesewewe",files,files?.length)
    if(files?.length>19 ){
      AlertToaster.error("Maximum 20 files are allowed."); 
      return;
    }
    // newArrayofFiles.push(documentObj(droppedFiles))
    if (droppedFiles && droppedFiles[0]) {
      // console.log("droppedFiles3232",droppedFiles)
      for (const file of droppedFiles) {
        // console.log("droppedFiles32dsdsds32",file)
        let typeOfFile = file?.type;
        let typeOfSize = file?.size;
        if (typeOfFile !== "application/pdf") {
          AlertToaster.error("Only Pdf format is allowed.");
          return;
        }
        if(typeOfSize > 105906176){
            const message=`${file?.name} size greater then 100mb`
            AlertToaster.error(message)
          }else{
            newArrayofFiles.push(documentObj(file))
          }
        // if(returnFileSize>20MB)
        // console.log('filesPathfilesPath', file.name,)
        // console.log("filedsdsds", file);
        
      }
      // console.log("drag Files", newArrayofFiles);

      // setSavedDocument(filesPath);
    }
    // console.log("newArrayofFiles",newArrayofFiles,droppedFiles)
      setFiles((prevFiles) => [...prevFiles, ...newArrayofFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if(actionType=="Edit")
      {
        setFiles(filesProp);
      }
      else
      {
        onFilesSelected(files);
      }
   
    // setFiles(filesProp);
    // handleChangeCabinet(files)
  }, [files,filesProp]);
  function convertToKBOrMB(bytes) { // to return file size in kb or Mb
    const kb = bytes / 1024;
    if (kb > 1024) {
        const mb = kb / 1024;
        return mb.toFixed(1) + " MB";
    } else {
        return kb.toFixed(1) + " KB";
    }
}

const handleFileChekboxChange=(indexes)=>{
    // const getSelectedUploadedFile=event.target;
    const fileIndexId=indexes;
    // console.log("getSelectedUploadedFile",fileIndexId,files)
    const newArray=files?.map((item,index)=>{
      // console.log("item[index]",index,fileIndexId)
      if(index==fileIndexId){return {...item,checked:!item.checked}}
       else{return item}
    })
    // console.log("newArray",newArray)
    setFiles(newArray)
}

  console.log("filesdsdsd",files,actionType,filesProp)
  console.log("documentObj",documentObj())
  return (
    <section className={`drag-drop p-0 `} >
      <div
        className={`document-uploader ${
          files?.length > 0 ? "upload-box active" : "upload-box"
        }`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <>
        {/* {(uniqueref == 'STRUCTURE' && actionType == 'Edit') ? <></> :
        <Form.Control type='file' 
        ref={fileRef} 
        disabled={uniqueref == 'STRUCTURE' && actionType == 'Edit'} 
        id='file' 
        className="w-100" 
        placeholder='Document to Upload' 
        onChange={handleChangeCabinet} />} */}
          <input
            type="file"
            hidden
            // id="browse"
            id='file' 
            onChange={handleFileChange}
            accept=".pdf"
            multiple
            className="border border-danger"
            disabled={actionType != 'Edit' ? false : true}
          />
          <div>

          </div >
          <label htmlFor="file" className={`fileUploadDragDropFunc  ${(actionType == 'Edit')?"disableCursorArea" : "cursor-pointer"}`} >
            <div className={`${(actionType == 'Add')?"row justify-content-end":"row justify-content-center"}`} >
                <div className="p-0 m-0 col-12">
                   {/* <img src="icons/pdfFileIconNewFileCabinet.svg" className="mt-0"/> */}
                   <img src={`${(actionType == 'Add')?"/icons/uploadIconFileCabinet.svg":"/icons/pdfFileIconNewFileCabinet.svg"}`} className="d-block m-auto uploadIconFileCabinetCss"/>
                </div>
                <div className="p-0 m-0 col-9 fileUploadContentSection mt-2">
                  {(actionType == 'Edit')?<p><span>{files?.name}</span></p>:<p><span>Click to upload your file<strong>*</strong></span> or drag and drop</p>}
                    <p>PDF file  {(actionType == 'Add') && <>(Max 100mb each)</>}</p>
                </div>
                {(actionType == 'Add')&&<div className="p-0 col-2 uploadButtonWithHandCssCol d-flex justify-content-end">
                    <img src="/icons/pdfFileIconNewFileCabinet.svg" className="uploadButtonWithHandCss"/>
                </div>} 
                
            </div>
          </label>
        </>

        { actionType == 'Add' && <>
            {files?.length > 0 && (
                  <div className="file-list">
                    <div className="file-list__container">
                      {files?.map((file, index) => (
                        <div className="file-item" key={index}>
                          <div className="file-info">
                          <div className="row addFileBoderAfterAdding ">
                              <div className="col-2 p-0 m-0 d-flex justify-content-center align-items-start">
                                  <img src="/icons/pdfFileIconNewFileCabinet.svg" className="mt-0"/>
                              </div>
                              <div className="col-9 p-0 m-0 fileInformtionFileCabinet">
                                  {/* <div className="row p-0 m-0 border "> */}
                                  <p className="para1 text-truncate">{file?.document?.name}</p>
                                  {/* </div>  */}
                                  {(actionType == 'Add')&& <p className="para2">{convertToKBOrMB(file?.document?.size)}</p> }
                                <div class="progress fileProgressbar">
                                    <div class="progress-bar "></div>
                                  </div> 
                              </div>
                              <div className="col-1 checkboxColumnAddFile p-0 m-0">
                                {/* <input type="checkbox" id={index} className="fileChekboxFileCabinet" checked={file.checked} onChange={handleFileChekboxChange}/> */}
                                  <img src={`${(file?.checked==true)?"/icons/yeloowChekbox.svg":"/icons/unckeckbox.svg"}`} className="mt-0 hwYellowChekbox" id={index}  onClick={()=>{handleFileChekboxChange(index)}}/>
                                <p className="w-100 text-center">100%</p>
                              </div>
                          </div>
                            {/* <p>{file.name}</p> */}
                            {/* <p>{file.type}</p> */}
                          </div>
                          {/* <div className="file-actions" onClick={() => handleRemoveFile(index)} > */}
                            {/* <MdClear onClick={() => handleRemoveFile(index)} /> */}
                            {/* 123 */}
                          {/* </div> */}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
          </>
        }
        {files?.length > 0 && (
          <div className="success-file">
            {/* <AiOutlineCheckCircle
              style={{ color: "#6DC24B", marginRight: 1 }}
            /> */}
            {/* <p>{files.length} file(s) selected</p> */}
          </div>
        )}
      </div>
    </section>
  );
};

export default DragNdrop;