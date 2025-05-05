
import React, { useState, useEffect, useRef } from "react";
import { fetchCountryCode, updateCountryCodeList } from "../../Redux/Reducers/apiSlice";
import Select from 'react-select';
import { useAppSelector, useAppDispatch } from "../../Hooks/useRedux";
import { selectApi } from "../../Redux/Store/selectors";
import konsole from "../../../components/control/Konsole";
import { CustomSelect } from "../CustomComponent";
import { $AHelper } from "../../Helper/$AHelper";

const ContactRezex = (props) => {
  const inputCard = useRef();
  const apiData = useAppSelector(selectApi);
  const dispatch = useAppDispatch();
  const { countryCode } = apiData;
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const startingTabIndex = props?.startTabIndex ?? 0;


  useEffect(() => {
    const fetchApi = async () => {
      if (countryCode.length === 0) {
        const result = await dispatch(fetchCountryCode());
        dispatch(updateCountryCodeList(result.payload));
      }
    };
    fetchApi();

  }, [dispatch, countryCode.length])

  const countDigit = ( stringValue ) => {
    return stringValue?.match(/\d/g)?.length ?? 0;
  }

  function getSubStringPosition(string, subString, index) {
    return string?.split(subString, index)?.join('0')?.length;
  }

  const handleChange = ( directCallFromInput ) => {
    const curCursorPosition = inputCard.current.selectionStart;
    const digitCountBeforeCursor = countDigit(inputCard.current?.value?.substr(0, curCursorPosition));
    
    const cardValue = inputCard.current.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

    inputCard.current.value = !cardValue[2]
      ? cardValue[1]
      : `(${cardValue[1]}) ${cardValue[2]}${`${cardValue[3] ? `-${cardValue[3]}` : ""
      }`}${`${cardValue[4] ? `-${cardValue[4]}` : ""}`}`;
    const numbers = inputCard.current.value.replace(/(\D)/g, "");
    // props.setValue(numbers);
    if (numbers.length == 10 && props?.mobileNumber !== numbers) {
      props?.hideErrMsg(`${"mobile"}Err`, props?.errMsg)
      props?.hideErrMsg(`${"mobile"}`, props?.errMsg)
      props?.hideErrMsg(`${"email"}Err`, props?.errMsg)
    }

    const curAllDigitCount = countDigit(inputCard.current?.value);
    if(curAllDigitCount == digitCountBeforeCursor) return;
    if(directCallFromInput && (digitCountBeforeCursor < curAllDigitCount)) {
      let newCursorPosition = getSubStringPosition(inputCard.current.value, /\d/g, digitCountBeforeCursor) + (curAllDigitCount <= 3 && digitCountBeforeCursor == 0 ? 0 : 1);
      inputCard?.current.setSelectionRange(newCursorPosition, newCursorPosition);
    } else {
      inputCard?.current.setSelectionRange(curCursorPosition, curCursorPosition);
    }
  };

  useEffect(() => {
    inputCard.current.value = props?.mobileNumber
    handleChange()
   
  }, [props?.mobileNumber]);


  const handleChangeCode = (e) => {
    props?.setcountryCode(e.value)
  }
 
  const countryOptions = $AHelper.$sortCountryfromArray(countryCode);
  const data = countryOptions.filter((ele)=>ele?.value == props?.countryCode )
  const customStyles = (isDisable) => ({
    control: (provided, state) => ({
      ...provided,
      cursor: isDisable ? 'not-allowed' : 'pointer',  // Force cursor change
      pointerEvents: isDisable ? 0.5 : 1,  // Optional: Adjust opacity for disabled state
      backgroundColor: isDisable ? '#f2f2f2' : 'white',
      border: "none", // Remove border
      width: "11rem",
      boxShadow: "none", // Remove the default box shadow
    }),
    option: (provided) => ({
      ...provided,
      cursor: 'pointer',
    })
  });

  const handleKeyDown = (event) => {
    if (event.key == "Enter") {
        setMenuIsOpen(true);
    }
  };

  const handleMenuClose = () => {
    setMenuIsOpen(false); 
  };

 
  return (
    <>
      <div  className=''>
        <label className='phoneNumberLable'>Phone Number{props?.isMandatory == true ? '*' : ''}</label>
   
       
        <div class={`${"phone-number-input"} ${props.isPersonalMedical ? "full-width" : ""}`} style={{ cursor: props?.isDisable ? 'not-allowed' : 'pointer' }}>
          <Select className="country-select"
            onChange={(e) => handleChangeCode(e)}
            value={data.length > 0 ? data[0] :""}
            options={countryOptions}
            isSearchable={!props?.isDisable} // Disable search if `isDisable` is true
            styles={customStyles(props?.isDisable)} // Pass `isDisable` to styles
            tabIndex={startingTabIndex + 1}
            menuIsOpen={menuIsOpen} 
            onMenuClose={handleMenuClose}
            onKeyDown={handleKeyDown}
            onMenuOpen={() => setMenuIsOpen(true)}
            onClick={() => {setMenuIsOpen(true)}}
            isDisabled={props?.isDisable}
          />
          {/* <div class="d-none d-lg-block country-code country-codeOnly">
          <select 
            value={props?.countryCode} 
            onChange={(e) => handleChangeCode(e)} 
            className="form-select"
            isSearchable
          >
            {$AHelper.$sortCountryfromArray(countryCode)?.map((item, index) => (
              <option className="text-start" key={index} value={item.value}>
                &nbsp;{item.label}
              </option>
            ))}
          </select>
           

          </div> */}
          {/* <div class="d-block d-lg-none country-code country-codeOnly">
          <select 
            value={props?.countryCode} 
            onChange={(e) => handleChangeCode(e.target.value)} 
            className="form-select"
            isSearchable
          >
            {$AHelper.$sortCountryfromArray(countryCode)?.map((item, index) => (
              <option className="text-start" key={index} value={item.value}>
                {item.value}
              </option>
            ))}
          </select>
          </div> */}
          <div className={`${props?.hideCommType == true ? 'w-100' : ''} `}>
          <input
            type="text"
            tabIndex={startingTabIndex + 2}
            ref={inputCard}
            onChange={() => handleChange(true)}
            onBlur={() => {
              const numbers = inputCard.current.value.replace(/(\D)/g, "");
              props.setValue(numbers);
            }}
            className=""
            id="phoneNumber"
            placeholder='(555) 000-0000'
            disabled={props?.isDisable}
            style={props?.isDisable ? { cursor: 'not-allowed' } : undefined}
          />
          </div>
          {(props?.hideCommType == true) ? "" : <div class="country-code" style={{borderLeft:'1px solid #aeaeae'}}>
            <select value={props?.comeTypes} onChange={(e) => props?.handleSelectChange(e.target, 'comeType')}>
              {props.comType?.map((item, index) => { return (<option className="text-start"  key={index} value={item.value}>&nbsp;&nbsp;{item.label}</option>) })}
            </select>
          </div>}
        </div>
      </div>
    </>
  );
};

export default ContactRezex;