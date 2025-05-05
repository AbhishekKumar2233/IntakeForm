import React, { useEffect, useState } from "react";
import konsole from "../../control/Konsole";
import { uscurencyFormate } from "../../control/Constant";
import { getApiCall} from '../../Reusable/ReusableCom'
import { $Service_Url } from "../../network/UrlPath";
import AnimatedNumber from "./AnimatedNumber";
import { $AHelper } from "../../control/AHelper";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { demo } from "../../control/Constant";

const Paralegaldata = ({ subtenantId, updateData ,handleClickApi,selectedCategoryIdParaList,setselectedCategoryIdParaList,enquiryMember,isStateId,isRender}) => {
    const [getUsernumbers, setGetusernumbers] = useState({
        "totalClient": 0,
        "totalInquiryMember": 0,
        "activetedClientsIntake": 0,
        "activetedClientsLPO": 0,
        "totalHandsOff": 0,
        "inActivetedClientsIntake": 0,
        "inActivetedClientsLPO": 0,
        "totalActiveClient": 0,
        "totalInActiveClient": 0,
        "totalAMA": 0
    })
    const [selectedOption, SetselectedOption] = useState({ 'Total_clients': 1, 'Intake': 1, 'LPO': 1 })
    const [selectedCategoryId, setselectedCategoryId] = useState('Total_clients');
    // console.log("selectedCategoryId",selectedCategoryId)

useEffect(() => {
        const fetchData = async () => {
          if (updateData === true) {
            try {
              const getuserdatas = await getApiCall('GET', `${$Service_Url.getparalegaluserdata}/${subtenantId}`, setGetusernumbers);
            //   console.log("getuserdatas", getuserdatas);
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          }
        };
        fetchData();
      }, [updateData, subtenantId]); 
      
      useEffect(()=>{
        if(isStateId != 999999){
            setselectedCategoryIdParaList("Total_clients");
            setselectedCategoryId("Total_clients")
        }
      },[isRender])

     useEffect(()=>{
        if(isStateId != 999999 && (selectedCategoryId == 'Total_clients' ||  selectedCategoryId == '')){setselectedCategoryIdParaList("Total_clients");setselectedCategoryId("Total_clients")}
     },[isStateId]) 

    const totalInfo = <p className="text-start"><b>Total Clients</b><br />
        <b>All-</b> The total number of Intake and LPO users registered in the portal<br />
        <b>Active -</b> The total number of user whose OTP verification and Login credentials are completed<br />
        <b>Inactive -</b> The total number of user whose OTP verification and Login credentials are pending </p>

    const intakeInfo = <p className="text-start"><b>Intake Clients:</b><br />
        <b>All-</b> The total number of active and inactive clients registered in the portal<br />
        <b>Active -</b> The total number of user whose OTP verification and Login credentials are completed<br />
        <b>Inactive -</b> The total number of user whose OTP verification and Login credentials are pending</p>

    const lpoInfo = <p className="text-start"><b>LPO Clients:</b><br />
        <b>All-</b> The total number of users converted to LPO account<br />
        <b>Active -</b> The total number of user whose OTP verification and Login credentials are completed<br />
        <b>Inactive -</b> The total number of user whose OTP verification and Login credentials are pending </p>

    const inquiryInfo = <p className="text-start"><b>Prospective Clients -</b> The total number of users registered through seminars but not proceeded further for initial consultation</p>

    const handoffInfo = <p className="text-start"><b>Handoffs -</b> The total number of Activated LPO accounts handed over to users</p>
    const amaInfo = <p className="text-start"><b>AMA Clients  -</b> The total number of users enrolled for AMA</p> 


    // let objOfHandOrAMA= (demo ==false)? {Title:'Total AMA',Number:getUsernumbers?.totalAMA,url:'icons/totalAMA.svg',Info:amaInfo}  :{Title:'Total Handoffs',Number:getUsernumbers?.totalHandsOff,url:'icons/TotalHandoffs.png',Info:handoffInfo};
    let objOfHandOrAMA = {Id:'Total AMA', Title: 'AMA Clients', Number: getUsernumbers?.totalAMA, url: 'icons/totalAMA.svg', Info: amaInfo }

    const dataItems = [
    {Id:'Total Prospect Members', Title: 'Prospective Clients', Number: getUsernumbers?.totalInquiryMember, url: 'icons/Totalinquirymembers.png', Info: inquiryInfo },
    { Id: 'Intake', Title: 'Intake Clients', Number: getUsernumbers?.activetedClientsIntake + getUsernumbers?.inActivetedClientsIntake, active: getUsernumbers?.activetedClientsIntake, Inactive: getUsernumbers?.inActivetedClientsIntake, url: 'icons/ActivatedclientsIntake.png', Info: intakeInfo },
    { Id: 'LPO', Title: 'LPO Clients', Number: getUsernumbers?.activetedClientsLPO + getUsernumbers?.inActivetedClientsLPO, active: getUsernumbers?.activetedClientsLPO, Inactive: getUsernumbers?.inActivetedClientsLPO, url: 'icons/ActivatedclientsLPO.png', Info: lpoInfo },
    { Id: 'Total_clients', Title: 'Total Clients', Number: getUsernumbers?.activetedClientsLPO + getUsernumbers?.inActivetedClientsLPO + getUsernumbers?.activetedClientsIntake + getUsernumbers?.inActivetedClientsIntake, active: getUsernumbers?.totalActiveClient, Inactive: getUsernumbers?.totalInActiveClient, url: 'icons/Totalclients.png', Info: totalInfo },objOfHandOrAMA];

    const handleSelect = (e, title) => {
        SetselectedOption({ ...selectedOption, [title]: e })
    }

    let jsonObjForApi={
        'Total_clients':'Total_clients',
        'Total Prospect Members':'Prospect',
        'Intake':{'roleId':'1,10'},
        'LPO':{'roleId':'9'},
        'Total AMA':{'isAMA':true}

    }
    const handleClick = (e) => {
        let Id=e?.Id
        let selectedCatId = Id == selectedCategoryId ? 'Total_clients' : Id;
        setselectedCategoryId(selectedCatId);
        setselectedCategoryIdParaList(selectedCatId)
        let jsonObj=jsonObjForApi[selectedCatId];        
        handleClickApi(jsonObj,isStateId,e);
    }
    return (
        <div className='d-flex align-items-center p-0 mb-3 mt-1' style={{ border: '1.5px solid #dfdfdf', borderRadius: '10px' }}>
            {dataItems?.map((e, index) => (<><div className={` cursor-pointer h-100 w-100 para-category ${e?.Id == selectedCategoryId ? 'selected-para-category' : ''}`} onClick={() => handleClick(e)} >
                <div style={{width: 'fit-content', margin: 'auto'}}>
                <div className="d-flex align-items-center justify-content-between" style={{gap: '10px'}}>
                    <div className="d-flex align-items-center">
                        <img className="m-0 cursor-pointer" title="Click to view" width='20px' height='auto' src={e?.url}/>
                        <div className="ms-2 me-2 cursor-pointer" title="Click to view" style={{ color: '#606060', width: 'fit-content'}}>{e?.Title}</div>
                        <OverlayTrigger placement='bottom' overlay={<Tooltip style={{ width: "150px !important" }}>{e?.Info}</Tooltip>}>
                            <img src='./icons/information.png' width='12px' height='auto' className="p-0 m-0" />
                        </OverlayTrigger>
                    </div>
                    {(e?.Id && e?.Id != 'Total AMA' && e?.Id != 'Total Prospect Members') && <select className="paralegaldata-select cursor-pointer" onClick={e => e.stopPropagation()} onChange={(ele) => handleSelect(ele.target.value, e?.Id)}>All <option value='1'>All</option><option value='2'>Active</option><option value='3'>Inactive</option></select>}
                </div>
                <p className={`d-flex align-items-center fs-2 cursor-pointer ${e?.Id == "Total Prospect Members" ? "mt-3" : ""}`} title="Click to view" style={{lineHeight: '2rem'}}><AnimatedNumber value={uscurencyFormate(e?.Id ? selectedOption[e?.Id] == 3 ? e?.Inactive : selectedOption[e?.Id] == 2 ? e.active : e.Number : e.Number)} /></p>
                </div>
            </div>
                {index < (dataItems?.length - 1) && (<div className='vr h-50 align-self-center'></div>)}
            </>))}
        </div>
    )

}

export default Paralegaldata;
