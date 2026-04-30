import { data, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./Layout";

function ClassPage() {
    const { id } = useParams();
    const [classData, setClassData] = useState(null);

    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newStudentName, setNewStudentName] = useState("");
    const [newStudentMatricula, setNewStudentMatricula] = useState("");

    const [showGradeModal, setShowGradeModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState("");
    const [gradeInput, setGradeInput] = useState({});

    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem("token");

            try {
                const classResponse = await fetch(`http://localhost:3000/api/classes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const classData = await classResponse.json();

                console.log("Dados da classe:", classData);

                if (classResponse.ok) {
                    setClassData(classData);
                } else {
                    console.error("Erro classe:", classData);
                }

                const studentResponse = await fetch(`http://localhost:3000/api/students/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const studentData = await studentResponse.json();

                if (studentResponse.ok) {
                    setStudents(studentData);
                } else {
                    console.error("Erro alunos:", studentData);
                }

            } catch (error) {
                console.error("Erro geral:", error);
            }
        }

        fetchData();
    }, [id]);

    async function handleCreateStudent() {
        if (!newStudentName.trim() || !newStudentMatricula.trim()) {
            alert("Nome e matrícula são obrigatórios!");
            return;
        }

        const token = localStorage.getItem("token");

        const createResponse = await fetch(`http://localhost:3000/api/students/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ nome: newStudentName, matricula: newStudentMatricula })
        });

        const createData = await createResponse.json();

        if (!createResponse.ok) {
            console.error("Erro criar aluno:", createData);
            return;
        }

        setStudents((prev) => [...prev, createData]);
        setNewStudentName("");
        setNewStudentMatricula("");
        setShowModal(false);
    }

    function handleGradeChange(studentId, value) {
        setGradeInput((prev) => ({
            ...prev,
            [studentId]: Number(value)
        }));
    }

    async function handleSubmitGrades() {
        const token = localStorage.getItem("token");

        const atividade = classData.atividades.find(a => a._id === selectedActivity);
        const max = atividade?.peso || 0;

        for (let studentId in gradeInput) {
            if (gradeInput[studentId] > max) {
                alert("A nota não pode ser maior que o peso da atividade!")
                return;
            }
        }

        const gradeResponse = await fetch(`http://localhost:3000/api/students/grades/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                atividadeId: selectedActivity,
                grades: gradeInput
            })
        });

        const gradeData = await gradeResponse.json();

        if (!gradeResponse.ok) {
            console.error("Erro lançar notas:", gradeData);
            return;
        }

        setStudents(gradeData);

        setShowGradeModal(false);
        setGradeInput({});
        setSelectedActivity("");
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

    if (!classData) {
        return (
            <Layout>
                <div className="container mt-4">
                    <h2>Carregando...</h2>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mt-4 mb-5">
                <h2>Matéria: {classData.nome}</h2>
                <p>Aqui você poderá gerenciar a turma.</p>

                <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
                    + Adicionar Aluno
                </button>

                <button
                    className="btn btn-success mb-3 ms-2"
                    onClick={() => setShowGradeModal(true)}
                >
                    + Lançar Notas
                </button>

                <h3 className="mt-4">Alunos</h3>

                <div className="table-container"
                    style={{ "--cols": classData.atividades.length + 4 }}>

                    {/* HEADER */}
                    <div className="table-header">
                        <div className="table-row">
                            <div>Nome</div>

                            {classData.atividades.map((atividade, index) => (
                                <div key={index}>{atividade.nomeAtividade}</div>
                            ))}

                            <div>Média</div>
                            <div>Situação</div>
                            <div>Matrícula</div>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="table-body">
                        {students.length === 0 ? (
                            <div className="table-row">
                                <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                                    Nenhum aluno cadastrado
                                </div>
                            </div>
                        ) : (
                            students.map((student) => {
                                const media = calcularMedia(student, classData.atividades);
                                const temNotas = student.grades && student.grades.length > 0;

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
                                    </div>
                                );
                            })
                        )}
                    </div>

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
                                    >
                                        Criar
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
                                        disabled={!selectedActivity || Object.keys(gradeInput).length === 0}
                                    >
                                        Salvar Notas
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