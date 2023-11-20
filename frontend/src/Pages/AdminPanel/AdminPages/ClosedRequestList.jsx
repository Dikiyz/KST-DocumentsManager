import React from "react";
import "./ClosedRequestList.scss";
import axios from "axios";

export default class ClosedRequestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateTimeout: undefined,
            names: new Map(),
            filter: {
                name: "",
                login: ""
            },
            cookies: {},
            requests: []
        };
    }

    componentDidMount() {
        window.getCookies().then(result => this.setState({ cookies: result }));
        axios.get(`http://localhost:22005/admin/getRequestList?filter=${JSON.stringify(this.state.filter)}`).then(response => {
            if (response.status !== 200) return;
            this.setState({ requests: response.data });
        }).catch(window.errorHandler);
    }

    updateData() {
        axios.get(`http://localhost:22005/admin/getRequestList?filter=${JSON.stringify(this.state.filter)}`).then(response => {
            if (response.status !== 200) return;
            this.setState({ requests: response.data });
        }).catch(window.errorHandler);
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
                <p className="t4">{request.response.user.login}</p>
                <p className="t5">{["Отклонено", "Одобрено"][request.response.is_allow ? 1 : 0]}</p>
            </div >);
        });
        return <div className="ListDiv">
            <div className="ListHeader">
                <p className="t1">ID</p>
                <p className="t2">логин заказчика</p>
                <p className="t3">имя студента</p>
                <p className="t4">администратор</p>
                <p className="t5">вердикт</p>
            </div>
            <div className="ListBody">
                {List}
            </div>
        </div>;
    }

    render() {
        return <div className="ClosedRequestListMainScreen">
            <h1>Закрытые заявки</h1>
            <h2>Фильтр</h2>
            {this.getFilter()}
            <h2>Список заявок</h2>
            {this.getList()}
        </div>;
    }
}