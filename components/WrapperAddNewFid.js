import React from 'react'
import { useState } from 'react'
import { Button, Col } from 'react-bootstrap';
import Childdetails from './childdetails';
import konsole from './control/Konsole';

export default function WrapperAddNewFid(props) {
    const [showEditChildpopup, setShowEditChildpopup] =  useState(false);

    function handleEditChildPopupClose(){
        if(props.callbackApi){
            props.callbackApi();
        }
        setShowEditChildpopup(false);
    }

    return  <>
            <Button
                onClick={() => setShowEditChildpopup(true)}
            className="Add-more-fiduciary"  
            >
                Add {props.addedText}
            </Button>

        {
            showEditChildpopup === true ?
                <Childdetails
                    handleEditPopupClose={handleEditChildPopupClose}
                    show={showEditChildpopup}
                    UserID={props.memberUserId + "|" + (props?.text ? props?.text : 'Extended Family / Friends')}
                    refrencePage={props?.refrencepage}
                />
                : <></>
        }
    </>
}
