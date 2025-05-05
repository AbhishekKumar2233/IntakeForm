import { useCallback } from "react";
import { setformData } from "../Redux/Reducers/professionalSlice";
import { selectProfessional } from "../Redux/Store/selectors";
import { useAppDispatch, useAppSelector } from "./useRedux";

// const initialFormState = {fName: '', lName: '', specialty: '', businessName: '', websiteLink: '', sameAsSpouse: undefined, curProCatList: [], metaData: {}}
export const useProfFormState = ( defaultSameAsSpouse ) => {
    const { formData } = useAppSelector(selectProfessional);
    const dispatcher = useAppDispatch();
    const formDispatch = useCallback(( newState ) => {
        const finalState = (typeof newState == 'function') ? newState(formData) : {...formData, ...newState};
        dispatcher(setformData(finalState));
    }, [formData])

    return [{
        ...formData,
        sameAsSpouse: formData?.sameAsSpouse ?? defaultSameAsSpouse
    }, formDispatch];
}