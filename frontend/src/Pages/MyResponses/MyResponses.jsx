import React from "react";
import "./MyResponses.scss";
import axios from "axios";

export default class MyResponses extends React.Component {
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
        return <div>

        </div>;
    }
}