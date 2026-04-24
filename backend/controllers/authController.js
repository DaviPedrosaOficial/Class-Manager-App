import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateUser = async (req, res) => {

    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Preencha todos os campos para continuar." });
        }

        const userExists = await User.findOne({ email });

        if (!userExists) {
            return res.status(400).json({ message: "E-mail ou senha incorretos." });
        }

        const passwordMatch = await bcrypt.compare(password, userExists.password);

        if (!passwordMatch){
            return res.status(400).json({ message: "E-mail ou senha incorretos." });
        }

        const token = jwt.sign({ userId: userExists._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ message: "Login bem-sucedido!", token });

    } catch (error) {
        console.error("Error authenticating user:", error);
        res.status(500).json({ message: "Erro ao autenticar usuário. Por favor, tente novamente." });
    }
}