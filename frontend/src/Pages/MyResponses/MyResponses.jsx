import React from "react";
import "./MyResponses.scss";
import axios from "axios";

export default class MyResponses extends React.Component {
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
        return <div>

        </div>;
    }
}