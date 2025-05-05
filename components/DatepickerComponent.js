import moment from 'moment';
import React, { Component } from 'react'
import DatePicker from "react-datepicker";
import { $AHelper } from './control/AHelper';
import konsole from './control/Konsole';
import { InvalidDateMsg } from './control/Constant';
import { globalContext } from "../pages/_app"
import { isNotValidNullUndefile } from './Reusable/ReusableCom';
export default class DatepickerComponent extends Component {
    static contextType = globalContext
    constructor(props) {
        super(props);
        this.state = {
            dob: "",
            isCalenderOpen: false,
            count: 0,
            dateOfWedding: ""
        };
    }


    // componentDidUpdate(prevProps, prevState) {
    //     konsole.log(this.props.value, "dfsdasdkvjasjkals");
    //     if (prevProps.value !== this.props.value) {
    //         this.setState({
    //             dob: this.props.value,
    //         })
    //     }
    // }


    handleDate = (date) => {
        this.props.setValue(date.target.value);
        this.setState({
            dob: date.target.value,
            isCalenderOpen: false,
            dateOfWedding: date.target.value
        });
    };

    handleRawDate = (ev) => {
        if (ev.type === "change") {
            let [month, date] = ev.target.value.split(/\-/);
            if (ev.nativeEvent.data && !/^[\d\-]+$/.test(ev.nativeEvent.data) || ev.target.value.length > 10 ||
                (ev.target.value.length === 3 && ev.target.value.indexOf('-') === -1) ||
                (ev.target.value.length === 6 && ev.target.value.match(/\-/g).length !== 2)) {
                ev.preventDefault();
            }
            if (parseInt(month) > 12 || (date && parseInt(date) > 31)) {
                ev.target.value = ev.target.value.substr(0, ev.target.value.length - 1) + '-';
            }
            if ((/^\d+$/.test(ev.target.value) && ev.target.value.length === 2) ||
                (ev.target.value.length === 5 && ev.target.value.match(/[0-9]/g).length === 4 && ev.target.value.match(/\-/g).length === 1)) {
                ev.target.value = ev.target.value + '-';
            }
        }
    }

 
    handleDateFocusOut = (e) => {
        e.preventDefault();
        const dateString = this.state.dob || this.props.value;
        const maxDateProps = this.props.maxDate;
        const minDateProps = this.props.minDate;
        const selectDatePicker = e.target;
        const dateStrings = this.props.validDate;
        // const dateStrings = new Date(dateString);
        const currentDateDOMorDOB = new Date();
        const dateEnteredByUser=new Date(dateString)

        let date = moment(dateStrings).format('YYYY-MM-DD')
        
        // konsole.log("dateString",dateString,"maxDateProps",maxDateProps,"minDateProps",minDateProps,"selectDatePicker",selectDatePicker,"dateStrings",dateStrings,"currentDateDOMorDOB",currentDateDOMorDOB)
        konsole.log("dateString1--------", this.props?.dateOfWedding, $AHelper.checkIFMinor(this.props.validDate))
        if (isNotValidNullUndefile(selectDatePicker.value)) {
            if (this.props.handleOnBlurFocus) {
                this.props.handleOnBlurFocus(e.target.value);
            }

            if (this.props?.tag == "weddingDate" || this.props?.tag == "DivorcedDate") {

                // konsole.log("currentDateDOMorDOB121",this.props.validDate,"---",dateEnteredByUser,"----",$AHelper.checkIfMinorForMarriage(this.props.validDate,enteredDate))
                if (!dateStrings) {
                    this.toasterAlert("Enter Date of Birth first", "Warning");
                    this.props.setValue("");
                    //   this.setState({
                    //     dateOfWedding: ""
                    //   })  
                    return;
                }

                if(dateEnteredByUser > currentDateDOMorDOB){
                    this.toasterAlert(`Date of ${this.props?.tag == "weddingDate" ? "marriage" : "divorced"}  cant be greater then Present Date`, "Warning")
                    this.props.setValue("");
                    // this.setState({
                    //     dateOfWedding: ""
                    // })  
                    return selectDatePicker.focus();
                };
                if(this.props?.tag == "DivorcedDate" && isNotValidNullUndefile(this.props?.dateOfWedding)){
                    const marrigeDate = new Date(this.props?.dateOfWedding)
                    if(dateEnteredByUser < marrigeDate){
                        this.toasterAlert("Date of divorced cant be less then wedding Date", "Warning")
                      
                        this.props.setValue("");

                    }
                   
                }
                if(this.props?.tag == "weddingDate" && isNotValidNullUndefile(this.props?.dateOfDivoced)){
        
                    const dateOfDivoced = new Date(this.props?.dateOfDivoced)
                    if(dateEnteredByUser > dateOfDivoced){
                        this.toasterAlert("Date of wedding cant be greater then divorced Date", "Warning")
                      
                        this.props.setValue("");

                    }
                   
                }

                if($AHelper.checkIfMinorForMarriage(this.props.validDate,dateEnteredByUser)<16)
                {
                    this.toasterAlert("User's age must be 16 or above", "Warning")
                    // this.setState({
                    //     dateOfWedding: ""
                    // })  
                    this.props.setValue("");
                }

                if ($AHelper.checkIFMinor(this.props.validDate) < 16) {
                    this.toasterAlert("User's age must be 16 or above", "Warning")
                    this.props.setValue("");
                    // this.setState({
                    //     dateOfWedding: ""
                    // })  
                    return selectDatePicker.focus();
                }else{
                    if(date > selectDatePicker.value){
                        this.toasterAlert(InvalidDateMsg, "Warning")
                        this.props.setValue("");
                        // this.setState({
                        //     dateOfWedding: ""
                        // })  
                        return selectDatePicker.focus();

                    }
                }

                if(this.props.handleOnBlurFocus){
                    this.props.handleOnBlurFocus(e.target.value);
                }

            }else{
                if (this.props.validDate === 18) {
                    konsole.log("calculated date", $AHelper.checkIFMinor(selectDatePicker.value))
                    if ($AHelper.checkIFMinor(selectDatePicker.value) < 18) {
                        this.toasterAlert("Member Cannot be minor.", "Warning")
                        // selectDatePicker.value = "";
                        this.props.setValue("");
                        // this.setState({
                        //     dob: ""
                        // })  
                        // return;
                        return selectDatePicker.focus();
                    }
                }

                if(this.props.dateOfWedding) {
                    const yearGap = $AHelper.checkIfMinorForMarriage(selectDatePicker.value, this.props.dateOfWedding);
                    if(yearGap < 16) {
                        this.toasterAlert("User's age must be 16 or above", "Warning")
                        this.props.setValue(""); 
                        return selectDatePicker.focus();
                    }

                }

                if (!this.isDateValid(dateString) && this.props.referencePage !== 'AMA') {
                    this.toasterAlert(InvalidDateMsg, "Warning")
                    this.props.setValue("");
                    // this.setState({
                    //     dob: ""
                    // }) 

                    return selectDatePicker.focus();
                }
            }



            //  if(!this.isDateValid(dateString)){
            //     this.toasterAlert(InvalidDateMsg, "Warning")
            //     this.props.setValue("");
            //     this.setState({
            //         dob: ""
            //     })  
            //     return selectDatePicker.focus();
            // }

        }

    }


    isDateValid = (dateString) => {
        const currentDate = moment();
        const minDate = moment().subtract(this.props.minDate, "years");
        let maxDate = moment().add(100, "years");
        if (this.props.future !== 'show') {
            maxDate = moment().subtract(this.props.maxDate, "years");
        }
        const date = moment(dateString, "YYYY-MM-DD", true); // Parse dateString as a date in YYYY-MM-DD format
        return date.isValid() && date >= minDate && date <= maxDate;
    };



    toasterAlert = (test, type) => {
        this.context.setdata($AHelper.toasterValueFucntion(true, test, type));
    }

    handleCalenderOpen = () => {
        this.setState({
            isCalenderOpen: true
        })
    }

    handleCalenderClose = () => {
        this.setState({
            isCalenderOpen: false
        })
    }
    render() {
        let name = this.props.name;
        let maxDate = this.props.maxDate;
        let minDate = this.props.minDate;
        let value = this.props.value ? moment(this.props.value).format("YYYY-MM-DD") : "";
        const borderRaduis = (this?.props?.dobBorderChange?.borderRadius) ? { borderRadius: this?.state?.borderRdaiusvalue } : {};
        let placeholderText = this.props.placeholderText;

    //    ----Allow 100 years in future------- 

        if (this.props.future === "show") {
            maxDate = moment().add(100, "years").format("YYYY-MM-DD");
        } else if (maxDate) {
            maxDate = moment().subtract(maxDate, "years").format("YYYY-MM-DD");

        }
        if (maxDate == 0) {
            maxDate = moment().format("YYYY-MM-DD");
        }
        if (minDate) {
            minDate = moment().subtract(minDate, "years").format("YYYY-MM-DD");
        }


        konsole.log("date show here", maxDate, minDate);

        const disable = this.props?.disable == true ? true : false
        // konsole.log("disabledisable",this.props,disable)
        return (
            <>
                <div className="position-relative w-100">

                    <input
                        className={`border datePeaker w-100`}
                        type={"date"}
                        value={value}
                        placeholder={`${(value == "") ? `${this.props.placeholderText}` : ""}`}
                        onChange={this.handleDate}
                        min={minDate}
                        max={maxDate}
                        onBlur={this.handleDateFocusOut}
                        disabled={disable}
                        style={borderRaduis}/>
                    {/* <div onBlur={this.handleDateFocusOut}>

                    </div> */}
                </div>
            </>
        )
    }
}


