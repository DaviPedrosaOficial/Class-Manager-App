import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import Register from "../components/Register";
import ClassPage from "../components/ClassPage";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/classes/:id" element={<ClassPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;