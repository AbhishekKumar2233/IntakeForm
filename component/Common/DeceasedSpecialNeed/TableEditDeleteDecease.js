import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { $AHelper } from '../../Helper/$AHelper';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';
import { useLoader } from '../../utils/utils';
import { deceaseMemberStatusId, getApiCall, isNotValidNullUndefile, isNullUndefine, postApiCall, specialNeedMemberStatusId } from '../../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../../components/network/UrlPath';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import konsole from '../../../components/control/Konsole';
import UploadedFileView from '../File/UploadedFileView';
import { $ApiHelper } from '../../Helper/$ApiHelper';
const TableEditDeleteDecease = (props) => {
    const { item, handleUpdate, handleDelete, isOwner, refrencePage, actionType, memberUserId, ownerUserId } = props;
    const { loggedInUserId, primaryUserId, spouseUserId, primaryDetails, spouseDetails, } = usePrimaryUserId();
    const [isDeceasedMember, setIsDeceasedMember] = useState(false);
    const [memberStausId, setMemberStatusId] = useState(null);
    const [isOwnerDeceased, setIsOwnerDeceased] = useState(false);
    const [isBenefDeceased, setIsBenefDeceased] = useState(false);
    const [isFiduDeceased, setIsFiduDeceased] = useState(false);
    const [viewFileInfo, setViewFileInfo] = useState(false);
    const [lenderDataforDisplay,setLenderDataforDisplay]=useState('');
    const [itemAdditiDetails, setItemAdditiDetails] = useState({});
    const [viewPDFData,setviewPDFData]=useState([]);

    const refrencePageName = useMemo(()=>{return refrencePage },[refrencePage])

    const getUserLiabilityData =  async(userId,userRealPropertyId, fetchContactOfUserId) => {
        setLenderDataforDisplay('');
        if(!userId) return;
        let result=await getApiCall('GET', $Service_Url.getUserLiabilityByUserRealPropertyId + "/" + primaryUserId + '/' + userRealPropertyId, '');
        let value = result == 'err' ? {} : result;
        const addressLine1 = await $ApiHelper.$getAddressByUserId(value?.liability?.[0]?.lenderUserId ?? fetchContactOfUserId);
        const contactDetails = await $ApiHelper.$getContactByUserId(value?.liability?.[0]?.lenderUserId ?? fetchContactOfUserId);
        console.log("valuevaluevalue",value)
        setLenderDataforDisplay({...value, addressLine1: addressLine1, contactDetails: contactDetails});
    };

    konsole.log(lenderDataforDisplay,"lenderDataforDisplaylenderDataforDisplay")

    const lenderData = useMemo (()=>{
        console.log("lengerDataforDisplaylengerDataforDisplay",lenderDataforDisplay)
        return lenderDataforDisplay;
    },[lenderDataforDisplay,viewFileInfo])
    konsole.log(lenderData,lenderDataforDisplay,"lenderDetailsuseMemo")

    const fetchAddress = async (addressId) => {
        const response = await getApiCall('GET',$Service_Url.getAddressByaddressID + addressId,'')
        konsole.log(response.addressLine1,"responsessssssss")
        if(response == 'err'){
            return '';
        }
        return response?.addressLine1    
    }
  
    const bankdetails= isNotValidNullUndefile(item?.quesReponse) ? JSON?.parse(item?.quesReponse) : '' ;

    const transportationList = refrencePageName == 'Transportation' ? 
    [{'Type of Transport Assets': itemAdditiDetails?.otherDescription || item.assetTypeName || "N/A"},
    {'Year made': $AHelper.$isNullUndefine(item.yearMade) ? "N/A" : $AHelper.$getYearFromDate(item.yearMade)},
    {'Make':item.nameOfInstitution || "N/A"}, {'Model':(item.modelNumber || 'N/A')},
    {'Value': $AHelper.$isNullUndefine(item?.balance) ? "N/A" : $AHelper.$IncludeDollars(item?.balance)},
    {'Color (Optional)':(item.productColor || "N/A")}, {'License Plate':(item.licensePlate || "N/A")},
    {'VIN No': (item.vinno || "N/A")}, {'Vehical registration expiry date': $AHelper.$isNotNullUndefine(item?.expiryDate) ?  $AHelper.$getFormattedDate(item.expiryDate) :"N/A"},
    {'Owner':(item?.assetOwners?.length == 2) ? "Joint" : (item?.assetOwners?.length == 1) ? item?.assetOwners?.[0]?.ownerUserName : "N/A"},
    {'Name of company':(lenderData && lenderData?.liability?.length > 0 )? lenderData?.liability[0]?.nameofInstitutionOrLender:'N/A'},
    {'Interest rate': (lenderData?.liability?.length > 0 && lenderData?.liability?.[0]?.interestRatePercent != null) ? `${lenderData?.liability?.[0].interestRatePercent}%` : 'N/A'},
    {'Monthly Amount':(lenderData && lenderData?.liability?.[0]?.paymentAmount == null) ? "N/A" : $AHelper.$IncludeDollars(lenderData?.liability?.[0]?.paymentAmount)},
    {'Outstanding balance': $AHelper.$isNullUndefine(lenderData && lenderData?.liability?.[0]?.outstandingBalance) ? "N/A" : $AHelper.$IncludeDollars(lenderData?.liability?.[0]?.outstandingBalance)},
    {'Address': lenderData?.addressLine1 || "N/A"}, {"Phone number": lenderData?.contactDetails?.mobileNo || "N/A"},
    {"Email address": lenderData?.contactDetails?.emailId || "N/A"},
    // {'How are the expenses paid?':bankdetails.expensePaid == 2 ? "Auto Pay" : bankdetails.expensePaid == 1 ?  "Manually" :"N/A"},
    // ...(bankdetails?.expensePaid == 1 ? [{"Please specify the mode of payment": bankdetails.paymentMode == 11 ? "Mail" :bankdetails.paymentMode ==12 ? "In person" : bankdetails.paymentMode == 13 ? "Electronically" :"N/A"}]:[]),
    // ...(bankdetails?.expensePaid == 2 ? [{ 'Enter the Bank Name': bankdetails?.bankname || 'N/A' },
    // { 'Enter the Account Number': bankdetails?.accountnumber || 'N/A' }] : []),
    {'Pay off date': (lenderData && lenderData?.liability && lenderData?.liability?.length > 0 && lenderData?.liability?.[0]?.payOffDate) ? $AHelper.$getFormattedDate(lenderData?.liability?.[0]?.payOffDate): 'N/A'},
    {'Loan Number':(lenderData && lenderData?.liability?.length > 0 )? lenderData?.liability?.[0]?.loanNumber:'N/A'},
    ,
    ]:[];


    const realEstateList = refrencePageName == 'Real Estate' ? [
    {'Description of Property': itemAdditiDetails?.otherDescription || item?.assetTypeName || "N/A"},
    // {'Address': itemAdditiDetails?.addressLine1 || "N/A"}, 
    {'Address': item?.isRealPropertys?.[0]?.realPropertyAddress || "N/A" },
    {'Purchase price': $AHelper?.$isNullUndefine(item.isRealPropertys[0]?.purchasePrice) ? "N/A" : $AHelper.$IncludeDollars(item.isRealPropertys[0]?.purchasePrice)}, 
    {'Purchase date': $AHelper?.$isNullUndefine(item.isRealPropertys[0]?.purchaseDate) ? "N/A" : $AHelper.$getFormattedDate(item.isRealPropertys[0]?.purchaseDate) },
    {'Current value': $AHelper?.$isNullUndefine(item.isRealPropertys[0]?.value) ? "N/A" : $AHelper.IncludeDollars(item.isRealPropertys[0]?.value)},
    {'Owner': (item?.assetOwners?.length == 2) ? "Joint" : (item?.assetOwners?.length == 1) ? item.assetOwners[0]?.ownerUserName:""},
    // {'How are the expenses paid?':bankdetails.expensePaid == 2 ? "Auto Pay":  bankdetails.expensePaid == 1 ?  "Manually" :"N/A"},
    // ...(bankdetails?.expensePaid == 1 ? [{"Please specify the mode of payment": bankdetails.paymentMode == 11 ? "Mail" :bankdetails.paymentMode ==12 ? "In person" : bankdetails.paymentMode ==13 ? "Electronically" :"N/A"}]:[]),
    // ...(bankdetails?.expensePaid == 2 ?  [{'Enter the Bank Name': bankdetails?.bankname || 'N/A' },
    // { 'Enter the Account Number': bankdetails?.accountnumber || 'N/A' }] : []),
    {'Debt against the property': Array.isArray(lenderData?.liability) && lenderData?.liability?.length > 0 ? lenderData?.liability[0]?.liabilityName : 'N/A'},
    {'Name of Lender':(lenderData && lenderData?.liability?.length > 0 )? lenderData?.liability[0]?.nameofInstitutionOrLender:''},
    {'Address of lender': lenderData?.addressLine1 || "N/A"},
    {"Lender Phone number": lenderData?.contactDetails?.mobileNo || "N/A"}, 
    {"Email address": lenderData?.contactDetails?.emailId || "N/A"},
    {'Loan Number': lenderData?.liability?.[0]?.loanNumber || "N/A"}, 
    {'Monthly Amount': !lenderData?.liability?.[0]?.paymentAmount || lenderData.liability[0].paymentAmount == "0" ? "N/A" : $AHelper.IncludeDollars(lenderData.liability[0].paymentAmount)},
    {'Interest Rate':(lenderData && lenderData?.liability?.length > 0 ) ? $AHelper.$isNullUndefine(lenderData?.liability[0]?.interestRatePercent) ? "N/A" :  lenderData?.liability[0]?.interestRatePercent + "%" :'N/A'},
    {'Outstanding Balance': !lenderData?.liability?.[0]?.outstandingBalance || lenderData?.liability?.[0]?.outstandingBalance  == "0" ? "N/A" :  $AHelper.IncludeDollars(lenderData?.liability?.[0]?.outstandingBalance)},
    ]:[]

    const fetchDataForPdf = async ( selectedItem ) => {
        konsole.log("sdvbkjbjs", selectedItem);

        const addressOfCur = isNotValidNullUndefile(selectedItem?.isRealPropertys?.[0]?.addressId) ? await fetchAddress(selectedItem?.isRealPropertys?.[0]?.addressId) : undefined;
        const otherOj=[{isActive: true, othersMapNatureId: String(selectedItem?.userAgingAssetId ?? selectedItem?.userLifeInsuranceId), othersMapNature: '', userId: primaryUserId}]
        const getOtherRes = (selectedItem?.insuranceCompany == "Other" ||  selectedItem?.assetTypeName == "Other" )? await postApiCall("POST", $Service_Url.getOtherFromAPI, otherOj) : {};
        konsole.log("ViewOtherData", getOtherRes?.data?.data?.length)

        setItemAdditiDetails({addressLine1: addressOfCur, otherDescription: getOtherRes?.data?.data?.[0]?.othersName});
    }
   

    const itemList = useMemo(()=>{
        return (refrencePageName == 'Retirement' || refrencePageName == 'Non-Retirement') ? 
        [{[refrencePageName === 'Non-Retirement' ? 'Type of asset' : 'Type of Retirement Asset'] : itemAdditiDetails?.otherDescription || item?.assetTypeName},
        {'Name of institution':item?.nameOfInstitution || "N/A"},
        {'Balance': isNullUndefine(item?.balance) ? "N/A" :  $AHelper.$IncludeDollars(item?.balance)}, 
        {'Owner':(item?.assetOwners?.length == 2) ? "Joint" : (item?.assetOwners?.length == 1) ? item?.assetOwners?.[0]?.ownerUserName : "N/A"},
        // {'Beneficiary / Charity':item?.assetBeneficiarys[0]?.beneficiaryUserName ? item?.assetBeneficiarys[0]?.beneficiaryUserName : 'N/A'}, 

        // {'Address': lenderData?.addressLine1 || "N/A"}, 
        // {"Phone number": lenderData?.contactDetails?.mobileNo || "N/A"}, 
        // {"Email address": lenderData?.contactDetails?.emailId || "N/A"}, 

        {'Address': item?.institutionAddress || "N/A"}, 
        {"Phone number": $AHelper.newPhoneNumberFormat(item?.institutionPhoneNo) || "N/A"},
        {"Email address": item?.institutionEmail || "N/A"}, 

        {"Account Number": item?.accountNo || "N/A"}
        // {'How are the expenses paid?': bankdetails.expensePaid == 2 ? "Auto Pay" : bankdetails.expensePaid == 1 ?  "Manually" :"N/A" },
        // ...(bankdetails?.expensePaid == 1 ? [{"Please specify the mode of payment": bankdetails.paymentMode == 11 ? "Mail" :bankdetails.paymentMode == 12 ? "In person" : bankdetails.paymentMode == 13 ? "Electronically" : "N/A"}]:[]),
        // ...(bankdetails?.expensePaid == 2 ? [{ 'Enter the Bank Name': bankdetails?.bankname || 'N/A' },
        // { 'Enter the Account Number': bankdetails?.accountnumber || 'N/A' }] : [])
        
          ] :refrencePageName == 'LifeInsuraneForm' ? 

        [{'Insurance company': itemAdditiDetails?.otherDescription || item?.insuranceCompany},
        {'Policy No': item.additionalDetails != '' ? item?.additionalDetails: "N/A"},
        {'Type of Policy': itemAdditiDetails?.otherDescription || item?.policyType || "N/A"},
        {'Policy Start': $AHelper.$isNullUndefine(item?.policyStartDate) ? "N/A" : $AHelper.$getFormattedDate(item?.policyStartDate)},
        {'Policy Expire': $AHelper.$isNullUndefine(item?.policyExpiryDate) ? "N/A" : $AHelper.$getFormattedDate(item?.policyExpiryDate)},
        {'Premium Frequency':item?.premiumType || "N/A"},
        {'Premium Amount':$AHelper.$isNullUndefine(item?.premium) ? "N/A" :  $AHelper.$IncludeDollars(item?.premium)},
        {'Death Benefits': isNullUndefine(item?.deathBenefits) ? "N/A" :  $AHelper.$IncludeDollars(item?.deathBenefits)},
        {'Beneficiary': item.beneficiary?.[0]?.beneficiaryName || "N/A"},
        // {'How are the expenses paid?':bankdetails.expensePaid == 2 ? "Auto Pay": bankdetails.expensePaid == 1 ?  "Manually" :"N/A" },
        // ...(bankdetails?.expensePaid == 1 ? [{"Please specify the mode of payment": bankdetails.paymentMode == 11 ? "Mail" :bankdetails.paymentMode == 12 ? "In person" : bankdetails.paymentMode == 13 ? "Electronically" : "N/A"}]:[]),
        // ...(bankdetails?.expensePaid == 2 ? [{ 'Enter the Bank Name': bankdetails?.bankname || 'N/A' },
        // { 'Enter the Account Number': bankdetails?.accountnumber || 'N/A' }] : [])
        ] :  refrencePageName == 'Transportation' ? transportationList : refrencePageName == 'Real Estate' ? realEstateList: []
    },[refrencePageName,lenderDataforDisplay, viewPDFData, itemAdditiDetails])

      const showEyeIcons = useMemo(()=>{ return refrencePageName == 'Retirement' || refrencePageName == 'Non-Retirement' || refrencePageName == 'LifeInsuraneForm' ||
             refrencePageName == 'Transportation' || refrencePageName == 'Real Estate'  } ,[refrencePageName, lenderDataforDisplay])

      useEffect(() => {
        if ($AHelper.$isNotNullUndefine(memberUserId)) {
            getMemberInfo();
        }
        if (props?.isOwner == true) {
            ownerInfo();
        }
        return () => { };
    }, [memberUserId, ownerUserId])


    const getMemberInfo = async () => {
        useLoader(true)
        const result = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + memberUserId);
        konsole.log('result of memberdetail', result)
        useLoader(false)
        if (result == 'err') return;
        const memberStatusId = result?.member?.memberStatusId;
        setMemberStatusId(memberStatusId)
        if (actionType === 'Fiduciary') {
            setIsDeceasedMember(memberStatusId == deceaseMemberStatusId || memberStatusId == specialNeedMemberStatusId);
            if ((memberStatusId == deceaseMemberStatusId || memberStatusId == specialNeedMemberStatusId) == false && isOwner == true) {
                const _result = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + ownerUserId);
                konsole.log('_result_resultbb', _result)
                if (_result == 'err') return;
                const _memberStatusId = result?.member?.memberStatusId;
                konsole.log('_memberStatusId', _memberStatusId);
                let resultCheck = _memberStatusId == deceaseMemberStatusId || _memberStatusId == specialNeedMemberStatusId
                setIsDeceasedMember(resultCheck);
                setIsFiduDeceased(resultCheck)
            }
        } else if (actionType === 'Beneficiary') {

            setIsBenefDeceased(memberStatusId == deceaseMemberStatusId)
            setIsDeceasedMember(memberStatusId == deceaseMemberStatusId);
            if ((memberStatusId == deceaseMemberStatusId) == false && isOwner == true) {
                const _result = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + ownerUserId);
                konsole.log('_result_resultaaa', _result);
                if (_result == 'err') return;
                const _memberStatusId = _result?.member?.memberStatusId;
                konsole.log('_memberStatusIdOfbeneficiary', _memberStatusId, deceaseMemberStatusId, _memberStatusId == deceaseMemberStatusId)
                setIsDeceasedMember(_memberStatusId == deceaseMemberStatusId);
                setIsOwnerDeceased(_memberStatusId == deceaseMemberStatusId)
            }
        } else if (actionType === 'Owner') {
            setIsDeceasedMember(memberStatusId == deceaseMemberStatusId);
            // setIsOwnerDeceased(memberStatusId == deceaseMemberStatusId);
        }
    }
    const ownerInfo = async () => {
        const _ownrUserId = ownerUserId
        konsole.log(_ownrUserId, '_ownrUserId', primaryDetails, spouseDetails)
        let _memberStatusId = ''
        if (_ownrUserId == primaryUserId) {
            konsole.log("primaryDetails", primaryDetails);
            _memberStatusId = primaryDetails?.memberStatusId;
        } else if (_ownrUserId == spouseUserId) {
            _memberStatusId = spouseDetails.memberStatusId;
            konsole.log("spouseDetails", spouseDetails)
        } else {
            const _result = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + ownerUserId);
            konsole.log('_result_resultaaa', _result)
            if (_result == 'err') return;
            _memberStatusId = _result?.member?.memberStatusId;
            konsole.log('_memberStatusId', _memberStatusId, deceaseMemberStatusId, _memberStatusId == deceaseMemberStatusId)
        }
        setIsDeceasedMember(_memberStatusId == deceaseMemberStatusId);
        setIsOwnerDeceased(_memberStatusId == deceaseMemberStatusId)
    }
    function deleteInformation(item) {
        handleDelete(item);
    }
    function updateInformation(item) {
        handleUpdate(item);
    }

    konsole.log("isOwnerDeceasedisFiduDeceased",isOwnerDeceased,isBenefDeceased,isFiduDeceased)

    const memberDeceaseType = useMemo(() => {
        let members = [];

        if (isOwnerDeceased === true && isOwner==true) {
            members.push('owner');
        }
        if (isBenefDeceased === true) {
            members.push('beneficiary');
        }
        if (isFiduDeceased === true) {
            members.push('fiduciary');
        }

        if (members.length === 1) {
            return members[0];
        } else if (members.length === 2) {
            return members.join(' and ');
        } else if (members.length > 2) {
            return `${members.slice(0, -1).join(', ')}, and ${members[members.length - 1]}`;
        }
        return '';
    }, [isOwnerDeceased, isBenefDeceased, isFiduDeceased]);


    let msgTooltip1 = useMemo(() => {
        return `As the ${memberDeceaseType} member living status changed to deceased, please remove the deceased member from the documents.`;
    }, [isOwnerDeceased, isBenefDeceased, isFiduDeceased]);

    let msgTooltip2 = useMemo(() => {
        return `As the ${memberDeceaseType}  member living status changed to deceased, please remove the deceased member from the documents.`;
    }, [isOwnerDeceased, isBenefDeceased, isFiduDeceased]);

    let msgTooltip3 = useMemo(() => {
        return `As the ${memberDeceaseType}  member living status changed to special needs, please remove the special needs member from the documents.`
    }, [isOwnerDeceased, isBenefDeceased, isFiduDeceased]);

    const msgObj = {
        2: msgTooltip2,
        3: msgTooltip3,
        'msgBeneficiary': msgTooltip1
    }

    const tooltip = (
        <Tooltip id="tooltip-disabeld" style={{ zIndex: "99999999999999999" }}>
            {(actionType === 'Beneficiary') ? msgObj['msgBeneficiary'] : msgObj[Number(memberStausId)]}
        </Tooltip>
    );
    
    const handleViewFileInfo = (val) => {
        const fetchContactOfUserId = (refrencePageName == 'Retirement' || refrencePageName == 'Non-Retirement') ? item?.institutionUserId : undefined;
        getUserLiabilityData(item?.assetOwners?.[0]?.ownerUserId,item?.isRealPropertys?.[0]?.userRealPropertyId, fetchContactOfUserId)
        setViewFileInfo(val)
        fetchDataForPdf(item)
        konsole.log("sdbvbksjbkd", item, props.item);   
    }

    konsole.log('isOwnerDeceased', isOwnerDeceased)
    konsole.log('isBenefDeceased', isBenefDeceased)
    konsole.log('isFiduDeceased', isFiduDeceased)
    
    return (
        <>
            <div className="d-flex justify-content-end gap-4 me-3">
            {(showEyeIcons)  && <img src="/New/icons/file-eye-view.svg" alt="Veiw Icon" className="icon cursor-pointer" onClick={() => handleViewFileInfo(true)} />}
                {(isDeceasedMember == false) && (
                    <img src="/New/icons/edit-Icon.svg" alt="Edit Icon" className="icon cursor-pointer" onClick={() => updateInformation(item)} />
                )}
                {(isDeceasedMember) && <>
                    <OverlayTrigger overlay={tooltip} >
                        {/* <img style={{ cursor: "pointer", width: "20px", marginBottom: ".30rem", marginLeft: "2px" }} src="/New/icons/iIconInfo.svg" alt="I Info Icon" className="icon cursor-pointer"  /> */}
                        <img src="/New/icons/iIconInfo.svg" alt="Edit Icon" className="icon cursor-pointer" />
                    </OverlayTrigger>
                </>}
                <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer" onClick={() => deleteInformation(item)} />
                {viewFileInfo && (showEyeIcons) && <UploadedFileView key={"lenderData + item + viewFileInfo"} refrencePageName='Retirement' isOpen={true} fileId={refrencePageName == 'LifeInsuraneForm' ? item?.insuranceDocs[0]?.docFileId : item?.assetDocuments[0]?.fileId} handleViewFileInfo={handleViewFileInfo} fileDetails={{ name: `${refrencePageName == 'Transportation' ? 'Transport Assets' : refrencePageName == 'LifeInsuraneForm' ? 'Insurance Policies' : refrencePageName}` }} 
                itemList={itemList} beneficiaryData ={item?.assetBeneficiarys} item={item} />}
            </div>
        </>
    )
}

export default TableEditDeleteDecease
