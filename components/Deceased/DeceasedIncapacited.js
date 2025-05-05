import React, { useState, useEffect,useContext } from 'react'
import { Container, Card, Row, Col, Button,Form } from 'react-bootstrap';
import DeceasedList from './DeceasedList';
import IncapacitatedList from './IncapacitatedList';
import AddDeceasedIncapacitited from './AddDeceasedIncapacitited';
import { $Service_Url } from '../network/UrlPath';
import { getApiCall, isValidateNullUndefine } from '../Reusable/ReusableCom';
import konsole from '../control/Konsole';
import { postApiCall } from '../Reusable/ReusableCom';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from 'react-redux';
import { globalContext } from '../../pages/_app';
import AlertToaster from '../control/AlertToaster';


const DeceasedIncapacited = ({dispatchloader}) => {
    const { setdata } = useContext(globalContext)
    const context = useContext(globalContext);

    const primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId')
    const loggedInUserId = sessionStorage.getItem('loggedUserId')

    const [genderList, setGenderList] = useState([])
    const [suffixList, setSuffixList] = useState([])
    const [memberStatusList, setMemberStatusList] = useState([])


    const [isShowDeceased, setIsShowDeceased] = useState(false)
    const [showScreenType, setShowScreenType] = useState('Deceased')
    const [showScreenTypeId, setShowScreenTypeId] = useState(2)
    const [addDeceasedIncapacted, setAddDeceasedIncapacted] = useState(false)
    const [deceasedIncapacitedList, setDeceasedIncapacitedList] = useState([])
    const [actionType, setActionType] = useState('ADD')
    const [selectedItemValue, setSelectedItemValue] = useState(null)

    useEffect(() => {
        const primaryMemberUserId = sessionStorage.getItem('SessPrimaryUserId');
        fetchApiCall()
        getFamilyMemberListByUserId(primaryMemberUserId);
    }, [])

    //  api call for get master api-----------------------------------------------------------------
    const fetchApiCall = async () => {
        dispatchloader(true)
        await getApiCall('GET', $Service_Url.getGenderListPath, setGenderList)
        dispatchloader(true)
        await getApiCall('GET', $Service_Url.getNameSuffixPath, setSuffixList)
        dispatchloader(true)
        await getApiCall('GET', $Service_Url.getMemberStatus, setMemberStatusList)
        dispatchloader(false)
    }
    //  api call for get master api-----------------------------------------------------------------
    const getFamilyMemberListByUserId = async (userId) => {
        if (isValidateNullUndefine(userId)) return
        dispatchloader(true)
        const response = await getApiCall('GET', $Service_Url.getFamilyMembers + userId+`?RelationshipCategory=5,6`)
        dispatchloader(false)
        konsole.log('resultresult', response)
        if (response == 'err') return;
        setDeceasedIncapacitedList(response)
    }


    //    this function for close and open modal and get api call-----------------------------------------------
    const handleAddCloseModal = (type) => {
        setAddDeceasedIncapacted(type);
        setActionType('ADD');
        setSelectedItemValue(null);
        (type != true) && getFamilyMemberListByUserId(primaryMemberUserId)
    }
    const handleDeseasedAndIncapacitated = (type) => {
        setShowScreenType(type)
        let id = (type == 'Incapacitated') ? 3 : (type == 'Deceased') ? 2 : null
        konsole.log('idForShowScreen', id)
        setShowScreenTypeId(id)
    }


    //    this function for close and open modal and set Updatevalue -----------------------------------------------
    const handleEditFun = (item) => {
        setActionType('EDIT');
        setSelectedItemValue(item);
        setAddDeceasedIncapacted(true)
    }

    //  this function for delete data  form table -----------------------------------------------------------------------------------
    const handleDeleteFun = async (item) => {
        console.log('itemitemitem', item)

        let { memberId, userId, userRelationshipId } = item;
        let deletedBy = loggedInUserId
        let IsDeleteDescendant = false
        let memberRelationshipId = userRelationshipId

        const question = await context.confirm(true, `Are you sure? you want to delete ${showScreenType} person details.`, "Confirmation");
        if (question == false) return;
        let url = $Service_Url.deletememberchild + userId + "/" + memberId + "/" + deletedBy + "/" + memberRelationshipId + "/" + IsDeleteDescendant
        konsole.log('deleted api url', url)
        dispatchloader(true)
        let result = await postApiCall('DELETE', url, '')
        dispatchloader(false)
        if (result == 'err') return
        AlertToaster.success('Data Deleted Successfully.')
        getFamilyMemberListByUserId(primaryMemberUserId)

    }


    //  this is common  function for toaster info-----------------------------------------
    function toasterAlert(text) {
        setdata({ open: true, text: text, type: "Warning" });
    }

    return (
        <>
            {(addDeceasedIncapacted) ? <>
                <AddDeceasedIncapacitited
                    selectedItemValue={selectedItemValue}
                    actionType={actionType}
                    showScreenTypeId={showScreenTypeId}
                    key={addDeceasedIncapacted}
                    handleAddCloseModal={handleAddCloseModal}
                    show={addDeceasedIncapacted}
                    suffixList={suffixList}
                    genderList={genderList}
                    memberStatusList={memberStatusList}

                />
            </> : ""}
            <Container>
                <div className='deceadesIncapacited'>
                    <div className='d-flex justify-content-between mt-2'>
                        <div><span className='fs-5 fw-bold'>Do you wish to Add / Edit Deceased / Incapacitated family member details ?</span></div>
                        <div className='me-4'>
                            {/* <span className='cursor-pointer me-5 fs-5' style={{ color: "blue" }} onClick={() => setIsShowDeceased(!isShowDeceased)}>{(isShowDeceased) ? '- Hide' : '+Show'}</span> */}
                            <Form.Check type="radio" className="left-radio" name="deceased_incapacited" inline label="Yes" checked={isShowDeceased==true}  onChange={() => setIsShowDeceased(true)} />
                            <Form.Check type="radio" className="left-radio" name="deceased_incapacited" inline label="No"  checked={isShowDeceased==false} onChange={() => setIsShowDeceased(false)} />
                        </div>
                    </div>
                    {(isShowDeceased) &&
                        <>
                            <div className='d-flex justify-content-between mb-4'>
                                <div className='mt-2'>
                                    {['Deceased', 'Incapacitated'].map((item, index) => {
                                        return <button key={index} className={`${(item == showScreenType) ? 'theme-btn' : 'ps-2 pe-2'} me-2 p-2`} style={{ borderRadius: "5px", borderColor: '#E0E0E0' }} onClick={() => handleDeseasedAndIncapacitated(item)} >{item}</button>
                                    })}
                                </div>
                            </div>
                            <DeceasedList
                                deceasedList={showScreenTypeId !== null ? deceasedIncapacitedList?.filter(({ memberStatusId }) => memberStatusId === showScreenTypeId) : []}
                                key={showScreenType}
                                handleAddCloseModal={handleAddCloseModal}
                                handleEditFun={handleEditFun}
                                handleDeleteFun={handleDeleteFun}
                            />
                            <div className='d-flex justify-content-between mb-4 m-4'>
                                <h5>If you wish to add  any new Deceased / Incapacitated member kindly fill the details by clicking Add New</h5>
                                <button className="theme-btn me-3 p-2" style={{ borderRadius: "10px" }} onClick={() => handleAddCloseModal(true)} >+ Add New</button>
                            </div>
                        </>
                    }

                </div>
                <hr />
            </Container>
        </>
    )
}

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});
export default connect(mapStateToProps, mapDispatchToProps)(DeceasedIncapacited);
