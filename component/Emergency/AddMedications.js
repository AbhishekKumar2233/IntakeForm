import React, { useContext, useEffect, useMemo, useState, useRef } from 'react'
import { Row, Col, Table } from 'react-bootstrap';
import { CustomInput, CustomSearchSelect, CustomSelect, CustomTextarea, CustomTextarea2 } from '../Custom/CustomComponent';
import { CustomButton } from '../Custom/CustomButton';
import { useAppDispatch, useAppSelector } from '../Hooks/useRedux';
import { selectorHealth } from '../Redux/Store/selectors';
import { $JsonHelper } from '../Helper/$JsonHelper';
import { $Service_Url } from '../../components/network/UrlPath';
import { useLoader } from '../utils/utils';
import { fetchmedication, fetchUsermedication, updateuserMedicationList } from '../Redux/Reducers/healthISlice';
import { setLoader } from '../Redux/Reducers/uiSlice';
import { postApiCall } from '../../components/Reusable/ReusableCom';
import { globalContext } from '../../pages/_app';
import OtherInfo from '../../components/asssets/OtherInfo';
import Other from '../../components/asssets/Other';
const AddMedications = ({ setaddMedication, addEdit, setaddEdit, setEdituser, editUser, selectedUser, userMedicationList, fetchApi, setrender }) => {
  let medicationRef = useRef(null)
  const healthApiData = useAppSelector(selectorHealth);
  const { medicationList } = healthApiData;
  const dispatch = useAppDispatch();
  const [isError, setError] = useState("")
  const { setWarning } = useContext(globalContext)
  const { newConfirm } = useContext(globalContext)
  const tableHeader = ["Medication", "Dosage", "Frequency", "Timing", "Note", "Edit/Delete"]


  useEffect(() => {
    if (!addEdit) {
      setEdituser({ ...$JsonHelper.newFormDataObj() });
      setError("");
    }
  }, [addEdit, setEdituser]);

  const handleChange = (value, key) => {
    setEdituser((prev) => ({ ...prev, [key]: key == 'medicationId' ? value.value : value }))
    setError("");
  }


  const handleAddAnother = () => {
    setEdituser({ ...$JsonHelper.newFormDataObj() })
  }

  const handleSubmit = async (type) => {
    if (!isvalidate()) {
      return;
    }
    useLoader(true);
    let jsonObj = {
      'userId': selectedUser.userId,
      'userMedications': [editUser],
      'UpsertedBy': selectedUser.userId
    }
    if (editUser.medicationId == null) {
      // setError(true);
      useLoader(false);
      return;
    }
    const responseMedication = await postApiCall('POST', $Service_Url.UpsertUserMedication, jsonObj)

    if (responseMedication != 'err') {
      if (editUser?.medicationId == '999999') {
        await medicationRef.current.saveHandleOther(responseMedication?.data?.data?.userMedications[0]?.userMedicationId);
      }
      toasterAlert('successfully', `Successfully ${editUser.userMedicationId == 0 ? 'saved' : 'updated'} data`, `Your data have been ${editUser.userMedicationId == 0 ? 'saved' : 'updated'} successfully`)
      fetchApi(selectedUser.userId);
      setaddMedication(false)
      setrender(true);

      if (type == 'Save') {
        setEdituser({ ...$JsonHelper.newFormDataObj() });
      }
      handleAfterDelete();

    }
    useLoader(false);
  }

  const updateMember = (data) => {
    useLoader(true);
    handleAddAnother()
    setaddEdit(true);
    setEdituser(data);
    useLoader(false);

  }


  const deleteMember = async (data) => {

    const confirmRes = await newConfirm(true, "Are you sure you want to delete this medication ? This action cannot be undone.", "Confirmation", "Delete Medication", 2);

    if (!confirmRes) return;
    handleSubmitData(data);
    // fetchApi(selectedUser.userId)
  }


  const handleAfterDelete = () => {
    handleAddAnother()
    setaddEdit(false);
    setEdituser({ ...$JsonHelper.newFormDataObj() })
        
    // setaddMedication(false);
  }
  const handleSubmitData = async (data) => {
    let deleteJson = { ...data, isActive: false }
    let jsonObj = {
      'userId': selectedUser.userId,
      'userMedications': [deleteJson],
      'UpsertedBy': selectedUser.userId
    }
    const responseMedication = await postApiCall('POST', $Service_Url.UpsertUserMedication, jsonObj)

    if (responseMedication != 'err') {
      handleAfterDelete();
      toasterAlert("successfully", "Successfully", `Medication has been deleted successfully.`);
      fetchApi(selectedUser.userId)
    }
    useLoader(false);
  }

  const isvalidate = () => {
    let isErr = false;
    if (!editUser.medicationId || editUser.medicationId == 0) {
      setError(" Medication type  cannot be empty");
      isErr = true;
    }
    return isErr == false;
  }

  const toasterAlert = (type, title, description) => {
    setWarning(type, title, description);
  }

  return (
  <div id="newModal" className='modals'>
    <div className="modal" style={{ display: 'block', height:'95vh',borderRadius:'8px'}}>
      <div className="modal-dialog costumModal" style={{ maxWidth: '400px'}}>
        <div className="costumModal-content">
          <div className="modal-header py-0 py-10" style={{background:'#F8F8F8'}}>
            <h5 className="modal-title ms-1">{addEdit == false ? 'Add' : "Edit"} Medications</h5>
            <img className='mt-0 me-1 cursor-pointer'onClick={()=>{setaddMedication(false); setaddEdit(false)}} src='/icons/closeIcon.svg'></img>
          </div>
        {/* <p>{addEdit == false ? 'Add' : "Edit"} Details about your medication & supplements</p> */}
          <div className="costumModal-body w-100 addMedication pt-0">
            <Col className='col-12 mt-10'>
              <CustomSearchSelect
              className='w-100 align-items-center mx-auto'
                label="Medication type*"
                isError={isError}
                placeholder="Select"
                options={[...medicationList].sort((a, b) => {
                  if (a.value === '999999') return -1; // Keep '999999' at the top
                  if (b.value === '999999') return 1;  // Keep '999999' at the top
                  return a.label.localeCompare(b.label); // Sort other items in ascending order by label
                })}
                value={editUser.medicationId}
                onChange={(e) => handleChange(e, 'medicationId')}
              />
              {editUser.medicationId == '999999' &&
                <Other othersCategoryId={38} userId={selectedUser.userId} dropValue={editUser.medicationId} natureId={editUser.userMedicationId} ref={medicationRef} />}
            </Col>
            <Col className='col-12 mt-10'>
              <CustomInput label="Dosage" placeholder="e.g 500mg / 500ml" value={editUser.doseAmount} onChange={(e) => handleChange(e, 'doseAmount')} />
            </Col>
            <Col className='col-12 mt-10'>
              <CustomInput label="How often do you take this?" placeholder="e.g twice daily" value={editUser.frequency} notCapital={true} onChange={(e) => handleChange(e, 'frequency')} />
            </Col>
            <Col className='col-12 mt-10'>
              <CustomInput label="Timing" placeholder="e.g morning / evening / daily" value={editUser.time} notCapital={true} onChange={(e) => handleChange(e, 'time')} />
            </Col>

            <Col className="col-12 mt-10">
              <CustomTextarea label="Note" notCapital={true} placeholder="Additional notes or instructions from the prescribing doctor" value={editUser?.doctorPrescription} onChange={(e) => handleChange(e, 'doctorPrescription')} />
            </Col>

          <div className='d-flex justify-content-end mt-10'>
            <CustomButton label={addEdit == false ? 'Save' : "Update"} onClick={() => { handleSubmit('Save') }} />
          </div>

          {/* <Row>
            <Col className=' rounded col-12 mt-10 p-4'>
              <div id="information-table" className="mt-4 information-table">
                <div className='d-flex justify-content-between p-2 m-2  '>
                  <div className='d-flex p-2'>


                    <h4>Medications You Take</h4>
                    <span className='ms-4' style={{ height: "22px", paddingLeft: "10px", paddingRight: "10px", color: "#720D21", backgroundColor: "#F1E7E9", borderRadius: "10px", fontWeight: "Bold", textWrap: "noWrap", display: "flex", alignItems: "center" }}>{userMedicationList?.length} Added</span>
                  </div>

                </div>

                <div className='table-responsive fmlyTableScroll'>
                  <Table className="custom-table mb-0">
                    <thead className="sticky-header">
                      <tr>
                        {tableHeader.map((item, index) => (
                          <th key={index}>{item}</th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className=''>
                      {userMedicationList?.map((item, index) => {
                        const { medicationName, doseAmount, frequency, time, doctorPrescription } = item;

                        return (
                          <tr key={index}>
                            <td><OtherInfo key={index} othersCategoryId={38} userId={selectedUser.userId} othersMapNatureId={item.userMedicationId} FieldName={item.medicationName || "-"} /></td>
                            <td>{doseAmount || "-"}</td>
                            <td>{frequency || "-"}</td>
                            <td>{time || "-"}</td>
                            <td>{doctorPrescription || "-"}</td>
                            <td>
                              <div className="d-flex justify-content-start gap-4">
                                <img src="/New/icons/edit-Icon.svg" alt="Edit Icon" className="icon cursor-pointer" onClick={() => updateMember(item)} />
                                <img src="/New/icons/delete-Icon.svg" alt="Delete Icon" className="icon cursor-pointer" onClick={() => deleteMember(item)} />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                  </Table>
                </div>
              </div>
            </Col>
          </Row> */}
          </div>
        </div>
     </div>
   </div>
  </div>
  )
}

export default AddMedications