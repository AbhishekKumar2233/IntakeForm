
import React, { useCallback, useState, useRef, useContext,forwardRef } from 'react';
import { Row } from 'react-bootstrap';
import { $Service_Url } from '../../../components/network/UrlPath';
import { CustomButton, CustomButton2, CustomButton3 } from '../../Custom/CustomButton';
import { $JsonHelper } from '../../Helper/$JsonHelper';
import { postApiCall } from '../../../components/Reusable/ReusableCom';
import { setHideCustomeSubSideBarState, useLoader } from '../../utils/utils';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import ContactAndAddress from '../../Custom/Contact/ContactAndAddress';
import Stepper from '../../Custom/CustomStepper';
import { $AHelper } from '../../Helper/$AHelper';
import { globalContext } from '../../../pages/_app';
import { $postServiceFn } from '../../../components/network/Service';
import AddLiabilityInfromation from './AddLiabilityInfromation';
import { fetchRetirementNonRetirementData } from '../../Redux/Reducers/financeSlice';
import { useAppDispatch } from '../../Hooks/useRedux';

export const headerNavAddChild = {
    1: "Step 1/ 3 - Child’s Personal Details",
    2: "Step 2/ 3 - Child’s Status and Background",
}
export const headerNavAddFamily = {
    1: "Liability information",
    2: "Lender Contact & Address Information",
}
export const addChildbtnSteps = {
    1: 'Next: Status and background',
    2: 'Next: Contact & address information',
}
export const addExtendedFamilybtnSteps = {
    1: 'Next: Lender Contact & address information',
    2: 'Next: Monthly income',
}

const AddLiabilitys = forwardRef((props) => {

    const {handleActionType, actionType, activeTab,setActiveTabs } = props;
    const isChild = activeTab == 'ADD-CHILDREN' ? true : false
    const { primaryUserId,primaryDetails, subtenantId, loggedInUserId } = usePrimaryUserId();
    const [othersId, setOthersId] = useState("")
    const landerDetailsRef = useRef(null);
    const statusBackgroundRef = useRef(null)
    const contactDetailsRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [personalDetails, setPersonalDetails] = useState({
        ...$JsonHelper.createPersonalDetails(),
        'memberRelationship': $JsonHelper.createMemberRelationship(primaryUserId, primaryUserId),
        'primaryUserId': primaryUserId, 'subtenantId': subtenantId,
        'createdBy': loggedInUserId, 'updatedBy': loggedInUserId, 'lName': isChild ? primaryDetails?.lName : ''
    })
    const { setWarning} = useContext(globalContext)
    const dispatch = useAppDispatch()


  
    //@@ handle Previous button
    const previousHandle = () => {
        if (currentStep == 1) {
            handleActiontypeFun('');
        } else {
            setCurrentStep(currentStep - 1);
        }
    };

    // handleNext button
    const handleNextBtn = (async (type) => {
        // @@ validate liabilities Detail
        if (currentStep == 1) {
            const isValidate = landerDetailsRef.current?.validateContacts();
            if (!isValidate) return;
        }
        if (currentStep == 2 && $AHelper.$isCheckNoDeceased(personalDetails?.memberStatusId)) {
            const isValidaateStateBackContact = await contactDetailsRef.current.submitContact();
            if (!isValidaateStateBackContact?.isActive) {
                return;
            }
            const isValidaateStateBackaddress = await contactDetailsRef.current.handleSubmit();
            if (!isValidaateStateBackaddress?.isActive) {
                return;
            }
            // console.log("kjdhfdkhfkdjhf",isValidaateStateBackaddress)
            saveData(isValidaateStateBackaddress?.json, isValidaateStateBackContact?.json,type)
        }
        if (currentStep != Object.keys(addChildbtnSteps2).length) {
            setCurrentStep(currentStep + 1)
        }
    })


    // handle Route
    const handleRoute = useCallback((item) => {
        $AHelper.$dashboardNextRoute(item.route);
    }, []);

    // handle Save and  Continue btn;
    const handleActiontypeFun = useCallback((val) => {
        handleActionType();
    }, []);


  

    const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
};

// save function for saving data
const saveData = async (addressData,contactData,type) => {
    // console.log("lkjfdlkfj",addressData)
    const {liabilityTypeId,nameofInstitutionOrLender,payOffDate,outstandingBalance,paymentAmount} = props?.liablitiesData
    const postJson = {
        "userId": primaryUserId,
        "upsertedBy": loggedInUserId,
        "upsertUserLiabilities": [
          {
            "liabilityTypeId": liabilityTypeId,
            "description": "string",
            "nameofInstitutionOrLender": nameofInstitutionOrLender,
            "outstandingBalance": outstandingBalance,
            "payOffDate": payOffDate,
            "paymentAmount": paymentAmount,
            "lenderUserId": null,
            "isActive": true,
            "liabilityDocs": [],
            "lenderInformation": {
              "addresses": 
                addressData
              ,
              "contacts":contactData?.contact,
            }
          }
        ]
      }
      useLoader(true)
      const _resultGetActivationLink = await postApiCall("POST", $Service_Url?.putUpsertLiabilitiy, postJson);
      if (liabilityTypeId == "999999") {
        let addressResponse = _resultGetActivationLink.data?.data?.liability;
        saveHandleOther(addressResponse[0]?.userLiabilityId,type)
      }else{
        toasterAlert("successfully","Successfully","Your data has been successfully save.")
        useLoader(false)    
        dispatch(fetchRetirementNonRetirementData({ userId: primaryUserId }))

        if(type == "NextLater"){
            // previousHandle()
            handleActiontypeFun('')
            
        }else{
            setActiveTabs(6)
            props?.setliablitiesData('')
        }

      }

}
  ///////////////save other liabilities //////////
const saveHandleOther = (uniqueId, spouseUserId,type) => {
    return new Promise(async (resolve, reject) => {
        let disdata = [];
        if (othersId == "") {
            disdata = [{
                othersCategoryId: 15,
                othersName: props?.liablitiesData.othersName,
                createdBy: loggedInUserId,
                isActive: true,
            }]
            await apiForOther("POST", uniqueId, disdata, spouseUserId,type);
            resolve('resolve')
        }
    })
  
}
  
 const apiForOther = (method, uniqueId, totArray, spouseUserId,type) => {
        return new Promise(async (resolve, reject) => {
            if (totArray.length > 0) {
                $postServiceFn.postAddOther(method, totArray, async (response) => {
                    let responseData = response.data.data;
                    if (method == "POST") {
                        await mapOtherToForm(uniqueId, responseData, spouseUserId,type);
                    }
                    resolve('resolve')
                })
            } else {
                resolve('resolve')
            }


        })

 }
  
  const mapOtherToForm = (uniqueId, veteranMapToOther,type) => {
    return new Promise(async (resolve, reject) => {
        if (props?.liablitiesData?.liabilityTypeId == "999999") {
            let disObjId = mapOtherToObj(uniqueId, veteranMapToOther);
            await mpApi(disObjId,type);
             resolve('resolve')
        }
    })
  
  }
  
  const mpApi = (disObjId,type) => {
    return new Promise((resolve, reject) => {
        $postServiceFn.postMapOther("POST", [disObjId], (response) => {
            toasterAlert("successfully","Your data has been successfully save.")
            useLoader(false)
            if(type == "NextLater"){
                // previousHandle()
                handleActiontypeFun('')
                
            }else{
                setActiveTabs(6)
                props?.setliablitiesData('')
            }
            resolve('resolve')
            if (response) {
            }
        })
    })
  }
  
  const mapOtherToObj = (objId, objOther) => {
    let totArray = {
        userId: primaryUserId,
        othersCategoryId: objOther[0].othersCategoryId,
        othersId: objOther[0].othersId,
        othersMapNatureId: objId,
        othersMapNatureType: "",
        isActive: true,
        createdBy: objOther[0].createdBy,
        remarks: ""
    }
  
    return totArray;
  }
  const returnContactAndAddress = (address,contact)=>{
    // console.log("11111sss",address,contact)
    setaddressData(address)
    setcontactData(contact)
  
    
  }



let headerNavAddChild2 = headerNavAddChild;
let addChildbtnSteps2 = addChildbtnSteps
if (!$AHelper.$isCheckNoDeceased(personalDetails?.memberStatusId)) {
    headerNavAddChild2 = {
        1: "Step 1/ 2 - Child’s Personal Details",
        2: "Step 2/ 2 - Child’s Status and Background"
    }
    addChildbtnSteps2 = {
        1: 'Next: Status and background',
        2: 'Next: Extended family'
    }
}



return (
    <>
        <div className='progress-container'>
            <Row className="progress-container mb-1 previous-btn">
                <div>
                    <img src="/New/icons/previous-Icon.svg" alt="Previous Icon" className="img mb-2 cursor-pointer me-2" onClick={previousHandle} />
                    <span className="ms-1" onClick={previousHandle}>Previous</span>
                </div>
            </Row>
            <h2 className="heading-text">{currentStep == 1 && "Add Liability"}</h2>
            <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} steps={Object.values(headerNavAddFamily)} />
        </div>
        {/* } */}
        <br />
        <hr className="hr-div mt-3" />
        {/* progress loader */}
        <div id='AddChildWithProgressBar' className='addChildWithProgressBar'>

            {currentStep == 1 &&
                <AddLiabilityInfromation isChild={isChild} liablitiesData={props?.liablitiesData} setliablitiesData={props?.setliablitiesData} ref={landerDetailsRef}  />

            }
            {currentStep == 2 &&
                <ContactAndAddress
                    refrencePage='Liabilities'
                    userId={personalDetails?.userId}
                    ref={contactDetailsRef}
                    // type={actionType}
                    isChild={isChild}
                    setPersonalDetails={setPersonalDetails}
                    dataInfo={personalDetails}
                    key={currentStep}
                    showType="both"
                    isSideContent=''
                    isMandotry={false}
                    returnContactAndAddress={returnContactAndAddress}
                />
            }




            <Row style={{ marginTop: '24px' }} className='mb-3'>

                <div className={`${currentStep != 1 ? 'justify-content-between' : 'flex-row-reverse'} d-flex`}>

                    {(currentStep != 1) &&
                        <CustomButton2
                           tabIndex={14} label="Save & Continue later"
                            onClick={() => handleNextBtn("NextLater")}
                        />
                    }

                    <div>
                        {currentStep == 3 &&
                            < CustomButton3
                                label={`${isChild == true ? 'Save & Add Another Child' : 'Save & Add Another Extended Family'}`}
                                onClick={() => handleNextBtn('another')}
                            />
                        }
                        <CustomButton
                            tabIndex={15} label={isChild == true ? addChildbtnSteps2[currentStep] : addExtendedFamilybtnSteps[currentStep]}
                            onClick={() => handleNextBtn("next")}
                        />
                    </div>
                </div>
            </Row>
        </div>


    </>
);
});

export default AddLiabilitys;
