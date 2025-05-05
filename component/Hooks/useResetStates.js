import { useCallback } from "react";
import { updatebenefidficiaryList, updatelifeInsuranceList, updateNonRetirementAssestsList, updateOwnerTypeList, updateRetirementAssetsList } from "../Redux/Reducers/financeSlice";
import { useAppDispatch } from "./useRedux";

/**
 * Hook for reseting some redux states
 * @returns {object} Redux State Reseting Functions
 */
const useResetStates = () => {
    const dispatch = useAppDispatch();

    const resetBeneficiaryStates = useCallback(() => {
        dispatch(updatebenefidficiaryList([])); // Beneficiary list of options

        dispatch(updateRetirementAssetsList([])); // retirementAssets table data
        dispatch(updateNonRetirementAssestsList([])); // non retirementAssets table data

        dispatch(updatelifeInsuranceList([])); // life insurance table data
    });

    const resetFiduciaryStates = useCallback(() => {
        dispatch(updateOwnerTypeList([]))
    });

    const resetBenFiduStates = () => {
        resetBeneficiaryStates();
        resetFiduciaryStates();
    }

    return { resetBeneficiaryStates , resetFiduciaryStates , resetBenFiduStates };
}

export default useResetStates;