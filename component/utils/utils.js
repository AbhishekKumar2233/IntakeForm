import { setLoader, setActiveNavbarItem, setHideCustomeSubSideBar } from "../Redux/Reducers/uiSlice";
import { store } from "../Redux/Store/store";
import { resetStore } from "../Redux/Store/store";
import { updateFamilyMemberList } from "../Redux/Reducers/legalSlice";
import { setAllChildrenDetails, updateAllChildrenlabelValue, setAllExtentedFamilyDetails } from "../Redux/Reducers/personalSlice";
import { updatePrimaryHealthInsuranceDetail, updateSpouseHealthInsuranceDetail } from "../Redux/Reducers/healthISlice";
import { updateUserMedicationList, updateUserFamilyMember } from "../Redux/Reducers/emergencySlice";

export const useLoader = (val) => {
  store.dispatch(setLoader(val))
};


export const setLoaderState = (val) => {
  store.dispatch(setLoader(val));
};

export const useResetStore = (val) => {
  store.dispatch(resetStore());
};

export const setActiveNavbarState = (id) => {
  store.dispatch(setActiveNavbarItem(id))
}

export const setHideCustomeSubSideBarState = (value) => {
  store.dispatch(setHideCustomeSubSideBar(value))
}


export const clearFidBenefiMemberList = () => {
  store.dispatch(updateFamilyMemberList([]))
}

export const clearFamilyNExtendedFamilyInfo = () => {
  clearFamilyInfo();
  clearExtendedFamilyInfo();
}
export const clearFamilyInfo = () => {
  store.dispatch(setAllChildrenDetails([]));
  store.dispatch(updateAllChildrenlabelValue([]));
}

export const clearExtendedFamilyInfo = () => {
  store.dispatch(setAllExtentedFamilyDetails([]));
}

export const clearHealthInsuranceDetails = () => {
  store.dispatch(updatePrimaryHealthInsuranceDetail([]));
  store.dispatch(updateSpouseHealthInsuranceDetail([]));
}

export const emergencyPageType = 'Emergency-Information';
export const healthMedicationPageType = 'AddEditMedications';
export const cleanMedicationNsuplement = (pageType) => {
  // pageType
  if (pageType == emergencyPageType) {
    // clear medication & suplement from health section
  } else if (pageType == healthMedicationPageType) {
    // clear medication & suplement from emergency section;
    store.dispatch(updateUserMedicationList({}))
  }
}


export const cleanUpdateUserFamilyMember = () => {
  store.dispatch(updateUserFamilyMember([]))
}


