import React, { useCallback, useEffect, useState } from 'react';
import ProfessionalTable from './ProfessionalTable';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import ProfessionalForm from '../../Common/Professional-Usefuls/ProfessionalForm';
import { setHideCustomeSubSideBarState } from '../../utils/utils';
import konsole from '../../../components/control/Konsole';
import { $AHelper } from '../../Helper/$AHelper';

const ProfessionalHandler = ( props ) => {
    // STATES AND VARIBLES
    const isMyProfessional = (props.proSerDescId == '' && props.proTypeId == '') ? true : false;
    const [pageAction, setpageAction ] = useState('VIEW') // types: [VIEW | EDIT | ADD]
    const [selectedUser, setselectedUser] = useState('1'); // 1 FOR PRIMARY | 2 FOR SPOUSE
    const [editProfDetails, seteditProfDetails] = useState({});
    const { primaryUserId, spouseUserId, loggedInUserId, primaryMemberFullName, spouseFullName, spouseFirstName, primaryMemberFirstName, primaryDetails, isPrimaryMemberMaritalStatus } = usePrimaryUserId();


    // DERIVED VARIABLES
    const currentUserId = selectedUser == '1' ? primaryUserId : spouseUserId;


    // USEFUL FUNCTIONS
    const prePareForAction = useCallback(( action, changeUserTo ) => {
        if(changeUserTo) setselectedUser(changeUserTo);
        setpageAction(action);
        setHideCustomeSubSideBarState(action == "VIEW" ? false : true);
    }, [])

    const setEditProfDetailsFunc = useCallback(( profDetails ) => {
        seteditProfDetails(profDetails);
    }, [])

    return (
        <div id="primary-care-physician" className='professional-all-css'>
            {/* {pageAction == "VIEW" && 
            <>
            <p className='page-sub-title'>{props?.profConstants.profSubTile}</p>
            {isPrimaryMemberMaritalStatus && <div className="d-flex align-items-center my-4">
                <p className="me-2">View:</p>
                <div className="btn-div">
                    <button className={`view-btn ${selectedUser == "1" ? "active" : ""}`} onClick={()=>setselectedUser('1')}>{primaryMemberFullName ?  primaryMemberFullName : "My"}</button>
                    <button className={`view-btn ${selectedUser == "2" ? "active" : ""}`} onClick={()=>setselectedUser('2')}>{spouseFullName ? spouseFullName : "Spouse"}</button>
                </div>
            </div>}
            </>} */}
            {/* { pageAction == "VIEW"  ? <div style={{borderBottom: '1px solid #F0F0F0', marginTop: (props.profConstants?.proSerDescId == '3' ? '0px' : '13px') }}></div>:""}

            {pageAction == "VIEW" && 
            <div className='mb-3 d-flex justify-content-between mt-3'>
            <p className='heading-of-sub-side-links-2 mt-2'>{props?.profConstants.profSubTile}</p>
            {isPrimaryMemberMaritalStatus &&  <div className="d-flex align-items-end justify-content-end">
                <div className="btn-div addBorderToToggleButton">
                    <button className={`view-btn ${selectedUser == "1" ? "active selectedToglleBorder" : ""}`} onClick={()=>setselectedUser('1')}>{primaryMemberFirstName ?  primaryMemberFirstName : "My"}</button>
                    <button className={`view-btn ${selectedUser == "2" ? "active selectedToglleBorder" : ""}`} onClick={()=>setselectedUser('2')}>{spouseFirstName ? spouseFirstName : "Spouse"}</button>
                </div>
            </div>}
            </div>} */}
            { pageAction == "VIEW"  ? <div style={{borderBottom: '1px solid #F0F0F0', marginTop: (props.profConstants?.proSerDescId == '3' ? '0px' : '13px') }}></div>:""}
            {pageAction == 'VIEW' &&
                <div className="d-flex justify-content-between align-items-center">
                    <div className="col-auto">
                        <span className="heading-of-sub-side-links-2 mt-2 ">{props?.profConstants.profSubTile}</span>
                    </div>
                    {(isPrimaryMemberMaritalStatus) &&
                        <div className="d-flex align-items-end justify-content-end" style={{ margin: `-62px ${[13, 45, 46, 1, 3, 12].includes(Number(props?.profConstants?.proTypeId)) ? '32px' : '24px'} 24px` }}>
                            <div className="btn-div addBorderToToggleButton ms-auto" >
                                <button className={`view-btn ${selectedUser == "1" ? "active selectedToglleBorder" : ""}`} onClick={() => setselectedUser('1')}>{primaryMemberFirstName ? primaryMemberFirstName : "My"}</button>
                                <button className={`view-btn ${selectedUser == "2" ? "active selectedToglleBorder" : ""}`} onClick={() => setselectedUser('2')}>{spouseFirstName ? spouseFirstName : "Spouse"}</button>
                            </div>
                        </div>
                    }
                </div>
            }
            {pageAction == "VIEW" ? 
                <>
                <ProfessionalTable 
                    setpageAction={prePareForAction} 
                    handleActiveTabMain={props.handleActiveTabMain}
                    selectedUser={selectedUser}
                    userId={currentUserId}
                    primaryUserId={primaryUserId}
                    setEditProfDetails={setEditProfDetailsFunc}
                    // proSerDesc='1'
                    // proTypeId='11'
                    // tableName="Specialists"
                    // addBtnName="Specialist"
                    {...props?.profConstants}
                />
                </>
            : (pageAction == "EDIT" || pageAction == "ADD") ? 
                <ProfessionalForm
                    key={pageAction}
                    setpageAction={prePareForAction} 
                    formType={pageAction}  // "EDIT"
                    editProfDetails={editProfDetails}
                    currentUserId={currentUserId}
                    setEditProfDetails={setEditProfDetailsFunc}
                    handleActiveTabMain={props.handleActiveTabMain}
                    {...props?.profConstants}
                />
            // : pageAction == "ADD" ?
            //     <ProfessionalForm
            //         setpageAction={prePareForAction} 
            //         formType={pageAction} // ADD
            //         currentUserId={currentUserId}
            //         setEditProfDetails={setEditProfDetailsFunc}
            //         handleActiveTabMain={props.handleActiveTabMain}
            //         {...props?.profConstants}
            //     />
            : ""
            }
        </div>
    )
}

export default ProfessionalHandler;