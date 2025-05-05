import React, { useEffect, useState } from "react";
import HealthMain from "./Health/HealthMain";
import { demo } from "../../components/control/Constant";


const HealthLayout = ({userId,setActiveModule}) => {
    const healthguidanceArray = [{id:1,name:'Illness'},{id:2,name:'Mental Health'},{id:3,name:'End of Life'},{id:4,name:'Death'}];
    const subHeading = [{id:1,name:"Immediate Actions"},{id:2,name:"Care Funding"},{id:3,name:"Alerts"},{id:4,name:"Additional Information"}]
    const [selectedItem,setSelectedItem] = useState();
    const [selectPage,setSelectPage] = useState();

    useEffect(()=>{
        setSelectedItem(1);
        setSelectPage(1);
    },[userId])


    return(
        <div className="d-flex w-100 gap-2">
            <div className="dropdown-guidance">
                {healthguidanceArray.map((item,index)=>{
                    return(
                        <div className={`${selectedItem == item.id ? 'dropdown py-2' : 'py-2'}`}  onClick={()=>{setSelectedItem(item.id)}}>
                        <div className="d-flex gap-2 align-items-center mb-2 fs-14 w-100">
                        <img src={`/new/icons/agentfolder.svg`} />
                        <p key={item.id} className="para fw-bold">{item.name}</p>
                        <img className="d-flex justify-content-end" width="10px" src="/New/image/select-icon.png" />
                        </div>
                        {subHeading.filter((ele)=>{return item.id != 1 ? ele.id != 2 : ele }).map((e)=>(
                            <div className={selectedItem == item.id && selectPage == e.id ? "heading-active ps-1 p-1" : "ps-1 p-1"} onClick={()=>setSelectPage(e.id)}>
                            <li className="text-start fs-12" style={selectedItem == item.id && selectPage == e.id ? {color:'#720D21'} : {color:'#222222'}}><span className="">{e.id == 3 && healthguidanceArray[index]?.name} {e.id == 1 && item.id == 1 ? 'Care preferences' : e.name}</span></li>
                            </div>
                        ))}
                        {healthguidanceArray?.length - 1 > index && <hr />}
                        </div>
                    )
                })}
            </div>
            <div className="w-100">
                <HealthMain section={selectedItem} step={selectPage} userId={userId} setSection={setSelectedItem} setStep={setSelectPage} setActiveModule={setActiveModule} healthguidanceArray={healthguidanceArray} />
            </div>
        </div>
    )
}
export default HealthLayout;