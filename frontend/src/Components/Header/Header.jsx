import React from "react";
import "./Header.scss";
import axios from "axios";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cookies: {},
        };
        axios.defaults.withCredentials = true;
    }

    componentDidMount() {
        axios.get('http://localhost:22005/getMyCookies').then(response => {
            if (response.status !== 200) return;
            this.setState({ cookies: response.data });
        }).catch(error => console.error(error.response.data.message));
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