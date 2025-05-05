import React, { useEffect, useState } from 'react'
import { isNotValidNullUndefile, getApiCall, deceaseMemberStatusId, specialNeedMemberStatusId } from '../Reusable/ReusableCom'
import { $Service_Url } from '../network/UrlPath'
import konsole from '../control/Konsole';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


const AssignAgentDecease = ({ memberUserId }) => {
    const [memberStatusId, setMemberStatusId] = useState(null)

    useEffect(() => {
        if (isNotValidNullUndefile(getMemberByUserId)) {
            getMemberByUserId(memberUserId)
        }
    }, [memberUserId])


    const getMemberByUserId = async () => {
        const result = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + memberUserId);
        konsole.log('result', result)
        if (result != 'err') {
            setMemberStatusId(result?.member?.memberStatusId)
        } else {
            setMemberStatusId(null)
        }
    }

    const msgObj = {
        2: "As the fiduciary member living status changed to deceased, please remove the deceased member from the documents.",
        3: "As the fiduciary member living status changed to special needs, please remove the special needs member from the documents."
    }

    return <>
        {(memberStatusId == deceaseMemberStatusId || memberStatusId == specialNeedMemberStatusId) &&
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabeld">{msgObj[Number(memberStatusId)]}</Tooltip>} >
                <img style={{ cursor: "pointer", width: "20px", marginBottom: ".30rem", marginLeft: "2px" }} src="/icons/vectorinfo.svg" />
            </OverlayTrigger>}
    </>
}

export default AssignAgentDecease