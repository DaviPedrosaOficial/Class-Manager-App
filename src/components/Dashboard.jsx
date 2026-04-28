import Layout from "./Layout";
import { useEffect, useState } from "react";

function Dashboard() {

    const [classes, setClasses] = useState([]);

    useEffect(() => {
        async function fetchClasses() {
            const token = localStorage.getItem("token");

            if (!token) {
                console.log("Sem token!");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/api/classes", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error("Erro da API:", data);
                    return;
                }

                setClasses(data);

            } catch (error) {
                console.error("Erro na requisição:", error);
            }
        }

        fetchClasses();
    }, []);

    async function handleCreateClass() {
        const nome = prompt("Digite o nome da nova turma:");

        if (!nome) {
            alert("O nome da turma é obrigatório!");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:3000/api/classes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ nome })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Erro da API:", data.message);
                return;
            }

            setClasses((prev) => [...prev, data]);

        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    }

    return (
        <Layout>
            <div className="mb-4">
                <h1 className="display-5">Dashboard</h1>
                <p className="text-muted">Gerencie suas turmas</p>
            </div>

            <button className="btn btn-primary mb-4" onClick={handleCreateClass}>
                + Nova Turma
            </button>

            <div className="card">
                <div className="card-body">

                    {classes.length === 0 ? (
                        <p className="text-muted">Nenhuma turma criada</p>
                    ) : (
                        <ul className="list-group">
                            {classes.map((c) => (
                                <li key={c._id} className="list-group-item">
                                    {c.nome}
                                </li>
                            ))}
                        </ul>
                    )}

                </div>
            </div>
        </Layout>
    )
}

export default Dashboard;