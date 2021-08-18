import React, { Component } from 'react';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Form, FormGroup, Label, Input, Button, Col } from 'reactstrap';

import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input/input';
const defaultClientImage = "../ClientImages/EmptyUserRound.png";


export class ClientForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.clientData, name: "", phone: "", imageSrc: this.props.defaultPhoto,
            imageFile: null, errors: [], errorsMsg: []
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.validate = this.validate.bind(this);
        this.applyErrorClass = this.applyErrorClass.bind(this);
        this.applyErrorText = this.applyErrorText.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onPhoneChange = this.onPhoneChange.bind(this);
    }
    componentDidMount() {
       
         // If edit client form openinig
        if (this.state.data) {
            this.setState({ name: this.state.data.name, phone: this.state.data.phone });
        }
    }
    saveFile(e) {
        if (e.target.files && e.target.files[0]) {
            let imgeFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                this.setState({ imageFile: imgeFile, imageSrc: x.target.result });
            }
            reader.readAsDataURL(imgeFile);

        }
        else {

            this.setState({ imageFile: null, imageSrc: defaultClientImage });
        }

    }
    onNameChange(e) {
        this.setState({ name: e.target.value });
    }
    onPhoneChange(phone) {
     
        this.setState({ phone: phone });
    }
    validate(e) {
        let temp = {};
        let tempMsg = {};
        temp.name = this.state.name === "" ? false : true;
        tempMsg.name = this.state.name === "" ? "Введите имя клиента" : "";
        if (this.state.phone.length > 2 ) {
            
            temp.phone = (!isPossiblePhoneNumber(this.state.phone)) ? false : true;
            tempMsg.phone = isPossiblePhoneNumber(this.state.phone) ? "" : "Неправильный номер телефона";
        }
       
        this.setState({ errors: temp });
        this.setState({ errorsMsg: tempMsg });

        return Object.values(temp).every(x => x === true);
    }
    applyErrorClass(field) {
        let tempstyle = (field in this.state.errors && this.state.errors[field] === false) ? "invalid-field" : "";
        return tempstyle;
    }
    applyErrorText(field) {
        let errorMsg = (field in this.state.errorsMsg && this.state.errorsMsg[field] !== "") ? this.state.errorsMsg[field] : "";
        return errorMsg;
    }
    onSubmit(e) {
        
        e.preventDefault();
        if (this.validate()) {
        
            let clientName = this.state.name;
            let clientPhone = this.state.phone.length === 0 ? "+7" : this.state.phone;
            let clientPhotoUrl = this.state.imageSrc;
            let clientPhoto = null;
            if (this.state.imageFile) {
                clientPhoto = this.state.imageFile;
            }
            else {
                clientPhoto = clientPhotoUrl;
            }
            this.props.onClientSubmit({ name: clientName, phone: clientPhone, photo: clientPhoto, photoTemp: clientPhotoUrl });
        }
    }
    render() {
        let isImgsrc = "";
        if (this.state.imageSrc.includes("EmptyUserRound.png") || this.state.imageSrc.includes("data:image/")) {
            isImgsrc = this.state.imageSrc;
        }
        else {
            let usImage = this.state.imageSrc;
            let usImageName = usImage.slice(usImage.lastIndexOf('/'));
            let usImagePath = usImage.replace(usImageName, "");
            let usThumb = usImagePath + "/Thumb" + usImageName;
            isImgsrc = usThumb;
        }
        return (
            <Form onSubmit={this.onSubmit}>
               
                <ModalBody>
                    <FormGroup row>
                        <Label for="clientAvaFile" className="PhotoLabel" sm={2}>Фото</Label>
                        <Col sm={10}>
                            <img src={isImgsrc} alt="Фото клиента" className="AddFormImage" />
                            <Input type="file" accept="image/*" name="file" id="clientAvaFile" onChange={this.saveFile} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="nameInput" sm={2}>Имя</Label>
                        <Col sm={10}>
                            <Input type="text"
                                className={"" + this.applyErrorClass('name')}
                                id="nameInput"
                                placeholder="Имя клиента"
                                value={this.state.name}
                                onChange={this.onNameChange} />
                            <div className="invalid-field">{this.applyErrorText('name')}</div>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="phoneInput" sm={2}>Телефон</Label>
                        <Col sm={10}>
                            <PhoneInput
                                id="phoneInput"
                                placeholder="Номер телефона"
                                country="RU"
                                international
                                withCountryCallingCode
                                className={"" + this.applyErrorClass('phone')}
                                value={this.state.phone}
                                onChange={value => this.onPhoneChange(value)}
                            />
                            <div className="invalid-field">{this.applyErrorText('phone')}</div>
                        </Col>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={this.props.onCloseModal}>Отмена</Button>
                    {' '}
                    <input type="submit" className="btn btn-info modal-btn" value="Сохранить" />
                </ModalFooter>
            </Form>
        );
    }
}
