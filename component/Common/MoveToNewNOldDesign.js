import React, { useMemo, memo } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { $AHelper } from '../Helper/$AHelper';
import { Nav } from 'react-bootstrap';
import { useResetStore } from '../utils/utils';
const MoveToNewNOldDesign = (props) => {
    let btnLabel = 'Try new look'
    const { refrencePage, action, type } = props;

    const tooltiplabel = useMemo(() => {
        return action == 'new' ? 'New Design' : 'Old Design'
    }, [action])


    const handleMoveTo = (type) => {
        if (action == 'new' && type == action) {
            useResetStore();
            $AHelper.$newDashboardRoute();
        } else if (action == 'old' && type == action) {
            $AHelper.$oldDashboardRoute()
        }
    }

    const backforwardIcon = useMemo(() => {
        return action == 'new' ? '/New/icons/Arrow-white.svg' : "/icons/backbtn.svg"
    }, [action])

    //    src="/icons/backbtn.svg"
    return (
        <>
            {(refrencePage == 'viewprofile' && type == 'LPO') ? <>

                <div className="btn-divNew addBorderToToggleButton_1 m-2">
                <button className={`view-btn_1 ${action !== 'old' ? "active selectedToglleBorder_1" : "view-btn_2 "}`} onClick={() => handleMoveTo('old')}>Old Design </button>
                <button className={`view-btn_1 ${action !== 'new' ? "active selectedToglleBorder_1" : "view-btn_2"}`} onClick={() => handleMoveTo('new')}>New Design</button>
                </div>

            </> :
                (refrencePage == 'viewprofile' && type == 'Intake') ? <>
                   
                <div className="btn-divNew addBorderToToggleButton_1 m-2">
                <button className={`view-btn_1 ${action !== 'old' ? "active selectedToglleBorder_1" : "view-btn_2 "}`} onClick={() => handleMoveTo('old')}>Old Design </button>
                <button className={`view-btn_1 ${action !== 'new' ? "active selectedToglleBorder_1" : "view-btn_2"}`} onClick={() => handleMoveTo('new')}>New Design</button>
              </div>
                    
                </> : (refrencePage == 'SetupSidebar') ? <>

                <div className="btn-divNew newIntakeBTN  addBorderToToggleButton_1" style={{marginTop:"10px"}}>
                <button className={`view-btn_1 ${action !== 'old' ? "active selectedToglleBorder_1" : "view-btn_2"}`} onClick={() => handleMoveTo('old')}>Old Design</button>
                <button className={`view-btn_1 ${action !== 'new' ? "active selectedToglleBorder_1" : "view-btn_2"}`} onClick={() => handleMoveTo('new')}>New Design</button>
              </div>
              {/* <hr className='' style={{color:"#F5F5F540", width: "50%", margin: "10px auto", }}/> */}

                </> : <>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld"> {tooltiplabel} </Tooltip>} >
                        <span className="d-inline-block" onClick={() => handleMoveTo()}>
                            <img className='backbutton-cls' style={{ cursor: "pointer", width: "25px" }} src={backforwardIcon} />
                        </span>
                    </OverlayTrigger>
                </>}

        </>
    )
}

export default memo(MoveToNewNOldDesign);
