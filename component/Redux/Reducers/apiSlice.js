import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { $Service_Url } from "../../../components/network/UrlPath";
import { getApiCall, postApiCall } from "../../../components/Reusable/ReusableCom";
import konsole from "../../../components/control/Konsole";
import { $AHelper } from "../../Helper/$AHelper";

// Utility function to fetch data conditionally
const fetchDataConditionally = async (endpoint, dataList, thunkApi) => {
    const response = await getApiCall('GET', endpoint, '');
    return response;
};

export const fetchGenderType = createAsyncThunk(
    'api/fetchGenderType',
    async (_, thunkApi) => {
        const { api } = thunkApi.getState();
        const genderList = api.genderList;
        return await fetchDataConditionally($Service_Url.getGenderListPath, genderList, thunkApi);
    }
);
export const fetchProductPlans = createAsyncThunk(
    '/api/UserServicePlan/Get-User-Service-Plan-Values',
    async (_, thunkApi) => {
        const { api } = thunkApi.getState();
        const plansList = api.productPlans;
        return await fetchDataConditionally($Service_Url.fetchUserServicePlan,plansList, thunkApi);
    }
);
export const fetchNoteCatagory = createAsyncThunk(
    'api/UserNotes/GetPageCategory',
    async (_, thunkApi) => {
        const { api } = thunkApi.getState();
        const categoryList = api.pageCatagoryData;
        return await fetchDataConditionally($Service_Url.getPageCategory, categoryList, thunkApi);
    }
);
export const fetchComMediumType = createAsyncThunk(
    'api/CommChannel/GetCommChannel',
    async (_, thunkApi) => {
        const { api } = thunkApi.getState();
        const comeMedium = api.commMedium;
        return await fetchDataConditionally($Service_Url.getCommMedium, comeMedium, thunkApi);
    }
);

export const fetchCitizenshipType = createAsyncThunk(
    'api/fetchCitizenshipType',
    async (_, thunkApi) => {
        const { api } = thunkApi.getState(); // Memoize selector call
        const citizenshipList = api.citizenshipList;
        return await fetchDataConditionally($Service_Url.getCitizenshipType, citizenshipList, thunkApi);
    }
);

export const fetchSuffixType = createAsyncThunk(
    'api/fetchSuffixType',
    async (_, thunkApi) => {
        const { api } = thunkApi.getState(); // Memoize selector call
        const suffixPrefixList = api.suffixPrefixList;
        return await fetchDataConditionally($Service_Url.getNameSuffixPath, suffixPrefixList, thunkApi);
    }
);

export const fetchDischargeType = createAsyncThunk(
    'api/VDischargeType',
    async (_, thunkApi) => {
        const { api } = thunkApi.getState();
        const dischargeType = thunkApi.getState().api.dischargeTypeList;
        return await fetchDataConditionally($Service_Url.getDischargeType, dischargeType, thunkApi);
    }
);
export const fetchAddressType = createAsyncThunk(
    'api/AddressType',
    async (_, thunkApi) => {
        const { api } = thunkApi.getState();
        const addressType = thunkApi.getState().api.addressType;
        return await fetchDataConditionally($Service_Url.getAddressTypePath, addressType, thunkApi);
    }
);
export const fetchContactType = createAsyncThunk(
    '/api/ContactType',
    async (_, thunkApi) => {
        const contactType = thunkApi.getState().api.contactType;
        return await fetchDataConditionally($Service_Url.getContactTypePath, contactType, thunkApi);
    }
);
export const fetchComType = createAsyncThunk(
    '/api/CommType',
    async (_, thunkApi) => {
        const { api } = thunkApi.getState();
        const comTypes = thunkApi.getState().api.comType;
        return await fetchDataConditionally($Service_Url.getNumberType, comTypes, thunkApi);
    }
);
export const fetchCountyRef = createAsyncThunk(
    'api/CountyRef/GetCountyRef',
    async (_, thunkApi) => {
        const { api } = thunkApi.getState();
        const countyRefrence = thunkApi.getState().api.countyRef;
        return await fetchDataConditionally($Service_Url.getCountyRef, countyRefrence, thunkApi);
    }
);


// @war time period
export const fetchWarTimePeriodType = createAsyncThunk(
    'api/WarTimePeriod',
    async (_, thunkApi) => {
        const { api } = thunkApi.getState();
        const warTimePeriodPath = thunkApi.getState().api.warTimePeriodList;
        return await fetchDataConditionally($Service_Url.getWarTimePeriodPath, warTimePeriodPath, thunkApi);
    }
);
// @marital status Get
export const fetchMaritalStatusType = createAsyncThunk(
    'api/MaritalStatuses',
    async (_, thunkApi) => {
        const { api } = thunkApi.getState();
        const maritalStatusPath = thunkApi.getState().api.maritalStatusList;
        return await fetchDataConditionally($Service_Url.getMaritalStatusPath, maritalStatusPath, thunkApi);
    }
);




export const fetchCountryCode = createAsyncThunk(
    '/api/Country/GetRegistrationEnableCountry',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getCountryCode);
            konsole.log("response", response)
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

// @@ primary details get;
export const fetchPrimaryDetails = createAsyncThunk(
    'api/fetchPrimaryDetails',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + obj.userId);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);
export const fetchFamilyMembers = createAsyncThunk(
    'api/Member/get-FamilyMembers-by-userid',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getFamilyMembers + obj.userId);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

// @@ Vetern Data  get
export const fetchVeteranData = createAsyncThunk(
    'api/fetchVeternData',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getVeteranData + obj.userId);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

// vetern data save
export const saveVeteranData = createAsyncThunk(
    'api/savedVeternData',
    async (obj, thunkApi) => {
        try {
            let method = $AHelper.$isNotNullUndefine(obj.veteranId) ? 'PUT' : 'POST';
            let url = method == 'POST' ? $Service_Url.postVeteranByUserid : $Service_Url.updateVeteranData;
            const _resultSaveVetrenData = await postApiCall(method, url, obj);
            return _resultSaveVetrenData?.data?.data;

            return ''
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);


export const fetchPrimaryUserAddressData = createAsyncThunk(
    'api/Address/get-address-by-userid-primary',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getAllAddress + obj, '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);
export const fetchSpouseUserAddressData = createAsyncThunk(
    'api/Address/get-address-by-userid-spouse',
    async (userId, thunkApi) => {
        const { api } = thunkApi.getState();
        const addressPath = thunkApi.getState().api.spouseUserAddress;
        return await fetchDataConditionally($Service_Url.getAllAddress + userId, addressPath, thunkApi);
    }
);
export const fetchUserContactData = createAsyncThunk(
    'api/Contact/get-contact-by-userid',
    async (userId, thunkApi) => {
        const { api } = thunkApi.getState();
        const contactPath = thunkApi.getState().api.userContact;
        return await fetchDataConditionally($Service_Url.getAllContactOtherPath + userId, contactPath, thunkApi);

    }
);

//vetern data Delete 
export const deleteVeteranData = createAsyncThunk(
    'api/deleteVeternData',
    async (obj, thunkApi) => {
        try {
            const _resultDeleteVetrn = await postApiCall('DELETE', $Service_Url.deleteVeteranByUserId, obj);
            return _resultDeleteVetrn
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);
//Occcupation saved data fetch 
export const fetchOccupationData = createAsyncThunk(
    'api/fetchOccupation',
    async (obj, thunkApi) => {
        try {
            const _resultDeleteVetrn = await getApiCall('GET', $Service_Url.getOccupationbyUserId + obj.userId);
            return _resultDeleteVetrn

        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

// SAVE OCC DATA;
export const saveOccuptionData = createAsyncThunk(
    'api/saveOccdata',
    async (obj, thunkApi) => {
        try {
            let method = $AHelper.$isNotNullUndefine(obj.userOccId) ? 'PUT' : 'POST';
            let url = method == 'POST' ? $Service_Url.postAddOccupation : $Service_Url.putOccupationbyUserId;
            const _resultSaveOccData = await postApiCall(method, url, obj);
            return _resultSaveOccData?.data?.data;

            return ''
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);


// SAVE OCC DATA;
export const deleteOccDetails = createAsyncThunk(
    'api/delete occ data',
    async (obj, thunkApi) => {
        try {
            const _deletOccDetails= await postApiCall('DELETE', $Service_Url.deleteOccupationbyUserId, obj);
            return _deletOccDetails;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

// @fetch Relation type

export const fetchRelationType = createAsyncThunk(
    'api/relationShipType',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getRelationshiplist);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

// member status list deceased etc
export const fetchStatusType = createAsyncThunk(
    'api/Status List',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getMemberStatus);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);


export const fetchFeedbackPriority = createAsyncThunk(
    'api/feedbackPriority',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.GetFeedbackPriority);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data);
        }
    }
);
export const fetchUniversalAddress = createAsyncThunk(
    '/api/Address/get-CountryDetails?countryName=',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getUniversalAddress + obj);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data);
        }
    }
);





const initialState = {
    genderList: [],
    suffixPrefixList: [],
    citizenshipList: [],
    dischargeTypeList: [],
    warTimePeriodList: [],
    maritalStatusList: [],
    contactType: [],
    primaryUserAddress: [],
    spouseUserAddress: [],
    userContact: [],
    addressType: [],
    countyRef: [],
    relationTypeList: [],
    childrenRelationList: [],
    extendedFriendRelationList: [],
    memberStatusTypeList: [],
    countryCode: [],
    veternSavedData: {},
    comType: [],
    feedbackPriority: [],
    occcupationSavedData: {},
    commMedium: [],
    inLawRelationList: [],
    pageCatagoryData:[],
    familyMembersList:[],
    universaladdressFormate:[],
    productPlans:[]
};

const apiSlice = createSlice({
    name: 'api',
    initialState,
    reducers: {
        updateCountryCodeList: (state, action) => {
            state.countryCode = action.payload
        },
        updateOccupationList: (state, action) => {
            state.occcupationSavedData = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGenderType.fulfilled, (state, action) => {
                state.genderList = action.payload;
            })
            .addCase(fetchProductPlans.fulfilled, (state, action) => {
                state.productPlans = action.payload;
            })
            .addCase(fetchNoteCatagory.fulfilled, (state, action) => {
                state.pageCatagoryData = action.payload;
            })
            .addCase(fetchFamilyMembers.fulfilled, (state, action) => {
                state.familyMembersList = action.payload;
            })
            .addCase(fetchComMediumType.fulfilled, (state, action) => {
                state.commMedium = action.payload;
            })
            .addCase(fetchCitizenshipType.fulfilled, (state, action) => {
                state.citizenshipList = action.payload;
            })
            .addCase(fetchSuffixType.fulfilled, (state, action) => {
                state.suffixPrefixList = action.payload;
            })
            .addCase(fetchRelationType.fulfilled, (state, action) => {
                state.relationTypeList = action.payload;
                state.childrenRelationList = action?.payload?.filter((data) => data?.value == "5" || data?.value == "6" || data?.value == "2" || data?.value == "28" || data?.value == "29" || data?.value == "41");
                state.inLawRelationList = action?.payload?.filter((data) => data?.value == "47" || data?.value == "48" || data?.value == "49" || data?.value == "50");
                const excludedValues = [1, 2, 4, 5, 6, 12, 28, 29, 41, 44, 45, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56];
                state.extendedFriendRelationList = action?.payload?.filter((data) => !excludedValues.includes(Number(data.value)));


            })
            .addCase(fetchDischargeType.fulfilled, (state, action) => {
                state.dischargeTypeList = action.payload;
            })
            .addCase(fetchWarTimePeriodType.fulfilled, (state, action) => {
                state.warTimePeriodList = action.payload;
            })
            .addCase(fetchMaritalStatusType.fulfilled, (state, action) => {
                state.maritalStatusList = action.payload;
            })
            .addCase(fetchFeedbackPriority.fulfilled, (state, action) => {
                state.feedbackPriority = action.payload;
            })
            .addCase(fetchVeteranData.fulfilled, (state, action) => {

                let key = action?.meta?.arg?.userId
                if (action.payload != 'err') {
                    state.veternSavedData[`${key}`] = action.payload;
                } else {
                    state.veternSavedData[key] = '';
                }
            })
            .addCase(saveVeteranData.fulfilled, (state, action) => {
                let key = action?.meta?.arg?.userId
                if ($AHelper.$isNotNullUndefine(action.payload)) {
                    state.veternSavedData[`${key}`] = action.payload;
                }
            })
            .addCase(deleteVeteranData.fulfilled, (state, action) => {
                let key = action?.meta?.arg?.userId
                state.veternSavedData[key] = '';
            })
            .addCase(fetchOccupationData.fulfilled, (state, action) => {
                const key = action?.meta?.arg?.userId;
                if (action.payload != 'err') {
                    state.occcupationSavedData[`${key}`] = action.payload[0];
                } else {
                    state.occcupationSavedData[key] = '';
                }
            })

            .addCase(fetchContactType.fulfilled, (state, action) => {
                state.contactType = action.payload;
            })
            .addCase(fetchAddressType.fulfilled, (state, action) => {
                state.addressType = action.payload;
            })
            .addCase(fetchPrimaryUserAddressData.fulfilled, (state, action) => {
                state.primaryUserAddress = action.payload;
            })
            .addCase(fetchSpouseUserAddressData.fulfilled, (state, action) => {
                state.spouseUserAddress = action.payload;
            })
            .addCase(fetchUserContactData.fulfilled, (state, action) => {
                state.userContact = action.payload;
            })
            .addCase(fetchCountyRef.fulfilled, (state, action) => {
                state.countyRef = action.payload;
            })
            .addCase(saveOccuptionData.fulfilled, (state, action) => {
                let key = action?.meta?.arg?.userId
                if ($AHelper.$isNotNullUndefine(action.payload)) {
                    state.occcupationSavedData[`${key}`] = action.payload;  
                }
            })
            .addCase(fetchStatusType.fulfilled, (state, action) => {
                if ($AHelper.$isNotNullUndefine(action.payload)) {
                    state.memberStatusTypeList = action.payload;
                }
            })
            .addCase(fetchCountryCode.fulfilled, (state, action) => {
                if ($AHelper.$isNotNullUndefine(action.payload)) {
                    state.countryCode = action.payload;
                }
            })
            .addCase(fetchComType.fulfilled, (state, action) => {
                state.comType = action.payload;
            })
            .addCase(fetchUniversalAddress.fulfilled, (state, action) => {
                state.universaladdressFormate = action.payload;
            })
            .addCase(deleteOccDetails.fulfilled,(state,action)=>{
                let key = action?.meta?.arg?.userId
                state.occcupationSavedData[`${key}`] = null;  
            })
    }
});


export const { updateCountryCodeList,updateOccupationList} = apiSlice.actions;
export default apiSlice.reducer;
