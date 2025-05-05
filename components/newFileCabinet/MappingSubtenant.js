import React, { useState, useEffect, useContext } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { InputCom, InputSelectCom } from './InputCom'
import Services from '../../network/Services';
import konsole from '../../network/konsole';
import commonLib from '../../control/commonLib';
import { operationForCabinet } from '../../control/Constant';
import { FileCabinetContext } from './ParentCabinet';

const MappingSubtenant = ({ apiCallUpsertMainCabinet }) => {
    let { allMainCabinetContainer } = useContext(FileCabinetContext)
    const stateObj = commonLib.getObjFromStorage("stateObj");

    // define state---------------------------------------
    const [subtenantList, setSubtenantList] = useState([])
    const [selectSubtenantForMapping, setSelectSubtenantForMapping] = useState([])
    const [cabinetId, setCabinetId] = useState('')
    const [screenCol, setScreenCol] = useState(10)
    const [subtenantSelectionRadio, setSubtenantSelectionRadio] = useState(0)
    //  define useEffect----------------------------------------------------------------------------------------------------------------------------------------------------------

    useEffect(() => {
        callApigetAllSubtenantDetails()
    }, [])

    const callApigetAllSubtenantDetails = () => {
        Services.getAllSubtenantDetails({ isActive: true }).then((res) => {
            konsole.log('res of all subtenants', res)
            setSubtenantList(res?.data?.data)
        }).catch((err) => konsole.log('err in all subtenants fetch', err))
    }


    //  handle Subtenant Checkbox --------------------------------------------------------------------------------------------------------------------------------------------------------
    const handleChangeSubtenantCheckBox = async (index, e) => {
        let { value, checked } = e.target
        konsole.log('checked', checked)
        setSubtenantList((prevArray) => {
            const newArray = [...prevArray];
            newArray[index]['checked'] = checked;
            return newArray;
        });
        forAddDeleteSubtenantFromJson(checked, value)
    }

    //  handle radio subtenant --------------------------------------------------------------------------------------------------------------------------------------------------------
    const handleChangeRadio = async (e) => {
        konsole.log('value', e.target.value)
        let { value } = e.target
        setScreenCol(7)
        setSubtenantSelectionRadio(value)
        let newArr = [...subtenantList]
        for (let [index, { subtenantId }] of newArr.entries()) {
            konsole.log('itemitem', subtenantId)
            if (value == 1) {
                newArr[index]['checked'] = true
                forAddDeleteSubtenantFromJson(true, subtenantId)
            } else {
                newArr[index]['checked'] = false
                forAddDeleteSubtenantFromJson(false, subtenantId)
            }
        }
        setSubtenantList(newArr)

    }

    const forAddDeleteSubtenantFromJson = async (checked, value) => {
        if (checked == true) {
            let userId = await getUserListBySubtenantId(value)
            setSelectSubtenantForMapping(prevState => [...prevState, { subtenantId: Number(value), categoryCreatedBy: userId }]);
        } else if (checked == false) {
            setSelectSubtenantForMapping((prevArray) => {
                return prevArray.filter(({ subtenantId }) => subtenantId !== Number(value))
            })
        }
    }

    //  get Subtenant Admin userId --------------------------------------------------------------------------------------------------------------------------------------------------------
    const getUserListBySubtenantId = (subtenantId) => {
        return new Promise((resolve, reject) => {
            Services.getUserListBySubtenantId({ subtenantId: subtenantId }).then((res) => {
                konsole.log('res in get user list', res)
                let responseData = res?.data?.data[0]
                resolve(responseData?.userId)
            }).catch((err) => {
                konsole.log('err in get user list', err)
                resolve(null)
            })
        })

    }

    
    const saveMappingFun = () => {
        if(cabinetId=='') {
            alert('pls select cabinet')
            return;
        }
        let postJson = {
            "cabinetId": Number(cabinetId),
            "cabinetOperation": operationForCabinet[1],
            "fileCategoryTypeMappingList": selectSubtenantForMapping
        }
        konsole.log('jsonObj', postJson, JSON.stringify(postJson))
        apiCallUpsertMainCabinet(postJson)
        
    }
    //  warinnig toaster------------------------------------------------------------------------------------------------------------------------
    
    konsole.log('subtenantListsubtenantList', subtenantList)
    konsole.log('selectSubtenantForMapping', selectSubtenantForMapping)
    return (
        <>
            <Row>
                <Col lg='12' className='main-col'>

                    <Row>
                        <Col>  <h4 style={{ color: "#720c20" }}>Manage Your subtenant mapping</h4> </Col>
                    </Row>

                    <Row className='mt-2'>
                        <Col lg={screenCol}>
                            <InputSelectCom label='Select cabinet' placeholder='Select any Cabinet' id='cabinetId' selectTypeValue='cabinetId' selectTypeLabel='cabinetName' selectInfo={allMainCabinetContainer} value={cabinetId} handleSelectChange={(e) => setCabinetId(e.target.value)} />
                            <InputRadio label='All subtenants' id='1' value='1' checked={subtenantSelectionRadio == 1} handleChangeRadio={handleChangeRadio} />
                            <InputRadio label='Specific subtenanta' id='2' value='2' checked={subtenantSelectionRadio == 2} handleChangeRadio={handleChangeRadio} />
                            <Row className='mt-2'><Col lg="5"></Col><Col lg="7">
                             <Button className='folder-save-button' onClick={() => saveMappingFun()} >Save</Button></Col></Row>
                        </Col>
                        {subtenantSelectionRadio !== 0 && <Col lg="4">
                            <h6 className="filetool-text-tag-h6 mx-2">Choose subtenants</h6>
                            <div className='w-100 border-left' style={{ maxHeight: '11rem', overflowX: 'auto' }}>
                                {subtenantList.length > 0 && subtenantList.map((item, index) => {
                                    return (<>
                                        <Form.Group className="ms-2 checkbox-group">
                                            <Form.Check type="checkbox"
                                                label={<span className="custom-checkbox-label">{item.subtenantName}</span>}
                                                className="custom-checkbox"
                                                value={item.subtenantId}
                                                onChange={(e) => handleChangeSubtenantCheckBox(index, e)}
                                                checked={item.checked}
                                            />
                                        </Form.Group>
                                    </>)
                                })}
                            </div>
                        </Col>}
                    </Row>

                </Col>
            </Row>
            <hr />
        </>
    )
}


const InputRadio = ({ label, disable, id, handleChangeRadio, checked, value }) => {
    return (<>
        <Row className={`${id == 1 ? 'mt-2' : 'mt-0'}`}>
            <Col lg="5"></Col>
            <Col lg="7"><div>
                <Form.Check type='radio' label={label} disabled={disable} name={label} id={id} value={value} className="w-75 " onChange={handleChangeRadio} checked={checked} />
            </div></Col>
        </Row>
    </>)
}



export default MappingSubtenant