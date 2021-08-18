import React, { Component } from 'react';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Form, FormGroup, Label, Input, Button, Col, Alert } from 'reactstrap';

export class RecordDeleteForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.recordData
        };
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(e) {
        e.preventDefault();
        this.props.onRecordSubmit({ workDate: this.props.recordData.workDate, workType: this.props.recordData.workType });
    }
    render() {

        return (
            <Form onSubmit={this.onSubmit}>
                <ModalBody>
                    <FormGroup row>

                        <Col sm={12}>
                            <span>Вы действительно хотите удалить запись "
                                <span style={{ fontWeight: 'bold' }}>{this.props.recordData.workType}</span>
                               " дата: <span>{this.props.recordData.workDate}</span>?
                                </span>
                        </Col>
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={this.props.onCloseModal}>Отмена</Button>
                    {' '}
                    <input type="submit" className="btn btn-info modal-btn" value="Удалить" />
                </ModalFooter>
            </Form>
        );
    }
}
