import React, { Component } from 'react';

import { trackPromise } from "react-promise-tracker";
import { Link } from 'react-router-dom';
import { RecordForm } from './RecordForm.js';
import { ClientForm } from './ClientForm.js';
import { ClientDeleteForm } from './ClientDeleteForm.js';
import { Row, Col, Button, ButtonGroup } from 'reactstrap';
import { Modal, ModalHeader } from 'reactstrap';
import { Input } from 'reactstrap';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';
//const defaultClientImage = require("../Images/EmptyUserRound.png");
const defaultClientImage = "../ClientImages/EmptyUserRound.png";

export class Home extends Component {
    static displayName = Home.name;
    constructor(props) {
        super(props);
        this.state = {
            clients: [],
            clientsInitial: [],
            modal: false,
            seltedClientId: "",
            loading: false,
            addedClientId:""
        };
        this.SelectClient = this.SelectClient.bind(this);
        this.toggle = this.toggle.bind(this);
        this.FilterList = this.FilterList.bind(this);
        this.onAddClient = this.onAddClient.bind(this);
        this.onEditClient = this.onEditClient.bind(this);
        this.onRemoveClient = this.onRemoveClient.bind(this);
        this.loadData = this.loadData.bind(this);
        this.updateData = this.updateData.bind(this);
        this.removeClientPromise = this.removeClientPromise.bind(this);
        this.EditClientPromise = this.EditClientPromise.bind(this);
        this.AddClientPromise = this.AddClientPromise.bind(this);
    }
    toggle() {
        if (!this.state.modal && !document.body.classList.contains("modal-open")) {
            document.body.classList.add("modal-open");
        }
        if (this.state.modal && document.body.classList.contains("modal-open")) {
            document.body.classList.remove("modal-open");
        }
        this.setState({
            modal: !this.state.modal
        });
    }

    loadData() {
        
        return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        var requestHeader = authHeader();
        xhr.open("get", "/Home", true);
        xhr.setRequestHeader("Authorization", requestHeader);
        //xhr.setRequestHeader("Content-Type", "application/json");
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
    updateData() {
        var that = this;
        trackPromise(
            this.loadData().then(function (datums) {
                var data = JSON.parse(datums);

                if (data) {
                    data.sort((a, b) => a.name.localeCompare(b.name));
                    that.setState({ clients: data, clientsInitial: data });
                    if (that.state.addedClientId !== "")
                    {

                       that.props.history.push('/ClientRecs', { usId: that.state.addedClientId });
                        
                       
                    }
                }
            })
        );
    }
    componentDidMount() {
        //if (document.querySelector('body').classList.contains('modal-open')) {
        //    document.querySelector('body').classList.remove('modal-open');
        //}
        this.updateData();
        this.setState({ loading: false });
    
        
    }

    FilterList(e) {
        let updatedList = this.state.clientsInitial;
        updatedList = updatedList.filter(item => {
            return (
                item.name.toLowerCase().startsWith(e.target.value.toLowerCase()) !== false
            )
        });
        this.setState({ clients: updatedList });
    }
    onAddClient(client) {
        if (client) {
            this.toggle();
            var that = this;
            trackPromise(
                this.AddClientPromise(client).then(function (value) {
                    that.setState({ addedClientId: value.id });
                    that.updateData();
                    
                   
                })
            );
        }
    }
    AddClientPromise(client)
    {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            data.append("Name", client.name);

            data.append("Phone", client.phone);
            if (client.photo) {
                data.append("Photo", client.photo);
            }
            else {
                data.append("Photo", defaultClientImage);
            }
            var xhr = new XMLHttpRequest();
            let url = "/Home/";
            var requestHeader = authHeader();
            xhr.open("post", url, true);
            xhr.setRequestHeader("Authorization", requestHeader);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.send(data);
        });
    }
    onEditClient(client) {
     
        if (client) {

            var that = this;
            trackPromise(
                this.EditClientPromise(client).then(function () {
                    that.updateData();
                })
            );
        }
    }
    EditClientPromise(client) {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            data.append("Id", client.id);
            data.append("Name", client.name);
            data.append("Phone", client.phone);
            data.append("Photo", client.photo);
            var xhr = new XMLHttpRequest();
            let url = "/Home/EditClient/";
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
            xhr.send(data);
        });
    }
    onRemoveClient(client) {
        if (client) {

            var that = this;
            trackPromise(
                this.removeClientPromise(client).then(function () {
                    that.updateData();
                })
            );
        }
    }
    removeClientPromise(client) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            var url = "/Home/" + client.id;
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
    SelectClient(clientID) {
        this.setState({ seltedClientId: clientID });
    }
    render() {
        var remove = this.onRemoveClient;
        //var loaddata = this.loadData;
        var loaddata = this.updateData;
        var contrPanel = this.SelectClient;
        var selClientId = this.state.seltedClientId;
        var edit = this.onEditClient;
        var isAnySel = (selClientId === "") ? false : true;
     
            return <div >

                <Row className="justify-content-center py-2 row border-bottom border-dark" >
                    <Col lg={10} xs={10} className="align-self-center">
                        <Input type="text"
                            id="nameInput"
                            placeholder="поиск"
                            onChange={this.FilterList} />
                    </Col>
                    <Col lg={2} xs={2}>
                        <ButtonGroup className="buttngroup" size="sm">
                            <Button color='info' className="MenuButton btnAdd" onClick={this.toggle}></Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>

                    <ModalHeader toggle={this.toggle}>Добавление клиента</ModalHeader>
                    <ClientForm onClientSubmit={this.onAddClient} defaultPhoto={defaultClientImage} onCloseModal={this.toggle} />
                </Modal>

                <div>
                    {
                        this.state.clients.map(function (client) {
                            var isSel = (selClientId === client.id) ? true : false;

                            return <Client key={client.id} client={client} onEdit={edit} onRemove={remove} SelectClient={contrPanel} selectClientId={selClientId} isSelected={isSel} onLoadData={loaddata} />
                        })
                    }
                    <div className="ControlsPanelListComensator py-2" style={{ display: isAnySel ? 'block' : 'none' }}></div>
                </div>

            </div>
        
    }
}

class Client extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.client, modal: false, recModal: false, deleteClientModal: false, isThisSelected: this.props.isSelected, selClientId: this.props.selectClientId,
            
        };
        this.toggle = this.toggle.bind(this);
        this.toggleRec = this.toggleRec.bind(this);
        this.toggleDelete = this.toggleDelete.bind(this);
        this.loadData = this.loadData.bind(this);
        this.onAddRecord = this.onAddRecord.bind(this);
        this.AddRecordPromise = this.AddRecordPromise.bind(this);
        this.onEditClient = this.onEditClient.bind(this);
        this.onRemoveClient = this.onRemoveClient.bind(this);
        this.onShowControls = this.onShowControls.bind(this);
    }

    toggle() {
        if (!this.state.modal && !document.body.classList.contains("modal-open")) {
            document.body.classList.add("modal-open");
        }
        if (this.state.modal && document.body.classList.contains("modal-open")) {
            document.body.classList.remove("modal-open");
        }
        this.setState({
            modal: !this.state.modal
        });
    }
    toggleRec() {
        if (!this.state.recModal && !document.body.classList.contains("modal-open")){
            document.body.classList.add("modal-open");
        }
        if (this.state.recModal && document.body.classList.contains("modal-open")) {
            document.body.classList.remove("modal-open");
        }
        this.setState({
            recModal: !this.state.recModal
        });
    }
    toggleDelete() {
        if (!this.state.deleteClientModal && !document.body.classList.contains("modal-open")){
            document.body.classList.add("modal-open");
        }
        if (this.state.deleteClientModal && document.body.classList.contains("modal-open")) {
            document.body.classList.remove("modal-open");
        }
        this.setState({
            deleteClientModal: !this.state.deleteClientModal
        });
    }
    loadData() {
        let _client = this.state.data;
        _client.recsCount++;
        this.setState({ data: _client });
    }
    static getDerivedStateFromProps(props, state) {
        state.isThisSelected = props.isSelected;
        state.selClientId = props.selectClientId;
        return null;
    }
    shouldComponentUpdate() {
        return true;
    }
    componentDidMount() {
       
    }

    componentDidUpdate() {
    }
    onAddRecord(clientRec) {

        if (this.state.data.id) {
            this.toggleRec();
            var that = this;
            trackPromise(
                this.AddRecordPromise(clientRec).then(function () {
                    that.loadData();
                })
            );
        }
    }
    AddRecordPromise(clientRec) {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            data.append("workType", clientRec.workType);
            data.append("workDate", clientRec.workDate);
            data.append("workSumm", clientRec.workSumm);
            data.append("workColors", clientRec.workColors);
            data.append("workComment", clientRec.workComment);
            data.append("workPhoto", clientRec.workPhoto);
            var xhr = new XMLHttpRequest();
            let url = "/Home/PostClientRec/" + this.state.data.id;
            var requestHeader = authHeader();
            xhr.open("post", url, true);
            xhr.setRequestHeader("Authorization", requestHeader);
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
            xhr.send(data);
        });
    }
    onEditClient(client) {
        
        client.id = this.state.data.id;
        client.recsCount = this.state.data.recsCount;
        //this.setState({ data: client });
        this.props.onEdit(client);
        client.photo = client.photoTemp;
        this.setState({ data: client });
        this.toggle();
    }
    onRemoveClient(client)
    {
        client.id = this.state.data.id;
        client.recsCount = this.state.data.recsCount;
        this.props.onRemove(client);
        
        this.toggleDelete();
    }
    onShowControls(clientId) {
        if (this.state.selClientId !== clientId) {
            this.props.SelectClient(clientId);

        }
        else {
            this.props.SelectClient("");
        }
    }
    render() {
        let nowDateTemp = new Date(Date.now());
        let MM = ((nowDateTemp.getMonth() + 1) < 10 ? "0" : "") + (nowDateTemp.getMonth() + 1);
        let dd = (nowDateTemp.getDate() < 10 ? "0" : "") + nowDateTemp.getDate();
        let nowDate = nowDateTemp.getFullYear() + '-' + MM + '-' + dd;
        let usId = this.state.data.id;
        let usImg = "";
        if (this.state.data.photo.includes("EmptyUserRound.png") || this.state.data.photo.includes("data:image/")) {
            usImg = "url(" + this.state.data.photo + ")";
        }
        else {
            let usImage = this.state.data.photo;
            let usImageName = usImage.slice(usImage.lastIndexOf('/'));
            let usImagePath = usImage.replace(usImageName, "");
            let usThumb = usImagePath + "/Thumb" + usImageName; 
            usImg = "url(" + usThumb + ")";
        }
       
        return <div>
            <Row className="ControlsPanel justify-content-center py-2" style={{ display: this.state.isThisSelected ? 'flex' : 'none' }}>
                <Col xs={4} style={{ textAlign: "center" }}>
                    <Button color='dark' className="btnControlsPanel btnAdd" onClick={this.toggleRec}></Button>
                    <Modal isOpen={this.state.recModal} toggle={this.toggleRec} className={this.props.className}>

                        <ModalHeader toggle={this.toggleRec}>Добавление записи</ModalHeader>
                        <RecordForm onRecordSubmit={this.onAddRecord} RecordImage={this.state.data.photo} RecDate={nowDate} onCloseModal={this.toggleRec} />
                    </Modal>
                </Col>
                <Col xs={4} style={{ textAlign: "center" }}>
                    <Button color='dark' className="btnControlsPanel btnEdit" onClick={this.toggle}></Button>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>

                        <ModalHeader toggle={this.toggle}>Редактирование клиента</ModalHeader>
                        <ClientForm onClientSubmit={this.onEditClient} defaultPhoto={this.state.data.photo} ModalTitle={"Редактирование клиента"} clientData={this.state.data} onCloseModal={this.toggle} />
                    </Modal>
                </Col>
                <Col xs={4} style={{ textAlign: "center" }}>
                    <Button color='dark' className="btnControlsPanel btnDelete" onClick={this.toggleDelete}></Button>
                    <Modal isOpen={this.state.deleteClientModal} toggle={this.toggleDelete} >

                        <ModalHeader toggle={this.toggleDelete}>Удаление клиента</ModalHeader>
                        <ClientDeleteForm onClientSubmit={this.onRemoveClient} clientData={this.state.data} onCloseModal={this.toggleDelete} />
                    </Modal>

                </Col>

            </Row>
            <Row className="align-items-center ClientRow py-1" onClick={() => this.onShowControls(usId)} style={{ backgroundColor: this.state.isThisSelected ? 'lightblue' : 'initial' }} >
                <Col lg={1} xs={3} className="align-self-center pl-1">
                    <Link to={{
                        pathname: "/ClientRecs",
                        state: { usId }
                    }}>
                        <div className="ClientListAvatar" style={{ backgroundImage: usImg }}>
                        </div>
                    </Link>
                </Col>
                <Col lg={3} xs={5} className="px-0" ><b>{this.state.data.name}</b><div className="PhoneDiv">{(this.state.data.phone==="udefined")? this.state.data.phone:""}</div></Col>

                <Col lg={8} xs={4} className="pl-0 pr-1">
                    <ButtonGroup className="align-self-center buttngroup" size="sm">
                        <Link className="btn btn-info btnShowRecords" to={{
                            pathname: "/ClientRecs",
                            state: { usId }
                        }}>Записи: {this.state.data.recsCount}
                        </Link>
                    </ButtonGroup>

                </Col>

            </Row>
        </div>;
    }
}

