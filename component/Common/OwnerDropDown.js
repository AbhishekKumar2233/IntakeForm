import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { CustomSelect } from '../Custom/CustomComponent';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import { useAppDispatch, useAppSelector } from '../Hooks/useRedux';
import { useLoader } from '../utils/utils';
import { fetchBeneficiaryList, fetchOwnerType } from '../Redux/Reducers/financeSlice';
import konsole from '../../components/control/Konsole';
import { selectorFinance } from '../Redux/Store/selectors';
import { $AHelper } from '../Helper/$AHelper';

export const OwnerDropDown = (props) => {
    const { assetOwners, isInfoAdd, handleSelectOwner, isError, savedAssetOwners, handleSetErr } = props;
    const { primaryUserId } = usePrimaryUserId();
    const dispatch = useAppDispatch();
    const { ownerTypeList } = useAppSelector(selectorFinance);

    const startingTabIndex = props?.startTabIndex ?? 0;  


    // Fetch owner types on component mount
    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(primaryUserId)) {
            fetchApi();
        }
    }, [dispatch]);

    const fetchApi = async () => {
        useLoader(true);
        if (ownerTypeList?.length === 0) {
            await dispatch(fetchOwnerType({ userId: primaryUserId }));
        }
        useLoader(false);
    };

    const handleChangeOwnerJson = (val) => {
        konsole.log("Selected value", val);
        let assetOwnersJson = [];

        // Adding new owners
        if (isInfoAdd) {
            if (val == 'JOINT') {
                assetOwnersJson = ownerTypeList?.filter((item) => item.value !== 'JOINT')?.map((j) => ({ ownerUserId: j.value, OwnerUserName: "OwnerUserName", isActive: true, }));
            } else {
                assetOwnersJson = [{ ownerUserId: val, OwnerUserName: "OwnerUserName", isActive: true, }];
            }
        } else {

            // @@ updaye owners
            let assetOwnersValue = ownerTypeList?.filter((item) => item.value !== 'JOINT')?.map((j) => ({ ownerUserId: j.value, OwnerUserName: "OwnerUserName", isActive: true, }));
            const updateOwnerData = [...savedAssetOwners];

            if (val == 'JOINT') {
                assetOwnersJson = assetOwnersValue.map((owner) => {
                    const matchingOwner = updateOwnerData.find((data) => data.ownerUserId.toLowerCase() === owner.ownerUserId.toLowerCase());
                    if (matchingOwner) {
                        return {
                            ...owner, agingAssetOwnerId: matchingOwner.agingAssetOwnerId, OwnerUserName: matchingOwner.ownerUserName,
                        };
                    }
                    return owner;
                });
            } else {
                if (updateOwnerData.length === 1 && updateOwnerData[0].ownerUserId.toLowerCase() === val.toLowerCase()) {
                    assetOwnersJson = updateOwnerData;
                } else {
                    assetOwnersJson = assetOwnersValue.map((owner, index) => {
                        return {
                            ...owner, isActive: owner.ownerUserId.toLowerCase() === val.toLowerCase() ? true : false,
                            agingAssetOwnerId: (owner.ownerUserId.toLowerCase() === val.toLowerCase()) ? updateOwnerData.length !== 1 ? updateOwnerData[1].agingAssetOwnerId : owner.agingAssetOwnerId : updateOwnerData[0].agingAssetOwnerId,
                        };
                    });
                }
            }
        }
        handleSelectOwner(assetOwnersJson);

        if (isError) {
            handleSetErr('assetOwnersDetailsJson');
        }
    };


    const selectedValue = useMemo(() => {
        let filterIsActive = $AHelper.$isNotNullUndefine(assetOwners) ? assetOwners?.filter((item) => item?.isActive == true) : []
        if (filterIsActive.length === 1) {
            return filterIsActive[0].ownerUserId;
        }
        if (filterIsActive.length > 1) {
            return 'JOINT';
        }
        return '';
    }, [assetOwners]);

    // Logging for debugging
    konsole.log("ownerTypeList", ownerTypeList);
    konsole.log("assetOwnersDetails", assetOwners);
    konsole.log("selectedValue", selectedValue);

    return (
        <Row className='' id={props?.id || 'ownerTypeSelect'} >
            <Col xs={12}>
                <CustomSelect
                    tabIndex={startingTabIndex + 1}
                    isError={isError}
                    name='Owner'
                    id='ownerTypeId'
                    label='Owner*'
                    placeholder='Select'
                    options={ownerTypeList}
                    value={$AHelper?.$isUpperCase(selectedValue)}
                    onChange={(e) => handleChangeOwnerJson(e.value)}
                />
            </Col>
        </Row>
    );
};



// Beneficiary Drop Down
export const BeneficiaryDropDown = (props) => {
    const { assetBeneficiarys, isInfoAdd, handleSelectBeneficiary, savedAssetBeneficiarys,filteredBenefList , filterOutCurrentUser} = props;
    // const { assetBeneficiarys, isInfoAdd, handleSelectBeneficiary, savedAssetBeneficiarys } = props;


    const { primaryUserId , spouseUserId, isPrimaryMemberMaritalStatus} = usePrimaryUserId();
    const dispatch = useAppDispatch();
    const { beneficiaryList } = useAppSelector(selectorFinance);
    const userDetailOfPrimary = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'));
    const startingTabIndex = props?.startTabIndex ?? 0;  

    konsole.log("beneficiaryListRedux", beneficiaryList);

    // Fetch owner types on component mount
    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(primaryUserId)) {
            fetchApi();
        }
    }, [dispatch, primaryUserId]);


    const fetchApi = async () => {
        useLoader(true);
        if (beneficiaryList.length == 0) {
            // konsole.log("jhghgjh", userDetailOfPrimary)
            await dispatch(fetchBeneficiaryList({ userId: primaryUserId, spouseUserId: isPrimaryMemberMaritalStatus ? spouseUserId : undefined, userDetailOfPrimary: userDetailOfPrimary}));
        }
        useLoader(false);
    };



    // @@ handle chnage beneficiaryjosn
    const handleChangeBeneficiaryJson = (val) => {

        let beneficiaryJson = [...savedAssetBeneficiarys]
        if (isInfoAdd || savedAssetBeneficiarys?.length == 0) {
            beneficiaryJson = [{ beneficiaryUserId: val?.value, 'beneficiaryUserName': val?.label }]
        } else {
            beneficiaryJson = [{ ...savedAssetBeneficiarys[0], 'beneficiaryUserId': val?.value,'beneficiaryUserName': val?.label }]
        }
        konsole.log("beneficiaryJson", beneficiaryJson)

        handleSelectBeneficiary(beneficiaryJson);
    }

    const selectedValue = useMemo(() => {
            if (assetBeneficiarys && assetBeneficiarys.length > 0) {
            return assetBeneficiarys[0].beneficiaryUserId;
        }
        return '';
    }, [assetBeneficiarys]);

    konsole.log(selectedValue,"assetBeneficiarys", assetBeneficiarys)

    // const filteredOptions = useMemo(() => (filteredBenefList?.length > 0 ? filteredBenefList : beneficiaryList)?.filter(ele => ele?.value != props?.currentUserId), [filteredBenefList, beneficiaryList])
    // const filteredOptions = useMemo(() => beneficiaryList?.filter(ele => ele?.value != props?.currentUserId), [beneficiaryList])

    const filteredOptions = useMemo(() => {
        const allOptions = (filteredBenefList?.length > 0 || filteredBenefList == null) ? filteredBenefList : beneficiaryList;
        if(filterOutCurrentUser == true) return allOptions?.filter(ele => ele?.value != props?.currentUserId);
        return allOptions;
    }, [filteredBenefList, beneficiaryList])

    return <>
        <Row className='spacingBottom' >
            <Col xs={12} md={6} lg={typeof window !== 'undefined' && document.querySelector('.heading-of-sub-side-links') ? 5 : 6}>
                <CustomSelect
                    tabIndex={startingTabIndex + 1}
                    isError=''
                    name='Beneficiary'
                    id='Beneficiary'
                    label='Beneficiary'
                    placeholder='Select'
                    value={selectedValue}
                    options={filteredOptions}
                    onChange={(e) => handleChangeBeneficiaryJson(e)}
                />
            </Col>
        </Row>
    </>
}

