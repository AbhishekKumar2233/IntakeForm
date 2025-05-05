import React, { memo, useCallback, useState } from 'react';
import { debounce } from "lodash";



// @@ CUSTOM BUTTOn FOR ALL
export const CustomButton = memo((props) => {
    const { label, onClick, tabIndex, disabled} = props;
    const [isProcessing, setIsProcessing] = useState(false);

    const debouncedOnClick = useCallback(
        debounce(async (event) => {
            if (disabled || isProcessing) return;
            setIsProcessing(true);
            await onClick(event);
            setIsProcessing(false);
        }, 300),
        [disabled, isProcessing, onClick]);

    const handleClick = (event) => {
        if (event?.type == "keydown" && event?.key == "Enter") {
            event?.preventDefault(); 
            debouncedOnClick(event);
        }
        if (event?.type == "click") {
            debouncedOnClick(event) 
    }}

    return (
         <button tabIndex={tabIndex} disabled={disabled || isProcessing} className={`custom-button ${disabled || isProcessing ? 'disable-btn' : ''}`} onClick={handleClick} onKeyDown={handleClick}>
            {label}
        </button>
    );
});


// @@CUSTOM BTN with underline

export const CustomButton2 = memo((props) => {
    const {label,onClick, tabIndex,disabled} = props;
    const [isProcessing, setIsProcessing] = useState(false);

    const debouncedOnClick = useCallback(
        debounce(async (event) => {
            if (disabled || isProcessing) return;
            setIsProcessing(true);
            await onClick(event);
            setIsProcessing(false);
        }, 300),
        [disabled, isProcessing, onClick]);

    const handleClick = (event) => {
        if (event?.type == "keydown" && event?.key == "Enter") {
            event.preventDefault();
            debouncedOnClick(event);
        }
        if (event?.type == "click") {
            debouncedOnClick(event);
        }};

    return (
         <button tabIndex={tabIndex} disabled={disabled || isProcessing} className={`custom-button-2 ${disabled || isProcessing ? 'disable-btn' : ''}`} onClick={handleClick} onKeyDown={handleClick}>
        {label}
    </button>
    );
});


export const CustomButton3 = memo((props) => {
    const {label,onClick, tabIndex, disabled}=props;
    const [isProcessing, setIsProcessing] = useState(false);
    
    const debouncedOnClick = useCallback(
        debounce(async (event) => {
            if (isProcessing || disabled) return;
            setIsProcessing(true);
            await onClick(event);
            setIsProcessing(false);
        }, 300),
        [isProcessing, disabled, onClick]);

    const handleClick = (event) => {
        if (event?.type == 'keydown' && event?.key == 'Enter') {
            event.preventDefault();
            debouncedOnClick(event);
        }
        if (event?.type == "click") {
            debouncedOnClick(event); 
        }
    };

    return (
        <button tabIndex={tabIndex} disabled={disabled || isProcessing} className={`custom-button-3 me-4 ${isProcessing ? 'disable-btn' : ''}`} onClick={handleClick} onKeyDown={handleClick}>
            {label}
        </button>
    );
});

export const CustomButton4 = memo((props) => {
    const { label, onClick, tabIndex, disabled} = props;
    const [isProcessing, setIsProcessing] = useState(false);
    const debouncedOnClick = useCallback(
        debounce(async (event) => {
            if (disabled || isProcessing) return;
            setIsProcessing(true);
            await onClick(event);
            setIsProcessing(false);
        }, 300),
        [disabled, isProcessing, onClick]);

    const handleClick = (event) => {
        if (event?.type == "keydown" && event?.key == "Enter") {
            event?.preventDefault();
            debouncedOnClick(event); 
        }
        if (event?.type == "click") {
            debouncedOnClick(event); 
        }
    };

    return (
        <button tabIndex={tabIndex} disabled={disabled || isProcessing} className={`custom-button4 ${disabled || isProcessing ? 'disable-btn' : ''}`}  onClick={handleClick} onKeyDown={handleClick}>
            {label}
        </button>
    );
});