import React, { useEffect, useRef, useState, useContext } from 'react';
import Select from 'react-select';
import ModalComponent from './Agentsetguidance/ModalComponent';
import { Form, Row, Col, Button, Table } from 'react-bootstrap';
import DatepickerComponent from './DatepickerComponent';
import { $Service_Url, Api_Url } from './network/UrlPath';
import { getApiCall, isNotValidNullUndefile, postApiCall } from './Reusable/ReusableCom';
import konsole from './control/Konsole';
import AlertToaster from './control/AlertToaster';
import { $AHelper } from './control/AHelper';
import OtherInfo from './asssets/OtherInfo';
import Other from './asssets/Other';
import { SET_LOADER } from './Store/Actions/action';
import { connect } from 'react-redux';
import { globalContext } from '../pages/_app';

const newFormDataObj = () => { return { userMedicationId: 0, medicationId: null, doseAmount: '', frequency: '', time: '', startDate: '', endDate: '', doctorPrescription: '' } }

const UserMedication = ({ UserDetail, dispatchloader }) => {
  const { setdata, confirm,setPageTypeId} = useContext(globalContext)
  const loggedInUserId = sessionStorage.getItem('loggedUserId')
  const [formData, setFormData] = useState({ ...newFormDataObj() });
  const [medications, setMedications] = useState([])
  const [show, setShow] = useState(false);
  const [initialShow, setinitialShow] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [medicationlist, setMedicationlist] = useState([]);
  const [disableSaveUpdateBtn, setDisableSaveUpdateBtn] = useState(false);
  const [disableDeleteBtn, setDisableDeleteBtn] = useState(false);

  const otherRef = useRef()
  // useEffect(() => {
    // clearAll()
    // fetchApi('all')
    // }, [])

  useEffect(() => {
    if (UserDetail?.medicationCallfun != undefined) {
      UserDetail?.medicationCallfun(show)
    }
    if(!medicationlist.length && show == true) {
      fetchApi('all')
    }
  }, [show])


  const fetchApi = async (type) => {
    if(show == false) return;
    if (isNotValidNullUndefile(UserDetail?.userId)) {
      dispatchloader(true);
      const _resultOfUserMedication = await getApiCall('GET', $Service_Url?.GetUserMedication + `${UserDetail?.userId}`, setMedications)
      konsole.log(_resultOfUserMedication, "_resultOfUserMedication");
      dispatchloader(false);
    }

    if (type !== 'all') return;
    dispatchloader(true);
    const _resultOfMedicationList = await getApiCall('GET', $Service_Url.GetMedications, setMedicationlist);
    dispatchloader(false);
    konsole.log(_resultOfMedicationList, "_resultOfMedicationList")
  }
  
  

  const handleSelect = (e) => {
    konsole.log(e, "dataaaaa")

    setFormData(prev => ({
      ...prev, medicationId: e.value
    }))

  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev, [name]: value
    }))
  };



  const editData = (e) => {
    konsole.log(e, "medicationId")
    let updatedObject = Object?.keys(e)?.reduce((acc, key) => {
      if (key !== 'MedicationName') {
        acc[key] = e[key];
      }
      return acc;
    }, {})

    setFormData(updatedObject)
    setStartDate(e?.startDate)
    setEndDate(e?.endDate)
  }
  const deleteUserData = async (e) => {
    const req = await confirm(true, "Are you sure? you want to delete", "Confirmation");
    if (!req) return;
    setDisableDeleteBtn(true)
    e['isActive'] = false
    let jsonObj = {
      "userId": UserDetail.userId,
      "userMedications": [e],
      'UpsertedBy': loggedInUserId
    }
    dispatchloader(true);
    const _resultOdDeleteData = await postApiCall('POST', $Service_Url.UpsertUserMedication, jsonObj)
    dispatchloader(true);
    const responseData = _resultOdDeleteData.data?.data?.userMedications;

    if (responseData?.length > 0) {
      setDisableDeleteBtn(false)
      AlertToaster.success(`Data deleted successfully.`);
      clearAll()
    }
  }
  const handleSubmit = async (e) => {
    let medicineStartDate="";
    let medicineEndDate="";
    if (formData?.medicationId == null) {
      toasterAlert('Please select Medication type.')
      return;
    }
    setDisableSaveUpdateBtn(true)
    let changeStartDateFormat=$AHelper.getFormattedDate(startDate);
    let changeEndDateFormat=$AHelper.getFormattedDate(endDate);
    formData['startDate'] = ""
    formData['endDate'] = ""
    // konsole.log("startDate",changeStartDateFormat,"endDate",changeEndDateFormat)

    if(changeStartDateFormat!="" && changeEndDateFormat!=""){ 
      medicineStartDate= new Date(changeStartDateFormat);
      medicineEndDate = new Date(changeEndDateFormat);
      if (medicineStartDate >= medicineEndDate) {
        toasterAlert("Enter a valid end date","Warning");
        setEndDate("")
        setDisableSaveUpdateBtn(false)
        return;
    }}

    konsole.log(formData, "formData.startDate");
    let jsonObj = {
      "userId": UserDetail.userId,
      "userMedications": [formData],
      "UpsertedBy": loggedInUserId
    }
    // konsole.log("jsonObjjsonObj",jsonObj)
    dispatchloader(true);
    const _resultOfSaveUpdateData = await postApiCall('POST', $Service_Url.UpsertUserMedication, jsonObj)
    konsole.log('_resultOfSaveUpdateData', _resultOfSaveUpdateData)
    if (_resultOfSaveUpdateData != 'err') {
      const responseData = _resultOfSaveUpdateData?.data?.data?.userMedications;
      konsole.log('responseData', responseData)
      if (formData.medicationId == '999999' && responseData?.length > 0) {
        otherRef.current.saveHandleOther(responseData[0].userMedicationId);
      }
      setDisableSaveUpdateBtn(false)
      AlertToaster.success(`Data ${formData.userMedicationId == 0 ? 'saved' : 'updated'} successfully.`)
      setShow(false)
      clearAll()
    } else {
      toasterAlert('Unable to process your request; please try again after some time.');
      setDisableSaveUpdateBtn(false)
    }
    dispatchloader(false);
  };

  const handleShow = () => {
    setPageTypeId(7)
    setShow(true);
    setDisableSaveUpdateBtn(false)
    setDisableDeleteBtn(false)
    clearAll()
  };
  const clearAll = async () => {
    setFormData({ ...newFormDataObj() })
    setStartDate('')
    setEndDate('')
    fetchApi();
  }
  const handleClose =()=>{
    setShow(false)
    setPageTypeId(null)

  }

  function toasterAlert(text) {
    setdata({ open: true, text: text, type: "Warning" });
  }

  return (
    <>
      <style jsx global>{`
        .modal-open .modal-backdrop.show {  opacity: 0.7;  }
        .modal-dialog {margin: 1.75rem auto;}
      `}</style>
      <a onClick={() => handleShow()}>
        <img src="/icons/add-icon.svg" alt="Health Insurance" />
      </a>

      <ModalComponent lg={6}enforceFocus={false} visible={show} onCancel={() => handleClose()} title='Medication and Supplements'>
        <Form >
          <Row>
            <Col md={6} className='mt-2'>
              <Form.Group controlId="MedicationId" className='mb-2'>
                <Select
                  className='w-100 p-0 custom-select'
                  isSearchable
                  name="medicationId"
                  placeholder="Please select medication type*"
                  value={(isNotValidNullUndefile(formData?.medicationId) && medicationlist?.length > 0) ? medicationlist?.find((item) => item?.value == formData?.medicationId) : 'Please select medication type*'}
                  onChange={handleSelect}
                  options={medicationlist?.sort((a, b) => a.label.localeCompare(b.label))}
                  maxMenuHeight={150}
                >
                </Select>
              </Form.Group>



              {formData.medicationId == '999999' &&
                <Other
                  othersCategoryId={38}
                  userId={UserDetail.userId}
                  dropValue={formData.medicationId}
                  natureId={formData.userMedicationId}
                  ref={otherRef} />}

            </Col>

            <Col md={6} className='mt-2'>
              <Form.Group controlId="DoseAmount">
                <Form.Control
                  type="text"
                  name="doseAmount"
                  placeholder="Dosage (eg. 500mg / 500ml)"
                  value={formData.doseAmount}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className='mt-2'>
              <Form.Group controlId="Frequency">
                <Form.Control
                  type="text"
                  name="frequency"
                  placeholder="Frequency (e.g. daily / twice daily)"
                  value={formData.frequency}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6} className='mt-2'>
              <Form.Control
                type='text'
                name="time"
                onChange={handleChange}
                value={formData.time}
                placeholder="Timing (eg. daily / morning / evening)"
              />
            </Col>
          </Row>

          {/* <Row>
            <Col md={6} className='mt-2'>
              <DatepickerComponent
                name="StartDate"
                value={startDate}
                setValue={(e) => setStartDate(e)}
                placeholderText="Start Date"
                maxDate={-100}
                minDate="100"
                future='show'
              />
            </Col>
            <Col md={6} className='mt-2'>
              <DatepickerComponent
                name="EndDate"
                value={endDate}
                setValue={(e) => setEndDate(e)}
                placeholderText="End Date"
                // maxDate={-100}
                // minDate={startDate != '' ? startDate : '100'}
                minDate={100}
                future='show'
              />
            </Col>
          </Row> */}

          <Row>
            <Col md={6} className='mt-2'>
              <Form.Group controlId="DoctorPrescription">
                <Form.Control
                  as="textarea"
                  rows='3'
                  name="doctorPrescription"
                  placeholder="Note (Additional notes or instructions from the prescribing doctor)"
                  value={formData.doctorPrescription}
                  onChange={handleChange}
                />

              </Form.Group>
            </Col>
          </Row>


        </Form>
        <Button variant="primary" className='mt-2 theme-btn float-end mb-4' onClick={() => handleSubmit()} disabled={disableSaveUpdateBtn} >
          {formData.userMedicationId == 0 ? 'Save' : 'Update'}
        </Button>

        <div className="border-1 mb-3 d-block w-100 " style={{ maxHeight: "20vh", overflowY: "auto" }}>
          {medications?.userMedications?.length > 0 && <Table bordered className="w-100 table-responsive financialInformationTable">
            <thead className='text-center align-middle' >
              <tr  >
                <th>Medication</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Timing</th>
                {/* <th>Start Date</th> */}
                {/* <th>End Date</th> */}
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {medications?.userMedications?.map((e, ind) => (<>
                <tr style={{ wordBreak: "break-word", textAlign: 'center' }} className="mb-5">
                  <td style={{ wordBreak: "break-word" }}>
                    <OtherInfo
                      key={ind}
                      othersCategoryId={38}
                      userId={UserDetail.userId}
                      othersMapNatureId={e.userMedicationId}
                      FieldName={e.medicationName}
                    />
                  </td>
                  <td style={{ wordBreak: "break-word" }}>{e.doseAmount || "-" }</td>
                  <td style={{ wordBreak: "break-word" }}>{e.frequency || "-"}</td>
                  <td style={{ wordBreak: "break-word" }}>{e.time || "-"}</td>
                  {/* <td style={{ wordBreak: "break-word" }}>{e.startDate != null && $AHelper.getFormattedDate(e.startDate)}</td> */}
                  {/* <td style={{ wordBreak: "break-word" }}>{e.endDate != null && $AHelper.getFormattedDate(e.endDate)}</td> */}
                  <td style={{ wordBreak: "break-word" }}>{e.doctorPrescription || "-"}</td>
                  <td style={{ wordBreak: "break-word",verticalAlign:"middle" }}>
                    {/*<div className='d-flex flex-row align-items-center justify-content-center gap-1' style={{ width: '5rem' }} >
                      <span onClick={() => { editData(e) }} className='mt-2 me-2 ' style={{ textDecoration: "underline", cursor: "pointer" }} >Edit</span>
                      <div><span className="cursor-pointer mt-1" >
                        {disableDeleteBtn == true ? <img src="/icons/deleteIcon.svg" className="h-50 p-0" alt="g4" /> :
                          <img src="/icons/deleteIcon.svg" className="h-50 p-0" alt="g4" onClick={() => deleteUserData(e)} />}
                      </span></div>
                    </div> */}
                    <div className="d-flex justify-content-center gap-2">
                     <div className=' d-flex flex-column align-items-center' onClick={() => { editData(e) }}>
                        <img className="cursor-pointer mt-0" src="/icons/EditIcon.png" alt=" Mortgages" style={{ width: "20px"}}  />
                        {/* <span className='fw-bold mt-1' style={{ color: "#720C20", cursor: "pointer" }}>Edit</span> */}
                     </div>
                     <div>
                     {disableDeleteBtn == true ? <img src="/icons/deleteIcon.svg" className="mt-0" alt="g4" /> : <span style={{borderLeft:"2px solid #e6e6e6", paddingLeft:"5px", height:"40px", marginTop:"5px"}} className="cursor-pointer mt-1" onClick={() => deleteUserData(e)}>
                        <img src="/icons/deleteIcon.svg" className="mt-0" alt="g4" style={{ width: "20px"}} />
                         </span>}
                     </div>
                    </div>
                  </td>
                </tr>
              </>
              ))}
            </tbody>
          </Table>}
        </div>
      </ModalComponent>
    </>
  );
};


const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserMedication);

