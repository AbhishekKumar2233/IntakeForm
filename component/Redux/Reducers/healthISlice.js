import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { $Service_Url } from "../../../components/network/UrlPath";
import { getApiCall } from "../../../components/Reusable/ReusableCom";
import konsole from "../../../components/control/Konsole";






export const fetchHealthInsurance = createAsyncThunk(
    '/api/insuranceData',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', `${$Service_Url.getUserInsurance}${obj?.userId}`);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);




export const fetchTypeOfPlan = createAsyncThunk(
    '/api/TypePlan/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getHealthInsPlanType);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);


export const fetchTypeOfSuppPlan = createAsyncThunk(
    '/api/SuppPlan/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getHealthInsSupPlan);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);


export const fetchTypeOfInsCompany = createAsyncThunk(
    '/api/InsCompany/getInsCompany',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getInsCompany);
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

export const fetchPreFrequency = createAsyncThunk(
    '/api/PreFrequency',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getPreFrequency);
            konsole.log("responsegetPreFrequency", response)
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

//Family medical history
export const fetchFamilyMedicalHistory = createAsyncThunk(
    '/api/UserMedHistory/get-UserMedHistory-by-medhisttype',
    async(obj,thunkApi)=>{
        try{
            const response = await getApiCall('GET',$Service_Url.getuserfamilyHistory)
            return response
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
);

export const fetchBloodtype = createAsyncThunk(
    '/api/BloodType',
    async(obj,thunkApi)=>{
        try{
          const response = await getApiCall('GET',$Service_Url.getBloodType)
          return response;
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)

export const fetchUsermedication = createAsyncThunk(
    'api/Usermedication',
    async(obj,thunkApi)=>{
        try{
            const response = await getApiCall('GET',$Service_Url.GetUserMedication+obj?.userId)
            return {
                response: response,
                user: obj?.user
            }
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)

export const fetchmedication = createAsyncThunk(
    'api/medication',
    async(obj,thunkApi)=>{
        try{
            
            const response = await getApiCall('GET',$Service_Url.GetMedications)
            return response
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)






const initialState = {
    primaryHealthInsuranceDetail: [],
    spouseHealthInsuranceDetail: [],
    typeOfPlanList: [],
    typeOfSubPlanList: [],
    typeOfInsCompanyList:[],
    prePreFrequencyList:[],
    bloodtypeList:[],
    medicationList:[],
    userMedicationListPrimary:[],
    userMedicationListSpouse:[],

}


export const healthSlice = createSlice({
    name: 'health',
    initialState,
    reducers: {
        updatePrimaryHealthInsuranceDetail: (state, action) => {
            console.log("actionaction",action)
            state.primaryHealthInsuranceDetail = action.payload;
        },
        updateSpouseHealthInsuranceDetail: (state, action) => {
            state.spouseHealthInsuranceDetail = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTypeOfPlan.fulfilled, (state, action) => {
            state.typeOfPlanList = action.payload
        })
        .addCase(fetchTypeOfSuppPlan.fulfilled, (state, action) => {
            state.typeOfSubPlanList = action.payload
        })
        .addCase(fetchTypeOfInsCompany.fulfilled, (state, action) => {
            state.typeOfInsCompanyList = action.payload
        })
        .addCase(fetchPreFrequency.fulfilled, (state, action) => {
            state.prePreFrequencyList = action.payload
        })
        .addCase(fetchBloodtype.fulfilled,(state,action)=>{
            state.bloodtypeList = action.payload
        })
        .addCase(fetchUsermedication.fulfilled,(state,action)=>{
            if(action.payload.user == "primary") state.userMedicationListPrimary = action.payload.response;
            else state.userMedicationListSpouse = action.payload.response;
        })
        .addCase(fetchmedication.fulfilled,(state,action)=>{
            state.medicationList = action.payload
        })
    }
})

export const { updatePrimaryHealthInsuranceDetail, updateSpouseHealthInsuranceDetail } = healthSlice.actions;
export default healthSlice.reducer