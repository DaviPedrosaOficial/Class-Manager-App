import Layout from "./Layout";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

function InstitutionPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [classes, setClasses] = useState([]);
    const [institution, setInstitution] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    const [mediaMinima, setMediaMinima] = useState("");

    const [atividades, setAtividades] = useState([
        { nomeAtividade: "", peso: "" }
    ]);

    // BUSCAR DADOS
    useEffect(() => {
        async function fetchData() {
            try {
                const [classesData, institutionData] = await Promise.all([
                    api.get(`/classes/institution/${id}`),
                    api.get(`/institutions/${id}`)
                ]);

                setClasses(classesData);
                setInstitution(institutionData);

            } catch (error) {
                console.error("Erro ao carregar dados:", error.message);
            }
        }

        fetchData();
    }, [id]);

    // CRIAR TURMA
    async function handleCreateClass() {
        if (!newClassName.trim()) {
            alert("O nome da turma é obrigatório!");
            return;
        }

        const atividadesValidas = atividades.filter(
            (a) =>
                a.nomeAtividade.trim() !== "" &&
                a.peso !== "" &&
                !isNaN(a.peso)
        );

        if (atividadesValidas.length === 0) {
            alert("Adicione pelo menos uma atividade!");
            return;
        }

        try {
            const data = await api.post("/classes", {
                nome: newClassName.trim(),
                atividades: atividadesValidas,
                mediaMinima: Number(mediaMinima),
                institutionId: id
            });

            setClasses((prev) => [...prev, data]);

            // reset
            setNewClassName("");
            setMediaMinima("");
            setAtividades([{ nomeAtividade: "", peso: "" }]);
            setShowModal(false);

        } catch (error) {
            console.error("Erro ao criar turma:", error.message);
        }
    }

    function handleAddAtividade() {
        setAtividades([...atividades, { nomeAtividade: "", peso: "" }]);
    }

    function updateAtividade(index, field, value) {
        const updated = [...atividades];
        updated[index][field] = value;
        setAtividades(updated);
    }

    return (
        <Layout>
            <div className="container mt-4">

                {/* HEADER */}
                <div className="mb-4">
                    <h1 className="display-5">
                        {institution?.nome || "Carregando..."}
                    </h1>
                    <p className="text-muted">Gerencie suas turmas</p>
                </div>

                {/* BOTÃO */}
                <button
                    className="btn btn-primary mb-4"
                    onClick={() => setShowModal(true)}
                >
                    + Nova Turma
                </button>

                {/* LISTA */}
                <div className="card">
                    <div className="card-body">

                        {classes.length === 0 ? (
                            <p className="text-muted">Nenhuma turma criada</p>
                        ) : (
                            <ul className="list-group">
                                {classes.map((c) => (
                                    <li
                                        key={c._id}
                                        className="list-group-item"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigate(`/classes/${c._id}`)}
                                    >
                                        {c.nome}
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                </div>

                {/* MODAL */}
                {showModal && (
                    <>
                        <div className="modal-backdrop fade show"></div>

                        <div className="modal fade show d-block">
                            <div className="modal-dialog">
                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h5>Nova Turma</h5>
                                        <button
                                            className="btn-close"
                                            onClick={() => setShowModal(false)}
                                        />
                                    </div>

                                    <div className="modal-body">
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Nome da turma"
                                            value={newClassName}
                                            onChange={(e) => setNewClassName(e.target.value)}
                                        />

                                        <input
                                            type="number"
                                            className="form-control mb-3"
                                            placeholder="Média mínima"
                                            value={mediaMinima}
                                            onChange={(e) => setMediaMinima(e.target.value)}
                                        />

                                        <h6>Atividades</h6>

                                        {atividades.map((atividade, index) => (
                                            <div key={index} className="mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control mb-1"
                                                    placeholder="Nome"
                                                    value={atividade.nomeAtividade}
                                                    onChange={(e) =>
                                                        updateAtividade(index, "nomeAtividade", e.target.value)
                                                    }
                                                />

                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Peso"
                                                    value={atividade.peso}
                                                    onChange={(e) =>
                                                        updateAtividade(index, "peso", Number(e.target.value))
                                                    }
                                                />
                                            </div>
                                        ))}

                                        <button
                                            className="btn btn-outline-primary mt-2"
                                            onClick={handleAddAtividade}
                                        >
                                            + Atividade
                                        </button>
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
                    </>
                )}

            </div>
        </Layout>
    );
}

export default InstitutionPage;