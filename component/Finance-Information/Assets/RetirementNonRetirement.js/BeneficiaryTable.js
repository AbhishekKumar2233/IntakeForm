import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { CustomInput, CustomPercentageInput, CustomSearchSelect } from "../../../Custom/CustomComponent";
import { $Service_Url } from "../../../../components/network/UrlPath";
import { getApiCall, getApiCall2, isNullUndefine, postApiCall } from "../../../../components/Reusable/ReusableCom";
import konsole from "../../../../components/control/Konsole";
import ContactAndAddress from "../../../Custom/Contact/ContactAndAddress";
import ReusableAddressContact from "../../../Custom/Contact/ReusableAddressContact";
import { $AHelper } from "../../../Helper/$AHelper";
import CustomTooltip from "../../../Custom/CustomTooltip";
import { CustomButton, CustomButton2, CustomButton3 } from "../../../Custom/CustomButton";
import { isNotValidNullUndefile } from "../../../../components/Reusable/ReusableCom";


const BeneficiaryTable = ({assetBeneficiary,beneficiaryList,setAssetBeneficiaryDetailsJson,setAssetDetails,assetDetails,memberUserID,toasterAlert,useLoader,primaryUserId,spouseUserId,_spousePartner,subtenantId,setDeletebene,assetOwnersDetailsJson, startTabIndex}) => {
    const tableHeading = ['Beneficiary/Charity','Relationship & Contact Information','Percentage'];
    let newBeneficiary = {"agingAssetBeneficiaryId": 0, "beneficiaryName": "", "beneficiaryUserId": '', "isCharity":false, "isActive":true,"beneficiaryUserName":"","beneficiaryPer":"" }

      const [showModal, setShowModal] = useState(false)
      const [modalType,setModaltype] = useState('')
      const [newUserId,setNewUserId] = useState('')
      const [editDetails,setEditdetails] = useState('')
      const [disableBtn,setDisablebtn] = useState(false)
      const [beneficiarylist,setBeneficiarylist] = useState([])
      const addressRef = useRef(null);
      const [oldState, setOldSate] = useState({});
    //   const { loggedInUserId} = usePrimaryUserId();
      const ownerSelected = useMemo(() => {
        if (!assetOwnersDetailsJson || !Array.isArray(assetOwnersDetailsJson)) return '';
        const activeOwner = assetOwnersDetailsJson.filter((e) => e.isActive === true);
        return activeOwner?.length > 1 ? activeOwner[0]?.ownerUserId + activeOwner[1]?.ownerUserId : activeOwner[0]?.ownerUserId;
      }, [assetOwnersDetailsJson]);

      const startingTabIndex = startTabIndex ?? 0;

      const totalPercentage = (updatedBeneficiaries) => {
        return updatedBeneficiaries?.reduce((sum, current) => {
          const value = parseFloat(current?.beneficiaryPer);
          return !isNaN(value) ? sum + value : sum;
        }, 0);
      }
    
      useEffect(()=>{
        setBeneficiarylist(beneficiaryList)
      },[beneficiaryList])

      useEffect(() => {
        if (showModal) return;
            if (assetDetails?.assetBeneficiarys?.some(e=> e?.isCharity == true)) {
            const fetchUpdatedBeneficiaries = async () => {
                const updatedBeneficiaries = await Promise.all(
                    assetDetails?.assetBeneficiarys?.length > 0 && assetDetails.assetBeneficiarys.map(async (item) => {
                        if(item?.isCharity == true){
                        let address = await userAddressDataById(item.beneficiaryUserId);
                        let contact = await userContactDataById(item.beneficiaryUserId)
                        return { ...item, address, contact };
                        }else{
                        return {...item};
                        }
                    })
                );
                if(assetDetails?.assetBeneficiarys?.filter((e)=> e?.isCharity == false)?.length == 0){
                    updatedBeneficiaries = [...updatedBeneficiaries,{"agingAssetBeneficiaryId": 0, "beneficiaryName": "", "beneficiaryUserId": "", "isCharity":false,"isActive":true,"beneficiaryPer":'' }]
                } 
                setAssetDetails((prevDetails) => ({
                    ...prevDetails,
                    assetBeneficiarys: updatedBeneficiaries,
                }));
            };
            fetchUpdatedBeneficiaries();
        }
        if(assetDetails?.assetBeneficiarys?.filter((e)=> e?.isCharity == false)?.length == 0){
            setAssetDetails((prevDetails) => ({
                ...prevDetails,
                assetBeneficiarys: [{"agingAssetBeneficiaryId": 0, "beneficiaryName": "", "beneficiaryUserId": "", "isCharity":false,"isActive":true,"beneficiaryPer":'' }],
            }));
        }
        }, [showModal == false,assetDetails?.assetBeneficiarys?.some(e=> e?.isCharity == true),assetDetails?.assetBeneficiarys?.some(e=> e?.isCharity == false)]);


    const handleChange = (key, value, beneUserId) => {
        if (!assetDetails || !assetDetails?.assetBeneficiarys) {
            return;
        }
    
        const updatedBeneficiaries = assetDetails?.assetBeneficiarys?.map((item) => {
            if (item.beneficiaryUserId === beneUserId) {
                return { ...item, [key]: value };
            }
            return { ...item };
        });

        if(key == 'beneficiaryPer'){
            if(totalPercentage(updatedBeneficiaries) > 100){
                toasterAlert("warning",'Total Percentage can not be more than 100.')
                return;
            }
        }
    
        // console.log(updatedBeneficiaries,"updatedBeneficiariesd")
        setAssetDetails({
            ...assetDetails,
            assetBeneficiarys: updatedBeneficiaries,
        });
    
        if (key === 'beneficiaryUserId' && value) {
            setBeneficiarylist((prev) => [
                ...prev,
                beneficiarylist?.find((beneficiary) => beneficiary?.value == value),
            ]);
            const updatedBeneficiaryList = beneficiarylist?.filter(
                (beneficiary) => beneficiary?.value != value
            );
            setBeneficiarylist(updatedBeneficiaryList); 
        }
    };

    const addCharity = async (type,e) => {
        setDisablebtn(true)
        // let emptyField = assetBeneficiary?.some((e) => e.beneficiaryUserName == '');
        // if(emptyField){
        //         toasterAlert("warning", "Please enter the charity name.")
        //         setDisablebtn(false)
        //         return;
        // }
            // if(type=='addCharity'){
            //     setAssetDetails((prev)=>{return {...prev,assetBeneficiarys:[...prev?.assetBeneficiarys, {"agingAssetBeneficiaryId": 0, "beneficiaryName": "", "beneficiaryUserId": '', "isCharity":true  }]}})
            //     return;
            // }
            if(e?.isCharity == true && e?.beneficiaryUserId != '') {
                setShowModal(true);
                setModaltype(type);
                // setNewUser(e.beneficiaryUserId)
                setDisablebtn(false);
                return;
            }

            let dataobj = {
              subtenantId: subtenantId || 2,
              fName: "fname",
              mName: "mName",
              lName: "lName",
              isPrimaryMember: false,
              memberRelationship: null,
              createdBy: memberUserID,
            };
            const apiResponse = await postApiCall("POST",$Service_Url.postAddMember, dataobj);
            if(apiResponse){
                konsole.log(apiResponse,"apiResponse");

            let newUserObj = {
                agingAssetBeneficiaryId: 0,
                beneficiaryName: "",
                beneficiaryUserId: apiResponse?.data?.data?.member?.userId,
                isCharity: true,
                isActive: true,
                beneficiaryUserName: "",
                beneficiaryPer: "",
                address: null,
                contact: null,
            };
            
            setAssetDetails((prev) => ({
                ...prev,
                assetBeneficiarys:[...prev?.assetBeneficiarys, newUserObj]
            }));
            
            setNewUserId(apiResponse?.data?.data?.member?.userId);
            setShowModal(true);
            setModaltype(type);
            setDisablebtn(false);
            setOldSate({});

            }
    }

    const userAddressDataById = async (userID) => {
    useLoader(true)
    try{
            const _resultOf = await getApiCall2('GET', $Service_Url.getAllAddress + userID, '')
            useLoader(false)
            return _resultOf.data.data?.addresses[0]
    }catch(error){
        useLoader(false)
        return null
    }
    }

    const userContactDataById = async (userID) => {
        useLoader(true)
        try{
                const _resultOf = await getApiCall2('GET', $Service_Url.getcontactdeailswithOther + userID, '')
                useLoader(false)
                return _resultOf.data.data?.contact
        }catch(error){
            useLoader(false)
            return null
        }
        }

    const editDeatils = (e,type) => {
        setShowModal(true)
        setNewUserId(e?.beneficiaryUserId)
        setOldSate(assetDetails?.assetBeneficiarys?.find((item)=> item?.beneficiaryUserId == e?.beneficiaryUserId));
        // setModaltype(type)
        // if(type=='address'){
        //   setEditdetails(e?.address)
        // }else{
        //   setEditdetails({mobile:e?.contact?.mobiles[0],email:e?.contact?.emails[0]})
        // }
    }

    const deleteBeneficiary = (e) => {
        setAssetDetails((prev) => {
                return {
                  ...prev,
                  assetBeneficiarys: prev?.assetBeneficiarys
                    .map((ele) => {
                      if (ele?.beneficiaryUserId == e?.beneficiaryUserId) {
                        return { ...ele, isActive: false };
                      }
                      return { ...ele };
                    })
                    .filter((ele) => ele?.isActive),
        }});

        if(e?.agingAssetBeneficiaryId != 0){
        setDeletebene((prev)=>[...prev,{...e,isActive:false}])
        }

        setBeneficiarylist((prevList) => {
            const isAlreadyInList = !prevList?.some(
                (beneficiary) => beneficiary?.value == e?.beneficiaryUserId
            );
            const addInList = beneficiaryList?.filter(
                (beneficiary) => beneficiary?.value == e?.beneficiaryUserId
            )[0]
            if (isAlreadyInList && prevList?.length > 0) {
                return [...prevList, { value: addInList?.value, label: addInList?.label }];
            }
            return prevList;
        });
        toasterAlert("deletedSuccessfully", "Beneficiary/Charity has been deleted successfully")
        };
          
        const addBeneficiary = () => {
            setDisablebtn(true)
            let emptyField = assetBeneficiary?.some((e)=>{return e?.beneficiaryUserId == 0})
            if(emptyField){
                toasterAlert("warning", "Please Select the beneficiary.")
                setDisablebtn(false);
                return;
            }else{
            setAssetDetails((prev)=>{return {...prev,assetBeneficiarys:[...prev?.assetBeneficiarys, {"agingAssetBeneficiaryId": 0, "beneficiaryName": "", "beneficiaryUserId": "","beneficiaryPer":"", "isCharity":false,"isActive":true }]}})
            setDisablebtn(false)
            }
        }

        const charityData = useMemo(()=>{
            return assetBeneficiary.find((e)=> e.beneficiaryUserId == newUserId)
        },[newUserId,assetBeneficiary,showModal==true])

        const saveCharity = async (charityData) => {
            if (!charityData?.beneficiaryUserName) {
                toasterAlert("warning", "Please enter the charity name.");
                return;
            }
            // setAssetDetails((prevDetails) => ({
            //     ...prevDetails,
            //     assetBeneficiarys: [
            //         ...prevDetails?.assetBeneficiarys?.filter((e) => e?.beneficiaryUserId !== charityData?.beneficiaryUserId),
            //         { ...charityData, isSaved:true }
            //     ],
            // }));
            setAssetDetails((prevDetails) => ({
                ...prevDetails,
                assetBeneficiarys: [
                    ...prevDetails?.assetBeneficiarys?.filter((e) => e?.beneficiaryUserId !== charityData?.beneficiaryUserId),
                    { 
                        ...charityData, 
                        isSaved: true,
                        beneficiaryUserName: charityData?.beneficiaryUserName || `${charityData?.fName || ''} ${charityData?.mName || ''} ${charityData?.lName || ''}`.trim()
                    }
                ],
            }));




            const isValidAddressData = addressRef.current?.isValidateAddress()
            const isValidContactData = addressRef.current?.validateContacts()
            if(isValidAddressData == false){return}
            if(isValidContactData == false){return}
            let addressRefs = await addressRef?.current?.handleSubmit();
            let validContact =  await addressRef?.current?.submitContact();
              if(!(isNotValidNullUndefile(addressRefs) && addressRefs?.isActive == true)){return}  
              if(!(isNotValidNullUndefile(validContact) && validContact?.isActive == true)){return}  
            
            // const json = {
            //     userId: charityData?.beneficiaryUserId,
            //     contactId : charityData.contact.emails[0]?.contactId,
            //     deletedBy: loggedInUserId,
            //   };
            // if (addressRef?.current.state?.mobileNumber ==  undefined){
            //     postApiCall('DELETE', $Service_Url.deleteContactPath, json)
            // }
            // konsole.log(addressRef?.current.state?.mobileNumber, "mobileNumber",charityData.contact.emails[0]?.contactId)

            setNewUserId('')
            setShowModal(false)
            toasterAlert("successfully", "Successfully saved data", "Charity details has been saved successfully.");
        };

        const closeModal = (charityData) => {
        // if(charityData?.agingAssetBeneficiaryId != 0){
        //     setShowModal(false);
        //     return;
        // }

        // if(charityData?.beneficiaryUserName == '' && charityData?.isSaved != true){
        //     setAssetDetails((prevDetails) => ({
        //         ...prevDetails,
        //         assetBeneficiarys: prevDetails?.assetBeneficiarys?.filter((e) => e?.beneficiaryUserId !== charityData?.beneficiaryUserId),
        //     }));
        //     } else {
        //         setNewUserId('');
        //     }
        //     setShowModal(false);
        // };
            setAssetDetails((prevDetails) => ({
                ...prevDetails,
                assetBeneficiarys: (isNullUndefine(oldState?.beneficiaryUserId) && isNullUndefine(charityData?.agingAssetBeneficiaryId)) ?
                    prevDetails?.assetBeneficiarys?.filter((e) => e?.beneficiaryUserId != charityData?.beneficiaryUserId) :
                    prevDetails?.assetBeneficiarys?.map((e) => (e?.beneficiaryUserId != charityData?.beneficiaryUserId) ? e : oldState)
            }));
            setNewUserId('');
            setShowModal(false);
            setOldSate({});
        };

    return (
        <>
        <Row className="w-100 d-md mt-1 beneficiary-table">
            <Col className="col-3" ><p className="heading-of-sub-side-links-3">Your Beneficiary's personal information helps us tailor our services to your unique needs. Please ensure all details are accurate as they form the basis for personalized advice and recommendations.</p></Col>
            <Col className="col-9">
            <div id="information-table" className="information-table table-responsive mt-2 mb-3">
            <div className="d-flex justify-content-between align-items-center m-3">
            <h5 className="fw-bold">Enter Beneficiary Details</h5>
            <div className='w-25 d-flex flex-row-reverse'>
            <CustomButton label="Add Charity" disabled={disableBtn} onClick={() => addCharity('addCharity')} />
            </div>
            </div>
            <div className='border-top-0' style={{border:'25px'}}>
            <Table className="custom-table">
                <thead className="sticky-header">
                    <tr className="">
                        {tableHeading?.map((e,index)=>(
                            <th className="fw-bold" key={index} style={{ fontWeight: 'bold' }}>{e}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {assetBeneficiary?.length == 0 ? <p className="d-flex align-items-center my-2 mx-4">No Data</p> : assetBeneficiary?.map((e, index)=>{
                        const addressData = ''
                        if(e?.address != null){
                            let { addressLine1, city, state, county, country, zipcode } = e?.address;
                            addressData = [addressLine1, city, state, county, country, zipcode]?.filter(value => value)?.join(", ");
                        }
                        const emailContact =( e.contact?.mobiles?.length > 0 ? $AHelper.$formatNumber(e.contact?.mobiles[0]?.mobileNo) : '-' ) +" / "+ (e.contact?.emails?.length > 0 ? e.contact?.emails[0]?.emailId : '-');
                        const filteredBeneficiaries = beneficiaryList?.filter((e) => {
                            const matchingBeneficiary = assetDetails?.assetBeneficiarys?.find(
                              (ben) => ben?.beneficiaryUserId == e?.value 
                            );
                            return !matchingBeneficiary;
                          });     
                          const filterSelectedBen = beneficiaryList?.filter((beneficiary) => e?.beneficiaryUserId == beneficiary?.value)[0] || {...newBeneficiary, isCharity:false}

                          const beneficiaryLists = e?.beneficiaryUserId != '' ? [...(filteredBeneficiaries || []), filterSelectedBen] : filteredBeneficiaries

                          beneficiaryLists?.sort((a, b) => {
                            {/* konsole.log(beneficiaryList,"beneficiaryListbeneficiaryList") */}
                            const isAPrimaryOrSpouse = a.value === primaryUserId || a.value === spouseUserId;
                            const isBPrimaryOrSpouse = b.value === primaryUserId || b.value === spouseUserId;
                            if (isAPrimaryOrSpouse && !isBPrimaryOrSpouse) {
                              return -1;
                            }
                            if (!isAPrimaryOrSpouse && isBPrimaryOrSpouse) {
                              return 1;
                            }
                            return 0;
                          });

                        return e?.isActive == true && <tr key={e?.agingAssetBeneficiaryId} className="col-12 justify-content-center align-items-center">
                            {e.isCharity == true ? <td className="col-4"><p className="mt-3 text-dark ms-2 text-container charityName">{e?.beneficiaryUserName || `${e?.fName || ''} ${e?.mName || ''} ${e?.lName || ''}`.trim()}</p> </td>
                            :<td className="col-5"><CustomSearchSelect tabIndex = {startingTabIndex + 1} placeholder="Choose Beneficiary" isSmall={true} value={e.beneficiaryUserId} options={beneficiaryLists} onChange={(ele) => handleChange('beneficiaryUserId', ele?.value, e?.beneficiaryUserId)} /></td>}
                            {e.isCharity == true ? <td className="col-4">
                                <div className="addressdiv">
                                    {e?.address != null ? <div className="d-flex align-items-center"><p className="text-container"><CustomTooltip maxLength={50} content={addressData} /></p></div> : <p className="text-center">-</p>}
                                    {(e?.contact?.emails.length > 0 || e?.contact?.mobiles.length > 0) ? <div className="d-flex align-items-center"><p className="text-container" title={emailContact}><CustomTooltip maxLength={50} content={emailContact} /></p></div> : e?.address != null && '-'}
                                </div>
                                </td> : <td className="col-4"><p className="pt-3 text-dark">{e?.beneficiaryUserId == ownerSelected?.toLowerCase() ? '-' : (ownerSelected?.toLowerCase() == spouseUserId ? beneficiaryList?.find((ben) => ben?.value == e?.beneficiaryUserId)?.relationWithSpouse : beneficiaryList?.find((ben) => ben?.value == e?.beneficiaryUserId)?.relationWithUser) || (e?.beneficiaryUserId == primaryUserId ? 'Primary User' : <p className="text-center">-</p>)}</p></td>}
                            <td className="col-4">
                            <div className={`d-flex ${e?.isCharity == true ? 'gap-3' : 'gap-2'} align-items-center justify-content-end`}>{e?.isCharity == true ? <>
                            <p className="mt-1 text-dark">{e?.beneficiaryPer != '' ? (e?.beneficiaryPer + "%") : ''}</p>
                            <img src="/New/icons/editbtnBeneficiary.svg" onClick={() => { editDeatils(e, 'editCharity') }} />
                            </> : <div className="d-flex gap-2"><CustomPercentageInput tabIndex = {startingTabIndex + 2} isPersonalMedical={true} isSmall={true} value={e?.beneficiaryPer} onChange={(ele) => handleChange('beneficiaryPer', ele, e?.beneficiaryUserId)} /></div>}
                            {e?.beneficiaryUserId != '' && <img width="25px" src="/icons/DeleteButton.svg" onClick={() => deleteBeneficiary(e)} />} {e.isCharity != true && e?.beneficiaryUserId != '' && e?.beneficiaryUserId == assetBeneficiary?.filter((ele)=> ele?.isCharity == false)?.slice(-1)[0]?.beneficiaryUserId && <img width="25px" src="/icons/Contact&address.svg" disabled={disableBtn} onClick={() => addBeneficiary()} />}</div></td>
                        </tr>})}
                </tbody>
                
            </Table>
            </div>
            </div>

            {/* <div className="w-100 d-flex justify-content-between px-2 gap-3 mb-3">
            <button tabIndex={startingTabIndex + 3} disabled={disableBtn} onClick={()=>{addBeneficiary()}} className="w-50 py-3" style={{border:'2px dashed #606060',borderRadius:'8px',color: '#000000',cursor: 'pointer', background:'white'}}>+ Add Beneficiary</button>
            <button tabIndex={startingTabIndex + 4} disabled={disableBtn} onClick={()=>{addCharity('addCharity')}} className="w-50 py-3" style={{border:'2px dashed #606060',borderRadius:'8px',color: '#000000',cursor: 'pointer',background:'white'}}>+ Add Charity</button>
            </div> */}
            </Col>
            </Row>
            
            {showModal && <div id="hideModalScrollFromPersonalMedicalHistory" className='modals' style={{zIndex:'9999'}}>
            <div className="modal" style={{ display: 'block', height:'95vh',overflowY:true}}>
            <div className="modal-dialog costumModal" style={{ maxWidth: '400px'}}>
            <div className="costumModal-content">
                <div className="modal-header mt-3 ms-1">
                <h5 className="modal-title">Charity Information</h5>
                <img className='mt-0 me-1'onClick={()=>closeModal(charityData)} src='/icons/closeIcon.svg'></img>
                </div>
                <div className="costumModal-body beneficiaryModal">
                <Col className="col-12 mt-2">
                <CustomInput tabIndex={startingTabIndex + 5} label="Charity Name*" placeholder="Enter Charity Name" value={charityData?.beneficiaryUserName} onChange={(ele)=>handleChange('beneficiaryUserName',ele,newUserId)} />
                </Col>
                <Col className="col-12 mt-2" >
                <CustomPercentageInput tabIndex={startingTabIndex + 6} label="Percentage" isPersonalMedical={true} isSmall={true} value={charityData?.beneficiaryPer} onChange={(ele)=>handleChange('beneficiaryPer',ele,newUserId)} />
                </Col>
                <Col className="mt-2">
                <ContactAndAddress startTabIndex={startingTabIndex + 7} isMandotry={false} refrencePage='charityData' userId={charityData?.beneficiaryUserId} showType="both" ref={addressRef} institutionUserId={charityData?.beneficiaryUserId} showOnlyForm={true} setAddressList={charityData?.address} />
                </Col>
                <Col className="col-12 d-flex justify-content-between mt-1">
                <CustomButton3 tabIndex={7 + 20} label="Cancel" onClick={()=>closeModal(charityData)} />
                <CustomButton tabIndex={7 + 20 + 1} label={!isNullUndefine(charityData?.agingAssetBeneficiaryId) ? "Update" : "Save"} onClick={()=>saveCharity(charityData)} />
                </Col>
                </div>
            </div>
            </div>
        </div>
        </div>
        
        
                    // <ReusableAddressContact
                    //   show={showModal} 
                    //   handleClose={handleClose}
                    //   header={modalType == 'contact' ? "Add contact information" : 'Add address information'}
                    //   modalType={''}
                    //   userId={newUserId}
                    //   editJsonData={editDetails}
                    //   refrencePage={"beneficiaryTable"}
                    //   setEditJsonData={()=>console.log('hfjdhfjdhdj')}
                    //    />
                  }

        </>
    )
}
export default BeneficiaryTable;
