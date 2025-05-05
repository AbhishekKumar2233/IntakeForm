import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { $Service_Url } from "../../../components/network/UrlPath";





const initialState = {
    occurranceDetails: {}
}


export const occurranceSlice = createSlice({
    name: 'occurrance',
    initialState,
    reducers: {
        updateOccurranceDetails: (state, action) => {
            state.occurranceDetails = action.payload
        }
    }
})

export const {updateOccurranceDetails}=occurranceSlice.actions;
export default occurranceSlice.reducer