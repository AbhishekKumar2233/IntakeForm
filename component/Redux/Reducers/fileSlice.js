import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { $Service_Url } from "../../../components/network/UrlPath";

const initialState = {
    uploadedDocumentInformation: {}

}

export const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        updateUploadDocumentInformation: (state, action) => {
            state.uploadedDocumentInformation = action.payload
        }
    }
})


export const { updateUploadDocumentInformation } = fileSlice.actions;
export default fileSlice.reducer;