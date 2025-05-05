// @@SELECTOR FOR FETCH DATA FROM REDUX STORE


export const selectShowLoader = (state) => state.ui.showLoader;
export const selectActiveNavbarItem = (state) => state.ui.activeNavbarItem;
export const selectHideCustomeSubSideBar = (state) => state.ui.hideCustomeSubSideBar;

// @@
export const selectUI = (state) => state.ui;
export const selectApi = (state) => state.api;
export const selectPersonal = (state) => state.personal;
export const selectOccurrance = (state) => state.occurrance;

export const selectorHealth = (state) => state.health;
export const selectorLegal = (state) => state.legal;
export const selectorFinance = (state) => state.finance;
export const selectorAgent = (state) => state.agent;


export const selectProfessional = (state) => state.professional;
export const selectfile = (state) => state.file;
export const selectSubjectData = (state) => state.subject;

export const selectorEmergency = (state) => state.emergency

export const selectMonthlyIncome = (state) => state.monthlyIncome;

export const selectAgreement = (state) => state.agreement;
// Add other selectors as needed
