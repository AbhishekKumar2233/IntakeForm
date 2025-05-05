import React, { useMemo, useState, useEffect, useCallback } from "react";
import { CustomInputSearch } from "../../../Custom/CustomComponent";
import { CustomButton } from "../../../Custom/CustomButton";
import { Table } from "react-bootstrap";
import { $AHelper } from "../../../Helper/$AHelper";
import { getApiCall, isNotValidNullUndefile } from "../../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../../components/network/UrlPath";
import OtherInfo from "../../../../components/asssets/OtherInfo";

const LenderTable = ({ lenderList,editLender,addLender,deleteLender }) => {

    const tableHeader = [
        { id: 1, name: 'Name of Lender' },
        { id: 2, name: 'Monthly Amount($)' },
        { id: 3, name: 'Interest Rate(%)' },
        { id: 4, name: 'Outstanding Balance' },
        { id: 5, name: `Debt Against the Property` },
        { id: 6, name: 'Edit/Delete' },
    ];


    return (
        <div className="col-12">
            <div id="information-table" className="m-2 ms-0 information-table">
                <div className="col-12 table-search-section sticky-header-1 p-4 d-flex justify-content-between align-items-center">
                    <div className="children-header col-5">
                        <span>Lender's Information</span>
                    </div>
                    <div className='d-flex flex-row-reverse col-3'>
                        {/* <CustomButton label="Add Lender" onClick={()=>addLender()} /> */}
                    </div>
                </div>
                <div className='table-responsive fmlyTableScroll'>
                    <Table className="custom-table">
                        <thead className="sticky-header">
                            <tr>
                                {tableHeader.map((item, index) => (
                                    <th className="py-3 fw-bold" key={index}>{item.name}</th>
                                ))}
                            </tr>
                        </thead>
                        {lenderList?.length > 0 ? (
                            <tbody>
                                {lenderList?.map((item, index) => {
                                    const { nameofInstitutionOrLender, paymentAmount, interestRatePercent, outstandingBalance,liabilityName } = item;
                                    console.log(item,"itemitemitemitem")
                                    return (
                                        <tr key={index}>
                                            <td className="fw-bold">{nameofInstitutionOrLender}</td> 
                                            <td>{paymentAmount != null ? $AHelper.$IncludeDollars(paymentAmount) : '-'}</td>
                                            <td>{interestRatePercent != null ? interestRatePercent + "%" : '-'}</td>
                                            <td>{outstandingBalance != null ? $AHelper.$IncludeDollars(outstandingBalance) : '-'}</td>
                                            <td>{liabilityName}</td>
                                            <td>
                                                <div className="d-flex justify-content-around">
                                                    <img src="/New/icons/edit-Icon.svg" alt="Edit Icon" className="icon cursor-pointer" onClick={() => editLender(item)} />
                                                    <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer" onClick={() => deleteLender(item)} />
                                                </div>
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
        </div>
    );
};

export default LenderTable;
