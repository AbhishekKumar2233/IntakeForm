import React, { useEffect } from 'react'
import konsole from '../../control/Konsole';
import MapSelectedDocs from './mapSelectedDocs';

function SelectedLegalDocs(props) {
    const selectedLegalDocObj = props.selectedLegalDocObj;
    const legalDocs = props.legalDocs;
    const legalDocId = legalDocs.legalDocId;
    const legalDocName = legalDocs.legalDocName;
    const applicableRoleName = legalDocs.applicableRoleName;
    const legalDocIndex = props.index;
    const checked = legalDocs.checked;
    const memberUserId = props.memberUserId
    const testamentaryDocs = legalDocs.testamentaryDocs;
    const testamentarySupportDocs = legalDocs.testamentarySupportDocs;
    const handleClick = props.handleLegalDocClick;
    const agents = legalDocs?.agents ?? [];


  return (
      <div key={legalDocIndex}>
          {
              (checked == true) ?
                  <>
                      <MapSelectedDocs selectedLegalDocObj={selectedLegalDocObj} documentName={legalDocName} applicableRoleName={applicableRoleName} legalDocIndex={legalDocIndex} testDocIndex={-1} handleClick={handleClick} legalDocId={legalDocId} agents={agents} selectedLegalDocumentType="legalDocs" memberUserId={memberUserId}/>
                  </>
                  :
                  <></>
          }
          {testamentaryDocs.length > 0 && testamentaryDocs.map((list, index) => {
              const agents = list?.agents ?? [];
              return (list.testamentaryDocsChecked == true) ?
                  <div className='ms-4' key={index}>
                      <MapSelectedDocs documentName={`${legalDocName} - ${list.testDocName}`} legalDocIndex={legalDocIndex} applicableRoleName={list.applicableRoleName} testDocIndex={index} handleClick={handleClick} selectedLegalDocObj={selectedLegalDocObj} legalDocId={list.legalDocId} testDocId={list.testDocId} agents={agents} testSupportDocIndex={-1} selectedLegalDocumentType="testamentaryDocs" memberUserId={memberUserId}/>
                  </div>
                  :
                  <></>
          }
          )}
          {testamentarySupportDocs.length > 0 && testamentarySupportDocs.map((list, index) => {
              const agents = list?.agents ?? [];
              if (list.testamentarySupportDocsChecked == true) {
                  konsole.log(list, "testamentSupportDocs")
              }
              return (list.testamentarySupportDocsChecked == true) ?
                  <div className='ms-4' key={index}>
                      <MapSelectedDocs documentName={`${legalDocName} - ${list.testSupportDocName}`} legalDocIndex={legalDocIndex} applicableRoleName={list.applicableRoleName} testDocIndex={-1} testSupportDocIndex={index} handleClick={handleClick} selectedLegalDocObj={selectedLegalDocObj} legalDocId={list.legalDocId} testDocId={list.testDocId} testSupportDocId={list.testSupportDocId} agents={agents} selectedLegalDocumentType="testamentarySupportDocs" memberUserId={memberUserId}/>
                  </div>
                  :
                  <></>
          }
          )}
    </div>
  )
}

export default SelectedLegalDocs