import React, { useCallback, useEffect, useState } from 'react';
import ProfessionalTable from '../../Common/Professional-Usefuls/ProfessionalTable';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import ProfessionalForm from '../../Common/Professional-Usefuls/ProfessionalForm';
import { profConstants } from '../../Helper/Constant';
import { setHideCustomeSubSideBarState } from '../../utils/utils';
import konsole from '../../../components/control/Konsole';

const Specialist = ( props ) => {
    // STATES AND VARIBLES
    const [pageAction, setpageAction ] = useState('VIEW') // types: [VIEW | EDIT | ADD]
    const [selectedUser, setselectedUser] = useState('1'); // 1 FOR PRIMARY | 2 FOR SPOUSE
    const [editProfDetails, seteditProfDetails] = useState({});
    const { primaryUserId, spouseUserId, loggedInUserId, primaryMemberFirstName, spouseFirstName, isPrimaryMemberMaritalStatus } = usePrimaryUserId();


    // DERIVED VARIABLES
    const currentUserId = selectedUser == '1' ? primaryUserId : spouseUserId;


    // USEFUL FUNCTIONS
    const prePareForAction = useCallback(( action, changeUserTo ) => {
        if(changeUserTo) setselectedUser(changeUserTo);
        setpageAction(action);
        setHideCustomeSubSideBarState(action == "VIEW" ? false : true);
    }, [])

    const setEditProfDetailsFunc = useCallback(( profDetails ) => {
        // alert("sfdv")
        seteditProfDetails(profDetails);
    }, [])

    return (
        <div id="primary-care-physician" className='professional-all-css'>
            {pageAction == "VIEW" && 
            <div className='mb-4'>
            <p className='heading-of-sub-side-links-2 mt-2'>{profConstants.specialist.profSubTile}</p>
            {isPrimaryMemberMaritalStatus &&  <div className="d-flex align-items-end justify-content-end" style={{ margin: "-62px 24px 36px" }}>
                <div className="btn-div addBorderToToggleButton">
                    <button className={`view-btn ${selectedUser == "1" ? "active selectedToglleBorder" : ""}`} onClick={()=>setselectedUser('1')}>{primaryMemberFirstName ?  primaryMemberFirstName : "My"}</button>
                    <button className={`view-btn ${selectedUser == "2" ? "active selectedToglleBorder" : ""}`} onClick={()=>setselectedUser('2')}>{spouseFirstName ? spouseFirstName : "Spouse"}</button>
                </div>
            </div>}
            </div>}
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
                    {...profConstants.specialist}
                />
                </>
            : pageAction == "EDIT" ? 
                <ProfessionalForm
                    setpageAction={prePareForAction} 
                    formType={pageAction}  // "EDIT"
                    editProfDetails={editProfDetails}
                    currentUserId={currentUserId}
                    setEditProfDetails={setEditProfDetailsFunc}
                    handleActiveTabMain={props.handleActiveTabMain}
                    selectedUser = {selectedUser}
                    {...profConstants.specialist}
                />
            : pageAction == "ADD" ?
                <ProfessionalForm
                    setpageAction={prePareForAction} 
                    formType={pageAction} // ADD
                    currentUserId={currentUserId}
                    setEditProfDetails={setEditProfDetailsFunc}
                    handleActiveTabMain={props.handleActiveTabMain}
                    {...profConstants.specialist}
                />
            : ""
            }
        </div>
    )
}

export default Specialist;