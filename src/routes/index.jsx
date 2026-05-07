import { BrowserRouter, Route, Routes } from "react-router-dom";

import InstitutionPage from "../components/InstitutionPage";
import ProtectedRoute from "../components/ProtectedRoutes";
import Login from "../components/Login";
import Register from "../components/Register";
import ClassPage from "../components/ClassPage";
import MainPage from "../components/MainPage";
import Reports from "../components/Reports";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoutes >
                            <Login />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <ProtectedRoutes >
                            <Register />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/mainpage"
                    element={
                        <ProtectedRoutes >
                            <MainPage />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/reports"
                    element={
                        <ProtectedRoutes >
                            <Reports />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/institutionpage/:id"
                    element={
                        <ProtectedRoutes >
                            <InstitutionPage />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/classes/:id"
                    element={
                        <ProtectedRoutes >
                            <ClassPage />
                        </ProtectedRoutes>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;