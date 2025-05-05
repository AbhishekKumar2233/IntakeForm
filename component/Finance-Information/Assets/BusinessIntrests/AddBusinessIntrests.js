import React, { useEffect, useMemo, useState, useContext, useRef } from 'react';
import { Row, Table, Col, Tab } from 'react-bootstrap';
import { CustomAccordion, CustomAccordionBody } from '../../../Custom/CustomAccordion';
import BusinessInfo from './BusinessInfo';
import ContactAndAddress from '../../../Custom/Contact/ContactAndAddress';
import UploadAssetsFile from '../../../Common/File/UploadAssetsFile';
import { $AHelper } from '../../../Helper/$AHelper';
import { focusInputBox, getApiCall, postApiCall } from '../../../../components/Reusable/ReusableCom';
import usePrimaryUserId from '../../../Hooks/usePrimaryUserId';
import { setHideCustomeSubSideBarState, useLoader } from '../../../utils/utils';
import { $Msg_BusinessIntrest, contentObject } from '../../../Helper/$MsgHelper';
import { globalContext } from '../../../../pages/_app';
import { CustomButton, CustomButton2,CustomButton3 } from '../../../Custom/CustomButton';
import { $Service_Url } from '../../../../components/network/UrlPath';
import { CustomInput } from '../../../Custom/CustomComponent';


export const isContentBusiness = `Provide details about your business, including its name, type, and market value. This information allows us evaluate how your business fits into your overall retirement plan, ensuring that your business assets are well-managed and aligned with your goals of financial independence and aging in place.`
export const isContentBusinessAddress= `Enter the business address information to maintain accurate records of your business location.`
export const isContentOwner =`List the owners and co-owners of your business. Understanding the ownership structure is essential for effective succession planning and ensuring that your business continuity aligns with your retirement planning goals, protecting your legacy and supporting your family.`

const allkeys = ["0", "1", "2", "3"]
const AddBusinessIntrests = (props) => {
  const { handlePreviousBtn, actionType, isBusinessIntrests, editInfo, setUpdateBusiness, handleClick,userDetails,setUserDetails,initialState} = props;
  const { setWarning } = useContext(globalContext)
  const [activeTab, setActiveTab] = useState(1);
  const [savedDocument, setsavedDocument] = useState([])
  const [addressData, setaddressData] = useState('')
  const contactDetailsRef = useRef(null);
  const { primaryUserId, spouseUserId, loggedInUserId } = usePrimaryUserId();
  const uploadAssetsFileRef = useRef(null);
  const bussRef = useRef(null);
  const newObjErr = () => ({ nameOfBusiness: "", businessTypeId: "" });
  const [errMsg, setErrMsg] = useState(newObjErr());
  const [activeKeys, setActiveKeys] = useState(["0"]);



  // @@ return heading
  const returnHeading = useMemo(() => {
    let msg = (isBusinessIntrests) ? `${(actionType == 'ADD') ? 'Add' : 'Edit'}  Business` : `${(actionType == 'ADD') ? 'Add' : 'Edit'}  Business`
    return msg;
  }, [isBusinessIntrests, actionType])

  
  useEffect(() => {
    if ($AHelper?.$isNotNullUndefine(editInfo)) {
  
      setUserDetails(prev => ({
        ...prev, 
        natureId: editInfo?.userBusinessInterestId,
        ownershipType: editInfo?.ownershipType
      }));
      if (editInfo?.businessInterestDocs.length > 0) {
        setsavedDocument(editInfo?.businessInterestDocs)
      }
    }
  }, [editInfo])
  // functon for toaster
  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);

  }


  // console.log("kakakka", editInfo,userDetails)

  ///// @@ function for post and update business data
  const handleFileUpload = async (type, buttonType) => {
    if (!validatePersonalDetail()) {
      // handleActiveKeys(allkeys)
      return;
    }
    useLoader(true)
    const _fileUpload = await uploadAssetsFileRef.current.saveUploadUserDocument(primaryUserId)
    // console.log("_fileUpload",_fileUpload)
    useLoader(false)
    if (_fileUpload !== 'err') {
      if (_fileUpload == "no-file") {  
        handleBusinessSubmit(type, null, "", "", "", buttonType)
      }
      if (_fileUpload == 'file-delete') {
        let documentName = props?.editInfo?.businessInterestDocs[0]?.documentName;
        let documentPath = props?.editInfo?.businessInterestDocs[0]?.documentPath;
        let documentId = props?.editInfo?.businessInterestDocs[0]?.docFileId;
        handleBusinessSubmit(type, documentId, documentName, documentPath, _fileUpload, buttonType)
      }
      if (_fileUpload !== "no-file" && _fileUpload !== "file-delete") {
        const { fileId, fileName, fileURL } = _fileUpload
        handleBusinessSubmit(type, fileId, fileName, fileURL, "", buttonType)
      }

    }

  };
  const handleBusinessSubmit = async (type, fileId, documentName, documentPath, _fileUpload, buttonType) => {

    let datefunded = null;
    let businessInterestDocs = [];
    const isValidaateStateBackaddress = await contactDetailsRef.current.handleSubmit();
    // console.log("djhghjgfdgfs",type, fileId, documentName, documentPath, _fileUpload, buttonType)
    if (userDetails?.insStartDate !== "") {
      datefunded = $AHelper.$getFormattedDate(userDetails?.insStartDate);
    }
    if ($AHelper?.$isNotNullUndefine(documentPath) && $AHelper?.$isNotNullUndefine(documentName)) {

      businessInterestDocs = [
        {
          documentName: documentName,
          documentPath: documentPath,
          docFileId: fileId,
        },
      ];
      if (props?.updateBusiness == true) {
        businessInterestDocs[0]["isActive"] = _fileUpload == 'file-delete' ? false : true
        businessInterestDocs[0]["userBusinessInterestDocId"] = props?.editInfo?.businessInterestDocs[0]?.userBusinessInterestDocId;
      }
    } else {
      businessInterestDocs = [];
    }


    let businessObj = {
      businessTypeId: userDetails?.businessTypeId,
      ownershipType: userDetails?.ownershipType,
      businessAddressId: $AHelper?.$isNotNullUndefine(isValidaateStateBackaddress?.addressId) ? isValidaateStateBackaddress?.addressId : "",
      taxIDNo: userDetails?.federaltaxno,
      holdingPercentage: 0,
      nameofBusiness: userDetails?.nameOfBusiness,
      descOfBusiness: userDetails?.businessDescription,
      dateFunded: datefunded !== "Invalid date" && datefunded !== "" && datefunded !== null && datefunded !== undefined ? datefunded : null,
      estimatedMarketValue: userDetails?.balance,
      businessBeneficiaries: null,
      businessInterestDocs: businessInterestDocs,
      additionalDetails: userDetails?.ubiNumber,
      quesReponse: userDetails?.quesReponse
    };
    let method = "POST";
    let url = $Service_Url.postUserBusinessInterest;

    if (props?.updateBusiness == true) {
      method = "PUT";
      url = $Service_Url.updateUserBusinessInterest;
      businessObj["updatedBy"] = loggedInUserId;
      businessObj["userBusinessInterestId"] = userDetails?.natureId;
      businessObj["isActive"] = true;
    } else if (props?.updateBusiness == false) {
      businessObj["createdBy"] = loggedInUserId;
    }

    let BusPostData = {
      userId: primaryUserId,
      businessInterest: businessObj,
    };


   
    // console.log("dssssssssssssssss",method, url, BusPostData)
    // return
    if (validate()) {
      useLoader(true)
      const _resultGetActivationLink = await postApiCall(method, url, BusPostData);
      setUpdateBusiness(false)
      if (_resultGetActivationLink !== 'err') {

        if (method == 'POST') {
          toasterAlert("successfully", "Successfully saved data","Your data have been saved successfully")
        } else {
          toasterAlert("successfully", "Successfully updated data","Your data have been updated successfully")
        }
        $AHelper.$scroll2Top();
        let responseData = _resultGetActivationLink?.data?.data?.businessInterest[0];
        if (userDetails?.businessTypeId == "999999") {
          bussRef?.current?.saveHandleOther(responseData.userBusinessInterestId);
        }
        if (buttonType == "goNext") {
          handleClick()
        }
        else if(buttonType == "addAgain") {
          await uploadAssetsFileRef?.current?.saveNAddAnother()
          await contactDetailsRef.current.setUserData()
          props?.setEditInfo('')
          setUserDetails(initialState)
          setActiveKeys(["0"]);
          useLoader(false)
          return;
        }
        else {
          props?.setEditInfo('')
          setUserDetails(initialState)
          handlePreviousBtn('')
          // const _fileUpload = await uploadAssetsFileRef.current.saveNAddAnother()
        }   
        setHideCustomeSubSideBarState(false)
      }
      useLoader(false)
    }
  };
  /////////////////////////////



  /// function for validaion filds
  const validate = () => {
    let nameError = "";

    if (userDetails?.nameOfBusiness == "") {
      nameError = "Name of Business cannot be Blank";
      // this.setState({disable: false})
    }
    if (userDetails?.businessTypeId == "") {
      nameError = "Type of business cannot be Blank";
      // this.setState({disable: false})
    }

    if (nameError) {
      // this.toasterAlert(nameError, "Warning");
      return false;
    }
    return true;
  };

  const validateField = (field, errorMessageKey) => {
    if (!$AHelper.$isNotNullUndefine(field)) {
      setErrMsg(prev => ({ ...prev, [errorMessageKey]: $Msg_BusinessIntrest[errorMessageKey] }));
      return false;
    } else {
      setErrMsg(prev => ({ ...prev, [errorMessageKey]: '' }));
    }
    return true;
  };
  ////////////////////////////////

  // validate personal details
  const validatePersonalDetail = () => {
    const isValidBusniessType = validateField(userDetails?.businessTypeId, 'businessTypeId');
    if(!isValidBusniessType) focusInputBox("businesstype")
    const isValidBusinessName = validateField(userDetails?.nameOfBusiness, 'nameOfBusiness');
    if(!isValidBusinessName) focusInputBox("nameOfBusiness");
    if (!isValidBusinessName || !isValidBusniessType) {
        setActiveKeys(["0"]);
    }

    return isValidBusinessName && isValidBusniessType;
  };
  const handleInputChange = (key, value) => {
    setUserDetails(prev => ({
      ...prev, [key]: value
    }))
  }


  const handleAccordionClick = () => {
    setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
};

const handleAccordionBodyClick = (key) => {
    setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
};


  return (
    <>
      {/* @@ Previous Button */}
      <Row className="progress-container mb-1 previous-btn">
        <div>
          <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer me-1" onClick={() => handlePreviousBtn('')} />
          <span className='ms-1' onClick={() => handlePreviousBtn('')}> Previous</span>
        </div>
      </Row>

      {/* @@ Heading */}
    
      {/*@ Accordian */}

      <CustomAccordion
        key={activeTab}
        isExpendAllbtn={true}
        handleActiveKeys={handleAccordionClick}
        activeKeys={activeKeys}
        allkeys={allkeys}
        activekey={activeKeys}
        header={  <Row className='mt-2 mb-1'>
          <span className='heading-of-sub-side-links'> {returnHeading} </span>
        </Row>}

      >
        <CustomAccordionBody eventkey='0' name={"Business Information"} setActiveKeys={() => handleAccordionBodyClick('0')}>
          <BusinessInfo startTabIndex={1}  primaryUserId={primaryUserId} editInfo={editInfo} userDetails={userDetails} setUserDetails={setUserDetails} bussRef={bussRef} errMsg={errMsg} setErrMsg={setErrMsg}  isSideContent={isContentBusiness} />
        </CustomAccordionBody>
        <CustomAccordionBody eventkey='1' name={"Business Address (Optional)"} setActiveKeys={() => handleAccordionBodyClick('1')}>
          <ContactAndAddress
            startTabIndex={2+8}
            refrencePage='BusinessIntrests'
            ref={contactDetailsRef}
            isBusinessIntrests={isBusinessIntrests}
            editJsonData={""}
            editData={addressData}
            businessInterestAddressId={props?.editInfo?.businessAddressId}
            showType="address"
            showOnlyForm={true}
            isSideContent={isContentBusinessAddress}
            isMandotry={false}


          />
        </CustomAccordionBody>
        <CustomAccordionBody eventkey='2' name={"Owners & Co-owners Information"} setActiveKeys={() => handleAccordionBodyClick('2')}>
          <>
            <Row className='my-3'>
            <Col className='heading-of-sub-side-links-3' xs={12} md={12} xl={3}>{isContentOwner}</Col>
            <Col xs={12} md={9}>
              <Row>
               <Col xs={12} md={6} lg={5}>
              <CustomInput tabIndex={2 + 8 + 18} isError={errMsg?.ownershipType} label='Owner(S) & Co-Owner(S)' placeholder='Owner(S) & Co-Owner(S)' isDisable={false} id='ownershipType' name='ownershipType' value={userDetails?.ownershipType} onChange={(val) => handleInputChange('ownershipType', val)} />
              </Col>
              </Row>
            </Col>
            </Row>

          </>
        </CustomAccordionBody>
        <CustomAccordionBody eventkey='3' name={"Document Upload"} setActiveKeys={() => handleAccordionBodyClick('3')}>
        <Row className='mb-3'>
        <Col className='mt-2 heading-of-sub-side-links-3' xs={12} md={12} xl={3}>{contentObject.UploadFileBusinessInterests}</Col>
        <Col xs={12} md={9}>
          <UploadAssetsFile
            startTabIndex={ 2 + 8 + 18 + 1}
            savedDocuments={savedDocument?.filter((item) => item.docFileId !== null)} ref={uploadAssetsFileRef}
            refrencePage='Business Interests'
            details={{ heading: editInfo?.nameofBusiness, Type: editInfo?.businessType, updatedDate: editInfo?.dateFunded }}
          />
          </Col>
          </Row>
        </CustomAccordionBody>

      </CustomAccordion>
      <div className='d-flex justify-content-between mt-5 mb-2'>
        {<CustomButton2 tabIndex={2 + 8 + 18 + 1 + 1} onClick={() => handleFileUpload("add", "addAnother")} label={`${actionType == "ADD" ? "Save" :"Update"} & Continue later`}/>}
        <div>
                {(actionType == "ADD" ) && <CustomButton3 tabIndex={2 + 8 + 18 + 1 + 1 + 1} label={'Save & Add Another'} onClick={() => handleFileUpload("addAgain", "addAgain")} />}
                <CustomButton tabIndex={2 + 8 + 18 + 1 + 1 + 1 +1}  onClick={() => handleFileUpload("add", "goNext")} label={"Next: Transportation"} />
        </div>  
      </div>


    </>
  )
}

export default AddBusinessIntrests