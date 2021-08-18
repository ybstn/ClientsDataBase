import React, { Component } from 'react';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Form, FormGroup, Label, Input, Button, Col } from 'reactstrap';
const defaultClientImage = "../ClientImages/EmptyUserRound.png";


export class RecordForm extends Component {

    constructor(props) {
        super(props);
        this.state = { data: this.props.recordData, date: this.props.RecDate, typeWork: "", color: "", summ: "", comment: "", imageSrc: this.props.RecordImage, imageFile: null, errors: [], errorsMsg: [] };
        this.saveFile = this.saveFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.validate = this.validate.bind(this);
        this.applyErrorClass = this.applyErrorClass.bind(this);
        this.applyErrorText = this.applyErrorText.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onColorChange = this.onColorChange.bind(this);
        this.onSummChange = this.onSummChange.bind(this);
        this.onCommentChange = this.onCommentChange.bind(this);
    }
    componentDidMount() {
        if (this.state.data) {
            this.setState({ date: this.state.data.workDate, typeWork: this.state.data.workType, summ: this.state.data.workSumm, color: this.state.data.workColors, comment: this.state.data.workComment, imageSrc: this.state.data.workPhoto });
        }
    }
    onDateChange(e) {
        this.setState({ date: e.target.value });
    }
    onTypeChange(e) {
        this.setState({ typeWork: e.target.value });
    }
    onColorChange(e) {
        this.setState({ color: e.target.value });
    }
    onSummChange(e) {
        this.setState({ summ: e.target.value });
    }
    onCommentChange(e) {
        this.setState({ comment: e.target.value });
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
    validate(e) {
        let temp = {};
        temp.date = this.state.date.toString() === "" ? false : true;
        temp.typeWork = this.state.typeWork === "" ? false : true;
        temp.summ = this.state.summ.toString() === "" ? false : true;
        this.setState({ errors: temp });

        let tempMsg = {};
        tempMsg.date = this.state.date.toString() === "" ? "Укажите дату" : "";
        tempMsg.typeWork = this.state.typeWork === "" ? "Укажите тип работы" : "";
        tempMsg.summ = this.state.summ.toString() === "" ? "Укажите сумму" : "";
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
            let workColor = this.state.color === null ? "":this.state.color;
            let workComment = this.state.comment === null ? "" : this.state.comment;
            let workDate = this.state.date.toString();
            let workType = this.state.typeWork;
            let workSumm = this.state.summ.toString();
            let recordPhoto = null;
            let recordPhotoUrl = this.state.imageSrc;
            if (this.state.imageFile) {
                recordPhoto = this.state.imageFile;
            }
            else {
                recordPhoto = recordPhotoUrl;
            }

            this.props.onRecordSubmit({ workDate: workDate, workType: workType, workSumm: workSumm, workColors: workColor, workComment: workComment, workPhoto: recordPhoto, photoTemp: recordPhotoUrl });
        }
    }
    render() {
        let usImage = this.state.imageSrc;
        let usImageName = usImage.slice(usImage.lastIndexOf('/'));
        let usImagePath = usImage.replace(usImageName, "");
        let usThumb = usImagePath + "/Thumb" + usImageName;

        let isImgsrc = "";
        if (this.state.imageSrc.includes("EmptyUserRound.png") || this.state.imageSrc.includes("data:image/")) {
            isImgsrc = this.state.imageSrc;
        }
        else {
            isImgsrc = usThumb;
        }
        return (
            <Form onSubmit={this.onSubmit}>
                <ModalBody>
                    <FormGroup row>
                        <Label for="RecordImgFile" className="PhotoLabel" sm={2}>Фото</Label>
                        <Col sm={10}>
                            <img src={isImgsrc} alt="Фото записи" className="AddFormImage" />
                            <Input type="file" accept="image/*" name="file" id="RecordImgFile" onChange={this.saveFile} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="dateInput" sm={3}>Дата</Label>
                        <Col sm={9}>
                            <input type="date"
                                className={"" + this.applyErrorClass('date')}
                                id="dateInput"
                                value={this.state.date}
                                onChange={this.onDateChange} />
                            <div className="invalid-field">{this.applyErrorText('date')}</div>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="typeInput" sm={3}>Вид работы</Label>
                        <Col sm={9}>
                            <input type="text"
                                className={"" + this.applyErrorClass('typeWork')}
                                id="typeInput"
                                placeholder="вид работы"
                                value={this.state.typeWork}
                                onChange={this.onTypeChange} />
                            <div className="invalid-field">{this.applyErrorText('typeWork')}</div>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="summInput" sm={3}>Сумма</Label>
                        <Col sm={9}>
                            <input type="number"
                                min="0"
                                step="any"
                                className={"" + this.applyErrorClass('summ')}
                                id="summInput"
                                placeholder="0"
                                value={this.state.summ}
                                onChange={this.onSummChange} />
                            <div className="invalid-field">{this.applyErrorText('summ')}</div>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="colorInput" sm={3}>Детали</Label>
                        <Col sm={9}>
                            <input type="text"
                                className="RecordCommentInput"
                                id="colorInput"
                                placeholder="детали"
                                value={this.state.color || ''}
                                onChange={this.onColorChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="commentInput" sm={3}>Комментарий</Label>
                        <Col sm={9}>
                            <textarea
                                rows="4"
                                className="RecordCommentInput"
                                id="commentInput"
                                placeholder="комментарий"
                                value={this.state.comment || ''}
                                onChange={this.onCommentChange} />
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