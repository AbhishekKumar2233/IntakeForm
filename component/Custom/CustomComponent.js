import React, { memo, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { $AHelper } from "../Helper/$AHelper";
import konsole from "../../components/control/Konsole";
import { Col, Form, Row } from "react-bootstrap";
import { removeSpaceAtStart } from "../../components/Reusable/ReusableCom";
import CurrencyInput from "react-currency-input-field";
// Memoizing CustomInput component
export const CustomInput = memo((props) => {
    const { label, type, value, id, onChange, placeholder, isError, isDisable, notCapital, tabIndex,isSmall, isPersonalMedical, othersCategoryId, isChildOther, refrencePage, customStyle, autoFocus} = props;
    const inputRef = useRef(null);

      konsole.log("otheraaa",props.isMedicalSupl)

    const handleBlur = (e) => {
        if (props?.onBlur) {
            props?.onBlur(e)
        }

        if (id != 'ageOfRetirement' && id != 'monthlyIncome') {
            if (!value || (type && type != 'text')) return;
            // let finalValue = (isSmall == true) ? value : (notCapital == true ? $AHelper.$capitalizeFirstLetter(value) : $AHelper.$isUpperCase(value))
            const finalValue = value;
            if (!isSmall && notCapital !== true && label != "Matter No." && label != "Email"  && label != "Website") {
                finalValue = $AHelper?.capitalizeFirstLetterFirstWord(value);
            }
            onChange(finalValue, id)
        }};

    const handleChange = (e) => {
        const inputElement = inputRef?.current;
        const cursorPosition = inputElement?.selectionStart; 
        
            let updatedValue = e?.target?.value;
            if (label !== "Matter No." && label !== "Email" && label != "Website" &&  notCapital !== true && isSmall !== false ){
                updatedValue = $AHelper?.capitalizeFirstLetterFirstWord(removeSpaceAtStart(updatedValue));
            }
        
        onChange(updatedValue, id);

        setTimeout(() => {
            if (inputElement) {
                    inputElement?.classList?.add("customNewCss");
                inputElement?.setSelectionRange(cursorPosition, cursorPosition);
        }
        }, 0);
    }

    const max = props.max ? props.max : 100000000000
    konsole.log("aaaavaluevalue", value)

    const baseClassName = 'custom-input-field';
    const errorClass = isError ? 'error-msg-focus' : '';
    const fullWidthClass = (isPersonalMedical && (
        [27, 28, 38, 3, 12, 23, 33, 32, 30, 31, 35, 34, 15].includes(othersCategoryId) ||
        isChildOther ||
        ['AddFiduciaryBeneficiary', 'EditFiduciaryBeneficiary'].includes(refrencePage)
    )) ? '' : (isPersonalMedical ? 'full-width' : '');

    const inputClass = ['customNewCss'];
    if (notCapital) inputClass.push('text-first-word-first-capital');
    const finalClass = inputClass.join(' ');

    return (
        <>
            <div id="custom-input-field" className={`${baseClassName} ${errorClass} ${fullWidthClass}`} style={customStyle}>
                {$AHelper.$isNotNullUndefine(label) && <p>{label}</p>}
                <input
                    ref={inputRef}
                    // className={`${(!value ||isSmall) ? 'customNewCss' : notCapital ? 'text-first-capital' : 'text-all-capital'}`}
                    className={finalClass}
                    tabIndex={tabIndex}
                    placeholder={placeholder ?? ''}
                    id={id}
                    // value={$AHelper.$isNotNullUndefine(value) ?((isSmall==true)?value: (notCapital == true ? $AHelper.$capitalizeFirstLetter( value) : $AHelper.$isUpperCase(value))) : ''}
                    // value={value}
                    value={value || ''}
                    // onChange={(e) => {
                    //     e.target.value = $AHelper.$isUpperCase(e.target.value);
                    //     onChange(e.target.value, id)
                    // }}
                    // onChange={(e) => onChange(removeSpaceAtStart(e.target.value), id)}
                    onChange={(e)=>handleChange(e)}
                    type={type ?? 'text'}
                    onBlur={(e) => handleBlur(e)}
                    disabled={isDisable}
                    style={isDisable ? { backgroundColor: "rgb(185, 183, 183)", opacity: "0.5", cursor: 'not-allowed' } : undefined}
                    maxLength={max}
                    autoFocus={autoFocus}
                />
            </div>
            {$AHelper.$isNotNullUndefine(isError) && !['MonthlyExpenses','NonMonthlyExpenses'].includes(refrencePage) && <span className="err-msg-show">{isError}</span>}

        </>
    );
});

export const CustomFootInput = memo((props) => {
    const { label, type, value, id, onChange, placeholder, isError, isDisable, tabIndex } = props;
    konsole.log("aaaavaluevalue", value)
    return (
        <>
            <div>
                {$AHelper.$isNotNullUndefine(label) && <p className="foot-label">{label}</p>}
                <div id='custom-foot-field' className={isError ? "custom-foot-field error-msg-focus" : "custom-foot-field"}   >
                    <div>
                        <span>ft</span>
                    </div>
                    <div>
                        <input
                            tabIndex={tabIndex}
                            className={`text-first-capital`}
                            placeholder={placeholder ?? ''}
                            id={id}
                            value={$AHelper.$isNotNullUndefine(value) ? (props?.notCapital == true) ? value : $AHelper.$isUpperCase(value) : ''}
                            onChange={(e) => onChange(e.target.value, id)}
                            type={type ?? 'text'}
                            disabled={isDisable}
                        />
                    </div>
                </div>
            </div>
            {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show">{isError}</span>}

        </>
    );
});

export const CustomInputSearch = memo(({ label, type, value, id, onChange, placeholder, isError }) => {
    return (
        <>
            <div id='custom-input-search' className={isError ? "custom-input-search error-msg-focus" : "custom-input-search"}>
                {$AHelper.$isNotNullUndefine(label) && <p>{label}</p>}
                <div className="input-container">
                    <img className="mt-0" src="/New/icons/searchIconF.svg" />
                    <input
                        placeholder={placeholder ?? ''}
                        id={id}
                        value={value}
                        onChange={(e) => onChange(removeSpaceAtStart(e.target.value), id)}
                        type={type ?? 'text'}
                    />
                </div>
            </div>
            {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show">{isError}</span>}

        </>
    );
});

export const CustomNumInput = memo(({ label, type, value, id, onChange, placeholder, isError, maxLength, tabIndex, onBlur }) => {
    let maxLengthVal = maxLength ? maxLength : 1000000;
    const handleBlur = (e) => {
        if (onBlur) {
            onBlur(e?.target?.value)
        }
    }

    return (
        <>
            <div id='custom-input-field' className={isError ? "custom-input-field error-msg-focus" : "custom-input-field"} >
                {$AHelper.$isNotNullUndefine(label) && <p className="pt-0">{label}</p>}
                <input
                    tabIndex={tabIndex}
                    placeholder={placeholder ?? ''}
                    id={id}
                    value={value}
                    onChange={(e) => onChange($AHelper.$isNumberRegex(e.target.value) || id == "drinks" ? e?.target?.value : "", id)}
                    type={type ?? 'text'}
                    maxLength={maxLengthVal}
                    onBlur={handleBlur}
                />
            </div>
            {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show">{isError}</span>}

        </>
    );
});

export const CustomInterestInput = memo(({ label, type, value, id, onChange, placeholder, isError, maxLength, tabIndex }) => {
    let maxLengthVal = maxLength ? maxLength : 2
    return (
        <>
            <div className={isError ? "custom-link-field error-msg-link" : "custom-link-field"}>
                {$AHelper.$isNotNullUndefine(label) && <p>{label}</p>}
                <div className="d-flex align-items-center">
                    <div className="prefixInterest" >%</div>
                    <input
                        tabIndex={tabIndex}
                        placeholder={placeholder ?? ''}
                        id={id}
                        value={value}
                        onChange={(e) => onChange($AHelper.$isNumberRegex(e.target.value) ? e?.target?.value : "", id)}
                        type={type ?? 'text'}
                        maxLength={maxLengthVal}
                    />
                </div>
            </div>
            {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show">{isError}</span>}

        </>
    );
});

export const CustomLinkInput = memo(({ label, type, value, id, onChange, placeholder, isError, tabIndex }) => {
    return (
        <>
            <div className={isError ? "custom-link-field error-msg-link" : "custom-link-field"} >
                {$AHelper.$isNotNullUndefine(label) && <p>{label}</p>}
                <div className="d-flex align-items-center" style={{ marginTop: '10px' }} >
                    <div className="prefix" >http://</div>
                    <input
                        tabIndex={tabIndex}
                        placeholder={placeholder ?? ''}
                        id={id}
                        value={value}
                        onChange={(e) => onChange(e?.target?.value, id)}
                        type={type ?? 'text'}
                    />
                </div>
            </div>
            {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show">{isError}</span>}

        </>
    );
});

export const CustomNumInput2 = memo(({ label, type, value, id, onChange, placeholder, isError, isDisable, tabIndex }) => {
    return (
        <>
            <div id='custom-input-field' className={isError ? "custom-input-field error-msg-focus" : "custom-input-field"}>
                {$AHelper.$isNotNullUndefine(label) && <p>{label}</p>}
                <input
                    tabIndex={tabIndex}
                    placeholder={placeholder ?? ''}
                    id={id}
                    value={value}
                    onChange={(e) => onChange($AHelper.$isNumberRegex(e.target.value) ? e?.target?.value : "", id)}
                    type={type ?? 'text'}
                    disabled={isDisable}
                />
            </div>
            {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show">{isError}</span>}

        </>
    );
});




export const CustomTextarea = memo(({ label, value, id, onChange, placeholder, rows, tabIndex, onHoverTitle }) => {
    const textareaRefs = useRef(null);
    const adjustHeight = () => {
        const textarea = textareaRefs?.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to auto
            textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height based on scrollHeight
        }
    };

    const handleChange = (e) => {
        const textarea = textareaRefs?.current;
        const cursorPosition = textarea?.selectionStart; 

        onChange(removeSpaceAtStart(e?.target?.value), id);

        setTimeout(() => {
            if (textarea) {
                textarea?.setSelectionRange(cursorPosition, cursorPosition);
                adjustHeight();
            }
        }, 0);
    };

    useEffect(() => {
        adjustHeight(); // Adjust height on value change
    }, [value]);
    return (
        <div id='custom-textarea-field' className="w-100 custom-textarea-field"
        // className="custom-input-field"
        >
            {$AHelper.$isNotNullUndefine(label) && <p className="pb-2" title={onHoverTitle} >{label}</p>}
            <textarea ref={textareaRefs}
                tabIndex={tabIndex}
                className="textareaStyling"
                style={{ textTransform: "none", width: "100%", resize: 'none', overflow: 'hidden' }}
                placeholder={placeholder ?? ''}
                id={id}
                value={$AHelper.$isNotNullUndefine(value) ? value :''}
                onChange={(e)=>handleChange(e)}
                rows={rows ?? 3}
            // cols={cols ?? ''}
            />
        </div>
    );
});

export const CustomTextareaObjective = memo(({ label, value, id, onChange, placeholder, rows, tabIndex, onHoverTitle }) => {
    const textareaRefs = useRef(null);
    const adjustHeight = () => {
        const textarea = textareaRefs?.current;
        if (textarea) {
            textarea.style.height = 'auto'; 
            textarea.style.height = `${textarea.scrollHeight}px`; 
        }
    };

    const handleChange = (e) => {
        const textarea = textareaRefs?.current;
        const cursorPosition = textarea?.selectionStart; 

        onChange(removeSpaceAtStart(e?.target?.value), id);

        setTimeout(() => {
            if (textarea) {
                textarea?.setSelectionRange(cursorPosition, cursorPosition);
                adjustHeight();
            }
        }, 0);
    };

    useEffect(() => {
        adjustHeight(); 
    }, [value]);
    return (
        <div id='custom-textarea-field' className="w-100 custom-textarea-field">
            {$AHelper.$isNotNullUndefine(label) && <p className="pb-2" title={onHoverTitle} >{label}</p>}
            <textarea ref={textareaRefs}
                tabIndex={tabIndex}
                className="textareaStylingObjective"
                style={{ textTransform: "none", width:"92%", resize: 'none', overflow: 'hidden' }}
                placeholder={placeholder ?? ''}
                id={id}
                value={$AHelper.$isNotNullUndefine(value) ? value :''}
                onChange={(e)=>handleChange(e)}
                rows={rows ?? 3}
            />
        </div>
    );
});


export const CustomTextarea2 = memo(({ label, value, id, onChange, placeholder, rows, tabIndex }) => {
    const textareaRef = useRef(null);
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to auto
            textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height based on scrollHeight
        }
    };

    const handleChange = (e) => {
        const textarea = textareaRef?.current;
        const cursorPosition = textarea?.selectionStart;

        onChange(e);

        setTimeout(() => {
            if (textarea) {
                textarea?.setSelectionRange(cursorPosition, cursorPosition);
                adjustHeight(); 
            }
        }, 0);
    };

    useEffect(() => {
        adjustHeight(); // Adjust height on value change
    }, [value]);

    return (
        <Col xs={12} md={6} xl={5}>
            <div id='custom-textarea-field' className="custom-textarea-field">
                {$AHelper.$isNotNullUndefine(label) && <p>{label}</p>}
                <textarea ref={textareaRef}
                    tabIndex={tabIndex}
                    className={"textareaStyling"}
                    style={{ resize: 'none', width: "100%", overflow: 'hidden' }}
                    placeholder={placeholder ?? ''}
                    id={id}
                    // value={value}
                    value={$AHelper.$isNotNullUndefine(value) ? value :''}
                    onChange={(e)=>handleChange(e)}
                    rows={rows}
                />
            </div>
        </Col>

    );
});
export const CustomTextareaForAddress = memo(({ onKeyDown, tabIndex, id, refnw, value, onChange, type,onBlur,placeholder, adjustAddressInputHeight }) => {
    const textareaRef = refnw;
    const adjustHeight = () => {
        const textarea = textareaRef?.current;
        if (textarea) {
            textarea.style.height = '44px'; // Reset height to auto
            textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height based on scrollHeight
        }
    };

    const handleChange = (e) => {
        onChange(e);     
        resetInputHeight()
    };

    useEffect(() => {
        resetInputHeight()
    }, [adjustAddressInputHeight, value]);

    const resetInputHeight =()=>{
        const textarea = textareaRef?.current;
        const cursorPosition = textarea?.selectionStart;

        setTimeout(() => {
            if (textarea) {
                textarea?.setSelectionRange(cursorPosition, cursorPosition);
                adjustHeight(); 
            }
        }, 0);

    }
    return (
        <Col xs={12} md={6} xl={5}>
            <div id='custom-textarea-field' className="custom-textarea-field">
                <textarea ref={textareaRef}
                    tabIndex={tabIndex}
                    className={"textareaStylings"}
                    style={{ resize: 'none', width:"100%", overflow: 'hidden', height:"44px"}}
                    placeholder={placeholder ?? ''}
                    id={id}
                    onKeyDown={onKeyDown}
                    type={type}
                    onBlur={onBlur}
                    value={$AHelper.$isNotNullUndefine(value) ? value :''}
                    onChange={(e)=>handleChange(e)}
                />
            </div>
        </Col>

    );
});

// const getLabel = (id, value, options, placeholder) => {
//     let label;
//     if (id === "liabilityTypeId" && value?.label) {
//         label = value?.label || placeholder;
//     } else {
//         const data = options?.find((ele) => ele?.value == value);
//         label = $AHelper.$isNotNullUndefine(data) ? data.label : placeholder;
//     } 
//     return label || placeholder;
// };


export const CustomSelect = memo(({ options, label, value, placeholder, onChange, name, isError, isDisable, tabIndex, id, isPersonalMedical, isNonMonthlyExpense }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [typedChars, setTypedChars] = useState("");
    const typingTimeout = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => { // TO SCROLL WHEN DROP DOWN OPENS HIDDEN
        isOpen && document?.getElementById('dropDownDivId')?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [isOpen])

    const toggleDropdown = useCallback(() => {
        setIsOpen((prev) => !prev);
        if (isOpen) {
            setHighlightedIndex(-1);
        }
    }, [isOpen]);

    const handleOptionClick = useCallback((option) => {
        onChange(option);
        setIsOpen(false);
        setHighlightedIndex(-1);
    }, [onChange]);

    const sortedOptions = useMemo(() => {
        return $AHelper.$sortOtherfromArray(options);
    }, [options]);

    const handleKeyDown = useCallback((event) => {
        if (isDisable) return;
        if (event?.key == "ArrowDown" || event?.key == "ArrowUp") {
            // if (isOpen) { 
            const direction = event?.key == "ArrowDown" ? 1 : -1;
            setHighlightedIndex((prev) => {
                let nextIndex = prev + direction;
                if (nextIndex < 0) nextIndex = 0;
                if (nextIndex >= sortedOptions?.length) nextIndex = sortedOptions?.length - 1;
                onChange(sortedOptions?.[nextIndex])
                    return nextIndex;
                });
                event?.preventDefault();
            // }
            } else if (event?.key == "Enter") {
            if (isOpen) {
                if (highlightedIndex >= 0 && sortedOptions?.[highlightedIndex]) {
                    handleOptionClick(sortedOptions?.[highlightedIndex]);
                }
            } else {
                setIsOpen(true);
            }
                event?.preventDefault();
            } else if (event?.key == "Tab") {
                if (highlightedIndex >= 0 && sortedOptions?.[highlightedIndex]) {
                    handleOptionClick(sortedOptions?.[highlightedIndex]);
                }
                setIsOpen(false);
            setHighlightedIndex(-1); 
            } else if (event?.key == "Escape") {
                setIsOpen(false);
            setHighlightedIndex(-1); 
                event.preventDefault();
             } else if (/^[a-zA-Z0-9]$/.test(event.key)) {
            // Type-to-select logic
            const newTyped = typedChars + event.key.toLowerCase();
            setTypedChars(newTyped);

            clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => {
                setTypedChars("");
            }, 500);

            const matchIndex = sortedOptions?.findIndex(ele =>
                ele?.label?.toLowerCase().startsWith(newTyped)
            );

            if (matchIndex !== -1) {
                setHighlightedIndex(matchIndex);
                onChange(sortedOptions?.[matchIndex]);
            }

            event.preventDefault();
        }
    }, [isDisable, isOpen, sortedOptions, highlightedIndex, handleOptionClick, typedChars, onChange]);

    useEffect(() => {
        return () => {
            clearTimeout(typingTimeout.current);
        };
    }, []);

    const getLabel = useCallback((id, value, options, placeholder) => {

        if (id == "liabilityTypeId" && value?.label) {
            return value?.label || placeholder;
        }
        if (highlightedIndex >= 0 && !isOpen) {
            return sortedOptions?.[highlightedIndex]?.label || placeholder;
        }
        // const selectedOption = options?.find((item) => item?.value == value);
        const selectedOption = Array.isArray(options) ? options.find((item) => item?.value == value) : undefined;
        return selectedOption ? selectedOption?.label : placeholder;
    }, [id, value, options, placeholder, highlightedIndex, isOpen, sortedOptions]);


    const handleClickOutside = useCallback((event) => {
        if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);
    const renderedOptions = useMemo(() => {
        if (sortedOptions?.length > 0) {
            return (
                <>
                    {sortedOptions?.map((option, index) => (
                        <li key={index} onClick={() => handleOptionClick(option)}
                            // className={highlightedIndex == index ? "highlighted" : ""}
                            className={`${highlightedIndex === index ? "highlighted" : ""} ${/^(other)$/i.test(option.label) ? "otherValueName" : ""
                                }`}
                        >
                            {option?.label || placeholder}
                        </li>
                    ))}
                </>
            );
        } else {
            return <span className="text-center ps-3">Not available</span>;
        }
    }, [sortedOptions, handleOptionClick, highlightedIndex, placeholder]);

    return (

        <div ref={dropdownRef} className={`${$AHelper.$isNotNullUndefine(isError) ? "custom-select-field error-msg-focus" : "custom-select-field "} ${isPersonalMedical ? "full-width" : ""}`} onKeyDown={handleKeyDown} >
            {$AHelper.$isNotNullUndefine(label) && <p>{label}</p>}
            <div className={`${(isDisable == true) ? 'disabled-div-select' : ''} dropdown`} tabIndex={tabIndex}   >
                <div className={`${($AHelper.$isNotNullUndefine(value) && options?.find(item => item.value == value)?.label ? '' : '')} dropdown-selected`} onClick={toggleDropdown} >
                    <span style={{ fontWeight: "400" }}>{getLabel(id, value, options, placeholder)}</span>
                </div>
                <div className={`dropdown-icon ${isOpen ? 'dropdown-icon-bg' : ''}`} onClick={toggleDropdown} id={id} >
                    <img className="mt-0" src="/New/image/select-icon.png" alt="Dropdown icon" />
                </div>
            </div>
            {isOpen && (
                <ul id="dropDownDivId" className="dropdown-options" name={name} style={id == "closestRelative" ? { maxHeight: "200px", padding: '10px' } : isNonMonthlyExpense ? { maxHeight: "160px", padding: '10px', position: 'absolute', bottom: '0' } : { padding: '10px' }}>
                    {renderedOptions}
                </ul>
            )}

            {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show mt-1">{isError}</span>}

        </div>
    );
});

export const CustomSearchSelect = memo(({ id, options, label, value, placeholder, onChange, name, isError, isDisable, tabIndex }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [highlightedValue, setHighlightedValue] = useState(value);
    const dropdownRef = useRef(null); 
    const typedValueWhileClosedRef = useRef('');
    const typingTimeout = useRef(null);

    useEffect(() => { // TO SCROLL WHEN DROP DOWN OPENS HIDDEN
        isOpen && document?.getElementById('dropDownDivId')?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [isOpen]);

    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
        setHighlightedIndex(-1);
        setHighlightedValue(null);
    }, []);

    const handleOptionClick = useCallback((option) => {
        onChange(option);
        setHighlightedValue(option.value);
        setIsOpen(false);
        setSearchValue("");
        setHighlightedIndex(-1);
        setHighlightedValue(null);
    }, [onChange]);

    const filteredOptions = useMemo(() => {
        if (!searchValue) return $AHelper.$sortOtherfromArray(options);
        return options?.filter(option => 
            String(option?.label)?.toLowerCase()?.includes(searchValue?.toLowerCase())
        );
    }, [options, searchValue]);

      useEffect(() => {
        if (isOpen && searchValue && filteredOptions?.length > 0) {
            setHighlightedIndex(0);
            setHighlightedValue(filteredOptions[0]?.value);
        }
    }, [searchValue, filteredOptions, isOpen]);

    // konsole.log(onChange,"onChange",placeholder)

    // Memoizing options to avoid recalculating unless options change

    const handleKeyDown = useCallback((event) => {
        if (isDisable) return;

        if (event?.key == "ArrowDown" || event?.key == "ArrowUp") {
            const direction = event?.key == "ArrowDown" ? 1 : -1;
            setHighlightedIndex((prev) => {
                const nextIndex = (prev + direction + filteredOptions?.length) % filteredOptions?.length;
                setHighlightedValue(filteredOptions[nextIndex]?.value);
                return nextIndex;
            });

            if (!isOpen) {
                const nextIndex = (highlightedIndex + direction + filteredOptions?.length) % filteredOptions?.length;
                const nextOption = filteredOptions?.[nextIndex];
                setHighlightedValue(nextOption?.value);
                onChange(nextOption);
            }

            event?.preventDefault();
        } else if (event?.key == "Enter") {
            if (isOpen && highlightedIndex >= 0) {
                const selectedOption = filteredOptions[highlightedIndex];
                handleOptionClick(selectedOption);
            } else if (!isOpen) {
                setIsOpen(true);
            }
            event?.preventDefault();
        } else if (event?.key == "Escape") {
            setIsOpen(false);
            event?.preventDefault();
        } else if (!isOpen && event.key.length == 1) {
            typedValueWhileClosedRef.current += event.key.toLowerCase();

            const match = options.find(option =>
                option.label.toLowerCase().includes(typedValueWhileClosedRef.current)
            );

            if (match) {
                onChange(match);
                setHighlightedValue(match.value);
            }

            if (typingTimeout.current) {
                clearTimeout(typingTimeout.current);
            }

            typingTimeout.current = setTimeout(() => {
                typedValueWhileClosedRef.current = '';
            }, 1000);
        }
    }, [isDisable, isOpen, filteredOptions, highlightedIndex, handleOptionClick, onChange, options]);

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const renderedSearchOptions = useMemo(() => {
        if (filteredOptions?.length > 0) {
            return (
                <>
                    {filteredOptions?.map((option, index) => (
                        <li key={index} onClick={() => handleOptionClick(option)}
                            //  className={highlightedValue == option?.value ? "highlighted" : ""}
                            className={`${highlightedValue === option?.value ? "highlighted" : ""
                                } ${/^(other)$/i.test(option?.label) ? "otherValueName" : ""
                                }`}
                        >
                            {option?.label}
                        </li>
                    ))}
                </>
            );
        } else {
            return <span className="text-center ps-3">Not available</span>
        }
    }, [filteredOptions, handleOptionClick, highlightedValue]);

    return (
        <div ref={dropdownRef} className={$AHelper.$isNotNullUndefine(isError) ? "custom-select-field error-msg-focus" : "custom-select-field"} onKeyDown={handleKeyDown}>
            {$AHelper.$isNotNullUndefine(label) && <p>{label}</p>}
            <div className={`${(isDisable == true) ? 'disabled-div-select' : ''} dropdown`} tabIndex={tabIndex} >
                <div id={id} className={`${($AHelper.$isNotNullUndefine(value) && options?.find(item => item.value == value)?.label ? '' : '')} dropdown-selected`} onClick={toggleDropdown}>
                    {options?.find(item => item.value == value)?.label ?? <span style={{ color: "#767676", fontWeight: "400" }}> {placeholder}</span>}
                </div>
                <div className={`dropdown-icon ${isOpen ? 'dropdown-icon-bg' : ''}`} onClick={toggleDropdown}>
                    <img className="mt-0" src="/New/image/select-icon.png" alt="Dropdown icon" />
                </div>
            </div>
            {isOpen && (
                <ul className="dropdown-options" name={name}>
                    <div className="search-bg">
                        <div className="input-container-Search">
                            <img className="mt-0" src="/New/icons/searchIconF.svg" alt="Search icon" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                disabled={isDisable}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div id="dropDownDivId" className="drop_Options" style={{ padding: '0 10px' }}>
                        {renderedSearchOptions}
                    </div>
                </ul>

            )}

            {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show mt-1">{isError}</span>}

        </div>
    );
});


export const CustomMultipleSearchSelect = memo(({ id, options, label, isCategorized, selectedValues, placeholder, onChange, name, isError, isDisable, tabIndex, showOtherInput, otherInputValue, setOtherValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState({ category: -1, sub: -1 });
    const dropdownRef = useRef(null);
    const [subOpenStr, setsubOpenStr] = useState([]);

    konsole.log("asbjksvb", selectedValues)

    useEffect(() => { // TO SCROLL WHEN DROP DOWN OPENS HIDDEN
        isOpen && document?.getElementById('dropDownDivId')?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [isOpen, subOpenStr])

    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
        setHighlightedIndex({ category: -1, sub: -1 });
        if (isCategorized) setsubOpenStr(options?.map(ele => ele?.label) || []);
        else setsubOpenStr([]);
    }, [options]);

    const handleOptionClick = useCallback((_key, _value, _parent) => {
        konsole.log(_key, _value, _parent, "_key, _value, _parent")
        let newState;
        if (_key == 'reset') newState = {};
        else if (_parent) {
            newState = {
                ...selectedValues,
                [_parent]: {
                    ...selectedValues?.[_parent],
                    [_key]: _value,
                }
            }
        } else {
            newState = {
                ...selectedValues,
                [_key]: _value,
            }
        }
        onChange(newState);
    }, [onChange, selectedValues]);

    const handleSubOpen = (_label) => {
        konsole.log("sdvjkds", _label, subOpenStr, subOpenStr?.includes(_label), subOpenStr?.filter(ele => ele != _label), [...subOpenStr, _label]);
        if (subOpenStr?.includes(_label)) setsubOpenStr(subOpenStr?.filter(ele => ele != _label));
        else setsubOpenStr([...subOpenStr, _label]);
    }

    const handleKeyDown = useCallback(
        (event) => {
            if (!isOpen) {
                if (event.key == 'Enter') {
                    setIsOpen(true);
                    event.preventDefault();
                }
                return;
            }

            const flatOptions = isCategorized
                ? options?.flatMap((cat, catIndex) =>
                    subOpenStr?.includes(cat.label)
                        ? [{ category: catIndex, sub: -1 }, ...cat?.subCat?.map((_, subIndex) => ({ category: catIndex, sub: subIndex }))]
                        : [{ category: catIndex, sub: -1 }]
                )
                : options?.map((_, index) => ({ category: -1, sub: index }));

            const currentIndex = flatOptions?.findIndex(
                ({ category, sub }) => category == highlightedIndex?.category && sub == highlightedIndex?.sub
            );

            if (event.key == 'ArrowDown') {
                const nextIndex = (currentIndex + 1) % flatOptions?.length;
                setHighlightedIndex(flatOptions?.[nextIndex]);
                event.preventDefault();
            } else if (event.key == 'ArrowUp') {
                const prevIndex = (currentIndex - 1 + flatOptions?.length) % flatOptions?.length;
                setHighlightedIndex(flatOptions?.[prevIndex]);
                event?.preventDefault();
            } else if (event.key == 'Enter') {
                const { category, sub } = highlightedIndex;
                if (category !== -1 && sub == -1) {
                    const cat = options[category];
                    handleSubOpen(cat?.label);
                } else if (category !== -1 && sub !== -1) {
                    const cat = options?.[category];
                    const subCat = cat?.subCat[sub];
                    const checkBoxValue = selectedValues?.[cat.value]?.[subCat?.value];
                    handleOptionClick(subCat?.value, !checkBoxValue, cat?.value);
                } else if (category == -1 && sub !== -1) {
                    const option = options[sub];
                    const checkBoxValue = selectedValues?.[option?.value];
                    handleOptionClick(option?.value, !checkBoxValue);
                }
                event?.preventDefault();
            } else if (event.key == 'Escape') {
                setIsOpen(false);
                event?.preventDefault();
            }
        },
        [isOpen, options, highlightedIndex, subOpenStr, selectedValues, handleOptionClick, isCategorized]
    );

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef?.current && !dropdownRef?.current?.contains(event.target)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const filteredOptions = useMemo(() => {
        if (!searchValue) return options;
        // return options.filter(option => option.label.toLowerCase().includes(searchValue.toLowerCase()));
        if (isCategorized) {
            return options?.map(ele => ({
                ...ele,
                subCat: ele?.subCat?.filter(subEle => subEle?.label?.toLowerCase()?.includes(searchValue?.toLowerCase())),
            }))
        }
        return options?.filter(ele => ele.label?.toLowerCase()?.includes(searchValue?.toLowerCase()));
    }, [options, searchValue, isCategorized]);

    const renderedSearchOptions = useMemo(() => {
        if (filteredOptions?.length > 0) {
            if (isCategorized) {
                return (
                    <>
                        {
                            filteredOptions?.map((ele, index) => {
                                const isSubOpened = subOpenStr?.includes(ele?.label);
                                return (
                                    <div key={ele.label} className={`cate-multi-select ${isSubOpened ? 'sub-Open' : ''}`} >
                                        {index != 0 && <div className="bottom-border"></div>}
                                        <div className="section-opener d-flex justify-content-between cursor-pointer" onClick={() => handleSubOpen(ele.label)}>
                                            <div className="">
                                                {ele.label} ({ele?.subCat?.length})
                                            </div>
                                            <div>
                                                <img className={`mt-0 ${isSubOpened ? 'rotate-180d' : ''} `} src="/New/image/select-icon.png" alt="Dropdown icon" />
                                            </div>
                                        </div>
                                        {isSubOpened && (<div className="mb-2">
                                            {ele?.subCat?.map((subEle, subIndex) => {
                                                const checkBoxValue = selectedValues?.[ele.value]?.[subEle?.value];
                                                return (
                                                    <li key={subEle.label} onClick={() => handleOptionClick(subEle.value, !checkBoxValue, ele.value)}
                                                        //  className={highlightedIndex?.category == index && highlightedIndex?.sub == subIndex ? 'highlighted' : ''}
                                                        className={`${highlightedIndex?.category === index && highlightedIndex?.sub === subIndex
                                                                ? 'highlighted'
                                                                : ''
                                                            } ${/^(other)$/i.test(subEle?.label) ? 'otherValueName' : ''
                                                            }`}>
                                                        <div className="d-flex">
                                                            <input type="checkbox" className="me-2" checked={checkBoxValue} />
                                                            <div>
                                                                {subEle.label}
                                                            </div>
                                                        </div>
                                                    </li>)
                                            })}
                                        </div>)}
                                    </div>
                                )
                            })
                        }
                    </>
                )
            }
            return (
                <>
                    {filteredOptions?.map((option, index) => {
                        const checkBoxValue = selectedValues?.[option?.value];
                        return (
                            <li key={option?.value} onClick={() => handleOptionClick(option.value, !checkBoxValue)}
                                // className={highlightedIndex?.category == -1 && highlightedIndex.sub == index ? 'highlighted' : ''}
                                className={`${highlightedIndex?.category == -1 && highlightedIndex.sub == index ? 'highlighted' : ''
                                    } ${/^(other)$/i.test(option?.label) ? 'otherValueName' : ''
                                    }`}
                            >
                                <div className="d-flex w-100">
                                    <input type="checkbox" className="me-2" checked={checkBoxValue} />
                                    <div>
                                        {option.label}
                                    </div>
                                </div>
                                {(showOtherInput == true && option?.label == 'Other' && checkBoxValue == true) ? <div id="w-100-all-child" onClick={e => e.stopPropagation()} >
                                    <CustomInput autoFocus={true} onChange={e => setOtherValue?.(e)} value={otherInputValue} placeholder="Description" />
                                </div> : ''}
                            </li>
                        )
                    })}
                </>
            );
        } else {
            return <span className="text-center ps-3">Not available</span>
        }
    }, [filteredOptions, subOpenStr, handleOptionClick, highlightedIndex, selectedValues, isCategorized]);

    const curValue = useMemo(() => {
        if (isCategorized) return options?.map(ele => {
            const returnStr = '';
            const substr = ele?.subCat?.map(subEle => selectedValues?.[ele.value]?.[subEle?.value] ? subEle?.label : '')?.filter(str => str && str)?.join(', ');
            if (substr) return `${ele.label}(${substr})`
        })?.filter(str => str && str)?.join(', ');
        return options?.filter(item => selectedValues?.[item.value])?.map(ele => ele.label)?.join(', ')
    }, [selectedValues, options]);

    const selectCount = useMemo(() => {
        if (!selectedValues) return 0;
        let _selectedCount = 0;
        if (isCategorized) {
            Object.values(selectedValues)?.forEach(ele => ele && Object.values(ele)?.forEach(subEle => subEle && _selectedCount++));
        } else {
            Object.values(selectedValues)?.forEach(ele => ele && _selectedCount++);
        }
        return _selectedCount;
    }, [selectedValues])

    const isShowingErr = useMemo(() => $AHelper.$isNotNullUndefine(isError), [isError]);

    konsole.log("cxbzkjsdbkj", isError, isShowingErr)

    konsole.log('----- vtryuguvjh ----\n ', curValue, '|', filteredOptions, '|', searchValue, '|', selectedValues);

    return (
        <div ref={dropdownRef} className={isShowingErr ? "custom-select-field error-msg-focus" : "custom-select-field "} key={isError} onKeyDown={handleKeyDown}>
            {$AHelper.$isNotNullUndefine(label) && <p>{label}</p>}
            <div id={id} className={`${(isDisable == true) ? 'disabled-div-select' : ''} dropdown`} tabIndex={tabIndex}>
                <div className={`dropdown-selected`} onClick={toggleDropdown}>
                    <div className="d-flex justify-content-between">
                        <span className="text-truncate m-0 align-self-center" title={curValue} >{curValue || <span className="align-self-center" style={{ color: "#767676" }}>{placeholder}</span>}</span>
                        {curValue && <div className="custom-selected-count" onClick={toggleDropdown}>{selectCount} <span className="cursor-pointer" onClick={() => handleOptionClick('reset')} >&times;</span></div>}
                    </div>
                </div>
                <div className={`dropdown-icon ${isOpen ? 'dropdown-icon-bg' : ''}`} onClick={toggleDropdown} >
                    <img className={`mt-0 ${isOpen ? 'rotate-180d' : ''}`} src="/New/image/select-icon.png" alt="Dropdown icon" />
                </div>
            </div>
            {isOpen && (
                <ul id="dropDownDivId" className="dropdown-options multi-select w-75" name={name}>
                    <div className="search-bg">
                        <div className="input-container-Search">
                            <img className="mt-0" src="/New/icons/searchIconF.svg" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                autoFocus

                            />
                        </div>
                    </div>
                    <div className="drop_Options noHover">
                        {renderedSearchOptions}
                    </div>
                </ul>

            )}

            {isShowingErr && <span className="err-msg-show mt-1">{isError}</span>}

        </div>
    );
});


export const CustomRadio = memo(({ label, type, value, id, onChange, placeholder, options, isError, classType, isDisabled, tabIndex, defaultValue }) => {

    const noValue = { label: 'No', value: 'No' }
    const excludedLabels = ['Yes', 'Manually', 'Mail', 'Auto', 'Owned', 'Will'];
    const isExcludedLabel = (label) => excludedLabels.includes(label);

    function handleChange(item) {
        let chnageValue = (item?.value == value) ? null : item;
        konsole.log("onChangeitem", item, value)
        onChange(chnageValue)
    }

    function handleKeyDown(event, item) {
        if (event?.key == "Enter") {
            handleChange(item);
        }
    }
    return <>
        {/* <div className={$AHelper.$isNotNullUndefine(isError) ? " p-0 radio-container d-flex flex-column" : classType == 'vertical' ? "d-block pl-0  radio-container d-flex flex-column" : " p-0 radio-container d-flex flex-column"} id={id}> 
            <p className="">{placeholder}</p>
        {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show mb-2" style={{marginTop:'-6px'}}>{isError}</span>}
            <div  style={{maxWidth: "max-content"}} className={classType == "vertical" ? "d-flex p-0 flex-column" : "d-flex flex-column"} tabIndex={tabIndex}>
                {options?.map((item) => (
                    <label className="radio-label ms-2 b mb-0 mt-2">
                        <input className="me-2 " type="radio" value={item.value} onChange={() => onChange(item)} checked={item.value == value} disabled={isDisabled} />
                        <span className="custom-radio "></span>{item.label}
                    </label>
                ))}
            </div>
        </div>  */}
        <div className={$AHelper.$isNotNullUndefine(isError) ? "radio-container d-flex flex-column " : classType == 'vertical' ? "d-block radio-container flex-column" : "d-block ps-0 radio-container flex-column"}>
            <p className="mb-1 mt-1">{placeholder}</p>
            <div style={{ maxWidth: "max-content" }} className={classType == "vertical" ? "d-flex p-0 gap-1" : "d-flex gap-1 p-0"}  >
                {options?.map((item, index) => (
                    <label className={`radio-label mt-2 mb-0 custom-checkbox ${!isExcludedLabel(item.label) ? 'mx-2' : ''}`} key={item?.label} >
                        <input type="checkbox" onChange={() => handleChange(item)} defaultChecked={defaultValue} checked={item.value == value} disabled={isDisabled} />
                        <span tabIndex={tabIndex} onKeyDown={(e) => handleKeyDown(e, item)} className="checkmark"></span>
                        <p class="customCheckBox ms-2 mb-0">{item.label}</p>
                    </label>
                ))}
            </div>
        </div>
        {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show">{isError}</span>}


    </>

})

export const CustomRadioMultiChecked = memo(({ label, value, id, onChange, options, isDisabled , tabIndex, defaultValue, isError}) => {
    function handleChange(item) {
        let chnageValue = (item?.value == value) ? null : item;
        onChange(chnageValue)
    }

    function handleKeyDown(event, item) {
        if (event?.key == "Enter") {
            handleChange(item);
        }
    }

    return (
        <>
            <div className="radio-container d-flex flex-column">
                {options?.map((item) => (
                    <label class="radio-label mx-2 mt-2 mb-0 custom-checkbox" key={item?.label} >
                        <input type="checkbox" onChange={() => handleChange(item)} defaultChecked={defaultValue} checked={item.value == value} disabled={isDisabled} />
                        <span tabIndex={tabIndex} onKeyDown={(e) => handleKeyDown(e, item)} className="checkmark"></span>
                        <p class="customCheckBox ms-2 mb-0">{item.label}</p>
                    </label>
                ))}
            </div>
            {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show">{isError}</span>}
        </>
    );
});

export const CustomRadioSignal = memo(({ value, onChange, label, id, disabled, tabIndex }) => {

    const excludedLabels = ['Yes', 'Do Want', 'Burial',];
    const isExcludedLabel = (label) => excludedLabels.includes(label);

    const handleKeyDown = (e) => {
        if (e?.key == "Enter" && !disabled) {
            onChange({ target: { checked: !value } });
        }
    };

    return <>
        <label style={{ maxWidth: "max-content" }} className={`${disabled == true ? 'meta-disabled-radio' : ''} radio-label ${!isExcludedLabel(label) ? 'mx-2' : ''} custom-checkbox`} >
            {/* <input className="me-2" type="radio" id={id} value={value} onChange={(e) => onChange(e)} disabled={disabled == true} checked={value} /> */}
            {/* <span className="custom-radio"></span>{label} */}
            <input className="me-2" type="checkbox" id={id} value={value} onChange={(e) => onChange(e)} disabled={disabled == true} checked={value} />
            <span tabIndex={tabIndex} onKeyDown={handleKeyDown} class="checkmark" role="checkbox" aria-checked={value}></span>
            <p className="customCheckBox ms-2 me-2">{label}</p>
        </label>
    </>
})

export const CustomRadioGuidance = memo(({ value, onChange, label, id, disabled }) => {
    return <>
        <label style={{ maxWidth: "max-content" }} className={`${disabled == true ? 'meta-disabled-radio' : ''}  radio-label mx-2 c`}   >
            <input className="me-2" type="radio" id={id} value={value} onChange={(e) => onChange(e)} disabled={disabled == true} checked={value} />
            <span className="custom-radio"></span>{label}
        </label>
    </>
})


export const CustomRadioAndCheckBox = memo(({ placeholderConstant, label, type, value, id, onChange, placeholder, options, isError, classType, tabIndex }) => {

    function handleChange(e, item, index) {
        let chnageValue = (item.response == value?.[0]?.response) ? null : item;
        // konsole.log("CustomRadioAndCheckBoxonChangeitem",item,value,chnageValue)
        // konsole.log("itemresponse",item.response , value?.[0]?.response
        onChange(e, chnageValue, index)
    }

    function handleKeyDown(e, item, index) {
        if (e.key == "Enter") {
            let chnageValue = (item.response == value?.[0]?.response) ? null : item;
            onChange(e, chnageValue, index);
        }
    }
    return <>
        <div className={$AHelper.$isNotNullUndefine(isError) ? "radio-container d-flex flex-column " : classType == 'vertical' ? "d-block radio-container flex-column" : "radio-container flex-column mt-0"}>
            <p className="mb-1">{placeholder}</p>
            <div style={{ maxWidth: "max-content" }} className={classType == "vertical" ? "d-flex flex-wrap gap-1 p-0" : "d-flex flex-wrap gap-1"} >
                {options?.map((item, index) => (
                    <label key={index} className={`radio-label mt-2 mb-2 ${(item.response !== "Yes" && item.response !== "Mortgage") ? "mx-2" : ""} ${placeholderConstant === "showCheckboxDesign" ? "" : "custom-checkbox"}`}>
                        <input className="" type={type} checked={item?.checked == true ? true : false} onChange={(e) => handleChange(e, item, index)} />
                        {placeholderConstant == "showCheckboxDesign" ?
                            <> <span onKeyDown={(e) => handleKeyDown(e, item, index)} tabIndex={tabIndex} className={type == "checkbox" ? "customCheckBox ms-2" : "custom-radio"}></span>{item.response}</> : <>
                                <span onKeyDown={(e) => handleKeyDown(e, item, index)} tabIndex={tabIndex} className={type == "checkbox" ? "customCheckBox ms-0 checkmark" : "custom-radio"}></span>
                                <p className="customCheckBox ms-2 mb-0">{item.response}</p>
                            </>}
                    </label>
                ))}
            </div>
        </div>
        {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show">{isError}</span>}
    </>

})

export const CustomCheckBox = (props) => {

    const { label, name, id, onChange, value, isError, hideLabel, isDisabled, tabIndex } = props;

    const handleKeyDown = (event) => {
        if (event?.key == "Enter" && !isDisabled) {
            onChange({ target: { name, checked: !value } });
        }
    };

    konsole.log("valuevaluevaluevaluevaluevalue", value, isError)
    return <>

        <Form.Check type="checkbox" id='custom-checkbox-setup ' className={`custom-checkbox-setup ${hideLabel ? 'no-margin' : ''}`}>
            <Form.Check.Input className="checkboxFocus" tabIndex={tabIndex} onKeyDown={handleKeyDown} type="checkbox" name={name} id={id} checked={value} onChange={onChange} disabled={isDisabled} />
            {!hideLabel && <Form.Check.Label htmlFor={label}>{label}</Form.Check.Label>}
        </Form.Check>
        {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show">{isError}</span>}
    </>
}

export const CustomCheckBoxForCopyToSpouseData = memo(({ label, type, value, id, onChange, placeholder, options, isError, classType, tabIndex }) => {

    const handleKeyDown = (e) => {
        if (e?.key == "Enter") {
            onChange({ target: { checked: !value } });
        }
    };

    return <>
        <div className={$AHelper.$isNotNullUndefine(isError) ? "radio-container error-msg-focus" : classType == 'vertical' ? "d-block radio-container" : "radio-container align-items-center"}>
            <p>{placeholder}</p>
            <div className={classType == "vertical" ? "d-flex  p-0 " : "d-flex align-items-center"}>
                <label className={"radio-label m-2 e"}>
                    <input onKeyDown={handleKeyDown} tabIndex={tabIndex} className="me-2 aspectRatio1" type={type} checked={value} onChange={(e) => onChange(e)}/>
                    {/* <span className={type == "checkbox" ? "" : "custom-radio"}></span>{item.response} */}
                </label>
            </div>
        </div>
        {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show">{isError}</span>}
    </>
})



export const CustomCurrencyInput = ({ id, label, value, onChange, onBlur, isError, tabIndex, placeholder, style, disabled, isPersonalMedical, isDecimal = true }) => {

    const enterValue = value ? $AHelper.$formatNumberToUS(Number(value)) : '';
    const handleChange = (e) => {

        if (isDecimal != true) {
            const rawValue = e.target.value.replace(/,/g, '');
            const formattedValue = $AHelper.$formatNumberToUS(Number(rawValue));
            if ($AHelper.$isNumberWithCommas(formattedValue) || rawValue === '') {
                onChange(rawValue, id);
            }
        } else {
            onChange(e, id);
        }
    };

    return <div style={style}>
        <div className={'Custom-Currency-Box'}>
            {label && <label className='Custom-Currency-label'>{label}</label>}
            <div id={id} class={`phone-number-input ${isError ? 'error-msg-focus-div' : ''} ${isPersonalMedical ? "full-width" : ""}`}>
                <span>$</span>
                {(isDecimal !== true) ?
                    <input
                        tabIndex={tabIndex}
                        type="text"
                        className=""
                        placeholder={placeholder ?? "0.00"}
                        value={enterValue}
                        // onChange={(e) => onChange($AHelper.$isNumberRegex(e.target.value) ? e.target.value : "", id)}
                        onChange={(e) => handleChange(e, id)}
                        onBlur={onBlur}
                        maxLength={21}
                        disabled={disabled === true}
                    /> :
                    <CurrencyInput
                        tabIndex={tabIndex}
                        className="input"
                        placeholder={placeholder ?? "0.00"}
                        allowNegativeValue={false}
                        onValueChange={(value) => handleChange(value, id)}
                        value={(value == '0.00' || !value) ? '' : value}
                        allowDecimals={true}
                        onBlur={onBlur}
                        maxLength={21}
                        disabled={disabled === true}
                    />}

                {/* <div class="country-code">
                    <select value={1}  >
                        {[{ value: 1, label: "USD" }]?.map((item, index) => { return (<option key={index} value={item.value}>{item.label}</option>) })}
                    </select>
                </div> */}

            </div>


        </div>
        {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show">{isError}</span>}

    </div>
}
export const CustomCurrencyInput2 = ({ id, label, value, onChange, onBlur }) => {
    const enterValue = value ? value : '';
    return (
        <div className='Custom-Currency-Box'>
            <label className='Custom-Currency-label'>{label}</label>
            <div className="phone-number-input">
                <span>$</span>
                <input
                    type="text"
                    className=""
                    id={id}
                    placeholder='0.00'
                    value={enterValue}
                    onChange={(e) => onChange($AHelper.$isNumberRegex(e.target.value) ? e.target.value : "", id)}
                    onBlur={onBlur} // Call the onBlur prop
                />
                {/* <div className="country-code">
            <select value={1}>
              {[{ value: 1, label: "USD" }].map((item, index) => (
                <option key={index} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div> */}
            </div>
        </div>
    );
};

export const CustomPercentageInput = ({ id, label, value, onChange, isPersonalMedical, tabIndex }) => {
    const enterValue = value ? value : '';

    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9.]/g, '');
        if (rawValue === '' || /^(100|(\d{1,2})(\.\d{0,2})?)$/.test(rawValue)) {
            onChange(rawValue, id);
        }
    };

    return (
        <div className='Custom-Currency-Box'>
            {label && <label className='Custom-Currency-label'>{label}</label>}
            <div className={`${"phone-number-input "}${isPersonalMedical ? "full-width" : ""}`}>
                <input
                    tabIndex={tabIndex}
                    type="text"
                    className="form-control form-control-percentage"
                    id={id}
                    placeholder='00'
                    value={enterValue?.toString()?.trim()}
                    onChange={(e) => handleChange(e, id)}
                />
                <span>%</span>
            </div>
        </div>
    );
}

export const CustomRadioForMetadata = memo(({ label, type, value, id, onChange, placeholder, options, isError, classType, tabIndex }) => {

    function handleChange(item) {
        let changeValue = (item.responseId == value) ? null : item;
        onChange(changeValue)
    }

    function handleKeyPress(event, item) {
        if (event?.key == 'Enter') {
            handleChange(item);
        }
    }

    return <>
        <div className={$AHelper.$isNotNullUndefine(isError) ? "radio-container mt-0 error-msg-focus d-flex flex-column" : classType == 'vertical' ? "d-block radio-container mt-0 flex-column" : "radio-container mt-0 flex-column"}>
            <p className="fw-bold mb-2">{placeholder}</p>
            <div style={{ maxWidth: "max-content" }} className={classType == "vertical" ? "d-flex gap-1 p-0 " : "d-flex gap-1 p-0"}>
                {options?.map((item) => (
                    <label className={`radio-label custom-checkbox ${item.response !== "Yes" ? "mx-2" : ' '}`}>
                        <input className="me-2" type="checkbox" value={item.responseId} onChange={() => handleChange(item)} checked={item.responseId === value} />
                        <span onKeyDown={(event) => handleKeyPress(event, item)} tabIndex={tabIndex} class="checkmark"></span>
                        <p className="customCheckBox ms-2">{item.response}</p>
                    </label>
                ))}
            </div>
        </div>
        {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show">{isError}</span>}
    </>

})

export const CustomMultipleSelect = memo(({ options, label, selectedValues, placeholder, onChange, name, isError, isDisable, tabIndex, id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document?.getElementById('dropDownDivId')?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [isOpen]);

    const toggleDropdown = useCallback(() => setIsOpen(prev => !prev), []);

    const handleOptionClick = useCallback((option, type) => {
        const isSelected = selectedValues?.some((selected) => selected.value === option.value);

        let newSelectedValues = selectedValues ? [...selectedValues] : [];
        if (type == 'delete') {
            newSelectedValues = newSelectedValues.filter((selected) => selected.value !== option.value);
        } else if (isSelected) {
            newSelectedValues = newSelectedValues;
        } else {
            newSelectedValues.push(option);
        }
        onChange(newSelectedValues); // Ensure this is always an array of objects
    }, [onChange, selectedValues]);

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const renderedOptions = useMemo(() => {
        if (options?.length > 0) {
            return (
                <>
                    {options.filter((e) => { return selectedValues.every((ele) => e.value != ele.value) })?.map((option, index) => {
                        const isSelected = selectedValues?.some((selected) => selected.value === option.value);
                        return (
                            <li key={index} onClick={() => handleOptionClick(option)} className={isSelected ? 'selected' : ''}>
                                {option.label}
                                {/* {isSelected && <span className="checkmark">✔</span>} */}
                            </li>
                        );
                    })}
                </>
            );
        } else {
            return <span className="text-center ps-3">Not available</span>
        }
    }, [options, selectedValues, handleOptionClick]);

    const selectedLabels = selectedValues?.map((val) => (<div className="selected-card">{val.label}<button className="d-flex align-items-center" onClick={() => handleOptionClick(val, 'delete')}><img width='15px' src='/icons/x-close.svg' /></button></div>))

    return (
        <div ref={dropdownRef} className={isError ? "custom-select-field error-msg-focus h-100" : "custom-select-field h-100"}>
            {label && <p>{label}</p>}
            <div className={`${isDisable ? 'disabled-div-select' : ''} dropdown h-100`}>
                <div className={`dropdown-selected h-100 ${selectedLabels ? '' : ''}`} tabIndex={tabIndex} onClick={toggleDropdown}>
                    <div className="d-flex flex-wrap gap-2 h-100">{selectedLabels.length > 0 ? selectedLabels : <span style={{ color: "#767676", fontWeight: "400" }}>{placeholder}</span>}</div>
                    {/* {selectedLabels || <span style={{ color: "#767676", fontWeight: "400" }}>{placeholder}</span>} */}
                </div>
                <div className={`dropdown-icon ${isOpen ? 'dropdown-icon-bg' : ''}`} onClick={toggleDropdown} id={id}>
                    <img className="mt-0 h-100" src="/New/image/select-icon.png" alt="Dropdown icon" />
                </div>
            </div>
            {isOpen && (
                <ul id="dropDownDivId" className="dropdown-options" name={name} style={{ padding: '10px', top: '100%' }}>
                    {renderedOptions}
                </ul>
            )}
            {isError && <span className="err-msg-show mt-1">{isError}</span>}
        </div>
    );
});

export const getRandomColor = () => {
    const letters = '01234567'; 
    const blueLetters = '89ABCDEF';  
    let color = '#';
    for (let i = 0; i < 2; i++) {
        color += letters[Math.floor(Math.random() * letters.length)]; 
    }
    for (let i = 0; i < 2; i++) {
        color += letters[Math.floor(Math.random() * letters.length)]; 
    }
    for (let i = 0; i < 2; i++) {
        color += blueLetters[Math.floor(Math.random() * blueLetters.length)]; 
    }
    return color;
      }
      
    export const getUserColor = (userName) => {
        let userColors = JSON.parse(localStorage.getItem('userColors')) || {};
    
        if (!userColors[userName]) {
            userColors[userName] = getRandomColor();
            localStorage.setItem('userColors', JSON.stringify(userColors));
        }
    
        return userColors[userName];
    }


// export const CustomMultipleSelect = memo(({ options, label, selectedValues, placeholder, onChange, name, isError, isDisable, tabIndex, id }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef = useRef(null);

//     useEffect(() => { 
//         isOpen && document?.getElementById('dropDownDivId')?.scrollIntoView({ behavior: "smooth", block: "nearest" });
//     }, [isOpen]);

//     const toggleDropdown = useCallback(() => setIsOpen(prev => !prev), []);

//     // const handleOptionClick = useCallback((option) => {
//     //     const isSelected = selectedValues?.some((selected) => selected.value === option.value);

//     //     let newSelectedValues;
//     //     if (isSelected) {
//     //         newSelectedValues = selectedValues.filter((selected) => selected.value !== option.value);
//     //     } else {
//     //         newSelectedValues = [...selectedValues, option];
//     //     }
//     //     onChange(newSelectedValues);
//     // }, [onChange, selectedValues]);

//     const handleOptionClick = useCallback((option) => {
//         const isSelected = selectedValues?.some((selected) => selected.value === option.value);

//         let newSelectedValues = selectedValues ? [...selectedValues] : [];
//         if (isSelected) {
//             newSelectedValues = newSelectedValues.filter((selected) => selected.value !== option.value);
//         } else {
//             newSelectedValues.push(option);
//         }
//         onChange(newSelectedValues); // Ensure this is always an array
//     }, [onChange, selectedValues]);


//     const handleClickOutside = useCallback((event) => {
//         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//             setIsOpen(false);
//         }
//     }, []);

//     useEffect(() => {
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [handleClickOutside]);

//     const renderedOptions = useMemo(() => {
//         if (options?.length > 0) {
//             return (
//                 <>
//                     {options.map((option, index) => {
//                         const isSelected = selectedValues?.some((selected) => selected.value === option.value);
//                         return (
//                             <li key={index} onClick={() => handleOptionClick(option)} className={isSelected ? 'selected' : ''}>
//                                 {option?.label}
//                                 {isSelected && <span className="checkmark">✔</span>}
//                             </li>
//                         );
//                     })}
//                 </>
//             );
//         } else {
//             return <span className="text-center ps-3">Not available</span>
//         }
//     }, [options, selectedValues, handleOptionClick]);

//     const selectedLabels = selectedValues?.map((val) => val.label).join(', ');

//     return (
//         <div ref={dropdownRef} className={$AHelper.$isNotNullUndefine(isError) ? "custom-select-field error-msg-focus" : "custom-select-field "} >
//             {$AHelper.$isNotNullUndefine(label) && <p>{label}</p>}
//             <div className={`${(isDisable == true) ? 'disabled-div-select' : ''} dropdown`} >
//                 <div className={`${selectedLabels ? '' : ''} dropdown-selected`} tabIndex={tabIndex} onClick={toggleDropdown}>
//                     {selectedLabels || <span style={{ color: "#767676", fontWeight: "400" }}> {placeholder}</span>}
//                 </div>
//                 <div className={`dropdown-icon ${isOpen ? 'dropdown-icon-bg' : ''}`} onClick={toggleDropdown} id={id} >
//                     <img className="mt-0" src="/New/image/select-icon.png" alt="Dropdown icon" />
//                 </div>
//             </div>
//             {isOpen && (
//                 <ul id="dropDownDivId" className="dropdown-options" name={name} style={{padding: '10px'}}>
//                     {renderedOptions}
//                 </ul>
//             )}

//             {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show mt-1">{isError}</span>}

//         </div>
//     );
// });


export const CustomNumInputPassword = memo(({ label, type, value, id, onChange, placeholder, isError, isDisable, tabIndex, handleToggle, inputUserType,onBlur }) => {
    const handleBlur = (e) => {
        if (onBlur) {
            onBlur(e?.target?.value)
        }
    }
    return (
        <>
        
             <div  className=" gapNoneAddAnother me-4">
                         <div className="yourPasswordHeading mb-1">{label}</div>
                         <div class=" d-flex passwordInputBorder">
                          <input type={inputUserType} name="oldpassword"placeholder={placeholder} value={value}
                          onChange={(e) => onChange(e?.target?.value, id)}
                          autoComplete="current-password"className="border-0 setInputFontSize"disabled={isDisable} onBlur={(e) => handleBlur(e)}/>
 
                             <span class="d-flex justify-around items-center cursor-pointer" onClick={()=>handleToggle()} >
                                 <img src={inputUserType == "password" ? "/icons/clarity_eye-hide-line.svg" : "/icons/clarity_eye-show-line.svg"} class="eyesSizeLisgnment" />
                             </span>
                         </div>
                        </div>     
                </>
    );
});
