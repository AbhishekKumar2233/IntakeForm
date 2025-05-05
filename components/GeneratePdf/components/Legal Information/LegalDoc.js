import React, { Component } from 'react'
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap"
import { $Service_Url } from "../../../network/UrlPath";
import { $CommonServiceFn } from '../../../network/Service';
import {$AHelper} from '../../../control/AHelper';
import OtherInfo from '../../../asssets/OtherInfo';

export class LegalDoc extends Component {
     constructor(props) {
        super(props);
        this.state = {
            userId: (props.memberId !== null && props.memberId !== '') ? props?.memberId : '',
            showLegalDoc: false,
            legalDocType: [],
            legalDocument: [],
            legalDocTypeId: 0,
            dateExecuted: "",
            docName:'',
            docPath: '',
            natureId: "",

        }
        this.legalDocRef = React.createRef();

    }

    componentDidMount() {
        if (this.state.userId !== '') {
            this.setState({
                userId: this.props.memberId,
            });
            this.fetchLegalDocument(this.props.memberId)
        }
    }

    fetchLegalDocument = (newuserid) => {
        let userId = newuserid || this.state.userId
        
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getLegalDocument + userId + "/0",
            "", (response) => {
                if (response) {
                    
                    this.setState({
                        ...this.state,
                        legalDocument: response.data.data.legalDocuments,
                    });
                }
            })
    }
    render() {

        return (
            <>


                {this.state.legalDocument?.length > 0 ? <div>
                        <div className="pb-3 pt-1">
                            <Form.Group as={Row} className="my-4">
                                <Col lg="12 financialInformationTable">
                                    <Table  bordered>
                                        <thead>
                                        <tr>
                                            <th>Documents</th>
                                            <th>Date Executed</th>
                                        </tr>
                                        </thead>
                                        
                                        <tbody className="my-4">
                                        { this.state.legalDocument && 
                                        this.state.legalDocument.map((l,index)=>{
                                            return(
                                            <tr key={index} >
                                                <td>
                                                <OtherInfo
                                                    key={l?.userLegalDocId}
                                                    othersCategoryId={14}
                                                    othersMapNatureId={l?.userLegalDocId}
                                                    FieldName={l.legalDocType}
                                                    userId={this.state.userId}
                                                />
                                                </td>
                                                <td>{l?.dateExecuted ? $AHelper.getFormattedDate(l.dateExecuted) : ''}</td>
                                            </tr>
                                            )
                                        })
                                        }
                                        </tbody>
                                    </Table>
                                </Col>
                            </Form.Group>
                        </div>
                        
                    </div> : <p>(Not provided)</p>}
            </>
        )
    }
}




export default LegalDoc;
