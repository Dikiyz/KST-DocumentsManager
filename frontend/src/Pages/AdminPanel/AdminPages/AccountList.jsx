import React from "react";
import "./AccountList.scss";
import axios from "axios";

export default class AccountList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            creating: {
                status: 0,
            },
            filter: {
                status: -1,
                regUntil: new Date(Date.now() - 24 * 60 * 60 * 1000),
                regAfter: new Date(Date.now() + 60 * 60 * 1000)
            },
            cookies: {},
        };
    }

    componentDidMount() {
        window.getCookies().then(result => this.setState({ cookies: result }));
        axios.get(`http://localhost:22005/admin/getUserList?filter=${JSON.stringify(this.state.filter)}`).then(response => {
            if (response.status !== 200) return;
            this.setState({ accounts: response.data });
        }).catch(window.errorHandler);
    }

    updateData() {
        axios.get(`http://localhost:22005/admin/getUserList?filter=${JSON.stringify(this.state.filter)}`).then(response => {
            if (response.status !== 200) return;
            this.setState({ accounts: response.data });
        }).catch(window.errorHandler);
    }

    formatDateForInput(date) {
        date = new Date(date);
        return date.toISOString().split('T')[0];
    }

    formatDate(date) {
        date = new Date(date);
        const year = date.toISOString().split("-")[0];
        const month = date.toISOString().split("-")[1];
        const day = date.toISOString().split("-")[2].substring(0, 2);
        const time = date.toLocaleTimeString().substring(0, 5);
        return `${time} ${day}.${month}.${year}`;
    }

    getFilter() {
        return <div className="ListFilter">
            <div className="RegSettings">
                <div className="RegUntil">
                    <p>Зарегистрирован до</p>
                    <input value={this.formatDateForInput(this.state.filter.regUntil)} type="date" onChange={(e) => {
                        this.setState({ filter: { ...this.state.filter, regUntil: new Date(e.target.value) } }, this.updateData);
                    }} />
                </div>
                <div className="RegAfter">
                    <p>Зарегистрирован после</p>
                    <input type="date" value={this.formatDateForInput(this.state.filter.regAfter)} onChange={(e) => {
                        this.setState({ filter: { ...this.state.filter, regAfter: new Date(e.target.value) } }, this.updateData);
                    }} />
                </div>
            </div>
            <div className="StatusChecker">
                <p>Статус</p>
                <select
                    onChange={(e) => {
                        this.setState({ filter: { ...this.state.filter, status: parseInt(e.target.value) } }, this.updateData);
                    }}
                    value={this.state.status}
                >
                    <option value="-1">Любой</option>
                    <option value="0">Пользователь</option>
                    <option value="1">Администратор</option>
                </select>
            </div>
        </div >;
    }

    getAccountCreating() {
        return <div className="ListCreate">
            <div className="inputContainer">
                <p>Логин</p>
                <input placeholder="Логин" />
            </div>
            <div className="inputContainer">
                <p>Пароль</p>
                <input placeholder="Пароль" />
            </div>
            <div className="inputContainer">
                <p>Статус</p>
                <select value={this.state.creating.status} onChange={(e) => {
                    this.setState({ creating: { ...this.state.creating, status: parseInt(e.target.value) } })
                }}>
                    <option value="0">Пользователь</option>
                    <option value="1">Администратор</option>
                </select>
            </div>
            <div className="inputContainer">
                <p>Почта</p>
                <input placeholder="Почта" />
            </div>
            <div className="Button">Создать</div>
        </div>;
    }

    getList() {
        const List = [];
        this.state.accounts.forEach((acc, idx) => {
            List.push(<div className="ListItem" key={idx}>
                <p className="t1">{acc.id}</p>
                <p className="t2">{acc.is_admin ? "Администратор" : "Пользователь"}</p>
                <p className="t3">{acc.login}</p>
                <p className="t4">{acc.email}</p>
                <p className="t5">{this.formatDate(acc.timestamp)}</p>
            </div>);
        });
        return <div className="ListDiv">
            <div className="ListHeader">
                <p className="t1">ID</p>
                <p className="t2">Статус</p>
                <p className="t3">Логин</p>
                <p className="t4">почта</p>
                <p className="t5">дата регистрации</p>
            </div>
            <div className="ListBody">
                {List}
            </div>
        </div>;
    }

    render() {
        return <div className="AccountListMainScreen">
            <h1>Аккаунты</h1>
            <h2>Создание аккаунта</h2>
            {this.getAccountCreating()}
            <h2>Фильтр</h2>
            {this.getFilter()}
            <h2>Список аккаунтов</h2>
            {this.getList()}
        </div>;
    }
}