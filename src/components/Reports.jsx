import Layout from "./Layout";
import { useState, useEffect } from "react";
import { api } from '../services/api'
import { toast } from "react-toastify";

function Reports() {

    const [classes, setClasses] = useState([]);
    const [average, setAverage] = useState();
    const [studentsAtRisk, setStudentsAtRisk] = useState();

    useEffect(() => {

        async function fetchData() {
            try {
                const data = await api.get("/classes");
                console.log(data);

                const report = data.reduce((accumulator, currentClass) => {

                    currentClass.students.forEach((student) => {

                        // ignorando alunos que não tem nota
                        if (!student.grades?.length) return;

                        const somaNotas = student.grades.reduce(
                            (acc, grade) => acc + grade.nota,
                            0
                        );

                        const somaPesos = student.grades.reduce(
                            (acc, grade) => {

                                const atividade = currentClass.atividades.find(
                                    (atividade) =>
                                        atividade._id.toString() ===
                                        grade.atividadeId.toString()
                                );

                                return acc + (atividade?.peso || 0);

                            },
                            0
                        );

                        const mediaAluno = somaPesos > 0 ? (somaNotas / somaPesos) * 100 : 0;

                        accumulator.totalMedia += mediaAluno;

                        accumulator.totalAlunos++;

                        // alunos em risco
                        if (mediaAluno < currentClass.mediaMinima) {
                            accumulator.alunosRisco++;
                        }
                    });

                    return accumulator
                }, {
                    totalMedia: 0,
                    totalAlunos: 0,
                    alunosRisco: 0
                })

                report.totalMedia;
                report.totalAlunos;
                report.alunosRisco;

                const mediaGeral = report.totalAlunos > 0 ? report.totalMedia / report.totalAlunos : 0;
                const alunosEmRisco = report.alunosRisco;

                setClasses(data);
                setAverage(mediaGeral);
                setStudentsAtRisk(alunosEmRisco);


            } catch (error) {
                toast.error("Erro ao buscar os dados!");
            }
        }

        fetchData();

    }, []);

    return (
        <>
            <Layout>

                {/* HEADER */}
                <div className="mb-5 text-center">
                    <h1 className="display-4 fw-bold main-title">
                        Meus Relatórios
                    </h1>

                    <p className="text-muted fs-5">
                        Acompanhe o desempenho de suas instituições e matérias
                    </p>
                </div>

                {/* CARDS RESUMO */}
                <div className="row g-4 mb-5">

                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body text-center">

                                <h6 className="text-muted">
                                    Total de Turmas
                                </h6>

                                <h2 className="fw-bold">
                                    {classes.length}
                                </h2>

                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body text-center">

                                <h6 className="text-muted">
                                    Média Geral
                                </h6>

                                <h2 className="fw-bold text-success">
                                    {average?.toFixed(1)}%
                                </h2>

                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body text-center">

                                <h6 className="text-muted">
                                    Alunos em Risco
                                </h6>

                                <h2 className="fw-bold text-danger">
                                    {studentsAtRisk}
                                </h2>

                            </div>
                        </div>
                    </div>

                </div>

                {/* RELATÓRIOS POR INSTITUIÇÃO */}
                <div className="mb-5">

                    <h3 className="fw-bold mb-4">
                        📚 Relatórios por Instituição
                    </h3>

                    <div className="row g-4">

                        <div className="col-md-6">

                            <div className="card shadow-sm border-0 h-100">

                                <div className="card-body">

                                    <h4 className="fw-bold mb-3">
                                        Instituição X
                                    </h4>

                                    <p className="mb-2">
                                        <strong>Média Geral:</strong> 74%
                                    </p>

                                    <p className="mb-2">
                                        <strong>Turmas:</strong> 5
                                    </p>

                                    <p className="mb-0">
                                        <strong>Alunos em risco:</strong> 12
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* RELATÓRIOS POR MATÉRIA */}
                <div className="mb-5">

                    <h3 className="fw-bold mb-4">
                        📘 Relatórios por Matéria
                    </h3>

                    <div className="row g-4">

                        <div className="col-md-6">

                            <div className="card shadow-sm border-0 h-100">

                                <div className="card-body">

                                    <h4 className="fw-bold mb-3">
                                        Cálculo
                                    </h4>

                                    <p className="mb-2">
                                        <strong>Média Geral:</strong> 61%
                                    </p>

                                    <p className="mb-2">
                                        <strong>Reprovação:</strong> 18%
                                    </p>

                                    <p className="mb-0">
                                        <strong>Desempenho:</strong> Regular
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </Layout>

        </>
    )
}

export default Reports;