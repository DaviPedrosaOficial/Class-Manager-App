import Layout from "./Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { toast } from "react-toastify";

function MainPage() {
    const navigate = useNavigate();

    const [institutions, setInstitutions] = useState([]);
    const [newInstitution, setNewInstitution] = useState("");
    const [newMatriz, setNewMatriz] = useState("");

    const [editingInstitution, setEditingInstitution] = useState(null);

    const [showModal, setShowModal] = useState(false);

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
        if (!newInstitution.trim() || !newMatriz.trim()) {
            toast.error("Preencha todos os campos!")
            return
        };

        try {
            const data = await api.post("/institutions", {
                nome: newInstitution,
                matriz: newMatriz
            });

            setInstitutions((prev) => [...prev, data]);
            setNewInstitution("");
            setNewMatriz("");
            setShowModal(false);

        } catch (error) {
            console.error(error.message);
        }
    }

    async function handleUpdateInstitution() {
        if (!newInstitution.trim() || !newMatriz.trim()) {
            toast.error("Preencha todos os campos!");
            return;
        }

        try {
            const updated = await api.put(`/institutions/${editingInstitution._id}`, {
                nome: newInstitution,
                matriz: newMatriz
            });

            setInstitutions((prev) => prev.map((inst) => inst._id === editingInstitution._id ? updated : inst));

            toast.success("Instituição atualizada com sucesso!")

            setEditingInstitution("");
            setNewInstitution("");
            setNewMatriz("");
            setShowModal(false);

        } catch (error) {
            toast.error("Erro ao atualizar a instituição");
        }
    }

    async function handleDeleteInstitution(institutionId) {
        if (!window.confirm("Remover instituição?")) return;

        try {
            await api.delete(`/institutions/${institutionId}`);

            setInstitutions((prev) => prev.filter((inst) => inst._id !== institutionId));

            toast.success("Instituição removida com sucesso!");

        } catch (error) {
            toast.error("Erro ao remover a instituição");
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
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/institutionpage/${inst._id}`)}
                                >
                                    <div>
                                        {inst.nome}
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                setEditingInstitution(inst);
                                                setNewInstitution(inst.nome);
                                                setNewMatriz(inst.matriz || "");

                                                setShowModal(true);
                                            }}
                                        >
                                            ✏️
                                        </button>

                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                handleDeleteInstitution(inst._id);
                                            }}
                                        >
                                            🗑
                                        </button>
                                    </div>

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
                                    <h5>{editingInstitution ? "Editar instituição" : "Nova instituição"}</h5>
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

                                <div className="modal-body">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nome da matriz da instituição. Ex.: Aimores ou Savassi"
                                        value={newMatriz}
                                        onChange={(e) =>
                                            setNewMatriz(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingInstitution(null);
                                            setNewInstitution("");
                                        }}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={editingInstitution ? handleUpdateInstitution : handleCreateInstitution}
                                    >
                                        {editingInstitution ? "Salvar" : "Criar"}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            )
            }
        </Layout >
    );
}

export default MainPage;