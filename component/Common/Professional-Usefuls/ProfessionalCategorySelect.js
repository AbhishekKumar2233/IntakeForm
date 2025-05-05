import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { profConstants } from "../../Helper/Constant";
import konsole from "../../../components/control/Konsole";
import { useProfFormState } from "../../Hooks/useProfessional";
import { focusInputBox } from "../../../components/Reusable/ReusableCom";
import { setisUserStartedEdit } from "../../Redux/Reducers/professionalSlice";
import { useAppDispatch, useAppSelector } from "../../Hooks/useRedux";
import { selectProfessional } from "../../Redux/Store/selectors";
import { Col } from "react-bootstrap";
import { $AHelper } from "../../Helper/$AHelper";

const ProfessionalCategorySelect = forwardRef((props, ref) => {
    const [selectedProSerDescIds, setselectedProSerDescIds] = useState([]);
    const [allowMultiSelect, setallowMultiSelect] = useState(false);
    const [formData, setFormData] = useProfFormState();
    const [err, setErr] = useState('');

    const dispatch = useAppDispatch();
    const { isUserStartedEdit } = useAppSelector(selectProfessional);

    konsole.log("asf useeffect", allowMultiSelect, props, props.editProfDetails?.allProCatList,selectedProSerDescIds);
    useEffect(() => {
        if($AHelper?.$isNotNullUndefine(props.editProfDetails?.allProCatList)){
            setInitialProSerDescs(props.editProfDetails?.allProCatList);
        }

        if(props?.formType == 'ADD'){
            setselectedProSerDescIds(oldState => [...oldState, '1']);
            setallowMultiSelect(false);
        }
        return () => dispatch(setisUserStartedEdit(false));
    }, [props.editProfDetails?.allProCatList])

    useEffect(() => {
        setFormData(({
            ...formData, 
            selectedProSerDescIds: selectedProSerDescIds?.sort((a, b) => a.localeCompare(b))?.map(ele => ({
                label: profConstants.category?.find(ele2 => ele2?.proSerDescId == ele)?.title, 
                value: ele,
                isChecked: true,
            }))
        }))
    }, [selectedProSerDescIds])

    useImperativeHandle(ref, () => ({
        validateSelection,
    }))

    const setInitialProSerDescs = ( newList ) => {
        if(!newList?.length) {
            const newSelectList = formData?.selectedProSerDescIds?.filter(ele => ele.isChecked)?.map(ele => ele.value) ?? [];
            setselectedProSerDescIds(newSelectList);
            setallowMultiSelect(newSelectList?.length > 1)
            return;
        }

        const listOfIds = [...new Set(newList?.map(ele => ele?.proSerDescId + ''))];
        konsole.log("asf initial state to set", listOfIds)
        setselectedProSerDescIds(listOfIds);
        setallowMultiSelect(listOfIds?.length > 1)
    }

    const handleSelect = ( proSerDescId, isChecked ) => {
        if(isUserStartedEdit != true) dispatch(setisUserStartedEdit(true));
        setErr('');
        konsole.log("Asf", proSerDescId, isChecked)
        if(allowMultiSelect != true) return setselectedProSerDescIds(isChecked ? [proSerDescId] : []);
        if(isChecked) setselectedProSerDescIds(oldState => [...oldState, proSerDescId]);
        else setselectedProSerDescIds(oldState => [...oldState.filter(ele => ele != proSerDescId)]); 
    }

    const validateSelection = () => {
        if(selectedProSerDescIds?.length > 0 == false) {
            setErr(profConstants.errorMsgs.proSerDescSelectErr)
            focusInputBox('prof-category')
            return false;
        }
        return true;
    }

    return (
        <>
        {props?.normalView == true ? <div className="prof-category-container" id='prof-category'>
            {profConstants.category?.map(ele => {
                const isSelected = selectedProSerDescIds?.includes(ele.proSerDescId);
                konsole.log("Asf--", selectedProSerDescIds[ele.proSerDescId], isSelected)

                return (
                <div key={ele.title} className={`category-box ${isSelected ? 'selected-box' : ''}`} onClick={() => handleSelect(ele.proSerDescId, isSelected == false)}>
                    {isSelected ? <img src={ele.ActiveImgSrc} alt={ele.title} />
                    : <img src={ele.imgSrc} alt={ele.title} />}
                    <p>{ele.title}</p>
                </div>)
                })
            }
            {err && <p className="err-msg-show w-100">{err}</p>}
        </div>
        :
        <Col className='CustomSubSideBarLinks-sidebar-col maxFullWidth'>
            {err && <p className="err-msg-show w-100 m-0 mb-2">{err}</p>}
            <div id='prof-category' className='CustomSubSideBarLinks-sidebar customLeftBorder'>

                {profConstants.category.map((item, index) => {
                    const isSelected = selectedProSerDescIds?.includes(item.proSerDescId);
                    return <>
                        <div className={`${isSelected ? 'active-nav-item-div' : ''} nav-item-div d-flex flex-column`}
                            key={index} >
                            <div style={{textAlign: 'left', width: '100%'}} >
                            {isSelected ? <img className='proSecDescICon' src={item.ActiveImgSrc} alt={item.title} onClick={() => handleSelect(item.proSerDescId, isSelected == false)} />
                    : <img className='proSecDescICon' src={item.imgSrc} alt={item.title} onClick={() => handleSelect(item.proSerDescId, isSelected == false)} />}
                    <span className='cursor-pointer' onClick={() => handleSelect(item.proSerDescId, isSelected == false)}>{item?.title}</span>
                            </div>
                        </div>
                    </>
                })}

            </div>
        </Col>}
        </>
    )
})

export default ProfessionalCategorySelect;