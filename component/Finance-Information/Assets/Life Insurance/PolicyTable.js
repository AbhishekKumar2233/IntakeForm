import React, { useMemo, useState } from "react";
import { CustomInputSearch } from "../../../Custom/CustomComponent";
import { CustomButton } from "../../../Custom/CustomButton";
import { Table } from "react-bootstrap";
import { $AHelper } from "../../../Helper/$AHelper";
import OtherInfo from "../../../../components/asssets/OtherInfo";
import TableEditDeleteDecease from "../../../Common/DeceasedSpecialNeed/TableEditDeleteDecease";
import usePrimaryUserId from "../../../Hooks/usePrimaryUserId";
import { selectorFinance } from "../../../Redux/Store/selectors";
import { useAppSelector } from "../../../Hooks/useRedux";


const PolicyTable = ({ lifeInsuranceList, updateInsurance, addInsurance, deleteInsurance, userId, handleActiveTab,activeBtn, setActiveBtn }) => {
    const [searchValue, setSearchValue] = useState(null);
    const { spouseUserId, spouseFullName, isPrimaryMemberMaritalStatus, spouseFirstName, primaryUserId} = usePrimaryUserId();
    const { beneficiaryList } = useAppSelector(selectorFinance);
    const tableHeader = [{ id: 1, name: 'Insurance company' }, { id: 2, name: 'Policy No' }, { id: 3, name: 'Type of Policy' }, { id: 4, name: 'Premium Frequency' }, { id: 5, name: 'Premium Amount' },{ id: 6, name: 'View/Edit/Delete' }];

    const filteredSearchData = useMemo(() => {
        let searchQuery = searchValue;
        let data = lifeInsuranceList;

        if ($AHelper.$isNotNullUndefine(searchQuery)) {
            const searchString = searchQuery.toLowerCase();
            return data.filter(item => {
                return (
                    (item?.insuranceCompany && item?.insuranceCompany?.toLowerCase().includes(searchString))
                );
            });
        } else {
            return data;
        }
    }, [searchValue, lifeInsuranceList]);

    console.log(lifeInsuranceList, "lifeInsuranceList", filteredSearchData)


     const handleNextBtn = ()=>{
        if (activeBtn == 1 && isPrimaryMemberMaritalStatus) {
            setActiveBtn(2)
            $AHelper.$scroll2Top();
        }else{
          handleActiveTab(16)
        }
      
}

    return (
        <div className="col-12">
            <div id="information-table" className="information-table">
                <div className="col-12 table-search-section sticky-header-1 d-flex justify-content-between align-items-center">
                    <div className="children-header col-5">
                        <span>Life Insurance</span>
                        <span className="badge ms-1">{lifeInsuranceList?.length} Added</span>
                    </div>
                    <div style={{ marginBottom: "43px" }} className='col-3'>
                        <CustomInputSearch
                            isEroor=''
                            label=''
                            id='search'
                            placeholder='Search'
                            // value={searchValue}
                            onChange={(val) => setSearchValue(val)}

                        />

                    </div>
                    <div className='d-flex flex-row-reverse col-3'>
                        <CustomButton label="Add Policy" onClick={() => addInsurance()} />
                    </div>
                </div>
                <div className='table-responsive fmlyTableScroll'>
                    <Table className="custom-table">
                        <thead className="sticky-header">
                            <tr>
                                {tableHeader.map((item, index) => (
                                    <th  className={`py-3 fw-bold ${item.name == 'Edit/Delete' ? 'text-end' : ''}`} key={index}>{item.name}</th>
                                ))}
                            </tr>
                        </thead>
                        {filteredSearchData?.length > 0 ? (
                            <tbody>
                                {filteredSearchData.map((item, index) => {
                                    const { insuranceCompany, additionalDetails, policyType, policyStartDate, policyExpiryDate, premiumType, premium, deathBenefits, beneficiary, userLifeInsuranceId } = item;
                                    const beneficiaryName = (activeBtn == 2 && beneficiary[0]?.beneficiaryUserId == spouseUserId) ? beneficiaryList.find(det => det.value == primaryUserId)?.label || "-" :  beneficiary[0]?.beneficiaryName || "-"
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <OtherInfo othersCategoryId={12} othersMapNatureId={userLifeInsuranceId} FieldName={insuranceCompany} userId={userId} />
                                            </td>
                                            <td>{additionalDetails != '' ? additionalDetails : '-'}</td>
                                            <td><OtherInfo othersCategoryId={23} othersMapNatureId={userLifeInsuranceId} FieldName={policyType || '-'} userId={userId} /></td>
                                            {/* <td style={{whiteSpace:"nowrap"}}>{$AHelper.$getFormattedDate(policyStartDate) == 'Invalid date' ? '-' : $AHelper.$getFormattedDate(policyStartDate)}</td>
                                            <td style={{whiteSpace:"nowrap"}}>{$AHelper.$getFormattedDate(policyExpiryDate) == 'Invalid date' ? '-' : $AHelper.$getFormattedDate(policyExpiryDate)}</td> */}
                                            <td>{premiumType != null ? premiumType : '-'}</td>
                                            <td>{premium != '' ? $AHelper.$IncludeDollars(premium) : '-'}</td>
                                            {/* <td>{(deathBenefits != '' && deathBenefits != null && deathBenefits != "0.00" && deathBenefits != "0") ? $AHelper.$IncludeDollars(deathBenefits) : '-'}</td> */}
                                            {/* <td>{beneficiaryName}</td> */}
                                            <td className=" custom-SpacoingButton">
                                                <TableEditDeleteDecease
                                                    item={item}
                                                    type='primary'
                                                    actionType='Beneficiary'
                                                    refrencePage="LifeInsuraneForm"
                                                    handleUpdate={updateInsurance}
                                                    handleDelete={deleteInsurance}
                                                    userId={userId}
                                                    memberUserId={item?.beneficiary?.length > 0 ? item?.beneficiary[0].beneficiaryUserId : ''}
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
            <CustomButton label={isPrimaryMemberMaritalStatus && userId != spouseUserId ? `Proceed to ${spouseFirstName} Information` : "Proceed to Long-Term Care Policy"} onClick={() => handleNextBtn('next')} />
            </div>
        </div>
    )
}

export default PolicyTable;