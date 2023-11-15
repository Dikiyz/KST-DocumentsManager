import "./App.css";
import Header from "./Components/Header/Header";
import AdminPanel from "./Pages/AdminPanel/AdminPanel";
import Authentificate from "./Pages/Authentificate/Authentificate";
import RequestList from "./Pages/RequestList/RequestList";
import RequestPage from "./Pages/RequestPage/RequestPage";
import MyResponses from "./Pages/MyResponses/MyResponses";
import MyRequestList from "./Pages/MyRequestList/MyRequestList";
import "./fonts/fonts.scss";
import React from "react";
import axios from "axios";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Notify from "./Components/Notify/Notify";

window.notify = {
    show: () => { },
    clear: () => { }
};
axios.defaults.withCredentials = true;
window.getCookies = () => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:22005/getMyCookies').then(response => {
            if (response.status !== 200) reject(response);
            else resolve(response.data);
        }).catch((err) => console.error(err));
    });
};
window.errorHandler = ({ response }) => {
    window.notify.show(2, response.data.message);
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Authentificate />,
    },
    {
        path: "/admin",
        element: <AdminPanel />,
    },
    {
        path: "/responses",
        element: <RequestPage />,
    },
    {
        path: "/myResponses",
        element: <MyResponses />,
    },
    {
        path: "/myRequests",
        element: <MyRequestList />,
    },
    {
        path: "/requests",
        element: <RequestList />,
    },
]);

function App() {
    return <>
        <Notify />
        <Header />
        <RouterProvider router={router} />
    </>;
}

export default App;
