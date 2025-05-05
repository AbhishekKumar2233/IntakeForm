import React, { useState, useContext, useEffect } from 'react';
import { Button, Modal, Table, Form, Tab, Row, Col } from "react-bootstrap";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import konsole from '../control/Konsole';
import { globalContext } from '../../pages/_app';
import { $AHelper } from '../control/AHelper';
import AlertToaster from '../control/AlertToaster';
import { $CommonServiceFn, Services } from '../network/Service';
import { $Service_Url } from '../network/UrlPath';
import { SelectCom } from '../Reusable/ReusableCom';
import { demo } from '../control/Constant';

const DateCalendar = ({ minDate, maxDate, isWeakEndDisabled, handleClose }) => {
    const { setdata } = useContext(globalContext);
    const [selectedDates, setSelectedDates] = useState([]);
    const [descriptionVal, setDescriptionVal] = useState('')
    const loggedInUser = sessionStorage.getItem("loggedUserId") || "";
    const userDetail = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
    const [teamId,setTeamId]= useState('')
    const [teamPassword,setTeampassword]= useState('')
    const [paralegal,setParalegal] = useState([])
    const [emailPara,setemailPara] = useState('')
    useEffect(()=>{
        apiCallGetUserListByRoleId()
    },[])
    const apiCallGetUserListByRoleId = () => {
        const subtenantId = sessionStorage.getItem("SubtenantId");
        const stateObj = $AHelper.getObjFromStorage("stateObj");
        let josnObj = {
          "subtenantId": subtenantId, "isActive": true,
          //  "roleId": stateObj.roleId
          "userType": "LEGAL"
        }
          Services.getUserListByRoleId(josnObj).then((res) => {
            konsole.log('res of getting paralegal list', res)
            let responseData = res?.data?.data;
            setParalegal(responseData)
          }).catch((err) => {
            konsole.log('err in getting palarelgal', err)
          })
    
      }

    const handleDateClick = (date) => {
        const updateDates = [...selectedDates];
        const index = updateDates.findIndex((det) => det?.toISOString() === date.toISOString());

        if (index !== -1) {
            updateDates.splice(index, 1);
        } else {
            if (updateDates.length === maxDate) {
                toasterAlert(`You can select max ${maxDate} slots from the calendar.`);
                return false;
            }
            updateDates.push(date);
        }

        setSelectedDates(updateDates);
    };

    const tileDisabled = ({ date, view }) => {
        let currentDate = new Date();
        currentDate.setHours(0,0,0,0)
        console.log('currentDate',currentDate,date)
        if (date < currentDate) {
            return true;
        }

        if (isWeakEndDisabled == true && view === 'month' && (date.getDay() === 0 || date.getDay() === 6)) {
            return true;
        }

    };

    const tileClassName = ({ date }) => {
        if (selectedDates.some((det) => det.toISOString() === date.toISOString())) {
            return 'calendar-selected_date';
        }
        return 'calendar-non-selected_date';
    };

    function toasterAlert(text) {
        setdata({ open: true, text: text, type: 'Warning' });
    }


    const handleSave = () => {
        if (selectedDates.length < 1) {
            toasterAlert(`Please select a slot from the calendar.`);
            return false;
        }
        if(teamId==''){
            toasterAlert('Please enter the team viewer id.')
            return false;
        }
        if(teamPassword==''){
            toasterAlert('Please enter the team viewer password.')
            return false;
        }
        functionForAcknowledgementMail()
        AlertToaster.success('Send Successfully.')
        handleCancel()

    }
    const handleCancel = () => {
        setSelectedDates([])
        handleClose()
    }
    const functionForAcknowledgementMail = (response) => {

        let emailContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Tech Support</title>
          </head>
          <body><p>

        Hello,<br/>

                I am writing to bring to your attention to an urgent issue that requires your support.<br />

                Issue Description: @@Description <br />

                I would appreciate it if we could schedule a support session to address this issue. My availability for the support session is as follows ( @@Date )<br />

                To facilitate a quick resolution, I have generated a TeamViewer ID for remote access<br />

                Team Viewer Id: @@TeamViewer<br />
                Team Viewer Password: @@password
          </p>
            <p>Thanks <br />${userDetail?.memberName}</p>
          </body>
        </html>
    `;

        emailContent = emailContent.replace('@@Description', descriptionVal);
        emailContent = emailContent.replace('@@TeamViewer', teamId);
        emailContent = emailContent.replace('@@password', teamPassword);

        // emailContent = emailContent.replace('@@Date', selectedDates.map((e)=>($AHelper.dateFomratShow(e))));
        emailContent = emailContent.replace('@@Date', selectedDates.map(e => `<span>${$AHelper.getFormattedDate(e)}</span>`).join(', '));

        const emailTo=(demo==false && subtenantId==742) ? "priorityclient@lifepointlaw.com":'deepaks@agingoptions.com'
        

        const jsonObj = {
            emailType: "Tech Support",
            emailTo: emailTo,
            emailSubject: `Tech Support`,
            emailContent: emailContent,
            // emailFrom: "string",
            // emailFromDisplayName: "string",
            // emailTemplateId: 0,
            emailStatusId: 1,
            emailMappingTable: "tblMember",
            emailMappingTablePKId: loggedInUser,
            createdBy: loggedInUser,
            emailcc: 'shreyasinha@agingoptions.com',
            // emailbcc: 'Techaging@mailinator.com'
            emailbcc:'abhishek.kumar@agingoptions.com'
        }
        konsole.log(emailPara,"emailPara")
        return new Promise((resolve, reject) => {
            $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.sendPostEmailCC, jsonObj, (response, errorData) => {
                if (response) {
                    konsole.log("responseresponseForUser", response)
                    resolve('resolve')
                }
                else if (errorData) {
                    resolve('err')
                    konsole.log("responseresponseForUser", errorData)
                }
            })
        })
    }



    return (
        <div>
            <>
                <Row>
                    <p className=" generate-pdf-main-color text-start fs-6">Select a time slot for assistance. (Max 5 slot)</p>
                    <Col xs={6} md={6} className=''>
                        <Calendar
                            onClickDay={(date) => handleDateClick(date)}
                            selectRange={false}
                            tileDisabled={tileDisabled}
                            tileClassName={tileClassName}
                        />
                    </Col>
                    <Col xs={6} md={6}>
                        <div className='d-flex flex-wrap justify-content-start w-100'>
                            {(selectedDates.length > 0) ? <>
                                {selectedDates.map((item) => {
                                    const _date = $AHelper.getFormattedDate(item);
                                    konsole.log('selectedDateselectedDate', _date)
                                    return <>
                                        <div className=' p-3  rounded m-2' style={{ backgroundColor: '#720C20', color: "white" }}>{_date} </div>
                                    </>
                                })}
                            </> : <div className="d-flex align-items-center justify-content-center w-100" style={{ height: '33vh' }}>
                                <div className="text-center">
                                    <p className="rotate-text">No slot Selected</p>
                                </div>
                            </div>
                            }
                        </div>
                        {selectedDates.length > 0 && <>
                            <hr />
                            <div className='w-100 mb-4 mt-2'>
                            <h5 className='mt-1'>Paralegal</h5>
                                <Form.Select aria-label="Default select example" className='custom-input mt-1' onChange={(e)=>{setemailPara(e.target.value)}}>
                                <option value="" disabled selected>Please select a paralegal</option>
                                {paralegal?.length > 0 && paralegal?.map((item, index) => (item.fullName ? <option key={index} value={item.primaryEmail}>  {item.fullName} </option> : ""))}
                                </Form.Select> 
                                <h5 className='mt-1'>Team viewer id*</h5>
                                <Form.Control className='mt-1' placeholder='Enter the team viewer id*' onChange={(e)=>{setTeamId(e.target.value)}} />

                                <h5 className='mt-1'>Team viewer password*</h5>
                                <Form.Control className='mt-1' placeholder='Enter the team viewer password*' onChange={(e)=>{setTeampassword(e.target.value)}} />
                                <h5 className='mt-1'>Describe</h5>
                                <Form.Control className="mt-1 mb-1" placeholder="Enter your query" as="textarea" onChange={(e) => setDescriptionVal(e.target.value)} rows={3} style={{ borderRadius: "2px" }} />
                            </div>

                        </>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={6}> </Col>
                    <Col xs={6} md={6}>
                        <div className='w-100 d-flex justify-content-end gap-2'>
                            <Button style={{ backgroundColor: "#76272b", border: "none" }} className="theme-btn ms-1" onClick={() => handleSave()}>Send</Button>
                            <Button style={{ backgroundColor: "#76272b", border: "none" }} className="theme-btn ms-1" onClick={() => handleCancel()}>Cancel</Button>
                        </div>
                    </Col>
                </Row>

            </>
        </div>
    );
};

export default DateCalendar;
