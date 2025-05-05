import React, { useEffect, useState } from 'react'
import konsole from '../../control/Konsole';

function ListLegalDocuments(props) {
    const [showTestamentoryList, setShowTestamentoryList] = useState({
        checked: false,
        showDocuments: false
    });
    const [showTestamentarySupportList, setShowTestamentarySupportList] = useState({
        checked: false,
        showDocuments: false
    });
    
    const legalDocs = props.legalDocs;
    const legalDocId = legalDocs.legalDocId;
    const legalDocName = legalDocs.legalDocName;
    const ownershipId = legalDocs.ownershipId;
    const ownershipName = legalDocs.ownershipName;
    const applicableRoleId = legalDocs.applicableRoleId;
    const applicableRoleName = legalDocs.applicableRoleName;
    const legalDocIndex = props.index;
    const showSubLegalDocument = legalDocs.showSubLegalDocument;
    const checked = legalDocs.checked;
    const testamentaryDocs = legalDocs.testamentaryDocs;
    const testamentarySupportDocs = legalDocs.testamentarySupportDocs;
    const handleChange = props.handleChange
    const handleClick = props.handleClick
    konsole.log("propsshow", legalDocs);


    useEffect(()=>{
        if(legalDocs?.showTestamentoryDocuments){
            setShowTestamentoryList((prev) => { return { ...prev, checked: legalDocs?.showTestamentoryDocuments } })
        }
        else{
            setShowTestamentoryList((prev) => { return { ...prev, checked: false } })
        }
    }, [legalDocs?.showTestamentoryDocuments])

    useEffect(() => {
        if (legalDocs?.showTestamentoryDocuments) {
            setShowTestamentarySupportList((prev) => { return { ...prev, checked: legalDocs?.showTestamentoryDocuments } })
        }
        else{
            setShowTestamentarySupportList((prev) => { return { ...prev, checked: false } })
        }
    }, [legalDocs?.showTestamentoryDocumentsSupport])
    



    const toggleSelection = (name, toggleText, callback) => {
        return <span><a name={name} onClick={callback}>{toggleText}</a></span>
    }

    
  return (
    <>
          <div className='d-flex gap-3 my-1 align-items-center'>
              <input
                  className="form-check-input "
                  type="checkbox"
                  id="selectedLegalDoc"
                  value={legalDocId}
                  checked={checked}
                  onChange={(e) => handleChange(e, legalDocIndex)}
              />
              {
                  (testamentaryDocs.length > 0 || testamentarySupportDocs.length > 0) ?
                      (showSubLegalDocument == true) ? 
                        <img src="/icons/openDropDown.svg" name="showSubLegalDocument" className='m-0 p-0' onClick={(e) => handleClick(e, legalDocIndex, showSubLegalDocument)} /> 
                          : (showSubLegalDocument == false)?
                              <img src="/icons/closeDropDown.svg" name="showSubLegalDocument" className='m-0 p-0' onClick={(e) => handleClick(e, legalDocIndex, showSubLegalDocument)} />
                          :
                          <></>
                          
                :<></>
              }
              <label
                  className="ms-1"
                  style={{ cursor: "pointer" }}
              >
                  {legalDocName}
              </label>

              { (testamentaryDocs.length > 0 && testamentarySupportDocs.length > 0)?
                    <></>
                :
                (testamentaryDocs.length > 0 && testamentarySupportDocs.length === 0)?
                    (legalDocs.checked == true) ? 
                        testamentaryDocs.every(d => d.testamentaryDocsChecked === true) ? 
                        toggleSelection("unSelectAllTestamentoryDocs", "Unselect All",(e) => handleClick(e, legalDocIndex))
                        : toggleSelection("selectAllTestamentoryDocs", "Select all",(e) => handleClick(e, legalDocIndex))
                    :<></>
                :
                (testamentaryDocs.length === 0 && testamentarySupportDocs.length > 0)?
                testamentarySupportDocs.every(d => d.testamentarySupportDocsChecked === true) ? 
                    toggleSelection("unSelectAllTestamentorSupportyDocs", "Unselect All",(e) => handleClick(e, legalDocIndex))
                    : toggleSelection("selectAllTestamentorSupportyDocs", "Select all",(e) => handleClick(e, legalDocIndex))
                :<></>
              }
          </div>
              {
              (testamentaryDocs.length > 0 && testamentarySupportDocs.length > 0) &&
                  <>
                      {
                          testamentaryDocs.length > 0 && showSubLegalDocument == true &&
                          <div className='ms-4'>
                              <div className='d-flex gap-3 my-1 align-items-center'>
                                  <input
                                      className="form-check-input "
                                      type="checkbox"
                                      checked={showTestamentoryList.checked}
                                      onChange={(e) => {
                                        if(e.target.checked){
                                            setShowTestamentoryList((prev) => { return { showDocuments: true, checked: !prev.checked } })
                                        }
                                        else{
                                            setShowTestamentoryList((prev) => { return { showDocuments: false, checked: !prev.checked } })
                                        }
                                      }}
                                  />
                                  {
                                      (testamentaryDocs.length > 0) ?
                                          (showTestamentoryList.showDocuments == true) ?
                                              <img src="/icons/openDropDown.svg" name="showSubLegalDocument" className='m-0 p-0' onClick={(e) => setShowTestamentoryList((prev) => { return { ...prev, showDocuments: !prev.showDocuments } })} />
                                              : (showTestamentoryList.showDocuments == false) ?
                                                  <img src="/icons/closeDropDown.svg" name="showSubLegalDocument" className='m-0 p-0' onClick={(e) => setShowTestamentoryList((prev) => { return { ...prev, showDocuments: !prev.showDocuments } })} />
                                                  :
                                                  <></>

                                          : <></>
                                  }
                                  <label
                                      className="ms-1"
                                      style={{ cursor: "pointer" }}
                                  >
                                      Testamentary Documents
                                  </label>

                                  {
                                      (testamentaryDocs.length > 0 && showTestamentoryList.checked == true) ? 
                                      testamentaryDocs.every(d => d.testamentaryDocsChecked === true) ? 
                                      toggleSelection("unSelectAllTestamentoryDocs", "Unselect All",(e) => handleClick(e, legalDocIndex))
                                      : toggleSelection("selectAllTestamentoryDocs", "Select all",(e) => handleClick(e, legalDocIndex))
                                      : <></>
                                  }
                              </div>
                              {
                                  showTestamentoryList.showDocuments === true ?
                                      <div className="d-flex ps-2">
                                          <ul className="subDocumentContainer">
                                              {testamentaryDocs.length > 0 && testamentaryDocs.map(
                                                  (list, index) => {
                                                      konsole.log("IndExLength", list);
                                                      return (
                                                          <li className="d-flex liii" key={index}>
                                                              <img
                                                                  className="treeimgShow"
                                                                  src="/images/tree.png"
                                                              ></img>
                                                              <div class="form-check pt-1 ms-4 d-flex">
                                                                  <input
                                                                      class="form-check-input "
                                                                      type="checkbox"
                                                                      id='testamentaryDocs'
                                                                      onChange={(e) => handleChange(e, legalDocIndex, index)}
                                                                      checked={list.testamentaryDocsChecked}
                                                                  />
                                                                  <label
                                                                      class="form-check-label mt-1 ms-1 d-flex"
                                                                      id={list.applicableRoleId}
                                                                      name={list.testDocName}
                                                                  >
                                                                      {list.testDocName}
                                                                  </label>
                                                              </div>
                                                          </li>
                                                      );
                                                  }
                                              )}
                                          </ul>
                                      </div>
                                      : <></>
                              }
                          </div>
                      }

                      {
                          testamentarySupportDocs?.length > 0 && showSubLegalDocument == true &&
                          <div className='ms-4'>
                              <div className='d-flex gap-3 align-items-center'>
                                  <input
                                      className="form-check-input "
                                      type="checkbox"
                                      checked={showTestamentarySupportList.checked}
                                      onChange={(e) => 
                                      {
                                        if(e.target.checked){
                                            setShowTestamentarySupportList((prev) => { return { showDocuments: true, checked: !prev.checked } })
                                        }
                                        else{
                                            setShowTestamentarySupportList((prev) => { return { showDocuments: false, checked: !prev.checked } })
                                        }
                                      }
                                    }
                                  />
                                  {
                                      (testamentarySupportDocs.length > 0) ?
                                          (showTestamentarySupportList.showDocuments == true) ?
                                              <img src="/icons/openDropDown.svg" name="showSubLegalDocument" className='m-0 p-0' onClick={(e) => setShowTestamentarySupportList((prev) => { return { ...prev, showDocuments: !prev.showDocuments } })} />
                                              : (showTestamentarySupportList.showDocuments == false) ?
                                                  <img src="/icons/closeDropDown.svg" name="showSubLegalDocument" className='m-0 p-0' onClick={(e) => setShowTestamentarySupportList((prev) => { return { ...prev, showDocuments: !prev.showDocuments } })} />
                                                  :
                                                  <></>

                                          : <></>
                                  }
                                  <label
                                      className="ms-1"
                                      style={{ cursor: "pointer" }}
                                  >
                                      Ancillary Documents
                                  </label>

                                  {
                                      (testamentarySupportDocs.length > 0 && showTestamentarySupportList.checked == true) ? 
                                      testamentarySupportDocs.every(d => d.testamentarySupportDocsChecked === true) ? 
                                        toggleSelection("unSelectAllTestamentorSupportyDocs", "Unselect All",(e) => handleClick(e, legalDocIndex))
                                        : toggleSelection("selectAllTestamentorSupportyDocs", "Select all",(e) => handleClick(e, legalDocIndex))
                                      : <></>
                                  }
                              </div>
                              <div className="d-flex ps-2">
                                  <ul className="subDocumentContainer">
                                      {showTestamentarySupportList.showDocuments == true && testamentarySupportDocs.length > 0 && testamentarySupportDocs.map(
                                          (list, index) => {
                                              konsole.log("IndExLength", list);
                                              return (
                                                  <li className="d-flex liii" key={index}>
                                                      <img
                                                          className="treeimgShow"
                                                          src="/images/tree.png"
                                                      ></img>
                                                      <div class="form-check pt-1 ms-4 d-flex">
                                                          <input
                                                              class="form-check-input "
                                                              type="checkbox"
                                                              id='testamentarySupportDocs'
                                                              onChange={(e) => handleChange(e, legalDocIndex, index)}
                                                              checked={list.testamentarySupportDocsChecked}
                                                          />
                                                          <label
                                                              class="form-check-label mt-1 ms-1 d-flex"
                                                              id={list.applicableRoleId}
                                                              name={list.testSupportDocName}
                                                          >
                                                              {list.testSupportDocName}
                                                          </label>
                                                      </div>
                                                  </li>
                                              );
                                          }
                                      )}
                                  </ul>
                              </div>
                          </div>
                      }
                  </>
              }
              {
              (testamentaryDocs.length > 0 && testamentarySupportDocs.length === 0) &&
              <>
                  {
                      testamentaryDocs.length > 0 && showSubLegalDocument == true &&
                      <div className="d-flex ps-2">
                          <ul className="subDocumentContainer">
                              {testamentaryDocs.length > 0 && testamentaryDocs.map(
                                  (list, index) => {
                                      konsole.log("IndExLength", list);
                                      return (
                                          <li className="d-flex liii" key={index}>
                                              <img
                                                  className="treeimgShow"
                                                  src="/images/tree.png"
                                              ></img>
                                              <div class="form-check pt-1 ms-4 d-flex">
                                                  <input
                                                      class="form-check-input "
                                                      type="checkbox"
                                                      id='testamentaryDocs'
                                                      onChange={(e) => handleChange(e, legalDocIndex, index)}
                                                      checked={list.testamentaryDocsChecked}
                                                  />
                                                  <label
                                                      class="form-check-label mt-1 ms-1 d-flex"
                                                      id={list.applicableRoleId}
                                                      name={list.testDocName}
                                                  >
                                                      {list.testDocName}
                                                  </label>
                                              </div>
                                          </li>
                                      );
                                  }
                              )}
                          </ul>
                      </div>
                  }
              </>
            }

            {
                (testamentaryDocs.length === 0 && testamentarySupportDocs.length > 0) &&
                <>
                    {
                        testamentarySupportDocs?.length > 0 && showSubLegalDocument == true &&
                        <div className="d-flex ps-2">
                            <ul className="subDocumentContainer">
                                {showTestamentarySupportList.showDocuments == true && testamentarySupportDocs.length > 0 && testamentarySupportDocs.map(
                                    (list, index) => {
                                        konsole.log("IndExLength", list);
                                        return (
                                            <li className="d-flex liii" key={index}>
                                                <img
                                                    className="treeimgShow"
                                                    src="/images/tree.png"
                                                ></img>
                                                <div class="form-check pt-1 ms-4 d-flex">
                                                    <input
                                                        class="form-check-input "
                                                        type="checkbox"
                                                        id='testamentarySupportDocs'
                                                        onChange={(e) => handleChange(e, legalDocIndex, index)}
                                                        checked={list.testamentarySupportDocsChecked}
                                                    />
                                                    <label
                                                        class="form-check-label mt-1 ms-1 d-flex"
                                                        id={list.applicableRoleId}
                                                        name={list.testSupportDocName}
                                                    >
                                                        {list.testSupportDocName}
                                                    </label>
                                                </div>
                                            </li>
                                        );
                                    }
                                )}
                            </ul>
                        </div>
                    }
                </>
              }
    </>
  )
}

export default ListLegalDocuments