import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";


export const fetchBurialLifeInsurance = createAsyncThunk(
    '/api/burialLifeinsuracneData',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', `${$Service_Url.getLifeInsByUserId}${obj?.userId}`);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);




const initialState = {
    burialPrimaryLifeInsurance: [],
    burialSpouseLifeInsurance: [],
    horUploadedDocumentDetails: [],
    cemeteryUploadedDocumentDetails: [],
    // beficiaryListArr: [],
    // fiduciaryListArr: [],
    familyMemberList: [],

    legalDocumentList: [],
    userLegalDocumentList: [],
    planType: null,
    selectedDocType: null,
    showNewButton: false,
    hasLegalPlanning: null,
    handleMetaData: '',
    handleMetaDataForm: '',
    adjustAddressInputHeight: false
}



export const legalSlice = createSlice({
    name: 'legal',
    initialState,
    reducers: {
        // updateFiduciaryList: (state, action) => {
        //     state.fiduciaryListArr = action.payload;
        // },
        // updateBeneficiaryList: (state, action) => {
        //     state.beficiaryListArr = action.payload;
        // },
        updateFamilyMemberList: (state, action) => {
            // console.log("stateAction", state, action)
            state.familyMemberList = action.payload;
        },
        // updatecombineFidBenList: (state, action) => {
        //     state.combineFidBenList = action.payload;
        // },
        updatePrimaryBurialInsuranceDetail: (state, action) => {
            // console.log("actionaction", state, action)
            state.burialPrimaryLifeInsurance = action.payload;
        },
         updateAddressInputHeight:(state,action)=>{
            state.adjustAddressInputHeight = action.payload;
        },
        updateSpouseBurialInsuranceDetail: (state, action) => {
            state.burialSpouseLifeInsurance = action.payload;
        },
        updateHorDocumentDetails: (state, action) => {
            state.horUploadedDocumentDetails = action.payload;
        },
        updateCemeteryDocumentDetails: (state, action) => {
            state.cemeteryUploadedDocumentDetails = action.payload;
        },
        updateLegalDocumentList: (state, action) => {
            state.legalDocumentList = action.payload;
        },
        updateUserLegalDocumentList: (state, action) => {
            state.userLegalDocumentList = action.payload;
        },
        setPlanType: (state, action) => {
            state.planType = action.payload;
        },
        setSelectedDocType: (state, action) => {
            state.selectedDocType = action.payload;
        },
        setShowNewButton: (state, action) => {
            state.showNewButton = action.payload;
        },
        setHasLegalPlanning: (state, action) => {
            state.hasLegalPlanning = action.payload;
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload;
        },
        setMetaDataForm: (state, action) => {
            state.metaDataForm = action.payload;
        }
    }
})

export const { updateLegalDocumentList, updateUserLegalDocumentList, updateFamilyMemberList, updatePrimaryBurialInsuranceDetail, updateHorDocumentDetails, updateSpouseBurialInsuranceDetail, updateCemeteryDocumentDetailssetPlanType, setPlanType, setSelectedDocType, setShowNewButton, setHasLegalPlanning, setMetaData, setMetaDataForm, updateAddressInputHeight } = legalSlice.actions;
export default legalSlice.reducer;