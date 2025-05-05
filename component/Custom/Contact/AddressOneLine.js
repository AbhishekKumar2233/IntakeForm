import React, { useRef } from 'react'
import { removeSpaceAtStart } from '../../../components/Reusable/ReusableCom';
import { $AHelper } from '../../Helper/$AHelper';
import { initMapScript } from '../../../components/control/AHelper';
import konsole from '../../../components/control/Konsole';
import { CustomTextareaForAddress } from '../CustomComponent';
import { useAppSelector } from '../../Hooks/useRedux';
import { selectorLegal } from '../../Redux/Store/selectors';

const AddressOneLine = (props) => {

    const { tabIndex, value, placeholder, label, id, onChange, type, isError } = props;
    const inputSearchaddressRef = useRef(null)
    const startingTabIndex = props?.startTabIndex ?? 0;
    const legalApiData = useAppSelector(selectorLegal);
    const { adjustAddressInputHeight  } = legalApiData
    konsole.log(adjustAddressInputHeight,"adjustAddressInputHeightData")

    const handleBlur = () => {
        if (props.onBlur) {
            console.log("onblur")
        }
    }
    const onKeyEnter = (e) => {
        if (e && e.key === "Enter") {
            initMapScript().then(() => initAutoComplete());
            onChange(inputSearchaddressRef.current.value)
        }
    };

    const initAutoComplete = () => {
        if (!inputSearchaddressRef.current) return;
        const autocomplete = new window.google.maps.places.Autocomplete(inputSearchaddressRef.current);
        console.log("autocomplete", autocomplete)
        autocomplete.setFields(["address_component", "geometry"]);
        autocomplete.addListener("place_changed", () =>
            onChangeAddress(autocomplete)
        );
    };


    const onChangeAddress = (autocomplete) => {
        const place = autocomplete.getPlace();
        console.log("place", place);
    
        if (!place.address_components) return;
    
        let zip = '';
        place.address_components.forEach((component) => {
            if (component.types.includes("postal_code")) {
                zip = component.long_name;
            }
        });
    
        if (zip) {
            inputSearchaddressRef.current.value += `, ${zip}`;
        }
    
        onChange(inputSearchaddressRef.current.value);
    };
    const onhandleChangeAddress = (e) => {

        initMapScript().then(() => initAutoComplete());
        onChange(inputSearchaddressRef.current.value)
    }
    return (
        <>
            <div id='' className={`${isError ? "custom-input-field error-msg-focus" : "custom-input-field "}`}>
                {$AHelper.$isNotNullUndefine(label) && <p>{label}</p>}
                {/* <input
                    onKeyDown={(e) => onKeyEnter(e)}
                    tabIndex={startingTabIndex + 1}
                    placeholder={placeholder ?? ''}
                    id={id}
                    ref={inputSearchaddressRef}
                    value={value}
                    onChange={() => onhandleChangeAddress()}
                    type={type ?? 'text'}
                    onBlur={(e) => handleBlur(e)}
                /> */}
                   <CustomTextareaForAddress 
                    onKeyDown={(e) => onKeyEnter(e)}
                    tabIndex={startingTabIndex + 1} placeholder={placeholder ?? ''}
                    id={id}
                    refnw={inputSearchaddressRef}
                    value={value}
                    onChange={() => onhandleChangeAddress()}
                    type={type ?? 'text'}                    
                    onBlur={(e) => handleBlur(e)}
                    adjustAddressInputHeight={adjustAddressInputHeight}
                    />
            </div>
        </>
    )
}

export default AddressOneLine
