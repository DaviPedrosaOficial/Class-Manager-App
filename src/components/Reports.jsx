import Layout from "./Layout";
import { useState, useEffect } from "react";
import { api } from '../services/api'
import { toast } from "react-toastify";

function Reports() {

    const [classes, setClasses] = useState([]);
    const [average, setAverage] = useState();
    const [studentsAtRisk, setStudentsAtRisk] = useState();

    const [institutionReports, setInstitutionReports] = useState({});
    const [subjectReports, setSubjectReports] = useState({});

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

                const institutionReports = {};

                data.forEach((currentClass) => {

                    const institutionName =
                        currentClass.institutionId?.nome || "Instituição";

                    // cria instituição se não existir
                    if (!institutionReports[institutionName]) {

                        institutionReports[institutionName] = {
                            totalMedia: 0,
                            totalAlunos: 0,
                            alunosRisco: 0,
                            turmas: 0,
                            mediaMinima: currentClass.mediaMinima
                        };
                    }

                    institutionReports[institutionName].turmas++;

                    currentClass.students.forEach((student) => {

                        if (!student.grades?.length) return;

                        const somaNotas = student.grades.reduce(
                            (acc, grade) => acc + grade.nota,
                            0
                        );

                        const somaPesos = student.grades.reduce(
                            (acc, grade) => {

                                const atividade =
                                    currentClass.atividades.find(
                                        (atividade) =>
                                            atividade._id.toString() ===
                                            grade.atividadeId.toString()
                                    );

                                return acc + (atividade?.peso || 0);

                            },
                            0
                        );

                        const mediaAluno =
                            somaPesos > 0
                                ? (somaNotas / somaPesos) * 100
                                : 0;

                        institutionReports[institutionName].totalMedia += mediaAluno;

                        institutionReports[institutionName].totalAlunos++;

                        if (mediaAluno < currentClass.mediaMinima) {

                            institutionReports[institutionName].alunosRisco++;
                        }
                    });
                });

                const subjectReports = {};

                data.forEach((currentClass) => {

                    const subjectName =
                        currentClass.materia || "Matéria";

                    if (!subjectReports[subjectName]) {

                        subjectReports[subjectName] = {
                            totalMedia: 0,
                            totalAlunos: 0,
                            alunosRisco: new Set(),
                            turmas: 0,
                            mediaMinima: currentClass.mediaMinima
                        };
                    }

                    subjectReports[subjectName].turmas++;

                    currentClass.students.forEach((student) => {

                        if (!student.grades?.length) return;

                        const somaNotas = student.grades.reduce(
                            (acc, grade) => acc + grade.nota,
                            0
                        );

                        const somaPesos = student.grades.reduce(
                            (acc, grade) => {

                                const atividade =
                                    currentClass.atividades.find(
                                        (atividade) =>
                                            atividade._id.toString() ===
                                            grade.atividadeId.toString()
                                    );

                                return acc + (atividade?.peso || 0);

                            },
                            0
                        );

                        const mediaAluno =
                            somaPesos > 0
                                ? (somaNotas / somaPesos) * 100
                                : 0;

                        subjectReports[subjectName].totalMedia += mediaAluno;

                        subjectReports[subjectName].totalAlunos++;

                        if (
                            mediaAluno <
                            currentClass.mediaMinima
                        ) {

                            subjectReports[subjectName].alunosRisco.add(student._id.toString());
                        }
                    });
                });

                report.totalMedia;
                report.totalAlunos;
                report.alunosRisco;

                const mediaGeral = report.totalAlunos > 0 ? report.totalMedia / report.totalAlunos : 0;
                const alunosEmRisco = report.alunosRisco;

                setClasses(data);
                setAverage(mediaGeral);
                setStudentsAtRisk(alunosEmRisco);
                setInstitutionReports(institutionReports);
                setSubjectReports(subjectReports);

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

                        {
                            Object.entries(institutionReports).map(
                                ([institutionName, report]) => {

                                    const media =
                                        report.totalAlunos > 0
                                            ? report.totalMedia / report.totalAlunos
                                            : 0;

                                    const mediaColor =
                                        media >= report.mediaMinima
                                            ? "text-success"
                                            : "text-danger";

                                    const riskColor =
                                        report.alunosRisco === 0
                                            ? "text-success"
                                            : "text-danger";

                                    return (

                                        <div
                                            className="col-md-6"
                                            key={institutionName}
                                        >

                                            <div className="card shadow-sm border-0 h-100">

                                                <div className="card-body">

                                                    <h4 className="fw-bold mb-3">
                                                        {institutionName}
                                                    </h4>

                                                    <p className="mb-2">
                                                        <strong>Média Geral:</strong>{" "}

                                                        <span className={mediaColor}>
                                                            {media.toFixed(1)}%
                                                        </span>
                                                    </p>

                                                    <p className="mb-2">
                                                        <strong>Turmas:</strong>{" "}
                                                        {report.turmas}
                                                    </p>

                                                    <p className="mb-0">
                                                        <strong>Alunos em risco:</strong>{" "}

                                                        <span className={riskColor}>
                                                            {report.alunosRisco}
                                                        </span>
                                                    </p>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )
                        }

                    </div>

                </div>

                {/* RELATÓRIOS POR MATÉRIA */}
                <div className="mb-5">

                    <h3 className="fw-bold mb-4">
                        📘 Relatórios por Matéria
                    </h3>

                    <div className="row g-4">

                        {
                            Object.entries(subjectReports).map(
                                ([subjectName, report]) => {

                                    const media =
                                        report.totalAlunos > 0
                                            ? report.totalMedia / report.totalAlunos
                                            : 0;

                                    const mediaColor =
                                        media >= report.mediaMinima
                                            ? "text-success"
                                            : "text-danger";

                                    const riskColor =
                                        report.alunosRisco.size === 0
                                            ? "text-success"
                                            : "text-danger";

                                    const desempenho =
                                        media >= 80
                                            ? "Excelente"
                                            : media >= 70
                                                ? "Bom"
                                                : media >= 60
                                                    ? "Regular"
                                                    : "Crítico";

                                    return (

                                        <div
                                            className="col-md-6"
                                            key={subjectName}
                                        >

                                            <div className="card shadow-sm border-0 h-100">

                                                <div className="card-body">

                                                    <h4 className="fw-bold mb-3">
                                                        {subjectName}
                                                    </h4>

                                                    <p className="mb-2">
                                                        <strong>Média Geral:</strong>{" "}

                                                        <span className={mediaColor}>
                                                            {media.toFixed(1)}%
                                                        </span>
                                                    </p>

                                                    <p className="mb-2">
                                                        <strong>Turmas:</strong>{" "}
                                                        {report.turmas}
                                                    </p>

                                                    <p className="mb-2">
                                                        <strong>Alunos em risco:</strong>{" "}

                                                        <span className={riskColor}>
                                                            {report.alunosRisco.size}
                                                        </span>
                                                    </p>

                                                    <p className="mb-0">
                                                        <strong>Desempenho:</strong>{" "}
                                                        {desempenho}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )
                        }

                    </div>

                </div>

            </Layout>

        </>
    )
}

export default Reports;