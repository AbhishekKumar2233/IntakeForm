import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip, Modal, Button, Row, Col } from "react-bootstrap";
import { $AHelper } from "../control/AHelper";
import konsole from "../control/Konsole";
import { $Service_Url } from "../network/UrlPath";
import { isNotValidNullUndefile, postApiCall } from "../Reusable/ReusableCom";
import { connect } from "react-redux";
import { SET_LOADER } from "../Store/Actions/action";
import IsLoader from "../IsLoader";

const newObj = () => {
    return { commentId: 0, userId: "", comment: "", isActive: true, userNoteId: 0, userNoteId: '', userId: '', userName: '' }
}

const AttorneyNotesModal = (props) => {
    const { selectedNotesData, modalIsOpen, handelCloseModal } = props
    const allCommentList = selectedNotesData?.comments?.filter((item) => item.isActive == true);
    console.log('selectedNotesData', selectedNotesData, allCommentList)

    const [isCommnetBtnOpen, setIsCommentBtnOpen] = useState(false)
    const [commentList, setCommentList] = useState(allCommentList)
    const [primaryuserId, setPrimaryuserId] = useState("");
    const [userLoggedInDetail, setuserLoggedInDetail] = useState("");
    const [loggedInUserId, setLoggedInUserId] = useState("");
    const [isLoader, setIsLoader] = useState(false);
    const [commentInfo, setCommnetInfo] = useState({ ...newObj(), userId: loggedInUserId, userNoteId: selectedNotesData?.userNoteId,userName:userLoggedInDetail?.memberName });
    const [showFullNotes, setshowFullNotes] = useState(false);


    konsole.log('commentInfo', commentList)

    useEffect(() => {
        let primaryuserid = sessionStorage.getItem('SessPrimaryUserId');
        let loggedInUser = sessionStorage.getItem('loggedUserId')
        let userLoggDetail = JSON.parse(sessionStorage.getItem('userLoggedInDetail'))
        setuserLoggedInDetail(userLoggDetail)
        setLoggedInUserId(loggedInUser)
        setPrimaryuserId(primaryuserid)
        setCommnetInfo({ ...newObj(), userId: loggedInUser, userNoteId: selectedNotesData?.userNoteId ,userName:userLoggDetail?.memberName});
    }, [])


    const postCommentSave = async (type, item) => {
        dispatchloader(true)
        const jsonObj = commentInfo;
        if (type == 'DELETE') {
            jsonObj = item;
            jsonObj['isActive'] = false;
        }
        if(type=='ADD'){
            jsonObj['userName']=userLoggedInDetail.memberName
        }
        konsole.log('jsonObjjsonObjjsonObj',jsonObj)

        const _commentResult = await postApiCall('POST', $Service_Url.postAttorrneyNotesApi, jsonObj);
        dispatchloader(true)
        if (_commentResult != 'err') {
            const responseData = _commentResult.data.data;
            console.log("responseData",responseData)
            setCommentList(prev => {
                const newArr = [...prev]
                let myArr = newArr;
                if (type == 'DELETE') {
                    myArr = newArr.filter(i => i.commentId !== item.commentId)
                } else if (type == 'ADD') {
                    if (isNotValidNullUndefile(jsonObj?.commentId) && jsonObj?.commentId != 0) {
                        const findIndex = myArr.findIndex((it) => it.commentId == jsonObj?.commentId);
                        konsole.log('findIndex', findIndex)
                        myArr[findIndex] ={...responseData[0],userName:userLoggedInDetail.memberName}
                    } else {
                        // let newUser = responseData[0]
                        // newUser['loggedUserId'] = loggedInUserId
                        myArr.unshift({...responseData[0], color: getUserColor(userLoggedInDetail.memberName)});
                    }

                }

                return myArr;
            })

            konsole.log(_commentResult, responseData, "_commentResult")
        }
        dispatchloader(false)
        resetcomment();
    }




    const resetcomment = () => {
        setCommnetInfo({ ...newObj(), userId: loggedInUserId, userNoteId: selectedNotesData?.userNoteId,userName:userLoggedInDetail?.memberName });
        setIsCommentBtnOpen(false);
    }


    const editComment = (item) => {
        console.log('item', item)

        setCommnetInfo(prev => ({
            ...prev, ...item
        }))
    }

    konsole.log('commentInfo', commentInfo)

    const dispatchloader = (val) => {
        setIsLoader(val)
    }

    const handleState = (key, value) => {
        setCommnetInfo(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

    konsole.log('commentListcommentList', commentList)

    const handleNewest = () => {
        const sortedComments = commentList?.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
        konsole.log(sortedComments, "sortedComments")
        setCommentList([...sortedComments]);
    };

    const handleOldest = () => {
        const sortedComments = commentList?.sort((a, b) => new Date(a.createdOn) - new Date(b.createdOn));
        konsole.log(sortedComments, "sortedComments")
        setCommentList([...sortedComments]);
    }

    const handleShowNotes = () => {
        setshowFullNotes(!showFullNotes);
        konsole.log("showFullNotesData", showFullNotes)
      };

    //   const userColors = {}; 

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

    return (
        <>
        <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            max-width: 75.25rem;
            margin: 1.75rem auto;
          }
        `}</style>

            {isLoader && <IsLoader />}
            <Modal
                size="lg"
                show={modalIsOpen}
                centered
                onHide={handelCloseModal}
                animation="false"
                id="careGiver"
                backdrop="static"
            >
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Attorney Notes</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pb-3 pt-4">
                    <>
                        <Row className="" >
                            <Col lg={7} className="ps-3 commentScroll" >
                                <div>
                                    <div className="attorneyMod">
                                        <h3>{$AHelper.capitalizeFirstLetter(selectedNotesData.notesHeading)}</h3>
                                    </div>
                                    <p className="attorneyMod_P pt-4">Description:</p>
                                    <div>
                                        <div className="Box_1 mt-2">
                                            <p className="p-2" style={{ wordBreak: "break-all" }}>{selectedNotesData?.notes}</p>
                                        </div>
                                    </div>
                                    <div className="Box_2">
                                        <h3 className="pt-4">Comments:</h3>
                                        <div className="d-flex gap-3 pt-3 Box_3">
                                            <p className="p-1">Sorted by:</p>
                                            <div className="d-flex justify-content-center child_box_1" onClick={handleNewest} >
                                                <h3>Newest First</h3>
                                                <img className="mt-0" src="/icons/NewFirst.svg" />
                                            </div>
                                            <div className="d-flex justify-content-center child_box_2" onClick={handleOldest}  >
                                                <h3>Oldest First</h3>
                                                <img className="mt-0" src="/icons/Oldest.svg" />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="pt-3 d-flex gap-3">
                                    {/* <img style={{width:"28px", height:"28px"}} className="" src="/icons/ProfilebrandColor2.svg"/> */}
                                    <div className="dummyImg" style={{marginTop:"3px"}}>
                                    <p className="ps-0">{userLoggedInDetail?.memberName ? `${userLoggedInDetail?.memberName?.split(' ')?.map(ele => ele?.charAt(0))?.join("") ?? userLoggedInDetail?.memberName .charAt(userLoggedInDetail?.memberName .length - 1)}`: ''}</p>
                                        </div>
                                        {konsole.log(userLoggedInDetail,"userLoggedInDetailuserLoggedInDetail")}
                                        <input style={{ width: "90%", height: "35px", borderRadius: "4px" }} value={commentInfo.comment} onChange={(e) => { let value = e.target.value;
                                            if (value.length > 0) { value = value[0].toUpperCase() + value.slice(1)} handleState('comment', value)}} onClick={() => setIsCommentBtnOpen(true)} className="border " type="text" placeholder="Add a comment..." onBlur={(e) => {
                                            if (!e.target.value) setIsCommentBtnOpen(false)
                                        }}></input>
                                    </div>
                                    {isCommnetBtnOpen && <div className="pt-3 d-flex gap-3">
                                        <button className="theme-btn" onClick={() => postCommentSave('ADD')}>Save </button>
                                        <button className="theme-btn" onClick={() => resetcomment()}>Cancel</button>
                                    </div>}



                                    <div style={{paddingTop:"14px"}}>
                                        {commentList?.length > 0 && <>
                                            {commentList?.map((item, index) => {
                                                console.log('itemaa',item)
                                                return <>
                                                    <div className="d-flex gap-4">
                                                    <div className= "d-flex gap-3">
                                                    <div className="dummyImg" style={{ backgroundColor: getUserColor(item.userName) }}>
                                                    <p className="ps-0">{item?.userName ? `${item.userName.split(' ')[0].charAt(0)}${item.userName.split(' ')[1]?.charAt(0) ?? item.userName.charAt(item.userName.length - 1)}`: ''}</p>
                                                     </div>
                                                    {/* <img className="dummyImg" src="/icons/ProfilebrandColor2.svg"/> */}
                                                        <h3 className="" style={{ fontSize: "13px", fontWeight: "600", paddingTop:"18px" }}>{item?.userName}</h3>
                                                        </div>
                                                        <p style={{ paddingTop: "15px", color: "#98a0af" }} >{formatDisplayDate(item.createdOn)}</p>
                                                    </div>
                                                    <p className="pt-2">{item?.comment}</p>
                                                    <div className="d-flex gap-3 pt-2">
                                                        <button className="cmntBtn ps-0" onClick={() => editComment(item)}>Edit</button>
                                                        <button className="cmntBtn" onClick={() => postCommentSave('DELETE', item)}>Delete</button>
                                                    </div>
                                                </>
                                            })}

                                        </>}
                                    </div>
                                </div>

                            </Col>
                            <Col lg={5}>
                                <>
                                    <div className="detailShow ms-5">
                                        <p className="attorneyMod_P p-3 pt-4">Details-</p>
                                        <div className="d-flex gap-5 pt-3 p-3" >
                                            <h4 style={{ width: "33%" }}>Creation date</h4>
                                            <p>-</p>
                                            <h4>{$AHelper.getFormattedDate(selectedNotesData.createdOn)}</h4>
                                        </div>
                                        <div className="d-flex gap-5 pt-3 p-3" >
                                            <h4 style={{ width: "33%" }}>Reported by</h4>
                                            <p>-</p>
                                            <h4>{selectedNotesData.attorneyName}</h4>
                                        </div>
                                        <div className="d-flex gap-5 pt-3 p-3" >
                                            <h4 style={{ width: "33%" }}>Page</h4>
                                            <p>-</p>
                                            <h4>{selectedNotesData.pageCategory}</h4>
                                        </div>
                                        {selectedNotesData.pageType && (<div className="d-flex gap-5 pt-3 p-3" >
                                            <h4 style={{ width: "33%" }}>Section</h4>
                                            <p>-</p>
                                            <h4>{selectedNotesData.pageType}</h4>
                                        </div>)}
                                        {selectedNotesData.pageSubType && (<div className="d-flex gap-5 pt-3 p-3" >
                                            <h4 style={{ width: "33%" }}>Sub Section</h4>
                                            <p>-</p>
                                            <h4>{selectedNotesData.pageSubType}</h4>
                                        </div>)}
                                    </div>
                                </>
                            </Col>
                        </Row>
                    </>

                </Modal.Body>
                <Modal.Footer className="border-0">
                </Modal.Footer>
            </Modal>

        </>
    )
}


const formatDisplayDate = (dateString) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const date = new Date(dateString);
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12; 
  
    const formattedDate = `${month} ${day}, ${year} at ${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    return formattedDate;
};




const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});


export default connect(mapStateToProps, mapDispatchToProps)(AttorneyNotesModal);
