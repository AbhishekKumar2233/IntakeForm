import React, { Component } from 'react'
import { Button, Form, OverlayTrigger,Popover } from 'react-bootstrap'
import konsole from '../control/Konsole'

export default class describePopover extends Component {
    constructor(props){
        super(props)
        this.state = {
            showPopover: false,
            remarks: "",
        }
    }

    handleCheckBox = (event) => {
        const eventValue = event.target.value;
        const eventChecked = event.target.checked;
        if (eventChecked) {
            this.setState({
                showPopover: true,
            })
        }
    }

    handleChange = (event) => {

        const eventValue = event.target.value;
        this.setState({
            remarks: eventValue,
        })

    }

    handleDescPopover = () => {
        this.setState({
            showPopover: !this.state.showPopover,
        })
    }

    handleInput = (relationshipId, diseaseId) => {
        this.props.handleDescPopoverDetail(relationshipId, diseaseId, this.state.remarks);
        this.handleDescPopover();
    }

    render() {
        const prelationshipId = this.props.relationshipId || "";
        const pdiseaseId = this.props.diseaseId || "";
        


        const popover = (relationshipId, diseaseId) => (
            <Popover id="popover-basic" className="w-75">
                <Popover.Body className="py-0">
                    <div className="d-flex justify-content-between align-items-center my-3">
                        <Form.Group className="mb-3 w-100" controlId="exampleForm.ControlTextarea1">
                        <Form.Control className="" as="textarea" value={this.state.remarks} name="remarks" id="remarks" rows={3} placeholder="Describe" onChange={(event) => this.handleChange(event)}/>
                        </Form.Group>
                    </div>
                    <div className="d-flex justify-content-end align-items-center my-3">
                        <div className="d-flex justify-content-between">
                            <Button onClick={this.handleDescPopover} className="light-btn me-3"> Cancel </Button>
                            <Button className="theme-btn" onClick={()=> this.handleInput(relationshipId, diseaseId)}>
                                Save
                            </Button>
                        </div>
                    </div>
                </Popover.Body>
            </Popover>
            );
        return (
            <>
                <OverlayTrigger
                    trigger="click"
                    placement="right"
                    show={this.state.showPopover}
                    overlay={() => popover(prelationshipId, pdiseaseId)}
                >
                    <div key="inline-checkbox" className="rn-checkbox">
                    <Form.Check
                        inline
                        label=""
                        name="group1"
                        type="checkbox"
                        defaultChecked={this.props.FetchedFatherDiseases && this.props.FetchedFatherDiseases.length > 0 && this.props.FetchedFatherDiseases.some(v => v.diseseId == pdiseaseId && v.isSuffering == true)}
                        onClick = {(event) => this.handleCheckBox(event)}
                    />
                    </div>
                </OverlayTrigger>
            </>
        )
    }
}
