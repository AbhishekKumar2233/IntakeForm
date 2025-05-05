import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { $Service_Url } from "../../../components/network/UrlPath";
import { getApiCall } from "../../../components/Reusable/ReusableCom";
import konsole from "../../../components/control/Konsole";

export const fetchProfSubTypes = createAsyncThunk(
    'professional/profSubTypes',
    async (_, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getProffesionalSubType);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data);
        }
    }
)

export const fetchBusinessTypes = createAsyncThunk(
    'professional/businessTypeList',
    async (_, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getBusinessType);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data);
        }
    }
)

export const fetchProfTypes = createAsyncThunk(
    'professional/ProfTypes',
    async (proSerDescId, thunkApi) => {
        // konsole.log("fgh", proSerDescId)
        if(!proSerDescId) return thunkApi.rejectWithValue("");
        try {
            const response = await getApiCall('GET', $Service_Url.getProfesType + '?proSerDescId=' + proSerDescId);
            return {[proSerDescId]: response?.map(ele => ({
                ...ele,
                proSerDescId: proSerDescId,
                proType: ele.label,
                proTypeId: ele.value,
            }))};
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data);
        }
    }
)

const initialState = {
    profSubTypes: [],
    profTypes: {},
    businessTypeList: [],
    selectedFormData: {},
    selectedFormMetaData: {},
    formData: {},
    formMetaData: {},
    spousePrimaryPhysAdded: false,
    isUserStartedEdit: false,
    addedPrimaryProfList: {},
};

const professionalSlice = createSlice({
    name: 'professional',
    initialState,
    reducers:{
        setformData: (state, action) => {
            state.formData = {
                ...state.formData,
                ...action.payload,
            };
        },
        setselectedFormData: (state, action) => {
            state.selectedFormData = action.payload;
        },
        setBothFormData: (state, action) => {
            state.formData = action.payload;
            state.selectedFormData = action.payload;
        },
        setformMetaData: (state, action) => {
            // console.log("dsdddddddddd",action.payload)
            state.formMetaData = action.payload;
        },
        setselectedFormMetaData: (state, action) => {
            state.selectedFormMetaData = action.payload;
        },
        setBothMetaData: (state, action) => {
            state.formMetaData = action.payload;
            state.selectedFormMetaData = action.payload;
        },
        setspousePrimaryPhysAdded: (state, action) => {
            state.spousePrimaryPhysAdded = action.payload;
        },
        setisUserStartedEdit: (state, action) => {
            state.isUserStartedEdit = action.payload == true;
        },
        setaddedPrimaryProfList: (state, action) => {
            state.addedPrimaryProfList[action.payload?.key] = action.payload?.value; 
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfTypes.fulfilled, (state, action) => {
                state.profTypes = {...state.profTypes, ...action.payload};
            })
            .addCase(fetchProfSubTypes.fulfilled, (state, action) => {
                state.profSubTypes = action.payload;
            })
            .addCase(fetchBusinessTypes.fulfilled, (state, action) => {
                state.businessTypeList = action.payload;
            })

    }
});


export const { setselectedFormData, setselectedFormMetaData, setBothFormData, setformData , setformMetaData, setBothMetaData, setspousePrimaryPhysAdded, setisUserStartedEdit, setaddedPrimaryProfList } = professionalSlice.actions;
export default professionalSlice.reducer;