import React, { Component } from 'react';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Form, FormGroup, Label, Input, Button, Col, Alert} from 'reactstrap';

export class ClientDeleteForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.clientData
        };
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(e) {
        e.preventDefault();
        this.props.onClientSubmit({ name: this.state.data.name, phone: this.state.data.phone });
    }
    render() {
       
        return (
            <Form onSubmit={this.onSubmit}>
                <ModalBody>
                    <FormGroup row>
                      
                        <Col sm={12}>
                            <span>Вы действительно хотите удалить клиента "
                                <span style={{ fontWeight: 'bold' }}>{this.state.data.name}</span>
                            "?</span>
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
