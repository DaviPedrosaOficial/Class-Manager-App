import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./Layout";

function ClassPage() {
    const { id } = useParams();
    const [classData, setClassData] = useState(null);

    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newStudentName, setNewStudentName] = useState("");
    const [newStudentMatricula, setNewStudentMatricula] = useState("");

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
            <div className="container mt-4">
                <h2>Matéria: {classData.nome}</h2>
                <p>Aqui você poderá gerenciar a turma.</p>

                <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
                    + Adicionar Aluno
                </button>

                <h3 className="mt-4">Alunos</h3>
                <ul className="list-group">
                    {students.map((student) => (
                        <li key={student._id} className="list-group-item">
                            {student.nome} - {student.matricula}
                        </li>
                    ))}
                </ul>
            </div>

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
        </Layout>
    );
}

export default ClassPage;