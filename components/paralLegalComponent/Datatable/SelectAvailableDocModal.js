import { Modal } from "react-bootstrap";
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { $Service_Url } from "../../../components/network/UrlPath";
import { globalContext } from "../../../pages/_app"
import { useLoader } from '../../../component/utils/utils';
import { SET_LOADER } from "../../../components/Store/Actions/action"
import { connect } from 'react-redux';
import { getApiCall2 ,getApiCall,postApiCall,getSMSNotificationPermissions,postApiCallNew} from '../../../components/Reusable/ReusableCom'

function SelectAvailableDocModal({showSelectAvailableDocModal, dispatchloader, setShowSelectAvailableDocModal,selectedDocument,setSelectedDocument})
{
    const[documentsList,setDocumentsList]=useState([])
    const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
    const closeModalFun=()=>{
        setShowSelectAvailableDocModal(null)
        setSelectedDocument([])
    }
    useEffect(()=>{
        getAvailableDocumentsList()
        setSelectedDocument([])
    },[])

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }

   async function getAvailableDocumentsList(){
    dispatchloader(true) 
        try{
            let response = await fetch($Service_Url.getAvailableDocuments)
            dispatchloader(false) 
            // console.log("12323response",response)
            response=await response.json()
            if(response?.list_of_documents.length>0){
                const mapTrue=response?.list_of_documents.map(data=>({...data,isChecked:true}))
                const getValue=response?.list_of_documents.map((data)=>{return (data.value)})
                setDocumentsList(mapTrue)
                setSelectedDocument(getValue)
            }
        }catch(err){
            dispatchloader(false)
            konsole.log(err)
        }   
    }

    function onClickProceed(){
        if(selectedDocument.length==0){
            toasterAlert("warning", `Kindly select atleast one available document`);
            return
        }
        setShowSelectAvailableDocModal(false)
    }

    function handleChekbox(event){
        const isChecked=event.target.checked;
        const eventValue=event.target.value;
            setSelectedDocument(prev=>{
                if(isChecked){
                    return ([...prev,eventValue])
                }else{
                    return prev.filter(value=>value!=eventValue)
                }     
            })
            const updateDocumentCheck=documentsList.map((data)=>{
                if(data?.value==eventValue){return ({...data,isChecked})}
                return data
            })
            setDocumentsList(updateDocumentCheck)
    }

    return(
        <>
            <Modal show={showSelectAvailableDocModal} centered animation="false" className="documentListModal">
            <Modal.Header className={`newFileCabinteModalHeaderBackground justify-content-between`}> 
                    <span className='newFileCabinetFileModalheader'>Select Available Documents </span>
                    <button type="button" className=" filePrieviewClosebuttonStyle closeButt2" > <img src="/icons/filePrieviewClosebutton.svg" className='viewFileImage mt-0' onClick={closeModalFun}/></button>
            </Modal.Header>
            <Modal.Body className="pb-5 pt-4 documentListModalBody">
                    <div>
                        {documentsList?.length>0 && documentsList?.map((data)=>{return(
                                <p className="d-flex align-items-center">
                                    <input type="checkbox" checked={data?.isChecked} value={data?.value} onChange={handleChekbox}/>
                                    <span>{data?.label}</span>
                            </p>
                            )})
                        }
                    </div>
            </Modal.Body>
            <Modal.Footer >
            <div className='footer-btn w-100 justify-content-end border-0 d-flex' >
                <button className='send mx-3' onClick={onClickProceed}>Proceed</button>
                <button className='send' onClick={closeModalFun}>Close</button>
            </div>
            </Modal.Footer>
            </Modal>
        {/* </div> */}
        </>
    )
}
const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectAvailableDocModal);

