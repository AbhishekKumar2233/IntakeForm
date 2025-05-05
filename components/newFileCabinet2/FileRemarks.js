
import React, { useEffect, useState, useContext } from 'react'
import { Button, Modal, Form, Table } from "react-bootstrap";
import { Services } from '../network/Service';
import konsole from '../control/Konsole';
import { $AHelper } from '../control/AHelper';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from 'react-redux';
import { globalContext } from '../../pages/_app';
import withOccurrenceApi from '../OccurrenceHoc/withOccurrenceApi';
import { _fileRemarksOccurrenceId, isNotValidNullUndefile, postApiCall } from '../Reusable/ReusableCom';
import OccurrenceModal from '../OccurrenceHoc/OccurrenceModal';
import useUserIdHook from '../Reusable/useUserIdHook';
import { createSentEmailJsonForOccurrene, createSentTextJsonForOccurrene } from '../control/Constant';
import AlertToaster from '../control/AlertToaster';
import { $Service_Url } from '../network/UrlPath';
import { paralegalAttoryId } from '../control/Constant';
import { demo } from '../control/Constant';

const objRem = () => {
    return { userId: '', fileCategoryId: '', fileTypeId: '', fileId: '', remarks: '', createdBy: '', updatedBy: '', fileRemarkId: '' }
}
const FileRemarks = ({ isRemarksOpen, setIsRemarksOpen, openFileInfo, textTmpObj, emailTmpObj, commChannelId, sentMail, dispatchloader,fileCabinetDesign }) => {
    let { setdata } = useContext(globalContext)
    const { _subtenantId, _loggedInUserId, _primaryMemberUserId, _userLoggedInDetail, _userDetailOfPrimary, _subtenantName, _loggedInRoleId } = useUserIdHook();

    let primaryUserId = sessionStorage.getItem('SessPrimaryUserId')
    let loggedInUserId = sessionStorage.getItem('loggedUserId')
    // define state-----------------------------------------------------------------------------------------------------------------------------------------------------------
    const [manageRemarksInfo, setManageRemarksInfo] = useState({ ...objRem(), userId: primaryUserId, updatedBy: loggedInUserId, createdBy: loggedInUserId })
    const [remarksList, setRemarksList] = useState([])
    const [showOccurrencePreview, setShowOccurrencePreview] = useState(false);
    const [remarksForOccurrence, setRemarksForOccurrence] = useState('')
    const [isHoveringCancel, setIsHoveringCancel] = useState(false);
    const [expandedRows, setExpandedRows] = useState({});
    // define useEffect--------------------------------------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        let { fileCategoryId, fileId, fileTypeId } = openFileInfo
        setManageRemarksInfo({ ...manageRemarksInfo, fileCategoryId: Number(fileCategoryId), fileTypeId: Number(fileTypeId), fileId: Number(fileId) })
        // let jsonObj = { userId: primaryUserId, fileCategoryId: fileCategoryId, fileTypeId: fileTypeId, fileId: fileId, remarks: '', createdBy: loggedInUserId, }
        let jsonObj = { userId: primaryUserId, fileCategoryId: fileCategoryId, fileTypeId: fileTypeId, fileId: fileId, remarks: '', }
        apiGetFileCabinetRemarks('GET', jsonObj)
    }, [])


    //  function use for get update and add info-------------------------------------------------------------------------------------------------------------------------------
    const apiGetFileCabinetRemarks = (method, jsonObj) => {
        konsole.log('apiGetFileCabinetRemarks', method, jsonObj)
        // debugger;
        dispatchloader(true);
        Services.postGetAddUpdateFileRemarks(method, jsonObj).then((res) => {
            konsole.log('res of remarks', res)
            let responseData = res.data.data;
            if (responseData.fileCabinets.length > 0) {
                const fileCabinets = responseData.fileCabinets[0].fileTypes[0].fileRemarks;
                if (method === 'GET') {
                    setRemarksList(fileCabinets);
                } else if (method === 'PUT') {
                    const filterInfo = remarksList.filter(item => item.fileRemarkId !== jsonObj.fileRemarkId);
                    filterInfo.push(fileCabinets[0]);
                    setRemarksForOccurrence(fileCabinets[0].fileRemark);
                    setRemarksList(filterInfo);
                    handleShowOccurrence(true);
                    AlertToaster.success("Remarks updated successfully.")
                } else {
                    setRemarksForOccurrence(fileCabinets[0].fileRemark);
                    setRemarksList(prevRemarks => [...prevRemarks, fileCabinets[0]]);
                    AlertToaster.success("Remarks saved successfully.")
                    handleShowOccurrence(true);
                }
                const { fileCategoryId, fileId, fileTypeId } = openFileInfo;
                setManageRemarksInfo(prev => ({ ...prev, fileRemarkId: '', remarks: '', fileCategoryId: Number(fileCategoryId), fileTypeId: Number(fileTypeId), fileId: Number(fileId) }));
            }
            dispatchloader(false);

        }).catch((err) => konsole.log('err in getting remarks', err))
    }

    //  this is  select row for updating info 
    const handleUpdateClick = (item) => {
        konsole.log('item', item)
        let { fileCategoryId, fileId, fileTypeId } = openFileInfo
        setManageRemarksInfo(prev => ({
            ...prev, fileRemarkId: item?.fileRemarkId, remarks: item.fileRemark, fileCategoryId: Number(fileCategoryId), fileTypeId: Number(fileTypeId), fileId: Number(fileId)
        }))
    }
    // save Info-------------------------------------------------------------------------------------------------------------------------------------
    const saveInfo = () => {
        if (manageRemarksInfo.remarks == '' || manageRemarksInfo.remarks == undefined) {
            setdata({ open: true, text: "Remarks can't be blank", type: "Warning" });
            return;
        }
        let method = (manageRemarksInfo.fileRemarkId !== '') ? 'PUT' : 'POST'
        apiGetFileCabinetRemarks(method, manageRemarksInfo)
    }



    const handleShowOccurrence = (value) => {
        // console.log("_loggedInRoleId", _loggedInRoleId)
        if (!paralegalAttoryId.includes(_loggedInRoleId)) {
            setShowOccurrencePreview(value);
        }
    }
    // Content Replace===============================================

    const replaceTemplate = (temp) => {
        let TemplateContent = temp;
        const mobileNo=_userDetailOfPrimary?.userMob ?  _userDetailOfPrimary?.userMob :"Not available.";
        const documentsName= openFileInfo?.fileTypeName ? openFileInfo?.fileTypeName :openFileInfo?.userFileName;
        TemplateContent = TemplateContent.replace("@@SUBTENANTNAME", _subtenantName);
        TemplateContent = TemplateContent.replace("@@REMARKS", remarksForOccurrence);
        TemplateContent = TemplateContent.replace("@@CLIENTNAME", _userDetailOfPrimary?.memberName);
        TemplateContent = TemplateContent.replace("@@CLEINTEMAIL", _userDetailOfPrimary?.primaryEmailId);
        TemplateContent = TemplateContent.replace("@@CLIENTMOBILE",mobileNo);
        TemplateContent = TemplateContent.replace("@@DOCUMENTNAME", documentsName);

        return TemplateContent;
    }

    const senttextNMail = async () => {
        const { textTemplateType, textTemplateId } = textTmpObj.textTempData[0]
        const { templateType, emailSubject, templateId } = emailTmpObj?.emailTempData[0];

        const emailToArray = [
            'shreyasinha@agingoptions.com',
            'indrajeet.bind@agingoptions.com',
            'deepaks@agingoptions.com',
            'nitin.kumar@agingoptions.com'
        ];

        const emailToArrayProd=[
            'priorityclient@lifepointlaw.com',
            'gphillips@lifepointlaw.com'
        ]
        const emailTo = (demo == false && _subtenantId == 742) ?emailToArrayProd.join(',') : emailToArray.join(',');
        const textTo = '';
        const emailJson = createSentEmailJsonForOccurrene({
            emailType: templateType,
            emailTo: emailTo,
            emailSubject,
            emailContent: replaceTemplate(emailTmpObj.emailTemp),
            emailTemplateId: templateId,
            emailMappingTablePKId: _primaryMemberUserId,
            createdBy: _loggedInUserId
        })
        const textJson = createSentTextJsonForOccurrene({
            smsType: textTemplateType,
            textTo: textTo,
            textContent: replaceTemplate(textTmpObj.textTemp),
            smsTemplateId: textTemplateId,
            smsMappingTablePKId: _primaryMemberUserId,
            createdBy: _loggedInUserId
        })


        konsole.log("JsonObj", emailJson, textJson)
        const _resultSentEmailtext = await sentMail(emailJson, textJson);
        if (_resultSentEmailtext == 'resolve') {
            dispatchloader(true);
            const message = `Email ${commChannelId == 3 ? "and Text " : ''}Sent Successfully.`;
            AlertToaster.success(message);
            dispatchloader(false)
            handleShowOccurrence(false);

        }
    }
    // Content Replace===============================================
    // konsole --------------------------------------------------------------------------
    konsole.log('remarksList', remarksList)
    konsole.log('manageRemarksInfo', manageRemarksInfo)
    // konsole --------------------------------------------------------------------------

    const handleSeeMoreClick = (index) => {
        setExpandedRows((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };  

    return (
        <> <style jsx global>{`.modal-open .modal-backdrop.show {  opacity: 0.5 !important;}`}</style>
            <div className='FileRemarksBackDrop' id="FileRemarks">
            <Modal enforceFocus={false} show={isRemarksOpen} centered onHide={() => setIsRemarksOpen(false)} animation="false" id="remarksId-newFileCabinet-FileRemaks" backdrop="static" dialogClassName="left-side-modal">
                    <Modal.Header 
                    className={`${(fileCabinetDesign=="new")?"newFileCabinteModalHeaderBackground":"oldFileViewerModalStyle"}`} 
                    >
                    {fileCabinetDesign=="new"?
                    <>
                        <span className='newFileCabinetFileModalheader'>Remarks</span> 
                        <button type="button" className=" filePrieviewClosebuttonStyle" onClick={() => setIsRemarksOpen(false)}> <img src="/icons/filePrieviewClosebutton.svg" className='viewFileImage mt-0'/></button>    
                    </>
                    :
                    <>
                     <span className='actionTypeStyling'>Remarks</span> 
                     <button type="button" className=" btn border-0 bg-transparent" onClick={() => setIsRemarksOpen(false)}> <img src="./icons/crossIcon.svg" className='viewFileImage mt-0'/></button>  
                    </>
                    }
                    </Modal.Header>
                    {!paralegalAttoryId.includes(_loggedInRoleId) &&
                        <Modal.Body 
                        className={`${(fileCabinetDesign=="new")?" ":"pb-5 pt-4"}`}
                        >
                            <>
                                {showOccurrencePreview &&
                                    <OccurrenceModal
                                        textObj={replaceTemplate(textTmpObj?.textTemp)}
                                        emailObj={replaceTemplate(emailTmpObj?.emailTemp)}
                                        commChannelId={commChannelId}
                                        show={showOccurrencePreview}
                                        onHide={handleShowOccurrence}
                                        sentMail={senttextNMail}
                                        isClientPermissions={true}

                                    />
                                }
                                <div className="m-2">
                                    <h3 
                                    className={`${(fileCabinetDesign=="new")?"describeHeaderInRemarks":""}`} >Describe</h3>
                                    <Form.Control className="mt-2 commentTextAreaRemarks" as="textarea" rows={5} placeholder='Your Comment' value={manageRemarksInfo?.remarks} onChange={(e) => setManageRemarksInfo({ ...manageRemarksInfo, remarks: e.target.value })} />
                                </div>
                            </>
                        </Modal.Body>
                    }
                    <Modal.Footer className="border-0">
                        {!paralegalAttoryId.includes(_loggedInRoleId) && <>
                            <Button className="theme-btn-InRemarks styled-btn styled-btn-Cancel" onMouseEnter={() => setIsHoveringCancel(true)} onMouseLeave={() => setIsHoveringCancel(false)} onClick={() => setIsRemarksOpen(false)}> Cancel</Button>
                            <Button className={`theme-btn-InRemarks styled-btn styled-btn-Submit ${isHoveringCancel ? 'styled-btn-Submit-hover' : ''}`} onClick={() => saveInfo()}>Submit</Button>
                        </>}
                        <div className="bg-light  w-100">
                            <div className='scroll-InRemarks' style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                                <div className="table-responsive-InRemarks">
                                    <Table bordered className="text-center" size="sm">
                                        {remarksList.length > 0 && <>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th className="text-start w-50">Remarks</th>
                                                    <th>Date</th>
                                                    {!paralegalAttoryId.includes(_loggedInRoleId) && <th className="">Action</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {remarksList.map((item, index) => {
                                                    return (
                                                        <tr className="cursor-pointer" key={index} >
                                                            <td>{index + 1}</td>
                                                            {/* <td className="text-start w-50">{item.fileRemark}</td> */}
                                                            <td className="text-start w-50">
                                                                {item.fileRemark.length > 100 ? (
                                                                    <>
                                                                        <div className={`truncate-text ${expandedRows[index] ? 'expanded' : ''}`}>
                                                                            {item.fileRemark}
                                                                        </div>
                                                                        <button className="see-more-btn" onClick={() => handleSeeMoreClick(index)}>
                                                                            {expandedRows[index] ? 'See less' : 'See more'}
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <div className="truncate-text">
                                                                        {item.fileRemark}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className='text-center'>{$AHelper.getFormattedDate(item.createdOn)}</td>
                                                            {!paralegalAttoryId.includes(_loggedInRoleId) && <td> <a onClick={() => handleUpdateClick(item)} >Edit</a></td>}
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </>}
                                        {remarksList?.length == 0 && <p className='fw-bold'>No remarks available.</p>}
                                    </Table>
                                </div>
                            </div>
                        </div>
                        {paralegalAttoryId.includes(_loggedInRoleId) && <>   <Button className="theme-btn mt-4" onClick={() => setIsRemarksOpen(false)} > Cancel</Button></>}
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}


export default withOccurrenceApi(FileRemarks, _fileRemarksOccurrenceId, 'FileRemarks');
