import React from "react";
import "./AdminPanel.scss";
import AccountList from "./AdminPages/AccountList";

const PageList = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    <AccountList />
];

export default class AdminPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 7,
            cookies: {},
        };
    }

    componentDidMount() {
        window.getCookies().then(result => this.setState({ cookies: result }));
    }

    getManageMenu() {
        return <div className="ManageMenu">
            <div className={`ManageButton` + (this.state.active === 0 ? ' active' : '')}>Оставить заявку</div>
            <div className={`ManageButton` + (this.state.active === 1 ? ' active' : '')}>Активнык заявки</div>
            <div className={`ManageButton` + (this.state.active === 2 ? ' active' : '')}>Закрытые заявки</div>
            <div className={`ManageButton` + (this.state.active === 3 ? ' active' : '')}>Список студентов</div>
            <div className={`ManageButton` + (this.state.active === 4 ? ' active' : '')}>Список групп</div>
            <div className={`ManageButton` + (this.state.active === 5 ? ' active' : '')}>Список справок</div>
            <div className={`ManageButton` + (this.state.active === 6 ? ' active' : '')}>Список статусов</div>
            <div className={`ManageButton last` + (this.state.active === 7 ? ' active' : '')}>Список аккаунтов</div>
        </div >;
    }

    render() {
        return <div className="AdminPanelMainScreen">
            {this.getManageMenu()}
            {PageList[this.state.active]}
        </div>;
    }
}