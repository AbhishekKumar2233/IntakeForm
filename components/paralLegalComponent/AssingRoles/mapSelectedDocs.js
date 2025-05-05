import React, { useEffect, useState } from 'react'
import konsole from '../../control/Konsole';






function MapSelectedDocs(props) {
    const selectedLegalDocObj = props.selectedLegalDocObj;
    const documentName = props.documentName;
    const handleClick = props.handleClick;
    const legalDocIndex = props.legalDocIndex;
    const testDocIndex = props.testDocIndex;
    const testSupportDocIndex = props.testSupportDocIndex;
    const legalDocId = props.legalDocId;
    const testDocId = props.testDocId;
    const agents = props.agents;
    const testSupportDocId = props.testSupportDocId
    const selectedLegalDocumentType = props.selectedLegalDocumentType
    const memberUserId = props.memberUserId;
    const primaryUserId=sessionStorage.getItem("SessPrimaryUserId");
    const spouseUserId=sessionStorage.getItem("spouseUserId");

    //useState
    const [ showDocument, setShowDocument ] = useState(false);
    const applicableRoleName = props.applicableRoleName;
    konsole.log("borderonClick", selectedLegalDocObj,selectedLegalDocObj?.testDocId, testDocId, selectedLegalDocObj?.testSupportDocId, testSupportDocId, (selectedLegalDocObj?.legalDocId === legalDocId && selectedLegalDocObj?.testDocId === testDocId && selectedLegalDocObj?.testSupportDocId === testSupportDocId) )

    useEffect(()=>{
        if (agents.length > 0){
            // setShowDocument(true);
        }
    },[])

    return (
        <>
            <li className='d-flex align-items-center my-2'>
                <span>
                    {
                        showDocument == false ?
                            <img src='/icons/showLegal.svg' className='m-0 p-0' onClick={displaySelectedDocuments} />
                            :
                            <img src='/icons/hideDocs.svg' className='m-0 p-0' onClick={displaySelectedDocuments} />
                    }
                </span>
                <span className={`ms-2 cursor-pointer ${(selectedLegalDocObj?.legalDocId === legalDocId && selectedLegalDocObj?.testDocId === testDocId && selectedLegalDocObj?.testSupportDocId === testSupportDocId) ? 'borderOnClick' : ''}`} id="selectedLegalDocument" onClick={(e) => handleClick(e, legalDocIndex, testDocIndex, testSupportDocIndex, selectedLegalDocumentType)}>{documentName}</span>
            </li>
            {
                ((applicableRoleName !== undefined && applicableRoleName !== null)&& showDocument == true) ?
                <>
                    <li className='d-flex align-items-center my-2 ms-5'>
                        {/* <img src='/icons/showLegal.svg' className='m-0 p-0' /> */}
                        <span className='ms-2'>{applicableRoleName}</span>
                    </li>
                    <ul>
                        {
                            agents.length > 0 && agents.sort((a,b) => a.agentRankId - b.agentRankId).map((agent, index)=> {
                                const { fullName, agentRank, relationWithMember, agentUserId } = agent;
                                let relationWithMemberLocal =(legalDocId === 2  && (agentUserId === primaryUserId && memberUserId == primaryUserId) || (agentUserId === spouseUserId && memberUserId == spouseUserId))? "Self": (agentUserId === primaryUserId && memberUserId !== primaryUserId)? "Spouse" : relationWithMember;
                                return <li className='my-2 ms-5' key={index}>{(agentUserId !== null)? `${fullName} - ${relationWithMemberLocal} ${(agentRank)? `(${agentRank})` : ""}` : "NA" }</li>
                            })
                        }
                    </ul>
                </>
                    :
                    <></>
            }
        </>
    )


    function displaySelectedDocuments (e) {
        setShowDocument(!showDocument)
    }



}

export default MapSelectedDocs