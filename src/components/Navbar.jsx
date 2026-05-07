import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="navbar navbar-dark bg-primary shadow-sm">
            <div className="container-fluid px-4">

                <Link className="navbar-brand navbar-title" to={token ? "/mainpage" : "/"}>ClassManager</Link>

                <div className="d-flex ms-auto">
                    <ul className="d-flex align-items-center gap-3 list-unstyled mb-0">
                        {token ? (
                            <>
                                <li className="nav-item">
                                    <button
                                        className="navbar-link navbar-button text-white"
                                        onClick={() => {
                                            localStorage.getItem("token");
                                            navigate(
                                                location.pathname === "/reports" ? "/mainpage" : "/reports"
                                            );
                                        }}
                                    >
                                        {location.pathname === "/reports" ? "Minhas instituições" : "Meus relatórios"}
                                    </button>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className="navbar-link navbar-button text-white"
                                        onClick={() => {
                                            localStorage.removeItem("token");
                                            navigate("/");
                                        }}
                                    >
                                        Sair
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="navbar-link text-white text-decoration-none fw-semibold" to="/">Entrar</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="navbar-link text-white text-decoration-none fw-semibold" to="/register">Cadastrar</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;