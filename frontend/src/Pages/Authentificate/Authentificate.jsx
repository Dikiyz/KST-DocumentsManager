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
            },
            signUpData: {
                login: "",
                email: "",
                password: "",
                password_2: "",
            },
            recoveryData: {
                login: "",
                password: "",
            },
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
        if (this.state.isAuth) {
            axios.post('http://localhost:22005/authorization/logIn', {
                login: this.state.authData.login,
                password: this.state.authData.password
            }).then((response) => window.location = "/responses")
                .catch(window.errorHandler);
        } else {
            const SignUpData = this.state.signUpData;
            if (String(SignUpData.login).length < 4)
                return alert("Логин должен состоять минимум из 4-ех символов!");
            if (SignUpData.password !== SignUpData.password_2)
                return alert("Пароли не совпадают!");
            if (String(SignUpData.password).length < 6)
                return alert("Пароль должен состоять минимум из 6-ти символов!");
            console.log(
                `Регистрация пользователя email(${this.state.signUpData.email}) + login(${this.state.signUpData.login}) + password(${this.state.signUpData.password})`
            );
        }
    }

    onLoginChanged(e) {
        const RegedString = String(e.target.value).replace(/[^a-zA-Z0-9.]/g, "");
        if (this.state.isAuth) {
            if (RegedString.length > 24) this.setState({ authData: this.state.authData });
            else this.setState((prevState) => {
                const newData = Object.assign({}, prevState.authData);
                newData.login = RegedString;
                return { authData: newData };
            });
        } else {
            if (RegedString.length > 24) this.setState({ signUpData: this.state.signUpData });
            else this.setState((prevState) => {
                const newData = Object.assign({}, prevState.signUpData);
                newData.login = RegedString;
                return { signUpData: newData };
            });
        }
    }

    onPassChanged(e) {
        const RegedString = String(e.target.value).replace(/[^a-zA-Z0-9!(){}]/g, "");
        if (this.state.isAuth) {
            if (RegedString.length > 24) this.setState({ authData: this.state.authData });
            else this.setState((prevState) => {
                const newData = Object.assign({}, prevState.authData);
                newData.password = RegedString;
                return { authData: newData };
            });
        } else {
            if (RegedString.length > 24) this.setState({ signUpData: this.state.signUpData });
            else this.setState((prevState) => {
                const newData = Object.assign({}, prevState.signUpData);
                newData.password = RegedString;
                return { signUpData: newData };
            });
        }
    }

    onPass2Changed(e) {
        const RegedString = String(e.target.value).replace(/[^a-zA-Z0-9!(){}]/g, "");
        if (RegedString.length > 24) this.setState({ signUpData: this.state.signUpData });
        else this.setState((prevState) => {
            const newData = Object.assign({}, prevState.signUpData);
            newData.password_2 = RegedString;
            return { signUpData: newData };
        });
    }

    onEmailChanged(e) {
        const RegedString = String(e.target.value).replace(/[^a-zA-Z0-9.@]/g, "");
        if (RegedString.length > 24) this.setState({ signUpData: this.state.signUpData });
        else this.setState((prevState) => {
            const newData = Object.assign({}, prevState.signUpData);
            newData.email = RegedString;
            return { signUpData: newData };
        });
    }

    getAuthForm() {
        return (
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
                    <a
                        onClick={() => {
                            alert("Coming soon...");
                        }}
                    >Забыли пароль?</a>
                    <a onClick={() => this.setState({ isAuth: false })}>Нет аккаунта?</a>
                </div>
            </form>
        );
    }

    getSignUpForm() {
        return (
            <form className="SignUpForm" onSubmit={this.onSubmit.bind(this)}>
                <input
                    name="login"
                    placeholder="Логин"
                    onChange={this.onLoginChanged.bind(this)}
                    value={this.state.signUpData.login}
                />
                <input
                    name="email"
                    placeholder="E-Mail"
                    onChange={this.onEmailChanged.bind(this)}
                    value={this.state.signUpData.email}
                />
                <input
                    name="password"
                    placeholder="Пароль"
                    onChange={this.onPassChanged.bind(this)}
                    value={this.state.signUpData.password}
                />
                <input
                    name="password"
                    placeholder="Повторите пароль"
                    onChange={this.onPass2Changed.bind(this)}
                    value={this.state.signUpData.password_2}
                />
                <button>Зарегистрироваться</button>
                <div className="HelpDiv">
                    <a onClick={() => this.setState({ isAuth: true })}>Есть аккаунт?</a>
                </div>
            </form>
        );
    }

    render() {
        return <div className="AuthentificateMainPage">
            <div className="AuthentificateBlock">
                {this.state.isAuth ? this.getAuthForm() : this.getSignUpForm()}
            </div>
        </div>;
    }
}
