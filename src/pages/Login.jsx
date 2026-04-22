import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    function handleLogin() {
        navigate("/dashboard");
    }

    return (
        <div>
            <h1>Login</h1>

            <input className="inputLogin" type="text" placeholder="E-mail" />
            <input className="inputLogin" type="password" placeholder="Password" />

            <button className="btnLogin" onClick={handleLogin}>
                Login
            </button>

            <p>Ainda não tem uma conta? <Link to="/register"> Cadastre-se </Link></p>
        </div>
    )
}

export default Login;