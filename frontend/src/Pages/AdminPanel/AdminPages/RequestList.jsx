import React from "react";
import "./RequestList.scss";
import axios from "axios";

export default class RequestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateTimeout: undefined,
            names: new Map(),
            filter: {
                name: "",
                login: "",
                is_allow: null,
                regUntil: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                regAfter: new Date(Date.now() + 24 * 60 * 60 * 1000)
            },
            cookies: {},
            requests: []
        };
    }

    componentDidMount() {
        window.getCookies().then(result => this.setState({ cookies: result }));
        // axios.get(`http://localhost:22005/admin/getRequestList?filter=${JSON.stringify(this.state.filter)}`).then(response => {
        //     if (response.status !== 200) return;
        //     this.setState({ requests: response.data });
        // }).catch(window.errorHandler);
    }

    updateData() {
        // axios.get(`http://localhost:22005/admin/getRequestList?filter=${JSON.stringify(this.state.filter)}`).then(response => {
        //     if (response.status !== 200) return;
        //     this.setState({ requests: response.data });
        // }).catch(window.errorHandler);
    }

    formatDateForInput(date) {
        date = new Date(date);
        return date.toISOString().split('T')[0];
    }

    getTaskCreator() {
        return <div className="TaskCreator">
            <div className="RegSettings">
                <div className="RegUntil">
                    <p>Оформлен с</p>
                    <input value={this.formatDateForInput(this.state.filter.regUntil)} type="date" onChange={(e) => {
                        this.setState({ filter: { ...this.state.filter, regUntil: new Date(e.target.value) } }, this.updateData);
                    }} />
                </div>
                <div className="RegAfter">
                    <p>Оформлен до</p>
                    <input type="date" value={this.formatDateForInput(this.state.filter.regAfter)} onChange={(e) => {
                        this.setState({ filter: { ...this.state.filter, regAfter: new Date(e.target.value) } }, this.updateData);
                    }} />
                </div>
            </div>
            <div className="BUTTON" onClick={() => {
                axios({
                    url: `http://localhost:22005/admin/getExel?filter=${JSON.stringify(this.state.filter)}`, //your url
                    method: 'GET',
                    responseType: 'blob', // important
                }).then((response) => {
                    if (response.status !== 200) return;
                    const href = URL.createObjectURL(response.data);
                    const link = document.createElement('a');
                    link.href = href;
                    link.setAttribute('download', 'file.xlsx');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(href);
                }).catch(window.errorHandler);
            }}>
                <p>Скачать отчет</p>
            </div>
        </div >;
    }

    getFilter() {
        return <div className="ListFilter">
            <div className="NameSettings">
                <p>Логин</p>
                <input value={this.state.filter.login} onChange={(e) => {
                    const RegedString = String(e.target.value).replace(/[^a-zA-Z]/g, "");
                    if (RegedString.length < 70) this.setState({ filter: { ...this.state.filter, login: RegedString } });
                    if (this.state.updateTimeout) {
                        clearTimeout(this.state.updateTimeout);
                        this.state.updateTimeout = undefined;
                    }
                    this.state.updateTimeout = setTimeout(this.updateData.bind(this), 500);
                }} />
            </div>
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
        this.state.requests.forEach((request, idx) => {
            List.push(<div className="ListItem" key={idx}>
                <p className="t1">{request.id}</p>
                <p className="t2">{request.user.login}</p>
                <p className="t3">{request.student.name}</p>
                <div className="t4" onClick={() => {
                    axios.post(`http://localhost:22005/admin/addResponse`, {
                        id: request.id, is_allow: true
                    }).then((response) => {
                        this.updateData();
                        window.showNotify(0, response.data.message, 1250);
                    }).catch(window.errorHandler);
                }}>
                    <img alt="" src="http://localhost:22005/accept.png" />
                </div>
                <div className="t5" onClick={() => {
                    axios.post(`http://localhost:22005/admin/addResponse`, {
                        id: request.id, is_allow: false
                    }).then((response) => {
                        this.updateData();
                        window.showNotify(0, response.data.message, 1250);
                    }).catch(window.errorHandler);
                }}>
                    <img alt="" src="http://localhost:22005/deny.png" />
                </div>
            </div >);
        });
        return <div className="ListDiv">
            <div className="ListHeader">
                <p className="t1">ID</p>
                <p className="t2">логин заказчика</p>
                <p className="t3">имя студента</p>
            </div>
            <div className="ListBody">
                {List}
            </div>
        </div>;
    }

    render() {
        return <div className="RequestListMainScreen">
            <h1>Заявки</h1>
            <h2>Оформление отчета</h2>
            {this.getTaskCreator()}
            {/* <h2>Фильтр</h2>
            {this.getFilter()}
            <h2>Список заявок</h2>
            {this.getList()} */}
        </div>;
    }
}