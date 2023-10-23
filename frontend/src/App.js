import "./App.css";
import Header from "./Components/Header/Header";
import Authentificate from "./Pages/Authentificate/Authentificate";
import RequestList from "./Pages/RequestList/RequestList";
import RequestPage from "./Pages/RequestPage/RequestPage";
import MyResponses from "./Pages/MyResponses/MyResponses";
import MyRequestList from "./Pages/MyRequestList/MyRequestList";
import "./fonts/fonts.scss";
import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Authentificate />,
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
        <Header />
        <RouterProvider router={router} />
    </>;
}

export default App;
