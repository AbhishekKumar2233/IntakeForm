// store/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showLoader: false,
  activeNavbarItem: '1',
  hideCustomeSubSideBar: false,
  accessFromIframe: false
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.showLoader = action.payload;
    },
    setActiveNavbarItem: (state, action) => {
      state.activeNavbarItem = action.payload;
    },
    setHideCustomeSubSideBar: (state, action) => {
      state.hideCustomeSubSideBar = action.payload;
    },
    setAccessFromIframe: (state, action) => {
      state.accessFromIframe = action.payload;
    }
  },
});

export const { setLoader, setActiveNavbarItem, setHideCustomeSubSideBar, setAccessFromIframe } = uiSlice.actions;
export default uiSlice.reducer;
