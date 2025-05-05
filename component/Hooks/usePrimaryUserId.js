import { useEffect ,useState,useMemo} from "react";
import { useAppSelector } from "./useRedux";
import { selectPersonal } from "../Redux/Store/selectors";
import konsole from "../../components/control/Konsole";
import { $AHelper } from "../Helper/$AHelper";

const usePrimaryUserId = () => {
    const personalReducer = useAppSelector(selectPersonal);
    const { primaryDetails, spouseDetails, loggedInMemberDetail,primaryMemberContactDetails, sSPrimaryUserId, sSSpouseUserId, sSLoggedInUserId } = personalReducer;
    konsole.log("loggedInMemberDetailinuser", primaryDetails, spouseDetails, loggedInMemberDetail)
    const [loggedInMemberRoleId,setLoggedInMemberRoleId]=useState('')
    const [roleUserId, setroleUserId] = useState('')
    const [userDetailOfPrimary, setuserDetailOfPrimary] = useState('')
    const [userLoggedInDetail, setuserLoggedInDetail] = useState('')
    const [subtenantId, setsubtenantId] = useState('')

    let primaryUserId = sSPrimaryUserId || primaryDetails?.userId;
    let _spousePartner=primaryDetails?.maritalStatusId==2 ?'partner':'spouse'
    let spouseUserId = sSSpouseUserId || spouseDetails?.userId;
    let isVeteran = primaryDetails?.isVeteran


    let primaryMemberFullName = ''
    // primaryMemberFullName = primaryDetails?.fName ? $AHelper.$capitalizeFirstLetter(primaryDetails?.fName + " " + (primaryDetails?.mName ? primaryDetails?.mName + " " : '') + primaryDetails?.lName) : '';
    primaryMemberFullName = primaryDetails?.fName ? `${$AHelper?.capitalizeFirstLetterFirstWord(primaryDetails?.fName)} ${primaryDetails?.mName ? $AHelper?.capitalizeFirstLetterFirstWord(primaryDetails?.mName) + ' ' : ''}${$AHelper.$capitalizeFirstLetter(primaryDetails?.lName)}` : '';
    //////////  primaryMemberFirstName

    let primaryMemberFirstName = ''
    primaryMemberFirstName = primaryDetails?.fName ? $AHelper?.capitalizeFirstLetterFirstWord(primaryDetails?.fName) : '';
    // @@ spouse and prmary in label value 
    let labelValueSpousePrimary = [{ value: primaryUserId, label: primaryMemberFullName }]
    // @@ spouse and prmary in label value
    let spouseFullName = '';
    let spouseFirstName = '';
    let loggedInMemberName = '';
    let isPrimaryMemberMaritalStatus =($AHelper.$isMarried(primaryDetails?.maritalStatusId) && $AHelper.$isNotNullUndefine(spouseUserId))  ? true : false;

    let maritalStatusId = primaryDetails?.maritalStatusId ?? null;

    let loggedInUserId = sSLoggedInUserId || loggedInMemberDetail?.userId;
    if (spouseDetails) {
        spouseFullName = $AHelper?.capitalizeFirstLetterFirstWord(spouseDetails?.fName + " " +(spouseDetails.mName ? spouseDetails.mName + " " : '') +spouseDetails?.lName)
        spouseFirstName = spouseDetails?.fName ? $AHelper?.capitalizeFirstLetterFirstWord(spouseDetails?.fName) : ""
    }
    if (loggedInMemberDetail) {
        loggedInMemberName = loggedInMemberDetail?.fName + " " + loggedInMemberDetail?.lName
    }
    // @@ if client married 
    if ($AHelper.$isMarried(primaryDetails?.maritalStatusId) && $AHelper.$isNotNullUndefine(spouseUserId)) {
        labelValueSpousePrimary.push({ value: spouseUserId, label: spouseFullName })
    }
    
    useEffect(()=>{
        let stateObj=JSON.parse(sessionStorage.getItem('stateObj'));
        let roleUserId = sessionStorage.getItem('roleUserId');
        let userDetailOfPrimary = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'));
        let userLoggedInDetail = JSON.parse(sessionStorage.getItem('userLoggedInDetail'));
        let subtenantId = sessionStorage.getItem('SubtenantId');
        setLoggedInMemberRoleId(stateObj?.roleId);
        setroleUserId(roleUserId);
        setuserDetailOfPrimary(userDetailOfPrimary);
        setuserLoggedInDetail(userLoggedInDetail);
        setsubtenantId(subtenantId);
    },[])
    const displaySpouseContent = useMemo(() => {
        let value = ((isPrimaryMemberMaritalStatus == true) || ($AHelper.$isNotNullUndefine(spouseUserId)) && primaryDetails?.maritalStatusId == 4) ? true : false;
        return value;
    }, [isPrimaryMemberMaritalStatus, spouseUserId, primaryDetails])



    // @@ if client married 
    // let subtenantId = primaryDetails?.subtenantId ? primaryDetails?.subtenantId : loggedInMemberDetail?.subtenantId
    return {
        _spousePartner,
        displaySpouseContent,
        primaryMemberContactDetails,
        primaryDetails,
        spouseDetails,
        loggedInMemberDetail,
        primaryUserId,
        spouseUserId,
        isPrimaryMemberMaritalStatus,
        maritalStatusId,
        primaryMemberFullName,
        primaryMemberFirstName,
        spouseFirstName,
        spouseFullName,
        subtenantId,
        loggedInUserId,
        labelValueSpousePrimary,
        loggedInMemberName,
        loggedInMemberRoleId,
        roleUserId,
        userDetailOfPrimary,
        userLoggedInDetail,
        isVeteran
    };
};

export default usePrimaryUserId;
