import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { $Service_Url } from "../../../components/network/UrlPath";
import { getApiCall,getApiCall2 } from "../../../components/Reusable/ReusableCom";
import konsole from "../../../components/control/Konsole";
import { healthSlice } from "./healthISlice";
import { $AHelper } from "../../Helper/$AHelper";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";




export const fetchRetirementNonRetirementData = createAsyncThunk(
    '/api/UserAgingAsset/get-UserAgingAsset-by-userid/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getUserAgingAsset + obj.userId, '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)
export const fetchXmlGenerater = createAsyncThunk(
    '/api/XMLGenerator/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall2('GET', $Service_Url.createXmlGenrater +"/"+ obj.userId, '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)
export const fetchBusinessIntrestsData = createAsyncThunk(
    'api/UserBusinessInterest/get-UserBusinessInterest/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getUserBusinessInterest + "/" + obj.userId, '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)
export const fetchLiabilitiesData = createAsyncThunk(
    '/api/UserLiability/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getLiabilityUserTypes + "V2" + obj.userId + "/0", '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const fetchAssetTypepreConditiontypeForRetirement = createAsyncThunk(
    '/api/AssetType/get-preconditiontype/a',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getPreconditionType + "2", '');

            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const fetchAssetTypepreConditiontypeNonRetirement = createAsyncThunk(
    '/api/AssetType/get-preconditiontype/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getPreconditionType + "1", '');

            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const fetchBusinesstype = createAsyncThunk(
    '/api/BusinessType/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getBusinessType);

            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)
export const fetchLiabilityType = createAsyncThunk(
    '/api/LiabilityType',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getLiabilityTypes);
            let data = response?.filter((ele) => ele?.value !== '6' && ele?.value !== '7')
            return data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const fetchOwnerType = createAsyncThunk(
    '/api/FileCabinet/FileBelongsTo',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getFileBelongsToPath + `?ClientUserId=${obj.userId}`, '');
            konsole.log("fetchOwnerType", response);
            const responseMap = response?.map(item => ({ value: item.fileBelongsTo, label: (item.fileBelongsTo === "JOINT") ? "Joint" : $AHelper.capitalizeFirstLetterFirstWord(item.belongsToMemberName) }));

            konsole.log('responseMap', responseMap);
            return responseMap;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const fetchBeneficiaryList = createAsyncThunk(
    '/api/Beneficiary/GetBeneficiaryListByUserId/',
    async (obj, thunkApi) => {
        try {
            let response = await getApiCall('GET', $Service_Url.getBeneficiaryByUserId + obj?.userId, '');
            konsole.log("fetchOwnerType", response);
            if (obj?.spouseUserId) {
                const spouseToPrimaryRelation = await getApiCall('GET', $Service_Url.postMemberRelationship + obj?.spouseUserId, '');
                konsole.log("fetchOwnerType-spouseToPrimaryRelation", spouseToPrimaryRelation);
                // debugger;
                if (spouseToPrimaryRelation?.userMemberId == obj?.userDetailOfPrimary?.memberId && spouseToPrimaryRelation?.isBeneficiary == true) {
                    response = [
                        ...(response ?? []),
                        {
                            value: obj?.userId,
                            label: obj?.userDetailOfPrimary?.memberName
                        }
                    ]
                }
            }
            konsole.log("fetchOwnerType-Final", response);

            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)



export const fetchLifeInsByUserIdData = createAsyncThunk(
    'getLifeInsByUserId',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getLifeInsByUserId + obj?.userId, '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const fetchPolicyTypeData = createAsyncThunk(
    'getPolicyType',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getInsPolicyType, '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const fetchInsProvider = createAsyncThunk(
    '/api/InsProvider',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getInsProvider, '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const fetchPreFrequencyData = createAsyncThunk(
    'getPreFrequency',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getPreFrequency, '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const fetchPropertytype = createAsyncThunk(
    '/api/AssetType/getPreconditionType/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getPreconditionType + "3", '');

            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const fetchPreconditionType = createAsyncThunk(
    '/api/AssetType/fetchPreconditionType/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getPreconditionType + "8", '');

            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const getUserLiabilityByUserRealPropertyId = createAsyncThunk(
    '/api/AssetType/getUserLiabilityByUserRealPropertyId/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getUserLiabilityByUserRealPropertyId + "/" + obj.userId + '/' + obj.userRealPropertyId, '');

            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const getUserAgingAsset = createAsyncThunk(
    '/api/UserAgingAsset/getUserAgingAsset/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getUserAgingAsset + obj.userId, '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)


export const getLiabilities = createAsyncThunk(
    '/api/getLiabilities/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getLiabilities + obj.lenderId, '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const fetchTaxInformationData = createAsyncThunk(
    'getTaxInformation',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getTaxInfo + obj?.userId + "/0");
            return response?.userTax ?? [];
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);

        }
    }
)


const initialState = {
    nonRetirementAssetsList: [],
    retirementAssetsList: [],
    retirementNonRetirementList: [],
    assetTypePreconditionTypeListForRetirement: [],
    assetTypePreconditionTypeListForNonRetirement: [],
    ownerTypeList: [],
    beneficiaryList: [],
    lifeInsuranceList: [],
    businessIntrests: [],
    businessTypeList: [],
    policyTypeList: [],
    insProviderList: [],
    preFrequencyList: [],
    expenseTypesList: [],
    userExpenseList: [],
    businessTypeList: [],
    userNonMonthlyExpenseList: [],
    putUserNonMonthlyExpenseList: [],
    paymentMethod: [],
    realEstateList: [],
    propertyTypeList: [],
    liabilitiesData: [],
    liabilityTypes: [],
    longTermTypeList: [],
    insuranceProviderList: [],
    premiumFreqList: [],
    longTermInsList: [],
    typeOfPolicyList: [],
    addedPrimaryMemLongTermInsuranceList: [],
    addedSpouseLongTermInsuranceList: [],
    preconditionTypeList: [],
    LiabilityByUserRealPropertyId: [],
    UserAgingAssetList: [],
    liabilityType: [],
    taxDataList: [],
    preconditiontypeList: [],
    xmlDataList:[],
    

}


export const financeSlice = createSlice({
    name: "finance",
    initialState,
    reducers: {
        updateNonRetirementAssestsList: (state, action) => {
            state.nonRetirementAssetsList = action.payload;
        },
        updateRetirementAssetsList: (state, action) => {
            state.retirementAssetsList = action.payload;
        },
        updateRetirementNonRetirementList: (state, action) => {
            state.retirementNonRetirementList = action.payload;
        },
        updateBusinessIntrestsList: (state, action) => {
            state.businessIntrests = action.payload;
        },
        updateLiabilitiesList: (state, action) => {
            state.liabilitiesData = action.payload;
        },
        updateExpenseTypesList: (state, action) => {
            state.expenseTypesList = action.payload;
        },
        updateUserExpenseList: (state, action) => {
            state.userExpenseList = action.payload;
        },
        updateUserNonMonthlyExpenseList: (state, action) => {
            state.userNonMonthlyExpenseList = action.payload;
        },
        putUserExpense: (state, action) => {
            state.putUserNonMonthlyExpenseList = action.payload;
        },
        updatePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
        },
        updateTypeOfPolicyList: (state, action) => {
            state.typeOfPolicyList = action.payload;
        },
        updatePrimaryMemLongTermInsuranceList: (state, action) => {
            console.log('updateUserNonMonthlyExpenseList', action)
            state.addedPrimaryMemLongTermInsuranceList = action.payload;
        },
        updateSpouseLongTermInsuranceList: (state, action) => {
            state.addedSpouseLongTermInsuranceList = action.payload;
        },
        updatetaxDataList: (state, action) => {
            state.taxDataList = state.taxDataList.map(item =>

                item?.userTaxId === action?.payload?.userTax?.[0]?.userTaxId ? action?.payload?.userTax?.[0] : item
            );
        },
        updateAndSaveTaxDataList: (state, action) => {
            state.taxDataList = [...state?.taxDataList, action?.payload?.userTax?.[0]]
        },
        updatePreconditiontypeList: (state, action) => {
            state.preconditiontypeList = action.payload;
        },
        updatebenefidficiaryList: (state, action) => {
            state.beneficiaryList = action.payload;
        },
        updatelifeInsuranceList: (state, action) => {
            state.lifeInsuranceList = action.payload;
        },
        updateOwnerTypeList: (state, action) => {
            state.ownerTypeList = action.payload;
        }

    },
    extraReducers: (builder) => {
        builder.addCase(fetchAssetTypepreConditiontypeForRetirement.fulfilled, (state, action) => {
            state.assetTypePreconditionTypeListForRetirement = action.payload;
        })
            .addCase(fetchAssetTypepreConditiontypeNonRetirement.fulfilled, (state, action) => {
                state.assetTypePreconditionTypeListForNonRetirement = action.payload;
            })
            .addCase(fetchOwnerType.fulfilled, (state, action) => {
                state.ownerTypeList = action.payload;
            })
            .addCase(fetchBeneficiaryList.fulfilled, (state, action) => {
                state.beneficiaryList = action.payload;
            })

            .addCase(fetchLifeInsByUserIdData.fulfilled, (state, action) => {
                state.lifeInsuranceList = action.payload;
            })
            .addCase(fetchBusinesstype.fulfilled, (state, action) => {
                state.businessTypeList = action.payload;
            })
            .addCase(fetchLiabilityType.fulfilled, (state, action) => {
                state.liabilityTypes = action.payload;
            })
            .addCase(fetchPolicyTypeData.fulfilled, (state, action) => {
                state.policyTypeList = action.payload;
            })
            .addCase(fetchInsProvider.fulfilled, (state, action) => {
                state.insProviderList = action.payload;
            })
            .addCase(fetchPreFrequencyData.fulfilled, (state, action) => {
                state.preFrequencyList = action.payload;
            })
            .addCase(fetchRetirementNonRetirementData.fulfilled, (state, action) => {
                state.realEstateList = action.payload;
            })
            .addCase(fetchXmlGenerater.fulfilled, (state, action) => {
                state.xmlDataList = action.payload;
            })
            .addCase(fetchPropertytype.fulfilled, (state, action) => {
                state.propertyTypeList = action.payload;
            })
            .addCase(fetchPreconditionType.fulfilled, (state, action) => {
                state.preconditionTypeList = action.payload;
            })
            .addCase(getUserLiabilityByUserRealPropertyId.fulfilled, (state, action) => {
                state.LiabilityByUserRealPropertyId = action.payload;
            })
            .addCase(getUserAgingAsset.fulfilled, (state, action) => {
                state.UserAgingAssetList = action.payload;
            })
            .addCase(getLiabilities.fulfilled, (state, action) => {
                state.liabilityType = action.payload;
            })
            .addCase(fetchTaxInformationData.fulfilled, (state, action) => {
                state.taxDataList = action.payload;
            })
            .addCase(fetchLiabilitiesData.fulfilled, (state, action) => {
                state.liabilitiesData = action.payload;
            })
    }
})

export const {updatePreconditiontypeList, updateNonRetirementAssestsList, updateRetirementAssetsList, updateRetirementNonRetirementList,
    updateBusinessIntrestsList, updateExpenseTypesList, updateUserExpenseList, updatePaymentMethod, updateUserNonMonthlyExpenseList, updatePrimaryMemLongTermInsuranceList,
    updateSpouseLongTermInsuranceList, updateTypeOfPolicyList, updateLiabilitiesList, updatetaxDataList, updateAndSaveTaxDataList, assetTypePreconditionTypeListForRetirement,
    assetTypePreconditionTypeListForNonRetirement ,updatebenefidficiaryList, updatelifeInsuranceList, updateOwnerTypeList } = financeSlice.actions;
export default financeSlice.reducer;
