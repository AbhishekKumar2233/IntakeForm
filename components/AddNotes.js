import React, { useState,useEffect,useContext,useMemo} from 'react'
import konsole from '../components/control/Konsole';
import { getApiCall,getApiCall2, isNotValidNullUndefile,postApiCall} from "./Reusable/ReusableCom";
import { Col, Form, Row, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import useUserIdHook from './Reusable/useUserIdHook';
import { useAppDispatch,useAppSelector } from '../component/Hooks/useRedux';
import AlertToaster from './control/AlertToaster';
import { $Service_Url,Api_Url} from "./network/UrlPath";
import { connect } from 'react-redux';
import { globalContext } from '../pages/_app';
import { SET_LOADER } from "./Store/Actions/action";
import { selectApi } from '../component/Redux/Store/selectors';
import { fetchNoteCatagory } from '../component/Redux/Reducers/apiSlice';
import { $AHelper } from '../component/Helper/$AHelper';


const AddNotes = (props) => {
    const {pageCategoryId,pageTypeId,pageSubTypeId,setWarning,newConfirm} = useContext(globalContext)
    const [showNotes, setShowModal] = useState(false)
    const [isRecording1, setIsRecording1] = useState(false);
    const [isRecording2, setIsRecording2] = useState(false);
    const [textValue, setTextValue] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setfilteredNotes] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [query, setquery] = useState("");
    const [noteTittle, setNoteTittle] = useState('')
    const [deleteJsonData, setDeleteJsonData] = useState()
    const [isLoaderActive, setIsLoaderActive] = useState(false)
    const [activeBtn, setActiveBtn] = useState("all");
    const { _subtenantId, _loggedInUserId, _primaryMemberUserId,_subtenantName } = useUserIdHook();
    const apiData = useAppSelector(selectApi);
    const dispatch = useAppDispatch();
    const [pageCatagoryType, setpageCatagoryType] = useState('')
    const [editData, setEditData] = useState()
    const {pageCatagoryData} = apiData


    useEffect(() => {
        getUserNotes()
        fetchApi();
    }, [pageCategoryId,pageTypeId,pageSubTypeId])
    useEffect(() => {
     
     if($AHelper?.$isNotNullUndefine(pageCatagoryData)){
        const filtererdCatagoryList = pageCatagoryData?.filter((ele)=> ele?.pageCatId == pageCategoryId)
        if(filtererdCatagoryList.length > 0){
            setpageCatagoryType(filtererdCatagoryList[0])
        }       
        }
    }, [pageCatagoryData])
     
        const getUserNotes = async()=>{
        setIsLoaderActive(true) 
        let url = $Service_Url.getUserNotes + `?PageCategoryId=${pageCategoryId}` +
        (isNotValidNullUndefile(pageTypeId) ? `&pageTypeId=${pageTypeId}` : '') +
        (isNotValidNullUndefile(pageSubTypeId) ? `&pageSubTypeId=${pageSubTypeId}` : '') +
        `&PrimaryUserId=${_primaryMemberUserId}`;
            setIsLoaderActive(false) 
        let userData = await getApiCall2("GET",url) 
        setNotes(userData?.data?.data?.userNotes);
        setfilteredNotes(userData?.data?.data?.userNotes) 
        handleActiveTabButton(activeBtn,userData?.data?.data?.userNotes)
       
     }
     const  fetchApi =()=>{
          if(pageCatagoryData.length == 0){
            apiCallIfNeed(pageCatagoryData, fetchNoteCatagory());
          }
    
     }
     const apiCallIfNeed = (data, action) => {
        if (data.length > 0) return;
        dispatch(action)
      }
    
  
    const openModal = () => {
      setModalOpen(!modalOpen);
      setEditData()
    };
  
    const closeModal = () => {
      setModalOpen(false);
      setEditData()
      setNoteText('');
      setNoteTittle('')
      setActiveBtn("all")
    };
  
    const addNote = async(isState,data) => {
       const isEdit = $AHelper?.$isNotNullUndefine(editData)
       if(handleDisabled() == true){
        closeModal()
          return;
       }
        if(isState == "addUpdateStar"){
           
            const input = {
                "primaryUserId": _primaryMemberUserId,
                "attorneyUserId": _loggedInUserId,
                "upsertedBy": _loggedInUserId,
                "notes": [
                  {
                    "userNoteId": data?.userNoteId,
                    "pageCategoryId": data?.pageCategoryId,
                    "pageTypeId": pageTypeId,
                    "pageSubTypeId": pageSubTypeId,
                    "notes": data?.notes,
                    "isStar":data?.isStar,
                    "notesHeading": data?.notesHeading,
                    "isActive": true
                  }
                ]
              }
          
              setIsLoaderActive(true) 
            let updatePasswordApi = await postApiCall("POST",$Service_Url?.postUserNotes,input) 
            setIsLoaderActive(false) 
            await getUserNotes()
           

        }else{
        let note ;
        let noteTittles;
        if(typeof noteText !== 'string'){
            note = noteText.join(',');
        }else{
            note = noteText;
        }
        if(typeof noteTittle !== 'string'){
            noteTittles = noteTittle.join(',');
        }else{
            noteTittles = noteTittle;
        }
     
      if (note?.trim() !== '' && noteTittles.trim() !== '' && noteTittles.length <= 50 && note.length <= 500) {
        const input = {
            "primaryUserId": _primaryMemberUserId,
            "attorneyUserId": _loggedInUserId,
            "upsertedBy": _loggedInUserId,
            "notes": [
              {
                "userNoteId": isEdit == true ? editData?.userNoteId : 0,
                "pageCategoryId": pageCategoryId,
                "pageTypeId": pageTypeId,
                "pageSubTypeId": pageSubTypeId,
                "notes": note,
                "isStar": isEdit == true ? editData?.isStar : null,
                "notesHeading": noteTittles,
                "isActive": true
              }
            ]
          }
      
          setIsLoaderActive(true) 
        let updatePasswordApi = await postApiCall("POST",$Service_Url?.postUserNotes,input) 
        setIsLoaderActive(false) 
        toasterAlert("successfully", `Successfully ${isEdit == true ? "updated " : "saved"} data`, `Your data have been ${isEdit == true ? "updated " : "saved"} successfully`)
        getUserNotes()    
        handleActiveTabButton(activeBtn)
        closeModal();
      }else{
        AlertToaster.warn("Please fill the details.")
      }
        }

    };

    function getRelativeTime(noteAddedDateString) {
        // Normalize the input date string
        if (noteAddedDateString.includes(".")) {
            noteAddedDateString = noteAddedDateString.split(".")[0] + "Z";
        }    
        const noteAddedDate = new Date(noteAddedDateString);
        const now = new Date(); // Local time    
        // Convert to midnight for "Yesterday" logic
        const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterdayMidnight = new Date(todayMidnight.getTime() - 24 * 60 * 60 * 1000);    
        const timeDiff = now.getTime() - noteAddedDate.getTime();
        const secondsDiff = Math.floor(timeDiff / 1000);
        const minutesDiff = Math.floor(secondsDiff / 60);
        const hoursDiff = Math.floor(minutesDiff / 60);    
        if (isNaN(noteAddedDate)) {
            return "Invalid date";
        }    
        if (noteAddedDate >= todayMidnight) {
            if (secondsDiff < 60) {
                return "Just now";
            } else if (minutesDiff < 60) {
                return `${minutesDiff} minutes ago`;
            } else {
                return `${hoursDiff} hours ago`;
            }
        } else if (noteAddedDate >= yesterdayMidnight) {
            return "Yesterday";
        } else {
            const daysDiff = Math.floor(hoursDiff / 24);
            const weeksDiff = Math.floor(daysDiff / 7);
            const monthsDiff = now.getMonth() - noteAddedDate.getMonth() + (12 * (now.getFullYear() - noteAddedDate.getFullYear()));    
            if (daysDiff < 7) {
                return `${daysDiff} days ago`;
            } else if (weeksDiff < 4) {
                return `${weeksDiff} weeks ago`;
            } else if (monthsDiff < 12) {
                return `${monthsDiff} months ago`;
            } else {
                return noteAddedDate.toLocaleDateString();
            }
        }
    }

    //openNotesmodal  function use for open notes modal or close modal
    const openNotesmodal = () => {
        if(notes?.length > 0){
            setShowModal(!showNotes)
            handleActiveTabButton("all")
        }else{
            setModalOpen(!modalOpen)
        }
        
    }

    // handleSpeechRecognition function for recording and setting the value in the text state
    const handleSpeechRecognition = (object,isRecording, setIsRecording) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        if(isRecording == false){
            recognition.onstart = () => {
                setIsRecording(!isRecording);
                if(object === 'object1'){
                    setIsRecording2(false)
                }else{
                    setIsRecording1(false)
                }
            };
          recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript; // Assuming transcript is already a string
                if (object === 'object1') {                 
                      let  listdata = [noteTittle, transcript].flat().filter(Boolean).join(" ").toLowerCase();                  
                      setNoteTittle([listdata]);                
                    setIsRecording1(prevState => !prevState); // Toggles recording state for object1
                } else if (object === 'object2') {
                    let listdata = [noteText, transcript].flat().filter(Boolean).join(" ").toLowerCase();
                  
                    setNoteText([listdata]);
                    setIsRecording2(prevState => !prevState); // Toggles recording state for object2
                }
                setIsRecording(false); // Set isRecording to false after processing
            };
    
            recognition.start();
    
            // Set isRecording to false after 6-7 seconds if the user doesn't speak
            setTimeout(() => {
                if (isRecording) {
                    setIsRecording(false);
                }
            }, 6000); // Adjust the duration as needed

        }else{
            recognition.stop();
            setIsRecording(!isRecording)
            setTimeout(() => {
                if (isRecording) {
                    setIsRecording(false);
                }
            },1); // Adjust the duration as needed

        }
      
    };

    const micOptions = (objectIdentifier, isRecording, setIsRecording) => {
        return (
            <>
                <div className='d-flex justify-content-end m-2'> 
              
                    <OverlayTrigger
                        placement="top"
                        overlay={isRecording ? <Tooltip id="svg-tooltip"style={{ zIndex: "999999999", position: "relative" }}>Speak now</Tooltip> : <Tooltip id="svg-tooltip" style={{ zIndex: "999999999", position: "relative" }}>Start recording</Tooltip>
                    }
                        // trigger="click" // Set the trigger to "click"
                        show={isRecording}
                        // rootClose // Close the tooltip when clicking outside
>
                        {(isRecording === true) ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16" style={{ cursor: "pointer" }} onClick={() =>  handleSpeechRecognition(objectIdentifier,isRecording, setIsRecording)}>
                            <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
                            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
                        </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-mic-mute-fill" viewBox="0 0 16 16" style={{ cursor: 'pointer' }} onClick={() => handleSpeechRecognition(objectIdentifier,isRecording, setIsRecording)}>
                            <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3z" />
                            <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z" />
                        </svg>}
                    </OverlayTrigger>
                </div>
            </>
        );
    };
    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    
      }
      const handleDelete =async(data)=>{
        setDeleteJsonData(data)
        const confirmRes = await newConfirm(true, `Are you sure you want to delete this note? This action cannot be undone.`, "Confirmation", "Delete note");
        if (!confirmRes) return;
        confrimDelete(data)
        }
    const isLoader = ()=>{
        return(
            <>
            <div id='loaderForAMA' >
            <div className="loader-wrapper"style={{ zIndex: 999999999 }}>
                <div className="loaders"></div>
            </div>
        </div>
            </>
        )
    }
    const deleteConfrimation =()=>{
        return (
            <div className="deletemodal"style={{ zIndex: 99999999 }}>
                <div className="deletemodal-content">
                    <div className='d-flex justify-content-between'>
                    <div className='d-flex justify-content-between'> <img src="\images\confirm.png" className='mt-auto mb-auto' width="30px" /><h2 className='mt-auto mb-auto ms-2'>Confirmation</h2></div>
                    <OverlayTrigger placement="top" overlay={<Tooltip id="svg-tooltip" style={{ zIndex: "999999999", position: "relative" }}>Close</Tooltip>}>
                    <button type="button" className="btn-close bt" aria-label="Close"  onClick={()=>setShowDeleteModal(false)}></button>
                    </OverlayTrigger>
                    </div>

                    <p className='ms-5 mt-2'>Are you sure? You want to delete this?</p>
                    <div className="deletemodal-actions">
                        <button className='config-button  w-40  text-center'style={{ backgroundColor: "#720C20", border: "1px solid #720C20", float: "right", textAlign: "center",padding:"6px 13px",borderRadius:"3px",color:"white"}} onClick={()=>confrimDelete()}>Yes</button>
                        <button className='config-button w-40  text-center ms-2' style={{ border: "1px solid #720C20", backgroundColor: "white", color: "#720C20", float: "right",padding:"6px 16px",borderRadius:"3px" }} onClick={()=>setShowDeleteModal(false)}>No</button>
                    </div>
                </div>
            </div>
          )
        
    }

    const confrimDelete =async(data)=>{
        const input = {
            "primaryUserId": _primaryMemberUserId,
            "attorneyUserId": _loggedInUserId,
            "upsertedBy": _loggedInUserId,
            "notes": [
              {
                "userNoteId": data?.userNoteId,
                "pageCategoryId": data?.pageCategoryId,
                "pageTypeId": data?.pageTypeId,
                "pageSubTypeId": data?.pageSubTypeId,
                "isActive": false
              }
            ]
          }
        
        setIsLoaderActive(true) 
        let updatePasswordApi = await postApiCall("POST",$Service_Url?.postUserNotes,input) 
        setIsLoaderActive(false) 
        toasterAlert("successfully", "Successfully delete", "Your data has been successfully deleted.")
        setShowDeleteModal(false)           
        getUserNotes()  

    }
    const handleActiveTabButton = (val,data) => {
        setActiveBtn(val)
        const newNotes = isNotValidNullUndefile(data) ? data : notes
        if (val === "Starred") {            
            setfilteredNotes(newNotes.filter((ele) => ele?.isStar === true));
          } else {
            setfilteredNotes(newNotes);
          }
    }
   
    const handleStar = (index, data) => {
        const newData = [...filteredNotes];
        newData[index] = { ...newData[index], isStar: !data?.isStar }; // Toggle isStar
        setfilteredNotes(newData);
        addNote("addUpdateStar",newData[index])      
    };
    const handleEditNote =(data)=>{
        setEditData(data)
        setModalOpen(true)
        setNoteText(data?.notes)
        setNoteTittle(data?.notesHeading)
    }
    const handleDisabled = () => {
        return $AHelper?.$isNotNullUndefine(editData) &&  noteText === editData?.notes && noteTittle === editData?.notesHeading;
      };


const filteredSearchData = useMemo(() => {
    let searchQuery = query;
    let data = filteredNotes;
    if ($AHelper.$isNotNullUndefine(searchQuery)) {
        const searchString = query.toLowerCase();
        return data?.filter(item => {
            return (
                (item?.notesHeading && item.notesHeading?.toLowerCase().includes(searchString))
                
            );
        });
    } else {
        return data;
    }
}, [query, filteredNotes]);
    return (
        <>  
            {isNotValidNullUndefile(pageCategoryId) &&
            
           
            <div className="theme-btnNotes py-0" onClick={openNotesmodal}><img src='\images\addAttorny.svg'/></div>
            }
             
          
            <>     
            
                  <div className='stickyNoteContain'> 
                  <div className='container me-0'>
                        <div id="noteText">
                            {modalOpen && (
                                <div className="modalOverlay">
                                    <div className="modalData" style={{backgroundColor:"white",height:"auto"}}>
                                                                              
                                        <header className="App-header" style={{ height: "45px", backgroundColor: "#EEEEEE",borderRadius:"10px 10px 0 0"}}>
                                            <div className='d-flex justify-content-between border-1 App-headers p-2' style={{height:"inherit"}}>
                                             
                                                <h4 className='mt-auto mb-auto ms-3' style={{ color: "black",fontWeight:"600" }}>{`${$AHelper?.$isNotNullUndefine(editData) ? "Edit": "New"} Note`}</h4>
                                                <div>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip id="svg-tooltip" style={{ zIndex: "999999999", position: "relative" }}>Close</Tooltip>
                                                    }>
                                                        <img className="close-Notes me-2"style={{width:"20px",height:"20px"}} src='/images/crossIcon.svg' onClick={closeModal}/>
                                                     
                                                </OverlayTrigger>
                                                </div>
                                            </div>
                                        </header>
                                        <div className='mt-1' style={{padding:"0 20px"}}>
                                         <div className='pb-2 mb-2' style={{borderBottom:"1px solid #e6e6e6"}}>
                                            <p style={{fontSize:"15px",fontWeight:"600"}}>{pageCatagoryType?.pageCategory}</p>
                                         </div>
                                        
                                        <div>
                                        <h6 className='mt-2' style={{fontWeight:"600",fontSize:"14px"}}>Heading tittle</h6>
                                        <div className='d-flex justify-content-between mb-3 mt-2' style={{border: "1px solid lightgray",borderRadius:"8px" }}>
                                        <input className='text-Area' value={noteTittle} maxlength="50"disabled={isRecording1} onChange={(e) => setNoteTittle(e?.target?.value?.charAt(0).toUpperCase() + e?.target?.value?.slice(1))} style={{ backgroundColor: "", border: "none", color: "black",borderRadius:"8px"}} type='text' placeholder='Notes heading.....' />

                                            <div className=''>
                                            {micOptions('object1', isRecording1, setIsRecording1)}
                                                </div>
                                         
                                            
                                        </div>
                                        <div className='d-flex justify-content-between mt-2' style={{border: "1px solid lightgray",borderRadius:"8px"}}>
                                            
                                            <textarea
                                                className='text-Area'
                                                style={{border: "none", color: "black",resize:"none",borderRadius:"8px"}}
                                                value={noteText}
                                                onChange={(e) => setNoteText(e?.target?.value?.charAt(0).toUpperCase() + e?.target?.value?.slice(1))}
                                                rows="4"
                                                maxlength="500"
                                                disabled={isRecording2}
                                                placeholder="Enter your note....."
                                            />
                                             <div className=''>
                                            {micOptions('object2', isRecording2, setIsRecording2)}
                                     
                                            </div >
                                            <div >
            
                                                    
                                            
                                           
                                            
                                            </div>
                                        </div>
                                        </div>
                                        </div>
                                        <footer className=''>
                                            <div className='d-flex justify-content-end'style={{padding:"10px 20px",borderRadius:"8px"}}>
                                                <button onClick={addNote} style={{backgroundColor:"#720C20",cursor:"pointer"}}>{$AHelper?.$isNotNullUndefine(editData) ? "Update" : "Save"}</button>
                                            </div>
                                        </footer>


                                    </div>
                                </div>
                            )}
                        </div>
                    </div>   
                    {showNotes && notes?.length > 0 &&
                        <div id='notesInSide' className='contains ms-0'>
                            <div className="sticky">
                                <header className="App-header" style={{ height: "45px", backgroundColor: "#EEEEEE",borderRadius:"10px 10px 0 0"}}>
                                    <div className='d-flex justify-content-between border-1'style={{height:"inherit"}}>
                                      
                                        <h4  className='mt-auto mb-auto ms-3' style={{ color: "black",fontWeight:"600" }}>Attorney Notes <span style={{fontWeight:"400"}}>({pageCatagoryType?.pageCategory})</span></h4>
                                        <OverlayTrigger placement="top"
                                            overlay={<Tooltip id="svg-tooltip" style={{ zIndex: "999999999", position: "relative" }}>Close</Tooltip>
                                            }>
                                            <img className="close-Notes me-2 mt-auto mb-auto"style={{height:"20px",width:"20px"}} src='/images/crossIcon.svg' onClick={openNotesmodal}/>
                                      
                                        </OverlayTrigger>
                                      
                                    </div>
                                </header>
                                <div className='mt-2' style={{padding:"0 10px",minHeight:"33rem"}}>
                                <div className='mt-2'>
                                    <div className="input-group newS">
                                        <input
                                            type="search"
                                            className="form-control"
                                            placeholder="Search"
                                            style={{ height:'44px',borderRadius:"8px 0 0 8px",borderRight:"none"}}
                                            onChange={(e) => setquery((e.target.value)?.toLowerCase())}
                                        />
                                        <span className="input-group-text" style={{backgroundColor:"white",borderRadius:"0 8px 8px 0",borderLeft:"none"}} id="basic-addon1">
                                            <img className='mt-0' src="\images\searchIconF.svg" />
                                        </span>
                                    </div>
                                </div>
                                    <div className='d-flex justify-content-start  pb-2 pt-2' style={{borderBottom: "1px solid #e6e6e6" }}>
                                        <button className={`btn me-3 ${activeBtn == "all" ? "allStarredNote" : "isStarredNote"}`} style={{width:"56px"}} onClick={() => handleActiveTabButton("all")}>All</button>
                                        <button className={`btn  ${activeBtn == "Starred" ? "allStarredNote" : "isStarredNote"}`} style={{width:"140px"}} onClick={() => handleActiveTabButton("Starred")}>Starred notes</button>
                                    </div>
                                        <p className='' style={{fontWeight:"600",fontSize:"15px"}}>{filteredSearchData.length} <span style={{fontWeight:"100"}}>notes</span></p> 
                                        <div>
                                        <p className='text-center'style={{padding:"8px",border: "1.8px dashed #20BF5566",borderRadius:"8px",background:"#F3FFF8CC",color:"#838383",fontSize:"16px",cursor:"pointer"}}onClick={openModal}>+ Create Notes</p>

                                        </div>
                                 

                                <div className="notes">
                                    {filteredSearchData?.map((ele, index) => {
                                        return (
                                            <>
                                                <div key={index} style={{ width: "-webkit-fill-available", marginBottom: "1rem", border: "1px solid #DBDBDB", borderRadius: "8px", padding: "6px" }}>

                                                    <div className="d-flex justify-content-between w-100">
                                                        <div className="d-flex" style={{ alignItems: "center" }}>
                                                            <img src="\images\sticky-note.svg" alt="Sticky Note" style={{ height: "19px", width: "19px", marginTop: "0px" }} />
                                                            <h5 style={{ fontWeight: "600", fontSize: "15px", marginLeft: "8px" }}>{ele?.notesHeading}</h5>
                                                        </div>
                                                        <div className="d-flex" style={{ alignItems: "center" }}>
                                                            <div style={{ borderRight: "1px solid lightgrey", paddingRight: "8px" }}>
                                                            <OverlayTrigger placement="top" overlay={<Tooltip id="svg-tooltip" style={{ zIndex: "999999999", position: "relative" }}>Edit</Tooltip>}>
                                                                <img className='mt-0 cursor-pointer' src="\images\noteEdit.svg" alt="Edit Note" style={{ height: "15px", width: "15px" }} onClick={() => handleEditNote(ele)} />
                                                                </OverlayTrigger>
                                                            </div>
                                                            <OverlayTrigger placement="top" overlay={<Tooltip id="svg-tooltip" style={{ zIndex: "999999999", position: "relative" }}>Starred</Tooltip>}>
                                                            <img className='mt-0 cursor-pointer' onClick={() => handleStar(index, ele)} src={`/images/${ele?.isStar == true ? "selectedStar.svg" : "starred.svg"}`} alt="Starred" style={{ height: "15px", width: "15px", marginLeft: "8px" }} />
                                                            </OverlayTrigger>
                                                        </div>
                                                    </div>
                                                    <div class="notes-text1 mt-1" style={{ fontSize: "14px" }}>
                                                        {ele?.notes}

                                                    </div>


                                                    <div style={{ borderTop: "1px solid lightgray", marginTop: "0.5rem" }}>
                                                        <div className="d-flex justify-content-between w-100 mt-2" style={{ height: "21px" }}>
                                                            <div className="d-flex" style={{ alignItems: "center" }}>
                                                                <img src="\images\userFrame.svg" alt="Sticky Note" style={{ height: "19px", width: "19px", marginTop: "0px" }} />
                                                                <h5 style={{ fontWeight: "600", fontSize: "13px", marginLeft: "8px" }}>{ele?.attorneyName} <span style={{ fontWeight: "100",fontSize:"13px" }}>(Attorney)</span></h5>
                                                            </div>
                                                            <div className="d-flex" style={{ alignItems: "center" }}>
                                                                <div style={{ borderRight: "1px solid lightgrey", paddingRight: "8px" }}>
                                                                    <h5 class="notes-text"> {getRelativeTime($AHelper?.$isNotNullUndefine(ele?.updatedOn) ? ele?.updatedOn : ele?.createdOn)}</h5>
                                                                </div>
                                                                <OverlayTrigger placement="top" overlay={<Tooltip id="svg-tooltip" style={{ zIndex: "999999999", position: "relative" }}>Delete</Tooltip>}>
                                                                <img className='mt-0' onClick={() => handleDelete(ele)} src="\images\newDeleteIcon.svg" alt="Starred" style={{ height: "15px", width: "15px", marginLeft: "8px" }} /></OverlayTrigger>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })}

                                </div>
                                </div>
                            </div>
                        </div>
                    }
                  </div>
                  { showDeleteModal && deleteConfrimation()}
                  {isLoaderActive && isLoader()}
                 
            </>

        </>
    )
}


const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNotes);