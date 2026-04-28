import Class from "../models/Classes.js";

export const getClasses = async (req, res) => {
    try {
        const classes = await Class.find({ userId: req.user._id });
        res.json(classes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar turmas" });
    }
};

export const createClass = async (req, res) => {
    try {
        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({ message: "O nome da turma é obrigatório" });
        }

        const newClass = await Class.create({
            nome,
            userId: req.user.userId
        });

        res.status(201).json(newClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar turma" });
    }
};