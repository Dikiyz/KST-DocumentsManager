import React from "react";
import "./RequestPage.scss";
import axios from "axios";
import Cookies from "js-cookie";

export default class RequestPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cookies: {},
            FIO: "",
            selectedType: "1",
            types: {
                "1": "Форма 0-86у",
                "2": "Форма 0-87у",
                "3": "Форма 0-88у",
                "4": "Форма 0-89у",
                "5": "Форма 0-90у",
            }
        };
    }

    componentDidMount() {
        axios.get('http://localhost:22005/requests/types')
            .then(response => this.setState({ types: response.data }))
            .catch(window.errorHandler);
        window.getCookies().then(result => this.setState({ cookies: result }));
    }

    onSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:22005/requests/new', {
            student_name: this.state.FIO,
            type: parseInt(this.state.selectedType)
        }).then(response => alert("Справка успешно заказана."))
            .catch(window.errorHandler);
    }

    onChangeFIO(e) {
        const RegedString = String(e.target.value).replace(/[^а-яА-Я\s]/g, "");
        if (RegedString.length > 70) this.setState({ FIO: this.state.FIO });
        else this.setState({ FIO: RegedString });
    }

    getTypes() {
        const Types = [];

        for (let i in this.state.types)
            Types.push(<option key={i} value={i}>{this.state.types[i]}</option>);

        return Types;
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
                                <select
                                    className="TypeList"
                                    onChange={(e) => {
                                        this.setState({ selectedType: e.target.value });
                                    }}
                                    value={this.state.selectedType}
                                >{this.getTypes()}</select>
                            </div>
                            <button type="submit">Заказать</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
