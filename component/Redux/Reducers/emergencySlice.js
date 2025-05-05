import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { $Service_Url } from "../../../components/network/UrlPath";
import { getApiCall } from "../../../components/Reusable/ReusableCom";
import konsole from "../../../components/control/Konsole";
import { $AHelper } from "../../Helper/$AHelper";

const initialState = {

   familyMembersList: [],
    bloodTypeList: [],
    emergencyCardUserList: {},
    userPhysicionList: [],
    physicionList:{},
    userEmergencyMember: [],
    memberContactsList: [],
 
    userMedicationList: {},
    physicianAddress: {},
    membersAddress: {},
    userFamilyMemberDetailList: [],
    memberDetail: [],
    emergencyMobileEmailDetail: {},
    emergencyQuestionsList : [],
    emergencyUserResponseList : {},
    emergencyPriorityList : [],
    allergyTypeList : [],
    userAllergiesList : []
}

export const emergencySlice = createSlice({
    name: "emergency",
    initialState,
    reducers: {
        updateUserFamilyMember: (state, action) => {
            state.userEmergencyMember = action.payload
        },
        updateFamilyMemberList: (state, action) => {
            konsole.log('updateFamilyMemberList', action)
            state.familyMembersList = action.payload;
        },
        updateFamilyMemberDetail: (state, action) => {
            konsole.log('updateMemberContact', action)
            state.userFamilyMemberDetailList = action.payload;
            konsole.log('updateMemberContactList', state.userFamilyMemberDetailList)
        },
        updateMemberDetail: (state, action) => {
            konsole.log('updateMemberDetail', action)
            state.memberDetail = action.payload;
        },
 
        updateEmergencyMobileEmailDetail: (state, action) => {
            konsole.log('mergeEmergencyMemberDetail', action)
            state.emergencyMobileEmailDetail = action.payload;
            konsole.log('emergencyMobileEmailDetail', action.payload)
        },
        updateMembersAddress: (state, action) => {
            konsole.log('updateMembersAddress', action)
            state.membersAddress = action.payload;
        },
        updateMemberContact: (state, action) => {
            konsole.log('updateMemberContact', action)
            state.memberContactsList = action.payload;
        },
 
        updateBloodTypeList: (state, action) => {
            konsole.log('updateBloodTypeList', action)
            state.bloodTypeList = action.payload;
        },
        updateEmergencyCardUserList: (state, action) => {
            state.emergencyCardUserList = action.payload;
            konsole.log('EmergencyCardUserListSlice', state.emergencyCardUserList)
        },
        updateUserMedicationList: (state, action) => {
            konsole.log('updateUserMedicationList', action)
            state.userMedicationList = action.payload;
        },
        updateUserPhysicionUserList: (state, action) => {
            konsole.log('updateUserPhysicionUserList', action)
            state.userPhysicionList = action.payload;
        },
        updatePhysicionList: (state, action) => {
            konsole.log('updateUserPhysicionUserList', action)
            state.physicionList = action.payload;
        },
        updatePhysicianAddress: (state, action) => {
            konsole.log('updatePhysicianAddress', action)
            state.physicianAddress = action.payload;
        },

        updateEmergencyQuestions: (state, action) => {
            konsole.log('updateQuestions', action)
            state.emergencyQuestionsList = action.payload;
        },

        updateEmergencyUserResponse: (state, action) => {
            konsole.log('updateUserResponseaction', action)
            state.emergencyUserResponseList = action.payload;
            konsole.log('state.emergencyUserResponseList', state.emergencyUserResponseList )
            konsole.log('emergencyUserResponseListSlice', initialState.emergencyUserResponseList)
        },

        updateEmergencyPriority: (state, action) => {
            konsole.log('emergencyPriorityList', action)
            state.emergencyPriorityList = action.payload;
        },
    
        updateAllergyType : (state, action) => {
            state.allergyTypeList = action.payload;
        },

        updateUserAllergiesList : (state, action) => {
            state.userAllergiesList = action.payload;
        }
        
    },
 
})
export const {
    updateUserFamilyMember,
    updatePhysicionList,
 
    updateFamilyMemberList, updateBloodTypeList, updateEmergencyCardUserList, updateUserMedicationList, updateUserPhysicionUserList, updatePhysicianAddress,
    updateMembersAddress, updateMemberContact, updateFamilyMemberDetail,  updateMemberDetail,  updateEmergencyMobileEmailDetail, 
    updateEmergencyQuestions , updateEmergencyUserResponse, updateEmergencyPriority, updateAllergyType, updateUserAllergiesList } = emergencySlice.actions;


export default emergencySlice.reducer;
