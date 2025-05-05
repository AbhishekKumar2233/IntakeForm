import React, { useEffect, useState, useCallback } from 'react'
import { Modal, Button, Form, Row, Col, Table, Card, Container } from "react-bootstrap";
import konsole from '../../control/Konsole';
import { isNotValidNullUndefile } from '../../Reusable/ReusableCom';

const userAssestesFilterKey = ['Life Insurance']

const UserAssetsLifeIns = ({ jsonObj, assetRetireNonRetileRealEstateTypeList }) => {
    const primaryMemberName = jsonObj?.userName;
    const spouseName = jsonObj?.spouse?.personName;

    const { retireAssetTypeList, nonRetireAssetTypeList, realEstateTypeList, insProviderList } = assetRetireNonRetileRealEstateTypeList;

    const _lifeInsuranceList = jsonObj?.userAssets?.filter(item => item?.uaType == userAssestesFilterKey[0]) || [];
    const _userAssetsList = jsonObj?.userAssets?.filter(item => item?.uaType != userAssestesFilterKey[0]) || [];
    const filterByAssetType = (list, assetTypeList) => list.filter(item => assetTypeList.some(i => i.label == item.uaType));
    const _nonRetireAssetTypeList = filterByAssetType(_userAssetsList,nonRetireAssetTypeList );
    const _retireAssetTypeList = filterByAssetType(_userAssetsList, retireAssetTypeList);
    const _realEstateTypeList = filterByAssetType(_userAssetsList, realEstateTypeList);

    // konsole--------------------------------------
    konsole.log("jsonObjjsonObjjsonObj", jsonObj);
    konsole.log("_lifeInsuranceList", _lifeInsuranceList, _userAssetsList)
    // konsole--------------------------------------
    return <>
        <Row>
            {_lifeInsuranceList.length > 0 && <>
                <p className='fw-bold'>Life Insurance</p>
                <div className='m-1'>
                    <Table bordered className='table-responsive' >
                        <thead>
                            <tr>
                                <th>Insurance Company</th>
                                <th>Policy No</th>
                                <th>Owner</th>
                            </tr>
                        </thead>
                        <tbody className="my-4">
                            {_lifeInsuranceList.map((item, index) => {
                                return <>
                                    <tr key={index} >
                                        <td style={{ wordBreak: "break-word" }}>{item?.uaName}</td>
                                        <td>{item?.uaAccountNumber} </td>
                                        <td> {item?.uaOwner}</td>
                                    </tr>
                                </>
                            })}
                        </tbody>
                    </Table>
                </div>
            </>}
        </Row>

        {_nonRetireAssetTypeList.length > 0 && <>
            <hr />
            <RetirementNonRetirementAssets
                heading='Non-Retirement Financial Assets'
                label1={'Description of Non-Retirement Asset'}
                primaryMemberName={primaryMemberName}
                spouseName={spouseName}
                list={_nonRetireAssetTypeList}
            />
        </>}


        {_retireAssetTypeList.length > 0 && <>
            <hr />
            <RetirementNonRetirementAssets
                heading='Retirement Financial Assets'
                label1={'Description of Retirement Assets'}
                primaryMemberName={primaryMemberName}
                spouseName={spouseName}
                list={_retireAssetTypeList}
            />
        </>}

        {_realEstateTypeList.length > 0 && <>
            <hr />
            <RetirementNonRetirementAssets
                heading='Real Estate'
                label1={'Description of Property'}
                primaryMemberName={primaryMemberName}
                spouseName={spouseName}
                list={_realEstateTypeList}
            />
        </>}



    </>
}


const RetirementNonRetirementAssets = ({ heading, label1, list, primaryMemberName, spouseName }) => {
    return <>

        <Row>
            <p className='fw-bold'>{heading}</p>
            <div className='m-1'>
                <Table bordered className='table-responsive' >
                    <thead>
                        <tr>
                            <th>{label1}</th>
                            {heading != 'Real Estate' && <th>Name of Institution</th>}
                            <th>Owner</th>
                        </tr>
                    </thead>
                    <tbody className="my-4">
                        {(list.map((item, index) => {
                            const ownerTypeName = (item?.uaOwner != primaryMemberName && item?.uaOwner != spouseName) ? 'Joint': item.uaOwner;
                            return <>
                                <tr key={index}>
                                    <td>{item?.uaType}</td>
                                    {heading != 'Real Estate' && <td>{isNotValidNullUndefile(item?.uaName) ? item?.uaName : '-'}</td>}
                                    <td>{ownerTypeName}</td>
                                </tr>
                            </>
                        }))}

                    </tbody>
                </Table>
            </div>

        </Row>
    </>
}

export default UserAssetsLifeIns
