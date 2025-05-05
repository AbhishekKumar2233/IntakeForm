import React, { useMemo, useState, useEffect, useCallback } from "react";
import { CustomInputSearch } from "../../../Custom/CustomComponent";
import { CustomButton } from "../../../Custom/CustomButton";
import { Row, Table } from "react-bootstrap";
import { $AHelper } from "../../../Helper/$AHelper";
import { getApiCall, isNotValidNullUndefile } from "../../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../../components/network/UrlPath";
import OtherInfo from "../../../../components/asssets/OtherInfo";
import TableEditDeleteDecease from "../../../Common/DeceasedSpecialNeed/TableEditDeleteDecease";
import CustomTooltip from "../../../Custom/CustomTooltip";
import konsole from "../../../../components/control/Konsole";

const RealEstateTable = ({ realEstateData, updateRealEstate, addRealEstate, deleteRealEstate, primaryUserId, handleActiveTab }) => {
    const [searchValue, setSearchValue] = useState('');
    const [addresses, setAddresses] = useState({});

    const tableHeader = [
        { id: 1, name: 'Description of Property' },
        { id: 2, name: 'Address' },
        { id: 3, name: 'Purchase Date' },
        // { id: 4, name: 'Purchase Price' },
        { id: 4, name: `Current value` },
        { id: 5, name: 'Owner' },
        // { id: 7, name: 'Debt against the property' },
        { id: 6, name: 'View/Edit/Delete' }
    ];

    const fetchAddressByUserId = useCallback(async (addressId) => {
        try {
            let response = await getApiCall('GET', `${$Service_Url.getAddressByaddressID}/${addressId}`);
            if (response !== 'err') {
                return response?.addressLine1;
            } else {
                console.error(`Error fetching address for ID ${addressId}:`, response);
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        }
        return null;
    }, []);

    useEffect(() => {
        const fetchAddresses = async () => {
            const addressMap = {};
            if (realEstateData.length > 0) {
                for (let item of realEstateData) {
                    if (item.isRealPropertys && item.isRealPropertys.length > 0) {
                        const addressId = item.isRealPropertys[0].addressId;
                        if (addressId && !addressMap[addressId]) {
                            const address = await fetchAddressByUserId(addressId);
                            if (address) {
                                addressMap[addressId] = address;
                            }
                        }
                    }
                }
                setAddresses(addressMap);
                console.log("Fetched addresses:", addressMap); // Debugging log
            }
        };

        fetchAddresses();
    }, [realEstateData, fetchAddressByUserId]);

    const filteredSearchData = useMemo(() => {
        if ($AHelper.$isNotNullUndefine(searchValue)) {
            const searchString = searchValue.toLowerCase();
            return realEstateData.length > 0 && realEstateData.filter(item => item?.assetTypeName?.toLowerCase().includes(searchString));
        }
        return realEstateData;
    }, [searchValue, realEstateData]);


    const handleNextBtn = (type)=>{
        if (type == 'Next') {
           handleActiveTab(15)
          }
    }

    // konsole.log(handleActiveTab,"handleActiveTab")

    return (
        <div className="col-12">
         <div style={{borderBottom: '1px solid #F0F0F0'}}></div>
                    <Row className='mt-2'>
                        <span className='heading-of-sub-side-links-2 mt-2 mb-3'>(Primary Home, Rental Property, Land, Guns, Etc.) </span>
                    </Row>
            <div id="information-table" className="information-table">
                <div className="col-12 table-search-section sticky-header-1 d-flex justify-content-between align-items-center">
                    <div className="children-header col-5">
                        <span>Real Estate</span>
                        <span className="badge ms-1">{filteredSearchData?.length} Added</span>
                    </div>
                    <div style={{ marginBottom: "43px" }} className='col-3'>
                        <CustomInputSearch
                            isError=''
                            label=''
                            id='search'
                            placeholder='Search'
                            onChange={setSearchValue}
                        />
                    </div>
                    <div className='d-flex flex-row-reverse col-3'>
                        <CustomButton label="Add Real Estate" onClick={() => addRealEstate()} />
                    </div>
                </div>
                <div className='table-responsive fmlyTableScroll'>
                    <Table className="custom-table">
                        <thead className="sticky-header">
                            <tr>
                                {tableHeader.map((item, index) => (
                                    <th className={`py-3 fw-bold ${item.name == 'View/Edit/Delete' ? 'text-center' : ''}`}  key={index}>{item.name}</th>
                                ))}
                            </tr>
                        </thead>
                        {filteredSearchData.length > 0 ? (
                            <tbody>
                                {filteredSearchData.map((item, index) => {
                                    const { assetTypeName, isRealPropertys, assetOwners } = item;
                                    const addressId = isRealPropertys?.[0]?.addressId;
                                    const address = addresses[addressId];
                                    console.log(item, "Address for item:", addressId, address);

                                    return (
                                        <tr key={index}>
                                            <td><OtherInfo othersCategoryId={3} othersMapNatureId={item.userAgingAssetId} FieldName={assetTypeName} userId={primaryUserId} /></td>
                                            {/* <td>{address !== undefined ? address : '-'}</td> */}
                                            <td> <CustomTooltip refrencePage='RealEstateTable' maxLength={24}  content={address}/></td>
                                            <td>{$AHelper.$getFormattedDate(isRealPropertys?.[0]?.purchaseDate) == 'Invalid date' ? '-' : $AHelper.$getFormattedDate(isRealPropertys?.[0]?.purchaseDate)}</td>
                                            {/* <td>{$AHelper.$isNullUndefine(isRealPropertys?.[0]?.purchasePrice) ? "-" : $AHelper.$IncludeDollars(isRealPropertys?.[0]?.purchasePrice)}</td> */}
                                            <td>{$AHelper.$isNullUndefine(isRealPropertys?.[0]?.value) ? "-" : $AHelper.$IncludeDollars(isRealPropertys?.[0]?.value)}</td>
                                            <td>{assetOwners.length > 1 ? 'JOINT' : assetOwners[0]?.ownerUserName}</td>
                                            {/* <td>{isRealPropertys?.[0]?.isDebtAgainstProperty ? 'Yes' : 'No'}</td> */}
                                            <td>
                                                <TableEditDeleteDecease
                                                    key={index}
                                                    item={item}
                                                    type='primary'
                                                    actionType='Owner'
                                                    handleUpdate={updateRealEstate}
                                                    handleDelete={deleteRealEstate}
                                                    refrencePage="Real Estate"
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
            <CustomButton  label="Proceed to Business Interests" onClick={() => handleNextBtn('Next')} />
            </div>
        </div>
    );
};

export default RealEstateTable;
