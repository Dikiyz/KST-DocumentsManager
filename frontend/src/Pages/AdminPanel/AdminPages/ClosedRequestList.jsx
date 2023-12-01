import React from "react";
import "./ClosedRequestList.scss";
import axios from "axios";

export default class ClosedRequestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateTimeout: undefined,
            names: new Map(),
            filter: { name: "" },
            creating: { name: "" },
            cookies: {},
            docTypes: [],
            requests: []
        };
    }

    componentDidMount() {
        window.getCookies().then(result => this.setState({ cookies: result }));
        axios.get(`http://localhost:22005/admin/getDocTypeList?filter=${JSON.stringify(this.state.filter)}`).then(response => {
            if (response.status !== 200) return;
            this.setState({ docTypes: response.data });
        }).catch(window.errorHandler);
    }

    updateData() {
        axios.get(`http://localhost:22005/admin/getDocTypeList?filter=${JSON.stringify(this.state.filter)}`).then(response => {
            if (response.status !== 200) return;
            this.setState({ docTypes: response.data });
        }).catch(window.errorHandler);
    }

    getDocTypeCreating() {
        return <div className="ListCreate">
            <div className="inputContainer">
                <p>Имя</p>
                <input placeholder="Имя" onChange={(e) => {
                    const RegedString = String(e.target.value).replace(/[^а-яА-Я\s]/g, "");
                    this.setState({ creating: { ...this.state.creating, name: RegedString } });
                }} value={this.state.creating.name} />
            </div>
            <div className="Button" onClick={() => {
                axios.post('http://localhost:22005/admin/addDocType', this.state.creating)
                    .then((response) => {
                        this.updateData();
                        window.showNotify(0, response.data.message, 1750);
                    }).catch(window.errorHandler);
            }}>Создать</div>
        </div>;
    }

    getFilter() {
        return <div className="ListFilter">
            <div className="NameSettings">
                <p>Имя</p>
                <input value={this.state.filter.name} onChange={(e) => {
                    const RegedString = String(e.target.value).replace(/[^а-яА-Я\s]/g, "");
                    if (RegedString.length < 70) this.setState({ filter: { ...this.state.filter, name: RegedString } });
                    if (this.state.updateTimeout) {
                        clearTimeout(this.state.updateTimeout);
                        this.state.updateTimeout = undefined;
                    }
                    this.state.updateTimeout = setTimeout(this.updateData.bind(this), 500);
                }} />
            </div>
        </div >;
    }

    getList() {
        const List = [];
        this.state.docTypes.forEach((docType, idx) => {
            List.push(<div className="ListItem" key={idx}>
                <p className="t1">{docType.id}</p>
                <p className="t2">{docType.name}</p>
                <div className="t3">
                    <input value={this.state.names.get(docType.id)} onChange={(e) => {
                        const RegedString = String(e.target.value).replace(/[^а-яА-Я\s]/g, "");
                        if (RegedString.length < 120) this.setState((prev) => {
                            prev.names.set(docType.id, RegedString);
                            return prev;
                        });
                    }} />
                    <div onClick={() => {
                        axios.post(`http://localhost:22005/admin/renameDocType`, { id: docType.id, name: this.state.names.get(docType.id) })
                            .then((response) => {
                                this.updateData();
                                window.showNotify(0, response.data.message, 1250);
                            }).catch(window.errorHandler);
                    }}>применить</div>
                </div>
                <div className="t6" onClick={() => {
                    if (!window.confirm("Вы уверены, что хотите удалить справку?")) return;
                    axios.delete(`http://localhost:22005/admin/deleteDocType?id=${docType.id}`)
                        .then((response) => {
                            this.updateData();
                            window.showNotify(0, response.data.message, 1250);
                        }).catch(window.errorHandler);
                }}>
                    <img alt="" src="http://localhost:22005/trash.png" />
                </div>
            </div>);
        });
        return <div className="ListDiv">
            <div className="ListHeader">
                <p className="t1">ID</p>
                <p className="t2">имя</p>
                <p className="t3">новое имя</p>
            </div>
            <div className="ListBody">
                {List}
            </div>
        </div>;
    }

    render() {
        return <div className="ClosedRequestListMainScreen">
            <h1>Список справок</h1>
            <h2>Создание справки</h2>
            {this.getDocTypeCreating()}
            <h2>Фильтр</h2>
            {this.getFilter()}
            <h2>Список заявок</h2>
            {this.getList()}
        </div>;
    }
}