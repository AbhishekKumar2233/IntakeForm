import React, { useCallback, useEffect, useRef, useState } from 'react';
import ProfessionalTable from '../../Common/Professional-Usefuls/ProfessionalTable';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import ProfessionalForm from '../../Common/Professional-Usefuls/ProfessionalForm';
import { setHideCustomeSubSideBarState } from '../../utils/utils';
import { profConstants } from '../../Helper/Constant';
import konsole from '../../../components/control/Konsole';



const PrimaryCarePhysician = ( props ) => {
    // STATES AND VARIBLES
    const [pageAction, setpageAction ] = useState('VIEW') // types: [VIEW | EDIT | ADD]
    const [selectedUser, setselectedUser] = useState('1'); // 1 FOR PRIMARY | 2 FOR SPOUSE
    const [editProfDetails, seteditProfDetails] = useState({});
    const { primaryUserId, spouseUserId, loggedInUserId, primaryMemberFullName, spouseFullName, isPrimaryMemberMaritalStatus,_spousePartner } = usePrimaryUserId();
    const professionalTableRef = useRef();


    // DERIVED VARIABLES
    const currentUserId = selectedUser == '1' ? primaryUserId : spouseUserId;


    // USEFUL FUNCTIONS
    const prePareForAction = ( action, changeUserTo ) => {
        konsole.log("dbhdb", action, changeUserTo);
        if(changeUserTo) setselectedUser(changeUserTo);
        setpageAction(action);
        // setHideCustomeSubSideBarState(action == "VIEW" ? false : true);
    }

    const setEditProfDetailsFunc = useCallback(( profDetails ) => {
        seteditProfDetails(profDetails);
    }, [])    

    return (
        <div id="primary-care-physician" className='professional-all-css'>
            
            {/* {pageAction == "VIEW" ? */}
            <ProfessionalTable 
                key={"physician"}
                ref={professionalTableRef}
                setpageAction={prePareForAction} 
                selectedUser={selectedUser}
                userId={currentUserId}
                primaryUserId={primaryUserId}
                setEditProfDetails={setEditProfDetailsFunc}
                // proSerDesc='1'
                // proTypeId='10'
                // tableName="Primary care physicians"
                // addBtnName="Physician"
                {...profConstants.physician}
            />
            {pageAction == "EDIT" || pageAction == "ADD" ? 
                <ProfessionalForm
                    setpageAction={(action, changeUserTo) => {
                        professionalTableRef?.current?.fetchAllRequired()
                        prePareForAction(action, changeUserTo);
                    }} 
                    formType={pageAction}  // "EDIT"
                    editProfDetails={pageAction == "ADD" ? undefined : editProfDetails}
                    currentUserId={currentUserId}
                    setEditProfDetails={setEditProfDetailsFunc}
                    selectedUser = {selectedUser}
                    setselectedUser={setselectedUser}
                    handleActiveTabMain={props.handleActiveTabMain}
                    {...profConstants.physician}
                />
            : ""
            }
        </div>
    )
}

export default PrimaryCarePhysician;