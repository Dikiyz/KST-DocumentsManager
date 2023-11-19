import React from "react";
import "./RequestList.scss";
import axios from "axios";

export default class RequestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listOfRequests: [],
        };
    }

    formatDate(date) {
        date = new Date(date);
        const year = date.toISOString().split("-")[0];
        const month = date.toISOString().split("-")[1];
        const day = date.toISOString().split("-")[2].substring(0, 2);
        const time = date.toLocaleTimeString().substring(0, 5);
        return `${time} ${day}.${month}.${year}`;
    }

    componentDidMount() {
        axios.get('http://localhost:22005/requests/getAll')
            .then(response => this.setState({ listOfRequests: response.data }))
            .catch(window.errorHandler);
    }

    addAnswerToRequest(id, answer) {
        if (answer) axios.post('http://localhost:22005/responses/approve', { id }).then(response => {
            window.showNotify(2, response.data.message, 2000);
            axios.get('http://localhost:22005/requests/getAll')
                .then(response => this.setState({ listOfRequests: response.data }))
                .catch(window.errorHandler);
        }).catch(window.errorHandler);
        else axios.post('http://localhost:22005/responses/deny', { id }).then(response => {
            window.showNotify(2, response.data.message, 2000);
            axios.get('http://localhost:22005/requests/getAll')
                .then(response => this.setState({ listOfRequests: response.data }))
                .catch(window.errorHandler);
        }).catch(window.errorHandler);
    }

    getListOfRequests() {
        const Components = [];

        this.state.listOfRequests
            .sort((prev, next) => new Date(prev.date).getTime() < new Date(prev.date).getTime())
            .forEach((el, idx) =>
                Components.push(
                    <div className="RequestItem">
                        <p>Номер заказа: {el.id}</p>
                        <p>Заказал: {el.user_id}</p>
                        <p>ФИО: {el.student_name}</p>
                        <p>Тип справки: {el.doc_type_id}</p>
                        <p>Дата: {this.formatDate(el.timestamp)}</p>
                        <div>
                            <button onClick={() => this.addAnswerToRequest(el.id, true)}>Одобрить</button>
                            <button onClick={() => this.addAnswerToRequest(el.id, false)}>Отклонить</button>
                        </div>
                    </div>
                )
            );

        return <div className="ListOfRequests">{Components}</div>;
    }

    render() {
        return (
            <div className="RequestListMainPage">
                <div className="RequestListBlock">
                    <h1>Система выписки справок КСТ</h1>
                    {this.getListOfRequests()}
                </div>
            </div>
        );
    }
}
