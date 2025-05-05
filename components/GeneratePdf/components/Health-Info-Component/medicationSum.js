import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { getApiCall } from "../../../Reusable/ReusableCom";
import { $Service_Url } from "../../../network/UrlPath";
import OtherInfo from "../../../asssets/OtherInfo";
import { $AHelper } from "../../../control/AHelper";

const MedicationSum = ( props ) => {
    const [medications,setMedications] = useState([])
    const primaryUserId = sessionStorage.getItem("");

    useEffect(() => {
        let getMedicatiodata = $Service_Url.GetUserMedication+`${props.userId}`
        getApiCall('GET',getMedicatiodata,setMedications)
    }, [])
    return (
        <>
        <div className="py-3 mx-3">
        {medications?.userMedications?.length > 0 ? <Table bordered  className=" w-100 table-responsive financialInformationTable">
        <thead className='text-center align-middle' >
          <tr  >
          <th  >Medication</th>
          <th  >Dosage</th>
          <th  >Frequency</th>
          <th  >Timing</th>
          {/* <th  >Start Date</th> */}
          {/* <th  >End Date</th> */}
          <th  >Note</th>
          </tr>
          </thead>
          <tbody>
          {medications?.userMedications?.map((e,ind)=>(<>
          <tr  style={{wordBreak:"break-word", textAlign:'center'}}className="mb-5">
            <td style={{wordBreak:"break-word"}}>
               <OtherInfo
                 key={ind}
                  othersCategoryId={38} 
                   userId={props.userId}
                   othersMapNatureId={e.userMedicationId} 
                  FieldName={e.medicationName}
                  />
            </td>
            <td style={{wordBreak:"break-word", textAlign:"center"}}>{e.doseAmount || "-"}</td>
            <td style={{wordBreak:"break-word", textAlign:"center"}}>{e.frequency || "-"}</td>
            <td style={{wordBreak:"break-word", textAlign:"center"}}>{e.time || "-"}</td>
            {/* <td style={{wordBreak:"break-word"}}>{e.startDate != null && $AHelper.getFormattedDate(e.startDate)}</td> */}
            {/* <td style={{wordBreak:"break-word"}}>{e.endDate != null && $AHelper.getFormattedDate(e.endDate)}</td> */}
            <td style={{wordBreak:"break-word"}}>{e.doctorPrescription || "-"}</td>
            </tr>
            </>
          ))}
          </tbody>
        </Table> : <p> (Not provided) </p>}
        </div>
        </>
    )
}

export default MedicationSum;