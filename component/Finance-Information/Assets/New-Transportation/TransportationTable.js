import React, { useMemo, useState } from "react";
import { CustomInputSearch } from "../../../Custom/CustomComponent";
import OtherInfo from "../../../../components/asssets/OtherInfo";
import { CustomButton } from "../../../Custom/CustomButton";
import { Row, Table } from "react-bootstrap";
import { $AHelper } from "../../../Helper/$AHelper";
import usePrimaryUserId from "../../../Hooks/usePrimaryUserId";
import konsole from "../../../../components/control/Konsole";
import TableEditDeleteDecease from "../../../Common/DeceasedSpecialNeed/TableEditDeleteDecease";

const TransportationTable = ({ transportationData, updateTransportation, deleteTransportation, addTransportation, handleActiveTab }) => {

    const { primaryUserId } = usePrimaryUserId();

    const [searchValue, setSearchValue] = useState(null);
    const tableHeader = [{ id: 1, name: 'Type' }, { id: 2, name: 'Model' }, { id: 3, name: 'Owner' }, { id: 4, name: 'Value' }, { id: 5, name: 'VIN No.' },{ id: 6, name: 'View/Edit/Delete' }];

    const transportationList = useMemo(() => {
        let searchQuery = searchValue;
        let data = transportationData;

        if ($AHelper.$isNotNullUndefine(searchQuery)) {
            const searchString = searchQuery.toLowerCase();
            return data.filter(item => {
                return (
                    (item?.assetTypeName && item?.assetTypeName?.toLowerCase().includes(searchString))
                );
            });
        } else {
            return data;
        }
    }, [searchValue, transportationData]);

    console.log(transportationData, "transportationList", transportationList)


    const handleNextBtn=()=>{
        handleActiveTab(14)
    }

    return (
        <>
            <div className="col-12">
            <div style={{borderBottom: '1px solid #F0F0F0'}}></div>
                    <Row className='mt-2'>
                        <span className='heading-of-sub-side-links' style={{fontSize: '16px', color:"#939393", fontWeight:"400"}}>(Auto, Boat, Plane, Other, Etc.) </span>
                    </Row>
                <div id="information-table" className="information-table">
                    <div className="col-12 table-search-section sticky-header-1 d-flex justify-content-between align-items-center">
                        <div className="children-header col-5">
                            <span>Transport Assets</span>
                            <span className="badge ms-1">{transportationData?.length} Added</span>
                        </div>
                        <div style={{ marginBottom: "43px" }} className='col-3'>
                            <CustomInputSearch
                                isEroor=''
                                label=''
                                id='search'
                                placeholder='Search'
                                onChange={(val) => setSearchValue(val)}

                            />

                        </div>
                        <div className='d-flex flex-row-reverse col-3'>
                            <CustomButton label="Add Transport Assets" onClick={() => addTransportation()} />
                        </div>
                    </div>
                    <div className='table-responsive fmlyTableScroll'>
                        <Table className="custom-table">
                            <thead className="sticky-header">
                                <tr>
                                    {tableHeader.map((item, index) => (
                                        <th className={`py-3 fw-bold" ${item.name == 'View/Edit/Delete' ? 'text-end' : ''}`} key={index}>{item.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            {transportationList?.length > 0 ? (
                                <tbody>
                                    {transportationList.map((item, index) => {
                                        const { assetTypeName, vinno, licensePlate, balance, modelNumber, assetOwners, userAgingAssetId } = item;
                                        konsole.log(item, "asasssaas")

                                        return (
                                            <tr key={index}>
                                                <td><OtherInfo othersCategoryId={3} othersMapNatureId={userAgingAssetId} FieldName={assetTypeName} userId={primaryUserId} /></td>
                                                <td>{modelNumber || "-"}</td>
                                                <td>{(assetOwners.length == 2) ? "Joint" : (assetOwners.length == 1) ? $AHelper.capitalizeFirstLetterFirstWord(assetOwners[0].ownerUserName) : "-"}</td>
                                                <td>{balance ? $AHelper.IncludeDollars(balance) : "-"}</td>
                                                <td>{vinno || "-"}</td>
                                                {/* <td>{licensePlate || "-"}</td> */}
                                                <td>
                                                    <TableEditDeleteDecease
                                                        key={index}
                                                        item={item}
                                                        type='primary'
                                                        actionType='Owner'
                                                        handleUpdate={updateTransportation}
                                                        handleDelete={deleteTransportation}
                                                        refrencePage="Transportation"
                                                        userId={primaryUserId}
                                                        memberUserId={assetOwners.length > 0 ? assetOwners[0].ownerUserId : ''}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan={tableHeader.length}>
                                            <div className="text-center no-data-found">No Data Found</div>
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </Table>
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                <CustomButton label="Proceed to Life Insurance" onClick={() => handleNextBtn()} />
                </div>
            </div>

        </>
    )
}
export default TransportationTable;