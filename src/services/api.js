const API_URL = "http://localhost:3000/api";

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) { // Verifica se a resposta não foi bem-sucedida, ou seja, se o status code não está na faixa 200-299
            throw new Error(data.message || "Erro desconhecido"); // Lança um erro com a mensagem retornada pelo backend ou uma mensagem genérica
        }

        return data;

    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};