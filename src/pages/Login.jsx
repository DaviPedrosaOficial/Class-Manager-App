import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleLogin(e) {
        e.preventDefault();

        if (email && password) {
            navigate("/dashboard");
        } else {
            alert("Preencha os campos de email e senha para continuar.");
        }
    }

    return (
        <div>
            <form action="/" onSubmit={handleLogin}>
                <h1>Login</h1>

                <input className="inputLogin" type="text" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="inputLogin" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button className="btnLogin" type="submit">
                    Login
                </button>
            </form>

            <p>Ainda não tem uma conta? <Link to="/register"> Cadastre-se </Link></p>
        </div>
    )
}

export default Login;