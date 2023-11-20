import React from "react";
import "./AdminPanel.scss";
import AccountList from "./AdminPages/AccountList";
import StatusList from "./AdminPages/StatusList";
import StudentList from "./AdminPages/StudentList";
import GroupList from "./AdminPages/GroupList";

const PageList = [
    null,
    null,
    null,
    <StudentList />,
    <GroupList />,
    null,
    <StatusList />,
    <AccountList />
];

export default class AdminPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 4,
            cookies: {},
        };
    }

    componentDidMount() {
        window.getCookies().then(result => this.setState({ cookies: result }));
    }

    getManageMenu() {
        return <div className="ManageMenu">
            <div className={`ManageButton` + (this.state.active === 0 ? ' active' : '')} onClick={() => {
                this.setState({ active: 0 });
            }}>Оставить заявку</div>
            <div className={`ManageButton` + (this.state.active === 1 ? ' active' : '')} onClick={() => {
                this.setState({ active: 1 });
            }}>Активнык заявки</div>
            <div className={`ManageButton` + (this.state.active === 2 ? ' active' : '')} onClick={() => {
                this.setState({ active: 2 });
            }}>Закрытые заявки</div>
            <div className={`ManageButton` + (this.state.active === 3 ? ' active' : '')} onClick={() => {
                this.setState({ active: 3 });
            }}>Список студентов</div>
            <div className={`ManageButton` + (this.state.active === 4 ? ' active' : '')} onClick={() => {
                this.setState({ active: 4 });
            }}>Список групп</div>
            <div className={`ManageButton` + (this.state.active === 5 ? ' active' : '')} onClick={() => {
                this.setState({ active: 5 });
            }}>Список справок</div>
            <div className={`ManageButton` + (this.state.active === 6 ? ' active' : '')} onClick={() => {
                this.setState({ active: 6 });
            }}>Список статусов</div>
            <div className={`ManageButton last` + (this.state.active === 7 ? ' active' : '')} onClick={() => {
                this.setState({ active: 7 });
            }}>Список аккаунтов</div>
        </div >;
    }

    render() {
        return <div className="AdminPanelMainScreen">
            {this.getManageMenu()}
            {PageList[this.state.active]}
        </div>;
    }
}