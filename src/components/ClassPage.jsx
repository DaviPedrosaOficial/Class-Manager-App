import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Layout from "./Layout";
import { api } from "../services/api"
import { toast } from "react-toastify";

function ClassPage() {
    const { id } = useParams();
    const [classData, setClassData] = useState(null);

    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newStudentName, setNewStudentName] = useState("");
    const [newStudentMatricula, setNewStudentMatricula] = useState("");
    const [editingStudent, setEditingStudent] = useState(null);

    const [showGradeModal, setShowGradeModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState("");
    const [gradeInput, setGradeInput] = useState({});

    const [sortType, setSortType] = useState("nome")
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDeboucedSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const [statusFilter, setStatusFilter] = useState("todos");

    useEffect(() => {
        async function fetchData() {

            try {
                const [classData, studentData] = await Promise.all([
                    api.get(`/classes/${id}`),
                    api.get(`/classes/${id}/students`)
                ]);

                setClassData(classData);
                setStudents(studentData);

            } catch (error) {
                toast.error("Erro geral:", error.message);
            }
        };

        fetchData();

    }, [id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDeboucedSearch(search);
        }, 300);

        return () => clearTimeout(timer);

    }, [search]);

    async function handleCreateStudent() {
        if (!newStudentName.trim() || !newStudentMatricula.trim()) {
            toast.error("Nome e matrícula são obrigatórios!");
            return;
        }

        try {
            setLoading(true);

            const createData = await api.post(`/classes/${id}/students`, {
                nome: newStudentName,
                matricula: newStudentMatricula
            });

            setStudents((prev) => [...prev, createData]);

            setNewStudentName("");
            setNewStudentMatricula("");
            setShowModal(false);

            toast.success("Aluno criado com sucesso!");

        } catch (error) {
            toast.error("Erro criar aluno:", error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateStudent() {
        if (!editingStudent.nome.trim() || !editingStudent.matricula.trim()) {
            toast.error("Campos obrigatórios!");
            return;
        }

        try {
            setLoading(true);

            const updated = await api.put(
                `/classes/${id}/students/${editingStudent._id}`,
                {
                    nome: editingStudent.nome,
                    matricula: editingStudent.matricula
                }
            );

            setStudents((prev) => prev.map((s) => s._id === updated._id ? updated : s));

            setEditingStudent(null);
            toast.success("Aluno atualizado!");

        } catch (error) {
            toast.error("Erro ao atualizar estudante", error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteStudent(studentId) {
        if (!window.confirm("Tem certeza que deseja remover o aluno?")) return;

        try {
            await api.delete(`/classes/${id}/students/${studentId}`);

            setStudents((prev) =>
                prev.filter((student) => student._id !== studentId)
            );

            toast.success("Aluno removido!");

        } catch (error) {
            toast.error("Erro ao remover aluno");
        }
    }

    function handleGradeChange(studentId, value) {
        setGradeInput((prev) => ({
            ...prev,
            [studentId]: Number(value)
        }));
    }

    async function handleSubmitGrades() {
        try {
            setLoading(true);

            const gradeData = await api.put(`/classes/${id}/grades`, {
                atividadeId: selectedActivity,
                grades: gradeInput
            });

            setStudents(gradeData);

            setShowGradeModal(false);
            setGradeInput({});
            setSelectedActivity("");

            toast.success("Notas lançadas com sucesso!");

        } catch (error) {
            toast.error("Erro lançar notas:", error.message);
        } finally {
            setLoading(false);
        }
    }

    function calcularMedia(student, atividades) {
        let somaNotas = 0;
        let somaPesos = 0;

        atividades.forEach((atividade) => {
            const grade = student.grades?.find(
                (a) => a.atividadeId?.toString() === atividade._id?.toString()
            );

            if (grade && grade.nota !== undefined) {
                somaNotas += grade.nota;
                somaPesos += atividade.peso;
            }
        });

        if (somaPesos === 0) return 0;

        return (somaNotas / somaPesos) * 100;
    }

    function calcularTotal(student, atividades) {
        let total = 0;

        atividades.forEach((atividade) => {
            const grade = student.grades?.find(
                (g) => g.atividadeId?.toString() === atividade._id?.toString()
            );

            if (grade) {
                total += grade.nota;
            }
        });

        return total;
    }

    const processedStudents = useMemo(() => {
        return students.map((student) => {
            const media = calcularMedia(student, classData.atividades);
            const total = calcularTotal(student, classData.atividades);

            return {
                ...student,
                media,
                total
            };
        });
    }, [students, classData?.atividades]);

    function calcularTotalMaximo(atividades) {
        return atividades.reduce((acumulador, a) => acumulador + a.peso, 0);
    }

    const filteredStudents = useMemo(() => {
        let filtered = [...processedStudents];

        if (debouncedSearch.trim() !== "") {
            filtered = filtered.filter((student) =>
                student.nome.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }

        if (statusFilter !== "todos") {
            filtered = filtered.filter((student) => {
                const media = student.media;
                const temNotas = student.grades && student.grades.length > 0;

                if (statusFilter === "aprovado") {
                    return temNotas && media >= classData.mediaMinima;
                }

                if (statusFilter === "risco") {
                    return temNotas && media < classData.mediaMinima;
                }

                if (statusFilter === "sem") {
                    return !temNotas;
                }

                return true
            });
        }

        if (sortType === "media") {
            return filtered.sort((a, b) => b.media - a.media);
        }

        if (sortType === "nome") {
            return filtered.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
        }

        return filtered;
    }, [processedStudents, statusFilter, sortType, classData, debouncedSearch]);

    const classStats = useMemo(() => {
        if (processedStudents.length === 0) {
            return {
                mediaGeral: 0,
                abaixoDaMedia: 0
            }
        }

        let somaMedia = 0;
        let abaixo = 0;
        let alunosAvaliados = 0;

        processedStudents.forEach((student) => {

            const temNotas = student.grades?.length > 0;

            if (!temNotas) return;

            alunosAvaliados++;

            somaMedia += student.media;

            if (student.media < classData.mediaMinima) {
                abaixo++;
            }
        });

        const mediaGeral = alunosAvaliados > 0 ? somaMedia / alunosAvaliados : 0;

        return {
            mediaGeral,
            abaixoDaMedia: abaixo
        };
    }, [processedStudents, classData]);

    if (!classData) {
        return (
            <Layout>
                <div className="container mt-4">
                    <h2>Carregando...</h2>
                </div>
            </Layout>
        );
    }

    const totalMax = calcularTotalMaximo(classData.atividades);

    return (
        <Layout>
            <div className="container mt-4 mb-5">

                <div className="class-panel shadow-sm p-4 mb-4">
                    <h1 className="display-5 fw-bold mb-2">
                        {classData.nomeTurma}
                    </h1>

                    <div className="text-muted small mb-2">
                        {classData.materia} • {classData.turno}
                    </div>

                    <div className="d-flex gap-4 flex-wrap">

                        <div>
                            <small className="text-muted">Alunos</small>
                            <div className="fw-bold">{students.length}</div>
                        </div>

                        <div>
                            <small className="text-muted">Média mínima</small>
                            <div className="fw-bold">{classData.mediaMinima}%</div>
                        </div>

                        <div>
                            <small className="text-muted">Atividades</small>
                            <div className="fw-bold">
                                {classData.atividades.length}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">

                    {/* BOTÕES */}
                    <div className="d-flex gap-2 flex-wrap">

                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setShowModal(true)}
                        >
                            + Adicionar Aluno
                        </button>

                        <button
                            className="btn btn-success btn-sm"
                            onClick={() => setShowGradeModal(true)}
                        >
                            + Lançar Notas
                        </button>

                    </div>

                    {/* FILTROS */}
                    <div className="d-flex gap-2 align-items-center flex-wrap">

                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Buscar aluno..."
                            style={{ width: "180px" }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            className="form-select form-select-sm"
                            style={{ width: "160px" }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            <option value="aprovado">Aprovados</option>
                            <option value="risco">Em risco</option>
                            <option value="sem">Sem avaliação</option>
                        </select>

                        <select
                            className="form-select form-select-sm"
                            style={{ width: "180px" }}
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value)}
                        >
                            <option value="nome">Nome (A-Z)</option>
                            <option value="media">Maior média</option>
                        </select>

                    </div>

                </div>

                <p className="text-muted mb-2">
                    {filteredStudents.length} aluno(s) encontrado(s)
                </p>

                {/* Tabela de Alunos */}
                <div className="table-container"
                    style={{ "--cols": classData.atividades.length + 6 }}>

                    {/* HEADER */}
                    <div className="table-header">
                        <div className="table-row">
                            <div>Nome</div>

                            {classData.atividades.map((atividade, index) => (
                                <div key={index}>{atividade.nomeAtividade}</div>
                            ))}

                            <div>Média</div>
                            <div>Total</div>
                            <div>Situação</div>
                            <div>Matrícula</div>
                            <div>Ações</div>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="table-body">
                        {filteredStudents.length === 0 ? (
                            <div className="table-row">
                                <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                                    Nenhum aluno encontrado
                                </div>
                            </div>
                        ) : (
                            filteredStudents.map((student) => {
                                const media = student.media;
                                const temNotas = student.grades && student.grades.length > 0;
                                const total = student.total;


                                return (
                                    <div className="table-row" key={student._id}>
                                        <div>{student.nome}</div>

                                        {classData.atividades.map((atividade, index) => {
                                            const grade = student.grades?.find(
                                                (g) => g.atividadeId?.toString() === atividade._id?.toString()
                                            );


                                            return (
                                                <div key={index}>
                                                    {grade ? (
                                                        <strong>{grade.nota} / {atividade.peso}</strong>
                                                    ) : (
                                                        <span className="text-muted">
                                                            - / {atividade.peso}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        <div>{media.toFixed(1)}%</div>

                                        <div>{total} / {totalMax}</div>

                                        <div>
                                            {!temNotas ? (
                                                <span className="text-muted">Sem avaliação</span>
                                            ) : media >= classData.mediaMinima ? (
                                                <span className="badge bg-success">Aprovado</span>
                                            ) : (
                                                <span className="badge bg-danger">Em risco</span>
                                            )}
                                        </div>

                                        <div>{student.matricula}</div>

                                        <div className="d-flex gap-1">
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={() => setEditingStudent(student)}
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteStudent(student._id)}
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Div Média da turma */}
                <div className="mt-4 p-3 border rounded bg-light">

                    <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap">

                        <strong>
                            Média geral da turma: {classStats.mediaGeral.toFixed(1)}%
                        </strong>

                        <span className={`fw-bold ${classStats.abaixoDaMedia > 0 ? "text-danger" : "text-success"
                            }`}>
                            {classStats.abaixoDaMedia} aluno(s) abaixo da média
                        </span>

                    </div>

                    {/* Barra visual */}
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width: `${classStats.mediaGeral}%`,
                            background: classStats.mediaGeral >= classData.mediaMinima
                                ? "linear-gradient(90deg, #198754, #20c997)"
                                : "linear-gradient(90deg, #dc3545, #ff6b6b)",
                            transition: "width 0.5s ease"
                        }}
                    >
                        {classStats.mediaGeral.toFixed(0)}%
                    </div>

                    <p className="mb-0 mt-2 text-muted">
                        {classStats.mediaGeral >= classData.mediaMinima
                            ? "A turma está acima da média mínima"
                            : "A turma está abaixo da média mínima"}
                    </p>

                </div>
            </div>

            {/* Modal Adicionar Aluno */}
            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>

                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h5 className="modal-title">Novo Aluno</h5>
                                    <button
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>

                                <div className="modal-body">

                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        placeholder="Nome do aluno"
                                        value={newStudentName}
                                        onChange={(e) => setNewStudentName(e.target.value)}
                                    />

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Matrícula"
                                        value={newStudentMatricula}
                                        onChange={(e) => setNewStudentMatricula(e.target.value)}
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
                                        onClick={handleCreateStudent}
                                        disabled={loading}
                                    >
                                        {loading ? "salvando..." : "Criar"}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Modal para lançar notas */}
            {showGradeModal && (
                <>
                    <div className="modal-backdrop fade show"></div>

                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h5 className="modal-title">Lançar Notas</h5>
                                    <button
                                        className="btn-close"
                                        onClick={() => setShowGradeModal(false)}
                                    ></button>
                                </div>

                                <div className="modal-body">

                                    <select
                                        className="form-select mb-3"
                                        value={selectedActivity}
                                        onChange={(e) => setSelectedActivity(e.target.value)}
                                    >
                                        <option value="">Selecione uma atividade</option>

                                        {classData.atividades.map((atividade) => (
                                            <option key={atividade._id} value={atividade._id}>
                                                {atividade.nomeAtividade}
                                            </option>
                                        ))}
                                    </select>

                                    {selectedActivity && students.map((student) => (
                                        <div key={student._id} className="d-flex justify-content-between mb-2">
                                            <span>{student.nome}</span>

                                            <input
                                                type="number"
                                                className="form-control w-25"
                                                placeholder="Nota"
                                                min="0"
                                                max={
                                                    classData.atividades.find(a => a._id === selectedActivity)?.peso || 0
                                                }
                                                value={gradeInput[student._id] || ""}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    const atividade = classData.atividades.find(a => a._id === selectedActivity);
                                                    const max = atividade?.peso || 0;

                                                    if (value <= max) {
                                                        handleGradeChange(student._id, value);
                                                    }
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowGradeModal(false)}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        className="btn btn-success"
                                        onClick={handleSubmitGrades}
                                        disabled={loading || !selectedActivity}
                                    >
                                        {loading ? "Salvando..." : "Salvar Notas"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Modal Editar Aluno */}
            {editingStudent && (
                <>
                    <div className="modal-backdrop fade show"></div>

                    <div className="modal fade show d-block">
                        <div className="modal-dialog">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h5>Editar Aluno</h5>
                                    <button
                                        className="btn-close"
                                        onClick={() => setEditingStudent(null)}
                                    />
                                </div>

                                <div className="modal-body">

                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        value={editingStudent.nome}
                                        onChange={(e) =>
                                            setEditingStudent({
                                                ...editingStudent,
                                                nome: e.target.value
                                            })
                                        }
                                    />

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editingStudent.matricula}
                                        onChange={(e) =>
                                            setEditingStudent({
                                                ...editingStudent,
                                                matricula: e.target.value
                                            })
                                        }
                                    />

                                </div>

                                <div className="modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setEditingStudent(null)}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={handleUpdateStudent}
                                        disabled={loading}
                                    >
                                        {loading ? "Salvando..." : "Salvar"}
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

export default ClassPage;