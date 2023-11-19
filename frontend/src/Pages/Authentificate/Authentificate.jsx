import React from "react";
import "./Authentificate.scss";
import axios from "axios";

export default class Authentificate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: true,
            cookies: {},
            authData: {
                login: "",
                password: "",
            }
        };
    }

    componentDidMount() {
        window.getCookies().then(result => this.setState(
            this.setState({ cookies: result }, () => {
                if (this.state.cookies?.UserDTO) window.location = "/responses";
            })
        ));
    }

    onSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:22005/authorization/logIn', {
            login: this.state.authData.login,
            password: this.state.authData.password
        }).then((response) => window.location = "/responses")
            .catch(window.errorHandler);
    }

    onLoginChanged(e) {
        const RegedString = String(e.target.value).replace(/[^a-zA-Z0-9.]/g, "");
        if (RegedString.length > 24) this.setState({ authData: this.state.authData });
        else this.setState((prevState) => {
            const newData = Object.assign({}, prevState.authData);
            newData.login = RegedString;
            return { authData: newData };
        });
    }

    onPassChanged(e) {
        const RegedString = String(e.target.value).replace(/[^a-zA-Z0-9!(){}]/g, "");
        if (RegedString.length > 24) this.setState({ authData: this.state.authData });
        else this.setState((prevState) => {
            const newData = Object.assign({}, prevState.authData);
            newData.password = RegedString;
            return { authData: newData };
        });
    }

    render() {
        return <div className="AuthentificateMainPage">
            <div className="AuthentificateBlock">
                <form className="AuthForm" onSubmit={this.onSubmit.bind(this)}>
                    <input
                        name="login"
                        placeholder="Логин"
                        onChange={this.onLoginChanged.bind(this)}
                        value={this.state.authData.login}
                    />
                    <input
                        name="password"
                        placeholder="Пароль"
                        onChange={this.onPassChanged.bind(this)}
                        value={this.state.authData.password}
                    />
                    <button>Войти</button>
                    <div className="HelpDiv">
                        <a onClick={() => window.showNotify(1, "Coming soon...", 2000)}>Забыли пароль?</a>
                    </div>
                </form>
            </div>
        </div>;
    }
}
