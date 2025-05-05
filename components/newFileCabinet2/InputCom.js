import { Col, Row, Form } from "react-bootstrap"
import konsole from "../control/Konsole"
export const InputCom = ({ label, type, disable, id, placeholder, value, handleInputChange }) => {
    return (<>
        <Row className="mt-2">
            <Col lg='5'><div className="d-flex align-items-center w-100 h-100"><h6 className="file-form-h6-tag">{label}</h6></div></Col>
            <Col lg='7'><div>
                <Form.Control as={type === 'textarea' ? 'textarea' : 'input'} type={type === 'textarea' ? undefined : type} rows={type === 'textarea' ? 3 : undefined} disabled={disable} id={id} className="w-100" placeholder={placeholder} onChange={handleInputChange} value={value} />
            </div></Col>
        </Row>
    </>)
}

export const InputSelectCom = ({ label, placeholder, id, disable, selectTypeValue, selectTypeLabel, selectInfo, value, handleSelectChange ,onBlurfun}) => {
    // konsole.log('selectInfo', selectInfo)
    return (
        <Row className="mt-2">
            <Col lg="5"><div className="d-flex align-items-center w-100 h-100"><h6 className="file-form-h6-tag">{label}</h6></div></Col>
            <Col lg="7">
                <div>
                    <Form.Select aria-label="Default select example" disabled={disable} value={value} onChange={handleSelectChange} id={id} onBlur={onBlurfun}s>
                        <option value='' disabled defaultValue>{placeholder}</option>
                        {selectInfo?.map((item, index) => (<option key={index} value={item[selectTypeValue]}> {item[selectTypeLabel]}  </option>))}
                    </Form.Select>
                </div>

            </Col>
        </Row>

    )
}
