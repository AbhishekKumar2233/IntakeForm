import React, { useState, useContext } from 'react'
import { Row, Col } from 'react-bootstrap'
import AddCategoryFolder from './AddCategoryFolder'
// import AddCabinet from './AddCabinet'
import { FileCabinetContext } from './ParentCabinet'
import FolderStructure from './FolderStructure'
import { $AHelper } from '../control/AHelper.js';
import AddFile from './AddFile'
import konsole from '../control/Konsole'
import { paralegalAttoryId } from '../control/Constant'

const ManageAllFile = ({functionAfterAddingAnyFolder, apiCallUpsertMainCabinet, callApiCabinetCategory, callApiCabinetFolder,functionForGetFileAfterAddEditFile }) => {
    const { showScreenType, allMainCabinetContainer, setManageShowFileType, manageShowFileType } = useContext(FileCabinetContext)
    const subtenantId = sessionStorage.getItem("SubtenantId");
    const stateObj = $AHelper.getObjFromStorage("stateObj");
    // define state-----------------------------------------------------------
    // const [manageShowFileType, setManageShowFileType] = useState('')
    konsole.log('allMainCabinetContainerallMainCabinetContainer', allMainCabinetContainer)
    return (
        <>
            <Row>
                <Col md='12' lg='12' className='folderstructure'>
                    {showScreenType == 'showManageFileCabinetScreen' ? <>
                        <Row>
                            <Col className='mt-1'>
                                <div className='d-flex'>
                                    <h6>Add New:</h6>
                                    <div className='d-flex'>
                                        {paralegalAttoryId.includes(stateObj.roleId) && <>  <h6 className={`${manageShowFileType == "Cabinet" ? "filetool-text-tag-h6-2" : "folder-text-class"} mx-3 `} onClick={() => setManageShowFileType('Cabinet')} >Cabinet </h6>|
                                            <h6 className={`${manageShowFileType == "Category" ? "filetool-text-tag-h6-2" : "folder-text-class"} mx-3 `} onClick={() => setManageShowFileType('Category')} ></h6> | </>}
                                        <h6 className={`${manageShowFileType == "Folder" ? "filetool-text-tag-h6-2" : "folder-text-class"} mx-3 `} onClick={() => setManageShowFileType('Folder')} >Folder</h6>
                                        {/* <h6 className={`${manageShowFileType == "File" ? "filetool-text-tag-h6-2" : "folder-text-class"} mx-3 `} onClick={() => setManageShowFileType('File')} >File</h6> */}
                                    </div>
                                </div>

                            </Col>

                            <hr />
                        </Row></> : ""}

                    {(manageShowFileType == 'Category' || manageShowFileType == 'Folder') ?
                        <AddCategoryFolder
                            callApiCabinetCategory={callApiCabinetCategory}
                            callApiCabinetFolder={callApiCabinetFolder}
                            manageShowFileType={manageShowFileType}
                            setManageShowFileType={setManageShowFileType}
                            actionType='ADD'
                            refrencePage="ManageAllFile"
                            uniqueref='FILE'
                            key={showScreenType}
                            functionAfterAddingAnyFolder={functionAfterAddingAnyFolder}
                        /> : (manageShowFileType == 'File') ? <AddFile actionType='ADD' key={showScreenType} refrencePage="ManageAllFile" setManageShowFileType={setManageShowFileType} functionForGetFileAfterAddEditFile={functionForGetFileAfterAddEditFile} /> : ''
                    }

                    <Row className='d-flex justify-content-center'>
                        {(allMainCabinetContainer.length > 0) &&
                            <FolderStructure
                                callApiCabinetFolder={callApiCabinetFolder}
                                callApiCabinetCategory={callApiCabinetCategory}
                                setManageShowFileTypeFromManageFile={setManageShowFileType}
                                key={showScreenType}
                                functionForGetFileAfterAddEditFile={functionForGetFileAfterAddEditFile}
                                functionAfterAddingAnyFolder={functionAfterAddingAnyFolder}
                            />}
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default ManageAllFile