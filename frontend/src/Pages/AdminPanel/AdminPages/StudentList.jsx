import React from "react";
import "./StudentList.scss";
import axios from "axios";

export default class StudentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateTimeout: undefined,
            filter: {
                name: "",
                status_id: -1,
                group_id: -1
            },
            creating: {
                name: "",
                status_id: 1,
                group_id: 1
            },
            students: [],
            cookies: {},
            groups: [],
            statuses: []
        };
    }

    componentDidMount() {
        window.getCookies().then(result => this.setState({ cookies: result }));
        axios.get(`http://localhost:22005/admin/getStudentList?filter=${JSON.stringify(this.state.filter)}`)
            .then(response => {
                if (response.status !== 200) return;
                this.setState({ students: response.data });
            }).catch(window.errorHandler);
        axios.get(`http://localhost:22005/admin/getGroupList`)
            .then(response => {
                if (response.status !== 200) return;
                this.setState({ groups: response.data });
            }).catch(window.errorHandler);
        axios.get(`http://localhost:22005/admin/getStatusList`)
            .then(response => {
                if (response.status !== 200) return;
                this.setState({ statuses: response.data });
            }).catch(window.errorHandler);
    }

    updateData() {
        axios.get(`http://localhost:22005/admin/getStudentList?filter=${JSON.stringify(this.state.filter)}`).then(response => {
            if (response.status !== 200) return;
            this.setState({ students: response.data });
        }).catch(window.errorHandler);
    }

    getGroups() {
        const Groups = [];
        this.state.groups.forEach(group => Groups.push(<option key={group.id} value={String(group.id)}>{group.name}</option>));
        return Groups;
    }

    getStatuses() {
        const Statuses = [];
        this.state.statuses.forEach(status => Statuses.push(<option key={status.id} value={String(status.id)}>{status.name}</option>));
        return Statuses;
    }

    getStudentCreating() {
        return <div className="ListCreate">
            <div className="inputContainer">
                <p>Имя</p>
                <input placeholder="Имя" onChange={(e) => {
                    const RegedString = String(e.target.value).replace(/[^а-яА-Я\s]/g, "");
                    this.setState({ creating: { ...this.state.creating, name: RegedString } });
                }} value={this.state.creating.name} />
            </div>
            <div className="inputContainer">
                <p>Статус</p>
                <select value={this.state.creating.status_id} onChange={(e) => {
                    this.setState({ creating: { ...this.state.creating, status_id: parseInt(e.target.value) } })
                }}>
                    {this.getStatuses()}
                </select>
            </div>
            <div className="inputContainer">
                <p>Группа</p>
                <select value={this.state.creating.group_id} onChange={(e) => {
                    this.setState({ creating: { ...this.state.creating, group_id: parseInt(e.target.value) } })
                }}>
                    {this.getGroups()}
                </select>
            </div>
            <div className="Button" onClick={() => {
                const CreateData = this.state.creating;
                if (String(CreateData.name).split(' ').length !== 3)
                    return window.showNotify(2, "У студента должны быть имя, фамилия и отчество!", 2000);
                axios.post('http://localhost:22005/admin/addStudent', this.state.creating)
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
            <div className="StatusChecker">
                <p>Статус</p>
                <select
                    onChange={(e) => {
                        this.setState({ filter: { ...this.state.filter, status_id: parseInt(e.target.value) } }, this.updateData);
                    }}
                    value={this.state.filter.status_id}
                >
                    <option value="-1">Любой</option>
                    <option value={"0"}>Отсутствует</option>
                    {this.getStatuses()}
                </select>
            </div>
            <div className="GroupChecker">
                <p>Группа</p>
                <select
                    onChange={(e) => {
                        this.setState({ filter: { ...this.state.filter, group_id: parseInt(e.target.value) } }, this.updateData);
                    }}
                    value={this.state.filter.group_id}
                >
                    <option value="-1">Любая</option>
                    <option value={"0"}>Отсутствует</option>
                    {this.getGroups()}
                </select>
            </div>
        </div >;
    }

    getList() {
        const List = [];
        this.state.students.forEach((student, idx) => {
            List.push(<div className="ListItem" key={idx}>
                <p className="t1">{student.id}</p>
                <p className="t2">{student.name}</p>
                <div className="t3">
                    <select value={String(student.group_id)} onChange={(e) => {
                        axios.post(`http://localhost:22005/admin/changeStudentGroup`, {
                            id: student.id,
                            group_id: parseInt(e.target.value)
                        }).then((response) => {
                            this.updateData();
                            window.showNotify(0, response.data.message, 1250);
                        }).catch(window.errorHandler);
                    }}>
                        <option disabled value={"0"}>Отсутствует</option>
                        {this.getGroups()}
                    </select>
                </div>
                <div className="t4">
                    <select value={String(student.status_id)} onChange={(e) => {
                        axios.post(`http://localhost:22005/admin/changeStudentStatus`, {
                            id: student.id,
                            status_id: parseInt(e.target.value)
                        }).then((response) => {
                            this.updateData();
                            window.showNotify(0, response.data.message, 1250);
                        }).catch(window.errorHandler);
                    }}>
                        <option disabled value={"0"}>Отсутствует</option>
                        {this.getStatuses()}
                    </select>
                </div>
                <div className="t5">
                    <select value={String(student.have_doc ? 1 : 0)} onChange={(e) => {
                        axios.post(`http://localhost:22005/admin/changeStudentHaveDoc`, {
                            id: student.id,
                            status: parseInt(e.target.value)
                        }).then((response) => {
                            this.updateData();
                            window.showNotify(0, response.data.message, 1250);
                        }).catch(window.errorHandler);
                    }}>
                        <option value={"0"}>Нет</option>
                        <option value={"1"}>Есть</option>
                    </select>
                </div>
                <div className="t6" onClick={() => {
                    if (!window.confirm("Вы уверены, что хотите удалить студента?")) return;
                    axios.delete(`http://localhost:22005/admin/deleteStudent?id=${student.id}`)
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
                <p className="t2">ФИО</p>
                <p className="t3">группа</p>
                <p className="t4">статус</p>
                <p className="t5">приписное</p>
            </div>
            <div className="ListBody">
                {List}
            </div>
        </div>;
    }

    render() {
        return <div className="StudentListMainScreen">
            <h1>Студенты</h1>
            <h2>Добавление студента</h2>
            {this.getStudentCreating()}
            <h2>Фильтр</h2>
            {this.getFilter()}
            <h2>Список аккаунтов</h2>
            {this.getList()}
        </div>;
    }
}