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

    render() {
        return <header>
            <div className="Logo">КСТ</div>
            <div className="ButtonList">
                <div onClick={() => window.location = "/responses"}>Заказаать справку</div>
                <div onClick={() => window.location = "/myRequests"}>Мои заказы</div>
                {this.state.cookies?.UserDTO?.is_admin && <>
                    <div onClick={() => window.location = "/requests"}>Заказы</div>
                    <div onClick={() => window.location = "/myResponses"}>Мои решения</div>
                </>}
            </div>
        </header>;
    }
}