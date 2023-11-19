import React from "react";
import "./AccountList.scss";
import axios from "axios";

export default class AccountList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            creating: {
                login: "",
                password: "",
                email: "",
                is_admin: 0
            },
            filter: {
                status: -1,
                regUntil: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                regAfter: new Date(Date.now() + 24 * 60 * 60 * 1000)
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

    onLoginChanged(e) {
        const RegedString = String(e.target.value).replace(/[^a-zA-Z0-9.]/g, "");
        if (RegedString.length > 24) this.setState({ creating: this.state.creating });
        else this.setState({ creating: { ...this.state.creating, login: RegedString } });
    }

    onEmailChanged(e) {
        const RegedString = String(e.target.value).replace(/[^a-zA-Z0-9.@]/g, "");
        if (RegedString.length > 256) this.setState({ creating: this.state.creating });
        else this.setState({ creating: { ...this.state.creating, email: RegedString } });
    }

    onPassChanged(e) {
        const RegedString = String(e.target.value).replace(/[^a-zA-Z0-9!(){}]/g, "");
        if (RegedString.length > 512) this.setState({ creating: this.state.creating });
        else this.setState({ creating: { ...this.state.creating, password: RegedString } });
    }

    getAccountCreating() {
        return <div className="ListCreate">
            <div className="inputContainer">
                <p>Логин</p>
                <input placeholder="Логин" onChange={this.onLoginChanged.bind(this)} value={this.state.creating.login} />
            </div>
            <div className="inputContainer">
                <p>Пароль</p>
                <input placeholder="Пароль" onChange={this.onPassChanged.bind(this)} value={this.state.creating.password} />
            </div>
            <div className="inputContainer">
                <p>Статус</p>
                <select value={this.state.creating.status} onChange={(e) => {
                    this.setState({ creating: { ...this.state.creating, is_admin: parseInt(e.target.value) } })
                }}>
                    <option value="0">Пользователь</option>
                    <option value="1">Администратор</option>
                </select>
            </div>
            <div className="inputContainer">
                <p>Почта</p>
                <input placeholder="Почта" onChange={this.onEmailChanged.bind(this)} value={this.state.creating.email} />
            </div>
            <div className="Button" onClick={() => {
                // 
                const CreateData = this.state.creating;
                if (String(CreateData.login).length < 4)
                    return window.showNotify(2, "Логин должен состоять минимум из 4-ех символов!", 2000);
                if (String(CreateData.password).length < 6)
                    return window.showNotify(2, "Пароль должен состоять минимум из 6-ти символов!", 2000);
                if (String(CreateData.email).indexOf('@') === -1 || String(CreateData.email).indexOf('.') === -1)
                    return window.showNotify(2, "Почта должна быть действительной!", 2000);
                axios.post('http://localhost:22005/admin/addNewAccount', this.state.creating)
                    .then((response) => {
                        this.updateData();
                        window.showNotify(0, response.data.message, 1750);
                    }).catch(window.errorHandler);
            }}>Создать</div>
        </div>;
    }

    getList() {
        const List = [];
        this.state.accounts.forEach((acc, idx) => {
            List.push(<div className="ListItem" key={idx}>
                <p className="t1">{acc.id}</p>
                <div className="t2">
                    <select value={acc.is_admin ? 1 : 0} onChange={(e) => {
                        axios.post(`http://localhost:22005/admin/setNewStatus`, {
                            id: acc.id,
                            status: parseInt(e.target.value)
                        }).then((response) => {
                            this.updateData();
                            window.showNotify(0, response.data.message, 1250);
                        }).catch(window.errorHandler);
                    }}>
                        <option value="0">Пользователь</option>
                        <option value="1">Администратор</option>
                    </select>
                </div>
                <p className="t3">{acc.login}</p>
                <p className="t4">{acc.email}</p>
                <p className="t5">{this.formatDate(acc.timestamp)}</p>
                <div className="t6" onClick={() => {
                    if (!window.confirm("Вы уверены, что хотите удалить аккаунт?")) return;
                    axios.delete(`http://localhost:22005/admin/deleteAccount?id=${acc.id}`)
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