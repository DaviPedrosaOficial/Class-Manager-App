import User from "../models/User.js";

export const registerUser = async (req, res) => {
    try {
        const { nome, email, password } = req.body;

        if (!nome || !email || !password) {
            return res.status(400).json({ message: "Preencha todos os campos para continuar." });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "E-mail já cadastrado. Por favor, tente outro." });
        }

        const newUser = new User({nome, email, password});
        await newUser.save();

        res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Erro ao registrar usuário. Por favor, tente novamente." });
    }
};