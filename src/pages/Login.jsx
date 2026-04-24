import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        if (!email || !password) {
            alert("Preencha todos os campos para continuar.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro ao autenticar usuário.");
            }

            localStorage.setItem("token", data.token);

            alert("Login bem-sucedido!");
            navigate("/dashboard");

        } catch (error) {
            console.error("Error during login:", error);
            alert("Erro ao autenticar usuário. Por favor, tente novamente.");
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
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