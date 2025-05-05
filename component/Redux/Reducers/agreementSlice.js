import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { $Service_Url } from "../../../components/network/UrlPath";
import { getApiCall } from "../../../components/Reusable/ReusableCom";
import konsole from "../../../components/control/Konsole";
import { agreementTypeOptions } from "../../Helper/Constant";

// export const fetchProfSubTypes = createAsyncThunk(
//     'professional/profSubTypes',
//     async (_, thunkApi) => {
//         try {
//             const response = await getApiCall('GET', $Service_Url.getProffesionalSubType);
//             return response;
//         } catch (error) {
//             return thunkApi.rejectWithValue(error?.response?.data);
//         }
//     }
// )

const initialState = {
    agreementType: "",

    tempData: {},
};

const agreementSlice = createSlice({
    name: 'agreement',
    initialState,
    reducers:{
        setAgreementType: (state, action) => {
            if(agreementTypeOptions.includes(action.payload)) state.agreementType = action.payload;
        },

        setTempData: (state, action) => {
            state.tempData = action.payload;
        },
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(fetchProfTypes.fulfilled, (state, action) => {
    //             state.profTypes = {...state.profTypes, ...action.payload};
    //         })

    // }
});


export const { setAgreementType, setTempData } = agreementSlice.actions;
export default agreementSlice.reducer;