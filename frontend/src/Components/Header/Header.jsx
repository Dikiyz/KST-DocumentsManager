import React from "react";
import "./Header.scss";
import axios from "axios";

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
            <div className="ExitButton" onClick={() => {
                axios.post('http://localhost:22005/authorization/logOut', {}).then(() => window.location = "/")
                    .catch(window.errorHandler);
            }}>Выйти</div>
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