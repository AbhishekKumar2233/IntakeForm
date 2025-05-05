import React,{useState} from "react"
import { Row, Col, Form, Tooltip, OverlayTrigger, InputGroup, Modal, DropdownButton, Dropdown } from 'react-bootstrap'
import OtherInfo from '../asssets/OtherInfo'
export default function ShareDocumentModal(props){

    let {
        hideOpenShareDocument, 
        searchedFamilyMemeberValue, 
        disableConfirmButton, 
        shareDocumentFun,
        checkCheckedForShare,
        mappingCheckBoxValue,
        showOpenCabinetShareDoc,
        shareWithModal,
        cabinetShareModalCloseButton,
        modalname,
        mappingValues,
        openShareDocument,
        closeCabinetShareModal,
        fileSharedWihCount,
        onClickSharedFiles,
        checkFileInformationFun,
        familyMembersListForCabinet,
        confirmAndShareFun,
        mappingCheckBoxValueForCabinetShare,
        filterFamilyMemebers,
        setSearchedFamilyMemeberValue,
        selectedCabinetData,
        showPrimaryFiles,
        fileInformationList,
        checkeIfAllBoxesAreChecked,
        checkeIfAllBoxesAreCheckedFilesAndFamily,
        onChangeAllcheckboxesAtOnce,
        onChangeAllcheckboxesAtOnceForFiles,
        onChangeAllcheckboxesAtOnceForFamilyMembers,
    }=props

    // console.log("props",props)
    // console.log("selectedCabinetData",selectedCabinetData)
    // console.log("familyMembersListForCabinet",props.mappingValues)
    const primaryUserId = sessionStorage.getItem("SessPrimaryUserId")
    const spouseUserId = sessionStorage.getItem("spouseUserId")

    const tableHeadings=[
        { header1: ["File name",(selectedCabinetData?.fileCategoryId==6)? "Type":"", "Shared"] },
        { header2: ["Name", "Email", "Relationship"] },
    ]

    const getRandomColor = () => {
        const letters = '01234567'; 
        const blueLetters = '89ABCDEF';  
        let color = '#';
        for (let i = 0; i < 2; i++) {
            color += letters[Math.floor(Math.random() * letters.length)]; 
        }
        for (let i = 0; i < 2; i++) {
            color += letters[Math.floor(Math.random() * letters.length)]; 
        }
        for (let i = 0; i < 2; i++) {
            color += blueLetters[Math.floor(Math.random() * blueLetters.length)]; 
        }
        return color;
          }
          
          const getUserColor = (userName) => {
            let userColors = JSON.parse(localStorage.getItem('userColors')) || {};
        
            if (!userColors[userName]) {
                userColors[userName] = getRandomColor();
                localStorage.setItem('userColors', JSON.stringify(userColors));
            }
        
            return userColors[userName];
        }

    function closeModalButton(){
        openShareDocument ? hideOpenShareDocument() : cabinetShareModalCloseButton();
    }
    
    let getModalName=(openShareDocument?"Share Document":(!closeCabinetShareModal?"Share with...":`Share drawer: ${selectedCabinetData?.fileCategoryType}`))
    let getModalExplainingparagraph=openShareDocument?"With whom you would like to share this with?":(!closeCabinetShareModal?"Please select the Agent(s) you want to share the files with below:":`Please select the files you want to share below:`)
    let tableHeadingModal=(openShareDocument?tableHeadings[1].header2:(!closeCabinetShareModal?tableHeadings[1].header2: tableHeadings[0].header1))

    function checkChekboxIfChecked(data){
        // console.log("checkChekboxIfCheckeddatadata",data)
        return openShareDocument?checkCheckedForShare(data):closeCabinetShareModal?(data?.checked):(data.checked ?? false)
    }
    function onChekboxChange(e,data)
    {
        // console.log("mappingCheckBoxValue",e,data?.userId)
        openShareDocument?mappingCheckBoxValue(e,data?.userId):closeCabinetShareModal?checkFileInformationFun(data,e):mappingCheckBoxValueForCabinetShare(e,data?.userId)
    }

    function filterfunction() {  
        if(openShareDocument || shareWithModal){
            return mappingValues?.filter((data,index,array)=>{
                // konsole.log("aflaa",familyMembersList,"--",data?.fName?.toLowerCase().startsWith(),"---",searchedFamilyMemeberValue?.toLowerCase().startsWith(),"-----",data?.fName?.toLowerCase().startsWith()==searchedFamilyMemeberValue?.toLowerCase().startsWith())
                return (
                    (
                    data?.fName?.toLowerCase().includes(searchedFamilyMemeberValue?.trim().toLowerCase()) ||
                    data?.email?.toLowerCase().includes(searchedFamilyMemeberValue?.trim().toLowerCase())
                    )
                )
        })
        }
        if(closeCabinetShareModal){     
            //  console.log("primaryUserIdprimaryUserId",primaryUserId,spouseUserId)
            //  console.log("fileInformationcloseCabinetShareModal",fileInformationList)
             let filtersToggleSelectedFiles=fileInformationList?.filter((data)=>(data?.fileBelongsTo)==((showPrimaryFiles == true) ? primaryUserId : spouseUserId))
            //  console.log("filtersToggleSelectedFiles",filtersToggleSelectedFiles)
             const getToggleFiles= filtersToggleSelectedFiles?.filter((value)=>{
                   // console.log("fileCategoryIdfileCategoryId",value,selectedCabinetData?.fileCategoryId)
                   return (value?.fileCategoryId==selectedCabinetData?.fileCategoryId)
               })
            //    console.log("getToggleFiles",getToggleFiles)
               return getToggleFiles
        }

        return []
            
    }

    function changeSearchBarValueFun(e){
        setSearchedFamilyMemeberValue(e?.target?.value)
    }

    function getErrorMessageForTable(){
        if(searchedFamilyMemeberValue?.length==0){
            if(filterfunction().length==0){
                if((openShareDocument || shareWithModal)){return "No family member found"}
                return "No files found"
            } 
        }
        else{
            if(filterfunction().length==0){
               return "No data found"
            }         
        }
        return ""
    }

    function onChangeAllcheckboxesAtOnceFun(event){
        openShareDocument?onChangeAllcheckboxesAtOnce(event):closeCabinetShareModal?onChangeAllcheckboxesAtOnceForFiles(event):onChangeAllcheckboxesAtOnceForFamilyMembers(event)
        // console.log("mappingValues",event)
    }
    function checkeIfAllBoxesAreCheckedFun(){
        return openShareDocument?checkeIfAllBoxesAreChecked():checkeIfAllBoxesAreCheckedFilesAndFamily()
    }

    // console.log("openShareDocument",openShareDocument,"closeCabinetShareModal",closeCabinetShareModal,"shareWithModal",shareWithModal)
    return(
        <>
        <div id='custom-modal-container' className='custom-modal-container' style={{ zIndex: "100000" }}>
             <Modal 
             show={true} 
             // show={false} 
             // size="lg"
             // enforceFocus={false} 
             id='custom-modal-container2' 
             className='useNewDesignSCSS searchModalWidth'
             aria-labelledby="contained-modal-title-vcenter" 
             centered>
                 <Modal.Header className={`newFileCabinteModalHeaderBackground justify-content-between`}> 
                     <>
                         <span className='newFileCabinetFileModalheader'>{getModalName}</span>
                            <button type="button" className=" filePrieviewClosebuttonStyle closeButt2" > <img src="/icons/filePrieviewClosebutton.svg" className='viewFileImage mt-0' 
                                    onClick={closeModalButton}
                            /></button>
                     </>
                 </Modal.Header>
                 <Modal.Body style={{padding:" 18px 22px 10px"}}>
                     <section>
                             <div class="row justify-content-between">
                                 <div className="col-6 d-flex align-items-center">
                                     <p className="whomWoulYouShareDoc">{getModalExplainingparagraph}</p>
                                 </div>
                                 {(openShareDocument || shareWithModal) && 
                                  <div className="col-6 d-flex justify-content-end">
                                  <div class="p-1 bg-light rounded rounded-pill shadow-sm  FileCabinetSearchBarStyleDoc">
                                      <div class="input-group d-flex align-items-center h-100">
                                          <div class="input-group-prepend d-flex align-items-center">
                                              <img src="/icons/FileCabinetSearchIcon.svg" className="mt-0" />
                                          </div>
                                          <input type="search" 
                                          onChange={changeSearchBarValueFun} 
                                          placeholder="Search by name or email" 
                                          value={searchedFamilyMemeberValue}
                                          aria-describedby="button-addon2" 
                                          class="form-control border-0 bg-light" />
                                      </div>
                                  </div>
                              </div>
                              }
                                
                             </div>
                     </section>
                 </Modal.Body>

                 <table className="shareDocuemntTable">
                     <tr className="firstRowTable table1">
                         <th> 
                            <div className="d-flex align-items-center">
                                <input type="checkbox" className="searchChekbox addPadding" checked={checkeIfAllBoxesAreCheckedFun()} onChange={(e) => onChangeAllcheckboxesAtOnceFun(e)}/>
                                {tableHeadingModal[0]}
                            </div>
                            
                        </th>
                         <th><div className="d-flex align-items-center">{tableHeadingModal[1]}</div></th>
                         <th><div className="d-flex align-items-center">{tableHeadingModal[2]}</div></th>
                     </tr>

                         {filterfunction().map((data)=>{
                            // console.log("dattta",data)
                             return(
                                    <tr className="tabelDataRow">
                                        <td className="">
                                            <div className="d-flex align-items-center">
                                                <input
                                                type="checkbox"
                                                className="searchChekbox"
                                                checked={checkChekboxIfChecked(data)}
                                                onChange={(e) => onChekboxChange(e,data)}
                                                />

                                                {(openShareDocument || shareWithModal) && 
                                                <>
                                                    <div className="dummyImg" style={{ backgroundColor: getUserColor(data?.fName),margin:"0px 10px" }}>
                                                        <p className="ps-0">
                                                            {`${data?.fName?.[0] ?? ''}`}
                                                        </p>
                                                    </div>
                                                    <span className="DocumentNameTable"> {`${data.fName||""} ${data.lName||""}`}</span>
                                                </>    
                                                } 
                                                {closeCabinetShareModal &&
                                                <>
                                                    <img src="/icons/pdfFileImage.svg" className="pdfImageShareDrawer mt-0"></img>
                                                    <span className="pdfImageShareDrawerSpan">{data?.userFileName}</span>
                                                </>
                                                }
                                            </div>
                                        </td>
                                        <td>
                                            {(openShareDocument || shareWithModal) && <span className="DocumentEmailTable">{data.email?? "Not available"}</span>}
                                            {closeCabinetShareModal && (selectedCabinetData?.fileCategoryId==6) &&
                                             <span className="sharedDrawerType"> 
                                                <OtherInfo 
                                                othersCategoryId={31} 
                                                othersMapNatureId={data?.fileId} 
                                                FieldName={data?.fileTypeName}
                                                userId={primaryUserId}
                                            /></span>
                                              }
                                        </td>
                                        <td>
                                            {(openShareDocument || shareWithModal) && <span className="RelationshipNameTable" >{data?.relationshipName}</span>}
                                            {closeCabinetShareModal && 
                                                <>
                                                <img src="/icons/sharedIcon.svg" className=" mt-0 sharedIcoImageimg"></img> 
                                                <span className="DocumentEmailTable sharedIcoImagespan">{fileSharedWihCount(data)}</span>
                                                </>
                                            }
                                        </td>
                                    </tr>
                             )
                         })
                         }
                     
                         {getErrorMessageForTable().length>0 && <p className="familyMemberNotFoundClass">{getErrorMessageForTable()}</p>}
                    

                 </table>
                 <div className='footer-btn w-100 justify-content-end ' style={{margin:"15px -16px"}}>
                     {openShareDocument && <button className='send' disabled={disableConfirmButton} onClick={shareDocumentFun}>Share with selected</button>}
                     {closeCabinetShareModal && <button className='send' onClick={onClickSharedFiles}>Share selected files</button> } 
                     {shareWithModal && <button className='send'  disabled={disableConfirmButton} onClick={confirmAndShareFun} >Confirm & Share</button>}
                 </div>
             </Modal>
         </div>  
     </>
    )
}