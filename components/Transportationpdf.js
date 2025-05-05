import React, { useEffect, useState } from "react";
import { $Service_Url } from "./network/UrlPath";
import { getApiCall } from "./Reusable/ReusableCom";
import { Table } from "react-bootstrap";
import OtherInfo from "./asssets/OtherInfo";
import konsole from "./control/Konsole";
import { uscurencyFormate } from "./control/Constant";
import { $AHelper } from "./control/AHelper";

const Transportationpdf = (props) => {

const [ownerTypesList, setOwnerTypeList] = useState([])
const [transportationList, setTransportationList] = useState([])


useEffect(() => {
    const primaryUserId = sessionStorage.getItem('SessPrimaryUserId')
    // fetchApiCall();
    fetchAutoMobilesInfo(primaryUserId)
}, [])
const fetchAutoMobilesInfo = async (userId) => {
    // dispatchloader(true)
    const result = await getApiCall("GET", $Service_Url.getUserAgingAsset + userId)
    konsole.log('resultresult', result)
    // dispatchloader(false)
    if (result != 'err') {
        const responseData = result?.filter((item) => item.agingAssetCatId == 8)
        setTransportationList(responseData)
    }
}

return (
        <>
        <p className="p3 generate-pdf-main-color mt-4 mb-2">Transportation :</p>

        {transportationList?.length > 0 && <>
                            <Table bordered>
                                <thead className='text-center align-middle'>
                                    <tr>
                                        <th>Type of Transportation</th>
                                        <th>Model</th>
                                        <th>Owner</th>
                                        <th>Value</th>
                                        <th>VIN No.</th>
                                        <th>License Plate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transportationList?.map((item, index) => {
                                        const assetOwners = item.assetOwners
                                        const isRealProperty = item.isRealPropertys
                                        return (
                                            <tr key={index}>
                                                <td style={{ wordBreak: "break-word", textAlign: "center" }}>
                                                    <OtherInfo othersCategoryId={3} othersMapNatureId={item.userAgingAssetId} FieldName={item.assetTypeName || "-"} userId={props.memberId} />
                                                </td>
                                                <td className='text-center'>{item?.nameOfInstitution || "-"}</td>
                                                <td className='text-center'>{(assetOwners.length == 2) ? "Joint" : (assetOwners.length == 1) ? $AHelper.capitalizeAllLetters(assetOwners[0].ownerUserName) : "-"}</td>
                                                <td className='text-center'>{item?.balance !== null ? $AHelper.IncludeDollars(item.balance) : "-"}</td>  
                                                <td className='text-center'>{item?.vinno || "-"}</td>
                                                <td className='text-center'>{item?.licensePlate || "-"}</td>

                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </>}
        </>
    )

}
export default Transportationpdf;