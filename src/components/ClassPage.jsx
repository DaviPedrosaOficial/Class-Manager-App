import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./Layout";

function ClassPage() {
    const { id } = useParams();
    const [classData, setClassData] = useState(null);

    useEffect(() => {
        async function fetchClass() {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:3000/api/classes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error("Erro da API:", data);
                    return;
                }

                setClassData(data);

            } catch (error) {
                console.error("Erro na requisição:", error);
            }
        }

        fetchClass();
    }, [id]);

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
                <h2>{classData.nome}</h2>
                <p>Aqui você poderá gerenciar a turma.</p>
            </div>
        </Layout>
    );
}

export default ClassPage;