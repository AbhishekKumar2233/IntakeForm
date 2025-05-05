import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { burial } from "../../../components/control/Constant";



const initialState = {
    futureExpectationQuestion: [],
    futureExpectionFormLabel: '',

    organDonationQuestion: [],
    primaryOrganDonationFormLabel: '',
    spouseOrganDonationFormLabel: '',

    livingWillQuestion: [],
    primarylivingWillFormLabel: '',
    spouselivingWillFormLabel: '',

    burialCremationQuestion: [],
    primaryburialCrematoFormLabel: '',
    spouseburialFormLabel: '',

    professionalMetaQuestions: {},
    lifeStyleQuestion: [],
    primaryLifeStyleFormLabel: '',
    spouseLifeStylelFormLabel: '',
    burialCremationHORCemetryQuestions: [],
    taxInfoQuestion:[],
    housingMetaQuestions :[],
    primaryCremationHORCemetryFormLabel: '',
    spouseCremationHORCemetryFormLabel: '',

    organDonorQuestion: [],
    organDonorFormLabel: {},

}

export const subjectDataSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {
        updateFutureExpectionsSubjectQuestion: (state, action) => {
            state.futureExpectationQuestion = action.payload;
        },
        updateFutureExpectionsSubjectResponse: (state, action) => {
            state.futureExpectionFormLabel = action.payload;
        },
        updateOrganDonationQuestion: (state, action) => {
            state.organDonationQuestion = action.payload;
        },
        updatePrimaryOrganDonationFormLabel: (state, action) => {
            state.primaryOrganDonationFormLabel = action.payload;
        },
        updateSpouseOrganDonationFormLabel: (state, action) => {
            state.spouseOrganDonationFormLabel = action.payload;
        },

        updateLivingWillQuestion: (state, action) => {
            state.livingWillQuestion = action.payload;
        },
        updateBurialCremationQuestion: (state, action) => {
            state.burialCremationQuestion = action.payload;
        },
        updatePrimaryburialCrematoFormLabel: (state, action) => {
            state.primaryburialCrematoFormLabel = action.payload;
        },
        updateSpouseburialFormLabel: (state, action) => {
            state.spouseburialFormLabel = action.payload;
        },
        updatePrimaryLivingWillFormLabel: (state, action) => {
            state.primarylivingWillFormLabel = action.payload;
        },
        updateSpouseLivingWillFormLabel: (state, action) => {
            state.spouselivingWillFormLabel = action.payload;
        },
        updateProfessionalMetaQuestions: (state, action) => {
            state.professionalMetaQuestions = {
                ...state.professionalMetaQuestions,
                ...action.payload,
            }
        },


        updateSpouseLifeStyleFormLabel: (state, action) => {
            state.spouseLifeStylelFormLabel = action.payload;
        },
        updatePrimaryLifeStyleFormLabel: (state, action) => {
            state.primaryLifeStyleFormLabel = action.payload;
        },
        updateLifeStyleQuestion: (state, action) => {
            state.lifeStyleQuestion = action.payload;
        },

        updateBurialHorCemetryMetaQuestions: (state, action) => {
            state.burialCremationHORCemetryQuestions = action.payload
        },
        updateTaxInfoQuestion: (state, action) => {
            state.taxInfoQuestion = action.payload
        },
        updatePrimaryBurialHorCemetryFormLabel: (state, action) => {
            state.primaryCremationHORCemetryFormLabel = action.payload;
        },
        updateSpouseBurialHorCemetryFormLabel: (state, action) => {
            state.spouseCremationHORCemetryFormLabel = action.payload;
        },

        updateOrganDonorQuestion: (state, action) => {
            state.organDonorQuestion = action.payload;
        },
        updateOrganDonorFormLabel: (state, action) => {
            state.primaryOrganDonorFormLabel = action.payload;
        },
        updatehousingMetaQuestions: (state, action) => {
            state.housingMetaQuestions = action.payload
        },
    }
})


export const {updateBurialHorCemetryMetaQuestions,updatePrimaryBurialHorCemetryFormLabel,updateSpouseBurialHorCemetryFormLabel, updateFutureExpectionsSubjectQuestion, updateFutureExpectionsSubjectResponse, updateOrganDonationQuestion, updatePrimaryOrganDonationFormLabel, updateSpouseOrganDonationFormLabel,
    updateSpouseLivingWillFormLabel, updatePrimaryLivingWillFormLabel, updateLivingWillQuestion, updateBurialCremationQuestion, updatePrimaryburialCrematoFormLabel, updateSpouseburialFormLabel,
    updateProfessionalMetaQuestions, updateLifeStyleQuestion, updatePrimaryLifeStyleFormLabel, updateSpouseLifeStyleFormLabel,updateOrganDonorQuestion, updateOrganDonorFormLabel,updatehousingMetaQuestions,updateTaxInfoQuestion
} = subjectDataSlice.actions;
export default subjectDataSlice.reducer;