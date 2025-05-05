import { uscurencyFormate } from "../../../../../control/Constant";
import konsole from "../../../../../control/Konsole";
import OtherInfo from "../../../../../asssets/OtherInfo";
import { $AHelper } from "../../../../../control/AHelper";
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb, } from "react-bootstrap";
import { useEffect, useState } from "react";
import useUserIdHook from "../../../../../Reusable/useUserIdHook";


const HealthInsurencePlanClientComponent = (props) => {
  const {_primaryMemberUserId,_spouseUserId}=useUserIdHook();
  const[healthInsurence,setHealthInsurence]=useState([])
  useEffect(()=>{
    const healthInsurence=props?.healthInsurence;
    setHealthInsurence(healthInsurence)
  },[])
 
  
  return (
    <>
        <div className="py-3 mx-3">
        <Table bordered  className=" w-100 table-responsive financialInformationTable">
        <thead className='text-center align-middle' >
         <tr>
           <th>Type of Plan</th>
           <th>Supplement Insurance </th> 
           <th>Insurance Company</th>
           <th>Insurance Name</th>
           <th>Premium Frequency</th>
           <th>Premium Amount</th> 
           <th>Policy No.</th> 
          </tr>
          </thead>
          <tbody>
            {healthInsurence?.length > 0 && healthInsurence?.map((item,index)=>
              <tr  style={{wordBreak:"break-word", textAlign:'center'}} className="mb-5">
                <td style={{wordBreak:"break-word"}}><OtherInfo othersCategoryId={31} othersMapNatureId={item?.userInsuranceId} FieldName={item?.typePlan || "-"} userId={props.userNo == 2 ? _spouseUserId : _primaryMemberUserId} /></td>
                <td style={{wordBreak:"break-word"}}><OtherInfo othersCategoryId={30} othersMapNatureId={item?.userInsuranceId} FieldName={item?.suppPlan || "-"} userId={props.userNo == 2 ? _spouseUserId : _primaryMemberUserId} /></td>
                <td style={{wordBreak:"break-word"}}><OtherInfo othersCategoryId={35} othersMapNatureId={item?.userInsuranceId} FieldName={(item?.insComName || "-")} userId={props.userNo == 2 ? _spouseUserId : _primaryMemberUserId} /></td>
                <td style={{wordBreak:"break-word"}}>{item?.insName}</td>
                <td style={{wordBreak:"break-word"}}>{item?.premiumFrePerYear}</td>
                <td style={{wordBreak:"break-word"}}>{item?.premiumAmt !== null ? $AHelper.IncludeDollars(item.premiumAmt) : ""}</td>
                <td style={{wordBreak:"break-word"}}>{item?.insCardPath1}</td>
              </tr>)
            }
          </tbody>
        </Table>
        </div>
        </>
  );
};

export default HealthInsurencePlanClientComponent;
