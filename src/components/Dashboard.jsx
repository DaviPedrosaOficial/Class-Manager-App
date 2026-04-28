import Layout from "./Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newClassName, setNewClassName] = useState("");

    useEffect(() => {
        async function fetchClasses() {
            const token = localStorage.getItem("token");

            if (!token) {
                console.log("Sem token!");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/api/classes", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error("Erro da API:", data);
                    return;
                }

                setClasses(data);

            } catch (error) {
                console.error("Erro na requisição:", error);
            }
        }

        fetchClasses();
    }, []);

    async function handleCreateClass() {
        if (!newClassName.trim()) {
            alert("O nome da turma é obrigatório!");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:3000/api/classes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ nome: newClassName.trim() })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Erro da API:", data.message);
                return;
            }

            setClasses((prev) => [...prev, data]);
            setNewClassName("");
            setShowModal(false);

        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    }

    return (
        <Layout>
            <div className="mb-4">
                <h1 className="display-5">Dashboard</h1>
                <p className="text-muted">Gerencie suas turmas</p>
            </div>

            <button className="btn btn-primary mb-4" onClick={() => setShowModal(true)}>
                + Nova Turma
            </button>

            <div className="card">
                <div className="card-body">

                    {classes.length === 0 ? (
                        <p className="text-muted">Nenhuma turma criada</p>
                    ) : (
                        <ul className="list-group">
                            {classes.map((c) => (
                                <li key={c._id}
                                    className="list-group-item"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/classes/${c._id}`)}>
                                    {c.nome}
                                </li>
                            ))}
                        </ul>
                    )}

                </div>
            </div>

            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">Nova Turma</h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nome da turma"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                />
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>

                                <button
                                    className="btn btn-primary"
                                    onClick={handleCreateClass}
                                >
                                    Criar
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default Dashboard;