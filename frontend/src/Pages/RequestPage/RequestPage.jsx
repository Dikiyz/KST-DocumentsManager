import React from "react";
import "./RequestPage.scss";
import axios from "axios";
import Cookies from "js-cookie";

export default class RequestPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cookies: {},
            FIO: ""
        };
    }

    componentDidMount() {
    }

    onSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:22005/requests/new', {
            student_name: this.state.FIO
        }).then(response => window.showNotify(0, "Справка успешно заказана.", 2000))
            .catch(window.errorHandler);
    }

    onChangeFIO(e) {
        const RegedString = String(e.target.value).replace(/[^а-яА-Я\s]/g, "");
        if (RegedString.length > 70) this.setState({ FIO: this.state.FIO });
        else this.setState({ FIO: RegedString });
    }

    getTypes() {
    }

    render() {
        return (
            <div className="RequestPageMainPage">
                <div className="RequestPageMenu">
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <div className="FormDiv">
                            <p>Введите ФИО студента, справку которому хотите заказать.</p>
                            <div className="InputZone">
                                <input
                                    placeholder="Фамилия Имя Отчество"
                                    value={this.state.FIO}
                                    onChange={this.onChangeFIO.bind(this)}
                                />
                            </div>
                            <button type="submit">Заказать</button>
                            <button onClick={(e) => {
                                e.preventDefault();
                                window.location = "/myRequests";
                            }}>Одобренные заявки</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
