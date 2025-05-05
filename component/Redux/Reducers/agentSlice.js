import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { $Service_Url } from "../../../components/network/UrlPath";
import { getApiCall } from "../../../components/Reusable/ReusableCom";

export const fetchAgent = createAsyncThunk(
    '/api/fetchAgent/',
    async (obj, thunkApi) => {
        console.log(obj,"objobjobjobj")
        try {
            const response = await getApiCall('GET', $Service_Url.getUserAgent +"?userId="+ obj.userId+"&isActive=true", '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);
export const fetchProfessionalType = createAsyncThunk(
    '/api/fetchProfessionalType/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET', $Service_Url.getProfesType, '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const fetchFiduciaryList = createAsyncThunk(
    '/api/Fiduciary/GetFiduciaryListByUserId/',
    async (obj, thunkApi) => {
        console.log(obj,"objobjobjobjobj")
        try {
            const response = await getApiCall('GET', $Service_Url.getFiduciaryList+obj.userId, '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const fetchProfessionallist = createAsyncThunk(
    '/api/Fiduciary/getSearchProfessional/',
    async (obj, thunkApi) => {
        try {
            const response = await getApiCall('GET',$Service_Url.getSearchProfessional+`?MemberUserId=${obj.userId}&ProTypeId=&primaryUserId=${obj.userId}`, '');
            return response;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
)


const initialState = {
    agentList:[],
    illnessImmediateActionQuestions:[],
    illnessImmediateActionAnswers:'',
    mentalHealthImmediateActionQuestions:[],
    mentalHealthImmediateActionAnswers:'',
    endoflifeImmediateActionQuestions:[],
    endoflifeImmediateActionAnswers:'',
    deathImmediateActionQuestions:[],
    deathImmediateActionAnswers:'',
    professionalList:[],
    professionalType:[],
    longtermcareprefrencessQuestions:[],
    longtermcareprefrencessAnswers:'',
    fiduciaryList:[],
    longtermcarefundQuestions:[],
    longtermcarefundAnswers:'',
}

export const agentSlice = createSlice({
    name: 'agent',
    initialState,
        extraReducers: (builder) => {
            builder.addCase(fetchAgent.fulfilled, (state, action) => {
            state.agentList = action.payload;
        })
        .addCase(fetchProfessionalType.fulfilled, (state, action) => {
            state.professionalType = action.payload;
        })
        .addCase(fetchFiduciaryList.fulfilled, (state, action) => {
            state.fiduciaryList = action.payload;
        })
        .addCase(fetchProfessionallist.fulfilled, (state, action) => {
            state.professionalList = action.payload;
        })

    },
    reducers:{
        updateillnessImmediateActionQuestions:(state,action) => {
            state.illnessImmediateActionQuestions = action.payload
        },
        updateillnessImmediateActionAnswer:(state,action) => {
            state.illnessImmediateActionAnswers = action.payload
        },
        updatementalhealthImmediateActionQuestions:(state,action) => {
            state.mentalHealthImmediateActionQuestions = action.payload
        },
        updatementalhealthImmediateActionAnswer:(state,action) => {
            state.mentalHealthImmediateActionAnswers = action.payload
        },

        updateendoflifeImmediateActionQuestions:(state,action) => {
            state.endoflifeImmediateActionQuestions = action.payload
        },
        updateendoflifeImmediateActionAnswer:(state,action) => {
            state.endoflifeImmediateActionAnswers = action.payload
        },
        updatedeathImmediateActionQuestions:(state,action) => {
            state.deathImmediateActionQuestions = action.payload
        },
        updatedeathImmediateActionAnswer:(state,action) => {
            state.deathImmediateActionAnswers = action.payload
        },
        updateprofessionalList:(state,action) => {
            state.professionalList = action.payload
        },
        updatelongtermcareprefrencessQuestions:(state,action) => {
            state.longtermcareprefrencessQuestions = action.payload
        },
        updatelongtermcareprefrencessAnswer:(state,action) => {
            state.longtermcareprefrencessAnswers = action.payload
        },
        updatelongtermcarefundQuestions:(state,action) => {
            state.longtermcarefundQuestions = action.payload
        },
        updatelongtermcarefundAnswer:(state,action) => {
            state.longtermcarefundAnswers = action.payload
        },
    }
})

export const {updateillnessImmediateActionQuestions,updateillnessImmediateActionAnswer,updatementalhealthImmediateActionQuestions,updatementalhealthImmediateActionAnswer,updateendoflifeImmediateActionQuestions,updateendoflifeImmediateActionAnswer,updatedeathImmediateActionQuestions,updatedeathImmediateActionAnswer,updateprofessionalList,updatelongtermcareprefrencessQuestions,updatelongtermcareprefrencessAnswer,updatelongtermcarefundQuestions,updatelongtermcarefundAnswer} = agentSlice.actions;

export default agentSlice.reducer;