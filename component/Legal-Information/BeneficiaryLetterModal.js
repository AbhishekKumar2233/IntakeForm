import { Col,Row,Modal} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import {useState,useEffect,memo,useContext,useMemo} from "react"
import { selectorFinance } from "../Redux/Store/selectors"
import { $AHelper } from '../Helper/$AHelper';
import { $CommonServiceFn } from "../../components/network/Service"
import { $Service_Url } from "../../components/network/UrlPath";
import { useAppDispatch, useAppSelector } from '../Hooks/useRedux';
import { setHideCustomeSubSideBarState, useLoader } from '../utils/utils';
import { fetchRetirementNonRetirementData,fetchLifeInsByUserIdData, updateNonRetirementAssestsList, updateRetirementAssetsList, fetchXmlGenerater} from '../Redux/Reducers/financeSlice';
import { postApiCall, removeDuplicate,isNullUndefine,getApiCall,isNotValidNullUndefile } from '../../components/Reusable/ReusableCom';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import OtherInfo from "../../components/asssets/OtherInfo";
import { globalContext } from '../../pages/_app'
import { $getServiceFn } from "../../components/network/Service";
import konsole from '../../components/control/Konsole';
import AiModal from '../Finance-Information/Assets/RetirementNonRetirement.js/AiModal';
import { paralegalAttoryId ,demo } from '../../components/control/Constant';
import UploadedFileView from '../Common/File/UploadedFileView'
import { $ApiHelper } from '../Helper/$ApiHelper';
import EditBeneficiaryModal  from "../Custom/EditBeneficiaryModal";

function BeneficiaryLetterModal(props)
{
    // console.log("BeneficiaryLetterModalprops",props)
    const { primaryUserId, loggedInUserId,spouseUserId,userDetailOfPrimary,loggedInMemberRoleId } = usePrimaryUserId();
    const { setConfirmation, newConfirm, setWarning } = useContext(globalContext)
    const [closeModal, setCloseModal] = useState(false)
    const financeData = useAppSelector(selectorFinance);
    const [showAiDoc, setShowAiDoc] = useState(false)
    const [aiDocuments, setAiDocuments] = useState()
    const [stopLoader, setStopLoader] = useState(false)
    const [otherfieldname, setOtherfieldName] = useState("");
    const[nonRetirementAssetsListData,setNonRetirementAssetsListData]=useState([])
    const[retirementAssetsListData,setRetirementAssetsListData]=useState([])
    const[lifeInsuranceCombinedData,setLifeInsuranceCombinedData]=useState([])
    const[viewEditModal,setViewEditModal]=useState({
        condition:null,
        tableName:null,
        beneficiaryData:null,
        tableData:null,
        addressLine1:null,

    })
    const [itemAdditiDetails, setItemAdditiDetails] = useState({});
    const [lenderDataforDisplay,setLenderDataforDisplay]=useState('');
    const tableHeadingModal=[{name:"Type of Assest"},{name:"Name of Institution"},{name:"Address"},{name:"Phone no"},{name:"Last 4 digits"},{name:"Beneficiary/Charity"},{name:"View/Edit"}]
    const tableHeadingModalLifeInsurance=[{name:"Insurance Company"},{name:"Type of Policy"},{name:"Policy No"},{name:"Beneficiary"},{name:"View/Edit"}]
    const[showTime,setShowTime]=useState([])
    const [closeEditModal, setEditCloseModal] = useState(false)
    // const tableHeadingModal=[{name:"Type of Assest"},{name:"Name of Institution"},{name:"Address"},{name:"Phone no"},{name:"Last 4 digits"},{name:"Beneficiary/Charity"}]
    // const tableHeadingModalLifeInsurance=[{name:"Insurance Company"},{name:"Type of Policy"},{name:"Policy No"},{name:"Beneficiary"}]
    const dispatch = useAppDispatch();
    const errorMessage="Must be filled out for the letter"
    const [documentNameVersion, setDocumentNameVersion] = useState({
        client_name: "",
        version: ""
      });

    // console.log("financeDatafinanceData",financeData)
    // console.log("BeneficiaryLetterModalusePrimaryUserId",usePrimaryUserId())
    
    useEffect(()=>{
        if(props.activeTab==7){
            setCloseModal(true)
        }
    },[props.activeTab])

    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(primaryUserId) && (retirementAssetsListData?.length == 0 || lifeInsuranceCombinedData?.length==0 || nonRetirementAssetsListData?.length == 0)) {
            fetchDataModalData();    
        }
        return () => setHideCustomeSubSideBarState(false)
    }, [primaryUserId, dispatch,spouseUserId])

    const closeModalFun=()=>{
        props.setActiveTabData(1)
        setCloseModal(false)
    };

    async function getOtherRetNonRetList(mappedData,tableName) {
        // console.log("mappedData",mappedData)
        useLoader(true);
        let OtherRetirementList = await Promise.all(
            mappedData.map(async (item) => {
                // let jsonobj = [{ userId: userId, othersMapNatureId: othersMapNatureId, isActive: true, othersMapNature: "" }];
                let jsonobj = [{
                    userId: (tableName=="Insurance2")?item.userId:primaryUserId,
                    othersMapNatureId:(tableName=="Insurance2")?(item?.userLifeInsuranceId):(item?.userAgingAssetId),
                    // othersMapNatureId:item?.userAgingAssetId,
                    isActive: true,
                    othersMapNature: ""
                }];
                    // console.log("2343jsonobjjsonobj",jsonobj)
                    // console.log("mappedDataitemitem",item)
                try {
                    let response = await postApiCall("POST", $Service_Url.getOtherFromAPI, jsonobj);
                    // console.log("API Response:", response?.data?.data);
                    const otherInsuranceCompanyName=response?.data?.data.filter((value)=>value?.othersCategoryId==12)
                    const otherPolicyName=response?.data?.data.filter((value)=>value?.othersCategoryId==23)
                    // console.log("otherInsuranceCompanyName",otherInsuranceCompanyName,"otherPolicyName",otherPolicyName)
                    if ((item?.agingAssetTypeId == 999999)) {
                        return {...item,assetTypeName: (response?.data?.data?.[0]?.othersName) ?? "Other"};
                    }
                    if( item?.insuranceCompanyId == 999999 && item?.policyTypeId == 999999)
                        {
                            return {...item,insuranceCompany: ((otherInsuranceCompanyName?.[0]?.othersName) ?? "Other"),policyType:( (otherPolicyName?.[0]?.othersName) ?? "Other")};
                    }
                    if (item?.insuranceCompanyId === 999999 || item?.policyTypeId === 999999) {
                        return {...item,...(item.insuranceCompanyId === 999999 && {insuranceCompany: otherInsuranceCompanyName?.[0]?.othersName ?? "Other",}),...(item.policyTypeId === 999999 && {policyType: otherPolicyName?.[0]?.othersName ?? "Other",}),};
                    }
                    useLoader(false);
                }catch(error) {
                    konsole.error("Error fetching data:", error);
                    useLoader(false);
                }
                return item;
            })
        );
    
        // console.log("OtherRetirementList", OtherRetirementList);
        return OtherRetirementList;
    }

    const fetchDataModalData = async () => {
        try{
            useLoader(true);
            // console.log("423eqwdas",$AHelper.$isNullUndefine(primaryUserId),"------",primaryUserId)
            const _resultOf = await dispatch(fetchRetirementNonRetirementData({ userId: primaryUserId }));
            let PrimaryLifeInsData= await dispatch(fetchLifeInsByUserIdData({ userId:primaryUserId }));
            let combinedDataForInsurance=[]
            if (PrimaryLifeInsData.payload !== 'err') {
                PrimaryLifeInsData=PrimaryLifeInsData?.payload?.lifeInsurances
                // console.log("PrimaryLifeInsData",PrimaryLifeInsData)
                if(PrimaryLifeInsData.length>0){
                    PrimaryLifeInsData=PrimaryLifeInsData.map((values)=>({...values,userId:primaryUserId}))
                    combinedDataForInsurance.push(...PrimaryLifeInsData)
                    setLifeInsuranceCombinedData(PrimaryLifeInsData)
                }
            } 
            let SpouseLifeInsData= await dispatch(fetchLifeInsByUserIdData({ userId:spouseUserId }));
            if (SpouseLifeInsData.payload !== 'err') {
                SpouseLifeInsData=SpouseLifeInsData?.payload?.lifeInsurances
                // console.log("SpouseLifeInsData",SpouseLifeInsData)
                if(SpouseLifeInsData.length>0){
                SpouseLifeInsData=SpouseLifeInsData.map((values)=>({...values,userId:spouseUserId}))
                combinedDataForInsurance.push(...SpouseLifeInsData)
                setLifeInsuranceCombinedData((prev)=>([...prev,...SpouseLifeInsData]))
                }
            } 
        
            let retirementData = []
            let nonRetirementData = []
            if (_resultOf.payload == 'err') {
                retirementData = []
                nonRetirementData = []
            } else {
                nonRetirementData = _resultOf.payload?.filter((v, j) => v.agingAssetCatId == "1");
                retirementData = _resultOf.payload?.filter((v, j) => v.agingAssetCatId == "2");
            }
            getOtherRetNonRetList(nonRetirementData).then(result => setNonRetirementAssetsListData(result.map(item => ({ ...item, checked: true }))));
            getOtherRetNonRetList(retirementData).then(result => setRetirementAssetsListData(result.map(item => ({ ...item, checked: true }))));
            getOtherRetNonRetList(combinedDataForInsurance,"Insurance2").then(result => setLifeInsuranceCombinedData(result.map(item => ({ ...item, checked: true }))));
            useLoader(false);
        }catch(err){
            konsole.log("err",err)
            useLoader(false);
        }
       
    }

    // Xml-File-Genration

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    }
    const getDocumentDetails =(data)=>{
        return new Promise((resolve, reject) => {
          $getServiceFn.getLegalDocForAsset(data, (res, err) => {
            if (res) {            
                const response = res?.data;
                resolve(response)
            }
            else {
              resolve('err')
            }
          })      
        })
      }

      const getDocument =(data,version)=>{
        return new Promise((resolve, reject) => {
          const json ={"userName":data,"version":version}
          $getServiceFn.postGenrateDoc(json, (res, err) => {
            if (res) {            
                const response = res?.data;
                resolve(response)
            }
            else {
              resolve('err')
            }
          })      
        })
      }

      const getDocumentVersion =(data)=>{
        return new Promise((resolve, reject) => {
          $getServiceFn.getDocumentVersion(data, (res, err) => {
            if (res) {            
                const response = res?.data;
                resolve(response)
            }
            else {
              resolve('err')
            }
          })      
        })
    }

    let attempts = 0; // Counter to track consecutive empty responses
    let intervalId = null
    let startTime = Date.now();
    let timings = [];
    let api4Start, api4End; 


    const funToGenerateDoc=async()=>{

        const combineAllLists=[...(nonRetirementAssetsListData || []),...(retirementAssetsListData || []),...(lifeInsuranceCombinedData || [])];
        const combinedRetNonRetData=[...(nonRetirementAssetsListData || [] ),...(retirementAssetsListData || [])]
        if(combineAllLists.length==0){
            toasterAlert("warning", `No data found`);
            return
        }
        const checkForNothingSelected=combineAllLists?.every((data)=>data?.checked==false)
        if(checkForNothingSelected){
            toasterAlert("warning", `Kindly select a checkbox to generate Beneficiary letter`);
            return
        }
        // console.log("checkForNothingSelected",checkForNothingSelected)
        // console.log("ddnonRetirementAssetsListData",nonRetirementAssetsListData,"retirementAssetsListData",retirementAssetsListData,"lifeInsuranceCombinedData",lifeInsuranceCombinedData)
        useLoader(true);
      
        // toasterAlert("successfully", "Successfully" , `Getting data from Portal in process ${new Date(api1Start).toLocaleTimeString()}`)
        toasterAlert("successfully", "Successfully" , `Fetching client's data `)
        let api1Start = Date.now();
        let contresultOfUserAgentsforPrimary = await dispatch(fetchXmlGenerater({ userId: primaryUserId }));
        if (contresultOfUserAgentsforPrimary?.payload == 'err') {
            toasterAlert("warning", `Failed fetching client's data `);
            useLoader(false);
            return;
        }
        let api1End = Date.now();
        // ${new Date(api4Start).toLocaleTimeString()}
        // timings.push(`Fetching data from Portal:s---Strting---${new Date(api1Start).toLocaleTimeString()} --Ending---${new Date(api1End).toLocaleTimeString()}---totalTiming--- ${(api1End - api1Start) / 1000} sec`);
        toasterAlert("successfully", "Successfully" , "Data fetched successfully")
        timings.push(`Fetching client's data: ${(api1End - api1Start) / 1000} sec`);
        contresultOfUserAgentsforPrimary= JSON.parse(JSON.stringify(contresultOfUserAgentsforPrimary?.payload?.data))
        // console.log("1contresultOfUserAgentsforPrimary",contresultOfUserAgentsforPrimary)
        
        //For retirement and non-retirement

        if(combinedRetNonRetData?.length>0)
        {

            let nonRetirementUpdateData=contresultOfUserAgentsforPrimary?.userAgingAsset?.map((data1)=>{
                const newArray= combinedRetNonRetData.some((data2)=>((data1?.userAgingAssetId==data2?.userAgingAssetId) && data2?.checked==false))
                // console.log("1newArray",newArray)
                if(newArray==true){
                    return ({...data1,generateBeneficiaryLetter:false})
                }
                // console.log("contresultOfUserAgentsforPrimarydataaaaaaaaaaaa",data1,"combinedRetNonRetData",combinedRetNonRetData)
                return data1
            })
            // console.log("nonRetirementUpdateData",nonRetirementUpdateData)
            contresultOfUserAgentsforPrimary={...contresultOfUserAgentsforPrimary,userAgingAsset:nonRetirementUpdateData}
        }
        // For LifeInsurance Primary

        if(lifeInsuranceCombinedData?.length>0){
            let lifeInsrananceUpdateArray=contresultOfUserAgentsforPrimary?.lifeInsurance?.map((data1)=>{
                const newArray= lifeInsuranceCombinedData.some((data2)=>((data1?.userLifeInsuranceId==data2?.userLifeInsuranceId) && data2?.checked==false))
                // console.log("21newArray",newArray)
                if(newArray==true){
                    return ({...data1,generateBeneficiaryLetter:false})
                }
                // console.log("2contresultOfUserAgentsforPrimarydataaaaaaaaaaaa",data1,"combinedRetNonRetData",combinedRetNonRetData)
                return data1
            }) 
            // console.log("lifeInsrananceUpdateArray",lifeInsrananceUpdateArray)
            contresultOfUserAgentsforPrimary={...contresultOfUserAgentsforPrimary,lifeInsurance:lifeInsrananceUpdateArray}
        }
       

         // For LifeInsurance Spouse 

        let isPrimaryMemberMaritalStatus =($AHelper.$isMarried(contresultOfUserAgentsforPrimary?.maritalStatusId) && $AHelper.$isNotNullUndefine(spouseUserId))  ? true : false; // Checking marital status
        // console.log("isPrimaryMemberMaritalStatus",isPrimaryMemberMaritalStatus)
        if(isPrimaryMemberMaritalStatus)
        {
            let getFamilyMemberArray=contresultOfUserAgentsforPrimary?.familyMember
            if(getFamilyMemberArray?.[0]?.lifeInsurance?.length>0)
            {
                let lifeInsrananceUpdateArrayForSpouse=getFamilyMemberArray?.[0]?.lifeInsurance.map((data1)=>{
                    const newArray= lifeInsuranceCombinedData?.some((data2)=>((data1?.userLifeInsuranceId==data2?.userLifeInsuranceId) && data2?.checked==false))
                    // console.log("31newArray",newArray)
                    if(newArray==true){
                        return ({...data1,generateBeneficiaryLetter:false})
                    }
                    // console.log("3contresultOfUserAgentsforPrimarydataaaaaaaaaaaa",data1,"combinedRetNonRetData",combinedRetNonRetData)
                    return data1
                }) 
    
                // console.log("lifeInsrananceUpdateArrayForSpouse",lifeInsrananceUpdateArrayForSpouse)
                contresultOfUserAgentsforPrimary = {...contresultOfUserAgentsforPrimary,familyMember:contresultOfUserAgentsforPrimary.familyMember.map(member => {return ({ ...member,lifeInsurance: lifeInsrananceUpdateArrayForSpouse }) })      };
                // console.log("1232323resultOfUserAgentsforPrimary",resultOfUserAgentsforPrimary)
            }
            
        }
        // console.log("32contresultOfUserAgentsforPrimary",contresultOfUserAgentsforPrimary)
        // return
//        useLoader(false);
        const jsonString = JSON.stringify( contresultOfUserAgentsforPrimary, null, 2);
        // console.log("jsonString",jsonString)
        const blob = new Blob([jsonString], { type: 'application/json' });
        // console.log("blobjsonString",blob)
        const file = new File([blob], `UserMember_${primaryUserId}_Details.json`, { type: 'application/json' });
        // console.log("filejsonString",file,"typrof",typeof file,"length",file.name)
        const formData = new FormData();
        formData.append('input_file', file);
        // console.log("formData:", formData);
        toasterAlert("successfully", "Successfully" , "Sharing client's data to Ai")
        let api2Start = Date.now();
        const getDocumentData =  await getDocumentDetails(formData)    
        let api2End = Date.now();
        // console.log("getDocumentData",getDocumentData)
        if(getDocumentData.message!="Document processing started"){
            toasterAlert("deletedSuccessfully", `Error while generating Ai document, Please try after sometime`);
            useLoader(false);
            return;
        }
        toasterAlert("successfully", "Successfully" , "Client's data validated successfully from AI now processing for document generation")   
        timings.push(`Sharing client's data to Ai: ${(api2End - api2Start) / 1000} sec`);
        const document_directory_name=getDocumentData?.directory_name
        // const getDocumentData =  await getDocumentDetails(formdata)
        toasterAlert("successfully", "Successfully" , "Calling api to get version for documents urls")
        let api3Start = Date.now();
        const getDocumentVersionData = await getDocumentVersion(document_directory_name)
        let api3End = Date.now();
        // console.log("getDocumentVersionData",getDocumentVersionData)
        if(getDocumentVersionData=="err"){
            toasterAlert("warning", `Document not found, Try after sometime`);
            useLoader(false);
            return;
        }
        toasterAlert("successfully", "Successfully" , "SuccessFully got version name, now sending for getting document urls")
        timings.push(`Calling api to get version for document urls : ${(api3End - api3Start) / 1000} sec`);
        const latestDocument = getDocumentVersionData?.reduce((latestDoc, currentDoc) => {
        return new Date(currentDoc.timestamp) > new Date(getDocumentVersionData?.timestamp)
            ? currentDoc
            : latestDoc;
        });
        setDocumentNameVersion({
            client_name: document_directory_name || "" ,
            version: latestDocument?.file_name || ""
        });
        // console.log("123documentNameVersion",documentNameVersion)
        // console.log("documentname",document_directory_name,"latestDocument?.file_name",latestDocument?.file_name)
        startTime = Date.now();
        toasterAlert("successfully", "Successfully", `Document generation started`); 
        api4Start = Date.now();
        intervalId = setInterval(async () => {
                await checkAndFetchDocuments(document_directory_name,latestDocument?.file_name);
        }, 5000);
    }

    const checkAndFetchDocuments = async (getDocumentData,version) => {
        useLoader(false)
        const updatedDocumentStatus = await getDocument(getDocumentData,version);
        setStopLoader(true)
        if(updatedDocumentStatus == 'err'){
          clearInterval(intervalId); // Stop the interval
          setStopLoader(false)
        }
        setAiDocuments(updatedDocumentStatus)
        setShowAiDoc(true)
        if (updatedDocumentStatus?.in_progress_documents?.length === 0) {
            attempts += 1; // Increment the counter if no documents are in progress
    
            if (attempts >= 2) {
                setStopLoader(false)
                clearInterval(intervalId); // Stop the interval
                api4End = Date.now(); 
                timings.push(`Document generation timing: ${(api4End - api4Start) / 1000} sec`);
                //  console.log("timings",timings)
                setShowTime(timings)
            } else {
            }
        } else {
            attempts = 0;
        }
      };

      const checkeIfAllBoxesAreCheckedFun=(tableData)=>{
            // console.log("nonRetirementAssetsList",nonRetirementAssetsList)
            if(tableData.length==0){return false}
            return tableData.every(data=>data?.checked==true)
      }

      const onChangeAllcheckboxesAtOnceFun=(e,tableName)=>{
        const eventChekeked=e.target.checked;
        // console.log("eventChekeked",eventChekeked)
        let mappingList=(tableName=="Non-Retirement")?nonRetirementAssetsListData:(tableName=="Retirement")?retirementAssetsListData:lifeInsuranceCombinedData
          const checkChekbox=mappingList?.map((data)=>{
            return ({...data,checked:eventChekeked})
          })
        //   console.log("checkChekbox",checkChekbox)
          if(tableName=="Non-Retirement"){
            setNonRetirementAssetsListData(checkChekbox)
          }
          else if(tableName=="Retirement"){
            setRetirementAssetsListData(checkChekbox)
          }
          else{
            setLifeInsuranceCombinedData(checkChekbox)
          }
      }

  
      const onChangecheckTabelDataCheckedFun=(e,item,tableName)=>{
          const eventChecked=e?.target?.checked;
        //   console.log("onChangecheckTabelDataCheckedFuneventChecked",eventChecked)
        //   console.log("nonRetirementAssetsList",nonRetirementAssetsListData)
        //   console.log("checkTabelDataCheckeditemitem",item,"----------",tableName)
          let checkForInsurance=tableName==="Insurance Policies"
          let mappingList=(tableName=="Non-Retirement")?nonRetirementAssetsListData:(tableName=="Retirement")?retirementAssetsListData:lifeInsuranceCombinedData

          const checkChekbox=mappingList?.map((data)=>{
            // console.log("ddddddddddddddd",data)
            if((!checkForInsurance ) && (data?.userAgingAssetId==item?.userAgingAssetId)){
                // console.log("1daat1ddddddddddddddd",data)
                return ({...data,checked:eventChecked})
            } 
            if((checkForInsurance) && (data?.userLifeInsuranceId==item?.userLifeInsuranceId)){
                // console.log("2aat1ddddddddddddddd",data)
                return ({...data,checked:eventChecked})
            }
            // console.log("3aat1ddddddddddddddd",data)
            return data
          })

        //   console.log("checkChekbox",checkChekbox)
          if(tableName=="Non-Retirement"){
            setNonRetirementAssetsListData(checkChekbox)
          }
          else if(tableName=="Retirement"){
            setRetirementAssetsListData(checkChekbox)
          }
          else{
            setLifeInsuranceCombinedData(checkChekbox)
          }
      }
      const getBenCharityName=(tableData,tableName)=>{ 
        // console.log("dsdsdsdsd",tableData,tableName)
        return (((tableName=="Insurance Policies")?tableData:(tableData.map((data)=>{
            if(data?.isCharity==false){
               return (data?.beneficiaryUserName)?.split(" ")?.[0]
            }
            return data?.beneficiaryUserName
        }))?.toString()))
      }
     
    const handleViewFileInfo=async(value,tableName,tableData)=>{
        // console.log("handleViewFileInfotableData",tableData)
        if(value=="Edit"){
            setEditCloseModal(true)
        }
        fetchDataForPdf(tableData)
        setViewEditModal((prev)=>({
            ...prev,
            condition:value,
            tableName,
            beneficiaryData:tableData?.assetBeneficiarys,
            tableData,
       
        })) 
        
    }

    const fetchDataForPdf = async ( selectedItem ) => {
        // konsole.log("sdvbkjbjs", selectedItem);
        const addressOfCur = isNotValidNullUndefile(selectedItem?.isRealPropertys?.[0]?.addressId) ? await fetchAddress(selectedItem?.isRealPropertys?.[0]?.addressId) : undefined;
        const otherOj=[{isActive: true, othersMapNatureId: String(selectedItem?.userAgingAssetId ?? selectedItem?.userLifeInsuranceId), othersMapNature: '', userId: primaryUserId}]
        const getOtherRes = (selectedItem?.insuranceCompany == "Other" ||  selectedItem?.assetTypeName == "Other" )? await postApiCall("POST", $Service_Url.getOtherFromAPI, otherOj) : {};
        // konsole.log("ViewOtherData", getOtherRes?.data?.data?.length)
        // konsole.log("123ViewOtherData", getOtherRes)
        setItemAdditiDetails({addressLine1: addressOfCur, otherDescription: getOtherRes?.data?.data?.[0]?.othersName});
    }

    const itemList = useMemo(()=>{
        let item=viewEditModal?.tableData
        let itemAddress=viewEditModal?.tableData?.institutionAddress
        // console.log("viewEditModal",viewEditModal)
        // console.log("itemAddress",itemAddress)
        // console.log("23123itemAdditiDetails",itemAdditiDetails)
        return (viewEditModal?.tableName == 'Retirement' || viewEditModal?.tableName == 'Non-Retirement') ? 
        [{[viewEditModal?.tableName === 'Non-Retirement' ? 'Type of asset' : 'Type of Retirement Asset'] : itemAdditiDetails?.otherDescription || item?.assetTypeName},
        {'Name of institution':item?.nameOfInstitution || "N/A"},
        {'Balance': isNullUndefine(item?.balance) ? "N/A" :  $AHelper.$IncludeDollars(item?.balance)}, 
        {'Owner':(item?.assetOwners?.length == 2) ? "Joint" : (item?.assetOwners?.length == 1) ? item?.assetOwners?.[0]?.ownerUserName : "N/A"},
        {'Address': itemAddress || "N/A"}, 
        {"Phone number":$AHelper.newPhoneNumberFormat(item?.institutionPhoneNo) || "N/A"}, 
        {"Email address": item?.institutionEmail || "N/A"}, 
        {"Account Number": item?.accountNo || "N/A"}
        ]:
        [{'Insurance company': itemAdditiDetails?.otherDescription || item?.insuranceCompany},
        {'Policy No': item?.additionalDetails != '' ? item?.additionalDetails: "N/A"},
        {'Type of Policy': itemAdditiDetails?.otherDescription || item?.policyType || "N/A"},
        {'Policy Start': $AHelper.$isNullUndefine(item?.policyStartDate) ? "N/A" : $AHelper.$getFormattedDate(item?.policyStartDate)},
        {'Policy Expire': $AHelper.$isNullUndefine(item?.policyExpiryDate) ? "N/A" : $AHelper.$getFormattedDate(item?.policyExpiryDate)},
        {'Premium Frequency':item?.premiumType || "N/A"},
        {'Premium Amount':$AHelper.$isNullUndefine(item?.premium) ? "N/A" :  $AHelper.$IncludeDollars(item?.premium)},
        {'Death Benefits': isNullUndefine(item?.deathBenefits) ? "N/A" :  $AHelper.$IncludeDollars(item?.deathBenefits)},
        {'Beneficiary': item?.beneficiary?.[0]?.beneficiaryName || "N/A"},
        ]
     },[viewEditModal])
    
    // console.log("dssdddddddddddd", getOtherData(7810 ,"Other ","64770506-9a4b-4467-90ed-4b1c7088cc93 ",3))
    // console.log("fethcName",fethcName())
    // console.log("viewEditModal",viewEditModal)
    const TableComp=({tableName,tableData,tableHeadings})=>{
        // console.log("ewewetableName",tableName,"tableData",tableData)
        return(
            <>
            <h5 class="p3 generate-pdf-main-color mt-5" style={{padding:" 5px 15px 4px", fontSize:"16px"}}>{tableName}:</h5>
            <table className="shareDocuemntTable beneficiarryLetterStyle" style={{width: "98%",margin:"auto"}}>
                <tr className="firstRowTable table1 w-100 p-3" >
                   {tableHeadings?.map(({name},index)=>{
                    return(
                        <th name={`tableHeadingModal${index}`} 
                        className={`${tableName!=="Insurance Policies"?((name=="Last 4 digits" || name=="View/Edit")? "width6":(name=="Beneficiary/Charity")?"width17":"width11"):"width20"}`} 
                        style={{padding: "8px 7px 8px 14px"}}><div className={`d-flex align-items-center ${(index!==0)?"justify-content-center":""}`}>
                        {(index==0) && <input type="checkbox" className="searchChekbox addPadding" 
                            checked={checkeIfAllBoxesAreCheckedFun(tableData)} 
                            onChange={(e) => onChangeAllcheckboxesAtOnceFun(e,tableName)}
                         /> }
                            <span className={`${(index!==0) ?"text-center":"" }`}>{name}</span>
                        </div></th>
                    )
                   })}
                </tr>

                    {tableData?.length>0 && tableData.map((item,index)=>{

                        const { userAgingAssetId, assetTypeName, nameOfInstitution, balance, assetOwners, assetBeneficiarys,insuranceCompany, additionalDetails, policyType, policyStartDate, policyExpiryDate, premiumType, premium, deathBenefits, beneficiary, userLifeInsuranceId,userId,accountNo,institutionAddress,institutionEmail,institutionPhoneNo } = item;
                        const assetOwnersVal = removeDuplicate(assetOwners, 'ownerUserId');
                        const username=((item.userId==primaryUserId)?(userDetailOfPrimary.memberName):(userDetailOfPrimary.spouseName))?? "User"                       
                        // console.log("datttaitem",item)
                        // console.log("dssssssssssss",item.userAgingAssetId,item.assetTypeName,primaryUserId,3) 

                         return( 
                            <>
                                <tr className="tabelDataRow w-100 p-3 pt-0 pb-0">
                                       <td className={`${tableName!=="Insurance Policies"?"width11":"width20"}`}>
                                           <div className="d-flex align-items-center">
                                                   <input type="checkbox" 
                                                   className="searchChekbox" style={{marginRight:" 9px"}} 
                                                   checked={item?.checked} 
                                                   onChange={(e) => onChangecheckTabelDataCheckedFun(e,item,tableName)}
                                                   />
                                               <span className="sharedDrawerType"> {(assetTypeName || insuranceCompany) || "Other"}</span>
                                           </div>
                                       </td>
                                       <td className={`sharedDrawerType text-center ${tableName!=="Insurance Policies"?"width11":"width20"}`}>
                                        {tableName!=="Insurance Policies"?($AHelper.$isNullUndefine(nameOfInstitution))?<span className="reducedFontSize">{errorMessage}</span>:<span>{nameOfInstitution}</span>:($AHelper.$isNullUndefine(policyType))?<span className="">Other</span>:<span>{policyType}</span>}
                                       </td>
                                       {tableName!=="Insurance Policies" &&
                                        <>
                                            <td className={`sharedDrawerType text-center ${tableName!=="Insurance Policies"?"width11":"width20"}`}>{($AHelper.$isNullUndefine(institutionAddress))?<span className="reducedFontSize">{errorMessage}</span>:<span>{institutionAddress}</span>}</td>
                                            {/* <td className={`sharedDrawerType text-center ${tableName!=="Insurance Policies"?"width11":"width20"}`}>{($AHelper.$isNullUndefine(institutionEmail))?<span className="reducedFontSize">{errorMessage}</span>:<span>{institutionEmail}</span>}</td> */}
                                            <td className={`sharedDrawerType text-center ${tableName!=="Insurance Policies"?"width11":"width20"}`}>{($AHelper.$isNullUndefine(institutionPhoneNo))?<span className="reducedFontSize">{errorMessage}</span>:<span>{$AHelper.newPhoneNumberFormat(institutionPhoneNo)}</span>}</td>
                                        </>
                                       }
                                       {tableName!=="Insurance Policies" && <td className={`sharedDrawerType text-center ${tableName!=="Insurance Policies"?"width6":"width20"}`}>{($AHelper.$isNullUndefine(accountNo))?<span className="reducedFontSize">{errorMessage}</span>:<span>{accountNo}</span>}</td>}
                                        {tableName=="Insurance Policies" && <td className={`sharedDrawerType text-center ${tableName!=="Insurance Policies"?"width6":"width20"}`}>{($AHelper.$isNullUndefine(additionalDetails))?<span className="reducedFontSize">{errorMessage}</span>:<span>{additionalDetails}</span>}</td>}                                       
                                       {/* <td className={`sharedDrawerType text-center ${tableName!=="Insurance Policies"?"width11":"width20"}`}>{(tableName!=="Insurance Policies")?$AHelper.capitalizeFirstLetterFirstWord((assetOwnersVal?.length == 2) ? "Joint" : (assetOwnersVal?.length == 1) ? assetOwnersVal?.[0].ownerUserName : "-") : username}</td> */}
                                       <td className={`sharedDrawerType text-center ${tableName!=="Insurance Policies"?"width17":"width20"}`}>
                                         {((tableName!=="Insurance Policies")?getBenCharityName(assetBeneficiarys,"RetirementNonretirement"):getBenCharityName(beneficiary?.[0]?.beneficiaryName,"Insurance Policies")) || <span className="reducedFontSize">{errorMessage}</span>}
                                       </td>
                                       <td className={`sharedDrawerType text-center ${tableName!=="Insurance Policies"?"width6":"width20"}`}>
                                            <img src="/New/icons/file-eye-view.svg" alt="Edit Icon" className="iconHeightIncrease cursor-pointer border-0 m-3 mt-0 mb-0" onClick={() => handleViewFileInfo("View",tableName,item)}/>
                                            <img src="/New/icons/edit-Icon.svg" alt="Edit Icon" className="iconHeightIncrease cursor-pointer border-0 m-1 mr-0 mt-0 mb-0" onClick={() => handleViewFileInfo("Edit",tableName,item)}/>
                                       </td>    
                               </tr>
                            </>
                         )
                    })
                    }                    
                    {tableData?.length==0 && <p className="familyMemberNotFoundClass">No Data Found</p>}
            </table>
            </>
        )
    }

    // console.log("lifeInsuranceCombinedData",lifeInsuranceCombinedData)
    // console.log("benif12323retirementAssetsList",retirementAssetsListData,"nonRetirementAssetsListData",nonRetirementAssetsListData,"")
    // console.log("5555555555documentNameVersion",documentNameVersion)
    return(
        <div id='custom-modal-container' className='custom-modal-container' style={{ zIndex: "100000" }}>
        <Modal show={closeModal} id='custom-modal-container3' enforceFocus={false} className='useNewDesignSCSS searchModalWidth' aria-labelledby="contained-modal-title-vcenter" centered
        >
            <Modal.Header className={`newFileCabinteModalHeaderBackground justify-content-between`}> 
                    <span className='newFileCabinetFileModalheader'>Beneficiary Letter </span>
                    <button type="button" className=" filePrieviewClosebuttonStyle closeButt2" > <img src="/icons/filePrieviewClosebutton.svg" className='viewFileImage mt-0' onClick={closeModalFun}/></button>
            </Modal.Header>
            <Modal.Body style={{padding:" 5px 15px 5px",overflow: "auto",maxHeight: "70vh"}}>
                 <p class="Heading generate-pdf-main-color">Assets:</p>
                   {/* Non-Retirement */}
                    <TableComp
                        tableName="Non-Retirement"
                        tableData={nonRetirementAssetsListData}
                        tableHeadings={tableHeadingModal}

                    />
                    {/* Retirement */}
                    <TableComp
                        tableName="Retirement"
                        tableData={retirementAssetsListData}
                        tableHeadings={tableHeadingModal}

                    />  
                    {/* Insurance Policies */}
                    <TableComp
                        tableName="Insurance Policies"
                        tableData={lifeInsuranceCombinedData}
                        tableHeadings={tableHeadingModalLifeInsurance}

                    />
                    {viewEditModal?.condition=="View" && 
                        <UploadedFileView 
                            refrencePageName='Retirement'
                            isOpen={true} 
                            handleViewFileInfo={handleViewFileInfo}
                            itemList={itemList}
                            fileId={viewEditModal?.tableName == 'Insurance Policies' ? viewEditModal?.tableData?.insuranceDocs[0]?.docFileId : viewEditModal?.tableData?.assetDocuments?.[0]?.fileId}
                            fileDetails={{ name:viewEditModal?.tableName }} 
                            beneficiaryData ={viewEditModal?.beneficiaryData}
                        />                  
                    }
                    {viewEditModal?.condition=="Edit" &&
                            <EditBeneficiaryModal 
                            closeEditModal={closeEditModal}
                            setEditCloseModal={setEditCloseModal}
                            viewEditModal={viewEditModal}
                            primaryUserId ={primaryUserId }
                            fetchDataModalData={fetchDataModalData}
                        />  
                    }
            </Modal.Body>
            <Modal.Footer >
            <div className='footer-btn w-100 justify-content-end border-0' >
                {/* {((demo==false && paralegalAttoryId.includes(loggedInMemberRoleId) )) &&  */}
                <button className='send mx-3' onClick={()=>funToGenerateDoc()}>Generate</button>
                {/* } */}
                <button className='send' onClick={closeModalFun}>Close</button>
            </div>
            </Modal.Footer>
            
        </Modal>
        <AiModal showAiDoc={showAiDoc} setShowAiDoc={setShowAiDoc} aiDocuments={aiDocuments} setAiDocuments={setAiDocuments} stopLoader={stopLoader} showTime={showTime} setShowTime={setShowTime} documentNameVersion={documentNameVersion} pathName={"Legal_Screen"}/>

    </div>  
    )
}
export default memo(BeneficiaryLetterModal)