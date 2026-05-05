import Layout from "./Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
    const navigate = useNavigate();

    const [institutions, setInstitutions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newInstitution, setNewInstitution] = useState("");

    useEffect(() => {
        async function fetchInstitutions() {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:3000/api/institutions", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            setInstitutions(data);
        }

        fetchInstitutions();
    }, []);

    async function handleCreateInstitution() {
        if (!newInstitution.trim()) return;

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/api/institutions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ nome: newInstitution })
        });

        const data = await response.json();

        setInstitutions((prev) => [...prev, data]);
        setNewInstitution("");
        setShowModal(false);
    }

    return (
        <Layout>
            <div className="mb-4">
                <h1 className="display-5">Instituições</h1>
                <p className="text-muted">Selecione ou crie uma instituição</p>
            </div>

            <button
                className="btn btn-primary mb-4"
                onClick={() => setShowModal(true)}
            >
                + Nova Instituição
            </button>

            <div className="card">
                <div className="card-body">

                    {institutions.length === 0 ? (
                        <p className="text-muted">Nenhuma instituição criada</p>
                    ) : (
                        <ul className="list-group">
                            {institutions.map((inst) => (
                                <li
                                    key={inst._id}
                                    className="list-group-item"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/institutionpage/${inst._id}`)}
                                >
                                    {inst.nome}
                                </li>
                            ))}
                        </ul>
                    )}

                </div>
            </div>

            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>

                    <div className="modal fade show d-block">
                        <div className="modal-dialog">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h5>Nova Instituição</h5>
                                    <button
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    />
                                </div>

                                <div className="modal-body">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nome da instituição"
                                        value={newInstitution}
                                        onChange={(e) =>
                                            setNewInstitution(e.target.value)
                                        }
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
                                        onClick={handleCreateInstitution}
                                    >
                                        Criar
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            )}
        </Layout>
    );
}

export default MainPage;