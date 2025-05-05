import { combineReducers, configureStore, createAction } from "@reduxjs/toolkit";
import uiReducer from '../Reducers/uiSlice'
import apiReducer from "../Reducers/apiSlice";
import personalReducer from '../Reducers/personalSlice';
import occurranceReducer from "../Reducers/occurranceSlice";
import healthReducer from "../Reducers/healthISlice";
import financeReducer from "../Reducers/financeSlice";
import professionalReducer from "../Reducers/professionalSlice";
import agreementReducer from "../Reducers/agreementSlice";
import fileReducer from "../Reducers/fileSlice";
import subjectDataSlice from "../Reducers/subjectDataSlice";
import emergencyReducer from "../Reducers/emergencySlice";
import monthlyIncomeReducer from '../Reducers/incomeSlice';
import legalReducer from "../Reducers/legalSlice";

import agentReducer from "../Reducers/agentSlice";

import reducer from "../../../components/Store/reducers/reducer";
import legalSlice from "../Reducers/legalSlice";

export const resetStore = createAction('resetStore');

const appReducer = combineReducers({
  ui: uiReducer,
  api: apiReducer,
  personal: personalReducer,
  occurrance: occurranceReducer,
  health: healthReducer,
  finance: financeReducer,
  legal: legalReducer,
  professional: professionalReducer,
  agreement: agreementReducer,
  file: fileReducer,
  subject: subjectDataSlice,
  legal:legalSlice,
  main:reducer,
  emergency: emergencyReducer,
  monthlyIncome: monthlyIncomeReducer,
  main: reducer,
  agent:agentReducer
})

const rootReducer = (state, action) => {
  console.log("aaaaastatestatestate", action, resetStore.type)
  if (action.type === resetStore.type) {
    state = undefined;
  }
  return appReducer(state, action);
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    })
})