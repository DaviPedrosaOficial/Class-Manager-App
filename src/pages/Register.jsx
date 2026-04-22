import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/api.js";

function Register() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleRegister(e) {
        e.preventDefault();

        if (!nome || !email || !password || !confirmPassword) {
            alert("Preencha todos os campos para continuar.");
            return;
        }

        if (password !== confirmPassword) {
            alert("As senhas não coincidem. Por favor, tente novamente.");
            return;
        }

        try {
            await registerUser({ nome, email, password });

            alert("Usuário registrado com sucesso!");
            navigate("/");

        } catch (error) {
            console.error("Error registering user:", error);
            alert(`Erro ao registrar usuário. Por favor, tente novamente. ${error.message}`);
        }
    }

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={handleRegister}>

                <input className="inputRegister" type="text" placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} />
                <input className="inputRegister" type="text" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="inputRegister" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input className="inputRegister" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                <button className="btnRegister" type="submit">
                    Register
                </button>
            </form>


        </div>
    )
}

export default Register;