import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { CustomAccordion, CustomAccordionBody } from '../../Custom/CustomAccordion'
import { Row, Col } from 'react-bootstrap';
import { globalContext } from '../../../pages/_app';
import { $CommonServiceFn } from '../../../components/network/Service';
import { $Service_Url } from '../../../components/network/UrlPath';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { useLoader } from '../../utils/utils';
import { $postServiceFn } from '../../../components/network/Service';
import { postApiCall, getApiCall } from '../../../components/Reusable/ReusableCom';
import { CustomButton,CustomButton2, CustomButton3 } from '../../Custom/CustomButton';
import AddLiabilityInfromation from './AddLiabilityInfromation';
import ContactAndAddress from '../../Custom/Contact/ContactAndAddress';
import { $AHelper } from '../../Helper/$AHelper';


const allkeys = ["0", "1"]
const EditLiabilities = ({ liablitiesData, setliablitiesData, setEditInfo, activeTabs, editInfo, setActiveTabs,fetchData,leaseNRealEstatelist,setHideCustomeSubSideBarState, handleActionType,handleNextTab,handleAddAnother}) => {
    const isContent = 'Accurate liability details are essential for proper financial management and reporting. Keep this information current to ensure liabilities are tracked accurately and necessary updates or actions are taken in a timely manner.';
    const isContentAddress = 'Accurate contact and address information is essential for effective communication and service delivery. Keep these details current to ensure your Lender receive important updates and support';
    const { primaryUserId, loggedInUserId } = usePrimaryUserId();
    const [activeTab, setActiveTab] = useState(1);
    const { setWarning } = useContext(globalContext)
    const [othersId, setOthersId] = useState('');

    const [activeKeys, setActiveKeys] = useState(["0"]);

    const isChild = activeTabs == 'ADD-CHILDREN' ? true : false
    const contactDetailsRef = useRef(null);
    const landerDetailsRef = useRef(null);
    const otherRef = useRef(null);
    const toUpdate = $AHelper.$isNotNullUndefine(liablitiesData?.natureId);


    const returnContactAndAddress = (address, contact) => {

        // setaddressData(address)
        // setcontactData(contact)

   

    }
    const handleNextBtn = (async (type) => {
        const isValidate = landerDetailsRef.current?.validateContacts();
        if (!isValidate) return;
        const isValidaateStateBackContact = await contactDetailsRef.current.submitContact();
        if (!isValidaateStateBackContact?.isActive) {
            return;
        }
        const isValidaateStateBackaddress = await contactDetailsRef.current.handleSubmit();
        if (!isValidaateStateBackaddress?.isActive) {
            return;
        }
        // console.log("hdjfhsdjfgdjf",isValidaateStateBackContact)
        saveData(isValidaateStateBackaddress?.json, isValidaateStateBackContact?.json,type)
    })

    const handleActiontypeFun = useCallback((val) => {
        handleActionType();
    }, []);

    const saveData = async (addressData, contactData,type) => {
        const { liabilityTypeId, nameofInstitutionOrLender, payOffDate, endDateLiability, outstandingBalance, paymentAmount, othersName,liabilityId,userRealPropertyId } = liablitiesData
        let postJson = {
            "userId": primaryUserId,
            "upsertedBy": loggedInUserId,
            "upsertUserLiabilities": [
                {
                    "liabilityTypeId": liabilityTypeId,
                    "description": "string",
                    "userRealPropertyId":0,
                    "nameofInstitutionOrLender": nameofInstitutionOrLender,
                    "outstandingBalance": outstandingBalance,
                    "payOffDate": payOffDate,
                    "endDateLiability": (liabilityTypeId == "1" || liabilityId == "1" || liabilityId == "2") ? endDateLiability : '',
                    "paymentAmount": paymentAmount,
                    "lenderUserId": editInfo?.lenderUserId,
                    "userLiabilityId": editInfo?.userLiabilityId,
                    "interestRatePercent":editInfo?.interestRatePercent,
                    "loanNumber":editInfo?.loanNumber,
                    "isActive": true,
                    "liabilityDocs": [],
                    "lenderInformation": {
                        "addresses":
                            addressData
                        ,
                        "contacts": contactData?.contact,
                    }
                }
            ]
        }
        const leaseNtransportId = [6, 7]   
        if (leaseNtransportId.includes(Number(liabilityTypeId))) {
            const firstLiability = postJson.upsertUserLiabilities[0];
            firstLiability["liabilityId"] = liabilityId;
            firstLiability["userRealPropertyId"] = userRealPropertyId;
        }
        useLoader(true)
        const _resultGetActivationLink = await postApiCall("POST", $Service_Url?.putUpsertLiabilitiy, postJson);
        let addressResponse = _resultGetActivationLink.data?.data?.liability;
        if (_resultGetActivationLink !== 'err' && addressResponse.length > 0) {
            setliablitiesData(prev => ({ ...prev, ["natureId"]: addressResponse[0]?.userLiabilityId }));
            if (liabilityTypeId == "999999") {
                otherRef.current.saveHandleOther(addressResponse[0]?.userLiabilityId);
                useLoader(false)
            } else {
                setWarning("successfully", `Successfully ${$AHelper.$isNotNullUndefine(editInfo) ? 'updated' :'saved'} data `, `Your data have been ${$AHelper.$isNotNullUndefine(editInfo)? "updated":"added"} successfully`)
                useLoader(false)
           
              

            }
            $AHelper.$scroll2Top();

            if(type != "NextLater" && type != "another"){
                setliablitiesData('') 
                // setActiveTabs(6)
                handleNextTab()
            }
            else if(type == "another"){
                setliablitiesData('')
                handleAddAnother()
                clearEditData()
                const resetAddressContact = await contactDetailsRef.current.allResetAddressContact();
                setActiveKeys(["0"]); 
            }
            else{
                clearEditData()
                setliablitiesData('')
                handleActiontypeFun('')               
            }
        } else {
            useLoader(false)

        }


    }
    const clearEditData =()=>{
        if($AHelper.$isNotNullUndefine(editInfo)){
            setEditInfo('')
        }
    }

    const handleAccordionClick = () => {
        setActiveKeys(prevKeys => (prevKeys?.length < allkeys?.length) ? allkeys : []);
    };
    
    const handleAccordionBodyClick = (key) => {
        setActiveKeys(prevKeys => (prevKeys?.includes(key) ? prevKeys?.filter(ele => ele != key) : [key]));
    }

    const PreviousBtn =()=>{
        handleActionType()
    }

    return (
        <>

            <div style={{borderBottom: '1px solid #F0F0F0'}}></div>
            <div className="d-flex align-items-center mt-3">
                <Row>
                    <Col>
                        <Row className="progress-container mb-1 previous-btn">
                            <div>
                                <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer me-2" onClick={() => PreviousBtn()} />
                                <span className="ms-1" onClick={() =>PreviousBtn()}>Previous</span>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </div>
            <CustomAccordion
                key={activeTab}
                isExpendAllbtn={true}
                handleActiveKeys={handleAccordionClick}
                activeKeys={activeKeys}
                allkeys={allkeys}
                activekey={activeKeys}
                header={<span className='heading-text mt-4'><p className='mt-3'>{$AHelper.$isNotNullUndefine(editInfo) ?"Edit Liabilities" : "Add Liabilities"}</p></span>}
            >
                <CustomAccordionBody eventkey='0' activeTab={activeTab} name={"Liability information"} setActiveKeys={() => handleAccordionBodyClick('0')}>
                    <AddLiabilityInfromation startTabIndex={1} liablitiesData={liablitiesData} setliablitiesData={setliablitiesData} isEdit={true} isContent={isContent} ref={landerDetailsRef} leaseNRealEstatelist={leaseNRealEstatelist} otherRef={otherRef} primaryUserId={primaryUserId} setActiveKeys={setActiveKeys} />
                </CustomAccordionBody>
                <CustomAccordionBody eventkey='1' activeTab={activeTab} name={"Lender Contact and Address Information"} setActiveKeys={() => handleAccordionBodyClick('1')}>
                    <ContactAndAddress
                        startTabIndex={2 + 8}
                        refrencePage='Liabilities'
                        userId={editInfo?.lenderUserId}
                        ref={contactDetailsRef}
                        isChild={isChild}
                        showType="both"
                        isSideContent={isContentAddress}
                        isMandotry={false}
                        returnContactAndAddress={returnContactAndAddress}
                    />
                </CustomAccordionBody>

            </CustomAccordion>
            <Row style={{ marginTop: '24px' }} className='mb-3'>
            <div className='d-flex justify-content-between mb-3 mt-3'>
                <CustomButton2 tabIndex={2 + 8 + 18} label={`${$AHelper.$isNotNullUndefine(editInfo) ? "Update" : "Save"} & Continue later`} onClick={() => handleNextBtn("NextLater")} />
            <div>
                    {toUpdate != true && <CustomButton3 tabIndex={2 + 8 + 18 + 1}  label={`${'Save & Add Another'}`} onClick={() => handleNextBtn('another')}/>}
                    <CustomButton  tabIndex={2 + 8 + 18 + 1} onClick={() => handleNextBtn("next")} label={"Save & Proceed to Income"} />
            </div>
            </div>
            </Row>
        </>
    )
}

export default EditLiabilities