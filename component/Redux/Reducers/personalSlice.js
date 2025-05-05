import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { $Service_Url } from "../../../components/network/UrlPath";
import { getApiCall, postApiCall,postApiCall2 } from "../../../components/Reusable/ReusableCom";
import { $JsonHelper } from "../../Helper/$JsonHelper";
import { $AHelper } from "../../Helper/$AHelper";
import konsole from "../../../components/control/Konsole";


export const fetchLoginMemberDetails = createAsyncThunk(
  'api/loggedInMembrDetail',
  async (obj, thunkApi) => {
    try {
      const response = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + obj.userId);
      return response?.member;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);


export const fetchPrimaryDetails = createAsyncThunk(
  'api/fetchPrimaryDetails',
  async (obj, thunkApi) => {
    try {
      const response = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + obj.userId);
      return response?.member;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const fetchSpouseDetails = createAsyncThunk(
  'api/fetchSpouseDetails',
  async (obj, thunkApi) => {
    try {
      const response = await getApiCall('GET', $Service_Url.getFamilyMemberbyID + obj.userId);
      return response?.member;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllChildrenDetails = createAsyncThunk(
  'api/fetchAllChildrenDetails',
  async (obj, thunkApi) => {
    try {
      const response = await getApiCall('GET', $Service_Url.getFamilybyParentID + obj.userId);
      konsole.log('responseresponse', response)
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllNonFamilyMemberDetails = createAsyncThunk(
  'api/fetchNonFamilyMemberDetails',
  async (obj, thunkApi) => {
    try {
      const response = await getApiCall('GET', $Service_Url.getNonFamilyMember + obj.userId);
      konsole.log('responseresponse', response)
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);


export const deleteFamilyMemberDetails = createAsyncThunk(
  'api/deleteMember',
  async (obj, thunkApi) => {
    try {

      const { userId, memberId, deletedBy, userRelationshipId, isDeleteDescendant } = obj;
      const allChildrenDetails = thunkApi.getState().api.allChildrenDetails;
      const response = await postApiCall('DELETE', $Service_Url.deletememberchild + userId + '/' + memberId + '/' + deletedBy + '/' + userRelationshipId + '/' + isDeleteDescendant);
      konsole.log('responseresponseresponse', response)
      if (response != 'err') {
        return allChildrenDetails.filter((item) => item.userId != obj.userId)
      } else {
        return allChildrenDetails;
      }
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
)


export const fetchPrimaryMemberContactDetials = createAsyncThunk(
  'api/fetchPrimaryMEmberContcatDetials',
  async (obj, thunkApi) => {
    try {
      let response = await getApiCall('GET', $Service_Url.getAllContactOtherPath + obj.userId, '');
      konsole.log('responseresponse', response);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const getUserAgent = createAsyncThunk(
  'api/fetchPrimaryMEmberContcatDetials',
  async (obj, thunkApi) => {
    try {
      let response = await postApiCall2('POST', $Service_Url.getUserAgentByAgentId, obj);
      konsole.log('responseresponse', response);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  primaryDetails: '',
  primaryMemberJson: '',
  isJointAccount: false,
  spouseDetails: '',
  loggedInMemberDetail: '',
  allChildrenDetails: [],
  allExtendedFamilyDetails: [],
  allChildrenlabelValue: [],
  isShowSpouseMaritalTile: true,
  loginMemberRoles: [],
  primaryMemberContactDetails: '',  
  isPrimaryAddress:false,
  isSpouseAddress:false,
  isSetupSidebarLink:true,
  showInvite:false,
  userAgents :[],
  isState:'',
  handleOffData:'',
  sSPrimaryUserId: '',
  sSSpouseUserId: '',
  sSLoggedInUserId: '',
}


export const personalSlice = createSlice({
  name: 'personal',
  initialState,
  reducers: {
    updatePrimaryJson: (state, action) => {
      konsole.log('actionactionaction', action);
      state.primaryMemberJson = action.payload;
    },
    updateHandleChecked: (state, action) => {
      state.handleOffData = action.payload
    },
    setPrimaryMemberDetails: (state, action) => {
      konsole.log("actionaction", action)
      state.primaryDetails = action.payload;
    },
    setSpouseMemberDetails: (state, action) => {
      konsole.log("actionaction", action)
      state.spouseDetails = action.payload;
    },
    setAllChildrenDetails: (state, action) => {
      state.allChildrenDetails = action.payload
    },
    setAllExtentedFamilyDetails: (state, action) => {
      state.allExtendedFamilyDetails = action.payload;
    },
    setIsJointAccount: (state, action) => {
      state.isJointAccount = action.payload;
    },
    setSessionData: (state, action) => {
      state.sSPrimaryUserId = sessionStorage.getItem('SessPrimaryUserId') || '';
      const spouseId = sessionStorage.getItem('spouseUserId');
      state.sSSpouseUserId = (spouseId && (spouseId != "null")) ? spouseId : '';
      state.sSLoggedInUserId = sessionStorage.getItem('loggedUserId') || '';
    },
    setIsShowSpouseMaritalTile: (state, action) => {
      state.isShowSpouseMaritalTile = false;
    },
    updateLoginMemberRoles: (state, action) => {
      state.loginMemberRoles = action.payload;
    },
    updateAllChildrenlabelValue: (state, action) => {
      state.allChildrenlabelValue = action.payload;
    },
    updateIsPrimaryAddress:(state,action)=>{
      konsole.log("actonactionAddress",action)
        state.isPrimaryAddress = action.payload;
    },
    updateIsState:(state,action)=>{
        state.isState = action.payload;
    },
    updateIsSpouseAddress:(state,action)=>{
        state.isSpouseAddress=action.payload;
    },
    updateIsSetupSidebarLink:(state,action)=>{
      state.isSetupSidebarLink = action.payload
    },
    updateShowInvite:(state,action)=>{
      state.showInvite = action.payload
    },
    setUserAgentData:(state,action)=>{
      state.userAgents = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginMemberDetails.fulfilled, (state, action) => {
        state.loggedInMemberDetail = action.payload;
      })
      .addCase(fetchPrimaryDetails.fulfilled, (state, action) => {
        state.primaryDetails = action.payload;
        state.primaryMemberJson = $JsonHelper.createJsonUpdateMemberById({ ...action.payload });
      })
      .addCase(fetchSpouseDetails.fulfilled, (state, action) => {
        state.spouseDetails = action.payload;
      })
      .addCase(fetchAllChildrenDetails.fulfilled, (state, action) => {

        const allDetails = action.payload;
        konsole.log("allDetails", action, allDetails,allDetails?.[0]?.children)
        let childrenDetails = []
        if ($AHelper.$isNotNullUndefine(allDetails) && allDetails?.length > 0) {
          
          if(allDetails[0]?.children?.length > 0){
            let childrenDetailsList = $AHelper?.$isMarried(allDetails[0]?.maritalStatusId) ? allDetails[0]?.children[0]?.children : allDetails[0]?.children;
            konsole.log("childrenDetails111",childrenDetailsList,allDetails)
            let extractChildSpouse = []
            let extractChildsChild = []
            let extractSingleChildsChild = []
            for(const checkChild of childrenDetailsList){
              if(checkChild?.children?.length > 0){
                konsole.log("childrenDetails1112",checkChild?.children)
                if([1, 47, 48, 49, 50].includes(checkChild?.children[0]?.relationship_Type_Id) && checkChild?.children[0]?.children?.length > 0){
                  extractChildsChild.push(...checkChild?.children[0]?.children)
                  extractChildSpouse.push(...checkChild?.children)
                  konsole.log("childrenDetails1112extractChildsChild",extractChildsChild)
                }
                else{
                  extractSingleChildsChild.push(...checkChild?.children)
                }
              }
            }
            childrenDetails = [
                ...(childrenDetailsList || []),
                ...extractChildsChild || [], ...extractChildSpouse || [],
                ...extractSingleChildsChild || []
              ];
            konsole.log("childrenDetails1112extractChildsChild2",extractChildsChild,childrenDetails)
        }
        }
        
        state.allChildrenDetails = childrenDetails;
        state.allChildrenlabelValue = childrenDetails?.map((item) => {
          return {
            ...item,
            label: `${item?.fName || ''} ${item?.mName ? item?.mName : ''} ${item?.lName || ''}`.trim(),
            value: item?.userId
          };
        });

        konsole.log("childrenDetailsreducer", childrenDetails)
      })
      .addCase(fetchAllNonFamilyMemberDetails.fulfilled, (state, action) => {
        state.allExtendedFamilyDetails = action.payload
      })
      .addCase(fetchPrimaryMemberContactDetials.fulfilled, (state, action) => {
        let value = action.payload === 'err' ? '' : action.payload?.contact
        state.primaryMemberContactDetails = value;
      })
  }
});

export const {updateIsSetupSidebarLink,updateIsSpouseAddress,updateIsPrimaryAddress, updateLoginMemberRoles, updateAllChildrenlabelValue, updatePrimaryJson, setPrimaryMemberDetails, setSpouseMemberDetails, setAllChildrenDetails, setAllExtentedFamilyDetails, setIsJointAccount, setIsShowSpouseMaritalTile, updateShowInvite,setUserAgentData,updateIsState, updateHandleChecked, setSessionData } = personalSlice.actions;

export default personalSlice.reducer;
