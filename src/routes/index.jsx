import { BrowserRouter, Route, Routes } from "react-router-dom";

import InstitutionPage from "../components/InstitutionPage";
import Login from "../components/Login";
import Register from "../components/Register";
import ClassPage from "../components/ClassPage";
import MainPage from "../components/MainPage";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/mainpage" element={<MainPage />} />
                <Route path="/institutionpage/:id" element={<InstitutionPage />} />
                <Route path="/classes/:id" element={<ClassPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;