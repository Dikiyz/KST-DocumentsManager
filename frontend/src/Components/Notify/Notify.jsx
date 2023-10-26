import React from "react";
import "./Notify.scss";

let lastId = 0;

export default class Notify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifyPool: [
                // { id: 0, type: 0, text: "Проверка №1", time: Date.now(), expired: Date.now() + 3000 },
                // { id: 1, type: 0, text: "Проверка №2", time: Date.now(), expired: Date.now() + 4000 },
                // { id: 2, type: 1, text: "Проверка №3", time: Date.now(), expired: Date.now() + 5000 },
                // { id: 3, type: 2, text: "Проверка №4", time: Date.now(), expired: Date.now() + 6000 },
            ]
        };
    }

    clearAllNotices() {
        this.setState({ notifyPool: [] });
    }

    showNewNotify(type, text = "Текст отсутствует", _time = 2000) {
        alert(text);
        // const time = Date.now();
        // const expired = Date.now() + time;
        // const id = ++lastId;
        // this.setState({
        //     notifyPool: [...this.state.notifyPool, {
        //         type, text, time, expired
        //     }]
        // }, () => setTimeout(() => {
        //     console.log(111);
        //     this.setState((prevState) => {
        //         const Arr = [].concat(prevState.notifyPool);
        //         let idx2 = -1;
        //         Arr.forEach((el, idx) => {
        //             if (el.id === id) idx2 = idx;
        //         });
        //         if (idx2 !== -1) Arr.splice(idx2, 1);
        //         return { notifyPool: Arr };
        //     });
        // }, _time));
    }

    componentDidMount() {
        window.notify = {
            show: this.showNewNotify.bind(this),
            clear: this.clearAllNotices.bind(this)
        };
        window.showNotify = this.showNewNotify.bind(this);
    }

    componentWillUnmount() {
        window.notify = {
            show: () => { },
            clear: () => { }
        };
    }

    GetNotices() {
        const Notices = [];

        this.state.notifyPool.forEach((el, idx) => {
            Notices.push(<div className={`NotifyBlock ${["Succ", "Warn", "Err"][el.type]}`} key={idx}>
                <h4>{["Успешно!", "Предупреждение!", "Ошибка!"][el.type]}</h4>
                <p>{el.text}</p>
                <div className="TimeLine">
                    <div className="Upper" />
                    <div className="Lower" />
                </div>
            </div>);
        });

        return Notices;
    }

    render() {
        return <div className="NotifyContainer">
            <div className="NotifyList">
                {this.GetNotices()}
            </div>
        </div>;
    }
}