import React, { useState, useEffect, useContext } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { InputCom } from './InputCom'
import Services from '../../network/Services';
import konsole from '../../network/konsole';
import commonLib from '../../control/commonLib';
import { createCabinetObjJson, operationForCabinet } from '../../control/Constant';
import { FileCabinetContext } from './ParentCabinet';
import Operation from 'antd/lib/transfer/operation';

const AddCabinet = ({ apiCallUpsertMainCabinet }) => {
    let { allMainCabinetContainer } = useContext(FileCabinetContext)
    const stateObj = commonLib.getObjFromStorage("stateObj");
    // define state---------------------------------------
    const [manageUpdate, setManageUpdate] = useState({ updatedBy: stateObj.userId, updatedOn: new Date().toISOString() })
    const [manageCreate, setManageCreate] = useState({ createdBy: stateObj.userId, createdOn: new Date().toISOString() })
    const [subtenantList, setSubtenantList] = useState([])

    const [cabinetName, setCabinetName] = useState('')
    const [cabinetDescription, setcabinetDescription] = useState('')
    const [subtenantSelectionRadio, setSubtenantSelectionRadio] = useState(0)
    const [cabinetActionType, setCabinetActionType] = useState('addCabinet')
    const [screenCol, setScreenCol] = useState(10)
    //  define useEffect----------------------------------------------------------------------------------------------------------------------------------------------------------

    useEffect(() => {
        callApigetAllSubtenantDetails()
    }, [])

    const callApigetAllSubtenantDetails = () => {
        Services.getAllSubtenantDetails({ isActive: true, createdBy: stateObj.userId }).then((res) => {
            konsole.log('res of all subtenants', res)
            setSubtenantList(res?.data?.data)
        }).catch((err) => konsole.log('err in all subtenants fetch', err))
    }
    // handle radio--------------------------------------------------
    const handleChangeRadio = (e) => {
        setSubtenantSelectionRadio(e.target.value)
        setScreenCol(7)
    }
    const handleChangeSubtenantCheckBox = (e) => {
        console.log('eeeee', e)
    }
    const saveCabinet = () => {
        if (cabinetName == '') return
        let postJson = createCabinetObjJson({ ...manageCreate, cabinetDescription, cabinetName, cabinetOperation: operationForCabinet[0] })
        console.log('postJson', postJson)
        apiCallUpsertMainCabinet(postJson)
    }
    return (
        <>
            <Row>
                <Col lg='12' className='main-col'>

                    {allMainCabinetContainer.length == 0 &&
                        <Row>
                            <Col>  <h4 style={{ color: "#720c20" }}>Manage Your Cabinet</h4> </Col>
                        </Row>}
                    {cabinetActionType == 'addCabinet' &&
                        <Row className='mt-2'>
                            <Col lg={screenCol}>
                                <InputCom label='Name' placeholder='Enter Name' value={cabinetName} handleInputChange={(e) => setCabinetName(e.target.value)} />
                                <InputCom type='textarea' label='Description' id='fileCategoryDescription' value={cabinetDescription} placeholder='Description' handleInputChange={(e) => setcabinetDescription(e.target.value)} />
                                {/* <InputRadio label='All Subtenants' id='1' value='1' checked={subtenantSelectionRadio == 1} handleChangeRadio={handleChangeRadio} />
                                <InputRadio label='Specific Subtenanta' id='2' value='2' checked={subtenantSelectionRadio == 2} handleChangeRadio={handleChangeRadio} /> */}
                                <Row className='mt-2'><Col lg="5"></Col><Col lg="7"> <Button className='folder-save-button' onClick={() => saveCabinet()} >Save</Button></Col></Row>
                            </Col>
                            {subtenantSelectionRadio !== 0 && <Col lg="4">
                                <div className='w-100 border-left' style={{ height: '100%' }}>
                                    <h5 className="filetool-text-tag-h6 mx-2">Choose Subtenants</h5>
                                    {subtenantList.length > 0 && subtenantList.map((item, index) => {
                                        return (<>
                                            <Form.Group className="ms-2 checkbox-group">
                                                <Form.Check type="checkbox"
                                                    label={<span className="custom-checkbox-label">{item.subtenantName}</span>}
                                                    className="custom-checkbox"
                                                    value={item.subtenantId}
                                                    onChange={handleChangeSubtenantCheckBox}
                                                />
                                            </Form.Group>
                                        </>)
                                    })}
                                </div>
                            </Col>}
                        </Row>
                    }
                </Col>
            </Row>
            <hr />
        </>
    )
}

const InputRadio = ({ label, disable, id, handleChangeRadio, checked, value }) => {
    return (<>
        <Row className="mt-0">
            <Col lg="5"></Col>
            <Col lg="7"><div>
                <Form.Check type='radio' label={label} disabled={disable} name={label} id={id} value={value} className="w-100 " onChange={handleChangeRadio} checked={checked} />
            </div></Col>
        </Row>
    </>)
}

export default AddCabinet