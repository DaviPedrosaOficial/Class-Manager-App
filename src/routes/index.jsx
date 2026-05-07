import { BrowserRouter, Route, Routes } from "react-router-dom";

import InstitutionPage from "../components/InstitutionPage";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../components/Login";
import Register from "../components/Register";
import ClassPage from "../components/ClassPage";
import MainPage from "../components/MainPage";
import Reports from "../components/Reports";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/mainpage"
                    element={
                        <ProtectedRoute >
                            <MainPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute >
                            <Reports />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/institutionpage/:id"
                    element={
                        <ProtectedRoute >
                            <InstitutionPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/classes/:id"
                    element={
                        <ProtectedRoute >
                            <ClassPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;