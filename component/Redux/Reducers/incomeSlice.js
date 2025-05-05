import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { $Service_Url } from "../../../components/network/UrlPath";
import { getApiCall, postApiCall } from "../../../components/Reusable/ReusableCom";
import konsole from "../../../components/control/Konsole";
import { $JsonHelper } from "../../Helper/$JsonHelper";

export const fetchIncomeTypes = createAsyncThunk(
    'api/monthlyIncome/incomeTypes',
    async (_, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url?.getincometypes);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data);
        }
    }
)

export const fetchUserMonthlyIncome = createAsyncThunk(
    'api/monthlyIncome/primaryMonthlyIncome',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getUserMonthlyIncomePath + obj.userId);
            konsole.log(response,"gdgsdgssgddgd")
            return response

        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
); 

export const fetchSpouseMonthlyIncome = createAsyncThunk(
    'api/monthlyIncome/spouseMonthlyIncome',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getUserMonthlyIncomePath + obj.userId);
            return response

        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
); 

export const fetchSubjectForFormLabelId = createAsyncThunk(
    'api/monthlyIncome/subjectForFormLabelId',
    async (obj, thunkApi) => {
        try {
            const response = await postApiCall('POST', $Service_Url.getsubjectForFormLabelId, obj);
            return response?.data?.data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

export const fetchSubjectForFormLabelIdAnswer = createAsyncThunk(
    'api/monthlyIncome/subjectForFormLabelIdAnswer',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getSubjectResponse + obj.userId + `/0/0/${obj.subjectId}`);
            return response?.userSubjects;

        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
); 

const initialState = {
    incomeTypes: [],
    primaryUserMonthlyIncome: '',
    SpouseUserMonthlyIncome: '',
    FormLabelIdAnswer: '',
    subjectForFormLabelId: '',
    SubjectResponse: '',
};

const incomeSlice = createSlice({
    name: 'monthlyIncome',
    initialState,
    reducers:{
        setprimaryUserMonthlyIncome: (state, action) => {
            state.primaryUserMonthlyIncome = action.payload;
        },
        setSpouseUserMonthlyIncome: (state, action) => {
            state.SpouseUserMonthlyIncome = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIncomeTypes.fulfilled, (state, action) => {
                state.incomeTypes = action.payload;
            })
            .addCase(fetchUserMonthlyIncome.fulfilled, (state, action) => {
                state.primaryUserMonthlyIncome = action.payload;
            })
            .addCase(fetchSpouseMonthlyIncome.fulfilled, (state, action) => {
                state.SpouseUserMonthlyIncome = action.payload;
            })
            .addCase(fetchSubjectForFormLabelIdAnswer.fulfilled, (state, action) => {
                state.FormLabelIdAnswer = action.payload;
            })
            .addCase(fetchSubjectForFormLabelId.fulfilled, (state, action) => {
                state.subjectForFormLabelId = action.payload;
            })
    }
});

export const { setprimaryUserMonthlyIncome,  setSpouseUserMonthlyIncome} = incomeSlice.actions;
export default incomeSlice.reducer;