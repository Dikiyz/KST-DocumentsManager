import React from "react";
import "./Header.scss";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cookies: {},
        };
    }

    componentDidMount() {
        window.getCookies().then(result => this.setState({ cookies: result }));
    }

    getAdminHeader() {
        return <>
            <div className="Logo">
                <p>КСТ</p>
                {this.state.cookies?.UserDTO?.is_admin && <p className="small">Панель администратора</p>}
            </div>
            <div className="ExitButton">Выйти</div>
            {/* <div className="ButtonList">
                <div onClick={() => window.location = "/responses"}>Заказаать справку</div>
                <div onClick={() => window.location = "/myRequests"}>Мои заказы</div>
                {this.state.cookies?.UserDTO?.is_admin && <>
                    <div onClick={() => window.location = "/requests"}>Заказы</div>
                    <div onClick={() => window.location = "/myResponses"}>Мои решения</div>
                </>}
            </div> */}
        </>;
    }

    getUserHeader() {
        return this.getAdminHeader();
    }

    render() {
        return <header>
            {this.state.cookies?.UserDTO?.is_admin ?
                this.getAdminHeader() :
                this.getUserHeader()}
        </header>;
    }
}