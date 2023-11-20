import React from "react";
import "./MyRequestList.scss";
import axios from "axios";

export default class MyRequestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cookies: {},
            requestList: []
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
        window.getCookies().then(result => this.setState({ cookies: result }));
        axios.get('http://localhost:22005/requests/getMy').then(response => {
            if (response.status !== 200) return;
            this.setState({ requestList: response.data });
        }).catch(window.errorHandler);
    }

    getListOfRequests() {
        const Components = [];

        this.state.requestList
            .sort((prev, next) => new Date(prev.date).getTime() < new Date(prev.date).getTime())
            .forEach((el, idx) => Components.push(
                <div className={`RequestItem${el.is_allow === null ? " null" : el.is_allow ? " allowed" : " denied"}`} key={idx} onClick={() => {
                    axios({
                        url: `http://localhost:22005/requests/getReady?id=${el.id}`, //your url
                        method: 'GET',
                        responseType: 'blob', // important
                    }).then((response) => {
                        if (response.status !== 200) return;
                        const href = URL.createObjectURL(response.data);
                        const link = document.createElement('a');
                        link.href = href;
                        link.setAttribute('download', 'file.txt');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(href);
                    }).catch(window.errorHandler);
                }}>
                    <p>Номер заказа: {el.id}</p>
                    <p>Заказал: {el.user_id}</p>
                    <p>ФИО: {el.student.name}</p>
                    <p>Дата: {this.formatDate(el.timestamp)}</p>
                </div>
            ));

        return <div className="ListOfRequests">{Components}</div>;
    }

    render() {
        return <div className="MyRequestListMainPage">
            <div className="RequestListBlock">
                <h1>Ваши запросы</h1>
                {this.getListOfRequests()}
            </div>
        </div>;
    }
}