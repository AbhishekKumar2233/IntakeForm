import React, { useEffect, useMemo, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Document, Page, pdfjs } from "react-pdf";
import konsole from '../../../components/control/Konsole';
import { useLoader } from '../../utils/utils';
import { $ApiHelper } from '../../Helper/$ApiHelper';
import { useAppDispatch, useAppSelector } from '../../Hooks/useRedux';
import { selectfile, selectorFinance } from '../../Redux/Store/selectors';
import { $AHelper } from '../../Helper/$AHelper';
import { updateUploadDocumentInformation } from '../../Redux/Reducers/fileSlice';
import { Table } from 'react-bootstrap';
import { $Service_Url } from '../../../components/network/UrlPath';
import { getApiCall2 } from '../../../components/Reusable/ReusableCom';
import { fetchBeneficiaryList } from '../../Redux/Reducers/financeSlice';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';

const UploadedFileView = (props) => {
    const { fileId, isOpen, handleViewFileInfo, fileDetails, refrencePage, beneficiaryData,onViewEditClick,item } = props;
    // console.log("uploadFileVewprops",props)
    const dispatch = useAppDispatch()
    const fileApi = useAppSelector(selectfile)
    let { uploadedDocumentInformation } = fileApi
    // @@ define state
    const [numPages, setNumPages] = useState(null);
    const financeData = useAppSelector(selectorFinance);
    const { beneficiaryList } = financeData;
    const [beneficiariesWithDetails, setBeneficiariesWithDetails] = useState([]);
    const { primaryUserId,spouseUserId,isPrimaryMemberMaritalStatus, _spousePartner} = usePrimaryUserId()
    const assetOwnersDetailsJson = (item?.assetOwners ?? [])
     const ownerSelected = useMemo(() => {
            if (!assetOwnersDetailsJson || !Array.isArray(assetOwnersDetailsJson)) return '';
            const activeOwner = assetOwnersDetailsJson.find((e) => e.isActive == true);
            return activeOwner ? activeOwner.ownerUserId : '';
          }, [assetOwnersDetailsJson]);

    useEffect(() => {
        fetchUploadedDocumentData();
        return () => setNumPages(null);
    }, [])
 
    useEffect(() => {
         fetchApi();
      }, [dispatch]);

    useEffect(() => {
        if (beneficiaryData?.length) {
            const fetchBeneficiaryDetails = async () => {
                const updatedBeneficiaries = await Promise.all(
                    beneficiaryData?.map(async (item) => {
                        let address = await userAddressDataById(item?.beneficiaryUserId);
                        let contact = await userContactDataById(item?.beneficiaryUserId);
                        return { ...item, address, contact };
                    })
                );
                setBeneficiariesWithDetails(updatedBeneficiaries);
            };
            fetchBeneficiaryDetails();
        }
    }, [beneficiaryData]);

    const fetchApi = async () => {
        try {
            const userDetailOfPrimary = JSON.parse(sessionStorage?.getItem('userDetailOfPrimary'));
            useLoader(true);
            await dispatch(fetchBeneficiaryList({
                userId: primaryUserId,
                spouseUserId: isPrimaryMemberMaritalStatus ? spouseUserId : undefined,
                userDetailOfPrimary: userDetailOfPrimary
            }));
            useLoader(false)
        } catch (error) {
            konsole.log(error,"FailedDataResponse")
        }
    };   

    const userAddressDataById = async (userID) => {
        useLoader(true)
        try{
              const _resultOf = await getApiCall2('GET', $Service_Url.getAllAddress + userID, '')
              useLoader(false)
              return _resultOf.data.data?.addresses?.[0]
        }catch(error){
            useLoader(false)
            return null
        }
        }

        const userContactDataById = async (userID) => {
            useLoader(true)
            try{
                  const _resultOf = await getApiCall2('GET', $Service_Url.getcontactdeailswithOther + userID, '')
                  konsole.log(_resultOf,"_resultOf_resultOf")
                  useLoader(false)
                  return _resultOf.data.data?.contact
              
            }catch(error){
                useLoader(false)
                return null
            }};
    
    const fetchUploadedDocumentData = async () => {
        if  (!fileId) {
            konsole.error("Invalid fileId");
            return;
        }
    
        let updateFileInformation = uploadedDocumentInformation;
        if (!$AHelper.$isNotNullUndefine(updateFileInformation[fileId])) {
            useLoader(true)
            const _resultOf = await $ApiHelper.$getUploadedDocumentByFileId({ fileId: fileId })
            useLoader(false)
            konsole.log("_resultOfuploadeddocument", _resultOf);
            if (_resultOf != 'err') {
                if (!updateFileInformation || !Object.isExtensible(updateFileInformation)) {
                    updateFileInformation = { ...uploadedDocumentInformation }
                }
                updateFileInformation[fileId] = _resultOf;
                dispatch(updateUploadDocumentInformation(updateFileInformation))
            }
        }

    }


    // @@ return base 64
    const base64Data = useMemo(() => {
        let valueOfFile = uploadedDocumentInformation[fileId]

        if (valueOfFile) {
            let base64 = 'data:application/pdf;base64,' + valueOfFile?.fileInfo?.fileDataToByteArray;
            return base64;
        }
        return '';
    }, [uploadedDocumentInformation]);

    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <>
            <style jsx global>{`.modal-open .modal-backdrop.show {  opacity: 0.5 !important;}`}</style>

            <Modal id={numPages ? '' : 'fileViewerModal-newFileCabinet'} className='fileViewerModal' show={isOpen}
                onHide={() => handleViewFileInfo('')} enforceFocus={false}
                size="lg" fullscreen='lg-down' backdrop="static" >
                <Modal.Header className={`newFileCabinteModalHeaderBackground`}>
                    <>
                        <span className='newFileCabinetFileModalheader'>{fileDetails?.name}</span>
                        <button type="button" className=" filePrieviewClosebuttonStyle" > <img src="/icons/filePrieviewClosebutton.svg" className='viewFileImage mt-0' onClick={() => handleViewFileInfo('')} /></button>
                    </>
                </Modal.Header>
                <Modal.Body className="rounded">
                  {/* <div className='row justify-content-between modalBodyFileView'>
                        <div className='col-12 p-0'>
                            {props?.itemList ? <div className="d-flex flex-wrap col-12">{props?.itemList.map((e, index) => (
                            <div className="col-4" key={index}>{Object.entries(e).map(([key, value]) => (
                                <div key={key} className={`col-12 d-flex flex-wrap ${props.itemList.length - 1 == index ? 'border-none' : 'border-end'} border-black px-2`} style={{fontSize:'14px'}} >
                                <p className='w-100'><span className="fw-bold">{key}:</span> {value}</p>
                                </div>))}
                            </div>))}
                        </div> :<p className='fileStatusStyle'>Status: <span>{'Current'}</span></p>}
                        </div>
                    </div> */}

                    <div className='row justify-content-between modalBodyFileView'>
                        <div className='col-12 p-0'>
                            {props?.itemList ? <div className="d-flex flex-wrap col-12">{props?.itemList?.map((e, index) => (
                                $AHelper.$isNullUndefine(e) ? '' : 
                            <div className="col-4" key={index}>{Object.entries(e).map(([key, value]) => (
                                <div key={key} className={`col-12 d-flex px-2`} style={{fontSize:'14px'}} >
                                <p className='w-100 spacingBottom'>
                                <span className="fw-bold">{key}:</span> {value}</p>
                                {(index + 1) % 3 == 0 ? "" : <div style={{marginLeft:"5px"}} className={`vr`}></div>}
                                </div>))}
                                
                            </div>))}
                        </div> :<p className='fileStatusStyle'>Status: <span>{'Current'}</span></p>}
                        </div>
                    </div>

                    {fileDetails?.name == 'Retirement' || fileDetails?.name == 'Non-Retirement' ? <h3 className='charityB'>Beneficiary Details:</h3> : ""}

                    {fileDetails?.name === 'Retirement' || fileDetails?.name === 'Non-Retirement' ? (
                        <div className="table-responsive financialInformationTable">
                            <Table bordered className="">
                                <thead>
                                    <tr>
                                        <th className='align-middle text-center'>Beneficiary/Charity Name</th>
                                        <th className='align-middle text-center'>Relationship & Contact/Address Information</th>
                                        <th className='align-middle text-center'>Percentage</th>
                                        <th className='align-middle text-center'>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {beneficiariesWithDetails?.map((item, index) => {
                                        konsole.log(beneficiariesWithDetails,"beneficiariesWithDetails")
                                        
                                         const addressData = item.address ? item.address.addressLine1 : "" ;
                                        const Contact = item.contact?.mobiles?.length > 0 ? $AHelper.$formatNumber(item.contact.mobiles[0]?.mobileNo) : '';
                                        const email = item.contact?.emails?.length > 0 ? " / " + item.contact.emails[0]?.emailId : '';

                                        return (
                                            <tr key={index}>
                                                <td className='align-middle text-center'>{item?.beneficiaryUserName}</td>
                                                <td className='align-middle text-center'>{item.isCharity == false ? 
                                                 (ownerSelected?.toLowerCase() == spouseUserId ? beneficiaryList?.find((ben) => ben?.value == item?.beneficiaryUserId)?.relationWithSpouse : beneficiaryList?.find((ben) => ben?.value == item?.beneficiaryUserId)?.relationWithUser) || (item?.beneficiaryUserId == primaryUserId ? 'Primary User' : item?.beneficiaryUserId == spouseUserId ? _spousePartner : <p className='text-center'>-</p>
                                                  ) : (
                                                  (Contact || email || addressData) ? ( <div className='centerShowData'>
                                                  {addressData && <div className='_dottedAdress'>{addressData}</div>}
                                                  {(Contact || email) && <div>{Contact} {email}</div>} 
                                                    </div>) : <p className='text-center'>-</p>)}</td>
                                                <td className='align-middle text-center'>{item.beneficiaryPer ? `${item.beneficiaryPer}%` : <p className='text-center'>-</p>}</td>
                                                <td className='align-middle text-center'>{item.isCharity == true ? "Charity" : "Family / Non-family"}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    ) : ""}

                   {(!$AHelper.$isNotNullUndefine(fileId) || fileId == "0" ) &&
                        fileDetails?.name !== 'Medication & Supplements' && 
                        fileDetails?.name !== 'Real Estate' && 
                        fileDetails?.name !== 'Liabilities' && 
                        refrencePage !== 'Professional' &&
                         (
                           <div className="d-flex gap-1 docNotProvided mt-3 mb-2 ps-2">
                                <h4>Document:</h4>
                                <p>Not Provided</p>
                        </div>)}

                    {/* @@ PDF */}
                   { $AHelper.$isNotNullUndefine(fileId) && fileId != "0" && <div className='borderAroundDocument'>
                        <Document className="outer-doc" file={base64Data} onLoadSuccess={onDocumentLoadSuccess} onContextMenu={(e) => e.preventDefault()}>
                            {Array.from(new Array(numPages), (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    customTextRenderer={false}
                                    scale={96 / 72}
                                />
                            ))}
                        </Document>
                    </div>}
                </Modal.Body>
            </Modal>
        </>
    )
}

export default UploadedFileView;