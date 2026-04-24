import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/Layout";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        if (!email || !password) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            localStorage.setItem("token", data.token);

            alert("Login realizado!");
            navigate("/dashboard");

        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <Layout>
            <div className="row justify-content-center">
                <div className="col-md-6">

                    <h1 className="display-4 text-center mb-3">Login</h1>
                    <p className="text-center text-muted mb-4">
                        Faça login para acessar sua conta
                    </p>

                    <form onSubmit={handleLogin}>

                        <div className="mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label>Senha</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button className="btn btn-primary w-100">
                            Entrar
                        </button>

                    </form>

                    <p className="text-center mt-3">
                        Não tem conta? <Link to="/register">Cadastre-se</Link>
                    </p>

                </div>
            </div>
        </Layout>
    );
}

export default Login;