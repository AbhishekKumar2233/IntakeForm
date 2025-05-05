import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip, Modal, Button, Row, Col } from "react-bootstrap";
import { $AHelper } from "../control/AHelper";
import { getApiCall, isNotValidNullUndefile } from "../Reusable/ReusableCom";
import konsole from "../control/Konsole";
import HeaderAttonerNotes from "./HeaderAttorneyNotes";
import { $Service_Url } from "../network/UrlPath";
import { memo } from "react";
import { connect } from "react-redux";
import { SET_LOADER } from "../Store/Actions/action";
import AttorneyNotesModal from "./AttorneyNotesModal";


const AttorneyNote = (props) => {
  const [loggedInUserDetails, setLoggedInUserDetails] = useState('')
  const [showGrid, setshowGrird] = useState('Grid')
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNotesData, setSelectedNotesData] = useState('')
  const [attornetNotesData, setAttornetNotesData] = useState([])
  const [searchText, setSearchText] = useState("");
  const [searchInputValue, setsearchInputValue] = useState("")
  const [showFullNotes, setshowFullNotes] = useState(false);
  const [filterOption, setfilterOption] = useState("all");
  const [sortOrder, setSortOrder] = useState('Newest First');
  const [userDetail, setuserDetail] = useState("") 




  useEffect(() => {
    let primaryuersid = sessionStorage.getItem('SessPrimaryUserId')
    let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))
    fetchApiCall(primaryuersid)
    setuserDetail(userDetailOfPrimary)
  }, [modalIsOpen]);


  const fetchApiCall = async (primaryuersid) => {

    if (isNotValidNullUndefile(primaryuersid)) {
      let url = $Service_Url.getAttorneyNotesApi + `?PrimaryUserId=${primaryuersid}`
      const _resultOfAttorneyNotes = await getApiCall('GET', url, setAttornetNotesData);
      konsole.log('_resultOfAttorneyNotes', _resultOfAttorneyNotes)
    }
  }
  useEffect(()=>{
    handleSearch()
  },[searchInputValue])





  const handleAttorney = (value) => {
    setshowGrird(value)
  }

  const handleShowModal = (ele) => {
    setModalIsOpen(true)
    setSelectedNotesData(ele)
  }

  const handelCloseModal = () => {
    setModalIsOpen(false);
  }
  konsole.log('attornetNotesData', attornetNotesData)


  const handleSearch = () => {
    props.dispatchloader(true)
    setSearchText(searchInputValue)
  }

  const handleKeypress = (e) => {
    if (e.which === 13) {
      handleSearch()
    }
  }
  const handleShowNotes = () => {
    setshowFullNotes(!showFullNotes);
    konsole.log("showFullNotesData", showFullNotes)
  };

  const isSearchIncludes = (el) => {
    if (!searchText) return true;

    const eleHeading = el.notesHeading?.toLowerCase();
    const eleAttorneyName = el.attorneyName?.toLowerCase();
    const searchedText = searchText?.toLowerCase();
    if (eleHeading?.includes(searchedText)) return true;
    if (eleAttorneyName?.includes(searchText)) return true;

    return false;
  }

  const handlechange = (event) => {
    const filter = event.target.value;
    setfilterOption(filter)
  };

  const dateDiff = ( notDate )=>{
    let date1 = new Date(notDate);
let date2 = new Date();

let Difference_In_Time =
    date2.getTime() - date1.getTime();

let Difference_In_Days =
    Math.round
        (Difference_In_Time / (1000 * 3600 * 24));

        return Difference_In_Days 
  }
  
  const sortNotes = (notes) => {
    return notes.sort((a, b) => {
      if (sortOrder == 'Newest First') {
        return new Date(b.createdOn) - new Date(a.createdOn);
      } else {
        return new Date(a.createdOn) - new Date(b.createdOn);
      }
    });
  };

  const handleSortNotes =(event)=>{
    setSortOrder(event.target.value);
  }

  return (

    <div>

      <AttorneyNotesModal
        selectedNotesData={selectedNotesData}
        // key={selectedNotesData}
        modalIsOpen={modalIsOpen}
        key={modalIsOpen}
        handelCloseModal={handelCloseModal}

      />
      <HeaderAttonerNotes />
 
      <div className='w-100 h-100' style={{ background: "white !important", position: "fixed", width: "50%", top: "120px" }} >
        <div className="row d-flex mt-0" >

        <div className="ms-3">
              <div className="responsive-username pb-3">
                <img src="/icons/ProfilebrandColor2.svg"
                  className={`${(isNotValidNullUndefile(userDetail?.spouseName)) ? "maleAvatarUser primaryuser-image-class hide-div-class " : "maleAvatarUser primaryuser-image-class1 hide-div-class"}`}
                  alt="user" />

                {(isNotValidNullUndefile(userDetail?.spouseName)) && 
                <img src="/icons/ProfilebrandColor2.svg" className='maleAvatarUser Spousecls hide-div-class img-fluid' alt="user" />}
                <div className='hide-div-class ms-2 mt-1'>
                  <h3 className="overflow-hidden usernme-h3-tag" >
                    {$AHelper.capitalizeAllLetters(userDetail?.memberName) + (($AHelper.capitalizeAllLetters(userDetail?.spouseName) !== null && $AHelper.capitalizeAllLetters(userDetail?.spouseName) !== undefined && $AHelper.capitalizeAllLetters(userDetail?.spouseName !== '')) ? (" & " + $AHelper.capitalizeAllLetters(userDetail?.spouseName)) : '') }
                  </h3>
                </div>
              </div>
            </div>

          <div className="row d-flex justify-content-between" style={{paddingTop:"1px"}}>
            <div className="d-flex align-items-center col-7" style={{ background: '#EFF1F3', border: '1px solid #EFF1F3', borderRadius: "6px", width: "50%", marginLeft: "28px" }}>
              <img
                src="icons/searchParalegalIcon.svg"
                alt="Profile "
                className="cursor-pointer mt-0 p-2 mx-2"
                onClick={handleSearch}
                style={{
                  // position: "relative",
                  width: "25px", height: "25px", backgroundColor: "#EFF1F3",
                  // border: "1px solid black",
                  // borderStyle: "solid solid solid none",
                  // borderRadius: "0px 10px 10px 0px",
                }}
              ></img>
              <input
                type="text"
                value={searchInputValue}
                onChange={(e) => {
                  // setSearchText(e.target.value);
                  setsearchInputValue(e.target.value)
                }}
                onKeyPress={handleKeypress}
                placeholder="Search notes..."
                className="header-search p-1"
                style={{
                  height: "40px",
                  width: "100%",
                  // position:'absolute',
                  border: 'none',
                  background: "#EFF1F3"
                  // border: "1px solid black",
                  // borderStyle: "solid none solid solid",
                  // borderRadius: "10px 0px 0px 10px",
                }}
              ></input>
            </div>
            <div className="col-2" style={{ width: '8rem' }}>
              <div className="d-flex align-item-center gap-3 p-2" style={{ border: "2px solid #eff1f3", borderRadius: "6px", width: "", height: "39px", backgroundColor: "white" }}>
                <div className="ms-1">
                  {showGrid == 'Grid' ? <img onClick={() => handleAttorney('Grid')} className="attorneyListImg cursor-pointer mt-0" src="icons/gridDarkImg.svg" /> : <img onClick={() => handleAttorney('Grid')} className="attorneyListImg cursor-pointer mt-0" src="icons/gridLightImg.svg" />}
                </div>
                <div style={{ borderLeft: "2px solid #c4c4c4", paddingLeft: "8px" }}>
                  {showGrid == "List" ? <img onClick={() => handleAttorney('List')} className="attorneyListImg cursor-pointer mt-0 " src="icons/listDarkImg.svg" /> : <img onClick={() => handleAttorney('List')} className="attorneyListImg cursor-pointer mt-0 " src="icons/listLightImg.svg" />}
                </div>
              </div>
            </div>
          </div>
          <div className="ps-0 d-flex justify-content-between pe-5">
          <select className="changeselecticon  mt-2 custom-selectparalegalmt-3" name="head-select" id="sortingCol"
            onChange={handlechange}
            style={{
              border: "none",
              color: "#333333",
              height: "42px",
              marginLeft: "20px",
              fontSize: '14.8px',
              fontWeight: "600",
              width: "115px",
              textDecoration: "underline"
            }}
          >
            <option value={"all"} >All Notes</option>
            <option value={"recent"} >Recent</option>
          </select>
            <div className="d-flex">
            <p style={{paddingTop:"24px", color:"#838383"}} >Sorted by:</p>
            <select className="changeselecticon  mt-3 custom-selectparalegalmt-3" name="head-select" id="sortingCol"
            onChange={handleSortNotes}
            style={{border: "none", color: "#333333", height: "42px", fontSize: '14.8px', fontWeight: "600", width: "135px", textDecoration: "underline"}} >
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
            </div> 
          </div>          
      <div style={{ overflowY: "auto", height: "55vh", overflowX:"hidden"}} className={`${showGrid === 'Grid' ? ' pt-0' : ''}`}>
      <div className={showGrid === 'Grid' ? ' row d-flex': ''} style={showGrid === 'Grid' ? {marginLeft :"8px" , marginRight:"-70px"} : {marginLeft :"8px"}}>
          {(attornetNotesData?.userNotes?.length > 0) ? (
            <>
            {sortNotes(attornetNotesData?.userNotes)?.filter(ele => isSearchIncludes(ele))?.length > 0 ? sortNotes(attornetNotesData?.userNotes)?.filter(ele => isSearchIncludes(ele))?.filter(ele => (dateDiff(ele.createdOn) > 7 && filterOption == "recent" ? false : true))?.map((item, index) => (
                  <>
                    {showGrid === 'Grid' ? (
                      <GridBox handleShowModal={handleShowModal} ele={item} handleShowNotes={handleShowNotes} showFullNotes={showFullNotes} />
                    ) : (
                      <ListView index={index} handleShowModal={handleShowModal} ele={item} handleShowNotes={handleShowNotes} showFullNotes={showFullNotes} />
                    )}
                  </>
                )) : 
            <div className="no-data-container1">
             <div className="textImg">
                  <img src="icons/nodataFoundImg.svg" alt="No Data Found Image" />
                  <p>No Data Found</p>
                </div>
              </div>}
                </>
          ) : null}
            </div>
            {!(attornetNotesData?.userNotes?.length > 0) && (
              <div className="no-data-container">
                <div className="textImg">
                  <img src="icons/nodataFoundImg.svg" alt="No Data Found Image" />
                  <p>No Data Found</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


const ListView = ({ index, ele, handleShowModal, showFullNotes, handleShowNotes }) => {
  return (
    <>
    <div onClick={() => handleShowModal(ele)} className="cursor-pointer" style={{ overflowX: "hidden", paddingRight: "30px" }}>
      <table className="paralegalTable table table-responsive mt-3 ms-4" >
        {index == 0 &&
          <thead style={{ position: "sticky", top: "0px", background: "white", zIndex: "3" }}>
            <tr className="bg-light">
              <th className="fw-bold"><span className="ps-3">Notes</span></th>
              <th className="fw-bold">Description</th>
              <th className="fw-bold">Reported By</th>
              <th className="fw-bold">Comments</th>
            </tr>
          </thead>
        }
        <tbody>
          <tr>
          <OverlayTrigger placement='top' overlay={<Tooltip>{ele?.notesHeading}</Tooltip>}>
          <td style={{ width: "25%" }}><span className="fw-bold ps-3">{$AHelper.capitalizeFirstLetter(ele.notesHeading)}</span></td>
        </OverlayTrigger>              
            <td style={{ width: "25%", wordBreak: "break-all" }}>  {$AHelper.capitalizeFirstLetter(ele?.notes?.slice(0, 75) + (ele?.notes?.length > 75 ? '...' : ''))}
              {ele?.notes?.length > 75 && !showFullNotes && (
                <a style={{ cursor: 'pointer', color: '#0D6EFD' }}>Read More</a>
              )}

              </td>
            <td style={{ width: "25%" }}>{ele.attorneyName}</td>
            <td style={{ width: "25%" }}>{ele.comments.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
    </>
  );
};




const GridBox = ({ ele, handleShowModal, showFullNotes, handleShowNotes }) => {
  return (
<>
    <div className="d-flex flex-column attrnymain cursor-pointer p-2 pt-0 m-1" onClick={() => handleShowModal(ele)} style={{width: "23%"}} >
      <div className="attrnyPaper attorny-fold ">
        <OverlayTrigger placement='top' overlay={<Tooltip>{ele?.notesHeading}</Tooltip>}>
        <h3 className="p-2 mt-2 showDottNote">{$AHelper.capitalizeFirstLetter(ele?.notesHeading)}</h3></OverlayTrigger>
        <div className="childBox mt-1" style={{ borderBottom: "1px solid #c4c4c4" }}>
          <p className="p-2 gridCmntScroll" style={{ wordBreak: "break-all" }}>
            {showFullNotes ? $AHelper.capitalizeFirstLetter(ele?.notes ):  $AHelper.capitalizeFirstLetter(ele?.notes?.slice(0, 100) + (ele?.notes?.length > 100 ? '...' : ''))}
            {ele?.notes?.length > 100 && !showFullNotes && (
              <a  style={{ cursor: 'pointer', color: '#0D6EFD', zIndex: "999999" }}>Read More</a>
            )}
          </p>

          <p className="pb-3 pt-2" style={{ wordBreak: "break-all" }}>Reported by: <span style={{ fontWeight: "600" }}>{ele.attorneyName}</span></p>
        </div>

        <div className="d-flex justify-content-between pt-3">
          <div className="d-flex">
            <div>
              <img className="mt-0" src="icons/atrnyDateImg.svg" />
            </div>
            {konsole.log(ele.createdOn, "ele.createdOn")}
            <p className="ps-2 mt-0">{$AHelper.getFormattedDate(ele.createdOn)}</p>
          </div>
          <div className="vr"></div>
          <div className="d-flex">
            <div>
              <img className="mt-0" src="icons/atrnyComments.svg" />
            </div>
            <p className="ps-2">{ele.comments.length}</p>
            <div className="ps-2">Comments</div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};



const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});


export default connect(mapStateToProps, mapDispatchToProps)(AttorneyNote);

