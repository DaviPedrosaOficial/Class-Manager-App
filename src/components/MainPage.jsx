import Layout from "./Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function MainPage() {
    const navigate = useNavigate();

    const [institutions, setInstitutions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newInstitution, setNewInstitution] = useState("");

    useEffect(() => {
        async function fetchInstitutions() {
            try {
                const data = await api.get("/institutions");
                setInstitutions(data);
            } catch (error) {
                console.error(error.message);
            }
        }

        fetchInstitutions();
    }, []);

    async function handleCreateInstitution() {
        if (!newInstitution.trim()) return;

        try {
            const data = await api.post("/institutions", {
                nome: newInstitution
            });

            setInstitutions((prev) => [...prev, data]);
            setNewInstitution("");
            setShowModal(false);

        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <Layout>
            <div className="mb-5 text-center">
                <h1 className="display-4 fw-bold main-title">Instituições</h1>
                <p className="text-muted">Selecione ou crie uma instituição</p>
            </div>

            <div className="d-flex justify-content-end mb-1">
                <button
                    className="btn btn-primary mb-2"
                    onClick={() => setShowModal(true)}
                >
                    + Nova Instituição
                </button>
            </div>


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