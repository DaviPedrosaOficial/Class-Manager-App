import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function handleRegister(e) {
        e.preventDefault();

        if (nome && email && password && confirmPassword) {
            if (password === confirmPassword) {
                navigate("/");
            } else {
                alert("As senhas não coincidem. Por favor, tente novamente.");
            }
        } else {
            alert("Preencha todos os campos para continuar.");
        }

    }

    return (
        <div>
            <h1>Register</h1>

            <form action="/register" onSubmit={handleRegister}>

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