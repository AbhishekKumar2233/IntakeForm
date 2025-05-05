import moment from 'moment';
import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { isNotValidNullUndefile, isNullUndefine } from '../../components/Reusable/ReusableCom';
import { $AHelper } from '../Helper/$AHelper';
import konsole from '../../components/control/Konsole';
import { $Msg_Calender } from '../Helper/$MsgHelper';
import { globalContext } from '../../pages/_app';

const CustomCalendar = ({ id, customClassName, label, placeholder, value, dod, onChange, type, compareDate, isError ,tabIndex, allowFutureDate, startAfter, futureLimit, showToday, setMaxMinDateFor,handleChangeOnFocusOut, callFocusOutFuncFor,personalDetails,spouseDetailsObj, isAMAStartDate, isDisabled, isAMADisabled }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = allowFutureDate ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + (futureLimit ?? 36500)) : today;
    // const minDate = startAfter ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + startAfter) : new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    const minDate = startAfter ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + startAfter) : new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [showLabel, setShowLabel] = useState(false);
    const { setWarning } = useContext(globalContext);
    const dropdownRef = useRef(null);
    const startingTabIndex = tabIndex ?? 0;

    konsole.log("DAcnacnlk", maxDate)

    useEffect(() => {
        konsole.log(isNullUndefine(value), "isNullUndefine(value)");
        if (isNullUndefine(value)) {
            setSelectedDate("");
            setShowLabel(true);
        } else {
            setSelectedDate(new Date(value));
            setShowLabel(false);
        }
    }, [value,handleChangeOnFocusOut]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
    };

    const validate = (date) => {
        const compareDateFormat = new Date(compareDate);
        let selectedDate = date;
        // console.log(type,selectedDate,"selectedDate")

        if (isNullUndefine(compareDateFormat)) {
            toasterAlert("warning", "Warning", $Msg_Calender.dobErr);
            return false;
        }

        // Allow future dates only for insEndDate

        //  if (type !== 'insEndDate') {
        //     if (selectedDate > today || selectedDate > maxDate) {
        //         toasterAlert("warning", "Warning", $Msg_Calender.dateOfCurrentErr);
        //         return false;
        //     }

       if (selectedDate > maxDate && allowFutureDate == false) {
                toasterAlert("warning", "Warning", $Msg_Calender.dateOfCurrentErr);
                return false;
        }
        switch (type) {
            case "dateodMarrige":
                let dateOfDeth = new Date(spouseDetailsObj?.dateOfDeath)
                let newSelectedDate = new Date(selectedDate)
                const dobNew =  new Date(compareDate);
                if(isNullUndefine(compareDate)){
                    toasterAlert('warning','Warning',"Enter Date of Birth first");
                    return false;
                }
                // if ($AHelper.checkIfMinorForMarriage(compareDate, selectedDate) < 16) {
                if ($AHelper.checkIfMinorForMarriage(compareDate, selectedDate) < 14) {
                    toasterAlert("warning", "Warning", $Msg_Calender.weddingAgeErr);
                    return false;
                }
                if ($AHelper.$isNotNullUndefine(compareDate) && dobNew > selectedDate) {
                    toasterAlert("warning", "Warning", "Kindly enter valid DOB.");
                    return false;
                }
                if($AHelper.$isNotNullUndefine(spouseDetailsObj?.dateOfDeath) && dateOfDeth < newSelectedDate){
                    toasterAlert('warning','Warning',$Msg_Calender.dateofDeathBeforeMrgErr);
                    return false;
                }
                break;

            case "dateofDivorce":
                 let date1 = new Date(selectedDate)
                 let date2 = new Date(compareDate)
                if (date1 < date2) {
                    toasterAlert("warning", "Warning", $Msg_Calender.divorceErr);
                    return false;
                } else if (isNullUndefine(compareDate)) {
                    toasterAlert("warning", "Warning", $Msg_Calender.weddingEmptyErr);
                    return false;
                } else if (selectedDate > today) {
                    toasterAlert("warning", "Warning", $Msg_Calender.divorceLessWeddingErr);
                    return false;
                }
                break;

            case "dateofDeath":
                let dateOfWedding = new Date(personalDetails?.dateOfWedding)
                   const parsedSelectedDate = new Date(selectedDate);
                if (parsedSelectedDate > today) {
                    toasterAlert("warning", "Warning", $Msg_Calender.dateofDeathErr);
                    return false;
                }else if (parsedSelectedDate < compareDateFormat) {
                    toasterAlert("warning", "Warning", 'Please enter the valid date.');
                    return false;
                }
                else if($AHelper.$isNotNullUndefine(personalDetails?.dateOfWedding) && dateOfWedding > parsedSelectedDate){
                    toasterAlert("warning", "Warning", $Msg_Calender.dateofDeathBeforeMrgErrNew);
                    return false;
                }
                break;

            case "validUser":
                // if ($AHelper.checkIFMinor(selectedDate) < 16) {
                if ($AHelper.checkIFMinor(selectedDate) < 14) {
                    toasterAlert("warning", "Warning", $Msg_Calender.validAge);
                    return false;
                }
                break;
            case "dateOfBirth":
                const enteredDate = new Date(selectedDate);
            if (enteredDate > today) {
                toasterAlert("warning", "Warning", $Msg_Calender.dateofBirthErr);
                return false;
            }
            break;

            case "default": 
                const _selectedDate = new Date(date);
                _selectedDate.setHours(0, 0, 0, 0);
                if(showToday && (_selectedDate.getTime() == today.getTime())) return true;
                else if(minDate > _selectedDate || maxDate < _selectedDate) {
                    // alert("hello" + _selectedDate + ', '+ today)
                    toasterAlert("warning", "Warning", $Msg_Calender.inValidDate);
                    onChange("");
                    return false;
                }

            default:
                return true;
        }
        return true;
    }

    const toggleCalendar = () => {
        if (isDisabled) return;
          if(selectedDate == "Invalid Date"){
            setSelectedDate("")
        }
        setShowCalendar(!showCalendar);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowCalendar(false);
        }
    };

    function isValidDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
    
        if (isNaN(date.getTime())) {
            // Invalid date
            return false;
        }
    
        // Check if the year is after 1700
        return year > 1700;
    }

    const inputDate = (e) =>{
      konsole.log("1212eee",e,e.target.value)
      const date = e.target.value
      handleDateSelect(date)
      if(callFocusOutFuncFor == "FidBeneficiary" || callFocusOutFuncFor == "forChild"){
          handleChangeOnFocusOut(date)
      }
    }

    const handleDateSelect = (date) => {
        if(isValidDate(date)){
            const selectedDateOnly = moment(date).startOf('day');
            const todayOnly = moment(today).startOf('day');
            
            if (isAMAStartDate && selectedDateOnly.isBefore(todayOnly)) {
                toasterAlert("warning", "Warning", $Msg_Calender.dateofDeathBeforeMrgErr);
                setSelectedDate('');
                setShowLabel(true);
                onChange('')
                return;
            } else {
                setSelectedDate(date);
                setShowLabel(false);
            }
            const isValid = validate(date);
            let formatDate = moment(date).format("MM/DD/YYYY") 
            if (!isValid) {
                setSelectedDate("");
                setShowLabel(true);
            } else {
                onChange(formatDate);
                setSelectedDate(date);
                setShowLabel(false);
            }
    
            setShowCalendar(false);
        }else{
            onChange(null);
            setSelectedDate("");
            setShowLabel(true);
        }
       
    };

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const CalendarComponent = () => {
        const [currentDate, setCurrentDate] = useState(($AHelper.$isNotNullUndefine(selectedDate) || selectedDate == "Invalid Date") ? new Date(selectedDate) : new Date(setMaxMinDateFor == "PrimaryMember" ? minDate : today));

        const handlePrevMonth = () => {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
        };

        const handleNextMonth = () => {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
        };

        const handleDateClick = (day) => {
            const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            // if (selected <= maxDate) {
                setSelectedDate(selected);
                handleDateSelect(selected);
            // }
        };

        const handleMonthChange = (event) => {
            const month = parseInt(event?.target?.value, 10);
            setCurrentDate(new Date(currentDate.getFullYear(), month));
        };

        const handleYearChange = (event) => {
            const year = parseInt(event?.target?.value, 10);
            setCurrentDate(new Date(year, currentDate.getMonth()));
        };

        const clearCalInput = () =>{
           setSelectedDate("")
           setShowCalendar(false);
           onChange('')
        }

        const showTodayDateInCalInput = () => {
            if(setMaxMinDateFor != "PrimaryMember"){
                const _curDate = new Date();
                _curDate.setHours(0, 0, 0, 0);
                // setSelectedDate(new Date())
                handleDateSelect(_curDate);
                setShowCalendar(false)
                // onChange(new Date())
            }
        }

        const handleEnterKeyPressDay = (e, day) => {
            if (e.key == 'Enter') {
                e.preventDefault(); 
                if (!isDisabled && !isAMADisabled) {
                    handleDateClick(day);
                }
            }
        };

        const renderDays = () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const daysInMonth = getDaysInMonth(year, month);
            const firstDay = getFirstDayOfMonth(year, month);
            const days = [];

            // Adjust firstDay to start from Monday (0 = Sunday)
            const adjustedFirstDay = (firstDay === 0 ? 6 : firstDay - 1);

            // Add empty days for the previous month
            for (let i = 0; i < adjustedFirstDay; i++) {
                days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
            }
            
            // Add days of the current month
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                // konsole.log("dsnknsdlknl" , (showToday && date.getTime() == today.getTime()), today, date);
                let selectedDateUpd = new Date(selectedDate)
                const isActive = selectedDateUpd?.getDate() === day && selectedDateUpd?.getMonth() === month && selectedDateUpd?.getFullYear() === year;
                const isDisabled = (showToday && (date.getTime() == today.getTime())) ? false : type == 'validUser' ? date > minDate : (type == 'dateOfBirth' || type == "dateofDeath") ? date > today : startAfter ? (minDate > date || maxDate < date)  : date > maxDate ;
                const isAMADisabled = isAMAStartDate && date < today && !(date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && day === today.getDate());
                days.push(
                    <div
                        key={day}
                        tabIndex={startingTabIndex + 4}
                        className={`calendar-day${isActive ? ' active' : ''}`}
                        onClick={() => (!isDisabled && !isAMADisabled) && handleDateClick(day)}
                        onKeyDown={(e) => handleEnterKeyPressDay(e, day)}
                        style={{ color: (isDisabled || isAMADisabled) ? 'darkgrey' : 'inherit' }}
                    >
                        {day}
                    </div>
                );
            }

            return days;
        };

        const years = Array.from({ length: maxDate.getFullYear() - 1900 + 1 }, (_, i) => 1900 + i);

        const handleArrowKeyChangeBTn = (e) => {
            if (e.key == 'ArrowRight' || e.key =='ArrowLeft') {
                if (e.key == 'ArrowRight') {
                    handleNextMonth();
                } else if (e.key == 'ArrowLeft') {
                    handlePrevMonth();
                }
                e.preventDefault();
            }
        };
        
        const handleArrowKeyChange = (e, type) => {
            let newMonth = currentDate?.getMonth();
            let newYear = currentDate?.getFullYear();

            if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
                if (type == 'month') {
                    if (e.key == 'ArrowUp') {
                        newMonth = (newMonth + 1) % 12;
                    } else if (e.key == 'ArrowDown') {
                        newMonth = (newMonth - 1 + 12) % 12;
                    }
                } else if (type == 'year') {
                    if (e.key == 'ArrowUp') {
                        newYear += 1;
                    } else if (e.key == 'ArrowDown') {
                        newYear -= 1; 
                    }
                }
        
                if (type == 'month') {
                    setCurrentDate(new Date(currentDate?.getFullYear(), newMonth));
                } else if (type == 'year') {
                    setCurrentDate(new Date(newYear, currentDate?.getMonth()));
                }
                e.preventDefault();
            }
        };
        
        return (
            <div id='custom-calendar' className="calendar-container">
                <div className="calendar-header">
                    <div className="calendar-header-selectors">
                        <select className='tabFocus' tabIndex={startingTabIndex + 1} style={{width:"106px"}} value={currentDate.getMonth()} onChange={handleMonthChange} onKeyDown={(e) => handleArrowKeyChange(e, 'month')}>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                        <select className='tabFocus' tabIndex={startingTabIndex + 2} value={currentDate.getFullYear()} onChange={handleYearChange} onKeyDown={(e) => handleArrowKeyChange(e, 'year')}>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="d-flex gap-4 me-2">
                        <img tabIndex={startingTabIndex + 3} className="me-2 tabFocus" onClick={handlePrevMonth} onKeyDown={handleArrowKeyChangeBTn} alt="prev" src="/New/icons/prevIcon.svg" />
                        <img tabIndex={startingTabIndex + 4} className='tabFocus' onClick={handleNextMonth} onKeyDown={handleArrowKeyChangeBTn}  alt="next" src="/New/icons/nextIcon.svg" />
                    </div>
                </div>
                <div className="calendar-grid">
                    {daysOfWeek.map((day, index) => (
                        <div key={index} className="calendar-day-of-week">
                            {day}
                        </div>
                    ))}
                    {renderDays()}
                </div>
                <div className='w-100 d-flex justify-content-between'>
                    <div className='mx-2' style={{color:"blue",fontSize:"12px"}} onClick={()=>clearCalInput()}>Clear</div>
                    <div className='mx-2' style={setMaxMinDateFor == "PrimaryMember" ? {color:"grey",fontSize:"12px"} : {color:"blue",fontSize:"12px"}} onClick={()=>showTodayDateInCalInput()}>Today</div>
                </div>
            </div>
        );
    };

    let dateValueForInput = useMemo(() => {
        let valueOfDate = selectedDate ? moment(selectedDate).format("YYYY-MM-DD") : "";
        return valueOfDate;
    }, [selectedDate])

    // let dateValueForCalender = useMemo(() => {
    //     let dateValue = showLabel == false ? moment(selectedDate).format("MM/DD/YYYY") : "mm/dd/yyyy"
    //     return dateValue
    // }, [selectedDate])
 
 
    const handleChange = (e) => {
        let value = e.target.value;
        setSelectedDate(value)
        setShowCalendar(false)
        // if(value == ''){
        //     setSelectedDate('Invalid Date')
        //     setShowCalendar(false)
        // }
    }

    const exactAge = $AHelper.$getAge(dateValueForInput, dod);
    const showAge = label?.includes('Date of birth') && isNotValidNullUndefile(dateValueForInput);

    const handleEnterKey = (e) => {
        if (e.key == 'Enter') {
            toggleCalendar();
            e.preventDefault();
        } else if (e.key == 'Escape') {
            toggleCalendar();
            e.preventDefault();
        }
    };

    return (
        <div ref={dropdownRef} className={customClassName} onKeyDown={handleEnterKey} >
            {label && <p className="label">{label}</p>}
            <div className={`${$AHelper.$isNotNullUndefine(isError) ? "dropdown-calender d-flex error-msg-calender" : "dropdown-calender d-flex"}`} style={isDisabled == true ? { backgroundColor: "rgb(185, 183, 183)",pointerEvents: "none",opacity: "0.6"} : {}}>
                <input tabIndex={tabIndex}  id={id} className={`datePickerInput w-100`} type="date" value={dateValueForInput} placeholder={placeholder} onBlur={inputDate} onChange={handleChange} disabled={isDisabled} max="9999-12-31"/>
                {showAge && <div className='ageShowDob'>({exactAge >= 0 ? exactAge : 0} years)</div>}
                <div className={`dropdown-icon ${showCalendar ? "dropdown-icon-bg" : ""}`} onClick={toggleCalendar}>
                    <img className="mt-0" src="/New/image/calendarImg.svg" alt="Calendar Icon" />
                </div>
                <div className={`${isAMAStartDate ? 'dropdown-content-calender-AMA' : 'dropdown-content-calender'} ${showCalendar ? 'show' : ''}`}>
                    <CalendarComponent key={selectedDate}/>
                </div>
            </div>
            {$AHelper.$isNotNullUndefine(isError) && <span className="err-msg-show">{isError}</span>}
        </div>
    );
};

export default CustomCalendar;
