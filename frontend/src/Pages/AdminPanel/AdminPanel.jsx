import React from "react";
import "./AdminPanel.scss";
import AccountList from "./AdminPages/AccountList";
import StatusList from "./AdminPages/StatusList";
import StudentList from "./AdminPages/StudentList";
import GroupList from "./AdminPages/GroupList";
import RequestList from "./AdminPages/RequestList";
import ClosedRequestList from "./AdminPages/ClosedRequestList";

const PageList = [
    <RequestList />,
    <ClosedRequestList />,
    <StudentList />,
    <GroupList />,
    <StatusList />,
    <AccountList />
];

export default class AdminPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 1,
            cookies: {},
        };
    }

    componentDidMount() {
        window.getCookies().then(result => {
            if (!result?.UserDTO?.is_admin) {
                window.location = "/";
                return;
            }
            this.setState({ cookies: result });
        });
    }

    getManageMenu() {
        return <div className="ManageMenu">
            <div className={`ManageButton` + (this.state.active === 0 ? ' active' : '')} onClick={() => {
                this.setState({ active: 0 });
            }}>Активнык заявки</div>
            <div className={`ManageButton` + (this.state.active === 1 ? ' active' : '')} onClick={() => {
                this.setState({ active: 1 });
            }}>Закрытые заявки</div>
            <div className={`ManageButton` + (this.state.active === 2 ? ' active' : '')} onClick={() => {
                this.setState({ active: 2 });
            }}>Список студентов</div>
            <div className={`ManageButton` + (this.state.active === 3 ? ' active' : '')} onClick={() => {
                this.setState({ active: 3 });
            }}>Список групп</div>
            <div className={`ManageButton` + (this.state.active === 4 ? ' active' : '')} onClick={() => {
                this.setState({ active: 4 });
            }}>Список статусов</div>
            <div className={`ManageButton last` + (this.state.active === 5 ? ' active' : '')} onClick={() => {
                this.setState({ active: 5 });
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