import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/Layout";
import { registerUser } from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleRegister(e) {
        e.preventDefault();

        if (!nome || !email || !password || !confirmPassword) {
            alert("Preencha todos os campos.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Senhas não coincidem.");
            return;
        }

        try {
            await registerUser({ nome, email, password });

            alert("Usuário criado!");
            navigate("/");

        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <Layout>
            <div className="row justify-content-center">
                <div className="col-md-6">

                    <h1 className="display-4 text-center mb-3">Cadastro</h1>
                    <p className="text-center text-muted mb-4">
                        Crie sua conta para começar
                    </p>

                    <form onSubmit={handleRegister}>

                        <div className="mb-3">
                            <label>Nome</label>
                            <input
                                className="form-control"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label>Email</label>
                            <input
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

                        <div className="mb-3">
                            <label>Confirmar senha</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button className="btn btn-primary w-100">
                            Registrar
                        </button>

                    </form>

                    <p className="text-center mt-3">
                        Já tem conta? <a href="/">Faça login</a>
                    </p>

                </div>
            </div>
        </Layout>
    );
}

export default Register;