import Institution from "../models/Institution.js";

export const getInstitution = async (req, res) => {
    try {
        const institutions = await Institution.find({
            userId: req.user.userId
        });

        res.json(institutions)
    } catch (error){
        res.status(500).json({ message: ` Erro ao buscar as instituições. Erro: ${error} ` });
    }
};

export const createInstitution =  async (req, res) => {
    try {
        const { nome } = req.body;
        const { matriz } = req.body;

        const institution = await Institution.create({
            nome,
            matriz,
            userId: req.user.userId
        });

        res.status(201).json(institution);
    } catch (error){
        res.status(500).json({ message: `Erro ao criar a instituição. Error: ${error} ` })
    }
};

export const getInstitutionById = async (req, res) => {
    try {
        const institution = await Institution.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!institution) {
            return res.status(404).json({ message: "Instituição não encontrada" });
        }

        res.json(institution);
    } catch (error) {
        res.status(500).json({ message: `Erro ao buscar instituição. Error: ${error}` });
    }
};

export const updateInstitution = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, matriz } = req.body;

        const updated = await Institution.findByIdAndUpdate(
            id,
            { 
                nome,
                matriz 
            },
            { new: true }
        );

        res.json(updated);
    
    } catch (error) {
        res.status(500).json({ message: `Erro ao atualizar a instituição. Erro: ${error}` });
    }
};

export const deleteInstitution = async (req, res) => {
    try {
        const { id } = req.params;

        await Institution.findByIdAndDelete(id);

        res.json({ message: "Instituição deletada com sucesso!" })
    
    } catch (error) {
        res.status(500).json({ message: `Erro ao deletar a instituição. Erro: ${error}` });
    }
};