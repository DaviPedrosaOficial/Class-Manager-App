import Layout from "./Layout";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { toast } from "react-toastify";

function InstitutionPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [classes, setClasses] = useState([]);
    const [institution, setInstitution] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [materia, setMateria] = useState("");
    const [nomeTurma, setNomeTurma] = useState("");
    const [turno, setTurno] = useState("");
    const [mediaMinima, setMediaMinima] = useState("");

    const [editingClass, setEditingClass] = useState(null);

    const [atividades, setAtividades] = useState([
        { nomeAtividade: "", peso: "" }
    ]);

    // BUSCAR DADOS
    useEffect(() => {
        async function fetchData() {
            try {
                const [classesData, institutionData] = await Promise.all([
                    api.get(`/institutions/${id}/classes`),
                    api.get(`/institutions/${id}`)
                ]);

                setClasses(classesData);
                setInstitution(institutionData);

            } catch (error) {
                toast.error("Erro ao carregar dados:", error.message);
            }
        }

        fetchData();
    }, [id]);

    // CRIAR TURMA
    async function handleCreateClass() {
        if (!materia || !nomeTurma || !turno) {
            toast.error("Preencha todos os campos!");
            return;
        }

        const atividadesValidas = atividades.filter(
            (a) =>
                a.nomeAtividade.trim() !== "" &&
                a.peso !== "" &&
                !isNaN(a.peso)
        );

        if (atividadesValidas.length === 0) {
            toast.error("Adicione pelo menos uma atividade!");
            return;
        }

        try {
            const data = await api.post("/classes", {
                materia,
                nomeTurma,
                turno,
                atividades,
                mediaMinima,
                institutionId: id
            });

            setClasses((prev) => [...prev, data]);

            // reset
            setMateria("");
            setNomeTurma("");
            setTurno("");
            setMediaMinima("");
            setAtividades([{ nomeAtividade: "", peso: "" }]);
            setShowModal(false);

            toast.success("Turma criada com sucesso!");

        } catch (error) {
            toast.error(error.message || "Erro ao criar turma");
        }
    }

    async function handleUpdateClass() {
        if (!nomeTurma || !materia || !turno) {
            toast.error("Preencha todos os campos!")
            return;
        }

        try {
            const updated = await api.put(`/classes/${editingClass._id}`, {
                materia,
                nomeTurma,
                turno,
                atividades,
                mediaMinima
            });

            setClasses((prev) => prev.map((c) => c._id === updated._id ? updated : c));

            toast.success("Turma atualizada com sucesso!");

            // reset
            setEditingClass(null);
            setMateria("");
            setNomeTurma("");
            setTurno("");
            setMediaMinima("");
            setAtividades([{ nomeAtividade: "", peso: "" }]);
            setShowModal(false);
        } catch (error) {
            toast.error(error.message || "Erro ao atualizar a turma");
        }
    }

    async function handleDeleteClass(classId) {
        if (!window.confirm("Remover turma?")) return;

        try {
            await api.delete(`/classes/${classId}`);

            setClasses((prev) => prev.filter((c) => c._id !== classId));

            toast.success("Turma deletada com sucesso!")

        } catch (error) {
            toast.error(`Erro ao deletar a turma. Erro: ${error}`);
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
                <div className="mb-5 text-center">
                    <h1 className="display-4 fw-bold institution-title">
                        {institution?.nome || "Carregando..."}
                    </h1>
                    <p className="text-muted fs-5">Gerencie suas turmas</p>
                </div>

                {/* BOTÃO */}
                <div className="d-flex justify-content-end mb-1">
                    <button
                        className="btn btn-primary mb-4"
                        onClick={() => setShowModal(true)}
                    >
                        + Nova Turma
                    </button>
                </div>


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
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigate(`/classes/${c._id}`)}
                                    >
                                        <div>
                                            <strong>Matéria: {c.materia}</strong>
                                            <div>{c.nomeTurma}</div>
                                            <small>Turno: {c.turno}</small>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    setEditingClass(c);

                                                    setMateria(c.materia);
                                                    setNomeTurma(c.nomeTurma);
                                                    setTurno(c.turno);
                                                    setMediaMinima(c.mediaMinima || "");
                                                    setAtividades(c.atividades || []);

                                                    setShowModal(true);
                                                }}
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClass(c._id);
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

                {/* MODAL */}
                {showModal && (
                    <>
                        <div className="modal-backdrop fade show"></div>

                        <div className="modal fade show d-block">
                            <div className="modal-dialog">
                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h5>{editingClass ? "Editar turma" : "Nova Turma"}</h5>
                                        <button
                                            className="btn-close"
                                            onClick={() => {
                                                setShowModal(false);
                                                setEditingClass(null);
                                            }}
                                        />
                                    </div>

                                    {/* Inputs requeridos para a criação de Turma */}
                                    <div className="modal-body">
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Matéria"
                                            value={materia}
                                            onChange={(e) => setMateria(e.target.value)}
                                        />

                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Nome da turma"
                                            value={nomeTurma}
                                            onChange={(e) => setNomeTurma(e.target.value)}
                                        />

                                        <select
                                            className="form-control mb-3"
                                            value={turno}
                                            onChange={(e) => setTurno(e.target.value)}
                                        >
                                            <option value="">Selecione o turno</option>
                                            <option value="Manhã">Manhã</option>
                                            <option value="Tarde">Tarde</option>
                                            <option value="Noite">Noite</option>
                                        </select>

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
                                            onClick={() => {
                                                setShowModal(false);
                                                setEditingClass(null);
                                            }}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            className="btn btn-primary"
                                            onClick={editingClass ? handleUpdateClass : handleCreateClass}
                                        >
                                            {editingClass ? "Salvar" : "Criar"}
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