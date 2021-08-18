import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { trackPromise } from "react-promise-tracker";
import { RecordForm } from './RecordForm.js';
import { RecordDeleteForm } from './RecordDeleteForm.js';
import { Row, Col, Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export class ClientRecs extends Component {
    static displayName = "records";
    constructor(props) {
        super(props);
        this.state = { clientRecs: [], clientInfo: [], usId: this.props.location.state.usId, modal: false, ImgZoom: false, seltedRecordId: "" };
        this.SelectRecord = this.SelectRecord.bind(this);
        this.ZoomToggle = this.ZoomToggle.bind(this);
        this.toggle = this.toggle.bind(this);
        this.onAddRecord = this.onAddRecord.bind(this); 
        this.addRecordPromise = this.addRecordPromise.bind(this); 
        this.onEditRec = this.onEditRec.bind(this);
        this.EditRecordPromise = this.EditRecordPromise.bind(this);
        this.onRemoveRec = this.onRemoveRec.bind(this);
        this.RemoveRecPromise = this.RemoveRecPromise.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadDataPromise = this.loadDataPromise.bind(this);
        this.loadClientInfo = this.loadClientInfo.bind(this);
        this.loadClientInfoPromise = this.loadClientInfoPromise.bind(this);
    }
    ZoomToggle() {
        this.setState({
            ImgZoom: !this.state.ImgZoom
        });
    }
    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    // загрузка данных
    loadData() {

        var that = this;
        trackPromise(
            this.loadDataPromise().then(function (datums) {
                var dataRecs = JSON.parse(datums);

                if (dataRecs) {
                    dataRecs.sort((a, b) => a.workDate.localeCompare(b.workDate));
                    dataRecs.reverse();
                    that.setState({ clientRecs: dataRecs });
                }
            })
        );
    }
    loadDataPromise() {
       
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                let xhrString = "/Records/" + this.state.usId;
                var requestHeader = authHeader();
                xhr.open("get", xhrString, true);
                xhr.setRequestHeader("Authorization", requestHeader);
                xhr.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        //handleResponse(xhr);
                        resolve(xhr.responseText);
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };
                xhr.send();

            });
        
    }
    loadClientInfo() {
        var that = this;
        trackPromise(
            this.loadClientInfoPromise().then(function (datums) {
                var cientInfo = JSON.parse(datums);

                if (cientInfo) {
                    that.setState({ clientInfo: cientInfo });
                }
            })
        );
    }
    loadClientInfoPromise() {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            let xhrstring = "/Records/GetUser/" + this.state.usId;
            var requestHeader = authHeader();
            xhr.open("get", xhrstring, true);
            xhr.setRequestHeader("Authorization", requestHeader);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    //handleResponse(xhr);
                    resolve(xhr.responseText);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.send();

        });
    }
    componentDidMount() {
        this.loadClientInfo();
        this.loadData();
    }
    // добавление объекта
    onAddRecord(clientRec) {

        if (clientRec) {
            this.toggle();
            var that = this;
            trackPromise(
                this.addRecordPromise(clientRec).then(function () {
                
                    that.loadData();
                    //that.toggle();
                })
            );
        }
    }
    addRecordPromise(clientRec)
    {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            data.append("workType", clientRec.workType);
            data.append("workDate", clientRec.workDate);
            data.append("workSumm", clientRec.workSumm);
            data.append("workColors", clientRec.workColors);
            data.append("workComment", clientRec.workComment);
            data.append("workPhoto", clientRec.workPhoto);
            let url = "/Records/" + this.props.location.state.usId;
            let xhr = new XMLHttpRequest();
            var requestHeader = authHeader();
            xhr.open("post", url, true);
            xhr.setRequestHeader("Authorization", requestHeader);
            xhr.onload = function () {
                handleResponse(xhr);
                if (xhr.status === 200) {
                    if (this.status >= 200 && this.status < 300) {
                        
                        resolve(handleResponse(xhr));
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }

                }
            };
            xhr.send(data);
        });
    }
    onEditRec(clientRec) {
        if (clientRec) {
            var that = this;
            trackPromise(
                this.EditRecordPromise(clientRec).then(function () {
                    that.loadData();
                })
            );
        }
    }
    EditRecordPromise(clientRec) {
        return new Promise((resolve, reject) => {
            const dataEdit = new FormData();
            dataEdit.append("ClientRecId", clientRec.clientRecId);
            dataEdit.append("ClientId", clientRec.clientId);
            dataEdit.append("workType", clientRec.workType);
            dataEdit.append("workDate", clientRec.workDate);
            dataEdit.append("workSumm", clientRec.workSumm);
            dataEdit.append("workColors", clientRec.workColors);
            dataEdit.append("workComment", clientRec.workComment);
            dataEdit.append("workPhoto", clientRec.workPhoto);
            var xhr = new XMLHttpRequest();
            let url = "/Records/Edit";
            var requestHeader = authHeader();
            xhr.open("post", url, true);
            xhr.setRequestHeader("Authorization", requestHeader);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(handleResponse(xhr));
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.send(dataEdit);
        });
    }
    onRemoveRec(clientRec) {
        if (clientRec) {
            var that = this;
            trackPromise(
                this.RemoveRecPromise(clientRec).then(function () {
                    that.loadData();
                })
            );
               
            }
    }
    RemoveRecPromise(clientRec) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            var url = "/Records/" + clientRec.clientRecId;
            var requestHeader = authHeader();
            xhr.open("delete", url, true);
            xhr.setRequestHeader("Authorization", requestHeader);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    //handleResponse(xhr);
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.send();
        });
    }
    SelectRecord(recordID) {
        this.setState({ seltedRecordId: recordID });
    }
    render() {
        let nowDateTemp = new Date(Date.now());
        let MM = ((nowDateTemp.getMonth() + 1) < 10 ? "0" : "") + (nowDateTemp.getMonth() + 1);
        let dd = (nowDateTemp.getDate() < 10 ? "0" : "") + nowDateTemp.getDate();
        let nowDate = nowDateTemp.getFullYear() + '-' + MM + '-' + dd;
        var remove = this.onRemoveRec;
        var editRec = this.onEditRec;
        var selRecordId = this.state.seltedRecordId;
        var contrPanel = this.SelectRecord;
        var isAnySel = (selRecordId === "") ? false : true;

        let clientImg = "";
        if (this.state.clientInfo.photo && this.state.clientInfo.photo!=="undefined") {
            if (this.state.clientInfo.photo.includes("EmptyUserRound.png")) {
                clientImg = this.state.clientInfo.photo;
            }
            else {
                let usImage = this.state.clientInfo.photo;
                let usImageName = usImage.slice(usImage.lastIndexOf('/'));
                let usImagePath = usImage.replace(usImageName, "");
                let usThumb = usImagePath + "/Thumb" + usImageName;
                clientImg = usThumb;
            }
        }
        let clientPhone = "";
        if (this.state.clientInfo.phone && this.state.clientInfo.phone!=="+7") {
            clientPhone = this.state.clientInfo.phone;
        }
        
        return <div>
            <Row className="justify-content-center py-2 row border-bottom border-dark">
                <Col lg={2} xs={2} className="px-2 align-self-center">
                    <img src={clientImg} alt="Фото" className="ClientInfoAvatar" onClick={this.ZoomToggle} />
                    <Modal isOpen={this.state.ImgZoom} toggle={this.ZoomToggle} className={this.props.className} size="lg">
                        <ModalHeader closeButton toggle={this.ZoomToggle}></ModalHeader>
                        <ImageZoom Image={this.state.clientInfo.photo} onCloseModal={this.ZoomToggle} />
                    </Modal>
                </Col>
                <Col lg={6} xs={6} className="align-self-center RecordsClientInfoText px-0">
                    <b>{this.state.clientInfo.name}</b>
                    <div className="PhoneDiv">{clientPhone}</div>
                </Col>  
                <Col lg={4} xs={4} className="align-self-center">
                    <ButtonToolbar className="buttngroup">
                        <ButtonGroup className="buttngroup" size="sm">
                            <Button className="MenuButton mr-2 btnAdd" color='info' onClick={this.toggle}>
                            </Button>
                            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                                <ModalHeader toggle={this.toggle}>Добавление записи</ModalHeader>
                                <RecordForm onRecordSubmit={this.onAddRecord} RecordImage={this.state.clientInfo.photo} RecDate={nowDate} onCloseModal={this.toggle} />

                            </Modal>
                            <Link to={{ pathname: "/" }}>
                                <Button className="MenuButton btnBack" color='info'>
                                </Button>
                            </Link>
                        </ButtonGroup>
                    </ButtonToolbar>
                </Col>

            </Row>
            <div>
                {
                    this.state.clientRecs.map(function (clientRec) {
                        var isSel = (selRecordId === clientRec.clientRecId) ? true : false;
                        return <ClientRec key={clientRec.clientRecId} onEditRec={editRec} onRemove={remove} isSelected={isSel} SelectRecord={contrPanel} selectRecordId={selRecordId} clientRec={clientRec} />
                    })

                }
                <div className="ControlsPanelListComensator py-2" style={{ display: isAnySel ? 'block' : 'none' }}></div>
            </div>

        </div>;
    }
}

class ClientRec extends React.Component {

    constructor(props) {
        super(props);
        this.state = { data: this.props.clientRec, showEditModal: false, showDeleteModal: false, ImgZoom: false, isThisSelected: this.props.isSelected, selRecordId: this.props.selectRecordId };
        this.ZoomToggle = this.ZoomToggle.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleDelete = this.toggleDelete.bind(this);
        this.onEditRec = this.onEditRec.bind(this);
        this.onRemoveRec = this.onRemoveRec.bind(this);
        this.onShowControls = this.onShowControls.bind(this);
    }
    ZoomToggle(e) {
        e.stopPropagation();
        this.setState({
            ImgZoom: !this.state.ImgZoom
        });
    }
    toggle() {
        this.setState({
            showEditModal: !this.state.showEditModal
        });
    }
    toggleDelete() {
        this.setState({
            showDeleteModal: !this.state.showDeleteModal
        });
    }
    onEditRec(clientRec) {

        clientRec.clientRecId = this.state.data.clientRecId;
        clientRec.clientId = this.state.data.clientId;
        this.props.onEditRec(clientRec);

        clientRec.workPhoto = clientRec.photoTemp;
        this.setState({ data: clientRec });
        this.toggle();
    }
    onRemoveRec(clientRec) {
        this.props.onRemove(this.state.data);
        this.toggleDelete();
    }
    static getDerivedStateFromProps(props, state) {
        state.isThisSelected = props.isSelected;
        state.selRecordId = props.selectRecordId;
        return null;
    }
    onShowControls(recordId) {
        if (this.state.selRecordId !== recordId) {
            this.props.SelectRecord(recordId);
        }
        else {
            this.props.SelectRecord("");
        }

    }
    render() {
        let recImg = "";
        if (this.state.data.workPhoto.includes("EmptyUserRound.png") || this.state.data.workPhoto.includes("data:image/"))
        {
            recImg = "url(" + this.state.data.workPhoto + ")";
        }
        else {
            let usImage = this.state.data.workPhoto;
            let usImageName = usImage.slice(usImage.lastIndexOf('/'));
            let usImagePath = usImage.replace(usImageName, "");
            let usThumb = usImagePath + "/Thumb" + usImageName;
            recImg = "url(" + usThumb + ")";
        } 
        
        
        let recId = this.state.data.clientRecId;
        //Отображение даты в локальном формате
        let RecDatebackToString = new Date(this.state.data.workDate).toLocaleDateString();
        return <div>
            <Row className="ControlsPanel justify-content-center py-2" style={{ display: this.state.isThisSelected ? 'flex' : 'none' }}>
                <Col xs={6} style={{ textAlign: "center" }}>
                    <Button color='dark' className="btnControlsPanelTwoButt btnEdit" onClick={this.toggle}></Button>
                    <Modal isOpen={this.state.showEditModal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Редактирование записи</ModalHeader>
                        <RecordForm onRecordSubmit={this.onEditRec} recordData={this.state.data} RecordImage={this.state.data.workPhoto} RecDate={this.state.data.workDate} ModalTitle={"Редактирование записи"} onCloseModal={this.toggle} />
                    </Modal>
                </Col>
                <Col xs={6} style={{ textAlign: "center" }}>
                    <Button color='dark' className="btnControlsPanelTwoButt btnDelete" onClick={this.toggleDelete}></Button>
                    <Modal isOpen={this.state.showDeleteModal} toggle={this.toggleDelete} >
                        <ModalHeader toggle={this.toggleDelete}>Удаление записи</ModalHeader>
                        <RecordDeleteForm onRecordSubmit={this.onRemoveRec} recordData={this.state.data} RecordImage={this.state.data.workPhoto} RecDate={this.state.data.workDate} ModalTitle={"Удаление записи"} onCloseModal={this.toggleDelete} />
                    </Modal>
                </Col>
            </Row>

            <Row className="align-items-center RecordRow p-1" onClick={() => this.onShowControls(recId)} style={{ backgroundColor: this.state.isThisSelected ? 'lightblue' : 'initial' }} >
                <Col lg={1} xs={2} className="align-self-center px-0" >
                    <div className="ClientListAvatar" style={{ backgroundImage: recImg }} onClick={this.ZoomToggle}>
                    </div>
                    <Modal isOpen={this.state.ImgZoom} toggle={this.ZoomToggle} className={this.props.className} size="lg">
                        <ModalHeader toggle={this.ZoomToggle}></ModalHeader>
                        <ImageZoom Image={this.state.data.workPhoto} onCloseModal={this.ZoomToggle} />
                    </Modal>
                </Col>
                <Col lg="auto" xs={4} className="align-items-center text-center" ><b>{this.state.data.workSumm} р.</b><div>{RecDatebackToString}</div></Col>
                <Col lg={2} xs={6} className="align-items-center text-center px-0"><b>{this.state.data.workType}</b><div>{this.state.data.workColors}</div></Col>
                <Col lg={7} className="d-none d-sm-block">{this.state.data.workComment}</Col>
                <Col xs={12} className="d-block d-sm-none">{this.state.data.workComment}</Col>
            </Row>
        </div>;
    }
}

class ImageZoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: this.props.Image };
    }
    render() {

        return (
            <ModalBody>
                <img src={this.state.data} alt="Фото" className="ZoomedImage" />
            </ModalBody>
        );
    }
}

