import React from "react";
import "./RequestPage.scss";
import axios from "axios";
import Cookies from "js-cookie";

export default class RequestPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cookies: {},
            students: [],
            docTypes: [],
            FIO: "",
            docTypeName: ""
        };
    }

    componentDidMount() {
        window.getCookies().then(result => this.setState(
            this.setState({ cookies: result }, () => {
                if (String(this.state.cookies?.UserDTO) == "undefined") window.location = "/";
            })
        ));
        axios.get(`http://localhost:22005/getAllStudents?filter=${JSON.stringify({ name: this.state.FIO, group_id: -1, status_id: -1 })}`).then(response => {
            if (response.status !== 200) return;
            this.setState({ students: response.data });
        }).catch(window.errorHandler);
        axios.get(`http://localhost:22005/getAllDocTypes?filter=${JSON.stringify({ name: this.state.docTypeName })}`).then(response => {
            if (response.status !== 200) return;
            this.setState({ docTypes: response.data });
        }).catch(window.errorHandler);
    }

    updateData() {
        axios.get(`http://localhost:22005/getAllStudents?filter=${JSON.stringify({ name: this.state.FIO, group_id: 0, status_id: 0 })}`).then(response => {
            if (response.status !== 200) return;
            this.setState({ students: response.data });
        }).catch(window.errorHandler);
        axios.get(`http://localhost:22005/getAllDocTypes?filter=${JSON.stringify({ name: this.state.docTypeName })}`).then(response => {
            if (response.status !== 200) return;
            this.setState({ docTypes: response.data });
        }).catch(window.errorHandler);
    }

    onSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:22005/requests/new', {
            student_name: this.state.FIO,
            doc_type_id: this.state.docTypes.find(dt => dt.name === this.state.docTypeName)?.id
        }).then(response => window.showNotify(0, "Справка успешно заказана.", 2000))
            .catch(window.errorHandler);
    }

    onChangeFIO(e) {
        const RegedString = String(e.target.value).replace(/[^а-яА-Я\s]/g, "");
        if (RegedString.length > 70) this.setState({ FIO: this.state.FIO });
        else this.setState({ FIO: RegedString });
    }

    onChangeName(e) {
        const RegedString = String(e.target.value).replace(/[^а-яА-Я\s]/g, "");
        if (RegedString.length > 70) this.setState({ docTypeName: this.state.docTypeName });
        else this.setState({ docTypeName: RegedString });
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
                                    list="listik2"
                                />
                            </div>
                            <div className="InputZone">
                                <select id="listik2" onChange={(e) => {
                                    if (e.target.value === "0") return;
                                    this.setState({ FIO: this.state.students.find(st => st.id === parseInt(e.target.value)).name });
                                }}>
                                    <option value={"0"}>Отсутствует</option>
                                    {this.state.students.map((type, idx) => {
                                        if (type.name.toLowerCase().indexOf(this.state.FIO.toLowerCase()) === -1) return null;
                                        return <option value={`${type.id}`} key={idx}>{type.name}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="InputZone">
                                <input
                                    placeholder="Название справки"
                                    value={this.state.docTypeName}
                                    onChange={this.onChangeName.bind(this)}
                                    list="listik"
                                />
                            </div>
                            <div className="InputZone" onChange={(e) => {
                                if (e.target.value === "0") return;
                                this.setState({ docTypeName: this.state.docTypes.find(st => st.id === parseInt(e.target.value)).name });
                            }}>
                                <select id="listik">
                                    <option value={"0"}>Отсутствует</option>
                                    {this.state.docTypes.map((type, idx) => {
                                        if (type.name.toLowerCase().indexOf(this.state.docTypeName.toLowerCase()) === -1) return null;
                                        return <option value={`${type.id}`} key={idx}>{type.name}</option>;
                                    })}
                                </select>
                            </div>
                            <button type="submit">Заказать</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
