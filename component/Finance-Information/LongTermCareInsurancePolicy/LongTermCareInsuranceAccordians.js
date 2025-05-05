import React from 'react'
import { useState, useCallback, useRef, useEffect, useContext } from 'react'
import { Row, Form, Col } from 'react-bootstrap'
import { CustomAccordion, CustomAccordionBody } from '../../Custom/CustomAccordion'
import { CustomButton, CustomButton2, CustomButton3 } from '../../Custom/CustomButton'
import { CustomCheckBoxForCopyToSpouseData } from '../../Custom/CustomComponent'
import { isContent } from '../../Personal-Information/PersonalInformation'
import { $JsonHelper } from '../../Helper/$JsonHelper'
import { postApiCall2 } from '../../../components/Reusable/ReusableCom'
import { $Service_Url } from '../../../components/network/UrlPath'
import { setHideCustomeSubSideBarState, useLoader } from '../../utils/utils'
import PolicyPremiumInfo from './PolicyPremiumInfo'
import BenefitInfo from './BenefitInfo'
import InflationProtection from './InflationProtection'
import UploadAssetsFile from '../../Common/File/UploadAssetsFile'
import konsole from '../../../components/control/Konsole'
import usePrimaryUserId from '../../Hooks/usePrimaryUserId'
import { $AHelper } from '../../Helper/$AHelper'
import { globalContext } from '../../../pages/_app'
import AdditionalDetails from './AdditionalDetails'

export const isContentpremium = `Provide details about your long-term care policy. This information helps assess how well your policy supports your retirement planning goals, ensuring that your coverage aligns with your aging needs and protecting against high healthcare costs.`
export const isContentBenefit = `Enter the benefit details of your long-term care policy. Understanding your benefits helps understand that your coverage supports your care preferences, whether at home or in other settings, reinforcing your plan to avoid institutional care and maintain independence.`
export const isContentInflation = `Specify whether your policy includes inflation protection. This feature is critical for maintaining the value of your benefits over time, safeguarding your ability to access the care you need as costs rise, and supporting your overall strategy for secure and dignified aging.`
export const isContentDocuments = `Upload any relevant documents related to your long-term care policy. Providing these documents ensures that all necessary information is available for a comprehensive review of your coverage and supports accurate alignment with your retirement planning goals.`
export const isContentAddtional = `Explore additional options or features available within your long-term care policy. These options could provide extra flexibility and support in your retirement planning, helping you customize your coverage based on personal needs and preferences for future care.`

const allkeys = ["0", "1", "2", "3", "4"]

const LongTermCareInsuranceAccordians = ({ addLongTermInsFor, setActiveTypeToPrevious, setEditInfo, handleAddAnother, type, editInfo, fetchAddedSpouseLongTermInsuranceList, fetchAddedPrimaryMemLongTermInsuranceList, handleActiveTabButton, handleActiveTab }) => {
  // const [activeAccordian, setActiveAccordian] = useState('Policy');
  const [isSameAsSpouse, setIsSameAsSpouse] = useState('')
  const [samePremFreqForSpouse, setSamePremFreqForSpouse] = useState(null)
  const [samePrmAmtForSpouse, setSamePrmAmtForSpouse] = useState("")
  const longTermInsValidateRef = useRef(null);
  const [longTermInsPolDetails, setLongTermInsPolDetails] = useState({ ...$JsonHelper.createLongTermInsurancePolicy() })
  const { primaryUserId, spouseUserId, loggedInUserId, spouseFullName, primaryMemberFullName, isPrimaryMemberMaritalStatus, _spousePartner, spouseFirstName } = usePrimaryUserId();
  const uploadLongTermInsFileRef = useRef(null);
  const insRef = useRef(null);
  const insCompanyRef = useRef(null);
  const { setWarning } = useContext(globalContext)

  const [activeKeys, setActiveKeys] = useState(["0"]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


  konsole.log("longTermInsPolDetails1212", longTermInsPolDetails)

  let _accordia1Name = 'Policy & Premium Information'
  let _accordia2Name = 'Benefit Information';
  let _accordia3Name = 'Inflation Protection';
  let _accordia4Name = 'Document Upload';
  let _accordia5Name = 'Additional options'
  let details = {
    heading: "Upload Policy Documents",
    Type: longTermInsPolDetails?.insType
  }

  // @@ data update for edit 
  useEffect(() => {
    if (type == 'EDIT' && $AHelper.$isNotNullUndefine(editInfo)) {
      updateInsDetails(editInfo)
    } else {
      setLongTermInsPolDetails({ ...$JsonHelper.createLongTermInsurancePolicy(), 'createdBy': loggedInUserId })
    }
  }, [type, addLongTermInsFor, editInfo, loggedInUserId])

  // @@ state update with edit details
  const updateInsDetails = (details) => {
    konsole.log("editInfoeditInfoeditInfo", details);
    setLongTermInsPolDetails(prev => ({
      ...prev, ...details, 'updatedBy': loggedInUserId
    }))
  }

  const saveData = async (btnType) => {
    setIsButtonDisabled(true)
    const isValidate = await longTermInsValidateRef.current.validateLongTermInc()
    konsole.log("useImperativeHanldeFunc", longTermInsValidateRef.current, isValidate)
    if (!isValidate) {
      let msg = ' Fields cannot be blank, please fill in the details.'
      toasterAlert("warning", "Warning", msg);
      setIsButtonDisabled(false)
      setActiveKeys(["0"]); 
      return;
    }

    // @@ File upload Document
    {
      useLoader(true)
      const userID = addLongTermInsFor == "Spouse" ? spouseUserId : primaryUserId
      const _fileUpload = await uploadLongTermInsFileRef.current.saveUploadUserDocument(userID);
      useLoader(false)
      konsole.log("_fileUpload", _fileUpload);
      if (_fileUpload != 'no-file') {
        let fileId = _fileUpload?.fileId;
        let documentName = _fileUpload?.userFileName;
        let documentPath = _fileUpload?.fileURL;
        if (_fileUpload == 'file-delete') {
          fileId = null;
          documentName = longTermInsPolDetails?.longTermInsDocs[0]?.documentName;
          documentPath = longTermInsPolDetails?.longTermInsDocs[0]?.documentPath;
        }
        let longTerminsDocumentsJson = [{ documentName, documentPath, fileId: fileId }]
        if (longTermInsPolDetails?.longTermInsDocs?.length > 0) {
          longTerminsDocumentsJson[0]['userLongTermInsDocId'] = longTermInsPolDetails?.longTermInsDocs[0]?.userLongTermInsDocId
        }
        longTermInsPolDetails['longTermInsDocs'] = longTerminsDocumentsJson;
      }
    }

    let method;
    let url;
    let addLongTermInsResponse;
    if (type == 'EDIT') {
      const { userLongTermInsId, createdBy, createdOn, ...rest } = longTermInsPolDetails
      method = 'PUT'
      url = $Service_Url.updateUserLongTerm;
      let updateLongTermInsJson = {
        userId: addLongTermInsFor == "Spouse" ? spouseUserId : primaryUserId,
        longTermIns: { ...rest },
        userLongTermInsId: userLongTermInsId,
      }
      addLongTermInsResponse = await postApiCall2(method, $Service_Url.updateUserLongTerm, updateLongTermInsJson)
      toasterAlert("successfully", "Successfully updated data", "Your data have been updated successfully")
    }
    if (type == "ADD") {
      method = 'POST'
      url = $Service_Url.postUserLongTermIns;
      let addLongTermInsJson = {
        userId: addLongTermInsFor == "Spouse" ? spouseUserId : primaryUserId,
        longTermIns: longTermInsPolDetails,
      }
      addLongTermInsResponse = await postApiCall2(method, url, addLongTermInsJson)
      if (isSameAsSpouse == true) {
        if (samePremFreqForSpouse == true) {
          addLongTermInsJson.longTermIns["premiumAmount"] = samePrmAmtForSpouse
        }
        else {
          addLongTermInsJson.longTermIns["premiumAmount"] = null
        }
        addLongTermInsJson["userId"] = spouseUserId;
        await postApiCall2(method, url, addLongTermInsJson)
      }
      toasterAlert("successfully", "Successfully saved data", "Your data have been saved successfully")
    }
    fetchAddedPrimaryMemLongTermInsuranceList()
    fetchAddedSpouseLongTermInsuranceList()

    // @@ for add/update other Value
    {
      let isSameAsSpouseUserId = isSameAsSpouse == true ? spouseUserId : ''
      const userLongTermInsId = addLongTermInsResponse?.response?.data?.data?.longTermIns[0]?.userLongTermInsId
      konsole.log("addLongTermInsResponse11", addLongTermInsResponse, userLongTermInsId)
      if (longTermInsPolDetails?.insTypeId == "999999") {
        let result = await insRef.current.saveHandleOther(userLongTermInsId, isSameAsSpouseUserId);
        konsole.log("resultOther", result)
      }
      if (longTermInsPolDetails?.insCompanyId == "999999") {
        let result = await insCompanyRef.current.saveHandleOther(userLongTermInsId, isSameAsSpouseUserId);
        konsole.log("resultOther", result)
      }
    }

    $AHelper.$scroll2Top();
    // @@ add another insurance btn
    if (btnType == 'another') {
      // const _fileUpload = await uploadLongTermInsFileRef.current.saveNAddAnother();
      setLongTermInsPolDetails({ ...$JsonHelper.createLongTermInsurancePolicy(), 'createdBy': loggedInUserId })
      setIsSameAsSpouse('')
      setSamePremFreqForSpouse(null)
      setActiveKeys(["0"]); 
    }
    else if (btnType == "next") {
      if (type == 'ADD') {
        if (addLongTermInsFor == "Personal" && isPrimaryMemberMaritalStatus) {
          handleActiveTabButton("Spouse")
          handlePreviousBtn()
        } else {
          //  go to the future expectation
          handleActiveTab(17)
        }
      } else {
        // this is for clear edit details and  previous btn
        handlePreviousBtn()
      }
    }
    else {
      handleActiveTabButton(addLongTermInsFor)
      handlePreviousBtn()
    }
    handleAllClear()
    setHideCustomeSubSideBarState(false)
    setIsButtonDisabled(false)
  }

  const handleSameAsSpouseCheckBox = (e) => {
    const eventChecked = e.target.checked;
    setIsSameAsSpouse(eventChecked)
  }

  // @@ reset All field
  const handleAllClear = async () => {
    const _fileUpload = await uploadLongTermInsFileRef.current?.saveNAddAnother();
    setLongTermInsPolDetails("")
  }

  const handlePreviousBtn = () => {
    setActiveTypeToPrevious('Table')
    setEditInfo('')
    setHideCustomeSubSideBarState(false)
    // handleAddAnother('')
  }

  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  }

  const savedDocDetails = () => {
    return longTermInsPolDetails?.longTermInsDocs?.length > 0 ? longTermInsPolDetails.longTermInsDocs?.filter((item) => item.fileId !== null) : []
  }


  const handleAccordionClick = () => {
    setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
};

const handleAccordionBodyClick = (key) => {
    setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
};

  console.log("addLongTermInsFor",addLongTermInsFor)

  return (
    <>
    

      <Row>
        <div className='mt-0'>
          <CustomAccordion key="Policy"
            isExpendAllbtn={true}
            handleActiveKeys={handleAccordionClick}
            activeKeys={activeKeys}
            allkeys={allkeys}
            activekey={activeKeys}
            header={<Row className="progress-container mb-1 previous-btn mt-4">
              <div onClick={() => handlePreviousBtn()}>
                <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer me-1" />
                <span className='ms-1'> Previous</span>
              </div>
            </Row>}

          >
            {(addLongTermInsFor =='Personal' && isPrimaryMemberMaritalStatus && type != 'EDIT') && <div className='mb-2 py-2'>
              <CustomCheckBoxForCopyToSpouseData startTabIndex={1} className="d-inline-block" type="checkbox"
                onChange={(event) => { handleSameAsSpouseCheckBox(event) }} value={isSameAsSpouse} name="SameSpouseData" placeholder={`Copy same data to ${_spousePartner}`} />
            </div>}
            <CustomAccordionBody eventkey='0' name={_accordia1Name} setActiveKeys={() => handleAccordionBodyClick('0')}>
              <PolicyPremiumInfo
                startTabIndex={2}
                ref={longTermInsValidateRef}
                refrencePage='Policy&PremiumInformation'
                activeAccordian="Policy"
                action='EDIT'
                isSideContent={isContentpremium}
                dataInfo={longTermInsPolDetails}
                addLongTermInsFor={addLongTermInsFor}
                setLongTermInsPolDetails={setLongTermInsPolDetails}
                insCompanyRef={insCompanyRef}
                insRef={insRef}
              />
            </CustomAccordionBody>
            <CustomAccordionBody eventkey='1' name={_accordia2Name} setActiveKeys={() => handleAccordionBodyClick('1')}>


              <BenefitInfo
                startTabIndex={2 + 9}
                refrencePage='BenefitInformation'
                activeAccordian="Policy"
                isSideContent={isContentBenefit}
                dataInfo={longTermInsPolDetails}
                setLongTermInsPolDetails={setLongTermInsPolDetails}
                addLongTermInsFor={addLongTermInsFor}
              />

            </CustomAccordionBody>
            <CustomAccordionBody eventkey='2' name={_accordia3Name} setActiveKeys={() => handleAccordionBodyClick('2')}>
              <InflationProtection
                startTabIndex={2 + 9 + 5}
                refrencePage='InflationProtection'
                activeAccordian="Policy"
                isSideContent={isContentInflation}
                dataInfo={longTermInsPolDetails}
                addLongTermInsFor={addLongTermInsFor}
                setLongTermInsPolDetails={setLongTermInsPolDetails}
              />
            </CustomAccordionBody>
            <CustomAccordionBody eventkey='3' name={_accordia4Name} setActiveKeys={() => handleAccordionBodyClick('3')}>
              <Row className='mb-3'>
                <Col xs={12} md={12} lg={12} xl={3}><p className="heading-of-sub-side-links-3"> {isContentDocuments}</p></Col>
                <Col className='mt-3' xs={12} md={12} xl={9}>
                  <UploadAssetsFile
                    startTabIndex={2 + 9 + 5 + 3}
                    ref={uploadLongTermInsFileRef}
                    savedDocuments={savedDocDetails()}
                    refrencePage='LongTermCarePolicy'
                    details={details}
                  />
                </Col>
              </Row>
            </CustomAccordionBody>
            {(type == "ADD" && addLongTermInsFor == "Personal" && isPrimaryMemberMaritalStatus && isSameAsSpouse == true) &&
              <CustomAccordionBody eventkey='4' name={_accordia5Name} setActiveKeys={setActiveKeys} onClick={() => console.log("eventkey : 4")}>
              <Row className='mb-2' >
                <Col xs={12} md={12} lg={12} xl={3}><p className='heading-of-sub-side-links-3'> {isContentAddtional}</p></Col>
                <Col xs={12} md={12} lg={12} xl={9}>
                <AdditionalDetails  startTabIndex={2 + 9 + 5 + 3 + 1} setSamePremFreqForSpouse={setSamePremFreqForSpouse} samePremFreqForSpouse={samePremFreqForSpouse} isSameAsSpouse={isSameAsSpouse} setSamePrmAmtForSpouse={setSamePrmAmtForSpouse} samePrmAmtForSpouse={samePrmAmtForSpouse} />
                </Col>
              </Row>
              </CustomAccordionBody>
            }
          </CustomAccordion>
        </div>
      </Row>
      <Row style={{ marginTop: '24px' }}>
        <div className='d-flex justify-content-between mb-3'>
          <div>{(type == 'ADD') && <CustomButton2 tabIndex={2 + 9 + 5 + 3 + 1 + 2} label="Save & Continue later" onClick={() => saveData('later')} disabled={isButtonDisabled} />}</div>
          <div>
            {(type == 'ADD') &&
              <CustomButton3 tabIndex={2 + 9 + 5 + 3 + 1 + 2 + 1} label={'Save & Add Another'}
                disabled={isButtonDisabled}
                onClick={() => saveData('another')}
              />
            }
            <CustomButton tabIndex={2 + 9 + 5 + 3 + 1 + 2 + 1 + 1} label={`${(type == 'EDIT') ? 'Update' : (addLongTermInsFor == "Personal" && isPrimaryMemberMaritalStatus) ? `Save & Proceed To ${spouseFirstName}` : 'Save & Proceed To Future Expectations'}`} onClick={() => saveData('next')} disabled={isButtonDisabled} />
          </div>
        </div>
      </Row>
    </>
  )
}

export default LongTermCareInsuranceAccordians