import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    function handleRegister() {
        navigate("/dashboard");
    }

    return (
        <div>
            <h1>Register</h1>

            <input className="inputRegister" type="text" placeholder="Nome Completo" />
            <input className="inputRegister" type="text" placeholder="E-mail" />
            <input className="inputRegister" type="password" placeholder="Password" />

            <button className="btnRegister" onClick={handleRegister}>
                Register
            </button>
        </div>
    )
}

export default Register;