import Class from "../models/Class.js";

export const getClasses = async (req, res) => {
    try {
        const classes = await Class.find({ 
            userId: req.user.userId,
            institutionId: req.params.id
        });
        res.json(classes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar turmas" });
    }
};

export const createClass = async (req, res) => {
    try {
        const { materia, nomeTurma, turno, atividades, mediaMinima, institutionId } = req.body;

        if (!materia || !nomeTurma || !turno) {
            return res.status(400).json({ message: "Dados da turma incompletos" });
        }

        if (!mediaMinima){
            return res.status(400).json({ message: "Informe a média mínima" });
        }

        if (!institutionId) {
            return res.status(400).json({ message: "institutionId é obrigatório" });
        }

        const newClass = await Class.create({
            materia,
            nomeTurma,
            turno,
            atividades,
            mediaMinima,
            institutionId,
            userId: req.user.userId
        });

        res.status(201).json(newClass);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar turma" });
    }
};

export const getClassById = async (req, res) => {
    try {
        const classData = await Class.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!classData) {
            return res.status(404).json({ message: "Turma não encontrada" });
        }

        res.json(classData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar turma" });
    }
};

export const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        await Class.findByIdAndDelete(id);

        res.json({ message: "Turma deletada com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: `Erro ao deletar a turma. Erro: ${error}` });
    }
}

export const updateClass = async (req, res) => {
    try {
        const { Id } = req.params;

        const updated = await Class.findByIdAndUpdate(
            Id,
            req.body,
            { new: true }
        );

        res.json(updated);
        
    } catch (error) {
        res.status(500).json({ message: `Erro ao atualizar a turma. Erro: ${error}` });
    }
}